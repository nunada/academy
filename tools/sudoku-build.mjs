// Chooses the Sudoku puzzles of the game from what tools/sudoku-generate.mjs made, and writes src/content/sudoku-levels.ts (do not edit that file by hand).
//   node tools/sudoku-build.mjs
// Five sizes of PER_TIER puzzles each: 4x4, 6x6 and three of 9x9 (easy: the rules alone, many digits given; medium: the rules alone, few given; hard: the rules alone are not enough,
// a digit has to be tried). Inside a size the easiest comes first, so that a size climbs. Every puzzle is measured again with the solver as it is now.
import fs from 'node:fs'
import { loadEngine, shape } from './sudoku-lib.mjs'

const N = await loadEngine()
const PER_TIER = 8
const measure = (p) => {
  const [br, bc] = shape(p.n)
  const given = p.rows.join('').split('').map((c) => (c === '.' ? 0 : Number(c)))
  const solution = p.sol.join('').split('').map(Number)
  const r = N.solvePuzzle({ id: 'x', n: p.n, br, bc, given, solution, cages: null }, 2, 100000)
  return r.count === 1 && !r.exhausted ? r.nodes : null
}
const load = (size) => {
  const seen = new Set()
  return fs
    .readdirSync('tmp')
    .filter((f) => new RegExp(`^sd-${size}-\\d+\\.json$`).test(f))
    .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
    .filter((p) => (seen.has(p.rows.join('|')) ? false : (seen.add(p.rows.join('|')), true)))
    .map((p) => ({ ...p, nodes: measure(p) }))
    .filter((p) => p.nodes !== null)
}
/** PER_TIER puzzles spread over the pool, which is already in the order of the climb */
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
const byGivens = (a, b) => b.givens - a.givens || a.rows.join('|').localeCompare(b.rows.join('|'))
const byNodes = (a, b) => a.nodes - b.nodes || b.givens - a.givens || a.rows.join('|').localeCompare(b.rows.join('|'))

const tiers = [
  { id: 's4', size: 4, pick: (p) => p.sort(byGivens) },
  { id: 's6', size: 6, pick: (p) => p.sort(byGivens) },
  { id: 's9e', size: 9, pick: (p) => p.filter((q) => q.nodes === 1 && q.givens >= 34).sort(byGivens) },
  { id: 's9m', size: 9, pick: (p) => p.filter((q) => q.nodes === 1 && q.givens <= 30).sort(byGivens) },
  { id: 's9h', size: 9, pick: (p) => p.filter((q) => q.nodes >= 4).sort(byNodes) },
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
  out[t.id] = picked.map((p) => ({ rows: p.rows, sol: p.sol }))
  report += `${t.id}: ${pool.length} puzzles; given ${picked.map((p) => p.givens).join(' ')}; nodes ${picked.map((p) => p.nodes).join(' ')}\n`
}
const body = Object.entries(out)
  .map(([k, list]) => `  ${k}: [\n${list.map((p) => `    { rows: ${JSON.stringify(p.rows)}, sol: ${JSON.stringify(p.sol)} },`).join('\n')}\n  ],`)
  .join('\n')
fs.writeFileSync(
  'src/content/sudoku-levels.ts',
  `// Written by tools/sudoku-build.mjs from the puzzles of tools/sudoku-generate.mjs. Do not edit by hand.\n// Each has exactly one answer (the solver of src/lib/sudoku.ts, and tools/check-sudoku.mjs with a Dancing Links solver of its own).\n\nexport const GENERATED: Record<string, { rows: string[]; sol: string[] }[]> = {\n${body}\n}\n`,
)
console.log(report + 'written')
