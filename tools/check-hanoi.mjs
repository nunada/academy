/** Checks src/lib/hanoi.ts, the numbers behind the "Tower of Hanoi" article.
 *
 *  References that do not use the code under test:
 *   1. Python's recursion for the list of moves (n up to 10), and a step-by-step simulation of the tower that checks every move is legal.
 *   2. A breadth-first search over all 3^n positions (n up to 8): the length of the shortest solution is 2^n − 1, there is exactly one
 *      shortest solution, the distance from every position to the whole tower on each peg equals the length of `solveFrom`, and the
 *      iterative rule makes the same moves as the recursion.
 *   3. A closed form for the distance from any position (the largest disc not in place decides), written again here.
 *   4. The positions after m moves, for every m up to 2^n − 1 (n up to 10) by simulation, and for huge n by checking that consecutive
 *      positions differ by exactly the disc that move m is said to move.
 *   5. A breadth-first search over all p^n positions with 4, 5 and 6 pegs, against the Frame–Stewart numbers (OEIS A007664 for 4 pegs).
 *   6. The graph of positions against its known counts (3^n vertices, (3^(n+1) − 3)/2 edges).
 *
 *  Run: npm run check:hanoi   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hanoi-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/hanoi.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const key = (mv) => `${mv.disc}:${mv.from}>${mv.to}`

/* ------------------------------------------------------------------------------ the Python side */
const PY = String.raw`
import json, sys
sys.setrecursionlimit(10000)

def hanoi(n, a, b, c, out):
    # move n discs from a to b using c
    if n == 0:
        return
    hanoi(n - 1, a, c, b, out)
    out.append([n - 1, a, b])
    hanoi(n - 1, c, b, a, out)

res = {}
for n in range(0, 11):
    out = []
    hanoi(n, 0, 2, 1, out)
    res[str(n)] = out
other = []
hanoi(5, 1, 0, 2, other)
res['5_1_0'] = other
other = []
hanoi(4, 2, 1, 0, other)
res['4_2_1'] = other

# Frame-Stewart numbers by the textbook recurrence, and the 4-peg numbers of OEIS A007664
from functools import lru_cache
@lru_cache(None)
def fs(n, p):
    if n == 0:
        return 0
    if n == 1:
        return 1
    if p == 3:
        return 2 ** n - 1
    return min(2 * fs(k, p) + fs(n - k, p - 1) for k in range(1, n))
res['fs'] = {str(p): [fs(n, p) for n in range(0, 41)] for p in (3, 4, 5, 6, 7)}
json.dump(res, sys.stdout)
`
const py = spawnSync('python', ['-I', '-X', 'utf8', '-c', PY], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 120000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* a tower simulated move by move: every move must be legal; returns the final state */
function simulate(n, moves, start) {
  const state = start ? start.slice() : new Array(n).fill(0)
  const stacks = [[], [], []]
  for (let k = n - 1; k >= 0; k--) stacks[state[k]].push(k)
  for (const mv of moves) {
    const s = stacks[mv.from]
    const d = s[s.length - 1]
    if (d !== mv.disc) return null
    const t = stacks[mv.to]
    if (t.length && t[t.length - 1] < d) return null
    s.pop()
    t.push(d)
  }
  const end = new Array(n)
  stacks.forEach((s, p) => s.forEach((d) => (end[d] = p)))
  return end
}

/* ------------------------------------------------------------------- 1: the list of moves */
for (let n = 0; n <= 10; n++) {
  const want = R[String(n)]
  const rec = M.hanoiMoves(n)
  const it = M.iterativeMoves(n)
  ok(rec.length === 2 ** n - 1 && BigInt(rec.length) === M.moveCount(n), `n = ${n}: ${rec.length} moves`)
  ok(rec.length === want.length && rec.every((mv, i) => mv.disc === want[i][0] && mv.from === want[i][1] && mv.to === want[i][2]), `the recursion for n = ${n} against Python`)
  ok(it.length === rec.length && it.every((mv, i) => key(mv) === key(rec[i])), `the iterative rule for n = ${n} makes the same moves as the recursion`)
  const end = simulate(n, rec)
  ok(end !== null && end.every((p) => p === 2), `n = ${n}: the moves are legal and end with the tower on peg 2`)
  const end2 = simulate(n, it)
  ok(end2 !== null && end2.every((p) => p === 2), `n = ${n}: the iterative moves are legal`)
}
{
  const a = M.hanoiMoves(5, 1, 0)
  const b = R['5_1_0']
  ok(a.length === b.length && a.every((mv, i) => mv.disc === b[i][0] && mv.from === b[i][1] && mv.to === b[i][2]), 'a tower of 5 from peg 1 to peg 0')
  const c = M.hanoiMoves(4, 2, 1)
  const d = R['4_2_1']
  ok(c.length === d.length && c.every((mv, i) => mv.disc === d[i][0] && mv.from === d[i][1] && mv.to === d[i][2]), 'a tower of 4 from peg 2 to peg 1')
  for (const [from, to] of [[0, 1], [1, 2], [2, 0], [1, 0], [2, 1], [0, 2]]) {
    for (let n = 1; n <= 9; n++) {
      const r = M.hanoiMoves(n, from, to)
      const i = M.iterativeMoves(n, from, to)
      ok(r.length === i.length && r.every((mv, k) => key(mv) === key(i[k])), `iterative = recursive for n = ${n} from ${from} to ${to}`)
    }
  }
  // the disc moved at each move, the ruler sequence, and how often each disc moves
  const mv = M.hanoiMoves(10)
  mv.forEach((m, i) => ok(M.discAtMove(BigInt(i + 1)) === m.disc, `move ${i + 1} moves disc ${m.disc}`))
  for (let k = 0; k < 10; k++) ok(mv.filter((m) => m.disc === k).length === 2 ** (9 - k), `disc ${k} moves 2^(9−${k}) times`)
  ok(M.discAtMove(24n) === 3 && M.discAtMove(1n) === 0 && M.discAtMove(1n << 40n) === 40 && M.discAtMove((1n << 64n) - 2n) === 1, 'discAtMove')
  const g = (m) => m ^ (m >> 1n)
  for (let m = 1n; m < 2000n; m++) ok((g(m) ^ g(m - 1n)) === (1n << BigInt(M.discAtMove(m))), `Gray code: bit ${M.discAtMove(m)} changes at move ${m}`)
  // the smallest disc moves at every odd move, always one way around
  const small = mv.filter((m) => m.disc === 0)
  ok(small.every((m, i) => i === 0 || m.from === small[i - 1].to), 'the smallest disc keeps going the same way')
  ok(small.every((m) => (m.to - m.from + 3) % 3 === (small[0].to - small[0].from + 3) % 3), 'the smallest disc steps the same way every time')
}

/* ---------------------------------------------------------- 2 and 3: search and closed form */
function bfsFrom(n, pegs, startPeg) {
  const total = pegs ** n
  const dist = new Int32Array(total).fill(-1)
  const ways = new Float64Array(total)
  const pow = Array.from({ length: n }, (_, k) => pegs ** k)
  const start = startPeg * pow.reduce((a, b) => a + b, 0)
  dist[start] = 0
  ways[start] = 1
  const queue = new Int32Array(total)
  let head = 0
  let tail = 0
  queue[tail++] = start
  const top = new Int8Array(pegs)
  while (head < tail) {
    const v = queue[head++]
    top.fill(-1)
    const peg = new Array(n)
    let x = v
    for (let k = 0; k < n; k++) {
      peg[k] = x % pegs
      x = (x - peg[k]) / pegs
    }
    for (let k = n - 1; k >= 0; k--) top[peg[k]] = k // the smallest disc on each peg ends up as the top
    for (let a = 0; a < pegs; a++) {
      if (top[a] === -1) continue
      const d = top[a]
      for (let b = 0; b < pegs; b++) {
        if (b === a) continue
        if (top[b] !== -1 && top[b] < d) continue
        const w = v + (b - a) * pow[d]
        if (dist[w] === -1) {
          dist[w] = dist[v] + 1
          ways[w] = ways[v]
          queue[tail++] = w
        } else if (dist[w] === dist[v] + 1) ways[w] += ways[v]
      }
    }
  }
  return { dist, ways, pow }
}
const decodeState = (v, n, pegs) => {
  const s = []
  for (let k = 0; k < n; k++) {
    s.push(v % pegs)
    v = Math.floor(v / pegs)
  }
  return s
}
// closed form for the distance to a whole tower on `target`, written again here
const distFormula = (state, target) => {
  const go = (k, t) => {
    if (k < 0) return 0
    if (state[k] === t) return go(k - 1, t)
    return go(k - 1, 3 - state[k] - t) + 1 + (2 ** k - 1)
  }
  return go(state.length - 1, target)
}
for (let n = 1; n <= 8; n++) {
  const { dist, ways } = bfsFrom(n, 3, 0)
  const last = 3 ** n - 1
  ok(dist[last] === 2 ** n - 1, `BFS: the shortest solution for n = ${n} has ${dist[last]} moves`)
  ok(ways[last] === 1, `BFS: n = ${n} has ${ways[last]} shortest solutions`)
  ok(Math.max(...dist) === 2 ** n - 1, `the diameter of the graph for n = ${n}`)
  // the distance from every position to a perfect tower on each peg, by BFS from the perfect tower
  for (let target = 0; target < 3; target++) {
    const dd = bfsFrom(n, 3, target).dist
    const bound = n <= 6 ? 3 ** n : 1500
    for (let t = 0; t < bound; t++) {
      const v = n <= 6 ? t : rndInt(0, 3 ** n - 1)
      const s = decodeState(v, n, 3)
      const sol = M.solveFrom(s, target)
      ok(sol.length === dd[v], `solveFrom ${s} to peg ${target}: ${sol.length} moves, BFS ${dd[v]}`)
      ok(distFormula(s, target) === dd[v], `closed-form distance of ${s} to peg ${target}: ${distFormula(s, target)}, BFS ${dd[v]}`)
      const end = simulate(n, sol, s)
      ok(end !== null && end.every((p) => p === target), `solveFrom ${s}: the moves are legal and end on peg ${target}`)
    }
  }
}
ok(M.solveFrom([0, 0, 0], 0).length === 0 && M.solveFrom([2, 2, 2], 2).length === 0, 'nothing to do on a finished tower')

/* ------------------------------------------------------------------------ 4: positions after m moves */
for (let n = 1; n <= 10; n++) {
  const mv = M.hanoiMoves(n)
  const state = new Array(n).fill(0)
  ok(M.stateAfter(n, 0n).every((p) => p === 0), `stateAfter(${n}, 0)`)
  for (let m = 1; m <= mv.length; m++) {
    state[mv[m - 1].disc] = mv[m - 1].to
    const s = M.stateAfter(n, BigInt(m))
    if (s.some((p, k) => p !== state[k])) fail(`stateAfter(${n}, ${m}) = [${s}], simulation [${state}]`)
    checks++
  }
}
for (const [from, to] of [[1, 0], [2, 1], [0, 1]]) {
  const n = 7
  const mv = M.hanoiMoves(n, from, to)
  const state = new Array(n).fill(from)
  mv.forEach((m, i) => {
    state[m.disc] = m.to
    const s = M.stateAfter(n, BigInt(i + 1), from, to)
    ok(s.every((p, k) => p === state[k]), `stateAfter from ${from} to ${to} at move ${i + 1}`)
  })
}
for (let t = 0; t < 400; t++) {
  const n = rndInt(11, 64)
  const total = (1n << BigInt(n)) - 1n
  const m = 1n + BigInt(Math.floor(Math.random() * Number(total - 1n > 2n ** 52n ? 2n ** 52n : total - 1n))) * (total > 2n ** 53n ? total / 2n ** 52n : 1n)
  const mm = m > total ? total : m
  const a = M.stateAfter(n, mm - 1n)
  const b = M.stateAfter(n, mm)
  const diff = []
  for (let k = 0; k < n; k++) if (a[k] !== b[k]) diff.push(k)
  ok(diff.length === 1 && diff[0] === M.discAtMove(mm), `a huge tower: positions ${mm - 1n} and ${mm} for n = ${n} differ in discs [${diff}], move ${mm} should move ${M.discAtMove(mm)}`)
  // and the move is legal
  if (diff.length === 1) {
    const d = diff[0]
    const legalMove = M.legalMove(a, a[d], b[d]) && M.topDisc(a, a[d]) === d
    ok(legalMove, `a huge tower: the move at ${mm} is legal`)
  }
}
ok(M.stateAfter(64, (1n << 64n) - 1n).every((p) => p === 2) && M.stateAfter(64, 0n).every((p) => p === 0), 'the 64-disc tower at its start and end')
{
  const s = M.stateAfter(5, 15n)
  ok(s[4] === 0 && s.slice(0, 4).every((p) => p === 1), 'after 15 moves of 5 discs the four small discs are on peg 1 and the largest has not moved')
  const t = M.stateAfter(5, 16n)
  ok(t[4] === 2 && t.slice(0, 4).every((p) => p === 1), 'move 16 moves the largest disc to peg 2')
}

/* the moves of a position: legal moves and the applyMove / legalMove pair */
for (let t = 0; t < 2000; t++) {
  const n = rndInt(1, 8)
  const s = Array.from({ length: n }, () => rndInt(0, 2))
  const a = rndInt(0, 2)
  const b = rndInt(0, 2)
  const next = M.applyMove(s, a, b)
  // by hand: the smallest disc of each peg
  const tp = s.indexOf(a)
  const tq = s.indexOf(b)
  const legal = a !== b && tp !== -1 && (tq === -1 || tp < tq)
  ok((next !== null) === legal && M.legalMove(s, a, b) === legal, `legal move ${a}→${b} in [${s}]`)
  if (next) ok(next[tp] === b && next.every((p, k) => k === tp || p === s[k]), `applyMove ${a}→${b} in [${s}]`)
}

/* ---------------------------------------------------------------------------- 5: more pegs */
{
  const A007664 = [0, 1, 3, 5, 9, 13, 17, 25, 33, 41, 49, 65, 81, 97, 113, 129, 161, 193, 225, 257, 289, 321, 385]
  A007664.forEach((v, n) => ok(M.frameStewart(n, 4).moves === BigInt(v), `Frame–Stewart(${n}, 4) = ${M.frameStewart(n, 4).moves}, OEIS ${v}`))
  for (const p of [3, 4, 5, 6, 7]) for (let n = 0; n <= 40; n++) ok(M.frameStewart(n, p).moves === BigInt(R.fs[String(p)][n]), `Frame–Stewart(${n}, ${p}) against Python`)
  // the split is the number of discs moved first, and it reproduces the number
  for (let n = 2; n <= 30; n++) {
    const f = M.frameStewart(n, 4)
    const k = f.split
    ok(k >= 1 && k < n && 2n * M.frameStewart(k, 4).moves + M.frameStewart(n - k, 3).moves === f.moves, `the split of ${n} discs on 4 pegs`)
  }
  // the exact search: every position of 4, 5 and 6 pegs
  for (const [pegs, nmax] of [[4, 9], [5, 7], [6, 6]]) {
    for (let n = 1; n <= nmax; n++) {
      const { dist } = bfsFrom(n, pegs, 0)
      const last = pegs ** n - 1
      ok(BigInt(dist[last]) === M.frameStewart(n, pegs).moves, `BFS with ${pegs} pegs and ${n} discs: ${dist[last]} moves, Frame–Stewart ${M.frameStewart(n, pegs).moves}`)
    }
  }
}

/* ------------------------------------------------------------------------------- 6: the graph */
for (let n = 0; n <= 5; n++) {
  const g = M.hanoiGraph(n)
  ok(g.points.length === 3 ** n, `graph n = ${n}: ${g.points.length} vertices`)
  ok(g.edges.length === (3 ** (n + 1) - 3) / 2, `graph n = ${n}: ${g.edges.length} edges, expected ${(3 ** (n + 1) - 3) / 2}`)
  ok(g.path.length === 2 ** n, `graph n = ${n}: the path has ${g.path.length} vertices`)
  ok(new Set(g.path).size === g.path.length, `graph n = ${n}: the path does not repeat a vertex`)
  const set = new Set(g.edges.map(([a, b]) => `${a},${b}`))
  ok(g.path.every((v, i) => i === 0 || set.has(`${Math.min(v, g.path[i - 1])},${Math.max(v, g.path[i - 1])}`)), `graph n = ${n}: the path follows edges`)
  // every edge is short: all edges of the Sierpiński layout have the same length
  if (n >= 1) {
    const lens = g.edges.map(([a, b]) => Math.hypot(g.points[a][0] - g.points[b][0], g.points[a][1] - g.points[b][1]))
    ok(Math.max(...lens) - Math.min(...lens) < 1e-9, `graph n = ${n}: the edges have equal length`)
    ok(new Set(g.points.map(([x, y]) => `${x.toFixed(9)},${y.toFixed(9)}`)).size === 3 ** n, `graph n = ${n}: no two vertices share a place`)
  }
  // degrees: 2 at the three corners, 3 elsewhere
  if (n >= 1) {
    const deg = new Array(3 ** n).fill(0)
    for (const [a, b] of g.edges) {
      deg[a]++
      deg[b]++
    }
    ok(deg.filter((d) => d === 2).length === 3 && deg.every((d) => d === 2 || d === 3), `graph n = ${n}: three corners of degree 2, the rest of degree 3`)
  }
}

console.log(`hanoi check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
