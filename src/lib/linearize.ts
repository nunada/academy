/** Linearization and differentials: the numbers behind the "Linearization and Differentials" article's widgets.
 *
 *  The checker (tools/check-linearize.mjs) tests this against references that do not use it: the values printed in the
 *  textbook, the error of a linearization against the second-derivative estimate ½ f″(a) (x − a)², the "best linear
 *  approximation" property (every other line through the point leaves an error of the order of x − a), differentials
 *  against actual changes, and the percentage-error rule against exact powers. */

import { ParseError, derive, evalFloat, parseExpression, size, toTex, type Node } from './chain'

export type LinError = 'syntax' | 'big' | 'undefined' | 'nodiff'

export interface Linearization {
  ok: true
  f: Node
  df: Node
  /** f(a) and f′(a) */
  fa: number
  da: number
  /** the function, its derivative and the linearization at a, as TeX */
  fTex: string
  dfTex: string
  /** m x + c, the linearization written as a line */
  slope: number
  intercept: number
  /** the function and the linearization as plain functions of x */
  value: (x: number) => number
  line: (x: number) => number
}

export interface LinFailed {
  ok: false
  error: LinError
}

export function parseFunction(src: string): Node | LinError {
  try {
    const f = parseExpression(src, { log: true, inv: true })
    return size(f) > 70 ? 'big' : f
  } catch (e) {
    return e instanceof ParseError && e.code === 'big' ? 'big' : 'syntax'
  }
}

export function linearize(src: string, a: number): Linearization | LinFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f }
  const fa = evalFloat(f, a)
  if (!Number.isFinite(fa)) return { ok: false, error: 'undefined' }
  const df = derive(f).result
  const da = evalFloat(df, a)
  if (!Number.isFinite(da)) return { ok: false, error: 'nodiff' }
  return {
    ok: true,
    f,
    df,
    fa,
    da,
    fTex: toTex(f),
    dfTex: toTex(df),
    slope: da,
    intercept: fa - da * a,
    value: (x) => evalFloat(f, x),
    line: (x) => fa + da * (x - a),
  }
}

/** The change of f from a to a + dx, the differential f′(a) dx, and what is left. */
export interface Step {
  /** Δf = f(a + dx) − f(a) */
  delta: number
  /** df = f′(a) dx */
  dy: number
  /** Δf − df */
  error: number
  /** ε in Δf = f′(a) dx + ε dx */
  epsilon: number
}

export function differentialStep(lin: Linearization, a: number, dx: number): Step {
  const delta = lin.value(a + dx) - lin.fa
  const dy = lin.da * dx
  return { delta, dy, error: delta - dy, epsilon: dx === 0 ? 0 : (delta - dy) / dx }
}

/** The largest gap |f − L| over [a − h, a + h], found on a fine grid. */
export function maxGap(lin: Linearization, a: number, h: number, n = 400): number {
  let best = 0
  for (let i = 0; i <= n; i++) {
    const x = a - h + (2 * h * i) / n
    const g = Math.abs(lin.value(x) - lin.line(x))
    if (Number.isFinite(g) && g > best) best = g
  }
  return best
}

/** y = c x^n: a measuring error of p percent in x gives about n p percent in y; the exact figure is (1 + p/100)^n − 1. */
export function percentChange(n: number, p: number): { estimate: number; exact: number } {
  return { estimate: n * p, exact: ((1 + p / 100) ** n - 1) * 100 }
}

/** The error (in percent of x) that keeps the error in y = c x^n within q percent: about q / |n|. */
export function tolerance(n: number, q: number): number {
  return q / Math.abs(n)
}

export interface Preset {
  id: string
  src: string
  /** the center and the window of the graph */
  a: number
  xr: [number, number]
}

export const LIN_PRESETS: Preset[] = [
  { id: 'sqrt1', src: 'sqrt(1+x)', a: 0, xr: [-0.9, 3] },
  { id: 'sqrt3', src: 'sqrt(1+x)', a: 3, xr: [-0.9, 8] },
  { id: 'cos', src: 'cos(x)', a: Math.PI / 2, xr: [-0.2, 3.4] },
  { id: 'exp', src: 'e^x', a: 0, xr: [-2, 2] },
  { id: 'ln', src: 'ln(1+x)', a: 0, xr: [-0.9, 3] },
  { id: 'cbrt', src: 'x^(1/3)', a: 8, xr: [1, 15] },
  { id: 'recip', src: '1/x', a: 1, xr: [0.35, 2.6] },
  { id: 'sin', src: 'sin(x)', a: Math.PI / 6, xr: [-0.4, 2] },
]

/** Where the percentage rules come from: the formulas of the textbook's exercises. */
export interface Power {
  id: string
  n: number
  en: string
  id_: string
}

export const POWERS: Power[] = [
  { id: 'circumference', n: 1, en: 'circumference C = 2πr, from the radius', id_: 'keliling C = 2πr, dari jari-jari' },
  { id: 'area', n: 2, en: 'area A = πr², from the radius', id_: 'luas A = πr², dari jari-jari' },
  { id: 'volume', n: 3, en: 'volume V = x³ of a cube, from the edge', id_: 'volume V = x³ kubus, dari rusuk' },
  { id: 'flow', n: 4, en: 'blood flow V = kr⁴, from the artery radius', id_: 'aliran darah V = kr⁴, dari jari-jari arteri' },
  { id: 'period', n: -0.5, en: 'pendulum period T = 2π√(L/g), from g', id_: 'periode bandul T = 2π√(L/g), dari g' },
]
