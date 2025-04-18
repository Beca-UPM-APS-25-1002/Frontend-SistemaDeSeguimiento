import { getSeguimientosFaltantesMes } from "$lib/APIUtils.js";
import type { LayoutServerLoad } from "../$types.js";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
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
