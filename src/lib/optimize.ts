/** Applied optimization: the numbers behind the "Applied Optimization" article's widgets.
 *
 *  The checker (tools/check-optimize.mjs) tests this against references that do not use it: the textbook's examples and
 *  exercises worked out in closed form with SymPy, brute-force scans of the objective, the closed forms of the can, the
 *  box, the inscribed rectangle, the fence and the delivery schedule for random parameters, Snell's law for the light
 *  path, and the marginal revenue = marginal cost condition for the profit. */

import { derive, evalFloat, type Node } from './chain'
import { extrema } from './extrema'
import { parseFunction } from './linearize'
import type { Problem } from './optproblems'

/* ------------------------------------------------------- how a function behaves at an open end */

export type EndBeh = { kind: 'inf' } | { kind: 'ninf' } | { kind: 'finite'; value: number }

/** What f does as x runs to an end x0 of its domain that is not part of the domain (x0 may be ±∞). */
export function endBehaviour(f: Node, x0: number, side: 1 | -1): EndBeh {
  const probes = Number.isFinite(x0) ? [1e-2, 1e-4, 1e-6, 1e-8].map((h) => x0 + side * h) : [1e2, 1e4, 1e6, 1e8].map((m) => Math.sign(x0) * m)
  const v = probes.map((x) => evalFloat(f, x))
  const last = v[3]
  if (!Number.isFinite(last)) return { kind: 'finite', value: NaN }
  if (Math.abs(last - v[2]) < 1e-6 * (1 + Math.abs(last))) return { kind: 'finite', value: last }
  if (Math.abs(last) > 20 * Math.abs(v[1]) && Math.abs(v[1]) > Math.abs(v[0])) return last > 0 ? { kind: 'inf' } : { kind: 'ninf' }
  if (Math.abs(last) > 1e5) return last > 0 ? { kind: 'inf' } : { kind: 'ninf' }
  return { kind: 'finite', value: last }
}

/* ------------------------------------------------------------------ one problem, all four steps */

export interface Row {
  kind: 'start' | 'end' | 'critical'
  x: number
  /** the value of the objective, or null for an end that is not part of the domain */
  fx: number | null
  /** what the objective does there, for an end that is not part of the domain */
  limit?: EndBeh
}

export interface Solved {
  ok: true
  f: Node
  df: Node
  rows: Row[]
  best: { x: number; fx: number; at: 'critical' | 'endpoint' }
  /** the best value is reached, not just approached at an open end */
  attained: boolean
  /** f″ at the best point when it is a critical point, else NaN */
  second: number
  /** the window of the picture: x range and y range */
  xr: [number, number]
  yr: [number, number]
}

export interface SolveFailed {
  ok: false
}

const better = (want: 'max' | 'min', u: number, v: number): boolean => (want === 'max' ? u > v : u < v)

/** The four steps of an optimization problem for a objective of one variable on its domain: the critical points inside, the
 *  closed endpoints, what happens at the open ends, and the best candidate. */
export function solveProblem(p: Problem): Solved | SolveFailed {
  const f = parseFunction(p.f)
  if (typeof f === 'string') return { ok: false }
  const df = derive(f).result
  const d2 = derive(df).result
  const lo = p.openA ? p.win[0] : p.a
  const hi = p.openB ? p.win[1] : p.b
  const r = extrema(p.f, lo, hi)
  if (!r.ok) return { ok: false }
  const rows: Row[] = []
  if (p.openA) rows.push({ kind: 'start', x: p.a, fx: null, limit: endBehaviour(f, p.a, 1) })
  else rows.push({ kind: 'start', x: p.a, fx: evalFloat(f, p.a) })
  for (const c of r.candidates) if (c.kind !== 'endpoint') rows.push({ kind: 'critical', x: c.x, fx: c.fx })
  if (p.openB) rows.push({ kind: 'end', x: p.b, fx: null, limit: endBehaviour(f, p.b, -1) })
  else rows.push({ kind: 'end', x: p.b, fx: evalFloat(f, p.b) })
  const real = rows.filter((w) => w.fx !== null) as (Row & { fx: number })[]
  if (!real.length) return { ok: false }
  let top = real[0]
  for (const w of real) if (better(p.want, w.fx, top.fx)) top = w
  // open ends: the best value must not be beaten by what the function approaches there
  let attained = true
  const tol = 1e-9 * (1 + Math.abs(top.fx))
  for (const w of rows) {
    if (!w.limit) continue
    const l = w.limit
    if (l.kind === 'inf') attained = attained && p.want === 'min'
    else if (l.kind === 'ninf') attained = attained && p.want === 'max'
    else if (Number.isFinite(l.value) && better(p.want, l.value, top.fx - (p.want === 'max' ? -tol : tol))) attained = false
  }
  const second = top.kind === 'critical' ? evalFloat(d2, top.x) : NaN
  // a window for the picture: all of the domain, with a y range that keeps the best point and the shape in view
  const span = hi - lo
  const ys: number[] = []
  for (let i = 0; i <= 240; i++) {
    const y = evalFloat(f, lo + (span * i) / 240)
    if (Number.isFinite(y)) ys.push(y)
  }
  let y0: number
  let y1: number
  if (p.want === 'min') {
    const s = Math.max(Math.abs(top.fx) * 0.8, 1e-6)
    y0 = Math.min(top.fx - 0.25 * s, Math.min(...ys))
    y1 = top.fx + 1.6 * s
  } else {
    const s = Math.max(Math.abs(top.fx), 1e-6)
    y0 = Math.min(-0.1 * s, Math.min(...ys))
    y1 = top.fx + 0.25 * s
  }
  return {
    ok: true,
    f,
    df,
    rows,
    best: { x: top.x, fx: top.fx, at: top.kind === 'critical' ? 'critical' : 'endpoint' },
    attained,
    second,
    xr: [lo - 0.03 * span, hi + 0.03 * span],
    yr: [y0, y1],
  }
}

/** The objective as a function of x, for drawing and for scans. */
export function objective(src: string): ((x: number) => number) | null {
  const f = parseFunction(src)
  return typeof f === 'string' ? null : (x) => evalFloat(f, x)
}

/* ------------------------------------------------------------------- the can of a given volume */

export type CanMode = 'closed' | 'open' | 'waste'

/** The material used by a can of volume V and radius r (h follows from the volume):
 *  closed: two ends and a wall; open: one end and a wall; waste: both ends cut from squares of side 2r. */
export function canArea(mode: CanMode, V: number, r: number): number {
  const wall = (2 * V) / r
  if (mode === 'closed') return 2 * Math.PI * r * r + wall
  if (mode === 'open') return Math.PI * r * r + wall
  return 8 * r * r + wall
}

export const canHeight = (V: number, r: number): number => V / (Math.PI * r * r)

/** The best radius in closed form: dA/dr = 0. */
export function canBest(mode: CanMode, V: number): { r: number; h: number; area: number } {
  const r = mode === 'closed' ? Math.cbrt(V / (2 * Math.PI)) : mode === 'open' ? Math.cbrt(V / Math.PI) : Math.cbrt(V / 8)
  return { r, h: canHeight(V, r), area: canArea(mode, V, r) }
}

/* ---------------------------------------------------------------------- the quickest path of light */

export interface SnellParams {
  /** height of A above the surface, depth (or height, for a mirror) of B, and the horizontal distance between them */
  a: number
  b: number
  d: number
  /** speed in the first and the second medium */
  c1: number
  c2: number
}

export const snellTime = (s: SnellParams, x: number): number => Math.sqrt(s.a * s.a + x * x) / s.c1 + Math.sqrt(s.b * s.b + (s.d - x) * (s.d - x)) / s.c2

const snellSlope = (s: SnellParams, x: number): number => x / (s.c1 * Math.sqrt(s.a * s.a + x * x)) - (s.d - x) / (s.c2 * Math.sqrt(s.b * s.b + (s.d - x) * (s.d - x)))

/** The point P = (x, 0) where the path from A to B takes the least time: dt/dx is continuous and increasing, negative at 0
 *  and positive at d, so it has exactly one zero, found by bisection. */
export function snellBest(s: SnellParams): { x: number; t: number; theta1: number; theta2: number } {
  let lo = 0
  let hi = s.d
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (snellSlope(s, mid) < 0) lo = mid
    else hi = mid
  }
  const x = (lo + hi) / 2
  return { x, t: snellTime(s, x), theta1: Math.atan2(x, s.a), theta2: Math.atan2(s.d - x, s.b) }
}

/* -------------------------------------------------------------- marginal revenue and marginal cost */

/** Revenue p·x against the cost x³ − 6x² + 15x of the textbook (millions of players, millions of dollars). */
export const costOf = (x: number): number => x * x * x - 6 * x * x + 15 * x
export const marginalCost = (x: number): number => 3 * x * x - 12 * x + 15
export const profitAt = (price: number, x: number): number => price * x - costOf(x)

export interface ProfitInfo {
  /** where marginal cost equals the price: the local minimum of profit (a loss peak) and the local maximum, if any */
  loss: number | null
  peak: number | null
  /** where revenue equals cost: the break-even points */
  breakEven: number[]
  /** the best production level on 0 ≤ x ≤ 5, and its profit */
  best: { x: number; profit: number }
}

export function profitInfo(price: number): ProfitInfo {
  const disc = price - 3
  const loss = disc > 0 ? 2 - Math.sqrt(disc / 3) : null
  const peak = disc > 0 ? 2 + Math.sqrt(disc / 3) : null
  const be: number[] = []
  if (price > 6) be.push(3 - Math.sqrt(price - 6), 3 + Math.sqrt(price - 6))
  const cands = [0, 5, ...(peak !== null && peak <= 5 ? [peak] : []), ...(loss !== null && loss >= 0 ? [loss] : [])]
  let best = { x: 0, profit: profitAt(price, 0) }
  for (const x of cands) {
    const v = profitAt(price, x)
    if (v > best.profit + 1e-12) best = { x, profit: v }
  }
  return { loss, peak, breakEven: be.filter((x) => x > 0), best }
}

/* ------------------------------------------------------------------- the delivery schedule */

/** Average daily cost of a delivery every x days: K per delivery, d units used per day, h to store a unit for a day. */
export const deliveryCost = (K: number, d: number, h: number, x: number): number => K / x + (h * d * x) / 2

/** The cycle length that minimizes it: dc/dx = 0 gives x² = 2K/(h·d). */
export function deliveryBest(K: number, d: number, h: number): { days: number; cost: number; units: number } {
  const days = Math.sqrt((2 * K) / (h * d))
  return { days, cost: deliveryCost(K, d, h, days), units: d * days }
}
