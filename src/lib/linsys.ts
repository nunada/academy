/** Systems of two linear equations in two unknowns: the numbers behind the "Systems of Linear Equations in Two Variables" article's widgets.
 *
 *  An equation is a·x + b·y = c, kept as exact fractions (BigInt, lowest terms) so that "the answer is 7/3" is never "2.3333333". A system is two of them.
 *
 *   - `solve`: the three outcomes (one point, no point, a whole line) and the two degenerate cases where an equation has no unknown at all;
 *   - `cramer`: the determinant formula, with D, Dx and Dy;
 *   - `eliminationPlan` and `solveByElimination`: scale, add or subtract, solve one unknown, go back for the other, step by step;
 *   - `substitutionPlan` and `solveBySubstitution`: isolate one unknown, put it in the other equation;
 *   - `parseEquation`, `eqText`, `eqTex`: reading `3x - y = 5` as typed, and writing an equation back;
 *   - `clip`: where a line crosses a window, for drawing it;
 *   - `solveFloat`, `cond1`, `nearParallel`: the same system in double precision, how much a tiny change in the numbers moves the answer, and why.
 *
 *  The checker (tools/check-linsys.mjs) tests all of it against references that do not use it: exact Gauss-Jordan elimination on Python Fractions,
 *  SymPy's `linsolve`, brute force over a grid of integer points, the cross product of the direction vectors for parallel lines, and SymPy's parser for
 *  the typed equations. */

import { rat, ratAdd, ratCmp, ratText, type Rat } from './realnum'
import { ratDiv, ratMul, ratSub } from './rationals'
import { gcd, lcm } from './integers'

export type { Rat }

/* ------------------------------------------------------------------------ numbers */

/** A fraction from two integers (the denominator defaults to 1). */
export const Q = (n: number | bigint, d: number | bigint = 1): Rat => rat(BigInt(n), BigInt(d))
export const ZERO = Q(0)
export const ONE = Q(1)
export const isZero = (r: Rat): boolean => r.n === 0n
export const neg = (r: Rat): Rat => rat(-r.n, r.d)
export const absR = (r: Rat): Rat => (r.n < 0n ? neg(r) : r)
export const ratEq = (a: Rat, b: Rat): boolean => a.n === b.n && a.d === b.d
export const sign = (r: Rat): number => (r.n > 0n ? 1 : r.n < 0n ? -1 : 0)

/** A fraction as a double. Exact enough for drawing; the checker compares the fractions themselves. */
export function toNumber(r: Rat): number {
  const lim = 1n << 1000n
  let { n, d } = r
  while (n > lim || n < -lim || d > lim) {
    n >>= 1n
    d >>= 1n
    if (d === 0n) return n > 0n ? Infinity : -Infinity
  }
  return Number(n) / Number(d)
}

/* ---------------------------------------------------------------------- equations */

export interface Eq {
  a: Rat
  b: Rat
  c: Rat
}
export interface System {
  e1: Eq
  e2: Eq
}

/** The equation a·x + b·y = c from numbers. */
export const eq = (a: number, b: number, c: number): Eq => ({ a: Q(a), b: Q(b), c: Q(c) })
export const system = (a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): System => ({ e1: eq(a1, b1, c1), e2: eq(a2, b2, c2) })

/** The determinant of the coefficients, a1·b2 − a2·b1. Zero exactly when the two lines have the same direction. */
export const det = (s: System): Rat => ratSub(ratMul(s.e1.a, s.e2.b), ratMul(s.e2.a, s.e1.b))

const degenerate = (e: Eq): boolean => isZero(e.a) && isZero(e.b)

export type Solution =
  | { kind: 'unique'; x: Rat; y: Rat }
  /** No point lies on both lines (parallel lines, or an equation like 0 = 5). */
  | { kind: 'none' }
  /** Every point of one line is a solution: the equations describe the same line. */
  | { kind: 'line'; a: Rat; b: Rat; c: Rat }
  /** Both equations are 0 = 0: every point of the plane. */
  | { kind: 'plane' }

export interface CramerResult {
  D: Rat
  Dx: Rat
  Dy: Rat
  x: Rat
  y: Rat
}

/** Cramer's rule: x = Dx / D and y = Dy / D, with Dx = c1·b2 − c2·b1 and Dy = a1·c2 − a2·c1. Null when D = 0. */
export function cramer(s: System): CramerResult | null {
  const D = det(s)
  if (isZero(D)) return null
  const Dx = ratSub(ratMul(s.e1.c, s.e2.b), ratMul(s.e2.c, s.e1.b))
  const Dy = ratSub(ratMul(s.e1.a, s.e2.c), ratMul(s.e2.a, s.e1.c))
  return { D, Dx, Dy, x: ratDiv(Dx, D), y: ratDiv(Dy, D) }
}

/** The solution set of the system, exactly. */
export function solve(s: System): Solution {
  const { e1, e2 } = s
  // an equation with no unknown left is either always true (0 = 0) or never (0 = 5)
  for (const e of [e1, e2]) if (degenerate(e) && !isZero(e.c)) return { kind: 'none' }
  if (degenerate(e1) && degenerate(e2)) return { kind: 'plane' }
  if (degenerate(e1)) return { kind: 'line', ...e2 }
  if (degenerate(e2)) return { kind: 'line', ...e1 }
  const r = cramer(s)
  if (r) return { kind: 'unique', x: r.x, y: r.y }
  // D = 0: the lines are parallel; they are the same line exactly when the augmented matrix has rank 1 too
  const m1 = ratSub(ratMul(e1.a, e2.c), ratMul(e2.a, e1.c))
  const m2 = ratSub(ratMul(e1.b, e2.c), ratMul(e2.b, e1.c))
  return isZero(m1) && isZero(m2) ? { kind: 'line', ...e1 } : { kind: 'none' }
}

/** Does the point satisfy the equation? Exactly. */
export const satisfies = (e: Eq, x: Rat, y: Rat): boolean => ratEq(ratAdd(ratMul(e.a, x), ratMul(e.b, y)), e.c)

/* --------------------------------------------------------------------- elimination */

export type Unknown = 'x' | 'y'
const coef = (e: Eq, v: Unknown): Rat => (v === 'x' ? e.a : e.b)

/** An equation multiplied by k (k = 0 gives 0 = 0). */
export const scaleEq = (e: Eq, k: Rat): Eq => ({ a: ratMul(e.a, k), b: ratMul(e.b, k), c: ratMul(e.c, k) })
const addEq = (e: Eq, f: Eq): Eq => ({ a: ratAdd(e.a, f.a), b: ratAdd(e.b, f.b), c: ratAdd(e.c, f.c) })

/** The positive whole number that, as a multiplier, clears every denominator of an equation. */
export function clearingMultiplier(e: Eq): Rat {
  let l = 1n
  for (const r of [e.a, e.b, e.c]) l = lcm(l, r.d)
  return rat(l, 1n)
}

export interface ElimPlan {
  /** the unknown that goes away */
  gone: Unknown
  /** step 0: each equation multiplied by a whole number so that every coefficient is whole (both 1 when they already are) */
  clear: [Rat, Rat]
  /** the system after step 0 */
  whole: System
  /** step 1: the multipliers that make the two coefficients of `gone` equal in size */
  k1: Rat
  k2: Rat
  /** step 2: add the scaled equations (opposite coefficients) or subtract the second from the first (equal coefficients) */
  op: 'add' | 'sub'
  /** the two equations after step 1 */
  scaled: [Eq, Eq]
  /** the equation after step 2: no `gone` in it */
  result: Eq
}

/** How to eliminate one unknown. Null when it appears in neither equation (there is nothing to eliminate). */
export function eliminationPlan(s: System, gone: Unknown): ElimPlan | null {
  const clear: [Rat, Rat] = [clearingMultiplier(s.e1), clearingMultiplier(s.e2)]
  const whole: System = { e1: scaleEq(s.e1, clear[0]), e2: scaleEq(s.e2, clear[1]) }
  const p = coef(whole.e1, gone)
  const q = coef(whole.e2, gone)
  if (isZero(p) && isZero(q)) return null
  let k1: Rat
  let k2: Rat
  let op: 'add' | 'sub'
  if (isZero(p)) {
    // already gone from the first equation: keep it, drop the second
    k1 = ONE
    k2 = ZERO
    op = 'add'
  } else if (isZero(q)) {
    k1 = ZERO
    k2 = ONE
    op = 'add'
  } else {
    const g = gcd(absR(p).n, absR(q).n)
    k1 = rat(absR(q).n / g, 1n)
    k2 = rat(absR(p).n / g, 1n)
    op = sign(p) === sign(q) ? 'sub' : 'add'
  }
  const s1 = scaleEq(whole.e1, k1)
  const s2 = scaleEq(whole.e2, k2)
  const result = op === 'add' ? addEq(s1, s2) : addEq(s1, scaleEq(s2, Q(-1)))
  return { gone, clear, whole, k1, k2, op, scaled: [s1, s2], result }
}

/** The unknown whose elimination needs the smallest multipliers, or null when neither can be eliminated. */
export function easiestToEliminate(s: System): Unknown | null {
  const cost = (v: Unknown): number => {
    const p = eliminationPlan(s, v)
    if (!p) return Infinity
    return Number(p.k1.n > p.k2.n ? p.k1.n : p.k2.n)
  }
  const cx = cost('x')
  const cy = cost('y')
  if (cx === Infinity && cy === Infinity) return null
  return cx <= cy ? 'x' : 'y'
}

export type Outcome =
  /** the remaining unknown has a value */
  | { kind: 'value'; value: Rat }
  /** 0 = 0: the equations agree everywhere along a line */
  | { kind: 'identity' }
  /** 0 = c with c ≠ 0 */
  | { kind: 'contradiction'; c: Rat }

/** What an equation with at most one unknown says about it. */
export function readOff(e: Eq, v: Unknown): Outcome {
  const k = coef(e, v)
  if (!isZero(k)) return { kind: 'value', value: ratDiv(e.c, k) }
  return isZero(e.c) ? { kind: 'identity' } : { kind: 'contradiction', c: e.c }
}

export interface ElimTrace {
  plan: ElimPlan
  /** the unknown left after the elimination, and what the equation says about it */
  left: Unknown
  outcome: Outcome
  /** for a single solution: which original equation (1 or 2) was used to go back, the equation with the found value put in, and the other unknown */
  back?: { eq: 1 | 2; value: Rat; other: Rat }
  solution: Solution
}

/** The whole elimination, as steps. The result always agrees with `solve`. */
export function solveByElimination(s: System, gone?: Unknown): ElimTrace | null {
  const pick = gone ?? easiestToEliminate(s)
  if (!pick) return null
  const plan = eliminationPlan(s, pick)
  if (!plan) return null
  const left: Unknown = pick === 'x' ? 'y' : 'x'
  const outcome = readOff(plan.result, left)
  if (outcome.kind === 'contradiction') return { plan, left, outcome, solution: { kind: 'none' } }
  if (outcome.kind === 'identity') return { plan, left, outcome, solution: solve(s) }
  // go back into whichever original equation still has `gone` in it
  const which: 1 | 2 = !isZero(coef(s.e1, pick)) ? 1 : 2
  const e = which === 1 ? s.e1 : s.e2
  const rest = ratSub(e.c, ratMul(coef(e, left), outcome.value))
  const found = ratDiv(rest, coef(e, pick))
  const sol: Solution = pick === 'x' ? { kind: 'unique', x: found, y: outcome.value } : { kind: 'unique', x: outcome.value, y: found }
  return { plan, left, outcome, back: { eq: which, value: outcome.value, other: found }, solution: sol }
}

/* -------------------------------------------------------------------- substitution */

export interface SubPlan {
  /** the equation (1 or 2) that is solved for one unknown, and which unknown */
  from: 1 | 2
  isolate: Unknown
  /** isolate = k0 + k1 · other */
  k0: Rat
  k1: Rat
  /** the other equation after the substitution: coefficient · other = rhs */
  other: Unknown
  result: { coef: Rat; rhs: Rat }
}

/** The easiest substitution: an unknown with coefficient 1 or −1 if there is one, else the smallest coefficient. Null when neither equation has an unknown. */
export function substitutionPlan(s: System): SubPlan | null {
  const options: { from: 1 | 2; v: Unknown; c: Rat }[] = []
  for (const from of [1, 2] as const) for (const v of ['x', 'y'] as const) options.push({ from, v, c: coef(from === 1 ? s.e1 : s.e2, v) })
  const usable = options.filter((o) => !isZero(o.c))
  if (!usable.length) return null
  // whole-number coefficient of size 1 first, then the smallest numerator over the largest denominator
  usable.sort((p, q) => ratCmp(absR(p.c), absR(q.c)) || (p.from - q.from) || (p.v < q.v ? -1 : 1))
  const unit = usable.find((o) => ratEq(absR(o.c), ONE))
  const o = unit ?? usable[0]
  const src = o.from === 1 ? s.e1 : s.e2
  const dst = o.from === 1 ? s.e2 : s.e1
  const other: Unknown = o.v === 'x' ? 'y' : 'x'
  // src: o.c · isolate + coef(src, other) · other = src.c  =>  isolate = src.c / o.c − (coef(src, other) / o.c) · other
  const k0 = ratDiv(src.c, o.c)
  const k1 = neg(ratDiv(coef(src, other), o.c))
  // dst: p · isolate + q · other = r with isolate = k0 + k1 · other  =>  (p·k1 + q) · other = r − p·k0
  const p = coef(dst, o.v)
  const q = coef(dst, other)
  return { from: o.from, isolate: o.v, k0, k1, other, result: { coef: ratAdd(ratMul(p, k1), q), rhs: ratSub(dst.c, ratMul(p, k0)) } }
}

export interface SubTrace {
  plan: SubPlan
  outcome: Outcome
  /** for a single solution: the value of the isolated unknown */
  isolated?: Rat
  solution: Solution
}

/** The whole substitution, as steps. The result always agrees with `solve`. */
export function solveBySubstitution(s: System): SubTrace | null {
  const plan = substitutionPlan(s)
  if (!plan) return null
  const { coef: k, rhs } = plan.result
  if (isZero(k)) {
    return isZero(rhs)
      ? { plan, outcome: { kind: 'identity' }, solution: solve(s) }
      : { plan, outcome: { kind: 'contradiction', c: rhs }, solution: { kind: 'none' } }
  }
  const value = ratDiv(rhs, k)
  const isolated = ratAdd(plan.k0, ratMul(plan.k1, value))
  const sol: Solution = plan.isolate === 'x' ? { kind: 'unique', x: isolated, y: value } : { kind: 'unique', x: value, y: isolated }
  return { plan, outcome: { kind: 'value', value }, isolated, solution: sol }
}

/* ---------------------------------------------------------------------- the text of it */

/** A fraction as TeX: a whole number, or minus-sign-first `\frac{n}{d}`. */
export function ratTex(r: Rat): string {
  if (r.d === 1n) return r.n.toString()
  return `${r.n < 0n ? '-' : ''}\\frac{${(r.n < 0n ? -r.n : r.n).toString()}}{${r.d.toString()}}`
}

/** A fraction as plain text with the true minus sign: 7/3, −2. */
export const ratPlain = (r: Rat): string => ratText(r).replace('-', '−')

function termPlain(k: Rat, v: string, first: boolean): string {
  const neg_ = k.n < 0n
  const mag = absR(k)
  const body = ratEq(mag, ONE) ? v : mag.d === 1n ? `${mag.n}${v}` : `(${mag.n}/${mag.d})${v}`
  return first ? (neg_ ? `−${body}` : body) : ` ${neg_ ? '−' : '+'} ${body}`
}

/** `2x + 3y = 7`, with true minus signs, no zero terms, and `0 = c` when no unknown is left. */
export function eqText(e: Eq): string {
  const parts: string[] = []
  if (!isZero(e.a)) parts.push(termPlain(e.a, 'x', parts.length === 0))
  if (!isZero(e.b)) parts.push(termPlain(e.b, 'y', parts.length === 0))
  return `${parts.length ? parts.join('') : '0'} = ${ratPlain(e.c)}`
}

function termTex(k: Rat, v: string, first: boolean): string {
  const mag = absR(k)
  const body = ratEq(mag, ONE) ? v : mag.d === 1n ? `${mag.n}${v}` : `\\frac{${mag.n}}{${mag.d}}${v}`
  return first ? (k.n < 0n ? `-${body}` : body) : ` ${k.n < 0n ? '-' : '+'} ${body}`
}

/** The same equation as TeX. */
export function eqTex(e: Eq): string {
  const parts: string[] = []
  if (!isZero(e.a)) parts.push(termTex(e.a, 'x', parts.length === 0))
  if (!isZero(e.b)) parts.push(termTex(e.b, 'y', parts.length === 0))
  return `${parts.length ? parts.join('') : '0'} = ${ratTex(e.c)}`
}

/* ------------------------------------------------------------------ reading what was typed */

export type ParseError = 'empty' | 'noequals' | 'syntax' | 'letters' | 'big'
export type Parsed = { ok: true; eq: Eq } | { ok: false; error: ParseError }

const MAX_DIGITS = 9

/** One side of an equation as three sums: the coefficient of x, of y, and the constant. */
function side(src: string): { x: Rat; y: Rat; k: Rat } | ParseError {
  if (src === '') return 'empty'
  let x = ZERO
  let y = ZERO
  let k = ZERO
  let i = 0
  const n = src.length
  const number = (): Rat | ParseError | null => {
    // 12, 1.5, 3/4, or any of them in parentheses
    const paren = src[i] === '('
    if (paren) i++
    const m = /^(\d+)(?:\.(\d+))?(?:\/(\d+))?/.exec(src.slice(i))
    if (!m) return paren ? 'syntax' : null
    i += m[0].length
    if (paren) {
      if (src[i] !== ')') return 'syntax'
      i++
    }
    if (m[1].length > MAX_DIGITS || (m[2]?.length ?? 0) > MAX_DIGITS || (m[3]?.length ?? 0) > MAX_DIGITS) return 'big'
    let r = rat(BigInt(m[1] + (m[2] ?? '')), 10n ** BigInt(m[2]?.length ?? 0))
    if (m[3] !== undefined) {
      if (BigInt(m[3]) === 0n) return 'syntax'
      r = ratDiv(r, Q(BigInt(m[3])))
    }
    return r
  }
  while (i < n) {
    let sgn = 1
    let sawSign = false
    while (src[i] === '+' || src[i] === '-') {
      if (src[i] === '-') sgn = -sgn
      i++
      sawSign = true
    }
    if (i >= n) return 'syntax'
    if (!sawSign && i > 0) return 'syntax' // two terms with no sign between them
    const num = number()
    if (typeof num === 'string') return num
    const v = src[i]
    let value = num ?? ONE
    if (v === 'x' || v === 'y') {
      i++
    } else if (/[a-z]/.test(v ?? '')) {
      return 'letters'
    } else if (num === null) {
      return 'syntax'
    }
    if (sgn < 0) value = neg(value)
    if (v === 'x') x = ratAdd(x, value)
    else if (v === 'y') y = ratAdd(y, value)
    else k = ratAdd(k, value)
  }
  return { x, y, k }
}

/** Reads an equation as a person types it: `2x + 3y = 7`, `x = 2y - 1`, `0.5x - y = 3/4`, `(1/2)x - y = 3`. The unknowns are x and y, either side may hold them, a
 *  coefficient is a whole number, a decimal or a fraction (a fraction with a letter needs parentheses), and brackets such as `2(x+y)` are not supported: expand first.
 *  Everything is read exactly, so `0.1x` is one tenth and not a double. */
export function parseEquation(text: string): Parsed {
  const t = text
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/,/g, '.')
    .replace(/[\s·*]/g, '')
  if (t === '') return { ok: false, error: 'empty' }
  const parts = t.split('=')
  if (parts.length !== 2) return { ok: false, error: 'noequals' }
  const l = side(parts[0])
  const r = side(parts[1])
  if (typeof l === 'string') return { ok: false, error: l }
  if (typeof r === 'string') return { ok: false, error: r }
  return { ok: true, eq: { a: ratSub(l.x, r.x), b: ratSub(l.y, r.y), c: ratSub(r.k, l.k) } }
}

/* ----------------------------------------------------------------------- the picture */

export type Pt = [number, number]

/** The part of the line a·x + b·y = c inside the window, as its two ends, or null when the line misses the window or is no line (a = b = 0). */
export function clip(e: Eq, xmin: number, xmax: number, ymin: number, ymax: number): [Pt, Pt] | null {
  const a = toNumber(e.a)
  const b = toNumber(e.b)
  const c = toNumber(e.c)
  if (a === 0 && b === 0) return null
  const pts: Pt[] = []
  const eps = 1e-9 * Math.max(1, Math.abs(xmax - xmin), Math.abs(ymax - ymin))
  const add = (x: number, y: number) => {
    if (x < xmin - eps || x > xmax + eps || y < ymin - eps || y > ymax + eps) return
    if (!pts.some((p) => Math.abs(p[0] - x) < eps && Math.abs(p[1] - y) < eps)) pts.push([x, y])
  }
  if (b !== 0) {
    add(xmin, (c - a * xmin) / b)
    add(xmax, (c - a * xmax) / b)
  }
  if (a !== 0) {
    add((c - b * ymin) / a, ymin)
    add((c - b * ymax) / a, ymax)
  }
  if (pts.length < 2) return null
  let best: [Pt, Pt] = [pts[0], pts[1]]
  let far = -1
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2
      if (d > far) {
        far = d
        best = [pts[i], pts[j]]
      }
    }
  return best
}

/* -------------------------------------------------------- double precision and conditioning */

export interface FloatSolution {
  D: number
  x: number
  y: number
}

/** Cramer's rule in double precision. D is exactly 0 only when the products are exactly equal, which for typed decimals they often are not. */
export function solveFloat(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): FloatSolution {
  const D = a1 * b2 - a2 * b1
  return { D, x: (c1 * b2 - c2 * b1) / D, y: (a1 * c2 - a2 * c1) / D }
}

/** The 1-norm condition number of the coefficient matrix, ‖A‖₁·‖A⁻¹‖₁: how many times a relative change in the numbers can be magnified in the answer. Infinity when D = 0. */
export function cond1(a1: number, b1: number, a2: number, b2: number): number {
  const D = a1 * b2 - a2 * b1
  if (D === 0) return Infinity
  const n1 = Math.max(Math.abs(a1) + Math.abs(a2), Math.abs(b1) + Math.abs(b2))
  const inv = Math.max(Math.abs(b2) + Math.abs(a2), Math.abs(b1) + Math.abs(a1)) / Math.abs(D)
  return n1 * inv
}

/** The acute angle, in degrees, between the line of slope −1 (x + y = 2) and a line of slope −m. */
function angleBetween(m: number): number {
  const d = Math.abs(Math.atan(m) - Math.PI / 4) * (180 / Math.PI)
  return d > 90 ? 180 - d : d
}

export interface NearParallel {
  /** the base system x + y = 2, x + (1 + eps)·y = 2 + delta, and its exact solution */
  eps: Rat
  delta: Rat
  exact: { x: Rat; y: Rat }
  /** the same system with delta = 0, where the solution is (2, 0) */
  base: { x: Rat; y: Rat }
  /** how far y moved from the base solution, and by how many times the change in the right-hand side */
  moved: Rat
  amplification: Rat
  /** the angle between the two lines in degrees */
  angle: number
}

/** Two lines that almost coincide: x + y = 2 and x + (1 + eps)y = 2 + delta. The solution is y = delta/eps, x = 2 − delta/eps, so a change delta in one right-hand side
 *  moves the intersection by about delta/eps along the line: the closer to parallel, the further a tiny change throws the answer. */
export function nearParallel(eps: Rat, delta: Rat): NearParallel | null {
  if (isZero(eps)) return null
  const s: System = { e1: { a: ONE, b: ONE, c: Q(2) }, e2: { a: ONE, b: ratAdd(ONE, eps), c: ratAdd(Q(2), delta) } }
  const sol = solve(s)
  if (sol.kind !== 'unique') return null
  const base = { x: Q(2), y: ZERO }
  // x and y both move by delta/eps, in opposite directions: keep that exact quantity, the size of the move along y
  const moved = absR(ratSub(sol.y, base.y))
  const e = toNumber(eps)
  return {
    eps,
    delta,
    exact: { x: sol.x, y: sol.y },
    base,
    moved,
    amplification: isZero(delta) ? ZERO : ratDiv(moved, absR(delta)),
    angle: angleBetween(1 / (1 + e)),
  }
}
