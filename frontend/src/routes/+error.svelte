<script>
  import { page } from "$app/state";
  import {
    faXmarkCircle,
    faArrowLeft,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  function goBack() {
    window.history.back();
  }
</script>

<div class="flex justify-center items-center min-h-screen bg-base-200 p-4">
  <div class="card bg-base-100 shadow-xl max-w-md w-full p-8 rounded-xl">
    <div class="card-body">
      <div class="flex items-center">
        <Fa icon={faXmarkCircle} class="text-2xl mr-3" />
        <div>
          <h2 class="text-2xl font-bold">
            Error {page.status}
          </h2>
          <p class="text-lg">
            {#if page.status === 404}
              ¡No se ha encontrado esta página!
            {:else}
              {page.error?.message}
            {/if}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <button class="btn btn-primary btn-md gap-2" on:click={goBack}>
        <Fa icon={faArrowLeft} />
        Volver atrás
      </button>
    </div>
  </div>
</div>
