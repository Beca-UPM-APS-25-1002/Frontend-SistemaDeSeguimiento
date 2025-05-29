import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types.js";
import { env } from "$env/dynamic/private";
import { type } from "arktype";

const RegisterSchema = type({
  nombre: "string.trim",
  email: type("string.email").pipe(type("string.trim")),
  password: "string >= 8",
  passwordRepeat: "string >= 8",
});

export const actions = {
  default: async ({ cookies, request, url }) => {
    //Validate form
    const data = Object.fromEntries((await request.formData()).entries());
    const registerForm = RegisterSchema(data);
    if (registerForm instanceof type.errors) {
      //Esto no debería ocurrir nunca
      return fail(400, { error: { all: "Problema de validación" } });
    }

    if (registerForm.password != registerForm.passwordRepeat) {
      return fail(400, { error: { password: "Las contraseñas no coinciden" } });
    }

    try {
      // Send request for login
      const response = await fetch(env.API_URI + "/auth/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerForm),
      });

      if (!response.ok) {
        console.error("Content sent back by server:", response);
        return fail(response.status, { error: await response.json() });
      }
    } catch (error) {
      console.error("Register error:", error);
      return fail(500, { error: { all: "No se pudo conectar al servidor" } });
    }
    //Redirect with email, deletes cookie in case an account was already logged on
    cookies.delete("authToken", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    throw redirect(302, "/?email=" + registerForm.email);
  },
} satisfies Actions;
