/** Hashi (Hashiwokakero, "build bridges"), as a pure engine (no screen in it).
 *
 *  A grid has some islands, each with a number. Bridges are drawn between islands, along a row or a column, so that
 *    1. the bridges at an island are as many as its number says (a bridge between two islands may be single or double: at most two);
 *    2. bridges do not cross each other and do not pass over an island;
 *    3. all the islands together are one network: from any island one can walk to any other over bridges.
 *  A good puzzle has one answer, found by reasoning, never by guessing.
 *
 *  Here: the puzzle and its answer (`parsePuzzle`), what a player has built (`Bridges`), the rules checked on it (`analyze`), a solver that counts answers (`solvePuzzle`:
 *  the generator and the checker use it) and the deductions that follow from what is built (`deduce`: what the hint uses). */

export interface Island {
  x: number
  y: number
  /** the number: how many bridges end here */
  n: number
}

/** A place where a bridge can be: two islands that see each other along a row or a column, with nothing between them. */
export interface Edge {
  /** the islands, by index (reading order: row by row), a before b */
  a: number
  b: number
  horizontal: boolean
  /** the cells strictly between the two islands (row-major index y * w + x) */
  cells: number[]
}

export interface Puzzle {
  id: string
  w: number
  h: number
  islands: Island[]
  edges: Edge[]
  /** for each cell, the island on it, or -1 */
  at: number[]
  /** for each island, the edges that end at it */
  incident: number[][]
  /** for each edge, the edges that cross it (share a cell with it) */
  crossing: number[][]
  /** the answer: how many bridges (0, 1 or 2) on each edge */
  solution: number[]
}

/** The edges of a set of islands: each island and the nearest one to its right, and the nearest one below it. */
export function layout(w: number, h: number, islands: readonly Island[]): { edges: Edge[]; at: number[]; incident: number[][]; crossing: number[][] } {
  const at = new Array<number>(w * h).fill(-1)
  islands.forEach((is, i) => {
    at[is.y * w + is.x] = i
  })
  const edges: Edge[] = []
  islands.forEach((is, i) => {
    for (const horizontal of [true, false]) {
      const cells: number[] = []
      let x = is.x
      let y = is.y
      for (;;) {
        if (horizontal) x++
        else y++
        if (x >= w || y >= h) break
        const j = at[y * w + x]
        if (j >= 0) {
          edges.push({ a: i, b: j, horizontal, cells })
          break
        }
        cells.push(y * w + x)
      }
    }
  })
  const incident: number[][] = islands.map(() => [])
  edges.forEach((e, k) => {
    incident[e.a].push(k)
    incident[e.b].push(k)
  })
  const crossing: number[][] = edges.map(() => [])
  edges.forEach((e, k) => {
    if (!e.horizontal) return
    edges.forEach((f, m) => {
      if (f.horizontal) return
      if (e.cells.some((c) => f.cells.includes(c))) {
        crossing[k].push(m)
        crossing[m].push(k)
      }
    })
  })
  return { edges, at, incident, crossing }
}

/** `rows`: the numbers (1 to 8), a row each, separated by spaces, "." where there is no island. `links`: the answer, as [island, island, bridges], islands counted in reading order from 0. */
export function parsePuzzle(id: string, rows: readonly string[], links: readonly (readonly [number, number, number])[]): Puzzle {
  const h = rows.length
  if (h === 0) throw new Error(`${id}: no rows`)
  const w = rows[0].trim().split(/\s+/).length
  const islands: Island[] = []
  for (let y = 0; y < h; y++) {
    const cells = rows[y].trim().split(/\s+/)
    if (cells.length !== w) throw new Error(`${id}: row ${y + 1} has ${cells.length} cells, not ${w}`)
    for (let x = 0; x < w; x++) {
      const c = cells[x]
      if (c === '.') continue
      if (!/^[1-8]$/.test(c)) throw new Error(`${id}: "${c}" is not a number from 1 to 8 or a dot`)
      islands.push({ x, y, n: Number(c) })
    }
  }
  const { edges, at, incident, crossing } = layout(w, h, islands)
  const solution = new Array<number>(edges.length).fill(0)
  for (const [a, b, k] of links) {
    const e = edges.findIndex((f) => (f.a === a && f.b === b) || (f.a === b && f.b === a))
    if (e < 0) throw new Error(`${id}: islands ${a} and ${b} do not see each other`)
    if (k !== 1 && k !== 2) throw new Error(`${id}: ${k} bridges between islands ${a} and ${b}`)
    if (solution[e] !== 0) throw new Error(`${id}: islands ${a} and ${b} are linked twice`)
    solution[e] = k
  }
  islands.forEach((is, i) => {
    const sum = incident[i].reduce((s, e) => s + solution[e], 0)
    if (sum !== is.n) throw new Error(`${id}: island ${i} wants ${is.n} bridges and the answer gives it ${sum}`)
  })
  return { id, w, h, islands, edges, at, incident, crossing, solution }
}

/* ---------------------------------------------------------------------------------------------------- the rules, on what is built */

/** how many bridges are on each edge (0, 1 or 2) */
export type Bridges = number[]

export type ConflictKind =
  /** an island with more bridges than its number */
  | 'too-many'
  /** two bridges that cross */
  | 'cross'
  /** a group of islands that are all full and are cut off from the others */
  | 'split'

export interface Conflict {
  kind: ConflictKind
  /** islands (for too-many and split) or edges (for cross) */
  items: number[]
}
export interface Analysis {
  conflicts: Conflict[]
  /** every island has its number, and the islands are one network */
  solved: boolean
}

export const emptyBridges = (p: Puzzle): Bridges => new Array<number>(p.edges.length).fill(0)

/** how many bridges end at each island */
export function degrees(p: Puzzle, br: readonly number[]): number[] {
  return p.islands.map((_, i) => p.incident[i].reduce((s, e) => s + br[e], 0))
}

/** the groups of islands joined by bridges */
export function components(p: Puzzle, br: readonly number[]): number[][] {
  const n = p.islands.length
  const seen = new Array<boolean>(n).fill(false)
  const out: number[][] = []
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue
    const g = [s]
    seen[s] = true
    for (let k = 0; k < g.length; k++)
      for (const e of p.incident[g[k]]) {
        if (br[e] === 0) continue
        const o = p.edges[e].a === g[k] ? p.edges[e].b : p.edges[e].a
        if (!seen[o]) (seen[o] = true), g.push(o)
      }
    out.push(g)
  }
  return out
}

export function analyze(p: Puzzle, br: readonly number[]): Analysis {
  const conflicts: Conflict[] = []
  const deg = degrees(p, br)
  p.islands.forEach((is, i) => {
    if (deg[i] > is.n) conflicts.push({ kind: 'too-many', items: [i] })
  })
  p.edges.forEach((_, e) => {
    if (br[e] === 0) return
    for (const f of p.crossing[e]) if (f > e && br[f] > 0) conflicts.push({ kind: 'cross', items: [e, f] })
  })
  const groups = components(p, br)
  if (groups.length > 1) {
    for (const g of groups) if (g.every((i) => deg[i] === p.islands[i].n)) conflicts.push({ kind: 'split', items: g })
  }
  const solved = conflicts.length === 0 && groups.length === 1 && deg.every((d, i) => d === p.islands[i].n)
  return { conflicts, solved }
}

/* ---------------------------------------------------------------------------------------------------- the solver */

/** the values an edge can still have, as bits: bit v set = v bridges are possible */
type Dom = Uint8Array

const lowest = (m: number): number => (m & 1 ? 0 : m & 2 ? 1 : 2)
const highest = (m: number): number => (m & 4 ? 2 : m & 2 ? 1 : 0)

/** how many rounds the last call of `propagate` went through before nothing changed (a measure of how long a chain of deductions is) */
let passes = 0

/** Deductions that are always right, until none is left. False when what is decided cannot be completed. */
function propagate(p: Puzzle, dom: Dom): boolean {
  const n = p.islands.length
  passes = 0
  for (let guard = 0; guard < 100000; guard++) {
    passes++
    let changed = false
    // an island's bridges add up to its number
    for (let i = 0; i < n; i++) {
      let lo = 0
      let hi = 0
      for (const e of p.incident[i]) {
        if (dom[e] === 0) return false
        lo += lowest(dom[e])
        hi += highest(dom[e])
      }
      const want = p.islands[i].n
      if (lo > want || hi < want) return false
      for (const e of p.incident[i]) {
        const restLo = lo - lowest(dom[e])
        const restHi = hi - highest(dom[e])
        let keep = 0
        for (let v = 0; v <= 2; v++) if (dom[e] & (1 << v) && v + restLo <= want && want <= v + restHi) keep |= 1 << v
        if (keep === 0) return false
        if (keep !== dom[e]) (dom[e] = keep), (changed = true)
      }
    }
    // a bridge that is sure shuts out the ones that would cross it
    for (let e = 0; e < p.edges.length; e++) {
      if (lowest(dom[e]) === 0) continue
      for (const f of p.crossing[e]) {
        if (dom[f] & 1 && dom[f] !== 1) (dom[f] = 1), (changed = true)
        else if (!(dom[f] & 1)) return false
      }
    }
    // the islands must still be able to form one network, and a group that is full cannot grow
    const reach = new Array<boolean>(n).fill(false)
    const q = [0]
    reach[0] = true
    for (let k = 0; k < q.length; k++)
      for (const e of p.incident[q[k]]) {
        if (highest(dom[e]) === 0) continue
        const o = p.edges[e].a === q[k] ? p.edges[e].b : p.edges[e].a
        if (!reach[o]) (reach[o] = true), q.push(o)
      }
    if (q.length !== n) return false
    const sure = p.edges.map((_, e) => lowest(dom[e]))
    const groups = components(p, sure)
    if (groups.length > 1) {
      const deg = degrees(p, sure)
      for (const g of groups) if (g.every((i) => deg[i] === p.islands[i].n)) return false
    }
    if (!changed) return true
  }
  return true
}

export interface SolveResult {
  /** how many answers were found, up to the limit */
  count: number
  /** the first answer found: the bridges on each edge */
  solution: number[] | null
  /** how many positions the search looked at: the more, the harder the puzzle is to reason out */
  nodes: number
  /** how many rounds of deductions the first position took before nothing more followed (longer chains of reasoning are harder) */
  rounds: number
  /** the search was stopped by the limit on positions before it was done */
  exhausted: boolean
}

export function solvePuzzle(p: Puzzle, limit = 2, maxNodes = 200_000): SolveResult {
  const res: SolveResult = { count: 0, solution: null, nodes: 0, rounds: 0, exhausted: false }
  const search = (dom: Dom): void => {
    if (res.count >= limit || res.exhausted) return
    res.nodes++
    if (res.nodes > maxNodes) {
      res.exhausted = true
      return
    }
    const fine = propagate(p, dom)
    if (res.nodes === 1) res.rounds = passes
    if (!fine) return
    // the edge to decide: an open one at the island with the fewest open edges
    let pick = -1
    let bestOpen = 99
    for (let e = 0; e < p.edges.length; e++) {
      if (lowest(dom[e]) === highest(dom[e])) continue
      let open = 0
      for (const x of [p.edges[e].a, p.edges[e].b]) for (const f of p.incident[x]) if (lowest(dom[f]) !== highest(dom[f])) open++
      if (open < bestOpen) (bestOpen = open), (pick = e)
    }
    if (pick < 0) {
      const br = Array.from(dom, (m) => lowest(m))
      if (analyze(p, br).solved) {
        res.count++
        if (!res.solution) res.solution = br
      }
      return
    }
    for (let v = 2; v >= 0; v--) {
      if (!(dom[pick] & (1 << v))) continue
      const next = dom.slice()
      next[pick] = 1 << v
      search(next)
      if (res.count >= limit || res.exhausted) return
    }
  }
  search(new Uint8Array(p.edges.length).fill(7))
  return res
}

/** What follows from what is built, by the rules alone: the edges that have to carry more bridges than they do now, and how many. `ok` is false when what is built cannot be completed.
 *  (Bridges that are built are taken as the least there will be, so a single bridge may still become a double one.) */
export function deduce(p: Puzzle, br: readonly number[]): { ok: boolean; forced: { e: number; bridges: number }[] } {
  const dom = new Uint8Array(p.edges.length)
  for (let e = 0; e < dom.length; e++) dom[e] = br[e] > 0 ? (br[e] === 1 ? 6 : 4) : 7
  if (!propagate(p, dom)) return { ok: false, forced: [] }
  const forced: { e: number; bridges: number }[] = []
  for (let e = 0; e < dom.length; e++) if (lowest(dom[e]) === highest(dom[e]) && lowest(dom[e]) > br[e]) forced.push({ e, bridges: lowest(dom[e]) })
  return { ok: true, forced }
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

/** The next count when a bridge place is pressed: none, single, double, none again. */
export const nextCount = (k: number): number => (k + 1) % 3

/** Can a bridge be put on this edge: no bridge that crosses it is there. */
export const canBuild = (p: Puzzle, br: readonly number[], e: number): boolean => p.crossing[e].every((f) => br[f] === 0)
