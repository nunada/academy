import { useState, type ReactNode } from 'react'
import { useI18n } from '../../i18n'
import { INFLECTION_CASES, SECOND_CASES, SKETCH_PRESETS, concavity, secondTest, sketch, type Bend, type Concavity, type ConcError, type TangentKind } from '../../lib/concavity'
import { evalFloat, toTex } from '../../lib/chain'
import { exprTex } from '../../lib/exprtex'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'
import { aText, numOf } from './ExtremeWidgets'
import { yRange } from './MvtWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)
const clean = (x: number): number => (Math.abs(x) < 1e-6 ? 0 : x)

const ERR: Record<ConcError | 'bounds', { en: string; id: string }> = {
  syntax: { en: 'I could not read that. Use x, numbers, + - * /, powers such as x^2 or x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…) and abs(…), for example x^3-3*x^2.', id: 'Saya tidak dapat membacanya. Pakai x, bilangan, + - * /, pangkat seperti x^2 atau x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…), dan abs(…), misalnya x^3-3*x^2.' },
  big: { en: 'That is too long. Try a shorter one.', id: 'Itu terlalu panjang. Coba yang lebih pendek.' },
  interval: { en: 'Type two numbers a < b for the ends of the window, such as -2 and 3.', id: 'Ketik dua bilangan a < b untuk ujung jendela, seperti -2 dan 3.' },
  bounds: { en: 'Type the ends a and b as numbers, such as -2, 3 or 2*pi.', id: 'Ketik ujung a dan b sebagai bilangan, seperti -2, 3, atau 2*pi.' },
  undefined: { en: 'The function is not defined at every point of [a, b]. Choose a window inside its domain.', id: 'Fungsi tidak terdefinisi di setiap titik [a, b]. Pilih jendela di dalam domainnya.' },
  discontinuous: { en: 'The function has a break (a pole or a jump) inside [a, b]. The sketch tool below cuts at breaks; here choose a window without one.', id: 'Fungsi memiliki putus (kutub atau lompatan) di dalam [a, b]. Alat penggambar di bawah memotong di titik putus; di sini pilih jendela tanpa putus.' },
}

const BEND: Record<Bend, { en: string; id: string }> = {
  up: { en: 'concave up', id: 'cekung ke atas' },
  down: { en: 'concave down', id: 'cekung ke bawah' },
  flat: { en: 'straight', id: 'lurus' },
}
const SIGN: Record<Bend, string> = { up: '+', down: '−', flat: '0' }
const TANGENT: Record<TangentKind, { en: string; id: string }> = {
  smooth: { en: 'a tangent line', id: 'ada garis singgung' },
  vertical: { en: 'a vertical tangent', id: 'garis singgung tegak' },
  cusp: { en: 'a cusp (no tangent line)', id: 'titik puncak (tanpa garis singgung)' },
  corner: { en: 'a corner (no tangent line)', id: 'sudut (tanpa garis singgung)' },
}
const KIND = {
  zero: { en: 'f″ = 0', id: 'f″ = 0' },
  undefined: { en: 'f″ does not exist', id: 'f″ tidak ada' },
}
const bendCls = (b: Bend): string => (b === 'up' ? 'tancurve' : b === 'down' ? 'tancurve sec' : 'tancurve faint')
const pieceCurves = (r: Concavity, g: (x: number) => number) => r.pieces.map((q) => ({ f: (x: number) => (x >= q.lo && x <= q.hi ? g(x) : NaN), cls: bendCls(q.bend) }))

/** A short tangent line at x, as a segment of the plot. */
const tangentSeg = (r: Concavity, x: number, half: number) => {
  const y = evalFloat(r.f, x)
  const m = evalFloat(r.df, x)
  return Number.isFinite(y) && Number.isFinite(m) ? [{ x1: x - half, y1: y - m * half, x2: x + half, y2: y + m * half, cls: 'tantan' }] : []
}

/* ------------------------------------------------------- how a graph bends, on any function */

interface Preset {
  src: string
  a: number
  b: number
}
const PRESETS: Preset[] = [
  { src: 'x^3-3*x^2+2', a: -1, b: 3 },
  { src: 'x^3', a: -2, b: 2 },
  { src: '3+sin(x)', a: 0, b: 2 * Math.PI },
  { src: 'x^(5/3)', a: -2, b: 2 },
  { src: 'x^4', a: -2, b: 2 },
  { src: 'x^(1/3)', a: -2, b: 2 },
  { src: 'x^4-4*x^3+10', a: -1, b: 4 },
]

export function ConcavityTool() {
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
    const r = concavity(src, a, b)
    if (!r.ok) body = <p className="noline">{ERR[r.error][lang]}</p>
    else {
      const f = (x: number) => evalFloat(r.f, x)
      const len = b - a
      const xr: [number, number] = [a - len * 0.04, b + len * 0.04]
      const [lo, hi] = yRange(Array.from({ length: 301 }, (_, i) => f(a + (len * i) / 300)), false)
      const ds = Array.from({ length: 301 }, (_, i) => evalFloat(r.d2f, a + (len * (i + 0.5)) / 301))
      const [dlo, dhi] = yRange(ds, true)
      body = (
        <>
          <Plot
            xr={xr}
            yr={[lo, hi]}
            curves={pieceCurves(r, f)}
            segs={r.points.filter((q) => q.inflection && q.tangent === 'smooth').flatMap((q) => tangentSeg(r, q.x, len * 0.08))}
            vlines={r.points.map((q) => ({ x: q.x, cls: 'tannorm' }))}
            dots={r.points.map((q) => ({ x: q.x, y: q.y, cls: q.inflection ? 'tandot sec' : 'tandot', open: !q.inflection }))}
            label={tc(L('The graph, dark where it is concave up and orange where it is concave down, with the points where f″ is zero or does not exist', 'Grafik, gelap saat cekung ke atas dan oranye saat cekung ke bawah, dengan titik tempat f″ nol atau tidak ada'))}
          />
          <p className="small muted">{tc(L('The graph of f″: above the axis the graph of f is concave up, below it concave down.', 'Grafik f″: di atas sumbu grafik f cekung ke atas, di bawahnya cekung ke bawah.'))}</p>
          <Plot
            xr={xr}
            yr={[Math.min(dlo, -0.2 * (dhi - dlo)), Math.max(dhi, 0.2 * (dhi - dlo))]}
            curves={pieceCurves(r, (x) => evalFloat(r.d2f, x))}
            vlines={r.points.map((q) => ({ x: q.x, cls: 'tannorm' }))}
            label={tc(L('The graph of the second derivative f″', 'Grafik turunan kedua f″'))}
          />
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <thead>
                <tr>
                  <th>{tc(L('interval', 'selang'))}</th>
                  <th>{tc(L('sign of f″', 'tanda f″'))}</th>
                  <th>{tc(L('the graph of f is', 'grafik f'))}</th>
                </tr>
              </thead>
              <tbody>
                {r.pieces.map((q, i) => (
                  <tr key={i} className={q.bend === 'up' ? 'grp0' : q.bend === 'down' ? 'grp1' : ''}>
                    <td>
                      ({four(q.lo, sep)}, {four(q.hi, sep)})
                    </td>
                    <td>{SIGN[q.bend]}</td>
                    <td>{tc(BEND[q.bend])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`f(x)=${toTex(r.f)}`)} />
            </p>
            {toTex(r.d2f).length <= 45 && (
              <p>
                <Tex src={dec(`f''(x)=${toTex(r.d2f)}`)} />
              </p>
            )}
            {r.points.length > 0 ? (
              r.points.map((q, i) => (
                <p key={i} className={q.inflection ? 'okline' : 'noline'}>
                  x = {four(clean(q.x), sep)} ({tc(KIND[q.kind])}; {tc(TANGENT[q.tangent])}): {SIGN[q.left]} → {SIGN[q.right]},{' '}
                  {q.inflection ? `${tc(L('a point of inflection', 'titik belok'))} (${four(clean(q.x), sep)}, ${four(clean(q.y), sep)})` : tc(L('not a point of inflection', 'bukan titik belok'))}.
                </p>
              ))
            ) : (
              <p>{tc(L('f″ is never zero and always exists here, so the graph bends one way throughout.', 'f″ tidak pernah nol dan selalu ada di sini, sehingga grafik melengkung ke satu arah sepanjang jendela.'))}</p>
            )}
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="concavitytool">
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

/* ----------------------------------------------------------- inflection points, case by case */

export function InflectionCases() {
  const { tc } = useI18n()
  const [id, setId] = useState('cubic')
  const q = INFLECTION_CASES.find((k) => k.id === id) ?? INFLECTION_CASES[0]
  const r = concavity(q.src, q.a, q.b)
  if (!r.ok) return null
  const f = (x: number) => evalFloat(r.f, x)
  const len = q.b - q.a
  const [lo, hi] = yRange(Array.from({ length: 201 }, (_, i) => f(q.a + (len * i) / 200)), false)
  const at = r.points.find((z) => Math.abs(z.x - q.c) < 1e-5 * (1 + Math.abs(q.c)))
  return (
    <Frame name="inflectioncases">
      <div className="chips">
        {INFLECTION_CASES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={k.tex} />
          </button>
        ))}
      </div>
      <Plot
        xr={[q.a - len * 0.04, q.b + len * 0.04]}
        yr={[lo, hi]}
        curves={pieceCurves(r, f)}
        segs={at && at.tangent === 'smooth' ? tangentSeg(r, q.c, len * 0.18) : []}
        vlines={[{ x: q.c, cls: 'tannorm' }]}
        dots={at ? [{ x: q.c, y: at.y, cls: at.inflection ? 'tandot sec' : 'tandot', open: !at.inflection }] : []}
        label={tc(L('The graph, dark where it is concave up and orange where it is concave down, with the point and its tangent line', 'Grafik, gelap saat cekung ke atas dan oranye saat cekung ke bawah, dengan titik dan garis singgungnya'))}
      />
      {at && (
        <div className="wgtout" aria-live="polite">
          <p>
            <Tex src={q.tex} />, <Tex src={`x=${exprTex(aText(q.c))}`} /> ({tc(KIND[at.kind])}; {tc(TANGENT[at.tangent])})
          </p>
          <p>
            f″ {tc(L('to the left:', 'di kiri:'))} <b>{SIGN[at.left]}</b> ({tc(BEND[at.left])}); f″ {tc(L('to the right:', 'di kanan:'))} <b>{SIGN[at.right]}</b> ({tc(BEND[at.right])})
          </p>
          <p className={at.inflection ? 'okline' : 'noline'}>
            <b>{at.inflection ? tc(L('a point of inflection', 'titik belok')) : tc(L('not a point of inflection', 'bukan titik belok'))}</b>. {tc(q.note)}
          </p>
        </div>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------- the Second Derivative Test */

const SECOND_WORD = {
  min: { en: 'local minimum', id: 'minimum lokal' },
  max: { en: 'local maximum', id: 'maksimum lokal' },
  fails: { en: 'the test fails', id: 'ujinya gagal' },
  notcritical: { en: 'not a critical point', id: 'bukan titik kritis' },
  none: { en: 'no extreme value', id: 'bukan ekstrem' },
}

export function SecondTestTool() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('min')
  const q = SECOND_CASES.find((k) => k.id === id) ?? SECOND_CASES[0]
  const r = secondTest(q.src, q.c, 0.5)
  if (!r.ok) return null
  const m = concavity(q.src, q.c - 1.2, q.c + 1.2)
  const sgn = (t: string) => (t === 'up' ? '+' : t === 'down' ? '−' : '0')
  const f = (x: number) => (m.ok ? evalFloat(m.f, x) : NaN)
  const [lo, hi] = yRange(Array.from({ length: 201 }, (_, i) => f(q.c - 1.2 + (2.4 * i) / 200)), false)
  return (
    <Frame name="secondtest">
      <div className="chips">
        {SECOND_CASES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={k.tex} />
          </button>
        ))}
      </div>
      {m.ok && (
        <Plot
          xr={[q.c - 1.3, q.c + 1.3]}
          yr={[lo, hi]}
          curves={pieceCurves(m, f)}
          vlines={[{ x: q.c, cls: 'tannorm' }]}
          dots={[{ x: q.c, y: r.fc, cls: 'tandot sec' }]}
          label={tc(L('The graph near the critical point, dark where concave up and orange where concave down', 'Grafik di dekat titik kritis, gelap saat cekung ke atas dan oranye saat cekung ke bawah'))}
        />
      )}
      <div className="wgtout" aria-live="polite">
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('test', 'uji'))}</th>
                <th>{tc(L('what it reads', 'yang dibaca'))}</th>
                <th>{tc(L('verdict', 'putusan'))}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tc(L('Second Derivative Test', 'Uji Turunan Kedua'))}</td>
                <td>
                  f′({four(clean(q.c), sep)}) = {Number.isFinite(r.slope) ? four(clean(r.slope), sep) : tc(L('does not exist', 'tidak ada'))}; f″({four(clean(q.c), sep)}) = {Number.isFinite(r.curvature) ? four(clean(r.curvature), sep) : tc(L('does not exist', 'tidak ada'))}
                </td>
                <td className={r.second === 'fails' ? 'wrongcell' : ''}>{tc(SECOND_WORD[r.second])}</td>
              </tr>
              <tr>
                <td>{tc(L('First Derivative Test', 'Uji Turunan Pertama'))}</td>
                <td>
                  f′ {sgn(r.left)} → {sgn(r.right)}
                </td>
                <td>{tc(SECOND_WORD[r.first])}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small">{tc(q.note)}</p>
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------- sketch a curve */

export function SketchTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(SKETCH_PRESETS[1].src)
  const [aStr, setAStr] = useState(aText(SKETCH_PRESETS[1].a))
  const [bStr, setBStr] = useState(aText(SKETCH_PRESETS[1].b))
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)

  let body
  if (a === null || b === null) body = <p className="noline">{ERR.bounds[lang]}</p>
  else {
    const s = sketch(src, a, b)
    if (!s.ok) body = <p className="noline">{ERR[s.error][lang]}</p>
    else {
      const f = (x: number) => evalFloat(s.f, x)
      const len = b - a
      const samples: number[] = []
      for (const br of s.branches) for (let i = 0; i <= 120; i++) samples.push(f(br.lo + ((br.hi - br.lo) * i) / 120))
      const [lo, hi] = yRange(samples, s.breaks.length > 0)
      const xr: [number, number] = [a - len * 0.03, b + len * 0.03]
      const curves = s.branches.flatMap((br) => br.mono.pieces.map((q) => ({ f: (x: number) => (x >= q.lo && x <= q.hi ? f(x) : NaN), cls: q.trend === 'up' ? 'tancurve' : q.trend === 'down' ? 'tancurve sec' : 'tancurve faint' })))
      const crit = s.branches.flatMap((br) => br.mono.crit)
      const infl = s.branches.flatMap((br) => br.conc.points.filter((q) => q.inflection))
      const line = (m: number, c: number) => ({ x1: xr[0], y1: m * xr[0] + c, x2: xr[1], y2: m * xr[1] + c, cls: 'tantan faint' })
      const asyms = [s.left, s.right].filter((z, i, arr) => z.kind !== 'none' && arr.findIndex((o) => o.kind === z.kind && Math.abs(o.m - z.m) < 1e-6 && Math.abs(o.b - z.b) < 1e-3) === i)
      const where = (xs: number[]) => xs.map((x) => four(clean(Number(x.toFixed(3))), sep)).join(', ')
      const stepP = (n: number, head: string, text: ReactNode) => (
        <p key={n}>
          <b>{n}. {head}</b> {text}
        </p>
      )
      const first = s.branches[0]
      body = (
        <>
          <Plot
            xr={xr}
            yr={[lo, hi]}
            curves={curves}
            segs={asyms.map((z) => line(z.m, z.b))}
            vlines={s.breaks.filter((k) => k.vertical).map((k) => ({ x: k.x, cls: 'tannorm' }))}
            dots={[
              ...crit.filter((q) => q.verdict !== 'none').map((q) => ({ x: q.x, y: q.fx, cls: 'tandot sec' })),
              ...infl.map((q) => ({ x: q.x, y: q.y, cls: 'tandot' })),
            ]}
            label={tc(L('The sketch: dark where f rises, orange where it falls, orange dots at local extremes, black dots at inflection points, dashed lines for asymptotes', 'Sketsa: gelap saat f naik, oranye saat turun, titik oranye di ekstrem lokal, titik hitam di titik belok, garis putus-putus untuk asimtot'))}
          />
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`f(x)=${toTex(s.f)}`)} />
            </p>
            {stepP(
              1,
              tc(L('Domain and symmetry.', 'Domain dan simetri.')),
              `${s.breaks.length ? `${tc(L('Not defined near x =', 'Tidak terdefinisi di dekat x ='))} ${where(s.breaks.map((k) => k.x))}. ` : tc(L('Defined on the whole window. ', 'Terdefinisi di seluruh jendela. '))}${s.symmetry === 'odd' ? tc(L('Odd: symmetric about the origin.', 'Ganjil: simetris terhadap titik asal.')) : s.symmetry === 'even' ? tc(L('Even: symmetric about the y-axis.', 'Genap: simetris terhadap sumbu y.')) : tc(L('No symmetry.', 'Tanpa simetri.'))}`,
            )}
            {first && toTex(first.mono.df).length <= 40 && stepP(2, tc(L('Derivative.', 'Turunan.')), <Tex src={dec(`f'(x)=${toTex(first.mono.df)}`)} />)}
            {stepP(
              3,
              tc(L('Critical points.', 'Titik kritis.')),
              crit.length
                ? crit.map((q) => `x = ${four(clean(Number(q.x.toFixed(4))), sep)}: ${q.verdict === 'min' ? tc(L('local minimum', 'minimum lokal')) : q.verdict === 'max' ? tc(L('local maximum', 'maksimum lokal')) : tc(L('no extreme value', 'bukan ekstrem'))}${q.verdict === 'none' ? '' : `, f = ${four(q.fx, sep)}`}`).join('; ') + '.'
                : tc(L('None in the window.', 'Tidak ada di jendela.')),
            )}
            {stepP(
              4,
              tc(L('Increasing and decreasing.', 'Naik dan turun.')),
              s.branches.map((br) => br.mono.runs.filter((q) => q.trend !== 'flat').map((q) => `${q.trend === 'up' ? tc(L('rises', 'naik')) : tc(L('falls', 'turun'))} ${tc(L('on', 'pada'))} [${four(Number(q.lo.toFixed(3)), sep)}, ${four(Number(q.hi.toFixed(3)), sep)}]`).join('; ')).filter(Boolean).join(' | ') + '.',
            )}
            {stepP(
              5,
              tc(L('Inflection points and concavity.', 'Titik belok dan kecekungan.')),
              `${infl.length ? infl.map((q) => `(${four(clean(Number(q.x.toFixed(4))), sep)}, ${four(clean(q.y), sep)})`).join(', ') : tc(L('no point of inflection', 'tidak ada titik belok'))}; ${s.branches.map((br) => br.conc.runs.map((q) => `${q.bend === 'up' ? tc(L('up', 'atas')) : q.bend === 'down' ? tc(L('down', 'bawah')) : tc(L('straight', 'lurus'))}`).join(' → ')).join(' | ')}.`,
            )}
            {stepP(
              6,
              tc(L('Asymptotes.', 'Asimtot.')),
              `${[
                ...s.breaks.filter((k) => k.vertical).map((k) => `x = ${four(clean(Number(k.x.toFixed(2))), sep)} (${tc(L('vertical', 'tegak'))})`),
                ...asyms.map((z) => (z.kind === 'horizontal' ? `y = ${four(z.b, sep)} (${tc(L('horizontal', 'mendatar'))})` : `y = ${four(z.m, sep)}x ${z.b < 0 ? '−' : '+'} ${four(Math.abs(z.b), sep)} (${tc(L('oblique', 'miring'))})`)),
              ].join('; ') || tc(L('none', 'tidak ada'))}.`,
            )}
            {stepP(
              7,
              tc(L('Key points.', 'Titik penting.')),
              `${s.yIntercept !== null ? `${tc(L('y-intercept', 'perpotongan sumbu y'))} ${four(s.yIntercept, sep)}; ` : ''}${s.xIntercepts.length ? `${tc(L('x-intercepts', 'perpotongan sumbu x'))} ${where(s.xIntercepts)}` : tc(L('no x-intercept in the window', 'tidak ada perpotongan sumbu x di jendela'))}.`,
            )}
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="sketchtool">
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
        {SKETCH_PRESETS.map((q) => (
          <button key={q.src} className="chip ghost" onClick={() => { setSrc(q.src); setAStr(aText(q.a)); setBStr(aText(q.b)) }}>
            <Tex src={exprTex(q.src)} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}
