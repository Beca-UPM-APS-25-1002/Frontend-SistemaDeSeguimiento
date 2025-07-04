<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/state"; // Import page store for routing information
  import DocenciaNav from "$lib/components/DocenciaNav.svelte";
  import { onMount } from "svelte";

  let { data, children } = $props();

  // Store for saving scroll positions by route
  let scrollPosition: number;

  beforeNavigate(({ to, from }) => {
    // Save current scroll position before leaving
    if (from) {
      scrollPosition = window.scrollY;
    }
  });

  // Nos quedamos en la misma posición, asi parece más una SPA
  afterNavigate(({ to }) => {
    window.scrollTo(0, scrollPosition);
  });
</script>

<div class="flex flex-col md:flex-row gap-4">
  <!-- Navbar - Always visible on desktop, only on home screen for mobile -->
  <DocenciaNav
    docencias={data.docencias}
    seguimientosFaltantes={data.seguimientosFaltantes}
    docenciaActual={Number(page.params.docenciaId)}
    mesActual={Number(page.params.month)}
  />

  <!-- Content area - Always visible on desktop, only on subpages for mobile -->
  <div
    class="flex-grow sm:w-full md:w-3/4 m-4 rounded-lg bg-base-100 shadow-lg p-4 transition-all duration-300
    {page.url.pathname === '/seguimientos' ? 'hidden md:block' : ''}"
  >
    {@render children()}
  </div>
</div>
