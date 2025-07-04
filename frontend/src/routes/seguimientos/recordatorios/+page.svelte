<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import MonthSelector from "$lib/components/MonthSelector.svelte";
  import type { Docencia } from "$lib/interfaces.js";
  import {
    faCheckCircle,
    faPaperPlane,
    faXmarkCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import { onDestroy, onMount } from "svelte";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";

  const { data, form } = $props();
  let selectedMonth = $derived(
    Number(page.url.searchParams.get("month")) || new Date().getMonth() + 1
  );

  // When the selected month changes, reload data
  $effect(() => {
    if (
      selectedMonth !=
      (Number(page.url.searchParams.get("month")) || new Date().getMonth() + 1)
    ) {
      let query = new URLSearchParams(page.url.searchParams.toString());
      query.set("month", String(selectedMonth));
      selectedRows = [];
      goto(`?${query.toString()}`);
    }
  });

  let selectedRows = $state<number[]>([]);

  // Miramos aquellos que tienen profesores activos
  let docenciasFiltered = $state<Docencia[]>([]);
  $effect(() => {
    data.seguimientosFaltantes.then((result) => {
      docenciasFiltered = result.filter((item) => item.profesor.activo);
    });
    selectedRows = [];
  });

  // Function for the button that selects and deselects all rows
  function selectAll(element: any, seguimientos: Docencia[]) {
    if (element.target.checked) {
      selectedRows = docenciasFiltered.map((item) => item.id);
    } else {
      selectedRows = [];
    }
  }
</script>

<div class="bg-base-200 flex justify-center">
  <form
    method="POST"
    class="container p-4 bg-base-100 shadow-2xl rounded-2xl mx-auto my-4"
  >
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">Seguimientos Faltantes</h1>
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        Selecciona el mes:
        <div class="md:flex-1/2">
          <MonthSelector bind:selectedMonth></MonthSelector>
        </div>
        <div class="md:ml-auto">
          <button
            type="submit"
            class="btn btn-primary"
            disabled={selectedRows.length === 0}
          >
            <Fa icon={faPaperPlane}></Fa>
            Enviar {selectedRows.length} recordatorios
          </button>
        </div>
      </div>
    </div>
    {#if form?.error}
      <div role="alert" class="alert alert-error w-full mt-4" transition:slide>
        <Fa icon={faXmarkCircle}></Fa>
        <span>{form?.error}</span>
      </div>
    {:else if form?.success}
      <div
        role="alert"
        class="alert alert-success w-full mt-4"
        transition:slide
      >
        <Fa icon={faCheckCircle}></Fa>
        <span
          >Se han enviado {form.success.n_emails} correos de recordatorio
        </span>
      </div>
    {/if}
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mb-4">Listado de Seguimientos Pendientes</h2>
        {#await data.seguimientosFaltantes}
          <div class="flex justify-center p-8">
            <span class="loading loading-spinner loading-lg text-primary"
            ></span>
          </div>
        {:then docencias}
          {#if docencias.length === 0}
            <div class="alert alert-success">
              <Fa icon={faCheckCircle}></Fa>
              <span>¡No hay seguimientos pendientes para este mes!</span>
            </div>
          {:else}
            <div
              class="overflow-x-auto rounded-box border border-base-content/10"
            >
              <table class="table">
                <thead class="bg-base-200 text-neutral">
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        class="checkbox bg-base-100 checked:bg-base-100 rounded-md"
                        checked={selectedRows.length ===
                          docenciasFiltered.length}
                        indeterminate={selectedRows.length !==
                          docenciasFiltered.length && selectedRows.length !== 0}
                        onchange={(e) => selectAll(e, docencias)}
                      />
                    </th>
                    <th>Profesor</th>
                    <th>Módulo</th>
                    <th>Grupo</th>
                    <th>Curso</th>
                    <th>Ciclo</th>
                  </tr>
                </thead>
                <tbody>
                  {#each docencias as docencia}
                    <tr
                      class="{selectedRows.includes(docencia.id)
                        ? 'bg-primary bg-'
                        : ''} "
                    >
                      <td>
                        <input
                          type="checkbox"
                          class="checkbox bg-base-100 checked:bg-base-100 disabled:bg-base-300 rounded-md"
                          bind:group={selectedRows}
                          name="docencias"
                          value={docencia.id}
                          disabled={!docencia.profesor.activo}
                        /></td
                      >
                      <td>
                        <div class="flex flex-col">
                          <span>{docencia.profesor.nombre}</span>
                          <span class="text-xs opacity-70"
                            >{docencia.profesor.email}</span
                          >
                          {#if !docencia.profesor.activo}
                            <span class="text-xs opacity-70 text-error"
                              >No activo</span
                            >
                          {/if}
                        </div>
                      </td>
                      <td>{docencia.modulo.nombre}</td>
                      <td>{docencia.grupo.nombre}</td>
                      <td>{docencia.modulo.curso}</td>
                      <td>{docencia.modulo.ciclo.nombre}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        {/await}
      </div>
    </div>
  </form>
</div>
