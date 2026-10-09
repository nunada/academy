/** Checks src/lib/irrational.ts, the engine behind the "Irrational Numbers"
 *  article's widgets (integer roots and when they are rational, arithmetic in
 *  a + b√m, digits of π, e, √2 and the golden ratio, continued fractions).
 *
 *  Each result is checked against something that does not share its code:
 *   1. Digits and continued fractions that are published and well known.
 *   2. Integer roots against exhaustive search, and the rational-or-irrational
 *      rule against the root itself (a root is rational exactly when
 *      r^k = n has an integer solution r).
 *   3. a + b√m arithmetic against floating point, plus identities that must hold
 *      exactly: conjugates multiply to a rational, division undoes
 *      multiplication, and a + b√m is rational only when b = 0.
 *
 *  Run: npm run check:irrational   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'irrational-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${q('src/lib/irrational.ts')}'\nexport { rat } from '${q('src/lib/realnum.ts')}'\nexport { roundedDecimal } from '${q('src/lib/rationals.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const X = await import('file://' + out.replace(/\\/g, '/'))

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
const R = (n, d = 1) => X.rat(B(n), B(d))
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))

/* ------------------------------------------------------- 1. published values */
const PUBLISHED = {
  pi: '3.14159265358979323846264338327950288419716939937510',
  e: '2.71828182845904523536028747135266249775724709369995',
  sqrt2: '1.41421356237309504880168872420969807856967187537694',
  phi: '1.61803398874989484820458683436563811772030917980576',
}
for (const [name, want] of Object.entries(PUBLISHED)) {
  const places = want.length - 2
  // The last place is truncated, so compare all but the last digit and allow it to be one short.
  const got = X.constantDigits(name, places)
  eq(got.slice(0, -1), want.slice(0, -1), `digits of ${name}`)
  eq(Math.abs(Number(got.slice(-1)) - Number(want.slice(-1))) <= 1, true, `last digit of ${name}`)
  eq(X.constantDigits(name, 200).slice(0, 52), want.slice(0, 52), `200 places of ${name} agree with the short run`)
}

// Continued fractions: partial quotients and convergents.
const cf = (name, terms) => {
  const v = X.constantScaled(name, 90)
  return X.continuedFraction(X.rat(v, 10n ** 90n), terms)
}
eq(cf('pi', 12).map((c) => c.quotient).join(), '3,7,15,1,292,1,1,1,2,1,3,1', 'continued fraction of pi')
eq(cf('pi', 6).map((c) => `${c.p}/${c.q}`).join(' '), '3/1 22/7 333/106 355/113 103993/33102 104348/33215', 'convergents of pi')
eq(cf('e', 12).map((c) => c.quotient).join(), '2,1,2,1,1,4,1,1,6,1,1,8', 'continued fraction of e')
eq(cf('sqrt2', 8).map((c) => c.quotient).join(), '1,2,2,2,2,2,2,2', 'continued fraction of sqrt 2')
eq(cf('phi', 8).map((c) => c.quotient).join(), '1,1,1,1,1,1,1,1', 'continued fraction of the golden ratio')
eq(cf('phi', 8).map((c) => `${c.p}/${c.q}`).join(' '), '1/1 2/1 3/2 5/3 8/5 13/8 21/13 34/21', 'convergents of phi are Fibonacci ratios')
// A convergent is the best approximation: |x − p/q| < 1/q².
for (const name of ['pi', 'e', 'sqrt2', 'phi']) {
  const v = X.constantScaled(name, 90)
  const x = X.rat(v, 10n ** 90n)
  for (const c of cf(name, 14)) {
    const diff = x.n * c.q - c.p * x.d // sign irrelevant
    const abs = diff < 0n ? -diff : diff
    eq(abs * c.q < x.d, true, `${name} convergent ${c.p}/${c.q} is within 1/q^2`)
  }
}

// Scientific notation of an error.
const sc = (n, d, digits = 3) => {
  const s = X.sci(R(n, d), digits)
  return `${s.mantissa}e${s.exp}`
}
eq(sc(1, 1000), '1.00e-3', 'sci of 1/1000')
eq(sc(22, 7).slice(0, 8), '3.14e0', 'sci of 22/7')
eq(sc(1, 3), '3.33e-1', 'sci of 1/3')
eq(sc(2, 3), '6.67e-1', 'sci of 2/3 rounds')
eq(sc(99999, 100000, 3), '1.00e0', 'sci rounding carries into the next power')
eq(sc(12345, 1, 2), '1.2e4', 'sci with two digits')
eq(sc(-5, 8), '6.25e-1', 'sci ignores the sign')

/* ------------------------------------------------------- 2. integer roots */
const rootBrute = (n, k) => {
  let r = 0n
  while ((r + 1n) ** B(k) <= n) r++
  return r
}
for (let n = 0; n <= 3000; n++) {
  for (const k of [2, 3, 4, 5]) eq(X.iroot(B(n), k), rootBrute(B(n), k), `iroot ${n} ${k}`)
}
for (let i = 0; i < 400; i++) {
  const n = B(rnd(1, 1e9)) * B(rnd(1, 1e9)) * B(rnd(1, 1e9))
  for (const k of [2, 3, 4, 5, 7]) {
    const r = X.iroot(n, k)
    eq(r ** B(k) <= n && (r + 1n) ** B(k) > n, true, `iroot ${n} ${k} brackets the root`)
  }
}
// Huge perfect powers are exact.
const hp = 123456789123456789123456789n
eq(X.iroot(hp ** 3n, 3), hp, 'iroot of a perfect cube')
eq(X.iroot(hp ** 3n - 1n, 3), hp - 1n, 'iroot one below a perfect cube')

// Rational exactly when an integer root exists; and outside^k * inside = n.
for (let n = 1; n <= 4000; n++) {
  for (const k of [2, 3, 4, 5]) {
    const c = X.rootClass(B(n), k)
    const r = rootBrute(B(n), k)
    eq(c.rational, r ** B(k) === B(n), `rootClass ${n} ${k}: rational iff an integer root exists`)
    eq(c.outside ** B(k) * c.inside, B(n), `rootClass ${n} ${k}: outside^k * inside = n`)
    if (c.rational) eq(c.outside, r, `rootClass ${n} ${k}: the root`)
    // The radicand left inside has every exponent below k.
    for (const [, e] of X.rootClass(c.inside, k).primes) eq(e < k, true, `rootClass ${n} ${k}: nothing left to take out`)
  }
}
const rc = (n, k) => {
  const c = X.rootClass(B(n), k)
  return `${c.outside}|${c.inside}|${c.rational}`
}
eq(rc(72, 2), '6|2|false', '√72 = 6√2')
eq(rc(50, 2), '5|2|false', '√50 = 5√2')
eq(rc(49, 2), '7|1|true', '√49 = 7')
eq(rc(54, 3), '3|2|false', '∛54 = 3∛2')
eq(rc(64, 3), '4|1|true', '∛64 = 4')
eq(rc(1, 2), '1|1|true', '√1 = 1')
eq(rc(16, 4), '2|1|true', '⁴√16 = 2')
eq(X.rootDigits(2n, 2, 30), '1.414213562373095048801688724209', 'digits of √2')
eq(X.rootDigits(10n, 3, 6), '2.154434', 'digits of ∛10')
eq(X.rootDigits(144n, 2, 3), '12.000', 'digits of √144')
eq(X.rootDigits(2n, 2, 0), '1', 'digits of √2 with no places')

/* ------------------------------------------------------- 3. a + b√m numbers */
const squarefree = (m) => {
  for (let k = 2; k * k <= m; k++) if (m % (k * k) === 0) return false
  return true
}
const S = (m, an, ad, bn, bd) => X.makeSurd(B(m), R(an, ad), R(bn, bd))
const show = (s) => `${s.a.n}/${s.a.d}+${s.b.n}/${s.b.d}√${s.m}`
eq(show(S(8, 3, 1, 1, 1)), '3/1+2/1√2', '3 + √8 is 3 + 2√2')
eq(show(S(9, 3, 1, 1, 1)), '6/1+0/1√1', '3 + √9 is rational')
eq(show(X.surdMul(S(2, 1, 1, 1, 1), S(2, 1, 1, -1, 1))), '-1/1+0/1√1', '(1+√2)(1−√2) = −1')
eq(show(X.surdMul(S(2, 0, 1, 1, 1), S(2, 0, 1, 1, 1))), '2/1+0/1√1', '√2·√2 = 2')
eq(show(X.surdAdd(S(2, 0, 1, 1, 1), S(2, 0, 1, -1, 1))), '0/1+0/1√1', '√2 + (−√2) = 0')
eq(show(X.surdMul(S(5, 1, 2, 1, 2), S(5, 1, 2, 1, 2))), '3/2+1/2√5', 'φ² = φ + 1')
eq(show(X.surdDiv(S(2, 1, 1, 1, 1), S(2, 1, 1, -1, 1))), '-3/1+-2/1√2', '(1+√2)/(1−√2) = −3 − 2√2')
eq(show(X.surdDiv(S(3, 1, 1, 0, 1), S(3, 0, 1, 1, 1))), '0/1+1/3√3', '1/√3 = √3/3')
eq(X.surdApprox(S(2, 0, 1, 1, 1), 10), '1.4142135624', '√2 to 10 places')
eq(X.surdApprox(S(5, 1, 2, 1, 2), 8), '1.61803399', 'φ to 8 places')
eq(X.surdApprox(S(2, 0, 1, -1, 1), 4), '-1.4142', 'negative surd')
eq(X.surdApprox(S(2, 1, 1, -1, 1), 3), '-0.414', '1 − √2 to 3 places')
let threw = false
try {
  X.surdDiv(S(2, 1, 1, 1, 1), S(2, 0, 1, 0, 1))
} catch {
  threw = true
}
eq(threw, true, 'division by zero throws')
threw = false
try {
  X.surdAdd(S(2, 0, 1, 1, 1), S(3, 0, 1, 1, 1))
} catch {
  threw = true
}
eq(threw, true, 'the sum of √2 and √3 is not in the field a + b√m')

const val = (s) => Number(s.a.n) / Number(s.a.d) + (Number(s.b.n) / Number(s.b.d)) * Math.sqrt(Number(s.m))
const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
let irrationalSeen = 0
for (let i = 0; i < 4000; i++) {
  let m = rnd(2, 120)
  const x = S(m, rnd(-9, 9), rnd(1, 6), rnd(-9, 9), rnd(1, 6))
  const y = S(m, rnd(-9, 9), rnd(1, 6), rnd(-9, 9), rnd(1, 6))
  if (x.m !== 1n) eq(squarefree(Number(x.m)), true, `makeSurd gives a squarefree radicand for ${m}`)
  eq(near(val(X.surdAdd(x, y)), val(x) + val(y)), true, `add ${show(x)} ${show(y)}`)
  eq(near(val(X.surdSub(x, y)), val(x) - val(y)), true, `sub ${show(x)} ${show(y)}`)
  eq(near(val(X.surdMul(x, y)), val(x) * val(y)), true, `mul ${show(x)} ${show(y)}`)
  const yZero = y.a.n === 0n && y.b.n === 0n
  if (!yZero) {
    const d = X.surdDiv(x, y)
    eq(near(val(d), val(x) / val(y)), true, `div ${show(x)} ${show(y)}`)
    eq(show(X.surdMul(d, y)), show(x), `div then mul ${show(x)} ${show(y)}`)
  }
  // A number times its conjugate is rational.
  const conj = { m: x.m, a: x.a, b: X.rat(-x.b.n, x.b.d) }
  eq(X.surdIsRational(X.surdMul(x, conj)), true, `conjugate product of ${show(x)} is rational`)
  // Rational exactly when b = 0 (the representation is canonical).
  eq(X.surdIsRational(x), x.b.n === 0n, `rational iff b = 0 for ${show(x)}`)
  if (x.m !== 1n && x.b.n !== 0n) {
    irrationalSeen++
    // Adding a rational keeps it irrational; so does a non-zero rational multiple.
    eq(X.surdIsRational(X.surdAdd(x, S(1, 3, 1, 0, 1))), false, `irrational + rational is irrational: ${show(x)}`)
    eq(X.surdIsRational(X.surdMul(x, S(1, 2, 3, 0, 1))), false, `rational x irrational is irrational: ${show(x)}`)
  }
}
eq(irrationalSeen > 2500, true, 'enough irrational values were exercised')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`irrational check ok — ${checks} checks (published digits and convergents, exhaustive roots, a + b√m against floats and identities)`)
