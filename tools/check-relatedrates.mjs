/** Checks src/lib/relatedrates.ts, the solver behind the "Related Rates" article's widget.
 *
 *  References that do not use the code under test:
 *   1. The answers printed in the textbook (Examples 1 to 6) and their exact forms, for the preset problems.
 *   2. The multivariable chain rule written out by hand: for an equation F(q) = 0, the unknown rate is
 *      −Σ ∂F/∂qⱼ · q′ⱼ / ∂F/∂q_find, with the partial derivatives taken by central differences on a JavaScript
 *      version of the equation, at random points that satisfy the equation.
 *   3. A simulation: the free quantities really move with time, the dependent one is found again at each instant by
 *      Newton's method on the JavaScript version, and its rate is a central difference in time. The solver, given
 *      every other rate, must give the simulated rate of any chosen quantity.
 *   4. A quantity left blank is worked out from the equation: the number returned satisfies the equation.
 *   5. The refusals: a bad equation, a missing value, a rate given twice, values that do not fit, a zero coefficient.
 *
 *  Run: npm run check:relatedrates   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rr-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/relatedrates.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const R = await import(pathToFileURL(out).href)

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
const rnd = (a, b) => a + Math.random() * (b - a)
const PI = Math.PI

/* ------------------------------------------------------- 1: the textbook's answers */
const exact = {
  cone: 1 / (3.24 * PI),
  balloon: 42,
  chase: 112.5,
  tangent: -20 * Math.sqrt(3) * PI,
  jet: (-800 * PI) / 3,
  pulley: (6.3 * 1.2) / 8.7,
  ladder: -1.5,
  sphere: 100 / (100 * PI),
}
for (const pre of R.RR_PRESETS) {
  const r = R.solveRates(pre.input)
  ok(r.ok, `preset ${pre.id} solves`)
  if (!r.ok) continue
  close(r.rate, exact[pre.id], `preset ${pre.id}: exact form`, 1e-9)
  // the book prints these to three or four digits
  close(r.rate, pre.book, `preset ${pre.id}: the printed answer`, 6e-4)
  ok(r.findTex === `\\frac{d${pre.input.find}}{dt}`, `preset ${pre.id}: names the rate it finds`)
  ok(r.eqTex.includes('=') && r.relTex.includes('\\frac{d') && r.subTex.includes('='), `preset ${pre.id}: shows the three equations`)
}
// the equation with the numbers put in shows the numbers that were given
const shows = { cone: ['0.25', '1.8'], balloon: ['0.14', '150'], chase: ['30', '\\left(-100\\right)', '0.8', '0.6'], tangent: ['20', '\\left(-\\pi\\right)'], jet: ['\\frac{20\\pi}{3}', '10'], pulley: ['1.2', '6.3', '7.5'], ladder: ['3', '4', '2'], sphere: ['100', '5'] }
for (const pre of R.RR_PRESETS) {
  const r = R.solveRates(pre.input)
  for (const piece of shows[pre.id]) ok(r.ok && r.subTex.includes(piece), `preset ${pre.id}: the numbers put in show ${piece}`)
  const left = r.ok ? [...r.subTex.matchAll(/\\frac\{d(\\?[a-zA-Z]+)\}\{dt\}/g)].map((m) => m[1].replace('\\', '')) : []
  ok(r.ok && left.length > 0 && left.every((q) => q === pre.input.find), `preset ${pre.id}: only the rate to find is left in the numbers put in`)
}
ok(R.RR_PRESETS.length === Object.keys(exact).length, 'every preset has an exact form to compare with')
// the printed quantities
{
  const t = R.solveRates(R.RR_PRESETS.find((q) => q.id === 'tangent').input)
  ok(t.worked === 'theta', 'Example 4: the angle is worked out from x cos θ = 10')
  close(t.used.theta, PI / 3, 'Example 4: θ = π/3 when x = 20')
  const c = R.solveRates(R.RR_PRESETS.find((q) => q.id === 'chase').input)
  ok(c.worked === 's', 'Example 3: the distance is worked out')
  close(c.used.s, 1, 'Example 3: s = 1 km')
  const w = R.solveRates(R.RR_PRESETS.find((q) => q.id === 'pulley').input)
  close(w.used.h, 1.2, 'Example 6: h = 1.2 m when x = 6.3 m', 1e-9)
}

/* ------------------------------------------- equations written twice: text and JavaScript */
// f(q) = left − right; make(rnd) gives values of all the quantities that satisfy it
const EQS = [
  { s: 's^2 = x^2 + y^2', f: (q) => q.s ** 2 - q.x ** 2 - q.y ** 2, make: () => { const x = rnd(0.3, 5), y = rnd(0.3, 5); return { x, y, s: Math.hypot(x, y) } } },
  { s: 'A = pi r^2', f: (q) => q.A - PI * q.r ** 2, make: () => { const r = rnd(0.3, 6); return { r, A: PI * r * r } } },
  { s: 'V = (4/3) pi r^3', f: (q) => q.V - (4 / 3) * PI * q.r ** 3, make: () => { const r = rnd(0.3, 6); return { r, V: (4 / 3) * PI * r ** 3 } } },
  { s: 'V = pi r^2 h', f: (q) => q.V - PI * q.r ** 2 * q.h, make: () => { const r = rnd(0.3, 4), h = rnd(0.3, 8); return { r, h, V: PI * r * r * h } } },
  { s: 'V = pi y^3 / 12', f: (q) => q.V - (PI * q.y ** 3) / 12, make: () => { const y = rnd(0.3, 5); return { y, V: (PI * y ** 3) / 12 } } },
  { s: 'y = 150 tan(theta)', f: (q) => q.y - 150 * Math.tan(q.theta), make: () => { const t = rnd(0.2, 1.3); return { theta: t, y: 150 * Math.tan(t) } } },
  { s: 'x cos(theta) = 10', f: (q) => q.x * Math.cos(q.theta) - 10, make: () => { const t = rnd(0.2, 1.3); return { theta: t, x: 10 / Math.cos(t) } } },
  { s: 'x = 10 cot(theta)', f: (q) => q.x - 10 / Math.tan(q.theta), make: () => { const t = rnd(0.2, 1.3); return { theta: t, x: 10 / Math.tan(t) } } },
  { s: 'x^2 + 36 = (7.5 + h)^2', f: (q) => q.x ** 2 + 36 - (7.5 + q.h) ** 2, make: () => { const h = rnd(0.2, 6); return { h, x: Math.sqrt((7.5 + h) ** 2 - 36) } } },
  { s: 'x y = 12', f: (q) => q.x * q.y - 12, make: () => { const x = rnd(0.5, 6); return { x, y: 12 / x } } },
  { s: 'P = R I^2', f: (q) => q.P - q.R * q.I ** 2, make: () => { const R_ = rnd(0.5, 9), I = rnd(0.5, 4); return { R: R_, I, P: R_ * I * I } } },
  { s: 'T = (1/2) a b sin(theta)', f: (q) => q.T - 0.5 * q.a * q.b * Math.sin(q.theta), make: () => { const a = rnd(1, 6), b = rnd(1, 6), t = rnd(0.3, 2.8); return { a, b, theta: t, T: 0.5 * a * b * Math.sin(t) } } },
  { s: 'z^3 = x^2 + y^2', f: (q) => q.z ** 3 - q.x ** 2 - q.y ** 2, make: () => { const x = rnd(0.5, 5), y = rnd(0.5, 5); return { x, y, z: Math.cbrt(x * x + y * y) } } },
  { s: 'u = w^3 + 2 w', f: (q) => q.u - q.w ** 3 - 2 * q.w, make: () => { const w = rnd(0.3, 4); return { w, u: w ** 3 + 2 * w } } },
  { s: 'L = sqrt(x^2 + 9) + sqrt((8 - x)^2 + 4)', f: (q) => q.L - Math.sqrt(q.x ** 2 + 9) - Math.sqrt((8 - q.x) ** 2 + 4), make: () => { const x = rnd(0.3, 7.5); return { x, L: Math.sqrt(x * x + 9) + Math.sqrt((8 - x) ** 2 + 4) } } },
  { s: 'y = 3 sin(theta) + 2 cos(theta)', f: (q) => q.y - 3 * Math.sin(q.theta) - 2 * Math.cos(q.theta), make: () => { const t = rnd(0.2, 2.5); return { theta: t, y: 3 * Math.sin(t) + 2 * Math.cos(t) } } },
]
const names = (eq) => Object.keys(eq.make())
const str = (v) => String(Number(v.toPrecision(15)))
const partial = (eq, q, name, h = 1e-6) => {
  const hi = { ...q, [name]: q[name] + h }
  const lo = { ...q, [name]: q[name] - h }
  return (eq.f(hi) - eq.f(lo)) / (2 * h)
}

/* ------------------- 2: the chain rule by hand, partial derivatives by central differences */
let solved = 0
for (const eq of EQS) {
  const vars = names(eq)
  for (let i = 0; i < 160; i++) {
    const q = eq.make()
    ok(Math.abs(eq.f(q)) < 1e-9 * (1 + Math.abs(q[vars[0]])), `${eq.s}: the sample satisfies the equation`)
    const find = vars[Math.floor(Math.random() * vars.length)]
    const dF = partial(eq, q, find)
    if (Math.abs(dF) < 0.05) continue
    const rates = {}
    let sum = 0
    for (const v of vars) {
      if (v === find) continue
      const rv = rnd(-4, 4)
      rates[v] = str(rv)
      sum += partial(eq, q, v) * Number(rates[v])
    }
    const want = -sum / dF
    const res = R.solveRates({ equation: eq.s, values: Object.fromEntries(vars.map((v) => [v, str(q[v])])), rates, find })
    ok(res.ok, `${eq.s}: solves for d${find}/dt (${res.ok ? '' : res.error})`)
    if (res.ok) {
      solved++
      close(res.rate, want, `${eq.s}: d${find}/dt`, 1e-5)
      ok(res.worked === undefined, `${eq.s}: nothing is worked out when every value is given`)
      ok(R.quantities(eq.s).length === vars.length, `${eq.s}: the quantities are found`)
    }
  }
}

/* ---------------------- 3: a simulation, the quantities really moving with time */
const newtonJs = (eq, q, name, guess) => {
  let t = guess
  for (let k = 0; k < 100; k++) {
    const y = eq.f({ ...q, [name]: t })
    const d = partial(eq, { ...q, [name]: t }, name, 1e-7)
    if (d === 0 || !Number.isFinite(d)) return NaN
    const step = y / d
    t -= step
    if (Math.abs(step) < 1e-14 * Math.max(1, Math.abs(t))) break
  }
  return t
}
let simulated = 0
for (const eq of EQS) {
  const vars = names(eq)
  for (let i = 0; i < 120; i++) {
    const q0 = eq.make()
    const dep = vars[Math.floor(Math.random() * vars.length)]
    // a partial derivative that is small next to the others makes the simulation ill-conditioned (the rate of the dependent
    // quantity is then a small difference of large terms): such draws test the arithmetic of the reference, not the code
    const big = Math.max(...vars.map((v) => Math.abs(partial(eq, q0, v))))
    if (Math.abs(partial(eq, q0, dep)) < Math.max(0.3, 0.3 * big)) continue
    const slopes = Object.fromEntries(vars.filter((v) => v !== dep).map((v) => [v, rnd(-3, 3)]))
    const at = (t) => {
      const q = { ...q0 }
      for (const v of Object.keys(slopes)) q[v] = q0[v] + slopes[v] * t
      q[dep] = newtonJs(eq, q, dep, q0[dep])
      return q
    }
    // a five-point difference with a larger step: Newton's last digits, divided by a tiny h, were noise of the size of the tolerance
    const h = 2e-4
    const p1 = at(h)
    const m1 = at(-h)
    const p2 = at(2 * h)
    const m2 = at(-2 * h)
    if (![p1, m1, p2, m2].every((q) => Number.isFinite(q[dep]))) continue
    const rates = { ...slopes, [dep]: (-p2[dep] + 8 * p1[dep] - 8 * m1[dep] + m2[dep]) / (12 * h) }
    // ask for the rate of any one quantity, giving all the others
    const find = vars[Math.floor(Math.random() * vars.length)]
    if (Math.abs(partial(eq, q0, find)) < Math.max(0.3, 0.3 * big)) continue
    const given = Object.fromEntries(vars.filter((v) => v !== find).map((v) => [v, str(rates[v])]))
    const res = R.solveRates({ equation: eq.s, values: Object.fromEntries(vars.map((v) => [v, str(q0[v])])), rates: given, find })
    ok(res.ok, `${eq.s}: the simulation case solves`)
    if (res.ok) {
      simulated++
      close(res.rate, rates[find], `${eq.s}: d${find}/dt against a simulation (dependent ${dep})`, 5e-4)
    }
  }
}

/* ------------------------------ 4: a blank value is worked out from the equation */
let worked = 0
for (const eq of EQS) {
  const vars = names(eq)
  for (let i = 0; i < 80; i++) {
    const q = eq.make()
    const blank = vars[Math.floor(Math.random() * vars.length)]
    const find = vars.filter((v) => v !== blank)[Math.floor(Math.random() * (vars.length - 1))]
    const rates = {}
    for (const v of vars) if (v !== find) rates[v] = str(rnd(-3, 3))
    const values = Object.fromEntries(vars.filter((v) => v !== blank).map((v) => [v, str(q[v])]))
    const res = R.solveRates({ equation: eq.s, values, rates, find })
    if (!res.ok) {
      // a quantity that the answer does not depend on may be left blank; one that it does depend on may have no root
      ok(res.error === 'noroot' || res.error === 'singular' || res.error === 'missing', `${eq.s}: a blank value is refused only for a reason (${res.error})`)
      continue
    }
    if (res.worked === undefined) continue
    worked++
    ok(res.worked === blank, `${eq.s}: the blank quantity is the one worked out`)
    ok(Math.abs(eq.f(res.used)) < 1e-7 * (1 + Math.abs(res.used[blank])), `${eq.s}: the value worked out satisfies the equation`)
    // with the worked value as the given one, the answer is the same
    const again = R.solveRates({ equation: eq.s, values: { ...values, [blank]: str(res.used[blank]) }, rates, find })
    ok(again.ok, `${eq.s}: solves again with the worked value`)
    if (again.ok) close(again.rate, res.rate, `${eq.s}: the same answer with the worked value given`, 1e-9)
  }
}

/* -------------------------------------------------------------------- 5: the refusals */
const err = (input, code, what) => {
  const r = R.solveRates({ values: {}, rates: {}, find: 'x', ...input })
  checks++
  if (r.ok || r.error !== code) fail(`${what}: wanted ${code}, got ${r.ok ? 'an answer' : r.error}`)
}
err({ equation: 'x + y' }, 'equation', 'no equals sign')
err({ equation: 'x = y = 2' }, 'equation', 'two equals signs')
err({ equation: '2 = 3' }, 'novars', 'no quantity')
err({ equation: 'x +  = y' }, 'syntax', 'a broken expression')
err({ equation: 'a + b + c + d + f + g + h = 1', find: 'a' }, 'toomany', 'seven quantities')
err({ equation: 'A = a b', find: 'A' }, 'case', 'A and a are the same name')
err({ equation: 'x = 2 y', find: 'z' }, 'unknown', 'the quantity to find is not in the equation')
err({ equation: 'x = 2 y', values: { y: 'abc' }, find: 'x' }, 'value', 'a value that is not a number')
err({ equation: 'x = 2 y', values: { y: '1' }, rates: { x: '3', y: '1' }, find: 'x' }, 'unknownrate', 'the rate to find was given')
err({ equation: 's^2 = x^2 + y^2', values: { x: '1' }, rates: { y: '1', s: '1' }, find: 'x' }, 'missing', 'two values missing')
err({ equation: 's^2 = x^2 + y^2', values: { s: '2', x: '0.8', y: '0.6' }, rates: { y: '1', s: '1' }, find: 'x' }, 'inconsistent', 'values that do not fit')
err({ equation: 'y = x^2', values: { x: '0' }, rates: { y: '1' }, find: 'x' }, 'singular', 'a zero coefficient')
err({ equation: 'w^2 + 1 = v', values: { v: '0' }, rates: { v: '1' }, find: 'v' }, 'unknownrate', 'a rate to find that was also given')
err({ equation: 'w^2 + 1 = v', values: { v: '0' }, rates: { w: '1' }, find: 'v' }, 'noroot', 'a value with no solution')

// quantities
const same = (a, b, what) => {
  checks++
  if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${what}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`)
}
same(R.quantities('V = (4/3) pi r^3'), ['V', 'r'], 'quantities of the sphere')
same(R.quantities('x cos(theta) = 10'), ['x', 'theta'], 'quantities with theta')
same(R.quantities('y = e^x + sin(x)'), ['y', 'x'], 'e is the number, sin is a function')
same(R.quantities('s^2 = x^2 + y^2'), ['s', 'x', 'y'], 'quantities of the distance')
same(R.quantities('T = 1/2 a b sin(theta)'), ['T', 'a', 'b', 'theta'], 'the case of a letter is kept')
same(R.quantities('A = a b'), ['A', 'a', 'b'], 'a capital and a small letter are listed apart')

// the numbers as printed
same(R.fmtRate(0.098243792, false), '0.09824', 'four digits')
same(R.fmtRate(-108.82796, true), '−108,8', 'a decimal comma and a true minus')
same(R.fmtRate(42, false), '42', 'a whole number')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`relatedrates check ok — ${checks} checks (the textbook's six answers and exact forms, the chain rule by hand with central-difference partial derivatives on ${solved} cases, ${simulated} simulations with the quantities moving in time, ${worked} values worked out from the equation, the refusals)`)
