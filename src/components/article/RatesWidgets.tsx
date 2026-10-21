import { useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { AlgebraError } from '../../lib/algebra'
import { GEO, analyzeMotion, breakEvenMarginal, marginalAt, motionOf, toNumber, type Poly, type Rat } from '../../lib/rates'
import { parsePolynomialInX, polyTex } from '../../lib/tangent'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { num, rt, show, small } from './TangentWidgets'

const floatFn = (p: Poly) => {
  const cs = p.map(num)
  return (x: number) => cs.reduceRight((acc, c) => acc * x + c, 0)
}

/** A range that holds a function over a window, with some room, and always the axis. */
function rangeOf(f: (x: number) => number, lo: number, hi: number): [number, number] {
  let mn = 0
  let mx = 0
  for (let i = 0; i <= 120; i++) {
    const y = f(lo + ((hi - lo) * i) / 120)
    if (Number.isFinite(y)) {
      mn = Math.min(mn, y)
      mx = Math.max(mx, y)
    }
  }
  const span = mx - mn || 2
  return [mn - span * 0.12, mx + span * 0.12]
}

/** A polynomial in the letter t or x. */
function readPoly(src: string): { poly: Poly | null; err: 'syntax' | 'letter' | null } {
  if (src.length > 50) return { poly: null, err: 'syntax' }
  try {
    return { poly: parsePolynomialInX(src.replace(/t/gi, 'x')), err: null }
  } catch (e) {
    return { poly: null, err: e instanceof AlgebraError && e.code === 'multi' ? 'letter' : 'syntax' }
  }
}

const tTex = (p: Poly) => polyTex(p, 't')

/* ------------------------------------------------------- motion along a line */

const MOTION_PRESETS: [string, string, string][] = [
  ['t^2 - 3t + 2', '0', '2'],
  ['t^3 - 6t^2 + 9t', '0', '4'],
  ['49t - 4.9t^2', '0', '10'],
  ['4.9t^2', '0', '3'],
  ['t^4 - 4t^3 + 4t^2', '0', '3'],
]

export function MotionAlongLine() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState('t^3 - 6t^2 + 9t')
  const [a0, setA0] = useState('0')
  const [a1, setA1] = useState('4')
  const { poly, err } = readPoly(src)
  const t0 = parseRational(a0)
  const t1 = parseRational(a1)

  let body
  if (!poly) {
    body = (
      <p className="noline">
        {err === 'letter'
          ? tc(L('Use only the letter t.', 'Gunakan hanya huruf t.'))
          : tc(L('Type the position as a polynomial in t of degree at most 8, such as t^3 - 6t^2 + 9t or 49t - 4.9t^2.', 'Ketik posisi sebagai polinomial dalam t berderajat paling tinggi 8, seperti t^3 - 6t^2 + 9t atau 49t - 4,9t^2.'))}
      </p>
    )
  } else if (!small(t0) || !small(t1) || t0.n * t1.d >= t1.n * t0.d || num(t1) - num(t0) > 60) {
    body = <p className="noline">{tc(L('Type two times with the first smaller than the second (at most 60 apart), such as 0 and 4.', 'Ketik dua waktu dengan yang pertama lebih kecil daripada yang kedua (selisih paling banyak 60), seperti 0 dan 4.'))}</p>
  } else {
    const T0 = t0 as Rat
    const T1 = t1 as Rat
    const m = motionOf(poly)
    const rep = analyzeMotion(m, T0, T1)
    const lo = num(T0)
    const hi = num(T1)
    const fs = floatFn(m.s)
    const fv = floatFn(m.v)
    const fa = floatFn(m.a)
    const dir = (d: string) => (d === 'forward' ? tc(L('forward', 'maju')) : d === 'backward' ? tc(L('backward', 'mundur')) : tc(L('at rest', 'diam')))
    const pace = (p: string) => (p === 'up' ? tc(L('speeding up', 'makin cepat')) : p === 'down' ? tc(L('slowing down', 'makin lambat')) : tc(L('steady', 'tetap')))
    body = (
      <>
        <p>
          <Tex src={`s=${tTex(m.s)}`} />
        </p>
        <p>
          <Tex src={`v=s'=${tTex(m.v)}`} />
        </p>
        <p>
          <Tex src={`a=v'=${tTex(m.a)}`} />
        </p>
        <p>
          <Tex src={`j=a'=${tTex(m.j)}`} />
        </p>
        <p className="small muted">{tc(L('Position s', 'Posisi s'))}</p>
        <Plot xr={[lo, hi]} yr={rangeOf(fs, lo, hi)} curves={[{ f: fs, cls: 'tancurve' }]} dots={rep.turns.map((r) => ({ x: toNumber(r), y: fs(toNumber(r)), cls: 'tandot sec' }))} label={tc(L('The position as a function of time', 'Posisi sebagai fungsi waktu'))} />
        <p className="small muted">{tc(L('Velocity v (above the axis: forward, below: backward)', 'Kecepatan v (di atas sumbu: maju, di bawah: mundur)'))}</p>
        <Plot xr={[lo, hi]} yr={rangeOf(fv, lo, hi)} curves={[{ f: fv, cls: 'tancurve sec' }]} dots={rep.turns.map((r) => ({ x: toNumber(r), y: 0, cls: 'tandot sec' }))} label={tc(L('The velocity as a function of time', 'Kecepatan sebagai fungsi waktu'))} />
        <p className="small muted">{tc(L('Acceleration a', 'Percepatan a'))}</p>
        <Plot xr={[lo, hi]} yr={rangeOf(fa, lo, hi)} curves={[{ f: fa, cls: 'tancurve faint' }]} label={tc(L('The acceleration as a function of time', 'Percepatan sebagai fungsi waktu'))} />
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th>t</th>
                <th>{tc(L('direction', 'arah'))}</th>
                <th>{tc(L('pace', 'laju'))}</th>
              </tr>
            </thead>
            <tbody>
              {rep.segments.map((sg, i) => (
                <tr key={i}>
                  <td>
                    {show(toNumber(sg.from), sep)} → {show(toNumber(sg.to), sep)}
                  </td>
                  <td>{dir(sg.direction)}</td>
                  <td>{pace(sg.pace)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          {tc(L('Displacement', 'Perpindahan'))}: <b>{show(toNumber(rep.displacement), sep)}</b>; {tc(L('average velocity', 'kecepatan rata-rata'))}: <b>{show(toNumber(rep.averageVelocity), sep)}</b>; {tc(L('total distance travelled', 'jarak total yang ditempuh'))}: <b>{show(rep.distance, sep)}</b>.
        </p>
        <p className={rep.turns.length ? 'okline' : ''} aria-live="polite">
          {rep.turns.length === 0
            ? tc(L('The body never turns round in this interval.', 'Benda tidak pernah berbalik arah dalam selang ini.'))
            : tc(L('The body turns round at t = ', 'Benda berbalik arah di t = ')) + rep.turns.map((r) => show(toNumber(r), sep)).join(', ') + '.'}
        </p>
        <p className="small muted">
          {lang === 'en'
            ? 'It speeds up where v and a have the same sign and slows down where they have opposite signs. Turning times that are not fractions are shown as decimals from an exact isolating interval.'
            : 'Ia makin cepat di tempat v dan a bertanda sama dan makin lambat di tempat bertanda berlawanan. Waktu berbalik yang bukan pecahan ditampilkan sebagai desimal dari selang pemisah yang eksak.'}
        </p>
      </>
    )
  }

  return (
    <Frame name="motionline">
      <div className="inrow">
        <label className="lbl">
          s(t) = <input style={{ width: '13em', maxWidth: '100%' }} value={src} aria-label="s(t)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          t₀ = <input style={{ width: '3.5em' }} value={a0} aria-label="t0" onChange={(e) => setA0(e.target.value)} />
        </label>
        <label className="lbl">
          t₁ = <input style={{ width: '3.5em' }} value={a1} aria-label="t1" onChange={(e) => setA1(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {MOTION_PRESETS.map(([f, x, y]) => (
          <button
            key={f}
            className="chip ghost"
            onClick={() => {
              setSrc(f)
              setA0(x)
              setA1(y)
            }}
          >
            <Tex src={exprTex(f)} />
          </button>
        ))}
      </div>
      <div className="wgtout">{body}</div>
    </Frame>
  )
}

/* ------------------------------------------------------- marginal analysis */

const MARGINAL_PRESETS: [string, string, string][] = [
  ['x^3 - 6x^2 + 15x', 'x^3 - 3x^2 + 12x', '10'],
  ['2x^2 + 30x + 400', '120x - x^2', '10'],
  ['x^2 + 20x + 500', '100x', '20'],
]

export function MarginalAnalysis() {
  const { tc } = useI18n()
  const sep = useSep()
  const [cs, setCs] = useState('x^3 - 6x^2 + 15x')
  const [rs, setRs] = useState('x^3 - 3x^2 + 12x')
  const [xs, setXs] = useState('10')
  const C = readPoly(cs)
  const Rv = readPoly(rs)
  const x0 = parseRational(xs)
  const money = tc(L('dollars', 'ribu rupiah'))

  let body
  if (!C.poly || !Rv.poly) {
    body = <p className="noline">{tc(L('Type the cost and the revenue as polynomials in x, such as x^3 - 6x^2 + 15x.', 'Ketik biaya dan pendapatan sebagai polinomial dalam x, seperti x^3 - 6x^2 + 15x.'))}</p>
  } else if (!small(x0) || x0.n < 0n) {
    body = <p className="noline">{tc(L('Type the number of units as a whole number or a fraction that is not negative, such as 10.', 'Ketik banyak satuan sebagai bilangan bulat atau pecahan tidak negatif, seperti 10.'))}</p>
  } else {
    const X0 = x0 as Rat
    const c = C.poly
    const r = Rv.poly
    const mc = marginalAt(c, X0)
    const mr = marginalAt(r, X0)
    const roots = breakEvenMarginal(c, r)
    const hi = Math.max(5, num(X0) * 2)
    const fc = floatFn(c)
    const fr = floatFn(r)
    const both = (x: number) => Math.max(fc(x), fr(x))
    const [y0, y1] = rangeOf(both, 0, hi)
    const lowest = rangeOf((x) => Math.min(fc(x), fr(x)), 0, hi)[0]
    const estProfit = num(mr.marginal) - num(mc.marginal)
    const trueProfit = num(mr.next) - num(mc.next)
    body = (
      <>
        <p>
          <Tex src={`c(x)=${polyTex(c)},\\qquad r(x)=${polyTex(r)}`} />
        </p>
        <Plot xr={[0, hi]} yr={[Math.min(lowest, y0), y1]} curves={[{ f: fc, cls: 'tancurve sec' }, { f: fr, cls: 'tancurve' }]} vlines={[{ x: num(X0), cls: 'tannorm' }]} label={tc(L('The graphs of cost (orange) and revenue (green)', 'Grafik biaya (jingga) dan pendapatan (hijau)'))} />
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th />
                <th>{tc(L('marginal (the derivative)', 'marjinal (turunan)'))}</th>
                <th>{tc(L('one more unit, exactly', 'satu satuan lagi, eksak'))}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tc(L('cost', 'biaya'))}</td>
                <td>{show(toNumber(mc.marginal), sep)}</td>
                <td>{show(toNumber(mc.next), sep)}</td>
              </tr>
              <tr>
                <td>{tc(L('revenue', 'pendapatan'))}</td>
                <td>{show(toNumber(mr.marginal), sep)}</td>
                <td>{show(toNumber(mr.next), sep)}</td>
              </tr>
              <tr className="hi">
                <td>{tc(L('profit', 'laba'))}</td>
                <td>{show(estProfit, sep)}</td>
                <td>{show(trueProfit, sep)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small">
          {tc(L('All amounts in', 'Semua jumlah dalam'))} {money}. {tc(L('Average cost at this level:', 'Biaya rata-rata pada tingkat ini:'))} {mc.average ? show(toNumber(mc.average), sep) : '–'} {tc(L('per unit', 'per satuan'))}.
        </p>
        <p className="small">
          <Tex src={`c'(${rt(X0)})=${rt(mc.marginal)},\\qquad r'(${rt(X0)})=${rt(mr.marginal)}`} />
        </p>
        <p className={roots && roots.length ? 'okline' : 'small'}>
          {roots === null
            ? tc(L('The numbers are too large to search for where marginal revenue equals marginal cost.', 'Bilangannya terlalu besar untuk mencari tempat pendapatan marjinal sama dengan biaya marjinal.'))
            : roots.length
              ? tc(L('Marginal revenue equals marginal cost, so marginal profit is zero, at x = ', 'Pendapatan marjinal sama dengan biaya marjinal, sehingga laba marjinal nol, di x = ')) + roots.map((q) => (q.d === 1n ? `${q.n}` : `${q.n}/${q.d}`)).join(', ') + '.'
              : tc(L('Marginal revenue never equals marginal cost at a rational x.', 'Pendapatan marjinal tidak pernah sama dengan biaya marjinal di x rasional.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="marginals">
      <div className="inrow">
        <label className="lbl">
          c(x) = <input style={{ width: '12em', maxWidth: '100%' }} value={cs} aria-label="c(x)" onChange={(e) => setCs(e.target.value)} />
        </label>
        <label className="lbl">
          r(x) = <input style={{ width: '12em', maxWidth: '100%' }} value={rs} aria-label="r(x)" onChange={(e) => setRs(e.target.value)} />
        </label>
        <label className="lbl">
          x₀ = <input style={{ width: '3.5em' }} value={xs} aria-label="x0" onChange={(e) => setXs(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {MARGINAL_PRESETS.map(([c, r, x]) => (
          <button
            key={c + r}
            className="chip ghost"
            onClick={() => {
              setCs(c)
              setRs(r)
              setXs(x)
            }}
          >
            <Tex src={`${exprTex(c)}\\ \\mid\\ ${exprTex(r)}`} />
          </button>
        ))}
      </div>
      <div className="wgtout">{body}</div>
    </Frame>
  )
}

/* ------------------------------------------------------------ geometric rates */

export function GeometricRates() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('circle-r')
  const g = GEO.find((k) => k.id === id) ?? GEO[0]
  const [x, setX] = useState(g.x0)
  const steps = [1, 0.1, 0.01]
  return (
    <Frame name="georates">
      <div className="chips">
        {GEO.map((k) => (
          <button
            key={k.id}
            className={`chip ${id === k.id ? 'on' : ''}`}
            onClick={() => {
              setId(k.id)
              setX(k.x0)
            }}
            aria-pressed={id === k.id}
          >
            {k.name[lang]}
          </button>
        ))}
      </div>
      <p>
        <Tex src={`${g.tex},\\qquad ${g.dtex}`} />
      </p>
      <div className="amctl">
        <label className="lbl slider">
          {g.x[lang]} = <b>{show(x, sep)}</b>
          <input type="range" min={0.5} max={10} step={0.1} value={x} aria-label={g.x[lang]} onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <p className="okline">
        {tc(L('Rate at this size:', 'Laju pada ukuran ini:'))} <b>{show(g.df(x), sep)}</b> ({tc(L('area or volume units per unit of length', 'satuan luas atau volume per satuan panjang'))})
      </p>
      <div className="gridwrap">
        <table className="rtable">
          <thead>
            <tr>
              <th>Δ</th>
              <th>{tc(L('actual increase', 'pertambahan sebenarnya'))}</th>
              <th>{tc(L('increase per unit', 'pertambahan per satuan'))}</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((h) => {
              const d = g.f(x + h) - g.f(x)
              return (
                <tr key={h}>
                  <td>{show(h, sep)}</td>
                  <td>{show(d, sep)}</td>
                  <td>{show(d / h, sep)}</td>
                </tr>
              )
            })}
            <tr className="hi">
              <td>→ 0</td>
              <td />
              <td>{show(g.df(x), sep)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small">{g.derivativeNote[lang]}</p>
    </Frame>
  )
}
