import { useState, type ReactElement } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { criticalAngle, generalPrism, inscribedAreaRatio, minDeviation, prismCounts, prismDeviation, prismInCircle, regularBase, rightPrism, type P2 } from '../../lib/prism'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark. */
function fmt(x: number, sep: string, digits = 2): string {
  if (!Number.isFinite(x)) return '–'
  return (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace('.', sep)
}
/** The same without trailing zeros. */
function short(x: number, sep: string, digits = 2): string {
  if (!Number.isFinite(x)) return '–'
  return Number((Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)).toString().replace('.', sep)
}

/** The regular n-gon of side s with one side facing the viewer (at the front, y < 0), corners in counter-clockwise order. */
function frontPolygon(n: number, s: number): P2[] {
  const R = regularBase(n, s).circumradius
  return Array.from({ length: n }, (_, k): P2 => {
    const t = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n
    return [R * Math.cos(t), R * Math.sin(t)]
  })
}

const NAMES: Record<number, Loc> = {
  3: L('triangular prism', 'prisma segitiga'),
  4: L('square prism', 'prisma persegi'),
  5: L('pentagonal prism', 'prisma segilima'),
  6: L('hexagonal prism', 'prisma segienam'),
  8: L('octagonal prism', 'prisma segidelapan'),
}

/* ------------------------------------------------------------------------ build a prism */

/** A prism seen from the front and above: x to the right, z up, y going back and up the screen. A lateral face shows when its outward normal points to the viewer. */
function PrismPicture({ n, s, h, lean, label }: { n: number; s: number; h: number; lean: number; label: string }) {
  const base = frontPolygon(n, s)
  const U = (x: number, y: number, z: number): [number, number] => [x, z + 0.4 * y]
  const bottom = base.map(([x, y]) => U(x, y, 0))
  const top = base.map(([x, y]) => U(x + lean, y, h))
  const all = [...bottom, ...top]
  const x0 = Math.min(...all.map((p) => p[0]))
  const x1 = Math.max(...all.map((p) => p[0]))
  const y0 = Math.min(...all.map((p) => p[1]))
  const y1 = Math.max(...all.map((p) => p[1]))
  const size = 240
  const pad = 18
  const k = (size - 2 * pad) / Math.max(x1 - x0, y1 - y0, 1e-9)
  const ox = pad + (size - 2 * pad - (x1 - x0) * k) / 2
  const oy = size - pad - (size - 2 * pad - (y1 - y0) * k) / 2
  const S = (p: [number, number]): [number, number] => [ox + (p[0] - x0) * k, oy - (p[1] - y0) * k]
  const visible = base.map(([ax, ay], i) => {
    const [bx, by] = base[(i + 1) % n]
    const dx = bx - ax
    const dy = by - ay
    return dx * h - 0.4 * dy * lean > 1e-9
  })
  const pts = (arr: [number, number][]) => arr.map((p) => S(p).map((v) => v.toFixed(1)).join(',')).join(' ')
  const lines: { a: [number, number]; b: [number, number]; hidden: boolean }[] = []
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const prev = (i + n - 1) % n
    lines.push({ a: bottom[i], b: bottom[j], hidden: !visible[i] })
    lines.push({ a: top[i], b: top[j], hidden: false })
    lines.push({ a: bottom[i], b: top[i], hidden: !(visible[i] || visible[prev]) })
  }
  const frontFaces = base.map((_, i) => i).filter((i) => visible[i])
  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 280, display: 'block', margin: '6px auto' }}>
      {frontFaces.map((i) => (
        <polygon key={`f${i}`} points={pts([bottom[i], bottom[(i + 1) % n], top[(i + 1) % n], top[i]])} fill="var(--brand)" fillOpacity={0.12} />
      ))}
      <polygon points={pts(top)} fill="var(--gold)" fillOpacity={0.22} />
      {lines.map((l, i) => {
        const [x1p, y1p] = S(l.a)
        const [x2p, y2p] = S(l.b)
        return <line key={i} x1={x1p} y1={y1p} x2={x2p} y2={y2p} stroke="var(--text)" strokeWidth={l.hidden ? 1 : 2} strokeDasharray={l.hidden ? '4 4' : undefined} strokeLinecap="round" />
      })}
    </svg>
  )
}

export function PrismBuild() {
  const { tc, lang } = useI18n()
  const id = lang === 'id'
  const sep = useSep()
  const [n, setN] = useState(6)
  const [s, setS] = useState(2)
  const [h, setH] = useState(5)
  const [lean, setLean] = useState(0)
  const base = frontPolygon(n, s)
  const g = generalPrism(base, [lean, 0, h])
  const straight = generalPrism(base, [0, 0, h])
  const r = rightPrism(n, s, h)
  const c = prismCounts(n)
  const slider = (name: string, v: number, set: (x: number) => void, min: number, max: number, step: number) => (
    <label className="lbl slider">
      {name} = <b>{short(v, sep)}</b>
      <input type="range" min={min} max={max} step={step} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )
  const label = `${tc(NAMES[n])}${lean > 0 ? tc(L(', leaning', ', miring')) : ''}: ${tc(L('volume', 'volume'))} ${fmt(g.volume, sep, 2)}, ${tc(L('surface', 'luas permukaan'))} ${fmt(g.surface, sep, 2)}`
  return (
    <Frame name="prbuild">
      <div className="chips">
        {[3, 4, 5, 6, 8].map((k) => (
          <button key={k} className={`chip ghost ${n === k ? 'on' : ''}`} aria-pressed={n === k} onClick={() => setN(k)}>
            {tc(NAMES[k])}
          </button>
        ))}
      </div>
      {slider(tc(L('side of the base s', 'sisi alas s')), s, setS, 1, 6, 0.5)}
      {slider(tc(L('height h', 'tinggi t')), h, setH, 1, 10, 0.5)}
      {slider(tc(L('lean (how far the top slides sideways)', 'miring (seberapa jauh atas bergeser ke samping)')), lean, setLean, 0, 8, 0.5)}
      <PrismPicture n={n} s={s} h={h} lean={lean} label={label} />
      <div className="wgtout" aria-live="polite">
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <td>{tc(L('base: area and perimeter', 'alas: luas dan keliling'))}</td>
                <td>
                  <b>{fmt(g.baseArea, sep, 3)}</b> · <b>{fmt(g.perimeter, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('volume, base times height', 'volume, alas kali tinggi'))}</td>
                <td>
                  <Tex src={id ? 'V=L_a\\,t' : 'V=Bh'} /> = <b>{fmt(g.volume, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('lateral area', 'luas selimut'))}</td>
                <td>
                  {lean === 0 ? <Tex src={id ? 'Kt' : 'Ph'} /> : <Tex src={id ? 'K_s\\,e' : 'P_s\\,e'} />} = <b>{fmt(g.lateral, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('surface area', 'luas permukaan'))}</td>
                <td>
                  <Tex src={id ? '2L_a+L_s' : '2B+L'} /> = <b>{fmt(g.surface, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('corners, edges, faces', 'titik sudut, rusuk, sisi'))}</td>
                <td>
                  <b>{c.V}</b> · <b>{c.E}</b> · <b>{c.F}</b> {tc(L('so', 'jadi'))} {c.V} − {c.E} + {c.F} = <b>{c.chi}</b>
                </td>
              </tr>
              {lean === 0 && (
                <tr>
                  <td>{tc(L('diagonal of a side face', 'diagonal sisi tegak'))}</td>
                  <td>
                    <Tex src={id ? '\\sqrt{s^2+t^2}' : '\\sqrt{s^2+h^2}'} /> = <b>{fmt(r.faceDiagonal, sep, 3)}</b>
                  </td>
                </tr>
              )}
              {lean === 0 && (
                <tr>
                  <td>{tc(L('space diagonals', 'diagonal ruang'))}</td>
                  <td>{r.spaceDiagonals.length ? r.spaceDiagonals.map((d) => fmt(d, sep, 3)).join(' · ') : tc(L('none: every pair of corners shares a face', 'tidak ada: setiap dua titik sudut berbagi sebuah sisi'))}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {lean > 0 ? (
          <p className="okline" style={{ overflowWrap: 'anywhere' }}>
            {tc(L('The prism leans, and its volume did not change:', 'Prisma itu miring, dan volumenya tidak berubah:'))} {fmt(straight.volume, sep, 3)} → {fmt(g.volume, sep, 3)}.{' '}
            {tc(L('Its lateral area grew from', 'Luas selimutnya bertambah dari'))} {fmt(straight.lateral, sep, 3)} {tc(L('to', 'menjadi'))} {fmt(g.lateral, sep, 3)}, {tc(L('because the side faces became slanted parallelograms.', 'karena sisi tegaknya menjadi jajar genjang yang miring.'))}
          </p>
        ) : (
          <p className="small muted">{tc(L('Move the lean slider to tilt the prism: the volume stays the same, the lateral area does not.', 'Geser penggeser miring untuk memiringkan prisma: volume tetap sama, luas selimut tidak.'))}</p>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------- net */

export function PrismNet() {
  const { tc, lang } = useI18n()
  const id = lang === 'id'
  const sep = useSep()
  const [n, setN] = useState(5)
  const [s, setS] = useState(2)
  const [h, setH] = useState(4)
  const b = regularBase(n, s)
  const R = b.circumradius
  const a = b.apothem
  const polygon = (cx: number, cy: number, flip: 1 | -1): [number, number][] =>
    Array.from({ length: n }, (_, k) => {
      const t = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n
      return [cx + R * Math.cos(t), cy + flip * R * Math.sin(t)] as [number, number]
    })
  // the strip of n rectangles runs along y in [0, h]; one base hangs below the first rectangle and the other stands above it
  const lower = polygon(s / 2, -a, -1)
  const upper = polygon(s / 2, h + a, 1)
  const xs = [0, n * s, ...lower.map((p) => p[0]), ...upper.map((p) => p[0])]
  const ys = [0, h, ...lower.map((p) => p[1]), ...upper.map((p) => p[1])]
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const W = 320
  const H = 240
  const pad = 14
  const k = Math.min((W - 2 * pad) / (x1 - x0), (H - 2 * pad) / (y1 - y0))
  const ox = (W - (x1 - x0) * k) / 2
  const oy = (H - (y1 - y0) * k) / 2
  const X = (x: number) => ox + (x - x0) * k
  const Y = (y: number) => H - oy - (y - y0) * k
  const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')
  const p = rightPrism(n, s, h)
  const slider = (name: string, v: number, set: (x: number) => void, min: number, max: number, step: number) => (
    <label className="lbl slider">
      {name} = <b>{short(v, sep)}</b>
      <input type="range" min={min} max={max} step={step} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )
  return (
    <Frame name="prnet">
      <div className="chips">
        {[3, 4, 5, 6, 8].map((m) => (
          <button key={m} className={`chip ghost ${n === m ? 'on' : ''}`} aria-pressed={n === m} onClick={() => setN(m)}>
            {tc(NAMES[m])}
          </button>
        ))}
      </div>
      {slider(tc(L('side of the base s', 'sisi alas s')), s, setS, 1, 4, 0.5)}
      {slider(tc(L('height h', 'tinggi t')), h, setH, 1, 8, 0.5)}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${tc(L('Net of a', 'Jaring-jaring'))} ${tc(NAMES[n])}: ${n} ${tc(L('rectangles and two polygons', 'persegi panjang dan dua segi banyak'))}`} style={{ width: '100%', maxWidth: 420, display: 'block', margin: '6px auto' }}>
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={X(i * s)} y={Y(h)} width={s * k} height={h * k} fill="var(--brand)" fillOpacity={0.14} stroke="var(--text)" strokeWidth={1.5} />
        ))}
        <polygon points={poly(lower)} fill="var(--gold)" fillOpacity={0.3} stroke="var(--text)" strokeWidth={1.5} />
        <polygon points={poly(upper)} fill="var(--gold)" fillOpacity={0.3} stroke="var(--text)" strokeWidth={1.5} />
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {tc(L('The strip of side faces is one rectangle', 'Deretan sisi tegak adalah satu persegi panjang'))} {short(n * s, sep)} × {short(h, sep)}: {tc(L('area', 'luas'))} <Tex src={id ? 'Kt' : 'Ph'} /> = <b>{fmt(p.lateral, sep, 3)}</b>.
        </p>
        <p className="small" style={{ overflowWrap: 'anywhere' }}>
          {tc(L('Two bases', 'Dua alas'))} 2 × {fmt(p.baseArea, sep, 3)} = {fmt(2 * p.baseArea, sep, 3)}. {tc(L('Whole net, the surface area:', 'Seluruh jaring-jaring, luas permukaan:'))} <b>{fmt(p.surface, sep, 3)}</b>.
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------ towards the cylinder */

export function PrismCylinder() {
  const { tc } = useI18n()
  const sep = useSep()
  const [n, setN] = useState(6)
  const r = 1
  const h = 2
  const c = prismInCircle(n, r, h)
  const pts = Array.from({ length: n }, (_, k) => {
    const t = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n
    return `${(110 + 90 * Math.cos(t)).toFixed(1)},${(110 + 90 * Math.sin(t)).toFixed(1)}`
  }).join(' ')
  const ratio = inscribedAreaRatio(n)
  return (
    <Frame name="prcyl">
      <div className="chips">
        {[3, 4, 6, 12, 24, 100].map((m) => (
          <button key={m} className={`chip ghost ${n === m ? 'on' : ''}`} aria-pressed={n === m} onClick={() => setN(m)}>
            {m}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        {tc(L('sides of the base n', 'banyak sisi alas n'))} = <b>{n}</b>
        <input type="range" min={3} max={120} step={1} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <svg viewBox="0 0 220 220" role="img" aria-label={`${n} ${tc(L('sided regular polygon inside a circle', 'sisi, segi banyak beraturan di dalam lingkaran'))}`} style={{ width: '100%', maxWidth: 240, display: 'block', margin: '6px auto' }}>
        <circle cx={110} cy={110} r={90} fill="none" stroke="var(--coral)" strokeWidth={2} />
        <polygon points={pts} fill="var(--brand)" fillOpacity={0.2} stroke="var(--text)" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
      <div className="wgtout" aria-live="polite">
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <td>{tc(L('base area as a share of the circle', 'luas alas sebagai bagian dari lingkaran'))}</td>
                <td>
                  <Tex src="\frac{n}{2\pi}\sin\frac{2\pi}{n}" /> = <b>{fmt(ratio * 100, sep, 4)}%</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('volume of the prism, radius 1 and height 2', 'volume prisma, jari-jari 1 dan tinggi 2'))}</td>
                <td>
                  <b>{fmt(c.volume, sep, 5)}</b> {tc(L('of', 'dari'))} <b>{fmt(c.cylinderVolume, sep, 5)}</b> = 2π
                </td>
              </tr>
              <tr>
                <td>{tc(L('surface of the prism', 'luas permukaan prisma'))}</td>
                <td>
                  <b>{fmt(c.surface, sep, 5)}</b> {tc(L('of', 'dari'))} <b>{fmt(c.cylinderSurface, sep, 5)}</b> = 6π
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
          {tc(L('As n grows the prism fills the cylinder: both numbers climb towards the cylinder’s, and they never pass them.', 'Saat n bertambah prisma itu memenuhi tabung: kedua bilangan naik menuju bilangan tabung, dan tidak pernah melewatinya.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------ light in glass */

type V2 = [number, number]
const add = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]]
const sub = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]]
const mul = (a: V2, t: number): V2 => [a[0] * t, a[1] * t]
const dot = (a: V2, b: V2): number => a[0] * b[0] + a[1] * b[1]
const norm = (a: V2): V2 => mul(a, 1 / Math.hypot(a[0], a[1]))

/** Snell's law in vector form: `d` the unit direction of the ray, `N` the unit normal on the side the ray comes from. Null on total internal reflection. */
function refract(d: V2, N: V2, n1: number, n2: number): V2 | null {
  const ci = -dot(N, d)
  const q = n1 / n2
  const k = 1 - q * q * (1 - ci * ci)
  if (k < 0) return null
  return add(mul(d, q), mul(N, q * ci - Math.sqrt(k)))
}

const LIGHT_PRESETS: { name: Loc; A: number; n: number }[] = [
  { name: L('glass, 60°', 'kaca, 60°'), A: 60, n: 1.5 },
  { name: L('water, 60°', 'air, 60°'), A: 60, n: 1.33 },
  { name: L('diamond, 60°', 'berlian, 60°'), A: 60, n: 2.42 },
  { name: L('thin glass wedge, 20°', 'baji kaca tipis, 20°'), A: 20, n: 1.5 },
]

export function PrismLight() {
  const { tc } = useI18n()
  const sep = useSep()
  const [A, setA] = useState(60)
  const [n, setN] = useState(1.5)
  const [i1, setI1] = useState(50)
  const [colors, setColors] = useState(false)
  const nViolet = n + 0.02
  const pass = prismDeviation(A, n, i1)
  const passV = prismDeviation(A, nViolet, i1)
  const dmin = minDeviation(A, n)

  const W = 360
  const H = 215
  // the prism: apex up, base on the floor
  const ph = 130
  const halfBase = ph * Math.tan((A / 2) * (Math.PI / 180))
  const apex: V2 = [W / 2, 30]
  const left: V2 = [W / 2 - halfBase, 30 + ph]
  const right: V2 = [W / 2 + halfBase, 30 + ph]
  const outward = (p: V2, q: V2, inside: V2): V2 => {
    const t = sub(q, p)
    const N = norm([t[1], -t[0]])
    return dot(N, sub(mul(add(p, q), 0.5), inside)) > 0 ? N : mul(N, -1)
  }
  const centre = mul(add(add(apex, left), right), 1 / 3)
  const N1 = outward(left, apex, centre)
  const N2 = outward(apex, right, centre)
  const hit1 = add(left, mul(sub(apex, left), 0.55))
  // the screen y runs down, so a negative angle turns the inward normal counter-clockwise on screen: the ray arrives from below the normal, as in a textbook, and is bent towards the base
  const rotate = (v: V2, deg: number): V2 => {
    const t = (deg * Math.PI) / 180
    return [v[0] * Math.cos(t) - v[1] * Math.sin(t), v[0] * Math.sin(t) + v[1] * Math.cos(t)]
  }
  const d0 = rotate(mul(N1, -1), -i1)

  const trace = (nn: number) => {
    const d1 = refract(d0, N1, 1, nn)
    if (!d1) return null
    // the point where the inner ray meets the second face
    const f = sub(right, apex)
    const m = d1
    const den = m[0] * f[1] - m[1] * f[0]
    if (Math.abs(den) < 1e-9) return null
    const w = sub(apex, hit1)
    const tt = (w[0] * f[1] - w[1] * f[0]) / den
    const uu = (w[0] * m[1] - w[1] * m[0]) / den
    if (tt <= 0 || uu < 0 || uu > 1) return { d1, hit2: null as V2 | null, d2: null as V2 | null, missed: true }
    const hit2 = add(hit1, mul(d1, tt))
    const d2 = refract(d1, mul(N2, -1), nn, 1)
    return { d1, hit2, d2, missed: false }
  }
  const red = trace(n)
  const violet = colors ? trace(nViolet) : null
  const L0 = 150
  const ray = (col: string, nn: number, tr: ReturnType<typeof trace>, key: string) => {
    if (!tr) return null
    const parts: ReactElement[] = []
    const start = sub(hit1, mul(d0, L0))
    parts.push(<line key={`${key}a`} x1={start[0]} y1={start[1]} x2={hit1[0]} y2={hit1[1]} stroke={col} strokeWidth={2.5} />)
    if (tr.hit2) {
      parts.push(<line key={`${key}b`} x1={hit1[0]} y1={hit1[1]} x2={tr.hit2[0]} y2={tr.hit2[1]} stroke={col} strokeWidth={2.5} />)
      if (tr.d2) {
        const end = add(tr.hit2, mul(tr.d2, L0))
        parts.push(<line key={`${key}c`} x1={tr.hit2[0]} y1={tr.hit2[1]} x2={end[0]} y2={end[1]} stroke={col} strokeWidth={2.5} />)
      } else {
        const refl = add(tr.d1, mul(mul(N2, -1), 2 * dot(tr.d1, N2)))
        const end = add(tr.hit2, mul(refl, 60))
        parts.push(<line key={`${key}d`} x1={tr.hit2[0]} y1={tr.hit2[1]} x2={end[0]} y2={end[1]} stroke={col} strokeWidth={2.5} strokeDasharray="5 4" />)
      }
    } else {
      const end = add(hit1, mul(tr.d1, 90))
      parts.push(<line key={`${key}e`} x1={hit1[0]} y1={hit1[1]} x2={end[0]} y2={end[1]} stroke={col} strokeWidth={2.5} strokeDasharray="5 4" />)
    }
    void nn
    return parts
  }
  const slider = (name: string, v: number, set: (x: number) => void, min: number, max: number, step: number, digits = 0) => (
    <label className="lbl slider">
      {name} = <b>{fmt(v, sep, digits)}</b>
      <input type="range" min={min} max={max} step={step} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )
  const outcome = !red ? null : red.missed ? 'missed' : !red.d2 ? 'trapped' : 'out'
  const label = pass
    ? `${tc(L('A ray through a prism of apex angle', 'Sinar melalui prisma bersudut puncak'))} ${A}°: ${tc(L('deviation', 'deviasi'))} ${fmt(pass.D, sep, 1)}°`
    : `${tc(L('A ray in a prism of apex angle', 'Sinar dalam prisma bersudut puncak'))} ${A}°: ${tc(L('it cannot leave the second face', 'ia tak dapat keluar dari sisi kedua'))}`
  return (
    <Frame name="prlight">
      <div className="chips">
        {LIGHT_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ghost ${A === p.A && n === p.n ? 'on' : ''}`}
            aria-pressed={A === p.A && n === p.n}
            onClick={() => {
              setA(p.A)
              setN(p.n)
            }}
          >
            {tc(p.name)}
          </button>
        ))}
        <button className={`chip ghost ${colors ? 'on' : ''}`} aria-pressed={colors} onClick={() => setColors(!colors)}>
          {tc(L('two colors', 'dua warna'))}
        </button>
      </div>
      {slider(tc(L('apex angle A (°)', 'sudut puncak A (°)')), A, setA, 20, 80, 1)}
      {slider(tc(L('refractive index n', 'indeks bias n')), n, setN, 1.2, 2.5, 0.01, 2)}
      {slider(tc(L('angle of incidence i (°)', 'sudut datang i (°)')), i1, setI1, 0, 80, 1)}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 440, display: 'block', margin: '6px auto', overflow: 'visible' }}>
        <polygon points={`${apex[0]},${apex[1]} ${left[0]},${left[1]} ${right[0]},${right[1]}`} fill="var(--brand)" fillOpacity={0.14} stroke="var(--text)" strokeWidth={2} strokeLinejoin="round" />
        {ray(colors ? 'var(--coral)' : 'var(--gold)', n, red, 'r')}
        {violet && ray('var(--brand)', nViolet, violet, 'v')}
      </svg>
      <div className="wgtout" aria-live="polite">
        {outcome === 'out' && pass ? (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              r₁ = {fmt(pass.r1, sep, 2)}°, r₂ = A − r₁ = {fmt(pass.r2, sep, 2)}°, {tc(L('exit angle', 'sudut keluar'))} e = {fmt(pass.e, sep, 2)}°. {tc(L('The ray is turned by', 'Sinar dibelokkan sebesar'))} <Tex src="D=i+e-A" /> = <b>{fmt(pass.D, sep, 2)}°</b>.
              {pass.r2 < 0 && ' ' + tc(L('A negative angle means the ray meets that face on the other side of its normal.', 'Sudut negatif berarti sinar mengenai sisi itu di sisi lain garis normalnya.'))}
            </p>
            {colors && passV && (
              <p className="small" style={{ overflowWrap: 'anywhere' }}>
                {tc(L('The more strongly bent color has n =', 'Warna yang lebih kuat dibelokkan memiliki n ='))} {fmt(nViolet, sep, 2)}: D = {fmt(passV.D, sep, 2)}°. {tc(L('The two colors leave', 'Kedua warna keluar'))} {fmt(Math.abs(passV.D - pass.D), sep, 2)}° {tc(L('apart: white light is spread into a spectrum.', 'terpisah: cahaya putih tersebar menjadi spektrum.'))}
              </p>
            )}
          </>
        ) : outcome === 'trapped' ? (
          <p className="badline" style={{ overflowWrap: 'anywhere' }}>
            {tc(L('Total internal reflection: inside, the ray meets the second face at more than the critical angle', 'Pemantulan sempurna: di dalam, sinar mengenai sisi kedua dengan sudut lebih dari sudut kritis'))} {fmt(criticalAngle(n), sep, 2)}° {tc(L('and is reflected, not refracted.', 'dan dipantulkan, bukan dibiaskan.'))}
          </p>
        ) : (
          <p className="badline">{tc(L('This ray would reach the base of the prism instead of the second face. Change the angle.', 'Sinar ini akan mencapai alas prisma, bukan sisi kedua. Ubah sudutnya.'))}</p>
        )}
        <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
          {dmin === null
            ? tc(L('For this prism n sin(A/2) is at least 1, so no ray can pass symmetrically.', 'Untuk prisma ini n sin(A/2) paling sedikit 1, sehingga tak ada sinar yang dapat melewatinya secara simetris.'))
            : `${tc(L('The smallest turn this prism can give is', 'Belokan terkecil yang dapat diberikan prisma ini adalah'))} ${fmt(dmin, sep, 2)}°, ${tc(L('when the ray crosses symmetrically.', 'bila sinar melintas secara simetris.'))}`}
        </p>
      </div>
    </Frame>
  )
}
