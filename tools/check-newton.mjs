/** Checks src/lib/newton.ts, the numbers behind the "Newton's Method" article.
 *
 *  References that do not use the code under test:
 *   1. Nineteen runs of the method with the root computed by mpmath's findroot, a separate program (the values are written into
 *      this file), among them the textbook's examples and exercises.
 *   2. The textbook's own iterates: 1, 3/2, 17/12, 577/408 for x² − 2; Table 4.1 for x³ − x − 1; the start x₀ = 3 that needs seven
 *      steps; the planet of Exercise 16; x e^x = 1 of Exercise 9.
 *   3. The order of convergence: for a simple root e(n+1)/e(n)² tends to f″(r) / (2 f′(r)) (random cubics, with the formula
 *      computed by hand); for a root of multiplicity m, e(n+1)/e(n) = (m − 1)/m exactly.
 *   4. The closed forms: the Babylonian rule for square roots, ((n − 1)x + a/xⁿ⁻¹)/n for n-th roots, x(2 − a x) for reciprocals.
 *   5. The cases that go wrong: x^(1/3) runs off as (−2)ⁿ, x³ − 2x + 2 cycles between 0 and 1, arctan x escapes beyond
 *      1.3917452…, a horizontal tangent stops the method, sin x from 1.7 reaches 3π, and a root of multiplicity 6 converges slowly.
 *   6. The basins of attraction against a plain loop written in this file, the symmetry of an odd function, and the exact
 *      basin of x³ − x on the intervals where it is known.
 *   7. Bisection and the refusals.
 *
 *  Run: npm run check:newton   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'newton-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/newton.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * (1 + Math.abs(b))
const rnd = (a, b) => a + Math.random() * (b - a)

/* ------------------------------------------------------------------ 1: roots against mpmath */
const ROOTS = [
  ['x^2-2', 1, 1.4142135623730951],
  ['x^3-x-1', 1, 1.324717957244746],
  ['x^3-x-1', 3, 1.324717957244746],
  ['x^2+x-1', -1, -1.618033988749895],
  ['x^2+x-1', 1, 0.618033988749895],
  ['x^3+3*x+1', 0, -0.3221853546260856],
  ['x^4+x-3', -1, -1.452626878833844],
  ['x^4+x-3', 1, 1.1640351402897696],
  ['x^2-2*x+0.5', 0, 0.2928932188134524],
  ['x^2-2*x+0.5', 2, 1.7071067811865475],
  ['x^4-2', 1, 1.189207115002721],
  ['x^4-2', -1, -1.189207115002721],
  ['x-3-ln(x)', 2, 4.505241495792883],
  ['x-1-arctan(x)', 1, 2.132267725272885],
  ['x*e^x-1', 0, 0.5671432904097839],
  ['x-1-0.5*sin(x)', 1.5, 1.4987011335178483],
  ['tan(x)-2*x', 1.1, 1.1655611852072113],
  ['cos(x)-x', 1, 0.7390851332151607],
  ['x^3-2*x+2', -2, -1.7692923542386314],
]
for (const [src, x0, root] of ROOTS) {
  const r = M.newton(src, x0)
  ok(r.ok && r.status === 'converged' && near(r.last, root, 1e-11), `${src} from ${x0}: ${r.ok ? r.last + ' ' + r.status : 'refused'}, mpmath ${root}`)
}

/* ------------------------------------------------------------------ 2: the textbook's iterates */
{
  const r = M.newton('x^2-2', 1)
  const xs = [r.steps[0].x, r.steps[1].x, r.steps[2].x, r.steps[3].x]
  ok(xs[0] === 1 && xs[1] === 1.5 && near(xs[2], 17 / 12, 1e-14) && near(xs[3], 577 / 408, 1e-14), 'x² − 2 from 1: 1, 3/2, 17/12, 577/408')
  // the table of Example 1: the error and the correct digits at each step
  const t = M.errorTable(r, Math.SQRT2)
  ok(near(t[0].err, 0.41421, 1e-4) && near(t[1].err, 0.08579, 1e-3) && near(t[2].err, 0.00246, 1e-2) && t[3].err < 3e-6, 'Example 1: the errors 0.41421, 0.08579, 0.00246, 0.000002')
  // Table 4.1
  const c = M.newton('x^3-x-1', 1)
  const want = [1, 1.5, 1.347826087, 1.325200399, 1.324718174, 1.324717957]
  ok(want.every((v, i) => near(c.steps[i].x, v, 5e-10)), 'Table 4.1: 1, 1.5, 1.347826087, 1.325200399, 1.324718174, 1.324717957')
  ok(near(c.steps[1].fx, 0.875, 1e-12) && near(c.steps[1].dfx, 5.75, 1e-12) && near(c.steps[0].fx, -1, 1e-12) && near(c.steps[0].dfx, 2, 1e-12), 'Table 4.1: f(1) = −1, f′(1) = 2, f(1.5) = 0.875, f′(1.5) = 5.75')
  // from 3 the root to nine decimals takes seven steps, counting the one that shows the digits have stopped changing
  const d = M.newton('x^3-x-1', 3)
  const root = 1.324717957244746
  const first = d.steps.findIndex((s) => Math.abs(s.x - root) < 5e-10)
  // x₆ and x₇ agree to nine decimals ("x₇ ≈ x₆ = 1.324717957 in seven steps")
  ok(first === 6 && near(d.steps[7].x, d.steps[6].x, 1e-9) && near(d.steps[7].x, 1.324717957, 5e-10), `x₀ = 3: x₆ and x₇ agree to nine decimals, first correct at ${first}`)
  ok(near(d.steps[1].x, 2.11538461538, 1e-10) && near(d.steps[2].x, 1.60424775843, 1e-10), 'x₁ = 2.12 (the textbook rounds it) and x₂ = 1.604 from x₀ = 3')
  // Exercise 9: x e^x = 1
  const e9 = M.newton('x*e^x-1', 0)
  ok(near(e9.steps[1].x, 1, 1e-12) && near(e9.steps[2].x, 0.683939720586, 1e-10) && near(e9.steps[3].x, 0.577454477154, 1e-10), 'Exercise 9: 0, 1, 0.68394, 0.57745')
  // Exercise 16: one step for x = 1 + 0.5 sin x from 1.5
  const x1 = 1.5 - (1.5 - 1 - 0.5 * Math.sin(1.5)) / (1 - 0.5 * Math.cos(1.5))
  const e16 = M.newton('x-1-0.5*sin(x)', 1.5)
  ok(near(e16.steps[0].next, x1, 1e-13) && Math.abs(x1 - 1.49870) < 3e-5, 'Exercise 16: x₁ = 1.4987')
  // Exercise 11: a lucky first guess stays put
  const lucky = M.newton('x^2-4', 2)
  ok(lucky.status === 'converged' && lucky.steps.length >= 1 && lucky.last === 2, 'Exercise 11: when x₀ is a root, x₁ = x₀')
}

/* ------------------------------------------------------------------ 3: the order of convergence */
for (let t = 0; t < 400; t++) {
  // a cubic with three separated roots, started near one of them
  const r1 = Number(rnd(-3, -1).toFixed(4))
  const r2 = Number(rnd(-0.5, 0.5).toFixed(4))
  const r3 = Number(rnd(1, 3).toFixed(4))
  const f2 = (x) => (x - r1) * (x - r2) * (x - r3)
  const df = (x) => (x - r2) * (x - r3) + (x - r1) * (x - r3) + (x - r1) * (x - r2)
  const ddf = (x) => 2 * (x - r1) + 2 * (x - r2) + 2 * (x - r3)
  void f2
  const k = Math.floor(Math.random() * 3)
  const r = [r1, r2, r3][k]
  const src = `(x-(${r1}))*(x-(${r2}))*(x-(${r3}))`
  const x0 = r + (Math.random() < 0.5 ? -1 : 1) * rnd(0.01, 0.05)
  const run = M.newton(src, x0)
  ok(run.ok && run.status === 'converged' && near(run.last, r, 1e-9), `a cubic from near ${r}: ${run.ok ? run.last : 'refused'}`)
  if (!run.ok) continue
  const c = Math.abs(ddf(r) / (2 * df(r)))
  const tab = M.errorTable(run, r)
  // the first step whose error is between 1e-5 and 1e-3: the ratio e(n+1)/e(n)² is the constant, up to a relative O(e), as long as f″(r) is not nearly zero
  const row = tab.find((w) => w.err > 1e-5 && w.err < 1e-3 && Number.isFinite(w.quad))
  if (row && c > 0.05) ok(Math.abs(row.quad - c) <= 0.1 * c, `quadratic: e(n+1)/e(n)² = ${row.quad}, f″/(2f′) = ${c}`)
}
for (let m = 2; m <= 8; m++) {
  const r = Number(rnd(-2, 2).toFixed(4))
  const run = M.newton(`(x-(${r}))^${m}`, r + 1, 80)
  const tab = M.errorTable(run, r)
  const rows = tab.filter((w) => w.err > 1e-9 && Number.isFinite(w.lin))
  ok(rows.length >= 5 && rows.every((w) => near(w.lin, (m - 1) / m, 1e-7)), `multiplicity ${m}: e(n+1)/e(n) = ${(m - 1) / m} at every step`)
}
{
  // order 2 shows as the error being squared: the digits of the √2 run roughly double
  const t = M.errorTable(M.newton('x^2-2', 1), Math.SQRT2)
  ok(t[1].digits > 1 && t[2].digits > 2 * t[1].digits - 0.7 && t[3].digits > 2 * t[2].digits - 0.7, 'the correct digits of the √2 run about double at each step')
  ok(near(t[1].quad, 0.35355, 0.05) || Math.abs(t[1].quad - 1 / (2 * Math.SQRT2)) < 0.06, 'the constant for √2 is 1/(2√2)')
}

/* ------------------------------------------------------------- 4: roots and reciprocals by hand */
for (let t = 0; t < 300; t++) {
  const a = rnd(0.5, 50)
  const n = 2 + Math.floor(Math.random() * 4)
  const x0 = rnd(0.5, 5)
  const mine = M.rootIterates(a, n, x0, 40)
  ok(near(mine[mine.length - 1], a ** (1 / n), 1e-12), `x^${n} = ${a}: ${mine[mine.length - 1]}`)
  const eng = M.newton(`x^${n}-${a}`, x0, 6)
  ok(eng.ok && eng.steps.slice(0, 5).every((s, i) => near(s.next, mine[i + 1], 1e-9)), `the engine takes the steps of ((n−1)x + a/xⁿ⁻¹)/n for x^${n} − ${a}`)
  // the reciprocal, with a start that is under 2/a so that it converges
  const y0 = rnd(0.2, 1.8) / a
  const rec = M.reciprocalIterates(a, y0, 40)
  ok(near(rec[rec.length - 1], 1 / a, 1e-12), `1/${a}: ${rec[rec.length - 1]}`)
  const eng2 = M.newton(`1/x-${a}`, y0, 6)
  ok(eng2.ok && eng2.steps.slice(0, 5).every((s, i) => near(s.next, rec[i + 1], 1e-9)), `the engine takes the steps of x(2 − a x) for 1/x − ${a}`)
}
{
  // the Babylonian rule on √2 from 1 is the sequence of the textbook
  const xs = M.rootIterates(2, 2, 1, 3)
  ok(xs[1] === 1.5 && near(xs[2], 17 / 12, 1e-14) && near(xs[3], 577 / 408, 1e-14), 'the Babylonian rule: 1, 3/2, 17/12, 577/408')
  // a start beyond 2/a does not converge for the reciprocal: it runs off to −∞
  const bad = M.reciprocalIterates(3, 1, 8)
  ok(bad[bad.length - 1] < -1e3, 'the reciprocal rule from 1 for a = 3 (beyond 2/3) runs off')
}

/* -------------------------------------------------------------------- 5: the cases that go wrong */
{
  // x^(1/3): x(n+1) = −2 x(n), so x(n) = (−2)ⁿ and the run escapes
  const c = M.newton('x^(1/3)', 1, 40)
  ok(c.ok && c.status === 'diverged', 'x^(1/3) from 1 runs off')
  ok(c.steps.slice(0, 12).every((s, i) => near(s.x, (-2) ** i, 1e-9)), 'x^(1/3): x(n) = (−2)ⁿ')
  // x³ − 2x + 2 from 0: 0, 1, 0, 1
  const y = M.newton('x^3-2*x+2', 0, 40)
  ok(y.status === 'cycle' && y.period === 2 && y.steps[0].x === 0 && near(y.steps[1].x, 1, 1e-14) && near(y.steps[2].x, 0, 1e-12), 'x³ − 2x + 2 from 0 cycles between 0 and 1')
  // arctan x: the run converges below 1.3917452… and escapes above it
  const star = 1.3917452002707349
  const conv = (x0) => M.newton('arctan(x)', x0, 60).status === 'converged'
  ok(conv(1.39) && conv(1) && conv(-1.39) && !conv(1.4) && !conv(2) && !conv(-1.4), 'arctan x: converges from 1.39, escapes from 1.40')
  let lo = 1
  let hi = 2
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (conv(mid)) lo = mid
    else hi = mid
  }
  ok(Math.abs(lo - star) < 1e-6, `arctan x: the boundary is ${lo}, expected ${star}`)
  // a horizontal tangent
  ok(M.newton('x^2-1', 0).status === 'flat', 'x² − 1 from 0: the tangent is horizontal')
  // far from the root you want: sin x from 1.7 goes to 3π
  const s = M.newton('sin(x)', 1.7, 40)
  ok(s.status === 'converged' && near(s.last, 3 * Math.PI, 1e-9), `sin x from 1.7 reaches ${s.last}, 3π = ${3 * Math.PI}`)
  // a root of multiplicity 6: slow, then done
  ok(M.newton('(x-1)^6', 2, 40).status === 'unfinished', '(x − 1)⁶ is unfinished after 40 steps')
  const m = M.newton('(x-1)^6', 2, 400)
  ok(m.status === 'converged' && Math.abs(m.last - 1) < 1e-10, '(x − 1)⁶ converges in the end')
  // the cases of the widget: each ends as it says
  for (const k of M.FAIL_CASES) {
    const r = M.newton(k.f, k.x0, 40)
    ok(r.ok && r.status === k.status, `${k.id}: ${r.ok ? r.status : 'refused'}, expected ${k.status}`)
  }
  // f′ not defined at the point
  ok(M.newton('1/x', 0).status === 'undefined', '1/x from 0: f is not defined')
  // Exercise 14: f(x) = x^(1/3): x₁ = −2, x₂ = 4, x₃ = −8
  ok(near(c.steps[0].next, -2, 1e-12) && near(c.steps[1].next, 4, 1e-12) && near(c.steps[2].next, -8, 1e-12), 'Exercise 14: −2, 4, −8')
}

/* -------------------------------------------------------------------------- 6: the basins of attraction */
/** A plain Newton loop with the same stopping rule as the module, written without it. */
function plain(f, df, x0, max) {
  let x = x0
  for (let n = 0; n < max; n++) {
    const fx = f(x)
    const d = df(x)
    if (fx === 0) return x
    if (d === 0 || !Number.isFinite(d) || !Number.isFinite(fx)) return null
    const nx = x - fx / d
    if (!Number.isFinite(nx) || Math.abs(nx) > 1e10) return null
    if (Math.abs(nx - x) <= 1e-13 * (1 + Math.abs(x))) return nx
    x = nx
  }
  return null
}
{
  const FNS = [
    ['x^3-x', (x) => x ** 3 - x, (x) => 3 * x * x - 1, -2, 2],
    ['x^2-1', (x) => x * x - 1, (x) => 2 * x, -3, 3],
    ['x^3-2*x+2', (x) => x ** 3 - 2 * x + 2, (x) => 3 * x * x - 2, -3, 3],
    ['x^5-x-1', (x) => x ** 5 - x - 1, (x) => 5 * x ** 4 - 1, -1.5, 1.5],
    ['sin(x)', (x) => Math.sin(x), (x) => Math.cos(x), -4, 4],
  ]
  for (const [src, f, df, a, b] of FNS) {
    const B = M.basin(src, a, b, 400)
    ok(B.ok && B.starts.length === 400, `${src}: the basin has 400 starts`)
    let agree = 0
    for (const s of B.starts) {
      const ref = plain(f, df, s.x0, 60)
      const mine = s.root < 0 ? null : B.roots[s.root].root
      if ((ref === null && mine === null) || (ref !== null && mine !== null && Math.abs(ref - mine) < 1e-6 * (1 + Math.abs(ref)))) agree++
    }
    ok(agree === 400, `${src}: the basin agrees with the plain loop on ${agree} of 400 starts`)
    ok(B.roots.reduce((t, q) => t + q.count, 0) === B.starts.filter((s) => s.root >= 0).length, `${src}: the counts of the roots add up`)
    ok(B.roots.every((q, i) => i === 0 || B.roots[i - 1].root < q.root), `${src}: the roots are sorted`)
  }
  // an odd function: the basin of −x is the mirror image
  for (const src of ['x^3-x', 'x^3-2*x', 'sin(x)']) {
    const B = M.basin(src, -3, 3, 300)
    let mirrored = true
    for (let i = 0; i < 150; i++) {
      const p = B.starts[i]
      const q = B.starts[299 - i]
      const rp = p.root < 0 ? null : B.roots[p.root].root
      const rq = q.root < 0 ? null : B.roots[q.root].root
      if ((rp === null) !== (rq === null) || (rp !== null && Math.abs(rp + rq) > 1e-6)) mirrored = false
    }
    ok(mirrored, `${src} is odd: its basin is mirrored`)
  }
  // x² − 1: the sign of the start decides
  const sq = M.basin('x^2-1', -3, 3, 300)
  ok(sq.roots.length === 2 && near(sq.roots[0].root, -1) && near(sq.roots[1].root, 1) && sq.roots[0].count === 150 && sq.roots[1].count === 150, 'x² − 1: 150 starts to each root')
  ok(sq.starts.every((s) => (s.x0 < 0 ? s.root === 0 : s.root === 1)), 'x² − 1: negative starts reach −1, positive starts reach 1')
  // x³ − x: the Newton map is 2x³/(3x² − 1). Beyond 1/√3 it falls monotonically to 1; between −1/√5 and 1/√5 it goes to 0
  const cube = M.basin('x^3-x', -6, 6, 1200)
  ok(cube.roots.length === 3, 'x³ − x has three roots')
  const inRange = (s, lo, hi) => s.x0 > lo && s.x0 < hi
  ok(cube.starts.filter((s) => inRange(s, 0.58, 6)).every((s) => s.root === 2), 'x³ − x: every start above 1/√3 reaches 1')
  ok(cube.starts.filter((s) => inRange(s, -6, -0.58)).every((s) => s.root === 0), 'x³ − x: every start below −1/√3 reaches −1')
  ok(cube.starts.filter((s) => inRange(s, -0.44, 0.44)).every((s) => s.root === 1), 'x³ − x: every start between −1/√5 and 1/√5 reaches 0')
}

/* ------------------------------------------------------------------------------ 7: bisection and refusals */
{
  const mids = M.bisectionSteps('x^2-2', 1, 2, 30)
  ok(mids.length === 30 && mids.every((m, i) => Math.abs(m - Math.SQRT2) <= 1 / 2 ** (i + 1) + 1e-15), 'bisection: the error after k halvings is at most (b − a)/2^k')
  ok(M.bisectionSteps('x^2+1', 0, 1, 5) === null, 'bisection: no sign change, nothing to do')
  ok(M.newton('x^+', 1).ok === false, 'a bad function is refused')
  ok(M.newton('x', NaN).ok === false, 'a bad start is refused')
  ok(M.basin('x^+', -1, 1).ok === false && M.basin('x', 1, 0).ok === false, 'a bad function or interval is refused for the basin')
}

console.log(`newton check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
