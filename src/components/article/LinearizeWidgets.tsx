import { useState } from 'react'
import { useI18n } from '../../i18n'
import { LIN_PRESETS, POWERS, differentialStep, linearize, maxGap, percentChange, tolerance, type Linearization, type Preset } from '../../lib/linearize'
import { evalFloat, parseExpression, toTex } from '../../lib/chain'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

/** A number for a formula: the reader's decimal mark and an ASCII minus. */
const tx = (x: number, sep: string): string => show(Number(x.toPrecision(4)), sep).replace('−', '-')
const four = (x: number, sep: string): string => show(Number(x.toPrecision(4)), sep)

/** A typed number or a multiple of pi, such as "pi/2". */
function numOf(s: string): number | null {
  try {
    const v = evalFloat(parseExpression(s), NaN)
    return Number.isFinite(v) ? v : null
  } catch {
    return null
  }
}

/** The center as the reader sees it: π/6 rather than 0.5236. */
function aText(a: number): string {
  for (const k of [1, 2, 3, 4, 6]) {
    const n = (a * k) / Math.PI
    if (Math.abs(n - Math.round(n)) < 1e-9 && Math.round(n) !== 0) return `${Math.round(n) === 1 ? '' : Math.round(n)}π${k === 1 ? '' : `/${k}`}`
  }
  return String(Number(a.toPrecision(6)))
}
const aInput = (a: number): string => aText(a).replace('π', 'pi')

/** A window for a graph that ignores the few places where a function runs off. */
function yRange(f: (x: number) => number, xr: [number, number]): [number, number] {
  const ys: number[] = []
  for (let i = 0; i <= 240; i++) {
    const y = f(xr[0] + ((xr[1] - xr[0]) * i) / 240)
    if (Number.isFinite(y) && Math.abs(y) < 1e6) ys.push(y)
  }
  if (ys.length === 0) return [-1, 1]
  ys.sort((p, q) => p - q)
  const lo = ys[Math.floor(ys.length * 0.03)]
  const hi = ys[Math.floor(ys.length * 0.97)]
  const pad = (hi - lo || 2) * 0.15
  return [lo - pad, hi + pad]
}

/** m x + c written the way a person would: x, -x, no + 0. */
function lineTex(m: number, c: number): string {
  const mr = Number(m.toPrecision(4))
  const cr = Number(c.toPrecision(4))
  const mPart = mr === 0 ? '' : mr === 1 ? 'x' : mr === -1 ? '-x' : `${mr}x`
  if (cr === 0) return mPart === '' ? '0' : mPart
  if (mPart === '') return String(cr)
  return `${mPart}${cr < 0 ? '-' : '+'}${Math.abs(cr)}`
}

const fnTex = (p: Preset): string => `${exprTex(p.src)},\\ a=${exprTex(aText(p.a))}`

/* ------------------------------------------------ a function, its linearization and the error */

const LIN_ERR: Record<'syntax' | 'big' | 'undefined' | 'nodiff' | 'center', { en: string; id: string }> = {
  syntax: { en: 'I could not read that function. Use x, numbers, + - * /, powers such as x^2 or x^(1/3), sqrt(…), sin(…), cos(…), tan(…), e^x, ln(…) and arctan(…), for example sqrt(1+x).', id: 'Saya tidak dapat membaca fungsi itu. Pakai x, bilangan, + - * /, pangkat seperti x^2 atau x^(1/3), sqrt(…), sin(…), cos(…), tan(…), e^x, ln(…), dan arctan(…), misalnya sqrt(1+x).' },
  big: { en: 'That function is too long. Try a shorter one.', id: 'Fungsi itu terlalu panjang. Coba yang lebih pendek.' },
  undefined: { en: 'The function is not defined at the center a. Choose a center inside its domain.', id: 'Fungsi tidak terdefinisi di pusat a. Pilih pusat di dalam domainnya.' },
  nodiff: { en: 'The function has no derivative at the center a (a corner or a vertical tangent line), so it has no linearization there.', id: 'Fungsi tidak memiliki turunan di pusat a (sudut atau garis singgung tegak), sehingga tidak memiliki linearisasi di sana.' },
  center: { en: 'Type the center a as a number, such as 0, 3 or pi/2.', id: 'Ketik pusat a sebagai bilangan, seperti 0, 3, atau pi/2.' },
}

export function LinearizeTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const first = LIN_PRESETS[0]
  const [src, setSrc] = useState(first.src)
  const [aStr, setAStr] = useState(aInput(first.a))
  const [xr, setXr] = useState<[number, number]>(first.xr)
  const [t, setT] = useState(0.3)
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)

  const pick = (p: Preset) => {
    setSrc(p.src)
    setAStr(aInput(p.a))
    setXr(p.xr)
    setT((p.xr[1] - p.xr[0]) * 0.1)
  }
  const a = numOf(aStr)
  const lin = a === null ? null : linearize(src, a)
  const ctr = (
    <div className="inrow">
      <label className="lbl">
        f(x) = <input style={{ width: '12em', maxWidth: '100%' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
      </label>
      <label className="lbl">
        a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
      </label>
    </div>
  )
  const chips = (
    <div className="chips">
      {LIN_PRESETS.map((p) => (
        <button key={p.id} className="chip ghost" onClick={() => pick(p)}>
          <Tex src={fnTex(p)} />
        </button>
      ))}
    </div>
  )
  let body
  if (a === null) body = <p className="noline">{LIN_ERR.center[lang]}</p>
  else if (!lin || !lin.ok) body = <p className="noline">{LIN_ERR[lin ? lin.error : 'syntax'][lang]}</p>
  else {
    const w = xr[1] - xr[0]
    const lo = Math.min(xr[0], a - w * 0.05)
    const hi = Math.max(xr[1], a + w * 0.05)
    const tv = Math.max(lo - a, Math.min(hi - a, t))
    const x = a + tv
    const fx = lin.value(x)
    const lx = lin.line(x)
    const err = fx - lx
    const yr = yRange(lin.value, [lo, hi])
    const finite = Number.isFinite(fx)
    const errAt = (z: number) => Math.abs(lin.value(z) - lin.line(z))
    let top = 0
    for (let i = 0; i <= 200; i++) {
      const z = lo + ((hi - lo) * i) / 200
      const g = errAt(z)
      if (Number.isFinite(g) && g < 1e6) top = Math.max(top, g)
    }
    body = (
      <>
        <div className="amctl">
          <label className="lbl slider">
            x = <b>{show(Number(x.toPrecision(5)), sep)}</b> ({tc(L('distance from a', 'jarak dari a'))}: {show(Number(tv.toPrecision(3)), sep)})
            <input type="range" min={lo - a} max={hi - a} step={(hi - lo) / 400} value={tv} aria-label="x" onChange={(e) => setT(Number(e.target.value))} />
          </label>
        </div>
        <p className="small muted">{tc(L('The function (dark) and its linearization at a (the straight line)', 'Fungsi (gelap) dan linearisasinya di a (garis lurus)'))}</p>
        <Plot
          xr={[lo, hi]}
          yr={yr}
          curves={[
            { f: lin.value, cls: 'tancurve' },
            { f: lin.line, cls: 'tancurve sec' },
          ]}
          vlines={[{ x, cls: 'tantan faint' }]}
          dots={[
            { x: a, y: lin.fa },
            ...(finite ? [{ x, y: fx }, { x, y: lx, cls: 'tandot sec' }] : []),
          ]}
          label={tc(L('A function and its linearization', 'Sebuah fungsi dan linearisasinya'))}
        />
        <p className="small muted">{tc(L('The error |f(x) − L(x)|: zero at a, and flat there', 'Galat |f(x) − L(x)|: nol di a, dan mendatar di sana'))}</p>
        <Plot xr={[lo, hi]} yr={[-top * 0.05, top * 1.1 || 1]} curves={[{ f: errAt, cls: 'tancurve sec' }]} vlines={[{ x: a, cls: 'tannorm' }, { x, cls: 'tantan faint' }]} dots={finite ? [{ x, y: Math.abs(err) }] : []} label={tc(L('The error of the linearization', 'Galat linearisasi'))} />
        <div className="wgtout" aria-live="polite">
          <p>
            <Tex src={dec(`f(x)=${toTex(lin.f)}`)} />
          </p>
          <p>
            <Tex src={dec(`f'(x)=${toTex(lin.df)}`)} />
          </p>
          <p>
            <Tex src={`L(x)=f(a)+f'(a)(x-a)`} />
          </p>
          <p>
            <Tex src={dec(`L(x)=${tx(lin.fa, '.')}${lin.da < 0 ? '-' : '+'}${tx(Math.abs(lin.da), '.')}(x-${a < 0 ? `(${tx(a, '.')})` : tx(a, '.')})`)} />
          </p>
          <p className="small">
            <Tex src={dec(`L(x)=${lineTex(lin.slope, lin.intercept)}`)} />
          </p>
          {finite ? (
            <p className="okline">
              f(x) = {tx(fx, sep)}, L(x) = {tx(lx, sep)}, {tc(L('error', 'galat'))} f − L = {tx(err, sep)}
              {Math.abs(fx) > 1e-12 ? ` (${tx((100 * Math.abs(err)) / Math.abs(fx), sep)}% ${tc(L('of f(x)', 'dari f(x)'))})` : ''}
            </p>
          ) : (
            <p className="noline">{tc(L('f is not defined at this x.', 'f tidak terdefinisi di x ini.'))}</p>
          )}
        </div>
      </>
    )
  }
  return (
    <Frame name="linearize">
      {ctr}
      {chips}
      {body}
    </Frame>
  )
}

/* ----------------------------------------------------------- zooming in on a graph */

const ZOOM_PRESETS = LIN_PRESETS.filter((p) => ['sqrt1', 'cos', 'exp', 'cbrt', 'recip', 'sin'].includes(p.id))

export function ZoomIn() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('sqrt1')
  const [z, setZ] = useState(0)
  const p = ZOOM_PRESETS.find((q) => q.id === id) ?? ZOOM_PRESETS[0]
  const lin = linearize(p.src, p.a) as Linearization
  const h0 = Math.min(p.a - p.xr[0], p.xr[1] - p.a)
  const h = h0 * 10 ** -z
  const half = (Math.abs(lin.da) + 0.6) * h * 1.15
  const gap = maxGap(lin, p.a, h)
  const ratio = gap / (2 * half)
  const rows = [0, 1, 2, 3].map((k) => {
    const hk = h0 * 10 ** -k
    return { k, h: hk, gap: maxGap(lin, p.a, hk), rel: maxGap(lin, p.a, hk) / (2 * (Math.abs(lin.da) + 0.6) * hk * 1.15) }
  })
  return (
    <Frame name="zoomin">
      <div className="chips">
        {ZOOM_PRESETS.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => setId(q.id)} aria-pressed={id === q.id}>
            <Tex src={fnTex(q)} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('magnification', 'pembesaran'))}: <b>{show(10 ** z, sep)}×</b> ({tc(L('window width', 'lebar jendela'))} 2h = {show(Number((2 * h).toPrecision(3)), sep)})
          <input type="range" min={0} max={3.5} step={0.05} value={z} aria-label="zoom" onChange={(e) => setZ(Number(e.target.value))} />
        </label>
      </div>
      <Plot
        xr={[p.a - h, p.a + h]}
        yr={[lin.fa - half, lin.fa + half]}
        curves={[
          { f: lin.value, cls: 'tancurve' },
          { f: lin.line, cls: 'tancurve sec' },
        ]}
        dots={[{ x: p.a, y: lin.fa }]}
        label={tc(L('A magnified view of a function and its tangent line at a point', 'Tampilan diperbesar sebuah fungsi dan garis singgungnya di satu titik'))}
      />
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {tc(L('The largest gap between the curve and the line in this window is', 'Selisih terbesar antara kurva dan garis pada jendela ini adalah'))} <b>{four(gap, sep)}</b>, {tc(L('which is', 'yaitu'))} <b>{four(ratio * 100, sep)}%</b> {tc(L('of the height of the window.', 'dari tinggi jendela.'))}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('window half-width h', 'setengah lebar jendela h'))}</th>
                <th>{tc(L('largest gap', 'selisih terbesar'))}</th>
                <th>{tc(L('gap / window height', 'selisih / tinggi jendela'))}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k}>
                  <td>{show(Number(r.h.toPrecision(3)), sep)}</td>
                  <td>{four(r.gap, sep)}</td>
                  <td>{four(r.rel * 100, sep)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small">{tc(L('Each tenfold magnification makes the gap about a hundred times smaller, but the window only ten times smaller, so the picture looks more and more like a straight line.', 'Setiap pembesaran sepuluh kali membuat selisih sekitar seratus kali lebih kecil, padahal jendelanya hanya sepuluh kali lebih kecil, sehingga gambarnya makin mirip garis lurus.'))}</p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------ the differential and the true change */

const DIFF_PRESETS = LIN_PRESETS.filter((p) => ['cbrt', 'sin', 'exp', 'recip'].includes(p.id)).concat([{ id: 'square', src: 'x^2', a: 1, xr: [-0.5, 3] }])

export function DifferentialGap() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('square')
  const [d, setD] = useState(0.5)
  const p = DIFF_PRESETS.find((q) => q.id === id) ?? DIFF_PRESETS[0]
  const lin = linearize(p.src, p.a) as Linearization
  const span = p.xr[1] - p.xr[0]
  const dx = Math.max(p.xr[0] - p.a + span * 0.02, Math.min(p.xr[1] - p.a - span * 0.02, d * span * 0.4))
  const s = differentialStep(lin, p.a, dx)
  const xa = p.a
  const xb = p.a + dx
  const yr = yRange(lin.value, p.xr)
  return (
    <Frame name="diffgap">
      <div className="chips">
        {DIFF_PRESETS.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => { setId(q.id); setD(0.5) }} aria-pressed={id === q.id}>
            <Tex src={fnTex(q)} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          dx = Δx = <b>{show(Number(dx.toPrecision(3)), sep)}</b>
          <input type="range" min={-1} max={1} step={0.01} value={d} aria-label="dx" onChange={(e) => setD(Number(e.target.value))} />
        </label>
      </div>
      <Plot
        xr={p.xr}
        yr={yr}
        curves={[{ f: lin.value, cls: 'tancurve' }]}
        segs={[
          { x1: p.xr[0], y1: lin.line(p.xr[0]), x2: p.xr[1], y2: lin.line(p.xr[1]), cls: 'tantan faint' },
          { x1: xa, y1: lin.fa, x2: xb, y2: lin.fa, cls: 'tannorm' },
          { x1: xb, y1: lin.fa, x2: xb, y2: lin.line(xb), cls: 'tantan' },
          { x1: xb, y1: lin.line(xb), x2: xb, y2: lin.value(xb), cls: 'tansec' },
        ]}
        dots={[{ x: xa, y: lin.fa }, { x: xb, y: lin.value(xb) }, { x: xb, y: lin.line(xb), cls: 'tandot sec' }]}
        label={tc(L('The differential and the true change of a function', 'Diferensial dan perubahan sebenarnya sebuah fungsi'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`\\Delta f=f(a+dx)-f(a)=${tx(s.delta, '.')}`.replace(/(\d)\.(\d)/g, sep === ',' ? '$1{,}$2' : '$1.$2')} />
        </p>
        <p>
          <Tex src={`df=f'(a)\\,dx=${tx(s.dy, '.')}`.replace(/(\d)\.(\d)/g, sep === ',' ? '$1{,}$2' : '$1.$2')} />
        </p>
        <p className="okline">
          {tc(L('error', 'galat'))} Δf − df = {tx(s.error, sep)}
          {Math.abs(s.delta) > 1e-12 ? ` (${tx((100 * Math.abs(s.error)) / Math.abs(s.delta), sep)}% ${tc(L('of Δf', 'dari Δf'))})` : ''}, ε = (Δf − df)/dx = {tx(s.epsilon, sep)}
        </p>
        <p className="small">{tc(L('The green segment is df, the rise of the tangent line; the other colored segment is what is left of Δf. Shrink dx and ε goes to 0, so the error becomes small even next to dx.', 'Ruas hijau adalah df, kenaikan garis singgung; ruas berwarna lain adalah sisa Δf. Kecilkan dx dan ε menuju 0, sehingga galat menjadi kecil bahkan dibandingkan dx.'))}</p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------- percentages for powers: errors in measuring */

export function ErrorPercent() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('area')
  const [pct, setPct] = useState(2)
  const [q, setQ] = useState(1)
  const pw = POWERS.find((k) => k.id === id) ?? POWERS[1]
  const r = percentChange(pw.n, pct)
  const exp = pw.n === 1 ? '' : pw.n === -0.5 ? '^{-1/2}' : `^{${pw.n}}`
  const nTex = pw.n === -0.5 ? '-\\frac12' : String(pw.n)
  const dyTex = pw.n === 1 ? 'c\\,dx' : pw.n === 2 ? '2c\\,x\\,dx' : pw.n === -0.5 ? '-\\frac12\\,c\\,x^{-3/2}dx' : `${pw.n}\\,c\\,x^{${pw.n - 1}}dx`
  const exact = (t: number) => ((1 + t / 100) ** pw.n - 1) * 100
  const est = (t: number) => pw.n * t
  const xs: [number, number] = [-20, 20]
  const ys = [exact(-20), exact(20), est(-20), est(20)]
  const yr: [number, number] = [Math.min(...ys) * 1.1, Math.max(...ys) * 1.1]
  const tol = tolerance(pw.n, q)
  return (
    <Frame name="errpercent">
      <div className="chips">
        {POWERS.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            {lang === 'id' ? k.id_ : k.en}
          </button>
        ))}
      </div>
      <p>
        <Tex src={`y=cx${exp}`} />
      </p>
      <p>
        <Tex src={`dy=${dyTex}`} />
      </p>
      <p>
        <Tex src={`\\frac{dy}{y}=${nTex}\\,\\frac{dx}{x}`} />
      </p>
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('error in measuring x', 'galat dalam mengukur x'))} = <b>{show(pct, sep)}%</b>
          <input type="range" min={-20} max={20} step={0.5} value={pct} aria-label="p" onChange={(e) => setPct(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('allowed error in y', 'galat yang diizinkan pada y'))} = <b>{show(q, sep)}%</b>
          <input type="range" min={0.5} max={10} step={0.5} value={q} aria-label="q" onChange={(e) => setQ(Number(e.target.value))} />
        </label>
      </div>
      <p className="small muted">{tc(L('The change in y in percent against the error in x in percent: the exact curve (dark) and the estimate (straight line)', 'Perubahan y dalam persen terhadap galat x dalam persen: kurva eksak (gelap) dan perkiraannya (garis lurus)'))}</p>
      <Plot xr={xs} yr={yr} curves={[{ f: exact, cls: 'tancurve' }, { f: est, cls: 'tancurve sec' }]} vlines={[{ x: pct, cls: 'tantan faint' }]} dots={[{ x: pct, y: r.exact }, { x: pct, y: r.estimate, cls: 'tandot sec' }]} label={tc(L('Percentage change of a power against percentage error', 'Perubahan persen sebuah pangkat terhadap galat persen'))} />
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {tc(L('An error of', 'Galat'))} {show(pct, sep)}% {tc(L('in x changes y by about', 'pada x mengubah y sekitar'))} <b>{tx(r.estimate, sep)}%</b> ({tc(L('exactly', 'tepatnya'))} {tx(r.exact, sep)}%).
        </p>
        <p className="small">
          {tc(L(`To keep y within ${show(q, sep)}%, measure x to within about`, `Agar y tetap dalam ${show(q, sep)}%, ukur x dengan galat sekitar`))} <b>{tx(tol, sep)}%</b>.
        </p>
      </div>
    </Frame>
  )
}
