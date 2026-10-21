/** Extreme values on a closed interval: the numbers behind the "Extreme Values of Functions on Closed Intervals"
 *  article's widgets.
 *
 *  The checker (tools/check-extrema.mjs) tests this against references that do not use it: the textbook's examples,
 *  a brute-force scan of a million points, the First Derivative Theorem (every interior extreme found by the scan is a
 *  critical point found here), the functions that have a critical point without an extremum, the box of Exercise 67
 *  against the formula for its critical point, and the cases of the Extreme Value Theorem against sampling. */

import { derive, evalFloat, type Node } from './chain'
import { parseFunction } from './linearize'

export type ExtremaError = 'syntax' | 'big' | 'interval' | 'undefined' | 'discontinuous' | 'constant'

export interface Candidate {
  x: number
  fx: number
  /** where the candidate comes from */
  kind: 'endpoint' | 'zero' | 'undefined'
  /** the derivative there: 0, or "does not exist" (NaN) or huge */
  slope: number
}

export interface Extrema {
  ok: true
  f: Node
  df: Node
  /** every endpoint and critical point, in order along the interval */
  candidates: Candidate[]
  /** the largest and the smallest value, and every candidate that takes it */
  max: { value: number; at: number[] }
  min: { value: number; at: number[] }
}

export interface ExtremaFailed {
  ok: false
  error: ExtremaError
}

const N = 4001

/** Every place in (a, b) where the derivative is zero or does not exist, found on a grid and refined by bisection.
 *  With `level` it is the places where the derivative equals that number (the Mean Value Theorem asks for f′ = the
 *  slope of the secant); `kind` 'zero' then means "equals the level". */
export function criticalPoints(f: Node, df: Node, a: number, b: number, level = 0): { x: number; kind: 'zero' | 'undefined' }[] {
  const g = (x: number) => evalFloat(df, x) - level
  const out: { x: number; kind: 'zero' | 'undefined' }[] = []
  const push = (x: number, kind: 'zero' | 'undefined') => {
    if (x <= a + 1e-9 * (b - a) || x >= b - 1e-9 * (b - a)) return
    if (out.some((o) => Math.abs(o.x - x) < 1e-6 * (b - a))) return
    out.push({ x, kind })
  }
  // a tiny shift of the grid keeps it from sitting exactly on a point of the function that is not defined
  const xs: number[] = []
  for (let i = 0; i <= N; i++) xs.push(a + ((b - a) * (i + (i === 0 || i === N ? 0 : 0.37))) / N)
  const g0 = xs.map(g)
  const sortedG = g0.filter((v) => Number.isFinite(v)).map(Math.abs).sort((p, q) => p - q)
  const typicalG = sortedG.length ? sortedG[Math.floor(sortedG.length / 2)] : 0
  let prev = g0[0]
  for (let i = 1; i <= N; i++) {
    const cur = g0[i]
    if (!Number.isFinite(cur) && Number.isFinite(evalFloat(f, xs[i]))) push(xs[i], 'undefined')
    if (Number.isFinite(prev) && Number.isFinite(cur) && ((prev < 0 && cur > 0) || (prev > 0 && cur < 0))) {
      let lo = xs[i - 1]
      let hi = xs[i]
      let glo = prev
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2
        const gm = g(mid)
        if (!Number.isFinite(gm)) break
        if ((gm < 0) === (glo < 0)) {
          lo = mid
          glo = gm
        } else hi = mid
      }
      const x = (lo + hi) / 2
      const gx = g(x)
      push(x, Number.isFinite(gx) && Math.abs(gx) < 1e-6 * (1 + typicalG) ? 'zero' : 'undefined')
    } else if (Number.isFinite(cur) && cur === 0) push(xs[i], 'zero')
    prev = cur
  }
  // a derivative that touches 0 without changing sign (x³ at 0) has no sign change to find: look for a local minimum
  // of |f′| that is as small as the arithmetic allows
  const gs = xs.map(g)
  const finite = gs.filter((v) => Number.isFinite(v)).map(Math.abs).sort((p, q) => p - q)
  const typical = finite.length ? finite[Math.floor(finite.length / 2)] : 0
  for (let i = 1; i < N; i++) {
    const m = Math.abs(gs[i])
    if (!Number.isFinite(m) || !Number.isFinite(gs[i - 1]) || !Number.isFinite(gs[i + 1])) continue
    if (m <= Math.abs(gs[i - 1]) && m <= Math.abs(gs[i + 1]) && m < 0.05 * (1 + typical)) {
      let lo = xs[i - 1]
      let hi = xs[i + 1]
      const phi = (Math.sqrt(5) - 1) / 2
      for (let k = 0; k < 120; k++) {
        const c1 = hi - phi * (hi - lo)
        const c2 = lo + phi * (hi - lo)
        if (Math.abs(g(c1)) < Math.abs(g(c2))) hi = c2
        else lo = c1
      }
      const x = (lo + hi) / 2
      if (Math.abs(g(x)) < 1e-7 * (1 + typical)) push(x, 'zero')
    }
  }
  for (let i = 1; i < N; i++) {
    const m = Math.abs(gs[i])
    if (!Number.isFinite(m) || !Number.isFinite(gs[i - 1]) || !Number.isFinite(gs[i + 1])) continue
    if (m >= Math.abs(gs[i - 1]) && m >= Math.abs(gs[i + 1]) && m > 20 * (1 + typical)) {
      let lo = xs[i - 1]
      let hi = xs[i + 1]
      const phi = (Math.sqrt(5) - 1) / 2
      for (let k = 0; k < 120; k++) {
        const c1 = hi - phi * (hi - lo)
        const c2 = lo + phi * (hi - lo)
        const v1 = Math.abs(g(c1))
        const v2 = Math.abs(g(c2))
        if (!Number.isFinite(v1) || v1 > v2) hi = c2
        else lo = c1
      }
      const x = (lo + hi) / 2
      const gx = Math.abs(g(x))
      // a steep but smooth peak levels off; a vertical tangent or a cusp does not
      if (!Number.isFinite(gx) || gx > 1e8) push(x, 'undefined')
    }
  }
  return out.sort((p, q) => p.x - q.x)
}

export function extrema(src: string, a: number, b: number): Extrema | ExtremaFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'interval' }
  // f has to be defined and continuous on [a, b]: look for a hole, a pole or a jump on a grid
  const vals: number[] = []
  for (let i = 0; i <= N; i++) vals.push(evalFloat(f, a + ((b - a) * i) / N))
  if (vals.some((v) => !Number.isFinite(v))) return { ok: false, error: 'undefined' }
  const sorted = vals.map(Math.abs).sort((p, q) => p - q)
  const median = sorted[Math.floor(sorted.length / 2)]
  const big = 1e6 * (1 + median)
  for (let i = 0; i < N; i++) {
    if (Math.abs(vals[i]) > big) return { ok: false, error: 'discontinuous' }
    if (vals[i] * vals[i + 1] < 0 && Math.abs(vals[i]) > 100 * (1 + median) && Math.abs(vals[i + 1]) > 100 * (1 + median)) return { ok: false, error: 'discontinuous' }
  }
  const df = derive(f).result
  const crit = criticalPoints(f, df, a, b)
  const candidates: Candidate[] = [
    { x: a, fx: vals[0], kind: 'endpoint', slope: evalFloat(df, a) },
    ...crit.map((c) => ({ x: c.x, fx: evalFloat(f, c.x), kind: c.kind, slope: evalFloat(df, c.x) })),
    { x: b, fx: vals[N], kind: 'endpoint', slope: evalFloat(df, b) },
  ]
  if (candidates.some((c) => !Number.isFinite(c.fx))) return { ok: false, error: 'undefined' }
  const top = Math.max(...candidates.map((c) => c.fx))
  const bottom = Math.min(...candidates.map((c) => c.fx))
  if (top - bottom < 1e-12 * (1 + Math.abs(top))) return { ok: false, error: 'constant' }
  const tol = 1e-9 * (1 + Math.max(Math.abs(top), Math.abs(bottom)))
  return {
    ok: true,
    f,
    df,
    candidates,
    max: { value: top, at: candidates.filter((c) => top - c.fx <= tol).map((c) => c.x) },
    min: { value: bottom, at: candidates.filter((c) => c.fx - bottom <= tol).map((c) => c.x) },
  }
}

/* --------------------------------------------------------- when the Extreme Value Theorem applies */

export interface EvtCase {
  id: string
  /** the function, and its domain; an end that is not closed is "open"; ±Infinity is a far, open end */
  f: (x: number) => number
  tex: string
  lo: number
  hi: number
  loClosed: boolean
  hiClosed: boolean
  /** places where the function jumps (a gap in the graph that the domain does not show) */
  breaks?: number[]
  /** a window for the graph */
  xr: [number, number]
  yr: [number, number]
  note: { en: string; id: string }
}

export const EVT_CASES: EvtCase[] = [
  { id: 'closed', f: (x) => x * x, tex: 'y=x^2,\\; D=[0,2]', lo: 0, hi: 2, loClosed: true, hiClosed: true, xr: [-0.3, 2.4], yr: [-0.5, 4.8], note: { en: 'Closed, bounded and continuous: the theorem applies, and both extremes exist.', id: 'Tertutup, terbatas, dan kontinu: teorema berlaku, dan kedua ekstrem ada.' } },
  { id: 'half-open', f: (x) => x * x, tex: 'y=x^2,\\; D=(0,2]', lo: 0, hi: 2, loClosed: false, hiClosed: true, xr: [-0.3, 2.4], yr: [-0.5, 4.8], note: { en: 'The left end is missing, so the smallest values 0.01, 0.0001, … have nothing to stop at: no minimum.', id: 'Ujung kiri tidak termasuk, sehingga nilai terkecil 0,01; 0,0001; … tidak berhenti di mana pun: tidak ada minimum.' } },
  { id: 'open', f: (x) => x * x, tex: 'y=x^2,\\; D=(0,2)', lo: 0, hi: 2, loClosed: false, hiClosed: false, xr: [-0.3, 2.4], yr: [-0.5, 4.8], note: { en: 'Both ends are missing: values come as close to 0 and to 4 as we like, but never equal them.', id: 'Kedua ujung tidak termasuk: nilai mendekati 0 dan 4 sedekat yang kita mau, tetapi tidak pernah sama.' } },
  { id: 'whole-line', f: (x) => x * x, tex: 'y=x^2,\\; D=(-\\infty,\\infty)', lo: -Infinity, hi: Infinity, loClosed: false, hiClosed: false, xr: [-3, 3], yr: [-0.5, 9], note: { en: 'The interval is not bounded: the minimum 0 exists, but x² grows without bound, so there is no maximum.', id: 'Selangnya tidak terbatas: minimum 0 ada, tetapi x² membesar tanpa batas, sehingga tidak ada maksimum.' } },
  { id: 'exponential', f: (x) => Math.exp(x), tex: 'y=e^x,\\; D=(-\\infty,\\infty)', lo: -Infinity, hi: Infinity, loClosed: false, hiClosed: false, xr: [-4, 3], yr: [-1, 20], note: { en: 'Unbounded interval: eˣ has neither a maximum nor a minimum.', id: 'Selang tak terbatas: eˣ tidak memiliki maksimum maupun minimum.' } },
  { id: 'jump', f: (x) => (x < 1 ? x : 0), tex: 'y=x\\ (0\\le x<1),\\; y=0\\ (x=1)', lo: 0, hi: 1, loClosed: true, hiClosed: true, breaks: [1], xr: [-0.3, 1.4], yr: [-0.3, 1.3], note: { en: 'Closed and bounded but not continuous at 1: the values come close to 1 and never reach it, so there is no maximum.', id: 'Tertutup dan terbatas tetapi tidak kontinu di 1: nilai mendekati 1 dan tidak pernah mencapainya, sehingga tidak ada maksimum.' } },
]

export interface EvtOutcome {
  max: { exists: boolean; value: number; at: number[] }
  min: { exists: boolean; value: number; at: number[] }
}

const FAR = 40

/** Sample the domain, with points just inside every open end, and say whether the largest and the smallest sample are
 *  at a place that belongs to the domain (the value is attained) or only next to an open end (no extreme value). */
export function evtOutcome(c: EvtCase): EvtOutcome {
  const lo = Number.isFinite(c.lo) ? c.lo : -FAR
  const hi = Number.isFinite(c.hi) ? c.hi : FAR
  const openLo = !c.loClosed || !Number.isFinite(c.lo)
  const openHi = !c.hiClosed || !Number.isFinite(c.hi)
  const eps = (hi - lo) * 1e-9
  const pts: { x: number; edge: 'lo' | 'hi' | null }[] = []
  const n = 20000
  const step = (hi - lo) / n
  for (let i = 0; i <= n; i++) {
    const x = lo + step * i
    if (i === 0 && openLo) pts.push({ x: lo + eps, edge: 'lo' })
    else if (i === n && openHi) pts.push({ x: hi - eps, edge: 'hi' })
    else if ((c.breaks ?? []).some((k) => Math.abs(x - k) > 1e-12 && Math.abs(x - k) <= 3 * step)) pts.push({ x, edge: 'hi' })   // next to a jump
    else pts.push({ x, edge: null })
  }
  const vs = pts.map((p) => c.f(p.x))
  const out = (sign: 1 | -1) => {
    let best = 0
    for (let i = 1; i < pts.length; i++) if (sign * vs[i] > sign * vs[best] + 1e-12) best = i
    const value = vs[best]
    const exists = pts[best].edge === null
    const at = pts.filter((_, i) => Math.abs(vs[i] - value) < 1e-9 && pts[i].edge === null).map((p) => p.x)
    return { exists, value, at: exists ? at : [] }
  }
  return { max: out(1), min: out(-1) }
}

/* ------------------------------------------------------------------ a box cut from a sheet */

/** A sheet w by l, a square of side x cut from each corner and the sides folded up: V(x) = x (w − 2x)(l − 2x). */
export const boxVolume = (w: number, l: number, x: number): number => x * (w - 2 * x) * (l - 2 * x)

/** The one critical point of V in (0, min(w, l) / 2), from V′(x) = 12x² − 4(w + l)x + wl = 0. */
export const boxBest = (w: number, l: number): number => (w + l - Math.sqrt(w * w - w * l + l * l)) / 6
