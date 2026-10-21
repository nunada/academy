import { useState } from 'react'
import { useI18n } from '../../i18n'
import { PATTERNS, chart, compare, monotone, type Mono, type MonoError, type Trend, type Verdict } from '../../lib/monotone'
import { evalFloat, toTex } from '../../lib/chain'
import { exprTex } from '../../lib/exprtex'
import { parseFunction } from '../../lib/linearize'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'
import { aText, numOf } from './ExtremeWidgets'
import { yRange } from './MvtWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)

const ERR: Record<MonoError | 'bounds', { en: string; id: string }> = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, powers such as x^2 or x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…) and abs(…), for example x^3-12*x.', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, pangkat seperti x^2 atau x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…), dan abs(…), misalnya x^3-12*x.' },
  big: { en: 'That is too long. Try a shorter one.', id: 'Itu terlalu panjang. Coba yang lebih pendek.' },
  interval: { en: 'Type two numbers a < b for the ends of the window, such as -4 and 4.', id: 'Ketik dua bilangan a < b untuk ujung jendela, seperti -4 dan 4.' },
  bounds: { en: 'Type the ends a and b as numbers, such as -4, 5 or 2*pi.', id: 'Ketik ujung a dan b sebagai bilangan, seperti -4, 5, atau 2*pi.' },
  undefined: { en: 'The function is not defined at every point of [a, b]. Choose a window inside its domain.', id: 'Fungsi tidak terdefinisi di setiap titik [a, b]. Pilih jendela di dalam domainnya.' },
  discontinuous: { en: 'The function has a break (a pole or a jump) inside [a, b], so a sign chart of f′ would say nothing about it. Choose a window without the break.', id: 'Fungsi memiliki putus (kutub atau lompatan) di dalam [a, b], sehingga bagan tanda f′ tidak berarti. Pilih jendela tanpa putus.' },
}

const TREND: Record<Trend, { en: string; id: string }> = {
  up: { en: 'increasing', id: 'naik' },
  down: { en: 'decreasing', id: 'turun' },
  flat: { en: 'constant', id: 'konstan' },
}
const SIGN: Record<Trend, string> = { up: '+', down: '−', flat: '0' }
const KIND = {
  zero: { en: 'f′ = 0', id: 'f′ = 0' },
  undefined: { en: 'f′ does not exist', id: 'f′ tidak ada' },
}
const VERDICT: Record<Verdict, { en: string; id: string }> = {
  min: { en: 'local minimum', id: 'minimum lokal' },
  max: { en: 'local maximum', id: 'maksimum lokal' },
  none: { en: 'no extreme value', id: 'bukan ekstrem' },
}
const pieceCls = (t: Trend): string => (t === 'up' ? 'tancurve' : t === 'down' ? 'tancurve sec' : 'tancurve faint')

/** The graph of a function drawn in the colour of what it does on each piece: dark where it rises, orange where it falls. */
function pieceCurves(r: Mono, g: (x: number) => number) {
  return r.pieces.map((q) => ({ f: (x: number) => (x >= q.lo && x <= q.hi ? g(x) : NaN), cls: pieceCls(q.trend) }))
}

/** The table of pieces: interval, the sign of f′, and what f does. */
function PieceTable({ r, sep, derivativeOnly = false }: { r: Mono; sep: string; derivativeOnly?: boolean }) {
  const { tc } = useI18n()
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="rtable">
        <thead>
          <tr>
            <th>{tc(L('interval', 'selang'))}</th>
            <th>{tc(L('sign of f′', 'tanda f′'))}</th>
            <th>f</th>
          </tr>
        </thead>
        <tbody>
          {r.pieces.map((q, i) => (
            <tr key={i} className={q.trend === 'up' ? 'grp0' : q.trend === 'down' ? 'grp1' : ''}>
              <td>
                ({four(q.lo, sep)}, {four(q.hi, sep)})
              </td>
              <td>{SIGN[q.trend]}</td>
              <td>{derivativeOnly && q.trend === 'flat' ? '' : tc(TREND[q.trend])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------- where f rises and falls, on any function */

interface Preset {
  src: string
  a: number
  b: number
}
const PRESETS: Preset[] = [
  { src: 'x^3-12*x-5', a: -4, b: 4 },
  { src: 'x^(1/3)*(x-4)', a: -2, b: 5 },
  { src: '(x^2-3)*e^x', a: -6, b: 3 },
  { src: 'x^4-8*x^2+16', a: -3, b: 3 },
  { src: 'sin(x)-cos(x)', a: 0, b: 2 * Math.PI },
  { src: '2*x^3-3*x^2', a: -1, b: 2 },
  { src: 'x^3', a: -2, b: 2 },
]

export function MonoTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(PRESETS[0].src)
  const [aStr, setAStr] = useState(aText(PRESETS[0].a))
  const [bStr, setBStr] = useState(aText(PRESETS[0].b))
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)

  let body
  if (a === null || b === null) body = <p className="noline">{ERR.bounds[lang]}</p>
  else {
    const r = monotone(src, a, b)
    if (!r.ok) body = <p className="noline">{ERR[r.error][lang]}</p>
    else {
      const f = (x: number) => evalFloat(r.f!, x)
      const len = b - a
      const ys = Array.from({ length: 301 }, (_, i) => f(a + (len * i) / 300))
      const [lo, hi] = yRange(ys, false)
      const ds = Array.from({ length: 301 }, (_, i) => evalFloat(r.df, a + (len * (i + 0.5)) / 301))
      const [dlo, dhi] = yRange(ds, true)
      const xr: [number, number] = [a - len * 0.04, b + len * 0.04]
      const mark = r.crit.map((c) => ({ x: c.x, y: c.fx, cls: c.verdict === 'none' ? 'tandot' : 'tandot sec', open: c.verdict === 'none' }))
      const ends = [
        { x: a, y: f(a), cls: r.endA === 'none' ? 'tandot' : 'tandot sec', open: r.endA === 'none' },
        { x: b, y: f(b), cls: r.endB === 'none' ? 'tandot' : 'tandot sec', open: r.endB === 'none' },
      ]
      body = (
        <>
          <Plot
            xr={xr}
            yr={[lo, hi]}
            curves={pieceCurves(r, f)}
            vlines={r.crit.map((c) => ({ x: c.x, cls: 'tannorm' }))}
            dots={[...mark, ...ends]}
            label={tc(L('The graph of f, dark where it rises and orange where it falls, with its critical points', 'Grafik f, gelap saat naik dan oranye saat turun, dengan titik kritisnya'))}
          />
          <p className="small muted">{tc(L('The graph of f′: above the axis f rises, below it f falls.', 'Grafik f′: di atas sumbu f naik, di bawahnya f turun.'))}</p>
          <Plot
            xr={xr}
            yr={[Math.min(dlo, -0.2 * (dhi - dlo)), Math.max(dhi, 0.2 * (dhi - dlo))]}
            curves={pieceCurves(r, (x) => evalFloat(r.df, x))}
            vlines={r.crit.map((c) => ({ x: c.x, cls: 'tannorm' }))}
            label={tc(L('The graph of the derivative f′', 'Grafik turunan f′'))}
          />
          <PieceTable r={r} sep={sep} />
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`f(x)=${toTex(r.f!)}`)} />
            </p>
            {toTex(r.df).length <= 45 && (
              <p>
                <Tex src={dec(`f'(x)=${toTex(r.df)}`)} />
              </p>
            )}
            <p className="okline">
              {r.runs
                .filter((q) => q.trend !== 'flat')
                .map((q) => `${tc(L('f is', 'f'))} ${tc(TREND[q.trend])} ${tc(L('on', 'pada'))} [${four(q.lo, sep)}, ${four(q.hi, sep)}]`)
                .join('; ')}
              .
            </p>
            {r.crit.length > 0 ? (
              <p>
                {r.crit
                  .map((c) => `x = ${four(Math.abs(c.x) < 1e-6 ? 0 : c.x, sep)} (${tc(KIND[c.kind])}): ${tc(VERDICT[c.verdict])}${c.verdict === 'none' ? '' : `, f = ${four(c.fx, sep)}`}`)
                  .join('. ')}
                .
              </p>
            ) : (
              <p>{tc(L('f′ has no critical point in the interval, so f is monotonic on the whole window.', 'f′ tidak punya titik kritis di dalam selang, sehingga f monoton pada seluruh jendela.'))}</p>
            )}
            <p className="small">
              {tc(L('At the ends only one side exists:', 'Di ujung hanya ada satu sisi:'))} x = {four(a, sep)}: {tc(VERDICT[r.endA])}; x = {four(b, sep)}: {tc(VERDICT[r.endB])}.{' '}
              {tc(L('Absolute maximum', 'Maksimum mutlak'))} {four(r.absMax!.value, sep)} {tc(L('at', 'di'))} {r.absMax!.at.map((x) => four(x, sep)).join(', ')}; {tc(L('absolute minimum', 'minimum mutlak'))} {four(r.absMin!.value, sep)} {tc(L('at', 'di'))} {r.absMin!.at.map((x) => four(x, sep)).join(', ')}.
            </p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="monotool">
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
        {PRESETS.map((q) => (
          <button key={q.src} className="chip ghost" onClick={() => { setSrc(q.src); setAStr(aText(q.a)); setBStr(aText(q.b)) }}>
            <Tex src={`${exprTex(q.src)},\\ [${exprTex(aText(q.a))},\\ ${exprTex(aText(q.b))}]`} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ------------------------------------------------------- the First Derivative Test, case by case */

export function FirstTest() {
  const { tc } = useI18n()
  const [id, setId] = useState('min')
  const q = PATTERNS.find((p) => p.id === id) ?? PATTERNS[0]
  const r = monotone(q.src, q.a, q.b)
  if (!r.ok) return null
  const f = (x: number) => evalFloat(r.f!, x)
  const c = r.crit.find((k) => Math.abs(k.x - q.c) < 1e-5)
  const len = q.b - q.a
  const ys = Array.from({ length: 201 }, (_, i) => f(q.a + (len * i) / 200))
  const [lo, hi] = yRange(ys, false)
  const word = (t: Trend): string => tc(t === 'up' ? L('positive', 'positif') : t === 'down' ? L('negative', 'negatif') : L('zero', 'nol'))
  return (
    <Frame name="firsttest">
      <div className="chips">
        {PATTERNS.map((p) => (
          <button key={p.id} className={`chip ${id === p.id ? 'on' : ''}`} onClick={() => setId(p.id)} aria-pressed={id === p.id}>
            <Tex src={p.tex} />
          </button>
        ))}
      </div>
      <Plot
        xr={[q.a - len * 0.04, q.b + len * 0.04]}
        yr={[lo, hi]}
        curves={pieceCurves(r, f)}
        vlines={[{ x: q.c, cls: 'tannorm' }]}
        dots={c ? [{ x: q.c, y: c.fx, cls: c.verdict === 'none' ? 'tandot' : 'tandot sec', open: c.verdict === 'none' }] : []}
        label={tc(L('The graph, dark where it rises and orange where it falls, with its critical point', 'Grafik, gelap saat naik dan oranye saat turun, dengan titik kritisnya'))}
      />
      {c && (
        <div className="wgtout" aria-live="polite">
          <p>
            <Tex src={q.tex} />, {tc(L('critical point', 'titik kritis'))} <Tex src={`x=${q.c}`} /> ({tc(KIND[c.kind])})
          </p>
          <p>
            f′ {tc(L('to the left:', 'di kiri:'))} <b>{word(c.left)}</b> ({SIGN[c.left]}); f′ {tc(L('to the right:', 'di kanan:'))} <b>{word(c.right)}</b> ({SIGN[c.right]})
          </p>
          <p className={c.verdict === 'none' ? 'noline' : 'okline'}>
            <b>{tc(VERDICT[c.verdict])}</b>. {tc(q.note)}
          </p>
        </div>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------ from the derivative to the function */

const DPRESETS = ['x*(x-1)', '(x-1)*(x+2)', '(x-1)^2*(x+2)', '(x-1)^2*(x+2)^2', '(x-1)*e^(-x)', '(x-7)*(x+1)*(x+5)', '1-4/x^2']

export function SignChart() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(DPRESETS[2])
  const [aStr, setAStr] = useState('-4')
  const [bStr, setBStr] = useState('4')
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)

  let body
  if (a === null || b === null) body = <p className="noline">{ERR.bounds[lang]}</p>
  else {
    const r = chart(src, a, b)
    if (!r.ok) body = <p className="noline">{ERR[r.error][lang]}</p>
    else {
      const len = b - a
      const ds = Array.from({ length: 301 }, (_, i) => evalFloat(r.df, a + (len * (i + 0.5)) / 301))
      const [lo, hi] = yRange(ds, true)
      body = (
        <>
          <Plot
            xr={[a - len * 0.04, b + len * 0.04]}
            yr={[Math.min(lo, -0.2 * (hi - lo)), Math.max(hi, 0.2 * (hi - lo))]}
            curves={pieceCurves(r, (x) => evalFloat(r.df, x))}
            vlines={r.crit.map((c) => ({ x: c.x, cls: 'tannorm' }))}
            dots={r.crit.filter((c) => c.kind === 'zero').map((c) => ({ x: c.x, y: 0, cls: c.verdict === 'none' ? 'tandot' : 'tandot sec', open: c.verdict === 'none' }))}
            label={tc(L('The graph of f′: dark above the axis (f rises), orange below it (f falls)', 'Grafik f′: gelap di atas sumbu (f naik), oranye di bawahnya (f turun)'))}
          />
          <PieceTable r={r} sep={sep} derivativeOnly />
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`f'(x)=${toTex(r.df)}`)} />
            </p>
            {r.crit.length > 0 ? (
              <p>
                {r.crit
                  .map((c) => `x = ${four(Math.abs(c.x) < 1e-6 ? 0 : c.x, sep)} (${tc(KIND[c.kind])}): ${SIGN[c.left]} → ${SIGN[c.right]}, ${tc(VERDICT[c.verdict])}`)
                  .join('. ')}
                .
              </p>
            ) : (
              <p>{tc(L('f′ never changes sign in the window, so f is monotonic on it.', 'f′ tidak pernah berganti tanda pada jendela, sehingga f monoton di sana.'))}</p>
            )}
            <p className="small">
              {tc(L('This takes f to be continuous. Where f′ does not exist, f must be defined for the point to count as critical; the test then reads the signs on both sides.', 'Ini menganggap f kontinu. Di tempat f′ tidak ada, f harus terdefinisi agar titik itu dihitung kritis; uji kemudian membaca tanda di kedua sisi.'))}
            </p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="signchart">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f′(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={src} aria-label="f'(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
        </label>
        <label className="lbl">
          b = <input style={{ width: '5em' }} value={bStr} aria-label="b" onChange={(e) => setBStr(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {DPRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setSrc(p)}>
            <Tex src={exprTex(p)} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ----------------------------------------------------------- an inequality from monotonicity */

interface Pair {
  f: string
  g: string
  a: number
  b: number
}
const PAIRS: Pair[] = [
  { f: 'e^x', g: '1+x', a: 0, b: 3 },
  { f: 'e^x', g: '1+x+x^2/2', a: 0, b: 3 },
  { f: 'x', g: 'ln(x)', a: 1, b: 6 },
  { f: 'x', g: 'sin(x)', a: 0, b: 3 },
  { f: 'x', g: 'arctan(x)', a: 0, b: 4 },
  { f: 'sin(x)', g: 'x', a: 0, b: 3 },
]

export function InequalityTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [fs, setFs] = useState(PAIRS[0].f)
  const [gs, setGs] = useState(PAIRS[0].g)
  const [aStr, setAStr] = useState(aText(PAIRS[0].a))
  const [bStr, setBStr] = useState(aText(PAIRS[0].b))
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)

  let body
  if (a === null || b === null) body = <p className="noline">{ERR.bounds[lang]}</p>
  else {
    const r = compare(fs, gs, a, b)
    if (!r.ok) body = <p className="noline">{ERR[r.error][lang]}</p>
    else {
      const h = r.h
      const hf = (x: number) => evalFloat(h.f!, x)
      const len = b - a
      const ys = Array.from({ length: 301 }, (_, i) => hf(a + (len * i) / 300))
      const [lo, hi] = yRange(ys, false)
      const xr: [number, number] = [a - len * 0.04, b + len * 0.04]
      const F = parseFloatFn(fs)
      const G = parseFloatFn(gs)
      body = (
        <>
          <Plot
            xr={xr}
            yr={yRange([...Array.from({ length: 151 }, (_, i) => F(a + (len * i) / 150)), ...Array.from({ length: 151 }, (_, i) => G(a + (len * i) / 150))], false)}
            curves={[
              { f: (x) => F(x), cls: 'tancurve' },
              { f: (x) => G(x), cls: 'tancurve sec' },
            ]}
            label={tc(L('The graphs of f (dark) and g (orange)', 'Grafik f (gelap) dan g (oranye)'))}
          />
          <p className="small muted">{tc(L('The difference h = f − g, dark where it rises and orange where it falls.', 'Selisih h = f − g, gelap saat naik dan oranye saat turun.'))}</p>
          <Plot
            xr={xr}
            yr={[Math.min(lo, -0.1 * (hi - lo)), Math.max(hi, 0.1 * (hi - lo))]}
            curves={pieceCurves(h, hf)}
            dots={[{ x: a, y: r.ha }, ...r.min.at.map((x) => ({ x, y: r.min.value, cls: 'tandot sec' }))]}
            label={tc(L('The graph of the difference h = f − g', 'Grafik selisih h = f − g'))}
          />
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`h(x)=f(x)-g(x)=${toTex(h.f!)}`)} />
            </p>
            <p>
              h({four(a, sep)}) = {four(r.ha, sep)}; {h.pieces.every((p) => p.trend !== 'down') ? tc(L('h′ is never negative on [a, b]', 'h′ tidak pernah negatif pada [a, b]')) : tc(L('h′ is negative somewhere on [a, b]', 'h′ negatif di suatu tempat pada [a, b]'))}.
            </p>
            {r.holds ? (
              <p className="okline">
                {r.byMonotone
                  ? tc(L('So h is increasing from a value that is at least 0, and f ≥ g on the whole interval.', 'Jadi h naik dari nilai yang paling sedikit 0, dan f ≥ g pada seluruh selang.'))
                  : tc(L('f ≥ g on the whole interval, but not because h is increasing from the start: h dips first, and its smallest value is', 'f ≥ g pada seluruh selang, tetapi bukan karena h naik sejak awal: h turun dahulu, dan nilai terkecilnya'))}
                {r.byMonotone ? '' : ` ${four(r.min.value, sep)}.`}
                {r.strict ? ` ${tc(L('The inequality is strict after the first point.', 'Pertidaksamaan itu ketat setelah titik pertama.'))}` : ''}
              </p>
            ) : (
              <p className="noline">
                {tc(L('f ≥ g fails: the smallest value of h is', 'f ≥ g tidak berlaku: nilai terkecil h adalah'))} {four(r.min.value, sep)} {tc(L('at x =', 'di x ='))} {r.min.at.map((x) => four(x, sep)).join(', ')}.
              </p>
            )}
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="inequality">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={fs} aria-label="f(x)" onChange={(e) => setFs(e.target.value)} />
        </label>
        <label className="lbl" style={{ width: '100%' }}>
          g(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={gs} aria-label="g(x)" onChange={(e) => setGs(e.target.value)} />
        </label>
        <label className="lbl">
          a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
        </label>
        <label className="lbl">
          b = <input style={{ width: '5em' }} value={bStr} aria-label="b" onChange={(e) => setBStr(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {PAIRS.map((q) => (
          <button key={q.f + q.g} className="chip ghost" onClick={() => { setFs(q.f); setGs(q.g); setAStr(aText(q.a)); setBStr(aText(q.b)) }}>
            <Tex src={`${exprTex(q.f)}\\ \\ge\\ ${exprTex(q.g)}`} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/** A function typed as text, as a JavaScript function of x (NaN where it is not a number). */
function parseFloatFn(src: string): (x: number) => number {
  const f = parseFunction(src)
  return typeof f === 'string' ? () => NaN : (x) => evalFloat(f, x)
}
