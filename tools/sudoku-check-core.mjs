// The checks of Sudoku and Sum Sudoku, which share one engine (src/lib/sudoku.ts); tools/check-sudoku.mjs and tools/check-sumsudoku.mjs call this with the game they check.
//
// Nothing is taken on trust from the engine:
//   - a second solver that shares nothing with it (Dancing Links, tools/sudoku-lib.mjs) must find exactly one answer for every puzzle, the answer that is in the data;
//   - on thousands of random small puzzles (most of which have no answer, or several) the engine's solver, the second solver and, on 4x4, a count over all 288 grids must agree;
//   - the rules on a filled-in grid ("solved", and every kind of conflict) are written again here and compared on thousands of boards: the answer with mistakes put in, and noise;
//   - what the hint can deduce is checked against the answer: from digits that are right it may never say anything that is not so, and its reasons are checked;
//   - the claim of the tiers is checked: the easy and medium puzzles are solved by the deductions alone, the hard ones are not;
//   - the texts, the wiring, the styles and the saved progress.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { allGrids4, bruteCount4, dlxCount, loadEngine, rng, shape } from './sudoku-lib.mjs'

export async function check(kind) {
  const SUM = kind === 'sum'
  const ID = SUM ? 'sum-sudoku' : 'sudoku'
  const N = await loadEngine([SUM ? 'src/content/sumsudoku.ts' : 'src/content/sudoku.ts', 'src/content/games.ts', 'src/content/gamecovers.ts'])
  const ROOT = process.cwd()
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
  const rand = rng(SUM ? 4242 : 777)
  const rint = (n) => Math.floor(rand() * n)
  const shuffle = (list) => {
    const a = list.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = rint(i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  /* ----------------------------------------------------------------------------------------------- the rules, written again */
  const geometry = (n) => {
    const [br, bc] = shape(n)
    const units = []
    for (let r = 0; r < n; r++) units.push(['row', Array.from({ length: n }, (_, c) => r * n + c)])
    for (let c = 0; c < n; c++) units.push(['col', Array.from({ length: n }, (_, r) => r * n + c)])
    const boxes = new Map()
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        const b = Math.floor(r / br) * (n / bc) + Math.floor(c / bc)
        if (!boxes.has(b)) boxes.set(b, [])
        boxes.get(b).push(r * n + c)
      }
    for (const cells of boxes.values()) units.push(['box', cells])
    return units
  }
  /** every conflict of a board as strings, and whether it is solved */
  function rulesOf(n, cages, marks) {
    const out = []
    for (const [k, cells] of geometry(n)) for (let d = 1; d <= n; d++) {
      const at = cells.filter((c) => marks[c] === d)
      if (at.length > 1) out.push(`${k}:${at.slice().sort((a, b) => a - b).join(',')}`)
    }
    for (const cage of cages ?? []) {
      const digits = cage.cells.map((c) => marks[c])
      for (let d = 1; d <= n; d++) {
        const at = cage.cells.filter((c) => marks[c] === d)
        if (at.length > 1) out.push(`cage-dup:${at.slice().sort((a, b) => a - b).join(',')}`)
      }
      const filled = digits.filter((d) => d !== 0)
      const left = cage.cells.length - filled.length
      const rem = cage.sum - filled.reduce((a, b) => a + b, 0)
      const free = []
      for (let d = 1; d <= n; d++) if (!filled.includes(d)) free.push(d)
      let broken
      if (left === 0) broken = rem !== 0
      else {
        let lo = 0
        let hi = 0
        for (let k = 0; k < left; k++) {
          lo += free[k] ?? 1000
          hi += free[free.length - 1 - k] ?? -1000
        }
        broken = free.length < left || rem < lo || rem > hi
      }
      if (broken) out.push(`cage-sum:${cage.cells.slice().sort((a, b) => a - b).join(',')}`)
    }
    return { list: out.sort(), solved: out.length === 0 && marks.every((m) => m !== 0) }
  }
  const engineRules = (p, marks) => {
    const a = N.analyze(p, marks)
    return { list: a.conflicts.map((c) => `${c.kind}:${c.cells.slice().sort((x, y) => x - y).join(',')}`).sort(), solved: a.solved }
  }
  /** what a cell could hold by its row, column and box, written again */
  const plainCands = (n, marks) => {
    const units = geometry(n)
    return Array.from({ length: n * n }, (_, i) => {
      if (marks[i] !== 0) return new Set([marks[i]])
      const set = new Set(Array.from({ length: n }, (_, d) => d + 1))
      for (const [, cells] of units) if (cells.includes(i)) for (const c of cells) if (marks[c] !== 0) set.delete(marks[c])
      return set
    })
  }

  /* ----------------------------------------------------------------------------------------------- the puzzles */
  const TIERS = N.TIER_LIST
  const toPuzzle = (lv) => N.parsePuzzle(lv.id, { rows: lv.rows, sol: lv.sol, cages: lv.cages })
  const plainOf = (p) => ({ id: p.id, n: p.n, br: p.br, bc: p.bc, given: p.given, solution: p.solution, cages: p.cages })
  ok(TIERS.length === 5 && TIERS.map((t) => t.levels.length).join() === '8,8,8,8,8', 'five tiers of eight puzzles')
  ok(TIERS.map((t) => t.size).join() === '4,6,9,9,9', 'the sizes of the tiers')
  const all = TIERS.flatMap((t) => t.levels)
  ok(all.length === 40 && new Set(all.map((l) => l.id)).size === 40 && N.PUZZLE_IDS.length === 40, '40 puzzles with different ids')
  const keys = all.map((l) => (SUM ? l.cages.map(([s, c]) => s + ':' + c.join(',')).join('|') : l.rows.join('|')))
  ok(new Set(keys).size === 40, 'no puzzle is there twice')
  const solKeys = new Set(all.map((l) => l.sol.join('')))
  ok(solKeys.size >= 30, 'the puzzles do not all share a few answers')
  const info = []
  for (const t of TIERS) {
    for (const lv of t.levels) {
      const p = toPuzzle(lv)
      ok(p.n === t.size, `${lv.id}: the size of the grid is the size of its tier`)
      ok(SUM ? !!lv.cages && !lv.rows : !!lv.rows && !lv.cages, `${lv.id}: ${SUM ? 'cages and no given digits' : 'given digits and no cages'}`)
      // the answer, checked on its own
      const sol = p.solution
      ok(rulesOf(p.n, p.cages, sol).solved, `${lv.id}: the stored answer keeps every rule`)
      // the second solver
      const t0 = Date.now()
      const d = dlxCount(plainOf(p), 3)
      ok(d.count === 1 && !d.exhausted && d.first.join('') === sol.join(''), `${lv.id}: Dancing Links finds exactly one answer, the stored one (found ${d.count})`)
      const e = N.solvePuzzle(p, 3, 5000)
      ok(e.count === 1 && !e.exhausted && e.solution.join('') === sol.join(''), `${lv.id}: the engine finds exactly one answer, the stored one (found ${e.count})`)
      ok(Date.now() - t0 < 5000, `${lv.id}: both solvers are quick`)
      // the givens are what the answer has
      ok(p.given.every((g, i) => g === 0 || g === sol[i]), `${lv.id}: the given digits are in the answer`)
      const givens = p.given.filter((g) => g !== 0).length
      if (SUM) {
        // the cages: a partition, connected, different digits, the sum of the answer; a cage of one cell is given
        const seen = new Set()
        for (const [sum, cells] of lv.cages) {
          for (const c of cells) {
            ok(!seen.has(c) && c >= 0 && c < p.n * p.n, `${lv.id}: cell ${c} is in one cage only`)
            seen.add(c)
          }
          ok(cells.reduce((a, c) => a + sol[c], 0) === sum, `${lv.id}: a cage adds up`)
          ok(new Set(cells.map((c) => sol[c])).size === cells.length, `${lv.id}: a cage has no digit twice`)
          ok(cells.length <= 5, `${lv.id}: a cage has at most five cells`)
          const set = new Set(cells.slice(1))
          const todo = [cells[0]]
          while (todo.length) {
            const c = todo.pop()
            for (const j of [c - p.n, c + p.n, c % p.n > 0 ? c - 1 : -1, c % p.n < p.n - 1 ? c + 1 : -1]) if (set.delete(j)) todo.push(j)
          }
          ok(set.size === 0, `${lv.id}: a cage is in one piece`)
          if (cells.length === 1) ok(p.given[cells[0]] === sum, `${lv.id}: a cage of one cell is a digit that is given`)
        }
        ok(seen.size === p.n * p.n, `${lv.id}: the cages cover the grid`)
      }
      info.push({ tier: t.id, id: lv.id, nodes: e.nodes, givens, cages: p.cages ? p.cages.length : 0, size: p.n, puzzle: p })
    }
  }
  // each tier climbs
  for (const t of TIERS) {
    const rows = info.filter((x) => x.tier === t.id)
    const measure = (x) => (SUM ? -x.cages : -x.givens)
    if (t.id === 's9h') ok(rows.every((x, i) => i === 0 || x.nodes >= rows[i - 1].nodes), `${t.id}: the puzzles climb (the search gets longer)`)
    else ok(rows.every((x, i) => i === 0 || measure(x) >= measure(rows[i - 1])), `${t.id}: the puzzles climb (${SUM ? 'fewer cages' : 'fewer given digits'})`)
  }
  const at = (id) => info.filter((x) => x.tier === id)
  ok(info.filter((x) => x.tier !== 's9h').every((x) => x.nodes === 1), 'every puzzle but the hard ones needs no trying of digits')
  ok(at('s9h').every((x) => x.nodes >= 4), 'the hard 9x9 puzzles need trying a digit')
  if (SUM) {
    ok(at('s9e').every((x) => x.cages >= 42) && at('s9m').every((x) => x.cages <= 38 && x.cages >= 28) && at('s9h').every((x) => x.cages <= 32), 'the cage counts of the 9x9 tiers')
  } else {
    ok(at('s9e').every((x) => x.givens >= 34) && at('s9m').every((x) => x.givens <= 30 && x.givens >= 22) && at('s4').every((x) => x.givens >= 4), 'the given digits of the tiers')
  }

  /* ----------------------------------------------------------------------------------------------- random puzzles: engine, second solver, brute force */
  /** a random full grid, by a randomized search */
  const randomGrid = (n) => {
    const [br, bc] = shape(n)
    const g = new Array(n * n).fill(0)
    const ok2 = (i, d) => {
      const r = Math.floor(i / n)
      const c = i % n
      for (let j = 0; j < i; j++) {
        if (g[j] !== d) continue
        const rj = Math.floor(j / n)
        const cj = j % n
        if (rj === r || cj === c || (Math.floor(rj / br) === Math.floor(r / br) && Math.floor(cj / bc) === Math.floor(c / bc))) return false
      }
      return true
    }
    const rec = (i) => {
      if (i === n * n) return true
      for (const d of shuffle(Array.from({ length: n }, (_, k) => k + 1))) {
        if (!ok2(i, d)) continue
        g[i] = d
        if (rec(i + 1)) return true
        g[i] = 0
      }
      return false
    }
    rec(0)
    return g
  }
  const gridFrom6 = () => randomGrid(6)
  const randomCages = (n, grid) => {
    const N2 = n * n
    const cageOf = new Array(N2).fill(-1)
    const cages = []
    for (const start of shuffle([...Array(N2).keys()])) {
      if (cageOf[start] >= 0) continue
      const cells = [start]
      cageOf[start] = cages.length
      const target = 1 + rint(4)
      while (cells.length < target) {
        const edge = []
        for (const c of cells)
          for (const j of [c - n, c + n, c % n > 0 ? c - 1 : -1, c % n < n - 1 ? c + 1 : -1]) if (j >= 0 && j < N2 && cageOf[j] < 0) edge.push(j)
        if (!edge.length) break
        const j = edge[rint(edge.length)]
        cells.push(j)
        cageOf[j] = cages.length
      }
      cells.sort((a, b) => a - b)
      let sum = cells.reduce((a, c) => a + grid[c], 0)
      if (rand() < 0.2) sum += rand() < 0.5 ? 1 : -1 // now and then a sum that the grid does not have
      cages.push({ sum, cells })
    }
    return cages
  }
  const agree = { n4: 0, n6: 0 }
  for (let k = 0; k < (SUM ? 1500 : 1500); k++) {
    const n = 4
    const grid = randomGrid(n)
    const given = grid.map((d) => (rand() < (SUM ? 0.08 : 0.3) ? d : 0))
    if (rand() < 0.15 && given.some((d) => d)) given[given.findIndex((d) => d)] = 1 + rint(4) // a given that may be wrong
    const cages = SUM ? randomCages(n, grid) : null
    const p = { id: 'r', n, br: 2, bc: 2, given, solution: grid, cages }
    const brute = bruteCount4(p)
    const dl = dlxCount(p, 1000)
    const en = N.solvePuzzle(p, 1000, 1_000_000)
    ok(dl.count === brute && en.count === brute && !en.exhausted, `random 4x4 puzzle ${k}: brute ${brute}, Dancing Links ${dl.count}, engine ${en.count}`)
    if (dl.count === brute && en.count === brute) agree.n4++
    // every answer the engine found is a real one
    for (const s of en.all.slice(0, 5)) ok(rulesOf(n, cages, s).solved && given.every((g, i) => g === 0 || g === s[i]), `random 4x4 puzzle ${k}: an answer of the engine keeps the rules`)
  }
  for (let k = 0; k < (SUM ? 250 : 250); k++) {
    const n = 6
    const grid = gridFrom6()
    const given = grid.map((d) => (rand() < (SUM ? 0.05 : 0.22) ? d : 0))
    const cages = SUM ? randomCages(n, grid) : null
    const p = { id: 'r', n, br: 2, bc: 3, given, solution: grid, cages }
    const dl = dlxCount(p, 4)
    const en = N.solvePuzzle(p, 4, 300_000)
    ok(!en.exhausted && dl.count === en.count, `random 6x6 puzzle ${k}: Dancing Links ${dl.count}, engine ${en.count}`)
    if (dl.count === en.count) agree.n6++
  }
  ok(agree.n4 >= 1480 && agree.n6 >= 240, 'the solvers agreed on nearly all the random puzzles')

  /* ----------------------------------------------------------------------------------------------- the rules on boards */
  let boards = 0
  for (const x of info) {
    const p = x.puzzle
    const n = p.n
    for (let k = 0; k < (n === 9 ? 70 : 90); k++) {
      const marks = p.solution.slice()
      const mode = k % 5
      if (mode === 1) for (let j = 0; j < 1 + rint(4); j++) marks[rint(n * n)] = 0
      else if (mode === 2) for (let j = 0; j < 1 + rint(3); j++) marks[rint(n * n)] = 1 + rint(n)
      else if (mode === 3) for (let i = 0; i < n * n; i++) marks[i] = rand() < 0.5 ? 1 + rint(n) : 0
      else if (mode === 4) for (let i = 0; i < n * n; i++) if (p.given[i] === 0 && rand() < 0.6) marks[i] = rand() < 0.5 ? 0 : 1 + rint(n)
      const mine = rulesOf(n, p.cages, marks)
      const theirs = engineRules(p, marks)
      boards++
      ok(mine.solved === theirs.solved && mine.list.join('|') === theirs.list.join('|'), `${x.id}: the rules on a board (mode ${mode}): ${mine.list.join(' ')} against ${theirs.list.join(' ')}`)
    }
    // the answer is solved, a board with one cell empty is not
    ok(engineRules(p, p.solution).solved, `${x.id}: the answer is solved`)
    const hole = p.solution.slice()
    hole[rint(n * n)] = 0
    ok(!engineRules(p, hole).solved, `${x.id}: a board with an empty cell is not solved`)
  }

  /* ----------------------------------------------------------------------------------------------- the hint */
  const WHY = new Set(['last-candidate', 'only-place', 'cage', 'chain'])
  let hints = 0
  for (const x of info) {
    const p = x.puzzle
    const n = p.n
    const units = geometry(n)
    for (let k = 0; k < (n === 9 ? 24 : 40); k++) {
      // digits that are right: the givens and a random share of the rest
      const share = [0.1, 0.3, 0.5, 0.7, 0.9, 0.97][k % 6]
      const marks = p.solution.map((d, i) => (p.given[i] !== 0 || rand() < share ? d : 0))
      if (k % 6 === 5 && marks.some((m) => m === 0)) {
        // leave exactly one cell empty
        const keep = rint(n * n)
        for (let i = 0; i < n * n; i++) marks[i] = i === keep ? 0 : p.solution[i]
      }
      const d = N.deduce(p, marks)
      hints++
      ok(d.ok === true, `${x.id}: from right digits the board can be completed (hint ${k})`)
      const empty = marks.filter((m) => m === 0).length
      if (empty === 0) {
        ok(d.cells.length === 0, `${x.id}: nothing to deduce on a full board`)
        continue
      }
      const pc = plainCands(n, marks)
      for (const c of d.cells) {
        ok(marks[c.i] === 0 && c.digit === p.solution[c.i] && WHY.has(c.why), `${x.id}: the hint says ${c.digit} for cell ${c.i}, the answer has ${p.solution[c.i]} (${c.why})`)
        if (c.why === 'last-candidate') ok(pc[c.i].size === 1 && pc[c.i].has(c.digit), `${x.id}: last candidate really is the only one`)
        if (c.why === 'only-place')
          ok(
            units.some(([, cells]) => cells.includes(c.i) && !cells.some((q) => marks[q] === c.digit) && cells.filter((q) => marks[q] === 0 && pc[q].has(c.digit)).length === 1),
            `${x.id}: only place really is the only place`,
          )
        if (!SUM) ok(c.why !== 'cage', `${x.id}: a plain Sudoku has no cage reason`)
      }
      if (d.cells.length === 0) ok(d.fewest !== null && marks[d.fewest] === 0, `${x.id}: when nothing follows the hint names an empty cell`)
      if (empty === 1) ok(d.cells.length === 1 && d.cells[0].digit === p.solution[d.cells[0].i], `${x.id}: the last empty cell is deduced`)
      // the reasons are ranked: when there is a cell with a single candidate, only those are named
      const singles = pc.map((s, i) => (marks[i] === 0 && s.size === 1 ? i : -1)).filter((i) => i >= 0)
      if (singles.length) ok(d.cells.length === singles.length && d.cells.every((c) => c.why === 'last-candidate'), `${x.id}: a cell with one candidate is named first`)
    }
    // a wrong digit that breaks a row is noticed as a board that cannot be completed
    const wrong = p.solution.map((d, i) => (p.given[i] !== 0 ? d : 0))
    const cell = wrong.findIndex((d) => d === 0)
    if (cell >= 0) {
      const mate = p.solution.findIndex((d, i) => i !== cell && Math.floor(i / n) === Math.floor(cell / n) && wrong[i] === 0)
      if (mate >= 0) {
        wrong[cell] = p.solution[mate]
        wrong[mate] = p.solution[mate]
        ok(N.deduce(p, wrong).ok === false, `${x.id}: a digit twice in a row is a board that cannot be completed`)
      }
    }
  }
  // the deductions alone: the tiers that claim it are finished by them; the hard ones are not
  const solveByHints = (p) => {
    const marks = p.given.slice()
    const used = new Set()
    for (let guard = 0; guard < 100; guard++) {
      if (marks.every((m) => m !== 0)) return { done: true, used }
      const d = N.deduce(p, marks)
      if (!d.ok || d.cells.length === 0) {
        // when the rules stop, the hint still names an empty cell that has the fewest digits left
        if (d.ok) ok(d.fewest !== null && marks[d.fewest] === 0, 'when the rules stop the hint names an empty cell')
        if (d.ok && d.fewest !== null) {
          const pc = plainCands(p.n, marks)
          const least = Math.min(...pc.map((c, i) => (marks[i] === 0 ? c.size : 99)))
          ok(d.fewest !== null && marks[d.fewest] === 0 && pc[d.fewest].size >= least, 'the cell named is not one with more candidates than the least')
        }
        return { done: false, used }
      }
      for (const c of d.cells) {
        used.add(c.why)
        marks[c.i] = c.digit
      }
    }
    return { done: false, used }
  }
  for (const x of info) {
    const r = solveByHints(x.puzzle)
    if (x.tier === 's9h') ok(!r.done, `${x.id}: a hard puzzle is not finished by the deductions alone`)
    else ok(r.done, `${x.id}: the deductions alone finish the puzzle`)
    if (!SUM && x.tier !== 's9h') ok(!r.used.has('chain'), `${x.id}: in a plain Sudoku the deductions are all of the two simple kinds`)
  }
  if (SUM) ok(info.some((x) => solveByHints(x.puzzle).used.has('cage')), 'some puzzle needs the cage reason')

  /* ----------------------------------------------------------------------------------------------- the small functions */
  ok(JSON.stringify(N.parseProgress(['s4-01', 's4-99', 7, null, 's4-01'], N.PUZZLE_IDS)) === JSON.stringify({ 's4-01': true }), 'progress keeps only the ids of puzzles')
  ok(Object.keys(N.parseProgress('x', N.PUZZLE_IDS)).length === 0 && Object.keys(N.parseProgress(null, N.PUZZLE_IDS)).length === 0, 'progress that is not a list is nothing')
  ok(N.digitOfKey('5', 9) === 5 && N.digitOfKey('5', 4) === null && N.digitOfKey('0', 9) === null && N.digitOfKey('a', 9) === null && N.digitOfKey('9', 9) === 9, 'a key is a digit only when it fits the grid')
  ok(N.boxShape(4).join() === '2,2' && N.boxShape(6).join() === '2,3' && N.boxShape(9).join() === '3,3', 'the boxes')
  let threw = 0
  for (const f of [() => N.boxShape(5), () => N.parsePuzzle('x', { sol: ['1234', '3412', '2143', '4321'].slice(0, 3) }), () => N.parsePuzzle('x', { sol: ['1234', '3412', '2143', '4322'] }), () => N.parsePuzzle('x', { sol: ['1234', '3412', '2143', '4321'], rows: ['2...', '....', '....', '....'] })]) {
    try {
      f()
    } catch {
      threw++
    }
  }
  ok(threw === 4, 'a puzzle that is not one is refused')
  // a cage that is not right is refused for the reason that it is not right
  const SOL4 = ['1234', '3412', '2143', '4321']
  const refused = (cages, why) => {
    try {
      N.parsePuzzle('x', { sol: SOL4, cages })
      ok(false, `a cage that ${why} is refused`)
    } catch (e) {
      ok(new RegExp(why).test(String(e.message)), `a cage that ${why} is refused for that reason (${e.message})`)
    }
  }
  const rowsCages = [[10, [0, 1, 2, 3]], [10, [4, 5, 6, 7]], [10, [8, 9, 10, 11]], [10, [12, 13, 14, 15]]]
  ok(N.parsePuzzle('x', { sol: SOL4, cages: rowsCages }).cages.length === 4, 'four cages that are the four rows are read')
  refused([[11, [0, 1, 2, 3]], ...rowsCages.slice(1)], 'adds up')
  refused([[9, [0, 4, 5, 6]], [9, [1, 2, 3]], [6, [7, 11, 15]], [7, [8, 9, 10]], [9, [12, 13, 14]]], 'digit twice')
  refused([[5, [0, 3]], [5, [1, 2]], [10, [4, 5, 6, 7]], [10, [8, 9, 10, 11]], [10, [12, 13, 14, 15]]], 'one piece')
  refused([[10, [0, 1, 2, 3]], [10, [4, 5, 6, 7]], [10, [8, 9, 10, 11]], [10, [8, 9, 10, 11]]], 'two cages|cover')
  try {
    N.parsePuzzle('x', { sol: ['1234', '3412', '2143', '4321'], cages: [[3, [0, 1]], [7, [2, 3]]] })
    ok(false, 'cages that do not cover the grid are refused')
  } catch {
    ok(true, '')
  }
  try {
    N.parsePuzzle('x', { sol: ['1234', '3412', '2143', '4321'], cages: [[4, [0, 1]], [7, [2, 3]], [3, [4, 5, 6, 7]]] })
    ok(false, 'a cage with the wrong sum is refused')
  } catch {
    ok(true, '')
  }

  /* ----------------------------------------------------------------------------------------------- the text, the wiring, the styles */
  const game = N.GAMES.find((g) => g.id === ID)
  ok(!!game, 'the game is in GAMES')
  if (game) {
    ok(game.slug.en === ID && (game.slug.id === ID || game.slug.id.length > 2), 'the slugs')
    ok(N.GAMES.filter((g) => g.slug.en === game.slug.en || g.slug.id === game.slug.id).length === 1, 'the slug is not used by another game')
    const section = (id) => game.sections.find((s) => s.id === id)
    for (const loc of ['en', 'id']) {
      const everything = [game.answer, game.description, ...game.sections.map((s) => s.text), ...game.faq.map((f) => f.a)].map((x) => x[loc]).join('\n')
      ok(/\b40\b/.test(everything), `${loc}: the text says 40 puzzles`)
      ok(!/(^|[^*\w])\*[^*\s][^*\n]*\*([^*]|$)/m.test(everything), `${loc}: no *word* emphasis`)
      ok(!/\b(stars?|bintang)\b/i.test(everything), `${loc}: no stars (a puzzle is solved or not)`)
      ok(!/\b(colour|neighbour|centre|favour)/i.test(everything), `${loc}: US spelling`)
      ok(!/\b(tetikus|berkas|tautan|peramban)\b/i.test(everything), `${loc}: Indonesian keeps the English computer words`)
      ok(game.title[loc].length > 8 && game.tagline[loc].length > 8 && game.description[loc].length > 100, `${loc}: title, tagline and description`)
    }
    const sizes = section('sizes')
    ok(!!sizes, 'a sizes section')
    if (sizes) {
      for (const t of TIERS) for (const loc of ['en', 'id']) ok(new RegExp(`\\| ${t.size}×${t.size} [^|]+\\| ${t.levels.length} \\|`).test(sizes.text[loc]), `the sizes table: ${t.size}×${t.size} with ${t.levels.length} puzzles (${loc})`)
    }
    ok(section('how-to-play') && section('the-rules') && section('how-to-solve') && game.faq.length >= 6 && game.teaches.length >= 4 && game.keywords.en.split(',').length >= 8, 'the sections, the FAQ and what it teaches')
    ok(game.seoTitle.en.length <= 72 && game.seoTitle.id.length <= 80 && game.description.en.length <= 420 && game.description.id.length <= 480 && /^\*\*/.test(game.answer.en) && /^\*\*/.test(game.answer.id), 'titles and descriptions are of a sensible length')
    ok(/\bsum\b/i.test(game.title.en) === SUM && /\bsum\b/i.test(game.keywords.en) === SUM, 'the title is of the right game')
    const rules = section('the-rules').text.en
    ok(/rows/i.test(rules) && /columns/i.test(rules) && /boxes/i.test(rules) && /Cage sum/.test(rules) === SUM, 'the rules table names the rules')
    // the digits in the examples of Sum Sudoku are right
    if (SUM) {
      const text = section('how-to-solve').text.en + section('the-rules').text.en
      ok(/3 is \{1, 2\}/.test(text) && /4 is \{1, 3\}/.test(text) && /16 is \{7, 9\}/.test(text) && /17 is \{8, 9\}/.test(text) && /sum 6 can only be \{1, 2, 3\}/.test(text), 'the examples of small and big sums')
      ok(7 + 9 === 16 && 8 + 9 === 17 && 1 + 2 + 3 === 6 && 1 + 3 === 4, 'the arithmetic of those examples')
    }
    // the keys the text names are the keys the board has
    const ui0 = read('src/components/games/SudokuGame.tsx')
    for (const key of ['n', 'z', 'r', 'c', 'h', 'f']) ok(new RegExp(`e\\.key === '${key}'`).test(ui0), `the key ${key} is wired`)
  }
  const page = read('src/pages/GamePage.tsx')
  ok(/import SudokuGame, \{ SumSudokuGame \} from '..\/components\/games\/SudokuGame'/.test(page), 'the game page imports the game')
  ok(SUM ? /'sum-sudoku': \(\) => <SumSudokuGame \/>/.test(page) : /sudoku: \(\) => <SudokuGame \/>/.test(page), 'the game page shows the game')
  ok(new RegExp(`GameId = [^\\n]*'${ID}'`).test(read('src/content/games.ts')), 'GameId has the game')
  ok(new RegExp(`"check:${SUM ? 'sumsudoku' : 'sudoku'}": "node tools/check-${SUM ? 'sumsudoku' : 'sudoku'}.mjs"`).test(read('package.json')) && new RegExp(`npm run check:${SUM ? 'sumsudoku' : 'sudoku'}\\b`).test(read('.github/workflows/deploy.yml')), 'the check is in package.json and in the deploy workflow')
  ok(N.COVER_IDS.includes(ID) && /<svg/.test(N.gameCoverSvg(ID)) && !/\d\.\d/.test(N.gameCoverSvg(ID).replace(/stroke-dasharray="[^"]*"/g, '').replace(/(x|y|cx|cy|r|rx|ry|width|height|x1|y1|x2|y2)="[\d.]+"/g, '')), 'the game has a cover, with no decimal point in its text')
  // the cover shows a real puzzle with one answer
  const cover = read('src/content/gamecovers.ts')
  if (SUM) {
    const m = cover.match(/const cages: \[number, number\[\]\]\[\] = (\[\[.*\]\])\r?\n/)
    ok(!!m, 'the cover of Sum Sudoku lists its cages')
    if (m) {
      const cages = JSON.parse(m[1]).map(([sum, cells]) => ({ sum, cells }))
      const given = new Array(16).fill(0)
      for (const c of cages) if (c.cells.length === 1) given[c.cells[0]] = c.sum
      const r = dlxCount({ n: 4, given, cages }, 3)
      ok(r.count === 1 && bruteCount4({ given, cages }) === 1, 'the cover of Sum Sudoku is a puzzle with exactly one answer')
    }
  } else {
    const m = cover.match(/function sudoku\(\)[\s\S]*?const rows = (\[[^\]]*\])/)
    ok(!!m, 'the cover of Sudoku lists its rows')
    if (m) {
      const rows = JSON.parse(m[1].replace(/'/g, '"'))
      const given = rows.join('').split('').map((c) => (c === '.' ? 0 : Number(c)))
      const r = dlxCount({ n: 4, given, cages: null }, 3)
      ok(r.count === 1 && bruteCount4({ given, cages: null }) === 1, 'the cover of Sudoku is a puzzle with exactly one answer')
    }
  }

  const ui = read('src/components/games/SudokuGame.tsx')
  ok(/nunada\.sudoku\.v1/.test(ui) && /nunada\.sumsudoku\.v1/.test(ui) && /onPointerDown/.test(ui) && /onKeyDown/.test(ui), 'the keys, the pointer and the saved progress are wired')
  ok(/aria-live="polite"/.test(ui) && /role="application"/.test(ui) && /sr-only/.test(ui) && /role="group"/.test(ui), 'a screen reader is told where the cursor is and what it is on')
  ok(!/starsFor|Stars/.test(ui) && /deduce\(puzzle/.test(ui) && /analyze\(puzzle/.test(ui) && /candidatesOf\(puzzle/.test(ui), 'no stars; the hint uses the deductions and the board uses the rules of the engine')
  ok(/given\[i\] !== 0\) return/.test(ui), 'a given digit cannot be changed')
  ok(/m\.solution\[i\]|puzzle\.solution\[i\]/.test(ui), 'the hint compares with the answer for a digit that is wrong')

  const css = read('src/styles.css')
  const from = css.indexOf('/* ---- Sudoku and Sum Sudoku.')
  const end = css.indexOf('/* ---- ', from + 10)
  const block = css.slice(from, end < 0 ? undefined : end)
  ok(block.length > 2500, 'the styles of the games')
  ok(!/#[0-9a-fA-F]{3,8}\b/.test(block), 'the styles use only the color tokens of the site, no color of their own')
  ok(/\.sdc\.bad \{[^}]*--bad/.test(block) && /\.sdv|\.sdc\.bad \.sdv \{[^}]*--bad/.test(block) && !/--fig-b|\bred\b/.test(block.replace(/Red is only[^.]*\./, '')), 'red is used only for what breaks a rule')
  // every class the screen uses is styled
  const classes = new Set([...ui.matchAll(/(?:className=|\bcls = |')(?:\{?[`'"])?((?:sd[a-z]+)(?:[ .a-z]*)?)/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => /^sd[a-z]+$/.test(c)))
  ok(classes.size >= 14, `the screen uses its own classes (${classes.size})`)
  for (const c of classes) ok(new RegExp(`\\.${c}\\b`).test(block), `class ${c} is styled`)
  ok(/touch-action: manipulation/.test(block) && /grid-template-columns: repeat\(var\(--n\), var\(--cell\)\)/.test(block) && /prefers-reduced-motion/.test(block), 'the board is a grid of square cells and respects reduced motion')
  ok(/\.sdcg[^{]*\{[^}]*dashed/.test(block) || !SUM, 'a cage is drawn with a dashed line')

  console.log(`${SUM ? 'sum sudoku' : 'sudoku'} check: ${checks} checks, ${bad} failure(s)`)
  process.exit(bad ? 1 : 0)
}
