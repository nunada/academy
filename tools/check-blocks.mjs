// Usage (from repo root): node tools/check-blocks.mjs <course-dir>
// Also checks the lesson steps around the levels: answers in range, one blank per ___, hints on every question,
// and that no English string carries Indonesian words.
// Runs the model solution of every robot level in a Code Blocks course and fails when
//  - a solution does not pass its own level (the level cannot be solved),
//  - the empty program already passes (the level asks for nothing),
//  - a solution breaks the level's own limits (block count, required blocks, allowed blocks),
//  - a block the level offers is missing from the allowed list, or a variable/block name is undeclared.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const course = process.argv[2]
if (!course) { console.error('give a course dir'); process.exit(2) }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'blocks-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(path.join(tmp, 'e.ts'), `export { modules } from '${q(`src/content/${course}/index.ts`)}'\nexport { checkLevel, allBlocks, emptyProgram } from '${q('src/lib/blocks.ts')}'`)
const out = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const { modules, checkLevel, allBlocks, emptyProgram } = await import('file://' + out.replace(/\\/g, '/'))

let levels = 0
const problems = []
const bad = (where, msg) => problems.push(`${where}: ${msg}`)

function inspect(where, level, solution, starter) {
  levels++
  const rep = checkLevel(level, solution)
  if (!rep.ok) {
    const why = [...rep.program.map((p) => p.code), ...rep.worlds.flatMap((w, i) => w.issues.map((x) => `map${i + 1}:${x.code}${x.fault ? '/' + x.fault.code : ''}`))]
    bad(where, `solution does not pass (${why.join(', ')})`)
  }
  if (!starter && checkLevel(level, emptyProgram()).ok) bad(where, 'the empty program already passes')
  const kinds = allBlocks(solution).map((b) => b.t)
  for (const k of new Set(kinds)) if (!level.allowed.includes(k)) bad(where, `the solution uses "${k}", which the palette does not offer`)
  const names = new Set(Object.keys(solution.defs ?? {}))
  for (const n of level.defs ?? []) if (!names.has(n)) bad(where, `the level offers the block "${n}" but the solution does not define it`)
  for (const n of names) if (!(level.defs ?? []).includes(n)) bad(where, `the solution defines "${n}" which the level does not list`)
  for (const b of allBlocks(solution)) {
    if (['set', 'change'].includes(b.t) && !(level.vars ?? []).includes(b.name)) bad(where, `variable "${b.name}" is not declared in the level`)
    if (b.t === 'call' && !(level.defs ?? []).includes(b.name)) bad(where, `call of an undeclared block "${b.name}"`)
  }
  if (level.worlds.some((w) => !w.some((r) => /[>v<^]/.test(r)))) bad(where, 'a world has no robot')
  for (const [i, w] of level.worlds.entries()) {
    const widths = new Set(w.map((r) => r.length))
    if (widths.size > 1) bad(where, `map ${i + 1} has rows of different lengths`)
    if (level.goal.reach && !w.some((r) => r.includes('G'))) bad(where, `map ${i + 1} has no goal but the level asks to reach it`)
  }
}

const ID = /\b(yang|dan|dengan|adalah|untuk|tidak|dari|pada|ini|itu|atau|sebagai|karena|maka|jika|bila|setiap|semua|akan|bisa|dapat|lebih|oleh|saat|ketika|kamu|robot menghadap|langkah)\b/i
const loc = (v) => v && typeof v === 'object' && 'en' in v && 'id' in v
function words(where, v) {
  if (loc(v)) {
    if (ID.test(String(v.en).replace(/`[^`]*`/g, ''))) bad(where, `Indonesian word in en: ${String(v.en).slice(0, 60)}`)
    if (v.en === v.id && /[a-z]{4}/i.test(v.en)) bad(where, `en and id are identical: ${String(v.en).slice(0, 50)}`)
  } else if (v && typeof v === 'object') for (const x of Array.isArray(v) ? v : Object.values(v)) words(where, x)
}
const ids = new Set()
function sanity(where, st) {
  const hint = st.hint ?? st.hints
  if (['quiz', 'multi', 'judge', 'fill', 'order'].includes(st.kind) && !hint) bad(where, 'no hint')
  if (st.kind === 'blocks' && (!st.hints || st.hints.length === 0)) bad(where, 'a robot step with no hints')
  if (st.kind === 'quiz' && !(st.answer >= 0 && st.answer < st.options.length)) bad(where, 'answer out of range')
  if (st.kind === 'multi') {
    if (st.answer.some((a) => a < 0 || a >= st.options.length)) bad(where, 'answer out of range')
    if (st.answer.length === st.options.length) bad(where, 'every option is correct')
    if (st.answer.length < 2 && !/\b(ONE|SATU)\b/.test(JSON.stringify(st.prompt))) bad(where, 'a choose-all question with a single right option')
  }
  if (st.kind === 'judge' && st.answer.length !== st.statements.length) bad(where, 'judge answers do not match statements')
  if (st.kind === 'fill') {
    for (const lang of ['en', 'id']) {
      const t = typeof st.template === 'string' ? st.template : st.template[lang]
      const b = Array.isArray(st.blanks) ? st.blanks : st.blanks[lang]
      if (t.split('___').length - 1 !== b.length) bad(where, `${lang}: the template has ${t.split('___').length - 1} blanks but ${b.length} answers`)
    }
  }
  if (st.kind === 'order') {
    const a = Array.isArray(st.lines) ? st.lines : st.lines.en
    const b = Array.isArray(st.lines) ? st.lines : st.lines.id
    if (a.length !== b.length) bad(where, 'en and id have a different number of lines')
  }
  words(where, st)
}

for (const m of modules) for (const s of m.submodules) {
  for (const l of s.lessons) {
    if (ids.has(l.id)) bad(l.id, 'duplicate id'); ids.add(l.id)
    words(l.id, l.title); words(l.id, l.goal)
    const stepIds = new Set()
    for (const st of l.steps) {
      if (stepIds.has(st.id)) bad(l.id, `duplicate step id ${st.id}`); stepIds.add(st.id)
      sanity(`${l.id}/${st.id}`, st)
    }
  }
  words(s.id, s.title); words(s.id, s.summary); words(s.project.id, [s.project.title, s.project.brief, s.project.requirements, s.project.hints])
  if (s.project.runtime === 'blocks') s.project.tasks.forEach((t, i) => words(`${s.project.id}/task${i}`, t.prompt))
  for (const l of s.lessons) for (const st of l.steps) if (st.kind === 'blocks') inspect(`${l.id}/${st.id}`, st.level, st.solution, st.starter)
  if (s.project.runtime === 'blocks') s.project.tasks.forEach((t, i) => inspect(`${s.project.id}/task${i}`, t.level, t.solution, t.starter))
}
fs.rmSync(tmp, { recursive: true, force: true })
if (problems.length) { console.log(problems.join('\n')); console.log(`${problems.length} problems in ${levels} levels`); process.exit(1) }
console.log(`ok — ${levels} robot levels, every solution passes`)
