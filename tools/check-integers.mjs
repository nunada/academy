/** Checks src/lib/integers.ts, the engine behind the "Integers" article's
 *  widgets (the three division conventions, divisibility rules, factorisation,
 *  gcd and lcm).
 *
 *  Each result is checked against something that does not share its code:
 *   1. Hand-written answers, including the cases where Python and JavaScript
 *      disagree about negative operands.
 *   2. The same operations done with JavaScript's own number operators on small
 *      values (Math.floor, %), and with brute force (trial division, listing
 *      every divisor) on small numbers.
 *   3. The divisibility rules against `%`, on random numbers of up to 30 digits.
 *
 *  Run: npm run check:integers   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'integers-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(entry, `export * from '${path.join(ROOT, 'src/lib/integers.ts').replace(/\\/g, '/')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const I = await import('file://' + out.replace(/\\/g, '/'))

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

/* ------------------------------------------------------------------ 1. known */
// [a, b, euclid q r, floor q r, trunc q r]: the table in the article.
const KNOWN = [
  [7, 3, [2, 1], [2, 1], [2, 1]],
  [-7, 3, [-3, 2], [-3, 2], [-2, -1]],
  [7, -3, [-2, 1], [-3, -2], [-2, 1]],
  [-7, -3, [3, 2], [2, -1], [2, -1]],
  [6, 3, [2, 0], [2, 0], [2, 0]],
  [-6, 3, [-2, 0], [-2, 0], [-2, 0]],
  [0, 5, [0, 0], [0, 0], [0, 0]],
  [5, 7, [0, 5], [0, 5], [0, 5]],
  [-5, 7, [-1, 2], [-1, 2], [0, -5]],
]
for (const [a, b, e, f, t] of KNOWN) {
  const d = I.divmods(B(a), B(b))
  for (const [name, got, want] of [['euclid', d.euclid, e], ['floor', d.floor, f], ['trunc', d.trunc, t]]) {
    eq(`${got.q} ${got.r}`, `${want[0]} ${want[1]}`, `${name} ${a} by ${b}`)
  }
}

const g = (a, b) => I.gcd(B(a), B(b)).toString()
eq(g(48, 18), '6', 'gcd 48 18')
eq(g(17, 5), '1', 'gcd 17 5')
eq(g(0, 9), '9', 'gcd 0 9')
eq(g(-12, 18), '6', 'gcd -12 18')
eq(I.lcm(4n, 6n).toString(), '12', 'lcm 4 6')
eq(I.lcm(-4n, 6n).toString(), '12', 'lcm -4 6')
eq(I.lcm(0n, 6n).toString(), '0', 'lcm 0 6')
eq(JSON.stringify(I.euclidRows(48n, 18n).map((r) => [r.a, r.b, r.q, r.r].join(','))), JSON.stringify(['48,18,2,12', '18,12,1,6', '12,6,2,0']), 'euclid rows 48 18')

const fac = (n) => I.factorize(B(n)).map(([p, e]) => `${p}^${e}`).join(' ')
eq(fac(72), '2^3 3^2', 'factorize 72')
eq(fac(97), '97^1', 'factorize 97')
eq(fac(1001), '7^1 11^1 13^1', 'factorize 1001')
eq(fac(999999999989), '999999999989^1', 'factorize the largest prime below 10^12')
eq(I.isPrime(1n), false, 'isPrime 1')
eq(I.isPrime(2n), true, 'isPrime 2')
eq(I.isPrime(561n), false, 'isPrime 561 (Carmichael)')
eq(I.divisorsOf(36n).join(','), '1,2,3,4,6,9,12,18,36', 'divisors of 36')
eq(I.divisorsOf(1n).join(','), '1', 'divisors of 1')
eq(I.divisionLadder(72n).map((s) => `${s.p}:${s.from}>${s.to}`).join(' '), '2:72>36 2:36>18 2:18>9 3:9>3 3:3>1', 'ladder 72')

const P = (s) => I.parseInteger(s)
eq(String(P('-42')), '-42', 'parse -42')
eq(String(P('−42')), '-42', 'parse real minus')
eq(String(P('1.000.000')), '1000000', 'parse dotted thousands')
eq(String(P('1,000')), '1000', 'parse comma thousands')
eq(String(P('+7')), '7', 'parse +7')
eq(P('4.5'), null, 'parse 4.5')
eq(P('12a'), null, 'parse 12a')
eq(P(''), null, 'parse empty')
eq(P('1'.repeat(31)), null, 'parse too long')

/* ------------------------------------------------- 2. against number operators */
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
for (let i = 0; i < 4000; i++) {
  const a = rnd(-200, 200)
  let b = rnd(-30, 30)
  if (b === 0) b = 1
  const d = I.divmods(B(a), B(b))
  // The three conventions against the language operators.
  eq(Number(d.trunc.r), a % b === 0 ? 0 : a % b, `trunc rem ${a} ${b}`)
  eq(Number(d.trunc.q), Math.trunc(a / b), `trunc quo ${a} ${b}`)
  eq(Number(d.floor.q), Math.floor(a / b), `floor quo ${a} ${b}`)
  // Invariants every convention must satisfy.
  for (const [name, c] of [['euclid', d.euclid], ['floor', d.floor], ['trunc', d.trunc]]) {
    eq(B(b) * c.q + c.r, B(a), `${name} identity ${a} ${b}`)
  }
  eq(d.euclid.r >= 0n && d.euclid.r < B(Math.abs(b)), true, `euclid range ${a} ${b}`)
  const fr = d.floor.r
  eq(fr === 0n || (fr < 0n) === (b < 0), true, `floor remainder sign ${a} ${b}`)
  eq(d.trunc.r === 0n || (d.trunc.r < 0n) === (a < 0), true, `trunc remainder sign ${a} ${b}`)
  eq(Math.abs(Number(fr)) < Math.abs(b), true, `floor remainder size ${a} ${b}`)
}

// gcd and lcm against listing the divisors, and Euclid's rows against gcd.
for (let i = 0; i < 1500; i++) {
  const a = rnd(1, 400)
  const b = rnd(1, 400)
  let want = 1
  for (let k = 1; k <= Math.min(a, b); k++) if (a % k === 0 && b % k === 0) want = k
  eq(Number(I.gcd(B(a), B(b))), want, `gcd ${a} ${b}`)
  eq(Number(I.lcm(B(a), B(b))), (a * b) / want, `lcm ${a} ${b}`)
  const rows = I.euclidRows(B(a), B(b))
  eq(Number(rows[rows.length - 1].b), want, `euclid last row ${a} ${b}`)
  for (const r of rows) eq(r.b * r.q + r.r, r.a, `euclid row identity ${a} ${b}`)
}

// Factorisation and divisors against brute force.
for (let n = 1; n <= 2500; n++) {
  const f = I.factorize(B(n))
  eq(f.reduce((p, [q, e]) => p * q ** B(e), 1n), B(n), `factorisation multiplies back ${n}`)
  const divs = []
  for (let k = 1; k <= n; k++) if (n % k === 0) divs.push(k)
  eq(I.divisorsOf(B(n)).join(','), divs.join(','), `divisors of ${n}`)
  eq(I.isPrime(B(n)), n > 1 && divs.length === 2, `isPrime ${n}`)
  for (const [p] of f) eq(I.isPrime(p), true, `factor ${p} of ${n} is prime`)
}

/* ---------------------------------------------------- 3. divisibility rules */
const rdig = (len) => {
  let s = String(rnd(1, 9))
  for (let i = 1; i < len; i++) s += rnd(0, 9)
  return s
}
const KS = [2, 3, 4, 5, 6, 8, 9, 10, 11]
let trueRules = 0
for (let i = 0; i < 6000; i++) {
  let n = B(rdig(rnd(1, 30)))
  // Steer a share of the samples into multiples, or the "yes" side is rarely seen.
  if (i % 3 === 0) n = n * B(KS[i % KS.length])
  if (i % 2 === 0) n = -n
  const rules = I.divisibilityRules(n)
  eq(rules.map((r) => r.k).join(','), KS.join(','), 'rule list')
  for (const r of rules) {
    const real = n % B(r.k) === 0n
    if (real) trueRules++
    eq(r.holds, real, `rule for ${r.k} on ${n}`)
  }
}
eq(trueRules > 4000, true, 'enough multiples were exercised')
eq(I.digitSum(-1234n), 10, 'digit sum')
eq(I.alternatingSum(121n), 0, 'alternating sum 121')
eq(I.alternatingSum(918082n), 2 - 8 + 0 - 8 + 1 - 9, 'alternating sum 918082')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`integers check ok — ${checks} checks (hand-written answers, number operators, brute force, divisibility rules against %)`)
