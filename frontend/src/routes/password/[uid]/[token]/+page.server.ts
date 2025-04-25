import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types.js";
import { env } from "$env/dynamic/private";
import { type } from "arktype";
import { formatErrorMessages } from "$lib/errorFormatUtils.js";

const NewPasswordSchema = type({
  uid: "string",
  token: "string",
  new_password: "string >= 8",
  re_new_password: "string >= 8",
});

export const actions = {
  default: async ({ cookies, request, url }) => {
    //Validate form
    const data = Object.fromEntries((await request.formData()).entries());
    const registerForm = NewPasswordSchema(data);
    if (registerForm instanceof type.errors) {
      //Esto no debería ocurrir nunca
      return fail(400, { error: { all: "Problema de validación" } });
    }

    if (registerForm.new_password != registerForm.re_new_password) {
      return fail(400, { error: { password: "Las contraseñas no coinciden" } });
    }

    try {
      // Send request for login
      const response = await fetch(
        env.API_URI + "/auth/users/reset_password_confirm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerForm),
        }
      );

      if (!response.ok) {
        return fail(response.status, {
          error: formatErrorMessages(await response.json()),
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      return fail(500, { error: "No se pudo conectar al servidor" });
    }
    //Redirect with email, deletes cookie in case an account was already logged on
    throw redirect(302, "/?reset=true");
  },
} satisfies Actions;
