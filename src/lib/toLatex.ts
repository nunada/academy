/** A typed expression, tidied into LaTeX for `Tex` to show alongside it —
 *  "a*(x-h)^2+k" next to "a(x-h)² + k", so a learner sees the same equation
 *  a textbook would set, not just the plain-text form a keyboard forces.
 *
 *  This mirrors `expr.ts`'s own grammar closely (same precedence, same
 *  `readName` shrink rule) rather than reusing it, because `expr.ts`
 *  evaluates as it parses — it never builds a tree — and grading code
 *  elsewhere depends on that staying exactly as it is. Building a small,
 *  separate parser here that produces a tree instead of a number is the
 *  lower-risk way to get one, at the cost of the two staying in sync by
 *  hand if the grammar ever grows.
 *
 *  Only emits LaTeX `tex.ts` actually understands (see its own doc comment
 *  for the supported subset) — every named function, known or not, goes
 *  through `\operatorname{}`, which `tex.ts` renders generically, rather
 *  than risking a command it doesn't recognize.
 */

type Node =
  | { t: 'num'; v: string }
  | { t: 'var'; name: string }
  | { t: 'const'; sym: string }
  | { t: 'call'; name: string; arg: Node }
  | { t: 'sqrt'; arg: Node }
  | { t: 'abs'; arg: Node }
  | { t: 'add'; a: Node; b: Node }
  | { t: 'sub'; a: Node; b: Node }
  | { t: 'mul'; a: Node; b: Node; dot: boolean }
  | { t: 'div'; a: Node; b: Node }
  | { t: 'pow'; a: Node; b: Node }
  | { t: 'neg'; a: Node }

interface S {
  src: string
  i: number
  known: Set<string>
}

const ws = (s: S) => {
  while (s.src[s.i] === ' ') s.i++
}

function startsValue(s: S): boolean {
  ws(s)
  const c = s.src[s.i]
  return c !== undefined && /[0-9(.√πa-z]/.test(c)
}

function readName(s: S): string {
  const word = /^[a-zπ][a-z0-9π]*/.exec(s.src.slice(s.i))
  if (!word) return ''
  let name = word[0]
  while (name.length > 1) {
    if (s.known.has(name)) break
    name = name.slice(0, -1)
  }
  s.i += name.length
  return name
}

function parseExpr(s: S): Node {
  let node = parseTerm(s)
  for (;;) {
    ws(s)
    const c = s.src[s.i]
    if (c === '+' || c === '-') {
      s.i++
      const rhs = parseTerm(s)
      node = c === '+' ? { t: 'add', a: node, b: rhs } : { t: 'sub', a: node, b: rhs }
    } else return node
  }
}

function parseTerm(s: S): Node {
  let node = parsePower(s)
  for (;;) {
    ws(s)
    const c = s.src[s.i]
    if (c === '*' || c === '×' || c === '⋅' || c === '·') {
      s.i++
      node = { t: 'mul', a: node, b: parsePower(s), dot: true }
    } else if (c === '/' || c === '÷' || c === ':') {
      s.i++
      node = { t: 'div', a: node, b: parsePower(s) }
    } else if (startsValue(s) && !/[0-9.]/.test(s.src[s.i])) {
      node = { t: 'mul', a: node, b: parsePower(s), dot: false }
    } else return node
  }
}

function parsePower(s: S): Node {
  const base = parseUnary(s)
  ws(s)
  if (s.src[s.i] === '^') {
    s.i++
    return { t: 'pow', a: base, b: parsePower(s) }
  }
  return base
}

function parseUnary(s: S): Node {
  ws(s)
  if (s.src[s.i] === '-') {
    s.i++
    return { t: 'neg', a: parsePower(s) }
  }
  if (s.src[s.i] === '+') {
    s.i++
    return parsePower(s)
  }
  return parsePrimary(s)
}

function parsePrimary(s: S): Node {
  ws(s)
  const c = s.src[s.i]
  if (c === undefined) throw new Error('empty')

  if (c === '(') {
    s.i++
    const v = parseExpr(s)
    ws(s)
    if (s.src[s.i] !== ')') throw new Error('unclosed')
    s.i++
    return v
  }
  if (c === '|') {
    s.i++
    const v = parseExpr(s)
    ws(s)
    if (s.src[s.i] !== '|') throw new Error('unclosed')
    s.i++
    return { t: 'abs', arg: v }
  }
  if (c === '√') {
    s.i++
    return { t: 'sqrt', arg: parseUnary(s) }
  }
  if (/[0-9.]/.test(c)) {
    const m = /^[0-9]*\.?[0-9]*/.exec(s.src.slice(s.i))
    const lit = m?.[0] ?? ''
    if (lit === '' || lit === '.') throw new Error('number')
    s.i += lit.length
    return { t: 'num', v: lit }
  }

  const name = readName(s)
  if (name) {
    if (name === 'pi' || name === 'π') return { t: 'const', sym: '\\pi' }
    if (name === 'e') return { t: 'const', sym: 'e' }
    if (name === 'sqrt' || name === 'akar') return { t: 'sqrt', arg: parseUnary(s) }
    if (name === 'abs') return { t: 'abs', arg: parseUnary(s) }
    if (s.known.has(name)) return { t: 'call', name, arg: parseUnary(s) }
    return { t: 'var', name }
  }
  throw new Error('unexpected ' + c)
}

/* --------------------------------------------------------------- render */

const ATOM = 5
const POW = 4
const NEG = 3
const MUL = 2
const ADD = 1

function prec(n: Node): number {
  switch (n.t) {
    case 'add':
    case 'sub':
      return ADD
    case 'mul':
    case 'div':
      return MUL
    case 'neg':
      return NEG
    case 'pow':
      return POW
    default:
      return ATOM
  }
}

/** `\left(...\right)` around a child only when its own precedence would
 *  otherwise read wrong in this position — never around a `div`/exponent,
 *  since the fraction bar and the `{}` already group those unambiguously. */
function wrap(n: Node, minPrec: number): string {
  const inner = render(n)
  return prec(n) < minPrec ? `\\left(${inner}\\right)` : inner
}

function render(n: Node): string {
  switch (n.t) {
    case 'num':
      return n.v
    case 'var':
      return n.name
    case 'const':
      return n.sym
    case 'sqrt':
      return `\\sqrt{${render(n.arg)}}`
    case 'abs':
      return `\\left|${render(n.arg)}\\right|`
    case 'call':
      return `\\operatorname{${n.name}}\\left(${render(n.arg)}\\right)`
    case 'add':
      return `${wrap(n.a, ADD)} + ${wrap(n.b, ADD + 1)}`
    case 'sub':
      return `${wrap(n.a, ADD)} - ${wrap(n.b, ADD + 1)}`
    case 'mul':
      return n.dot ? `${wrap(n.a, MUL)} \\cdot ${wrap(n.b, MUL + 1)}` : `${wrap(n.a, MUL)}${wrap(n.b, MUL + 1)}`
    case 'div':
      return `\\frac{${render(n.a)}}{${render(n.b)}}`
    case 'pow':
      return `${wrap(n.a, POW + 1)}^{${render(n.b)}}`
    case 'neg':
      return `-${wrap(n.a, MUL)}`
  }
}

/** `expr`, tidied into LaTeX — or `null` if it doesn't even parse as a shape
 *  (an unclosed paren, a stray operator), matching `evaluate`'s own
 *  "refuse rather than guess" stance. `known` should list every name this
 *  expression may call as a function (typically the app's built-in math
 *  functions) — anything else is treated as a plain variable, exactly like
 *  `evaluateAt` would with an empty `vars`. */
export function toLatex(expr: string, known: Set<string>): string | null {
  const text = expr.trim().toLowerCase().replace(/\s+/g, ' ')
  if (text === '') return null
  try {
    const s: S = { src: text, i: 0, known }
    const node = parseExpr(s)
    ws(s)
    if (s.i !== text.length) return null
    return render(node)
  } catch {
    return null
  }
}
