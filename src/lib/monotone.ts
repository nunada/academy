/** Monotonic functions and the First Derivative Test: the numbers behind the "Monotonic Functions and the First
 *  Derivative Test" article's widgets.
 *
 *  The checker (tools/check-monotone.mjs) tests this against references that do not use it: the textbook's examples,
 *  random polynomials against the exact roots of their derivative and a scan of the sign of the derivative, derivatives
 *  built from their factors (where the sign pattern is known from the multiplicities), the cases of the First Derivative
 *  Test, and inequalities proved by monotonicity against a scan of the difference. */

import { X, derive, evalFloat, type Node } from './chain'
import { parseFunction } from './linearize'
import { criticalPoints, extrema } from './extrema'

export type MonoError = 'syntax' | 'big' | 'interval' | 'undefined' | 'discontinuous'

export type Trend = 'up' | 'down' | 'flat'
export type Verdict = 'min' | 'max' | 'none'

/** An open interval between two neighbouring critical points (or ends) on which f′ keeps one sign. */
export interface Piece {
  lo: number
  hi: number
  trend: Trend
  /** the point where the sign was read, and f′ there */
  at: number
  slope: number
}

export interface Crit {
  x: number
  /** f′ is zero there, or does not exist */
  kind: 'zero' | 'undefined'
  fx: number
  left: Trend
  right: Trend
  /** what the First Derivative Test says */
  verdict: Verdict
}

/** A maximal interval on which the function is increasing, decreasing or constant (neighbouring pieces of one trend joined). */
export interface Run {
  lo: number
  hi: number
  trend: Trend
}

export interface Mono {
  ok: true
  f: Node | null
  df: Node
  a: number
  b: number
  pieces: Piece[]
  crit: Crit[]
  runs: Run[]
  /** the First Derivative Test at the two ends of the interval, where only one side exists */
  endA: Verdict
  endB: Verdict
  /** the absolute extremes on [a, b] by the closed interval method (not for a derivative typed on its own) */
  absMax?: { value: number; at: number[] }
  absMin?: { value: number; at: number[] }
}

export interface MonoFailed {
  ok: false
  error: MonoError
}

/** The test of the First Derivative Test: what f′ does across a critical point. */
export function verdictOf(left: Trend, right: Trend): Verdict {
  if (left === 'down' && right === 'up') return 'min'
  if (left === 'up' && right === 'down') return 'max'
  return 'none'
}

const SAMPLES = 9

/** The sign of f′ on (lo, hi): read at several points, which agree when no critical point was missed. */
function trendOn(df: Node, lo: number, hi: number): { trend: Trend; at: number; slope: number } {
  const vs: { x: number; v: number }[] = []
  for (let k = 0; k < SAMPLES; k++) {
    const x = lo + ((hi - lo) * (k + 0.5)) / SAMPLES
    const v = evalFloat(df, x)
    if (Number.isFinite(v)) vs.push({ x, v })
  }
  if (!vs.length) return { trend: 'flat', at: (lo + hi) / 2, slope: NaN }
  const scale = 1 + Math.max(...vs.map((p) => Math.abs(p.v)))
  const tol = 1e-9 * scale
  const pos = vs.filter((p) => p.v > tol).length
  const neg = vs.filter((p) => p.v < -tol).length
  const mid = vs[Math.floor(vs.length / 2)]
  if (pos === 0 && neg === 0) return { trend: 'flat', at: mid.x, slope: mid.v }
  const trend: Trend = pos >= neg ? 'up' : 'down'
  const pick = vs.find((p) => (trend === 'up' ? p.v > tol : p.v < -tol)) ?? mid
  return { trend, at: pick.x, slope: pick.v }
}

function build(f: Node | null, df: Node, a: number, b: number, points: { x: number; kind: 'zero' | 'undefined' }[]) {
  const xs = [a, ...points.map((p) => p.x), b]
  const pieces: Piece[] = []
  for (let i = 0; i + 1 < xs.length; i++) {
    const t = trendOn(df, xs[i], xs[i + 1])
    pieces.push({ lo: xs[i], hi: xs[i + 1], ...t })
  }
  const crit: Crit[] = points.map((p, i) => ({
    x: p.x,
    kind: p.kind,
    fx: f ? evalFloat(f, p.x) : NaN,
    left: pieces[i].trend,
    right: pieces[i + 1].trend,
    verdict: verdictOf(pieces[i].trend, pieces[i + 1].trend),
  }))
  const runs: Run[] = []
  for (const p of pieces) {
    const last = runs[runs.length - 1]
    if (last && last.trend === p.trend) last.hi = p.hi
    else runs.push({ lo: p.lo, hi: p.hi, trend: p.trend })
  }
  const first = pieces[0].trend
  const end = pieces[pieces.length - 1].trend
  const endA: Verdict = first === 'up' ? 'min' : first === 'down' ? 'max' : 'none'
  const endB: Verdict = end === 'up' ? 'max' : end === 'down' ? 'min' : 'none'
  return { pieces, crit, runs, endA, endB }
}

/** Where f rises and falls on [a, b], its critical points and what the First Derivative Test says at each. */
export function monotone(src: string, a: number, b: number): Mono | MonoFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'interval' }
  const e = extrema(src, a, b)
  const df = derive(f).result
  if (!e.ok) {
    if (e.error === 'constant') {
      return { ok: true, f, df, a, b, pieces: [{ lo: a, hi: b, trend: 'flat', at: (a + b) / 2, slope: 0 }], crit: [], runs: [{ lo: a, hi: b, trend: 'flat' }], endA: 'none', endB: 'none' }
    }
    return { ok: false, error: e.error === 'undefined' ? 'undefined' : e.error === 'discontinuous' ? 'discontinuous' : e.error === 'big' ? 'big' : e.error === 'syntax' ? 'syntax' : 'interval' }
  }
  const points = e.candidates.filter((c) => c.kind !== 'endpoint').map((c) => ({ x: c.x, kind: c.kind as 'zero' | 'undefined' }))
  return { ok: true, f, df, a, b, ...build(f, df, a, b, points), absMax: e.max, absMin: e.min }
}

/** The sign chart of a derivative typed on its own, as in the textbook's exercises that give f′ and ask about f. The
 *  function is taken to be continuous, and defined wherever f′ is not: a point where f′ does not exist is then critical. */
export function chart(dsrc: string, a: number, b: number): Mono | MonoFailed {
  const df = parseFunction(dsrc)
  if (typeof df === 'string') return { ok: false, error: df === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'interval' }
  const points = criticalPoints(X, df, a, b)
  return { ok: true, f: null, df, a, b, ...build(null, df, a, b, points) }
}

/* -------------------------------------------------------- inequalities from monotonicity */

export interface Comparison {
  ok: true
  /** h = f − g on [a, b] */
  h: Mono
  ha: number
  /** the smallest value of h on [a, b], and where */
  min: { value: number; at: number[] }
  /** f ≥ g on the whole interval */
  holds: boolean
  /** f > g except at the starting point */
  strict: boolean
  /** h(a) ≥ 0 and h never decreases: the proof by monotonicity */
  byMonotone: boolean
}

export function compare(fsrc: string, gsrc: string, a: number, b: number): Comparison | MonoFailed {
  const h = monotone(`(${fsrc})-(${gsrc})`, a, b)
  if (!h.ok) return h
  const ha = evalFloat(h.f as Node, a)
  const min = h.absMin ?? { value: ha, at: [a] }
  const tol = 1e-9
  const holds = min.value >= -tol
  const nondecreasing = h.pieces.every((p) => p.trend !== 'down')
  return { ok: true, h, ha, min, holds, strict: holds && min.at.every((x) => Math.abs(x - a) < 1e-9), byMonotone: ha >= -tol && nondecreasing }
}

/* ------------------------------------------------------------------------- the four patterns */

export interface Pattern {
  id: string
  src: string
  tex: string
  /** the critical point, and a window around it */
  c: number
  a: number
  b: number
  note: { en: string; id: string }
}

export const PATTERNS: Pattern[] = [
  { id: 'min', src: 'x^2', tex: 'y=x^2', c: 0, a: -2, b: 2, note: { en: 'f′ goes from negative to positive: a local minimum.', id: 'f′ berubah dari negatif ke positif: minimum lokal.' } },
  { id: 'max', src: '-x^2', tex: 'y=-x^2', c: 0, a: -2, b: 2, note: { en: 'f′ goes from positive to negative: a local maximum.', id: 'f′ berubah dari positif ke negatif: maksimum lokal.' } },
  { id: 'up', src: 'x^3', tex: 'y=x^3', c: 0, a: -2, b: 2, note: { en: 'f′ = 3x² is zero at 0 but positive on both sides: no extreme value, f keeps rising.', id: 'f′ = 3x² nol di 0 tetapi positif di kedua sisi: tidak ada nilai ekstrem, f terus naik.' } },
  { id: 'down', src: '-x^3', tex: 'y=-x^3', c: 0, a: -2, b: 2, note: { en: 'f′ is negative on both sides of the critical point 0: no extreme value, f keeps falling.', id: 'f′ negatif di kedua sisi titik kritis 0: tidak ada nilai ekstrem, f terus turun.' } },
  { id: 'corner', src: 'abs(x)', tex: 'y=|x|', c: 0, a: -2, b: 2, note: { en: 'f′ does not exist at 0 (a corner), but it goes from negative to positive: a local minimum.', id: 'f′ tidak ada di 0 (sebuah sudut), tetapi berubah dari negatif ke positif: minimum lokal.' } },
  { id: 'cusp', src: 'x^(2/3)', tex: 'y=x^{2/3}', c: 0, a: -2, b: 2, note: { en: 'f′ → −∞ then +∞: a cusp with a vertical tangent, and a local minimum.', id: 'f′ → −∞ lalu +∞: titik puncak dengan garis singgung tegak, dan minimum lokal.' } },
  { id: 'vertical', src: 'x^(1/3)', tex: 'y=\\sqrt[3]{x}', c: 0, a: -2, b: 2, note: { en: 'f′ does not exist at 0 (vertical tangent) and is positive on both sides: no extreme value.', id: 'f′ tidak ada di 0 (garis singgung tegak) dan positif di kedua sisi: tidak ada nilai ekstrem.' } },
  { id: 'flat-max', src: '-(x-1)^4', tex: 'y=-(x-1)^4', c: 1, a: -1, b: 3, note: { en: 'f′ = 0 at 1 and changes from positive to negative: a local maximum, even though the graph is very flat there.', id: 'f′ = 0 di 1 dan berubah dari positif ke negatif: maksimum lokal, walaupun grafik sangat datar di sana.' } },
]

/* --------------------------------------------------------------------- a particle on a line */

/** The position s(t) = 2t³ − 14t² + 22t − 5 of Example 7: it turns round at t = 1 and t = 11/3. */
export const PARTICLE = { s: (t: number) => 2 * t ** 3 - 14 * t ** 2 + 22 * t - 5, v: (t: number) => 6 * t * t - 28 * t + 22, a: (t: number) => 12 * t - 28 }
