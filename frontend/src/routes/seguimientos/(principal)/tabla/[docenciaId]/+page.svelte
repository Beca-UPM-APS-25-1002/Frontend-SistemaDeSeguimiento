<script lang="ts">
  import { page } from "$app/state";
  import {
    faArrowLeft,
    faEye,
    faXmarkCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  const { data } = $props();

  const { docencia, seguimientos, unidadesDeTrabajo } = $derived(data);

  // Helper function to get month name
  function getMonthName(monthNumber: number) {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[monthNumber - 1];
  }

  // Helper function to get unidad de trabajo title by ID
  function getUnidadTitle(id: number) {
    const unidad = unidadesDeTrabajo.find((u) => u.id === id);
    return unidad
      ? `UT${unidad.numero_tema} - ${unidad.titulo}`
      : "No asignado";
  }

  // Function to determine status badge color
  function getStatusColor(estado: string): string {
    switch (estado) {
      case "AL_DIA":
        return "badge-success";
      case "ATRASADO":
        return "badge-error";
      case "ADELANTADO":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  }

  function getMotivo(motivo: string): string {
    switch (motivo) {
      case "CONTENIDOS":
        return "Cambio en los Contenidos";
      case "SECUENCIA":
        return "Cambio en la Secuenciación y distribución temporal de las UTs";
      case "ACTIVIDADES":
        return "Cambio en actividades";
      case "EVALUACION":
        return "Cambio en Evaluación";
      default:
        return "Motivo no encontrado";
    }
  }
</script>

{#if docencia}
  <div class="container mx-auto p-4">
    <div class="rounded-lg p-6">
      <div class="card bg-base-100 shadow-lg flex-row">
        <div class="card-body">
          <h2 class="card-title">Información del Módulo</h2>
          <div class="divider my-1"></div>
          <p>
            <span class="font-semibold">Módulo:</span>
            {docencia.modulo.nombre}
          </p>
          <p>
            <span class="font-semibold">Ciclo:</span>
            {docencia.modulo.ciclo.nombre}
          </p>
          <p>
            <span class="font-semibold">Año Académico:</span>
            {docencia.modulo.ciclo.año_academico}
          </p>
          <p>
            <span class="font-semibold">Grupo:</span>
            {docencia.grupo.nombre}
          </p>
        </div>
        <div class="card-body">
          <h2 class="card-title">Unidades De Trabajo</h2>
          <div class="divider my-1"></div>
          {#each unidadesDeTrabajo as unidad}
            <p>
              <span class="font-semibold">UT{unidad.numero_tema}</span>
              - {unidad.titulo}
            </p>{/each}
        </div>
      </div>
    </div>

    <div class="overflow-x-auto bg-base-100 p-4 rounded-lg shadow-xl">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Estado</th>
            <th>Unidades de Trabajo completadas</th>
            <th>Unidad de Trabajo actual</th>
            <th>Último Contenido</th>
            <th>Cumple Programación</th>
            <th>Evaluación</th>
            <th>Examinar</th>
          </tr>
        </thead>
        <tbody>
          {#if seguimientos.length === 0}
            <tr>
              <td colspan="7" class="text-center py-4"
                >No hay seguimientos disponibles para esta docencia</td
              >
            </tr>
          {:else}
            {#each seguimientos as seguimiento (seguimiento.id)}
              <tr>
                <td>{getMonthName(seguimiento.mes)}</td>
                <td>
                  <div class="badge {getStatusColor(seguimiento.estado)}">
                    {seguimiento.estado.replace("_", " ")}
                  </div>
                  {#if seguimiento.justificacion_estado}
                    <p class="text-sm italic mt-1">
                      Justificación: {seguimiento.justificacion_estado}
                    </p>
                  {/if}
                </td>
                <td>
                  <div class="badge badge-ghost">
                    {seguimiento.temario_completado.length} / {unidadesDeTrabajo.length}
                  </div>
                  <ul>
                    {#each seguimiento.temario_completado as idTema, i}
                      <li>
                        {getUnidadTitle(idTema)}
                      </li>
                    {/each}
                  </ul>
                </td>
                <td>{getUnidadTitle(seguimiento.temario_actual)}</td>
                <td>
                  <div
                    class="max-w-xs truncate"
                    title={seguimiento.ultimo_contenido_impartido}
                  >
                    {seguimiento.ultimo_contenido_impartido}
                  </div>
                </td>
                <td>
                  <div
                    class="badge {seguimiento.cumple_programacion
                      ? 'badge-success'
                      : 'badge-error'}"
                  >
                    {seguimiento.cumple_programacion ? "Sí" : "No"}
                  </div>
                  {#if seguimiento.motivo_no_cumple_programacion}
                    <p class="text-sm italic mt-1">
                      Motivo: {getMotivo(
                        seguimiento.motivo_no_cumple_programacion
                      )}
                    </p>{/if}
                  {#if seguimiento.justificacion_cumple_programacion}
                    <p class="text-sm italic mt-1">
                      Justificación: {seguimiento.justificacion_cumple_programacion}
                    </p>
                  {/if}
                </td>
                <td>
                  <div class="max-w-xs truncate" title={seguimiento.evaluacion}>
                    {seguimiento.evaluacion}
                  </div>
                </td>
                <td class="flex justify-center">
                  <a
                    class="btn btn-sm btn-outline btn-info"
                    title="Examinar"
                    href="/seguimientos/{seguimiento.mes}/{docencia.id}"
                  >
                    <Fa icon={faEye}></Fa>
                  </a>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
{:else}
  <h1 class="text-xl alert alert-error m-4 font-semibold">
    <Fa icon={faXmarkCircle}></Fa>
    Error <br />
    ¡No se ha podido cargar esta página!
  </h1>
{/if}
