import { useMemo, useState } from 'react'
import type { Step } from '../content/types'
import { useI18n } from '../i18n'
import { runPython, runTests, type TestOutcome } from '../lib/python'
import { CodeBlock, CodeEditor, Output, Rich } from './ui'

interface Props {
  step: Step
  /** Already answered correctly — the step is now read-only. */
  solved: boolean
  onSolved: () => void
  onWrong: () => void
  /** True when the learner has no hearts left and is not in practice mode. */
  blocked: boolean
}

export default function StepView(props: Props) {
  switch (props.step.kind) {
    case 'concept':
      return <ConceptStep {...props} step={props.step} />
    case 'quiz':
      return <QuizStep {...props} step={props.step} />
    case 'fill':
      return <FillStep {...props} step={props.step} />
    case 'order':
      return <OrderStep {...props} step={props.step} />
    case 'code':
      return <CodeStep {...props} step={props.step} />
  }
}

/* --------------------------------------------------------------- concept */

function ConceptStep({ step, onSolved, solved }: Props & { step: Extract<Step, { kind: 'concept' }> }) {
  const { t, tc } = useI18n()
  return (
    <div className="card">
      <h2>{tc(step.title)}</h2>
      <p>
        <Rich text={tc(step.body)} />
      </p>
      {step.code && (
        <>
          <div className="io-label">{t('worked')}</div>
          <CodeBlock>{step.code}</CodeBlock>
        </>
      )}
      {step.output && (
        <>
          <div className="io-label">{t('output')}</div>
          <Output text={step.output} />
        </>
      )}
      {!solved && (
        <button className="btn" style={{ marginTop: 14 }} onClick={onSolved}>
          {t('continueNext')}
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ quiz */

function QuizStep({ step, solved, onSolved, onWrong, blocked }: Props & { step: Extract<Step, { kind: 'quiz' }> }) {
  const { t, tc } = useI18n()
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  const right = picked === step.answer

  function check() {
    if (picked === null) return
    setChecked(true)
    if (picked === step.answer) onSolved()
    else onWrong()
  }

  return (
    <div className="card">
      <h3>{tc(step.prompt)}</h3>
      {step.code && <CodeBlock>{step.code}</CodeBlock>}

      {step.options.map((o, i) => {
        let cls = 'choice'
        if (checked && i === step.answer) cls += ' right'
        else if (checked && i === picked) cls += ' wrong'
        else if (picked === i) cls += ' picked'
        return (
          <button
            className={cls}
            key={i}
            disabled={checked && right}
            onClick={() => {
              setPicked(i)
              setChecked(false)
            }}
          >
            <span className="key">{String.fromCharCode(65 + i)}</span>
            <span>{tc(o)}</span>
          </button>
        )
      })}

      {checked && (
        <div className={right ? 'verdict ok' : 'verdict no'}>
          <b>{right ? t('correct') : t('notQuite')}</b>
          <Rich text={tc(step.explain)} />
        </div>
      )}

      {!solved && (
        <button className="btn" style={{ marginTop: 14 }} onClick={check} disabled={picked === null || blocked}>
          {t('check')}
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ fill */

function FillStep({ step, solved, onSolved, onWrong, blocked }: Props & { step: Extract<Step, { kind: 'fill' }> }) {
  const { t, tc } = useI18n()
  const segments = useMemo(() => step.template.split('___'), [step.template])
  const [values, setValues] = useState<string[]>(() => step.blanks.map(() => ''))
  const [checked, setChecked] = useState(false)

  const right = values.every((v, i) => v.trim() === step.blanks[i])

  function check() {
    setChecked(true)
    if (right) onSolved()
    else onWrong()
  }

  return (
    <div className="card">
      <h3>{tc(step.prompt)}</h3>
      <pre className="code">
        {segments.map((seg, i) => (
          <span key={i}>
            {seg}
            {i < segments.length - 1 && (
              <input
                className="blank"
                value={values[i] ?? ''}
                disabled={solved}
                aria-label={`blank ${i + 1}`}
                onChange={(e) => {
                  const next = [...values]
                  next[i] = e.target.value
                  setValues(next)
                  setChecked(false)
                }}
              />
            )}
          </span>
        ))}
      </pre>

      {checked && (
        <div className={right ? 'verdict ok' : 'verdict no'}>
          <b>{right ? t('correct') : t('notQuite')}</b>
          {right ? <Rich text={tc(step.explain)} /> : <span className="small muted">{tc(step.explain)}</span>}
        </div>
      )}

      {!solved && (
        <button
          className="btn"
          style={{ marginTop: 14 }}
          onClick={check}
          disabled={blocked || values.some((v) => !v.trim())}
        >
          {t('check')}
        </button>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------- order */

/** Deterministic shuffle so the lines do not jump around on every render. */
function shuffled(lines: string[], seed: string): number[] {
  const order = lines.map((_, i) => i)
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  for (let i = order.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const j = h % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  // Never hand back the finished answer.
  if (order.every((v, i) => v === i) && order.length > 1) {
    ;[order[0], order[1]] = [order[1], order[0]]
  }
  return order
}

function OrderStep({ step, solved, onSolved, onWrong, blocked }: Props & { step: Extract<Step, { kind: 'order' }> }) {
  const { t, tc } = useI18n()
  const [order, setOrder] = useState<number[]>(() => shuffled(step.lines, step.id))
  const [checked, setChecked] = useState(false)

  const right = order.every((v, i) => v === i)

  function move(from: number, dir: -1 | 1) {
    const to = from + dir
    if (to < 0 || to >= order.length) return
    const next = [...order]
    ;[next[from], next[to]] = [next[to], next[from]]
    setOrder(next)
    setChecked(false)
  }

  function check() {
    setChecked(true)
    if (right) onSolved()
    else onWrong()
  }

  return (
    <div className="card">
      <h3>{tc(step.prompt)}</h3>
      <p className="small muted">{t('dragToOrder')}</p>

      {order.map((lineIndex, pos) => (
        <div className="orderline" key={lineIndex}>
          <span>{step.lines[lineIndex] === '' ? ' ' : step.lines[lineIndex]}</span>
          <span className="grip">
            <button onClick={() => move(pos, -1)} disabled={pos === 0 || solved} aria-label={t('moveUp')}>
              ↑
            </button>
            <button
              onClick={() => move(pos, 1)}
              disabled={pos === order.length - 1 || solved}
              aria-label={t('moveDown')}
            >
              ↓
            </button>
          </span>
        </div>
      ))}

      {checked && (
        <div className={right ? 'verdict ok' : 'verdict no'}>
          <b>{right ? t('correct') : t('notQuite')}</b>
          {right && <Rich text={tc(step.explain)} />}
        </div>
      )}

      {!solved && (
        <button className="btn" style={{ marginTop: 14 }} onClick={check} disabled={blocked}>
          {t('check')}
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ code */

export function TestList({ outcomes }: { outcomes: TestOutcome[] }) {
  const { t, tc } = useI18n()
  return (
    <div style={{ marginTop: 12 }}>
      {outcomes.map((o, i) => (
        <div className={o.passed ? 'testrow pass' : 'testrow fail'} key={i}>
          <span className="mark">{o.passed ? '✓' : '✕'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div>{tc(o.test.name)}</div>
            {!o.passed && o.detail && <div className="small muted">{o.detail}</div>}
            {!o.passed && !o.detail && o.test.expectOutput !== undefined && (
              <div className="grid two small" style={{ marginTop: 6 }}>
                <div>
                  <div className="io-label">{t('yourAnswer')}</div>
                  <Output text={o.stdout || '(kosong)'} />
                </div>
                <div>
                  <div className="io-label">{t('expected')}</div>
                  <Output text={o.test.expectOutput} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function CodeStep({ step, solved, onSolved, onWrong, blocked }: Props & { step: Extract<Step, { kind: 'code' }> }) {
  const { t, tc } = useI18n()
  const [code, setCode] = useState(step.starter)
  const [busy, setBusy] = useState(false)
  const [loadingPy, setLoadingPy] = useState(false)
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null)
  const [runOut, setRunOut] = useState<{ text: string; error: boolean } | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  const allPass = outcomes !== null && outcomes.every((o) => o.passed)

  async function doRun() {
    setBusy(true)
    setLoadingPy(true)
    try {
      const res = await runPython(code)
      setRunOut({ text: res.error ? `${res.stdout}${res.error}` : res.stdout || '(tidak ada keluaran)', error: Boolean(res.error) })
      setOutcomes(null)
    } finally {
      setLoadingPy(false)
      setBusy(false)
    }
  }

  async function doCheck() {
    setBusy(true)
    setLoadingPy(true)
    try {
      const res = await runTests(code, step.tests)
      setOutcomes(res)
      setRunOut(null)
      if (res.every((o) => o.passed)) onSolved()
      else onWrong()
    } finally {
      setLoadingPy(false)
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <h3>
        <Rich text={tc(step.prompt)} />
      </h3>

      <CodeEditor value={code} onChange={setCode} disabled={solved} />

      <div className="row">
        <button className="btn soft sm" onClick={() => void doRun()} disabled={busy}>
          ▶ {t('runCode')}
        </button>
        {!solved && (
          <button className="btn sm" onClick={() => void doCheck()} disabled={busy || blocked}>
            {t('check')}
          </button>
        )}
        {step.hints.length > 0 && hintsShown < step.hints.length && !solved && (
          <button className="btn ghost sm" onClick={() => setHintsShown((n) => n + 1)}>
            💡 {t('hint')} ({hintsShown}/{step.hints.length})
          </button>
        )}
        {hintsShown >= step.hints.length && !solved && !showSolution && (
          <button className="btn ghost sm" onClick={() => setShowSolution(true)}>
            {t('showSolution')}
          </button>
        )}
      </div>

      {busy && loadingPy && (
        <p className="small muted" style={{ marginTop: 10 }}>
          🐍 {t('loadingPython')} <span className="muted">{t('loadingPythonNote')}</span>
        </p>
      )}

      {step.hints.slice(0, hintsShown).map((h, i) => (
        <div className="banner" key={i} style={{ marginTop: 10, marginBottom: 0 }}>
          <span>💡</span>
          <span>
            <Rich text={tc(h)} />
          </span>
        </div>
      ))}

      {showSolution && (
        <div style={{ marginTop: 12 }}>
          <div className="io-label">{t('showSolution')}</div>
          <CodeBlock>{step.solution}</CodeBlock>
          <button className="btn ghost sm" onClick={() => setCode(step.solution)}>
            ↧ {tc({ en: 'Copy into the editor', id: 'Salin ke editor' })}
          </button>
        </div>
      )}

      {runOut && (
        <div style={{ marginTop: 12 }}>
          <div className="io-label">{t('output')}</div>
          <Output text={runOut.text} error={runOut.error} />
        </div>
      )}

      {outcomes && (
        <>
          <div className={allPass ? 'verdict ok' : 'verdict no'} style={{ marginTop: 12 }}>
            <b>{allPass ? t('allTestsPass') : t('someTestsFail')}</b>
          </div>
          <TestList outcomes={outcomes} />
        </>
      )}
    </div>
  )
}
