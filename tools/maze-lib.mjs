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
export function analyze(level, limit) {
  const keyOf = (x, y, v, u) => `${x},${y},${v},${u}`
  const ids = new Map()
  const info = [] // [x, y, v, u, dist]
  const ways = []
  const adj = []
  const wins = []
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
  return { par, shortest, states: info.length, deadRate: dead / info.length }
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


/** Takes away, one at a time, every tile that is not needed (with it turned into floor the shortest way stays the same length and there still is one), until all that is left
 *  is needed. A gate or an operator that only sits at the side of the way, and a key whose lock has gone, are not left in a level to clutter it. */
export function prune(src, par) {
  const rows = src.grid.map((r) => r.trim().split(/\s+/))
  for (let again = true; again; ) {
    again = false
    outer: for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[y].length; x++) {
        const t = rows[y][x]
        if (t === '#' || t === '.' || t === 'S' || t.startsWith('G')) continue
        const was = rows[y][x]
        rows[y][x] = '.'
        let level
        try {
          level = M.parseLevel({ ...src, grid: rows.map((r) => r.join(' ')) })
        } catch {
          rows[y][x] = was
          continue
        }
        const r = M.solve(level, undefined, 80_000)
        if (r.solved && r.path.length === par) {
          // a gate is only pointless when it blocks nothing at all: the same positions can be reached with it taken away
          if (was.startsWith('?')) {
            const before = M.parseLevel({ ...src, grid: rows.map((q, qy) => q.map((c, qx) => (qy === y && qx === x ? was : c)).join(' ')) })
            const a0 = analyze(before, 120_000)
            const a1 = analyze(level, 120_000)
            if (!a0 || !a1 || a1.states !== a0.states) {
              rows[y][x] = was
              continue
            }
          }
          again = true
          break outer
        }
        rows[y][x] = was
      }
  }
  return { ...src, grid: rows.map((r) => r.join('  ')) }
}
