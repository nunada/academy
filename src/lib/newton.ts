/** Newton's method: the numbers behind the "Newton's Method" article's widgets.
 *
 *  The checker (tools/check-newton.mjs) tests this against references that do not use it: the textbook's tables and exercises,
 *  roots computed by SymPy's nsolve, the closed forms of the square root, the reciprocal and the n-th root, the order of
 *  convergence for simple and multiple roots, the cases that fail (a cycle, an escape, a horizontal tangent, the wrong root),
 *  and the basins of attraction against a plain loop written in the checker. */

import { derive, evalFloat, type Node } from './chain'
import { parseFunction } from './linearize'

export type NewtonStatus = 'converged' | 'flat' | 'cycle' | 'diverged' | 'undefined' | 'unfinished'

export interface NewtonStep {
  n: number
  x: number
  fx: number
  dfx: number
  /** x − f(x)/f′(x): the next approximation */
  next: number
}

export interface NewtonRun {
  ok: true
  f: Node
  df: Node
  /** every step taken, until the run stopped */
  steps: NewtonStep[]
  status: NewtonStatus
  /** the last approximation */
  last: number
  /** the length of the cycle, when the status is 'cycle' */
  period: number
}

export interface NewtonFailed {
  ok: false
  error: 'syntax' | 'big' | 'start'
}

const CYCLE_MAX = 6

/** One run of Newton's method from x0: stops when the step is smaller than the arithmetic can show, when f′ is zero, when the
 *  iterates repeat (a cycle), when they run off, or after `max` steps. */
export function newton(src: string, x0: number, max = 40): NewtonRun | NewtonFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!Number.isFinite(x0)) return { ok: false, error: 'start' }
  const df = derive(f).result
  return run(f, df, x0, max)
}

function run(f: Node, df: Node, x0: number, max: number): NewtonRun {
  const xs = [x0]
  const steps: NewtonStep[] = []
  let status: NewtonStatus = 'unfinished'
  let period = 0
  for (let n = 0; n < max; n++) {
    const x = xs[n]
    const fx = evalFloat(f, x)
    const dfx = evalFloat(df, x)
    if (!Number.isFinite(fx) || !Number.isFinite(dfx)) {
      status = 'undefined'
      break
    }
    // an exact hit: f is exactly zero (a small |f| is not enough: a flat curve is small a long way from its root)
    if (fx === 0) {
      steps.push({ n, x, fx, dfx, next: x })
      status = 'converged'
      break
    }
    if (dfx === 0 || Math.abs(dfx) < 1e-290) {
      steps.push({ n, x, fx, dfx, next: NaN })
      status = 'flat'
      break
    }
    const next = x - fx / dfx
    steps.push({ n, x, fx, dfx, next })
    if (!Number.isFinite(next)) {
      status = 'undefined'
      break
    }
    xs.push(next)
    const dx = Math.abs(next - x)
    if (dx <= 1e-13 * (1 + Math.abs(x))) {
      status = 'converged'
      break
    }
    if (Math.abs(next) > 1e10) {
      status = 'diverged'
      break
    }
    // a cycle: the iterates return to an earlier value, while they are still far from standing still
    if (dx > 1e-6 * (1 + Math.abs(x))) {
      for (let p = 2; p <= CYCLE_MAX; p++) {
        if (n + 1 - p < 0 || n - p < 0) continue
        const a = Math.abs(xs[n + 1] - xs[n + 1 - p]) <= 1e-9 * (1 + Math.abs(next))
        const b = Math.abs(xs[n] - xs[n - p]) <= 1e-9 * (1 + Math.abs(x))
        if (a && b) {
          status = 'cycle'
          period = p
          break
        }
      }
      if (status === 'cycle') break
    }
  }
  return { ok: true, f, df, steps, status, last: xs[xs.length - 1], period }
}

/* ------------------------------------------------------------------- how fast it converges */

export interface ErrorRow {
  n: number
  x: number
  /** |x_n − r| */
  err: number
  /** correct decimal places, −log10 of the error (capped at 16) */
  digits: number
  /** e_{n+1} / e_n²: tends to |f″(r) / (2 f′(r))| for a simple root */
  quad: number
  /** e_{n+1} / e_n: tends to (m − 1)/m for a root of multiplicity m */
  lin: number
}

/** The errors of a run against the root r, with the two ratios that tell the order of convergence. */
export function errorTable(r: NewtonRun, root: number): ErrorRow[] {
  const xs = r.steps.map((s) => s.x)
  if (r.steps.length && Number.isFinite(r.steps[r.steps.length - 1].next)) xs.push(r.steps[r.steps.length - 1].next)
  const errs = xs.map((x) => Math.abs(x - root))
  return xs.map((x, n) => ({
    n,
    x,
    err: errs[n],
    digits: errs[n] > 0 ? Math.min(16, -Math.log10(errs[n])) : 16,
    quad: n + 1 < errs.length && errs[n] > 0 ? errs[n + 1] / (errs[n] * errs[n]) : NaN,
    lin: n + 1 < errs.length && errs[n] > 0 ? errs[n + 1] / errs[n] : NaN,
  }))
}

/** The middle of the bracket after each of `count` halvings, for f with a sign change on [a, b]. */
export function bisectionSteps(src: string, a: number, b: number, count: number): number[] | null {
  const f = parseFunction(src)
  if (typeof f === 'string') return null
  let lo = a
  let hi = b
  let flo = evalFloat(f, lo)
  const fhi = evalFloat(f, hi)
  if (!Number.isFinite(flo) || !Number.isFinite(fhi) || flo * fhi > 0) return null
  const mids: number[] = []
  for (let i = 0; i < count; i++) {
    const mid = (lo + hi) / 2
    const fm = evalFloat(f, mid)
    mids.push(mid)
    if (fm === 0) break
    if (fm * flo < 0) hi = mid
    else {
      lo = mid
      flo = fm
    }
  }
  return mids
}

/* ------------------------------------------------------------------- the basins of attraction */

export interface Basin {
  ok: true
  /** the roots that starting points reached, sorted, each with the number of starting points that reached it */
  roots: { root: number; count: number }[]
  /** for each starting point: its x0, the index of the root it reached (−1 if none), and the number of steps */
  starts: { x0: number; root: number; steps: number; status: NewtonStatus }[]
}

/** Run Newton's method from `count` evenly spaced starting points of [a, b], and sort them by the root they reach. */
export function basin(src: string, a: number, b: number, count = 300, max = 60): Basin | NewtonFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'start' }
  const df = derive(f).result
  const found: { root: number; count: number }[] = []
  const starts: Basin['starts'] = []
  for (let i = 0; i < count; i++) {
    const x0 = a + ((b - a) * (i + 0.5)) / count
    const r = run(f, df, x0, max)
    let idx = -1
    if (r.status === 'converged') {
      idx = found.findIndex((q) => Math.abs(q.root - r.last) <= 1e-6 * (1 + Math.abs(r.last)))
      if (idx < 0) {
        found.push({ root: r.last, count: 0 })
        idx = found.length - 1
      }
      found[idx].count++
    }
    starts.push({ x0, root: idx, steps: r.steps.length, status: r.status })
  }
  // renumber the roots in increasing order
  const order = found.map((q, k) => ({ q, k })).sort((p, q) => p.q.root - q.q.root)
  const rank = new Map(order.map((o, i) => [o.k, i]))
  return {
    ok: true,
    roots: order.map((o) => o.q),
    starts: starts.map((s) => ({ ...s, root: s.root < 0 ? -1 : (rank.get(s.root) as number) })),
  }
}

/* --------------------------------------------------------------- roots and reciprocals by hand */

/** Newton's method for xⁿ − a = 0 written without a derivative: x ← ((n − 1)x + a / x^(n−1)) / n, the Babylonian rule for n = 2. */
export function rootIterates(a: number, n: number, x0: number, count: number): number[] {
  const xs = [x0]
  for (let i = 0; i < count; i++) {
    const x = xs[i]
    xs.push(((n - 1) * x + a / x ** (n - 1)) / n)
  }
  return xs
}

/** The reciprocal of a without division: Newton's method for 1/x − a = 0 is x ← x(2 − a x). */
export function reciprocalIterates(a: number, x0: number, count: number): number[] {
  const xs = [x0]
  for (let i = 0; i < count; i++) xs.push(xs[i] * (2 - a * xs[i]))
  return xs
}

/* --------------------------------------------------------------------- the cases that go wrong */

export interface FailCase {
  id: string
  /** the function, the start, and what the run should end in */
  f: string
  x0: number
  status: NewtonStatus
  /** the interval of the picture */
  xr: [number, number]
  yr: [number, number]
}

export const FAIL_CASES: FailCase[] = [
  { id: 'good', f: 'x^2-2', x0: 1, status: 'converged', xr: [0, 2.2], yr: [-2.4, 3] },
  { id: 'cycle', f: 'x^3-2*x+2', x0: 0, status: 'cycle', xr: [-2, 2], yr: [-4, 6] },
  { id: 'cbrt', f: 'x^(1/3)', x0: 1, status: 'diverged', xr: [-9, 9], yr: [-2.4, 2.4] },
  { id: 'arctan', f: 'arctan(x)', x0: 2, status: 'diverged', xr: [-8, 8], yr: [-1.8, 1.8] },
  { id: 'flat', f: 'x^2-1', x0: 0, status: 'flat', xr: [-2, 2], yr: [-1.5, 3] },
  { id: 'far', f: 'sin(x)', x0: 1.7, status: 'converged', xr: [-1, 10], yr: [-1.6, 1.6] },
  { id: 'multiple', f: '(x-1)^6', x0: 2, status: 'unfinished', xr: [0.3, 2.2], yr: [-0.2, 3] },
]
