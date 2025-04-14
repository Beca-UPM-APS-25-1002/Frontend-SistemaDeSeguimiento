<script>
  import { page } from "$app/state"; // Import page store for routing information
  import DocenciaNav from "$lib/components/DocenciaNav.svelte";

  let { data, children } = $props();
</script>

<div class="flex flex-col md:flex-row gap-4">
  <!-- Navbar - Always visible on desktop, only on home screen for mobile -->
  <DocenciaNav
    docencias={data.docencias}
    seguimientosFaltantes={data.seguimientosFaltantes}
    docenciaActual={-1}
    mesActual={-1}
  />

  <!-- Content area - Always visible on desktop, only on subpages for mobile -->
  <div
    class={`flex-grow sm:w-full md:w-3/4 h-full m-4 rounded-lg bg-base-100 shadow-lg p-4 transition-all duration-300
    ${page.url.pathname === "/seguimientos" ? "hidden md:block" : ""}`}
  >
    {@render children()}
  </div>
</div>
