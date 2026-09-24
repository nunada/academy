// Usage (from repo root): node <this file> fundamentals fungsi ...
// Bundles each course's curriculum, then checks every concept step's body:
//  - EN and ID have the same block structure (same block count/types, same list length, same table rows x cols)
//  - every table row within a table has the same number of cells
// Prints per-course counts of concept bodies using lists/tables, and any problems. Exit 1 on problems.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const courses = process.argv.slice(2)
if (!courses.length) { console.error('give course dirs'); process.exit(2) }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'blocks-'))
let bad = 0

function cells(line) {
  const out = []
  let cur = '', inMath = false
  for (const ch of line.trim()) {
    if (ch === '$') inMath = !inMath
    if (ch === '|' && !inMath) { out.push(cur.trim()); cur = '' } else cur += ch
  }
  out.push(cur.trim())
  if (out[0] === '') out.shift()
  if (out[out.length - 1] === '') out.pop()
  return out
}
function shape(text) {
  return text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const lines = b.split('\n').map((l) => l.trim())
    if (lines.every((l) => l.startsWith('- '))) return { t: 'ul', n: lines.length }
    if (lines.every((l) => /^\d+\.\s/.test(l))) return { t: 'ol', n: lines.length }
    if (lines.every((l) => l.startsWith('|'))) {
      const rows = lines.filter((l) => !/^\|[\s:|-]+\|?$/.test(l)).map(cells)
      return { t: 'table', rows: rows.length, cols: rows.map((r) => r.length) }
    }
    const badMix = lines.some((l) => l.startsWith('- ') || l.startsWith('|') || /^\d+\.\s/.test(l))
    return { t: badMix ? 'MIXED' : 'p' }
  })
}

for (const c of courses) {
  const entry = path.join(tmp, c + '.ts')
  fs.writeFileSync(entry, `export { modules } from '${path.join(ROOT, 'src/content', c, 'index.ts').replace(/\\/g, '/')}'`)
  const out = path.join(tmp, c + '.mjs')
  await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
  const { modules } = await import('file://' + out.replace(/\\/g, '/'))
  let concepts = 0, structured = 0
  for (const m of modules) for (const s of m.submodules) for (const l of s.lessons) for (const st of l.steps) {
    if (st.kind !== 'concept') continue
    concepts++
    const en = shape(st.body.en), id = shape(st.body.id)
    if (en.some((b) => b.t !== 'p')) structured++
    const where = `${c} ${l.id}/${st.id}`
    if (JSON.stringify(en.map((b) => b.t)) !== JSON.stringify(id.map((b) => b.t))) { console.log('STRUCTURE MISMATCH', where); bad++ }
    else en.forEach((b, i) => {
      const o = id[i]
      if ((b.t === 'ul' || b.t === 'ol') && b.n !== o.n) { console.log('LIST LENGTH MISMATCH', where); bad++ }
      if (b.t === 'table' && (b.rows !== o.rows || JSON.stringify(b.cols) !== JSON.stringify(o.cols))) { console.log('TABLE SHAPE MISMATCH', where, JSON.stringify(b.cols), JSON.stringify(o.cols)); bad++ }
      if (b.t === 'table' && new Set(b.cols).size !== 1) { console.log('RAGGED TABLE', where, JSON.stringify(b.cols)); bad++ }
      if (b.t === 'MIXED') { console.log('MIXED BLOCK (blank line needed between list/table and paragraph)', where); bad++ }
    })
  }
  console.log(`${c}: ${concepts} concept steps, ${structured} use lists/tables`)
}
console.log(bad ? `${bad} PROBLEMS` : 'ok')
process.exit(bad ? 1 : 0)
