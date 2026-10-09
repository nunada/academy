/** Exact integer arithmetic behind the widgets of the Integers article.
 *
 *  Everything is BigInt. The point of the widgets is to show what the integers
 *  do, including the places where programming languages disagree about them
 *  (what -7 divided by 3 leaves over), and a double would round the very
 *  numbers being shown once they pass 2^53. */

import { factorize, gcd } from './realnum'

export { factorize, gcd }

const abs = (n: bigint): bigint => (n < 0n ? -n : n)

/** Reads an integer typed by a person: optional sign (a plain minus, a real
 *  minus sign or a plus), then digits. Spaces and thousands separators are
 *  ignored when they sit between digit groups, so "1.000.000" and "1 000"
 *  are read as typed. Returns null for anything else, and for more than
 *  `maxDigits` digits (a guard against pasting something enormous). */
export function parseInteger(src: string, maxDigits = 30): bigint | null {
  const s = src.replace(/−/g, '-').trim()
  const m = /^([+-]?)(\d{1,3}(?:[ .,]\d{3})+|\d+)$/.exec(s)
  if (!m) return null
  const digits = m[2].replace(/[ .,]/g, '')
  if (digits.length > maxDigits) return null
  const n = BigInt(digits)
  return m[1] === '-' ? -n : n
}

/* ------------------------------------------------------------------ division */

/** Quotient and remainder under the three conventions in use.
 *
 *  - `euclid`: the remainder is never negative, 0 <= r < |b|. This is the
 *    division algorithm of mathematics.
 *  - `floor`: the quotient is rounded down and the remainder takes the sign of
 *    the divisor. Python's // and %.
 *  - `trunc`: the quotient is rounded toward zero and the remainder takes the
 *    sign of the dividend. JavaScript's % and BigInt /, and C, C++ and Java. */
export interface DivMod {
  q: bigint
  r: bigint
}

export function divmods(a: bigint, b: bigint): { euclid: DivMod; floor: DivMod; trunc: DivMod } {
  if (b === 0n) throw new Error('division by zero')
  const trunc = { q: a / b, r: a % b }
  let fq = trunc.q
  let fr = trunc.r
  if (fr !== 0n && fr < 0n !== b < 0n) {
    fq -= 1n
    fr += b
  }
  const m = abs(b)
  let er = a % m
  if (er < 0n) er += m
  return { euclid: { q: (a - er) / b, r: er }, floor: { q: fq, r: fr }, trunc }
}

export const lcm = (a: bigint, b: bigint): bigint => (a === 0n || b === 0n ? 0n : abs((a / gcd(a, b)) * b))

/** The rows of Euclid's algorithm for two positive integers: each row is
 *  a = q*b + r, and the last non-zero remainder (the last b) is the gcd. */
export interface EuclidRow {
  a: bigint
  b: bigint
  q: bigint
  r: bigint
}

export function euclidRows(a: bigint, b: bigint): EuclidRow[] {
  if (a <= 0n || b <= 0n) throw new Error('positive integers only')
  const rows: EuclidRow[] = []
  while (b !== 0n) {
    const q = a / b
    const r = a % b
    rows.push({ a, b, q, r })
    ;[a, b] = [b, r]
  }
  return rows
}

/* ------------------------------------------------------------- factors, primes */

/** The largest number the widgets factorise: trial division up to its square
 *  root is at most a million steps, which is instant. */
export const FACTOR_LIMIT = 10n ** 12n

export const isPrime = (n: bigint): boolean => {
  if (n < 2n) return false
  const f = factorize(n)
  return f.length === 1 && f[0][1] === 1
}

/** Every positive divisor of n, ascending, from its prime factorisation. */
export function divisorsOf(n: bigint): bigint[] {
  let ds: bigint[] = [1n]
  for (const [p, e] of factorize(n)) {
    const next: bigint[] = []
    for (const d of ds) {
      let pk = 1n
      for (let k = 0; k <= e; k++) {
        next.push(d * pk)
        pk *= p
      }
    }
    ds = next
  }
  return ds.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))
}

/** The ladder of repeated divisions that finds the prime factorisation:
 *  [prime, n before dividing, n after]. */
export function divisionLadder(n: bigint): { p: bigint; from: bigint; to: bigint }[] {
  const out: { p: bigint; from: bigint; to: bigint }[] = []
  for (const [p, e] of factorize(n)) {
    for (let k = 0; k < e; k++) {
      out.push({ p, from: n, to: n / p })
      n /= p
    }
  }
  return out
}

/* ---------------------------------------------------------------- divisibility */

export type RuleKind = 'lastDigit' | 'digitSum' | 'lastTwo' | 'lastThree' | 'both' | 'alternating'

export interface DivRule {
  k: number
  kind: RuleKind
  /** What the rule looks at: the last digits as a number, or a sum. */
  value: bigint
  /** The verdict by the rule. It never uses `%` on the whole number, so that
   *  agreeing with `%` is a real check of the rule. */
  holds: boolean
  /** For `both` (6 = 2 and 3), the two verdicts it combines. */
  parts?: [boolean, boolean]
}

const digitsOf = (n: bigint): number[] => abs(n).toString().split('').map(Number)

/** The classic tests for 2, 3, 4, 5, 6, 8, 9, 10 and 11, applied to |n|. */
export function divisibilityRules(n: bigint): DivRule[] {
  const d = digitsOf(n)
  const sum = d.reduce((s, x) => s + x, 0)
  const alt = d.reduceRight((s, x, i) => s + (((d.length - 1 - i) % 2 === 0 ? 1 : -1) * x), 0)
  const last = (k: number): bigint => BigInt(d.slice(-k).join('') || '0')
  const small = (v: bigint, m: bigint): boolean => v % m === 0n // only ever on short values
  const by2 = d[d.length - 1] % 2 === 0
  const by3 = sum % 3 === 0
  return [
    { k: 2, kind: 'lastDigit', value: BigInt(d[d.length - 1]), holds: by2 },
    { k: 3, kind: 'digitSum', value: BigInt(sum), holds: by3 },
    { k: 4, kind: 'lastTwo', value: last(2), holds: small(last(2), 4n) },
    { k: 5, kind: 'lastDigit', value: BigInt(d[d.length - 1]), holds: d[d.length - 1] === 0 || d[d.length - 1] === 5 },
    { k: 6, kind: 'both', value: 0n, holds: by2 && by3, parts: [by2, by3] },
    { k: 8, kind: 'lastThree', value: last(3), holds: small(last(3), 8n) },
    { k: 9, kind: 'digitSum', value: BigInt(sum), holds: sum % 9 === 0 },
    { k: 10, kind: 'lastDigit', value: BigInt(d[d.length - 1]), holds: d[d.length - 1] === 0 },
    { k: 11, kind: 'alternating', value: BigInt(alt), holds: alt % 11 === 0 },
  ]
}

export const digitSum = (n: bigint): number => digitsOf(n).reduce((s, x) => s + x, 0)
/** Digits from the right with alternating signs: 1 for the units digit, -1 for the tens, ... */
export const alternatingSum = (n: bigint): number => digitsOf(n).reduceRight((s, x, i) => s + (((digitsOf(n).length - 1 - i) % 2 === 0 ? 1 : -1) * x), 0)
