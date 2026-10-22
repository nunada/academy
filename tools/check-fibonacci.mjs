/** Checks src/lib/fibonacci.ts, the numbers behind the "Fibonacci Numbers" article.
 *
 *  References that do not use the code under test:
 *   1. Python's big integers: F(0) … F(1500) by the plain loop, the seven identities with each side rebuilt from that list, and the
 *      identity gcd(F(m), F(n)) = F(gcd(m, n)).
 *   2. Python's decimal module (80 digits): the digits of the golden ratio and of F(n+1)/F(n).
 *   3. A brute-force search over every subset of the Fibonacci numbers up to N, for the number of representations and for Zeckendorf's
 *      theorem (exactly one representation without two consecutive Fibonacci numbers), for N up to 400; a greedy re-write for large N.
 *   4. The Pisano periods as listed in OEIS A001175, a walk over the pairs of residues, and F(n) mod m for huge n by a 2×2 matrix power.
 *   5. Euclid's algorithm counted by hand: consecutive Fibonacci numbers are the worst case (Lamé).
 *
 *  Run: npm run check:fibonacci   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fib-'))
const out = path.join(tmp, 'a.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/fibonacci.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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

/* ------------------------------------------------------------------------------ the Python side */
const PY = String.raw`
import json, sys
from decimal import Decimal, getcontext
getcontext().prec = 120

F = [0, 1]
for i in range(2, 1501):
    F.append(F[-1] + F[-2])

out = {}
out['F'] = [str(x) for x in F]

# golden ratio and the ratios of neighbors, 60 decimals, truncated
phi = (1 + Decimal(5).sqrt()) / 2
out['phi'] = format(phi, '.80f')[:62]
ratios = {}
for n in list(range(1, 81)) + [100, 200, 500]:
    q = Decimal(F[n + 1]) / Decimal(F[n])
    ratios[str(n)] = format(q, '.80f')[:62]
out['ratios'] = ratios

# every subset of the Fibonacci numbers 1, 2, 3, 5, ... up to N
reps = {}
for N in range(1, 401):
    fibs = []
    a, b = 1, 2
    while a <= N:
        fibs.append(a)
        a, b = b, a + b
    total = 0
    nonconsec = 0
    nonconsec_set = None
    k = len(fibs)
    for mask in range(1, 1 << k):
        s = 0
        for i in range(k):
            if mask >> i & 1:
                s += fibs[i]
        if s == N:
            total += 1
            if mask & (mask >> 1) == 0:
                nonconsec += 1
                nonconsec_set = [fibs[i] for i in range(k) if mask >> i & 1]
    reps[str(N)] = [total, nonconsec, sorted(nonconsec_set, reverse=True)]
out['reps'] = reps

# greedy Zeckendorf for large N, written again here
def zeck(N):
    fibs = [1, 2]
    while fibs[-1] <= N:
        fibs.append(fibs[-1] + fibs[-2])
    res = []
    for v in reversed(fibs):
        if v <= N:
            res.append(v)
            N -= v
    return res
import random
random.seed(12345)
big = [random.randrange(1, 10 ** random.randrange(3, 40)) for _ in range(300)]
out['big'] = [[str(N), [str(v) for v in zeck(N)]] for N in big]

# Pisano periods by walking the pairs of residues
def pis(m):
    a, b, i = 0, 1 % m, 0
    while True:
        a, b = b, (a + b) % m
        i += 1
        if (a, b) == (0, 1 % m):
            return i
out['pisano'] = [pis(m) for m in range(1, 301)]

# F(n) mod m by a 2x2 matrix power, for random huge n
def mat_mul(A, B, m):
    return [[(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % m, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % m],
            [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % m, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % m]]
def fib_mod(n, m):
    R = [[1, 0], [0, 1]]
    Q = [[1, 1], [1, 0]]
    while n:
        if n & 1:
            R = mat_mul(R, Q, m)
        Q = mat_mul(Q, Q, m)
        n >>= 1
    return R[0][1] % m
cases = []
for _ in range(300):
    n = random.randrange(0, 10 ** random.randrange(1, 19))
    m = random.choice([1, 2, 7, 10, 100, 1000, 10 ** 9 + 7, 998244353, random.randrange(1, 10 ** 12)])
    cases.append([str(n), str(m), str(fib_mod(n, m))])
out['fibmod'] = cases
json.dump(out, sys.stdout)
`
const py = spawnSync('python', ['-I', '-X', 'utf8', '-c', PY], { encoding: 'utf8', maxBuffer: 1 << 28, timeout: 240000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)
const FB = R.F.map((s) => BigInt(s))

/* ------------------------------------------------------------------------------ 1: the numbers */
for (let n = 0; n <= 1500; n += n < 200 ? 1 : 7) {
  ok(M.fib(n) === FB[n], `F(${n}) by the loop`)
  const d = M.fibDoubling(n)
  ok(d.f === FB[n] && d.g === FB[n + 1], `fast doubling at n = ${n}`)
  ok(d.steps === (n === 0 ? 0 : n.toString(2).length) && d.mults === 3 * d.steps, `fast doubling steps at n = ${n}`)
}
ok(M.fib(0) === 0n && M.fib(1) === 1n && M.fib(2) === 1n && M.fib(10) === 55n && M.fib(20) === 6765n && M.fib(100) === 354224848179261915075n, 'known values')
// the calls of the three ways of computing F(n), counted by running them
{
  for (let n = 0; n <= 22; n++) {
    let calls = 0n
    const naive = (k) => {
      calls++
      return k < 2 ? k : naive(k - 1) + naive(k - 2)
    }
    naive(n)
    ok(calls === M.naiveCalls(n), `naive calls at n = ${n}: counted ${calls}, formula ${M.naiveCalls(n)}`)
    let mcalls = 0
    const memo = new Map()
    const withMemo = (k) => {
      mcalls++
      if (k < 2) return BigInt(k)
      if (memo.has(k)) return memo.get(k)
      const v = withMemo(k - 1) + withMemo(k - 2)
      memo.set(k, v)
      return v
    }
    withMemo(n)
    ok(mcalls === M.memoCalls(n), `memo calls at n = ${n}: counted ${mcalls}, formula ${M.memoCalls(n)}`)
    let adds = 0
    let a = 0n
    let b = 1n
    for (let i = 0; i < n; i++) {
      ;[a, b] = [b, a + b]
      if (i > 0) adds++
    }
    ok(adds === M.loopAdds(n) || (n === 0 && M.loopAdds(n) === 0), `loop additions at n = ${n}: counted ${adds}, formula ${M.loopAdds(n)}`)
  }
  ok(M.naiveCalls(20) === 21891n && M.memoCalls(20) === 39, 'the numbers printed by the Big-O article: 21891 and 39 calls for n = 20')
}

/* the identities, each side rebuilt from Python's list */
for (let n = 1; n <= 120; n++) {
  const rows = Object.fromEntries(M.identityRows(n).map((r) => [r.id, r]))
  let s1 = 0n
  let s2 = 0n
  let s3 = 0n
  let s4 = 0n
  for (let i = 1; i <= n; i++) {
    s1 += FB[i]
    s2 += FB[i] * FB[i]
    s3 += FB[2 * i - 1]
    s4 += FB[2 * i]
  }
  ok(rows.sum.left === s1 && rows.sum.right === FB[n + 2] - 1n && s1 === FB[n + 2] - 1n, `sum of F(1)…F(${n})`)
  ok(rows.squares.left === s2 && rows.squares.right === FB[n] * FB[n + 1] && s2 === FB[n] * FB[n + 1], `sum of squares to ${n}`)
  ok(rows.odd.left === s3 && rows.odd.right === FB[2 * n] && s3 === FB[2 * n], `odd-index sum to ${n}`)
  ok(rows.even.left === s4 && rows.even.right === FB[2 * n + 1] - 1n && s4 === FB[2 * n + 1] - 1n, `even-index sum to ${n}`)
  const cas = FB[n - 1] * FB[n + 1] - FB[n] * FB[n]
  ok(rows.cassini.left === cas && rows.cassini.right === (n % 2 === 0 ? 1n : -1n) && cas === rows.cassini.right, `Cassini at n = ${n}`)
  ok(rows.double.left === FB[2 * n] && rows.double.right === FB[2 * n] && rows.double1.left === FB[2 * n + 1] && rows.double1.right === FB[2 * n + 1], `doubling at n = ${n}`)
}
for (let t = 0; t < 600; t++) {
  const m = rndInt(1, 700)
  const n = rndInt(1, 700)
  let a = m
  let b = n
  while (b) [a, b] = [b, a % b]
  const r = M.gcdIdentity(m, n)
  let x = FB[m]
  let y = FB[n]
  while (y) [x, y] = [y, x % y]
  ok(r.g === a && r.valueOfGcd === FB[a] && r.gcdOfValues === x && x === FB[a], `gcd(F(${m}), F(${n})) = F(gcd(${m}, ${n}))`)
}
ok(M.gcdIdentity(12, 18).gcdOfValues === 8n && M.gcdIdentity(12, 18).g === 6, 'gcd(F12, F18) = gcd(144, 2584) = 8 = F6')

/* ------------------------------------------------------------------------- 2: the golden ratio */
{
  ok(M.goldenDigits(60) === R.phi.slice(0, 62) || R.phi.startsWith(M.goldenDigits(60)), `golden ratio to 60 digits: ${M.goldenDigits(60)} against ${R.phi}`)
  ok(M.goldenDigits(10) === '1.6180339887', 'golden ratio to ten places')
  for (const [ns, want] of Object.entries(R.ratios)) {
    const n = Number(ns)
    ok(M.ratioDigits(n, 60) === want.slice(0, 62), `F(${n + 1})/F(${n}) to 60 places: ${M.ratioDigits(n, 60)} against ${want}`)
  }
  for (let x = 0n; x < 3000n; x++) {
    const r = M.isqrtBig(x)
    ok(r * r <= x && (r + 1n) * (r + 1n) > x, `isqrt(${x})`)
  }
  for (let t = 0; t < 200; t++) {
    const x = BigInt(Math.floor(Math.random() * 1e15)) * BigInt(Math.floor(Math.random() * 1e15)) + BigInt(rndInt(0, 1000))
    const r = M.isqrtBig(x)
    ok(r * r <= x && (r + 1n) * (r + 1n) > x, `isqrt of a big number ${x}`)
  }
  // the ratio of neighbors differs from φ by about 1/(√5·F(n)²), alternating in sign: the correct decimals are about log10(√5·F(n)²)
  for (let n = 3; n <= 120; n++) {
    const k = M.correctDecimals(n, 60)
    const expected = Math.log10(Math.sqrt(5)) + 2 * Math.log10(Number(FB[n]) || 1)
    // an independent count from Python's digits of the ratio and of φ
    ok(Math.abs(k - expected) <= 1.01, `F(${n + 1})/F(${n}) has ${k} correct decimals, about ${expected.toFixed(2)} expected`)
    if (R.ratios[String(n)]) {
      const scaled = (s) => BigInt(s.replace('.', ''))
      const diff = scaled(R.ratios[String(n)]) - scaled(R.phi)
      const dd = diff < 0n ? -diff : diff
      ok(k === 60 - dd.toString().length || dd === 0n, `correct decimals at n = ${n}: ${k}, from Python's digits ${60 - dd.toString().length}`)
    }
  }
  ok(M.correctDecimals(1, 60) === 0 && M.correctDecimals(5, 60) === 1 && M.correctDecimals(10, 60) === 3, 'a few correct-decimal counts: 2/1, 8/5 = 1.6 and 89/55 = 1.61818')
  // Binet in doubles: right up to some n and then wrong; it is exact before the failure
  const f = M.binetFirstFailure(200)
  ok(f > 50 && f < 100, `Binet in doubles first fails at n = ${f}`)
  for (let n = 0; n < f; n++) ok(BigInt(M.binetDouble(n)) === FB[n], `Binet in doubles is right at n = ${n}`)
  ok(BigInt(M.binetDouble(f)) !== FB[f], 'Binet in doubles is wrong at the failure')
  console.log(`Binet in doubles first fails at n = ${f}`)
}

/* ------------------------------------------------------------------------------- 3: Zeckendorf */
const FIBS = [1n, 2n]
while (FIBS.length < 200) FIBS.push(FIBS[FIBS.length - 1] + FIBS[FIBS.length - 2])
for (let N = 1; N <= 400; N++) {
  const [total, nonconsec, set] = R.reps[String(N)]
  const z = M.zeckendorf(BigInt(N))
  const values = z.map((k) => FB[k])
  ok(nonconsec === 1, `brute force: N = ${N} has ${nonconsec} representations without consecutive Fibonacci numbers`)
  ok(values.map(Number).join() === set.join(), `Zeckendorf of ${N}: [${values}], brute force [${set}]`)
  ok(z.every((k, i) => i === 0 || z[i - 1] - k >= 2) && z.every((k) => k >= 2), `Zeckendorf of ${N}: no two consecutive, indices ≥ 2`)
  ok(M.representations(N) === total, `number of representations of ${N}: ${M.representations(N)}, brute force ${total}`)
}
for (const [Ns, want] of R.big) {
  const z = M.zeckendorf(BigInt(Ns))
  ok(z.map((k) => FB[k].toString()).join() === want.join(), `Zeckendorf of ${Ns}`)
  ok(z.reduce((s, k) => s + FB[k], 0n) === BigInt(Ns), `Zeckendorf of ${Ns} adds up`)
}
ok(M.zeckendorf(100n).join() === '11,6,4' && M.representations(100) === 9, 'Zeckendorf of 100 is 89 + 8 + 3 (F11 + F6 + F4)')
ok(M.zeckendorf(1n).join() === '2' && M.zeckendorf(2n).join() === '3' && M.zeckendorf(4n).join() === '4,2', 'Zeckendorf of 1, 2 and 4')
ok(M.zeckendorf(0n).length === 0, 'Zeckendorf of 0 is empty')

/* --------------------------------------------------------------------------------- 4: Pisano */
{
  const OEIS = [1, 3, 8, 6, 20, 24, 16, 12, 24, 60, 10, 24, 28, 48, 40, 24, 36, 24, 18, 60]
  OEIS.forEach((p, i) => ok(M.pisano(i + 1) === p, `π(${i + 1}) = ${M.pisano(i + 1)}, OEIS A001175 gives ${p}`))
  R.pisano.forEach((p, i) => ok(M.pisano(i + 1) === p, `π(${i + 1}) against a walk over the pairs`))
  ok(M.pisano(10) === 60 && M.pisano(100) === 300 && M.pisano(1000) === 1500 && M.pisano(10000) === 15000, 'π(10), π(100), π(1000), π(10000)')
  for (let m = 2; m <= 150; m++) {
    const p = M.pisano(m)
    const mm = BigInt(m)
    ok(FB[p] % mm === 0n && FB[p + 1] % mm === 1n % mm, `F(π(${m})) ≡ 0 and F(π(${m}) + 1) ≡ 1 (mod ${m})`)
    for (let k = 1; k < p; k++) if (FB[k] % mm === 0n && FB[k + 1] % mm === 1n) fail(`π(${m}) = ${p} but the pair (0, 1) returns already at ${k}`)
    const res = M.residues(m, 3 * p)
    ok(res.every((v, i) => i >= FB.length || v === Number(FB[i] % mm)), `residues mod ${m}`)
  }
  ok(M.residues(10, 12).join() === '0,1,1,2,3,5,8,3,1,4,5,9' && M.residues(1, 4).join() === '0,0,0,0', 'residues mod 10 and mod 1')
  for (const [ns, ms, want] of R.fibmod) {
    ok(M.fibMod(BigInt(ns), BigInt(ms)).toString() === want, `F(${ns}) mod ${ms}: ${M.fibMod(BigInt(ns), BigInt(ms))}, matrix power ${want}`)
  }
  for (let n = 0; n <= 300; n++) for (const m of [1, 2, 10, 97, 1000]) ok(M.fibMod(BigInt(n), BigInt(m)) === FB[n] % BigInt(m), `F(${n}) mod ${m}`)
  // the last digit of F(n) repeats every 60, the last two every 300
  for (let n = 0; n < 700; n++) ok(FB[n] % 10n === FB[n + 60] % 10n && FB[n] % 100n === FB[n + 300] % 100n, `last digits repeat at n = ${n}`)
}

/* ---------------------------------------------------------------------------------- 5: Euclid */
{
  const steps = (a, b) => {
    let s = 0
    while (b) {
      ;[a, b] = [b, a % b]
      s++
    }
    return s
  }
  for (let t = 0; t < 3000; t++) {
    const a = rndInt(1, 100000)
    const b = rndInt(1, a)
    ok(M.euclidSteps(a, b) === steps(a, b), `Euclid's steps for (${a}, ${b})`)
  }
  for (let n = 2; n <= 1000; n += n < 100 ? 1 : 13) ok(M.euclidSteps(FB[n + 1], FB[n]) === n - 1, `Euclid on (F(${n + 1}), F(${n})) takes n − 1 steps: ${M.euclidSteps(FB[n + 1], FB[n])}`)
  // Lamé: if b < F(n+1) the algorithm takes at most n − 1 steps (a > b)
  for (let t = 0; t < 3000; t++) {
    const n = rndInt(3, 25)
    const b = rndInt(1, Number(FB[n + 1]) - 1)
    const a = b + rndInt(1, 1000000)
    ok(M.euclidSteps(a, b) <= n - 1, `Lamé: b = ${b} < F(${n + 1}) but ${M.euclidSteps(a, b)} steps`)
  }
  ok(M.euclidSteps(13, 8) === 5 && M.euclidSteps(10, 4) === 2 && M.euclidSteps(7n, 7n) === 1, 'known step counts')
}

console.log(`fibonacci check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
