/** One way of showing check results, whichever runtime produced them. */

import type { Loc } from '../content/types'
import type { TestOutcome } from '../lib/python'
import type { WebOutcome } from '../lib/web'
import { useI18n } from '../i18n'
import { Output } from './ui'

export interface ResultRow {
  name: Loc
  passed: boolean
  detail?: string
  /** Shown side by side when the check was an exact-output comparison. */
  got?: string
  want?: string
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

export function ResultList({ rows }: { rows: ResultRow[] }) {
  const { t, tc } = useI18n()
  return (
    <div style={{ marginTop: 12 }}>
      {rows.map((r, i) => (
        <div className={r.passed ? 'testrow pass' : 'testrow fail'} key={i}>
          <span className="mark">{r.passed ? '✓' : '✕'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div>{tc(r.name)}</div>
            {!r.passed && r.detail && <div className="small muted">{r.detail}</div>}
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
