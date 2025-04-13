<script lang="ts">
  import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  let { children } = $props();
</script>

<div class="navbar bg-base-100 shadow-md">
  <div class="flex-1 flex-col gap-1">
    <a
      class="btn btn-ghost text-xl"
      aria-label="homescreen"
      href="/seguimientos"
      >Sistema de Seguimientos
    </a>
  </div>
  <div class="flex-row">
    <!--TODO: Add link to admin screen and to email screen-->
    <form method="POST" action="/logout">
      <button
        class="btn btn-square btn-ghost"
        title="Cerrar Sesión"
        aria-label="Logout"
      >
        <Fa class="text-xl" icon={faArrowRightFromBracket}></Fa>
      </button>
    </form>
  </div>
</div>
<div class="min-h-screen bg-base-200">
  {@render children()}
</div>
