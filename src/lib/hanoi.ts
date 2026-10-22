/** The Tower of Hanoi: the numbers behind the "Tower of Hanoi" article's widgets.
 *
 *  A position is an array with one entry per disc, `state[k]` the peg (0, 1, 2, …) of disc k, disc 0 the smallest. On a peg the discs
 *  must lie in order of size, so this array says everything about a position.
 *
 *  The checker (tools/check-hanoi.mjs) tests this against references that do not use it: Python's recursion for the list of moves, a
 *  breadth-first search over all p^n positions for the shortest solutions (their length and their number), the Frame–Stewart numbers
 *  from a search over every position of 4, 5 and 6 pegs, and a step-by-step simulation of every position of the tower. */

export interface Move {
  /** 0 is the smallest disc */
  disc: number
  from: number
  to: number
}

/** 2^n − 1, the number of moves of the best solution with three pegs. */
export const moveCount = (n: number): bigint => (1n << BigInt(n)) - 1n

/** The recursive solution: move the n − 1 smaller discs out of the way, move the largest, move the n − 1 on top of it. */
export function hanoiMoves(n: number, from = 0, to = 2): Move[] {
  const out: Move[] = []
  const go = (k: number, a: number, b: number): void => {
    if (k === 0) return
    const c = 3 - a - b
    go(k - 1, a, c)
    out.push({ disc: k - 1, from: a, to: b })
    go(k - 1, c, b)
  }
  go(n, from, to)
  return out
}

/** The iterative solution: the smallest disc always steps the same way around the pegs (towards `to` if n is odd), and every other
 *  move is the only legal move that does not touch the smallest disc. */
export function iterativeMoves(n: number, from = 0, to = 2): Move[] {
  const out: Move[] = []
  if (n === 0) return out
  const state = Array.from({ length: n }, () => from)
  // the order of the three pegs the smallest disc visits: from, then the peg `to` (odd n) or the third peg (even n), then the last
  const third = 3 - from - to
  const cycle = n % 2 === 1 ? [from, to, third] : [from, third, to]
  let pos = 0
  const total = Number(moveCount(n))
  for (let step = 1; step <= total; step++) {
    if (step % 2 === 1) {
      const a = cycle[pos]
      const b = cycle[(pos + 1) % 3]
      out.push({ disc: 0, from: a, to: b })
      state[0] = b
      pos = (pos + 1) % 3
    } else {
      // the two pegs that do not hold the smallest disc: move the smaller top disc onto the other
      const pegs = [0, 1, 2].filter((p) => p !== state[0])
      const [p, q] = pegs
      const tp = topDisc(state, p)
      const tq = topDisc(state, q)
      const useP = tq === -1 || (tp !== -1 && tp < tq)
      const mover = useP ? tp : tq
      const src = useP ? p : q
      const dst = useP ? q : p
      out.push({ disc: mover, from: src, to: dst })
      state[mover] = dst
    }
  }
  return out
}

/** The smallest disc on a peg, or −1 if the peg is empty. */
export function topDisc(state: number[], peg: number): number {
  for (let k = 0; k < state.length; k++) if (state[k] === peg) return k
  return -1
}

/** Whether the top disc of `from` may go on `to`. */
export function legalMove(state: number[], from: number, to: number): boolean {
  if (from === to) return false
  const t = topDisc(state, from)
  if (t === -1) return false
  const u = topDisc(state, to)
  return u === -1 || t < u
}

/** The position after moving the top disc of `from` onto `to`, or null if that is not allowed. */
export function applyMove(state: number[], from: number, to: number): number[] | null {
  if (!legalMove(state, from, to)) return null
  const next = state.slice()
  next[topDisc(state, from)] = to
  return next
}

/** The disc moved by move number m (m ≥ 1) of the optimal solution: the number of trailing zero bits of m, so 0, 1, 0, 2, 0, 1, 0, 3, … */
export function discAtMove(m: bigint): number {
  let k = 0
  while ((m >> BigInt(k)) % 2n === 0n) k++
  return k
}

/** The position after m moves of the optimal solution of an n-disc tower (0 ≤ m ≤ 2^n − 1), without making the moves. */
export function stateAfter(n: number, m: bigint, from = 0, to = 2): number[] {
  const state = new Array<number>(n).fill(from)
  let a = from
  let b = to
  let rest = m
  for (let k = n - 1; k >= 0; k--) {
    const c = 3 - a - b
    const half = 1n << BigInt(k)
    if (rest < half) {
      state[k] = a
      // the smaller discs are heading for the spare peg
      b = c
    } else {
      state[k] = b
      rest -= half
      // the smaller discs are on the spare peg and head for b
      a = c
    }
  }
  return state
}

/** An optimal list of moves from any position to the whole tower on `target`. The largest disc not yet in place decides: the smaller
 *  discs go to the third peg, it moves, and a perfect tower is built on top of it. */
export function solveFrom(state: number[], target: number): Move[] {
  const out: Move[] = []
  const cur = state.slice()
  const go = (k: number, t: number): void => {
    // bring discs 0..k to peg t
    if (k < 0) return
    if (cur[k] === t) {
      go(k - 1, t)
      return
    }
    const p = cur[k]
    const other = 3 - p - t
    go(k - 1, other)
    out.push({ disc: k, from: p, to: t })
    cur[k] = t
    // the discs below k are a perfect tower on `other`
    for (const mv of hanoiMoves(k, other, t)) {
      out.push(mv)
      cur[mv.disc] = mv.to
    }
  }
  go(state.length - 1, target)
  return out
}

/* ---------------------------------------------------------------------------------- more pegs */

/** The Frame–Stewart number for n discs and p ≥ 3 pegs: the moves of the best known solution (proved best for p = 4 by Bousch, 2014), and the
 *  number k of discs it first moves to a spare peg. */
export function frameStewart(n: number, pegs: number): { moves: bigint; split: number } {
  const F: bigint[][] = []
  const split: number[][] = []
  for (let p = 3; p <= pegs; p++) {
    F[p] = [0n]
    split[p] = [0]
    for (let m = 1; m <= n; m++) {
      if (p === 3) {
        F[p][m] = moveCount(m)
        split[p][m] = m - 1
      } else if (m === 1) {
        F[p][m] = 1n
        split[p][m] = 0
      } else {
        let best = -1n
        let bk = 1
        for (let k = 1; k < m; k++) {
          const v = 2n * F[p][k] + F[p - 1][m - k]
          if (best < 0n || v < best) {
            best = v
            bk = k
          }
        }
        F[p][m] = best
        split[p][m] = bk
      }
    }
  }
  return { moves: F[pegs][n], split: split[pegs][n] }
}

/* ----------------------------------------------------------------------------- the graph of positions */

export interface HanoiGraph {
  /** the position of each vertex in the unit triangle (an equilateral triangle of side 1: peg 0 on top, peg 1 bottom left, peg 2 bottom right) */
  points: [number, number][]
  edges: [number, number][]
  /** the vertices along the optimal solution from all discs on peg 0 to all discs on peg 2 */
  path: number[]
}

/** The graph whose vertices are the 3^n positions and whose edges are the legal moves, laid out as a Sierpiński triangle. Vertex number
 *  Σ state[k]·3^k. */
export function hanoiGraph(n: number): HanoiGraph {
  // an equilateral triangle of side 1, so that every edge of the graph has the same length
  const h = Math.sqrt(3) / 2
  const corners: [number, number][] = [
    [0.5, 0],
    [0, h],
    [1, h],
  ]
  const count = 3 ** n
  const points: [number, number][] = []
  const decode = (v: number): number[] => {
    const s: number[] = []
    for (let k = 0; k < n; k++) {
      s.push(v % 3)
      v = Math.floor(v / 3)
    }
    return s
  }
  const encode = (s: number[]): number => s.reduce((acc, p, k) => acc + p * 3 ** k, 0)
  for (let v = 0; v < count; v++) {
    const s = decode(v)
    // barycentric weights on the three corners, built from the smallest disc to the largest: a disc on peg a puts the smaller discs in the
    // corner triangle at a, turned so that "all smaller discs on peg c" faces the corner of peg b, where the move of this disc ends
    let u = [1 / 3, 1 / 3, 1 / 3]
    for (let k = 0; k < n; k++) {
      const a = s[k]
      const x = (a + 1) % 3
      const y = (a + 2) % 3
      const w = [0, 0, 0]
      w[a] = u[a] + (u[x] + u[y]) / 2
      w[x] = u[y] / 2
      w[y] = u[x] / 2
      u = w
    }
    points.push([u[0] * corners[0][0] + u[1] * corners[1][0] + u[2] * corners[2][0], u[0] * corners[0][1] + u[1] * corners[1][1] + u[2] * corners[2][1]])
  }
  const edges: [number, number][] = []
  for (let v = 0; v < count; v++) {
    const s = decode(v)
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        const next = applyMove(s, a, b)
        if (next) {
          const w = encode(next)
          if (v < w) edges.push([v, w])
        }
      }
    }
  }
  const path = [encode(new Array(n).fill(0))]
  let cur = new Array<number>(n).fill(0)
  for (const mv of hanoiMoves(n)) {
    cur = cur.slice()
    cur[mv.disc] = mv.to
    path.push(encode(cur))
  }
  return { points, edges, path }
}
