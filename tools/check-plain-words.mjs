// Usage (from repo root): node tools/check-plain-words.mjs <course-dir>...
// A `solution`, `lines`, `template`, `label` or `after` that is a plain string (not an { en, id } pair)
// is shown identically to learners of both languages. That is right for bare notation and wrong the
// moment it holds a word ("Check:", "cm" is fine, "minutes" is not) or a decimal point/comma.
// Flags such fields. Words inside \text{...} count: that is exactly where a translated word hides.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const courses = process.argv.slice(2)
if (!courses.length) { console.error('give course dirs'); process.exit(2) }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'plain-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
const entry = path.join(tmp, 'e.ts')
fs.writeFileSync(entry, courses.map((c) => `export { modules as ${c.replace(/-/g, '_')} } from '${q(`src/content/${c}/index.ts`)}'`).join('\n'))
const out = path.join(tmp, 'e.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const mod = await import('file://' + out.replace(/\\/g, '/'))

// Units and symbols that are the same in both languages.
const OK = new Set(['cm', 'mm', 'km', 'kg', 'ml', 'dl', 'cl', 'dm', 'hm', 'dam', 'kl', 'hg', 'dag', 'mg', 'dg', 'cg', 'sqrt', 'frac', 'times', 'div', 'cdot', 'quad', 'qquad', 'text', 'left', 'right', 'approx', 'neq', 'leq', 'geq', 'rightarrow', 'Rightarrow', 'pi', 'angle', 'circ', 'overline', 'dfrac', 'tfrac', 'begin', 'end', 'array', 'ldots', 'cdots', 'sin', 'cos', 'tan', 'ln', 'log', 'max', 'min', 'Rp', 'ons', 'jam', 'mathrm', 'mathbf', 'triangle', 'cong', 'sim', 'perp', 'parallel', 'degree', 'infty', 'sum', 'prod', 'vec', 'hat', 'bar', 'boxed', 'underline', 'phantom', 'hspace', 'mid', 'lt', 'gt', 'in', 'notin', 'subset', 'cup', 'cap', 'to', 'mapsto', 'Longrightarrow', 'iff', 'pm', 'mp', 'binom', 'choose', 'lfloor', 'rfloor', 'lceil', 'rceil', 'big', 'Big', 'bigg', 'tfrac'])
const NAMES = new Set(['Ani', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gita', 'Hasan', 'Indah', 'Joko', 'Rudi', 'Siti', 'Rina', 'Rp'])
const wordsIn = (s) => (String(s).replace(/\\[a-zA-Z]+/g, ' ').match(/[A-Za-z]{3,}/g) ?? []).filter((w) => !NAMES.has(w) && !OK.has(w.toLowerCase()) && !/^[xyzabcdfghklmnpqrstuvw]{1,3}$/i.test(w))
const hasDecimal = (s) => /\d\.\d/.test(String(s).replace(/\\,/g, ''))

let bad = 0
const flag = (where, msg) => { bad++; console.log(`${where}: ${msg}`) }
const isLoc = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'id' in v

function checkPlain(where, field, v) {
  if (v == null || isLoc(v)) return
  const items = Array.isArray(v) ? v : [v]
  for (const it of items) {
    if (typeof it !== 'string') continue
    const w = wordsIn(it)
    if (w.length) flag(where, `plain ${field} holds words (${w.slice(0, 4).join(', ')}): ${it.slice(0, 70)}`)
    else if (hasDecimal(it)) flag(where, `plain ${field} has a decimal that needs a comma in Indonesian: ${it.slice(0, 70)}`)
  }
}
function checkBlank(where, b) {
  checkPlain(where, 'blank label', b.label)
  checkPlain(where, 'blank after', b.after)
}
function checkTask(where, t) {
  checkPlain(where, 'given', t.given)
  checkPlain(where, 'solution', t.solution)
  for (const [i, b] of (t.blanks ?? []).entries()) checkBlank(`${where}/blank${i}`, b)
}
for (const c of courses) {
  for (const m of mod[c.replace(/-/g, '_')]) for (const s of m.submodules) {
    for (const l of s.lessons) for (const st of l.steps) {
      const w = `${l.id}/${st.id}`
      if (st.kind === 'math') checkTask(w, st)
      if (st.kind === 'fill') { checkPlain(w, 'template', st.template); checkPlain(w, 'blanks', st.blanks) }
      if (st.kind === 'order') checkPlain(w, 'lines', st.lines)
    }
    if (s.project.runtime === 'math') s.project.tasks.forEach((t, i) => checkTask(`${s.project.id}/task${i}`, t))
  }
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(bad ? `${bad} plain fields hold words or decimals` : 'ok — no plain field holds words')
process.exit(bad ? 1 : 0)
