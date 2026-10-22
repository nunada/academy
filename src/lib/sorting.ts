/** Binary search and sorting: the numbers behind the "Binary Search and Sorting" article's widgets.
 *
 *  The checker (tools/check-sorting.mjs) tests this against references that do not use it: linear scans for the three kinds of
 *  binary search and Python's bisect semantics, the native sort for every algorithm, the definition of an inversion (counted
 *  by a double loop) against the swaps of bubble sort and the shifts of insertion sort, the closed forms of the comparison counts
 *  (selection n(n − 1)/2, quicksort on sorted input, the merge recurrence), the average of quicksort against 2(n + 1)Hₙ − 4n,
 *  stability by tagging equal keys, and exact integer square roots by BigInt. */

import { evalFloat } from './chain'
import { parseFunction } from './linearize'

/* -------------------------------------------------------------------------------- binary search */

export type SearchMode = 'find' | 'lower' | 'upper'

export interface SearchStep {
  /** the interval still open before this step: [lo, hi] for find, [lo, hi) for the bounds */
  lo: number
  hi: number
  mid: number
  /** how a[mid] compares with the target */
  cmp: 'less' | 'greater' | 'equal'
}

export interface SearchRun {
  steps: SearchStep[]
  /** the index found (−1 if the target is absent) for 'find'; the insertion point for 'lower' and 'upper' */
  index: number
}

/** Binary search in a sorted array. 'find' looks for an index holding x; 'lower' returns the first index with a[i] ≥ x;
 *  'upper' the first index with a[i] > x. */
export function binarySearch(a: number[], x: number, mode: SearchMode): SearchRun {
  const steps: SearchStep[] = []
  if (mode === 'find') {
    let lo = 0
    let hi = a.length - 1
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1)
      const cmp = a[mid] === x ? 'equal' : a[mid] < x ? 'less' : 'greater'
      steps.push({ lo, hi, mid, cmp })
      if (cmp === 'equal') return { steps, index: mid }
      if (cmp === 'less') lo = mid + 1
      else hi = mid - 1
    }
    return { steps, index: -1 }
  }
  let lo = 0
  let hi = a.length
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)
    const cmp = a[mid] === x ? 'equal' : a[mid] < x ? 'less' : 'greater'
    steps.push({ lo, hi, mid, cmp })
    // lower: move right while a[mid] < x; upper: move right while a[mid] <= x
    const goRight = mode === 'lower' ? a[mid] < x : a[mid] <= x
    if (goRight) lo = mid + 1
    else hi = mid
  }
  return { steps, index: lo }
}

/* ----------------------------------------------------------------------------- search the answer */

export interface BisectRow {
  k: number
  lo: number
  hi: number
  mid: number
  /** the value of the function (or of the test) at mid */
  value: number
}

/** Bisection for a root of f on [a, b] when f changes sign there: the bracket after each of `count` halvings. null if f does not change
 *  sign (or is not defined) at the ends. */
export function bisectRoot(src: string, a: number, b: number, count: number): BisectRow[] | null {
  const f = parseFunction(src)
  if (typeof f === 'string' || !(a < b)) return null
  let lo = a
  let hi = b
  const flo0 = evalFloat(f, lo)
  const fhi0 = evalFloat(f, hi)
  if (!Number.isFinite(flo0) || !Number.isFinite(fhi0) || flo0 * fhi0 > 0) return null
  let flo = flo0
  const rows: BisectRow[] = []
  for (let k = 1; k <= count; k++) {
    const mid = (lo + hi) / 2
    const fm = evalFloat(f, mid)
    rows.push({ k, lo, hi, mid, value: fm })
    if (fm === 0) break
    if (fm * flo < 0) hi = mid
    else {
      lo = mid
      flo = fm
    }
  }
  return rows
}

/** The smallest integer n in [lo, hi] for which `pred(n)` is true, when pred is false and then true (monotone); hi + 1 if never. */
export function firstTrue(pred: (n: number) => boolean, lo: number, hi: number): { index: number; steps: number } {
  let l = lo
  let h = hi + 1
  let steps = 0
  while (l < h) {
    const mid = l + Math.floor((h - l) / 2)
    steps++
    if (pred(mid)) h = mid
    else l = mid + 1
  }
  return { index: l, steps }
}

/** The integer square root ⌊√N⌋ by binary search on the answer: the largest r with r² ≤ N. */
export function isqrtSteps(N: number): { root: number; rows: BisectRow[] } {
  let lo = 0
  let hi = N
  const rows: BisectRow[] = []
  let k = 0
  while (lo < hi) {
    const mid = lo + Math.ceil((hi - lo) / 2)
    k++
    rows.push({ k, lo, hi, mid, value: mid * mid })
    if (mid * mid <= N) lo = mid
    else hi = mid - 1
  }
  return { root: lo, rows }
}

/* ---------------------------------------------------------------------------------------- sorting */

export type SortAlgo = 'selection' | 'insertion' | 'bubble' | 'merge' | 'quick' | 'heap'

export const SORT_ALGOS: SortAlgo[] = ['selection', 'insertion', 'bubble', 'merge', 'quick', 'heap']

/** Which of the six keep equal keys in their original order. */
export const STABLE: Record<SortAlgo, boolean> = { selection: false, insertion: true, bubble: true, merge: true, quick: false, heap: false }

export interface Frame {
  /** the array after this event */
  arr: number[]
  /** the positions that were compared (for a comparison) */
  cmp: number[]
  /** the positions that were swapped, shifted or written (for a move) */
  mv: number[]
  /** the positions known to be in their final place */
  done: number[]
}

export interface SortRun {
  frames: Frame[]
  comparisons: number
  /** swaps for selection, bubble, quick and heap sort; shifts for insertion sort; writes to the merged array for merge sort */
  moves: number
  result: number[]
}

/** Sort a copy of `input` with the given algorithm, recording every comparison and every move. `key` orders the elements
 *  (by default the elements themselves), which lets a test sort tagged items and see whether equal keys keep their order. */
export function sortTrace(algo: SortAlgo, input: number[], key: (x: number) => number = (x) => x, record = true): SortRun {
  const a = input.slice()
  const n = a.length
  const frames: Frame[] = []
  let comparisons = 0
  let moves = 0
  const snap = (cmp: number[], mv: number[], done: number[]): void => {
    if (record) frames.push({ arr: a.slice(), cmp, mv, done })
  }
  const less = (i: number, j: number): boolean => {
    comparisons++
    return key(a[i]) < key(a[j])
  }
  // the lists of finished positions are only built when the frames are recorded
  const dn = (f: () => number[]): number[] => (record ? f() : [])
  snap([], [], [])
  const swap = (i: number, j: number, done: number[]): void => {
    if (i === j) return
    ;[a[i], a[j]] = [a[j], a[i]]
    moves++
    snap([], [i, j], done)
  }

  if (algo === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let m = i
      for (let j = i + 1; j < n; j++) {
        if (less(j, m)) m = j
        snap([j, m], [], dn(() => range(0, i)))
      }
      swap(i, m, dn(() => range(0, i + 1)))
    }
  } else if (algo === 'insertion') {
    for (let i = 1; i < n; i++) {
      const x = a[i]
      let j = i - 1
      while (j >= 0) {
        comparisons++
        snap([j, j + 1], [], [])
        if (key(a[j]) > key(x)) {
          a[j + 1] = a[j]
          moves++
          snap([], [j, j + 1], [])
          j--
        } else break
      }
      a[j + 1] = x
      snap([], [j + 1], [])
    }
  } else if (algo === 'bubble') {
    let end = n - 1
    let swapped = true
    while (swapped && end > 0) {
      swapped = false
      for (let j = 0; j < end; j++) {
        const gt = less(j + 1, j)
        snap([j, j + 1], [], dn(() => range(end + 1, n)))
        if (gt) {
          swap(j, j + 1, dn(() => range(end + 1, n)))
          swapped = true
        }
      }
      end--
    }
  } else if (algo === 'merge') {
    const sort = (lo: number, hi: number): void => {
      if (hi - lo <= 1) return
      const mid = lo + Math.ceil((hi - lo) / 2)
      sort(lo, mid)
      sort(mid, hi)
      const left = a.slice(lo, mid)
      const right = a.slice(mid, hi)
      let i = 0
      let j = 0
      let k = lo
      while (i < left.length && j < right.length) {
        comparisons++
        snap([lo + i, mid + j], [], [])
        if (key(left[i]) <= key(right[j])) a[k++] = left[i++]
        else a[k++] = right[j++]
        moves++
        snap([], [k - 1], [])
      }
      while (i < left.length) {
        a[k++] = left[i++]
        moves++
        snap([], [k - 1], [])
      }
      while (j < right.length) {
        a[k++] = right[j++]
        moves++
        snap([], [k - 1], [])
      }
    }
    sort(0, n)
  } else if (algo === 'quick') {
    // Lomuto partition with the last element as the pivot
    const done = new Set<number>()
    const sort = (lo: number, hi: number): void => {
      if (lo >= hi) {
        if (lo === hi) done.add(lo)
        return
      }
      let p = lo
      for (let j = lo; j < hi; j++) {
        const lt = less(j, hi)
        snap([j, hi], [], dn(() => [...done]))
        if (lt) {
          swap(p, j, dn(() => [...done]))
          p++
        }
      }
      swap(p, hi, dn(() => [...done]))
      done.add(p)
      sort(lo, p - 1)
      sort(p + 1, hi)
    }
    sort(0, n - 1)
  } else {
    // heap sort: build a max-heap, then move the maximum to the end n − 1 times
    const sift = (start: number, end: number, done: number[]): void => {
      let root = start
      while (2 * root + 1 <= end) {
        let child = 2 * root + 1
        if (child + 1 <= end) {
          const rightBigger = less(child, child + 1)
          snap([child, child + 1], [], done)
          if (rightBigger) child++
        }
        const rootSmaller = less(root, child)
        snap([root, child], [], done)
        if (rootSmaller) {
          swap(root, child, done)
          root = child
        } else return
      }
    }
    for (let s = Math.floor((n - 2) / 2); s >= 0; s--) sift(s, n - 1, [])
    for (let end = n - 1; end > 0; end--) {
      swap(0, end, dn(() => range(end, n)))
      sift(0, end - 1, dn(() => range(end, n)))
    }
  }
  snap([], [], range(0, n))
  return { frames, comparisons, moves, result: a }
}

function range(lo: number, hi: number): number[] {
  const out: number[] = []
  for (let i = lo; i < hi; i++) out.push(i)
  return out
}

/** Inputs of the kinds the widgets offer: random (from a seed, so a table is repeatable), sorted, reversed, few distinct values,
 *  and nearly sorted. */
export type Pattern = 'random' | 'sorted' | 'reversed' | 'few' | 'nearly'

export function makeInput(pattern: Pattern, n: number, seed = 1): number[] {
  let s = seed >>> 0 || 1
  const rand = (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
  const base = Array.from({ length: n }, (_, i) => i + 1)
  if (pattern === 'sorted') return base
  if (pattern === 'reversed') return base.reverse()
  if (pattern === 'few') return Array.from({ length: n }, () => 1 + Math.floor(rand() * 3))
  const a = base.slice()
  if (pattern === 'nearly') {
    if (n < 2) return a
    for (let k = 0; k < Math.max(1, Math.floor(n / 10)); k++) {
      const i = Math.floor(rand() * (n - 1))
      ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
    }
    return a
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** The number of pairs that are out of order (i < j and a[i] > a[j]), by a double loop. */
export function inversions(a: number[]): number {
  let c = 0
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) c++
  return c
}
