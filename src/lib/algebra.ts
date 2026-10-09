/** A small exact algebra engine for the "Algebraic Expressions" article's widgets.
 *
 *  It reads expressions such as `3x^2 - 5x + 1`, `(x+2)(x-3)` and `2(a+b)^2`, and
 *  keeps them as polynomials with exact fraction coefficients, so "these two
 *  expressions are equal" means equal, not "equal at the points I tried". It
 *  expands, collects like terms, evaluates, and factors polynomials of one
 *  variable (common factor, difference of squares, perfect squares, trinomials).
 *
 *  What it does not do on purpose: divide by an expression, use negative or
 *  fractional exponents, or read functions. An unsupported input is an
 *  `AlgebraError` with a code the widget turns into a sentence in the reader's
 *  language, never a guess.
 *
 *  `tools/check-algebra.mjs` checks all of it against floating-point evaluation of
 *  the same text and against expanding every factorisation back. */

import { gcd, isqrt, rat, ratText, parseRational, type Rat } from './realnum'
import { ratPow } from './powers'

export class AlgebraError extends Error {
  constructor(public code: 'empty' | 'char' | 'syntax' | 'number' | 'division' | 'exponent' | 'big' | 'multi', public detail = '') {
    super(code)
  }
}

/* ----------------------------------------------------------------- monomials */

/** A monomial as text: letters in alphabetical order, each followed by its
 *  exponent when that is more than 1. `x2y` is x²y; the empty string is 1. */
export type Mono = string

const parts = (m: Mono): [string, number][] => [...m.matchAll(/([A-Za-z])(\d*)/g)].map((x) => [x[1], x[2] ? Number(x[2]) : 1])
const build = (e: Map<string, number>): Mono =>
  [...e.entries()]
    .filter(([, n]) => n > 0)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([l, n]) => (n > 1 ? `${l}${n}` : l))
    .join('')

export const monoDegree = (m: Mono): number => parts(m).reduce((n, [, e]) => n + e, 0)

function monoMul(a: Mono, b: Mono): Mono {
  const e = new Map<string, number>()
  for (const [l, n] of [...parts(a), ...parts(b)]) e.set(l, (e.get(l) ?? 0) + n)
  return build(e)
}

/* ---------------------------------------------------------------- polynomials */

export type Poly = Map<Mono, Rat>

const ZERO = rat(0n, 1n)
const ONE = rat(1n, 1n)
const rAdd = (a: Rat, b: Rat): Rat => rat(a.n * b.d + b.n * a.d, a.d * b.d)
const rMul = (a: Rat, b: Rat): Rat => rat(a.n * b.n, a.d * b.d)
const rNeg = (a: Rat): Rat => rat(-a.n, a.d)
const isZero = (a: Rat): boolean => a.n === 0n

const MAX_TERMS = 400
const MAX_DEGREE = 40

function clean(p: Poly): Poly {
  for (const [k, v] of p) if (isZero(v)) p.delete(k)
  if (p.size > MAX_TERMS) throw new AlgebraError('big')
  return p
}

export const constant = (r: Rat): Poly => clean(new Map([['', r]]))
export const variable = (l: string): Poly => new Map([[l, ONE]])

export function add(a: Poly, b: Poly): Poly {
  const out: Poly = new Map(a)
  for (const [k, v] of b) out.set(k, rAdd(out.get(k) ?? ZERO, v))
  return clean(out)
}
export const neg = (a: Poly): Poly => new Map([...a].map(([k, v]) => [k, rNeg(v)]))
export const sub = (a: Poly, b: Poly): Poly => add(a, neg(b))

export function mul(a: Poly, b: Poly): Poly {
  const out: Poly = new Map()
  for (const [ka, va] of a)
    for (const [kb, vb] of b) {
      const k = monoMul(ka, kb)
      if (monoDegree(k) > MAX_DEGREE) throw new AlgebraError('big')
      out.set(k, rAdd(out.get(k) ?? ZERO, rMul(va, vb)))
    }
  return clean(out)
}

export function pow(a: Poly, n: number): Poly {
  let out = constant(ONE)
  for (let i = 0; i < n; i++) out = mul(out, a)
  return out
}

export const isConstant = (p: Poly): boolean => p.size === 0 || (p.size === 1 && p.has(''))
export const constValue = (p: Poly): Rat => p.get('') ?? ZERO

export function equal(a: Poly, b: Poly): boolean {
  const d = sub(a, b)
  return d.size === 0
}

export function degree(p: Poly): number {
  let d = 0
  for (const k of p.keys()) d = Math.max(d, monoDegree(k))
  return d
}

export const variables = (p: Poly): string[] => [...new Set([...p.keys()].flatMap((k) => parts(k).map(([l]) => l)))].sort()

/** monomial · polynomial, for pulling a common factor out. */
const scaleBy = (p: Poly, c: Rat, m: Mono): Poly => clean(new Map([...p].map(([k, v]) => [monoMul(k, m), rMul(v, c)])))

/* ------------------------------------------------------------------- parsing */

type Tok = { t: 'num' | 'id' | 'op'; v: string }

function tokenize(src: string): Tok[] {
  // Spaces are dropped below, which would turn "2 3" into 23. Refuse it instead.
  if (/\d\s+\d/.test(src)) throw new AlgebraError('syntax', src)
  const s = src
    .replace(/−/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, '')
  if (!s) throw new AlgebraError('empty')
  const toks: Tok[] = []
  for (let i = 0; i < s.length; ) {
    const c = s[i]
    if (/\d|\./.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i))
      if (!m) throw new AlgebraError('number', s.slice(i, i + 4))
      toks.push({ t: 'num', v: m[1] })
      i += m[1].length
    } else if (/[A-Za-z]/.test(c)) {
      toks.push({ t: 'id', v: c })
      i++
    } else if ('+-*/^()'.includes(c)) {
      toks.push({ t: 'op', v: c })
      i++
    } else throw new AlgebraError('char', c)
  }
  return toks
}

class Parser {
  i = 0
  constructor(private toks: Tok[]) {}
  private peek = () => this.toks[this.i]
  private isOp = (v: string) => this.peek()?.t === 'op' && this.peek()!.v === v

  parse(): Poly {
    const p = this.expr()
    if (this.i < this.toks.length) throw new AlgebraError('syntax', this.peek()!.v)
    return p
  }

  /** expr := term (('+' | '-') term)* */
  private expr(): Poly {
    let acc = this.term()
    while (this.isOp('+') || this.isOp('-')) {
      const op = this.toks[this.i++].v
      const t = this.term()
      acc = op === '+' ? add(acc, t) : sub(acc, t)
    }
    return acc
  }

  /** term := unary (('*' | '/' | juxtaposition) power)* */
  private term(): Poly {
    let acc = this.unary()
    for (;;) {
      if (this.isOp('*')) {
        this.i++
        acc = mul(acc, this.unary()) // 2*-x is fine
      } else if (this.isOp('/')) {
        this.i++
        const d = this.power()
        if (!isConstant(d) || isZero(constValue(d))) throw new AlgebraError('division')
        const c = constValue(d)
        acc = scaleBy(acc, rat(c.d, c.n), '')
      } else if (this.peek()?.t === 'id' || this.isOp('(')) {
        acc = mul(acc, this.power()) // 2x, xy, 3(x+1), (x+1)(x-1)
      } else if (this.peek()?.t === 'num') {
        throw new AlgebraError('syntax', this.peek()!.v) // `x2` or `2 3`
      } else return acc
    }
  }

  private unary(): Poly {
    if (this.isOp('-')) {
      this.i++
      return neg(this.unary())
    }
    if (this.isOp('+')) {
      this.i++
      return this.unary()
    }
    return this.power()
  }

  /** power := atom ('^' integer)? */
  private power(): Poly {
    const base = this.atom()
    if (!this.isOp('^')) return base
    this.i++
    let paren = false
    if (this.isOp('(')) {
      paren = true
      this.i++
    }
    if (this.isOp('-')) throw new AlgebraError('exponent', '-')
    const t = this.toks[this.i++]
    if (!t || t.t !== 'num' || !/^\d+$/.test(t.v)) throw new AlgebraError('exponent', t?.v ?? '')
    const n = Number(t.v)
    if (n > 12) throw new AlgebraError('exponent', t.v)
    if (paren) {
      if (!this.isOp(')')) throw new AlgebraError('exponent', '(')
      this.i++
    }
    return pow(base, n)
  }

  private atom(): Poly {
    const t = this.toks[this.i++]
    if (!t) throw new AlgebraError('syntax', '')
    if (t.t === 'num') {
      const r = parseRational(t.v)
      if (!r) throw new AlgebraError('number', t.v)
      return constant(r)
    }
    if (t.t === 'id') return variable(t.v)
    if (t.v === '(') {
      const p = this.expr()
      if (!this.isOp(')')) throw new AlgebraError('syntax', '(')
      this.i++
      return p
    }
    throw new AlgebraError('syntax', t.v)
  }
}

export function parsePoly(src: string): Poly {
  const p = new Parser(tokenize(src)).parse()
  const vars = variables(p)
  if (vars.length > 3) throw new AlgebraError('multi', vars.join(''))
  return p
}

/* ----------------------------------------------------------------- the shape */

/** Terms in the order a person writes them: highest degree first, then the
 *  alphabetically earlier letter with the higher exponent first. */
export function sortedTerms(p: Poly): [Mono, Rat][] {
  const letters = variables(p)
  const vec = (m: Mono) => {
    const e = new Map(parts(m))
    return letters.map((l) => e.get(l) ?? 0)
  }
  return [...p].sort((a, b) => {
    const da = monoDegree(a[0])
    const db = monoDegree(b[0])
    if (da !== db) return db - da
    const va = vec(a[0])
    const vb = vec(b[0])
    for (let i = 0; i < va.length; i++) if (va[i] !== vb[i]) return vb[i] - va[i]
    return 0
  })
}

const absRat = (r: Rat): Rat => (r.n < 0n ? rNeg(r) : r)

function monoTex(m: Mono): string {
  return parts(m)
    .map(([l, n]) => (n > 1 ? `${l}^{${n}}` : l))
    .join('')
}

function coefTex(r: Rat): string {
  return r.d === 1n ? `${r.n}` : `\\frac{${r.n}}{${r.d}}`
}

/** A polynomial as TeX: `3x^{2}-5x+1`. */
export function polyTex(p: Poly): string {
  const ts = sortedTerms(p)
  if (!ts.length) return '0'
  return ts
    .map(([m, c], i) => {
      const a = absRat(c)
      const body = m === '' ? coefTex(a) : `${a.n === 1n && a.d === 1n ? '' : coefTex(a)}${monoTex(m)}`
      const sign = c.n < 0n ? '-' : i === 0 ? '' : '+'
      return `${sign}${body}`
    })
    .join('')
}

/** The same in plain text, `3x^2 - 5x + 1`, for tests and for screen-reader labels. */
export function polyText(p: Poly): string {
  const ts = sortedTerms(p)
  if (!ts.length) return '0'
  return ts
    .map(([m, c], i) => {
      const a = absRat(c)
      const coef = a.d === 1n ? `${a.n}` : `${a.n}/${a.d}`
      const mono = parts(m)
        .map(([l, n]) => (n > 1 ? `${l}^${n}` : l))
        .join('')
      const body = m === '' ? coef : `${a.n === 1n && a.d === 1n ? '' : a.d === 1n ? coef : `(${coef})`}${mono}`
      const sign = c.n < 0n ? '-' : '+'
      return i === 0 ? `${c.n < 0n ? '-' : ''}${body}` : ` ${sign} ${body}`
    })
    .join('')
}

export type PolyKind = 'zero' | 'monomial' | 'binomial' | 'trinomial' | 'polynomial'
export const kindOf = (p: Poly): PolyKind => (p.size === 0 ? 'zero' : p.size === 1 ? 'monomial' : p.size === 2 ? 'binomial' : p.size === 3 ? 'trinomial' : 'polynomial')

/** The value at a point, exactly. Null when a variable has no value. */
export function evalPoly(p: Poly, values: Record<string, Rat>): Rat | null {
  let total = ZERO
  for (const [m, c] of p) {
    let term = c
    for (const [l, n] of parts(m)) {
      const v = values[l]
      if (!v) return null
      const pw = ratPow(v, n)
      if (!pw) return null
      term = rMul(term, pw)
    }
    total = rAdd(total, term)
  }
  return total
}

/* -------------------------------------------------------------- term anatomy */

export interface TermInfo {
  raw: string
  coef: Rat
  mono: Mono
  degree: number
}

/** Cut a sum into its terms at the + and - that are not inside brackets and not
 *  right after another operator, keeping each term's own sign. */
export function splitTerms(src: string): string[] {
  const s = src.replace(/−/g, '-').replace(/\s+/g, '')
  if (!s) throw new AlgebraError('empty')
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(') depth++
    if (c === ')') depth--
    if ((c === '+' || c === '-') && depth === 0 && cur !== '' && !'^*/('.includes(cur[cur.length - 1])) {
      out.push(cur)
      cur = c === '-' ? '-' : ''
      continue
    }
    cur += c
  }
  if (cur) out.push(cur)
  return out
}

/** The terms of an expression written as a sum, each as coefficient and variable
 *  part, without combining anything. Throws `syntax` for a term that is itself a
 *  bracketed product (it has no single coefficient until it is expanded). */
export function termsOf(src: string): TermInfo[] {
  return splitTerms(src).map((raw) => {
    const p = parsePoly(raw)
    if (p.size > 1) throw new AlgebraError('syntax', raw)
    const [mono, coef] = p.size === 1 ? [...p][0] : ['', ZERO]
    return { raw, coef, mono, degree: monoDegree(mono) }
  })
}

export { monoTex }
export const monoParts = parts

/* ------------------------------------------------------------------ factoring */

export type FactorPattern = 'common' | 'square' | 'diffsq' | 'trinomial'

export interface Factorisation {
  /** The whole factorisation as TeX, e.g. `3x\left(2x+3\right)`. */
  tex: string
  /** The patterns that were used, in order. */
  patterns: FactorPattern[]
  /** True when the polynomial cannot be broken down further over the integers
   *  (or no further than this engine goes). */
  complete: boolean
  /** Why it stopped, when it did not finish. */
  note: 'irreducible' | 'degree' | null
  /** The product of the factors, for checking against the input. */
  product: Poly
}

const lin = (v: string, d: bigint, n: bigint): Poly => {
  // d·v − n
  const p: Poly = new Map()
  p.set(v, rat(d, 1n))
  if (n !== 0n) p.set('', rat(-n, 1n))
  return clean(p)
}

/** Factor a polynomial in one variable with whole-number coefficients, over the
 *  integers. Null when the input is not such a polynomial. */
export function factorPoly(p: Poly): Factorisation | null {
  const vars = variables(p)
  if (p.size === 0 || vars.length > 1) return null
  const v = vars[0] ?? 'x'
  if ([...p.values()].some((c) => c.d !== 1n)) return null

  const coefAt = (k: number): bigint => (p.get(k === 0 ? '' : k === 1 ? v : `${v}${k}`)?.n ?? 0n)
  const deg = degree(p)
  let k0 = 0
  while (coefAt(k0) === 0n) k0++ // lowest power of v present
  let g = 0n
  for (let i = 0; i <= deg; i++) g = gcd(g, coefAt(i))
  const lead = coefAt(deg)
  const cf = lead < 0n ? -g : g
  const m = deg - k0 // degree of what is left
  const q = (i: number): bigint => coefAt(i + k0) / cf

  const patterns: FactorPattern[] = []
  const factors: Poly[] = []
  let complete = true
  let note: Factorisation['note'] = null
  if (cf !== 1n || k0 > 0) patterns.push('common')

  if (m === 1) {
    // already a primitive linear factor
    factors.push(lin(v, q(1), -q(0)))
  } else if (m === 2) {
    const a = q(2)
    const b = q(1)
    const c = q(0)
    const D = b * b - 4n * a * c
    const s = D >= 0n ? isqrt(D) : -1n
    if (s >= 0n && s * s === D) {
      const r1 = rat(-b + s, 2n * a)
      const r2 = rat(-b - s, 2n * a)
      const sorted = [r1, r2].sort((x, y) => (x.n * y.d < y.n * x.d ? -1 : x.n * y.d > y.n * x.d ? 1 : 0))
      const k = a / (sorted[0].d * sorted[1].d) // 1 by Gauss's lemma, kept honest anyway
      factors.push(lin(v, sorted[0].d, sorted[0].n), lin(v, sorted[1].d, sorted[1].n))
      if (k !== 1n) factors.push(constant(rat(k, 1n)))
      const isSq = (x: bigint) => x >= 0n && isqrt(x) ** 2n === x
      if (D === 0n) patterns.push('square')
      else if (b === 0n && isSq(a) && isSq(-c)) patterns.push('diffsq')
      else patterns.push('trinomial')
    } else {
      // no rational roots: the quadratic stays as one factor once the common factor is out
      factors.push(shiftDown(p, v, k0, cf))
      note = 'irreducible'
    }
  } else if (m >= 3) {
    factors.push(shiftDown(p, v, k0, cf))
    complete = false
    note = 'degree'
  } else if (m === 0) {
    // a single monomial: nothing is left after the common factor
  }

  // Assemble: cf · v^k0 · factors.
  const product = factors.reduce((acc, f) => mul(acc, f), constant(rat(cf, 1n)))
  const withVar = k0 > 0 ? mul(product, pow(variable(v), k0)) : product

  // Group a repeated factor as a square.
  const printed: string[] = []
  for (let i = 0; i < factors.length; i++) {
    const f = factors[i]
    if (isConstant(f)) continue
    if (i + 1 < factors.length && equal(f, factors[i + 1])) {
      printed.push(`\\left(${polyTex(f)}\\right)^{2}`)
      i++
    } else printed.push(factors.length === 1 && f.size === 1 ? polyTex(f) : `\\left(${polyTex(f)}\\right)`)
  }
  const kMul = factors.filter(isConstant).reduce((a, f) => a * constValue(f).n, 1n)
  const totalCf = cf * kMul
  const cfTex = totalCf === 1n ? '' : totalCf === -1n ? '-' : `${totalCf}`
  const varTex = k0 === 0 ? '' : k0 === 1 ? v : `${v}^{${k0}}`
  const tex = `${cfTex}${varTex}${printed.join('')}` || '1'

  return { tex, patterns, complete, note, product: withVar }
}

/** p divided by cf·v^k0: the part left after the common factor is taken out. */
function shiftDown(p: Poly, v: string, k0: number, cf: bigint): Poly {
  const out: Poly = new Map()
  for (const [m, c] of p) {
    const e = new Map(parts(m))
    e.set(v, (e.get(v) ?? 0) - k0)
    out.set(build(e), rat(c.n / cf, 1n))
  }
  return clean(out)
}

export { ratText }
