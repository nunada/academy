// Shared by the tools of Sudoku and Sum Sudoku.
//   loadEngine()   bundles src/lib/sudoku.ts and returns it
//   dlxCount(...)  a SECOND solver that shares nothing with the engine: exact cover by Dancing Links (Algorithm X). Every cell must be filled, and every row, column and box must have
//                  every digit once. Sum Sudoku puts a whole cage in as one piece: its options are all the ways to give its cells different digits that add up to its number.
//   bruteCount4()  every Sudoku grid of 4 by 4 (there are 288), tried against a puzzle directly: a third way to count answers, for small random puzzles.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

export async function loadEngine(extra = []) {
  const ROOT = process.cwd()
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlib-'))
  const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
  fs.writeFileSync(path.join(tmp, 'e.ts'), ['src/lib/sudoku.ts', ...extra].map((p) => `export * from '${q(p)}'`).join('\n'))
  await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: path.join(tmp, 'e.mjs'), logLevel: 'error' })
  const N = await import('file://' + path.join(tmp, 'e.mjs').split(path.sep).join('/'))
  fs.rmSync(tmp, { recursive: true, force: true })
  return N
}

/** a seeded random number generator */
export function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const shape = (n) => (n === 4 ? [2, 2] : n === 6 ? [2, 3] : [3, 3])
const boxIndex = (n, br, bc, r, c) => Math.floor(r / br) * (n / bc) + Math.floor(c / bc)

/** Every way to give `size` different digits from 1..n that add up to `sum`, in order: lists of digits. */
export function cageTuples(n, size, sum) {
  const out = []
  const cur = []
  const rec = (used, rem) => {
    if (cur.length === size) {
      if (rem === 0) out.push(cur.slice())
      return
    }
    for (let d = 1; d <= n; d++) {
      if (used & (1 << d) || d > rem) continue
      cur.push(d)
      rec(used | (1 << d), rem - d)
      cur.pop()
    }
  }
  rec(0, sum)
  return out
}

/** Count the answers of a puzzle ({ n, given: [...], cages: [{ sum, cells }] | null }), up to `limit`, with Dancing Links. Returns { count, nodes, exhausted, first }. */
export function dlxCount(p, limit = 2, maxNodes = 5_000_000) {
  const n = p.n
  const [br, bc] = shape(n)
  const N = n * n
  // columns: 0..N-1 cell filled; N + r*n + d-1 row r has d; 2N + c*n + d-1 column c has d; 3N + b*n + d-1 box b has d
  const COLS = 4 * N
  const pieces = []
  if (p.cages) {
    for (const cage of p.cages) {
      const opts = cageTuples(n, cage.cells.length, cage.sum).filter((t) => cage.cells.every((c, k) => p.given[c] === 0 || p.given[c] === t[k]))
      pieces.push({ cells: cage.cells, opts })
    }
  } else {
    for (let c = 0; c < N; c++) pieces.push({ cells: [c], opts: p.given[c] ? [[p.given[c]]] : Array.from({ length: n }, (_, d) => [d + 1]) })
  }
  const rows = []
  const rowInfo = []
  for (let k = 0; k < pieces.length; k++) {
    for (const t of pieces[k].opts) {
      const cols = []
      let fine = true
      const seen = new Set()
      pieces[k].cells.forEach((c, j) => {
        const r = Math.floor(c / n)
        const x = c % n
        const d = t[j]
        const list = [c, N + r * n + d - 1, 2 * N + x * n + d - 1, 3 * N + boxIndex(n, br, bc, r, x) * n + d - 1]
        for (const col of list) {
          if (seen.has(col)) fine = false
          seen.add(col)
        }
        cols.push(...list)
      })
      if (!fine) continue // two cells of one piece in the same row with the same digit, say
      rows.push(cols)
      rowInfo.push({ cells: pieces[k].cells, digits: t })
    }
  }
  // the exact-cover structure, with arrays
  const size = rows.reduce((a, r) => a + r.length, 0) + COLS + 1
  const L = new Int32Array(size)
  const R = new Int32Array(size)
  const U = new Int32Array(size)
  const D = new Int32Array(size)
  const C = new Int32Array(size)
  const ROW = new Int32Array(size)
  const S = new Int32Array(COLS + 1)
  const head = COLS
  // header ring: head <-> 0 <-> 1 ... <-> COLS-1 <-> head
  for (let c = 0; c < COLS; c++) {
    L[c] = c === 0 ? head : c - 1
    R[c] = c === COLS - 1 ? head : c + 1
    U[c] = c
    D[c] = c
    C[c] = c
  }
  L[head] = COLS - 1
  R[head] = 0
  let next = COLS + 1
  rows.forEach((cols, ri) => {
    let first = -1
    for (const c of cols) {
      const x = next++
      C[x] = c
      ROW[x] = ri
      U[x] = U[c]
      D[x] = c
      D[U[c]] = x
      U[c] = x
      S[c]++
      if (first < 0) {
        first = x
        L[x] = x
        R[x] = x
      } else {
        L[x] = L[first]
        R[x] = first
        R[L[first]] = x
        L[first] = x
      }
    }
  })
  const cover = (c) => {
    R[L[c]] = R[c]
    L[R[c]] = L[c]
    for (let i = D[c]; i !== c; i = D[i]) for (let j = R[i]; j !== i; j = R[j]) {
      D[U[j]] = D[j]
      U[D[j]] = U[j]
      S[C[j]]--
    }
  }
  const uncover = (c) => {
    for (let i = U[c]; i !== c; i = U[i]) for (let j = L[i]; j !== i; j = L[j]) {
      S[C[j]]++
      D[U[j]] = j
      U[D[j]] = j
    }
    R[L[c]] = c
    L[R[c]] = c
  }
  const res = { count: 0, nodes: 0, exhausted: false, first: null }
  const chosen = []
  const search = () => {
    if (res.count >= limit || res.exhausted) return
    res.nodes++
    if (res.nodes > maxNodes) {
      res.exhausted = true
      return
    }
    if (R[head] === head) {
      res.count++
      if (!res.first) {
        const g = new Array(N).fill(0)
        for (const ri of chosen) rowInfo[ri].cells.forEach((c, j) => (g[c] = rowInfo[ri].digits[j]))
        res.first = g
      }
      return
    }
    let col = R[head]
    for (let c = R[col]; c !== head; c = R[c]) if (S[c] < S[col]) col = c
    if (S[col] === 0) return
    cover(col)
    for (let r = D[col]; r !== col; r = D[r]) {
      chosen.push(ROW[r])
      for (let j = R[r]; j !== r; j = R[j]) cover(C[j])
      search()
      for (let j = L[r]; j !== r; j = L[j]) uncover(C[j])
      chosen.pop()
      if (res.count >= limit || res.exhausted) break
    }
    uncover(col)
  }
  search()
  return res
}

let grids4 = null
/** All 288 Sudoku grids of 4 by 4 (2 by 2 boxes), as arrays of 16 digits. */
export function allGrids4() {
  if (grids4) return grids4
  grids4 = []
  const g = new Array(16).fill(0)
  const ok = (i, d) => {
    const r = Math.floor(i / 4)
    const c = i % 4
    for (let j = 0; j < i; j++) {
      const rj = Math.floor(j / 4)
      const cj = j % 4
      if (g[j] === d && (rj === r || cj === c || (Math.floor(rj / 2) === Math.floor(r / 2) && Math.floor(cj / 2) === Math.floor(c / 2)))) return false
    }
    return true
  }
  const rec = (i) => {
    if (i === 16) {
      grids4.push(g.slice())
      return
    }
    for (let d = 1; d <= 4; d++)
      if (ok(i, d)) {
        g[i] = d
        rec(i + 1)
        g[i] = 0
      }
  }
  rec(0)
  return grids4
}

/** How many of the 288 grids keep a puzzle's givens and cages. */
export function bruteCount4(p) {
  let count = 0
  for (const g of allGrids4()) {
    if (p.given.some((d, i) => d !== 0 && g[i] !== d)) continue
    if (p.cages && !p.cages.every((cage) => new Set(cage.cells.map((c) => g[c])).size === cage.cells.length && cage.cells.reduce((a, c) => a + g[c], 0) === cage.sum)) continue
    count++
  }
  return count
}
