/** Code Maze: the pure parts. Nothing here knows about React.
 *
 *  The robot, the blocks and the way a program is run and judged belong to `blocks.ts`, the engine of the Code Blocks course. This file adds what a
 *  game needs on top of it: maps that are made from a seed (so a level is the same for everyone and can be checked), the stars a program earns, and
 *  the progress that is kept between visits.
 *
 *  Maps are text, one string per row (`#` wall, `.` floor, `*` star, `G` goal, `^ > v <` the robot), exactly the format `blocks.ts` reads.
 */

import { countBlocks, type Dir, type Program } from './blocks'

/* ------------------------------------------------------------------ random */

/** A small seeded generator (mulberry32): the same seed gives the same numbers on every machine. */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]
const GLYPH = ['^', '>', 'v', '<']

const pick = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)]
const int = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

/** Take `n` distinct items from a list, in a seeded order. */
function sample<T>(r: () => number, xs: T[], n: number): T[] {
  const pool = [...xs]
  const out: T[] = []
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0])
  return out
}

/* --------------------------------------------------------------- corridors */

export interface CorridorSpec {
  seed: number
  /** the size of the map, walls included */
  w: number
  h: number
  /** how many straight pieces the corridor has; it bends between them */
  segments: number
  /** which way it bends: always right, always left, or both (then at least once each) */
  bends: 'right' | 'left' | 'mixed'
  /** the way the robot faces at the start; by default the way the corridor leaves it */
  face?: 'ahead' | 'behind' | 'side'
  stars?: number
  /** the length of a straight piece */
  minLen?: number
  maxLen?: number
}

/** A corridor without branches: one path from the robot to the goal, with walls all round, and with no two parts of it side by side, so a sensor that
 *  looks to the left or right only ever sees the corridor's own next bend. */
export function corridorRows(s: CorridorSpec): string[] {
  const r = rng(s.seed)
  const minLen = s.minLen ?? 2
  const maxLen = s.maxLen ?? 4
  for (let attempt = 0; attempt < 4000; attempt++) {
    const taken = new Set<string>()
    const key = (x: number, y: number) => `${x},${y}`
    const path: [number, number][] = []
    let [x, y] = [int(r, 1, s.w - 2), int(r, 1, s.h - 2)]
    let d = int(r, 0, 3) as Dir
    path.push([x, y])
    taken.add(key(x, y))
    const turns: string[] = []
    let ok = true
    for (let seg = 0; seg < s.segments && ok; seg++) {
      const len = int(r, minLen, maxLen)
      for (let k = 0; k < len; k++) {
        const nx = x + DX[d]
        const ny = y + DY[d]
        if (nx < 1 || ny < 1 || nx > s.w - 2 || ny > s.h - 2 || taken.has(key(nx, ny))) {
          ok = false
          break
        }
        // the new cell may touch only the cell it was reached from
        for (let q = 0; q < 4; q++) {
          const ax = nx + DX[q]
          const ay = ny + DY[q]
          if ((ax !== x || ay !== y) && taken.has(key(ax, ay))) ok = false
        }
        if (!ok) break
        x = nx
        y = ny
        path.push([x, y])
        taken.add(key(x, y))
      }
      if (seg < s.segments - 1) {
        const t = s.bends === 'mixed' ? pick(r, ['right', 'left']) : s.bends
        turns.push(t)
        d = ((d + (t === 'right' ? 1 : 3)) % 4) as Dir
      }
    }
    if (!ok) continue
    if (s.bends === 'mixed' && !(turns.includes('right') && turns.includes('left'))) continue
    // the way out of the start, and the way the robot faces
    const out = Math.abs(path[1][0] - path[0][0]) === 1 ? (path[1][0] > path[0][0] ? 1 : 3) : path[1][1] > path[0][1] ? 2 : 0
    const face = (s.face === 'behind' ? out + 2 : s.face === 'side' ? out + 1 : out) % 4
    const grid = Array.from({ length: s.h }, () => Array<string>(s.w).fill('#'))
    for (const [px, py] of path) grid[py][px] = '.'
    const [gx, gy] = path[path.length - 1]
    grid[gy][gx] = 'G'
    for (const [px, py] of sample(r, path.slice(1, -1), s.stars ?? 0)) grid[py][px] = '*'
    grid[path[0][1]][path[0][0]] = GLYPH[face]
    return grid.map((row) => row.join(''))
  }
  throw new Error(`no corridor for seed ${s.seed}`)
}

/* ------------------------------------------------------------------- mazes */

export interface MazeSpec {
  seed: number
  /** the number of rooms across and down; the map is 2n+1 squares each way */
  cols: number
  rows: number
}

/** A perfect maze: every room can be reached by exactly one route, so it has no loops and no closed-off parts. The robot starts in the top left room
 *  facing right, and the goal is the room farthest from it. */
export function mazeRows(s: MazeSpec): string[] {
  const r = rng(s.seed)
  const W = 2 * s.cols + 1
  const H = 2 * s.rows + 1
  const g = Array.from({ length: H }, () => Array<string>(W).fill('#'))
  const seen = new Set<string>(['0,0'])
  const stack: [number, number][] = [[0, 0]]
  g[1][1] = '.'
  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1]
    const next: [number, number, number][] = []
    for (let d = 0; d < 4; d++) {
      const nx = cx + DX[d]
      const ny = cy + DY[d]
      if (nx >= 0 && ny >= 0 && nx < s.cols && ny < s.rows && !seen.has(`${nx},${ny}`)) next.push([nx, ny, d])
    }
    if (!next.length) {
      stack.pop()
      continue
    }
    const [nx, ny, d] = pick(r, next)
    g[2 * cy + 1 + DY[d]][2 * cx + 1 + DX[d]] = '.'
    g[2 * ny + 1][2 * nx + 1] = '.'
    seen.add(`${nx},${ny}`)
    stack.push([nx, ny])
  }
  // the room farthest from the start, by the length of the way there
  const dist = distances(g.map((row) => row.join('')), 1, 1)
  let best = -1
  let goal: [number, number] = [1, 1]
  for (let cy = 0; cy < s.rows; cy++)
    for (let cx = 0; cx < s.cols; cx++) {
      const dd = dist.get(`${2 * cx + 1},${2 * cy + 1}`) ?? -1
      if (dd > best) {
        best = dd
        goal = [2 * cx + 1, 2 * cy + 1]
      }
    }
  g[goal[1]][goal[0]] = 'G'
  g[1][1] = '>'
  return g.map((row) => row.join(''))
}

/** How many steps it takes to reach each open square from (x0, y0). */
export function distances(rows: string[], x0: number, y0: number): Map<string, number> {
  const dist = new Map<string, number>([[`${x0},${y0}`, 0]])
  const queue: [number, number][] = [[x0, y0]]
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]
    for (let d = 0; d < 4; d++) {
      const nx = x + DX[d]
      const ny = y + DY[d]
      const ch = rows[ny]?.[nx]
      if (ch === undefined || ch === '#' || dist.has(`${nx},${ny}`)) continue
      dist.set(`${nx},${ny}`, dist.get(`${x},${y}`)! + 1)
      queue.push([nx, ny])
    }
  }
  return dist
}

/** Put stars on the given squares (they must be plain floor). */
export function withStars(rows: string[], cells: [number, number][]): string[] {
  const g = rows.map((row) => row.split(''))
  for (const [x, y] of cells) {
    if (g[y][x] !== '.') throw new Error(`square ${x},${y} is not plain floor`)
    g[y][x] = '*'
  }
  return g.map((row) => row.join(''))
}

/** `n` stars on seeded squares chosen from `from`, never on the robot, the goal or an existing star. */
export function scatterStars(rows: string[], from: [number, number][], n: number, seed: number): string[] {
  const free = from.filter(([x, y]) => rows[y][x] === '.')
  return withStars(rows, sample(rng(seed), free, n))
}

/* ------------------------------------------------------------------- stars */

/** One to three stars for a solved level, from how many blocks the program used against the model solution (`par`).
 *  Par or fewer is three stars; up to half as many again, at least two more, is two; anything that works is one. */
export function starsFor(used: number, par: number): 1 | 2 | 3 {
  if (used <= par) return 3
  if (used <= par + Math.max(2, Math.ceil(par / 2))) return 2
  return 1
}

export const parOf = (solution: Program): number => countBlocks(solution)

/* ---------------------------------------------------------------- progress */

export interface Done {
  stars: number
  blocks: number
}
export type Progress = Record<string, Done>

/** How many levels of a tier must be solved before the next tier opens. */
export const TIER_NEED = 3

/** A better result has more stars, then fewer blocks. */
export const betterThan = (a: Done, b: Done | undefined): boolean => !b || a.stars > b.stars || (a.stars === b.stars && a.blocks < b.blocks)

export function record(p: Progress, id: string, d: Done): Progress {
  return betterThan(d, p[id]) ? { ...p, [id]: d } : p
}

/** Read what was saved; anything that is not a well-formed result is dropped, so a damaged save cannot break the game. */
export function parseProgress(raw: string | null, known: string[]): Progress {
  if (!raw) return {}
  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return {}
    const out: Progress = {}
    for (const id of known) {
      const d = (data as Record<string, unknown>)[id]
      if (typeof d !== 'object' || d === null) continue
      const { stars, blocks } = d as Record<string, unknown>
      if (typeof stars === 'number' && Number.isInteger(stars) && stars >= 1 && stars <= 3 && typeof blocks === 'number' && Number.isInteger(blocks) && blocks >= 0) out[id] = { stars, blocks }
    }
    return out
  } catch {
    return {}
  }
}

/** The tiers that can be played: the first always, each later one once `TIER_NEED` levels of the one before are solved. */
export function openTiers(tiers: { levels: string[] }[], p: Progress): boolean[] {
  const open: boolean[] = []
  tiers.forEach((_, i) => open.push(i === 0 || (open[i - 1] && tiers[i - 1].levels.filter((id) => p[id]).length >= TIER_NEED)))
  return open
}

export const totalStars = (p: Progress): number => Object.values(p).reduce((s, d) => s + d.stars, 0)
