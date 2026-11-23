// Chooses the Tic-Tac-Logic puzzles of the game from what tools/tictaclogic-generate.mjs made, and writes src/content/tictaclogic-levels.ts (do not edit that file by hand).
//   node tools/tictaclogic-build.mjs
// Per size, PER_TIER puzzles, spread over how hard they are (the positions the solver had to look at, then fewer given cells), the easiest first, so that a size climbs.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

// the engine, to measure every puzzle again with the solver as it is now (the number of positions it needs changes when the solver learns a deduction)
const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ttbuild-'))
fs.writeFileSync(path.join(tmp, 'e.ts'), `export * from '${path.join(ROOT, 'src/lib/tictaclogic.ts').split(path.sep).join('/')}'`)
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: path.join(tmp, 'e.mjs'), logLevel: 'error' })
const N = await import('file://' + path.join(tmp, 'e.mjs').split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })
const SYMBOL = { X: 1, O: 2, '.': 0 }
const measure = (p) => {
  const given = p.rows.flatMap((r) => r.trim().split(/\s+/).map((c) => SYMBOL[c]))
  const r = N.solvePuzzle({ id: 'x', w: p.w, h: p.h, given, solution: given }, 2, 100000)
  return r.count === 1 && !r.exhausted ? r.nodes : null
}

const PER_TIER = 8
const SIZES = [4, 6, 8, 10, 12]
const out = {}
let report = ''
for (const size of SIZES) {
  const files = fs.readdirSync('tmp').filter((f) => new RegExp(`^tt-${size}-\\d+\\.json$`).test(f))
  const seen = new Set()
  const pool = files
    .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
    .filter((p) => (seen.has(p.rows.join('|')) ? false : (seen.add(p.rows.join('|')), true)))
    .map((p) => ({ ...p, nodes: measure(p) }))
    .filter((p) => p.nodes !== null)
    // a puzzle that has a given cell in every other cell is not a puzzle
    .filter((p) => p.givens <= Math.ceil(size * size * 0.5))
    // and not one so hard that proving it has one answer takes the second solver of the checker a minute
    .filter((p) => p.nodes <= 1200)
    // (a puzzle with very few given cells takes a solver that fits whole rows together far too long)
    .filter((p) => p.givens >= Math.floor(size * size * 0.27))
    .sort((a, b) => a.nodes - b.nodes || b.givens - a.givens || a.rows.join('|').localeCompare(b.rows.join('|')))
  if (pool.length < PER_TIER) {
    report += `${size}x${size}: only ${pool.length} puzzles, ${PER_TIER} are needed\n`
    continue
  }
  const picked = []
  const used = new Set()
  for (let i = 0; i < PER_TIER; i++) {
    const q = 0.06 + (0.92 * i) / (PER_TIER - 1)
    let at = Math.min(pool.length - 1, Math.floor(q * pool.length))
    while (used.has(at) && at + 1 < pool.length) at++
    used.add(at)
    picked.push(pool[at])
  }
  picked.sort((a, b) => a.nodes - b.nodes || b.givens - a.givens)
  out[`t${size}`] = picked.map((p) => ({ rows: p.rows, sol: p.sol }))
  report += `${size}x${size}: ${pool.length} puzzles; nodes of the ones chosen ${picked.map((p) => p.nodes).join(' ')}; given cells ${picked.map((p) => p.givens).join(' ')}\n`
}
const body = Object.entries(out)
  .map(([k, list]) => `  ${k}: [\n${list.map((p) => `    { rows: ${JSON.stringify(p.rows)}, sol: ${JSON.stringify(p.sol)} },`).join('\n')}\n  ],`)
  .join('\n')
fs.writeFileSync(
  'src/content/tictaclogic-levels.ts',
  `// Written by tools/tictaclogic-build.mjs from the puzzles of tools/tictaclogic-generate.mjs. Do not edit by hand.\n// Each has exactly one answer (the solver of src/lib/tictaclogic.ts, and tools/check-tictaclogic.mjs with a solver of its own).\n\nexport const GENERATED: Record<string, { rows: string[]; sol: string[] }[]> = {\n${body}\n}\n`,
)
console.log(report + 'written')
