// Makes Tic-Tac-Logic puzzles with one answer.   node tools/tictaclogic-generate.mjs <size> <seconds> <seed>
// Writes tmp/tt-<size>-<seed>.json, a list of { w, h, rows, sol, nodes, givens }; tools/tictaclogic-build.mjs chooses from these and writes src/content/tictaclogic-levels.ts.
//
// How: a random full grid that keeps the rules is built row by row. Then the given cells are taken away one at a time, in random order, for as long as the solver of
// src/lib/tictaclogic.ts still finds exactly one answer; a puzzle is saved at several stages of that (many given cells: easy, few: hard).
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ttgen-'))
fs.writeFileSync(path.join(tmp, 'e.ts'), `export * from '${path.join(ROOT, 'src/lib/tictaclogic.ts').split(path.sep).join('/')}'`)
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: path.join(tmp, 'e.mjs'), logLevel: 'error' })
const N = await import('file://' + path.join(tmp, 'e.mjs').split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

const [S, SECS, SEED] = process.argv.slice(2).map(Number)
if (!S || !SECS || S % 2) {
  console.error('usage: node tools/tictaclogic-generate.mjs <even size> <seconds> <seed>')
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
const shuffle = (list) => {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const W = S
const H = S
const n = W * H
/** every row that has as many X as O and no three of a symbol in a row */
const patterns = []
{
  const cur = []
  const rec = (i, cx, co) => {
    if (cx > W / 2 || co > W / 2) return
    if (i === W) {
      patterns.push(cur.slice())
      return
    }
    for (const v of [1, 2]) {
      if (i >= 2 && cur[i - 1] === v && cur[i - 2] === v) continue
      cur.push(v)
      rec(i + 1, cx + (v === 1 ? 1 : 0), co + (v === 2 ? 1 : 0))
      cur.pop()
    }
  }
  rec(0, 0, 0)
}

/** A full grid that keeps every rule, or null when the search took too long. */
function randomGrid() {
  const rows = []
  const count = Array.from({ length: W }, () => [0, 0, 0])
  let budget = 40000
  const rec = (r) => {
    if (r === H) {
      // no two columns the same
      const keys = new Set()
      for (let c = 0; c < W; c++) keys.add(rows.map((row) => row[c]).join(''))
      return keys.size === W
    }
    for (const pat of shuffle(patterns)) {
      if (--budget < 0) return false
      if (rows.some((row) => row.join('') === pat.join(''))) continue
      let fine = true
      for (let c = 0; c < W && fine; c++) {
        if (r >= 2 && rows[r - 1][c] === pat[c] && rows[r - 2][c] === pat[c]) fine = false
        else if (count[c][pat[c]] + 1 > H / 2) fine = false
      }
      if (!fine) continue
      for (let c = 0; c < W; c++) count[c][pat[c]]++
      rows.push(pat)
      if (rec(r + 1)) return true
      rows.pop()
      for (let c = 0; c < W; c++) count[c][pat[c]]--
      if (budget < 0) return false
    }
    return false
  }
  return rec(0) ? rows.flat() : null
}

const SYM = { 0: '.', 1: 'X', 2: 'O' }
const FRACTIONS = [0.62, 0.55, 0.5, 0.45, 0.41, 0.37, 0.34, 0.31, 0.28, 0.25, 0.22, 0.2]
const found = new Map()
const out = `tmp/tt-${S}-${seed}.json`
const save = () => fs.writeFileSync(out, JSON.stringify([...found.values()]))
const t0 = Date.now()
let grids = 0
while ((Date.now() - t0) / 1000 < SECS) {
  const solution = randomGrid()
  if (!solution) continue
  grids++
  const given = solution.slice()
  const stages = FRACTIONS.map((f) => Math.floor(f * n))
  let stageAt = 0
  const record = () => {
    const rows = []
    const sol = []
    for (let y = 0; y < H; y++) {
      rows.push(given.slice(y * W, y * W + W).map((v) => SYM[v]).join(' '))
      sol.push(solution.slice(y * W, y * W + W).map((v) => SYM[v]).join(''))
    }
    const key = rows.join('|')
    if (found.has(key)) return
    const r = N.solvePuzzle({ id: 'x', w: W, h: H, given, solution }, 2, 100000)
    if (r.count !== 1 || r.exhausted) return
    found.set(key, { w: W, h: H, rows, sol, nodes: r.nodes, givens: given.filter((v) => v !== 0).length })
  }
  for (const cell of shuffle([...Array(n).keys()])) {
    const keep = given[cell]
    given[cell] = 0
    const r = N.solvePuzzle({ id: 'x', w: W, h: H, given, solution }, 2, 30000)
    if (r.count !== 1 || r.exhausted) {
      given[cell] = keep
      continue
    }
    const left = given.filter((v) => v !== 0).length
    while (stageAt < stages.length && left <= stages[stageAt]) {
      record()
      stageAt++
    }
  }
  record() // the smallest set of given cells that is left
  if (found.size % 10 < 4) save()
}
save()
console.log(`${S}x${S} seed ${seed}: ${grids} grids, ${found.size} puzzles with one answer`)
