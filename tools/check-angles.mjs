/** Checks src/lib/angles.ts, the numbers behind the "Angles" article.
 *
 *  References that do not use the code under test:
 *   1. Python's exact fractions: the multiples of π for whole degrees, whether the regular n-gon tiles the plane, the angle between the hands of
 *      a clock at every second of twelve hours, and the times at which it has a given value, found by counting over every 1/11 of a second.
 *   2. The coordinates of lines and polygons, with the angles measured by atan2: the eight angles at a transversal and the pairs among them
 *      (all 28 pairs are classified as equal, supplementary or neither and compared with the named pairs), and the interior angles of regular
 *      polygons, their sum, their exterior turning angles and the number of diagonals counted by pairs of vertices.
 *   3. Rotated vectors for the angle between two vectors, the failure of the arc cosine formula for tiny angles that the article warns about,
 *      and the slopes of two lines turned into vectors.
 *   4. The coordinates of a circle for the inscribed angle, Thales' theorem, the arc, the sector and the chord.
 *   5. Python's remainder for normalizing angles, and the sixteen compass points as written out here.
 *
 *  Run: npm run check:angles   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'angles-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/angles.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b))
const rnd = (a, b) => a + Math.random() * (b - a)
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))

/* ------------------------------------------------------------------------------ the Python side */
const clockCases = []
for (let t = 0; t < 400; t++) clockCases.push([rndInt(0, 23), rndInt(0, 59), rndInt(0, 59)])
const PY = String.raw`
import json, sys
from fractions import Fraction
data = json.load(sys.stdin)
res = {}

# whole degrees as a fraction of pi
res['pi'] = [[Fraction(d, 180).numerator, Fraction(d, 180).denominator] for d in data['degs']]

# normalising with Python's remainder
res['norm'] = [x % 360 for x in data['floats']]

# the angle between the hands at a given time, exactly
def hands(h, m, s):
    hour = Fraction(h % 12) * 30 + Fraction(m, 2) + Fraction(s, 120)
    minute = Fraction(m) * 6 + Fraction(s, 10)
    return hour, minute
def between(h, m, s):
    hour, minute = hands(h, m, s)
    d = abs(hour - minute) % 360
    return min(d, 360 - d)
res['between'] = [[between(h, m, s).numerator, between(h, m, s).denominator] for h, m, s in data['clock']]
res['hands'] = [[float(hands(h, m, s)[0]), float(hands(h, m, s)[1])] for h, m, s in data['clock']]

# the times at which the hands make theta degrees, counting over every 1/11 of a second of twelve hours
def times(theta):
    out = []
    for j in range(43200 * 11):
        r = j % 43200            # the minute hand minus the hour hand is j/120 degrees, so r/120 modulo 360
        if min(r, 43200 - r) == theta * 120:
            f = Fraction(j, 11)
            out.append([f.numerator, f.denominator])
    return out
res['times'] = {str(t): times(t) for t in data['thetas']}

# the regular polygon tiles the plane when the interior angle divides 360
res['tiles'] = [Fraction(360) % (Fraction((n - 2) * 180, n)) == 0 for n in range(3, 201)]
json.dump(res, sys.stdout)
`
const degs = [...Array.from({ length: 361 }, (_, i) => i), -30, -90, 720, 1000]
const floats = Array.from({ length: 300 }, () => rnd(-2000, 2000))
const thetas = [0, 30, 45, 60, 90, 120, 180, 1, 7, 179]
const py = spawnSync('python', ['-I', '-X', 'utf8', '-c', PY], { input: JSON.stringify({ degs, floats, clock: clockCases, thetas }), encoding: 'utf8', maxBuffer: 1 << 27, timeout: 240000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* ------------------------------------------------------------------------------------ 1: units */
degs.forEach((d, i) => {
  const f = M.piFraction(d)
  ok(f.num === R.pi[i][0] && f.den === R.pi[i][1], `${d}° as a fraction of π: ${f.num}/${f.den}, Python ${R.pi[i]}`)
  const u = M.fromDegrees(d)
  ok(near(u.rad, (d * Math.PI) / 180) && near(u.grad, (d * 400) / 360) && near(u.turn, d / 360) && u.deg === d, `units of ${d}°`)
  for (const unit of M.UNITS) ok(near(M.toDegrees(u[unit], unit), d, 1e-12) || d === 0, `round trip of ${d}° through ${unit}`)
})
ok(M.piFraction(30).num === 1 && M.piFraction(30).den === 6 && M.piFraction(90).den === 2 && M.piFraction(180).num === 1 && M.piFraction(180).den === 1 && M.piFraction(0).num === 0 && M.piFraction(2.5) === null, 'known fractions of π')
ok(near(M.fromDegrees(180).rad, Math.PI) && M.fromDegrees(90).grad === 100 && M.fromDegrees(360).turn === 1, 'half a turn is π, a right angle 100 grad')
// degrees, minutes and seconds
for (let t = 0; t < 1500; t++) {
  const d = rndInt(0, 359)
  const m = rndInt(0, 59)
  const s = rndInt(0, 5999) / 100
  const r = M.dms(M.fromDms(d, m, s), 2)
  ok(r.d === d && r.m === m && Math.abs(r.s - s) < 1e-9 && r.sign === 1, `dms of ${d}° ${m}′ ${s}″: ${JSON.stringify(r)}`)
  const neg = M.dms(-M.fromDms(d, m, s), 2)
  ok(neg.sign === -1 && neg.d === d && neg.m === m && Math.abs(neg.s - s) < 1e-9, `dms of the negative angle ${d}° ${m}′ ${s}″`)
}
ok(JSON.stringify(M.dms(29.9999999999, 2)) === JSON.stringify({ sign: 1, d: 30, m: 0, s: 0 }) && JSON.stringify(M.dms(12.5, 2)) === JSON.stringify({ sign: 1, d: 12, m: 30, s: 0 }), 'carries in dms')
ok(JSON.stringify(M.dms(0, 2)) === JSON.stringify({ sign: 1, d: 0, m: 0, s: 0 }) && M.dms(59.999999, 0).d === 60, 'zero and rounding up')

/* --------------------------------------------------------------------------------- classifying */
for (let t = 0; t < 3000; t++) {
  const d = t < 400 ? t - 20 : Math.random() < 0.3 ? rndInt(-30, 400) : rnd(-30, 400)
  const kind = M.classify(d)
  const want = d < 0 || d > 360 ? 'beyond' : d === 0 ? 'zero' : d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : d === 180 ? 'straight' : d < 360 ? 'reflex' : 'full'
  ok(kind === want, `classify(${d}) = ${kind}, expected ${want}`)
}
ok(M.complement(30) === 60 && M.supplement(30) === 150 && M.explement(30) === 330, 'complement, supplement, explement')
floats.forEach((x, i) => {
  ok(near(M.normalize(x), R.norm[i], 1e-9), `normalize(${x}) = ${M.normalize(x)}, Python ${R.norm[i]}`)
  const sg = M.normalizeSigned(x)
  ok(sg > -180 && sg <= 180 && near(M.normalize(sg), M.normalize(x), 1e-9), `normalizeSigned(${x}) = ${sg}`)
})
for (const [x, want] of [[0, 0], [360, 0], [-90, 270], [720, 0], [-720, 0], [450, 90], [-1, 359], [359, 359]]) ok(M.normalize(x) === want, `normalize(${x}) = ${M.normalize(x)}`)
for (const [x, want] of [[180, 180], [-180, 180], [190, -170], [-190, 170], [0, 0], [360, 0], [270, -90]]) ok(M.normalizeSigned(x) === want, `normalizeSigned(${x}) = ${M.normalizeSigned(x)}`)
ok(Object.is(M.normalize(-0), 0) && Object.is(M.normalize(-360), 0), 'no negative zero')

/* ---------------------------------------------------------------------------- a transversal */
{
  // two parallel lines y = 0 and y = 1 and a transversal rising to the right at angle alpha; every angle is measured between two rays with atan2
  const ang = (u, v) => (Math.atan2(Math.abs(u[0] * v[1] - u[1] * v[0]), u[0] * v[0] + u[1] * v[1]) * 180) / Math.PI
  for (let alpha = 1; alpha < 180; alpha += alpha < 20 || alpha > 160 ? 1 : 7) {
    const t = (alpha * Math.PI) / 180
    const Rr = [1, 0]
    const Ll = [-1, 0]
    const U = [Math.cos(t), Math.sin(t)]
    const D = [-U[0], -U[1]]
    const at = { 1: ang(U, Ll), 2: ang(Rr, U), 3: ang(Ll, D), 4: ang(D, Rr) }
    const mine = M.transversalAngles(alpha)
    for (let k = 1; k <= 4; k++) {
      ok(near(mine[k], at[k], 1e-9) && near(mine[k + 4], at[k], 1e-9), `angle ${k} at alpha = ${alpha}: ${mine[k]}, measured ${at[k]}`)
    }
    // the four angles at a point add up to 360, the pairs along a line to 180
    ok(near(mine[1] + mine[2] + mine[3] + mine[4], 360) && near(mine[5] + mine[6] + mine[7] + mine[8], 360), 'four angles around a point')
  }
  // the named pairs against the values, for a generic alpha
  const a = M.transversalAngles(65)
  const named = { equal: new Set(), supplementary: new Set() }
  for (const [kind, pairs] of Object.entries(M.PAIRS)) {
    ok(pairs.every(([x, y]) => (M.PAIR_RELATION[kind] === 'equal' ? near(a[x], a[y]) : near(a[x] + a[y], 180))), `the pairs of ${kind} are ${M.PAIR_RELATION[kind]}`)
    for (const [x, y] of pairs) named[M.PAIR_RELATION[kind]].add(`${Math.min(x, y)}-${Math.max(x, y)}`)
  }
  let equal = 0
  let supp = 0
  const unnamedSupp = []
  for (let x = 1; x <= 8; x++)
    for (let y = x + 1; y <= 8; y++) {
      const key = `${x}-${y}`
      if (near(a[x], a[y])) {
        equal++
        ok(named.equal.has(key), `the equal pair ${key} has no name`)
      } else if (near(a[x] + a[y], 180)) {
        supp++
        if (!named.supplementary.has(key)) unnamedSupp.push(key)
      }
    }
  ok(equal === 12 && named.equal.size === 12, `${equal} equal pairs, ${named.equal.size} named`)
  ok(supp === 16 && named.supplementary.size === 12 && unnamedSupp.join() === '1-6,2-5,3-8,4-7', `${supp} supplementary pairs, ${named.supplementary.size} named, unnamed ${unnamedSupp}`)
  // no pair is named twice with different relations
  ok([...named.equal].every((k) => !named.supplementary.has(k)), 'a pair is either equal or supplementary')
  // a perpendicular transversal makes all eight angles right angles
  ok(Object.values(M.transversalAngles(90)).every((v) => v === 90), 'a perpendicular transversal')
  // the number of pairs of each kind
  ok(Object.keys(M.PAIRS).length === 7 && M.PAIRS.vertical.length === 4 && M.PAIRS.linearPair.length === 8 && M.PAIRS.corresponding.length === 4, 'the number of pairs of each kind')
}

/* --------------------------------------------------------------------------------- polygons */
for (let n = 3; n <= 60; n++) {
  const P = M.regularPolygon(n, 3)
  ok(P.length === n, `a regular ${n}-gon has ${n} vertices`)
  // the angle at each vertex between the two neighbors, and the turn at each vertex between the direction of the incoming and outgoing edges
  let sumInterior = 0
  let sumTurn = 0
  for (let k = 0; k < n; k++) {
    const p = P[k]
    const prev = P[(k + n - 1) % n]
    const next = P[(k + 1) % n]
    const u = [prev[0] - p[0], prev[1] - p[1]]
    const v = [next[0] - p[0], next[1] - p[1]]
    const interior = (Math.atan2(Math.abs(u[0] * v[1] - u[1] * v[0]), u[0] * v[0] + u[1] * v[1]) * 180) / Math.PI
    ok(near(interior, M.regularInterior(n), 1e-9), `interior angle of the regular ${n}-gon: ${interior}, formula ${M.regularInterior(n)}`)
    sumInterior += interior
    const inc = [p[0] - prev[0], p[1] - prev[1]]
    const outg = [next[0] - p[0], next[1] - p[1]]
    sumTurn += (Math.atan2(inc[0] * outg[1] - inc[1] * outg[0], inc[0] * outg[0] + inc[1] * outg[1]) * 180) / Math.PI
  }
  ok(near(sumInterior, M.interiorSum(n), 1e-9), `the interior angles of the ${n}-gon add up to ${sumInterior}, formula ${M.interiorSum(n)}`)
  ok(near(sumTurn, 360, 1e-9) && near(M.regularExterior(n) * n, 360) && near(M.regularInterior(n) + M.regularExterior(n), 180), `exterior angles of the ${n}-gon`)
  let diag = 0
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (j - i !== 1 && !(i === 0 && j === n - 1)) diag++
  ok(diag === M.diagonals(n), `diagonals of the ${n}-gon: ${diag}, formula ${M.diagonals(n)}`)
  ok(M.sidesFromInterior(M.regularInterior(n)) === n, `the polygon with interior angle ${M.regularInterior(n)} has ${n} sides`)
  // the circumradius: all vertices at distance 3 from the center, the first straight up
  ok(P.every(([x, y]) => near(Math.hypot(x, y), 3)) && near(P[0][0], 0, 1e-12) && near(P[0][1], 3), 'the vertices lie on the circle, the first at the top')
}
ok(M.sidesFromInterior(60) === 3 && M.sidesFromInterior(90) === 4 && M.sidesFromInterior(120) === 6 && M.sidesFromInterior(108) === 5 && M.sidesFromInterior(144) === 10, 'sidesFromInterior')
ok(M.sidesFromInterior(100) === null && M.sidesFromInterior(180) === null && M.sidesFromInterior(0) === null && M.sidesFromInterior(-5) === null && M.sidesFromInterior(179) === 360, 'no regular polygon for these, and the 360-gon has 179 degrees')
ok(M.interiorSum(3) === 180 && M.interiorSum(4) === 360 && M.interiorSum(5) === 540 && M.interiorSum(6) === 720 && M.diagonals(5) === 5 && M.diagonals(6) === 9 && M.diagonals(3) === 0, 'known polygon numbers')
for (let n = 3; n <= 200; n++) ok(M.tilesPlane(n) === R.tiles[n - 3], `tilesPlane(${n}) = ${M.tilesPlane(n)}, Python ${R.tiles[n - 3]}`)
ok([3, 4, 6].every((n) => M.tilesPlane(n)) && ![5, 7, 8, 9, 12].some((n) => M.tilesPlane(n)), 'the triangle, the square and the hexagon tile the plane')

/* ------------------------------------------------------------------------------------ the clock */
clockCases.forEach(([h, m, s], i) => {
  const b = M.clockBetween(h, m, s)
  ok(near(b, R.between[i][0] / R.between[i][1], 1e-12), `angle between the hands at ${h}:${m}:${s}: ${b}, Python ${R.between[i][0]}/${R.between[i][1]}`)
  const hd = M.clockHands(h, m, s)
  ok(near(hd.hour, R.hands[i][0], 1e-12) && near(hd.minute, R.hands[i][1], 1e-12), `hands at ${h}:${m}:${s}`)
})
ok(M.clockBetween(3, 0) === 90 && M.clockBetween(6, 0) === 180 && M.clockBetween(12, 0) === 0 && M.clockBetween(9, 0) === 90 && M.clockBetween(0, 0) === 0, 'angles at the hour')
ok(M.clockBetween(2, 30) === 105 && M.clockBetween(12, 30) === 165 && near(M.clockBetween(3, 15), 7.5), 'angles at 2:30, 12:30 and 3:15')
for (const t of thetas) {
  const mine = M.clockTimes(t)
  const ref = R.times[String(t)]
  ok(mine.length === ref.length && mine.every((f, i) => f.num === ref[i][0] && f.den === ref[i][1]), `times at ${t}°: ${mine.length} found, ${ref.length} counted`)
  ok(mine.length === (t === 0 || t === 180 ? 11 : 22), `the number of times at ${t}°: ${mine.length}`)
  // each time really gives the angle (exact arithmetic in 120ths of a degree after scaling by the denominator)
  for (const f of mine) {
    const secs = f.num / f.den
    const between = (() => {
      const r = ((secs * 11) % 43200 + 43200) % 43200
      return Math.min(r, 43200 - r) / 120
    })()
    ok(near(between, t, 1e-9), `at ${f.num}/${f.den} s the angle is ${between}, not ${t}`)
  }
}
ok(M.clockTimes(0).length === 11 && M.clockTimes(0)[0].num === 0 && M.clockTimes(0)[1].num === 43200 && M.clockTimes(0)[1].den === 11, 'the first overlap after 12:00 is at 43200/11 seconds, 1:05:27 3/11')
{
  const t = M.timeOfDay(43200, 11)
  ok(t.h === 1 && t.m === 5 && t.sNum === 300 && t.sDen === 11, `timeOfDay(43200/11) = ${JSON.stringify(t)}`)
  const z = M.timeOfDay(0, 1)
  ok(z.h === 12 && z.m === 0 && z.sNum === 0, 'twelve o\'clock')
  const q = M.timeOfDay(3 * 3600, 1)
  ok(q.h === 3 && q.m === 0 && q.sNum === 0, 'three o\'clock')
}
ok(M.clockTimes(90).map((f) => M.timeOfDay(f.num, f.den)).some((t) => t.h === 3 && t.m === 0 && t.sNum === 0) && M.clockTimes(90).map((f) => M.timeOfDay(f.num, f.den)).some((t) => t.h === 9 && t.m === 0 && t.sNum === 0), 'the hands are at right angles at 3:00 and 9:00')

/* ------------------------------------------------------------------------------- directions */
{
  const names = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  ok(JSON.stringify(M.COMPASS) === JSON.stringify(names), 'the sixteen compass points')
  names.forEach((nm, i) => ok(M.compassName(i * 22.5) === nm && M.compassName(i * 22.5 + 11) === nm && M.compassName(i * 22.5 - 11) === nm, `compass point ${nm}`))
  ok(M.compassName(360) === 'N' && M.compassName(-10) === 'N' && M.compassName(349) === 'N' && M.compassName(11.26) === 'NNE', 'wrapping around north')
  for (const [math, bearing] of [[0, 90], [90, 0], [180, 270], [270, 180], [45, 45], [135, 315], [-90, 180]]) {
    ok(M.bearingFromMath(math) === bearing, `bearing of the direction ${math}°: ${M.bearingFromMath(math)}, expected ${bearing}`)
    ok(M.mathFromBearing(bearing) === M.normalize(math), `direction of the bearing ${bearing}°`)
  }
  for (let t = 0; t < 500; t++) {
    const x = rnd(-720, 720)
    ok(near(M.mathFromBearing(M.bearingFromMath(x)), M.normalize(x), 1e-9), `a round trip through the bearing of ${x}`)
  }
}

/* --------------------------------------------------------------------------------- vectors */
{
  for (let t = 0; t < 3000; t++) {
    const theta = rnd(0.0001, Math.PI - 0.0001)
    const r1 = Math.exp(rnd(-6, 6))
    const r2 = Math.exp(rnd(-6, 6))
    const rot = rnd(-Math.PI, Math.PI)
    const a = [r1 * Math.cos(rot), r1 * Math.sin(rot)]
    const b = [r2 * Math.cos(rot + theta), r2 * Math.sin(rot + theta)]
    ok(near(M.angleBetween(a, b), theta, 1e-9), `angle between rotated vectors: ${M.angleBetween(a, b)}, expected ${theta}`)
    ok(near(M.angleBetween(a, b), M.angleBetween(b, a), 1e-12), 'the angle is symmetric')
    ok(near(M.directedAngle(a, b), theta, 1e-9) && near(M.directedAngle(b, a), -theta, 1e-9), `the directed angle: ${M.directedAngle(a, b)}`)
    ok(near(M.angleBetweenAcos(a, b), theta, 1e-6), `the arc cosine formula for an ordinary angle ${theta}`)
  }
  // the same vector twice: rounding can push the cosine just above 1, which the formula must not turn into NaN
  for (let t = 0; t < 300; t++) {
    const v = [rnd(-9, 9), rnd(-9, 9)]
    const k = Math.exp(rnd(-3, 3))
    ok(!Number.isNaN(M.angleBetweenAcos(v, [v[0] * k, v[1] * k])) && M.angleBetweenAcos(v, [v[0] * k, v[1] * k]) < 1e-6, `acos formula on parallel vectors ${v}`)
    ok(!Number.isNaN(M.angleBetweenAcos(v, [-v[0] * k, -v[1] * k])) && Math.PI - M.angleBetweenAcos(v, [-v[0] * k, -v[1] * k]) < 1e-6, `acos formula on opposite vectors ${v}`)
  }
  ok(M.angleBetweenAcos([1, 1], [1, 1]) < 1e-7 && Math.PI - M.angleBetweenAcos([1, 1], [-1, -1]) < 1e-7, 'identical and opposite vectors (the arc cosine shows rounding of order 1e-8)')
  ok(!Number.isNaN(M.angleBetweenAcos([0.1, 0.1], [0.1, 0.1])) && !Number.isNaN(M.angleBetweenAcos([3, 4], [6, 8])), 'no NaN on parallel vectors')
  // the arc cosine formula loses the angle near 0 and π, as the article says
  const tiny = 1e-8
  const A = [1, 0]
  const B = [Math.cos(tiny), Math.sin(tiny)]
  ok(M.angleBetweenAcos(A, B) === 0 && near(M.angleBetween(A, B), tiny, 1e-6), `a tiny angle: acos gives ${M.angleBetweenAcos(A, B)}, atan2 ${M.angleBetween(A, B)}`)
  const C = [-Math.cos(tiny), Math.sin(tiny)]
  ok(M.angleBetweenAcos(A, C) === Math.PI && near(M.angleBetween(A, C), Math.PI - tiny, 1e-9), 'an angle close to straight')
  ok(M.angleBetween([1, 0], [0, 1]) === Math.PI / 2 && M.angleBetween([1, 0], [-1, 0]) === Math.PI && M.angleBetween([2, 3], [4, 6]) === 0 && M.angleBetween([1, 1], [1, 1]) === 0, 'right, straight and zero angles')
  ok(M.directedAngle([1, 0], [0, 1]) === Math.PI / 2 && M.directedAngle([0, 1], [1, 0]) === -Math.PI / 2 && M.directedAngle([1, 0], [-1, 0]) === Math.PI, 'the sign of the directed angle')
  // two lines by their slopes, against the vectors (1, m)
  for (let t = 0; t < 2000; t++) {
    const m1 = rnd(-8, 8)
    const m2 = rnd(-8, 8)
    const v = (M.angleBetween([1, m1], [1, m2]) * 180) / Math.PI
    ok(near(M.lineAngle(m1, m2), Math.min(v, 180 - v), 1e-9) && M.lineAngle(m1, m2) <= 90 + 1e-12, `angle between slopes ${m1} and ${m2}: ${M.lineAngle(m1, m2)}, vectors ${v}`)
  }
  ok(M.lineAngle(2, -0.5) === 90 && M.lineAngle(Infinity, 0) === 90 && M.lineAngle(3, 3) === 0 && near(M.lineAngle(Infinity, 1), 45) && near(M.lineAngle(1, Infinity), 45) && M.lineAngle(Infinity, Infinity) === 0, 'perpendicular, vertical and parallel lines')
  ok(near(M.lineAngle(0, 1), 45) && near(M.lineAngle(1, -1), 90) && near(M.lineAngle(0, Math.sqrt(3)), 60), 'slopes 0 and 1, 1 and −1, 0 and √3')
}

/* ---------------------------------------------------------------------------------- circles */
{
  for (let t = 0; t < 400; t++) {
    const r = rnd(0.1, 50)
    const theta = rnd(0, 2 * Math.PI)
    const s = M.sectorOf(r, theta)
    ok(near(s.arc, r * theta) && near(s.area, (theta / (2 * Math.PI)) * Math.PI * r * r) && near(s.chord, Math.hypot(r * Math.cos(theta) - r, r * Math.sin(theta))), `sector of radius ${r}, angle ${theta}`)
  }
  ok(near(M.sectorOf(3, 2 * Math.PI).arc, 6 * Math.PI) && near(M.sectorOf(3, 2 * Math.PI).area, 9 * Math.PI) && near(M.sectorOf(3, Math.PI).chord, 6) && near(M.sectorOf(1, 1).arc, 1), 'the full circle, a half circle, one radian')
  for (let t = 0; t < 3000; t++) {
    const central = rnd(1, 359)
    let point = rnd(0.5, 359.5)
    if (Math.abs(point - central) < 0.5 || point < 0.5) point = (point + 7) % 360
    const mine = M.inscribedAt(central, point)
    const formula = M.inscribedFormula(central, point)
    ok(near(mine, formula, 1e-7), `inscribed angle for central ${central} and point ${point}: measured ${mine}, formula ${formula}`)
  }
  for (let t = 0; t < 400; t++) {
    const point = rnd(1, 179)
    ok(near(M.inscribedAt(180, point), 90, 1e-9) && near(M.inscribedAt(180, 360 - point), 90, 1e-9), `Thales: the angle in a semicircle at ${point}°`)
  }
  ok(near(M.inscribedAt(90, 200), 45) && near(M.inscribedAt(90, 45), 135) && near(M.inscribedAt(60, 180), 30), 'known inscribed angles')
}

console.log(`angles check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
