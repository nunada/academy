// Usage (from repo root): node tools/check-blocks.mjs <course-dir>
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

for (const m of modules) for (const s of m.submodules) {
  for (const l of s.lessons) for (const st of l.steps) if (st.kind === 'blocks') inspect(`${l.id}/${st.id}`, st.level, st.solution, st.starter)
  if (s.project.runtime === 'blocks') s.project.tasks.forEach((t, i) => inspect(`${s.project.id}/task${i}`, t.level, t.solution, t.starter))
}
fs.rmSync(tmp, { recursive: true, force: true })
if (problems.length) { console.log(problems.join('\n')); console.log(`${problems.length} problems in ${levels} levels`); process.exit(1) }
console.log(`ok — ${levels} robot levels, every solution passes`)
