<script lang="ts">
  import type { Docencia } from "$lib/interfaces.ts";
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import Fa from "svelte-fa";
  import {
    faCheckCircle,
    faTimesCircle,
    faTable,
    faSearch,
    faSearchPlus,
    faSearchMinus,
    faCross,
    faClose,
  } from "@fortawesome/free-solid-svg-icons";

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

  // Default to current month
  let selectedMonth = $state(months[new Date().getMonth()]);
  const {
    docencias = [],
    seguimientosFaltantes = [],
  }: { docencias: Docencia[]; seguimientosFaltantes: number[] } = $props();

  let searchQuery = $state("");
  let filteredDocencias = $state<Docencia[]>([]);
  let expandedView = $state(false);

  // Computed property for filtered docencias
  $effect(() => {
    if (!searchQuery.trim()) {
      filteredDocencias = docencias;
    } else {
      const query = searchQuery.toLowerCase();
      filteredDocencias = docencias.filter(
        (doc) =>
          doc.modulo.nombre.toLowerCase().includes(query) ||
          doc.grupo.nombre.toLowerCase().includes(query)
      );
    }
  });

  // Function to check if seguimiento is completed
  function isSeguimientoCompleted(docenciaId: number): boolean {
    return !seguimientosFaltantes.includes(docenciaId);
  }

  function toggleView() {
    expandedView = !expandedView;
  }
</script>

<div
  class="sm:w-1/4 w-full h-full m-4 rounded-lg bg-base-100 shadow-lg flex flex-col transition-all duration-300"
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
    <div class="w-full mt-2">
      <select class="select select-bordered w-full" bind:value={selectedMonth}>
        {#each months as month}
          <option value={month}>{month}</option>
        {/each}
      </select>
    </div>

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

  <!-- Docencias list -->
  <div class="px-2 overflow-y-auto flex-grow">
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
                class="w-full text-left hover:bg-base-200 transition-all rounded-lg flex items-center p-2"
                href="/seguimientos/{selectedMonth}/{docencia.id}"
              >
                <div class="mr-3">
                  {#if isSeguimientoCompleted(docencia.id)}
                    <Fa icon={faCheckCircle} class="text-success" />
                  {:else}
                    <Fa icon={faTimesCircle} class="text-error" />
                  {/if}
                </div>

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
              <div class="ml-2">
                <a
                  class="btn btn-sm btn-ghost"
                  href="/seguimientos/tabla/{docencia.id}"
                  aria-label="Ver en tabla"
                >
                  <Fa icon={faTable} />
                </a>
              </div>
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
</div>
