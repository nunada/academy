import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import {
  CONSTRUCT_IDS,
  angleFieldDegree,
  constructiblePolygons,
  isConstructibleDegree,
  isConstructiblePolygon,
  isTrisectable,
  make,
  makeAngle,
  makeDivide,
  neusis,
  polygonFactors,
  recipeFor,
  recipeLines,
  run,
  totient,
  trisectRatio,
  turnDenominator,
  type Built,
  type Claim,
  type ConstructId,
  type Construction,
  type Pt,
  type Step,
} from '../../lib/construct'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark. */
const fmt = (x: number, sep: string, digits = 4): string => x.toFixed(digits).replace('.', sep)

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'

/** `K1` is shown as K₁. */
const show = (name: string): string => name.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)])

/* ------------------------------------------------------------------------------ the picture */

interface Layout {
  vb: [number, number, number, number]
  arcs: Record<number, [number, number] | 'full'>
  segs: Record<number, [Pt, Pt]>
}

/** Where to draw: a circle only as an arc around the points that lie on it, a line only as far as its points and a little more, and a window
 *  around all of it, as a compass and ruler on paper would. Computed from the finished figure so nothing moves while the steps are played. */
function layout(built: Built): Layout {
  const pts = Object.values(built.points)
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  let minx = Math.min(...xs)
  let maxx = Math.max(...xs)
  let miny = Math.min(...ys)
  let maxy = Math.max(...ys)
  const unit = Math.max(maxx - minx, maxy - miny, 1e-6) / 20
  const arcs: Layout['arcs'] = {}
  const segs: Layout['segs'] = {}
  const grow = (p: Pt): void => {
    minx = Math.min(minx, p.x)
    maxx = Math.max(maxx, p.x)
    miny = Math.min(miny, p.y)
    maxy = Math.max(maxy, p.y)
  }
  const MARGIN = 0.24
  built.objects.forEach((o, i) => {
    if (o.kind === 'circle') {
      const on = Object.values(built.points)
        .filter((p) => Math.abs(Math.hypot(p.x - o.center.x, p.y - o.center.y) - o.r) < 1e-7 * Math.max(1, o.r))
        .map((p) => Math.atan2(p.y - o.center.y, p.x - o.center.x))
        .sort((a, b) => a - b)
      let a0: number
      let a1: number
      if (on.length === 0) {
        a0 = -0.7
        a1 = 0.7
      } else if (on.length === 1) {
        a0 = on[0] - 0.7
        a1 = on[0] + 0.7
      } else {
        let gap = -1
        let at = 0
        on.forEach((a, j) => {
          const next = j === on.length - 1 ? on[0] + 2 * Math.PI : on[j + 1]
          if (next - a > gap) {
            gap = next - a
            at = j
          }
        })
        a0 = on[(at + 1) % on.length]
        a1 = a0 + (2 * Math.PI - gap)
        a0 -= MARGIN
        a1 += MARGIN
      }
      if (a1 - a0 > 2 * Math.PI - 0.5) arcs[i] = 'full'
      else arcs[i] = [a0, a1]
      const [s, e] = arcs[i] === 'full' ? [0, 2 * Math.PI] : (arcs[i] as [number, number])
      for (let k = 0; k <= 24; k++) {
        const a = s + ((e - s) * k) / 24
        grow({ x: o.center.x + o.r * Math.cos(a), y: o.center.y + o.r * Math.sin(a) })
      }
    } else {
      const dx = o.q.x - o.p.x
      const dy = o.q.y - o.p.y
      const d = Math.hypot(dx, dy)
      const on = Object.values(built.points)
        .filter((p) => Math.abs(dx * (p.y - o.p.y) - dy * (p.x - o.p.x)) / d < 1e-7 * Math.max(1, d))
        .map((p) => ((p.x - o.p.x) * dx + (p.y - o.p.y) * dy) / d)
      const lo = Math.min(...on, 0, d)
      const hi = Math.max(...on, 0, d)
      const ext = 0.08 * (hi - lo) + unit
      const a = { x: o.p.x + (dx / d) * (lo - ext), y: o.p.y + (dy / d) * (lo - ext) }
      const b = { x: o.p.x + (dx / d) * (hi + ext), y: o.p.y + (dy / d) * (hi + ext) }
      segs[i] = [a, b]
      grow(a)
      grow(b)
    }
  })
  const pad = Math.max(maxx - minx, maxy - miny) * 0.06 + unit
  return { vb: [minx - pad, miny - pad, maxx - minx + 2 * pad, maxy - miny + 2 * pad], arcs, segs }
}

function ConstructFigure({ c, built, upto, label, labels = 'all' }: { c: Construction; built: Built; upto: number; label: string; labels?: 'all' | 'few' }) {
  const geo = useMemo(() => layout(built), [built])
  const [vx, vy, vw, vh] = geo.vb
  const X = (x: number): number => x - vx
  const Y = (y: number): number => vy + vh - y
  const px = vw / 440 // one screen pixel, about
  const last = upto - 1
  const final = upto >= c.steps.length
  const fs = 13 * px
  const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
    const sx = cx + r * Math.cos(a0)
    const sy = cy + r * Math.sin(a0)
    const ex = cx + r * Math.cos(a1)
    const ey = cy + r * Math.sin(a1)
    return `M${X(sx)},${Y(sy)}A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${X(ex)},${Y(ey)}`
  }
  const names = Object.keys(built.points).filter((n) => built.pointStep[n] < upto)
  const segment = (a: string, b: string, key: string, stroke: string, width: number) => (
    <line key={key} x1={X(built.points[a].x)} y1={Y(built.points[a].y)} x2={X(built.points[b].x)} y2={Y(built.points[b].y)} stroke={stroke} strokeWidth={width} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
  )
  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 600, maxHeight: 480, display: 'block', margin: '8px auto', background: 'color-mix(in srgb, var(--surface) 70%, transparent)', borderRadius: 10 }}>
      {built.objects.map((o, i) => {
        if (built.objectStep[i] >= upto) return null
        const now = built.objectStep[i] === last
        const stroke = now ? 'var(--coral)' : 'var(--muted)'
        const width = now ? 2.4 : 1.2
        const opacity = now ? 1 : 0.7
        if (o.kind === 'line') {
          const [a, b] = geo.segs[i]
          return <line key={i} x1={X(a.x)} y1={Y(a.y)} x2={X(b.x)} y2={Y(b.y)} stroke={stroke} strokeWidth={width} opacity={opacity} vectorEffect="non-scaling-stroke" />
        }
        const arc = geo.arcs[i]
        if (arc === 'full') return <circle key={i} cx={X(o.center.x)} cy={Y(o.center.y)} r={o.r} fill="none" stroke={stroke} strokeWidth={width} opacity={opacity} vectorEffect="non-scaling-stroke" />
        return <path key={i} d={arcPath(o.center.x, o.center.y, o.r, arc[0], arc[1])} fill="none" stroke={stroke} strokeWidth={width} opacity={opacity} vectorEffect="non-scaling-stroke" />
      })}
      {c.base.map(([a, b], i) => segment(a, b, `b${i}`, 'var(--text)', 3.2))}
      {final && c.result.map(([a, b], i) => segment(a, b, `r${i}`, 'var(--bad)', 3.6))}
      {names.map((n) => {
        const p = built.points[n]
        const given = built.pointStep[n] === -1
        const mark = final && c.marks.includes(n)
        const fresh = built.pointStep[n] === last
        return (
          <g key={n}>
            {fresh && <circle cx={X(p.x)} cy={Y(p.y)} r={9 * px} fill="none" stroke="var(--gold)" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />}
            <circle cx={X(p.x)} cy={Y(p.y)} r={3.6 * px} fill={mark ? 'var(--bad)' : given ? 'var(--text)' : 'var(--brand)'} />
            {(labels === 'all' || given || mark || fresh) && (
              <text x={X(p.x) + 7 * px} y={Y(p.y) - 7 * px} fontSize={fs} fontWeight={700} fill={mark ? 'var(--bad)' : 'var(--text)'} stroke="var(--surface)" strokeWidth={3.5 * px} paintOrder="stroke">
                {show(n)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* -------------------------------------------------------------------------- saying the steps */

function objectText(built: Built, i: number, lang: 'en' | 'id'): string {
  const o = built.objects[i]
  if (o.kind === 'line') return lang === 'id' ? `garis ${show(o.a)}${show(o.b)}` : `line ${show(o.a)}${show(o.b)}`
  const through = o.r1 === o.c ? o.r2 : o.r2 === o.c ? o.r1 : null
  if (lang === 'id') return through ? `lingkaran berpusat di ${show(o.c)} melalui ${show(through)}` : `lingkaran berpusat di ${show(o.c)} berjari-jari ${show(o.r1)}${show(o.r2)}`
  return through ? `the circle around ${show(o.c)} through ${show(through)}` : `the circle around ${show(o.c)} with radius ${show(o.r1)}${show(o.r2)}`
}

function pickText(s: Extract<Step, { kind: 'point' }>, lang: 'en' | 'id'): string {
  const parts: string[] = []
  const pk = s.pick
  if (pk) {
    if ('side' in pk) {
      const [a, b, sign] = pk.side
      parts.push(lang === 'id' ? `yang ada di sebelah ${sign === 1 ? 'kiri' : 'kanan'} bila memandang dari ${show(a)} ke ${show(b)}` : `the one on the ${sign === 1 ? 'left' : 'right'} when you look from ${show(a)} towards ${show(b)}`)
    } else if ('toward' in pk) parts.push(lang === 'id' ? `yang lebih jauh dari ${show(pk.toward[0])} ke arah ${show(pk.toward[1])}` : `the one farther from ${show(pk.toward[0])} in the direction of ${show(pk.toward[1])}`)
    else if ('far' in pk) parts.push(lang === 'id' ? `yang lebih jauh dari ${show(pk.far)}` : `the one farther from ${show(pk.far)}`)
    else parts.push(lang === 'id' ? `yang lebih dekat ke ${show(pk.near)}` : `the one nearer to ${show(pk.near)}`)
  }
  if (s.exclude?.length) parts.push(lang === 'id' ? `bukan titik ${s.exclude.map(show).join(', ')}` : `not the point ${s.exclude.map(show).join(', ')}`)
  return parts.length ? ` (${parts.join('; ')})` : ''
}

function stepText(c: Construction, built: Built, i: number, lang: 'en' | 'id'): string {
  const s = c.steps[i]
  if (s.kind === 'line') return lang === 'id' ? `Tarik garis melalui ${show(s.a)} dan ${show(s.b)} dengan penggaris.` : `Draw the line through ${show(s.a)} and ${show(s.b)} with the ruler.`
  if (s.kind === 'circle') {
    const through = s.r1 === s.c ? s.r2 : s.r2 === s.c ? s.r1 : null
    if (lang === 'id') return through ? `Letakkan kaki jangka di ${show(s.c)}, bukalah sampai ${show(through)}, lalu gambar lingkaran (busur saja cukup) melalui ${show(through)}.` : `Bukalah jangka sepanjang ${show(s.r1)}${show(s.r2)}, letakkan kaki jangkanya di ${show(s.c)}, lalu gambar lingkaran (busur saja cukup).`
    return through ? `Put the compass point on ${show(s.c)}, open it to ${show(through)}, and draw a circle (an arc is enough) through ${show(through)}.` : `Open the compass to the length ${show(s.r1)}${show(s.r2)}, put its point on ${show(s.c)} and draw a circle (an arc is enough).`
  }
  const [a, b] = s.of
  return lang === 'id' ? `Tandai ${show(s.name)}, tempat ${objectText(built, a, lang)} dan ${objectText(built, b, lang)} berpotongan${pickText(s, lang)}.` : `Mark ${show(s.name)}, where ${objectText(built, a, lang)} and ${objectText(built, b, lang)} cross${pickText(s, lang)}.`
}

const stepCounts = (c: Construction): { circles: number; lines: number; points: number } => ({
  circles: c.steps.filter((s) => s.kind === 'circle').length,
  lines: c.steps.filter((s) => s.kind === 'line').length,
  points: c.steps.filter((s) => s.kind === 'point').length,
})

/** The buttons and the slider that move through the steps of a construction: start, back, forward, finish, and a slider with the step number. */
function StepBar({ k, N, setK }: { k: number; N: number; setK: (k: number) => void }) {
  const { tc } = useI18n()
  return (
    <>
      <div className="inrow">
        <button className="btn ghost" onClick={() => setK(0)} disabled={k === 0}>
          {tc(L('start', 'awal'))}
        </button>
        <button className="btn soft" onClick={() => setK(Math.max(0, k - 1))} disabled={k === 0} aria-label={tc(L('Previous step', 'Langkah sebelumnya'))}>
          ◀
        </button>
        <button className="btn soft" onClick={() => setK(Math.min(N, k + 1))} disabled={k === N} aria-label={tc(L('Next step', 'Langkah berikutnya'))}>
          ▶
        </button>
        <button className="btn ghost" onClick={() => setK(N)} disabled={k === N}>
          {tc(L('finish', 'selesai'))}
        </button>
      </div>
      <label className="lbl slider">
        {tc(L('step', 'langkah'))} <b>{k}</b> / {N}
        <input type="range" min={0} max={N} value={k} aria-label={tc(L('step', 'langkah'))} aria-valuetext={`${tc(L('step', 'langkah'))} ${k} ${tc(L('of', 'dari'))} ${N}`} onChange={(e) => setK(Number(e.target.value))} />
      </label>
    </>
  )
}

/** The player: back and forward through the steps, a slider, the current step in words and every step in a list. */
function Player({ c, built, k, setK, title }: { c: Construction; built: Built; k: number; setK: (k: number) => void; title: string }) {
  const { tc, lang } = useI18n()
  const N = c.steps.length
  const text = k === 0 ? tc(L('Start: only the given points and segments are drawn.', 'Mulai: baru titik dan ruas garis yang diberikan yang tergambar.')) : stepText(c, built, k - 1, lang)
  const label = `${title}. ${tc(L('Step', 'Langkah'))} ${k} ${tc(L('of', 'dari'))} ${N}. ${text}`
  return (
    <>
      <ConstructFigure c={c} built={built} upto={k} label={label} />
      <StepBar k={k} N={N} setK={setK} />
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {text}
        </p>
      </div>
      <details>
        <summary>{tc(L(`All ${N} steps in words`, `Semua ${N} langkah dalam kata-kata`))}</summary>
        <ol className="small">
          {c.steps.map((_, i) => (
            <li key={i} style={i === k - 1 ? { fontWeight: 700 } : undefined}>
              {stepText(c, built, i, lang)}
            </li>
          ))}
        </ol>
      </details>
    </>
  )
}

/** What was measured on the finished figure: two numbers that the construction says are equal. */
function ClaimTable({ claims }: { claims: Claim[] }) {
  const { tc } = useI18n()
  const sep = useSep()
  const unit = (cl: Claim, x: number): string => (cl.unit === 'deg' ? `${fmt(x, sep)}°` : fmt(x, sep))
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="rtable">
        <thead>
          <tr>
            <th>{tc(L('measured on the drawing', 'diukur pada gambar'))}</th>
            <th>{tc(L('first', 'pertama'))}</th>
            <th>{tc(L('second', 'kedua'))}</th>
            <th>
              <span aria-hidden="true">=</span>
              <span className="sr-only">{tc(L('equal?', 'sama?'))}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {claims.map((cl, i) => (
            <tr key={i}>
              <td>{tc(cl.label)}</td>
              <td>{unit(cl, cl.a)}</td>
              <td>{unit(cl, cl.b)}</td>
              <td>{Math.abs(cl.a - cl.b) < 1e-8 * Math.max(1, Math.abs(cl.b)) ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------------ the textbook ones */

const INFO: Record<ConstructId, { title: Loc; goal: Loc; why: Loc }> = {
  copysegment: {
    title: L('Copy a segment', 'Menyalin ruas garis'),
    goal: L('Given the segment AB and a ray from C through E, mark D on the ray so that CD is as long as AB.', 'Diberikan ruas garis AB dan sinar dari C melalui E, tandai D pada sinar itu sehingga CD sepanjang AB.'),
    why: L('The compass keeps its opening when it is lifted, so every point of the circle around C is exactly AB from C. The circle cuts the ray at D.', 'Jangka mempertahankan bukaannya ketika diangkat, jadi setiap titik pada lingkaran berpusat di C berjarak tepat AB dari C. Lingkaran itu memotong sinar di D.'),
  },
  perpbisector: {
    title: L('Midpoint and perpendicular bisector', 'Titik tengah dan sumbu ruas garis'),
    goal: L('Given AB, find the line that cuts it in half at a right angle, and the midpoint M.', 'Diberikan AB, cari garis yang membelahnya menjadi dua sama panjang dengan sudut siku-siku, dan titik tengah M.'),
    why: L('Both circles have radius AB, so each of their two crossings is as far from A as from B: it lies on the perpendicular bisector. The four points A, B and the two crossings make a rhombus, and the diagonals of a rhombus cut each other in half at a right angle.', 'Kedua lingkaran berjari-jari AB, jadi tiap titik potongnya sama jauh dari A dan dari B: ia terletak pada sumbu ruas garis. Keempat titik A, B, dan kedua titik potong membentuk belah ketupat, dan diagonal belah ketupat saling membagi dua dengan sudut siku-siku.'),
  },
  equilateral: {
    title: L('Equilateral triangle and a 60° angle', 'Segitiga sama sisi dan sudut 60°'),
    goal: L('Given AB, build the equilateral triangle ABC on it. Its angle at A is 60°.', 'Diberikan AB, bangun segitiga sama sisi ABC di atasnya. Sudutnya di A adalah 60°.'),
    why: L('C is on both circles, so CA = AB and CB = AB: three equal sides. An equilateral triangle has three equal angles that add up to 180°, so each is 60°.', 'C berada pada kedua lingkaran, jadi CA = AB dan CB = AB: tiga sisi sama panjang. Segitiga sama sisi memiliki tiga sudut sama besar yang berjumlah 180°, jadi masing-masing 60°.'),
  },
  bisectangle: {
    title: L('Bisect an angle', 'Membagi dua sudut'),
    goal: L('Given the angle POQ, draw the ray OR that cuts it into two equal angles.', 'Diberikan sudut POQ, gambar sinar OR yang membaginya menjadi dua sudut sama besar.'),
    why: L('The first circle makes the two arms the same length. The next two circles have that same radius, so O, the two arm points and R form a rhombus (four equal sides). A diagonal of a rhombus bisects its angle.', 'Lingkaran pertama membuat kedua lengan sama panjang. Dua lingkaran berikutnya berjari-jari sama, jadi O, kedua titik lengan, dan R membentuk belah ketupat (empat sisi sama panjang). Diagonal belah ketupat membagi dua sudutnya.'),
  },
  copyangle: {
    title: L('Copy an angle', 'Menyalin sudut'),
    goal: L('Given the angle POQ and a ray from S through T, draw a ray from S that makes the same angle with ST, on the left side.', 'Diberikan sudut POQ dan sinar dari S melalui T, gambar sinar dari S yang membentuk sudut yang sama dengan ST, di sisi kiri.'),
    why: L('The two small triangles have three pairs of equal sides, each pair drawn with a single opening of the compass. Triangles with three equal sides are congruent (SSS), so their angles at the vertex are equal.', 'Kedua segitiga kecil memiliki tiga pasang sisi sama panjang, tiap pasang digambar dengan satu bukaan jangka. Segitiga dengan tiga sisi yang sama adalah kongruen (SSS), jadi sudut-sudutnya di titik sudut sama besar.'),
  },
  perpat: {
    title: L('Perpendicular at a point on a line', 'Garis tegak lurus di sebuah titik pada garis'),
    goal: L('Given the line AB and a point C on it, draw the line through C that is perpendicular to AB.', 'Diberikan garis AB dan titik C di atasnya, gambar garis melalui C yang tegak lurus pada AB.'),
    why: L('The first circle marks two points of the line at the same distance from C, one on each side. The perpendicular bisector of that pair (the lens of the other two circles) passes through their midpoint C and is perpendicular to the line.', 'Lingkaran pertama menandai dua titik pada garis yang sama jauh dari C, satu di tiap sisi. Sumbu pasangan itu (lensa dari dua lingkaran lain) melalui titik tengahnya C dan tegak lurus pada garis.'),
  },
  perpfrom: {
    title: L('Perpendicular from a point to a line', 'Garis tegak lurus dari sebuah titik ke garis'),
    goal: L('Given the line AB and a point C that is not on it, draw the perpendicular from C to AB and find its foot F.', 'Diberikan garis AB dan titik C yang tidak berada di atasnya, gambar garis tegak lurus dari C ke AB dan temukan kakinya F.'),
    why: L('The circle around C cuts the line at two points, both at the same distance from C, so C is on their perpendicular bisector. That bisector is perpendicular to the line and goes through C. The foot F is the shortest way from C to the line.', 'Lingkaran berpusat di C memotong garis di dua titik yang sama jauh dari C, jadi C berada pada sumbu pasangan itu. Sumbu itu tegak lurus pada garis dan melalui C. Kaki F adalah jalan terpendek dari C ke garis.'),
  },
  parallel: {
    title: L('Parallel line through a point', 'Garis sejajar melalui sebuah titik'),
    goal: L('Given the line AB and a point C off it, draw the line through C that is parallel to AB.', 'Diberikan garis AB dan titik C di luarnya, gambar garis melalui C yang sejajar dengan AB.'),
    why: L('Four sides of one compass opening make a rhombus, and the opposite sides of a rhombus are parallel. Here the rhombus has one side on the line AB and the opposite side through C.', 'Empat sisi dengan satu bukaan jangka membentuk belah ketupat, dan sisi-sisi berhadapan belah ketupat sejajar. Di sini belah ketupat memiliki satu sisi pada garis AB dan sisi di hadapannya melalui C.'),
  },
  angle90: {
    title: L('A right angle (90°)', 'Sudut siku-siku (90°)'),
    goal: L('Given the ray OA, build the ray from O that makes 90° with it.', 'Diberikan sinar OA, bangun sinar dari O yang membentuk 90° dengannya.'),
    why: L('A right angle is half of a straight angle. The circle marks a point on the other side of O at the same distance as A, and the perpendicular bisector of that pair passes through O at a right angle.', 'Sudut siku-siku adalah setengah sudut lurus. Lingkaran menandai titik di sisi lain O pada jarak yang sama dengan A, dan sumbu pasangan itu melalui O dengan sudut siku-siku.'),
  },
  angle30: {
    title: L('A 30° angle', 'Sudut 30°'),
    goal: L('Given the ray OA, build the ray that makes 30° with it: bisect the 60° angle of an equilateral triangle.', 'Diberikan sinar OA, bangun sinar yang membentuk 30° dengannya: bagi dua sudut 60° segitiga sama sisi.'),
    why: L('60° divided in two is 30°. Every special angle on the ruler-and-compass list comes from 60°, 90° and halving.', '60° dibagi dua adalah 30°. Setiap sudut istimewa pada daftar penggaris dan jangka berasal dari 60°, 90°, dan membagi dua.'),
  },
  angle45: {
    title: L('A 45° angle', 'Sudut 45°'),
    goal: L('Given the ray OA, build the ray that makes 45° with it: bisect a right angle.', 'Diberikan sinar OA, bangun sinar yang membentuk 45° dengannya: bagi dua sudut siku-siku.'),
    why: L('90° divided in two is 45°. First the perpendicular, then one more circle to make the two arms equal, then the bisector.', '90° dibagi dua adalah 45°. Pertama garis tegak lurus, lalu satu lingkaran lagi untuk membuat kedua lengan sama panjang, lalu garis bagi.'),
  },
}
export function ConstructPlay() {
  const { tc } = useI18n()
  const [id, setId] = useState<ConstructId>('perpbisector')
  const [seed, setSeed] = useState(0)
  const [k, setK] = useState(0)
  const c = useMemo(() => make(id, seed), [id, seed])
  const built = useMemo(() => run(c.givens, c.steps), [c])
  const info = INFO[id]
  const counts = stepCounts(c)
  const done = k >= c.steps.length
  return (
    <Frame name="constructplay">
      <div className="chips">
        {CONSTRUCT_IDS.map((q) => (
          <button
            key={q}
            className={`chip ${id === q ? 'on' : ''}`}
            onClick={() => {
              setId(q)
              setSeed(0)
              setK(0)
            }}
            aria-pressed={id === q}
          >
            {tc(INFO[q].title)}
          </button>
        ))}
      </div>
      <p className="small">{tc(info.goal)}</p>
      <div className="inrow">
        <button
          className="btn ghost"
          onClick={() => {
            setSeed((seed % 60) + 1)
            setK(0)
          }}
        >
          {tc(L('another drawing', 'gambar lain'))}
        </button>
        <span className="small">
          {counts.circles} {tc(L('circles', 'lingkaran'))} · {counts.lines} {tc(L('lines', 'garis'))} · {counts.points} {tc(L('marked points', 'titik ditandai'))}
        </span>
      </div>
      <Player c={c} built={built} k={k} setK={setK} title={tc(info.title)} />
      {done ? (
        <>
          <ClaimTable claims={c.claims(built.points)} />
          <p className="small">{tc(info.why)}</p>
        </>
      ) : (
        <p className="small muted">{tc(L('Go to the last step to measure the finished drawing.', 'Pergi ke langkah terakhir untuk mengukur gambar yang sudah jadi.'))}</p>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------------ angle builder */

const ANGLE_PRESETS = [3, 15, 30, 45, 60, 72, 75, 90, 105, 120, 135, 150, 165, 1, 20, 40, 50]

const BASE_NAME: Record<number, Loc> = {
  60: L('an equilateral triangle', 'sebuah segitiga sama sisi'),
  90: L('a perpendicular', 'sebuah garis tegak lurus'),
  72: L('the central angle of a regular pentagon (from the golden ratio)', 'sudut pusat segilima beraturan (dari rasio emas)'),
}

export function ConstructAngle() {
  const { tc, lang } = useI18n()
  const [text, setText] = useState('15')
  const [k, setK] = useState<number | null>(null)
  const n = Number(text.trim())
  const valid = /^\d{1,3}$/.test(text.trim()) && n >= 1 && n <= 179
  const buildable = valid && isConstructibleDegree(n)
  const c = useMemo(() => (buildable ? makeAngle(n) : null), [buildable, n])
  const built = useMemo(() => (c ? run(c.givens, c.steps) : null), [c])
  const recipe = useMemo(() => (buildable ? recipeFor(n) : null), [buildable, n])
  const lines = useMemo(() => (recipe ? recipeLines(recipe) : []), [recipe])
  const shownK = c ? (k === null ? c.steps.length : Math.min(k, c.steps.length)) : 0
  const lower = valid ? n - (n % 3) : 0
  const upper = valid ? lower + 3 : 0
  const d = valid ? angleFieldDegree(n) : 0
  const denom = valid ? turnDenominator(n) : 0
  const lineText = (l: (typeof lines)[number]): string => {
    if (l.op === 'base') return `${l.deg}° ${tc(L('is', 'adalah'))} ${tc(BASE_NAME[l.deg])}`
    if (l.op === 'half') return `${l.from[0]}° ${tc(L('cut in half', 'dibagi dua'))} = ${l.deg}°`
    if (l.op === 'add') return `${l.from[0]}° + ${l.from[1]}° = ${l.deg}°`
    return `${l.from[0]}° − ${l.from[1]}° = ${l.deg}°`
  }
  return (
    <Frame name="constructangle">
      <div className="inrow">
        <label className="lbl">
          {tc(L('angle', 'sudut'))} = <input style={{ width: '5em' }} value={text} inputMode="numeric" aria-label={tc(L('angle in whole degrees', 'sudut dalam derajat bulat'))} onChange={(e) => (setText(e.target.value), setK(null))} /> °
        </label>
      </div>
      <div className="chips">
        {ANGLE_PRESETS.map((p) => (
          <button
            key={p}
            className="chip ghost"
            onClick={() => {
              setText(String(p))
              setK(null)
            }}
          >
            {p}°
          </button>
        ))}
      </div>
      {!valid && <p className="warnline">{tc(L('Type a whole number of degrees from 1 to 179.', 'Ketik bilangan bulat derajat dari 1 sampai 179.'))}</p>}
      {valid && buildable && recipe && c && built && (
        <>
          <p className="okline">
            {n}° {tc(L('can be built with a ruler and compass.', 'dapat dibangun dengan penggaris dan jangka.'))}
          </p>
          <ol className="small">
            {lines.map((l, i) => (
              <li key={i}>{lineText(l)}</li>
            ))}
          </ol>
          <ConstructFigure
            c={c}
            built={built}
            upto={shownK}
            labels="few"
            label={`${n}°. ${shownK === 0 ? tc(L('Only the starting ray is drawn.', 'Baru sinar awal yang tergambar.')) : `${tc(L('Step', 'Langkah'))} ${shownK} ${tc(L('of', 'dari'))} ${c.steps.length}. ${stepText(c, built, shownK - 1, lang)}`}`}
          />
          <StepBar k={shownK} N={c.steps.length} setK={setK} />
          {shownK === c.steps.length && <ClaimTable claims={c.claims(built.points)} />}
          <p className="small">
            {tc(L(`${stepCounts(c).circles} circles and ${stepCounts(c).lines} lines in all.`, `Seluruhnya ${stepCounts(c).circles} lingkaran dan ${stepCounts(c).lines} garis.`))}
          </p>
        </>
      )}
      {valid && !buildable && (
        <div className="wgtout" aria-live="polite">
          <p className="badline">
            {n}° {tc(L('cannot be built with a ruler and compass.', 'tidak dapat dibangun dengan penggaris dan jangka.'))}
          </p>
          <p className="small">
            {tc(L('The number', 'Bilangan'))} <Tex src={`\\cos ${n}^\\circ`} /> {tc(L(`is a root of a polynomial of degree ${d} with whole-number coefficients, and no smaller one. A ruler and compass only reach numbers whose degree is a power of 2 (1, 2, 4, 8, 16, …), and ${d} is not.`, `adalah akar suatu polinomial berderajat ${d} dengan koefisien bilangan bulat, dan tidak ada yang lebih kecil. Penggaris dan jangka hanya mencapai bilangan yang derajatnya pangkat dari 2 (1, 2, 4, 8, 16, …), dan ${d} bukan.`))}
          </p>
          <p className="small">
            {tc(L(`The full turn is divided in ${denom} parts of ${n}°. The nearest angles you can build are`, `Satu putaran penuh dibagi menjadi ${denom} bagian sebesar ${n}°. Sudut terdekat yang dapat dibangun adalah`))} {lower > 0 ? `${lower}° ${tc(L('and', 'dan'))} ` : ''}
            {upper}°.
          </p>
        </div>
      )}
    </Frame>
  )
}

/* --------------------------------------------------------------------------- dividing a segment */

export function ConstructDivide() {
  const { tc } = useI18n()
  const [n, setN] = useState(5)
  const [seed, setSeed] = useState(0)
  const [k, setK] = useState<number | null>(null)
  const c = useMemo(() => makeDivide(n, seed), [n, seed])
  const built = useMemo(() => run(c.givens, c.steps), [c])
  const N = c.steps.length
  const shown = k === null ? N : Math.min(k, N)
  const { lang } = useI18n()
  return (
    <Frame name="constructdivide">
      <div className="chips">
        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
          <button
            key={q}
            className={`chip ${n === q ? 'on' : ''}`}
            onClick={() => {
              setN(q)
              setSeed(0)
              setK(null)
            }}
            aria-pressed={n === q}
          >
            {q} {tc(L('equal parts', 'bagian sama'))}
          </button>
        ))}
      </div>
      <div className="inrow">
        <button
          className="btn ghost"
          onClick={() => {
            setSeed((seed % 12) + 1)
            setK(null)
          }}
        >
          {tc(L('another drawing', 'gambar lain'))}
        </button>
        <span className="small">
          {stepCounts(c).circles} {tc(L('circles', 'lingkaran'))} · {stepCounts(c).lines} {tc(L('lines', 'garis'))}
        </span>
      </div>
      <ConstructFigure
        c={c}
        built={built}
        upto={shown}
        label={`${tc(L(`Dividing the segment AB into ${n} equal parts.`, `Membagi ruas garis AB menjadi ${n} bagian sama.`))} ${shown === 0 ? '' : `${tc(L('Step', 'Langkah'))} ${shown} ${tc(L('of', 'dari'))} ${N}. ${stepText(c, built, shown - 1, lang)}`}`}
      />
      <StepBar k={shown} N={N} setK={setK} />
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {shown === 0 ? tc(L('Start: the segment AB and the first mark D₁ on a ray from A.', 'Mulai: ruas garis AB dan tanda pertama D₁ pada sebuah sinar dari A.')) : stepText(c, built, shown - 1, lang)}
        </p>
      </div>
      {shown === N ? (
        <>
          <ClaimTable claims={c.claims(built.points)} />
          <p className="small">
            {tc(L(`Equal steps along any ray cut the parallel lines at equal distances (the intercept theorem), so the marks K₁ to K${show(String(n - 1))} cut AB into ${n} equal parts.`, `Langkah yang sama panjang sepanjang sinar mana pun memotong garis-garis sejajar pada jarak yang sama (teorema intersep), sehingga tanda K₁ sampai K${show(String(n - 1))} memotong AB menjadi ${n} bagian sama.`))}
          </p>
        </>
      ) : (
        <p className="small muted">{tc(L('Go to the last step to measure the marks.', 'Pergi ke langkah terakhir untuk mengukur tanda-tandanya.'))}</p>
      )}
    </Frame>
  )
}

/* --------------------------------------------------------------------------------- trisection */

export function ConstructTrisect() {
  const { tc } = useI18n()
  const sep = useSep()
  const [deg, setDeg] = useState(45)
  const r = useMemo(() => neusis(deg), [deg])
  const ratio = trisectRatio(deg)
  const can = isTrisectable(deg)
  const phi = deg / 3
  const phiText = Number.isInteger(phi) ? String(phi) : fmt(phi, sep, 3)
  const O = { x: 0, y: 0 }
  // the drawing: the unit circle, A = (1, 0), B on the circle, the ruler from D through C
  const arc = (c: Pt, rad: number, a0: number, a1: number): string => {
    const p = (a: number) => `${c.x + rad * Math.cos(a)},${-(c.y + rad * Math.sin(a))}`
    return `M${p(a0)}A${rad},${rad} 0 0 0 ${p(a1)}`
  }
  const rad = (d: number): number => (d * Math.PI) / 180
  const ext = { x: r.dPt.x + (r.b.x - r.dPt.x) * 1.12, y: r.dPt.y + (r.b.y - r.dPt.y) * 1.12 }
  const tick = (p: Pt) => {
    const dx = r.b.x - r.dPt.x
    const dy = r.b.y - r.dPt.y
    const len = Math.hypot(dx, dy)
    const nx = -dy / len
    const ny = dx / len
    return <line x1={p.x - nx * 0.07} y1={-(p.y - ny * 0.07)} x2={p.x + nx * 0.07} y2={-(p.y + ny * 0.07)} stroke="var(--coral)" strokeWidth={0.035} strokeLinecap="round" />
  }
  const spots: [string, Pt, number, number][] = [
    ['O', O, -0.07, 0.17],
    ['A', { x: 1, y: 0 }, 0.04, 0.17],
    ['B', r.b, 0.04, -0.06],
    ['C', r.c, -0.1, -0.1],
    ['D', r.dPt, -0.06, 0.17],
  ]
  const label = `${tc(L('Archimedes\' trisection of an angle of', 'Trisection Archimedes untuk sudut'))} ${deg}°: ${tc(L('the ruler with two marks one radius apart lies through B, with one mark on the circle at C and the other at D on the line AO beyond O. The angle at D is', 'penggaris dengan dua tanda berjarak satu jari-jari terletak melalui B, satu tanda pada lingkaran di C dan yang lain di D pada garis AO di seberang O. Sudut di D adalah'))} ${fmt(r.angle, sep)}°`
  return (
    <Frame name="constructtrisect">
      <label className="lbl slider">
        {tc(L('angle', 'sudut'))} = <b>{deg}°</b>
        <input type="range" min={3} max={177} step={1} value={deg} aria-label={tc(L('angle in degrees', 'sudut dalam derajat'))} onChange={(e) => setDeg(Number(e.target.value))} />
      </label>
      <svg viewBox="-2.35 -1.2 3.75 2.4" role="img" aria-label={label} style={{ width: '100%', maxWidth: 560, display: 'block', margin: '8px auto' }}>
        <circle cx={0} cy={0} r={1} fill="none" stroke="var(--muted)" strokeWidth={0.012} />
        <line x1={r.dPt.x - 0.12} y1={0} x2={1.2} y2={0} stroke="var(--muted)" strokeWidth={0.012} />
        <line x1={r.dPt.x} y1={-r.dPt.y} x2={ext.x} y2={-ext.y} stroke="var(--muted)" strokeWidth={0.012} />
        <line x1={0} y1={0} x2={1} y2={0} stroke="var(--text)" strokeWidth={0.03} strokeLinecap="round" />
        <line x1={0} y1={0} x2={r.b.x} y2={-r.b.y} stroke="var(--text)" strokeWidth={0.03} strokeLinecap="round" />
        <path d={arc(O, 0.3, 0, rad(deg))} fill="none" stroke="var(--gold)" strokeWidth={0.025} />
        <line x1={r.dPt.x} y1={0} x2={r.c.x} y2={-r.c.y} stroke="var(--coral)" strokeWidth={0.035} strokeLinecap="round" />
        {tick(r.dPt)}
        {tick(r.c)}
        <path d={arc(r.dPt, 0.45, 0, rad(phi))} fill="none" stroke="var(--bad)" strokeWidth={0.025} />
        {spots.map(([name, p]) => (
          <circle key={name} cx={p.x} cy={-p.y} r={0.025} fill="var(--text)" />
        ))}
        {spots.map(([name, p, dx, dy]) => (
          <text key={name} x={p.x + dx} y={-p.y + dy} fontSize={0.12} fontWeight={700} fill="var(--text)">
            {name}
          </text>
        ))}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {tc(L('angle at O', 'sudut di O'))} = {deg}° · {tc(L('angle at D', 'sudut di D'))} = {fmt(r.angle, sep)}° = {deg}° / 3
        </p>
        <p className="small">
          {tc(L('With the marked ruler, the distance', 'Dengan penggaris bertanda, jarak'))} OD = {fmt(r.d, sep)} = 2 cos({phiText}°).
        </p>
        {can ? (
          <p className="okline">
            {tc(L(`With only a ruler and compass the angle ${deg}° can be trisected: over the numbers you can build from it, cos(${phiText}°) has degree ${ratio}, a power of 2.`, `Dengan penggaris dan jangka saja sudut ${deg}° dapat dibagi tiga sama besar: atas bilangan yang dapat Anda bangun darinya, cos(${phiText}°) berderajat ${ratio}, pangkat dari 2.`))}
          </p>
        ) : (
          <p className="badline">
            {tc(L(`With only a ruler and compass the angle ${deg}° cannot be trisected: over the numbers you can build from it, cos(${phiText}°) has degree 3, and a ruler and compass only give degrees 1, 2, 4, 8, …`, `Dengan penggaris dan jangka saja sudut ${deg}° tidak dapat dibagi tiga sama besar: atas bilangan yang dapat Anda bangun darinya, cos(${phiText}°) berderajat 3, dan penggaris dan jangka hanya memberi derajat 1, 2, 4, 8, …`))}
          </p>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------------------- polygons */

const POLY_PRESETS = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 17, 20, 24, 51, 257, 65537]

export function ConstructPolygon() {
  const { tc } = useI18n()
  const sep = useSep()
  const [text, setText] = useState('17')
  const n = Number(text.trim())
  const valid = /^\d{1,5}$/.test(text.trim()) && n >= 3 && n <= 65537
  const f = valid ? polygonFactors(n) : null
  const can = valid && isConstructiblePolygon(n)
  const list = useMemo(() => constructiblePolygons(120), [])
  const central = valid ? 360 / n : 0
  const cx = 120
  const cy = 120
  const R = 100
  const verts = valid && n <= 64 ? Array.from({ length: n }, (_, i) => [cx + R * Math.sin((2 * Math.PI * i) / n), cy - R * Math.cos((2 * Math.PI * i) / n)] as [number, number]) : []
  const factorText = f ? [f.twos > 0 ? (f.twos === 1 ? '2' : `2${String(f.twos).replace(/\d/g, (d) => SUP[Number(d)])}`) : '', ...f.fermat.map(String), f.rest > 1 ? String(f.rest) : ''].filter(Boolean).join(' × ') : ''
  return (
    <Frame name="constructpoly">
      <div className="inrow">
        <label className="lbl">
          {tc(L('number of sides', 'banyak sisi'))} n = <input style={{ width: '6em' }} value={text} inputMode="numeric" aria-label={tc(L('number of sides, from 3 to 65537', 'banyak sisi, dari 3 sampai 65537'))} onChange={(e) => setText(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {POLY_PRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setText(String(p))}>
            {p}
          </button>
        ))}
      </div>
      {!valid && <p className="warnline">{tc(L('Type a whole number of sides from 3 to 65537.', 'Ketik banyak sisi berupa bilangan bulat dari 3 sampai 65537.'))}</p>}
      {valid && f && (
        <>
          <svg viewBox="0 0 240 240" role="img" aria-label={`${tc(L('A regular polygon with', 'Segi banyak beraturan dengan'))} ${n} ${tc(L('sides', 'sisi'))}`} style={{ width: '100%', maxWidth: 240, display: 'block', margin: '6px auto' }}>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth={1.5} />
            {verts.length > 0 && <polygon points={verts.map((v) => v.join(',')).join(' ')} fill={can ? 'color-mix(in srgb, var(--leaf) 30%, transparent)' : 'color-mix(in srgb, var(--bad) 18%, transparent)'} stroke={can ? 'var(--leaf)' : 'var(--bad)'} strokeWidth={2} />}
            {verts.map((v, i) => (
              <circle key={i} cx={v[0]} cy={v[1]} r={n > 40 ? 1.8 : 3} fill="var(--text)" />
            ))}
          </svg>
          <div className="wgtout" aria-live="polite">
            <p className={can ? 'okline' : 'badline'}>
              {n} {tc(L('sides:', 'sisi:'))} {can ? tc(L('the regular polygon can be built with a ruler and compass.', 'segi banyak beraturannya dapat dibangun dengan penggaris dan jangka.')) : tc(L('it cannot be built with a ruler and compass.', 'tidak dapat dibangun dengan penggaris dan jangka.'))}
            </p>
            <p className="small">
              n = {factorText}.{' '}
              {can
                ? tc(L('A power of 2 times different Fermat primes (3, 5, 17, 257, 65537): that is exactly the list of buildable polygons.', 'Pangkat dari 2 dikalikan bilangan prima Fermat yang berbeda (3, 5, 17, 257, 65537): itulah tepatnya daftar segi banyak yang dapat dibangun.'))
                : tc(L(`After taking out the 2s and each Fermat prime once, ${f.rest} is left over: it is a prime that is not a Fermat prime, or a Fermat prime used twice.`, `Setelah mengeluarkan 2 dan tiap bilangan prima Fermat satu kali, ${f.rest} tersisa: ia adalah bilangan prima yang bukan prima Fermat, atau prima Fermat yang dipakai dua kali.`))}
            </p>
            <p className="small">
              <Tex src="\varphi(n)" /> = {totient(n)}, {can ? tc(L('a power of 2.', 'pangkat dari 2.')) : tc(L('not a power of 2.', 'bukan pangkat dari 2.'))} {tc(L('Central angle', 'Sudut pusat'))}: 360° / {n} = {fmt(central, sep, 4)}°.
            </p>
          </div>
        </>
      )}
      <p className="small">
        {tc(L('Buildable up to 120 sides:', 'Dapat dibangun sampai 120 sisi:'))} {list.join(', ')}.
      </p>
      <p className="small muted">{tc(L('Only five Fermat primes are known: 3, 5, 17, 257 and 65537.', 'Hanya lima bilangan prima Fermat yang diketahui: 3, 5, 17, 257, dan 65537.'))}</p>
    </Frame>
  )
}
