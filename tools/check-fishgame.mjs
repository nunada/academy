/** Checks src/lib/fishgame.ts, the engine of the Number Fish game, against a reference that does not use it.
 *
 *   - the order of the numbers: mpmath, at 80 digits, gives every number of every level from what it is declared to be (a + b√m, or a multiple of π or e);
 *     the engine's comparison of every pair of numbers, written in every pair of forms, must give the same answer, and the numbers of a level must lie
 *     far enough apart (and be different) for 40 digits to decide;
 *   - the TeX of the π and e fish is read back by a small parser written here, and is the number it should be;
 *   - the pond, every pair of numbers of a level played against each other: a fish with the larger number eats the smaller, the smaller one is eaten (a
 *     life, then safety, then another life), equal numbers in two forms leave each other alone;
 *   - growing through the tiers, winning, losing, the stars, the speed of the player's fish, the walls;
 *   - whole games with a player that always eats a safe fish (it wins, with every life, on every seed), a random player and an idle one: the lives, the
 *     score, the tiers and the fish on screen keep to the rules, every fish is one of the numbers of the level, in a form it can be written in, and a fish
 *     that swam in as "smaller", "larger" or "equal" was so at that moment, by the reference order.
 *
 *  Random inputs come from a seeded generator; FISH_FAST=1 runs a smaller set (for the mutation tests).
 *  Run: npm run check:fishgame   Needs Python with mpmath.   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.FISH_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fishgame-'))
const out = path.join(tmp, 'fishgame.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/fishgame.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const G = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const flag = (msg) => {
  bad++
  if (bad <= 40) console.log(msg)
}
const ok = (cond, msg) => {
  checks++
  if (!cond) flag(msg)
  return cond
}

const LEVELS = [1, 2, 3]
const rs = (r) => `${r.n}/${r.d}`

/* --------------------------------------------------------------------- what goes to Python */

const levels = LEVELS.map((level) => ({
  level,
  nums: G.levelNums(level).map((n) => ({
    key: n.key,
    exact: n.value.exact ? { a: rs(n.value.exact.a), b: rs(n.value.exact.b), m: String(n.value.exact.m) } : null,
    konst: n.value.konst ? { name: n.value.konst.name, mult: rs(n.value.konst.mult) } : null,
    reps: n.reps.map((s) => ({ en: G.fishTex(s, 'en'), id: G.fishTex(s, 'id') })),
  })),
}))

const PY = String.raw`
import sys, json, re
from fractions import Fraction
import mpmath as mp
mp.mp.dps = 90
data = json.load(open(sys.argv[1], encoding='utf-8'))

def fr(s):
    n, d = s.split('/')
    return Fraction(int(n), int(d))

def mpf(x):
    return mp.mpf(x.numerator) / mp.mpf(x.denominator)

def value(n):
    if n['exact']:
        e = n['exact']
        return mpf(fr(e['a'])) + mpf(fr(e['b'])) * mp.sqrt(mp.mpf(int(e['m'])))
    c = n['konst']
    return mpf(fr(c['mult'])) * (mp.pi if c['name'] == 'pi' else mp.e)

def parse_const(tex):
    # -?\d*\pi, -?\d*e, -?\frac{\d*\pi}{\d+}, -?\frac{\d*e}{\d+}
    m = re.fullmatch(r'(-?)(?:(\d*)(\\pi|e)|\\frac\{(\d*)(\\pi|e)\}\{(\d+)\})', tex)
    if not m:
        return None
    sign = -1 if m.group(1) else 1
    if m.group(3):
        k = int(m.group(2)) if m.group(2) else 1
        sym, den = m.group(3), 1
    else:
        k = int(m.group(4)) if m.group(4) else 1
        sym, den = m.group(5), int(m.group(6))
    base = mp.pi if sym == '\\pi' else mp.e
    return sign * mp.mpf(k) * base / den

res = {'levels': []}
for lv in data['levels']:
    vals = [value(n) for n in lv['nums']]
    # scaled to 10^60, for the checker to compare the engine's fish by
    scaled = [int(mp.floor(v * mp.mpf(10) ** 60)) for v in vals]
    gaps = [float(abs(vals[i + 1] - vals[i])) for i in range(len(vals) - 1)]
    sorted_ok = all(vals[i] < vals[i + 1] for i in range(len(vals) - 1))
    tex_bad = []
    for n, v in zip(lv['nums'], vals):
        if n['konst']:
            for r in n['reps']:
                for k in ('en', 'id'):
                    p = parse_const(r[k])
                    if p is None or abs(p - v) > mp.mpf(10) ** -60:
                        tex_bad.append('%s reads as %s, not %s' % (r[k], None if p is None else mp.nstr(p, 12), mp.nstr(v, 12)))
    res['levels'].append({'level': lv['level'], 'scaled': [str(s) for s in scaled], 'min_gap': min(gaps), 'sorted': sorted_ok, 'tex_bad': tex_bad})
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`
const inFile = path.join(tmp, 'in.json')
const outFile = path.join(tmp, 'out.json')
const pyFile = path.join(tmp, 'ref.py')
fs.writeFileSync(pyFile, PY)
fs.writeFileSync(inFile, JSON.stringify({ levels }), 'utf-8')
const py = spawnSync('python', [pyFile, inFile, outFile], { encoding: 'utf-8', maxBuffer: 1 << 28 })
if (py.status !== 0) {
  console.log('python reference failed:\n' + (py.stderr || py.stdout).split('\n').slice(-15).join('\n'))
  process.exit(1)
}
const R = JSON.parse(fs.readFileSync(outFile, 'utf8'))

/* ------------------------------------------------------------------------------ the order */

/** The reference's number for each key, scaled by 10^60. */
const oracle = new Map()
for (const lv of R.levels) {
  const nums = G.levelNums(lv.level)
  ok(lv.sorted, `level ${lv.level}: the numbers are not in increasing order by the reference`)
  ok(lv.min_gap > 1e-3, `level ${lv.level}: two numbers are only ${lv.min_gap} apart`)
  ok(lv.tex_bad.length === 0, `level ${lv.level}: ${lv.tex_bad.join('; ')}`)
  ok(nums.length >= 2 * G.TIERS[lv.level].count, `level ${lv.level} has only ${nums.length} numbers`)
  nums.forEach((n, i) => oracle.set(`${lv.level}:${n.key}`, BigInt(lv.scaled[i])))
  const keys = new Set(nums.map((n) => n.key))
  ok(keys.size === nums.length, `level ${lv.level}: two entries have the same number`)
  for (const n of nums) {
    const texts = n.reps.map((s) => G.fishTex(s, 'en'))
    ok(new Set(texts).size === texts.length, `level ${lv.level}: number ${n.key} has two forms written the same way`)
    ok(n.reps.length >= 1, `level ${lv.level}: number ${n.key} has no form`)
  }
}
const ref = (level, a) => oracle.get(`${level}:${a.key}`)
const refCmp = (level, a, b) => {
  const x = ref(level, a)
  const y = ref(level, b)
  return x < y ? -1 : x > y ? 1 : 0
}

// the levels grow: each holds all the numbers of the one before; only the hard one has π and e, only from the second on are there negatives
for (const level of [2, 3]) {
  const lower = new Set(G.levelNums(level - 1).map((n) => n.key))
  const here = new Set(G.levelNums(level).map((n) => n.key))
  ok([...lower].every((k) => here.has(k)) && here.size > lower.size, `level ${level} holds the numbers of level ${level - 1} and more`)
}
for (const level of LEVELS) {
  const withConst = G.levelNums(level).filter((n) => n.value.konst).length
  ok(level === 3 ? withConst === 7 : withConst === 0, `level ${level}: ${withConst} numbers made of π or e`)
  const negatives = G.levelNums(level).filter((n) => n.value.scaled < 0n).length
  ok(level === 1 ? negatives === 0 : negatives >= 6, `level ${level}: ${negatives} negative numbers`)
}
ok(JSON.stringify(G.TIERS) === JSON.stringify({ 1: { count: 5, need: 3 }, 2: { count: 6, need: 4 }, 3: { count: 7, need: 4 } }), 'the tiers and the fish needed for each')

let pairs = 0
for (const level of LEVELS) {
  const nums = G.levelNums(level)
  for (let i = 0; i < nums.length; i++)
    for (let j = 0; j < nums.length; j++) {
      const expected = i === j ? 0 : refCmp(level, nums[i], nums[j])
      // every form against every form
      for (const a of nums[i].reps)
        for (const b of nums[j].reps) {
          pairs++
          const got = G.compareSpecs(a, b)
          if (got !== expected) flag(`level ${level}: ${G.fishTex(a, 'en')} against ${G.fishTex(b, 'en')}: engine ${got}, reference ${expected}`)
        }
      checks++
    }
}
// the levels' own order is the reference's
for (const level of LEVELS) {
  const nums = G.levelNums(level)
  ok(nums.every((n, i) => i === 0 || refCmp(level, nums[i - 1], n) === -1), `level ${level}: levelNums is not sorted by the reference`)
}
ok(G.compareSpecs({ k: 'const', name: 'pi', mult: { n: 1n, d: 1n } }, { k: 'frac', n: 22n, d: 7n }) === -1, 'π is less than 22/7')
ok(G.compareSpecs({ k: 'const', name: 'pi', mult: { n: 1n, d: 1n } }, { k: 'dec', neg: false, whole: '3', frac: '14159' }) === 1, 'π is more than 3.14159')
ok(G.compareSpecs({ k: 'frac', n: 1n, d: 3n }, { k: 'dec', neg: false, whole: '0', frac: '33' }) === 1, '1/3 is more than 0.33')
ok(G.compareSpecs({ k: 'frac', n: 1n, d: 3n }, { k: 'rep', neg: false, whole: '0', pre: '', rep: '3' }) === 0, '1/3 equals 0.333…')
ok(G.compareSpecs({ k: 'rep', neg: false, whole: '0', pre: '', rep: '9' }, { k: 'frac', n: 1n, d: 1n }) === 0, '0.999… equals 1')
ok(G.compareSpecs({ k: 'coef', c: { n: 1n, d: 1n }, m: 2n }, { k: 'dec', neg: false, whole: '1', frac: '4142' }) === 1, '√2 is more than 1.4142')
ok(G.compareSpecs({ k: 'coef', c: { n: -1n, d: 1n }, m: 2n }, { k: 'frac', n: -3n, d: 2n }) === 1, '−√2 is more than −3/2')
ok(G.compareSpecs({ k: 'const', name: 'pi', mult: { n: 2n, d: 1n } }, { k: 'const', name: 'pi', mult: { n: 3n, d: 1n } }) === -1, '2π is less than 3π')
ok(G.compareSpecs({ k: 'const', name: 'e', mult: { n: 1n, d: 1n } }, { k: 'const', name: 'pi', mult: { n: 1n, d: 1n } }) === -1, 'e is less than π')
ok(G.fishTex({ k: 'const', name: 'pi', mult: { n: 1n, d: 2n } }, 'en') === '\\frac{\\pi}{2}' && G.fishTex({ k: 'const', name: 'e', mult: { n: -2n, d: 1n } }, 'id') === '-2e', 'TeX of π/2 and −2e')

/* ------------------------------------------------------------------------------ the pond */

/** A pond with nothing swimming in, the player's fish in the middle with the number `a` and one fish on top of it with the number `b`. */
function arena(level, a, b, repA = 0, repB = 0) {
  const w = G.createWorld(level, 1)
  w.spawnIn = 1e9
  const i = G.levelNums(level).findIndex((n) => n.key === a.key)
  w.player.num = a
  w.player.spec = a.reps[repA % a.reps.length]
  w.player.tier = 0
  const spec = b.reps[repB % b.reps.length]
  const f = { id: 99, num: b, spec, x: w.player.x, y: w.player.y, vx: 0, phase: 0, w: 90, r: 26, kind: 'edible', bumped: false }
  w.fish.push(f)
  return { w, f, rank: i }
}

let played = 0
for (const level of LEVELS) {
  const nums = G.levelNums(level)
  for (let i = 0; i < nums.length; i++)
    for (let j = 0; j < nums.length; j++) {
      const a = nums[i]
      const b = nums[j]
      const { w, f } = arena(level, a, b, j, i)
      const before = { lives: w.lives, score: w.score, fish: w.fish.length }
      const ev = G.step(w, 0.01, {})
      played++
      const expected = i === j ? 0 : refCmp(level, a, b)
      const where = `level ${level}: ${G.fishTex(a.reps[0], 'en')} against ${G.fishTex(b.reps[0], 'en')}`
      if (expected > 0) {
        if (!(ev.some((e) => e.type === 'eat') && w.score === before.score + 10 && w.fish.length === before.fish - 1 && w.lives === before.lives && !w.fish.includes(f)))
          flag(`${where}: the larger number should eat (events ${ev.map((e) => e.type)}, score ${w.score}, fish ${w.fish.length}, lives ${w.lives})`)
      } else if (expected < 0) {
        if (!(ev.some((e) => e.type === 'hurt') && w.lives === before.lives - 1 && w.score === before.score && w.fish.length === before.fish && w.player.safe > 0))
          flag(`${where}: the smaller number should be eaten (events ${ev.map((e) => e.type)}, lives ${w.lives})`)
      } else {
        if (ev.some((e) => e.type === 'eat' || e.type === 'hurt') || w.lives !== before.lives || w.score !== before.score || w.fish.length !== before.fish)
          flag(`${where}: equal numbers should leave each other alone`)
      }
    }
}
checks += played

// equal numbers written differently: a bump, once
{
  const level = 2
  const n = G.levelNums(level).find((x) => x.reps.length >= 2)
  const { w, f } = arena(level, n, n, 0, 1)
  const e1 = G.step(w, 0.01, {})
  const e2 = G.step(w, 0.01, {})
  ok(e1.filter((e) => e.type === 'bump').length === 1 && e2.filter((e) => e.type === 'bump').length === 0 && f.bumped, 'equal numbers bump once')
  ok(w.lives === G.LIVES && w.score === 0, 'and nothing else happens')
}

// being eaten: a life, then safety, then, when the safety has run out, another life
{
  const level = 1
  const nums = G.levelNums(level)
  const { w, f } = arena(level, nums[2], nums[10])
  f.vx = 0
  G.step(w, 0.01, {})
  ok(w.lives === G.LIVES - 1 && w.player.safe > 1.5, 'a life is lost and the player is safe')
  G.step(w, 0.01, {})
  ok(w.lives === G.LIVES - 1, 'a second touch while safe costs nothing')
  for (let t = 0; t < 40; t++) G.step(w, 0.05, {})
  ok(w.lives === G.LIVES - 2, 'when the safety has run out the same fish costs another life')
  for (let t = 0; t < 40; t++) G.step(w, 0.05, {})
  ok(w.lives === 0 && w.status === 'lost', 'three lives, then the game is lost')
  ok(G.step(w, 0.05, {}).length === 0, 'and nothing happens after that')
  ok(G.starsOf(3) === 3 && G.starsOf(2) === 2 && G.starsOf(1) === 1, 'stars by lives left')
}

// growing and winning
for (const level of LEVELS) {
  const tiers = G.tiersOf(level)
  const { need } = G.TIERS[level]
  ok(tiers.length === G.TIERS[level].count, `level ${level}: ${tiers.length} tiers`)
  ok(tiers.every((t, i) => i === 0 || refCmp(level, tiers[i - 1], t) === -1), `level ${level}: the tiers do not increase`)
  ok(tiers[tiers.length - 1].key === G.levelNums(level)[G.levelNums(level).length - 1].key, `level ${level}: the last tier is the largest number`)
  const nums = G.levelNums(level)
  ok(nums.findIndex((n) => n.key === tiers[0].key) >= 3, `level ${level}: the first tier has fewer than three numbers below it`)
  const w = G.createWorld(level, 5)
  w.spawnIn = 1e9
  ok(w.player.num.key === tiers[0].key && w.player.tier === 0, `level ${level}: the player starts at the first tier`)
  for (let t = 0; t < tiers.length; t++) {
    ok(w.player.tier === t && w.player.num.key === tiers[t].key, `level ${level}: tier ${t}`)
    const r0 = w.player.r
    for (let k = 0; k < need; k++) {
      const smaller = nums[Math.max(0, nums.findIndex((n) => n.key === w.player.num.key) - 1)]
      const f = { id: 1000 + t * 10 + k, num: smaller, spec: smaller.reps[0], x: w.player.x, y: w.player.y, vx: 0, phase: 0, w: 90, r: 26, kind: 'edible', bumped: false }
      w.fish.push(f)
      const before = w.eatenInTier
      const ev = G.step(w, 0.01, {})
      ok(ev.some((e) => e.type === 'eat'), `level ${level}: tier ${t} fish ${k} is eaten`)
      if (k < need - 1) ok(w.eatenInTier === before + 1 && w.player.tier === t, `level ${level}: no growth before ${need} fish`)
      else if (t < tiers.length - 1) ok(ev.some((e) => e.type === 'grow') && w.player.tier === t + 1 && w.eatenInTier === 0 && w.player.r > r0 && w.status === 'play', `level ${level}: growth after ${need} fish`)
      else ok(ev.some((e) => e.type === 'won') && w.status === 'won', `level ${level}: the last fish wins`)
    }
  }
  ok(w.score === 10 * need * tiers.length && w.eaten === need * tiers.length, `level ${level}: score and fish eaten`)
}

// swimming: the pointer, the keys, the walls
{
  const w = G.createWorld(1, 3)
  w.spawnIn = 1e9
  const x0 = w.player.x
  G.step(w, 0.05, { tx: 600, ty: w.player.y })
  ok(w.player.x > x0 && w.player.face === 1, 'the fish swims towards the pointer')
  const x1 = w.player.x
  G.step(w, 0.05, { tx: 10, ty: w.player.y })
  ok(w.player.x < x1 && w.player.face === -1, 'and turns round')
  const w2 = G.createWorld(1, 3)
  w2.spawnIn = 1e9
  G.step(w2, 0.05, { kx: 1, ky: 1 })
  const moved = Math.hypot(w2.player.x - G.WORLD.W / 2, w2.player.y - G.WORLD.H / 2)
  ok(Math.abs(moved - 190 * 0.05) < 1e-6, `the keys move at the player's speed in every direction, moved ${moved}`)
  for (let t = 0; t < 400; t++) G.step(w2, 0.05, { kx: 1, ky: -1 })
  ok(w2.player.x <= G.WORLD.W - w2.player.r + 1e-9 && w2.player.y >= w2.player.r - 1e-9, 'the walls hold the fish in')
  for (let t = 0; t < 400; t++) G.step(w2, 0.05, { tx: -50, ty: 500 })
  ok(w2.player.x >= w2.player.r - 1e-9 && w2.player.y <= G.WORLD.H - w2.player.r + 1e-9, 'whether it is steered by keys or by a pointer outside the pond')
  const near = G.createWorld(1, 3)
  near.spawnIn = 1e9
  G.step(near, 0.05, { tx: near.player.x + 3, ty: near.player.y })
  ok(Math.abs(near.player.x - (G.WORLD.W / 2 + 3)) <= 3 && near.player.x > G.WORLD.W / 2, 'the fish slows down near the pointer and does not shoot past it')
  const big = G.createWorld(1, 3)
  big.spawnIn = 1e9
  G.step(big, 10, { kx: 1 })
  ok(Math.abs(big.player.x - G.WORLD.W / 2 - 190 * 0.05) < 1e-6, 'a long pause moves the fish no further than one short step')
}

/* ------------------------------------------------------------------------- whole games */

const games = FAST ? 6 : 24

function check(w, level, where) {
  ok(w.lives >= 0 && w.lives <= G.LIVES, `${where}: lives ${w.lives}`)
  ok(w.player.tier >= 0 && w.player.tier < G.TIERS[level].count && w.eatenInTier >= 0 && (w.eatenInTier < w.need || (w.status === 'won' && w.eatenInTier === w.need)), `${where}: tier ${w.player.tier}, eaten in tier ${w.eatenInTier}`)
  ok(w.score === 10 * w.eaten && w.lost === G.LIVES - w.lives, `${where}: score ${w.score} for ${w.eaten} fish, ${w.lost} lost for ${w.lives} lives`)
  ok(w.fish.length <= { 1: 7, 2: 8, 3: 9 }[level], `${where}: ${w.fish.length} fish`)
  const nums = new Map(G.levelNums(level).map((n) => [n.key, n]))
  for (const f of w.fish) {
    ok(f.x > -f.w - 5 && f.x < G.WORLD.W + f.w + 5, `${where}: a fish at ${f.x.toFixed(0)} has left the pond and is still there`)
    const n = nums.get(f.num.key)
    ok(n && n.reps.some((s) => G.fishTex(s, 'en') === G.fishTex(f.spec, 'en')), `${where}: a fish shows ${G.fishTex(f.spec, 'en')}, which is not a form of its number`)
  }
  ok(w.status === 'lost' ? w.lives === 0 : w.lives > 0, `${where}: status ${w.status} with ${w.lives} lives`)
}

/** What the events of one tick must be, by the reference order, against the player's fish as it was at the start of the tick (it can grow at the end). */
function onEvents(level, events, where, mine, spec) {
  for (const e of events) {
    if (e.type === 'spawn') {
      // what it was when it swam in
      const c = refCmp(level, mine, e.fish.num)
      const want = e.fish.kind === 'edible' ? 1 : e.fish.kind === 'danger' ? -1 : 0
      ok(c === want, `${where}: a "${e.fish.kind}" fish swam in against ${mine.key} with the number ${e.fish.num.key}`)
      ok(e.fish.kind !== 'equal' || G.fishTex(e.fish.spec, 'en') !== G.fishTex(spec, 'en'), `${where}: an equal fish is written as the player's is`)
    }
    if (e.type === 'eat') ok(refCmp(level, mine, e.fish.num) > 0, `${where}: ${mine.key} ate ${e.fish.num.key}`)
    if (e.type === 'hurt') ok(refCmp(level, mine, e.fish.num) < 0, `${where}: ${mine.key} was eaten by ${e.fish.num.key}`)
    if (e.type === 'bump') ok(refCmp(level, mine, e.fish.num) === 0, `${where}: ${mine.key} bumped ${e.fish.num.key}`)
  }
}

for (const level of LEVELS) {
  for (let g = 0; g < games; g++) {
    const seed = 100 * level + g * 31 + 7
    const where = `level ${level} seed ${seed}`

    // a player that goes only to fish it can eat, away from the ones that could eat it
    {
      const w = G.createWorld(level, seed)
      let spawns = 0
      let t = 0
      while (w.status === 'play' && t < 900) {
        const mine = w.player.num
        const safeFood = w.fish
          .filter((f) => refCmp(level, mine, f.num) > 0 && w.fish.every((o) => o === f || refCmp(level, mine, o.num) >= 0 || Math.hypot(o.x - f.x, o.y - f.y) > 140))
          .sort((a, b) => Math.hypot(a.x - w.player.x, a.y - w.player.y) - Math.hypot(b.x - w.player.x, b.y - w.player.y))[0]
        if (safeFood) {
          // swim to it as fast as the fish can: here, straight on to it
          w.player.x = safeFood.x
          w.player.y = safeFood.y
        }
        const mine0 = w.player.num
        const spec0 = w.player.spec
        const events = G.step(w, 1 / 30, {})
        t += 1 / 30
        onEvents(level, events, where, mine0, spec0)
        spawns += events.filter((e) => e.type === 'spawn').length
        if (t % 5 < 1 / 30) check(w, level, where)
      }
      check(w, level, where)
      ok(w.status === 'won' && w.lives === G.LIVES, `${where}: the careful player should win with every life, got ${w.status} with ${w.lives} lives after ${t.toFixed(0)} s`)
      ok(w.eaten === G.TIERS[level].need * G.TIERS[level].count && spawns >= w.eaten, `${where}: ${w.eaten} fish eaten, ${spawns} swam in`)
    }

    // a player that goes wherever it likes
    {
      const w = G.createWorld(level, seed + 1)
      let lcg = seed
      const rand = () => ((lcg = (lcg * 1664525 + 1013904223) >>> 0) / 4294967296)
      let t = 0
      let tx = 100
      let ty = 100
      while (w.status === 'play' && t < 400) {
        if (Math.floor(t) !== Math.floor(t - 1 / 30)) {
          tx = rand() * G.WORLD.W
          ty = rand() * G.WORLD.H
        }
        const mine0 = w.player.num
        const spec0 = w.player.spec
        const events = G.step(w, 1 / 30, rand() < 0.2 ? { kx: Math.round(rand() * 2 - 1), ky: Math.round(rand() * 2 - 1) } : { tx, ty })
        t += 1 / 30
        onEvents(level, events, where + ' random', mine0, spec0)
        if (Math.round(t * 30) % 30 === 0) check(w, level, where + ' random')
      }
      check(w, level, where + ' random')
    }

    // a player that stays where it is
    {
      const w = G.createWorld(level, seed + 2)
      let t = 0
      while (w.status === 'play' && t < 300) {
        const mine0 = w.player.num
        const spec0 = w.player.spec
        onEvents(level, G.step(w, 1 / 30, {}), where + ' idle', mine0, spec0)
        t += 1 / 30
      }
      check(w, level, where + ' idle')
      ok(w.player.x === G.WORLD.W / 2 && w.player.y === G.WORLD.H / 2, `${where}: an idle fish does not move`)
    }
  }
}

// the same seed and the same moves give the same game
{
  const run = () => {
    const w = G.createWorld(2, 4242)
    const log = []
    for (let i = 0; i < 1500; i++) {
      for (const e of G.step(w, 1 / 30, { tx: (i * 7) % G.WORLD.W, ty: (i * 13) % G.WORLD.H })) log.push(e.type + (e.fish ? e.fish.id : ''))
    }
    return JSON.stringify([log, w.score, w.lives, w.t.toFixed(6), w.fish.map((f) => [f.id, f.x.toFixed(4), f.y.toFixed(4)])])
  }
  ok(run() === run(), 'the same seed and moves give the same game')
}

// a number with one form only (π) cannot be met by an equal fish written differently
{
  const w = G.createWorld(3, 9)
  const single = G.levelNums(3).find((n) => n.reps.length === 1)
  w.player.num = single
  w.player.spec = single.reps[0]
  ok(G.spawnFish(w, 'equal') === null, 'no equal fish for a number with one form')
}

// the spawner: its mix of fish, over many fish
{
  const level = 2
  const w = G.createWorld(level, 77)
  w.spawnIn = 1e9
  const count = { edible: 0, danger: 0, equal: 0 }
  for (let i = 0; i < 3000; i++) {
    const kind = i % 10 < 5 ? 'edible' : i % 10 < 8 ? 'danger' : 'equal'
    const f = G.spawnFish(w, kind)
    if (f) {
      count[f.kind]++
      const c = refCmp(level, w.player.num, f.num)
      if (c !== (f.kind === 'edible' ? 1 : f.kind === 'danger' ? -1 : 0)) flag(`spawnFish(${kind}) made a ${f.kind} fish that is not one`)
      ok(f.y >= 36 && f.y <= G.WORLD.H - 36 && (f.x < 0 || f.x > G.WORLD.W) && Math.abs(f.vx) >= 60 * 0.999 && Math.abs(f.vx) <= 100 * 1.001 && (f.vx > 0) === (f.x < 0), 'a new fish swims in from an edge at the level\'s pace')
      w.fish.length = 0
    }
  }
  ok(count.edible > 1400 && count.danger > 800 && count.equal > 300, `the mix of fish: ${JSON.stringify(count)}`)
  // near numbers come up more often than far ones
  const r = w.nums.findIndex((n) => n.key === w.player.num.key)
  let near = 0
  let far = 0
  for (let i = 0; i < 4000; i++) {
    const f = G.spawnFish(w, 'edible')
    w.fish.length = 0
    if (!f) continue
    const k = r - w.nums.findIndex((n) => n.key === f.num.key)
    if (k <= 2) near++
    else if (k >= r - 1 && r > 4) far++
  }
  ok(near > far, `numbers near the player's are drawn more often than the smallest (${near} near, ${far} far)`)
}

// the pond takes the shape of the screen: pondFor, and a game in a pond of another size
{
  const boxes = [[359, 748], [796, 311], [320, 520], [1200, 300], [200, 200], [4000, 4000], [375, 560], [600, 500]]
  for (const [bw, bh] of boxes) {
    const z = G.pondFor(bw, bh)
    ok(Number.isInteger(z.W) && Number.isInteger(z.H) && z.W >= 360 && z.W <= 900 && z.H >= 330 && z.H <= 760, `pondFor(${bw}, ${bh}) = ${z.W} × ${z.H} is out of range`)
    // on a screen of a size a phone has, the fish are drawn at a scale of at most 1.05
    const sc = Math.min(bw / z.W, bh / z.H)
    if (bw >= 360 && bh >= 330 && bw <= 900 && bh <= 760) ok(sc <= 1.06 && sc >= 0.5, `pondFor(${bw}, ${bh}): the pond is drawn at ${sc.toFixed(2)}`)
  }
  const tall = G.pondFor(359, 748)
  const wide = G.pondFor(796, 311)
  ok(tall.H > tall.W && wide.W > wide.H, 'an upright phone gets a tall pond and a sideways one a wide pond')
  ok(Math.abs(359 / tall.W - 359 / 400) < 0.03 && tall.W < 420, `upright: the fish are about the size they have on a page, the pond is ${tall.W} wide`)
  ok(Math.abs(311 / wide.H - 311 / 345) < 0.03 && wide.H < 360, `sideways: the pond is ${wide.H} high`)
  const dflt = G.createWorld(1, 5)
  ok(dflt.W === G.WORLD.W && dflt.H === G.WORLD.H && dflt.player.x === G.WORLD.W / 2 && dflt.player.y === G.WORLD.H / 2, 'a world without a size is the standard pond')

  for (const level of LEVELS) {
    for (const size of [tall, wide, { W: 360, H: 330 }, { W: 900, H: 760 }]) {
      const where = `level ${level}, a pond of ${size.W} × ${size.H}`
      const w = G.createWorld(level, 11 * level + size.W, 1, size)
      ok(w.W === size.W && w.H === size.H && w.player.x === size.W / 2 && w.player.y === size.H / 2, `${where}: the world has the size it was made with and the fish starts in the middle`)
      // spawning: from the sides, inside the pond up and down
      for (let i = 0; i < 400; i++) {
        const f = G.spawnFish(w, i % 2 ? 'edible' : 'danger')
        if (!f) continue
        ok(f.y >= 36 && f.y <= size.H - 36, `${where}: a fish swam in at height ${f.y.toFixed(0)}`)
        ok(f.vx > 0 ? f.x < 0 : f.x > size.W, `${where}: a fish swam in at ${f.x.toFixed(0)} with speed ${f.vx.toFixed(0)}`)
        w.fish.length = 0
      }
      // a player that goes wherever it likes: nothing leaves the pond, and the walls hold
      let lcg = 12345 + size.W
      const rand = () => ((lcg = (lcg * 1664525 + 1013904223) >>> 0) / 4294967296)
      let tx = 0
      let ty = 0
      for (let i = 0; i < 4500 && w.status === 'play'; i++) {
        if (i % 30 === 0) {
          tx = rand() * size.W * 1.4 - size.W * 0.2
          ty = rand() * size.H * 1.4 - size.H * 0.2
        }
        G.step(w, 1 / 30, i % 7 === 0 ? { kx: Math.round(rand() * 2 - 1), ky: Math.round(rand() * 2 - 1) } : { tx, ty })
        const pl = w.player
        ok(pl.x >= pl.r - 1e-9 && pl.x <= size.W - pl.r + 1e-9 && pl.y >= pl.r - 1e-9 && pl.y <= size.H - pl.r + 1e-9, `${where}: the fish is at ${pl.x.toFixed(0)}, ${pl.y.toFixed(0)}`)
        for (const f of w.fish) ok(f.x > -f.w - 5 && f.x < size.W + f.w + 5 && f.y >= 24 - 1e-9 && f.y <= size.H - 24 + 1e-9, `${where}: a fish at ${f.x.toFixed(0)}, ${f.y.toFixed(0)} is out of the pond`)
      }
      // swimming across: with the keys from the middle to the far corner
      const w2 = G.createWorld(level, 3, 1, size)
      w2.spawnIn = 1e9
      for (let i = 0; i < 2000; i++) G.step(w2, 0.05, { kx: 1, ky: 1 })
      ok(Math.abs(w2.player.x - (size.W - w2.player.r)) < 1e-6 && Math.abs(w2.player.y - (size.H - w2.player.r)) < 1e-6, `${where}: the fish reaches the far corner and stops there, at ${w2.player.x.toFixed(1)}, ${w2.player.y.toFixed(1)}`)
      // a careful player wins in any pond
      const w3 = G.createWorld(level, 77 + level, 1, size)
      let t = 0
      while (w3.status === 'play' && t < 900) {
        const mine = w3.player.num
        const food = w3.fish
          .filter((f) => refCmp(level, mine, f.num) > 0 && w3.fish.every((o) => o === f || refCmp(level, mine, o.num) >= 0 || Math.hypot(o.x - f.x, o.y - f.y) > 140))
          .sort((a, b) => Math.hypot(a.x - w3.player.x, a.y - w3.player.y) - Math.hypot(b.x - w3.player.x, b.y - w3.player.y))[0]
        if (food) {
          w3.player.x = food.x
          w3.player.y = food.y
        }
        G.step(w3, 1 / 30, {})
        t += 1 / 30
      }
      ok(w3.status === 'won' && w3.lives === G.LIVES, `${where}: the careful player should win with every life, got ${w3.status} with ${w3.lives}`)
    }
  }
}

console.log(`fishgame check: ${pairs} pairs of forms, ${played} fights, ${LEVELS.length * games * 3} games, ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
