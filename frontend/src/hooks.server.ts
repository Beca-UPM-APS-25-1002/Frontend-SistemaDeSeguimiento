import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import { API_URI } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
  /**
   * This section checks validity of authorization
   * token cookie and redirects to login if it does
   * not exist or isn't valid
   */
  const token = event.cookies.get("authToken");

  // If no authToken is found then go to login
  if (
    !token &&
    event.url.pathname != "/" &&
    event.url.pathname != "/register"
  ) {
    const redirectPath = "/?redirectTo=" + event.url.pathname;
    throw redirect(302, redirectPath);
  } else if (token) {
    await setLocalUser();
    await setLocalCurrentYear();
  }

  const response = await resolve(event);

  return response;

  /**
   * Sets the locals.user to the current user or redirects to login if not valid
   */
  async function setLocalUser() {
    interface APIUser {
      id: number;
      nombre: string;
      email: string;
      activo: boolean;
      is_admin: boolean;
    }
    const userRequest = await fetch(`${API_URI}/auth/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
    });
    if (userRequest.status != 200) {
      // If user is not found or is not properly authenticated
      event.cookies.delete("authToken", { path: "/" });
      throw redirect(302, "/?redirectTo=" + event.url.pathname);
    }
    const user: APIUser = await userRequest.json();
    event.locals.user = {
      email: user.email,
      id: user.id,
      nombre: user.nombre,
      is_admin: user.is_admin,
    };
  }
  /**
   * Sets the locals.current_year to the current year
   */
  async function setLocalCurrentYear() {
    interface CurrentYear {
      año_academico_actual: string;
    }
    const yearRequest = await fetch(API_URI + "/api/year-actual/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
    });
    const year: CurrentYear = await yearRequest.json();
    event.locals.current_year = year.año_academico_actual;
  }
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const token = event.cookies.get("authToken");
  if (token && request.url.startsWith(API_URI)) {
    request.headers.set("Authorization", "Token " + token);
  }
  return fetch(request);
};
