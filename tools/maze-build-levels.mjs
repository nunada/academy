// Chooses the levels of Number Maze from what tools/maze-generator.mjs found, and writes src/content/numbermaze-levels.ts.
//   node tools/maze-build-levels.mjs
// Per chapter: a few easy ones to begin with (the "intro" runs of the generator), then the others spread over the range of difficulty, so that the chapter climbs
// (a score of the length of the shortest way, the share of dead positions, how few shortest ways there are and how large the game is). Nothing else is done to a
// level: it is exactly what the generator made and the solver measured.
import fs from 'node:fs'
import process from 'node:process'

const CHAPTERS = [
  { id: 'arithmetic', prefix: 'ar', total: 14, intro: 0 },
  { id: 'negatives', prefix: 'ng', total: 14, intro: 3 },
  { id: 'powers', prefix: 'pw', total: 14, intro: 3 },
  { id: 'inequalities', prefix: 'in', total: 14, intro: 3 },
  { id: 'logarithms', prefix: 'lg', total: 14, intro: 3 },
  { id: 'numbers', prefix: 'nb', total: 14, intro: 3 },
  { id: 'fermat', prefix: 'fr', total: 16, intro: 2 },
]
/** how many hand-made tutorial levels open a chapter (they are in numbermaze.ts) */
const TUTORIAL = { arithmetic: 3 }
const MAX_STATES = 40_000

const score = (l) => l.par + 40 * l.deadRate - 3 * Math.log2(l.shortest) + 1.5 * Math.log2(l.states)
const files = fs.readdirSync('tmp').filter((f) => /^gen-[a-z]+(-intro|-relax|-hard)?-\d+\.json$/.test(f))
const out = {}
let report = ''
for (const ch of CHAPTERS) {
  const read = (intro) =>
    files
      .filter((f) => f.startsWith(`gen-${ch.id}${intro ? '-intro' : ''}-`) && (intro ? true : !f.includes('-intro-')))
      .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
      .filter((l) => l.states <= MAX_STATES)
  const seen = new Set()
  const uniq = (xs) => xs.filter((l) => (seen.has(l.grid.join('|') + l.startValue) ? false : (seen.add(l.grid.join('|') + l.startValue), true)))
  const main = uniq(read(false)).sort((a, b) => score(a) - score(b))
  const intro = uniq(read(true)).sort((a, b) => score(a) - score(b))
  const need = ch.total - (TUTORIAL[ch.id] ?? 0)
  const nIntro = Math.min(ch.intro, intro.length)
  const nMain = need - nIntro
  report += `${ch.id}: ${main.length} candidates, ${intro.length} intro; need ${nMain} + ${nIntro}\n`
  if (main.length < nMain) {
    report += `  NOT ENOUGH (${main.length} < ${nMain})\n`
  }
  // the intro levels: the easiest ones, spread a little
  const pickIntro = intro.length ? Array.from({ length: nIntro }, (_, i) => intro[Math.floor((i * intro.length) / Math.max(1, nIntro) * 0.6)]) : []
  // the others: evenly spaced over the sorted list, so the chapter climbs from the easy end to the hardest
  // (the easiest fifth of the pool is left out: the easy levels of a chapter are the intro ones)
  const pool = main.slice(Math.floor(main.length * 0.25))
  const pickMain = Array.from({ length: Math.min(nMain, pool.length) }, (_, i) => pool[Math.round((i * (pool.length - 1)) / Math.max(1, Math.min(nMain, pool.length) - 1))])
  out[ch.id] = [...pickIntro, ...pickMain].filter(Boolean)
  const pars = out[ch.id].map((l) => l.par)
  report += `  pars: ${pars.join(' ')}\n  dead: ${out[ch.id].map((l) => Math.round(l.deadRate * 100)).join(' ')}%\n`
}
console.log(report)

const body = Object.entries(out)
  .map(
    ([id, levels]) =>
      `  ${id}: [\n${levels
        .map((l) => `    { startValue: ${l.startValue}, minValue: ${l.minValue}, maxValue: ${l.maxValue}, par: ${l.par}, grid: [\n${l.grid.map((r) => `      '${r}',`).join('\n')}\n    ] },`)
        .join('\n')}\n  ],`,
  )
  .join('\n')
fs.writeFileSync(
  'src/content/numbermaze-levels.ts',
  `/** The generated levels of Number Maze, written by tools/maze-build-levels.mjs from what tools/maze-generator.mjs found and the solver measured. Do not edit by hand:
 *  run the two tools again. \`par\` is the length of the shortest way. */

export interface GeneratedLevel {
  startValue: number
  minValue: number
  maxValue: number
  par: number
  grid: string[]
}

export const GENERATED: Record<string, GeneratedLevel[]> = {
${body}
}
`,
)
console.log('written')
process.exit(0)
