/** Checks src/lib/powers.ts, which the "Exponents and Radicals" article's widgets
 *  rely on to say that two expressions are *equal* — exactly, not to 15 digits.
 *
 *  Each function is checked two ways: against answers written down by hand, and
 *  against floating-point arithmetic over thousands of inputs (the independent
 *  check: a double is only good to about 15 digits, but an exact answer that is
 *  wrong is wrong by much more than that).
 *
 *  Run: npm run check:powers   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'powers-'))
const out = path.join(tmp, 'p.mjs')
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${q('src/lib/powers.ts')}'\nexport { rat, parseRational, ratText } from '${q('src/lib/realnum.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const P = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const close = (a, b) => Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(a), Math.abs(b))
const num = (r) => Number(r.n) / Number(r.d)

/* ------------------------------------------------------------ simplifyRoot */
const KNOWN_ROOTS = [
  [72, 2, 6, 2],
  [50, 2, 5, 2],
  [200, 2, 10, 2],
  [18, 2, 3, 2],
  [8, 2, 2, 2],
  [12, 2, 2, 3],
  [48, 2, 4, 3],
  [16, 2, 4, 1],
  [17, 2, 1, 17],
  [1, 2, 1, 1],
  [54, 3, 3, 2],
  [1000, 3, 10, 1],
  [24, 3, 2, 3],
  [16, 4, 2, 1],
  [32, 5, 2, 1],
  [64, 6, 2, 1],
  [72, 3, 2, 9],
]
for (const [n, k, o, i] of KNOWN_ROOTS) {
  checks++
  const r = P.simplifyRoot(BigInt(n), k)
  if (r.out !== BigInt(o) || r.inside !== BigInt(i)) fail(`simplifyRoot(${n}, ${k}) = ${r.out}, ${r.inside}; want ${o}, ${i}`)
}
for (let n = 1; n <= 5000; n++) {
  for (let k = 2; k <= 6; k++) {
    checks++
    const { out: o, inside: i, factors } = P.simplifyRoot(BigInt(n), k)
    if (o ** BigInt(k) * i !== BigInt(n)) fail(`simplifyRoot(${n}, ${k}): ${o}^${k} * ${i} != ${n}`)
    // Nothing left to take out: no prime appears k or more times inside.
    for (const [p, e] of P_factor(i)) if (e >= k) fail(`simplifyRoot(${n}, ${k}): inside ${i} still holds ${p}^${e}`)
    if (!close(Number(o) * Number(i) ** (1 / k), n ** (1 / k))) fail(`simplifyRoot(${n}, ${k}): ${o}·root(${i}) is not root(${n})`)
    void factors
  }
}
/** Independent trial-division factoriser, so the check does not lean on the one under test. */
function P_factor(n) {
  const out = []
  let x = Number(n)
  for (let p = 2; p * p <= x; p++) {
    let e = 0
    while (x % p === 0) {
      x /= p
      e++
    }
    if (e) out.push([p, e])
  }
  if (x > 1) out.push([x, 1])
  return out
}

/* ------------------------------------------------------------------ ratPow */
const R = (s) => P.parseRational(s)
const POW = [
  ['2', 10, '1024'],
  ['2', -3, '1/8'],
  ['2', 0, '1'],
  ['-3', 2, '9'],
  ['-3', 3, '-27'],
  ['-2', -3, '-1/8'],
  ['2/3', 2, '4/9'],
  ['2/3', -2, '9/4'],
  ['5', -1, '1/5'],
  ['1/2', -4, '16'],
]
for (const [b, e, want] of POW) {
  checks++
  const r = P.ratPow(R(b), e)
  if (!r || P.ratText(r) !== want) fail(`ratPow(${b}, ${e}) = ${r && P.ratText(r)}; want ${want}`)
}
checks += 3
if (P.ratPow(R('0'), -1) !== null) fail('ratPow(0, -1) should be undefined')
if (P.ratPow(R('0'), 0) !== null) fail('ratPow(0, 0) should be undefined here')
if (P.ratPow(R('0'), 3) === null || P.ratText(P.ratPow(R('0'), 3)) !== '0') fail('ratPow(0, 3) should be 0')
for (let a = -9; a <= 9; a++)
  for (let b = 1; b <= 9; b++)
    for (let e = -6; e <= 6; e++) {
      if (a === 0 && e <= 0) continue
      checks++
      const r = P.ratPow(P.rat(BigInt(a), BigInt(b)), e)
      if (!r || !close(num(r), (a / b) ** e)) fail(`ratPow(${a}/${b}, ${e}) disagrees with floating point`)
    }
// The five laws, exactly, over a grid: if any identity fails the widget lies.
for (const a of ['2', '3', '-2', '2/3', '5', '1/2'])
  for (const b of ['3', '4', '-5', '3/2'])
    for (let m = -4; m <= 4; m++)
      for (let n = -4; n <= 4; n++) {
        const A = R(a)
        const B = R(b)
        const eq = (x, y, what) => {
          checks++
          if (x === null || y === null || P.ratText(x) !== P.ratText(y)) fail(`${what}: a=${a} b=${b} m=${m} n=${n}`)
        }
        const mul = (x, y) => P.rat(x.n * y.n, x.d * y.d)
        eq(mul(P.ratPow(A, m), P.ratPow(A, n)), P.ratPow(A, m + n), 'product law')
        eq(mul(P.ratPow(A, m), P.ratPow(A, -n)), P.ratPow(A, m - n), 'quotient law')
        eq(P.ratPow(P.ratPow(A, m), n), P.ratPow(A, m * n), 'power of a power')
        eq(P.ratPow(mul(A, B), n), mul(P.ratPow(A, n), P.ratPow(B, n)), 'power of a product')
        eq(P.ratPow(mul(A, P.rat(B.d, B.n)), n), mul(P.ratPow(A, n), P.ratPow(P.rat(B.d, B.n), n)), 'power of a quotient')
      }

/* ------------------------------------------------------------ rationalising */
for (let a = 1; a <= 40; a++)
  for (let b = 1; b <= 200; b++) {
    checks++
    const s = P.rationaliseSimple(BigInt(a), BigInt(b))
    if (!close(num(s.coef) * Math.sqrt(Number(s.rad)), a / Math.sqrt(b))) fail(`rationaliseSimple(${a}, ${b})`)
    const { out: _o, inside } = P.simplifyRoot(s.rad, 2)
    if (inside !== s.rad) fail(`rationaliseSimple(${a}, ${b}): radicand ${s.rad} is not square-free`)
  }
const RS = P.rationaliseSimple
if (P.ratText(RS(6n, 3n).coef) !== '2' || RS(6n, 3n).rad !== 3n) fail('6/√3 should be 2√3')
if (P.ratText(RS(1n, 2n).coef) !== '1/2' || RS(1n, 2n).rad !== 2n) fail('1/√2 should be √2/2')
checks += 2
for (let a = -8; a <= 8; a++) {
  if (a === 0) continue
  for (let p = -9; p <= 9; p++)
    for (const sign of [1, -1])
      for (let qq = 1; qq <= 60; qq++) {
        checks++
        const r = P.rationaliseConjugate(BigInt(a), BigInt(p), sign, BigInt(qq))
        const denom = p + sign * Math.sqrt(qq)
        if (Math.abs(denom) < 1e-9) {
          if (r !== null) fail(`rationaliseConjugate(${a}, ${p}, ${sign}, ${qq}) should be undefined`)
          continue
        }
        if (r === null) {
          fail(`rationaliseConjugate(${a}, ${p}, ${sign}, ${qq}) should not be undefined`)
          continue
        }
        const got = num(r.rational) + num(r.irrational) * Math.sqrt(Number(r.rad))
        if (!close(got, a / denom)) fail(`rationaliseConjugate(${a}, ${p}, ${sign}, ${qq}): ${got} vs ${a / denom}`)
      }
}

/* ------------------------------------------------------- scientific notation */
const SCI = [
  ['45000', '4.5', 4],
  ['0.00045', '4.5', -4],
  ['123.45', '1.2345', 2],
  ['1', '1', 0],
  ['10', '1', 1],
  ['0.1', '1', -1],
  ['100.5', '1.005', 2],
  ['0,0203', '2.03', -2],
  ['299792458', '2.99792458', 8],
  ['602214076000000000000000', '6.02214076', 23],
]
for (const [s, m, e] of SCI) {
  checks++
  const r = P.toScientific(s)
  if (!r || r.mantissa !== m || r.exponent !== e) fail(`toScientific(${s}) = ${r && r.mantissa}e${r && r.exponent}; want ${m}e${e}`)
}
checks += 3
if (P.toScientific('0') !== null || P.toScientific('0.000') !== null || P.toScientific('abc') !== null) fail('toScientific should refuse zero and non-numbers')
if (P.toScientific('-0.0203')?.negative !== true) fail('toScientific should keep the sign')
const BACK = [
  ['4.5', 4, '45000'],
  ['4.5', -4, '0.00045'],
  ['1.2345', 2, '123.45'],
  ['7', 0, '7'],
  ['9.99', 1, '99.9'],
  ['1', -1, '0.1'],
  ['-2.03', -2, '-0.0203'],
]
for (const [m, e, want] of BACK) {
  checks++
  const r = P.fromScientific(m, e)
  if (r !== want) fail(`fromScientific(${m}, ${e}) = ${r}; want ${want}`)
}
let seed = 987
const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
for (let i = 0; i < 20000; i++) {
  const intLen = Math.floor(rand() * 6)
  const fracLen = Math.floor(rand() * 6)
  const d = (n) => Array.from({ length: n }, () => Math.floor(rand() * 10)).join('')
  const s = `${rand() < 0.3 ? '-' : ''}${d(intLen) || (fracLen ? '' : '0')}${fracLen ? '.' + d(fracLen) : ''}`
  const sci = P.toScientific(s)
  if (!sci) {
    if (Number(s) !== 0 && !Number.isNaN(Number(s))) fail(`toScientific(${s}) returned null for a non-zero number`)
    continue
  }
  checks++
  const back = P.fromScientific((sci.negative ? '-' : '') + sci.mantissa, sci.exponent)
  if (back === null || Number(back) !== Number(s)) fail(`round trip ${s} → ${sci.mantissa}e${sci.exponent} → ${back}`)
  if (!/^[1-9](\.\d*[1-9])?$/.test(sci.mantissa)) fail(`mantissa ${sci.mantissa} of ${s} is not in [1, 10) in lowest form`)
}

if (bad) {
  console.error(`\n${bad} problem(s)`)
  process.exit(1)
}
console.log(`powers check ok — ${checks} checks (hand-written values, floating-point cross-checks, the five laws, round trips)`)
