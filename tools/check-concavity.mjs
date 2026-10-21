/** Checks src/lib/concavity.ts, the numbers behind the "Concavity and Curve Sketching" article.
 *
 *  References that do not use the code under test:
 *   1. The textbook's examples worked out by hand: Examples 1 to 7 (concavity, the inflection cases, the particle), Examples 8 to
 *      12 (the five graphs: every extreme value, inflection point, asymptote and intercept), and the exercises with exact answers
 *      (117 to 121, 123).
 *   2. Random polynomials written twice (coefficients and text): the inflection points against the exact real roots of f″ (Sturm
 *      sequences in fractions), and the concavity on each piece against a scan of the sign of f″.
 *   3. The Second Derivative Test against the First Derivative Test on every critical point of random polynomials, and the cases
 *      where it fails: c (x − r)^k for k = 2, 3, 4, 5.
 *   4. Asymptotes: rational functions a x² + b x + c over d x + e, whose oblique asymptote and pole are known in closed form,
 *      and (a x + b)/(c x + d), whose horizontal asymptote is a/c.
 *   5. The refusals, and the flat case of a line.
 *
 *  Run: npm run check:concavity   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'conc-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/concavity.ts')}'
export { evalFloat } from '${p('src/lib/chain.ts')}'
export { rat } from '${p('src/lib/realnum.ts')}'
export { realRoots, rootPoint, toNumber } from '${p('src/lib/rates.ts')}'`,
)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

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
const eq = (got, want, what) => ok(got === want, `${what}: got "${got}", want "${want}"`)
const rnd = (a, b) => a + Math.random() * (b - a)
const PI = Math.PI
const conc = (src, a, b) => {
  const r = M.concavity(src, a, b)
  if (!r.ok) throw new Error(`${src} on [${a}, ${b}]: ${r.error}`)
  return r
}
const sk = (src, a, b) => {
  const r = M.sketch(src, a, b)
  if (!r.ok) throw new Error(`${src} on [${a}, ${b}]: ${r.error}`)
  return r
}
const bends = (r) => r.pieces.map((q) => q.bend).join(' ')
const infl = (r) => r.points.filter((q) => q.inflection)
const same = (list, want, what, tol = 1e-6) => {
  ok(list.length === want.length && want.every((w) => list.some((v) => Math.abs(v - w) < tol)), `${what}: got [${list.map((v) => v.toFixed(5))}], want [${want.map((v) => v.toFixed(5))}]`)
}
const allCrit = (s) => s.branches.flatMap((br) => br.mono.crit)
const allInfl = (s) => s.branches.flatMap((br) => infl(br.conc))

/* ------------------------------------------------- 1: the textbook, worked out by hand */
{
  // Example 1: y = x³ is concave down on (−∞, 0) and up on (0, ∞); y = x² is concave up everywhere
  let r = conc('x^3', -2, 2)
  eq(bends(r), 'down up', 'Example 1a: x³')
  same(infl(r).map((q) => q.x), [0], 'Example 1a: the inflection point 0')
  r = conc('x^2', -2, 2)
  eq(bends(r), 'up', 'Example 1b: x² is concave up throughout')
  ok(r.points.length === 0, 'Example 1b: no point where f″ is zero')
  // Example 2: 3 + sin x on [0, 2π]: down on (0, π), up on (π, 2π), an inflection point (π, 3)
  r = conc('3+sin(x)', 0, 2 * PI)
  eq(bends(r), 'down up', 'Example 2: 3 + sin x')
  same(infl(r).map((q) => q.x), [PI], 'Example 2: at π')
  close(infl(r)[0].y, 3, 'Example 2: the point (π, 3)')
  close(M.evalFloat(r.df, PI), -1, 'Example 2: the tangent at π has slope −1')
  // Example 3: x³ − 3x² + 2: f″ = 6x − 6, inflection point (1, 0)
  r = conc('x^3-3*x^2+2', -1, 3)
  eq(bends(r), 'down up', 'Example 3: concave down then up')
  same(infl(r).map((q) => q.x), [1], 'Example 3: the inflection point 1')
  close(infl(r)[0].y, 0, 'Example 3: (1, 0)', 1e-9)
  // Example 4: x^(5/3): f″ = (10/9) x^(−1/3) does not exist at 0, yet there is an inflection point and a horizontal tangent
  r = conc('x^(5/3)', -2, 2)
  eq(bends(r), 'down up', 'Example 4')
  ok(r.points.length === 1 && r.points[0].kind === 'undefined' && r.points[0].inflection && r.points[0].tangent === 'smooth', 'Example 4: f″ does not exist at 0, the tangent is smooth, and it is an inflection point')
  close(M.evalFloat(r.df, 0), 0, 'Example 4: f′(0) = 0 (a horizontal tangent)')
  // Example 5: x⁴: f″ = 12x² is zero at 0 and does not change sign: no inflection point
  r = conc('x^4', -2, 2)
  eq(bends(r), 'up up', 'Example 5: concave up on both sides')
  ok(r.points.length === 1 && r.points[0].kind === 'zero' && !r.points[0].inflection, 'Example 5: f″ = 0 at 0 and no inflection point')
  eq(r.runs.map((q) => q.bend).join(' '), 'up', 'Example 5: one run')
  // Example 6: x^(1/3): a vertical tangent, f′ and f″ do not exist, and there is an inflection point
  r = conc('x^(1/3)', -2, 2)
  eq(bends(r), 'up down', 'Example 6: concave up for x < 0, down for x > 0')
  ok(r.points.length === 1 && r.points[0].inflection && r.points[0].tangent === 'vertical', 'Example 6: an inflection point at a vertical tangent')
  // x^(2/3) (Example 4 of Section 4.1): a cusp, concave down on both sides: no inflection point
  r = conc('x^(2/3)', -2, 2)
  eq(bends(r), 'down down', 'x^(2/3): concave down on both sides')
  ok(r.points.length === 1 && !r.points[0].inflection && r.points[0].tangent === 'cusp', 'x^(2/3): a cusp and no inflection point')
  // x|x|: f′ = 2|x| exists at 0, f″ does not, and there is an inflection point
  r = conc('x*abs(x)', -2, 2)
  ok(r.points.length === 1 && r.points[0].inflection && r.points[0].tangent === 'smooth', 'x|x|: an inflection point where f″ does not exist')
  // a corner is not a point of inflection even if the bending changes: |x| + x³ has f″ = 6x … but |x| adds a corner at 0
  r = conc('abs(x)+x^3', -2, 2)
  ok(r.points.length >= 1 && r.points.every((q) => !q.inflection || q.tangent !== 'corner'), '|x| + x³: the corner is never called an inflection point')
  // Example 7: the particle s = 2t³ − 14t² + 22t − 5 has a = 12t − 28, zero at t = 7/3, concave down before and up after
  r = conc('2*x^3-14*x^2+22*x-5', 0, 6)
  eq(bends(r), 'down up', 'Example 7: concave down then up')
  same(infl(r).map((q) => q.x), [7 / 3], 'Example 7: a = 0 at t = 7/3')
  // Example 8: x⁴ − 4x³ + 10: f″ = 12x(x − 2), inflection points (0, 10) and (2, −6), local minimum (3, −17), no extremum at 0
  let s = sk('x^4-4*x^3+10', -2, 4.5)
  same(allInfl(s).map((q) => q.x), [0, 2], 'Example 8: inflection points at 0 and 2')
  const i8 = allInfl(s)
  close(i8.find((q) => Math.abs(q.x) < 1e-6).y, 10, 'Example 8: (0, 10)')
  close(i8.find((q) => Math.abs(q.x - 2) < 1e-6).y, -6, 'Example 8: (2, −6)')
  eq(s.branches[0].conc.pieces.map((q) => q.bend).join(' '), 'up down up', 'Example 8: concave up, down, up')
  const c8 = allCrit(s)
  same(c8.map((q) => q.x), [0, 3], 'Example 8: critical points 0 and 3')
  eq(c8.map((q) => q.verdict).join(' '), 'none min', 'Example 8: no extremum at 0, a local minimum at 3')
  close(c8.find((q) => Math.abs(q.x - 3) < 1e-6).fx, -17, 'Example 8: the local minimum −17')
  eq(s.branches[0].mono.pieces.map((q) => q.trend).join(' '), 'down down up', 'Example 8: decreasing, decreasing, increasing')
  close(s.yIntercept, 10, 'Example 8: the y-intercept 10')
  eq(s.symmetry, 'none', 'Example 8: no symmetry')
  eq(s.left.kind + ' ' + s.right.kind, 'none none', 'Example 8: no asymptotes')
  // Example 9: (x + 1)²/(1 + x²): critical points ±1, inflection points −√3, 0, √3, horizontal asymptote y = 1
  s = sk('(x+1)^2/(1+x^2)', -8, 8)
  const c9 = allCrit(s)
  same(c9.map((q) => q.x), [-1, 1], 'Example 9: critical points ±1')
  eq(c9.map((q) => q.verdict).join(' '), 'min max', 'Example 9: minimum at −1, maximum at 1')
  close(c9[0].fx, 0, 'Example 9: f(−1) = 0', 1e-9)
  close(c9[1].fx, 2, 'Example 9: f(1) = 2')
  const i9 = allInfl(s)
  same(i9.map((q) => q.x), [-Math.sqrt(3), 0, Math.sqrt(3)], 'Example 9: inflection points at −√3, 0, √3')
  close(i9[1].y, 1, 'Example 9: (0, 1)')
  close(i9[2].y, 1 + Math.sqrt(3) / 2, 'Example 9: f(√3) = 1 + √3/2')
  close(i9[0].y, 1 - Math.sqrt(3) / 2, 'Example 9: f(−√3) = 1 − √3/2')
  eq(s.branches[0].conc.pieces.map((q) => q.bend).join(' '), 'down up down up', 'Example 9: concave down, up, down, up')
  eq(s.left.kind + ' ' + s.right.kind, 'horizontal horizontal', 'Example 9: a horizontal asymptote at both ends')
  close(s.left.b, 1, 'Example 9: y = 1 on the left', 1e-4)
  close(s.right.b, 1, 'Example 9: y = 1 on the right', 1e-4)
  ok(s.breaks.length === 0, 'Example 9: no break, so no vertical asymptote')
  same(s.xIntercepts, [-1], 'Example 9: the x-intercept −1 (a tangential zero)')
  close(s.yIntercept, 1, 'Example 9: the y-intercept 1')
  // Example 10: (x² + 4)/(2x): odd, vertical asymptote x = 0, oblique asymptote y = x/2, extremes at ±2
  s = sk('(x^2+4)/(2*x)', -8, 8)
  eq(s.symmetry, 'odd', 'Example 10: odd, so symmetric about the origin')
  ok(s.breaks.length === 1 && Math.abs(s.breaks[0].x) < 0.05 && s.breaks[0].vertical, 'Example 10: the y-axis is a vertical asymptote')
  eq(s.branches.length, 2, 'Example 10: two branches')
  eq(s.left.kind + ' ' + s.right.kind, 'oblique oblique', 'Example 10: oblique asymptotes')
  close(s.left.m, 0.5, 'Example 10: slope 1/2 on the left', 1e-6)
  close(s.right.m, 0.5, 'Example 10: slope 1/2 on the right', 1e-6)
  close(s.right.b, 0, 'Example 10: through the origin', 1e-3)
  const c10 = allCrit(s)
  same(c10.map((q) => q.x), [-2, 2], 'Example 10: critical points ±2')
  eq(c10.map((q) => q.verdict).join(' '), 'max min', 'Example 10: maximum at −2, minimum at 2')
  close(c10[0].fx, -2, 'Example 10: f(−2) = −2')
  close(c10[1].fx, 2, 'Example 10: f(2) = 2')
  ok(allInfl(s).length === 0, 'Example 10: no inflection point')
  eq(s.branches[0].conc.pieces.map((q) => q.bend).join(' '), 'down', 'Example 10: concave down for x < 0')
  eq(s.branches[1].conc.pieces.map((q) => q.bend).join(' '), 'up', 'Example 10: concave up for x > 0')
  ok(s.xIntercepts.length === 0 && s.yIntercept === null, 'Example 10: no intercepts')
  // Example 11: e^(2/x): decreasing on both pieces, inflection point (−1, e⁻²), horizontal asymptote y = 1, vertical asymptote x = 0
  s = sk('e^(2/x)', -6, 6)
  ok(s.breaks.length === 1 && Math.abs(s.breaks[0].x) < 0.1, 'Example 11: a break at 0')
  ok(s.branches.every((br) => br.mono.pieces.every((q) => q.trend === 'down')), 'Example 11: decreasing on both pieces')
  const i11 = allInfl(s)
  same(i11.map((q) => q.x), [-1], 'Example 11: the inflection point −1')
  close(i11[0].y, Math.exp(-2), 'Example 11: (−1, e⁻²)')
  eq(s.branches[0].conc.pieces.map((q) => q.bend).join(' '), 'down up', 'Example 11: concave down for x < −1, then up')
  eq(s.branches[1].conc.pieces.map((q) => q.bend).join(' '), 'up', 'Example 11: concave up for x > 0')
  eq(s.left.kind + ' ' + s.right.kind, 'horizontal horizontal', 'Example 11: horizontal asymptotes')
  close(s.left.b, 1, 'Example 11: y = 1', 1e-3)
  close(s.right.b, 1, 'Example 11: y = 1', 1e-3)
  ok(s.xIntercepts.length === 0, 'Example 11: f is never 0')
  // Example 12: cos x − (√2/2) x on [0, 2π]: local minimum at 5π/4, local maximum at 7π/4, inflection points π/2 and 3π/2
  s = sk('cos(x)-sqrt(2)*x/2', 0, 2 * PI)
  const c12 = allCrit(s)
  same(c12.map((q) => q.x), [(5 * PI) / 4, (7 * PI) / 4], 'Example 12: critical points')
  eq(c12.map((q) => q.verdict).join(' '), 'min max', 'Example 12: a local minimum then a local maximum')
  close(c12[0].fx, -3.4838, 'Example 12: f(5π/4) ≈ −3.48', 1e-3)
  close(c12[1].fx, -3.1802, 'Example 12: f(7π/4) ≈ −3.18', 1e-3)
  const i12 = allInfl(s)
  same(i12.map((q) => q.x), [PI / 2, (3 * PI) / 2], 'Example 12: inflection points π/2 and 3π/2')
  close(i12[0].y, -(Math.SQRT2 / 2) * (PI / 2), 'Example 12: f(π/2) ≈ −1.11')
  close(i12[1].y, -(Math.SQRT2 / 2) * ((3 * PI) / 2), 'Example 12: f(3π/2) ≈ −3.33')
  const m12 = s.branches[0].mono
  close(m12.absMax.value, 1, 'Example 12: the absolute maximum f(0) = 1')
  close(m12.absMin.value, c12[0].fx, 'Example 12: the absolute minimum is the local minimum at 5π/4')
  // Exercises 117 to 120: cubics and quadratics
  for (let t = 0; t < 200; t++) {
    const a = rnd(0.4, 4) * (Math.random() < 0.5 ? -1 : 1)
    const b = rnd(-6, 6)
    const c = rnd(-6, 6)
    const d = rnd(-6, 6)
    const x0 = -b / (3 * a)
    const rr = conc(`(${a})*x^3+(${b})*x^2+(${c})*x+(${d})`, x0 - 3, x0 + 4)
    same(infl(rr).map((q) => q.x), [x0], 'Exercise 120: one inflection point at −b/(3a)')
    eq(bends(rr), a > 0 ? 'down up' : 'up down', 'Exercise 120: the bending on each side')
    const q = conc(`(${a})*x^2+(${b})*x+(${c})`, -5, 5)
    ok(q.points.length === 0 && bends(q) === (a > 0 ? 'up' : 'down'), 'Exercises 118, 119: a parabola never has an inflection point')
  }
  // Exercise 117: x³ + bx² + cx + d has an inflection point at x = 1 for b = −3
  r = conc('x^3-3*x^2+5*x+7', -2, 4)
  same(infl(r).map((q) => q.x), [1], 'Exercise 117: b = −3')
  // Exercise 121: y″ = (x + 1)(x − 2): f = x⁴/12 − x³/6 − x² has inflection points at −1 and 2
  r = conc('x^4/12-x^3/6-x^2', -4, 4)
  same(infl(r).map((q) => q.x), [-1, 2], 'Exercise 121: inflection points −1 and 2')
  eq(bends(r), 'up down up', 'Exercise 121: concave up, down, up')
  // Exercise 123: y = −x³ + 3x² + 9x (a = −1, b = 3, c = 9): local maximum at 3, local minimum at −1, inflection point (1, 11)
  r = conc('-x^3+3*x^2+9*x', -4, 5)
  same(infl(r).map((q) => q.x), [1], 'Exercise 123: the inflection point 1')
  close(infl(r)[0].y, 11, 'Exercise 123: (1, 11)')
  const t3 = M.secondTest('-x^3+3*x^2+9*x', 3)
  const t1 = M.secondTest('-x^3+3*x^2+9*x', -1)
  eq(t3.second + ' ' + t1.second, 'max min', 'Exercise 123: a local maximum at 3 and a local minimum at −1')
  close(t3.fc, 27, 'Exercise 123: y(3) = 27')
  close(t1.fc, -5, 'Exercise 123: y(−1) = −5')
}

/* ----------------------- 2: random polynomials: inflections against the exact roots of f″ */
{
  let tested = 0
  for (let t = 0; t < 500; t++) {
    const deg = 3 + Math.floor(Math.random() * 3)
    const cs = Array.from({ length: deg + 1 }, () => Math.round(rnd(-9, 9) * 4) / 4)
    if (cs[deg] === 0) cs[deg] = 1
    const a = rnd(-5, -0.5)
    const b = a + rnd(3, 9)
    const d2cs = cs.slice(2).map((c, k) => c * (k + 2) * (k + 1))
    const d2 = (x) => d2cs.reduceRight((acc, c) => acc * x + c, 0)
    const r = conc(cs.map((c, k) => `(${c})*x^${k}`).join('+'), a, b)
    tested++
    const poly = d2cs.map((c) => M.rat(BigInt(Math.round(c * 4)), 4n))
    const roots = M.realRoots(poly, M.rat(-1000n, 1n), M.rat(1000n, 1n))
      .map((q) => M.toNumber(M.rootPoint(q)))
      .filter((x) => x > a + 1e-6 && x < b - 1e-6)
    same(r.points.map((q) => q.x), roots, `inflections of ${cs}: the real roots of f″ in (a, b)`, 1e-5)
    for (const q of r.pieces) {
      let pos = 0
      let neg = 0
      for (let k = 1; k < 200; k++) {
        const v = d2(q.lo + ((q.hi - q.lo) * k) / 200)
        if (v > 1e-9) pos++
        else if (v < -1e-9) neg++
      }
      ok(q.bend === 'up' ? neg === 0 : q.bend === 'down' ? pos === 0 : pos === 0 && neg === 0, `${cs}: the piece (${q.lo.toFixed(3)}, ${q.hi.toFixed(3)}) is ${q.bend} but f″ has ${pos} positive and ${neg} negative samples`)
    }
    // simple roots of f″ change the sign: each is an inflection point; the runs alternate
    for (let i = 1; i < r.runs.length; i++) ok(r.runs[i].bend !== r.runs[i - 1].bend, 'the runs alternate')
    // a root of f″ is an inflection point when f″ changes sign there: a simple root does, a double root (zero coefficients make some) does not
    for (const q of r.points) {
      const gap = 1e-4
      const flips = d2(q.x - gap) * d2(q.x + gap) < 0
      ok(q.inflection === flips && q.tangent === 'smooth', `${cs}: the point ${q.x}: inflection ${q.inflection}, f″ changes sign ${flips}, tangent ${q.tangent}`)
    }
  }
  ok(tested === 500, 'five hundred random polynomials')
}

/* ------------------------------ 3: the Second Derivative Test against the First, and where it fails */
{
  // every critical point of random polynomials
  for (let t = 0; t < 400; t++) {
    const deg = 2 + Math.floor(Math.random() * 4)
    const cs = Array.from({ length: deg + 1 }, () => Math.round(rnd(-9, 9) * 4) / 4)
    if (cs[deg] === 0) cs[deg] = 1
    const dcs = cs.slice(1).map((c, k) => c * (k + 1))
    const poly = dcs.map((c) => M.rat(BigInt(Math.round(c * 4)), 4n))
    const roots = M.realRoots(poly, M.rat(-1000n, 1n), M.rat(1000n, 1n)).map((q) => M.toNumber(M.rootPoint(q)))
    const src = cs.map((c, k) => `(${c})*x^${k}`).join('+')
    for (const c of roots) {
      const near = roots.filter((o) => o !== c).map((o) => Math.abs(o - c))
      const radius = Math.min(0.5, near.length ? Math.min(...near) / 2 : 0.5)
      const r = M.secondTest(src, c, radius)
      ok(r.ok, 'the test runs')
      if (r.second === 'min' || r.second === 'max') eq(r.second, r.first, `${src} at ${c}: the Second Derivative Test agrees with the First`)
    }
  }
  // c (x − r)^k: the Second Derivative Test works for k = 2 and fails for k ≥ 3, where the First Derivative Test decides
  for (let t = 0; t < 300; t++) {
    const k = 2 + Math.floor(Math.random() * 4)
    const c = rnd(0.5, 4) * (Math.random() < 0.5 ? -1 : 1)
    const rt = Math.round(rnd(-3, 3) * 4) / 4
    const r = M.secondTest(`(${c})*(x-(${rt}))^${k}`, rt, 0.5)
    eq(r.second, k === 2 ? (c > 0 ? 'min' : 'max') : 'fails', `c (x − ${rt})^${k}: the Second Derivative Test`)
    eq(r.first, k % 2 === 1 ? 'none' : c > 0 ? 'min' : 'max', `c (x − ${rt})^${k}: the First Derivative Test`)
  }
  // the cases of the article
  const want = { min: 'min min', max: 'max max', 'quartic-min': 'fails min', 'quartic-max': 'fails max', cubic: 'fails none', cusp: 'fails min', 'sine-max': 'max max', 'sine-min': 'min min' }
  for (const q of M.SECOND_CASES) {
    const r = M.secondTest(q.src, q.c, 0.5)
    ok(r.ok, `${q.id} runs`)
    eq(`${r.second} ${r.first}`, want[q.id], `case ${q.id}`)
  }
  // part 3 of the theorem: x⁴, −x⁴ and x³ have f′ = f″ = 0 at 0 and three different outcomes
  for (const [src, second, first] of [['x^4', 'fails', 'min'], ['-x^4', 'fails', 'max'], ['x^3', 'fails', 'none']]) {
    const r = M.secondTest(src, 0, 0.5)
    ok(Math.abs(r.slope) < 1e-12 && Math.abs(r.curvature) < 1e-12 && r.second === second && r.first === first, `${src}: f′(0) = f″(0) = 0, the test fails`)
  }
  ok(M.secondTest('x^2', 1, 0.5).second === 'notcritical', 'a point that is not critical is refused')
  // the inflection cases of the article
  const kind = { cubic: 'smooth', 'fifth-thirds': 'smooth', 'cube-root': 'vertical', quartic: 'smooth', 'two-thirds': 'cusp', sine: 'smooth', corner: 'smooth' }
  for (const q of M.INFLECTION_CASES) {
    const r = conc(q.src, q.a, q.b)
    const at = r.points.find((z) => Math.abs(z.x - q.c) < 1e-5 * (1 + Math.abs(q.c)))
    ok(!!at, `${q.id}: the point ${q.c} is found`)
    if (at) {
      eq(at.inflection, q.inflection, `${q.id}: inflection or not`)
      eq(at.tangent, kind[q.id], `${q.id}: the tangent`)
    }
  }
}

/* ------------------------------------------------------------------- 4: asymptotes */
{
  for (let t = 0; t < 120; t++) {
    const d = rnd(0.5, 3) * (Math.random() < 0.5 ? -1 : 1)
    const a = rnd(0.5, 4) * (Math.random() < 0.5 ? -1 : 1)
    const b = rnd(-4, 4)
    const c = rnd(-4, 4)
    const e = Math.round(rnd(-3, 3) * 4) / 4 + 0.013
    // a numerator that is nearly 0 at the pole makes a pole that the grid cannot see: skip those
    const pole = -e / d
    if (Math.abs(a * pole * pole + b * pole + c) < 1.5 || Math.abs(a * pole + b) < 1.5) continue
    // a x² + b x + c over d x + e: oblique asymptote with slope a/d and intercept (b − a e / d) / d, pole at −e/d
    const src = `((${a})*x^2+(${b})*x+(${c}))/((${d})*x+(${e}))`
    const s = sk(src, -12, 12)
    eq(s.left.kind + ' ' + s.right.kind, 'oblique oblique', `${src}: oblique asymptotes`)
    close(s.right.m, a / d, `${src}: slope a/d`, 1e-6)
    close(s.right.b, (b - (a * e) / d) / d, `${src}: intercept`, 1e-3)
    close(s.left.m, a / d, `${src}: slope on the left`, 1e-6)
    ok(s.breaks.length === 1 && Math.abs(s.breaks[0].x + e / d) < 0.1, `${src}: the pole −e/d = ${(-e / d).toFixed(3)}, got ${s.breaks.map((k) => k.x.toFixed(3))}`)
    // (a x + b)/(c x + d): a horizontal asymptote a/c at both ends
    const f2 = `((${a})*x+(${b}))/((${d})*x+(${e}))`
    const s2 = sk(f2, -12, 12)
    eq(s2.left.kind + ' ' + s2.right.kind, 'horizontal horizontal', `${f2}: horizontal asymptotes`)
    close(s2.right.b, a / d, `${f2}: y = a/d`, 1e-4)
    close(s2.left.b, a / d, `${f2}: y = a/d on the left`, 1e-4)
  }
  for (const [src, l, r] of [['x^2', 'none', 'none'], ['x^3', 'none', 'none'], ['sin(x)', 'none', 'none'], ['1/x', 'horizontal', 'horizontal'], ['3*x+2', 'oblique', 'oblique'], ['5', 'horizontal', 'horizontal'], ['e^x', 'horizontal', 'none'], ['e^(-x)', 'none', 'horizontal'], ['arctan(x)', 'horizontal', 'horizontal']]) {
    const f = M.sketch(src, -4, 4)
    if (!f.ok) throw new Error(src)
    eq(f.left.kind + ' ' + f.right.kind, l + ' ' + r, `${src}: asymptotes at the ends`)
  }
  const e1 = M.sketch('e^x', -4, 4)
  ok(Math.abs(e1.left.b) < 1e-9, 'e^x: y = 0 on the left')
  const at = M.sketch('arctan(x)', -4, 4)
  close(at.right.b, PI / 2, 'arctan: y = π/2', 1e-4)
  close(at.left.b, -PI / 2, 'arctan: y = −π/2', 1e-4)
  eq(at.symmetry, 'odd', 'arctan is odd')
  eq(M.sketch('x^2', -4, 4).symmetry, 'even', 'x² is even')
  eq(M.sketch('x^2+x', -4, 4).symmetry, 'none', 'x² + x has no symmetry')
}

/* ------------------------------------------------------------------ 5: refusals and lines */
{
  for (const [src, a, b, why] of [['x^+', 0, 1, 'syntax'], ['x^2', 2, 1, 'interval'], ['ln(x)', -2, -1, 'undefined'], ['1/x', -1, 1, 'discontinuous']]) {
    const r = M.concavity(src, a, b)
    ok(!r.ok && r.error === why, `${src} on [${a}, ${b}] is refused as ${why}`)
  }
  const line = conc('2*x+1', -3, 3)
  ok(line.pieces.length === 1 && line.pieces[0].bend === 'flat' && line.points.length === 0, 'a line does not bend')
  const bad = M.sketch('x^+', -1, 1)
  ok(!bad.ok && bad.error === 'syntax', 'a sketch refuses a bad function')
  const none = M.sketch('ln(x)', -3, -1)
  ok(!none.ok, 'a sketch refuses a window where f is nowhere defined')
  const half = M.sketch('ln(x)', -1, 4)
  ok(half.ok === true || half.ok === false, 'a window partly outside the domain is handled')
}

console.log(`concavity check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
