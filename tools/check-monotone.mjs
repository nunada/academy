/** Checks src/lib/monotone.ts, the numbers behind the "Monotonic Functions and the First Derivative Test" article.
 *
 *  References that do not use the code under test:
 *   1. The textbook's three examples with the intervals, extreme values and critical points worked out by hand, and the
 *      exercises whose answers can be written down: the derivatives of Exercises 1 to 9, 27, 78, 79, 80, 83 and the particle.
 *   2. Random polynomials written twice (coefficients, and the same polynomial as text): the critical points against the exact
 *      real roots of the derivative (Sturm sequences in fractions), the sign of f′ on every piece against a scan of a hundred
 *      thousand points, and the verdict of the First Derivative Test against a scan of f itself around each critical point.
 *   3. Derivatives built from their factors, s·(x − r₁)^m₁ (x − r₂)^m₂ …: the sign pattern is known from the multiplicities
 *      (an odd one changes the sign, an even one does not), so every piece and every verdict is predicted.
 *   4. f = c (x − r)^k: a minimum, a maximum or no extreme value according to k and the sign of c.
 *   5. The eight patterns of the First Derivative Test, the ends of an interval, constant functions, and the refusals.
 *   6. Corollary 3 itself (f really is larger at a larger x inside a piece that is increasing) and the runs that cover [a, b].
 *   7. Inequalities by monotonicity: e^x ≥ 1 + x, e^x ≥ 1 + x + x²/2, x > ln x, x > sin x, against a scan of the difference.
 *
 *  Run: npm run check:monotone   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mono-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/monotone.ts')}'
export { evalFloat } from '${p('src/lib/chain.ts')}'
export { rat } from '${p('src/lib/realnum.ts')}'
export { derivative } from '${p('src/lib/tangent.ts')}'
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
// a reproducible random source (mulberry32): every run checks the same cases; MONO_SEED=n tries other ones
let seed = Number(process.env.MONO_SEED ?? 20261024) | 0
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rnd = (a, b) => a + rand() * (b - a)
const PI = Math.PI
const mono = (src, a, b) => {
  const r = M.monotone(src, a, b)
  if (!r.ok) throw new Error(`${src} on [${a}, ${b}]: ${r.error}`)
  return r
}
const chart = (src, a, b) => {
  const r = M.chart(src, a, b)
  if (!r.ok) throw new Error(`${src} on [${a}, ${b}]: ${r.error}`)
  return r
}
const trends = (r) => r.pieces.map((q) => q.trend).join(' ')
const verdicts = (r) => r.crit.map((c) => c.verdict).join(' ')
const xs = (r) => r.crit.map((c) => c.x)
const same = (list, want, what, tol = 1e-6) => {
  ok(list.length === want.length && want.every((w) => list.some((v) => Math.abs(v - w) < tol)), `${what}: got [${list.map((v) => v.toFixed(5))}], want [${want.map((v) => v.toFixed(5))}]`)
}
const eq = (got, want, what) => ok(got === want, `${what}: got "${got}", want "${want}"`)

/* ---------------------------------------------------------- 1: the textbook, worked out by hand */
{
  // Example 1: x³ − 12x − 5, f′ = 3(x + 2)(x − 2)
  const e1 = mono('x^3-12*x-5', -4, 4)
  same(xs(e1), [-2, 2], 'Example 1: critical points')
  eq(trends(e1), 'up down up', 'Example 1: increasing, decreasing, increasing')
  eq(verdicts(e1), 'max min', 'Example 1: a local maximum at −2 and a local minimum at 2')
  close(e1.crit[0].fx, 11, 'Example 1: f(−2) = 11')
  close(e1.crit[1].fx, -21, 'Example 1: f(2) = −21')
  eq(e1.runs.map((r) => r.trend).join(' '), 'up down up', 'Example 1: three runs')
  // the three test points of the textbook: f′(−3) = 15, f′(0) = −12, f′(3) = 15
  for (const [x, want] of [[-3, 15], [0, -12], [3, 15]]) close(M.evalFloat(e1.df, x), want, `Example 1: f′(${x})`)
  // Example 2: x^(1/3) (x − 4): f′ = (4/3) x^(−2/3) (x − 1), zero at 1, not defined at 0
  const e2 = mono('x^(1/3)*(x-4)', -2, 5)
  same(xs(e2), [0, 1], 'Example 2: critical points 0 and 1')
  ok(e2.crit[0].kind === 'undefined' && e2.crit[1].kind === 'zero', 'Example 2: f′ is undefined at 0 and zero at 1')
  eq(trends(e2), 'down down up', 'Example 2: decreasing, decreasing, increasing')
  eq(verdicts(e2), 'none min', 'Example 2: no extreme value at 0, a local minimum at 1')
  close(e2.crit[1].fx, -3, 'Example 2: f(1) = −3')
  close(e2.absMin.value, -3, 'Example 2: it is the absolute minimum')
  ok(M.evalFloat(e2.df, -1e-9) < -1e5, 'Example 2: f′ → −∞ at 0, a vertical tangent')
  eq(e2.runs.map((r) => r.trend).join(' '), 'down up', 'Example 2: two runs after joining')
  // Example 3: (x² − 3) eˣ: f′ = (x + 3)(x − 1) eˣ
  const e3 = mono('(x^2-3)*e^x', -6, 3)
  same(xs(e3), [-3, 1], 'Example 3: critical points −3 and 1')
  eq(trends(e3), 'up down up', 'Example 3: pattern of f′')
  eq(verdicts(e3), 'max min', 'Example 3: maximum at −3, minimum at 1')
  close(e3.crit[0].fx, 6 * Math.exp(-3), 'Example 3: the local maximum 6e⁻³ ≈ 0.299')
  close(e3.crit[0].fx, 0.2987, 'Example 3: ≈ 0.299', 1e-3)
  close(e3.crit[1].fx, -2 * Math.E, 'Example 3: the local minimum −2e ≈ −5.437')
  close(e3.absMin.value, -2 * Math.E, 'Example 3: the minimum is absolute on this window')
  // Exercises 1 to 9: the derivative is given
  const c = (src, a = -6, b = 6) => chart(src, a, b)
  let r = c('x*(x-1)')
  same(xs(r), [0, 1], 'Exercise 1')
  eq(trends(r), 'up down up', 'Exercise 1: signs')
  eq(verdicts(r), 'max min', 'Exercise 1: verdicts')
  r = c('(x-1)*(x+2)')
  same(xs(r), [-2, 1], 'Exercise 2')
  eq(verdicts(r), 'max min', 'Exercise 2: verdicts')
  r = c('(x-1)^2*(x+2)')
  same(xs(r), [-2, 1], 'Exercise 3')
  eq(trends(r), 'down up up', 'Exercise 3: signs')
  eq(verdicts(r), 'min none', 'Exercise 3: a minimum at −2 and nothing at 1')
  r = c('(x-1)^2*(x+2)^2')
  same(xs(r), [-2, 1], 'Exercise 4')
  eq(trends(r), 'up up up', 'Exercise 4: always rising')
  eq(verdicts(r), 'none none', 'Exercise 4: no extreme values')
  r = c('(x-1)*e^(-x)')
  same(xs(r), [1], 'Exercise 5')
  eq(trends(r), 'down up', 'Exercise 5: signs')
  eq(verdicts(r), 'min', 'Exercise 5: a minimum at 1')
  r = c('(x-7)*(x+1)*(x+5)', -6, 8)
  same(xs(r), [-5, -1, 7], 'Exercise 6')
  eq(trends(r), 'down up down up', 'Exercise 6: signs')
  eq(verdicts(r), 'min max min', 'Exercise 6: verdicts')
  // Exercise 9: f′ = 1 − 4/x², not defined at 0 (where f is not either)
  r = c('1-4/x^2', -4, 4)
  same(xs(r), [-2, 0, 2], 'Exercise 9')
  eq(trends(r), 'up down down up', 'Exercise 9: signs')
  eq(verdicts(r), 'max none min', 'Exercise 9: verdicts')
  ok(r.crit.some((q) => q.kind === 'undefined' && Math.abs(q.x) < 1e-6), 'Exercise 9: the point 0 is one where f′ does not exist')
  // Exercise 27: x⁴ − 8x² + 16 = (x² − 4)²
  r = mono('x^4-8*x^2+16', -3, 3)
  same(xs(r), [-2, 0, 2], 'Exercise 27')
  eq(trends(r), 'down up down up', 'Exercise 27: signs')
  eq(verdicts(r), 'min max min', 'Exercise 27: verdicts')
  close(r.crit[0].fx, 0, 'Exercise 27: f(−2) = 0', 1e-9)
  close(r.crit[1].fx, 16, 'Exercise 27: f(0) = 16')
  // Exercise 80: a = 2, b = −3, c = d = 0 gives 2x³ − 3x²: a local maximum at (0, 0) and a local minimum at (1, −1)
  r = mono('2*x^3-3*x^2', -1, 2)
  same(xs(r), [0, 1], 'Exercise 80')
  eq(verdicts(r), 'max min', 'Exercise 80: verdicts')
  close(r.crit[0].fx, 0, 'Exercise 80: f(0) = 0')
  close(r.crit[1].fx, -1, 'Exercise 80: f(1) = −1')
  // Exercise 79: f = −2x² + 4x has its absolute maximum 2 at x = 1
  r = mono('-2*x^2+4*x', -1, 3)
  close(r.absMax.value, 2, 'Exercise 79: the maximum 2')
  same(r.absMax.at, [1], 'Exercise 79: at x = 1')
  // Exercise 83: e^x − 2x on [0, 1]: the minimum 2 − 2 ln 2 at ln 2, the maximum 1 at 0
  r = mono('e^x-2*x', 0, 1)
  close(r.absMin.value, 2 - 2 * Math.log(2), 'Exercise 83: the minimum 2 − 2 ln 2')
  same(r.absMin.at, [Math.log(2)], 'Exercise 83: at ln 2')
  close(r.absMax.value, 1, 'Exercise 83: the maximum 1')
  same(r.absMax.at, [0], 'Exercise 83: at 0')
  // Example 7: the particle s = 2t³ − 14t² + 22t − 5, v = 2(t − 1)(3t − 11)
  r = mono('2*t^3-14*t^2+22*t-5'.replaceAll('t', 'x'), 0, 6)
  same(xs(r), [1, 11 / 3], 'Example 7: the particle turns round at t = 1 and t = 11/3')
  eq(trends(r), 'up down up', 'Example 7: right, left, right')
  close(r.crit[0].fx, 5, 'Example 7: s(1) = 5')
  close(r.crit[1].fx, -377 / 27, 'Example 7: s(11/3) = −377/27')
  for (const t of [0, 0.5, 2, 3, 5]) close(M.PARTICLE.v(t), M.evalFloat(r.df, t), `Example 7: v(${t})`)
  close(M.PARTICLE.a(7 / 3), 0, 'Example 7: a(7/3) = 0')
  // Exercise 78: ax² + bx + c turns at −b/(2a)
  for (let i = 0; i < 200; i++) {
    const a = rnd(0.3, 4) * (rand() < 0.5 ? -1 : 1)
    const b = rnd(-6, 6)
    const k = rnd(-5, 5)
    const turn = -b / (2 * a)
    const rr = mono(`(${a})*x^2+(${b})*x+(${k})`, turn - 3, turn + 4)
    same(xs(rr), [turn], 'Exercise 78: the turning point −b/(2a)')
    eq(trends(rr), a > 0 ? 'down up' : 'up down', 'Exercise 78: the shape')
    eq(verdicts(rr), a > 0 ? 'min' : 'max', 'Exercise 78: the verdict')
  }
}

/* ------------------------------------- 2: random polynomials, against exact roots and a scan */
{
  const poly = (cs) => cs.map((c, k) => `(${c})*x^${k}`).join('+')
  let tested = 0
  for (let t = 0; t < 500; t++) {
    const deg = 2 + Math.floor(rand() * 4)
    const cs = Array.from({ length: deg + 1 }, () => Math.round(rnd(-9, 9) * 4) / 4)
    if (cs[deg] === 0) cs[deg] = 1
    const a = rnd(-5, -0.5)
    const b = a + rnd(3, 9)
    const f = (x) => cs.reduceRight((acc, c) => acc * x + c, 0)
    const dcs = cs.slice(1).map((c, k) => c * (k + 1))
    const df = (x) => dcs.reduceRight((acc, c) => acc * x + c, 0)
    const r = mono(poly(cs), a, b)
    tested++
    // the critical points are the real roots of f′ in (a, b), exact
    const dpoly = dcs.map((c) => M.rat(BigInt(Math.round(c * 4)), 4n))
    const roots = M.realRoots(dpoly, M.rat(-1000n, 1n), M.rat(1000n, 1n))
      .map((q) => M.toNumber(M.rootPoint(q)))
      .filter((x) => x > a + 1e-6 && x < b - 1e-6)
    // a double root of f′ is a tangential zero: both the exact roots and the engine report it once
    same(xs(r), roots, `${poly(cs)} on [${a.toFixed(2)}, ${b.toFixed(2)}]: critical points`, 1e-5)
    // the trend on every piece against the sign of f′ read at many points
    for (const q of r.pieces) {
      let pos = 0
      let neg = 0
      for (let k = 1; k < 200; k++) {
        const x = q.lo + ((q.hi - q.lo) * k) / 200
        const v = df(x)
        if (v > 1e-9) pos++
        else if (v < -1e-9) neg++
      }
      ok(q.trend === 'up' ? neg === 0 : q.trend === 'down' ? pos === 0 : pos === 0 && neg === 0, `${poly(cs)}: the piece (${q.lo.toFixed(3)}, ${q.hi.toFixed(3)}) is ${q.trend} but f′ has ${pos} positive and ${neg} negative samples`)
    }
    // the First Derivative Test against f itself: a local minimum means f is larger on both sides nearby
    for (const c of r.crit) {
      const h = Math.min(0.02, (c.x - a) / 2, (b - c.x) / 2, ...r.crit.filter((o) => o !== c).map((o) => Math.abs(o.x - c.x) / 2))
      const l = f(c.x - h)
      const m = f(c.x)
      const rr = f(c.x + h)
      const scaleTol = 1e-12 * (1 + Math.abs(m))
      const min = l > m + scaleTol && rr > m + scaleTol
      const max = l < m - scaleTol && rr < m - scaleTol
      ok((c.verdict === 'min') === min && (c.verdict === 'max') === max, `${poly(cs)}: at ${c.x.toFixed(4)} the verdict ${c.verdict} against f(${(c.x - h).toFixed(4)}) = ${l}, f(c) = ${m}, f(${(c.x + h).toFixed(4)}) = ${rr}`)
    }
    // the runs cover [a, b] without a gap and alternate
    ok(r.runs[0].lo === a && r.runs[r.runs.length - 1].hi === b, 'the runs start at a and end at b')
    for (let i = 1; i < r.runs.length; i++) ok(r.runs[i].lo === r.runs[i - 1].hi && r.runs[i].trend !== r.runs[i - 1].trend, 'the runs join and alternate')
    // the absolute extremes are among the endpoints and the critical points
    const cand = [a, b, ...xs(r)].map(f)
    close(r.absMax.value, Math.max(...cand), `${poly(cs)}: the absolute maximum`, 1e-8)
    close(r.absMin.value, Math.min(...cand), `${poly(cs)}: the absolute minimum`, 1e-8)
  }
  ok(tested === 500, 'five hundred random polynomials')
}

/* -------------------------------- 3: derivatives built from their factors, with known sign patterns */
{
  let tested = 0
  for (let t = 0; t < 400; t++) {
    const n = 1 + Math.floor(rand() * 4)
    const roots = []
    while (roots.length < n) {
      const r = Math.round(rnd(-5, 5) * 4) / 4
      if (roots.every((q) => Math.abs(q - r) >= 0.5)) roots.push(r)
    }
    roots.sort((q, w) => q - w)
    const mult = roots.map(() => 1 + Math.floor(rand() * 3))
    const s = rand() < 0.5 ? 1 : -1
    const src = `${s < 0 ? '-' : ''}${roots.map((r, i) => `(x-(${r}))^${mult[i]}`).join('*')}`
    const r = chart(src, -6.5, 6.5)
    tested++
    same(xs(r), roots, `${src}: the critical points are the roots`)
    // to the right of every root all factors are positive: the sign is s, and an odd multiplicity flips it going left
    const want = new Array(n + 1)
    let sign = s
    want[n] = sign
    for (let i = n - 1; i >= 0; i--) {
      if (mult[i] % 2 === 1) sign = -sign
      want[i] = sign
    }
    eq(trends(r), want.map((v) => (v > 0 ? 'up' : 'down')).join(' '), `${src}: the sign pattern`)
    eq(
      verdicts(r),
      roots.map((_, i) => (want[i] === want[i + 1] ? 'none' : want[i] < 0 ? 'min' : 'max')).join(' '),
      `${src}: the verdicts`,
    )
  }
  ok(tested === 400, 'four hundred derivatives from factors')
}

/* a case that failed once in CI with a random source: f′ = −(x + 4.75)³ (x − 2.25)³ (x − 3.75)³ (x − 5)³ has only these four
   roots (the string is f′ itself), but between the first two it rises to 1.28e8, which the engine once took for a vertical tangent */
{
  const src = '-(x-(-4.75))^3*(x-(2.25))^3*(x-(3.75))^3*(x-(5))^3'
  const r = chart(src, -6.5, 6.5)
  same(xs(r), [-4.75, 2.25, 3.75, 5], 'all multiplicities 3: only the four roots are critical')
  eq(trends(r), 'down up down up down', 'all multiplicities 3: the sign pattern')
  eq(verdicts(r), 'min max min max', 'all multiplicities 3: the verdicts')
  ok(r.crit.every((c) => c.kind === 'zero'), 'all multiplicities 3: f′ is zero at each, nowhere undefined')
  ok(Math.abs(M.evalFloat(r.df, -2.697257893)) > 1e8, 'all multiplicities 3: f′ really is above 1e8 between the first two roots')
}

/* ------------------------------------------------------------------ 4: c (x − r)^k */
{
  for (let t = 0; t < 300; t++) {
    const k = 2 + Math.floor(rand() * 4)
    const c = rnd(0.5, 4) * (rand() < 0.5 ? -1 : 1)
    const rt = Math.round(rnd(-3, 3) * 4) / 4
    const d = rnd(-3, 3)
    const r = mono(`(${c})*(x-(${rt}))^${k}+(${d})`, rt - 2, rt + 2.5)
    same(xs(r), [rt], `(x − ${rt})^${k}: one critical point`, 1e-4)
    const want = k % 2 === 1 ? 'none' : c > 0 ? 'min' : 'max'
    eq(verdicts(r), want, `c = ${c.toFixed(2)}, k = ${k}`)
  }
}

/* ---------------------------------------------- 5: the patterns, the ends, constants, refusals */
{
  const want = { min: 'min', max: 'max', up: 'none', down: 'none', corner: 'min', cusp: 'min', vertical: 'none', 'flat-max': 'max' }
  for (const q of M.PATTERNS) {
    const r = mono(q.src, q.a, q.b)
    const at = r.crit.find((c) => Math.abs(c.x - q.c) < 1e-5)
    ok(!!at, `${q.id}: the critical point ${q.c} is found`)
    if (at) {
      eq(at.verdict, want[q.id], `${q.id}: verdict`)
      ok(r.crit.length === 1, `${q.id}: only one critical point`)
    }
  }
  const byId = (id) => M.PATTERNS.find((q) => q.id === id)
  ok(mono(byId('corner').src, -2, 2).crit[0].kind === 'undefined', '|x|: f′ does not exist at 0')
  ok(mono(byId('cusp').src, -2, 2).crit[0].kind === 'undefined', 'x^(2/3): f′ does not exist at 0')
  ok(mono(byId('vertical').src, -2, 2).crit[0].kind === 'undefined', 'x^(1/3): f′ does not exist at 0')
  ok(mono(byId('up').src, -2, 2).crit[0].kind === 'zero', 'x³: f′ = 0 at 0')
  eq(M.verdictOf('down', 'up'), 'min', 'the three cases: down then up')
  eq(M.verdictOf('up', 'down'), 'max', 'the three cases: up then down')
  eq(M.verdictOf('up', 'up'), 'none', 'the three cases: up on both sides')
  eq(M.verdictOf('down', 'down'), 'none', 'the three cases: down on both sides')
  eq(M.verdictOf('flat', 'up'), 'none', 'a flat side gives no verdict')
  // the ends: only one side exists
  let r = mono('x', 0, 1)
  eq(r.endA + ' ' + r.endB, 'min max', 'x on [0, 1]: a local minimum at the left end and a maximum at the right')
  r = mono('-x', 0, 1)
  eq(r.endA + ' ' + r.endB, 'max min', '−x on [0, 1]: the reverse')
  r = mono('x^2-2*x', -3, 2)
  eq(r.endA + ' ' + r.endB, 'max max', 'Exercise 47: x² − 2x on (−∞, 2]: both ends are local maxima of the window')
  // constants and the refusals
  r = mono('5', 0, 3)
  ok(r.pieces.length === 1 && r.pieces[0].trend === 'flat' && r.crit.length === 0, 'a constant is flat everywhere')
  for (const [src, a, b, why] of [['x^+', 0, 1, 'syntax'], ['x^2', 2, 1, 'interval'], ['ln(x)', -1, 1, 'undefined'], ['1/x', -1, 1, 'discontinuous']]) {
    const q = M.monotone(src, a, b)
    ok(!q.ok && q.error === why, `${src} on [${a}, ${b}] is refused as ${why}`)
  }
  const bad2 = M.chart('x^+', -1, 1)
  ok(!bad2.ok && bad2.error === 'syntax', 'a bad derivative is refused')
  const bad3 = M.chart('x', 2, 1)
  ok(!bad3.ok && bad3.error === 'interval', 'a bad interval is refused')
}

/* ------------------------------------------------------------- 6: Corollary 3 and the runs */
{
  for (let t = 0; t < 300; t++) {
    const deg = 3 + Math.floor(rand() * 3)
    const cs = Array.from({ length: deg + 1 }, () => Math.round(rnd(-6, 6) * 4) / 4)
    if (cs[deg] === 0) cs[deg] = 1
    const f = (x) => cs.reduceRight((acc, c) => acc * x + c, 0)
    const r = mono(cs.map((c, k) => `(${c})*x^${k}`).join('+'), -4, 4)
    for (const q of r.pieces) {
      for (let k = 0; k < 30; k++) {
        const x1 = q.lo + ((q.hi - q.lo) * rnd(0.01, 0.99))
        const x2 = x1 + (q.hi - x1) * rnd(0.05, 0.95)
        if (q.trend === 'up') ok(f(x2) > f(x1), `Corollary 3: f increases on (${q.lo.toFixed(3)}, ${q.hi.toFixed(3)})`)
        if (q.trend === 'down') ok(f(x2) < f(x1), `Corollary 3: f decreases on (${q.lo.toFixed(3)}, ${q.hi.toFixed(3)})`)
      }
      // one-to-one on a monotonic piece (Exercise 87)
      if (q.trend !== 'flat') ok(f(q.lo + (q.hi - q.lo) * 0.3) !== f(q.lo + (q.hi - q.lo) * 0.7), 'a monotonic piece is one-to-one')
    }
  }
}

/* ----------------------------------------------------------- 7: inequalities by monotonicity */
{
  const cmp = (f, g, a, b) => {
    const r = M.compare(f, g, a, b)
    if (!r.ok) throw new Error(`${f} vs ${g}: ${r.error}`)
    return r
  }
  let r = cmp('e^x', '1+x', 0, 3)
  ok(r.holds && r.byMonotone && r.strict, 'Exercise 86a: e^x ≥ 1 + x for x ≥ 0, by monotonicity, with equality only at 0')
  close(r.ha, 0, 'Exercise 86a: h(0) = 0')
  r = cmp('e^x', '1+x+x^2/2', 0, 3)
  ok(r.holds && r.byMonotone, 'Exercise 86b: e^x ≥ 1 + x + x²/2 for x ≥ 0')
  r = cmp('x', 'ln(x)', 1, 6)
  ok(r.holds && r.byMonotone && r.strict, 'Exercise 82: x > ln x for x > 1 (x − ln x is increasing there)')
  close(r.ha, 1, 'Exercise 82: h(1) = 1')
  r = cmp('x', 'sin(x)', 0, 3)
  ok(r.holds && r.byMonotone, 'x ≥ sin x on [0, 3]')
  r = cmp('sin(x)', 'x', 0, 3)
  ok(!r.holds && !r.byMonotone, 'sin x ≥ x is false on [0, 3]')
  r = cmp('1+x', 'e^x', 0, 3)
  ok(!r.holds, '1 + x ≥ e^x is false for x > 0')
  r = cmp('e^x', '1+x', -3, 3)
  ok(r.holds && !r.byMonotone, 'e^x ≥ 1 + x holds on [−3, 3] too, but h is not increasing from the start, so monotonicity from h(a) does not show it')
  // random pairs against a scan of the difference
  const PAIRS = [
    ['e^x', '1+x', (x) => Math.exp(x) - 1 - x],
    ['x', 'sin(x)', (x) => x - Math.sin(x)],
    ['x', 'arctan(x)', (x) => x - Math.atan(x)],
    ['x^2', '2*x-1', (x) => x * x - 2 * x + 1],
    ['x^3', 'x', (x) => x ** 3 - x],
    ['e^x', 'x^2', (x) => Math.exp(x) - x * x],
    ['ln(x)', 'x-1', (x) => Math.log(x) - (x - 1)],
  ]
  for (let t = 0; t < 400; t++) {
    const [fs_, gs, h] = PAIRS[t % PAIRS.length]
    const pos = fs_ === 'ln(x)'
    const a = pos ? rnd(0.2, 2) : rnd(-3, 2)
    const b = a + rnd(0.5, 4)
    const r2 = cmp(fs_, gs, a, b)
    let min = Infinity
    for (let k = 0; k <= 20000; k++) min = Math.min(min, h(a + ((b - a) * k) / 20000))
    ok(r2.holds === min >= -1e-9, `${fs_} vs ${gs} on [${a.toFixed(3)}, ${b.toFixed(3)}]: holds ${r2.holds}, the scan minimum of the difference is ${min}`)
    close(r2.min.value, min, `${fs_} vs ${gs}: the smallest difference`, 1e-4)
  }
}

console.log(`monotone check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
