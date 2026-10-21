/** The Mean Value Theorem: the numbers behind the "The Mean Value Theorem" article's widgets.
 *
 *  The checker (tools/check-mvt.mjs) tests this against references that do not use it: the textbook's examples and
 *  exercises with their closed forms for c, the geometric and arithmetic means of Exercises 57 and 58, a brute-force
 *  scan of the auxiliary function h = f − (the secant) that the proof of the theorem uses, the cases of Rolle's Theorem,
 *  the roots of a polynomial against the roots of its derivative, and the families y = g(x) + C of Corollary 2. */

import { derive, evalFloat, type Node } from './chain'
import { parseFunction } from './linearize'
import { criticalPoints } from './extrema'
import { degree, derivative, polyMul, type Poly } from './tangent'
import { rat } from './realnum'
import { realRoots, rootPoint, toNumber } from './rates'

export type MvtError = 'syntax' | 'big' | 'interval' | 'undefined'

export interface Mvt {
  ok: true
  f: Node
  df: Node
  fa: number
  fb: number
  /** the slope of the secant through (a, f(a)) and (b, f(b)): the average rate of change over [a, b] */
  slope: number
  /** is f continuous on [a, b]? and where it is not (a pole, a hole or a jump) */
  continuous: boolean
  breaks: number[]
  /** is f differentiable at every point of (a, b)? and where it is not (a corner, a cusp, a vertical tangent) */
  differentiable: boolean
  kinks: number[]
  /** both hypotheses of the theorem */
  hypotheses: boolean
  /** every c in (a, b) with f′(c) equal to the slope of the secant; the theorem promises one when `hypotheses` */
  points: number[]
  /** f(a) = f(b): the special case of Rolle's Theorem, where the slope is 0 and the tangent is horizontal */
  rolle: boolean
}

export interface MvtFailed {
  ok: false
  error: MvtError
}

const N = 4001

/** Places inside [a, b] where f is not defined, or has a pole or a jump, found on a grid. */
function breaksOf(f: Node, a: number, b: number): number[] {
  const xs: number[] = []
  const vals: number[] = []
  for (let i = 0; i <= N; i++) {
    const x = a + ((b - a) * i) / N
    xs.push(x)
    vals.push(evalFloat(f, x))
  }
  const finite = vals.filter((v) => Number.isFinite(v)).map(Math.abs).sort((p, q) => p - q)
  const median = finite.length ? finite[Math.floor(finite.length / 2)] : 0
  const big = 1e6 * (1 + median)
  const out: number[] = []
  const push = (x: number) => {
    if (!out.some((o) => Math.abs(o - x) < 2e-3 * (b - a))) out.push(x)
  }
  for (let i = 0; i <= N; i++) {
    if (!Number.isFinite(vals[i]) || Math.abs(vals[i]) > big) push(xs[i])
    else if (i < N && Number.isFinite(vals[i + 1])) {
      const p = vals[i]
      const q = vals[i + 1]
      if (p * q < 0 && Math.abs(p) > 100 * (1 + median) && Math.abs(q) > 100 * (1 + median)) push((xs[i] + xs[i + 1]) / 2)
    }
  }
  return out.sort((p, q) => p - q)
}

/** Places inside (a, b) where f′ does not exist: the derivative is not a number there, or it jumps (a corner), or it
 *  blows up (a vertical tangent or a cusp). A jump or a blow-up survives when a cell of the grid is halved over and over;
 *  the change of a smooth derivative does not. */
export function nonDifferentiable(f: Node, df: Node, a: number, b: number): number[] {
  const M = 2001
  const xs: number[] = []
  const gs: number[] = []
  for (let i = 0; i < M; i++) {
    const x = a + ((b - a) * (i + 0.5)) / M
    xs.push(x)
    gs.push(evalFloat(df, x))
  }
  const out: number[] = []
  const push = (x: number) => {
    if (!out.some((o) => Math.abs(o - x) < 1e-6 * (b - a))) out.push(x)
  }
  const delta = (i: number): number => {
    if (i < 0 || i >= M - 1) return 0
    return Number.isFinite(gs[i]) && Number.isFinite(gs[i + 1]) ? Math.abs(gs[i + 1] - gs[i]) : Infinity
  }
  for (let i = 0; i < M - 1; i++) {
    if (!Number.isFinite(evalFloat(f, xs[i])) || !Number.isFinite(evalFloat(f, xs[i + 1]))) continue
    const d = delta(i)
    const near = Math.max(delta(i - 1), delta(i + 1))
    const scale = 1 + (Number.isFinite(gs[i]) ? Math.abs(gs[i]) : 0)
    if (!(d === Infinity || d > 2 * near + 1e-6 * scale)) continue
    let lo = xs[i]
    let hi = xs[i + 1]
    for (let k = 0; k < 48; k++) {
      const m = (lo + hi) / 2
      const gl = evalFloat(df, lo)
      const gm = evalFloat(df, m)
      const gh = evalFloat(df, hi)
      const left = Number.isFinite(gl) && Number.isFinite(gm) ? Math.abs(gm - gl) : Infinity
      const right = Number.isFinite(gm) && Number.isFinite(gh) ? Math.abs(gh - gm) : Infinity
      if (left >= right) hi = m
      else lo = m
    }
    const gl = evalFloat(df, lo)
    const gh = evalFloat(df, hi)
    const jump = !Number.isFinite(gl) || !Number.isFinite(gh) || Math.abs(gh - gl) > 1e-3 * (1 + Math.abs(gl))
    if (jump && Number.isFinite(evalFloat(f, (lo + hi) / 2))) push((lo + hi) / 2)
  }
  return out.sort((p, q) => p - q)
}

export function mvt(src: string, a: number, b: number): Mvt | MvtFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'interval' }
  const fa = evalFloat(f, a)
  const fb = evalFloat(f, b)
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) return { ok: false, error: 'undefined' }
  const df = derive(f).result
  const slope = (fb - fa) / (b - a)
  const breaks = breaksOf(f, a, b)
  const kinks = nonDifferentiable(f, df, a, b).filter((x) => !breaks.some((k) => Math.abs(k - x) < 5e-3 * (b - a)))
  const points = criticalPoints(f, df, a, b, slope)
    .filter((c) => c.kind === 'zero')
    .map((c) => c.x)
  const continuous = breaks.length === 0
  const differentiable = continuous && kinks.length === 0
  return {
    ok: true,
    f,
    df,
    fa,
    fb,
    slope,
    continuous,
    breaks,
    differentiable,
    kinks,
    hypotheses: continuous && differentiable,
    points,
    rolle: Math.abs(fb - fa) <= 1e-12 * (1 + Math.abs(fa) + Math.abs(fb)),
  }
}

/* ------------------------------------------------------------- Rolle's Theorem, case by case */

export interface RolleCase {
  id: string
  f: (x: number) => number
  tex: string
  a: number
  b: number
  /** which hypothesis is broken, if any */
  breaks: 'none' | 'endpoint' | 'interior' | 'corner' | 'cusp'
  /** where the tangent is horizontal, worked out by hand */
  horizontal: number[]
  /** places where the graph jumps (a gap in the drawing) */
  gaps?: number[]
  xr: [number, number]
  yr: [number, number]
  note: { en: string; id: string }
}

export const ROLLE_CASES: RolleCase[] = [
  { id: 'one', f: (x) => x * x - 2 * x, tex: 'y=x^2-2x,\\; [0,2]', a: 0, b: 2, breaks: 'none', horizontal: [1], xr: [-0.4, 2.4], yr: [-1.4, 1.4], note: { en: 'Continuous on [0, 2], differentiable inside, and f(0) = f(2) = 0: the tangent is horizontal at the one point c = 1.', id: 'Kontinu pada [0, 2], terdiferensialkan di dalam, dan f(0) = f(2) = 0: garis singgung mendatar di satu titik c = 1.' } },
  { id: 'three', f: (x) => Math.sin(x), tex: 'y=\\sin x,\\; [0,3\\pi]', a: 0, b: 3 * Math.PI, breaks: 'none', horizontal: [Math.PI / 2, (3 * Math.PI) / 2, (5 * Math.PI) / 2], xr: [-0.5, 3 * Math.PI + 0.5], yr: [-1.5, 1.5], note: { en: 'The theorem promises at least one horizontal tangent; here there are three, at π/2, 3π/2 and 5π/2.', id: 'Teorema menjanjikan paling sedikit satu garis singgung mendatar; di sini ada tiga, di π/2, 3π/2, dan 5π/2.' } },
  { id: 'semicircle', f: (x) => Math.sqrt(Math.max(0, 1 - x * x)), tex: 'y=\\sqrt{1-x^2},\\; [-1,1]', a: -1, b: 1, breaks: 'none', horizontal: [0], xr: [-1.4, 1.4], yr: [-0.4, 1.4], note: { en: 'Not differentiable at the ends, but the theorem only asks for differentiability inside (−1, 1): the tangent is horizontal at c = 0.', id: 'Tidak terdiferensialkan di ujung, tetapi teorema hanya meminta terdiferensialkan di dalam (−1, 1): garis singgung mendatar di c = 0.' } },
  { id: 'endpoint', f: (x) => (x < 1 ? x : 0), tex: 'y=x\\ (0\\le x<1),\\; y=0\\ (x=1)', a: 0, b: 1, breaks: 'endpoint', horizontal: [], gaps: [1], xr: [-0.3, 1.4], yr: [-0.3, 1.3], note: { en: 'Discontinuous at the endpoint 1, although f(0) = f(1) = 0: the slope is 1 everywhere inside, so no tangent is horizontal.', id: 'Tidak kontinu di ujung 1, walaupun f(0) = f(1) = 0: gradiennya 1 di mana-mana di dalam, sehingga tidak ada garis singgung yang mendatar.' } },
  { id: 'interior', f: (x) => (x < 1 ? x : x - 2), tex: 'y=x\\ (x<1),\\; y=x-2\\ (x\\ge1)', a: 0, b: 2, breaks: 'interior', horizontal: [], gaps: [1], xr: [-0.3, 2.3], yr: [-1.3, 1.3], note: { en: 'f(0) = f(2) = 0, but the graph jumps at the interior point 1, and the slope is 1 on both pieces: no horizontal tangent.', id: 'f(0) = f(2) = 0, tetapi grafik melompat di titik dalam 1, dan gradiennya 1 pada kedua bagian: tidak ada garis singgung mendatar.' } },
  { id: 'corner', f: (x) => Math.abs(x), tex: 'y=|x|,\\; [-1,1]', a: -1, b: 1, breaks: 'corner', horizontal: [], xr: [-1.4, 1.4], yr: [-0.3, 1.4], note: { en: 'Continuous on [−1, 1] and f(−1) = f(1), but there is a corner at 0 where f′ does not exist; the slope is −1 and then 1, never 0.', id: 'Kontinu pada [−1, 1] dan f(−1) = f(1), tetapi ada sudut di 0 tempat f′ tidak ada; gradiennya −1 lalu 1, tidak pernah 0.' } },
  { id: 'cusp', f: (x) => Math.cbrt(x) ** 2, tex: 'y=x^{2/3},\\; [-1,1]', a: -1, b: 1, breaks: 'cusp', horizontal: [], xr: [-1.4, 1.4], yr: [-0.3, 1.4], note: { en: 'Continuous, f(−1) = f(1) = 1, and f′ = ⅔x^(−1/3) is never 0; at 0 the graph has a cusp with a vertical tangent, so f is not differentiable there.', id: 'Kontinu, f(−1) = f(1) = 1, dan f′ = ⅔x^(−1/3) tidak pernah 0; di 0 grafik memiliki titik puncak dengan garis singgung tegak, sehingga f tidak terdiferensialkan di sana.' } },
]

/* ------------------------------------------------- between two zeros of a polynomial, a zero of f′ */

export interface RollePoly {
  poly: Poly
  dpoly: Poly
  roots: number[]
  /** the real zeros of f′, in order */
  critical: number[]
  /** the zeros of f′ strictly between two consecutive roots of f */
  between: number[][]
}

/** The polynomial (x − r₁)(x − r₂)…, from distinct integer roots. */
export function polyFromRoots(roots: number[]): Poly {
  let p: Poly = [rat(1n, 1n)]
  for (const r of roots) p = polyMul(p, [rat(BigInt(-r), 1n), rat(1n, 1n)])
  return p
}

/** The zeros of f′ for f with the given distinct integer roots, and which gap between two roots each one lies in. */
export function rolleRoots(rootsIn: number[]): RollePoly {
  const roots = [...new Set(rootsIn)].sort((p, q) => p - q)
  const poly = polyFromRoots(roots)
  const dpoly = derivative(poly)
  const span = Math.max(1, ...roots.map(Math.abs)) + 2
  const critical =
    degree(dpoly) < 1
      ? []
      : realRoots(dpoly, rat(BigInt(-span), 1n), rat(BigInt(span), 1n)).map((r) => toNumber(rootPoint(r)))
  const between = roots.slice(1).map((hi, i) => critical.filter((c) => c > roots[i] && c < hi))
  return { poly, dpoly, roots, critical, between }
}

/* -------------------------------------------------- two functions with the same derivative differ by C */

export interface Antiderivative {
  id: string
  /** what the function is called in the sentences: f, or v (velocity) or s (position) */
  fn: 'f' | 'v' | 's'
  /** the derivative, as a parseable text and as TeX */
  dSrc: string
  dTex: string
  /** a function whose derivative it is, without the constant: parseable text, TeX, and the function itself */
  gSrc: string
  gTex: string
  g: (x: number) => number
  /** the point the graph has to pass through at the start, and the window of the graph */
  x0: number
  y0: number
  xr: [number, number]
  yr: [number, number]
  /** the variable shown in the sentences: x or t */
  v: 'x' | 't'
  note: { en: string; id: string }
}

export const ANTIDERIVATIVES: Antiderivative[] = [
  { id: 'twox', fn: 'f', dSrc: '2*x', dTex: '2x', gSrc: 'x^2', gTex: 'x^2', g: (x) => x * x, x0: 0, y0: 0, xr: [-2.5, 2.5], yr: [-3.5, 6.5], v: 'x', note: { en: 'Every function with derivative 2x is x² + C: the parabolas are the same one, shifted up or down.', id: 'Setiap fungsi dengan turunan 2x adalah x² + C: parabola-parabola itu sama, hanya digeser naik atau turun.' } },
  { id: 'sin', fn: 'f', dSrc: 'sin(x)', dTex: '\\sin x', gSrc: '-cos(x)', gTex: '-\\cos x', g: (x) => -Math.cos(x), x0: 0, y0: 2, xr: [-2 * Math.PI, 2 * Math.PI], yr: [-3.5, 6.5], v: 'x', note: { en: 'Example 4: the graph through (0, 2) is −cos x + 3.', id: 'Contoh 4: grafik yang melalui (0, 2) adalah −cos x + 3.' } },
  { id: 'fall-v', fn: 'v', dSrc: '9.8', dTex: '9.8', gSrc: '9.8*x', gTex: '9.8t', g: (x) => 9.8 * x, x0: 0, y0: 0, xr: [-0.5, 3], yr: [-12, 32], v: 't', note: { en: 'A body falling freely from rest: its velocity is v(t) = 9.8t, because v(0) = 0 fixes C = 0.', id: 'Benda yang jatuh bebas dari diam: kecepatannya v(t) = 9,8t, karena v(0) = 0 menetapkan C = 0.' } },
  { id: 'fall-s', fn: 's', dSrc: '9.8*x', dTex: '9.8t', gSrc: '4.9*x^2', gTex: '4.9t^2', g: (x) => 4.9 * x * x, x0: 0, y0: 0, xr: [-0.5, 3], yr: [-12, 52], v: 't', note: { en: 'The position of that body is s(t) = 4.9t², measured downward from the rest position, because s(0) = 0 fixes C = 0.', id: 'Posisi benda itu adalah s(t) = 4,9t², diukur ke bawah dari posisi diam, karena s(0) = 0 menetapkan C = 0.' } },
  { id: 'cubic', fn: 'f', dSrc: '3*x^2-3', dTex: '3x^2-3', gSrc: 'x^3-3*x', gTex: 'x^3-3x', g: (x) => x ** 3 - 3 * x, x0: 0, y0: 1, xr: [-2.5, 2.5], yr: [-6, 8], v: 'x', note: { en: 'The graphs with derivative 3x² − 3 are all x³ − 3x + C: the same curve, shifted.', id: 'Grafik dengan turunan 3x² − 3 semuanya x³ − 3x + C: kurva yang sama, hanya digeser.' } },
]

/** The constant C of g(x) + C when the graph has to pass through (x0, y0). */
export const constantFor = (g: (x: number) => number, x0: number, y0: number): number => y0 - g(x0)
