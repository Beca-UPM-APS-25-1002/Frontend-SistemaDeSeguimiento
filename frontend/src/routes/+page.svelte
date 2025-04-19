<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    faAt,
    faCheckCircle,
    faCircleXmark,
    faKey,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { page } from "$app/state";
  const email = page.url.searchParams.get("email");
  const reset = page.url.searchParams.get("reset");
  let { form } = $props();
</script>

<div class="flex items-center justify-center min-h-screen bg-base-200">
  <div
    class="p-8 flex flex-col gap-2 items-center justify-center bg-base-100 shadow-xl rounded-xl w-full max-w-md m-4"
  >
    <h2 class="text-xl font-semibold text-primary-content mb-2">Bienvenid@</h2>
    <form
      method="POST"
      class="flex flex-col gap-2 w-full max-w-xs mx-auto"
      action="?/login"
      use:enhance
    >
      <label class="input input-bordered w-full validator">
        <Fa icon={faAt}></Fa>
        <input
          type="Email"
          required
          placeholder="Email"
          name="email"
          value={email ?? ""}
        />
      </label>
      <label class="input input-bordered w-full validator">
        <Fa icon={faKey}></Fa>
        <input
          type="password"
          required
          placeholder="Contraseña"
          name="password"
        />
      </label>
      <a class="link link-accent text-sm ml-auto" href="/password"
        >He olvidado mi contraseña</a
      >
      {#if form?.error}
        <p role="alert" class="alert alert-error">
          <Fa icon={faCircleXmark}></Fa>
          {form.error}
        </p>
      {:else if email}
        <p role="alert" class="alert alert-success">
          <Fa icon={faCheckCircle}></Fa>Cuenta creada con éxito
        </p>
      {:else if reset}
        <p role="alert" class="alert alert-success">
          <Fa icon={faCheckCircle}></Fa>Contraseña cambiada con éxito
        </p>
      {/if}
      <button class="btn btn-primary btn-block">Iniciar Sesión</button>
      <a class="btn btn-secondary btn-sm" href="/register">Registrarse</a>
    </form>
  </div>
</div>
