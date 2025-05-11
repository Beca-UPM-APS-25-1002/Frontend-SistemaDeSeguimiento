import {
  getDocenciasAPI,
  getSeguimientosFaltantesAño,
} from "$lib/utils/APIUtils.js";
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
