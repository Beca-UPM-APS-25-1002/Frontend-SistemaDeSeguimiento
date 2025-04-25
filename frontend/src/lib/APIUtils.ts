import { env } from "$env/dynamic/private";
import type {
  Docencia,
  FetchSvelteKit,
  SeguimientosFaltantesPorMes,
} from "./interfaces.js";

/**
 * Returns all missing seguimientos for the current year and user
 * @param fetch Svelte kit fetch
 * @param year Current academic year
 * @returns
 */
export async function getSeguimientosFaltantesAño(
  fetch: FetchSvelteKit,
  year: string | null
): Promise<SeguimientosFaltantesPorMes> {
  if (!year) {
    return {};
  }
  try {
    const response = await fetch(
      `${env.API_URI}/api/seguimientos-faltantes-anual/${year}/`,
      {
        method: "GET",
        headers: {
          "Content-": "application/json",
        },
      }
    );
    const data = (await response.json()) as SeguimientosFaltantesPorMes;
    return data;
  } catch (error) {
    console.error("Seguimientos faltantes error:", error);
    return {};
  }
}
/**
 * Returns all missing seguimientos for the current year and month
 * @param fetch
 * @param year
 * @param month
 * @returns
 */
export async function getSeguimientosFaltantesMes(
  fetch: FetchSvelteKit,
  year: string | null,
  month: number
) {
  try {
    const response = await fetch(
      `${env.API_URI}/api/seguimientos-faltantes/${year}/${month}/?all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = (await response.json()) as Docencia[];
    return data;
  } catch (error) {
    console.error("Error seguimientos faltantes:", error);
    return [];
  }
}

/**
 * Returns all docencias of current user
 * @param fetch Svelte kit fetch
 * @returns
 */
export async function getDocenciasAPI(
  fetch: FetchSvelteKit
): Promise<Docencia[]> {
  try {
    const response = await fetch(env.API_URI + "/api/docencias/", {
      method: "GET",
      headers: {
        "Content-": "application/json",
      },
    });
    const data = (await response.json()) as Docencia[];
    return data;
  } catch (error) {
    console.error("Docencias error:" + error);
    return [];
  }
}

/**
 * Fetches seguimientos for the specified month
 * @param fetch Svelte Kit fetch
 */
export async function getSeguimientosAPI(fetch: Function) {
  return fetch(`${env.API_URI}/api/seguimientos/`, {
    method: "GET",
    headers: {
      "Content-": "application/json",
    },
  });
}

/**
 * Fetches a specific docencia by ID
 * @param fetch Svelte Kit fetch
 * @param docenciaId ID of the docencia
 */
export async function getDocenciaAPI(fetch: Function, docenciaId: string) {
  return fetch(`${env.API_URI}/api/docencias/${docenciaId}/`, {
    method: "GET",
    headers: {
      "Content-": "application/json",
    },
  });
}
