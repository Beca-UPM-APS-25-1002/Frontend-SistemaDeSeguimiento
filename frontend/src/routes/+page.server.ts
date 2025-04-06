import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.ts";
import { API_URI } from "$env/static/private";
import process from "process";

export const load: PageServerLoad = async ({ locals, url }) => {
  // If user is already logged in, redirect to home page
  if (locals.user) {
    throw redirect(302, "/seguimientos");
  }

  // Return the URL to redirect to after login (if specified)
  return {
    redirectTo: url.searchParams.get("redirectTo") ?? "/seguimientos",
  };
};

export const actions = {
  default: async ({ request, cookies, locals }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      return fail(400, { error: "Email y Contraseña son campos requeridos" });
    }

    try {
      const response = await fetch(API_URI + "/auth/token/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return fail(401, { error: "Credenciales invalidas" });
      }

      const result = await response.json();
      const token = result.token;

      // Set the auth token in cookies
      cookies.set("authToken", token, {
        path: "/",
        httpOnly: true, // Makes it accessible only to the server
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      // Redirect to the home page or a specified redirect URL
      throw redirect(302, "/");
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, { error: "Failed to connect to authentication server" });
    }
  },
} satisfies Actions;
