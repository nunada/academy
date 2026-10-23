/** Trigonometric equations: the numbers and data behind the "Trigonometric Equations" article's widgets.
 *
 *  Angles are in degrees, as everywhere in the trigonometry articles, except in `NUMERIC_EQUATIONS`, which are equations in x as a plain number
 *  (radians), solved by bisection and by Newton's method.
 *
 *   - `solveOn` and `solveMulti` list every solution of sin, cos or tan of (kx + b) equal to c in any interval;
 *   - `solveQuadratic` solves an equation that is quadratic in one trigonometric function, throwing away the roots that no angle can have;
 *   - `EQUATIONS` are solved examples: each line of a solution is itself an equation, so that the checker can test that a step keeps the same
 *     solutions (or, where the lesson is about it, adds or loses some);
 *   - `bisect` and `newton` record every iteration.
 *
 *  The checker (tools/check-trigeq.mjs) tests all of it against references that do not use it: a scan of the interval for every crossing, by Python's
 *  math module, for each equation and for each line of each solution, and mpmath's root finder for the numeric equations. */

import { solveBasic, type BasicFn } from './trigbasic'

export const PERIOD: Record<BasicFn, number> = { sin: 360, cos: 360, tan: 180 }

const r9 = (x: number): number => Math.round(x * 1e9) / 1e9

/** All the x in [lo, hi) with fn(x) = c, in increasing order, to nine decimals. */
export function solveOn(fn: BasicFn, c: number, lo: number, hi: number): number[] {
  const P = PERIOD[fn]
  const out: number[] = []
  for (const s of solveBasic(fn, c)) {
    for (let m = Math.ceil((lo - s) / P - 1e-9); ; m++) {
      const x = r9(s + m * P)
      if (x >= hi - 1e-9) break
      if (x >= lo - 1e-9 && !out.includes(x)) out.push(x)
    }
  }
  return out.sort((a, b) => a - b)
}

/** All the x in [lo, hi) with fn(k·x + b) = c, for k > 0: solve for the angle k·x + b over the matching interval, then divide. */
export function solveMulti(fn: BasicFn, k: number, b: number, c: number, lo = 0, hi = 360): number[] {
  if (!(k > 0) || !Number.isFinite(b) || !Number.isFinite(c)) return []
  const out: number[] = []
  for (const u of solveOn(fn, c, k * lo + b, k * hi + b)) {
    const x = r9((u - b) / k)
    if (x >= lo - 1e-9 && x < hi - 1e-9 && !out.includes(x)) out.push(x)
  }
  return out.sort((a, b2) => a - b2)
}

export interface QuadraticSolution {
  /** the real roots u of a·u² + b·u + c = 0 */
  roots: number[]
  /** whether some angle has fn equal to that root: always for tan, only for −1 to 1 for sin and cos */
  admissible: boolean[]
  /** the angles of each root, and of all of them, in [0°, 360°) */
  byRoot: number[][]
  solutions: number[]
}

/** The angles x in [0°, 360°) with a·fn(x)² + b·fn(x) + c = 0. */
export function solveQuadratic(fn: BasicFn, a: number, b: number, c: number): QuadraticSolution {
  let roots: number[] = []
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) >= 1e-12) roots = [-c / b]
  } else {
    const disc = b * b - 4 * a * c
    if (Math.abs(disc) < 1e-12) roots = [-b / (2 * a)]
    else if (disc > 0) roots = [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)].sort((p, q) => p - q)
  }
  const admissible = roots.map((u) => fn === 'tan' || Math.abs(u) <= 1 + 1e-12)
  const byRoot = roots.map((u, i) => (admissible[i] ? solveBasic(fn, fn === 'tan' ? u : Math.max(-1, Math.min(1, u))) : []))
  const all: number[] = []
  for (const list of byRoot) for (const x of list) if (!all.includes(x)) all.push(x)
  return { roots, admissible, byRoot, solutions: all.sort((p, q) => p - q) }
}

/* ------------------------------------------------------------------------------ solved examples */

export type Why = 'factor' | 'double' | 'quotient' | 'multiply' | 'sumproduct' | 'square' | 'pythagorean' | 'harmonic' | 'basic' | 'rewrite' | 'product' | 'root' | 'move' | 'check'

export interface EqStep {
  tex: string
  /** this line as an equation, for the checker: left side and right side as expressions in x (degrees) */
  eq?: [string, string]
  /** a line that adds solutions (squaring) or loses them (dividing by something that can be zero) */
  note?: 'adds' | 'loses'
  why: Why | null
}
export interface SolvedEquation {
  id: string
  /** the equation as TeX and as expressions */
  tex: string
  le: string
  re: string
  steps: EqStep[]
  /** the solutions in [0°, 360°) */
  solutions: number[]
  /** the values that the squared line has and the original does not */
  extraneous?: number[]
}

const St = (tex: string, why: Why | null, eq?: [string, string], note?: 'adds' | 'loses'): EqStep => ({ tex, why, eq, note })

export const EQUATIONS: SolvedEquation[] = [
  {
    id: 'quad-sin',
    tex: '2\\sin^2 x-\\sin x-1=0',
    le: '2*sin(x)^2-sin(x)-1',
    re: '0',
    steps: [
      St('2\\sin^2 x-\\sin x-1=0', null, ['2*sin(x)^2-sin(x)-1', '0']),
      St('(2\\sin x+1)(\\sin x-1)=0', 'factor', ['(2*sin(x)+1)*(sin(x)-1)', '0']),
      St('\\sin x=-\\tfrac12\\quad\\text{or}\\quad\\sin x=1', 'basic'),
    ],
    solutions: [90, 210, 330],
  },
  {
    id: 'double-sin',
    tex: '\\sin2x=\\cos x',
    le: 'sin(2*x)',
    re: 'cos(x)',
    steps: [
      St('\\sin2x=\\cos x', null, ['sin(2*x)', 'cos(x)']),
      St('2\\sin x\\cos x=\\cos x', 'double', ['2*sin(x)*cos(x)', 'cos(x)']),
      St('\\cos x\\,(2\\sin x-1)=0', 'factor', ['cos(x)*(2*sin(x)-1)', '0']),
      St('\\cos x=0\\quad\\text{or}\\quad\\sin x=\\tfrac12', 'basic'),
    ],
    solutions: [30, 90, 150, 270],
  },
  {
    id: 'double-cos',
    tex: '\\cos2x=\\cos x',
    le: 'cos(2*x)',
    re: 'cos(x)',
    steps: [
      St('\\cos2x=\\cos x', null, ['cos(2*x)', 'cos(x)']),
      St('2\\cos^2 x-1=\\cos x', 'double', ['2*cos(x)^2-1', 'cos(x)']),
      St('2\\cos^2 x-\\cos x-1=0', 'move', ['2*cos(x)^2-cos(x)-1', '0']),
      St('(2\\cos x+1)(\\cos x-1)=0', 'factor', ['(2*cos(x)+1)*(cos(x)-1)', '0']),
      St('\\cos x=-\\tfrac12\\quad\\text{or}\\quad\\cos x=1', 'basic'),
    ],
    solutions: [0, 120, 240],
  },
  {
    id: 'tan-sin',
    tex: '\\tan x=2\\sin x',
    le: 'tan(x)',
    re: '2*sin(x)',
    steps: [
      St('\\tan x=2\\sin x', null, ['tan(x)', '2*sin(x)']),
      St('\\frac{\\sin x}{\\cos x}=2\\sin x', 'quotient', ['sin(x)/cos(x)', '2*sin(x)']),
      St('\\sin x=2\\sin x\\cos x', 'multiply', ['sin(x)', '2*sin(x)*cos(x)']),
      St('\\sin x\\,(1-2\\cos x)=0', 'factor', ['sin(x)*(1-2*cos(x))', '0']),
      St('\\sin x=0\\quad\\text{or}\\quad\\cos x=\\tfrac12', 'basic'),
    ],
    solutions: [0, 60, 180, 300],
  },
  {
    id: 'sin3-sin',
    tex: '\\sin3x=\\sin x',
    le: 'sin(3*x)',
    re: 'sin(x)',
    steps: [
      St('\\sin3x=\\sin x', null, ['sin(3*x)', 'sin(x)']),
      St('\\sin3x-\\sin x=0', 'move', ['sin(3*x)-sin(x)', '0']),
      St('2\\cos2x\\,\\sin x=0', 'sumproduct', ['2*cos(2*x)*sin(x)', '0']),
      St('\\sin x=0\\quad\\text{or}\\quad\\cos2x=0', 'basic'),
    ],
    solutions: [0, 45, 135, 180, 225, 315],
  },
  {
    id: 'sincos-one',
    tex: '\\sin x+\\cos x=1',
    le: 'sin(x)+cos(x)',
    re: '1',
    steps: [
      St('\\sin x+\\cos x=1', null, ['sin(x)+cos(x)', '1']),
      St('(\\sin x+\\cos x)^2=1', 'square', ['(sin(x)+cos(x))^2', '1'], 'adds'),
      St('1+\\sin2x=1', 'double', ['1+sin(2*x)', '1']),
      St('\\sin2x=0', 'move', ['sin(2*x)', '0']),
      St('x=0^\\circ,\\ 90^\\circ,\\ 180^\\circ,\\ 270^\\circ\\ \\text{; check each in the original}', 'check'),
    ],
    solutions: [0, 90],
    extraneous: [180, 270],
  },
  {
    id: 'harmonic',
    tex: '3\\sin x+4\\cos x=2.5',
    le: '3*sin(x)+4*cos(x)',
    re: '2.5',
    steps: [
      St('3\\sin x+4\\cos x=2.5', null, ['3*sin(x)+4*cos(x)', '2.5']),
      St('5\\sin(x+53.13^\\circ)=2.5', 'harmonic', ['5*sin(x+53.130102)', '2.5']),
      St('\\sin(x+53.13^\\circ)=\\tfrac12', 'move', ['sin(x+53.130102)', '0.5']),
      St('x+53.13^\\circ=30^\\circ\\ \\text{or}\\ 150^\\circ\\ (+360^\\circ k)', 'basic'),
    ],
    solutions: [96.869898, 336.869898],
  },
  {
    id: 'sin-cos',
    tex: '\\sin x=\\cos x',
    le: 'sin(x)',
    re: 'cos(x)',
    steps: [
      St('\\sin x=\\cos x', null, ['sin(x)', 'cos(x)']),
      St('\\tan x=1', 'quotient', ['tan(x)', '1']),
      St('x=45^\\circ\\ \\text{or}\\ 225^\\circ', 'basic'),
    ],
    solutions: [45, 225],
  },
  {
    id: 'tan-squared',
    tex: '\\tan^2 x=3',
    le: 'tan(x)^2',
    re: '3',
    steps: [
      St('\\tan^2 x=3', null, ['tan(x)^2', '3']),
      St('\\tan x=\\sqrt3\\quad\\text{or}\\quad\\tan x=-\\sqrt3', 'root', ['abs(tan(x))', 'sqrt(3)']),
      St('x=60^\\circ,\\ 240^\\circ\\ \\text{and}\\ 120^\\circ,\\ 300^\\circ', 'basic'),
    ],
    solutions: [60, 120, 240, 300],
  },
  {
    id: 'sin-cos-product',
    tex: '\\sin x\\cos x=\\tfrac14',
    le: 'sin(x)*cos(x)',
    re: '0.25',
    steps: [
      St('\\sin x\\cos x=\\tfrac14', null, ['sin(x)*cos(x)', '0.25']),
      St('2\\sin x\\cos x=\\tfrac12', 'multiply', ['2*sin(x)*cos(x)', '0.5']),
      St('\\sin2x=\\tfrac12', 'double', ['sin(2*x)', '0.5']),
      St('2x=30^\\circ,\\ 150^\\circ,\\ 390^\\circ,\\ 510^\\circ', 'basic'),
    ],
    solutions: [15, 75, 195, 255],
  },
  {
    id: 'cos-squared-sin',
    tex: '2\\cos^2 x+3\\sin x=3',
    le: '2*cos(x)^2+3*sin(x)',
    re: '3',
    steps: [
      St('2\\cos^2 x+3\\sin x=3', null, ['2*cos(x)^2+3*sin(x)', '3']),
      St('2(1-\\sin^2 x)+3\\sin x=3', 'pythagorean', ['2*(1-sin(x)^2)+3*sin(x)', '3']),
      St('2\\sin^2 x-3\\sin x+1=0', 'move', ['2*sin(x)^2-3*sin(x)+1', '0']),
      St('(2\\sin x-1)(\\sin x-1)=0', 'factor', ['(2*sin(x)-1)*(sin(x)-1)', '0']),
      St('\\sin x=\\tfrac12\\quad\\text{or}\\quad\\sin x=1', 'basic'),
    ],
    solutions: [30, 90, 150],
  },
]

/* ----------------------------------------------------------------------- equations in a plain number */

export interface NumericEquation {
  id: string
  /** TeX of the equation f(x) = 0 is written as left = right */
  tex: string
  /** f(x) = left − right, and its derivative, with x in radians */
  f: (x: number) => number
  df: (x: number) => number
  /** an interval with a sign change, and a starting point for Newton's method */
  bracket: [number, number]
  start: number
}

export const NUMERIC_EQUATIONS: NumericEquation[] = [
  { id: 'cos-x', tex: '\\cos x=x', f: (x) => Math.cos(x) - x, df: (x) => -Math.sin(x) - 1, bracket: [0, 1], start: 1 },
  { id: 'sin-half', tex: '\\sin x=\\frac{x}{2}', f: (x) => Math.sin(x) - x / 2, df: (x) => Math.cos(x) - 0.5, bracket: [1, 2.5], start: 2 },
  { id: 'tan-x', tex: '\\tan x=x', f: (x) => Math.tan(x) - x, df: (x) => 1 / (Math.cos(x) * Math.cos(x)) - 1, bracket: [4.2, 4.65], start: 4.5 },
  { id: 'x-sin-x', tex: 'x\\sin x=1', f: (x) => x * Math.sin(x) - 1, df: (x) => Math.sin(x) + x * Math.cos(x), bracket: [0.8, 1.6], start: 1 },
  { id: 'cos-x-squared', tex: '\\cos x=x^2', f: (x) => Math.cos(x) - x * x, df: (x) => -Math.sin(x) - 2 * x, bracket: [0, 1], start: 1 },
]

export interface BisectRow {
  n: number
  a: number
  b: number
  mid: number
  fmid: number
}

/** Bisection on [a, b] with f(a) and f(b) of opposite signs: halve the interval, keep the half where the sign changes. Stops when it is shorter than tol. */
export function bisect(f: (x: number) => number, a: number, b: number, tol = 1e-12, maxSteps = 200): { root: number; rows: BisectRow[] } | null {
  let fa = f(a)
  const fb = f(b)
  if (!(fa * fb <= 0) || !Number.isFinite(fa) || !Number.isFinite(fb)) return null
  const rows: BisectRow[] = []
  let lo = a
  let hi = b
  for (let n = 1; n <= maxSteps; n++) {
    const mid = (lo + hi) / 2
    const fm = f(mid)
    rows.push({ n, a: lo, b: hi, mid, fmid: fm })
    if (fm === 0) return { root: mid, rows }
    if (fa * fm < 0) hi = mid
    else {
      lo = mid
      fa = fm
    }
    if (hi - lo < tol) break
  }
  return { root: (lo + hi) / 2, rows }
}

export interface NewtonRow {
  n: number
  x: number
  fx: number
}

/** Newton's method from x0: x ← x − f(x)/f′(x), recording every point; stops when |f| is tiny, or after maxSteps, or if the slope is zero. */
export function newton(f: (x: number) => number, df: (x: number) => number, x0: number, maxSteps = 50): { root: number; rows: NewtonRow[]; converged: boolean } {
  const rows: NewtonRow[] = []
  let x = x0
  for (let n = 0; n <= maxSteps; n++) {
    const fx = f(x)
    rows.push({ n, x, fx })
    if (Math.abs(fx) < 1e-15) return { root: x, rows, converged: true }
    const d = df(x)
    if (d === 0 || !Number.isFinite(d) || !Number.isFinite(fx)) return { root: x, rows, converged: false }
    x -= fx / d
  }
  return { root: x, rows, converged: Math.abs(f(x)) < 1e-9 }
}

/** The number of solutions of fn(k·x) = c in one turn: 2k for most c, k at the extremes of sine and cosine. */
export const solutionCount = (fn: BasicFn, k: number, c: number): number => solveMulti(fn, k, 0, c, 0, 360).length

