import { useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { derive, evalFloat, lnSplit, nth, parseExpression, ParseError, simp, size, subst, toTex, type Node, type RuleId } from '../../lib/chain'
import { pistonRates, sinKx, sinKxSlope } from '../../lib/chain'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { num, show } from './TangentWidgets'

/** A number for a formula: the reader's decimal mark and an ASCII minus. */
const tx = (x: number, sep: string): string => show(x, sep).replace('−', '-')

const primes = (k: number): string => (k <= 3 ? "'".repeat(k) : `^{(${k})}`)

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
  chain: { en: 'Chain rule', id: 'Aturan rantai' },
  implicit: { en: 'y is a function of x', id: 'y adalah fungsi dari x' },
  logarithm: { en: 'The derivative of ln x', id: 'Turunan ln x' },
  logdiff: { en: 'Logarithmic differentiation', id: 'Diferensiasi logaritmik' },
  inverse: { en: 'Derivative of an inverse trigonometric function', id: 'Turunan fungsi trigonometri invers' },
  absolute: { en: 'Derivative of the absolute value', id: 'Turunan nilai mutlak' },
}

const ERR: Record<ParseError['code'], { en: string; id: string }> = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, brackets, powers such as x^2 or (x+1)^(1/2), sqrt(…), sin(…), cos(…), tan(…), cot(…), sec(…), csc(…), pi and e^(…), for example sin(3x^2+1).', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, kurung, pangkat seperti x^2 atau (x+1)^(1/2), sqrt(…), sin(…), cos(…), tan(…), cot(…), sec(…), csc(…), pi, dan e^(…), misalnya sin(3x^2+1).' },
  paren: { en: 'Write the argument of sin, cos, tan, cot, sec, csc and sqrt in brackets, for example sin(2x) or sqrt(3x+1). (A bare x is fine: sin x.)', id: 'Tulis argumen sin, cos, tan, cot, sec, csc, dan sqrt dalam kurung, misalnya sin(2x) atau sqrt(3x+1). (x polos boleh: sin x.)' },
  varexp: { en: 'An exponent that contains x, such as x^x or 2^x, needs the logarithm, which comes later. Here the exponent must be a number.', id: 'Pangkat yang memuat x, seperti x^x atau 2^x, memerlukan logaritma, yang dibahas kemudian. Di sini pangkatnya harus berupa bilangan.' },
  function: { en: 'Only sin, cos, tan, cot, sec, csc, sqrt and e^ are known here. Logarithms and inverse trigonometric functions come later.', id: 'Di sini hanya sin, cos, tan, cot, sec, csc, sqrt, dan e^ yang dikenal. Logaritma dan fungsi trigonometri invers dibahas kemudian.' },
  exp: { en: 'e must appear as e^x or e^(something), and an exponent must be a number such as 3, -2 or (1/2).', id: 'e harus muncul sebagai e^x atau e^(sesuatu), dan pangkat harus berupa bilangan seperti 3, -2, atau (1/2).' },
  big: { en: 'That expression is too long.', id: 'Ekspresi itu terlalu panjang.' },
  equation: { en: 'Write an equation with one = sign, for example x^2 + y^2 = 25.', id: 'Tulis persamaan dengan satu tanda =, misalnya x^2 + y^2 = 25.' },
  noy: { en: 'There is no y in this equation, so there is nothing to differentiate implicitly.', id: 'Tidak ada y dalam persamaan ini, sehingga tidak ada yang diturunkan secara implisit.' },
}

const ERR_LOG: Partial<Record<ParseError['code'], { en: string; id: string }>> = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, brackets, powers such as x^2, 2^x, x^x or x^pi, sqrt(…), sin(…), cos(…), tan(…), ln(…), log(…) (base 10), pi and e^(…), for example x^2 ln(x).', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, kurung, pangkat seperti x^2, 2^x, x^x, atau x^pi, sqrt(…), sin(…), cos(…), tan(…), ln(…), log(…) (basis 10), pi, dan e^(…), misalnya x^2 ln(x).' },
  function: { en: 'Only sin, cos, tan, cot, sec, csc, sqrt, ln, log (base 10) and e^ are known here. Other bases are written with a power, such as 2^x, and inverse trigonometric functions come later.', id: 'Di sini hanya sin, cos, tan, cot, sec, csc, sqrt, ln, log (basis 10), dan e^ yang dikenal. Basis lain ditulis dengan pangkat, seperti 2^x, dan fungsi trigonometri invers dibahas kemudian.' },
}

const ERR_INV: Partial<Record<ParseError['code'], { en: string; id: string }>> = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, brackets, powers, sqrt(…), sin(…), ln(…), abs(…), arcsin(…), arccos(…), arctan(…), arccot(…), arcsec(…), arccsc(…), pi and e^(…), for example arctan(2x).', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, kurung, pangkat, sqrt(…), sin(…), ln(…), abs(…), arcsin(…), arccos(…), arctan(…), arccot(…), arcsec(…), arccsc(…), pi, dan e^(…), misalnya arctan(2x).' },
  paren: { en: 'Write the argument of every function in brackets, for example arcsin(2x), arctan(1/x) or abs(x). (A bare x is fine: arctan x.)', id: 'Tulis argumen setiap fungsi dalam kurung, misalnya arcsin(2x), arctan(1/x), atau abs(x). (x polos boleh: arctan x.)' },
  function: { en: 'Only the functions of the earlier articles, abs and the six inverse trigonometric functions arcsin, arccos, arctan, arccot, arcsec and arccsc are known here.', id: 'Di sini hanya fungsi artikel-artikel terdahulu, abs, dan keenam fungsi trigonometri invers arcsin, arccos, arctan, arccot, arcsec, dan arccsc yang dikenal.' },
}

const PRESETS_INV = ['arcsin(x)', 'arctan(x)', 'arcsec(x)', 'arcsin(x^2)', 'arctan(2x)', 'arcsec(5x^4)', '1/arctan(x)', 'arctan(1/x)', 'x arcsin(x)+sqrt(1-x^2)', 'arctan(3/x)-arctan(1/x)', 'abs(x)']

const PRESETS_LOG = ['ln(x^2+3)', 'ln(sin(x))', 'x ln(x)', '2^x', '3^(sin x)', 'x^x', 'x^(sin x)', 'log(x)', 'x^2 (x+1)^3/(x-2)', 'x^pi']

const PRESETS = ['sin(2x)', '(3x^2+1)^2', 'cos(x^2+1)', 'sin(x^2+e^x)', 'e^(cos x)', 'tan(5 - sin(2x))', 'sqrt(3x+1)', '1/(3x-2)', 'sin^5(x)', 'x sin(2x)']

export function ChainSteps({ log = false, inv = false }: { log?: boolean; inv?: boolean }) {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(inv ? 'arcsin(x^2)' : log ? 'x^x' : 'sin(3x^2+1)')
  const [order, setOrder] = useState(1)
  const [xs, setXs] = useState('1')

  let f: Node | null = null
  let err: ParseError['code'] | null = null
  try {
    f = parseExpression(src, { log: log || inv, inv })
    if (size(f) > 70) throw new ParseError('big')
  } catch (e) {
    f = null
    err = e instanceof ParseError ? e.code : 'syntax'
  }
  const x0 = parseRational(xs)

  let body
  if (!f) {
    body = <p className="noline">{((inv && ERR_INV[err ?? 'syntax']) || (log && ERR_LOG[err ?? 'syntax']) || ERR[err ?? 'syntax'])[lang]}</p>
  } else {
    const F = f
    const { steps } = derive(F)
    const tower: Node[] = []
    let tooLong = false
    for (let k = 1; k <= order; k++) {
      const d = nth(F, k)
      if (size(d) > 400) {
        tooLong = true
        break
      }
      tower.push(d)
    }
    const shown = steps.slice(0, 16)
    const g = (x: number) => evalFloat(F, x)
    const xv = x0 && x0.d <= 999n && (x0.n < 0n ? -x0.n : x0.n) <= 99999n ? num(x0) : null
    const top = tower.length
    const dv = xv === null || top === 0 ? NaN : evalFloat(tower[top - 1], xv)
    const prev = top <= 1 ? g : (x: number) => evalFloat(tower[top - 2], x)
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
                <b>{RULE[s.rule][lang]}:</b>{' '}
                {s.rule === 'logdiff' && s.lnForm ? (
                  <>
                    {tc(L('both the base and the exponent depend on x: take the logarithm first,', 'basis dan pangkatnya sama-sama bergantung pada x: ambil logaritmanya dulu,'))} <Tex src={`\\ln y=${toTex(s.lnForm)}`} />;{' '}
                    <Tex src={`\\frac{d}{dx}\\left[${toTex(s.expr)}\\right]=${toTex(s.result)}`} />
                  </>
                ) : s.rule === 'chain' && s.inner && s.outer && s.outerD ? (
                  <>
                    {tc(L('outside', 'luar'))} <Tex src={`f(u)=${toTex(s.outer, 'u')}`} />, {tc(L('inside', 'dalam'))} <Tex src={`u=${toTex(s.inner)}`} />; <Tex src={`f'(u)=${toTex(s.outerD, 'u')}`} />, <Tex src={`u'=${toTex(derive(s.inner).result)}`} />:{' '}
                    <Tex src={`\\frac{d}{dx}\\left[${toTex(s.expr)}\\right]=${toTex(simp(subst(s.outerD, s.inner)))}\\cdot\\left(${toTex(derive(s.inner).result)}\\right)=${toTex(s.result)}`} />
                  </>
                ) : (
                  <Tex src={`\\frac{d}{dx}\\left[${toTex(s.expr)}\\right]=${toTex(s.result)}`} />
                )}
              </li>
            ))}
            {steps.length > shown.length && <li className="muted">…</li>}
          </ol>
        )}
        {log && order === 1 && (F.t === 'mul' || F.t === 'div' || F.t === 'pow' || F.t === 'gpow') && (
          <p className="small">
            <b>{tc(L('The same by logarithmic differentiation', 'Hasil yang sama dengan diferensiasi logaritmik'))}:</b> <Tex src={`\\ln y=${toTex(lnSplit(F))}`} />, <Tex src={`\\frac{y'}{y}=${toTex(derive(lnSplit(F)).result)}`} />
            {tc(L('; multiply by y to get', '; kalikan dengan y untuk mendapat'))} <Tex src={`y'=${toTex(F)}\\left(${toTex(derive(lnSplit(F)).result)}\\right)`} />.
          </p>
        )}
        {tower.map((d, k) => (
          <p key={k} className={k === tower.length - 1 ? 'okline' : ''}>
            <Tex src={`f${primes(k + 1)}(x)=${toTex(d)}`} />
          </p>
        ))}
        {tooLong && <p className="noline">{tc(L('The next derivative is too long to show.', 'Turunan berikutnya terlalu panjang untuk ditampilkan.'))}</p>}
        {xv === null ? (
          <p className="noline">{tc(L('Type x₀ as a number, such as 1, -2 or 1/2.', 'Ketik x₀ sebagai bilangan, seperti 1, -2, atau 1/2.'))}</p>
        ) : top > 0 ? (
          <p className="small">
            <Tex src={`f${primes(top)}(${tx(xv, sep)})\\approx ${Number.isFinite(dv) ? tx(dv, sep) : '\\text{?}'}`} />{' '}
            {tc(L('; a difference quotient of', '; hasil bagi selisih dari'))} <Tex src={`f${primes(top - 1)}`} /> {tc(L('gives', 'memberi'))} {Number.isFinite(cd) ? dec(String(parseFloat(cd.toPrecision(7))), sep) : '?'}.
          </p>
        ) : null}
      </>
    )
  }

  return (
    <Frame name={inv ? 'invsteps' : log ? 'logsteps' : 'chainsteps'}>
      <div className="inrow">
        <label className="lbl">
          f(x) = <input style={{ width: '15em', maxWidth: '100%' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          x₀ = <input style={{ width: '4.5em' }} value={xs} aria-label="x0" onChange={(e) => setXs(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {(inv ? PRESETS_INV : log ? PRESETS_LOG : PRESETS).map((p) => (
          <button key={p} className="chip ghost" onClick={() => setSrc(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="chips">
        {[1, 2, 3].map((k) => (
          <button key={k} className={`chip ${order === k ? 'on' : ''}`} onClick={() => setOrder(k)} aria-pressed={order === k}>
            {k === 1 ? tc(L('first derivative', 'turunan pertama')) : k === 2 ? tc(L('up to the second', 'sampai turunan kedua')) : tc(L('up to the third', 'sampai turunan ketiga'))}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------ rates multiply */

const OUTER = ['x^3', 'sin(x)', 'e^x', 'sqrt(x)', 'tan(x)', '1/x']
const INNER = ['2x', 'x^2+1', '3x-1', 'cos(x)', 'x^3-x']

export function ChainRates() {
  const { tc } = useI18n()
  const sep = useSep()
  const [oi, setOi] = useState(1)
  const [ii, setIi] = useState(1)
  const [x, setX] = useState(0.8)
  const outer = parseExpression(OUTER[oi])
  const inner = parseExpression(INNER[ii])
  const comp = subst(outer, inner)
  const gInner = (t: number) => evalFloat(inner, t)
  const fComp = (t: number) => evalFloat(comp, t)
  const dOuter = derive(outer).result
  const dInner = derive(inner).result
  const u = gInner(x)
  const du = evalFloat(dInner, x)
  const dy = evalFloat(dOuter, u)
  const prod = dy * du
  const whole = evalFloat(derive(comp).result, x)
  const xr: [number, number] = [0.2, 2.4]
  // a window that fits the composite on the range, ignoring the wild parts
  const ys: number[] = []
  for (let i = 0; i <= 120; i++) {
    const v = fComp(xr[0] + ((xr[1] - xr[0]) * i) / 120)
    if (Number.isFinite(v) && Math.abs(v) < 40) ys.push(v)
  }
  const lo = ys.length ? Math.min(...ys) : -1
  const hi = ys.length ? Math.max(...ys) : 1
  const pad = (hi - lo) * 0.12 || 1
  const yr: [number, number] = [lo - pad, hi + pad]
  const fv = fComp(x)
  const defined = Number.isFinite(fv) && Number.isFinite(prod)
  const seg = 0.45
  return (
    <Frame name="chainrates">
      <p className="small muted">{tc(L('Outside function f(u)', 'Fungsi luar f(u)'))}</p>
      <div className="chips">
        {OUTER.map((o, i) => (
          <button key={o} className={`chip ${oi === i ? 'on' : ''}`} onClick={() => setOi(i)} aria-pressed={oi === i}>
            <Tex src={`f(u)=${toTex(parseExpression(o), 'u')}`} />
          </button>
        ))}
      </div>
      <p className="small muted">{tc(L('Inside function u = g(x)', 'Fungsi dalam u = g(x)'))}</p>
      <div className="chips">
        {INNER.map((o, i) => (
          <button key={o} className={`chip ${ii === i ? 'on' : ''}`} onClick={() => setIi(i)} aria-pressed={ii === i}>
            <Tex src={`u=${toTex(parseExpression(o))}`} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          x = <b>{show(x, sep)}</b>
          <input type="range" min={xr[0]} max={xr[1]} step={0.01} value={x} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <Plot
        xr={xr}
        yr={yr}
        curves={[{ f: fComp, cls: 'tancurve' }]}
        segs={defined ? [{ x1: x - seg, y1: fv - prod * seg, x2: x + seg, y2: fv + prod * seg, cls: 'tantan' }] : []}
        vlines={[{ x, cls: 'tannorm' }]}
        dots={Number.isFinite(fv) ? [{ x, y: fv }] : []}
        label={tc(L('The graph of the composite function with its tangent line', 'Grafik fungsi komposit dengan garis singgungnya'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`y=f(g(x))=${toTex(simp(comp))}`} />
        </p>
        {defined ? (
          <>
            <p className="small">
              {tc(L('Inside:', 'Dalam:'))} <Tex src={`u=g(${tx(x, sep)})=${tx(u, sep)}`} />, <Tex src={`\\frac{du}{dx}=${tx(du, sep)}`} />
              {' · '}
              {tc(L('outside:', 'luar:'))} <Tex src={`\\frac{dy}{du}=f'(${tx(u, sep)})=${tx(dy, sep)}`} />
            </p>
            <p className="okline">
              <Tex src={`\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx}=${tx(dy, sep)}\\cdot ${du < 0 ? `(${tx(du, sep)})` : tx(du, sep)}=${tx(prod, sep)}`} />
            </p>
            <p className="small">
              {tc(L('Derivative of the composite found directly:', 'Turunan komposit yang dicari langsung:'))} {tx(whole, sep)}
              {'; '}
              {tc(L('a difference quotient gives', 'hasil bagi selisih memberi'))} {dec(String(parseFloat(((fComp(x + 1e-6) - fComp(x - 1e-6)) / 2e-6).toPrecision(7))), sep)}.
            </p>
            <p className="small">{tc(L('The inside changes du/dx times as fast as x; the outside changes dy/du times as fast as the inside; so y changes the product times as fast as x.', 'Bagian dalam berubah du/dx kali secepat x; bagian luar berubah dy/du kali secepat bagian dalam; jadi y berubah sebesar hasil kalinya secepat x.'))}</p>
          </>
        ) : (
          <p className="noline">{tc(L('The composite function is not defined here (try another x or another pair).', 'Fungsi komposit tidak terdefinisi di sini (coba x lain atau pasangan lain).'))}</p>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------- the constant inside a sine */

type ScaleMode = 'k' | 'deg' | 'piston'

export function SineScale() {
  const { tc } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<ScaleMode>('k')
  const [A, setA] = useState(2)
  const [k, setK] = useState(2)
  const [b, setB] = useState(1)

  if (mode === 'piston') {
    const one = pistonRates(A, b)
    const two = pistonRates(A, 2 * b)
    const w = 2 * Math.PI * b
    const T = 1 / b
    return (
      <Frame name="sinscale">
        <ScaleChips mode={mode} setMode={setMode} />
        <div className="amctl">
          <label className="lbl slider">
            {tc(L('amplitude', 'amplitudo'))} A = <b>{show(A, sep)}</b>
            <input type="range" min={1} max={5} step={0.5} value={A} aria-label="A" onChange={(e) => setA(Number(e.target.value))} />
          </label>
          <label className="lbl slider">
            b = <b>{show(b, sep)}</b> {tc(L('cycles per second', 'siklus per detik'))}
            <input type="range" min={0.5} max={4} step={0.5} value={b} aria-label="b" onChange={(e) => setB(Number(e.target.value))} />
          </label>
        </div>
        <Plot
          xr={[0, 2 * T]}
          yr={[-6.2, 6.2]}
          curves={[{ f: (t) => A * Math.cos(w * t), cls: 'tancurve' }]}
          label={tc(L('The position of the piston over two cycles', 'Posisi piston selama dua siklus'))}
        />
        <div className="wgtout" aria-live="polite">
          <p>
            <Tex src={`s=${show(A, sep)}\\cos(2\\pi\\cdot ${show(b, sep)}\\,t)`.replace(/−/g, '-')} />
          </p>
          <table className="small" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingRight: '1em' }} />
                <th style={{ paddingRight: '1em' }}>b = {show(b, sep)}</th>
                <th style={{ paddingRight: '1em' }}>b = {show(2 * b, sep)}</th>
                <th>{tc(L('ratio', 'perbandingan'))}</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  [tc(L('greatest velocity', 'kecepatan terbesar')), one.v, two.v],
                  [tc(L('greatest acceleration', 'percepatan terbesar')), one.a, two.a],
                  [tc(L('greatest jerk', 'sentakan terbesar')), one.j, two.j],
                ] as [string, number, number][]
              ).map(([name, p, q]) => (
                <tr key={name}>
                  <td style={{ paddingRight: '1em' }}>{name}</td>
                  <td style={{ paddingRight: '1em' }}>{show(p, sep)}</td>
                  <td style={{ paddingRight: '1em' }}>{show(q, sep)}</td>
                  <td>
                    <b>×{show(q / p, sep)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small">{tc(L('Each derivative brings down one factor 2πb, so doubling the frequency doubles the velocity, quadruples the acceleration and multiplies the jerk by 8.', 'Setiap turunan memunculkan satu faktor 2πb, sehingga menggandakan frekuensi menggandakan kecepatan, melipatempatkan percepatan, dan mengalikan sentakan dengan 8.'))}</p>
        </div>
      </Frame>
    )
  }

  const deg = mode === 'deg'
  const kk = deg ? Math.PI / 180 : k
  const xr: [number, number] = deg ? [0, 720] : [0, 4 * Math.PI]
  const period = (2 * Math.PI) / kk
  return (
    <Frame name="sinscale">
      <ScaleChips mode={mode} setMode={setMode} />
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('amplitude', 'amplitudo'))} A = <b>{show(A, sep)}</b>
          <input type="range" min={1} max={5} step={0.5} value={A} aria-label="A" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        {!deg && (
          <label className="lbl slider">
            k = <b>{show(k, sep)}</b>
            <input type="range" min={0.25} max={4} step={0.25} value={k} aria-label="k" onChange={(e) => setK(Number(e.target.value))} />
          </label>
        )}
      </div>
      <p className="small muted">{tc(L('Graph of y = A sin(kx) (green), drawn to the same scale whatever A and k are', 'Grafik y = A sin(kx) (hijau), digambar dengan skala yang sama berapa pun A dan k'))}</p>
      <Plot
        xr={xr}
        yr={[-6.2, 6.2]}
        curves={[
          ...(deg ? [] : [{ f: (t: number) => A * Math.sin(t), cls: 'tancurve faint' }]),
          { f: (t: number) => sinKx(A, kk, t), cls: 'tancurve' },
        ]}
        label={tc(L('The graph of A sin(kx)', 'Grafik A sin(kx)'))}
      />
      <p className="small muted">{tc(L('Its derivative A k cos(kx) (orange) against A cos x (faint): the amplitude is multiplied by k', 'Turunannya A k cos(kx) (jingga) terhadap A cos x (samar): amplitudonya dikalikan k'))}</p>
      <Plot
        xr={xr}
        yr={deg ? [-0.11, 0.11] : [-22, 22]}
        curves={[
          ...(deg ? [] : [{ f: (t: number) => A * Math.cos(t), cls: 'tancurve faint' }]),
          { f: (t: number) => sinKxSlope(A, kk, t), cls: 'tancurve sec' },
        ]}
        label={tc(L('The graph of the derivative', 'Grafik turunannya'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={deg ? `\\frac{d}{dx}\\,${show(A, sep)}\\sin x^\\circ=${show(A, sep)}\\cdot\\frac{\\pi}{180}\\cos x^\\circ`.replace(/−/g, '-') : `\\frac{d}{dx}\\,${show(A, sep)}\\sin(${show(k, sep)}x)=${show(A * k, sep)}\\cos(${show(k, sep)}x)`.replace(/−/g, '-')} />
        </p>
        <p className="okline">
          {tc(L('period', 'periode'))} {show(period, sep)}
          {' · '}
          {tc(L('greatest slope', 'gradien terbesar'))} {tc(L('A·k', 'A·k'))} = <b>{show(A * kk, sep)}</b>
        </p>
        <p className="small">
          {deg
            ? tc(L('In degrees the inside function is πx/180, so a factor π/180 ≈ 0.01745 appears: the slope is tiny. This is the price of measuring angles in degrees.', 'Dalam derajat fungsi dalamnya πx/180, sehingga muncul faktor π/180 ≈ 0,01745: gradiennya sangat kecil. Itulah harga mengukur sudut dalam derajat.'))
            : tc(L('The inside function kx has derivative k, so the factor k comes out in front: a faster wave is steeper by exactly the factor it is faster.', 'Fungsi dalam kx berturunan k, sehingga faktor k muncul di depan: gelombang yang lebih cepat lebih curam tepat sebesar faktor kecepatannya.'))}
        </p>
      </div>
    </Frame>
  )
}

function ScaleChips({ mode, setMode }: { mode: ScaleMode; setMode: (m: ScaleMode) => void }) {
  const { tc } = useI18n()
  const items: [ScaleMode, string][] = [
    ['k', tc(L('sin(kx), radians', 'sin(kx), radian'))],
    ['deg', tc(L('sin(x°), degrees', 'sin(x°), derajat'))],
    ['piston', tc(L('a piston', 'sebuah piston'))],
  ]
  return (
    <div className="chips">
      {items.map(([id, label]) => (
        <button key={id} className={`chip ${mode === id ? 'on' : ''}`} onClick={() => setMode(id)} aria-pressed={mode === id}>
          {label}
        </button>
      ))}
    </div>
  )
}
