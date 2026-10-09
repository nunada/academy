/** Exact arithmetic behind the interactive widgets in the Real Numbers article.
 *
 *  Everything here uses BigInt, not floating point, because the point of the
 *  widgets is to show what exact numbers do — a decimal expansion that repeats,
 *  a midpoint that is exactly a fraction — and a double would quietly round the
 *  very thing being shown. */

export const gcd = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}

export interface Rat {
  n: bigint
  /** Always positive. */
  d: bigint
}

export function rat(n: bigint, d: bigint): Rat {
  if (d === 0n) throw new Error('zero denominator')
  if (d < 0n) {
    n = -n
    d = -d
  }
  const g = gcd(n, d) || 1n
  return { n: n / g, d: d / g }
}

export const ratAdd = (a: Rat, b: Rat): Rat => rat(a.n * b.d + b.n * a.d, a.d * b.d)
export const ratHalf = (a: Rat): Rat => rat(a.n, a.d * 2n)
export const ratMid = (a: Rat, b: Rat): Rat => ratHalf(ratAdd(a, b))
export const ratCmp = (a: Rat, b: Rat): number => {
  const l = a.n * b.d
  const r = b.n * a.d
  return l < r ? -1 : l > r ? 1 : 0
}
export const ratText = (a: Rat): string => (a.d === 1n ? a.n.toString() : `${a.n}/${a.d}`)

/** `3`, `-2/5`, `0.25`, `1,5`, `.5`: the forms a person types. Null for anything
 *  else, including a zero denominator. */
export function parseRational(input: string): Rat | null {
  const s = input.trim().replace(',', '.').replace(/\s+/g, '')
  let m = /^([+-]?)(\d+)\/(\d+)$/.exec(s)
  if (m) {
    const d = BigInt(m[3])
    if (d === 0n) return null
    return rat(BigInt(m[1] === '-' ? '-' + m[2] : m[2]), d)
  }
  m = /^([+-]?)(\d*)\.?(\d*)$/.exec(s)
  if (m && (m[2] || m[3])) {
    const frac = m[3] ?? ''
    const digits = (m[2] ?? '') + frac
    const n = BigInt(digits || '0')
    return rat(m[1] === '-' ? -n : n, 10n ** BigInt(frac.length))
  }
  return null
}

/** Prime factors of a positive integer, as [prime, exponent] pairs. */
export function factorize(n: bigint): [bigint, number][] {
  const out: [bigint, number][] = []
  let p = 2n
  while (p * p <= n) {
    let e = 0
    while (n % p === 0n) {
      n /= p
      e++
    }
    if (e) out.push([p, e])
    p += p === 2n ? 1n : 2n
  }
  if (n > 1n) out.push([n, 1])
  return out
}

export interface Expansion {
  negative: boolean
  /** Digits before the decimal point. */
  whole: string
  /** Decimal digits before the repeating block begins. */
  pre: string
  /** The repeating block, or '' when the decimal ends. */
  rep: string
  /** True when the decimal ends. */
  terminating: boolean
  /** True when the search for a repeat stopped at `limit` digits. */
  truncated: boolean
  reduced: Rat
  /** Prime factorisation of the reduced denominator. */
  primes: [bigint, number][]
}

/** Long division, remembering each remainder: the first time one comes back, the
 *  digits from there on repeat for ever. A fraction with denominator d has at
 *  most d - 1 distinct non-zero remainders, so a block never exceeds d - 1 long. */
export function expand(num: bigint, den: bigint, limit = 400): Expansion {
  const reduced = rat(num, den)
  const negative = reduced.n < 0n
  const n = negative ? -reduced.n : reduced.n
  const d = reduced.d
  const whole = (n / d).toString()
  let r = n % d
  const digits: string[] = []
  const seen = new Map<string, number>()
  let cycleAt = -1
  while (r !== 0n && digits.length < limit) {
    const key = r.toString()
    if (seen.has(key)) {
      cycleAt = seen.get(key)!
      break
    }
    seen.set(key, digits.length)
    r *= 10n
    digits.push((r / d).toString())
    r %= d
  }
  const truncated = r !== 0n && cycleAt < 0
  const all = digits.join('')
  return {
    negative,
    whole,
    pre: cycleAt < 0 ? all : all.slice(0, cycleAt),
    rep: cycleAt < 0 ? '' : all.slice(cycleAt),
    terminating: r === 0n,
    truncated,
    reduced,
    primes: factorize(d),
  }
}

/** The fraction a repeating decimal equals — `whole.pre(rep)` — and the working
 *  that finds it. With `k` digits in `pre` and `m` in `rep`:
 *
 *    x = (digits of whole+pre+rep  −  digits of whole+pre) / (10^k · (10^m − 1))
 *
 *  Multiply by 10^(k+m) and by 10^k and subtract: the repeating tails cancel. */
export function fromRepeating(whole: string, pre: string, rep: string): { value: Rat; k: number; m: number; hi: bigint; lo: bigint } {
  const k = pre.length
  const m = rep.length
  const lo = BigInt((whole + pre) || '0')
  if (m === 0) return { value: rat(lo, 10n ** BigInt(k)), k, m, hi: lo, lo }
  const hi = BigInt((whole + pre + rep) || '0')
  return { value: rat(hi - lo, 10n ** BigInt(k) * (10n ** BigInt(m) - 1n)), k, m, hi, lo }
}

/** floor(sqrt(n)) for a BigInt. */
export function isqrt(n: bigint): bigint {
  if (n < 2n) return n
  let x = BigInt(Math.floor(Math.sqrt(Number(n))))
  // Newton's method from a double's estimate; a few steps settle it exactly.
  for (;;) {
    const y = (x + n / x) >> 1n
    if (y === x || y === x + 1n || y === x - 1n) {
      x = y
      break
    }
    x = y
  }
  while (x * x > n) x--
  while ((x + 1n) * (x + 1n) <= n) x++
  return x
}

/** √2 truncated to `k` decimals, as a digit string without the point: k = 3 gives "1414". */
export const sqrt2Digits = (k: number): string => isqrt(2n * 10n ** BigInt(2 * k)).toString()
