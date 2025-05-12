import { env } from "$env/dynamic/private";
import type {
  Docencia,
  Seguimiento,
  UnidadDeTrabajo,
} from "$lib/interfaces.js";
import { type } from "arktype";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";
import { getDocenciaAPI, getSeguimientosAPI } from "$lib/utils/APIUtils.js";
import { formatErrorMessages } from "$lib/utils/errorFormatUtils.js";
import {
  isInPastOrCurrentAcademicMonth,
  compareAcademicMonths,
} from "$lib/utils/academicMonthUtils.js";

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    const month = Number(params.month);
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

    const seguimientos = (await seguimientosResponse.json()) as Seguimiento[];
    const docencia = (await docenciaResponse.json()) as Docencia;

    // Fetch temario using the modulo id from docencia
    const temarioResponse = await getTemarioAPI(fetch, docencia.modulo.id);
    const unidadesDeTrabajo =
      (await temarioResponse.json()) as UnidadDeTrabajo[];

    // Filter and sort relevant seguimientos
    const filteredSeguimientos = filterAndSortSeguimientos(
      seguimientos,
      docencia,
      month
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

    return {
      seguimientoActual: undefined,
      seguimientoAnterior: undefined,
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
  docencia: Docencia,
  month: number
): Seguimiento[] {
  return seguimientos
    .filter(
      (seguimiento) =>
        // Condition 1: Same docencia number
        (seguimiento.docencia === docencia.id ||
          // Condition 2: Same grupo and modulo combination
          (seguimiento.grupo.id === docencia.grupo.id &&
            seguimiento.modulo.id === docencia.modulo.id)) &&
        // Uses only the seguimientos from the past and not the future
        // Accounting isInPastOrCurrentAcademicMonthfor academic year (September = 9 to August = 8)
        isInPastOrCurrentAcademicMonth(seguimiento.mes, month)
    )
    .toSorted((a, b) => compareAcademicMonths(b.mes, a.mes)); // Puts the most recent seguimiento first
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
  temario_completado: type("string[]").default(() => []),
  temario_actual: "string",
  docencia: "string",
});

export const actions: Actions = {
  new: async ({ request, fetch }) => {
    const data = Object.fromEntries(
      groupDuplicateKeys((await request.formData()).entries().toArray())
    );
    const seguimientoData = SeguimientoSchema(data);
    if (seguimientoData instanceof type.errors) {
      // Esto no debería ocurrir
      console.error(seguimientoData.summary);
      return fail(400, { error: "Error de validación" });
    }
    try {
      const response = await fetch(`${env.API_URI}/api/seguimientos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seguimientoData),
      });
      if (!response.ok) {
        return fail(response.status, {
          error: formatErrorMessages(await response.json()),
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

    const data = Object.fromEntries(
      groupDuplicateKeys((await request.formData()).entries().toArray())
    );
    const seguimientoData = SeguimientoSchema(data);

    if (seguimientoData instanceof type.errors) {
      // Esto no debería ocurrir
      console.error(seguimientoData.summary);
      return fail(400, { error: "Error de validación" });
    }
    try {
      const response = await fetch(
        `${env.API_URI}/api/seguimientos/${seguimientoData.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(seguimientoData),
        }
      );
      if (!response.ok) {
        console.error(response);
        return fail(response.status, {
          error: formatErrorMessages(await response.json()),
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Seguimiento submission error:", error);
      return fail(500, { error: "No se pudo conectar al servidor" });
    }
  },
};

/**
 * Groups duplicate keys in an array of string entry pairs using Map
 * @param entries An array of string key-value pairs
 * @returns A Map with grouped values
 */
function groupDuplicateKeys(
  entries: [string, FormDataEntryValue][]
): Map<string, FormDataEntryValue | FormDataEntryValue[]> {
  const result = new Map<string, FormDataEntryValue | FormDataEntryValue[]>();

  for (const [key, value] of entries) {
    if (!result.has(key)) {
      // First occurrence of this key
      result.set(key, value);
    } else {
      const existingValue = result.get(key);
      if (Array.isArray(existingValue)) {
        // Key already exists as an array, push the new value
        existingValue.push(value);
      } else {
        // Key exists but isn't an array yet, convert to array with both values
        result.set(key, [existingValue as string, value]);
      }
    }
  }

  return result;
}
