import type { LayoutServerLoad } from "./$types.ts";
import { env } from "$env/dynamic/private";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return { user: locals.user, backend_url: env.BACKEND_PUBLIC_URL };
};
