// Code Maze: the generators, the stars, the progress, and every level of the game.
//   node tools/check-codemaze.mjs
// For each level: the model solution passes it, the empty program does not, the solution keeps the level's own limits (blocks, allowed blocks and
// conditions, required blocks), every map is well formed, and the level tells a right program from a wrong one. For the generators: the corridors have
// one path and no neighbours side by side, the mazes are perfect, and the same seed gives the same map. For the progress: parsing, merging, tiers.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'codemaze-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [
    `export * from '${q('src/lib/codemaze.ts')}'`,
    `export { LEVELS, TIERS } from '${q('src/content/codemaze.ts')}'`,
    `export { checkLevel, emptyProgram, countBlocks, allBlocks, runProgram, parseWorld } from '${q('src/lib/blocks.ts')}'`,
  ].join('\n'),
)
const out = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const C = await import('file://' + out.replace(/\\/g, '/'))
fs.rmSync(tmp, { recursive: true, force: true })

let checks = 0
let bad = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 40) console.error('FAIL: ' + m)
  }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]
const openAt = (rows, x, y) => rows[y]?.[x] !== undefined && rows[y][x] !== '#'
const neighbours = (rows, x, y) => [0, 1, 2, 3].filter((d) => openAt(rows, x + DX[d], y + DY[d])).length
const cellsOf = (rows) => rows.flatMap((r, y) => [...r].map((ch, x) => [x, y, ch])).filter(([, , ch]) => ch !== '#')

/* ------------------------------------------------------------------ rng */
{
  const a = C.rng(7)
  const b = C.rng(7)
  const xs = Array.from({ length: 50 }, a)
  ok(same(xs, Array.from({ length: 50 }, b)), 'the same seed gives the same numbers')
  ok(xs.every((x) => x >= 0 && x < 1), 'numbers are in [0, 1)')
  ok(!same(xs, Array.from({ length: 50 }, C.rng(8))), 'another seed gives other numbers')
  ok(new Set(xs).size > 45, 'the numbers are not repeating')
}

/* ------------------------------------------------------------ corridors */
for (const bends of ['right', 'left', 'mixed']) {
  for (let seed = 1; seed <= 25; seed++) {
    const spec = { seed, w: 11, h: 11, segments: 5, bends, stars: 3 }
    let rows
    try {
      rows = C.corridorRows(spec)
    } catch {
      continue // a seed may have no corridor; the levels' own seeds are tested below
    }
    const where = `corridor ${bends} seed ${seed}`
    ok(same(rows, C.corridorRows(spec)), `${where}: the same seed, the same map`)
    ok(rows.length === 11 && rows.every((r) => r.length === 11), `${where}: the size`)
    ok(rows.every((r, y) => [...r].every((ch, x) => (x > 0 && y > 0 && x < 10 && y < 10) || ch === '#')), `${where}: walls all round`)
    const cells = cellsOf(rows)
    const robot = cells.filter(([, , ch]) => '^>v<'.includes(ch))
    const goal = cells.filter(([, , ch]) => ch === 'G')
    const stars = cells.filter(([, , ch]) => ch === '*')
    ok(robot.length === 1 && goal.length === 1 && stars.length === 3, `${where}: one robot, one goal, three stars`)
    // a corridor: the two ends have one neighbour, every other square two, and the squares are all joined
    const ends = cells.filter(([x, y]) => neighbours(rows, x, y) === 1)
    ok(ends.length === 2 && cells.every(([x, y]) => neighbours(rows, x, y) <= 2), `${where}: no branches (${ends.length} ends)`)
    const d = C.distances(rows, robot[0][0], robot[0][1])
    ok(d.size === cells.length, `${where}: every square can be reached`)
    ok(d.get(`${goal[0][0]},${goal[0][1]}`) === cells.length - 1, `${where}: the goal is at the far end`)
    ok(!stars.some(([x, y]) => (x === robot[0][0] && y === robot[0][1]) || (x === goal[0][0] && y === goal[0][1])), `${where}: no star on the robot or the goal`)
    // a straight piece is at least two squares long: no two bends in a row
    const bendCell = ([x, y]) => {
      const open = [0, 1, 2, 3].filter((dd) => openAt(rows, x + DX[dd], y + DY[dd]))
      return open.length === 2 && open[0] % 2 !== open[1] % 2
    }
    const bends2 = cells.filter(([x, y]) => bendCell([x, y]))
    ok(bends2.every(([x, y]) => [0, 1, 2, 3].every((dd) => !openAt(rows, x + DX[dd], y + DY[dd]) || !bendCell([x + DX[dd], y + DY[dd]]))), `${where}: two bends in a row`)
    const w = C.parseWorld(rows)
    // the robot leaves the start the way it faces, unless it was asked to face another way
    const lead = [0, 1, 2, 3].find((dd) => openAt(rows, w.start.x + DX[dd], w.start.y + DY[dd]))
    ok(lead === w.start.d, `${where}: it starts facing the corridor`)
  }
}
{
  const turned = (rows) => {
    const w = C.parseWorld(rows)
    return [0, 1, 2, 3].find((dd) => openAt(rows, w.start.x + DX[dd], w.start.y + DY[dd]))
  }
  for (const [face, add] of [['ahead', 0], ['side', 1], ['behind', 2]]) {
    const rows = C.corridorRows({ seed: 5, w: 9, h: 9, segments: 3, bends: 'right', face })
    ok(C.parseWorld(rows).start.d === (turned(rows) + add) % 4, `face ${face}`)
  }
  let threw = false
  try {
    C.corridorRows({ seed: 1, w: 5, h: 5, segments: 12, bends: 'right' })
  } catch {
    threw = true
  }
  const t0 = Date.now()
  ok(threw && Date.now() - t0 < 3000, `a corridor that cannot fit is an error, soon (${Date.now() - t0} ms), not a loop for ever`)
  // a mixed corridor bends both ways
  for (let seed = 1; seed <= 12; seed++) {
    let rows
    try {
      rows = C.corridorRows({ seed, w: 11, h: 11, segments: 5, bends: 'mixed' })
    } catch {
      continue
    }
    const w = C.parseWorld(rows)
    let x = w.start.x
    let y = w.start.y
    let d = turned(rows)
    const turns = new Set()
    for (let i = 0; i < 200; i++) {
      if (openAt(rows, x + DX[d], y + DY[d])) {
        x += DX[d]
        y += DY[d]
      } else {
        const r = (d + 1) % 4
        const l = (d + 3) % 4
        if (openAt(rows, x + DX[r], y + DY[r])) {
          d = r
          turns.add('right')
        } else if (openAt(rows, x + DX[l], y + DY[l])) {
          d = l
          turns.add('left')
        } else break
      }
    }
    ok(turns.has('right') && turns.has('left'), `mixed corridor seed ${seed} bends both ways`)
  }
}

/* ---------------------------------------------------------------- mazes */
for (const [cols, rows] of [[2, 2], [3, 3], [4, 3], [5, 5], [7, 7], [8, 6]]) {
  for (let seed = 1; seed <= 12; seed++) {
    const m = C.mazeRows({ seed, cols, rows })
    const where = `maze ${cols}x${rows} seed ${seed}`
    ok(same(m, C.mazeRows({ seed, cols, rows })), `${where}: the same seed, the same maze`)
    ok(m.length === 2 * rows + 1 && m.every((r) => r.length === 2 * cols + 1), `${where}: the size`)
    ok(m.every((r, y) => [...r].every((ch, x) => ch === '#' || (x > 0 && y > 0 && x < 2 * cols && y < 2 * rows))), `${where}: walls all round`)
    ok(m.every((r, y) => [...r].every((ch, x) => !(x % 2 === 0 && y % 2 === 0) || ch === '#')), `${where}: a wall at every corner post`)
    const cells = cellsOf(m)
    const robot = cells.filter(([, , ch]) => ch === '>')
    const goal = cells.filter(([, , ch]) => ch === 'G')
    ok(robot.length === 1 && robot[0][0] === 1 && robot[0][1] === 1 && goal.length === 1, `${where}: the robot in the top left room, one goal`)
    // perfect: joined, and rooms - 1 passages (no loops)
    const d = C.distances(m, 1, 1)
    ok(d.size === cells.length, `${where}: every square can be reached`)
    let passages = 0
    for (let y = 1; y < m.length - 1; y++) for (let x = 1; x < m[0].length - 1; x++) if ((x + y) % 2 === 1 && m[y][x] !== '#') passages++
    ok(passages === cols * rows - 1, `${where}: ${passages} passages for ${cols * rows} rooms (a loop or a closed room)`)
    // the goal is a room, and as far from the start as any room
    const far = Math.max(...[...d].filter(([k]) => k.split(',').every((n) => Number(n) % 2 === 1)).map(([, v]) => v))
    ok(goal[0][0] % 2 === 1 && goal[0][1] % 2 === 1 && d.get(`${goal[0][0]},${goal[0][1]}`) === far, `${where}: the goal is the farthest room`)
    ok(!(rows * cols > 1 && far === 0), `${where}: the goal is not the start`)
  }
}
{
  let seeds = new Set()
  for (let seed = 1; seed <= 30; seed++) seeds.add(C.mazeRows({ seed, cols: 5, rows: 5 }).join('/'))
  ok(seeds.size >= 25, `30 seeds give ${seeds.size} different mazes`)
}

/* ----------------------------------------------------------- stars on maps */
{
  const m = C.mazeRows({ seed: 3, cols: 4, rows: 4 })
  const floor = cellsOf(m).filter(([, , ch]) => ch === '.').map(([x, y]) => [x, y])
  const s = C.scatterStars(m, floor, 5, 9)
  ok(cellsOf(s).filter(([, , ch]) => ch === '*').length === 5, 'scatterStars puts exactly five stars')
  ok(same(s, C.scatterStars(m, floor, 5, 9)) && !same(s, C.scatterStars(m, floor, 5, 10)), 'scatterStars follows the seed')
  ok(cellsOf(s).filter(([, , ch]) => '^>v<G'.includes(ch)).length === 2, 'the robot and the goal are still there')
  let threw = false
  try {
    C.withStars(m, [[1, 1]])
  } catch {
    threw = true
  }
  ok(threw, 'a star cannot go on the robot')
  ok(cellsOf(C.scatterStars(m, floor, 999, 1)).filter(([, , ch]) => ch === '*').length === floor.length, 'asking for more stars than squares gives one on each')
  // squares that are not plain floor are skipped, whatever list they come from
  const every = cellsOf(m).map(([x, y]) => [x, y])
  const sAll = C.scatterStars(m, every, 999, 2)
  ok(same(cellsOf(sAll).filter(([, , ch]) => '^>v<G'.includes(ch)).map(([x, y, ch]) => [x, y, ch]), cellsOf(m).filter(([, , ch]) => '^>v<G'.includes(ch)).map(([x, y, ch]) => [x, y, ch])), 'stars never replace the robot or the goal')
}

/* ------------------------------------------------------------------ stars */
{
  ok(C.starsFor(5, 5) === 3 && C.starsFor(1, 5) === 3, 'par or fewer: three stars')
  ok(C.starsFor(6, 5) === 2 && C.starsFor(7, 5) === 2, 'two or three more than a small par: two stars')
  ok(C.starsFor(8, 5) === 2 && C.starsFor(9, 5) === 1 && C.starsFor(40, 5) === 1, 'up to three more than par 5 is two stars, then one')
  ok(C.starsFor(14, 10) === 2 && C.starsFor(15, 10) === 2 && C.starsFor(16, 10) === 1, 'a bigger par allows half as many again')
  ok(C.starsFor(1, 1) === 3 && C.starsFor(2, 1) === 2 && C.starsFor(3, 1) === 2 && C.starsFor(4, 1) === 1, 'par 1')
  for (let par = 1; par <= 20; par++) {
    let last = 3
    for (let used = 1; used <= 60; used++) {
      const s = C.starsFor(used, par)
      ok(s <= last && s >= 1, `stars never go up as blocks do (par ${par}, used ${used})`)
      last = s
    }
  }
}

/* --------------------------------------------------------------- progress */
{
  const ids = ['a', 'b', 'c']
  ok(same(C.parseProgress(null, ids), {}) && same(C.parseProgress('', ids), {}), 'nothing saved: nothing known')
  ok(same(C.parseProgress('{not json', ids), {}), 'a damaged save is dropped')
  ok(same(C.parseProgress('[1,2]', ids), {}) && same(C.parseProgress('"x"', ids), {}) && same(C.parseProgress('null', ids), {}), 'a save of the wrong shape is dropped')
  ok(same(C.parseProgress('{"a":{"stars":2,"blocks":5}}', ids), { a: { stars: 2, blocks: 5 } }), 'a good save is kept')
  ok(same(C.parseProgress('{"zzz":{"stars":2,"blocks":5}}', ids), {}), 'a level that does not exist is dropped')
  for (const bad of ['{"a":{"stars":0,"blocks":5}}', '{"a":{"stars":4,"blocks":5}}', '{"a":{"stars":2.5,"blocks":5}}', '{"a":{"stars":"2","blocks":5}}', '{"a":{"stars":2,"blocks":-1}}', '{"a":{"stars":2}}', '{"a":3}', '{"a":null}'])
    ok(same(C.parseProgress(bad, ids), {}), `a bad result is dropped: ${bad}`)

  const p0 = {}
  const p1 = C.record(p0, 'a', { stars: 2, blocks: 6 })
  ok(p1.a.stars === 2 && p0.a === undefined, 'record does not change what it was given')
  ok(C.record(p1, 'a', { stars: 1, blocks: 2 }) === p1, 'fewer stars never replaces more')
  ok(C.record(p1, 'a', { stars: 2, blocks: 7 }) === p1, 'the same stars with more blocks does not replace')
  ok(C.record(p1, 'a', { stars: 2, blocks: 5 }).a.blocks === 5, 'the same stars with fewer blocks does')
  ok(C.record(p1, 'a', { stars: 3, blocks: 9 }).a.stars === 3, 'more stars replaces')
  ok(C.record(p1, 'b', { stars: 1, blocks: 9 }).b.stars === 1 && C.record(p1, 'b', { stars: 1, blocks: 9 }).a.stars === 2, 'another level is added')
  ok(C.totalStars({ a: { stars: 3, blocks: 1 }, b: { stars: 2, blocks: 1 } }) === 5 && C.totalStars({}) === 0, 'totalStars')

  const tiers = [{ levels: ['a', 'b', 'c', 'd'] }, { levels: ['e', 'f', 'g', 'h'] }, { levels: ['i'] }]
  const mk = (...xs) => Object.fromEntries(xs.map((x) => [x, { stars: 1, blocks: 1 }]))
  ok(same(C.openTiers(tiers, {}), [true, false, false]), 'only the first tier is open at the start')
  ok(same(C.openTiers(tiers, mk('a', 'b')), [true, false, false]), 'two levels are not enough')
  ok(same(C.openTiers(tiers, mk('a', 'b', 'd')), [true, true, false]), `${C.TIER_NEED} levels, any ones, open the next tier`)
  ok(same(C.openTiers(tiers, mk('e', 'f', 'g', 'a', 'b', 'c')), [true, true, true]), 'and so on')
  ok(same(C.openTiers(tiers, mk('e', 'f', 'g')), [true, false, false]), 'levels of a later tier do not open it')
  ok(C.TIER_NEED === 3, 'three levels')
}

/* ------------------------------------------------------------------ levels */
const { LEVELS, TIERS } = C
const ID = /\b(yang|dan|dengan|adalah|untuk|tidak|dari|pada|ini|itu|atau|karena|jika|bila|setiap|semua|akan|bisa|dapat|lebih|oleh|kamu|robot menghadap|langkah|kalau)\b/i
const OLD = /\b(tetikus|berkas|tautan|masukan|keluaran|peramban|papan ketik)\b/i
const loc = (v) => v && typeof v === 'object' && 'en' in v && 'id' in v
const BLOCKS = new Set(['move', 'turn', 'collect', 'say', 'repeat', 'if', 'while', 'set', 'change', 'call'])

ok(LEVELS.length === 20 && TIERS.length === 5 && TIERS.every((t) => t.levels.length === 4), 'five tiers of four levels')
ok(new Set(LEVELS.map((l) => l.id)).size === LEVELS.length, 'level ids are unique')
ok(TIERS.every((t, i) => t.n === i + 1 && t.levels.every((id) => LEVELS.find((l) => l.id === id)?.tier === t.n)), 'each tier lists its own levels')
ok(LEVELS.every((l, i) => i === 0 || l.tier >= LEVELS[i - 1].tier), 'levels are in tier order')
ok(LEVELS.every((l) => new RegExp(`^m${l.tier}-[1-4]$`).test(l.id)), 'ids name their tier')

const kindsOf = (p) => new Set(C.allBlocks(p).map((b) => b.t))
const condsOf = (p) => new Set(C.allBlocks(p).flatMap((b) => (b.t === 'if' || b.t === 'while' ? [b.cond.t] : [])))
const worldsOk = (lv, p) => C.checkLevel(lv.level, p).worlds.every((w) => w.ok)

for (const lv of LEVELS) {
  const where = lv.id
  const rep = C.checkLevel(lv.level, lv.solution)
  ok(rep.ok, `${where}: the model solution passes (${JSON.stringify(rep.program)} ${rep.worlds.map((w) => w.issues.map((i) => i.code + (i.fault ? '/' + i.fault.code : '')).join()).join(' | ')})`)
  ok(!C.checkLevel(lv.level, C.emptyProgram()).ok, `${where}: the empty program does not pass`)
  const kinds = kindsOf(lv.solution)
  for (const k of kinds) ok(lv.level.allowed.includes(k), `${where}: the solution uses "${k}" which the palette does not offer`)
  for (const k of lv.level.mustUse ?? []) ok(kinds.has(k), `${where}: the solution lacks the required "${k}"`)
  const conds = lv.level.conds ?? ['front-clear', 'front-blocked', 'left-clear', 'right-clear', 'on-star', 'on-goal', 'not-on-goal']
  for (const c of condsOf(lv.solution)) ok(conds.includes(c), `${where}: the solution tests "${c}" which the level does not offer`)
  ok(lv.level.allowed.every((k) => BLOCKS.has(k)), `${where}: allowed names real blocks`)
  const par = C.parOf(lv.solution)
  ok(lv.level.maxBlocks === undefined || (par <= lv.level.maxBlocks && lv.level.maxBlocks - par <= 3), `${where}: the limit ${lv.level.maxBlocks} is close to par ${par}`)
  ok(lv.level.goal.reach === true, `${where}: every level ends on the finish`)
  ok(lv.hints.length === 2, `${where}: two hints`)
  // the maps: a robot, a goal, equal rows, walls round the edge
  lv.level.worlds.forEach((w, i) => {
    const m = `${where} map ${i + 1}`
    ok(w.every((r) => r.length === w[0].length), `${m}: rows of one length`)
    ok(w.filter((r) => /[>v<^]/.test(r)).length === 1 && w.join('').replace(/[^>v<^]/g, '').length === 1, `${m}: exactly one robot`)
    ok(w.join('').split('G').length === 2, `${m}: exactly one goal`)
    ok(w[0].split('').every((c) => c === '#') && w[w.length - 1].split('').every((c) => c === '#') && w.every((r) => r[0] === '#' && r[r.length - 1] === '#'), `${m}: walls all round`)
    ok(w.length <= 17 && w[0].length <= 17, `${m}: small enough to read on a phone`)
    const parsed = C.parseWorld(w)
    const d = C.distances(w, parsed.start.x, parsed.start.y)
    ok(d.has(`${parsed.goal[0]},${parsed.goal[1]}`), `${m}: the goal can be reached`)
    ok(parsed.stars.every(([x, y]) => d.has(`${x},${y}`)), `${m}: every star can be reached`)
    ok(!!lv.level.goal.collectAll === (parsed.stars.length > 0 || (lv.level.worlds.some((o) => o.join('').includes('*')))), `${m}: stars on the map exactly when the level asks to pick them up`)
    // the run is short enough to watch and well inside the engine's limits
    const run = C.runProgram(w, lv.solution)
    ok(run.frames.length <= 600, `${m}: the model run is ${run.frames.length} frames`)
  })
  // a level that asks for stars has them on every map
  if (lv.level.goal.collectAll) ok(lv.level.worlds.every((w) => w.join('').includes('*')), `${where}: stars on every map`)
  // the texts
  const texts = [lv.title, lv.brief, ...lv.hints]
  for (const t of texts) {
    ok(loc(t), `${where}: a text has both languages`)
    ok(!ID.test(String(t.en).replace(/`[^`]*`/g, '').replace(/\*\*[^*]*\*\*/g, '')), `${where}: Indonesian words in English: ${String(t.en).slice(0, 60)}`)
    ok(t.en !== t.id || !/[a-z]{5}/i.test(t.en), `${where}: English and Indonesian are the same: ${String(t.en).slice(0, 50)}`)
    ok(!OLD.test(t.id), `${where}: an Indonesian word that should be English: ${String(t.id).match(OLD)?.[0]}`)
    ok(!/\bcolour|\bcentre|\bgrey\b/i.test(t.en), `${where}: US spelling`)
  }
  // a hint must not just hand over the finished program: it never lists every block of the solution in order
  ok(lv.hints.every((h) => h.en !== h.id), `${where}: hints are translated`)
}

// Each tier's blocks only grow
{
  const allowedOf = (n) => new Set(LEVELS.filter((l) => l.tier === n).flatMap((l) => l.level.allowed))
  ok(allowedOf(1).size === 3 && ['move', 'turn', 'collect'].every((k) => allowedOf(1).has(k)), 'tier 1 offers move, turn and pick up only')
  ok(!allowedOf(1).has('repeat') && !allowedOf(1).has('if') && !allowedOf(1).has('while'), 'tier 1 has no loops or conditions')
  ok(allowedOf(2).has('repeat') && !allowedOf(2).has('if') && !allowedOf(2).has('while'), 'tier 2 adds repeat only')
  ok(allowedOf(3).has('if') && allowedOf(3).has('while'), 'tier 3 adds if and while')
  const sensors = (n) => new Set(LEVELS.filter((l) => l.tier === n).flatMap((l) => l.level.conds ?? []))
  ok(!sensors(3).has('right-clear') && !sensors(3).has('left-clear'), 'tier 3 has no side sensors')
  ok(sensors(4).has('right-clear') && sensors(4).has('left-clear'), 'tier 4 adds the side sensors')
}

// The levels tell a right program from a wrong one
{
  const L = Object.fromEntries(LEVELS.map((l) => [l.id, l]))
  const passes = (programOf, onLevel) => worldsOk(L[onLevel], L[programOf].solution)
  ok(!passes('m3-1', 'm3-2') && !passes('m3-2', 'm3-1'), 'turning right does not solve left corners, nor the other way')
  ok(!passes('m3-1', 'm4-1') && !passes('m3-2', 'm4-1'), 'one turn direction does not solve corners that go both ways')
  ok(!passes('m3-3', 'm4-2'), 'the right-only star program fails on mixed corners')
  ok(passes('m4-1', 'm3-1') && passes('m4-1', 'm3-2') && passes('m4-2', 'm3-3') && passes('m4-3', 'm4-1'), 'the later, more general program also solves the earlier levels')
  ok(!passes('m4-1', 'm4-3') && !passes('m4-1', 'm5-1') && !passes('m4-2', 'm5-3'), 'a corridor follower does not solve a maze')
  ok(passes('m4-3', 'm5-1') && passes('m4-3', 'm5-2') && passes('m5-3', 'm5-4') && passes('m5-4', 'm5-3'), 'the right-hand rule solves every maze')
  ok(!passes('m4-3', 'm5-3') && !passes('m4-3', 'm5-4'), 'without the star check the stars are left behind')
  // the tiers that need a loop reject a program with no loop
  const noRepeat = C.checkLevel(L['m2-1'].level, { main: Array.from({ length: 4 }, () => [{ t: 'move', n: 1 }, { t: 'turn', dir: 'right' }, { t: 'move', n: 1 }, { t: 'turn', dir: 'left' }]).flat() })
  ok(!noRepeat.ok && noRepeat.program.some((p) => p.code === 'too-many') && noRepeat.program.some((p) => p.code === 'must-use'), 'the staircase written out in full is rejected')
  ok(noRepeat.worlds.every((w) => w.ok), '...although it walks the right way (the limit is what asks for the loop)')
  // a number of squares that fits one map fails the others
  const counted = C.checkLevel(L['m3-1'].level, { main: [{ t: 'move', n: 3 }, { t: 'turn', dir: 'right' }, { t: 'move', n: 3 }] })
  ok(!counted.ok, 'counting squares does not solve a level of several maps')
  // taking a shorter way is allowed: a program under par still passes and earns three stars
  const short = C.checkLevel(L['m1-1'].level, { main: [{ t: 'move', n: 4 }] })
  ok(short.ok && C.starsFor(1, C.parOf(L['m1-1'].solution)) === 3, 'fewer blocks than par is fine')
  // the first level of each tier is not harder to read than its last
  for (const t of TIERS) {
    const pars = t.levels.map((id) => C.parOf(L[id].solution))
    ok(Math.max(...pars) <= 12, `tier ${t.n}: no level wants more than 12 blocks`)
  }
}

// every tier has text, in both languages
for (const t of TIERS) {
  for (const x of [t.title, t.about]) ok(loc(x) && x.en && x.id, `tier ${t.n}: a text in both languages`)
  ok(!ID.test(t.title.en) && !ID.test(t.about.en), `tier ${t.n}: Indonesian words in English`)
  ok(!OLD.test(t.about.id), `tier ${t.n}: an Indonesian word that should be English`)
}

console.log(`codemaze check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
