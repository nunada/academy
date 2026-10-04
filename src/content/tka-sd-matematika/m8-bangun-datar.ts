import type { Loc, MathBlank, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import { fit, gridRect, line, txt } from './figs'

/** Module 8 — flat shapes: the kinds of triangles, quadrilaterals and polygons,
 *  symmetry, then perimeter (the way round) and area (the surface covered). */

const L = (en: string, id: string): Loc => ({ en, id })

/* ---------------------------------------------------------------- drawing helpers */

const r3 = (n: number) => Number(n.toFixed(3))
const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

/** A regular polygon with `n` corners, anticlockwise from the angle `start`. */
const reg = (n: number, r: number, cx = 0, cy = 0, start = 90): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 * i) / n) * Math.PI) / 180
    return [r3(cx + r * Math.cos(a)), r3(cy + r * Math.sin(a))] as Pt
  })

/** Outward unit normal of the edge a -> b of an anticlockwise polygon. */
const normal = (a: Pt, b: Pt): Pt => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  return [dy / len, -dx / len]
}

/** `n` short ticks across the edge a -> b (equal sides), centred `at` of the way along. */
function ticks(a: Pt, b: Pt, n: number, at = 0.5): FigItem[] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const out: FigItem[] = []
  for (let k = 0; k < n; k++) {
    const o = (k - (n - 1) / 2) * 0.3
    const p: Pt = [a[0] + dx * at + ux * o, a[1] + dy * at + uy * o]
    out.push(line([p[0] - uy * 0.25, p[1] + ux * 0.25], [p[0] + uy * 0.25, p[1] - ux * 0.25], 'result', { width: 3 }))
  }
  return out
}

/** `n` little arrowheads along the edge a -> b (parallel sides). All parallel edges point the same way. */
function chevrons(a: Pt, b: Pt, n: number, at = 0.5): FigItem[] {
  let dx = b[0] - a[0]
  let dy = b[1] - a[1]
  const c: Pt = [a[0] + dx * at, a[1] + dy * at]
  if (dx < -1e-9 || (Math.abs(dx) < 1e-9 && dy < 0)) {
    dx = -dx
    dy = -dy
  }
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const out: FigItem[] = []
  for (let k = 0; k < n; k++) {
    const o = (k - (n - 1) / 2) * 0.34
    const tip: Pt = [c[0] + ux * (o + 0.15), c[1] + uy * (o + 0.15)]
    const back: Pt = [tip[0] - ux * 0.32, tip[1] - uy * 0.32]
    out.push(line(tip, [back[0] - uy * 0.24, back[1] + ux * 0.24], 'b', { width: 3 }))
    out.push(line(tip, [back[0] + uy * 0.24, back[1] - ux * 0.24], 'b', { width: 3 }))
  }
  return out
}

interface Part {
  pts: Pt[]
  color?: FigColor
  look?: 'solid' | 'outline'
  /** One letter per corner, written just outside it. */
  names?: string
  /** `sides[i]` is written beside the edge pts[i] -> pts[i+1]. */
  sides?: (string | undefined)[]
  /** Corners that get a square-corner mark. */
  rights?: number[]
  /** [edge, how many ticks]: equal sides. */
  eq?: [number, number][]
  /** [edge, how many arrowheads]: parallel sides. */
  par?: [number, number][]
}

/** Any number of polygons (anticlockwise corners) in one picture, with names,
 *  side labels, right-angle marks, equal-side ticks and parallel arrowheads.
 *  `extra` items are drawn on top, in the same coordinates. */
function scene(parts: Part[], extra: FigItem[] = [], pad = 1): Piece {
  const items: FigItem[] = []
  const all: Pt[] = []
  const label = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end', color: FigColor = 'muted') => {
    items.push(txt(x, y, text, 'md', color, anchor))
    const w = text.length * 0.36
    all.push([x, y], [anchor === 'start' ? x + w : anchor === 'end' ? x - w : x - w / 2, y], [anchor === 'middle' ? x + w / 2 : x, y])
  }
  for (const p of parts) {
    const n = p.pts.length
    items.push({ t: 'poly', pts: p.pts, color: p.color ?? 'a', look: p.look })
    all.push(...p.pts)
    for (const i of p.rights ?? []) items.push({ t: 'right', at: p.pts[i], from: p.pts[(i + n - 1) % n], to: p.pts[(i + 1) % n] })
    const hasEq = (i: number) => (p.eq ?? []).some((e) => e[0] === i)
    const hasPar = (i: number) => (p.par ?? []).some((e) => e[0] === i)
    for (const [i, k] of p.par ?? []) items.push(...chevrons(p.pts[i], p.pts[(i + 1) % n], k, hasEq(i) ? 0.27 : 0.5))
    for (const [i, k] of p.eq ?? []) items.push(...ticks(p.pts[i], p.pts[(i + 1) % n], k, hasPar(i) ? 0.7 : 0.5))
    if (p.names) {
      for (let i = 0; i < n; i++) {
        const n1 = normal(p.pts[(i + n - 1) % n], p.pts[i])
        const n2 = normal(p.pts[i], p.pts[(i + 1) % n])
        let vx = n1[0] + n2[0]
        let vy = n1[1] + n2[1]
        const len = Math.hypot(vx, vy)
        if (len < 1e-6) [vx, vy] = n1
        else [vx, vy] = [vx / len, vy / len]
        const q: Pt = [p.pts[i][0] + vx * 0.7, p.pts[i][1] + vy * 0.7]
        items.push(txt(q[0], q[1], p.names[i] ?? '', 'lg', 'result'))
        all.push(q)
      }
    }
    ;(p.sides ?? []).forEach((s, i) => {
      if (!s) return
      const a = p.pts[i]
      const b = p.pts[(i + 1) % n]
      const m = mid(a, b)
      const [nx, ny] = normal(a, b)
      const d = 0.3 + 0.4 * Math.abs(ny)
      label(m[0] + nx * d, m[1] + ny * d, s, nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle')
    })
  }
  items.push(...extra)
  for (const e of extra) {
    if (e.t === 'text') all.push(e.at as Pt)
    if (e.t === 'seg') all.push(e.from as Pt, e.to as Pt)
  }
  return { dim: 2, axes: false, ...fit(all, pad), items }
}

/** A dashed line through a and b, stretched a little past both ends: a fold line, a helper, a height. */
function dash(a: Pt, b: Pt, color: FigColor = 'result', over = 0.35): FigItem {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  return line([r3(a[0] - (dx / len) * over), r3(a[1] - (dy / len) * over)], [r3(b[0] + (dx / len) * over), r3(b[1] + (dy / len) * over)], color, { dashed: true, width: 3 })
}

/** A dashed line from a to b exactly, no overshoot (a height, a side to be found). */
const helper = (a: Pt, b: Pt, color: FigColor = 'result'): FigItem => line(a, b, color, { dashed: true, width: 3 })

/** A dashed height from `apex` straight down to `foot`, with the square-corner mark
 *  (`along` is any other point on the base line) and its length written beside it. */
function height(apex: Pt, foot: Pt, along: Pt, label?: string): FigItem[] {
  const out: FigItem[] = [helper(apex, foot), { t: 'right', at: foot, from: along, to: apex }]
  if (label) out.push(txt((apex[0] + foot[0]) / 2 + 0.25, (apex[1] + foot[1]) / 2, label, 'md', 'muted', 'start'))
  return out
}

/** The unit-square grid with a heavy border, so the unit sides can be counted. */
function gridPerim(cols: number, rows: number, dims?: [string, string]): Piece {
  const g = gridRect({ cols, rows, dims })
  const border = [
    line([0, 0], [cols, 0], 'result', { width: 5 }),
    line([cols, 0], [cols, rows], 'result', { width: 5 }),
    line([cols, rows], [0, rows], 'result', { width: 5 }),
    line([0, rows], [0, 0], 'result', { width: 5 }),
  ]
  return { ...g, items: [...g.items, ...border] }
}

/* shared answer boxes */
const CM = '\\text{ cm}'
const M = '\\text{ m}'
const CM2 = '\\text{ cm}^2'
const M2 = '\\text{ m}^2'
const num = (answer: number, after?: MathBlank['after'], label?: MathBlank['label']): MathBlank => ({ answer, after, label })

/* ---------------------------------------------------------------------------- the module */

export const module8: Module = {
  id: 'tka-m8',
  title: { en: 'Flat Shapes', id: 'Bangun Datar' },
  summary: {
    en: 'Triangles, quadrilaterals and polygons: you will name them and spot what makes each one special, measure the way round (perimeter), and measure the surface they cover (area).',
    id: 'Segitiga, segiempat, dan segi banyak: kamu akan menamai dan mengenali ciri-cirinya, mengukur panjang sekelilingnya (keliling), dan mengukur permukaan yang ditutupinya (luas).',
  },
  submodules: [
    /* ================================================================== S1 kinds of flat shapes */
    {
      id: 'tka-m8-s1',
      title: { en: 'Kinds of Flat Shapes', id: 'Bentuk Bangun Datar' },
      summary: {
        en: 'Name triangles and quadrilaterals by their sides and corners, meet polygons with more sides, and find the lines of symmetry of a shape.',
        id: 'Menamai segitiga dan segiempat dari sisi dan sudutnya, mengenal segi banyak, dan mencari sumbu simetri sebuah bangun.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m8-s1-l1',
          title: { en: 'Triangles and Quadrilaterals', id: 'Segitiga dan Segiempat' },
          goal: {
            en: 'You can name a triangle or a quadrilateral from its sides and corners.',
            id: 'Kamu bisa menamai segitiga dan segiempat dari sisi dan sudutnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Triangles Around Us', 'Ayo Amati: Segitiga di Sekitar Kita'),
              body: L(
                `A slice of watermelon, a roof, a flag on a pole: all of them look like a **triangle**. A triangle has 3 straight sides and 3 corners.\n\nWe can name a triangle by looking at its sides:\n\n- **Equilateral triangle**: all 3 sides are equal.\n- **Isosceles triangle**: exactly 2 sides are equal.\n- **Scalene triangle**: no sides are equal.\n\nWe can also name it by looking at its biggest corner:\n\n- **Acute triangle**: every corner is smaller than a square corner.\n- **Right triangle**: one corner is a square corner (a right angle).\n- **Obtuse triangle**: one corner is wider than a square corner.`,
                `Irisan semangka, atap rumah, bendera di tiang: semuanya mirip **segitiga**. Segitiga punya 3 sisi lurus dan 3 sudut.\n\nKita bisa menamai segitiga dari sisinya:\n\n- **Segitiga sama sisi**: ketiga sisinya sama panjang.\n- **Segitiga sama kaki**: tepat 2 sisinya sama panjang.\n- **Segitiga sembarang**: tidak ada sisi yang sama panjang.\n\nKita juga bisa menamainya dari sudut terbesarnya:\n\n- **Segitiga lancip**: semua sudutnya lebih kecil daripada sudut siku-siku.\n- **Segitiga siku-siku**: satu sudutnya siku-siku (seperti sudut buku).\n- **Segitiga tumpul**: satu sudutnya lebih lebar daripada sudut siku-siku.`,
              ),
              figure: {
                ...scene([
                  { pts: [[0, 6], [5, 6], [2.5, 10.33]], eq: [[0, 1], [1, 1], [2, 1]] },
                  { pts: [[7.3, 6], [10.7, 6], [9, 10.8]], eq: [[1, 1], [2, 1]] },
                  { pts: [[13, 6], [18, 6], [13.8, 10]] },
                  { pts: [[0, 0], [5, 0], [3, 3.8]], color: 'b' },
                  { pts: [[6.5, 0], [11, 0], [6.5, 3.6]], color: 'b', rights: [0] },
                  { pts: [[13, 0], [18, 0], [12, 2.2]], color: 'b' },
                ]),
                caption: L(
                  'Top row: an equilateral, an isosceles and a scalene triangle (the red ticks mark equal sides). Bottom row: an acute, a right and an obtuse triangle.',
                  'Baris atas: segitiga sama sisi, sama kaki, dan sembarang (tanda merah menunjukkan sisi yang sama panjang). Baris bawah: segitiga lancip, siku-siku, dan tumpul.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Naming a Quadrilateral', 'Contoh Bertahap: Menamai Segiempat'),
              body: L(
                `A tile has 4 sides, all of them equal, and no square corners. What shape is it? Ask the questions one by one.\n\n1. Step 1: Count the sides. There are 4, so it is a **quadrilateral**.\n2. Step 2: Look for **parallel sides**: sides that never meet, like the two rails of a train track. Both pairs of opposite sides are parallel.\n3. Step 3: Are the sides equal? Yes, all 4 are equal.\n4. Step 4: Are there square corners? No. A square would have 4 of them, so the tile is a **rhombus**.\n\n**Remember:** use this table to name a quadrilateral.\n\n| Shape | Parallel sides | Equal sides | Square corners | Diagonals |\n| --- | --- | --- | --- | --- |\n| Square | 2 pairs | all 4 | 4 | equal, cross at a square corner |\n| Rectangle | 2 pairs | opposite sides | 4 | equal |\n| Parallelogram | 2 pairs | opposite sides | none | not equal |\n| Rhombus | 2 pairs | all 4 | none | not equal, cross at a square corner |\n| Kite | none | 2 pairs of neighbours | none | not equal, cross at a square corner |\n| Trapezoid | exactly 1 pair | not needed | usually none | not equal |`,
                `Sebuah ubin punya 4 sisi yang sama panjang dan tidak punya sudut siku-siku. Bentuk apakah itu? Tanyakan satu per satu.\n\n1. Langkah 1: Hitung sisinya. Ada 4, jadi ini **segiempat**.\n2. Langkah 2: Cari **sisi yang sejajar**: sisi yang tidak pernah bertemu, seperti dua rel kereta api. Kedua pasang sisi yang berhadapan sejajar.\n3. Langkah 3: Apakah sisinya sama panjang? Ya, keempatnya sama.\n4. Langkah 4: Adakah sudut siku-siku? Tidak. Persegi punya 4 sudut siku-siku, jadi ubin itu adalah **belah ketupat**.\n\n**Ingat:** pakai tabel ini untuk menamai segiempat.\n\n| Bangun | Sisi sejajar | Sisi sama panjang | Sudut siku-siku | Diagonal |\n| --- | --- | --- | --- | --- |\n| Persegi | 2 pasang | keempatnya | 4 | sama panjang, berpotongan siku-siku |\n| Persegi panjang | 2 pasang | sisi yang berhadapan | 4 | sama panjang |\n| Jajargenjang | 2 pasang | sisi yang berhadapan | tidak ada | tidak sama panjang |\n| Belah ketupat | 2 pasang | keempatnya | tidak ada | tidak sama panjang, berpotongan siku-siku |\n| Layang-layang | tidak ada | 2 pasang sisi bertetangga | tidak ada | tidak sama panjang, berpotongan siku-siku |\n| Trapesium | tepat 1 pasang | tidak harus | biasanya tidak ada | tidak sama panjang |`,
              ),
              figure: {
                ...scene([
                  { pts: [[0, 6], [4, 6], [4, 10], [0, 10]], rights: [0, 1, 2, 3], eq: [[0, 1], [1, 1], [2, 1], [3, 1]] },
                  { pts: [[7, 6.6], [12.6, 6.6], [12.6, 9.4], [7, 9.4]], rights: [0, 1, 2, 3], eq: [[0, 1], [2, 1], [1, 2], [3, 2]] },
                  { pts: [[14, 6], [18.5, 6], [20.5, 10], [16, 10]], par: [[0, 1], [2, 1], [1, 2], [3, 2]], eq: [[0, 1], [2, 1], [1, 2], [3, 2]] },
                  { pts: [[0, 2], [2.5, 0], [5, 2], [2.5, 4]], color: 'b', par: [[0, 1], [2, 1], [1, 2], [3, 2]], eq: [[0, 1], [1, 1], [2, 1], [3, 1]] },
                  { pts: [[9.5, 0], [11.5, 2.6], [9.5, 4.2], [7.5, 2.6]], color: 'b', eq: [[0, 1], [3, 1], [1, 2], [2, 2]] },
                  { pts: [[14, 0], [19, 0], [18, 3.6], [15.5, 3.6]], color: 'b', par: [[0, 1], [2, 1]] },
                ]),
                caption: L(
                  'Top row: a square, a rectangle and a parallelogram. Bottom row: a rhombus, a kite and a trapezoid. Red ticks mark equal sides, orange arrowheads mark parallel sides, small squares mark square corners.',
                  'Baris atas: persegi, persegi panjang, dan jajargenjang. Baris bawah: belah ketupat, layang-layang, dan trapesium. Tanda merah menunjukkan sisi yang sama panjang, anak panah oranye menunjukkan sisi sejajar, kotak kecil menunjukkan sudut siku-siku.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Special Shapes', 'Awas, Jebakan!: Bangun Istimewa'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| A square is not a rectangle, because a rectangle is long. | A square has 4 square corners and equal opposite sides, so it is a special rectangle. It is also a special rhombus. |\n| Every shape with 4 equal sides is a square. | A rhombus has 4 equal sides too. A square also needs 4 square corners. |\n| A trapezoid has two pairs of parallel sides. | A trapezoid has exactly 1 pair. Two pairs make a parallelogram. |`,
                `| Salah | Benar |\n| --- | --- |\n| Persegi bukan persegi panjang, karena persegi panjang itu panjang. | Persegi punya 4 sudut siku-siku dan sisi berhadapan sama panjang, jadi persegi adalah persegi panjang yang istimewa. Persegi juga belah ketupat yang istimewa. |\n| Semua bangun dengan 4 sisi sama panjang adalah persegi. | Belah ketupat juga punya 4 sisi sama panjang. Persegi masih harus punya 4 sudut siku-siku. |\n| Trapesium punya dua pasang sisi sejajar. | Trapesium punya tepat 1 pasang. Dua pasang sisi sejajar adalah jajargenjang. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Both pairs of opposite sides of this shape are parallel (orange arrowheads) and equal (red ticks), and its corners are not square corners. What shape is it?',
                'Kedua pasang sisi yang berhadapan pada bangun ini sejajar (anak panah oranye) dan sama panjang (tanda merah), dan sudutnya bukan siku-siku. Bangun apakah ini?',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [7, 0], [9, 4], [2, 4]], par: [[0, 1], [2, 1], [1, 2], [3, 2]], eq: [[0, 1], [2, 1], [1, 2], [3, 2]] }]),
                caption: L('A quadrilateral with marks on its sides.', 'Sebuah segiempat dengan tanda pada sisinya.'),
              },
              options: [
                L('Parallelogram', 'Jajargenjang'),
                L('Rectangle', 'Persegi panjang'),
                L('Rhombus', 'Belah ketupat'),
                L('Trapezoid', 'Trapesium'),
              ],
              answer: 0,
              explain: L(
                'Two pairs of parallel sides make a parallelogram. It is not a rectangle (no square corners), not a rhombus (the sides are not all equal) and not a trapezoid (a trapezoid has only 1 pair of parallel sides).',
                'Dua pasang sisi sejajar berarti jajargenjang. Bukan persegi panjang (tidak ada sudut siku-siku), bukan belah ketupat (sisinya tidak semuanya sama), dan bukan trapesium (trapesium hanya punya 1 pasang sisi sejajar).',
              ),
              hint: L(
                'Check the three clues one by one: parallel sides, equal sides, square corners. Which names do not fit a clue?',
                'Periksa tiga petunjuknya satu per satu: sisi sejajar, sisi sama panjang, sudut siku-siku. Nama mana yang tidak cocok dengan petunjuk?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: fill in the facts about the rhombus from the example.',
                'Coba bersama: isi fakta tentang belah ketupat pada contoh tadi.',
              ),
              figure: {
                ...scene([{ pts: [[0, 2], [2.5, 0], [5, 2], [2.5, 4]], color: 'b', par: [[0, 1], [2, 1], [1, 2], [3, 2]], eq: [[0, 1], [1, 1], [2, 1], [3, 1]] }]),
                caption: L('A rhombus: orange arrowheads show parallel sides, red ticks show equal sides.', 'Belah ketupat: anak panah oranye menunjukkan sisi sejajar, tanda merah menunjukkan sisi sama panjang.'),
              },
              template: {
                en: '\\text{equal sides: } ___ \\quad \\text{square corners: } ___ \\quad \\text{pairs of parallel sides: } ___',
                id: '\\text{sisi sama panjang: } ___ \\quad \\text{sudut siku-siku: } ___ \\quad \\text{pasang sisi sejajar: } ___',
              },
              blanks: ['4', '0', '2'],
              explain: L(
                'A rhombus has 4 equal sides, no square corners, and 2 pairs of parallel sides.',
                'Belah ketupat punya 4 sisi sama panjang, tidak punya sudut siku-siku, dan punya 2 pasang sisi sejajar.',
              ),
              hint: L(
                'Count the red ticks, then the little squares in the corners, then the pairs of orange arrowheads.',
                'Hitung tanda merahnya, lalu kotak kecil di sudutnya, lalu pasangan anak panah oranye.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Look at the triangle. Which two names fit it best?',
                'Perhatikan segitiga ini. Dua nama apa yang paling cocok untuknya?',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [7, 0], [3.5, 4.873]], eq: [[1, 1], [2, 1]], sides: ['7 cm', '6 cm', '6 cm'] }]),
                caption: L('A triangle with its sides in cm. The red ticks mark equal sides.', 'Sebuah segitiga dengan panjang sisinya dalam cm. Tanda merah menunjukkan sisi yang sama panjang.'),
              },
              options: [
                L('Isosceles and acute', 'Sama kaki dan lancip'),
                L('Equilateral and acute', 'Sama sisi dan lancip'),
                L('Scalene and right', 'Sembarang dan siku-siku'),
                L('Isosceles and obtuse', 'Sama kaki dan tumpul'),
              ],
              answer: 0,
              explain: L(
                'Two sides are 6 cm, so it is isosceles. The third side is 7 cm, so it is not equilateral. Every corner is smaller than a square corner, so it is acute.',
                'Dua sisinya 6 cm, jadi segitiga ini sama kaki. Sisi ketiganya 7 cm, jadi bukan sama sisi. Semua sudutnya lebih kecil daripada sudut siku-siku, jadi segitiga ini lancip.',
              ),
              hint: L(
                'Compare the three side lengths first. Then look at the corners: is there a square corner or a wide corner?',
                'Bandingkan dulu ketiga panjang sisinya. Lalu lihat sudutnya: adakah sudut siku-siku atau sudut yang lebar?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
              options: [
                L('A square is also a rectangle.', 'Persegi juga merupakan persegi panjang.'),
                L('A square is also a rhombus.', 'Persegi juga merupakan belah ketupat.'),
                L('A rhombus always has 4 square corners.', 'Belah ketupat selalu punya 4 sudut siku-siku.'),
                L('A kite has two pairs of parallel sides.', 'Layang-layang punya dua pasang sisi sejajar.'),
              ],
              answer: [0, 1],
              explain: L(
                'A square has 4 equal sides and 4 square corners, so it is both a rectangle and a rhombus. A rhombus can lean over with no square corners, and a kite has no parallel sides at all.',
                'Persegi punya 4 sisi sama panjang dan 4 sudut siku-siku, jadi persegi adalah persegi panjang sekaligus belah ketupat. Belah ketupat bisa miring tanpa sudut siku-siku, dan layang-layang tidak punya sisi sejajar sama sekali.',
              ),
              hint: L(
                'Check each statement with the table: which shapes have 4 square corners, and which have parallel sides?',
                'Periksa tiap pernyataan dengan tabel: bangun mana yang punya 4 sudut siku-siku, dan mana yang punya sisi sejajar?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Hasan has a box of tiles: 3 squares, 2 rhombuses, 2 trapezoids and 1 kite. How many of the tiles have two pairs of parallel sides?',
                'Hasan punya sekotak ubin: 3 persegi, 2 belah ketupat, 2 trapesium, dan 1 layang-layang. Ada berapa ubin yang punya dua pasang sisi sejajar?',
              ),
              blanks: [num(5, { en: '\\text{ tiles}', id: '\\text{ ubin}' })],
              hints: [
                L('Look at the column for parallel sides in the table. Which shapes have 2 pairs?', 'Lihat kolom sisi sejajar pada tabel. Bangun mana yang punya 2 pasang?'),
                L('Squares and rhombuses have 2 pairs. A trapezoid has only 1 pair, and a kite has none.', 'Persegi dan belah ketupat punya 2 pasang. Trapesium hanya punya 1 pasang, dan layang-layang tidak punya.'),
                L('Add up only the tiles that have 2 pairs: squares and rhombuses.', 'Jumlahkan hanya ubin yang punya 2 pasang: persegi dan belah ketupat.'),
              ],
              explain: L(
                'Squares (3) and rhombuses (2) have two pairs of parallel sides: $3 + 2 = 5$. The trapezoids have one pair and the kite has none.',
                'Persegi (3) dan belah ketupat (2) punya dua pasang sisi sejajar: $3 + 2 = 5$. Trapesium punya satu pasang dan layang-layang tidak punya.',
              ),
              solution: ['3 + 2 = 5'],
            },
          ],
        },
        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m8-s1-l2',
          title: { en: 'Polygons and Symmetry', id: 'Segi Banyak dan Simetri' },
          goal: {
            en: 'You can name polygons by their sides, and find the lines of symmetry of a shape.',
            id: 'Kamu bisa menamai segi banyak dari sisinya dan mencari sumbu simetri sebuah bangun.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Shapes with Many Sides', 'Ayo Amati: Bangun dengan Banyak Sisi'),
              body: L(
                `A **polygon** is a flat shape closed in by straight sides. Triangles and quadrilaterals are polygons, and so are shapes with more sides.\n\n- 5 sides: a **pentagon**\n- 6 sides: a **hexagon**\n- 8 sides: an **octagon**\n\nA polygon always has as many corners as it has sides. A **regular** polygon has all its sides equal and all its corners equal, like a honeycomb cell or a stop sign. If the sides or corners are not all equal, the polygon is **irregular**.`,
                `**Segi banyak** adalah bangun datar yang dibatasi oleh sisi-sisi lurus. Segitiga dan segiempat termasuk segi banyak, begitu juga bangun yang sisinya lebih banyak.\n\n- 5 sisi: **segilima**\n- 6 sisi: **segienam**\n- 8 sisi: **segidelapan**\n\nSegi banyak selalu punya sudut sebanyak sisinya. Segi banyak **beraturan** punya semua sisi sama panjang dan semua sudut sama besar, seperti sarang lebah atau rambu berhenti. Kalau sisi atau sudutnya tidak semua sama, segi banyak itu **tidak beraturan**.`,
              ),
              figure: {
                ...scene(
                  [
                    { pts: reg(5, 2.2, 2.4, 0, 90), eq: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]] },
                    { pts: reg(6, 2.2, 7.6, 0, 0), eq: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]] },
                    { pts: reg(8, 2.2, 12.8, 0, 22.5), eq: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]] },
                    { pts: [[16.2, -1.8], [19.6, -1.4], [20.2, 0.8], [18.4, 2.4], [16.2, 1.4]], color: 'b' },
                  ],
                  [txt(2.4, 0, '5', 'lg', 'muted'), txt(7.6, 0, '6', 'lg', 'muted'), txt(12.8, 0, '8', 'lg', 'muted'), txt(18.2, 0.2, '5', 'lg', 'muted')],
                ),
                caption: L(
                  'A regular pentagon, a regular hexagon, a regular octagon, and one irregular pentagon. The number inside tells how many sides the shape has.',
                  'Segilima beraturan, segienam beraturan, segidelapan beraturan, dan satu segilima tidak beraturan. Angka di dalamnya menunjukkan banyak sisi bangun itu.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Lines of Symmetry', 'Contoh Bertahap: Sumbu Simetri'),
              body: L(
                `A **line of symmetry** is a fold line: when you fold the shape along it, the two halves cover each other exactly. How many lines of symmetry does a rectangle (that is not a square) have?\n\n1. Step 1: Fold it the long way, through the middle of the two short sides. The halves match. That is 1 line.\n2. Step 2: Fold it the other way, through the middle of the two long sides. The halves match again. That is 2 lines.\n3. Step 3: Try a diagonal. The corners do not land on each other, so a diagonal is not a line of symmetry.\n4. Step 4: No other fold works. A rectangle has 2 lines of symmetry.\n\n**Remember:** the number of lines of symmetry.\n\n| Shape | Lines of symmetry |\n| --- | --- |\n| Square | 4 |\n| Rectangle | 2 |\n| Rhombus | 2 |\n| Equilateral triangle | 3 |\n| Isosceles triangle | 1 |\n| Kite | 1 |\n| Parallelogram | 0 |\n| Regular hexagon | 6 |\n\nA shape has **half-turn symmetry** if it looks exactly the same after you turn it half-way round, like turning a card upside down. A rectangle, a rhombus and a parallelogram have it. A kite and an equilateral triangle do not.`,
                `**Sumbu simetri** adalah garis lipat: kalau bangun dilipat pada garis itu, kedua bagiannya menutupi satu sama lain dengan tepat. Ada berapa sumbu simetri pada persegi panjang (yang bukan persegi)?\n\n1. Langkah 1: Lipat memanjang, melalui tengah kedua sisi pendek. Kedua bagiannya cocok. Itu 1 sumbu.\n2. Langkah 2: Lipat ke arah lain, melalui tengah kedua sisi panjang. Kedua bagiannya cocok lagi. Itu 2 sumbu.\n3. Langkah 3: Coba diagonal. Sudut-sudutnya tidak saling menutupi, jadi diagonal bukan sumbu simetri.\n4. Langkah 4: Tidak ada lipatan lain yang cocok. Persegi panjang punya 2 sumbu simetri.\n\n**Ingat:** banyak sumbu simetri.\n\n| Bangun | Sumbu simetri |\n| --- | --- |\n| Persegi | 4 |\n| Persegi panjang | 2 |\n| Belah ketupat | 2 |\n| Segitiga sama sisi | 3 |\n| Segitiga sama kaki | 1 |\n| Layang-layang | 1 |\n| Jajargenjang | 0 |\n| Segienam beraturan | 6 |\n\nSebuah bangun punya **simetri putar setengah putaran** kalau bentuknya tetap sama persis setelah diputar setengah putaran, seperti membalik kartu hingga terbalik. Persegi panjang, belah ketupat, dan jajargenjang punya simetri ini. Layang-layang dan segitiga sama sisi tidak punya.`,
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [6, 0], [6, 3.5], [0, 3.5]], rights: [0, 1, 2, 3] }],
                  [dash([3, 0], [3, 3.5]), dash([0, 1.75], [6, 1.75]), line([0, 0], [6, 3.5], 'muted', { dashed: true, width: 2 })],
                ),
                caption: L(
                  'The two red dashed lines are lines of symmetry. The grey diagonal is not.',
                  'Dua garis putus-putus merah adalah sumbu simetri. Diagonal abu-abu bukan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Counting Lines of Symmetry', 'Awas, Jebakan!: Menghitung Sumbu Simetri'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| A rectangle has 4 lines of symmetry, because it has 2 diagonals too. | The halves do not match when you fold a rectangle on a diagonal. It has only 2 lines of symmetry. |\n| A parallelogram has 2 lines of symmetry. | A parallelogram has no line of symmetry. It only has half-turn symmetry. |\n| A rhombus has 4 lines of symmetry, like a square. | A rhombus has 2, its two diagonals. It has no square corners, so the lines through the middles of its sides do not work. |`,
                `| Salah | Benar |\n| --- | --- |\n| Persegi panjang punya 4 sumbu simetri, karena punya 2 diagonal juga. | Kalau persegi panjang dilipat pada diagonalnya, kedua bagiannya tidak cocok. Persegi panjang hanya punya 2 sumbu simetri. |\n| Jajargenjang punya 2 sumbu simetri. | Jajargenjang tidak punya sumbu simetri. Ia hanya punya simetri putar setengah putaran. |\n| Belah ketupat punya 4 sumbu simetri, seperti persegi. | Belah ketupat punya 2, yaitu kedua diagonalnya. Sudutnya bukan siku-siku, jadi garis yang melalui tengah sisinya tidak cocok. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The dashed line is one fold line of this kite. How many lines of symmetry does the kite have in all?',
                'Garis putus-putus adalah salah satu garis lipat layang-layang ini. Ada berapa sumbu simetri layang-layang itu seluruhnya?',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [2, 2.6], [0, 4.2], [-2, 2.6]], eq: [[0, 1], [3, 1], [1, 2], [2, 2]] }], [dash([0, 0], [0, 4.2])]),
                caption: L('A kite with one fold line. The red ticks mark equal sides.', 'Sebuah layang-layang dengan satu garis lipat. Tanda merah menunjukkan sisi yang sama panjang.'),
              },
              options: [L('1', '1'), L('2', '2'), L('4', '4'), L('0', '0')],
              answer: 0,
              explain: L(
                'Only the diagonal that joins the two pairs of equal sides is a fold line. The other diagonal does not work, because the two pairs of equal sides are different lengths, so the halves do not cover each other.',
                'Hanya diagonal yang menghubungkan kedua pasang sisi sama panjang yang menjadi garis lipat. Diagonal yang lain tidak cocok, karena kedua pasang sisi yang sama panjang berbeda ukurannya, sehingga kedua bagiannya tidak saling menutupi.',
              ),
              hint: L(
                'Imagine folding the kite on the other diagonal. Would the corners land on each other?',
                'Bayangkan melipat layang-layang pada diagonal yang lain. Apakah sudut-sudutnya akan saling menutupi?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a square can be folded through the middles of opposite sides (red lines) and along its diagonals (orange lines). Count them.',
                'Coba bersama: persegi bisa dilipat melalui tengah sisi yang berhadapan (garis merah) dan sepanjang diagonalnya (garis oranye). Hitunglah.',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [4, 0], [4, 4], [0, 4]], rights: [0, 1, 2, 3] }],
                  [dash([2, 0], [2, 4]), dash([0, 2], [4, 2]), dash([0, 0], [4, 4], 'b', 0.3), dash([4, 0], [0, 4], 'b', 0.3)],
                ),
                caption: L('Four fold lines of a square.', 'Empat garis lipat pada persegi.'),
              },
              template: {
                en: '\\text{red lines: } ___ \\quad \\text{orange lines: } ___ \\quad \\text{all together: } ___',
                id: '\\text{garis merah: } ___ \\quad \\text{garis oranye: } ___ \\quad \\text{seluruhnya: } ___',
              },
              blanks: ['2', '2', '4'],
              explain: L('$2 + 2 = 4$. A square has 4 lines of symmetry.', '$2 + 2 = 4$. Persegi punya 4 sumbu simetri.'),
              hint: L(
                'Count the red dashed lines first, then the orange ones, then add them.',
                'Hitung dulu garis putus-putus merah, lalu yang oranye, lalu jumlahkan.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A square and a triangle are joined along one side to make this house shape (the dashed line is where they join). How many sides does the whole house shape have?',
                'Sebuah persegi dan sebuah segitiga digabung pada satu sisi sehingga membentuk rumah ini (garis putus-putus adalah tempat bergabung). Ada berapa sisi bangun rumah ini seluruhnya?',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [4, 0], [4, 4], [2, 6.5], [0, 4]] }], [helper([0, 4], [4, 4])]),
                caption: L('A house shape made from a square and a triangle.', 'Bangun rumah yang dibuat dari sebuah persegi dan sebuah segitiga.'),
              },
              options: [L('5', '5'), L('7', '7'), L('6', '6'), L('8', '8')],
              answer: 0,
              explain: L(
                'The square has 4 sides and the triangle has 3, but the side where they join is inside the shape and is not part of its outline: $4 + 3 - 2 = 5$. The house is a pentagon.',
                'Persegi punya 4 sisi dan segitiga punya 3, tetapi sisi tempat keduanya bergabung ada di dalam bangun dan bukan bagian garis luarnya: $4 + 3 - 2 = 5$. Rumah ini adalah segilima.',
              ),
              hint: L(
                'Trace along the outside of the house with your finger and count the straight pieces. Does the dashed line count?',
                'Telusuri bagian luar rumah dengan jarimu dan hitung potongan lurusnya. Apakah garis putus-putus ikut dihitung?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('A hexagon has 6 sides and 6 corners.', 'Segienam punya 6 sisi dan 6 sudut.'),
                L('A regular polygon has all sides equal and all corners equal.', 'Segi banyak beraturan punya semua sisi sama panjang dan semua sudut sama besar.'),
                L('A rhombus is a regular polygon, because all 4 of its sides are equal.', 'Belah ketupat adalah segi banyak beraturan, karena keempat sisinya sama panjang.'),
                L('Every polygon with 6 sides is a regular hexagon.', 'Setiap segi banyak dengan 6 sisi adalah segienam beraturan.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'A polygon has as many corners as sides. Regular needs equal sides AND equal corners: a rhombus leans over, so its corners are not all equal. A 6-sided shape can also be irregular.',
                'Segi banyak punya sudut sebanyak sisinya. Beraturan berarti sisi sama panjang DAN sudut sama besar: belah ketupat miring, jadi sudutnya tidak semua sama. Bangun bersisi 6 juga bisa tidak beraturan.',
              ),
              hint: L(
                'For a regular polygon, both the sides and the corners must be equal. Is that true for a leaning rhombus?',
                'Pada segi banyak beraturan, sisi dan sudutnya harus sama. Apakah itu benar untuk belah ketupat yang miring?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
              options: [
                L('A square has 4 lines of symmetry.', 'Persegi punya 4 sumbu simetri.'),
                L('A regular hexagon has 6 lines of symmetry.', 'Segienam beraturan punya 6 sumbu simetri.'),
                L('A rectangle has 4 lines of symmetry.', 'Persegi panjang punya 4 sumbu simetri.'),
                L('A parallelogram has 2 lines of symmetry.', 'Jajargenjang punya 2 sumbu simetri.'),
              ],
              answer: [0, 1],
              explain: L(
                'A square has 4 and a regular hexagon has 6. A rectangle has only 2, and a parallelogram has none.',
                'Persegi punya 4 dan segienam beraturan punya 6. Persegi panjang hanya punya 2, dan jajargenjang tidak punya.',
              ),
              hint: L(
                'Look back at the table of lines of symmetry. Which two statements match it?',
                'Lihat lagi tabel sumbu simetri. Dua pernyataan mana yang cocok dengannya?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Siti makes a pattern from a square tile, a regular hexagon tile and an equilateral triangle tile. How many lines of symmetry do the three tiles have all together?',
                'Siti membuat pola dari satu ubin persegi, satu ubin segienam beraturan, dan satu ubin segitiga sama sisi. Ada berapa sumbu simetri pada ketiga ubin itu seluruhnya?',
              ),
              figure: {
                ...scene([
                  { pts: [[0, 0], [4, 0], [4, 4], [0, 4]], rights: [0, 1, 2, 3] },
                  { pts: reg(6, 2.3, 8, 2, 0), color: 'b' },
                  { pts: reg(3, 2.6, 13.4, 2, 90), color: 'c' },
                ]),
                caption: L('A square, a regular hexagon and an equilateral triangle.', 'Sebuah persegi, segienam beraturan, dan segitiga sama sisi.'),
              },
              blanks: [num(13)],
              hints: [
                L('Find the number of lines of symmetry of each shape separately.', 'Cari dulu banyak sumbu simetri tiap bangun secara terpisah.'),
                L('Use the table: a square has 4, a regular hexagon has 6, an equilateral triangle has 3.', 'Pakai tabel: persegi punya 4, segienam beraturan punya 6, segitiga sama sisi punya 3.'),
                L('Now add the three numbers together.', 'Sekarang jumlahkan ketiga bilangan itu.'),
              ],
              explain: L('$4 + 6 + 3 = 13$ lines of symmetry in all.', '$4 + 6 + 3 = 13$ sumbu simetri seluruhnya.'),
              solution: ['4 + 6 + 3 = 13'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m8-s1-p',
        runtime: 'math',
        title: L('Know Your Shapes', 'Kenali Bangun Datar'),
        brief: L(
          'Count sides and parallel sides, use what you know about polygons, and reason about shapes that are cut up.',
          'Hitung sisi dan sisi sejajar, pakai yang kamu tahu tentang segi banyak, lalu bernalar tentang bangun yang dipotong.',
        ),
        requirements: [
          L('Name quadrilaterals and polygons from their sides and corners.', 'Menamai segiempat dan segi banyak dari sisi dan sudutnya.'),
          L('Use lines of symmetry and cut-up shapes to solve counting problems.', 'Memakai sumbu simetri dan bangun yang dipotong untuk memecahkan soal berhitung.'),
        ],
        hints: [
          L('Mark each fact on the picture first: arrowheads for parallel sides, ticks for equal sides.', 'Tandai dulu tiap fakta pada gambar: anak panah untuk sisi sejajar, garis kecil untuk sisi sama panjang.'),
          L('A polygon has as many corners as sides. When shapes are cut or joined, look at what is left.', 'Segi banyak punya sudut sebanyak sisinya. Kalau bangun dipotong atau digabung, lihat apa yang tersisa.'),
          L('To count in a picture, go in order: small pieces first, then pieces made of two or more small ones.', 'Untuk menghitung pada gambar, urut saja: bagian kecil dulu, lalu bagian yang tersusun dari dua bagian kecil atau lebih.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Look at this trapezoid. Write how many sides it has and how many pairs of parallel sides.',
              'Perhatikan trapesium ini. Tulis banyak sisinya dan banyak pasang sisi sejajarnya.',
            ),
            figure: {
              ...scene([{ pts: [[0, 0], [6, 0], [5, 3], [1.5, 3]], par: [[0, 1], [2, 1]] }]),
              caption: L('A trapezoid. The orange arrowheads mark parallel sides.', 'Sebuah trapesium. Anak panah oranye menunjukkan sisi sejajar.'),
            },
            inline: true,
            blanks: [
              num(4, undefined, L('\\text{sides: }', '\\text{sisi: }')),
              num(1, undefined, L('\\text{pairs of parallel sides: }', '\\text{pasang sisi sejajar: }')),
            ],
            solution: {
              en: ['\\text{a quadrilateral has } 4 \\text{ sides}', '\\text{only the top and the bottom are parallel: } 1 \\text{ pair}'],
              id: ['\\text{segiempat punya } 4 \\text{ sisi}', '\\text{hanya sisi atas dan bawah yang sejajar: } 1 \\text{ pasang}'],
            },
          },
          {
            prompt: L(
              'A shop sells 4 pentagon-shaped tiles and 3 hexagon-shaped tiles. How many sides do all these tiles have together?',
              'Sebuah toko menjual 4 ubin berbentuk segilima dan 3 ubin berbentuk segienam. Ada berapa sisi pada semua ubin itu seluruhnya?',
            ),
            blanks: [num(38)],
            solution: ['4 \\times 5 = 20', '3 \\times 6 = 18', '20 + 18 = 38'],
          },
          {
            prompt: L(
              'Ani cuts a rectangular paper along a diagonal (the dashed line) into two triangles. How many square corners do the two triangles have in all?',
              'Ani memotong kertas berbentuk persegi panjang sepanjang diagonalnya (garis putus-putus) menjadi dua segitiga. Ada berapa sudut siku-siku pada kedua segitiga itu seluruhnya?',
            ),
            figure: {
              ...scene([{ pts: [[0, 0], [6, 0], [6, 3.5], [0, 3.5]], rights: [0, 1, 2, 3] }], [helper([0, 0], [6, 3.5])]),
              caption: L('A rectangle cut along its diagonal.', 'Sebuah persegi panjang dipotong sepanjang diagonalnya.'),
            },
            blanks: [num(2)],
            solution: {
              en: ['\\text{each triangle keeps one square corner of the rectangle}', '1 + 1 = 2'],
              id: ['\\text{tiap segitiga mempertahankan satu sudut siku-siku persegi panjang}', '1 + 1 = 2'],
            },
          },
          {
            prompt: L(
              'A square is cut by both of its diagonals. How many triangles, of any size, can you count in the picture?',
              'Sebuah persegi dipotong oleh kedua diagonalnya. Ada berapa segitiga, dengan ukuran berapa pun, yang dapat kamu hitung pada gambar?',
            ),
            figure: {
              ...scene([{ pts: [[0, 0], [5, 0], [5, 5], [0, 5]] }], [line([0, 0], [5, 5], 'result', { width: 3 }), line([5, 0], [0, 5], 'result', { width: 3 })]),
              caption: L('A square with both of its diagonals.', 'Sebuah persegi dengan kedua diagonalnya.'),
            },
            blanks: [num(8)],
            solution: {
              en: ['\\text{small triangles: } 4', '\\text{triangles made of two small ones (each half of the square): } 4', '4 + 4 = 8'],
              id: ['\\text{segitiga kecil: } 4', '\\text{segitiga dari dua segitiga kecil (tiap setengah persegi): } 4', '4 + 4 = 8'],
            },
          },
        ],
      },
    },
    /* ================================================================== S2 perimeter */
    {
      id: 'tka-m8-s2',
      title: { en: 'Perimeter', id: 'Keliling' },
      summary: {
        en: 'Perimeter is the distance all the way round a shape. You will find it for triangles, quadrilaterals, polygons and combined shapes.',
        id: 'Keliling adalah jarak sepanjang sisi luar sebuah bangun. Kamu akan mencarinya untuk segitiga, segiempat, segi banyak, dan bangun gabungan.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m8-s2-l1',
          title: { en: 'Perimeter of Triangles and Quadrilaterals', id: 'Keliling Segitiga dan Segiempat' },
          goal: {
            en: 'You can find the perimeter of a triangle, a square, a rectangle and other quadrilaterals, and a missing side.',
            id: 'Kamu bisa mencari keliling segitiga, persegi, persegi panjang, dan segiempat lain, serta sisi yang belum diketahui.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: All the Way Round', 'Ayo Amati: Sekeliling Bangun'),
              body: L(
                `Ani jogs once all the way round a rectangular playground. The distance she jogs is the **perimeter** of the playground: the length of the whole border of a shape.\n\nOn a grid we can count the little sides along the border. Here each little side is 1 m. There are 4 along the bottom, 3 up the right side, 4 along the top and 3 down the left side.\n\nSo the perimeter is $4 + 3 + 4 + 3 = 14$ m.`,
                `Ani berlari kecil satu kali mengelilingi lapangan berbentuk persegi panjang. Jarak yang ia tempuh adalah **keliling** lapangan itu: panjang seluruh pinggir sebuah bangun.\n\nPada kotak-kotak kita bisa menghitung sisi kecil di sepanjang pinggirnya. Di sini tiap sisi kecil panjangnya 1 m. Ada 4 di bawah, 3 di sisi kanan, 4 di atas, dan 3 di sisi kiri.\n\nJadi kelilingnya $4 + 3 + 4 + 3 = 14$ m.`,
              ),
              figure: {
                ...gridPerim(4, 3, ['4', '3']),
                caption: L(
                  'Each little side is 1 m long. The red border is the perimeter.',
                  'Tiap sisi kecil panjangnya 1 m. Garis tepi merah adalah keliling.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Fencing a Field', 'Contoh Bertahap: Memagari Lapangan'),
              body: L(
                `Pak Joko puts a fence all round a rectangular field, 9 m long and 6 m wide. How long is the fence?\n\n1. Step 1: Draw the field and write a length on every side. Opposite sides of a rectangle are equal: two sides are 9 m and two sides are 6 m.\n2. Step 2: Add all four sides: $9 + 6 + 9 + 6 = 30$.\n3. Step 3: Shortcut: two lengths and two widths. $2 \\times (9 + 6) = 2 \\times 15 = 30$.\n4. Step 4: Write the unit. The fence is 30 m long.\n\n**Remember:**\n\n| Shape | Perimeter |\n| --- | --- |\n| Square | 4 × side |\n| Rectangle | 2 × (length + width) |\n| Triangle | side + side + side |\n| Other quadrilaterals | add all 4 sides |`,
                `Pak Joko memasang pagar mengelilingi lapangan berbentuk persegi panjang, panjangnya 9 m dan lebarnya 6 m. Berapa panjang pagarnya?\n\n1. Langkah 1: Gambar lapangannya dan tulis panjang di tiap sisi. Sisi yang berhadapan sama panjang: dua sisi 9 m dan dua sisi 6 m.\n2. Langkah 2: Jumlahkan keempat sisinya: $9 + 6 + 9 + 6 = 30$.\n3. Langkah 3: Cara cepat: dua panjang dan dua lebar. $2 \\times (9 + 6) = 2 \\times 15 = 30$.\n4. Langkah 4: Tulis satuannya. Panjang pagar adalah 30 m.\n\n**Ingat:**\n\n| Bangun | Keliling |\n| --- | --- |\n| Persegi | 4 × sisi |\n| Persegi panjang | 2 × (panjang + lebar) |\n| Segitiga | sisi + sisi + sisi |\n| Segiempat lainnya | jumlah keempat sisi |`,
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [9, 0], [9, 6], [0, 6]], rights: [0, 1, 2, 3], sides: ['9 m', '6 m', '9 m', '6 m'] }]),
                caption: L('The field with all four sides written on it.', 'Lapangan dengan keempat sisinya yang sudah ditulis.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Perimeter Mistakes', 'Awas, Jebakan!: Kesalahan pada Keliling'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| The perimeter of a 9 m by 6 m rectangle is $9 + 6 = 15$ m. | A rectangle has 4 sides. Add all four: $9 + 6 + 9 + 6 = 30$ m. |\n| The perimeter of a square with side 5 cm is $5 \\times 5 = 25$ cm. | A square has 4 equal sides: $4 \\times 5 = 20$ cm. |\n| Add 3 m and 40 cm to get 43. | Change to the same unit first: 3 m = 300 cm, so $300 + 40 = 340$ cm. |`,
                `| Salah | Benar |\n| --- | --- |\n| Keliling persegi panjang 9 m kali 6 m adalah $9 + 6 = 15$ m. | Persegi panjang punya 4 sisi. Jumlahkan keempatnya: $9 + 6 + 9 + 6 = 30$ m. |\n| Keliling persegi dengan sisi 5 cm adalah $5 \\times 5 = 25$ cm. | Persegi punya 4 sisi yang sama panjang: $4 \\times 5 = 20$ cm. |\n| Jumlahkan 3 m dan 40 cm menjadi 43. | Ubah dulu ke satuan yang sama: 3 m = 300 cm, jadi $300 + 40 = 340$ cm. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('What is the perimeter of this triangle?', 'Berapa keliling segitiga ini?'),
              figure: {
                ...scene([{ pts: [[0, 0], [7, 0], [4.29, 4.2]], sides: ['7 cm', '5 cm', '6 cm'] }]),
                caption: L('A triangle with its three sides in cm.', 'Sebuah segitiga dengan ketiga sisinya dalam cm.'),
              },
              options: [L('18 cm', '18 cm'), L('11 cm', '11 cm'), L('13 cm', '13 cm'), L('210 cm', '210 cm')],
              answer: 0,
              explain: L(
                'Add all three sides: $7 + 5 + 6 = 18$ cm. Adding only two sides gives 11 or 13, and multiplying the sides is not how perimeter works.',
                'Jumlahkan ketiga sisinya: $7 + 5 + 6 = 18$ cm. Menjumlahkan hanya dua sisi menghasilkan 11 atau 13, dan mengalikan sisi-sisinya bukan cara mencari keliling.',
              ),
              hint: L(
                'Perimeter is the distance all the way round. How many sides does a triangle have, and have you used every one?',
                'Keliling adalah jarak sepanjang sisi luar. Segitiga punya berapa sisi, dan apakah semuanya sudah kamu pakai?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: use the shortcut for Pak Joko\'s field, 9 m long and 6 m wide.',
                'Coba bersama: pakai cara cepat untuk lapangan Pak Joko, panjang 9 m dan lebar 6 m.',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [9, 0], [9, 6], [0, 6]], rights: [0, 1, 2, 3], sides: ['9 m', '6 m', '9 m', '6 m'] }]),
                caption: L('The rectangular field.', 'Lapangan berbentuk persegi panjang.'),
              },
              template: '2 \\times (9 + 6) = 2 \\times ___ = ___',
              blanks: ['15', '30'],
              explain: L(
                '$9 + 6 = 15$ and $2 \\times 15 = 30$. The perimeter is 30 m.',
                '$9 + 6 = 15$ dan $2 \\times 15 = 30$. Kelilingnya 30 m.',
              ),
              hint: L(
                'Work out the bracket first: length plus width. Then double it.',
                'Hitung dulu yang di dalam kurung: panjang ditambah lebar. Lalu kalikan 2.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The perimeter of this quadrilateral is 26 cm. How long is the side marked with a question mark?',
                'Keliling segiempat ini 26 cm. Berapa panjang sisi yang diberi tanda tanya?',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [7, 0], [7.4, 4.2], [-1, 4.6]], sides: ['7 cm', '5 cm', '8 cm', '?'] }]),
                caption: L('The picture is not drawn to scale.', 'Gambar ini tidak digambar dengan skala.'),
              },
              options: [L('6 cm', '6 cm'), L('14 cm', '14 cm'), L('20 cm', '20 cm'), L('46 cm', '46 cm')],
              answer: 0,
              explain: L(
                'The three known sides add up to $7 + 5 + 8 = 20$ cm. The missing side is what is left of the 26 cm: $26 - 20 = 6$ cm.',
                'Ketiga sisi yang diketahui berjumlah $7 + 5 + 8 = 20$ cm. Sisi yang hilang adalah sisa dari 26 cm: $26 - 20 = 6$ cm.',
              ),
              hint: L(
                'First add up the sides you can see. The missing side is what the perimeter has left over.',
                'Jumlahkan dulu sisi yang terlihat. Sisi yang hilang adalah sisa dari kelilingnya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('A square with side 6 cm has a perimeter of 24 cm.', 'Persegi dengan sisi 6 cm mempunyai keliling 24 cm.'),
                L('A rectangle 8 cm long and 3 cm wide has a perimeter of 11 cm.', 'Persegi panjang dengan panjang 8 cm dan lebar 3 cm mempunyai keliling 11 cm.'),
                L('If every side of a square becomes twice as long, its perimeter also becomes twice as long.', 'Jika setiap sisi sebuah persegi menjadi dua kali lebih panjang, kelilingnya juga menjadi dua kali lebih panjang.'),
                L('A perimeter can be measured in cm².', 'Keliling dapat diukur dalam cm².'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$4 \\times 6 = 24$ cm is right. The rectangle needs all four sides: $2 \\times (8 + 3) = 22$ cm. A square has 4 equal sides, so doubling the side doubles $4 \\times$ side. Perimeter is a length, so it is in cm, not cm².',
                '$4 \\times 6 = 24$ cm benar. Persegi panjang perlu keempat sisinya: $2 \\times (8 + 3) = 22$ cm. Persegi punya 4 sisi sama panjang, jadi sisi yang digandakan menggandakan $4 \\times$ sisi. Keliling adalah panjang, jadi satuannya cm, bukan cm².',
              ),
              hint: L(
                'For each one, count the sides and add them all. Remember that perimeter is a length.',
                'Untuk tiap pernyataan, hitung sisinya dan jumlahkan semuanya. Ingat bahwa keliling adalah panjang.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Siti ties a ribbon round a square box, 15 cm on each side. She needs another 10 cm of ribbon for the bow. How long is the ribbon she needs?',
                'Siti mengikat pita mengelilingi kotak persegi yang sisinya 15 cm. Ia masih butuh 10 cm pita untuk membuat simpul. Berapa panjang pita yang ia butuhkan?',
              ),
              figure: {
                ...scene([{ pts: [[0, 0], [5, 0], [5, 5], [0, 5]], rights: [0, 1, 2, 3], sides: ['15 cm', '15 cm', '15 cm', '15 cm'] }]),
                caption: L('The top of the box.', 'Bagian atas kotak.'),
              },
              blanks: [num(70, CM)],
              hints: [
                L('The ribbon goes all the way round the box and a little more. First find the part round the box.', 'Pita melingkari kotak dan masih lebih sedikit lagi. Cari dulu bagian yang melingkari kotak.'),
                L('A square has 4 equal sides, so the part round the box is 4 times one side.', 'Persegi punya 4 sisi sama panjang, jadi bagian yang melingkari kotak adalah 4 kali satu sisi.'),
                L('Find $4 \\times 15$, then add the 10 cm for the bow.', 'Hitung $4 \\times 15$, lalu tambahkan 10 cm untuk simpul.'),
              ],
              explain: L(
                'Round the box: $4 \\times 15 = 60$ cm. With the bow: $60 + 10 = 70$ cm.',
                'Mengelilingi kotak: $4 \\times 15 = 60$ cm. Dengan simpul: $60 + 10 = 70$ cm.',
              ),
              solution: ['4 \\times 15 = 60', '60 + 10 = 70'],
            },
          ],
        },
        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m8-s2-l2',
          title: { en: 'Perimeter of Polygons and Combined Shapes', id: 'Keliling Segi Banyak dan Bangun Gabungan' },
          goal: {
            en: 'You can find the perimeter of a regular polygon and of L-shaped and U-shaped figures with missing sides.',
            id: 'Kamu bisa mencari keliling segi banyak beraturan serta bangun berbentuk L dan U dengan sisi yang belum diketahui.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Equal Sides Save Work', 'Ayo Amati: Sisi yang Sama Mempermudah'),
              body: L(
                `A table top is a regular hexagon. Each of its 6 sides is 5 cm long. We could add $5 + 5 + 5 + 5 + 5 + 5$, but repeated adding is just multiplying: $6 \\times 5 = 30$ cm.\n\nSo for a **regular polygon**, the perimeter is the number of sides times the length of one side.\n\nIf a polygon is not regular, its sides are different, so we must add every side one by one.`,
                `Permukaan sebuah meja berbentuk segienam beraturan. Tiap sisinya dari 6 sisi itu panjangnya 5 cm. Kita bisa menjumlahkan $5 + 5 + 5 + 5 + 5 + 5$, tetapi penjumlahan berulang sama dengan perkalian: $6 \\times 5 = 30$ cm.\n\nJadi pada **segi banyak beraturan**, keliling adalah banyak sisi dikali panjang satu sisi.\n\nKalau segi banyaknya tidak beraturan, sisi-sisinya berbeda, jadi kita harus menjumlahkan semua sisinya satu per satu.`,
              ),
              figure: {
                ...scene([{ pts: reg(6, 3, 0, 0, 0), eq: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]], sides: [undefined, undefined, undefined, '5 cm'] }]),
                caption: L(
                  'A regular hexagon. The red ticks show that all 6 sides are equal.',
                  'Segienam beraturan. Tanda merah menunjukkan bahwa keenam sisinya sama panjang.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: An L-Shaped Garden', 'Contoh Bertahap: Kebun Berbentuk L'),
              body: L(
                `An L-shaped garden has the lengths shown. Two sides have a question mark. Find the perimeter.\n\n1. Step 1: Look at the horizontal sides. The bottom (10 m) is as long as the top (5 m) and the missing side together: $10 - 5 = 5$ m.\n2. Step 2: Look at the vertical sides. The left side (8 m) is as long as the right side (4 m) and the other missing side together: $8 - 4 = 4$ m.\n3. Step 3: Add all 6 sides: $10 + 4 + 5 + 4 + 5 + 8 = 36$ m.\n4. Step 4: Check with the dashed lines. The L-shape has the same perimeter as the whole 10 m by 8 m rectangle: $2 \\times (10 + 8) = 36$ m.\n\n**Remember:**\n\n- Opposite sides add up: the horizontal pieces on top together are as long as the bottom, and the vertical pieces together are as long as the full height.\n- Every side of the outline counts, also the sides inside the notch.\n- An L-shape (a rectangle with a corner cut away) has the same perimeter as the rectangle around it.`,
                `Sebuah kebun berbentuk L punya ukuran seperti pada gambar. Dua sisinya bertanda tanya. Cari kelilingnya.\n\n1. Langkah 1: Lihat sisi-sisi mendatar. Sisi bawah (10 m) sama panjang dengan sisi atas (5 m) dan sisi yang hilang digabung: $10 - 5 = 5$ m.\n2. Langkah 2: Lihat sisi-sisi tegak. Sisi kiri (8 m) sama panjang dengan sisi kanan (4 m) dan sisi lain yang hilang digabung: $8 - 4 = 4$ m.\n3. Langkah 3: Jumlahkan keenam sisinya: $10 + 4 + 5 + 4 + 5 + 8 = 36$ m.\n4. Langkah 4: Periksa dengan garis putus-putus. Bangun L itu punya keliling yang sama dengan seluruh persegi panjang 10 m kali 8 m: $2 \\times (10 + 8) = 36$ m.\n\n**Ingat:**\n\n- Sisi yang berhadapan saling melengkapi: potongan sisi mendatar di atas jika digabung sama panjang dengan sisi bawah, dan potongan sisi tegak jika digabung sama dengan tinggi seluruhnya.\n- Setiap sisi garis luar dihitung, termasuk sisi di dalam lekukan.\n- Bangun L (persegi panjang yang salah satu sudutnya dipotong) punya keliling yang sama dengan persegi panjang yang membungkusnya.`,
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [10, 0], [10, 4], [5, 4], [5, 8], [0, 8]], sides: ['10 m', '4 m', '?', '?', '5 m', '8 m'] }],
                  [helper([10, 4], [10, 8], 'b'), helper([5, 8], [10, 8], 'b')],
                ),
                caption: L(
                  'The L-shaped garden. The dashed lines complete the rectangle around it.',
                  'Kebun berbentuk L. Garis putus-putus melengkapi persegi panjang yang membungkusnya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Missing Sides', 'Awas, Jebakan!: Sisi yang Hilang'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| Add only the numbers written on the figure: $10 + 4 + 5 + 8 = 27$ m. | Find the missing sides first, then add all 6 sides: 36 m. |\n| The sides inside the notch are not on the border, so skip them. | They are part of the outline. A fence has to go along them too. |\n| Perimeter is the number of sides times one side, so $6 \\times 10 = 60$ m. | That works only for a regular polygon. For other shapes, add every side. |`,
                `| Salah | Benar |\n| --- | --- |\n| Jumlahkan saja angka yang tertulis pada gambar: $10 + 4 + 5 + 8 = 27$ m. | Cari dulu sisi yang hilang, lalu jumlahkan keenam sisinya: 36 m. |\n| Sisi di dalam lekukan bukan di pinggir, jadi tidak dihitung. | Sisi itu bagian dari garis luar. Pagar juga harus dipasang di sepanjang sisi itu. |\n| Keliling adalah banyak sisi kali satu sisi, jadi $6 \\times 10 = 60$ m. | Cara itu hanya berlaku untuk segi banyak beraturan. Untuk bangun lain, jumlahkan setiap sisinya. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A road sign is a regular octagon. One side is 12 cm. What is the perimeter of the sign?',
                'Sebuah rambu jalan berbentuk segidelapan beraturan. Satu sisinya 12 cm. Berapa keliling rambu itu?',
              ),
              figure: {
                ...scene([{ pts: reg(8, 3, 0, 0, 22.5), eq: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]], sides: [undefined, undefined, undefined, undefined, undefined, '12 cm'] }]),
                caption: L('A regular octagon. All 8 sides are equal.', 'Segidelapan beraturan. Kedelapan sisinya sama panjang.'),
              },
              options: [L('96 cm', '96 cm'), L('20 cm', '20 cm'), L('144 cm', '144 cm'), L('84 cm', '84 cm')],
              answer: 0,
              explain: L(
                'An octagon has 8 equal sides: $8 \\times 12 = 96$ cm. Adding 8 and 12 mixes up the number of sides with a length, $12 \\times 12$ multiplies by the wrong number, and 84 counts only 7 sides.',
                'Segidelapan punya 8 sisi sama panjang: $8 \\times 12 = 96$ cm. Menjumlahkan 8 dan 12 mencampur banyak sisi dengan panjang, $12 \\times 12$ mengalikan dengan bilangan yang salah, dan 84 hanya menghitung 7 sisi.',
              ),
              hint: L(
                'How many sides does an octagon have? All of them are the same length.',
                'Segidelapan punya berapa sisi? Semuanya sama panjang.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find the two missing sides of this L-shape (the dashed lines complete the rectangle around it).',
                'Coba bersama: cari dua sisi yang hilang pada bangun L ini (garis putus-putus melengkapi persegi panjang yang membungkusnya).',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [9, 0], [9, 3], [4, 3], [4, 7], [0, 7]], sides: ['9 m', '3 m', '?', '?', '4 m', '7 m'] }],
                  [helper([9, 3], [9, 7], 'b'), helper([4, 7], [9, 7], 'b')],
                ),
                caption: L('An L-shape with two missing sides.', 'Bangun L dengan dua sisi yang belum diketahui.'),
              },
              template: {
                en: '\\text{horizontal: } 9 - 4 = ___ \\quad \\text{vertical: } 7 - 3 = ___',
                id: '\\text{mendatar: } 9 - 4 = ___ \\quad \\text{tegak: } 7 - 3 = ___',
              },
              blanks: ['5', '4'],
              explain: L(
                'The missing sides are 5 m and 4 m. All 6 sides add up to $9 + 3 + 5 + 4 + 4 + 7 = 32$ m, the same as $2 \\times (9 + 7)$.',
                'Sisi yang hilang adalah 5 m dan 4 m. Keenam sisinya berjumlah $9 + 3 + 5 + 4 + 4 + 7 = 32$ m, sama dengan $2 \\times (9 + 7)$.',
              ),
              hint: L(
                'The bottom side is made of the top side plus the missing side. Do the same for the vertical sides.',
                'Sisi bawah terdiri dari sisi atas ditambah sisi yang hilang. Lakukan hal yang sama untuk sisi tegak.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Pak Hasan fences the whole outline of this U-shaped garden, including the notch. Sides with the same red ticks are equal. How long is the fence?',
                'Pak Hasan memagari seluruh garis luar kebun berbentuk U ini, termasuk lekukannya. Sisi dengan tanda merah yang sama panjangnya sama. Berapa panjang pagarnya?',
              ),
              figure: {
                ...scene([
                  {
                    pts: [[0, 0], [12, 0], [12, 8], [8, 8], [8, 3], [4, 3], [4, 8], [0, 8]],
                    eq: [[1, 1], [7, 1], [3, 2], [5, 2], [2, 3], [6, 3]],
                    sides: ['12 m', undefined, undefined, undefined, '4 m', '5 m', '4 m', '8 m'],
                  },
                ]),
                caption: L('A U-shaped garden.', 'Kebun berbentuk U.'),
              },
              options: [L('50 m', '50 m'), L('33 m', '33 m'), L('40 m', '40 m'), L('45 m', '45 m')],
              answer: 0,
              explain: L(
                'The sides are 12, 8, 4, 5, 4, 5, 4 and 8: $12 + 8 + 4 + 5 + 4 + 5 + 4 + 8 = 50$ m. Adding only the written numbers gives 33, using the rectangle around the shape gives 40, and skipping one side of the notch gives 45.',
                'Sisi-sisinya adalah 12, 8, 4, 5, 4, 5, 4, dan 8: $12 + 8 + 4 + 5 + 4 + 5 + 4 + 8 = 50$ m. Menjumlahkan angka yang tertulis saja menghasilkan 33, memakai persegi panjang yang membungkus menghasilkan 40, dan melewatkan satu sisi lekukan menghasilkan 45.',
              ),
              hint: L(
                'Use the ticks to write a length on every side first. Then add all 8 sides.',
                'Pakai tanda merah untuk menulis panjang pada setiap sisi dulu. Lalu jumlahkan kedelapan sisinya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Look at the L-shape. Decide whether each statement is True or False.', 'Perhatikan bangun L ini. Tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [6, 0], [6, 2], [3, 2], [3, 5], [0, 5]], sides: ['6 cm', '2 cm', undefined, undefined, '3 cm', '5 cm'] }],
                  [helper([6, 2], [6, 5], 'b'), helper([3, 5], [6, 5], 'b')],
                ),
                caption: L('An L-shape. The dashed lines complete the rectangle around it.', 'Bangun L. Garis putus-putus melengkapi persegi panjang yang membungkusnya.'),
              },
              statements: [
                L('The perimeter is 22 cm.', 'Kelilingnya 22 cm.'),
                L('The perimeter is $6 + 2 + 3 + 5 = 16$ cm.', 'Kelilingnya $6 + 2 + 3 + 5 = 16$ cm.'),
                L('A rectangle 6 cm by 5 cm has the same perimeter as this shape.', 'Persegi panjang 6 cm kali 5 cm mempunyai keliling yang sama dengan bangun ini.'),
                L('The two sides inside the notch are not part of the perimeter.', 'Kedua sisi di dalam lekukan bukan bagian dari keliling.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The missing sides are 3 cm and 3 cm, so the sides add up to $6 + 2 + 3 + 3 + 3 + 5 = 22$ cm. That equals $2 \\times (6 + 5)$, the rectangle around it. Adding only the written numbers misses two sides, and the notch sides are part of the outline.',
                'Sisi yang hilang adalah 3 cm dan 3 cm, jadi jumlah sisinya $6 + 2 + 3 + 3 + 3 + 5 = 22$ cm. Itu sama dengan $2 \\times (6 + 5)$, yaitu persegi panjang yang membungkusnya. Menjumlahkan angka yang tertulis saja melewatkan dua sisi, dan sisi lekukan adalah bagian dari garis luar.',
              ),
              hint: L(
                'Find the two missing sides first. Then compare with the rectangle formed by the dashed lines.',
                'Cari dulu kedua sisi yang hilang. Lalu bandingkan dengan persegi panjang yang dibentuk garis putus-putus.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The floor of a hall is shaped like the L in the picture. Pak Eko puts a border strip along all the walls. The strip costs Rp5,000 for each metre. How much does the strip cost? (Ignore the doors.)',
                'Lantai sebuah aula berbentuk huruf L seperti pada gambar. Pak Eko memasang lis di sepanjang semua dinding. Lis itu harganya Rp5.000 untuk tiap meter. Berapa biaya lis itu? (Abaikan pintu.)',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [14, 0], [14, 6], [8, 6], [8, 10], [0, 10]], sides: ['14 m', '6 m', undefined, undefined, '8 m', '10 m'] }],
                  [helper([14, 6], [14, 10], 'b'), helper([8, 10], [14, 10], 'b')],
                ),
                caption: L('The L-shaped floor of the hall.', 'Lantai aula yang berbentuk L.'),
              },
              blanks: [num(240000, undefined, '\\text{Rp}')],
              hints: [
                L('The strip goes along every wall, so first find the perimeter of the floor.', 'Lis dipasang di sepanjang semua dinding, jadi cari dulu keliling lantainya.'),
                L('Two sides are missing. The L-shape has the same perimeter as the rectangle around it.', 'Ada dua sisi yang belum diketahui. Bangun L punya keliling yang sama dengan persegi panjang yang membungkusnya.'),
                L('Find the perimeter of a 14 m by 10 m rectangle, then multiply by the price of one metre.', 'Cari keliling persegi panjang 14 m kali 10 m, lalu kalikan dengan harga satu meter.'),
              ],
              explain: L(
                'The perimeter is $2 \\times (14 + 10) = 48$ m. The cost is $48 \\times 5\\,000 = 240\\,000$ rupiah.',
                'Kelilingnya $2 \\times (14 + 10) = 48$ m. Biayanya $48 \\times 5\\,000 = 240\\,000$ rupiah.',
              ),
              solution: ['2 \\times (14 + 10) = 48', '48 \\times 5\\,000 = 240\\,000'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m8-s2-p',
        runtime: 'math',
        title: L('Round and Round', 'Berkeliling'),
        brief: L(
          'Find perimeters of simple shapes, work backwards to a missing side, and fence a garden with a gap for the gate.',
          'Cari keliling bangun sederhana, hitung mundur untuk sisi yang hilang, dan pagari sebuah kebun dengan celah untuk pintu.',
        ),
        requirements: [
          L('Find the perimeter of triangles, quadrilaterals and regular polygons.', 'Mencari keliling segitiga, segiempat, dan segi banyak beraturan.'),
          L('Find a missing side and the perimeter of an L-shaped figure.', 'Mencari sisi yang hilang dan keliling bangun berbentuk L.'),
        ],
        hints: [
          L('Perimeter is the distance all the way round. Count or add every side of the outline.', 'Keliling adalah jarak sepanjang sisi luar. Hitung atau jumlahkan setiap sisi garis luar.'),
          L('For a missing side, add the sides you know and see what is left of the perimeter.', 'Untuk sisi yang hilang, jumlahkan sisi yang diketahui lalu lihat sisa dari kelilingnya.'),
          L('For an L-shape, find the missing sides from opposite sides, or use the rectangle around it.', 'Untuk bangun L, cari sisi yang hilang dari sisi yang berhadapan, atau pakai persegi panjang yang membungkusnya.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Each little side of the grid is 1 cm. How long is the border of the rectangle?',
              'Tiap sisi kecil pada kotak-kotak ini panjangnya 1 cm. Berapa panjang pinggir persegi panjang itu?',
            ),
            figure: {
              ...gridPerim(5, 3, ['5', '3']),
              caption: L('A rectangle on a grid. The red border is the perimeter.', 'Persegi panjang pada kotak-kotak. Garis tepi merah adalah keliling.'),
            },
            blanks: [num(16, CM)],
            solution: ['5 + 3 + 5 + 3 = 16', '2 \\times (5 + 3) = 16'],
          },
          {
            prompt: L(
              'A rectangle has a perimeter of 36 cm and a length of 11 cm. How wide is it?',
              'Sebuah persegi panjang mempunyai keliling 36 cm dan panjang 11 cm. Berapa lebarnya?',
            ),
            blanks: [num(7, CM)],
            solution: ['36 \\div 2 = 18', '18 - 11 = 7'],
          },
          {
            prompt: L(
              'Citra sews ribbon along the edges of triangular flags. Each flag has sides of 40 cm, 40 cm and 30 cm. She makes 5 flags. How many cm of ribbon does she need in all?',
              'Citra menjahit pita di sepanjang tepi bendera-bendera segitiga. Tiap bendera punya sisi 40 cm, 40 cm, dan 30 cm. Ia membuat 5 bendera. Berapa cm pita yang ia butuhkan seluruhnya?',
            ),
            figure: {
              ...scene([{ pts: [[0, 0], [3, 0], [1.5, 4]], eq: [[1, 1], [2, 1]], sides: ['30 cm', '40 cm', '40 cm'] }]),
              caption: L('One flag. The red ticks mark equal sides.', 'Satu bendera. Tanda merah menunjukkan sisi yang sama panjang.'),
            },
            blanks: [num(550, CM)],
            solution: ['40 + 40 + 30 = 110', '5 \\times 110 = 550'],
          },
          {
            prompt: L(
              'Pak Budi wants to fence this L-shaped garden. The fence goes all round the garden, except for a gate 2 m wide. Write the perimeter of the garden, and how many metres of fence he needs.',
              'Pak Budi ingin memagari kebun berbentuk L ini. Pagar dipasang mengelilingi kebun, kecuali untuk pintu gerbang selebar 2 m. Tulis keliling kebun itu, dan berapa meter pagar yang ia butuhkan.',
            ),
            figure: {
              ...scene(
                [{ pts: [[0, 0], [16, 0], [16, 5], [7, 5], [7, 9], [0, 9]], sides: ['16 m', '5 m', undefined, undefined, '7 m', '9 m'] }],
                [helper([16, 5], [16, 9], 'b'), helper([7, 9], [16, 9], 'b')],
              ),
              caption: L('The L-shaped garden.', 'Kebun berbentuk L.'),
            },
            blanks: [
              num(50, M, L('\\text{perimeter: }', '\\text{keliling: }')),
              num(48, M, L('\\text{fence: }', '\\text{pagar: }')),
            ],
            solution: {
              en: ['\\text{rectangle around the garden: } 16 \\text{ by } 9', '2 \\times (16 + 9) = 50', '50 - 2 = 48'],
              id: ['\\text{persegi panjang di sekeliling kebun: } 16 \\text{ kali } 9', '2 \\times (16 + 9) = 50', '50 - 2 = 48'],
            },
          },
        ],
      },
    },
    /* ================================================================== S3 area */
    {
      id: 'tka-m8-s3',
      title: { en: 'Area', id: 'Luas' },
      summary: {
        en: 'Area is how much surface a shape covers. You will count unit squares, then use formulas for rectangles, triangles, parallelograms, trapezoids, kites and rhombuses.',
        id: 'Luas adalah seberapa banyak permukaan yang ditutupi sebuah bangun. Kamu akan menghitung persegi satuan, lalu memakai rumus luas persegi panjang, segitiga, jajargenjang, trapesium, layang-layang, dan belah ketupat.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m8-s3-l1',
          title: { en: 'Area of Squares, Rectangles, Triangles and Parallelograms', id: 'Luas Persegi, Persegi Panjang, Segitiga, dan Jajargenjang' },
          goal: {
            en: 'You can find the area of a square, a rectangle, a parallelogram and a triangle.',
            id: 'Kamu bisa mencari luas persegi, persegi panjang, jajargenjang, dan segitiga.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Covering a Floor', 'Ayo Amati: Menutupi Lantai'),
              body: L(
                `Dewi covers a small floor with square tiles. Each tile is 1 m long and 1 m wide. The floor is 5 tiles long and 3 tiles wide, so it takes 3 rows of 5 tiles: $3 \\times 5 = 15$ tiles.\n\nThe **area** of a shape is how much surface it covers. We count it in unit squares. A square with sides of 1 m is **1 square metre** (1 m²), and a square with sides of 1 cm is 1 square centimetre (1 cm²). So this floor has an area of 15 m².\n\nCounting is slow, so we multiply. Area of a rectangle $=$ length $\\times$ width. A square has equal sides, so its area is side $\\times$ side.`,
                `Dewi menutupi sebuah lantai kecil dengan ubin persegi. Tiap ubin panjangnya 1 m dan lebarnya 1 m. Lantai itu panjangnya 5 ubin dan lebarnya 3 ubin, jadi ada 3 baris yang masing-masing berisi 5 ubin: $3 \\times 5 = 15$ ubin.\n\n**Luas** sebuah bangun adalah seberapa banyak permukaan yang ditutupinya. Kita menghitungnya dengan persegi satuan. Persegi dengan sisi 1 m adalah **1 meter persegi** (1 m²), dan persegi dengan sisi 1 cm adalah 1 sentimeter persegi (1 cm²). Jadi luas lantai ini 15 m².\n\nMenghitung satu per satu itu lambat, jadi kita mengalikan. Luas persegi panjang $=$ panjang $\\times$ lebar. Persegi punya sisi yang sama, jadi luasnya sisi $\\times$ sisi.`,
              ),
              figure: {
                ...gridRect({ cols: 5, rows: 3, shade: 15, dims: ['5 m', '3 m'] }),
                caption: L('15 tiles of 1 m² each cover the floor: 3 rows of 5.', '15 ubin seluas 1 m² masing-masing menutupi lantai: 3 baris berisi 5.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Area of a Triangle', 'Contoh Bertahap: Luas Segitiga'),
              body: L(
                `Find the area of a triangle with base 8 cm and height 5 cm. The **height** is the straight distance from the top corner down to the base. It makes a square corner with the base.\n\n1. Step 1: Make a second copy of the triangle and turn it upside down. Put the two together: they make a **parallelogram**.\n2. Step 2: The area of a parallelogram is base times height: $8 \\times 5 = 40$ cm². (Cut a triangle off one end and move it to the other end, and you get a rectangle with the same base and height.)\n3. Step 3: The triangle is only half of the parallelogram: $40 \\div 2 = 20$ cm².\n4. Step 4: Write the unit. The area is 20 cm².\n\n**Remember:**\n\n| Shape | Area |\n| --- | --- |\n| Rectangle | length × width |\n| Square | side × side |\n| Parallelogram | base × height |\n| Triangle | ½ × base × height |\n\nThe height always makes a square corner with the base. It is not the slanted side.`,
                `Cari luas segitiga dengan alas 8 cm dan tinggi 5 cm. **Tinggi** adalah jarak lurus dari titik sudut atas ke alas. Tinggi membentuk sudut siku-siku dengan alas.\n\n1. Langkah 1: Buat salinan kedua segitiga itu dan putar terbalik. Gabungkan keduanya: jadilah sebuah **jajargenjang**.\n2. Langkah 2: Luas jajargenjang adalah alas kali tinggi: $8 \\times 5 = 40$ cm². (Potong sebuah segitiga dari satu ujung dan pindahkan ke ujung lainnya, maka kamu mendapat persegi panjang dengan alas dan tinggi yang sama.)\n3. Langkah 3: Segitiga hanya setengah dari jajargenjang: $40 \\div 2 = 20$ cm².\n4. Langkah 4: Tulis satuannya. Luasnya 20 cm².\n\n**Ingat:**\n\n| Bangun | Luas |\n| --- | --- |\n| Persegi panjang | panjang × lebar |\n| Persegi | sisi × sisi |\n| Jajargenjang | alas × tinggi |\n| Segitiga | ½ × alas × tinggi |\n\nTinggi selalu membentuk sudut siku-siku dengan alas. Tinggi bukan sisi yang miring.`,
              ),
              figure: {
                ...scene(
                  [
                    { pts: [[0, 0], [8, 0], [6, 5]], color: 'a' },
                    { pts: [[8, 0], [14, 5], [6, 5]], color: 'b' },
                  ],
                  [...height([6, 5], [6, 0], [8, 0], '5 cm'), txt(4, -0.8, '8 cm')],
                ),
                caption: L(
                  'Two copies of the triangle make a parallelogram with base 8 cm and height 5 cm.',
                  'Dua salinan segitiga membentuk jajargenjang dengan alas 8 cm dan tinggi 5 cm.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Area Mistakes', 'Awas, Jebakan!: Kesalahan pada Luas'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| A parallelogram with base 8 cm, slanted side 6 cm and height 5 cm has area $8 \\times 6 = 48$ cm². | Use the height, not the slanted side: $8 \\times 5 = 40$ cm². |\n| A triangle with base 8 cm and height 5 cm has area $8 \\times 5 = 40$ cm². | A triangle is half of a parallelogram: $\\frac{1}{2} \\times 8 \\times 5 = 20$ cm². |\n| A rectangle 12 m long and 5 m wide has area $12 + 5 = 17$ m². | Area counts the squares that cover the surface: $12 \\times 5 = 60$ m². |`,
                `| Salah | Benar |\n| --- | --- |\n| Jajargenjang dengan alas 8 cm, sisi miring 6 cm, dan tinggi 5 cm mempunyai luas $8 \\times 6 = 48$ cm². | Pakai tinggi, bukan sisi miring: $8 \\times 5 = 40$ cm². |\n| Segitiga dengan alas 8 cm dan tinggi 5 cm mempunyai luas $8 \\times 5 = 40$ cm². | Segitiga adalah setengah jajargenjang: $\\frac{1}{2} \\times 8 \\times 5 = 20$ cm². |\n| Persegi panjang dengan panjang 12 m dan lebar 5 m mempunyai luas $12 + 5 = 17$ m². | Luas adalah banyak persegi yang menutupi permukaan: $12 \\times 5 = 60$ m². |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('What is the area of this parallelogram?', 'Berapa luas jajargenjang ini?'),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [10, 0], [13, 4], [3, 4]], sides: ['10 cm', '5 cm'] }],
                  height([3, 4], [3, 0], [10, 0], '4 cm'),
                ),
                caption: L('The dashed line is the height. It makes a square corner with the base.', 'Garis putus-putus adalah tinggi. Garis ini membentuk sudut siku-siku dengan alas.'),
              },
              options: [L('40 cm²', '40 cm²'), L('50 cm²', '50 cm²'), L('20 cm²', '20 cm²'), L('15 cm²', '15 cm²')],
              answer: 0,
              explain: L(
                'Area $=$ base $\\times$ height $= 10 \\times 4 = 40$ cm². Using the slanted side gives 50, forgetting that this is a parallelogram and halving gives 20, and adding the numbers gives 15.',
                'Luas $=$ alas $\\times$ tinggi $= 10 \\times 4 = 40$ cm². Memakai sisi miring menghasilkan 50, menganggapnya segitiga lalu membagi dua menghasilkan 20, dan menjumlahkan angkanya menghasilkan 15.',
              ),
              hint: L(
                'Which line makes a square corner with the base? Use that line, not the slanted side.',
                'Garis mana yang membentuk sudut siku-siku dengan alas? Pakai garis itu, bukan sisi miring.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the area of the triangle with base 8 cm and height 5 cm.',
                'Coba bersama: luas segitiga dengan alas 8 cm dan tinggi 5 cm.',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [8, 0], [6, 5]] }],
                  [...height([6, 5], [6, 0], [8, 0], '5 cm'), txt(4, -0.8, '8 cm')],
                ),
                caption: L('A triangle with its height drawn.', 'Sebuah segitiga dengan tingginya.'),
              },
              template: '\\frac{1}{2} \\times 8 \\times 5 = \\frac{1}{2} \\times ___ = ___',
              blanks: ['40', '20'],
              explain: L(
                '$8 \\times 5 = 40$, and half of 40 is 20. The area is 20 cm².',
                '$8 \\times 5 = 40$, dan setengah dari 40 adalah 20. Luasnya 20 cm².',
              ),
              hint: L(
                'Multiply the base by the height first. A triangle is half of that.',
                'Kalikan dulu alas dengan tinggi. Segitiga adalah setengah dari hasilnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L('What is the area of this triangle?', 'Berapa luas segitiga ini?'),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [12, 0], [4, 9]], sides: ['12 cm'] }],
                  height([4, 9], [4, 0], [12, 0], '9 cm'),
                ),
                caption: L('The dashed line is the height of the triangle.', 'Garis putus-putus adalah tinggi segitiga.'),
              },
              options: [L('54 cm²', '54 cm²'), L('108 cm²', '108 cm²'), L('21 cm²', '21 cm²'), L('27 cm²', '27 cm²')],
              answer: 0,
              explain: L(
                'Area $= \\frac{1}{2} \\times 12 \\times 9 = 54$ cm². Forgetting the half gives 108, adding gives 21, and halving twice gives 27.',
                'Luas $= \\frac{1}{2} \\times 12 \\times 9 = 54$ cm². Lupa setengahnya menghasilkan 108, menjumlahkan menghasilkan 21, dan membagi dua dua kali menghasilkan 27.',
              ),
              hint: L(
                'Pick the base and the height that make a square corner. Multiply them, then take half.',
                'Pilih alas dan tinggi yang membentuk sudut siku-siku. Kalikan keduanya, lalu ambil setengahnya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose TWO correct statements.', 'Pilih DUA pernyataan yang benar.'),
              options: [
                L('A square with side 7 cm has an area of 49 cm².', 'Persegi dengan sisi 7 cm mempunyai luas 49 cm².'),
                L('A rectangle 9 m long and 4 m wide has an area of 36 m².', 'Persegi panjang dengan panjang 9 m dan lebar 4 m mempunyai luas 36 m².'),
                L('A triangle with base 10 cm and height 6 cm has an area of 60 cm².', 'Segitiga dengan alas 10 cm dan tinggi 6 cm mempunyai luas 60 cm².'),
                L('A parallelogram with base 6 cm and height 5 cm has an area of 11 cm².', 'Jajargenjang dengan alas 6 cm dan tinggi 5 cm mempunyai luas 11 cm².'),
              ],
              answer: [0, 1],
              explain: L(
                '$7 \\times 7 = 49$ and $9 \\times 4 = 36$ are right. The triangle is half of $10 \\times 6$, so 30 cm². The parallelogram is $6 \\times 5 = 30$ cm², not $6 + 5$.',
                '$7 \\times 7 = 49$ dan $9 \\times 4 = 36$ benar. Segitiga itu setengah dari $10 \\times 6$, jadi 30 cm². Jajargenjang itu $6 \\times 5 = 30$ cm², bukan $6 + 5$.',
              ),
              hint: L(
                'Work out each area yourself. Remember the half for a triangle.',
                'Hitung sendiri tiap luasnya. Ingat setengah untuk segitiga.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps in order to find the area of a triangle with base 14 cm and height 6 cm.',
                'Urutkan langkah untuk mencari luas segitiga dengan alas 14 cm dan tinggi 6 cm.',
              ),
              lines: {
                en: [
                  '\\text{base } = 14 \\text{ cm}, \\quad \\text{height } = 6 \\text{ cm}',
                  '14 \\times 6 = 84',
                  '84 \\div 2 = 42',
                  '\\text{area } = 42 \\text{ cm}^2',
                ],
                id: [
                  '\\text{alas } = 14 \\text{ cm}, \\quad \\text{tinggi } = 6 \\text{ cm}',
                  '14 \\times 6 = 84',
                  '84 \\div 2 = 42',
                  '\\text{luas } = 42 \\text{ cm}^2',
                ],
              },
              explain: L(
                'First read the base and the height. Multiply them, take half because it is a triangle, and finish with the unit.',
                'Pertama baca alas dan tingginya. Kalikan keduanya, ambil setengahnya karena bentuknya segitiga, dan akhiri dengan satuan.',
              ),
              hint: L(
                'You cannot multiply before you know the numbers. The answer with its unit comes last.',
                'Kamu tidak bisa mengalikan sebelum tahu angkanya. Jawaban beserta satuannya datang paling akhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A park is shaped like the parallelogram in the picture. Pak Budi plants grass over the whole park. What is the area of the grass?',
                'Sebuah taman berbentuk jajargenjang seperti pada gambar. Pak Budi menanam rumput di seluruh taman. Berapa luas rumput itu?',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [20, 0], [29, 12], [9, 12]], sides: ['20 m', '15 m'] }],
                  height([9, 12], [9, 0], [20, 0], '12 m'),
                ),
                caption: L('The park. The dashed line is its height.', 'Taman itu. Garis putus-putus adalah tingginya.'),
              },
              blanks: [num(240, M2)],
              hints: [
                L('Area of a parallelogram: which two lengths make a square corner?', 'Luas jajargenjang: dua panjang mana yang membentuk sudut siku-siku?',),
                L('Use the base and the height. The slanted side is not needed.', 'Pakai alas dan tinggi. Sisi miring tidak diperlukan.'),
                L('Multiply the base (20 m) by the height.', 'Kalikan alas (20 m) dengan tinggi.'),
              ],
              explain: L(
                'Area $=$ base $\\times$ height $= 20 \\times 12 = 240$ m². The 15 m slanted side is not used.',
                'Luas $=$ alas $\\times$ tinggi $= 20 \\times 12 = 240$ m². Sisi miring 15 m tidak dipakai.',
              ),
              solution: ['20 \\times 12 = 240'],
            },
          ],
        },
        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m8-s3-l2',
          title: { en: 'Area of Trapezoids, Kites, Rhombuses and Combined Shapes', id: 'Luas Trapesium, Layang-layang, Belah Ketupat, dan Bangun Gabungan' },
          goal: {
            en: 'You can find the area of a trapezoid, a kite, a rhombus and a combined shape, and tell perimeter from area.',
            id: 'Kamu bisa mencari luas trapesium, layang-layang, belah ketupat, dan bangun gabungan, serta membedakan keliling dari luas.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Two Trapezoids Make One Parallelogram', 'Ayo Amati: Dua Trapesium Menjadi Satu Jajargenjang'),
              body: L(
                `Pak Eko has a fishpond shaped like a trapezoid. Its top is 6 m, its bottom is 10 m, and the distance between them is 4 m. Make a second copy of the pond, turn it upside down and put it next to the first. The two ponds make a **parallelogram**.\n\nThe base of this parallelogram is $10 + 6 = 16$ m and its height is 4 m, so its area is $16 \\times 4 = 64$ m². One pond is half of that: $64 \\div 2 = 32$ m².\n\nSo the area of a trapezoid is $\\frac{1}{2} \\times (\\text{top} + \\text{bottom}) \\times \\text{height}$, where top and bottom are the two parallel sides.`,
                `Pak Eko punya kolam ikan berbentuk trapesium. Sisi atasnya 6 m, sisi bawahnya 10 m, dan jarak antara keduanya 4 m. Buat salinan kedua kolam itu, putar terbalik, dan letakkan di sebelah kolam pertama. Kedua kolam membentuk sebuah **jajargenjang**.\n\nAlas jajargenjang ini $10 + 6 = 16$ m dan tingginya 4 m, jadi luasnya $16 \\times 4 = 64$ m². Satu kolam adalah setengahnya: $64 \\div 2 = 32$ m².\n\nJadi luas trapesium adalah $\\frac{1}{2} \\times (\\text{sisi atas} + \\text{sisi bawah}) \\times \\text{tinggi}$, dengan sisi atas dan sisi bawah adalah dua sisi yang sejajar.`,
              ),
              figure: {
                ...scene(
                  [
                    { pts: [[0, 0], [10, 0], [8, 4], [2, 4]], color: 'a' },
                    { pts: [[10, 0], [16, 0], [18, 4], [8, 4]], color: 'b' },
                  ],
                  [...height([8, 4], [8, 0], [10, 0], '4 m'), txt(5, -0.8, '10 m'), txt(13, -0.8, '6 m'), txt(5, 4.8, '6 m'), txt(13, 4.8, '10 m')],
                ),
                caption: L(
                  'Two trapezoids make a parallelogram with base 16 m and height 4 m.',
                  'Dua trapesium membentuk jajargenjang dengan alas 16 m dan tinggi 4 m.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Rhombus and Kite', 'Contoh Bertahap: Belah Ketupat dan Layang-layang'),
              body: L(
                `A rhombus has diagonals of 10 cm and 6 cm. Find its area. A **diagonal** is a line from one corner to the opposite corner.\n\n1. Step 1: Draw the two diagonals. They cross at a square corner.\n2. Step 2: Draw a rectangle around the rhombus. Its sides are the two diagonals: $10 \\times 6 = 60$ cm².\n3. Step 3: The rhombus fills exactly half of that rectangle: $60 \\div 2 = 30$ cm².\n4. Step 4: Write the unit. The area is 30 cm².\n\n**Remember:**\n\n| Shape | Area |\n| --- | --- |\n| Trapezoid | ½ × (top + bottom) × height |\n| Kite | ½ × diagonal × diagonal |\n| Rhombus | ½ × diagonal × diagonal |`,
                `Sebuah belah ketupat punya diagonal 10 cm dan 6 cm. Cari luasnya. **Diagonal** adalah garis dari satu sudut ke sudut yang berhadapan.\n\n1. Langkah 1: Gambar kedua diagonalnya. Keduanya berpotongan membentuk sudut siku-siku.\n2. Langkah 2: Gambar persegi panjang di sekeliling belah ketupat. Sisinya adalah kedua diagonal: $10 \\times 6 = 60$ cm².\n3. Langkah 3: Belah ketupat mengisi tepat setengah persegi panjang itu: $60 \\div 2 = 30$ cm².\n4. Langkah 4: Tulis satuannya. Luasnya 30 cm².\n\n**Ingat:**\n\n| Bangun | Luas |\n| --- | --- |\n| Trapesium | ½ × (sisi atas + sisi bawah) × tinggi |\n| Layang-layang | ½ × diagonal × diagonal |\n| Belah ketupat | ½ × diagonal × diagonal |`,
              ),
              figure: {
                ...scene(
                  [{ pts: [[5, 0], [10, 3], [5, 6], [0, 3]] }],
                  [
                    line([0, 0], [10, 0], 'muted', { dashed: true, width: 2 }),
                    line([10, 0], [10, 6], 'muted', { dashed: true, width: 2 }),
                    line([10, 6], [0, 6], 'muted', { dashed: true, width: 2 }),
                    line([0, 6], [0, 0], 'muted', { dashed: true, width: 2 }),
                    dash([0, 3], [10, 3], 'result', 0),
                    dash([5, 0], [5, 6], 'result', 0),
                    txt(5, -0.8, '10 cm'),
                    txt(-0.4, 3, '6 cm', 'md', 'muted', 'end'),
                  ],
                ),
                caption: L(
                  'The rhombus with its two diagonals (red). The grey dashed rectangle around it has sides of 10 cm and 6 cm.',
                  'Belah ketupat dengan kedua diagonalnya (merah). Persegi panjang abu-abu putus-putus di sekelilingnya bersisi 10 cm dan 6 cm.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Combined Shapes', 'Contoh Bertahap: Bangun Gabungan'),
              body: L(
                `Pak Eko paints a wall that is 8 m long and 5 m high. A door, 2 m wide and 3 m high, is not painted. How big is the area to paint?\n\n1. Step 1: Find the area of the whole wall, as if it had no door: $8 \\times 5 = 40$ m².\n2. Step 2: Find the area of the door: $2 \\times 3 = 6$ m².\n3. Step 3: Take the door away: $40 - 6 = 34$ m².\n4. Step 4: Write the unit. Pak Eko paints 34 m².\n\n**Remember:** there are two ways to find the area of a combined shape.\n\n- **Split** it into simple shapes, find each area and add them up.\n- **Subtract**: take a big simple shape and take away the part that is missing, like a hole, a door or a window.`,
                `Pak Eko mengecat dinding yang panjangnya 8 m dan tingginya 5 m. Sebuah pintu, lebar 2 m dan tinggi 3 m, tidak dicat. Berapa luas yang harus dicat?\n\n1. Langkah 1: Cari luas seluruh dinding, seolah-olah tidak ada pintu: $8 \\times 5 = 40$ m².\n2. Langkah 2: Cari luas pintu: $2 \\times 3 = 6$ m².\n3. Langkah 3: Kurangi dengan pintu: $40 - 6 = 34$ m².\n4. Langkah 4: Tulis satuannya. Pak Eko mengecat 34 m².\n\n**Ingat:** ada dua cara mencari luas bangun gabungan.\n\n- **Pisahkan** menjadi bangun-bangun sederhana, cari luas tiap bagian, lalu jumlahkan.\n- **Kurangkan**: ambil bangun sederhana yang besar dan kurangi dengan bagian yang tidak ada, seperti lubang, pintu, atau jendela.`,
              ),
              figure: {
                ...scene(
                  [
                    { pts: [[0, 0], [8, 0], [8, 5], [0, 5]], sides: ['8 m', undefined, undefined, '5 m'] },
                    { pts: [[3, 0], [5, 0], [5, 3], [3, 3]], color: 'b' },
                  ],
                  [txt(4, 1.5, '2 × 3', 'sm', 'muted')],
                ),
                caption: L('The wall (green) and the door (orange).', 'Dinding (hijau) dan pintu (oranye).'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Perimeter or Area?', 'Awas, Jebakan!: Keliling atau Luas?'),
              body: L(
                `Perimeter and area answer different questions.\n\n| Think of | Perimeter | Area |\n| --- | --- | --- |\n| The question | How far round? | How much surface? |\n| Examples | a fence, a ribbon | tiles, paint, grass |\n| Unit | cm, m | cm², m² |\n\nThese mistakes happen a lot.\n\n| Wrong | Right |\n| --- | --- |\n| A trapezoid with top 6 cm, bottom 10 cm and height 4 cm has area $(6 + 10) \\times 4 = 64$ cm². | That is the parallelogram. The trapezoid is half of it: $\\frac{1}{2} \\times 16 \\times 4 = 32$ cm². |\n| A rhombus with diagonals 10 cm and 6 cm has area $10 \\times 6 = 60$ cm². | That is the rectangle around it. The rhombus is half: 30 cm². |\n| To buy tiles for a floor, find the perimeter. | Tiles cover the surface, so find the area. |`,
                `Keliling dan luas menjawab pertanyaan yang berbeda.\n\n| Pikirkan | Keliling | Luas |\n| --- | --- | --- |\n| Pertanyaannya | Berapa jauh sekelilingnya? | Berapa banyak permukaannya? |\n| Contoh | pagar, pita | ubin, cat, rumput |\n| Satuan | cm, m | cm², m² |\n\nKesalahan berikut sering terjadi.\n\n| Salah | Benar |\n| --- | --- |\n| Trapesium dengan sisi atas 6 cm, sisi bawah 10 cm, dan tinggi 4 cm mempunyai luas $(6 + 10) \\times 4 = 64$ cm². | Itu luas jajargenjangnya. Trapesium adalah setengahnya: $\\frac{1}{2} \\times 16 \\times 4 = 32$ cm². |\n| Belah ketupat dengan diagonal 10 cm dan 6 cm mempunyai luas $10 \\times 6 = 60$ cm². | Itu luas persegi panjang di sekelilingnya. Belah ketupat adalah setengahnya: 30 cm². |\n| Untuk membeli ubin lantai, cari kelilingnya. | Ubin menutupi permukaan, jadi cari luasnya. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('What is the area of this trapezoid?', 'Berapa luas trapesium ini?'),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [12, 0], [10, 5], [2, 5]], sides: ['12 cm', undefined, '8 cm'] }],
                  height([10, 5], [10, 0], [12, 0], '5 cm'),
                ),
                caption: L('A trapezoid. The dashed line is its height.', 'Sebuah trapesium. Garis putus-putus adalah tingginya.'),
              },
              options: [L('50 cm²', '50 cm²'), L('100 cm²', '100 cm²'), L('60 cm²', '60 cm²'), L('40 cm²', '40 cm²')],
              answer: 0,
              explain: L(
                'Area $= \\frac{1}{2} \\times (8 + 12) \\times 5 = 50$ cm². Forgetting the half gives 100, using only the bottom gives 60, and using only the top gives 40.',
                'Luas $= \\frac{1}{2} \\times (8 + 12) \\times 5 = 50$ cm². Lupa setengahnya menghasilkan 100, memakai sisi bawah saja menghasilkan 60, dan memakai sisi atas saja menghasilkan 40.',
              ),
              hint: L(
                'Add the two parallel sides first. Then multiply by the height and take half.',
                'Jumlahkan dulu kedua sisi yang sejajar. Lalu kalikan dengan tinggi dan ambil setengahnya.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a kite has diagonals of 8 cm and 6 cm. Find its area.',
                'Coba bersama: sebuah layang-layang punya diagonal 8 cm dan 6 cm. Cari luasnya.',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, -3], [3, 0], [0, 5], [-3, 0]] }],
                  [dash([0, -3], [0, 5], 'result', 0), dash([-3, 0], [3, 0], 'result', 0), txt(0.2, 2.2, '8 cm', 'sm', 'muted', 'start'), txt(1.5, 0.6, '6 cm', 'sm', 'muted')],
                ),
                caption: L('A kite with its two diagonals (red).', 'Layang-layang dengan kedua diagonalnya (merah).'),
              },
              template: '\\frac{1}{2} \\times 8 \\times 6 = \\frac{1}{2} \\times ___ = ___',
              blanks: ['48', '24'],
              explain: L(
                '$8 \\times 6 = 48$, and half of 48 is 24. The area is 24 cm².',
                '$8 \\times 6 = 48$, dan setengah dari 48 adalah 24. Luasnya 24 cm².',
              ),
              hint: L(
                'Multiply the two diagonals first. The kite is half of that rectangle.',
                'Kalikan dulu kedua diagonalnya. Layang-layang adalah setengah dari persegi panjang itu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The house shape is a rectangle with a triangle on top (the dashed line is where they join). What is its area?',
                'Bangun rumah ini adalah persegi panjang dengan segitiga di atasnya (garis putus-putus adalah tempat keduanya bergabung). Berapa luasnya?',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [10, 0], [10, 6], [5, 10], [0, 6]], sides: ['10 cm', undefined, undefined, undefined, '6 cm'] }],
                  [helper([0, 6], [10, 6]), ...height([5, 10], [5, 6], [10, 6], '4 cm')],
                ),
                caption: L('A rectangle and a triangle joined together.', 'Sebuah persegi panjang dan sebuah segitiga yang digabung.'),
              },
              options: [L('80 cm²', '80 cm²'), L('100 cm²', '100 cm²'), L('60 cm²', '60 cm²'), L('20 cm²', '20 cm²')],
              answer: 0,
              explain: L(
                'Split it: the rectangle is $10 \\times 6 = 60$ cm² and the triangle is $\\frac{1}{2} \\times 10 \\times 4 = 20$ cm². Together $60 + 20 = 80$ cm². Forgetting the half of the triangle gives 100, the rectangle alone gives 60, and the triangle alone gives 20.',
                'Pisahkan: persegi panjangnya $10 \\times 6 = 60$ cm² dan segitiganya $\\frac{1}{2} \\times 10 \\times 4 = 20$ cm². Jumlahnya $60 + 20 = 80$ cm². Lupa setengah pada segitiga menghasilkan 100, persegi panjang saja menghasilkan 60, dan segitiga saja menghasilkan 20.',
              ),
              hint: L(
                'Find the area of the rectangle and the area of the triangle separately. Then put them together.',
                'Cari luas persegi panjang dan luas segitiga secara terpisah. Lalu gabungkan.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('To buy a fence for a garden, you find the perimeter.', 'Untuk membeli pagar sebuah kebun, kamu mencari keliling.'),
                L('To buy tiles for a floor, you find the perimeter.', 'Untuk membeli ubin sebuah lantai, kamu mencari keliling.'),
                L('Area is measured in units such as cm² or m².', 'Luas diukur dalam satuan seperti cm² atau m².'),
                L('Two shapes with the same perimeter always have the same area.', 'Dua bangun dengan keliling yang sama selalu mempunyai luas yang sama.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'A fence goes round, so it is a perimeter. Tiles cover the surface, so they are an area. A 6 cm by 2 cm rectangle and a 4 cm by 4 cm square both have a perimeter of 16 cm, but their areas are 12 cm² and 16 cm².',
                'Pagar melingkari, jadi itu keliling. Ubin menutupi permukaan, jadi itu luas. Persegi panjang 6 cm kali 2 cm dan persegi 4 cm kali 4 cm sama-sama berkeliling 16 cm, tetapi luasnya 12 cm² dan 16 cm².',
              ),
              hint: L(
                'Ask yourself: is it about going round the edge, or about covering the surface?',
                'Tanyakan pada dirimu: apakah ini tentang mengelilingi pinggir, atau menutupi permukaan?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Budi covers the L-shaped terrace in the picture with tiles. The tiles cost Rp10,000 for each m². How much do the tiles cost?',
                'Pak Budi menutupi teras berbentuk L pada gambar dengan ubin. Harga ubin Rp10.000 untuk tiap m². Berapa biaya ubin itu?',
              ),
              figure: {
                ...scene(
                  [{ pts: [[0, 0], [10, 0], [10, 4], [5, 4], [5, 7], [0, 7]], sides: ['10 m', '4 m', undefined, undefined, '5 m', '7 m'] }],
                  [helper([5, 4], [0, 4], 'b')],
                ),
                caption: L(
                  'The terrace. The dashed line splits it into two rectangles.',
                  'Teras itu. Garis putus-putus membaginya menjadi dua persegi panjang.',
                ),
              },
              blanks: [num(550000, undefined, '\\text{Rp}')],
              hints: [
                L('Tiles cover the surface, so first find the area of the terrace.', 'Ubin menutupi permukaan, jadi cari dulu luas teras.'),
                L('Use the dashed line to split the terrace into two rectangles. The top one is 5 m wide and $7 - 4 = 3$ m high.', 'Pakai garis putus-putus untuk membagi teras menjadi dua persegi panjang. Yang atas lebarnya 5 m dan tingginya $7 - 4 = 3$ m.'),
                L('Add the two areas. Then multiply by the price of one m².', 'Jumlahkan kedua luasnya. Lalu kalikan dengan harga satu m².'),
              ],
              explain: L(
                'The lower rectangle is $10 \\times 4 = 40$ m² and the upper one is $5 \\times 3 = 15$ m². The area is $40 + 15 = 55$ m², so the cost is $55 \\times 10\\,000 = 550\\,000$ rupiah.',
                'Persegi panjang bawah $10 \\times 4 = 40$ m² dan yang atas $5 \\times 3 = 15$ m². Luasnya $40 + 15 = 55$ m², jadi biayanya $55 \\times 10\\,000 = 550\\,000$ rupiah.',
              ),
              solution: ['10 \\times 4 = 40', '5 \\times (7 - 4) = 15', '40 + 15 = 55', '55 \\times 10\\,000 = 550\\,000'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m8-s3-p',
        runtime: 'math',
        title: L('How Much Surface?', 'Berapa Luas Permukaannya?'),
        brief: L(
          'Use the right area formula for each shape, then paint a wall with a door and windows.',
          'Pakai rumus luas yang tepat untuk tiap bangun, lalu cat sebuah dinding yang punya pintu dan jendela.',
        ),
        requirements: [
          L('Find the area of parallelograms, trapezoids and kites.', 'Mencari luas jajargenjang, trapesium, dan layang-layang.'),
          L('Find the area of a combined shape and its cost.', 'Mencari luas bangun gabungan dan biayanya.'),
        ],
        hints: [
          L('Pick the formula for the shape first. For a height, look for the line with a square corner.', 'Pilih dulu rumus untuk bangunnya. Untuk tinggi, cari garis yang membentuk sudut siku-siku.'),
          L('Triangles, trapezoids, kites and rhombuses all need a half. Do not forget it.', 'Segitiga, trapesium, layang-layang, dan belah ketupat semuanya memakai setengah. Jangan lupa.'),
          L('For the wall, find the area of the whole wall, then take away every window and door.', 'Untuk dinding, cari luas seluruh dinding, lalu kurangi dengan semua jendela dan pintu.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L('What is the area of this parallelogram?', 'Berapa luas jajargenjang ini?'),
            figure: {
              ...scene(
                [{ pts: [[0, 0], [9, 0], [17, 6], [8, 6]], sides: ['9 cm', '10 cm'] }],
                height([8, 6], [8, 0], [9, 0], '6 cm'),
              ),
              caption: L('A parallelogram. The dashed line is its height.', 'Sebuah jajargenjang. Garis putus-putus adalah tingginya.'),
            },
            blanks: [num(54, CM2)],
            solution: ['9 \\times 6 = 54'],
          },
          {
            prompt: L(
              'A fishpond is shaped like a trapezoid. Its two parallel sides are 14 m and 6 m, and the distance between them is 8 m. What is the area of the pond?',
              'Sebuah kolam ikan berbentuk trapesium. Kedua sisi sejajarnya 14 m dan 6 m, dan jarak antara keduanya 8 m. Berapa luas kolam itu?',
            ),
            figure: {
              ...scene(
                [{ pts: [[0, 0], [14, 0], [10, 8], [4, 8]], sides: ['14 m', undefined, '6 m'] }],
                height([10, 8], [10, 0], [14, 0], '8 m'),
              ),
              caption: L('The fishpond.', 'Kolam ikan itu.'),
            },
            blanks: [num(80, M2)],
            solution: ['\\frac{1}{2} \\times (14 + 6) \\times 8', '\\frac{1}{2} \\times 20 \\times 8 = 80'],
          },
          {
            prompt: L(
              'Dewi makes a kite from paper. The two sticks of the kite (its diagonals) are 40 cm and 30 cm long. What is the area of the paper kite?',
              'Dewi membuat layang-layang dari kertas. Kedua batang layang-layang itu (diagonalnya) panjangnya 40 cm dan 30 cm. Berapa luas layang-layang kertas itu?',
            ),
            figure: {
              ...scene(
                [{ pts: [[0, -3], [3, 0], [0, 5], [-3, 0]] }],
                [dash([0, -3], [0, 5], 'result', 0), dash([-3, 0], [3, 0], 'result', 0), txt(0.2, 2.2, '40 cm', 'sm', 'muted', 'start'), txt(1.5, 0.6, '30 cm', 'sm', 'muted')],
              ),
              caption: L('The kite with its two sticks (red).', 'Layang-layang dengan kedua batangnya (merah).'),
            },
            blanks: [num(600, CM2)],
            solution: ['\\frac{1}{2} \\times 40 \\times 30', '\\frac{1}{2} \\times 1\\,200 = 600'],
          },
          {
            prompt: L(
              'Pak Hasan paints this wall. It is 9 m long and 4 m high. It has two windows of 2 m by 1 m and one door of 2 m by 3 m, which are not painted. Paint costs Rp15,000 for each m². Write the area to paint and the cost of the paint.',
              'Pak Hasan mengecat dinding ini. Panjangnya 9 m dan tingginya 4 m. Dinding ini punya dua jendela berukuran 2 m kali 1 m dan satu pintu berukuran 2 m kali 3 m, yang tidak dicat. Harga cat Rp15.000 untuk tiap m². Tulis luas yang harus dicat dan biaya catnya.',
            ),
            figure: {
              ...scene(
                [
                  { pts: [[0, 0], [9, 0], [9, 4], [0, 4]], sides: ['9 m', undefined, undefined, '4 m'] },
                  { pts: [[0.8, 2], [2.8, 2], [2.8, 3], [0.8, 3]], color: 'b' },
                  { pts: [[3.5, 0], [5.5, 0], [5.5, 3], [3.5, 3]], color: 'c' },
                  { pts: [[6.2, 2], [8.2, 2], [8.2, 3], [6.2, 3]], color: 'b' },
                ],
                [txt(1.8, 2.5, '2 × 1', 'sm', 'muted'), txt(4.5, 1.5, '2 × 3', 'sm', 'muted'), txt(7.2, 2.5, '2 × 1', 'sm', 'muted')],
              ),
              caption: L('The wall with two windows (orange) and a door (gold).', 'Dinding dengan dua jendela (oranye) dan sebuah pintu (emas).'),
            },
            blanks: [
              num(26, M2, L('\\text{area: }', '\\text{luas: }')),
              num(390000, undefined, L('\\text{cost: Rp}', '\\text{biaya: Rp}')),
            ],
            solution: ['9 \\times 4 = 36', '2 \\times (2 \\times 1) = 4, \\quad 2 \\times 3 = 6', '36 - 4 - 6 = 26', '26 \\times 15\\,000 = 390\\,000'],
          },
        ],
      },
    },
  ],
}
