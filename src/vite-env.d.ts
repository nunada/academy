/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Babel standalone ships no types, and we use exactly one call from it. */
declare module '@babel/standalone' {
  export function transform(
    code: string,
    options: { presets?: string[]; sourceType?: 'script' | 'module' },
  ): { code: string | null }
}
