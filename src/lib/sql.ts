/** SQLite in the browser, via sql.js (SQLite compiled to WebAssembly).
 *
 *  Unlike the web courses this does not need an iframe. SQL touches no DOM and
 *  reaches no network — sql.js is already a WebAssembly sandbox holding a
 *  database that exists only in memory. So it runs in the app, the way Pyodide
 *  does, and the engine is kept for the rest of the session.
 *
 *  Every exercise gets a *fresh* database built from its own schema. That is the
 *  whole isolation story: an UPDATE in one check cannot be seen by the next. */

import type { SqlTest } from '../content/types'

// The bare specifier resolves through the package's `browser` condition, and the
// wasm has to be handed over by URL because sql.js fetches it at init time.
import initSqlJs from 'sql.js/dist/sql-wasm.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

interface SqlDatabase {
  exec(sql: string): { columns: string[]; values: SqlValue[][] }[]
  run(sql: string): void
  close(): void
}

interface SqlJsStatic {
  Database: new () => SqlDatabase
}

export type SqlValue = string | number | Uint8Array | null

let enginePromise: Promise<SqlJsStatic> | null = null

export function getSqlEngine(): Promise<SqlJsStatic> {
  if (!enginePromise) {
    enginePromise = initSqlJs({ locateFile: () => wasmUrl }).catch((err: unknown) => {
      enginePromise = null
      throw err
    })
  }
  return enginePromise
}

export interface SqlResult {
  columns: string[]
  rows: SqlValue[][]
  /** Present when the statement did not run. Already trimmed for a beginner. */
  error?: string
  /** True when the statement produced no result set — an INSERT, say. */
  silent?: boolean
}

/** sqlite's messages are decent; this only strips the prefix nobody needs. */
function friendly(raw: string): string {
  return raw.replace(/^Error:\s*/i, '').trim()
}

/** Run `sql` against a database freshly built from `schema`.
 *  Only the last statement that returns rows is reported, which matches what a
 *  learner means when they write a query after some setup. */
export async function runSql(schema: string, sql: string): Promise<SqlResult> {
  const SQL = await getSqlEngine()
  const db = new SQL.Database()
  try {
    if (schema.trim()) db.run(schema)
    const out = db.exec(sql)
    if (out.length === 0) return { columns: [], rows: [], silent: true }
    const last = out[out.length - 1]
    return { columns: last.columns, rows: last.values }
  } catch (err) {
    return { columns: [], rows: [], error: friendly(String((err as Error).message ?? err)) }
  } finally {
    db.close()
  }
}

export interface SqlOutcome {
  test: SqlTest
  passed: boolean
  detail?: string
  /** Filled on a mismatch so the UI can show both grids side by side. */
  got?: SqlResult
  want?: SqlValue[][]
  /** Headers for the expected grid. Not always the learner's headers:
   *  when they selected the wrong columns the two grids are different
   *  shapes, and reusing their names would mislabel the answer. */
  wantColumns?: string[]
}

const norm = (v: SqlValue): string => (v === null ? '␀' : String(v))
// The separator is a control character no cell can hold, so the rows
// ("ab", "c") and ("a", "bc") do not collide.
const rowKey = (r: SqlValue[]): string => r.map(norm).join('\u0001')

function sameRows(got: SqlValue[][], want: SqlValue[][], ordered: boolean): boolean {
  if (got.length !== want.length) return false
  const a = got.map(rowKey)
  const b = want.map(rowKey)
  if (!ordered) {
    a.sort()
    b.sort()
  }
  return a.every((v, i) => v === b[i])
}

/** What to write above the expected grid. The test's own column names when
 *  it named any; otherwise the learner's, but only if the two grids are the
 *  same width — a placeholder rather than a wrong name when they are not. */
function expectedHeaders(test: SqlTest, got: string[]): string[] {
  if (test.expectColumns) return test.expectColumns
  const width = test.expectRows?.[0]?.length ?? got.length
  if (width === got.length) return got
  return Array.from({ length: width }, (_, i) => `#${i + 1}`)
}

export async function runSqlTests(schema: string, sql: string, tests: SqlTest[]): Promise<SqlOutcome[]> {
  const SQL = await getSqlEngine()
  const outcomes: SqlOutcome[] = []

  for (const test of tests) {
    // A new database per check, so an UPDATE in one cannot leak into the next.
    const db = new SQL.Database()
    try {
      if (schema.trim()) db.run(schema)
      if (test.setup) db.run(test.setup)

      let result: SqlResult
      try {
        const out = db.exec(sql)
        result =
          out.length === 0
            ? { columns: [], rows: [], silent: true }
            : { columns: out[out.length - 1].columns, rows: out[out.length - 1].values }
      } catch (err) {
        outcomes.push({
          test,
          passed: false,
          detail: friendly(String((err as Error).message ?? err)),
        })
        continue
      }

      // `verify` is how a write is checked: run the learner's statement, then
      // ask the database what it now holds.
      if (test.verify) {
        const v = db.exec(test.verify)
        result =
          v.length === 0
            ? { columns: [], rows: [], silent: true }
            : { columns: v[v.length - 1].columns, rows: v[v.length - 1].values }
      }

      // sql.js reports a SELECT that matched nothing exactly like a statement
      // with no result set at all, so "silent" and "zero rows" are the same
      // observation. A test may say it wants zero rows; anything else means the
      // learner wrote a statement that answers nothing.
      const wantsNothing = test.expectRows !== undefined && test.expectRows.length === 0
      if (result.silent && !wantsNothing) {
        outcomes.push({
          test,
          passed: false,
          detail: 'This statement returned no rows.',
        })
        continue
      }

      if (test.expectColumns && !result.silent) {
        const got = result.columns.map((c) => c.toLowerCase())
        const want = test.expectColumns.map((c) => c.toLowerCase())
        if (got.length !== want.length || !want.every((c, i) => c === got[i])) {
          outcomes.push({
            test,
            passed: false,
            detail: `Columns should be ${test.expectColumns.join(', ')} — got ${result.columns.join(', ') || '(none)'}`,
          })
          continue
        }
      }

      if (test.expectRows) {
        if (!sameRows(result.rows, test.expectRows, test.ordered === true)) {
          outcomes.push({
            test,
            passed: false,
            got: result,
            want: test.expectRows,
            wantColumns: expectedHeaders(test, result.columns),
          })
          continue
        }
      }

      outcomes.push({ test, passed: true })
    } finally {
      db.close()
    }
  }

  return outcomes
}
