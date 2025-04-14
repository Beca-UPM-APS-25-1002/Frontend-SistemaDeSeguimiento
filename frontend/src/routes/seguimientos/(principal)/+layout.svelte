<script lang="ts">
  import DocenciaNav from "$lib/components/DocenciaNav.svelte";
  const { data } = $props();
</script>

<DocenciaNav
  docencias={data.docencias}
  seguimientosFaltantes={data.seguimientosFaltantes}
></DocenciaNav>
