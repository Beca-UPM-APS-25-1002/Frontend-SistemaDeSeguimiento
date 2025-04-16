<script lang="ts">
  import type { Seguimiento, UnidadDeTrabajo } from "$lib/interfaces.js";
  import { faCircleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  const { data } = $props();
  $effect(() => {
    selectedTema =
      data.unidadesDeTrabajo.find(
        (value) =>
          value.id === data.seguimientoActual?.temario_actual ||
          value.id === data.seguimientoAnterior?.temario_actual
      ) || null;
  });
  let selectedTema = $state(
    data.unidadesDeTrabajo.find((value) => {
      value.id === data.seguimientoActual?.temario_actual ||
        value.id === data.seguimientoAnterior?.temario_actual;
    }) || null
  );
  // Function to handle clicking on a list item
  function selectUnit(temaId: number) {
    selectedTema =
      data.unidadesDeTrabajo.find((value) => {
        return value.id === temaId;
      }) || null;
  }
</script>

<!--Message if the original profesor is not the current user-->
{#if data.seguimientoActual && data.seguimientoActual?.profesor.id != data.user?.id}
  <p class="text-sm italic">
    Este seguimiento fue realizado originalmente por {data.seguimientoActual
      ?.profesor.nombre}
  </p>
  <div class="divider"></div>
{/if}
<form method="POST">
  <!--Fieldset to select current unit of work-->
  <fieldset class="fieldset md:w-1/2 border border-base-300 p-4 rounded-box">
    <legend class="fieldset-legend">Situación actual de la docencia</legend>
    <legend class="fieldset-legend"
      >Selecciona la unidad de trabajo que estás impartiendo:</legend
    >
    <ul class="steps steps-vertical">
      {#each data.unidadesDeTrabajo as tema, i}
        <li
          class="step {selectedTema &&
          tema.numero_tema <= selectedTema?.numero_tema
            ? 'step-primary'
            : ''} clickable-step"
        >
          <!-- Hidden radio button that will be part of the form submission -->
          <input
            type="radio"
            name="temario_actual"
            value={tema.id}
            id={`${tema.id}`}
            hidden
            required
            checked={selectedTema && selectedTema.id === tema.id}
          />

          <!-- Label that contains the text -->
          <label for={`unit-${tema.id}`} class="text-lg">
            {tema.titulo}
          </label>

          <!-- Invisible overlay to make entire area clickable -->
          <span
            class="clickable-overlay"
            onclick={() => selectUnit(tema.id)}
            onkeydown={(e) => e.key === "Enter" && selectUnit(tema.id)}
            tabindex="0"
            role="radio"
            aria-checked={selectedTema && selectedTema.id === tema.id}
          ></span>
        </li>
      {/each}
    </ul>
    <legend class="fieldset-legend">Evaluación</legend>
    <select
      name="evaluacion"
      class="select"
      value={data.seguimientoActual ? data.seguimientoActual.evaluacion : ""}
      required
    >
      <option disabled selected value="">Elige la evaluación actual</option>
      <option value="PRIMERA">Primera</option>
      <option value="SEGUNDA">Segunda</option>
      <option value="TERCERA">Tercera</option>
    </select>
    <legend class="fieldset-legend">Último contenido impartido</legend>
    <textarea
      name="ultimo_contenido_impartido"
      class="textarea h-24"
      placeholder={data.seguimientoAnterior?.ultimo_contenido_impartido ??
        "Último contenido impartido"}
      required>{data.seguimientoActual?.ultimo_contenido_impartido}</textarea
    >
  </fieldset>
  <!--Submit button-->
  {#if data.seguimientoActual}
    <button class="btn btn-primary mt-4"
      ><Fa icon={faSave}></Fa>Guardar cambios</button
    >
  {:else}
    <button class="btn btn-primary mt-4"
      ><Fa icon={faSave}></Fa>Guardar nuevo seguimiento</button
    >
  {/if}
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
