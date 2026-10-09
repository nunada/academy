/** Exact arithmetic for the "Exponents and Radicals" article's widgets.
 *
 *  Like `realnum.ts`, everything is BigInt and fractions, never floating point,
 *  because the widgets show that two ways of writing a number are *equal* — and a
 *  double would turn "equal" into "equal to 15 digits". The doubles that do appear
 *  are labelled as approximations and are only used to cross-check the exact
 *  answers in `tools/check-powers.mjs`. */

import { factorize, gcd, rat, type Rat } from './realnum'

/** `r` to the integer power `e`, exactly. Null where it is undefined: 0 to a
 *  negative power, and 0 to the power 0 (left undefined here, as in algebra,
 *  although programming languages define it as 1). */
export function ratPow(r: Rat, e: number): Rat | null {
  if (!Number.isInteger(e)) throw new RangeError('integer exponent expected')
  if (r.n === 0n && e <= 0) return null
  const k = BigInt(Math.abs(e))
  if (e >= 0) return rat(r.n ** k, r.d ** k)
  return rat(r.d ** k, r.n ** k)
}

export interface RootSimplified {
  /** The factor taken outside the radical. */
  out: bigint
  /** What is left under it: no prime in it appears `k` or more times. */
  inside: bigint
  /** Prime factorisation of the original number. */
  factors: [bigint, number][]
}

/** The k-th root of a positive integer in simplest form: `out · ᵏ√inside`.
 *  Each prime p appearing e times contributes p^⌊e/k⌋ outside and p^(e mod k)
 *  inside, which is exactly "take the groups of k out of the root". */
export function simplifyRoot(n: bigint, k: number): RootSimplified {
  if (n < 1n) throw new RangeError('positive integer expected')
  if (!Number.isInteger(k) || k < 2) throw new RangeError('index 2 or more')
  const factors = factorize(n)
  let out = 1n
  let inside = 1n
  for (const [p, e] of factors) {
    out *= p ** BigInt(Math.floor(e / k))
    inside *= p ** BigInt(e % k)
  }
  return { out, inside, factors }
}

/** `c·√t` with c and t integers: the value of an expression like 3√2, or 4 when t is 1. */
export interface Surd {
  coef: Rat
  /** The number under the root, square-free; 1 means the value is just `coef`. */
  rad: bigint
}

/** a / (s·√t) where s√t is √b simplified: the value as `coef·√rad`. */
export function rationaliseSimple(a: bigint, b: bigint): Surd {
  const { out, inside } = simplifyRoot(b, 2)
  // a / (out·√inside) = a·√inside / (out·inside)
  return { coef: rat(a, out * inside), rad: inside }
}

export interface Rationalised {
  /** a / (p + sign·√q) in the form `rational + irrational·√rad`, or just a
   *  rational when q is a perfect square. Null when the denominator is zero. */
  rational: Rat
  irrational: Rat
  rad: bigint
  /** p² − q, the denominator after multiplying by the conjugate. */
  denominator: bigint
}

/** a / (p + sign·√q) rationalised with the conjugate p − sign·√q. */
export function rationaliseConjugate(a: bigint, p: bigint, sign: 1 | -1, q: bigint): Rationalised | null {
  const { out: c, inside: t } = simplifyRoot(q, 2) // √q = c√t
  const sg = BigInt(sign)
  if (t === 1n) {
    // √q is the integer c, so this is plain division.
    const d = p + sg * c
    if (d === 0n) return null
    return { rational: rat(a, d), irrational: rat(0n, 1n), rad: 1n, denominator: d }
  }
  const D = p * p - q // never 0: q is not a perfect square, so q ≠ p²
  // a(p − sign·c√t) / D
  return { rational: rat(a * p, D), irrational: rat(-a * sg * c, D), rad: t, denominator: D }
}

/* ----------------------------------------------------- scientific notation */

export interface Sci {
  negative: boolean
  /** Digits of the mantissa, `4.5`: one non-zero digit, then the point and the rest. */
  mantissa: string
  exponent: number
}

/** A decimal such as `45000`, `0.00045` or `-123.45` as `a × 10^k` with 1 ≤ |a| < 10.
 *  Works on the digits, not on a double, so nothing is rounded. Null for zero or
 *  for something that is not a decimal. */
export function toScientific(input: string): Sci | null {
  const s = input.trim().replace(',', '.').replace(/\s+/g, '')
  const m = /^([+-]?)(\d*)\.?(\d*)$/.exec(s)
  if (!m || (!m[2] && !m[3])) return null
  const intPart = m[2] ?? ''
  const fracPart = m[3] ?? ''
  const all = intPart + fracPart
  const first = all.search(/[1-9]/)
  if (first < 0) return null
  const exponent = intPart.length - 1 - first
  const digits = all.slice(first).replace(/0+$/, '') || '0'
  return { negative: m[1] === '-', mantissa: digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits, exponent }
}

/** `a × 10^k` back to a plain decimal: the same digits, the point moved. */
export function fromScientific(mantissa: string, exponent: number): string | null {
  const s = mantissa.trim().replace(',', '.').replace(/\s+/g, '')
  const m = /^([+-]?)(\d*)\.?(\d*)$/.exec(s)
  if (!m || (!m[2] && !m[3]) || !Number.isInteger(exponent) || Math.abs(exponent) > 60) return null
  const intLen = (m[2] ?? '').length
  const digits = (m[2] ?? '') + (m[3] ?? '')
  const pos = intLen + exponent // where the point now falls in `digits`
  let out: string
  if (pos <= 0) out = '0.' + '0'.repeat(-pos) + digits
  else if (pos >= digits.length) out = digits + '0'.repeat(pos - digits.length)
  else out = digits.slice(0, pos) + '.' + digits.slice(pos)
  let [i, f = ''] = out.split('.')
  i = i.replace(/^0+(?=\d)/, '')
  f = f.replace(/0+$/, '')
  const res = f ? `${i}.${f}` : i
  return (m[1] === '-' && /[1-9]/.test(res) ? '-' : '') + res
}

/** gcd re-exported so callers that already import this module need only one. */
export { gcd }
