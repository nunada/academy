// Makes Hashi puzzles with one answer.   node tools/hashi-generate.mjs <size> <islands> <seconds> <seed>
// Writes tmp/hs-<size>-<seed>.json, a list of { w, h, rows, links, nodes, islands }; tools/hashi-build.mjs chooses from these and writes src/content/hashi-levels.ts.
//
// How: a random answer is built first (islands put one after another at the end of a new bridge, then more bridges between islands that see each other and have
// nothing in the way), the numbers are the bridges at each island, and the solver of src/lib/hashi.ts counts the answers of that puzzle. A puzzle is kept only when the
// count is exactly one and the search was not cut short.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hsgen-'))
fs.writeFileSync(path.join(tmp, 'e.ts'), `export * from '${path.join(ROOT, 'src/lib/hashi.ts').split(path.sep).join('/')}'`)
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: path.join(tmp, 'e.mjs'), logLevel: 'error' })
const N = await import('file://' + path.join(tmp, 'e.mjs').split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

const [S, TARGET, SECS, SEED] = process.argv.slice(2).map(Number)
if (!S || !TARGET || !SECS) {
  console.error('usage: node tools/hashi-generate.mjs <size> <islands> <seconds> <seed>')
  process.exit(1)
}
const seed = SEED || 1
let s = seed >>> 0
const rand = () => {
  s = (s + 0x6d2b79f5) >>> 0
  let t = s
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rint = (n) => Math.floor(rand() * n)
const pickFrom = (list) => list[rint(list.length)]
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const MAX_LEN = Math.min(6, S - 1)
const EXTRA = 0.5

/** A random answer: islands and the bridges between them ([a, b, count], islands in the order they were made), or null. */
function randomAnswer() {
  const occ = new Int8Array(S * S) // 0 empty, 1 island, 2 bridge
  const islands = [{ x: rint(S), y: rint(S) }]
  occ[islands[0].y * S + islands[0].x] = 1
  const links = []
  for (let tries = 0; tries < 600 && islands.length < TARGET; tries++) {
    const ai = rint(islands.length)
    const a = islands[ai]
    const [dx, dy] = pickFrom(DIRS)
    const len = 2 + rint(MAX_LEN - 1)
    const tx = a.x + dx * len
    const ty = a.y + dy * len
    if (tx < 0 || ty < 0 || tx >= S || ty >= S) continue
    let free = true
    for (let k = 1; k < len; k++) if (occ[(a.y + dy * k) * S + a.x + dx * k] !== 0) free = false
    if (!free || occ[ty * S + tx] !== 0) continue
    // the new island may not touch another island
    if (DIRS.some(([ex, ey]) => {
      const x = tx + ex
      const y = ty + ey
      return x >= 0 && y >= 0 && x < S && y < S && occ[y * S + x] === 1
    })) continue
    for (let k = 1; k < len; k++) occ[(a.y + dy * k) * S + a.x + dx * k] = 2
    occ[ty * S + tx] = 1
    islands.push({ x: tx, y: ty })
    links.push([ai, islands.length - 1, rand() < 0.6 ? 1 : 2])
  }
  if (islands.length < TARGET) return null
  // more bridges, between islands that see each other with nothing in the way
  const { edges } = N.layout(S, S, islands)
  const used = new Set(links.map(([a, b]) => `${Math.min(a, b)},${Math.max(a, b)}`))
  for (const e of edges) {
    if (used.has(`${Math.min(e.a, e.b)},${Math.max(e.a, e.b)}`)) continue
    if (e.cells.length === 0 || e.cells.some((c) => occ[c] !== 0)) continue
    if (rand() > EXTRA) continue
    for (const c of e.cells) occ[c] = 2
    links.push([e.a, e.b, rand() < 0.6 ? 1 : 2])
  }
  return { islands, links }
}

const found = new Map()
const out = `tmp/hs-${S}-${seed}.json`
const save = () => fs.writeFileSync(out, JSON.stringify([...found.values()]))
const t0 = Date.now()
let tried = 0
while ((Date.now() - t0) / 1000 < SECS) {
  const a = randomAnswer()
  if (!a) continue
  tried++
  // reading order
  const order = a.islands.map((_, i) => i).sort((i, j) => a.islands[i].y - a.islands[j].y || a.islands[i].x - a.islands[j].x)
  const idOf = new Map(order.map((old, k) => [old, k]))
  const islands = order.map((old) => ({ ...a.islands[old], n: 0 }))
  const links = a.links.map(([x, y, k]) => [idOf.get(x), idOf.get(y), k])
  for (const [x, y, k] of links) (islands[x].n += k), (islands[y].n += k)
  if (islands.some((is) => is.n > 8)) continue
  const lay = N.layout(S, S, islands)
  const solution = lay.edges.map((e) => {
    const l = links.find(([x, y]) => (x === e.a && y === e.b) || (x === e.b && y === e.a))
    return l ? l[2] : 0
  })
  const p = { id: 'x', w: S, h: S, islands, ...lay, solution }
  const r = N.solvePuzzle(p, 2, 60_000)
  if (r.count === 0 && !r.exhausted) throw new Error('the solver found no answer, but there is one: ' + JSON.stringify({ islands, links }))
  if (r.count !== 1 || r.exhausted) continue
  const grid = Array.from({ length: S }, () => new Array(S).fill('.'))
  for (const is of islands) grid[is.y][is.x] = String(is.n)
  const rows = grid.map((row) => row.join(' '))
  const key = rows.join('|')
  if (found.has(key)) continue
  found.set(key, { w: S, h: S, rows, links, nodes: r.nodes, rounds: r.rounds, islands: islands.length })
  if (found.size % 10 === 0) save()
}
save()
console.log(`${S}x${S} with ${TARGET} islands, seed ${seed}: ${tried} answers tried, ${found.size} puzzles with one answer`)
