import { useId, useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import { evalFloat, neg, simp, size, toTex, type Node } from '../../lib/chain'
import { contour, curveFn, implicitDerivative, parseEquation, secondDerivative, solveY, ParseError } from '../../lib/implicitdiff'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, dec, useSep } from './widgetKit'
import { show } from './TangentWidgets'

/** A number for a formula: the reader's decimal mark and an ASCII minus. */
const tx = (x: number, sep: string): string => show(x, sep).replace('−', '-')

const ERR: Record<ParseError['code'], { en: string; id: string }> = {
  syntax: { en: 'I could not read that. Use x, y, numbers, + - * /, brackets, powers such as x^2 or y^(1/2), sqrt(…), sin(…), cos(…), tan(…), pi and e^(…), for example x^3 + y^3 = 9xy.', id: 'Saya tidak dapat membacanya. Pakai x, y, bilangan, + - * /, kurung, pangkat seperti x^2 atau y^(1/2), sqrt(…), sin(…), cos(…), tan(…), pi, dan e^(…), misalnya x^3 + y^3 = 9xy.' },
  paren: { en: 'Write the argument of sin, cos, tan, cot, sec, csc and sqrt in brackets, for example sin(xy) or sqrt(x+y).', id: 'Tulis argumen sin, cos, tan, cot, sec, csc, dan sqrt dalam kurung, misalnya sin(xy) atau sqrt(x+y).' },
  varexp: { en: 'An exponent that contains x or y, such as x^y or 2^y, needs the logarithm, which comes later. Here the exponent must be a number.', id: 'Pangkat yang memuat x atau y, seperti x^y atau 2^y, memerlukan logaritma, yang dibahas kemudian. Di sini pangkatnya harus berupa bilangan.' },
  function: { en: 'Only sin, cos, tan, cot, sec, csc, sqrt and e^ are known here. Logarithms and inverse trigonometric functions come later.', id: 'Di sini hanya sin, cos, tan, cot, sec, csc, sqrt, dan e^ yang dikenal. Logaritma dan fungsi trigonometri invers dibahas kemudian.' },
  exp: { en: 'e must appear as e^x or e^(something), and an exponent must be a number such as 3, -2 or (1/2).', id: 'e harus muncul sebagai e^x atau e^(sesuatu), dan pangkat harus berupa bilangan seperti 3, -2, atau (1/2).' },
  big: { en: 'That expression is too long.', id: 'Ekspresi itu terlalu panjang.' },
  equation: { en: 'Write an equation with exactly one = sign, for example x^2 + y^2 = 25.', id: 'Tulis persamaan dengan tepat satu tanda =, misalnya x^2 + y^2 = 25.' },
  noy: { en: 'There is no y in this equation (or it cancels), so there is nothing to differentiate implicitly.', id: 'Tidak ada y dalam persamaan ini (atau ia habis), sehingga tidak ada yang diturunkan secara implisit.' },
}

/* ------------------------------------------------------------ the picture */

const SIDE = 420

interface ViewProps {
  H: Node
  half: number
  point: { x: number; y: number; m: number } | null
  label: string
}

/** The curve H = 0 in a square window, with the tangent line and the normal line at a point. */
function ImplicitView({ H, half, point, label }: ViewProps) {
  const id = useId().replace(/:/g, '')
  const segs = useMemo(() => contour(H, -half, half, -half, half, 150), [H, half])
  const px = (x: number) => ((x + half) / (2 * half)) * SIDE
  const py = (y: number) => SIDE - ((y + half) / (2 * half)) * SIDE
  let d = ''
  for (const [a, b, c, e] of segs) d += `M${px(a).toFixed(1)},${py(b).toFixed(1)}L${px(c).toFixed(1)},${py(e).toFixed(1)}`
  const line = (x0: number, y0: number, dx: number, dy: number, cls: string) => {
    const n = Math.hypot(dx, dy) || 1
    const t = half * 4
    return <line x1={px(x0 - (dx / n) * t)} y1={py(y0 - (dy / n) * t)} x2={px(x0 + (dx / n) * t)} y2={py(y0 + (dy / n) * t)} className={cls} />
  }
  const vertical = point !== null && !Number.isFinite(point.m)
  return (
    <svg viewBox={`0 0 ${SIDE} ${SIDE}`} className="dersvg" style={{ maxWidth: 420 }} role="img" aria-label={label}>
      <defs>
        <clipPath id={`clip${id}`}>
          <rect x={0} y={0} width={SIDE} height={SIDE} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={SIDE} height={SIDE} className="tanframe" />
      <g clipPath={`url(#clip${id})`}>
        <line x1={0} x2={SIDE} y1={py(0)} y2={py(0)} className="tanaxis" />
        <line y1={0} y2={SIDE} x1={px(0)} x2={px(0)} className="tanaxis" />
        <path d={d} className="tancurve" fill="none" />
        {point && (
          <>
            {vertical ? line(point.x, point.y, 0, 1, 'tantan') : line(point.x, point.y, 1, point.m, 'tantan')}
            {vertical ? line(point.x, point.y, 1, 0, 'tannorm') : point.m === 0 ? line(point.x, point.y, 0, 1, 'tannorm') : line(point.x, point.y, -point.m, 1, 'tannorm')}
            <circle cx={px(point.x)} cy={py(point.y)} r={5} className="tandot" />
          </>
        )}
      </g>
    </svg>
  )
}

/* ------------------------------------------------ differentiating implicitly */

const PRESETS = ['x^2 + y^2 = 25', 'y^2 = x', 'x^3 + y^3 = 9xy', 'y^2 = x^2 + sin(xy)', '2x^3 - 3y^2 = 8', 'x^2 + xy + y^2 = 7', 'y^4 = y^2 - x^2', 'sin(xy) = x + y']

export function ImplicitSteps() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState('x^3 + y^3 = 9xy')
  const [xs, setXs] = useState('2')
  const [ys, setYs] = useState('4')
  const [second, setSecond] = useState(false)

  let eq: ReturnType<typeof parseEquation> | null = null
  let imp: ReturnType<typeof implicitDerivative> | null = null
  let err: ParseError['code'] | null = null
  try {
    eq = parseEquation(src)
    if (size(eq.lhs) + size(eq.rhs) > 70) throw new ParseError('big')
    imp = implicitDerivative(eq)
  } catch (e) {
    imp = null
    err = e instanceof ParseError ? e.code : 'syntax'
  }
  const x0 = Number(xs.replace(',', '.'))
  const yGuess = Number(ys.replace(',', '.'))

  let body
  let H: Node | null = null
  let point: { x: number; y: number; m: number } | null = null
  if (!imp || !eq) {
    body = <p className="noline">{ERR[err ?? 'syntax'][lang]}</p>
  } else {
    H = curveFn(eq)
    const sec = second ? secondDerivative(imp) : null
    const secShown = sec && size(sec) <= 260 ? sec : null
    const xOk = xs.trim() !== '' && Number.isFinite(x0)
    const yOk = ys.trim() !== '' && Number.isFinite(yGuess)
    const ySolved = xOk && yOk ? solveY(H, x0, yGuess) : null
    // Newton's method stops a hair away from a double root such as (5, 0) on the circle: use the round value when it is also a solution
    const yRounded = ySolved === null ? null : Math.round(ySolved * 1e6) / 1e6
    const yAt = ySolved !== null && yRounded !== null && Math.abs(evalFloat(H, x0, yRounded)) < 1e-9 ? yRounded : ySolved
    let pointBody = null
    if (xOk && yOk) {
      if (yAt === null) {
        pointBody = <p className="noline">{tc(L('No point of the curve above this x near the y you gave: try another y₀ (a guess is enough) or another x₀.', 'Tidak ada titik kurva di atas x ini dekat y yang kamu beri: coba y₀ lain (perkiraan saja cukup) atau x₀ lain.'))}</p>
      } else {
        const m = evalFloat(imp.slope, x0, yAt)
        const singular = Number.isNaN(m)
        const vertical = !singular && (!Number.isFinite(m) || Math.abs(m) > 1e7)
        if (!singular) point = { x: x0, y: yAt, m: vertical ? Infinity : m }
        const c = yAt - m * x0
        pointBody = (
          <>
            <p className="okline">
              <Tex src={`\\left(${tx(x0, sep)},\\ ${tx(yAt, sep)}\\right)`} /> {tc(L('is on the curve', 'berada pada kurva'))}
              {singular ? (
                <>
                  . {tc(L('The formula for y′ is 0/0 here: this is a singular point, where the curve usually crosses itself and has more than one tangent line.', 'Rumus y′ adalah 0/0 di sini: ini titik singular, tempat kurva biasanya memotong dirinya sendiri dan memiliki lebih dari satu garis singgung.'))}
                </>
              ) : vertical ? (
                <>
                  . {tc(L('The denominator is 0 here: the tangent line is vertical,', 'Penyebutnya 0 di sini: garis singgungnya tegak,'))} <Tex src={`x=${tx(x0, sep)}`} />, {tc(L('and the normal line is horizontal,', 'dan garis normalnya mendatar,'))} <Tex src={`y=${tx(yAt, sep)}`} />.
                </>
              ) : (
                <>
                  , <Tex src={`y'=${tx(m, sep)}`} />
                </>
              )}
            </p>
            {!vertical && !singular && (
              <p className="small">
                {tc(L('Tangent line', 'Garis singgung'))} <Tex src={`y=${tx(m, sep)}x${c < 0 ? '' : '+'}${tx(c, sep)}`} />
                {m !== 0 && (
                  <>
                    {'; '}
                    {tc(L('normal line', 'garis normal'))} <Tex src={`y=${tx(-1 / m, sep)}x${yAt + x0 / m < 0 ? '' : '+'}${tx(yAt + x0 / m, sep)}`} />
                  </>
                )}
                {m === 0 && <>{'; '}{tc(L('the normal line is vertical', 'garis normalnya tegak'))}, <Tex src={`x=${tx(x0, sep)}`} /></>}
              </p>
            )}
            <p className="small muted">
              {tc(L('A check: solving the equation for y on both sides of x and taking a difference quotient gives', 'Pemeriksaan: menyelesaikan persamaan untuk y di kedua sisi x dan mengambil hasil bagi selisih memberi'))}{' '}
              {(() => {
                const H0 = H as Node
                const yp = solveY(H0, x0 + 1e-5, yAt)
                const ym = solveY(H0, x0 - 1e-5, yAt)
                return yp !== null && ym !== null && Math.abs(yp - yAt) < 0.1 && Math.abs(ym - yAt) < 0.1 ? dec(String(parseFloat(((yp - ym) / 2e-5).toPrecision(6))), sep) : '–'
              })()}
              .
            </p>
          </>
        )
      }
    }
    body = (
      <>
        <p>
          <Tex src={`${toTex(eq.lhs)}=${toTex(eq.rhs)}`} />
        </p>
        <ol className="small">
          <li>
            <b>{tc(L('Differentiate both sides with respect to x', 'Turunkan kedua ruas terhadap x'))}</b> {tc(L('(y is a function of x, so every y brings a factor y′):', '(y adalah fungsi dari x, sehingga setiap y membawa faktor y′):'))}{' '}
            <Tex src={`${toTex(imp.dl)}=${toTex(imp.dr)}`} />
          </li>
          <li>
            <b>{tc(L('Collect the terms with y′', 'Kumpulkan suku-suku dengan y′'))}</b>: <Tex src={`\\left(${toTex(imp.b)}\\right)y'=${toTex(simp(neg(imp.a)))}`} />
          </li>
          <li>
            <b>{tc(L('Solve for y′', 'Selesaikan untuk y′'))}</b>: <Tex src={`y'=${toTex(imp.slope)}`} />
          </li>
        </ol>
        {second && (
          <p>
            {secShown ? <Tex src={`y''=${toTex(secShown)}`} /> : <span className="noline">{tc(L('The formula for y″ is too long to show; its value at the point is below.', 'Rumus y″ terlalu panjang untuk ditampilkan; nilainya di titik itu ada di bawah.'))}</span>}
            {yAt !== null && (
              <>
                {' '}
                <Tex src={`y''\\approx ${tx(evalFloat(sec ?? imp.slope, x0, yAt), sep)}`} />
              </>
            )}
          </p>
        )}
        {pointBody}
      </>
    )
  }

  return (
    <Frame name="implicitsteps">
      <div className="inrow">
        <label className="lbl">
          {tc(L('equation', 'persamaan'))} <input style={{ width: '16em', maxWidth: '100%' }} value={src} aria-label="equation" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          x₀ = <input style={{ width: '4em' }} value={xs} aria-label="x0" onChange={(e) => setXs(e.target.value)} />
        </label>
        <label className="lbl">
          y₀ ≈ <input style={{ width: '4em' }} value={ys} aria-label="y0" onChange={(e) => setYs(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {PRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setSrc(p)}>
            <Tex src={exprTex(p)} />
          </button>
        ))}
      </div>
      <div className="chips">
        <button className={`chip ${second ? 'on' : ''}`} onClick={() => setSecond(!second)} aria-pressed={second}>
          {tc(L('also the second derivative', 'juga turunan kedua'))}
        </button>
      </div>
      {H && <ImplicitView H={H} half={8} point={point} label={tc(L('The curve with the tangent line (green) and the normal line (orange) at the point', 'Kurva dengan garis singgung (hijau) dan garis normal (jingga) di titik itu'))} />}
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* -------------------------------------------------- a point sliding round a curve */

const ROUND = ['x^2 + y^2 = 25', 'x^2/9 + y^2/4 = 1', 'x^2 + xy + y^2 = 7', 'x^4 + y^4 = 16']

export function ImplicitSlide() {
  const { tc } = useI18n()
  const sep = useSep()
  const [ci, setCi] = useState(0)
  const [deg, setDeg] = useState(40)
  const eq = parseEquation(ROUND[ci])
  const imp = implicitDerivative(eq)
  const H = curveFn(eq)
  const theta = (deg * Math.PI) / 180
  // walk out along the ray until the equation changes sign, then bisect
  let r: number | null = null
  const f = (t: number) => evalFloat(H, t * Math.cos(theta), t * Math.sin(theta))
  let prev = 0.02
  for (let t = 0.05; t < 12; t += 0.05) {
    if (f(prev) * f(t) <= 0) {
      let lo = prev
      let hi = t
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2
        if (f(lo) * f(mid) <= 0) hi = mid
        else lo = mid
      }
      r = (lo + hi) / 2
      break
    }
    prev = t
  }
  const x = r === null ? NaN : r * Math.cos(theta)
  const y = r === null ? NaN : r * Math.sin(theta)
  const m = r === null ? NaN : evalFloat(imp.slope, x, y)
  const vertical = r !== null && (!Number.isFinite(m) || Math.abs(m) > 1e4)
  const point = r === null ? null : { x, y, m: vertical ? Infinity : m }
  return (
    <Frame name="implicitslide">
      <div className="chips">
        {ROUND.map((p, i) => (
          <button key={p} className={`chip ${ci === i ? 'on' : ''}`} onClick={() => setCi(i)} aria-pressed={ci === i}>
            <Tex src={exprTex(p)} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('position', 'posisi'))} <b>{deg}°</b>
          <input type="range" min={0} max={359} step={1} value={deg} aria-label="angle" onChange={(e) => setDeg(Number(e.target.value))} />
        </label>
      </div>
      <ImplicitView H={H} half={6} point={point} label={tc(L('A point moving round the curve, with its tangent line (green) and normal line (orange)', 'Titik yang bergerak mengelilingi kurva, dengan garis singgung (hijau) dan garis normalnya (jingga)'))} />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`y'=${toTex(imp.slope)}`} />
        </p>
        {point ? (
          <p className="okline">
            <Tex src={`\\left(${tx(x, sep)},\\ ${tx(y, sep)}\\right)`} />
            {vertical ? (
              <> · {tc(L('vertical tangent: the denominator is 0', 'garis singgung tegak: penyebutnya 0'))}</>
            ) : (
              <>
                {' · '}
                <Tex src={`y'=${tx(m, sep)}`} /> {m === 0 ? tc(L('(horizontal tangent)', '(garis singgung mendatar)')) : ''}
              </>
            )}
          </p>
        ) : (
          <p className="noline">{tc(L('This direction does not reach the curve.', 'Arah ini tidak mencapai kurva.'))}</p>
        )}
        <p className="small">{tc(L('The tangent is horizontal where the numerator of y′ is 0 and vertical where the denominator is 0.', 'Garis singgung mendatar di tempat pembilang y′ bernilai 0 dan tegak di tempat penyebutnya 0.'))}</p>
      </div>
    </Frame>
  )
}
