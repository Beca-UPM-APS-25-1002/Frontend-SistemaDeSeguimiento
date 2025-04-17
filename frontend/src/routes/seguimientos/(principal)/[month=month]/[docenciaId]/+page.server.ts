import { API_URI } from "$env/static/private";
import type {
  Docencia,
  Seguimiento,
  UnidadDeTrabajo,
} from "$lib/interfaces.js";
import { type } from "arktype";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    const month = Number(params.month) + 1;
    const docenciaId = params.docenciaId;

    // Fetch data in parallel
    const [seguimientosResponse, docenciaResponse] = await Promise.all([
      fetchSeguimientos(fetch, month),
      fetchDocencia(fetch, docenciaId),
    ]);
    if (!docenciaResponse.ok) {
      error(404, {
        message: "Not found",
      });
    }

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
    return {
      seguimientoActual,
      seguimientoAnterior,
      unidadesDeTrabajo,
      docencia,
    };
  } catch (err: any) {
    if (err.status && err.status === 404) {
      error(404, {
        message: "Not found",
      });
    }
    console.log("Load seguimiento: " + err);
    return {
      seguimientoActual: undefined,
      seguimientoAnterior: undefined,
      unidadesDeTrabajo: [],
      docencia: undefined,
    };
  }
};

/**
 * Fetches seguimientos for the specified month
 */
async function fetchSeguimientos(fetch: Function, month: number) {
  return fetch(`${API_URI}/api/seguimientos/`, {
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
    .toSorted((a, b) => a.mes - b.mes);
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
    console.log("Nothing");
    return { seguimientoActual, seguimientoAnterior };
  }

  if (sortedSeguimientos.length === 1) {
    console.log(sortedSeguimientos[0].mes + " - " + month);
    if (sortedSeguimientos[0].mes === month) {
      seguimientoActual = sortedSeguimientos[0];
    } else if (sortedSeguimientos[0].mes < month) {
      seguimientoAnterior = sortedSeguimientos[0];
    }
    return { seguimientoActual, seguimientoAnterior };
  }

  // We have at least 2 seguimientos
  if (sortedSeguimientos[0].mes === month) {
    seguimientoActual = sortedSeguimientos[0];
    seguimientoAnterior = sortedSeguimientos[1];
  } else if (sortedSeguimientos[0].mes < month) {
    seguimientoAnterior = sortedSeguimientos[0];
  }

  return { seguimientoActual, seguimientoAnterior };
}

const SeguimientoSchema = type({
  "id?": "string",
  ultimo_contenido_impartido: "string",
  estado: "'AL_DIA'|'ATRASADO'|'ADELANTADO'",
  "justificacion_estado?": "string",
  cumple_programacion: type("string")
    .pipe((value) => value === "on")
    .pipe(type("boolean"))
    .default(""),
  "justificacion_cumple_programacion?": "string",
  mes: type("string")
    .pipe((value) => Number(value))
    .pipe(type("number > 0").pipe(type("number <= 12"))),
  evaluacion: "'PRIMERA'|'TERCERA'|'SEGUNDA'",
  temario_actual: "string",
  docencia: "string",
});

export const actions: Actions = {
  new: async ({ request, fetch }) => {
    const data = Object.fromEntries((await request.formData()).entries());
    const seguimientoData = SeguimientoSchema(data);
    if (seguimientoData instanceof type.errors) {
      // Esto no debería ocurrir
      console.error(seguimientoData.summary);
      return fail(400, { error: "Error de validación" });
    }
    try {
      const response = await fetch(`${API_URI}/api/seguimientos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seguimientoData),
      });
      if (!response.ok) {
        console.error(response);
        return fail(response.status, {
          error: (await response.json()).detail,
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Seguimiento submission error:", error);
      return fail(500, { error: "No se pudo conectar al servidor" });
    }
  },
  update: async ({ request, fetch }) => {
    // Update only happens when id exists
    console.log("Updating...");
    const data = Object.fromEntries((await request.formData()).entries());
    const seguimientoData = SeguimientoSchema(data);
    console.log(JSON.stringify(seguimientoData));
    if (seguimientoData instanceof type.errors) {
      // Esto no debería ocurrir
      console.error(seguimientoData.summary);
      return fail(400, { error: "Error de validación" });
    }
    try {
      const response = await fetch(
        `${API_URI}/api/seguimientos/${seguimientoData.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(seguimientoData),
        }
      );
      if (!response.ok) {
        return fail(response.status, {
          error: (await response.json()).detail,
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Seguimiento submission error:", error);
      return fail(500, { error: "No se pudo conectar al servidor" });
    }
  },
};
