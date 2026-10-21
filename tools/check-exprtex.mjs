/** Checks src/lib/exprtex.ts, which turns the text a learner types for a formula into TeX for the preset buttons.
 *
 *  The expected TeX is written by hand for the notations the widgets accept: powers, products with and without a sign,
 *  fractions with a bracketed or a plain denominator, function names with and without brackets, roots and pi.
 *  A wrong conversion would show a learner a different formula from the one the button types, so each case is exact.
 *
 *  Run: npm run check:exprtex   Exit 1 on any difference. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'exprtex-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/exprtex.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const { exprTex, decTex, listTex, seqTex, twoTermsTex, numberTex } = await import(pathToFileURL(out).href)

const BS = String.fromCharCode(92)
// write expected TeX with ~ standing for a backslash, so that this file has no escaping to get wrong
const T = (s) => s.replaceAll('~', BS)

const CASES = [
  ['3x^2 - 5x + 1', '3x^{2}-5x+1'],
  ['4xy + 2x - xy + 9', '4xy+2x-xy+9'],
  ['-x^2 + 4', '-x^{2}+4'],
  ['(x+2)(x-3)', '(x+2)(x-3)'],
  ['(2x+3)^2', '(2x+3)^{2}'],
  ['3(x+2)-2(x-1)', '3(x+2)-2(x-1)'],
  ['2.75*x^2', '2.75x^{2}'],
  ['x*(10-2*x)*(16-2*x)', 'x(10-2x)(16-2x)'],
  ['2*3', '2~cdot 3'],
  ['x/(x-1)', '~frac{x}{x-1}'],
  ['(x^2+1)/(x-2)', '~frac{x^{2}+1}{x-2}'],
  ['1/x', '~frac{1}{x}'],
  ['84/126', '~frac{84}{126}'],
  ['-6/8', '-~frac{6}{8}'],
  ['7/-21', '~frac{7}{-21}'],
  ['x^2 (x+1)^3/(x-2)', '~frac{x^{2}(x+1)^{3}}{x-2}'],
  ['(x-1)(x^2-2x)/x^4', '~frac{(x-1)(x^{2}-2x)}{x^{4}}'],
  ['x^2/9 + y^2/4 = 1', '~frac{x^{2}}{9}+~frac{y^{2}}{4}=1'],
  ['x^(2/3)', 'x^{~frac{2}{3}}'],
  ['x^(pi+1)', 'x^{~pi+1}'],
  ['x^pi', 'x^{~pi}'],
  ['2^x', '2^{x}'],
  ['e^(cos x)', 'e^{~cos x}'],
  ['3^(sin x)', '3^{~sin x}'],
  ['sqrt(1-x^2)', '~sqrt{1-x^{2}}'],
  ['abs(x)', '~left|x~right|'],
  ['sin(2x)', '~sin(2x)'],
  ['sin x / x', '~frac{~sin x}{x}'],
  ['cos x / (1 - sin x)', '~frac{~cos x}{1-~sin x}'],
  ['x sin(2x)', 'x~sin(2x)'],
  ['sin x cos x', '~sin x~cos x'],
  ['x + 2 sin x', 'x+2~sin x'],
  ['sin^5(x)', '~sin^{5}(x)'],
  ['tan(5 - sin(2x))', '~tan(5-~sin(2x))'],
  ['arctan(1/x)', '~arctan(~frac{1}{x})'],
  ['1/arctan(x)', '~frac{1}{~arctan(x)}'],
  ['ln(x^2+3)', '~ln(x^{2}+3)'],
  ['10*x*(2-ln(x))', '10x(2-~ln(x))'],
  ['pi/2', '~frac{~pi}{2}'],
  ['3pi/2', '~frac{3~pi}{2}'],
  ['2*pi', '2~pi'],
  ['sin(xy) = x + y', '~sin(xy)=x+y'],
]

let bad = 0
for (const [src, want] of CASES) {
  const got = exprTex(src)
  if (got !== T(want)) {
    bad++
    console.log(`${src}: got ${got}, want ${T(want)}`)
  }
}
// a formula never comes out with a raw ^ or * left in it
for (const [src] of CASES) {
  const got = exprTex(src)
  if (/[*]/.test(got) || /\^[^{]/.test(got)) {
    bad++
    console.log(`${src}: a raw operator is left in ${got}`)
  }
}
// the helpers of the sequence and pair buttons, in both languages
const HELPERS = [
  [decTex('0.5', true), '0{,}5'],
  [decTex('0.5', false), '0.5'],
  [listTex(['1/2', '-3'], false), T('~frac{1}{2},~ -3')],
  [listTex(['3', '2.5'], true), T('3;~ 2{,}5')],
  [seqTex('3 6 12', false), T('3,~ 6,~ 12')],
  [seqTex('1 0.5 0.25', true), T('1;~ 0{,}5;~ 0{,}25')],
  [twoTermsTex('2', '6', '5', '4/27', false), T('a_{2}=6,~ a_{5}=~frac{4}{27}')],
  [numberTex('√9'), T('~sqrt{9}')],
  [numberTex('2/3'), T('~frac{2}{3}')],
  [numberTex('−4'), '-4'],
  [numberTex('0,75'), '0{,}75'],
  [numberTex('0.333…'), T('0.333~ldots')],
  [numberTex('π'), T('~pi')],
  [twoTermsTex('3', '-5', '7', '2.5', true), T('a_{3}=-5;~ a_{7}=2{,}5')],
]
for (const [got, want] of HELPERS) {
  if (got !== want) {
    bad++
    console.log(`helper: got ${got}, want ${want}`)
  }
}
console.log(`exprtex check: ${CASES.length * 2 + HELPERS.length} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
