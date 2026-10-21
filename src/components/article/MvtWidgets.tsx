import { useState } from 'react'
import { useI18n } from '../../i18n'
import { ANTIDERIVATIVES, ROLLE_CASES, constantFor, mvt, rolleRoots, type MvtError, type RolleCase } from '../../lib/mvt'
import { polyTex } from '../../lib/tangent'
import { toNumber } from '../../lib/rates'
import { evalFloat, toTex } from '../../lib/chain'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'
import { aText, numOf } from './ExtremeWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)

/** The range of a graph: every value, or, when the function has poles, the middle 94% of them. */
export function yRange(values: number[], clip: boolean): [number, number] {
  const v = values.filter((y) => Number.isFinite(y)).sort((p, q) => p - q)
  if (!v.length) return [-1, 1]
  const lo = clip ? v[Math.floor(v.length * 0.03)] : v[0]
  const hi = clip ? v[Math.ceil(v.length * 0.97) - 1] : v[v.length - 1]
  const pad = (hi - lo) * 0.18 || 1
  return [lo - pad, hi + pad]
}

/* ------------------------------------------------ the Mean Value Theorem, on any function */

interface Preset {
  src: string
  a: number
  b: number
}
const PRESETS: Preset[] = [
  { src: 'x^2', a: 0, b: 2 },
  { src: '2.75*x^2', a: 0, b: 8 },
  { src: 'x^3-x^2', a: -1, b: 2 },
  { src: 'sqrt(1-x^2)', a: -1, b: 1 },
  { src: 'sin(x)', a: 0, b: 3 * Math.PI },
  { src: 'abs(x)', a: -1, b: 2 },
  { src: 'x^(2/3)', a: -1, b: 8 },
  { src: '1/x', a: -1, b: 2 },
]

const ERR: Record<MvtError | 'bounds', { en: string; id: string }> = {
  syntax: { en: 'I could not read that function. Use x, numbers, + - * /, powers such as x^2 or x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…) and abs(…), for example x^3-x.', id: 'Saya tidak dapat membaca fungsi itu. Pakai x, bilangan, + - * /, pangkat seperti x^2 atau x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…), dan abs(…), misalnya x^3-x.' },
  big: { en: 'That function is too long. Try a shorter one.', id: 'Fungsi itu terlalu panjang. Coba yang lebih pendek.' },
  interval: { en: 'Type two numbers a < b for the ends of the interval, such as 0 and 2, or 0 and 3*pi.', id: 'Ketik dua bilangan a < b untuk ujung selang, seperti 0 dan 2, atau 0 dan 3*pi.' },
  bounds: { en: 'Type the ends a and b as numbers, such as -1, 2 or 3*pi.', id: 'Ketik ujung a dan b sebagai bilangan, seperti -1, 2, atau 3*pi.' },
  undefined: { en: 'The function is not defined at a or at b, so there is no slope of the secant to compare with. Choose ends inside its domain.', id: 'Fungsi tidak terdefinisi di a atau di b, sehingga tidak ada gradien tali busur untuk dibandingkan. Pilih ujung di dalam domainnya.' },
}

export function MvtExplorer() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(PRESETS[2].src)
  const [aStr, setAStr] = useState(aText(PRESETS[2].a))
  const [bStr, setBStr] = useState(aText(PRESETS[2].b))
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)

  let body
  if (a === null || b === null) body = <p className="noline">{ERR.bounds[lang]}</p>
  else {
    const r = mvt(src, a, b)
    if (!r.ok) body = <p className="noline">{ERR[r.error][lang]}</p>
    else {
      const len = b - a
      const samples: number[] = []
      for (let i = 0; i <= 300; i++) samples.push(evalFloat(r.f, a + (len * i) / 300))
      const [lo, hi] = yRange([...samples, r.fa, r.fb, ...r.points.map((c) => evalFloat(r.f, c))], !r.continuous)
      const xr: [number, number] = [a - len * 0.06, b + len * 0.06]
      const at = (x: number) => (x >= a && x <= b ? evalFloat(r.f, x) : NaN)
      const where = (xs: number[]) => xs.map((x) => four(Math.abs(x) < 1e-6 ? 0 : x, sep)).join(', ')
      // a pole or a corner is found to a few decimals only: say it to three
      const near = (xs: number[]) => xs.map((x) => four(Number(x.toFixed(3)), sep)).join(', ')
      // the tangent at each c, drawn across the whole interval so it can be seen to be parallel to the secant
      const tangents = r.points.map((c) => {
        const y = evalFloat(r.f, c)
        return { x1: a, y1: y + r.slope * (a - c), x2: b, y2: y + r.slope * (b - c), cls: 'tantan' }
      })
      body = (
        <>
          <Plot
            xr={xr}
            yr={[lo, hi]}
            curves={[{ f: at, cls: 'tancurve' }]}
            segs={[{ x1: a, y1: r.fa, x2: b, y2: r.fb, cls: 'tansec' }, ...tangents]}
            vlines={[...r.breaks, ...r.kinks].map((x) => ({ x, cls: 'tannorm' }))}
            dots={[
              { x: a, y: r.fa, label: 'A' },
              { x: b, y: r.fb, label: 'B' },
              ...r.points.map((c) => ({ x: c, y: evalFloat(r.f, c), cls: 'tandot sec' })),
            ]}
            label={tc(L('The graph, the secant through the two ends and the tangent lines parallel to it', 'Grafik, tali busur melalui kedua ujung, dan garis singgung yang sejajar dengannya'))}
          />
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`f(x)=${toTex(r.f)}`)} />
            </p>
            <p>
              <Tex src={dec(`\\dfrac{f(b)-f(a)}{b-a}=\\dfrac{${four(r.fb, sep).replace('−', '-')}-(${four(r.fa, sep).replace('−', '-')})}{${four(b - a, sep)}}=${four(r.slope, sep).replace('−', '-')}`)} />
            </p>
            <p className={r.continuous ? 'okline' : 'noline'}>
              {r.continuous ? tc(L('f is continuous on [a, b].', 'f kontinu pada [a, b].')) : `${tc(L('f is not continuous on [a, b]: a break near x =', 'f tidak kontinu pada [a, b]: putus di dekat x ='))} ${near(r.breaks)}.`}
            </p>
            <p className={r.differentiable ? 'okline' : 'noline'}>
              {r.differentiable
                ? tc(L('f is differentiable at every point of (a, b).', 'f terdiferensialkan di setiap titik (a, b).'))
                : r.continuous
                  ? `${tc(L('f is not differentiable at x =', 'f tidak terdiferensialkan di x ='))} ${near(r.kinks)}.`
                  : tc(L('The break means f is not differentiable there either.', 'Putus itu berarti f juga tidak terdiferensialkan di sana.'))}
            </p>
            {r.points.length > 0 ? (
              <p className={r.hypotheses ? 'okline' : 'noline'}>
                f′(c) = {four(r.slope, sep)} {tc(L('at c =', 'di c ='))} <b>{where(r.points)}</b>
                {r.rolle ? ` (${tc(L('the tangent is horizontal: Rolle’s case', 'garis singgungnya mendatar: kasus Rolle'))})` : ''}.{' '}
                {r.hypotheses ? tc(L('The theorem promised at least one such point.', 'Teorema menjanjikan paling sedikit satu titik seperti ini.')) : tc(L('The hypotheses fail, so the theorem promised nothing: this is luck.', 'Syaratnya tidak terpenuhi, sehingga teorema tidak menjanjikan apa pun: ini kebetulan.'))}
              </p>
            ) : (
              <p className="noline">
                {tc(L('No point of (a, b) has a tangent with slope', 'Tidak ada titik di (a, b) yang garis singgungnya bergradien'))} {four(r.slope, sep)}.{' '}
                {r.hypotheses ? '' : tc(L('The theorem does not apply, so it is not contradicted.', 'Teorema tidak berlaku, sehingga tidak terbantahkan.'))}
              </p>
            )}
            <p className="small">{tc(L('The orange line is the secant through A and B; the green lines are the tangents at the marked points c, drawn across the interval to show that they are parallel to it.', 'Garis oranye adalah tali busur melalui A dan B; garis hijau adalah garis singgung di titik c yang ditandai, digambar sepanjang selang untuk menunjukkan bahwa sejajar dengannya.'))}</p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="mvtexplorer">
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
        {PRESETS.map((p) => (
          <button key={p.src + p.a} className="chip ghost" onClick={() => { setSrc(p.src); setAStr(aText(p.a)); setBStr(aText(p.b)) }}>
            <Tex src={`${exprTex(p.src)},\\ [${exprTex(aText(p.a))},\\ ${exprTex(aText(p.b))}]`} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* -------------------------------------------------------------- Rolle's Theorem, case by case */

const CASE_NAME: Record<string, { en: string; id: string }> = {
  one: { en: 'one horizontal tangent', id: 'satu garis singgung mendatar' },
  three: { en: 'three horizontal tangents', id: 'tiga garis singgung mendatar' },
  semicircle: { en: 'not differentiable at the ends', id: 'tidak terdiferensialkan di ujung' },
  endpoint: { en: 'jump at an end', id: 'lompatan di ujung' },
  interior: { en: 'jump inside', id: 'lompatan di dalam' },
  corner: { en: 'a corner', id: 'sebuah sudut' },
  cusp: { en: 'a cusp', id: 'titik puncak' },
}
const CASE_CHIP: Record<string, string> = {
  one: 'x^2-2x',
  three: '\\sin x',
  semicircle: '\\sqrt{1-x^2}',
  endpoint: '',
  interior: '',
  corner: '|x|',
  cusp: 'x^{2/3}',
}
const BREAK_TEXT: Record<RolleCase['breaks'], { en: string; id: string }> = {
  none: { en: 'Both hypotheses hold.', id: 'Kedua syarat terpenuhi.' },
  endpoint: { en: 'Not continuous at an endpoint.', id: 'Tidak kontinu di ujung selang.' },
  interior: { en: 'Not continuous at an interior point.', id: 'Tidak kontinu di titik dalam.' },
  corner: { en: 'Continuous, but not differentiable at an interior point (a corner).', id: 'Kontinu, tetapi tidak terdiferensialkan di titik dalam (sebuah sudut).' },
  cusp: { en: 'Continuous, but not differentiable at an interior point (a cusp).', id: 'Kontinu, tetapi tidak terdiferensialkan di titik dalam (titik puncak).' },
}

export function RolleCases() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('three')
  const c: RolleCase = ROLLE_CASES.find((k) => k.id === id) ?? ROLLE_CASES[0]
  const len = c.b - c.a
  const gap = c.gaps?.[0]
  const curves =
    gap === undefined
      ? [{ f: (x: number) => (x >= c.a && x <= c.b ? c.f(x) : NaN), cls: 'tancurve' }]
      : [
          { f: (x: number) => (x >= c.a && x < gap ? c.f(x) : NaN), cls: 'tancurve' },
          { f: (x: number) => (x >= gap && x <= c.b ? c.f(x) : NaN), cls: 'tancurve' },
        ]
  const dots: { x: number; y: number; cls?: string; open?: boolean }[] = [
    { x: c.a, y: c.f(c.a) },
    { x: c.b, y: c.f(c.b) },
    ...c.horizontal.map((x) => ({ x, y: c.f(x), cls: 'tandot sec' })),
  ]
  if (gap !== undefined) {
    dots.push({ x: gap, y: c.f(gap) }, { x: gap, y: c.f(gap - 1e-9), open: true })
  }
  return (
    <Frame name="rollecases">
      <div className="chips">
        {ROLLE_CASES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            {CASE_CHIP[k.id] && <Tex src={CASE_CHIP[k.id]} />} {tc(CASE_NAME[k.id])}
          </button>
        ))}
      </div>
      <p>
        <Tex src={c.tex} />
      </p>
      <Plot
        xr={c.xr}
        yr={c.yr}
        curves={curves}
        segs={[
          { x1: c.a, y1: c.f(c.a), x2: c.b, y2: c.f(c.b), cls: 'tantan faint' },
          ...c.horizontal.map((x) => ({ x1: x - len * 0.18, y1: c.f(x), x2: x + len * 0.18, y2: c.f(x), cls: 'tantan' })),
        ]}
        dots={dots}
        label={tc(L('The graph with its horizontal tangents, if there are any', 'Grafik dengan garis singgung mendatarnya, jika ada'))}
      />
      <div className="wgtout" aria-live="polite">
        <p className={c.breaks === 'none' ? 'okline' : 'noline'}>
          {tc(BREAK_TEXT[c.breaks])} f(a) = f(b) = {four(c.f(c.a), sep)}.{' '}
          {c.horizontal.length > 0
            ? `${tc(L('f′(c) = 0 at c =', 'f′(c) = 0 di c ='))} ${c.horizontal.map((x) => four(x, sep)).join(', ')}.`
            : tc(L('No tangent line is horizontal.', 'Tidak ada garis singgung yang mendatar.'))}
        </p>
        <p className="small">{tc(c.note)}</p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------- between two zeros of a polynomial, a zero of f′ */

const ROOT_PRESETS = ['-2, 2', '-5, -3', '-1, 0, 4', '-3, 0, 2, 5', '-4, -1, 1, 3, 6']

export function RolleRoots() {
  const { tc } = useI18n()
  const sep = useSep()
  const [txt, setTxt] = useState(ROOT_PRESETS[3])
  const parts = txt.split(/[\s,;]+/).filter(Boolean)
  const nums = parts.map(Number)
  const valid = parts.length >= 2 && parts.length <= 7 && nums.every((n) => Number.isInteger(n) && Math.abs(n) <= 12) && new Set(nums).size === nums.length

  let body
  if (!valid) {
    body = <p className="noline">{tc(L('Type 2 to 7 different whole numbers between −12 and 12, separated by commas, for example -3, 0, 2, 5.', 'Ketik 2 sampai 7 bilangan bulat berbeda antara −12 dan 12, dipisahkan koma, misalnya -3, 0, 2, 5.'))}</p>
  } else {
    const r = rolleRoots(nums)
    const coef = r.poly.map(toNumber)
    const f = (x: number) => coef.reduceRight((acc, k) => acc * x + k, 0)
    const lo = r.roots[0] - 1
    const hi = r.roots[r.roots.length - 1] + 1
    const ys = Array.from({ length: 301 }, (_, i) => f(lo + ((hi - lo) * i) / 300))
    const [y0, y1] = yRange(ys, false)
    body = (
      <>
        <Plot
          xr={[lo, hi]}
          yr={[y0, y1]}
          curves={[{ f, cls: 'tancurve' }]}
          segs={r.critical.map((c) => ({ x1: c - (hi - lo) * 0.06, y1: f(c), x2: c + (hi - lo) * 0.06, y2: f(c), cls: 'tantan' }))}
          dots={[...r.roots.map((x) => ({ x, y: 0 })), ...r.critical.map((c) => ({ x: c, y: f(c), cls: 'tandot sec' }))]}
          label={tc(L('The graph of the polynomial: black dots are its zeros, orange dots the points with a horizontal tangent', 'Grafik polinom: titik hitam adalah nolnya, titik oranye adalah titik dengan garis singgung mendatar'))}
        />
        <div className="wgtout" aria-live="polite">
          <p>
            <Tex src={`f(x)=${polyTex(r.poly)}`} />
          </p>
          <p>
            <Tex src={`f'(x)=${polyTex(r.dpoly)}`} />
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <thead>
                <tr>
                  <th>{tc(L('between the zeros', 'antara nol'))}</th>
                  <th>{tc(L('a zero of f′ there', 'nol f′ di sana'))}</th>
                </tr>
              </thead>
              <tbody>
                {r.between.map((b, i) => (
                  <tr key={i}>
                    <td>
                      {r.roots[i]} {tc(L('and', 'dan'))} {r.roots[i + 1]}
                    </td>
                    <td>{b.map((c) => four(c, sep)).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="okline">
            {tc(L(`f has ${r.roots.length} zeros, so f′ has ${r.critical.length}: exactly one in each gap, as Rolle’s Theorem promises at least one.`, `f memiliki ${r.roots.length} nol, sehingga f′ memiliki ${r.critical.length}: tepat satu di setiap celah, sedangkan teorema Rolle menjanjikan paling sedikit satu.`))}
          </p>
        </div>
      </>
    )
  }
  return (
    <Frame name="rolleroots">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          {tc(L('zeros of f', 'nol f'))} = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={txt} aria-label={tc(L('zeros of f', 'nol f'))} onChange={(e) => setTxt(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {ROOT_PRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setTxt(p)}>
            {p}
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* --------------------------------------------- two functions with one derivative differ by C */

export function ShiftCurves() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('sin')
  const p = ANTIDERIVATIVES.find((k) => k.id === id) ?? ANTIDERIVATIVES[0]
  const [x0, setX0] = useState<number | null>(null)
  const [y0, setY0] = useState<number | null>(null)
  const px = x0 ?? p.x0
  const py = y0 ?? p.y0
  const C = constantFor(p.g, px, py)
  const pick = (k: string) => {
    setId(k)
    setX0(null)
    setY0(null)
  }
  const [lo, hi] = p.yr
  const step = Math.max(1, Math.round((hi - lo) / 8))
  const family = [-2, -1, 0, 1, 2].map((k) => k * step)
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const cText = four(C, sep).replace('−', '-')
  return (
    <Frame name="shiftcurves">
      <div className="chips">
        {ANTIDERIVATIVES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => pick(k.id)} aria-pressed={id === k.id}>
            <Tex src={dec(`${k.fn}'(${k.v})=${k.dTex}`)} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          {p.v}₀ = <b>{four(px, sep)}</b>
          <input type="range" min={p.xr[0]} max={p.xr[1]} step={(p.xr[1] - p.xr[0]) / 100} value={px} aria-label={`${p.v}0`} onChange={(e) => setX0(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          y₀ = <b>{four(py, sep)}</b>
          <input type="range" min={p.yr[0]} max={p.yr[1]} step={(p.yr[1] - p.yr[0]) / 100} value={py} aria-label="y0" onChange={(e) => setY0(Number(e.target.value))} />
        </label>
      </div>
      <Plot
        xr={p.xr}
        yr={p.yr}
        curves={[...family.map((k) => ({ f: (x: number) => p.g(x) + k, cls: 'tancurve faint' })), { f: (x: number) => p.g(x) + C, cls: 'tancurve sec' }]}
        dots={[{ x: px, y: py, cls: 'tandot sec' }]}
        label={tc(L('The graphs of all the functions with the same derivative, and the one through the chosen point', 'Grafik semua fungsi dengan turunan yang sama, dan yang melalui titik yang dipilih'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={dec(`${p.fn}(${p.v})=${p.gTex}+C`)} />
        </p>
        <p>
          <Tex src={dec(`C=y_0-g(${p.v}_0)=${four(py, sep).replace('−', '-')}-(${four(p.g(px), sep).replace('−', '-')})=${cText}`)} />
        </p>
        <p className="okline">
          {tc(L('The graph through the point is', 'Grafik yang melalui titik itu adalah'))} <Tex src={dec(`y=${p.gTex}${Math.abs(C) < 1e-9 ? '' : `${C > 0 ? '+' : ''}${cText}`}`)} />
        </p>
        <p className="small">{tc(p.note)}</p>
      </div>
    </Frame>
  )
}
