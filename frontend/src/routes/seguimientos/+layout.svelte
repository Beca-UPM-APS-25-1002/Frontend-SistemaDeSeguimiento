<script lang="ts">
  import {
    faArrowRightFromBracket,
    faEnvelope,
    faGear,
    faHouse,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import type { LayoutProps } from "./$types.ts";
  import { PUBLIC_NAVBAR_TITLE } from "$env/static/public";
  let { data, children }: LayoutProps = $props();
</script>

<div class="min-h-screen bg-base-200">
  <div class="navbar bg-base-100 shadow-md">
    <div class="navbar-start">
      <a
        class="btn btn-ghost text-xl shadow-lg"
        aria-label="homescreen"
        title="Pantalla Principal"
        href="/seguimientos"
      >
        <Fa icon={faHouse}></Fa>
      </a>

      {#if data.user?.is_admin}
        <a
          class="btn btn-ghost text-xl shadow-lg"
          title="Recordatorios de seguimientos"
          href="/seguimientos/recordatorios"
        >
          <Fa icon={faEnvelope}></Fa>
        </a>
        <a
          class="btn btn-ghost text-xl shadow-lg"
          title="Administración"
          href="{data.backend_url}/admin"
        >
          <Fa icon={faGear}></Fa>
        </a>
      {/if}
    </div>
    <div class="navbar-center text-center">
      {PUBLIC_NAVBAR_TITLE} <br />
      Seguimientos del curso {data.year}
    </div>
    <div class="flex-row flex gap-2 navbar-end">
      <p class="text-xs ml-2">Bienvenid@ <br /> {data.user?.nombre}</p>

      <form method="POST" action="/?/logout">
        <button
          class="btn btn-square btn-ghost shadow-lg"
          title="Cerrar Sesión"
          aria-label="Logout"
        >
          <Fa class="text-xl" icon={faArrowRightFromBracket}></Fa>
        </button>
      </form>
    </div>
  </div>
  {@render children()}
</div>
