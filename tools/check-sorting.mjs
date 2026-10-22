/** Checks src/lib/sorting.ts, the numbers behind the "Binary Search and Sorting" article.
 *
 *  References that do not use the code under test:
 *   1. Binary search: linear scans for "an index holding x", "the first index with a[i] ≥ x" and "the first index with a[i] > x"
 *      (the semantics of Python's bisect_left and bisect_right), the count of occurrences as upper − lower, and the number of
 *      halvings against ⌊log₂ n⌋ + 1 and ⌈log₂(n + 1)⌉.
 *   2. Searching the answer: the smallest n with n ≥ t, the integer square root against BigInt, and bisection for √2.
 *   3. Sorting: the native sort for the result of every algorithm; the definition of an inversion (a double loop) against the
 *      swaps of bubble sort and the shifts of insertion sort; the comparisons of selection sort n(n − 1)/2; the comparisons of
 *      insertion sort from the inversions and the strict prefix minima; the writes and the sorted-input comparisons of merge
 *      sort from their recurrences; the comparisons of quicksort on sorted input; the average of quicksort against
 *      2(n + 1)Hₙ − 4n; and stability by tagging equal keys.
 *
 *  Run: npm run check:sorting   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sort-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/sorting.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const sortedNative = (a) => a.slice().sort((x, y) => x - y)
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const sameMultiset = (a, b) => {
  if (a.length !== b.length) return false
  const sa = sortedNative(a)
  const sb = sortedNative(b)
  return sa.every((v, i) => v === sb[i])
}

/* ---------------------------------------------------------------------------- 1: binary search */
for (let t = 0; t < 2000; t++) {
  const n = rndInt(0, 40)
  const a = sortedNative(Array.from({ length: n }, () => rndInt(0, 30)))
  const x = rndInt(-1, 32)
  let lower = n
  let upper = n
  for (let i = n - 1; i >= 0; i--) {
    if (a[i] >= x) lower = i
    if (a[i] > x) upper = i
  }
  const lo = M.binarySearch(a, x, 'lower')
  const up = M.binarySearch(a, x, 'upper')
  const fi = M.binarySearch(a, x, 'find')
  ok(lo.index === lower, `lower bound of ${x} in [${a}]: ${lo.index}, scan ${lower}`)
  ok(up.index === upper, `upper bound of ${x} in [${a}]: ${up.index}, scan ${upper}`)
  ok(up.index - lo.index === a.filter((v) => v === x).length, `occurrences of ${x}`)
  const present = a.includes(x)
  ok(present ? fi.index >= 0 && a[fi.index] === x : fi.index === -1, `find ${x} in [${a}]: ${fi.index}`)
  // the number of halvings
  const logs = Math.floor(Math.log2(n || 1)) + 1
  ok(fi.steps.length <= (n === 0 ? 0 : logs), `find: ${fi.steps.length} steps for n = ${n}, bound ${logs}`)
  const L = Math.log2(n + 1)
  ok(lo.steps.length <= Math.ceil(L - 1e-12) && lo.steps.length >= Math.floor(L + 1e-12), `lower: ${lo.steps.length} steps for n = ${n}, between ⌊${L}⌋ and ⌈${L}⌉`)
  // the invariant: the answer stays inside the open interval, which shrinks at each step
  let prevWidth = Infinity
  for (const s of lo.steps) {
    ok(s.lo <= lower && lower <= s.hi && s.hi - s.lo < prevWidth && s.mid >= s.lo && s.mid < s.hi, 'lower: the answer is inside [lo, hi) and the interval shrinks')
    prevWidth = s.hi - s.lo
  }
  for (const s of fi.steps) ok(s.lo <= s.mid && s.mid <= s.hi && (!present || (a.indexOf(x) <= s.hi && a.lastIndexOf(x) >= s.lo)), 'find: a holder of x stays inside [lo, hi]')
}
{
  // the textbook example: the first index ≥ 7 in a sorted list, and a search that fails
  const a = [1, 3, 3, 5, 7, 7, 7, 9, 12]
  ok(M.binarySearch(a, 7, 'lower').index === 4 && M.binarySearch(a, 7, 'upper').index === 7 && M.binarySearch(a, 4, 'lower').index === 3 && M.binarySearch(a, 100, 'lower').index === 9 && M.binarySearch(a, 0, 'upper').index === 0, 'bounds in [1, 3, 3, 5, 7, 7, 7, 9, 12]')
  ok(M.binarySearch(a, 5, 'find').steps.map((q) => q.mid).join() === '4,1,2,3' && M.binarySearch(a, 8, 'find').steps.map((q) => q.mid).join() === '4,6,7' && M.binarySearch(a, 5, 'lower').steps.map((q) => q.mid).join() === '4,2,3', 'the middles looked at in the textbook example')
  ok(M.binarySearch([], 5, 'find').index === -1 && M.binarySearch([], 5, 'lower').index === 0 && M.binarySearch([], 5, 'find').steps.length === 0, 'an empty list')
  // 1000 elements, an absent value: at most 10 looks
  const big = Array.from({ length: 1000 }, (_, i) => 2 * i)
  ok(M.binarySearch(big, 777, 'find').steps.length <= 10 && M.binarySearch(big, 778, 'find').index === 389, 'a thousand elements need at most ten looks')
}

/* ---------------------------------------------------------------------- 2: searching the answer */
for (let t = 0; t < 400; t++) {
  const lo = rndInt(-20, 20)
  const hi = lo + rndInt(0, 200)
  const th = rndInt(lo - 3, hi + 3)
  const r = M.firstTrue((n) => n >= th, lo, hi)
  const want = th <= lo ? lo : th > hi ? hi + 1 : th
  ok(r.index === want, `first true: ${r.index}, expected ${want} (lo ${lo}, hi ${hi}, threshold ${th})`)
  ok(r.steps <= Math.ceil(Math.log2(hi - lo + 2)) + 1, 'first true: the number of looks')
}
{
  const bigSqrt = (N) => {
    let r = BigInt(Math.floor(Math.sqrt(N)))
    while (r * r > BigInt(N)) r--
    while ((r + 1n) * (r + 1n) <= BigInt(N)) r++
    return Number(r)
  }
  for (let N = 0; N <= 3000; N++) ok(M.isqrtSteps(N).root === bigSqrt(N), `isqrt(${N})`)
  for (let t = 0; t < 400; t++) {
    const N = Math.floor(Math.random() * 1e12)
    const r = M.isqrtSteps(N)
    ok(r.root === bigSqrt(N) && r.rows.length <= 41, `isqrt(${N}) = ${r.root}`)
  }
  ok(M.isqrtSteps(99).root === 9 && M.isqrtSteps(100).root === 10 && M.isqrtSteps(1e12).root === 1e6 && M.isqrtSteps(1e12 - 1).root === 999999, 'isqrt at perfect squares')
  // bisection for √2: the bracket always contains the root, and halves
  const rows = M.bisectRoot('x^2-2', 1, 2, 50)
  ok(rows.length === 50, 'fifty halvings')
  rows.forEach((w, i) => {
    ok(Math.abs(w.hi - w.lo - 1 / 2 ** i) < 1e-15 && w.lo <= Math.SQRT2 && Math.SQRT2 <= w.hi, `bisection step ${w.k}: the bracket [${w.lo}, ${w.hi}] holds √2`)
    ok(Math.abs(w.mid - Math.SQRT2) <= 1 / 2 ** (i + 1) + 1e-15, `bisection step ${w.k}: the midpoint is within half the bracket`)
  })
  ok(Math.abs(rows[49].mid - Math.SQRT2) < 1e-14, 'fifty halvings give about fifteen digits')
  ok(M.bisectRoot('x^2+1', 0, 1, 5) === null && M.bisectRoot('x^+', 0, 1, 5) === null && M.bisectRoot('x', 1, 0, 5) === null, 'no sign change, a bad formula and a bad interval are refused')
}

/* --------------------------------------------------------------------------------- 3: sorting */
const ALGOS = M.SORT_ALGOS
ok(ALGOS.length === 6, 'six algorithms')
const W2 = (n) => (n < 2 ? 0 : W2(Math.ceil(n / 2)) + W2(Math.floor(n / 2)) + n)
const Csorted = (n) => (n < 2 ? 0 : Csorted(Math.ceil(n / 2)) + Csorted(Math.floor(n / 2)) + Math.ceil(n / 2))
const lg = (n) => Math.ceil(Math.log2(n))
for (let t = 0; t < 1500; t++) {
  const n = rndInt(0, 30)
  const a = Array.from({ length: n }, () => rndInt(0, 12))
  const inv = M.inversions(a)
  const want = sortedNative(a)
  // strict prefix minima among positions 1…n−1
  let strictMin = 0
  let m = a[0]
  for (let i = 1; i < n; i++) {
    if (a[i] < m) {
      strictMin++
      m = a[i]
    }
  }
  for (const algo of ALGOS) {
    const r = M.sortTrace(algo, a)
    ok(r.result.length === n && r.result.every((v, i) => v === want[i]), `${algo}: sorted [${a}] to [${r.result}]`)
    const last = r.frames[r.frames.length - 1]
    ok(last.arr.every((v, i) => v === want[i]) && last.done.length === n, `${algo}: the last frame is sorted and all done`)
    // insertion sort holds one number aside and merge sort overwrites its input, so only the other four keep a permutation in every frame
    ok(r.frames.every((f) => f.cmp.every((i) => i >= 0 && i < n) && f.mv.every((i) => i >= 0 && i < n)), `${algo}: the positions of every frame are inside the list`)
    if (algo !== 'insertion' && algo !== 'merge') ok(r.frames.every((f) => sameMultiset(f.arr, a)), `${algo}: every frame holds the same numbers`)
    const plain = M.sortTrace(algo, a, undefined, false)
    ok(plain.comparisons === r.comparisons && plain.moves === r.moves && plain.frames.length === 0 && plain.result.every((v, i) => v === want[i]), `${algo}: the counts do not depend on recording`)
    if (algo === 'selection') {
      ok(r.comparisons === (n * (n - 1)) / 2, `selection: comparisons ${r.comparisons}, n(n−1)/2 = ${(n * (n - 1)) / 2}`)
      ok(r.moves <= Math.max(0, n - 1), 'selection: at most n − 1 swaps')
    }
    if (algo === 'insertion') {
      ok(r.moves === inv, `insertion: shifts ${r.moves}, inversions ${inv} of [${a}]`)
      ok(r.comparisons === (n < 2 ? 0 : inv + (n - 1) - strictMin), `insertion: comparisons ${r.comparisons}, inversions + n − 1 − new minima = ${inv + (n - 1) - strictMin}`)
    }
    if (algo === 'bubble') ok(r.moves === inv, `bubble: swaps ${r.moves}, inversions ${inv} of [${a}]`)
    if (algo === 'merge') {
      ok(r.moves === W2(n), `merge: writes ${r.moves}, recurrence ${W2(n)}`)
      ok(r.comparisons <= (n < 2 ? 0 : n * lg(n) - 2 ** lg(n) + 1), `merge: comparisons ${r.comparisons} within the worst case`)
    }
    if (algo === 'heap' && n >= 2) ok(r.comparisons <= 2 * n * Math.ceil(Math.log2(n)) + 2 * n, `heap: comparisons ${r.comparisons} within 2n lg n + 2n`)
  }
}
/* two independent re-writes of selection sort and of quicksort with the Lomuto partition, to pin down the swaps and the order of equal keys */
{
  const refSelection = (input) => {
    const a = input.slice()
    let comparisons = 0
    let swaps = 0
    for (let i = 0; i < a.length - 1; i++) {
      let m = i
      for (let j = i + 1; j < a.length; j++) {
        comparisons++
        if (a[j] < a[m]) m = j
      }
      if (m !== i) {
        const t = a[i]
        a[i] = a[m]
        a[m] = t
        swaps++
      }
    }
    return { comparisons, swaps, result: a }
  }
  const refLomuto = (input, key) => {
    const a = input.slice()
    let comparisons = 0
    let swaps = 0
    const go = (lo, hi) => {
      if (lo >= hi) return
      const pivot = a[hi]
      let p = lo
      for (let j = lo; j < hi; j++) {
        comparisons++
        if (key(a[j]) < key(pivot)) {
          if (p !== j) {
            ;[a[p], a[j]] = [a[j], a[p]]
            swaps++
          }
          p++
        }
      }
      if (p !== hi) {
        ;[a[p], a[hi]] = [a[hi], a[p]]
        swaps++
      }
      go(lo, p - 1)
      go(p + 1, hi)
    }
    go(0, a.length - 1)
    return { comparisons, swaps, result: a }
  }
  const keyOf = (x) => Math.floor(x / 1000)
  for (let t = 0; t < 1500; t++) {
    const n = rndInt(0, 25)
    const items = Array.from({ length: n }, (_, i) => rndInt(0, 4) * 1000 + i)
    const s1 = M.sortTrace('selection', items, keyOf, false)
    const r1 = refSelection(items.map(keyOf))
    ok(s1.comparisons === r1.comparisons && s1.moves === r1.swaps, `selection: ${s1.comparisons} comparisons and ${s1.moves} swaps, the reference ${r1.comparisons} and ${r1.swaps}`)
    const s2 = M.sortTrace('quick', items, keyOf, false)
    const r2 = refLomuto(items, keyOf)
    ok(s2.comparisons === r2.comparisons && s2.moves === r2.swaps && s2.result.every((v, i) => v === r2.result[i]), `quicksort: [${items}] gave ${s2.comparisons}/${s2.moves}/[${s2.result}], the reference ${r2.comparisons}/${r2.swaps}/[${r2.result}]`)
  }
}
/* the exact cases */
for (let n = 0; n <= 40; n++) {
  const sorted = Array.from({ length: n }, (_, i) => i + 1)
  const rev = sorted.slice().reverse()
  const tri = (n * (n - 1)) / 2
  ok(M.sortTrace('insertion', sorted, undefined, false).comparisons === Math.max(0, n - 1) && M.sortTrace('insertion', sorted, undefined, false).moves === 0, `insertion on sorted n = ${n}: n − 1 comparisons`)
  ok(M.sortTrace('insertion', rev, undefined, false).comparisons === tri && M.sortTrace('insertion', rev, undefined, false).moves === tri, `insertion on reversed n = ${n}`)
  ok(M.sortTrace('bubble', sorted, undefined, false).comparisons === Math.max(0, n - 1) && M.sortTrace('bubble', sorted, undefined, false).moves === 0, `bubble on sorted n = ${n}: one pass`)
  ok(M.sortTrace('bubble', rev, undefined, false).comparisons === tri && M.sortTrace('bubble', rev, undefined, false).moves === tri, `bubble on reversed n = ${n}`)
  ok(M.sortTrace('quick', sorted, undefined, false).comparisons === tri && M.sortTrace('quick', rev, undefined, false).comparisons === tri, `quicksort with the last element as pivot on sorted and reversed input n = ${n}: n(n−1)/2`)
  ok(M.sortTrace('merge', sorted, undefined, false).comparisons === Csorted(n), `merge sort on sorted input n = ${n}: ${Csorted(n)}`)
  ok(M.inversions(sorted) === 0 && M.inversions(rev) === tri, `inversions n = ${n}`)
}
{
  // the worst input of merge sort costs n⌈lg n⌉ − 2^⌈lg n⌉ + 1 (built by un-merging, written here again)
  const unmerge = (items) => (items.length <= 1 ? items : [...unmerge(items.filter((_, i) => i % 2 === 0)), ...unmerge(items.filter((_, i) => i % 2 === 1))])
  for (let n = 2; n <= 200; n++) {
    const inp = unmerge(Array.from({ length: n }, (_, i) => i))
    ok(M.sortTrace('merge', inp, undefined, false).comparisons === n * lg(n) - 2 ** lg(n) + 1, `merge sort worst case n = ${n}`)
  }
  // a known small example: selection, insertion, bubble on [5, 2, 4, 6, 1, 3]
  const ex = [5, 2, 4, 6, 1, 3]
  const insn = M.sortTrace('insertion', ex, undefined, false)
  ok(insn.moves === 9 && M.inversions(ex) === 9, 'the six numbers 5 2 4 6 1 3 have 9 inversions')
  ok(M.sortTrace('selection', ex, undefined, false).comparisons === 15 && M.sortTrace('selection', ex, undefined, false).moves <= 5, 'selection sort on six numbers: 15 comparisons')
}
{
  // quicksort's average number of comparisons for a random permutation: 2(n + 1)Hₙ − 4n
  const n = 100
  let H = 0
  for (let k = 1; k <= n; k++) H += 1 / k
  const expected = 2 * (n + 1) * H - 4 * n
  const trials = 4000
  let total = 0
  for (let t = 0; t < trials; t++) total += M.sortTrace('quick', shuffle(Array.from({ length: n }, (_, i) => i)), undefined, false).comparisons
  const mean = total / trials
  ok(Math.abs(mean - expected) / expected < 0.03, `quicksort on random input: ${mean.toFixed(1)} comparisons, 2(n+1)Hₙ − 4n = ${expected.toFixed(1)}`)
  // merge sort on random input is below n lg n, bubble sort near n²/2
  let m2 = 0
  for (let t = 0; t < 200; t++) m2 += M.sortTrace('merge', shuffle(Array.from({ length: n }, (_, i) => i)), undefined, false).comparisons
  ok(m2 / 200 < n * Math.log2(n) && m2 / 200 > n * Math.log2(n) - 1.3 * n, `merge sort on random input: ${(m2 / 200).toFixed(1)} comparisons, between n lg n − 1.3n and n lg n`)
}
{
  // stability: items key·1000 + id sorted by key; equal keys must keep increasing ids in the stable sorts
  const keyOf = (x) => Math.floor(x / 1000)
  const unstableSeen = { selection: false, quick: false, heap: false }
  for (let t = 0; t < 2500; t++) {
    const n = rndInt(2, 14)
    const items = Array.from({ length: n }, (_, i) => rndInt(0, 4) * 1000 + i)
    for (const algo of ALGOS) {
      const r = M.sortTrace(algo, items, keyOf, false).result
      const keys = r.map(keyOf)
      ok(keys.every((k, i) => i === 0 || keys[i - 1] <= k), `${algo}: sorted by key`)
      let stable = true
      for (let i = 1; i < n; i++) if (keyOf(r[i]) === keyOf(r[i - 1]) && r[i] < r[i - 1]) stable = false
      if (M.STABLE[algo]) ok(stable, `${algo} must be stable: [${items}] gave [${r}]`)
      else if (!stable) unstableSeen[algo] = true
    }
  }
  ok(unstableSeen.selection && unstableSeen.quick && unstableSeen.heap, `the three unstable sorts each fail on some input (${JSON.stringify(unstableSeen)})`)
  ok(M.STABLE.merge && M.STABLE.insertion && M.STABLE.bubble && !M.STABLE.selection && !M.STABLE.quick && !M.STABLE.heap, 'the table of stable sorts')
}
{
  // the inputs of the widgets
  for (const pattern of ['random', 'sorted', 'reversed', 'few', 'nearly']) {
    for (const n of [1, 2, 8, 24, 64]) {
      const a = M.makeInput(pattern, n, 5)
      ok(a.length === n, `${pattern} n = ${n}`)
      if (pattern === 'few') ok(a.every((v) => v >= 1 && v <= 3), 'few distinct values')
      else ok(sameMultiset(a, Array.from({ length: n }, (_, i) => i + 1)), `${pattern}: a permutation of 1…n`)
    }
    ok(M.makeInput(pattern, 30, 7).every((v, i) => v === M.makeInput(pattern, 30, 7)[i]), `${pattern}: the same seed gives the same input`)
  }
  ok(M.makeInput('sorted', 5).join() === '1,2,3,4,5' && M.makeInput('reversed', 5).join() === '5,4,3,2,1', 'sorted and reversed')
  ok(M.inversions(M.makeInput('nearly', 40, 3)) <= 4 && M.inversions(M.makeInput('random', 64, 1)) > 500, 'nearly sorted has few inversions, random about n²/4')
}

console.log(`sorting check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
