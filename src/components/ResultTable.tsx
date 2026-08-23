/** A result grid for SQL. Rows are what the learner is reasoning about, so they
 *  are shown as a table rather than dumped as text. */

import { useI18n } from '../i18n'
import type { SqlResult, SqlValue } from '../lib/sql'

const show = (v: SqlValue): string => {
  if (v === null) return 'NULL'
  if (v instanceof Uint8Array) return `(${v.length} bytes)`
  return String(v)
}

export function ResultTable({ result, cap = 20 }: { result: SqlResult; cap?: number }) {
  const { tc } = useI18n()

  if (result.error) return <pre className="out err">{result.error}</pre>

  if (result.silent) {
    return (
      <p className="small muted" style={{ margin: 0 }}>
        {tc({
          en: 'No rows came back. Either the statement changes data rather than returning it, or nothing matched — query the table to see.',
          id: 'Tidak ada baris yang kembali. Entah pernyataannya mengubah data alih-alih mengembalikannya, atau tidak ada yang cocok — kueri tabelnya untuk melihat.',
        })}
      </p>
    )
  }

  if (result.rows.length === 0) {
    return (
      <p className="small muted" style={{ margin: 0 }}>
        {tc({ en: '0 rows', id: '0 baris' })}
      </p>
    )
  }

  const shown = result.rows.slice(0, cap)

  return (
    <div className="gridwrap">
      <table className="rows">
        <thead>
          <tr>
            {result.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => (
                <td key={j} className={v === null ? 'nul' : undefined}>
                  {show(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small muted" style={{ margin: '6px 0 0' }}>
        {result.rows.length} {tc({ en: 'rows', id: 'baris' })}
        {result.rows.length > cap && ` — ${tc({ en: 'showing first', id: 'menampilkan' })} ${cap}`}
      </p>
    </div>
  )
}

/** The two grids shown side by side when a check fails on its rows. */
export function RowDiff({
  got,
  want,
  columns,
  wantColumns,
}: {
  got: SqlValue[][]
  want: SqlValue[][]
  columns: string[]
  wantColumns: string[]
}) {
  const { t } = useI18n()
  return (
    <div className="grid two small" style={{ marginTop: 6 }}>
      <div>
        <div className="io-label">{t('yourAnswer')}</div>
        <ResultTable result={{ columns, rows: got }} cap={8} />
      </div>
      <div>
        <div className="io-label">{t('expected')}</div>
        <ResultTable result={{ columns: wantColumns, rows: want }} cap={8} />
      </div>
    </div>
  )
}
