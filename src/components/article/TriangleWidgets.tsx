import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { parseRational } from '../../lib/realnum'
import { ratMul } from '../../lib/rationals'
import { fromPoints, fromSides, isTriangle, rat, solveAAS, solveASA, solveSAS, solveSSA, solveSSS, sqrtParts, type ByAngles, type BySides, type Pt, type Rat, type Solved } from '../../lib/triangle'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const num = (r: Rat): number => Number(r.n) / Number(r.d)
const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const par = (r: Rat): string => (r.n < 0n || r.d !== 1n ? `\\left(${ratTex(r)}\\right)` : ratTex(r))
const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 9999n && r.d <= 99n
const LETTERS = ['A', 'B', 'C']

/** k√m for √r, exactly. */
function rootTex(r: Rat): string {
  const { k, m } = sqrtParts(r)
  if (k.n === 0n) return '0'
  if (m === 1n) return ratTex(k)
  return k.n === 1n && k.d === 1n ? `\\sqrt{${m}}` : `${ratTex(k)}\\sqrt{${m}}`
}

const SIDES: Record<BySides, Loc> = {
  equilateral: L('equilateral', 'sama sisi'),
  isosceles: L('isosceles', 'sama kaki'),
  scalene: L('scalene', 'sembarang'),
}
const ANGLES: Record<ByAngles, Loc> = {
  acute: L('acute', 'lancip'),
  right: L('right', 'siku-siku'),
  obtuse: L('obtuse', 'tumpul'),
}

interface Shape {
  /** Vertices in the plane, floating point. */
  pts: [number, number][]
  /** Extra things to draw: circles, dots, a line. */
  circles?: { cx: number; cy: number; r: number }[]
  dots?: { x: number; y: number; label: string }[]
  lines?: { from: [number, number]; to: [number, number] }[]
}

/** A triangle drawn to scale with optional circles, labeled dots and lines. */
function TriSvg({ shape, label }: { shape: Shape; label: string }) {
  const all = [...shape.pts, ...(shape.dots ?? []).map((d) => [d.x, d.y] as [number, number])]
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const wx = Math.max(...xs) - minX || 1
  const wy = Math.max(...ys) - minY || 1
  const W = 340
  const H = 250
  const pad = 36
  const sc = Math.min((W - 2 * pad) / wx, (H - 2 * pad) / wy)
  const px = (x: number) => (W - wx * sc) / 2 + (x - minX) * sc
  const py = (y: number) => H - ((H - wy * sc) / 2 + (y - minY) * sc)
  const s = shape.pts.map(([x, y]) => [px(x), py(y)])
  const cx = (s[0][0] + s[1][0] + s[2][0]) / 3
  const cy = (s[0][1] + s[1][1] + s[2][1]) / 3
  const path = s.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ' Z'
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="quadsvg" role="img" aria-label={label}>
      {(shape.circles ?? []).map((c, i) => (
        <circle key={i} cx={px(c.cx)} cy={py(c.cy)} r={c.r * sc} className="tricirc" />
      ))}
      <path d={path} className="quadfill" />
      {(shape.lines ?? []).map((l, i) => (
        <line key={i} x1={px(l.from[0])} y1={py(l.from[1])} x2={px(l.to[0])} y2={py(l.to[1])} className="quaddiag" />
      ))}
      {s.map((p, i) => {
        const dx = p[0] - cx
        const dy = p[1] - cy
        const len = Math.hypot(dx, dy) || 1
        return (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={3.5} className="quaddot" />
            <text x={p[0] + (dx / len) * 15} y={p[1] + (dy / len) * 15 + 4} textAnchor="middle" className="quadlabel">
              {LETTERS[i]}
            </text>
          </g>
        )
      })}
      {(shape.dots ?? []).map((d, i) => (
        <g key={i}>
          <circle cx={px(d.x)} cy={py(d.y)} r={3.5} className="tridot" />
          <text x={px(d.x) + 9} y={py(d.y) - 7} className="quadlabel tripoint">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Field({ label, value, set, width = '5em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/** Place a triangle with sides a = BC, b = CA, c = AB on the plane: A at the origin, B on the x axis. */
function place(a: number, b: number, c: number): [number, number][] {
  const x = (b * b + c * c - a * a) / (2 * c)
  return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]]
}

const f1 = (x: number, sep: string): string => dec((Math.round(x * 10) / 10).toString(), sep)
const f3 = (x: number, sep: string): string => dec((Math.round(x * 1000) / 1000).toString(), sep)

/* ------------------------------------------------- can three lengths make one? */

const CHECK_PRESETS: [string, string, string][] = [['3', '4', '5'], ['5', '5', '5'], ['5', '5', '6'], ['5', '5', '8'], ['2', '3', '4'], ['13', '14', '15'], ['1', '2', '3'], ['4', '5', '10']]

export function TriangleCheck() {
  const { tc } = useI18n()
  const sep = useSep()
  const [vals, setVals] = useState<string[]>(['13', '14', '15'])
  const set = (i: number, v: string) => setVals((p) => p.map((x, j) => (j === i ? v : x)))
  const p = vals.map((v) => parseRational(v))
  const ok = p.every(small) && p.every((x) => x!.n > 0n)

  let body
  if (!ok) body = <p className="noline">{tc(L('Type three positive numbers or fractions such as 3, 4.5 or 7/2.', 'Ketik tiga bilangan atau pecahan positif seperti 3, 4,5, atau 7/2.'))}</p>
  else {
    const [a, b, c] = p as [Rat, Rat, Rat]
    const names = ['a', 'b', 'c']
    const vs = [a, b, c]
    if (!isTriangle(a, b, c)) {
      // The longest side is at least the sum of the other two.
      const idx = vs.map(num).indexOf(Math.max(...vs.map(num)))
      const others = vs.filter((_, i) => i !== idx)
      const sum = others[0].n * others[1].d + others[1].n * others[0].d
      const sumR = rat(sum, others[0].d * others[1].d)
      body = (
        <>
          <p className="noline">{tc(L('No triangle has these side lengths: the longest side must be shorter than the sum of the other two.', 'Tidak ada segitiga dengan panjang sisi ini: sisi terpanjang harus lebih pendek daripada jumlah dua sisi lainnya.'))}</p>
          <p>
            <Tex src={`${names[idx]}=${ratTex(vs[idx])}\\ \\not<\\ ${names.filter((_, i) => i !== idx).join('+')}=${ratTex(sumR)}`} />
          </p>
        </>
      )
    } else {
      const r = fromSides(a, b, c)!
      const sorted = [...vs].sort((x, y) => num(x) - num(y))
      const [x, y, z] = sorted
      const zz = ratMul(z, z)
      const xy = rat(x.n * x.n * y.d * y.d + y.n * y.n * x.d * x.d, x.d * x.d * y.d * y.d)
      const verdict = r.kinds.angles === 'right' ? '=' : r.kinds.angles === 'acute' ? '<' : '>'
      const K = Math.sqrt(num(r.areaSq))
      body = (
        <>
          <TriSvg shape={{ pts: place(num(a), num(b), num(c)) }} label={tc(L('The triangle drawn to scale', 'Segitiga digambar dengan skala'))} />
          <p className="okline">
            <b>
              {tc(SIDES[r.kinds.sides])}, {tc(ANGLES[r.kinds.angles])}
            </b>{' '}
            {tc(L('triangle', 'segitiga'))}
          </p>
          <p className="small muted">
            {tc(L('Compare the square of the longest side with the sum of the squares of the others:', 'Bandingkan kuadrat sisi terpanjang dengan jumlah kuadrat sisi lainnya:'))}
          </p>
          <p>
            <Tex src={`${par(z)}^2=${ratTex(zz)}\\ ${verdict}\\ ${par(x)}^2+${par(y)}^2=${ratTex(xy)}`} />
          </p>
          <ul className="steps">
            <li>
              {tc(L('Perimeter', 'Keliling'))} = <Tex src={ratTex(r.perimeter)} />, {tc(L('semiperimeter', 'setengah keliling'))} s = <Tex src={ratTex(r.s)} />
            </li>
            <li>
              {tc(L('Area (Heron)', 'Luas (Heron)'))}: <Tex src={`K^2=s(s-a)(s-b)(s-c)=${ratTex(r.areaSq)}`} /> , K = <Tex src={rootTex(r.areaSq)} /> ≈ {f3(K, sep)}
            </li>
            <li>
              {tc(L('Inradius', 'Jari-jari lingkaran dalam'))} r = K/s = <Tex src={rootTex(r.inradiusSq)} /> ≈ {f3(Math.sqrt(num(r.inradiusSq)), sep)} · {tc(L('circumradius', 'jari-jari lingkaran luar'))} R = abc/(4K) = <Tex src={rootTex(r.circumradiusSq)} /> ≈ {f3(Math.sqrt(num(r.circumradiusSq)), sep)}
            </li>
            <li>
              {tc(L('Angles', 'Sudut'))}: ∠A ≈ {f1(r.angles[0], sep)}°, ∠B ≈ {f1(r.angles[1], sep)}°, ∠C ≈ {f1(r.angles[2], sep)}°
            </li>
          </ul>
        </>
      )
    }
  }

  return (
    <Frame name="tricheck">
      <div className="inrow">
        <Field label={tc(L('side a', 'sisi a'))} value={vals[0]} set={(v) => set(0, v)} />
        <Field label={tc(L('side b', 'sisi b'))} value={vals[1]} set={(v) => set(1, v)} />
        <Field label={tc(L('side c', 'sisi c'))} value={vals[2]} set={(v) => set(2, v)} />
      </div>
      <div className="chips">
        {CHECK_PRESETS.map((pr) => (
          <button key={pr.join()} className="chip ghost" onClick={() => setVals(pr)}>
            {pr.join(', ')}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* --------------------------------------------------- centers from coordinates */

const CENTER_PRESETS: { label: Loc; pts: [number, number][] }[] = [
  { label: L('right', 'siku-siku'), pts: [[0, 0], [6, 0], [0, 8]] },
  { label: L('acute', 'lancip'), pts: [[0, 0], [8, 0], [3, 6]] },
  { label: L('obtuse', 'tumpul'), pts: [[0, 0], [8, 0], [11, 2]] },
  { label: L('isosceles', 'sama kaki'), pts: [[0, 0], [8, 0], [4, 7]] },
  { label: L('collinear', 'segaris'), pts: [[0, 0], [2, 2], [5, 5]] },
]

export function TriangleCenters() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const fmt = (n: number) => (lang === 'id' ? String(n).replace('.', ',') : String(n))
  const [vals, setVals] = useState<string[]>(CENTER_PRESETS[1].pts.flatMap(([x, y]) => [fmt(x), fmt(y)]))
  const parsed = vals.map((v) => parseRational(v))
  const ok = parsed.every(small)

  let body
  if (!ok) body = <p className="noline">{tc(L('Type a number or a fraction such as 3, -1.5 or 7/2 in every box (absolute value up to 9999).', 'Ketik bilangan atau pecahan seperti 3, -1,5, atau 7/2 di setiap kotak (nilai mutlak sampai 9999).'))}</p>
  else {
    const P: Pt[] = [0, 1, 2].map((i) => ({ x: parsed[2 * i] as Rat, y: parsed[2 * i + 1] as Rat }))
    const r = fromPoints(P[0], P[1], P[2])
    const flat: [number, number][] = P.map((q) => [num(q.x), num(q.y)])
    if (!r)
      body = (
        <>
          <TriSvg shape={{ pts: flat }} label={tc(L('Three points', 'Tiga titik'))} />
          <p className="noline">{tc(L('These three points lie on one line (or two coincide), so they do not form a triangle.', 'Ketiga titik ini terletak pada satu garis (atau dua titik berimpit), sehingga tidak membentuk segitiga.'))}</p>
        </>
      )
    else {
      const O = r.circumcenter
      const G = r.centroid
      const H = r.orthocenter
      const xy = (q: Pt) => `\\left(${ratTex(q.x)},\\,${ratTex(q.y)}\\right)`
      const same = (u: Pt, v: Pt) => u.x.n * v.x.d === v.x.n * u.x.d && u.y.n * v.y.d === v.y.n * u.y.d
      const equilateralLike = same(O, H)
      const Rr = Math.sqrt(num(r.circumradiusSq))
      const span = Math.max(...flat.map((q) => Math.hypot(q[0] - num(G.x), q[1] - num(G.y))))
      body = (
        <>
          <TriSvg
            label={tc(L('The triangle with its centers', 'Segitiga dengan titik-titik pentingnya'))}
            shape={{
              pts: flat,
              circles: [
                ...(Rr <= 4 * span ? [{ cx: num(O.x), cy: num(O.y), r: Rr }] : []),
                { cx: r.incenter[0], cy: r.incenter[1], r: r.inradius },
              ],
              dots: [
                { x: num(G.x), y: num(G.y), label: 'G' },
                { x: num(O.x), y: num(O.y), label: 'O' },
                { x: num(H.x), y: num(H.y), label: 'H' },
                { x: r.incenter[0], y: r.incenter[1], label: 'I' },
              ],
              lines: equilateralLike ? [] : [{ from: [num(O.x), num(O.y)], to: [num(H.x), num(H.y)] }],
            }}
          />
          <p className="okline">
            <b>
              {tc(SIDES[r.kinds.sides])}, {tc(ANGLES[r.kinds.angles])}
            </b>{' '}
            {tc(L('triangle', 'segitiga'))} · {tc(L('area', 'luas'))} = <b>{dec(num(r.area).toString(), sep)}</b>
          </p>
          <ul className="steps">
            <li>
              <b>G</b> {tc(L('centroid (medians)', 'titik berat (garis berat)'))}: <Tex src={xy(G)} />
            </li>
            <li>
              <b>O</b> {tc(L('circumcenter (perpendicular bisectors)', 'pusat lingkaran luar (sumbu sisi)'))}: <Tex src={xy(O)} />, R = <Tex src={rootTex(r.circumradiusSq)} /> ≈ {f3(Rr, sep)}
            </li>
            <li>
              <b>H</b> {tc(L('orthocenter (altitudes)', 'titik tinggi (garis tinggi)'))}: <Tex src={xy(H)} />
            </li>
            <li>
              <b>I</b> {tc(L('incenter (angle bisectors)', 'pusat lingkaran dalam (garis bagi sudut)'))} ≈ ({f3(r.incenter[0], sep)}; {f3(r.incenter[1], sep)}), r ≈ {f3(r.inradius, sep)}
            </li>
          </ul>
          <p className="small muted">
            {equilateralLike
              ? tc(L('O, G and H coincide: the triangle is equilateral.', 'O, G, dan H berimpit: segitiganya sama sisi.'))
              : tc(L('O, G and H lie on one line, the Euler line (dashed), and G is one third of the way from O to H.', 'O, G, dan H terletak pada satu garis, garis Euler (putus-putus), dan G berada sepertiga dari O menuju H.'))}
          </p>
        </>
      )
    }
  }

  const set = (i: number, v: string) => setVals((p) => p.map((x, j) => (j === i ? v : x)))
  return (
    <Frame name="tripoints">
      <div className="quadpts">
        {LETTERS.map((l, i) => (
          <div key={l} className="inrow">
            <b className="quadvertex">{l}</b>
            <Field label="x" value={vals[2 * i]} set={(v) => set(2 * i, v)} />
            <Field label="y" value={vals[2 * i + 1]} set={(v) => set(2 * i + 1, v)} />
          </div>
        ))}
      </div>
      <div className="chips">
        {CENTER_PRESETS.map((p) => (
          <button key={p.label.en} className="chip ghost" onClick={() => setVals(p.pts.flatMap(([x, y]) => [fmt(x), fmt(y)]))}>
            {tc(p.label)}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------ solve a triangle */

type Mode = 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'SSA'
const MODES: { id: Mode; label: Loc; fields: { key: string; label: Loc }[]; preset: string[]; more: string[][] }[] = [
  { id: 'SSS', label: L('3 sides (SSS)', '3 sisi (SSS)'), fields: [{ key: 'a', label: L('side a', 'sisi a') }, { key: 'b', label: L('side b', 'sisi b') }, { key: 'c', label: L('side c', 'sisi c') }], preset: ['7', '8', '9'], more: [['3', '4', '5'], ['5', '5', '5'], ['2', '3', '6']] },
  { id: 'SAS', label: L('2 sides and the angle between (SAS)', '2 sisi dan sudut apit (SAS)'), fields: [{ key: 'a', label: L('side a', 'sisi a') }, { key: 'C', label: L('angle C (°)', 'sudut C (°)') }, { key: 'b', label: L('side b', 'sisi b') }], preset: ['5', '60', '8'], more: [['3', '90', '4'], ['10', '120', '10']] },
  { id: 'ASA', label: L('2 angles and the side between (ASA)', '2 sudut dan sisi apit (ASA)'), fields: [{ key: 'A', label: L('angle A (°)', 'sudut A (°)') }, { key: 'c', label: L('side c', 'sisi c') }, { key: 'B', label: L('angle B (°)', 'sudut B (°)') }], preset: ['40', '10', '70'], more: [['45', '8', '45'], ['100', '5', '80']] },
  { id: 'AAS', label: L('2 angles and a side opposite one (AAS)', '2 sudut dan sisi di depan salah satunya (AAS)'), fields: [{ key: 'A', label: L('angle A (°)', 'sudut A (°)') }, { key: 'B', label: L('angle B (°)', 'sudut B (°)') }, { key: 'a', label: L('side a', 'sisi a') }], preset: ['30', '70', '6'], more: [['45', '60', '10']] },
  { id: 'SSA', label: L('2 sides and an angle opposite one (SSA)', '2 sisi dan sudut di depan salah satunya (SSA)'), fields: [{ key: 'a', label: L('side a', 'sisi a') }, { key: 'b', label: L('side b', 'sisi b') }, { key: 'A', label: L('angle A (°)', 'sudut A (°)') }], preset: ['3', '5', '30'], more: [['7', '5', '30'], ['2.5', '5', '30'], ['2', '5', '30']] },
]

function solveMode(mode: Mode, v: number[]): Solved[] {
  const [x, y, z] = v
  const one = (s: Solved | null): Solved[] => (s ? [s] : [])
  switch (mode) {
    case 'SSS':
      return one(solveSSS(x, y, z))
    case 'SAS':
      return one(solveSAS(x, y, z))
    case 'ASA':
      return one(solveASA(x, y, z))
    case 'AAS':
      return one(solveAAS(x, y, z))
    case 'SSA':
      return solveSSA(x, y, z)
  }
}

export function TriangleSolver() {
  const { tc } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<Mode>('SSA')
  const m = MODES.find((x) => x.id === mode)!
  const [vals, setVals] = useState<string[]>(MODES[4].preset)
  const pick = (md: Mode) => {
    setMode(md)
    setVals(MODES.find((x) => x.id === md)!.preset)
  }
  const nums = vals.map((v) => parseRational(v)).map((r) => (r === null ? NaN : num(r)))
  const bad = nums.some((n) => !Number.isFinite(n) || n <= 0 || n > 1e6)
  const angleBad = m.fields.some((f, i) => f.key === f.key.toUpperCase() && (nums[i] <= 0 || nums[i] >= 180))
  const sols = bad || angleBad ? [] : solveMode(mode, nums)

  let body
  if (bad || angleBad) body = <p className="noline">{tc(L('Type positive numbers; angles must be between 0 and 180 degrees.', 'Ketik bilangan positif; sudut harus di antara 0 dan 180 derajat.'))}</p>
  else if (sols.length === 0)
    body = (
      <p className="noline">
        {mode === 'SSA'
          ? tc(L('No triangle: side a is too short to reach the opposite side (sin B would have to be more than 1).', 'Tidak ada segitiga: sisi a terlalu pendek untuk mencapai sisi di depannya (sin B harus lebih dari 1).'))
          : mode === 'SSS'
            ? tc(L('No triangle: the longest side must be shorter than the sum of the other two.', 'Tidak ada segitiga: sisi terpanjang harus lebih pendek daripada jumlah dua sisi lainnya.'))
            : tc(L('No triangle: the angles must add up to less than 180 degrees.', 'Tidak ada segitiga: jumlah sudutnya harus kurang dari 180 derajat.'))}
      </p>
    )
  else
    body = (
      <>
        {mode === 'SSA' && (
          <p className="okline">
            {sols.length === 2
              ? tc(L('Two triangles fit these measurements (the ambiguous case): angle B can be acute or obtuse.', 'Dua segitiga cocok dengan ukuran ini (kasus ambigu): sudut B dapat lancip atau tumpul.'))
              : tc(L('Exactly one triangle fits these measurements.', 'Tepat satu segitiga cocok dengan ukuran ini.'))}
          </p>
        )}
        {sols.map((s, i) => (
          <div key={i}>
            <TriSvg shape={{ pts: [[0, 0], [s.c, 0], [s.b * Math.cos((s.A * Math.PI) / 180), s.b * Math.sin((s.A * Math.PI) / 180)]] }} label={tc(L('The solved triangle', 'Segitiga yang dipecahkan'))} />
            <div className="gridwrap">
              <table className="rtable">
                <tbody>
                  <tr>
                    <th>{tc(L('Sides', 'Sisi'))}</th>
                    <td>a = {f3(s.a, sep)}</td>
                    <td>b = {f3(s.b, sep)}</td>
                    <td>c = {f3(s.c, sep)}</td>
                  </tr>
                  <tr>
                    <th>{tc(L('Angles', 'Sudut'))}</th>
                    <td>A = {f3(s.A, sep)}°</td>
                    <td>B = {f3(s.B, sep)}°</td>
                    <td>C = {f3(s.C, sep)}°</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </>
    )

  return (
    <Frame name="trisolve">
      <div className="chips">
        {MODES.map((x) => (
          <button key={x.id} className={`chip ${x.id === mode ? 'on' : ''}`} onClick={() => pick(x.id)} aria-pressed={x.id === mode}>
            {x.id}
          </button>
        ))}
      </div>
      <p className="small muted">{tc(m.label)}</p>
      <div className="inrow">
        {m.fields.map((f, i) => (
          <Field key={f.key} label={tc(f.label)} value={vals[i]} set={(s) => setVals((p) => p.map((x, j) => (j === i ? s : x)))} width="5.5em" />
        ))}
      </div>
      <div className="chips">
        {[m.preset, ...m.more].map((pr) => (
          <button key={pr.join()} className="chip ghost" onClick={() => setVals(pr.map((x) => (sep === ',' ? x.replace('.', ',') : x)))}>
            {pr.map((x) => (sep === ',' ? x.replace('.', ',') : x)).join(' · ')}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

