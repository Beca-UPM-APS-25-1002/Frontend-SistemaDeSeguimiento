import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((month: string) => {
  return Number(month) > 0 && Number(month) <= 12;
}) satisfies ParamMatcher;
