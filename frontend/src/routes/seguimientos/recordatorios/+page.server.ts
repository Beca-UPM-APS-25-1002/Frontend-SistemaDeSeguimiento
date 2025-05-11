import { getSeguimientosFaltantesMes } from "$lib/utils/APIUtils.js";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types.js";
import { env } from "$env/dynamic/private";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
  if (!locals.user?.is_admin) {
    //Redirect user if not admin
    throw redirect(302, "/seguimientos");
  }
  const month =
    Number(url.searchParams.get("month")) || new Date().getMonth() + 1;
  return {
    seguimientosFaltantes: getSeguimientosFaltantesMes(
      fetch,
      locals.current_year,
      month
    ),
  };
};

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const docencias = data.getAll("docencias");
    const mes = data.get("month_selector");
    if (!docencias || !mes) {
      return fail(400, { error: "No has seleccionado ninguna docencia" });
    }
    try {
      const response = await fetch(env.API_URI + "/api/enviar-recordatorios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mes, docencias }),
      });
      if (!response.ok) {
        console.error(response);
        return fail(400, { error: "Error al enviar los recordatorios" });
      }
      return { success: { n_emails: (await response.json()).emails_enviados } };
    } catch (error) {
      console.error(error);
      return fail(500, { error: "Error de conexión con el servidor" });
    }
  },
};
