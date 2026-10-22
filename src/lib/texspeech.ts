/** Mathematics in words, for screen readers.
 *
 *  `texSpeech('\\frac{a+b}{2}')` is "fraction, a plus b, over 2, end fraction". The formulas of the site are drawn as MathML, which not every
 *  browser and screen reader pair reads well; the component puts this text in an aria-label on a role="math" wrapper so that every reader
 *  hears the same thing. The grammar is the subset of TeX that src/lib/tex.ts draws, in English and in Indonesian.
 *
 *  tools/check-texspeech.mjs tests it against hand-written phrases and against every formula of every article. */

import { SYMBOLS } from './latex'

export type SpeechLang = 'en' | 'id'

interface Item {
  text: string
  /** the number of atoms the group holds: a group of one or two is read without a closing word */
  atoms: number
  /** a big operator or a limit, whose scripts are read as "from ... to ..." */
  op?: string
  /** a fraction, a root or a matrix: it gets a closing word when it is the argument of something else */
  rich?: boolean
  /** something a minus sign can follow as a subtraction: a number, a letter, a closing bracket, a group */
  operand?: boolean
}

const complex = (it: Item): boolean => it.atoms > 2 || it.rich === true

const GREEK: Record<string, [string, string]> = {
  alpha: ['alpha', 'alfa'], beta: ['beta', 'beta'], gamma: ['gamma', 'gama'], delta: ['delta', 'delta'], epsilon: ['epsilon', 'epsilon'], varepsilon: ['epsilon', 'epsilon'],
  zeta: ['zeta', 'zeta'], eta: ['eta', 'eta'], theta: ['theta', 'teta'], vartheta: ['theta', 'teta'], iota: ['iota', 'iota'], kappa: ['kappa', 'kapa'],
  lambda: ['lambda', 'lambda'], mu: ['mu', 'mu'], nu: ['nu', 'nu'], xi: ['xi', 'ksi'], pi: ['pi', 'pi'], rho: ['rho', 'rho'], sigma: ['sigma', 'sigma'],
  tau: ['tau', 'tau'], upsilon: ['upsilon', 'upsilon'], phi: ['phi', 'fi'], varphi: ['phi', 'fi'], chi: ['chi', 'khi'], psi: ['psi', 'psi'], omega: ['omega', 'omega'],
  Gamma: ['capital gamma', 'gama kapital'], Delta: ['capital delta', 'delta kapital'], Theta: ['capital theta', 'teta kapital'], Lambda: ['capital lambda', 'lambda kapital'],
  Xi: ['capital xi', 'ksi kapital'], Pi: ['capital pi', 'pi kapital'], Sigma: ['capital sigma', 'sigma kapital'], Phi: ['capital phi', 'fi kapital'],
  Psi: ['capital psi', 'psi kapital'], Omega: ['capital omega', 'omega kapital'], ell: ['script l', 'l tulisan'],
}

const OPS: Record<string, [string, string]> = {
  cdot: ['times', 'kali'], times: ['times', 'kali'], div: ['divided by', 'dibagi'], pm: ['plus or minus', 'tambah atau kurang'], mp: ['minus or plus', 'kurang atau tambah'], ast: ['times', 'kali'],
  neq: ['is not equal to', 'tidak sama dengan'], ne: ['is not equal to', 'tidak sama dengan'], leq: ['is less than or equal to', 'kurang dari atau sama dengan'], le: ['is less than or equal to', 'kurang dari atau sama dengan'],
  geq: ['is greater than or equal to', 'lebih dari atau sama dengan'], ge: ['is greater than or equal to', 'lebih dari atau sama dengan'], approx: ['is approximately equal to', 'hampir sama dengan'],
  equiv: ['is equivalent to', 'ekuivalen dengan'], cong: ['is congruent to', 'kongruen dengan'], sim: ['is similar to', 'sebangun dengan'], propto: ['is proportional to', 'sebanding dengan'],
  to: ['to', 'menuju'], rightarrow: ['to', 'menuju'], longrightarrow: ['to', 'menuju'], Rightarrow: ['implies', 'mengakibatkan'], leftrightarrow: ['both ways', 'dua arah'],
  Leftrightarrow: ['if and only if', 'jika dan hanya jika'], iff: ['if and only if', 'jika dan hanya jika'], mapsto: ['maps to', 'dipetakan ke'], in: ['is an element of', 'anggota dari'],
  notin: ['is not an element of', 'bukan anggota dari'], subset: ['is a subset of', 'himpunan bagian dari'], subseteq: ['is a subset of or equal to', 'himpunan bagian atau sama dengan'],
  cup: ['union', 'gabungan'], cap: ['intersection', 'irisan'], emptyset: ['the empty set', 'himpunan kosong'], forall: ['for all', 'untuk semua'], exists: ['there exists', 'terdapat'],
  therefore: ['therefore', 'oleh karena itu'], because: ['because', 'karena'], perp: ['is perpendicular to', 'tegak lurus dengan'], parallel: ['is parallel to', 'sejajar dengan'],
  nparallel: ['is not parallel to', 'tidak sejajar dengan'], angle: ['angle', 'sudut'], triangle: ['triangle', 'segitiga'], circ: ['degrees', 'derajat'], degree: ['degrees', 'derajat'],
  infty: ['infinity', 'tak hingga'], partial: ['partial', 'parsial'], nabla: ['nabla', 'nabla'], mid: ['divides', 'membagi'], oplus: ['direct sum', 'jumlah langsung'], ll: ['is much less than', 'jauh lebih kecil dari'],
  gg: ['is much greater than', 'jauh lebih besar dari'], ldots: ['dot dot dot', 'titik titik titik'], cdots: ['dot dot dot', 'titik titik titik'], dots: ['dot dot dot', 'titik titik titik'], vdots: ['vertical dots', 'titik vertikal'],
  neg: ['not', 'bukan'], lnot: ['not', 'bukan'], land: ['and', 'dan'], wedge: ['and', 'dan'], lor: ['or', 'atau'], vee: ['or', 'atau'], veebar: ['exclusive or', 'atau eksklusif'], models: ['entails', 'memiliki konsekuensi'],
  top: ['true', 'benar'], bot: ['false', 'salah'], checkmark: ['check mark', 'tanda centang'], sum: ['sum', 'jumlah'], prod: ['product', 'hasil kali'], int: ['integral', 'integral'],
  langle: ['left angle bracket', 'kurung sudut kiri'], rangle: ['right angle bracket', 'kurung sudut kanan'], lfloor: ['left floor', 'lantai kiri'], rfloor: ['right floor', 'lantai kanan'],
  lceil: ['left ceiling', 'langit-langit kiri'], rceil: ['right ceiling', 'langit-langit kanan'], lVert: ['double bar', 'garis ganda'], rVert: ['double bar', 'garis ganda'], Vert: ['double bar', 'garis ganda'],
  vert: ['vertical bar', 'garis tegak'],
}

const FUNCS: Record<string, [string, string]> = {
  sin: ['sine', 'sinus'], cos: ['cosine', 'kosinus'], tan: ['tangent', 'tangen'], sec: ['secant', 'sekan'], csc: ['cosecant', 'kosekan'], cot: ['cotangent', 'kotangen'],
  arcsin: ['arc sine', 'arc sinus'], arccos: ['arc cosine', 'arc kosinus'], arctan: ['arc tangent', 'arc tangen'], arccot: ['arc cotangent', 'arc kotangen'], arcsec: ['arc secant', 'arc sekan'],
  arccsc: ['arc cosecant', 'arc kosekan'], sinh: ['hyperbolic sine', 'sinus hiperbolik'], cosh: ['hyperbolic cosine', 'kosinus hiperbolik'], tanh: ['hyperbolic tangent', 'tangen hiperbolik'],
  ln: ['natural log', 'logaritma natural'], log: ['log', 'logaritma'], exp: ['exp', 'eksponen'], lim: ['limit', 'limit'], max: ['max', 'maksimum'], min: ['min', 'minimum'], det: ['determinant', 'determinan'],
  dim: ['dimension', 'dimensi'], ker: ['kernel', 'kernel'], gcd: ['g c d', 'f p b'], deg: ['degree', 'derajat'], proj: ['projection', 'proyeksi'], comp: ['component', 'komponen'], span: ['span', 'rentang'], rank: ['rank', 'rank'],
}

const SETS: Record<string, [string, string]> = {
  N: ['the natural numbers', 'bilangan asli'], Z: ['the integers', 'bilangan bulat'], Q: ['the rational numbers', 'bilangan rasional'], R: ['the real numbers', 'bilangan real'],
  C: ['the complex numbers', 'bilangan kompleks'], P: ['the prime numbers', 'bilangan prima'],
}

const SYMBOL_NAME = new Map(SYMBOLS.map((s) => [s.cmd, s.name]))

/** Commands that draw nothing and are not read. */
const SILENT = new Set(['quad', 'qquad', 'thinspace', ',', ':', ';', '!', ' ', 'displaystyle', 'textstyle', 'limits', 'nolimits', 'left.', 'right.'])
const BIG = new Set(['big', 'Big', 'bigg', 'Bigg', 'bigl', 'bigr', 'Bigl', 'Bigr', 'biggl', 'biggr', 'Biggl', 'Biggr'])
const BIGOPS = new Set(['sum', 'prod', 'int', 'lim', 'max', 'min'])

function tokenize(src: string): string[] {
  const out: string[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '\\') {
      const m = /^[A-Za-z]+/.exec(src.slice(i + 1))
      if (m) {
        out.push('\\' + m[0])
        i += 1 + m[0].length
      } else {
        out.push('\\' + (src[i + 1] ?? ''))
        i += 2
      }
      continue
    }
    out.push(c)
    i++
  }
  return out
}

class Speaker {
  toks: string[]
  i = 0
  lang: SpeechLang
  /** inside the subscript of a limit, where an arrow is read "approaches" */
  inLimit = false

  constructor(src: string, lang: SpeechLang) {
    this.toks = tokenize(src)
    this.lang = lang
  }

  w(en: string, id: string): string {
    return this.lang === 'id' ? id : en
  }

  peek(): string | undefined {
    return this.toks[this.i]
  }

  skipSpace(): void {
    while (this.toks[this.i] === ' ' || this.toks[this.i] === '\n' || this.toks[this.i] === '\t' || this.toks[this.i] === '\r') this.i++
  }

  /** Everything up to a token the caller stops at. */
  seq(stop: (t: string) => boolean): Item {
    const parts: string[] = []
    let atoms = 0
    let last: Item | null = null
    let rich = false
    for (;;) {
      this.skipSpace()
      const t = this.peek()
      if (t === undefined || stop(t)) break
      const it = this.scripted()
      if (it.text !== '') {
        // a minus sign that is not a subtraction (at the start, or after an operator) is a negative sign
        parts.push(t === '-' && it.text === this.w('minus', 'kurang') && !last?.operand ? this.w('minus', 'negatif') : it.text)
        atoms += it.atoms
        if (it.rich) rich = true
        last = it
      }
    }
    return { text: parts.join(' '), atoms, rich }
  }

  /** One atom and its scripts. */
  scripted(): Item {
    const base = this.atom()
    let sub: Item | null = null
    let sup: Item | null = null
    for (;;) {
      this.skipSpace()
      const t = this.peek()
      if (t === '^' && sup === null) {
        this.i++
        sup = this.group()
      } else if (t === '_' && sub === null) {
        this.i++
        const was = this.inLimit
        this.inLimit = base.op === 'lim' || base.op === 'max' || base.op === 'min'
        sub = this.group()
        this.inLimit = was
      } else break
    }
    if (sub === null && sup === null) return base
    // an evaluation bar: [F(x)] from a to b
    if (sub && sup && base.text === this.w('vertical bar', 'garis tegak')) return { text: `${base.text} ${this.w('evaluated from', 'dihitung dari')} ${sub.text} ${this.w('to', 'sampai')} ${sup.text}`, atoms: 1 }
    if (base.op !== undefined) {
      let text = base.text
      if (sub && sup) text += ` ${this.w('from', 'dari')} ${sub.text} ${this.w('to', 'sampai')} ${sup.text}`
      else if (sub) text += base.op === 'lim' ? ` ${this.w('as', 'untuk')} ${sub.text}` : ` ${this.w('over', 'untuk')} ${sub.text}`
      else if (sup) text += ` ${this.w('to the power', 'pangkat')} ${sup.text}`
      if (sub || sup) text += ` ${this.w('of', 'dari')}`
      return { text, atoms: 1, op: undefined }
    }
    let text = base.text
    if (sub) text += ` ${this.w('sub', 'subskrip')} ${sub.text}${complex(sub) ? `, ${this.w('end sub', 'akhir subskrip')}` : ''}`
    if (sup) {
      const e = sup.text
      if (e === '2') text += ` ${this.w('squared', 'kuadrat')}`
      else if (e === '3') text += ` ${this.w('cubed', 'kubik')}`
      else if (e === this.w('degrees', 'derajat')) text += ` ${e}`
      else if (e === this.w('prime', 'aksen')) text += ` ${e}`
      else text += ` ${this.w('to the power', 'pangkat')} ${e}${complex(sup) ? `, ${this.w('end power', 'akhir pangkat')}` : ''}`
    }
    return { text, atoms: 1, operand: base.operand }
  }

  /** A braced group, or the single token standing in for it. */
  group(): Item {
    this.skipSpace()
    if (this.peek() === '{') {
      this.i++
      const it = this.seq((t) => t === '}')
      if (this.peek() === '}') this.i++
      return it
    }
    // TeX's rule for an unbraced argument: one token, so a number stops after its first digit
    if (/^[0-9]$/.test(this.toks[this.i] ?? '')) return { text: this.toks[this.i++], atoms: 1, operand: true }
    return this.atom()
  }

  /** The characters of {...}, for \text. */
  raw(): string {
    this.skipSpace()
    if (this.peek() !== '{') return this.toks[this.i++] ?? ''
    this.i++
    let depth = 1
    let out = ''
    while (this.i < this.toks.length) {
      const t = this.toks[this.i++]
      if (t === '{') depth++
      else if (t === '}') {
        depth--
        if (depth === 0) break
      }
      out += t
    }
    return out
  }

  atom(): Item {
    this.skipSpace()
    const t = this.toks[this.i]
    if (t === undefined) return { text: '', atoms: 0 }
    if (t === '{') {
      this.i++
      const it = this.seq((x) => x === '}')
      if (this.peek() === '}') this.i++
      return { text: it.text, atoms: Math.max(1, it.atoms), rich: it.atoms > 2, operand: true }
    }
    if (t === '}') {
      this.i++
      return { text: '', atoms: 0 }
    }
    this.i++
    if (t.startsWith('\\')) return this.command(t.slice(1))
    if (/[0-9]/.test(t)) {
      let num = t
      for (;;) {
        if (/^[0-9]$/.test(this.toks[this.i] ?? '')) num += this.toks[this.i++]
        // a thin space between digit groups (31\,622) is part of the number
        else if ((this.toks[this.i] === '\\,' || this.toks[this.i] === '\\;') && /^[0-9]$/.test(this.toks[this.i + 1] ?? '')) this.i++
        else break
      }
      // a decimal mark: a point, or the {,} the Indonesian text writes (a plain comma between digits is a list separator)
      if (this.toks[this.i] === '.' && /^[0-9]$/.test(this.toks[this.i + 1] ?? '')) {
        num += this.toks[this.i++]
        while (/^[0-9]$/.test(this.toks[this.i] ?? '')) num += this.toks[this.i++]
      } else if (this.toks[this.i] === '{' && this.toks[this.i + 1] === ',' && this.toks[this.i + 2] === '}' && /^[0-9]$/.test(this.toks[this.i + 3] ?? '')) {
        num += ','
        this.i += 3
        while (/^[0-9]$/.test(this.toks[this.i] ?? '')) num += this.toks[this.i++]
      }
      return { text: num, atoms: 1, operand: true }
    }
    if (/[A-Za-z]/.test(t)) return { text: t, atoms: 1, operand: true }
    switch (t) {
      case '+':
        return { text: this.w('plus', 'tambah'), atoms: 1 }
      case '-':
      case '−':
        return { text: this.w('minus', 'kurang'), atoms: 1 }
      case '=':
        return { text: this.w('equals', 'sama dengan'), atoms: 1 }
      case '<':
        return { text: this.w('is less than', 'kurang dari'), atoms: 1 }
      case '>':
        return { text: this.w('is greater than', 'lebih dari'), atoms: 1 }
      case '*':
        return { text: this.w('times', 'kali'), atoms: 1 }
      case '/':
        return { text: this.w('slash', 'garis miring'), atoms: 1 }
      case '!':
        return { text: this.w('factorial', 'faktorial'), atoms: 1 }
      case '%':
        return { text: this.w('percent', 'persen'), atoms: 1 }
      case '(':
        return { text: this.w('left paren', 'buka kurung'), atoms: 1 }
      case ')':
        return { text: this.w('right paren', 'tutup kurung'), atoms: 1, operand: true }
      case '[':
        return { text: this.w('left bracket', 'buka kurung siku'), atoms: 1 }
      case ']':
        return { text: this.w('right bracket', 'tutup kurung siku'), atoms: 1 }
      case '|':
        return { text: this.w('vertical bar', 'garis tegak'), atoms: 1 }
      case "'":
        return { text: this.w('prime', 'aksen'), atoms: 1 }
      case ',':
        return { text: ',', atoms: 1 }
      case ';':
        return { text: ';', atoms: 1 }
      case ':':
        return { text: this.w('colon', 'titik dua'), atoms: 1 }
      case '.':
        return { text: this.w('point', 'titik'), atoms: 1 }
      case '&':
        return { text: ',', atoms: 0 }
      case '^':
      case '_':
        return { text: '', atoms: 0 }
    }
    return { text: t, atoms: 1 }
  }

  command(name: string): Item {
    if (SILENT.has(name)) return { text: '', atoms: 0 }
    if (name === '\\') return { text: ',', atoms: 0 }
    if (name in GREEK) return { text: GREEK[name][this.lang === 'id' ? 1 : 0], atoms: 1 }
    switch (name) {
      case 'frac':
      case 'dfrac':
      case 'tfrac': {
        const a = this.group()
        const b = this.group()
        const simple = !complex(a) && !complex(b)
        return { text: simple ? `${a.text} ${this.w('over', 'per')} ${b.text}` : `${this.w('fraction', 'pecahan')}, ${a.text}, ${this.w('over', 'per')}, ${b.text}, ${this.w('end fraction', 'akhir pecahan')}`, atoms: 1, rich: true, operand: true }
      }
      case 'binom':
      case 'dbinom':
      case 'tbinom': {
        const a = this.group()
        const b = this.group()
        return { text: `${a.text} ${this.w('choose', 'pilih')} ${b.text}`, atoms: 1, rich: true, operand: true }
      }
      case 'sqrt': {
        this.skipSpace()
        let index = ''
        if (this.peek() === '[') {
          this.i++
          const idx = this.seq((t) => t === ']')
          if (this.peek() === ']') this.i++
          index = idx.text
        }
        const r = this.group()
        const head = index === '' ? this.w('square root of', 'akar kuadrat dari') : index === '3' ? this.w('cube root of', 'akar pangkat tiga dari') : this.w(`root of order ${index} of`, `akar pangkat ${index} dari`)
        return { text: `${head} ${r.text}${complex(r) ? `, ${this.w('end root', 'akhir akar')}` : ''}`, atoms: 1, rich: true, operand: true }
      }
      case 'vec': {
        const x = this.group()
        return { text: `${this.w('vector', 'vektor')} ${x.text}`, atoms: 1 }
      }
      case 'hat': {
        const x = this.group()
        return { text: `${x.text} ${this.w('hat', 'topi')}`, atoms: 1 }
      }
      case 'bar':
      case 'overline': {
        const x = this.group()
        return { text: `${x.text} ${this.w('bar', 'garis atas')}`, atoms: 1 }
      }
      case 'dot': {
        const x = this.group()
        return { text: `${x.text} ${this.w('dot', 'titik')}`, atoms: 1 }
      }
      case 'mathbf':
      case 'boldsymbol': {
        const x = this.group()
        return { text: `${this.w('bold', 'tebal')} ${x.text}`, atoms: 1 }
      }
      case 'mathrm':
      case 'operatorname':
        return { text: this.raw(), atoms: 1 }
      case 'text':
      case 'textrm':
        return { text: this.raw().replace(/\s+/g, ' ').trim(), atoms: 1 }
      case 'mathbb': {
        const letter = this.raw()
        return { text: (SETS[letter] ?? [letter, letter])[this.lang === 'id' ? 1 : 0], atoms: 1 }
      }
      case 'left':
      case 'right': {
        this.skipSpace()
        const d = this.toks[this.i++] ?? ''
        return this.delimiter(d, name === 'left')
      }
      case 'begin':
        return this.environment(this.raw())
      case 'end':
        this.raw()
        return { text: '', atoms: 0 }
    }
    if (BIG.has(name)) {
      this.skipSpace()
      const d = this.toks[this.i++] ?? ''
      return this.delimiter(d, !name.endsWith('r'))
    }
    if (name === 'to' && this.inLimit) return { text: this.w('approaches', 'menuju'), atoms: 1 }
    if (name === 'circ') return { text: this.w('degrees', 'derajat'), atoms: 1 }
    if (name in FUNCS) {
      const f = FUNCS[name][this.lang === 'id' ? 1 : 0]
      return { text: f, atoms: 1, op: BIGOPS.has(name) ? name : undefined }
    }
    if (name in OPS) return { text: OPS[name][this.lang === 'id' ? 1 : 0], atoms: 1, op: BIGOPS.has(name) ? name : undefined }
    const sym = SYMBOL_NAME.get(name)
    if (sym) return { text: sym[this.lang === 'id' ? 'id' : 'en'], atoms: 1 }
    if (name.length === 1) {
      // an escaped character: \% \& \# \_ \{ \} \| \$
      const one: Record<string, [string, string]> = { '%': ['percent', 'persen'], '&': ['and', 'dan'], '#': ['number sign', 'tanda pagar'], _: ['underscore', 'garis bawah'], '{': ['left brace', 'buka kurung kurawal'], '}': ['right brace', 'tutup kurung kurawal'], '|': ['double bar', 'garis ganda'], $: ['dollar', 'dolar'] }
      if (name in one) return { text: one[name][this.lang === 'id' ? 1 : 0], atoms: 1 }
      return { text: '', atoms: 0 }
    }
    return { text: name, atoms: 1 }
  }

  delimiter(d: string, open: boolean): Item {
    if (d === '' || d === '.') return { text: '', atoms: 0 }
    const name = d.startsWith('\\') ? d.slice(1) : d
    const words: Record<string, [string, string]> = {
      '(': ['left paren', 'buka kurung'], ')': ['right paren', 'tutup kurung'], '[': ['left bracket', 'buka kurung siku'], ']': ['right bracket', 'tutup kurung siku'],
      '{': ['left brace', 'buka kurung kurawal'], '}': ['right brace', 'tutup kurung kurawal'], '|': ['vertical bar', 'garis tegak'], '\\|': ['double bar', 'garis ganda'],
      Vert: ['double bar', 'garis ganda'], vert: ['vertical bar', 'garis tegak'], lVert: ['double bar', 'garis ganda'], rVert: ['double bar', 'garis ganda'], langle: ['left angle bracket', 'kurung sudut kiri'],
      rangle: ['right angle bracket', 'kurung sudut kanan'], lfloor: ['left floor', 'lantai kiri'], rfloor: ['right floor', 'lantai kanan'], lceil: ['left ceiling', 'langit-langit kiri'], rceil: ['right ceiling', 'langit-langit kanan'],
    }
    const hit = words[d] ?? words[name]
    if (hit) return { text: hit[this.lang === 'id' ? 1 : 0], atoms: 1 }
    return { text: open ? this.w('open', 'buka') : this.w('close', 'tutup'), atoms: 1 }
  }

  /** matrix, vmatrix, cases, aligned: rows of cells separated by & and \\ */
  environment(env: string): Item {
    const rows: string[][] = [[]]
    for (;;) {
      this.skipSpace()
      const t = this.peek()
      if (t === undefined) break
      if (t === '\\end') {
        this.i++
        this.raw()
        break
      }
      if (t === '&') {
        this.i++
        continue
      }
      if (t === '\\\\') {
        this.i++
        rows.push([])
        continue
      }
      const cell = this.seq((x) => x === '&' || x === '\\\\' || x === '\\end')
      rows[rows.length - 1].push(cell.text)
    }
    const filled = rows.filter((r) => r.some((c) => c !== ''))
    const cols = Math.max(0, ...filled.map((r) => r.length))
    const row = (r: string[], k: number): string => `${this.w('row', 'baris')} ${k + 1}: ${r.join(', ')}`
    const body = filled.map(row).join('; ')
    if (env === 'cases') {
      const cases = filled.map((r, k) => `${this.w('case', 'kasus')} ${k + 1}: ${r.join(', ')}`).join('; ')
      return { text: `${this.w('cases', 'sepotong-sepotong')}: ${cases}, ${this.w('end cases', 'akhir sepotong-sepotong')}`, atoms: 1 }
    }
    if (env === 'aligned' || env === 'array') return { text: `${body}`, atoms: 1 }
    const head = env === 'vmatrix' || env === 'Vmatrix' ? this.w('determinant of the matrix with', 'determinan matriks dengan') : this.w('matrix with', 'matriks dengan')
    return { text: `${head} ${filled.length} ${this.w(filled.length === 1 ? 'row' : 'rows', 'baris')} ${this.w('and', 'dan')} ${cols} ${this.w(cols === 1 ? 'column' : 'columns', 'kolom')}: ${body}, ${this.w('end matrix', 'akhir matriks')}`, atoms: 1 }
  }
}

/** The formula in words: no backslash, no brace, no caret, nothing a reader would spell out. */
export function texSpeech(src: string, lang: SpeechLang = 'en'): string {
  const sp = new Speaker(src, lang)
  const it = sp.seq(() => false)
  return it.text
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,(\s*,)+/g, ',')
    .replace(/\s+;/g, ';')
    .trim()
}
