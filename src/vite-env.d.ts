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

/** sql.js ships no types, and we use one factory plus two methods. */
declare module 'sql.js/dist/sql-wasm.js' {
  interface SqlDatabase {
    exec(sql: string): { columns: string[]; values: (string | number | Uint8Array | null)[][] }[]
    run(sql: string): void
    close(): void
  }
  interface SqlJsStatic {
    Database: new () => SqlDatabase
  }
  export default function initSqlJs(config?: { locateFile?: (file: string) => string }): Promise<SqlJsStatic>
}
