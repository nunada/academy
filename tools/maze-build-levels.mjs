// Chooses the levels of Number Maze from what tools/maze-generator.mjs found, and writes src/content/numbermaze-levels.ts.
//   node tools/maze-build-levels.mjs
// Per chapter: a few easy ones to begin with (the "intro" runs of the generator), then the others spread over the range of difficulty, so that the chapter climbs
// (a score of the length of the shortest way, the share of dead positions, how few shortest ways there are and how large the game is). Nothing else is done to a
// level: it is exactly what the generator made and the solver measured.
import fs from 'node:fs'
import process from 'node:process'
import { M, analyze, prune, straight } from './maze-lib.mjs'

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

/** how many different ways may win a level: Sumaze levels are, for the most part, a single way (floor walked over differently is not a different way) */
const MAX_ROUTES = Number(process.env.MAX_ROUTES ?? 3)
const CACHE = 'tmp/refine-cache.json'
const refined = new Map(fs.existsSync(CACHE) ? Object.entries(JSON.parse(fs.readFileSync(CACHE, 'utf8'))) : [])
const saveCache = () => fs.writeFileSync(CACHE, JSON.stringify(Object.fromEntries(refined)))
/** A candidate pruned and measured again, or null when what is left is no longer a puzzle. */
function refine(c, isIntro) {
  const key = c.grid.join('|') + c.startValue + isIntro + MAX_ROUTES
  if (refined.has(key)) return refined.get(key)
  let out = null
  try {
    const src = { id: 'x', startValue: c.startValue, minValue: c.minValue, maxValue: c.maxValue, grid: c.grid }
    const p = prune(src, c.par)
    const level = M.parseLevel(p)
    const a = analyze(level, 120_000)
    const geo = straight(level)
    let placed = 0
    for (const row of level.tiles) for (const t of row) if (['op', 'gate', 'key', 'lock', 'oneway'].includes(t.kind)) placed++
    if (a && a.par !== null && geo !== null && placed >= 2 && a.par >= geo + (isIntro ? 2 : 6) && a.shortest <= 40 && a.routes <= MAX_ROUTES && a.states >= (isIntro ? 15 : 120)) {
      out = { ...c, grid: p.grid, par: a.par, shortest: a.shortest, routes: a.routes, states: a.states, deadRate: Math.round(a.deadRate * 1000) / 1000, placed }
    }
  } catch {
    out = null
  }
  refined.set(key, out)
  if (refined.size % 20 === 0) saveCache()
  return out
}

const score = (l) => l.par + 40 * l.deadRate - 2 * (l.routes ?? 1) - 3 * Math.log2(l.shortest) + 1.5 * Math.log2(l.states)
const files = fs.readdirSync('tmp').filter((f) => /^gen-[a-z]+(-intro|-relax|-hard)?-\d+\.json$/.test(f))
const out = {}
const usedOrig = new Set()
let report = ''
for (const ch of CHAPTERS) {
  const read = (intro) =>
    files
      .filter((f) => f.startsWith(`gen-${ch.id}${intro ? '-intro' : ''}-`) && (intro ? true : !f.includes('-intro-')))
      .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
      .filter((l) => l.states <= MAX_STATES)
  const seen = new Set()
  const uniq = (xs) => xs.filter((l) => (seen.has(l.grid.join('|') + l.startValue) ? false : (seen.add(l.grid.join('|') + l.startValue), true)))
  // the last chapter is "everything at once": what the other chapters did not use, with operators of three kinds or more in the room, is a candidate for it too
  const families = (l) => new Set(l.grid.flatMap((r) => r.trim().split(/\s+/)).map((t) => (/^(\+|-)\d/.test(t) ? 'addsub' : /^\*\d/.test(t) ? 'mul' : /^\/\d/.test(t) ? 'div' : /^%\d/.test(t) ? 'mod' : /^(\^\d|\d+\^)/.test(t) ? 'pow' : /^log/.test(t) ? 'log' : t === 'neg' || t === 'abs' ? 'sign' : /^\?/.test(t) ? 'gate' : /^key|^lock/.test(t) ? 'key' : null)).filter(Boolean)).size
  const borrowed =
    ch.id === 'fermat'
      ? files
          .filter((f) => !f.startsWith('gen-fermat') && !f.includes('-intro-'))
          .flatMap((f) => JSON.parse(fs.readFileSync(`tmp/${f}`, 'utf8')))
          .filter((l) => l.states <= MAX_STATES && !usedOrig.has(l.grid.join('|') + l.startValue) && families(l) >= 4 && l.par >= 14)
      : []
  const main = uniq([...read(false), ...borrowed]).sort((a, b) => score(a) - score(b))
  const intro = uniq(read(true)).sort((a, b) => score(a) - score(b))
  const need = ch.total - (TUTORIAL[ch.id] ?? 0)
  const nIntro = Math.min(ch.intro, intro.length)
  const nMain = need - nIntro
  report += `${ch.id}: ${main.length} candidates, ${intro.length} intro; need ${nMain} + ${nIntro}\n`
  if (main.length < nMain) {
    report += `  NOT ENOUGH (${main.length} < ${nMain})\n`
  }
  // every level that is chosen is pruned first: a tile that is not needed (taking it away changes nothing about the shortest way) is taken away, and what is left is measured again
  const chosen = new Set()
  const choose = (pool, wanted, isIntro) => {
    const got = []
    for (const target of wanted) {
      // near the wanted place of the climb, a level with one or two ways that win is preferred; failing that one with more, and failing that anywhere in the pool
      let found = null
      for (const [maxRoutes, reach] of [[2, 14], [MAX_ROUTES, 14], [MAX_ROUTES, pool.length]]) {
        for (let d = 0; d < reach && !found; d++) {
          for (const i of [target + d, target - d]) {
            const c = pool[i]
            if (!c || chosen.has(c) || found) continue
            const r = refine(c, isIntro)
            if (r && r.routes <= maxRoutes) {
              chosen.add(c)
              usedOrig.add(c.grid.join('|') + c.startValue)
              found = r
            }
          }
        }
        if (found) break
      }
      if (found) got.push(found)
    }
    return got
  }
  const pickIntro = intro.length ? choose(intro, Array.from({ length: nIntro }, (_, i) => Math.floor(((i * intro.length) / Math.max(1, nIntro)) * 0.6)), true) : []
  // the others: evenly spaced over the sorted list, so the chapter climbs from the easy end to the hardest
  // (the easiest fifth of the pool is left out: the easy levels of a chapter are the intro ones)
  const pool = main.slice(Math.floor(main.length * 0.25))
  const nPick = Math.min(nMain, pool.length)
  const pickMain = choose(pool, Array.from({ length: nPick }, (_, i) => Math.round((i * (pool.length - 1)) / Math.max(1, nPick - 1))), false)
  // a chapter that is short of levels (what the generator found did not survive the pruning and the count of ways) is filled up with the hardest of its easy runs
  const missing = nMain - pickMain.length
  const fill = missing > 0 ? choose(intro, Array.from({ length: missing }, (_, i) => intro.length - 1 - i * 3), true) : []
  out[ch.id] = [...pickIntro, ...fill, ...pickMain].filter(Boolean)
  const pars = out[ch.id].map((l) => l.par)
  report += `  pars: ${pars.join(' ')}\n  dead: ${out[ch.id].map((l) => Math.round(l.deadRate * 100)).join(' ')}%\n`
}
saveCache()
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
