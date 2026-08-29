/** One way of showing check results, whichever runtime produced them. */

import type { Loc } from '../content/types'
import type { TestOutcome } from '../lib/python'
import type { WebOutcome } from '../lib/web'
import type { SqlOutcome, SqlValue } from '../lib/sql'
import type { TsOutcome } from '../lib/ts'
import type { TestOutcome as CppOutcome } from '../lib/cpp'
import { useI18n } from '../i18n'
import { Output } from './ui'
import { RowDiff } from './ResultTable'

export interface ResultRow {
  name: Loc
  passed: boolean
  detail?: string
  /** Shown side by side when the check was an exact-output comparison. */
  got?: string
  want?: string
  /** Same idea, but for SQL: two result grids instead of two strings. */
  sql?: { got: SqlValue[][]; want: SqlValue[][]; columns: string[]; wantColumns: string[] }
}

export const fromPython = (outcomes: TestOutcome[]): ResultRow[] =>
  outcomes.map((o) => ({
    name: o.test.name,
    passed: o.passed,
    detail: o.detail,
    got: !o.passed && !o.detail && o.test.expectOutput !== undefined ? o.stdout : undefined,
    want: !o.passed && !o.detail && o.test.expectOutput !== undefined ? o.test.expectOutput : undefined,
  }))

export const fromWeb = (outcomes: WebOutcome[]): ResultRow[] =>
  outcomes.map((o) => ({ name: o.test.name, passed: o.passed, detail: o.detail }))

/** A failed row comparison carries two grids rather than two blobs of text, so
 *  it is handed through untouched for ResultList to render. */
export const fromSql = (outcomes: SqlOutcome[]): ResultRow[] =>
  outcomes.map((o) => ({
    name: o.test.name,
    passed: o.passed,
    detail: o.detail,
    sql:
      o.got && o.want
        ? {
            got: o.got.rows,
            want: o.want,
            columns: o.got.columns,
            wantColumns: o.wantColumns ?? o.got.columns,
          }
        : undefined,
  }))

/** Type errors are already one line each; they only need carrying across. */
export const fromTs = (outcomes: TsOutcome[]): ResultRow[] =>
  outcomes.map((o) => ({ name: o.test.name, passed: o.passed, detail: o.detail }))

export const fromCpp = (outcomes: CppOutcome[]): ResultRow[] =>
  outcomes.map((o) => ({
    name: o.test.name,
    passed: o.passed,
    detail: o.detail,
    got: !o.passed && !o.detail && o.test.expectOutput !== undefined ? o.stdout : undefined,
    want: !o.passed && !o.detail && o.test.expectOutput !== undefined ? o.test.expectOutput : undefined,
  }))

export function ResultList({ rows }: { rows: ResultRow[] }) {
  const { t, tc } = useI18n()
  return (
    <div style={{ marginTop: 12 }}>
      {rows.map((r, i) => (
        <div className={r.passed ? 'testrow pass' : 'testrow fail'} key={i}>
          <span className="mark">{r.passed ? '✓' : '✕'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div>{tc(r.name)}</div>
            {!r.passed && r.detail && <div className="small muted detail">{r.detail}</div>}
            {!r.passed && r.sql && (
              <RowDiff
                got={r.sql.got}
                want={r.sql.want}
                columns={r.sql.columns}
                wantColumns={r.sql.wantColumns}
              />
            )}
            {!r.passed && r.want !== undefined && (
              <div className="grid two small" style={{ marginTop: 6 }}>
                <div>
                  <div className="io-label">{t('yourAnswer')}</div>
                  <Output text={r.got || '(kosong)'} />
                </div>
                <div>
                  <div className="io-label">{t('expected')}</div>
                  <Output text={r.want} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
