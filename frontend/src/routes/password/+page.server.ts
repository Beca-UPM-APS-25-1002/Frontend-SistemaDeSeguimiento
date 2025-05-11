import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types.js";
import { env } from "$env/dynamic/private";
import { type } from "arktype";
import { formatErrorMessages } from "$lib/utils/errorFormatUtils.js";

const NewPasswordEmailSchema = type({
  email: "string.email",
});

export const actions = {
  default: async ({ cookies, request, url }) => {
    //Validate form
    const data = Object.fromEntries((await request.formData()).entries());
    const registerForm = NewPasswordEmailSchema(data);
    if (registerForm instanceof type.errors) {
      //Esto no debería ocurrir nunca
      return fail(400, { error: { all: "Problema de validación" } });
    }

    try {
      // Send request for login
      const response = await fetch(
        env.API_URI + "/auth/users/reset_password/",
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
    return { success: true };
  },
} satisfies Actions;
