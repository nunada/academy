// Usage (from repo root): node tools/check-fill-templates.mjs [course-dir ...]   (no arguments = every course)
// A fill step's template is cut at every ___ and each piece is typeset on its own, with an input box
// between the pieces (src/lib/fillTemplate.ts). A blank inside a fraction is understood: the fraction is
// laid out as a real fraction with the box in it. A blank inside anything else that has braces — a
// square root, an exponent, a matrix or \begin..\end block, or a $..$ pair in a sentence — is not, and
// leaves broken TeX on both sides of the box ("\sqrt{" and "}").
// Rewrite such a template so the blank is at the top level (e.g. "x^{___}" → ask for the exponent in a
// sentence, or write the step so the box is not inside the group). Exit 1 on problems.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
let courses = process.argv.slice(2)
if (!courses.length) {
  courses = fs
    .readdirSync(path.join(ROOT, 'src/content'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, 'src/content', d.name, 'index.ts')))
    .map((d) => d.name)
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fill-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
const entry = path.join(tmp, 'e.ts')
fs.writeFileSync(
  entry,
  [
    ...courses.map((c) => `export { modules as ${c.replace(/-/g, '_')} } from '${q(`src/content/${c}/index.ts`)}'`),
    `export { parseFillTemplate, brokenPieces, countBlanks } from '${q('src/lib/fillTemplate.ts')}'`,
  ].join('\n'),
)
const out = path.join(tmp, 'e.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const mod = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checked = 0
const isLoc = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'id' in v

function problems(template, math, blankCount) {
  const found = []
  if (math) {
    const nodes = mod.parseFillTemplate(template)
    for (const p of mod.brokenPieces(nodes)) found.push(`a blank sits inside a group that splits the formula (piece: ${p.slice(0, 40)})`)
    if (mod.countBlanks(nodes) !== blankCount) found.push(`${mod.countBlanks(nodes)} blanks in the template but ${blankCount} answers`)
  } else {
    let dollars = 0
    const parts = template.split('___')
    for (let i = 0; i < parts.length - 1; i++) {
      dollars += (parts[i].match(/\$/g) ?? []).length
      if (dollars % 2 === 1) found.push(`blank ${i + 1} is inside $..$`)
    }
  }
  return found
}

for (const c of courses) {
  for (const m of mod[c.replace(/-/g, '_')]) {
    for (const s of m.submodules) {
      for (const l of s.lessons) {
        for (const st of l.steps) {
          if (st.kind !== 'fill') continue
          for (const lang of ['en', 'id']) {
            const t = isLoc(st.template) ? st.template[lang] : st.template
            const answers = isLoc(st.blanks) ? st.blanks[lang] : st.blanks
            if (typeof t !== 'string' || !t.includes('___')) continue
            checked++
            for (const msg of problems(t, !!st.math, answers.length)) {
              bad++
              console.log(`${c}/${l.id}/${st.id}(${lang}): ${msg}: ${t.slice(0, 90)}`)
            }
            if (!isLoc(st.template)) break
          }
        }
      }
    }
  }
}
console.log(bad ? `${bad} problem(s) in ${checked} templates` : `ok — ${checked} fill templates, every blank is placeable`)
process.exit(bad ? 1 : 0)
