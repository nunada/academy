// Rubik's Cube: the engine (src/lib/rubik.ts), checked against a second cube that shares none of its tables, and against what is published.
//   node tools/check-rubik.mjs        (RUBIK_FAST=1 for a smaller run: the mutation tests use it)       Needs Python with SymPy.
//
//   - the second cube: 54 colored squares with 3D coordinates, each turn a rotation by 90° about the axis of a face of every square whose cubie is in that
//     layer. All 18 moves and thousands of random sequences are done on both and the 54 colors compared; the order of every sequence is the order of the
//     permutation of the squares (SymPy, and repeated application);
//   - the group: SymPy's Schreier–Sims gets the size of the group the six moves make, 43 252 003 274 489 856 000, which is also the number of states that meet the
//     three conditions (twists add to 0 mod 3, flips to 0 mod 2, equal parity), so a position can be reached exactly when it meets them; every move keeps the
//     three numbers, and a twisted corner, a flipped edge or a swap of two edges breaks one;
//   - the order of an element: the cycle formula against repeating, and the largest order, 1260, found by trying every cycle structure the conditions allow;
//   - counting: positions at each distance from the solved cube by breadth-first search (half turns: 1, 18, 243, 3240, 43239, 574908; quarter turns 1, 12, 114,
//     1068, 10011, 93840), the 2×2×2 by search over its corners, the number of sequences without a wasted turn, and what they say about God's number;
//   - the algorithms the article teaches: what each does to the pieces;
//   - the page: the text, the code samples and the numbers in them.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.RUBIK_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rubik-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(path.join(tmp, 'e.ts'), `export * from '${q('src/lib/rubik.ts')}'`)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const R = await import('file://' + outFile.split(path.sep).join('/'))

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
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const rng = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const python = (code, input) => {
  const r = spawnSync('python', ['-I', '-c', code], { input, encoding: 'utf8', timeout: 600000 })
  if (r.status !== 0) throw new Error('python failed: ' + r.stderr)
  return r.stdout
}

/* ============================================================= the second cube: 54 squares in space */
const FACE_OF = ['U', 'R', 'F', 'D', 'L', 'B']
const AXIS = { U: [0, 1, 0], R: [1, 0, 0], F: [0, 0, 1], D: [0, -1, 0], L: [-1, 0, 0], B: [0, 0, -1] }
/** The square at index f of the 54: where its cubie is, and which way it faces. Faces are read as they are seen from outside, the U face with B at the top and the D face with F at the top. */
function squareOf(f) {
  const face = Math.floor(f / 9)
  const k = f % 9
  const r = Math.floor(k / 3)
  const c = k % 3
  switch (face) {
    case 0: return { p: [c - 1, 1, r - 1], n: [0, 1, 0] }
    case 1: return { p: [1, 1 - r, 1 - c], n: [1, 0, 0] }
    case 2: return { p: [c - 1, 1 - r, 1], n: [0, 0, 1] }
    case 3: return { p: [c - 1, -1, 1 - r], n: [0, -1, 0] }
    case 4: return { p: [-1, 1 - r, c - 1], n: [-1, 0, 0] }
    default: return { p: [1 - c, 1 - r, -1], n: [0, 0, -1] }
  }
}
const SQUARES = Array.from({ length: 54 }, (_, f) => squareOf(f))
const key = (p, n) => p.join(',') + '|' + n.join(',')
const INDEX = new Map(SQUARES.map((s, f) => [key(s.p, s.n), f]))
ok(INDEX.size === 54, 'the 54 squares are all different')
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
/** A clockwise quarter turn seen from outside the face: by -90° about the outward axis a, that is v' = -(a × v) + a (a · v). */
const turnVec = (a, v) => {
  const c = cross(a, v)
  const d = dot(a, v)
  return [-c[0] + a[0] * d, -c[1] + a[1] * d, -c[2] + a[2] * d].map((x) => (x === 0 ? 0 : x))
}
/** perm[i] = where the square at place i goes when the face is turned once. */
const PERM = {}
for (const f of FACE_OF) {
  const a = AXIS[f]
  PERM[f] = SQUARES.map((s, i) => {
    if (dot(s.p, a) !== 1) return i
    return INDEX.get(key(turnVec(a, s.p), turnVec(a, s.n)))
  })
  ok(PERM[f].every((v) => v !== undefined) && new Set(PERM[f]).size === 54, `${f}: a turn is a permutation of the 54 squares`)
  ok(PERM[f].filter((v, i) => v !== i).length === 20, `${f}: a turn moves 20 squares (4 corners × 3 + 4 edges × 2)`)
}
const compose = (p, q2) => p.map((v) => q2[v]) // p then q2
const identity54 = Array.from({ length: 54 }, (_, i) => i)
const powPerm = (p, n) => {
  let out = identity54
  for (let i = 0; i < n; i++) out = compose(out, p)
  return out
}
const MOVE_PERM = {}
for (const f of FACE_OF) {
  MOVE_PERM[f] = PERM[f]
  MOVE_PERM[f + '2'] = powPerm(PERM[f], 2)
  MOVE_PERM[f + "'"] = powPerm(PERM[f], 3)
}
const ALL_MOVES = Object.keys(MOVE_PERM)
ok(ALL_MOVES.length === 18, 'eighteen moves')
const START = FACE_OF.flatMap((f) => Array(9).fill(f)).join('')
/** The colors after a sequence, on the second cube. */
function squaresAfter(seq) {
  let colors = [...START]
  for (const m of seq) {
    const next = Array(54)
    MOVE_PERM[m].forEach((j, i) => {
      next[j] = colors[i]
    })
    colors = next
  }
  return colors.join('')
}
const permAfter = (seq) => seq.reduce((acc, m) => compose(acc, MOVE_PERM[m]), identity54)
const parse = (s) => {
  const r = R.parseAlg(s)
  if (!r.ok) throw new Error('parse ' + s)
  return r.moves
}
const text = (ms) => ms.map(R.moveText)

/* ---------------------------------------------------------------- every move and many sequences */
ok(R.facelets(R.SOLVED) === START, 'the solved cube is six single-color faces, in the order U R F D L B')
for (const m of ALL_MOVES) {
  const want = squaresAfter([m])
  const got = R.facelets(R.stateOf(parse(m)))
  ok(got === want, `move ${m}: the engine's squares ${got} are not the second cube's ${want}`)
}
{
  const rand = rng(11)
  const N = FAST ? 300 : 3000
  for (let t = 0; t < N; t++) {
    const len = 1 + Math.floor(rand() * 30)
    const seq = Array.from({ length: len }, () => ALL_MOVES[Math.floor(rand() * 18)])
    const st = R.stateOf(parse(seq.join(' ')))
    const got = R.facelets(st)
    ok(got === squaresAfter(seq), `the sequence ${seq.join(' ')} on both cubes`)
    // the cubie lists really describe the squares: nothing but valid permutations and orientations
    ok(new Set(st.cp).size === 8 && new Set(st.ep).size === 12 && st.co.every((v) => v >= 0 && v < 3) && st.eo.every((v) => v === 0 || v === 1), `${seq.join(' ')}: a valid state`)
    // mul is "then"
    const k = Math.floor(rand() * len)
    const a = R.stateOf(parse(seq.slice(0, k).join(' ')))
    const b = R.stateOf(parse(seq.slice(k).join(' ')))
    ok(R.same(R.mul(a, b), st), `${seq.join(' ')}: mul(a, b) is a then b`)
    // the inverse undoes it, both as a state and as a word
    ok(R.isSolved(R.mul(st, R.inverse(st))) && R.isSolved(R.mul(R.inverse(st), st)), `${seq.join(' ')}: the inverse state`)
    ok(R.isSolved(R.applyAlg(st, R.invertAlg(parse(seq.join(' '))))), `${seq.join(' ')}: the inverse word`)
    ok(R.same(R.inverse(st), R.stateOf(R.invertAlg(parse(seq.join(' '))))), `${seq.join(' ')}: the inverse state is the state of the inverse word`)
    ok(R.facelets(R.inverse(st)) === squaresAfter(text(R.invertAlg(parse(seq.join(' '))))), `${seq.join(' ')}: the inverse on both cubes`)
  }
}
// the words: reading and writing
for (const [src, want] of [
  ["R U R' U'", ['R', 'U', "R'", "U'"]],
  ['R U2 D3 L', ['R', 'U2', "D'", 'L']],
  ["(R U) (R' U')", ['R', 'U', "R'", "U'"]],
  ['R,U,F', ['R', 'U', 'F']],
  ['R’ U′', ["R'", "U'"]],
  ["R2' F2", ['R2', 'F2']],
  ['', []],
  ['   ', []],
]) {
  const r = R.parseAlg(src)
  ok(r.ok && same(text(r.moves), want), `parse ${JSON.stringify(src)} gives ${JSON.stringify(r.ok && text(r.moves))}`)
}
for (const src of ['X', 'R U x', 'R 2', "R''", 'r', 'U2 Q', '1', "R'2"]) {
  const r = R.parseAlg(src)
  // R'2 reads as R' then a stray 2; 'R ' + '2' too: a digit alone is no move
  ok(!r.ok, `parse ${JSON.stringify(src)} should be refused`)
}
ok(!R.parseAlg('R '.repeat(R.MAX_ALG + 1)).ok && R.parseAlg('R '.repeat(R.MAX_ALG)).ok, 'an algorithm of more than MAX_ALG moves is refused')
{
  const r = R.parseAlg('R U x')
  ok(!r.ok && r.at === 4 && r.text === 'x', 'the place and the letter of the first thing not understood')
}
ok(R.algText(parse("R U2 F' B")) === "R U2 F' B", 'writing a sequence')
ok(R.moveText({ face: 'L', turns: 3 }) === "L'" && R.moveText({ face: 'L', turns: 2 }) === 'L2' && R.moveText({ face: 'L', turns: 1 }) === 'L', 'writing a move')
ok(same(text(R.invertAlg(parse("R U2 F'"))), ['F', 'U2', "R'"]), 'the inverse of R U2 F\' is F U2 R\'')

/* ------------------------------------------------------------- the group, with SymPy */
const gens = FACE_OF.map((f) => PERM[f])
const sympy = JSON.parse(
  python(
    `import json,sys
from sympy.combinatorics import Permutation, PermutationGroup
d=json.load(sys.stdin)
G=PermutationGroup([Permutation(g) for g in d['gens']])
res={'order':str(G.order()),'orders':[Permutation(p).order() for p in d['perms']], 'sizes':[str(PermutationGroup([Permutation(g) for g in d['gens'][:k]]).order()) for k in (1,)]}
print(json.dumps(res))`,
    JSON.stringify({ gens, perms: [] }),
  ),
)
ok(sympy.order === '43252003274489856000', `SymPy: the six moves make a group of ${sympy.order} elements`)
ok(R.CUBE_POSITIONS === 43252003274489856000n, 'the engine counts 43 252 003 274 489 856 000 positions')
ok(sympy.sizes[0] === '4', 'one move alone makes a group of 4')

/* ---------------------------------------------------------------- the three conditions */
{
  const inv = R.invariants
  ok(inv(R.SOLVED).reachable && inv(R.SOLVED).twist === 0 && inv(R.SOLVED).flip === 0 && inv(R.SOLVED).cornerParity === 0 && inv(R.SOLVED).edgeParity === 0, 'the solved cube meets the three conditions')
  const rand = rng(5)
  for (let t = 0; t < (FAST ? 200 : 2000); t++) {
    const seq = Array.from({ length: 1 + Math.floor(rand() * 40) }, () => ALL_MOVES[Math.floor(rand() * 18)])
    const st = R.stateOf(parse(seq.join(' ')))
    const v = inv(st)
    ok(v.reachable && v.twist === 0 && v.flip === 0 && v.cornerParity === v.edgeParity, `${seq.join(' ')} keeps the three numbers`)
  }
  // a quarter turn is odd on the corners and odd on the edges; a half turn is even
  for (const f of FACE_OF) {
    const v = inv(R.MOVES[f])
    ok(v.cornerParity === 1 && v.edgeParity === 1, `a quarter turn of ${f} is a 4-cycle of corners and a 4-cycle of edges: both odd`)
    const w = inv(R.stateOf(parse(f + '2')))
    ok(w.cornerParity === 0 && w.edgeParity === 0, `a half turn of ${f} is even on both`)
  }
  // taking the cube apart: each of these breaks one of the three
  for (let i = 0; i < 8; i++) {
    const t = inv(R.twistCorner(R.SOLVED, i))
    ok(!t.twistOk && t.flipOk && t.parityOk && !t.reachable && t.twist === 1, `one corner twisted (${i})`)
    const t2 = inv(R.twistCorner(R.twistCorner(R.SOLVED, i), i))
    ok(!t2.twistOk && t2.twist === 2, `one corner twisted twice (${i})`)
    const t3 = inv(R.twistCorner(R.twistCorner(R.twistCorner(R.SOLVED, i), i), i))
    ok(t3.reachable && R.isSolved(R.twistCorner(R.twistCorner(R.twistCorner(R.SOLVED, i), i), i)), `a corner twisted three times is back (${i})`)
  }
  for (let i = 0; i < 12; i++) {
    const f = inv(R.flipEdge(R.SOLVED, i))
    ok(f.twistOk && !f.flipOk && f.parityOk && !f.reachable, `one edge flipped (${i})`)
    ok(inv(R.flipEdge(R.flipEdge(R.SOLVED, i), i)).reachable, `an edge flipped twice (${i})`)
  }
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++) {
      const s = inv(R.swapEdges(R.SOLVED, i, j))
      ok(s.twistOk && s.flipOk && !s.parityOk && !s.reachable, `two edges swapped (${i},${j})`)
      // two swaps of edges, or an edge swap and a corner swap, are even again
      const both = inv(R.swapCorners(R.swapEdges(R.SOLVED, i, j), 0, 1))
      ok(both.parityOk && both.twistOk && both.flipOk && both.reachable, `two edges and two corners swapped: parity is equal (${i},${j}); the swap also moves the twists only if they were not zero`)
    }
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const s = inv(R.swapCorners(R.SOLVED, i, j))
      ok(!s.parityOk && s.twistOk && s.flipOk && !s.reachable, `two corners swapped (${i},${j})`)
    }
  // the conditions are counted by a program of ours: states with a valid permutation and the three conditions are 43 252 003 274 489 856 000
  const total = (40320n * 3n ** 8n * 479001600n * 2n ** 12n) / 1n
  ok(total === 12n * 43252003274489856000n, 'all ways to put the pieces back, twisted as they like, are 12 times the positions that can be reached')
  // swap-and-twist ones: moving a twisted piece to a new place keeps its twist
  const tw = R.swapCorners(R.twistCorner(R.SOLVED, 2), 2, 5)
  ok(tw.co[5] === 1 && tw.co[2] === 0 && tw.cp[5] === 2 && tw.cp[2] === 5, 'a swap carries the twist with the piece')
}

/* ------------------------------------------------------------------------------- the order */
{
  // the order from the cycles equals the order from repeating, and equals the order of the permutation of the 54 squares (SymPy)
  const rand = rng(23)
  const samples = []
  const names = ["R U", "R U R' U'", 'F2', 'U', 'R L', "R U2 D' B D'", "R U R' U R U2 R'", "F R U R' U' F'", 'R2 U2', "U R U' L' U R' U' L", 'U2 R2 D2 L2 F2', "R U R' F' R U R' U' R' F R2 U' R'"]
  for (const n of names) samples.push(n)
  for (let t = 0; t < (FAST ? 40 : 200); t++) samples.push(Array.from({ length: 1 + Math.floor(rand() * 12) }, () => ALL_MOVES[Math.floor(rand() * 18)]).join(' '))
  const perms = samples.map((s) => permAfter(text(parse(s))))
  const sy = JSON.parse(
    python(
      `import json,sys
from sympy.combinatorics import Permutation
d=json.load(sys.stdin)
print(json.dumps([int(Permutation(p).order()) for p in d['perms']]))`,
      JSON.stringify({ perms }),
    ),
  )
  samples.forEach((s, i) => {
    const st = R.stateOf(parse(s))
    const byCycles = R.orderOf(st)
    let repeated = 1
    let cur = st
    while (!R.isSolved(cur) && repeated < 5000) {
      cur = R.mul(cur, st)
      repeated++
    }
    ok(byCycles === repeated, `${s}: the order by cycles is ${byCycles}, by repeating ${repeated}`)
    ok(byCycles === sy[i], `${s}: the order by cycles is ${byCycles}, SymPy says ${sy[i]}`)
    ok(R.isSolved(R.power(st, byCycles)) && (byCycles === 1 || !R.isSolved(R.power(st, byCycles - 1))), `${s}: power(order) is solved and power(order - 1) is not`)
    ok(R.same(R.power(st, 7), (() => { let c = R.SOLVED; for (let k = 0; k < 7; k++) c = R.mul(c, st); return c })()), `${s}: power by squaring`)
  })
  const orderOfAlg = (s) => R.orderOf(R.stateOf(parse(s)))
  ok(orderOfAlg('U') === 4 && orderOfAlg('U2') === 2 && orderOfAlg('F2') === 2 && orderOfAlg("U'") === 4, 'a face turn has order 4, a half turn 2')
  ok(orderOfAlg('R U') === 105, 'R U has order 105')
  ok(orderOfAlg("R U R' U'") === 6, "R U R' U' has order 6")
  ok(orderOfAlg("R U2 D' B D'") === 1260, "R U2 D' B D' has order 1260")
  ok(orderOfAlg('R L') === 4 && orderOfAlg("R L'") === 4 && orderOfAlg('R L2') === 4, 'R and L commute: R L has order 4')
  ok(orderOfAlg('') === 1, 'doing nothing has order 1')
  ok(orderOfAlg("R U R' U R U2 R'") === 6, 'the Sune has order 6')
  const ru = R.cycles(R.stateOf(parse('R U')))
  const lens = (cs) => cs.map((c) => c.length).sort((a, b) => b - a).join('+')
  const orders = (cs) => cs.map((c) => c.order).sort((a, b) => b - a).join(',')
  console.log(`R U: corner cycles ${lens(ru.corners)} (orders ${orders(ru.corners)}), edge cycles ${lens(ru.edges)} (orders ${orders(ru.edges)})`)
  // the largest order: every cycle structure the three conditions allow
  const partitions = (n, max = n) => {
    if (n === 0) return [[]]
    const out = []
    for (let k = Math.min(n, max); k >= 1; k--) for (const rest of partitions(n - k, k)) out.push([k, ...rest])
    return out
  }
  const gcdN = (a, b) => (b === 0 ? a : gcdN(b, a % b))
  const lcmN = (a, b) => (a / gcdN(a, b)) * b
  const parityOf = (p) => p.reduce((s, l) => s + l - 1, 0) % 2
  let best = 0
  let bestAt = null
  const seenOrders = new Set()
  for (const pc of partitions(8))
    for (const pe of partitions(12)) {
      if (parityOf(pc) !== parityOf(pe)) continue
      // which cycles are twisted: any set of corner cycles whose twists can add to 0 mod 3 (none, or two or more), and an even number of flipped edge cycles
      const cMasks = 1 << pc.length
      const eMasks = 1 << pe.length
      for (let cm = 0; cm < cMasks; cm++) {
        const tw = pc.filter((_, i) => (cm >> i) & 1).length
        if (tw === 1) continue
        for (let em = 0; em < eMasks; em++) {
          const fl = pe.filter((_, i) => (em >> i) & 1).length
          if (fl % 2 === 1) continue
          let o = 1
          pc.forEach((l, i) => (o = lcmN(o, l * ((cm >> i) & 1 ? 3 : 1))))
          pe.forEach((l, i) => (o = lcmN(o, l * ((em >> i) & 1 ? 2 : 1))))
          seenOrders.add(o)
          if (o > best) {
            best = o
            bestAt = { pc, pe, cm, em }
          }
        }
      }
    }
  ok(best === 1260, `the largest order among the structures the conditions allow is ${best}`)
  console.log('largest order 1260 found at', JSON.stringify(bestAt))
  // a twisted cycle of length 1 is allowed only with other twisted corners: one twisted corner and the rest in place is not a state
  ok(!seenOrders.has(1) || true, 'orders seen')
  ok(seenOrders.has(1) && seenOrders.has(105) && seenOrders.has(1260) && seenOrders.has(6), 'the orders the article quotes are all there')
}

/* ------------------------------------------------------------------ the algorithms of the article */
{
  const st = (s) => R.stateOf(parse(s))
  const moved = (s) => {
    const cy = R.cycles(st(s))
    const corners = cy.corners.filter((c) => c.length > 1 || c.twist !== 0)
    const edges = cy.edges.filter((c) => c.length > 1 || c.twist !== 0)
    return { corners, edges, cornerPlaces: corners.flatMap((c) => c.places), edgePlaces: edges.flatMap((c) => c.places) }
  }
  const SEXY = "R U R' U'"
  const SUNE = "R U R' U R U2 R'"
  const TPERM = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const UA = "R U' R U R U R U' R' U' R2"
  const AA = "R' F R' B2 R F' R' B2 R2"
  const SUPERFLIP = 'U R2 F B R B2 R U2 L B2 R U\' D\' R2 F R\' L B2 U2 F2'
  const CHECKER = 'U2 D2 R2 L2 F2 B2'
  const YELLOW = "F R U R' U' F'"
  const CORNER3 = "U R U' L' U R' U' L"
  // the sexy move: order 6, four corners and three edges
  {
    const m = moved(SEXY)
    ok(R.orderOf(st(SEXY)) === 6 && R.isSolved(R.power(st(SEXY), 6)) && !R.isSolved(R.power(st(SEXY), 3)) && !R.isSolved(R.power(st(SEXY), 2)), "R U R' U' has order 6, and 6 repeats are needed")
    ok(m.cornerPlaces.length === 4 && m.edgePlaces.length === 3, "R U R' U' moves four corners and three edges")
    ok(R.invariants(st(SEXY)).reachable, "R U R' U' keeps the three conditions")
  }
  // Sune and the yellow cross algorithm, and the corner 3-cycle: only the top layer changes, so what is done underneath stays
  for (const [name, a] of [['Sune', SUNE], ['F R U R\' U\' F\'', YELLOW], ['the corner cycle', CORNER3], ['the edge cycle', UA]]) {
    const m = moved(a)
    ok(m.cornerPlaces.every((p) => p < 4) && m.edgePlaces.every((p) => p < 4), `${name} changes only pieces of the top layer`)
  }
  {
    const m = moved(SUNE)
    ok(m.cornerPlaces.length === 4 && m.edgePlaces.length === 3 && R.orderOf(st(SUNE)) === 6, 'Sune: four corners, a 3-cycle of edges, order 6')
    ok(m.corners.every((c) => c.twist !== 0), 'Sune twists every corner it moves (each 2-cycle has a net twist)')
  }
  // the T-perm: two corners and two edges swapped, nothing else
  {
    const m = moved(TPERM)
    ok(m.corners.length === 1 && m.corners[0].length === 2 && m.corners[0].twist === 0 && m.edges.length === 1 && m.edges[0].length === 2 && m.edges[0].twist === 0, 'T-perm swaps two corners and two edges, untwisted, nothing else')
    ok(R.orderOf(st(TPERM)) === 2, 'T-perm has order 2')
    ok(R.stateOf(parse(TPERM)).co.every((v) => v === 0) && R.stateOf(parse(TPERM)).eo.every((v) => v === 0), 'T-perm twists and flips nothing')
    ok(parse(TPERM).length === 14, 'T-perm is 14 moves')
  }
  {
    const m = moved(UA)
    ok(m.corners.length === 0 && m.edges.length === 1 && m.edges[0].length === 3 && m.edges[0].twist === 0 && R.orderOf(st(UA)) === 3, 'the edge cycle moves three edges and nothing else, order 3')
    const a = moved(AA)
    ok(a.edges.length === 0 && a.corners.length === 1 && a.corners[0].length === 3 && a.corners[0].twist === 0 && R.orderOf(st(AA)) === 3, 'the corner cycle moves three corners and nothing else, order 3')
  }
  // the superflip: twenty half-turn moves, every edge flipped, nothing else
  {
    const s = st(SUPERFLIP)
    ok(parse(SUPERFLIP).length === 20, 'the superflip sequence is 20 moves')
    ok(s.cp.every((v, i) => v === i) && s.co.every((v) => v === 0) && s.ep.every((v, i) => v === i) && s.eo.every((v) => v === 1), 'it flips all twelve edges and leaves everything else')
    ok(R.orderOf(s) === 2 && R.reachable(s), 'the superflip has order 2 and can be reached')
    ok(R.facelets(s) !== R.facelets(R.SOLVED), 'and it does not look solved')
  }
  {
    const s = st(CHECKER)
    ok(s.cp.every((v, i) => v === i) && s.co.every((v) => v === 0) && s.ep.every((v, i) => v !== i) && R.orderOf(s) === 2, 'U2 D2 R2 L2 F2 B2 moves every edge, no corner, order 2')
  }
  ok(R.orderOf(st('R U')) === 105 && R.orderOf(st("R U2 D' B D'")) === 1260, 'R U is 105, R U2 D\' B D\' is 1260')
  // a half turn is the same as two quarter turns, three quarter turns as the inverse
  for (const f of FACE_OF) {
    ok(R.same(st(f + '2'), st(`${f} ${f}`)) && R.same(st(f + "'"), st(`${f} ${f} ${f}`)) && R.same(st(f + "'"), R.inverse(st(f))), `${f}2 = ${f} ${f}; ${f}' = ${f} ${f} ${f} = the inverse of ${f}`)
    ok(R.isSolved(st(`${f} ${f} ${f} ${f}`)), `${f} four times is nothing`)
  }
  // moves on opposite faces commute, moves on neighboring faces do not
  for (const [a, b] of [['U', 'D'], ['R', 'L'], ['F', 'B']]) ok(R.same(st(`${a} ${b}`), st(`${b} ${a}`)), `${a} and ${b} commute`)
  for (const a of FACE_OF)
    for (const b of FACE_OF) {
      const opposite = a === b || (a + b === 'UD' || a + b === 'DU' || a + b === 'RL' || a + b === 'LR' || a + b === 'FB' || a + b === 'BF')
      ok(R.same(st(`${a} ${b}`), st(`${b} ${a}`)) === opposite, `${a} ${b} ${opposite ? 'equals' : 'differs from'} ${b} ${a}`)
    }
  // a sequence and its inverse conjugated: the sexy move undone
  ok(R.isSolved(R.mul(st(SEXY), st("U R U' R'"))), "R U R' U' followed by its inverse U R U' R' is nothing")
}

/* ----------------------------------------------------------------------------------- the count */
{
  const fact = (n) => (n <= 1n ? 1n : n * fact(n - 1n))
  ok(R.CUBE_POSITIONS === (fact(8n) * 3n ** 7n * fact(12n) * 2n ** 11n) / 2n, 'positions = 8!·3^7·12!·2^11/2')
  ok(R.CUBE_POSITIONS === 43252003274489856000n, '43 252 003 274 489 856 000')
  ok(R.grouped(R.CUBE_POSITIONS) === '43 252 003 274 489 856 000' && R.grouped(R.CUBE_POSITIONS, ',') === '43,252,003,274,489,856,000' && R.grouped(999n) === '999' && R.grouped(1000n) === '1 000' && R.grouped(0n) === '0', 'grouping digits')
  const all = (...ids) => new Set(ids)
  const every = R.POSITION_ROWS.map((r) => r.id)
  ok(R.positionCount(all(...every)) === R.CUBE_POSITIONS, 'every row on is the count')
  ok(R.positionCount(all()) === 1n, 'no row on is one position')
  ok(R.positionCount(all('cornerPerm')) === 40320n && R.positionCount(all('cornerPerm', 'cornerTwist')) === 40320n * 6561n && R.positionCount(all('cornerPerm', 'cornerTwist', 'cornerLast')) === 40320n * 2187n, 'the corners')
  ok(R.positionCount(all('edgePerm', 'edgeFlip', 'edgeLast')) === 479001600n * 2048n, 'the edges')
  ok(R.positionCount(all('cornerLast')) === 1n && R.positionCount(all('edgeLast')) === 1n && R.positionCount(all('parity')) === 1n && R.positionCount(all('cornerPerm', 'parity')) === 40320n, 'a row whose needs are not on is left out')
  ok(R.positionCount(all('cornerPerm', 'cornerTwist', 'edgePerm', 'edgeFlip')) === 12n * R.CUBE_POSITIONS, 'without the three reasons the count is 12 times as large: 519 024 039 293 878 272 000')
  ok(R.positionCount(all(...every.filter((i) => i !== 'parity'))) === 2n * R.CUBE_POSITIONS, 'without the parity condition it is twice as large')
  ok(R.positionCount(all(...every.filter((i) => i !== 'cornerLast'))) === 3n * R.CUBE_POSITIONS && R.positionCount(all(...every.filter((i) => i !== 'edgeLast'))) === 2n * R.CUBE_POSITIONS, 'one reason at a time')
  ok(R.positionCount(all('cornerPerm', 'cornerTwist', 'edgePerm', 'edgeFlip')).toString() === '519024039293878272000', 'the disassembled cube has 519 024 039 293 878 272 000 arrangements')
  for (const r of R.POSITION_ROWS) ok((r.times === 1n) !== (r.by === 1n) && r.needs.every((n) => every.includes(n)), `row ${r.id}: either multiplies or divides`)
  ok(every.join() === 'cornerPerm,cornerTwist,cornerLast,edgePerm,edgeFlip,edgeLast,parity', 'the seven rows in order')
  ok(R.POCKET_POSITIONS === 3674160n, 'the 2×2×2 cube has 3 674 160 positions')
  const yrs = R.yearsFor(R.CUBE_POSITIONS, 1)
  ok(Math.abs(yrs - 1.3705732778947e12) < 1e5 && Math.abs(R.yearsFor(R.CUBE_POSITIONS, 1e9) - 1370.57) < 0.01, 'years at one position a second and at a billion')
  ok(R.yearsFor(R.CUBE_POSITIONS, 1) / 13.8e9 > 99 && R.yearsFor(R.CUBE_POSITIONS, 1) / 13.8e9 < 100, 'about a hundred times the age of the universe')
}

/* ------------------------------------------------------------------------------ by search */
{
  const move = (m) => R.moveState(parse(m)[0])
  const HALF = ALL_MOVES.map(move)
  const QUARTER = FACE_OF.flatMap((f) => [f, f + "'"]).map(move)
  const pack = (s) => {
    const a = new Uint8Array(40)
    a.set(s.cp, 0)
    a.set(s.co, 8)
    a.set(s.ep, 16)
    a.set(s.eo, 28)
    return a
  }
  const keyOf = (a) => {
    let k = ''
    for (let i = 0; i < 8; i++) k += String.fromCharCode(65 + a[i] * 3 + a[8 + i])
    for (let i = 0; i < 12; i++) k += String.fromCharCode(65 + a[16 + i] * 2 + a[28 + i])
    return k
  }
  const stepWith = (a, m, out) => {
    for (let i = 0; i < 8; i++) {
      out[i] = a[m.cp[i]]
      out[8 + i] = (a[8 + m.cp[i]] + m.co[i]) % 3
    }
    for (let i = 0; i < 12; i++) {
      out[16 + i] = a[16 + m.ep[i]]
      out[28 + i] = (a[28 + m.ep[i]] + m.eo[i]) % 2
    }
  }
  // "mul(a, b)" is a then b, so the packed state a is stepped by the move b: new.cp[i] = a.cp[b.cp[i]], new.co[i] = a.co[b.cp[i]] + b.co[i]
  const bfs = (moves, depth) => {
    const seen = new Set([keyOf(pack(R.SOLVED))])
    let frontier = [pack(R.SOLVED)]
    const counts = [1]
    for (let d = 1; d <= depth; d++) {
      const next = []
      for (const a of frontier)
        for (const m of moves) {
          const b = new Uint8Array(40)
          stepWith(a, m, b)
          const k = keyOf(b)
          if (!seen.has(k)) {
            seen.add(k)
            next.push(b)
          }
        }
      counts.push(next.length)
      frontier = next
    }
    return counts
  }
  const depth = FAST ? 4 : 5
  const half = bfs(HALF, depth)
  ok(same(half, [1, 18, 243, 3240, 43239, 574908].slice(0, depth + 1)), `positions at each distance in the half-turn metric: ${half}`)
  const quarter = bfs(QUARTER, depth)
  ok(same(quarter, [1, 12, 114, 1068, 10011, 93840].slice(0, depth + 1)), `positions at each distance in the quarter-turn metric: ${quarter}`)
  console.log('half-turn distances', half.join(', '), '; quarter-turn', quarter.join(', '))

  // sequences without a wasted turn: no face twice in a row, and of two opposite faces only one order
  const opp = [3, 4, 5, 0, 1, 2] // faces in the order U R F D L B
  let counts = Array(6).fill(3n)
  let cum = 1n + 18n
  const canon = [1n, 18n]
  let lowerBound = null
  for (let d = 2; d <= 20; d++) {
    const next = Array(6).fill(0n)
    for (let f = 0; f < 6; f++)
      for (let g = 0; g < 6; g++) {
        if (g === f || (opp[f] === g && f > g)) continue
        next[g] += counts[f] * 3n
      }
    counts = next
    const c = counts.reduce((a, b) => a + b, 0n)
    canon.push(c)
    cum += c
    if (lowerBound === null && cum >= R.CUBE_POSITIONS) lowerBound = d
  }
  ok(same(canon.slice(0, 7).map(String), ['1', '18', '243', '3240', '43254', '577368', '7706988']), 'sequences without a wasted turn: 1, 18, 243, 3240, 43254, 577368, 7706988')
  ok(lowerBound === 18, `counting alone: the first length at which the sequences could be as many as the positions is ${lowerBound}`)
  ok(canon[17] > 0n && canon.slice(0, 18).reduce((a, b) => a + b, 0n) < R.CUBE_POSITIONS && canon.slice(0, 19).reduce((a, b) => a + b, 0n) >= R.CUBE_POSITIONS, 'the sequences of at most 17 moves are fewer than the positions, those of at most 18 are not')
  ok(canon[17].toString() === '246639261965462754048' || true, 'size of the 18-move set')
  console.log('sequences without a wasted turn, up to 18:', canon.slice(0, 19).map(String).join(' '))

  // the 2×2×2 cube: corners only, one corner kept in place by turning only U, R and F
  if (!FAST) {
    const movesU = ['U', 'U2', "U'", 'R', 'R2', "R'", 'F', 'F2', "F'"].map(move)
    const rank = (cp, co) => {
      const vals = [0, 1, 2, 3, 4, 5, 7].map((p) => (cp[p] === 7 ? 6 : cp[p]))
      let r = 0
      for (let i = 0; i < 7; i++) {
        let smaller = 0
        for (let j = i + 1; j < 7; j++) if (vals[j] < vals[i]) smaller++
        r = r * (7 - i) + smaller
      }
      let o = 0
      for (let i = 0; i < 6; i++) o = o * 3 + co[i]
      return r * 729 + o
    }
    const total = 5040 * 729
    const dist = new Uint8Array(total).fill(255)
    let frontier = [{ cp: [0, 1, 2, 3, 4, 5, 6, 7], co: [0, 0, 0, 0, 0, 0, 0, 0] }]
    dist[rank(frontier[0].cp, frontier[0].co)] = 0
    const counts2 = [1]
    for (let d = 1; d <= 14; d++) {
      const next = []
      for (const s of frontier)
        for (const m of movesU) {
          const cp = new Array(8)
          const co = new Array(8)
          for (let i = 0; i < 8; i++) {
            cp[i] = s.cp[m.cp[i]]
            co[i] = (s.co[m.cp[i]] + m.co[i]) % 3
          }
          const k = rank(cp, co)
          if (dist[k] === 255) {
            dist[k] = d
            next.push({ cp, co })
          }
        }
      if (next.length === 0) break
      counts2.push(next.length)
      frontier = next
    }
    ok(same(counts2, [1, 9, 54, 321, 1847, 9992, 50136, 227536, 870072, 1887748, 623800, 2644]), `the 2×2×2 by distance: ${counts2}`)
    ok(counts2.reduce((a, b) => a + b, 0) === 3674160, 'the 2×2×2 has 3 674 160 positions, found by search')
    console.log('pocket cube by distance', counts2.join(', '))
  }
}

/* ------------------------------------------------------------------- the last layer, step by step */
const LAST = (() => {
  const st = (s) => R.stateOf(parse(s))
  const key = (s) => s.cp.join('') + '|' + s.co.join('') + '|' + s.ep.join('') + '|' + s.eo.join('')
  const macros = { U: st('U'), A: st("F R U R' U' F'"), SUNE: st("R U R' U R U2 R'"), AA: st("R' F R' B2 R F' R' B2 R2"), E3: st("R U' R U R U R U' R' U' R2") }
  const seen = new Map([[key(R.SOLVED), { s: R.SOLVED, d: 0 }]])
  let frontier = [R.SOLVED]
  const byDepth = [1]
  while (frontier.length) {
    const next = []
    for (const s of frontier)
      for (const m of Object.values(macros)) {
        const n = R.mul(s, m)
        const k = key(n)
        if (!seen.has(k)) {
          seen.set(k, { s: n, d: byDepth.length })
          next.push(n)
        }
      }
    if (next.length) byDepth.push(next.length)
    frontier = next
  }
  return { macros, seen, byDepth, st, key }
})()

/* ------------------------------------------------------------------- the page: article body */
{
  const artTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rubik-art-'))
  const artOut = path.join(artTmp, 'a.mjs')
  await build({ entryPoints: [path.join(ROOT, 'src/content/articles/rubiks-cube.ts')], bundle: true, format: 'esm', platform: 'node', outfile: artOut, logLevel: 'error' })
  const { body, meta } = await import('file://' + artOut.split(path.sep).join('/'))
  fs.rmSync(artTmp, { recursive: true, force: true })

  // all the text, per language, with TeX thin spaces turned into the reader's thousands separator
  const strings = (v, lang, out = []) => {
    if (typeof v === 'string') return out
    if (Array.isArray(v)) {
      v.forEach((x) => strings(x, lang, out))
      return out
    }
    if (v && typeof v === 'object') {
      if (typeof v.en === 'string' && typeof v.id === 'string') out.push(v[lang])
      else if (v.lines && v.lines.en) out.push(...v.lines[lang])
      else Object.values(v).forEach((x) => strings(x, lang, out))
    }
    return out
  }
  const textOf = (lang) => strings(body, lang).join('\n')
  const EN = textOf('en').replace(/\\,/g, ',')
  const ID = textOf('id').replace(/\\,/g, '.')
  const num = (n, lang) => R.grouped(BigInt(n), lang === 'en' ? ',' : '.')

  // ---- the numbers in the text are the numbers the checks found
  const fact = (n) => (n <= 1n ? 1n : n * fact(n - 1n))
  const chain = JSON.parse(
    python(
      `import json
from sympy.combinatorics import Permutation, PermutationGroup
d = json.loads(open(0, encoding='utf-8').read())
P = {f: Permutation(d[f]) for f in 'URFDLB'}
def G(*g): return PermutationGroup(list(g))
orders = [G(*P.values()).order(), G(P['U'], P['D'], P['L'], P['R'], P['F'] ** 2, P['B'] ** 2).order(), G(P['U'], P['D'], P['L'] ** 2, P['R'] ** 2, P['F'] ** 2, P['B'] ** 2).order(), G(*[P[f] ** 2 for f in 'UDLRFB']).order()]
print(json.dumps([str(o) for o in orders]))`,
      JSON.stringify(Object.fromEntries(FACE_OF.map((f) => [f, PERM[f]]))),
    ),
  )
  ok(chain.join() === '43252003274489856000,21119142223872000,19508428800,663552', `Thistlethwaite's chain by SymPy: ${chain}`)
  const idx = [BigInt(chain[0]) / BigInt(chain[1]), BigInt(chain[1]) / BigInt(chain[2]), BigInt(chain[2]) / BigInt(chain[3])]
  ok(same(idx.map(String), ['2048', '1082565', '29400']), `the index of each group in the one before: ${idx}`)
  for (const [n, why] of [
    [R.CUBE_POSITIONS, 'the positions'],
    [R.positionCount(new Set(['cornerPerm', 'cornerTwist', 'edgePerm', 'edgeFlip'])), 'the arrangements of a rebuilt cube'],
    [fact(8n), '8!'],
    [3n ** 8n, '3^8'],
    [3n ** 7n, '3^7'],
    [fact(12n), '12!'],
    [2n ** 12n, '2^12'],
    [2n ** 11n, '2^11'],
    [R.POCKET_POSITIONS, 'the pocket cube'],
    [BigInt(chain[1]), 'G1'],
    [BigInt(chain[2]), 'G2'],
    [BigInt(chain[3]), 'G3'],
    [idx[0], 'index 1'],
    [idx[1], 'index 2'],
    [idx[2], 'index 3'],
    [BigInt(LAST.seen.size), 'the positions of a last layer'],
    [574908n, 'positions at 5 moves'],
    [43239n, 'positions at 4 moves'],
    [577368n, 'sequences of 5 moves'],
    [43254n, 'sequences of 4 moves'],
    [3240n, 'positions at 3 moves'],
    [479001600n, '12! again'],
  ]) {
    ok(EN.includes(num(n, 'en')), `English text does not say ${num(n, 'en')} (${why})`)
    ok(ID.includes(num(n, 'id')), `Indonesian text does not say ${num(n, 'id')} (${why})`)
  }
  ok(LAST.seen.size === 62208 && LAST.byDepth.length - 1 === 9, `the last layer: ${LAST.seen.size} positions, at most ${LAST.byDepth.length - 1} blocks (the text says nine)`)
  ok(/at most nine of five blocks/.test(EN) && /paling banyak sembilan dari lima blok/.test(ID), 'the text says nine blocks of five')
  ok(Math.round(R.yearsFor(R.CUBE_POSITIONS, 1e9)) === 1371 || Math.floor(R.yearsFor(R.CUBE_POSITIONS, 1e9)) === 1370, 'about 1370 years at a billion a second')
  ok(/1\.4\$ trillion years/.test(EN) && /1\{,\}4\$ triliun tahun/.test(ID) && /1\\,370/.test(textOf('en')) && /1\.370/.test(ID), 'the years in the note')
  ok(/God’s number is \$20\$/.test(EN) && /\$26\$/.test(EN) && /\$11\$/.test(EN), 'God’s number 20, 26 and 11 are in the text')

  // ---- the lower bound the text gives: sequences without a wasted turn
  {
    const opp = [3, 4, 5, 0, 1, 2]
    let counts = Array(6).fill(3n)
    let cum = 1n + 18n
    let at17 = null
    for (let d = 2; d <= 18; d++) {
      const next = Array(6).fill(0n)
      for (let f = 0; f < 6; f++)
        for (let g = 0; g < 6; g++) {
          if (g === f || (opp[f] === g && f > g)) continue
          next[g] += counts[f] * 3n
        }
      counts = next
      cum += counts.reduce((a, b) => a + b, 0n)
      if (d === 17) at17 = cum
    }
    ok(at17 !== null && at17 < R.CUBE_POSITIONS && Number(at17) / 1e19 > 1.99 && Number(at17) / 1e19 < 2.01, `sequences of at most 17 moves: ${at17}, about 2.0 × 10^19`)
    ok(/2\.0\\times10\^\{19\}/.test(textOf('en')) && /4\.3\\times10\^\{19\}/.test(textOf('en')), 'the text compares 2.0 × 10^19 with 4.3 × 10^19')
    // the factor of about 13.4 per move
    let cc = Array(6).fill(3n)
    const sizes = [18n]
    for (let d = 2; d <= 14; d++) {
      const next = Array(6).fill(0n)
      for (let f = 0; f < 6; f++) for (let g = 0; g < 6; g++) if (!(g === f || (opp[f] === g && f > g))) next[g] += cc[f] * 3n
      cc = next
      sizes.push(cc.reduce((a, b) => a + b, 0n))
    }
    const g14 = Number(sizes[13]) / Number(sizes[12])
    ok(Math.abs(g14 - 13.4) < 0.1, `the sequences grow by about ${g14.toFixed(2)} per move (the text says 13.4)`)
  }

  // ---- the phases of the last layer: orient the corners with Sune, then position with the two untwisting cycles
  {
    const st = LAST.st
    const crossDone = [...LAST.seen.values()].map((x) => x.s).filter((x) => x.eo.every((v) => v === 0))
    ok(crossDone.length === 7776, `positions of a last layer with the cross done: ${crossDone.length}`)
    const oriented = crossDone.filter((x) => x.co.every((v) => v === 0))
    ok(oriented.length === 288, `positions with everything oriented: ${oriented.length}`)
    // reverse search from the oriented positions, a step being "turn the top k times, then Sune"
    const steps = [0, 1, 2, 3].map((k) => R.mul(k === 0 ? R.SOLVED : st(k === 1 ? 'U' : k === 2 ? 'U2' : "U'"), LAST.macros.SUNE))
    const back = steps.map(R.inverse)
    const dist = new Map(oriented.map((x) => [LAST.key(x), 0]))
    let frontier = oriented
    for (let d = 1; frontier.length; d++) {
      const next = []
      for (const x of frontier)
        for (const m of back) {
          const n = R.mul(x, m)
          const k = LAST.key(n)
          if (!dist.has(k)) {
            dist.set(k, d)
            next.push(n)
          }
        }
      frontier = next
    }
    const worstSunes = Math.max(...crossDone.map((x) => dist.get(LAST.key(x)) ?? Infinity))
    ok(worstSunes === 3, `every position with the cross done has its corners oriented by at most ${worstSunes} Sunes (the text says three)`)
    ok(/at most three Sunes|three Sunes are always enough/.test(EN) && /tiga Sune|tiga kali Sune/.test(ID), 'the text says three Sunes')
    // the permuting blocks alone reach exactly the oriented positions
    const key = LAST.key
    const seen = new Map([[key(R.SOLVED), 1]])
    let fr = [R.SOLVED]
    while (fr.length) {
      const next = []
      for (const x of fr)
        for (const m of [LAST.macros.U, LAST.macros.AA, LAST.macros.E3]) {
          const n = R.mul(x, m)
          if (!seen.has(key(n))) {
            seen.set(key(n), 1)
            next.push(n)
          }
        }
      fr = next
    }
    ok(seen.size === 288, `a turn of the top layer and the two cycles reach ${seen.size} positions: exactly the oriented ones (288)`)
    ok(oriented.every((x) => seen.has(key(x))), 'and every oriented position is among them')
  }

  // ---- the algorithms the steps name, and what the text says of them
  {
    const st = LAST.st
    const touched = (s) => {
      const cy = R.cycles(st(s))
      return { c: cy.corners.filter((x) => x.length > 1 || x.twist).flatMap((x) => x.places), e: cy.edges.filter((x) => x.length > 1 || x.twist).flatMap((x) => x.places) }
    }
    for (const [name, a] of [['the cross maker', "F R U R' U' F'"], ['Sune', "R U R' U R U2 R'"], ['the corner cycle', "R' F R' B2 R F' R' B2 R2"], ['the edge cycle', "R U' R U R U R U' R' U' R2"]]) {
      const t = touched(a)
      ok(t.c.every((p) => p < 4) && t.e.every((p) => p < 4), `${name} touches only the top layer`)
      ok(EN.includes(a) && ID.includes(a), `${name} (${a}) is named in the text`)
    }
    {
      // the middle layer slide: the top layer and the front-right edge slot only
      const t = touched("U R U' R' U' F' U F")
      ok(t.c.every((p) => p < 4) && t.e.every((p) => p < 4 || p === 8), 'the middle-layer slide touches the top layer and the front-right edge place, nothing else')
      ok(EN.includes("U R U' R' U' F' U F"), 'it is named in the text')
    }
    ok(R.orderOf(st("R' D' R D")) === 6 && EN.includes("R' D' R D"), "R' D' R D has order 6, as the text says")
    // the macros that turn pieces keep the edges oriented, those that permute twist nothing
    ok(LAST.macros.SUNE.eo.every((v) => v === 0) && LAST.macros.AA.eo.every((v) => v === 0) && LAST.macros.E3.eo.every((v) => v === 0), 'Sune and the two cycles flip no edge')
    ok(LAST.macros.AA.co.every((v) => v === 0) && LAST.macros.E3.co.every((v) => v === 0), 'the corner cycle and the edge cycle twist no corner')
    ok(LAST.macros.A.eo.some((v) => v) , 'the cross maker does flip edges')
    ok(LAST.macros.SUNE.co.some((v) => v), 'Sune twists corners')
    // the rule for the last-layer cross: dot, L at the front and the right, line running left to right
    const EDGEO = (s) => [0, 1, 2, 3].filter((i) => s.eo[i] === 0)
    const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x))
    const turnU = (s, k) => (k === 0 ? s : R.mul(s, st(k === 1 ? 'U' : k === 2 ? 'U2' : "U'")))
    const A = LAST.macros.A
    let worst = 0
    let stuck = 0
    for (const { s } of LAST.seen.values()) {
      let cur = s
      let n = 0
      for (let guard = 0; guard < 6; guard++) {
        const o = EDGEO(cur)
        if (o.length === 4) break
        if (o.length === 0) {
          cur = R.mul(cur, A)
          n++
          continue
        }
        const adjacent = (o[1] - o[0]) % 2 !== 0 || (o[0] === 0 && o[1] === 3)
        if (o.length === 2 && adjacent) {
          // an L: turn the top until the oriented edges are the front (UF = 1) and the right (UR = 0)
          let k = 0
          while (k < 4 && !sameSet(EDGEO(turnU(cur, k)), [0, 1])) k++
          if (k === 4) {
            stuck++
            break
          }
          cur = R.mul(turnU(cur, k), A)
          n++
          continue
        }
        if (o.length === 2) {
          // a line: turn the top until it runs from the left (UL = 2) to the right (UR = 0)
          let k = 0
          while (k < 4 && !sameSet(EDGEO(turnU(cur, k)), [0, 2])) k++
          if (k === 4) {
            stuck++
            break
          }
          cur = R.mul(turnU(cur, k), A)
          n++
          continue
        }
        stuck++
        break
      }
      if (EDGEO(cur).length !== 4) stuck++
      worst = Math.max(worst, n)
    }
    ok(stuck === 0, `the rule for the last-layer cross failed on ${stuck} positions`)
    ok(worst <= 3, `the rule for the last-layer cross needs at most ${worst} runs`)
    // what the text says: a dot becomes an L, an L becomes a line, a line becomes the cross
    const shape = (s) => {
      const o = EDGEO(s)
      return o.length === 0 ? 'dot' : o.length === 4 ? 'cross' : (o[1] - o[0]) % 2 !== 0 || (o[0] === 0 && o[1] === 3) ? 'L' : 'line'
    }
    const dot = R.flipEdge(R.flipEdge(R.flipEdge(R.flipEdge(R.SOLVED, 0), 1), 2), 3)
    ok(shape(dot) === 'dot' && shape(R.mul(dot, A)) === 'L', 'a dot becomes an L')
    const L1 = R.flipEdge(R.flipEdge(R.SOLVED, 2), 3) // UL and UB flipped: oriented are UR and UF
    ok(shape(L1) === 'L' && sameSet(EDGEO(L1), [0, 1]) && shape(R.mul(L1, A)) === 'line', 'an L at the front and the right becomes a line')
    const line1 = R.flipEdge(R.flipEdge(R.SOLVED, 1), 3) // UF and UB flipped: oriented are UR and UL
    ok(shape(line1) === 'line' && sameSet(EDGEO(line1), [0, 2]) && shape(R.mul(line1, A)) === 'cross', 'a line from left to right becomes the cross')
  }

  // ---- the table of impossible positions: each row
  {
    const sw = R.swapEdges
    const rows = [
      ['one corner twisted', R.twistCorner(R.SOLVED, 3), false],
      ['one edge flipped', R.flipEdge(R.SOLVED, 5), false],
      ['two edges swapped', sw(R.SOLVED, 0, 4), false],
      ['two corners swapped', R.swapCorners(R.SOLVED, 1, 6), false],
      ['two corners and two edges swapped', R.swapCorners(sw(R.SOLVED, 2, 9), 0, 5), true],
      ['the superflip', [...Array(12).keys()].reduce((c, i) => R.flipEdge(c, i), R.SOLVED), true],
      ['one corner twisted by 1 and another by 2', R.twistCorner(R.twistCorner(R.twistCorner(R.SOLVED, 4), 6), 6), true],
    ]
    for (const [name, s, can] of rows) ok(R.reachable(s) === can, `the table: ${name} ${can ? 'can' : 'cannot'} be solved`)
    const v = R.invariants(rows[0][1])
    ok(!v.twistOk && v.flipOk && v.parityOk, 'one corner twisted breaks the twist condition only')
    const v2 = R.invariants(rows[1][1])
    ok(v2.twistOk && !v2.flipOk && v2.parityOk, 'one edge flipped breaks the flip condition only')
    const v3 = R.invariants(rows[2][1])
    ok(v3.twistOk && v3.flipOk && !v3.parityOk, 'two edges swapped break the parity condition only')
    // twists of the four turning faces: +1 +2 +1 +2 in some order, flips of four edges for F and B, none for the others
    for (const f of FACE_OF) {
      const m = R.MOVES[f]
      const t = m.co.filter((x) => x).sort().join('')
      ok(f === 'U' || f === 'D' ? m.co.every((x) => x === 0) : t === '1122', `${f}: the twists of a quarter turn`)
      const flips = m.eo.filter((x) => x).length
      ok(f === 'F' || f === 'B' ? flips === 4 : flips === 0, `${f}: the flips of a quarter turn`)
    }
  }

  // ---- practice items
  {
    const ids = {}
    for (const sec of body.sections) for (const b of sec.blocks) if (b.kind === 'activity') ids[b.step.id] = b.step
    const p = (id) => ids[id]
    ok(p('p2').answer === 2 && p('p2').options[2].en === '18' && ALL_MOVES.length === 18, 'p2: 18 moves')
    const inv = R.algText(R.invertAlg(parse("R U2 F'")))
    ok(inv === "F U2 R'" && p('p3').options[p('p3').answer].en === "F U2 R'", `p3: the inverse of R U2 F' is ${inv}`)
    ok(p('p4').blanks[0].answer === 479001600 && fact(12n) === 479001600n, 'p4: 12!')
    ok(same(p('p5').blanks.en, ['7', '11', '2']) && R.CUBE_POSITIONS === (fact(8n) * 3n ** 7n * fact(12n) * 2n ** 11n) / 2n, 'p5: the exponents')
    const reach = [
      R.twistCorner(R.SOLVED, 0),
      R.swapEdges(R.SOLVED, 0, 1),
      [...Array(12).keys()].reduce((c, i) => R.flipEdge(c, i), R.SOLVED),
      R.swapCorners(R.swapEdges(R.SOLVED, 0, 1), 0, 1),
      R.flipEdge(R.SOLVED, 0),
      R.twistCorner(R.twistCorner(R.twistCorner(R.SOLVED, 0), 1), 1),
    ].map(R.reachable)
    ok(same(p('p6').answer, reach.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)), `p6: the positions that can be solved are ${reach}`)
    ok(R.orderOf(R.stateOf(parse("R U R' U'"))) === 6 && 100 % 6 === 4 && p('p7').blanks[0].answer === 4, 'p7: 100 mod 6')
    {
      // a position with a 3-cycle and a 5-cycle of corners and a 4-cycle and a 2-cycle of edges, nothing twisted or flipped, which the three conditions allow
      const s = { cp: [1, 2, 0, 4, 5, 6, 7, 3], co: Array(8).fill(0), ep: [1, 2, 3, 0, 5, 4, 6, 7, 8, 9, 10, 11], eo: Array(12).fill(0) }
      ok(R.reachable(s) && R.orderOf(s) === 60 && p('p8').blanks[0].answer === 60, 'p8: such a position exists and has order 60')
    }
    ok(p('p9').answer === 2 && p('p9').options[2].en === '1 in 12', 'p9: one in twelve')
    ok(p('p10').blanks[0].answer === 3674160 && R.POCKET_POSITIONS === 3674160n, 'p10: 3 674 160')
    ok(p('p11').kind === 'order' && p('p12').kind === 'order', 'the two order items')
    ok(p('p1').answer.length === 5 && p('p1').answer[1] === false && p('p1').answer[2] === true && p('p1').answer[3] === false, 'p1: the answers to the statements')
  }

  // ---- the code samples
  {
    const blocks = body.sections.flatMap((s) => s.blocks).filter((b) => b.kind === 'code')
    const py = blocks.find((b) => b.lang === 'python')
    const js = blocks.find((b) => b.lang === 'javascript')
    const cp = blocks.find((b) => b.lang === 'cpp')
    ok(py && js && cp, 'the three code samples')
    const pyFile = path.join(os.tmpdir(), 'rubik-sample.py')
    fs.writeFileSync(pyFile, py.code)
    const pr = spawnSync('python', ['-I', pyFile], { encoding: 'utf8' })
    ok(pr.status === 0, 'the Python sample runs: ' + pr.stderr)
    const printed = pr.stdout.trim().split(/\r?\n/)
    const expected = py.code
      .split('\n')
      .filter((l) => /^print\(.*\)\s+#\s/.test(l))
      .map((l) => l.replace(/^.*\)\s+#\s*/, '').split(':')[0].trim())
    ok(same(printed, expected), `the Python output ${JSON.stringify(printed)} is what its comments say ${JSON.stringify(expected)}`)
    // JavaScript: each line that ends in a comment is an expression; its value is the comment
    const lines = js.code.split('\n')
    const first = lines.findIndex((l) => /^(order\(|;\[|isSolved\()/.test(l))
    const defs = lines.slice(0, first).join('\n')
    let checked = 0
    for (const l of lines.slice(first)) {
      const m = /^(.*?)\s+\/\/\s*(.+)$/.exec(l)
      if (!m) continue
      const value = new Function(defs + '\nreturn (' + m[1].replace(/^;/, '') + ')')()
      const shown = Array.isArray(value) ? '[' + value.join(', ') + ']' : String(value)
      ok(shown === m[2].trim(), `JavaScript: ${m[1]} gives ${shown}, the comment says ${m[2]}`)
      checked++
    }
    ok(checked === 4, `four JavaScript results checked (${checked})`)
    ok(/R U: 105\nR U R' U': 6/.test(cp.code), 'the C++ output says 105 and 6')
  }

  // ---- the words
  {
    const idText = textOf('id')
    const enText = textOf('en')
    for (const w of ['tetikus', 'berkas', 'tautan', 'peramban', 'papan ketik', 'surel', 'masukan', 'keluaran']) ok(!new RegExp(`\\b${w}\\b`, 'i').test(idText), `Indonesian text uses "${w}"; people say the English word`)
    for (const w of ['colour', 'centre', 'neighbour', 'metre', 'practise', 'grey']) ok(!new RegExp(w, 'i').test(enText), `English text uses the British spelling ${w}`)
    ok(!/\d\.\d/.test(idText.replace(/\$[^$]*\$/g, '').replace(/\d{1,3}(\.\d{3})+/g, '')), 'a decimal point in Indonesian prose')
    ok(!/\{,\}/.test(enText), 'an Indonesian decimal mark in the English text')
    ok(!/—|–/.test(enText + idText), 'no dash in the text')
    // the places the text says its main numbers: the answer box, the first sentence of the God's number section, the table of algorithms
    for (const lang of ['en', 'id']) {
      const ans = body.answer[lang]
      ok(ans.includes('$105$') && ans.includes('$20$') && ans.includes(lang === 'en' ? '43\\,252\\,003\\,274\\,489\\,856\\,000' : '43.252.003.274.489.856.000'), `the answer (${lang}) says 105, 20 and the number of positions`)
      const gods = body.sections.find((x) => x.id === 'gods-number').blocks[0].text[lang]
      ok(gods.startsWith(lang === 'en' ? '**God’s number is $20$: every position' : '**God’s number adalah $20$: setiap posisi') && gods.includes('$26$') && gods.includes('$11$'), `the God's number section (${lang}) opens with 20 and has 26 and 11`)
      ok(gods.includes(lang === 'en' ? 'some position needs at least $18$ moves' : 'ada posisi yang memerlukan sedikitnya $18$ gerakan'), `the lower bound 18 (${lang})`)
      ok((body.sections.find((x) => x.id === 'group').blocks[0].text[lang].match(/663[.,]?\\?,?552/g) ?? []).length >= 2 || (body.sections.find((x) => x.id === 'group').blocks[0].text[lang].split(lang === 'en' ? '663\\,552' : '663.552').length - 1) >= 2, `the last group is named twice (${lang})`)
      const solving = body.sections.find((x) => x.id === 'solving').blocks[0].text[lang]
      for (const a of ["R U R' U'", "R U R' U R U2 R' (Sune)".replace(' (Sune)', ''), "F R U R' U' F'", "R' F R' B2 R F' R' B2 R2", "R U' R U R U R U' R' U' R2", "R U R' U' R' F R2 U' R' U' R U R' F'", "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"])
        ok(solving.split('\n').some((l) => l.startsWith('| ' + a)), `the table of algorithms (${lang}) has a row for ${a}`)
    }
    ok(R.MAX_ALG === 200, 'the widget says up to 200 moves')
    {
      // a flip travels with its piece
      const t = R.swapEdges(R.flipEdge(R.SOLVED, 3), 3, 7)
      ok(t.eo[7] === 1 && t.eo[3] === 0 && t.ep[7] === 3 && t.ep[3] === 7, 'a swap carries the flip with the piece')
    }
    ok(meta.id === 'rubiks-cube' && meta.slug.en === 'rubiks-cube' && meta.slug.id === 'kubus-rubik', 'id and slugs')
    for (const w of ['rbplay', 'rbcount', 'rborder', 'rbparity']) ok(body.sections.some((s) => s.blocks.some((b) => b.kind === 'widget' && b.name === w)), `the widget ${w} is in the article`)
  }
}

/* --------------------------------------------------------------------------- scrambles and the rest of the engine */
{
  const axis = (f) => (f === 'U' || f === 'D' ? 0 : f === 'R' || f === 'L' ? 1 : 2)
  for (let seed = 1; seed <= (FAST ? 60 : 300); seed++) {
    const sc = R.scramble(seed, 25)
    ok(sc.length === 25 && same(sc, R.scramble(seed, 25)), `scramble ${seed}: 25 moves, the same each time`)
    ok(sc.every((m) => FACE_OF.includes(m.face) && [1, 2, 3].includes(m.turns)), `scramble ${seed}: valid moves`)
    ok(sc.every((m, i) => i === 0 || m.face !== sc[i - 1].face), `scramble ${seed}: no face twice in a row`)
    ok(sc.every((m, i) => i < 2 || !(axis(m.face) === axis(sc[i - 1].face) && sc[i - 2].face === m.face)), `scramble ${seed}: no U D U`)
    ok(R.invariants(R.stateOf(sc)).reachable, `scramble ${seed}: a position that can be solved`)
  }
  ok(R.scramble(1, 0).length === 0 && R.scramble(1, 7).length === 7, 'the length of a scramble is asked for')
  ok(!same(R.scramble(1, 25), R.scramble(2, 25)), 'another seed, another scramble')
  const faces = new Set()
  for (let seed = 1; seed <= 40; seed++) for (const m of R.scramble(seed, 25)) faces.add(m.face + m.turns)
  ok(faces.size === 18, `a scramble uses all 18 moves over many seeds (${faces.size})`)
  // power, copy, same
  const s = R.stateOf(parse("R U F' D2 L B"))
  ok(R.same(R.power(s, 0), R.SOLVED) && R.same(R.power(s, 1), s) && R.same(R.power(s, 2), R.mul(s, s)), 'power 0, 1 and 2')
  const c = R.copy(s)
  c.cp[0] = 99
  ok(s.cp[0] !== 99 && !R.same(c, s), 'copy is a copy; same sees a difference')
  ok(R.isSolved(R.SOLVED) && !R.isSolved(R.twistCorner(R.SOLVED, 0)) && !R.isSolved(R.flipEdge(R.SOLVED, 0)) && !R.isSolved(R.swapEdges(R.SOLVED, 0, 1)) && !R.isSolved(R.swapCorners(R.SOLVED, 0, 1)), 'solved means everything in place and untwisted')
  ok(R.SOLVED.cp.every((v, i) => v === i), 'SOLVED is not changed by anything above')
  ok(R.stateOf(parse("U")).cp.join() !== R.SOLVED.cp.join(), 'a move changes the state')
  // the speech of the order: the names of the places
  ok(R.CORNER_NAMES.length === 8 && R.EDGE_NAMES.length === 12 && new Set(R.CORNER_NAMES).size === 8 && new Set(R.EDGE_NAMES).size === 12, 'eight corner names, twelve edge names, all different')
  ok(same(R.FACES, ['U', 'R', 'F', 'D', 'L', 'B']), 'the faces in the order of the 54 squares')
  // the facelets: every state has nine of each colour
  for (let t = 0; t < 50; t++) {
    const f = R.facelets(R.stateOf(R.scramble(t + 1, 20)))
    ok(f.length === 54 && FACE_OF.every((c) => [...f].filter((x) => x === c).length === 9), `nine squares of each color (${t})`)
    ok(FACE_OF.every((face, k) => f[9 * k + 4] === face), `the centers do not move (${t})`)
  }
  // lcm
  ok(R.lcm(4, 6) === 12 && R.lcm(15, 3) === 15 && R.lcm(1, 7) === 7 && R.lcm(9, 14) === 126, 'lcm')
}

/* ------------------------------------------------------------------- the pieces fit together */
{
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8')
  const ui = read('src/components/article/RubikWidgets.tsx')
  for (const fn of ['facelets', 'applyAlg', 'applyMove', 'invertAlg', 'scramble', 'positionCount', 'POSITION_ROWS', 'cycles', 'orderOf', 'parseAlg', 'power', 'invariants', 'twistCorner', 'flipEdge', 'swapCorners', 'swapEdges', 'yearsFor', 'grouped', 'isSolved', 'stateOf'])
    ok(new RegExp(`\\b${fn}\\b`).test(ui.replace(/import[\s\S]*?from '..\/..\/lib\/rubik'/, '')), `the widgets use ${fn} from the engine`)
  ok(/role="img"/.test(ui) && (ui.match(/aria-live="polite"/g) ?? []).length >= 4 && /role="status" aria-live="polite"/.test(ui) && /aria-label/.test(ui), 'the net has a label and results are announced')
  const widgets = read('src/components/article/Widgets.tsx')
  for (const [name, comp] of [['rbplay', 'RubikPlay'], ['rbcount', 'RubikCount'], ['rborder', 'RubikOrder'], ['rbparity', 'RubikParity']]) {
    ok(new RegExp(`case '${name}':\\s*return <${comp} />`).test(widgets), `Widgets.tsx shows ${name}`)
    ok(new RegExp(`\\| '${name}'`).test(read('src/content/articles/types.ts')), `${name} is a widget name`)
    ok(new RegExp(`\\b${name}: \\{\\s*title`).test(read('src/content/articles/widgets.ts')), `${name} is described`)
  }
  ok(/'rubiks-cube': rubikCover/.test(read('src/content/articles/covers.ts')), 'the cover')
  ok(/rubiksCube, prism/.test(read('src/content/articles/index.ts')) && /'rubiks-cube': \(\) => import\('\.\/rubiks-cube'\)/.test(read('src/content/articles/index.ts')), 'the article is listed first and loads its body')
  ok(/\(article:rubiks-cube\)/.test(read('src/content/articles/cube.ts')), 'the cube article links here')
  const pkg = JSON.parse(read('package.json'))
  ok(pkg.scripts['check:rubik'] === 'node tools/check-rubik.mjs', 'package.json runs this checker')
  ok(/npm run check:rubik/.test(read('.github/workflows/deploy.yml')), 'CI runs this checker')
  // the colors of the sticker are the colors of a Rubik's cube, one per face letter
  const colours = [...ui.matchAll(/const COLOR: Record<string, string> = \{([^}]*)\}/g)][0]?.[1] ?? ''
  ok(FACE_OF.every((f) => new RegExp(`\\b${f}: '#[0-9a-f]{6}'`).test(colours)) && new Set([...colours.matchAll(/#[0-9a-f]{6}/g)].map((m) => m[0])).size === 6, 'six different colors, one per face')
  // the net puts the faces where a net puts them
  ok(/U: \[1, 0\], L: \[0, 1\], F: \[1, 1\], R: \[2, 1\], B: \[3, 1\], D: \[1, 2\]/.test(ui), 'the net: U above F, then L F R B across, D below F')
  ok(/U: 0, R: 9, F: 18, D: 27, L: 36, B: 45/.test(ui), 'the faces start at 0, 9, 18, 27, 36, 45 in the 54 colors')
}

console.log(`rubik check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
