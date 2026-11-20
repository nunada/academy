// Nurikabe: src/lib/nurikabe.ts (the rules, the solver, the hints), src/content/nurikabe.ts (the 40 puzzles) and the page text.
//   node tools/check-nurikabe.mjs
//
// Nothing is taken on trust from the engine:
//   - a second solver is written here that works in another way (it lists every shape each island can have and fits the shapes together; the engine reasons cell by cell),
//     and every puzzle must have exactly one answer for it too, the answer that is in the data;
//   - on thousands of random small puzzles (most of which have no answer, or several) the engine's solver, this one and a plain count over every way of shading the grid must agree;
//   - the rules on a marked grid ("solved", and every kind of conflict) are written again here and compared on thousands of boards: the answer with mistakes put in, and noise;
//   - what the hint can deduce is checked against the answer: from marks that are right it may never say anything that is not so;
//   - the texts, the wiring, the styles and the saved progress.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nurikabe-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [
    `export * from '${q('src/lib/nurikabe.ts')}'`,
    `export * from '${q('src/content/nurikabe.ts')}'`,
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

// a small seeded random source of its own
let seedState = 12345
const rand = () => {
  seedState = (seedState + 0x6d2b79f5) >>> 0
  let t = seedState
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rint = (n) => Math.floor(rand() * n)

/* ------------------------------------------------------------------------------------------- the rules, written again */
const around = (w, h, i) => {
  const x = i % w
  const y = Math.floor(i / w)
  const r = []
  if (y > 0) r.push(i - w)
  if (y < h - 1) r.push(i + w)
  if (x > 0) r.push(i - 1)
  if (x < w - 1) r.push(i + 1)
  return r
}
/** the pieces (arrays of cells) of the cells for which `pred` holds, joined along edges */
const groups = (w, h, pred) => {
  const seen = new Set()
  const out = []
  for (let s = 0; s < w * h; s++) {
    if (seen.has(s) || !pred(s)) continue
    const g = [s]
    seen.add(s)
    for (let k = 0; k < g.length; k++) for (const m of around(w, h, g[k])) if (!seen.has(m) && pred(m)) (seen.add(m), g.push(m))
    out.push(g)
  }
  return out
}
/** is this set of sea cells (a Set) a right answer for the clues? */
function validSea(w, h, clue, sea) {
  for (let i = 0; i < w * h; i++) if (clue[i] > 0 && sea.has(i)) return false
  for (let y = 0; y + 1 < h; y++) for (let x = 0; x + 1 < w; x++) if ([0, 1, w, w + 1].every((d) => sea.has(y * w + x + d))) return false
  for (const g of groups(w, h, (i) => !sea.has(i))) {
    const nums = g.filter((i) => clue[i] > 0)
    if (nums.length !== 1 || g.length !== clue[nums[0]]) return false
  }
  if (sea.size > 0 && groups(w, h, (i) => sea.has(i)).length !== 1) return false
  return true
}

/* ------------------------------------------------------------------------------------------- the second solver */
/** Every way of shaping the island of the number at `cell`: the sets of `size` cells that touch along edges, hold that cell and no other number, and touch no other number. */
function shapes(w, h, clue, cell, size) {
  const forbidden = new Set()
  for (let i = 0; i < w * h; i++)
    if (clue[i] > 0 && i !== cell) {
      forbidden.add(i)
      for (const m of around(w, h, i)) forbidden.add(m)
    }
  let level = new Map([[String(cell), [cell]]])
  for (let k = 1; k < size; k++) {
    const next = new Map()
    for (const set of level.values())
      for (const c of set)
        for (const m of around(w, h, c)) {
          if (set.includes(m) || forbidden.has(m)) continue
          const grown = [...set, m].sort((a, b) => a - b)
          next.set(grown.join(','), grown)
        }
    level = next
  }
  return [...level.values()]
}
/** The answers of a puzzle, up to `limit`, by fitting shapes: [{ sea: Set }...] and how many nodes it took. */
function solveByShapes(w, h, clue, limit, maxNodes = 4_000_000) {
  const cells = []
  for (let i = 0; i < w * h; i++) if (clue[i] > 0) cells.push(i)
  const nbMask = (i) => around(w, h, i).reduce((m, c) => m | (1n << BigInt(c)), 0n)
  const lists = cells.map((c) => {
    const out = []
    for (const set of shapes(w, h, clue, c, clue[c])) {
      let mask = 0n
      let halo = 0n
      for (const x of set) (mask |= 1n << BigInt(x)), (halo |= nbMask(x))
      out.push({ mask, halo, set })
    }
    return out
  })
  const full = (1n << BigInt(w * h)) - 1n
  const windows = []
  for (let y = 0; y + 1 < h; y++) for (let x = 0; x + 1 < w; x++) windows.push([0, 1, w, w + 1].reduce((m, d) => m | (1n << BigInt(y * w + x + d)), 0n))
  const found = []
  let nodes = 0
  let exhausted = false
  const rec = (remaining, placedMask, placedHalo) => {
    if (found.length >= limit || exhausted) return
    if (++nodes > maxNodes) {
      exhausted = true
      return
    }
    if (remaining.length === 0) {
      const seaSet = new Set()
      for (let i = 0; i < w * h; i++) if (!((placedMask >> BigInt(i)) & 1n)) seaSet.add(i)
      if (validSea(w, h, clue, seaSet)) found.push({ sea: seaSet })
      return
    }
    // the shapes that still fit, for every number that is not placed
    const fit = remaining.map((l) => l.filter((s) => (s.mask & placedMask) === 0n && (s.mask & placedHalo) === 0n))
    if (fit.some((l) => l.length === 0)) return
    // a 2x2 block that nothing can cover is a pool
    let cover = placedMask
    for (const l of fit) for (const s of l) cover |= s.mask
    for (const wm of windows) if ((wm & cover) === 0n) return
    let best = 0
    for (let k = 1; k < fit.length; k++) if (fit[k].length < fit[best].length) best = k
    const rest = fit.filter((_, k) => k !== best)
    for (const s of fit[best]) {
      // the others must still fit next to this one
      const kept = rest.map((l) => l.filter((o) => (o.mask & s.mask) === 0n && (o.mask & s.halo) === 0n))
      rec(kept, placedMask | s.mask, placedHalo | s.halo)
      if (found.length >= limit || exhausted) return
    }
  }
  void full
  rec(lists, 0n, 0n)
  return { found, nodes, exhausted }
}

/** The plain count: every way of shading a small grid. */
function bruteCount(w, h, clue, limit) {
  let count = 0
  const total = w * h
  // the cheap rules first, on bits: no sea on a number, no 2x2 block of sea
  let clueMask = 0
  for (let i = 0; i < total; i++) if (clue[i] > 0) clueMask |= 1 << i
  const windows = []
  for (let y = 0; y + 1 < h; y++) for (let x = 0; x + 1 < w; x++) windows.push([0, 1, w, w + 1].reduce((mk, d) => mk | (1 << (y * w + x + d)), 0))
  // the land is exactly as many cells as the numbers add up to, so only the shadings with that many sea cells can be an answer
  const need = total - clue.reduce((t, c) => t + c, 0)
  if (need < 0) return 0
  outer: for (let m = 0; m < 1 << total; m++) {
    if (m & clueMask) continue
    let bits = 0
    for (let r = m; r; r &= r - 1) bits++
    if (bits !== need) continue
    for (const wm of windows) if ((m & wm) === wm) continue outer
    const sea = new Set()
    for (let i = 0; i < total; i++) if ((m >> i) & 1) sea.add(i)
    if (validSea(w, h, clue, sea) && ++count >= limit) break
  }
  return count
}

/* ------------------------------------------------------------------------------------------- the puzzles */
const TIERS = N.TIER_LIST
{
  ok(TIERS.length === 5 && TIERS.every((t) => t.levels.length === 8), `five sizes of 8 puzzles (${TIERS.map((t) => t.levels.length)})`)
  ok(N.ALL_PUZZLES.length === 40 && new Set(N.PUZZLE_IDS).size === 40, 'forty puzzles with ids of their own')
  ok(N.PUZZLE_IDS.every((id) => /^n[5-9]-0[1-8]$/.test(id)), 'the ids are n5-01 .. n9-08')
  const seenRows = new Set()
  let big = 0
  for (const tier of TIERS) {
    let lastNodes = 0
    for (const lv of tier.levels) {
      let p
      try {
        p = N.parsePuzzle(lv.id, lv.rows, lv.sea)
      } catch (e) {
        ok(false, `${lv.id}: cannot be read: ${e.message}`)
        continue
      }
      ok(p.w === tier.size && p.h === tier.size, `${lv.id}: ${p.w}x${p.h} in a tier of ${tier.size}x${tier.size}`)
      ok(!seenRows.has(lv.rows.join('|')), `${lv.id}: a puzzle that is not a copy of another`)
      seenRows.add(lv.rows.join('|'))
      const seaSet = new Set()
      p.solution.forEach((s, i) => s && seaSet.add(i))
      ok(validSea(p.w, p.h, p.clue, seaSet), `${lv.id}: the answer in the data keeps every rule (own rules)`)
      ok(p.clue.filter((c) => c > 0).length >= Math.floor((p.w * p.h) / 8), `${lv.id}: enough numbers`)

      // the engine's solver: one answer, the one in the data
      const e = N.solvePuzzle(p, 2, 500_000)
      ok(e.count === 1 && !e.exhausted, `${lv.id}: the engine finds ${e.count} answers (exhausted ${e.exhausted}), not exactly one`)
      ok(e.solution && e.solution.every((s, i) => s === p.solution[i]), `${lv.id}: the engine's answer is the one in the data`)
      ok(e.nodes >= lastNodes || tier.levels.indexOf(lv) === 0, `${lv.id}: the puzzles of a size climb (${e.nodes} positions after ${lastNodes})`)
      lastNodes = e.nodes
      if (e.nodes > 1) big++

      // the second solver
      const r = solveByShapes(p.w, p.h, p.clue, 2)
      ok(!r.exhausted && r.found.length === 1, `${lv.id}: the solver of shapes finds ${r.found.length} answers (exhausted ${r.exhausted}), not exactly one`)
      if (r.found.length === 1) ok([...r.found[0].sea].sort((a, b) => a - b).join() === [...seaSet].sort((a, b) => a - b).join(), `${lv.id}: the answer of the solver of shapes is the one in the data`)
    }
  }
  ok(big >= 15, `${big} puzzles need more than reasoning one step at a time (a search)`)
}

lap('puzzles')
/* ------------------------------------------------------------------------------------------- the solvers against each other and against a plain count */
{
  let agree = 0
  let withAnswers = 0
  let several = 0
  const trial = (w, h, brute) => {
    const clue = new Array(w * h).fill(0)
    const k = 1 + rint(Math.min(5, w * h - 1))
    for (let j = 0; j < k; j++) clue[rint(w * h)] = 1 + rint(Math.max(2, Math.floor((w * h) / 3)))
    const p = { id: 't', w, h, clue, solution: new Array(w * h).fill(true) }
    const e = N.solvePuzzle(p, 4, 200_000)
    const r = solveByShapes(w, h, clue, 4)
    if (!ok(!e.exhausted && !r.exhausted, `${w}x${h} ${clue}: a search was cut short`)) return
    const s = r.found.length
    let same = e.count === s
    if (brute) same = same && bruteCount(w, h, clue, 4) === s
    ok(same, `${w}x${h} clue [${clue}]: engine ${e.count}, shapes ${s}${brute ? ', plain count ' + bruteCount(w, h, clue, 4) : ''}`)
    if (same) agree++
    if (s >= 1) withAnswers++
    if (s >= 2) several++
  }
  for (let t = 0; t < 500; t++) trial(4, 4, true)
  lap('  4x4 with the plain count')
  for (let t = 0; t < 40; t++) trial(5, 4, true)
  lap('  5x4 with the plain count')
  for (let t = 0; t < 400; t++) trial(5, 5, false)
  lap('  5x5')
  for (let t = 0; t < 150; t++) trial(6, 5, false)
  ok(withAnswers >= 150 && several >= 30, `the random puzzles have answers (${withAnswers}) and several answers (${several}) often enough to mean something; the solvers agreed on ${agree}`)
}

lap('solvers vs plain count')
/* ------------------------------------------------------------------------------------------- the rules on a marked grid */
{
  const kinds = new Set()
  const conflictOk = (p, marks, c) => {
    const { w, h, clue } = p
    const sea = (i) => marks[i] === N.SEA && clue[i] === 0
    const connected = (cells) => groups(w, h, (i) => cells.includes(i)).length === 1
    switch (c.kind) {
      case 'pool':
        return c.cells.length === 4 && c.cells.every(sea)
      case 'too-big': {
        const nums = c.cells.filter((i) => clue[i] > 0)
        return c.cells.every((i) => !sea(i) && (clue[i] > 0 || marks[i] === N.DOT)) && connected(c.cells) && nums.length === 1 && c.cells.length > clue[nums[0]]
      }
      case 'two-clues':
        return c.cells.every((i) => !sea(i) && (clue[i] > 0 || marks[i] === N.DOT)) && connected(c.cells) && c.cells.filter((i) => clue[i] > 0).length >= 2
      case 'too-small': {
        // the land that could still be land around these cells holds numbers that need more cells than there are
        const piece = groups(w, h, (i) => !sea(i)).find((g) => g.includes(c.cells[0]))
        return Boolean(piece) && c.cells.length === piece.length && piece.reduce((s, i) => s + clue[i], 0) > piece.length
      }
      case 'no-clue': {
        const piece = groups(w, h, (i) => !sea(i)).find((g) => g.includes(c.cells[0]))
        return Boolean(piece) && piece.every((i) => clue[i] === 0) && c.cells.every((i) => marks[i] === N.DOT && piece.includes(i))
      }
      case 'split': {
        // some sea cell cannot reach the first sea cell through sea and empty cells
        const first = [...Array(w * h).keys()].find(sea)
        const open = (i) => sea(i) || (marks[i] === N.BLANK && clue[i] === 0)
        const reach = groups(w, h, open).find((g) => g.includes(first)) ?? []
        return c.cells.length > 0 && c.cells.every((i) => sea(i) && !reach.includes(i))
      }
    }
    return false
  }
  let boards = 0
  let solvedBoards = 0
  for (const tier of TIERS.slice(0, 4)) {
    for (const lv of tier.levels) {
      const p = N.parsePuzzle(lv.id, lv.rows, lv.sea)
      const { w, h, clue } = p
      const truth = N.emptyMarks(p).map((_, i) => (p.solution[i] && clue[i] === 0 ? N.SEA : N.BLANK))
      for (let b = 0; b < 40; b++) {
        let marks = truth.slice()
        const mode = b % 5
        if (mode === 1) {
          // dots on land cells, as the answer
          marks = marks.map((m, i) => (m === N.BLANK && clue[i] === 0 && rand() < 0.5 ? N.DOT : m))
        } else if (mode >= 2) {
          // mistakes: a few cells flipped to something else
          const flips = 1 + rint(mode === 2 ? 2 : mode === 3 ? 5 : 12)
          for (let f = 0; f < flips; f++) {
            const i = rint(w * h)
            if (clue[i] > 0) continue
            marks[i] = rand() < 0.5 ? N.SEA : rand() < 0.5 ? N.DOT : N.BLANK
          }
        }
        if (b === 39) marks = marks.map((m, i) => (clue[i] > 0 ? m : [N.BLANK, N.SEA, N.DOT][rint(3)])) // noise
        boards++
        const a = N.analyze(p, marks)
        // solved is the same as: the sea is the answer (the puzzle has one answer)
        const seaSet = new Set()
        marks.forEach((m, i) => m === N.SEA && clue[i] === 0 && seaSet.add(i))
        const should = validSea(w, h, clue, seaSet)
        if (!ok(a.solved === should, `${lv.id} board ${b}: the engine says solved=${a.solved}, the rules say ${should}`)) continue
        if (a.solved) solvedBoards++
        if (a.solved) ok(a.conflicts.length === 0, `${lv.id} board ${b}: solved with conflicts`)
        for (const c of a.conflicts) {
          kinds.add(c.kind)
          ok(conflictOk(p, marks, c), `${lv.id} board ${b}: a conflict of kind ${c.kind} that is not one: cells ${c.cells}`)
        }
        // a board that is not solved but reports no conflict is fine (not finished); a board with a rule broken for good must report it:
        // a 2x2 block of sea, written here
        let pool = false
        for (let y = 0; y + 1 < h; y++) for (let x = 0; x + 1 < w; x++) if ([0, 1, w, w + 1].every((d) => marks[y * w + x + d] === N.SEA && clue[y * w + x + d] === 0)) pool = true
        ok(pool === a.conflicts.some((c) => c.kind === 'pool'), `${lv.id} board ${b}: pool ${pool} but the engine reports ${a.conflicts.map((c) => c.kind)}`)
      }
    }
  }
  ok(solvedBoards >= 200, `${solvedBoards} of ${boards} boards were solved (right answers, with and without dots)`)
  ok(['pool', 'too-big', 'two-clues', 'too-small', 'no-clue', 'split'].every((k) => kinds.has(k)), `every kind of conflict was met on the boards (${[...kinds]})`)

  // hand-made boards, one for each kind of conflict
  const m = (s) => [...s].map((c) => (c === 's' ? N.SEA : c === 'd' ? N.DOT : N.BLANK))
  const board = (w, h, clue) => ({ id: 'h', w, h, clue, solution: new Array(w * h).fill(false) })
  const three = board(3, 3, [3, 0, 0, 0, 0, 0, 0, 0, 1])
  const kindsOf = (p, marks) => N.analyze(p, marks).conflicts.map((c) => c.kind)
  ok(kindsOf(three, m('.ss.ss...')).includes('pool'), 'a 2x2 block of sea is a pool')
  ok(!kindsOf(three, m('.s.s.s.s.')).includes('pool'), 'sea cells that touch only at corners are no pool')
  ok(!kindsOf(three, m('ss.ss....')).includes('pool'), 'a cell with a number is land even when it is marked as sea')
  ok(kindsOf(three, m('.ddd.....')).includes('too-big'), 'a 3 with three dots joined to it is too big')
  ok(!kindsOf(three, m('.dd......')).includes('too-big'), 'a 3 with two dots is just big enough')
  ok(kindsOf(three, m('.dd..d...')).includes('two-clues'), 'two numbers joined by dots are in one island')
  ok(!kindsOf(three, m('.d.......')).includes('two-clues'), 'one number with a dot is no conflict')
  ok(kindsOf(three, m('.s.s.....')).includes('too-small'), 'a 3 shut in by sea in a corner has one cell')
  ok(!kindsOf(three, m('.s.......')).includes('too-small'), 'a 3 with room left is no conflict')
  ok(kindsOf(three, m('.s.sds.s.')).includes('no-clue'), 'a dot that is shut in without a number belongs to nothing')
  ok(!kindsOf(three, m('.s.sds...')).includes('no-clue'), 'a dot that can still reach a number is no conflict')
  const row = board(5, 1, [0, 0, 3, 0, 0])
  ok(kindsOf(row, [N.SEA, N.DOT, N.BLANK, N.DOT, N.SEA]).includes('split'), 'sea on both sides of land cannot be joined')
  ok(!kindsOf(three, m('.s.s.....')).includes('split'), 'sea that can still be joined through an open cell is no conflict')
  ok(N.analyze(three, N.emptyMarks(three)).conflicts.length === 0 && !N.analyze(three, N.emptyMarks(three)).solved, 'an empty grid has no conflict and is not solved')
  ok(N.nextMark(N.BLANK) === N.SEA && N.nextMark(N.SEA) === N.DOT && N.nextMark(N.DOT) === N.BLANK, 'a press goes empty, sea, dot, empty')
}

lap('rules on boards')
/* ------------------------------------------------------------------------------------------- what the hint may deduce */
{
  let deductions = 0
  let wrongOnes = 0
  let runs = 0
  for (const tier of TIERS) {
    for (const lv of tier.levels) {
      const p = N.parsePuzzle(lv.id, lv.rows, lv.sea)
      const { clue } = p
      for (let rep = 0; rep < 6; rep++) {
        // marks that are right: some of the answer, shown as it is
        const marks = N.emptyMarks(p).map((_, i) => {
          if (clue[i] > 0 || rand() > (rep + 1) / 8) return N.BLANK
          return p.solution[i] ? N.SEA : N.DOT
        })
        runs++
        const d = N.deduce(p, marks)
        if (!ok(d.ok, `${lv.id} rep ${rep}: marks that are right were taken for impossible`)) continue
        for (const c of d.cells) {
          deductions++
          if (c.sea !== p.solution[c.i]) wrongOnes++
          ok(marks[c.i] === N.BLANK && clue[c.i] === 0, `${lv.id}: a deduction about a cell that is marked or has a number (${c.i})`)
          ok(c.sea === p.solution[c.i], `${lv.id} rep ${rep}: cell ${c.i} is deduced ${c.sea ? 'sea' : 'land'} but the answer says the opposite`)
        }
      }
    }
  }
  ok(deductions >= 300 && wrongOnes === 0, `${deductions} deductions over ${runs} partial boards, ${wrongOnes} wrong`)
  // from nothing, the rules alone decide cells of the easy puzzles
  const first = TIERS[0].levels[0]
  const p0 = N.parsePuzzle(first.id, first.rows, first.sea)
  ok(N.deduce(p0, N.emptyMarks(p0)).cells.length > 0, 'the first puzzle has cells that the rules decide from the start')
  // marks that are wrong can be told: a sea cell on a number is ignored, and an impossible grid is "not ok"
  const wrongMarks = N.emptyMarks(p0).map((_, i) => (p0.clue[i] === 0 ? N.SEA : N.BLANK))
  ok(N.deduce(p0, wrongMarks).ok === false, 'a grid that is all sea cannot be completed')
}

lap('hint')
/* ------------------------------------------------------------------------------------------- the saved progress */
{
  const ids = N.PUZZLE_IDS
  ok(JSON.stringify(N.parseProgress(['n5-01', 'n9-08'], ids)) === JSON.stringify({ 'n5-01': true, 'n9-08': true }), 'saved progress (a list of ids) is read back')
  ok(JSON.stringify(N.parseProgress(['zz', 7, null, { a: 1 }, 'n5-01', 'n5-01'], ids)) === JSON.stringify({ 'n5-01': true }), 'what is malformed is dropped, and so are ids that do not exist')
  ok(Object.keys(N.parseProgress(null, ids)).length === 0 && Object.keys(N.parseProgress({ 'n5-01': true }, ids)).length === 0 && Object.keys(N.parseProgress('n5-01', ids)).length === 0, 'nothing from what is not a list')
  ok(N.starsFor === undefined, 'there are no stars: a puzzle is solved or not')
}

/* ------------------------------------------------------------------------------------------- reading a puzzle */
{
  let threw = 0
  const tryParse = (rows, sea) => {
    try {
      N.parsePuzzle('x', rows, sea)
    } catch {
      threw++
    }
  }
  tryParse(['1 .', '. .'], ['#.', '##', '..']) // rows of the answer do not match
  tryParse(['1 .', '.'], ['#.', '##']) // a short row
  tryParse(['1 x', '. .'], ['#.', '##']) // not a number
  tryParse(['1 0', '. .'], ['#.', '##']) // 0 is not a number
  tryParse(['1 .', '. .'], ['#.', '#?']) // not # or .
  ok(threw === 5, `five malformed puzzles are refused (${threw})`)
  const p = N.parsePuzzle('ok', ['3 . .', '. . 1'], ['.##', '#..'])
  ok(p.w === 3 && p.h === 2 && p.clue.join() === '3,0,0,0,0,1' && p.solution.join() === 'false,true,true,true,false,false', 'a puzzle is read: size, numbers, answer')
}

/* ------------------------------------------------------------------------------------------- texts and wiring */
{
  const game = N.GAMES.find((g) => g.id === 'nurikabe')
  if (ok(game, 'the game is in the list')) {
    const others = N.GAMES.filter((g) => g.id !== 'nurikabe')
    ok(game.slug.en === 'nurikabe' && game.slug.id === 'nurikabe' && others.every((o) => o.slug.en !== game.slug.en && o.slug.id !== game.slug.id), 'its addresses are its own')
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
    // the rules in the text are the rules of the engine
    const rules = section('the-rules').text.en
    ok(/exactly one/.test(rules) && /one piece/.test(rules) && /2×2/.test(rules), 'the rules table names the three rules')
  }
  const page = read('src/pages/GamePage.tsx')
  ok(/import NurikabeGame from '..\/components\/games\/NurikabeGame'/.test(page) && /nurikabe: \(\) => <NurikabeGame \/>/.test(page), 'the game page shows the game')
  ok(/GameId = [^\n]*'nurikabe'/.test(read('src/content/games.ts')), 'GameId has the game')
  ok(/"check:nurikabe": "node tools\/check-nurikabe.mjs"/.test(read('package.json')) && /npm run check:nurikabe/.test(read('.github/workflows/deploy.yml')), 'the check is in package.json and in the deploy workflow')
  ok(N.COVER_IDS.includes('nurikabe') && /<svg/.test(N.gameCoverSvg('nurikabe')) && !/\d\.\d/.test(N.gameCoverSvg('nurikabe')), 'the game has a cover, with no decimal point in it')

  const ui = read('src/components/games/NurikabeGame.tsx')
  ok(/nunada\.nurikabe\.v1/.test(ui) && /onPointerDown/.test(ui) && /onPointerMove/.test(ui) && /onKeyDown/.test(ui) && /e\.key === 'z'/.test(ui) && /e\.key === 'r'/.test(ui), 'the keys, the drag and the saved progress are wired')
  ok(/aria-live="polite"/.test(ui) && /role="application"/.test(ui) && /sr-only/.test(ui), 'a screen reader is told where the cursor is and what it is on')
  ok(!/starsFor|Stars|nmstars/.test(ui) && /deduce\(puzzle/.test(ui) && /analyze\(puzzle/.test(ui), 'no stars; the hint uses the deductions and the board uses the rules of the engine')
  ok(/clue\[i\] > 0\) return|clue\[i\] > 0\)/.test(ui), 'a cell with a number cannot be changed')

  const css = read('src/styles.css')
  const at = css.indexOf('/* ---- Nurikabe.')
  const end = css.indexOf('/* ---- ', at + 10)
  const nk = css.slice(at, end < 0 ? undefined : end)
  ok(nk.length > 1200, 'the styles of the game')
  ok((nk.match(/--nk-sea:/g) ?? []).length === 3 && /prefers-color-scheme: dark/.test(nk) && /data-theme="dark"/.test(nk), 'the sea color is defined for light, dark by system and dark by choice')
  ok(/\.nkc\.bad \{[^}]*--bad/.test(nk) && !/--fig-b|\bred\b/.test(nk.replace(/Red is only[^.]*\./, '').replace(/never for sea[^.]*\./, '')), 'red is used only for the cells that break a rule')
  ok(/touch-action: none/.test(nk) && /grid-template-columns: repeat\(var\(--cols\), var\(--cell\)\)/.test(nk), 'the board is a grid of square cells that does not scroll the page when dragged')
  ok(/\.nkc\.sea \{[^}]*background: var\(--nk-sea\)/.test(nk) && /\.nkc\.dot::after/.test(nk), 'sea is filled in and a dot is drawn, so they are told apart without color')
}

console.log(`nurikabe check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
