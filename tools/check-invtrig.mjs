/** Checks src/lib/invtrig.ts, the numbers behind the "Inverse Trigonometric Functions" article's widgets.
 *
 *  References that do not use the formulas under test:
 *   1. Each of the six functions undoes its trigonometric function on the restricted interval and is undone by it, and
 *      stays inside its stated range.
 *   2. The derivative rule for inverses: the slope of arcsin at x is 1 / cos(arcsin x), of arctan 1 / sec²(arctan x), of
 *      arcsec 1 / (sec y tan y) at y = arcsec x with tan y taken positive, and so on, computed from the *trigonometric*
 *      derivatives with Math.cos and Math.sin; and every slope against a central difference of the function itself.
 *   3. The identities that make the three "co" functions easy: arccos + arcsin = π/2, arccot + arctan = π/2,
 *      arccsc + arcsec = π/2, arcsec x = arccos(1/x), arccsc x = arcsin(1/x); the arctangent is odd; its limits are ±π/2.
 *   4. The values of the chapter's example, arctan 1 = π/4 and arctan(−√3) = −π/3, and a table of common values.
 *   5. The reference triangles: sides satisfy Pythagoras, and the trigonometric ratio of the angle gives back x.
 *   6. The viewing angle: its slope against a central difference, zero at √(pq), and a scan finds the same largest angle
 *      as the closed form arctan((q − p) / (2√(pq))).
 *
 *  Run: npm run check:invtrig   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'it-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/invtrig.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const V = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const close = (got, want, what, tol = 1e-9) => {
  checks++
  const scale = Math.max(1, Math.abs(want))
  if (!(Math.abs(got - want) / scale < tol)) fail(`${what}: got ${got}, want ${want}`)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const central = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)
const by = (id) => V.INVTRIGS.find((g) => g.id === id)
const rnd = (a, b) => a + Math.random() * (b - a)
const PI = Math.PI

/* -------------------------------- 1 and 2: undoing, ranges, the rule for inverses, central differences */
const sec = (y) => 1 / Math.cos(y)
const csc = (y) => 1 / Math.sin(y)
const cot = (y) => 1 / Math.tan(y)
// the forward functions and their derivatives, from the trigonometric side
const FORWARD = {
  arcsin: { fwd: Math.sin, dfwd: Math.cos, range: [-PI / 2, PI / 2], x: () => rnd(-0.98, 0.98) },
  arccos: { fwd: Math.cos, dfwd: (y) => -Math.sin(y), range: [0, PI], x: () => rnd(-0.98, 0.98) },
  arctan: { fwd: Math.tan, dfwd: (y) => sec(y) ** 2, range: [-PI / 2, PI / 2], x: () => rnd(-20, 20) },
  arccot: { fwd: cot, dfwd: (y) => -(csc(y) ** 2), range: [0, PI], x: () => rnd(-20, 20) },
  arcsec: { fwd: sec, dfwd: (y) => sec(y) * Math.tan(y), range: [0, PI], x: () => (Math.random() < 0.5 ? -1 : 1) * rnd(1.02, 20) },
  arccsc: { fwd: csc, dfwd: (y) => -csc(y) * cot(y), range: [-PI / 2, PI / 2], x: () => (Math.random() < 0.5 ? -1 : 1) * rnd(1.02, 20) },
}
for (const g of V.INVTRIGS) {
  const F = FORWARD[g.id]
  let tested = 0
  for (let i = 0; i < 500; i++) {
    const x = F.x()
    const y = g.f(x)
    ok(Number.isFinite(y) && y >= F.range[0] - 1e-12 && y <= F.range[1] + 1e-12, `${g.id}(${x}) = ${y} lies in its range`)
    close(F.fwd(y), x, `${g.id}: the trigonometric function undoes it at ${x}`, 1e-8)
    // the rule for inverses: the slope is 1 over the slope of the trigonometric function at y = f(x)
    const slope = 1 / F.dfwd(y)
    close(g.d(x), slope, `${g.id}: slope at ${x} from 1 / (trig derivative at ${y})`, 1e-8)
    const cd = central(g.f, x, 1e-6 * Math.max(1, Math.abs(x)))
    if (Number.isFinite(cd) && Math.abs(cd) < 1e3) {
      tested++
      close(g.d(x), cd, `${g.id}: slope at ${x} against a central difference`, 1e-5)
    }
  }
  ok(tested > 300, `${g.id}: enough points`)
  // the other direction: f(trig y) = y for y in the restricted interval
  for (let i = 0; i < 300; i++) {
    const [a, b] = F.range
    const y = a + (0.02 + Math.random() * 0.96) * (b - a)
    if (Math.abs(y - PI / 2) < 0.05 || Math.abs(y) < 0.05) continue
    const x = F.fwd(y)
    if (!Number.isFinite(x) || Math.abs(x) > 1e6) continue
    close(g.f(x), y, `${g.id}(trig ${y}) = ${y}`, 1e-6)
  }
}
// the failure of the other composition: arcsin(sin y) is y only on [−π/2, π/2]
close(Math.asin(Math.sin(PI)), 0, 'arcsin(sin π) = 0, not π', 1e-12)
close(Math.asin(Math.sin(2)), PI - 2, 'arcsin(sin 2) = π − 2', 1e-12)
close(Math.acos(Math.cos(-1)), 1, 'arccos(cos(−1)) = 1', 1e-12)

/* ------------------------------------------------------- 3: the identities */
for (let i = 0; i < 500; i++) {
  const a = rnd(-1, 1)
  close(by('arccos').f(a) + by('arcsin').f(a), PI / 2, `arccos + arcsin = π/2 at ${a}`, 1e-12)
  const t = rnd(-30, 30)
  close(by('arccot').f(t) + by('arctan').f(t), PI / 2, `arccot + arctan = π/2 at ${t}`, 1e-12)
  close(by('arctan').f(-t), -by('arctan').f(t), 'the arctangent is odd', 1e-12)
  const s = (Math.random() < 0.5 ? -1 : 1) * rnd(1, 30)
  close(by('arccsc').f(s) + by('arcsec').f(s), PI / 2, `arccsc + arcsec = π/2 at ${s}`, 1e-12)
  close(by('arcsec').f(s), Math.acos(1 / s), 'arcsec x = arccos(1/x)', 1e-12)
  close(by('arccsc').f(s), Math.asin(1 / s), 'arccsc x = arcsin(1/x)', 1e-12)
  // the derivatives of the cofunctions are the negatives
  close(by('arccos').d(a), -by('arcsin').d(a), 'arccos′ = −arcsin′', 1e-12)
  close(by('arccot').d(t), -by('arctan').d(t), 'arccot′ = −arctan′', 1e-12)
  close(by('arccsc').d(s), -by('arcsec').d(s), 'arccsc′ = −arcsec′', 1e-12)
  // arcsec has a positive slope on both pieces, which is why the formula has |x|
  ok(by('arcsec').d(s) > 0, `arcsec has a positive slope at ${s}`)
}
close(by('arctan').f(1e9), PI / 2, 'arctan → π/2 as x → ∞', 1e-8)
close(by('arctan').f(-1e9), -PI / 2, 'arctan → −π/2 as x → −∞', 1e-8)
close(by('arcsec').f(1e9), PI / 2, 'arcsec → π/2 as x → ∞', 1e-8)
close(by('arccsc').f(1e9), 0, 'arccsc → 0 as x → ∞', 1e-8)
ok(Number.isNaN(by('arcsin').f(1.5)) && Number.isNaN(by('arcsec').f(0.5)), 'outside their domains arcsin and arcsec are not defined')
ok(by('arcsin').d(0.999) > 20 && by('arcsin').d(0.99999) > 200, 'the slope of arcsin grows without bound towards 1 (vertical tangent at ±1)')

/* ---------------------------------------------------------- 4: common values */
const VALUES = [
  ['arctan', 1, PI / 4],
  ['arctan', -Math.sqrt(3), -PI / 3],
  ['arctan', 1 / Math.sqrt(3), PI / 6],
  ['arcsin', 0.5, PI / 6],
  ['arcsin', -0.5, -PI / 6],
  ['arcsin', Math.sqrt(3) / 2, PI / 3],
  ['arccos', 0.5, PI / 3],
  ['arccos', -0.5, (2 * PI) / 3],
  ['arccos', -1, PI],
  ['arccot', 1, PI / 4],
  ['arccot', -1, (3 * PI) / 4],
  ['arcsec', 2, PI / 3],
  ['arcsec', -2, (2 * PI) / 3],
  ['arccsc', 2, PI / 6],
  ['arccsc', -2, -PI / 6],
]
for (const [id, x, want] of VALUES) close(by(id).f(x), want, `${id}(${x})`, 1e-12)

/* ------------------------------------------------- 5: the reference triangles */
for (let i = 0; i < 300; i++) {
  const a = rnd(0.02, 0.98)
  const t1 = V.refTriangle('arcsin', a)
  close(t1.opp ** 2 + t1.adj ** 2, t1.hyp ** 2, 'arcsin triangle: Pythagoras', 1e-12)
  close(Math.sin(t1.theta), a, 'sin(arcsin x) = x', 1e-12)
  close(Math.cos(t1.theta), Math.sqrt(1 - a * a), 'cos(arcsin x) = sqrt(1 − x²)', 1e-12)
  close(t1.opp / t1.hyp, a, 'arcsin triangle: opposite over hypotenuse is x', 1e-12)
  const b = rnd(0.02, 20)
  const t2 = V.refTriangle('arctan', b)
  close(t2.opp ** 2 + t2.adj ** 2, t2.hyp ** 2, 'arctan triangle: Pythagoras', 1e-9)
  close(Math.tan(t2.theta), b, 'tan(arctan x) = x', 1e-9)
  close(1 / Math.cos(t2.theta), Math.sqrt(1 + b * b), 'sec(arctan x) = sqrt(1 + x²)', 1e-9)
  const c = rnd(1.02, 20)
  const t3 = V.refTriangle('arcsec', c)
  close(t3.opp ** 2 + t3.adj ** 2, t3.hyp ** 2, 'arcsec triangle: Pythagoras', 1e-9)
  close(1 / Math.cos(t3.theta), c, 'sec(arcsec x) = x', 1e-9)
  close(Math.tan(t3.theta), Math.sqrt(c * c - 1), 'tan(arcsec x) = sqrt(x² − 1)', 1e-9)
  // the derivatives read off the triangles
  close(by('arcsin').d(a), 1 / t1.adj, 'the arcsine slope is 1 / cos θ', 1e-12)
  close(by('arctan').d(b), 1 / t2.hyp ** 2, 'the arctangent slope is 1 / sec² θ', 1e-9)
  close(by('arcsec').d(c), 1 / (t3.hyp * t3.opp), 'the arcsecant slope is 1 / (sec θ tan θ)', 1e-9)
}

/* --------------------------------------------------------- 6: the viewing angle */
for (let i = 0; i < 300; i++) {
  const lo = rnd(0.2, 3)
  const hi = lo + rnd(0.5, 6)
  const x = rnd(0.3, 15)
  close(V.viewAngleSlope(lo, hi, x), central((t) => V.viewAngle(lo, hi, t), x), `the slope of the viewing angle (p = ${lo}, q = ${hi}) at ${x}`, 1e-6)
  const xs = V.bestDistance(lo, hi)
  close(V.viewAngleSlope(lo, hi, xs), 0, 'the slope is zero at √(pq)', 1e-12)
  // a scan finds the same largest angle at the same place
  let best = -1
  let at = 0
  for (let k = 1; k <= 20000; k++) {
    const t = k * 0.001
    const a = V.viewAngle(lo, hi, t)
    if (a > best) {
      best = a
      at = t
    }
  }
  close(at, xs, 'the scan finds the best distance √(pq)', 2e-3)
  close(best, V.maxViewAngle(lo, hi), 'the scan finds the largest angle arctan((q − p)/(2√(pq)))', 1e-6)
  // the angle is smaller on both sides of the best distance
  ok(V.viewAngle(lo, hi, xs * 0.7) < best && V.viewAngle(lo, hi, xs * 1.4) < best, 'the angle is smaller nearer and farther')
}
// the worked example: a picture from 1 to 3 above eye level is seen best from √3 away, at an angle of 30°
close(V.bestDistance(1, 3), Math.sqrt(3), 'best distance for p = 1, q = 3')
close(V.maxViewAngle(1, 3), PI / 6, 'largest angle for p = 1, q = 3 is π/6')
close(V.bestDistance(1, 4), 2, 'best distance for p = 1, q = 4 is 2')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`invtrig check ok — ${checks} checks (the six functions against the trigonometric ones and the rule for inverses, central differences, the cofunction identities, common values, the reference triangles, the viewing angle against a scan)`)
