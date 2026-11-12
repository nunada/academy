/** The Rubik's Cube: its pieces, its moves, and the numbers that come with them. The engine, with no drawing in it.
 *
 *  A 3×3×3 cube is kept as its *cubies*, the way the puzzle is built: 8 corner pieces and 12 edge pieces (the 6 centers never move relative to one
 *  another, so they only name the faces). A state is four lists:
 *
 *   - `cp[i]`: which corner piece sits in corner place i;   `co[i]`: how it is twisted (0, 1 or 2 thirds of a turn);
 *   - `ep[i]`: which edge piece sits in edge place i;       `eo[i]`: whether it is flipped (0 or 1).
 *
 *  Corner places and pieces are numbered URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB (0 to 7) and edges UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR (0 to 11), the order
 *  used by most cube programs. A move is a state too (what the move does to the solved cube), and `mul(a, b)` is "a, then b".
 *
 *   - `parseAlg`, `invertAlg`, `algText`: moves as words (R U R' U'), their inverse and their text;
 *   - `applyAlg`, `facelets`: doing moves, and the 54 colored squares to draw;
 *   - `cycles`, `orderOf`: the cycles of a state and the number of times it must be repeated to come back to the start (the least common multiple of the
 *     cycle orders; a twisted cycle takes three times, a flipped edge cycle twice, as long);
 *   - `invariants`, `reachable`: the three things no move changes, which decide which of the arrangements of the pieces can be reached by turning;
 *   - `POSITION_ROWS`, `positionCount`: the count of positions, one reason at a time.
 *
 *  The checker (tools/check-rubik.mjs) builds the cube a second time out of 54 squares with 3D coordinates and rotates them by 90° about the axis of each
 *  face, compares every move and every sequence with this model, hands the six moves to SymPy to get the size of the group, and counts positions by
 *  breadth-first search to compare with the published counts. */

import { rng } from './realcards'

export type Face = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'
export const FACES: Face[] = ['U', 'R', 'F', 'D', 'L', 'B']
export const CORNER_NAMES = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB']
export const EDGE_NAMES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR']

export interface Cube {
  cp: number[]
  co: number[]
  ep: number[]
  eo: number[]
}

export const SOLVED: Cube = {
  cp: [0, 1, 2, 3, 4, 5, 6, 7],
  co: [0, 0, 0, 0, 0, 0, 0, 0],
  ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
export const copy = (c: Cube): Cube => ({ cp: [...c.cp], co: [...c.co], ep: [...c.ep], eo: [...c.eo] })

/** What one clockwise quarter turn of each face does. */
export const MOVES: Record<Face, Cube> = {
  U: { cp: [3, 0, 1, 2, 4, 5, 6, 7], co: [0, 0, 0, 0, 0, 0, 0, 0], ep: [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  R: { cp: [4, 1, 2, 0, 7, 5, 6, 3], co: [2, 0, 0, 1, 1, 0, 0, 2], ep: [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  F: { cp: [1, 5, 2, 3, 0, 4, 6, 7], co: [1, 2, 0, 0, 2, 1, 0, 0], ep: [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11], eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0] },
  D: { cp: [0, 1, 2, 3, 5, 6, 7, 4], co: [0, 0, 0, 0, 0, 0, 0, 0], ep: [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  L: { cp: [0, 2, 6, 3, 4, 1, 5, 7], co: [0, 1, 2, 0, 0, 2, 1, 0], ep: [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  B: { cp: [0, 1, 3, 7, 4, 5, 2, 6], co: [0, 0, 1, 2, 0, 0, 2, 1], ep: [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7], eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1] },
}

/** a, then b. */
export function mul(a: Cube, b: Cube): Cube {
  const cp: number[] = []
  const co: number[] = []
  const ep: number[] = []
  const eo: number[] = []
  for (let i = 0; i < 8; i++) {
    cp.push(a.cp[b.cp[i]])
    co.push((a.co[b.cp[i]] + b.co[i]) % 3)
  }
  for (let i = 0; i < 12; i++) {
    ep.push(a.ep[b.ep[i]])
    eo.push((a.eo[b.ep[i]] + b.eo[i]) % 2)
  }
  return { cp, co, ep, eo }
}

/** The state that undoes c. */
export function inverse(c: Cube): Cube {
  const cp = Array<number>(8).fill(0)
  const co = Array<number>(8).fill(0)
  const ep = Array<number>(12).fill(0)
  const eo = Array<number>(12).fill(0)
  for (let i = 0; i < 8; i++) {
    cp[c.cp[i]] = i
    co[c.cp[i]] = (3 - c.co[i]) % 3
  }
  for (let i = 0; i < 12; i++) {
    ep[c.ep[i]] = i
    eo[c.ep[i]] = c.eo[i]
  }
  return { cp, co, ep, eo }
}

export const isSolved = (c: Cube): boolean => c.cp.every((v, i) => v === i) && c.ep.every((v, i) => v === i) && c.co.every((v) => v === 0) && c.eo.every((v) => v === 0)
export const same = (a: Cube, b: Cube): boolean => a.cp.every((v, i) => v === b.cp[i]) && a.co.every((v, i) => v === b.co[i]) && a.ep.every((v, i) => v === b.ep[i]) && a.eo.every((v, i) => v === b.eo[i])

/* ------------------------------------------------------------------------------------------ moves as words */

/** A move: a face and a number of clockwise quarter turns (1 = U, 2 = U2, 3 = U'). */
export interface Move {
  face: Face
  turns: 1 | 2 | 3
}
export const moveText = (m: Move): string => m.face + (m.turns === 1 ? '' : m.turns === 2 ? '2' : "'")
export const algText = (ms: Move[]): string => ms.map(moveText).join(' ')

/** At most this many moves in a typed algorithm. */
export const MAX_ALG = 200

export type ParseResult = { ok: true; moves: Move[] } | { ok: false; at: number; text: string }

/** Read "R U R' U'", with spaces, commas or brackets between the moves; ' or ’ for the inverse and 2 for a half turn (also U2'). */
export function parseAlg(src: string): ParseResult {
  const moves: Move[] = []
  const s = src.replace(/[’′‘`]/g, "'")
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (/[\s,()\[\]]/.test(ch)) {
      i++
      continue
    }
    if (!'URFDLB'.includes(ch)) return { ok: false, at: i, text: ch }
    let turns: 1 | 2 | 3 = 1
    let j = i + 1
    if (s[j] === '2') {
      turns = 2
      j++
      if (s[j] === "'") j++
    } else if (s[j] === "'") {
      turns = 3
      j++
    } else if (s[j] === '3') {
      turns = 3
      j++
    }
    moves.push({ face: ch as Face, turns })
    if (moves.length > MAX_ALG) return { ok: false, at: i, text: '…' }
    i = j
  }
  return { ok: true, moves }
}

/** The moves that undo a sequence: the same moves backwards, each inverted. */
export const invertAlg = (ms: Move[]): Move[] => [...ms].reverse().map((m) => ({ face: m.face, turns: (4 - m.turns) as 1 | 2 | 3 }))

const POWERS: Record<string, Cube> = {}
/** The state of a move: a quarter, a half or three quarters of a turn. */
export function moveState(m: Move): Cube {
  const key = moveText(m)
  const hit = POWERS[key]
  if (hit) return hit
  let c = MOVES[m.face]
  for (let k = 1; k < m.turns; k++) c = mul(c, MOVES[m.face])
  POWERS[key] = c
  return c
}

export const applyMove = (c: Cube, m: Move): Cube => mul(c, moveState(m))
export const applyAlg = (c: Cube, ms: Move[]): Cube => ms.reduce((acc, m) => applyMove(acc, m), c)
/** The state a sequence of moves makes of the solved cube. */
export const stateOf = (ms: Move[]): Cube => applyAlg(SOLVED, ms)

/** A state repeated k times (k >= 0). */
export function power(c: Cube, k: number): Cube {
  let out = SOLVED
  let base = c
  let n = k
  while (n > 0) {
    if (n & 1) out = mul(out, base)
    base = mul(base, base)
    n = Math.floor(n / 2)
  }
  return out
}

/* --------------------------------------------------------------------------------- what is drawn */

/** The 54 squares in the order U, R, F, D, L, B, nine to a face, each face read as it is seen from outside (U with B at the top, D with F at the top). */
const CORNER_FACELET = [[8, 9, 20], [6, 18, 38], [0, 36, 47], [2, 45, 11], [29, 26, 15], [27, 44, 24], [33, 53, 42], [35, 17, 51]]
const EDGE_FACELET = [[5, 10], [7, 19], [3, 37], [1, 46], [32, 16], [28, 25], [30, 43], [34, 52], [23, 12], [21, 41], [50, 39], [48, 14]]
const CORNER_COLOR = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB']
const EDGE_COLOR = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR']

/** The 54 colors of a state, one letter (the face the color belongs to) per square, in the order above. */
export function facelets(c: Cube): string {
  const out: string[] = []
  FACES.forEach((f, k) => {
    for (let n = 0; n < 9; n++) out[9 * k + n] = f
  })
  for (let i = 0; i < 8; i++) {
    const j = c.cp[i]
    for (let k = 0; k < 3; k++) out[CORNER_FACELET[i][(k + c.co[i]) % 3]] = CORNER_COLOR[j][k]
  }
  for (let i = 0; i < 12; i++) {
    const j = c.ep[i]
    for (let k = 0; k < 2; k++) out[EDGE_FACELET[i][(k + c.eo[i]) % 2]] = EDGE_COLOR[j][k]
  }
  return out.join('')
}

/* -------------------------------------------------------------------------------- cycles and order */

export interface Cycle {
  /** the places in the cycle, in the order a piece travels */
  places: number[]
  /** the length of the cycle */
  length: number
  /** the total twist (corners, in thirds) or flip (edges) around the cycle */
  twist: number
  /** how many times the state must be repeated for this cycle to be back: the length, times 3 (corners) or 2 (edges) when it is twisted */
  order: number
}

function cyclesOf(perm: number[], ori: number[], mod: number): Cycle[] {
  const seen = Array<boolean>(perm.length).fill(false)
  const out: Cycle[] = []
  for (let s = 0; s < perm.length; s++) {
    if (seen[s]) continue
    const places: number[] = []
    let twist = 0
    let p = s
    while (!seen[p]) {
      seen[p] = true
      places.push(p)
      twist = (twist + ori[p]) % mod
      p = perm[p]
    }
    out.push({ places, length: places.length, twist, order: places.length * (twist === 0 ? 1 : mod) })
  }
  return out
}

/** The cycles of the corners and of the edges (the pieces that stay in place and are not twisted are cycles of length 1 and twist 0). */
export function cycles(c: Cube): { corners: Cycle[]; edges: Cycle[] } {
  return { corners: cyclesOf(c.cp, c.co, 3), edges: cyclesOf(c.ep, c.eo, 2) }
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
export const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b

/** The number of times a state must be repeated to come back to the solved cube: the least common multiple of the orders of its cycles. */
export function orderOf(c: Cube): number {
  const { corners, edges } = cycles(c)
  return [...corners, ...edges].reduce((acc, cy) => lcm(acc, cy.order), 1)
}

/* ------------------------------------------------------------------------------- what can be reached */

const parity = (perm: number[]): 0 | 1 => {
  let p = 0
  const seen = Array<boolean>(perm.length).fill(false)
  for (let s = 0; s < perm.length; s++) {
    if (seen[s]) continue
    let len = 0
    for (let x = s; !seen[x]; x = perm[x]) {
      seen[x] = true
      len++
    }
    p += len - 1
  }
  return (p % 2) as 0 | 1
}

export interface Invariants {
  /** the corner twists added up, mod 3: 0 for every position that can be reached */
  twist: number
  /** the edge flips added up, mod 2 */
  flip: number
  /** the parity (0 even, 1 odd) of the way the corners are permuted and of the way the edges are */
  cornerParity: 0 | 1
  edgeParity: 0 | 1
  /** the three conditions, each met */
  twistOk: boolean
  flipOk: boolean
  parityOk: boolean
  /** all three: a position that can be solved by turning the faces */
  reachable: boolean
}

/** The three conditions that every position reached by turning faces meets, and that no position that is not reached meets all of at once. */
export function invariants(c: Cube): Invariants {
  const twist = c.co.reduce((a, b) => a + b, 0) % 3
  const flip = c.eo.reduce((a, b) => a + b, 0) % 2
  const cornerParity = parity(c.cp)
  const edgeParity = parity(c.ep)
  const twistOk = twist === 0
  const flipOk = flip === 0
  const parityOk = cornerParity === edgeParity
  return { twist, flip, cornerParity, edgeParity, twistOk, flipOk, parityOk, reachable: twistOk && flipOk && parityOk }
}
export const reachable = (c: Cube): boolean => invariants(c).reachable

/** Twist the corner piece in place i by a third of a turn (a thing a puzzle cannot do: it is taken apart for this). */
export function twistCorner(c: Cube, i: number): Cube {
  const r = copy(c)
  r.co[i] = (r.co[i] + 1) % 3
  return r
}
/** Flip the edge piece in place i. */
export function flipEdge(c: Cube, i: number): Cube {
  const r = copy(c)
  r.eo[i] = (r.eo[i] + 1) % 2
  return r
}
/** Take two corner pieces out and put each into the other's place. */
export function swapCorners(c: Cube, i: number, j: number): Cube {
  const r = copy(c)
  ;[r.cp[i], r.cp[j]] = [r.cp[j], r.cp[i]]
  ;[r.co[i], r.co[j]] = [r.co[j], r.co[i]]
  return r
}
/** Take two edge pieces out and put each into the other's place. */
export function swapEdges(c: Cube, i: number, j: number): Cube {
  const r = copy(c)
  ;[r.ep[i], r.ep[j]] = [r.ep[j], r.ep[i]]
  ;[r.eo[i], r.eo[j]] = [r.eo[j], r.eo[i]]
  return r
}

/* --------------------------------------------------------------------------------- counting positions */

const fact = (n: bigint): bigint => (n <= 1n ? 1n : n * fact(n - 1n))

/** One reason of the count: a number of choices, or a division by the number of positions that cannot be told apart / reached. */
export interface PositionRow {
  id: 'cornerPerm' | 'cornerTwist' | 'cornerLast' | 'edgePerm' | 'edgeFlip' | 'edgeLast' | 'parity'
  /** multiply by this (1n for a row that only divides) */
  times: bigint
  /** divide by this (1n for a row that multiplies) */
  by: bigint
  /** the rows that must be counted before this one makes sense */
  needs: PositionRow['id'][]
}

export const POSITION_ROWS: PositionRow[] = [
  { id: 'cornerPerm', times: fact(8n), by: 1n, needs: [] },
  { id: 'cornerTwist', times: 3n ** 8n, by: 1n, needs: [] },
  { id: 'cornerLast', times: 1n, by: 3n, needs: ['cornerTwist'] },
  { id: 'edgePerm', times: fact(12n), by: 1n, needs: [] },
  { id: 'edgeFlip', times: 2n ** 12n, by: 1n, needs: [] },
  { id: 'edgeLast', times: 1n, by: 2n, needs: ['edgeFlip'] },
  { id: 'parity', times: 1n, by: 2n, needs: ['cornerPerm', 'edgePerm'] },
]

/** The count with the given rows switched on (a row whose needs are not on is left out). The count is a whole number only for a set that makes sense; a division that
 *  does not come out even is rounded down, which the widget never shows because it switches the row off. */
export function positionCount(on: Set<PositionRow['id']>): bigint {
  let times = 1n
  let by = 1n
  for (const r of POSITION_ROWS) {
    if (!on.has(r.id) || !r.needs.every((n) => on.has(n))) continue
    times *= r.times
    by *= r.by
  }
  return times / by
}

/** The positions of the 3×3×3 cube: 8!·3⁷·12!·2¹¹ / 2. */
export const CUBE_POSITIONS: bigint = positionCount(new Set(POSITION_ROWS.map((r) => r.id)))
/** The positions of the 2×2×2 cube (the corners only, and the cube itself has no fixed corner so a turn of the whole cube is not counted): 7!·3⁶. */
export const POCKET_POSITIONS: bigint = fact(7n) * 3n ** 6n

/** A number with a space between groups of three digits. */
export function grouped(n: bigint, sep = ' '): string {
  const s = n.toString()
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}

/** Years needed to look at `n` things at `perSecond` a second, as a rounded string like "1.4 trillion years" is made by the widget from this number. */
export const SECONDS_PER_YEAR = 365.25 * 24 * 3600
export const yearsFor = (n: bigint, perSecond: number): number => Number(n) / perSecond / SECONDS_PER_YEAR

/* ------------------------------------------------------------------------------------- scrambles */

/** A scramble of `n` moves from a seed: no face twice in a row, and no two opposite faces in a row either (U D U would be U2 D). */
export function scramble(seed: number, n = 25): Move[] {
  const rand = rng(seed)
  const out: Move[] = []
  const axis = (f: Face): number => (f === 'U' || f === 'D' ? 0 : f === 'R' || f === 'L' ? 1 : 2)
  while (out.length < n) {
    const f = FACES[Math.floor(rand() * 6)]
    const last = out[out.length - 1]
    const before = out[out.length - 2]
    if (last && last.face === f) continue
    if (last && before && axis(last.face) === axis(f) && before.face === f) continue
    out.push({ face: f, turns: (1 + Math.floor(rand() * 3)) as 1 | 2 | 3 })
  }
  return out
}
