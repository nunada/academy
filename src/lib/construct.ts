/** Ruler-and-compass constructions: the geometry behind the "Constructing Segments and Angles" article's widgets.
 *
 *  A construction is a list of steps on an unmarked ruler and a compass, and nothing else:
 *    - `line`: draw the line through two points that exist;
 *    - `circle`: draw the circle around a point that exists, with a radius equal to the distance between two points that exist (a rigid
 *      compass: it keeps its opening when it is lifted, which is what a school compass does);
 *    - `point`: mark a point where two of the drawn lines and circles cross.
 *  A point can only be born as a crossing. That is the whole rule, and `run` enforces it: a step may name only points made before it, and a
 *  crossing that does not exist is an error. Where two objects cross twice, the step says which crossing it means (`pick`) by a property of
 *  the picture (the left side of a line, farther from a point), never by coordinates.
 *
 *  Everything else here is built from those steps: the textbook constructions, the angles that can be made from them, the division of a
 *  segment into equal parts, and the number theory that says which angles and regular polygons can be built at all (and why a general angle
 *  cannot be trisected). The checker (tools/check-construct.mjs) tests it against references that do not use it. */

export type Loc = { en: string; id: string }

export interface Pt {
  x: number
  y: number
}

/** Which of the (at most two) crossings of a step is meant. The largest value wins. */
export type Pick =
  | { side: [string, string, 1 | -1] } // the crossing on the left (1) or right (-1) of the directed line a to b
  | { toward: [string, string] } // the crossing farthest along the direction a to b, measured from a
  | { far: string } // the crossing farthest from a point
  | { near: string } // the crossing nearest to a point

export type Step =
  | { kind: 'line'; a: string; b: string }
  | { kind: 'circle'; c: string; r1: string; r2: string }
  | { kind: 'point'; name: string; of: [number, number]; pick?: Pick; exclude?: string[] }

export interface DrawnLine {
  kind: 'line'
  a: string
  b: string
  p: Pt
  q: Pt
}
export interface DrawnCircle {
  kind: 'circle'
  c: string
  r1: string
  r2: string
  center: Pt
  r: number
}
export type Drawn = DrawnLine | DrawnCircle

export interface Built {
  points: Record<string, Pt>
  objects: Drawn[]
  /** the step that made each point (-1 for the given ones) and each object */
  pointStep: Record<string, number>
  objectStep: number[]
}

/* ------------------------------------------------------------------------------- plain geometry */

const dist = (p: Pt, q: Pt): number => Math.hypot(p.x - q.x, p.y - q.y)
const cross = (ax: number, ay: number, bx: number, by: number): number => ax * by - ay * bx

function lineLine(p: Pt, q: Pt, r: Pt, s: Pt): Pt[] {
  const d1x = q.x - p.x
  const d1y = q.y - p.y
  const d2x = s.x - r.x
  const d2y = s.y - r.y
  const den = cross(d1x, d1y, d2x, d2y)
  if (Math.abs(den) < 1e-12 * Math.hypot(d1x, d1y) * Math.hypot(d2x, d2y)) return []
  const t = cross(r.x - p.x, r.y - p.y, d2x, d2y) / den
  return [{ x: p.x + t * d1x, y: p.y + t * d1y }]
}

function lineCircle(p: Pt, q: Pt, c: Pt, r: number): Pt[] {
  const dx = q.x - p.x
  const dy = q.y - p.y
  const fx = p.x - c.x
  const fy = p.y - c.y
  const a = dx * dx + dy * dy
  const b = 2 * (fx * dx + fy * dy)
  const k = fx * fx + fy * fy - r * r
  let disc = b * b - 4 * a * k
  if (disc < 0) {
    if (disc > -1e-12 * Math.max(1, b * b)) disc = 0
    else return []
  }
  const root = Math.sqrt(disc)
  const ts = root === 0 ? [-b / (2 * a)] : [(-b - root) / (2 * a), (-b + root) / (2 * a)]
  return ts.map((t) => ({ x: p.x + t * dx, y: p.y + t * dy }))
}

function circleCircle(c1: Pt, r1: number, c2: Pt, r2: number): Pt[] {
  const d = dist(c1, c2)
  if (d < 1e-12) return []
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
  let h2 = r1 * r1 - a * a
  if (h2 < 0) {
    if (h2 > -1e-12 * Math.max(1, r1 * r1)) h2 = 0
    else return []
  }
  const h = Math.sqrt(h2)
  const ux = (c2.x - c1.x) / d
  const uy = (c2.y - c1.y) / d
  const mx = c1.x + a * ux
  const my = c1.y + a * uy
  if (h === 0) return [{ x: mx, y: my }]
  return [
    { x: mx - h * uy, y: my + h * ux },
    { x: mx + h * uy, y: my - h * ux },
  ]
}

function crossings(a: Drawn, b: Drawn): Pt[] {
  if (a.kind === 'line' && b.kind === 'line') return lineLine(a.p, a.q, b.p, b.q)
  if (a.kind === 'line' && b.kind === 'circle') return lineCircle(a.p, a.q, b.center, b.r)
  if (a.kind === 'circle' && b.kind === 'line') return lineCircle(b.p, b.q, a.center, a.r)
  if (a.kind === 'circle' && b.kind === 'circle') return circleCircle(a.center, a.r, b.center, b.r)
  return []
}

/** Run the steps on the given points. Throws if a step cheats: an unknown point, a missing crossing, an unclear choice. */
export function run(givens: Record<string, Pt>, steps: Step[]): Built {
  const points: Record<string, Pt> = {}
  const pointStep: Record<string, number> = {}
  for (const [k, p] of Object.entries(givens)) {
    points[k] = { x: p.x, y: p.y }
    pointStep[k] = -1
  }
  const objects: Drawn[] = []
  const objectStep: number[] = []
  const get = (n: string): Pt => {
    const p = points[n]
    if (!p) throw new Error(`step names the point ${n} before it exists`)
    return p
  }
  steps.forEach((s, i) => {
    if (s.kind === 'line') {
      const p = get(s.a)
      const q = get(s.b)
      if (dist(p, q) < 1e-9) throw new Error(`line through the same point ${s.a}, ${s.b}`)
      objects.push({ kind: 'line', a: s.a, b: s.b, p, q })
      objectStep.push(i)
    } else if (s.kind === 'circle') {
      const center = get(s.c)
      const r = dist(get(s.r1), get(s.r2))
      if (r < 1e-9) throw new Error(`circle of radius zero around ${s.c}`)
      objects.push({ kind: 'circle', c: s.c, r1: s.r1, r2: s.r2, center, r })
      objectStep.push(i)
    } else {
      if (points[s.name]) throw new Error(`the point ${s.name} is made twice`)
      const [ia, ib] = s.of
      const A = objects[ia]
      const B = objects[ib]
      if (!A || !B || ia === ib) throw new Error(`point ${s.name} crosses objects that do not exist`)
      let cands = crossings(A, B)
      const ex = s.exclude ?? []
      if (ex.length) cands = cands.filter((c) => ex.every((n) => dist(c, get(n)) > 1e-7))
      if (cands.length === 0) throw new Error(`the objects of point ${s.name} do not cross`)
      let chosen = cands[0]
      if (cands.length > 1) {
        const pk = s.pick
        if (!pk) throw new Error(`point ${s.name} has two crossings and no choice`)
        const score = (c: Pt): number => {
          if ('side' in pk) {
            const a = get(pk.side[0])
            const b = get(pk.side[1])
            return pk.side[2] * cross(b.x - a.x, b.y - a.y, c.x - a.x, c.y - a.y)
          }
          if ('toward' in pk) {
            const a = get(pk.toward[0])
            const b = get(pk.toward[1])
            return (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y)
          }
          if ('far' in pk) return dist(c, get(pk.far))
          return -dist(c, get(pk.near))
        }
        chosen = cands.reduce((best, c) => (score(c) > score(best) ? c : best))
      }
      points[s.name] = chosen
      pointStep[s.name] = i
    }
  })
  return { points, objects, pointStep, objectStep }
}

/* --------------------------------------------------------------------------------- the builder */

class Bld {
  givens: Record<string, Pt> = {}
  steps: Step[] = []
  private objects = 0
  private used = new Set<string>()
  private next = 0
  given(name: string, p: Pt): string {
    this.givens[name] = p
    this.used.add(name)
    return name
  }
  /** Keep names for points that will be named on purpose, so that the automatic names skip them. */
  reserve(...names: string[]): void {
    for (const n of names) this.used.add(n)
  }
  fresh(): string {
    const pool = 'PQRSTUVWXYZ'
    for (;;) {
      const k = this.next++
      const nm = pool[k % pool.length] + (k >= pool.length ? String(Math.floor(k / pool.length)) : '')
      if (!this.used.has(nm)) {
        this.used.add(nm)
        return nm
      }
    }
  }
  line(a: string, b: string): number {
    this.steps.push({ kind: 'line', a, b })
    return this.objects++
  }
  circle(c: string, r1: string, r2: string): number {
    this.steps.push({ kind: 'circle', c, r1, r2 })
    return this.objects++
  }
  meet(a: number, b: number, pick?: Pick, exclude?: string[], name?: string): string {
    let nm: string
    if (name) {
      this.used.add(name)
      nm = name
    } else nm = this.fresh()
    this.steps.push({ kind: 'point', name: nm, of: [a, b], pick, exclude })
    return nm
  }

  /** The perpendicular bisector of the segment ab: the two circles around a and b through each other cross at u (left of a to b) and v. */
  bisect(a: string, b: string): { line: number; u: string; v: string } {
    const c1 = this.circle(a, a, b)
    const c2 = this.circle(b, b, a)
    const u = this.meet(c1, c2, { side: [a, b, 1] })
    const v = this.meet(c1, c2, { side: [a, b, -1] })
    return { line: this.line(u, v), u, v }
  }
  /** The perpendicular to the line `l` (an object through l1) at the point p on it: x is the mirror of l1 in p, and the bisector of l1 x is the answer. */
  perpAt(p: string, l1: string, l: number): { line: number; u: string; v: string; x: string } {
    const c = this.circle(p, p, l1)
    const x = this.meet(c, l, { far: l1 })
    return { ...this.bisect(x, l1), x }
  }
  /** The perpendicular from the point p, off the line `l` (through l1): the circle around p through l1 cuts the line again at x. */
  perpFrom(p: string, l1: string, l: number): { line: number; u: string; v: string; x: string } {
    const c = this.circle(p, p, l1)
    const x = this.meet(c, l, undefined, [l1])
    return { ...this.bisect(x, l1), x }
  }
  /** A parallel to the line `l` (through l1 and l2) through p: l1, x, q, p are the corners of a rhombus, with x on the line. */
  parallel(p: string, l1: string, l2: string, l: number): { line: number; q: string; x: string } {
    const c1 = this.circle(l1, l1, p)
    const x = this.meet(c1, l, { toward: [l1, l2] })
    const c2 = this.circle(x, l1, p)
    const c3 = this.circle(p, l1, p)
    const q = this.meet(c2, c3, undefined, [l1])
    return { line: this.line(p, q), q, x }
  }
  /** The bisector of the angle poq when the arms op and oq are equal: the two circles of that radius around p and q cross at o and at the far corner of a rhombus. */
  bisectEqual(o: string, p: string, q: string, name?: string): { line: number; r: string } {
    const c1 = this.circle(p, o, p)
    const c2 = this.circle(q, o, p)
    const r = this.meet(c1, c2, undefined, [o], name)
    return { line: this.line(o, r), r }
  }
}

/* ------------------------------------------------------------------------- the constructions */

export type ConstructId =
  | 'copysegment'
  | 'perpbisector'
  | 'equilateral'
  | 'bisectangle'
  | 'copyangle'
  | 'perpat'
  | 'perpfrom'
  | 'parallel'
  | 'angle90'
  | 'angle30'
  | 'angle45'

export const CONSTRUCT_IDS: ConstructId[] = ['copysegment', 'perpbisector', 'equilateral', 'bisectangle', 'copyangle', 'perpat', 'perpfrom', 'parallel', 'angle90', 'angle30', 'angle45']

/** Two quantities that the construction says are equal, measured on the finished picture (`b` may be a fixed target). */
export interface Claim {
  label: Loc
  a: number
  b: number
  unit: 'len' | 'deg' | 'ratio'
}

export interface Construction {
  id: string
  givens: Record<string, Pt>
  steps: Step[]
  /** segments of the given figure and of the answer, drawn thick */
  base: [string, string][]
  result: [string, string][]
  /** points of the answer, drawn in the answer's color */
  marks: string[]
  claims: (pts: Record<string, Pt>) => Claim[]
}

const seededRandom = (seed: number): (() => number) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const polar = (o: Pt, len: number, deg: number): Pt => ({ x: o.x + len * Math.cos((deg * Math.PI) / 180), y: o.y + len * Math.sin((deg * Math.PI) / 180) })
const lerp = (p: Pt, q: Pt, t: number): Pt => ({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) })

/** The angle at o between the rays to p and q, in degrees, from atan2 of the cross and dot product. */
export function angleAt(o: Pt, p: Pt, q: Pt): number {
  const ax = p.x - o.x
  const ay = p.y - o.y
  const bx = q.x - o.x
  const by = q.y - o.y
  return (Math.atan2(Math.abs(cross(ax, ay, bx, by)), ax * bx + ay * by) * 180) / Math.PI
}
/** The (acute) angle between the lines ab and cd, in degrees. */
export function lineAngle(a: Pt, b: Pt, c: Pt, d: Pt): number {
  const x = angleAt({ x: 0, y: 0 }, { x: b.x - a.x, y: b.y - a.y }, { x: d.x - c.x, y: d.y - c.y })
  return Math.min(x, 180 - x)
}
/** The distance from p to the line through a and b. */
export function lineDistance(p: Pt, a: Pt, b: Pt): number {
  return Math.abs(cross(b.x - a.x, b.y - a.y, p.x - a.x, p.y - a.y)) / dist(a, b)
}

const claimLen = (label: Loc, a: number, b: number): Claim => ({ label, a, b, unit: 'len' })
const claimDeg = (label: Loc, a: number, b: number): Claim => ({ label, a, b, unit: 'deg' })
const L = (en: string, id: string): Loc => ({ en, id })

/** Seed 0 is the picture shown at first; any other seed is another random input of the same kind. */
export function make(id: ConstructId, seed = 0): Construction {
  const rnd = seededRandom(seed || 1)
  const R = (lo: number, hi: number): number => lo + rnd() * (hi - lo)
  const fixed = seed === 0
  const b = new Bld()

  if (id === 'copysegment') {
    const A = b.given('A', { x: 1, y: 1 })
    const B = b.given('B', fixed ? polar({ x: 1, y: 1 }, 3.4, 18) : polar({ x: 1, y: 1 }, R(2.5, 5), R(-30, 50)))
    const c0 = fixed ? { x: 1.5, y: 5.2 } : { x: R(0, 3), y: R(4, 6.5) }
    const C = b.given('C', c0)
    const E = b.given('E', fixed ? polar(c0, 4.5, -12) : polar(c0, R(3, 6), R(-40, 30)))
    const l = b.line(C, E)
    const c = b.circle(C, A, B)
    const D = b.meet(l, c, { toward: [C, E] }, undefined, 'D')
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[A, B], [C, E]],
      result: [[C, D]],
      marks: [D],
      claims: (p) => [
        claimLen(L(`${C}${D} and ${A}${B}`, `${C}${D} dan ${A}${B}`), dist(p[C], p[D]), dist(p[A], p[B])),
        claimDeg(L(`angle between ${C}${D} and ${C}${E}`, `sudut antara ${C}${D} dan ${C}${E}`), angleAt(p[C], p[D], p[E]), 0),
      ],
    }
  }

  if (id === 'perpbisector') {
    const A = b.given('A', { x: 1.5, y: 2 })
    b.given('B', fixed ? { x: 8, y: 3.4 } : polar(b.givens.A, R(4, 8), R(-60, 60)))
    const B = 'B'
    const lab = b.line(A, B)
    const w = b.bisect(A, B)
    const M = b.meet(w.line, lab, undefined, undefined, 'M')
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[A, B]],
      result: [[w.u, w.v]],
      marks: [M],
      claims: (p) => [
        claimLen(L(`${A}${M} and ${M}${B}`, `${A}${M} dan ${M}${B}`), dist(p[A], p[M]), dist(p[M], p[B])),
        claimDeg(L(`angle between ${w.u}${w.v} and ${A}${B}`, `sudut antara ${w.u}${w.v} dan ${A}${B}`), lineAngle(p[w.u], p[w.v], p[A], p[B]), 90),
      ],
    }
  }

  if (id === 'equilateral') {
    const A = b.given('A', { x: 2, y: 1.5 })
    b.given('B', fixed ? { x: 8.2, y: 2.4 } : polar(b.givens.A, R(3.5, 7.5), R(-40, 40)))
    const B = 'B'
    const c1 = b.circle(A, A, B)
    const c2 = b.circle(B, B, A)
    const C = b.meet(c1, c2, { side: [A, B, 1] }, undefined, 'C')
    b.line(A, C)
    b.line(B, C)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[A, B]],
      result: [[A, C], [B, C]],
      marks: [C],
      claims: (p) => [
        claimLen(L(`${A}${C} and ${A}${B}`, `${A}${C} dan ${A}${B}`), dist(p[A], p[C]), dist(p[A], p[B])),
        claimLen(L(`${B}${C} and ${A}${B}`, `${B}${C} dan ${A}${B}`), dist(p[B], p[C]), dist(p[A], p[B])),
        claimDeg(L(`angle ${C}${A}${B}`, `sudut ${C}${A}${B}`), angleAt(p[A], p[C], p[B]), 60),
      ],
    }
  }

  if (id === 'bisectangle') {
    b.reserve('R')
    const o = { x: 1.5, y: 1.5 }
    const a1 = fixed ? 8 : R(-40, 120)
    const span = fixed ? 74 : R(30, 150)
    const O = b.given('O', o)
    const P = b.given('P', polar(o, fixed ? 6.4 : R(3, 6.5), a1))
    const Q = b.given('Q', polar(o, fixed ? 4.6 : R(3, 6.5), a1 + span))
    const c0 = b.circle(O, O, P)
    const lq = b.line(O, Q)
    const Q2 = b.meet(c0, lq, { toward: [O, Q] })
    const w = b.bisectEqual(O, P, Q2, 'R')
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[O, P], [O, Q]],
      result: [[O, w.r]],
      marks: [w.r],
      claims: (pt) => [claimDeg(L(`angle ${P}${O}${w.r} and angle ${w.r}${O}${Q}`, `sudut ${P}${O}${w.r} dan sudut ${w.r}${O}${Q}`), angleAt(pt[O], pt[P], pt[w.r]), angleAt(pt[O], pt[w.r], pt[Q]))],
    }
  }

  if (id === 'copyangle') {
    const o = { x: 1.5, y: 1.5 }
    const a1 = fixed ? 10 : R(-30, 100)
    const span = fixed ? 57 : R(25, 140)
    const O = b.given('O', o)
    const P = b.given('P', polar(o, fixed ? 5 : R(3, 5.5), a1))
    const Q = b.given('Q', polar(o, fixed ? 4.4 : R(3, 5.5), a1 + span))
    const o2 = fixed ? { x: 11, y: 1.6 } : { x: R(9, 12), y: R(0.5, 3) }
    const O2 = b.given('S', o2)
    const P2 = b.given('T', polar(o2, fixed ? 4.2 : R(3, 5.5), fixed ? 14 : R(-20, 60)))
    const c0 = b.circle(O, O, P)
    const lq = b.line(O, Q)
    const Q1 = b.meet(c0, lq, { toward: [O, Q] })
    const c1 = b.circle(O2, O, P)
    const lr = b.line(O2, P2)
    const P1 = b.meet(c1, lr, { toward: [O2, P2] })
    const c2 = b.circle(P1, P, Q1)
    const Q2 = b.meet(c1, c2, { side: [O2, P1, 1] })
    b.line(O2, Q2)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[O, P], [O, Q], [O2, P2]],
      result: [[O2, Q2]],
      marks: [Q2],
      claims: (pt) => [claimDeg(L(`angle ${P2}${O2}${Q2} and angle ${P}${O}${Q}`, `sudut ${P2}${O2}${Q2} dan sudut ${P}${O}${Q}`), angleAt(pt[O2], pt[P2], pt[Q2]), angleAt(pt[O], pt[P], pt[Q]))],
    }
  }

  if (id === 'perpat') {
    const a = fixed ? { x: 1, y: 2 } : { x: R(0, 2), y: R(1, 3) }
    const e = fixed ? { x: 9.2, y: 3.4 } : polar(a, R(6, 9), R(-25, 25))
    const L1 = b.given('A', a)
    const L2 = b.given('B', e)
    const P = b.given('C', lerp(a, e, fixed ? 0.42 : R(0.3, 0.7)))
    const l = b.line(L1, L2)
    const w = b.perpAt(P, L1, l)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[L1, L2]],
      result: [[w.u, w.v]],
      marks: [],
      claims: (pt) => [
        claimDeg(L(`angle between ${w.u}${w.v} and ${L1}${L2}`, `sudut antara ${w.u}${w.v} dan ${L1}${L2}`), lineAngle(pt[w.u], pt[w.v], pt[L1], pt[L2]), 90),
        claimLen(L(`distance from ${P} to ${w.u}${w.v}`, `jarak ${P} ke ${w.u}${w.v}`), lineDistance(pt[P], pt[w.u], pt[w.v]), 0),
      ],
    }
  }

  if (id === 'perpfrom') {
    const a = fixed ? { x: 1, y: 1.5 } : { x: R(0, 2), y: R(0.5, 2) }
    const e = fixed ? { x: 9.2, y: 2.8 } : polar(a, R(6, 9), R(-20, 20))
    const L1 = b.given('A', a)
    const L2 = b.given('B', e)
    const foot = lerp(a, e, fixed ? 0.5 : R(0.3, 0.7))
    const nrm = { x: -(e.y - a.y), y: e.x - a.x }
    const len = Math.hypot(nrm.x, nrm.y)
    const h = fixed ? 4.2 : R(2, 4.5) * (rnd() < 0.5 ? 1 : -1)
    const P = b.given('C', { x: foot.x + (nrm.x / len) * h, y: foot.y + (nrm.y / len) * h })
    const l = b.line(L1, L2)
    const w = b.perpFrom(P, L1, l)
    const F = b.meet(w.line, l, undefined, undefined, 'F')
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[L1, L2]],
      result: [[P, F]],
      marks: [F],
      claims: (pt) => [
        claimDeg(L(`angle between ${P}${F} and ${L1}${L2}`, `sudut antara ${P}${F} dan ${L1}${L2}`), lineAngle(pt[P], pt[F], pt[L1], pt[L2]), 90),
        claimLen(L(`${P}${F} and the distance from ${P} to ${L1}${L2}`, `${P}${F} dan jarak ${P} ke ${L1}${L2}`), dist(pt[P], pt[F]), lineDistance(pt[P], pt[L1], pt[L2])),
      ],
    }
  }

  if (id === 'parallel') {
    const a = fixed ? { x: 1, y: 1.5 } : { x: R(0, 2), y: R(0.5, 2) }
    const e = fixed ? { x: 9, y: 3 } : polar(a, R(6, 9), R(-20, 25))
    const L1 = b.given('A', a)
    const L2 = b.given('B', e)
    const foot = lerp(a, e, fixed ? 0.45 : R(0.2, 0.8))
    const nrm = { x: -(e.y - a.y), y: e.x - a.x }
    const len = Math.hypot(nrm.x, nrm.y)
    const h = fixed ? 3.6 : R(2, 4) * (rnd() < 0.5 ? 1 : -1)
    const P = b.given('C', { x: foot.x + (nrm.x / len) * h, y: foot.y + (nrm.y / len) * h })
    const l = b.line(L1, L2)
    const w = b.parallel(P, L1, L2, l)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[L1, L2]],
      result: [[P, w.q]],
      marks: [w.q],
      claims: (pt) => [
        claimDeg(L(`angle between ${P}${w.q} and ${L1}${L2}`, `sudut antara ${P}${w.q} dan ${L1}${L2}`), lineAngle(pt[P], pt[w.q], pt[L1], pt[L2]), 0),
        claimLen(L(`distance from ${P} and from ${w.q} to ${L1}${L2}`, `jarak ${P} dan ${w.q} ke ${L1}${L2}`), lineDistance(pt[P], pt[L1], pt[L2]), lineDistance(pt[w.q], pt[L1], pt[L2])),
      ],
    }
  }

  if (id === 'angle90') {
    const o = { x: 2, y: 1.5 }
    const O = b.given('O', o)
    const A = b.given('A', polar(o, fixed ? 6 : R(3.5, 6.5), fixed ? 9 : R(-60, 60)))
    const l = b.line(O, A)
    const w = b.perpAt(O, A, l)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[O, A]],
      result: [[O, w.u]],
      marks: [w.u],
      claims: (pt) => [claimDeg(L(`angle ${A}${O}${w.u}`, `sudut ${A}${O}${w.u}`), angleAt(pt[O], pt[A], pt[w.u]), 90)],
    }
  }

  if (id === 'angle30') {
    const o = { x: 2, y: 1.5 }
    const O = b.given('O', o)
    const A = b.given('A', polar(o, fixed ? 6 : R(3.5, 6.5), fixed ? 9 : R(-60, 60)))
    const c1 = b.circle(O, O, A)
    const c2 = b.circle(A, A, O)
    const B = b.meet(c1, c2, { side: [O, A, 1] })
    b.line(O, B)
    const w = b.bisectEqual(O, A, B)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[O, A]],
      result: [[O, w.r]],
      marks: [w.r],
      claims: (pt) => [claimDeg(L(`angle ${A}${O}${B} (the 60° angle)`, `sudut ${A}${O}${B} (sudut 60°)`), angleAt(pt[O], pt[A], pt[B]), 60), claimDeg(L(`angle ${A}${O}${w.r}`, `sudut ${A}${O}${w.r}`), angleAt(pt[O], pt[A], pt[w.r]), 30)],
    }
  }

  if (id === 'angle45') {
    const o = { x: 2, y: 1.5 }
    const O = b.given('O', o)
    const A = b.given('A', polar(o, fixed ? 6 : R(3.5, 6.5), fixed ? 9 : R(-60, 60)))
    const l = b.line(O, A)
    const w = b.perpAt(O, A, l)
    const c0 = b.circle(O, O, A)
    const lu = b.line(O, w.u)
    const U2 = b.meet(c0, lu, { toward: [O, w.u] })
    const h = b.bisectEqual(O, A, U2)
    return {
      id,
      givens: b.givens,
      steps: b.steps,
      base: [[O, A]],
      result: [[O, h.r]],
      marks: [h.r],
      claims: (pt) => [claimDeg(L(`angle ${A}${O}${w.u} (the right angle)`, `sudut ${A}${O}${w.u} (sudut siku-siku)`), angleAt(pt[O], pt[A], pt[w.u]), 90), claimDeg(L(`angle ${A}${O}${h.r}`, `sudut ${A}${O}${h.r}`), angleAt(pt[O], pt[A], pt[h.r]), 45)],
    }
  }

  throw new Error(`unknown construction ${id}`)
}

/* ------------------------------------------------------------------ dividing a segment in n parts */

/** Divide AB into n equal parts: step n equal lengths off a ray from A, join the last mark to B and draw parallels to that line through the other marks. */
export function makeDivide(n: number, seed = 0): Construction {
  if (!Number.isInteger(n) || n < 2 || n > 12) throw new Error('n must be a whole number from 2 to 12')
  const rnd = seededRandom(seed || 1)
  const R = (lo: number, hi: number): number => lo + rnd() * (hi - lo)
  const fixed = seed === 0
  const b = new Bld()
  const a0 = { x: 1, y: 1 }
  const A = b.given('A', a0)
  const B = b.given('B', fixed ? { x: 9, y: 2 } : polar(a0, R(7, 9), R(-15, 15)))
  const dir = fixed ? 62 : R(40, 80)
  const u = fixed ? 1.15 : R(0.9, 1.5)
  const D1 = b.given('D1', polar(a0, u, dir))
  const lr = b.line(A, D1)
  const lab = b.line(A, B)
  const D: string[] = [D1]
  for (let k = 2; k <= n; k++) {
    const c = b.circle(D[k - 2], A, D1)
    D.push(b.meet(c, lr, { far: A }, undefined, `D${k}`))
  }
  const Dn = D[n - 1]
  const ldb = b.line(Dn, B)
  const K: string[] = []
  for (let k = 1; k < n; k++) {
    const w = b.parallel(D[k - 1], Dn, B, ldb)
    K.push(b.meet(w.line, lab, undefined, undefined, `K${k}`))
  }
  return {
    id: `divide${n}`,
    givens: b.givens,
    steps: b.steps,
    base: [[A, B]],
    result: [],
    marks: K,
    claims: (p) => K.map((name, i) => ({ label: L(`${A}${name} : ${A}${B}`, `${A}${name} : ${A}${B}`), a: dist(p[A], p[name]) / dist(p[A], p[B]), b: (i + 1) / n, unit: 'ratio' as const })),
  }
}

/* -------------------------------------------------------------------- the angles that can be built */

/** An angle made from three given ones with three operations. 60° is an equilateral triangle, 90° a perpendicular, 72° the central angle of
 *  a regular pentagon (built from the golden ratio); the rest is bisecting, adding and subtracting, copied with the compass. */
export type Recipe = { op: 'base'; deg: 60 | 90 | 72 } | { op: 'half'; of: Recipe } | { op: 'add'; a: Recipe; b: Recipe } | { op: 'sub'; a: Recipe; b: Recipe }

export function recipeDegrees(r: Recipe): number {
  if (r.op === 'base') return r.deg
  if (r.op === 'half') return recipeDegrees(r.of) / 2
  if (r.op === 'add') return recipeDegrees(r.a) + recipeDegrees(r.b)
  return recipeDegrees(r.a) - recipeDegrees(r.b)
}

const EIGHTHS = 180 * 8 // the angles are searched in eighths of a degree, below 180°
type How = { op: 'base'; deg: 60 | 90 | 72 } | { op: 'half'; a: number } | { op: 'add'; a: number; b: number } | { op: 'sub'; a: number; b: number }
let table: { cost: number[]; how: (How | undefined)[] } | null = null

/** The cheapest way, in operations, to reach every angle of whole eighths of a degree, by Dijkstra's method over the three operations. */
function searchTable(): { cost: number[]; how: (How | undefined)[] } {
  if (table) return table
  const cost: number[] = new Array(EIGHTHS).fill(Infinity)
  const how: (How | undefined)[] = new Array(EIGHTHS).fill(undefined)
  for (const deg of [60, 90, 72] as const) {
    cost[deg * 8] = 1
    how[deg * 8] = { op: 'base', deg }
  }
  const settled: number[] = []
  for (let c = 1; c <= 40; c++) {
    const now: number[] = []
    for (let v = 1; v < EIGHTHS; v++) if (cost[v] === c) now.push(v)
    for (const v of now) {
      settled.push(v)
      for (const u of settled) {
        const nc = cost[u] + c + 1
        const sum = u + v
        if (sum < EIGHTHS && nc < cost[sum]) {
          cost[sum] = nc
          how[sum] = { op: 'add', a: u, b: v }
        }
        const dif = Math.abs(u - v)
        if (dif > 0 && nc < cost[dif]) {
          cost[dif] = nc
          how[dif] = { op: 'sub', a: Math.max(u, v), b: Math.min(u, v) }
        }
      }
      if (v % 2 === 0 && c + 1 < cost[v / 2]) {
        cost[v / 2] = c + 1
        how[v / 2] = { op: 'half', a: v }
      }
    }
  }
  table = { cost, how }
  return table
}

/** A recipe for an angle of `deg` degrees (a whole number from 1 to 179), or null when no recipe exists: exactly the multiples of 3 have one. */
export function recipeFor(deg: number): Recipe | null {
  if (!Number.isInteger(deg) || deg < 1 || deg >= 180) return null
  const { how } = searchTable()
  const go = (v: number): Recipe => {
    const h = how[v]
    if (!h) throw new Error('no recipe')
    if (h.op === 'base') return { op: 'base', deg: h.deg }
    if (h.op === 'half') return { op: 'half', of: go(h.a) }
    return { op: h.op, a: go(h.a), b: go(h.b) }
  }
  return how[deg * 8] ? go(deg * 8) : null
}

/** The recipe as a list of lines, each angle once, in the order they are made. */
export interface RecipeLine {
  op: 'base' | 'half' | 'add' | 'sub'
  deg: number
  from: number[]
}
export function recipeLines(r: Recipe): RecipeLine[] {
  const out: RecipeLine[] = []
  const seen = new Set<number>()
  const go = (x: Recipe): number => {
    const d = recipeDegrees(x)
    if (seen.has(d)) return d
    let from: number[] = []
    if (x.op === 'half') from = [go(x.of)]
    else if (x.op === 'add' || x.op === 'sub') from = [go(x.a), go(x.b)]
    seen.add(d)
    out.push({ op: x.op, deg: d, from })
    return d
  }
  go(r)
  return out
}

/** The construction of an angle from its recipe: every angle is a point on one circle around O, counted from A. */
export function makeAngle(deg: number): Construction | null {
  const r = recipeFor(deg)
  if (!r) return null
  const b = new Bld()
  b.reserve('X', 'M', 'N')
  const O = b.given('O', { x: 0, y: 0 })
  const A = b.given('A', { x: 1, y: 0 })
  const unit = b.circle(O, O, A)
  const lOA = b.line(O, A)
  const cA = b.circle(A, O, A) // the circle around A through O: used by 60° and by every bisection
  const at = new Map<number, string>()
  at.set(0, A)
  let opposite: string | null = null
  let p90: string | null = null
  const ensure90 = (): string => {
    if (p90) return p90
    opposite = b.meet(unit, lOA, undefined, [A], 'X')
    const c1 = b.circle(A, A, opposite)
    const c2 = b.circle(opposite, A, opposite)
    const u = b.meet(c1, c2, { side: [A, opposite, -1] })
    const v = b.meet(c1, c2, { side: [A, opposite, 1] })
    const m = b.line(u, v)
    p90 = b.meet(m, unit, { side: [O, A, 1] })
    return p90
  }
  const build = (x: Recipe): string => {
    const d = recipeDegrees(x)
    const known = at.get(d)
    if (known) return known
    let p: string
    if (x.op === 'base' && x.deg === 60) {
      p = b.meet(unit, cA, { side: [O, A, 1] })
    } else if (x.op === 'base' && x.deg === 90) {
      p = ensure90()
    } else if (x.op === 'base') {
      const top = ensure90()
      const xo = opposite as string
      const w1 = b.bisect(O, xo) // the midpoint of the left radius
      const mid = b.meet(w1.line, lOA, undefined, undefined, 'M')
      const golden = b.circle(mid, mid, top)
      const n = b.meet(golden, lOA, { toward: [O, A] }, undefined, 'N') // OA times 0.618…
      const w2 = b.bisect(O, n)
      const l2 = b.line(w2.u, w2.v)
      p = b.meet(l2, unit, { side: [O, A, 1] })
    } else if (x.op === 'half') {
      const q = build(x.of)
      const c = b.circle(q, O, A)
      const corner = b.meet(cA, c, undefined, [O])
      const ray = b.line(O, corner)
      p = b.meet(ray, unit, { toward: [O, corner] })
    } else if (x.op === 'add') {
      const pa = build(x.a)
      const pb = build(x.b)
      const c = b.circle(pb, A, pa)
      p = b.meet(c, unit, { side: [O, pb, 1] })
    } else {
      const pa = build(x.a)
      const pb = build(x.b)
      const c = b.circle(pa, A, pb)
      p = b.meet(c, unit, { side: [O, pa, -1] })
    }
    at.set(d, p)
    return p
  }
  const T = build(r)
  b.line(O, T)
  return {
    id: `angle${deg}`,
    givens: b.givens,
    steps: b.steps,
    base: [[O, A]],
    result: [[O, T]],
    marks: [T],
    claims: (pt) => [claimDeg(L(`angle ${A}${O}${T}`, `sudut ${A}${O}${T}`), angleAt(pt[O], pt[A], pt[T]), deg)],
  }
}

/* --------------------------------------------------------------------------------- number theory */

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

export function totient(n: number): number {
  let result = n
  let m = n
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      while (m % p === 0) m /= p
      result -= result / p
    }
  }
  if (m > 1) result -= result / m
  return result
}
const isPow2 = (n: number): boolean => n >= 1 && (n & (n - 1)) === 0

/** The degree over the rationals of cos(2π k / m) for k/m in lowest terms with denominator m: φ(m)/2, or 1 when m is 1 or 2. */
const cosDegree = (m: number): number => (m <= 2 ? 1 : totient(m) / 2)

/** The denominator, in lowest terms, of an angle of `deg` degrees as a fraction of a full turn. */
export const turnDenominator = (deg: number): number => 360 / gcd(deg, 360)

/** The degree over the rationals of cos(deg°) for a whole number of degrees. */
export const angleFieldDegree = (deg: number): number => cosDegree(turnDenominator(deg))

/** A length or angle can be built exactly when the degree of cos is a power of 2 (Wantzel); for whole degrees that is exactly the multiples of 3. */
export const isConstructibleDegree = (deg: number): boolean => isPow2(angleFieldDegree(deg))

/** Trisecting the angle deg° (given, with a ruler and compass) needs cos(deg/3°), a root of 4x³ − 3x − cos(deg°). Its degree over the rationals
 *  is the ratio of the two cos degrees, which is 1, 2 or 3; a ratio of 3 means the cubic has no root among the buildable numbers. */
export function trisectRatio(deg: number): number {
  const m1 = turnDenominator(deg)
  const m2 = 1080 / gcd(deg, 1080)
  return cosDegree(m2) / cosDegree(m1)
}
export const isTrisectable = (deg: number): boolean => trisectRatio(deg) !== 3

/** Archimedes' trisection with a marked ruler. The angle at O between A = (1, 0) and B = (cos θ, sin θ) on the unit circle; the ruler has two
 *  marks 1 apart and lies through B with one mark C on the circle and the other D on the line AO beyond O. D is found by bisection on its
 *  distance d from O, and then the angle at D is θ/3. */
export interface Neusis {
  d: number
  c: Pt
  dPt: Pt
  b: Pt
  angle: number
}
export function neusis(deg: number): Neusis {
  if (!(deg > 0 && deg < 180)) throw new Error('angle must be between 0 and 180 degrees')
  const th = (deg * Math.PI) / 180
  const B: Pt = { x: Math.cos(th), y: Math.sin(th) }
  // the line from D through B meets the circle at B and at one more point C: the ruler's length is right when |DC| is 1
  const gap = (d: number): { g: number; c: Pt } => {
    const D: Pt = { x: -d, y: 0 }
    const hits = lineCircle(D, B, { x: 0, y: 0 }, 1)
    let best = hits[0]
    for (const h of hits) if (dist(h, B) > dist(best, B)) best = h
    return { g: dist(best, D) - 1, c: best }
  }
  let lo = 1 + 1e-9
  let hi = 2
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (gap(mid).g < 0) lo = mid
    else hi = mid
  }
  const d = (lo + hi) / 2
  const D: Pt = { x: -d, y: 0 }
  const { c } = gap(d)
  return { d, c, dPt: D, b: B, angle: angleAt(D, c, { x: 0, y: 0 }) }
}

/** n = 2^k times distinct Fermat primes: the regular n-gon can be built (Gauss, Wantzel). */
export const FERMAT_PRIMES = [3, 5, 17, 257, 65537]
export function polygonFactors(n: number): { twos: number; fermat: number[]; rest: number } {
  let m = n
  let twos = 0
  while (m % 2 === 0) {
    m /= 2
    twos++
  }
  const fermat: number[] = []
  for (const p of FERMAT_PRIMES) {
    if (m % p === 0) {
      fermat.push(p)
      m /= p
      if (m % p === 0) return { twos, fermat, rest: m } // a repeated Fermat prime stays in the rest
    }
  }
  return { twos, fermat, rest: m }
}
export const isConstructiblePolygon = (n: number): boolean => n >= 3 && polygonFactors(n).rest === 1

/** The whole numbers of sides from 3 to `max` whose regular polygon can be built. */
export const constructiblePolygons = (max: number): number[] => Array.from({ length: max - 2 }, (_, i) => i + 3).filter(isConstructiblePolygon)
