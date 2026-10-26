/** The cube: the numbers, the folding and the slicing behind the "Cube" article's widgets.
 *
 *   - `measures`, `exactMeasures`: edge, face and surface area, volume, the two diagonals, the spheres in and around it;
 *   - `vertices`, `edges`, `faces`, `euler`, `distancesFromVertex`, `grayWalk`: the cube as a set of eight corners whose coordinates are 0 or 1;
 *   - `foldNet`, `hexominoes`, `cubeNets`: which arrangements of six squares fold into a cube, found by rolling a cube over them;
 *   - `crossSection`, `flatten`, `polygonKind`: the shape in which a plane cuts the cube, with its corners and its area, laid flat, and named;
 *   - `sectionAreaFormula`: the same area from a closed formula (for the checker's sake, and for the article's);
 *   - `cbrtNewton`, `sumOfCubes`, `binomialCubePieces`: cube roots and cube numbers;
 *   - `distinctDice`, `rubikPositions`: counting the ways to label a cube, and the positions of a 3×3×3 puzzle.
 *
 *  The checker (tools/check-cube.mjs) tests all of it against references that do not use it: folding by turning unit squares through 90° about their shared
 *  edges in 3D coordinates (and the known counts, 35 hexominoes and 11 nets), cross-sections by Cavalieri's inclusion-exclusion formula for the volume cut off
 *  by a plane, the rotation group of the cube from rotation matrices, mpmath for cube roots, and Python's big integers. */

/* ------------------------------------------------------------------------- measures */

export interface Measures {
  edge: number
  faceArea: number
  surface: number
  volume: number
  /** the diagonal of a face, a√2, and of the cube, a√3 */
  faceDiagonal: number
  spaceDiagonal: number
  /** the sphere that touches every face, the one that touches every edge, the one through every vertex */
  inRadius: number
  midRadius: number
  circumRadius: number
}

export function measures(a: number): Measures {
  return {
    edge: a,
    faceArea: a * a,
    surface: 6 * a * a,
    volume: a * a * a,
    faceDiagonal: a * Math.SQRT2,
    spaceDiagonal: a * Math.sqrt(3),
    inRadius: a / 2,
    midRadius: a / Math.SQRT2,
    circumRadius: (a * Math.sqrt(3)) / 2,
  }
}

export interface ExactMeasures {
  faceArea: bigint
  surface: bigint
  volume: bigint
  /** the squares of the diagonals: 2a² and 3a², whole numbers when a is */
  faceDiagonalSquared: bigint
  spaceDiagonalSquared: bigint
}

/** Everything that stays a whole number when the edge is a whole number: no rounding anywhere. */
export function exactMeasures(a: bigint): ExactMeasures {
  return { faceArea: a * a, surface: 6n * a * a, volume: a * a * a, faceDiagonalSquared: 2n * a * a, spaceDiagonalSquared: 3n * a * a }
}

/** What happens to the surface area and the volume when every edge is multiplied by k: k² and k³. */
export const scaleFactors = (k: number): { length: number; area: number; volume: number } => ({ length: k, area: k * k, volume: k * k * k })

/** The fraction of the cube taken up by the largest sphere inside it, π/6, and the volume of the sphere through the corners as a multiple of the cube's, π√3/2. */
export const INSPHERE_FRACTION = Math.PI / 6
export const CIRCUMSPHERE_RATIO = (Math.PI * Math.sqrt(3)) / 2

/** The angle between two space diagonals, arccos(1/3), and between a space diagonal and a face, arctan(1/√2), in degrees. */
export const ANGLE_BETWEEN_SPACE_DIAGONALS = (Math.acos(1 / 3) * 180) / Math.PI
export const ANGLE_DIAGONAL_TO_FACE = (Math.atan(1 / Math.SQRT2) * 180) / Math.PI

/* ------------------------------------------------------------------------ the corners */

export type Corner = [0 | 1, 0 | 1, 0 | 1]

/** The eight corners: vertex i has x, y, z equal to the bits 0, 1, 2 of i. */
export const vertices = (): Corner[] => Array.from({ length: 8 }, (_, i) => [(i & 1) as 0 | 1, ((i >> 1) & 1) as 0 | 1, ((i >> 2) & 1) as 0 | 1])

const popcount = (n: number): number => {
  let c = 0
  for (; n; n >>= 1) c += n & 1
  return c
}

/** The twelve edges: pairs of corners that differ in exactly one coordinate. */
export function edges(): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) if (popcount(i ^ j) === 1) out.push([i, j])
  return out
}

/** The six faces, each as the four corner indices in order round it: the face where a coordinate is fixed at 0 or at 1. */
export function faces(): number[][] {
  const out: number[][] = []
  for (let axis = 0; axis < 3; axis++)
    for (const v of [0, 1]) {
      const on = vertices()
        .map((c, i) => [c, i] as const)
        .filter(([c]) => c[axis] === v)
        .map(([, i]) => i)
      // go round: the four corners sorted so that consecutive ones are joined by an edge
      const ring = [on[0]]
      while (ring.length < 4) {
        const next = on.find((i) => !ring.includes(i) && popcount(i ^ ring[ring.length - 1]) === 1 && (ring.length < 3 || popcount(i ^ ring[0]) === 1))
        ring.push(next as number)
      }
      out.push(ring)
    }
  return out
}

/** Euler's formula for the cube: V − E + F = 2. */
export function euler(): { V: number; E: number; F: number; chi: number } {
  const V = vertices().length
  const E = edges().length
  const F = faces().length
  return { V, E, F, chi: V - E + F }
}

/** How many corners lie at each squared distance from corner v: 3 at distance 1, 3 at √2, 1 at √3. */
export function distancesFromVertex(v: number): Record<number, number> {
  const vs = vertices()
  const out: Record<number, number> = {}
  for (let i = 0; i < 8; i++) {
    if (i === v) continue
    const d2 = (vs[i][0] - vs[v][0]) ** 2 + (vs[i][1] - vs[v][1]) ** 2 + (vs[i][2] - vs[v][2]) ** 2
    out[d2] = (out[d2] ?? 0) + 1
  }
  return out
}

/** A walk along edges that visits every corner once: the binary reflected Gray code of three bits, where consecutive numbers differ in one bit. */
export const grayWalk = (): number[] => Array.from({ length: 8 }, (_, i) => i ^ (i >> 1))

/* --------------------------------------------------------------------------- nets */

/** A square of the grid, as [row, column]; rows grow downwards. */
export type Cell = [number, number]

/** The six faces of the cube, named by where they are when the cube sits on the paper with its first face down. */
export const FACE_COUNT = 6

/** The orientation of a cube sitting on a cell: which face is on top, at the bottom, to the north (up the page), south, east and west. */
interface Pose {
  top: number
  bottom: number
  north: number
  south: number
  east: number
  west: number
}

const START: Pose = { top: 0, bottom: 1, north: 2, south: 3, east: 4, west: 5 }

/** Roll the cube one cell in a direction: the face on that side becomes the bottom. */
function roll(p: Pose, dr: number, dc: number): Pose {
  if (dc === 1) return { ...p, bottom: p.east, top: p.west, east: p.top, west: p.bottom }
  if (dc === -1) return { ...p, bottom: p.west, top: p.east, west: p.top, east: p.bottom }
  if (dr === 1) return { ...p, bottom: p.south, top: p.north, south: p.top, north: p.bottom }
  return { ...p, bottom: p.north, top: p.south, north: p.top, south: p.bottom }
}

const key = (c: Cell): string => `${c[0]},${c[1]}`
const samePose = (p: Pose, q: Pose): boolean => p.top === q.top && p.bottom === q.bottom && p.north === q.north && p.south === q.south && p.east === q.east && p.west === q.west

export type FoldResult =
  | { ok: true; face: Map<string, number> }
  | { ok: false; reason: 'count'; count: number }
  | { ok: false; reason: 'disconnected' }
  /** the squares around a loop cannot all lie flat on a cube: a 2 × 2 block */
  | { ok: false; reason: 'loop'; at: Cell }
  /** two squares land on the same face of the cube */
  | { ok: false; reason: 'overlap'; cells: [Cell, Cell] }

/** Does this set of cells fold into a cube?
 *
 *  Roll a cube over the cells: start on the first one and every time the cube moves to the next cell by an edge, the face it lands on is the face that
 *  cell becomes. The set is a net exactly when it has six cells joined edge to edge, rolling round any loop brings the cube back in the same pose (it
 *  does not for a 2 × 2 block), and the six cells land on six different faces. */
export function foldNet(cells: Cell[]): FoldResult {
  const uniq = new Map<string, Cell>()
  for (const c of cells) uniq.set(key(c), c)
  const list = [...uniq.values()]
  if (list.length !== FACE_COUNT) return { ok: false, reason: 'count', count: list.length }
  const pose = new Map<string, Pose>()
  const start = list[0]
  pose.set(key(start), START)
  const queue: Cell[] = [start]
  while (queue.length) {
    const c = queue.shift() as Cell
    const p = pose.get(key(c)) as Pose
    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const n: Cell = [c[0] + dr, c[1] + dc]
      if (!uniq.has(key(n))) continue
      const q = roll(p, dr, dc)
      const seen = pose.get(key(n))
      if (!seen) {
        pose.set(key(n), q)
        queue.push(n)
      } else if (!samePose(seen, q)) return { ok: false, reason: 'loop', at: n }
    }
  }
  if (pose.size !== FACE_COUNT) return { ok: false, reason: 'disconnected' }
  const face = new Map<string, number>()
  const owner = new Map<number, Cell>()
  for (const c of list) {
    const f = (pose.get(key(c)) as Pose).bottom
    if (owner.has(f)) return { ok: false, reason: 'overlap', cells: [owner.get(f) as Cell, c] }
    owner.set(f, c)
    face.set(key(c), f)
  }
  return { ok: true, face }
}

/** The eight ways to turn and flip a set of cells, then moved to the corner of the grid and sorted: the same shape in any position has one form. */
function canonical(cells: Cell[]): Cell[] {
  const forms: Cell[][] = []
  let cur = cells
  for (let flip = 0; flip < 2; flip++) {
    for (let turn = 0; turn < 4; turn++) {
      cur = cur.map(([r, c]) => [c, -r] as Cell)
      const r0 = Math.min(...cur.map((c) => c[0]))
      const c0 = Math.min(...cur.map((c) => c[1]))
      forms.push(cur.map(([r, c]) => [r - r0, c - c0] as Cell).sort((x, y) => x[0] - y[0] || x[1] - y[1]))
    }
    cur = cur.map(([r, c]) => [r, -c] as Cell)
  }
  return forms.sort((x, y) => cellsKey(x).localeCompare(cellsKey(y)))[0]
}
const cellsKey = (cells: Cell[]): string => cells.map(key).join(';')

/** All 35 hexominoes (shapes of six squares joined edge to edge, turning and flipping allowed), each in its canonical position. */
export function hexominoes(): Cell[][] {
  let shapes = new Map<string, Cell[]>([[cellsKey([[0, 0]]), [[0, 0]]]])
  for (let size = 1; size < 6; size++) {
    const next = new Map<string, Cell[]>()
    for (const shape of shapes.values()) {
      const have = new Set(shape.map(key))
      for (const [r, c] of shape)
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const n: Cell = [r + dr, c + dc]
          if (have.has(key(n))) continue
          const form = canonical([...shape, n])
          next.set(cellsKey(form), form)
        }
    }
    shapes = next
  }
  return [...shapes.values()].sort((x, y) => cellsKey(x).localeCompare(cellsKey(y)))
}

/** The sizes of the rows of a shape, longest first, once it is laid with its longest side across: 4-1-1, 3-2-1, 2-2-2 or 3-3 for the nets. */
export function netType(cells: Cell[]): string {
  const rows = new Map<number, number>()
  for (const [r] of cells) rows.set(r, (rows.get(r) ?? 0) + 1)
  const cols = new Map<number, number>()
  for (const [, c] of cells) cols.set(c, (cols.get(c) ?? 0) + 1)
  // lay it along whichever direction is longer
  const by = rows.size >= cols.size ? cols : rows
  return [...by.values()].sort((a, b) => b - a).join('-')
}

/** The 11 nets of the cube: the hexominoes that fold, grouped by type (6 of 4-1-1, 3 of 3-2-1, 1 of 2-2-2, 1 of 3-3). */
export function cubeNets(): { cells: Cell[]; type: string }[] {
  const order = ['4-1-1', '3-2-1', '2-2-2', '3-3']
  return hexominoes()
    .filter((h) => foldNet(h).ok)
    .map((cells) => ({ cells, type: netType(cells) }))
    .sort((x, y) => order.indexOf(x.type) - order.indexOf(y.type))
}

/** Cells from a drawing: the characters `#` or `X` are squares. */
export function cellsFromRows(rows: string[]): Cell[] {
  const out: Cell[] = []
  rows.forEach((row, r) => [...row].forEach((ch, c) => (ch === '#' || ch === 'X' ? out.push([r, c]) : undefined)))
  return out
}

/* ------------------------------------------------------------------- cross-sections */

export type P3 = [number, number, number]

export interface Section {
  /** the corners of the polygon in order round it (fewer than three: the plane only touches the cube at a point or along an edge) */
  points: P3[]
  sides: number
  area: number
}

const dot3 = (u: P3, v: P3): number => u[0] * v[0] + u[1] * v[1] + u[2] * v[2]
const sub3 = (u: P3, v: P3): P3 => [u[0] - v[0], u[1] - v[1], u[2] - v[2]]
const cross3 = (u: P3, v: P3): P3 => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
const len3 = (u: P3): number => Math.sqrt(dot3(u, u))

/** The polygon in which the plane n·p = t cuts the cube [0, a]³. Null when n is the zero vector. */
export function crossSection(n: P3, t: number, a = 1): Section | null {
  const nl = len3(n)
  if (nl === 0) return null
  const eps = 1e-9 * Math.max(1, a * nl, Math.abs(t))
  const vs = vertices().map((c) => [c[0] * a, c[1] * a, c[2] * a] as P3)
  const d = vs.map((v) => dot3(n, v) - t)
  const pts: P3[] = []
  const add = (p: P3) => {
    if (!pts.some((q) => len3(sub3(p, q)) < 1e-9 * Math.max(1, a))) pts.push(p)
  }
  for (let i = 0; i < 8; i++) if (Math.abs(d[i]) <= eps) add(vs[i])
  for (const [i, j] of edges()) {
    if ((d[i] < -eps && d[j] > eps) || (d[i] > eps && d[j] < -eps)) {
      const s = d[i] / (d[i] - d[j])
      add([vs[i][0] + s * (vs[j][0] - vs[i][0]), vs[i][1] + s * (vs[j][1] - vs[i][1]), vs[i][2] + s * (vs[j][2] - vs[i][2])])
    }
  }
  if (pts.length < 3) return { points: pts, sides: pts.length, area: 0 }
  // an orthonormal basis of the plane, to put the points in order round their centre and to measure the area
  const nu: P3 = [n[0] / nl, n[1] / nl, n[2] / nl]
  const helper: P3 = Math.abs(nu[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const e1c = cross3(nu, helper)
  const e1: P3 = [e1c[0] / len3(e1c), e1c[1] / len3(e1c), e1c[2] / len3(e1c)]
  const e2 = cross3(nu, e1)
  const centre: P3 = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length, pts.reduce((s, p) => s + p[2], 0) / pts.length]
  const ang = (p: P3): number => {
    const r = sub3(p, centre)
    return Math.atan2(dot3(r, e2), dot3(r, e1))
  }
  const ordered = [...pts].sort((p, q) => ang(p) - ang(q))
  const xy = ordered.map((p) => [dot3(p, e1), dot3(p, e2)] as [number, number])
  let twice = 0
  for (let i = 0; i < xy.length; i++) {
    const [x1, y1] = xy[i]
    const [x2, y2] = xy[(i + 1) % xy.length]
    twice += x1 * y2 - x2 * y1
  }
  return { points: ordered, sides: ordered.length, area: Math.abs(twice) / 2 }
}

/** The area of the cross-section of the unit cube by n·p = t from a closed formula, for n with all three components positive.
 *
 *  The volume of the part of the cube with n·p ≤ t is (1 / 6n₁n₂n₃) Σ over S ⊆ {1, 2, 3} of (−1)^|S| (t − Σ_{i∈S} nᵢ)₊³, where (x)₊ is x when
 *  positive and 0 otherwise. The area of the slice is |n| times the derivative of that volume with respect to t. */
export function sectionAreaFormula(n: P3, t: number): number {
  let sum = 0
  for (let s = 0; s < 8; s++) {
    let shift = 0
    for (let i = 0; i < 3; i++) if (s & (1 << i)) shift += n[i]
    const x = t - shift
    if (x > 0) sum += (popcount(s) % 2 ? -1 : 1) * x * x
  }
  return (len3(n) * sum) / (2 * n[0] * n[1] * n[2])
}

/** The corners of a cross-section laid flat: coordinates in the plane itself, in the same units, so that distances and the area are the true ones. */
export function flatten(points: P3[], n: P3): [number, number][] {
  const nl = len3(n)
  const nu: P3 = [n[0] / nl, n[1] / nl, n[2] / nl]
  const helper: P3 = Math.abs(nu[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const e1c = cross3(nu, helper)
  const e1: P3 = [e1c[0] / len3(e1c), e1c[1] / len3(e1c), e1c[2] / len3(e1c)]
  const e2 = cross3(nu, e1)
  return points.map((p) => [dot3(p, e1), dot3(p, e2)])
}

export type PolygonKind =
  | 'point'
  | 'segment'
  | 'equilateral triangle'
  | 'isosceles triangle'
  | 'scalene triangle'
  | 'square'
  | 'rectangle'
  | 'rhombus'
  | 'parallelogram'
  | 'trapezoid'
  | 'quadrilateral'
  | 'regular hexagon'
  | 'pentagon'
  | 'hexagon'
  | 'none'

/** A name for the shape of a cross-section, from its corners. */
export function polygonKind(s: Section): PolygonKind {
  const p = s.points
  if (s.sides === 0) return 'none'
  if (s.sides === 1) return 'point'
  if (s.sides === 2) return 'segment'
  const side = p.map((q, i) => len3(sub3(p[(i + 1) % p.length], q)))
  const tol = 1e-7 * Math.max(...side)
  const eq = (x: number, y: number): boolean => Math.abs(x - y) <= tol
  const angleCos = (i: number): number => {
    const a = sub3(p[(i + p.length - 1) % p.length], p[i])
    const b = sub3(p[(i + 1) % p.length], p[i])
    return dot3(a, b) / (len3(a) * len3(b))
  }
  if (s.sides === 3) {
    if (eq(side[0], side[1]) && eq(side[1], side[2])) return 'equilateral triangle'
    return eq(side[0], side[1]) || eq(side[1], side[2]) || eq(side[0], side[2]) ? 'isosceles triangle' : 'scalene triangle'
  }
  if (s.sides === 4) {
    const parallel = (i: number, j: number): boolean => {
      const a = sub3(p[(i + 1) % 4], p[i])
      const b = sub3(p[(j + 1) % 4], p[j])
      return len3(cross3(a, b)) <= 1e-7 * len3(a) * len3(b)
    }
    const par02 = parallel(0, 2)
    const par13 = parallel(1, 3)
    if (par02 && par13) {
      const right = Math.abs(angleCos(0)) < 1e-7
      const equalSides = eq(side[0], side[1])
      return right && equalSides ? 'square' : right ? 'rectangle' : equalSides ? 'rhombus' : 'parallelogram'
    }
    return par02 || par13 ? 'trapezoid' : 'quadrilateral'
  }
  if (s.sides === 6) {
    const allEqual = side.every((x) => eq(x, side[0]))
    const cos0 = angleCos(0)
    const sameAngles = [...Array(6).keys()].every((i) => Math.abs(angleCos(i) - cos0) < 1e-7)
    return allEqual && sameAngles ? 'regular hexagon' : 'hexagon'
  }
  return s.sides === 5 ? 'pentagon' : 'hexagon'
}

/* --------------------------------------------------------------------- cube numbers */

/** Newton's iteration for the cube root of v: x ← (2x + v/x²) / 3, from the start x0, the successive values. */
export function cbrtNewton(v: number, x0: number, steps: number): number[] {
  const out = [x0]
  let x = x0
  for (let i = 0; i < steps; i++) {
    x = (2 * x + v / (x * x)) / 3
    out.push(x)
  }
  return out
}

/** The integer cube root of a non-negative whole number when it is a perfect cube, else null. */
export function exactCubeRoot(n: bigint): bigint | null {
  if (n < 0n) return null
  let lo = 0n
  let hi = 1n
  while (hi * hi * hi < n) hi *= 2n
  while (lo < hi) {
    const mid = (lo + hi) / 2n
    if (mid * mid * mid < n) lo = mid + 1n
    else hi = mid
  }
  return lo * lo * lo === n ? lo : null
}

/** 1³ + 2³ + … + n³ = (n(n+1)/2)²: the sum of the first n cubes is the square of the sum of the first n numbers. */
export const sumOfCubes = (n: bigint): bigint => ((n * (n + 1n)) / 2n) ** 2n

/** The pieces a cube of edge a + b breaks into when cut by the planes at distance a from a corner, with how many of each and the volume of one:
 *  a³, three slabs a²b, three rods ab², and b³. */
export function binomialCubePieces(a: number, b: number): { name: string; count: number; volume: number }[] {
  return [
    { name: 'a³', count: 1, volume: a ** 3 },
    { name: 'a²b', count: 3, volume: a * a * b },
    { name: 'ab²', count: 3, volume: a * b * b },
    { name: 'b³', count: 1, volume: b ** 3 },
  ]
}

/* -------------------------------------------------------------------- dice and puzzles */

/** The 24 turns of a cube as permutations of its six faces [top, bottom, north, south, east, west], found by closing the two quarter turns that roll it east and
 *  north: each entry says which original face ends up in each position. */
export function rotations(): number[][] {
  const idn = [0, 1, 2, 3, 4, 5]
  const east = (p: number[]): number[] => [p[5], p[4], p[2], p[3], p[0], p[1]] // top ← west, bottom ← east, east ← top, west ← bottom
  const north = (p: number[]): number[] => [p[3], p[2], p[0], p[1], p[4], p[5]] // top ← south, bottom ← north, north ← top, south ← bottom
  const seen = new Map<string, number[]>([[idn.join(), idn]])
  const queue = [idn]
  while (queue.length) {
    const p = queue.shift() as number[]
    for (const q of [east(p), north(p)]) {
      if (!seen.has(q.join())) {
        seen.set(q.join(), q)
        queue.push(q)
      }
    }
  }
  return [...seen.values()]
}

/** How many different dice there are when the six faces carry 1 to 6 once each and turning a die does not make a new one (30), and how many of them have opposite faces
 *  adding up to 7 (2, mirror images of each other). */
export function distinctDice(): { all: number; oppositeSeven: number } {
  const rots = rotations()
  const perms: number[][] = []
  const rec = (cur: number[], rest: number[]) => {
    if (!rest.length) {
      perms.push(cur)
      return
    }
    for (let i = 0; i < rest.length; i++) rec([...cur, rest[i]], [...rest.slice(0, i), ...rest.slice(i + 1)])
  }
  rec([], [1, 2, 3, 4, 5, 6])
  const all = new Set<string>()
  const sevens = new Set<string>()
  for (const p of perms) {
    const form = rots.map((r) => r.map((i) => p[i]).join('')).sort()[0]
    all.add(form)
    if (p[0] + p[1] === 7 && p[2] + p[3] === 7 && p[4] + p[5] === 7) sevens.add(form)
  }
  return { all: all.size, oppositeSeven: sevens.size }
}

/** The number of positions of a 3×3×3 puzzle cube: 8!·3⁷ for the corners, 12!·2¹¹ for the edges, halved because a turn swaps corners and edges in matching parity. */
export function rubikPositions(): bigint {
  const f = (n: bigint): bigint => (n <= 1n ? 1n : n * f(n - 1n))
  return (f(8n) * 3n ** 7n * f(12n) * 2n ** 11n) / 2n
}
