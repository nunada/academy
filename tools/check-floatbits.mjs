/** Checks src/lib/floatbits.ts, the numbers behind the "Floating-Point Numbers" article.
 *
 *  References that do not use the code under test:
 *   1. The machine itself: DataView for the bits of a double, Math.fround for single precision (including ties, subnormals and
 *      overflow), and a bfloat16 written here from the bits of a single.
 *   2. Python, a separate program: struct's half-precision patterns of 88 numbers, math.nextafter and math.ulp of fourteen
 *      doubles, and the exact decimal expansions of eleven doubles from decimal.Decimal (the values are written into this file).
 *   3. The definition of the format: every pattern of small formats decoded by the formula, the count of numbers, the largest and
 *      the smallest, the doubling of the gaps from one power of two to the next.
 *   4. Sums done by plain loops: the naive sum of ten 0.1 in double and in single precision, Kahan's sum against an exact sum
 *      made of integers, and the absorption of 1 by 2^53.
 *   5. Cancellation: four expressions written two ways, against the series of the true value.
 *
 *  Run: npm run check:floatbits   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/floatbits.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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
const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * (1 + Math.abs(b))
const rnd = (a, b) => a + Math.random() * (b - a)
const { FMTS } = M

/** from Python: HALF */
const HALF = [[1.0, "3C00"], [-2.0, "C000"], [0.1, "2E66"], [0.3, "34CD"], [0.3333333333333333, "3555"], [3.14159, "4248"], [65504.0, "7BFF"], [65519.0, "7BFF"], [6.1035e-05, "0400"], [6.103515625e-05, "0400"], [5.960464477539063e-08, "0001"], [3e-08, "0001"], [2.9802322387695312e-08, "0000"], [1e-05, "00A8"], [0.0999755859375, "2E66"], [1000.5, "63D1"], [2049.0, "6800"], [2050.0, "6801"], [2051.0, "6802"], [4095.5, "6C00"], [1e-05, "00A8"], [123.456, "57B7"], [-0.0, "8000"], [7.0, "4700"], [1.0009765625, "3C01"], [1.00048828125, "3C00"], [1.00146484375, "3C02"], [-0.00020632781304024805, "8AC3"], [-8.026644627240163e-08, "8001"], [-8.03604684541818e-08, "8001"], [-0.004159380318876326, "9C42"], [-0.17221673707357418, "B183"], [-8.195334983710529e-07, "800E"], [-0.3686056068249424, "B5E6"], [-0.001227199699899776, "9507"], [833.0289182832412, "6282"], [0.10956851872917238, "2F03"], [-6.162413157149008, "C62A"], [1.2566491413727234, "3D07"], [-14.84240454496729, "CB6C"], [0.03546706368554787, "288A"], [0.011319552590997789, "21CC"], [-2.9481533714522025e-05, "81EF"], [2.3401362706232404e-05, "0189"], [1214.1241198429973, "64BE"], [-28203.034847535087, "F6E3"], [1.8649489861416285e-06, "001F"], [-0.031682416619813795, "A80E"], [1.812902287298149e-07, "0003"], [0.0004941178391863922, "100C"], [-0.01237825855952813, "A256"], [-0.01122614901127516, "A1BF"], [8.708879175350297, "485B"], [0.0008799070606853147, "1335"], [-0.011985145049931867, "A223"], [-0.032661189826736686, "A82E"], [-8.223226295694685e-07, "800E"], [3329.922523975495, "6A81"], [0.00982048835722886, "2107"], [328.88204557347325, "5D24"], [43669.33731657755, "7955"], [-1.2505714558260278e-06, "8015"], [-2.9682456194664697, "C1F0"], [0.35660082640153856, "35B5"], [1.5064922643667786e-06, "0019"], [-0.0002155818778932196, "8B10"], [-0.04999046685047763, "AA66"], [1171.0571454367969, "6493"], [0.0017818409489726624, "174C"], [-1.7345419713168288e-07, "8003"], [-0.0054784837041685335, "9D9C"], [-1.0402298650992467e-07, "8002"], [0.10095413546569676, "2E76"], [-1.7741617297883585e-07, "8003"], [1.9857065190656395e-06, "0021"], [0.4539489526062477, "3743"], [662.7845929440297, "612E"], [-0.00011599214313084924, "879A"], [0.00037322224484283875, "0E1D"], [-6.248968485954787, "C640"], [9609.3571820909, "70B1"], [-0.13250528847910406, "B03D"], [-0.00012072238715653283, "87E9"], [4.7489883314914925e-05, "031D"], [-0.0005607001269914325, "9098"], [100.55304421456965, "5649"], [-0.9966907214352697, "BBF9"]]
/** from Python: NEXT */
const NEXT = [[0.1, 0.10000000000000002, 0.09999999999999999, 1.3877787807814457e-17], [0.2, 0.20000000000000004, 0.19999999999999998, 2.7755575615628914e-17], [0.3, 0.30000000000000004, 0.29999999999999993, 5.551115123125783e-17], [0.3333333333333333, 0.33333333333333337, 0.33333333333333326, 5.551115123125783e-17], [5e-324, 1e-323, 0.0, 5e-324], [2.2250738585072014e-308, 2.225073858507202e-308, 2.225073858507201e-308, 5e-324], [1.7976931348623157e+308, Infinity, 1.7976931348623155e+308, 1.99584030953472e+292], [1.0, 1.0000000000000002, 0.9999999999999999, 2.220446049250313e-16], [9007199254740992, 9007199254740994.0, 9007199254740991.0, 2.0], [1e+16, 1.0000000000000002e+16, 9999999999999998.0, 2.0], [123456.789, 123456.78900000002, 123456.78899999999, 1.4551915228366852e-11], [2.5, 2.5000000000000004, 2.4999999999999996, 4.440892098500626e-16], [0.5, 0.5000000000000001, 0.49999999999999994, 1.1102230246251565e-16], [1e-300, 1.0000000000000002e-300, 9.999999999999999e-301, 1.6578092e-316]]
/** from Python: DEC */
const DEC = [[0.1, "0.1000000000000000055511151231257827021181583404541015625"], [0.2, "0.200000000000000011102230246251565404236316680908203125"], [0.3, "0.299999999999999988897769753748434595763683319091796875"], [0.3333333333333333, "0.333333333333333314829616256247390992939472198486328125"], [5e-324, "0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004940656458412465441765687928682213723650598026143247644255856825006755072702087518652998363616359923797965646954457177309266567103559397963987747960107818781263007131903114045278458171678489821036887186360569987307230500063874091535649843873124733972731696151400317153853980741262385655911710266585566867681870395603106249319452715914924553293054565444011274801297099995419319894090804165633245247571478690147267801593552386115501348035264934720193790268107107491703332226844753335720832431936092382893458368060106011506169809753078342277318329247904982524730776375927247874656084778203734469699533647017972677717585125660551199131504891101451037862738167250955837389733598993664809941164205702637090279242767544565229087538682506419718265533447265625"], [1e+16, "10000000000000000"], [123456.789, "123456.789000000004307366907596588134765625"], [2.5, "2.5"], [0.5, "0.5"], [1e-10, "0.00000000010000000000000000364321973154977415791655470655996396089904010295867919921875"], [1e+22, "10000000000000000000000"]]
/** from Python: HEX */
const HEX = [[1.0, "3FF0000000000000"], [-2.5, "C004000000000000"], [0.1, "3FB999999999999A"], [5e-324, "0000000000000001"], [2.2250738585072014e-308, "0010000000000000"], [1.7976931348623157e+308, "7FEFFFFFFFFFFFFF"], [Infinity, "7FF0000000000000"], [0.0, "0000000000000000"]]


const dv = new DataView(new ArrayBuffer(8))
const bitsOf = (x) => {
  dv.setFloat64(0, x)
  return dv.getBigUint64(0)
}
const fieldsToBig = (p, f) => (BigInt(p.sign) << BigInt(f.exp + f.man)) | (BigInt(p.exp) << BigInt(f.man)) | BigInt(p.man)

/* ----------------------------------------------------------------- 1: the double format */
for (const [x, hex] of HEX) {
  const p = M.encode(x, FMTS.double)
  ok(M.hexOf(p, FMTS.double) === hex, `double ${x}: ${M.hexOf(p, FMTS.double)}, Python ${hex}`)
  ok(Object.is(M.decode(p, FMTS.double), x), `double ${x}: decode(encode(x)) is x`)
}
for (let t = 0; t < 3000; t++) {
  const x = (Math.random() < 0.5 ? -1 : 1) * 2 ** rnd(-1074, 1023) * rnd(1, 2)
  if (!Number.isFinite(x)) continue
  const p = M.encode(x, FMTS.double)
  ok(fieldsToBig(p, FMTS.double) === bitsOf(x), `double bits of ${x}`)
  ok(Object.is(M.decode(p, FMTS.double), x), `double round trip of ${x}`)
}
ok(M.encode(NaN, FMTS.double).kind === 'nan' && M.encode(Infinity, FMTS.double).kind === 'inf' && M.encode(-0, FMTS.double).sign === 1, 'NaN, ∞ and −0')
ok(M.encode(5e-324, FMTS.double).kind === 'subnormal' && M.encode(2.2250738585072014e-308, FMTS.double).kind === 'normal' && M.encode(2.2250738585072009e-308, FMTS.double).kind === 'subnormal', 'subnormal and normal doubles')

/* ----------------------------------------------------------- 2: single precision against Math.fround */
for (let t = 0; t < 4000; t++) {
  const x = (Math.random() < 0.5 ? -1 : 1) * 2 ** rnd(-160, 130) * rnd(1, 2)
  const p = M.encode(x, FMTS.single)
  const want = Math.fround(x)
  ok(Object.is(M.decode(p, FMTS.single), want), `single ${x}: ${M.decode(p, FMTS.single)} against fround ${want}`)
}
{
  // ties: halfway between two singles goes to the even one
  const a = 1 + 2 ** -23
  const tie = a + 2 ** -24
  ok(Object.is(M.decode(M.encode(tie, FMTS.single), FMTS.single), Math.fround(tie)), 'a tie in single precision rounds to even')
  ok(M.encode(1 + 2 ** -24, FMTS.single).man === 0, '1 + 2^−24 is a tie between 1 and 1 + 2^−23 and goes to 1')
  ok(M.encode(1 + 3 * 2 ** -24, FMTS.single).man === 2, '1 + 3·2^−24 is a tie that goes to the even 1 + 2^−22')
  ok(M.decode(M.encode(3.4028235677973366e38, FMTS.single), FMTS.single) === Infinity, 'a number past the largest single rounds to ∞')
  ok(M.decode(M.encode(3.4028234663852886e38, FMTS.single), FMTS.single) === 3.4028234663852886e38, 'the largest single is 3.4028234663852886e38')
  ok(M.decode(M.encode(1e-46, FMTS.single), FMTS.single) === 0, 'a number below half the smallest single rounds to 0')
  ok(M.decode(M.encode(1.401298464324817e-45, FMTS.single), FMTS.single) === 1.401298464324817e-45, 'the smallest single is 1.4e-45')
}

/* ---------------------------------------------------------------- 3: half precision against Python */
for (const [x, hex] of HALF) {
  const p = M.encode(x, FMTS.half)
  ok(M.hexOf(p, FMTS.half) === hex, `half ${x}: ${M.hexOf(p, FMTS.half)}, Python ${hex}`)
}
ok(M.decode(M.encode(65520, FMTS.half), FMTS.half) === Infinity && M.decode(M.encode(65519.99, FMTS.half), FMTS.half) === 65504, 'half: 65520 and above rounds to ∞, below it to 65504')
ok(M.decode(M.encode(2 ** -25, FMTS.half), FMTS.half) === 0 && M.decode(M.encode(2 ** -25 * 1.0001, FMTS.half), FMTS.half) === 2 ** -24, 'half: below half the smallest subnormal rounds to 0')

/* ---------------------------------------------------------------- bfloat16: the top half of a single */
{
  const f32 = new DataView(new ArrayBuffer(4))
  const bf = (x) => {
    f32.setFloat32(0, x)
    let b = f32.getUint32(0)
    // round to nearest even at bit 16 (finite numbers)
    b = (b + 0x7fff + ((b >>> 16) & 1)) >>> 0
    f32.setUint32(0, (b & 0xffff0000) >>> 0)
    return f32.getFloat32(0)
  }
  for (let t = 0; t < 3000; t++) {
    const x = (Math.random() < 0.5 ? -1 : 1) * 2 ** rnd(-120, 120) * rnd(1, 2)
    const got = M.decode(M.encode(Math.fround(x), FMTS.bfloat16), FMTS.bfloat16)
    ok(Object.is(got, bf(x)) || near(got, bf(x), 0), `bfloat16 ${x}: ${got} against ${bf(x)}`)
  }
  ok(M.hexOf(M.encode(1, FMTS.bfloat16), FMTS.bfloat16) === '3F80' && M.hexOf(M.encode(3.14159, FMTS.bfloat16), FMTS.bfloat16) === '4049', 'bfloat16: 1 is 3F80 and 3.14159 is 4049')
}

/* ---------------------------------------------------------------- 4: neighbours and spacing */
for (const [x, up, down, ulp] of NEXT) {
  const p = M.encode(x, FMTS.double)
  ok(M.decode(M.nextUp(p, FMTS.double), FMTS.double) === up, `nextUp(${x})`)
  ok(M.decode(M.nextDown(p, FMTS.double), FMTS.double) === down, `nextDown(${x})`)
  ok(M.ulp(x, FMTS.double) === ulp, `ulp(${x}) = ${M.ulp(x, FMTS.double)}, Python ${ulp}`)
}
for (let t = 0; t < 2000; t++) {
  const x = (Math.random() < 0.5 ? -1 : 1) * 2 ** rnd(-1070, 1020) * rnd(1, 2)
  const p = M.encode(x, FMTS.double)
  const up = M.decode(M.nextUp(p, FMTS.double), FMTS.double)
  const down = M.decode(M.nextDown(p, FMTS.double), FMTS.double)
  ok(up > x && down < x, `${x}: the neighbours are on either side`)
  ok(M.ulpDistance(x, up) === 1n && M.ulpDistance(down, x) === 1n, `${x}: the neighbours are one apart`)
  // the gap from |x| to the next larger |number| is the ulp
  const mag = Math.abs(x)
  const nextMag = Math.abs(x < 0 ? down : up)
  ok(nextMag - mag === M.ulp(x, FMTS.double), `${x}: next − x = ulp`)
}
ok(M.decode(M.nextUp(M.encode(0, FMTS.double), FMTS.double), FMTS.double) === 5e-324 && M.decode(M.nextDown(M.encode(0, FMTS.double), FMTS.double), FMTS.double) === -5e-324, 'next to zero is the smallest subnormal')
ok(M.decode(M.nextUp(M.encode(Number.MAX_VALUE, FMTS.double), FMTS.double), FMTS.double) === Infinity, 'next above the largest double is ∞')
ok(M.ulpDistance(0.1, 0.1) === 0n && M.ulpDistance(0.1 + 0.2, 0.3) === 1n && M.ulpDistance(-0, 0) === 0n, 'ulp distance of 0.1 + 0.2 and 0.3 is one')
ok(M.ulp(1, FMTS.double) === Number.EPSILON && M.ulp(1, FMTS.single) === 2 ** -23 && M.ulp(1, FMTS.half) === 2 ** -10, 'the gap above 1: 2^−52, 2^−23, 2^−10')
ok(M.ulp(2 ** 53, FMTS.double) === 2 && 2 ** 53 + 1 === 2 ** 53 && M.ulp(2 ** 24, FMTS.single) === 2, 'from 2^53 (2^24 in single) the gap is 2: odd integers are gone')

/* ---------------------------------------------------------------- 5: exact decimals */
for (const [x, dec] of DEC) {
  const got = M.exactDecimal(x)
  ok(got === dec, `exact decimal of ${x}: ${got}, Python ${dec}`)
  ok(Number(got) === x, `${x}: the exact decimal reads back as the same double`)
}
for (let t = 0; t < 500; t++) {
  const x = (Math.random() < 0.5 ? -1 : 1) * 2 ** rnd(-1070, 100) * rnd(1, 2)
  const s = M.exactDecimal(x)
  ok(Number(s) === x, `exact decimal of ${x} reads back`)
  ok(!/\.\d*0$/.test(s), `${x}: no trailing zero in ${s.slice(0, 40)}`)
}
ok(M.exactDecimal(0.1) === '0.1000000000000000055511151231257827021181583404541015625', '0.1 is 0.1000000000000000055511151231257827…')

/* ---------------------------------------------------------------- 6: the numbers of small formats */
for (const [e, m] of [[2, 1], [2, 2], [3, 2], [3, 3], [4, 2], [4, 3], [3, 1], [4, 1]]) {
  const f = { name: 't', exp: e, man: m }
  const all = M.allNonNegative(f)
  const bias = 2 ** (e - 1) - 1
  ok(all.length === (2 ** e - 1) * 2 ** m, `format (${e},${m}): ${all.length} non-negative finite numbers`)
  ok(all.every((q, i) => i === 0 || q.value > all[i - 1].value), `format (${e},${m}): strictly increasing`)
  // the formula of the definition, written again
  all.forEach((q, i) => {
    const exp = Math.floor(i / 2 ** m)
    const man = i % 2 ** m
    const want = exp === 0 ? man * 2 ** (1 - bias - m) : (2 ** m + man) * 2 ** (exp - bias - m)
    if (q.value !== want) fail(`format (${e},${m}) pattern ${i}: ${q.value} against ${want}`)
    checks++
  })
  const top = all[all.length - 1].value
  ok(top === (2 - 2 ** -m) * 2 ** bias, `format (${e},${m}): the largest is (2 − 2^−m)·2^bias`)
  ok(all[1].value === 2 ** (1 - bias - m), `format (${e},${m}): the smallest positive is 2^(1 − bias − m)`)
  // the gap is constant within a binade and doubles from one to the next
  const gap = (i) => all[i + 1].value - all[i].value
  for (let k = 1; k < 2 ** e - 2; k++) {
    const first = k * 2 ** m
    for (let j = 0; j < 2 ** m - 1; j++) ok(gap(first + j) === gap(first), `format (${e},${m}): the gap is constant in the binade ${k}`)
    if (k >= 2) ok(gap(first) === 2 * gap(first - 2 ** m), `format (${e},${m}): the gap doubles at the binade ${k}`)
  }
  // the gaps of the subnormals equal the gap of the first normal binade
  for (let j = 0; j < 2 ** m; j++) ok(gap(j) === gap(2 ** m), `format (${e},${m}): the subnormals are as far apart as the first binade`)
  // encode(decode(p)) is p for every pattern
  for (const q of all) ok(M.encode(q.value, f).exp === q.fields.exp && M.encode(q.value, f).man === q.fields.man, `format (${e},${m}): encode(decode(p)) = p`)
  // a number halfway between two of the format goes to the even one
  for (let i = 1; i < all.length - 1; i += 3) {
    const mid = (all[i].value + all[i + 1].value) / 2
    const r = M.encode(mid, f)
    ok(r.man % 2 === 0 || r.exp === 0 && r.man % 2 === 0, `format (${e},${m}): the tie between ${all[i].value} and ${all[i + 1].value} goes to the even pattern`)
  }
}

/* ----------------------------------------------------------------------- 7: bit strings */
{
  const p = M.encode(-2.5, FMTS.double)
  const s = M.bitStrings(p, FMTS.double)
  ok(s.sign === '1' && s.exp === '10000000000' && s.man === '0100000000000000000000000000000000000000000000000000', '−2.5: sign 1, exponent 10000000000, fraction 01000…')
  const back = M.fromBits(s.sign + s.exp + s.man, FMTS.double)
  ok(back && back.exp === p.exp && back.man === p.man && back.sign === 1, 'fromBits reads the bits back')
  ok(M.fromBits('101', FMTS.double) === null && M.fromBits('x'.repeat(64), FMTS.double) === null, 'fromBits refuses a wrong length or a wrong character')
  ok(M.bitStrings(M.encode(1, FMTS.half), FMTS.half).exp === '01111' && M.hexOf(M.encode(-2, FMTS.half), FMTS.half) === 'C000', 'half: 1 has exponent 01111, −2 is C000')
}

/* ----------------------------------------------------------------------------- 8: sums */
{
  const tenth = Array(10).fill(0.1)
  let loop = 0
  for (const x of tenth) loop += x
  ok(M.sumNaive(tenth, 'double') === loop && loop === 0.9999999999999999, 'ten times 0.1 in double: 0.9999999999999999')
  let s32 = 0
  for (const x of tenth) s32 = Math.fround(s32 + Math.fround(x))
  ok(M.sumNaive(tenth, 'single') === s32 && Math.abs(s32 - 1.0000001192092896) < 1e-15, 'ten times 0.1 in single: 1.0000001192092896')
  ok(M.sumExact(tenth) === 1 && M.sumKahan(tenth, 'double') === 1, 'the exact and the Kahan sum of ten 0.1 are 1')
  // a million times 0.1
  const mil = Array(1000000).fill(0.1)
  const naive = M.sumNaive(mil, 'double')
  const exact = M.sumExact(mil)
  const kahan = M.sumKahan(mil, 'double')
  ok(Math.abs(naive - 100000) > 1e-7 && Math.abs(naive - 100000) < 1e-5, `a million 0.1: the naive sum is off by ${naive - 100000}`)
  ok(exact === 100000.00000000001 || Math.abs(exact - 100000) < 2e-11, `the exact sum of a million 0.1 is ${exact}`)
  ok(Math.abs(kahan - exact) <= 1.5e-11, `Kahan agrees with the exact sum: ${kahan} and ${exact}`)
  // absorption
  ok(M.sumNaive([2 ** 53, 1, 1, 1, 1], 'double') === 2 ** 53 && M.sumExact([2 ** 53, 1, 1, 1, 1]) === 2 ** 53 + 4, 'absorption: 2^53 + 1 + 1 + 1 + 1 gives 2^53 added one at a time, 2^53 + 4 exactly')
  ok(M.sumNaive([1, 2 ** 53 * 0 + 1e-17], 'double') === 1, '1 + 1e-17 is 1')
  // random arrays: the exact sum is within one rounding of a high-precision reference; Kahan is never worse than naive by much
  for (let t = 0; t < 300; t++) {
    const n = 2 + Math.floor(Math.random() * 200)
    const xs = Array.from({ length: n }, () => (Math.random() - 0.3) * 10 ** rnd(-3, 3))
    const e = M.sumExact(xs)
    const k = M.sumKahan(xs, 'double')
    const nv = M.sumNaive(xs, 'double')
    const scale = xs.reduce((q, x) => q + Math.abs(x), 0)
    ok(Math.abs(k - e) <= 4 * 2 ** -53 * scale + 1e-300, `Kahan within a few ulps of the exact sum (${k - e})`)
    ok(Math.abs(nv - e) <= n * 2 ** -52 * scale + 1e-300, 'the naive sum is within n·u of the exact sum')
  }
  ok(M.sumExact([]) === 0 && M.sumExact([0.5, -0.5]) === 0 && M.sumExact([0.1]) === 0.1, 'degenerate sums')
}

/* ------------------------------------------------------------------------- 9: cancellation */
for (const c of M.CANCEL_CASES) {
  for (let t = 0; t < 300; t++) {
    const k = rnd(c.lo, c.hi)
    const x = 10 ** k
    const stable = c.stable(x)
    const s = c.series(x)
    ok(near(stable, s, 4e-15), `${c.id} at ${x}: the stable form ${stable} against the series ${s}`)
  }
}
{
  const cos = M.CANCEL_CASES[0]
  ok(cos.naive(1e-8) === 0 && near(cos.stable(1e-8), 0.5, 1e-15), '(1 − cos x)/x² at 1e-8: the naive form gives 0, the stable form 1/2')
  const exp = M.CANCEL_CASES[1]
  ok(Math.abs(exp.naive(1e-15) - 1) > 0.05 && near(exp.stable(1e-15), 1, 1e-14), '(e^x − 1)/x at 1e-15: the naive form is off by more than 5%')
  const sq = M.CANCEL_CASES[2]
  ok(sq.naive(1e8) === 0 && near(sq.stable(1e8), 5e-9, 1e-14), '√(x²+1) − x at 1e8: the naive form gives 0')
  const root = M.CANCEL_CASES[3]
  ok(Math.abs(root.naive(1e8) - 1e-8) > 1e-9 && near(root.stable(1e8), 1e-8, 1e-13), 'the small root of x² − 1e8 x + 1: the naive form has no correct digit')
  ok(M.agreeDigits(1, 1) === 16 && near(M.agreeDigits(1.001, 1), 3, 1e-3) && M.agreeDigits(0, 1) === 0 && M.agreeDigits(NaN, 1) === 0, 'agreeDigits')
}

console.log(`floatbits check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
