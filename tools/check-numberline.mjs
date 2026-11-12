// Number Line: the lines, the numbers on them, the game, and the words of its page.
//   node tools/check-numberline.mjs
//
// Everything about a number is read back with a reader of its own, written here and not taken from the game: every TeX a player can see (the number to
// place, the label of a tick, what the marker stands for, what is said after a round) is parsed into an exact fraction with BigInt (or, for a root, π and e,
// into 30 digits) and compared with the place the game accepts. So a card that says 0.3̅ and sits on the tick of 1/3, or a root drawn at the wrong place, is found.
//
//   - lines: every line of the four snapped levels has at most 20 intervals, whole-number labels on levels 1 to 3, two labelled ends on the zoom level, and
//     every tick of it is worked out exactly (compared with a second computation);
//   - numbers: for every line and every tick a number may be on, every way it is written (both languages) reads back as exactly that tick's value, only the
//     forms the level allows appear, and the marker on any other tick is wrong; for the last level, every number and every window it can be put in;
//   - rounds: 10 different numbers for every level and many seeds, the same seed gives the same game, every line and form is used;
//   - the game: a perfect player gets three stars, a player who misses gets "retry", the place is shown only after two wrong tries, the marker snaps and
//     clamps, nothing works after the end; random players never break it; the stars;
//   - the page: both languages in full, links to articles that exist, the numbers in the text (ten numbers, 3%, the star limits) are the ones in the code,
//     and the Indonesian text uses the English words people say.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'numberline-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [`export * from '${q('src/lib/numberline.ts')}'`, `export { GAMES, GAMES_PAGE } from '${q('src/content/games.ts')}'`, `export { fishTex } from '${q('src/lib/fishgame.ts')}'`].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const N = await import('file://' + outFile.split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

let checks = 0
let bad = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 40) console.error('FAIL: ' + m)
  }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/* ------------------------------------------------------------------ exact fractions, our own */
const gcd = (a, b) => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}
const fr = (n, d = 1n) => {
  if (d < 0n) {
    n = -n
    d = -d
  }
  const g = gcd(n, d) || 1n
  return { n: n / g, d: d / g }
}
const frAdd = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d)
const frSub = (a, b) => fr(a.n * b.d - b.n * a.d, a.d * b.d)
const frMul = (a, b) => fr(a.n * b.n, a.d * b.d)
const frEq = (a, b) => a.n * b.d === b.n * a.d
const frOf = (r) => fr(BigInt(r.n), BigInt(r.d)) // the game's Rat → ours
const fromText = (s) => {
  const [n, d = '1'] = s.split('/')
  return fr(BigInt(n), BigInt(d))
}
const frKey = (f) => `${f.n}/${f.d}`
const tickAt = (line, i) => frAdd(frOf(line.min), frMul(fr(BigInt(i)), fr(frSub(frOf(line.max), frOf(line.min)).n, frSub(frOf(line.max), frOf(line.min)).d * BigInt(line.n))))

/* ---------------------------------------------- the reader: TeX → exact fraction, or 30 digits */
const S = 10n ** 30n
const isqrt = (n) => {
  if (n < 2n) return n
  let x = BigInt(Math.floor(Math.sqrt(Number(n))))
  if (x === 0n) x = 1n
  for (;;) {
    const y = (x + n / x) >> 1n
    if (y === x || y === x + 1n || y === x - 1n) {
      x = y
      break
    }
    x = y
  }
  while (x * x > n) x--
  while ((x + 1n) * (x + 1n) <= n) x++
  return x
}
const PI = 3141592653589793238462643383279n // 30 decimals (31 digits): 3.141592653589793238462643383279
const E = 2718281828459045235360287471352n // 2.718281828459045235360287471352
const sqrtScaled = (n, d) => isqrt((n * S * S) / d)

const MARK = String.raw`(?:\.|\{,\})`
/** A rational number written as an integer, fraction, mixed number, decimal, repeating decimal or percent. */
function readRational(tex) {
  let m
  if ((m = new RegExp(String.raw`^(-?)(\d+)\\tfrac\{(\d+)\}\{(\d+)\}$`).exec(tex))) {
    const v = fr(BigInt(m[2]) * BigInt(m[4]) + BigInt(m[3]), BigInt(m[4]))
    return m[1] ? fr(-v.n, v.d) : v
  }
  if ((m = new RegExp(String.raw`^(-?)\\frac\{(\d+)\}\{(\d+)\}$`).exec(tex))) return fr(m[1] ? -BigInt(m[2]) : BigInt(m[2]), BigInt(m[3]))
  if ((m = new RegExp(String.raw`^(-?)(\d+)${MARK}(\d*)\\overline\{(\d+)\}$`).exec(tex))) {
    const pre = m[3]
    const rep = m[4]
    const k = BigInt(pre.length)
    const r = BigInt(rep.length)
    let v = fr(BigInt(m[2]))
    if (pre) v = frAdd(v, fr(BigInt(pre), 10n ** k))
    v = frAdd(v, fr(BigInt(rep), 10n ** k * (10n ** r - 1n)))
    return m[1] ? fr(-v.n, v.d) : v
  }
  if ((m = new RegExp(String.raw`^(-?)(\d+)(?:${MARK}(\d+))?\\%$`).exec(tex))) {
    const f = m[3] ?? ''
    const v = fr(BigInt(m[2] + f), 10n ** BigInt(f.length) * 100n)
    return m[1] ? fr(-v.n, v.d) : v
  }
  if ((m = new RegExp(String.raw`^(-?)(\d+)(?:${MARK}(\d+))?$`).exec(tex))) {
    const f = m[3] ?? ''
    const v = fr(BigInt(m[2] + f), 10n ** BigInt(f.length))
    return m[1] ? fr(-v.n, v.d) : v
  }
  return null
}
/** A square root, π or e in the forms the last level shows, as an integer scaled by 10^30. */
function readIrrational(tex) {
  let m
  const sg = (neg, v) => (neg ? -v : v)
  if ((m = /^(-?)\\sqrt\{(\d+)\}$/.exec(tex))) return sg(m[1], sqrtScaled(BigInt(m[2]), 1n))
  if ((m = /^(-?)\\sqrt\{\\frac\{(\d+)\}\{(\d+)\}\}$/.exec(tex))) return sg(m[1], sqrtScaled(BigInt(m[2]), BigInt(m[3])))
  if ((m = /^(-?)(\d*)\\sqrt\{(\d+)\}$/.exec(tex))) return sg(m[1], BigInt(m[2] || '1') * sqrtScaled(BigInt(m[3]), 1n))
  if ((m = /^(-?)\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}$/.exec(tex))) return sg(m[1], (BigInt(m[2] || '1') * sqrtScaled(BigInt(m[3]), 1n)) / BigInt(m[4]))
  if ((m = /^(-?)\\frac\{(\d+)\}\{\\sqrt\{(\d+)\}\}$/.exec(tex))) return sg(m[1], (BigInt(m[2]) * S * S) / sqrtScaled(BigInt(m[3]), 1n))
  if ((m = /^(-?)(\d*)(\\pi|e)$/.exec(tex))) return sg(m[1], BigInt(m[2] || '1') * (m[3] === 'e' ? E : PI))
  if ((m = /^(-?)\\frac\{(\d*)(\\pi|e)\}\{(\d+)\}$/.exec(tex))) return sg(m[1], (BigInt(m[2] || '1') * (m[3] === 'e' ? E : PI)) / BigInt(m[4]))
  return null
}
const asNumber = (scaled) => Number(scaled / 10n ** 14n) / 1e16
const FAMILY = (tex) => {
  if (/\\tfrac/.test(tex)) return 'mixed'
  if (/\\frac/.test(tex)) return 'frac'
  if (/\\overline/.test(tex)) return 'rep'
  if (/\\%/.test(tex)) return 'pct'
  if (/[.]|\{,\}/.test(tex)) return 'dec'
  return 'int'
}
const ALLOWED = { 1: ['int'], 2: ['frac', 'mixed', 'dec', 'pct'], 3: ['frac', 'mixed', 'dec', 'pct', 'rep'], 4: ['frac', 'mixed', 'dec', 'pct', 'rep'] }

/* the reader itself, on sample forms whose value is known */
for (const [tex, n, d] of [
  ['7', 7n, 1n], ['-7', -7n, 1n], ['\\frac{3}{4}', 3n, 4n], ['-\\frac{3}{4}', -3n, 4n], ['1\\tfrac{3}{4}', 7n, 4n], ['-1\\tfrac{1}{2}', -3n, 2n], ['0.75', 3n, 4n], ['0{,}75', 3n, 4n],
  ['-0.5', -1n, 2n], ['0.\\overline{3}', 1n, 3n], ['0{,}\\overline{6}', 2n, 3n], ['0.1\\overline{6}', 1n, 6n], ['0.4\\overline{6}', 7n, 15n], ['-0.\\overline{3}', -1n, 3n], ['0.0\\overline{6}', 1n, 15n],
  ['75\\%', 3n, 4n], ['12.5\\%', 1n, 8n], ['-22\\%', -11n, 50n], ['175\\%', 7n, 4n], ['0.\\overline{142857}', 1n, 7n],
]) {
  const v = readRational(tex)
  ok(v && frEq(v, fr(n, d)), `the reader: ${tex} should be ${n}/${d}, read ${v && frKey(v)}`)
}
for (const [tex, x] of [['\\sqrt{2}', Math.SQRT2], ['-\\sqrt{3}', -Math.sqrt(3)], ['2\\sqrt{2}', 2 * Math.SQRT2], ['\\frac{\\sqrt{3}}{2}', Math.sqrt(3) / 2], ['\\sqrt{\\frac{1}{2}}', Math.SQRT1_2], ['\\frac{1}{\\sqrt{2}}', Math.SQRT1_2], ['\\frac{6}{\\sqrt{2}}', 3 * Math.SQRT2], ['\\pi', Math.PI], ['-\\pi', -Math.PI], ['e', Math.E], ['2\\pi', 2 * Math.PI], ['\\frac{\\pi}{2}', Math.PI / 2], ['\\frac{e}{2}', Math.E / 2]]) {
  const v = readIrrational(tex)
  ok(v !== null && Math.abs(asNumber(v) - x) < 1e-12, `the reader: ${tex} should be ${x}, read ${v === null ? null : asNumber(v)}`)
}
ok(readRational('\\sqrt{2}') === null && readIrrational('\\frac{3}{4}') === null && readRational('x') === null, 'the reader refuses what it does not know')

/* --------------------------------------------------------------------------------- the lines */
const L4 = [1, 2, 3, 4]
for (const level of L4) {
  const lines = N.templatesOf(level)
  ok(lines.length >= 7, `level ${level} has lines to choose from (${lines.length})`)
  lines.forEach((l, k) => {
    const name = `level ${level} line ${k} (${frKey(frOf(l.min))} to ${frKey(frOf(l.max))}, ${l.n} intervals)`
    ok(l.snap === true, `${name} snaps`)
    ok(l.n >= 4 && l.n <= 20, `${name}: at most 20 intervals so a tick is wide enough to touch (${l.n})`)
    ok(Number.isInteger(l.n) && Number.isInteger(l.labelEvery) && l.labelEvery >= 1 && l.n % l.labelEvery === 0, `${name}: labels divide the line`)
    const lo = frOf(l.min)
    const hi = frOf(l.max)
    ok(hi.n * lo.d > lo.n * hi.d, `${name}: min is below max`)
    const step = fr(frSub(hi, lo).n, frSub(hi, lo).d * BigInt(l.n))
    ok(frEq(frOf(N.lineStep(l)), step), `${name}: the step`)
    const values = new Set()
    for (let i = 0; i <= l.n; i++) {
      const v = frOf(N.tickValue(l, i))
      ok(frEq(v, tickAt(l, i)), `${name}: tick ${i} value`)
      values.add(frKey(v))
    }
    ok(values.size === l.n + 1, `${name}: ticks are all different`)
    ok(frEq(frOf(N.tickValue(l, 0)), lo) && frEq(frOf(N.tickValue(l, l.n)), hi), `${name}: the ends`)
    ok(N.isLabelled(l, 0) && N.isLabelled(l, l.n), `${name}: both ends are labelled`)
    const targets = N.targetTicks(l)
    ok(targets.length >= 2, `${name}: ticks a number can be on (${targets.length})`)
    ok(targets.every((i) => i > 0 && i < l.n && !N.isLabelled(l, i)), `${name}: no number sits on an end or on a labelled tick`)
    ok(same(targets, [...Array(l.n + 1).keys()].filter((i) => i > 0 && i < l.n && i % l.labelEvery !== 0)), `${name}: the ticks a number can be on`)
    if (level <= 3) {
      // the labels are the whole numbers, so a reader can count from them
      for (let i = 0; i <= l.n; i++) if (N.isLabelled(l, i)) ok(frOf(N.tickValue(l, i)).d === 1n, `${name}: label at tick ${i} is not a whole number`)
      ok(frOf(l.min).d === 1n && frOf(l.max).d === 1n, `${name}: the ends are whole numbers`)
    } else {
      ok(l.labelEvery === l.n, `${name}: a zoomed line labels its two ends only`)
      ok(['dec', 'frac'].includes(l.style), `${name}: a zoomed line says its ends as decimals or as fractions`)
    }
    if (level === 1) ok(l.style === 'int', `${name}: style`)
    // the labels read back as the ticks they sit under, in both languages
    for (const lang of ['en', 'id']) {
      for (let i = 0; i <= l.n; i++) {
        if (!N.isLabelled(l, i)) continue
        const t = N.tickTex(l, i, lang)
        const v = readRational(t)
        ok(v && frEq(v, tickAt(l, i)), `${name}: label ${t} (${lang}) at tick ${i}`)
        if (l.style === 'dec') ok(FAMILY(t) === 'dec' || FAMILY(t) === 'int', `${name}: a decimal label ${t}`)
        if (l.style === 'frac') ok(FAMILY(t) === 'frac' || FAMILY(t) === 'int', `${name}: a fraction label ${t}`)
        ok(lang === 'id' ? !/\d\.\d/.test(t) : !/\{,\}/.test(t), `${name}: the decimal mark of ${lang} in ${t}`)
      }
    }
  })
}
// the levels grow: level 3 has lines left of zero, level 2 has none
ok(N.templatesOf(1).some((l) => frOf(l.min).n < 0n), 'level 1 has lines below zero')
ok(N.templatesOf(2).every((l) => frOf(l.min).n >= 0n), 'level 2 lines start at 0 or above')
ok(N.templatesOf(3).every((l) => frOf(l.min).n < 0n), 'level 3 lines all go below zero')
ok(N.templatesOf(4).some((l) => frOf(l.max).n <= 0n) && N.templatesOf(4).some((l) => l.style === 'frac') && N.templatesOf(4).some((l) => l.style === 'dec'), 'zoom lines include negative ones and both label styles')

/* ----------------------------------------------------- the numbers on every tick of every line */
for (const level of L4) {
  for (const lang of ['en', 'id']) {
    let forms = 0
    const seen = new Set()
    for (const l of N.templatesOf(level)) {
      for (const i of N.targetTicks(l)) {
        const v = N.tickValue(l, i)
        const want = tickAt(l, i)
        const specs = N.formsOf(v, level)
        ok(specs.length >= 1, `level ${level}: ${frKey(want)} has a form`)
        for (const s of specs) {
          const tex = N.fishTex(s, lang)
          const got = readRational(tex)
          forms++
          ok(got && frEq(got, want), `level ${level}: ${tex} (${lang}) should be ${frKey(want)}, read ${got && frKey(got)}`)
          const fam = FAMILY(tex)
          seen.add(fam)
          ok(ALLOWED[level].includes(fam), `level ${level}: the form ${tex} (${fam}) is not one the level allows`)
          ok(lang === 'id' ? !/\d\.\d/.test(tex) : !/\{,\}/.test(tex), `the decimal mark of ${lang} in ${tex}`)
          ok(N.sameNumber(s, N.formsOf(v, level)[0]), `level ${level}: the forms of ${frKey(want)} are one number`)
        }
        if (level === 1) ok(specs.length === 1 && FAMILY(N.fishTex(specs[0], lang)) === 'int', `level 1: only the integer itself`)
      }
    }
    ok(forms > 50, `level ${level} (${lang}) has numbers to try (${forms})`)
    if (level === 2) ok(['frac', 'mixed', 'dec', 'pct'].every((f) => seen.has(f)), `level 2 shows fractions, mixed numbers, decimals and percents (${[...seen]})`)
    if (level >= 3) ok(seen.has('rep'), `level ${level} shows repeating decimals (${[...seen]})`)
    if (level === 2) ok(!seen.has('rep'), 'level 2 has no repeating decimals')
  }
}

/* ----------------------------------- a snapped line: the tick is right and every other is wrong */
for (const level of L4) {
  for (const l of N.templatesOf(level)) {
    for (const t of N.targetTicks(l)) {
      const spec = N.formsOf(N.tickValue(l, t), level)[0]
      const r = { line: l, spec, tick: t, at: t / l.n }
      for (let i = 0; i <= l.n; i++) {
        const j = N.judge(r, i)
        if (i === t) ok(j.ok && j.side === 0, `level ${level}: tick ${t} is the answer`)
        else ok(!j.ok && j.side === (i < t ? -1 : 1), `level ${level}: tick ${i} is not the answer ${t}, side ${j.side}`)
        // what the marker says it stands for reads back as that tick
        for (const lang of ['en', 'id']) {
          const tex = N.markTex(r, i, lang)
          const parts = tex.split('=')
          ok(parts.every((p) => {
            const v = readRational(p)
            return v && frEq(v, tickAt(l, i))
          }), `level ${level}: markTex ${tex} (${lang}) at tick ${i} should be ${frKey(tickAt(l, i))}`)
          if (l.style === 'int') {
            const v = tickAt(l, i)
            let dd = v.d
            let two = 0
            let five = 0
            while (dd % 2n === 0n) { dd /= 2n; two++ }
            while (dd % 5n === 0n) { dd /= 5n; five++ }
            const places = Math.max(two, five)
            const wantsDecimal = v.d !== 1n && dd === 1n && places <= 4
            ok(parts.length === (wantsDecimal ? 2 : 1), `level ${level}: markTex ${tex} for ${frKey(v)} should ${wantsDecimal ? 'also give the decimal' : 'be one form'}`)
          }
        }
      }
      for (const lang of ['en', 'id']) {
        const tex = N.equalsTex(r, lang)
        const parts = tex.split('=')
        ok(parts.every((p) => {
          const v = readRational(p)
          return v && frEq(v, tickAt(l, t))
        }), `level ${level}: equalsTex ${tex} (${lang}) should all be ${frKey(tickAt(l, t))}`)
        ok(parts[0] === N.fishTex(spec, lang), `equalsTex starts with the number as written`)
        ok(new Set(parts).size === parts.length && parts.length <= 3, `equalsTex has no repeat and at most three parts: ${tex}`)
        for (const p of parts.slice(1)) {
          const v = readRational(p)
          ok(FAMILY(p) !== 'frac' || (v && gcd(BigInt(/\frac{(d+)}/.exec(p)[1]), BigInt(/}{(d+)}/.exec(p)[1])) === 1n), `equalsTex shows a fraction in lowest terms: ${p}`)
        }
      }
    }
  }
}

/* ---------------------------------------------------------------- the last level: free lines */
{
  const specs = N.IRRATIONALS
  ok(specs.length >= 15, `enough roots, π and e (${specs.length})`)
  const keys = new Set()
  for (const forms of specs) {
    const vals = []
    for (const spec of forms) {
      const tex = N.fishTex(spec, 'en')
      const v = readIrrational(tex)
      ok(v !== null, `the reader knows ${tex}`)
      if (v === null) continue
      vals.push(v)
      ok(Math.abs(N.numeric(spec) - asNumber(v)) < 1e-12, `numeric(${tex}) = ${N.numeric(spec)}, read ${asNumber(v)}`)
      // approxTex says the first digits of the number, in the reader's mark
      for (const lang of ['en', 'id']) {
        const a = N.approxTex(spec, lang, 4)
        const num = Number(a.replace('{,}', '.'))
        ok(Math.abs(num - asNumber(v)) <= 0.00005 + 1e-12, `approxTex ${a} (${lang}) for ${tex}`)
        ok(/^-?\d+(\.|\{,\})\d{4}$/.test(a) && (lang === 'id' ? a.includes('{,}') : !a.includes('{,}')), `approxTex shape ${a} (${lang})`)
      }
    }
    // the forms of one number are one number, and no two numbers of the list are close
    ok(vals.every((v) => v - vals[0] < 10n ** 14n && vals[0] - v < 10n ** 14n), `the forms of ${N.fishTex(forms[0], 'en')} are the same number`)
    if (vals.length) {
      const k = asNumber(vals[0]).toFixed(6)
      ok(!keys.has(k), `two numbers in the list are the same: ${k}`)
      keys.add(k)
    }
    const x = N.numeric(forms[0])
    const ws = N.windowsFor(x)
    ok(ws.length >= 2, `${N.fishTex(forms[0], 'en')} fits in at least two windows (${ws.length})`)
    for (const l of ws) {
      const lo = Number(l.min.n)
      const hi = Number(l.max.n)
      ok(l.snap === false && x >= lo + 0.3 - 1e-12 && x <= hi - 0.3 + 1e-12, `${x} sits inside the window ${lo}..${hi} with room`)
      ok(hi - lo <= 8 && l.n >= hi - lo && l.n <= 2 * (hi - lo), `window ${lo}..${hi}: ticks every half or whole unit`)
      ok(l.n === (hi - lo <= 4 ? 2 * (hi - lo) : hi - lo) && l.labelEvery === (hi - lo <= 4 ? 2 : 1), `window ${lo}..${hi}: half ticks up to width 4, whole ticks above, labels at the whole numbers`)
      ok(l.min.d === 1n && l.max.d === 1n, 'window ends are integers')
      ok(N.isLabelled(l, 0) && N.isLabelled(l, l.n), `window ${lo}..${hi}: both ends are labelled`)
      for (let i = 0; i <= l.n; i++) if (N.isLabelled(l, i)) ok(frOf(N.tickValue(l, i)).d === 1n, 'free line labels are whole numbers')
      const at = (x - lo) / (hi - lo)
      const r = { line: l, spec: forms[0], tick: null, at }
      for (const [d, want] of [[0, true], [N.TOL * 0.99, true], [-N.TOL * 0.99, true], [N.TOL * 1.01, false], [-N.TOL * 1.01, false], [0.2, false], [-0.2, false]]) {
        const m = at + d
        if (m < 0 || m > 1) continue
        const j = N.judge(r, m)
        ok(j.ok === want, `${N.fishTex(forms[0], 'en')} on ${lo}..${hi}: a marker ${d.toFixed(3)} away is ${want ? 'right' : 'wrong'}`)
        ok(d === 0 ? true : j.side === (d < 0 ? -1 : 1), `side of the miss ${d}`)
      }
      for (const lang of ['en', 'id']) {
        const tex = N.equalsTex(r, lang)
        const [own, approx] = tex.split('\\approx ')
        ok(own === N.fishTex(forms[0], lang) && approx !== undefined && Math.abs(Number(approx.replace('{,}', '.')) - x) <= 0.00005 + 1e-9, `equalsTex for ${tex}`)
        const mt = N.markTex(r, at, lang)
        ok((lang === 'id' ? /^\\approx -?\d+\{,\}\d\d$/ : /^\\approx -?\d+\.\d\d$/).test(mt) &&Math.abs(Number(mt.replace('\\approx ', '').replace('{,}', '.')) - x) <= 0.005 + 1e-9, `markTex ${mt} at the number ${x}`)
      }
    }
  }
}
// the windows never leave a number at an edge: a number at an edge would be pushed against the wall
ok(N.windowsFor(50).length === 0 && N.windowsFor(-50).length === 0 && N.windowsFor(7.9).length === 0, 'a number outside every window has no window')

/* --------------------------------------------------------------------------------- the rounds */
const SEEDS = 150
const used = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set() }
const famSeen = { 2: new Set(), 3: new Set(), 4: new Set() }
const lineKeys = (l) => `${frKey(frOf(l.min))}|${frKey(frOf(l.max))}|${l.n}|${l.labelEvery}|${l.style}`
const linesSeen = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() }
const distinctValues = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set() }
for (const level of N.LEVELS) {
  for (let seed = 1; seed <= SEEDS; seed++) {
    let rounds
    try {
      rounds = N.buildRounds(level, seed)
    } catch (e) {
      ok(false, `level ${level} seed ${seed}: ${e.message}`)
      continue
    }
    ok(rounds.length === N.ROUNDS && N.ROUNDS === 10, `level ${level} seed ${seed}: ten rounds`)
    const values = new Set()
    for (const r of rounds) {
      const l = r.line
      if (level < 5) {
        const want = tickAt(l, r.tick)
        values.add(frKey(want))
        distinctValues[level].add(frKey(want))
        linesSeen[level].add(lineKeys(l))
        ok(l.snap && Number.isInteger(r.tick) && !N.isLabelled(l, r.tick) && r.tick > 0 && r.tick < l.n, `level ${level} seed ${seed}: the number is on a tick that is neither an end nor labelled`)
        ok(Math.abs(r.at - r.tick / l.n) < 1e-12, 'at is the tick over n')
        for (const lang of ['en', 'id']) {
          const tex = N.fishTex(r.spec, lang)
          const got = readRational(tex)
          ok(got && frEq(got, want), `level ${level} seed ${seed}: ${tex} (${lang}) should be ${frKey(want)}`)
          const fam = FAMILY(tex)
          ok(ALLOWED[level].includes(fam), `level ${level} seed ${seed}: ${tex} is ${fam}`)
          if (level >= 2) famSeen[level].add(fam)
        }
        ok(templateKnown(level, l), `level ${level} seed ${seed}: the line is one of the level's lines`)
      } else {
        const tex = N.fishTex(r.spec, 'en')
        const v = readIrrational(tex)
        ok(v !== null, `level 5 seed ${seed}: ${tex} can be read`)
        const x = v === null ? 0 : asNumber(v)
        values.add(x.toFixed(6))
        distinctValues[5].add(x.toFixed(6))
        ok(!l.snap && r.tick === null, 'level 5: free line, no tick')
        ok(Math.abs(r.at - (x - Number(l.min.n)) / (Number(l.max.n) - Number(l.min.n))) < 1e-9, `level 5 seed ${seed}: ${tex} is at ${r.at}`)
        ok(r.at >= 0.3 / (Number(l.max.n) - Number(l.min.n)) - 1e-9 && r.at <= 1 - 0.3 / (Number(l.max.n) - Number(l.min.n)) + 1e-9, `level 5: ${tex} is not against the wall`)
        ok(!/^\\frac\{(\d+)\}\{\\sqrt\{\1\}\}$/.test(tex), `level 5: ${tex} is the trivial n over root n`)
      }
    }
    ok(values.size === 10, `level ${level} seed ${seed}: ten different numbers (${values.size})`)
    // the same seed, the same game; and another seed another
    ok(same(rounds.map((r) => [N.fishTex(r.spec, 'en'), lineKeys(r.line), r.tick]), N.buildRounds(level, seed).map((r) => [N.fishTex(r.spec, 'en'), lineKeys(r.line), r.tick])), `level ${level} seed ${seed}: reproducible`)
    if (seed > 1) used[level].add(JSON.stringify(rounds.map((r) => N.fishTex(r.spec, 'en'))))
  }
  ok(used[level].size >= SEEDS - 2, `level ${level}: seeds make different games (${used[level].size})`)
  ok(distinctValues[level].size >= (level === 5 ? 12 : 30), `level ${level}: many different numbers are used (${distinctValues[level].size})`)
  // asked for fewer rounds
  ok(N.buildRounds(level, 3, 4).length === 4, `level ${level}: asked for four rounds`)
  ok(same(N.buildRounds(level, 3, 4).map((r) => N.fishTex(r.spec, 'en')), N.buildRounds(level, 3, 10).slice(0, 4).map((r) => N.fishTex(r.spec, 'en'))), `level ${level}: the first rounds do not depend on how many are asked for`)
}
function templateKnown(level, l) {
  return N.templatesOf(level).some((t) => lineKeys(t) === lineKeys(l))
}
for (const level of L4) ok(linesSeen[level].size === N.templatesOf(level).length, `level ${level}: every line is used in ${SEEDS} games (${linesSeen[level].size}/${N.templatesOf(level).length})`)
ok(['frac', 'mixed', 'dec', 'pct'].every((f) => famSeen[2].has(f)), `level 2 games use every form (${[...famSeen[2]]})`)
ok(famSeen[3].has('rep') && famSeen[4].has('rep') && famSeen[4].has('pct'), 'levels 3 and 4 games use repeating decimals and percents')
// every window shape is used by the last level, and every number of the list
{
  const wins = new Set()
  const nums = new Set()
  for (let seed = 1; seed <= 300; seed++) for (const r of N.buildRounds(5, seed)) {
    wins.add(lineKeys(r.line))
    nums.add(readIrrational(N.fishTex(r.spec, 'en')) === null ? '' : asNumber(readIrrational(N.fishTex(r.spec, 'en'))).toFixed(6))
  }
  ok(wins.size >= 10, `level 5 uses many windows (${wins.size})`)
  ok(nums.size === N.IRRATIONALS.length, `level 5 uses every number of its list (${nums.size}/${N.IRRATIONALS.length})`)
}
// the forms of a root: the coefficient form is the usual one
{
  const tally = { coef: 0, root: 0, inv: 0, konst: 0 }
  for (let seed = 1; seed <= 300; seed++) for (const r of N.buildRounds(5, seed)) tally[r.spec.k === 'const' ? 'konst' : r.spec.k]++
  ok(tally.coef > tally.root && tally.coef > tally.inv, `level 5 shows the coefficient form most (${JSON.stringify(tally)})`)
  ok(tally.root > 0 && tally.inv > 0 && tally.konst > 0, `and the others as well (${JSON.stringify(tally)})`)
}

/* ------------------------------------------------------------------------------- the game */
const mk = (level, seed) => N.newGame(level, seed)
// a small random source of our own (mulberry32)
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
const exact = (g) => N.markAt(N.roundOf(g).line, N.roundOf(g).at)
{
  const g0 = mk(1, 7)
  ok(g0.phase === 'play' && g0.mark === null && g0.index === 0 && g0.mistakes === 0 && g0.tries === 0 && g0.results.length === 0 && g0.rounds.length === 10, 'a new game')
  ok(N.check(g0) === g0, 'Check with no marker does nothing')
  ok(N.reveal(g0) === g0 && N.advance(g0) === g0, 'reveal and advance do nothing before a try')
  const r0 = N.roundOf(g0)
  // setMark: snaps, clamps, ignores nonsense
  ok(N.setMark(g0, -3).mark === 0 && N.setMark(g0, 5).mark === r0.line.n, 'the marker clamps to the ends')
  ok(N.setMark(g0, Number.NaN).mark === 0 && N.setMark(g0, Infinity).mark === 0, 'a place that is not a number puts it at the start')
  ok(N.setMark(g0, 0.5).mark === r0.line.n / 2, 'the middle of the line is the middle tick')
  ok(N.setMark(g0, 0.26).mark === Math.round(0.26 * r0.line.n), 'it snaps to the nearest tick')
  ok(Number.isInteger(N.setMark(g0, 0.37).mark), 'a snapped mark is a whole tick')
  for (let i = 0; i <= r0.line.n; i++) ok(Math.abs(N.placeOf(r0.line, i) - i / r0.line.n) < 1e-12 && N.markAt(r0.line, N.placeOf(r0.line, i)) === i, `tick ${i}: placeOf and markAt are inverse`)
  ok(N.placeOf({ ...r0.line, snap: false }, 0.37) === 0.37 && N.markAt({ ...r0.line, snap: false }, 0.37) === 0.37, 'on a free line the place is the mark')
  {
    const wrongOne = N.check(N.setMark(g0, (r0.tick === 1 ? 2 : 1) / r0.line.n))
    ok(wrongOne.phase === 'wrong' && N.setMark(wrongOne, 0.5).phase === 'play' && N.setMark(wrongOne, 0.5).tries === 1, 'putting the marker somewhere takes back a wrong')
  }
  for (const k of [0, 1, 3, 7, r0.line.n - 1]) {
    ok(N.setMark(g0, (k + 0.6) / r0.line.n).mark === Math.min(k + 1, r0.line.n) && N.setMark(g0, (k + 0.4) / r0.line.n).mark === k, `a place 0.6 of a tick past tick ${k} snaps up, 0.4 snaps down`)
  }
  const free = mk(5, 7)
  ok(N.setMark(free, 0.4321).mark === 0.4321 && N.setMark(free, 2).mark === 1 && N.setMark(free, -1).mark === 0, 'a free marker keeps its place and clamps')
  // nudge
  ok(N.nudge(g0, 1).mark === Math.round(r0.line.n / 2) && N.nudge(g0, -1).mark === Math.round(r0.line.n / 2), 'the first nudge puts the marker in the middle')
  ok(N.nudge(N.setMark(g0, 0), -1).mark === 0 && N.nudge(N.setMark(g0, 1), 1).mark === r0.line.n, 'a nudge stops at the ends')
  ok(N.nudge(N.setMark(g0, 0.5), 3).mark === r0.line.n / 2 + 3 && N.nudge(N.setMark(g0, 0.5), -5).mark === r0.line.n / 2 - 5, 'a nudge moves by ticks')
  ok(N.nudge(free, 1).mark === 0.5, 'a free marker starts in the middle')
  ok(Math.abs(N.nudge(N.setMark(free, 0.5), 1).mark - 0.51) < 1e-9 && Math.abs(N.nudge(N.setMark(free, 0.5), -10).mark - 0.4) < 1e-9, 'a free nudge is a hundredth of the line')
  ok(N.nudge(N.setMark(free, 0.995), 1).mark === 1 && N.nudge(N.setMark(free, 0.005), -1).mark === 0, 'a free nudge stops at the ends')

  // a perfect player
  for (const level of N.LEVELS) {
    for (let seed = 1; seed <= 20; seed++) {
      let g = mk(level, seed)
      let steps = 0
      while (g.phase !== 'done' && steps++ < 100) {
        g = N.setMark(g, N.roundOf(g).at)
        g = N.check(g)
        if (g.phase !== 'right') {
          ok(false, `level ${level} seed ${seed}: the exact place was refused`)
          break
        }
        g = N.advance(g)
      }
      ok(g.phase === 'done' && g.mistakes === 0 && g.results.length === 10 && g.results.every((r) => r === 'first') && N.stars(g.mistakes) === 3, `level ${level} seed ${seed}: a perfect game is three stars`)
      ok(g.index === 9, 'the index stays at the last round')
    }
  }
  // after the end nothing moves
  {
    let g = mk(2, 5)
    for (let i = 0; i < 10; i++) g = N.advance(N.check(N.setMark(g, N.roundOf(g).at)))
    ok(g.phase === 'done', 'the end')
    ok(N.setMark(g, 0.3) === g && N.nudge(g, 1) === g && N.check(g) === g && N.reveal(g) === g && N.advance(g) === g, 'after the end nothing works')
  }
  // a wrong try, then the right one
  {
    let g = mk(2, 11)
    const r = N.roundOf(g)
    const wrong = r.tick === 1 ? 2 : 1
    g = N.check(N.setMark(g, wrong / r.line.n))
    ok(g.phase === 'wrong' && g.tries === 1 && g.mistakes === 1 && g.results.length === 0, 'a wrong Check is a mistake')
    ok(N.reveal(g) === g, 'one wrong try is not enough to be shown the place')
    ok(N.advance(g) === g, 'a wrong round cannot be skipped')
    const g2 = N.nudge(g, 1)
    ok(g2.phase === 'play' && g2.tries === 1 && g2.mistakes === 1, 'moving the marker takes the "wrong" back and keeps the count')
    g = N.check(N.setMark(g, r.at))
    ok(g.phase === 'right' && g.results[0] === 'retry' && g.mistakes === 1 && g.tries === 1, 'right after a miss is a retry')
    ok(N.setMark(g, 0.1) === g && N.nudge(g, 1) === g && N.check(g) === g, 'a settled round does not move')
    g = N.advance(g)
    ok(g.index === 1 && g.phase === 'play' && g.mark === null && g.tries === 0 && g.mistakes === 1, 'the next round starts clean')
  }
  // the place is shown after two wrong tries
  {
    let g = mk(3, 4)
    const r = N.roundOf(g)
    const wrong = r.tick === 1 ? 2 : 1
    g = N.check(N.setMark(g, wrong / r.line.n))
    g = N.check(N.setMark(g, wrong / r.line.n))
    ok(g.phase === 'wrong' && g.tries === 2 && g.mistakes === 2, 'two wrong tries')
    g = N.reveal(g)
    ok(g.phase === 'shown' && g.results[0] === 'shown' && g.mistakes === 2, 'the place is shown and the round counts as shown')
    ok(N.check(g) === g && N.setMark(g, 0.2) === g, 'a shown round does not move')
    g = N.advance(g)
    ok(g.index === 1 && g.phase === 'play' && g.tries === 0, 'and the game goes on')
  }
  // the stars
  for (const [m, s] of [[0, 3], [1, 3], [2, 2], [3, 2], [4, 2], [5, 1], [9, 1], [30, 1]]) ok(N.stars(m) === s, `${m} mistakes is ${s} stars`)
  ok(N.stars(2, 5) === 2 && N.stars(3, 5) === 1 && N.stars(1, 5) === 3, 'stars for a short game: at most 40% of the rounds')
  ok(N.REVEAL_AFTER === 2 && N.TOL === 0.03 && N.ROUNDS === 10, 'the constants the text promises')
}
// random players never break the game
for (const level of N.LEVELS) {
  for (let seed = 1; seed <= 15; seed++) {
    const rand = rng(seed * 31 + level)
    let g = mk(level, seed)
    let wrongChecks = 0
    let finished = 0
    let steps = 0
    let problem = ''
    while (g.phase !== 'done' && steps++ < 20000) {
      const prev = g
      const roll = rand()
      if (roll < 0.25) g = N.setMark(g, rand() * 1.2 - 0.1)
      else if (roll < 0.45) g = N.nudge(g, Math.floor(rand() * 11) - 5)
      else if (roll < 0.6) g = N.setMark(g, N.roundOf(g).at)
      else if (roll < 0.85) g = N.check(g)
      else if (roll < 0.92) g = N.reveal(g)
      else g = N.advance(g)
      if (prev.phase !== 'wrong' && prev.phase !== 'play') {
        if (g.mark !== prev.mark && g.index === prev.index) problem = 'a settled round moved'
      }
      if (g.phase === 'wrong' && (prev.phase === 'play' || prev.phase === 'wrong') && g !== prev && g.mistakes === prev.mistakes + 1) wrongChecks++
      if ((g.phase === 'right' || g.phase === 'shown') && prev.phase !== g.phase) finished++
      if (g.mistakes !== wrongChecks) problem = `mistakes ${g.mistakes} but ${wrongChecks} wrong checks`
      if (g.index < 0 || g.index > 9 || !['play', 'right', 'wrong', 'shown', 'done'].includes(g.phase)) problem = 'bad state ' + JSON.stringify([g.index, g.phase])
      if (g.mark !== null && (g.mark < 0 || g.mark > (N.roundOf(g).line.snap ? N.roundOf(g).line.n : 1))) problem = 'marker out of the line'
      if (g.mark !== null && N.roundOf(g).line.snap && !Number.isInteger(g.mark)) problem = 'a snapped marker is between ticks'
      if (g.results.length > finished) problem = 'results ahead of finished rounds'
      if (problem) break
    }
    ok(!problem, `level ${level} seed ${seed}: random player: ${problem}`)
    ok(g.phase === 'done' && g.results.length === 10, `level ${level} seed ${seed}: a random player finishes (${steps} steps)`)
    ok(g.results.filter((r) => r === 'shown').length <= g.mistakes / 2, 'every shown round had two wrong tries')
  }
}
// a careless player on the free level: close markers count
{
  const g0 = mk(5, 3)
  const r = N.roundOf(g0)
  const span = 1
  const near = N.check(N.setMark(g0, Math.min(1, r.at + N.TOL * 0.9 * span)))
  const far = N.check(N.setMark(g0, Math.min(1, r.at + N.TOL * 1.2 * span)))
  ok(near.phase === 'right' || r.at + N.TOL * 0.9 > 1, 'on the free level a marker just inside 3% is right')
  ok(far.phase === 'wrong' || r.at + N.TOL * 1.2 > 1, 'and just outside is wrong')
}

/* ------------------------------------------------------------------------------- the words */
{
  const g = N.GAMES.find((x) => x.id === 'number-line')
  ok(Boolean(g), 'the game is in the list')
  const ids = N.GAMES.map((x) => x.id)
  ok(new Set(ids).size === ids.length && new Set(N.GAMES.map((x) => x.slug.en)).size === ids.length && new Set(N.GAMES.map((x) => x.slug.id)).size === ids.length, 'game ids and addresses are unique')
  ok(g.slug.en === 'number-line' && g.slug.id === 'garis-bilangan', 'addresses')
  const articleIds = new Set(fs.readdirSync(path.join(ROOT, 'src/content/articles')).filter((f) => f.endsWith('.meta.ts')).map((f) => f.replace('.meta.ts', '')))
  const texts = []
  const addLoc = (loc, where) => {
    ok(loc && typeof loc.en === 'string' && typeof loc.id === 'string' && loc.en.trim() && loc.id.trim(), `${where}: both languages`)
    texts.push([where, loc])
  }
  for (const k of ['title', 'seoTitle', 'description', 'keywords', 'tagline', 'answer']) addLoc(g[k], k)
  g.sections.forEach((s, i) => {
    ok(/^[a-z-]+$/.test(s.id), `section id ${s.id}`)
    addLoc(s.heading, `section ${i} heading`)
    addLoc(s.text, `section ${i} text`)
  })
  g.faq.forEach((f, i) => {
    addLoc(f.q, `faq ${i} question`)
    addLoc(f.a, `faq ${i} answer`)
  })
  g.teaches.forEach((t, i) => addLoc(t, `teaches ${i}`))
  ok(g.sections.length >= 3 && g.faq.length >= 4 && g.teaches.length >= 3, 'the page has sections, questions and topics')
  ok(new Set(g.sections.map((s) => s.id)).size === g.sections.length, 'section ids are unique')
  ok(g.sections.some((s) => s.id === 'how-to-play'), 'a how-to-play section')
  ok(/^\d{4}-\d\d-\d\d$/.test(g.published) && g.updated >= g.published, 'dates')
  for (const [where, loc] of texts) {
    for (const lang of ['en', 'id']) {
      for (const m of loc[lang].matchAll(/\(article:([a-z0-9-]+)\)/g)) ok(articleIds.has(m[1]), `${where} (${lang}) links to the article ${m[1]}, which does not exist`)
      for (const m of loc[lang].matchAll(/\]\((\/[^)]+)\)/g)) {
        const href = m[1]
        const hit = N.GAMES.some((x) => href === `/games/${x.slug.en}` || href === `/permainan/${x.slug.id}`) || /^\/course\/[a-z0-9-]+$/.test(href)
        ok(hit, `${where} (${lang}) links to ${href}, which is neither a game nor a course`)
        if (/^\/(games|permainan)\//.test(href)) ok(href.startsWith(lang === 'en' ? '/games/' : '/permainan/'), `${where}: a ${lang} link to ${href} in the other language`)
      }
      const t = loc[lang]
      ok((t.match(/\$/g) ?? []).length % 2 === 0, `${where} (${lang}): $ signs come in pairs`)
      ok(!/—|–/.test(t), `${where} (${lang}): no dash`)
      if (lang === 'id') {
        for (const w of ['tetikus', 'berkas', 'tautan', 'peramban', 'papan ketik', 'surel', 'masukan', 'keluaran', 'sorotan']) ok(!new RegExp(`\\b${w}\\b`, 'i').test(t), `${where}: the Indonesian says "${w}" and people say the English word`)
        ok(!/\d\.\d/.test(t.replace(/\$[^$]*\$/g, '')), `${where}: a decimal point in Indonesian text`)
        ok(!/\$[^$]*\d\.\d[^$]*\$/.test(t), `${where}: a decimal point inside Indonesian math (use {,})`)
      } else {
        for (const w of ['colour', 'neighbour', 'centre', 'metre', 'practise ', 'rationalise']) ok(!t.includes(w) || /practises/.test(t), `${where}: US spelling, not ${w}`)
        ok(!/\{,\}/.test(t), `${where}: an English text with an Indonesian decimal mark`)
      }
    }
  }
  const all = (lang) => texts.map(([, l]) => l[lang]).join('\n')
  // the text says what the code does
  ok(N.LEVELS.length === 5 && /five levels/i.test(g.description.en) && /lima tingkat/i.test(g.description.id), 'five levels, in the description of both languages')
  const level = (lang) => (g.sections.find((s) => s.id === 'levels').text[lang].match(/^\| \d /gm) ?? []).length
  ok(level('en') === 5 && level('id') === 5, 'the table of levels has five rows')
  ok(/3%/.test(g.answer.en) && /3%/.test(g.answer.id) && /3%/.test(all('en')) && /3%/.test(all('id')) && N.TOL === 0.03, 'the 3% in the text is the tolerance of the code')
  ok(/Ten numbers/.test(g.sections[0].text.en) && /Sepuluh bilangan/.test(g.sections[0].text.id) && N.ROUNDS === 10, 'ten numbers in the text, ten in the code')
  ok(/at most one mistake/.test(g.sections[0].text.en) && /paling banyak satu kesalahan/.test(g.sections[0].text.id) && N.stars(1) === 3 && N.stars(2) === 2, 'the stars the text promises: at most one mistake is three')
  ok(/up to four/.test(g.sections[0].text.en) && /sampai empat/.test(g.sections[0].text.id) && N.stars(4) === 2 && N.stars(5) === 1, 'up to four is two stars')
  ok(/two wrong tries/.test(g.sections[0].text.en) && /dua kali salah/.test(g.sections[0].text.id), 'the place is shown after two wrong tries, in both languages')
  ok(g.faq.some((f) => /3%/.test(f.a.en)) && g.faq.some((f) => /one mistake or none/.test(f.a.en) && /two to four/.test(f.a.en)), 'the FAQ repeats the tolerance and the stars')
  // the list page names it
  ok(/line/i.test(N.GAMES_PAGE.description.en) && /garis/i.test(N.GAMES_PAGE.description.id), 'the games list says the game is there')
}

/* ----------------------------------------------------------------------- the pieces fit together */
{
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8')
  const page = read('src/pages/GamePage.tsx')
  ok(/'number-line':\s*\(\)\s*=>\s*<NumberLineGame\s*\/>/.test(page) && /import NumberLineGame from/.test(page), 'GamePage shows the game')
  const ui = read('src/components/games/NumberLineGame.tsx')
  for (const fn of ['buildRounds', 'newGame', 'setMark', 'nudge', 'check', 'reveal', 'advance', 'judge', 'stars', 'markTex', 'equalsTex', 'tickTex', 'isLabelled', 'placeOf', 'roundOf']) ok(new RegExp(`\\b${fn}\\b`).test(ui.replace(/import[\s\S]*?from '..\/..\/lib\/numberline'/, '')) || fn === 'buildRounds', `the game uses ${fn} from the engine`)
  ok(/role="slider"/.test(ui) && /aria-valuetext/.test(ui) && /onKeyDown/.test(ui), 'the line is a slider a keyboard can use')
  ok(/role="status" aria-live="polite">\s*\{status\}/.test(ui), 'results are announced')
  for (const k of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Enter']) ok(new RegExp(`${k}:\\s*[(a-zA-Z]`).test(ui), `the line answers the ${k} key`)
  ok(/Enter: doCheck/.test(ui) && /' ': doCheck/.test(ui), 'Enter and Space check the answer')
  ok(/nunada\.numberline\.best\./.test(ui), 'the best result is kept')
  const pkg = JSON.parse(read('package.json'))
  ok(pkg.scripts['check:numberline'] === 'node tools/check-numberline.mjs', 'package.json runs this checker')
  ok(/npm run check:numberline/.test(read('.github/workflows/deploy.yml')), 'CI runs this checker')
  const css = read('src/styles.css')
  ok(/\.nlfield\b/.test(css) && /\.nlpin\.mark\b/.test(css) && /\.nlpin\.target\b/.test(css), 'the styles exist')
  // the colors are the site's own tokens, so the dark themes need nothing more
  const nlCss = css.slice(css.indexOf('/* Number Line:'))
  ok(!/#[0-9a-fA-F]{3,6}\b/.test(nlCss) && !/\brgb\(/.test(nlCss), 'the Number Line styles use color tokens only')
}

console.log(`number line check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
