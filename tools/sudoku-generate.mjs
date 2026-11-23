// Makes Sudoku puzzles with one answer.   node tools/sudoku-generate.mjs <size 4|6|9> <seconds> <seed>
// Writes tmp/sd-<size>-<seed>.json, a list of { n, rows, sol, nodes, givens }; tools/sudoku-build.mjs chooses from these and writes src/content/sudoku-levels.ts.
//
// How: a random full grid is built cell by cell. Then the given digits are taken away one at a time, in random order, for as long as the solver of src/lib/sudoku.ts still finds
// exactly one answer; a puzzle is saved at several stages of that (many given digits: easy, few: hard).
import fs from 'node:fs'
import process from 'node:process'
import { loadEngine, rng, shape } from './sudoku-lib.mjs'

const N = await loadEngine()
const [S, SECS, SEED] = process.argv.slice(2).map(Number)
if (![4, 6, 9].includes(S) || !SECS) {
  console.error('usage: node tools/sudoku-generate.mjs <4|6|9> <seconds> <seed>')
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

/** A random full grid, or null when the search took too long. */
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

const STAGES = { 4: [10, 9, 8, 7, 6, 5, 4], 6: [22, 20, 18, 16, 14, 13, 12, 11, 10, 9, 8], 9: [46, 42, 40, 38, 36, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22] }[n]
const found = new Map()
const out = `tmp/sd-${S}-${seed}.json`
const save = () => fs.writeFileSync(out, JSON.stringify([...found.values()]))
const t0 = Date.now()
let grids = 0
while ((Date.now() - t0) / 1000 < SECS) {
  const solution = randomGrid()
  if (!solution) continue
  grids++
  const given = solution.slice()
  let stageAt = 0
  const record = () => {
    const rows = []
    const sol = []
    for (let y = 0; y < n; y++) {
      rows.push(given.slice(y * n, y * n + n).map((v) => (v ? String(v) : '.')).join(''))
      sol.push(solution.slice(y * n, y * n + n).join(''))
    }
    const key = rows.join('|')
    if (found.has(key)) return
    const r = N.solvePuzzle({ id: 'x', n, br, bc, given, solution, cages: null }, 2, 100000)
    if (r.count !== 1 || r.exhausted) return
    found.set(key, { n, rows, sol, nodes: r.nodes, givens: given.filter((v) => v !== 0).length })
  }
  for (const cell of shuffle([...Array(cells).keys()])) {
    const keep = given[cell]
    given[cell] = 0
    const r = N.solvePuzzle({ id: 'x', n, br, bc, given, solution, cages: null }, 2, 4000)
    if (r.count !== 1 || r.exhausted) {
      given[cell] = keep
      continue
    }
    const left = given.filter((v) => v !== 0).length
    while (stageAt < STAGES.length && left <= STAGES[stageAt]) {
      record()
      stageAt++
    }
  }
  record() // the smallest set of given digits that is left
  if (found.size % 10 < 4) save()
}
save()
console.log(`${S}x${S} seed ${seed}: ${grids} grids, ${found.size} puzzles with one answer`)
