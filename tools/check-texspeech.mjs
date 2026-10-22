/** Checks src/lib/texspeech.ts, the formulas of the site read aloud for screen readers.
 *
 *  1. Hand-written phrases for the constructions the site uses, in English and in Indonesian: scripts, fractions (simple and nested), roots,
 *     sums, integrals and limits, brackets, matrices, piecewise functions, numbers with decimal marks and thin spaces, unary and binary minus.
 *  2. A property over every formula in the content of the site (articles and courses, found in the sources): the words must not contain a
 *     backslash, brace, caret, underscore, dollar, ampersand or hash, must not be empty, and must be the same under repeated calls; and in
 *     English and Indonesian both.
 *  3. Every symbol of the LaTeX symbol table and every command the page's renderer draws has a spoken name.
 *
 *  Run: npm run check:texspeech   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'speech-'))
const bundle = async (entry, name) => {
  const out = path.join(tmp, name)
  await build({ entryPoints: [path.join(ROOT, entry)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
  return import(pathToFileURL(out).href)
}
const S = await bundle('src/lib/texspeech.ts', 'speech.mjs')
const LATEX = await bundle('src/lib/latex.ts', 'latex.mjs')

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

/* ------------------------------------------------------------------------------ 1: hand-written */
const CASES = [
  ['x^2 + y^2 = r^2', 'x squared plus y squared equals r squared', 'x kuadrat tambah y kuadrat sama dengan r kuadrat'],
  ['x^{10}', 'x to the power 10', 'x pangkat 10'],
  ['x^3', 'x cubed', 'x kubik'],
  ['e^{-x}', 'e to the power minus x', 'e pangkat negatif x'],
  ['x^{n+1}', 'x to the power n plus 1, end power', 'x pangkat n tambah 1, akhir pangkat'],
  ['10^{-8}', '10 to the power minus 8', '10 pangkat negatif 8'],
  ['a_n', 'a sub n', 'a subskrip n'],
  ['x_i^2', 'x sub i squared', 'x subskrip i kuadrat'],
  ['\\frac{a}{b}', 'a over b', 'a per b'],
  ['\\frac12', '1 over 2', '1 per 2'],
  ['\\frac{a+b}{2}', 'fraction, a plus b, over, 2, end fraction', 'pecahan, a tambah b, per, 2, akhir pecahan'],
  ['\\frac{\\frac{a}{b}}{c}', 'fraction, a over b, over, c, end fraction', 'pecahan, a per b, per, c, akhir pecahan'],
  ['2^{\\frac{1}{2}}', '2 to the power 1 over 2, end power', '2 pangkat 1 per 2, akhir pangkat'],
  ['\\frac{d}{dx}', 'd over d x', 'd per d x'],
  ['\\sqrt{x}', 'square root of x', 'akar kuadrat dari x'],
  ['\\sqrt[3]{x}', 'cube root of x', 'akar pangkat tiga dari x'],
  ['\\sqrt[n]{x+1}', 'root of order n of x plus 1, end root', 'akar pangkat n dari x tambah 1, akhir akar'],
  ['\\alpha + \\beta', 'alpha plus beta', 'alfa tambah beta'],
  ['\\sin^2 x + \\cos^2 x = 1', 'sine squared x plus cosine squared x equals 1', 'sinus kuadrat x tambah kosinus kuadrat x sama dengan 1'],
  ['\\sum_{i=1}^{n} i^2', 'sum from i equals 1 to n of i squared', 'jumlah dari i sama dengan 1 sampai n dari i kuadrat'],
  ['\\sum_{k=1}^{\\infty} \\frac{1}{k^2}', 'sum from k equals 1 to infinity of 1 over k squared', 'jumlah dari k sama dengan 1 sampai tak hingga dari 1 per k kuadrat'],
  ['\\int_0^1 x\\,dx', 'integral from 0 to 1 of x d x', 'integral dari 0 sampai 1 dari x d x'],
  ['\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', 'limit as x approaches 0 of sine x over x equals 1', 'limit untuk x menuju 0 dari sinus x per x sama dengan 1'],
  ['\\left( \\frac{a}{b} \\right)', 'left paren a over b right paren', 'buka kurung a per b tutup kurung'],
  ['\\lfloor x \\rfloor', 'left floor x right floor', 'lantai kiri x lantai kanan'],
  ['|x|', 'vertical bar x vertical bar', 'garis tegak x garis tegak'],
  ['\\left. F(x) \\right|_{0}^{1}', 'F left paren x right paren vertical bar evaluated from 0 to 1', 'F buka kurung x tutup kurung garis tegak dihitung dari 0 sampai 1'],
  ['60^\\circ', '60 degrees', '60 derajat'],
  ['\\angle ABC = 90^\\circ', 'angle A B C equals 90 degrees', 'sudut A B C sama dengan 90 derajat'],
  ['3.14', '3.14', '3.14'],
  ['3{,}14', '3,14', '3,14'],
  ['31\\,622', '31622', '31622'],
  ['1,2,3', '1, 2, 3', '1, 2, 3'],
  ["f'(x)", 'f prime left paren x right paren', 'f aksen buka kurung x tutup kurung'],
  ['x \\ge 0', 'x is greater than or equal to 0', 'x lebih dari atau sama dengan 0'],
  ['-x + 3 - y', 'minus x plus 3 minus y', 'negatif x tambah 3 kurang y'],
  ['a \\pm b', 'a plus or minus b', 'a tambah atau kurang b'],
  ['a \\cdot b', 'a times b', 'a kali b'],
  ['n!', 'n factorial', 'n faktorial'],
  ['\\mathbb{R}', 'the real numbers', 'bilangan real'],
  ['x \\in \\mathbb{N}', 'x is an element of the natural numbers', 'x anggota dari bilangan asli'],
  ['A \\subseteq B', 'A is a subset of or equal to B', 'A himpunan bagian atau sama dengan B'],
  ['\\vec{v} \\cdot \\vec{w}', 'vector v times vector w', 'vektor v kali vektor w'],
  ['\\overline{AB} \\parallel \\overline{CD}', 'A B bar is parallel to C D bar', 'A B garis atas sejajar dengan C D garis atas'],
  ['\\hat{x}', 'x hat', 'x topi'],
  ['\\pi r^2', 'pi r squared', 'pi r kuadrat'],
  ['\\binom{n}{k}', 'n choose k', 'n pilih k'],
  ['\\text{if } x > 0', 'if x is greater than 0', 'if x lebih dari 0'],
  ['\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', 'matrix with 2 rows and 2 columns: row 1: a, b; row 2: c, d, end matrix', 'matriks dengan 2 baris dan 2 kolom: baris 1: a, b; baris 2: c, d, akhir matriks'],
  ['\\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix}', 'determinant of the matrix with 2 rows and 2 columns: row 1: 1, 2; row 2: 3, 4, end matrix', 'determinan matriks dengan 2 baris dan 2 kolom: baris 1: 1, 2; baris 2: 3, 4, akhir matriks'],
  ['f(x) = \\begin{cases} x^2 & x \\ge 0 \\\\ -x & x < 0 \\end{cases}', 'f left paren x right paren equals cases: case 1: x squared, x is greater than or equal to 0; case 2: minus x, x is less than 0, end cases', 'f buka kurung x tutup kurung sama dengan sepotong-sepotong: kasus 1: x kuadrat, x lebih dari atau sama dengan 0; kasus 2: negatif x, x kurang dari 0, akhir sepotong-sepotong'],
  ['', '', ''],
  ['   ', '', ''],
]
for (const [src, en, id] of CASES) {
  ok(S.texSpeech(src, 'en') === en, `English speech of ${JSON.stringify(src)}: "${S.texSpeech(src, 'en')}", expected "${en}"`)
  ok(S.texSpeech(src, 'id') === id, `Indonesian speech of ${JSON.stringify(src)}: "${S.texSpeech(src, 'id')}", expected "${id}"`)
}
ok(S.texSpeech('x') === S.texSpeech('x', 'en'), 'English is the default')

/* ------------------------------------------------------------------------- 2: every formula */
const files = []
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.tsx?$/.test(e.name)) files.push(p)
  }
}
walk(path.join(ROOT, 'src/content'))
walk(path.join(ROOT, 'src/components/article'))
const formulas = new Set()
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8').replace(/`[^`\n]*`/g, ' ')
  for (const m of text.matchAll(/\$\$([^$]+)\$\$/g)) formulas.add(m[1])
  for (const m of text.matchAll(/\$([^$\n]+)\$/g)) formulas.add(m[1])
}
// formulas written in normal string literals have doubled backslashes: read both forms
const all = [...formulas].filter((f) => !f.includes('//')).map((f) => f.split("\\'").join("'")).flatMap((f) => (f.includes('\\\\') ? [f, f.replace(/\\\\/g, '\\')] : [f]))
let n = 0
for (const f of all) {
  for (const lang of ['en', 'id']) {
    const sp = S.texSpeech(f, lang)
    n++
    ok(!/[\\{}^_$&#]/.test(sp), `speech of ${JSON.stringify(f)} (${lang}) still has markup: "${sp}"`)
    ok(sp === S.texSpeech(f, lang), 'speech is repeatable')
    ok(!/undefined|NaN|\[object/.test(sp), `speech of ${JSON.stringify(f)} has a bad word: "${sp}"`)
  }
}
console.log(`${formulas.size} formulas (${all.length} spellings) read in two languages`)
ok(formulas.size > 500, `only ${formulas.size} formulas found`)

/* ------------------------------------------------------------------------------ 3: every name */
for (const sy of LATEX.SYMBOLS) {
  for (const lang of ['en', 'id']) {
    const sp = S.texSpeech('\\' + sy.cmd, lang)
    ok(sp.length > 0 && !/[\\{}]/.test(sp), `\\${sy.cmd} has no spoken name in ${lang}: "${sp}"`)
  }
}
for (const cmd of ['ell', 'epsilon', 'varphi', 'sec', 'csc', 'cot', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'dim', 'ker', 'deg', 'rank', 'nparallel', 'checkmark', 'veebar', 'dots', 'ne', 'le', 'ge', 'rightarrow', 'land', 'lor', 'vee', 'wedge']) {
  ok(S.texSpeech('\\' + cmd, 'en').length > 0 && !/\\/.test(S.texSpeech('\\' + cmd, 'en')), `\\${cmd} is not spoken`)
}
for (const letter of ['N', 'Z', 'Q', 'R', 'C']) ok(/numbers|integers/.test(S.texSpeech(`\\mathbb{${letter}}`, 'en')) && /bilangan/.test(S.texSpeech(`\\mathbb{${letter}}`, 'id')), `\\mathbb{${letter}}`)
// a decimal point and a thin space inside one number; a comma list stays a list
ok(S.texSpeech('1{,}5 + 2.5', 'id') === '1,5 tambah 2.5' && S.texSpeech('1,5', 'en') === '1, 5', 'decimals and lists')

console.log(`texspeech check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
