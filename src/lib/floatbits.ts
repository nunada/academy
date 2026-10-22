/** Floating-point numbers: the numbers behind the "Floating-Point Numbers" article's widgets.
 *
 *  A binary floating-point format has one sign bit, `exp` exponent bits and `man` bits of fraction. The value of a pattern is
 *    exponent field 0:            ±0 (fraction 0) or a subnormal  ± fraction × 2^(1 − bias − man)
 *    exponent field 1 … max − 1:  a normal number  ± (2^man + fraction) × 2^(field − bias − man)
 *    exponent field max:          ±∞ (fraction 0) or NaN
 *  with bias = 2^(exp − 1) − 1. This module encodes a number into any such format with round-to-nearest-even, decodes patterns,
 *  finds neighbours and spacing, writes a double as an exact decimal, and adds numbers naively, with Kahan's compensation and
 *  exactly.
 *
 *  The checker (tools/check-floatbits.mjs) tests it against the machine: DataView for the bits of a double, Math.fround for
 *  single precision, Python's struct for half precision (the values are written into the checker), Python's Decimal for exact
 *  decimals, and plain loops for the sums. */

export interface Fmt {
  name: string
  exp: number
  man: number
}

export const FMTS = {
  half: { name: 'half', exp: 5, man: 10 },
  bfloat16: { name: 'bfloat16', exp: 8, man: 7 },
  single: { name: 'single', exp: 8, man: 23 },
  double: { name: 'double', exp: 11, man: 52 },
} as const satisfies Record<string, Fmt>

export type Kind = 'normal' | 'subnormal' | 'zero' | 'inf' | 'nan'

export interface Fields {
  sign: 0 | 1
  /** the biased exponent field */
  exp: number
  /** the fraction field */
  man: number
  kind: Kind
}

export const bias = (f: Fmt): number => 2 ** (f.exp - 1) - 1
export const emax = (f: Fmt): number => bias(f)
export const emin = (f: Fmt): number => 1 - bias(f)

/** 2^k exactly, for k from −1074 to 1023, built from its bits (Math.pow is not promised to be exact). */
export function pow2(k: number): number {
  const dv = new DataView(new ArrayBuffer(8))
  if (k >= -1022) dv.setBigUint64(0, BigInt(k + 1023) << 52n)
  else dv.setBigUint64(0, 1n << BigInt(k + 1074))
  return dv.getFloat64(0)
}

/** The exponent e with 2^e ≤ a < 2^(e+1) for a finite a > 0. */
function exponentOf(a: number): number {
  const dv = new DataView(new ArrayBuffer(8))
  dv.setFloat64(0, a)
  const field = Number((dv.getBigUint64(0) >> 52n) & 0x7ffn)
  if (field > 0) return field - 1023
  // a subnormal double: find the highest set bit of the fraction
  const frac = dv.getBigUint64(0) & ((1n << 52n) - 1n)
  return frac.toString(2).length - 1 - 1074
}

/** Round a non-negative number to an integer, ties to even. */
function roundHalfEven(v: number): number {
  const f = Math.floor(v)
  const r = v - f
  if (r > 0.5) return f + 1
  if (r < 0.5) return f
  return f % 2 === 0 ? f : f + 1
}

const specials = (f: Fmt): number => 2 ** f.exp - 1

/** The pattern of x in a format: the nearest number of the format, ties to even; too large becomes ∞. */
export function encode(x: number, f: Fmt): Fields {
  const top = specials(f)
  if (Number.isNaN(x)) return { sign: 0, exp: top, man: 2 ** (f.man - 1), kind: 'nan' }
  const sign: 0 | 1 = x < 0 || Object.is(x, -0) ? 1 : 0
  const a = Math.abs(x)
  if (a === Infinity) return { sign, exp: top, man: 0, kind: 'inf' }
  if (a === 0) return { sign, exp: 0, man: 0, kind: 'zero' }
  const e = exponentOf(a)
  if (e > emax(f)) return { sign, exp: top, man: 0, kind: 'inf' }
  if (e < emin(f)) {
    // subnormal range: a multiple of 2^(emin − man)
    const m = roundHalfEven(a / pow2(emin(f) - f.man))
    if (m === 0) return { sign, exp: 0, man: 0, kind: 'zero' }
    if (m >= 2 ** f.man) return { sign, exp: 1, man: m - 2 ** f.man, kind: 'normal' }
    return { sign, exp: 0, man: m, kind: 'subnormal' }
  }
  let m = roundHalfEven(a / pow2(e - f.man))
  let ee = e
  if (m >= 2 ** (f.man + 1)) {
    m /= 2
    ee += 1
  }
  if (ee > emax(f)) return { sign, exp: top, man: 0, kind: 'inf' }
  return { sign, exp: ee + bias(f), man: m - 2 ** f.man, kind: 'normal' }
}

/** The value of a pattern, as a double (every format here is contained in the double format). */
export function decode(p: Fields, f: Fmt): number {
  const s = p.sign === 1 ? -1 : 1
  const top = specials(f)
  if (p.exp === top) return p.man === 0 ? s * Infinity : NaN
  if (p.exp === 0) return p.man === 0 ? (p.sign === 1 ? -0 : 0) : s * p.man * pow2(emin(f) - f.man)
  return s * (2 ** f.man + p.man) * pow2(p.exp - bias(f) - f.man)
}

export function kindOf(exp: number, man: number, f: Fmt): Kind {
  if (exp === specials(f)) return man === 0 ? 'inf' : 'nan'
  if (exp === 0) return man === 0 ? 'zero' : 'subnormal'
  return 'normal'
}

/** The pattern written out as three groups of bits: sign, exponent, fraction. */
export function bitStrings(p: Fields, f: Fmt): { sign: string; exp: string; man: string } {
  return { sign: String(p.sign), exp: p.exp.toString(2).padStart(f.exp, '0'), man: p.man.toString(2).padStart(f.man, '0') }
}

/** The pattern as hexadecimal digits. */
export function hexOf(p: Fields, f: Fmt): string {
  const total = 1 + f.exp + f.man
  const n = (BigInt(p.sign) << BigInt(f.exp + f.man)) | (BigInt(p.exp) << BigInt(f.man)) | BigInt(p.man)
  return n.toString(16).toUpperCase().padStart(Math.ceil(total / 4), '0')
}

/** The pattern read from a string of 0 and 1 of the right length, or null. */
export function fromBits(bits: string, f: Fmt): Fields | null {
  const s = bits.replace(/\s+/g, '')
  if (s.length !== 1 + f.exp + f.man || /[^01]/.test(s)) return null
  const exp = parseInt(s.slice(1, 1 + f.exp), 2)
  const man = Number(BigInt('0b' + s.slice(1 + f.exp)))
  return { sign: s[0] === '1' ? 1 : 0, exp, man, kind: kindOf(exp, man, f) }
}

const asInt = (p: Fields, f: Fmt): bigint => (BigInt(p.exp) << BigInt(f.man)) | BigInt(p.man)
const fromInt = (n: bigint, sign: 0 | 1, f: Fmt): Fields => {
  const exp = Number(n >> BigInt(f.man))
  const man = Number(n & ((1n << BigInt(f.man)) - 1n))
  return { sign, exp, man, kind: kindOf(exp, man, f) }
}

/** The next number of the format above (toward +∞), or the same for +∞ and NaN. */
export function nextUp(p: Fields, f: Fmt): Fields {
  if (p.kind === 'nan' || (p.kind === 'inf' && p.sign === 0)) return p
  if (p.kind === 'zero') return fromInt(1n, 0, f)
  const n = asInt(p, f)
  if (p.sign === 0) return fromInt(n + 1n, 0, f)
  // a negative number: toward zero
  return n === 1n ? { sign: 1, exp: 0, man: 0, kind: 'zero' } : fromInt(n - 1n, 1, f)
}

/** The next number of the format below (toward −∞). */
export function nextDown(p: Fields, f: Fmt): Fields {
  if (p.kind === 'nan' || (p.kind === 'inf' && p.sign === 1)) return p
  if (p.kind === 'zero') return fromInt(1n, 1, f)
  const n = asInt(p, f)
  if (p.sign === 1) return fromInt(n + 1n, 1, f)
  return n === 1n ? { sign: 0, exp: 0, man: 0, kind: 'zero' } : fromInt(n - 1n, 0, f)
}

/** The gap between |x| and the next larger number of the format: 2^(e − man) for the exponent e of x, at least 2^(emin − man). */
export function ulp(x: number, f: Fmt): number {
  const p = encode(x, f)
  if (p.kind === 'nan' || p.kind === 'inf') return NaN
  const e = p.kind === 'normal' ? p.exp - bias(f) : emin(f)
  return pow2(e - f.man)
}

/** The exact decimal expansion of a finite double: every double is a terminating decimal. */
export function exactDecimal(x: number): string {
  if (!Number.isFinite(x)) return String(x)
  if (x === 0) return Object.is(x, -0) ? '-0' : '0'
  const dv = new DataView(new ArrayBuffer(8))
  dv.setFloat64(0, Math.abs(x))
  const bits = dv.getBigUint64(0)
  const field = Number((bits >> 52n) & 0x7ffn)
  let m = bits & ((1n << 52n) - 1n)
  let e: number
  if (field === 0) e = -1074
  else {
    m |= 1n << 52n
    e = field - 1075
  }
  while (m % 2n === 0n && m > 0n) {
    m /= 2n
    e += 1
  }
  const sign = x < 0 ? '-' : ''
  if (e >= 0) return sign + (m << BigInt(e)).toString()
  const k = -e
  const digits = (m * 5n ** BigInt(k)).toString().padStart(k + 1, '0')
  return sign + digits.slice(0, digits.length - k) + '.' + digits.slice(digits.length - k)
}

/** Every finite number of the format that is zero or positive, in increasing order. */
export function allNonNegative(f: Fmt): { fields: Fields; value: number }[] {
  const out: { fields: Fields; value: number }[] = []
  const top = specials(f)
  for (let exp = 0; exp < top; exp++)
    for (let man = 0; man < 2 ** f.man; man++) {
      const fields: Fields = { sign: 0, exp, man, kind: kindOf(exp, man, f) }
      out.push({ fields, value: decode(fields, f) })
    }
  return out
}

/** The distance in doubles between a and b: how many doubles lie from one to the other (0 if they are the same number). */
export function ulpDistance(a: number, b: number): bigint | null {
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  const dv = new DataView(new ArrayBuffer(8))
  const order = (x: number): bigint => {
    dv.setFloat64(0, x)
    const bits = dv.getBigUint64(0)
    return bits >> 63n ? -(bits & ((1n << 63n) - 1n)) : bits
  }
  const d = order(a) - order(b)
  return d < 0n ? -d : d
}

/* ------------------------------------------------------------------------------ sums */

export type Precision = 'single' | 'double'

const rounder = (p: Precision) => (p === 'single' ? Math.fround : (v: number) => v)

/** Add the numbers from left to right, rounding to the precision after every addition. */
export function sumNaive(xs: number[], p: Precision): number {
  const r = rounder(p)
  let s = 0
  for (const x of xs) s = r(s + r(x))
  return s
}

/** Kahan's compensated sum: a second number carries the part of each addition that was rounded away. */
export function sumKahan(xs: number[], p: Precision): number {
  const r = rounder(p)
  let s = 0
  let c = 0
  for (const x0 of xs) {
    const x = r(x0)
    const y = r(x - c)
    const t = r(s + y)
    c = r(r(t - s) - y)
    s = t
  }
  return s
}

/** The exactly rounded sum of doubles: add them as integers, then round once. */
export function sumExact(xs: number[]): number {
  const parts = xs.map((x) => {
    if (x === 0) return { m: 0n, e: 0 }
    const dv = new DataView(new ArrayBuffer(8))
    dv.setFloat64(0, Math.abs(x))
    const bits = dv.getBigUint64(0)
    const field = Number((bits >> 52n) & 0x7ffn)
    let m = bits & ((1n << 52n) - 1n)
    let e = -1074
    if (field > 0) {
      m |= 1n << 52n
      e = field - 1075
    }
    return { m: x < 0 ? -m : m, e }
  })
  let low = 0
  for (const q of parts) if (q.m !== 0n && q.e < low) low = q.e
  let total = 0n
  for (const q of parts) total += q.m << BigInt(q.e - low)
  // total × 2^low, rounded once; the scale is applied in two steps so that neither step overflows
  const half = Math.trunc(low / 2)
  return Number(total) * pow2(half) * pow2(low - half)
}

/* --------------------------------------------------------------------- cancellation */

export interface CancelCase {
  id: string
  /** the same quantity written in two ways: the obvious one and a stable one */
  naive: (x: number) => number
  stable: (x: number) => number
  /** a series for the true value, good for the range of x the widget offers */
  series: (x: number) => number
  /** the range of x offered, as powers of ten */
  lo: number
  hi: number
}

export const CANCEL_CASES: CancelCase[] = [
  {
    id: 'cosine',
    naive: (x) => (1 - Math.cos(x)) / (x * x),
    stable: (x) => (2 * Math.sin(x / 2) ** 2) / (x * x),
    series: (x) => 1 / 2 - (x * x) / 24 + x ** 4 / 720 - x ** 6 / 40320,
    lo: -9,
    hi: -1,
  },
  {
    id: 'exp',
    naive: (x) => (Math.exp(x) - 1) / x,
    stable: (x) => Math.expm1(x) / x,
    series: (x) => 1 + x / 2 + (x * x) / 6 + x ** 3 / 24 + x ** 4 / 120 + x ** 5 / 720,
    lo: -16,
    hi: -2,
  },
  {
    id: 'sqrt',
    naive: (x) => Math.sqrt(x * x + 1) - x,
    stable: (x) => 1 / (Math.sqrt(x * x + 1) + x),
    series: (x) => 1 / (2 * x) - 1 / (8 * x ** 3) + 1 / (16 * x ** 5) - 5 / (128 * x ** 7),
    lo: 2,
    hi: 8,
  },
  {
    id: 'root',
    // the small root of x² − b x + 1 = 0 for a large b, written in terms of b = x
    naive: (b) => (b - Math.sqrt(b * b - 4)) / 2,
    stable: (b) => 2 / (b + Math.sqrt(b * b - 4)),
    series: (b) => 1 / b + 1 / b ** 3 + 2 / b ** 5 + 5 / b ** 7 + 14 / b ** 9,
    lo: 2,
    hi: 8,
  },
]

/** Correct decimal digits of `got` against `want`, from 0 to 16. */
export function agreeDigits(got: number, want: number): number {
  if (got === want) return 16
  if (!Number.isFinite(got) || want === 0) return 0
  return Math.max(0, Math.min(16, -Math.log10(Math.abs((got - want) / want))))
}
