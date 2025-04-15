import { API_URI } from "$env/static/private";
import type { Docencia, Seguimiento } from "$lib/interfaces.js";
import type { PageServerLoad } from "../../../../$types.js";

export const load: PageServerLoad = async ({ params, fetch }) => {
  console.log(params);
  try {
    const responseSeguimientos = await fetch(
      API_URI + "/api/seguimientos/?mes=" + (Number(params.month) + 1),
      {
        method: "GET",
        headers: {
          "Content-": "application/json",
        },
      }
    );
    const seguimientos = (await responseSeguimientos.json()) as Seguimiento[];
    const responseDocencia = await fetch(
      API_URI + "/api/docencias/" + params.docenciaId + "/",
      {
        method: "GET",
        headers: {
          "Content-": "application/json",
        },
      }
    );
    const docencia = (await responseDocencia.json()) as Docencia;
    // Find the first seguimiento that matches either condition
    return {
      seguimiento: seguimientos.find(
        (seguimiento) =>
          // Condition 1: Same docencia number
          seguimiento.docencia === docencia.id ||
          // Condition 2: Same grupo and modulo combination
          (seguimiento.grupo.id === docencia.grupo.id &&
            seguimiento.modulo.id === docencia.modulo.id)
      ),
    };
  } catch (error) {
    console.log(error);
    return { seguimiento: undefined };
  }
};
