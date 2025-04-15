<script lang="ts">
  import type { Seguimiento } from "$lib/interfaces.js";
  import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  const { data } = $props();
  const seguimiento = data.seguimiento;
</script>

<form method="POST">
  {#if seguimiento}
    <button class="btn btn-accent">Guardar cambios</button>
  {:else}
    <button class="btn btn-accent">Guardar seguimiento</button>
  {/if}
</form>
