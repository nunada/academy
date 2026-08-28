/** The two pieces the mathematics courses stand on have no runtime to check
 *  them the way Pyodide checks a Python lesson: `tex.ts` turns the authored
 *  LaTeX into MathML, and `answer.ts` decides whether what a learner typed is
 *  the number — or the function — the author meant. Both are pure functions,
 *  so they get a script.
 *
 *  A wrong marker is the worse of the two failures — it fails a learner who
 *  was right — so the marking cases are the ones to add to when something
 *  surprising turns up.
 *
 *  Run: npm run check:math
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nunada-math-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')

const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(
  entry,
  `export { tex } from '${q('src/lib/tex.ts')}'\n` +
    `export { evalAnswer, isRight, isSameFormula } from '${q('src/lib/answer.ts')}'\n` +
    `export { modules as vektor } from '${q('src/content/vektor/index.ts')}'\n` +
    `export { modules as fungsi } from '${q('src/content/fungsi/index.ts')}'
`,
)
const bundle = path.join(tmp, 'bundle.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: bundle, logLevel: 'error' })
const { tex, evalAnswer, isRight, isSameFormula, vektor, fungsi } = await import('file://' + bundle)

const problems = []
const fail = (m) => problems.push(m)

/** What the learner typed -> the number it means. */
const reads = (input, want) => {
  const got = evalAnswer(input)
  if (got === null || Math.abs(got - want) > 1e-9) {
    fail(`evalAnswer(${JSON.stringify(input)}) = ${got}, want ${want}`)
  }
}
const rejects = (input) => {
  const got = evalAnswer(input)
  if (got !== null) fail(`evalAnswer(${JSON.stringify(input)}) = ${got}, want null`)
}
const marks = (input, answer, want, tol) => {
  const got = isRight(input, answer, tol)
  if (got !== want) fail(`isRight(${JSON.stringify(input)}, ${answer}) = ${got}, want ${want}`)
}
/** The rendered MathML must contain each fragment, and must not have given up
 *  on a command and printed it as text. */
const renders = (src, ...fragments) => {
  const out = tex(src)
  for (const f of fragments) {
    if (!out.includes(f)) fail(`tex(${JSON.stringify(src)}) is missing ${f}\n    ${out}`)
  }
  if (out.includes('<mtext>\\')) fail(`tex(${JSON.stringify(src)}) left a command unrendered\n    ${out}`)
}

/* ------------------------------------------------------- reading a number */

reads('3.74', 3.74)
reads('1,5', 1.5) // the decimal mark written here
reads('-7/2', -3.5)
reads('sqrt(14)', Math.sqrt(14))
reads('akar(50)', Math.sqrt(50))
reads('2√3', 2 * Math.sqrt(3))
reads('5*sqrt(2)/2', (5 * Math.sqrt(2)) / 2)
reads('pi/4', Math.PI / 4)
reads('2(3+4)', 14)
reads('-2^2', -4) // the sign binds looser than the exponent
reads('|-6|', 6)
reads('  12  ', 12)
reads('SQRT(9)', 3) // case does not matter
reads('ln(20)/ln(3)', Math.log(20) / Math.log(3))
reads('e^2', Math.E * Math.E)
reads('log(1000)', 3) // a bare log is base ten
rejects('sin(30)') // degrees or radians? the course uses both, so neither is offered

rejects('')
rejects('   ')
rejects('abc')
rejects('2 3') // two numbers is not one answer
rejects('3/')
rejects('(1+2')
rejects('(3,4)') // a whole vector: every box holds one scalar

/* -------------------------------------------------------------- marking it */

marks('3.74', Math.sqrt(14), true) // rounded to two places
marks('3.7', Math.sqrt(14), false) // rounded to one is not close enough
marks('sqrt(14)', Math.sqrt(14), true) // the exact form lands dead on
marks('0.29', 2 / 7, true) // two places, on an answer the relative test alone would fail
marks('2/7', 2 / 7, true)
marks('0.3', 2 / 7, false) // one place is a different number
marks('0.1', 0, false) // a wrong answer near zero is still wrong
marks('-5', -5, true)
marks('5', -5, false) // a sign error is an error
marks('41.4', 41.409622, true)
marks('40', 41.409622, false)
marks('3.1', Math.PI, true, 0.05) // an author-set tolerance is honoured
marks('3.1', Math.PI, false, 0.01)

/* ------------------------------------------------------ marking a formula */

const same = (typed, formula, want, spec = {}) => {
  const got = isSameFormula(typed, { formula, ...spec })
  if (got !== want) fail(`isSameFormula(${JSON.stringify(typed)}, ${JSON.stringify(formula)}) = ${got}, want ${want}`)
}

// The whole point: one function, spelled several ways, all accepted.
same('(x-3)/2', '(x-3)/2', true)
same('x/2 - 1.5', '(x-3)/2', true)
same('0.5x - 3/2', '(x-3)/2', true)
same('f(x) = (x-3)/2', '(x-3)/2', true) // an answer written as a whole equation
same('y=(x-3)/2', '(x-3)/2', true)

same('(x-3)*2', '(x-3)/2', false)
same('(x+3)/2', '(x-3)/2', false)
same('x/2', '(x-3)/2', false)
same('2', '(x-3)/2', false) // a constant is not a line
same('', '(x-3)/2', false)
same('sqrt(', '(x-3)/2', false)

same('x^2+4', 'x^2+4', true)
same('x*x+4', 'x^2+4', true)
same('sqrt(x+1)', 'sqrt(x+1)', true, { domain: [0, 6] })
// Same values on the sampled stretch, different function off it — the domain
// is the author's promise about where the question is being asked.
same('sqrt(x-3)', 'sqrt(x-3)', true, { domain: [3.5, 9] })
same('sqrt(3-x)', 'sqrt(x-3)', false, { domain: [3.5, 9] })

// A formula sampled where it is not defined can never be marked right, which
// is the mistake the curriculum sweep exists to catch.
same('sqrt(x-3)', 'sqrt(x-3)', false)

/* ------------------------------------------------------------ rendering it */

renders('\\vec{a} = 3\\hat{i} - 4\\hat{j}', '<mover accent="true">', '→', '^')
renders('|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}', '<msqrt>', '<msubsup>')
renders('\\cos\\theta = \\frac{x}{y}', '<mi>cos</mi>', '<mi>θ</mi>', '<mfrac>')
renders('\\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix}', '<mtable', '<mtr>', '<mtd>', '|')
renders('\\begin{pmatrix} 1 \\\\ -2 \\\\ 5 \\end{pmatrix}', '<mtable', '(', ')')
renders('\\left(\\frac{1}{2}\\right)^{-3}', 'fence="true"', '<msup>')
renders('\\text{luas} = \\tfrac{1}{2}', '<mtext>luas</mtext>', '<mfrac>')
renders('41{,}4^\\circ', '<msup>', '∘')
renders('\\sqrt[3]{27}', '<mroot>')
renders('^\\circ', '<msup>', '∘') // a bare degree sign, set beside an answer box
renders('\\text{comp}_{\\vec{b}}\\,\\vec{a}', '<msub>', '<mtext>comp</mtext>')
renders('\\vec{u}\\times\\vec{v}\\cdot\\hat{n}', '×', '⋅')
renders('f\\big(b(x - h)\\big)', 'fence="true"') // manual sizing: ignored, not dropped
renders('\\begin{array} a & b \\\\ c & d \\end{array}', '<mtable', '<mtr>')
renders('y = a^x \\text{ dan } \\ln x', '<msup>', '<mi>ln</mi>')

// A number keeps its digits together, or MathML spaces it like a product.
if (!tex('12.5').includes('<mn>12.5</mn>')) fail('tex("12.5") split the number up')

/* ------------------------------------------- every formula the courses write

   The cases above check the renderer against what it was built for. This
   checks the other direction: that nothing the curriculum actually writes
   falls outside it. An unsupported command comes out as literal text, which
   is visible on the page but easy to miss in a lesson nobody has opened yet.

   Prose is scanned for $...$ and $$...$$; the LaTeX-only fields are rendered
   whole. Add a course to `CURRICULA` when it starts writing formulas. */

/** The function names `expr.ts` offers a plotted curve. */
const MATH_NAMES = {
  sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1, sinh: 1, cosh: 1, tanh: 1,
  exp: 1, ln: 1, log: 1, log2: 1, sqrt: 1, akar: 1, abs: 1, floor: 1, ceil: 1,
  round: 1, sign: 1,
}

const CURRICULA = { vektor, fungsi }
let formulas = 0
let figures = 0

/** Render one piece of LaTeX and complain if a command survived unrendered. */
function sweep(src, where) {
  formulas++
  const out = tex(src)
  const stuck = /<mtext>(\\[A-Za-z]+)<\/mtext>/.exec(out)
  if (stuck) fail(`${where}: tex does not know ${stuck[1]}\n    in: ${src}`)
}

/** Both halves of a Loc, scanned for the maths embedded in the prose. */
function sweepProse(loc, where) {
  if (!loc) return
  for (const text of [loc.en, loc.id]) {
    if (typeof text !== 'string') continue
    for (const m of text.matchAll(/\$\$([^$]+)\$\$|\$([^$]+)\$/g)) {
      sweep(m[1] ?? m[2], where)
    }
  }
}

/** A figure is data, and the two ways it can be wrong are both mechanical: it
 *  can name a vector that does not exist, or hand a plane figure a point in
 *  space. Both draw something — silently and wrongly — so both are checked. */
function sweepFigure(fig, where) {
  if (!fig) return
  figures++
  sweepProse(fig.caption, `${where} caption`)
  const named = new Set(Object.keys(fig.vars ?? {}))

  const walkVec = (ref, at) => {
    if (Array.isArray(ref)) {
      if (ref.length !== fig.dim) {
        fail(`${where} ${at}: a ${ref.length}-vector in a ${fig.dim}D figure — [${ref}]`)
      }
      return
    }
    if ('of' in ref) {
      if (!named.has(ref.of)) fail(`${where} ${at}: no vector named "${ref.of}"`)
      return
    }
    if ('sum' in ref) return ref.sum.forEach((r) => walkVec(r, at))
    if ('diff' in ref) return ref.diff.forEach((r) => walkVec(r, at))
    if ('scale' in ref) return walkVec(ref.v, at)
    if ('cross' in ref) return ref.cross.forEach((r) => walkVec(r, at))
    if ('unit' in ref) return walkVec(ref.unit, at)
    if ('proj' in ref) return ref.proj.forEach((r) => walkVec(r, at))
  }
  const walkNum = (ref, at) => {
    for (const v of Object.values(ref)) {
      if (Array.isArray(v) && v.length && (Array.isArray(v[0]) || typeof v[0] === 'object')) {
        v.forEach((r) => walkVec(r, at))
      } else if (Array.isArray(v) && v.every((x) => typeof x === 'number')) {
        walkVec(v, at)
      } else {
        walkVec(v, at)
      }
    }
  }

  const sliders = new Set((fig.params ?? []).map((p) => p.name))
  /** A curve or a rule may be written as an expression in x and the sliders.
   *  A name it does not have is a silently blank drawing, so it is checked. */
  const walkExpr = (src, at) => {
    if (typeof src !== 'string') return
    for (const name of src.toLowerCase().match(/[a-z]+/g) ?? []) {
      const known =
        name === 'x' || name === 'pi' || name === 'e' || sliders.has(name) || name in MATH_NAMES
      if (!known) fail(`${where} ${at}: "${name}" is neither a slider nor a function`)
    }
  }

  fig.items.forEach((item, i) => {
    const at = `item ${i + 1} (${item.t})`
    switch (item.t) {
      case 'vec':
      case 'seg':
      case 'angle':
      case 'right':
        for (const key of ['from', 'to', 'at']) if (item[key] !== undefined) walkVec(item[key], at)
        break
      case 'point':
        walkVec(item.at, at)
        break
      case 'poly':
        item.pts.forEach((p) => walkVec(p, at))
        break
      case 'box':
        for (const key of ['a', 'b', 'c']) walkVec(item[key], at)
        break
      case 'curve':
        walkExpr(item.f, at)
        if (fig.dim !== 2) fail(`${where} ${at}: a curve belongs to a plane figure`)
        break
      case 'hline':
        walkExpr(item.y, at)
        break
      case 'vline':
        walkExpr(item.x, at)
        break
      case 'dot':
        walkExpr(item.x, at)
        walkExpr(item.y, at)
        break
    }
    if (item.drag && !named.has(item.drag)) fail(`${where} ${at}: drags "${item.drag}", which is not a vector`)
    if (item.drag && fig.dim !== 2) fail(`${where} ${at}: only a plane figure can be dragged by the head`)
  })

  for (const r of fig.readouts ?? []) {
    if (r.v) walkVec(r.v, `readout "${r.label}"`)
    if (r.n) walkNum(r.n, `readout "${r.label}"`)
  }

  for (const v of Object.values(fig.vars ?? {})) {
    if (v.length !== fig.dim) fail(`${where}: a starting vector has ${v.length} components, not ${fig.dim}`)
  }
}

/** The parts of a task that are not also fields of the step it may be. The
 *  prompt and the figure are swept by whoever owns the task, so that a `math`
 *  step is not counted twice over. */
function sweepTask(task, where) {
  if (task.given) sweep(task.given, `${where} given`)
  for (const line of task.solution ?? []) sweep(line, `${where} solution`)
  task.blanks.forEach((b, i) => {
    const at = `${where} blank ${i + 1}`
    if (b.label) sweep(b.label, `${at} label`)
    if (b.after) sweep(b.after, `${at} after`)

    if ('formula' in b) {
      // The strongest check available, and the cheapest: mark the author's own
      // answer against itself. It fails when the formula does not parse, when
      // it uses a name the evaluator has not got, and — the one worth having —
      // when the sampling domain is somewhere the formula is undefined, which
      // would silently make every learner answer wrong.
      if (!isSameFormula(b.formula, b)) {
        fail(`${at}: the answer "${b.formula}" does not mark itself correct — check the domain`)
      }
      // A domain the author gave but got backwards samples nothing.
      if (b.domain && !(b.domain[0] < b.domain[1])) {
        fail(`${at}: domain [${b.domain}] is empty or reversed`)
      }
    } else if (typeof b.answer !== 'number' || !Number.isFinite(b.answer)) {
      fail(`${at}: answer is not a finite number`)
    }
  })
}

for (const [courseId, modules] of Object.entries(CURRICULA)) {
  for (const m of modules) {
    for (const s of m.submodules) {
      for (const l of s.lessons) {
        for (const step of l.steps) {
          const where = `${courseId}/${l.id}/${step.id}`
          sweepProse(step.title, where)
          sweepProse(step.body, where)
          sweepFigure(step.figure, `${where} figure`)
          sweepProse(step.prompt, where)
          sweepProse(step.explain, where)
          for (const o of step.options ?? []) sweepProse(o, where)
          for (const h of step.hints ?? []) sweepProse(h, where)
          if (step.math && step.template) {
            for (const seg of step.template.split('___')) if (seg.trim()) sweep(seg, `${where} template`)
          }
          if (step.math && step.lines) for (const line of step.lines) sweep(line, `${where} line`)
          if (step.kind === 'math') sweepTask(step, where)
        }
      }

      const p = s.project
      if (p.runtime !== 'math') continue
      sweepProse(p.title, p.id)
      sweepProse(p.brief, p.id)
      for (const r of p.requirements) sweepProse(r, p.id)
      for (const h of p.hints) sweepProse(h, p.id)
      p.tasks.forEach((task, i) => {
        const at = `${p.id} part ${i + 1}`
        sweepProse(task.prompt, at)
        sweepFigure(task.figure, `${at} figure`)
        sweepTask(task, at)
      })
    }
  }
}

fs.rmSync(tmp, { recursive: true, force: true })

if (problems.length) {
  console.error('math check failed:\n' + problems.map((m) => '  · ' + m).join('\n'))
  process.exit(1)
}
console.log(
  `math check ok — number parsing, marking, and ${formulas} formulas plus ${figures} figures from the curriculum all check out`,
)
