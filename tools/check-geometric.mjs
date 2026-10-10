/** Checks src/lib/geometric.ts, the engine behind the "Geometric Sequences and
 *  Series" article's widgets (terms, finite and infinite sums, recognition,
 *  the ratio from two terms, geometric means).
 *
 *  Each formula is compared with something that does not use it:
 *   1. Terms and sums against repeated multiplication and a plain loop; the
 *      infinite sum against the exact gap S_inf - S_n = a_1 r^n / (1 - r).
 *   2. Recognition against sequences built to be geometric and the same ones
 *      with a term changed.
 *   3. The ratio from two terms by substituting the answer back, and the
 *      rational roots of a fraction against a brute-force search; a set of
 *      published values (the chessboard, repeating decimals).
 *
 *  Run: npm run check:geometric   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'geometric-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${q('src/lib/geometric.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${q('src/lib/rationals.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const G = await import('file://' + out.replace(/\\/g, '/'))

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
const R = (n, d = 1) => G.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const nz = (lo, hi) => {
  let v = 0
  while (v === 0) v = rnd(lo, hi)
  return v
}
const rr = () => R(nz(-9, 9), rnd(1, 5))

/* ------------------------------------------------------------------ 1. known */
eq(txt(G.nthTerm(R(3), R(2), 10n)), '1536/1', 'a_10 of 3, 6, 12, ...')
eq(txt(G.nthTerm(R(64), R(1, 2), 7n)), '1/1', 'a_7 of 64, 32, ...')
eq(txt(G.nthTerm(R(5), R(3), 6n)), '1215/1', 'a_6 of 5, 15, 45, ...')
eq(txt(G.nthTerm(R(5), R(-2), 4n)), '-40/1', 'a_4 of 5, -10, 20, ...')
eq(txt(G.partialSum(R(3), R(2), 10n)), '3069/1', '3 + 6 + ... (10 terms)')
eq(txt(G.partialSum(R(2), R(3), 5n)), '242/1', '2 + 6 + 18 + 54 + 162')
eq(txt(G.partialSum(R(1), R(1, 2), 10n)), '1023/512', '1 + 1/2 + ... + 1/512')
eq(txt(G.partialSum(R(7), R(1), 9n)), '63/1', 'ratio 1 gives n a_1')
eq(txt(G.partialSum(R(1), R(2), 64n)), '18446744073709551615/1', 'the chessboard: 2^64 - 1')
eq(txt(G.partialSum(R(7), R(7), 5n)), '19607/1', 'seven houses (Rhind 79)')
eq(txt(G.infiniteSum(R(1, 2), R(1, 2))), '1/1', '1/2 + 1/4 + ...')
eq(txt(G.infiniteSum(R(6), R(2, 3))), '18/1', '6 + 4 + 8/3 + ...')
eq(txt(G.infiniteSum(R(1), R(1, 3))), '3/2', '1 + 1/3 + 1/9 + ...')
eq(txt(G.infiniteSum(R(3, 10), R(1, 10))), '1/3', '0.333...')
eq(txt(G.infiniteSum(R(9, 10), R(1, 10))), '1/1', '0.999...')
eq(txt(G.infiniteSum(R(27, 100), R(1, 100))), '3/11', '0.272727...')
eq(txt(G.ratAdd(R(1, 10), G.infiniteSum(R(6, 100), R(1, 10)))), '1/6', '0.1666...')
eq(txt(G.infiniteSum(R(1), R(-1, 2))), '2/3', '1 - 1/2 + 1/4 - ...')
eq(txt(G.infiniteSum(R(3, 4), R(1, 4))), '1/1', '3/4 + 3/16 + ... (Archimedes: 1/3 of the rest)')
eq(G.infiniteSum(R(1), R(2)), null, '1 + 2 + 4 + ... diverges')
eq(G.infiniteSum(R(1), R(-1)), null, '1 - 1 + 1 - ... does not converge')
eq(G.infiniteSum(R(1), R(1)), null, '1 + 1 + ... diverges')
eq(txt(G.infiniteSum(R(0), R(5))), '0/1', 'a zero series')
eq(G.converges(R(1), R(1, 2)), true, '|1/2| < 1')
eq(G.converges(R(1), R(-1)), false, '|-1| = 1')
const an = G.analyse([R(3), R(9), R(27), R(81)])
eq(`${an.geometric} ${txt(an.r)} ${an.firstBreak}`, 'true 3/1 null', '3, 9, 27, 81')
const ab = G.analyse([R(2), R(4), R(6), R(8)])
eq(`${ab.geometric} ${ab.r} ${ab.firstBreak}`, 'false null 1', '2, 4, 6, 8')
eq(G.analyse([R(1), R(0), R(0)]).geometric, false, 'a zero term')
eq(G.analyse([R(5)]).geometric, false, 'one term')
eq(G.analyse([R(1), R(-1), R(1), R(-1)]).geometric, true, '1, -1, 1, -1')
eq(txt(G.ratPow(R(2, 3), 3n)), '8/27', '(2/3)^3')
eq(txt(G.ratPow(R(2, 3), -2n)), '9/4', '(2/3)^-2')
eq(txt(G.ratPow(R(-2), 5n)), '-32/1', '(-2)^5')
eq(txt(G.ratPow(R(5), 0n)), '1/1', 'x^0')

const rt = (n, d, k) => {
  const r = G.rationalRoots(R(n, d), k)
  return r.kind === 'exact' ? r.roots.map(txt).join(' ') : r.kind
}
eq(rt(8, 1, 3), '2/1', 'cube root of 8')
eq(rt(-8, 1, 3), '-2/1', 'cube root of -8')
eq(rt(16, 1, 2), '4/1 -4/1', 'square roots of 16')
eq(rt(-16, 1, 2), 'none', 'no real square root of -16')
eq(rt(1, 4, 2), '1/2 -1/2', 'square roots of 1/4')
eq(rt(2, 1, 2), 'irrational', 'square root of 2')
eq(rt(8, 27, 3), '2/3', 'cube root of 8/27')
eq(rt(9, 2, 2), 'irrational', 'square root of 9/2')
eq(rt(81, 16, 4), '3/2 -3/2', 'fourth roots of 81/16')
const two = G.ratioFromTwoTerms(2n, R(6), 5n, R(48))
eq(two.roots.map(txt).join(), '2/1', 'a_2 = 6, a_5 = 48')
eq(txt(G.firstTerm(2n, R(6), R(2))), '3/1', 'first term then')
const two2 = G.ratioFromTwoTerms(5n, R(48), 2n, R(6))
eq(two2.roots.map(txt).join(), '2/1', 'positions in the other order')
const two3 = G.ratioFromTwoTerms(1n, R(3), 3n, R(12))
eq(two3.roots.map(txt).join(), '2/1,-2/1', 'a_1 = 3, a_3 = 12 has two ratios')
eq(G.ratioFromTwoTerms(2n, R(0), 4n, R(1)), null, 'a zero term')
eq(G.ratioFromTwoTerms(3n, R(1), 3n, R(2)), null, 'same position')
eq(G.means(R(3), R(81), 2).map((l) => l.map(txt).join(',')).join(' | '), '9/1,27/1', 'two means between 3 and 81')
eq(G.means(R(2), R(32), 1).map((l) => l.map(txt).join(',')).join(' | '), '8/1 | -8/1', 'one mean between 2 and 32 is 8 or -8')
eq(G.means(R(1), R(2), 1), null, 'one mean between 1 and 2 is irrational')

/* -------------------------------------------- 2. against repeated multiplication */
for (let i = 0; i < 3000; i++) {
  const a1 = rr()
  const r = rr()
  const n = rnd(1, 24)
  const ts = G.terms(a1, r, n)
  let t = a1
  let total = R(0)
  for (let k = 1; k <= n; k++) {
    eq(txt(G.nthTerm(a1, r, B(k))), txt(t), `nthTerm ${txt(a1)} ${txt(r)} ${k}`)
    eq(txt(ts[k - 1]), txt(t), `terms ${txt(a1)} ${txt(r)} ${k}`)
    total = G.ratAdd(total, t)
    eq(txt(G.partialSum(a1, r, B(k))), txt(total), `partialSum ${txt(a1)} ${txt(r)} ${k}`)
    t = G.ratMul(t, r)
  }
  const ps = G.partialSums(a1, r, n)
  eq(txt(ps[n - 1]), txt(total), `partialSums ${txt(a1)} ${txt(r)} ${n}`)
  // For |r| < 1 the gap to the infinite sum is exactly a_1 r^n / (1 - r).
  const inf = G.infiniteSum(a1, r)
  if (inf) {
    const gap = G.ratSub(inf, total)
    const want = G.ratDiv(G.ratMul(a1, G.ratPow(r, B(n))), G.ratSub(R(1), r))
    eq(txt(gap), txt(want), `gap to the infinite sum ${txt(a1)} ${txt(r)} ${n}`)
  } else {
    eq(r.n * r.n >= r.d * r.d, true, `diverges only when |r| >= 1: ${txt(r)}`)
  }
}

/* ------------------------------------------------------------ 3. recognition */
for (let i = 0; i < 3000; i++) {
  const a1 = rr()
  const r = rr()
  const n = rnd(3, 10)
  const ts = G.terms(a1, r, n)
  const a = G.analyse(ts)
  eq(a.geometric, true, `recognise ${ts.map(txt).join(',')}`)
  eq(txt(a.r), txt(r), `ratio of ${ts.map(txt).join(',')}`)
  const k = rnd(0, n - 1)
  // Add something that is never zero relative to the term, so the term stays non-zero.
  const bent = ts.map((x, j) => (j === k ? G.ratAdd(x, G.ratMul(x, R(1, rnd(2, 5)))) : x))
  eq(G.analyse(bent).geometric, false, `a bent term breaks ${bent.map(txt).join(',')}`)

  // The ratio from two terms: every root found satisfies the equation, and the true ratio is among them.
  const p = rnd(1, 12)
  let qq = rnd(1, 12)
  if (qq === p) qq++
  const x = G.nthTerm(a1, r, B(p))
  const y = G.nthTerm(a1, r, B(qq))
  const res = G.ratioFromTwoTerms(B(p), x, B(qq), y)
  eq(res.kind, 'exact', `the true ratio is rational ${txt(r)} ${p} ${qq}`)
  eq(res.roots.some((c) => txt(c) === txt(r)), true, `the true ratio ${txt(r)} is found (${p}, ${qq})`)
  for (const c of res.roots) {
    // a_q = a_p c^(q-p) must hold for every candidate.
    eq(txt(G.ratMul(x, G.ratPow(c, B(qq - p)))), txt(y), `candidate ${txt(c)} satisfies the two terms`)
    const f = G.firstTerm(B(p), x, c)
    eq(txt(G.nthTerm(f, c, B(p))), txt(x), `first term from candidate ${txt(c)}`)
  }
  eq(res.roots.length, (qq - p) % 2 === 0 ? 2 : 1, `number of roots for exponent ${qq - p}`)
}

// Rational roots against a search over small fractions, and irrational ones have no small root.
for (let i = 0; i < 400; i++) {
  const k = rnd(2, 5)
  const rho = R(nz(-300, 300), rnd(1, 40))
  const res = G.rationalRoots(rho, k)
  const found = []
  for (let n = -30; n <= 30; n++) {
    for (let d = 1; d <= 12; d++) {
      const c = R(n, d)
      if (txt(G.ratPow(c, B(k))) === txt(rho) && !found.includes(txt(c))) found.push(txt(c))
    }
  }
  if (res.kind === 'exact') {
    for (const c of res.roots) eq(txt(G.ratPow(c, B(k))), txt(rho), `rationalRoots ${txt(rho)} ${k}`)
    for (const f of found) eq(res.roots.map(txt).includes(f), true, `the brute-force root ${f} is reported (${txt(rho)}, ${k})`)
  } else {
    eq(found.length, 0, `no small rational root where none is reported (${txt(rho)}, ${k})`)
  }
}

/* ------------------------------------------------------- closed forms quoted */
for (let n = 1; n <= 80; n++) {
  eq(txt(G.partialSum(R(1), R(2), B(n))), `${2n ** B(n) - 1n}/1`, `1 + 2 + ... + 2^${n - 1}`)
  const half = G.partialSum(R(1), R(1, 2), B(n))
  eq(txt(half), txt(G.ratSub(R(2), G.rat(1n, 2n ** B(n - 1)))), `1 + 1/2 + ... ${n} terms`)
}

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`geometric check ok — ${checks} checks (terms and sums against repeated multiplication, exact gap to the infinite sum, ratios substituted back)`)
