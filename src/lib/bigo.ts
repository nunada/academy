/** Big-O notation: the numbers behind the "Big-O Notation" article's widgets.
 *
 *  The checker (tools/check-bigo.mjs) tests this against references that do not use it: the definition of O(g) with the
 *  constants worked out by hand, exact integer counts of the growth classes and of the largest input that fits a budget, the
 *  closed forms for the number of steps of the algorithms (linear and binary search, pairs, bubble, insertion and merge sort,
 *  Fibonacci with and without memoization, subsets, square-root loops), and the solutions of the divide-and-conquer
 *  recurrences T(n) = a T(n/b) + n^d against the Master theorem. */

import { evalFloat } from './chain'
import { parseFunction } from './linearize'

/* ------------------------------------------------------------------ the definition, with witnesses */

export interface WitnessOk {
  ok: true
  /** the smallest n0 ≥ 1 such that f(n) ≤ c·g(n) for every n from n0 to N, or null if it fails at N itself */
  n0: number | null
  /** f(N) / g(N): the ratio at the end of the scan */
  endRatio: number
  /** the largest n ≤ N where f(n) > c·g(n), or 0 if there is none */
  lastFailure: number
}
export interface WitnessFailed {
  ok: false
  error: 'syntax' | 'big' | 'undefined' | 'constant'
}

/** Does f(n) ≤ c·g(n) hold for all n from some n0 on? Scanned for n = 1, 2, …, N (n is written x in the formulas). */
export function witness(fSrc: string, gSrc: string, c: number, N = 1000): WitnessOk | WitnessFailed {
  const f = parseFunction(fSrc)
  const g = parseFunction(gSrc)
  if (typeof f === 'string' || typeof g === 'string') return { ok: false, error: f === 'big' || g === 'big' ? 'big' : 'syntax' }
  if (!(c > 0) || !Number.isFinite(c)) return { ok: false, error: 'constant' }
  let last = 0
  let fN = NaN
  let gN = NaN
  for (let n = 1; n <= N; n++) {
    const fv = evalFloat(f, n)
    const gv = evalFloat(g, n)
    if (!Number.isFinite(fv) || !Number.isFinite(gv)) return { ok: false, error: 'undefined' }
    if (fv > c * gv) last = n
    fN = fv
    gN = gv
  }
  return { ok: true, n0: last === N ? null : last + 1, endRatio: fN / gN, lastFailure: last }
}

/* ------------------------------------------------------------------------------- growth classes */

export interface GrowthClass {
  id: string
  tex: string
  /** log10 of the number of steps for input size n (n ≥ 1) */
  log10: (n: number) => number
  /** the largest n whose step count is at most `budget`, or Infinity when no n is too large */
  maxN: (budget: number) => number
}

/** log10(n!): the sum of logarithms for small n, and Stirling's series beyond that (the error is below 10⁻¹² from n = 30). */
const log10Factorial = (n: number): number => {
  if (n <= 60) {
    let s = 0
    for (let k = 2; k <= n; k++) s += Math.log10(k)
    return s
  }
  const ln = n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n) + 1 / (12 * n) - 1 / (360 * n ** 3) + 1 / (1260 * n ** 5)
  return ln / Math.LN10
}

export const GROWTH: GrowthClass[] = [
  { id: 'constant', tex: '1', log10: () => 0, maxN: () => Infinity },
  { id: 'log', tex: '\\log_2 n', log10: (n) => Math.log10(Math.max(Math.log2(n), 1e-300)), maxN: () => Infinity },
  { id: 'sqrt', tex: '\\sqrt n', log10: (n) => 0.5 * Math.log10(n), maxN: (B) => Math.floor(B * B) },
  { id: 'linear', tex: 'n', log10: (n) => Math.log10(n), maxN: (B) => Math.floor(B) },
  {
    id: 'nlogn',
    tex: 'n\\log_2 n',
    log10: (n) => Math.log10(n) + Math.log10(Math.max(Math.log2(n), 1e-300)),
    maxN: (B) => {
      let lo = 1
      let hi = Math.max(2, Math.floor(B))
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2)
        if (mid * Math.log2(mid) <= B) lo = mid
        else hi = mid - 1
      }
      return lo
    },
  },
  { id: 'quadratic', tex: 'n^2', log10: (n) => 2 * Math.log10(n), maxN: (B) => Math.floor(Math.sqrt(B)) },
  { id: 'cubic', tex: 'n^3', log10: (n) => 3 * Math.log10(n), maxN: (B) => Math.floor(Math.cbrt(B)) },
  { id: 'exp', tex: '2^n', log10: (n) => n * Math.log10(2), maxN: (B) => Math.floor(Math.log2(B)) },
  {
    id: 'factorial',
    tex: 'n!',
    log10: (n) => log10Factorial(n),
    maxN: (B) => {
      let n = 1
      let s = 0
      const lim = Math.log10(B)
      while (s + Math.log10(n + 1) <= lim + 1e-12) {
        n++
        s += Math.log10(n)
      }
      return n
    },
  },
]

/** The time in seconds for n steps' worth of a class at a given speed (steps per second), as log10 of seconds. */
export const log10Seconds = (c: GrowthClass, n: number, rate: number): number => c.log10(n) - Math.log10(rate)

/* ------------------------------------------------------------------ counting the steps of algorithms */

export interface Algo {
  id: string
  /** the number of basic steps for input size n, counted by running the algorithm on a worst-case input */
  steps: (n: number) => number
  /** the class it belongs to, as an id of GROWTH, or 'fib' for the golden-ratio growth */
  growth: string
  /** the largest n the widget offers, so that the run stays quick */
  maxN: number
}

/** Linear search for a value that is not there: one comparison for each element. */
export function linearSteps(n: number): number {
  let steps = 0
  for (let i = 0; i < n; i++) steps++
  return steps
}

/** Binary search in a sorted array of n for a value larger than all: the number of times the interval is halved, counting the last look. */
export function binarySteps(n: number): number {
  let lo = 0
  let hi = n - 1
  let steps = 0
  while (lo <= hi) {
    steps++
    const mid = (lo + hi) >> 1
    lo = mid + 1
  }
  return steps
}

/** Every pair i < j: the inner body runs n(n − 1)/2 times. */
export function pairSteps(n: number): number {
  let steps = 0
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) steps++
  return steps
}

/** Bubble sort on a reversed array, counting comparisons (without an early exit, so every input costs the same). */
export function bubbleSteps(n: number): number {
  const a = Array.from({ length: n }, (_, i) => n - i)
  let steps = 0
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < n - 1 - i; j++) {
      steps++
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]]
    }
  return steps
}

/** Insertion sort, counting comparisons of an element with its left neighbour; `reversed` is the worst case, sorted the best. */
export function insertionSteps(n: number, reversed: boolean): number {
  const a = Array.from({ length: n }, (_, i) => (reversed ? n - i : i))
  let steps = 0
  for (let i = 1; i < n; i++) {
    const x = a[i]
    let j = i - 1
    while (j >= 0) {
      steps++
      if (a[j] > x) {
        a[j + 1] = a[j]
        j--
      } else break
    }
    a[j + 1] = x
  }
  return steps
}

/** A permutation of 0…n−1 on which merge sort (left half of size ⌈n/2⌉) makes as many comparisons as it ever can: undo the merge, alternately. */
export function mergeWorstInput(n: number): number[] {
  const build = (items: number[]): number[] => {
    if (items.length <= 1) return items
    const left = items.filter((_, i) => i % 2 === 0)
    const right = items.filter((_, i) => i % 2 === 1)
    return [...build(left), ...build(right)]
  }
  return build(Array.from({ length: n }, (_, i) => i))
}

/** Top-down merge sort that counts the comparisons made while merging; the left half has ⌈n/2⌉ elements. */
export function mergeSortSteps(input: number[]): number {
  let steps = 0
  const sort = (a: number[]): number[] => {
    if (a.length <= 1) return a
    const mid = Math.ceil(a.length / 2)
    const l = sort(a.slice(0, mid))
    const r = sort(a.slice(mid))
    const out: number[] = []
    let i = 0
    let j = 0
    while (i < l.length && j < r.length) {
      steps++
      if (l[i] <= r[j]) out.push(l[i++])
      else out.push(r[j++])
    }
    while (i < l.length) out.push(l[i++])
    while (j < r.length) out.push(r[j++])
    return out
  }
  sort(input)
  return steps
}

/** The calls made by fib(n) = fib(n − 1) + fib(n − 2) with fib(0) = 0 and fib(1) = 1. */
export function fibNaiveCalls(n: number): number {
  let calls = 0
  const fib = (k: number): number => {
    calls++
    return k < 2 ? k : fib(k - 1) + fib(k - 2)
  }
  fib(n)
  return calls
}

/** The same function with a memo: each value is worked out once. Counts the calls to fib. */
export function fibMemoCalls(n: number): number {
  let calls = 0
  const memo = new Map<number, number>()
  const fib = (k: number): number => {
    calls++
    if (k < 2) return k
    const hit = memo.get(k)
    if (hit !== undefined) return hit
    const v = fib(k - 1) + fib(k - 2)
    memo.set(k, v)
    return v
  }
  fib(n)
  return calls
}

/** All subsets of n elements, built one after another: 2^n of them. */
export function subsetSteps(n: number): number {
  let count = 0
  const go = (i: number): void => {
    if (i === n) {
      count++
      return
    }
    go(i + 1)
    go(i + 1)
  }
  go(0)
  return count
}

/** `while i * i <= n: i += 1`: about the square root of n steps. */
export function sqrtSteps(n: number): number {
  let steps = 0
  for (let i = 1; i * i <= n; i++) steps++
  return steps
}

/** `while n > 1: n //= 2`: about log2 n steps. */
export function halvingSteps(n: number): number {
  let steps = 0
  while (n > 1) {
    n = Math.floor(n / 2)
    steps++
  }
  return steps
}

export const ALGOS: Algo[] = [
  { id: 'halving', steps: halvingSteps, growth: 'log', maxN: 1 << 20 },
  { id: 'binary', steps: binarySteps, growth: 'log', maxN: 1 << 20 },
  { id: 'sqrt', steps: sqrtSteps, growth: 'sqrt', maxN: 1 << 20 },
  { id: 'linear', steps: linearSteps, growth: 'linear', maxN: 1 << 14 },
  { id: 'merge', steps: (n) => mergeSortSteps(mergeWorstInput(n)), growth: 'nlogn', maxN: 1 << 13 },
  { id: 'insertion-best', steps: (n) => insertionSteps(n, false), growth: 'linear', maxN: 1 << 12 },
  { id: 'insertion', steps: (n) => insertionSteps(n, true), growth: 'quadratic', maxN: 1 << 10 },
  { id: 'bubble', steps: bubbleSteps, growth: 'quadratic', maxN: 1 << 10 },
  { id: 'pairs', steps: pairSteps, growth: 'quadratic', maxN: 1 << 10 },
  { id: 'fib-memo', steps: fibMemoCalls, growth: 'linear', maxN: 1 << 10 },
  { id: 'fib', steps: fibNaiveCalls, growth: 'fib', maxN: 28 },
  { id: 'subsets', steps: subsetSteps, growth: 'exp', maxN: 18 },
]

/** The inputs the widget tries: n = 1, 2, 4, … up to the largest the algorithm allows; steps of one for subsets and the Fibonacci calls. */
export function sizesFor(a: Algo): number[] {
  if (a.growth === 'exp') return Array.from({ length: a.maxN - 2 }, (_, i) => i + 1)
  if (a.growth === 'fib') return Array.from({ length: 15 }, (_, i) => i + 8)
  const out: number[] = []
  for (let n = 1; n <= a.maxN; n *= 2) out.push(n)
  return out
}

/* ------------------------------------------------------------------------------- recurrences */

export type MasterCase = 'leaves' | 'balanced' | 'root'

export interface Master {
  /** log_b a */
  logba: number
  kind: MasterCase
  /** the solution as TeX */
  tex: string
}

/** The Master theorem for T(n) = a T(n/b) + Θ(n^d) with a ≥ 1, b > 1, d ≥ 0. */
export function masterTheorem(a: number, b: number, d: number): Master {
  const logba = Math.log(a) / Math.log(b)
  const eq = Math.abs(d * Math.log(b) - Math.log(a)) < 1e-12
  const num = (x: number): string => String(Number(x.toPrecision(6)))
  if (eq) return { logba, kind: 'balanced', tex: d === 0 ? '\\Theta(\\log n)' : d === 1 ? '\\Theta(n\\log n)' : `\\Theta\\left(n^{${num(d)}}\\log n\\right)` }
  if (d > logba) return { logba, kind: 'root', tex: d === 1 ? '\\Theta(n)' : `\\Theta\\left(n^{${num(d)}}\\right)` }
  return { logba, kind: 'leaves', tex: logba === 1 ? '\\Theta(n)' : `\\Theta\\left(n^{${num(logba)}}\\right)` }
}

/** T(b^k) for T(n) = a T(n/b) + n^d with T(1) = 1, worked out by unrolling the recursion one level at a time. */
export function recurrenceValue(a: number, b: number, d: number, k: number): number {
  let t = 1
  for (let level = 1; level <= k; level++) t = a * t + (b ** level) ** d
  return t
}

/** The function that T(b^k) should grow like, for the case the Master theorem gives. */
export function masterGrowth(a: number, b: number, d: number, k: number): number {
  const n = b ** k
  const m = masterTheorem(a, b, d)
  if (m.kind === 'balanced') return n ** d * k
  if (m.kind === 'root') return n ** d
  return n ** m.logba
}
