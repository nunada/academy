/** A small symbolic differentiator for the "Differentiation Rules" article's widget.
 *
 *  It knows exactly the rules of that chapter and nothing more: the constant rule, the power rule (any real exponent,
 *  written as a + bπ so that x^π and x^(π + 1) stay exact), the constant multiple, sum and difference rules, e^x, the
 *  product rule and the quotient rule. A base other than x (as in (x + 1)^3) or an exponent other than the single
 *  letter x on e is refused, because those need the chain rule, which comes later; the reader is told to expand or to
 *  use the product rule instead.
 *
 *  Three independent references keep it honest (see tools/check-diffrules.mjs): for expressions that are rational
 *  functions the derivative is compared *exactly* with the one from `derivative.ts` (a different algorithm: the
 *  quotient rule on reduced polynomial fractions), every derivative is compared with central differences in floating
 *  point, and printing an expression and parsing it again gives the same function. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { polyAdd, polyMul, polySub, type Poly } from './tangent'
import { derivativeFn, evalFn, type RationalFn } from './derivative'

export { rat, type Rat }

/** An exponent a + bπ, with a and b rational. */
export interface Exp {
  a: Rat
  b: Rat
}

export type Node =
  | { t: 'num'; v: Rat }
  | { t: 'pi' }
  | { t: 'x' }
  | { t: 'ex' }
  | { t: 'pow'; e: Exp }
  | { t: 'neg'; a: Node }
  | { t: 'add'; a: Node; b: Node }
  | { t: 'sub'; a: Node; b: Node }
  | { t: 'mul'; a: Node; b: Node }
  | { t: 'div'; a: Node; b: Node }

const ZERO = rat(0n, 1n)
const ONE = rat(1n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const isOne = (r: Rat): boolean => r.n === 1n && r.d === 1n
const same = (a: Rat, b: Rat): boolean => a.n === b.n && a.d === b.d

export const K = (n: number | bigint | Rat, d = 1): Node => ({ t: 'num', v: typeof n === 'object' ? n : rat(BigInt(n), BigInt(d)) })
export const X: Node = { t: 'x' }
export const PI: Node = { t: 'pi' }
export const EX: Node = { t: 'ex' }
export const pw = (a: Rat | number, b: Rat | number = 0): Node => ({
  t: 'pow',
  e: { a: typeof a === 'number' ? rat(BigInt(a), 1n) : a, b: typeof b === 'number' ? rat(BigInt(b), 1n) : b },
})
export const neg = (a: Node): Node => ({ t: 'neg', a })
export const add = (a: Node, b: Node): Node => ({ t: 'add', a, b })
export const sub = (a: Node, b: Node): Node => ({ t: 'sub', a, b })
export const mul = (a: Node, b: Node): Node => ({ t: 'mul', a, b })
export const div = (a: Node, b: Node): Node => ({ t: 'div', a, b })

/** No x and no e^x inside. */
export function isConst(n: Node): boolean {
  switch (n.t) {
    case 'num':
    case 'pi':
      return true
    case 'x':
    case 'ex':
    case 'pow':
      return false
    case 'neg':
      return isConst(n.a)
    default:
      return isConst(n.a) && isConst(n.b)
  }
}

/* ------------------------------------------------------------------ evaluating */

const expValue = (e: Exp): number => Number(e.a.n) / Number(e.a.d) + (Number(e.b.n) / Number(e.b.d)) * Math.PI

export function evalFloat(n: Node, x: number): number {
  switch (n.t) {
    case 'num':
      return Number(n.v.n) / Number(n.v.d)
    case 'pi':
      return Math.PI
    case 'x':
      return x
    case 'ex':
      return Math.exp(x)
    case 'pow':
      return x ** expValue(n.e)
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

/** Exact value at a rational x, or null when the expression involves π, e^x, a non-integer power or a division by zero. */
export function evalExact(n: Node, x: Rat): Rat | null {
  switch (n.t) {
    case 'num':
      return n.v
    case 'pi':
    case 'ex':
      return null
    case 'x':
      return x
    case 'pow':
      return !isZero(n.e.b) || n.e.a.d !== 1n ? null : ratPow(x, n.e.a.n)
    case 'neg': {
      const v = evalExact(n.a, x)
      return v === null ? null : rat(-v.n, v.d)
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
    case 'ex':
      return null
    case 'pow': {
      if (!isZero(n.e.b) || n.e.a.d !== 1n) return null
      const k = n.e.a.n
      const m = k < 0n ? -k : k
      if (m > 12n) return null
      let p: Poly = one
      for (let i = 0n; i < m; i++) p = polyMul(p, [ZERO, ONE])
      return k >= 0n ? rf(p) : rf(one, p)
    }
    case 'neg': {
      const v = toRational(n.a)
      return v && rf(polySub([], v.num), v.den)
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

/** The exact derivative function of a rational expression by a different route (derivative.ts), for the checker. */
export const rationalDerivativeAt = (n: Node, x: Rat): Rat | null => {
  const f = toRational(n)
  return f ? evalFn(derivativeFn(f), x) : null
}

/* ------------------------------------------------------------------ simplifying */

const expAdd = (p: Exp, q: Exp): Exp => ({ a: ratAdd(p.a, q.a), b: ratAdd(p.b, q.b) })
const expSub = (p: Exp, q: Exp): Exp => ({ a: ratSub(p.a, q.a), b: ratSub(p.b, q.b) })

/** The power of x a node is, if it is one (x itself is x^1). */
const asPower = (n: Node): Exp | null => (n.t === 'x' ? { a: ONE, b: ZERO } : n.t === 'pow' ? n.e : null)

function fromPower(e: Exp): Node {
  if (isZero(e.a) && isZero(e.b)) return K(1)
  if (isOne(e.a) && isZero(e.b)) return X
  return { t: 'pow', e }
}

/** A constant node for a + bπ. */
function expConst(e: Exp): Node {
  const parts: Node[] = []
  if (!isZero(e.a)) parts.push(K(e.a))
  if (!isZero(e.b)) parts.push(isOne(e.b) ? PI : mul(K(e.b), PI))
  if (!parts.length) return K(0)
  return parts.length === 1 ? parts[0] : add(parts[0], parts[1])
}

export function simp(n: Node): Node {
  let cur = n
  for (let i = 0; i < 8; i++) {
    const next = simp1(cur)
    if (toText(next) === toText(cur)) return next
    cur = next
  }
  return cur
}

function simp1(n: Node): Node {
  switch (n.t) {
    case 'num':
    case 'pi':
    case 'x':
    case 'ex':
      return n
    case 'pow':
      return fromPower(n.e)
    case 'neg': {
      const a = simp1(n.a)
      if (a.t === 'num') return K(rat(-a.v.n, a.v.d))
      if (a.t === 'neg') return a.a
      return neg(a)
    }
    case 'add': {
      const a = simp1(n.a)
      const b = simp1(n.b)
      if (a.t === 'num' && isZero(a.v)) return b
      if (b.t === 'num' && isZero(b.v)) return a
      if (a.t === 'num' && b.t === 'num') return K(ratAdd(a.v, b.v))
      if (b.t === 'neg') return sub(a, b.a)
      return add(a, b)
    }
    case 'sub': {
      const a = simp1(n.a)
      const b = simp1(n.b)
      if (b.t === 'num' && isZero(b.v)) return a
      if (a.t === 'num' && isZero(a.v)) return neg(b)
      if (a.t === 'num' && b.t === 'num') return K(ratSub(a.v, b.v))
      if (b.t === 'neg') return add(a, b.a)
      return sub(a, b)
    }
    case 'mul': {
      let a = simp1(n.a)
      let b = simp1(n.b)
      if ((a.t === 'num' && isZero(a.v)) || (b.t === 'num' && isZero(b.v))) return K(0)
      if (a.t === 'num' && isOne(a.v)) return b
      if (b.t === 'num' && isOne(b.v)) return a
      if (a.t === 'num' && b.t === 'num') return K(ratMul(a.v, b.v))
      if (a.t === 'neg') return neg(simp1(mul(a.a, b)))
      if (b.t === 'neg') return neg(simp1(mul(a, b.a)))
      const pa = asPower(a)
      const pb = asPower(b)
      if (pa && pb) return fromPower(expAdd(pa, pb))
      // constants to the front
      if (isConst(b) && !isConst(a)) [a, b] = [b, a]
      if (a.t === 'num' && b.t === 'mul' && b.a.t === 'num') return simp1(mul(K(ratMul(a.v, b.a.v)), b.b))
      return mul(a, b)
    }
    case 'div': {
      const a = simp1(n.a)
      const b = simp1(n.b)
      if (a.t === 'num' && isZero(a.v)) return K(0)
      if (b.t === 'num' && isOne(b.v)) return a
      if (a.t === 'num' && b.t === 'num' && !isZero(b.v)) return K(ratDiv(a.v, b.v))
      const pa = asPower(a)
      const pb = asPower(b)
      if (pa && pb) return fromPower(expSub(pa, pb))
      if (b.t === 'num' && !isZero(b.v)) return simp1(mul(K(ratDiv(ONE, b.v)), a))
      if (a.t === 'neg') return neg(simp1(div(a.a, b)))
      return div(a, b)
    }
  }
}

/* ------------------------------------------------------------------ differentiating */

export type RuleId = 'constant' | 'power' | 'exponential' | 'multiple' | 'negative' | 'sum' | 'difference' | 'product' | 'quotient'

export interface Step {
  rule: RuleId
  /** The piece being differentiated, and its derivative by this rule, simplified. */
  expr: Node
  result: Node
}

/** d/dx of a node, recording the rules used in the order they are applied. Always returns an unsimplified tree. */
export function differentiate(n: Node, steps: Step[] = []): Node {
  const record = (rule: RuleId, result: Node) => steps.push({ rule, expr: n, result: simp(result) })
  switch (n.t) {
    case 'num':
    case 'pi': {
      record('constant', K(0))
      return K(0)
    }
    case 'x': {
      record('power', K(1))
      return K(1)
    }
    case 'pow': {
      const r = mul(expConst(n.e), fromPower(expSub(n.e, { a: ONE, b: ZERO })))
      record('power', r)
      return r
    }
    case 'ex': {
      record('exponential', EX)
      return EX
    }
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

const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n < 0n ? -r.n : r.n}` : `\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)

function expTex(e: Exp): string {
  const parts: string[] = []
  const a = e.a
  const b = e.b
  const rt = (r: Rat) => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
  if (!isZero(b)) {
    const pi = isOne(b) ? '\\pi' : same(b, rat(-1n, 1n)) ? '-\\pi' : `${rt(b)}\\pi`
    if (isZero(a)) return pi
    parts.push(rt(a))
    parts.push(pi.startsWith('-') ? pi : `+${pi}`)
    return parts.join('')
  }
  return rt(a)
}

/** Binding strength: 1 sum, 2 product, 3 sign, 4 power/atom. */
const level = (n: Node): number => (n.t === 'add' || n.t === 'sub' ? 1 : n.t === 'mul' ? 2 : n.t === 'neg' ? 3 : 4)

const startsWithNumber = (n: Node): boolean => (n.t === 'num' ? true : n.t === 'mul' ? startsWithNumber(n.a) : false)

export function toTex(n: Node): string {
  const wrap = (c: Node, min: number) => (level(c) < min ? `\\left(${toTex(c)}\\right)` : toTex(c))
  switch (n.t) {
    case 'num':
      return n.v.n < 0n ? `-${ratTex(n.v)}` : ratTex(n.v)
    case 'pi':
      return '\\pi'
    case 'x':
      return 'x'
    case 'ex':
      return 'e^{x}'
    case 'pow':
      return `x^{${expTex(n.e)}}`
    case 'neg':
      return `-${wrap(n.a, 3)}`
    case 'add':
      return `${toTex(n.a)}+${toTex(n.b)}`
    case 'sub':
      return `${toTex(n.a)}-${wrap(n.b, 2)}`
    case 'mul': {
      if (n.a.t !== 'num' && toText(n.a) === toText(n.b)) return n.a.t === 'ex' ? 'e^{2x}' : `\\left(${toTex(n.a)}\\right)^{2}`
      const left = n.a.t === 'add' || n.a.t === 'sub' || n.a.t === 'neg' ? `\\left(${toTex(n.a)}\\right)` : toTex(n.a)
      const right = n.b.t === 'add' || n.b.t === 'sub' || n.b.t === 'neg' ? `\\left(${toTex(n.b)}\\right)` : toTex(n.b)
      // a number next to a number needs a dot; a number before a letter, a bracket or a fraction does not
      return startsWithNumber(n.b) ? `${left}\\cdot ${right}` : left.endsWith('\\pi') ? `${left} ${right}` : `${left}${right}`
    }
    case 'div':
      return `\\frac{${toTex(n.a)}}{${toTex(n.b)}}`
  }
}

/** A plain text form the parser can read back. */
export function toText(n: Node): string {
  const ex = (e: Exp): string => {
    const r = (q: Rat) => (q.d === 1n ? `${q.n}` : `${q.n}/${q.d}`)
    if (isZero(e.b)) return `(${r(e.a)})`
    return `(${r(e.a)}+(${r(e.b)})*pi)`
  }
  switch (n.t) {
    case 'num':
      return n.v.d === 1n ? (n.v.n < 0n ? `(${n.v.n})` : `${n.v.n}`) : `(${n.v.n}/${n.v.d})`
    case 'pi':
      return 'pi'
    case 'x':
      return 'x'
    case 'ex':
      return 'e^x'
    case 'pow':
      return `x^${ex(n.e)}`
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
  }
}

/* ------------------------------------------------------------------ parsing */

export class ParseError extends Error {
  constructor(public code: 'syntax' | 'chain' | 'base' | 'exp' | 'function' | 'big', public detail = '') {
    super(code)
  }
}

type Tok = { k: 'n'; v: string } | { k: 'id'; v: string } | { k: 'op'; v: string }

function tokenize(src: string): Tok[] {
  const out: Tok[] = []
  const s = src.replace(/π/g, 'pi').replace(/−/g, '-').replace(/\s+/g, ' ').trim().toLowerCase()
  if (s.length === 0) throw new ParseError('syntax')
  if (s.length > 600) throw new ParseError('big')
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
      const word = s.slice(i, j)
      if (word === 'pi' || word === 'sqrt' || word === 'e' || word === 'x') out.push({ k: 'id', v: word })
      else if (/^[ex]+$/.test(word) || /^(x|e|pi)+$/.test(word)) {
        // juxtaposed letters such as "xe" or "ex": split into single known pieces
        let rest = word
        while (rest) {
          if (rest.startsWith('pi')) {
            out.push({ k: 'id', v: 'pi' })
            rest = rest.slice(2)
          } else {
            out.push({ k: 'id', v: rest[0] })
            rest = rest.slice(1)
          }
        }
      } else throw new ParseError('function', word)
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
    if (t.k === 'n') return true
    if (t.k === 'id') return true
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

  power(): Node {
    const t = this.peek()
    // e^x
    if (t && t.k === 'id' && t.v === 'e') {
      this.eat()
      if (!this.isOp('^')) throw new ParseError('exp', 'e')
      this.eat()
      const nx = this.peek()
      if (nx && nx.k === 'id' && nx.v === 'x') {
        this.eat()
        return EX
      }
      throw new ParseError('chain', 'e')
    }
    const base = this.atom()
    if (this.isOp('^')) {
      this.eat()
      if (base.t !== 'x') {
        if (base.t === 'num' || base.t === 'pi') throw new ParseError('base', 'number')
        throw new ParseError('chain', 'base')
      }
      return { t: 'pow', e: this.exponent() }
    }
    return base
  }

  /** The exponent of x: a number, π, a signed one, or a parenthesized constant expression. */
  exponent(): Exp {
    let sign = 1n
    if (this.isOp('-')) {
      this.eat()
      sign = -1n
    } else if (this.isOp('+')) this.eat()
    const t = this.peek()
    if (!t) throw new ParseError('syntax')
    let e: Exp
    if (t.k === 'op' && t.v === '(') {
      this.eat()
      e = this.expSum()
      if (!this.isOp(')')) throw new ParseError('syntax')
      this.eat()
    } else if (t.k === 'n') {
      this.eat()
      e = { a: decimalToRat(t.v), b: ZERO }
    } else if (t.k === 'id' && t.v === 'pi') {
      this.eat()
      e = { a: ZERO, b: ONE }
    } else throw new ParseError('exp')
    return sign < 0n ? { a: rat(-e.a.n, e.a.d), b: rat(-e.b.n, e.b.d) } : e
  }

  expSum(): Exp {
    let e = this.expTerm()
    while (this.isOp('+') || this.isOp('-')) {
      const op = this.eat().v
      const r = this.expTerm()
      e = op === '+' ? { a: ratAdd(e.a, r.a), b: ratAdd(e.b, r.b) } : { a: ratSub(e.a, r.a), b: ratSub(e.b, r.b) }
    }
    return e
  }

  expTerm(): Exp {
    let e = this.expAtom()
    while (this.isOp('*') || this.isOp('/')) {
      const op = this.eat().v
      const r = this.expAtom()
      if (op === '*') {
        if (isZero(e.b)) e = { a: ratMul(e.a, r.a), b: ratMul(e.a, r.b) }
        else if (isZero(r.b)) e = { a: ratMul(e.a, r.a), b: ratMul(e.b, r.a) }
        else throw new ParseError('exp')
      } else {
        if (!isZero(r.b) || isZero(r.a)) throw new ParseError('exp')
        e = { a: ratDiv(e.a, r.a), b: ratDiv(e.b, r.a) }
      }
    }
    return e
  }

  expAtom(): Exp {
    if (this.isOp('-')) {
      this.eat()
      const e = this.expAtom()
      return { a: rat(-e.a.n, e.a.d), b: rat(-e.b.n, e.b.d) }
    }
    const t = this.eat()
    if (!t) throw new ParseError('syntax')
    if (t.k === 'n') return { a: decimalToRat(t.v), b: ZERO }
    if (t.k === 'id' && t.v === 'pi') return { a: ZERO, b: ONE }
    if (t.k === 'op' && t.v === '(') {
      const e = this.expSum()
      if (!this.isOp(')')) throw new ParseError('syntax')
      this.eat()
      return e
    }
    throw new ParseError('exp')
  }

  atom(): Node {
    const t = this.eat()
    if (!t) throw new ParseError('syntax')
    if (t.k === 'n') return K(decimalToRat(t.v))
    if (t.k === 'id') {
      if (t.v === 'x') return X
      if (t.v === 'pi') return PI
      if (t.v === 'e') throw new ParseError('exp', 'e')
      if (t.v === 'sqrt') {
        if (!this.isOp('(')) throw new ParseError('syntax')
        this.eat()
        const a = this.eat()
        if (!a || a.k !== 'id' || a.v !== 'x') throw new ParseError('chain', 'sqrt')
        if (!this.isOp(')')) throw new ParseError('syntax')
        this.eat()
        return pw(rat(1n, 2n))
      }
    }
    if (t.k === 'op' && t.v === '(') {
      const n = this.sum()
      if (!this.isOp(')')) throw new ParseError('syntax')
      this.eat()
      return n
    }
    throw new ParseError('syntax')
  }
}

/** Read an expression such as `x^3 - 3x`, `(x^2+1)(x-3)`, `x e^x`, `(t^2-1)/(t^3+1)` (with x), `sqrt(x)`, `x^(pi+1)`. */
export function parseExpression(src: string): Node {
  return new Parser(tokenize(src)).parse()
}
