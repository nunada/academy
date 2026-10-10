/** Checks src/lib/sequences.ts, the engine behind the "Arithmetic Sequences and
 *  Series" article's widgets (n-th term, partial sums, recognising an arithmetic
 *  sequence, finding one from two terms, arithmetic means).
 *
 *  The formulas are compared with brute force that does not use them:
 *   1. The n-th term against adding d over and over; the sum against adding the
 *      terms one by one, and against Gauss's pairing.
 *   2. Recognition against sequences built to be arithmetic, and against the same
 *      sequences with one term changed.
 *   3. Finding a sequence from two terms and counting terms by rebuilding the
 *      sequence and looking, and a set of closed forms the article quotes.
 *
 *  Run: npm run check:sequences   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sequences-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(entry, `export * from '${path.join(ROOT, 'src/lib/sequences.ts').replace(/\\/g, '/')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${path.join(ROOT, 'src/lib/rationals.ts').replace(/\\/g, '/')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const S = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const eq = (got, want, what) => {
  checks++
  if (got !== want) fail(`${what}: got ${got}, want ${want}`)
}
const B = BigInt
const R = (n, d = 1) => S.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const rr = () => R(rnd(-30, 30), rnd(1, 8))

/* ------------------------------------------------------------------ 1. known */
eq(txt(S.nthTerm(R(5), R(4), 20n)), '81/1', 'a_20 of 5, 9, 13, ...')
eq(txt(S.nthTerm(R(-4), R(7), 12n)), '73/1', 'a_12 of -4, 3, 10, ...')
eq(txt(S.nthTerm(R(1, 2), R(1, 3), 4n)), '3/2', 'a_4 of 1/2, 5/6, 7/6, ...')
eq(txt(S.partialSum(R(5), R(4), 20n)), '860/1', 'S_20 of 5, 9, 13, ...')
eq(txt(S.partialSum(R(1), R(1), 100n)), '5050/1', '1 + 2 + ... + 100')
eq(txt(S.partialSum(R(1), R(2), 50n)), '2500/1', 'the first 50 odd numbers')
eq(txt(S.partialSum(R(3), R(5), 20n)), '1010/1', '3 + 8 + ... + 98')
eq(txt(S.sumFirstLast(R(3), R(98), 20n)), '1010/1', 'sum from first and last')
eq(txt(S.partialSum(R(5), R(3), 10n)), '185/1', 'sum of 3k + 2, k = 1..10')
eq(txt(S.partialSum(R(7), R(0), 6n)), '42/1', 'a constant sequence')
eq(S.termCount(R(7), R(5), R(102)), 20n, 'terms in 7, 12, ..., 102')
eq(S.termCount(R(7), R(5), R(103)), null, '103 is not in 7, 12, 17, ...')
eq(S.termCount(R(10), R(-3), R(-8)), 7n, 'terms in 10, 7, ..., -8')
eq(S.termCount(R(10), R(-3), R(13)), null, 'going the wrong way')
eq(S.termCount(R(105), R(7), R(497)), 57n, 'multiples of 7 from 105 to 497')
eq(S.termCount(R(1), R(0), R(1)), null, 'a zero difference has no count')
const two = S.fromTwoTerms(3n, R(11), 7n, R(23))
eq(`${txt(two.a1)} ${txt(two.d)}`, '5/1 3/1', 'a_3 = 11, a_7 = 23')
const two2 = S.fromTwoTerms(4n, R(17), 9n, R(42))
eq(`${txt(two2.a1)} ${txt(two2.d)}`, '2/1 5/1', 'a_4 = 17, a_9 = 42')
const back = S.fromTwoTerms(9n, R(42), 4n, R(17))
eq(`${txt(back.a1)} ${txt(back.d)}`, '2/1 5/1', 'the two terms in either order')
eq(S.fromTwoTerms(3n, R(1), 3n, R(2)), null, 'the same index twice')
eq(S.means(R(4), R(24), 3).map(txt).join(' '), '9/1 14/1 19/1', 'three means between 4 and 24')
eq(S.means(R(1), R(2), 1).map(txt).join(' '), '3/2', 'one mean between 1 and 2')
const an = S.analyse([R(3), R(7), R(11), R(15)])
eq(`${an.arithmetic} ${txt(an.d)} ${an.firstBreak}`, 'true 4/1 null', '3, 7, 11, 15')
const ab = S.analyse([R(2), R(4), R(8), R(16)])
eq(`${ab.arithmetic} ${ab.d} ${ab.firstBreak}`, 'false null 1', '2, 4, 8, 16')
eq(S.analyse([R(5)]).arithmetic, false, 'one term is not enough')
eq(S.analyse([R(5), R(5), R(5)]).arithmetic, true, 'constant is arithmetic')
eq(S.analyse([R(1), R(4), R(9), R(16)]).diffs.map(txt).join(' '), '3/1 5/1 7/1', 'differences of squares')
eq(txt(S.geometricRatio([R(2), R(4), R(8), R(16)])), '2/1', 'geometric ratio 2')
eq(S.geometricRatio([R(1), R(2), R(4), R(7)]), null, 'not geometric')
eq(S.geometricRatio([R(0), R(0), R(0)]), null, 'zeros are not geometric')
const lin = S.linearForm(R(5), R(4))
eq(`${txt(lin.slope)} ${txt(lin.intercept)}`, '4/1 1/1', '5, 9, 13: a_n = 4n + 1')

/* -------------------------------------------- 2. against adding term by term */
for (let i = 0; i < 4000; i++) {
  const a1 = rr()
  const d = rr()
  const n = rnd(1, 60)
  const ts = S.terms(a1, d, n)
  // The n-th term, by repeated addition.
  let t = a1
  for (let k = 1; k <= n; k++) {
    eq(txt(S.nthTerm(a1, d, B(k))), txt(t), `nthTerm ${txt(a1)} ${txt(d)} ${k}`)
    eq(txt(ts[k - 1]), txt(t), `terms ${txt(a1)} ${txt(d)} ${k}`)
    t = S.ratAdd(t, d)
  }
  // The sum, by adding the terms one by one, and by Gauss's pairing.
  let total = R(0)
  for (const x of ts) total = S.ratAdd(total, x)
  eq(txt(S.partialSum(a1, d, B(n))), txt(total), `partialSum ${txt(a1)} ${txt(d)} ${n}`)
  eq(txt(S.sumFirstLast(ts[0], ts[n - 1], B(n))), txt(total), `sumFirstLast ${txt(a1)} ${txt(d)} ${n}`)
  let paired = R(0)
  for (let k = 0; k < n; k++) paired = S.ratAdd(paired, S.ratAdd(ts[k], ts[n - 1 - k]))
  eq(txt(S.ratDiv(paired, R(2))), txt(total), `pairing ${txt(a1)} ${txt(d)} ${n}`)
  // Every pair sums to the same number: 2 a_1 + (n - 1) d.
  const pair = S.ratAdd(S.ratMul(R(2), a1), S.ratMul(d, R(n - 1)))
  for (let k = 0; k < n; k++) eq(txt(S.ratAdd(ts[k], ts[n - 1 - k])), txt(pair), `pair sum ${txt(a1)} ${txt(d)} ${n} ${k}`)
  // Linear form.
  const lf = S.linearForm(a1, d)
  eq(txt(S.nthTerm(a1, d, B(n))), txt(S.ratAdd(S.ratMul(lf.slope, R(n)), lf.intercept)), `linearForm ${txt(a1)} ${txt(d)} ${n}`)
}

/* ------------------------------------------------------------ 3. recognition */
for (let i = 0; i < 3000; i++) {
  const a1 = rr()
  const d = rr()
  const n = rnd(3, 12)
  const ts = S.terms(a1, d, n)
  const a = S.analyse(ts)
  eq(a.arithmetic, true, `recognise ${ts.map(txt).join(',')}`)
  eq(txt(a.d), txt(d), `difference of ${ts.map(txt).join(',')}`)
  // Change one term (not the first one alone for n = 3 with a matching shift): the result must break.
  const k = rnd(0, n - 1)
  const bent = ts.map((x, j) => (j === k ? S.ratAdd(x, R(rnd(1, 5), rnd(1, 3))) : x))
  const b = S.analyse(bent)
  eq(b.arithmetic, false, `a bent term breaks ${bent.map(txt).join(',')}`)
  eq(b.firstBreak !== null, true, 'a break has a position')
  // Reconstruct from two terms.
  const p = rnd(1, 30)
  let q = rnd(1, 30)
  if (q === p) q++
  const x = S.nthTerm(a1, d, B(p))
  const y = S.nthTerm(a1, d, B(q))
  const f = S.fromTwoTerms(B(p), x, B(q), y)
  eq(`${txt(f.a1)} ${txt(f.d)}`, `${txt(a1)} ${txt(d)}`, `fromTwoTerms ${p} ${q}`)
  // Term counting: the last term of an n-term sequence counts as n, and a non-term does not count.
  if (d.n !== 0n) {
    eq(S.termCount(a1, d, ts[n - 1]), B(n), `termCount ${txt(a1)} ${txt(d)} ${n}`)
    const off = S.ratAdd(ts[n - 1], S.ratDiv(d, R(2)))
    eq(S.termCount(a1, d, off), null, `termCount off the sequence ${txt(a1)} ${txt(d)}`)
  }
  // Arithmetic means.
  const k2 = rnd(1, 9)
  const end = rr()
  const ms = S.means(a1, end, k2)
  eq(ms.length, k2, 'k means')
  const full = [a1, ...ms, end]
  eq(S.analyse(full).arithmetic || S.ratSub(end, a1).n === 0n, true, `means make an arithmetic sequence ${txt(a1)} ${txt(end)} ${k2}`)
}

/* ------------------------------------------------------- closed forms quoted */
for (let n = 1; n <= 300; n++) {
  eq(txt(S.partialSum(R(1), R(1), B(n))), `${(n * (n + 1)) / 2}/1`, `1 + ... + ${n}`)
  eq(txt(S.partialSum(R(1), R(2), B(n))), `${n * n}/1`, `first ${n} odd numbers`)
  eq(txt(S.partialSum(R(2), R(2), B(n))), `${n * (n + 1)}/1`, `first ${n} even numbers`)
}
// A large index is exact.
eq(txt(S.partialSum(R(1), R(1), 10n ** 12n)), `${(10n ** 12n * (10n ** 12n + 1n)) / 2n}/1`, 'sum to 10^12')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`sequences check ok — ${checks} checks (terms and sums against repeated addition and Gauss pairing, recognition, two-term reconstruction)`)
