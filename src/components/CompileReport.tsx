/** What pressing Run tells a TypeScript learner: first whether the compiler
 *  objected, and only then what the program did.
 *
 *  The emitted JavaScript is offered underneath. Seeing the annotations simply
 *  gone is the clearest possible statement that types are a compile-time thing
 *  — no amount of prose lands it the same way. */

import { useI18n } from '../i18n'
import { describe, type TsCompile } from '../lib/ts'
import { CodeBlock, LivePreview, Output } from './ui'

export function CompileReport({ result }: { result: TsCompile }) {
  const { t, tc } = useI18n()

  if (result.diagnostics.length > 0) {
    return (
      <div style={{ marginTop: 12 }}>
        <div className="io-label">{tc({ en: 'The compiler objects', id: 'Kompilernya keberatan' })}</div>
        <Output text={result.diagnostics.map(describe).join('\n')} error />
      </div>
    )
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div className="verdict ok" style={{ marginTop: 0 }}>
        <b>{tc({ en: 'No type errors.', id: 'Tidak ada galat tipe.' })}</b>
      </div>
      <div className="io-label">{t('output')}</div>
      <LivePreview source={result.js} js height={160} />
      <details style={{ marginTop: 10 }}>
        <summary className="io-label" style={{ cursor: 'pointer' }}>
          {tc({ en: 'The JavaScript it compiled to', id: 'JavaScript hasil kompilasinya' })}
        </summary>
        <CodeBlock>{result.js.trim()}</CodeBlock>
      </details>
    </div>
  )
}
