// Makes Nurikabe puzzles with one answer.   node tools/nurikabe-generate.mjs <width> <height> <seconds> <seed>
// Writes tmp/nk-<width>x<height>-<seed>.json, a list of { w, h, rows, sea, nodes, islands }; tools/nurikabe-build.mjs chooses from these and writes src/content/nurikabe-levels.ts.
//
// How: a random answer is built first (islands grown where a 2x2 block of sea is, as long as the sea stays one piece), then a number is put on one cell of every island,
// and the solver of src/lib/nurikabe.ts counts the answers of that puzzle. Where the number sits decides whether the puzzle has one answer, so other places for the numbers
// are tried; a puzzle is kept only when the count is exactly one and the search was not cut short.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nkgen-'))
fs.writeFileSync(path.join(tmp, 'e.ts'), `export * from '${path.join(ROOT, 'src/lib/nurikabe.ts').split(path.sep).join('/')}'`)
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: path.join(tmp, 'e.mjs'), logLevel: 'error' })
const N = await import('file://' + path.join(tmp, 'e.mjs').split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

const [W, H, SECS, SEED] = process.argv.slice(2).map(Number)
if (!W || !H || !SECS) {
  console.error('usage: node tools/nurikabe-generate.mjs <width> <height> <seconds> <seed>')
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
const pickFrom = (list) => list[Math.floor(rand() * list.length)]
const shuffle = (list) => {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const n = W * H
const nb = N.neighborTable(W, H)
const MAX_SIZE = Math.min(9, Math.max(4, Math.round((W + H) / 2) - 1))
const SIZE_WEIGHTS = [0, 3, 5, 6, 5, 4, 3, 2, 1, 1]
const pickSize = () => {
  const bag = []
  for (let k = 1; k <= MAX_SIZE; k++) for (let c = 0; c < SIZE_WEIGHTS[k]; c++) bag.push(k)
  return pickFrom(bag)
}

/** A random answer: island ids per cell (-1 = sea), or null when it did not work out. */
function randomAnswer() {
  const id = new Int32Array(n).fill(-1)
  let count = 0
  const seaConnected = () => {
    let first = -1
    let total = 0
    for (let i = 0; i < n; i++) if (id[i] < 0) (total++, first < 0 && (first = i))
    if (total === 0) return false
    const seen = new Uint8Array(n)
    const q = [first]
    seen[first] = 1
    for (let k = 0; k < q.length; k++) for (const m of nb[q[k]]) if (!seen[m] && id[m] < 0) (seen[m] = 1), q.push(m)
    return q.length === total
  }
  for (let iter = 0; iter < 300; iter++) {
    const pools = []
    for (let y = 0; y + 1 < H; y++)
      for (let x = 0; x + 1 < W; x++) {
        const a = y * W + x
        const cells = [a, a + 1, a + W, a + W + 1]
        if (cells.every((c) => id[c] < 0)) pools.push(cells)
      }
    if (pools.length === 0) break
    let placed = false
    for (const c of shuffle(pickFrom(pools))) {
      if (nb[c].some((m) => id[m] >= 0)) continue
      const target = pickSize()
      const isl = [c]
      id[c] = count
      for (let guard = 0; isl.length < target && guard < 60; guard++) {
        const cand = []
        for (const a of isl) for (const m of nb[a]) if (id[m] < 0 && !cand.includes(m) && nb[m].every((o) => id[o] < 0 || id[o] === count)) cand.push(m)
        if (cand.length === 0) break
        const m = pickFrom(cand)
        id[m] = count
        isl.push(m)
      }
      if (!seaConnected()) {
        for (const a of isl) id[a] = -1
        continue
      }
      count++
      placed = true
      break
    }
    if (!placed) return null
  }
  // no pool, one sea
  for (let y = 0; y + 1 < H; y++)
    for (let x = 0; x + 1 < W; x++) {
      const a = y * W + x
      if (id[a] < 0 && id[a + 1] < 0 && id[a + W] < 0 && id[a + W + 1] < 0) return null
    }
  if (!seaConnected()) return null
  const seaCount = id.reduce((t, v) => t + (v < 0 ? 1 : 0), 0)
  if (count < Math.floor(n / 9) || seaCount < n * 0.34 || seaCount > n * 0.6) return null
  return { id, count }
}

const found = new Map()
const out = `tmp/nk-${W}x${H}-${seed}.json`
const save = () => fs.writeFileSync(out, JSON.stringify([...found.values()]))
const t0 = Date.now()
let tried = 0
let answers = 0
while ((Date.now() - t0) / 1000 < SECS) {
  const a = randomAnswer()
  if (!a) continue
  answers++
  const islands = Array.from({ length: a.count }, () => [])
  a.id.forEach((v, i) => v >= 0 && islands[v].push(i))
  const solution = Array.from(a.id, (v) => v < 0)
  for (let attempt = 0; attempt < 25; attempt++) {
    tried++
    const clue = new Array(n).fill(0)
    for (const cells of islands) clue[pickFrom(cells)] = cells.length
    const p = { id: 'x', w: W, h: H, clue, solution }
    const r = N.solvePuzzle(p, 2, 60_000)
    if (r.count === 0 && !r.exhausted) throw new Error('the solver found no answer, but there is one: ' + JSON.stringify({ clue, solution }))
    if (r.count === 1 && !r.exhausted) {
      const rows = []
      const sea = []
      for (let y = 0; y < H; y++) {
        rows.push(clue.slice(y * W, y * W + W).map((v) => (v ? String(v) : '.')).join(' '))
        sea.push(solution.slice(y * W, y * W + W).map((v) => (v ? '#' : '.')).join(''))
      }
      const key = rows.join('|')
      if (!found.has(key)) {
        found.set(key, { w: W, h: H, rows, sea, nodes: r.nodes, islands: a.count })
        if (found.size % 10 === 0) save()
      }
      break
    }
  }
}
save()
console.log(`${W}x${H} seed ${seed}: ${answers} answers tried, ${tried} number placements, ${found.size} puzzles with one answer`)
