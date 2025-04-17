import type { LayoutServerLoad } from "./$types.ts";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return { user: locals.user };
};
