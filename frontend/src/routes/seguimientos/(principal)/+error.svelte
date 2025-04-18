<script>
  import { page } from "$app/state";
  import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";
</script>

<h1 class="text-xl alert alert-error m-4 font-semibold">
  <Fa icon={faXmarkCircle}></Fa>
  {#if page.status === 404}
    Error {page.status} <br />
    ¡No se ha encontrado esta página!
  {:else}
    Error {page.status} <br />
    {page.error?.message}{/if}
</h1>
