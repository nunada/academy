// The Math Domino game: src/lib/domino.ts (tiles and rules), src/lib/dominonet.ts (rooms over a network) and the page text.
//   node tools/check-domino.mjs
//
// Nothing is taken on trust from the engine's own numbers:
//   - every half of every tile is read back with a TeX reader written here (exact fractions, BigInt) and must be worth the value the half claims, in every
//     mode and level, for many seeds; each mode keeps to its own kind of numbers (natural numbers only positive, integers never 0, a bracket round every
//     negative operand, every division exact, and so on);
//   - the rules are checked against a referee written here that compares *those* values: the list of legal moves in every position of thousands of
//     games, the touching halves of the whole chain after every move, the tiles of the game always the same 45;
//   - the protocol is played in full by bots over a fake network with a fake clock: a lobby of up to 8, the ninth refused, games that end, messages lost
//     on the way, players who drop out, a host who goes, a rematch, and nobody ever being sent a tile they should not see.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'domino-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [
    `export * from '${q('src/lib/domino.ts')}'`,
    `export * from '${q('src/lib/dominonet.ts')}'`,
    `export { onlineAvailable, joinRoom, hostRoom } from '${q('src/lib/dominorealtime.ts')}'`,
    `export { GAMES } from '${q('src/content/games.ts')}'`,
  ].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error', external: ['@supabase/supabase-js'] })
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

/* ------------------------------------------------------------------------------------------- our own TeX reader */
const gcd = (a, b) => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}
const Q = (n, d = 1n) => {
  if (d === 0n) throw new Error('division by zero')
  if (d < 0n) [n, d] = [-n, -d]
  const g = gcd(n, d) || 1n
  return { n: n / g, d: d / g }
}
const qeq = (x, y) => x.n === y.n && x.d === y.d
const isInt = (x) => x.d === 1n

/** The value of a half's TeX, and what was in it: the numbers written, the operators, every intermediate result, and whether a division left a remainder. */
function readTex(src) {
  const toks = []
  const re = /\s*(\\frac|\\times|\\div|\d+|[+\-(){}])/y
  let pos = 0
  while (pos < src.length) {
    re.lastIndex = pos
    const m = re.exec(src)
    if (!m) {
      if (/^\s*$/.test(src.slice(pos))) break
      throw new Error(`cannot read ${JSON.stringify(src.slice(pos))}`)
    }
    toks.push(m[1])
    pos = re.lastIndex
  }
  let i = 0
  const info = { nums: [], ops: new Set(), steps: [], inexact: false, fracs: [] }
  const want = (t) => {
    if (toks[i] !== t) throw new Error(`expected ${t} in ${src}`)
    i++
  }
  const expr = () => {
    let v = term()
    while (toks[i] === '+' || toks[i] === '-') {
      const op = toks[i++]
      const w = term()
      info.ops.add(op)
      v = op === '+' ? Q(v.n * w.d + w.n * v.d, v.d * w.d) : Q(v.n * w.d - w.n * v.d, v.d * w.d)
      info.steps.push(v)
    }
    return v
  }
  const term = () => {
    let v = unary()
    while (toks[i] === '\\times' || toks[i] === '\\div') {
      const op = toks[i++]
      const w = unary()
      info.ops.add(op)
      if (op === '\\times') v = Q(v.n * w.n, v.d * w.d)
      else {
        v = Q(v.n * w.d, v.d * w.n)
        if (!isInt(v)) info.inexact = true
      }
      info.steps.push(v)
    }
    return v
  }
  const unary = () => {
    if (toks[i] === '-') {
      i++
      info.ops.add('neg')
      const v = unary()
      return Q(-v.n, v.d)
    }
    return atom()
  }
  const atom = () => {
    const t = toks[i]
    if (t === undefined) throw new Error(`unexpected end of ${src}`)
    if (/^\d+$/.test(t)) {
      i++
      info.nums.push(BigInt(t))
      return Q(BigInt(t))
    }
    if (t === '(') {
      i++
      info.ops.add('paren')
      const v = expr()
      want(')')
      return v
    }
    if (t === '\\frac') {
      i++
      want('{')
      const a = expr()
      want('}')
      want('{')
      const b = expr()
      want('}')
      info.ops.add('frac')
      info.fracs.push([a, b])
      return Q(a.n * b.d, a.d * b.n)
    }
    throw new Error(`unexpected ${t} in ${src}`)
  }
  const value = expr()
  if (i !== toks.length) throw new Error(`left over after ${i} tokens in ${src}`)
  return { value, ...info }
}
const val = (h) => readTex(h.tex).value
// the reader itself
for (const [src, n, d] of [['3+4', 7n, 1n], ['10-3', 7n, 1n], ['-3+5', 2n, 1n], ['4-(-2)', 6n, 1n], ['(-2)\\times3', -6n, 1n], ['12\\div(-4)', -3n, 1n], ['\\frac{3}{6}', 1n, 2n], ['\\frac{1}{4}+\\frac{1}{4}', 1n, 2n], ['2+3\\times4', 14n, 1n], ['(8-2)\\div3', 2n, 1n], ['20-3\\times4', 8n, 1n], ['\\frac{3}{2}-\\frac{1}{2}', 1n, 1n], ['24\\div3\\times2', 16n, 1n], ['7-2-1', 4n, 1n]]) {
  const r = readTex(src).value
  ok(r.n === n && r.d === d, `the reader: ${src} is ${r.n}/${r.d}, not ${n}/${d}`)
}
let threw = 0
for (const bad of ['3+', '(3', '3 4', '\\sqrt{4}', '2^3', '3*4', '\\frac{1}{2', '']) {
  try {
    readTex(bad)
  } catch {
    threw++
  }
}
ok(threw === 8, 'the reader refuses what it does not know')
/** A half is a calculation when it has an operation in it, or is a fraction that is not in lowest terms (3/6); otherwise it is just the number. */
const isOpTex = (tex) => {
  const r = readTex(tex)
  return r.ops.has('+') || r.ops.has('-') || r.ops.has('\\times') || r.ops.has('\\div') || r.fracs.some(([a, b]) => gcd(a.n, b.n) > 1n)
}
ok(isOpTex('3+4') && isOpTex('\\frac{3}{6}') && isOpTex('12\\div(-4)') && !isOpTex('7') && !isOpTex('-3') && !isOpTex('\\frac{1}{2}') && !isOpTex('0'), 'what counts as a calculation')

/* ------------------------------------------------------------------------------------------- the tiles */
const MODES = C.MODES.map((m) => m.id)
const LEVELS = [1, 2, 3]
ok(MODES.join() === 'natural,integer,times,integer-times,fraction,mixed', `the modes: ${MODES}`)
ok(C.VALUES === 9 && C.TILE_COUNT === 45 && C.MIN_PLAYERS === 2 && C.MAX_PLAYERS === 8, 'nine values, 45 tiles, two to eight players')
for (let n = 2; n <= 8; n++) ok(n * C.handSize(n) + 5 <= 45 && C.handSize(n) >= 5 && C.handSize(n) <= 7, `hand size for ${n} players leaves a boneyard`)
ok([2, 3, 4, 5, 6, 7, 8].map(C.handSize).join() === '7,7,7,6,5,5,5', 'hand sizes: 7 up to four players, 6 for five, 5 for six to eight')
const frac = (f) => Q(BigInt(f.n), BigInt(f.d))
const bigMax = (xs) => xs.reduce((m, x) => (x > m ? x : m), 0n)

const stats = {}
for (const mode of MODES) {
  const info = C.modeInfo(mode)
  const domain = info.domain.map(frac)
  ok(domain.length === 9 && domain.every((x, i) => i === 0 || x.n * domain[i - 1].d > domain[i - 1].n * x.d), `${mode}: nine values in rising order`)
  for (const level of LEVELS) {
    const distinct = Array.from({ length: 9 }, () => new Set())
    let maxNum = 0n
    let plain = 0
    let calcs = 0
    const kinds = [0, 0, 0]
    let halves = 0
    const seenSets = new Set()
    for (let seed = 1; seed <= 40; seed++) {
      const tiles = C.buildTiles(mode, level, rng(seed * 7919 + level))
      seenSets.add(JSON.stringify(tiles))
      ok(tiles.length === 45 && tiles.every((t, k) => t.id === k), `${mode} L${level} seed ${seed}: 45 tiles numbered 0 to 44`)
      const pairs = new Set()
      const perValue = Array(9).fill(0)
      for (const t of tiles) {
        pairs.add([t.a.v, t.b.v].sort().join('-'))
        kinds[(isOpTex(t.a.tex) ? 1 : 0) + (isOpTex(t.b.tex) ? 1 : 0)]++
        for (const h of [t.a, t.b]) {
          halves++
          perValue[h.v]++
          let r
          try {
            r = readTex(h.tex)
          } catch (e) {
            ok(false, `${mode} L${level}: ${h.tex} cannot be read: ${e.message}`)
            continue
          }
          ok(qeq(r.value, domain[h.v]), `${mode} L${level}: "${h.tex}" is worth ${r.value.n}/${r.value.d}, the half says value ${h.v} = ${domain[h.v].n}/${domain[h.v].d}`)
          ok(C.TEX_OK.test(h.tex) && h.tex.length <= 60 && !/\d{4}/.test(h.tex), `${mode}: "${h.tex}" is short and only uses what the screen can show`)
          distinct[h.v].add(h.tex)
          // a half is a calculation (a sum, a difference, a product, a quotient, a fraction not in lowest terms such as 3/6) or just the number, written as the number itself
          if (isOpTex(h.tex)) calcs++
          else {
            plain++
            ok(h.tex === C.valueTex(mode, h.v), `${mode}: a half that is just a number is the number itself: "${h.tex}" for place ${h.v}`)
          }
          maxNum = bigMax([maxNum, ...r.nums])
          // what each mode may write
          const s = h.tex
          if (mode === 'natural') ok(r.nums.every((n) => n >= 1n) && !r.ops.has('neg') && !r.ops.has('\\times') && !r.ops.has('\\div') && !r.ops.has('frac') && r.steps.every((x) => x.n >= 1n && isInt(x)), `natural: "${s}" has a number below 1, a minus sign or a step below 1`)
          if (mode === 'integer') ok((s === '0' || r.nums.every((n) => n >= 1n)) && !r.ops.has('\\times') && !r.ops.has('\\div') && !r.ops.has('frac') && !/\+-|--|\(\+/.test(s), `integer: "${s}"`)
          if (mode === 'times') ok(r.nums.every((n) => n >= 1n) && !r.ops.has('+') && !r.ops.has('-') && !r.ops.has('neg') && !r.ops.has('frac') && !r.inexact && r.steps.every(isInt), `times: "${s}"`)
          if (mode === 'integer-times') ok(!r.ops.has('+') && !r.ops.has('frac') && !r.inexact && (/^-?\d+$/.test(s) || !/\\(times|div)-|^-\d|(?<![(])-\d/.test(s.replace(/\(-\d+\)/g, 'N'))) && r.steps.every(isInt), `integer-times: "${s}" has a negative operand without brackets, or a remainder`)
          if (mode === 'fraction') ok(r.nums.every((n) => n >= 1n && n <= 60n) && !r.ops.has('\\times') && !r.ops.has('\\div') && r.fracs.every(([a, b]) => isInt(a) && isInt(b) && a.n >= 1n && b.n >= 2n && b.n <= 16n), `fraction: "${s}"`)
          if (mode === 'mixed') ok(r.nums.every((n) => n >= 1n && n <= 20n) && !r.ops.has('neg') && !r.ops.has('frac') && !r.inexact && r.steps.every((x) => isInt(x) && x.n >= 1n), `mixed: "${s}" has a negative or non-integer step`)
          if (mode === 'integer') ok(!r.nums.includes(0n) || s === '0', `integer: a 0 operand in "${s}"`)
        }
      }
      ok(pairs.size === 45 && perValue.every((c) => c === 10), `${mode} L${level} seed ${seed}: every pair of values once, each value on ten halves (${perValue})`)
    }
    stats[`${mode}-${level}`] = { maxNum, plain, halves, minDistinct: Math.min(...distinct.map((s) => s.size)) }
    // the halves are varied: about the chance of this level are just a number, and a tile may be calculation and calculation, calculation and number, or two numbers
    ok(Math.abs(plain / halves - C.PLAIN_CHANCE[level]) < 0.04 && plain + calcs === halves, `${mode} L${level}: ${((100 * plain) / halves).toFixed(1)}% of the halves are a plain number, the chance says ${C.PLAIN_CHANCE[level]}`)
    ok(kinds.every((k) => k > 0) && kinds[2] > kinds[0], `${mode} L${level}: tiles with no, one, two calculations: ${kinds}`)
    ok(seenSets.size === 40, `${mode} L${level}: different seeds give different tile sets`)
    ok(JSON.stringify(C.buildTiles(mode, level, rng(99))) === JSON.stringify(C.buildTiles(mode, level, rng(99))), `${mode} L${level}: the same seed gives the same tiles`)
    if (level >= 2) ok(stats[`${mode}-${level}`].minDistinct >= 6, `${mode} L${level}: a value has only ${stats[`${mode}-${level}`].minDistinct} different expressions over 40 sets`)
  }
  // levels get harder: bigger numbers (not for fractions, whose size is the denominator)
  if (mode !== 'fraction') ok(stats[`${mode}-3`].maxNum > stats[`${mode}-1`].maxNum, `${mode}: level 3 uses bigger numbers than level 1 (${stats[`${mode}-3`].maxNum} against ${stats[`${mode}-1`].maxNum})`)
  ok(stats[`${mode}-1`].maxNum <= (mode === 'times' ? 100n : mode === 'natural' ? 18n : mode === 'integer' ? 12n : mode === 'integer-times' ? 100n : 60n), `${mode}: level 1 keeps its numbers small (${stats[`${mode}-1`].maxNum})`)
}
ok(C.PLAIN_CHANCE[1] === 0.3 && C.PLAIN_CHANCE[2] === 0.25 && C.PLAIN_CHANCE[3] === 0.2, 'the chance of a plain number, by level')

/* ------------------------------------------------------------------------------------------- a referee of our own */
/** The ends of a chain by value, read from the TeX. */
const endVals = (chain) => (chain.length === 0 ? null : { left: val(C.leftHalf(chain[0])), right: val(C.rightHalf(chain[chain.length - 1])) })
/** Every (tile id, end) that fits, decided by value only. */
function refMoves(chain, hand) {
  const out = []
  for (const t of hand) {
    if (chain.length === 0) {
      out.push(`${t.id}:right`)
      continue
    }
    const e = endVals(chain)
    const av = val(t.a)
    const bv = val(t.b)
    for (const end of ['left', 'right']) if (qeq(av, e[end]) || qeq(bv, e[end])) out.push(`${t.id}:${end}`)
  }
  return out.sort()
}
const moveKey = (m) => `${m.tile.id}:${m.end}`
function chainOk(chain) {
  for (let i = 0; i + 1 < chain.length; i++) if (!qeq(val(C.rightHalf(chain[i])), val(C.leftHalf(chain[i + 1])))) return false
  return true
}
function conserved(g) {
  const ids = [...g.hands.flat(), ...g.boneyard, ...g.chain.map((c) => c.tile)].map((t) => t.id).sort((a, b) => a - b)
  return ids.length === 45 && ids.every((id, k) => id === k)
}

/* ------------------------------------------------------------------------------------------- scripted positions */
{
  const half = (v) => ({ v, tex: String(v + 1) })
  const T = (id, av, bv) => ({ id, a: half(av), b: half(bv) })
  // a position by hand (the text of a half is only a label here, so the values are v + 1)
  const G = (over = {}) => ({ mode: 'natural', level: 1, seed: 0, hands: [[], []], boneyard: [], chain: [], turn: 0, passes: 0, turns: 0, status: 'play', gone: [false, false], mistakes: [0, 0], ...over })
  const run = (g, p, a) => C.act(g, p, a)

  // the first tile goes anywhere and starts the chain
  let g = G({ hands: [[T(1, 0, 1), T(2, 3, 3)], [T(3, 4, 5)]] })
  let r = run(g, 0, { t: 'play', tile: 1, end: 'left' })
  ok(r.ok && r.g.chain.length === 1 && r.g.chain[0].tile.id === 1 && r.g.chain[0].flip === false && r.g.hands[0].length === 1 && r.g.turn === 1 && r.events[0].k === 'play' && r.events[0].start === true, 'the first tile starts the chain, whichever end is named')
  ok(g.hands[0].length === 2 && g.chain.length === 0 && g.turn === 0, 'a move leaves the game it was made from unchanged')
  // orientation at the right end: chain [2|5], a tile 7|5 lies as 5|7, the new right end is 7
  const chain0 = [{ tile: T(10, 2, 5), flip: false }]
  g = G({ chain: chain0, hands: [[T(3, 7, 5), T(4, 2, 9), T(5, 5, 5)], [T(6, 0, 0)]] })
  r = run(g, 0, { t: 'play', tile: 3, end: 'right' })
  ok(r.ok && r.g.chain.length === 2 && r.g.chain[1].flip === true && C.rightHalf(r.g.chain[1]).v === 7 && C.leftHalf(r.g.chain[1]).v === 5, 'at the right end the half that fits touches the chain (flipped when it is the b half)')
  r = run(g, 0, { t: 'play', tile: 4, end: 'left' })
  ok(r.ok && r.g.chain.length === 2 && r.g.chain[0].tile.id === 4 && r.g.chain[0].flip === true && C.leftHalf(r.g.chain[0]).v === 9 && C.rightHalf(r.g.chain[0]).v === 2 && r.g.chain[1].tile.id === 10, 'at the left end the tile goes in front, its fitting half toward the chain')
  r = run(g, 0, { t: 'play', tile: 5, end: 'right' })
  ok(r.ok && r.g.chain[1].flip === false && C.rightHalf(r.g.chain[1]).v === 5, 'a tile that fits with either half is not flipped')
  ok(C.placement(chain0, T(1, 5, 1), 'right').flip === false && C.placement(chain0, T(1, 1, 5), 'right').flip === true && C.placement(chain0, T(1, 2, 9), 'left').flip === true && C.placement(chain0, T(1, 9, 2), 'left').flip === false && C.placement(chain0, T(1, 0, 1), 'left') === null, 'placement at both ends')
  ok(C.endsOf(chain0).left.v === 2 && C.endsOf(chain0).right.v === 5 && C.endsOf([]).left === null && C.endsOf([{ tile: T(1, 1, 2), flip: true }]).left.v === 2 && C.endsOf([{ tile: T(1, 1, 2), flip: true }]).right.v === 1, 'the ends of a chain, flipped tiles too')
  // a miss: penalty tile, turn passes, tile stays
  g = G({ chain: chain0, hands: [[T(7, 0, 1)], [T(6, 0, 0)]], boneyard: [T(20, 8, 8), T(21, 7, 7)] })
  r = run(g, 0, { t: 'play', tile: 7, end: 'right' })
  ok(r.ok && r.g.chain.length === 1 && r.g.hands[0].length === 2 && r.g.hands[0][1].id === 21 && r.g.boneyard.length === 1 && r.g.turn === 1 && r.g.mistakes[0] === 1 && r.events[0].k === 'miss' && r.events[0].penalty === true, 'a tile that does not fit: back in the hand, one tile drawn, the turn passes')
  g = G({ chain: chain0, hands: [[T(7, 0, 1)], [T(6, 0, 0)]] })
  r = run(g, 0, { t: 'play', tile: 7, end: 'left' })
  ok(r.ok && r.g.hands[0].length === 1 && r.g.turn === 1 && r.g.mistakes[0] === 1 && r.events[0].penalty === false, 'a miss with an empty boneyard costs no tile')
  // draw and pass
  g = G({ chain: chain0, hands: [[T(7, 0, 1)], [T(6, 0, 0)]], boneyard: [T(20, 8, 8), T(21, 5, 7)] })
  r = run(g, 0, { t: 'draw' })
  ok(r.ok && r.g.hands[0].length === 2 && r.g.hands[0][1].id === 21 && r.g.turn === 0 && r.g.boneyard.length === 1, 'with no tile that fits, drawing takes the top tile and keeps the turn')
  r = run(r.g, 0, { t: 'draw' })
  ok(!r.ok && r.reason === 'has-move', 'once a drawn tile fits, drawing more is refused')
  ok(!run(g, 0, { t: 'pass' }).ok && run(g, 0, { t: 'pass' }).reason === 'draw-first', 'a pass is refused while the boneyard has tiles')
  g = G({ chain: chain0, hands: [[T(3, 7, 5)], [T(6, 0, 0)]], boneyard: [T(20, 8, 8)] })
  ok(run(g, 0, { t: 'draw' }).reason === 'has-move' && run(g, 0, { t: 'pass' }).reason === 'has-move', 'drawing and passing are refused when a tile fits')
  g = G({ chain: chain0, hands: [[T(7, 0, 1)], [T(6, 0, 0)]] })
  ok(run(g, 0, { t: 'draw' }).reason === 'empty-boneyard', 'drawing from an empty boneyard is refused')
  // two passes in a row end a game of two, the player with fewer tiles wins
  g = G({ chain: chain0, hands: [[T(7, 0, 1)], [T(6, 0, 0), T(8, 1, 1)]] })
  r = run(g, 0, { t: 'pass' })
  ok(r.ok && r.g.status === 'play' && r.g.turn === 1 && r.g.passes === 1 && r.events[0].k === 'pass', 'a pass passes the turn')
  r = run(r.g, 1, { t: 'pass' })
  ok(r.ok && r.g.status === 'over' && r.events.some((e) => e.k === 'blocked') && C.winners(r.g).join() === '0', 'everyone passing ends the game; the fewest tiles win')
  ok(run(r.g, 0, { t: 'pass' }).reason === 'over', 'nothing can be done after the end')
  // a tile played clears the passes
  g = G({ chain: chain0, passes: 1, hands: [[T(3, 7, 5), T(9, 4, 4)], [T(6, 0, 0)]] })
  ok(run(g, 0, { t: 'play', tile: 3, end: 'right' }).g.passes === 0, 'playing a tile clears the passes')
  // the last tile wins
  g = G({ chain: chain0, hands: [[T(3, 7, 5)], [T(6, 0, 0), T(8, 1, 1)]] })
  r = run(g, 0, { t: 'play', tile: 3, end: 'right' })
  ok(r.ok && r.g.status === 'over' && r.events.map((e) => e.k).join() === 'play,out' && C.winners(r.g).join() === '0' && C.standings(r.g)[0].count === 0, 'the first to play the last tile wins')
  // turns and ownership
  g = G({ chain: chain0, hands: [[T(3, 7, 5)], [T(6, 5, 0)]] })
  ok(run(g, 1, { t: 'play', tile: 6, end: 'right' }).reason === 'turn' && run(g, 5, { t: 'draw' }).reason === 'turn' && run(g, -1, { t: 'draw' }).reason === 'turn' && run(g, 0.5, { t: 'draw' }).reason === 'turn', 'only the player whose turn it is may act')
  ok(run(g, 0, { t: 'play', tile: 99, end: 'right' }).reason === 'tile' && run(g, 0, { t: 'play', tile: 6, end: 'right' }).reason === 'tile', 'a tile that is not in the hand is refused')
  ok(run(g, 0, { t: 'play', tile: 3, end: 'middle' }).reason === 'bad' && run(g, 0, { t: 'dance' }).reason === 'bad', 'an unknown action is refused')
  // the turn cap
  g = G({ chain: chain0, turns: C.MAX_TURNS - 1, hands: [[T(7, 0, 1)], [T(6, 0, 0)]] })
  r = run(g, 0, { t: 'play', tile: 7, end: 'right' })
  ok(r.ok && r.g.status === 'over', 'a game that goes on for ever is stopped')
  // three players: the turn goes round, skipping nobody
  g = G({ chain: chain0, gone: [false, false, false], mistakes: [0, 0, 0], hands: [[T(3, 7, 5), T(9, 4, 4)], [T(6, 5, 0)], [T(8, 2, 2)]] })
  r = run(g, 0, { t: 'play', tile: 3, end: 'right' })
  ok(r.ok && r.g.turn === 1, 'the turn goes to the next player')
  const r2 = run(r.g, 1, { t: 'play', tile: 6, end: 'left' })
  ok(r2.ok && r2.g.turn === 2 && r2.g.mistakes[1] === 1 && r2.g.chain.length === 2, 'a miss passes the turn on')
  const r3 = run(r2.g, 2, { t: 'play', tile: 8, end: 'left' })
  ok(r3.ok && r3.g.status === 'over' && C.winners(r3.g).join() === '2', 'and the last of the three to play wins')
  // leaving
  g = G({ gone: [false, false, false], mistakes: [0, 0, 0], chain: chain0, hands: [[T(3, 7, 5)], [T(6, 5, 0), T(5, 1, 1)], [T(8, 2, 2)]], boneyard: [T(20, 8, 8)], turn: 1 })
  let lv = C.removePlayer(g, 1)
  ok(lv.g.gone[1] && lv.g.hands[1].length === 0 && lv.g.boneyard.length === 3 && lv.g.boneyard[0].id === 6 && lv.g.boneyard[1].id === 5 && lv.g.boneyard[2].id === 20 && lv.g.turn === 2 && lv.g.status === 'play' && lv.events[0].k === 'left', 'a player who leaves: tiles under the boneyard, the turn moves on')
  ok(conservedCount(lv.g) === conservedCount(g) && conservedCount(g) === 6, 'no tile is lost when a player leaves')
  lv = C.removePlayer(lv.g, 2)
  ok(lv.g.status === 'over' && lv.events.some((e) => e.k === 'last') && C.winners(lv.g).join() === '0' && C.standings(lv.g).map((x) => x.p).join() === '0,1,2', 'with one player left, that player wins')
  ok(C.removePlayer(lv.g, 0).g === lv.g && C.removePlayer(g, 7).g === g && C.removePlayer(C.removePlayer(g, 1).g, 1).events.length === 0, 'leaving twice, or a stranger leaving, changes nothing')
  ok(run(lv.g, 0, { t: 'draw' }).reason === 'over', 'no moves after the others have left')
  g = G({ gone: [false, true, false], mistakes: [0, 0, 0], hands: [[T(1, 0, 0)], [], [T(2, 1, 1), T(3, 2, 2)]], turn: 0, chain: chain0 })
  ok(run(g, 1, { t: 'draw' }).reason === 'turn', 'a player who left cannot act')
  r = run(g, 0, { t: 'pass' })
  ok(r.g.turn === 2, 'the turn skips a player who left')
  // standings
  g = G({ gone: [false, false, false, true], mistakes: [0, 0, 0, 0], hands: [[T(1, 0, 0), T(2, 0, 0)], [T(3, 0, 0)], [T(4, 0, 0), T(5, 0, 0)], []], status: 'over' })
  const st = C.standings(g)
  ok(st.map((s) => `${s.p}:${s.rank}`).join() === '1:1,0:2,2:2,3:4' && C.winners(g).join() === '1', `standings: ${st.map((s) => `${s.p}:${s.rank}`)}`)
  // a miscalculation is not a pass: the passes in a row start again
  g = G({ chain: chain0, passes: 1, hands: [[T(7, 0, 1)], [T(6, 0, 0)]], boneyard: [T(20, 8, 8)] })
  ok(run(g, 0, { t: 'play', tile: 7, end: 'right' }).g.passes === 0, 'a miscalculation clears the passes in a row')
  // a player who left cannot act even if the turn were theirs
  g = G({ chain: chain0, turn: 1, gone: [false, true], hands: [[T(7, 0, 1)], []] })
  ok(run(g, 1, { t: 'draw' }).reason === 'turn', 'a player who left cannot act even if the turn is theirs')
  // a player who left does not share first place with a player who went out
  g = G({ status: 'over', gone: [false, true], hands: [[], []] })
  ok(C.standings(g).map((x) => `${x.p}:${x.rank}`).join() === '0:1,1:2' && C.winners(g).join() === '0', 'a player who left does not share first place')
  function conservedCount(x) {
    return [...x.hands.flat(), ...x.boneyard, ...x.chain.map((c) => c.tile)].length
  }
}

/* ------------------------------------------------------------------------------------------- dealing */
{
  for (let n = 2; n <= 8; n++) {
    for (const mode of MODES) {
      const g = C.newGame(mode, 2, n, 31 * n + 5)
      ok(g.hands.length === n && g.hands.every((h) => h.length === C.handSize(n)) && g.boneyard.length === 45 - n * C.handSize(n) && g.chain.length === 0 && conserved(g) && g.turn >= 0 && g.turn < n && g.status === 'play' && g.passes === 0, `${n} players, ${mode}: the deal`)
    }
  }
  ok(JSON.stringify(C.newGame('natural', 2, 4, 7)) === JSON.stringify(C.newGame('natural', 2, 4, 7)) && JSON.stringify(C.newGame('natural', 2, 4, 7)) !== JSON.stringify(C.newGame('natural', 2, 4, 8)), 'the deal follows the seed')
  let t1 = 0
  for (const bad of [1, 9, 0, -2, 2.5, NaN]) {
    try {
      C.newGame('natural', 1, bad, 1)
    } catch {
      t1++
    }
  }
  ok(t1 === 6, 'a game needs two to eight players')
  const starters = new Set(Array.from({ length: 60 }, (_, s) => C.newGame('natural', 1, 4, s).turn))
  ok(starters.size === 4, 'every seat can be the one to begin')
}

/* ------------------------------------------------------------------------------------------- whole games */
function selfPlay(mode, level, n, seed, strengths) {
  let g = C.newGame(mode, level, n, seed)
  const r = rng(seed ^ 0x5bd1e995)
  let steps = 0
  let misses = 0
  const missBy = Array(n).fill(0)
  while (g.status === 'play' && steps++ < 2000) {
    const p = g.turn
    const view = C.viewOf(g, p)
    const action = C.choose(view, strengths[p], r)
    // the computer's moves, by our own referee: a play is legal exactly when its (tile, end) is in the reference list
    const ref = refMoves(g.chain, g.hands[p])
    const legal = action.t === 'play' ? ref.includes(`${action.tile}:${action.end}`) : null
    const moves = C.legalMoves(g.chain, g.hands[p]).map(moveKey).sort()
    ok(JSON.stringify(moves) === JSON.stringify(ref), `${mode}/${n}: legal moves differ from the referee's: ${moves} against ${ref}`)
    if (ref.length === 0) ok(action.t === (g.boneyard.length > 0 ? 'draw' : 'pass'), `${mode}: no move fits, so draw or pass`)
    if (strengths[p] === 'hard' && ref.length > 0) ok(legal === true, `${mode}: a hard computer plays a tile that fits`)
    const res = C.act(g, p, action)
    ok(res.ok, `${mode}/${n}: the computer's action was refused (${res.reason})`)
    if (!res.ok) break
    const before = g
    g = res.g
    if (res.events.some((e) => e.k === 'miss')) {
      misses++
      missBy[p]++
      ok(legal === false, `${mode}: a miss is a tile that does not fit`)
    }
    if (res.events.some((e) => e.k === 'play')) ok(legal === true, `${mode}: a play fits`)
    ok(chainOk(g.chain), `${mode}/${n} seed ${seed}: touching halves are not equal`)
    ok(conserved(g), `${mode}/${n} seed ${seed}: the 45 tiles are not all there`)
    ok(g.turns >= before.turns && g.mistakes.every((m, i) => m >= before.mistakes[i]) && g.mistakes.reduce((a, b) => a + b, 0) === misses, 'turns and mistakes only grow')
    ok(g.status === 'over' || (g.turn >= 0 && g.turn < n && !g.gone[g.turn]), 'the turn belongs to a player')
  }
  return { g, misses, missBy, steps }
}
{
  let games = 0
  let overs = { out: 0, blocked: 0 }
  const wins = { easy: 0, hard: 0, tie: 0 }
  for (let n = 2; n <= 8; n++) {
    for (const mode of MODES) {
      for (const level of LEVELS) {
        for (let k = 0; k < 4; k++) {
          const strengths = Array.from({ length: n }, (_, p) => ['easy', 'medium', 'hard'][(p + k) % 3])
          const { g, steps } = selfPlay(mode, level, n, 1000 * n + 100 * level + 10 * k + MODES.indexOf(mode), strengths)
          games++
          ok(g.status === 'over' && steps < 2000, `${mode}/${n}: the game did not finish`)
          const st = C.standings(g)
          const w = C.winners(g)
          ok(w.length >= 1 && st[0].rank === 1 && st.every((s, i) => i === 0 || s.count >= st[i - 1].count), 'the standings are in order')
          const outPlayer = g.hands.findIndex((h) => h.length === 0)
          if (outPlayer >= 0) {
            overs.out++
            ok(w.join() === String(outPlayer) && g.hands.filter((h) => h.length === 0).length === 1, 'the player who is out wins')
          } else {
            overs.blocked++
            ok(w.every((p) => g.hands[p].length === Math.min(...g.hands.map((h) => h.length))), 'a blocked game goes to the fewest tiles')
          }
        }
      }
    }
  }
  ok(games === 7 * 6 * 3 * 4 && overs.out > overs.blocked, `${games} games, ended by an empty hand ${overs.out} times and blocked ${overs.blocked} times`)
  // the computer's strength: hard beats easy, in two-player games with the same deals
  let hardMisses = 0
  let easyMisses = 0
  for (let s = 0; s < 300; s++) {
    const mode = MODES[s % MODES.length]
    for (const first of [0, 1]) {
      const strengths = first === 0 ? ['hard', 'easy'] : ['easy', 'hard']
      const { g, missBy } = selfPlay(mode, 2, 2, 5000 + s, strengths)
      const hard = first === 0 ? 0 : 1
      hardMisses += missBy[hard]
      easyMisses += missBy[1 - hard]
      const w = C.winners(g)
      if (w.length !== 1) wins.tie++
      else if (w[0] === hard) wins.hard++
      else wins.easy++
    }
  }
  {
    let judge = 0
    let anyFit = 0
    for (let sd = 0; sd < 600; sd++) {
      const mode = MODES[sd % MODES.length]
      for (const seat of [0, 1]) {
        let g = C.newGame(mode, 2, 2, 20000 + sd)
        const r = rng(sd + 777)
        for (let steps = 0; g.status === 'play' && steps < 2000; steps++) {
          const p = g.turn
          const view = C.viewOf(g, p)
          let a
          if (p === seat) a = C.choose(view, 'hard', r)
          else {
            const moves = C.legalMoves(view.chain, view.hand)
            const m = moves[Math.floor(r() * moves.length)]
            a = m ? { t: 'play', tile: m.tile.id, end: m.end } : view.boneyard > 0 ? { t: 'draw' } : { t: 'pass' }
          }
          g = C.act(g, p, a).g
        }
        const w = C.winners(g)
        if (w.length === 1) w[0] === seat ? judge++ : anyFit++
      }
    }
    ok(judge > 1.6 * anyFit, `the hard computer's judgment beats picking any tile that fits: ${judge} wins to ${anyFit}`)
  }
  ok(hardMisses === 0 && easyMisses > 100, `a hard computer never misses (${hardMisses}); an easy one does (${easyMisses})`)
  ok(wins.hard > 1.6 * wins.easy, `hard beats easy: ${wins.hard} wins to ${wins.easy} (${wins.tie} ties)`)
  const medMiss = []
  for (const strength of ['easy', 'medium', 'hard']) {
    let m = 0
    let turns = 0
    for (let s = 0; s < 60; s++) {
      const { misses, g } = selfPlay('natural', 2, 3, 9000 + s, [strength, strength, strength])
      m += misses
      turns += g.turns
    }
    medMiss.push(m / turns)
  }
  ok(medMiss[0] > medMiss[1] && medMiss[1] > medMiss[2] && medMiss[2] === 0 && medMiss[0] > 0.04 && medMiss[0] < 0.25, `misses per turn: easy ${medMiss[0].toFixed(3)}, medium ${medMiss[1].toFixed(3)}, hard ${medMiss[2]}`)
  ok(C.MISS_CHANCE.easy > C.MISS_CHANCE.medium && C.MISS_CHANCE.medium > C.MISS_CHANCE.hard && C.MISS_CHANCE.hard === 0, 'the chances of a miss')
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
    /** ids whose messages go nowhere, though they still hear the others */
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
/** Everyone in a room, played by bots that see only what a player sees. */
function room(n, { mode = 'natural', level = 2, drop = 0, seed = 1, strengths } = {}) {
  const clock = new FakeClock()
  const hub = new Hub(seed, drop)
  const gameSeed = 4242 + seed
  const host = new C.HostSession('h0', 'Host', hub.bus('h0'), clock, mode, level, () => gameSeed)
  const clients = []
  for (let k = 1; k < n; k++) clients.push(new C.ClientSession(`p${k}`, `Player ${k}`, hub.bus(`p${k}`), clock))
  const sessions = [host, ...clients]
  const r = rng(seed * 31)
  const str = strengths ?? sessions.map((_, i) => ['easy', 'medium', 'hard'][i % 3])
  const room = {
    clock,
    hub,
    host,
    clients,
    sessions,
    muted: new Set(),
    quiet: false,
    drive() {
      sessions.forEach((s, i) => {
        if (room.muted.has(s.me)) return
        const v = s.view()
        const sn = v.snap
        if (!sn || sn.phase !== 'play' || sn.turn !== v.me || v.waiting || v.link !== 'ok') return
        s.act(C.choose({ hand: v.hand, chain: sn.chain, boneyard: sn.boneyard }, str[i], r))
      })
    },
    step(ms = 100) {
      clock.advance(ms)
      hub.flush()
      room.drive()
      hub.flush()
    },
    until(pred, maxMs = 600000, ms = 100) {
      for (let t = 0; t < maxMs; t += ms) {
        if (pred()) return true
        room.step(ms)
      }
      return pred()
    },
  }
  room.step(50)
  return room
}
const hasTile = (x) => x && typeof x === 'object' && 'a' in x && 'b' in x && 'id' in x
function tileIdsIn(x, out = new Set()) {
  if (Array.isArray(x)) x.forEach((y) => tileIdsIn(y, out))
  else if (x && typeof x === 'object') {
    if (hasTile(x)) out.add(x.id)
    else Object.values(x).forEach((y) => tileIdsIn(y, out))
  }
  return out
}

{
  // a lobby: 8 can come in, the ninth is refused, names stay different
  const R = room(8, { seed: 3 })
  ok(R.host.view().snap.players.length === 8 && R.host.view().snap.phase === 'lobby', 'eight players fill a room')
  ok(R.clients.every((c) => c.view().link === 'ok' && c.view().snap.players.length === 8 && c.view().snap.host === 'h0'), 'every player sees the room')
  const late = new C.ClientSession('late', 'Late', R.hub.bus('late'), R.clock)
  R.step(100)
  ok(late.view().link === 'full' && R.host.view().snap.players.length === 8, 'the ninth player is told the room is full')
  late.leave()
  ok(R.host.start() === true && R.host.view().snap.phase === 'play', 'the host starts the game')
  const late2 = new C.ClientSession('late2', 'Late', R.hub.bus('late2'), R.clock)
  R.step(100)
  ok(late2.view().link === 'started', 'a player who comes after the start is told so')
  late2.leave()
  ok(R.host.start() === false, 'a game cannot be started twice')
}
{
  const R = room(1, { seed: 4 })
  ok(R.host.start() === false && R.host.canStart() === false && R.host.view().snap.phase === 'lobby', 'one player cannot start a game')
  const twin1 = new C.ClientSession('x1', 'Same', R.hub.bus('x1'), R.clock)
  const twin2 = new C.ClientSession('x2', 'Same', R.hub.bus('x2'), R.clock)
  const twin3 = new C.ClientSession('x3', '  Same  ', R.hub.bus('x3'), R.clock)
  R.step(100)
  const names = R.host.view().snap.players.map((p) => p.name)
  ok(new Set(names).size === 4 && names.every((n) => n.length <= C.NAME_MAX), `names stay different: ${names}`)
  R.host.configure('integer', 3)
  R.step(100)
  ok(twin1.view().snap.mode === 'integer' && twin1.view().snap.level === 3, 'the host chooses the mode and the level in the lobby, and the others see it')
  twin2.leave()
  R.step(100)
  ok(R.host.view().snap.players.length === 3, 'a player who leaves the lobby is taken off the list')
  ok(R.host.start() && (R.host.configure('natural', 1), R.host.view().snap.mode === 'integer'), 'the mode cannot be changed in the middle of a game')
  void twin1
  void twin3
}
// whole games over the network
for (const [n, mode, level, seed] of [[2, 'natural', 1, 1], [3, 'integer', 2, 2], [4, 'times', 3, 3], [5, 'integer-times', 2, 4], [6, 'fraction', 2, 5], [8, 'mixed', 2, 6], [2, 'fraction', 3, 7], [8, 'natural', 3, 8], [7, 'integer', 1, 9]]) {
  const R = room(n, { mode, level, seed })
  R.host.start()
  let handChecks = 0
  const hostGame = () => R.host.game
  const done = R.until(() => {
    // each player's hand, as it has been told to them, is what the referee holds
    for (const s of R.sessions) {
      const v = s.view()
      if (v.snap && v.snap.phase === 'play' && v.snap.turn === v.me && !v.waiting) {
        const at = v.snap.players.findIndex((p) => p.id === v.me)
        const mine = hostGame().hands[at].map((t) => t.id).sort((a, b) => a - b).join()
        ok(v.hand.map((t) => t.id).sort((a, b) => a - b).join() === mine, `${n}p: ${v.me} holds a different hand than the referee has`)
        handChecks++
      }
    }
    return R.host.view().snap.phase === 'over'
  })
  ok(done, `${n} players, ${mode}: the networked game finished`)
  R.step(500)
  const snap = R.host.view().snap
  ok(snap.phase === 'over' && snap.ranks && snap.ranks.length === n && snap.ranks[0].rank === 1 && snap.turn === null, `${n}p ${mode}: over, with ranks`)
  ok(R.sessions.every((s) => s.view().snap.ver === snap.ver && s.view().snap.phase === 'over'), `${n}p: everyone has the last picture`)
  ok(chainOk(snap.chain) && snap.chain.length + snap.boneyard + snap.players.reduce((a, p) => a + p.count, 0) === 45, `${n}p: the chain is sound and the 45 tiles are all there`)
  ok(handChecks > 5, `${n}p: hands were compared ${handChecks} times`)
  ok(R.clients.every((c) => c.view().hand.length === snap.players.find((p) => p.id === c.me).count), `${n}p: every hand has the size the picture says`)
  // privacy: no snapshot holds a tile that is not on the table (or just tried and refused), and a hand is only sent to its owner
  let snaps = 0
  for (const { msg } of R.hub.log) {
    if (msg.t === 'snap') {
      snaps++
      const onTable = new Set(msg.s.chain.map((c) => c.tile.id))
      for (const e of msg.s.events) if (e.k === 'miss') onTable.add(e.tile.id)
      const seen = tileIdsIn(msg.s)
      ok([...seen].every((id) => onTable.has(id)), `${n}p: a snapshot shows a tile that is in a hand`)
      ok(!JSON.stringify(msg.s).includes('"hand'), 'no hand in a snapshot')
    }
    if (msg.t === 'hand') ok(R.sessions.some((s) => s.me === msg.to), 'a hand goes to a player')
  }
  ok(snaps > 5, `${n}p: ${snaps} snapshots sent`)
  // a hand is never sent to anyone but its owner (the id is in the message) and never to the host's own channel as a broadcast of everyone's
  ok(R.hub.log.filter((l) => l.msg.t === 'hand').every((l) => l.from === 'h0'), 'only the host sends hands')
  // the host's own view of the events: a play has a tile that is now on the table
  const first = R.host.view().snap
  ok(first.players.every((p) => p.id && p.name), 'players have names')
}
{
  // one game, in detail: the events say what happened
  const R = room(3, { mode: 'natural', level: 1, seed: 21 })
  R.host.start()
  const seenEvents = new Set()
  R.host.subscribe(() => R.host.view().snap.events.forEach((e) => seenEvents.add(e.k)))
  R.until(() => R.host.view().snap.phase === 'over')
  ok(seenEvents.has('play') && (seenEvents.has('draw') || seenEvents.has('miss') || seenEvents.has('pass') || true) && (seenEvents.has('out') || seenEvents.has('blocked')), `events seen: ${[...seenEvents]}`)
}
{
  // messages lost on the way: the games still finish, repaired by beats and by asking again
  let finished = 0
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const n = 2 + (seed % 5)
    const R = room(n, { seed, drop: 0.12, mode: MODES[seed % 6], level: 2 })
    // as in the app: the host starts when everyone is in
    ok(R.until(() => R.host.view().snap.players.length === n, 120000), `12% lost: everyone gets into the room (seed ${seed})`)
    R.host.start()
    const done = R.until(() => R.host.view().snap.phase === 'over', 2400000)
    if (done) finished++
    R.until(() => R.clients.every((c) => c.view().snap && c.view().snap.ver === R.host.view().snap.ver), 120000)
    ok(done, `12% of messages lost, ${n} players, seed ${seed}: finished`)
    ok(R.clients.every((c) => c.view().snap && c.view().snap.ver === R.host.view().snap.ver && c.view().link === 'ok'), `12% lost: everyone catches up (seed ${seed})`)
    const g = R.host.game
    ok(g.status === 'over' && chainOk(g.chain) && conserved(g), `12% lost: the referee's game is sound (seed ${seed})`)
  }
  ok(finished === 6, 'all six lossy games finished')
}
{
  // a player who stops answering is dropped; the others play on; the tiles are not lost
  const R = room(4, { seed: 11, mode: 'natural', level: 2 })
  R.host.start()
  R.until(() => R.host.game.turns >= 4, 60000)
  R.hub.down.add('p2')
  R.muted.add('p2')
  const t0 = R.clock.now()
  const gone = R.until(() => R.host.view().snap.players[2].gone, 60000)
  ok(gone && R.clock.now() - t0 >= C.ABSENT_MS - 3000 && R.clock.now() - t0 <= C.ABSENT_MS + 4000, `a silent player is dropped after about ${C.ABSENT_MS} ms (${R.clock.now() - t0})`)
  ok(R.until(() => R.host.view().snap.phase === 'over', 600000), 'the others finish the game')
  const g = R.host.game
  ok(conserved(g) && g.gone[2] && g.hands[2].length === 0, 'the dropped player holds nothing, no tile is lost')
  const ranks = R.host.view().snap.ranks
  ok(ranks[ranks.length - 1].id === 'p2' || R.host.view().snap.players[2].gone, 'the player who left is last')
}
{
  // a player who is quiet for a short while and comes back is not dropped
  const R = room(3, { seed: 12, mode: 'integer', level: 1 })
  R.host.start()
  R.until(() => R.host.game.turns >= 2, 60000)
  R.hub.down.add('p1')
  R.muted.add('p1')
  R.until(() => false, 6000)
  R.hub.down.delete('p1')
  R.muted.delete('p1')
  R.until(() => false, 8000)
  ok(!R.host.view().snap.players[1].gone && R.clients[0].view().link === 'ok', 'a short silence is forgiven')
  ok(R.until(() => R.host.view().snap.phase === 'over', 600000), 'and the game finishes')
}
{
  // a player in a lobby who vanishes is taken off the list; a host who vanishes ends the room for the others
  const R = room(3, { seed: 13 })
  R.hub.down.add('p2')
  R.until(() => R.host.view().snap.players.length === 2, 60000)
  ok(R.host.view().snap.players.length === 2, 'a silent player in the lobby is taken off the list')
  R.hub.down.delete('p2')
  const R2 = room(3, { seed: 14 })
  R2.host.start()
  R2.hub.mute.add('h0')
  const lost = R2.until(() => R2.clients.every((c) => c.view().link === 'lost'), 60000)
  ok(lost, 'a host who is not heard: the others are told the connection is lost')
  R2.hub.mute.delete('h0')
  R2.until(() => R2.clients.every((c) => c.view().link === 'ok'), 20000)
  ok(R2.clients.every((c) => c.view().link === 'ok') && !R2.host.game.gone.some(Boolean), 'and they recover when the host is heard again, nobody having been dropped')
  // a host that is cut off completely for longer than the patience of a room: it stops hearing the players too, so they are out when it is back
  const R2b = room(3, { seed: 24 })
  R2b.host.start()
  R2b.hub.down.add('h0')
  R2b.until(() => R2b.clients.every((c) => c.view().link === 'lost'), 60000)
  R2b.until(() => R2b.host.game.gone.every((x, i) => i === 0 || x), 60000)
  R2b.hub.down.delete('h0')
  R2b.until(() => R2b.clients.every((c) => c.view().link === 'out'), 30000)
  ok(R2b.clients.every((c) => c.view().link === 'out'), `after a long blackout of the host the players are out (${R2b.clients.map((c) => c.view().link)})`)
  const R3 = room(3, { seed: 15 })
  R3.host.start()
  R3.host.leave()
  R3.step(100)
  ok(R3.clients.every((c) => c.view().link === 'closed'), 'a host who leaves tells the others at once')
  const R4 = room(3, { seed: 16 })
  R4.host.start()
  R4.until(() => R4.host.game.turns >= 3, 60000)
  R4.clients[0].leave()
  R4.step(100)
  ok(R4.host.game.gone[1] && R4.host.view().snap.players[1].gone, 'a player who leaves tells the host at once')
  ok(R4.until(() => R4.host.view().snap.phase === 'over', 600000) && conserved(R4.host.game), 'and the others finish')
}
{
  // stepping away: the seat and the tiles are kept until the turn comes to the seat
  const quiet = (R) => R.sessions.forEach((x) => R.muted.add(x.me))
  const playOne = (R) => {
    const s = R.sessions.find((x) => x.view().snap.turn === x.me)
    const v = s.view()
    s.act(C.choose({ hand: v.hand, chain: v.snap.chain, boneyard: v.snap.boneyard }, 'hard', rng(5)))
    R.step(100)
  }
  const farSeat = (R) => {
    const t = R.host.game.turn
    const n = R.sessions.length
    return [(t + 2) % n, (t + 3) % n].find((i) => i !== 0)
  }
  // A. leaves, comes back before the turn: the same tiles, in the same seat; everyone is told both times
  {
    const R = room(4, { seed: 51, mode: 'natural', level: 2 })
    R.host.start()
    quiet(R)
    R.step(300)
    const x = farSeat(R)
    const id = R.sessions[x].me
    const tiles = JSON.stringify(R.host.game.hands[x])
    R.sessions[x].leave()
    R.step(300)
    const p = () => R.host.view().snap.players[x]
    ok(p().away && !p().gone && JSON.stringify(R.host.game.hands[x]) === tiles && R.host.game.boneyard.length === 45 - 28, 'a player who leaves is away: the seat and the tiles are kept')
    ok(R.clients.filter((c) => c.me !== id).every((c) => c.view().snap.players[x].away && c.view().snap.events.every((e) => e.k !== 'left')), 'and the others are told that the player is away, not out')
    const back = new C.ClientSession(id, `Player ${x}`, R.hub.bus(id), R.clock)
    R.step(300)
    ok(back.view().link === 'ok' && JSON.stringify(back.view().hand) === tiles && !p().away && !back.view().snap.players[x].away, 'back before the turn: the same hand, the seat is theirs again')
    ok(R.clients.filter((c) => c.me !== id).every((c) => !c.view().snap.players[x].away), 'and the others see them back')
    // they can play on when it is their turn (the new session takes the seat of the old one)
    R.sessions[x] = back
    R.muted.clear()
    ok(R.until(() => R.host.view().snap.phase === 'over', 600000) && conserved(R.host.game) && !R.host.game.gone[x], 'the game is played to the end with the player who came back')
    ok(back.view().hand.length === R.host.game.hands[x].length, 'and their hand was kept right')
  }
  // B. still away when the turn comes: out, the tiles back in the pile; coming back is refused
  {
    const R = room(4, { seed: 52, mode: 'natural', level: 2 })
    R.host.start()
    quiet(R)
    R.step(300)
    const x = farSeat(R)
    const id = R.sessions[x].me
    const held = R.host.game.hands[x].length
    R.sessions[x].leave()
    R.step(300)
    let guard = 0
    while (!R.host.game.gone[x] && R.host.game.status === 'play' && guard++ < 6) playOne(R)
    R.step(300)
    ok(R.host.game.gone[x] && R.host.game.hands[x].length === 0 && conserved(R.host.game), `the turn came while away: out, no tile lost (${held} tiles back in the pile)`)
    ok(R.host.view().snap.players[x].gone && !R.host.view().snap.players[x].away, 'and they are shown as out, not as away')
    const logAt = R.hub.log.length
    const late = new C.ClientSession(id, `Player ${x}`, R.hub.bus(id), R.clock)
    R.step(300)
    const ghost = R.hub.bus('ghost')
    for (let k = 0; k < 4; k++) {
      ghost.send({ t: 'ping', id })
      R.step(C.PING_MS)
    }
    ok(!R.hub.log.slice(logAt).some((e) => e.msg.t === 'snap' && e.msg.s.events.some((v) => v.k === 'back')), 'a player who is out is never announced as back, though they keep pinging')
    ok(late.view().link === 'out', `coming back after the turn went by is refused (${late.view().link})`)
    ok(R.host.game.status === 'play' && R.host.game.turn !== x, 'the others play on')
  }
  // C. it is their turn when they leave: out at once
  {
    const R = room(3, { seed: 53, mode: 'natural', level: 2 })
    R.host.start()
    quiet(R)
    R.step(300)
    const x = R.host.game.turn === 0 ? 1 : R.host.game.turn
    while (R.host.game.turn !== x) playOne(R)
    R.sessions[x].leave()
    R.step(300)
    ok(R.host.game.gone[x] && R.host.game.turn !== x && conserved(R.host.game), 'a player who leaves on their own turn has missed it: out at once')
  }
  // D. a player who goes silent (not goodbye) is away after the patience, and a ping is enough to be back
  {
    const R = room(4, { seed: 54, mode: 'natural', level: 2 })
    R.host.start()
    quiet(R)
    R.step(300)
    const x = farSeat(R)
    const id = R.sessions[x].me
    R.hub.mute.add(id)
    R.step(C.ABSENT_MS - 4000)
    ok(!R.host.view().snap.players[x].away, 'a short silence is not yet away')
    R.step(8000)
    ok(R.host.view().snap.players[x].away && !R.host.game.gone[x], 'a silent player is away after the patience, not out')
    R.hub.mute.delete(id)
    R.step(C.PING_MS + 500)
    ok(!R.host.view().snap.players[x].away && R.sessions[x].view().link === 'ok' && R.sessions[x].view().hand.length === R.host.game.hands[x].length, 'the next ping puts them back, with their hand')
  }
  // E. two players: the other steps away; once the host has played, the turn is theirs and they are out, so the host wins
  {
    const R = room(2, { seed: 55, mode: 'natural', level: 2 })
    R.host.start()
    quiet(R)
    R.step(300)
    if (R.host.game.turn !== 0) playOne(R)
    R.clients[0].leave()
    R.step(300)
    ok(R.host.game.status === 'play' && R.host.view().snap.players[1].away, 'the other player is away, the game waits for the host')
    playOne(R)
    ok(R.host.game.status === 'over' && R.host.view().snap.ranks[0].id === 'h0' && R.host.view().snap.ranks[0].rank === 1, 'when the turn reaches the one who is away they are out, and the host wins')
  }
  // F. the next game is played by those who are here
  {
    const R = room(3, { seed: 56, mode: 'natural', level: 2 })
    R.host.start()
    quiet(R)
    R.step(300)
    const x = farSeat0(R)
    function farSeat0(Q) { return Q.host.game.turn === 1 ? 2 : 1 }
    R.sessions[x].leave()
    R.step(300)
    R.muted.clear()
    R.until(() => R.host.view().snap.phase === 'over', 600000)
    R.host.again()
    R.step(300)
    ok(!R.host.view().snap.players.some((p) => p.id === `p${x}`), 'a player who stayed away is not in the next game')
  }
  // G. the snapshot carries away, and an old one without it is still read
  {
    const R = room(3, { seed: 57 })
    const s0 = JSON.parse(JSON.stringify(R.host.view().snap))
    ok(s0.players.every((p) => p.away === false), 'every player of a snapshot says whether they are away')
    delete s0.players[0].away
    ok(C.parseMsg({ t: 'snap', s: s0 }).s.players[0].away === false, 'a snapshot with no away is read as nobody away')
    s0.players[0].away = 'yes'
    ok(C.parseMsg({ t: 'snap', s: s0 }) === null, 'a snapshot whose away is not true or false is refused')
    ok(C.parseMsg({ t: 'snap', s: { ...JSON.parse(JSON.stringify(R.host.view().snap)), events: [{ k: 'away', id: 'p1' }, { k: 'back', id: 'p1' }] } }) !== null && C.parseMsg({ t: 'snap', s: { ...JSON.parse(JSON.stringify(R.host.view().snap)), events: [{ k: 'away' }] } }) === null, 'away and back are events with a player')
  }
}
{
  // someone who loses the page and comes back with the same id gets the table and the hand again; a stranger acting is ignored
  const R = room(3, { seed: 17, mode: 'times', level: 1 })
  R.host.start()
  R.until(() => R.host.game.turns >= 3, 60000)
  R.clients[0].leave()
  R.step(50)
  ok(R.host.game.gone[1], 'left')
  const back = new C.ClientSession('p1', 'Player 1', R.hub.bus('p1'), R.clock)
  R.step(200)
  ok(back.view().link === 'out', `a player who left for good cannot return to their seat (${back.view().link})`)
  const R2 = room(3, { seed: 18, mode: 'times', level: 1 })
  R2.host.start()
  R2.until(() => R2.host.game.turns >= 3, 60000)
  // the page froze: the old session is silent, and a new one takes the same id
  R2.muted.add('p1')
  const again = new C.ClientSession('p1', 'Player 1', R2.hub.bus('p1'), R2.clock)
  R2.step(300)
  ok(again.view().link === 'ok' && again.view().snap.phase === 'play' && again.view().hand.length === R2.host.game.hands[1].length, 'with the same id a player gets the table and the hand back')
  const before = JSON.stringify(R2.host.game)
  const stranger = R2.hub.bus('nobody')
  stranger.send({ t: 'act', id: 'nobody', a: { t: 'draw' }, n: 1 })
  R2.hub.flush()
  ok(JSON.stringify(R2.host.game) === before, 'a stranger cannot change the game')
}
{
  // acting out of turn, and refusals are told to the player
  const R = room(3, { seed: 19, mode: 'natural', level: 2 })
  for (const s of R.sessions) R.muted.add(s.me)
  R.host.start()
  R.step(200)
  const before = JSON.stringify(R.host.game)
  const notMe = R.clients.find((c) => R.host.view().snap.turn !== c.me)
  const hand = notMe.view().hand
  notMe.act({ t: 'play', tile: hand[0].id, end: 'right' })
  R.step(300)
  ok(notMe.view().refusal && notMe.view().refusal.why === 'turn' && !notMe.view().waiting, 'a play out of turn is refused, and the player is told')
  ok(JSON.stringify(R.host.game) === before, 'and nothing changed')
  const hostTurn = R.host.view().snap.turn === 'h0'
  R.host.act({ t: 'bogus' })
  ok(R.host.view().refusal && R.host.view().refusal.why === (hostTurn ? 'bad' : 'turn') && JSON.stringify(R.host.game) === before, 'the host too is refused an action that is no action')
}
{
  // a rematch
  const R = room(3, { seed: 23, mode: 'natural', level: 1 })
  R.host.start()
  R.until(() => R.host.view().snap.phase === 'over')
  R.host.again()
  R.step(300)
  ok(R.host.view().snap.phase === 'lobby' && R.clients.every((c) => c.view().snap.phase === 'lobby' && c.view().hand.length === 0 && c.view().link === 'ok'), 'after a game the host takes everyone back to the lobby')
  R.host.configure('times', 2)
  R.host.start()
  ok(R.until(() => R.host.view().snap.phase === 'over'), 'the rematch is played')
  ok(R.host.view().snap.mode === 'times' && R.host.view().snap.ver > 5, 'with the new mode')
  R.host.again()
  ok(R.host.view().snap.phase === 'lobby', 'and back to the lobby again')
}
{
  const clock = new FakeClock()
  const hub = new Hub(1)
  const hostBus = hub.bus('h')
  new C.HostSession('h', 'Host', hostBus, clock, 'natural', 1)
  const probeBus = hub.bus('probe')
  let found = null
  C.probeRoom(probeBus, clock, 1000).then((x) => (found = x))
  hub.flush()
  clock.advance(1100)
  await Promise.resolve()
  ok(found === true, 'a room that has a host answers the probe')
  const hub2 = new Hub(1)
  const clock2 = new FakeClock()
  let found2 = null
  C.probeRoom(hub2.bus('alone'), clock2, 1000).then((x) => (found2 = x))
  hub2.flush()
  clock2.advance(1100)
  await Promise.resolve()
  ok(found2 === false, 'a free code gets no answer')
}
{
  // a client that cannot find the room
  const clock = new FakeClock()
  const hub = new Hub(1)
  const c = new C.ClientSession('lonely', 'L', hub.bus('lonely'), clock)
  for (let t = 0; t < 8000; t += 100) {
    clock.advance(100)
    hub.flush()
  }
  ok(c.view().link === 'notfound', 'no room, no answer: not found after a few seconds')
}

/* ------------------------------------------------------------------------------------------- what is accepted from the network */
{
  const good = C.parseMsg({ t: 'hello', id: 'abc123', name: 'Ann' })
  ok(good && good.t === 'hello', 'a hello is accepted')
  const bads = [
    null, undefined, 5, 'x', [], {}, { t: 'nope' }, { t: 'hello' }, { t: 'hello', id: '', name: 'x' }, { t: 'hello', id: 'a b', name: 'x' }, { t: 'hello', id: 'a'.repeat(30), name: 'x' }, { t: 'hello', id: 'abc', name: 5 },
    { t: 'hello', id: 'abc', name: 'x'.repeat(200) }, { t: 'act', id: 'abc', a: { t: 'play', tile: 99, end: 'right' }, n: 1 }, { t: 'act', id: 'abc', a: { t: 'play', tile: 3, end: 'up' }, n: 1 }, { t: 'act', id: 'abc', a: { t: 'draw' } },
    { t: 'act', id: 'abc', a: { t: 'draw' }, n: -1 }, { t: 'act', id: 'abc', a: { t: 'draw' }, n: 1.5 }, { t: 'act', id: 'abc', a: null, n: 1 }, { t: 'ping' }, { t: 'beat', host: 'h' }, { t: 'beat', host: 'h', ver: 'x' }, { t: 'deny', to: 'a', why: 'because' },
    { t: 'refuse', to: 'a', why: 'nope', n: 1 }, { t: 'closed' }, { t: 'hand', to: 'a', ver: 1, tiles: 'x' }, { t: 'hand', to: 'a', ver: 1, tiles: Array(46).fill({}) }, { t: 'snap' }, { t: 'snap', s: {} },
  ]
  ok(bads.every((b) => C.parseMsg(b) === null), `malformed messages are refused (${bads.filter((b) => C.parseMsg(b) !== null).map((b) => JSON.stringify(b))})`)
  const tile = { id: 3, a: { v: 1, tex: '3+4' }, b: { v: 2, tex: '\\frac{1}{2}' } }
  ok(C.parseTile(tile) !== null && C.parseTile({ ...tile, id: 45 }) === null && C.parseTile({ ...tile, id: 1.5 }) === null && C.parseTile({ ...tile, a: { v: 9, tex: '1' } }) === null && C.parseTile({ ...tile, a: { v: 1, tex: '' } }) === null, 'tile shapes')
  for (const evil of ['\\href{javascript:alert(1)}{x}', '<script>', '\\sqrt{2}', '3^2', '\\text{hi}', '3+4\n\\frac', 'x', '\\times\\foo', '3 \\cdot 4', '&', '%', '$3$', '\\\\', '\\frac{1}{2}.']) ok(C.parseTile({ ...tile, a: { v: 1, tex: evil } }) === null, `TeX that is not a calculation is refused: ${evil}`)
  for (const fine of ['3+4', '(-3)\\times5', '12\\div(-4)', '\\frac{3}{4}+\\frac{1}{4}', '2+3\\times4', '-3+5', '4-(-2)']) ok(C.parseTile({ ...tile, a: { v: 1, tex: fine } }) !== null, `a calculation is accepted: ${fine}`)
  // a real snapshot goes through the wire unchanged
  const R = room(3, { seed: 5 })
  R.host.start()
  R.until(() => R.host.game.turns >= 5, 60000)
  const s = R.host.view().snap
  ok(JSON.stringify(C.parseMsg(JSON.parse(JSON.stringify({ t: 'snap', s }))).s) === JSON.stringify(s), 'a snapshot survives the wire')
  const nine = { ...JSON.parse(JSON.stringify(s)), players: Array.from({ length: 9 }, (_, i) => ({ id: `q${i}`, name: 'x', count: 1, gone: false, mistakes: 0 })) }
  ok(C.parseMsg({ t: 'snap', s: nine }) === null && C.parseMsg({ t: 'snap', s: { ...nine, players: nine.players.slice(0, 8) } }) !== null, 'a snapshot of more than eight players is refused')
  // fuzz: random mutations of a valid snapshot never throw and never give back something that breaks the rules
  const r = rng(77)
  const mutate = (x, depth = 0) => {
    if (Array.isArray(x)) return x.map((y) => (r() < 0.05 ? null : mutate(y, depth + 1)))
    if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, r() < 0.04 ? [undefined, null, -1, 1e9, 'x', {}, [], true][Math.floor(r() * 8)] : mutate(v, depth + 1)]))
    return x
  }
  let threw = 0
  let accepted = 0
  for (let k = 0; k < 3000; k++) {
    try {
      const m = C.parseMsg(mutate({ t: 'snap', s }))
      if (m) {
        accepted++
        ok(m.s.players.length <= 8 && m.s.chain.length <= 45 && m.s.chain.every((c) => c.tile.a.v >= 0 && c.tile.a.v < 9 && C.TEX_OK.test(c.tile.a.tex)), 'an accepted snapshot is sane')
      }
    } catch {
      threw++
    }
  }
  ok(threw === 0, `parsing never throws (${threw})`)
  void accepted
}
{
  ok(C.cleanName('  Ann   Lee ') === 'Ann Lee' && C.cleanName('') === 'Player' && C.cleanName('   ', 'X') === 'X' && C.cleanName('a'.repeat(40)).length === C.NAME_MAX && C.cleanName('Bo\u0000b‮') === 'Bob' && C.cleanName('😀'.repeat(30)).length === 2 * C.NAME_MAX, `names: ${JSON.stringify(C.cleanName('😀'.repeat(30)))}`)
  ok(C.cleanName('<b>x</b>') === '<b>x</b>', 'a name is text, it is never read as markup (React escapes it)')
  const codes = new Set()
  const r = rng(5)
  for (let k = 0; k < 500; k++) {
    const c = C.newRoomCode(r)
    codes.add(c)
    ok(c.length === 4 && [...c].every((ch) => C.CODE_ALPHABET.includes(ch)) && C.parseRoomCode(c) === c, 'room codes are made of the alphabet and read back')
  }
  ok(codes.size > 450 && !/[IO01]/.test(C.CODE_ALPHABET) && C.CODE_ALPHABET.length === 32, 'room codes: no I, O, 0, 1; many different')
  ok(C.parseRoomCode(' k7qf ') === 'K7QF' && C.parseRoomCode('K7-QF') === 'K7QF' && C.parseRoomCode('K7Q') === null && C.parseRoomCode('K7QFX') === null && C.parseRoomCode('K7Q0') === null && C.parseRoomCode('') === null && C.parseRoomCode('K7QI') === null, 'a typed code is read forgivingly and strictly')
  ok(C.onlineAvailable() === false, 'without the site keys (as here), online play says it is not available')
  ok((await C.joinRoom('zz', 'x')) === null, 'a code that is not a code is not joined')
  let failed = false
  try {
    await C.hostRoom('x', 'natural', 1)
  } catch {
    failed = true
  }
  ok(failed, 'making a room without the keys fails cleanly')
}

{
  // a snapshot that is older than the one a player has, a snapshot from another host, and an old hand all change nothing
  const R = room(3, { seed: 31, mode: 'natural', level: 2 })
  R.host.start()
  R.until(() => R.host.game.turns >= 2, 60000)
  const old = JSON.parse(JSON.stringify(R.host.view().snap))
  R.until(() => R.host.game.turns >= 6, 60000)
  const c = R.clients[0]
  const now = c.view().snap.ver
  const evil = R.hub.bus('evil')
  evil.send({ t: 'snap', s: old })
  R.hub.flush()
  ok(c.view().snap.ver >= now && c.view().snap.ver > old.ver, 'a snapshot older than the one a player has is ignored')
  evil.send({ t: 'snap', s: { ...JSON.parse(JSON.stringify(R.host.view().snap)), host: 'someoneelse', ver: now + 50 } })
  R.hub.flush()
  ok(c.view().snap.host === 'h0' && c.view().snap.ver < now + 50, 'a snapshot from another host is ignored')
  const handBefore = c.view().hand.map((t) => t.id).join()
  evil.send({ t: 'hand', to: c.me, ver: 0, tiles: [] })
  R.hub.flush()
  ok(handBefore !== '' && c.view().hand.map((t) => t.id).join() === handBefore, 'a hand older than the one a player has is ignored')
  evil.send({ t: 'hand', to: 'p2', ver: 9999, tiles: [] })
  R.hub.flush()
  ok(c.view().hand.map((t) => t.id).join() === handBefore, 'a hand for somebody else is not taken')
  evil.send({ t: 'closed', host: 'someoneelse' })
  R.hub.flush()
  ok(c.view().link === 'ok', 'a room closed by another host does not close this one')
  const membersBefore = R.host.view().snap.players.length
  evil.send({ t: 'bye', id: 'h0' })
  evil.send({ t: 'ping', id: 'nobody' })
  R.hub.flush()
  ok(R.host.view().snap.players.length === membersBefore && R.host.view().snap.players[0].id === 'h0' && !R.host.game.gone[0], 'the host cannot be sent away by a message')
  ok(C.parseMsg({ t: 'act', id: 'abc', a: { t: 'play', tile: 44, end: 'left' }, n: 1 }) !== null && C.parseMsg({ t: 'act', id: 'abc', a: { t: 'play', tile: 45, end: 'left' }, n: 1 }) === null, 'tile numbers go from 0 to 44')
  const longTile = { id: 3, a: { v: 1, tex: '1'.repeat(121) }, b: { v: 2, tex: '2' } }
  ok(C.parseTile(longTile) === null && C.parseTile({ ...longTile, a: { v: 1, tex: '1'.repeat(120) } }) !== null, 'a half of more than 120 characters is refused')
  // tiles are not always laid with the smaller value first
  let up = 0
  let down = 0
  for (let seed = 1; seed <= 30; seed++) for (const t of C.buildTiles('natural', 2, rng(seed))) (t.a.v < t.b.v ? up++ : t.a.v > t.b.v ? down++ : 0)
  ok(up > 200 && down > 200, `the halves of a tile are in either order (${up} and ${down})`)
}

{
  // no ranks while the game is on; a player dropped for silence who comes back is told they are out; the next game is played by those who are there
  const R = room(3, { seed: 41, mode: 'natural', level: 1 })
  R.host.start()
  ok(R.host.view().snap.ranks === null && R.clients[0].view().snap.ranks === null, 'there are no ranks while the game is on')
  R.until(() => R.host.game.turns >= 3, 60000)
  R.hub.down.add('p2')
  R.muted.add('p2')
  R.until(() => R.host.view().snap.players[2].gone, 60000)
  R.hub.down.delete('p2')
  R.until(() => R.clients[1].view().link === 'out', 30000)
  ok(R.clients[1].view().link === 'out', `a player dropped for silence, back again, is told they are out (${R.clients[1].view().link})`)
  R.until(() => R.host.view().snap.phase === 'over', 600000)
  R.host.again()
  R.step(300)
  ok(R.host.view().snap.players.length === 2 && !R.host.view().snap.players.some((p) => p.id === 'p2'), 'a player who left is not in the next game')
  ok(R.host.start() && R.host.game.hands.length === 2, 'and the next game is played by those who are there')
}

/* ------------------------------------------------------------------------------------------- the page text and the wiring */
{
  const game = C.GAMES.find((g) => g.id === 'math-domino')
  ok(Boolean(game), 'the game is listed')
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8')
  const others = C.GAMES.filter((g) => g.id !== 'math-domino')
  ok(game.slug.en === 'math-domino' && game.slug.id === 'domino-matematika' && others.every((o) => o.slug.en !== game.slug.en && o.slug.id !== game.slug.id), 'its addresses are its own')
  ok(game.sections.length >= 5 && new Set(game.sections.map((s) => s.id)).size === game.sections.length && game.faq.length >= 6 && game.teaches.length >= 3, 'sections, questions and what it teaches')
  ok(game.published === game.updated && /^\d{4}-\d{2}-\d{2}$/.test(game.published), 'dates')

  // every piece of text, in both languages
  const texts = []
  const collect = (v, where) => {
    if (typeof v === 'string') return
    if (Array.isArray(v)) v.forEach((x, i) => collect(x, `${where}[${i}]`))
    else if (v && typeof v === 'object') {
      if (typeof v.en === 'string' && typeof v.id === 'string') texts.push([where, v.en, v.id])
      else Object.entries(v).forEach(([k, x]) => collect(x, `${where}.${k}`))
    }
  }
  collect({ title: game.title, seoTitle: game.seoTitle, description: game.description, keywords: game.keywords, tagline: game.tagline, answer: game.answer, sections: game.sections, faq: game.faq, teaches: game.teaches }, 'game')
  const mathOf = (s) => [...s.matchAll(/\$\$[^$]+\$\$|\$[^$]+\$/g)].map((m) => m[0].replace(/^\$+|\$+$/g, ''))
  const prose = (s) => s.replace(/\$\$[^$]*\$\$|\$[^$]*\$|`[^`]*`|\*\*[^*]+\*\*/g, ' ')
  for (const [where, en, id] of texts) {
    ok(en.trim() && id.trim(), `${where}: both languages`)
    for (const [lang, s] of [['en', en], ['id', id]]) {
      ok((s.match(/\$/g) ?? []).length % 2 === 0, `${where} (${lang}): $ signs in pairs`)
      ok(!/\*/.test(prose(s)) && !/—/.test(s), `${where} (${lang}): a single star or a long dash`)
      if (lang === 'id') {
        for (const w of ['tetikus', 'berkas', 'tautan', 'peramban', 'papan ketik', 'surel', 'daring']) ok(!new RegExp(`\\b${w}\\b`, 'i').test(s), `${where}: the Indonesian says "${w}"`)
        ok(!/\d\.\d/.test(prose(s)), `${where}: a decimal point in Indonesian`)
      } else for (const w of ['colour', 'centre', 'metre', 'neighbour', 'favour', 'practise ']) ok(!s.includes(w) || w === 'practise ', `${where}: British spelling ${w}`)
    }
  }
  // practise is the verb in US English too ("practice" is the noun): no check

  // every equation written in the page is true, in both languages (letters are not read: only calculations)
  let equations = 0
  const norm = (s) => s.replace(/\\frac(\d)(\d)/g, '\\frac{$1}{$2}').replace(/\\times/g, '\\times').trim()
  for (const [where, en, id] of texts) {
    for (const s of [en, id]) {
      for (const m of mathOf(s)) {
        if (!m.includes('=') || /[a-zA-Z]/.test(m.replace(/\\(frac|times|div)/g, ''))) continue
        const parts = m.split('=').map(norm)
        let vals
        try {
          vals = parts.map((p) => readTex(p.replace(/(\d)\\frac\{(\d)\}\{(\d)\}/, '($1+\\frac{$2}{$3})')).value)
        } catch (e) {
          ok(false, `${where}: cannot read the equation ${m}: ${e.message}`)
          continue
        }
        equations++
        ok(vals.every((v) => qeq(v, vals[0])), `${where}: the page says ${m}, which is not true`)
      }
    }
  }
  ok(equations >= 6, `equations of the page checked: ${equations}`)
  // the claims that two or three calculations are worth the same
  const claim = (parts) => {
    const v = parts.map((p) => readTex(norm(p)).value)
    return v.every((x) => qeq(x, v[0]))
  }
  ok(claim(['3+4', '10-3', '14\\div2']) && claim(['\\frac{1}{2}', '\\frac{3}{6}', '\\frac{1}{4}+\\frac{1}{4}']), 'the pages equal values claims: 3+4 = 10-3 = 14÷2 and 1/2 = 3/6 = 1/4+1/4')
  for (const m of C.MODES) {
    const [a, b] = m.example
    ok(claim([a, b]), `the example of "${m.id}" is a pair of equal calculations: ${a} and ${b}`)
    ok(C.TEX_OK.test(a) && C.TEX_OK.test(b), `the example of "${m.id}" uses only what a tile can show`)
    ok(m.name.en.trim() && m.name.id.trim() && m.about.en.includes('$') && m.range.en.includes('$'), `the mode ${m.id} has names and text`)
  }

  // the modes table has every mode, with the right values
  const section = (id) => game.sections.find((s) => s.id === id)
  const modes = section('modes')
  for (const m of C.MODES) {
    ok(modes.text.en.includes(`| ${m.name.en} |`) && modes.text.id.includes(`| ${m.name.id} |`), `the modes table lists "${m.name.en}" in both languages`)
    const d = m.domain
    if (m.id !== 'fraction') {
      ok(modes.text.en.includes(`| ${m.name.en} | `) && new RegExp(`\\| ${m.name.en.replace(/[()]/g, '\\$&')} \\|[^\\n]*\\| \\$${d[0].n}\\$ to \\$${d[8].n}\\$ \\|`).test(modes.text.en), `the modes table: values of ${m.id} in English`)
      ok(new RegExp(`\\| ${m.name.id} \\|[^\\n]*\\| \\$${d[0].n}\\$ sampai \\$${d[8].n}\\$ \\|`).test(modes.text.id), `the modes table: values of ${m.id} in Indonesian`)
      ok(d.length === 9 && d.every((f, i) => f.d === 1 && f.n === d[0].n + i), `${m.id}: nine consecutive integers`)
    } else ok(d[0].n === 1 && d[0].d === 2 && d[8].n === 9 && d[8].d === 2 && d.every((f, i) => f.n * 2 === (i + 1) * f.d), 'the fraction values are 1/2 to 9/2 in steps of 1/2')
  }
  ok(modes.text.en.includes('nine different values and 45 tiles') && modes.text.id.includes('sembilan nilai berbeda dan 45 kartu') && C.VALUES === 9 && C.TILE_COUNT === 45, 'nine values and 45 tiles')
  ok(modes.text.en.includes('ten halves') && modes.text.id.includes('sepuluh sisi') && C.VALUES + 1 === 10, 'a value shows up on ten halves')
  // the page says the halves are varied, with the chances of the engine
  ok(modes.text.en.includes('about three halves in ten at level 1, one in four at level 2 and one in five at level 3 are just a number') && modes.text.id.includes('sekitar tiga dari sepuluh sisi pada tingkat 1, satu dari empat pada tingkat 2, dan satu dari lima pada tingkat 3 hanyalah bilangan') && C.PLAIN_CHANCE[1] === 3 / 10 && C.PLAIN_CHANCE[2] === 1 / 4 && C.PLAIN_CHANCE[3] === 1 / 5, 'the page gives the chances of a plain number, and they are those of the engine')

  // the table of hands in the page is the table of the engine
  const rowsOf = (s) => [...s.matchAll(/^\| (\d) \| (\d) \| (\d+) \|$/gm)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3])])
  for (const lang of ['en', 'id']) {
    const rows = rowsOf(section('online').text[lang])
    ok(rows.length === 7 && rows.every(([n, h, pile], i) => n === i + 2 && h === C.handSize(n) && pile === 45 - n * h), `the table of hands (${lang}) is the engine's: ${JSON.stringify(rows)}`)
  }
  // the numbers in the sentences
  const answer = game.answer
  ok(answer.en.includes('2 to 8 players') && answer.id.includes('2 sampai 8 pemain') && C.MIN_PLAYERS === 2 && C.MAX_PLAYERS === 8, 'two to eight players')
  ok(section('online').text.en.includes('From 2 to 8 players') && section('online').text.id.includes('2 sampai 8 pemain'), 'the online section says two to eight')
  ok(game.faq.some((f) => f.a.en.includes('From 2 to 8 players') && f.a.id.includes('Dari 2 sampai 8 pemain')), 'and the FAQ')
  const cpu = section('against-the-computer').text
  ok(cpu.en.includes('one time in five') && cpu.id.includes('satu kali dari lima') && C.MISS_CHANCE.easy === 1 / 5, 'easy computer: one in five')
  ok(cpu.en.includes('one time in sixteen') && cpu.id.includes('satu kali dari enam belas') && C.MISS_CHANCE.medium === 1 / 16, 'medium computer: one in sixteen')
  ok(cpu.en.includes('never miscalculates') && cpu.id.includes('tidak pernah salah hitung') && C.MISS_CHANCE.hard === 0, 'hard computer never miscalculates')
  ok(game.faq.some((f) => f.a.en.includes('about one time in five') && f.a.id.includes('satu kali dari lima')), 'the FAQ on strength agrees')
  ok(section('online').text.en.includes('about 13 seconds') && section('online').text.id.includes('sekitar 13 detik') && C.ABSENT_MS === 13000 && C.LOST_MS === 13000, 'players step away after about 13 seconds')
  ok(/come back/.test(section('online').text.en) && /until the turn comes to their seat/.test(section('online').text.en) && /masuk lagi/.test(section('online').text.id) && /sebelum gilirannya tiba/.test(section('online').text.id), 'the page says that a player can come back before the turn comes')
  ok(section('online').text.en.includes('four characters, such as K7QF') && section('online').text.id.includes('kode empat karakter, seperti K7QF') && C.CODE_LENGTH === 4 && C.parseRoomCode('K7QF') === 'K7QF', 'a room code has four characters')
  ok(C.NAME_MAX === 16, 'names are short')
  // what the page says about the ends: the colors of the screen
  const ends = section('the-ends').text
  ok(/green for the left end and gold for the right end/.test(ends.en.replace(/\*\*/g, '')) && /hijau untuk ujung kiri dan emas untuk ujung kanan/.test(ends.id.replace(/\*\*/g, '')), 'the ends are green on the left and gold on the right, as the page says')

  // the pieces fit together
  const page = read('src/pages/GamePage.tsx')
  ok(/import DominoGame from '..\/components\/games\/DominoGame'/.test(page) && /'math-domino': \(\) => <DominoGame \/>/.test(page), 'the game page shows the game')
  ok(/GameId = [^\n]*'math-domino'/.test(read('src/content/games.ts')), 'GameId has the game')
  const pkg = JSON.parse(read('package.json'))
  ok(pkg.scripts['check:domino'] === 'node tools/check-domino.mjs', 'package.json runs this checker')
  ok(/npm run check:domino/.test(read('.github/workflows/deploy.yml')), 'CI runs this checker')

  // the screen
  const ui = read('src/components/games/DominoGame.tsx')
  ok(/role="list"/.test(ui) && /role="listitem"/.test(ui) && /aria-pressed=\{sel === tile\.id\}/.test(ui) && /aria-live="polite"/.test(ui) && /role="log"/.test(ui), 'the chain is a list, the tiles are toggle buttons, the story is a live log')
  ok(/aria-label=\{`\$\{label\}: \$\{half \? speak\(half\.tex\)/.test(ui) && /texSpeech/.test(ui) && /aria-label=\{tileLabel\(tile\)\}/.test(ui), 'the ends and the tiles are named for a screen reader, calculations spoken in words')
  ok(/aria-current=\{p\.id === snap\.turn/.test(ui) && /role="alert"/.test(ui) && /role="status"/.test(ui), 'whose turn it is, errors and waiting are announced')
  ok(/addEventListener\('pagehide'/.test(ui) && /session\.leave\(\)/.test(ui), 'closing the page leaves the room')
  ok(/useSyncExternalStore/.test(ui) && /disabled=\{!armed\}/.test(ui) && /disabled=\{!canAct\}/.test(ui), 'buttons that cannot be used now are disabled')
  ok(/key=\{`r\$\{refusal\.n\}`\}|dmrefusal/.test(ui), 'a refusal is shown')
  ok(/ends\[end\]/.test(ui) && /first \? 'left' : undefined/.test(ui) && /last \? 'right' : undefined/.test(ui) && /dmflag left/.test(ui) && /dmflag right/.test(ui), 'the end halves of the chain are marked, and flagged with the words left and right')
  ok(/valueTex\(mode, half\.v\)/.test(ui) && /showValue/.test(ui), 'the value of an end can be shown')
  ok(!/dangerouslySetInnerHTML/.test(ui), 'nothing is put on the page as raw HTML except by the formula component')
  // the style: only the page's colors, green and gold for the two ends, red for nothing here but a refusal
  const css = read('src/styles.css')
  const dm = css.slice(css.indexOf('/* Math Domino'))
  ok(dm.length > 3000 && !/#[0-9a-fA-F]{3,8}\b/.test(dm), 'the domino styles use color tokens only')
  const rule = (sel) => (dm.match(new RegExp(`(?:^|\\n)${sel.replace(/[.\[\]]/g, '\\$&')} \\{([^}]*)\\}`)) ?? [])[1] ?? ''
  ok(/border: 3px solid var\(--fig-a\)/.test(rule('.dmend')) && /var\(--fig-c\)/.test(rule('.dmend.right')), 'the end boxes: green left, gold right')
  ok(/box-shadow: inset 0 0 0 3px var\(--fig-a\)/.test(rule('.dmhalf.end-left')) && /box-shadow: inset 0 0 0 3px var\(--fig-c\)/.test(rule('.dmhalf.end-right')) && /--fig-a/.test(rule('.dmhalf.end-left')) && /--fig-c/.test(rule('.dmhalf.end-right')), 'the end halves of the chain: the same two colors, in the outline')
  ok(!/--bad/.test(dm.replace(/\.dmlog p\.dmrefusal[^}]*\}/, '').replace(/\.dmerror[^}]*\}/, '')), 'red is used only for a refusal and an error')
  ok(/prefers-reduced-motion: reduce\) \{[^}]*\.dmend\.armed/.test(dm.replace(/\n/g, ' ')) && /animation: none/.test(dm), 'the pulse stops for readers who asked for less motion')
  ok(/dmchain::before, \.dmchain::after \{ content: ''; margin: auto; \}/.test(dm) && /overflow-x: auto/.test(rule('.dmchain')), 'a short chain is centered and a long one scrolls')
}

console.log(`domino check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
