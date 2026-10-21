import { useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { derive, evalFloat, nth, parseExpression, ParseError, toRational, toTex, type Node, type RuleId } from '../../lib/diffrules'
import { derivativeFn } from '../../lib/derivative'
import { polyTex } from '../../lib/tangent'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, dec, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { num, show } from './TangentWidgets'

/* ------------------------------------------------ differentiating step by step */

const RULE: Record<RuleId, { en: string; id: string }> = {
  constant: { en: 'Constant rule', id: 'Aturan konstanta' },
  power: { en: 'Power rule', id: 'Aturan pangkat' },
  exponential: { en: 'The derivative of e^x', id: 'Turunan e^x' },
  trig: { en: 'Derivative of a trigonometric function', id: 'Turunan fungsi trigonometri' },
  multiple: { en: 'Constant multiple rule', id: 'Aturan kelipatan konstanta' },
  negative: { en: 'Negative of a function', id: 'Negatif suatu fungsi' },
  sum: { en: 'Sum rule', id: 'Aturan jumlah' },
  difference: { en: 'Difference rule', id: 'Aturan selisih' },
  product: { en: 'Product rule', id: 'Aturan hasil kali' },
  quotient: { en: 'Quotient rule', id: 'Aturan hasil bagi' },
}

const TRIG_PRESETS = ['sin(x)', 'cos(x)', 'x^2 sin x', 'e^x sin x', 'sin x / x', 'cos x / (1 - sin x)', 'tan x', 'sec x', 'sin x cos x', 'x + 2 sin x']

const PRESETS = [
  'x^3 - 3x^2 + 5x - 1',
  '(x^2+1)(x^3-3x)',
  'x^2 e^x',
  '(x^2-1)/(x^3+1)',
  '(x-1)(x^2-2x)/x^4',
  'x^(2/3)',
  'x^(pi+1)',
  'e^x/x',
]

const ERR: Record<ParseError['code'], { en: string; id: string }> = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, brackets, x^n, sqrt(x), pi and e^x, for example (x^2+1)(x^3-3x).', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, kurung, x^n, sqrt(x), pi, dan e^x, misalnya (x^2+1)(x^3-3x).' },
  chain: { en: 'That needs the chain rule (a power of something other than x, or e to something other than x), which comes later. For now expand it or write it as a product, for example (x+1)(x+1).', id: 'Itu memerlukan aturan rantai (pangkat dari sesuatu selain x, atau e pangkat selain x), yang dibahas kemudian. Untuk sekarang jabarkan atau tulis sebagai hasil kali, misalnya (x+1)(x+1).' },
  base: { en: 'Only powers of x and e^x are covered here: 2^x and similar need the logarithm, which comes later.', id: 'Di sini hanya pangkat dari x dan e^x yang tercakup: 2^x dan sejenisnya memerlukan logaritma, yang dibahas kemudian.' },
  exp: { en: 'An exponent of x must be a number (or pi, or a constant expression such as (pi+1) or (2/3)); e must appear as e^x.', id: 'Pangkat pada x harus berupa bilangan (atau pi, atau ekspresi konstan seperti (pi+1) atau (2/3)); e harus muncul sebagai e^x.' },
  function: { en: 'Only the functions of this chapter are known: powers of x, sqrt(x) and e^x. Trigonometric and logarithmic functions come later.', id: 'Hanya fungsi pada bab ini yang dikenal: pangkat dari x, sqrt(x), dan e^x. Fungsi trigonometri dan logaritma dibahas kemudian.' },
  big: { en: 'That expression is too long.', id: 'Ekspresi itu terlalu panjang.' },
}

const fracTex = (num_: Parameters<typeof polyTex>[0], den: Parameters<typeof polyTex>[0]) =>
  den.length === 1 && den[0].n === 1n && den[0].d === 1n ? polyTex(num_) : `\\frac{${polyTex(num_)}}{${polyTex(den)}}`

const primes = (k: number): string => (k <= 3 ? "'".repeat(k) : `^{(${k})}`)

export function DifferentiationSteps({ trig = false }: { trig?: boolean }) {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(trig ? 'x^2 sin x' : '(x^2+1)(x^3-3x)')
  const [order, setOrder] = useState(1)
  const [xs, setXs] = useState('1')

  let f: Node | null = null
  let err: ParseError['code'] | null = null
  try {
    f = parseExpression(src, { trig })
  } catch (e) {
    err = e instanceof ParseError ? e.code : 'syntax'
  }
  const x0 = parseRational(xs)

  let body
  if (!f) {
    const e = ERR[err ?? 'syntax']
    body = (
      <p className="noline">
        {trig && err === 'function'
          ? tc(L('Only sin, cos, tan, cot, sec and csc of x are known, with powers of x, e^x, sums, products and quotients. Inverse trigonometric functions and other arguments come later.', 'Hanya sin, cos, tan, cot, sec, dan csc dari x yang dikenal, bersama pangkat x, e^x, jumlah, hasil kali, dan hasil bagi. Fungsi trigonometri invers dan argumen lain dibahas kemudian.'))
          : trig && err === 'chain'
            ? tc(L('A trigonometric function of anything other than x (such as sin(2x) or sin(x)^2), or a power of a sum, needs the chain rule, which comes next. For now write sin(x) sin(x), or expand a product.', 'Fungsi trigonometri dari selain x (seperti sin(2x) atau sin(x)^2), atau pangkat dari suatu jumlah, memerlukan aturan rantai, yang dibahas berikutnya. Untuk sekarang tulis sin(x) sin(x), atau jabarkan hasil kali.'))
            : e[lang]}
      </p>
    )
  }
  else {
    const F = f
    const { steps } = derive(F)
    const tower: Node[] = []
    for (let k = 1; k <= order; k++) tower.push(nth(F, k))
    const rf = toRational(F)
    const simplified = rf && order === 1 ? derivativeFn(rf) : null
    const shown = steps.slice(0, 14)
    const g = (x: number) => evalFloat(F, x)
    const xv = x0 && x0.d <= 999n && (x0.n < 0n ? -x0.n : x0.n) <= 99999n ? num(x0) : null
    const dv = xv === null ? NaN : evalFloat(tower[tower.length - 1], xv)
    // the check: the order-th derivative against a difference quotient of the previous one
    const prev = order === 1 ? g : (x: number) => evalFloat(tower[order - 2], x)
    const h = 1e-6
    const cd = xv === null ? NaN : (prev(xv + h) - prev(xv - h)) / (2 * h)
    body = (
      <>
        <p>
          <Tex src={`f(x)=${toTex(F)}`} />
        </p>
        {order === 1 && (
          <ol className="small">
            {shown.map((s, i) => (
              <li key={i}>
                <b>{RULE[s.rule][lang]}:</b> <Tex src={`\\frac{d}{dx}\\left[${toTex(s.expr)}\\right]=${toTex(s.result)}`} />
              </li>
            ))}
            {steps.length > shown.length && <li className="muted">…</li>}
          </ol>
        )}
        {tower.map((d, k) => (
          <p key={k} className={k === tower.length - 1 ? 'okline' : ''}>
            <Tex src={`f${primes(k + 1)}(x)=${toTex(d)}`} />
          </p>
        ))}
        {simplified && (
          <p>
            {tc(L('Multiplied out and reduced:', 'Dijabarkan dan disederhanakan:'))} <Tex src={`f'(x)=${fracTex(simplified.num, simplified.den)}`} />
          </p>
        )}
        {order === 1 && !trig && <p className="small muted">{tc(L('Powers are valid where they are defined; for instance x^(2/3) has the derivative (2/3)x^(−1/3) for x ≠ 0.', 'Pangkat berlaku di tempat ia terdefinisi; misalnya x^(2/3) memiliki turunan (2/3)x^(−1/3) untuk x ≠ 0.'))}</p>}
        {xv === null ? (
          <p className="noline">{tc(L('Type x₀ as a number, such as 1, -2 or 1/2.', 'Ketik x₀ sebagai bilangan, seperti 1, -2, atau 1/2.'))}</p>
        ) : (
          <p className="small">
            <Tex src={`f${primes(order)}(${show(xv, sep).replace('−', '-')})\\approx ${Number.isFinite(dv) ? show(dv, sep).replace('−', '-') : '\\text{?}'}`} />
            {' '}
            {tc(L('; a difference quotient of', '; hasil bagi selisih dari'))} <Tex src={`f${primes(order - 1)}`} /> {tc(L('gives', 'memberi'))} {Number.isFinite(cd) ? dec(String(parseFloat(cd.toPrecision(7))), sep) : '?'}.
          </p>
        )}
      </>
    )
  }

  return (
    <Frame name={trig ? 'trigsteps' : 'diffsteps'}>
      <div className="inrow">
        <label className="lbl">
          f(x) = <input style={{ width: '15em', maxWidth: '100%' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          x₀ = <input style={{ width: '4.5em' }} value={xs} aria-label="x0" onChange={(e) => setXs(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {(trig ? TRIG_PRESETS : PRESETS).map((p) => (
          <button key={p} className="chip ghost" onClick={() => setSrc(p)}>
            <Tex src={exprTex(p)} />
          </button>
        ))}
      </div>
      <div className="chips">
        {[1, 2, 3, 4].map((k) => (
          <button key={k} className={`chip ${order === k ? 'on' : ''}`} onClick={() => setOrder(k)} aria-pressed={order === k}>
            {k === 1 ? tc(L('first derivative', 'turunan pertama')) : k === 2 ? tc(L('up to the second', 'sampai turunan kedua')) : k === 3 ? tc(L('up to the third', 'sampai turunan ketiga')) : tc(L('up to the fourth', 'sampai turunan keempat'))}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* -------------------------------------------- the slope of a^x at the y-axis */

export function ExponentialBase() {
  const { tc } = useI18n()
  const sep = useSep()
  const [a, setA] = useState(2)
  const L0 = (b: number, h: number) => (b ** h - 1) / h
  const slope = L0(a, 1e-6)
  const isE = Math.abs(slope - 1) < 0.004
  const hs = [0.1, 0.01, 0.001, 0.0001]
  return (
    <Frame name="expbase">
      <div className="amctl">
        <label className="lbl slider">
          a = <b>{show(a, sep)}</b>
          <input type="range" min={1.2} max={4} step={0.01} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
      </div>
      <div className="chips">
        {[2, 2.5, 3].map((b) => (
          <button key={b} className="chip ghost" onClick={() => setA(b)}>
            a = {show(b, sep)}
          </button>
        ))}
        <button className="chip ghost" onClick={() => setA(Math.E)}>
          a = e
        </button>
      </div>
      <Plot
        xr={[-2.5, 2.5]}
        yr={[-0.8, 5]}
        curves={[{ f: (x) => a ** x, cls: 'tancurve' }]}
        segs={[{ x1: -2.5, y1: 1 - slope * 2.5, x2: 2.5, y2: 1 + slope * 2.5, cls: 'tantan' }]}
        dots={[{ x: 0, y: 1 }]}
        label={tc(L('The graph of y = a to the power x and its tangent line where it crosses the y-axis', 'Grafik y = a pangkat x dan garis singgungnya di tempat ia memotong sumbu y'))}
      />
      <div className="gridwrap">
        <table className="rtable">
          <thead>
            <tr>
              <th>h</th>
              <th>
                (a<sup>h</sup> − 1) / h
              </th>
            </tr>
          </thead>
          <tbody>
            {hs.map((h) => (
              <tr key={h}>
                <td>{show(h, sep)}</td>
                <td>{show(L0(a, h), sep)}</td>
              </tr>
            ))}
            <tr className="hi">
              <td>→ 0</td>
              <td>L ≈ {show(slope, sep)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={isE ? 'okline' : ''} aria-live="polite">
        {isE
          ? tc(L('L = 1: the graph crosses the y-axis with slope 1. This base is e ≈ 2.71828, and the function e^x is its own derivative.', 'L = 1: grafik memotong sumbu y dengan gradien 1. Basis ini adalah e ≈ 2,71828, dan fungsi e^x adalah turunannya sendiri.'))
          : a < Math.E
            ? tc(L('L is less than 1 for this base: the graph is not steep enough at the y-axis. Try a larger base.', 'L kurang dari 1 untuk basis ini: grafik belum cukup curam di sumbu y. Coba basis yang lebih besar.'))
            : tc(L('L is more than 1 for this base: the graph is too steep at the y-axis. Try a smaller base.', 'L lebih dari 1 untuk basis ini: grafik terlalu curam di sumbu y. Coba basis yang lebih kecil.'))}
      </p>
    </Frame>
  )
}

/* -------------------------------------------------- the picture of the product rule */

export function ProductBox() {
  const { tc } = useI18n()
  const sep = useSep()
  const [u, setU] = useState(3)
  const [v, setV] = useState(2)
  const [du, setDu] = useState(1)
  const [dv, setDv] = useState(1)
  const [t, setT] = useState(1)
  const Du = t * du
  const Dv = t * dv
  const W = 300
  const sc = (W - 30) / (u + Du + 0.0001)
  const sy = (W - 30) / Math.max(v + Dv, 0.0001)
  const s = Math.min(sc, sy)
  const X = (q: number) => 10 + q * s
  const Y = (q: number) => 10 + (v + Dv - q) * s
  const total = (u + Du) * (v + Dv) - u * v
  const ts = [1, 0.5, 0.25, 0.1, 0.01]
  const slider = (label: string, val: number, set: (n: number) => void, min: number, max: number, step: number) => (
    <label className="lbl slider">
      {label} = <b>{show(val, sep)}</b>
      <input type="range" min={min} max={max} step={step} value={val} aria-label={label} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )
  return (
    <Frame name="prodbox">
      <div className="amctl">
        {slider('u', u, setU, 1, 6, 0.5)}
        {slider('v', v, setV, 1, 6, 0.5)}
        {slider('Δu₁', du, setDu, 0.2, 2, 0.1)}
        {slider('Δv₁', dv, setDv, 0.2, 2, 0.1)}
      </div>
      <div className="chips">
        {ts.map((q) => (
          <button key={q} className={`chip ${t === q ? 'on' : ''}`} onClick={() => setT(q)} aria-pressed={t === q}>
            {tc(L('step', 'langkah'))} t = {show(q, sep)}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${W}`} className="quadsvg" role="img" aria-label={tc(L('A rectangle u by v and the extra area when both sides grow', 'Persegi panjang u kali v dan luas tambahan saat kedua sisinya bertambah'))}>
        <rect x={X(0)} y={Y(v)} width={u * s} height={v * s} className="pythsqa" />
        <rect x={X(u)} y={Y(v)} width={Du * s} height={v * s} className="pythsqb" />
        <rect x={X(0)} y={Y(v + Dv)} width={u * s} height={Dv * s} className="pythsqc" />
        <rect x={X(u)} y={Y(v + Dv)} width={Du * s} height={Dv * s} className="pythtri" />
        <text x={X(u / 2)} y={Y(v / 2) + 4} textAnchor="middle" className="pythlabel">
          uv
        </text>
        {Du * s > 16 && (
          <text x={X(u + Du / 2)} y={Y(v / 2) + 4} textAnchor="middle" className="pythlabel">
            vΔu
          </text>
        )}
        {Dv * s > 14 && (
          <text x={X(u / 2)} y={Y(v + Dv / 2) + 4} textAnchor="middle" className="pythlabel">
            uΔv
          </text>
        )}
      </svg>
      <p>
        <Tex src={`\\Delta(uv)=${show(total, sep).replace('−', '-')}=v\\,\\Delta u+u\\,\\Delta v+\\Delta u\\,\\Delta v=${show(v * Du, sep)}+${show(u * Dv, sep)}+${show(Du * Dv, sep)}`} />
      </p>
      <div className="gridwrap">
        <table className="rtable">
          <thead>
            <tr>
              <th>t</th>
              <th>Δ(uv) / t</th>
              <th>v·Δu₁ + u·Δv₁</th>
              <th>{tc(L('corner ΔuΔv / total', 'pojok ΔuΔv / total'))}</th>
            </tr>
          </thead>
          <tbody>
            {ts.map((q) => {
              const tot = ((u + q * du) * (v + q * dv) - u * v) / q
              return (
                <tr key={q} className={q === t ? 'hi' : ''}>
                  <td>{show(q, sep)}</td>
                  <td>{show(tot, sep)}</td>
                  <td>{show(v * du + u * dv, sep)}</td>
                  <td>{show((q * du * dv) / tot, sep)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Frame>
  )
}
