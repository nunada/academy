/** Exact arithmetic behind the widgets of the Geometric Sequences and Series
 *  article: terms, finite and infinite sums, recognising a geometric sequence,
 *  and finding the ratio from two terms, which needs the k-th root of a
 *  fraction. Everything is a fraction of BigInts, so 3 * (1/2)^40 and the sum
 *  1 + 2 + 4 + ... + 2^63 are exact. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { iroot } from './irrational'

export { rat, type Rat }

const R = (n: bigint | number): Rat => rat(BigInt(n), 1n)
const ONE = R(1)
const isZero = (r: Rat): boolean => r.n === 0n
const same = (a: Rat, b: Rat): boolean => a.n === b.n && a.d === b.d
const abs = (r: Rat): Rat => (r.n < 0n ? rat(-r.n, r.d) : r)

/** r to a whole-number power (negative powers need r != 0), by repeated squaring. */
export function ratPow(r: Rat, k: bigint): Rat {
  if (k < 0n) {
    if (isZero(r)) throw new Error('zero to a negative power')
    return ratPow(rat(r.d, r.n), -k)
  }
  let result = ONE
  let base = r
  let e = k
  while (e > 0n) {
    if (e & 1n) result = ratMul(result, base)
    base = ratMul(base, base)
    e >>= 1n
  }
  return result
}

/** The n-th term: a_n = a_1 r^(n-1). */
export const nthTerm = (a1: Rat, r: Rat, n: bigint): Rat => ratMul(a1, ratPow(r, n - 1n))

/** The first `count` terms. */
export function terms(a1: Rat, r: Rat, count: number): Rat[] {
  const out: Rat[] = []
  let t = a1
  for (let i = 0; i < count; i++) {
    out.push(t)
    t = ratMul(t, r)
  }
  return out
}

/** The sum of the first n terms: n a_1 when r = 1, otherwise a_1 (1 - r^n) / (1 - r). */
export function partialSum(a1: Rat, r: Rat, n: bigint): Rat {
  if (same(r, ONE)) return ratMul(R(n), a1)
  return ratDiv(ratMul(a1, ratSub(ONE, ratPow(r, n))), ratSub(ONE, r))
}

/** The partial sums S_1 ... S_count. */
export function partialSums(a1: Rat, r: Rat, count: number): Rat[] {
  const out: Rat[] = []
  let total = R(0)
  for (const t of terms(a1, r, count)) {
    total = ratAdd(total, t)
    out.push(total)
  }
  return out
}

/** An infinite series converges exactly when |r| < 1 (or every term is 0). */
export const converges = (a1: Rat, r: Rat): boolean => isZero(a1) || abs(r).n < abs(r).d

/** The sum of the infinite series when it converges: a_1 / (1 - r). Null when it diverges. */
export function infiniteSum(a1: Rat, r: Rat): Rat | null {
  if (isZero(a1)) return R(0)
  if (!converges(a1, r)) return null
  return ratDiv(a1, ratSub(ONE, r))
}

export interface GeoAnalysis {
  ratios: Rat[]
  /** True when every term is non-zero and every ratio of neighbours is the same. */
  geometric: boolean
  r: Rat | null
  /** Index (0-based, into `ratios`) of the first ratio that differs from the first one. */
  firstBreak: number | null
  hasZero: boolean
}

/** Is the list a geometric sequence, and if not, where does it stop being one? */
export function analyse(values: Rat[]): GeoAnalysis {
  const hasZero = values.some(isZero)
  if (hasZero || values.length < 2) return { ratios: [], geometric: false, r: null, firstBreak: null, hasZero }
  const ratios: Rat[] = []
  for (let i = 1; i < values.length; i++) ratios.push(ratDiv(values[i], values[i - 1]))
  let firstBreak: number | null = null
  for (let i = 1; i < ratios.length; i++) {
    if (!same(ratios[i], ratios[0])) {
      firstBreak = i
      break
    }
  }
  const geometric = firstBreak === null
  return { ratios, geometric, r: geometric ? ratios[0] : null, firstBreak, hasZero }
}

/** The rational numbers x with x^k = rho, k >= 2: none, one or two of them, or "irrational"
 *  when the real roots exist but are not fractions. */
export type RootResult = { kind: 'exact'; roots: Rat[] } | { kind: 'irrational'; k: number; rho: Rat } | { kind: 'none' }

export function rationalRoots(rho: Rat, k: number): RootResult {
  if (isZero(rho)) return { kind: 'exact', roots: [R(0)] }
  const negative = rho.n < 0n
  if (negative && k % 2 === 0) return { kind: 'none' }
  const n = negative ? -rho.n : rho.n
  const rn = iroot(n, k)
  const rd = iroot(rho.d, k)
  const K = BigInt(k)
  if (rn ** K !== n || rd ** K !== rho.d) return { kind: 'irrational', k, rho }
  const pos = rat(rn, rd)
  if (k % 2 === 0) return { kind: 'exact', roots: [pos, rat(-pos.n, pos.d)] }
  return { kind: 'exact', roots: [negative ? rat(-pos.n, pos.d) : pos] }
}

/** The ratio(s) of a geometric sequence with term p equal to x and term q equal to y
 *  (positions different, terms non-zero): r^(q-p) = y/x. */
export function ratioFromTwoTerms(p: bigint, x: Rat, q: bigint, y: Rat): RootResult | null {
  if (p === q || isZero(x) || isZero(y)) return null
  // Order the positions so that the exponent is positive.
  const [lo, hi, a, b] = p < q ? [p, q, x, y] : [q, p, y, x]
  const k = hi - lo
  if (k > 64n) return null
  return rationalRoots(ratDiv(b, a), Number(k))
}

/** The first term when term p equals x and the ratio is r. */
export const firstTerm = (p: bigint, x: Rat, r: Rat): Rat => ratDiv(x, ratPow(r, p - 1n))

/** k geometric means between a and b (the k numbers that make a, ..., b geometric),
 *  one list for each rational ratio r with r^(k+1) = b/a. */
export function means(a: Rat, b: Rat, k: number): Rat[][] | null {
  if (isZero(a) || isZero(b)) return null
  const res = rationalRoots(ratDiv(b, a), k + 1)
  if (res.kind !== 'exact') return null
  return res.roots.map((r) => terms(ratMul(a, r), r, k))
}
