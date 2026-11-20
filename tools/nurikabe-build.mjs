// Chooses the Nurikabe puzzles of the game from what tools/nurikabe-generate.mjs made, and writes src/content/nurikabe-levels.ts (do not edit that file by hand).
//   node tools/nurikabe-build.mjs
// Per size, PER_TIER puzzles, spread over how hard the solver found them (the number of positions it had to look at), the easiest first, so that a size climbs.
import fs from 'node:fs'

const PER_TIER = 8
const SIZES = [5, 6, 7, 8, 9]
const out = {}
let report = ''
for (const size of SIZES) {
  const files = fs.readdirSync('tmp').filter((f) => new RegExp(`^nk-${size}x${size}-\\d+\\.json$`).test(f))
  const seen = new Set()
  const pool = files
    .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
    .filter((p) => (seen.has(p.rows.join('|')) ? false : (seen.add(p.rows.join('|')), true)))
    // not so few numbers that a puzzle is mostly empty, and not a puzzle of all ones
    .filter((p) => p.islands >= Math.floor((size * size) / 8))
    .sort((a, b) => a.nodes - b.nodes || a.rows.join('|').localeCompare(b.rows.join('|')))
  if (pool.length < PER_TIER) {
    report += `${size}x${size}: only ${pool.length} puzzles, ${PER_TIER} are needed\n`
    continue
  }
  const picked = []
  const used = new Set()
  for (let i = 0; i < PER_TIER; i++) {
    const q = 0.08 + (0.9 * i) / (PER_TIER - 1)
    let at = Math.min(pool.length - 1, Math.floor(q * pool.length))
    while (used.has(at) && at + 1 < pool.length) at++
    used.add(at)
    picked.push(pool[at])
  }
  out[`n${size}`] = picked.map((p) => ({ rows: p.rows, sea: p.sea }))
  report += `${size}x${size}: ${pool.length} puzzles, nodes of the ones chosen: ${picked.map((p) => p.nodes).join(' ')}\n`
}
const body = Object.entries(out)
  .map(([k, list]) => `  ${k}: [\n${list.map((p) => `    { rows: ${JSON.stringify(p.rows)}, sea: ${JSON.stringify(p.sea)} },`).join('\n')}\n  ],`)
  .join('\n')
fs.writeFileSync(
  'src/content/nurikabe-levels.ts',
  `// Written by tools/nurikabe-build.mjs from the puzzles of tools/nurikabe-generate.mjs. Do not edit by hand.\n// Each has exactly one answer (the solver of src/lib/nurikabe.ts, and tools/check-nurikabe.mjs with a solver of its own).\n\nexport const GENERATED: Record<string, { rows: string[]; sea: string[] }[]> = {\n${body}\n}\n`,
)
console.log(report + 'written')
