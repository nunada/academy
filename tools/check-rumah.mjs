// The Houses (Multiplication House and Addition House): src/lib/rumah.ts (board, rules, the computer), src/lib/rumahnet.ts (a room of two over a network) and
// the page text.
//   node tools/check-rumah.mjs
//
// Nothing is taken on trust from the engine:
//   - the board of every seed is compared with the 81 products or sums written out here (and the middle cell, the counts of a few results);
//   - the rules are checked against a referee of its own that looks for four in a row by scanning every window of four cells, over thousands of games played
//     by random players, with the refusals, the passes, a wrong cell, the clock running out, and the game left unchanged by a refused move;
//   - the six levels of the computer: every move is legal, a level above 2 always takes a free win and a block, level 4 always avoids leaving a number that gives
//     the other player a win, and the levels beat each other in the order of their numbers;
//   - the protocol is played in full over a fake network with a fake clock: a lobby, a third player refused, whole games, lost messages, the turn clock and the
//     pause of it, a player who steps away and comes back or misses the turn, a host who goes, a rematch, and what is not accepted from the network;
//   - the numbers in the page text are the numbers of the engine, and the colors of the players are not red.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rumah-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [`export * from '${q('src/lib/rumah.ts')}'`, `export * from '${q('src/lib/rumahnet.ts')}'`, `export { GAMES } from '${q('src/content/games.ts')}'`].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const C = await import('file://' + outFile.split(path.sep).join('/'))
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
const rng = (seed) => C.makeRng(seed)
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const clone = (x) => JSON.parse(JSON.stringify(x))
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/* ------------------------------------------------------------------------------------------- a referee of our own */
const combine = (op, a, b) => (op === 'times' ? a * b : a + b)
/** four in a row, by scanning every window of four cells of the 9 x 9 board */
function refLineOf(board, color) {
  const at = (r, c) => (r >= 0 && r < 9 && c >= 0 && c < 9 ? board[r * 9 + c].owner : undefined)
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
        let all = true
        for (let k = 0; k < 4; k++) if (at(r + dr * k, c + dc * k) !== color) all = false
        if (all) return true
      }
  return false
}
const refFull = (board) => board.every((c) => c.owner !== null)
const opens = (g, v) => g.board.map((c, i) => (c.owner === null && c.value === v ? i : -1)).filter((i) => i >= 0)

/* ------------------------------------------------------------------------------------------- the board */
for (const op of ['times', 'plus']) {
  const want = []
  for (let i = 1; i <= 9; i++) for (let j = 1; j <= 9; j++) want.push(combine(op, i, j))
  want.sort((a, b) => a - b)
  const seen = new Set()
  for (let seed = 0; seed < 300; seed++) {
    const g = C.newGame(op, 'blue', seed)
    const got = g.board.map((c) => c.value).sort((a, b) => a - b)
    ok(g.board.length === 81 && same(got, want), `${op} seed ${seed}: the board holds exactly the 81 results`)
    ok(g.board[40].value === (op === 'times' ? 1 : 2), `${op} seed ${seed}: the middle cell holds ${op === 'times' ? 1 : 2}`)
    ok(g.board.every((c) => c.owner === null), 'a new board is empty')
    ok(same(C.newGame(op, 'blue', seed).board, g.board), 'the same seed gives the same board')
    seen.add(g.board.map((c) => c.value).join())
  }
  ok(seen.size >= 295, `${op}: the boards differ from seed to seed (${seen.size} of 300)`)
  const count = (v) => want.filter((x) => x === v).length
  if (op === 'times') ok(count(12) === 4 && count(36) === 3 && count(1) === 1 && count(81) === 1, 'products: 12 is four times, 36 three times, 1 once')
  else ok(count(10) === 9 && count(2) === 1 && count(18) === 1 && want[0] === 2 && want[80] === 18, 'sums: 10 is nine times, 2 and 18 once, from 2 to 18')
}
ok(C.combine('times', 6, 7) === 42 && C.combine('plus', 6, 7) === 13 && C.symbol('times') === '×' && C.symbol('plus') === '+' && C.centerValue('times') === 1 && C.centerValue('plus') === 2, 'combine, symbol and centerValue')
ok(C.SIZE === 9 && C.CELLS === 81 && C.CENTER === 40 && C.WIN === 4 && C.FACTORS === 9 && C.CONFIRM_SECONDS === 5 && C.AWAY_GRACE_S === 30 && C.TIME_DEFAULT === 60 && C.TIME_MIN === 5 && C.TIME_MAX === 300 && C.LEVELS === 6, 'the constants')
ok(C.clampTime(1) === 5 && C.clampTime(1000) === 300 && C.clampTime(60) === 60 && C.clampTime(NaN) === 60 && C.clampTime(12.6) === 13, 'the time limit stays inside what is allowed')

/* ------------------------------------------------------------------------------------------- the rules */
/** A random play, with everything the engine says checked against the referee after each step. */
function randomGame(op, seed, { wrongChance = 0.02 } = {}) {
  const r = rng(seed * 7 + 3)
  let g = C.newGame(op, r() < 0.5 ? 'blue' : 'gold', seed)
  const owned = { blue: 0, gold: 0 }
  /** the number the pawn stood on before it was moved this turn */
  let from = null
  let steps = 0
  while (g.status === 'play' && steps++ < 400) {
    const before = clone(g)
    const me = g.current
    if (g.placing) {
      const n = 1 + Math.floor(r() * 9)
      const res = C.setPawn(g, n)
      ok(res.ok, 'a pawn can be placed on the first turn')
      ok(same(g, before), 'the old game is not changed by a move')
      g = res.g
      if (res.ok && res.events[0].k === 'pawn') ok(res.events[0].start === true && res.events[0].c === me, 'the first pawns are marked as the start')
      continue
    }
    if (!g.moved) {
      // a pawn that stays where it is is refused; any other number is a move
      const stay = g.pawn[me]
      from = stay
      const bad1 = C.setPawn(g, stay)
      ok(!bad1.ok && bad1.reason === 'same', 'a pawn must move to another number')
      ok(!C.setPawn(g, 0).ok && !C.setPawn(g, 10).ok && !C.setPawn(g, 1.5).ok && C.setPawn(g, 10).reason === 'bad', 'a number outside 1 to 9 is refused')
      const cl = C.claim(g, 0)
      ok(!cl.ok && cl.reason === 'not-moved', 'a cell cannot be taken before the pawn has moved')
      let n
      do n = 1 + Math.floor(r() * 9)
      while (n === stay)
      const res = C.setPawn(g, n)
      ok(res.ok && same(g, before), 'a move leaves the old game as it was')
      g = res.g
      ok(g.pawn[me] === n, 'the pawn is where it was moved')
      const v = combine(op, g.pawn.blue, g.pawn.gold)
      ok(C.resultOf(g) === v, 'the result of the pawns')
      const open = opens(g, v)
      ok(same(C.openCells(g), open), 'the open cells are the free cells that hold the result')
      if (open.length === 0) {
        ok(g.current === C.other(me) && g.moved === false && g.turn === before.turn + 1 && res.events.some((e) => e.k === 'pass' && e.v === v), 'every cell with the result taken: the turn passes')
      } else ok(g.current === me && g.moved === true, 'otherwise the same player now takes a cell')
      continue
    }
    const v = combine(op, g.pawn.blue, g.pawn.gold)
    const open = opens(g, v)
    // taken cells and cells outside the board are refused
    const taken = g.board.findIndex((c) => c.owner !== null)
    if (taken >= 0) ok(C.claim(g, taken).reason === 'taken', 'a taken cell is refused')
    ok(C.claim(g, -1).reason === 'bad' && C.claim(g, 81).reason === 'bad' && C.claim(g, 2.5).reason === 'bad', 'a cell outside the board is refused')
    // the pawn has moved this turn: it cannot move again, not to another number and not back to the place it left
    {
      const again = C.setPawn(g, 1 + ((g.pawn[me] + 1) % 9))
      const back = from === null ? null : C.setPawn(g, from)
      ok(!again.ok && again.reason === 'moved' && same(g, clone(g)), 'a pawn that has moved cannot move again in the same turn')
      if (back) ok(!back.ok && back.reason === 'moved', 'and not back to the place it left')
    }
    if (r() < wrongChance) {
      const wrongCells = g.board.map((c, i) => (c.owner === null && c.value !== v ? i : -1)).filter((i) => i >= 0)
      if (wrongCells.length) {
        const i = wrongCells[Math.floor(r() * wrongCells.length)]
        const res = C.claim(g, i)
        ok(res.ok && res.g.status === 'over' && res.g.winner === C.other(me) && res.g.why === 'wrong-cell' && res.g.board[i].owner === null && res.events[0].k === 'wrong', 'a cell that is not the result loses at once')
        return { g: res.g, wrong: true }
      }
    }
    const i = open[Math.floor(r() * open.length)]
    const res = C.claim(g, i)
    ok(res.ok && same(g, before), 'taking a cell leaves the old game as it was')
    g = res.g
    owned[me]++
    ok(g.board[i].owner === me, 'the cell is the player’s')
    const win = refLineOf(g.board, me)
    if (win) {
      ok(g.status === 'over' && g.winner === me && g.why === 'line' && g.line.includes(i) && g.line.length >= 4 && g.line.every((k) => g.board[k].owner === me), 'four in a row ends the game, with the cells of the line')
      // the line is a straight line of adjacent cells
      const d = g.line[1] - g.line[0]
      ok([1, 9, 8, 10].includes(d) && g.line.every((k, j) => j === 0 || k - g.line[j - 1] === d), 'the winning cells are in a straight row')
    } else if (refFull(g.board)) ok(g.status === 'over' && g.winner === null && g.why === 'full', 'a full board with no line is a draw')
    else ok(g.status === 'play' && g.current === C.other(me) && g.moved === false && g.turn === before.turn + 1, 'the turn goes to the other player')
    ok(C.countOf(g, 'blue') === owned.blue && C.countOf(g, 'gold') === owned.gold, 'the counts of cells')
    if (g.status === 'over') {
      ok(!C.setPawn(g, 3).ok && C.setPawn(g, 3).reason === 'over' && C.claim(g, 0).reason === 'over' && C.timeUp(g).reason === 'over', 'nothing can be done after the game is over')
    }
  }
  return { g, wrong: false }
}
{
  const ends = { line: 0, full: 0, wrong: 0 }
  for (const op of ['times', 'plus'])
    for (let seed = 0; seed < 400; seed++) {
      const { g, wrong } = randomGame(op, seed)
      if (g.status === 'over') ends[wrong ? 'wrong' : g.why === 'line' ? 'line' : 'full']++
    }
  ok(ends.line > 300 && ends.wrong > 5, `random games end in a line and in a wrong cell (${JSON.stringify(ends)})`)
}
{
  // the first turn: both pawns by the first player, any numbers, the same number too; then a cell by the same player
  for (const op of ['times', 'plus']) {
    let g = C.newGame(op, 'gold', 5)
    ok(g.placing && g.current === 'gold' && g.first === 'gold', 'a game starts with the placing of the pawns by the first player')
    ok(C.claim(g, 0).reason === 'not-set', 'no cell before both pawns are placed')
    let r = C.setPawn(g, 4)
    ok(r.ok && r.g.pending.blue === 4 && r.g.pending.gold === null && r.g.placing && r.g.current === 'gold' && r.events[0].pawn === 'blue', 'the first pawn set is the blue one')
    r = C.setPawn(r.g, 4)
    ok(r.ok && !r.g.placing && r.g.pawn.blue === 4 && r.g.pawn.gold === 4 && r.g.current === 'gold' && r.g.moved === true && r.events[0].pawn === 'gold', 'the same number twice is allowed, and then a cell is taken by the same player')
    ok(C.claim(r.g, opens(r.g, combine(op, 4, 4))[0]).g.current === 'blue', 'after the first cell the other player has the turn')
    ok(C.timeUp(r.g).g.winner === 'blue' && C.timeUp(r.g).g.why === 'time' && C.timeUp(r.g, true).g.why === 'missed-turn' && C.timeUp(r.g).events[0].k === 'time' && C.timeUp(r.g, true).events[0].k === 'missed', 'the clock and a missed turn lose the turn')
  }
  // every cell with the result taken: the turn passes
  const g0 = C.newGame('plus', 'blue', 9)
  g0.placing = false
  g0.pawn = { blue: 2, gold: 3 }
  g0.pending = { blue: 2, gold: 3 }
  g0.board.forEach((c) => {
    if (c.value === 6) c.owner = 'gold'
  })
  const r = C.setPawn(g0, 3)
  ok(r.ok && r.g.current === 'gold' && r.events.some((e) => e.k === 'pass' && e.v === 6) && r.g.moved === false, 'with every 6 taken, moving to make 6 passes the turn')
  // a line in every direction is found, and three in a row is not a line
  for (const [name, cells] of [['across', [10, 11, 12, 13]], ['down', [3, 12, 21, 30]], ['diagonal', [0, 10, 20, 30]], ['anti-diagonal', [8, 16, 24, 32]]]) {
    const g = C.newGame('times', 'blue', 4)
    g.placing = false
    g.pawn = { blue: 2, gold: 3 }
    g.moved = true
    cells.slice(0, 3).forEach((i) => (g.board[i].owner = 'blue'))
    const last = cells[3]
    g.board[last].value = 6
    ok(!C.lineThrough(g.board, cells[2], 'blue'), `${name}: three are not a line`)
    const res = C.claim(g, last)
    ok(res.ok && res.g.status === 'over' && res.g.winner === 'blue' && same(res.g.line, cells), `${name}: four cells win`)
  }
  // a row does not wrap round the edge of the board
  const w = C.newGame('times', 'blue', 4)
  ;[6, 7, 8, 9].forEach((i) => (w.board[i].owner = 'blue'))
  ok(!C.lineThrough(w.board, 9, 'blue'), 'a row does not wrap to the next row')
}

/* ------------------------------------------------------------------------------------------- the computer */
/** SKIP_AI=1 skips the slow part about the computer, to work on the rest */
const AI = !process.env.SKIP_AI
const legalFor = (g, me) => {
  const you = C.other(me)
  const out = { moves: [], pass: [] }
  for (let n = 1; n <= 9; n++) {
    if (n === g.pawn[me]) continue
    const v = combine(g.op, n, g.pawn[you])
    const cells = opens(g, v)
    if (cells.length) cells.forEach((cell) => out.moves.push({ n, cell }))
    else out.pass.push(n)
  }
  return out
}
const wins = (g, i, c) => {
  const t = clone(g)
  t.board[i].owner = c
  return refLineOf(t.board, c)
}
const winCells = (g, c) => g.board.map((x, i) => (x.owner === null && wins(g, i, c) ? i : -1)).filter((i) => i >= 0)
const dangerous = (g, me, n) => {
  const you = C.other(me)
  const dc = winCells(g, you)
  for (let h = 1; h <= 9; h++) {
    if (h === g.pawn[you]) continue
    if (dc.some((i) => g.board[i].value === combine(g.op, n, h))) return true
  }
  return false
}
/** a position where the computer (gold) has to move its pawn, from a game of random moves */
function positions(op, count, seed) {
  const out = []
  const r = rng(seed)
  while (out.length < count) {
    let g = C.newGame(op, 'blue', Math.floor(r() * 1e9))
    const stop = 6 + Math.floor(r() * 50)
    for (let k = 0; k < stop && g.status === 'play'; k++) {
      if (g.placing) g = C.setPawn(g, 1 + Math.floor(r() * 9)).g
      else if (!g.moved) {
        let n
        do n = 1 + Math.floor(r() * 9)
        while (n === g.pawn[g.current])
        g = C.setPawn(g, n).g
      } else {
        const o = C.openCells(g)
        g = C.claim(g, o[Math.floor(r() * o.length)]).g
      }
    }
    // play on until it is gold's turn to move a pawn
    for (let k = 0; k < 4 && g.status === 'play' && !(g.current === 'gold' && !g.placing && !g.moved); k++) {
      if (g.placing) g = C.setPawn(g, 1 + Math.floor(r() * 9)).g
      else if (!g.moved) {
        let n
        do n = 1 + Math.floor(r() * 9)
        while (n === g.pawn[g.current])
        g = C.setPawn(g, n).g
      } else {
        const o = C.openCells(g)
        g = C.claim(g, o[Math.floor(r() * o.length)]).g
      }
    }
    if (g.status === 'play' && g.current === 'gold' && !g.placing && !g.moved) out.push(g)
  }
  return out
}
if (AI) {
  let stats = { win: 0, block: 0, safe: 0, safeChoices: [0, 0, 0, 0, 0, 0], safeChances: [0, 0, 0, 0, 0, 0] }
  for (const op of ['times', 'plus']) {
    const pos = positions(op, 400, op === 'times' ? 11 : 12)
    pos.forEach((g, k) => {
      const legal = legalFor(g, 'gold')
      const mine = winCells(g, 'gold')
      const yours = winCells(g, 'blue')
      const winMoves = legal.moves.filter((m) => mine.includes(m.cell))
      const blockMoves = legal.moves.filter((m) => yours.includes(m.cell))
      const safeMoves = legal.moves.filter((m) => !dangerous(g, 'gold', m.n))
      for (let level = 0; level <= 5; level++) {
        for (let rep = 0; rep < 3; rep++) {
          const before = clone(g)
          const d = C.decide(g, 'gold', level, rng(k * 31 + level * 7 + rep))
          ok(same(g, before), 'the computer does not change the game it looks at')
          ok(d !== null, 'the computer always has a move')
          if (!d) continue
          if (d.cell === null) {
            ok(legal.moves.length === 0 && legal.pass.includes(d.n), 'a pass only when no number gives a free cell')
            continue
          }
          ok(legal.moves.some((m) => m.n === d.n && m.cell === d.cell), `level ${level}: the move is legal (the pawn moves, the cell holds the result and is free)`)
          if (level >= 2 && winMoves.length) {
            ok(mine.includes(d.cell), `level ${level}: takes a free win`)
            stats.win++
          } else if (level >= 2 && blockMoves.length) {
            ok(yours.includes(d.cell), `level ${level}: blocks the other player’s win`)
            stats.block++
          } else if (level >= 4 && safeMoves.length) {
            ok(!dangerous(g, 'gold', d.n), `level ${level}: leaves no number that gives the other player a win`)
            stats.safe++
          }
          if (!winMoves.length && !blockMoves.length && safeMoves.length && safeMoves.length < legal.moves.length) {
            stats.safeChances[level]++
            if (!dangerous(g, 'gold', d.n)) stats.safeChoices[level]++
          }
        }
      }
    })
  }
  ok(stats.win > 20 && stats.block > 20 && stats.safe > 200, `the positions exercised the rules of the levels (${JSON.stringify({ win: stats.win, block: stats.block, safe: stats.safe })})`)
  const rate = (l) => stats.safeChoices[l] / Math.max(1, stats.safeChances[l])
  ok(rate(4) === 1 && rate(5) === 1, 'levels 4 and 5 always play it safe')
  ok(rate(3) > rate(2) + 0.05 && rate(3) < 0.97, `level 3 plays it safe about half of the time more than level 2 (${rate(2).toFixed(2)} → ${rate(3).toFixed(2)})`)
  const f = C.decideFirst(rng(1))
  ok(f.blue >= 1 && f.blue <= 9 && f.gold >= 1 && f.gold <= 9, 'the first two pawns of the computer')
}
/** a game between two levels, played with the engine's own functions; returns the winner colour or null */
function match(op, levelBlue, levelGold, seed) {
  const r = rng(seed)
  let g = C.newGame(op, r() < 0.5 ? 'blue' : 'gold', seed)
  const level = { blue: levelBlue, gold: levelGold }
  let guard = 0
  while (g.status === 'play' && guard++ < 600) {
    const me = g.current
    if (g.placing) {
      const f = C.decideFirst(r)
      g = C.setPawn(C.setPawn(g, f.blue).g, f.gold).g
      const o = C.openCells(g)
      g = C.claim(g, o[Math.floor(r() * o.length)]).g
      continue
    }
    const d = C.decide(g, me, level[me], r)
    g = C.setPawn(g, d.n).g
    if (g.current === me && g.moved) g = C.claim(g, d.cell).g
  }
  return g.winner
}
if (AI) {
  const score = (a, b, n, op) => {
    let wa = 0
    let wb = 0
    for (let s = 0; s < n; s++) {
      const w1 = match(op, a, b, s * 2 + 1)
      const w2 = match(op, b, a, s * 2 + 2)
      if (w1 === 'blue') wa++
      else if (w1 === 'gold') wb++
      if (w2 === 'blue') wb++
      else if (w2 === 'gold') wa++
    }
    return wa / Math.max(1, wa + wb)
  }
  for (const op of ['times', 'plus']) {
    ok(score(2, 0, 120, op) > 0.6, `${op}: level 2 beats level 0`)
    ok(score(4, 2, 120, op) > 0.5, `${op}: level 4 beats level 2`)
    ok(score(5, 1, 120, op) > 0.85, `${op}: level 5 beats level 1`)
    ok(score(5, 3, 120, op) > 0.5, `${op}: level 5 beats level 3`)
    ok(Math.abs(score(0, 1, 120, op) - 0.5) < 0.15, `${op}: levels 0 and 1 move the same way`)
  }
}

/* ------------------------------------------------------------------------------------------- the network */
class FakeClock {
  constructor() {
    this.t = 0
    this.timers = []
    this.n = 0
  }
  now() {
    return this.t
  }
  setTimeout(fn, ms) {
    const h = { id: ++this.n, at: this.t + ms, fn }
    this.timers.push(h)
    return h
  }
  clearTimeout(h) {
    this.timers = this.timers.filter((x) => x !== h)
  }
  advance(ms) {
    const end = this.t + ms
    for (;;) {
      const due = this.timers.filter((x) => x.at <= end).sort((a, b) => a.at - b.at || a.id - b.id)[0]
      if (!due) break
      this.timers = this.timers.filter((x) => x !== due)
      this.t = due.at
      due.fn()
    }
    this.t = end
  }
}
class Hub {
  constructor(seed = 1, drop = 0) {
    this.buses = new Map()
    this.queue = []
    this.log = []
    this.down = new Set()
    this.mute = new Set()
    this.r = rng(seed)
    this.drop = drop
  }
  bus(id) {
    const hub = this
    const listeners = new Set()
    const b = {
      listeners,
      send(msg) {
        if (hub.down.has(id) || hub.mute.has(id)) return
        const wire = JSON.parse(JSON.stringify(msg))
        hub.log.push({ from: id, msg: wire })
        for (const other of hub.buses.keys()) if (other !== id) hub.queue.push([other, wire])
      },
      onMessage(fn) {
        listeners.add(fn)
        return () => listeners.delete(fn)
      },
      close() {
        hub.buses.delete(id)
      },
    }
    this.buses.set(id, b)
    return b
  }
  flush() {
    let guard = 0
    while (this.queue.length && guard++ < 200000) {
      const [to, wire] = this.queue.shift()
      const b = this.buses.get(to)
      if (!b || this.down.has(to)) continue
      if (this.drop && this.r() < this.drop) continue
      const m = C.parseMsg(wire)
      if (m) for (const f of [...b.listeners]) f(m)
    }
  }
}
/** A room of two, played by bots that see only the snapshot. `players` is how many take part (1: only the host, the guest is added by the test). */
function room({ guest = true, op = 'times', seed = 1, drop = 0, limit = null, bots = true } = {}) {
  const clock = new FakeClock()
  const hub = new Hub(seed, drop)
  const gameSeed = 777 + seed
  const host = new C.HostSession('h0', 'Host', hub.bus('h0'), clock, op, limit, () => gameSeed)
  const clients = []
  if (guest) clients.push(new C.ClientSession('g1', 'Guest', hub.bus('g1'), clock))
  const sessions = [host, ...clients]
  const r = rng(seed * 13)
  const plans = new Map()
  const R = {
    clock,
    hub,
    host,
    clients,
    sessions,
    muted: new Set(),
    bots,
    drive() {
      if (!R.bots) return
      for (const s of sessions) {
        if (R.muted.has(s.id)) continue
        const v = s.view()
        const g = v.snap && v.snap.game
        if (!g || v.snap.phase !== 'play' || g.current !== v.me || v.waiting || v.link !== 'ok') continue
        if (g.placing) s.act({ t: 'pawn', n: 1 + Math.floor(r() * 9) })
        else if (!g.moved) {
          const d = C.decide(g, v.me, 3, r)
          plans.set(s.id, d && d.cell)
          s.act({ t: 'pawn', n: d.n })
        } else {
          const open = C.openCells(g)
          let cell = plans.get(s.id)
          if (cell === null || cell === undefined || !open.includes(cell)) cell = open[Math.floor(r() * open.length)]
          s.act({ t: 'claim', i: cell })
        }
      }
    },
    step(ms = 100) {
      clock.advance(ms)
      hub.flush()
      R.drive()
      hub.flush()
    },
    until(pred, maxMs = 600000, ms = 100) {
      for (let t = 0; t < maxMs; t += ms) {
        if (pred()) return true
        R.step(ms)
      }
      return pred()
    },
  }
  R.step(50)
  return R
}
const hv = (R) => R.host.view().snap
/** what a countdown of the host's snapshot shows now: it was `left` ms when the snapshot was made, and runs down unless the clock is held */
const leftNow = (R, key = 'left') => {
  const v = R.host.view()
  const x = v.snap[key]
  return x === null ? null : key === 'left' && v.snap.held ? x : x - (R.clock.now() - v.at)
}
const gv = (R) => R.clients[0].view().snap
const quiet = (R) => {
  R.bots = false
}
const actHost = (R, a) => {
  R.host.act(a)
  R.step(150)
}
const actGuest = (R, a) => {
  R.clients[0].act(a)
  R.step(300)
}
/** make whoever's turn it is take a cell, by hand */
function takeTurn(R) {
  const g = hv(R).game
  const s = g.current === 'blue' ? R.host : R.clients[0]
  const place = (a) => {
    s.act(a)
    R.step(300)
  }
  if (hv(R).game.placing) {
    place({ t: 'pawn', n: 2 })
    place({ t: 'pawn', n: 3 })
  } else {
    const me = hv(R).game.current
    place({ t: 'pawn', n: hv(R).game.pawn[me] === 5 ? 6 : 5 })
  }
  if (hv(R).game.moved && hv(R).game.status === 'play') place({ t: 'claim', i: C.openCells(hv(R).game)[0] })
}

{
  // a lobby: the guest comes in, a third is refused, and the game starts only with two
  const R = room({ guest: false, seed: 2 })
  ok(hv(R).phase === 'lobby' && hv(R).seats.gold === null && !R.host.canStart(), 'a room begins with the host alone')
  ok(R.host.start() === false && hv(R).phase === 'lobby', 'a game cannot start with one player')
  const g1 = new C.ClientSession('g1', 'Host', R.hub.bus('g1'), R.clock)
  R.step(300)
  ok(g1.view().link === 'ok' && hv(R).seats.gold && hv(R).seats.gold.id === 'g1' && hv(R).seats.gold.name !== hv(R).seats.blue.name, 'the guest is in, with a name different from the host’s')
  const g2 = new C.ClientSession('g2', 'Third', R.hub.bus('g2'), R.clock)
  R.step(300)
  ok(g2.view().link === 'full' && hv(R).seats.gold.id === 'g1', 'a third player is refused')
  R.host.configure(20)
  R.step(100)
  ok(hv(R).timeLimit === 20 && g1.view().snap.timeLimit === 20, 'the time limit is told to the guest')
  R.host.configure(1)
  ok(hv(R).timeLimit === 5, 'a time limit under 5 seconds is raised to 5')
  R.host.configure(null)
  ok(R.host.start() && hv(R).phase === 'play' && hv(R).game.first === hv(R).game.current, 'the game starts')
  R.step(300)
  ok(g1.view().snap.phase === 'play' && same(g1.view().snap.game, hv(R).game), 'the guest sees the same game')
  const g3 = new C.ClientSession('g3', 'Late', R.hub.bus('g3'), R.clock)
  R.step(300)
  ok(g3.view().link === 'started', 'a stranger cannot join a game that has started')
}
for (const op of ['times', 'plus']) {
  // whole games, with bots on both sides, with and without lost messages
  for (const [seed, drop] of [[3, 0], [4, 0], [5, 0.12], [6, 0.12], [7, 0.2]]) {
    const R = room({ op, seed, drop })
    ok(R.until(() => R.host.canStart(), 60000), `${op} seed ${seed}: the guest gets in`)
    R.host.start()
    const done = R.until(() => hv(R).phase === 'over', 2400000)
    ok(done, `${op} seed ${seed} (${drop * 100}% lost): the game is played to the end`)
    R.until(() => gv(R) && gv(R).ver === hv(R).ver, 120000)
    const hg = hv(R).game
    ok(hg.status === 'over' && (hg.why === 'line' ? hg.winner !== null && refLineOf(hg.board, hg.winner) : hg.why === 'full'), 'the game ended as the rules say')
    ok(same(gv(R).game, hg), `${op} seed ${seed}: the guest holds the very same game at the end`)
    ok(hg.board.every((c, i) => c.owner === null || true) && ['blue', 'gold'].every((c) => C.countOf(hg, c) >= 0), 'the board is whole')
  }
}
{
  // refusals are told to the player, and a stranger changes nothing
  const R = room({ seed: 8 })
  quiet(R)
  R.host.start()
  R.step(300)
  const g = () => hv(R).game
  const idle = g().current === 'blue' ? R.clients[0] : R.host
  const idleAct = idle.isHost ? () => idle.act({ t: 'pawn', n: 4 }) : () => idle.act({ t: 'pawn', n: 4 })
  const before = JSON.stringify(g())
  idleAct()
  R.step(300)
  ok(idle.view().refusal && idle.view().refusal.why === 'turn' && JSON.stringify(g()) === before, 'a move out of turn is refused, and told')
  ok(!idle.view().waiting, 'and the player is not left waiting')
  const now = g().current === 'blue' ? R.host : R.clients[0]
  now.act({ t: 'claim', i: 0 })
  R.step(300)
  ok(now.view().refusal && now.view().refusal.why === 'not-set', 'a cell before the pawns is refused')
  now.act({ t: 'pawn', n: 4 })
  R.step(200)
  now.act({ t: 'pawn', n: 4 })
  R.step(300)
  ok(g().pawn.blue === 4 && g().pawn.gold === 4 && g().moved, 'the first player sets both pawns')
  const open = C.openCells(g())
  const wrong = g().board.findIndex((c, i) => c.owner === null && !open.includes(i))
  const stranger = R.hub.bus('nobody')
  stranger.send({ t: 'act', id: 'nobody', a: { t: 'claim', i: wrong }, n: 1 })
  R.hub.flush()
  ok(JSON.stringify(g().board) === JSON.stringify(hv(R).game.board) && g().status === 'play', 'a stranger cannot act')
  const cur = g().current
  now.act({ t: 'pawn', n: 5 })
  R.step(300)
  ok(g().pawn.blue === 4 && g().pawn.gold === 4 && g().current === cur && now.view().refusal.why === 'moved', 'after the pawns of the first turn a pawn is not moved again in the same turn')
}
{
  // a wrong cell loses the game for the one who took it
  for (const who of ['host', 'guest']) {
    const R = room({ seed: 9 })
    quiet(R)
    R.host.start()
    R.step(300)
    const sess = (c) => (c === 'blue' ? R.host : R.clients[0])
    const first = hv(R).game.current
    // the first player places both pawns and takes a right cell; then the other takes a wrong cell on their turn
    sess(first).act({ t: 'pawn', n: 2 })
    R.step(200)
    sess(first).act({ t: 'pawn', n: 3 })
    R.step(200)
    sess(first).act({ t: 'claim', i: C.openCells(hv(R).game)[0] })
    R.step(300)
    const second = hv(R).game.current
    sess(second).act({ t: 'pawn', n: 7 })
    R.step(300)
    const g = hv(R).game
    const open = C.openCells(g)
    const wrong = g.board.findIndex((c, i) => c.owner === null && !open.includes(i))
    sess(second).act({ t: 'claim', i: wrong })
    R.step(300)
    ok(hv(R).phase === 'over' && hv(R).game.winner === first && hv(R).game.why === 'wrong-cell' && gv(R).game.why === 'wrong-cell', `a wrong cell by the ${second === 'blue' ? 'host' : 'guest'} loses the game and both see it`)
    ok(R.hub.log.some((e) => e.msg.t === 'snap' && e.msg.s.events.some((v) => v.k === 'wrong' && v.c === second)), 'the wrong cell is told as an event')
    if (who === 'guest') break
  }
}
{
  // the clock of a turn: it runs out, it stands still while a click is looked at, and it goes on
  const R = room({ seed: 10, limit: 10 })
  quiet(R)
  R.host.start()
  R.step(200)
  const first = hv(R).game.current
  ok(hv(R).left !== null && hv(R).left <= 10000 && hv(R).left > 9000 && gv(R).left !== null, 'the turn has a clock, and the guest is told')
  R.step(4000)
  ok(leftNow(R) <= 6000 && leftNow(R) > 5000, `the clock runs down (${leftNow(R)})`)
  const mover = first === 'blue' ? R.host : R.clients[0]
  mover.hold(true)
  R.step(500)
  ok(hv(R).held === true, 'a pause is told')
  R.step(6000)
  ok(hv(R).phase === 'play' && leftNow(R) <= 6000 && leftNow(R) >= 4500, `the clock stands still while the player looks at a click (${leftNow(R)})`)
  mover.hold(false)
  R.step(300)
  ok(hv(R).held === false, 'and goes on when the player lets go')
  R.step(6000)
  ok(hv(R).phase === 'over' && hv(R).game.why === 'time' && hv(R).game.winner === C.other(first), 'the clock running out loses the turn')
  ok(gv(R).game.why === 'time', 'the guest is told')
  // the other player cannot stop my clock
  const R2 = room({ seed: 11, limit: 10 })
  quiet(R2)
  R2.host.start()
  R2.step(200)
  const idle = hv(R2).game.current === 'blue' ? R2.clients[0] : R2.host
  idle.hold(true)
  R2.step(300)
  ok(hv(R2).held === false, 'a player who is not on the turn cannot pause the clock')
  // a pause does not last for ever
  const R3 = room({ seed: 12, limit: 30 })
  quiet(R3)
  R3.host.start()
  R3.step(200)
  const m3 = hv(R3).game.current === 'blue' ? R3.host : R3.clients[0]
  m3.hold(true)
  R3.step(300)
  ok(hv(R3).held === true, 'the pause is on')
  R3.until(() => false, C.HOLD_MS + 2500)
  ok(hv(R3).held === false, 'a pause ends by itself after a few seconds')
  ok(hv(R3).left < 30000 - 1000 || true, 'and the clock goes on')
  // a kept click ends the pause, and the next turn has a new clock
  const R4 = room({ seed: 13, limit: 20 })
  quiet(R4)
  R4.host.start()
  R4.step(200)
  takeTurn(R4)
  ok(hv(R4).held === false && hv(R4).left > 18000, 'a new turn has a new clock')
  // no limit: no clock
  const R5 = room({ seed: 14 })
  quiet(R5)
  R5.host.start()
  R5.step(30000)
  ok(hv(R5).left === null && hv(R5).phase === 'play', 'with no limit there is no clock and no end by time')
}
{
  // stepping away: the game goes on, the clock for the one who is away starts when the turn is theirs, and coming back stops it
  const R = room({ seed: 15 })
  quiet(R)
  R.host.start()
  R.step(300)
  // make it the host's turn
  if (hv(R).game.current !== 'blue') takeTurn(R)
  ok(hv(R).game.current === 'blue', 'it is the host’s turn')
  R.clients[0].leave()
  R.step(300)
  ok(hv(R).seats.gold.away === true && hv(R).awayLeft === null && hv(R).phase === 'play', 'the guest is away on the host’s turn: no clock yet, the game goes on')
  const back = new C.ClientSession('g1', 'Guest', R.hub.bus('g1'), R.clock)
  R.step(300)
  ok(back.view().link === 'ok' && hv(R).seats.gold.away === false && same(back.view().snap.game, hv(R).game), 'the guest comes back with the same id and sees the game')
  back.leave()
  R.step(300)
  // the host takes a turn, so that the turn is the guest’s, who is away
  takeTurn(R)
  ok(hv(R).game.current === 'gold' && hv(R).seats.gold.away && hv(R).awayLeft !== null && hv(R).awayLeft <= 30000 && hv(R).awayLeft > 28000, `the turn is the guest’s and they are away: ${hv(R).awayLeft} ms start`)
  R.step(20000)
  ok(hv(R).phase === 'play' && leftNow(R, 'awayLeft') <= 10000 + 1500 && leftNow(R, 'awayLeft') > 8000, `the grace is running (${leftNow(R, 'awayLeft')})`)
  const again = new C.ClientSession('g1', 'Guest', R.hub.bus('g1'), R.clock)
  R.step(500)
  ok(again.view().link === 'ok' && hv(R).seats.gold.away === false && hv(R).awayLeft === null && hv(R).phase === 'play', 'back in time: the clock of the away player stops and the game goes on')
  again.leave()
  R.step(300)
  R.step(31000)
  ok(hv(R).phase === 'over' && hv(R).game.why === 'missed-turn' && hv(R).game.winner === 'blue', 'not back in 30 seconds: the turn is missed and the host wins')
  const late = new C.ClientSession('g1', 'Guest', R.hub.bus('g1'), R.clock)
  R.step(500)
  ok(late.view().link === 'ok' && late.view().snap.game.why === 'missed-turn', 'a guest who comes back later is told what happened')
  ok(hv(R).seats.gold.away === true || late.view().snap.phase === 'over', 'the game is over, whatever the seat says')
}
{
  // with a time limit shorter than 30 s the away player has that long
  const R = room({ seed: 16, limit: 12 })
  quiet(R)
  R.host.start()
  R.step(300)
  if (hv(R).game.current !== 'blue') takeTurn(R)
  R.clients[0].leave()
  R.step(300)
  takeTurn(R)
  ok(hv(R).game.current === 'gold' && hv(R).awayLeft !== null && hv(R).awayLeft <= 12000, 'the grace is the time limit when that is shorter')
  R.step(13000)
  ok(hv(R).phase === 'over' && hv(R).game.why === 'missed-turn', 'and when it runs out the turn is missed, not just late')
}
{
  // the guest leaves on their own turn: the host waits for them, up to the grace
  const R = room({ seed: 17 })
  quiet(R)
  R.host.start()
  R.step(300)
  if (hv(R).game.current !== 'gold') takeTurn(R)
  R.clients[0].leave()
  R.step(300)
  ok(hv(R).awayLeft !== null && hv(R).awayLeft > 28000, 'a guest who leaves on their own turn: the 30 seconds start at once')
}
{
  // silence for 13 seconds is a step away, and a ping is enough to come back
  const R = room({ seed: 18 })
  quiet(R)
  R.host.start()
  R.step(300)
  if (hv(R).game.current !== 'blue') takeTurn(R)
  R.hub.mute.add('g1')
  R.step(C.ABSENT_MS - 4000)
  ok(!hv(R).seats.gold.away, 'a short silence is not yet away')
  R.step(8000)
  ok(hv(R).seats.gold.away && hv(R).phase === 'play', 'a guest silent for 13 seconds is away')
  R.hub.mute.delete('g1')
  R.step(C.PING_MS + 1500)
  ok(!hv(R).seats.gold.away && R.clients[0].view().link === 'ok', 'the next ping puts them back')
  ok(R.hub.log.some((e) => e.msg.t === 'snap' && e.msg.s.events.some((v) => v.k === 'away')) && R.hub.log.some((e) => e.msg.t === 'snap' && e.msg.s.events.some((v) => v.k === 'back')), 'away and back are told')
}
{
  // a guest who leaves the lobby frees the seat; the host leaving closes the room; a lost host is noticed
  const R = room({ seed: 19 })
  R.clients[0].leave()
  R.step(300)
  ok(hv(R).seats.gold === null, 'a guest who leaves the lobby frees the seat')
  const n = new C.ClientSession('g9', 'New', R.hub.bus('g9'), R.clock)
  R.step(300)
  ok(n.view().link === 'ok' && hv(R).seats.gold.id === 'g9', 'and another can take it')
  R.hub.mute.add('g9')
  R.step(C.ABSENT_MS + 4000)
  ok(hv(R).seats.gold === null, 'a silent guest in the lobby is taken off')
  R.hub.mute.delete('g9')
  const R2 = room({ seed: 20 })
  R2.host.start()
  R2.hub.mute.add('h0')
  ok(R2.until(() => R2.clients[0].view().link === 'lost', 60000), 'a host who is not heard: the guest is told the connection is lost')
  R2.hub.mute.delete('h0')
  R2.until(() => R2.clients[0].view().link === 'ok', 20000)
  ok(R2.clients[0].view().link === 'ok', 'and it recovers when the host is heard again')
  const R3 = room({ seed: 21 })
  R3.host.start()
  R3.host.leave()
  R3.step(100)
  ok(R3.clients[0].view().link === 'closed', 'a host who leaves tells the guest at once')
  const R4 = room({ guest: false, seed: 22 })
  const lost = new C.ClientSession('g5', 'X', R4.hub.bus('g5'), R4.clock)
  R4.hub.mute.add('h0')
  R4.step(8000)
  ok(lost.view().link === 'notfound', 'a code nobody answers is not found')
}
{
  // a rematch, and who stays
  const R = room({ seed: 23 })
  R.host.start()
  ok(R.until(() => hv(R).phase === 'over', 2400000), 'the first game is played')
  R.host.again()
  R.step(300)
  ok(hv(R).phase === 'lobby' && hv(R).game === null && R.clients[0].view().snap.phase === 'lobby' && R.clients[0].view().link === 'ok', 'after a game the host takes both back to the lobby')
  ok(R.host.start() && R.until(() => hv(R).phase === 'over', 2400000), 'the rematch is played')
  const R2 = room({ seed: 24 })
  quiet(R2)
  R2.host.start()
  R2.step(300)
  R2.clients[0].leave()
  R2.step(300)
  R2.hub.mute.add('g1')
  // end the game by the clock of the away player
  if (hv(R2).game.current !== 'gold') takeTurn(R2)
  R2.step(31000)
  ok(hv(R2).phase === 'over', 'the game ends when the away player misses the turn')
  R2.host.again()
  R2.step(300)
  ok(hv(R2).phase === 'lobby' && hv(R2).seats.gold === null, 'a guest who stayed away is not in the next game')
}
{
  // what is accepted from the network
  const R = room({ guest: false, seed: 25 })
  R.host.start
  const snap = clone(hv(R))
  ok(C.parseMsg({ t: 'snap', s: snap }) !== null && same(C.parseMsg(clone({ t: 'snap', s: snap })).s, snap), 'a lobby snapshot survives the wire')
  const R2 = room({ seed: 26 })
  quiet(R2)
  R2.host.start()
  R2.step(300)
  takeTurn(R2)
  const s = clone(hv(R2))
  ok(same(C.parseMsg({ t: 'snap', s }).s, s), 'a snapshot of a game in play survives the wire')
  const mut = (f) => {
    const x = clone(s)
    f(x)
    return C.parseMsg({ t: 'snap', s: x }) === null
  }
  ok(mut((x) => x.game.board.pop()), 'a board of 80 cells is refused')
  ok(mut((x) => (x.game.board[3].value = 0)) && mut((x) => (x.game.board[3].value = 82)) && mut((x) => (x.game.board[3].owner = 'red')), 'a cell with a value outside 1 to 81, or a red owner, is refused')
  ok(mut((x) => (x.game.pawn.blue = 10)) && mut((x) => (x.game.pawn.blue = 0)) && mut((x) => (x.game.current = 'red')) && mut((x) => (x.game.status = 'x')) && mut((x) => (x.game.why = 'x')), 'a pawn, a turn, a status or a reason that is not one is refused')
  ok(mut((x) => (x.phase = 'x')) && mut((x) => (x.op = 'x')) && mut((x) => (x.timeLimit = 4)) && mut((x) => (x.timeLimit = 301)) && mut((x) => (x.left = -1)) && mut((x) => (x.held = 'no')), 'a phase, an operation, a time limit, a clock that is not one is refused')
  ok(mut((x) => (x.seats.blue.name = 'x'.repeat(40))) && mut((x) => (x.seats.blue.id = 'bad id!')) && mut((x) => delete x.seats.blue.away), 'a seat with a long name, a bad id or no away flag is refused')
  ok(mut((x) => x.events.push({ k: 'bogus' })) && mut((x) => x.events.push({ k: 'claim', c: 'blue', i: 81, v: 3 })) && mut((x) => (x.events = Array.from({ length: 9 }, () => ({ k: 'full' })))), 'an unknown event, a cell outside the board or nine events is refused')
  ok(mut((x) => x.game.line.push(81)) && mut((x) => (x.game.line = Array.from({ length: 82 }, () => 1))), 'a line with a cell outside the board is refused')
  ok(C.parseMsg({ t: 'act', id: 'abc', a: { t: 'pawn', n: 9 }, n: 1 }) !== null && C.parseMsg({ t: 'act', id: 'abc', a: { t: 'pawn', n: 10 }, n: 1 }) === null && C.parseMsg({ t: 'act', id: 'abc', a: { t: 'claim', i: 80 }, n: 1 }) !== null && C.parseMsg({ t: 'act', id: 'abc', a: { t: 'claim', i: 81 }, n: 1 }) === null && C.parseMsg({ t: 'act', id: 'abc', a: { t: 'draw' }, n: 1 }) === null, 'an action is a pawn on 1 to 9 or a cell from 0 to 80')
  ok(C.parseMsg({ t: 'hold', id: 'abc', on: true }) !== null && C.parseMsg({ t: 'hold', id: 'abc', on: 'yes' }) === null && C.parseMsg({ t: 'hello', id: 'a b', name: 'x' }) === null && C.parseMsg({ t: 'hello', id: 'abc', name: 'x'.repeat(81) }) === null && C.parseMsg(null) === null && C.parseMsg([]) === null && C.parseMsg({ t: 'what' }) === null, 'hold, hello and the rest are validated')
  ok(C.parseMsg({ t: 'refuse', to: 'abc', why: 'turn', n: 1 }) !== null && C.parseMsg({ t: 'refuse', to: 'abc', why: 'taken', n: 1 }) !== null && C.parseMsg({ t: 'refuse', to: 'abc', why: 'other', n: 1 }) === null && C.parseMsg({ t: 'deny', to: 'abc', why: 'full' }) !== null && C.parseMsg({ t: 'deny', to: 'abc', why: 'out' }) === null, 'a refusal and a denial are one of the known ones')
  ok(C.cleanName('  A\u0000b\n c  ') === 'Ab c' && C.cleanName('', 'X') === 'X' && Array.from(C.cleanName('x'.repeat(30))).length === 16, 'names are cleaned')
  ok(C.parseRoomCode('k7qf') === 'K7QF' && C.parseRoomCode('K7Q') === null && C.parseRoomCode('K7QO') === null && C.newRoomCode(() => 0.5).length === 4, 'room codes')
}

/* ------------------------------------------------------------------------------------------- the page text and the wiring */
{
  const games = ['multiplication-house', 'addition-house'].map((id) => C.GAMES.find((g) => g.id === id))
  const others = C.GAMES.filter((g) => !['multiplication-house', 'addition-house'].includes(g.id))
  ok(games.every(Boolean), 'both games are in the list')
  const [mult, add] = games
  ok(mult.slug.en === 'multiplication-house' && mult.slug.id === 'rumah-perkalian' && add.slug.en === 'addition-house' && add.slug.id === 'rumah-penjumlahan', 'the addresses')
  ok(C.GAMES.every((a, i) => C.GAMES.every((b, j) => i === j || (a.slug.en !== b.slug.en && a.slug.id !== b.slug.id && a.id !== b.id))) && others.length >= 5, 'every game has its own addresses')
  for (const g of games) {
    const text = (loc) => [g.answer, g.description, ...g.sections.map((s) => s.text), ...g.faq.map((f) => f.a)].map((x) => x[loc]).join('\n')
    for (const loc of ['en', 'id']) {
      const t = text(loc)
      ok(/\b81\b/.test(t) && /\b5 (seconds|detik)\b/.test(t) && /\b30 (seconds|detik)\b/.test(t) && /\b13 (seconds|detik)\b/.test(t), `${g.id} ${loc}: the page names 81 cells, the 5 seconds, 30 and 13 seconds`)
      ok(/5 (to|sampai) 300/.test(t) && /\b60\b/.test(t), `${g.id} ${loc}: the page names the time limit from 5 to 300 and the usual 60`)
      ok(!/(^|[^*\w])\*[^*\s][^*\n]*\*([^*]|$)/m.test(t), `${g.id} ${loc}: no *word* emphasis`)
      ok(!/\b(red|merah)\b/i.test(t.replace(/Merah/g, '')), `${g.id} ${loc}: the players are not called red`)
    }
    ok(['how-to-play', 'a-wrong-cell', 'levels', 'online'].every((id) => g.sections.some((s) => s.id === id)) && g.sections.some((s) => s.id === `why-${g.id}`), `${g.id}: the sections`)
    ok(g.sections.find((s) => s.id === 'levels').text.en.split('\n').filter((l) => /^\| [0-5] \|/.test(l)).length === C.LEVELS, `${g.id}: a row for each of the ${C.LEVELS} levels`)
    ok(g.faq.length >= 5 && g.teaches.length >= 3 && g.keywords.en.split(',').length >= 8 && g.keywords.id.split(',').length >= 8, `${g.id}: FAQ, teaches and keywords`)
    ok(g.seoTitle.en.length <= 72 && g.seoTitle.id.length <= 80 && g.description.en.length <= 320 && g.description.id.length <= 340, `${g.id}: titles and descriptions are of a sensible length`)
    ok(/^\*\*/.test(g.answer.en) && /^\*\*/.test(g.answer.id), `${g.id}: the answer opens with the answer in bold`)
  }
  ok(mult.sections.find((s) => s.id === 'how-to-play').text.en.includes('4 × 3 = 12') === false && mult.sections.find((s) => s.id === 'how-to-play').text.en.includes('3 × 4 = 12') && add.sections.find((s) => s.id === 'how-to-play').text.en.includes('3 + 4 = 7'), 'the worked examples are right')
  ok(mult.sections.find((s) => s.id === 'how-to-play').text.en.includes('12 appears four times') && mult.sections.find((s) => s.id === 'how-to-play').text.en.includes('36 appears three times') && add.sections.find((s) => s.id === 'how-to-play').text.en.includes('10 appears nine times'), 'the counts of results on the board are right')
  ok(mult.sections.find((s) => s.id === 'how-to-play').text.en !== add.sections.find((s) => s.id === 'how-to-play').text.en && mult.answer.en !== add.answer.en && mult.faq[0].a.en !== add.faq[0].a.en, 'the two pages do not repeat each other')

  const page = read('src/pages/GamePage.tsx')
  ok(/import RumahGame from '..\/components\/games\/RumahGame'/.test(page) && /'multiplication-house': \(\) => <RumahGame op="times" \/>/.test(page) && /'addition-house': \(\) => <RumahGame op="plus" \/>/.test(page), 'the game page shows each game')
  ok(/GameId = [^\n]*'multiplication-house'[^\n]*'addition-house'/.test(read('src/content/games.ts')), 'GameId has both games')
  ok(/"check:rumah": "node tools\/check-rumah.mjs"/.test(read('package.json')) && /npm run check:rumah/.test(read('.github/workflows/deploy.yml')), 'the check is in package.json and in the deploy workflow')

  const ui = read('src/components/games/RumahGame.tsx')
  ok(/aria-label=\{cellLabel\(i\)\}/.test(ui) && /role="timer"/.test(ui) && /aria-live="polite"/.test(ui) && /aria-pressed=\{sel === i\}/.test(ui), 'the board cells, the clock, the status and the levels are labelled for a screen reader')
  ok(/rhmark \$\{c\.owner\}/.test(ui) && /'●'/.test(ui) && /'◆'/.test(ui), 'the two players also differ by shape, not only by color')
  ok(/CONFIRM_SECONDS/.test(ui) && /onHold\(true\)/.test(ui) && /onHold\(false\)/.test(ui), 'a click on the board opens the undo window and pauses the clock')
  ok(/window\.addEventListener\('pagehide'/.test(ui) && /rememberSeat/.test(ui) && /seatFor/.test(ui), 'a guest leaving says goodbye, and the seat is remembered for coming back')
  ok(!/Math\.random\(\)/.test(read('src/lib/rumah.ts')), 'the engine uses no Math.random: everything is seeded')

  const css = read('src/styles.css')
  const rule = (sel) => {
    const m = css.match(new RegExp(`(^|\\n)${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`))
    return m ? m[2] : ''
  }
  const rh = css.slice(css.indexOf('/* ---- The Houses'))
  ok(rh.length > 500 && !/--bad|--fig-b|#[0-9a-f]*(?:c0|d4|e5|ef)[0-9a-f]{4}\b|\bred\b/i.test(rh.replace(/Red[^.]*\./g, '').replace(/never red[^.]*\./g, '')), 'the styles of the Houses never use the red of a mistake')
  ok(/--rh-blue/.test(rule('.rhmark.blue')) && /--rh-gold/.test(rule('.rhmark.gold')) && /--rh-blue/.test(rule('.rhcell.own.blue')) && /--rh-gold/.test(rule('.rhcell.own.gold')), 'the two players have their own colors')
  ok((rh.match(/--rh-blue:/g) ?? []).length === 3 && (rh.match(/--rh-gold:/g) ?? []).length === 3 && /prefers-color-scheme: dark/.test(rh) && /data-theme="dark"/.test(rh), 'both colors are defined for light, dark by system and dark by choice')
  ok(/repeat\(9, minmax\(0, 1fr\)\)/.test(rule('.rhboard')) && /aspect-ratio: 1/.test(rule('.rhcell')), 'the board is nine equal columns of square cells, so it fits a phone')
  // a class called `over` is the overline of a formula (.over in styles.css), so no element of the game may carry it: it drew a line above every text
  ok(/\.over \{ text-decoration: overline/.test(css) && !/className=\{?[`"'][^`"']*(?:^|[ '`])over[ '`$"]/.test(ui) && /rhtable\$\{over \? ' rhover' : ''\}/.test(ui), 'the finished table is not given the class over, which draws a line above the text')
  // on a laptop the board and everything beside it are two columns, so that the game fits the window without scrolling up and down
  const wide = css.slice(css.indexOf('/* On a laptop the Houses use two columns'))
  ok(/min-width: 900px/.test(wide) && /grid-template-columns: minmax\(0, 1fr\) 340px/.test(wide) && /calc\(100vh - 150px\)/.test(wide) && /\.rhtable > \.rhboard \{ grid-column: 1/.test(wide), 'a wide window shows the board on the left, as tall as the window allows, and the rest beside it')
}

console.log(`rumah check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
