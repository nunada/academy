/** Trigonometric identities: the numbers and data behind the "Trigonometric Identities" article's widgets.
 *
 *  Four things live here:
 *   - a small parser and evaluator for expressions such as `sin(2x) / (1 + cos(2x))` in degrees, and a tester that compares two of them over
 *     hundreds of angles, with a counterexample, and with a separate verdict for two sides that agree wherever both are defined but are not
 *     defined in the same places (the `tan x = sin x / cos x` kind of difference);
 *   - the catalog of identities the article prints, each as TeX for the page and as an expression for the tester;
 *   - the guided proofs: every line of a proof is an expression, so that a line can be tested against the one before it;
 *   - the exact values of the angles that the sum, difference and half-angle formulas reach (15°, 22.5°, 18°, …), the rotation behind the sum
 *     formula, and the form R sin(x + φ) of a sin x + b cos x.
 *
 *  The checker (tools/check-trigident.mjs) tests all of it against references that do not use it: mpmath and SymPy evaluate the same
 *  expressions at the same angles (SymPy exactly, to decide where an expression is undefined), every catalog entry and every proof line is
 *  tested that way, and the exact values are compared with sin and cos to 55 digits. */

import { cosDeg, sinDeg, tanDeg, toDeg, normalize } from './trigbasic'

/* ------------------------------------------------------------------------------------ expressions */

export type FnName = 'sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot' | 'sqrt' | 'abs'

export type Node =
  | { k: 'num'; v: number }
  | { k: 'var'; n: 'x' | 'y' }
  | { k: 'neg'; a: Node }
  | { k: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
  | { k: 'fn'; f: FnName; a: Node }

export type ParseError = 'empty' | 'char' | 'unknown' | 'paren' | 'argument' | 'end' | 'number' | 'operand'
export type Parsed = { ok: true; node: Node } | { ok: false; error: ParseError; at: number }

type Tok = { t: 'num'; v: number; at: number } | { t: 'name'; n: string; at: number } | { t: 'op'; c: string; at: number }

const NAMES = ['sqrt', 'sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'abs', 'pi', 'x', 'y']
const FUNCS = new Set(['sqrt', 'sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'abs'])

class Fail extends Error {
  constructor(
    public code: ParseError,
    public at: number,
  ) {
    super(code)
  }
}

function tokenize(src: string): Tok[] {
  const s = src.replace(/−/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/°/g, ' ')
  const out: Tok[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) {
      i++
    } else if (/[0-9.,]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.,]/.test(s[j])) j++
      const text = s.slice(i, j).replace(',', '.')
      if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) throw new Fail('number', i)
      out.push({ t: 'num', v: Number(text), at: i })
      i = j
    } else if (/[a-z]/i.test(c)) {
      const name = NAMES.find((n) => s.toLowerCase().startsWith(n, i))
      if (!name) throw new Fail('unknown', i)
      out.push({ t: 'name', n: name, at: i })
      i += name.length
    } else if ('+-*/^()'.includes(c)) {
      out.push({ t: 'op', c, at: i })
      i++
    } else throw new Fail('char', i)
  }
  return out
}

/** Parse an expression in the angle x (and y), in degrees: sin cos tan sec csc cot sqrt abs, + - * / ^, brackets, implicit products such as 2sin(x)cos(x),
 *  a power on a function (sin^2(x)), and a bare argument (sin x, cos 2x). */
export function parseExpr(src: string): Parsed {
  try {
    const toks = tokenize(src)
    if (toks.length === 0) return { ok: false, error: 'empty', at: 0 }
    let p = 0
    const peek = (): Tok | undefined => toks[p]
    const isOp = (c: string): boolean => {
      const t = peek()
      return t !== undefined && t.t === 'op' && t.c === c
    }
    const expect = (c: string): void => {
      if (!isOp(c)) throw new Fail('paren', peek()?.at ?? src.length)
      p++
    }
    const startsAtom = (t: Tok | undefined): boolean => t !== undefined && (t.t === 'num' || t.t === 'name' || (t.t === 'op' && t.c === '('))

    const sum = (): Node => {
      let a = term()
      while (isOp('+') || isOp('-')) {
        const op = (toks[p++] as Tok & { t: 'op' }).c as '+' | '-'
        a = { k: 'bin', op, a, b: term() }
      }
      return a
    }
    const term = (): Node => {
      let a = signed()
      let lastNum = a.k === 'num'
      for (;;) {
        if (isOp('*') || isOp('/')) {
          const op = (toks[p++] as Tok & { t: 'op' }).c as '*' | '/'
          const b = signed()
          a = { k: 'bin', op, a, b }
          lastNum = false
        } else if (startsAtom(peek())) {
          if (lastNum && peek()?.t === 'num') throw new Fail('number', peek()?.at ?? 0)
          const b = power()
          a = { k: 'bin', op: '*', a, b }
          lastNum = b.k === 'num'
        } else return a
      }
    }
    const signed = (): Node => {
      if (isOp('-')) {
        p++
        return { k: 'neg', a: signed() }
      }
      if (isOp('+')) {
        p++
        return signed()
      }
      return power()
    }
    const power = (): Node => {
      const a = atom()
      if (isOp('^')) {
        p++
        return { k: 'bin', op: '^', a, b: signed() }
      }
      return a
    }
    const paren = (): Node => {
      expect('(')
      const e = sum()
      expect(')')
      return e
    }
    /** the power written on a function without brackets is a number: sin^2 x is (sin x)^2, not sin of 2x */
    const exponentNumber = (): Node => {
      const t = peek()
      if (!t || t.t !== 'num') throw new Fail('argument', t?.at ?? src.length)
      p++
      return { k: 'num', v: t.v }
    }
    const monomial = (): Node => {
      // the bare argument of a function: an optional number and an optional x, y or pi
      const t = peek()
      let a: Node | null = null
      if (t && t.t === 'num') {
        p++
        a = { k: 'num', v: t.v }
      }
      const u = peek()
      if (u && u.t === 'name' && (u.n === 'x' || u.n === 'y' || u.n === 'pi')) {
        p++
        const v: Node = u.n === 'pi' ? { k: 'num', v: Math.PI } : { k: 'var', n: u.n }
        a = a ? { k: 'bin', op: '*', a, b: v } : v
      }
      if (!a) throw new Fail('argument', t?.at ?? src.length)
      return a
    }
    const atom = (): Node => {
      const t = peek()
      if (!t) throw new Fail('end', src.length)
      if (t.t === 'num') {
        p++
        return { k: 'num', v: t.v }
      }
      if (t.t === 'op') {
        if (t.c === '(') return paren()
        throw new Fail('operand', t.at)
      }
      p++
      if (t.n === 'x' || t.n === 'y') return { k: 'var', n: t.n }
      if (t.n === 'pi') return { k: 'num', v: Math.PI }
      if (!FUNCS.has(t.n)) throw new Fail('unknown', t.at)
      let exponent: Node | null = null
      if (isOp('^')) {
        p++
        exponent = isOp('(') ? paren() : isOp('-') ? (p++, { k: 'neg', a: exponentNumber() } as Node) : exponentNumber()
      }
      const arg = isOp('(') ? paren() : monomial()
      const call: Node = { k: 'fn', f: t.n as FnName, a: arg }
      return exponent ? { k: 'bin', op: '^', a: call, b: exponent } : call
    }

    const node = sum()
    if (p < toks.length) {
      const rest = toks[p]
      throw new Fail(rest.t === 'op' && rest.c === ')' ? 'paren' : 'end', rest.at)
    }
    return { ok: true, node }
  } catch (e) {
    if (e instanceof Fail) return { ok: false, error: e.code, at: e.at }
    throw e
  }
}

export interface Value {
  v: number
  /** the largest absolute value met on the way: a sum of two huge numbers loses its digits */
  mag: number
}

const finite = (v: number): number => (Number.isFinite(v) ? v : NaN)

/** The value of an expression at x and y degrees; NaN where it is undefined. */
export function evalNode(n: Node, x: number, y = 0): Value {
  switch (n.k) {
    case 'num':
      return { v: n.v, mag: Math.abs(n.v) }
    case 'var': {
      const v = n.n === 'x' ? x : y
      return { v, mag: Math.abs(v) }
    }
    case 'neg': {
      const a = evalNode(n.a, x, y)
      return { v: -a.v, mag: a.mag }
    }
    case 'fn': {
      const a = evalNode(n.a, x, y)
      let v: number
      if (n.f === 'sin') v = sinDeg(a.v)
      else if (n.f === 'cos') v = cosDeg(a.v)
      else if (n.f === 'tan') v = tanDeg(a.v)
      else if (n.f === 'sec') v = cosDeg(a.v) === 0 ? NaN : 1 / cosDeg(a.v)
      else if (n.f === 'csc') v = sinDeg(a.v) === 0 ? NaN : 1 / sinDeg(a.v)
      else if (n.f === 'cot') v = sinDeg(a.v) === 0 ? NaN : cosDeg(a.v) / sinDeg(a.v)
      else if (n.f === 'sqrt') v = a.v < 0 ? NaN : Math.sqrt(a.v)
      else v = Math.abs(a.v)
      v = finite(v)
      return { v, mag: Math.max(a.mag, Math.abs(v)) }
    }
    default: {
      const a = evalNode(n.a, x, y)
      const b = evalNode(n.b, x, y)
      let v: number
      if (n.op === '+') v = a.v + b.v
      else if (n.op === '-') v = a.v - b.v
      else if (n.op === '*') v = a.v * b.v
      else if (n.op === '/') v = b.v === 0 ? NaN : a.v / b.v
      else v = a.v < 0 && !Number.isInteger(b.v) ? NaN : Math.pow(a.v, b.v)
      v = finite(v)
      return { v, mag: Math.max(a.mag, b.mag, Math.abs(v)) }
    }
  }
}

export function usesVar(n: Node, name: 'x' | 'y'): boolean {
  if (n.k === 'var') return n.n === name
  if (n.k === 'num') return false
  if (n.k === 'neg' || n.k === 'fn') return usesVar(n.a, name)
  return usesVar(n.a, name) || usesVar(n.b, name)
}

/* ---------------------------------------------------------------------------------------- tester */

export interface Sample {
  x: number
  y: number
  l: number
  r: number
}
export interface Comparison {
  usesY: boolean
  /** the points where both sides could be evaluated cleanly and were compared */
  compared: number
  /** the points where both sides are undefined */
  bothUndefined: number
  /** the points skipped because a number became so large that the digits are gone */
  skipped: number
  mismatches: number
  /** the first point where the two sides are different */
  counterexample: Sample | null
  /** the first point where exactly one side is undefined */
  domainGap: (Sample & { side: 'left' | 'right' }) | null
  verdict: 'identity' | 'domain' | 'not' | 'nothing'
}

const LARGE = 1e6
const close = (l: number, r: number): boolean => Math.abs(l - r) <= 1e-9 * Math.max(1, Math.abs(l), Math.abs(r))

/** A fixed sequence of "random" numbers, so that the same two expressions always give the same verdict. */
function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Compare two expressions at every whole degree from 0° to 359° (y = 25° when they use y) and at hundreds of other angles. */
export function compareNodes(a: Node, b: Node): Comparison {
  const usesY = usesVar(a, 'y') || usesVar(b, 'y')
  const pts: [number, number][] = []
  for (let x = 0; x < 360; x++) pts.push([x, 25])
  if (usesY) for (let y = 0; y < 360; y++) pts.push([40, y])
  // just beside the angles where tan, sec, csc and cot blow up: a sum of huge numbers loses its digits there, which the `mag` test skips
  for (const e of [0.00001, 89.99999, 90.00001, 179.99999, 180.00001, 269.99999, 270.00001, 359.99999]) pts.push([e, 25])
  const rnd = lcg(12345)
  for (let i = 0; i < 400; i++) pts.push([-720 + rnd() * 1440, usesY ? -720 + rnd() * 1440 : 25])
  const out: Comparison = { usesY, compared: 0, bothUndefined: 0, skipped: 0, mismatches: 0, counterexample: null, domainGap: null, verdict: 'nothing' }
  for (const [x, y] of pts) {
    const l = evalNode(a, x, y)
    const r = evalNode(b, x, y)
    const ln = Number.isNaN(l.v)
    const rn = Number.isNaN(r.v)
    if (ln && rn) out.bothUndefined++
    else if (ln || rn) {
      if (!out.domainGap) out.domainGap = { x, y, l: l.v, r: r.v, side: ln ? 'left' : 'right' }
    } else if (l.mag > LARGE || r.mag > LARGE) out.skipped++
    else {
      out.compared++
      if (!close(l.v, r.v)) {
        out.mismatches++
        if (!out.counterexample) out.counterexample = { x, y, l: l.v, r: r.v }
      }
    }
  }
  out.verdict = out.mismatches > 0 ? 'not' : out.compared === 0 ? 'nothing' : out.domainGap ? 'domain' : 'identity'
  return out
}

export function compareSources(left: string, right: string): { error: { side: 'left' | 'right'; error: ParseError; at: number } } | { result: Comparison; a: Node; b: Node } {
  const a = parseExpr(left)
  if (!a.ok) return { error: { side: 'left', error: a.error, at: a.at } }
  const b = parseExpr(right)
  if (!b.ok) return { error: { side: 'right', error: b.error, at: b.at } }
  return { result: compareNodes(a.node, b.node), a: a.node, b: b.node }
}

/* ---------------------------------------------------------------------------------------- catalog */

export type Group = 'reciprocal' | 'quotient' | 'pythagorean' | 'cofunction' | 'parity' | 'shift' | 'sum' | 'double' | 'triple' | 'half' | 'power' | 'product' | 'sumproduct'

export interface Ident {
  id: string
  group: Group
  /** TeX of the two sides, for the page */
  lhs: string
  rhs: string
  /** the same two sides as expressions, for the tester */
  le: string
  re: string
  /** true when the sides agree wherever both are defined, but one is undefined somewhere the other is not */
  domain?: boolean
}

const I = (id: string, group: Group, lhs: string, rhs: string, le: string, re: string, domain = false): Ident => ({ id, group, lhs, rhs, le, re, domain: domain || undefined })

export const CATALOG: Ident[] = [
  I('csc', 'reciprocal', '\\csc x', '\\frac{1}{\\sin x}', 'csc(x)', '1/sin(x)'),
  I('sec', 'reciprocal', '\\sec x', '\\frac{1}{\\cos x}', 'sec(x)', '1/cos(x)'),
  I('cot-reciprocal', 'reciprocal', '\\cot x', '\\frac{1}{\\tan x}', 'cot(x)', '1/tan(x)', true),
  I('tan-quotient', 'quotient', '\\tan x', '\\frac{\\sin x}{\\cos x}', 'tan(x)', 'sin(x)/cos(x)'),
  I('cot-quotient', 'quotient', '\\cot x', '\\frac{\\cos x}{\\sin x}', 'cot(x)', 'cos(x)/sin(x)'),
  I('pythagorean', 'pythagorean', '\\sin^2 x+\\cos^2 x', '1', 'sin(x)^2+cos(x)^2', '1'),
  I('pythagorean-tan', 'pythagorean', '1+\\tan^2 x', '\\sec^2 x', '1+tan(x)^2', 'sec(x)^2'),
  I('pythagorean-cot', 'pythagorean', '1+\\cot^2 x', '\\csc^2 x', '1+cot(x)^2', 'csc(x)^2'),
  I('cofunction-sin', 'cofunction', '\\sin(90^\\circ-x)', '\\cos x', 'sin(90-x)', 'cos(x)'),
  I('cofunction-cos', 'cofunction', '\\cos(90^\\circ-x)', '\\sin x', 'cos(90-x)', 'sin(x)'),
  I('cofunction-tan', 'cofunction', '\\tan(90^\\circ-x)', '\\cot x', 'tan(90-x)', 'cot(x)'),
  I('parity-sin', 'parity', '\\sin(-x)', '-\\sin x', 'sin(-x)', '-sin(x)'),
  I('parity-cos', 'parity', '\\cos(-x)', '\\cos x', 'cos(-x)', 'cos(x)'),
  I('parity-tan', 'parity', '\\tan(-x)', '-\\tan x', 'tan(-x)', '-tan(x)'),
  I('shift-sin-180', 'shift', '\\sin(180^\\circ-x)', '\\sin x', 'sin(180-x)', 'sin(x)'),
  I('shift-cos-180', 'shift', '\\cos(180^\\circ-x)', '-\\cos x', 'cos(180-x)', '-cos(x)'),
  I('shift-sin-plus-180', 'shift', '\\sin(x+180^\\circ)', '-\\sin x', 'sin(x+180)', '-sin(x)'),
  I('shift-cos-plus-180', 'shift', '\\cos(x+180^\\circ)', '-\\cos x', 'cos(x+180)', '-cos(x)'),
  I('shift-tan-plus-180', 'shift', '\\tan(x+180^\\circ)', '\\tan x', 'tan(x+180)', 'tan(x)'),
  I('shift-sin-plus-90', 'shift', '\\sin(x+90^\\circ)', '\\cos x', 'sin(x+90)', 'cos(x)'),
  I('shift-cos-plus-90', 'shift', '\\cos(x+90^\\circ)', '-\\sin x', 'cos(x+90)', '-sin(x)'),
  I('sum-sin', 'sum', '\\sin(x+y)', '\\sin x\\cos y+\\cos x\\sin y', 'sin(x+y)', 'sin(x)*cos(y)+cos(x)*sin(y)'),
  I('diff-sin', 'sum', '\\sin(x-y)', '\\sin x\\cos y-\\cos x\\sin y', 'sin(x-y)', 'sin(x)*cos(y)-cos(x)*sin(y)'),
  I('sum-cos', 'sum', '\\cos(x+y)', '\\cos x\\cos y-\\sin x\\sin y', 'cos(x+y)', 'cos(x)*cos(y)-sin(x)*sin(y)'),
  I('diff-cos', 'sum', '\\cos(x-y)', '\\cos x\\cos y+\\sin x\\sin y', 'cos(x-y)', 'cos(x)*cos(y)+sin(x)*sin(y)'),
  I('sum-tan', 'sum', '\\tan(x+y)', '\\frac{\\tan x+\\tan y}{1-\\tan x\\tan y}', 'tan(x+y)', '(tan(x)+tan(y))/(1-tan(x)*tan(y))', true),
  I('diff-tan', 'sum', '\\tan(x-y)', '\\frac{\\tan x-\\tan y}{1+\\tan x\\tan y}', 'tan(x-y)', '(tan(x)-tan(y))/(1+tan(x)*tan(y))', true),
  I('double-sin', 'double', '\\sin 2x', '2\\sin x\\cos x', 'sin(2*x)', '2*sin(x)*cos(x)'),
  I('double-cos', 'double', '\\cos 2x', '\\cos^2 x-\\sin^2 x', 'cos(2*x)', 'cos(x)^2-sin(x)^2'),
  I('double-cos-cos', 'double', '\\cos 2x', '2\\cos^2 x-1', 'cos(2*x)', '2*cos(x)^2-1'),
  I('double-cos-sin', 'double', '\\cos 2x', '1-2\\sin^2 x', 'cos(2*x)', '1-2*sin(x)^2'),
  I('double-tan', 'double', '\\tan 2x', '\\frac{2\\tan x}{1-\\tan^2 x}', 'tan(2*x)', '2*tan(x)/(1-tan(x)^2)', true),
  I('triple-sin', 'triple', '\\sin 3x', '3\\sin x-4\\sin^3 x', 'sin(3*x)', '3*sin(x)-4*sin(x)^3'),
  I('triple-cos', 'triple', '\\cos 3x', '4\\cos^3 x-3\\cos x', 'cos(3*x)', '4*cos(x)^3-3*cos(x)'),
  I('half-sin', 'half', '\\sin^2\\frac{x}{2}', '\\frac{1-\\cos x}{2}', 'sin(x/2)^2', '(1-cos(x))/2'),
  I('half-cos', 'half', '\\cos^2\\frac{x}{2}', '\\frac{1+\\cos x}{2}', 'cos(x/2)^2', '(1+cos(x))/2'),
  I('half-tan-plus', 'half', '\\tan\\frac{x}{2}', '\\frac{\\sin x}{1+\\cos x}', 'tan(x/2)', 'sin(x)/(1+cos(x))'),
  I('half-tan-minus', 'half', '\\tan\\frac{x}{2}', '\\frac{1-\\cos x}{\\sin x}', 'tan(x/2)', '(1-cos(x))/sin(x)', true),
  I('power-sin', 'power', '\\sin^2 x', '\\frac{1-\\cos 2x}{2}', 'sin(x)^2', '(1-cos(2*x))/2'),
  I('power-cos', 'power', '\\cos^2 x', '\\frac{1+\\cos 2x}{2}', 'cos(x)^2', '(1+cos(2*x))/2'),
  I('power-both', 'power', '\\sin^2 x\\cos^2 x', '\\frac{1-\\cos 4x}{8}', 'sin(x)^2*cos(x)^2', '(1-cos(4*x))/8'),
  I('product-sin-cos', 'product', '\\sin x\\cos y', '\\frac{\\sin(x+y)+\\sin(x-y)}{2}', 'sin(x)*cos(y)', '(sin(x+y)+sin(x-y))/2'),
  I('product-cos-sin', 'product', '\\cos x\\sin y', '\\frac{\\sin(x+y)-\\sin(x-y)}{2}', 'cos(x)*sin(y)', '(sin(x+y)-sin(x-y))/2'),
  I('product-cos-cos', 'product', '\\cos x\\cos y', '\\frac{\\cos(x-y)+\\cos(x+y)}{2}', 'cos(x)*cos(y)', '(cos(x-y)+cos(x+y))/2'),
  I('product-sin-sin', 'product', '\\sin x\\sin y', '\\frac{\\cos(x-y)-\\cos(x+y)}{2}', 'sin(x)*sin(y)', '(cos(x-y)-cos(x+y))/2'),
  I('sumprod-sin-plus', 'sumproduct', '\\sin x+\\sin y', '2\\sin\\frac{x+y}{2}\\cos\\frac{x-y}{2}', 'sin(x)+sin(y)', '2*sin((x+y)/2)*cos((x-y)/2)'),
  I('sumprod-sin-minus', 'sumproduct', '\\sin x-\\sin y', '2\\cos\\frac{x+y}{2}\\sin\\frac{x-y}{2}', 'sin(x)-sin(y)', '2*cos((x+y)/2)*sin((x-y)/2)'),
  I('sumprod-cos-plus', 'sumproduct', '\\cos x+\\cos y', '2\\cos\\frac{x+y}{2}\\cos\\frac{x-y}{2}', 'cos(x)+cos(y)', '2*cos((x+y)/2)*cos((x-y)/2)'),
  I('sumprod-cos-minus', 'sumproduct', '\\cos x-\\cos y', '-2\\sin\\frac{x+y}{2}\\sin\\frac{x-y}{2}', 'cos(x)-cos(y)', '-2*sin((x+y)/2)*sin((x-y)/2)'),
]

/** The tempting formulas that are false, with the reason, for the tester's presets and the article's list of mistakes. */
export const FALSE_CLAIMS: { lhs: string; rhs: string; le: string; re: string }[] = [
  { lhs: '\\sin(x+y)', rhs: '\\sin x+\\sin y', le: 'sin(x+y)', re: 'sin(x)+sin(y)' },
  { lhs: '\\sin 2x', rhs: '2\\sin x', le: 'sin(2*x)', re: '2*sin(x)' },
  { lhs: '\\cos 2x', rhs: '2\\cos x', le: 'cos(2*x)', re: '2*cos(x)' },
  { lhs: '\\sin x+\\cos x', rhs: '1', le: 'sin(x)+cos(x)', re: '1' },
  { lhs: '\\sin^2 x', rhs: '\\sin x^2', le: 'sin(x)^2', re: 'sin(x^2)' },
  { lhs: '\\tan(x+y)', rhs: '\\tan x+\\tan y', le: 'tan(x+y)', re: 'tan(x)+tan(y)' },
  { lhs: '\\sin\\frac{x}{2}', rhs: '\\frac{\\sin x}{2}', le: 'sin(x/2)', re: 'sin(x)/2' },
  { lhs: '\\cos(x-y)', rhs: '\\cos x-\\cos y', le: 'cos(x-y)', re: 'cos(x)-cos(y)' },
  { lhs: '\\sqrt{\\sin^2 x}', rhs: '\\sin x', le: 'sqrt(sin(x)^2)', re: 'sin(x)' },
]

/* ----------------------------------------------------------------------------------------- proofs */

export type Reason = 'definition' | 'quotient' | 'reciprocal' | 'pythagorean' | 'common' | 'expand' | 'factor' | 'cancel' | 'squares' | 'sum' | 'double' | 'rewrite' | 'half' | 'multiply' | 'combine'

export interface ProofStep {
  /** the line as TeX, and as an expression for the tester */
  tex: string
  expr: string
  reason: Reason | null
}
export interface Proof {
  id: string
  /** TeX of the claim, and which side the proof starts from */
  lhs: string
  rhs: string
  start: 'lhs' | 'rhs'
  steps: ProofStep[]
}

const S = (tex: string, expr: string, reason: Reason | null): ProofStep => ({ tex, expr, reason })

export const PROOFS: Proof[] = [
  {
    id: 'tan-cot',
    lhs: '\\tan x+\\cot x',
    rhs: '\\sec x\\csc x',
    start: 'lhs',
    steps: [
      S('\\tan x+\\cot x', 'tan(x)+cot(x)', null),
      S('\\frac{\\sin x}{\\cos x}+\\frac{\\cos x}{\\sin x}', 'sin(x)/cos(x)+cos(x)/sin(x)', 'quotient'),
      S('\\frac{\\sin^2 x+\\cos^2 x}{\\sin x\\cos x}', '(sin(x)^2+cos(x)^2)/(sin(x)*cos(x))', 'common'),
      S('\\frac{1}{\\sin x\\cos x}', '1/(sin(x)*cos(x))', 'pythagorean'),
      S('\\sec x\\csc x', 'sec(x)*csc(x)', 'reciprocal'),
    ],
  },
  {
    id: 'one-minus-cos',
    lhs: '(1-\\cos x)(1+\\cos x)',
    rhs: '\\sin^2 x',
    start: 'lhs',
    steps: [
      S('(1-\\cos x)(1+\\cos x)', '(1-cos(x))*(1+cos(x))', null),
      S('1-\\cos^2 x', '1-cos(x)^2', 'squares'),
      S('\\sin^2 x', 'sin(x)^2', 'pythagorean'),
    ],
  },
  {
    id: 'sec-minus-cos',
    lhs: '\\sec x-\\cos x',
    rhs: '\\sin x\\tan x',
    start: 'lhs',
    steps: [
      S('\\sec x-\\cos x', 'sec(x)-cos(x)', null),
      S('\\frac{1}{\\cos x}-\\cos x', '1/cos(x)-cos(x)', 'reciprocal'),
      S('\\frac{1-\\cos^2 x}{\\cos x}', '(1-cos(x)^2)/cos(x)', 'common'),
      S('\\frac{\\sin^2 x}{\\cos x}', 'sin(x)^2/cos(x)', 'pythagorean'),
      S('\\sin x\\cdot\\frac{\\sin x}{\\cos x}', 'sin(x)*(sin(x)/cos(x))', 'rewrite'),
      S('\\sin x\\tan x', 'sin(x)*tan(x)', 'quotient'),
    ],
  },
  {
    id: 'fourth-powers',
    lhs: '\\cos^4 x-\\sin^4 x',
    rhs: '\\cos 2x',
    start: 'lhs',
    steps: [
      S('\\cos^4 x-\\sin^4 x', 'cos(x)^4-sin(x)^4', null),
      S('(\\cos^2 x-\\sin^2 x)(\\cos^2 x+\\sin^2 x)', '(cos(x)^2-sin(x)^2)*(cos(x)^2+sin(x)^2)', 'squares'),
      S('(\\cos^2 x-\\sin^2 x)\\cdot1', '(cos(x)^2-sin(x)^2)*1', 'pythagorean'),
      S('\\cos 2x', 'cos(2*x)', 'double'),
    ],
  },
  {
    id: 'square-of-sum',
    lhs: '(\\sin x+\\cos x)^2',
    rhs: '1+\\sin 2x',
    start: 'lhs',
    steps: [
      S('(\\sin x+\\cos x)^2', '(sin(x)+cos(x))^2', null),
      S('\\sin^2 x+2\\sin x\\cos x+\\cos^2 x', 'sin(x)^2+2*sin(x)*cos(x)+cos(x)^2', 'expand'),
      S('1+2\\sin x\\cos x', '1+2*sin(x)*cos(x)', 'pythagorean'),
      S('1+\\sin 2x', '1+sin(2*x)', 'double'),
    ],
  },
  {
    id: 'two-fractions',
    lhs: '\\frac{\\sin x}{1+\\cos x}+\\frac{1+\\cos x}{\\sin x}',
    rhs: '2\\csc x',
    start: 'lhs',
    steps: [
      S('\\frac{\\sin x}{1+\\cos x}+\\frac{1+\\cos x}{\\sin x}', 'sin(x)/(1+cos(x))+(1+cos(x))/sin(x)', null),
      S('\\frac{\\sin^2 x+(1+\\cos x)^2}{\\sin x\\,(1+\\cos x)}', '(sin(x)^2+(1+cos(x))^2)/(sin(x)*(1+cos(x)))', 'common'),
      S('\\frac{\\sin^2 x+1+2\\cos x+\\cos^2 x}{\\sin x\\,(1+\\cos x)}', '(sin(x)^2+1+2*cos(x)+cos(x)^2)/(sin(x)*(1+cos(x)))', 'expand'),
      S('\\frac{2+2\\cos x}{\\sin x\\,(1+\\cos x)}', '(2+2*cos(x))/(sin(x)*(1+cos(x)))', 'pythagorean'),
      S('\\frac{2(1+\\cos x)}{\\sin x\\,(1+\\cos x)}', '2*(1+cos(x))/(sin(x)*(1+cos(x)))', 'factor'),
      S('\\frac{2}{\\sin x}', '2/sin(x)', 'cancel'),
      S('2\\csc x', '2*csc(x)', 'reciprocal'),
    ],
  },
  {
    id: 'cos-double-tan',
    lhs: '\\cos 2x',
    rhs: '\\frac{1-\\tan^2 x}{1+\\tan^2 x}',
    start: 'rhs',
    steps: [
      S('\\frac{1-\\tan^2 x}{1+\\tan^2 x}', '(1-tan(x)^2)/(1+tan(x)^2)', null),
      S('\\frac{\\cos^2 x\\,(1-\\tan^2 x)}{\\cos^2 x\\,(1+\\tan^2 x)}', '(cos(x)^2*(1-tan(x)^2))/(cos(x)^2*(1+tan(x)^2))', 'multiply'),
      S('\\frac{\\cos^2 x-\\sin^2 x}{\\cos^2 x+\\sin^2 x}', '(cos(x)^2-sin(x)^2)/(cos(x)^2+sin(x)^2)', 'quotient'),
      S('\\frac{\\cos^2 x-\\sin^2 x}{1}', '(cos(x)^2-sin(x)^2)/1', 'pythagorean'),
      S('\\cos 2x', 'cos(2*x)', 'double'),
    ],
  },
  {
    id: 'triple-sine',
    lhs: '\\sin 3x',
    rhs: '3\\sin x-4\\sin^3 x',
    start: 'lhs',
    steps: [
      S('\\sin 3x', 'sin(3*x)', null),
      S('\\sin(2x+x)', 'sin(2*x+x)', 'rewrite'),
      S('\\sin 2x\\cos x+\\cos 2x\\sin x', 'sin(2*x)*cos(x)+cos(2*x)*sin(x)', 'sum'),
      S('2\\sin x\\cos^2 x+(1-2\\sin^2 x)\\sin x', '2*sin(x)*cos(x)^2+(1-2*sin(x)^2)*sin(x)', 'double'),
      S('2\\sin x\\,(1-\\sin^2 x)+\\sin x-2\\sin^3 x', '2*sin(x)*(1-sin(x)^2)+sin(x)-2*sin(x)^3', 'pythagorean'),
      S('3\\sin x-4\\sin^3 x', '3*sin(x)-4*sin(x)^3', 'combine'),
    ],
  },
  {
    id: 'half-tangent',
    lhs: '\\tan\\frac{x}{2}',
    rhs: '\\frac{\\sin x}{1+\\cos x}',
    start: 'rhs',
    steps: [
      S('\\frac{\\sin x}{1+\\cos x}', 'sin(x)/(1+cos(x))', null),
      S('\\frac{2\\sin\\frac{x}{2}\\cos\\frac{x}{2}}{1+\\left(2\\cos^2\\frac{x}{2}-1\\right)}', '(2*sin(x/2)*cos(x/2))/(1+(2*cos(x/2)^2-1))', 'double'),
      S('\\frac{2\\sin\\frac{x}{2}\\cos\\frac{x}{2}}{2\\cos^2\\frac{x}{2}}', '(2*sin(x/2)*cos(x/2))/(2*cos(x/2)^2)', 'combine'),
      S('\\frac{\\sin\\frac{x}{2}}{\\cos\\frac{x}{2}}', 'sin(x/2)/cos(x/2)', 'cancel'),
      S('\\tan\\frac{x}{2}', 'tan(x/2)', 'quotient'),
    ],
  },
]

/* ------------------------------------------------------------------------------------ exact values */

export interface ExactAngle {
  deg: number
  /** TeX and expression (with sqrt) of the sine, cosine and tangent */
  sin: { tex: string; expr: string }
  cos: { tex: string; expr: string }
  tan: { tex: string; expr: string }
  /** how it is reached */
  via: 'difference' | 'sum' | 'half' | 'pentagon'
  /** the formula and the two angles used, for the derivation */
  from: string
}

const E = (tex: string, expr: string): { tex: string; expr: string } => ({ tex, expr })

export const EXACT_ANGLES: ExactAngle[] = [
  { deg: 15, via: 'difference', from: '45^\\circ-30^\\circ', sin: E('\\frac{\\sqrt6-\\sqrt2}{4}', '(sqrt(6)-sqrt(2))/4'), cos: E('\\frac{\\sqrt6+\\sqrt2}{4}', '(sqrt(6)+sqrt(2))/4'), tan: E('2-\\sqrt3', '2-sqrt(3)') },
  { deg: 75, via: 'sum', from: '45^\\circ+30^\\circ', sin: E('\\frac{\\sqrt6+\\sqrt2}{4}', '(sqrt(6)+sqrt(2))/4'), cos: E('\\frac{\\sqrt6-\\sqrt2}{4}', '(sqrt(6)-sqrt(2))/4'), tan: E('2+\\sqrt3', '2+sqrt(3)') },
  { deg: 105, via: 'sum', from: '60^\\circ+45^\\circ', sin: E('\\frac{\\sqrt6+\\sqrt2}{4}', '(sqrt(6)+sqrt(2))/4'), cos: E('\\frac{\\sqrt2-\\sqrt6}{4}', '(sqrt(2)-sqrt(6))/4'), tan: E('-2-\\sqrt3', '-2-sqrt(3)') },
  { deg: 165, via: 'difference', from: '180^\\circ-15^\\circ', sin: E('\\frac{\\sqrt6-\\sqrt2}{4}', '(sqrt(6)-sqrt(2))/4'), cos: E('-\\frac{\\sqrt6+\\sqrt2}{4}', '-(sqrt(6)+sqrt(2))/4'), tan: E('\\sqrt3-2', 'sqrt(3)-2') },
  { deg: 22.5, via: 'half', from: '\\frac{45^\\circ}{2}', sin: E('\\frac{\\sqrt{2-\\sqrt2}}{2}', 'sqrt(2-sqrt(2))/2'), cos: E('\\frac{\\sqrt{2+\\sqrt2}}{2}', 'sqrt(2+sqrt(2))/2'), tan: E('\\sqrt2-1', 'sqrt(2)-1') },
  { deg: 67.5, via: 'half', from: '\\frac{135^\\circ}{2}', sin: E('\\frac{\\sqrt{2+\\sqrt2}}{2}', 'sqrt(2+sqrt(2))/2'), cos: E('\\frac{\\sqrt{2-\\sqrt2}}{2}', 'sqrt(2-sqrt(2))/2'), tan: E('\\sqrt2+1', 'sqrt(2)+1') },
  { deg: 18, via: 'pentagon', from: '\\frac{90^\\circ}{5}', sin: E('\\frac{\\sqrt5-1}{4}', '(sqrt(5)-1)/4'), cos: E('\\frac{\\sqrt{10+2\\sqrt5}}{4}', 'sqrt(10+2*sqrt(5))/4'), tan: E('\\frac{\\sqrt{25-10\\sqrt5}}{5}', 'sqrt(25-10*sqrt(5))/5') },
  { deg: 36, via: 'pentagon', from: '\\frac{180^\\circ}{5}', sin: E('\\frac{\\sqrt{10-2\\sqrt5}}{4}', 'sqrt(10-2*sqrt(5))/4'), cos: E('\\frac{1+\\sqrt5}{4}', '(1+sqrt(5))/4'), tan: E('\\sqrt{5-2\\sqrt5}', 'sqrt(5-2*sqrt(5))') },
  { deg: 54, via: 'pentagon', from: '90^\\circ-36^\\circ', sin: E('\\frac{1+\\sqrt5}{4}', '(1+sqrt(5))/4'), cos: E('\\frac{\\sqrt{10-2\\sqrt5}}{4}', 'sqrt(10-2*sqrt(5))/4'), tan: E('\\frac{\\sqrt{25+10\\sqrt5}}{5}', 'sqrt(25+10*sqrt(5))/5') },
  { deg: 72, via: 'pentagon', from: '\\frac{360^\\circ}{5}', sin: E('\\frac{\\sqrt{10+2\\sqrt5}}{4}', 'sqrt(10+2*sqrt(5))/4'), cos: E('\\frac{\\sqrt5-1}{4}', '(sqrt(5)-1)/4'), tan: E('\\sqrt{5+2\\sqrt5}', 'sqrt(5+2*sqrt(5))') },
]

/** The number an exact-value expression stands for, through the same parser as the tester. */
export function exprValue(src: string): number {
  const p = parseExpr(src)
  return p.ok ? evalNode(p.node, 0, 0).v : NaN
}

/* ------------------------------------------------------------------------- the rotation behind it */

export interface Rotation {
  /** the point at x, and the point at y, as (cos, sin) */
  cx: number
  sx: number
  cy: number
  sy: number
  /** the four products of the sum formulas */
  cxcy: number
  sxsy: number
  sxcy: number
  cxsy: number
  /** the point at x + y two ways: by the products, and by the functions of x + y */
  viaProducts: { cos: number; sin: number }
  direct: { cos: number; sin: number }
  /** the same for the difference x − y */
  viaProductsDiff: { cos: number; sin: number }
  directDiff: { cos: number; sin: number }
}

/** Turning the point at x through y: its new coordinates are made of the four products of cos and sin, which is the sum formula. */
export function rotation(x: number, y: number): Rotation {
  const cx = cosDeg(x)
  const sx = sinDeg(x)
  const cy = cosDeg(y)
  const sy = sinDeg(y)
  return {
    cx,
    sx,
    cy,
    sy,
    cxcy: cx * cy,
    sxsy: sx * sy,
    sxcy: sx * cy,
    cxsy: cx * sy,
    viaProducts: { cos: cx * cy - sx * sy, sin: sx * cy + cx * sy },
    direct: { cos: cosDeg(x + y), sin: sinDeg(x + y) },
    viaProductsDiff: { cos: cx * cy + sx * sy, sin: sx * cy - cx * sy },
    directDiff: { cos: cosDeg(x - y), sin: sinDeg(x - y) },
  }
}

/* --------------------------------------------------------------------------- R sin(x + φ) */

export interface Harmonic {
  /** a sin x + b cos x = R sin(x + phi) = R cos(x − alpha) */
  R: number
  phi: number
  alpha: number
}

/** The single-wave form of a sin x + b cos x: amplitude R = √(a² + b²) and the shifts φ = atan2(b, a) and α = atan2(a, b), in degrees. Null when a = b = 0. */
export function harmonic(a: number, b: number): Harmonic | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || (a === 0 && b === 0)) return null
  return { R: Math.hypot(a, b), phi: toDeg(Math.atan2(b, a)), alpha: toDeg(Math.atan2(a, b)) }
}

/** All the angles x in [0°, 360°) with a sin x + b cos x = c, in increasing order, to nine decimals. */
export function solveHarmonic(a: number, b: number, c: number): number[] {
  const h = harmonic(a, b)
  if (!h || !Number.isFinite(c) || Math.abs(c) > h.R * (1 + 1e-12)) return []
  const k = Math.max(-1, Math.min(1, c / h.R))
  const base = toDeg(Math.asin(k))
  const out: number[] = []
  for (const u of [base, 180 - base]) {
    let x = Math.round(normalize(u - h.phi) * 1e9) / 1e9
    if (x >= 360) x = 0
    if (!out.includes(x)) out.push(x)
  }
  return out.sort((p, q) => p - q)
}

/** The value of a sin x + b cos x. */
export const waveSum = (a: number, b: number, x: number): number => a * sinDeg(x) + b * cosDeg(x)

