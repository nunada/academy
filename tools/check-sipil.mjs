// The course "Derivatives in Civil Engineering" (src/content/turunan-teknik-sipil): every number a learner is asked for, and every number a scene prints.
//   node tools/check-sipil.mjs
//
// Nothing here trusts the formulas written in the lessons. Each answer is found again another way:
//   - a largest or smallest value by scanning the function itself on a fine grid and refining (no derivative is taken), then compared with the key;
//   - a derivative by central differences of the function it is the derivative of: the slope printed under the beam against the deflection printed beside
//     it, the moment against the slope, the shear against the moment, the load against the shear, the grade of the road against its elevation, the water
//     surface of the pond against its volume;
//   - a volume by measuring the triangles the scene draws (the water in the pond), a radius by measuring the distance from the circle's center to the road;
//   - the constraint of every optimization at every slider value (b² + h² = D², b·y = A, s²·h = V).
// It also checks what a lesson must have: a hint on every quiz, fill and order step, a scene in every lesson, and Indonesian text written the Indonesian way.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sipil-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [`export { modules } from '${q('src/content/turunan-teknik-sipil/index.ts')}'`, `export { SCENES } from '${q('src/content/turunan-teknik-sipil/scenes.ts')}'`, `export * from '${q('src/lib/scene3d.ts')}'`, `export { COURSES } from '${q('src/content/catalog.ts')}'`, `export { isRight } from '${q('src/lib/answer.ts')}'`, `export { evaluateAt } from '${q('src/lib/expr.ts')}'`].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const C = await import('file://' + outFile.split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

let bad = 0
let checks = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 40) console.error('FAIL: ' + m)
  }
  return c
}
const near = (a, b, tol) => Math.abs(a - b) <= tol

/* ------------------------------------------------------------------------ our own tools */
/** The place and the value of the largest (sign = 1) or smallest (sign = -1) value of f on [a, b]: a grid, then a golden-section refinement. */
function extreme(f, a, b, sign = 1) {
  const N = 20000
  let best = a
  for (let i = 0; i <= N; i++) {
    const x = a + ((b - a) * i) / N
    if (sign * f(x) > sign * f(best)) best = x
  }
  let lo = Math.max(a, best - (b - a) / N)
  let hi = Math.min(b, best + (b - a) / N)
  const g = (Math.sqrt(5) - 1) / 2
  for (let k = 0; k < 80; k++) {
    const x1 = hi - g * (hi - lo)
    const x2 = lo + g * (hi - lo)
    if (sign * f(x1) > sign * f(x2)) hi = x2
    else lo = x1
  }
  const x = (lo + hi) / 2
  return { x, value: f(x) }
}
const d1 = (f, x, h = 1e-4) => (f(x + h) - f(x - h)) / (2 * h)
const d2 = (f, x, h = 1e-3) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h)

/* ------------------------------------------------------------------------ the steps, by name */
const lessons = {}
const projects = {}
const allSteps = []
for (const m of C.modules)
  for (const s of m.submodules) {
    for (const l of s.lessons) {
      lessons[l.id] = Object.fromEntries(l.steps.map((st) => [st.id, st]))
      for (const st of l.steps) allSteps.push([l.id, st])
    }
    projects[s.project.id] = s.project
  }
const step = (lesson, id) => {
  const st = lessons[lesson]?.[id]
  if (!st) throw new Error(`no step ${lesson}/${id}`)
  return st
}
/** The key of a math step or a project task agrees with the numbers found here, within the step's own tolerance (and the key is accepted by the marker). */
function key(where, blanks, found) {
  ok(blanks.length === found.length, `${where}: ${blanks.length} boxes, ${found.length} values found`)
  blanks.forEach((b, i) => {
    const tol = b.tol ?? Math.abs(b.answer) * 0.005
    ok(near(b.answer, found[i], Math.max(tol / 4, 1e-9)), `${where} box ${i + 1}: the key is ${b.answer}, found ${found[i]}`)
    ok(tol > 0 && tol <= 0.04 * Math.abs(b.answer), `${where} box ${i + 1}: tolerance ${tol} for an answer ${b.answer}`)
    ok(C.isRight(String(found[i].toFixed(6)), b.answer, b.tol) && !C.isRight(String((found[i] * 1.2 + 1).toFixed(4)), b.answer, b.tol), `${where} box ${i + 1}: the marker accepts the value and refuses a wrong one`)
  })
}
const mathKey = (lesson, id, found) => key(`${lesson}/${id}`, step(lesson, id).blanks, found)
const taskKey = (project, n, found) => key(`${project} task ${n}`, projects[project].tasks[n - 1].blanks, found)
const fillKey = (lesson, id, want) => ok(JSON.stringify(step(lesson, id).blanks) === JSON.stringify(want), `${lesson}/${id}: blanks ${JSON.stringify(step(lesson, id).blanks)}, found ${JSON.stringify(want)}`)

/* --------------------------------------------------------------------------------- beams */
const EI = 20000
{
  // the simply supported beam under a uniform load: the deflection from the handbook, and everything else by differences
  const w = 10
  const Lb = 6
  const y = (x) => (-w * x * (Lb ** 3 - 2 * Lb * x * x + x ** 4 / x)) / (24 * EI)
  const yy = (x) => (-w * (Lb ** 3 * x - 2 * Lb * x ** 3 + x ** 4)) / (24 * EI)
  ok(near(y(3), yy(3), 1e-15), 'two ways of writing the deflection')
  ok(near(yy(0), 0, 1e-15) && near(yy(6), 0, 1e-12), 'the beam does not move at its supports')
  mathKey('sip-m1-s1-l1', 'm1', [1000 * Math.abs(yy(3))])
  ok(near(1000 * Math.abs(yy(3)), (1000 * 5 * w * Lb ** 4) / (384 * EI), 1e-9), 'the midspan sag is 5wL⁴/384EI')
  mathKey('sip-m1-s1-l1', 'm2', [d1(yy, 0)])
  // EI·y'' = M = -5x² + 30x, so the blanks are -5 and 30
  for (const x of [0.5, 1, 2, 3, 4.5, 5.5]) ok(near(EI * d2(yy, x), -5 * x * x + 30 * x, 1e-3), `EI·y'' at ${x} is ${EI * d2(yy, x)}, the lesson says ${-5 * x * x + 30 * x}`)
  fillKey('sip-m1-s1-l1', 'f1', ['-5', '30'])
  // the table of the lesson: EI·y and EI·y'
  for (const x of [1, 2.5, 4]) {
    ok(near(EI * yy(x), (-5 / 12) * x ** 4 + 5 * x ** 3 - 90 * x, 1e-9), `EI·y at ${x}`)
    ok(near(EI * d1(yy, x), (-5 / 3) * x ** 3 + 15 * x * x - 90, 1e-4), `EI·y' at ${x}`)
  }
  // the slope is zero at the middle and nowhere else inside
  ok(near(d1(yy, 3), 0, 1e-9) && near(extreme(yy, 0, 6, -1).x, 3, 1e-4), 'the sag is largest at the middle, where the slope is zero')
  ok(step('sip-m1-s1-l1', 'q1').answer === 0 && step('sip-m1-s1-l1', 'q2').answer === 0, 'quiz keys of lesson 1')

  // the scene: its readouts against each other
  const sc = C.SCENES.beamScene
  const r = (i, v) => C.readoutValue(sc.readouts[i], v)
  for (const ww of [2, 7, 10, 20])
    for (const p of [0.3, 1.5, 3, 4.2, 5.9]) {
      const v = { w: ww, p }
      const yb = (x) => (-ww * (216 * x - 12 * x ** 3 + x ** 4)) / (24 * EI)
      ok(near(r(0, v), 1000 * yb(p), 1e-9), `beam scene: deflection at w=${ww}, x=${p}`)
      ok(near(r(1, v), 1000 * d1(yb, p), 1e-5), `beam scene: the slope is the derivative of the deflection (w=${ww}, x=${p})`)
      ok(near(r(2, v), EI * d2(yb, p), 2e-3), `beam scene: the moment is EI times the second derivative (w=${ww}, x=${p})`)
      // and directly between the readouts: d(deflection)/dx = slope
      const dy = (C.readoutValue(sc.readouts[0], { w: ww, p: p + 1e-4 }) - C.readoutValue(sc.readouts[0], { w: ww, p: p - 1e-4 })) / 2e-4
      ok(near(dy, r(1, v), 1e-5), 'beam scene: the two readouts agree')
    }
  // the beam that is drawn sags 100 times the real amount, and the dot sits on it
  const res = C.resolveScene(sc, { w: 10, p: 3 })
  ok(near(res.balls[0].at[2], 100 * yy(3), 1e-9) && near(res.balls[0].at[0], 3, 1e-12), 'beam scene: the dot is on the beam, drawn 100 times too low')
  // the two supports are under the ends of the span, their tips touching the underside of the beam
  for (const scene of [sc, C.SCENES.loadScene]) {
    const drawn = C.resolveScene(scene, C.startValues(scene))
    const wedges = drawn.meshes.filter((m) => m.color === 'concrete')
    const tip = (m) => {
      let best = 0
      for (let i = 0; i < m.positions.length; i += 3) if (m.positions[i + 2] > m.positions[best + 2]) best = i
      return [m.positions[best], m.positions[best + 2]]
    }
    const girder = drawn.meshes.find((m) => m.color === 'steel')
    const under = (x) => Math.min(...girder.positions.filter((_, i) => i % 3 === 2 && Math.abs(girder.positions[i - 2] - x) < 1e-9))
    ok(wedges.length === 2 && near(tip(wedges[0])[0], 0, 1e-12) && near(tip(wedges[1])[0], Lb, 1e-12), 'the supports are at the two ends of the span')
    ok(near(tip(wedges[0])[1], under(0), 1e-9) && near(tip(wedges[1])[1], under(Lb), 1e-9), 'the supports touch the underside of the beam')
  }
  const beam = res.meshes.find((m) => m.color === 'steel')
  let lowest = 0
  for (let i = 0; i < beam.positions.length; i += 3) if (Math.abs(beam.positions[i] - 3) < 1e-9) lowest = Math.max(-1e9, Math.min(lowest, beam.positions[i + 2] + 0))
  ok(near(Math.max(...beam.positions.filter((_, i) => i % 3 === 2 && Math.abs(beam.positions[i - 2] - 3) < 1e-9)), 100 * yy(3), 1e-9), 'beam scene: the top of the beam at the middle')
}
{
  // shear and load
  const M = (x) => 30 * x - 5 * x * x
  for (const x of [0.5, 2, 3, 5]) {
    ok(near(d1(M, x), 30 - 10 * x, 1e-6), `V = M' at ${x}`)
    ok(near(-d2(M, x), 10, 1e-4), `q = -V' at ${x}`)
  }
  // the load that grows: M = 12x - x³/3 comes from the reactions, found here from equilibrium
  const w0 = 12
  const Lb = 6
  const RA = (w0 * Lb) / 6 // the left reaction of a triangular load that peaks on the right
  const Mtri = (x) => RA * x - (w0 * x ** 3) / (6 * Lb)
  for (const x of [0, 1, 3.3, 6]) ok(near(Mtri(x), 12 * x - x ** 3 / 3, 1e-9), `the moment of the growing load at ${x}`)
  ok(near(Mtri(6), 0, 1e-9), 'the moment is zero at the far support')
  const top = extreme(Mtri, 0, 6)
  ok(near(top.x, Math.sqrt(12), 1e-5) && near(top.value, 8 * Math.sqrt(12), 1e-8), `the largest moment is ${top.value} at ${top.x}`)
  const text = step('sip-m1-s1-l2', 'c2').body
  ok(text.en.includes('3.46') && text.en.includes('27.71') && text.id.includes('3{,}46') && text.id.includes('27{,}71'), 'the lesson quotes 3.46 and 27.71')
  ok(near(top.x, 3.46, 0.005) && near(top.value, 27.71, 0.005), 'and they are right')
  fillKey('sip-m1-s1-l2', 'f1', ['12', '2'])
  for (const x of [1, 2.5, 5]) ok(near(d1(Mtri, x), 12 - x * x, 1e-6) && near(-d2(Mtri, x), 2 * x, 1e-4), `V and q of the growing load at ${x}`)
  const m1 = extreme((x) => 20 * x - 2 * x * x, 0, 10)
  mathKey('sip-m1-s1-l2', 'm1', [m1.x, m1.value])
  const m2 = extreme((x) => 9 * x - x ** 3 / 9, 0, 9)
  mathKey('sip-m1-s1-l2', 'm2', [m2.x, m2.value])
  // that M is the moment of a load growing to 6 kN/m on 9 m
  ok(near(9 * 4 - 4 ** 3 / 9, ((6 * 9) / 6) * 4 - (6 * 4 ** 3) / (6 * 9), 1e-9), 'lesson 2, m2: the moment formula belongs to the load described')
  ok(step('sip-m1-s1-l2', 'q1').answer === 0, 'quiz key of lesson 2')
  const lines = step('sip-m1-s1-l2', 'o1').lines.en
  ok(lines.length === 5 && lines[0].includes("M'(x)=12-x^2") && lines[4].includes('27.71'), 'the order step ends on the largest moment')

  const sc = C.SCENES.loadScene
  for (const p of [0.2, 1, 2, 3.4641, 5, 5.9]) {
    const at = (pp, i) => C.readoutValue(sc.readouts[i], { p: pp })
    ok(near((at(p + 1e-4, 2) - at(p - 1e-4, 2)) / 2e-4, at(p, 1), 1e-5), `load scene: the shear is the derivative of the moment at ${p}`)
    ok(near(-(at(p + 1e-4, 1) - at(p - 1e-4, 1)) / 2e-4, at(p, 0), 1e-5), `load scene: the load is minus the derivative of the shear at ${p}`)
    ok(near(at(p, 2), Mtri(p), 1e-9), `load scene: the moment at ${p}`)
  }
  // the diagrams drawn are those functions: the moment curve hangs below its baseline by M/28, the shear curve stands on its own by V/24
  const res = C.resolveScene(sc, { p: 2 })
  const curveM = res.lines.find((l) => l.color === 'result' && l.points.length > 10)
  const curveV = res.lines.find((l) => l.color === 'c' && l.points.length > 10)
  ok(curveM.points.every((pt) => near(pt[2], -1.6 - Mtri(pt[0]) / 28, 1e-9)) && curveV.points.every((pt) => near(pt[2], -3.6 + (12 - pt[0] ** 2) / 24, 1e-9)), 'load scene: the two diagrams are M and V')
  // the two dots ride on the diagrams at the section being read
  for (const p of [0, 1.3, 3.4641, 6]) {
    const balls = C.resolveScene(sc, { p }).balls
    ok(balls.length === 2 && near(balls[0].at[0], p, 1e-12) && near(balls[0].at[2], -1.6 - Mtri(p) / 28, 1e-9) && near(balls[1].at[0], p, 1e-12) && near(balls[1].at[2], -3.6 + (12 - p * p) / 24, 1e-9), `load scene: the dots are on M and V at ${p}`)
  }
  // the arrows are as long as the load is large: each starts 0.12 + q/10 above the beam, where q = w0·x/L, and ends just above it
  const loadAt = (x) => (w0 * x) / Lb
  const arrowParts = res.meshes.filter((m) => m.color === 'b')
  ok(arrowParts.length === 16, 'load scene: eight arrows')
  for (let i = 0; i < 8; i++) {
    const x = 0.5 + (5.5 * i) / 7
    const [shaft, head] = [arrowParts[2 * i], arrowParts[2 * i + 1]]
    const zs = (m) => m.positions.filter((_, k) => k % 3 === 2)
    const xs = shaft.positions.filter((_, k) => k % 3 === 0)
    ok(near((Math.min(...xs) + Math.max(...xs)) / 2, x, 1e-9) && near(Math.max(...zs(shaft)), 0.12 + loadAt(x) / 10, 1e-9) && near(Math.min(...zs(head)), 0.04, 1e-9), `load scene: the arrow at ${x.toFixed(2)} is as long as the load there`)
  }
  const envelope = res.lines.find((l) => l.color === 'b')
  ok(envelope.points.length === 2 && envelope.points.every((pt) => near(pt[2], 0.12 + loadAt(pt[0]) / 10, 1e-12)) && envelope.points[1][0] === Lb, 'load scene: the line over the arrows is the load')

  // the project
  const yc = (x) => (-8 * x * x * (6 * 9 - 4 * 3 * x + x * x)) / (24 * EI)
  taskKey('sip-m1-s1-p', 1, [1000 * Math.abs(yc(3))])
  ok(near(1000 * Math.abs(yc(3)), (1000 * 8 * 3 ** 4) / (8 * EI), 1e-9) && near(yc(0), 0, 1e-15) && near(d1(yc, 0), 0, 1e-9), 'the cantilever: wL⁴/8EI at the tip, fixed and level at the wall')
  for (const x of [0.5, 1.5, 2.5]) ok(near(EI * d2(yc, x), -4 * (3 - x) ** 2, 2e-3), `the cantilever: EI·y'' is the moment given, at ${x}`)
  taskKey('sip-m1-s1-p', 2, [d1((x) => -4 * (3 - x) ** 2, 0)])
  taskKey('sip-m1-s1-p', 3, [extreme((x) => 48 * x - 6 * x * x, 0, 8).value])
  const t4 = extreme((x) => 18 * x - x ** 3 / 2, 0, 6)
  taskKey('sip-m1-s1-p', 4, [t4.x, t4.value])
}

/* ------------------------------------------------------------------------- the log and the tank */
{
  const S = (D) => (b) => (b * (D * D - b * b)) / 6
  const I = (D) => (b) => (b * (D * D - b * b) ** 1.5) / 12
  const strongest = (D) => extreme(S(D), 0, D)
  const stiffest = (D) => extreme(I(D), 0, D)
  const h = (D, b) => Math.sqrt(D * D - b * b)
  // the lesson's own numbers for the 30 cm log
  const s30 = strongest(30)
  ok(near(s30.x, 10 * Math.sqrt(3), 1e-4) && near(h(30, s30.x) / s30.x, Math.SQRT2, 1e-4) && near(s30.value, 1000 * Math.sqrt(3), 1e-3), `the strongest beam of a 30 cm log: b=${s30.x}, S=${s30.value}`)
  const c2 = step('sip-m1-s2-l1', 'c2').body
  ok(c2.en.includes('17.32') && c2.en.includes('24.49') && c2.en.includes('1732') && c2.id.includes('17{,}32') && c2.id.includes('24{,}49'), 'lesson 3 quotes 17.32, 24.49 and 1732')
  ok(near(s30.x, 17.32, 0.005) && near(h(30, s30.x), 24.49, 0.005) && near(s30.value, 1732, 0.6), 'and they are right')
  fillKey('sip-m1-s2-l1', 'f1', ['150', '2', '300'])
  for (const b of [5, 12, 20]) ok(near(d1(S(30), b), 150 - (b * b) / 2, 1e-6), `S'(b) at ${b}`)
  ok(near(s30.x ** 2, 300, 1e-2), 'b² = 300')
  // the plank on edge and flat, and the quiz
  ok(near((10 * 400) / 6, 667, 0.5) && near((20 * 100) / 6, 333, 0.5), 'the plank: 667 and 333')
  const q1 = step('sip-m1-s2-l1', 'q1')
  ok(near((12 * 36 * 36) / 6 / ((12 * 18 * 18) / 6), 4, 1e-12) && q1.options[q1.answer].en === '4 times' && near((12 * 18 * 18) / 6, 648, 1e-9) && near((12 * 36 * 36) / 6, 2592, 1e-9), 'quiz: four times, 648 to 2592')
  ok(step('sip-m1-s2-l1', 'q2').answer === 0 && S(30)(0) === 0 && near(S(30)(30), 0, 1e-9), 'quiz 2: zero at both ends')
  const s45 = strongest(45)
  mathKey('sip-m1-s2-l1', 'm1', [s45.x, h(45, s45.x)])
  mathKey('sip-m1-s2-l1', 'm2', [s30.value])

  const i30 = stiffest(30)
  ok(near(i30.x, 15, 1e-4) && near(h(30, i30.x), 15 * Math.sqrt(3), 1e-3) && near(h(30, i30.x) / i30.x, Math.sqrt(3), 1e-4), `the stiffest beam of a 30 cm log: b=${i30.x}`)
  const c1 = step('sip-m1-s2-l2', 'c1').body
  ok(c1.en.includes('21\\,921') && c1.en.includes('21\\,213') && c1.id.includes('21.921') && c1.id.includes('21.213') && c1.en.includes('25.98'), 'lesson 4 quotes 21 921, 21 213 and 25.98')
  ok(near(i30.value, 21921, 0.6) && near(I(30)(s30.x), 21213, 0.6) && near(100 * (1 - I(30)(s30.x) / i30.value), 3.2, 0.1), `and they are right: ${i30.value}, ${I(30)(s30.x)}`)
  for (const b of [6, 15, 22]) ok(near(d1(I(30), b), ((900 - b * b) ** 0.5 * (900 - 4 * b * b)) / 12, 1e-4), `I'(b) at ${b}`)
  ok(step('sip-m1-s2-l2', 'q1').answer === 0 && h(30, i30.x) > h(30, s30.x), 'the stiffest is the deeper')
  const i40 = stiffest(40)
  mathKey('sip-m1-s2-l2', 'm1', [i40.x, h(40, i40.x)])

  // the tank
  const A = (V) => (s) => s * s + (4 * V) / s
  const t32 = extreme(A(32), 0.5, 20, -1)
  ok(near(t32.x, 4, 1e-4) && near(t32.value, 48, 1e-6) && near(32 / t32.x ** 2, 2, 1e-4), `the tank of 32 m³: s=${t32.x}, A=${t32.value}`)
  const c2t = step('sip-m1-s2-l2', 'c2').body
  ok(c2t.en.includes('51.7') && c2t.en.includes('57.3') && c2t.id.includes('51{,}7') && near(A(32)(3), 51.7, 0.05) && near(A(32)(6), 57.3, 0.05), 'lesson 4 quotes 51.7 and 57.3, and they are right')
  fillKey('sip-m1-s2-l2', 'f1', ['2', '128'])
  for (const s of [2, 4, 7]) ok(near(d1(A(32), s), 2 * s - 128 / (s * s), 1e-6) && d2(A(32), s) > 0 && near(d2(A(32), s), 2 + 256 / s ** 3, 1e-3), `A' and A'' at ${s}`)
  const t108 = extreme(A(108), 0.5, 30, -1)
  mathKey('sip-m1-s2-l2', 'm2', [t108.x, 108 / t108.x ** 2])

  // the project
  const s24 = strongest(24)
  taskKey('sip-m1-s2-p', 1, [s24.x, h(24, s24.x)])
  const i24 = stiffest(24)
  taskKey('sip-m1-s2-p', 2, [i24.x, h(24, i24.x)])
  for (const D of [24, 30, 77]) ok(near((100 * I(D)(strongest(D).x)) / stiffest(D).value, 96.7735, 1e-2), `the strongest beam has 96.77% of the largest I, for D=${D}`)
  taskKey('sip-m1-s2-p', 3, [(100 * I(30)(s30.x)) / i30.value])
  const t135 = extreme(A(13.5), 0.5, 20, -1)
  taskKey('sip-m1-s2-p', 4, [t135.x, t135.value])

  // the scenes
  for (const name of ['logStrengthScene', 'logStiffnessScene']) {
    const sc = C.SCENES[name]
    for (const b of [4, 10, 17.5, 28]) {
      const hh = C.readoutValue(sc.readouts[0], { b })
      ok(near(b * b + hh * hh, 900, 1e-9), `${name}: b² + h² = 900 at b=${b}`)
      const res = C.resolveScene(sc, { b })
      const box = res.meshes.find((m) => m.opacity === 1)
      const ys = box.positions.filter((_, i) => i % 3 === 1)
      const zs = box.positions.filter((_, i) => i % 3 === 2)
      ok(near(Math.max(...ys) - Math.min(...ys), b, 1e-9) && near(Math.max(...zs) - Math.min(...zs), hh, 1e-9), `${name}: the beam drawn is b by h`)
      ok(near(Math.hypot(Math.max(...ys), Math.max(...zs)), 15, 1e-9), `${name}: its corners are on the log`)
    }
  }
  const ls = C.SCENES.logStrengthScene
  for (const b of [6, 17.3205, 25]) {
    const v = { b }
    ok(near(C.readoutValue(ls.readouts[1], v), S(30)(b), 1e-9) && near(C.readoutValue(ls.readouts[2], v), (100 * S(30)(b)) / s30.value, 1e-3), `log scene: S and its share at b=${b}`)
    ok(near(C.readoutValue(C.SCENES.logStiffnessScene.readouts[1], v), I(30)(b), 1e-6), `log scene: I at b=${b}`)
  }
  // the log drawn is 30 cm across, and the stiffness scene prints S as well
  for (const name of ['logStrengthScene', 'logStiffnessScene']) {
    const log = C.resolveScene(C.SCENES[name], { b: 12 }).meshes.find((m) => m.opacity < 1)
    let widest = 0
    for (let i = 0; i < log.positions.length; i += 3) widest = Math.max(widest, Math.hypot(log.positions[i + 1], log.positions[i + 2]))
    ok(near(widest, 15, 1e-9), `${name}: the log drawn has radius ${widest}`)
  }
  for (const b of [6, 15, 25]) ok(near(C.readoutValue(C.SCENES.logStiffnessScene.readouts[2], { b }), S(30)(b), 1e-9), `stiffness scene: S at b=${b}`)
  // the graph of the quiz is S(b), with its dot on the top of it
  {
    const fig = step('sip-m1-s2-l1', 'q2').figure
    const graph = fig.items.find((it) => it.t === 'curve')
    const dot = fig.items.find((it) => it.t === 'dot')
    for (const b of [3, 11, 17.3, 26]) ok(near(C.evaluateAt(graph.f, { x: b }), S(30)(b), 1e-9), `the graph of the quiz is S(b) at ${b}`)
    ok(near(dot.x, s30.x, 1e-3) && near(dot.y, s30.value, 0.05) && fig.ySpan[1] > s30.value && fig.xSpan[1] >= 30, `the dot of the quiz is at the top: (${dot.x}, ${dot.y})`)
  }
  const ts = C.SCENES.tankScene
  for (const s of [2.5, 4, 6.3, 8]) {
    const hh = C.readoutValue(ts.readouts[0], { s })
    ok(near(s * s * hh, 32, 1e-9) && near(C.readoutValue(ts.readouts[1], { s }), s * s + 4 * s * hh, 1e-9), `tank scene: s²h = 32 and the area at s=${s}`)
    const water = C.resolveScene(ts, { s }).meshes.find((m) => m.color === 'water')
    ok(near(C.meshVolume(water), 0.97 * 32, 1e-9), `tank scene: the water drawn is 97% of 32 m³ at s=${s}`)
    // the four walls rise to h and leave a square of side s between them; the water stands between them
    const drawn = C.resolveScene(ts, { s })
    const walls = drawn.meshes.filter((m) => m.color === 'concrete' && m.opacity < 1)
    const span = (m, k) => {
      const v = m.positions.filter((_, i) => i % 3 === k)
      return [Math.min(...v), Math.max(...v)]
    }
    ok(walls.length === 4 && walls.every((m) => near(span(m, 2)[1], hh, 1e-9) && near(span(m, 2)[0], 0, 1e-12)), `tank scene: the walls are h high at s=${s}`)
    ok(near(span(water, 0)[0], -s / 2, 1e-9) && near(span(water, 0)[1], s / 2, 1e-9) && near(span(water, 1)[1] - span(water, 1)[0], s, 1e-9) && span(water, 2)[1] < hh, `tank scene: the water fills the square of side s, below the rim, at s=${s}`)
    ok(near(Math.max(...walls.map((m) => span(m, 0)[0])), s / 2, 1e-9) && near(Math.min(...walls.map((m) => span(m, 0)[1])), -s / 2, 1e-9), `tank scene: the walls stand just outside the water at s=${s}`)
  }
}

/* ------------------------------------------------------------------------------- water */
{
  const manning = (A, P, n = 0.015, S = 0.001) => (1 / n) * A * (A / P) ** (2 / 3) * Math.sqrt(S)
  const Prect = (A) => (y) => A / y + 2 * y
  const r8 = extreme(Prect(8), 0.2, 20, -1)
  ok(near(r8.x, 2, 1e-4) && near(r8.value, 8, 1e-6) && near(8 / r8.x, 4, 1e-3), `the rectangular channel of 8 m²: y=${r8.x}`)
  const c2 = step('sip-m2-s1-l1', 'c2').body
  ok(c2.en.includes('16.87') && c2.id.includes('16{,}87') && near(manning(8, 8), 16.87, 0.005), `Q = ${manning(8, 8)}, the lesson says 16.87`)
  for (const y of [1, 2, 3.5]) ok(near(d1(Prect(8), y), -8 / (y * y) + 2, 1e-6) && near(d2(Prect(8), y), 16 / y ** 3, 1e-3), `P' and P'' at ${y}`)
  fillKey('sip-m2-s1-l1', 'f1', ['8', '2'])
  // the quiz: 8 m against 10 m, "about 16% more"
  ok(near((manning(8, 8) / manning(8, 10) - 1) * 100, 16, 0.5) && step('sip-m2-s1-l1', 'q1').answer === 0, 'quiz: the channel with P = 8 carries about 16% more')
  // trapezoids
  const Ptrap = (A, m) => (y) => A / y - m * y + 2 * y * Math.sqrt(1 + m * m)
  const best = (A, m) => extreme(Ptrap(A, m), 0.3, 6, -1)
  const c3 = step('sip-m2-s1-l1', 'c3').body
  for (const [m, y, P] of [[0, '2.45', '9.80'], [1, '2.56', '9.37'], [1 / Math.sqrt(3), '2.63', '9.12']]) {
    const b = best(12, m)
    ok(near(b.x, Number(y), 0.006) && near(b.value, Number(P), 0.006), `the table: m=${m.toFixed(2)} gives y=${b.x.toFixed(3)}, P=${b.value.toFixed(3)}; the lesson says ${y}, ${P}`)
    ok(c3.en.includes(`$${y}$ m | $${P}$ m`) && c3.id.includes(`$${y.replace('.', '{,}')}$ m | $${P.replace('.', '{,}')}$ m`), `the table row ${y} | ${P} is in both languages`)
    ok(near(b.x, Math.sqrt(12 / (2 * Math.sqrt(1 + m * m) - m)), 1e-4), 'the formula for the best depth')
  }
  // of all side slopes, 1/√3 is the best
  const bestM = extreme((m) => best(12, m).value, 0, 2, -1)
  ok(near(bestM.x, 1 / Math.sqrt(3), 2e-3) && step('sip-m2-s1-l1', 'q2').answer === 0, `the best side slope is ${bestM.x}`)
  {
    // half a regular hexagon: the bottom is as long as each bank
    const m = 1 / Math.sqrt(3)
    const b = best(12, m)
    const bottom = 12 / b.x - m * b.x
    ok(near(bottom, b.x * Math.sqrt(1 + m * m), 1e-3), 'at the best slope the bottom is as long as a bank')
  }
  const r18 = extreme(Prect(18), 0.2, 30, -1)
  mathKey('sip-m2-s1-l1', 'm1', [r18.x, 18 / r18.x])
  const t12 = best(12, 1)
  mathKey('sip-m2-s1-l1', 'm2', [t12.x, t12.value])

  // the pond
  const V = (h) => 200 * h + 60 * h * h + (16 / 3) * h ** 3
  const As = (h) => (20 + 4 * h) * (10 + 4 * h)
  for (const h of [0.2, 1, 2, 3]) ok(near(d1(V, h), As(h), 1e-5), `dV/dh is the water surface at h=${h}`)
  // the volume formula itself, against a sum of thin layers
  {
    let sum = 0
    const N = 20000
    for (let i = 0; i < N; i++) sum += As(((i + 0.5) * 3) / N) * (3 / N)
    ok(near(sum, V(3), 1e-4) && near(V(3), 1284, 1e-9), `the volume to 3 m is ${V(3)} (layers: ${sum})`)
  }
  fillKey('sip-m2-s1-l2', 'f1', ['120', '16'])
  const c2p = step('sip-m2-s1-l2', 'c2').body
  ok(c2p.en.includes('1.79') && c2p.en.includes('1.19') && c2p.en.includes('214') && c2p.id.includes('1{,}79'), 'lesson 6 quotes 1.79, 1.19 and 214')
  ok(near((100 * 6) / As(1), 1.79, 0.005) && near((100 * 6) / As(2), 1.19, 0.005) && near(V(3) / 6, 214, 1e-9) && As(1) === 336 && As(2) === 504, 'and they are right')
  mathKey('sip-m2-s1-l2', 'm1', [(100 * 6) / As(2)])
  // the trough: a triangle 2 wide and 1 deep, 6 long; the volume by its own geometry, the rate by a difference
  const Vt = (h) => 6 * ((2 * h * h) / 2)
  ok(near(Vt(0.5), 6 * 0.5 * 0.5, 1e-12), 'the trough holds 6h²')
  mathKey('sip-m2-s1-l2', 'm2', [(100 * 0.3) / d1(Vt, 0.5)])
  ok(step('sip-m2-s1-l2', 'q1').answer === 0 && As(2) > As(1), 'quiz: the level rises more slowly')
  const order = step('sip-m2-s1-l2', 'o1').lines
  ok(order.en.length === 5 && order.id.length === 5 && /Differentiate/.test(order.en[2]) && /values at the instant/.test(order.en[3]), 'the order step: differentiate, then substitute')

  // the project
  const r125 = extreme(Prect(12.5), 0.2, 20, -1)
  taskKey('sip-m2-s1-p', 1, [r125.x, 12.5 / r125.x])
  taskKey('sip-m2-s1-p', 2, [manning(12.5, r125.value)])
  ok(near(r125.value, 10, 1e-6), 'the task gives P = 10')
  taskKey('sip-m2-s1-p', 3, [(100 * 6) / As(3)])
  taskKey('sip-m2-s1-p', 4, [V(3) / 6])

  // the scenes
  const cs = C.SCENES.channelScene
  for (const d of [0.8, 2, 3.3, 5]) {
    const b = C.readoutValue(cs.readouts[0], { d })
    const P = C.readoutValue(cs.readouts[1], { d })
    ok(near(b * d, 8, 1e-9) && near(P, b + 2 * d, 1e-9) && near(C.readoutValue(cs.readouts[2], { d }), manning(8, P), 1e-9), `channel scene: b·y = 8, P and Q at y=${d}`)
    const water = C.resolveScene(cs, { d }).meshes.find((m) => m.color === 'water')
    ok(near(C.meshVolume(water), 8 * 12, 1e-9), `channel scene: the water drawn has a cross-section of 8 m² at y=${d}`)
  }
  const tsn = C.SCENES.trapezoidScene
  for (const d of [1, 1.8, 2.7])
    for (const m of [0, 0.6, 1, 1.5]) {
      const v = { d, m }
      const b = C.readoutValue(tsn.readouts[0], v)
      const P = C.readoutValue(tsn.readouts[1], v)
      ok(b > 0 && near((b + m * d) * d, 12, 1e-9) && near(P, b + 2 * d * Math.sqrt(1 + m * m), 1e-9) && near(C.readoutValue(tsn.readouts[2], v), manning(12, P), 1e-9), `trapezoid scene at y=${d}, m=${m}`)
      const water = C.resolveScene(tsn, v).meshes.find((mm) => mm.color === 'water')
      ok(near(C.meshVolume(water), 12 * 12, 1e-9), `trapezoid scene: the water drawn has a cross-section of 12 m² at y=${d}, m=${m}`)
    }
  const ps = C.SCENES.pondScene
  for (const h of [0.1, 1, 2.2, 3])
    for (const qq of [2, 6, 12]) {
      const v = { h, q: qq }
      ok(near(C.readoutValue(ps.readouts[0], v), As(h), 1e-9) && near(C.readoutValue(ps.readouts[1], v), V(h), 1e-9) && near(C.readoutValue(ps.readouts[2], v), (100 * qq) / As(h), 1e-9), `pond scene at h=${h}, Q=${qq}`)
      const water = C.resolveScene(ps, v).meshes.find((m) => m.color === 'water')
      ok(near(C.meshVolume(water), V(h), 1e-6), `pond scene: the water drawn has volume V(h) at h=${h}`)
    }
  // the pit drawn is the pond described: 3 m deep, banks 2 across for 1 up
  const rim = C.resolveScene(ps, { h: 1, q: 6 }).lines.find((l) => l.points.length === 5)
  ok(rim.points.every((p) => Math.abs(p[0]) === 16 && Math.abs(p[1]) === 11 && p[2] === 3) && 16 === 10 + 2 * 3 && 11 === 5 + 2 * 3, 'pond scene: the rim is 32 m by 22 m at 3 m')
}

/* ------------------------------------------------------------------------------- roads */
{
  const curve = (y0, g1, g2, Lc) => (x) => y0 + g1 * x + ((g2 - g1) / (2 * Lc)) * x * x
  const crest = curve(100, 0.04, -0.02, 300)
  const top = extreme(crest, 0, 300)
  ok(near(top.x, 200, 1e-3) && near(top.value, 104, 1e-9) && near(crest(300), 103, 1e-9), `the crest: highest at ${top.x}, ${top.value} m`)
  for (const x of [0, 80, 300]) ok(near(d1(crest, x), 0.04 - 0.0002 * x, 1e-9) && near(d2(crest, x, 0.5), -0.0002, 1e-9), `grade and its rate at ${x}`)
  ok(near(d1(crest, 0), 0.04, 1e-9) && near(d1(crest, 300), -0.02, 1e-9), 'the curve leaves at +4% and arrives at -2%')
  const c2 = step('sip-m2-s2-l1', 'c2').body
  ok(c2.en.includes('104') && c2.en.includes('103') && c2.en.includes('0.0001x^2') && c2.id.includes('0{,}0001x^2'), 'lesson 7 quotes the curve')
  fillKey('sip-m2-s2-l1', 'f1', ['5000', '200'])
  ok(near(crest(77), 100 + (4 / 100) * 77 - 77 ** 2 / 10000, 1e-9), 'the fill step writes the same curve with fractions')
  ok(step('sip-m2-s2-l1', 'q1').answer === 0, 'quiz key of lesson 7')
  const sag = curve(50, -0.03, 0.02, 200)
  const low = extreme(sag, 0, 200, -1)
  mathKey('sip-m2-s2-l1', 'm1', [low.x, low.value])
  ok(near(sag(33), 50 - 0.03 * 33 + 0.000125 * 33 * 33, 1e-9), 'the sag curve as the step writes it')
  const cr2 = extreme(curve(20, 0.05, -0.03, 400), 0, 400)
  mathKey('sip-m2-s2-l1', 'm2', [cr2.x, cr2.value])
  const lines = step('sip-m2-s2-l1', 'o1').lines
  ok(lines.en[4].includes('104') && lines.id[0].includes('0{,}04x') && lines.en[0].includes('0.04x'), 'the order step, with a decimal comma in Indonesian')

  // the road scene: grade is the derivative of elevation, and what is drawn is the curve, ten times too high
  const rs = C.SCENES.roadScene
  for (const s of [0, 60, 200, 255, 300]) {
    const el = (ss) => C.readoutValue(rs.readouts[0], { s: ss })
    ok(near(el(s), crest(s), 1e-9) && near(C.readoutValue(rs.readouts[1], { s }), 100 * d1(el, s), 1e-6), `road scene: elevation and grade at ${s}`)
    const car = C.resolveScene(rs, { s }).meshes.find((m) => m.color === 'b')
    const zs = car.positions.filter((_, i) => i % 3 === 2)
    ok(near(Math.min(...zs), 10 * (crest(s) - 100), 1e-9), `road scene: the car stands on the road at ${s}`)
  }
  const res = C.resolveScene(rs, { s: 60 })
  ok(near(res.balls[0].at[0], 200, 1e-12) && near(res.balls[0].at[2], 10 * (104 - 100) + 4, 1e-9), 'road scene: the dot marks the highest point')
  const road = res.meshes.filter((m) => m.color === 'road')
  ok(road.length === 3, 'road scene: approach, curve and departure')
  // the three pieces join: the heights at x = 0 and x = 300 agree
  const topAt = (m, x) => Math.max(...m.positions.filter((_, i) => i % 3 === 2 && Math.abs(m.positions[i - 2] - x) < 1e-9))
  ok(near(topAt(road[0], 0), topAt(road[1], 0), 1e-9) && near(topAt(road[1], 300), topAt(road[2], 300), 1e-9), 'road scene: the pieces of road meet')
  // and the grades of the straight pieces are those of the curve's ends, times ten
  ok(near((topAt(road[0], 0) - topAt(road[0], -60)) / 60, 10 * 0.04, 1e-9) && near((topAt(road[2], 360) - topAt(road[2], 300)) / 60, 10 * -0.02, 1e-9), 'road scene: the straights have the grades 4% and -2%')

  // the two posts stand at the ends of the curve, on the level of the road there
  {
    const posts = res.meshes.filter((m) => m.color === 'c')
    const mid = (m, k) => {
      const v = m.positions.filter((_, i) => i % 3 === k)
      return (Math.min(...v) + Math.max(...v)) / 2
    }
    const foot = (m) => Math.min(...m.positions.filter((_, i) => i % 3 === 2))
    ok(posts.length === 2 && near(mid(posts[0], 0), 0, 1e-9) && near(mid(posts[1], 0), 300, 1e-9), 'road scene: the posts are at the start and the end of the curve')
    ok(near(foot(posts[0]), 10 * (crest(0) - 100), 1e-9) && near(foot(posts[1]), 10 * (crest(300) - 100), 1e-9), 'road scene: the posts stand at the height of the road')
  }
  // curvature
  const f = (x) => (x * x) / 400
  const radius = (g, x) => (1 + d1(g, x) ** 2) ** 1.5 / Math.abs(d2(g, x, 0.01))
  ok(near(radius(f, 0), 200, 1e-3) && near(radius(f, 100), 279.5, 0.05), `R at 0 and at 100: ${radius(f, 0)}, ${radius(f, 100)}`)
  const c1 = step('sip-m2-s2-l2', 'c1').body
  ok(c1.en.includes('279.5') && c1.id.includes('279{,}5') && near(20 * 20 / 200, 2, 1e-12) && near(20 * 3.6, 72, 1e-12), 'lesson 8 quotes 279.5, and 20 m/s is 72 km/h')
  mathKey('sip-m2-s2-l2', 'm1', [radius(f, 200)])
  ok(step('sip-m2-s2-l2', 'q1').answer === 0 && near(extreme((x) => radius(f, x), -150, 150, -1).x, 0, 0.05), 'the bend is tightest at x = 0')
  // the circle of curvature really touches the road: same point, same tangent, and it is the limit of circles through three near points
  const ps = C.SCENES.planScene
  for (const s of [-150, -60, 0, 45, 150]) {
    const R = C.readoutValue(ps.readouts[2], { s })
    ok(near(R, radius(f, s), 2e-3 * R) && near(C.readoutValue(ps.readouts[1], { s }), 1000 / R, 1e-9) && near(C.readoutValue(ps.readouts[0], { s }), d1(f, s), 1e-9), `plan scene: slope, curvature and radius at ${s}`)
    const res2 = C.resolveScene(ps, { s })
    const center = res2.balls[0].at
    ok(near(Math.hypot(center[0] - s, center[1] - f(s)), R, 1e-6 * R), `plan scene: the center is R away from the road at ${s}`)
    ok(near((center[0] - s) * 1 + (center[1] - f(s)) * d1(f, s), 0, 1e-6 * R), `plan scene: the radius is at right angles to the road at ${s}`)
    const arc = res2.lines.find((l) => l.points.length > 10)
    ok(arc.points.every((p) => near(Math.hypot(p[0] - center[0], p[1] - center[1]), R, 1e-6 * R)), `plan scene: the arc drawn is on the circle at ${s}`)
    // the road drawn is the curve y = x²/400, and the car is on its centerline
    const roadway = res2.meshes.find((m) => m.color === 'road')
    const across = new Map()
    for (let i = 0; i < roadway.positions.length; i += 3) {
      const k = roadway.positions[i].toFixed(6)
      across.set(k, [...(across.get(k) ?? []), roadway.positions[i + 1]])
    }
    ok(across.size === 65 && [...across].every(([x, ys]) => near((Math.min(...ys) + Math.max(...ys)) / 2, f(Number(x)), 1e-6) && near(Math.max(...ys) - Math.min(...ys), 12, 1e-9)), `plan scene: the road drawn follows y = x²/400, 12 m wide (s=${s})`)
    const car = res2.meshes.find((m) => m.color === 'b')
    const ends = (k) => {
      const v = car.positions.filter((_, i) => i % 3 === k)
      return [Math.min(...v), Math.max(...v)]
    }
    ok(near((ends(0)[0] + ends(0)[1]) / 2, s, 1e-9) && near((ends(1)[0] + ends(1)[1]) / 2, f(s), 1e-9) && near(ends(2)[0], 0, 1e-12), `plan scene: the car is on the centerline at ${s}`)
    const mid = arc.points[Math.floor(arc.points.length / 2)]
    ok(near(mid[0], s, 1e-6 * R) && near(mid[1], f(s), 1e-6 * R), `plan scene: the arc passes through the car at ${s}`)
    // three points of the road close together lie on a circle of nearly that radius
    const [x1, x2, x3] = [s - 0.5, s, s + 0.5]
    const a = Math.hypot(x2 - x1, f(x2) - f(x1))
    const b = Math.hypot(x3 - x2, f(x3) - f(x2))
    const c = Math.hypot(x3 - x1, f(x3) - f(x1))
    const area = Math.abs((x2 - x1) * (f(x3) - f(x1)) - (x3 - x1) * (f(x2) - f(x1))) / 2
    ok(near((a * b * c) / (4 * area), R, 2e-3 * R), `plan scene: the circle through three near points has radius ${(a * b * c) / (4 * area)}, the scene says ${R}`)
  }

  // small errors
  const rad = Math.PI / 180
  const tower = (d) => (deg) => d * Math.tan(deg * rad)
  const c2e = step('sip-m2-s2-l2', 'c2').body
  ok(c2e.en.includes('86.6') && c2e.en.includes('1.75') && c2e.en.includes('0.58') && c2e.en.includes('0.0576') && c2e.id.includes('1{,}75'), 'lesson 8 quotes 86.6, 1.75, 0.58 and 0.0576')
  const dh = (d, deg, err) => d1(tower(d), deg, 1e-4) * err // per degree, times the error in degrees
  ok(near(tower(50)(60), 86.6, 0.01) && near(dh(50, 60, 0.5), 1.75, 0.006) && near(dh(50, 30, 0.5), 0.58, 0.003) && near(dh(50, 60, 0.5) / dh(50, 30, 0.5), 3, 1e-6), 'and they are right; the ratio is 3')
  ok(step('sip-m2-s2-l2', 'q2').options[step('sip-m2-s2-l2', 'q2').answer].en === '3 times as large', 'quiz: three times')
  ok(near(0.5 * rad, 0.00873, 5e-6) && near(12e-6 * 120 * 40, 0.0576, 1e-12), '0.5° is 0.00873 rad; the deck grows 0.0576 m')
  // the real change, not the estimate, is close to it
  ok(near(tower(50)(60.5) - tower(50)(60), 1.75, 0.03) && near(1.01 ** 4 - 1, 0.04, 0.001), 'the estimates are close to the real changes')
  fillKey('sip-m2-s2-l2', 'f1', ['4', '2'])
  mathKey('sip-m2-s2-l2', 'm2', [dh(80, 45, 0.25)])
  mathKey('sip-m2-s2-l2', 'm3', [12e-6 * 200 * 35 * 1000])
  const tw = C.SCENES.towerScene
  for (const a of [30, 45, 60, 68]) {
    ok(near(C.readoutValue(tw.readouts[0], { a }), tower(50)(a), 1e-9) && near(C.readoutValue(tw.readouts[1], { a }), dh(50, a, 0.5), 1e-5), `tower scene at ${a}°`)
    const res3 = C.resolveScene(tw, { a })
    const t = res3.meshes.find((m) => m.color === 'concrete')
    ok(near(Math.max(...t.positions.filter((_, i) => i % 3 === 2)), tower(50)(a), 1e-9) && near(Math.min(...t.positions.filter((_, i) => i % 3 === 0)), 50, 1e-12), `tower scene: the tower drawn is 50 m away and h high at ${a}°`)
    const sight = res3.lines.find((l) => l.color === 'result')
    ok(near(sight.points[1][2], tower(50)(a), 1e-9) && near(sight.points[1][0], 50, 1e-12), 'tower scene: the line of sight ends at the top')
  }

  // the project
  const p1 = extreme(curve(60, 0.03, -0.01, 200), 0, 200)
  taskKey('sip-m2-s2-p', 1, [p1.x, p1.value])
  taskKey('sip-m2-s2-p', 2, [radius((x) => (x * x) / 200, 50)])
  taskKey('sip-m2-s2-p', 3, [4 * 2])
  ok(near((1.02 ** 4 - 1) * 100, 8, 0.3), 'a span 2% longer really sags about 8% more')
  taskKey('sip-m2-s2-p', 4, [dh(30, 60, 1)])
}

/* ----------------------------------------------------------------------- what a lesson must have */
{
  const info = C.COURSES.find((c) => c.id === 'turunan-teknik-sipil')
  ok(info && info.lessons === 8 && info.projects === 4 && info.track === 'math' && info.language === 'math' && info.available && info.requires.join() === 'aplikasi-turunan', 'the catalogue entry')
  ok(Object.keys(lessons).length === 8 && Object.keys(projects).length === 4, 'eight lessons and four projects')
  const ids = new Set()
  for (const [lid, l] of Object.entries(lessons)) {
    const steps = Object.values(l)
    ok(steps[0].kind === 'concept' && steps[steps.length - 1].kind === 'math', `${lid}: starts with a concept and ends with working`)
    ok(steps.some((s) => s.scene3d), `${lid}: has a scene in space`)
    ok(steps.filter((s) => s.kind === 'math').length >= 2 && steps.some((s) => s.kind === 'quiz') && steps.some((s) => s.kind === 'fill'), `${lid}: quiz, fill and at least two math steps`)
    ok(new Set(steps.map((s) => s.id)).size === steps.length, `${lid}: step ids are different`)
    ok(!ids.has(lid), 'lesson ids are different')
    ids.add(lid)
  }
  const strings = (v, lang, out = []) => {
    if (Array.isArray(v)) v.forEach((x) => strings(x, lang, out))
    else if (v && typeof v === 'object') {
      if (typeof v.en === 'string' && typeof v.id === 'string') out.push(v[lang])
      else if (Array.isArray(v.en) && Array.isArray(v.id)) out.push(...v[lang])
      else Object.entries(v).forEach(([k, x]) => k !== 'scene3d' && strings(x, lang, out))
    }
    return out
  }
  for (const [lid, st] of allSteps) {
    const at = `${lid}/${st.id}`
    if (['quiz', 'fill', 'order', 'multi', 'judge'].includes(st.kind)) {
      ok(st.hint && st.hint.en.trim() && st.hint.id.trim(), `${at}: a hint in both languages`)
      ok(st.hint.en !== st.explain.en, `${at}: the hint is not the explanation`)
    }
    if (st.kind === 'quiz') {
      ok(st.options.length === 4 && st.answer >= 0 && st.answer < 4 && new Set(st.options.map((o) => o.en)).size === 4, `${at}: four different options`)
      // a hint must not give the answer away: it does not repeat the right option
      ok(!st.hint.en.includes(st.options[st.answer].en), `${at}: the hint repeats the answer`)
    }
    if (st.kind === 'math') {
      ok(st.hints.length >= 1 && st.explain.en.trim() && st.explain.id.trim() && st.solution, `${at}: hints, an explanation and the working`)
      const sol = st.solution
      ok(!Array.isArray(sol) && sol.en.length === sol.id.length, `${at}: the working is written for both languages`)
    }
    for (const lang of ['en', 'id']) {
      for (const t of strings(st, lang)) {
        ok((t.match(/\$/g) ?? []).length % 2 === 0, `${at} (${lang}): $ signs come in pairs: ${t.slice(0, 50)}`)
        if (lang === 'id') {
          ok(!/\d\.\d/.test(t.replace(/\d{1,3}(\.\d{3})+(?!\d)/g, '')), `${at}: a decimal point in Indonesian: ${t.slice(0, 80)}`)
          for (const w of ['tetikus', 'berkas', 'tautan', 'peramban', 'papan ketik', 'surel']) ok(!new RegExp(`\\b${w}\\b`, 'i').test(t), `${at}: the Indonesian says "${w}"`)
        } else {
          ok(!/\{,\}/.test(t), `${at}: an Indonesian decimal mark in English: ${t.slice(0, 80)}`)
          for (const w of ['colour', 'centre', 'metre', 'neighbour', 'minimise', 'maximise', 'analyse']) ok(!t.includes(w), `${at}: British spelling ${w}`)
        }
        ok(!/—/.test(t), `${at} (${lang}): no long dash`)
      }
    }
  }
  for (const [pid, p] of Object.entries(projects)) {
    ok(p.runtime === 'math' && p.tasks.length === 4 && p.hints.length >= 1 && p.requirements.length >= 2 && p.xp === 50, `${pid}: four tasks`)
    for (const [i, t] of p.tasks.entries()) {
      ok(t.solution && !Array.isArray(t.solution) && t.solution.id.length === t.solution.en.length, `${pid} task ${i + 1}: working for both languages`)
      for (const lang of ['en', 'id']) for (const s of strings(t, lang)) if (lang === 'id') ok(!/\d\.\d/.test(s.replace(/\d{1,3}(\.\d{3})+(?!\d)/g, '')), `${pid} task ${i + 1}: a decimal point in Indonesian: ${s.slice(0, 80)}`)
    }
  }
  /* What is written agrees with itself. Three checks that read the text and nothing else:
   *   - every piece of plain arithmetic in a formula is worked out again: in "600+540+144=1284" and in "\dfrac{6}{504}\approx0.0119" both sides are
   *     numbers, so they must agree (exactly after "=", to the last digit shown after "≈"), in both languages and with units of length converted;
   *   - the key of every box is among the numbers of its explanation and of its working, to a rounding the box accepts;
   *   - the English and the Indonesian of every text carry the same numbers. */
  const LENGTH = { m: 1, cm: 0.01, mm: 0.001 }
  /** Thousands separators out, the Indonesian decimal comma to a point. */
  const plain = (src, lang) =>
    lang === 'id' ? src.replace(/(?<![\d}])\d{1,3}(?:\.\d{3})+(?!\d)/g, (m) => m.replace(/\./g, '')).replace(/\{,\}/g, '.') : src.replace(/(\d)\\,(?=\d{3}(?!\d))/g, '$1')
  /** The value of a piece of TeX that is plain arithmetic, with its unit and the decimals of its last number; null when it has a letter or anything
   *  else that is not understood. */
  function texValue(src) {
    let s = src.trim().replace(/[.,;]$/, '')
    let unit = ''
    const um = /\\text\{\s*([^}]*?)\s*\}(\^\d)?$/.exec(s)
    if (um) {
      unit = um[1] + (um[2] ?? '')
      s = s.slice(0, um.index)
    }
    s = s
      .replace(/\\(?:left|right)/g, '')
      .replace(/\\[dt]?frac/g, '#')
      .replace(/\\(?:cdot|times)/g, '*')
      .replace(/\\sqrt/g, '@')
      .replace(/\\pi/g, '~')
      .replace(/\\%/g, '%')
      .replace(/\\(?:qquad|quad|,|;|!| )/g, ' ')
      .trim()
    if (!s || /[^0-9.+\-*/^(){}@#~% ]/.test(s)) return null
    const last = [...s.matchAll(/\d+(?:\.(\d+))?/g)].pop()
    if (!last) return null
    let i = 0
    const peek = () => {
      while (s[i] === ' ') i++
      return s[i]
    }
    const fail = () => {
      throw new Error('not arithmetic')
    }
    const group = (close) => {
      i++
      const v = expr()
      if (peek() !== close) fail()
      i++
      return v
    }
    // the argument of a fraction, a root or a power: a group in braces, or a single digit
    const arg = () => {
      const c = peek()
      if (c === '{') return group('}')
      if (c === '~') return i++, Math.PI
      if (c !== undefined && /\d/.test(c)) return i++, Number(c)
      return fail()
    }
    const primary = () => {
      const c = peek()
      if (c === '(') return group(')')
      if (c === '{') return group('}')
      if (c === '@') return i++, Math.sqrt(arg())
      if (c === '#') {
        i++
        const top = arg()
        return top / arg()
      }
      if (c === '~') return i++, Math.PI
      const m = /^\d+(?:\.\d+)?/.exec(s.slice(i))
      if (!m) return fail()
      i += m[0].length
      return Number(m[0])
    }
    const postfix = () => {
      let v = primary()
      for (;;) {
        const c = peek()
        if (c === '^') {
          i++
          v = v ** arg()
        } else if (c === '%') {
          i++
          v /= 100
        } else return v
      }
    }
    const factor = () => {
      const c = peek()
      if (c === '-') return i++, -factor()
      if (c === '+') return i++, factor()
      return postfix()
    }
    const term = () => {
      let v = factor()
      for (;;) {
        const c = peek()
        if (c === '*') {
          i++
          v *= factor()
        } else if (c === '/') {
          i++
          v /= factor()
        } else if (c !== undefined && '({@#~'.includes(c)) v *= postfix() // 10\sqrt3, 3\,(216-108)
        else return v
      }
    }
    function expr() {
      let v = term()
      for (;;) {
        const c = peek()
        if (c === '+') {
          i++
          v += term()
        } else if (c === '-') {
          i++
          v -= term()
        } else return v
      }
    }
    try {
      const value = expr()
      if (peek() !== undefined || !Number.isFinite(value)) return null
      return { value, unit, dp: (last[1] ?? '').length }
    } catch {
      return null
    }
  }
  // the reader itself, on arithmetic whose answer is known
  for (const [src, want] of [['\\dfrac{3\\,(216-108+27)}{48000}', 405 / 48000], ['-\\dfrac{90}{20\\,000}', -0.0045], ['10\\sqrt3\\,(900-300)', 6000 * Math.sqrt(3)], ['\\frac{1}{\\sqrt3}\\left(\\frac23\\right)^{3/2}', (2 / 3) ** 1.5 / Math.sqrt(3)], ['12\\times10^{-6}\\cdot200\\cdot35', 0.084], ['1.25^{2/3}', 1.25 ** (2 / 3)], ['-2^2+4\\cdot2\\%', -3.92], ['\\dfrac{(1+1^2)^{3/2}}{1/200}', 200 * 2 ** 1.5], ['0.25\\cdot\\dfrac{\\pi}{180}', Math.PI / 720], ['45\\sqrt{\\frac23}', 45 * Math.sqrt(2 / 3)], ['600+540+144', 1284], ['2-3-4', -5], ['12/2/3', 2]])
    ok(texValue(plain(src, 'en')) && near(texValue(plain(src, 'en')).value, want, 1e-12 * Math.max(1, Math.abs(want))), `the arithmetic reader: ${src} is ${texValue(plain(src, 'en'))?.value}, not ${want}`)
  ok(texValue('3x+1') === null && texValue('y(3)') === null && texValue('2 3') === null && texValue('(2+3') === null && texValue('\\sec^2 45^\\circ') === null && texValue('') === null, 'the arithmetic reader leaves alone what is not arithmetic')
  ok(texValue('84\\ \\text{mm}').unit === 'mm' && texValue('84\\ \\text{mm}').value === 84 && texValue('1732\\text{ cm}^3').unit === 'cm^3' && texValue('0.0119').dp === 4 && texValue(plain('21.921{,}50', 'id')).value === 21921.5, 'units, decimals and the Indonesian way of writing a number')
  let relations = 0
  const checkMath = (math, lang, at) => {
    for (const clause of plain(math, lang).split(/\\Rightarrow|\\qquad|\\quad/)) {
      const parts = clause.split(/(=|\\approx)/)
      for (let k = 0; k + 2 < parts.length; k += 2) {
        const a = texValue(parts[k])
        const b = texValue(parts[k + 2])
        if (!a || !b) continue
        let [x, y, unitSize] = [a.value, b.value, 1]
        if (a.unit !== b.unit && a.unit && b.unit) {
          if (!(a.unit in LENGTH && b.unit in LENGTH)) continue
          x *= LENGTH[a.unit]
          y *= LENGTH[b.unit]
          unitSize = LENGTH[b.unit]
        }
        relations++
        const tol = parts[k + 1] === '=' ? 1e-9 * Math.max(1, Math.abs(y)) : 0.5000001 * 10 ** -b.dp * unitSize
        ok(Math.abs(x - y) <= tol, `${at} (${lang}): "${parts[k].trim()} ${parts[k + 1]} ${parts[k + 2].trim()}" is written, but the left side is ${x / unitSize}`)
      }
    }
  }
  const mathIn = (t) => [...t.matchAll(/\$\$([^$]+)\$\$|\$([^$]+)\$/g)].map((m) => m[1] ?? m[2])
  /** Every text of a step that exists in two languages, as [en, id] pairs. */
  const pairs = (v, out = []) => {
    if (Array.isArray(v)) v.forEach((x) => pairs(x, out))
    else if (v && typeof v === 'object') {
      if (typeof v.en === 'string' && typeof v.id === 'string') out.push([v.en, v.id])
      else if (Array.isArray(v.en) && Array.isArray(v.id)) v.en.forEach((line, k) => out.push([line, v.id[k] ?? '']))
      else Object.values(v).forEach((x) => pairs(x, out))
    }
    return out
  }
  /** The numbers of a text, smallest first. Outside the formulas the Indonesian decimal mark is a bare comma, and English may group thousands with one. */
  const numberList = (t, lang) =>
    t
      .split('$')
      .flatMap((piece, k) => {
        let s = plain(piece, lang)
        if (k % 2 === 0) s = lang === 'id' ? s.replace(/(\d),(?=\d)/g, '$1.') : s.replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
        return [...s.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]))
      })
      .sort((a, b) => a - b)
      .join(' ')
  ok(numberList('about $21\\,921$ and 0.5°, or $[0,30]$', 'en') === numberList('kira-kira $21.921$ dan 0,5°, atau $[0,30]$', 'id') && numberList('$2.5$', 'en') !== numberList('$2{,}6$', 'id'), 'the numbers of a text are read the same way in both languages')
  /** A text says the key of a box: one of its numbers is the key rounded, and rounded no more coarsely than the box allows. */
  const says = (text, lang, b) => {
    const tol = b.tol ?? Math.abs(b.answer) * 0.005
    return [...plain(text, lang).matchAll(/\d+(?:\.(\d+))?/g)].some((m) => {
      const off = Math.abs(Number(m[0]) - Math.abs(b.answer))
      const half = 0.5 * 10 ** -(m[1] ?? '').length
      return off < 1e-9 || (off <= half * 1.0000001 && half <= tol)
    })
  }
  ok(says('so $x\\approx5.20$ m', 'en', { answer: 5.196152, tol: 0.02 }) && !says('so $x\\approx5$ m', 'en', { answer: 5.196152, tol: 0.02 }) && !says('$5.30$', 'en', { answer: 5.196152, tol: 0.02 }) && says('$-0{,}0045$', 'id', { answer: -0.0045, tol: 0.00005 }) && !says('$0{,}045$', 'id', { answer: -0.0045, tol: 0.00005 }), 'finding a key in a text')
  const written = []
  for (const [lid, st] of allSteps) written.push([`${lid}/${st.id}`, st])
  for (const [pid, p] of Object.entries(projects)) {
    written.push([pid, { ...p, tasks: undefined }])
    p.tasks.forEach((t, k) => written.push([`${pid} task ${k + 1}`, t]))
  }
  for (const [name, scene] of Object.entries(C.SCENES)) written.push([`scene ${name}`, { caption: scene.caption, readouts: scene.readouts, params: scene.params }])
  for (const [at, thing] of written) {
    const { scene3d: _, ...own } = thing
    for (const [en, id] of pairs(own)) {
      ok(numberList(en, 'en') === numberList(id, 'id'), `${at}: the two languages carry different numbers: [${numberList(en, 'en')}] and [${numberList(id, 'id')}] in "${en.slice(0, 60)}"`)
      for (const m of mathIn(en)) checkMath(m, 'en', at)
      for (const m of mathIn(id)) checkMath(m, 'id', at)
    }
    if (thing.solution) {
      for (const lang of ['en', 'id']) {
        for (const line of thing.solution[lang]) checkMath(line, lang, at)
        for (const [k, b] of thing.blanks.entries()) {
          ok(says(thing.solution[lang].join(' ; '), lang, b), `${at} (${lang}): the working does not arrive at the key of box ${k + 1}, ${b.answer}`)
          if (thing.explain) ok(says(thing.explain[lang], lang, b), `${at} (${lang}): the explanation does not say the key of box ${k + 1}, ${b.answer}`)
        }
      }
    }
  }
  ok(relations >= 150, `pieces of arithmetic worked out again: ${relations}`)

  // what the sliders and the readouts of each scene are called: a slider named for the wrong quantity, or a number with the wrong unit, is a wrong picture
  const FACE = {
    beamScene: [['w (kN/m)', 'x (m)'], ['mm', 'mrad', 'kN·m']],
    loadScene: [['x (m)'], ['kN/m', 'kN', 'kN·m']],
    logStrengthScene: [['b (cm)'], ['cm', 'cm³', '%']],
    logStiffnessScene: [['b (cm)'], ['cm', 'cm⁴', 'cm³']],
    tankScene: [['s (m)'], ['m', 'm²']],
    channelScene: [['y (m)'], ['m', 'm', 'm³/s']],
    trapezoidScene: [['y (m)', 'm'], ['m', 'm', 'm³/s']],
    pondScene: [['h (m)', 'Q (m³/min)'], ['m²', 'm³', 'cm/min']],
    roadScene: [['x (m)'], ['m', '%']],
    planScene: [['x (m)'], ['', '1/km', 'm']],
    towerScene: [['θ (°)'], ['m', 'm']],
  }
  ok(Object.keys(C.SCENES).join() === Object.keys(FACE).join(), 'the scenes of the course')
  for (const [name, [sliders, units]] of Object.entries(FACE)) {
    const scene = C.SCENES[name]
    ok(JSON.stringify(scene.params.map((p) => p.label)) === JSON.stringify(sliders), `${name}: sliders ${JSON.stringify(scene.params.map((p) => p.label))}`)
    ok(JSON.stringify(scene.readouts.map((r) => (typeof r.unit === 'string' ? r.unit : (r.unit?.en ?? '')))) === JSON.stringify(units), `${name}: units ${JSON.stringify(scene.readouts.map((r) => r.unit))}`)
  }

  // the pieces fit together
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8')
  ok(/'turunan-teknik-sipil': \(\) => import\('\.\/turunan-teknik-sipil'\)/.test(read('src/content/catalog.ts')), 'the catalogue loads the course')
  ok(/scene3d\?: Scene3D/.test(read('src/content/types.ts')), 'a concept step may carry a scene')
  const view = read('src/components/StepView.tsx')
  ok(/lazy\(\(\) => import\('\.\/Scene3DView'\)/.test(view) && /step\.scene3d &&/.test(view) && /<Scene3DView scene=\{step\.scene3d\} \/>/.test(view), 'StepView draws the scene, loaded only when needed')
  const sv = read('src/components/Scene3DView.tsx')
  ok(/role="img"/.test(sv) && /aria-live="polite"/.test(sv) && /type="range"/.test(sv) && /aria-label=\{p\.label \?\? p\.name\}/.test(sv), 'the scene has a label, sliders with names and readouts that are announced')
  ok(/const place = \(p: V3\): \[number, number, number\] => \[p\[0\], p\[2\], -p\[1\]\]/.test(sv), 'the scene is drawn with z up: (x, y, z) goes to (x, z, -y)')
  ok(/turn\(-30\)/.test(sv) && /turn\(30\)/.test(sv) && /home\(\)/.test(sv), 'the scene can be turned and reset without a mouse')
  const pkg = JSON.parse(read('package.json'))
  ok(pkg.scripts['check:sipil'] === 'node tools/check-sipil.mjs' && pkg.scripts['check:scene3d'] === 'node tools/check-scene3d.mjs', 'package.json runs both checkers')
  const ci = read('.github/workflows/deploy.yml')
  ok(/npm run check:sipil/.test(ci) && /npm run check:scene3d/.test(ci), 'CI runs both checkers')
}

console.log(`sipil check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
