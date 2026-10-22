/** Fibonacci numbers: the numbers behind the "Fibonacci Numbers" article's widgets, all in exact integers (BigInt).
 *
 *  The checker (tools/check-fibonacci.mjs) tests this against references that do not use it: Python's big integers for the
 *  numbers, the sums and the doubling formulas; Python's decimal module for the digits of the golden ratio and of the ratios of
 *  neighbors; a brute-force search over subsets for Zeckendorf's theorem and for the number of representations; a brute-force
 *  walk over pairs of residues for the Pisano periods; and the divisions of Euclid's algorithm counted by hand. */

/** F(n) by the plain loop: n − 1 additions. */
export function fib(n: number): bigint {
  let a = 0n
  let b = 1n
  for (let i = 0; i < n; i++) [a, b] = [b, a + b]
  return a
}

/** F(n) and F(n + 1) by fast doubling: F(2k) = F(k)(2F(k+1) − F(k)) and F(2k+1) = F(k)² + F(k+1)², reading the bits of n from the top.
 *  `steps` is the number of bits of n and `mults` the number of big multiplications (three per step). */
export function fibDoubling(n: number): { f: bigint; g: bigint; steps: number; mults: number } {
  let a = 0n
  let b = 1n
  let steps = 0
  for (let bit = n === 0 ? -1 : Math.floor(Math.log2(n)); bit >= 0; bit--) {
    const c = a * (2n * b - a)
    const d = a * a + b * b
    steps++
    if (Math.floor(n / 2 ** bit) % 2 === 1) {
      a = d
      b = c + d
    } else {
      a = c
      b = d
    }
  }
  return { f: a, g: b, steps, mults: 3 * steps }
}

/** The calls the plain recursion fib(n) = fib(n−1) + fib(n−2) makes: 2F(n+1) − 1. */
export const naiveCalls = (n: number): bigint => 2n * fibDoubling(n).g - 1n

/** The calls of the recursion with a dictionary of known values: 2n − 1 (one for n = 0). */
export const memoCalls = (n: number): number => (n === 0 ? 1 : 2 * n - 1)

/** The additions of the loop. */
export const loopAdds = (n: number): number => Math.max(0, n - 1)

/* ---------------------------------------------------------------------------------- the golden ratio */

/** ⌊√x⌋ for a non-negative BigInt, by Newton's method on integers. */
export function isqrtBig(x: bigint): bigint {
  if (x < 2n) return x
  let r = 1n << BigInt(Math.ceil(x.toString(2).length / 2))
  for (;;) {
    const next = (r + x / r) >> 1n
    if (next >= r) return r
    r = next
  }
}

/** ⌊φ · 10^d⌋ as a decimal string with d decimals: "1.6180339887…". */
export function goldenDigits(d: number): string {
  const scale = 10n ** BigInt(d)
  const v = (scale + isqrtBig(5n * scale * scale)) / 2n
  return withPoint(v, d)
}

/** The ratio F(n+1)/F(n), truncated to d decimals, as a string. */
export function ratioDigits(n: number, d: number): string {
  const v = (fib(n + 1) * 10n ** BigInt(d)) / fib(n)
  return withPoint(v, d)
}

function withPoint(v: bigint, d: number): string {
  const s = v.toString().padStart(d + 1, '0')
  return `${s.slice(0, s.length - d)}.${s.slice(s.length - d)}`
}

/** How many decimals of φ the ratio F(n+1)/F(n) gets right: the largest k with |ratio − φ| < 10^−k, measured with d decimals (k = d if they agree to d). */
export function correctDecimals(n: number, d = 60): number {
  const scale = 10n ** BigInt(d)
  const phi = (scale + isqrtBig(5n * scale * scale)) / 2n
  const ratio = (fib(n + 1) * scale) / fib(n)
  const diff = ratio > phi ? ratio - phi : phi - ratio
  return diff === 0n ? d : d - diff.toString().length
}

const PHI = (1 + Math.sqrt(5)) / 2

/** Binet's formula in doubles, rounded to the nearest integer: exact for a while and then not. */
export const binetDouble = (n: number): number => Math.round(PHI ** n / Math.sqrt(5))

/** The first n ≥ 0 at which Binet's formula in doubles is not F(n) (searched up to `limit`), or −1. */
export function binetFirstFailure(limit = 200): number {
  for (let n = 0; n <= limit; n++) if (BigInt(binetDouble(n)) !== fib(n)) return n
  return -1
}

/* ---------------------------------------------------------------------------------- the identities */

export interface IdentityRow {
  id: string
  /** the left side, computed the long way (by summing or multiplying out) */
  left: bigint
  /** the right side, computed by the closed form of the identity */
  right: bigint
}

/** Seven identities for a given n ≥ 1, each side computed independently. */
export function identityRows(n: number): IdentityRow[] {
  const F = Array.from({ length: 2 * n + 3 }, (_, i) => fib(i))
  const sum = (from: number, to: number, step: number, f: (i: number) => bigint): bigint => {
    let s = 0n
    for (let i = from; i <= to; i += step) s += f(i)
    return s
  }
  const sign = n % 2 === 0 ? 1n : -1n
  return [
    { id: 'sum', left: sum(1, n, 1, (i) => F[i]), right: F[n + 2] - 1n },
    { id: 'squares', left: sum(1, n, 1, (i) => F[i] * F[i]), right: F[n] * F[n + 1] },
    { id: 'odd', left: sum(1, 2 * n - 1, 2, (i) => F[i]), right: F[2 * n] },
    { id: 'even', left: sum(2, 2 * n, 2, (i) => F[i]), right: F[2 * n + 1] - 1n },
    { id: 'cassini', left: F[n - 1] * F[n + 1] - F[n] * F[n], right: sign },
    { id: 'double', left: F[2 * n], right: F[n] * (2n * F[n + 1] - F[n]) },
    { id: 'double1', left: F[2 * n + 1], right: F[n] * F[n] + F[n + 1] * F[n + 1] },
  ]
}

export function gcdBig(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b]
  return a
}

/** gcd(F(m), F(n)) and F(gcd(m, n)): the two are equal. */
export function gcdIdentity(m: number, n: number): { gcdOfValues: bigint; valueOfGcd: bigint; g: number } {
  let a = m
  let b = n
  while (b !== 0) [a, b] = [b, a % b]
  return { gcdOfValues: gcdBig(fib(m), fib(n)), valueOfGcd: fib(a), g: a }
}

/** The number of division steps Euclid's algorithm takes on (a, b), a ≥ b > 0. */
export function euclidSteps(a: number | bigint, b: number | bigint): number {
  let x = BigInt(a)
  let y = BigInt(b)
  let steps = 0
  while (y !== 0n) {
    ;[x, y] = [y, x % y]
    steps++
  }
  return steps
}

/* ------------------------------------------------------------------------------------- Zeckendorf */

/** The Fibonacci numbers 1, 2, 3, 5, 8, … (F(2), F(3), …) up to x, as [index, value]. */
function fibsUpTo(x: bigint): [number, bigint][] {
  const out: [number, bigint][] = []
  let a = 1n
  let b = 2n
  let k = 2
  while (a <= x) {
    out.push([k, a])
    ;[a, b] = [b, a + b]
    k++
  }
  return out
}

/** Zeckendorf's representation of N ≥ 1: the indices k ≥ 2 of the Fibonacci numbers F(k), largest first, no two consecutive,
 *  by taking the largest Fibonacci number that fits again and again. */
export function zeckendorf(N: bigint): number[] {
  const list = fibsUpTo(N)
  const ks: number[] = []
  let rest = N
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i][1] <= rest) {
      ks.push(list[i][0])
      rest -= list[i][1]
    }
  }
  return ks
}

/** The number of ways to write N ≥ 1 as a sum of distinct numbers from 1, 2, 3, 5, 8, … */
export function representations(N: number): number {
  const list = fibsUpTo(BigInt(N)).map(([, v]) => Number(v))
  const memo = new Map<string, number>()
  const go = (i: number, rest: number): number => {
    if (rest === 0) return 1
    if (i < 0) return 0
    const key = `${i},${rest}`
    const hit = memo.get(key)
    if (hit !== undefined) return hit
    let r = go(i - 1, rest)
    if (list[i] <= rest) r += go(i - 1, rest - list[i])
    memo.set(key, r)
    return r
  }
  return go(list.length - 1, N)
}

/* -------------------------------------------------------------------------------------- Pisano */

/** The Pisano period π(m): the length of the cycle of F(n) mod m (π(1) = 1). */
export function pisano(m: number): number {
  if (m === 1) return 1
  let a = 0
  let b = 1
  for (let i = 1; ; i++) {
    ;[a, b] = [b, (a + b) % m]
    if (a === 0 && b === 1) return i
  }
}

/** F(n) mod m for a huge n (a BigInt), by fast doubling with the remainder taken at every step. */
export function fibMod(n: bigint, m: bigint): bigint {
  let a = 0n
  let b = 1n % m
  const bits = n.toString(2)
  for (const bit of n === 0n ? '' : bits) {
    const c = (a * ((2n * b - a) % m + m)) % m
    const d = (a * a + b * b) % m
    if (bit === '1') {
      a = d
      b = (c + d) % m
    } else {
      a = c
      b = d
    }
  }
  return a
}

/** The first `count` residues F(0), F(1), … mod m. */
export function residues(m: number, count: number): number[] {
  const out: number[] = []
  let a = 0
  let b = 1 % m
  for (let i = 0; i < count; i++) {
    out.push(a)
    ;[a, b] = [b, (a + b) % m]
  }
  return out
}
