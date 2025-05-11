<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import type { UnidadDeTrabajo } from "$lib/interfaces.js";
  import {
    faCheckCircle,
    faSave,
    faXmarkCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";

  const { data, form } = $props();
  let docenciaId = $derived(Number(page.params.docenciaId));
  let month = $derived(Number(page.params.month));

  // Create a set for completed units
  let completedUnits: number[] = $state([]);

  // Initialize completed units from data if available
  $effect(() => {
    console.log(data.seguimientoActual);
    if (data.seguimientoActual?.temario_completado) {
      completedUnits = data.seguimientoActual.temario_completado;
    } else if (data.seguimientoAnterior?.temario_completado) {
      completedUnits = data.seguimientoAnterior.temario_completado;
    } else {
      completedUnits = [];
    }
  });

  // Current selected unit for temario_actual
  let selectedTema: UnidadDeTrabajo | undefined = $derived(
    data.unidadesDeTrabajo.find(
      (value) => value.id === data.seguimientoActual?.temario_actual
    ) ||
      data.unidadesDeTrabajo.find(
        (value) => value.id === data.seguimientoAnterior?.temario_actual
      ) ||
      data.unidadesDeTrabajo[0] ||
      undefined
  );

  //Variable to bind to the cumple_programacion toggle
  let cumple_programacionValue: boolean | undefined = $derived(
    data.seguimientoActual?.cumple_programacion ?? true
  );

  // Function to handle clicking on a list item for checkboxes
  function toggleUnit(temaId: number) {
    if (completedUnits.includes(temaId)) {
      completedUnits.splice(completedUnits.indexOf(temaId), 1);
    } else {
      completedUnits.push(temaId);
    }
  }
</script>

<div>
  <h1 class="text-xl text-neutral font-semibold">
    Seguimiento para {data.docencia?.modulo.nombre} - {data.docencia?.grupo
      .nombre}
  </h1>
  <!--Message if the original profesor is not the current user-->
  {#if data.seguimientoActual && data.seguimientoActual?.profesor.id != data.user?.id}
    <div transition:slide>
      <p class="text-sm italic">
        Este seguimiento fue realizado originalmente por {data.seguimientoActual
          ?.profesor.nombre}
      </p>
    </div>
  {/if}
</div>
<div class="divider"></div>
<form
  method="POST"
  class="flex flex-wrap relative"
  use:enhance={() => {
    return async ({ update }) => {
      await update({ reset: false });
    };
  }}
>
  <!--hidden id when the seguimiento exists, so that it can be updated on the server-->
  <input
    type="number"
    name="id"
    hidden
    value={data.seguimientoActual ? data.seguimientoActual.id : ""}
  />
  <!--hidden month input to pass it in the form-->
  <input type="number" name="mes" hidden value={month} />
  <!--hidden month input to pass it in the form-->
  <input
    type="number"
    name="docencia"
    hidden
    value={data.seguimientoActual
      ? data.seguimientoActual.docencia
      : docenciaId}
  />

  <!-- Hidden inputs for completed units -->
  {#each Array.from(completedUnits) as completedUnitId}
    <input type="hidden" name="temario_completado" value={completedUnitId} />
  {/each}

  <!-- Container for the entire form with padding to create overall form margins if needed -->
  <div class="w-full flex flex-wrap">
    <!-- First column - use slightly less than half width to accommodate margins -->
    <div class="w-full md:w-[49%] mb-4 md:mb-0">
      <fieldset class="fieldset border border-base-300 p-4 rounded-box h-full">
        <!--Checkboxes to select completed units of work-->
        <legend class="fieldset-legend">Situación actual de la docencia</legend>
        <legend class="fieldset-legend"
          >Selecciona las unidades de trabajo que ya has completado:</legend
        >
        <ul class="steps steps-vertical">
          {#each data.unidadesDeTrabajo as tema}
            <li
              class="step {completedUnits.includes(tema.id)
                ? 'step-primary font-bold'
                : ''} clickable-step transition-all"
            >
              <!-- Hidden checkbox that will be part of the form submission -->
              <input
                type="checkbox"
                id={`tema-${tema.id}`}
                hidden
                value={tema.id}
                bind:group={completedUnits}
                name="temario_completado"
                checked={completedUnits.includes(tema.id)}
              />

              <!-- Label that contains the text -->
              <label for={`tema-${tema.id}`} class="text-lg">
                {tema.titulo}
              </label>

              <!-- Invisible overlay to make entire area clickable -->
              <span
                class="clickable-overlay"
                onclick={() => toggleUnit(tema.id)}
                onkeydown={(e) => e.key === "Enter" && toggleUnit(tema.id)}
                tabindex="0"
                role="checkbox"
                aria-checked={completedUnits.includes(tema.id)}
              ></span>
            </li>
          {/each}
        </ul>

        <!-- Select for temario_actual -->
        <legend class="fieldset-legend"
          >Unidad de trabajo que estás impartiendo actualmente</legend
        >
        <select
          name="temario_actual"
          class="select select-bordered mt-2"
          value={selectedTema ? selectedTema.id : ""}
          required
        >
          <option disabled selected value="">Selecciona la unidad actual</option
          >
          {#each data.unidadesDeTrabajo as tema}
            <option value={tema.id}>{tema.titulo}</option>
          {/each}
        </select>

        <!-- Select current evaluation/trimestre-->
        <legend class="fieldset-legend">Evaluación</legend>
        <select
          name="evaluacion"
          class="select"
          value={data.seguimientoActual
            ? data.seguimientoActual.evaluacion
            : ""}
          required
        >
          <option disabled selected value="">Elige la evaluación actual</option>
          <option value="PRIMERA">Primera</option>
          <option value="SEGUNDA">Segunda</option>
          <option value="TERCERA">Tercera</option>
        </select>
        <!--Text area for Ultimo contenido impartido-->
        <legend class="fieldset-legend">Último contenido impartido</legend>
        <textarea
          name="ultimo_contenido_impartido"
          class="textarea h-24"
          placeholder={data.seguimientoAnterior?.ultimo_contenido_impartido
            ? `En el seguimiento anterior indicaste: ${data.seguimientoAnterior.ultimo_contenido_impartido}`
            : "Último contenido impartido"}
          required
          >{data.seguimientoActual?.ultimo_contenido_impartido}</textarea
        >
      </fieldset>
    </div>

    <!-- Spacer div to create margin between columns -->
    <div class="hidden md:block md:w-[2%]"></div>

    <!-- Right column - use slightly less than half width to accommodate margins -->
    <div class="w-full md:w-[49%] flex flex-col">
      <!-- Second fieldset for status -->
      <fieldset class="fieldset border border-base-300 p-4 rounded-box mb-4">
        <legend class="fieldset-legend">Estado de la programación</legend>
        <!-- Select status of seguimiento-->
        <legend class="fieldset-legend">Estado actual</legend>
        <select
          name="estado"
          class="select"
          value={data.seguimientoActual ? data.seguimientoActual.estado : ""}
          required
        >
          <option disabled selected value="">Elige el estado actual</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="AL_DIA">Al Día</option>
          <option value="ADELANTADO">Adelantado</option>
        </select>
        <!--Text area for Ultimo contenido impartido-->
        <legend class="fieldset-legend">Justificación del estado actual</legend>
        <textarea
          name="justificacion_estado"
          id="justificacion_estado"
          class="textarea h-24"
          placeholder={data.seguimientoAnterior?.justificacion_estado
            ? `En el seguimiento anterior indicaste: ${data.seguimientoAnterior.justificacion_estado}`
            : "Justificación del estado actual"}
          >{data.seguimientoActual?.justificacion_estado}</textarea
        >
        <label for="justificacion_estado" class="fieldset-label">Opcional</label
        >
      </fieldset>

      <!-- Third fieldset for programming status-->
      <fieldset class="fieldset border border-base-300 p-4 rounded-box">
        <legend class="fieldset-legend">Cumplimiento de la programación</legend>
        <!-- Toggle for following programming-->
        <legend class="fieldset-legend">Cumple la programación</legend>
        <input
          name="cumple_programacion"
          type="checkbox"
          bind:checked={cumple_programacionValue}
          class="checkbox bg-transparent border-neutral checked:bg-primary checked:text-neutral checked:border-neutral"
        />

        <!--Text area for Ultimo contenido impartido-->
        <legend class="fieldset-legend"
          >Justificación de que no cumpla la programación</legend
        >
        <textarea
          name="justificacion_cumple_programacion"
          id="justificacion_cumple_programacion"
          class="textarea h-24"
          placeholder={data.seguimientoAnterior
            ?.justificacion_cumple_programacion
            ? `En el seguimiento anterior indicaste: ${data.seguimientoAnterior.justificacion_cumple_programacion}`
            : "Justificación de que no cumpla la programación"}
          disabled={cumple_programacionValue}
          >{data.seguimientoActual?.justificacion_cumple_programacion}</textarea
        >
        <label for="justificacion_cumple_programacion" class="fieldset-label"
          >Opcional</label
        >
      </fieldset>
    </div>
    {#if form?.error}
      <div role="alert" class="alert alert-error w-full mt-4" transition:slide>
        <Fa icon={faXmarkCircle}></Fa>
        <span>{form?.error}</span>
      </div>
    {/if}
    {#if form?.success}
      <div
        role="alert"
        class="alert alert-success w-full mt-4"
        transition:slide
      >
        <Fa icon={faCheckCircle}></Fa>
        <span>Guardado correctamente.</span>
      </div>
    {/if}
    <!--Submit button-->
    <div class="w-full flex justify-end mt-4">
      {#if data.seguimientoActual}
        <button formaction="?/update" class="btn btn-primary"
          ><Fa icon={faSave}></Fa>Guardar cambios</button
        >
      {:else}
        <button formaction="?/new" class="btn btn-primary"
          ><Fa icon={faSave}></Fa>Guardar nuevo seguimiento</button
        >
      {/if}
    </div>
  </div>
</form>

<style>
  /* Make the entire li element act as a clickable container */
  .clickable-step {
    position: relative;
    cursor: pointer;
  }

  /* Create an overlay that covers the entire li element */
  .clickable-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }
  :global(.step) {
    --step-bg: var(--color-accent);
  }
</style>
