/** Checks src/lib/bigo.ts, the numbers behind the "Big-O Notation" article.
 *
 *  References that do not use the code under test:
 *   1. The definition of O(g): constants and thresholds worked out by hand (3n² + 5n + 7 ≤ 4n² from n = 7 on, 100n ≤ n² from
 *      n = 100, n² ≤ 2ⁿ from n = 4) and, for random linear and quadratic functions, by solving the inequality.
 *   2. Exact integer counts (BigInt): the number of steps of each growth class, and the largest n that fits a budget, against
 *      the definition (f(n) ≤ B < f(n + 1)); the textbook figures for 10⁹ steps: 10⁹, 31622, 1000, 29, 12.
 *   3. Closed forms for the steps of the algorithms: n, ⌊log₂ n⌋ + 1, n(n − 1)/2, n − 1, the worst case of merge sort
 *      n⌈lg n⌉ − 2^⌈lg n⌉ + 1 (and a brute force over every permutation of up to 7 elements), the Fibonacci calls 2F(n + 1) − 1
 *      and 2n − 1, 2ⁿ subsets, ⌊√n⌋ and ⌊log₂ n⌋.
 *   4. Divide-and-conquer recurrences solved by recursion in this file, against the closed form n^d (1 + ρ + … + ρ^k) with
 *      ρ = a/b^d, and the three cases of the Master theorem compared with integer arithmetic.
 *
 *  Run: npm run check:bigo   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bigo-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/bigo.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * (1 + Math.abs(b))
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))

/** A plain loop for the threshold: the smallest n0 from which f(n) ≤ c g(n) to the end. */
function threshold(fn, N) {
  let last = 0
  for (let n = 1; n <= N; n++) if (!fn(n)) last = n
  return last === N ? null : last + 1
}

/* ------------------------------------------------------------------------ 1: the definition */
{
  const w = (f, g, c, N = 1000) => M.witness(f, g, c, N)
  ok(w('3*x^2+5*x+7', 'x^2', 4).n0 === 7, '3n² + 5n + 7 ≤ 4n² from n = 7')
  ok(w('3*x^2+5*x+7', 'x^2', 3).n0 === null, '3n² + 5n + 7 ≤ 3n² never')
  ok(w('3*x^2+5*x+7', 'x^2', 100).n0 === 1, '3n² + 5n + 7 ≤ 100n² for all n ≥ 1')
  ok(w('100*x', 'x^2', 1).n0 === 100, '100n ≤ n² from n = 100')
  ok(w('2*x+10', 'x', 3).n0 === 10, '2n + 10 ≤ 3n from n = 10')
  ok(w('x^2', '2^x', 1).n0 === 4, 'n² ≤ 2ⁿ from n = 4 on (n = 3 fails)')
  ok(w('x*ln(x)', 'x^2', 1).n0 === 1, 'n ln n ≤ n²')
  ok(w('ln(x)', 'x^(1/2)', 1).n0 === 1, 'ln n ≤ √n for every n')
  ok(w('x', 'ln(x)', 100).n0 === null, 'n is not O(log n)')
  // n³ ≤ 1000 n² holds only up to n = 1000: a scan that stops there cannot tell, a longer one sees the failure (a finite scan is evidence, not a proof)
  ok(w('x^3', 'x^2', 1000, 1000).n0 === 1 && w('x^3', 'x^2', 1000, 5000).n0 === null, 'n³ is not O(n²): the failure appears after n = 1000')
  ok(near(w('x^2', 'x^2', 1).endRatio, 1) && w('x^2', 'x^2', 1).n0 === 1, 'n² ≤ n²')
  // random linear: a n + b ≤ c n  ⟺  n ≥ b/(c − a)
  for (let t = 0; t < 300; t++) {
    const a = rndInt(1, 9)
    const b = rndInt(1, 500)
    const c = a + rndInt(1, 8)
    const want = Math.max(1, Math.ceil(b / (c - a)))
    const r = w(`${a}*x+${b}`, 'x', c, 2000)
    ok(r.n0 === want, `${a}n + ${b} ≤ ${c}n from n = ${want}, found ${r.n0}`)
  }
  // random quadratic: a n² + b n + d ≤ c n², with the threshold found by an independent integer loop
  for (let t = 0; t < 300; t++) {
    const a = rndInt(1, 6)
    const b = rndInt(0, 60)
    const d = rndInt(0, 200)
    const c = a + rndInt(1, 4)
    const want = threshold((n) => a * n * n + b * n + d <= c * n * n, 2000)
    const r = w(`${a}*x^2+${b}*x+${d}`, 'x^2', c, 2000)
    ok(r.n0 === want, `${a}n² + ${b}n + ${d} ≤ ${c}n²: ${r.n0}, loop ${want}`)
  }
  ok(M.witness('x^+', 'x', 1).ok === false && M.witness('x', 'x', 0).ok === false && M.witness('x', 'x', -2).ok === false, 'bad formulas and constants are refused')
  ok(M.witness('1/(x-5)', 'x', 1, 10).ok === false, 'a function that is not defined at an integer is refused')
}

/* ------------------------------------------------------------------------ 2: growth classes */
{
  const fact = (n) => {
    let r = 1n
    for (let k = 2n; k <= BigInt(n); k++) r *= k
    return r
  }
  const log10Big = (x) => {
    const s = x.toString()
    return s.length - 1 + Math.log10(Number('0.' + s.slice(0, 15)) * 10)
  }
  const exact = {
    constant: () => 1n,
    sqrt: null,
    linear: (n) => BigInt(n),
    quadratic: (n) => BigInt(n) ** 2n,
    cubic: (n) => BigInt(n) ** 3n,
    exp: (n) => 2n ** BigInt(n),
    factorial: fact,
  }
  for (const c of M.GROWTH) {
    if (exact[c.id]) for (const n of [1, 2, 5, 10, 20, 50, 61, 100, 170, 300, 1000, 3000]) ok(near(c.log10(n), log10Big(exact[c.id](n)), 1e-11), `${c.id}: log10 of the steps at n = ${n}`)
  }
  for (const n of [1, 10, 100, 1000, 1e6]) {
    const g = M.GROWTH.find((c) => c.id === 'nlogn')
    ok(near(g.log10(n), Math.log10(n * Math.log2(n || 1) || 1e-300), 1e-9) || n === 1, `n log n at ${n}`)
  }
  // the largest n that fits in B steps: f(n) ≤ B < f(n + 1), in exact integers
  for (const B of [1e3, 1e6, 1e9, 6e10, 3.6e12]) {
    const BB = BigInt(Math.round(B))
    for (const c of M.GROWTH) {
      const m = c.maxN(B)
      if (c.id === 'constant' || c.id === 'log') {
        ok(m === Infinity, `${c.id}: no input is too large`)
      } else if (c.id === 'sqrt') {
        ok(Math.abs(m - B * B) <= 1e-12 * B * B, `sqrt: n = ${m} for B = ${B}`)
      } else if (c.id === 'nlogn') {
        ok(m * Math.log2(m) <= B * (1 + 1e-12) && (m + 1) * Math.log2(m + 1) > B * (1 - 1e-12), `n log n: n = ${m} for B = ${B}`)
      } else {
        const f = exact[c.id]
        ok(f(m) <= BB && f(m + 1) > BB, `${c.id}: n = ${m} for B = ${B}`)
      }
    }
  }
  const at = (id, B) => M.GROWTH.find((c) => c.id === id).maxN(B)
  ok(at('linear', 1e9) === 1e9 && at('quadratic', 1e9) === 31622 && at('cubic', 1e9) === 1000 && at('exp', 1e9) === 29 && at('factorial', 1e9) === 12, 'with 10⁹ steps: n = 10⁹, 31622, 1000, 29 and 12 are the largest')
  ok(Math.abs(at('nlogn', 1e9) - 39620077) < 2000, `n log n with 10⁹ steps: ${at('nlogn', 1e9)}`)
  ok(near(M.log10Seconds(M.GROWTH.find((c) => c.id === 'quadratic'), 1e6, 1e9), 3), 'n² at n = 10⁶ and 10⁹ steps a second is 1000 seconds')
}

/* ----------------------------------------------------------------------- 3: counting the steps */
const lg = (n) => Math.ceil(Math.log2(n))
const bitLength = (n) => n.toString(2).length
const isqrt = (n) => {
  let r = Math.floor(Math.sqrt(n))
  while (r * r > n) r--
  while ((r + 1) * (r + 1) <= n) r++
  return r
}
{
  const fibs = [0, 1]
  for (let i = 2; i < 60; i++) fibs.push(fibs[i - 1] + fibs[i - 2])
  for (let n = 1; n <= 300; n++) {
    ok(M.linearSteps(n) === n, `linear n = ${n}`)
    ok(M.binarySteps(n) === bitLength(n), `binary search n = ${n}: ${M.binarySteps(n)}, ⌊log₂ n⌋ + 1 = ${bitLength(n)}`)
    ok(M.halvingSteps(n) === bitLength(n) - 1, `halving n = ${n}`)
    ok(M.sqrtSteps(n) === isqrt(n), `sqrt steps n = ${n}`)
    ok(M.pairSteps(n) === (n * (n - 1)) / 2, `pairs n = ${n}`)
  }
  for (let n = 1; n <= 150; n++) {
    ok(M.bubbleSteps(n) === (n * (n - 1)) / 2, `bubble n = ${n}`)
    ok(M.insertionSteps(n, true) === (n * (n - 1)) / 2, `insertion worst n = ${n}`)
    ok(M.insertionSteps(n, false) === n - 1, `insertion best n = ${n}`)
  }
  for (let n = 1; n <= 300; n++) {
    const inp = M.mergeWorstInput(n)
    ok([...inp].sort((x, y) => x - y).every((v, i) => v === i), `the worst input of merge sort is a permutation, n = ${n}`)
    const want = n === 1 ? 0 : n * lg(n) - 2 ** lg(n) + 1
    ok(M.mergeSortSteps(inp) === want, `merge sort worst case n = ${n}: ${M.mergeSortSteps(inp)}, n⌈lg n⌉ − 2^⌈lg n⌉ + 1 = ${want}`)
    // the recurrence W(n) = W(⌈n/2⌉) + W(⌊n/2⌋) + n − 1
    const W = (m) => (m <= 1 ? 0 : W(Math.ceil(m / 2)) + W(Math.floor(m / 2)) + m - 1)
    ok(M.mergeSortSteps(inp) === W(n), `W(${n}) from the recurrence`)
  }
  // no permutation of up to 7 elements costs more than the worst input
  const perms = (arr) => (arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perms([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p])))
  for (let n = 1; n <= 7; n++) {
    let top = 0
    let sortedCost = Infinity
    for (const p of perms(Array.from({ length: n }, (_, i) => i))) {
      const c = M.mergeSortSteps(p)
      top = Math.max(top, c)
      sortedCost = Math.min(sortedCost, c)
    }
    ok(top === M.mergeSortSteps(M.mergeWorstInput(n)), `n = ${n}: the worst input reaches the maximum ${top} over all permutations`)
    // a sorted input costs ⌈n/2⌉ comparisons at the top and no fewer than ⌊n/2⌋ anywhere: the cheapest input is never dearer than the sorted one
    ok(sortedCost <= M.mergeSortSteps(Array.from({ length: n }, (_, i) => i)), `n = ${n}: the cheapest input costs at most a sorted one`)
  }
  for (let n = 0; n <= 27; n++) ok(M.fibNaiveCalls(n) === 2 * fibs[n + 1] - 1, `naive Fibonacci calls n = ${n}`)
  for (let n = 1; n <= 300; n++) ok(M.fibMemoCalls(n) === 2 * n - 1, `memoized Fibonacci calls n = ${n}`)
  for (let n = 0; n <= 16; n++) ok(M.subsetSteps(n) === 2 ** n, `subsets n = ${n}`)
  // the table of the widget: the algorithms and the sizes it offers
  for (const a of M.ALGOS) {
    const sizes = M.sizesFor(a)
    ok(sizes.length >= 5 && sizes.every((n, i) => i === 0 || n > sizes[i - 1]) && sizes[sizes.length - 1] <= a.maxN, `${a.id}: sizes`)
    ok(sizes.every((n) => Number.isFinite(a.steps(n)) && a.steps(n) >= 0), `${a.id}: counts`)
  }
  // the doubling ratios: 2 for linear, 4 for quadratic, → 1 for log, golden ratio for the Fibonacci calls
  ok(M.linearSteps(2000) === 2 * M.linearSteps(1000) && near(M.pairSteps(2000) / M.pairSteps(1000), 4, 1e-3), 'doubling n doubles a linear count and quadruples a quadratic one')
  ok(near(M.fibNaiveCalls(27) / M.fibNaiveCalls(26), (1 + Math.sqrt(5)) / 2, 1e-5), 'the Fibonacci calls grow by the golden ratio')
}

/* ----------------------------------------------------------------------------- 4: recurrences */
{
  // T(n) = a T(n/b) + n^d with T(1) = 1, by recursion on n = b^k
  const T = (a, b, d, n) => (n === 1 ? 1 : a * T(a, b, d, n / b) + n ** d)
  for (let t = 0; t < 400; t++) {
    const a = rndInt(1, 8)
    const b = rndInt(2, 5)
    const d = rndInt(0, 3)
    const k = rndInt(0, 7)
    ok(M.recurrenceValue(a, b, d, k) === T(a, b, d, b ** k), `T(${b}^${k}) for a = ${a}, b = ${b}, d = ${d}`)
    // closed form n^d (1 + ρ + … + ρ^k), ρ = a / b^d
    const rho = a / b ** d
    let sum = 0
    for (let j = 0; j <= k; j++) sum += rho ** j
    ok(near(M.recurrenceValue(a, b, d, k), b ** (k * d) * sum, 1e-9), `closed form of T(${b}^${k}), a = ${a}, d = ${d}`)
    // the case of the Master theorem by integer comparison of a with b^d
    const m = M.masterTheorem(a, b, d)
    const want = a < b ** d ? 'root' : a === b ** d ? 'balanced' : 'leaves'
    ok(m.kind === want, `Master theorem for a = ${a}, b = ${b}, d = ${d}: ${m.kind}, expected ${want}`)
    ok(near(m.logba, Math.log(a) / Math.log(b), 1e-12), 'log_b a')
    // T(b^k) / growth tends to a constant: balanced (k + 1)/k, root 1/(1 − ρ), leaves ρ/(ρ − 1)
    const K = 40
    const ratio = M.recurrenceValue(a, b, d, K) / M.masterGrowth(a, b, d, K)
    let exactRatio = 0
    for (let j = 0; j <= K; j++) exactRatio += want === 'leaves' ? rho ** (j - K) : rho ** j
    if (want === 'balanced') exactRatio = (K + 1) / K
    ok(near(ratio, exactRatio, 1e-9), `${want}: T/growth = ${ratio}, exact ${exactRatio} (a = ${a}, b = ${b}, d = ${d})`)
    const limit = want === 'balanced' ? 1 : want === 'root' ? 1 / (1 - rho) : rho / (rho - 1)
    ok(Math.abs(ratio - limit) <= 0.05 * limit, `${want}: T/growth = ${ratio} is within 5% of the limit ${limit}`)
  }
  const cases = [
    [2, 2, 1, 'balanced', '\\Theta(n\\log n)'],
    [1, 2, 0, 'balanced', '\\Theta(\\log n)'],
    [3, 2, 1, 'leaves', null],
    [7, 2, 2, 'leaves', null],
    [8, 2, 2, 'leaves', null],
    [1, 2, 1, 'root', '\\Theta(n)'],
    [2, 2, 0, 'leaves', '\\Theta(n)'],
    [4, 2, 1, 'leaves', null],
    [2, 4, 1, 'root', '\\Theta(n)'],
  ]
  for (const [a, b, d, kind, tex] of cases) {
    const m = M.masterTheorem(a, b, d)
    ok(m.kind === kind, `a = ${a}, b = ${b}, d = ${d}: ${m.kind}, expected ${kind}`)
    if (tex) ok(m.tex === tex, `a = ${a}, b = ${b}, d = ${d}: ${m.tex}, expected ${tex}`)
  }
  ok(near(M.masterTheorem(3, 2, 1).logba, 1.584962500721156), 'Karatsuba: log₂ 3 = 1.585')
  ok(near(M.masterTheorem(7, 2, 2).logba, 2.807354922057604), 'Strassen: log₂ 7 = 2.807')
  ok(M.masterTheorem(8, 2, 2).tex === '\\Theta\\left(n^{3}\\right)', 'eight half-size multiplications: Θ(n³)')
  // a non-integer exponent: d = 1.5 with a = 2, b = 2 is the root case
  ok(M.masterTheorem(2, 2, 1.5).kind === 'root' && M.masterTheorem(2, 2, 0.5).kind === 'leaves', 'd = 1.5 and d = 0.5 against log₂ 2 = 1')
}

console.log(`bigo check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
