import { useState } from 'react'
import { useI18n } from '../../i18n'
import { FAIL_CASES, basin, bisectionSteps, errorTable, newton, reciprocalIterates, rootIterates, type FailCase, type NewtonRun, type NewtonStatus } from '../../lib/newton'
import { derive, evalFloat, toTex } from '../../lib/chain'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'
import { numOf } from './ExtremeWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(6)), sep)
const SUB = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number): string => String(n).replace(/\d/g, (d) => SUB[Number(d)])

const ERR = {
  syntax: { en: 'I could not read that function. Use x, numbers, + - * /, powers such as x^2, sqrt(…), sin(…), cos(…), tan(…), e^x, ln(…), arctan(…), for example x^3-x-1.', id: 'Saya tidak dapat membaca fungsi itu. Pakai x, bilangan, + - * /, pangkat seperti x^2, sqrt(…), sin(…), cos(…), tan(…), e^x, ln(…), arctan(…), misalnya x^3-x-1.' },
  big: { en: 'That function is too long. Try a shorter one.', id: 'Fungsi itu terlalu panjang. Coba yang lebih pendek.' },
  start: { en: 'Type the starting value as a number such as 1, -1.5 or pi/2.', id: 'Ketik nilai awal sebagai bilangan seperti 1, -1,5, atau pi/2.' },
}

const STATUS_TEXT: Record<NewtonStatus, { en: string; id: string }> = {
  converged: { en: 'It converged: the approximations stopped changing, so f(x) is zero to the arithmetic.', id: 'Konvergen: hampiran berhenti berubah, sehingga f(x) nol sejauh ketelitian hitung.' },
  flat: { en: 'f′(xₙ) = 0: the tangent is horizontal and never meets the x-axis, so there is no next step.', id: 'f′(xₙ) = 0: garis singgungnya mendatar dan tidak pernah memotong sumbu-x, sehingga tidak ada langkah berikutnya.' },
  cycle: { en: 'The approximations repeat: the method goes round a cycle and never gets closer to a root.', id: 'Hampiran berulang: metode berputar dalam suatu siklus dan tidak pernah mendekati akar.' },
  diverged: { en: 'The approximations run off to infinity: each step is farther from a root than the one before.', id: 'Hampiran lari ke tak hingga: setiap langkah lebih jauh dari akar daripada langkah sebelumnya.' },
  undefined: { en: 'f or f′ is not defined at the latest approximation, so the method cannot go on.', id: 'f atau f′ tidak terdefinisi di hampiran terakhir, sehingga metode tidak dapat dilanjutkan.' },
  unfinished: { en: 'Not finished after the steps allowed: it may be converging slowly (a root that is not simple, or a very flat curve).', id: 'Belum selesai setelah langkah yang diizinkan: mungkin konvergen lambat (akar yang tidak sederhana, atau kurva yang sangat datar).' },
}

/* --------------------------------------------------------------- the picture of the steps */

/** The graph of f with the first `k` steps of Newton's method drawn on it: up to the curve, along the tangent down to the axis. */
function StepsPlot({ run, k, xr, yr }: { run: NewtonRun; k: number; xr: [number, number]; yr: [number, number] }) {
  const { tc } = useI18n()
  const used = run.steps.slice(0, k).filter((s) => Number.isFinite(s.next))
  const segs = used.flatMap((s) => [
    { x1: s.x, y1: 0, x2: s.x, y2: s.fx, cls: 'tantan faint' },
    { x1: s.x, y1: s.fx, x2: s.next, y2: 0, cls: 'tansec' },
  ])
  const dots = used.slice(0, 6).map((s, i) => ({ x: s.x, y: 0, label: `x${sub(i)}`, cls: i === 0 ? 'tandot' : 'tandot sec' }))
  return (
    <Plot
      xr={xr}
      yr={yr}
      curves={[{ f: (x) => evalFloat(run.f, x), cls: 'tancurve' }]}
      segs={segs}
      dots={dots}
      label={tc(L('The graph of f with the steps of Newton’s method: up to the curve, then along the tangent to the x-axis', 'Grafik f dengan langkah metode Newton: naik ke kurva, lalu menyusuri garis singgung ke sumbu-x'))}
    />
  )
}

/** A window that holds the iterates and the curve between them. */
function windowOf(run: NewtonRun, k: number): { xr: [number, number]; yr: [number, number] } {
  const xs = run.steps.slice(0, k + 1).flatMap((s) => [s.x, s.next]).filter((v) => Number.isFinite(v) && Math.abs(v) < 40)
  if (xs.length === 0) xs.push(0, 1)
  let lo = Math.min(...xs)
  let hi = Math.max(...xs)
  const span = Math.max(hi - lo, 0.5)
  lo -= span * 0.25
  hi += span * 0.25
  const ys: number[] = [0]
  for (let i = 0; i <= 80; i++) {
    const v = evalFloat(run.f, lo + ((hi - lo) * i) / 80)
    if (Number.isFinite(v)) ys.push(v)
  }
  const near = run.steps.slice(0, k + 1).map((s) => s.fx).filter((v) => Number.isFinite(v))
  const cap = Math.max(1, ...near.map(Math.abs)) * 1.6
  const y0 = Math.max(Math.min(...ys), -cap)
  const y1 = Math.min(Math.max(...ys), cap)
  const pad = (y1 - y0) * 0.1 || 1
  return { xr: [lo, hi], yr: [y0 - pad, y1 + pad] }
}

/* ------------------------------------------------------------------- Newton's method, step by step */

interface Preset {
  src: string
  x0: number
}
const PRESETS: Preset[] = [
  { src: 'x^2-2', x0: 1 },
  { src: 'x^3-x-1', x0: 1 },
  { src: 'x^3-x-1', x0: 3 },
  { src: 'x^2+x-1', x0: -1 },
  { src: 'x*e^x-1', x0: 0 },
  { src: 'cos(x)-x', x0: 1 },
  { src: 'x-1-0.5*sin(x)', x0: 1.5 },
  { src: 'tan(x)-2*x', x0: 1.1 },
]

export function NewtonTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(PRESETS[1].src)
  const [x0Str, setX0Str] = useState('1')
  const [k, setK] = useState(4)
  const x0 = numOf(x0Str)
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  let body
  if (x0 === null) body = <p className="noline">{tc(ERR.start)}</p>
  else {
    const run = newton(src, x0, 40)
    if (!run.ok) body = <p className="noline">{tc(ERR[run.error])}</p>
    else {
      const n = run.steps.length
      const shown = Math.min(k, n)
      const w = windowOf(run, shown)
      const rows = run.steps.slice(0, shown)
      const lastShown = rows[rows.length - 1]
      body = (
        <>
          <label className="lbl slider">
            {tc(L('steps shown', 'langkah yang ditampilkan'))} = <b>{shown}</b> / {n}
            <input type="range" min={0} max={Math.max(n, 1)} step={1} value={Math.min(k, n)} aria-label="steps" onChange={(e) => setK(Number(e.target.value))} />
          </label>
          <StepsPlot run={run} k={shown} xr={w.xr} yr={w.yr} />
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <thead>
                <tr>
                  <th>n</th>
                  <th>xₙ</th>
                  <th>f(xₙ)</th>
                  <th>f′(xₙ)</th>
                  <th>xₙ₊₁</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.n}>
                    <td>{s.n}</td>
                    <td>{four(s.x, sep)}</td>
                    <td>{four(s.fx, sep)}</td>
                    <td>{four(s.dfx, sep)}</td>
                    <td>{Number.isFinite(s.next) ? four(s.next, sep) : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={tdec(`x_{n+1}=x_n-\\dfrac{f(x_n)}{f'(x_n)}=x_n-\\dfrac{${toTex(run.f)}}{${toTex(run.df)}}`)} />
            </p>
            {shown === n ? (
              <p className={run.status === 'converged' ? 'okline' : 'noline'}>
                {tc(STATUS_TEXT[run.status])} {run.status === 'converged' && lastShown ? `x ≈ ${four(run.last, sep)}` : ''}
              </p>
            ) : (
              <p className="small muted">{tc(L('Move the slider to take more steps.', 'Geser penggeser untuk mengambil lebih banyak langkah.'))}</p>
            )}
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="newtontool">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          x₀ = <input style={{ width: '5em' }} value={x0Str} aria-label="x0" onChange={(e) => setX0Str(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {PRESETS.map((p) => (
          <button
            key={p.src + p.x0}
            className="chip ghost"
            onClick={() => {
              setSrc(p.src)
              setX0Str(String(p.x0))
              setK(4)
            }}
          >
            <Tex src={tdec(`${exprTex(p.src)}=0,\\ x_0=${p.x0}`)} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ---------------------------------------------------------------------- how fast it converges */

interface SpeedCase {
  id: string
  src: string
  x0: number
  /** a bracket for the comparison with bisection; none for a double root */
  bracket?: [number, number]
  name: { en: string; id: string }
}
const SPEED_CASES: SpeedCase[] = [
  { id: 'sqrt2', src: 'x^2-2', x0: 1, bracket: [1, 2], name: { en: 'simple root', id: 'akar sederhana' } },
  { id: 'cubic', src: 'x^3-x-1', x0: 1, bracket: [1, 2], name: { en: 'simple root', id: 'akar sederhana' } },
  { id: 'cos', src: 'cos(x)-x', x0: 1, bracket: [0, 1], name: { en: 'simple root', id: 'akar sederhana' } },
  { id: 'double', src: '(x-1)^2', x0: 2, name: { en: 'double root', id: 'akar ganda dua' } },
  { id: 'six', src: '(x-1)^6', x0: 2, name: { en: 'root of multiplicity 6', id: 'akar berkelipatan 6' } },
]

export function NewtonSpeed() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('sqrt2')
  const c = SPEED_CASES.find((q) => q.id === id) ?? SPEED_CASES[0]
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const long = newton(c.src, c.x0, 600)
  const run = newton(c.src, c.x0, 12)
  let body = null
  if (long.ok && run.ok) {
    const root = long.last
    const rows = errorTable(run, root).filter((w) => w.err > 1e-13 || w.n === 0)
    const bis = c.bracket ? bisectionSteps(c.src, c.bracket[0], c.bracket[1], Math.max(rows.length, 8)) : null
    const f2 = derive(run.df).result
    const simple = Math.abs(evalFloat(run.df, root)) > 1e-6
    const cEst = simple ? Math.abs(evalFloat(f2, root) / (2 * evalFloat(run.df, root))) : NaN
    const lastRatios = rows.filter((w) => Number.isFinite(w.lin) && w.err > 1e-9)
    const lin = lastRatios.length ? lastRatios[lastRatios.length - 1].lin : NaN
    body = (
      <>
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>n</th>
                <th>xₙ</th>
                <th>{tc(L('error', 'galat'))}</th>
                <th>{tc(L('correct digits', 'angka benar'))}</th>
                <th>eₙ₊₁ / eₙ²</th>
                <th>eₙ₊₁ / eₙ</th>
                {bis && <th>{tc(L('bisection digits', 'angka benar bisection'))}</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((w, i) => (
                <tr key={w.n}>
                  <td>{w.n}</td>
                  <td>{four(w.x, sep)}</td>
                  <td>{w.err === 0 ? '0' : w.err.toExponential(2).replace('.', sep)}</td>
                  <td>{four(w.digits, sep)}</td>
                  <td>{Number.isFinite(w.quad) && w.err > 1e-9 ? four(w.quad, sep) : '–'}</td>
                  <td>{Number.isFinite(w.lin) && w.err > 1e-9 ? four(w.lin, sep) : '–'}</td>
                  {bis && <td>{i > 0 && bis[i - 1] !== undefined ? four(Math.min(16, -Math.log10(Math.abs(bis[i - 1] - root) || 1e-16)), sep) : '–'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wgtout" aria-live="polite">
          {simple ? (
            <>
              <p className="okline">
                {tc(L('A simple root: the number of correct digits roughly doubles at each step, and e(n+1) / e(n)² settles near', 'Akar sederhana: banyaknya angka benar kira-kira berlipat dua di setiap langkah, dan e(n+1) / e(n)² menuju sekitar'))} <b>{four(cEst, sep)}</b>.
              </p>
              <p>
                <Tex src={tdec(`\\dfrac{|f''(r)|}{2\\,|f'(r)|}=\\dfrac{${four(Math.abs(evalFloat(f2, root)), '.')}}{2\\cdot${four(Math.abs(evalFloat(run.df, root)), '.')}}=${four(cEst, '.')}`)} />
              </p>
            </>
          ) : (
            <p className="noline">
              {tc(L('A root that is not simple: f′(r) = 0, so the error shrinks only by the constant factor e(n+1) / e(n) ≈', 'Akar yang tidak sederhana: f′(r) = 0, sehingga galat hanya mengecil dengan faktor tetap e(n+1) / e(n) ≈'))} <b>{four(lin, sep)}</b>
              {Number.isFinite(lin) && lin < 0.999 ? `, ${tc(L('which is (m − 1)/m for multiplicity', 'yaitu (m − 1)/m untuk kelipatan'))} m ≈ ${four(1 / (1 - lin), sep)}` : ''}.
            </p>
          )}
        </div>
      </>
    )
  }
  return (
    <Frame name="newtonspeed">
      <div className="chips">
        {SPEED_CASES.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => setId(q.id)} aria-pressed={id === q.id}>
            <Tex src={tdec(exprTex(q.src))} /> {tc(q.name)}
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* --------------------------------------------------------------------------- when it goes wrong */

const CASE_NAME: Record<string, { en: string; id: string }> = {
  good: { en: 'a good start', id: 'awal yang baik' },
  cycle: { en: 'a cycle', id: 'sebuah siklus' },
  cbrt: { en: 'runs off', id: 'lari menjauh' },
  arctan: { en: 'too far out', id: 'terlalu jauh' },
  flat: { en: 'a horizontal tangent', id: 'garis singgung mendatar' },
  far: { en: 'the wrong root', id: 'akar yang keliru' },
  multiple: { en: 'a slow root', id: 'akar yang lambat' },
}
const CASE_NOTE: Record<string, { en: string; id: string }> = {
  good: { en: 'The baseline: each step roughly doubles the correct digits.', id: 'Pembandingnya: setiap langkah kira-kira melipatduakan angka benar.' },
  cycle: { en: 'x³ − 2x + 2 from 0: the tangent at 0 meets the axis at 1, and the tangent at 1 meets it at 0 again. The approximations go 0, 1, 0, 1, … forever, and the real root is near −1.77.', id: 'x³ − 2x + 2 dari 0: garis singgung di 0 memotong sumbu di 1, dan garis singgung di 1 memotongnya di 0 lagi. Hampirannya 0, 1, 0, 1, … selamanya, dan akar nyatanya dekat −1,77.' },
  cbrt: { en: 'The cube root has a vertical tangent at its root, and Newton’s formula gives xₙ₊₁ = −2xₙ: the approximations are 1, −2, 4, −8, … and run off.', id: 'Akar pangkat tiga punya garis singgung tegak di akarnya, dan rumus Newton memberi xₙ₊₁ = −2xₙ: hampirannya 1, −2, 4, −8, … dan lari menjauh.' },
  arctan: { en: 'arctan x has a root at 0, but starting beyond about 1.3917 the tangent is so flat that each step lands farther out than the last.', id: 'arctan x punya akar di 0, tetapi mulai dari lebih dari sekitar 1,3917 garis singgungnya begitu landai sehingga setiap langkah mendarat lebih jauh daripada sebelumnya.' },
  flat: { en: 'At x₀ = 0 the curve x² − 1 has a horizontal tangent: it never meets the axis, and the formula would divide by zero.', id: 'Di x₀ = 0 kurva x² − 1 memiliki garis singgung mendatar: ia tidak pernah memotong sumbu, dan rumusnya akan membagi dengan nol.' },
  far: { en: 'sin x has a root at 0 and at every multiple of π, but from 1.7 the tangent is nearly flat and throws the next guess out to 9.4, then it settles on 3π.', id: 'sin x memiliki akar di 0 dan di setiap kelipatan π, tetapi dari 1,7 garis singgungnya hampir mendatar dan melempar tebakan berikutnya ke 9,4, lalu menetap di 3π.' },
  multiple: { en: '(x − 1)⁶ has a root of multiplicity 6: the curve is so flat there that each step only removes a sixth of the error, and 40 steps are not enough.', id: '(x − 1)⁶ memiliki akar berkelipatan 6: kurvanya begitu datar di sana sehingga setiap langkah hanya menghilangkan seperenam galat, dan 40 langkah belum cukup.' },
}

export function NewtonFail() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('cycle')
  const c: FailCase = FAIL_CASES.find((q) => q.id === id) ?? FAIL_CASES[1]
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const run = newton(c.f, c.x0, 40)
  let body = null
  if (run.ok) {
    const rows = run.steps.slice(0, 9)
    body = (
      <>
        <p>{tc(CASE_NOTE[c.id])}</p>
        <StepsPlot run={run} k={Math.min(run.steps.length, c.id === 'multiple' ? 12 : 8)} xr={c.xr} yr={c.yr} />
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>n</th>
                <th>xₙ</th>
                <th>f(xₙ)</th>
                <th>f′(xₙ)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.n}>
                  <td>{s.n}</td>
                  <td>{four(s.x, sep)}</td>
                  <td>{four(s.fx, sep)}</td>
                  <td>{four(s.dfx, sep)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wgtout" aria-live="polite">
          <p className={run.status === 'converged' ? 'okline' : 'noline'}>
            {tc(STATUS_TEXT[run.status])}
            {run.status === 'cycle' ? ` (${tc(L('period', 'periode'))} ${run.period})` : ''}
            {run.status === 'converged' ? ` x ≈ ${four(run.last, sep)}` : ''}
          </p>
        </div>
      </>
    )
  }
  return (
    <Frame name="newtonfail">
      <div className="chips">
        {FAIL_CASES.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => setId(q.id)} aria-pressed={id === q.id}>
            <Tex src={tdec(`${exprTex(q.f)},\\ x_0=${q.x0}`)} /> {tc(CASE_NAME[q.id])}
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* --------------------------------------------------------------------- the basins of attraction */

const HUES = [210, 28, 135, 285, 52, 340, 175]

interface BasinPreset {
  src: string
  a: number
  b: number
}
const BASIN_PRESETS: BasinPreset[] = [
  { src: 'x^3-x', a: -2, b: 2 },
  { src: 'x^3-2*x+2', a: -3, b: 3 },
  { src: 'x^5-x-1', a: -1.5, b: 1.5 },
  { src: 'sin(x)', a: -4, b: 4 },
  { src: 'x^3-x', a: -0.6, b: -0.4 },
]

export function NewtonBasin() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(BASIN_PRESETS[0].src)
  const [aStr, setAStr] = useState('-2')
  const [bStr, setBStr] = useState('2')
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)
  let body
  if (a === null || b === null || !(a < b)) body = <p className="noline">{tc(L('Type the ends a < b of the interval of starting values as numbers.', 'Ketik ujung a < b selang nilai awal sebagai bilangan.'))}</p>
  else {
    const B = basin(src, a, b, 480, 60)
    if (!B.ok) body = <p className="noline">{tc(ERR[B.error === 'start' ? 'start' : B.error])}</p>
    else {
      const W = 440
      const colors = (idx: number): string => (idx < 0 ? 'var(--muted)' : `hsl(${HUES[idx % HUES.length]} 62% 52%)`)
      const total = B.starts.length
      const failed = B.starts.filter((s) => s.root < 0).length
      body = (
        <>
          <svg viewBox={`0 0 ${W} 54`} className="dersvg" role="img" aria-label={tc(L('A strip of starting values, each coloured by the root that Newton’s method reaches', 'Pita nilai awal, masing-masing diwarnai oleh akar yang dicapai metode Newton'))}>
            <rect x={0} y={0} width={W} height={54} className="tanframe" />
            {B.starts.map((s, i) => (
              <rect key={i} x={(i * W) / total} y={4} width={W / total + 0.6} height={34} style={{ fill: colors(s.root), opacity: s.root < 0 ? 0.45 : 0.9 }} />
            ))}
            <text x={4} y={50} className="tanlabel">
              {four(a, sep)}
            </text>
            <text x={W - 4} y={50} className="tanlabel" textAnchor="end">
              {four(b, sep)}
            </text>
          </svg>
          <div className="wgtout" aria-live="polite">
            <ul className="small" style={{ paddingLeft: '1.2em' }}>
              {B.roots
                .map((q, i) => ({ q, i }))
                .sort((p, q) => q.q.count - p.q.count)
                .slice(0, 8)
                .sort((p, q) => p.i - q.i)
                .map(({ q, i }) => (
                <li key={i}>
                  <span style={{ display: 'inline-block', width: '0.8em', height: '0.8em', background: colors(i), marginRight: 6, borderRadius: 2 }} />
                  {tc(L('root', 'akar'))} {four(q.root, sep)}: {four((q.count / total) * 100, sep)}% {tc(L('of the starting values', 'dari nilai awal'))}
                </li>
              ))}
              {B.roots.length > 8 && (
                <li>
                  {tc(L('and', 'dan'))} {B.roots.length - 8} {tc(L('more roots, each reached from only a few starting values', 'akar lain, masing-masing dicapai dari hanya beberapa nilai awal'))}
                </li>
              )}
              {failed > 0 && (
                <li>
                  <span style={{ display: 'inline-block', width: '0.8em', height: '0.8em', background: 'var(--muted)', opacity: 0.5, marginRight: 6, borderRadius: 2 }} />
                  {tc(L('no root (a cycle, an escape, a flat tangent or too slow)', 'tanpa akar (siklus, lari menjauh, garis singgung mendatar, atau terlalu lambat)'))}: {four((failed / total) * 100, sep)}%
                </li>
              )}
            </ul>
            <p className="small">{tc(L('The strip is made of 480 starting values. The boundaries between colours are where a tiny change in the start changes the root: zoom in on one with the ends a and b.', 'Pita ini terdiri atas 480 nilai awal. Batas antarwarna adalah tempat perubahan kecil pada nilai awal mengubah akar yang dicapai: perbesar salah satunya dengan ujung a dan b.'))}</p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="newtonbasin">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
        </label>
        <label className="lbl">
          b = <input style={{ width: '5em' }} value={bStr} aria-label="b" onChange={(e) => setBStr(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {BASIN_PRESETS.map((p) => (
          <button
            key={p.src + p.a}
            className="chip ghost"
            onClick={() => {
              setSrc(p.src)
              setAStr(String(p.a))
              setBStr(String(p.b))
            }}
          >
            <Tex src={tdec(`${exprTex(p.src)},\\ [${p.a},\\ ${p.b}]`)} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ---------------------------------------------------------------- roots and reciprocals by hand */

export function NewtonRoots() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const [mode, setMode] = useState<'root' | 'recip'>('root')
  const [a, setA] = useState(2)
  const [n, setN] = useState(2)
  const [t, setT] = useState(0.3)
  const target = mode === 'root' ? a ** (1 / n) : 1 / a
  // a start that is on the safe side: for roots any positive number, for the reciprocal below 2/a
  const x0 = mode === 'root' ? 0.5 + t * 2 * Math.max(a ** (1 / n), 1) : t * (2 / a) * 1.15
  const xs = mode === 'root' ? rootIterates(a, n, x0, 7) : reciprocalIterates(a, x0, 7)
  const digits = (x: number): number => (x === target ? 16 : Math.min(16, Math.max(0, -Math.log10(Math.abs(x - target) / Math.abs(target)))))
  const formula =
    mode === 'root'
      ? n === 2
        ? `x_{k+1}=\\dfrac12\\left(x_k+\\dfrac{${a}}{x_k}\\right)`
        : `x_{k+1}=\\dfrac{${n - 1}\\,x_k+\\dfrac{${a}}{x_k^{${n - 1}}}}{${n}}`
      : `x_{k+1}=x_k\\,(2-${a}\\,x_k)`
  const diverges = xs[xs.length - 1] === -Infinity || Math.abs(xs[xs.length - 1] - target) > Math.abs(x0 - target) * 100
  return (
    <Frame name="newtonroots">
      <div className="chips">
        <button
          className={`chip ${mode === 'root' ? 'on' : ''}`}
          onClick={() => {
            setMode('root')
            setA(2)
          }}
          aria-pressed={mode === 'root'}
        >
          {tc(L('n-th root of a', 'akar pangkat n dari a'))}
        </button>
        <button
          className={`chip ${mode === 'recip' ? 'on' : ''}`}
          onClick={() => {
            setMode('recip')
            setA(4)
          }}
          aria-pressed={mode === 'recip'}
        >
          {tc(L('reciprocal 1/a, with no division', 'kebalikan 1/a, tanpa pembagian'))}
        </button>
      </div>
      <div className="amctl">
        <label className="lbl slider">
          a = <b>{four(a, sep)}</b>
          <input type="range" min={mode === 'root' ? 1 : 0.5} max={mode === 'root' ? 100 : 20} step={mode === 'root' ? 1 : 0.5} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        {mode === 'root' && (
          <label className="lbl slider">
            n = <b>{n}</b>
            <input type="range" min={2} max={6} step={1} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
          </label>
        )}
        <label className="lbl slider">
          x₀ = <b>{four(x0, sep)}</b>
          <input type="range" min={0.02} max={1} step={0.01} value={t} aria-label="x0" onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>k</th>
              <th>xₖ</th>
              <th>{tc(L('correct digits', 'angka benar'))}</th>
            </tr>
          </thead>
          <tbody>
            {xs.map((x, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{four(x, sep)}</td>
                <td>{four(digits(x), sep)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={tdec(formula)} />
        </p>
        <p className={diverges ? 'noline' : 'okline'}>
          {mode === 'root' ? (n === 2 ? '√' : `${n}√`) : '1/'}
          {four(a, sep)} = {four(target, sep)}
          {diverges ? ' · ' + tc(L('this start is too far from 1/a: the iteration runs away (x₀ must be below 2/a)', 'awal ini terlalu jauh dari 1/a: iterasinya menjauh (x₀ harus di bawah 2/a)')) : ''}
        </p>
        <p className="small">
          {mode === 'root'
            ? tc(L('No derivative is needed: the formula comes from Newton’s method for xⁿ − a = 0, and for n = 2 it is the rule the Babylonians used.', 'Tidak perlu turunan: rumus ini berasal dari metode Newton untuk xⁿ − a = 0, dan untuk n = 2 ia adalah aturan yang dipakai orang Babilonia.'))
            : tc(L('Only multiplication and subtraction: this is how a computer can divide. The start must be between 0 and 2/a.', 'Hanya perkalian dan pengurangan: begini komputer dapat membagi. Awalnya harus di antara 0 dan 2/a.'))}
        </p>
      </div>
    </Frame>
  )
}
