/** LaTeX: the tables and helpers behind the "LaTeX" article's widgets.
 *
 *  Four pieces: a table of symbols (each one drawn by the page's own renderer, src/lib/tex.ts), a linter for a formula (the mistakes that
 *  make real LaTeX stop or print something else), generators for the structures people look up most (fractions, sums, matrices,
 *  piecewise functions) and a generator for the skeleton of a whole document.
 *
 *  The checker (tools/check-latex.mjs) tests these against references that do not use them: a second implementation of the linter, the
 *  generators and the document builder in Python, the Unicode database for the names of the symbols, and the page's renderer for what it can draw.
 *  During development every formula of the article was also run through KaTeX, whose parser is independent of the one on this page. */

import type { Loc } from '../content/types'

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------------------------------------- symbols */

export type SymbolCategory = 'greek' | 'greekcap' | 'relation' | 'operator' | 'arrow' | 'logic' | 'big' | 'misc' | 'delimiter' | 'function'

export interface LatexSymbol {
  /** the command without its backslash */
  cmd: string
  name: Loc
  category: SymbolCategory
  /** the official Unicode name of the character the page draws, null for the names of functions, which are drawn as upright words */
  unicode: string | null
  /** the package a real document needs for it, if it is not part of the LaTeX core */
  pkg?: 'amssymb' | 'amsmath'
}

const s = (cmd: string, en: string, id: string, category: SymbolCategory, unicode: string | null, pkg?: 'amssymb' | 'amsmath'): LatexSymbol => (pkg ? { cmd, name: L(en, id), category, unicode, pkg } : { cmd, name: L(en, id), category, unicode })

export const SYMBOLS: LatexSymbol[] = [
  s('alpha', 'alpha', 'alfa', 'greek', 'GREEK SMALL LETTER ALPHA'),
  s('beta', 'beta', 'beta', 'greek', 'GREEK SMALL LETTER BETA'),
  s('gamma', 'gamma', 'gama', 'greek', 'GREEK SMALL LETTER GAMMA'),
  s('delta', 'delta', 'delta', 'greek', 'GREEK SMALL LETTER DELTA'),
  s('varepsilon', 'epsilon (the usual shape)', 'epsilon (bentuk yang lazim)', 'greek', 'GREEK SMALL LETTER EPSILON'),
  s('zeta', 'zeta', 'zeta', 'greek', 'GREEK SMALL LETTER ZETA'),
  s('eta', 'eta', 'eta', 'greek', 'GREEK SMALL LETTER ETA'),
  s('theta', 'theta', 'teta', 'greek', 'GREEK SMALL LETTER THETA'),
  s('vartheta', 'theta (variant)', 'teta (varian)', 'greek', 'GREEK THETA SYMBOL'),
  s('iota', 'iota', 'iota', 'greek', 'GREEK SMALL LETTER IOTA'),
  s('kappa', 'kappa', 'kapa', 'greek', 'GREEK SMALL LETTER KAPPA'),
  s('lambda', 'lambda', 'lambda', 'greek', 'GREEK SMALL LETTER LAMDA'),
  s('mu', 'mu', 'mu', 'greek', 'GREEK SMALL LETTER MU'),
  s('nu', 'nu', 'nu', 'greek', 'GREEK SMALL LETTER NU'),
  s('xi', 'xi', 'ksi', 'greek', 'GREEK SMALL LETTER XI'),
  s('pi', 'pi', 'pi', 'greek', 'GREEK SMALL LETTER PI'),
  s('rho', 'rho', 'rho', 'greek', 'GREEK SMALL LETTER RHO'),
  s('sigma', 'sigma', 'sigma', 'greek', 'GREEK SMALL LETTER SIGMA'),
  s('tau', 'tau', 'tau', 'greek', 'GREEK SMALL LETTER TAU'),
  s('upsilon', 'upsilon', 'upsilon', 'greek', 'GREEK SMALL LETTER UPSILON'),
  s('phi', 'phi', 'fi', 'greek', 'GREEK SMALL LETTER PHI'),
  s('chi', 'chi', 'khi', 'greek', 'GREEK SMALL LETTER CHI'),
  s('psi', 'psi', 'psi', 'greek', 'GREEK SMALL LETTER PSI'),
  s('omega', 'omega', 'omega', 'greek', 'GREEK SMALL LETTER OMEGA'),
  s('Gamma', 'capital gamma', 'gama kapital', 'greekcap', 'GREEK CAPITAL LETTER GAMMA'),
  s('Delta', 'capital delta', 'delta kapital', 'greekcap', 'GREEK CAPITAL LETTER DELTA'),
  s('Theta', 'capital theta', 'teta kapital', 'greekcap', 'GREEK CAPITAL LETTER THETA'),
  s('Lambda', 'capital lambda', 'lambda kapital', 'greekcap', 'GREEK CAPITAL LETTER LAMDA'),
  s('Xi', 'capital xi', 'ksi kapital', 'greekcap', 'GREEK CAPITAL LETTER XI'),
  s('Pi', 'capital pi', 'pi kapital', 'greekcap', 'GREEK CAPITAL LETTER PI'),
  s('Sigma', 'capital sigma', 'sigma kapital', 'greekcap', 'GREEK CAPITAL LETTER SIGMA'),
  s('Phi', 'capital phi', 'fi kapital', 'greekcap', 'GREEK CAPITAL LETTER PHI'),
  s('Psi', 'capital psi', 'psi kapital', 'greekcap', 'GREEK CAPITAL LETTER PSI'),
  s('Omega', 'capital omega', 'omega kapital', 'greekcap', 'GREEK CAPITAL LETTER OMEGA'),
  s('leq', 'less than or equal', 'kurang dari atau sama dengan', 'relation', 'LESS-THAN OR EQUAL TO'),
  s('geq', 'greater than or equal', 'lebih dari atau sama dengan', 'relation', 'GREATER-THAN OR EQUAL TO'),
  s('neq', 'not equal', 'tidak sama dengan', 'relation', 'NOT EQUAL TO'),
  s('approx', 'approximately equal', 'hampir sama dengan', 'relation', 'ALMOST EQUAL TO'),
  s('equiv', 'equivalent, congruent', 'ekuivalen, kongruen', 'relation', 'IDENTICAL TO'),
  s('cong', 'congruent figures', 'bangun kongruen', 'relation', 'APPROXIMATELY EQUAL TO'),
  s('sim', 'similar, distributed as', 'sebangun, berdistribusi', 'relation', 'TILDE OPERATOR'),
  s('propto', 'proportional to', 'sebanding dengan', 'relation', 'PROPORTIONAL TO'),
  s('ll', 'much less than', 'jauh lebih kecil dari', 'relation', 'MUCH LESS-THAN'),
  s('gg', 'much greater than', 'jauh lebih besar dari', 'relation', 'MUCH GREATER-THAN'),
  s('perp', 'perpendicular', 'tegak lurus', 'relation', 'UP TACK'),
  s('parallel', 'parallel', 'sejajar', 'relation', 'PARALLEL TO'),
  s('mid', 'divides', 'membagi', 'relation', 'DIVIDES'),
  s('pm', 'plus or minus', 'tambah atau kurang', 'operator', 'PLUS-MINUS SIGN'),
  s('mp', 'minus or plus', 'kurang atau tambah', 'operator', 'MINUS-OR-PLUS SIGN'),
  s('times', 'times', 'kali', 'operator', 'MULTIPLICATION SIGN'),
  s('div', 'divided by', 'dibagi', 'operator', 'DIVISION SIGN'),
  s('cdot', 'dot product, multiplication dot', 'perkalian titik', 'operator', 'DOT OPERATOR'),
  s('ast', 'asterisk', 'asterisk', 'operator', 'ASTERISK OPERATOR'),
  s('circ', 'composition, degree', 'komposisi, derajat', 'operator', 'RING OPERATOR'),
  s('oplus', 'direct sum', 'jumlah langsung', 'operator', 'CIRCLED PLUS'),
  s('cup', 'union', 'gabungan', 'operator', 'UNION'),
  s('cap', 'intersection', 'irisan', 'operator', 'INTERSECTION'),
  s('to', 'arrow, tends to', 'panah, menuju', 'arrow', 'RIGHTWARDS ARROW'),
  s('longrightarrow', 'long arrow', 'panah panjang', 'arrow', 'LONG RIGHTWARDS ARROW'),
  s('Rightarrow', 'implies', 'mengakibatkan', 'arrow', 'RIGHTWARDS DOUBLE ARROW'),
  s('leftrightarrow', 'both directions', 'dua arah', 'arrow', 'LEFT RIGHT ARROW'),
  s('Leftrightarrow', 'if and only if', 'jika dan hanya jika', 'arrow', 'LEFT RIGHT DOUBLE ARROW'),
  s('iff', 'if and only if (long)', 'jika dan hanya jika (panjang)', 'arrow', 'LONG LEFT RIGHT DOUBLE ARROW'),
  s('mapsto', 'maps to', 'dipetakan ke', 'arrow', 'RIGHTWARDS ARROW FROM BAR'),
  s('in', 'element of', 'anggota dari', 'logic', 'ELEMENT OF'),
  s('notin', 'not an element of', 'bukan anggota dari', 'logic', 'NOT AN ELEMENT OF'),
  s('subset', 'subset', 'himpunan bagian', 'logic', 'SUBSET OF'),
  s('subseteq', 'subset or equal', 'himpunan bagian atau sama', 'logic', 'SUBSET OF OR EQUAL TO'),
  s('emptyset', 'empty set', 'himpunan kosong', 'logic', 'EMPTY SET'),
  s('forall', 'for all', 'untuk semua', 'logic', 'FOR ALL'),
  s('exists', 'there exists', 'terdapat', 'logic', 'THERE EXISTS'),
  s('neg', 'not', 'negasi', 'logic', 'NOT SIGN'),
  s('land', 'and', 'dan (konjungsi)', 'logic', 'LOGICAL AND'),
  s('lor', 'or', 'atau (disjungsi)', 'logic', 'LOGICAL OR'),
  s('therefore', 'therefore', 'oleh karena itu', 'logic', 'THEREFORE', 'amssymb'),
  s('because', 'because', 'karena', 'logic', 'BECAUSE', 'amssymb'),
  s('models', 'entails', 'memiliki konsekuensi', 'logic', 'TRUE'),
  s('top', 'true, top', 'benar, puncak', 'logic', 'DOWN TACK'),
  s('bot', 'false, bottom', 'salah, dasar', 'logic', 'UP TACK'),
  s('sum', 'sum', 'jumlah', 'big', 'N-ARY SUMMATION'),
  s('prod', 'product', 'hasil kali', 'big', 'N-ARY PRODUCT'),
  s('int', 'integral', 'integral', 'big', 'INTEGRAL'),
  s('infty', 'infinity', 'tak hingga', 'misc', 'INFINITY'),
  s('partial', 'partial derivative', 'turunan parsial', 'misc', 'PARTIAL DIFFERENTIAL'),
  s('nabla', 'nabla, gradient', 'nabla, gradien', 'misc', 'NABLA'),
  s('angle', 'angle', 'sudut', 'misc', 'ANGLE'),
  s('triangle', 'triangle', 'segitiga', 'misc', 'WHITE UP-POINTING TRIANGLE'),
  s('ldots', 'dots on the line', 'titik-titik di garis dasar', 'misc', 'HORIZONTAL ELLIPSIS'),
  s('cdots', 'dots in the middle', 'titik-titik di tengah', 'misc', 'MIDLINE HORIZONTAL ELLIPSIS'),
  s('vdots', 'vertical dots', 'titik-titik vertikal', 'misc', 'VERTICAL ELLIPSIS'),
  s('langle', 'left angle bracket', 'kurung sudut kiri', 'delimiter', 'MATHEMATICAL LEFT ANGLE BRACKET'),
  s('rangle', 'right angle bracket', 'kurung sudut kanan', 'delimiter', 'MATHEMATICAL RIGHT ANGLE BRACKET'),
  s('lfloor', 'left floor', 'lantai kiri', 'delimiter', 'LEFT FLOOR'),
  s('rfloor', 'right floor', 'lantai kanan', 'delimiter', 'RIGHT FLOOR'),
  s('lceil', 'left ceiling', 'langit-langit kiri', 'delimiter', 'LEFT CEILING'),
  s('rceil', 'right ceiling', 'langit-langit kanan', 'delimiter', 'RIGHT CEILING'),
  s('lVert', 'left double bar (norm)', 'garis ganda kiri (norma)', 'delimiter', 'DOUBLE VERTICAL LINE', 'amsmath'),
  s('rVert', 'right double bar (norm)', 'garis ganda kanan (norma)', 'delimiter', 'DOUBLE VERTICAL LINE', 'amsmath'),
  s('vert', 'vertical bar', 'garis tegak', 'delimiter', 'VERTICAL LINE'),
  s('sin', 'sine', 'sinus', 'function', null),
  s('cos', 'cosine', 'kosinus', 'function', null),
  s('tan', 'tangent', 'tangen', 'function', null),
  s('arcsin', 'inverse sine', 'invers sinus', 'function', null),
  s('ln', 'natural logarithm', 'logaritma natural', 'function', null),
  s('log', 'logarithm', 'logaritma', 'function', null),
  s('exp', 'exponential', 'eksponensial', 'function', null),
  s('lim', 'limit', 'limit', 'function', null),
  s('max', 'maximum', 'maksimum', 'function', null),
  s('min', 'minimum', 'minimum', 'function', null),
  s('det', 'determinant', 'determinan', 'function', null),
  s('gcd', 'greatest common divisor', 'faktor persekutuan terbesar', 'function', null),
]

export const CATEGORY_NAME: Record<SymbolCategory, Loc> = {
  greek: L('Greek letters', 'Huruf Yunani'),
  greekcap: L('Capital Greek', 'Yunani kapital'),
  relation: L('Relations', 'Relasi'),
  operator: L('Operators', 'Operator'),
  arrow: L('Arrows', 'Panah'),
  logic: L('Sets and logic', 'Himpunan dan logika'),
  big: L('Sum, product, integral', 'Jumlah, hasil kali, integral'),
  misc: L('Other symbols', 'Simbol lain'),
  delimiter: L('Brackets', 'Kurung'),
  function: L('Function names', 'Nama fungsi'),
}

/* -------------------------------------------------------------------------------------------- commands */

/** The number of arguments of the commands that take them, as the page's renderer and real LaTeX agree. */
export const ARGS: Record<string, number> = {
  frac: 2, dfrac: 2, tfrac: 2, sqrt: 1, pmod: 1, vec: 1, hat: 1, dot: 1, bar: 1, overline: 1, mathbb: 1, mathrm: 1, mathbf: 1, boldsymbol: 1,
  operatorname: 1, text: 1, textrm: 1,
  // valid in LaTeX, but not drawn by the page's renderer
  binom: 2, dbinom: 2, mathcal: 1, mathfrak: 1, mathit: 1, underbrace: 1, overbrace: 1, boxed: 1, textbf: 1, textit: 1, emph: 1, underline: 1,
}

/** Commands the page's renderer draws that are not symbols: structure, spacing, sizes, and the few symbols not in the table. */
const STRUCTURE = [
  'frac', 'dfrac', 'tfrac', 'sqrt', 'vec', 'hat', 'dot', 'bar', 'overline', 'mathbb', 'mathrm', 'mathbf', 'boldsymbol', 'operatorname', 'text', 'textrm',
  'left', 'right', 'begin', 'end', 'big', 'Big', 'bigg', 'Bigg', 'bigl', 'bigr', 'Bigl', 'Bigr', 'biggl', 'biggr', 'Biggl', 'Biggr',
  'quad', 'qquad', 'thinspace',
  'epsilon', 'ell', 'ne', 'le', 'ge', 'rightarrow', 'lnot', 'wedge', 'vee', 'dots', 'Vert',
  'sec', 'csc', 'cot', 'arccos', 'arctan', 'arccot', 'arcsec', 'arccsc', 'sinh', 'cosh', 'tanh', 'dim', 'ker', 'deg', 'proj', 'comp', 'span', 'rank',
  'varphi', 'Rightarrow', 'bmod', 'pmod',
]

/** Everything the page can draw. */
export const KNOWN: ReadonlySet<string> = new Set([...SYMBOLS.map((x) => x.cmd), ...STRUCTURE])

/** Real LaTeX commands the page's small renderer cannot draw: the linter says so instead of calling them undefined. */
export const REAL_ONLY: ReadonlySet<string> = new Set([
  'binom', 'dbinom', 'tbinom', 'displaystyle', 'textstyle', 'scriptstyle', 'lvert', 'rvert', 'leftarrow', 'Leftarrow', 'longleftarrow', 'Longleftarrow', 'Longrightarrow',
  'boxed', 'blacksquare', 'square', 'underbrace', 'overbrace', 'underline', 'mathcal', 'mathscr', 'mathfrak', 'mathit', 'mathsf', 'mathtt', 'color', 'textbf', 'textit',
  'emph', 'implies', 'impliedby', 'lbrace', 'rbrace', 'varnothing', 'nmid', 'subsetneq', 'supset', 'supseteq', 'setminus', 'bigcup', 'bigcap', 'bigoplus', 'oint', 'iint',
  'iiint', 'sup', 'inf', 'limsup', 'liminf', 'arg', 'Pr', 'tag', 'label', 'nonumber', 'ref', 'eqref', 'stackrel', 'overset', 'underset', 'xrightarrow',
  'hspace', 'vspace', 'phantom', 'mathop', 'ddots', 'Re', 'Im', 'aleph', 'hbar', 'wp', 'imath', 'jmath', 'prime', 'backslash', 'cdotp', 'tilde', 'widehat', 'widetilde',
  'not', 'vartriangle', 'nexists', 'dagger', 'star', 'bullet', 'otimes', 'ominus', 'odot', 'uparrow', 'downarrow', 'Uparrow', 'Downarrow', 'hookrightarrow', 'rightharpoonup',
])

/* ---------------------------------------------------------------------------------------------- linter */

export type DiagKind =
  | 'extra-close'
  | 'missing-close'
  | 'extra-right'
  | 'missing-right'
  | 'env-mismatch'
  | 'env-extra-end'
  | 'env-unclosed'
  | 'undefined'
  | 'unsupported'
  | 'missing-arg'
  | 'dollar'
  | 'comment'
  | 'ampersand'
  | 'script-multi'
  | 'script-sign'

export interface Diagnostic {
  /** index in the source of the character or command the message is about */
  pos: number
  kind: DiagKind
  arg?: string
}

const isSpaceChar = (c: string): boolean => c === ' ' || c === '\n' || c === '\t' || c === '\r'

function skipSpaces(src: string, i: number): number {
  while (i < src.length && isSpaceChar(src[i])) i++
  return i
}

/** The index just after the argument that starts at or after i, or −1 if there is none: the end of the text, a closing brace, or a group
 *  whose brace is never closed. */
function argEnd(src: string, i: number): number {
  i = skipSpaces(src, i)
  if (i >= src.length) return -1
  const c = src[i]
  if (c === '}') return -1
  if (c === '{') {
    let depth = 0
    for (let j = i; j < src.length; j++) {
      const d = src[j]
      if (d === '\\') {
        j++
        continue
      }
      if (d === '{') depth++
      else if (d === '}') {
        depth--
        if (depth === 0) return j + 1
      }
    }
    return -1
  }
  if (c === '\\') {
    const m = /^\\(?:[A-Za-z]+|[^])/.exec(src.slice(i))
    return i + (m ? m[0].length : 1)
  }
  return i + 1
}

const isLetter = (c: string | undefined): boolean => c !== undefined && /[A-Za-z]/.test(c)
const isDigit = (c: string | undefined): boolean => c !== undefined && /[0-9]/.test(c)

/** The mistakes in a formula that make LaTeX stop or print something else than intended. Positions are indices into `src`. */
export function texLint(src: string): Diagnostic[] {
  const out: Diagnostic[] = []
  const braces: number[] = []
  const lefts: number[] = []
  const envs: { name: string; pos: number }[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '%') {
      out.push({ pos: i, kind: 'comment' })
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    if (c === '\\') {
      const m = /^\\([A-Za-z]+)/.exec(src.slice(i))
      if (!m) {
        // \{ \} \\ \, \% and so on: one escaped character, nothing to check
        i += 2
        continue
      }
      const name = m[1]
      const start = i
      i += m[0].length
      if (name === 'left') lefts.push(start)
      else if (name === 'right') {
        if (lefts.length > 0) lefts.pop()
        else out.push({ pos: start, kind: 'extra-right' })
      } else if (name === 'begin' || name === 'end') {
        const e = /^\s*\{([^{}]*)\}/.exec(src.slice(i))
        if (!e) {
          out.push({ pos: start, kind: 'missing-arg', arg: name })
          continue
        }
        i += e[0].length
        const env = e[1]
        if (name === 'begin') envs.push({ name: env, pos: start })
        else if (envs.length === 0) out.push({ pos: start, kind: 'env-extra-end', arg: env })
        else {
          const top = envs.pop() as { name: string; pos: number }
          if (top.name !== env) out.push({ pos: start, kind: 'env-mismatch', arg: `${top.name}|${env}` })
        }
      } else {
        const argc = ARGS[name] ?? 0
        let j = i
        if (name === 'sqrt') {
          const k = skipSpaces(src, i)
          if (src[k] === '[') {
            const close = src.indexOf(']', k)
            if (close >= 0) j = close + 1
          }
        }
        for (let a = 0; a < argc; a++) {
          const e = argEnd(src, j)
          if (e < 0) {
            out.push({ pos: start, kind: 'missing-arg', arg: name })
            break
          }
          j = e
        }
        if (!KNOWN.has(name)) out.push({ pos: start, kind: REAL_ONLY.has(name) ? 'unsupported' : 'undefined', arg: name })
      }
      continue
    }
    if (c === '{') braces.push(i)
    else if (c === '}') {
      if (braces.length > 0) braces.pop()
      else out.push({ pos: i, kind: 'extra-close' })
    } else if (c === '$') out.push({ pos: i, kind: 'dollar' })
    else if (c === '&') {
      if (envs.length === 0) out.push({ pos: i, kind: 'ampersand' })
    } else if (c === '^' || c === '_') {
      const j = skipSpaces(src, i + 1)
      const a = src[j]
      const b = src[j + 1]
      if (a !== undefined && b !== undefined) {
        if ((a === '-' || a === '+') && (isLetter(b) || isDigit(b) || b === '\\' || b === '{')) out.push({ pos: i, kind: 'script-sign', arg: c })
        else if ((isDigit(a) && isDigit(b)) || (isLetter(a) && isLetter(b))) out.push({ pos: i, kind: 'script-multi', arg: c })
      }
    }
    i++
  }
  for (const p of braces) out.push({ pos: p, kind: 'missing-close' })
  for (const p of lefts) out.push({ pos: p, kind: 'missing-right' })
  for (const e of envs) out.push({ pos: e.pos, kind: 'env-unclosed', arg: e.name })
  return out.sort((x, y) => x.pos - y.pos || (x.kind < y.kind ? -1 : x.kind > y.kind ? 1 : 0))
}

/* ------------------------------------------------------------------------------------------ generators */

export type GenKind = 'fraction' | 'root' | 'power' | 'sum' | 'product' | 'integral' | 'limit' | 'matrix' | 'cases'

export type GenParams = Record<string, string>

/** The LaTeX for the structure people look up most. `p` holds the fields of the form; a missing field counts as empty. */
export function texGen(kind: GenKind, p: GenParams): string {
  const g = (k: string): string => (p[k] ?? '').trim()
  switch (kind) {
    case 'fraction':
      return `\\frac{${g('num')}}{${g('den')}}`
    case 'root':
      return g('index') === '' ? `\\sqrt{${g('radicand')}}` : `\\sqrt[${g('index')}]{${g('radicand')}}`
    case 'power':
      return `${g('base')}^{${g('exponent')}}`
    case 'sum':
      return `\\sum_{${g('var')}=${g('from')}}^{${g('to')}} ${g('body')}`
    case 'product':
      return `\\prod_{${g('var')}=${g('from')}}^{${g('to')}} ${g('body')}`
    case 'integral':
      return `\\int_{${g('from')}}^{${g('to')}} ${g('body')} \\, d${g('var')}`
    case 'limit':
      return `\\lim_{${g('var')} \\to ${g('to')}} ${g('body')}`
    case 'matrix': {
      const rows = Math.min(5, Math.max(1, Math.floor(Number(p.rows) || 1)))
      const cols = Math.min(5, Math.max(1, Math.floor(Number(p.cols) || 1)))
      const env = ['pmatrix', 'bmatrix', 'vmatrix'].includes(p.fence ?? '') ? (p.fence as string) : 'pmatrix'
      const letter = g('entry') === '' ? 'a' : g('entry')
      const lines: string[] = []
      for (let r = 1; r <= rows; r++) {
        const cells: string[] = []
        for (let c = 1; c <= cols; c++) cells.push(`${letter}_{${r}${c}}`)
        lines.push(`  ${cells.join(' & ')}${r < rows ? ' \\\\' : ''}`)
      }
      return `\\begin{${env}}\n${lines.join('\n')}\n\\end{${env}}`
    }
    case 'cases': {
      const lines: string[] = []
      for (let k = 1; k <= 3; k++) {
        const e = g(`e${k}`)
        const c = g(`c${k}`)
        if (e !== '' || c !== '') lines.push(`${e} & ${c}`)
      }
      const head = g('name') === '' ? '' : `${g('name')} = `
      return `${head}\\begin{cases}\n${lines.map((l, i) => `  ${l}${i < lines.length - 1 ? ' \\\\' : ''}`).join('\n')}\n\\end{cases}`
    }
  }
}

/* ------------------------------------------------------------------------------------------------ text */

const SPECIAL: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  $: '\\$',
  '#': '\\#',
  _: '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
}

/** The text with the ten characters LaTeX treats specially written so that they print as themselves. */
export function escapeLatex(text: string): string {
  return Array.from(text, (c) => SPECIAL[c] ?? c).join('')
}

/* -------------------------------------------------------------------------------------------- document */

export type DocClass = 'article' | 'report' | 'book'
export type DocPackage = 'amsmath' | 'amssymb' | 'graphicx' | 'booktabs' | 'hyperref'

export interface DocOptions {
  docClass: DocClass
  size: 10 | 11 | 12
  paper: 'a4paper' | 'letterpaper'
  packages: DocPackage[]
  /** a geometry margin such as "2.5cm", or "" for the class default */
  margin: string
  title: string
  author: string
  abstract: boolean
  /** the number of sections (articles) or chapters (reports and books), 1 to 4 */
  units: number
  equation: boolean
  table: boolean
  figure: boolean
  bibliography: boolean
}

export interface DocResult {
  source: string
  /** facts about what was added, dropped or ordered, for the page to explain */
  notes: ('graphicx-added' | 'geometry-added' | 'no-abstract' | 'hyperref-last' | 'ref-instead-of-eqref')[]
  /** the commands that build the PDF, in order */
  commands: string[]
}

const PACKAGE_ORDER: DocPackage[] = ['amsmath', 'amssymb', 'graphicx', 'booktabs']

/** The skeleton of a LaTeX document with the pieces that are chosen. */
export function texDocument(o: DocOptions): DocResult {
  const notes: DocResult['notes'] = []
  const pkgs = new Set<DocPackage>(o.packages)
  if (o.figure && !pkgs.has('graphicx')) {
    pkgs.add('graphicx')
    notes.push('graphicx-added')
  }
  const margin = o.margin.trim()
  const lines: string[] = []
  lines.push(`\\documentclass[${o.size}pt,${o.paper}]{${o.docClass}}`, '')
  const used = PACKAGE_ORDER.filter((x) => pkgs.has(x))
  if (used.length > 0 || margin !== '' || pkgs.has('hyperref')) lines.push('% packages')
  for (const x of used) lines.push(`\\usepackage{${x}}`)
  if (margin !== '') {
    lines.push(`\\usepackage[margin=${margin}]{geometry}`)
    notes.push('geometry-added')
  }
  if (pkgs.has('hyperref')) {
    lines.push('\\usepackage{hyperref}')
    notes.push('hyperref-last')
  }
  if (used.length > 0 || margin !== '' || pkgs.has('hyperref')) lines.push('')
  lines.push(`\\title{${o.title}}`, `\\author{${o.author}}`, '\\date{\\today}', '', '\\begin{document}', '', '\\maketitle', '')
  if (o.abstract) {
    if (o.docClass === 'book') notes.push('no-abstract')
    else lines.push('\\begin{abstract}', 'A few sentences that say what this document is about.', '\\end{abstract}', '')
  }
  const unit = o.docClass === 'article' ? 'section' : 'chapter'
  const eqRef = pkgs.has('amsmath') ? '\\eqref{eq:main}' : '(\\ref{eq:main})'
  if (o.equation && !pkgs.has('amsmath')) notes.push('ref-instead-of-eqref')
  for (let k = 1; k <= Math.min(4, Math.max(1, o.units)); k++) {
    lines.push(`\\${unit}{${k === 1 ? 'Introduction' : `Part ${k}`}}`, '')
    if (k === 1) {
      lines.push('Text with inline mathematics, such as $a^2 + b^2 = c^2$.')
      if (o.bibliography) lines.push('This idea goes back to Knuth~\\cite{knuth1984}.')
      lines.push('')
      if (o.equation) {
        lines.push('\\begin{equation}', '  \\label{eq:main}', '  e^{i\\pi} + 1 = 0', '\\end{equation}', '', `Equation~${eqRef} is Euler's identity.`, '')
      }
      if (o.table) {
        const top = pkgs.has('booktabs') ? '\\toprule' : '\\hline'
        const mid = pkgs.has('booktabs') ? '\\midrule' : '\\hline'
        const bottom = pkgs.has('booktabs') ? '\\bottomrule' : '\\hline'
        lines.push(
          '\\begin{table}[ht]',
          '  \\centering',
          '  \\begin{tabular}{lr}',
          `    ${top}`,
          '    Name & Value \\\\',
          `    ${mid}`,
          '    $\\pi$ & 3.14159 \\\\',
          '    $e$ & 2.71828 \\\\',
          `    ${bottom}`,
          '  \\end{tabular}',
          '  \\caption{Two constants.}',
          '  \\label{tab:constants}',
          '\\end{table}',
          '',
          'Table~\\ref{tab:constants} lists them.',
          '',
        )
      }
      if (o.figure) {
        lines.push(
          '\\begin{figure}[ht]',
          '  \\centering',
          '  \\includegraphics[width=0.6\\textwidth]{figure.png}',
          '  \\caption{A figure.}',
          '  \\label{fig:main}',
          '\\end{figure}',
          '',
          'Figure~\\ref{fig:main} shows it.',
          '',
        )
      }
    } else lines.push('More text.', '')
  }
  if (o.bibliography) lines.push('\\bibliographystyle{plain}', '\\bibliography{references}', '')
  lines.push('\\end{document}', '')
  const labelled = o.equation || o.table || o.figure
  const commands: string[] = []
  if (o.bibliography) commands.push('pdflatex main', 'bibtex main', 'pdflatex main', 'pdflatex main')
  else if (labelled) commands.push('pdflatex main', 'pdflatex main')
  else commands.push('pdflatex main')
  return { source: lines.join('\n'), notes, commands }
}
