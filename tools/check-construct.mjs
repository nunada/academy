/** Checks src/lib/construct.ts, the geometry behind the "Constructing Segments and Angles" article.
 *
 *  References that do not use the code under test:
 *   1. Rules: every point of every construction is re-derived as a crossing of the two objects it names, using only points made earlier, and
 *      `run` is shown to refuse a cheating list of steps (an unknown point, no crossing, two crossings with no choice, a point made twice).
 *   2. Coordinates: for the eleven textbook constructions, on the picture shown first and on 60 random inputs each, the finished figure is compared
 *      with the answer worked out by formulas (the midpoint, the 60° rotation, the sum of two unit vectors, the projection of a point, atan2 of
 *      the final angle), and every claim the widget prints is checked to be true to 1e-9.
 *   3. Dividing a segment: n from 2 to 12, the marks are at k/n of the way, to 1e-9.
 *   4. Angles: the recipe tool finds a construction for every whole degree that is a multiple of 3 and for no other, each finished construction is
 *      measured by atan2, and the minimal polynomial of cos of every whole degree is computed by SymPy and compared with the power-of-two rule.
 *   5. Trisection: the marked-ruler construction of Archimedes is solved by bisection and the angle at D is θ/3; whether the general trisection is
 *      possible comes from the degrees of cos(θ/3) and cos(θ) in SymPy.
 *   6. Regular polygons: the list of buildable n-gons against the published list below 121, against brute-force Euler φ up to 3000 and against SymPy.
 *
 *  Run: npm run check:construct   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'construct-'))
const out = path.join(tmp, 'c.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/construct.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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

/* ----------------------------------------------------------------------- plain vector helpers */
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a, k) => ({ x: a.x * k, y: a.y * k })
const len = (a) => Math.hypot(a.x, a.y)
const unit = (a) => mul(a, 1 / len(a))
const dot = (a, b) => a.x * b.x + a.y * b.y
const crs = (a, b) => a.x * b.y - a.y * b.x
const rot = (a, deg) => {
  const t = (deg * Math.PI) / 180
  return { x: a.x * Math.cos(t) - a.y * Math.sin(t), y: a.x * Math.sin(t) + a.y * Math.cos(t) }
}
const heading = (a) => (Math.atan2(a.y, a.x) * 180) / Math.PI
const turnTo = (from, to) => (((heading(to) - heading(from)) % 360) + 360) % 360 // counterclockwise degrees from `from` to `to`
const sep = (p, q) => len(sub(p, q))

/** How far a point is from a drawn object: a line (through its two defining points) or a circle. */
const offObject = (pt, o) => {
  if (o.kind === 'line') return Math.abs(crs(sub(o.q, o.p), sub(pt, o.p))) / len(sub(o.q, o.p))
  return Math.abs(len(sub(pt, o.center)) - o.r)
}

/* ----------------------------------------------------------------------------------- 1: the rules */
const checkLegal = (c, label) => {
  const built = M.run(c.givens, c.steps)
  let objects = 0
  c.steps.forEach((s, i) => {
    const known = (n) => n in built.pointStep && built.pointStep[n] < i
    if (s.kind === 'line') {
      ok(known(s.a) && known(s.b), `${label}: step ${i} draws a line through a point that does not exist yet`)
      objects++
    } else if (s.kind === 'circle') {
      ok(known(s.c) && known(s.r1) && known(s.r2), `${label}: step ${i} draws a circle from a point that does not exist yet`)
      objects++
    } else {
      const [a, b] = s.of
      ok(a < objects && b < objects && a !== b, `${label}: step ${i} crosses objects that are not drawn yet`)
      const pt = built.points[s.name]
      const scale = 1 + Math.max(...Object.values(built.points).map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))))
      ok(offObject(pt, built.objects[a]) < 1e-9 * scale && offObject(pt, built.objects[b]) < 1e-9 * scale, `${label}: the point ${s.name} is not on both of its objects`)
    }
  })
  ok(built.objects.length === objects, `${label}: object count`)
  return built
}

{
  const g = { A: { x: 1, y: 2 }, B: { x: 5, y: 2 } }
  const refuses = (steps, what) => {
    let threw = false
    try {
      M.run(g, steps)
    } catch {
      threw = true
    }
    ok(threw, `run should refuse: ${what}`)
  }
  refuses([{ kind: 'line', a: 'A', b: 'Z' }], 'a line through a point that is not there')
  refuses([{ kind: 'circle', c: 'A', r1: 'A', r2: 'Z' }], 'a radius from a point that is not there')
  refuses([{ kind: 'circle', c: 'A', r1: 'A', r2: 'A' }], 'a circle of radius 0')
  refuses([{ kind: 'line', a: 'A', b: 'A' }], 'a line through one point')
  refuses([{ kind: 'line', a: 'A', b: 'B' }, { kind: 'circle', c: 'A', r1: 'A', r2: 'B' }, { kind: 'point', name: 'P', of: [0, 1] }, { kind: 'point', name: 'P', of: [0, 1], pick: { far: 'B' } }], 'a point made twice')
  refuses([{ kind: 'line', a: 'A', b: 'B' }, { kind: 'circle', c: 'A', r1: 'A', r2: 'B' }, { kind: 'point', name: 'P', of: [0, 1] }], 'two crossings and no choice')
  refuses([{ kind: 'circle', c: 'A', r1: 'A', r2: 'B' }, { kind: 'circle', c: 'B', r1: 'A', r2: 'A' }], 'a circle of radius 0 (second)')
  refuses([{ kind: 'circle', c: 'A', r1: 'A', r2: 'B' }, { kind: 'line', a: 'A', b: 'B' }, { kind: 'point', name: 'P', of: [0, 5], pick: { far: 'B' } }], 'an object that is not there')
  refuses([{ kind: 'line', a: 'A', b: 'B' }, { kind: 'point', name: 'P', of: [0, 0], pick: { far: 'B' } }], 'an object crossed with itself')
  // circles that do not meet
  refuses([{ kind: 'circle', c: 'A', r1: 'A', r2: 'B' }, { kind: 'circle', c: 'B', r1: 'A', r2: 'B' }, { kind: 'circle', c: 'A', r1: 'A', r2: 'A' }], 'zero radius again')
  const far = { A: { x: 0, y: 0 }, B: { x: 1, y: 0 }, C: { x: 10, y: 0 }, D: { x: 11, y: 0 } }
  let threw = false
  try {
    M.run(far, [{ kind: 'circle', c: 'A', r1: 'A', r2: 'B' }, { kind: 'circle', c: 'C', r1: 'C', r2: 'D' }, { kind: 'point', name: 'P', of: [0, 1], pick: { far: 'A' } }])
  } catch {
    threw = true
  }
  ok(threw, 'circles that do not meet give no point')
  // the helpers the widgets print their measurements with
  const O = { x: 0, y: 0 }
  ok(near(M.angleAt(O, { x: 1, y: 0 }, { x: 0, y: 2 }), 90) && near(M.angleAt(O, { x: 1, y: 0 }, { x: -1, y: 0 }), 180) && near(M.angleAt(O, { x: 1, y: 0 }, { x: -1, y: 1 }), 135) && near(M.angleAt(O, { x: 3, y: 0 }, { x: 3, y: 0 }), 0), 'angleAt')
  ok(near(M.lineAngle({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 5, y: 5 }, { x: 4, y: 5 }), 0) && near(M.lineAngle({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 1 }), 45) && near(M.lineAngle({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -3 }), 90), 'lineAngle is the acute angle between lines')
  ok(near(M.lineDistance({ x: 3, y: 5 }, { x: 0, y: 1 }, { x: 10, y: 1 }), 4) && near(M.lineDistance({ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 1 }), 0), 'lineDistance')
  // the picks
  const sq = M.run({ A: { x: 0, y: 0 }, B: { x: 2, y: 0 } }, [
    { kind: 'circle', c: 'A', r1: 'A', r2: 'B' },
    { kind: 'circle', c: 'B', r1: 'B', r2: 'A' },
    { kind: 'point', name: 'L', of: [0, 1], pick: { side: ['A', 'B', 1] } },
    { kind: 'point', name: 'R', of: [0, 1], pick: { side: ['A', 'B', -1] } },
    { kind: 'point', name: 'F', of: [0, 1], pick: { far: 'L' } },
    { kind: 'point', name: 'N', of: [0, 1], pick: { near: 'L' } },
    { kind: 'point', name: 'T', of: [0, 1], pick: { toward: ['R', 'L'] } },
  ])
  ok(near(sq.points.L.y, Math.sqrt(3)) && near(sq.points.R.y, -Math.sqrt(3)) && near(sq.points.F.y, -Math.sqrt(3)) && near(sq.points.N.y, Math.sqrt(3)) && near(sq.points.T.y, Math.sqrt(3)), 'picks: left, right, far, near, toward')
}

/* --------------------------------------------------------------------- 2: the eleven constructions */
const answer = {
  copysegment: (c, p) => {
    const D = p[c.marks[0]]
    const exp = add(p.C, mul(unit(sub(p.E, p.C)), sep(p.A, p.B)))
    return sep(D, exp) < 1e-9
  },
  perpbisector: (c, p) => {
    const [u, v] = c.result[0]
    const mid = mul(add(p.A, p.B), 0.5)
    return sep(p.M, mid) < 1e-9 && Math.abs(dot(sub(p[v], p[u]), sub(p.B, p.A))) < 1e-8 * sep(p.A, p.B) * sep(p[u], p[v]) && near(sep(p[u], p.A), sep(p[u], p.B)) && near(sep(p[v], p.A), sep(p[v], p.B)) && sep(mul(add(p[u], p[v]), 0.5), mid) < 1e-9
  },
  equilateral: (c, p) => {
    const exp = add(p.A, rot(sub(p.B, p.A), 60))
    return sep(p[c.marks[0]], exp) < 1e-9
  },
  bisectangle: (c, p) => {
    const r = p[c.marks[0]]
    const dir = add(unit(sub(p.P, p.O)), unit(sub(p.Q, p.O)))
    const v = sub(r, p.O)
    return Math.abs(crs(dir, v)) < 1e-9 * len(dir) * len(v) && dot(dir, v) > 0
  },
  copyangle: (c, p) => {
    const theta = (Math.atan2(Math.abs(crs(sub(p.P, p.O), sub(p.Q, p.O))), dot(sub(p.P, p.O), sub(p.Q, p.O))) * 180) / Math.PI
    const exp = add(p.S, mul(rot(unit(sub(p.T, p.S)), theta), sep(p.O, p.P)))
    return sep(p[c.marks[0]], exp) < 1e-9
  },
  perpat: (c, p) => {
    const [u, v] = c.result[0]
    const d = sub(p[v], p[u])
    return Math.abs(dot(d, sub(p.B, p.A))) < 1e-8 * len(d) * sep(p.A, p.B) && Math.abs(crs(d, sub(p.C, p[u]))) < 1e-9 * len(d)
  },
  perpfrom: (c, p) => {
    const d = sub(p.B, p.A)
    const foot = add(p.A, mul(d, dot(sub(p.C, p.A), d) / dot(d, d)))
    return sep(p.F, foot) < 1e-9
  },
  parallel: (c, p) => {
    const q = p[c.marks[0]]
    return Math.abs(crs(sub(q, p.C), sub(p.B, p.A))) < 1e-9 * sep(q, p.C) * sep(p.A, p.B) && sep(q, p.C) > 0.1
  },
  angle90: (c, p) => {
    const u = p[c.marks[0]]
    return Math.abs(dot(sub(u, p.O), sub(p.A, p.O))) < 1e-9 * sep(u, p.O) * sep(p.A, p.O) && crs(sub(p.A, p.O), sub(u, p.O)) > 0
  },
  angle30: (c, p) => near(turnTo(sub(p.A, p.O), sub(p[c.marks[0]], p.O)), 30, 1e-8),
  angle45: (c, p) => near(turnTo(sub(p.A, p.O), sub(p[c.marks[0]], p.O)), 45, 1e-8),
}
const claimTol = { len: 1e-9, deg: 1e-8, ratio: 1e-9 }
const checkClaims = (c, built, label) => {
  for (const cl of c.claims(built.points)) {
    ok(Number.isFinite(cl.a) && Number.isFinite(cl.b) && near(cl.a, cl.b, claimTol[cl.unit]), `${label}: claim "${cl.label.en}" is ${cl.a} against ${cl.b}`)
    ok(cl.label.en.length > 0 && cl.label.id.length > 0, `${label}: claim has no label`)
  }
}
for (const id of M.CONSTRUCT_IDS) {
  const seen = new Set()
  for (let seed = 0; seed <= 60; seed++) {
    const c = M.make(id, seed)
    const label = `${id} (seed ${seed})`
    const built = checkLegal(c, label)
    ok(answer[id](c, built.points), `${label}: the finished figure disagrees with the answer worked out by formulas`)
    checkClaims(c, built, label)
    for (const [a, b] of [...c.base, ...c.result]) ok(a in built.points && b in built.points, `${label}: a drawn segment names a point that does not exist`)
    for (const m of c.marks) ok(m in built.points, `${label}: a mark that does not exist`)
    // distinct random inputs, and the same seed gives the same input
    seen.add(JSON.stringify(c.givens))
    ok(JSON.stringify(M.make(id, seed).givens) === JSON.stringify(c.givens), `${label}: the seed is not repeatable`)
  }
  ok(seen.size > 55, `${id}: the random inputs repeat (${seen.size} different)`)
}
ok(M.CONSTRUCT_IDS.length === 11, 'eleven constructions')

/* ----------------------------------------------------------------------------- 3: dividing a segment */
for (let n = 2; n <= 12; n++) {
  for (let seed = 0; seed <= 12; seed++) {
    const c = M.makeDivide(n, seed)
    const label = `divide ${n} (seed ${seed})`
    const built = checkLegal(c, label)
    const p = built.points
    ok(c.marks.length === n - 1, `${label}: ${c.marks.length} marks`)
    c.marks.forEach((name, i) => {
      const exp = add(p.A, mul(sub(p.B, p.A), (i + 1) / n))
      ok(sep(p[name], exp) < 1e-9, `${label}: mark ${name} is off the ${i + 1}/${n} point`)
    })
    checkClaims(c, built, label)
  }
}
let threw = false
for (const bad of [1, 0, 13, 2.5, -3]) {
  try {
    M.makeDivide(bad)
  } catch {
    threw = true
  }
  ok(threw, `makeDivide(${bad}) should throw`)
  threw = false
}

/* --------------------------------------------------------------------------------- the Python side */
const PY = String.raw`
import json, sys, math
from sympy import cos, pi, minimal_polynomial, symbols, degree, Integer
x = symbols('x')
data = json.load(sys.stdin)

def deg_cos(num, den):
    # the degree over the rationals of cos(pi * num / den)
    return degree(minimal_polynomial(cos(pi * Integer(num) / Integer(den)), x), x)

res = {}
res['cos'] = {str(n): int(deg_cos(n, 180)) for n in data['degs']}
res['third'] = {str(n): int(deg_cos(n, 540)) for n in data['thirds']}
def phi(n):
    return sum(1 for k in range(1, n + 1) if math.gcd(k, n) == 1)
res['poly'] = {str(n): int(deg_cos(2, n)) for n in data['polys']}
res['phi'] = [phi(n) for n in range(1, data['phimax'] + 1)]
json.dump(res, sys.stdout)
`
const degs = Array.from({ length: 179 }, (_, i) => i + 1)
const gcdJs = (a, b) => (b === 0 ? a : gcdJs(b, a % b))
// SymPy is slow for large degrees, and the degree of cos(2πk/m) depends only on the denominator m of k/m in lowest terms: ask for the smallest
// angle of each denominator, and for a few more angles with a denominator that is already there, to test that claim too
const reps = new Map() // denominator of n/360 -> the smallest n
for (const n of degs) {
  const m = 360 / gcdJs(n, 360)
  if (!reps.has(m)) reps.set(m, n)
}
const repsThird = new Map() // denominator of n/1080 -> the smallest n, only where SymPy can do it in reasonable time
for (const n of degs) {
  const m = 1080 / gcdJs(n, 1080)
  if (m <= 360 && !repsThird.has(m)) repsThird.set(m, n)
}
const extra = [7, 11, 13, 29, 37, 89, 101, 143, 151, 179, 17, 19, 23, 31, 41, 47, 53, 59, 61, 67, 71, 73, 79, 83, 97, 103, 107, 109, 113, 127, 131, 137, 139, 149, 157, 163, 167, 173]
const askDegs = [...new Set([...reps.values(), ...extra.filter((_, i) => i < 10)])]
const thirds = [...repsThird.values()]
const polys = Array.from({ length: 126 }, (_, i) => i + 3)
const PHIMAX = 3000
// no -I here: on a CI runner `pip install` puts SymPy in the user site, which isolated mode ignores
const py = spawnSync('python', ['-X', 'utf8', '-c', PY], { input: JSON.stringify({ degs: askDegs, thirds, polys, phimax: PHIMAX }), encoding: 'utf8', maxBuffer: 1 << 27, timeout: 560000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)
const isPow2 = (n) => n >= 1 && (n & (n - 1)) === 0

/* ----------------------------------------------------------------------------- 4: buildable angles */
for (const n of degs) {
  const degree = R.cos[reps.get(360 / gcdJs(n, 360))]
  const rule = n % 3 === 0
  ok(M.angleFieldDegree(n) === degree, `degree of cos ${n}°: ${M.angleFieldDegree(n)}, SymPy ${degree}`)
  if (String(n) in R.cos) ok(R.cos[n] === degree, `${n}°: SymPy gives ${R.cos[n]} for cos(${n}°) but ${degree} for another angle with the same denominator`)
  ok(isPow2(degree) === rule, `${n}°: SymPy degree ${degree} says ${isPow2(degree)}, but the multiples of 3 say ${rule}`)
  ok(M.isConstructibleDegree(n) === rule, `isConstructibleDegree(${n})`)
  const r = M.recipeFor(n)
  ok((r !== null) === rule, `${n}°: a recipe ${r === null ? 'is missing' : 'exists'}`)
  if (!rule) {
    ok(M.makeAngle(n) === null, `${n}°: a construction of an angle that cannot be built`)
    continue
  }
  ok(M.recipeDegrees(r) === n, `${n}°: the recipe makes ${M.recipeDegrees(r)}`)
  const lines = M.recipeLines(r)
  ok(lines.length > 0 && lines[lines.length - 1].deg === n, `${n}°: the recipe lines do not end at ${n}°`)
  lines.forEach((l, i) => {
    const earlier = new Set(lines.slice(0, i).map((x) => x.deg))
    ok(l.from.every((d) => earlier.has(d)), `${n}°: a recipe line uses an angle made later`)
    if (l.op === 'half') ok(near(l.from[0] / 2, l.deg, 1e-12), `${n}°: half of ${l.from[0]} is not ${l.deg}`)
    if (l.op === 'add') ok(near(l.from[0] + l.from[1], l.deg, 1e-12), `${n}°: ${l.from[0]} + ${l.from[1]} is not ${l.deg}`)
    if (l.op === 'sub') ok(near(l.from[0] - l.from[1], l.deg, 1e-12) && l.from[0] > l.from[1], `${n}°: ${l.from[0]} − ${l.from[1]} is not ${l.deg}`)
    if (l.op === 'base') ok([60, 90, 72].includes(l.deg), `${n}°: a base angle of ${l.deg}°`)
  })
  const c = M.makeAngle(n)
  const label = `angle ${n}°`
  const built = checkLegal(c, label)
  const T = built.points[c.marks[0]]
  ok(near(turnTo(built.points.A, T), n, 1e-8) && near(len(T), 1, 1e-9), `${label}: the finished ray makes ${turnTo(built.points.A, T)}° and the point is at distance ${len(T)}`)
  checkClaims(c, built, label)
  ok(c.steps.length < 400, `${label}: ${c.steps.length} steps`)
}
ok(M.recipeFor(0) === null && M.recipeFor(180) === null && M.recipeFor(2.5) === null && M.recipeFor(-3) === null && M.recipeFor(360) === null, 'recipes only for whole degrees from 1 to 179')
// the cheapest recipes are short, and the well-known ones are the textbook ones
ok(M.recipeFor(60).op === 'base' && M.recipeFor(90).op === 'base' && M.recipeFor(72).op === 'base', 'the three base angles are bases')
ok(M.recipeFor(30).op === 'half' && M.recipeFor(45).op === 'half' && M.recipeFor(120).op === 'add', '30° and 45° are halves, 120° is a sum')
ok(M.recipeLines(M.recipeFor(3)).length <= 7, 'a 3° recipe is short')
// for every whole degree to 359, the rule "multiple of 3" is the power-of-two rule (a second look, without SymPy)
for (let n = 1; n <= 359; n++) ok(M.isConstructibleDegree(n) === (n % 3 === 0), `${n}°: multiples of 3`)

/* ----------------------------------------------------------------------------------- 5: trisection */
for (const n of degs) {
  const ratio = M.trisectRatio(n)
  ok(ratio === 1 || ratio === 2 || ratio === 3, `trisect ratio of ${n}° is ${ratio}`)
  ok(M.isTrisectable(n) === (ratio !== 3), `isTrisectable(${n})`)
  if (n % 3 === 0) ok(M.isTrisectable(n) === (n % 9 === 0), `${n}°: trisectable exactly when 9 divides it (a buildable angle is trisected when a third of it is buildable)`)
  const degree = R.cos[reps.get(360 / gcdJs(n, 360))]
  const mThird = 1080 / gcdJs(n, 1080)
  if (repsThird.has(mThird)) {
    const exp = R.third[repsThird.get(mThird)] / degree
    ok(ratio === exp, `${n}°: the degree of cos(${n / 3}°) over cos(${n}°) is ${exp} by SymPy, ${ratio} here`)
  }
  // Archimedes' trisection with a marked ruler
  const nu = M.neusis(n)
  const D = nu.dPt
  ok(near(len(sub(nu.c, D)), 1, 1e-9) && near(len(nu.c), 1, 1e-9) && near(len(nu.b), 1, 1e-9), `${n}°: the ruler's marks are not 1 apart on the circle and the axis`)
  ok(Math.abs(crs(sub(nu.c, D), sub(nu.b, D))) < 1e-9 && dot(sub(nu.c, D), sub(nu.b, D)) > 0 && (len(sub(nu.c, nu.b)) > 1e-6 || n === 135), `${n}°: D, C, B are not on one ray from D, or C is B (only the tangent case 135° has C = B)`)
  ok(near(nu.angle, n / 3, 1e-8), `${n}°: the angle at D is ${nu.angle}, not ${n / 3}°`)
  ok(near(nu.d, 2 * Math.cos((n / 3 / 180) * Math.PI), 1e-8) && D.x < 0, `${n}°: OD is ${nu.d}, expected 2 cos(${n / 3}°)`)
}
ok(M.isTrisectable(60) === false && M.isTrisectable(90) === true && M.isTrisectable(180) === true && M.isTrisectable(45) === true && M.isTrisectable(3) === false, 'the classical cases: 60° cannot be trisected, 90° and 180° can')
for (const bad of [0, 180, -5, 200, NaN]) {
  let t = false
  try {
    M.neusis(bad)
  } catch {
    t = true
  }
  ok(t, `neusis(${bad}) should throw`)
}

/* --------------------------------------------------------------------------- 6: regular polygons */
const PUBLISHED = [3, 4, 5, 6, 8, 10, 12, 15, 16, 17, 20, 24, 30, 32, 34, 40, 48, 51, 60, 64, 68, 80, 85, 96, 102, 120]
ok(JSON.stringify(M.constructiblePolygons(120)) === JSON.stringify(PUBLISHED), `buildable polygons to 120: ${M.constructiblePolygons(120).join(', ')}`)
for (const n of polys) ok(M.isConstructiblePolygon(n) === isPow2(R.poly[n]), `${n}-gon: SymPy degree of cos(2π/${n}) is ${R.poly[n]}`)
for (let n = 3; n <= PHIMAX; n++) ok(M.isConstructiblePolygon(n) === isPow2(R.phi[n - 1]), `${n}-gon: φ(${n}) = ${R.phi[n - 1]}`)
for (let n = 1; n <= PHIMAX; n++) ok(M.totient(n) === R.phi[n - 1], `φ(${n}): ${M.totient(n)} against ${R.phi[n - 1]}`)
ok(M.isConstructiblePolygon(65537) && M.isConstructiblePolygon(257) && M.isConstructiblePolygon(65535) && !M.isConstructiblePolygon(65539) && !M.isConstructiblePolygon(9) && !M.isConstructiblePolygon(7) && !M.isConstructiblePolygon(2) && !M.isConstructiblePolygon(1), 'big and small polygons')
const f = M.polygonFactors(510)
ok(f.twos === 1 && JSON.stringify(f.fermat) === JSON.stringify([3, 5, 17]) && f.rest === 1, 'the factors of 510')
ok(M.polygonFactors(9).rest === 3 && M.polygonFactors(7).rest === 7 && M.polygonFactors(18).rest === 3, 'repeated and non-Fermat primes stay in the rest')

console.log(`construct check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
