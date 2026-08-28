/** The two pieces the mathematics courses stand on have no runtime to check
 *  them the way Pyodide checks a Python lesson: `tex.ts` turns the authored
 *  LaTeX into MathML, and `answer.ts` decides whether what a learner typed is
 *  the number the author meant. Both are pure functions, so they get a script.
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
    `export { evalAnswer, isRight } from '${q('src/lib/answer.ts')}'\n` +
    `export { modules as vektor } from '${q('src/content/vektor/index.ts')}'\n`,
)
const bundle = path.join(tmp, 'bundle.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: bundle, logLevel: 'error' })
const { tex, evalAnswer, isRight, vektor } = await import('file://' + bundle)

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

// A number keeps its digits together, or MathML spaces it like a product.
if (!tex('12.5').includes('<mn>12.5</mn>')) fail('tex("12.5") split the number up')

/* ------------------------------------------- every formula the courses write

   The cases above check the renderer against what it was built for. This
   checks the other direction: that nothing the curriculum actually writes
   falls outside it. An unsupported command comes out as literal text, which
   is visible on the page but easy to miss in a lesson nobody has opened yet.

   Prose is scanned for $...$ and $$...$$; the LaTeX-only fields are rendered
   whole. Add a course to `CURRICULA` when it starts writing formulas. */

const CURRICULA = { vektor }
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

  fig.items.forEach((item, i) => {
    const at = `item ${i + 1} (${item.t})`
    for (const key of ['from', 'to', 'at', 'a', 'b', 'c']) {
      if (item[key] !== undefined) walkVec(item[key], at)
    }
    if (item.pts) item.pts.forEach((p) => walkVec(p, at))
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
    if (b.label) sweep(b.label, `${where} blank ${i + 1} label`)
    if (b.after) sweep(b.after, `${where} blank ${i + 1} after`)
    if (typeof b.answer !== 'number' || !Number.isFinite(b.answer)) {
      fail(`${where} blank ${i + 1}: answer is not a finite number`)
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
