/** Tic-Tac-Logic, as a pure engine (no screen in it).
 *
 *  A grid has some X and O given. Every other cell is to be filled with an X or an O so that
 *    1. no row and no column has three of the same symbol next to each other;
 *    2. every row and every column has as many X as O;
 *    3. no two rows are the same, and no two columns are the same.
 *  A good puzzle has one answer, found by reasoning, never by guessing.
 *
 *  Here: the puzzle and its answer (`parsePuzzle`), what a player has marked (`Mark`), the rules checked on it (`analyze`), a solver that counts answers (`solvePuzzle`:
 *  the generator and the checker use it) and the deductions that follow from what is marked (`deduce`: what the hint uses). */

export const BLANK = 0
export const X = 1
export const O = 2
/** what is on a cell: nothing, an X or an O */
export type Mark = 0 | 1 | 2

export interface Puzzle {
  id: string
  w: number
  h: number
  /** the cells that are given, row by row: 0 none, 1 X, 2 O */
  given: Mark[]
  /** the answer: 1 or 2 on every cell */
  solution: Mark[]
}

const SYMBOL: Record<string, Mark> = { X: X, O: O, '.': BLANK }

/** `rows`: the given cells, a row each, separated by spaces: X, O or "." for an empty cell. `solution`: the answer, a row each, of X and O. */
export function parsePuzzle(id: string, rows: readonly string[], solution: readonly string[]): Puzzle {
  const h = rows.length
  if (h === 0 || h % 2 !== 0 || solution.length !== h) throw new Error(`${id}: ${h} rows and ${solution.length} rows of answer (an even number is needed)`)
  const w = rows[0].trim().split(/\s+/).length
  if (w % 2 !== 0) throw new Error(`${id}: ${w} columns (an even number is needed)`)
  const given: Mark[] = []
  const sol: Mark[] = []
  for (let y = 0; y < h; y++) {
    const cells = rows[y].trim().split(/\s+/)
    if (cells.length !== w) throw new Error(`${id}: row ${y + 1} has ${cells.length} cells, not ${w}`)
    const s = solution[y].trim()
    if (s.length !== w || !/^[XO]+$/.test(s)) throw new Error(`${id}: row ${y + 1} of the answer is not ${w} of X and O`)
    for (let x = 0; x < w; x++) {
      const c = cells[x]
      if (!(c in SYMBOL)) throw new Error(`${id}: "${c}" is not X, O or a dot`)
      given.push(SYMBOL[c])
      sol.push(SYMBOL[s[x]])
      if (SYMBOL[c] !== BLANK && SYMBOL[c] !== SYMBOL[s[x]]) throw new Error(`${id}: the given cell ${x + 1},${y + 1} is not what the answer has there`)
    }
  }
  const p: Puzzle = { id, w, h, given, solution: sol }
  if (!analyze(p, sol).solved) throw new Error(`${id}: the answer does not keep the rules`)
  return p
}

/** the cells of every row and then of every column */
export function lines(p: { w: number; h: number }): number[][] {
  const out: number[][] = []
  for (let y = 0; y < p.h; y++) out.push(Array.from({ length: p.w }, (_, x) => y * p.w + x))
  for (let x = 0; x < p.w; x++) out.push(Array.from({ length: p.h }, (_, y) => y * p.w + x))
  return out
}

/* ---------------------------------------------------------------------------------------------------- the rules, on what is marked */

export type ConflictKind =
  /** three of the same symbol next to each other */
  | 'triple'
  /** a row or a column with more of one symbol than half of it */
  | 'over'
  /** two rows, or two columns, that are the same all the way */
  | 'same'

export interface Conflict {
  kind: ConflictKind
  cells: number[]
}
export interface Analysis {
  conflicts: Conflict[]
  /** every cell is filled and every rule is kept */
  solved: boolean
}

export const startMarks = (p: Puzzle): Mark[] => p.given.slice()

export function analyze(p: Puzzle, marks: readonly Mark[]): Analysis {
  const conflicts: Conflict[] = []
  const all = lines(p)
  for (const line of all) {
    for (let i = 0; i + 2 < line.length; i++) {
      const a = marks[line[i]]
      if (a !== BLANK && a === marks[line[i + 1]] && a === marks[line[i + 2]]) conflicts.push({ kind: 'triple', cells: [line[i], line[i + 1], line[i + 2]] })
    }
    for (const s of [X, O] as const) {
      const cells = line.filter((c) => marks[c] === s)
      if (cells.length > line.length / 2) conflicts.push({ kind: 'over', cells })
    }
  }
  const complete = (line: number[]): boolean => line.every((c) => marks[c] !== BLANK)
  const rowsN = p.h
  for (let a = 0; a < all.length; a++) {
    if (!complete(all[a])) continue
    for (let b = a + 1; b < all.length; b++) {
      // rows against rows, columns against columns
      if ((a < rowsN) !== (b < rowsN) || !complete(all[b])) continue
      if (all[a].every((c, i) => marks[c] === marks[all[b][i]])) conflicts.push({ kind: 'same', cells: [...all[a], ...all[b]] })
    }
  }
  const solved = conflicts.length === 0 && marks.every((m) => m !== BLANK)
  return { conflicts, solved }
}

/* ---------------------------------------------------------------------------------------------------- the solver */

/** -1 not decided, 1 X, 2 O */
type St = Int8Array
const other = (s: number): number => (s === X ? O : X)

/** Deductions that are always right, until none is left. False when what is decided cannot be completed. */
function propagate(p: Puzzle, st: St): boolean {
  const all = lines(p)
  const rowsN = p.h
  for (let guard = 0; guard < 100000; guard++) {
    let changed = false
    const set = (c: number, v: number): boolean => {
      if (st[c] === v) return true
      if (st[c] !== -1) return false
      st[c] = v
      changed = true
      return true
    }
    for (const line of all) {
      const n = line.length
      // three in a row are not allowed; two in a row shut the cells on both sides; a gap between two of the same is the other symbol
      for (let i = 0; i + 1 < n; i++) {
        const a = st[line[i]]
        if (a === -1) continue
        if (i + 2 < n && st[line[i + 1]] === a && st[line[i + 2]] === a) return false
        if (st[line[i + 1]] === a) {
          if (i > 0 && !set(line[i - 1], other(a))) return false
          if (i + 2 < n && !set(line[i + 2], other(a))) return false
        }
        if (i + 2 < n && st[line[i + 2]] === a && !set(line[i + 1], other(a))) return false
      }
      // as many of each
      let cx = 0
      let co = 0
      for (const c of line) {
        if (st[c] === X) cx++
        else if (st[c] === O) co++
      }
      if (cx > n / 2 || co > n / 2) return false
      if (cx === n / 2) for (const c of line) if (st[c] === -1 && !set(c, O)) return false
      if (co === n / 2) for (const c of line) if (st[c] === -1 && !set(c, X)) return false
    }
    // two rows (or columns) are never the same: when all of one is known and the other is the same in all it knows but one cell, that cell is the other symbol;
    // when it is the same in all it knows but two cells, and the other has an X in one of them and an O in the other, these two cells are the other way round
    // (both lines have as many X as O, so the two cells hold one X and one O, and there are only two ways to place them)
    for (let a = 0; a < all.length; a++) {
      if (all[a].some((c) => st[c] === -1)) continue
      for (let b = 0; b < all.length; b++) {
        if (b === a || (a < rowsN) !== (b < rowsN)) continue
        const open: number[] = []
        let same = true
        for (let i = 0; i < all[b].length; i++) {
          const v = st[all[b][i]]
          if (v === -1) open.push(i)
          else if (v !== st[all[a][i]]) same = false
        }
        if (!same) continue
        if (open.length === 0) return false
        if (open.length === 1 && !set(all[b][open[0]], other(st[all[a][open[0]]]))) return false
        if (open.length === 2 && st[all[a][open[0]]] !== st[all[a][open[1]]]) for (const i of open) if (!set(all[b][i], other(st[all[a][i]]))) return false
      }
    }
    if (!changed) return true
  }
  return true
}

/** Everything decided: check every rule. */
function complete(p: Puzzle, st: St): boolean {
  return analyze(p, Array.from(st, (v) => v as Mark)).solved
}

export interface SolveResult {
  /** how many answers were found, up to the limit */
  count: number
  /** the first answer found */
  solution: Mark[] | null
  /** how many positions the search looked at: the more, the harder the puzzle is to reason out */
  nodes: number
  /** the search was stopped by the limit on positions before it was done */
  exhausted: boolean
}

function freshState(p: Puzzle): St {
  return Int8Array.from(p.given, (g) => (g === BLANK ? -1 : g))
}

export function solvePuzzle(p: Puzzle, limit = 2, maxNodes = 200_000): SolveResult {
  const res: SolveResult = { count: 0, solution: null, nodes: 0, exhausted: false }
  const search = (st: St): void => {
    if (res.count >= limit || res.exhausted) return
    res.nodes++
    if (res.nodes > maxNodes) {
      res.exhausted = true
      return
    }
    if (!propagate(p, st)) return
    const pick = st.indexOf(-1)
    if (pick < 0) {
      if (complete(p, st)) {
        res.count++
        if (!res.solution) res.solution = Array.from(st, (v) => v as Mark)
      }
      return
    }
    for (const v of [X, O] as const) {
      const next = st.slice()
      next[pick] = v
      search(next)
      if (res.count >= limit || res.exhausted) return
    }
  }
  search(freshState(p))
  return res
}

/** What follows from what is marked, by the rules alone: the cells that are empty but have only one possible symbol. `ok` is false when what is marked cannot be completed. */
export function deduce(p: Puzzle, marks: readonly Mark[]): { ok: boolean; cells: { i: number; symbol: Mark }[] } {
  const st = Int8Array.from(marks, (m) => (m === BLANK ? -1 : m))
  const before = st.slice()
  if (!propagate(p, st)) return { ok: false, cells: [] }
  const cells: { i: number; symbol: Mark }[] = []
  for (let i = 0; i < st.length; i++) if (before[i] === -1 && st[i] !== -1) cells.push({ i, symbol: st[i] as Mark })
  return { ok: true, cells }
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

/** The next mark when a cell is pressed: empty, X, O, empty again. */
export const nextMark = (m: Mark): Mark => (m === BLANK ? X : m === X ? O : BLANK)
