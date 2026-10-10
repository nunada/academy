import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { parseRational } from '../../lib/realnum'
import { ratDiv } from '../../lib/rationals'
import { squareFreeParts } from '../../lib/irrational'
import { anglesDeg, area, classify, distSq, pt, rat, shoelaceTerms, type Pt, type Rat, type Report, type Shape } from '../../lib/quadrilateral'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const num = (r: Rat): number => Number(r.n) / Number(r.d)
const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 9999n && r.d <= 99n
const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const LETTERS = ['A', 'B', 'C', 'D']

/** The length of a segment whose squared length is `sq`, exactly: √(n/d) = √(nd)/d, with the square factor pulled out. */
function lengthTex(sq: Rat): string {
  if (sq.n === 0n) return '0'
  const { k, m } = squareFreeParts(sq.n * sq.d)
  const coef = ratDiv(rat(k, 1n), rat(sq.d, 1n))
  if (m === 1n) return ratTex(coef)
  return coef.n === 1n && coef.d === 1n ? `\\sqrt{${m}}` : `${ratTex(coef)}\\sqrt{${m}}`
}

const NAMES: Record<Shape, Loc> = {
  square: L('square', 'persegi'),
  rectangle: L('rectangle', 'persegi panjang'),
  rhombus: L('rhombus', 'belah ketupat'),
  parallelogram: L('parallelogram', 'jajargenjang'),
  kite: L('kite', 'layang-layang'),
  'isosceles-trapezoid': L('isosceles trapezoid', 'trapesium sama kaki'),
  trapezoid: L('trapezoid', 'trapesium'),
  dart: L('dart (a concave kite)', 'layang-layang cekung'),
  convex: L('general convex quadrilateral', 'segiempat cembung biasa'),
  concave: L('concave quadrilateral', 'segiempat cekung'),
  crossed: L('crossed quadrilateral (a bow-tie)', 'segiempat bersilang (bentuk pita)'),
  degenerate: L('not a quadrilateral', 'bukan segiempat'),
}

const PRESETS: { id: Shape; pts: [number, number][] }[] = [
  { id: 'square', pts: [[0, 0], [4, 0], [4, 4], [0, 4]] },
  { id: 'rectangle', pts: [[0, 0], [6, 0], [6, 4], [0, 4]] },
  { id: 'rhombus', pts: [[4, 0], [8, 3], [4, 6], [0, 3]] },
  { id: 'parallelogram', pts: [[0, 0], [6, 0], [8, 4], [2, 4]] },
  { id: 'kite', pts: [[0, 0], [3, 2], [0, 7], [-3, 2]] },
  { id: 'trapezoid', pts: [[0, 0], [8, 0], [5, 4], [1, 4]] },
  { id: 'isosceles-trapezoid', pts: [[0, 0], [8, 0], [6, 4], [2, 4]] },
  { id: 'dart', pts: [[0, 0], [4, 2], [0, 4], [1, 2]] },
  { id: 'crossed', pts: [[0, 0], [4, 4], [4, 0], [0, 4]] },
  { id: 'convex', pts: [[0, 0], [5, 1], [6, 5], [-1, 3]] },
]

/** The quadrilateral ABCD drawn to scale, with the diagonals and the right angles on request. */
function QuadSvg({ pts, diagonals = false, label }: { pts: Pt[]; diagonals?: boolean; label: string }) {
  const f = pts.map((p) => [num(p.x), num(p.y)])
  const xs = f.map((p) => p[0])
  const ys = f.map((p) => p[1])
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const wx = Math.max(...xs) - minX || 1
  const wy = Math.max(...ys) - minY || 1
  const W = 320
  const H = 250
  const pad = 36
  const sc = Math.min((W - 2 * pad) / wx, (H - 2 * pad) / wy)
  const px = (x: number) => (W - wx * sc) / 2 + (x - minX) * sc
  const py = (y: number) => H - ((H - wy * sc) / 2 + (y - minY) * sc)
  const s = f.map(([x, y]) => [px(x), py(y)])
  const cx = s.reduce((a, p) => a + p[0], 0) / 4
  const cy = s.reduce((a, p) => a + p[1], 0) / 4
  const path = s.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ' Z'
  // A small square at every vertex where the two sides are exactly perpendicular.
  const marks = pts.map((p, i) => {
    const prev = pts[(i + 3) % 4]
    const next = pts[(i + 1) % 4]
    const ux = num(prev.x) - num(p.x)
    const uy = num(prev.y) - num(p.y)
    const vx = num(next.x) - num(p.x)
    const vy = num(next.y) - num(p.y)
    if (!isRight(prev, p, next)) return null
    const lu = Math.hypot(ux, uy) || 1
    const lv = Math.hypot(vx, vy) || 1
    const a: [number, number] = [(ux / lu) * 11, (-uy / lu) * 11]
    const b: [number, number] = [(vx / lv) * 11, (-vy / lv) * 11]
    const [x0, y0] = s[i]
    return `M${(x0 + a[0]).toFixed(1)} ${(y0 + a[1]).toFixed(1)} L${(x0 + a[0] + b[0]).toFixed(1)} ${(y0 + a[1] + b[1]).toFixed(1)} L${(x0 + b[0]).toFixed(1)} ${(y0 + b[1]).toFixed(1)}`
  })
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="quadsvg" role="img" aria-label={label}>
      <path d={path} className="quadfill" />
      {diagonals && (
        <>
          <line x1={s[0][0]} y1={s[0][1]} x2={s[2][0]} y2={s[2][1]} className="quaddiag" />
          <line x1={s[1][0]} y1={s[1][1]} x2={s[3][0]} y2={s[3][1]} className="quaddiag" />
        </>
      )}
      {marks.map((m, i) => m && <path key={i} d={m} className="quadright" />)}
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
    </svg>
  )
}

/** Is the angle at p, between the sides to prev and to next, exactly a right angle? */
function isRight(prev: Pt, p: Pt, next: Pt): boolean {
  const d = add(mul(sub(prev.x, p.x), sub(next.x, p.x)), mul(sub(prev.y, p.y), sub(next.y, p.y)))
  return d.n === 0n
}
const sub = (a: Rat, b: Rat): Rat => rat(a.n * b.d - b.n * a.d, a.d * b.d)
const add = (a: Rat, b: Rat): Rat => rat(a.n * b.d + b.n * a.d, a.d * b.d)
const mul = (a: Rat, b: Rat): Rat => rat(a.n * b.n, a.d * b.d)

/** Four rows of x and y fields, one for each vertex. */
function PointFields({ vals, set }: { vals: string[]; set: (i: number, s: string) => void }) {
  return (
    <div className="quadpts">
      {LETTERS.map((l, i) => (
        <div key={l} className="inrow">
          <b className="quadvertex">{l}</b>
          <label className="lbl">
            x <input value={vals[2 * i]} aria-label={`${l} x`} onChange={(e) => set(2 * i, e.target.value)} />
          </label>
          <label className="lbl">
            y <input value={vals[2 * i + 1]} aria-label={`${l} y`} onChange={(e) => set(2 * i + 1, e.target.value)} />
          </label>
        </div>
      ))}
    </div>
  )
}

function useVertices(initial: [number, number][], lang: 'en' | 'id') {
  const fmt = (n: number) => (lang === 'id' ? String(n).replace('.', ',') : String(n))
  const [vals, setVals] = useState<string[]>(initial.flatMap(([x, y]) => [fmt(x), fmt(y)]))
  const parsed = vals.map((v) => parseRational(v))
  const ok = parsed.every(small)
  const pts: Pt[] | null = ok ? [0, 1, 2, 3].map((i) => ({ x: parsed[2 * i] as Rat, y: parsed[2 * i + 1] as Rat })) : null
  return {
    pts,
    vals,
    set: (i: number, s: string) => setVals((v) => v.map((x, j) => (j === i ? s : x))),
    load: (p: [number, number][]) => setVals(p.flatMap(([x, y]) => [fmt(x), fmt(y)])),
  }
}

const BAD = L('Type a number or a fraction such as 3, -1.5 or 7/2 in every box (absolute value up to 9999).', 'Ketik bilangan atau pecahan seperti 3, -1,5, atau 7/2 di setiap kotak (nilai mutlak sampai 9999).')

const yes = (b: boolean, tc: (l: Loc) => string): string => (b ? '✓ ' + tc(L('yes', 'ya')) : '✗ ' + tc(L('no', 'tidak')))

/* ----------------------------------------------------------------- classifier */

export function QuadClassifier() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const v = useVertices(PRESETS[3].pts, lang)

  let body
  if (!v.pts) body = <p className="noline">{tc(BAD)}</p>
  else {
    const p = v.pts as [Pt, Pt, Pt, Pt]
    const r: Report = classify(p)
    const sides = [0, 1, 2, 3].map((i) => `${LETTERS[i]}${LETTERS[(i + 1) % 4]}`)
    if (r.shape === 'degenerate')
      body = (
        <>
          <QuadSvg pts={p} label={tc(L('The four points', 'Keempat titik'))} />
          <p className="noline">{tc(L('These four points do not make a quadrilateral: two are the same, or three in a row lie on one line, so the figure collapses to a triangle or a segment.', 'Keempat titik ini tidak membentuk segiempat: dua titik sama, atau tiga titik berurutan segaris, sehingga bangunnya runtuh menjadi segitiga atau ruas garis.'))}</p>
        </>
      )
    else if (r.shape === 'crossed')
      body = (
        <>
          <QuadSvg pts={p} label={tc(L('A crossed quadrilateral', 'Segiempat bersilang'))} />
          <p className="noline">{tc(L('Two opposite sides cross each other, so the path A to B to C to D is a bow-tie, not a simple quadrilateral. Swap two vertices to uncross it.', 'Dua sisi berhadapan saling berpotongan, sehingga lintasan A ke B ke C ke D berbentuk pita, bukan segiempat sederhana. Tukar dua titik untuk menghilangkan silangnya.'))}</p>
        </>
      )
    else {
      const angles = anglesDeg(p)
      const alsoNames = r.names.filter((n) => n !== r.shape)
      body = (
        <>
          <QuadSvg pts={p} diagonals label={tc(L('The quadrilateral ABCD with its diagonals', 'Segiempat ABCD dengan diagonalnya'))} />
          <p className="okline">
            <b>ABCD</b> {tc(L('is a', 'adalah'))} <b>{tc(NAMES[r.shape])}</b>
            {alsoNames.length > 0 && (
              <>
                {' '}
                ({tc(L('also a', 'juga'))} {alsoNames.map((n) => tc(NAMES[n])).join(', ')})
              </>
            )}
            .
          </p>
          <div className="gridwrap">
            <table className="rtable">
              <tbody>
                <tr>
                  <th>{tc(L('Side', 'Sisi'))}</th>
                  {sides.map((s, i) => (
                    <td key={s}>
                      {s} = <Tex src={lengthTex(r.sideSq[i])} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>{tc(L('Diagonal', 'Diagonal'))}</th>
                  <td>
                    AC = <Tex src={lengthTex(r.diagSq[0])} />
                  </td>
                  <td>
                    BD = <Tex src={lengthTex(r.diagSq[1])} />
                  </td>
                  <td colSpan={2} />
                </tr>
                <tr>
                  <th>{tc(L('Angle', 'Sudut'))}</th>
                  {angles.map((a, i) => (
                    <td key={i}>
                      ∠{LETTERS[i]} ≈ {dec(a.toFixed(1), sep)}°
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="steps">
            <li>
              {tc(L('Pairs of parallel opposite sides', 'Pasang sisi berhadapan yang sejajar'))}: <b>{r.parallelPairs}</b>
            </li>
            <li>
              {tc(L('Right angles', 'Sudut siku-siku'))}: <b>{r.rightAngles}</b>
            </li>
            <li>
              {tc(L('Opposite sides equal', 'Sisi berhadapan sama panjang'))}: {yes(r.oppositeSidesEqual, tc)} · {tc(L('all four sides equal', 'keempat sisi sama panjang'))}: {yes(r.allSidesEqual, tc)}
            </li>
            <li>
              {tc(L('Diagonals equal', 'Diagonal sama panjang'))}: {yes(r.diagonalsEqual, tc)} · {tc(L('perpendicular', 'tegak lurus'))}: {yes(r.diagonalsPerpendicular, tc)} · {tc(L('bisect each other', 'saling membagi dua'))}: {yes(r.diagonalsBisect, tc)}
            </li>
            {r.convex && (
              <li>
                {tc(L('Lines of symmetry', 'Sumbu simetri'))}: <b>{r.lines}</b> · {tc(L('order of rotational symmetry', 'orde simetri putar'))}: <b>{r.rotation}</b>
              </li>
            )}
            <li>
              {tc(L('Shape', 'Bentuk'))}: {r.convex ? tc(L('convex (every diagonal lies inside)', 'cembung (kedua diagonal berada di dalam)')) : tc(L('concave (one angle is more than 180°)', 'cekung (satu sudut lebih dari 180°)'))}
            </li>
          </ul>
        </>
      )
    }
  }

  return (
    <Frame name="quadclassify">
      <PointFields vals={v.vals} set={v.set} />
      <div className="chips">
        {PRESETS.map((p) => (
          <button key={p.id} className="chip ghost" onClick={() => v.load(p.pts)}>
            {tc(NAMES[p.id])}
          </button>
        ))}
      </div>
      <p className="small muted">{tc(L('Give the vertices in order round the shape: A, B, C, D, then back to A.', 'Beri titik sudut berurutan mengelilingi bangun: A, B, C, D, lalu kembali ke A.'))}</p>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------ properties */

const TYPES: { id: Shape; pts: [number, number][]; area: string; perimeter: string }[] = [
  { id: 'square', pts: PRESETS[0].pts, area: 's^2', perimeter: '4s' },
  { id: 'rectangle', pts: PRESETS[1].pts, area: 'lw', perimeter: '2(l+w)' },
  { id: 'rhombus', pts: PRESETS[2].pts, area: '\\dfrac{d_1d_2}{2}', perimeter: '4s' },
  { id: 'parallelogram', pts: PRESETS[3].pts, area: 'bh', perimeter: '2(a+b)' },
  { id: 'kite', pts: PRESETS[4].pts, area: '\\dfrac{d_1d_2}{2}', perimeter: '2(a+b)' },
  { id: 'trapezoid', pts: PRESETS[5].pts, area: '\\dfrac{(a+b)h}{2}', perimeter: 'a+b+c+d' },
  { id: 'isosceles-trapezoid', pts: PRESETS[6].pts, area: '\\dfrac{(a+b)h}{2}', perimeter: 'a+b+2c' },
]

export function QuadProperties() {
  const { tc } = useI18n()
  const sep = useSep()
  const [pick, setPick] = useState<Shape>('rhombus')
  const t = TYPES.find((x) => x.id === pick) ?? TYPES[0]
  const p = t.pts.map(([x, y]) => pt(x, y)) as [Pt, Pt, Pt, Pt]
  const r = classify(p)
  const angles = anglesDeg(p)
  const rows: [Loc, string][] = [
    [L('Pairs of parallel opposite sides', 'Pasang sisi berhadapan yang sejajar'), String(r.parallelPairs)],
    [L('Right angles', 'Sudut siku-siku'), String(r.rightAngles)],
    [L('Opposite sides equal', 'Sisi berhadapan sama panjang'), yes(r.oppositeSidesEqual, tc)],
    [L('All four sides equal', 'Keempat sisi sama panjang'), yes(r.allSidesEqual, tc)],
    [L('Diagonals equal', 'Diagonal sama panjang'), yes(r.diagonalsEqual, tc)],
    [L('Diagonals perpendicular', 'Diagonal tegak lurus'), yes(r.diagonalsPerpendicular, tc)],
    [L('Diagonals bisect each other', 'Diagonal saling membagi dua'), yes(r.diagonalsBisect, tc)],
    [L('Lines of symmetry', 'Sumbu simetri'), String(r.lines)],
    [L('Order of rotational symmetry (1 means none)', 'Orde simetri putar (1 berarti tidak ada)'), String(r.rotation)],
  ]
  const also = r.names.filter((n) => n !== r.shape)
  return (
    <Frame name="quadprops">
      <div className="chips">
        {TYPES.map((x) => (
          <button key={x.id} className={`chip ${x.id === pick ? 'on' : ''}`} onClick={() => setPick(x.id)} aria-pressed={x.id === pick}>
            {tc(NAMES[x.id])}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        <QuadSvg pts={p} diagonals label={tc(L(`A ${NAMES[pick].en} with its diagonals`, `${NAMES[pick].id} dengan diagonalnya`))} />
        <p>
          <b>{tc(NAMES[pick])}</b>
          {also.length > 0 && (
            <>
              {' '}
              — {tc(L('also a', 'juga'))} {also.map((n) => tc(NAMES[n])).join(', ')}
            </>
          )}
        </p>
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              {rows.map(([k, val]) => (
                <tr key={k.en}>
                  <th>{tc(k)}</th>
                  <td>{val}</td>
                </tr>
              ))}
              <tr>
                <th>{tc(L('Angles in this drawing', 'Sudut pada gambar ini'))}</th>
                <td>{angles.map((a, i) => `∠${LETTERS[i]} ≈ ${dec(a.toFixed(0), sep)}°`).join(' · ')}</td>
              </tr>
              <tr>
                <th>{tc(L('Area', 'Luas'))}</th>
                <td>
                  <Tex src={t.area} />
                  {' '}
                  <span className="muted">
                    ({tc(L('here', 'di sini'))} {dec(num(r.area).toString(), sep)})
                  </span>
                </td>
              </tr>
              <tr>
                <th>{tc(L('Perimeter', 'Keliling'))}</th>
                <td>
                  <Tex src={t.perimeter} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------- area, perimeter */

export function QuadArea() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const v = useVertices(PRESETS[3].pts, lang)

  let body
  if (!v.pts) body = <p className="noline">{tc(BAD)}</p>
  else {
    const p = v.pts as [Pt, Pt, Pt, Pt]
    const r = classify(p)
    const { terms, sum } = shoelaceTerms(p)
    const total = area(p)
    const perim = r.sideSq.reduce((a, s) => a + Math.sqrt(num(s)), 0)
    const termTex = terms.map((t, i) => `${LETTERS[i]}${LETTERS[(i + 1) % 4]}:\\ ${ratTex(t)}`)
    body = (
      <>
        <QuadSvg pts={p} label={tc(L('The quadrilateral ABCD', 'Segiempat ABCD'))} />
        <p className="small muted">
          {tc(L('Each term is x of one vertex times y of the next, minus x of the next times y of this one:', 'Tiap suku adalah x suatu titik kali y titik berikutnya, dikurangi x titik berikutnya kali y titik itu:'))}
        </p>
        <p>
          <Tex src={termTex.join(',\\quad ')} />
        </p>
        <p>
          <Tex src={`\\text{sum}=${terms.map(ratTex).join('+')}=${ratTex(sum)},\\qquad \\text{area}=\\tfrac12\\left|${ratTex(sum)}\\right|=${ratTex(total)}`} />
        </p>
        {r.shape === 'crossed' || r.shape === 'degenerate' ? (
          <p className="noline">
            {r.shape === 'crossed'
              ? tc(L('This quadrilateral crosses itself, so the shoelace sum adds the two lobes with opposite signs and is not the area of anything.', 'Segiempat ini memotong dirinya sendiri, sehingga jumlah tali sepatu menambahkan kedua kelopak dengan tanda berlawanan dan bukan luas apa pun.'))
              : tc(L('The points collapse (two are equal, or three in a row are collinear), so there is no quadrilateral to measure.', 'Titik-titiknya runtuh (dua sama, atau tiga berurutan segaris), sehingga tidak ada segiempat untuk diukur.'))}
          </p>
        ) : (
          <p className="okline">
            {tc(L('Area', 'Luas'))} = <b>{dec(num(total).toString(), sep)}</b> · {tc(L('perimeter', 'keliling'))} ≈ <b>{dec(perim.toFixed(2), sep)}</b> ·{' '}
            {sum.n > 0n ? tc(L('the vertices run counterclockwise', 'titik-titiknya berlawanan arah jarum jam')) : tc(L('the vertices run clockwise', 'titik-titiknya searah jarum jam'))}
          </p>
        )}
        <p className="small muted">
          {tc(L('Sides squared', 'Kuadrat sisi'))}: <Tex src={r.sideSq.map((s, i) => `${LETTERS[i]}${LETTERS[(i + 1) % 4]}^2=${ratTex(s)}`).join(',\\ ')} />
          {' · '}
          {tc(L('exact sides', 'sisi eksak'))}: <Tex src={[0, 1, 2, 3].map((i) => `${LETTERS[i]}${LETTERS[(i + 1) % 4]}=${lengthTex(distSq(p[i], p[(i + 1) % 4]))}`).join(',\\ ')} />
        </p>
      </>
    )
  }

  return (
    <Frame name="quadarea">
      <PointFields vals={v.vals} set={v.set} />
      <div className="chips">
        {[PRESETS[1], PRESETS[3], PRESETS[5], PRESETS[7], PRESETS[9]].map((p) => (
          <button key={p.id} className="chip ghost" onClick={() => v.load(p.pts)}>
            {tc(NAMES[p.id])}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}
