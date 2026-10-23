import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { cosDeg, sinDeg, tanDeg, toDeg, type BasicFn } from '../../lib/trigbasic'
import { evalNode, parseExpr } from '../../lib/trigident'
import { EQUATIONS, NUMERIC_EQUATIONS, PERIOD, bisect, newton, solveMulti, solveQuadratic, type Why } from '../../lib/trigeq'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark; `–` where it is undefined. */
function fmt(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace('.', sep)
}
/** The same without trailing zeros. */
function short(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return Number((Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)).toString().replace('.', sep)
}
/** A number inside TeX: a decimal comma has to be protected from the space TeX puts after a comma. */
const texNum = (x: number, sep: string, digits = 4): string => short(x, '.', digits).replace('.', sep === ',' ? '{,}' : '.')
const parse = (s: string): number => (s.trim() === '' ? NaN : Number(s.trim().replace(',', '.')))
const FNS: Record<BasicFn, (d: number) => number> = { sin: sinDeg, cos: cosDeg, tan: tanDeg }

/** The line through a series of points in graph coordinates; the pen lifts where a value is missing or off the page. */
function linePath(xs: number[], ys: number[], X: (x: number) => number, Y: (y: number) => number, cap: number): string {
  let d = ''
  let pen = false
  for (let i = 0; i < xs.length; i++) {
    const y = ys[i]
    if (!Number.isFinite(y) || Math.abs(y) > cap) {
      pen = false
      continue
    }
    d += `${pen ? 'L' : 'M'}${X(xs[i]).toFixed(1)},${Y(y).toFixed(1)}`
    pen = true
  }
  return d
}

/* ------------------------------------------------------------------------ fn(kx + b) = c */

const EXACT_LEVELS: { c: number; tex: string }[] = [
  { c: -1, tex: '-1' },
  { c: -Math.sqrt(3) / 2, tex: '-\\frac{\\sqrt3}{2}' },
  { c: -Math.SQRT1_2, tex: '-\\frac{\\sqrt2}{2}' },
  { c: -0.5, tex: '-\\frac12' },
  { c: 0, tex: '0' },
  { c: 0.5, tex: '\\frac12' },
  { c: Math.SQRT1_2, tex: '\\frac{\\sqrt2}{2}' },
  { c: Math.sqrt(3) / 2, tex: '\\frac{\\sqrt3}{2}' },
  { c: 1, tex: '1' },
]
const TAN_LEVELS: { c: number; tex: string }[] = [
  { c: -Math.sqrt(3), tex: '-\\sqrt3' },
  { c: -1, tex: '-1' },
  { c: 0, tex: '0' },
  { c: 1, tex: '1' },
  { c: Math.sqrt(3), tex: '\\sqrt3' },
]
const K_CHOICES = [0.5, 1, 2, 3, 4]
const INTERVALS: [number, number][] = [
  [0, 360],
  [0, 720],
  [-360, 360],
]
const mod = (a: number, m: number): number => ((a % m) + m) % m

export function TrigEqSolve() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<BasicFn>('sin')
  const [k, setK] = useState(2)
  const [b, setB] = useState(0)
  const [pick, setPick] = useState<number | null>(5)
  const [text, setText] = useState('0.5')
  const [iv, setIv] = useState(0)
  const levels = fn === 'tan' ? TAN_LEVELS : EXACT_LEVELS
  const c = pick !== null && pick < levels.length ? levels[pick].c : parse(text)
  const valid = Number.isFinite(c)
  const [lo, hi] = INTERVALS[iv]
  const sols = useMemo(() => (valid ? solveMulti(fn, k, b, c, lo, hi) : []), [fn, k, b, c, lo, hi, valid])
  const outOfRange = valid && fn !== 'tan' && Math.abs(c) > 1
  // the general solution: kx + b = alpha + a turn times n, or the mirror image
  const alpha = !valid || outOfRange ? NaN : fn === 'sin' ? toDeg(Math.asin(c)) : fn === 'cos' ? toDeg(Math.acos(c)) : toDeg(Math.atan(c))
  const turn = PERIOD[fn]
  const firsts: number[] = []
  if (Number.isFinite(alpha)) {
    const second = fn === 'sin' ? 180 - alpha : fn === 'cos' ? -alpha : NaN
    firsts.push(alpha)
    if (Number.isFinite(second) && Math.abs(mod(second - alpha + 180, 360) - 180) > 1e-9) firsts.push(second)
  }
  const families = firsts.map((u) => ({ x0: (u - b) / k, step: turn / k }))
  const perTurn = valid && !outOfRange ? solveMulti(fn, k, b, c, 0, 360).length : 0
  const kTex = k === 1 ? '' : texNum(k, sep)
  const bTex = b === 0 ? '' : b > 0 ? `+${b}^\\circ` : `-${-b}^\\circ`
  const equation = `\\${fn}\\left(${kTex}x${bTex}\\right)=${pick !== null && pick < levels.length ? levels[pick].tex : texNum(c, sep, 6)}`
  // the graph
  const W = 340
  const H = 180
  const ymax = fn === 'tan' ? 3 : 1.5
  const X = (x: number): number => 14 + ((x - lo) / (hi - lo)) * (W - 28)
  const Y = (y: number): number => H / 2 - (y / ymax) * (H / 2 - 12)
  const xs: number[] = []
  const ys: number[] = []
  const stepDeg = Math.max(0.25, (hi - lo) / 1400)
  for (let x = lo; x <= hi + 1e-9; x += stepDeg) {
    xs.push(x)
    ys.push(FNS[fn](k * x + b))
  }
  const d = linePath(xs, ys, X, Y, ymax)
  const ticks: number[] = []
  for (let v = Math.ceil(lo / 90) * 90; v <= hi; v += hi - lo > 400 ? 180 : 90) ticks.push(v)
  const label = `${tc(L('The graph of', 'Grafik'))} ${fn}(${short(k, '.', 1)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°) ${tc(L('from', 'dari'))} ${lo}° ${tc(L('to', 'sampai'))} ${hi}° ${tc(L('and the level', 'dan tingkat'))} ${fmt(c, sep, 4)}. ${sols.length ? `${sols.length} ${tc(L('solutions', 'penyelesaian'))}: ${sols.map((v) => `${short(v, sep, 3)}°`).join(', ')}` : tc(L('No solution', 'Tidak ada penyelesaian'))}`
  return (
    <Frame name="eqsolve">
      <div className="chips">
        {(['sin', 'cos', 'tan'] as const).map((q) => (
          <button
            key={q}
            className={`chip ${fn === q ? 'on' : ''}`}
            onClick={() => {
              setFn(q)
              setPick(q === 'tan' ? 3 : 5)
            }}
            aria-pressed={fn === q}
          >
            <Tex src={`\\${q}(kx+b)=c`} />
          </button>
        ))}
      </div>
      <div className="chips">
        {K_CHOICES.map((q) => (
          <button key={q} className={`chip ghost ${k === q ? 'on' : ''}`} onClick={() => setK(q)} aria-pressed={k === q}>
            <Tex src={`k=${texNum(q, sep)}`} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        b = <b>{b}°</b>
        <input type="range" min={-90} max={90} step={5} value={b} aria-label="b" onChange={(e) => setB(Number(e.target.value))} />
      </label>
      <div className="chips">
        {levels.map((l, i) => (
          <button key={i} className={`chip ghost ${pick === i ? 'on' : ''}`} onClick={() => setPick(i)} aria-pressed={pick === i}>
            <Tex src={`c=${l.tex}`} />
          </button>
        ))}
        <label className="lbl">
          c = <input style={{ width: '5.5em' }} value={pick !== null && pick < levels.length ? short(levels[pick].c, sep, 4) : text} inputMode="decimal" aria-label="c" onChange={(e) => (setText(e.target.value), setPick(null))} />
        </label>
      </div>
      <div className="chips">
        {INTERVALS.map(([a, z], i) => (
          <button key={i} className={`chip ghost ${iv === i ? 'on' : ''}`} onClick={() => setIv(i)} aria-pressed={iv === i}>
            {a}° ≤ x &lt; {z}°
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 460, display: 'block', margin: '6px auto' }}>
        <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
        {ticks.map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={Y(0) - 4} x2={X(v)} y2={Y(0) + 4} stroke="var(--muted)" strokeWidth={1} />
            <text x={X(v)} y={H - 3} fontSize={9} textAnchor="middle" fill="var(--muted)">
              {v}°
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth={2.2} />
        {valid && Math.abs(c) <= ymax && <line x1={14} y1={Y(c)} x2={W - 14} y2={Y(c)} stroke="var(--coral)" strokeWidth={1.6} strokeDasharray="6 4" />}
        {sols.map((v) => (
          <circle key={v} cx={X(v)} cy={Y(c)} r={sols.length > 12 ? 3.2 : 4.5} fill="var(--bad)" />
        ))}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          <Tex src={equation} />
        </p>
        {!valid ? (
          <p className="warnline">{tc(L('Type a number for c.', 'Ketik sebuah bilangan untuk c.'))}</p>
        ) : outOfRange ? (
          <p className="badline">{tc(L(`No solution: ${fn} never goes beyond −1 and 1, so no angle gives ${fmt(c, sep, 4)}.`, `Tidak ada penyelesaian: ${fn} tidak pernah melewati −1 dan 1, sehingga tak ada sudut yang memberi ${fmt(c, sep, 4)}.`))}</p>
        ) : sols.length === 0 ? (
          <p className="badline">{tc(L('No solution in this interval: the angle kx + b never reaches a value that works.', 'Tidak ada penyelesaian di interval ini: sudut kx + b tidak pernah mencapai nilai yang cocok.'))}</p>
        ) : (
          <p className="okline" style={{ overflowWrap: 'anywhere' }}>
            {sols.length} {tc(L(sols.length === 1 ? 'solution' : 'solutions', 'penyelesaian'))}: x = {sols.map((v) => `${short(v, sep, 4)}°`).join(', ')}
          </p>
        )}
        {families.length > 0 && (
          <>
            <p className="small">{tc(L('All solutions, with n any whole number (solve for kx + b first, then subtract b and divide by k):', 'Semua penyelesaian, dengan n bilangan bulat apa saja (selesaikan dulu untuk kx + b, lalu kurangi b dan bagi k):'))}</p>
            {families.map((f, i) => (
              <Tex key={i} src={`x=${texNum(f.x0, sep)}^\\circ+${texNum(f.step, sep)}^\\circ\\,n`} display />
            ))}
            <p className="small muted">
              {tc(L(`The solutions repeat every ${short(families[0].step, sep, 4)}°, so one turn of 360° holds ${short(360 / families[0].step, sep, 3)} period${360 / families[0].step === 1 ? '' : 's'} and ${perTurn} solution${perTurn === 1 ? '' : 's'}.`, `Penyelesaian berulang setiap ${short(families[0].step, sep, 4)}°, jadi satu putaran 360° memuat ${short(360 / families[0].step, sep, 3)} periode dan ${perTurn} penyelesaian.`))}
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------- a quadratic in a function */

/** a·u² + b·u + c as TeX, with `body` standing for u (and `sq` for u²). */
function polyTex(sq: string, lin: string, a: number, b: number, c: number): string {
  const terms: string[] = []
  const add = (coef: number, body: string): void => {
    if (coef === 0) return
    const mag = Math.abs(coef)
    const t = `${body !== '' && mag === 1 ? '' : mag}${body}`
    terms.push(coef < 0 ? `-${t}` : terms.length === 0 ? t : `+${t}`)
  }
  add(a, sq)
  add(b, lin)
  add(c, '')
  return `${terms.join('') || '0'}=0`
}

interface QuadPreset {
  fn: BasicFn
  a: number
  b: number
  c: number
}
const QUAD_PRESETS: QuadPreset[] = [
  { fn: 'sin', a: 2, b: -1, c: -1 },
  { fn: 'cos', a: 2, b: 3, c: 1 },
  { fn: 'sin', a: 1, b: -2, c: 1 },
  { fn: 'cos', a: 1, b: 0, c: -4 },
  { fn: 'tan', a: 1, b: 0, c: -3 },
  { fn: 'sin', a: 2, b: 3, c: -2 },
]

export function TrigEqQuad() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<BasicFn>('sin')
  const [a, setA] = useState(2)
  const [b, setB] = useState(-1)
  const [c, setC] = useState(-1)
  const q = useMemo(() => solveQuadratic(fn, a, b, c), [fn, a, b, c])
  const polyFn = polyTex(`\\${fn}^2 x`, `\\${fn}\\,x`, a, b, c)
  const polyU = polyTex('u^2', 'u', a, b, c)
  const disc = b * b - 4 * a * c
  // the graph of the left side over one turn
  const W = 340
  const H = 180
  const xs: number[] = []
  const ys: number[] = []
  for (let x = 0; x <= 360; x += 0.5) {
    xs.push(x)
    const f = FNS[fn](x)
    ys.push(Number.isFinite(f) ? a * f * f + b * f + c : NaN)
  }
  const cap = 12
  const fin = ys.filter((v) => Number.isFinite(v) && Math.abs(v) <= cap)
  const top = Math.max(1, ...fin) * 1.12
  const bottom = Math.min(-1, ...fin) * 1.12
  const X = (x: number): number => 14 + (x / 360) * (W - 28)
  const Y = (y: number): number => 10 + ((top - y) / (top - bottom)) * (H - 28)
  const d = linePath(xs, ys, X, Y, cap)
  const label = `${tc(L('The graph of', 'Grafik'))} ${a}·${fn}² x ${b < 0 ? '−' : '+'} ${Math.abs(b)}·${fn} x ${c < 0 ? '−' : '+'} ${Math.abs(c)} ${tc(L('from 0° to 360°. It is zero at', 'dari 0° sampai 360°. Nilainya nol di'))} ${q.solutions.length ? q.solutions.map((v) => `${short(v, sep, 3)}°`).join(', ') : tc(L('no angle', 'tidak ada sudut'))}`
  const name = `\\${fn}\\,x`
  return (
    <Frame name="eqquad">
      <div className="chips">
        {QUAD_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ghost ${p.fn === fn && p.a === a && p.b === b && p.c === c ? 'on' : ''}`}
            onClick={() => {
              setFn(p.fn)
              setA(p.a)
              setB(p.b)
              setC(p.c)
            }}
          >
            <Tex src={polyTex(`\\${p.fn}^2 x`, `\\${p.fn}\\,x`, p.a, p.b, p.c)} />
          </button>
        ))}
      </div>
      <div className="chips">
        {(['sin', 'cos', 'tan'] as const).map((f) => (
          <button key={f} className={`chip ${fn === f ? 'on' : ''}`} onClick={() => setFn(f)} aria-pressed={fn === f}>
            <Tex src={`u=\\${f}\\,x`} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        a = <b>{a}</b>
        <input type="range" min={-3} max={3} step={1} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        b = <b>{b}</b>
        <input type="range" min={-6} max={6} step={1} value={b} aria-label="b" onChange={(e) => setB(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        c = <b>{c}</b>
        <input type="range" min={-6} max={6} step={1} value={c} aria-label="c" onChange={(e) => setC(Number(e.target.value))} />
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 460, display: 'block', margin: '6px auto' }}>
        <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
        {[0, 90, 180, 270, 360].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={Y(0) - 4} x2={X(v)} y2={Y(0) + 4} stroke="var(--muted)" strokeWidth={1} />
            <text x={X(v)} y={H - 3} fontSize={9} textAnchor="middle" fill="var(--muted)">
              {v}°
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth={2.2} />
        {q.solutions.map((v) => (
          <circle key={v} cx={X(v)} cy={Y(0)} r={4.5} fill="var(--bad)" />
        ))}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          <Tex src={polyFn} /> {tc(L('is a quadratic in u, where', 'adalah kuadrat dalam u, dengan'))} <Tex src={`u=${name}`} />: <Tex src={polyU} />
        </p>
        {Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12 ? (
          <p className="warnline">{tc(L('With a = 0 and b = 0 this is not an equation in u: it is just a number.', 'Dengan a = 0 dan b = 0 ini bukan persamaan dalam u: hanya sebuah bilangan.'))}</p>
        ) : (
          <>
            {Math.abs(a) >= 1e-12 && (
              <p className="small muted">
                {tc(L('Discriminant', 'Diskriminan'))} b² − 4ac = {disc}
                {disc < 0 ? ` ${tc(L('(negative: no real root u)', '(negatif: tak ada akar real u)'))}` : disc === 0 ? ` ${tc(L('(zero: one root, counted twice)', '(nol: satu akar, terhitung dua kali)'))}` : ''}
              </p>
            )}
            {q.roots.map((u, i) => (
              <p key={i} className={q.admissible[i] ? 'okline' : 'badline'} style={{ overflowWrap: 'anywhere' }}>
                u = {short(u, sep, 4)}:{' '}
                {q.admissible[i]
                  ? `${tc(L(`${fn} x = ${short(u, sep, 4)} gives`, `${fn} x = ${short(u, sep, 4)} memberi`))} x = ${q.byRoot[i].map((v) => `${short(v, sep, 3)}°`).join(', ')}`
                  : tc(L(`no angle has ${fn} x = ${short(u, sep, 4)}, because ${fn} stays between −1 and 1. Throw this root away.`, `tak ada sudut dengan ${fn} x = ${short(u, sep, 4)}, karena ${fn} selalu di antara −1 dan 1. Buang akar ini.`))}
              </p>
            ))}
            {q.roots.length === 0 && Math.abs(a) >= 1e-12 && <p className="badline">{tc(L('No real root u, so no angle.', 'Tak ada akar real u, jadi tak ada sudut.'))}</p>}
            <p className={q.solutions.length ? 'okline' : 'badline'} style={{ overflowWrap: 'anywhere' }}>
              {q.solutions.length ? `${tc(L('Between 0° and 360°', 'Di antara 0° dan 360°'))}: x = ${q.solutions.map((v) => `${short(v, sep, 4)}°`).join(', ')}` : tc(L('No solution between 0° and 360°.', 'Tidak ada penyelesaian di antara 0° dan 360°.'))}
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------- the solved examples, line by line */

const WHY: Record<Why, Loc> = {
  factor: L('factor', 'faktorkan'),
  double: L('double-angle formula', 'rumus sudut ganda'),
  quotient: L('write in sine and cosine (or the other way)', 'tulis dalam sinus dan kosinus (atau sebaliknya)'),
  multiply: L('multiply both sides', 'kalikan kedua ruas'),
  sumproduct: L('sum-to-product formula', 'rumus jumlah menjadi hasil kali'),
  square: L('square both sides', 'kuadratkan kedua ruas'),
  pythagorean: L('Pythagorean identity: cos² = 1 − sin²', 'identitas Pythagoras: cos² = 1 − sin²'),
  harmonic: L('one wave: a sin x + b cos x = R sin(x + φ)', 'satu gelombang: a sin x + b cos x = R sin(x + φ)'),
  basic: L('solve the basic equations', 'selesaikan persamaan dasarnya'),
  rewrite: L('rewrite', 'tulis ulang'),
  product: L('product formula', 'rumus hasil kali'),
  root: L('take the square root', 'tarik akar kuadrat'),
  move: L('move everything to one side', 'pindahkan semuanya ke satu ruas'),
  check: L('check every candidate in the original equation', 'periksa setiap kandidat pada persamaan semula'),
}

export function TrigEqSteps() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('quad-sin')
  const [shown, setShown] = useState(1)
  const eq = EQUATIONS.find((e) => e.id === id)!
  const n = eq.steps.length
  const done = shown >= n
  const showSquared = eq.steps.slice(0, shown).some((s) => s.note === 'adds')
  const pl = parseExpr(eq.le)
  const pr = parseExpr(eq.re)
  const W = 340
  const H = 180
  const xs: number[] = []
  const ysL: number[] = []
  const ysR: number[] = []
  for (let x = 0; x <= 360; x += 0.5) {
    xs.push(x)
    ysL.push(pl.ok ? evalNode(pl.node, x).v : NaN)
    ysR.push(pr.ok ? evalNode(pr.node, x).v : NaN)
  }
  const cap = 6
  const fin = [...ysL, ...ysR].filter((v) => Number.isFinite(v) && Math.abs(v) <= cap)
  const top = Math.max(1, ...fin) * 1.12
  const bottom = Math.min(-1, ...fin) * 1.12
  const X = (x: number): number => 14 + (x / 360) * (W - 28)
  const Y = (y: number): number => 10 + ((top - y) / (top - bottom)) * (H - 28)
  const at = (list: number[], x: number): number => list[Math.round(x * 2)]
  const label = `${tc(L('The two sides of', 'Kedua ruas'))} ${eq.le} = ${eq.re} ${tc(L('from 0° to 360°.', 'dari 0° sampai 360°.'))} ${done ? `${tc(L('They cross at', 'Keduanya berpotongan di'))} ${eq.solutions.map((v) => `${short(v, sep, 3)}°`).join(', ')}` : ''}`
  return (
    <Frame name="eqsteps">
      <div className="chips">
        {EQUATIONS.map((e) => (
          <button
            key={e.id}
            className={`chip ghost ${id === e.id ? 'on' : ''}`}
            onClick={() => {
              setId(e.id)
              setShown(1)
            }}
            aria-pressed={id === e.id}
          >
            <Tex src={e.tex} />
          </button>
        ))}
      </div>
      <ol className="proofsteps">
        {eq.steps.slice(0, shown).map((s, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <Tex src={s.tex} />
            {s.why && <span className="small muted"> {tc(L('because:', 'karena:'))} {tc(WHY[s.why])}</span>}
            {s.note === 'adds' && <p className="warnline small">{tc(L('This step can add solutions that the original equation does not have.', 'Langkah ini dapat menambah penyelesaian yang tidak dimiliki persamaan semula.'))}</p>}
            {s.note === 'loses' && <p className="warnline small">{tc(L('This step can lose solutions.', 'Langkah ini dapat menghilangkan penyelesaian.'))}</p>}
          </li>
        ))}
      </ol>
      <div className="inrow">
        <button className="btn soft" onClick={() => setShown(Math.min(n, shown + 1))} disabled={done}>
          {tc(L('next step', 'langkah berikutnya'))}
        </button>
        <button className="btn ghost" onClick={() => setShown(n)} disabled={done}>
          {tc(L('show all', 'tampilkan semua'))}
        </button>
        <button className="btn ghost" onClick={() => setShown(1)} disabled={shown <= 1}>
          {tc(L('start again', 'ulangi'))}
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 460, display: 'block', margin: '6px auto' }}>
        <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
        {[0, 90, 180, 270, 360].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={Y(0) - 4} x2={X(v)} y2={Y(0) + 4} stroke="var(--muted)" strokeWidth={1} />
            <text x={X(v)} y={H - 3} fontSize={9} textAnchor="middle" fill="var(--muted)">
              {v}°
            </text>
          </g>
        ))}
        <path d={linePath(xs, ysL, X, Y, cap)} fill="none" stroke="var(--brand)" strokeWidth={2.2} />
        <path d={linePath(xs, ysR, X, Y, cap)} fill="none" stroke="var(--coral)" strokeWidth={2.2} strokeDasharray="6 4" />
        {done &&
          eq.solutions.map((v) => {
            const y = at(ysL, v)
            return Number.isFinite(y) ? <circle key={v} cx={X(v)} cy={Y(y)} r={4.5} fill="var(--bad)" /> : null
          })}
        {done &&
          showSquared &&
          (eq.extraneous ?? []).map((v) => {
            const y = at(ysL, v)
            return Number.isFinite(y) ? <circle key={v} cx={X(v)} cy={Y(y)} r={4.5} fill="none" stroke="var(--bad)" strokeWidth={2} /> : null
          })}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="small muted">{tc(L('Solid line: the left side. Dashed line: the right side. The solutions are where they meet.', 'Garis penuh: ruas kiri. Garis putus-putus: ruas kanan. Penyelesaiannya adalah tempat keduanya bertemu.'))}</p>
        {done && (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('Between 0° and 360°', 'Di antara 0° dan 360°'))}: x = {eq.solutions.map((v) => `${short(v, sep, 4)}°`).join(', ')}
            </p>
            {eq.extraneous && showSquared && (
              <p className="warnline" style={{ overflowWrap: 'anywhere' }}>
                {tc(L(`The squared equation also has x = ${eq.extraneous.map((v) => `${short(v, sep, 4)}°`).join(', ')}. They are not solutions: there the two sides of the original equation are not equal (the hollow dots are not crossings).`, `Persamaan yang dikuadratkan juga memiliki x = ${eq.extraneous.map((v) => `${short(v, sep, 4)}°`).join(', ')}. Itu bukan penyelesaian: di sana kedua ruas persamaan semula tidak sama (titik kosong bukan titik potong).`))}
              </p>
            )}
          </>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------- bisection and Newton */

const VIEWS: Record<string, [number, number]> = {
  'cos-x': [0, 1.4],
  'sin-half': [0.6, 3.2],
  'tan-x': [4.0, 4.7],
  'x-sin-x': [0.3, 2.2],
  'cos-x-squared': [0, 1.3],
}

export function TrigEqNumeric() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('cos-x')
  const [method, setMethod] = useState<'bisect' | 'newton'>('bisect')
  const [shown, setShown] = useState(4)
  const eq = NUMERIC_EQUATIONS.find((e) => e.id === id)!
  const bis = useMemo(() => bisect(eq.f, eq.bracket[0], eq.bracket[1]), [eq])
  const nwt = useMemo(() => newton(eq.f, eq.df, eq.start), [eq])
  const root = nwt.root
  const rows = method === 'bisect' ? bis?.rows ?? [] : nwt.rows
  const count = Math.min(shown, rows.length)
  const estimate = (i: number): number => (method === 'bisect' ? bis!.rows[i].mid : nwt.rows[i].x)
  const est = count > 0 ? estimate(count - 1) : NaN
  const digits = Math.max(0, Math.floor(-Math.log10(Math.max(Math.abs(est - root), 1e-16))))
  const stepsFor = (list: number[]): number => {
    const i = list.findIndex((v) => Math.abs(v - root) < 1e-10)
    return i < 0 ? list.length : i + 1
  }
  const bisSteps = bis ? stepsFor(bis.rows.map((r) => r.mid)) : 0
  const nwtSteps = stepsFor(nwt.rows.map((r) => r.x)) - 1
  // the graph
  const [x0, x1] = VIEWS[id]
  const W = 340
  const H = 190
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i <= 300; i++) {
    const x = x0 + ((x1 - x0) * i) / 300
    xs.push(x)
    ys.push(eq.f(x))
  }
  const cap = id === 'tan-x' ? 4 : 50
  const fin = ys.filter((v) => Number.isFinite(v) && Math.abs(v) <= cap)
  const top = Math.max(0.1, ...fin) * 1.1
  const bottom = Math.min(-0.1, ...fin) * 1.1
  const X = (x: number): number => 14 + ((x - x0) / (x1 - x0)) * (W - 28)
  const Y = (y: number): number => 10 + ((top - y) / (top - bottom)) * (H - 30)
  const cur = count > 0 ? rows[count - 1] : null
  const label = `${tc(L('The graph of f(x) = left side − right side for', 'Grafik f(x) = ruas kiri − ruas kanan untuk'))} ${eq.id}. ${tc(method === 'bisect' ? L('Bisection', 'Bisection') : L("Newton's method", 'Metode Newton'))} ${tc(L('after', 'setelah'))} ${count} ${tc(L('rows gives', 'baris memberi'))} ${fmt(est, sep, 8)}`
  return (
    <Frame name="eqnumeric">
      <div className="chips">
        {NUMERIC_EQUATIONS.map((e) => (
          <button
            key={e.id}
            className={`chip ghost ${id === e.id ? 'on' : ''}`}
            onClick={() => {
              setId(e.id)
              setShown(4)
            }}
            aria-pressed={id === e.id}
          >
            <Tex src={e.tex} />
          </button>
        ))}
      </div>
      <div className="chips">
        <button className={`chip ${method === 'bisect' ? 'on' : ''}`} onClick={() => (setMethod('bisect'), setShown(4))} aria-pressed={method === 'bisect'}>
          {tc(L('bisection', 'bisection (belah dua)'))}
        </button>
        <button className={`chip ${method === 'newton' ? 'on' : ''}`} onClick={() => (setMethod('newton'), setShown(4))} aria-pressed={method === 'newton'}>
          {tc(L("Newton's method", 'metode Newton'))}
        </button>
      </div>
      <label className="lbl slider">
        {tc(L('rows shown', 'baris ditampilkan'))} = <b>{count}</b>
        <input type="range" min={1} max={Math.max(1, rows.length)} step={1} value={count} aria-label={tc(L('rows shown', 'baris ditampilkan'))} onChange={(e) => setShown(Number(e.target.value))} />
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 460, display: 'block', margin: '6px auto' }}>
        <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
        <path d={linePath(xs, ys, X, Y, cap)} fill="none" stroke="var(--brand)" strokeWidth={2.2} />
        {method === 'bisect' && cur && 'a' in cur && (
          <>
            <line x1={X(cur.a)} y1={Y(0)} x2={X(cur.b)} y2={Y(0)} stroke="var(--coral)" strokeWidth={5} strokeLinecap="round" />
            <circle cx={X(cur.mid)} cy={Y(cur.fmid)} r={4} fill="var(--bad)" />
          </>
        )}
        {method === 'newton' &&
          nwt.rows.slice(0, count).map((r, i) => (
            <g key={i}>
              {Number.isFinite(r.fx) && Math.abs(r.fx) <= cap && <circle cx={X(r.x)} cy={Y(r.fx)} r={i === count - 1 ? 4.5 : 3} fill={i === count - 1 ? 'var(--bad)' : 'var(--muted)'} />}
              {i === count - 1 && i + 1 < nwt.rows.length && Number.isFinite(r.fx) && Math.abs(r.fx) <= cap && (
                <line x1={X(r.x)} y1={Y(r.fx)} x2={X(nwt.rows[i + 1].x)} y2={Y(0)} stroke="var(--coral)" strokeWidth={1.6} strokeDasharray="5 3" />
              )}
            </g>
          ))}
        <circle cx={X(root)} cy={Y(0)} r={3} fill="var(--text)" />
        <text x={X(x0)} y={H - 3} fontSize={9} fill="var(--muted)">
          {short(x0, sep, 2)}
        </text>
        <text x={X(x1)} y={H - 3} fontSize={9} textAnchor="end" fill="var(--muted)">
          {short(x1, sep, 2)}
        </text>
      </svg>
      <div style={{ overflowX: 'auto', maxHeight: 230, overflowY: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>n</th>
              {method === 'bisect' ? (
                <>
                  <th>a</th>
                  <th>b</th>
                  <th>{tc(L('midpoint', 'titik tengah'))}</th>
                  <th>f({tc(L('mid', 'tengah'))})</th>
                </>
              ) : (
                <>
                  <th>x</th>
                  <th>f(x)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {method === 'bisect'
              ? (bis?.rows ?? []).slice(0, count).map((r) => (
                  <tr key={r.n}>
                    <td>{r.n}</td>
                    <td>{fmt(r.a, sep, 9)}</td>
                    <td>{fmt(r.b, sep, 9)}</td>
                    <td>{fmt(r.mid, sep, 9)}</td>
                    <td>{fmt(r.fmid, sep, 9)}</td>
                  </tr>
                ))
              : nwt.rows.slice(0, count).map((r) => (
                  <tr key={r.n}>
                    <td>{r.n}</td>
                    <td>{fmt(r.x, sep, 12)}</td>
                    <td>{fmt(r.fx, sep, 12)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {tc(L(`After ${count} row${count === 1 ? '' : 's'}: x ≈ ${fmt(est, sep, 10)}, correct to about ${digits} decimal place${digits === 1 ? '' : 's'}.`, `Setelah ${count} baris: x ≈ ${fmt(est, sep, 10)}, benar sampai sekitar ${digits} angka desimal.`))}
        </p>
        <p className="small muted">
          {tc(L(`To get 10 correct decimals, bisection needs ${bisSteps} steps here and Newton's method ${nwtSteps}.`, `Untuk 10 desimal yang benar, bisection memerlukan ${bisSteps} langkah di sini dan metode Newton ${nwtSteps}.`))}
        </p>
      </div>
    </Frame>
  )
}
