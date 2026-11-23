// Tic-Tac-Logic: src/lib/tictaclogic.ts (the rules, the solver, the hints), src/content/tictaclogic.ts (the 40 puzzles) and the page text.
//   node tools/check-tictaclogic.mjs
//
// Nothing is taken on trust from the engine:
//   - a second solver is written here that works in another way (it lists every row that keeps the rules and fits whole rows together, always placing the row with the fewest rows that fit; the engine
//     reasons cell by cell), and every puzzle must have exactly one answer for it too, the answer that is in the data;
//   - on thousands of random small puzzles (most of which have no answer, or several) the engine's solver, this one and a plain count over every way of filling the grid must agree;
//   - the rules on a marked grid ("solved", and every kind of conflict) are written again here and compared on thousands of boards: the answer with mistakes put in, and noise;
//   - what the hint can deduce is checked against the answer: from marks that are right it may never say anything that is not so;
//   - the texts, the wiring, the styles and the saved progress.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tictaclogic-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [
    `export * from '${q('src/lib/tictaclogic.ts')}'`,
    `export * from '${q('src/content/tictaclogic.ts')}'`,
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

let seedState = 777
const rand = () => {
  seedState = (seedState + 0x6d2b79f5) >>> 0
  let t = seedState
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rint = (n) => Math.floor(rand() * n)

/* ------------------------------------------------------------------------------------------- the rules, written again */
/** a grid is an array of rows, each an array of 1 (X) or 2 (O), or 0 for an empty cell */
const rowsOf = (flat, w, h) => Array.from({ length: h }, (_, y) => flat.slice(y * w, y * w + w))
const colsOf = (rows) => rows[0].map((_, x) => rows.map((r) => r[x]))
const noTriple = (line) => line.every((v, i) => i < 2 || v === 0 || !(line[i - 1] === v && line[i - 2] === v))
const balanced = (line) => line.filter((v) => v === 1).length === line.length / 2 && line.filter((v) => v === 2).length === line.length / 2
/** is this full grid a right answer? */
function validGrid(flat, w, h) {
  if (flat.some((v) => v !== 1 && v !== 2)) return false
  const rows = rowsOf(flat, w, h)
  const cols = colsOf(rows)
  for (const l of [...rows, ...cols]) if (!noTriple(l) || !balanced(l)) return false
  for (const set of [rows, cols]) if (new Set(set.map((l) => l.join(''))).size !== set.length) return false
  return true
}

/* ------------------------------------------------------------------------------------------- the second solver */
/** every row of this length with as many X as O and no three of a kind in a row */
const patternCache = new Map()
function patterns(n) {
  if (patternCache.has(n)) return patternCache.get(n)
  const out = []
  const cur = []
  const rec = (i, cx, co) => {
    if (cx > n / 2 || co > n / 2) return
    if (i === n) return void out.push(cur.slice())
    for (const v of [1, 2]) {
      if (i >= 2 && cur[i - 1] === v && cur[i - 2] === v) continue
      cur.push(v)
      rec(i + 1, cx + (v === 1), co + (v === 2))
      cur.pop()
    }
  }
  rec(0, 0, 0)
  patternCache.set(n, out)
  return out
}
/** The answers of a puzzle (given: flat array of 0, 1, 2), up to `limit`: whole rows, in any order (always the row that has the fewest rows left that fit it). */
function solveByRows(w, h, given, limit, maxNodes = 5_000_000) {
  const all = patterns(w)
  const fit = Array.from({ length: h }, (_, y) => all.filter((pat) => pat.every((v, x) => given[y * w + x] === 0 || given[y * w + x] === v)))
  const placed = new Array(h).fill(null)
  const count = Array.from({ length: w }, () => [0, 0, 0])
  const found = []
  let nodes = 0
  let exhausted = false
  /** the rows that may stand at row r now: not the same as a row that is there, no column over half, no three of a kind in a column with the rows that are there */
  const options = (r) => {
    const out = []
    for (const pat of fit[r]) {
      let fine = true
      for (let c = 0; c < w && fine; c++) {
        if (count[c][pat[c]] + 1 > h / 2) fine = false
        else
          for (const [a, b] of [[r - 2, r - 1], [r - 1, r + 1], [r + 1, r + 2]])
            if (a >= 0 && b < h && placed[a] && placed[b] && placed[a][c] === pat[c] && placed[b][c] === pat[c]) fine = false
      }
      if (!fine) continue
      const key = pat.join('')
      if (placed.some((row) => row && row.join('') === key)) continue
      out.push(pat)
    }
    return out
  }
  const rec = (left) => {
    if (found.length >= limit || exhausted) return
    if (++nodes > maxNodes) {
      exhausted = true
      return
    }
    if (left === 0) {
      const cols = colsOf(placed)
      if (new Set(cols.map((l) => l.join(''))).size === w && cols.every((c) => noTriple(c) && balanced(c))) found.push(placed.flat())
      return
    }
    let best = -1
    let bestOptions = null
    // per column: in how many of the rows that are left can an X (or an O) stand, and in how many must it
    const can = Array.from({ length: w }, () => [0, 0, 0])
    const must = Array.from({ length: w }, () => [0, 0, 0])
    for (let r = 0; r < h; r++) {
      if (placed[r]) continue
      const o = options(r)
      if (o.length === 0) return
      if (bestOptions === null || o.length < bestOptions.length) (best = r), (bestOptions = o)
      for (let c = 0; c < w; c++) {
        const hasX = o.some((pat) => pat[c] === 1)
        const hasO = o.some((pat) => pat[c] === 2)
        if (hasX) can[c][1]++
        if (hasO) can[c][2]++
        if (hasX && !hasO) must[c][1]++
        if (hasO && !hasX) must[c][2]++
      }
    }
    // a column needs h/2 of each: enough rows must be able to give it, and not more than it takes may be forced to
    for (let c = 0; c < w; c++)
      for (const v of [1, 2]) {
        const need = h / 2 - count[c][v]
        if (can[c][v] < need || must[c][v] > need) return
      }
    for (const pat of bestOptions) {
      for (let c = 0; c < w; c++) count[c][pat[c]]++
      placed[best] = pat
      rec(left - 1)
      placed[best] = null
      for (let c = 0; c < w; c++) count[c][pat[c]]--
      if (found.length >= limit || exhausted) return
    }
  }
  rec(h)
  return { found, nodes, exhausted }
}
/** The plain count: every way of filling the empty cells. */
function bruteCount(w, h, given, limit) {
  const empty = []
  given.forEach((v, i) => v === 0 && empty.push(i))
  let count = 0
  const grid = given.slice()
  const rec = (k) => {
    if (count >= limit) return
    if (k === empty.length) {
      if (validGrid(grid, w, h)) count++
      return
    }
    for (const v of [1, 2]) {
      grid[empty[k]] = v
      rec(k + 1)
    }
    grid[empty[k]] = 0
  }
  rec(0)
  return count
}

const SYM = { X: 1, O: 2, '.': 0 }
const flatOf = (rows) => rows.flatMap((r) => r.trim().split(/\s+/).map((c) => SYM[c]))
const solFlat = (sol) => sol.flatMap((r) => [...r].map((c) => SYM[c]))

/* ------------------------------------------------------------------------------------------- the puzzles */
const TIERS = N.TIER_LIST
{
  ok(TIERS.length === 5 && TIERS.every((t) => t.levels.length === 8), `five sizes of 8 puzzles (${TIERS.map((t) => t.levels.length)})`)
  ok(N.ALL_PUZZLES.length === 40 && new Set(N.PUZZLE_IDS).size === 40, 'forty puzzles with ids of their own')
  ok(N.PUZZLE_IDS.every((id) => /^t(4|6|8|10|12)-0[1-8]$/.test(id)), 'the ids are t4-01 .. t12-08')
  const seenRows = new Set()
  let search = 0
  for (const tier of TIERS) {
    let lastNodes = 0
    let lastGiven = Infinity
    for (const lv of tier.levels) {
      let p
      try {
        p = N.parsePuzzle(lv.id, lv.rows, lv.sol)
      } catch (e) {
        ok(false, `${lv.id}: cannot be read: ${e.message}`)
        continue
      }
      ok(p.w === tier.size && p.h === tier.size, `${lv.id}: ${p.w}x${p.h} in a tier of ${tier.size}x${tier.size}`)
      ok(!seenRows.has(lv.rows.join('|')), `${lv.id}: a puzzle that is not a copy of another`)
      seenRows.add(lv.rows.join('|'))
      ok(validGrid(p.solution, p.w, p.h), `${lv.id}: the answer in the data keeps every rule (own rules)`)
      ok(p.given.every((g, i) => g === 0 || g === p.solution[i]), `${lv.id}: every given cell is what the answer has there`)
      const givens = p.given.filter((g) => g !== 0).length
      ok(givens >= 2 && givens <= Math.ceil(p.w * p.h * 0.5), `${lv.id}: ${givens} given cells`)

      // the engine's solver: one answer, the one in the data
      const e = N.solvePuzzle(p, 2, 500_000)
      ok(e.count === 1 && !e.exhausted, `${lv.id}: the engine finds ${e.count} answers (exhausted ${e.exhausted}), not exactly one`)
      ok(e.solution && e.solution.join() === p.solution.join(), `${lv.id}: the engine's answer is the one in the data`)
      ok(tier.levels.indexOf(lv) === 0 || e.nodes > lastNodes || (e.nodes === lastNodes && givens <= lastGiven), `${lv.id}: the puzzles of a size climb (${e.nodes} positions and ${givens} given cells after ${lastNodes} and ${lastGiven})`)
      lastNodes = e.nodes
      lastGiven = givens
      if (e.nodes > 1) search++

      // the second solver
      const tr = Date.now()
      const r = solveByRows(p.w, p.h, p.given, 2)
      if (process.env.TIMES) console.log(`    ${lv.id} whole rows: ${r.nodes} nodes, ${Date.now() - tr} ms`)
      ok(!r.exhausted && r.found.length === 1, `${lv.id}: the solver of whole rows finds ${r.found.length} answers (exhausted ${r.exhausted}), not exactly one`)
      if (r.found.length === 1) ok(r.found[0].join() === p.solution.join(), `${lv.id}: the answer of the solver of whole rows is the one in the data`)
    }
    lap(`  ${tier.size}x${tier.size}`)
  }
  ok(search >= 8, `${search} puzzles need more than reasoning one step at a time (a search)`)
}

lap('puzzles')
/* ------------------------------------------------------------------------------------------- the solvers against each other and against a plain count */
{
  let agree = 0
  let withAnswers = 0
  let several = 0
  // a random full grid that keeps the rules: rows chosen in random order, one under the other
  const randomFull = (w, h) => {
    const all = patterns(w)
    const rows = []
    const count = Array.from({ length: w }, () => [0, 0, 0])
    let budget = 20000
    const rec = (r) => {
      if (r === h) return new Set(colsOf(rows).map((l) => l.join(''))).size === w
      const order = all.map((pat) => [rand(), pat]).sort((a, b) => a[0] - b[0]).map(([, pat]) => pat)
      for (const pat of order) {
        if (--budget < 0) return false
        if (rows.some((row) => row.join('') === pat.join(''))) continue
        let fine = true
        for (let c = 0; c < w && fine; c++) {
          if (r >= 2 && rows[r - 1][c] === pat[c] && rows[r - 2][c] === pat[c]) fine = false
          else if (count[c][pat[c]] + 1 > h / 2) fine = false
        }
        if (!fine) continue
        for (let c = 0; c < w; c++) count[c][pat[c]]++
        rows.push(pat)
        if (rec(r + 1)) return true
        rows.pop()
        for (let c = 0; c < w; c++) count[c][pat[c]]--
      }
      return false
    }
    return rec(0) ? rows.flat() : null
  }
  const trial = (w, h, brute, noise) => {
    const full = randomFull(w, h)
    if (!full) return
    // some cells given: as many as the density says; with noise, one given cell is changed, so that there may be no answer
    const density = 0.2 + rand() * 0.5
    const given = full.map((v) => (rand() < density ? v : 0))
    if (noise && given.some((v) => v)) {
      const i = given.findIndex((v, k) => v !== 0 && rand() < 0.3)
      if (i >= 0) given[i] = 3 - given[i]
    }
    const ans = brute ? bruteCount(w, h, given, 4) : null
    const second = solveByRows(w, h, given, 4)
    const e = N.solvePuzzle({ id: 't', w, h, given, solution: full }, 4, 200_000)
    if (!ok(!e.exhausted && !second.exhausted, `${given.join('')}: a search was cut short`)) return
    const same = e.count === second.found.length && (ans === null || ans === e.count)
    ok(same, `${w}x${h} given ${given.join('')}: engine ${e.count}, whole rows ${second.found.length}${brute ? ', plain count ' + ans : ''}`)
    if (same) agree++
    if (e.count >= 1) withAnswers++
    if (e.count >= 2) several++
  }
  for (let t = 0; t < 400; t++) trial(4, 4, true, t % 4 === 0)
  for (let t = 0; t < 400; t++) trial(6, 4, false, t % 4 === 0)
  for (let t = 0; t < 400; t++) trial(6, 6, false, t % 5 === 0)
  for (let t = 0; t < 200; t++) trial(8, 6, false, t % 5 === 0)
  ok(withAnswers >= 500 && several >= 100, `the random puzzles have answers (${withAnswers}) and several answers (${several}) often enough to mean something; they agreed on ${agree}`)
}

lap('solvers vs plain count')
/* ------------------------------------------------------------------------------------------- the rules on a marked grid */
{
  const kinds = new Set()
  let boards = 0
  let solvedBoards = 0
  for (const tier of TIERS.slice(0, 4)) {
    for (const lv of tier.levels) {
      const p = N.parsePuzzle(lv.id, lv.rows, lv.sol)
      const { w, h } = p
      for (let b = 0; b < 40; b++) {
        let marks = p.solution.slice()
        const mode = b % 5
        if (mode === 1) marks = marks.map((m, i) => (p.given[i] === 0 && rand() < 0.3 ? 0 : m)) // some cells empty
        else if (mode >= 2) {
          const flips = 1 + rint(mode === 2 ? 2 : mode === 3 ? 4 : 10)
          for (let f = 0; f < flips; f++) {
            const i = rint(w * h)
            if (p.given[i] === 0) marks[i] = rint(3)
          }
        }
        if (b === 39) marks = marks.map((m, i) => (p.given[i] !== 0 ? m : rint(3)))
        boards++
        const a = N.analyze(p, marks)
        const should = validGrid(marks, w, h)
        if (!ok(a.solved === should, `${lv.id} board ${b}: the engine says solved=${a.solved}, the rules say ${should}`)) continue
        if (a.solved) solvedBoards++
        if (a.solved) ok(a.conflicts.length === 0, `${lv.id} board ${b}: solved with conflicts`)
        const rows = rowsOf(marks, w, h)
        const cols = colsOf(rows)
        const all = [...rows, ...cols]
        // triples
        let triples = 0
        for (const l of all) for (let i = 2; i < l.length; i++) if (l[i] !== 0 && l[i] === l[i - 1] && l[i] === l[i - 2]) triples++
        ok(triples === a.conflicts.filter((c) => c.kind === 'triple').length, `${lv.id} board ${b}: ${triples} triples but the engine says ${a.conflicts.filter((c) => c.kind === 'triple').length}`)
        // more than half
        let over = 0
        for (const l of all) for (const s of [1, 2]) if (l.filter((v) => v === s).length > l.length / 2) over++
        ok(over === a.conflicts.filter((c) => c.kind === 'over').length, `${lv.id} board ${b}: ${over} lines with more than half but the engine says ${a.conflicts.filter((c) => c.kind === 'over').length}`)
        // twins
        let same = 0
        for (const set of [rows, cols]) for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) if (set[i].every((v) => v !== 0) && set[i].join('') === set[j].join('')) same++
        ok(same === a.conflicts.filter((c) => c.kind === 'same').length, `${lv.id} board ${b}: ${same} twin lines but the engine says ${a.conflicts.filter((c) => c.kind === 'same').length}`)
        for (const c of a.conflicts) kinds.add(c.kind)
        // every cell named by a conflict is filled
        ok(a.conflicts.every((c) => c.cells.every((i) => marks[i] !== 0)), `${lv.id} board ${b}: a conflict names an empty cell`)
      }
    }
  }
  ok(solvedBoards >= 100, `${solvedBoards} of ${boards} boards were solved (right answers, and answers after a change that did not break a rule)`)
  ok(['triple', 'over', 'same'].every((k) => kinds.has(k)), `every kind of conflict was met on the boards (${[...kinds]})`)

  // hand-made boards, one for each kind of conflict
  const small = { id: 'h', w: 4, h: 4, given: new Array(16).fill(0), solution: new Array(16).fill(1) }
  const m = (s) => [...s].map((c) => (c === 'X' ? 1 : c === 'O' ? 2 : 0))
  const kindsOf = (marks) => N.analyze(small, marks).conflicts.map((c) => c.kind)
  ok(kindsOf(m('XXX.' + '....' + '....' + '....')).includes('triple'), 'three X in a row are a triple')
  ok(kindsOf(m('X...' + 'X...' + 'X...' + '....')).includes('triple'), 'three X in a column are a triple')
  ok(!kindsOf(m('XXOX' + '....' + '....' + '....')).includes('triple'), 'two X, an O and an X are no triple')
  ok(!kindsOf(m('XX.X' + '....' + '....' + '....')).includes('triple'), 'an empty cell between breaks the triple')
  ok(kindsOf(m('XXX.' + '....' + '....' + '....')).includes('over'), 'three X in a row of four are more than half')
  ok(!kindsOf(m('XXOO' + '....' + '....' + '....')).includes('over'), 'two X and two O in a row of four are exactly half')
  ok(kindsOf(m('XOXO' + 'XOXO' + '....' + '....')).includes('same'), 'two rows that are full and the same are twins')
  ok(!kindsOf(m('XOXO' + 'XOX.' + '....' + '....')).includes('same'), 'a row that is not full is no twin yet')
  ok(N.analyze(small, N.startMarks(small)).conflicts.length === 0 && !N.analyze(small, N.startMarks(small)).solved, 'an empty grid has no conflict and is not solved')
  // what the rules decide, by hand: a row that is complete, and a row under it that would be the same if its two empty cells were filled as the first row has them
  const dd = N.deduce(small, m('XXOO' + 'X..O' + '....' + '....'))
  ok(dd.ok && dd.cells.some((c) => c.i === 5 && c.symbol === 2) && dd.cells.some((c) => c.i === 6 && c.symbol === 1), 'a row cannot be the same as the one above it: its two empty cells are the other way round')
  ok(N.deduce(small, m('XX..' + '....' + '....' + '....')).cells.length === 2 && N.deduce(small, m('XX..' + '....' + '....' + '....')).cells.every((c) => c.symbol === 2), 'two X next to each other with two cells left: they are O')
  ok(N.nextMark(0) === 1 && N.nextMark(1) === 2 && N.nextMark(2) === 0, 'a press goes empty, X, O, empty')
}

lap('rules on boards')
/* ------------------------------------------------------------------------------------------- what the hint may deduce */
{
  let deductions = 0
  let wrongOnes = 0
  let runs = 0
  for (const tier of TIERS) {
    for (const lv of tier.levels) {
      const p = N.parsePuzzle(lv.id, lv.rows, lv.sol)
      for (let rep = 0; rep < 6; rep++) {
        // marks that are right: the given cells and some of the answer
        const marks = p.given.map((g, i) => (g !== 0 ? g : rand() < (rep + 1) / 9 ? p.solution[i] : 0))
        runs++
        const d = N.deduce(p, marks)
        if (!ok(d.ok, `${lv.id} rep ${rep}: marks that are right were taken for impossible`)) continue
        for (const c of d.cells) {
          deductions++
          if (c.symbol !== p.solution[c.i]) wrongOnes++
          ok(marks[c.i] === 0, `${lv.id}: a deduction about a cell that is marked (${c.i})`)
          ok(c.symbol === p.solution[c.i], `${lv.id} rep ${rep}: cell ${c.i} is deduced ${c.symbol} but the answer says ${p.solution[c.i]}`)
        }
      }
    }
  }
  ok(deductions >= 300 && wrongOnes === 0, `${deductions} deductions over ${runs} partial grids, ${wrongOnes} wrong`)
  const first = TIERS[0].levels[0]
  const p0 = N.parsePuzzle(first.id, first.rows, first.sol)
  ok(N.deduce(p0, N.startMarks(p0)).cells.length > 0, 'the first puzzle has cells that the rules decide from the start')
  ok(N.deduce(p0, p0.given.map((g) => (g === 0 ? 1 : g))).ok === false, 'a grid that is all X cannot be completed')
}

lap('hint')
/* ------------------------------------------------------------------------------------------- the saved progress */
{
  const ids = N.PUZZLE_IDS
  ok(JSON.stringify(N.parseProgress(['t4-01', 't12-08'], ids)) === JSON.stringify({ 't4-01': true, 't12-08': true }), 'saved progress (a list of ids) is read back')
  ok(JSON.stringify(N.parseProgress(['zz', 7, null, { a: 1 }, 't4-01', 't4-01'], ids)) === JSON.stringify({ 't4-01': true }), 'what is malformed is dropped, and so are ids that do not exist')
  ok(Object.keys(N.parseProgress(null, ids)).length === 0 && Object.keys(N.parseProgress({ 't4-01': true }, ids)).length === 0 && Object.keys(N.parseProgress('t4-01', ids)).length === 0, 'nothing from what is not a list')
}

/* ------------------------------------------------------------------------------------------- reading a puzzle */
{
  let threw = 0
  const tryParse = (rows, sol) => {
    try {
      N.parsePuzzle('x', rows, sol)
    } catch {
      threw++
    }
  }
  const good = ['X . . .', '. . . .', '. . . .', '. . . X']
  const sol = ['XXOO', 'OXOX', 'XOXO', 'OOXX']
  ok(N.parsePuzzle('ok', good, sol).w === 4, 'a puzzle is read')
  tryParse(good.slice(0, 3), sol.slice(0, 3)) // an odd number of rows
  tryParse(['X . .', '. . .', '. . .', '. . .'], sol) // an odd number of columns
  tryParse(['X . . .', '. . .', '. . . .', '. . . X'], sol) // a short row
  tryParse(['X . . .', '. . . .', '. . . .', '. . . Z'], sol) // not X, O or a dot
  tryParse(good, ['XXOO', 'OXOX', 'XOXO', 'OXXX']) // an answer that does not keep the rules (and does have the given cells)
  tryParse(['O . . .', '. . . .', '. . . .', '. . . O'], sol) // a given cell that the answer does not have
  tryParse(good, ['XXOO', 'OXOX', 'XOXO', 'OOX']) // a short row of the answer
  ok(threw === 7, `seven malformed puzzles are refused (${threw})`)
}

lap('reading')
/* ------------------------------------------------------------------------------------------- texts and wiring */
{
  const game = N.GAMES.find((g) => g.id === 'tic-tac-logic')
  if (ok(game, 'the game is in the list')) {
    const others = N.GAMES.filter((g) => g.id !== 'tic-tac-logic')
    ok(game.slug.en === 'tic-tac-logic' && game.slug.id === 'tic-tac-logic' && others.every((o) => o.slug.en !== game.slug.en && o.slug.id !== game.slug.id), 'its addresses are its own')
    const section = (id) => game.sections.find((s) => s.id === id)
    for (const loc of ['en', 'id']) {
      const all = [game.answer, game.description, ...game.sections.map((s) => s.text), ...game.faq.map((f) => f.a)].map((x) => x[loc]).join('\n')
      ok(/\b40\b/.test(all), `${loc}: the text says 40 puzzles`)
      ok(!/(^|[^*\w])\*[^*\s][^*\n]*\*([^*]|$)/m.test(all), `${loc}: no *word* emphasis`)
      ok(!/\b(red|merah)\b/i.test(all), `${loc}: no red in the text (red is for mistakes)`)
      ok(!/\b(stars?|bintang)\b/i.test(all), `${loc}: no stars (a puzzle is solved or not)`)
    }
    const sizes = section('sizes')
    for (const t of TIERS) for (const loc of ['en', 'id']) ok(new RegExp(`\\| ${t.size}×${t.size} [^|]+\\| ${t.levels.length} \\|`).test(sizes.text[loc]), `the sizes table: ${t.size}×${t.size} with ${t.levels.length} puzzles (${loc})`)
    ok(section('how-to-play') && section('the-rules') && section('how-to-solve') && game.faq.length >= 6 && game.teaches.length >= 4 && game.keywords.en.split(',').length >= 8, 'the sections, the FAQ and what it teaches')
    ok(game.seoTitle.en.length <= 72 && game.seoTitle.id.length <= 80 && game.description.en.length <= 420 && game.description.id.length <= 450 && /^\*\*/.test(game.answer.en) && /^\*\*/.test(game.answer.id), 'titles and descriptions are of a sensible length')
    const rules = section('the-rules').text.en
    ok(/No three in a row/.test(rules) && /Equal numbers/.test(rules) && /No twins/.test(rules), 'the rules table names the three rules')
  }
  const page = read('src/pages/GamePage.tsx')
  ok(/import TicTacLogicGame from '..\/components\/games\/TicTacLogicGame'/.test(page) && /'tic-tac-logic': \(\) => <TicTacLogicGame \/>/.test(page), 'the game page shows the game')
  ok(/GameId = [^\n]*'tic-tac-logic'/.test(read('src/content/games.ts')), 'GameId has the game')
  ok(/"check:tictaclogic": "node tools\/check-tictaclogic.mjs"/.test(read('package.json')) && /npm run check:tictaclogic/.test(read('.github/workflows/deploy.yml')), 'the check is in package.json and in the deploy workflow')
  ok(N.COVER_IDS.includes('tic-tac-logic') && /<svg/.test(N.gameCoverSvg('tic-tac-logic')) && !/\d\.\d/.test(N.gameCoverSvg('tic-tac-logic')), 'the game has a cover, with no decimal point in it')

  const ui = read('src/components/games/TicTacLogicGame.tsx')
  ok(/nunada\.tictaclogic\.v1/.test(ui) && /onPointerDown/.test(ui) && /onPointerMove/.test(ui) && /onKeyDown/.test(ui) && /e\.key === 'z'/.test(ui) && /e\.key === 'r'/.test(ui), 'the keys, the drag and the saved progress are wired')
  ok(/aria-live="polite"/.test(ui) && /role="application"/.test(ui) && /sr-only/.test(ui), 'a screen reader is told where the cursor is and what it is on')
  ok(!/starsFor|Stars/.test(ui) && /deduce\(puzzle/.test(ui) && /analyze\(puzzle/.test(ui), 'no stars; the hint uses the deductions and the board uses the rules of the engine')
  ok(/given\[i\] !== BLANK\) return/.test(ui), 'a given cell cannot be changed')

  const css = read('src/styles.css')
  const at = css.indexOf('/* ---- Tic-Tac-Logic.')
  const end = css.indexOf('/* ---- ', at + 10)
  const tt = css.slice(at, end < 0 ? undefined : end)
  ok(tt.length > 1200, 'the styles of the game')
  ok(!/#[0-9a-fA-F]{3,8}\b/.test(tt), 'the styles use only the color tokens of the site, no color of their own')
  ok(/\.ttc\.bad \{[^}]*--bad/.test(tt) && !/--fig-b|\bred\b/.test(tt.replace(/Red is only[^.]*\./, '').replace(/never for a symbol[^.]*\./, '')), 'red is used only for the cells that break a rule')
  ok(/\.ttc\.x \{[^}]*--rh-blue/.test(tt) && /\.ttc\.o \{[^}]*--rh-gold/.test(tt), 'X is blue and O is gold (and they are letters too, so color is not the only sign)')
  ok(/touch-action: none/.test(tt) && /grid-template-columns: repeat\(var\(--cols\), var\(--cell\)\)/.test(tt), 'the board is a grid of square cells that does not scroll the page when dragged')
}

console.log(`tic-tac-logic check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
