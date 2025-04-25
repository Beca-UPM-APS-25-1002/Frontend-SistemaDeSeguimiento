import { env } from "$env/dynamic/private";
import { getSeguimientosAPI, getDocenciaAPI } from "$lib/APIUtils.js";
import type {
  Seguimiento,
  Docencia,
  UnidadDeTrabajo,
} from "$lib/interfaces.js";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { compareAcademicMonths } from "$lib/academicMonthUtils.js";

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    const docenciaId = params.docenciaId;

    // Fetch data in parallel
    const [seguimientosResponse, docenciaResponse] = await Promise.all([
      getSeguimientosAPI(fetch),
      getDocenciaAPI(fetch, docenciaId),
    ]);
    if (!docenciaResponse.ok) {
      error(404, {
        message: "Not found",
      });
    }

    let seguimientos = (await seguimientosResponse.json()) as Seguimiento[];
    const docencia = (await docenciaResponse.json()) as Docencia;

    // Fetch temario using the modulo id from docencia
    const temarioResponse = await getTemarioAPI(fetch, docencia.modulo.id);
    const unidadesDeTrabajo =
      (await temarioResponse.json()) as UnidadDeTrabajo[];

    // Filter and sort relevant seguimientos
    seguimientos = filterAndSortSeguimientos(seguimientos, docencia);

    return {
      seguimientos,
      unidadesDeTrabajo,
      docencia,
    };
  } catch (err: any) {
    if (err.status && err.status === 404) {
      error(404, {
        message: "Not found",
      });
    }

    return {
      seguimientos: [],
      unidadesDeTrabajo: [],
      docencia: undefined,
    };
  }
};

/**
 * Fetches temario (curriculum units) for a specific modulo
 */
async function getTemarioAPI(fetch: Function, moduloId: number) {
  return fetch(`${env.API_URI}/api/modulos/${moduloId}/temario/`, {
    method: "GET",
    headers: {
      "Content-": "application/json",
    },
  });
}

/**
 * Filters seguimientos related to the docencia and sorts by academic month in descending order,
 * accounting for academic years where September (month 9) comes before January (month 1)
 */
function filterAndSortSeguimientos(
  seguimientos: Seguimiento[],
  docencia: Docencia
): Seguimiento[] {
  return seguimientos
    .filter(
      (seguimiento) =>
        // Condition 1: Same docencia number
        seguimiento.docencia === docencia.id ||
        // Condition 2: Same grupo and modulo combination
        (seguimiento.grupo.id === docencia.grupo.id &&
          seguimiento.modulo.id === docencia.modulo.id)
    )
    .toSorted((a, b) => -compareAcademicMonths(b.mes, a.mes)); // Puts the most recent seguimiento first
}
