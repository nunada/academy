// Makes Sum Sudoku puzzles with one answer.   node tools/sumsudoku-generate.mjs <size 4|6|9> <seconds> <seed>
// Writes tmp/ss-<size>-<seed>.json, a list of { n, cages, sol, nodes, count, singles }; tools/sumsudoku-build.mjs chooses from these and writes src/content/sumsudoku-levels.ts.
//
// How: a random full grid is made. It starts as one cage for every cell (so the sum of a cage is the digit itself: the whole grid is given). Then two cages that touch are joined into one,
// at random, as long as their digits are all different, the cage stays small, and the solver of src/lib/sudoku.ts still finds exactly one answer. A puzzle is saved at several stages of
// that (many small cages: easy, few big ones: hard).
import fs from 'node:fs'
import process from 'node:process'
import { loadEngine, rng, shape } from './sudoku-lib.mjs'

const N = await loadEngine()
const [S, SECS, SEED] = process.argv.slice(2).map(Number)
if (![4, 6, 9].includes(S) || !SECS) {
  console.error('usage: node tools/sumsudoku-generate.mjs <4|6|9> <seconds> <seed>')
  process.exit(1)
}
const seed = SEED || 1
const rand = rng(seed)
const shuffle = (list) => {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const n = S
const [br, bc] = shape(n)
const cells = n * n

function randomGrid() {
  const g = new Array(cells).fill(0)
  const row = new Array(n).fill(0)
  const col = new Array(n).fill(0)
  const box = new Array(n).fill(0)
  let budget = 20000
  const rec = (i) => {
    if (i === cells) return true
    const r = Math.floor(i / n)
    const c = i % n
    const b = Math.floor(r / br) * (n / bc) + Math.floor(c / bc)
    for (const d of shuffle(Array.from({ length: n }, (_, k) => k + 1))) {
      const m = 1 << d
      if (row[r] & m || col[c] & m || box[b] & m) continue
      if (--budget < 0) return false
      g[i] = d
      row[r] |= m
      col[c] |= m
      box[b] |= m
      if (rec(i + 1)) return true
      g[i] = 0
      row[r] &= ~m
      col[c] &= ~m
      box[b] &= ~m
    }
    return false
  }
  return rec(0) ? g : null
}

const neighbours = (i) => {
  const r = Math.floor(i / n)
  const c = i % n
  const out = []
  if (r > 0) out.push(i - n)
  if (r < n - 1) out.push(i + n)
  if (c > 0) out.push(i - 1)
  if (c < n - 1) out.push(i + 1)
  return out
}
const pairs = []
for (let i = 0; i < cells; i++) for (const j of neighbours(i)) if (j > i) pairs.push([i, j])

const STAGES = { 4: [12, 10, 9, 8, 7, 6, 5], 6: [26, 22, 19, 17, 15, 14, 13, 12, 11, 10, 9], 9: [62, 52, 46, 42, 38, 35, 32, 30, 28, 26, 25, 24, 23, 22, 21, 20, 19] }[n]
const found = new Map()
const out = `tmp/ss-${S}-${seed}.json`
const save = () => fs.writeFileSync(out, JSON.stringify([...found.values()]))
const t0 = Date.now()
let grids = 0
const asCages = (cageOf, solution) => {
  const by = new Map()
  for (let i = 0; i < cells; i++) {
    const k = cageOf[i]
    if (!by.has(k)) by.set(k, [])
    by.get(k).push(i)
  }
  return [...by.values()].sort((a, b) => a[0] - b[0]).map((list) => ({ sum: list.reduce((s, c) => s + solution[c], 0), cells: list }))
}
const puzzleOf = (cageOf, solution) => {
  const cages = asCages(cageOf, solution)
  const given = new Array(cells).fill(0)
  for (const c of cages) if (c.cells.length === 1) given[c.cells[0]] = c.sum // a cage of one cell is a digit that is given
  return { id: 'x', n, br, bc, given, solution, cages }
}

while ((Date.now() - t0) / 1000 < SECS) {
  const solution = randomGrid()
  if (!solution) continue
  grids++
  const maxSize = n === 4 ? 4 : [3, 4, 4, 5][Math.floor(rand() * 4)]
  const cageOf = Array.from({ length: cells }, (_, i) => i)
  const members = new Map(Array.from({ length: cells }, (_, i) => [i, [i]]))
  let stageAt = 0
  const record = () => {
    const p = puzzleOf(cageOf, solution)
    const r = N.solvePuzzle(p, 2, 2000)
    if (r.count !== 1 || r.exhausted) return
    const key = p.cages.map((c) => c.sum + ':' + c.cells.join(',')).join('|')
    if (found.has(key)) return
    const sol = []
    for (let y = 0; y < n; y++) sol.push(solution.slice(y * n, y * n + n).join(''))
    found.set(key, { n, cages: p.cages.map((c) => [c.sum, c.cells]), sol, nodes: r.nodes, count: p.cages.length, singles: p.cages.filter((c) => c.cells.length === 1).length, maxSize })
  }
  for (let pass = 0; pass < 6; pass++) {
    let merged = 0
    for (const [a, b] of shuffle(pairs)) {
      const ka = cageOf[a]
      const kb = cageOf[b]
      if (ka === kb) continue
      const ma = members.get(ka)
      const mb = members.get(kb)
      if (ma.length + mb.length > maxSize) continue
      const digits = new Set(ma.map((c) => solution[c]))
      if (mb.some((c) => digits.has(solution[c]))) continue
      // try it
      for (const c of mb) cageOf[c] = ka
      const r = N.solvePuzzle(puzzleOf(cageOf, solution), 2, 150)
      if (r.count !== 1 || r.exhausted) {
        for (const c of mb) cageOf[c] = kb
        continue
      }
      members.set(ka, ma.concat(mb))
      members.delete(kb)
      merged++
      const left = members.size
      while (stageAt < STAGES.length && left <= STAGES[stageAt]) {
        record()
        stageAt++
      }
    }
    if (merged === 0) break
  }
  record() // the fewest cages that are left
  if (found.size % 10 < 4) save()
}
save()
console.log(`${S}x${S} seed ${seed}: ${grids} grids, ${found.size} puzzles with one answer`)
