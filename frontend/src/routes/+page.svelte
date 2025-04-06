<script>
  import { enhance } from "$app/forms";
  import { faAt, faKey } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
</script>

<div class="flex items-center justify-center min-h-screen bg-base-200">
  <div class="p-8 flex flex-col gap-2 items-center justify-center bg-base-100 shadow-xl rounded-xl">
    <p class="text-primary-content">Bienvenid@ al sistema de seguimiento</p>
      <form action="POST" class="flex flex-col gap-2 w-full max-w-xs mx-auto" use:enhance>
          <label class="input input-bordered w-full validator">
            <Fa icon={faAt}></Fa>
              <input type="Email" required placeholder="Email">
          </label>
          <label class="input input-bordered w-full validator">
              <Fa icon={faKey}></Fa>
              <input type="password" required placeholder="Contraseña"/>
            </label>
          <button class="btn btn-primary btn-block">Iniciar Sesión</button>
      </form>
  </div>
</div>