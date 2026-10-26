import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { cellsFromRows, crossSection, cubeNets, flatten, foldNet, measures, polygonKind, scaleFactors, type Cell, type P3, type PolygonKind } from '../../lib/cube'
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

/** The oblique picture of a point of the cube: x to the right, z up, y going back and up to the right. */
const K = 0.4
const proj = (p: P3): [number, number] => [p[0] + K * p[1], p[2] + 0.8 * K * p[1]]

/** The twelve edges of the unit cube, with the ones that meet the hidden corner (0, 1, 0) marked, for drawing dashed. */
const CUBE_EDGES: { a: P3; b: P3; hidden: boolean }[] = (() => {
  const out: { a: P3; b: P3; hidden: boolean }[] = []
  const pts: P3[] = []
  for (let i = 0; i < 8; i++) pts.push([i & 1, (i >> 1) & 1, (i >> 2) & 1])
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const diff = (i ^ j).toString(2).split('1').length - 1
      if (diff === 1) out.push({ a: pts[i], b: pts[j], hidden: (pts[i][0] === 0 && pts[i][1] === 1 && pts[i][2] === 0) || (pts[j][0] === 0 && pts[j][1] === 1 && pts[j][2] === 0) })
    }
  return out
})()

/** Pixel mapping for the oblique picture of a cube of side 1 in a box of `size` pixels. */
function viewOf(size: number, pad = 16) {
  const w = 1 + K
  const h = 1 + 0.8 * K
  const s = (size - 2 * pad) / Math.max(w, h)
  return { X: (x: number): number => pad + x * s, Y: (y: number): number => size - pad - y * s, s }
}

/* -------------------------------------------------------------------------------- the net */

const COLS = 6
const ROWS = 6

/** A net as the grid shows it: moved so that it sits a little in from the corner. */
const gridKey = (r: number, c: number): string => `${r},${c}`
const fromCells = (cells: Cell[]): Set<string> => new Set(cells.map(([r, c]) => gridKey(r + 1, c + 1)))

/** The die number of each face: opposite faces add up to 7, as on a real die. The faces come in opposite pairs 0-1, 2-3 and 4-5. */
const DIE = [1, 6, 2, 5, 3, 4]
const PAIR_COLOR = ['var(--coral)', 'var(--gold)', 'var(--brand)']

const NET_NAMES: Record<string, string> = { '4-1-1': '1-4-1', '3-2-1': '2-3-1', '2-2-2': '2-2-2', '3-3': '3-3' }

interface NetPreset {
  name: Loc
  cells: Set<string>
}

function buildPresets(): { nets: NetPreset[]; bad: NetPreset[] } {
  const seen: Record<string, number> = {}
  const nets = cubeNets().map(({ cells, type }) => {
    seen[type] = (seen[type] ?? 0) + 1
    const letter = 'abcdef'[seen[type] - 1]
    const base = NET_NAMES[type]
    return { name: L(`net ${base}${type === '2-2-2' || type === '3-3' ? '' : ' ' + letter}`, `jaring ${base}${type === '2-2-2' || type === '3-3' ? '' : ' ' + letter}`), cells: fromCells(cells) }
  })
  const bad: NetPreset[] = [
    { name: L('a row of six', 'satu baris enam'), cells: fromCells(cellsFromRows(['######'])) },
    { name: L('a 2 × 3 block', 'blok 2 × 3'), cells: fromCells(cellsFromRows(['###', '###'])) },
    { name: L('five in a row, one above', 'lima berderet, satu di atas'), cells: fromCells(cellsFromRows(['.#....', '#####.'])) },
  ]
  return { nets, bad }
}

export function CubeNet() {
  const { tc } = useI18n()
  const presets = useMemo(buildPresets, [])
  const [on, setOn] = useState<Set<string>>(presets.nets[0].cells)
  const cells: Cell[] = [...on].map((k) => k.split(',').map(Number) as Cell)
  const result = foldNet(cells)
  const toggle = (r: number, c: number) => {
    const next = new Set(on)
    const k = gridKey(r, c)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    setOn(next)
  }
  const size = 40
  const W = COLS * size
  const H = ROWS * size
  const same = (a: Set<string>, b: Set<string>): boolean => a.size === b.size && [...a].every((k) => b.has(k))
  const overlap = !result.ok && result.reason === 'overlap' ? new Set(result.cells.map(([r, c]) => gridKey(r, c))) : new Set<string>()
  const loopAt = !result.ok && result.reason === 'loop' ? gridKey(result.at[0], result.at[1]) : ''
  const message = (): string => {
    if (result.ok) return tc(L('This folds into a cube. Each square carries the number of the face it becomes, numbered like a die: opposite faces add up to 7.', 'Ini terlipat menjadi kubus. Tiap persegi membawa nomor sisi yang menjadi, bernomor seperti dadu: sisi yang berhadapan berjumlah 7.'))
    if (result.reason === 'count') return tc(L(`A net has exactly six squares, and this has ${result.count}.`, `Jaring memiliki tepat enam persegi, dan ini memiliki ${result.count}.`))
    if (result.reason === 'disconnected') return tc(L('The squares must be joined edge to edge, with no gap: they have to be able to stay in one piece when folded.', 'Persegi-persegi harus bersambung sisi ke sisi, tanpa celah: harus tetap utuh saat dilipat.'))
    if (result.reason === 'loop') return tc(L('Squares that make a 2 × 2 block cannot all lie flat on a cube: going once round the corner brings you back on a different face.', 'Persegi yang membentuk blok 2 × 2 tak dapat semuanya terletak datar pada kubus: sekali mengelilingi sudutnya membawamu kembali ke sisi yang berbeda.'))
    return tc(L('Two squares would land on the same face (marked in red), so one face of the cube would be left uncovered.', 'Dua persegi akan mendarat pada sisi yang sama (diberi warna merah), sehingga satu sisi kubus tak tertutup.'))
  }
  return (
    <Frame name="cbnet">
      <div className="chips">
        {presets.nets.map((p, i) => (
          <button key={i} className={`chip ghost ${same(on, p.cells) ? 'on' : ''}`} onClick={() => setOn(p.cells)} aria-pressed={same(on, p.cells)}>
            {tc(p.name)}
          </button>
        ))}
      </div>
      <div className="chips">
        {presets.bad.map((p, i) => (
          <button key={i} className={`chip ghost ${same(on, p.cells) ? 'on' : ''}`} onClick={() => setOn(p.cells)} aria-pressed={same(on, p.cells)}>
            {tc(p.name)}
          </button>
        ))}
        <button className="chip ghost" onClick={() => setOn(new Set())}>
          {tc(L('clear', 'kosongkan'))}
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={tc(L('A grid: press a square to add or remove it', 'Sebuah kisi: tekan persegi untuk menambah atau menghapusnya'))} style={{ width: '100%', maxWidth: 300, display: 'block', margin: '8px auto' }}>
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const k = gridKey(r, c)
            const filled = on.has(k)
            const face = result.ok && filled ? (result.face.get(k) as number) : -1
            const bad = overlap.has(k) || loopAt === k
            return (
              <g key={k} onClick={() => toggle(r, c)} style={{ cursor: 'pointer' }}>
                <rect
                  x={c * size + 1}
                  y={r * size + 1}
                  width={size - 2}
                  height={size - 2}
                  rx={4}
                  fill={filled ? (face >= 0 ? PAIR_COLOR[Math.floor(face / 2)] : 'var(--brand)') : 'var(--surface)'}
                  fillOpacity={filled ? (face >= 0 ? 0.35 : 0.15) : 1}
                  stroke={bad ? 'var(--bad)' : filled ? 'var(--text)' : 'var(--border)'}
                  strokeWidth={bad ? 3 : filled ? 1.6 : 1}
                  role="button"
                  aria-pressed={filled}
                  aria-label={`${tc(L('row', 'baris'))} ${r + 1}, ${tc(L('column', 'kolom'))} ${c + 1}`}
                />
                {face >= 0 && (
                  <text x={c * size + size / 2} y={r * size + size / 2 + 5} fontSize={16} fontWeight={700} textAnchor="middle" fill="var(--text)" pointerEvents="none">
                    {DIE[face]}
                  </text>
                )}
              </g>
            )
          }),
        )}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className={result.ok ? 'okline' : 'badline'} style={{ overflowWrap: 'anywhere' }}>
          {message()}
        </p>
        {result.ok && (
          <p className="small muted">
            {tc(L('Opposite pairs: 1 and 6, 2 and 5, 3 and 4. In the net they are never next to each other.', 'Pasangan berhadapan: 1 dan 6, 2 dan 5, 3 dan 4. Pada jaring, keduanya tak pernah bersebelahan.'))}
          </p>
        )}
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------------- measurements */

export function CubeMeasure() {
  const { tc } = useI18n()
  const sep = useSep()
  const [a, setA] = useState(4)
  const m = measures(a)
  const f = viewOf(240)
  const p = (q: P3): string => {
    const [x, y] = proj(q)
    return `${f.X(x).toFixed(1)},${f.Y(y).toFixed(1)}`
  }
  const d = scaleFactors(2)
  const whole = Number.isInteger(a)
  const label = `${tc(L('A cube with edge', 'Kubus dengan rusuk'))} ${short(a, sep)}: ${tc(L('surface', 'luas permukaan'))} ${fmt(m.surface, sep, 2)}, ${tc(L('volume', 'volume'))} ${fmt(m.volume, sep, 2)}`
  return (
    <Frame name="cbmeasure">
      <label className="lbl slider">
        a = <b>{short(a, sep)}</b>
        <input type="range" min={1} max={12} step={0.5} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
      </label>
      <svg viewBox="0 0 240 240" role="img" aria-label={label} style={{ width: '100%', maxWidth: 280, display: 'block', margin: '6px auto' }}>
        <polygon points={`${p([0, 0, 0])} ${p([1, 0, 0])} ${p([1, 0, 1])} ${p([0, 0, 1])}`} fill="var(--brand)" fillOpacity={0.12} />
        {CUBE_EDGES.map((e, i) => (
          <line key={i} x1={f.X(proj(e.a)[0])} y1={f.Y(proj(e.a)[1])} x2={f.X(proj(e.b)[0])} y2={f.Y(proj(e.b)[1])} stroke="var(--text)" strokeWidth={e.hidden ? 1 : 2} strokeDasharray={e.hidden ? '4 4' : undefined} strokeLinecap="round" />
        ))}
        <line x1={f.X(proj([0, 0, 0])[0])} y1={f.Y(proj([0, 0, 0])[1])} x2={f.X(proj([1, 0, 1])[0])} y2={f.Y(proj([1, 0, 1])[1])} stroke="var(--coral)" strokeWidth={3} strokeLinecap="round" />
        <line x1={f.X(proj([0, 0, 0])[0])} y1={f.Y(proj([0, 0, 0])[1])} x2={f.X(proj([1, 1, 1])[0])} y2={f.Y(proj([1, 1, 1])[1])} stroke="var(--gold)" strokeWidth={3} strokeLinecap="round" />
        <circle cx={f.X(proj([0, 0, 0])[0])} cy={f.Y(proj([0, 0, 0])[1])} r={3.5} fill="var(--text)" />
        <circle cx={f.X(proj([1, 0, 1])[0])} cy={f.Y(proj([1, 0, 1])[1])} r={3.5} fill="var(--coral)" />
        <circle cx={f.X(proj([1, 1, 1])[0])} cy={f.Y(proj([1, 1, 1])[1])} r={3.5} fill="var(--gold)" />
        <text x={f.X(0.5)} y={f.Y(-0.02) + 14} fontSize={12} textAnchor="middle" fill="var(--text)" fontStyle="italic">
          a
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <td>{tc(L('one face', 'satu sisi'))}</td>
                <td>
                  <Tex src="a^2" /> = <b>{fmt(m.faceArea, sep, 2)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('surface area, six faces', 'luas permukaan, enam sisi'))}</td>
                <td>
                  <Tex src="6a^2" /> = <b>{fmt(m.surface, sep, 2)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('volume', 'volume'))}</td>
                <td>
                  <Tex src="a^3" /> = <b>{fmt(m.volume, sep, 3)}</b>
                  {whole && a <= 12 ? ` (${tc(L('unit cubes', 'kubus satuan'))}: ${a ** 3})` : ''}
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--coral)' }}>{tc(L('diagonal of a face', 'diagonal sisi'))}</td>
                <td>
                  <Tex src="a\sqrt2" /> = <b>{fmt(m.faceDiagonal, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--gold)' }}>{tc(L('diagonal of the cube', 'diagonal ruang'))}</td>
                <td>
                  <Tex src="a\sqrt3" /> = <b>{fmt(m.spaceDiagonal, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('sphere inside / through the corners', 'bola di dalam / melalui sudut'))}</td>
                <td>
                  r = <b>{fmt(m.inRadius, sep, 3)}</b> / <b>{fmt(m.circumRadius, sep, 3)}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
          {tc(L(`Double the edge to ${short(2 * a, sep)}: the surface area becomes ${fmt(measures(2 * a).surface, sep, 2)}, ${d.area} times as much, and the volume ${fmt(measures(2 * a).volume, sep, 2)}, ${d.volume} times as much. If a is in decimetres, the volume is in litres.`, `Gandakan rusuknya menjadi ${short(2 * a, sep)}: luas permukaan menjadi ${fmt(measures(2 * a).surface, sep, 2)}, ${d.area} kali lipat, dan volume ${fmt(measures(2 * a).volume, sep, 2)}, ${d.volume} kali lipat. Bila a dalam desimeter, volumenya dalam liter.`))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------------- slicing */

interface Orientation {
  name: Loc
  tex: string
  n: P3
}
const ORIENTATIONS: Orientation[] = [
  { name: L('parallel to a face', 'sejajar sebuah sisi'), tex: 'z=t', n: [0, 0, 1] },
  { name: L('parallel to an edge', 'sejajar sebuah rusuk'), tex: 'x+y=t', n: [1, 1, 0] },
  { name: L('across a corner', 'melintasi sebuah sudut'), tex: 'x+y+z=t', n: [1, 1, 1] },
  { name: L('tilted', 'miring'), tex: 'x+2y+3z=t', n: [1, 2, 3] },
]

const KIND_NAME: Record<PolygonKind, Loc> = {
  none: L('no cut: the plane misses the cube', 'tidak ada irisan: bidang tak menyentuh kubus'),
  point: L('a single point', 'satu titik'),
  segment: L('a line segment', 'satu ruas garis'),
  'equilateral triangle': L('an equilateral triangle', 'segitiga sama sisi'),
  'isosceles triangle': L('an isosceles triangle', 'segitiga sama kaki'),
  'scalene triangle': L('a scalene triangle', 'segitiga sembarang'),
  square: L('a square', 'persegi'),
  rectangle: L('a rectangle', 'persegi panjang'),
  rhombus: L('a rhombus', 'belah ketupat'),
  parallelogram: L('a parallelogram', 'jajar genjang'),
  trapezoid: L('a trapezoid', 'trapesium'),
  quadrilateral: L('a quadrilateral', 'segiempat'),
  pentagon: L('a pentagon', 'segilima'),
  hexagon: L('a hexagon', 'segienam'),
  'regular hexagon': L('a regular hexagon', 'segienam beraturan'),
}

export function CubeSlice() {
  const { tc } = useI18n()
  const sep = useSep()
  const [oi, setOi] = useState(2)
  const [frac, setFrac] = useState(0.5)
  const o = ORIENTATIONS[oi]
  const top = o.n[0] + o.n[1] + o.n[2]
  const t = frac * top
  const s = crossSection(o.n, t)
  const kind = s ? polygonKind(s) : 'none'
  const f = viewOf(240)
  const px = (q: P3): [number, number] => {
    const [x, y] = proj(q)
    return [f.X(x), f.Y(y)]
  }
  const poly = s && s.points.length >= 3 ? s.points.map((q) => px(q).map((v) => v.toFixed(1)).join(',')).join(' ') : ''
  // the same polygon laid flat and fitted into a 200 × 200 picture
  const flat = s && s.points.length >= 3 ? flatten(s.points, o.n) : []
  const xs = flat.map((q) => q[0])
  const ys = flat.map((q) => q[1])
  const span = flat.length ? Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1e-9) : 1
  const sc = 150 / span
  const fx = (x: number): number => 20 + (x - (xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 0)) * sc + 80
  const fy = (y: number): number => 100 - (y - (ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : 0)) * sc
  const sides = s ? s.points.map((q, i) => Math.hypot(q[0] - s.points[(i + 1) % s.points.length][0], q[1] - s.points[(i + 1) % s.points.length][1], q[2] - s.points[(i + 1) % s.points.length][2])) : []
  const label = `${tc(L('The plane', 'Bidang'))} ${o.tex.replace('t', short(t, sep, 2))}: ${tc(KIND_NAME[kind])}`
  return (
    <Frame name="cbcut">
      <div className="chips">
        {ORIENTATIONS.map((q, i) => (
          <button key={i} className={`chip ghost ${oi === i ? 'on' : ''}`} onClick={() => setOi(i)} aria-pressed={oi === i}>
            {tc(q.name)} <Tex src={q.tex} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        t = <b>{short(t, sep, 2)}</b>
        <input type="range" min={0} max={1} step={0.005} value={frac} aria-label="t" onChange={(e) => setFrac(Number(e.target.value))} />
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        <svg viewBox="0 0 240 240" role="img" aria-label={label} style={{ width: '100%', maxWidth: 240 }}>
          {CUBE_EDGES.map((e, i) => (
            <line key={i} x1={px(e.a)[0]} y1={px(e.a)[1]} x2={px(e.b)[0]} y2={px(e.b)[1]} stroke="var(--text)" strokeWidth={e.hidden ? 1 : 1.6} strokeDasharray={e.hidden ? '4 4' : undefined} strokeLinecap="round" />
          ))}
          {poly && <polygon points={poly} fill="var(--coral)" fillOpacity={0.45} stroke="var(--coral)" strokeWidth={2.5} strokeLinejoin="round" />}
        </svg>
        <svg viewBox="0 0 240 200" role="img" aria-label={tc(L('The shape of the cut, laid flat', 'Bentuk irisan, dibentangkan'))} style={{ width: '100%', maxWidth: 240 }}>
          {flat.length >= 3 && (
            <>
              <polygon points={flat.map((q) => `${fx(q[0]).toFixed(1)},${fy(q[1]).toFixed(1)}`).join(' ')} fill="var(--coral)" fillOpacity={0.45} stroke="var(--coral)" strokeWidth={2.5} strokeLinejoin="round" />
              {flat.map((q, i) => (
                <circle key={i} cx={fx(q[0])} cy={fy(q[1])} r={3.5} fill="var(--text)" />
              ))}
            </>
          )}
        </svg>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {tc(L('The cut is', 'Irisannya adalah'))} <b>{tc(KIND_NAME[kind])}</b>
          {s && s.area > 0 ? (
            <>
              {', '}
              {s.sides} {tc(L('sides', 'sisi'))}, {tc(L('area', 'luas'))} <b>{fmt(s.area, sep, 4)}</b> a².
            </>
          ) : (
            '.'
          )}
        </p>
        {sides.length > 0 && s && s.area > 0 && (
          <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
            {tc(L('Side lengths, in units of a:', 'Panjang sisi, dalam satuan a:'))} {sides.map((x) => fmt(x, sep, 3)).join(' · ')}
          </p>
        )}
        <p className="small muted">{tc(L('At the middle of the range for x + y + z = t the cut is the regular hexagon, area 3√3/4 ≈ 1.299 a².', 'Di tengah rentang untuk x + y + z = t irisannya adalah segienam beraturan, luas 3√3/4 ≈ 1,299 a².'))}</p>
      </div>
    </Frame>
  )
}
