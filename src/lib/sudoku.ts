/** Sudoku and Sum Sudoku, as one pure engine (no screen in it).
 *
 *  A grid of n x n cells (4, 6 or 9) is divided into boxes (2x2, 2 rows by 3 columns, 3x3). Every cell gets a digit from 1 to n so that no row, no column and no box has a digit twice.
 *  In Sum Sudoku (the puzzle that is also called Killer Sudoku) there may be no digits given at all: the grid is cut into cages instead, each with a number, and the digits of a cage
 *  add up to that number and are all different. A good puzzle has one answer, found by reasoning, never by guessing.
 *
 *  Here: the puzzle and its answer (`parsePuzzle`), the rules checked on what a player has put in (`analyze`), a solver that counts answers (`solvePuzzle`: the generator and the checker
 *  use it) and the deductions that follow from what is on the grid (`deduce`: what the hint uses; `candidatesOf`: what "fill the notes" uses). */

/** 0 is an empty cell, 1..n a digit */
export type Digit = number

export interface Cage {
  sum: number
  /** the cells of the cage, as indexes into the grid (row * n + column), ascending */
  cells: number[]
}

export interface Puzzle {
  id: string
  n: number
  /** the rows and columns of a box */
  br: number
  bc: number
  /** the digits that are given, row by row: 0 none */
  given: Digit[]
  /** the answer: 1..n on every cell */
  solution: Digit[]
  /** Sum Sudoku: the cages, which cover the grid; null for a plain Sudoku */
  cages: Cage[] | null
}

/** the rows and columns of a box on a grid of this size */
export function boxShape(n: number): [number, number] {
  if (n === 4) return [2, 2]
  if (n === 6) return [2, 3]
  if (n === 9) return [3, 3]
  throw new Error(`a grid of ${n} by ${n} is not supported (4, 6 or 9)`)
}

export interface Spec {
  /** the given digits, a string for a row: a digit or "." (none at all: no givens) */
  rows?: readonly string[]
  /** the answer, a string of digits for a row */
  sol: readonly string[]
  /** Sum Sudoku: [the sum, the cells] of every cage */
  cages?: readonly (readonly [number, readonly number[]])[]
}

export const boxOf = (p: { n: number; bc: number; br: number }, i: number): number => {
  const r = Math.floor(i / p.n)
  const c = i % p.n
  return Math.floor(r / p.br) * (p.n / p.bc) + Math.floor(c / p.bc)
}

/** every row, then every column, then every box, as lists of cells */
export function unitsOf(p: { n: number; br: number; bc: number }): number[][] {
  const { n } = p
  const out: number[][] = []
  for (let r = 0; r < n; r++) out.push(Array.from({ length: n }, (_, c) => r * n + c))
  for (let c = 0; c < n; c++) out.push(Array.from({ length: n }, (_, r) => r * n + c))
  const boxes: number[][] = Array.from({ length: n }, () => [])
  for (let i = 0; i < n * n; i++) boxes[boxOf(p, i)].push(i)
  return out.concat(boxes)
}

export function parsePuzzle(id: string, spec: Spec): Puzzle {
  const n = spec.sol.length
  const [br, bc] = boxShape(n)
  const given: Digit[] = []
  const solution: Digit[] = []
  for (let y = 0; y < n; y++) {
    const s = spec.sol[y].trim()
    if (s.length !== n || !new RegExp(`^[1-${n}]+$`).test(s)) throw new Error(`${id}: row ${y + 1} of the answer is not ${n} digits from 1 to ${n}`)
    const g = spec.rows ? spec.rows[y].trim() : '.'.repeat(n)
    if (spec.rows && spec.rows.length !== n) throw new Error(`${id}: ${spec.rows.length} rows of givens, ${n} are needed`)
    if (g.length !== n || !new RegExp(`^[.1-${n}]+$`).test(g)) throw new Error(`${id}: row ${y + 1} of the givens is not ${n} of "." and digits`)
    for (let x = 0; x < n; x++) {
      const d = Number(s[x])
      solution.push(d)
      given.push(g[x] === '.' ? 0 : Number(g[x]))
      if (g[x] !== '.' && Number(g[x]) !== d) throw new Error(`${id}: the given cell ${x + 1},${y + 1} is not what the answer has there`)
    }
  }
  let cages: Cage[] | null = null
  if (spec.cages) {
    const seen = new Set<number>()
    cages = spec.cages.map(([sum, cells], k) => {
      const list = [...cells].sort((a, b) => a - b)
      if (list.length === 0 || list.length > n) throw new Error(`${id}: cage ${k + 1} has ${list.length} cells`)
      let total = 0
      const digits = new Set<number>()
      for (const c of list) {
        if (!Number.isInteger(c) || c < 0 || c >= n * n) throw new Error(`${id}: cage ${k + 1} has a cell that is not on the grid`)
        if (seen.has(c)) throw new Error(`${id}: a cell is in two cages`)
        seen.add(c)
        total += solution[c]
        digits.add(solution[c])
      }
      if (digits.size !== list.length) throw new Error(`${id}: cage ${k + 1} has a digit twice in the answer`)
      if (total !== sum) throw new Error(`${id}: cage ${k + 1} says ${sum}, the answer adds up to ${total}`)
      // connected: orthogonally
      const left = new Set(list.slice(1))
      const todo = [list[0]]
      while (todo.length) {
        const c = todo.pop() as number
        const r = Math.floor(c / n)
        const x = c % n
        for (const [dr, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = r + dr
          const nx = x + dx
          if (nr < 0 || nr >= n || nx < 0 || nx >= n) continue
          const j = nr * n + nx
          if (left.delete(j)) todo.push(j)
        }
      }
      if (left.size) throw new Error(`${id}: cage ${k + 1} is not in one piece`)
      return { sum, cells: list }
    })
    if (seen.size !== n * n) throw new Error(`${id}: the cages cover ${seen.size} cells, not ${n * n}`)
    // a cage of one cell is a digit that is given
    for (const cage of cages) if (cage.cells.length === 1) given[cage.cells[0]] = cage.sum
  }
  const p: Puzzle = { id, n, br, bc, given, solution, cages }
  if (!analyze(p, solution).solved) throw new Error(`${id}: the answer does not keep the rules`)
  return p
}

export const startMarks = (p: Puzzle): Digit[] => p.given.slice()

/* ---------------------------------------------------------------------------------------------------- the rules, on what is on the grid */

export type ConflictKind =
  /** a digit twice in a row, a column, a box */
  | 'row'
  | 'col'
  | 'box'
  /** a digit twice in a cage */
  | 'cage-dup'
  /** a cage whose digits cannot add up to its number any more (too much, too little, or all filled and wrong) */
  | 'cage-sum'

export interface Conflict {
  kind: ConflictKind
  cells: number[]
}
export interface Analysis {
  conflicts: Conflict[]
  /** every cell is filled and every rule is kept */
  solved: boolean
}

export function analyze(p: Puzzle, marks: readonly Digit[]): Analysis {
  const conflicts: Conflict[] = []
  const units = unitsOf(p)
  const kinds: ConflictKind[] = ['row', 'col', 'box']
  units.forEach((cells, u) => {
    const kind = kinds[Math.floor(u / p.n)]
    for (let d = 1; d <= p.n; d++) {
      const at = cells.filter((c) => marks[c] === d)
      if (at.length > 1) conflicts.push({ kind, cells: at })
    }
  })
  if (p.cages) {
    for (const cage of p.cages) {
      let total = 0
      let filled = 0
      const seen = new Set<number>()
      for (const c of cage.cells) {
        const d = marks[c]
        if (d === 0) continue
        filled++
        total += d
        seen.add(d)
      }
      for (let d = 1; d <= p.n; d++) {
        const at = cage.cells.filter((c) => marks[c] === d)
        if (at.length > 1) conflicts.push({ kind: 'cage-dup', cells: at })
      }
      const k = cage.cells.length - filled
      const rem = cage.sum - total
      const unused: number[] = []
      for (let d = 1; d <= p.n; d++) if (!seen.has(d)) unused.push(d)
      let broken: boolean
      if (k === 0) broken = rem !== 0
      else {
        const low = unused.slice(0, k).reduce((a, b) => a + b, 0)
        const high = unused.slice(-k).reduce((a, b) => a + b, 0)
        broken = unused.length < k || rem < low || rem > high
      }
      if (broken) conflicts.push({ kind: 'cage-sum', cells: cage.cells.slice() })
    }
  }
  const solved = conflicts.length === 0 && marks.every((m) => m !== 0)
  return { conflicts, solved }
}

/* ---------------------------------------------------------------------------------------------------- the solver */

interface Model {
  n: number
  full: number
  N: number
  peers: number[][]
  units: number[][]
  cages: Cage[]
}
const models = new WeakMap<Puzzle, Model>()
function modelOf(p: Puzzle): Model {
  let m = models.get(p)
  if (m) return m
  const N = p.n * p.n
  const units = unitsOf(p)
  const peers: number[][] = Array.from({ length: N }, () => [])
  for (let i = 0; i < N; i++) {
    const set = new Set<number>()
    for (const u of units) if (u.includes(i)) for (const j of u) if (j !== i) set.add(j)
    peers[i] = [...set]
  }
  m = { n: p.n, full: (1 << p.n) - 1, N, peers, units, cages: p.cages ?? [] }
  models.set(p, m)
  return m
}

const bit = (d: number): number => 1 << (d - 1)
const digitOf = (b: number): number => 32 - Math.clz32(b)
const popcount = (x: number): number => {
  let c = 0
  while (x) {
    x &= x - 1
    c++
  }
  return c
}
/** the digits that are in a mask of candidates */
export const digitsIn = (mask: number): number[] => {
  const out: number[] = []
  for (let d = 1; mask >> (d - 1); d++) if (mask & bit(d)) out.push(d)
  return out
}

interface St {
  /** the digit of a cell, 0 when not decided */
  v: Int8Array
  /** the candidates of a cell, a bit per digit */
  c: Uint16Array
}
const clone = (st: St): St => ({ v: st.v.slice(), c: st.c.slice() })

/** Decide a cell, take its digit away from its peers, and go on with every cell that is left with one digit. False when that is a contradiction. */
function assign(m: Model, st: St, i: number, d: number): boolean {
  const queue = [i]
  if (st.v[i] !== 0) return st.v[i] === d
  if (!(st.c[i] & bit(d))) return false
  st.v[i] = d
  st.c[i] = bit(d)
  while (queue.length) {
    const j = queue.pop() as number
    const dj = st.v[j]
    const b = bit(dj)
    for (const q of m.peers[j]) {
      if (st.v[q] === dj) return false
      if (st.v[q] === 0 && st.c[q] & b) {
        st.c[q] &= ~b
        if (st.c[q] === 0) return false
        if ((st.c[q] & (st.c[q] - 1)) === 0) {
          st.v[q] = digitOf(st.c[q])
          queue.push(q)
        }
      }
    }
  }
  return true
}

/** Narrow the candidates of a cell. False when it is left with none. */
function narrow(m: Model, st: St, i: number, mask: number): boolean {
  const next = st.c[i] & mask
  if (next === 0) return false
  if (next === st.c[i]) return true
  if (st.v[i] !== 0) return false
  st.c[i] = next
  if ((next & (next - 1)) === 0) return assign(m, st, i, digitOf(next))
  return true
}

const CAGE_SEARCH_MAX = 6

/** The digits each cell of a cage can have, so that the cage adds up and has no digit twice. -1: no way at all. Otherwise the supported masks, in the order of the cells. */
function cageSupport(m: Model, st: St, cage: Cage): number[] | null {
  const k = cage.cells.length
  if (k > CAGE_SEARCH_MAX) return null
  const sup = new Array<number>(k).fill(0)
  const pick = new Array<number>(k).fill(0)
  const n = m.n
  const dfs = (idx: number, used: number, rem: number): void => {
    if (idx === k) {
      if (rem === 0) for (let j = 0; j < k; j++) sup[j] |= bit(pick[j])
      return
    }
    const left = k - idx
    if (rem < (left * (left + 1)) / 2 || rem > left * n - (left * (left - 1)) / 2) return
    let cm = st.c[cage.cells[idx]] & ~used
    while (cm) {
      const b = cm & -cm
      cm ^= b
      const d = digitOf(b)
      if (d > rem) break
      pick[idx] = d
      dfs(idx + 1, used | b, rem - d)
    }
  }
  dfs(0, 0, cage.sum)
  return sup
}

/** Deductions that are always right, until none is left: a cell with one digit left, a digit that has one place left in a row, column or box, a cage that only some digits can fill. False when what is decided cannot be completed. */
function propagate(m: Model, st: St): boolean {
  for (let guard = 0; guard < 100000; guard++) {
    let changed = false
    for (const unit of m.units) {
      let once = 0
      let twice = 0
      for (const i of unit) {
        const c = st.c[i]
        twice |= once & c
        once |= c
      }
      if (once !== m.full) return false
      let single = once & ~twice
      while (single) {
        const b = single & -single
        single ^= b
        const d = digitOf(b)
        const cell = unit.find((i) => st.c[i] & b)
        if (cell === undefined) return false
        if (st.v[cell] !== 0) {
          if (st.v[cell] !== d) return false
          continue
        }
        if (!(st.c[cell] & b)) return false
        if (!assign(m, st, cell, d)) return false
        changed = true
      }
    }
    for (const cage of m.cages) {
      const sup = cageSupport(m, st, cage)
      if (!sup) continue
      for (let j = 0; j < cage.cells.length; j++) {
        const i = cage.cells[j]
        if (sup[j] === 0) return false
        const before = st.c[i]
        if (!narrow(m, st, i, sup[j])) return false
        if (st.c[i] !== before) changed = true
      }
    }
    if (!changed) return true
  }
  return true
}

function freshState(m: Model, marks: readonly Digit[]): St | null {
  const st: St = { v: new Int8Array(m.N), c: new Uint16Array(m.N).fill(m.full) }
  for (let i = 0; i < m.N; i++) {
    const d = marks[i]
    if (d !== 0 && !assign(m, st, i, d)) return null
  }
  return st
}

export interface SolveResult {
  /** how many answers were found, up to the limit */
  count: number
  /** the first answer found */
  solution: Digit[] | null
  /** every answer found (up to the limit) */
  all: Digit[][]
  /** how many positions the search looked at: 1 means the rules alone solve the puzzle, no trying of digits */
  nodes: number
  /** the search was stopped by the limit on positions before it was done */
  exhausted: boolean
}

export function solvePuzzle(p: Puzzle, limit = 2, maxNodes = 200_000): SolveResult {
  const m = modelOf(p)
  const res: SolveResult = { count: 0, solution: null, all: [], nodes: 0, exhausted: false }
  const search = (st: St): void => {
    if (res.count >= limit || res.exhausted) return
    res.nodes++
    if (res.nodes > maxNodes) {
      res.exhausted = true
      return
    }
    if (!propagate(m, st)) return
    let pick = -1
    let best = 99
    for (let i = 0; i < m.N; i++) {
      if (st.v[i] !== 0) continue
      const k = popcount(st.c[i])
      if (k < best) {
        best = k
        pick = i
      }
    }
    if (pick < 0) {
      const sol = Array.from(st.v)
      if (analyze(p, sol).solved) {
        res.count++
        res.all.push(sol)
        if (!res.solution) res.solution = sol
      }
      return
    }
    for (const d of digitsIn(st.c[pick])) {
      const next = clone(st)
      if (assign(m, next, pick, d)) search(next)
      if (res.count >= limit || res.exhausted) return
    }
  }
  const st = freshState(m, p.given)
  if (st) search(st)
  return res
}

/* ---------------------------------------------------------------------------------------------------- what follows from what is on the grid */

/** The digits each empty cell could have by looking at its row, column and box only (what a player writes as notes). A cell that is filled has only its digit. */
export function candidatesOf(p: Puzzle, marks: readonly Digit[]): number[] {
  const m = modelOf(p)
  return Array.from({ length: m.N }, (_, i) => {
    if (marks[i] !== 0) return bit(marks[i])
    let mask = m.full
    for (const q of m.peers[i]) if (marks[q] !== 0) mask &= ~bit(marks[q])
    return mask
  })
}

export type Why =
  /** the other digits are taken in its row, column and box */
  | 'last-candidate'
  /** a digit has only this place left in a row, a column or a box */
  | 'only-place'
  /** the numbers of the cages leave only this digit */
  | 'cage'
  /** it takes several steps of those */
  | 'chain'

export interface Deduction {
  i: number
  digit: Digit
  why: Why
}

/** What follows from what is on the grid, by the rules alone: the empty cells that have only one possible digit, the simplest kind of reason first.
 *  `ok` is false when what is on the grid cannot be completed. `fewest`: when nothing follows, an empty cell that has the fewest digits left. */
export function deduce(p: Puzzle, marks: readonly Digit[]): { ok: boolean; cells: Deduction[]; fewest: number | null } {
  const m = modelOf(p)
  const plain = candidatesOf(p, marks)
  // a mark that already breaks a row, column or box
  for (let i = 0; i < m.N; i++) if (marks[i] !== 0 && m.peers[i].some((q) => marks[q] === marks[i])) return { ok: false, cells: [], fewest: null }
  for (let i = 0; i < m.N; i++) if (plain[i] === 0) return { ok: false, cells: [], fewest: null }

  const singles = (cand: number[], why: Why): Deduction[] | null => {
    const found = new Map<number, Deduction>()
    for (let i = 0; i < m.N; i++) if (marks[i] === 0 && popcount(cand[i]) === 1) found.set(i, { i, digit: digitOf(cand[i]), why: 'last-candidate' })
    if (found.size) return [...found.values()].map((d) => ({ ...d, why: why === 'cage' ? 'cage' : d.why }))
    for (const unit of m.units) {
      for (let d = 1; d <= m.n; d++) {
        if (unit.some((i) => marks[i] === d)) continue
        const places = unit.filter((i) => marks[i] === 0 && cand[i] & bit(d))
        if (places.length === 1 && !found.has(places[0])) found.set(places[0], { i: places[0], digit: d, why: why === 'cage' ? 'cage' : 'only-place' })
      }
    }
    return found.size ? [...found.values()] : null
  }
  const a = singles(plain, 'last-candidate')
  if (a) return { ok: true, cells: a, fewest: null }

  // one look at the cages
  const cage = plain.slice()
  if (m.cages.length) {
    const st: St = { v: Int8Array.from(marks), c: Uint16Array.from(plain) }
    for (const cg of m.cages) {
      const sup = cageSupport(m, st, cg)
      if (!sup) continue
      for (let j = 0; j < cg.cells.length; j++) {
        if (sup[j] === 0) return { ok: false, cells: [], fewest: null }
        if (marks[cg.cells[j]] === 0) cage[cg.cells[j]] &= sup[j]
      }
    }
    for (let i = 0; i < m.N; i++) if (cage[i] === 0) return { ok: false, cells: [], fewest: null }
    const b = singles(cage, 'cage')
    if (b) return { ok: true, cells: b, fewest: null }
  }

  // everything the solver's own deductions reach
  const st = freshState(m, marks)
  if (!st || !propagate(m, st)) return { ok: false, cells: [], fewest: null }
  const cells: Deduction[] = []
  for (let i = 0; i < m.N; i++) if (marks[i] === 0 && st.v[i] !== 0) cells.push({ i, digit: st.v[i], why: 'chain' })
  if (cells.length) return { ok: true, cells, fewest: null }
  let fewest: number | null = null
  let best = 99
  for (let i = 0; i < m.N; i++) {
    if (marks[i] !== 0) continue
    const k = popcount(st.c[i])
    if (k < best) {
      best = k
      fewest = i
    }
  }
  return { ok: true, cells: [], fewest }
}

/* ---------------------------------------------------------------------------------------------------- progress */

/** The puzzles that are solved. A puzzle is solved or not: nothing is counted. */
export type Progress = Record<string, true>

/** What was stored (a list of ids): anything that is not the id of a puzzle is dropped. */
export function parseProgress(raw: unknown, ids: readonly string[]): Progress {
  const out: Progress = {}
  if (!Array.isArray(raw)) return out
  for (const id of raw) if (typeof id === 'string' && ids.includes(id)) out[id] = true
  return out
}

/** The digit a key stands for on a grid of this size, or null. */
export const digitOfKey = (key: string, n: number): number | null => (/^[1-9]$/.test(key) && Number(key) <= n ? Number(key) : null)
