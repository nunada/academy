/** Exact fraction arithmetic behind the widgets of the Rational Numbers article.
 *
 *  It builds on `realnum.ts` (BigInt fractions in lowest terms, long division)
 *  and adds what a lesson on fractions needs on top: the fraction as *typed*
 *  (6/8 is not yet 3/4), the working of the four operations, mixed numbers, and
 *  the number theory that says when and how a decimal repeats. */

import { gcd, rat, ratAdd, ratCmp, type Rat } from './realnum'
import { lcm } from './integers'

export { gcd, rat, ratAdd, ratCmp, type Rat }

/** A fraction as typed: the sign is on the numerator, the denominator is
 *  positive, and nothing has been cancelled yet. */
export interface Frac {
  n: bigint
  d: bigint
}

/** Reads `a/b` or a whole number `a`. Spaces around the slash are fine, either part may carry a sign (`6/-8` is `-6/8`), and a
 *  zero denominator is reported separately because it deserves its own message. */
export function parseFrac(src: string, maxDigits = 15): Frac | 'zero' | null {
  const s = src.replace(/−/g, '-').replace(/\s+/g, '')
  const m = /^([+-]?\d+)(?:\/([+-]?\d+))?$/.exec(s)
  if (!m) return null
  const digits = (t: string) => t.replace(/^[+-]/, '').length
  if (digits(m[1]) > maxDigits || (m[2] !== undefined && digits(m[2]) > maxDigits)) return null
  let n = BigInt(m[1])
  let d = m[2] === undefined ? 1n : BigInt(m[2])
  if (d === 0n) return 'zero'
  if (d < 0n) {
    n = -n
    d = -d
  }
  return { n, d }
}

export const ratSub = (a: Rat, b: Rat): Rat => rat(a.n * b.d - b.n * a.d, a.d * b.d)
export const ratMul = (a: Rat, b: Rat): Rat => rat(a.n * b.n, a.d * b.d)
export function ratDiv(a: Rat, b: Rat): Rat {
  if (b.n === 0n) throw new Error('division by zero')
  return rat(a.n * b.d, a.d * b.n)
}

/** A rational number as a mixed number: |n/d| = whole + rem/d, with the sign
 *  kept separately, so that -7/2 is minus (3 and 1/2). */
export interface Mixed {
  negative: boolean
  whole: bigint
  rem: bigint
  d: bigint
}

export function mixed(r: Rat): Mixed {
  const negative = r.n < 0n
  const n = negative ? -r.n : r.n
  return { negative, whole: n / r.d, rem: n % r.d, d: r.d }
}

/** The common-denominator step of an addition or subtraction: both fractions
 *  rewritten over the least common multiple of their denominators. */
export function overCommon(a: Frac, c: Frac): { l: bigint; na: bigint; nc: bigint; fa: bigint; fc: bigint } {
  const l = lcm(a.d, c.d)
  const fa = l / a.d
  const fc = l / c.d
  return { l, na: a.n * fa, nc: c.n * fc, fa, fc }
}

/** When does the decimal of n/d end, and when it does not, how does it repeat?
 *
 *  In lowest terms, write d = 2^x · 5^y · q with q coprime to 10. The decimal
 *  ends exactly when q = 1. Otherwise the digits before the repeat number
 *  max(x, y), and the repeating block is as long as the multiplicative order of
 *  10 modulo q, the least k with 10^k ≡ 1 (mod q). */
export interface TermInfo {
  twos: number
  fives: number
  rest: bigint
  terminates: boolean
  /** Digits after the point before the repeating block (or all of them, when the decimal ends). */
  pre: number
  /** Length of the repeating block; 0 when the decimal ends; null if it is too long to find here. */
  period: number | null
}

export function termInfo(r: Rat, searchLimit = 5_000_000): TermInfo {
  let q = r.d
  let twos = 0
  let fives = 0
  while (q % 2n === 0n) {
    q /= 2n
    twos++
  }
  while (q % 5n === 0n) {
    q /= 5n
    fives++
  }
  const pre = Math.max(twos, fives)
  if (q === 1n) return { twos, fives, rest: q, terminates: true, pre, period: 0 }
  let power = 10n % q
  let k = 1
  while (power !== 1n && k <= searchLimit) {
    power = (power * 10n) % q
    k++
  }
  return { twos, fives, rest: q, terminates: false, pre, period: power === 1n ? k : null }
}

/** n/d rounded to `places` decimal places, half away from zero, as a string. */
export function roundedDecimal(r: Rat, places: number): string {
  const neg = r.n < 0n
  const n = neg ? -r.n : r.n
  const scale = 10n ** BigInt(places)
  const v = (n * scale * 2n + r.d) / (r.d * 2n)
  const whole = v / scale
  const frac = (v % scale).toString().padStart(places, '0')
  return `${neg && (whole !== 0n || /[1-9]/.test(frac)) ? '-' : ''}${whole}${places ? '.' + frac : ''}`
}
