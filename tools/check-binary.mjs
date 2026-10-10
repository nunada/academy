/** Checks src/lib/binary.ts, the engine behind the "Binary Numbers" article's
 *  widgets (base conversion, two's complement, bitwise operators, column
 *  arithmetic, expansions of fractions in a base).
 *
 *  The engine writes its conversions out by hand (repeated division, place
 *  value), so each one is compared with something it does not share code with:
 *   1. The language's own conversions: BigInt toString(radix) and parsing, and
 *      BigInt.asUintN / asIntN for two's complement.
 *   2. The language's own operators for the bitwise functions, and a direct
 *      replay of the column rules for addition, subtraction and multiplication.
 *   3. Expansions of fractions: rebuilt exactly into the original fraction, the
 *      terminates-or-repeats theory checked against the long multiplication, and
 *      base 10 compared with the decimal expansion in realnum.ts.
 *
 *  Run: npm run check:binary   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'binary-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${q('src/lib/binary.ts')}'\nexport { rat, expand } from '${q('src/lib/realnum.ts')}'`)
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
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const bigRand = (bits) => {
  let v = 0n
  for (let i = 0; i < bits; i += 30) v = (v << 30n) | B(rnd(0, 2 ** 30 - 1))
  return v & ((1n << B(bits)) - 1n)
}

/* ------------------------------------------------------------------ 1. known */
eq(X.toBase(10n, 2), '1010', '10 in binary')
eq(X.toBase(255n, 2), '11111111', '255 in binary')
eq(X.toBase(255n, 16), 'ff', '255 in hex')
eq(X.toBase(0n, 2), '0', '0 in binary')
eq(X.toBase(-5n, 2), '-101', '-5 in binary')
eq(X.toBase(64n, 8), '100', '64 in octal')
eq(String(X.parseBase('1010', 2)), '10', 'parse 1010')
eq(String(X.parseBase('0b1111_0000', 2)), '240', 'parse with prefix and underscore')
eq(String(X.parseBase('FF', 16)), '255', 'parse FF')
eq(String(X.parseBase('0xff', 16)), '255', 'parse 0xff')
eq(String(X.parseBase('-101', 2)), '-5', 'parse negative')
eq(X.parseBase('102', 2), null, 'parse a bad binary digit')
eq(X.parseBase('', 2), null, 'parse nothing')
eq(X.parseBase('1'.repeat(65), 2), null, 'parse too long')
eq(X.divisionSteps(13n, 2).map((r) => `${r.n}/${r.q}/${r.r}`).join(' '), '13/6/1 6/3/0 3/1/1 1/0/1', 'ladder for 13')
eq(X.group('11010110', 4), '1101 0110', 'group in fours')
eq(X.group('1101011', 4), '110 1011', 'group from the right')
eq(X.placeTerms('1101', 2).map((t) => t.value).join(), '8,4,0,1', 'place values of 1101')
eq(X.bitLength(255n), 8, 'bit length 255')
eq(X.bitLength(256n), 9, 'bit length 256')
eq(X.toTwos(-5n, 8), '11111011', '-5 in 8-bit two’s complement')
eq(X.toTwos(127n, 8), '01111111', '127 in 8 bits')
eq(X.toTwos(-128n, 8), '10000000', '-128 in 8 bits')
eq(X.toTwos(128n, 8), null, '128 does not fit in 8 bits signed')
eq(X.toTwos(-129n, 8), null, '-129 does not fit')
eq(String(X.fromTwos('11111011')), '-5', 'read 11111011')
eq(String(X.fromTwos('10000000')), '-128', 'read 10000000')
eq(String(X.fromTwos('0101')), '5', 'read 0101')
eq(X.asciiLabel(65).text, 'A', 'ASCII 65')
eq(X.asciiLabel(10).text, 'LF', 'ASCII 10')
eq(X.asciiLabel(127).text, 'DEL', 'ASCII 127')
eq(X.asciiLabel(200), null, 'ASCII 200')
const col = X.addColumns('1011', '110')
eq(`${col.a} ${col.b} ${col.carries} ${col.result}`, '01011 00110 11100 10001', '1011 + 110')
const sub = X.subColumns('1011', '110')
eq(`${sub.a} ${sub.b} ${sub.carries} ${sub.result}`, '1011 0110 1000 0101', '1011 − 110')
eq(X.mulPartials('101', '11').map((p) => p.text).join(' '), '101 1010', '101 × 11')
const fx = (n, d, base, limit) => {
  const e = X.expandBase(X.rat(B(n), B(d)), base, limit)
  return `${e.whole}.${e.pre}(${e.rep})${e.terminating ? 'T' : ''}`
}
eq(fx(1, 10, 2), '0.0(0011)', '0.1 in binary')
eq(fx(1, 3, 2), '0.(01)', '1/3 in binary')
eq(fx(3, 8, 2), '0.011()T', '3/8 in binary')
eq(fx(1, 5, 2), '0.(0011)', '1/5 in binary')
eq(fx(5, 4, 2), '1.01()T', '5/4 in binary')
eq(fx(1, 3, 16), '0.(5)', '1/3 in hex')
eq(fx(1, 16, 16), '0.1()T', '1/16 in hex')
eq(X.terminatesInBase(X.rat(3n, 8n), 2), true, '3/8 terminates in base 2')
eq(X.terminatesInBase(X.rat(1n, 10n), 2), false, '1/10 repeats in base 2')
eq(X.terminatesInBase(X.rat(1n, 10n), 10), true, '1/10 terminates in base 10')
eq(X.terminatesInBase(X.rat(1n, 6n), 12), true, '1/6 terminates in base 12')

/* ------------------------------------------------ 2. against the language itself */
for (let i = 0; i < 3000; i++) {
  const n = bigRand(rnd(1, 200))
  for (const base of [2, 3, 7, 8, 10, 16, 36]) {
    const s = X.toBase(n, base)
    eq(s, n.toString(base), `toBase ${n} ${base}`)
    eq(X.parseBase(s, base, 400), n, `parseBase round trip ${s} ${base}`)
  }
  eq(X.toBase(-n, 2), n === 0n ? '0' : '-' + n.toString(2), `toBase negative ${n}`)
  const steps = X.divisionSteps(n, 2)
  eq(steps.map((r) => r.r).reverse().join('') || '0', n.toString(2), `ladder digits ${n}`)
  eq(X.placeTerms(n.toString(2), 2).reduce((s, t) => s + t.value, 0n), n, `place values add up ${n}`)
  eq(X.bitLength(n), n === 0n ? 0 : n.toString(2).length, `bitLength ${n}`)
}

// Two's complement against asUintN / asIntN.
for (const bits of [4, 8, 16, 32, 64]) {
  for (let i = 0; i < 400; i++) {
    const half = 1n << B(bits - 1)
    const n = bigRand(bits) - half
    const t = X.toTwos(n, bits)
    eq(t, BigInt.asUintN(bits, n).toString(2).padStart(bits, '0'), `toTwos ${n} ${bits}`)
    eq(X.fromTwos(t), n, `fromTwos round trip ${n} ${bits}`)
    eq(X.fromTwos(t), BigInt.asIntN(bits, BigInt('0b' + t)), `fromTwos vs asIntN ${t}`)
    eq(X.fromUnsigned(t), BigInt.asUintN(bits, n), `fromUnsigned ${t}`)
  }
  eq(X.toTwos(1n << B(bits - 1), bits), null, `${bits}-bit upper bound`)
  eq(X.toTwos(-(1n << B(bits - 1)) - 1n, bits), null, `${bits}-bit lower bound`)
}

// Bitwise operators against BigInt and against 32-bit Number operators.
for (let i = 0; i < 3000; i++) {
  const bits = [8, 16, 32][rnd(0, 2)]
  const mask = (1n << B(bits)) - 1n
  const a = bigRand(bits)
  const b = bigRand(bits)
  eq(X.bitwise('and', a, b, bits), a & b, `and ${a} ${b}`)
  eq(X.bitwise('or', a, b, bits), a | b, `or ${a} ${b}`)
  eq(X.bitwise('xor', a, b, bits), a ^ b, `xor ${a} ${b}`)
  eq(X.bitwise('not', a, 0n, bits), BigInt.asUintN(bits, ~a), `not ${a} ${bits}`)
  const k = B(rnd(0, bits))
  eq(X.bitwise('shl', a, k, bits), (a << k) & mask, `shl ${a} ${k}`)
  eq(X.bitwise('shr', a, k, bits), a >> k, `shr ${a} ${k}`)
  if (bits <= 16) {
    const na = Number(a)
    const nb = Number(b)
    eq(X.bitwise('and', a, b, bits), B(na & nb), `Number and ${na} ${nb}`)
    eq(X.bitwise('xor', a, b, bits), B(na ^ nb), `Number xor ${na} ${nb}`)
  }
}

// Column arithmetic: replay the rules, and compare with BigInt.
const bin = (n) => n.toString(2)
for (let i = 0; i < 3000; i++) {
  const x = bigRand(rnd(1, 40))
  const y = bigRand(rnd(1, 40))
  const [hi, lo] = x >= y ? [x, y] : [y, x]
  const add = X.addColumns(bin(x), bin(y))
  eq(BigInt('0b' + add.result), x + y, `addColumns sum ${x} ${y}`)
  eq(add.carries[add.width - 1], '0', 'no carry into the last column')
  for (let c = 0; c < add.width; c++) {
    const carryOut = c === 0 ? 0 : Number(add.carries[c - 1])
    const total = Number(add.a[c]) + Number(add.b[c]) + Number(add.carries[c])
    eq(total, Number(add.result[c]) + 2 * carryOut, `addColumns column ${c} of ${x} + ${y}`)
  }
  const sub = X.subColumns(bin(hi), bin(lo))
  eq(BigInt('0b' + sub.result), hi - lo, `subColumns ${hi} ${lo}`)
  eq(sub.carries[sub.width - 1], '0', 'no borrow into the last column')
  for (let c = 0; c < sub.width; c++) {
    const borrowOut = c === 0 ? 0 : Number(sub.carries[c - 1])
    const total = Number(sub.a[c]) - Number(sub.b[c]) - Number(sub.carries[c]) + 2 * borrowOut
    eq(total, Number(sub.result[c]), `subColumns column ${c} of ${hi} - ${lo}`)
  }
  eq(X.mulPartials(bin(x), bin(y)).reduce((s, p) => s + BigInt('0b' + p.text), 0n), x * y, `mulPartials ${x} ${y}`)
}

/* ---------------------------------------------------- 3. fractions in a base */
let repeating = 0
for (let i = 0; i < 4000; i++) {
  const d = rnd(1, 300)
  const n = rnd(-300, 300)
  const r = X.rat(B(n), B(d))
  for (const base of [2, 3, 8, 10, 16]) {
    const e = X.expandBase(r, base, 2000)
    // Rebuilt exactly into the original fraction.
    const v = X.valueOfExpansion(e, base)
    eq(`${v.n}/${v.d}`, `${r.n}/${r.d}`, `expansion of ${n}/${d} in base ${base} rebuilds`)
    // The theory says when it terminates.
    eq(e.terminating, X.terminatesInBase(r, base), `terminates? ${n}/${d} base ${base}`)
    eq(e.rep === '', e.terminating, `rep empty iff terminating ${n}/${d} base ${base}`)
    if (!e.terminating) repeating++
    // Base 10 agrees with the decimal expansion in realnum.ts.
    if (base === 10) {
      const old = X.expand(r.n, r.d, 2000)
      eq(`${e.whole}.${e.pre}|${e.rep}`, `${old.whole}.${old.pre}|${old.rep}`, `base 10 ${n}/${d}`)
    }
  }
}
eq(repeating > 6000, true, 'enough repeating expansions were exercised')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`binary check ok — ${checks} checks (conversions and two’s complement against BigInt, operators, column rules, expansions rebuilt exactly)`)
