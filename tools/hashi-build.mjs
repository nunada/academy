// Chooses the Hashi puzzles of the game from what tools/hashi-generate.mjs made, and writes src/content/hashi-levels.ts (do not edit that file by hand).
//   node tools/hashi-build.mjs
// Per size, PER_TIER puzzles, spread over how hard the solver found them (the number of positions it had to look at, then the number of islands), the easiest first,
// so that a size climbs.
import fs from 'node:fs'

const PER_TIER = 8
const SIZES = [5, 7, 9, 11, 13]
const out = {}
let report = ''
for (const size of SIZES) {
  const files = fs.readdirSync('tmp').filter((f) => new RegExp(`^hs-${size}-\\d+\\.json$`).test(f))
  const seen = new Set()
  const pool = files
    .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
    .filter((p) => (seen.has(p.rows.join('|')) ? false : (seen.add(p.rows.join('|')), true)))
    .sort((a, b) => a.nodes - b.nodes || (a.rounds ?? 0) - (b.rounds ?? 0) || a.islands - b.islands || a.rows.join('|').localeCompare(b.rows.join('|')))
  if (pool.length < PER_TIER) {
    report += `${size}x${size}: only ${pool.length} puzzles, ${PER_TIER} are needed\n`
    continue
  }
  const picked = []
  const used = new Set()
  for (let i = 0; i < PER_TIER; i++) {
    const q = 0.1 + (0.88 * i) / (PER_TIER - 1)
    let at = Math.min(pool.length - 1, Math.floor(q * pool.length))
    while (used.has(at) && at + 1 < pool.length) at++
    used.add(at)
    picked.push(pool[at])
  }
  picked.sort((a, b) => a.nodes - b.nodes || (a.rounds ?? 0) - (b.rounds ?? 0) || a.islands - b.islands)
  out[`h${size}`] = picked.map((p) => ({ rows: p.rows, links: p.links }))
  report += `${size}x${size}: ${pool.length} puzzles; nodes of the ones chosen ${picked.map((p) => p.nodes).join(' ')}; rounds ${picked.map((p) => p.rounds).join(' ')}; islands ${picked.map((p) => p.islands).join(' ')}\n`
}
const body = Object.entries(out)
  .map(([k, list]) => `  ${k}: [\n${list.map((p) => `    { rows: ${JSON.stringify(p.rows)}, links: ${JSON.stringify(p.links)} },`).join('\n')}\n  ],`)
  .join('\n')
fs.writeFileSync(
  'src/content/hashi-levels.ts',
  `// Written by tools/hashi-build.mjs from the puzzles of tools/hashi-generate.mjs. Do not edit by hand.\n// Each has exactly one answer (the solver of src/lib/hashi.ts, and tools/check-hashi.mjs with a solver of its own).\n\nexport const GENERATED: Record<string, { rows: string[]; links: [number, number, number][] }[]> = {\n${body}\n}\n`,
)
console.log(report + 'written')
