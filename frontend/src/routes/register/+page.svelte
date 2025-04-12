<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    faAt,
    faCircleXmark,
    faKey,
    faUser,
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
      Crea tu cuenta
    </h2>
    <form
      method="POST"
      class="flex flex-col gap-2 w-full max-w-xs mx-auto"
      use:enhance
    >
      <label class="input input-bordered w-full validator">
        <Fa icon={faUser}></Fa>
        <input type="text" required placeholder="Nombre" name="nombre" />
      </label>
      <span class="text-error">{errors?.nombre}</span>

      <label class="input input-bordered w-full validator">
        <Fa icon={faAt}></Fa>
        <input type="Email" required placeholder="Email" name="email" />
      </label>
      <span class="text-error">{errors?.email}</span>

      <label class="input input-bordered w-full validator">
        <Fa icon={faKey}></Fa>
        <input
          type="password"
          minlength="8"
          placeholder="Contraseña"
          name="password"
        />
      </label>
      <label class="input input-bordered w-full validator">
        <Fa icon={faKey}></Fa>
        <input
          type="password"
          minlength="8"
          placeholder="Repite contraseña"
          name="passwordRepeat"
        />
      </label>
      <span class="text-error">{errors?.password}</span>

      {#if errors?.all}
        <p role="alert" class="alert alert-error">
          <Fa icon={faCircleXmark}></Fa>
          {errors.all}
        </p>
      {/if}

      <button class="btn btn-primary btn-block">Crear Usuario</button>
      <a class="btn btn-secondary btn-sm" href="/">Ya tengo una cuenta</a>
    </form>
  </div>
</div>
