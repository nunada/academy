// Hashi: src/lib/hashi.ts (the rules, the solver, the hints), src/content/hashi.ts (the 40 puzzles) and the page text.
//   node tools/check-hashi.mjs
//
// Nothing is taken on trust from the engine:
//   - the map is read again here from the rows of the data (which islands see each other, which bridges would cross), and a second solver is written on that: it decides how many
//     bridges go on each place one after the other, and an island must be complete as soon as its last place is decided; the engine's solver reasons with bounds on all places at once.
//     Every puzzle must have exactly one answer for both, and it is the answer in the data;
//   - on thousands of random small puzzles (most of which have no answer, or several) the engine's solver, this one and a plain count over every way of building must agree;
//   - the rules on a built map ("solved", and every kind of conflict) are written again here and compared on thousands of maps: the answer with mistakes put in, and noise;
//   - what the hint can deduce is checked against the answer: from bridges that are right it may never say anything that is not so;
//   - the texts, the wiring, the styles and the saved progress.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hashi-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [
    `export * from '${q('src/lib/hashi.ts')}'`,
    `export * from '${q('src/content/hashi.ts')}'`,
    `export { GAMES } from '${q('src/content/games.ts')}'`,
    `export { COVER_IDS, gameCoverSvg } from '${q('src/content/gamecovers.ts')}'`,
  ].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const N = await import('file://' + outFile.split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

let bad = 0
let checks = 0
const t00 = Date.now()
const lap = (name) => process.env.TIMES && console.log(`${name}: ${((Date.now() - t00) / 1000).toFixed(1)} s`)
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 40) console.error('FAIL: ' + m)
  }
  return c
}
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')

let seedState = 4242
const rand = () => {
  seedState = (seedState + 0x6d2b79f5) >>> 0
  let t = seedState
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rint = (n) => Math.floor(rand() * n)

/* ------------------------------------------------------------------------------------------- the map, read again here */
/** From the rows of numbers: the islands (reading order), the places for bridges (an island and the nearest island to its right, and below it) with the cells between. */
function readMap(rows) {
  const h = rows.length
  const w = rows[0].trim().split(/\s+/).length
  const islands = []
  const grid = []
  for (let y = 0; y < h; y++) {
    const cells = rows[y].trim().split(/\s+/)
    grid.push(cells)
    cells.forEach((c, x) => c !== '.' && islands.push({ x, y, n: Number(c) }))
  }
  const index = (x, y) => islands.findIndex((i) => i.x === x && i.y === y)
  const places = []
  for (let a = 0; a < islands.length; a++) {
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      let x = islands[a].x + dx
      let y = islands[a].y + dy
      const cells = []
      while (x < w && y < h && grid[y][x] === '.') {
        cells.push(y * w + x)
        x += dx
        y += dy
      }
      if (x < w && y < h) places.push({ a, b: index(x, y), cells, horizontal: dx === 1 })
    }
  }
  const cross = (i, j) => places[i].horizontal !== places[j].horizontal && places[i].cells.some((c) => places[j].cells.includes(c))
  return { w, h, islands, places, cross }
}
/** Is this a right answer: counts per place (in the order of `places`)? */
function validBuild(map, counts) {
  const { islands, places, cross } = map
  if (counts.some((c) => c < 0 || c > 2)) return false
  const deg = islands.map(() => 0)
  places.forEach((p, i) => {
    deg[p.a] += counts[i]
    deg[p.b] += counts[i]
  })
  if (islands.some((is, i) => deg[i] !== is.n)) return false
  for (let i = 0; i < places.length; i++) if (counts[i] > 0) for (let j = i + 1; j < places.length; j++) if (counts[j] > 0 && cross(i, j)) return false
  return connectedIslands(map, counts)
}
function connectedIslands(map, counts) {
  const { islands, places } = map
  const seen = new Set([0])
  const stack = [0]
  while (stack.length) {
    const a = stack.pop()
    places.forEach((p, i) => {
      if (counts[i] === 0) return
      const o = p.a === a ? p.b : p.b === a ? p.a : -1
      if (o >= 0 && !seen.has(o)) (seen.add(o), stack.push(o))
    })
  }
  return seen.size === islands.length
}

/* ------------------------------------------------------------------------------------------- the second solver */
/** The answers of a map, up to `limit`: places decided one after the other. */
function solveInOrder(map, limit, maxNodes = 5_000_000) {
  const { islands, places, cross } = map
  const m = places.length
  const rest = islands.map(() => 0)
  const lastPlace = islands.map(() => -1)
  const left = islands.map(() => 0) // places not decided yet, per island
  places.forEach((p, i) => {
    left[p.a]++
    left[p.b]++
    lastPlace[p.a] = i
    lastPlace[p.b] = i
  })
  islands.forEach((is, i) => (rest[i] = is.n))
  const crossList = places.map((_, i) => places.map((__, j) => j).filter((j) => j !== i && cross(i, j)))
  const counts = new Array(m).fill(0)
  const found = []
  let nodes = 0
  let exhausted = false
  const rec = (i) => {
    if (found.length >= limit || exhausted) return
    if (++nodes > maxNodes) {
      exhausted = true
      return
    }
    if (i === m) {
      if (rest.every((r) => r === 0) && connectedIslands(map, counts)) found.push(counts.slice())
      return
    }
    const { a, b } = places[i]
    left[a]--
    left[b]--
    for (let v = 0; v <= 2; v++) {
      if (v > rest[a] || v > rest[b]) break
      if (v > 0 && crossList[i].some((j) => j < i && counts[j] > 0)) break
      counts[i] = v
      rest[a] -= v
      rest[b] -= v
      // what is left at an island has to fit in the places that are not decided yet (two bridges each at most)
      if (rest[a] <= 2 * left[a] && rest[b] <= 2 * left[b]) rec(i + 1)
      rest[a] += v
      rest[b] += v
      counts[i] = 0
      if (found.length >= limit || exhausted) break
    }
    left[a]++
    left[b]++
  }
  rec(0)
  return { found, nodes, exhausted }
}

/** The plain count: every way of building (0, 1 or 2 on each place). */
function bruteCount(map, limit) {
  const m = map.places.length
  let count = 0
  const counts = new Array(m).fill(0)
  const rec = (i) => {
    if (count >= limit) return
    if (i === m) {
      if (validBuild(map, counts)) count++
      return
    }
    for (let v = 0; v <= 2; v++) {
      counts[i] = v
      rec(i + 1)
    }
    counts[i] = 0
  }
  rec(0)
  return count
}

/** The engine's puzzle for a map and an answer (links in the order of the engine's own places are found by islands). */
const enginePuzzle = (rows, links) => N.parsePuzzle('t', rows, links)
/** the answer of a map as [island, island, count] */
const linksOf = (map, counts) => map.places.map((p, i) => [p.a, p.b, counts[i]]).filter(([, , c]) => c > 0)

/* ------------------------------------------------------------------------------------------- the puzzles */
const TIERS = N.TIER_LIST
{
  ok(TIERS.length === 5 && TIERS.every((t) => t.levels.length === 8), `five sizes of 8 puzzles (${TIERS.map((t) => t.levels.length)})`)
  ok(N.ALL_PUZZLES.length === 40 && new Set(N.PUZZLE_IDS).size === 40, 'forty puzzles with ids of their own')
  ok(N.PUZZLE_IDS.every((id) => /^h(5|7|9|11|13)-0[1-8]$/.test(id)), 'the ids are h5-01 .. h13-08')
  const seenRows = new Set()
  let search = 0
  for (const tier of TIERS) {
    let lastNodes = 0
    let lastRounds = 0
    for (const lv of tier.levels) {
      let p
      try {
        p = N.parsePuzzle(lv.id, lv.rows, lv.links)
      } catch (e) {
        ok(false, `${lv.id}: cannot be read: ${e.message}`)
        continue
      }
      ok(p.w === tier.size && p.h === tier.size, `${lv.id}: ${p.w}x${p.h} in a tier of ${tier.size}x${tier.size}`)
      ok(!seenRows.has(lv.rows.join('|')), `${lv.id}: a puzzle that is not a copy of another`)
      seenRows.add(lv.rows.join('|'))
      const map = readMap(lv.rows)
      // the map as the engine reads it is the map as it is read here
      ok(p.islands.length === map.islands.length && p.edges.length === map.places.length, `${lv.id}: ${p.islands.length} islands and ${p.edges.length} places, here ${map.islands.length} and ${map.places.length}`)
      ok(p.edges.every((e, i) => e.a === map.places[i].a && e.b === map.places[i].b && e.horizontal === map.places[i].horizontal && e.cells.join() === map.places[i].cells.join()), `${lv.id}: the places for bridges are the same as read here`)
      ok(p.edges.every((e) => e.cells.length >= 1), `${lv.id}: every pair of islands that see each other has room for a bridge between them`)
      let crossingsAgree = true
      p.edges.forEach((_, i) => {
        const here = map.places.map((__, j) => j).filter((j) => j !== i && map.cross(i, j))
        if (here.slice().sort((x, y) => x - y).join() !== p.crossing[i].slice().sort((x, y) => x - y).join()) crossingsAgree = false
      })
      ok(crossingsAgree, `${lv.id}: the bridges that would cross are the same as found here`)
      ok(validBuild(map, p.solution), `${lv.id}: the answer in the data keeps every rule (own rules)`)
      ok(p.islands.length >= 3 && p.islands.every((is) => is.n >= 1 && is.n <= 8), `${lv.id}: islands with numbers from 1 to 8`)

      // the engine's solver: one answer, the one in the data
      const e = N.solvePuzzle(p, 2, 500_000)
      ok(e.count === 1 && !e.exhausted, `${lv.id}: the engine finds ${e.count} answers (exhausted ${e.exhausted}), not exactly one`)
      ok(e.solution && e.solution.join() === p.solution.join(), `${lv.id}: the engine's answer is the one in the data`)
      ok(tier.levels.indexOf(lv) === 0 || e.nodes > lastNodes || (e.nodes === lastNodes && e.rounds >= lastRounds), `${lv.id}: the puzzles of a size climb (${e.nodes} positions and ${e.rounds} rounds after ${lastNodes} and ${lastRounds})`)
      lastNodes = e.nodes
      lastRounds = e.rounds
      if (e.nodes > 1) search++

      // the second solver
      const r = solveInOrder(map, 2)
      ok(!r.exhausted && r.found.length === 1, `${lv.id}: the solver that goes place by place finds ${r.found.length} answers (exhausted ${r.exhausted}), not exactly one`)
      if (r.found.length === 1) ok(r.found[0].join() === p.solution.join(), `${lv.id}: the answer of the second solver is the one in the data`)
    }
  }
  ok(search >= 10, `${search} puzzles need more than reasoning one step at a time (a search)`)
}

lap('puzzles')
/* ------------------------------------------------------------------------------------------- the solvers against each other and against a plain count */
{
  let agree = 0
  let withAnswers = 0
  let several = 0
  const trial = (w, h, k) => {
    // k islands that do not touch, put one after another in line with an island that is already there
    const grid = Array.from({ length: h }, () => new Array(w).fill('.'))
    const at = [{ x: rint(w), y: rint(h) }]
    grid[at[0].y][at[0].x] = '1'
    for (let guard = 0; at.length < k && guard < 100; guard++) {
      const base = at[rint(at.length)]
      const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][rint(4)]
      const len = 2 + rint(2)
      const x = base.x + dx * len
      const y = base.y + dy * len
      if (x < 0 || y < 0 || x >= w || y >= h || grid[y][x] !== '.') continue
      let clear = true
      for (let step = 1; step < len; step++) if (grid[base.y + dy * step][base.x + dx * step] !== '.') clear = false
      if (!clear || at.some((o) => Math.abs(o.x - x) + Math.abs(o.y - y) === 1)) continue
      grid[y][x] = '1'
      at.push({ x, y })
    }
    const rows0 = grid.map((r) => r.join(' '))
    const map0 = readMap(rows0)
    if (map0.places.length > 9 || map0.places.some((p) => p.cells.length === 0)) return
    // numbers that come from random bridges, so that most puzzles have an answer; sometimes one number is changed, so that there may be none
    let deg = null
    for (let attempt = 0; attempt < 40 && !deg; attempt++) {
      const counts = map0.places.map(() => (rand() < 0.4 ? 0 : 1 + rint(2)))
      for (let i = 0; i < counts.length; i++) if (counts[i] > 0) for (let j = 0; j < i; j++) if (counts[j] > 0 && map0.cross(i, j)) counts[i] = 0
      const d = map0.islands.map(() => 0)
      map0.places.forEach((p, i) => {
        d[p.a] += counts[i]
        d[p.b] += counts[i]
      })
      if (d.every((v) => v >= 1 && v <= 8)) deg = d
    }
    if (!deg) return
    if (rand() < 0.2) deg[rint(deg.length)] = 1 + rint(4)
    map0.islands.forEach((is, i) => (grid[is.y][is.x] = String(deg[i])))
    const rows = grid.map((r) => r.join(' '))
    const map = readMap(rows)
    const ans = bruteCount(map, 4)
    const second = solveInOrder(map, 4)
    const layout = N.layout(w, h, map.islands)
    const p = { id: 't', w, h, islands: map.islands, ...layout, solution: layout.edges.map(() => 0) }
    const e = N.solvePuzzle(p, 4, 200_000)
    if (!ok(!e.exhausted && !second.exhausted, `${rows.join(' / ')}: a search was cut short`)) return
    const same = e.count === ans && second.found.length === ans
    ok(same, `${rows.join(' / ')}: engine ${e.count}, place by place ${second.found.length}, plain count ${ans}`)
    if (same) agree++
    if (ans >= 1) withAnswers++
    if (ans >= 2) several++
  }
  for (let t = 0; t < 900; t++) trial(5, 5, 3 + rint(4))
  for (let t = 0; t < 500; t++) trial(6, 5, 4 + rint(4))
  ok(withAnswers >= 150 && several >= 15, `the random puzzles have answers (${withAnswers}) and several answers (${several}) often enough to mean something; they agreed on ${agree}`)
}

lap('solvers vs plain count')
/* ------------------------------------------------------------------------------------------- the rules on a built map */
{
  const kinds = new Set()
  let boards = 0
  let solvedBoards = 0
  for (const tier of TIERS.slice(0, 4)) {
    for (const lv of tier.levels) {
      const p = N.parsePuzzle(lv.id, lv.rows, lv.links)
      const map = readMap(lv.rows)
      const m = p.edges.length
      for (let b = 0; b < 40; b++) {
        const br = p.solution.slice()
        const mode = b % 4
        if (mode >= 1) {
          const flips = 1 + rint(mode === 1 ? 1 : mode === 2 ? 3 : 8)
          for (let f = 0; f < flips; f++) br[rint(m)] = rint(3)
        }
        if (b === 39) for (let i = 0; i < m; i++) br[i] = rint(3)
        boards++
        const a = N.analyze(p, br)
        const should = validBuild(map, br)
        if (!ok(a.solved === should, `${lv.id} board ${b}: the engine says solved=${a.solved}, the rules say ${should}`)) continue
        if (a.solved) solvedBoards++
        if (a.solved) ok(a.conflicts.length === 0, `${lv.id} board ${b}: solved with conflicts`)
        const deg = map.islands.map(() => 0)
        map.places.forEach((pl, i) => {
          deg[pl.a] += br[i]
          deg[pl.b] += br[i]
        })
        // every kind of conflict, against the rules written here
        const tooMany = new Set(map.islands.map((is, i) => i).filter((i) => deg[i] > map.islands[i].n))
        const engineTooMany = new Set(a.conflicts.filter((c) => c.kind === 'too-many').flatMap((c) => c.items))
        ok([...tooMany].sort().join() === [...engineTooMany].sort().join(), `${lv.id} board ${b}: too many bridges at ${[...tooMany]} but the engine says ${[...engineTooMany]}`)
        const crossPairs = []
        for (let i = 0; i < m; i++) if (br[i] > 0) for (let j = i + 1; j < m; j++) if (br[j] > 0 && map.cross(i, j)) crossPairs.push(`${i},${j}`)
        const engineCross = a.conflicts.filter((c) => c.kind === 'cross').map((c) => c.items.slice().sort((x, y) => x - y).join())
        ok(crossPairs.sort().join('|') === engineCross.sort().join('|'), `${lv.id} board ${b}: crossings ${crossPairs} but the engine says ${engineCross}`)
        for (const c of a.conflicts) kinds.add(c.kind)
        // split: a group of islands that are all full, cut off from the others
        const comps = []
        const seen = new Set()
        for (let s = 0; s < map.islands.length; s++) {
          if (seen.has(s)) continue
          const g = [s]
          seen.add(s)
          for (let k = 0; k < g.length; k++)
            map.places.forEach((pl, i) => {
              if (br[i] === 0) return
              const o = pl.a === g[k] ? pl.b : pl.b === g[k] ? pl.a : -1
              if (o >= 0 && !seen.has(o)) (seen.add(o), g.push(o))
            })
          comps.push(g)
        }
        const splitGroups = comps.length > 1 ? comps.filter((g) => g.every((i) => deg[i] === map.islands[i].n)).map((g) => g.slice().sort((x, y) => x - y).join()) : []
        const engineSplit = a.conflicts.filter((c) => c.kind === 'split').map((c) => c.items.slice().sort((x, y) => x - y).join())
        ok(splitGroups.sort().join('|') === engineSplit.sort().join('|'), `${lv.id} board ${b}: cut-off groups ${splitGroups} but the engine says ${engineSplit}`)
      }
    }
  }
  ok(solvedBoards >= 30, `${solvedBoards} of ${boards} boards were solved (the right answer, and the answer after a change that was not one)`)
  ok(['too-many', 'cross', 'split'].every((k) => kinds.has(k)), `every kind of conflict was met on the boards (${[...kinds]})`)

  // hand-made maps: a row of three islands, 1 - 2 - 1
  const line = N.parsePuzzle('l', ['1 . 2 . 1'], [[0, 1, 1], [1, 2, 1]])
  ok(N.analyze(line, line.solution).solved, 'a row 1 - 2 - 1 with a bridge on each side is solved')
  ok(!N.analyze(line, [1, 0]).solved && N.analyze(line, [1, 0]).conflicts.length === 0, 'half of the bridges is not solved and no conflict yet')
  ok(N.analyze(line, [2, 1]).conflicts.some((c) => c.kind === 'too-many'), 'two bridges at a 1 are too many')
  ok(!N.analyze(line, N.emptyBridges(line)).solved && N.analyze(line, N.emptyBridges(line)).conflicts.length === 0, 'an empty map is not solved and has no conflict')
  const four = N.parsePuzzle('f', ['2 . 2', '. . .', '2 . 2'], [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 1]])
  ok(N.analyze(four, four.solution).solved, 'a square of four 2s is solved with a bridge on each side')
  ok(!N.analyze(four, [1, 1, 1, 0]).solved && N.analyze(four, [1, 1, 1, 0]).conflicts.length === 0, 'a bridge missing is not solved, and no conflict yet')
  // a cross: two bridges that would cross at the middle
  const cross = { islands: [{ x: 1, y: 0, n: 1 }, { x: 0, y: 1, n: 1 }, { x: 2, y: 1, n: 1 }, { x: 1, y: 2, n: 1 }], w: 3, h: 3 }
  const pc = { id: 'c', ...cross, ...N.layout(3, 3, cross.islands), solution: [0, 0] }
  ok(pc.edges.length === 2 && pc.crossing[0].join() === '1' && pc.crossing[1].join() === '0', 'two places that cross are known to cross')
  ok(N.analyze(pc, [1, 1]).conflicts.some((c) => c.kind === 'cross'), 'two bridges that cross are a conflict')
  ok(N.canBuild(pc, [1, 0], 1) === false && N.canBuild(pc, [0, 0], 1) === true && N.canBuild(pc, [1, 0], 0) === true, 'a bridge cannot be built where one that crosses it is')
  // a group that is complete and cut off: 1 - 1 and 1 - 1 in a row
  const row4 = [0, 2, 4, 6].map((x) => ({ x, y: 0, n: 1 }))
  const pk = { id: 'k', w: 7, h: 1, islands: row4, ...N.layout(7, 1, row4), solution: [0, 0, 0] }
  ok(N.analyze(pk, [1, 0, 1]).conflicts.filter((c) => c.kind === 'split').length === 2, 'two pairs that are complete and joined to nothing else are two cut-off groups')
  ok(N.analyze(pk, [1, 0, 0]).conflicts.filter((c) => c.kind === 'split').length === 1, 'a pair that is complete shuts the others out: they can never be joined to it')
  ok(N.analyze(pk, [0, 0, 0]).conflicts.length === 0, 'nothing built is no conflict')
  ok(N.nextCount(0) === 1 && N.nextCount(1) === 2 && N.nextCount(2) === 0, 'a press goes none, single, double, none')
  ok(N.canBuild(four, [0, 0, 0, 0], 0) === true, 'a bridge can be built on an empty map')
}

lap('rules on boards')
/* ------------------------------------------------------------------------------------------- what the hint may deduce */
{
  let deductions = 0
  let wrongOnes = 0
  let runs = 0
  for (const tier of TIERS) {
    for (const lv of tier.levels) {
      const p = N.parsePuzzle(lv.id, lv.rows, lv.links)
      for (let rep = 0; rep < 8; rep++) {
        // bridges that are right: some of the answer, a double one sometimes shown as a single one (it may still grow)
        const br = p.solution.map((v) => {
          if (rand() > (rep + 1) / 10) return 0
          return v === 2 && rand() < 0.4 ? 1 : v
        })
        runs++
        const d = N.deduce(p, br)
        if (!ok(d.ok, `${lv.id} rep ${rep}: bridges that are right were taken for impossible`)) continue
        for (const f of d.forced) {
          deductions++
          if (f.bridges !== p.solution[f.e]) wrongOnes++
          ok(f.bridges > br[f.e], `${lv.id}: a deduction that adds nothing (place ${f.e})`)
          ok(f.bridges === p.solution[f.e], `${lv.id} rep ${rep}: place ${f.e} is deduced to have ${f.bridges} but the answer says ${p.solution[f.e]}`)
        }
      }
    }
  }
  ok(deductions >= 300 && wrongOnes === 0, `${deductions} deductions over ${runs} partial maps, ${wrongOnes} wrong`)
  const first = TIERS[0].levels[0]
  const p0 = N.parsePuzzle(first.id, first.rows, first.links)
  ok(N.deduce(p0, N.emptyBridges(p0)).forced.length > 0, 'the first puzzle has bridges that the rules decide from the start')
  // a map that cannot be completed is told: two bridges at every place
  ok(N.deduce(p0, p0.edges.map(() => 2)).ok === false, 'a map with a double bridge everywhere cannot be completed')
}

lap('hint')
/* ------------------------------------------------------------------------------------------- the saved progress */
{
  const ids = N.PUZZLE_IDS
  ok(JSON.stringify(N.parseProgress(['h5-01', 'h13-08'], ids)) === JSON.stringify({ 'h5-01': true, 'h13-08': true }), 'saved progress (a list of ids) is read back')
  ok(JSON.stringify(N.parseProgress(['zz', 7, null, { a: 1 }, 'h5-01', 'h5-01'], ids)) === JSON.stringify({ 'h5-01': true }), 'what is malformed is dropped, and so are ids that do not exist')
  ok(Object.keys(N.parseProgress(null, ids)).length === 0 && Object.keys(N.parseProgress({ 'h5-01': true }, ids)).length === 0 && Object.keys(N.parseProgress('h5-01', ids)).length === 0, 'nothing from what is not a list')
}

/* ------------------------------------------------------------------------------------------- reading a puzzle */
{
  let threw = 0
  const tryParse = (rows, links) => {
    try {
      N.parsePuzzle('x', rows, links)
    } catch {
      threw++
    }
  }
  tryParse(['1 . 1', '. .'], [[0, 1, 1]]) // a short row
  tryParse(['1 . x'], [[0, 1, 1]]) // not a number
  tryParse(['1 . 9'], [[0, 1, 1]]) // 9 is too many
  tryParse(['1 . 1'], [[0, 1, 3]]) // three bridges
  tryParse(['1 . 1'], [[0, 1, 1], [0, 1, 1]]) // the same place twice
  tryParse(['1 . 2'], [[0, 1, 1]]) // numbers that the answer does not give
  tryParse(['1 . 1', '. . .', '1 . .'], [[0, 2, 1]]) // islands that do not see each other
  ok(threw === 7, `seven malformed puzzles are refused (${threw})`)
  const p = N.parsePuzzle('ok', ['2 . 1', '. . .', '1 . .'], [[0, 1, 1], [0, 2, 1]])
  ok(p.w === 3 && p.h === 3 && p.islands.length === 3 && p.edges.length === 2 && p.solution.join() === '1,1', 'a puzzle is read: size, islands, places, answer')
}

lap('reading')
/* ------------------------------------------------------------------------------------------- texts and wiring */
{
  const game = N.GAMES.find((g) => g.id === 'hashi')
  if (ok(game, 'the game is in the list')) {
    const others = N.GAMES.filter((g) => g.id !== 'hashi')
    ok(game.slug.en === 'hashi' && game.slug.id === 'hashi' && others.every((o) => o.slug.en !== game.slug.en && o.slug.id !== game.slug.id), 'its addresses are its own')
    const section = (id) => game.sections.find((s) => s.id === id)
    for (const loc of ['en', 'id']) {
      const all = [game.answer, game.description, ...game.sections.map((s) => s.text), ...game.faq.map((f) => f.a)].map((x) => x[loc]).join('\n')
      ok(/\b40\b/.test(all), `${loc}: the text says 40 puzzles`)
      ok(!/(^|[^*\w])\*[^*\s][^*\n]*\*([^*]|$)/m.test(all), `${loc}: no *word* emphasis`)
      ok(!/\b(red|merah)\b/i.test(all.replace(/lingkaran merah/gi, '')), `${loc}: no red in the text apart from the ring of a mistake`)
      ok(!/\b(stars?|bintang)\b/i.test(all), `${loc}: no stars (a puzzle is solved or not)`)
    }
    const sizes = section('sizes')
    for (const t of TIERS) for (const loc of ['en', 'id']) ok(new RegExp(`\\| ${t.size}×${t.size} [^|]+\\| ${t.levels.length} \\|`).test(sizes.text[loc]), `the sizes table: ${t.size}×${t.size} with ${t.levels.length} puzzles (${loc})`)
    ok(section('how-to-play') && section('the-rules') && section('how-to-solve') && game.faq.length >= 6 && game.teaches.length >= 4 && game.keywords.en.split(',').length >= 8, 'the sections, the FAQ and what it teaches')
    ok(game.seoTitle.en.length <= 72 && game.seoTitle.id.length <= 80 && game.description.en.length <= 420 && game.description.id.length <= 450 && /^\*\*/.test(game.answer.en) && /^\*\*/.test(game.answer.id), 'titles and descriptions are of a sensible length')
    const rules = section('the-rules').text.en
    ok(/exactly three bridges/.test(rules) && /At most two/.test(rules) && /No crossing/.test(rules) && /One network/.test(rules), 'the rules table names the rules')
  }
  const page = read('src/pages/GamePage.tsx')
  ok(/import HashiGame from '..\/components\/games\/HashiGame'/.test(page) && /hashi: \(\) => <HashiGame \/>/.test(page), 'the game page shows the game')
  ok(/GameId = [^\n]*'hashi'/.test(read('src/content/games.ts')), 'GameId has the game')
  ok(/"check:hashi": "node tools\/check-hashi.mjs"/.test(read('package.json')) && /npm run check:hashi/.test(read('.github/workflows/deploy.yml')), 'the check is in package.json and in the deploy workflow')
  ok(N.COVER_IDS.includes('hashi') && /<svg/.test(N.gameCoverSvg('hashi')) && !/\d\.\d/.test(N.gameCoverSvg('hashi')), 'the game has a cover, with no decimal point in it')

  const ui = read('src/components/games/HashiGame.tsx')
  ok(/nunada\.hashi\.v1/.test(ui) && /onPointerDown/.test(ui) && /onKeyDown/.test(ui) && /e\.key === 'z'/.test(ui) && /e\.key === 'r'/.test(ui) && /e\.shiftKey/.test(ui), 'the keys, the press and the saved progress are wired')
  ok(/aria-live="polite"/.test(ui) && /role="application"/.test(ui) && /sr-only/.test(ui), 'a screen reader is told where the cursor is and what it is on')
  ok(!/starsFor|Stars/.test(ui) && /deduce\(puzzle/.test(ui) && /analyze\(puzzle/.test(ui) && /canBuild\(puzzle/.test(ui), 'no stars; the hint uses the deductions and the map uses the rules of the engine')

  const css = read('src/styles.css')
  const at = css.indexOf('/* ---- Hashi.')
  const end = css.indexOf('/* ---- ', at + 10)
  const hs = css.slice(at, end < 0 ? undefined : end)
  ok(hs.length > 1200, 'the styles of the game')
  ok(!/#[0-9a-fA-F]{3,8}\b/.test(hs), 'the styles use only the color tokens of the site, no color of their own')
  ok(/\.hsi\.bad circle \{[^}]*--bad/.test(hs) && /\.hsbridge\.bad \{[^}]*--bad/.test(hs) && !/--fig-b|\bred\b/.test(hs.replace(/Red is only[^.]*\./, '')), 'red is used only for what breaks a rule')
  ok(/\.hsi\.full circle \{[^}]*--brand-soft/.test(hs), 'an island with all its bridges is filled')
}

console.log(`hashi check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
