/** Checks src/lib/latex.ts, the tables and helpers behind the "LaTeX" article.
 *
 *  References that do not use the code under test:
 *   1. A second implementation of the linter in Python (written from the rules, scanning character by character instead of with
 *      regular expressions), compared on hand-written formulas and on thousands of random strings of LaTeX-like tokens.
 *   2. The generators of fractions, sums, matrices and the rest, and the document builder, written again in Python and compared
 *      text for text on random fields and options; and the rules of the document (no abstract in a book, hyperref last, graphicx
 *      added for a figure) checked on the result.
 *   3. The escaping of the ten special characters, rewritten in Python.
 *   4. The Unicode database (unicodedata) for the name of the character the page draws for each symbol, and the page's own renderer
 *      (src/lib/tex.ts) for what it can and cannot draw.
 *
 *  Run: npm run check:latex   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'latex-'))
const bundle = async (entry, name) => {
  const out = path.join(tmp, name)
  await build({ entryPoints: [path.join(ROOT, entry)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
  return import(pathToFileURL(out).href)
}
const M = await bundle('src/lib/latex.ts', 'latex.mjs')
const TEX = await bundle('src/lib/tex.ts', 'tex.mjs')

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))

/* ------------------------------------------------------------------------------- the inputs */
const HAND = [
  '', 'x', '\\frac{a}{b}', '\\frac{a}', '\\frac a b', '\\frac12', '\\frac', '\\frac{}{}', '\\frac{a}{', '\\sqrt{x}', '\\sqrt[3]{x}', '\\sqrt[3]', '\\sqrt', '\\sqrt x',
  'x^10', 'x^{10}', 'x_ij', 'x_{ij}', 'e^-x', 'e^{-x}', 'x^2y', 'x^2 y', 'a_1b', 'x^ 12', 'x_-1', 'x^+y', 'x^-', 'x^',
  '\\left( \\frac{a}{b} \\right)', '\\left( a', 'a \\right)', '\\left. a \\right|', '\\left\\{ a \\right\\}',
  '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', '\\begin{pmatrix} a & b', 'a & b', '\\begin{cases} x & y \\end{matrix}', '\\end{pmatrix}', '\\begin pmatrix', '\\begin{a}\\begin{b}\\end{b}\\end{a}',
  '{a', 'a}', '{{a}', '{a}}', '\\{ a \\}', '\\{ a', 'a \\}',
  '\\foo', '\\alpha + \\foo{x}', '\\binom{n}{k}', '\\displaystyle x', '\\mathcal{A}', '\\mathbb{R}', '\\mathbb', '\\text{if } x', '\\text',
  '$x$', 'a % comment', 'a % c \n \\foo', '100\\%', 'a \\\\ b', '\\,', '\\ ', 'a\\', '\\\\',
  '\\sum_{i=1}^{n} i^2', '\\int_0^1 x \\, dx', '\\lim_{x \\to 0} \\frac{\\sin x}{x}', 'f(x) = \\begin{cases} x^2 & x \\ge 0 \\\\ -x & x < 0 \\end{cases}',
  '\\hat{x} + \\vec v + \\bar{y} + \\overline{z}', '\\hat', '\\vec', '\\frac{\\frac{a}{b}}{c}', '\\frac{{a}}{{b}}', '\\frac{\\frac{a}{b}}',
]
const TOKENS = [
  '{', '}', '{', '}', '\\left(', '\\right)', '\\left', '\\right', '\\frac', '\\sqrt', '\\sqrt[3]', '\\begin{pmatrix}', '\\end{pmatrix}', '\\begin{cases}', '\\end{cases}',
  '\\begin{aligned}', '\\end{aligned}', '\\begin', '\\end', '&', '\\\\', '\\alpha', '\\foo', '\\binom', '\\text', '\\mathbb', '$', '%', '\n', ' ', ' ', 'x', 'y', '1', '2', '10',
  '_', '^', '_', '^', '-', '+', 'a', 'b', 'ab', '\\{', '\\}', '\\%', '\\hat', '\\vec', '\\displaystyle', '\\frac{a}{b}', '\\sum', '\\to', '\\mathcal', '\\sqrt{x}', '12', '\\,', '\\ ',
]
const lintCases = [...HAND]
for (let t = 0; t < 4000; t++) lintCases.push(Array.from({ length: rndInt(1, 24) }, () => pick(TOKENS)).join(''))

const KINDS = ['fraction', 'root', 'power', 'sum', 'product', 'integral', 'limit', 'matrix', 'cases']
const FIELD = ['x', '2', 'a+b', 'n', '\\pi', '', ' k ', '10', 'x^2', '\\infty', '1']
const genCases = []
for (let t = 0; t < 1500; t++) {
  const kind = pick(KINDS)
  const p = {}
  for (const f of ['num', 'den', 'radicand', 'index', 'base', 'exponent', 'var', 'from', 'to', 'body', 'entry', 'name', 'e1', 'c1', 'e2', 'c2', 'e3', 'c3']) p[f] = pick(FIELD)
  p.rows = pick(['1', '2', '3', '4', '5', '6', '0', 'x', '2.7', ''])
  p.cols = pick(['1', '2', '3', '4', '5', '6', '0', 'x', ''])
  p.fence = pick(['pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix', ''])
  genCases.push({ kind, p })
}

const PACKAGES = ['amsmath', 'amssymb', 'graphicx', 'booktabs', 'hyperref']
const docCases = []
for (let t = 0; t < 600; t++) {
  docCases.push({
    docClass: pick(['article', 'report', 'book']),
    size: pick([10, 11, 12]),
    paper: pick(['a4paper', 'letterpaper']),
    packages: PACKAGES.filter(() => Math.random() < 0.5),
    margin: pick(['', '2.5cm', ' 1in ', '3cm']),
    title: pick(['My Document', 'Notes', 'A \\& B']),
    author: pick(['Nada', 'Your Name']),
    abstract: Math.random() < 0.5,
    units: pick([0, 1, 2, 3, 4, 5, 9]),
    equation: Math.random() < 0.5,
    table: Math.random() < 0.5,
    figure: Math.random() < 0.5,
    bibliography: Math.random() < 0.5,
  })
}

const SPECIALS = ['\\', '&', '%', '$', '#', '_', '{', '}', '~', '^', 'a', 'b', ' ', '1', 'é', '日', '-', '.']
const escCases = []
for (let t = 0; t < 600; t++) escCases.push(Array.from({ length: rndInt(0, 14) }, () => pick(SPECIALS)).join(''))

const symbolChars = []
for (const sy of M.SYMBOLS) {
  if (sy.unicode === null) continue
  const html = TEX.tex('\\' + sy.cmd)
  const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, '')
  symbolChars.push(text)
}

/* ------------------------------------------------------------------------------ the Python side */
const PY = String.raw`
import json, sys, unicodedata, math
data = json.load(sys.stdin)
known = set(data['known']); real_only = set(data['real_only']); ARGS = data['args']

def is_alpha(c):
    return ('a' <= c <= 'z') or ('A' <= c <= 'Z')
def is_digit(c):
    return '0' <= c <= '9'

def lint(src):
    out = []; braces = []; lefts = []; envs = []
    n = len(src); i = 0
    def skip_sp(j):
        while j < n and src[j] in ' \n\t\r':
            j += 1
        return j
    def arg_end(j):
        j = skip_sp(j)
        if j >= n:
            return -1
        c = src[j]
        if c == '}':
            return -1
        if c == '{':
            depth = 0; k = j
            while k < n:
                d = src[k]
                if d == '\\':
                    k += 2
                    continue
                if d == '{':
                    depth += 1
                elif d == '}':
                    depth -= 1
                    if depth == 0:
                        return k + 1
                k += 1
            return -1
        if c == '\\':
            k = j + 1
            if k < n and is_alpha(src[k]):
                while k < n and is_alpha(src[k]):
                    k += 1
                return k
            return min(j + 2, n) if k < n else j + 1
        return j + 1
    while i < n:
        c = src[i]
        if c == '%':
            out.append([i, 'comment', None])
            while i < n and src[i] != '\n':
                i += 1
            continue
        if c == '\\':
            if i + 1 < n and is_alpha(src[i + 1]):
                k = i + 1
                while k < n and is_alpha(src[k]):
                    k += 1
                name = src[i + 1:k]; start = i; i = k
                if name == 'left':
                    lefts.append(start)
                elif name == 'right':
                    if lefts:
                        lefts.pop()
                    else:
                        out.append([start, 'extra-right', None])
                elif name in ('begin', 'end'):
                    j = skip_sp(i)
                    matched = False
                    if j < n and src[j] == '{':
                        k = j + 1
                        while k < n and src[k] not in '{}':
                            k += 1
                        if k < n and src[k] == '}':
                            matched = True
                            env = src[j + 1:k]
                            i = k + 1
                    if not matched:
                        out.append([start, 'missing-arg', name])
                        continue
                    if name == 'begin':
                        envs.append([env, start])
                    elif not envs:
                        out.append([start, 'env-extra-end', env])
                    else:
                        top = envs.pop()
                        if top[0] != env:
                            out.append([start, 'env-mismatch', top[0] + '|' + env])
                else:
                    argc = ARGS.get(name, 0)
                    j = i
                    if name == 'sqrt':
                        kk = skip_sp(i)
                        if kk < n and src[kk] == '[':
                            close = src.find(']', kk)
                            if close >= 0:
                                j = close + 1
                    for _ in range(argc):
                        e = arg_end(j)
                        if e < 0:
                            out.append([start, 'missing-arg', name])
                            break
                        j = e
                    if name not in known:
                        out.append([start, 'unsupported' if name in real_only else 'undefined', name])
                continue
            i += 2
            continue
        if c == '{':
            braces.append(i)
        elif c == '}':
            if braces:
                braces.pop()
            else:
                out.append([i, 'extra-close', None])
        elif c == '$':
            out.append([i, 'dollar', None])
        elif c == '&':
            if not envs:
                out.append([i, 'ampersand', None])
        elif c in '^_':
            j = skip_sp(i + 1)
            if j + 1 < n:
                a = src[j]; b = src[j + 1]
                if a in '-+' and (is_alpha(b) or is_digit(b) or b in '\\{'):
                    out.append([i, 'script-sign', c])
                elif (is_digit(a) and is_digit(b)) or (is_alpha(a) and is_alpha(b)):
                    out.append([i, 'script-multi', c])
        i += 1
    for p in braces:
        out.append([p, 'missing-close', None])
    for p in lefts:
        out.append([p, 'missing-right', None])
    for name, p in envs:
        out.append([p, 'env-unclosed', name])
    out.sort(key=lambda d: (d[0], d[1]))
    return out

def gen(kind, p):
    g = lambda k: p.get(k, '').strip()
    if kind == 'fraction':
        return '\\frac{' + g('num') + '}{' + g('den') + '}'
    if kind == 'root':
        return '\\sqrt{' + g('radicand') + '}' if g('index') == '' else '\\sqrt[' + g('index') + ']{' + g('radicand') + '}'
    if kind == 'power':
        return g('base') + '^{' + g('exponent') + '}'
    if kind in ('sum', 'product'):
        op = '\\sum' if kind == 'sum' else '\\prod'
        return op + '_{' + g('var') + '=' + g('from') + '}^{' + g('to') + '} ' + g('body')
    if kind == 'integral':
        return '\\int_{' + g('from') + '}^{' + g('to') + '} ' + g('body') + ' \\, d' + g('var')
    if kind == 'limit':
        return '\\lim_{' + g('var') + ' \\to ' + g('to') + '} ' + g('body')
    if kind == 'matrix':
        def num(s, default):
            try:
                v = float(s)
            except ValueError:
                return default
            return default if v != v or v == 0 else v
        rows = int(min(5, max(1, math.floor(num(p.get('rows', ''), 1)))))
        cols = int(min(5, max(1, math.floor(num(p.get('cols', ''), 1)))))
        env = p.get('fence', '') if p.get('fence', '') in ('pmatrix', 'bmatrix', 'vmatrix') else 'pmatrix'
        letter = g('entry') or 'a'
        lines = []
        for r in range(1, rows + 1):
            cells = [letter + '_{' + str(r) + str(c) + '}' for c in range(1, cols + 1)]
            lines.append('  ' + ' & '.join(cells) + (' \\\\' if r < rows else ''))
        return '\\begin{' + env + '}\n' + '\n'.join(lines) + '\n\\end{' + env + '}'
    if kind == 'cases':
        lines = []
        for k in (1, 2, 3):
            e = g('e%d' % k); c = g('c%d' % k)
            if e != '' or c != '':
                lines.append(e + ' & ' + c)
        head = '' if g('name') == '' else g('name') + ' = '
        body = '\n'.join('  ' + l + (' \\\\' if i < len(lines) - 1 else '') for i, l in enumerate(lines))
        return head + '\\begin{cases}\n' + body + '\n\\end{cases}'
    raise ValueError(kind)

SPECIAL = {'\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', '$': '\\$', '#': '\\#', '_': '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}'}
def esc(t):
    return ''.join(SPECIAL.get(c, c) for c in t)

def doc(o):
    notes = []
    pk = set(o['packages'])
    if o['figure'] and 'graphicx' not in pk:
        pk.add('graphicx'); notes.append('graphicx-added')
    margin = o['margin'].strip()
    L = []
    L.append('\\documentclass[%dpt,%s]{%s}' % (o['size'], o['paper'], o['docClass'])); L.append('')
    used = [x for x in ('amsmath', 'amssymb', 'graphicx', 'booktabs') if x in pk]
    anything = bool(used) or margin != '' or 'hyperref' in pk
    if anything:
        L.append('% packages')
    for x in used:
        L.append('\\usepackage{%s}' % x)
    if margin != '':
        L.append('\\usepackage[margin=%s]{geometry}' % margin); notes.append('geometry-added')
    if 'hyperref' in pk:
        L.append('\\usepackage{hyperref}'); notes.append('hyperref-last')
    if anything:
        L.append('')
    L += ['\\title{%s}' % o['title'], '\\author{%s}' % o['author'], '\\date{\\today}', '', '\\begin{document}', '', '\\maketitle', '']
    if o['abstract']:
        if o['docClass'] == 'book':
            notes.append('no-abstract')
        else:
            L += ['\\begin{abstract}', 'A few sentences that say what this document is about.', '\\end{abstract}', '']
    unit = 'section' if o['docClass'] == 'article' else 'chapter'
    eqref = '\\eqref{eq:main}' if 'amsmath' in pk else '(\\ref{eq:main})'
    if o['equation'] and 'amsmath' not in pk:
        notes.append('ref-instead-of-eqref')
    for k in range(1, min(4, max(1, o['units'])) + 1):
        L += ['\\%s{%s}' % (unit, 'Introduction' if k == 1 else 'Part %d' % k), '']
        if k == 1:
            L.append('Text with inline mathematics, such as $a^2 + b^2 = c^2$.')
            if o['bibliography']:
                L.append('This idea goes back to Knuth~\\cite{knuth1984}.')
            L.append('')
            if o['equation']:
                L += ['\\begin{equation}', '  \\label{eq:main}', '  e^{i\\pi} + 1 = 0', '\\end{equation}', '', 'Equation~%s is Euler\'s identity.' % eqref, '']
            if o['table']:
                bt = 'booktabs' in pk
                top = '\\toprule' if bt else '\\hline'; mid = '\\midrule' if bt else '\\hline'; bottom = '\\bottomrule' if bt else '\\hline'
                L += ['\\begin{table}[ht]', '  \\centering', '  \\begin{tabular}{lr}', '    ' + top, '    Name & Value \\\\', '    ' + mid,
                      '    $\\pi$ & 3.14159 \\\\', '    $e$ & 2.71828 \\\\', '    ' + bottom, '  \\end{tabular}', '  \\caption{Two constants.}',
                      '  \\label{tab:constants}', '\\end{table}', '', 'Table~\\ref{tab:constants} lists them.', '']
            if o['figure']:
                L += ['\\begin{figure}[ht]', '  \\centering', '  \\includegraphics[width=0.6\\textwidth]{figure.png}', '  \\caption{A figure.}',
                      '  \\label{fig:main}', '\\end{figure}', '', 'Figure~\\ref{fig:main} shows it.', '']
        else:
            L += ['More text.', '']
    if o['bibliography']:
        L += ['\\bibliographystyle{plain}', '\\bibliography{references}', '']
    L += ['\\end{document}', '']
    labelled = o['equation'] or o['table'] or o['figure']
    if o['bibliography']:
        cmds = ['pdflatex main', 'bibtex main', 'pdflatex main', 'pdflatex main']
    elif labelled:
        cmds = ['pdflatex main', 'pdflatex main']
    else:
        cmds = ['pdflatex main']
    return {'source': '\n'.join(L), 'notes': notes, 'commands': cmds}

res = {}
res['lint'] = [lint(s) for s in data['lint']]
res['gen'] = [gen(c['kind'], c['p']) for c in data['gen']]
res['esc'] = [esc(s) for s in data['esc']]
res['doc'] = [doc(o) for o in data['doc']]
res['names'] = [(unicodedata.name(c) if len(c) == 1 else None) for c in data['chars']]
json.dump(res, sys.stdout)
`
const payload = {
  known: [...M.KNOWN],
  real_only: [...M.REAL_ONLY],
  args: M.ARGS,
  lint: lintCases,
  gen: genCases,
  esc: escCases,
  doc: docCases,
  chars: symbolChars,
}
const py = spawnSync('python', ['-I', '-X', 'utf8', '-c', PY], { input: JSON.stringify(payload), encoding: 'utf8', maxBuffer: 1 << 28, timeout: 240000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* ------------------------------------------------------------------------------- 1: the linter */
lintCases.forEach((src, i) => {
  const mine = M.texLint(src).map((d) => [d.pos, d.kind, d.arg ?? null])
  const ref = R.lint[i]
  ok(JSON.stringify(mine) === JSON.stringify(ref), `lint of ${JSON.stringify(src)}: ${JSON.stringify(mine)}, Python ${JSON.stringify(ref)}`)
})
const kinds = (src) => M.texLint(src).map((d) => d.kind).join()
// what the rules mean, on the cases of the article
ok(kinds('\\frac{a}{b}') === '' && kinds('\\frac{a}') === 'missing-arg' && kinds('\\frac12') === '', 'fractions')
ok(kinds('x^10') === 'script-multi' && kinds('x^{10}') === '' && kinds('e^-x') === 'script-sign' && kinds('x_ij') === 'script-multi' && kinds('x^2y') === '', 'scripts')
ok(kinds('\\left( a') === 'missing-right' && kinds('a \\right)') === 'extra-right' && kinds('\\left( a \\right)') === '', 'left and right')
ok(kinds('{a') === 'missing-close' && kinds('a}') === 'extra-close' && kinds('\\{ a \\}') === '', 'braces')
ok(kinds('\\begin{pmatrix} a \\end{matrix}') === 'env-mismatch' && kinds('\\begin{pmatrix} a') === 'env-unclosed' && kinds('a \\end{pmatrix}') === 'env-extra-end', 'environments')
ok(kinds('a & b') === 'ampersand' && kinds('\\begin{pmatrix} a & b \\end{pmatrix}') === '', 'ampersand')
ok(kinds('\\foo') === 'undefined' && kinds('\\binom{n}{k}') === 'unsupported' && kinds('\\alpha') === '' && kinds('$x$') === 'dollar,dollar' && kinds('a % b') === 'comment', 'commands, dollar, comment')
ok(M.texLint('{a')[0].pos === 0 && M.texLint('ab}')[0].pos === 2, 'positions')

/* ---------------------------------------------------------------------- 2: generators and documents */
genCases.forEach((c, i) => {
  const mine = M.texGen(c.kind, c.p)
  ok(mine === R.gen[i], `texGen ${c.kind} ${JSON.stringify(c.p)}: ${JSON.stringify(mine)}, Python ${JSON.stringify(R.gen[i])}`)
})
{
  // the generated code of a well-formed form is clean for the linter and drawn by the page
  const good = (kind, p) => {
    const out = M.texGen(kind, p)
    ok(M.texLint(out).length === 0, `texGen ${kind} is lint-clean: ${JSON.stringify(out)}`)
    const html = TEX.tex(out)
    ok(!/\\/.test(html.replace(/<mspace[^>]*>/g, '')), `texGen ${kind} is drawn by the page: ${out}`)
    return out
  }
  ok(good('fraction', { num: 'a+b', den: '2' }) === '\\frac{a+b}{2}', 'a fraction')
  ok(good('root', { radicand: 'x', index: '3' }) === '\\sqrt[3]{x}' && good('root', { radicand: 'x', index: '' }) === '\\sqrt{x}', 'roots')
  ok(good('power', { base: 'x', exponent: '10' }) === 'x^{10}', 'a power')
  ok(good('sum', { var: 'i', from: '1', to: 'n', body: 'i^2' }) === '\\sum_{i=1}^{n} i^2', 'a sum')
  ok(good('product', { var: 'k', from: '1', to: 'n', body: 'k' }) === '\\prod_{k=1}^{n} k', 'a product')
  ok(good('integral', { var: 'x', from: '0', to: '1', body: 'x^2' }) === '\\int_{0}^{1} x^2 \\, dx', 'an integral')
  ok(good('limit', { var: 'x', to: '0', body: '\\frac{\\sin x}{x}' }) === '\\lim_{x \\to 0} \\frac{\\sin x}{x}', 'a limit')
  ok(good('matrix', { rows: '2', cols: '2', fence: 'pmatrix', entry: 'a' }) === '\\begin{pmatrix}\n  a_{11} & a_{12} \\\\\n  a_{21} & a_{22}\n\\end{pmatrix}', 'a matrix')
  ok(good('matrix', { rows: '3', cols: '1', fence: 'vmatrix', entry: 'x' }).startsWith('\\begin{vmatrix}'), 'a column in bars')
  ok(good('cases', { name: 'f(x)', e1: 'x^2', c1: 'x \\ge 0', e2: '-x', c2: 'x < 0' }) === 'f(x) = \\begin{cases}\n  x^2 & x \\ge 0 \\\\\n  -x & x < 0\n\\end{cases}', 'a piecewise function')
}
docCases.forEach((o, i) => {
  const mine = M.texDocument(o)
  const ref = R.doc[i]
  ok(mine.source === ref.source && JSON.stringify(mine.notes) === JSON.stringify(ref.notes) && JSON.stringify(mine.commands) === JSON.stringify(ref.commands), `texDocument ${JSON.stringify(o)} differs from Python`)
  // the rules of the document, checked on the text
  const src = mine.source
  const lines = src.split('\n')
  ok(lines[0].startsWith('\\documentclass[') && lines.indexOf('\\begin{document}') > 0 && lines[lines.indexOf('\\begin{document}') - 1] !== undefined, 'documentclass first')
  const preamble = lines.slice(0, lines.indexOf('\\begin{document}'))
  const body = lines.slice(lines.indexOf('\\begin{document}'))
  ok(!body.some((l) => l.startsWith('\\usepackage')) && preamble.some((l) => l.startsWith('\\documentclass')), 'packages are loaded before \\begin{document}')
  ok(lines[lines.length - 2] === '\\end{document}' && lines[lines.length - 1] === '', 'ends with \\end{document}')
  ok(M.texLint(body.join('\n').replace(/\\begin\{document\}/, '').replace(/\\end\{document\}/, '')).filter((d) => d.kind === 'env-mismatch' || d.kind === 'env-unclosed' || d.kind === 'env-extra-end').length === 0, `environments balance in ${JSON.stringify(o).slice(0, 80)}`)
  const pk = preamble.filter((l) => l.startsWith('\\usepackage'))
  if (o.packages.includes('hyperref')) ok(pk[pk.length - 1] === '\\usepackage{hyperref}', 'hyperref comes last')
  ok(!(o.docClass === 'book' && src.includes('\\begin{abstract}')), 'no abstract in a book')
  ok(o.docClass !== 'book' || !o.abstract || mine.notes.includes('no-abstract'), 'the missing abstract of a book is announced')
  if (o.figure) ok(src.includes('\\usepackage{graphicx}') && src.includes('\\includegraphics'), 'a figure needs graphicx')
  else ok(!src.includes('\\includegraphics'), 'no includegraphics without a figure')
  ok((o.docClass === 'article') === (src.includes('\\section{') && !src.includes('\\chapter{')), 'sections for articles, chapters for the others')
  ok((src.match(/\\(?:section|chapter)\{/g) ?? []).length === Math.min(4, Math.max(1, o.units)), 'the number of units')
  if (o.equation) ok(o.packages.includes('amsmath') ? src.includes('\\eqref{eq:main}') : src.includes('(\\ref{eq:main})') && !src.includes('\\eqref'), 'eqref needs amsmath')
  if (o.table) ok(o.packages.includes('booktabs') ? src.includes('\\toprule') && !src.includes('\\hline') : src.includes('\\hline') && !src.includes('\\toprule'), 'booktabs rules')
  const m = o.margin.trim()
  ok(m === '' ? !src.includes('geometry') : src.includes(`\\usepackage[margin=${m}]{geometry}`), 'geometry only with a margin')
  ok(o.bibliography ? mine.commands.length === 4 && mine.commands[1] === 'bibtex main' && src.includes('\\bibliography{references}') && src.includes('\\cite{knuth1984}') : !src.includes('\\bibliography'), 'bibliography and its commands')
  ok(o.bibliography || (o.equation || o.table || o.figure ? mine.commands.length === 2 : mine.commands.length === 1), 'runs of pdflatex')
})
ok(M.texDocument({ docClass: 'article', size: 11, paper: 'a4paper', packages: [], margin: '', title: 'T', author: 'A', abstract: false, units: 1, equation: false, table: false, figure: false, bibliography: false }).source ===
  '\\documentclass[11pt,a4paper]{article}\n\n\\title{T}\n\\author{A}\n\\date{\\today}\n\n\\begin{document}\n\n\\maketitle\n\n\\section{Introduction}\n\nText with inline mathematics, such as $a^2 + b^2 = c^2$.\n\n\\end{document}\n', 'the smallest document')

/* -------------------------------------------------------------------------------- 3: escaping */
escCases.forEach((t, i) => {
  ok(M.escapeLatex(t) === R.esc[i], `escapeLatex ${JSON.stringify(t)}: ${JSON.stringify(M.escapeLatex(t))}, Python ${JSON.stringify(R.esc[i])}`)
  // a property: no special character is left bare, except inside the \text... commands and the braces that close them
  const stripped = M.escapeLatex(t).replace(/\\(?:textbackslash|textasciitilde|textasciicircum)\{\}/g, '').replace(/\\[&%$#_{}]/g, '')
  ok(!/[&%$#_{}~^\\]/.test(stripped), `escapeLatex leaves a bare special character in ${JSON.stringify(t)}: ${JSON.stringify(M.escapeLatex(t))}`)
})
ok(M.escapeLatex('50% of $5 & #1_a') === '50\\% of \\$5 \\& \\#1\\_a' && M.escapeLatex('a~b') === 'a\\textasciitilde{}b', 'known escapes')

/* ---------------------------------------------------------------------------------- 4: symbols */
{
  const cmds = M.SYMBOLS.map((x) => x.cmd)
  ok(new Set(cmds).size === cmds.length, 'every command is listed once')
  ok(M.SYMBOLS.length >= 100, `${M.SYMBOLS.length} symbols`)
  const cats = new Set(M.SYMBOLS.map((x) => x.category))
  ok([...cats].every((c) => c in M.CATEGORY_NAME) && Object.keys(M.CATEGORY_NAME).every((c) => cats.has(c)), 'every category is named and used')
  let k = 0
  M.SYMBOLS.forEach((sy) => {
    const html = TEX.tex('\\' + sy.cmd)
    ok(!/\\/.test(html), `the page cannot draw \\${sy.cmd}: ${html}`)
    ok(M.KNOWN.has(sy.cmd) && !M.REAL_ONLY.has(sy.cmd), `\\${sy.cmd} is known`)
    ok(M.texLint('\\' + sy.cmd).length === 0, `\\${sy.cmd} is lint-clean`)
    ok(sy.name.en.length > 0 && sy.name.id.length > 0, `\\${sy.cmd} has names`)
    if (sy.unicode === null) {
      const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, '')
      ok(text === sy.cmd, `function name \\${sy.cmd} is drawn as "${text}"`)
    } else {
      const name = R.names[k++]
      ok(name === sy.unicode, `\\${sy.cmd} is drawn as ${name}, the table says ${sy.unicode}`)
    }
  })
  ok(k === R.names.length, 'every symbol character was looked up')
  // what is known is drawn, with arguments where it needs them; what is only real LaTeX is not
  for (const name of M.KNOWN) {
    const n = M.ARGS[name] ?? 0
    const needsEnv = ['begin', 'end', 'left', 'right'].includes(name)
    const sized = /^(?:[Bb]ig+[lr]?)$/.test(name)
    if (needsEnv || sized) continue
    const src = '\\' + name + '{x}'.repeat(n) + (n === 0 ? '' : '')
    ok(!/\\/.test(TEX.tex(src)), `the page cannot draw the known command ${src}: ${TEX.tex(src)}`)
  }
  for (const name of M.REAL_ONLY) {
    const n = M.ARGS[name] ?? 0
    const src = '\\' + name + '{x}'.repeat(n)
    ok(/\\/.test(TEX.tex(src)), `the page can in fact draw ${src}, so it should not be in REAL_ONLY`)
    ok(!M.KNOWN.has(name), `${name} is both known and real-only`)
  }
  ok(TEX.tex('\\mathbb{R}').includes('ℝ') && TEX.tex('\\frac{1}{2}').includes('mfrac') && TEX.tex('\\sqrt[3]{x}').includes('mroot'), 'the structure commands')
  ok(M.SYMBOLS.filter((x) => x.pkg).map((x) => x.cmd).sort().join() === 'lVert,rVert,because,therefore'.split(',').sort().join(), 'the symbols that need a package')
}

console.log(`latex check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
