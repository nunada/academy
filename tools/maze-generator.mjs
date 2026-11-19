// A generator of Number Maze levels, and the filter that keeps the hard ones.
//   node tools/maze-generator.mjs <chapter> <how many seconds to search> <seed> [intro]
//
// The levels are not drawn by hand and they are not copies of any other game's levels: a level is made by *planting a solution* (a random walk from the start to the exit
// through a random open maze, with operators, gates, keys and one-way tiles placed along it so that the walk works), then adding decoys, and then it is kept only if the
// solver says it is a hard puzzle:
//   - the shortest way is long enough (the `par` window of the chapter) and not much longer than the straight way between start and exit, so the values matter;
//   - only a few shortest ways exist (a puzzle with a hundred answers is not one);
//   - a good part of the positions a player can reach are dead (the exit can no longer be reached), the way a limited supply of tiles makes a hasty step costly;
//   - most of the tiles are needed: taking any of them away changes the shortest way or makes the level impossible (the rest are decoys, and there are few of them).
// Every candidate is solved with the engine of src/lib/numbermaze.ts, and the whole file of levels is checked again by tools/check-numbermaze.mjs with a second
// simulator, so a level that the generator got wrong cannot get into the game.
//
// The output is a JSON list of {grid, startValue, minValue, maxValue, par, shortest, states, deadRate, needed, placed}, written to tmp/gen-<chapter>.json.
import fs from 'node:fs'
import process from 'node:process'

import { M, analyze, straight, neededTiles } from './maze-lib.mjs'

const chapter = process.argv[2] ?? 'arithmetic'
const seconds = Number(process.argv[3] ?? 60)
const seed = Number(process.argv[4] ?? 1)
const intro = process.argv[5] === 'intro'
const relax = process.argv[5] === 'relax'
/** the hard run: a longer shortest way, many dead positions; what the player meets at the end of a chapter */
const hard = process.argv[5] === 'hard'
const rand = M.makeRng(seed * 7919 + chapter.length)
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
const pick = (xs) => xs[Math.floor(rand() * xs.length)]
const chance = (p) => rand() < p
const shuffle = (xs) => {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ------------------------------------------------------------------------------------------- what each chapter may use */
const isPrime = M.isPrime
/** A weighted choice of an operator token for a chapter, given the current value (so that the step works and stays in range). */
const OPS = {
  arithmetic: (v) => pick(['+', '+', '-', '-', '*', '*', '/'].flatMap((o) => (o === '+' ? [`+${ri(1, 9)}`] : o === '-' ? [`-${ri(1, 9)}`] : o === '*' ? [`*${ri(2, 5)}`] : [`/${ri(2, 4)}`]))),
  negatives: (v) => pick([`-${ri(1, 14)}`, `-${ri(1, 14)}`, `+${ri(1, 9)}`, 'neg', `*-${ri(1, 3)}`, 'abs', `*${ri(2, 3)}`, `+${ri(1, 5)}`]),
  powers: (v) => pick(['^2', '^3', '2^', '3^', `*${ri(2, 3)}`, `+${ri(1, 3)}`, `-${ri(1, 3)}`, `*${ri(2, 4)}`, '^2', `-${ri(1, 6)}`]),
  inequalities: (v) => pick([`+${ri(1, 9)}`, `-${ri(1, 9)}`, `*${ri(2, 4)}`, `%${ri(2, 9)}`, 'abs', 'neg', `-${ri(2, 12)}`, `%${ri(3, 12)}`]),
  logarithms: (v) => pick(['log2', 'log3', 'log2', '2^', '3^', `+${ri(1, 4)}`, `-${ri(1, 4)}`, `*${ri(2, 3)}`, `/${ri(2, 3)}`, '^2']),
  numbers: (v) => pick([`+${ri(1, 6)}`, `-${ri(1, 6)}`, `*${ri(2, 4)}`, `/${ri(2, 3)}`, `+${ri(1, 6)}`, `-${ri(1, 6)}`]),
  fermat: (v) => pick([`+${ri(1, 9)}`, `-${ri(1, 9)}`, `*${ri(2, 4)}`, `/${ri(2, 4)}`, `%${ri(3, 9)}`, '^2', 'neg', 'abs', 'log2', '2^', `+${ri(1, 4)}`, `-${ri(1, 4)}`]),
}
/** A gate condition that the value `v` satisfies (and that rules something out). */
const GATES = {
  arithmetic: (v) => pick([`>=${v - ri(0, 3)}`, `<${v + ri(1, 4)}`, v % 2 ? 'odd' : 'even', `<=${v + ri(0, 3)}`, `>${v - ri(1, 4)}`, `x${[2, 3, 4, 5].find((n) => v % n === 0 && v !== 0) ?? 1}`].filter((c) => c !== 'x1')),
  negatives: (v) => pick([`<=${v + ri(0, 3)}`, `>=${v - ri(0, 3)}`, `<${v + ri(1, 5)}`, `>${v - ri(1, 5)}`, `${v - ri(0, 3)}..${v + ri(0, 3)}`, v % 2 ? 'odd' : 'even']),
  powers: (v) => pick([`>=${v - ri(0, 4)}`, `<=${v + ri(0, 4)}`, v % 2 ? 'odd' : 'even', ...(M.testCondition({ kind: 'square' }, v) ? ['square'] : []), ...(M.testCondition({ kind: 'cube' }, v) ? ['cube'] : []), `<${v + ri(1, 9)}`]),
  inequalities: (v) => pick([`${v - ri(0, 4)}..${v + ri(0, 4)}`, `=${((v % 5) + 5) % 5}mod5`, `=${((v % 3) + 3) % 3}mod3`, `=${((v % 4) + 4) % 4}mod4`, `<${v + ri(1, 5)}`, `>=${v - ri(0, 3)}`, `x${[2, 3, 4, 5, 6, 7].find((n) => v % n === 0 && v !== 0) ?? 1}`].filter((c) => c !== 'x1')),
  logarithms: (v) => pick([`>=${v - ri(0, 2)}`, `<=${v + ri(0, 2)}`, v % 2 ? 'odd' : 'even', `${Math.max(0, v - ri(0, 3))}..${v + ri(0, 3)}`]),
  numbers: (v) => pick([...(isPrime(v) ? ['prime', 'prime'] : ['notprime', 'notprime']), ...(M.testCondition({ kind: 'square' }, v) ? ['square'] : ['notsquare']), v % 2 ? 'odd' : 'even', `x${[2, 3, 5, 7].find((n) => v % n === 0 && v !== 0) ?? 1}`, `>=${v - ri(0, 3)}`].filter((c) => c !== 'x1')),
  fermat: (v) => pick([...(isPrime(v) ? ['prime'] : ['notprime']), `>=${v - ri(0, 3)}`, `<${v + ri(1, 4)}`, v % 2 ? 'odd' : 'even', `${v - ri(0, 3)}..${v + ri(0, 3)}`, `=${((v % 3) + 3) % 3}mod3`, ...(M.testCondition({ kind: 'square' }, v) ? ['square'] : [])]),
}
/** The condition of the exit: exactly the value reached, or (in some chapters) a looser one. */
const EXITS = {
  arithmetic: (v) => `=${v}`,
  negatives: (v) => `=${v}`,
  powers: (v) => pick([`=${v}`, `=${v}`, ...(M.testCondition({ kind: 'square' }, v) ? ['square'] : []), ...(M.testCondition({ kind: 'cube' }, v) ? ['cube'] : [])]),
  inequalities: (v) => pick([`=${v}`, `${v - ri(0, 2)}..${v + ri(0, 2)}`, `=${v}`]),
  logarithms: (v) => `=${v}`,
  numbers: (v) => pick([`=${v}`, isPrime(v) ? 'prime' : `=${v}`, `=${v}`]),
  fermat: (v) => pick([`=${v}`, `=${v}`, isPrime(v) ? 'prime' : `=${v}`]),
}
const START = { arithmetic: () => ri(1, 9), negatives: () => ri(-6, 4), powers: () => ri(2, 4), inequalities: () => ri(-4, 9), logarithms: () => pick([2, 4, 8, 3, 9, 16]), numbers: () => ri(1, 9), fermat: () => ri(0, 9) }
/** how the level is limited: Sumaze limits values too (above 1000, below -999) and some puzzles depend on it */
const LIMITS = { arithmetic: () => (chance(0.3) ? [-999, 1000] : [-999, 999]), negatives: () => [-999, ri(30, 200)], powers: () => [-999, pick([100, 250, 1000])], inequalities: () => [-999, 999], logarithms: () => [-999, pick([100, 300, 1000])], numbers: () => [-999, 999], fermat: () => [-999, 999] }

const PARAM = {
  // size [width, height] choices, wall density, how many tiles on the path, decoys, keys, arrows, and the windows the filter uses
  arithmetic: { sizes: [[9, 7], [9, 5], [11, 7], [7, 7], [9, 9]], wall: [0.12, 0.3], tiles: [5, 9], decoys: [2, 6], onceP: 0.85, keys: 0.15, arrows: 0.2, par: [14, 36] },
  negatives: { sizes: [[9, 7], [11, 7], [9, 9], [7, 7]], wall: [0.1, 0.28], tiles: [5, 10], decoys: [2, 6], onceP: 0.7, keys: 0.15, arrows: 0.25, par: [14, 40] },
  powers: { sizes: [[9, 7], [9, 5], [11, 7], [7, 7]], wall: [0.12, 0.3], tiles: [4, 8], decoys: [2, 5], onceP: 0.9, keys: 0.1, arrows: 0.3, par: [12, 36] },
  inequalities: { sizes: [[9, 7], [11, 7], [9, 9], [7, 7]], wall: [0.1, 0.28], tiles: [5, 10], decoys: [2, 6], onceP: 0.75, keys: 0.15, arrows: 0.25, par: [14, 40] },
  logarithms: { sizes: [[9, 7], [9, 5], [11, 7]], wall: [0.12, 0.3], tiles: [4, 8], decoys: [2, 5], onceP: 0.9, keys: 0.1, arrows: 0.25, par: [12, 34] },
  numbers: { sizes: [[9, 7], [11, 7], [9, 9], [7, 7]], wall: [0.1, 0.28], tiles: [5, 10], decoys: [2, 6], onceP: 0.8, keys: 0.45, arrows: 0.2, par: [14, 40] },
  fermat: { sizes: [[11, 7], [11, 9], [9, 9], [11, 5]], wall: [0.08, 0.25], tiles: [7, 13], decoys: [3, 8], onceP: 0.8, keys: 0.5, arrows: 0.3, par: [18, 48] },
}[chapter]
if (!PARAM) throw new Error('unknown chapter ' + chapter)
if (intro) {
  PARAM.sizes = [[7, 5], [9, 5], [7, 7], [9, 7]]
  PARAM.tiles = [3, 5]
  PARAM.decoys = [0, 2]
  PARAM.par = [6, 14]
  PARAM.keys = Math.min(0.1, PARAM.keys)
  PARAM.arrows = 0.1
}

/* ------------------------------------------------------------------------------------------- planting a solution */
const DIRS = [['up', 0, -1, 'w^'], ['down', 0, 1, 'wv'], ['left', -1, 0, 'w<'], ['right', 1, 0, 'w>']]
function maze(W, H, density) {
  const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x === 0 || y === 0 || x === W - 1 || y === H - 1 || chance(density) ? '#' : '.')))
  return g
}
function randomPath(g, S, G, minLen) {
  // a randomized depth-first walk from S to G that avoids itself; try a few times and keep the longest
  const W = g[0].length
  const H = g.length
  let best = null
  for (let attempt = 0; attempt < 12; attempt++) {
    const seen = new Set([`${S[0]},${S[1]}`])
    const path = [S]
    let steps = 0
    const dfs = (x, y) => {
      if (x === G[0] && y === G[1]) return true
      if (++steps > 4000) return false
      for (const [, dx, dy] of shuffle(DIRS)) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 1 || ny < 1 || nx >= W - 1 || ny >= H - 1 || g[ny][nx] === '#' || seen.has(`${nx},${ny}`)) continue
        seen.add(`${nx},${ny}`)
        path.push([nx, ny])
        if (dfs(nx, ny)) return true
        path.pop()
      }
      return false
    }
    if (dfs(S[0], S[1]) && (!best || path.length > best.length)) best = [...path]
    if (best && best.length >= minLen) break
  }
  return best
}
const dirOf = (a, b) => DIRS.find(([, dx, dy]) => a[0] + dx === b[0] && a[1] + dy === b[1])

function plant() {
  const P = PARAM
  const [W, H] = pick(P.sizes)
  const g = maze(W, H, P.wall[0] + rand() * (P.wall[1] - P.wall[0]))
  const sy = ri(1, H - 2)
  const gy = ri(1, H - 2)
  const S = [1, sy]
  const G = [W - 2, gy]
  g[S[1]][S[0]] = '.'
  g[G[1]][G[0]] = '.'
  const path = randomPath(g, S, G, Math.floor((W * H) / 3))
  if (!path || path.length < 6) return null
  const startValue = START[chapter]()
  const [minValue, maxValue] = LIMITS[chapter]()
  const cell = g.map((r) => [...r])
  let v = startValue
  const inner = path.slice(1, -1)
  const want = ri(P.tiles[0], P.tiles[1])
  const slots = shuffle(inner.map((_, i) => i)).slice(0, want).sort((a, b) => a - b)
  for (const i of slots) {
    const [x, y] = inner[i]
    const next = path[i + 2]
    const roll = rand()
    if (roll < P.arrows) {
      const d = dirOf(inner[i], next)
      cell[y][x] = d[3]
      continue
    }
    if (roll < P.arrows + P.keys && i + 3 < inner.length) {
      // a key here and a lock further along the path
      const id = ri(1, 2)
      const later = inner.findIndex((_, j) => j > i + 1 && !slots.includes(j))
      if (later > 0) {
        cell[y][x] = `key${id}`
        const [lx, ly] = inner[later]
        cell[ly][lx] = `lock${id}`
        continue
      }
    }
    if (roll < 0.62 || i === slots[0]) {
      // an operator that works on the value as it is
      let placed = false
      for (let t = 0; t < 14 && !placed; t++) {
        const tok = OPS[chapter](v)
        const op = M.parseOp(tok)
        if (!op) continue
        const r = M.applyOp(op, v)
        if (!r.ok || r.value > maxValue || r.value < minValue || Math.abs(r.value) > 5000 || r.value === v) continue
        const once = chance(P.onceP)
        cell[y][x] = once ? `${tok}!` : tok
        v = r.value
        placed = true
      }
    } else {
      const c = GATES[chapter](v)
      if (c && M.parseCondition(c) && M.testCondition(M.parseCondition(c), v)) cell[y][x] = `?${c}`
    }
  }
  const exit = EXITS[chapter](v)
  cell[G[1]][G[0]] = `G?${exit}`
  const decoys = ri(P.decoys[0], P.decoys[1])
  const free = []
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) if (cell[y][x] === '.' && !(x === S[0] && y === S[1])) free.push([x, y])
  for (const [x, y] of shuffle(free).slice(0, decoys)) {
    const roll = rand()
    if (roll < 0.7) {
      const tok = OPS[chapter](v)
      if (M.parseOp(tok)) cell[y][x] = chance(P.onceP) ? `${tok}!` : tok
    } else {
      const c = GATES[chapter](ri(-3, 30))
      if (c && M.parseCondition(c)) cell[y][x] = `?${c}`
    }
  }
  cell[S[1]][S[0]] = 'S'
  const grid = cell.map((r) => r.join('  '))
  return { grid, startValue, minValue, maxValue, planted: path.length - 1 }
}

/* ------------------------------------------------------------------------------------------- the search */
const results = []
const started = Date.now()
let tried = 0
let solvable = 0
const seen = new Set()
while (Date.now() - started < seconds * 1000) {
  const cand = plant()
  tried++
  if (!cand) continue
  const key = cand.grid.join('|') + cand.startValue
  if (seen.has(key)) continue
  seen.add(key)
  let level
  try {
    level = M.parseLevel(cand)
  } catch {
    continue
  }
  if (level.consumables > (relax || hard ? 26 : 22)) continue
  const a = analyze(level, 120_000)
  if (!a || a.par === null) continue
  solvable++
  const [pmin, pmax] = PARAM.par
  if (hard ? a.par < pmin + 6 || a.par > pmax + 18 : a.par < pmin - (relax ? 4 : 0) || a.par > pmax + (relax ? 4 : 0)) continue
  if (hard && a.deadRate < 0.4) continue
  const geo = straight(level)
  if (geo === null || a.par < geo + (intro ? 2 : hard ? 10 : 6)) continue
  if (a.shortest > (intro ? 60 : relax || hard ? 40 : 24)) continue
  if (a.states < (intro ? 20 : 150)) continue
  const need = neededTiles(cand, a.par)
  if (need.placed < 3 || need.needed < Math.ceil(need.placed * (intro || relax ? 0.5 : hard ? 0.55 : 0.6))) continue
  results.push({ grid: cand.grid, startValue: cand.startValue, minValue: cand.minValue, maxValue: cand.maxValue, par: a.par, shortest: a.shortest, states: a.states, deadRate: Math.round(a.deadRate * 1000) / 1000, needed: need.needed, placed: need.placed, geo })
}
fs.mkdirSync('tmp', { recursive: true })
fs.writeFileSync(`tmp/gen-${chapter}${intro ? '-intro' : relax ? '-relax' : hard ? '-hard' : ''}-${seed}.json`, JSON.stringify(results))
console.log(`${chapter}${intro ? ' (intro)' : relax ? ' (relaxed)' : hard ? ' (hard)' : ''}: ${tried} candidates, ${solvable} solvable, ${results.length} kept`)
