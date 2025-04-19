<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import {
    faAt,
    faCircleCheck,
    faCircleXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  let { data, form } = $props();
  const errors: any = $derived(form?.error);
</script>

<div class="flex items-center justify-center min-h-screen bg-base-200">
  <div
    class="p-8 flex flex-col gap-2 items-center justify-center bg-base-100 shadow-xl rounded-xl w-full max-w-md m-4"
  >
    <h2 class="text-xl font-semibold text-primary-content mb-2">
      Cambia tu contraseña
    </h2>
    <form
      method="POST"
      class="flex flex-col gap-2 w-full max-w-xs mx-auto"
      use:enhance
    >
      <label class="input input-bordered w-full validator">
        <Fa icon={faAt}></Fa>
        <input
          type="email"
          minlength="8"
          placeholder="Email"
          name="email"
          required
        />
      </label>

      {#if errors && !errors.password}
        <p role="alert" class="alert alert-error">
          <Fa icon={faCircleXmark}></Fa>
          {errors}
        </p>
      {/if}
      {#if form?.success}
        <p role="alert" class="alert alert-success">
          <Fa icon={faCircleCheck}></Fa>
          Se te ha mandado un correo para cambiar tu contraseña
        </p>
      {/if}

      <button class="btn btn-primary btn-block">Cambiar contraseña</button>
    </form>
  </div>
</div>
