// What the tools that make Number Maze levels share: the engine of src/lib/numbermaze.ts, and the measuring of a level with it.
//   - analyze: the whole reachable game of a level: its size, the shortest way, how many shortest ways there are, how much of it is dead
//   - straight: the way between the start and the exit with the walls only, the values not considered
//   - neededTiles: how many of the placed tiles are needed
//   - prune: takes away every tile that is not needed, so that no tile is only there for show
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mazelib-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(path.join(tmp, 'e.ts'), [`export * from '${q('src/lib/numbermaze.ts')}'`, `export { makeRng } from '${q('src/lib/domino.ts')}'`].join('\n'))
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: path.join(tmp, 'e.mjs'), logLevel: 'error' })
export const M = await import('file://' + path.join(tmp, 'e.mjs').split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

const DIRS = [['up', 0, -1, 'w^'], ['down', 0, 1, 'wv'], ['left', -1, 0, 'w<'], ['right', 1, 0, 'w>']]

/* ------------------------------------------------------------------------------------------- measuring a level */
const ALL = ['up', 'right', 'down', 'left']
/** The whole reachable game: its size, the shortest way, how many shortest ways, and how much of it is dead (the exit can no longer be reached). */
export const ROUTE_CAP = 60
export function analyze(level, limit) {
  const keyOf = (x, y, v, u) => `${x},${y},${v},${u}`
  const ids = new Map()
  const info = [] // [x, y, v, u, dist]
  const ways = []
  const adj = []
  const wins = []
  const floorMoves = [] // moves onto plain floor: they change nothing, so they are not a different way
  const add = (x, y, v, u, d) => {
    ids.set(keyOf(x, y, v, u), info.length)
    info.push([x, y, v, u, d])
    ways.push(0)
    adj.push([])
    wins.push(0)
    return info.length - 1
  }
  add(level.start.x, level.start.y, level.startValue, 0n, 0)
  ways[0] = 1
  for (let head = 0; head < info.length; head++) {
    if (info.length > limit) return null
    const [x, y, v, u, d] = info[head]
    for (const dir of ALL) {
      const r = M.peekMove(level, { x, y }, v, u, dir)
      if (!r.ok) continue
      if (r.step.won) {
        wins[head]++
        continue
      }
      const k = keyOf(r.step.pos.x, r.step.pos.y, r.step.value, r.step.used)
      let id = ids.get(k)
      if (id === undefined) id = add(r.step.pos.x, r.step.pos.y, r.step.value, r.step.used, d + 1)
      adj[head].push(id)
      const kind = M.tileAt(level, r.step.pos.x, r.step.pos.y).kind
      if (kind === 'floor' || kind === 'start') floorMoves.push([head, id])
      if (info[id][4] === d + 1) ways[id] = Math.min(1e9, ways[id] + ways[head])
    }
  }
  let par = Infinity
  info.forEach((s, i) => {
    if (wins[i] && s[4] + 1 < par) par = s[4] + 1
  })
  if (par === Infinity) return { par: null }
  let shortest = 0
  info.forEach((s, i) => {
    if (wins[i] && s[4] + 1 === par) shortest += ways[i] * wins[i]
  })
  // which states can still reach the exit: propagate backwards
  const back = info.map(() => [])
  adj.forEach((list, i) => list.forEach((j) => back[j].push(i)))
  const alive = new Uint8Array(info.length)
  const stack = []
  wins.forEach((w, i) => {
    if (w) {
      alive[i] = 1
      stack.push(i)
    }
  })
  while (stack.length) {
    const j = stack.pop()
    for (const i of back[j])
      if (!alive[i]) {
        alive[i] = 1
        stack.push(i)
      }
  }
  let dead = 0
  alive.forEach((a) => {
    if (!a) dead++
  })
  // how many different ways win. Where you walk over plain floor is not a different way, so the positions that are joined by floor moves (same value, same used-up tiles)
  // are one place; a way is then a simple path through these places, the tiles that do something being the steps of it. Counted up to ROUTE_CAP.
  const up = Array.from({ length: info.length }, (_, i) => i)
  const find = (x) => {
    while (up[x] !== x) x = up[x] = up[up[x]]
    return x
  }
  for (const [p, q] of floorMoves) up[find(p)] = find(q)
  const cls = info.map((_, i) => find(i))
  const edges = new Map()
  const clsWins = new Set()
  info.forEach((_, i) => {
    if (!alive[i]) return
    if (wins[i]) clsWins.add(cls[i])
    for (const j of adj[i]) if (alive[j] && cls[j] !== cls[i]) (edges.get(cls[i]) ?? edges.set(cls[i], new Set()).get(cls[i])).add(cls[j])
  })
  let routes = 0
  let budget = 4_000_000
  const onPath = new Set()
  const walk = (u) => {
    onPath.add(u)
    if (clsWins.has(u)) routes++
    for (const v of edges.get(u) ?? []) {
      if (routes >= ROUTE_CAP || budget-- < 0) break
      if (!onPath.has(v)) walk(v)
    }
    onPath.delete(u)
  }
  try {
    walk(cls[0])
  } catch {
    routes = ROUTE_CAP
  }
  if (budget < 0) routes = ROUTE_CAP
  routes = Math.min(routes, ROUTE_CAP)
  return { par, shortest, routes, states: info.length, deadRate: dead / info.length }
}
/** the straight way between the start and the exit with walls only, the values not considered */
export function straight(level) {
  const seen = new Set([`${level.start.x},${level.start.y}`])
  let frontier = [[level.start.x, level.start.y]]
  for (let d = 1; frontier.length; d++) {
    const next = []
    for (const [x, y] of frontier)
      for (const [, dx, dy] of DIRS) {
        const nx = x + dx
        const ny = y + dy
        const t = M.tileAt(level, nx, ny)
        if (t.kind === 'wall' || seen.has(`${nx},${ny}`)) continue
        if (t.kind === 'goal') return d
        seen.add(`${nx},${ny}`)
        next.push([nx, ny])
      }
    frontier = next
  }
  return null
}
/** how many of the placed tiles are needed: with one of them turned into floor, the shortest way changes or there is none */
export function neededTiles(src, par) {
  const rows = src.grid.map((r) => r.split(/\s+/))
  let placed = 0
  let needed = 0
  for (let y = 0; y < rows.length; y++)
    for (let x = 0; x < rows[y].length; x++) {
      const t = rows[y][x]
      if (t === '#' || t === '.' || t === 'S' || t.startsWith('G')) continue
      placed++
      const was = rows[y][x]
      rows[y][x] = '.'
      let level
      try {
        level = M.parseLevel({ ...src, grid: rows.map((r) => r.join(' ')) })
      } catch {
        rows[y][x] = was
        needed++
        continue
      }
      const r = M.solve(level, undefined, 60_000)
      if (r.exhausted) needed++
      else if (!r.solved || r.path.length !== par) needed++
      rows[y][x] = was
    }
  return { placed, needed }
}


/** Takes away, one at a time, every tile that does nothing for the puzzle, until all that is left matters. A tile matters when, with it turned into floor, the level is no longer
 *  the same: the shortest way is another, or the number of ways that win is another (a gate that shuts a second way makes the level more nearly unique, so it matters even when
 *  nobody walks that second way). A key whose lock has gone, or a gate that shuts nothing, is not left in a level for show. */
export function prune(src, par) {
  const rows = src.grid.map((r) => r.trim().split(/\s+/))
  const mk = () => M.parseLevel({ ...src, grid: rows.map((r) => r.join(' ')) })
  let cur = analyze(mk(), 150_000)
  if (!cur || cur.par !== par) return { ...src, grid: rows.map((r) => r.join('  ')) }
  for (let again = true; again; ) {
    again = false
    outer: for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[y].length; x++) {
        const t = rows[y][x]
        if (t === '#' || t === '.' || t === 'S' || t.startsWith('G')) continue
        rows[y][x] = '.'
        let a1 = null
        try {
          a1 = analyze(mk(), 150_000)
        } catch {
          a1 = null
        }
        if (a1 && a1.par === cur.par && a1.routes === cur.routes) {
          cur = a1
          again = true
          break outer
        }
        rows[y][x] = t
      }
  }
  return { ...src, grid: rows.map((r) => r.join('  ')) }
}
