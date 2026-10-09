/** Checks src/lib/rationals.ts, the engine behind the "Rational Numbers"
 *  article's widgets (simplify, compare, the four operations, mixed numbers,
 *  terminating and repeating decimals).
 *
 *  Each result is checked against something that does not share its code:
 *   1. Hand-written answers, including the ones the article prints.
 *   2. The four operations against floating-point arithmetic on small values,
 *      and the invariants of a fraction in lowest terms.
 *   3. The number theory of decimals (when one ends, how long the lead-in and the
 *      repeating block are) against long division, which `realnum.expand` does
 *      by simulating the remainders and shares none of the theory.
 *
 *  Run: npm run check:rationals   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rationals-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${q('src/lib/rationals.ts')}'\nexport { expand } from '${q('src/lib/realnum.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const R = await import('file://' + out.replace(/\\/g, '/'))

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
const txt = (r) => `${r.n}/${r.d}`
const F = (n, d) => R.rat(B(n), B(d))

/* ------------------------------------------------------------------ 1. known */
const pf = (s) => {
  const f = R.parseFrac(s)
  return f === null || f === 'zero' ? String(f) : `${f.n}/${f.d}`
}
eq(pf('6/8'), '6/8', 'parse keeps 6/8 unreduced')
eq(pf('6/-8'), '-6/8', 'parse moves the sign to the top')
eq(pf('-6/-8'), '6/8', 'parse two minus signs')
eq(pf('−6/8'), '-6/8', 'parse real minus')
eq(pf(' 7 '), '7/1', 'parse a whole number')
eq(pf('3/0'), 'zero', 'parse zero denominator')
eq(pf('3/'), 'null', 'parse missing denominator')
eq(pf('1.5'), 'null', 'parse a decimal is not a fraction here')
eq(pf('1'.repeat(16)), 'null', 'parse too long')

eq(txt(R.rat(84n, 126n)), '2/3', '84/126')
eq(txt(R.ratAdd(F(2, 3), F(3, 4))), '17/12', '2/3 + 3/4')
eq(txt(R.ratSub(F(1, 2), F(3, 4))), '-1/4', '1/2 - 3/4')
eq(txt(R.ratMul(F(3, 4), F(2, 3))), '1/2', '3/4 * 2/3')
eq(txt(R.ratDiv(F(3, 4), F(9, 10))), '5/6', '3/4 / 9/10')
eq(txt(R.ratDiv(F(-3, 4), F(-9, 10))), '5/6', '(-3/4) / (-9/10)')
eq(txt(R.ratDiv(F(1, 2), F(-1, 4))), '-2/1', '1/2 / (-1/4)')
let threw = false
try {
  R.ratDiv(F(1, 2), F(0, 1))
} catch {
  threw = true
}
eq(threw, true, 'division by zero throws')

const mx = (n, d) => {
  const m = R.mixed(F(n, d))
  return `${m.negative ? '-' : ''}${m.whole} ${m.rem}/${m.d}`
}
eq(mx(17, 5), '3 2/5', '17/5 as mixed')
eq(mx(-7, 2), '-3 1/2', '-7/2 as mixed')
eq(mx(3, 4), '0 3/4', '3/4 as mixed')
eq(mx(6, 3), '2 0/1', '6/3 as mixed')

const oc = R.overCommon({ n: 2n, d: 3n }, { n: 3n, d: 4n })
eq(`${oc.l} ${oc.na} ${oc.nc} ${oc.fa} ${oc.fc}`, '12 8 9 4 3', 'common denominator of 2/3 and 3/4')
const oc2 = R.overCommon({ n: 1n, d: 6n }, { n: 1n, d: 4n })
eq(`${oc2.l} ${oc2.na} ${oc2.nc}`, '12 2 3', 'common denominator uses the least common multiple')

const ti = (n, d) => {
  const t = R.termInfo(F(n, d))
  return `${t.terminates} ${t.pre} ${t.period}`
}
eq(ti(1, 2), 'true 1 0', '1/2 ends after 1 digit')
eq(ti(3, 8), 'true 3 0', '3/8 ends after 3 digits')
eq(ti(1, 3), 'false 0 1', '1/3 repeats one digit')
eq(ti(1, 6), 'false 1 1', '1/6 = 0.1(6)')
eq(ti(1, 7), 'false 0 6', '1/7 has period 6')
eq(ti(1, 12), 'false 2 1', '1/12 = 0.08(3)')
eq(ti(1, 13), 'false 0 6', '1/13 has period 6')
eq(ti(1, 17), 'false 0 16', '1/17 has period 16')
eq(ti(1, 97), 'false 0 96', '1/97 has period 96')
eq(ti(6, 4), 'true 1 0', '6/4 = 3/2 is lowest-terms first')
eq(ti(5, 1), 'true 0 0', 'an integer ends at once')

const rd = (n, d, p) => R.roundedDecimal(F(n, d), p)
eq(rd(1, 3, 2), '0.33', '1/3 to 2 places')
eq(rd(2, 3, 2), '0.67', '2/3 to 2 places')
eq(rd(-2, 3, 2), '-0.67', '-2/3 to 2 places')
eq(rd(1, 8, 2), '0.13', '1/8 to 2 places rounds half up')
eq(rd(-1, 1000, 2), '0.00', 'a tiny negative does not print a minus zero')
eq(rd(7, 2, 0), '4', '7/2 to 0 places')
eq(rd(75, 1, 1), '75.0', 'a whole number keeps the places')

/* ----------------------------------------- 2. operations against float maths */
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
for (let i = 0; i < 5000; i++) {
  const an = rnd(-40, 40)
  const ad = rnd(1, 40)
  const cn = rnd(-40, 40)
  const cd = rnd(1, 40)
  const a = F(an, ad)
  const c = F(cn, cd)
  const x = an / ad
  const y = cn / cd
  const val = (r) => Number(r.n) / Number(r.d)
  for (const [name, r, want] of [['add', R.ratAdd(a, c), x + y], ['sub', R.ratSub(a, c), x - y], ['mul', R.ratMul(a, c), x * y]]) {
    eq(near(val(r), want), true, `${name} ${an}/${ad} ${cn}/${cd}`)
    eq(R.gcd(r.n, r.d) === 1n || r.n === 0n, true, `${name} is in lowest terms`)
    eq(r.d > 0n, true, `${name} keeps a positive denominator`)
  }
  if (cn !== 0) {
    const r = R.ratDiv(a, c)
    eq(near(val(r), x / y), true, `div ${an}/${ad} ${cn}/${cd}`)
    // Dividing then multiplying back must return the start.
    eq(txt(R.ratMul(r, c)), txt(a), `div then mul ${an}/${ad} ${cn}/${cd}`)
  }
  eq(Math.sign(R.ratCmp(a, c)), Math.sign(x - y), `compare ${an}/${ad} ${cn}/${cd}`)
  // The common-denominator form must add to the same value.
  const o = R.overCommon({ n: B(an), d: B(ad) }, { n: B(cn), d: B(cd) })
  eq(txt(R.rat(o.na + o.nc, o.l)), txt(R.ratAdd(a, c)), `common denominator ${an}/${ad} ${cn}/${cd}`)
  // A mixed number rebuilds the fraction.
  const m = R.mixed(a)
  const back = R.rat((m.negative ? -1n : 1n) * (m.whole * m.d + m.rem), m.d)
  eq(txt(back), txt(a), `mixed number rebuilds ${an}/${ad}`)
  eq(m.rem >= 0n && m.rem < m.d, true, `mixed remainder in range ${an}/${ad}`)
}

/* ----------------------------------------- 3. decimals against long division */
let repeating = 0
for (let d = 1; d <= 400; d++) {
  for (let n = 1; n <= 30; n++) {
    const r = F(n, d)
    const t = R.termInfo(r)
    const e = R.expand(r.n, r.d, 2000)
    eq(t.terminates, e.terminating, `ends? ${n}/${d}`)
    eq(t.pre, e.pre.length, `lead-in of ${n}/${d}`)
    eq(t.period, e.rep.length, `period of ${n}/${d}`)
    if (!e.terminating) repeating++
  }
}
eq(repeating > 3000, true, 'enough repeating decimals were exercised')
// A long period against a long run of the division itself.
const big = R.termInfo(F(1, 9973))
eq(big.period, R.expand(1n, 9973n, 20000).rep.length, 'period of 1/9973')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`rationals check ok — ${checks} checks (hand-written answers, float arithmetic, long division against the number theory)`)
