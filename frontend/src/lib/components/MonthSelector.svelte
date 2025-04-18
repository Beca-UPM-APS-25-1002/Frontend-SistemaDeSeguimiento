<script lang="ts">
  const months = [
    { name: "Septiembre", value: 9 },
    { name: "Octubre", value: 10 },
    { name: "Noviembre", value: 11 },
    { name: "Diciembre", value: 12 },
    { name: "Enero", value: 1 },
    { name: "Febrero", value: 2 },
    { name: "Marzo", value: 3 },
    { name: "Abril", value: 4 },
    { name: "Mayo", value: 5 },
    { name: "Junio", value: 6 },
    { name: "Julio", value: 7 },
    { name: "Agosto", value: 8 },
  ];
  let { selectedMonth = $bindable() } = $props();
</script>

<div class="w-full mt-2">
  <select
    class="select select-bordered w-full"
    name="month_selector"
    bind:value={selectedMonth}
  >
    {#each months as month}
      <option value={month.value}>{month.name}</option>
    {/each}
  </select>
</div>
