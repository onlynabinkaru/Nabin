/// <reference types="vite/client" />

export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY?: string;
    // add other VITE_... env vars here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
