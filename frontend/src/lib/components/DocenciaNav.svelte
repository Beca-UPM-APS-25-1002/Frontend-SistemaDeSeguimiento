<script lang="ts">
  import type {
    Docencia,
    SeguimientosFaltantesPorMes,
  } from "$lib/interfaces.ts";
  import { fade, slide } from "svelte/transition";
  import Fa from "svelte-fa";
  import {
    faTable,
    faSearch,
    faClose,
    faCheckSquare,
    faSquare,
  } from "@fortawesome/free-solid-svg-icons";
  import { page } from "$app/state";
  import MonthSelector from "./MonthSelector.svelte";

  // Default to current month

  let selectedMonth = $state(
    Number(page.params.month) || new Date().getMonth() + 1
  );
  const {
    docencias,
    seguimientosFaltantes,
    docenciaActual = NaN,
    mesActual = NaN,
  }: {
    docencias: Promise<Docencia[]>;
    seguimientosFaltantes: Promise<SeguimientosFaltantesPorMes>;
    docenciaActual: number;
    mesActual: number;
  } = $props();

  let searchQuery = $state("");
  let filteredDocencias = $state<Docencia[]>([]);
  let expandedView = $state(false);
  let resolvedDocencias = $state<Docencia[]>([]);

  docencias.then((result) => {
    resolvedDocencias = result.sort((a, b) => {
      // First sort by group name
      const groupNameComparison = a.grupo.nombre.localeCompare(b.grupo.nombre);

      // If group names are the same, sort by module name
      if (groupNameComparison === 0) {
        return a.modulo.nombre.localeCompare(b.modulo.nombre);
      }

      return groupNameComparison;
    });
  });

  // Computed property for filtered docencias
  $effect(() => {
    if (!searchQuery.trim()) {
      filteredDocencias = resolvedDocencias;
    } else {
      const query = searchQuery.toLowerCase();
      filteredDocencias = resolvedDocencias.filter(
        (doc) =>
          doc.modulo.nombre.toLowerCase().includes(query) ||
          doc.grupo.nombre.toLowerCase().includes(query)
      );
    }
  });

  // Function to check if seguimiento is completed
  function isSeguimientoCompleted(
    docenciaId: number,
    month: number,
    seguimientosFaltantes: SeguimientosFaltantesPorMes
  ): boolean {
    return (
      !seguimientosFaltantes[month] ||
      !seguimientosFaltantes[month].includes(docenciaId)
    );
  }

  function toggleView() {
    expandedView = !expandedView;
  }
</script>

<div
  class="sm:w-full md:w-1/4 h-full m-4 rounded-lg bg-base-100 shadow-lg flex flex-col transition-all duration-300
  {page.url.pathname !== '/seguimientos' ? 'hidden md:block' : ''}"
>
  <!-- Header section -->
  <div class="p-4 text-base-content">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Docencias</h2>
      <button
        class="btn btn-circle btn-sm btn-ghost"
        onclick={toggleView}
        title={expandedView ? "Contraer vista" : "Expandir vista"}
        aria-label={expandedView ? "Contraer vista" : "Expandir vista"}
      >
        {#if expandedView}
          <Fa class="text-xl" icon={faClose}></Fa>
        {:else}
          <Fa class="text-xl" icon={faSearch}></Fa>
        {/if}
      </button>
    </div>
  </div>
  <div class="p-2">
    <p class="text-xs italic mt-1">
      Selecciona el mes de consulta de las docencias
    </p>

    <!-- Month selector -->
    <MonthSelector bind:selectedMonth></MonthSelector>

    <!-- Search input -->
    {#if expandedView}
      <div class="mt-3 w-full" transition:slide|local>
        <div class="form-control w-full">
          <div class="w-full">
            <input
              type="text"
              placeholder="Buscar docencias..."
              class="input input-bordered w-full"
              bind:value={searchQuery}
            />
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="divider divider-accent italic text-xs">Selecciona docencia</div>
  {#await docencias}
    <div class="px-2 overflow-y-auto flex-grow h-full flex justify-center">
      <span class="loading loading-spinner text-accent"></span>
    </div>
  {:then docencias}
    <!-- Docencias list -->
    <div class="px-2 overflow-y-auto">
      {#if filteredDocencias.length === 0}
        <div class="text-center py-4 text-neutral-500" transition:fade|local>
          {searchQuery
            ? "No se encontraron docencias que coincidan con tu búsqueda"
            : "No hay docencias disponibles"}
        </div>
      {:else}
        <div class="divide-y divide-accent">
          {#each filteredDocencias as docencia, i (docencia.id)}
            <div transition:fade|local={{ delay: i * 50, duration: 200 }}>
              <div class="m-1 flex items-center">
                <a
                  class="w-full text-left hover:bg-base-200 transition-all rounded-lg flex items-center p-2 {docencia.id ==
                    docenciaActual && selectedMonth == mesActual
                    ? 'bg-base-200'
                    : ''} shadow-sm"
                  href="/seguimientos/{selectedMonth}/{docencia.id}"
                >
                  {#await seguimientosFaltantes}
                    <div class="mr-3">
                      <span class="loading loading-spinner text-accent"></span>
                    </div>
                  {:then seguimientosFaltantesResolved}
                    {#key selectedMonth}
                      <div class="mr-3 text-xl">
                        {#if isSeguimientoCompleted(docencia.id, selectedMonth, seguimientosFaltantesResolved)}
                          <Fa icon={faCheckSquare} class="text-success" />
                        {:else}
                          <Fa icon={faSquare} class="text-neutral" />
                        {/if}
                      </div>
                    {/key}
                  {/await}

                  <div class="flex-grow">
                    <h3 class="font-medium text-lg">
                      {docencia.modulo.nombre}
                    </h3>
                    <div class="mt-1">
                      <span
                        class="inline-block p-1 text-sm border border-accent rounded-full"
                        >{docencia.grupo.nombre}</span
                      >
                    </div>
                  </div>
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Footer with count -->
    <div class="p-2 text-xs text-center text-neutral-500 rounded-b bg-base-200">
      {filteredDocencias.length}
      {filteredDocencias.length === 1 ? "docencia" : "docencias"} encontradas
    </div>
  {/await}
</div>
