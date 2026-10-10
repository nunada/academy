/** Checks src/lib/pythagoras.ts, the engine behind the "Pythagorean Theorem" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Hand-written triples, and the known count of 16 primitive triples with hypotenuse up to 100.
 *   2. Euclid's formula against a brute-force search over all a < b < c ≤ 300 (with and without multiples).
 *   3. "All triples with a given leg" (the factoring c² − b² = (c − b)(c + b)) against brute force.
 *   4. Berggren's tree: every primitive triple appears exactly once, nothing else does, the parent
 *      function undoes the children, and the odd leg stays first.
 *   5. Facts that hold for every triple (the product of the legs is divisible by 12, abc by 60).
 *   6. Missing sides and distances in 2 and 3 dimensions, exactly (k√m squared gives back the square)
 *      and against Math.hypot.
 *
 *  Run: npm run check:pythagoras   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pyth-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/pythagoras.ts')}'\nexport { ratAdd, ratMul, ratSub } from '${p('src/lib/rationals.ts')}'\nexport { gcd } from '${p('src/lib/realnum.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const P = await import('file://' + out.replace(/\\/g, '/'))

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
const R = (n, d = 1) => P.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const tj = (t) => t.join(',')
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))

/* ------------------------------------------------------------------ 1. by hand */
eq(tj(P.euclid(2n, 1n)), '3,4,5', 'Euclid (2,1)')
eq(tj(P.euclid(3n, 2n)), '5,12,13', 'Euclid (3,2)')
eq(tj(P.euclid(4n, 1n)), '15,8,17', 'Euclid (4,1)')
eq(tj(P.euclid(4n, 3n)), '7,24,25', 'Euclid (4,3)')
eq(tj(P.euclid(5n, 2n)), '21,20,29', 'Euclid (5,2)')
eq(P.isTriple(3n, 4n, 5n), true, '3-4-5')
eq(P.isTriple(4n, 5n, 6n), false, '4-5-6')
eq(P.isPrimitive([6n, 8n, 10n]), false, '6-8-10 is not primitive')
eq(P.isPrimitive([5n, 12n, 13n]), true, '5-12-13 is primitive')
const known16 = '3,4,5;5,12,13;7,24,25;8,15,17;9,40,41;11,60,61;12,35,37;13,84,85;16,63,65;20,21,29;28,45,53;33,56,65;36,77,85;39,80,89;48,55,73;65,72,97'
eq(
  P.triplesUpTo(100, true)
    .map(tj)
    .sort()
    .join(';'),
  known16.split(';').sort().join(';'),
  'the 16 primitive triples with hypotenuse up to 100',
)
eq(P.triplesWithLeg(12n).map(tj).join(';'), '12,5,13;12,9,15;12,16,20;12,35,37', 'the four triples with leg 12')
eq(P.triplesWithLeg(5n).map(tj).join(';'), '5,12,13', 'leg 5')
eq(P.triplesWithLeg(3n).map(tj).join(';'), '3,4,5', 'leg 3')
eq(P.triplesWithLeg(1n).length + P.triplesWithLeg(2n).length, 0, 'legs 1 and 2 have no triples')
eq(P.triplesWithLeg(4n).map(tj).join(';'), '4,3,5', 'leg 4')

/* --------------------------------- 2. Euclid's formula against brute force */
const N = 300
const brute = []
for (let a = 1; a <= N; a++)
  for (let b = a + 1; b <= N; b++) {
    const c = Math.round(Math.sqrt(a * a + b * b))
    if (c <= N && c * c === a * a + b * b) brute.push([a, b, c])
  }
const bruteAll = brute.map((t) => t.join(',')).sort()
const mine = P.triplesUpTo(N, false)
eq(mine.map(tj).sort().join(';'), bruteAll.join(';'), `all triples up to ${N}`)
eq(mine.length, new Set(mine.map(tj)).size, 'no triple is listed twice')
const brutePrim = brute.filter((t) => P.gcd(P.gcd(B(t[0]), B(t[1])), B(t[2])) === 1n).map((t) => t.join(',')).sort()
eq(
  P.triplesUpTo(N, true)
    .map(tj)
    .sort()
    .join(';'),
  brutePrim.join(';'),
  `primitive triples up to ${N}`,
)
for (let i = 1; i < mine.length; i++) eq(mine[i - 1][2] <= mine[i][2], true, 'sorted by hypotenuse')

/* ------------------------------------------- 3. all triples with a given leg */
for (let a = 1; a <= 160; a++) {
  const want = []
  for (let b = 1; b <= Math.floor((a * a - 1) / 2); b++) {
    const c = Math.round(Math.sqrt(a * a + b * b))
    if (c * c === a * a + b * b) want.push([a, b, c].join(','))
  }
  const got = P.triplesWithLeg(B(a)).map(tj)
  eq(got.slice().sort().join(';'), want.slice().sort().join(';'), `triples with leg ${a}`)
}
// Large leg: a prime p has exactly one triple (p, (p²−1)/2, (p²+1)/2).
for (const pr of [101n, 997n, 10007n]) eq(tj(P.triplesWithLeg(pr)[0]), `${pr},${(pr * pr - 1n) / 2n},${(pr * pr + 1n) / 2n}`, `odd prime leg ${pr}`)
eq(P.triplesWithLeg(10007n).length, 1, 'a prime leg has exactly one triple')

/* ---------------------------------------------- 4. Berggren's tree of triples */
const LIMIT = 3000n
const seen = new Set()
let dup = 0
const stack = [[3n, 4n, 5n]]
while (stack.length) {
  const t = stack.pop()
  if (t[2] > LIMIT) continue
  const key = tj(t)
  if (seen.has(key)) dup++
  seen.add(key)
  eq(P.isTriple(...t), true, `tree node ${key} is a triple`)
  eq(t[0] % 2n === 1n && t[1] % 2n === 0n, true, `tree node ${key}: odd leg first`)
  eq(P.isPrimitive(t), true, `tree node ${key} is primitive`)
  const par = P.parent(t)
  if (key !== '3,4,5') eq(par !== null && P.children(par).some((c) => tj(c) === key), true, `parent of ${key} has it as a child`)
  else eq(par, null, 'the root has no parent')
  for (const c of P.children(t)) {
    eq(c[2] > t[2], true, 'children have a larger hypotenuse')
    stack.push(c)
  }
}
eq(dup, 0, 'no triple appears twice in the tree')
const prim = new Set(P.triplesUpTo(Number(LIMIT), true).map((t) => tj(P.oddFirst(t))))
eq([...seen].sort().join(';'), [...prim].sort().join(';'), `the tree is exactly the primitive triples up to ${LIMIT}`)
eq(P.children([3n, 4n, 5n]).map(tj).join(';'), '5,12,13;21,20,29;15,8,17', 'children of (3,4,5)')

/* ------------------------------------------ 5. facts about every triple */
for (const t of P.triplesUpTo(500, false)) {
  const [a, b, c] = t
  eq((a * b) % 12n, 0n, `ab divisible by 12 for ${tj(t)}`)
  eq((a * b * c) % 60n, 0n, `abc divisible by 60 for ${tj(t)}`)
  eq((a * b) % 2n, 0n, 'the area is a whole number')
}
for (const t of P.triplesUpTo(500, true)) {
  const [a, b, c] = t
  eq((a % 2n) + (b % 2n), 1n, `exactly one leg is even in ${tj(t)}`)
  eq(c % 2n, 1n, `hypotenuse is odd in ${tj(t)}`)
  eq((a * b) % 3n, 0n, 'a leg is divisible by 3')
  eq((a % 4n === 0n) !== (b % 4n === 0n), true, `exactly one leg is divisible by 4 in ${tj(t)}`)
}

/* -------------------------- 6. missing side and distances, exactly */
const sqr = (r) => P.ratMul(r, r)
for (let i = 0; i < 20000; i++) {
  const x = R(rnd(1, 40), rnd(1, 6))
  const y = R(rnd(1, 40), rnd(1, 6))
  const h = P.hypotenuse(x, y)
  eq(txt(h.square), txt(P.ratAdd(sqr(x), sqr(y))), 'hypotenuse squared')
  eq(txt(P.ratMul(P.ratMul(h.k, h.k), R(h.m))), txt(h.square), 'k² m gives the square back')
  eq(Math.abs(h.value - Math.hypot(Number(x.n) / Number(x.d), Number(y.n) / Number(y.d))) < 1e-9 * h.value, true, 'against Math.hypot')
  eq(h.rational, h.m === 1n, 'rational flag')
  // The other leg from (x, hypotenuse) when the hypotenuse is itself rational.
  if (h.rational) {
    const back = P.otherLeg(x, P.rat(h.k.n, h.k.d))
    eq(back !== null && txt(back.square) === txt(sqr(y)), true, 'other leg from a rational hypotenuse')
  }
}
eq(P.otherLeg(R(5), R(3)), null, 'a leg cannot be longer than the hypotenuse')
eq(P.otherLeg(R(3), R(3)), null, 'a leg cannot equal the hypotenuse')
eq(P.otherLeg(R(0), R(3)), null, 'a leg of zero')
eq(P.hypotenuse(R(3), R(4)).value, 5, 'hypotenuse of 3 and 4')
eq(P.hypotenuse(R(1), R(1)).k.n === 1n && P.hypotenuse(R(1), R(1)).m === 2n, true, 'diagonal of the unit square is sqrt 2')
eq(P.hypotenuse(R(6), R(4)).m === 13n && txt(P.hypotenuse(R(6), R(4)).k) === '2/1', true, 'sqrt 52 = 2 sqrt 13')
const l512 = P.otherLeg(R(5), R(13))
eq(l512.value, 12, 'leg from 5 and 13')
for (let i = 0; i < 20000; i++) {
  const d = rnd(1, 4)
  const pp = Array.from({ length: d }, () => R(rnd(-9, 9), rnd(1, 4)))
  const qq = Array.from({ length: d }, () => R(rnd(-9, 9), rnd(1, 4)))
  const sum = pp.reduce((s, v, k) => s + (Number(v.n) / Number(v.d) - Number(qq[k].n) / Number(qq[k].d)) ** 2, 0)
  eq(Math.abs(Number(P.distanceSq(pp, qq).n) / Number(P.distanceSq(pp, qq).d) - sum) < 1e-9, true, `distance squared in ${d} dimensions`)
  eq(txt(P.distanceSq(pp, qq)), txt(P.distanceSq(qq, pp)), 'distance is symmetric')
  eq(P.distanceSq(pp, pp).n, 0n, 'distance from a point to itself')
}
eq(txt(P.boxDiagonalSq(R(2), R(3), R(6))), '49/1', 'a 2 by 3 by 6 box has diagonal 7')
eq(txt(P.boxDiagonalSq(R(1), R(1), R(1))), '3/1', 'a unit cube has diagonal sqrt 3')
eq(txt(P.distanceSq([R(0), R(0)], [R(3), R(4)])), '25/1', 'the distance from the origin to (3,4)')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`pythagoras check ok — ${checks} checks (Euclid's formula and the leg factoring against brute force, Berggren's tree, divisibility facts, exact missing sides and distances)`)
