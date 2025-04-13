import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.ts";
import { API_URI } from "$env/static/private";
import { type } from "arktype";
import process from "process";

const LoginSchema = type({
  email: "string.email",
  password: "string",
});

export const load: PageServerLoad = async ({ locals, url }) => {
  console.log(locals);
  if (locals.user) {
    throw redirect(302, "/seguimientos");
  }
};

export const actions = {
  default: async ({ cookies, request, url }) => {
    //Validate loginForm
    const data = Object.fromEntries((await request.formData()).entries());
    const loginForm = LoginSchema(data);
    if (loginForm instanceof type.errors) {
      //Esto no debería ocurrir nunca
      return fail(400, { error: "Email y/o contraseña incorrectos" });
    }

    try {
      // Send request for login
      const response = await fetch(API_URI + "/auth/token/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      if (!response.ok) {
        return fail(response.status, {
          error: "Email y/o contraseña incorrectos",
        });
      }

      const result = await response.json();
      const token = result.auth_token;

      // Set the auth token in cookies
      cookies.set("authToken", token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, { error: "No se pudo conectar al servidor" });
    }
    // Redirect to the home page or a specified redirect URL
    throw redirect(302, url.searchParams.get("redirectTo") ?? "/seguimientos");
  },
} satisfies Actions;
