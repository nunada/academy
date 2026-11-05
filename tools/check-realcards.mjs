/** Checks src/lib/realcards.ts, the engine of the Real Number Match game, against a reader that does not use it.
 *
 *   - the TeX shown on every card, in English and in Indonesian, is read back by a small parser written here (in Python, over SymPy) and must be equal,
 *     exactly, to the number the card is meant to show; the two languages must differ only in the decimal mark;
 *   - the numbers of each level are all different from one another (exactly, and numerically as a second opinion), and each has at least two forms;
 *   - a deck has `PAIRS[level]` numbers, each on exactly two cards written differently, no two numbers equal; the engine's idea of "these two match"
 *     agrees with SymPy's for every pair of cards of every deck;
 *   - the game, as a state machine: a perfect player finishes with no mistake, a random player finishes with the counts adding up, a wrong pair has to
 *     be turned back, cards found or already picked do nothing, and the stars do not go up with the mistakes.
 *
 *  Random inputs come from a seeded generator, so a failure repeats; REALCARDS_FAST=1 runs a smaller set (for the mutation tests).
 *  Run: npm run check:realcards   Needs Python with sympy.   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.REALCARDS_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'realcards-'))
const out = path.join(tmp, 'realcards.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/realcards.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const G = await import(pathToFileURL(out).href)
const bundleOf = async (entry, name) => {
  const file = path.join(tmp, name)
  await build({ entryPoints: [path.join(ROOT, entry)], bundle: true, format: 'esm', platform: 'node', outfile: file, logLevel: 'error' })
  return import(pathToFileURL(file).href)
}
const TEX = await bundleOf('src/lib/tex.ts', 'tex.mjs')
const SPEECH = await bundleOf('src/lib/texspeech.ts', 'speech.mjs')
const GAMES = await bundleOf('src/content/games.ts', 'games.mjs')

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
const ratStr = (r) => `${r.n}/${r.d}`

/* ------------------------------------------------------------ what goes to the Python side */

const entries = []
for (const level of LEVELS)
  for (const e of G.entriesOf(level)) {
    entries.push({
      level,
      id: e.id,
      a: ratStr(e.value.a),
      b: ratStr(e.value.b),
      m: String(e.value.m),
      reps: G.repsOf(e, level).map((s) => ({ en: G.texOf(s, 'en'), id: G.texOf(s, 'id'), family: G.familyOf(s) })),
    })
  }

const nDecks = FAST ? 25 : 160
const decks = []
for (const level of LEVELS)
  for (let i = 0; i < nDecks; i++) {
    const seed = 1000 * level + i * 7919 + 13
    const cards = G.buildDeck(level, seed)
    const match = cards.map((c) => cards.map((d) => G.cardsMatch(c.spec, d.spec)))
    decks.push({ level, seed, cards: cards.map((c) => ({ key: c.key, en: G.texOf(c.spec, 'en'), id: G.texOf(c.spec, 'id'), family: c.family })), match })
  }

/* --------------------------------------------------------------------- Python reference */

const PY = String.raw`
import sys, json, re
import sympy as sp

data = json.load(open(sys.argv[1], encoding='utf-8'))

TOKEN = re.compile(r'\s*(?:(?P<num>\d+(?:(?:\{,\}|\.)\d*(?:\\overline\{\d+\})?)?)|(?P<cmd>\\frac|\\tfrac|\\sqrt|\\times|\\cdot|\\%)|(?P<sym>[{}()\[\]^\-]))')

def tokenize(s):
    out = []
    i = 0
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m or m.end() == i:
            raise ValueError('cannot read %r at %d' % (s, i))
        out.append(('num', m.group('num')) if m.group('num') is not None else ('cmd', m.group('cmd')) if m.group('cmd') else ('sym', m.group('sym')))
        i = m.end()
    return out

class P:
    def __init__(self, toks):
        self.t = toks
        self.i = 0
    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else (None, None)
    def eat(self, kind=None, val=None):
        tok = self.peek()
        if tok[0] is None or (kind and tok[0] != kind) or (val and tok[1] != val):
            raise ValueError('expected %s %s, got %s' % (kind, val, tok))
        self.i += 1
        return tok
    def expr(self):
        neg = False
        if self.peek() == ('sym', '-'):
            self.eat()
            neg = True
        v = self.product()
        return -v if neg else v
    def product(self):
        v = self.factor()
        while True:
            tok = self.peek()
            if tok in (('cmd', '\\times'), ('cmd', '\\cdot')):
                self.eat()
                v = v * self.factor()
            elif tok == ('cmd', '\\sqrt'):
                v = v * self.factor()
            else:
                return v
    def factor(self):
        v = self.atom()
        if self.peek() == ('sym', '^'):
            self.eat()
            self.eat('sym', '{')
            e = self.expr()
            self.eat('sym', '}')
            v = v ** e
        return v
    def group(self):
        self.eat('sym', '{')
        v = self.expr()
        self.eat('sym', '}')
        return v
    def atom(self):
        kind, val = self.peek()
        if kind == 'num':
            self.eat()
            v = number(val)
            if self.peek() == ('cmd', '\\tfrac'):
                self.eat()
                a = self.group()
                b = self.group()
                v = v + a / b
            elif self.peek() == ('cmd', '\\%'):
                self.eat()
                v = v / 100
            return v
        if (kind, val) in (('cmd', '\\frac'), ('cmd', '\\tfrac')):
            self.eat()
            a = self.group()
            b = self.group()
            return a / b
        if (kind, val) == ('cmd', '\\sqrt'):
            self.eat()
            idx = 2
            if self.peek() == ('sym', '['):
                self.eat()
                idx = self.expr()
                self.eat('sym', ']')
            r = self.group()
            return sp.root(r, idx)
        if (kind, val) == ('sym', '('):
            self.eat()
            v = self.expr()
            self.eat('sym', ')')
            return v
        raise ValueError('unexpected %s' % ((kind, val),))

def number(tok):
    m = re.match(r'^(\d+)(?:(?:\{,\}|\.)(\d*)(?:\\overline\{(\d+)\})?)?$', tok)
    whole, pre, rep = m.group(1), m.group(2) or '', m.group(3)
    v = sp.Rational(int(whole))
    if pre:
        v += sp.Rational(int(pre), 10 ** len(pre))
    if rep:
        # 0.pre(rep) = pre/10^k + rep/(10^k (10^m - 1))
        k, mlen = len(pre), len(rep)
        v += sp.Rational(int(rep), 10 ** k * (10 ** mlen - 1))
    return v

def parse(s):
    p = P(tokenize(s))
    v = p.expr()
    if p.i != len(p.t):
        raise ValueError('left over in %r' % s)
    return sp.nsimplify(v) if False else v

cache = {}
canon_cache = {}
def val(s):
    if s not in cache:
        cache[s] = parse(s)
    return cache[s]

def canon(x):
    # the exact canonical form of a number of the shape a + b*sqrt(m): equal numbers give structurally equal expressions
    key = sp.srepr(x)
    if key not in canon_cache:
        canon_cache[key] = sp.simplify(sp.radsimp(sp.together(x)))
    return canon_cache[key]

def exact_equal(x, y):
    return canon(x) == canon(y)

num_cache = {}
def num(x):
    key = sp.srepr(x)
    if key not in num_cache:
        num_cache[key] = sp.N(x, 60)
    return num_cache[key]

def num_equal(x, y):
    return abs(num(x) - num(y)) < sp.Float('1e-45', 60)

def declared(e):
    return sp.Rational(e['a']) + sp.Rational(e['b']) * sp.sqrt(sp.Integer(int(e['m'])))

res = {'errors': [], 'entries': [], 'decks': []}

# every form of every number, in both languages
for e in data['entries']:
    want = declared(e)
    row = {'level': e['level'], 'id': e['id'], 'bad': [], 'same_mark': True}
    for r in e['reps']:
        try:
            ve, vi = val(r['en']), val(r['id'])
        except Exception as ex:
            row['bad'].append('cannot read %s: %s' % (r['en'], ex))
            continue
        if not (exact_equal(ve, want) and num_equal(ve, want)):
            row['bad'].append('%s is %s, not %s' % (r['en'], sp.N(ve, 12), sp.N(want, 12)))
        if r['id'].replace('{,}', '.') != r['en']:
            row['same_mark'] = False
        if not (exact_equal(vi, ve)):
            row['bad'].append('id and en differ for %s' % r['en'])
    res['entries'].append(row)

# the numbers of a level are all different
byLevel = {}
for e in data['entries']:
    byLevel.setdefault(e['level'], []).append(e)
res['distinct'] = []
for lv, es in byLevel.items():
    vals = [(e['id'], declared(e)) for e in es]
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if num_equal(vals[i][1], vals[j][1]) or exact_equal(vals[i][1], vals[j][1]):
                res['distinct'].append('level %s: %s equals %s' % (lv, vals[i][0], vals[j][0]))

# decks: every pair of cards, equal or not
for d in data['decks']:
    cards = d['cards']
    vs = [val(c['en']) for c in cards]
    cs = [canon(v) for v in vs]
    ns = [num(v) for v in vs]
    wrong = []
    n = len(cards)
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            same_key = cards[i]['key'] == cards[j]['key']
            eq = cs[i] == cs[j]
            if eq != (abs(ns[i] - ns[j]) < sp.Float('1e-45', 60)):
                wrong.append('exact and numeric comparison disagree for %s and %s' % (cards[i]['en'], cards[j]['en']))
            if same_key != eq:
                wrong.append('cards %d %d: keys %s, sympy equal %s (%s, %s)' % (i, j, same_key, eq, cards[i]['en'], cards[j]['en']))
            if bool(d['match'][i][j]) != eq:
                wrong.append('engine says match=%s for %s and %s, sympy says %s' % (d['match'][i][j], cards[i]['en'], cards[j]['en'], eq))
    res['decks'].append({'level': d['level'], 'seed': d['seed'], 'wrong': wrong[:5]})

json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`

const inFile = path.join(tmp, 'in.json')
const outFile = path.join(tmp, 'out.json')
const pyFile = path.join(tmp, 'ref.py')
fs.writeFileSync(pyFile, PY)
fs.writeFileSync(inFile, JSON.stringify({ entries, decks }), 'utf-8')
const py = spawnSync('python', [pyFile, inFile, outFile], { encoding: 'utf-8', maxBuffer: 1 << 28 })
if (py.status !== 0) {
  console.log('python reference failed:\n' + (py.stderr || py.stdout).split('\n').slice(-15).join('\n'))
  process.exit(1)
}
const R = JSON.parse(fs.readFileSync(outFile, 'utf8'))

/* ---------------------------------------------------------------------- the numbers and the cards */

// every card is drawn by the page's own renderer without a command it does not know (those come out as literal text with a backslash), and has a
// spoken form with no markup left in it, in both languages; the formulas in the game's page text too
{
  const drawn = (src) => TEX.tex(src).replace(/<[^>]*>/g, '')
  const said = (src, lang) => SPEECH.texSpeech(src, lang)
  const sources = []
  for (const e of entries) for (const r of e.reps) sources.push([r.en, 'en'], [r.id, 'id'])
  for (const g of GAMES.GAMES) {
    const texts = [g.answer, ...g.sections.map((s) => s.text), ...g.faq.map((f) => f.a)]
    for (const t of texts) for (const lang of ['en', 'id']) for (const m of t[lang].matchAll(/\$([^$]+)\$/g)) sources.push([m[1], lang])
  }
  for (const [src, lang] of sources) {
    const text = drawn(src)
    ok(!/[\\{}]/.test(text), `the renderer left markup in ${src}: ${text}`)
    const words = said(src, lang)
    ok(words.trim().length > 0 && !/[\\{}^_$&#]/.test(words), `spoken form of ${src} (${lang}) is "${words}"`)
  }
  ok(sources.length > 1000, `only ${sources.length} formulas were checked`)
}

for (const row of R.entries) {
  ok(row.bad.length === 0, `level ${row.level} number ${row.id}: ${row.bad.join('; ')}`)
  ok(row.same_mark, `level ${row.level} number ${row.id}: the Indonesian card differs from the English one in more than the decimal mark`)
}
ok(R.distinct.length === 0, R.distinct.join('; '))
for (const e of entries) ok(e.reps.length >= 2, `level ${e.level} number ${e.id} has fewer than two forms`)
for (const level of LEVELS) {
  ok(G.entriesOf(level).length >= 2 * G.PAIRS[level], `level ${level} has only ${G.entriesOf(level).length} numbers, for ${G.PAIRS[level]} pairs`)
  const families = new Set(entries.filter((e) => e.level === level).flatMap((e) => e.reps.map((r) => r.family)))
  for (const f of G.ALLOWED[level]) ok(families.has(f), `level ${level} never shows the form "${f}"`)
  for (const f of families) ok(G.ALLOWED[level].includes(f), `level ${level} shows "${f}", which it should not`)
}
// each level has its own forms: radicals only at level 3, repeating decimals, powers and scientific notation from level 2
ok(!entries.some((e) => e.level === 1 && e.reps.some((r) => /overline|sqrt|\^|times/.test(r.en))), 'level 1 shows a repeating decimal, a root, a power or scientific notation')
ok(!entries.some((e) => e.level === 2 && e.reps.some((r) => /sqrt/.test(r.en))), 'level 2 shows a root')

for (const d of R.decks) ok(d.wrong.length === 0, `deck level ${d.level} seed ${d.seed}: ${d.wrong.join('; ')}`)
for (const d of decks) {
  const where = `deck level ${d.level} seed ${d.seed}`
  const pairs = G.PAIRS[d.level]
  ok(d.cards.length === 2 * pairs, `${where}: ${d.cards.length} cards, not ${2 * pairs}`)
  const count = new Map()
  for (const c of d.cards) count.set(c.key, (count.get(c.key) ?? 0) + 1)
  ok(count.size === pairs && [...count.values()].every((n) => n === 2), `${where}: every number must be on exactly two cards`)
  ok(new Set(d.cards.map((c) => c.en)).size === d.cards.length, `${where}: two cards show the same thing`)
  const sameForm = [...count.keys()].filter((k) => d.cards.filter((c) => c.key === k).every((c, _, a) => c.en === a[0].en))
  ok(sameForm.length === 0, `${where}: a pair is written the same way twice`)
  for (const c of d.cards) ok(G.ALLOWED[d.level].includes(c.family), `${where}: a card in the form "${c.family}"`)
  // every card has exactly one partner
  d.match.forEach((row, i) => ok(row.filter(Boolean).length === 2 && row[i], `${where}: card ${i} matches ${row.filter(Boolean).length - 1} others`))
}
ok(G.PAIRS[1] === 6 && G.PAIRS[2] === 8 && G.PAIRS[3] === 10, 'the decks hold 6, 8 and 10 pairs')
// reproducible, and different seeds give different decks
{
  const a = G.buildDeck(2, 99).map((c) => c.key + c.spec.k)
  const b = G.buildDeck(2, 99).map((c) => c.key + c.spec.k)
  ok(JSON.stringify(a) === JSON.stringify(b), 'the same seed must give the same deck')
  const differ = new Set(Array.from({ length: 30 }, (_, i) => G.buildDeck(1, i).map((c) => c.key).join(',')))
  ok(differ.size > 20, `only ${differ.size} different level-1 decks in 30 seeds`)
}

/* ----------------------------------------------------------------------------------- the game */

function rngs(seed) {
  return G.rng(seed)
}
const same = (a, b) => JSON.stringify(a, (_, v) => (typeof v === 'bigint' ? v.toString() : v)) === JSON.stringify(b, (_, v) => (typeof v === 'bigint' ? v.toString() : v))

function invariants(s, where) {
  ok(s.faceUp.length <= 2, `${where}: ${s.faceUp.length} cards face up`)
  ok(!s.miss || (s.faceUp.length === 2 && !G.cardsMatch(s.cards[s.faceUp[0]].spec, s.cards[s.faceUp[1]].spec)), `${where}: miss flag without a wrong pair`)
  ok(s.faceUp.every((i) => !s.matched[i]), `${where}: a found card is face up`)
  ok(s.mistakes === s.moves - s.found.length, `${where}: moves ${s.moves}, found ${s.found.length}, mistakes ${s.mistakes}`)
  ok(s.matched.filter(Boolean).length === 2 * s.found.length, `${where}: found pairs and flags disagree`)
  ok(s.found.every(([a, b]) => s.cards[a].key === s.cards[b].key && a !== b), `${where}: a found pair that is not a pair`)
}

const games = FAST ? 20 : 120
for (let g = 0; g < games; g++) {
  const level = LEVELS[g % 3]
  const mode = g % 2 === 0 ? 'open' : 'memory'
  const seed = 5000 + g
  const where = `game level ${level} ${mode} seed ${seed}`
  const pairs = G.PAIRS[level]

  // a perfect player
  let s = G.newGame(level, mode, seed)
  for (const [i, j] of G.buildDeck(level, seed).flatMap((c, i, deck) => (deck.findIndex((d, k) => k > i && d.key === c.key) > i ? [[i, deck.findIndex((d, k) => k > i && d.key === c.key)]] : []))) {
    s = G.pick(s, i)
    invariants(s, where)
    s = G.pick(s, j)
    invariants(s, where)
  }
  ok(G.isDone(s) && s.mistakes === 0 && s.moves === pairs && s.found.length === pairs, `${where}: a perfect player should finish in ${pairs} moves with no mistake, got moves ${s.moves}, mistakes ${s.mistakes}`)
  ok(G.stars(s.mistakes, pairs, mode) === 3, `${where}: a perfect game earns three stars`)

  // a random player
  s = G.newGame(level, mode, seed)
  const rand = rngs(seed * 31 + 7)
  let steps = 0
  while (!G.isDone(s) && steps++ < 20000) {
    const i = Math.floor(rand() * s.cards.length)
    const before = s
    const after = G.pick(s, i)
    // picking a found card or the card already picked changes nothing (after a wrong pair is turned back)
    const settled = G.settle(before)
    if (settled.matched[i] || settled.faceUp.includes(i)) ok(same(after, settled), `${where}: picking card ${i} (found or already up) changed the game`)
    s = after
    invariants(s, where)
    // the memory game shows only turned or found cards, the open game shows all
    for (let k = 0; k < s.cards.length; k++) ok(G.isShown(s, k) === (mode === 'open' || s.matched[k] || s.faceUp.includes(k)), `${where}: isShown for card ${k}`)
  }
  ok(G.isDone(s), `${where}: a random player did not finish in ${steps} picks`)
  ok(s.found.length === pairs && s.moves >= pairs, `${where}: finished with ${s.found.length} pairs found`)

  // a wrong pair stays up until the next pick, which turns it back first
  s = G.newGame(level, mode, seed)
  const deck = s.cards
  const a = 0
  const b = deck.findIndex((c, k) => k > 0 && c.key !== deck[0].key)
  s = G.pick(G.pick(s, a), b)
  ok(s.miss && s.faceUp.length === 2 && s.mistakes === 1 && s.moves === 1, `${where}: a wrong pair should be showing`)
  const c = deck.findIndex((x, k) => k !== a && k !== b)
  const t = G.pick(s, c)
  ok(!t.miss && t.faceUp.length === 1 && t.faceUp[0] === c && t.mistakes === 1, `${where}: picking while a wrong pair shows turns it back and picks`)
  ok(same(G.settle(s), { ...s, faceUp: [], miss: false }), `${where}: settle turns a wrong pair back`)
  ok(G.settle(t) === t, `${where}: settle without a wrong pair changes nothing`)
  // out-of-range picks do nothing
  ok(same(G.pick(t, -1), t) && same(G.pick(t, 999), t), `${where}: a pick off the board changes the game`)
}

// the stars never go up as the mistakes go up, and stay between one and three
for (const mode of ['open', 'memory'])
  for (const pairs of [6, 8, 10]) {
    let last = 3
    for (let m = 0; m <= 40; m++) {
      const st = G.stars(m, pairs, mode)
      ok(st >= 1 && st <= 3 && st <= last, `stars(${m}, ${pairs}, ${mode}) = ${st} after ${last}`)
      last = st
    }
    ok(G.stars(0, pairs, mode) === 3, `no mistakes should always earn three stars (${mode}, ${pairs})`)
    ok(G.stars(40, pairs, mode) === 1, `many mistakes should earn one star (${mode}, ${pairs})`)
  }
ok(G.stars(7, 6, 'open') === 1 && G.stars(2, 6, 'open') === 2 && G.stars(3, 6, 'open') === 1, 'open game thresholds at six pairs')
ok(G.stars(3, 6, 'memory') === 3 && G.stars(4, 6, 'memory') === 2 && G.stars(7, 6, 'memory') === 1, 'memory game thresholds at six pairs')

// a few exact judgements the whole game rests on
{
  const frac = (n, d) => ({ k: 'frac', n: BigInt(n), d: BigInt(d) })
  const dec = (whole, frac) => ({ k: 'dec', neg: false, whole, frac })
  const rep = (whole, pre, r) => ({ k: 'rep', neg: false, whole, pre, rep: r })
  ok(G.cardsMatch(frac(1, 3), rep('0', '', '3')), '1/3 = 0.333…')
  ok(!G.cardsMatch(frac(1, 3), dec('0', '33')), '1/3 is not 0.33')
  ok(G.cardsMatch(frac(1, 1), rep('0', '', '9')), '1 = 0.999…')
  ok(G.cardsMatch(frac(1, 2), rep('0', '4', '9')), '1/2 = 0.4999…')
  ok(!G.cardsMatch(frac(1, 7), dec('0', '142857')), '1/7 is not 0.142857')
  ok(G.cardsMatch({ k: 'coef', c: { n: 2n, d: 1n }, m: 2n }, { k: 'root', index: 2, r: { n: 8n, d: 1n } }), '2√2 = √8')
  ok(!G.cardsMatch({ k: 'coef', c: { n: -2n, d: 1n }, m: 2n }, { k: 'root', index: 2, r: { n: 8n, d: 1n } }), '−2√2 is not √8')
  ok(G.cardsMatch({ k: 'root', index: 2, r: { n: 8n, d: 1n }, neg: true }, { k: 'coef', c: { n: -2n, d: 1n }, m: 2n }), '−√8 = −2√2')
  ok(G.cardsMatch({ k: 'pow', base: { n: 8n, d: 1n }, p: 2, q: 3 }, frac(4, 1)), '8^(2/3) = 4')
  ok(G.cardsMatch({ k: 'pow', base: { n: 4n, d: 1n }, p: -1, q: 2 }, frac(1, 2)), '4^(−1/2) = 1/2')
  ok(!G.cardsMatch({ k: 'pow', base: { n: 4n, d: 9n }, p: -1, q: 2 }, frac(9, 4)), '(4/9)^(−1/2) = 3/2, not 9/4')
  ok(G.cardsMatch({ k: 'sci', neg: false, mant: '2.5', exp: -3 }, dec('0', '0025')), '2.5 × 10^−3 = 0.0025')
  ok(G.cardsMatch({ k: 'pct', neg: false, whole: '62', frac: '5' }, frac(5, 8)), '62.5% = 5/8')
  ok(G.cardsMatch({ k: 'mixed', neg: true, w: 1n, n: 3n, d: 4n }, frac(-7, 4)), '−1¾ = −7/4')
  ok(G.cardsMatch({ k: 'inv', n: 6n, m: 3n }, { k: 'coef', c: { n: 2n, d: 1n }, m: 3n }), '6/√3 = 2√3')
  ok(G.cardsMatch({ k: 'prod', a: 3n, b: 12n }, frac(6, 1)), '√3·√12 = 6')
  ok(!G.cardsMatch({ k: 'coef', c: { n: 1n, d: 1n }, m: 2n }, { k: 'coef', c: { n: 1n, d: 1n }, m: 3n }), '√2 is not √3')
  ok(G.texOf(dec('0', '75'), 'en') === '0.75' && G.texOf(dec('0', '75'), 'id') === '0{,}75', 'decimal mark per language')
  ok(G.texOf({ k: 'rep', neg: true, whole: '0', pre: '1', rep: '6' }, 'id') === '-0{,}1\\overline{6}', 'a negative repeating decimal in Indonesian')
}

console.log(`realcards check: ${entries.length} numbers, ${decks.length} decks, ${games} games, ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
