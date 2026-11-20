/** Nurikabe, as a pure engine (no screen in it).
 *
 *  A grid has some numbered cells. The rest is to be shaded (the "sea") or left open (the "land") so that
 *    1. every piece of land (an "island": land cells that touch along an edge) has exactly one number, and is that many cells big;
 *    2. the sea is one piece (all its cells are joined along edges);
 *    3. the sea has no 2x2 block ("pool").
 *  A good puzzle has one answer, which is found by reasoning, never by guessing.
 *
 *  Here: the puzzle and its answer (`parsePuzzle`), what a player has marked (`Mark`), the rules checked on what is marked (`analyze`), a solver that counts answers (`solvePuzzle`: the
 *  generator and the checker use it), and the deductions that follow from what is marked (`deduce`: what the hint uses). */

export const BLANK = 0
export const SEA = 1
export const DOT = 2
/** what a player has put on a cell: nothing, sea (shaded) or a dot (this one is land) */
export type Mark = 0 | 1 | 2

export interface Puzzle {
  id: string
  w: number
  h: number
  /** the number on each cell, row by row, 0 where there is none */
  clue: number[]
  /** the answer: true where the cell is sea */
  solution: boolean[]
}

/** `rows`: the numbers, a row each, separated by spaces, "." where there is none. `sea`: the answer, a row each, "#" for sea and "." for land. */
export function parsePuzzle(id: string, rows: readonly string[], sea: readonly string[]): Puzzle {
  const h = rows.length
  if (h === 0 || sea.length !== h) throw new Error(`${id}: ${h} rows and ${sea.length} rows of answer`)
  const first = rows[0].trim().split(/\s+/)
  const w = first.length
  const clue: number[] = []
  const solution: boolean[] = []
  for (let y = 0; y < h; y++) {
    const cells = rows[y].trim().split(/\s+/)
    if (cells.length !== w) throw new Error(`${id}: row ${y + 1} has ${cells.length} cells, not ${w}`)
    const s = sea[y].trim()
    if (s.length !== w || !/^[#.]+$/.test(s)) throw new Error(`${id}: row ${y + 1} of the answer is not ${w} of # and .`)
    for (let x = 0; x < w; x++) {
      const c = cells[x]
      if (c !== '.' && !/^[1-9]\d*$/.test(c)) throw new Error(`${id}: "${c}" is not a number or a dot`)
      clue.push(c === '.' ? 0 : Number(c))
      solution.push(s[x] === '#')
    }
  }
  return { id, w, h, clue, solution }
}

const tables = new Map<number, number[][]>()
/** the cells that touch cell i along an edge, for every cell of a grid of this size */
export function neighborTable(w: number, h: number): number[][] {
  const key = w * 1000 + h
  let t = tables.get(key)
  if (t) return t
  t = []
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const l: number[] = []
      if (y > 0) l.push((y - 1) * w + x)
      if (x > 0) l.push(y * w + x - 1)
      if (x < w - 1) l.push(y * w + x + 1)
      if (y < h - 1) l.push((y + 1) * w + x)
      t.push(l)
    }
  tables.set(key, t)
  return t
}

/* ---------------------------------------------------------------------------------------------------- the rules, on what is marked */

export type ConflictKind =
  /** a 2x2 block that is all sea */
  | 'pool'
  /** cells that must be land (a number, dots) that touch each other and are more than the number says */
  | 'too-big'
  /** two numbers joined by cells that must be land */
  | 'two-clues'
  /** a piece of land, with all the cells that could still be land, that is smaller than its number */
  | 'too-small'
  /** a dot that cannot belong to any number any more */
  | 'no-clue'
  /** sea that cannot be joined to the rest of the sea any more */
  | 'split'

export interface Conflict {
  kind: ConflictKind
  cells: number[]
}
export interface Analysis {
  conflicts: Conflict[]
  /** every rule is kept, with the open cells taken as land */
  solved: boolean
}

const isSeaMark = (p: Puzzle, marks: readonly Mark[], i: number): boolean => marks[i] === SEA && p.clue[i] === 0

/** The pieces of cells for which `inSet` holds, joined along edges. */
function pieces(p: Puzzle, inSet: (i: number) => boolean): number[][] {
  const nb = neighborTable(p.w, p.h)
  const seen = new Uint8Array(p.w * p.h)
  const out: number[][] = []
  for (let s = 0; s < p.w * p.h; s++) {
    if (seen[s] || !inSet(s)) continue
    const piece = [s]
    seen[s] = 1
    for (let k = 0; k < piece.length; k++) for (const m of nb[piece[k]]) if (!seen[m] && inSet(m)) (seen[m] = 1), piece.push(m)
    out.push(piece)
  }
  return out
}

export function analyze(p: Puzzle, marks: readonly Mark[]): Analysis {
  const { w, h, clue } = p
  const nb = neighborTable(w, h)
  const conflicts: Conflict[] = []
  const sea = (i: number): boolean => isSeaMark(p, marks, i)

  // pools
  for (let y = 0; y + 1 < h; y++)
    for (let x = 0; x + 1 < w; x++) {
      const a = y * w + x
      const cells = [a, a + 1, a + w, a + w + 1]
      if (cells.every(sea)) conflicts.push({ kind: 'pool', cells })
    }

  // what has to be land (a number or a dot), in pieces
  const sure = (i: number): boolean => !sea(i) && (clue[i] > 0 || marks[i] === DOT)
  for (const g of pieces(p, sure)) {
    const nums = g.filter((i) => clue[i] > 0)
    if (nums.length >= 2) conflicts.push({ kind: 'two-clues', cells: g })
    else if (nums.length === 1 && g.length > clue[nums[0]]) conflicts.push({ kind: 'too-big', cells: g })
  }

  // all the land that could be land, in pieces
  const landPieces = pieces(p, (i) => !sea(i))
  for (const g of landPieces) {
    const nums = g.filter((i) => clue[i] > 0)
    const need = nums.reduce((s, i) => s + clue[i], 0)
    if (nums.length === 0) {
      const dots = g.filter((i) => marks[i] === DOT)
      if (dots.length > 0) conflicts.push({ kind: 'no-clue', cells: dots })
    } else if (need > g.length) conflicts.push({ kind: 'too-small', cells: g })
  }

  // the sea has to be one piece, even if every open cell next to it is taken as sea
  const seaCells: number[] = []
  for (let i = 0; i < w * h; i++) if (sea(i)) seaCells.push(i)
  if (seaCells.length >= 2) {
    const reach = new Uint8Array(w * h)
    const q = [seaCells[0]]
    reach[seaCells[0]] = 1
    for (let k = 0; k < q.length; k++)
      for (const m of nb[q[k]])
        if (!reach[m] && (sea(m) || (marks[m] === BLANK && clue[m] === 0))) {
          reach[m] = 1
          q.push(m)
        }
    const lost = seaCells.filter((i) => !reach[i])
    if (lost.length > 0) conflicts.push({ kind: 'split', cells: lost })
  }

  // solved: the open cells taken as land, every island has one number and that many cells, the sea is one piece, no pool
  let solved = conflicts.length === 0
  if (solved) {
    for (const g of landPieces) {
      const nums = g.filter((i) => clue[i] > 0)
      if (nums.length !== 1 || g.length !== clue[nums[0]]) {
        solved = false
        break
      }
    }
  }
  if (solved && seaCells.length >= 1) {
    const one = pieces(p, sea)
    if (one.length !== 1) solved = false
  }
  return { conflicts, solved }
}

/* ---------------------------------------------------------------------------------------------------- the solver */

/** -1 not decided, 0 sea, 1 land */
type St = Int8Array

interface Region {
  cells: number[]
  /** the number in it (0 if none) and how many numbers there are in it */
  clue: number
  clues: number
}

function regionsOf(p: Puzzle, st: St): { rid: Int32Array; regs: Region[] } {
  const n = p.w * p.h
  const nb = neighborTable(p.w, p.h)
  const rid = new Int32Array(n).fill(-1)
  const regs: Region[] = []
  for (let s = 0; s < n; s++) {
    if (st[s] !== 1 || rid[s] >= 0) continue
    const id = regs.length
    const cells = [s]
    rid[s] = id
    let clue = 0
    let clues = 0
    for (let k = 0; k < cells.length; k++) {
      const c = cells[k]
      if (p.clue[c] > 0) (clue = p.clue[c]), clues++
      for (const m of nb[c]) if (st[m] === 1 && rid[m] < 0) (rid[m] = id), cells.push(m)
    }
    regs.push({ cells, clue, clues })
  }
  return { rid, regs }
}

/** Deductions that are always right, until none is left. False when what is decided cannot be completed. */
function propagate(p: Puzzle, st: St): boolean {
  const { w, h } = p
  const n = w * h
  const nb = neighborTable(w, h)
  for (let guard = 0; guard < 100000; guard++) {
    let changed = false
    const set = (i: number, v: 0 | 1): boolean => {
      if (st[i] === v) return true
      if (st[i] !== -1) return false
      st[i] = v
      changed = true
      return true
    }
    const { rid, regs } = regionsOf(p, st)
    for (const r of regs) {
      if (r.clues > 1) return false
      if (r.clues === 1 && r.cells.length > r.clue) return false
    }

    // an island that is as big as its number is closed; one that cannot grow but has to is impossible; one that can grow in one way only does
    for (const r of regs) {
      // (a cell that is made land may join islands, so what was found about the islands is out of date: the next pass starts again)
      if (changed) break
      const lib = new Set<number>()
      for (const c of r.cells) for (const m of nb[c]) if (st[m] === -1) lib.add(m)
      if (r.clues === 1 && r.cells.length === r.clue) {
        for (const m of lib) if (!set(m, 0)) return false
        continue
      }
      if (lib.size === 0) return false
      if (lib.size === 1 && !set([...lib][0], 1)) return false
    }
    if (changed) continue

    // an open cell that touches two islands that may not be joined is sea
    for (let u = 0; u < n; u++) {
      if (st[u] !== -1) continue
      const ids = new Set<number>()
      for (const m of nb[u]) if (st[m] === 1) ids.add(rid[m])
      if (ids.size < 2) continue
      let numbered = 0
      let numberedClue = 0
      let sum = 1
      for (const id of ids) {
        sum += regs[id].cells.length
        if (regs[id].clues === 1) (numbered++, (numberedClue = regs[id].clue))
      }
      if (numbered >= 2 || (numbered === 1 && sum > numberedClue)) if (!set(u, 0)) return false
    }
    if (changed) continue

    // a cell that no island can reach is sea (an island with a number can grow by as many cells as its number lacks)
    const reach = new Uint8Array(n)
    const dist = new Int32Array(n)
    for (let id = 0; id < regs.length; id++) {
      const r = regs[id]
      if (r.clues !== 1) continue
      const room = r.clue - r.cells.length
      dist.fill(-1)
      const q: number[] = []
      for (const c of r.cells) (dist[c] = 0), (reach[c] = 1), q.push(c)
      if (room === 0) continue
      for (let k = 0; k < q.length; k++) {
        const c = q[k]
        if (dist[c] >= room) continue
        for (const m of nb[c]) {
          if (dist[m] >= 0 || st[m] === 0) continue
          if (st[m] === 1 && regs[rid[m]].clues === 1 && rid[m] !== id) continue
          // an open cell that touches another island with a number cannot be part of this one
          let touches = false
          for (const o of nb[m]) if (st[o] === 1 && rid[o] !== id && regs[rid[o]].clues === 1) touches = true
          if (touches) continue
          dist[m] = dist[c] + 1
          reach[m] = 1
          q.push(m)
        }
      }
    }
    for (let u = 0; u < n; u++) {
      if (reach[u]) continue
      if (st[u] === -1) {
        if (!set(u, 0)) return false
      } else if (st[u] === 1) return false
    }
    if (changed) continue

    // three sea cells and an open one in a 2x2 block: the open one is land
    for (let y = 0; y + 1 < h; y++)
      for (let x = 0; x + 1 < w; x++) {
        const a = y * w + x
        const cells = [a, a + 1, a + w, a + w + 1]
        let seas = 0
        let open = -1
        let opens = 0
        for (const c of cells) {
          if (st[c] === 0) seas++
          else if (st[c] === -1) (open = c), opens++
        }
        if (seas === 4) return false
        if (seas === 3 && opens === 1 && !set(open, 1)) return false
      }
    if (changed) continue

    // the sea is one piece: if the sea cells are not joined through sea and open cells, it cannot be completed; an open cell that would cut them apart is sea
    const seaCells: number[] = []
    for (let i = 0; i < n; i++) if (st[i] === 0) seaCells.push(i)
    if (seaCells.length >= 1) {
      const connected = (skip: number): boolean => {
        const seen = new Uint8Array(n)
        const q = [seaCells[0]]
        seen[seaCells[0]] = 1
        let got = 1
        for (let k = 0; k < q.length; k++)
          for (const m of nb[q[k]])
            if (!seen[m] && m !== skip && st[m] !== 1) {
              seen[m] = 1
              if (st[m] === 0) got++
              q.push(m)
            }
        return got === seaCells.length
      }
      if (!connected(-1)) return false
      // (one cell at a time: once it is sea, the count of sea cells above is out of date, so the next pass starts again)
      if (seaCells.length >= 2)
        for (let u = 0; u < n; u++)
          if (st[u] === -1 && !connected(u)) {
            if (!set(u, 0)) return false
            break
          }
    }
    if (!changed) return true
  }
  return true
}

/** Everything decided: every island has one number and that many cells, the sea is one piece, no pool. */
function complete(p: Puzzle, st: St): boolean {
  const { w, h } = p
  const nb = neighborTable(w, h)
  const { regs } = regionsOf(p, st)
  for (const r of regs) if (r.clues !== 1 || r.cells.length !== r.clue) return false
  for (let y = 0; y + 1 < h; y++)
    for (let x = 0; x + 1 < w; x++) {
      const a = y * w + x
      if (st[a] === 0 && st[a + 1] === 0 && st[a + w] === 0 && st[a + w + 1] === 0) return false
    }
  const sea: number[] = []
  for (let i = 0; i < w * h; i++) if (st[i] === 0) sea.push(i)
  if (sea.length > 0) {
    const seen = new Uint8Array(w * h)
    const q = [sea[0]]
    seen[sea[0]] = 1
    for (let k = 0; k < q.length; k++) for (const m of nb[q[k]]) if (!seen[m] && st[m] === 0) (seen[m] = 1), q.push(m)
    if (q.length !== sea.length) return false
  }
  return true
}

export interface SolveResult {
  /** how many answers were found, up to the limit */
  count: number
  /** the first answer found: true where sea */
  solution: boolean[] | null
  /** how many positions the search looked at: the more, the harder the puzzle is to reason out */
  nodes: number
  /** the search was stopped by the limit on positions before it was done */
  exhausted: boolean
}

function freshState(p: Puzzle): St {
  const st = new Int8Array(p.w * p.h).fill(-1)
  for (let i = 0; i < st.length; i++) if (p.clue[i] > 0) st[i] = 1
  return st
}

export function solvePuzzle(p: Puzzle, limit = 2, maxNodes = 200_000): SolveResult {
  const nb = neighborTable(p.w, p.h)
  const res: SolveResult = { count: 0, solution: null, nodes: 0, exhausted: false }
  const search = (st: St): void => {
    if (res.count >= limit || res.exhausted) return
    res.nodes++
    if (res.nodes > maxNodes) {
      res.exhausted = true
      return
    }
    if (!propagate(p, st)) return
    // the cell to decide: one next to an island that has to grow, else the first open one
    let pick = -1
    const { regs } = regionsOf(p, st)
    for (const r of regs) {
      if (pick >= 0) break
      if (r.clues !== 1 || r.cells.length >= r.clue) continue
      for (const c of r.cells) {
        for (const m of nb[c])
          if (st[m] === -1) {
            pick = m
            break
          }
        if (pick >= 0) break
      }
    }
    if (pick < 0) pick = st.indexOf(-1)
    if (pick < 0) {
      if (complete(p, st)) {
        res.count++
        if (!res.solution) res.solution = Array.from(st, (v) => v === 0)
      }
      return
    }
    for (const v of [1, 0] as const) {
      const next = st.slice()
      next[pick] = v
      search(next)
      if (res.count >= limit || res.exhausted) return
    }
  }
  search(freshState(p))
  return res
}

/** What follows from what is marked, by the rules alone: the cells that are not marked yet but have only one possible value. `ok` is false when what is marked cannot be completed. */
export function deduce(p: Puzzle, marks: readonly Mark[]): { ok: boolean; cells: { i: number; sea: boolean }[] } {
  const st = freshState(p)
  for (let i = 0; i < st.length; i++) {
    if (p.clue[i] > 0) continue
    if (marks[i] === SEA) st[i] = 0
    else if (marks[i] === DOT) st[i] = 1
  }
  const before = st.slice()
  if (!propagate(p, st)) return { ok: false, cells: [] }
  const cells: { i: number; sea: boolean }[] = []
  for (let i = 0; i < st.length; i++) if (before[i] === -1 && st[i] !== -1) cells.push({ i, sea: st[i] === 0 })
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

/** The marks to start from: nothing marked. */
export const emptyMarks = (p: Puzzle): Mark[] => new Array<Mark>(p.w * p.h).fill(BLANK)

/** The next mark when a cell is pressed: open, sea, dot, open again. */
export const nextMark = (m: Mark): Mark => (m === BLANK ? SEA : m === SEA ? DOT : BLANK)
