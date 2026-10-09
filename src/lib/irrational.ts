/** Exact arithmetic behind the widgets of the Irrational Numbers article.
 *
 *  Three things are done here, all in BigInt so that nothing is rounded behind
 *  the reader's back:
 *   - integer k-th roots and the rule for when a root of an integer is rational;
 *   - arithmetic in the numbers a + b√m with rational a and b, which is where
 *     "the sum of two irrationals" can be examined exactly;
 *   - many digits of π, e, √2 and the golden ratio, and the continued fractions
 *     that give their best rational approximations. */

import { factorize, isqrt, rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'

/* --------------------------------------------------------------------- roots */

/** The largest integer r with r^k <= n, by Newton's method from above. */
export function iroot(n: bigint, k: number): bigint {
  if (n < 0n) throw new Error('negative radicand')
  if (n < 2n || k === 1) return n
  const K = BigInt(k)
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / k))
  for (;;) {
    const y = ((K - 1n) * x + n / x ** (K - 1n)) / K
    if (y >= x) return x
    x = y
  }
}

/** The numbers the widget factorises: trial division to the square root is at
 *  most a million steps. */
export const ROOT_LIMIT = 10n ** 12n

export interface RootClass {
  primes: [bigint, number][]
  /** What comes out of the k-th root: n^(1/k) = outside * (inside)^(1/k). */
  outside: bigint
  inside: bigint
  /** True exactly when the k-th root of n is an integer; otherwise it is irrational. */
  rational: boolean
}

/** Whether the k-th root of a positive integer is an integer or irrational (it
 *  is never anything else), read from the prime factorisation: the root is an
 *  integer exactly when every exponent is a multiple of k. */
export function rootClass(n: bigint, k: number): RootClass {
  if (n < 1n) throw new Error('positive integers only')
  const primes = factorize(n)
  let outside = 1n
  let inside = 1n
  for (const [p, e] of primes) {
    outside *= p ** BigInt(Math.floor(e / k))
    inside *= p ** BigInt(e % k)
  }
  return { primes, outside, inside, rational: inside === 1n }
}

/** The digits of n^(1/k), truncated to `places` decimal places. */
export function rootDigits(n: bigint, k: number, places: number): string {
  const v = iroot(n * 10n ** BigInt(k * places), k).toString().padStart(places + 1, '0')
  return places ? `${v.slice(0, v.length - places)}.${v.slice(v.length - places)}` : v
}

/* ------------------------------------------------------------- a + b√m numbers */

/** a + b√m with m squarefree and greater than 1, or a plain rational (m = 1,
 *  b = 0). Because √m is irrational, a + b√m is rational exactly when b = 0. */
export interface Surd {
  m: bigint
  a: Rat
  b: Rat
}

/** The squarefree part of a positive integer: n = k² · m with m squarefree. */
export function squareFreeParts(n: bigint): { k: bigint; m: bigint } {
  let k = 1n
  let m = 1n
  for (const [p, e] of factorize(n)) {
    k *= p ** BigInt(Math.floor(e / 2))
    if (e % 2) m *= p
  }
  return { k, m }
}

/** a + b√radicand, brought to the squarefree form: 3 + 2√8 is 3 + 4√2. */
export function makeSurd(radicand: bigint, a: Rat, b: Rat): Surd {
  const { k, m } = squareFreeParts(radicand)
  if (m === 1n) return { m: 1n, a: ratAdd(a, ratMul(b, rat(k, 1n))), b: rat(0n, 1n) }
  const bb = ratMul(b, rat(k, 1n))
  return norm({ m, a, b: bb })
}

const zero = rat(0n, 1n)
const norm = (s: Surd): Surd => (s.b.n === 0n ? { m: 1n, a: s.a, b: zero } : s)

function same(x: Surd, y: Surd): bigint {
  if (x.m === 1n) return y.m
  if (y.m === 1n || x.m === y.m) return x.m
  throw new Error('different square roots')
}

export const surdAdd = (x: Surd, y: Surd): Surd => norm({ m: same(x, y), a: ratAdd(x.a, y.a), b: ratAdd(x.b, y.b) })
export const surdSub = (x: Surd, y: Surd): Surd => norm({ m: same(x, y), a: ratSub(x.a, y.a), b: ratSub(x.b, y.b) })
export function surdMul(x: Surd, y: Surd): Surd {
  const m = same(x, y)
  // (a + b√m)(c + d√m) = (ac + bdm) + (ad + bc)√m
  return norm({ m, a: ratAdd(ratMul(x.a, y.a), ratMul(ratMul(x.b, y.b), rat(m, 1n))), b: ratAdd(ratMul(x.a, y.b), ratMul(x.b, y.a)) })
}
export function surdDiv(x: Surd, y: Surd): Surd {
  if (y.a.n === 0n && y.b.n === 0n) throw new Error('division by zero')
  const m = same(x, y)
  // Multiply top and bottom by the conjugate c − d√m: the bottom becomes c² − d²m, a rational.
  const conj: Surd = { m, a: y.a, b: ratSub(zero, y.b) }
  const top = surdMul(x, conj)
  const bottom = ratSub(ratMul(y.a, y.a), ratMul(ratMul(y.b, y.b), rat(m, 1n)))
  return norm({ m: top.m === 1n ? 1n : m, a: ratDiv(top.a, bottom), b: ratDiv(top.b, bottom) })
}
export const surdIsRational = (s: Surd): boolean => s.b.n === 0n

/** a + b√m to `places` decimal places, from an integer square root with guard digits. */
export function surdApprox(s: Surd, places: number): string {
  const guard = 6
  const S = 10n ** BigInt(places + guard)
  const sq = s.b.n === 0n ? 0n : isqrt(s.m * S * S)
  const total = (s.a.n * S) / s.a.d + (s.b.n * sq) / s.b.d
  const neg = total < 0n
  const t = neg ? -total : total
  const G = 10n ** BigInt(guard)
  const v = ((t * 2n + G) / (2n * G)).toString().padStart(places + 1, '0')
  const text = places ? `${v.slice(0, v.length - places)}.${v.slice(v.length - places)}` : v
  return neg && /[1-9]/.test(text) ? `-${text}` : text
}

/* --------------------------------------------- digits and continued fractions */

export type Constant = 'pi' | 'e' | 'sqrt2' | 'phi'

/** floor(x · 10^places) for π, e, √2 or the golden ratio (to within 1 in the
 *  last place), by Machin's formula, the factorial series, or integer roots. */
export function constantScaled(name: Constant, places: number): bigint {
  const guard = 12
  const S = 10n ** BigInt(places + guard)
  const G = 10n ** BigInt(guard)
  let v: bigint
  if (name === 'sqrt2') v = isqrt(2n * S * S)
  else if (name === 'phi') v = (S + isqrt(5n * S * S)) / 2n
  else if (name === 'e') {
    v = 0n
    let term = S
    for (let k = 1n; term > 0n; k++) {
      v += term
      term /= k
    }
  } else {
    // π = 16 arctan(1/5) − 4 arctan(1/239)
    const arctanInv = (x: bigint): bigint => {
      const x2 = x * x
      let power = S / x
      let sum = power
      let sign = -1n
      for (let k = 3n; power > 0n; k += 2n) {
        power /= x2
        sum += (sign * power) / k
        sign = -sign
      }
      return sum
    }
    v = 16n * arctanInv(5n) - 4n * arctanInv(239n)
  }
  return v / G
}

/** The decimal digits of a constant, `places` after the point, truncated. */
export function constantDigits(name: Constant, places: number): string {
  const v = constantScaled(name, places).toString().padStart(places + 1, '0')
  return `${v.slice(0, v.length - places)}.${v.slice(v.length - places)}`
}

export interface Convergent {
  /** The partial quotient a_k of [a0; a1, a2, ...]. */
  quotient: bigint
  p: bigint
  q: bigint
}

/** The first `terms` partial quotients and convergents of the continued fraction
 *  of a positive rational x. For x a long decimal approximation of a constant,
 *  the early ones are the constant's own, as long as q² stays far below the
 *  precision. */
export function continuedFraction(x: Rat, terms: number): Convergent[] {
  const out: Convergent[] = []
  let n = x.n
  let d = x.d
  let p0 = 1n
  let q0 = 0n
  let p1 = 0n
  let q1 = 1n
  for (let i = 0; i < terms && d !== 0n; i++) {
    const a = n / d
    const p = a * p0 + p1
    const q = a * q0 + q1
    out.push({ quotient: a, p, q })
    ;[p1, q1, p0, q0] = [p0, q0, p, q]
    ;[n, d] = [d, n - a * d]
  }
  return out
}

/** |r| in scientific notation: `digits` significant digits and the exponent of ten. */
export function sci(r: Rat, digits = 3): { mantissa: string; exp: number } {
  const n = r.n < 0n ? -r.n : r.n
  if (n === 0n) return { mantissa: '0', exp: 0 }
  const est = n.toString().length - r.d.toString().length
  for (let e = est - 1; e <= est + 1; e++) {
    const shift = digits - 1 - e
    const num = shift >= 0 ? n * 10n ** BigInt(shift) : n
    const den = shift >= 0 ? r.d : r.d * 10n ** BigInt(-shift)
    const lo = 10n ** BigInt(digits - 1)
    const hi = 10n ** BigInt(digits)
    const floor = num / den
    if (floor < lo || floor >= hi) continue
    let v = (2n * num + den) / (2n * den)
    let exp = e
    if (v >= hi) {
      v /= 10n
      exp++
    }
    const s = v.toString()
    return { mantissa: digits > 1 ? `${s[0]}.${s.slice(1)}` : s, exp }
  }
  throw new Error('sci: exponent not found')
}
