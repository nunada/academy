// Chooses the Sum Sudoku puzzles of the game from what tools/sumsudoku-generate.mjs made, and writes src/content/sumsudoku-levels.ts (do not edit that file by hand).
//   node tools/sumsudoku-build.mjs
// Five sizes of PER_TIER puzzles each: 4x4, 6x6 and three of 9x9 (easy: small cages, the rules alone; medium: bigger cages, the rules alone; hard: a digit has to be tried).
// Inside a size the easiest comes first, so that a size climbs. Every puzzle is measured again with the solver as it is now, and the independent solver of the checker has to agree.
import fs from 'node:fs'
import { dlxCount, loadEngine, shape } from './sudoku-lib.mjs'

const N = await loadEngine()
const PER_TIER = 8
const puzzleOf = (p) => {
  const [br, bc] = shape(p.n)
  const solution = p.sol.join('').split('').map(Number)
  const cages = p.cages.map(([sum, cells]) => ({ sum, cells }))
  const given = new Array(p.n * p.n).fill(0)
  for (const c of cages) if (c.cells.length === 1) given[c.cells[0]] = c.sum // a cage of one cell is a digit that is given
  return { id: 'x', n: p.n, br, bc, given, solution, cages }
}
const measure = (p) => {
  const q = puzzleOf(p)
  const r = N.solvePuzzle(q, 2, 2000)
  return r.count === 1 && !r.exhausted ? r.nodes : null
}
const load = (size) => {
  const seen = new Set()
  return fs
    .readdirSync('tmp')
    .filter((f) => new RegExp(`^ss-${size}-\\d+\\.json$`).test(f))
    .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
    .filter((p) => {
      const key = p.cages.map(([s, c]) => s + ':' + c.join(',')).join('|')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((p) => ({ ...p, nodes: measure(p) }))
    .filter((p) => p.nodes !== null)
}
const spread = (pool) => {
  const picked = []
  const used = new Set()
  for (let i = 0; i < PER_TIER; i++) {
    const q = 0.04 + (0.92 * i) / (PER_TIER - 1)
    let at = Math.min(pool.length - 1, Math.floor(q * pool.length))
    while (used.has(at) && at + 1 < pool.length) at++
    used.add(at)
    picked.push(pool[at])
  }
  return picked
}
const key = (p) => p.cages.map(([s, c]) => s + ':' + c.join(',')).join('|')
const byCages = (a, b) => b.count - a.count || a.nodes - b.nodes || key(a).localeCompare(key(b))
const byNodes = (a, b) => a.nodes - b.nodes || b.count - a.count || key(a).localeCompare(key(b))

const tiers = [
  { id: 's4', size: 4, pick: (p) => p.sort(byCages) },
  { id: 's6', size: 6, pick: (p) => p.filter((q) => q.nodes === 1).sort(byCages) },
  { id: 's9e', size: 9, pick: (p) => p.filter((q) => q.nodes === 1 && q.count >= 42).sort(byCages) },
  { id: 's9m', size: 9, pick: (p) => p.filter((q) => q.nodes === 1 && q.count <= 38 && q.count >= 28).sort(byCages) },
  { id: 's9h', size: 9, pick: (p) => p.filter((q) => q.nodes >= 4 && q.count <= 32).sort(byNodes) },
]
const out = {}
let report = ''
const pools = { 4: load(4), 6: load(6), 9: load(9) }
for (const t of tiers) {
  const pool = t.pick(pools[t.size].slice())
  if (pool.length < PER_TIER) {
    report += `${t.id}: only ${pool.length} puzzles, ${PER_TIER} are needed\n`
    continue
  }
  const picked = spread(pool)
  // the independent solver must find the same single answer
  for (const p of picked) {
    const r = dlxCount(puzzleOf(p), 2)
    if (r.count !== 1 || r.first.join('') !== p.sol.join('')) throw new Error(`${t.id}: the second solver disagrees about a puzzle`)
  }
  out[t.id] = picked.map((p) => ({ cages: p.cages, sol: p.sol }))
  report += `${t.id}: ${pool.length} puzzles; cages ${picked.map((p) => p.count).join(' ')}; single-cell cages ${picked.map((p) => p.singles).join(' ')}; nodes ${picked.map((p) => p.nodes).join(' ')}\n`
}
const body = Object.entries(out)
  .map(([k, list]) => `  ${k}: [\n${list.map((p) => `    { cages: ${JSON.stringify(p.cages)}, sol: ${JSON.stringify(p.sol)} },`).join('\n')}\n  ],`)
  .join('\n')
fs.writeFileSync(
  'src/content/sumsudoku-levels.ts',
  `// Written by tools/sumsudoku-build.mjs from the puzzles of tools/sumsudoku-generate.mjs. Do not edit by hand.\n// Each has exactly one answer (the solver of src/lib/sudoku.ts, and tools/check-sumsudoku.mjs with a Dancing Links solver of its own).\n\nexport const GENERATED: Record<string, { cages: [number, number[]][]; sol: string[] }[]> = {\n${body}\n}\n`,
)
console.log(report + 'written')
