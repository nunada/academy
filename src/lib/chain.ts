/** A small symbolic differentiator for the "Chain Rule" article's widgets.
 *
 *  It knows the rules of the first part of the chapter plus the chain rule: constants, powers of anything (a^n with n a
 *  rational number), e^u, the six trigonometric functions of anything, sums, differences, products and quotients. A
 *  variable exponent (x^x, 2^x) is refused, because it needs the logarithm, which comes later.
 *
 *  Every composite function is differentiated by the chain rule and the step records the outside function, the inside
 *  function, the derivative of the outside evaluated at the inside, and the derivative of the inside, so a reader sees the
 *  rule being used rather than only its result.
 *
 *  The checker (tools/check-chain.mjs) keeps it honest with four independent references: the derivative of a rational
 *  function is compared *exactly* with the one from derivative.ts, powers with fractional exponents are compared exactly by
 *  raising the derivative to the power that clears the exponent, forward-mode automatic differentiation with dual numbers
 *  is a second algorithm, and central differences in floating point are a third. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { polyAdd, polyMul, polySub, type Poly } from './tangent'
import { derivativeFn, evalFn, type RationalFn } from './derivative'

export { rat, type Rat }

export type FnName = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc'
export const FN_NAMES: FnName[] = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc']

export type Node =
  | { t: 'num'; v: Rat }
  | { t: 'pi' }
  | { t: 'x' }
  | { t: 'neg'; a: Node }
  | { t: 'add'; a: Node; b: Node }
  | { t: 'sub'; a: Node; b: Node }
  | { t: 'mul'; a: Node; b: Node }
  | { t: 'div'; a: Node; b: Node }
  /** a to the constant rational power n */
  | { t: 'pow'; a: Node; n: Rat }
  /** e to the power a */
  | { t: 'exp'; a: Node }
  | { t: 'fn'; f: FnName; a: Node }

const ZERO = rat(0n, 1n)
const ONE = rat(1n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const isOne = (r: Rat): boolean => r.n === 1n && r.d === 1n
const isInt = (r: Rat): boolean => r.d === 1n
const negR = (r: Rat): Rat => rat(-r.n, r.d)
const absR = (r: Rat): Rat => (r.n < 0n ? negR(r) : r)

export const K = (n: number | bigint | Rat, d = 1): Node => ({ t: 'num', v: typeof n === 'object' ? n : rat(BigInt(n), BigInt(d)) })
export const X: Node = { t: 'x' }
export const PI: Node = { t: 'pi' }
export const neg = (a: Node): Node => ({ t: 'neg', a })
export const add = (a: Node, b: Node): Node => ({ t: 'add', a, b })
export const sub = (a: Node, b: Node): Node => ({ t: 'sub', a, b })
export const mul = (a: Node, b: Node): Node => ({ t: 'mul', a, b })
export const div = (a: Node, b: Node): Node => ({ t: 'div', a, b })
export const pw = (a: Node, n: Rat | number | bigint, d = 1): Node => ({ t: 'pow', a, n: typeof n === 'object' ? n : rat(BigInt(n), BigInt(d)) })
export const ex = (a: Node): Node => ({ t: 'exp', a })
export const fn = (f: FnName, a: Node): Node => ({ t: 'fn', f, a })

/** No x inside. */
export function isConst(n: Node): boolean {
  switch (n.t) {
    case 'num':
    case 'pi':
      return true
    case 'x':
      return false
    case 'neg':
    case 'pow':
    case 'exp':
    case 'fn':
      return isConst(n.a)
    default:
      return isConst(n.a) && isConst(n.b)
  }
}

/** Replace every x in a node by `inner`. */
export function subst(n: Node, inner: Node): Node {
  switch (n.t) {
    case 'num':
    case 'pi':
      return n
    case 'x':
      return inner
    case 'neg':
      return neg(subst(n.a, inner))
    case 'pow':
      return { t: 'pow', a: subst(n.a, inner), n: n.n }
    case 'exp':
      return ex(subst(n.a, inner))
    case 'fn':
      return fn(n.f, subst(n.a, inner))
    default:
      return { t: n.t, a: subst(n.a, inner), b: subst(n.b, inner) } as Node
  }
}

/** Number of nodes, to keep the widgets from drowning in a huge expression. */
export function size(n: Node): number {
  switch (n.t) {
    case 'num':
    case 'pi':
    case 'x':
      return 1
    case 'neg':
    case 'pow':
    case 'exp':
    case 'fn':
      return 1 + size(n.a)
    default:
      return 1 + size(n.a) + size(n.b)
  }
}

/* ------------------------------------------------------------------ evaluating */

const ratValue = (r: Rat): number => Number(r.n) / Number(r.d)

const fnValue = (f: FnName, x: number): number =>
  f === 'sin' ? Math.sin(x) : f === 'cos' ? Math.cos(x) : f === 'tan' ? Math.tan(x) : f === 'cot' ? 1 / Math.tan(x) : f === 'sec' ? 1 / Math.cos(x) : 1 / Math.sin(x)

export function evalFloat(n: Node, x: number): number {
  switch (n.t) {
    case 'num':
      return ratValue(n.v)
    case 'pi':
      return Math.PI
    case 'x':
      return x
    case 'neg':
      return -evalFloat(n.a, x)
    case 'add':
      return evalFloat(n.a, x) + evalFloat(n.b, x)
    case 'sub':
      return evalFloat(n.a, x) - evalFloat(n.b, x)
    case 'mul':
      return evalFloat(n.a, x) * evalFloat(n.b, x)
    case 'div':
      return evalFloat(n.a, x) / evalFloat(n.b, x)
    case 'pow':
      return evalFloat(n.a, x) ** ratValue(n.n)
    case 'exp':
      return Math.exp(evalFloat(n.a, x))
    case 'fn':
      return fnValue(n.f, evalFloat(n.a, x))
  }
}

const ratPow = (x: Rat, n: bigint): Rat | null => {
  if (n >= 0n) {
    let r = ONE
    for (let i = 0n; i < n; i++) r = ratMul(r, x)
    return r
  }
  if (isZero(x)) return null
  const p = ratPow(x, -n)
  return p === null ? null : ratDiv(ONE, p)
}

/** Exact value at a rational x, or null when π, e^u, a trigonometric function, a fractional power or a division by zero is involved. */
export function evalExact(n: Node, x: Rat): Rat | null {
  switch (n.t) {
    case 'num':
      return n.v
    case 'pi':
    case 'exp':
    case 'fn':
      return null
    case 'x':
      return x
    case 'neg': {
      const v = evalExact(n.a, x)
      return v === null ? null : negR(v)
    }
    case 'pow': {
      if (!isInt(n.n) || absR(n.n).n > 200n) return null
      const b = evalExact(n.a, x)
      return b === null ? null : ratPow(b, n.n.n)
    }
    default: {
      const a = evalExact(n.a, x)
      const b = evalExact(n.b, x)
      if (a === null || b === null) return null
      if (n.t === 'add') return ratAdd(a, b)
      if (n.t === 'sub') return ratSub(a, b)
      if (n.t === 'mul') return ratMul(a, b)
      return isZero(b) ? null : ratDiv(a, b)
    }
  }
}

/** The expression as a rational function when it only has polynomial parts and whole-number powers, else null. */
export function toRational(n: Node): RationalFn | null {
  const one: Poly = [ONE]
  const rf = (num: Poly, den: Poly = one): RationalFn => ({ num, den })
  switch (n.t) {
    case 'num':
      return rf(isZero(n.v) ? [] : [n.v])
    case 'x':
      return rf([ZERO, ONE])
    case 'pi':
    case 'exp':
    case 'fn':
      return null
    case 'neg': {
      const v = toRational(n.a)
      return v && rf(polySub([], v.num), v.den)
    }
    case 'pow': {
      if (!isInt(n.n)) return null
      const b = toRational(n.a)
      if (!b) return null
      const k = n.n.n
      const m = k < 0n ? -k : k
      if (m > 12n) return null
      let num: Poly = one
      let den: Poly = one
      for (let i = 0n; i < m; i++) {
        num = polyMul(num, b.num)
        den = polyMul(den, b.den)
      }
      if (k >= 0n) return rf(num, den)
      return num.length === 0 ? null : rf(den, num)
    }
    default: {
      const a = toRational(n.a)
      const b = toRational(n.b)
      if (!a || !b) return null
      if (n.t === 'add') return rf(polyAdd(polyMul(a.num, b.den), polyMul(b.num, a.den)), polyMul(a.den, b.den))
      if (n.t === 'sub') return rf(polySub(polyMul(a.num, b.den), polyMul(b.num, a.den)), polyMul(a.den, b.den))
      if (n.t === 'mul') return rf(polyMul(a.num, b.num), polyMul(a.den, b.den))
      return b.num.length === 0 ? null : rf(polyMul(a.num, b.den), polyMul(a.den, b.num))
    }
  }
}

/** The exact derivative of a rational expression by a different route (derivative.ts), for the checker. */
export const rationalDerivativeAt = (n: Node, x: Rat): Rat | null => {
  const f = toRational(n)
  return f ? evalFn(derivativeFn(f), x) : null
}

/* ------------------------------------------------------------------ simplifying */

/** A factor b^e and a term c · b1^e1 · b2^e2 ...; a sum is a list of terms. */
interface Fac {
  b: Node
  e: Rat
}
interface Term {
  c: Rat
  fs: Fac[]
}

const keyOf = (n: Node): string => toText(n)

const termConst = (c: Rat): Term => ({ c, fs: [] })

function mulTerms(a: Term, b: Term): Term {
  const fs: Fac[] = a.fs.map((f) => ({ ...f }))
  for (const g of b.fs) {
    const k = keyOf(g.b)
    const hit = fs.find((f) => keyOf(f.b) === k)
    if (hit) hit.e = ratAdd(hit.e, g.e)
    else fs.push({ ...g })
  }
  return { c: ratMul(a.c, b.c), fs: fs.filter((f) => !isZero(f.e)) }
}

function powInt(t: Term, n: bigint): Term | null {
  const m = n < 0n ? -n : n
  if (m > 99n) return null
  let c = ONE
  for (let i = 0n; i < m; i++) c = ratMul(c, t.c)
  if (n < 0n) {
    if (isZero(c)) return null
    c = ratDiv(ONE, c)
  }
  return { c, fs: t.fs.map((f) => ({ b: f.b, e: ratMul(f.e, rat(n, 1n)) })) }
}

const invTerm = (t: Term): Term | null => (isZero(t.c) ? null : { c: ratDiv(ONE, t.c), fs: t.fs.map((f) => ({ b: f.b, e: negR(f.e) })) })

function sumKey(fs: Fac[]): string {
  return fs
    .map((f) => `${keyOf(f.b)}^${f.e.n}/${f.e.d}`)
    .sort()
    .join('*')
}

function combine(ts: Term[]): Term[] {
  const out: Term[] = []
  for (const t of ts) {
    if (isZero(t.c)) continue
    const k = sumKey(t.fs)
    const hit = out.find((o) => sumKey(o.fs) === k)
    if (hit) hit.c = ratAdd(hit.c, t.c)
    else out.push({ c: t.c, fs: t.fs.map((f) => ({ ...f })) })
  }
  return out.filter((t) => !isZero(t.c))
}

/** The node a normalized sum stands for. */
function rebuildSum(ts: Term[]): Node {
  if (ts.length === 0) return K(0)
  let acc: Node | null = null
  for (const t of ts) {
    const node = rebuildTerm(t)
    if (acc === null) acc = node
    else if (node.t === 'neg') acc = sub(acc, node.a)
    else acc = add(acc, node)
  }
  return acc as Node
}

const rank = (b: Node): number => (b.t === 'pi' ? 0 : b.t === 'x' ? 1 : b.t === 'exp' ? 3 : b.t === 'fn' ? 4 : 2)

function facNode(f: Fac): Node {
  if (isOne(f.e)) return f.b
  if (f.b.t === 'exp') return ex(simp(mul(K(f.e), f.b.a)))
  return pw(f.b, f.e)
}

function rebuildTerm(t: Term): Node {
  const sign = t.c.n < 0n
  const c = absR(t.c)
  const fs = [...t.fs].sort((p, q) => rank(p.b) - rank(q.b) || (keyOf(p.b) < keyOf(q.b) ? -1 : keyOf(p.b) > keyOf(q.b) ? 1 : 0))
  const numF = fs.filter((f) => f.e.n > 0n)
  const denF = fs.filter((f) => f.e.n < 0n).map((f) => ({ b: f.b, e: negR(f.e) }))
  const chain = (parts: Node[]): Node => parts.reduce((a, b) => mul(a, b))
  const numParts: Node[] = []
  if (c.n !== 1n || numF.length === 0) numParts.push(K(rat(c.n, 1n)))
  for (const f of numF) numParts.push(facNode(f))
  const denParts: Node[] = []
  if (c.d !== 1n) denParts.push(K(rat(c.d, 1n)))
  for (const f of denF) denParts.push(facNode(f))
  const numerator = chain(numParts)
  const body = denParts.length ? div(numerator, chain(denParts)) : numerator
  if (sign && c.n === 0n) return K(0)
  return sign ? neg(body) : body
}

/** The sum a node is, with products kept factored: a sum of several terms inside a product stays one factor. */
function normalize(n: Node): Term[] {
  switch (n.t) {
    case 'num':
      return isZero(n.v) ? [] : [termConst(n.v)]
    case 'pi':
      return [{ c: ONE, fs: [{ b: PI, e: ONE }] }]
    case 'x':
      return [{ c: ONE, fs: [{ b: X, e: ONE }] }]
    case 'neg':
      return normalize(n.a).map((t) => ({ c: negR(t.c), fs: t.fs }))
    case 'add':
      return combine([...normalize(n.a), ...normalize(n.b)])
    case 'sub':
      return combine([...normalize(n.a), ...normalize(n.b).map((t) => ({ c: negR(t.c), fs: t.fs }))])
    case 'mul': {
      const a = asTerm(n.a)
      const b = asTerm(n.b)
      const t = mulTerms(a, b)
      return isZero(t.c) ? [] : [t]
    }
    case 'div': {
      const b = asTerm(n.b)
      const inv = invTerm(b)
      if (!inv) return [{ c: ONE, fs: [{ b: n, e: ONE }] }]
      const t = mulTerms(asTerm(n.a), inv)
      return isZero(t.c) ? [] : [t]
    }
    case 'pow': {
      const base = asTerm(n.a)
      if (isInt(n.n)) {
        if (isZero(base.c) && n.n.n > 0n) return []
        const t = powInt(base, n.n.n)
        if (t) return [t]
        return [{ c: ONE, fs: [{ b: rebuildTerm(base), e: n.n }] }]
      }
      if (isZero(base.c)) return n.n.n > 0n ? [] : [{ c: ONE, fs: [{ b: K(0), e: n.n }] }]
      if (base.fs.length === 0) {
        // a number to a fractional power: exact only when it is a perfect power, otherwise kept as it is
        const root = exactRoot(base.c, n.n)
        if (root) return [termConst(root)]
        return [{ c: ONE, fs: [{ b: K(base.c), e: n.n }] }]
      }
      if (base.fs.length === 1 && isOne(base.c) && isOne(base.fs[0].e)) return [{ c: ONE, fs: [{ b: base.fs[0].b, e: n.n }] }]
      return [{ c: ONE, fs: [{ b: rebuildTerm(base), e: n.n }] }]
    }
    case 'exp': {
      const a = normalize(n.a)
      if (a.length === 0) return [termConst(ONE)]
      return [{ c: ONE, fs: [{ b: ex(rebuildSum(a)), e: ONE }] }]
    }
    case 'fn': {
      const a = normalize(n.a)
      const arg = rebuildSum(a)
      if (a.length === 0) {
        if (n.f === 'sin' || n.f === 'tan') return []
        if (n.f === 'cos' || n.f === 'sec') return [termConst(ONE)]
      }
      return [{ c: ONE, fs: [{ b: fn(n.f, arg), e: ONE }] }]
    }
  }
}

/** c^(p/q) as a rational, when it is one. */
function exactRoot(c: Rat, e: Rat): Rat | null {
  if (c.n < 0n) return null
  const root = (v: bigint, q: bigint): bigint | null => {
    if (v === 0n || v === 1n) return v
    const guess = BigInt(Math.round(Math.pow(Number(v), 1 / Number(q))))
    for (let g = guess - 1n; g <= guess + 1n; g++) {
      if (g < 0n) continue
      let p = 1n
      for (let i = 0n; i < q; i++) p *= g
      if (p === v) return g
    }
    return null
  }
  if (e.d > 12n || (e.n < 0n ? -e.n : e.n) > 12n) return null
  const rn = root(c.n, e.d)
  const rd = root(c.d, e.d)
  if (rn === null || rd === null) return null
  const base = rat(rn, rd)
  const p = ratPow(base, e.n)
  return p
}

function asTerm(n: Node): Term {
  const ts = normalize(n)
  if (ts.length === 0) return termConst(ZERO)
  if (ts.length === 1) return ts[0]
  return { c: ONE, fs: [{ b: rebuildSum(ts), e: ONE }] }
}

export function simp(n: Node): Node {
  let cur = rebuildSum(normalize(n))
  for (let i = 0; i < 6; i++) {
    const next = rebuildSum(normalize(cur))
    if (toText(next) === toText(cur)) return next
    cur = next
  }
  return cur
}

/* ------------------------------------------------------------------ differentiating */

export type RuleId = 'constant' | 'power' | 'exponential' | 'trig' | 'multiple' | 'negative' | 'sum' | 'difference' | 'product' | 'quotient' | 'chain'

export interface Step {
  rule: RuleId
  /** The piece being differentiated, and its derivative by this rule, simplified. */
  expr: Node
  result: Node
  /** For the chain rule: the inside function, the outside function written in x, and its derivative written in x. */
  inner?: Node
  outer?: Node
  outerD?: Node
}

const outerDerivative = (outer: Node): Node => {
  const t = outer
  if (t.t === 'pow') return mul(K(t.n), pw(X, ratSub(t.n, ONE)))
  if (t.t === 'exp') return ex(X)
  if (t.t === 'fn') {
    const f = t.f
    return f === 'sin'
      ? fn('cos', X)
      : f === 'cos'
        ? neg(fn('sin', X))
        : f === 'tan'
          ? mul(fn('sec', X), fn('sec', X))
          : f === 'cot'
            ? neg(mul(fn('csc', X), fn('csc', X)))
            : f === 'sec'
              ? mul(fn('sec', X), fn('tan', X))
              : neg(mul(fn('csc', X), fn('cot', X)))
  }
  return K(0)
}

/** d/dx of a node, recording the rules used in the order they are applied. Always returns an unsimplified tree. */
export function differentiate(n: Node, steps: Step[] = []): Node {
  const record = (rule: RuleId, result: Node) => steps.push({ rule, expr: n, result: simp(result) })
  switch (n.t) {
    case 'num':
    case 'pi':
      record('constant', K(0))
      return K(0)
    case 'x':
      record('power', K(1))
      return K(1)
    case 'neg': {
      const slot = steps.length
      steps.push({ rule: 'negative', expr: n, result: K(0) })
      const r = neg(differentiate(n.a, steps))
      steps[slot].result = simp(r)
      return r
    }
    case 'add':
    case 'sub': {
      const slot = steps.length
      steps.push({ rule: n.t === 'add' ? 'sum' : 'difference', expr: n, result: K(0) })
      const da = differentiate(n.a, steps)
      const db = differentiate(n.b, steps)
      const r = n.t === 'add' ? add(da, db) : sub(da, db)
      steps[slot].result = simp(r)
      return r
    }
    case 'mul': {
      const slot = steps.length
      if (isConst(n.a) || isConst(n.b)) {
        steps.push({ rule: 'multiple', expr: n, result: K(0) })
        const r = isConst(n.a) ? mul(n.a, differentiate(n.b, steps)) : mul(differentiate(n.a, steps), n.b)
        steps[slot].result = simp(r)
        return r
      }
      steps.push({ rule: 'product', expr: n, result: K(0) })
      const da = differentiate(n.a, steps)
      const db = differentiate(n.b, steps)
      const r = add(mul(da, n.b), mul(n.a, db))
      steps[slot].result = simp(r)
      return r
    }
    case 'div': {
      const slot = steps.length
      if (isConst(n.b)) {
        steps.push({ rule: 'multiple', expr: n, result: K(0) })
        const r = div(differentiate(n.a, steps), n.b)
        steps[slot].result = simp(r)
        return r
      }
      steps.push({ rule: 'quotient', expr: n, result: K(0) })
      const da = differentiate(n.a, steps)
      const db = differentiate(n.b, steps)
      const r = div(sub(mul(da, n.b), mul(n.a, db)), mul(n.b, n.b))
      steps[slot].result = simp(r)
      return r
    }
    case 'pow':
    case 'exp':
    case 'fn': {
      if (isConst(n.a)) {
        record('constant', K(0))
        return K(0)
      }
      const plain = n.a.t === 'x'
      const outer: Node = n.t === 'pow' ? pw(X, n.n) : n.t === 'exp' ? ex(X) : fn(n.f, X)
      const outerD = outerDerivative(outer)
      if (plain) {
        record(n.t === 'pow' ? 'power' : n.t === 'exp' ? 'exponential' : 'trig', outerD)
        return outerD
      }
      const slot = steps.length
      steps.push({ rule: 'chain', expr: n, result: K(0), inner: n.a, outer, outerD: simp(outerD) })
      const dIn = differentiate(n.a, steps)
      const r = mul(subst(outerD, n.a), dIn)
      steps[slot].result = simp(r)
      return r
    }
  }
}

/** The derivative, simplified, together with the rules used. */
export function derive(n: Node): { result: Node; steps: Step[] } {
  const steps: Step[] = []
  const raw = differentiate(n, steps)
  return { result: simp(raw), steps }
}

/** The k-th derivative (k ≥ 0), simplified at each stage. */
export function nth(n: Node, k: number): Node {
  let cur = simp(n)
  for (let i = 0; i < k; i++) cur = derive(cur).result
  return cur
}

/* ------------------------------------------------------------------ printing */

const ratTex = (r: Rat): string => (r.d === 1n ? `${absR(r).n}` : `\\frac{${absR(r).n}}{${r.d}}`)

const isAtom = (n: Node): boolean => n.t === 'x' || n.t === 'pi' || (n.t === 'num' && n.v.d === 1n && n.v.n >= 0n)

/** The letter the variable is printed with: x normally, u when a widget shows an outside function. */
export function toTex(n: Node, v = 'x'): string {
  const wrapAll = (c: Node) => `\\left(${toTex(c, v)}\\right)`
  const tex = (c: Node) => toTex(c, v)
  const arg = (a: Node) => (a.t === 'x' || a.t === 'pi' ? ` ${tex(a)}` : `\\left(${tex(a)}\\right)`)
  switch (n.t) {
    case 'num':
      return n.v.n < 0n ? `-${ratTex(n.v)}` : ratTex(n.v)
    case 'pi':
      return '\\pi'
    case 'x':
      return v
    case 'neg':
      return `-${n.a.t === 'add' || n.a.t === 'sub' || n.a.t === 'neg' ? wrapAll(n.a) : tex(n.a)}`
    case 'add':
      return `${tex(n.a)}+${tex(n.b)}`
    case 'sub':
      return `${tex(n.a)}-${n.b.t === 'add' || n.b.t === 'sub' || n.b.t === 'neg' ? wrapAll(n.b) : tex(n.b)}`
    case 'mul': {
      const parts: Node[] = []
      const flat = (m: Node): void => {
        if (m.t === 'mul') {
          flat(m.a)
          flat(m.b)
        } else parts.push(m)
      }
      flat(n)
      let s = ''
      parts.forEach((p, i) => {
        const needs = p.t === 'add' || p.t === 'sub' || p.t === 'neg'
        const piece = needs ? wrapAll(p) : tex(p)
        if (i > 0) {
          const prev = parts[i - 1]
          const startsNumber = p.t === 'num' || (p.t === 'pow' && p.a.t === 'num')
          const spaced = (prev.t === 'fn' && (prev.a.t === 'x' || prev.a.t === 'pi')) || prev.t === 'pi' || prev.t === 'exp' || (prev.t === 'pow' && prev.a.t === 'fn' && (prev.a.a.t === 'x' || prev.a.a.t === 'pi'))
          s += startsNumber ? '\\cdot ' : spaced ? '\\,' : ''
        }
        s += piece
      })
      return s
    }
    case 'div':
      return `\\frac{${tex(n.a)}}{${tex(n.b)}}`
    case 'pow': {
      if (n.n.n === 1n && n.n.d === 2n) return `\\sqrt{${tex(n.a)}}`
      const e = n.n.d === 1n ? `${n.n.n}` : `${n.n.n < 0n ? '-' : ''}\\frac{${absR(n.n).n}}{${n.n.d}}`
      if (n.a.t === 'fn' && n.n.d === 1n && n.n.n > 0n) return `\\${n.a.f}^{${e}}${arg(n.a.a)}`
      const base = isAtom(n.a) || (n.a.t === 'exp') ? (n.a.t === 'exp' ? wrapAll(n.a) : tex(n.a)) : wrapAll(n.a)
      return `${base}^{${e}}`
    }
    case 'exp':
      return `e^{${tex(n.a)}}`
    case 'fn':
      return `\\${n.f}${arg(n.a)}`
  }
}

/** A plain text form the parser can read back. */
export function toText(n: Node): string {
  const r = (q: Rat) => (q.d === 1n ? `${q.n}` : `${q.n}/${q.d}`)
  switch (n.t) {
    case 'num':
      return n.v.d === 1n ? (n.v.n < 0n ? `(${n.v.n})` : `${n.v.n}`) : `(${n.v.n}/${n.v.d})`
    case 'pi':
      return 'pi'
    case 'x':
      return 'x'
    case 'neg':
      return `(-${toText(n.a)})`
    case 'add':
      return `(${toText(n.a)}+${toText(n.b)})`
    case 'sub':
      return `(${toText(n.a)}-${toText(n.b)})`
    case 'mul':
      return `(${toText(n.a)}*${toText(n.b)})`
    case 'div':
      return `(${toText(n.a)}/${toText(n.b)})`
    case 'pow':
      return `(${toText(n.a)}^(${r(n.n)}))`
    case 'exp':
      return `(e^(${toText(n.a)}))`
    case 'fn':
      return `${n.f}(${toText(n.a)})`
  }
}

/* ------------------------------------------------------------------ parsing */

export class ParseError extends Error {
  constructor(public code: 'syntax' | 'paren' | 'varexp' | 'function' | 'exp' | 'big', public detail = '') {
    super(code)
  }
}

type Tok = { k: 'n'; v: string } | { k: 'id'; v: string } | { k: 'op'; v: string }

const NAMES = ['sqrt', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'pi', 'e', 'x']

function tokenize(src: string): Tok[] {
  const out: Tok[] = []
  const s = src.replace(/π/g, 'pi').replace(/−/g, '-').replace(/\s+/g, ' ').trim().toLowerCase()
  if (s.length === 0) throw new ParseError('syntax')
  if (s.length > 400) throw new ParseError('big')
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (c === ' ') {
      i++
    } else if (/[0-9.,]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.,]/.test(s[j])) j++
      out.push({ k: 'n', v: s.slice(i, j).replace(',', '.') })
      i = j
    } else if (/[a-z]/.test(c)) {
      let j = i
      while (j < s.length && /[a-z]/.test(s[j])) j++
      let rest = s.slice(i, j)
      const whole = rest
      while (rest) {
        const name = NAMES.find((nm) => rest.startsWith(nm))
        if (!name) throw new ParseError('function', whole)
        out.push({ k: 'id', v: name })
        rest = rest.slice(name.length)
      }
      i = j
    } else if ('+-*/^()'.includes(c)) {
      out.push({ k: 'op', v: c })
      i++
    } else throw new ParseError('syntax', c)
  }
  return out
}

const decimalToRat = (s: string): Rat => {
  const m = /^(\d*)\.?(\d*)$/.exec(s)
  if (!m || (!m[1] && !m[2])) throw new ParseError('syntax', s)
  const frac = m[2] ?? ''
  return rat(BigInt((m[1] ?? '') + frac || '0'), 10n ** BigInt(frac.length))
}

class Parser {
  i = 0
  depth = 0
  constructor(private toks: Tok[]) {}
  peek(): Tok | undefined {
    return this.toks[this.i]
  }
  eat(): Tok {
    return this.toks[this.i++]
  }
  isOp(v: string): boolean {
    const t = this.peek()
    return !!t && t.k === 'op' && t.v === v
  }

  parse(): Node {
    const n = this.sum()
    if (this.i !== this.toks.length) throw new ParseError('syntax')
    return n
  }

  sum(): Node {
    let n = this.term()
    while (this.isOp('+') || this.isOp('-')) {
      const op = this.eat().v
      const r = this.term()
      n = op === '+' ? add(n, r) : sub(n, r)
    }
    return n
  }

  startsAtom(): boolean {
    const t = this.peek()
    if (!t) return false
    if (t.k === 'n' || t.k === 'id') return true
    return t.v === '('
  }

  term(): Node {
    let n = this.unary()
    for (;;) {
      if (this.isOp('*')) {
        this.eat()
        n = mul(n, this.unary())
      } else if (this.isOp('/')) {
        this.eat()
        n = div(n, this.unary())
      } else if (this.startsAtom()) {
        n = mul(n, this.power())
      } else return n
    }
  }

  unary(): Node {
    if (this.isOp('-')) {
      this.eat()
      return neg(this.unary())
    }
    if (this.isOp('+')) {
      this.eat()
      return this.unary()
    }
    return this.power()
  }

  /** The exponent after ^: a signed number, or a bracketed constant expression such as (1/2). */
  exponent(): Rat {
    let sign = 1n
    if (this.isOp('-')) {
      this.eat()
      sign = -1n
    } else if (this.isOp('+')) this.eat()
    const t = this.peek()
    if (!t) throw new ParseError('syntax')
    let v: Rat
    if (t.k === 'op' && t.v === '(') {
      this.eat()
      const inner = this.sum()
      if (!this.isOp(')')) throw new ParseError('syntax')
      this.eat()
      if (!isConst(inner)) throw new ParseError('varexp')
      const val = evalExact(inner, ZERO)
      if (val === null) throw new ParseError('exp')
      v = val
    } else if (t.k === 'n') {
      this.eat()
      v = decimalToRat(t.v)
    } else if (t.k === 'id' && t.v === 'x') {
      throw new ParseError('varexp')
    } else throw new ParseError('exp')
    return sign < 0n ? negR(v) : v
  }

  power(): Node {
    const t = this.peek()
    // e^u
    if (t && t.k === 'id' && t.v === 'e') {
      this.eat()
      if (!this.isOp('^')) throw new ParseError('exp', 'e')
      this.eat()
      return ex(this.expArg())
    }
    // sin^2(x)
    if (t && t.k === 'id' && (FN_NAMES as string[]).includes(t.v)) {
      const next = this.toks[this.i + 1]
      if (next && next.k === 'op' && next.v === '^') {
        this.eat()
        this.eat()
        const n = this.exponent()
        return pw(this.fnArg(t.v as FnName), n)
      }
    }
    const base = this.atom()
    if (this.isOp('^')) {
      this.eat()
      const n = this.exponent()
      if (isInt(n) && absR(n).n > 99n) throw new ParseError('big')
      return pw(base, n)
    }
    return base
  }

  /** What stands after e^: a bracket, x, pi, a number, or a minus sign and one of those. */
  expArg(): Node {
    if (this.isOp('-')) {
      this.eat()
      return neg(this.expArg())
    }
    const t = this.peek()
    if (!t) throw new ParseError('syntax')
    if (t.k === 'op' && t.v === '(') return this.atom()
    if (t.k === 'id' && (t.v === 'x' || t.v === 'pi')) {
      this.eat()
      return t.v === 'x' ? X : PI
    }
    if (t.k === 'n') {
      this.eat()
      return K(decimalToRat(t.v))
    }
    throw new ParseError('exp', 'e')
  }

  /** The argument of a function whose name has been read: a bracket, or a bare x or pi (not followed by a power). */
  fnArg(name: FnName): Node {
    if (this.isOp('(')) {
      this.eat()
      const a = this.sum()
      if (!this.isOp(')')) throw new ParseError('syntax')
      this.eat()
      return fn(name, a)
    }
    const t = this.peek()
    if (t && t.k === 'id' && (t.v === 'x' || t.v === 'pi')) {
      this.eat()
      if (this.isOp('^')) throw new ParseError('paren', name)
      return fn(name, t.v === 'x' ? X : PI)
    }
    throw new ParseError('paren', name)
  }

  atom(): Node {
    const t = this.peek()
    if (!t) throw new ParseError('syntax')
    if (t.k === 'n') {
      this.eat()
      return K(decimalToRat(t.v))
    }
    if (t.k === 'id') {
      if (t.v === 'x') {
        this.eat()
        return X
      }
      if (t.v === 'pi') {
        this.eat()
        return PI
      }
      if (t.v === 'e') throw new ParseError('exp', 'e')
      if ((FN_NAMES as string[]).includes(t.v)) {
        this.eat()
        return this.fnArg(t.v as FnName)
      }
      if (t.v === 'sqrt') {
        this.eat()
        if (!this.isOp('(')) throw new ParseError('paren', 'sqrt')
        this.eat()
        const a = this.sum()
        if (!this.isOp(')')) throw new ParseError('syntax')
        this.eat()
        return pw(a, 1, 2)
      }
    }
    if (t.k === 'op' && t.v === '(') {
      this.eat()
      this.depth++
      if (this.depth > 40) throw new ParseError('big')
      const n = this.sum()
      this.depth--
      if (!this.isOp(')')) throw new ParseError('syntax')
      this.eat()
      return n
    }
    throw new ParseError('syntax')
  }
}

/** Read an expression such as `sin(2x)`, `(3x^2+1)^2`, `e^(cos x)`, `tan(5 - sin(2x))`, `sqrt(3x+1)`, `sin^5(x)`. */
export function parseExpression(src: string): Node {
  return new Parser(tokenize(src)).parse()
}

/* ------------------------------------------------------------ oscillations */

/** y = A sin(kx) and its slope A k cos(kx): the chain rule with the inside function kx. */
export const sinKx = (A: number, k: number, x: number): number => A * Math.sin(k * x)
export const sinKxSlope = (A: number, k: number, x: number): number => A * k * Math.cos(k * x)

/** The greatest speed, acceleration and jerk of a piston at s = A cos(2πbt): each derivative brings down a factor 2πb. */
export function pistonRates(A: number, b: number): { v: number; a: number; j: number } {
  const w = 2 * Math.PI * b
  return { v: A * w, a: A * w * w, j: A * w * w * w }
}

/** The average temperature in Fairbanks, Alaska, on day x of the year, in degrees Celsius, and how fast it is changing. */
export const fairbanks = (x: number): number => 20 * Math.sin(((2 * Math.PI) / 365) * (x - 101)) - 4
export const fairbanksSlope = (x: number): number => ((40 * Math.PI) / 365) * Math.cos(((2 * Math.PI) / 365) * (x - 101))
