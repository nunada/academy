/** The picture of each game: on its card, and (drawn into a 1200x630 card by tools/og-image.mjs) in the preview of a shared link.
 *
 *  Built like the covers of the articles (src/content/articles/covers.ts): a small SVG drawn from the game itself, as a string, whose colors are the classes of the
 *  figures (`sa`, `pb`, ...) so that it follows the light and dark theme. `sd`, `fd` and `pd` are the blue of the first player of the Houses. Text in a cover is
 *  numbers and symbols only, so it needs no translation.
 *
 *  Add a cover for a new game by adding its id to COVERS; a game without one gets the plain drawing at the end. */

const W = 400
const H = 200

const n1 = (x: number): string => String(Math.round(x * 10) / 10)
const line = (x1: number, y1: number, x2: number, y2: number, cls: string, w = 3, dash = ''): string =>
  `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
const poly = (pts: [number, number][], cls: string): string => `<polygon points="${pts.map(([x, y]) => `${n1(x)},${n1(y)}`).join(' ')}" class="${cls}"/>`
const rect = (x: number, y: number, w: number, h: number, cls: string, r = 6): string => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${r}" class="${cls}"/>`
const dot = (x: number, y: number, cls: string, r = 5): string => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" class="${cls}"/>`
const ellipse = (cx: number, cy: number, rx: number, ry: number, cls: string): string => `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry)}" class="${cls}" stroke-width="3"/>`
const path = (d: string, cls: string, w = 3, dash = ''): string => `<path d="${d}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
const text = (x: number, y: number, s: string, size = 18, cls = '', anchor = 'middle'): string =>
  `<text x="${n1(x)}" y="${n1(y)}" font-size="${size}" text-anchor="${anchor}" class="${cls}">${s}</text>`

/** A fraction, drawn: the numerator over a bar over the denominator, centred on x. */
function fraction(x: number, y: number, a: string, b: string, size: number): string {
  const w = size * 0.8
  return text(x, y - size * 0.18, a, size) + line(x - w / 2, y, x + w / 2, y, 'st', 2.4) + text(x, y + size * 0.82, b, size)
}

/** Three cards that name the same number: 1/2, 2/4 and 50 % (no decimal point: a cover is the same in both languages, and Indonesian writes a comma). */
function realNumberMatch(): string {
  const cards: [number, string][] = [[34, 'pa'], [150, 'pc'], [266, 'pb']]
  let s = ''
  for (const [x, cls] of cards) s += rect(x, 30, 100, 124, cls, 12)
  s += fraction(84, 100, '1', '2', 40)
  s += fraction(200, 100, '2', '4', 40)
  s += text(316, 106, '50%', 38)
  s += path('M84,170 Q200,206 316,170', 'sr', 4)
  s += dot(84, 170, 'fr', 6) + dot(316, 170, 'fr', 6)
  return s
}

const fish = (cx: number, cy: number, rx: number, ry: number, body: string, label: string, size: number): string =>
  ellipse(cx, cy, rx, ry, body) +
  poly([[cx - rx + 6, cy], [cx - rx - ry * 0.9, cy - ry * 0.85], [cx - rx - ry * 0.9, cy + ry * 0.85]], body) +
  dot(cx + rx * 0.62, cy - ry * 0.28, 'fa', ry * 0.1 + 2) +
  text(cx - rx * 0.06, cy + size * 0.34, label, size)

/** A big fish with π, and a small one with -2 swimming in front of it. */
function numberFish(): string {
  let s = ''
  s += dot(60, 40, 'sm', 5) + dot(82, 24, 'sm', 3.5) + dot(40, 66, 'sm', 3) + dot(352, 160, 'sm', 4)
  s += fish(188, 112, 84, 52, 'pb', 'π', 46)
  s += fish(336, 56, 40, 25, 'pc', '-2', 22)
  s += path('M286,88 q16,-8 30,-22', 'sr', 3.5, '2 7')
  return s
}

/** Blocks of code on the left and the path of a robot through a maze on the right. */
function codeMaze(): string {
  let s = ''
  s += rect(26, 34, 120, 28, 'pc', 8) + text(86, 54, 'move', 16)
  s += rect(26, 70, 120, 28, 'pa', 8) + text(86, 90, 'turn', 16)
  s += rect(26, 106, 120, 28, 'pb', 8) + text(86, 126, 'repeat', 16)
  s += rect(46, 142, 100, 28, 'pc', 8) + text(96, 162, 'move', 16)
  for (let x = 190; x <= 370; x += 36) for (let y = 30; y <= 174; y += 36) s += dot(x, y, 'fm', 2.4)
  s += path('M190,174 L190,102 L262,102 L262,30 L328,30 L328,138 L350,138', 'sr', 6)
  s += dot(190, 174, 'fb', 10)
  s += rect(181, 168, 18, 12, 'fb', 3)
  s += poly([[350, 126], [350, 150], [372, 138]], 'fc') + line(350, 120, 350, 156, 'sc', 3)
  return s
}

/** A number line with a marker on 3/4. */
function numberLine(): string {
  let s = line(26, 118, 374, 118, 'st', 4)
  const xs = [58, 138, 218, 298]
  const labels = ['-1', '0', '1', '2']
  xs.forEach((x, i) => {
    s += line(x, 104, x, 132, 'st', 3.5) + text(x, 162, labels[i], 22)
    for (let k = 1; k < 4; k++) s += line(x + (80 * k) / 4, 111, x + (80 * k) / 4, 125, 'sm', 2.4)
  })
  const px = 138 + 60
  s += poly([[px, 112], [px - 14, 80], [px + 14, 80]], 'fb') + line(px, 80, px, 60, 'sb', 3)
  s += fraction(px, 34, '3', '4', 24)
  s += text(352, 104, '...', 20, 'tm')
  return s
}

/** A chain of dominoes whose halves are calculations. */
function mathDomino(): string {
  const tile = (x: number, y: number, a: string, b: string, cls: string): string =>
    rect(x, y, 170, 64, cls, 10) + line(x + 85, y + 8, x + 85, y + 56, 'sm', 2.4) + text(x + 42, y + 41, a, 25) + text(x + 128, y + 41, b, 25)
  let s = ''
  s += tile(20, 24, '3+4', '7', 'pa')
  s += tile(190, 24, '10-3', '2x4', 'pc')
  s += tile(106, 112, '8', '5+3', 'pb')
  s += line(190, 32, 190, 80, 'sr', 5)
  s += path('M276,92 q4,12 -4,20', 'sr', 4, '2 6')
  return s
}

/** The nine-by-nine board of a House, with four in a row, and the sum or the product of the two pawns. */
function house(op: 'times' | 'plus'): string {
  let s = ''
  const c = 22
  const x0 = 28
  const y0 = 26
  const cells: Record<string, string> = { '1,1': 'pd', '2,2': 'pd', '3,3': 'pd', '4,4': 'pd', '0,3': 'pc', '3,1': 'pc', '2,4': 'pc', '4,0': 'pc', '1,4': 'pc' }
  for (let r = 0; r < 5; r++)
    for (let k = 0; k < 5; k++) s += rect(x0 + k * (c + 3), y0 + r * (c + 3), c, c, cells[`${r},${k}`] ?? 'pm', 4)
  s += poly([[214, 94], [292, 38], [370, 94]], 'pb')
  s += rect(228, 94, 128, 80, 'pa', 6)
  s += text(292, 140, op === 'times' ? '3 x 4' : '3 + 4', 30)
  s += text(292, 166, op === 'times' ? '= 12' : '= 7', 22)
  s += dot(238, 56, 'fd', 10) + dot(262, 56, 'fc', 8)
  return s
}

/** A corridor of a maze: the number 3 goes through +3 (blue, never runs out), a gate that wants at least 6 (green) and ×2 (gold, used up once) to the exit, 12. */
function numberMaze(): string {
  const c = 56
  const gap = 10
  const x0 = 34
  const y0 = 72
  const xAt = (i: number): number => x0 + i * (c + gap)
  let s = ''
  // walls above and below, so that it reads as a maze
  for (let k = 0; k < 8; k++) {
    s += rect(xAt(0) - 6 + k * 46, 14, 40, 40, 'pm', 8)
    s += rect(xAt(0) - 6 + k * 46, 146, 40, 40, 'pm', 8)
  }
  const cells: [number, string, string][] = [
    [0, 'pm', ''],
    [1, 'pd', '+3'],
    [2, 'pa', '≥6'],
    [3, 'pc', '×2'],
    [4, 'pr', '12'],
  ]
  for (const [i, cls, label] of cells) {
    s += rect(xAt(i), y0, c, c, cls, 10)
    if (label) s += text(xAt(i) + c / 2, y0 + c / 2 + 8, label, 24)
  }
  s += dot(xAt(0) + c / 2, y0 + c / 2, 'pa', 20) + text(xAt(0) + c / 2, y0 + c / 2 + 8, '3', 24)
  s += line(xAt(4) + c - 12, y0 - 24, xAt(4) + c - 12, y0 + 2, 'sb', 3) + poly([[xAt(4) + c - 12, y0 - 24], [xAt(4) + c - 12, y0 - 8], [xAt(4) + c + 8, y0 - 16]], 'fb')
  return s
}

/** A small Nurikabe, a real one with one answer: the sea is blue and runs between the islands; the islands carry their numbers (a 2, a 1 and a 3, and a 1). */
function nurikabe(): string {
  const c = 40
  const gap = 5
  const x0 = 113
  const y0 = 36
  // '#' sea, a digit an island with its number, '.' land that belongs to an island
  const rows = ['2.#1', '####', '3..#']
  let s = ''
  rows.forEach((row, r) => {
    for (let k = 0; k < 4; k++) {
      const ch = row[k]
      const x = x0 + k * (c + gap)
      const y = y0 + r * (c + gap)
      if (ch === '#') s += rect(x, y, c, c, 'pb', 5)
      else {
        s += rect(x, y, c, c, 'pm', 5)
        if (/\d/.test(ch)) s += text(x + c / 2, y + c / 2 + 9, ch, 26)
      }
    }
  })
  return s
}

/** Four islands joined by bridges, a real Hashi with one answer: 3 and 3 on top (a double bridge between them), 2 and 2 below, single bridges down and across. */
function hashi(): string {
  const at: [number, number, string][] = [[100, 50, '3'], [300, 50, '3'], [100, 150, '2'], [300, 150, '2']]
  let s = ''
  s += line(126, 44, 274, 44, 'st', 4) + line(126, 56, 274, 56, 'st', 4)
  s += line(100, 76, 100, 124, 'st', 4) + line(300, 76, 300, 124, 'st', 4) + line(126, 150, 274, 150, 'st', 4)
  for (const [x, y, n] of at) s += dot(x, y, 'pc', 26) + text(x, y + 10, n, 30)
  return s
}

/** A 4x4 Tic-Tac-Logic, a full grid that keeps the rules: X in blue, O in gold, no three of a kind in a row. */
function ticTacLogic(): string {
  const c = 40
  const gap = 5
  const x0 = 112
  const y0 = 12
  const rows = ['XXOO', 'OXOX', 'XOXO', 'OOXX']
  let s = ''
  rows.forEach((row, r) => {
    for (let k = 0; k < 4; k++) {
      const x = x0 + k * (c + gap)
      const y = y0 + r * (c + gap)
      s += rect(x, y, c, c, 'pm', 6)
      const mx = x + c / 2
      const my = y + c / 2
      if (row[k] === 'X') s += line(mx - 11, my - 11, mx + 11, my + 11, 'sd', 5) + line(mx - 11, my + 11, mx + 11, my - 11, 'sd', 5)
      else s += ellipse(mx, my, 12, 12, 'sc')
    }
  })
  return s
}

const generic = (): string => rect(120, 50, 160, 100, 'pa', 14) + text(200, 118, '?', 52)

const COVERS: Record<string, () => string> = {
  'real-number-match': realNumberMatch,
  'number-fish': numberFish,
  'code-maze': codeMaze,
  'number-line': numberLine,
  'math-domino': mathDomino,
  'multiplication-house': () => house('times'),
  'addition-house': () => house('plus'),
  'number-maze': numberMaze,
  nurikabe,
  hashi,
  'tic-tac-logic': ticTacLogic,
}

/** The whole `<svg>` of a game's cover, as markup. Decorative: the card already carries the title. */
export function gameCoverSvg(id: string): string {
  const art = (COVERS[id] ?? generic)()
  return `<svg class="cv" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" class="bg"/>${art}</svg>`
}
export const COVER_IDS = Object.keys(COVERS)
