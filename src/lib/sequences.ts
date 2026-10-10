/** Exact arithmetic behind the widgets of the Arithmetic Sequences and Series
 *  article: terms, partial sums, recognising an arithmetic sequence, finding one
 *  from two of its terms. Everything is a fraction of BigInts, so a common
 *  difference of 1/3 or an index of 10^12 loses nothing. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'

export { rat, type Rat }

const R = (n: bigint | number): Rat => rat(BigInt(n), 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const same = (a: Rat, b: Rat): boolean => a.n === b.n && a.d === b.d

/** The n-th term of the arithmetic sequence with first term a1 and common
 *  difference d: a_n = a_1 + (n - 1) d. */
export const nthTerm = (a1: Rat, d: Rat, n: bigint): Rat => ratAdd(a1, ratMul(d, R(n - 1n)))

/** The first `count` terms. */
export function terms(a1: Rat, d: Rat, count: number): Rat[] {
  const out: Rat[] = []
  let t = a1
  for (let i = 0; i < count; i++) {
    out.push(t)
    t = ratAdd(t, d)
  }
  return out
}

/** The sum of the first n terms: S_n = n/2 (2 a_1 + (n - 1) d). */
export const partialSum = (a1: Rat, d: Rat, n: bigint): Rat => ratMul(rat(n, 2n), ratAdd(ratMul(R(2), a1), ratMul(d, R(n - 1n))))

/** The same sum written from the first and the last term: S_n = n (a_1 + a_n) / 2. */
export const sumFirstLast = (a1: Rat, an: Rat, n: bigint): Rat => ratMul(rat(n, 2n), ratAdd(a1, an))

/** a_n as a linear function of n: a_n = d n + (a_1 - d). */
export const linearForm = (a1: Rat, d: Rat): { slope: Rat; intercept: Rat } => ({ slope: d, intercept: ratSub(a1, d) })

export interface Analysis {
  diffs: Rat[]
  /** True when every difference between neighbours is the same (and there are at least two terms). */
  arithmetic: boolean
  d: Rat | null
  /** Index i (0-based, into `diffs`) of the first difference that differs from the first one. */
  firstBreak: number | null
}

/** Is the list an arithmetic sequence, and if not, where does it stop being one? */
export function analyse(values: Rat[]): Analysis {
  const diffs: Rat[] = []
  for (let i = 1; i < values.length; i++) diffs.push(ratSub(values[i], values[i - 1]))
  let firstBreak: number | null = null
  for (let i = 1; i < diffs.length; i++) {
    if (!same(diffs[i], diffs[0])) {
      firstBreak = i
      break
    }
  }
  const arithmetic = diffs.length >= 1 && firstBreak === null
  return { diffs, arithmetic, d: arithmetic ? diffs[0] : null, firstBreak }
}

/** The common ratio when every term is non-zero and the ratios agree (a geometric sequence), else null. */
export function geometricRatio(values: Rat[]): Rat | null {
  if (values.length < 3 || values.some(isZero)) return null
  const first = ratDiv(values[1], values[0])
  for (let i = 2; i < values.length; i++) if (!same(ratDiv(values[i], values[i - 1]), first)) return null
  return first
}

/** The sequence through term p (value x) and term q (value y), p different from q: d and a_1. */
export function fromTwoTerms(p: bigint, x: Rat, q: bigint, y: Rat): { a1: Rat; d: Rat } | null {
  if (p === q) return null
  const d = ratDiv(ratSub(y, x), R(q - p))
  return { d, a1: ratSub(x, ratMul(d, R(p - 1n))) }
}

/** How many terms there are from a1 to `last` in steps of d: n = (last - a_1) / d + 1.
 *  Null when `last` is not a term of the sequence (or d is 0). */
export function termCount(a1: Rat, d: Rat, last: Rat): bigint | null {
  if (isZero(d)) return null
  const q = ratDiv(ratSub(last, a1), d)
  if (q.d !== 1n || q.n < 0n) return null
  return q.n + 1n
}

/** k arithmetic means between a and b: the k numbers that make a, ..., b arithmetic. */
export function means(a: Rat, b: Rat, k: number): Rat[] {
  const d = ratDiv(ratSub(b, a), R(k + 1))
  return terms(ratAdd(a, d), d, k)
}

