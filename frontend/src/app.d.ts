// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: {
        id: int;
        email: string;
        nombre: string;
      } | null;
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
declare module "@fortawesome/pro-solid-svg-icons/index.es" {
  export * from "@fortawesome/pro-solid-svg-icons";
}

export {};
