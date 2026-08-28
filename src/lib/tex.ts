/** A very small LaTeX renderer, for the mathematics courses.
 *
 *  It reads the subset of TeX the curriculum actually writes — fractions,
 *  roots, scripts, arrows over letters, matrices, and about eighty symbols —
 *  and emits MathML, which every browser this app targets now lays out
 *  natively. KaTeX would render more, but it is a 280 KB script plus a
 *  megabyte of fonts, and the catalogue comment two files over is right that
 *  this app counts its kilobytes.
 *
 *  The input is authored here, not typed by a learner, so an unsupported
 *  command is a bug in the content rather than something to survive: it comes
 *  out as literal text, which is loud enough to spot on the page.
 */

/* ------------------------------------------------------------------ table */

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ',
  tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
  Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
}

const OPERATOR: Record<string, string> = {
  cdot: '⋅', times: '×', div: '÷', pm: '±', mp: '∓', ast: '∗',
  neq: '≠', ne: '≠', leq: '≤', le: '≤', geq: '≥', ge: '≥',
  approx: '≈', equiv: '≡', sim: '∼', propto: '∝',
  to: '→', rightarrow: '→', longrightarrow: '⟶', Rightarrow: '⇒',
  leftrightarrow: '↔', Leftrightarrow: '⇔', iff: '⟺', mapsto: '↦',
  in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', cup: '∪', cap: '∩',
  emptyset: '∅', forall: '∀', exists: '∃', therefore: '∴',
  perp: '⊥', parallel: '∥', nparallel: '∦', angle: '∠', triangle: '△',
  circ: '∘', degree: '°', infty: '∞', partial: '∂', nabla: '∇',
  ldots: '…', cdots: '⋯', dots: '…', vdots: '⋮',
  langle: '⟨', rangle: '⟩', lVert: '‖', rVert: '‖', vert: '|', Vert: '‖',
  lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉',
  sum: '∑', prod: '∏', int: '∫', checkmark: '✓',
}

/** Multi-letter names that must stay upright: `\cos` is a name, not c·o·s. */
const NAMES = new Set([
  'sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'ln', 'log', 'exp', 'lim', 'max', 'min', 'det',
  'dim', 'ker', 'gcd', 'deg', 'proj', 'comp', 'span', 'rank',
])

/** Spacing commands, all of which render as one thin gap. */
const SPACING = new Set([',', ':', ';', '!', ' ', 'quad', 'qquad', 'thinspace'])

const MATRIX_FENCE: Record<string, [string, string]> = {
  pmatrix: ['(', ')'],
  bmatrix: ['[', ']'],
  vmatrix: ['|', '|'],
  Vmatrix: ['‖', '‖'],
  matrix: ['', ''],
  cases: ['{', ''],
  aligned: ['', ''],
  array: ['', ''],
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* -------------------------------------------------------------- tokenizer */

/** A backslash command, or one character. Whitespace survives as its own
 *  token because `\text{...}` needs it; maths mode drops it. */
function tokenize(src: string): string[] {
  const out: string[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '\\') {
      const word = /^[A-Za-z]+/.exec(src.slice(i + 1))
      if (word) {
        out.push('\\' + word[0])
        i += 1 + word[0].length
      } else {
        out.push('\\' + (src[i + 1] ?? ''))
        i += 2
      }
      continue
    }
    out.push(c)
    i += 1
  }
  return out
}

/* ----------------------------------------------------------------- parser */

interface P {
  toks: string[]
  i: number
}

const peek = (p: P): string | undefined => p.toks[p.i]

function skipSpace(p: P): void {
  while (p.toks[p.i] === ' ' || p.toks[p.i] === '\n' || p.toks[p.i] === '\t') p.i++
}

/** Wrap a run of fragments so a parent element gets exactly one child. */
const row = (parts: string[]): string =>
  parts.length === 1 ? parts[0] : `<mrow>${parts.join('')}</mrow>`

/** Everything up to — but not consuming — a token the caller stops at. */
function parseList(p: P, stop: (t: string) => boolean): string {
  const parts: string[] = []
  for (;;) {
    skipSpace(p)
    const t = peek(p)
    if (t === undefined || stop(t)) break
    const atom = parseScripted(p)
    if (atom) parts.push(atom)
  }
  return parts.length === 0 ? '<mrow></mrow>' : row(parts)
}

/** One atom plus any `^` / `_` hanging off it. */
function parseScripted(p: P): string {
  let base = parseAtom(p)
  for (;;) {
    skipSpace(p)
    const t = peek(p)
    if (t === '^') {
      p.i++
      const sup = parseAtom(p)
      skipSpace(p)
      if (peek(p) === '_') {
        p.i++
        base = `<msubsup>${base}${parseAtom(p)}${sup}</msubsup>`
      } else {
        base = `<msup>${base}${sup}</msup>`
      }
    } else if (t === '_') {
      p.i++
      const sub = parseAtom(p)
      skipSpace(p)
      if (peek(p) === '^') {
        p.i++
        base = `<msubsup>${base}${sub}${parseAtom(p)}</msubsup>`
      } else {
        base = `<msub>${base}${sub}</msub>`
      }
    } else {
      return base
    }
  }
}

/** The group after `{`, or the single token standing in for it. */
function parseGroup(p: P): string {
  skipSpace(p)
  if (peek(p) === '{') {
    p.i++
    const inner = parseList(p, (t) => t === '}')
    if (peek(p) === '}') p.i++
    return inner
  }
  return parseAtom(p)
}

/** The literal characters of `{...}`, for `\text`, where TeX is not maths. */
function parseRaw(p: P): string {
  skipSpace(p)
  if (peek(p) !== '{') return p.toks[p.i++] ?? ''
  p.i++
  let depth = 1
  let out = ''
  while (p.i < p.toks.length) {
    const t = p.toks[p.i++]
    if (t === '{') depth++
    else if (t === '}') {
      depth--
      if (depth === 0) break
    }
    out += t
  }
  return out
}

const accent = (inner: string, mark: string): string =>
  `<mover accent="true">${inner}<mo stretchy="false">${mark}</mo></mover>`

function parseMatrix(p: P, env: string): string {
  const rows: string[][] = [['']]
  for (;;) {
    skipSpace(p)
    const t = peek(p)
    if (t === undefined) break
    if (t === '\\end') {
      p.i++
      parseRaw(p)
      break
    }
    if (t === '&') {
      p.i++
      rows[rows.length - 1].push('')
      continue
    }
    if (t === '\\\\') {
      p.i++
      rows.push([''])
      continue
    }
    const last = rows[rows.length - 1]
    last[last.length - 1] += parseScripted(p)
  }

  const body = rows
    .filter((r) => r.some((c) => c !== ''))
    .map((r) => `<mtr>${r.map((c) => `<mtd>${c || '<mrow></mrow>'}</mtd>`).join('')}</mtr>`)
    .join('')

  const [open, close] = MATRIX_FENCE[env] ?? ['', '']
  const table = `<mtable columnspacing="0.55em" rowspacing="0.25em">${body}</mtable>`
  if (!open && !close) return table
  return `<mrow>${open ? `<mo stretchy="true">${esc(open)}</mo>` : ''}${table}${
    close ? `<mo stretchy="true">${esc(close)}</mo>` : ''
  }</mrow>`
}

/** A delimiter after `\left` / `\right`. `.` means "no bracket at all". */
function fence(tok: string, open: boolean): string {
  if (tok === '' || tok === '.') return ''
  const ch = tok.startsWith('\\') ? (OPERATOR[tok.slice(1)] ?? tok.slice(1)) : tok
  return `<mo stretchy="true" fence="true" form="${open ? 'prefix' : 'postfix'}">${esc(ch)}</mo>`
}

function parseCommand(p: P, cmd: string): string {
  const name = cmd.slice(1)

  if (name in GREEK) return `<mi>${GREEK[name]}</mi>`
  if (NAMES.has(name)) return `<mi>${name}</mi>`
  if (SPACING.has(name)) return '<mspace width="0.22em"></mspace>'

  switch (name) {
    case 'frac':
    case 'dfrac':
    case 'tfrac':
      return `<mfrac>${parseGroup(p)}${parseGroup(p)}</mfrac>`
    case 'sqrt': {
      skipSpace(p)
      if (peek(p) === '[') {
        p.i++
        const index = parseList(p, (t) => t === ']')
        if (peek(p) === ']') p.i++
        return `<mroot>${parseGroup(p)}${index}</mroot>`
      }
      return `<msqrt>${parseGroup(p)}</msqrt>`
    }
    case 'vec':
      return accent(parseGroup(p), '→')
    case 'hat':
      return accent(parseGroup(p), '^')
    case 'bar':
    case 'overline':
      return `<mover accent="true">${parseGroup(p)}<mo stretchy="true">‾</mo></mover>`
    case 'mathbf':
    case 'boldsymbol':
      return `<mstyle mathvariant="bold">${parseGroup(p)}</mstyle>`
    case 'mathrm':
    case 'operatorname':
      return `<mi>${esc(parseRaw(p))}</mi>`
    case 'text':
    case 'textrm':
      return `<mtext>${esc(parseRaw(p)).replace(/ /g, ' ')}</mtext>`
    case 'left': {
      skipSpace(p)
      const open = p.toks[p.i++] ?? ''
      const inner = parseList(p, (t) => t === '\\right')
      let close = ''
      if (peek(p) === '\\right') {
        p.i++
        skipSpace(p)
        close = p.toks[p.i++] ?? ''
      }
      return `<mrow>${fence(open, true)}${inner}${fence(close, false)}</mrow>`
    }
    case 'right':
      return '' // only reachable when the content is unbalanced
    case 'begin':
      return parseMatrix(p, parseRaw(p))
    case 'end':
      parseRaw(p)
      return ''
    case '\\':
      return '<mspace linebreak="newline"></mspace>'
  }

  if (name in OPERATOR) return `<mo>${esc(OPERATOR[name])}</mo>`

  // `\%`, `\{`, `\}`, `\|`, `\_` and friends: the character itself.
  if (name.length === 1) {
    if (name === '|') return '<mo stretchy="true">‖</mo>'
    return /[0-9A-Za-z]/.test(name) ? `<mi>${esc(name)}</mi>` : `<mo>${esc(name)}</mo>`
  }

  return `<mtext>${esc(cmd)}</mtext>`
}

function parseAtom(p: P): string {
  skipSpace(p)
  const t = p.toks[p.i]
  if (t === undefined) return ''

  if (t === '{') {
    p.i++
    const inner = parseList(p, (x) => x === '}')
    if (peek(p) === '}') p.i++
    return inner
  }
  if (t === '}') {
    p.i++
    return ''
  }
  // A script with nothing before it — `^\circ` written on its own, which is
  // how a degree sign is set beside an answer box. Hand back an empty base
  // without consuming, and let parseScripted attach the script to it.
  if (t === '^' || t === '_') return '<mrow></mrow>'
  if (t.startsWith('\\')) {
    p.i++
    return parseCommand(p, t)
  }

  // A number runs as far as its digits and one decimal mark go, so MathML
  // sees `12.5` as one <mn> rather than three atoms.
  if (/[0-9]/.test(t)) {
    let num = ''
    while (p.i < p.toks.length && /^[0-9]$/.test(p.toks[p.i])) num += p.toks[p.i++]
    if ((p.toks[p.i] === '.' || p.toks[p.i] === ',') && /^[0-9]$/.test(p.toks[p.i + 1] ?? '')) {
      num += p.toks[p.i++]
      while (p.i < p.toks.length && /^[0-9]$/.test(p.toks[p.i])) num += p.toks[p.i++]
    }
    return `<mn>${num}</mn>`
  }

  p.i++
  if (/[A-Za-z]/.test(t)) return `<mi>${t}</mi>`
  if (t === "'") return '<mo>′</mo>'
  if (t === '(' || t === '[') return `<mo form="prefix" stretchy="false">${esc(t)}</mo>`
  if (t === ')' || t === ']') return `<mo form="postfix" stretchy="false">${esc(t)}</mo>`
  return `<mo>${esc(t)}</mo>`
}

/* ------------------------------------------------------------------- api */

const cache = new Map<string, string>()

/** LaTeX in, a `<math>` element as an HTML string out.
 *  Cached, because a step re-renders its formulas on every keystroke. */
export function tex(src: string, display = false): string {
  const key = (display ? 'B' : 'I') + src
  const hit = cache.get(key)
  if (hit !== undefined) return hit

  const p: P = { toks: tokenize(src), i: 0 }
  const out = `<math display="${display ? 'block' : 'inline'}">${parseList(p, () => false)}</math>`
  cache.set(key, out)
  return out
}
