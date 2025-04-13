<script lang="ts">
  import DocenciaNav from "$lib/components/DocenciaNav.svelte";
  const docencias = [
    {
      id: 87,
      profesor: {
        id: 94,
        nombre: "Maria",
        email: "a@profes.es",
        activo: true,
        is_admin: false,
      },
      modulo: {
        id: 75,
        ciclo: {
          id: 53,
          nombre: "DAW",
          año_academico: "2025-26",
        },
        nombre: "APIs HTTP",
        curso: 1,
      },
      grupo: {
        id: 60,
        nombre: "DAW1T",
        curso: 1,
        ciclo: 53,
      },
    },
    {
      id: 88,
      profesor: {
        id: 94,
        nombre: "Maria",
        email: "a@profes.es",
        activo: true,
        is_admin: false,
      },
      modulo: {
        id: 74,
        ciclo: {
          id: 53,
          nombre: "DAW",
          año_academico: "2025-26",
        },
        nombre: "Diseño Web",
        curso: 2,
      },
      grupo: {
        id: 61,
        nombre: "DAW2M",
        curso: 2,
        ciclo: 53,
      },
    },
  ];
</script>

<DocenciaNav {docencias} seguimientosFaltantes={[]}></DocenciaNav>
