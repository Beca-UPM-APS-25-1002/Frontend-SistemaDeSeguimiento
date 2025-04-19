import type { LayoutServerLoad } from "./$types.ts";
import { BACKEND_PUBLIC_URL } from "$env/static/private";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return { user: locals.user, backend_url: BACKEND_PUBLIC_URL };
};
