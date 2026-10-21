import { useState } from 'react'
import { useI18n } from '../../i18n'
import { FORM_CASES, LIMIT_CASES, cauchy, lhopital, powerLimit, type Beh, type Form, type Lhopital, type Result, type Side } from '../../lib/lhopital'
import { FAIL_CASES, niceTex } from '../../lib/lhopitalshow'
import { evalFloat, toTex } from '../../lib/chain'
import { parseFunction } from '../../lib/linearize'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'
import { numOf } from './ExtremeWidgets'
import { yRange } from './MvtWidgets'
import type { WidgetName } from '../../content/articles/types'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)

const ERR = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, powers such as x^2, sqrt(…), sin(…), cos(…), tan(…), e^x, ln(…), for example sin(x).', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, pangkat seperti x^2, sqrt(…), sin(…), cos(…), tan(…), e^x, ln(…), misalnya sin(x).' },
  big: { en: 'That is too long. Try a shorter one.', id: 'Itu terlalu panjang. Coba yang lebih pendek.' },
  point: { en: 'Type the point a as a number such as 0, 2 or pi/2, or as inf or -inf.', id: 'Ketik titik a sebagai bilangan seperti 0, 2, atau pi/2, atau sebagai inf atau -inf.' },
}

const FORM_LABEL: Record<Form, { en: string; id: string }> = {
  '0/0': { en: 'the form 0/0: apply the rule', id: 'bentuk 0/0: terapkan aturan' },
  'inf/inf': { en: 'the form ∞/∞: apply the rule', id: 'bentuk ∞/∞: terapkan aturan' },
  determinate: { en: 'not indeterminate: stop and read the limit', id: 'bukan bentuk tak tentu: berhenti dan baca limitnya' },
}

const sideWord = (b: Beh | undefined, sep: string): string => {
  if (!b) return ''
  if (b.kind === 'zero') return '0'
  if (b.kind === 'inf') return b.sign > 0 ? '+∞' : '−∞'
  if (b.kind === 'finite') return four(b.value, sep)
  return '?'
}
const behText = (n: { plus?: Beh; minus?: Beh }, sep: string): string => {
  const p = sideWord(n.plus, sep)
  const m = sideWord(n.minus, sep)
  return p && m ? (p === m ? p : `${m} / ${p}`) : p || m
}

/** The limit value as TeX. */
const resultTex = (r: Result): string => (r.kind === 'finite' ? niceTex(r.value) : r.kind === 'inf' ? (r.sign > 0 ? '\\infty' : '-\\infty') : '\\text{DNE}')

function ResultLine({ r, tc }: { r: Result; tc: (l: { en: string; id: string }) => string }) {
  if (r.kind === 'dne') return <span className="noline">{tc(L('does not exist', 'tidak ada'))}</span>
  return <Tex src={resultTex(r)} />
}

function StepsView({ r, sep, tc }: { r: Lhopital; sep: string; tc: (l: { en: string; id: string }) => string }) {
  const last = r.steps.length - 1
  return (
    <>
      <ol className="lhsteps">
        {r.steps.map((s, i) => (
          <li key={i}>
            <Tex src={`${i === 0 ? '' : '\\to\\ '}${s.tex}`} />
            <div className="small muted">
              {tc(L('numerator →', 'pembilang →'))} {behText(s.numBeh, sep)}; {tc(L('denominator →', 'penyebut →'))} {behText(s.denBeh, sep)}: {tc(FORM_LABEL[s.form])}
              {i === last && r.status === 'cycle' ? ` (${tc(L('this quotient has come back: the rule is going round in a circle', 'hasil bagi ini kembali: aturan berputar-putar'))})` : ''}
            </div>
          </li>
        ))}
      </ol>
      <div className="wgtout" aria-live="polite">
        {r.status === 'done' && (
          <p className="okline">
            {tc(L('The limit is', 'Limitnya adalah'))} <ResultLine r={r.result} tc={tc} />.
          </p>
        )}
        {r.status === 'notindeterminate' && (
          <p className="okline">
            {tc(L('The quotient is not indeterminate, so the rule is not used. The limit is', 'Hasil bagi bukan bentuk tak tentu, sehingga aturan tidak dipakai. Limitnya adalah'))} <ResultLine r={r.result} tc={tc} />.
          </p>
        )}
        {r.status === 'cycle' && (
          <p className="noline">
            {tc(L('The rule goes round in a circle and never reaches a determinate quotient.', 'Aturan berputar-putar dan tidak pernah sampai ke hasil bagi yang tentu.'))}
            {r.direct && r.direct.kind !== 'dne' ? (
              <>
                {' '}
                {tc(L('Read directly, the quotient tends to', 'Dibaca langsung, hasil bagi mendekati'))} <ResultLine r={r.direct} tc={tc} />.
              </>
            ) : null}
          </p>
        )}
        {r.status === 'inconclusive' && (
          <p className="noline">
            {tc(L('The quotient of derivatives has no limit, so the rule says nothing about the original quotient.', 'Hasil bagi turunan tidak punya limit, sehingga aturan tidak menyatakan apa pun tentang hasil bagi semula.'))}
            {r.direct && r.direct.kind !== 'dne' ? (
              <>
                {' '}
                {tc(L('Read directly, the quotient tends to', 'Dibaca langsung, hasil bagi mendekati'))} <ResultLine r={r.direct} tc={tc} />.
              </>
            ) : null}
          </p>
        )}
        {r.status === 'many' && <p className="noline">{tc(L('After six rounds the quotient is still indeterminate: try another method.', 'Setelah enam putaran hasil bagi masih tak tentu: coba cara lain.'))}</p>}
      </div>
    </>
  )
}

const SIDE_CHIPS: { id: Side; label: string }[] = [
  { id: 'both', label: 'x → a' },
  { id: 'plus', label: 'x → a⁺' },
  { id: 'minus', label: 'x → a⁻' },
]

interface StepperPreset {
  id: string
  tex: string
  num: string
  den: string
  a: number
  side: Side
  note: { en: string; id: string }
}

const aText = (a: number): string => (a === Infinity ? 'inf' : a === -Infinity ? '-inf' : Math.abs(a - Math.PI / 2) < 1e-12 ? 'pi/2' : String(a))

/** The stepper: a numerator, a denominator and a point, and the rule applied round by round. */
function Stepper({ name, presets }: { name: WidgetName; presets: StepperPreset[] }) {
  const { tc } = useI18n()
  const sep = useSep()
  const [num, setNum] = useState(presets[0].num)
  const [den, setDen] = useState(presets[0].den)
  const [aStr, setAStr] = useState(aText(presets[0].a))
  const [side, setSide] = useState<Side>(presets[0].side)
  const [note, setNote] = useState(presets[0].note)
  const aNum = aStr.trim() === 'inf' || aStr.trim() === '+inf' ? Infinity : aStr.trim() === '-inf' ? -Infinity : numOf(aStr)
  const r = aNum === null ? null : lhopital(num, den, aNum, side)
  return (
    <Frame name={name}>
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={num} aria-label="f(x)" onChange={(e) => setNum(e.target.value)} />
        </label>
        <label className="lbl" style={{ width: '100%' }}>
          g(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={den} aria-label="g(x)" onChange={(e) => setDen(e.target.value)} />
        </label>
        <label className="lbl">
          a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {SIDE_CHIPS.map((c) => (
          <button key={c.id} className={`chip ${side === c.id ? 'on' : ''}`} onClick={() => setSide(c.id)} aria-pressed={side === c.id}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="chips">
        {presets.map((c) => (
          <button
            key={c.id}
            className="chip ghost"
            onClick={() => {
              setNum(c.num)
              setDen(c.den)
              setAStr(aText(c.a))
              setSide(c.side)
              setNote(c.note)
            }}
          >
            <Tex src={c.tex} />
          </button>
        ))}
      </div>
      {r === null ? <p className="noline">{tc(ERR.point)}</p> : !r.ok ? <p className="noline">{tc(ERR[r.error])}</p> : <StepsView r={r} sep={sep} tc={tc} />}
      <p className="small">{tc(note)}</p>
    </Frame>
  )
}

export function LhopitalTool() {
  return <Stepper name="lhopitaltool" presets={LIMIT_CASES.filter((c) => !['cycle', 'inconclusive', 'ex3b', 'ex5a', 'ex5b', 'ex6'].includes(c.id))} />
}

export function LhopitalFail() {
  return <Stepper name="lhopitalfail" presets={FAIL_CASES} />
}

/* --------------------------------------------------------------- the other indeterminate forms */

export function FormsTool() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('x-ln-x')
  const c = FORM_CASES.find((k) => k.id === id) ?? FORM_CASES[0]
  const run = c.pow ? powerLimit(c.pow.f, c.pow.g, c.a, c.side) : lhopital(c.num as string, c.den as string, c.a, c.side)
  return (
    <Frame name="formstool">
      <div className="chips">
        {FORM_CASES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={k.tex} />
          </button>
        ))}
      </div>
      <p>
        <Tex src={c.tex} />, {tc(L('the form', 'bentuk'))} <b>{tc(c.kind)}</b>
      </p>
      {!run.ok ? (
        <p className="noline">{tc(ERR[run.error])}</p>
      ) : c.pow && 'log' in run ? (
        <>
          <p>
            <Tex src={`y=f^g\\ \\Rightarrow\\ \\ln y=g\\ln f=\\dfrac{\\ln f}{1/g}`} />
          </p>
          {run.log ? <StepsView r={run.log} sep={sep} tc={tc} /> : null}
          <div className="wgtout">
            <p className="okline">
              {tc(L('The limit of ln y is L, so the limit of y is e^L =', 'Limit ln y adalah L, sehingga limit y adalah e^L ='))} <ResultLine r={run.result} tc={tc} />.
            </p>
          </div>
        </>
      ) : 'steps' in run ? (
        <>
          <p className="small">{tc(c.note)}</p>
          <StepsView r={run} sep={sep} tc={tc} />
        </>
      ) : null}
      <p className="small">{tc(c.note)}</p>
    </Frame>
  )
}

/* ---------------------------------------------------------------- Cauchy's Mean Value Theorem */

interface CauchyPreset {
  f: string
  g: string
  a: number
  b: number
}
const CAUCHY_PRESETS: CauchyPreset[] = [
  { f: 'x^3', g: 'x^2', a: 0, b: 2 },
  { f: 'sin(x)', g: 'cos(x)', a: 0, b: Math.PI / 2 },
  { f: 'x^2+3*x', g: 'x', a: 1, b: 4 },
  { f: 'e^x', g: 'x^2', a: 1, b: 2 },
  { f: 'x', g: 'x^2', a: -1, b: 1 },
]

export function CauchyTool() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fs, setFs] = useState(CAUCHY_PRESETS[0].f)
  const [gs, setGs] = useState(CAUCHY_PRESETS[0].g)
  const [aStr, setAStr] = useState('0')
  const [bStr, setBStr] = useState('2')
  const a = numOf(aStr)
  const b = numOf(bStr)
  let body
  const f = parseFunction(fs)
  const g = parseFunction(gs)
  if (a === null || b === null || !(a < b)) body = <p className="noline">{tc(L('Type two numbers a < b, such as 0 and 2.', 'Ketik dua bilangan a < b, seperti 0 dan 2.'))}</p>
  else if (typeof f === 'string' || typeof g === 'string') body = <p className="noline">{tc(ERR.syntax)}</p>
  else {
    const r = cauchy(fs, gs, a, b)
    if (!r.ok) body = <p className="noline">{tc(r.error === 'point' ? L('f and g must be defined at a and at b.', 'f dan g harus terdefinisi di a dan di b.') : ERR[r.error])}</p>
    else {
      const N = 160
      const pts = Array.from({ length: N + 1 }, (_, i) => {
        const t = a + ((b - a) * i) / N
        return { x: evalFloat(g, t), y: evalFloat(f, t) }
      }).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
      const [x0, x1] = yRange(pts.map((p) => p.x), false)
      const [y0, y1] = yRange(pts.map((p) => p.y), false)
      const segs = pts.slice(1).map((p, i) => ({ x1: pts[i].x, y1: pts[i].y, x2: p.x, y2: p.y, cls: 'tancurve' }))
      const span = x1 - x0
      const tangents = r.points.map((c) => {
        const gx = evalFloat(g, c)
        const fy = evalFloat(f, c)
        return { x1: gx - span * 0.3, y1: fy - r.slope * span * 0.3, x2: gx + span * 0.3, y2: fy + r.slope * span * 0.3, cls: 'tantan' }
      })
      body = (
        <>
          <Plot
            xr={[x0, x1]}
            yr={[y0, y1]}
            segs={[...segs, { x1: r.ga, y1: r.fa, x2: r.gb, y2: r.fb, cls: 'tansec' }, ...tangents]}
            dots={[
              { x: r.ga, y: r.fa, label: 'A' },
              { x: r.gb, y: r.fb, label: 'B' },
              ...r.points.map((c) => ({ x: evalFloat(g, c), y: evalFloat(f, c), cls: 'tandot sec' })),
            ]}
            label={tc(L('The curve (g(t), f(t)), the secant through its ends and the tangents parallel to it', 'Kurva (g(t), f(t)), tali busur melalui ujungnya, dan garis singgung yang sejajar dengannya'))}
          />
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={`\\dfrac{f(b)-f(a)}{g(b)-g(a)}=\\dfrac{${four(r.fb, sep).replace('−', '-')}-(${four(r.fa, sep).replace('−', '-')})}{${four(r.gb, sep).replace('−', '-')}-(${four(r.ga, sep).replace('−', '-')})}=${four(r.slope, sep).replace('−', '-')}`} />
            </p>
            <p className={r.gPrimeNonzero ? 'okline' : 'noline'}>
              {r.gPrimeNonzero ? tc(L('g′ is never zero on (a, b): Cauchy’s theorem applies.', 'g′ tidak pernah nol pada (a, b): teorema Cauchy berlaku.')) : tc(L('g′ is zero somewhere in (a, b): the hypothesis fails and nothing is promised.', 'g′ nol di suatu tempat pada (a, b): syaratnya gagal dan tidak ada yang dijanjikan.'))}
            </p>
            {r.points.length ? (
              <p>
                f′(c)/g′(c) = {four(r.slope, sep)} {tc(L('at c =', 'di c ='))} <b>{r.points.map((c) => four(c, sep)).join(', ')}</b>
              </p>
            ) : (
              <p className="noline">{tc(L('No point of (a, b) has f′/g′ equal to the slope.', 'Tidak ada titik di (a, b) dengan f′/g′ sama dengan gradien.'))}</p>
            )}
            <p className="small">{tc(L('For g(t) = t it is the Mean Value Theorem. Dark: the curve; orange: the secant; green: the tangents parallel to it.', 'Untuk g(t) = t ini adalah Teorema Nilai Rata-rata. Gelap: kurva; oranye: tali busur; hijau: garis singgung yang sejajar dengannya.'))}</p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="cauchytool">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f(t) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={fs} aria-label="f(t)" onChange={(e) => setFs(e.target.value)} />
        </label>
        <label className="lbl" style={{ width: '100%' }}>
          g(t) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={gs} aria-label="g(t)" onChange={(e) => setGs(e.target.value)} />
        </label>
        <label className="lbl">
          a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
        </label>
        <label className="lbl">
          b = <input style={{ width: '5em' }} value={bStr} aria-label="b" onChange={(e) => setBStr(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {CAUCHY_PRESETS.map((q) => (
          <button key={q.f + q.g} className="chip ghost" onClick={() => { setFs(q.f); setGs(q.g); setAStr(q.a === Math.PI / 2 ? 'pi/2' : String(q.a)); setBStr(q.b === Math.PI / 2 ? 'pi/2' : String(q.b)) }}>
            <Tex src={`f=${toTexSafe(q.f)},\\ g=${toTexSafe(q.g)}`} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

function toTexSafe(src: string): string {
  const n = parseFunction(src)
  return typeof n === 'string' ? src : toTex(n)
}
