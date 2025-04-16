import { API_URI } from "$env/static/private";
import type {
  Docencia,
  Seguimiento,
  UnidadDeTrabajo,
} from "$lib/interfaces.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    const month = Number(params.month) + 1;
    const docenciaId = params.docenciaId;

    // Fetch data in parallel
    const [seguimientosResponse, docenciaResponse] = await Promise.all([
      fetchSeguimientos(fetch, month),
      fetchDocencia(fetch, docenciaId),
    ]);

    const seguimientos = (await seguimientosResponse.json()) as Seguimiento[];
    const docencia = (await docenciaResponse.json()) as Docencia;

    // Fetch temario using the modulo id from docencia
    const temarioResponse = await fetchTemario(fetch, docencia.modulo.id);
    const unidadesDeTrabajo =
      (await temarioResponse.json()) as UnidadDeTrabajo[];

    // Filter and sort relevant seguimientos
    const filteredSeguimientos = filterAndSortSeguimientos(
      seguimientos,
      docencia
    );
    // Determine current and previous seguimientos
    const { seguimientoActual, seguimientoAnterior } = determineSeguimientos(
      filteredSeguimientos,
      month
    );
    console.log("-------ACTUAL-------");
    console.log(seguimientoActual);
    console.log("------ANTERIOR--------");
    console.log(seguimientoAnterior);
    console.log("------TEMARIO--------");
    console.log(unidadesDeTrabajo);
    console.log("----------------------");
    return {
      seguimientoActual,
      seguimientoAnterior,
      unidadesDeTrabajo,
    };
  } catch (error) {
    console.log("Load seguimiento: " + error);
    return {
      seguimientoActual: undefined,
      seguimientoAnterior: undefined,
      unidadesDeTrabajo: [],
    };
  }
};

/**
 * Fetches seguimientos for the specified month
 */
async function fetchSeguimientos(fetch: Function, month: number) {
  return fetch(`${API_URI}/api/seguimientos/?mes=${month}`, {
    method: "GET",
    headers: {
      "Content-": "application/json",
    },
  });
}

/**
 * Fetches a specific docencia by ID
 */
async function fetchDocencia(fetch: Function, docenciaId: string) {
  return fetch(`${API_URI}/api/docencias/${docenciaId}/`, {
    method: "GET",
    headers: {
      "Content-": "application/json",
    },
  });
}

/**
 * Fetches temario (curriculum units) for a specific modulo
 */
async function fetchTemario(fetch: Function, moduloId: number) {
  return fetch(`${API_URI}/api/modulos/${moduloId}/temario/`, {
    method: "GET",
    headers: {
      "Content-": "application/json",
    },
  });
}

/**
 * Filters seguimientos related to the docencia and sorts by descending month
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
    .toSorted((a, b) => b.mes - a.mes);
}

/**
 * Determines which seguimientos are current and previous based on the month
 */
function determineSeguimientos(
  sortedSeguimientos: Seguimiento[],
  month: number
) {
  let seguimientoActual: Seguimiento | undefined = undefined;
  let seguimientoAnterior: Seguimiento | undefined = undefined;

  if (sortedSeguimientos.length === 0) {
    return { seguimientoActual, seguimientoAnterior };
  }

  if (sortedSeguimientos.length === 1) {
    if (sortedSeguimientos[0].mes === month) {
      seguimientoActual = sortedSeguimientos[0];
    } else {
      seguimientoAnterior = sortedSeguimientos[0];
    }
    return { seguimientoActual, seguimientoAnterior };
  }

  // We have at least 2 seguimientos
  if (sortedSeguimientos[0].mes === month) {
    seguimientoActual = sortedSeguimientos[0];
    seguimientoAnterior = sortedSeguimientos[1];
  } else {
    seguimientoAnterior = sortedSeguimientos[0];
  }

  return { seguimientoActual, seguimientoAnterior };
}
