<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import MonthSelector from "$lib/components/MonthSelector.svelte";
  import type { Docencia } from "$lib/interfaces.js";
  import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  const { data } = $props();
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
  function selectAll(element: any, seguimientos: Docencia[]) {
    if (element.target.checked) {
      selectedRows = seguimientos.map((item) => item.id);
    } else {
      selectedRows = [];
    }
  }
</script>

<div class="bg-base-200 flex justify-center">
  <div class="container p-4 bg-base-100 shadow-2xl rounded-2xl mx-auto my-4">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">Seguimientos Faltantes</h1>
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        Selecciona el mes:
        <div class="md:flex-1/2">
          <MonthSelector bind:selectedMonth></MonthSelector>
        </div>
        <div class="md:ml-auto">
          <button type="submit" class="btn btn-primary">
            Procesar Seleccionados
          </button>
        </div>
      </div>
    </div>

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
                        class="checkbox bg-base-100 checked:bg-base-200 rounded-md"
                        checked={selectedRows.length === docencias.length}
                        indeterminate={selectedRows.length !==
                          docencias.length && selectedRows.length !== 0}
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
                      class={selectedRows.includes(docencia.id)
                        ? "bg-primary"
                        : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          class="checkbox rounded-md"
                          bind:group={selectedRows}
                          name="docencias"
                          value={docencia.id}
                        /></td
                      >
                      <td>
                        <div class="flex flex-col">
                          <span>{docencia.profesor.nombre}</span>
                          <span class="text-xs opacity-70"
                            >{docencia.profesor.email}</span
                          >
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
  </div>
</div>
