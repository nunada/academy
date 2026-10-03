// Usage (from repo root): node tools/check-figure-colors.mjs <course-dir>
// For a course drawn in the plain-colour ("kid") palette — green, orange, gold, red, grey — checks
// that each colour WORD in a step's English text (prompt, body, caption, options, hint, explain)
// has a matching colour in that step's own figure. A step that says "the red dot" over a figure with
// no red item is a defect the learner cannot get around. Advisory heuristics: words that are part of a
// story (red apples) show up too, so read each line before changing text.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const course = process.argv[2]
if (!course) { console.error('give a course dir'); process.exit(2) }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'colors-'))
const entry = path.join(tmp, 'e.ts')
fs.writeFileSync(entry, `export { modules } from '${path.join(ROOT, 'src/content', course, 'index.ts').replace(/\\/g, '/')}'`)
const out = path.join(tmp, 'e.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const { modules } = await import('file://' + out.replace(/\\/g, '/'))

const WORDS = { a: /\b(dark )?green\b/i, b: /\borange\b/i, c: /\b(gold|golden|yellow)\b/i, result: /\bred\b/i, muted: /\b(gr[ae]y)\b/i }
const ROLE = { a: 'green', b: 'orange', c: 'gold', result: 'red', muted: 'grey' }
const DEFAULT = { curve: 'a', param: 'a', polar: 'a', vec: 'a', dot: 'result', point: 'result', poly: 'result', seg: 'muted', hline: 'muted', vline: 'muted', text: 'muted', angle: 'result', right: 'muted', box: 'muted' }
const OTHER = /\b(blue|purple|pink|brown|violet|black|white)\b/i

const text = (v) => {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.map(text).join(' ')
  if (typeof v === 'object') return 'en' in v && typeof v.en === 'string' ? v.en : Object.values(v).map(text).join(' ')
  return ''
}
const colorsOf = (fig) => new Set(fig.items.map((it) => it.color ?? DEFAULT[it.t] ?? 'a').concat(fig.items.some((i) => i.t === 'angle' || i.t === 'right') ? ['result'] : []))
const clean = (s) => s.replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$]*\$/g, ' ')

let bad = 0, checked = 0
const flag = (where, msg) => { bad++; console.log(`${where}: ${msg}`) }
function check(where, fig, parts) {
  if (!fig) return
  checked++
  const used = colorsOf(fig)
  // `protractor`, `clockFace` etc. build their colours into items, so `used` is accurate for helpers too.
  const t = clean(parts.map(text).join(' \n '))
  for (const [role, re] of Object.entries(WORDS)) {
    const m = t.match(re)
    if (m && !used.has(role)) flag(where, `text says "${m[0]}" but the figure draws no ${ROLE[role]} item (colours used: ${[...used].map((c) => ROLE[c]).join(', ')}) — …${t.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}…`)
  }
  const o = t.match(OTHER)
  if (o) flag(where, `text names "${o[0]}", which is not in the palette — …${t.slice(Math.max(0, o.index - 40), o.index + 40).replace(/\s+/g, ' ')}…`)
}

for (const m of modules) for (const s of m.submodules) {
  for (const l of s.lessons) for (const st of l.steps) {
    check(`${l.id}/${st.id}`, st.figure, [st.title, st.body, st.prompt, st.options, st.statements, st.explain, st.hint, st.figure?.caption])
  }
  if (s.project.runtime === 'math') s.project.tasks.forEach((t, i) => check(`${s.project.id}/task${i}`, t.figure, [t.prompt, t.given, t.figure?.caption]))
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(bad ? `${bad} possible mismatches in ${checked} figures` : `ok — ${checked} figures`)
process.exit(bad ? 1 : 0)
