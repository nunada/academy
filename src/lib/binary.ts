/** Exact arithmetic behind the widgets of the Binary Numbers article.
 *
 *  All of it is BigInt and plain string work on digits. The conversions are
 *  written out by repeated division and by place value rather than by calling
 *  `toString(2)`, because the widgets show those steps, and the checker then
 *  compares them with the language's own conversions. */

import { factorize, rat, type Rat } from './realnum'

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

/* ----------------------------------------------------------- base conversion */

/** The digits of a whole number in `base` (2 to 36), by repeated division. */
export function toBase(n: bigint, base: number): string {
  if (n === 0n) return '0'
  const B = BigInt(base)
  const neg = n < 0n
  let v = neg ? -n : n
  let out = ''
  while (v > 0n) {
    out = DIGITS[Number(v % B)] + out
    v /= B
  }
  return neg ? `-${out}` : out
}

/** Reads a whole number written in `base`: an optional sign, an optional
 *  0b / 0o / 0x prefix that matches the base, digits (with spaces or underscores
 *  allowed between them). Null for anything else, or for more than `maxDigits`. */
export function parseBase(src: string, base: number, maxDigits = 64): bigint | null {
  let s = src.replace(/[\s_]/g, '').toLowerCase()
  let neg = false
  if (s[0] === '-' || s[0] === '+' || s[0] === '−') {
    neg = s[0] !== '+'
    s = s.slice(1)
  }
  const prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : ''
  if (prefix && s.startsWith(prefix)) s = s.slice(2)
  if (!s || s.length > maxDigits) return null
  const B = BigInt(base)
  let v = 0n
  for (const ch of s) {
    const d = DIGITS.indexOf(ch)
    if (d < 0 || d >= base) return null
    v = v * B + BigInt(d)
  }
  return neg ? -v : v
}

export interface DivisionRow {
  n: bigint
  q: bigint
  r: number
}

/** The ladder of divisions that produces the digits, read bottom to top. */
export function divisionSteps(n: bigint, base: number): DivisionRow[] {
  const B = BigInt(base)
  const rows: DivisionRow[] = []
  let v = n < 0n ? -n : n
  if (v === 0n) return [{ n: 0n, q: 0n, r: 0 }]
  while (v > 0n) {
    rows.push({ n: v, q: v / B, r: Number(v % B) })
    v /= B
  }
  return rows
}

/** Each digit of a whole-number string with the power of the base it stands for. */
export function placeTerms(digits: string, base: number): { digit: number; power: number; value: bigint }[] {
  const clean = digits.replace(/^-/, '')
  const B = BigInt(base)
  return clean.split('').map((ch, i) => {
    const power = clean.length - 1 - i
    const digit = DIGITS.indexOf(ch)
    return { digit, power, value: BigInt(digit) * B ** BigInt(power) }
  })
}

export const bitLength = (n: bigint): number => (n === 0n ? 0 : toBase(n < 0n ? -n : n, 2).length)

/** Groups a digit string from the right: "11010110" in fours is "1101 0110". */
export function group(digits: string, size: number): string {
  const out: string[] = []
  for (let i = digits.length; i > 0; i -= size) out.unshift(digits.slice(Math.max(0, i - size), i))
  return out.join(' ')
}

/* ------------------------------------------------------- fixed-width integers */

export const maxUnsigned = (bits: number): bigint => (1n << BigInt(bits)) - 1n

/** n as `bits` binary digits in two's complement, or null when it does not fit:
 *  the range is -2^(bits-1) to 2^(bits-1) - 1. */
export function toTwos(n: bigint, bits: number): string | null {
  const half = 1n << BigInt(bits - 1)
  if (n < -half || n >= half) return null
  const u = n < 0n ? n + (1n << BigInt(bits)) : n
  return toBase(u, 2).padStart(bits, '0')
}

/** The value of a string of bits read as unsigned. */
export const fromUnsigned = (bits: string): bigint => parseBase(bits, 2, 128) ?? 0n

/** The value of a string of bits read as two's complement. */
export function fromTwos(bits: string): bigint {
  const u = fromUnsigned(bits)
  return bits[0] === '1' ? u - (1n << BigInt(bits.length)) : u
}

/** The four bitwise operators on `bits`-bit unsigned numbers, and the shifts. */
export type BitOp = 'and' | 'or' | 'xor' | 'not' | 'shl' | 'shr'
export function bitwise(op: BitOp, a: bigint, b: bigint, bits: number): bigint {
  const mask = maxUnsigned(bits)
  switch (op) {
    case 'and':
      return a & b
    case 'or':
      return a | b
    case 'xor':
      return a ^ b
    case 'not':
      return mask ^ a
    case 'shl':
      return (a << b) & mask
    case 'shr':
      return a >> b
  }
}

const ASCII_NAMES = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US']

/** The ASCII character for a code from 0 to 127 (a name for the control codes), else null. */
export function asciiLabel(code: number): { text: string; printable: boolean } | null {
  if (code < 0 || code > 127) return null
  if (code < 32) return { text: ASCII_NAMES[code], printable: false }
  if (code === 127) return { text: 'DEL', printable: false }
  return { text: String.fromCharCode(code), printable: true }
}

/* ------------------------------------------------------------ column arithmetic */

/** Binary addition column by column. Columns run left to right and there is one
 *  more than the longer operand, for a carry out of the top. `carries[i]` is the
 *  carry *into* column i, made by column i + 1 on its right (so the last one is
 *  always 0), and `result[i]` is the digit written in column i. */
export interface Columns {
  width: number
  a: string
  b: string
  carries: string
  result: string
}

const pad = (s: string, w: number): string => s.padStart(w, '0')

export function addColumns(a: string, b: string): Columns {
  const width = Math.max(a.length, b.length) + 1
  const x = pad(a, width)
  const y = pad(b, width)
  const carries = Array<string>(width).fill('0')
  const result = Array<string>(width).fill('0')
  let carry = 0
  for (let i = width - 1; i >= 0; i--) {
    carries[i] = String(carry)
    const s = Number(x[i]) + Number(y[i]) + carry
    result[i] = String(s % 2)
    carry = s >> 1
  }
  return { width, a: x, b: y, carries: carries.join(''), result: result.join('') }
}

/** Binary subtraction a − b for a >= b. `carries[i]` is the borrow *into* column i,
 *  made by column i + 1 on its right. */
export function subColumns(a: string, b: string): Columns {
  const width = Math.max(a.length, b.length)
  const x = pad(a, width)
  const y = pad(b, width)
  const borrows = Array<string>(width).fill('0')
  const result = Array<string>(width).fill('0')
  let borrow = 0
  for (let i = width - 1; i >= 0; i--) {
    borrows[i] = String(borrow)
    let d = Number(x[i]) - Number(y[i]) - borrow
    if (d < 0) {
      d += 2
      borrow = 1
    } else borrow = 0
    result[i] = String(d)
  }
  return { width, a: x, b: y, carries: borrows.join(''), result: result.join('') }
}

/** Long multiplication: one partial product per binary digit of b, from the right. */
export function mulPartials(a: string, b: string): { bit: number; shift: number; text: string }[] {
  const out: { bit: number; shift: number; text: string }[] = []
  for (let i = b.length - 1; i >= 0; i--) {
    const bit = Number(b[i])
    const shift = b.length - 1 - i
    out.push({ bit, shift, text: bit ? a + '0'.repeat(shift) : '0' })
  }
  return out
}

/* --------------------------------------------------------- fractions in a base */

export interface BaseExpansion {
  negative: boolean
  whole: string
  /** Digits after the point before the repeating block (all of them, if it ends). */
  pre: string
  /** The repeating block, or '' when the expansion terminates. */
  rep: string
  terminating: boolean
  /** True when the search stopped at `limit` digits without finding a repeat. */
  truncated: boolean
}

/** The expansion of a rational number in `base`, by long multiplication: multiply
 *  the remainder by the base, the digit is the whole part, keep the rest. The
 *  first remainder that returns marks the start of the repeating block. */
export function expandBase(r: Rat, base: number, limit = 80): BaseExpansion {
  const negative = r.n < 0n
  const n = negative ? -r.n : r.n
  const B = BigInt(base)
  const whole = toBase(n / r.d, base)
  let rem = n % r.d
  const digits: string[] = []
  const seen = new Map<string, number>()
  let cycleAt = -1
  while (rem !== 0n && digits.length < limit) {
    const key = rem.toString()
    if (seen.has(key)) {
      cycleAt = seen.get(key)!
      break
    }
    seen.set(key, digits.length)
    rem *= B
    digits.push(DIGITS[Number(rem / r.d)])
    rem %= r.d
  }
  const all = digits.join('')
  return {
    negative,
    whole,
    pre: cycleAt < 0 ? all : all.slice(0, cycleAt),
    rep: cycleAt < 0 ? '' : all.slice(cycleAt),
    terminating: rem === 0n,
    truncated: rem !== 0n && cycleAt < 0,
  }
}

/** A fraction in lowest terms has a terminating expansion in `base` exactly when
 *  every prime factor of its denominator divides the base. */
export function terminatesInBase(r: Rat, base: number): boolean {
  const B = BigInt(base)
  return factorize(r.d).every(([p]) => B % p === 0n)
}

/** Exact value of an expansion: whole.pre(rep) as a fraction, for checking. */
export function valueOfExpansion(e: BaseExpansion, base: number): Rat {
  const B = BigInt(base)
  const whole = parseBase(e.whole, base, 4096) ?? 0n
  const k = e.pre.length
  const m = e.rep.length
  const pre = e.pre ? (parseBase(e.pre, base, 4096) ?? 0n) : 0n
  let v = rat(whole * B ** BigInt(k) + pre, B ** BigInt(k))
  if (m > 0) {
    const rep = parseBase(e.rep, base, 4096) ?? 0n
    const tail = rat(rep, B ** BigInt(k) * (B ** BigInt(m) - 1n))
    v = rat(v.n * tail.d + tail.n * v.d, v.d * tail.d)
  }
  return negativeOf(e, v)
}
const negativeOf = (e: BaseExpansion, v: Rat): Rat => (e.negative ? rat(-v.n, v.d) : v)
