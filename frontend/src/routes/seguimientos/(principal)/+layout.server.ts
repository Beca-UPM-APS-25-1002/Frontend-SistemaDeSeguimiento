import { API_URI } from "$env/static/private";
import type {
  Docencia,
  FetchSvelteKit,
  SeguimientosFaltantesPorMes,
} from "$lib/interfaces.js";
import type { LayoutServerLoad } from "./$types.ts";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
  return {
    docencias: getDocenciasAPI(fetch),
    seguimientosFaltantes: getSeguimientosFaltantesAño(
      fetch,
      locals.current_year
    ),
  };
};

async function getDocenciasAPI(fetch: FetchSvelteKit): Promise<Docencia[]> {
  try {
    const response = await fetch(API_URI + "/api/docencias/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await response.json()) as Docencia[];
    return data;
  } catch {
    return [];
  }
}

async function getSeguimientosFaltantesAño(
  fetch: FetchSvelteKit,
  year: string | null
): Promise<SeguimientosFaltantesPorMes> {
  if (!year) {
    return {};
  }
  try {
    const response = await fetch(
      API_URI + "/api/seguimientos-faltantes-anual/" + year + "/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = (await response.json()) as SeguimientosFaltantesPorMes;
    return data;
  } catch {
    return {};
  }
}
