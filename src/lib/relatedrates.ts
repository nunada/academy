/** Related rates: differentiate an equation between quantities that change with time, put in the numbers of one
 *  moment, and solve for the one rate that is unknown.
 *
 *  The checker (tools/check-relatedrates.mjs) tests this against references that do not use it: the answers printed in
 *  the textbook, partial derivatives taken by central differences on the equation itself, and a simulation in which the
 *  quantities really move with time and the dependent one is found again at each instant by Newton's method. */

import { DV, ParseError, derive, evalFloat, parseExpression, sub, toTex, type Node } from './chain'

export type RRError =
  | 'syntax' // the equation cannot be read
  | 'equation' // there is not exactly one "="
  | 'novars' // no changing quantity in it
  | 'toomany' // more than six
  | 'case' // both A and a: the names do not tell capitals from small letters
  | 'unknown' // the quantity to find is not in the equation
  | 'value' // a value or a rate that is not a number
  | 'unknownrate' // the rate to find was also given
  | 'missing' // a value is missing and cannot be worked out
  | 'noroot' // the missing value has no solution
  | 'inconsistent' // the values do not satisfy the equation
  | 'singular' // the rate to find does not appear in the related rates equation (or its coefficient is 0)

export interface RRInput {
  equation: string
  /** value of each quantity at the moment, as typed ("" = not given, "pi/4" is allowed) */
  values: Record<string, string>
  /** rate of each quantity at the moment ("" = not changing), except the one to find */
  rates: Record<string, string>
  find: string
  /** where to start looking for a value that has to be worked out from the equation */
  guess?: number
}

export interface RRSolved {
  ok: true
  vars: string[]
  /** the numbers actually used for each quantity (given or worked out) */
  used: Record<string, number>
  /** the quantity whose value was worked out from the equation, if any */
  worked?: string
  /** the equation, the related rates equation, and the latter with the numbers put in, all as TeX */
  eqTex: string
  relTex: string
  subTex: string
  /** the rate being found, as TeX, and its value */
  findTex: string
  rate: number
}

export interface RRFailed {
  ok: false
  error: RRError
  detail?: string
}

const WORDS = ['sqrt', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'pi', 'π']

/** The quantities in an equation, in order of appearance: single letters (case kept) and theta, alpha, beta, phi. A capital
 *  and a small letter of the same name are both listed, and `solveRates` refuses them, since the equation is read in
 *  lower case. */
export function quantities(src: string): string[] {
  let s = src.replace(/−/g, '-')
  for (const w of WORDS) s = s.split(w).join(' ')
  const found: string[] = []
  for (const m of s.matchAll(/theta|alpha|beta|phi|[a-z]/gi)) {
    const name = m[0].length > 1 ? m[0].toLowerCase() : m[0]
    if (name.toLowerCase() === 'e') continue
    if (!found.includes(name)) found.push(name)
  }
  return found
}

function mapNode(n: Node, f: (n: Node) => Node | undefined): Node {
  const r = f(n)
  if (r) return r
  const o = { ...n } as Record<string, unknown>
  if ('a' in o) o.a = mapNode(o.a as Node, f)
  if ('b' in o) o.b = mapNode(o.b as Node, f)
  return o as unknown as Node
}

/** The quantities (not their rates) that appear in n. */
function support(n: Node, into = new Set<string>()): Set<string> {
  if (n.t === 'var') into.add(n.name)
  if ('a' in n) support(n.a, into)
  if ('b' in n) support(n.b, into)
  return into
}

function number(src: string): { node: Node; v: number } | null {
  try {
    const node = parseExpression(src)
    const v = evalFloat(node, NaN)
    return Number.isFinite(v) ? { node, v } : null
  } catch {
    return null
  }
}

/** A number printed to four significant digits, as a node that prints as a decimal. */
function shown(v: number): Node {
  const t = Number(v.toPrecision(4))
  const s = String(Math.abs(t))
  const node = /e/.test(s) ? parseExpression(Math.abs(t).toFixed(6)) : parseExpression(s)
  return t < 0 ? { t: 'neg', a: node } : node
}

const CANDIDATES = [0.7, 1, 2, 0.5, 5, 0.1, 10, 1.2, 3, 20, 0.01, -1, -2, -5, 50, 100]

/** Solve F = 0 for the one quantity `w`, the others fixed at `vals`. */
function newton(F: Node, dF: Node, w: string, vals: Record<string, number>, first?: number): number | null {
  const f = (t: number) => evalFloat(F, NaN, NaN, NaN, { ...vals, [w]: t })
  const still = Object.fromEntries(Object.keys(vals).map((q) => ['d:' + q, 0]))
  const slope = (t: number) => evalFloat(dF, NaN, NaN, NaN, { ...vals, ...still, [w]: t, ['d:' + w]: 1 })
  const starts = first !== undefined ? [first, ...CANDIDATES] : CANDIDATES
  for (const s of starts) {
    let t = s
    for (let i = 0; i < 80; i++) {
      const y = f(t)
      const d = slope(t)
      if (!Number.isFinite(y) || !Number.isFinite(d) || d === 0) break
      let step = y / d
      if (Math.abs(step) > 10) step = Math.sign(step) * 10
      t -= step
      if (Math.abs(step) < 1e-14 * Math.max(1, Math.abs(t))) break
    }
    const r = f(t)
    const scale = Math.max(1, Math.abs(t))
    if (Number.isFinite(t) && Number.isFinite(r) && Math.abs(r) < 1e-9 * scale * scale) return t
  }
  return null
}

export function solveRates(input: RRInput): RRSolved | RRFailed {
  const fail = (error: RRError, detail?: string): RRFailed => ({ ok: false, error, detail })
  const parts = input.equation.split('=')
  if (parts.length !== 2) return fail('equation')
  const vars = quantities(input.equation)
  if (vars.length === 0) return fail('novars')
  if (vars.length > 6) return fail('toomany')
  if (new Set(vars.map((q) => q.toLowerCase())).size !== vars.length) return fail('case')
  if (!vars.includes(input.find)) return fail('unknown')
  let L: Node
  let R: Node
  try {
    L = parseExpression(parts[0], { vars })
    R = parseExpression(parts[1], { vars })
  } catch (e) {
    return fail('syntax', e instanceof ParseError ? e.code : undefined)
  }
  const F = sub(L, R)
  const dl = derive(L).result
  const dr = derive(R).result
  const G = sub(dl, dr)
  const dF = derive(F).result

  const given: Record<string, { node: Node; v: number }> = {}
  for (const q of vars) {
    const t = (input.values[q] ?? '').trim()
    if (t === '') continue
    const nv = number(t)
    if (!nv) return fail('value', q)
    given[q] = nv
  }
  const rateGiven: Record<string, { node: Node; v: number }> = {}
  for (const q of vars) {
    if (q === input.find) {
      if ((input.rates[q] ?? '').trim() !== '') return fail('unknownrate', q)
      continue
    }
    const t = (input.rates[q] ?? '').trim()
    const nv = t === '' ? { node: parseExpression('0'), v: 0 } : number(t)
    if (!nv) return fail('value', 'd' + q)
    rateGiven[q] = nv
  }

  const used: Record<string, number> = {}
  for (const q of vars) if (given[q]) used[q] = given[q].v

  // the quantities the answer depends on that have no value: at most one, found from the equation itself
  const missing = [...support(G)].filter((q) => !(q in used))
  let worked: string | undefined
  const Fneeds = [...support(F)]
  if (missing.length > 1) return fail('missing', missing.join(','))
  if (missing.length === 1) {
    const w = missing[0]
    const others = Fneeds.filter((q) => q !== w && !(q in used))
    if (others.length) return fail('missing', others.join(','))
    const sol = newton(F, dF, w, used, input.guess)
    if (sol === null) return fail('noroot', w)
    used[w] = sol
    worked = w
  } else {
    const unset = Fneeds.filter((q) => !(q in used))
    if (unset.length === 0) {
      const l = evalFloat(L, NaN, NaN, NaN, used)
      const r = evalFloat(R, NaN, NaN, NaN, used)
      if (!Number.isFinite(l) || !Number.isFinite(r)) return fail('inconsistent')
      if (Math.abs(l - r) > 1e-3 * Math.max(1, Math.abs(l), Math.abs(r))) return fail('inconsistent')
    }
  }

  const env: Record<string, number> = { ...used }
  for (const q of vars) if (q !== input.find) env['d:' + q] = rateGiven[q].v
  env['d:' + input.find] = 0
  const g0 = evalFloat(G, NaN, NaN, NaN, env)
  env['d:' + input.find] = 1
  const g1 = evalFloat(G, NaN, NaN, NaN, env)
  const c = g1 - g0
  if (!Number.isFinite(g0) || !Number.isFinite(c) || Math.abs(c) <= 1e-12 * (1 + Math.abs(g0) + Math.abs(g1))) return fail('singular')
  const rate = -g0 / c

  // the related rates equation with the numbers put in
  const bind = (n: Node): Node =>
    mapNode(n, (m) => {
      if (m.t === 'var') {
        const g = given[m.name]
        return g ? g.node : shown(used[m.name])
      }
      if (m.t === 'dvar' && m.name !== input.find) return rateGiven[m.name].node
      return undefined
    })
  const subTex = `${toTex(bind(dl), 'x', true)}=${toTex(bind(dr), 'x', true)}`

  return {
    ok: true,
    vars,
    used,
    worked,
    eqTex: `${toTex(L, 'x', true)}=${toTex(R, 'x', true)}`,
    relTex: `${toTex(dl, 'x', true)}=${toTex(dr, 'x', true)}`,
    subTex,
    findTex: toTex(DV(input.find)),
    rate,
  }
}

/** Number of significant digits for an answer: four, with the decimal mark of the reader. */
export function fmtRate(v: number, id: boolean): string {
  const t = Number(v.toPrecision(4))
  const s = Math.abs(t) >= 1e6 || (Math.abs(t) < 1e-3 && t !== 0) ? t.toExponential(3) : String(t)
  return (id ? s.replace('.', ',') : s).replace('-', '−')
}

/* ------------------------------------------------------------------ the textbook's problems */

export interface RRPreset {
  id: string
  title: { en: string; id: string }
  story: { en: string; id: string }
  /** where the problem is from */
  source: string
  input: RRInput
  /** the unit of the quantity and of the rate that is found, for the sentence under the answer */
  unit: { en: string; id: string }
  /** the answer printed in the book, when it has one */
  book?: number
}

export const RR_PRESETS: RRPreset[] = [
  {
    id: 'cone',
    title: { en: 'Water filling a cone', id: 'Air mengisi kerucut' },
    story: {
      en: 'Water runs into a conical tank, point down, 3 m high with a base radius of 1.5 m, at 0.25 m³ per minute. How fast is the water level rising when the water is 1.8 m deep? Similar triangles give x = y/2, so V = ⅓πx²y = πy³/12.',
      id: 'Air mengalir ke tangki berbentuk kerucut, ujung di bawah, tinggi 3 m dan jari-jari alas 1,5 m, sebanyak 0,25 m³ per menit. Seberapa cepat permukaan air naik ketika kedalaman air 1,8 m? Segitiga sebangun memberi x = y/2, sehingga V = ⅓πx²y = πy³/12.',
    },
    source: 'Thomas, Example 1',
    input: { equation: 'V = pi y^3 / 12', values: { y: '1.8' }, rates: { V: '0.25' }, find: 'y' },
    unit: { en: 'm/min', id: 'm/menit' },
    book: 0.0982,
  },
  {
    id: 'balloon',
    title: { en: 'A balloon and a range finder', id: 'Balon dan pengukur jarak' },
    story: {
      en: 'A balloon rises straight up and is tracked from 150 m away. When the elevation angle is π/4 it is growing at 0.14 rad/min. How fast is the balloon rising?',
      id: 'Sebuah balon naik tegak lurus dan diamati dari jarak 150 m. Ketika sudut elevasi π/4, sudut itu bertambah 0,14 rad/menit. Seberapa cepat balon naik?',
    },
    source: 'Thomas, Example 2',
    input: { equation: 'y = 150 tan(theta)', values: { theta: 'pi/4' }, rates: { theta: '0.14' }, find: 'y' },
    unit: { en: 'm/min', id: 'm/menit' },
    book: 42,
  },
  {
    id: 'chase',
    title: { en: 'A police cruiser and a car', id: 'Mobil polisi dan mobil buruan' },
    story: {
      en: 'A cruiser comes from the north toward an intersection, 0.6 km away, at 100 km/h; a car is 0.8 km east of it. The distance between them is growing at 30 km/h. How fast is the car going? Here s² = x² + y², and y is decreasing.',
      id: 'Mobil polisi datang dari utara menuju persimpangan, berjarak 0,6 km, dengan kecepatan 100 km/jam; mobil buruan berada 0,8 km di timurnya. Jarak keduanya bertambah 30 km/jam. Berapa kecepatan mobil itu? Di sini s² = x² + y², dan y berkurang.',
    },
    source: 'Thomas, Example 3',
    input: { equation: 's^2 = x^2 + y^2', values: { x: '0.8', y: '0.6' }, rates: { y: '-100', s: '30' }, find: 'x' },
    unit: { en: 'km/h', id: 'km/jam' },
    book: 112.5,
  },
  {
    id: 'tangent',
    title: { en: 'A tangent line sliding along the axis', id: 'Garis singgung yang bergeser' },
    story: {
      en: 'A particle moves clockwise around a circle of radius 10 m, taking 30 s for a quarter turn, so the angle θ falls at π rad/min. The tangent at the particle meets the x-axis at Q, where x cos θ = 10. How fast is Q moving when it is 20 m from the center?',
      id: 'Sebuah partikel bergerak searah jarum jam pada lingkaran berjari-jari 10 m, memerlukan 30 detik untuk seperempat putaran, sehingga sudut θ berkurang π rad/menit. Garis singgung di partikel memotong sumbu x di Q, dengan x cos θ = 10. Seberapa cepat Q bergerak ketika berjarak 20 m dari pusat?',
    },
    source: 'Thomas, Example 4',
    input: { equation: 'x cos(theta) = 10', values: { x: '20' }, rates: { theta: '-pi' }, find: 'x', guess: 1 },
    unit: { en: 'm/min', id: 'm/menit' },
    book: -108.828,
  },
  {
    id: 'jet',
    title: { en: 'A jet and a radar station', id: 'Pesawat jet dan stasiun radar' },
    story: {
      en: 'A jet flies at 10 km altitude toward a radar station on an island. When it is first seen, the line of sight is at 30° (π/6) and turning upward at ⅓ degree per second, which is 20π/3 rad per hour. With x in km, x = 10 cot θ. How fast is it approaching?',
      id: 'Sebuah pesawat jet terbang pada ketinggian 10 km menuju stasiun radar di pulau. Ketika pertama terlihat, garis pandang membentuk sudut 30° (π/6) dan naik ⅓ derajat per detik, yaitu 20π/3 rad per jam. Dengan x dalam km, x = 10 cot θ. Seberapa cepat pesawat mendekat?',
    },
    source: 'Thomas, Example 5',
    input: { equation: 'x = 10 cot(theta)', values: { theta: 'pi/6' }, rates: { theta: '20*pi/3' }, find: 'x' },
    unit: { en: 'km/h', id: 'km/jam' },
    book: -837.76,
  },
  {
    id: 'pulley',
    title: { en: 'A weight on a rope over a pulley', id: 'Beban pada tali melalui katrol' },
    story: {
      en: 'A rope runs over a pulley 6 m above the point O and lifts a weight W; the worker walks away at 1.2 m/s. The rope is 13.5 m long, so x² + 6² = (7.5 + h)². How fast is the weight rising when x = 6.3 m?',
      id: 'Tali melewati katrol yang berada 6 m di atas titik O dan mengangkat beban W; pekerja berjalan menjauh dengan kecepatan 1,2 m/detik. Panjang tali 13,5 m, sehingga x² + 6² = (7,5 + h)². Seberapa cepat beban naik ketika x = 6,3 m?',
    },
    source: 'Thomas, Example 6',
    input: { equation: 'x^2 + 36 = (7.5 + h)^2', values: { x: '6.3' }, rates: { x: '1.2' }, find: 'h', guess: 1 },
    unit: { en: 'm/s', id: 'm/detik' },
    book: 0.869,
  },
  {
    id: 'ladder',
    title: { en: 'A sliding ladder', id: 'Tangga yang meluncur' },
    story: {
      en: 'A 5 m ladder leans on a wall and its foot is pulled away from the wall at 2 m/s. When the foot is 3 m from the wall, how fast is the top sliding down? Here x² + y² = 25.',
      id: 'Tangga 5 m bersandar pada dinding dan kakinya ditarik menjauhi dinding dengan kecepatan 2 m/detik. Ketika kaki tangga berjarak 3 m dari dinding, seberapa cepat ujung atasnya meluncur turun? Di sini x² + y² = 25.',
    },
    source: 'Thomas, Exercise 23 (changed numbers)',
    input: { equation: 'x^2 + y^2 = 25', values: { x: '3' }, rates: { x: '2' }, find: 'y', guess: 3 },
    unit: { en: 'm/s', id: 'm/detik' },
    book: -1.5,
  },
  {
    id: 'sphere',
    title: { en: 'A balloon being blown up', id: 'Balon yang ditiup' },
    story: {
      en: 'Air is pumped into a spherical balloon at 100 cm³ per second. How fast is the radius growing when r = 5 cm? V = (4/3)πr³.',
      id: 'Udara dipompa ke balon berbentuk bola sebanyak 100 cm³ per detik. Seberapa cepat jari-jari bertambah ketika r = 5 cm? V = (4/3)πr³.',
    },
    source: 'Thomas, section opening',
    input: { equation: 'V = (4/3) pi r^3', values: { r: '5' }, rates: { V: '100' }, find: 'r' },
    unit: { en: 'cm/s', id: 'cm/detik' },
    book: 100 / (4 * Math.PI * 25),
  },
]
