// Number Maze: src/lib/numbermaze.ts (the rules and the solver), src/content/numbermaze.ts (the 35 levels) and the page text.
//   node tools/check-numbermaze.mjs
//
// Nothing is taken on trust from the engine:
//   - a second simulator is written here, from the rules in the text of the game, on a different representation of the state (sets of places, not a bit mask),
//     and the engine is played against it step by step over thousands of random walks on every level;
//   - every level is solved here with a breadth-first search of its own, and the shortest way must be the `par` of the level and the one the engine's solver finds;
//     the engine's path must also replay to the exit on the other simulator;
//   - from many positions in the middle of a level the engine's solver must agree with the search here, whether a way is left and how long it is;
//   - every operator and every condition is tried over a range of values against formulas written here;
//   - the texts of the levels and of the page and the saved progress are checked against the engine.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'
import * as lib from './maze-lib.mjs'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'numbermaze-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [`export * from '${q('src/lib/numbermaze.ts')}'`, `export * from '${q('src/content/numbermaze.ts')}'`, `export { GAMES } from '${q('src/content/games.ts')}'`, `export { COVER_IDS, gameCoverSvg } from '${q('src/content/gamecovers.ts')}'`, `export { makeRng } from '${q('src/lib/domino.ts')}'`].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const M = await import('file://' + outFile.split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

let bad = 0
let checks = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 40) console.error('FAIL: ' + m)
  }
  return c
}
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const rng = (seed) => M.makeRng(seed)

/* ------------------------------------------------------------------------------------------- the second simulator */
const LIMIT = 1_000_000n
const prime = (n) => {
  if (n < 2n) return false
  for (let d = 2n; d * d <= n; d++) if (n % d === 0n) return false
  return true
}
const root = (n, k) => {
  // the whole k-th root of n (k = 2 or 3), or null
  if (n < 0n) return k === 3 ? (root(-n, 3) === null ? null : -root(-n, 3)) : null
  for (let r = 0n; r <= 200n; r++) {
    const p = k === 2 ? r * r : r * r * r
    if (p === n) return r
    if (p > n) return null
  }
  return null
}
/** a condition written as in a level (the part after the ?) judged on a value, with formulas of its own */
function refCond(body, v) {
  if (body.startsWith('not')) return !refCond(body.slice(3), v)
  if (body === 'even') return v % 2n === 0n
  if (body === 'odd') return v % 2n !== 0n
  if (body === 'prime') return prime(v)
  if (body === 'square') return root(v, 2) !== null
  if (body === 'cube') return root(v, 3) !== null
  let m
  if ((m = /^x(\d+)$/.exec(body))) return v % BigInt(m[1]) === 0n
  if ((m = /^(-?\d+)\.\.(-?\d+)$/.exec(body))) return v >= BigInt(m[1]) && v <= BigInt(m[2])
  if ((m = /^=(-?\d+)mod(\d+)$/.exec(body))) {
    const n = BigInt(m[2])
    return (((v - BigInt(m[1])) % n) + n) % n === 0n
  }
  if ((m = /^(<=|>=|!=|<|>|=)(-?\d+)$/.exec(body))) {
    const n = BigInt(m[2])
    return { '<=': v <= n, '>=': v >= n, '!=': v !== n, '<': v < n, '>': v > n, '=': v === n }[m[1]]
  }
  throw new Error('unknown condition ' + body)
}
/** an operator written as in a level (without the !) applied to a value: the result, or null when it does not work */
function refOp(tok, v) {
  let r
  let m
  if (tok === 'neg') r = -v
  else if (tok === 'abs') r = v < 0n ? -v : v
  else if ((m = /^log(\d+)$/.exec(tok))) {
    const b = BigInt(m[1])
    if (b < 2n || v <= 0n) return null
    let e = 0n
    let p = 1n
    while (p < v) {
      p *= b
      e++
    }
    if (p !== v) return null
    r = e
  } else if ((m = /^(\d+)\^$/.exec(tok))) {
    if (v < 0n) return null
    r = 1n
    for (let i = 0n; i < v; i++) {
      r *= BigInt(m[1])
      if (r > LIMIT) return null
    }
  } else if ((m = /^\^(\d+)$/.exec(tok))) {
    r = 1n
    for (let i = 0; i < Number(m[1]); i++) {
      r *= v
      if (r > LIMIT || r < -LIMIT) return null
    }
  } else if ((m = /^([+\-*/%])(-?\d+)$/.exec(tok))) {
    const n = BigInt(m[2])
    if (m[1] === '+') r = v + n
    else if (m[1] === '-') r = v - n
    else if (m[1] === '*') r = v * n
    else if (m[1] === '/') {
      if (n === 0n || v % n !== 0n) return null
      r = v / n
    } else {
      if (n === 0n) return null
      const a = n < 0n ? -n : n
      r = ((v % a) + a) % a
    }
  } else throw new Error('unknown operator ' + tok)
  return r > LIMIT || r < -LIMIT ? null : r
}
function refLevel(src) {
  const rows = src.grid.map((r) => r.trim().split(/\s+/))
  let start
  const keyId = {}
  rows.forEach((row, y) =>
    row.forEach((t, x) => {
      if (t === 'S') start = [x, y]
      const k = /^(key|lock)([1-4])$/.exec(t)
      if (k) keyId[`${x},${y}`] = Number(k[2])
    }),
  )
  return { rows, w: rows[0].length, h: rows.length, start, keyId, v0: BigInt(src.startValue ?? 0), min: BigInt(src.minValue ?? -1_000_000), max: BigInt(src.maxValue ?? 1_000_000) }
}
const ARROW = { 'w^': 'up', wv: 'down', 'w<': 'left', 'w>': 'right' }
const D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
const refStart = (L) => ({ x: L.start[0], y: L.start[1], v: L.v0, got: new Set(), opened: new Set(), gone: new Set() })
const refKey = (s) => `${s.x},${s.y},${s.v}|${[...s.got].sort()}|${[...s.opened].sort()}|${[...s.gone].sort()}`
const refCopy = (s) => ({ ...s, got: new Set(s.got), opened: new Set(s.opened), gone: new Set(s.gone) })
/** one step on the second simulator: the new state and whether it won, or null if the step is not taken */
function refStep(L, s, dir) {
  const here = L.rows[s.y][s.x]
  if (ARROW[here] && ARROW[here] !== dir) return null
  const nx = s.x + D[dir][0]
  const ny = s.y + D[dir][1]
  if (nx < 0 || ny < 0 || nx >= L.w || ny >= L.h) return null
  const t = L.rows[ny][nx]
  const place = `${nx},${ny}`
  const n = refCopy(s)
  n.x = nx
  n.y = ny
  if (t === '#') return null
  if (t === '.' || t === 'S' || ARROW[t]) return { s: n, won: false }
  if (t[0] === '?') return refCond(t.slice(1), s.v) ? { s: n, won: false } : null
  if (t[0] === 'G') {
    if (t.length > 1 && !refCond(t.slice(2), s.v)) return null
    return { s: n, won: true }
  }
  let m = /^key([1-4])$/.exec(t)
  if (m) {
    n.got.add(place)
    return { s: n, won: false }
  }
  m = /^lock([1-4])$/.exec(t)
  if (m) {
    if (s.opened.has(place)) return { s: n, won: false }
    const id = Number(m[1])
    const picked = [...s.got].filter((p) => L.keyId[p] === id).length
    const used = [...s.opened].filter((p) => L.keyId[p] === id).length
    if (picked - used < 1) return null
    n.opened.add(place)
    return { s: n, won: false }
  }
  const once = t.endsWith('!')
  if (once && s.gone.has(place)) return { s: n, won: false }
  const r = refOp(once ? t.slice(0, -1) : t, s.v)
  if (r === null || r > L.max || r < L.min) return null
  n.v = r
  if (once) n.gone.add(place)
  return { s: n, won: false }
}
/** the shortest way to the exit on the second simulator, as a list of directions, or null */
function refSolve(L, from, cap = 400_000) {
  const start = from ?? refStart(L)
  const seen = new Map([[refKey(start), null]])
  let frontier = [start]
  while (frontier.length) {
    const next = []
    for (const s of frontier)
      for (const dir of ['up', 'right', 'down', 'left']) {
        const r = refStep(L, s, dir)
        if (!r) continue
        if (r.won) {
          const path = [dir]
          let k = refKey(s)
          while (seen.get(k)) {
            const link = seen.get(k)
            path.push(link.dir)
            k = link.from
          }
          return path.reverse()
        }
        const k = refKey(r.s)
        if (seen.has(k)) continue
        seen.set(k, { from: refKey(s), dir })
        next.push(r.s)
        if (seen.size > cap) return undefined
      }
    frontier = next
  }
  return null
}

/* ------------------------------------------------------------------------------------------- operators and conditions */
{
  const OPS = ['+3', '-4', '*2', '*-3', '/2', '/3', '/-2', '%5', '%-4', '^2', '^3', '2^', '3^', 'log2', 'log3', 'neg', 'abs']
  let n = 0
  for (const tok of OPS)
    for (let v = -40; v <= 60; v++) {
      const op = M.parseOp(tok)
      ok(op !== null, `parseOp reads ${tok}`)
      const got = M.applyOp(op, v)
      const want = refOp(tok, BigInt(v))
      ok(got.ok === (want !== null) && (!got.ok || BigInt(got.value) === want), `${tok} on ${v}: engine ${JSON.stringify(got)}, reference ${want}`)
      n++
    }
  ok(n === OPS.length * 101, 'every operator over -40..60')
  // no minus zero, whole numbers only
  ok(Object.is(M.applyOp(M.parseOp('*0'), -5).value, 0) && Object.is(M.applyOp(M.parseOp('neg'), 0).value, 0), 'zero is never minus zero')
  ok(!M.applyOp(M.parseOp('^2'), 2000).ok && !M.applyOp(M.parseOp('*1000'), 5000).ok && M.applyOp(M.parseOp('*1000'), 1000).ok, 'a value beyond a million is refused')
  const BODIES = ['<5', '<=5', '>5', '>=5', '=5', '!=5', 'even', 'odd', 'prime', 'square', 'cube', 'x3', 'x1', '2..9', '-3..3', '=1mod3', '=0mod2', '=-1mod5', 'notprime', 'noteven', 'not<0', 'notsquare']
  for (const body of BODIES) {
    const c = M.parseCondition(body)
    ok(c !== null, `parseCondition reads ${body}`)
    for (let v = -60; v <= 150; v++) ok(M.testCondition(c, v) === refCond(body, BigInt(v)), `?${body} on ${v}`)
  }
  for (const badBody of ['', 'foo', '<', '5', 'x', 'x0.5', '=1mod0', '2..', 'not', '>>3'])
    ok(M.parseCondition(badBody) === null, `parseCondition refuses "${badBody}"`)
  for (const badOp of ['', '+', '3', 'log', 'log1x', '*a', '^', 'abs2'])
    ok(M.parseOp(badOp) === null, `parseOp refuses "${badOp}"`)
}

/* ------------------------------------------------------------------------------------------- the parser */
{
  const bad = (grid, why) => {
    let threw = false
    try {
      M.parseLevel({ id: 't', grid })
    } catch {
      threw = true
    }
    ok(threw, `the parser refuses ${why}`)
  }
  bad([], 'an empty grid')
  bad(['# #', '# S G'], 'a ragged grid')
  bad(['# S S G #'], 'two starts')
  bad(['# S . . #'], 'no exit')
  bad(['# . G #'], 'no start')
  bad(['# S G?? #'], 'an exit with a condition it cannot read')
  bad(['# S Gx #'], 'an exit whose condition has no ?')
  bad(['# S ?foo G #'], 'a gate it cannot read')
  bad(['# S lock2 G #'], 'a lock without a key')
  bad(['# S zz G #'], 'an unknown token')
  const lv = M.parseLevel({ id: 't', startValue: 5, grid: ['#   S   +2!  key1  lock1  G?=9  #', '#   .   *3   w^    wv     .  #'] })
  ok(lv.width === 7 && lv.height === 2 && lv.start.x === 1 && lv.start.y === 0 && lv.startValue === 5 && lv.consumables === 3, 'a level is read: size, start, value, the tiles used up (an operator with !, a key and a lock)')
  ok(M.parseLevel({ id: 't', grid: ['S G'] }).minValue === -M.MAX_ABS && M.parseLevel({ id: 't', minValue: -9, maxValue: 99, grid: ['S G'] }).maxValue === 99, 'the limits of a level')
}

/* ------------------------------------------------------------------------------------------- the 35 levels */
const LEVELS = M.ALL_LEVELS
ok(LEVELS.length === 100 && M.CHAPTERS.map((c) => c.levels.length).join() === '14,14,14,14,14,14,16', 'seven chapters of 14, 14, 14, 14, 14, 14 and 16 levels')
ok(new Set(M.LEVEL_IDS).size === 100 && M.LEVEL_IDS.every((id) => /^(ar|ng|pw|in|lg|nb|fr)\d\d$/.test(id)), 'the level ids are unique')
const parsed = new Map()
const ref = new Map()
let totalStates = 0
for (const lv of LEVELS) {
  const where = `level ${lv.id}`
  let level
  try {
    level = M.parseLevel(lv)
  } catch (e) {
    ok(false, `${where} does not parse: ${e.message}`)
    continue
  }
  parsed.set(lv.id, level)
  const R = refLevel(lv)
  ref.set(lv.id, R)
  ok(level.width === R.w && level.height === R.h && level.start.x === R.start[0] && level.start.y === R.start[1], `${where}: the engine and the reference read the same size and start`)
  ok(lv.grid.every((row) => row.trim().split(/\s+/).every((t) => t === '#' || /^[.SG]/.test(t) || /^(\?|w[v^<>]|key[1-4]|lock[1-4]|[+\-*/%^]|neg|abs|log|\d+\^)/.test(t))), `${where}: every token is one the reference knows`)
  // the edge of the grid is wall all round
  ok(R.rows[0].every((t) => t === '#') && R.rows[R.h - 1].every((t) => t === '#') && R.rows.every((row) => row[0] === '#' && row[row.length - 1] === '#'), `${where}: the edge of the grid is wall`)

  // the shortest way: the reference, the solver of the engine, and the par of the data must all agree
  const rs = refSolve(R)
  const es = M.solve(level)
  ok(rs && rs.length >= 1, `${where}: the reference finds a way to the exit`)
  ok(es.solved && !es.exhausted, `${where}: the solver of the engine finds a way`)
  ok(rs && es.solved && rs.length === es.path.length && es.path.length === lv.par, `${where}: shortest way ${rs?.length} (reference), ${es.path.length} (engine), par ${lv.par}`)
  totalStates += es.statesExplored
  // the engine's way replays to the exit on the second simulator, and one step short of the end it has not won
  if (es.solved) {
    let s = refStart(R)
    let won = false
    es.path.forEach((dir, i) => {
      const r = refStep(R, s, dir)
      ok(r !== null, `${where}: step ${i + 1} of the engine's way is allowed on the reference`)
      if (r) {
        s = r.s
        won = r.won
        ok(r.won === (i === es.path.length - 1), `${where}: the exit is reached at the last step only`)
      }
    })
    ok(won, `${where}: the engine's way ends at the exit`)
    // and the engine's own game agrees
    const g = M.createGame(level)
    for (const dir of es.path) M.move(g, dir)
    ok(g.won && g.moves === es.path.length, `${where}: playing the way in the engine wins in ${es.path.length} steps`)
  }
}
console.log(`levels: ${LEVELS.length}, states searched by the engine: ${totalStates}`)

/* ------------------------------------------------------------------------------------------- a puzzle, not a corridor */
{
  const made = LEVELS.filter((l) => !['ar01', 'ar02', 'ar03'].includes(l.id))
  const pars = made.map((l) => l.par).sort((a, b) => a - b)
  const median = pars[Math.floor(pars.length / 2)]
  ok(made.length === 97 && median >= 16, `the median shortest way of the 97 generated levels is ${median} steps (at least 16)`)
  ok(made.filter((l) => l.par >= 25).length >= 15 && Math.max(...pars) >= 35, `${made.filter((l) => l.par >= 25).length} levels need 25 steps or more, the longest ${Math.max(...pars)}`)
  // each chapter climbs: its last half is longer than its first half on average
  for (const c of M.CHAPTERS) {
    const ps = c.levels.map((l) => l.par)
    const half = Math.floor(ps.length / 2)
    const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length
    ok(avg(ps.slice(half)) > avg(ps.slice(0, half)), `${c.id}: the second half is longer than the first (${avg(ps.slice(0, half)).toFixed(1)} → ${avg(ps.slice(half)).toFixed(1)})`)
  }
  // the values matter: the shortest way is well beyond the straight way between the start and the exit, with the values not considered (a wall-only search written here)
  for (const lv of made) {
    const R = ref.get(lv.id)
    if (!R) continue
    // the first two or three levels of a chapter are gentle: only a little beyond the straight way
    const gentle = Number(lv.id.slice(2)) <= 4
    const seen = new Set([R.start.join()])
    let frontier = [R.start]
    let straight = null
    for (let d = 1; frontier.length && straight === null; d++) {
      const next = []
      for (const [x, y] of frontier)
        for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= R.w || ny >= R.h || R.rows[ny][nx] === '#' || seen.has(`${nx},${ny}`)) continue
          if (R.rows[ny][nx][0] === 'G') straight = straight ?? d
          seen.add(`${nx},${ny}`)
          next.push([nx, ny])
        }
      frontier = next
    }
    ok(straight !== null && lv.par >= straight + (gentle ? 2 : 6), `${lv.id}: the shortest way is ${lv.par} and the straight way ${straight}: the values must matter`)
  }
  // the exit is never an open door: every generated level has an exit that asks for something, and most have gates
  const askCount = made.filter((l) => l.grid.some((r) => /G\?/.test(r))).length
  ok(askCount === made.length, 'every generated level has an exit with a condition')
  ok(made.filter((l) => l.grid.some((r) => /\?/.test(r.replace(/G\?/g, '')))).length >= 35, 'a good part of the levels have gates')
  // a tile is not for show: a gate or an operator taken away (made floor), the shortest way is another or the number of ways that win is another.
  // A gate that shuts a second way is a gate that makes the level more nearly unique, so it counts even when nobody walks that way.
  // (A way is a path over the places of the game; the floor walked over differently is not another way.)
  let gates = 0
  const routeCounts = []
  for (const lv of made) {
    const rows = lv.grid.map((r) => r.trim().split(/\s+/))
    const mk = (g) => lib.M.parseLevel({ id: lv.id, startValue: lv.startValue, minValue: lv.minValue, maxValue: lv.maxValue, grid: g.map((r) => r.join(' ')) })
    const base = lib.analyze(mk(rows), 150_000)
    if (!ok(base && base.par !== null, `${lv.id}: the level can be measured and has a way`)) continue
    routeCounts.push(base.routes)
    ok(lib.gatesOffRoute(mk(rows), base).length === 0, `${lv.id}: every gate is gone through by a way that wins (a gate nobody can pass is a wall with another name)`)
    for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[y].length; x++) {
        if (!/^\?/.test(rows[y][x])) continue
        gates++
        const copy = rows.map((r) => r.slice())
        copy[y][x] = '.'
        const without = lib.analyze(mk(copy), 150_000)
        ok(base && without && base.par !== null && (without.par !== base.par || without.routes !== base.routes), `${lv.id}: the gate ${rows[y][x]} at ${x},${y} changes the shortest way or the number of ways that win (it is not for show)`)
      }
  }
  ok(gates >= 50, `${gates} gates in the levels`)
  // Sumaze is for the most part a single way: most levels have one or two ways that win, none has a crowd
  const few = routeCounts.filter((n) => n <= 2).length
  ok(few >= 0.6 * routeCounts.length && routeCounts.every((n) => n <= 8), `${few} of ${routeCounts.length} levels have one or two ways that win, and none has more than ${Math.max(...routeCounts)} (at most 8)`)
  ok(routeCounts.filter((n) => n === 1).length >= 0.25 * routeCounts.length, `${routeCounts.filter((n) => n === 1).length} levels have exactly one way that wins`)
}

/* ------------------------------------------------------------------------------------------- the engine against the second simulator, step by step */
{
  const dirs = ['up', 'right', 'down', 'left']
  const popcount = (m) => {
    let n = 0
    while (m) {
      m &= m - 1n
      n++
    }
    return n
  }
  let walks = 0
  let steps = 0
  let blocked = 0
  for (const lv of LEVELS) {
    const level = parsed.get(lv.id)
    const R = ref.get(lv.id)
    if (!level) continue
    const r = rng(lv.id.charCodeAt(0) * 1000 + Number(lv.id.slice(1)))
    for (let w = 0; w < 150; w++) {
      const g = M.createGame(level)
      let s = refStart(R)
      const trail = []
      walks++
      for (let i = 0; i < 70 && !g.won; i++) {
        const dir = dirs[Math.floor(r() * 4)]
        const want = refStep(R, s, dir)
        const got = M.move(g, dir)
        steps++
        ok(got.ok === (want !== null), `${lv.id} walk ${w} step ${i}: ${dir} is ${got.ok ? 'taken' : 'refused'} by the engine and ${want ? 'taken' : 'refused'} by the reference`)
        if (!got.ok) {
          blocked++
          ok(!!got.blocked.reason, 'a refused step says why')
          // a refused step changes nothing
          ok(g.pos.x === s.x && g.pos.y === s.y && BigInt(g.value) === s.v, `${lv.id}: a refused step left the game as it was`)
          continue
        }
        if (!want) break
        trail.push({ x: g.pos.x, y: g.pos.y, v: g.value, used: g.used })
        s = want.s
        ok(g.pos.x === s.x && g.pos.y === s.y && BigInt(g.value) === s.v && g.won === want.won, `${lv.id} walk ${w} step ${i}: place, value or exit differ from the reference`)
        ok(popcount(g.used) === s.got.size + s.opened.size + s.gone.size, `${lv.id} walk ${w} step ${i}: the tiles used up are counted differently`)
        ok(g.moves === trail.length, `${lv.id}: the step counter`)
      }
      // undo takes back every step, one by one, to the very start
      const total = g.history.length
      for (let k = total - 1; k >= 0; k--) {
        ok(M.undo(g), `${lv.id}: undo has a step to take back`)
        const t = trail[k - 1]
        if (k === 0) ok(g.pos.x === level.start.x && g.pos.y === level.start.y && g.value === level.startValue && g.used === 0n && g.moves === 0 && !g.won, `${lv.id}: undoing everything is the start of the level`)
        else ok(t && g.pos.x === t.x && g.pos.y === t.y && g.value === t.v && g.used === t.used, `${lv.id}: undo goes back to the position before`)
      }
      ok(!M.undo(g), `${lv.id}: nothing to undo at the start`)
      // restart is the start of the level, from anywhere
      for (let i = 0; i < 5; i++) M.move(g, dirs[Math.floor(r() * 4)])
      M.reset(g)
      ok(g.pos.x === level.start.x && g.value === level.startValue && g.used === 0n && g.moves === 0 && g.history.length === 0 && !g.won, `${lv.id}: restart`)
    }
  }
  ok(walks === 100 * 150 && steps > 100000 && blocked > 10000, `${walks} random walks, ${steps} steps, ${blocked} refused`)
  // after the exit nothing moves
  const lv = M.parseLevel(LEVELS[0])
  const g = M.createGame(lv)
  for (const d of M.solve(lv).path) M.move(g, d)
  ok(g.won && M.move(g, 'left').ok === false && M.move(g, 'left').blocked.reason === 'finished', 'a finished level takes no more steps')
}

/* ------------------------------------------------------------------------------------------- the solver from the middle of a level */
{
  const dirs = ['up', 'right', 'down', 'left']
  let alive = 0
  let dead = 0
  let unknown = 0
  for (const lv of LEVELS) {
    const level = parsed.get(lv.id)
    const R = ref.get(lv.id)
    if (!level) continue
    const r = rng(7 + lv.id.charCodeAt(0) + Number(lv.id.slice(1)) * 31)
    for (let w = 0; w < 12; w++) {
      const g = M.createGame(level)
      let s = refStart(R)
      const stopAt = 1 + Math.floor(r() * 25)
      for (let i = 0; i < stopAt && !g.won; i++) {
        const dir = dirs[Math.floor(r() * 4)]
        const want = refStep(R, s, dir)
        if (M.move(g, dir).ok && want) s = want.s
      }
      if (g.won) continue
      // a level whose tiles never run out has no end to the values, so a search that cannot finish says nothing either way
      const e = M.solve(level, { pos: g.pos, value: g.value, used: g.used }, 40_000)
      const x = refSolve(R, s, 40_000)
      if (e.exhausted || x === undefined) {
        unknown++
        continue
      }
      ok(e.solved === (x !== null), `${lv.id}: from step ${g.moves} a way is ${e.solved ? 'found' : 'not found'} by the engine and ${x ? 'found' : 'not found'} by the reference`)
      if (e.solved && x) {
        ok(e.path.length === x.length, `${lv.id}: from step ${g.moves} the shortest way is ${e.path.length} (engine) or ${x.length} (reference)`)
        // the first step of the way is a step that is taken, and does not lose the way
        const first = M.peekMove(level, g.pos, g.value, g.used, e.path[0])
        ok(first.ok, `${lv.id}: the step the hint would show is allowed`)
        alive++
      } else dead++
    }
  }
  ok(alive > 150, `${alive} positions with a way left were compared`)
  console.log(`positions in the middle: ${alive} with a way left, ${dead} dead, ${unknown} too far to tell`)
  ok(dead > 10, `${dead} dead positions were compared`)
  // a dead position: the exit wants 0, and the only way to 0 is not to touch the +1 that is used up once
  const lv = M.parseLevel({ id: 'dead', startValue: 0, grid: ['# # # # #', '# G?=0 S +1! #'] })
  const g = M.createGame(lv)
  ok(M.solve(lv).solved && M.solve(lv).path.length === 1, 'from the start the exit is one step away')
  M.move(g, 'right')
  const after = M.solve(lv, { pos: g.pos, value: g.value, used: g.used })
  ok(!after.solved && !after.exhausted && refSolve(refLevel({ startValue: 0, grid: ['# # # # #', '# G?=0 S +1! #'] }), { ...refStart(refLevel({ grid: ['# # # # #', '# G?=0 S +1! #'] })), x: 3, y: 1, v: 1n, gone: new Set(['3,1']) }) === null, 'after the +1 is used up the exit cannot be reached any more: a dead position, on both')
}
{
  // the limit of states: a search that is stopped says so, and does not claim there is no way
  const r = M.solve(parsed.get('ar08'), undefined, 3)
  ok(r.exhausted === true && r.solved === false, 'a search stopped at its limit says so')
}

/* ------------------------------------------------------------------------------------------- the particular rules */
{
  const play = (grid, start, dirs, extra = {}) => {
    const lv = M.parseLevel({ id: 't', startValue: start, grid, ...extra })
    const g = M.createGame(lv)
    const out = dirs.map((d) => M.move(g, d))
    return { g, out }
  }
  // a one-way tile closes the way out, not the way in
  let r = play(['# . # #', 'S w> . G', '# . # #'], 0, ['right', 'up'])
  ok(r.out[0].ok && !r.out[1].ok && r.out[1].blocked.reason === 'oneway' && r.out[1].blocked.dir === 'right', 'a one-way tile can be entered from the side, and left only the way of the arrow')
  r = play(['S wv', '# G'], 0, ['right', 'down'])
  ok(r.out[0].ok && r.out[1].ok && r.g.won, 'and left the way of the arrow')
  // a gate does not change the value; a locked gate stops
  r = play(['S ?>=3 G'], 2, ['right'])
  ok(!r.out[0].ok && r.out[0].blocked.reason === 'locked' && r.out[0].blocked.exit === false && r.g.value === 2 && r.g.pos.x === 0, 'a gate that does not open')
  r = play(['S ?>=3 G?=3'], 3, ['right', 'right'])
  ok(r.out.every((o) => o.ok) && r.g.value === 3 && r.g.won, 'a gate that opens, and an exit that wants 3')
  r = play(['S G?=4'], 3, ['right'])
  ok(!r.out[0].ok && r.out[0].blocked.exit === true, 'an exit that wants another value')
  // a tile used up once
  r = play(['S +2! . G?=4'], 0, ['right', 'left', 'right', 'right', 'right'])
  ok(r.g.value === 2 && !r.g.won, 'a tile used up once works only the first time')
  r = play(['S +2 . G?=4'], 0, ['right', 'left', 'right', 'right', 'right'])
  ok(r.g.value === 4 && r.g.won, 'a tile that never runs out works each time')
  // keys and locks
  r = play(['# key1 #', 'S . lock1', '# # G'], 0, ['right', 'up', 'down', 'right', 'down'])
  ok(r.out.every((o) => o.ok) && r.g.won, 'a key opens a lock')
  r = play(['S lock1 G', '# key1 #'], 0, ['right'])
  ok(!r.out[0].ok && r.out[0].blocked.reason === 'no-key' && r.out[0].blocked.key === 1, 'a lock without its key')
  r = play(['# key2 #', 'S . lock1', '# key1 G'], 0, ['right', 'up', 'down', 'right'])
  ok(!r.out[3].ok && r.out[3].blocked.reason === 'no-key', 'a key of another number does not open a lock')
  r = play(['# key1 # #', 'S . lock1 lock1', '# # # G'], 0, ['right', 'up', 'down', 'right', 'right'])
  ok(r.out[3].ok && !r.out[4].ok && r.out[4].blocked.reason === 'no-key', 'a key is used up by the lock that took it')
  // limits of a level
  r = play(['S +5 +5 G'], 0, ['right', 'right'], { maxValue: 9 })
  ok(r.out[0].ok && !r.out[1].ok && r.out[1].blocked.reason === 'limit' && r.out[1].blocked.high === true && r.out[1].blocked.limit === 9, 'a value above the limit of the level is refused')
  r = play(['S -5 -5 G'], 0, ['right', 'right'], { minValue: -9 })
  ok(!r.out[1].ok && r.out[1].blocked.high === false, 'and a value below')
  // a value exactly on the limit is allowed
  r = play(['S +5 +5 G'], 0, ['right', 'right'], { maxValue: 10 })
  ok(r.out[0].ok && r.out[1].ok && r.g.value === 10, 'a value exactly on the upper limit is allowed')
  r = play(['S -5 -5 G'], 0, ['right', 'right'], { minValue: -10 })
  ok(r.out[0].ok && r.out[1].ok && r.g.value === -10, 'and exactly on the lower limit')
  // division that is not even
  r = play(['S /2 G'], 3, ['right'])
  ok(!r.out[0].ok && r.out[0].blocked.reason === 'not-divisible', 'a division that does not come out even is not taken')
  r = play(['S log2 G'], 6, ['right'])
  ok(!r.out[0].ok && r.out[0].blocked.reason === 'not-exact', 'a logarithm that is not exact is not taken')
  r = play(['S log2 G'], 0, ['right'])
  ok(!r.out[0].ok && r.out[0].blocked.reason === 'undefined', 'a logarithm of zero is not defined')
}

/* ------------------------------------------------------------------------------------------- progress (a level is solved or not; no steps are counted, no stars) */
{
  ok(M.starsFor === undefined, 'there are no stars: nothing in the engine scores the steps')
  const ids = M.LEVEL_IDS
  const good = { ar01: true, ar02: true }
  ok(JSON.stringify(M.parseProgress(JSON.parse(JSON.stringify(Object.keys(good))), ids)) === JSON.stringify(good), 'saved progress (a list of the solved levels) is read back')
  const dirty = ['lg01', 'zz', 7, null, { a: 1 }, 'ar01', 'ar01', 'ng01 ']
  ok(JSON.stringify(M.parseProgress(dirty, ids)) === JSON.stringify({ lg01: true, ar01: true }), 'what is malformed is dropped, and so are levels that do not exist')
  ok(Object.keys(M.parseProgress(null, ids)).length === 0 && Object.keys(M.parseProgress({ ar01: true }, ids)).length === 0 && Object.keys(M.parseProgress('ar01', ids)).length === 0, 'no progress at all from something that is not a list')
}

/* ------------------------------------------------------------------------------------------- texts */
{
  const usedOps = new Set()
  const usedConds = new Set()
  const tokens = LEVELS.flatMap((l) => l.grid.flatMap((r) => r.trim().split(/\s+/)))
  for (const lv of LEVELS) {
    const level = parsed.get(lv.id)
    if (!level) continue
    for (const row of level.tiles)
      for (const t of row) {
        if (t.kind === 'op') usedOps.add(t.op.kind)
        if (t.kind === 'gate' || (t.kind === 'goal' && t.condition)) {
          const c = t.condition
          usedConds.add(c.kind)
        }
      }
  }
  ok([...usedOps].sort().join() === 'abs,add,div,exp,log,mod,mul,neg,pow,sub', `the operators of the levels are + − × ÷ remainder, powers, logarithms, ± and |x| (${[...usedOps].sort()})`)
  ok([...usedConds].sort().join() === 'congruent,eq,even,ge,gt,le,lt,multiple,not,odd,prime,range,square', `the conditions of the levels (${[...usedConds].sort()})`)
  ok(tokens.some((t) => /^w[v^<>]$/.test(t)) && tokens.some((t) => /^key[12]$/.test(t)), 'one-way tiles and keys appear in the levels')

  const lvText = LEVELS.flatMap((l) => [l.name, l.hint])
  ok(lvText.every((x) => x.en.trim().length > 0 && x.id.trim().length > 0 && x.en !== x.id), 'every level has a name and a hint in both languages, and they differ')
  ok(LEVELS.every((l) => l.name.en.length <= 32 && l.name.id.length <= 36 && l.hint.en.length <= 260 && l.hint.id.length <= 280), 'names and hints are short enough')
  ok(!lvText.some((x) => /(^|[^*])\*[^*\s][^*]*\*([^*]|$)/.test(x.en + ' ' + x.id)), 'no *word* emphasis')
  ok(new Set(LEVELS.map((l) => l.name.en)).size === 100 && new Set(LEVELS.map((l) => l.name.id)).size === 100, 'every level has a name of its own')
  // the colors named in a hint are the colors of tiles that are in the level
  for (const lv of LEVELS) {
    const level = parsed.get(lv.id)
    if (!level) continue
    const tiles = level.tiles.flat()
    const has = (f) => tiles.some(f)
    const both = (re, f, what) => {
      for (const loc of ['en', 'id'])
        if (re[loc].test(lv.hint[loc])) ok(has(f), `${lv.id}: the hint (${loc}) names ${what}, and the level has none`)
    }
    both({ en: /\bblue\b/i, id: /\bbiru\b/i }, (t) => t.kind === 'op' && !t.once, 'a blue tile (an operator that never runs out)')
    both({ en: /\bgold\b|dashed/i, id: /\bemas\b|putus-putus/i }, (t) => t.kind === 'op' && t.once, 'a gold dashed tile (an operator used up once)')
    both({ en: /\bkey\b/i, id: /\bkunci\b/i }, (t) => t.kind === 'key', 'a key')
    both({ en: /\block\b/i, id: /\bgembok\b/i }, (t) => t.kind === 'lock', 'a lock')
    both({ en: /\bprime\b/i, id: /\bprima\b/i }, (t) => (t.kind === 'gate' || t.kind === 'goal') && t.condition && JSON.stringify(t.condition).includes('prime'), 'a prime gate')
  }
  // the levels begin without anything that can be spoiled, and the first level of the first chapter has no operator at all
  const firstTiles = parsed.get('ar01').tiles.flat()
  ok(firstTiles.every((t) => t.kind !== 'op' && t.kind !== 'gate'), 'the first level has nothing but a corridor')

  const game = M.GAMES.find((g) => g.id === 'number-maze')
  const all_text = (g) => JSON.stringify([g.answer, g.description, g.sections.map((x) => x.text), g.faq.map((f) => [f.q, f.a])])
  if (ok(game, 'the game is in the list')) {
    const others = M.GAMES.filter((g) => g.id !== 'number-maze')
    ok(game.slug.en === 'number-maze' && game.slug.id === 'labirin-angka' && others.every((o) => o.slug.en !== game.slug.en && o.slug.id !== game.slug.id), 'its addresses are its own')
    const section = (id) => game.sections.find((s) => s.id === id)
    for (const loc of ['en', 'id']) {
      const all = [game.answer, game.description, ...game.sections.map((s) => s.text), ...game.faq.map((f) => f.a)].map((x) => x[loc]).join('\n')
      ok(/\b100\b/.test(all), `${loc}: the text says 100 levels`)
      ok(!/(^|[^*\w])\*[^*\s][^*\n]*\*([^*]|$)/m.test(all), `${loc}: no *word* emphasis`)
      ok(!/\b(red|merah)\b/i.test(all), `${loc}: no red tiles in the text (red is for mistakes)`)
    }
    const ch = section('chapters')
    for (const [i, c] of M.CHAPTERS.entries())
      for (const loc of ['en', 'id']) ok(new RegExp(`\\| ${c.name[loc].replace(/[()]/g, '\\$&')} \\| ${c.levels.length} \\|`).test(ch.text[loc]), `the chapters table: "${c.name[loc]}" with ${c.levels.length} levels (${loc})`)
    ok(section('progress').text.en.includes('no step counter') && section('progress').text.id.includes('tidak ada penghitung langkah'), 'the page says that steps are not counted')
    ok(!all_text({ ...game, sections: game.sections.filter((x) => x.id !== 'progress') }).match(/\bstars?\b|bintang|shortest|terpendek/i), 'apart from the section that says there are none, the page speaks of no stars and no shortest way')
    ok(section('how-to-play') && section('the-tiles') && section('think-backwards') && game.faq.length >= 6 && game.teaches.length >= 4 && game.keywords.en.split(',').length >= 8, 'the sections, the FAQ and what it teaches')
    ok(game.seoTitle.en.length <= 72 && game.seoTitle.id.length <= 80 && game.description.en.length <= 420 && game.description.id.length <= 450 && /^\*\*/.test(game.answer.en) && /^\*\*/.test(game.answer.id), 'titles and descriptions are of a sensible length')
    // the claims about the tiles are the ones of the engine
    const tiles = section('the-tiles').text.en
    ok(/\*\*blue\*\*, solid border/.test(tiles) && /\*\*gold\*\*, dashed border/.test(tiles) && /\*\*green\*\*/.test(tiles), 'the table of tiles names the colors')
  }

  const page = read('src/pages/GamePage.tsx')
  ok(/import NumberMazeGame from '..\/components\/games\/NumberMazeGame'/.test(page) && /'number-maze': \(\) => <NumberMazeGame \/>/.test(page), 'the game page shows the game')
  ok(/GameId = [^\n]*'number-maze'/.test(read('src/content/games.ts')), 'GameId has the game')
  ok(/"check:numbermaze": "node tools\/check-numbermaze.mjs"/.test(read('package.json')) && /npm run check:numbermaze/.test(read('.github/workflows/deploy.yml')), 'the check is in package.json and in the deploy workflow')
  ok(M.COVER_IDS.includes('number-maze') && /<svg/.test(M.gameCoverSvg('number-maze')) && !/\d\.\d/.test(M.gameCoverSvg('number-maze')), 'the game has a cover, with no decimal point in it')

  const ui = read('src/components/games/NumberMazeGame.tsx')
  ok(/e\.key === 'z'/.test(ui) && /e\.key === 'r'/.test(ui) && /ArrowUp/.test(ui) && /onPointerDown/.test(ui) && /onKeyDown/.test(ui) && /nunada\.numbermaze\.v2/.test(ui), 'the keys, the swipe and the saved progress are wired')
  ok(/aria-live="polite"/.test(ui) && /role="application"/.test(ui) && /aria-label=\{t\(`The maze/.test(ui) && /sr-only/.test(ui), 'a screen reader is told the value, the place and why a step was refused')
  ok(/solve\(level, \{ pos: g\.pos/.test(ui) && !/starsFor|Stars|nmstars|nmcount|g\.moves|data\.par/.test(ui), 'the screen counts no steps, shows no shortest way and gives no stars; the hint uses the solver')

  const css = read('src/styles.css')
  const nmAt = css.indexOf('/* ---- Number Maze.')
  const nmEnd = css.indexOf('/* ---- ', nmAt + 10)
  const nm = css.slice(nmAt, nmEnd < 0 ? undefined : nmEnd)
  ok(nm.length > 1500, 'the styles of the game')
  ok((nm.match(/--nm-purple:/g) ?? []).length === 3 && /prefers-color-scheme: dark/.test(nm) && /data-theme="dark"/.test(nm), 'the purple of the third key is defined for light, dark by system and dark by choice')
  ok(!/--bad/.test(nm.replace(/\.nmnote\.on \{[^}]*\}/, '')) && !/--fig-b/.test(nm) && !/\bred\b/.test(nm.replace(/never by red[^.]*\./, '').replace(/red in the games[^.]*\./, '')), 'red is used only for a refused step')
  ok(/\.nmt\.op\.once \{[^}]*dashed/.test(nm) && /\.nmt\.op \{[^}]*--rh-blue/.test(nm), 'a tile used up once is dashed gold and one that never runs out is solid blue')
  ok(/grid-template-columns: repeat\(var\(--cols\), var\(--cell\)\)/.test(nm) && /touch-action: none/.test(nm), 'the board is a grid of square tiles that does not scroll the page when swiped')
}

console.log(`numbermaze check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
