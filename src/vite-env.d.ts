/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
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

/** JSCPP ships no types either. `run()` is the only entry point used — it
 *  interprets `code` synchronously (with `input` as the whole of stdin) and
 *  returns the program's exit code, throwing on a parse or runtime error. */
declare module 'JSCPP' {
  interface JSCPPConfig {
    stdio?: { write?: (s: string) => void }
    /** Checked between statements; past this many milliseconds a runaway
     *  loop throws instead of hanging the tab. */
    maxTimeout?: number
  }
  interface JSCPPStatic {
    run(code: string, input: string, config?: JSCPPConfig): number
  }
  const JSCPP: JSCPPStatic
  export default JSCPP
}
