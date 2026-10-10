import type { Loc, Module } from '../types'
import type { Figure, FigItem } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import { fit, line, parallelLines, pythagorasSquares, shape, txt } from './figs'

/** Module 5 — angles (on a line, round a point, where two lines cross, between
 *  parallel lines, in a triangle), the Pythagorean theorem, and congruent and
 *  similar figures. Every drawing is built from the numbers in its caption, so a
 *  labeled side or angle is the real one. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

const rad = (d: number) => (d * Math.PI) / 180
const tidy = (n: number) => Number(n.toFixed(4))
const pol = (deg: number, r: number, c: Pt = [0, 0]): Pt => [tidy(c[0] + r * Math.cos(rad(deg))), tidy(c[1] + r * Math.sin(rad(deg)))]

/** A coordinate plane with the numbers on the axes; one unit is the same length across and up. */
const plane = (x: [number, number], y: [number, number], items: FigItem[]): Figure => ({
  dim: 2,
  xSpan: x,
  ySpan: y,
  aspect: Math.max(0.5, Math.min(3, (x[1] - x[0]) / (y[1] - y[0]))),
  ticks: true,
  items,
})

type RayOpts = {
  dirs: number[]
  len?: number
  at?: Pt
  arcs?: { from: number; to: number; label?: string }[]
  right?: [number, number]
}

/** Rays from one point, with an arc (and a name) for each angle worth naming. */
function raysParts(o: RayOpts): { items: FigItem[]; pts: Pt[] } {
  const c = o.at ?? [0, 0]
  const len = o.len ?? 4
  const items: FigItem[] = []
  const pts: Pt[] = [c]
  for (const d of o.dirs) {
    const end = pol(d, len, c)
    items.push(line(c, end, 'a', { width: 2.6 }))
    pts.push(end)
  }
  for (const a of o.arcs ?? []) items.push({ t: 'angle', at: c, from: pol(a.from, 1, c), to: pol(a.to, 1, c), label: a.label })
  if (o.right) items.push({ t: 'right', at: c, from: pol(o.right[0], 1, c), to: pol(o.right[1], 1, c) })
  return { items, pts }
}
const rays = (o: RayOpts): Piece => {
  const p = raysParts(o)
  return { dim: 2, axes: false, ...fit(p.pts, 0.6), items: p.items }
}

/** Two straight lines crossing; `labels[i]` names angle i (counterclockwise from the right). */
const crossing = (deg: number, labels: (string | undefined)[]): Piece =>
  rays({
    dirs: [0, deg, 180, 180 + deg],
    arcs: ([[0, deg], [deg, 180], [180, 180 + deg], [180 + deg, 360]] as [number, number][]).flatMap(([f, t], i) => (labels[i] ? [{ from: f, to: t, label: labels[i] }] : [])),
  })

/** A straight line with rays standing on it at the given angles; `labels[i]` names the i-th gap. */
const fan = (angles: number[], labels: (string | undefined)[]): Piece => {
  const dirs = [0, ...angles, 180]
  return rays({ dirs, arcs: dirs.slice(0, -1).flatMap((d, i) => (labels[i] ? [{ from: d, to: dirs[i + 1], label: labels[i] }] : [])) })
}

/** Left: 35 and its complement in a right angle. Right: 35 and its supplement on a line. */
function twoFans(): Piece {
  const A = raysParts({ dirs: [0, 35, 90], len: 3.5, arcs: [{ from: 0, to: 35, label: '35°' }, { from: 35, to: 90, label: '55°' }], right: [0, 90] })
  const B = raysParts({ dirs: [0, 35, 180], len: 3.5, at: [8.5, 0], arcs: [{ from: 0, to: 35, label: '35°' }, { from: 35, to: 180, label: '145°' }] })
  return { dim: 2, axes: false, ...fit([...A.pts, ...B.pts], 0.6), items: [...A.items, ...B.items] }
}

/** Triangle with angles A and B (degrees) on a base of the given length: corners A, B, C. */
const triFromAngles = (A: number, B: number, base: number): Pt[] => {
  const ac = (base * Math.sin(rad(B))) / Math.sin(rad(A + B))
  return [[0, 0], [base, 0], pol(A, ac)]
}

/** Triangle from its three sides: |P0P1| = c (the base), |P1P2| = a, |P2P0| = b. */
const triBySides = (a: number, b: number, c: number): Pt[] => {
  const x = (c * c + b * b - a * a) / (2 * c)
  return [[0, 0], [c, 0], [tidy(x), tidy(Math.sqrt(b * b - x * x))]]
}

/** Slide, flip and turn a set of points (the moves that keep a figure congruent). */
const place = (pts: Pt[], o: { rot?: number; flip?: boolean; dx?: number; dy?: number }): Pt[] =>
  pts.map(([x, y]) => {
    const fx = o.flip ? -x : x
    const r = rad(o.rot ?? 0)
    return [tidy(fx * Math.cos(r) - y * Math.sin(r) + (o.dx ?? 0)), tidy(fx * Math.sin(r) + y * Math.cos(r) + (o.dy ?? 0))] as Pt
  })

const arcAt = (at: Pt, from: Pt, to: Pt, label?: string): FigItem => ({ t: 'angle', at, from, to, label })

type ShapeOpts = Parameters<typeof shape>[0]
/** Two shapes side by side in one frame. */
const both = (a: ShapeOpts, b: ShapeOpts, pad = 1.3): Piece => {
  const extraPts = [...(a.extra ?? []), ...(b.extra ?? [])].flatMap((e) => (e.t === 'text' ? [e.at as Pt] : []))
  return { dim: 2, axes: false, ...fit([...a.pts, ...b.pts, ...extraPts], pad), items: [...shape(a).items, ...shape(b).items] }
}

/** Pythagoras' three squares with their unit cells drawn, so the cells can be counted. `c` must be a whole number. */
function pythGrid(a: number, b: number): Piece {
  const c = Math.round(Math.hypot(a, b))
  const base = pythagorasSquares({ a, b, names: [String(a * a), String(b * b), String(c * c)] })
  const g: FigItem[] = []
  for (let i = 1; i < a; i++) g.push(line([i, 0], [i, -a], 'muted', { width: 1 }), line([0, -i], [a, -i], 'muted', { width: 1 }))
  for (let i = 1; i < b; i++) g.push(line([-i, 0], [-i, b], 'muted', { width: 1 }), line([-b, i], [0, i], 'muted', { width: 1 }))
  const P0: Pt = [a, 0]
  const P1: Pt = [0, b]
  const P3: Pt = [a + b, a]
  const u: Pt = [(P1[0] - P0[0]) / c, (P1[1] - P0[1]) / c]
  const v: Pt = [(P3[0] - P0[0]) / c, (P3[1] - P0[1]) / c]
  for (let i = 1; i < c; i++) {
    const s: Pt = [P0[0] + i * u[0], P0[1] + i * u[1]]
    const t: Pt = [P0[0] + i * v[0], P0[1] + i * v[1]]
    g.push(line(s, [s[0] + c * v[0], s[1] + c * v[1]], 'muted', { width: 1 }), line(t, [t[0] + c * u[0], t[1] + c * u[1]], 'muted', { width: 1 }))
  }
  // the grid goes under the numbers: put the three numbers last
  const names = base.items.filter((i) => i.t === 'text')
  const rest = base.items.filter((i) => i.t !== 'text')
  return { ...base, items: [...rest, ...g, ...names] }
}

/** A right triangle with the right angle at the origin: legs `w` (horizontal) and `h` (vertical).
 *  `sides` label the bottom, the slanted side and the left side, in that order. */
const rightTri = (w: number, h: number, sides: (string | undefined)[], extra: FigItem[] = []): Piece =>
  shape({ pts: [[0, 0], [w, 0], [0, h]], sides, rights: [0], extra })

/** An isosceles triangle on the base (-half, 0) to (half, 0), apex (0, h), with its height drawn.
 *  `sides` label the left side, the base and the right side. */
const isoTri = (half: number, h: number, sides: (string | undefined)[]): Piece =>
  shape({
    pts: [[0, h], [-half, 0], [half, 0]],
    sides,
    extra: [line([0, h], [0, 0], 'b', { dashed: true }), txt(0.5, h / 2, 'h', 'lg', 'result', 'start'), { t: 'right', at: [0, 0], from: [half, 0], to: [0, h] }],
  })

/** A bridge truss with two families of parallel lines: L1 and L2 run across, L3 and L4 lean at `deg`
 *  degrees. The corners are A = L2 and L3, B = L2 and L4, C = L1 and L4, D = L1 and L3, with AB = `ab`
 *  and the two across-lines 2 apart. `arcs` mark only the angles a question uses (directions in
 *  degrees, counterclockwise from `from` to `to`, at the named corner). `diagonal` adds the member BD. */
function truss(o: { deg: number; ab: number; arcs: { at: 'A' | 'B' | 'C' | 'D'; from: number; to: number; label: string }[]; diagonal?: boolean }): Piece {
  const h = 2
  const dx = tidy(h / Math.tan(rad(o.deg)))
  const P: Record<'A' | 'B' | 'C' | 'D', Pt> = { A: [0, 0], B: [o.ab, 0], C: [tidy(o.ab + dx), h], D: [dx, h] }
  const lean = pol(o.deg, 1.3)
  const items: FigItem[] = [
    line([-1.8, 0], [o.ab + 2.2, 0], 'a', { width: 2.6 }),
    line([dx - 1.8, h], [P.C[0] + 2.2, h], 'a', { width: 2.6 }),
    line([-lean[0], -lean[1]], [P.D[0] + lean[0], h + lean[1]], 'b', { width: 2.6 }),
    line([P.B[0] - lean[0], -lean[1]], [P.C[0] + lean[0], h + lean[1]], 'b', { width: 2.6 }),
    txt(o.ab + 2.8, 0, 'L2', 'md', 'a'),
    txt(P.C[0] + 2.8, h, 'L1', 'md', 'a'),
    txt(P.D[0] + lean[0] + 0.1, h + lean[1] + 0.5, 'L3', 'md', 'b'),
    txt(P.C[0] + lean[0] + 0.1, h + lean[1] + 0.5, 'L4', 'md', 'b'),
    txt(-0.5, 0.45, 'A', 'lg', 'muted'),
    txt(o.ab + 0.45, -0.5, 'B', 'lg', 'muted'),
    txt(P.C[0] + 0.5, h - 0.45, 'C', 'lg', 'muted'),
    txt(P.D[0] - 0.45, h + 0.5, 'D', 'lg', 'muted'),
  ]
  if (o.diagonal) items.push(line(P.B, P.D, 'c', { width: 2.6 }))
  for (const a of o.arcs) items.push(arcAt(P[a.at], pol(a.from, 1, P[a.at]), pol(a.to, 1, P[a.at]), a.label))
  const pts: Pt[] = [
    [-1.8, -0.9],
    [P.C[0] + 3.4, h + lean[1] + 0.9],
    [P.D[0] + lean[0], h + lean[1] + 0.9],
    [-lean[0], -lean[1] - 0.2],
  ]
  return { dim: 2, axes: false, ...fit(pts, 0.4), items }
}

/* -------------------------------------------------------------- module */

export const module5: Module = {
  id: 'tka-smp-m5',
  title: L('Angles, Pythagoras and Similarity', 'Sudut, Pythagoras, dan Kesebangunan'),
  summary: L(
    'Find unknown angles where lines cross, between parallel lines and inside triangles; use the Pythagorean theorem to find lengths and test right angles; and tell congruent figures from similar ones, using them to find missing sides and heights.',
    'Mencari sudut yang belum diketahui pada garis berpotongan, garis sejajar, dan segitiga; memakai teorema Pythagoras untuk mencari panjang dan menguji sudut siku-siku; serta membedakan bangun kongruen dari bangun sebangun dan memakainya untuk mencari sisi dan tinggi yang belum diketahui.',
  ),
  submodules: [
    /* ======================================================= S1: angles and lines */
    {
      id: 'tka-smp-m5-s1',
      title: L('Angles and Lines', 'Sudut dan Garis'),
      summary: L(
        'Angles on a straight line, round a point and where two lines cross; angles between parallel lines; and the angles of a triangle.',
        'Sudut pada garis lurus, di sekitar satu titik, dan pada dua garis berpotongan; sudut pada garis sejajar; serta sudut-sudut segitiga.',
      ),
      lessons: [
        /* ------------------------------------------------ S1 L1 lines and crossings */
        {
          id: 'tka-smp-m5-s1-l1',
          title: L('Angles on a Line and Where Two Lines Cross', 'Sudut pada Garis Lurus dan Dua Garis Berpotongan'),
          goal: L(
            'You can find unknown angles on a straight line, around a point and where two lines cross, including angles written with an unknown x.',
            'Kamu bisa mencari sudut yang belum diketahui pada garis lurus, di sekitar satu titik, dan pada dua garis berpotongan, termasuk sudut yang memuat x.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Straight Lines, Points and Crossings', 'Ayo Amati: Garis Lurus, Titik, dan Persilangan'),
              body: L(
                'A door opens a little. The gap between the door and the frame is an **angle**, and we measure it in **degrees** ($^\\circ$). A quarter turn is a **right angle** of $90^\\circ$, a half turn makes a straight line of $180^\\circ$, and a full turn is $360^\\circ$.\n\nThree facts follow from this:\n\n- Angles side by side on a **straight line** add up to $180^\\circ$. Such a pair is called **supplementary**.\n- Angles **around a point** add up to $360^\\circ$.\n- When two straight lines cross, the angles **across from each other** are **vertically opposite angles**, and they are equal.\n\nIn the picture a ray stands on a straight line, and $65^\\circ+115^\\circ=180^\\circ$.',
                'Sebuah pintu dibuka sedikit. Celah antara pintu dan kusennya adalah sebuah **sudut**, dan kita mengukurnya dalam **derajat** ($^\\circ$). Seperempat putaran adalah **sudut siku-siku** sebesar $90^\\circ$, setengah putaran membentuk garis lurus sebesar $180^\\circ$, dan satu putaran penuh sebesar $360^\\circ$.\n\nDari sini ada tiga fakta:\n\n- Sudut-sudut yang berdampingan pada **garis lurus** berjumlah $180^\\circ$. Pasangan seperti ini disebut **berpelurus**.\n- Sudut-sudut **di sekitar satu titik** berjumlah $360^\\circ$.\n- Jika dua garis lurus berpotongan, sudut-sudut yang **saling berhadapan** disebut **sudut bertolak belakang**, dan besarnya sama.\n\nPada gambar, sebuah sinar berdiri di atas garis lurus, dan $65^\\circ+115^\\circ=180^\\circ$.',
              ),
              figure: {
                ...fan([65], ['65°', '115°']),
                caption: L(
                  'A ray on a straight line: the two angles together make a straight angle.',
                  'Sebuah sinar pada garis lurus: kedua sudut bersama-sama membentuk sudut lurus.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Two Lines Cross', 'Contoh Bertahap: Dua Garis Berpotongan'),
              body: L(
                'Two straight lines cross and one of the four angles is $50^\\circ$. Find the angles $a$, $b$ and $c$.\n\n1. Step 1: Angle $a$ is next to $50^\\circ$ on a straight line, so $50^\\circ+a=180^\\circ$ and $a=130^\\circ$.\n2. Step 2: Angle $b$ is across from $50^\\circ$. Vertically opposite angles are equal, so $b=50^\\circ$.\n3. Step 3: Angle $c$ is across from $a$, so $c=a=130^\\circ$.\n4. Step 4: Check: the four angles round the crossing add up to $50+130+50+130=360$.\n\n**Remember:**\n\n- Next to each other on a line: the angles add up to $180^\\circ$.\n- Across from each other: the angles are equal.\n- All the way round a point: $360^\\circ$.',
                'Dua garis lurus berpotongan dan salah satu dari empat sudutnya $50^\\circ$. Cari sudut $a$, $b$, dan $c$.\n\n1. Langkah 1: Sudut $a$ berdampingan dengan $50^\\circ$ pada garis lurus, jadi $50^\\circ+a=180^\\circ$ dan $a=130^\\circ$.\n2. Langkah 2: Sudut $b$ berhadapan dengan $50^\\circ$. Sudut bertolak belakang sama besar, jadi $b=50^\\circ$.\n3. Langkah 3: Sudut $c$ berhadapan dengan $a$, jadi $c=a=130^\\circ$.\n4. Langkah 4: Periksa: keempat sudut di sekitar titik potong berjumlah $50+130+50+130=360$.\n\n**Ingat:**\n\n- Berdampingan pada garis lurus: sudutnya berjumlah $180^\\circ$.\n- Berhadapan: sudutnya sama besar.\n- Satu putaran penuh di sekitar titik: $360^\\circ$.',
              ),
              figure: {
                ...crossing(50, ['50°', 'a', 'b', 'c']),
                caption: L(
                  'Two crossing lines make four angles: one is 50°, the others are a, b and c.',
                  'Dua garis berpotongan membentuk empat sudut: satu 50°, yang lain a, b, dan c.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Look Closely: Two Names for Pairs of Angles', 'Ayo Amati: Dua Nama untuk Pasangan Sudut'),
              body: L(
                'Two angles can form a special pair just because of their sum.\n\n| Pair | Complementary | Supplementary |\n|---|---|---|\n| Sum | $90^\\circ$ | $180^\\circ$ |\n| Together they make | a right angle | a straight line |\n| Example | $35^\\circ$ and $55^\\circ$ | $35^\\circ$ and $145^\\circ$ |\n| Partner of $x$ | $90^\\circ-x$ | $180^\\circ-x$ |\n\nThe left picture shows $35^\\circ$ and its complement. The right picture shows $35^\\circ$ and its supplement.',
                'Dua sudut dapat membentuk pasangan khusus hanya karena jumlahnya.\n\n| Pasangan | Berpenyiku | Berpelurus |\n|---|---|---|\n| Jumlah | $90^\\circ$ | $180^\\circ$ |\n| Bersama-sama membentuk | sudut siku-siku | garis lurus |\n| Contoh | $35^\\circ$ dan $55^\\circ$ | $35^\\circ$ dan $145^\\circ$ |\n| Pasangan dari $x$ | $90^\\circ-x$ | $180^\\circ-x$ |\n\nGambar kiri menunjukkan $35^\\circ$ dan penyikunya. Gambar kanan menunjukkan $35^\\circ$ dan pelurusnya.',
              ),
              figure: {
                ...twoFans(),
                caption: L(
                  'Left: 35° and 55° fill a right angle. Right: 35° and 145° fill a straight line.',
                  'Kiri: 35° dan 55° mengisi sudut siku-siku. Kanan: 35° dan 145° mengisi garis lurus.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Mix-ups with Angles', 'Awas, Jebakan!: Kekeliruan pada Sudut'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| Two angles that add up to $90^\\circ$ are supplementary. | Sum $90^\\circ$: complementary (think of the corner of a square). Sum $180^\\circ$: supplementary (think of a straight line). |\n| $x$ is next to $70^\\circ$ on a line, so $x=70^\\circ$. | Next to each other on a line the angles add up to $180^\\circ$, so $x=110^\\circ$. Only the angles ACROSS from each other are equal. |\n| $x=70^\\circ$ because the number 70 is the one nearest to $x$. | Look at the arcs: an arc shows which angle each number or letter belongs to. Work out $x$ with the rules, not from where the label sits. |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| Dua sudut yang berjumlah $90^\\circ$ disebut berpelurus. | Jumlah $90^\\circ$: berpenyiku (ingat sudut siku-siku, pojok persegi). Jumlah $180^\\circ$: berpelurus (ingat garis lurus). |\n| $x$ berada di samping $70^\\circ$ pada garis lurus, jadi $x=70^\\circ$. | Berdampingan pada garis lurus, sudutnya berjumlah $180^\\circ$, jadi $x=110^\\circ$. Hanya sudut yang BERHADAPAN yang sama besar. |\n| $x=70^\\circ$ karena angka 70 yang paling dekat dengan $x$. | Lihat busurnya: busur menunjukkan sudut mana yang dimaksud oleh angka atau huruf. Hitung $x$ dengan aturan sudut, bukan dari letak labelnya. |',
              ),
              figure: {
                ...crossing(70, ['70°', 'x']),
                caption: L(
                  'The angle x is next to 70°, not across from it.',
                  'Sudut x berdampingan dengan 70°, bukan berhadapan.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Two straight lines cross and one angle is $38^\\circ$. How big is the angle $x$ next to it?',
                'Dua garis lurus berpotongan dan satu sudutnya $38^\\circ$. Berapa besar sudut $x$ yang berdampingan dengannya?',
              ),
              figure: {
                ...crossing(38, ['38°', 'x']),
                caption: L('The angle x shares an arm with the 38° angle.', 'Sudut x memakai satu kaki yang sama dengan sudut 38°.'),
              },
              options: [
                L('$142^\\circ$', '$142^\\circ$'),
                L('$38^\\circ$', '$38^\\circ$'),
                L('$52^\\circ$', '$52^\\circ$'),
                L('$322^\\circ$', '$322^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'Neighbors on a straight line add up to $180^\\circ$, so $x=180^\\circ-38^\\circ=142^\\circ$. The value $38^\\circ$ belongs to the angle across from the marked one, $52^\\circ$ comes from $90-38$ (a complement), and $322^\\circ$ from $360-38$.',
                'Sudut yang berdampingan pada garis lurus berjumlah $180^\\circ$, jadi $x=180^\\circ-38^\\circ=142^\\circ$. Nilai $38^\\circ$ milik sudut yang berhadapan dengan sudut bertanda, $52^\\circ$ berasal dari $90-38$ (penyiku), dan $322^\\circ$ dari $360-38$.',
              ),
              hint: L(
                'Is $x$ next to the $38^\\circ$ angle or across from it? Neighbors on a straight line make a straight angle together.',
                'Apakah $x$ berdampingan atau berhadapan dengan sudut $38^\\circ$? Sudut yang berdampingan pada garis lurus bersama-sama membentuk sudut lurus.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: three angles meet on a straight line: $40^\\circ$, $x$ and $75^\\circ$. Together they make $180^\\circ$.',
                'Coba bersama: tiga sudut bertemu pada sebuah garis lurus: $40^\\circ$, $x$, dan $75^\\circ$. Bersama-sama besarnya $180^\\circ$.',
              ),
              figure: {
                ...fan([40, 105], ['40°', 'x', '75°']),
                caption: L('Three angles on one straight line.', 'Tiga sudut pada satu garis lurus.'),
              },
              template: '40+75=___ \\quad x=180-___=___',
              blanks: ['115', '115', '65'],
              explain: L(
                'The two known angles add up to $40+75=115$. What is left of the $180^\\circ$ is $x=180-115=65$, so $x=65^\\circ$.',
                'Kedua sudut yang diketahui berjumlah $40+75=115$. Sisa dari $180^\\circ$ adalah $x=180-115=65$, jadi $x=65^\\circ$.',
              ),
              hint: L(
                'Add the two angles you know first. Then subtract that total from $180$.',
                'Jumlahkan dulu dua sudut yang diketahui. Lalu kurangkan jumlah itu dari $180$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Angles $P$ and $Q$ are complementary and $P=64^\\circ$. How big is $Q$?',
                'Sudut $P$ dan $Q$ berpenyiku dan $P=64^\\circ$. Berapa besar $Q$?',
              ),
              options: [
                L('$26^\\circ$', '$26^\\circ$'),
                L('$116^\\circ$', '$116^\\circ$'),
                L('$64^\\circ$', '$64^\\circ$'),
                L('$296^\\circ$', '$296^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'Complementary angles add up to $90^\\circ$, so $Q=90-64=26$. The value $116$ is the supplement ($180-64$), $64$ is just $P$ again, and $296$ is $360-64$.',
                'Sudut berpenyiku berjumlah $90^\\circ$, jadi $Q=90-64=26$. Nilai $116$ adalah pelurusnya ($180-64$), $64$ hanyalah $P$ lagi, dan $296$ adalah $360-64$.',
              ),
              hint: L(
                'Complementary and supplementary have different totals. Which total goes with complementary?',
                'Berpenyiku dan berpelurus punya jumlah yang berbeda. Jumlah mana yang cocok untuk berpenyiku?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('The angles around a point add up to $360^\\circ$.', 'Sudut-sudut di sekitar satu titik berjumlah $360^\\circ$.'),
                L('The supplement of $120^\\circ$ is $60^\\circ$.', 'Pelurus dari $120^\\circ$ adalah $60^\\circ$.'),
                L('Two angles side by side on a straight line are always equal.', 'Dua sudut yang berdampingan pada garis lurus selalu sama besar.'),
                L('The complement of $35^\\circ$ is $145^\\circ$.', 'Penyiku dari $35^\\circ$ adalah $145^\\circ$.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'A full turn is $360^\\circ$. The supplement of $120^\\circ$ is $180-120=60$. Neighbors on a line only have to add up to $180^\\circ$; they are equal just when both are $90^\\circ$. The complement of $35^\\circ$ is $90-35=55$, and $145$ is its supplement.',
                'Satu putaran penuh adalah $360^\\circ$. Pelurus dari $120^\\circ$ adalah $180-120=60$. Sudut berdampingan pada garis lurus hanya harus berjumlah $180^\\circ$; sama besar hanya jika keduanya $90^\\circ$. Penyiku dari $35^\\circ$ adalah $90-35=55$, dan $145$ adalah pelurusnya.',
              ),
              hint: L(
                'For each statement, say which total ($90$, $180$ or $360$) belongs to the situation and test it.',
                'Untuk setiap pernyataan, tentukan jumlah mana ($90$, $180$, atau $360$) yang cocok dengan keadaannya, lalu uji.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Two straight lines cross. The angles across from each other are $(3x+20)^\\circ$ and $(5x-10)^\\circ$. Find $x$, and find the angle $y$ next to them.',
                'Dua garis lurus berpotongan. Sudut-sudut yang saling berhadapan adalah $(3x+20)^\\circ$ dan $(5x-10)^\\circ$. Cari $x$, dan cari sudut $y$ yang berdampingan dengan keduanya.',
              ),
              figure: {
                ...crossing(65, ['(3x+20)°', 'y', '(5x-10)°']),
                caption: L(
                  'Across from each other: (3x+20)° and (5x-10)°. The angle y is next to both.',
                  'Saling berhadapan: (3x+20)° dan (5x-10)°. Sudut y berdampingan dengan keduanya.',
                ),
              },
              blanks: [
                { label: 'x =', answer: 15 },
                { label: 'y =', answer: 115, after: '^\\circ' },
              ],
              hints: [
                L(
                  'The two angles across from each other are vertically opposite. What do you know about them?',
                  'Dua sudut yang berhadapan adalah sudut bertolak belakang. Apa yang kamu tahu tentang keduanya?',
                ),
                L(
                  'They are equal, so write $3x+20=5x-10$. Subtract $3x$ from both sides and add $10$ to both sides.',
                  'Keduanya sama besar, jadi tulis $3x+20=5x-10$. Kurangi kedua ruas dengan $3x$ dan tambahkan $10$ pada kedua ruas.',
                ),
                L(
                  'You get $30=2x$. Solve it for $x$, then put $x$ back in $3x+20$ to get one angle. Then $y$ and that angle are on a straight line.',
                  'Diperoleh $30=2x$. Selesaikan untuk $x$, lalu masukkan $x$ ke $3x+20$ untuk mendapat satu sudut. Lalu $y$ dan sudut itu berada pada garis lurus.',
                ),
              ],
              explain: L(
                'Vertically opposite angles are equal: $3x+20=5x-10$ gives $x=15$, so each of them is $65^\\circ$. The angle $y$ is next to $65^\\circ$ on a straight line: $y=180-65=115$.',
                'Sudut bertolak belakang sama besar: $3x+20=5x-10$ memberi $x=15$, jadi masing-masing $65^\\circ$. Sudut $y$ berdampingan dengan $65^\\circ$ pada garis lurus: $y=180-65=115$.',
              ),
              solution: ['3x+20=5x-10', '20+10=5x-3x', '30=2x', 'x=15', '3(15)+20=65', 'y=180-65=115'],
            },
          ],
        },
        /* ------------------------------------------------ S1 L2 parallel lines, triangles */
        {
          id: 'tka-smp-m5-s1-l2',
          title: L('Parallel Lines, a Transversal and Triangle Angles', 'Garis Sejajar, Transversal, dan Sudut Segitiga'),
          goal: L(
            'You can name the angle pairs made by a transversal across parallel lines, chain them to find unknown angles, and use the angle sum and the exterior angle of a triangle.',
            'Kamu bisa menyebut pasangan sudut yang dibentuk transversal pada garis sejajar, merangkainya untuk mencari sudut yang belum diketahui, dan memakai jumlah sudut serta sudut luar segitiga.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Parallel Lines Cut by a Line', 'Ayo Amati: Dua Garis Sejajar Dipotong Satu Garis'),
              body: L(
                'Railway tracks run side by side and never meet: they are **parallel** lines. A road that crosses both tracks is a **transversal**. The crossing makes eight angles, numbered 1 to 8. The picture marks the four used below.\n\nBecause the tracks are parallel, the angles come in matching pairs:\n\n| Pair | Where they are | Relation | Example |\n|---|---|---|---|\n| Corresponding | the same place at each crossing | equal | 1 and 5 |\n| Alternate interior | between the lines, on opposite sides of the transversal | equal | 3 and 5 |\n| Co-interior | between the lines, on the same side of the transversal | add up to $180^\\circ$ | 3 and 6 |\n\nThe rules from the last lesson still work too: vertically opposite angles are equal, and neighbors on a line add up to $180^\\circ$.',
                'Rel kereta api berjalan berdampingan dan tidak pernah bertemu: keduanya adalah garis **sejajar**. Jalan raya yang memotong kedua rel adalah **transversal**. Perpotongan itu membentuk delapan sudut, bernomor 1 sampai 8. Gambar menandai empat sudut yang dipakai di bawah.\n\nKarena relnya sejajar, sudut-sudutnya membentuk pasangan yang bersesuaian:\n\n| Pasangan | Letaknya | Hubungan | Contoh |\n|---|---|---|---|\n| Sehadap | sama letaknya pada tiap perpotongan | sama besar | 1 dan 5 |\n| Dalam berseberangan | di antara kedua garis, di sisi transversal yang berlawanan | sama besar | 3 dan 5 |\n| Dalam sepihak | di antara kedua garis, di sisi transversal yang sama | berjumlah $180^\\circ$ | 3 dan 6 |\n\nAturan dari pelajaran sebelumnya tetap berlaku: sudut bertolak belakang sama besar, dan sudut berdampingan pada garis lurus berjumlah $180^\\circ$.',
              ),
              figure: {
                ...parallelLines({ deg: 60, labels: ['1', undefined, '3', undefined, '5', '6'] }),
                caption: L(
                  'Two parallel lines cut by a transversal. The numbers go counterclockwise from the top right: 1 to 4 round the upper crossing, 5 to 8 round the lower one. Angles 1, 3, 5 and 6 are marked.',
                  'Dua garis sejajar dipotong transversal. Nomor berlawanan arah jarum jam mulai dari kanan atas: 1 sampai 4 di perpotongan atas, 5 sampai 8 di perpotongan bawah. Sudut 1, 3, 5, dan 6 diberi tanda.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: A Chain of Angles', 'Contoh Bertahap: Rantai Sudut'),
              body: L(
                'The two horizontal lines are parallel and angle 1 is $70^\\circ$. Find $a$ (angle 3), $b$ (angle 5) and $c$ (angle 6).\n\n1. Step 1: Angle $a$ is across from the $70^\\circ$ angle at the same crossing. They are vertically opposite, so $a=70^\\circ$.\n2. Step 2: Angle $b$ has the same place at the lower crossing as the $70^\\circ$ angle has at the upper one. They are corresponding, so $b=70^\\circ$.\n3. Step 3: Angle $c$ is next to $b$ on the lower line, so $c=180^\\circ-70^\\circ=110^\\circ$.\n4. Step 4: Check: $a$ and $c$ are co-interior, and $70+110=180$.\n\n**Remember:**\n\n- Work one step at a time.\n- Each new angle should come from an angle you already know, using one rule.',
                'Kedua garis mendatar sejajar dan sudut 1 besarnya $70^\\circ$. Cari $a$ (sudut 3), $b$ (sudut 5), dan $c$ (sudut 6).\n\n1. Langkah 1: Sudut $a$ berhadapan dengan sudut $70^\\circ$ pada perpotongan yang sama. Keduanya bertolak belakang, jadi $a=70^\\circ$.\n2. Langkah 2: Sudut $b$ letaknya pada perpotongan bawah sama dengan letak sudut $70^\\circ$ pada perpotongan atas. Keduanya sehadap, jadi $b=70^\\circ$.\n3. Langkah 3: Sudut $c$ berdampingan dengan $b$ pada garis bawah, jadi $c=180^\\circ-70^\\circ=110^\\circ$.\n4. Langkah 4: Periksa: $a$ dan $c$ dalam sepihak, dan $70+110=180$.\n\n**Ingat:**\n\n- Kerjakan satu langkah demi satu langkah.\n- Setiap sudut baru harus berasal dari sudut yang sudah kamu ketahui, dengan satu aturan.',
              ),
              figure: {
                ...parallelLines({ deg: 70, labels: ['70°', undefined, 'a', undefined, 'b', 'c'] }),
                caption: L(
                  'Angle 1 is 70°. The letters a, b and c name angles 3, 5 and 6.',
                  'Sudut 1 besarnya 70°. Huruf a, b, dan c menamai sudut 3, 5, dan 6.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Look Closely: Angles Inside and Outside a Triangle', 'Ayo Amati: Sudut di Dalam dan di Luar Segitiga'),
              body: L(
                'Draw a line through the top corner of a triangle, parallel to its base. The alternate angles you get fit together with the top angle on a straight line. That is why the **three angles of a triangle add up to $180^\\circ$**.\n\nTwo more facts:\n\n- The **exterior angle** is made when one side is extended. It equals the sum of the two interior angles that are NOT next to it. In the picture, $x=50^\\circ+60^\\circ=110^\\circ$.\n- In an **isosceles triangle** the two angles opposite the equal sides are equal. In an **equilateral triangle** all three angles are $60^\\circ$.\n\nThe exterior angle rule comes from the same fact: $x+70=180$ and $50+60+70=180$, so $x=50+60$.',
                'Gambar garis melalui titik sudut atas segitiga, sejajar dengan alasnya. Sudut-sudut dalam berseberangan yang terbentuk bersama sudut atas membentuk garis lurus. Itulah sebabnya **jumlah ketiga sudut segitiga adalah $180^\\circ$**.\n\nDua fakta lagi:\n\n- **Sudut luar** terbentuk ketika satu sisi diperpanjang. Besarnya sama dengan jumlah dua sudut dalam yang TIDAK berdampingan dengannya. Pada gambar, $x=50^\\circ+60^\\circ=110^\\circ$.\n- Pada **segitiga sama kaki**, dua sudut yang berhadapan dengan sisi yang sama panjang sama besar. Pada **segitiga sama sisi**, ketiga sudutnya $60^\\circ$.\n\nAturan sudut luar berasal dari fakta yang sama: $x+70=180$ dan $50+60+70=180$, jadi $x=50+60$.',
              ),
              figure: (() => {
                const [A, B, C] = triFromAngles(50, 70, 7)
                const D: Pt = [10, 0]
                return {
                  ...shape({
                    pts: [A, B, C],
                    names: 'ABC',
                    extra: [
                      line(B, D, 'muted'),
                      txt(10.5, 0.45, 'D', 'lg', 'result'),
                      arcAt(A, B, C, '50°'),
                      arcAt(C, A, B, '60°'),
                      arcAt(B, C, A, '70°'),
                      arcAt(B, D, C, 'x'),
                    ],
                  }),
                  caption: L(
                    'Side AB is extended to D. The exterior angle x is next to the 70° angle.',
                    'Sisi AB diperpanjang sampai D. Sudut luar x berdampingan dengan sudut 70°.',
                  ),
                }
              })(),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Equal or Adding Up?', 'Awas, Jebakan!: Sama Besar atau Berjumlah?'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| Co-interior angles are equal, like alternate angles. | Co-interior angles add up to $180^\\circ$. Corresponding and alternate angles are the ones that are equal. |\n| In an isosceles triangle with a top angle of $40^\\circ$, the base angles are $40^\\circ$ too. | The base angles share what is left: $(180-40)\\div2=70$, so each is $70^\\circ$. |\n| The exterior angle equals the interior angle next to it. | It makes $180^\\circ$ together with the interior angle next to it. It equals the SUM of the two interior angles far from it. |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| Sudut dalam sepihak sama besar, seperti sudut dalam berseberangan. | Sudut dalam sepihak berjumlah $180^\\circ$. Sudut sehadap dan sudut dalam berseberangan yang sama besar. |\n| Pada segitiga sama kaki dengan sudut puncak $40^\\circ$, sudut alasnya juga $40^\\circ$. | Sudut alas membagi sisanya: $(180-40)\\div2=70$, jadi masing-masing $70^\\circ$. |\n| Sudut luar sama besar dengan sudut dalam yang berdampingan dengannya. | Bersama sudut dalam yang berdampingan, jumlahnya $180^\\circ$. Besarnya sama dengan JUMLAH dua sudut dalam yang berjauhan darinya. |',
              ),
              figure: (() => {
                const A: Pt = [0, tidy(3 / Math.tan(rad(20)))]
                const B: Pt = [-3, 0]
                const C: Pt = [3, 0]
                return {
                  ...shape({ pts: [A, B, C], names: 'ABC', extra: [arcAt(A, B, C, '40°'), arcAt(B, C, A, 'x'), arcAt(C, A, B, 'x')] }),
                  caption: L(
                    'AB = AC, so the angles at B and C are equal.',
                    'AB = AC, jadi sudut di B dan di C sama besar.',
                  ),
                }
              })(),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The two horizontal lines are parallel and one angle is $62^\\circ$. The angle $x$ is between the lines, on the same side of the transversal as the $62^\\circ$ angle. How big is $x$?',
                'Kedua garis mendatar sejajar dan satu sudutnya $62^\\circ$. Sudut $x$ berada di antara kedua garis, di sisi transversal yang sama dengan sudut $62^\\circ$. Berapa besar $x$?',
              ),
              figure: {
                ...parallelLines({ deg: 62, labels: [undefined, undefined, '62°', undefined, undefined, 'x'] }),
                caption: L('The angle x is between the lines, beside the 62° angle.', 'Sudut x berada di antara kedua garis, di dekat sudut 62°.'),
              },
              options: [
                L('$118^\\circ$', '$118^\\circ$'),
                L('$62^\\circ$', '$62^\\circ$'),
                L('$28^\\circ$', '$28^\\circ$'),
                L('$298^\\circ$', '$298^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'These two are co-interior angles, so they add up to $180^\\circ$: $x=180-62=118$. The value $62$ treats them as equal, $28$ comes from $90-62$, and $298$ from $360-62$.',
                'Keduanya adalah sudut dalam sepihak, jadi berjumlah $180^\\circ$: $x=180-62=118$. Nilai $62$ menganggap keduanya sama besar, $28$ berasal dari $90-62$, dan $298$ dari $360-62$.',
              ),
              hint: L(
                'Between the lines and on the same side of the transversal: which pair name is that, and does that pair add up or stay equal?',
                'Di antara kedua garis dan di sisi transversal yang sama: pasangan apa itu, dan apakah pasangan itu berjumlah atau sama besar?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the lines are parallel and angle 1 is $75^\\circ$. Follow the same three steps as in the example.',
                'Coba bersama: kedua garis sejajar dan sudut 1 besarnya $75^\\circ$. Ikuti tiga langkah yang sama seperti pada contoh.',
              ),
              figure: {
                ...parallelLines({ deg: 75, labels: ['75°', undefined, 'a', undefined, 'b', 'c'] }),
                caption: L('The letters a, b and c name angles 3, 5 and 6.', 'Huruf a, b, dan c menamai sudut 3, 5, dan 6.'),
              },
              template: 'a=___ \\quad b=___ \\quad c=180-___=___',
              blanks: ['75', '75', '75', '105'],
              explain: L(
                '$a$ is vertically opposite $75^\\circ$, and $b$ is corresponding to it, so both are $75^\\circ$. Then $c$ is next to $b$ on a line: $c=180-75=105$.',
                '$a$ bertolak belakang dengan $75^\\circ$, dan $b$ sehadap dengannya, jadi keduanya $75^\\circ$. Lalu $c$ berdampingan dengan $b$ pada garis lurus: $c=180-75=105$.',
              ),
              hint: L(
                'The first two angles are copies of the angle you know. The last one needs a subtraction from $180$.',
                'Dua sudut pertama adalah salinan dari sudut yang kamu ketahui. Sudut terakhir memerlukan pengurangan dari $180$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Triangle $ABC$ is isosceles with $AB=AC$ and a top angle of $50^\\circ$. How big is angle $B$?',
                'Segitiga $ABC$ sama kaki dengan $AB=AC$ dan sudut puncak $50^\\circ$. Berapa besar sudut $B$?',
              ),
              figure: (() => {
                const A: Pt = [0, tidy(3 / Math.tan(rad(25)))]
                const B: Pt = [-3, 0]
                const C: Pt = [3, 0]
                return {
                  ...shape({ pts: [A, B, C], names: 'ABC', extra: [arcAt(A, B, C, '50°'), arcAt(B, C, A, 'x')] }),
                  caption: L('The top angle is 50°. The angle x is at B.', 'Sudut puncaknya 50°. Sudut x berada di B.'),
                }
              })(),
              options: [
                L('$65^\\circ$', '$65^\\circ$'),
                L('$50^\\circ$', '$50^\\circ$'),
                L('$130^\\circ$', '$130^\\circ$'),
                L('$115^\\circ$', '$115^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'The two base angles are equal and the three angles add up to $180^\\circ$: $(180-50)\\div2=65$. The value $50$ copies the top angle, $130$ is $180-50$ (the two base angles together), and $115$ is the exterior angle at B.',
                'Kedua sudut alas sama besar dan ketiga sudut berjumlah $180^\\circ$: $(180-50)\\div2=65$. Nilai $50$ menyalin sudut puncak, $130$ adalah $180-50$ (kedua sudut alas bersama-sama), dan $115$ adalah sudut luar di B.',
              ),
              hint: L(
                'The three angles add up to $180^\\circ$, and the two base angles are equal. What is left for the two of them together?',
                'Ketiga sudut berjumlah $180^\\circ$, dan kedua sudut alas sama besar. Berapa sisa untuk keduanya bersama-sama?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'The two horizontal lines are parallel. Decide whether each statement is True or False.',
                'Kedua garis mendatar sejajar. Tentukan apakah setiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...parallelLines({ deg: 60, labels: ['1', undefined, '3', '4', '5', '6'] }),
                caption: L('Angles 1, 3, 4, 5 and 6 are numbered as in the lesson.', 'Sudut 1, 3, 4, 5, dan 6 diberi nomor seperti pada pelajaran.'),
              },
              statements: [
                L('$\\angle 1=\\angle 5$', '$\\angle 1=\\angle 5$'),
                L('$\\angle 3=\\angle 6$', '$\\angle 3=\\angle 6$'),
                L('$\\angle 4=\\angle 6$', '$\\angle 4=\\angle 6$'),
                L('$\\angle 1=\\angle 6$', '$\\angle 1=\\angle 6$'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Angles 1 and 5 are corresponding, so they are equal. Angles 3 and 6 are co-interior: they add up to $180^\\circ$ (here $60^\\circ$ and $120^\\circ$), so they are not equal. Angles 4 and 6 are alternate interior angles, so they are equal. Angles 1 and 6 are not an equal pair: here they are $60^\\circ$ and $120^\\circ$.',
                'Sudut 1 dan 5 sehadap, jadi sama besar. Sudut 3 dan 6 dalam sepihak: jumlahnya $180^\\circ$ (di sini $60^\\circ$ dan $120^\\circ$), jadi tidak sama besar. Sudut 4 dan 6 dalam berseberangan, jadi sama besar. Sudut 1 dan 6 bukan pasangan yang sama besar: di sini keduanya $60^\\circ$ dan $120^\\circ$.',
              ),
              hint: L(
                'Name each pair first: corresponding, alternate interior or co-interior. Equal or adding up depends on the name.',
                'Sebutkan dulu nama tiap pasangan: sehadap, dalam berseberangan, atau dalam sepihak. Sama besar atau berjumlah bergantung pada namanya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'b1',
              prompt: L(
                'In a bridge truss, $L_1\\parallel L_2$ and $L_3\\parallel L_4$. The angle at $A$ is $50^\\circ$. How big is the angle $r$ at $C$? Chain two angle pairs, one family of parallel lines at a time.',
                'Pada rangka jembatan, $L_1\\parallel L_2$ dan $L_3\\parallel L_4$. Sudut di $A$ besarnya $50^\\circ$. Berapa besar sudut $r$ di $C$? Rangkai dua pasangan sudut, satu keluarga garis sejajar demi satu.',
              ),
              figure: {
                ...truss({
                  deg: 50,
                  ab: 4,
                  arcs: [
                    { at: 'A', from: 0, to: 50, label: '50°' },
                    { at: 'C', from: 180, to: 230, label: 'r' },
                  ],
                }),
                caption: L(
                  'Two green lines L1 and L2 are parallel, and two orange lines L3 and L4 are parallel. The angle at A is 50°, and r is the angle at C below L1.',
                  'Dua garis hijau L1 dan L2 sejajar, dan dua garis oranye L3 dan L4 sejajar. Sudut di A besarnya 50°, dan r adalah sudut di C di bawah L1.',
                ),
              },
              options: [
                L('$50^\\circ$', '$50^\\circ$'),
                L('$130^\\circ$', '$130^\\circ$'),
                L('$40^\\circ$', '$40^\\circ$'),
                L('$100^\\circ$', '$100^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'Look at $L_3\\parallel L_4$ cut by $L_2$: the $50^\\circ$ angle at $A$ and the angle at $B$ above $L_2$, to the right of $L_4$, are corresponding, so that angle is $50^\\circ$. Now look at $L_1\\parallel L_2$ cut by $L_4$: that angle at $B$ and $r$ are alternate interior angles, so $r=50^\\circ$. The value $130$ is $180-50$, which treats $r$ as a neighbor on a straight line, $40$ is $90-50$, and $100$ is $50+50$.',
                'Perhatikan $L_3\\parallel L_4$ yang dipotong $L_2$: sudut $50^\\circ$ di $A$ dan sudut di $B$ di atas $L_2$, di kanan $L_4$, adalah sudut sehadap, jadi sudut itu $50^\\circ$. Sekarang perhatikan $L_1\\parallel L_2$ yang dipotong $L_4$: sudut di $B$ itu dan $r$ adalah sudut dalam berseberangan, jadi $r=50^\\circ$. Nilai $130$ adalah $180-50$, yang menganggap $r$ berdampingan pada garis lurus, $40$ adalah $90-50$, dan $100$ adalah $50+50$.',
              ),
              hint: L(
                'Do not jump from A to C in one go. First use one family of parallel lines to copy the 50 degrees to B, then use the other family to reach C. Equal pairs or pairs adding up to 180?',
                'Jangan melompat dari A ke C sekaligus. Pakai dulu satu keluarga garis sejajar untuk menyalin 50 derajat ke B, lalu pakai keluarga yang lain untuk sampai ke C. Pasangan yang sama besar atau yang berjumlah 180?',
              ),
            },
            {
              kind: 'judge',
              id: 'b2',
              prompt: L(
                'In the bridge truss, $L_1\\parallel L_2$ and $L_3\\parallel L_4$, and the angle at $A$ is $50^\\circ$. Each statement gives a size AND a reason. Decide whether each statement is True or False, so check the reason as well as the size.',
                'Pada rangka jembatan, $L_1\\parallel L_2$ dan $L_3\\parallel L_4$, dan sudut di $A$ besarnya $50^\\circ$. Setiap pernyataan memberi besar sudut DAN alasannya. Tentukan apakah setiap pernyataan Benar atau Salah, jadi periksa alasannya juga, bukan hanya besarnya.',
              ),
              figure: {
                ...truss({
                  deg: 50,
                  ab: 4,
                  arcs: [
                    { at: 'A', from: 0, to: 50, label: '50°' },
                    { at: 'B', from: 0, to: 50, label: 'p' },
                    { at: 'D', from: 230, to: 360, label: 'q' },
                    { at: 'C', from: 180, to: 230, label: 'r' },
                    { at: 'C', from: 0, to: 50, label: 's' },
                  ],
                }),
                caption: L(
                  'The same truss with the angles p, q, r and s marked, and the 50° angle at A.',
                  'Rangka yang sama dengan sudut p, q, r, dan s ditandai, dan sudut 50° di A.',
                ),
              },
              statements: [
                L('$p=50^\\circ$, because $p$ and the $50^\\circ$ angle are corresponding angles.', '$p=50^\\circ$, karena $p$ dan sudut $50^\\circ$ adalah sudut sehadap.'),
                L('$q=130^\\circ$, because $q$ and the $50^\\circ$ angle are co-interior angles between $L_1$ and $L_2$, so they add up to $180^\\circ$.', '$q=130^\\circ$, karena $q$ dan sudut $50^\\circ$ adalah sudut dalam sepihak di antara $L_1$ dan $L_2$, jadi jumlahnya $180^\\circ$.'),
                L('$s=50^\\circ$, found with the supplementary rule: $s$ and the $50^\\circ$ angle at $A$ lie on one straight line.', '$s=50^\\circ$, dicari dengan aturan berpelurus: $s$ dan sudut $50^\\circ$ di $A$ terletak pada satu garis lurus.'),
                L('$q$ and $r$ are equal, because they are alternate angles.', '$q$ dan $r$ sama besar, karena keduanya sudut dalam berseberangan.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'Statements 1 and 2 give correct sizes with correct reasons: $p$ is corresponding to the $50^\\circ$ angle, and $q$ is co-interior with it, so $q=180-50=130$. In statement 3 the size is right but the reason is wrong: $s$ and the angle at $A$ are not on one straight line, so the supplementary rule does not link them. They are equal because $s$ is corresponding to $p$ (between $L_1$ and $L_2$, cut by $L_4$) and $p=50^\\circ$. In statement 4 the angles are co-interior, not alternate: $q=130^\\circ$ and $r=50^\\circ$ add up to $180^\\circ$, and are not equal.',
                'Pernyataan 1 dan 2 memberi besar sudut yang benar dengan alasan yang benar: $p$ sehadap dengan sudut $50^\\circ$, dan $q$ dalam sepihak dengannya, jadi $q=180-50=130$. Pada pernyataan 3 besarnya benar tetapi alasannya salah: $s$ dan sudut di $A$ tidak terletak pada satu garis lurus, jadi aturan berpelurus tidak menghubungkan keduanya. Keduanya sama besar karena $s$ sehadap dengan $p$ (di antara $L_1$ dan $L_2$, dipotong $L_4$) dan $p=50^\\circ$. Pada pernyataan 4 kedua sudut itu dalam sepihak, bukan berseberangan: $q=130^\\circ$ dan $r=50^\\circ$ berjumlah $180^\\circ$, dan tidak sama besar.',
              ),
              hint: L(
                'First work out every marked angle with one rule each. Then read each reason slowly: does the rule it names really link those two angles?',
                'Hitung dulu setiap sudut bertanda dengan satu aturan masing-masing. Lalu baca tiap alasan pelan-pelan: apakah aturan yang disebut benar-benar menghubungkan kedua sudut itu?',
              ),
            },
            {
              kind: 'math',
              id: 'b3',
              prompt: L(
                'In the truss, $L_1\\parallel L_2$ and $L_3\\parallel L_4$, and a diagonal member $BD$ is added. The angle at $A$ is $50^\\circ$ and $\\angle ABD=60^\\circ$. Find $x=\\angle ADB$, $y=\\angle BDC$ and $z=\\angle BCD$.',
                'Pada rangka, $L_1\\parallel L_2$ dan $L_3\\parallel L_4$, dan sebuah batang diagonal $BD$ ditambahkan. Sudut di $A$ besarnya $50^\\circ$ dan $\\angle ABD=60^\\circ$. Cari $x=\\angle ADB$, $y=\\angle BDC$, dan $z=\\angle BCD$.',
              ),
              figure: {
                ...truss({
                  deg: 50,
                  ab: tidy((2 / Math.sin(rad(50))) * Math.sin(rad(70)) / Math.sin(rad(60))),
                  diagonal: true,
                  arcs: [
                    { at: 'A', from: 0, to: 50, label: '50°' },
                    { at: 'B', from: 120, to: 180, label: '60°' },
                    { at: 'D', from: 230, to: 300, label: 'x' },
                    { at: 'D', from: 300, to: 360, label: 'y' },
                    { at: 'C', from: 180, to: 230, label: 'z' },
                  ],
                }),
                caption: L(
                  'The gold member BD cuts the truss into two triangles. The angles at A and at B (in triangle ABD) are given.',
                  'Batang emas BD membagi rangka menjadi dua segitiga. Sudut di A dan di B (pada segitiga ABD) diketahui.',
                ),
              },
              inline: true,
              blanks: [
                { label: 'x =', answer: 70, after: '^\\circ' },
                { label: 'y =', answer: 60, after: '^\\circ' },
                { label: 'z =', answer: 50, after: '^\\circ' },
              ],
              hints: [
                L(
                  'Triangle ABD already has two known angles. Use the angle sum of a triangle for $x$.',
                  'Segitiga ABD sudah punya dua sudut yang diketahui. Pakai jumlah sudut segitiga untuk $x$.',
                ),
                L(
                  '$L_1\\parallel L_2$ is cut by the diagonal BD, so $y$ is a partner of $\\angle ABD$. For $z$ use triangle BCD, which also needs the angle at B.',
                  '$L_1\\parallel L_2$ dipotong diagonal BD, jadi $y$ berpasangan dengan $\\angle ABD$. Untuk $z$ pakai segitiga BCD, yang juga memerlukan sudut di B.',
                ),
                L(
                  'The angle $\\angle DBC$ is alternate to $x$, because $L_3\\parallel L_4$ is cut by BD. Then the three angles of triangle BCD add up to $180^\\circ$.',
                  'Sudut $\\angle DBC$ berseberangan dengan $x$, karena $L_3\\parallel L_4$ dipotong BD. Lalu ketiga sudut segitiga BCD berjumlah $180^\\circ$.',
                ),
              ],
              explain: L(
                'In triangle ABD, $x=180-50-60=70$. The angle $y$ is alternate to $\\angle ABD$ (between $L_1$ and $L_2$), so $y=60$. The angle $\\angle DBC$ is alternate to $x$ (between $L_3$ and $L_4$), so it is $70^\\circ$. In triangle BCD, $z=180-70-60=50$.',
                'Pada segitiga ABD, $x=180-50-60=70$. Sudut $y$ berseberangan dengan $\\angle ABD$ (di antara $L_1$ dan $L_2$), jadi $y=60$. Sudut $\\angle DBC$ berseberangan dengan $x$ (di antara $L_3$ dan $L_4$), jadi besarnya $70^\\circ$. Pada segitiga BCD, $z=180-70-60=50$.',
              ),
              solution: {
                en: ['x=180-50-60=70', 'y=\\angle ABD=60 \\quad (\\text{alternate angles, } L_1\\parallel L_2)', '\\angle DBC=x=70 \\quad (\\text{alternate angles, } L_3\\parallel L_4)', 'z=180-70-60=50'],
                id: ['x=180-50-60=70', 'y=\\angle ABD=60 \\quad (\\text{sudut dalam berseberangan, } L_1\\parallel L_2)', '\\angle DBC=x=70 \\quad (\\text{sudut dalam berseberangan, } L_3\\parallel L_4)', 'z=180-70-60=50'],
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The two horizontal lines are parallel. The two marked angles are between the lines, on the same side of the slanted line. They are $(2x+10)^\\circ$ and $(3x-5)^\\circ$. Find $x$ and the larger of the two angles.',
                'Kedua garis mendatar sejajar. Dua sudut bertanda berada di antara kedua garis, di sisi yang sama dari garis miring. Besarnya $(2x+10)^\\circ$ dan $(3x-5)^\\circ$. Cari $x$ dan sudut yang lebih besar dari keduanya.',
              ),
              figure: {
                ...parallelLines({ deg: 80, labels: [undefined, undefined, '(2x+10)°', undefined, undefined, '(3x-5)°'] }),
                caption: L(
                  'Two angles between the parallel lines, on the same side of the transversal.',
                  'Dua sudut di antara garis sejajar, di sisi transversal yang sama.',
                ),
              },
              blanks: [
                { label: 'x =', answer: 35 },
                { label: { en: '\\text{larger angle} =', id: '\\text{sudut terbesar} =' }, answer: 100, after: '^\\circ' },
              ],
              hints: [
                L(
                  'Between the lines and on the same side of the transversal: these are co-interior angles. Do they stay equal or add up?',
                  'Di antara kedua garis dan di sisi transversal yang sama: ini sudut dalam sepihak. Apakah sama besar atau berjumlah?',
                ),
                L(
                  'They add up to $180^\\circ$, so write $(2x+10)+(3x-5)=180$ and collect the terms: $5x+5=180$.',
                  'Keduanya berjumlah $180^\\circ$, jadi tulis $(2x+10)+(3x-5)=180$ dan kumpulkan sukunya: $5x+5=180$.',
                ),
                L(
                  'Subtract $5$ from both sides, then divide both sides by $5$ to get $x$. Then work out both angles and pick the larger one.',
                  'Kurangi kedua ruas dengan $5$, lalu bagi kedua ruas dengan $5$ untuk mendapat $x$. Lalu hitung kedua sudut dan pilih yang lebih besar.',
                ),
              ],
              explain: L(
                'Co-interior angles add up to $180^\\circ$: $5x+5=180$ gives $x=35$. The angles are $2(35)+10=80$ and $3(35)-5=100$, and the larger is $100^\\circ$.',
                'Sudut dalam sepihak berjumlah $180^\\circ$: $5x+5=180$ memberi $x=35$. Sudutnya $2(35)+10=80$ dan $3(35)-5=100$, dan yang lebih besar adalah $100^\\circ$.',
              ),
              solution: ['(2x+10)+(3x-5)=180', '5x+5=180', '5x=175', 'x=35', '2(35)+10=80 \\quad 3(35)-5=100', '80<100'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m5-s1-p',
        runtime: 'math',
        title: L('Angles and Lines in Action', 'Sudut dan Garis dalam Aksi'),
        brief: L(
          'Find unknown angles where lines cross, between parallel lines and inside triangles, one clue at a time.',
          'Mencari sudut yang belum diketahui pada garis berpotongan, garis sejajar, dan segitiga, satu petunjuk demi satu petunjuk.',
        ),
        requirements: [
          L('Use straight-line, vertically opposite, corresponding, alternate and co-interior angles.', 'Memakai sudut pada garis lurus, sudut bertolak belakang, sehadap, dalam berseberangan, dan dalam sepihak.'),
          L('Use the angle sum and the exterior angle of a triangle, with numbers or with an unknown x.', 'Memakai jumlah sudut dan sudut luar segitiga, dengan bilangan atau dengan x yang belum diketahui.'),
        ],
        hints: [
          L('Name the relation between two angles first: next to each other on a line, across from each other, or a pair between parallel lines.', 'Sebutkan dulu hubungan dua sudut: berdampingan pada garis lurus, berhadapan, atau pasangan pada garis sejajar.'),
          L('Move one angle at a time: each new angle must come from a known angle by one rule.', 'Pindah satu sudut demi satu sudut: setiap sudut baru harus berasal dari sudut yang diketahui dengan satu aturan.'),
          L('When angles are written with $x$, write an equation from the rule (equal, or a total of $180^\\circ$) and solve it.', 'Jika sudut ditulis dengan $x$, buat persamaan dari aturannya (sama besar, atau berjumlah $180^\\circ$) lalu selesaikan.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Two straight lines cross and one angle is $72^\\circ$. Find the angles $a$, $b$ and $c$.',
              'Dua garis lurus berpotongan dan satu sudutnya $72^\\circ$. Cari sudut $a$, $b$, dan $c$.',
            ),
            figure: {
              ...crossing(72, ['72°', 'a', 'b', 'c']),
              caption: L('Four angles where two lines cross.', 'Empat sudut pada perpotongan dua garis.'),
            },
            inline: true,
            blanks: [
              { label: 'a =', answer: 108, after: '^\\circ' },
              { label: 'b =', answer: 72, after: '^\\circ' },
              { label: 'c =', answer: 108, after: '^\\circ' },
            ],
            solution: ['a=180-72=108', 'b=72', 'c=a=108'],
          },
          {
            prompt: L(
              'In a bridge truss, $L_1\\parallel L_2$ and $L_3\\parallel L_4$, and the angle at $A$ is $65^\\circ$. Find $p$ at $C$ and $q$ at $D$.',
              'Pada rangka jembatan, $L_1\\parallel L_2$ dan $L_3\\parallel L_4$, dan sudut di $A$ besarnya $65^\\circ$. Cari $p$ di $C$ dan $q$ di $D$.',
            ),
            figure: {
              ...truss({
                deg: 65,
                ab: 4,
                arcs: [
                  { at: 'A', from: 0, to: 65, label: '65°' },
                  { at: 'C', from: 180, to: 245, label: 'p' },
                  { at: 'D', from: 245, to: 360, label: 'q' },
                ],
              }),
              caption: L('Two families of parallel lines. One angle is 65°; p is at C and q is at D.', 'Dua keluarga garis sejajar. Satu sudut 65°; p di C dan q di D.'),
            },
            inline: true,
            blanks: [
              { label: 'p =', answer: 65, after: '^\\circ' },
              { label: 'q =', answer: 115, after: '^\\circ' },
            ],
            solution: {
              en: ['\\text{Angle at } B \\text{ above } L_2 = 65 \\quad (\\text{corresponding to } A, \\; L_3\\parallel L_4)', 'p=65 \\quad (\\text{alternate with that angle, } L_1\\parallel L_2)', 'q+65=180 \\quad (\\text{co-interior with } A, \\; L_1\\parallel L_2)', 'q=115'],
              id: ['\\text{Sudut di } B \\text{ di atas } L_2 = 65 \\quad (\\text{sehadap dengan } A, \\; L_3\\parallel L_4)', 'p=65 \\quad (\\text{berseberangan dengan sudut itu, } L_1\\parallel L_2)', 'q+65=180 \\quad (\\text{sepihak dengan } A, \\; L_1\\parallel L_2)', 'q=115'],
            },
          },
          {
            prompt: L(
              'Budi cuts a triangular flag. Its three corners measure $(x+20)^\\circ$, $(2x-10)^\\circ$ and $(3x+14)^\\circ$. Find $x$ and the largest angle.',
              'Budi menggunting bendera berbentuk segitiga. Ketiga sudutnya berukuran $(x+20)^\\circ$, $(2x-10)^\\circ$, dan $(3x+14)^\\circ$. Cari $x$ dan sudut terbesar.',
            ),
            blanks: [
              { label: 'x =', answer: 26 },
              { label: { en: '\\text{largest angle} =', id: '\\text{sudut terbesar} =' }, answer: 92, after: '^\\circ' },
            ],
            solution: ['(x+20)+(2x-10)+(3x+14)=180', '6x+24=180', '6x=156', 'x=26', '3(26)+14=92'],
          },
          {
            prompt: L(
              'In triangle $ABC$, $AB=AC$. Side $BC$ is extended to $D$, and the exterior angle $\\angle ACD$ is $110^\\circ$. Find $\\angle B$ and $\\angle A$.',
              'Pada segitiga $ABC$, $AB=AC$. Sisi $BC$ diperpanjang sampai $D$, dan sudut luar $\\angle ACD$ besarnya $110^\\circ$. Cari $\\angle B$ dan $\\angle A$.',
            ),
            figure: (() => {
              const A: Pt = [3, tidy(3 * Math.tan(rad(70)))]
              const B: Pt = [0, 0]
              const C: Pt = [6, 0]
              const D: Pt = [9.5, 0]
              return {
                ...shape({ pts: [A, B, C], names: 'ABC', extra: [line(C, D, 'muted'), txt(10, 0.45, 'D', 'lg', 'result'), arcAt(C, D, A, '110°')] }),
                caption: L('Isosceles triangle ABC with BC extended to D.', 'Segitiga sama kaki ABC dengan BC diperpanjang sampai D.'),
              }
            })(),
            inline: true,
            blanks: [
              { label: '\\angle B =', answer: 70, after: '^\\circ' },
              { label: '\\angle A =', answer: 40, after: '^\\circ' },
            ],
            solution: ['\\angle ACB=180-110=70', '\\angle B=\\angle ACB=70 \\quad (AB=AC)', '\\angle A=180-70-70=40'],
          },
        ],
      },
    },
    /* ======================================================= S2: Pythagorean theorem */
    {
      id: 'tka-smp-m5-s2',
      title: L('The Pythagorean Theorem', 'Teorema Pythagoras'),
      summary: L(
        'The relation a² + b² = c² in a right triangle, Pythagorean triples, and using the theorem for ladders, diagonals, distances and heights.',
        'Hubungan a² + b² = c² pada segitiga siku-siku, tripel Pythagoras, serta memakai teorema untuk tangga, diagonal, jarak, dan tinggi.',
      ),
      lessons: [
        /* ------------------------------------------------ S2 L1 discovering the theorem */
        {
          id: 'tka-smp-m5-s2-l1',
          title: L('Discovering and Using the Theorem', 'Menemukan dan Memakai Teorema Pythagoras'),
          goal: L(
            'You can use a² + b² = c² to find the hypotenuse or a missing leg of a right triangle, and you know the common Pythagorean triples.',
            'Kamu bisa memakai a² + b² = c² untuk mencari sisi miring atau sisi siku-siku yang hilang pada segitiga siku-siku, dan kamu mengenal tripel Pythagoras yang umum.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Squares on the Sides', 'Ayo Amati: Persegi pada Sisi-sisinya'),
              body: L(
                'A carpenter checks a corner with a rope marked 3, 4 and 5 units. The sides of a **right triangle** have names: the two sides that make the right angle are the **legs**, and the side opposite the right angle is the **hypotenuse**. It is always the longest side.\n\nDraw a square on each side and count the unit cells:\n\n- The green square on the leg of length 3 has $3\\times3=9$ cells.\n- The orange square on the leg of length 4 has $4\\times4=16$ cells.\n- The gold square on the hypotenuse has $5\\times5=25$ cells, and $9+16=25$.\n\nThis is the **Pythagorean theorem**. In a right triangle with legs $a$ and $b$ and hypotenuse $c$:\n$$a^2+b^2=c^2$$',
                'Seorang tukang kayu memeriksa sudut siku-siku dengan tali bertanda 3, 4, dan 5 satuan. Sisi-sisi **segitiga siku-siku** punya nama: dua sisi yang membentuk sudut siku-siku disebut **sisi siku-siku**, dan sisi di depan sudut siku-siku disebut **sisi miring** (hipotenusa). Sisi miring selalu sisi terpanjang.\n\nGambar sebuah persegi pada setiap sisi, lalu hitung petak satuannya:\n\n- Persegi hijau pada sisi siku-siku sepanjang 3 punya $3\\times3=9$ petak.\n- Persegi oranye pada sisi siku-siku sepanjang 4 punya $4\\times4=16$ petak.\n- Persegi emas pada sisi miring punya $5\\times5=25$ petak, dan $9+16=25$.\n\nInilah **teorema Pythagoras**. Pada segitiga siku-siku dengan sisi siku-siku $a$ dan $b$ serta sisi miring $c$:\n$$a^2+b^2=c^2$$',
              ),
              figure: {
                ...pythGrid(3, 4),
                caption: L(
                  'A square on every side of the 3-4-5 triangle, with its unit cells: 9 + 16 = 25.',
                  'Sebuah persegi pada setiap sisi segitiga 3-4-5, lengkap dengan petak satuannya: 9 + 16 = 25.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Finding the Hypotenuse and a Leg', 'Contoh Bertahap: Mencari Sisi Miring dan Sisi Siku-siku'),
              body: L(
                'The legs of a right triangle are 6 cm and 8 cm. Find the hypotenuse $c$.\n\n1. Step 1: Find the right angle. The sides next to it are the legs, so $a=6$ and $b=8$. The side opposite it is $c$.\n2. Step 2: Write the theorem: $a^2+b^2=c^2$.\n3. Step 3: Put in the numbers: $6^2+8^2=36+64=100$, so $c^2=100$.\n4. Step 4: Take the square root: $c=\\sqrt{100}=10$ cm.\n\n**Remember:**\n\n- Hypotenuse unknown: ADD the squares, then take the root: $c=\\sqrt{a^2+b^2}$.\n- A leg unknown: SUBTRACT: $b=\\sqrt{c^2-a^2}$.\n- If the number is not a perfect square, leave the root: legs 2 and 3 give $c=\\sqrt{13}$.',
                'Sisi siku-siku suatu segitiga siku-siku adalah 6 cm dan 8 cm. Cari sisi miring $c$.\n\n1. Langkah 1: Temukan sudut siku-sikunya. Sisi-sisi di sampingnya adalah sisi siku-siku, jadi $a=6$ dan $b=8$. Sisi di depannya adalah $c$.\n2. Langkah 2: Tulis teoremanya: $a^2+b^2=c^2$.\n3. Langkah 3: Masukkan bilangannya: $6^2+8^2=36+64=100$, jadi $c^2=100$.\n4. Langkah 4: Tarik akar kuadratnya: $c=\\sqrt{100}=10$ cm.\n\n**Ingat:**\n\n- Sisi miring yang dicari: JUMLAHKAN kuadratnya, lalu tarik akar: $c=\\sqrt{a^2+b^2}$.\n- Sisi siku-siku yang dicari: KURANGKAN: $b=\\sqrt{c^2-a^2}$.\n- Jika bilangannya bukan kuadrat sempurna, biarkan dalam bentuk akar: sisi siku-siku 2 dan 3 memberi $c=\\sqrt{13}$.',
              ),
              figure: {
                ...rightTri(8, 6, ['8', 'c', '6']),
                caption: L('A right triangle with legs 6 and 8.', 'Segitiga siku-siku dengan sisi siku-siku 6 dan 8.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Look Closely: Pythagorean Triples', 'Ayo Amati: Tripel Pythagoras'),
              body: L(
                'Three whole numbers that fit $a^2+b^2=c^2$ are called a **Pythagorean triple**. Multiply all three numbers by the same number and you get another triple.\n\n| Triple | Check | Multiples |\n|---|---|---|\n| 3, 4, 5 | $9+16=25$ | 6, 8, 10 and 9, 12, 15 |\n| 5, 12, 13 | $25+144=169$ | 10, 24, 26 |\n| 8, 15, 17 | $64+225=289$ | 16, 30, 34 |\n| 7, 24, 25 | $49+576=625$ | 14, 48, 50 |\n\nIf you spot a triple you can write the third side without any calculation. The picture shows 5, 12, 13.',
                'Tiga bilangan bulat yang memenuhi $a^2+b^2=c^2$ disebut **tripel Pythagoras**. Kalikan ketiga bilangan dengan bilangan yang sama, maka kamu mendapat tripel yang lain.\n\n| Tripel | Pemeriksaan | Kelipatannya |\n|---|---|---|\n| 3, 4, 5 | $9+16=25$ | 6, 8, 10 dan 9, 12, 15 |\n| 5, 12, 13 | $25+144=169$ | 10, 24, 26 |\n| 8, 15, 17 | $64+225=289$ | 16, 30, 34 |\n| 7, 24, 25 | $49+576=625$ | 14, 48, 50 |\n\nJika kamu mengenali sebuah tripel, sisi ketiga bisa ditulis tanpa menghitung. Gambar menunjukkan 5, 12, 13.',
              ),
              figure: {
                ...rightTri(12, 5, ['12', '13', '5']),
                caption: L('The 5-12-13 triangle: 25 + 144 = 169.', 'Segitiga 5-12-13: 25 + 144 = 169.'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Squares, Roots and the Longest Side', 'Awas, Jebakan!: Kuadrat, Akar, dan Sisi Terpanjang'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| Legs 5 and 12, so $c=5+12=17$. | Add the SQUARES, not the sides: $c=\\sqrt{25+144}=\\sqrt{169}=13$. |\n| Legs 6 and 8, so $c=\\sqrt6+\\sqrt8$. | Put the sum of the squares under ONE root: $c=\\sqrt{6^2+8^2}=\\sqrt{100}=10$. |\n| Hypotenuse 13 and leg 5, so the other leg is $\\sqrt{13^2+5^2}$. | The hypotenuse is the longest side and stands alone: $\\sqrt{13^2-5^2}=\\sqrt{144}=12$. |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| Sisi siku-siku 5 dan 12, jadi $c=5+12=17$. | Jumlahkan KUADRATNYA, bukan sisinya: $c=\\sqrt{25+144}=\\sqrt{169}=13$. |\n| Sisi siku-siku 6 dan 8, jadi $c=\\sqrt6+\\sqrt8$. | Letakkan jumlah kuadrat di bawah SATU akar: $c=\\sqrt{6^2+8^2}=\\sqrt{100}=10$. |\n| Sisi miring 13 dan satu sisi siku-siku 5, jadi sisi siku-siku lainnya $\\sqrt{13^2+5^2}$. | Sisi miring adalah sisi terpanjang dan berdiri sendiri: $\\sqrt{13^2-5^2}=\\sqrt{144}=12$. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The legs of a right triangle are 9 cm and 12 cm. How long is the hypotenuse $x$?',
                'Sisi siku-siku suatu segitiga siku-siku adalah 9 cm dan 12 cm. Berapa panjang sisi miring $x$?',
              ),
              figure: {
                ...rightTri(12, 9, ['12', 'x', '9']),
                caption: L('A right triangle with legs 9 and 12.', 'Segitiga siku-siku dengan sisi siku-siku 9 dan 12.'),
              },
              options: [
                L('$15$ cm', '$15$ cm'),
                L('$21$ cm', '$21$ cm'),
                L('$\\sqrt{63}$ cm', '$\\sqrt{63}$ cm'),
                L('$225$ cm', '$225$ cm'),
              ],
              answer: 0,
              explain: L(
                'Add the squares and take the root: $x=\\sqrt{81+144}=\\sqrt{225}=15$. The answer 21 adds the sides, $\\sqrt{63}$ subtracts the squares (that is for a missing leg), and 225 forgets the square root.',
                'Jumlahkan kuadratnya dan tarik akar: $x=\\sqrt{81+144}=\\sqrt{225}=15$. Jawaban 21 menjumlahkan sisinya, $\\sqrt{63}$ mengurangkan kuadratnya (itu untuk sisi siku-siku yang hilang), dan 225 lupa menarik akar.',
              ),
              hint: L(
                'The unknown side is opposite the right angle. Do you add the squares or subtract them, and what must you do at the end?',
                'Sisi yang dicari berada di depan sudut siku-siku. Apakah kuadratnya dijumlahkan atau dikurangkan, dan apa yang harus dilakukan di akhir?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the legs of a right triangle are $5$ and $12$. Find the hypotenuse $c$.',
                'Coba bersama: sisi siku-siku suatu segitiga siku-siku adalah $5$ dan $12$. Cari sisi miring $c$.',
              ),
              template: 'c^2=5^2+12^2=___+___=___ \\quad c=___',
              blanks: ['25', '144', '169', '13'],
              explain: L(
                '$5^2=25$ and $12^2=144$, so $c^2=169$ and $c=\\sqrt{169}=13$. This is the 5-12-13 triple.',
                '$5^2=25$ dan $12^2=144$, jadi $c^2=169$ dan $c=\\sqrt{169}=13$. Ini adalah tripel 5-12-13.',
              ),
              hint: L(
                'Square each leg first, add the two squares, and only then take the square root.',
                'Kuadratkan dulu setiap sisi siku-siku, jumlahkan kedua kuadrat, dan baru kemudian tarik akar.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The hypotenuse of a right triangle is 17 cm and one leg is 8 cm. How long is the other leg $x$?',
                'Sisi miring suatu segitiga siku-siku 17 cm dan satu sisi siku-sikunya 8 cm. Berapa panjang sisi siku-siku lainnya $x$?',
              ),
              figure: {
                ...rightTri(15, 8, ['x', '17', '8']),
                caption: L('The hypotenuse is 17 and one leg is 8.', 'Sisi miringnya 17 dan satu sisi siku-sikunya 8.'),
              },
              options: [
                L('$15$ cm', '$15$ cm'),
                L('$9$ cm', '$9$ cm'),
                L('$25$ cm', '$25$ cm'),
                L('$\\sqrt{353}$ cm', '$\\sqrt{353}$ cm'),
              ],
              answer: 0,
              explain: L(
                'A leg is missing, so subtract the squares: $x=\\sqrt{17^2-8^2}=\\sqrt{289-64}=\\sqrt{225}=15$. The answer 9 subtracts the sides, 25 adds them, and $\\sqrt{353}$ adds the squares as if $x$ were the hypotenuse.',
                'Sisi siku-siku yang dicari, jadi kurangkan kuadratnya: $x=\\sqrt{17^2-8^2}=\\sqrt{289-64}=\\sqrt{225}=15$. Jawaban 9 mengurangkan sisinya, 25 menjumlahkannya, dan $\\sqrt{353}$ menjumlahkan kuadrat seolah-olah $x$ adalah sisi miring.',
              ),
              hint: L(
                'Which side is the longest one, 17 or the unknown? The longest side stands alone on one side of the equation.',
                'Sisi mana yang terpanjang, 17 atau yang dicari? Sisi terpanjang berdiri sendiri di satu ruas persamaan.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Which TWO sets of three numbers are the sides of a right triangle?',
                'Himpunan tiga bilangan manakah yang merupakan sisi-sisi segitiga siku-siku? Pilih DUA jawaban yang benar.',
              ),
              options: [
                L('10, 24, 26', '10, 24, 26'),
                L('12, 16, 20', '12, 16, 20'),
                L('7, 24, 26', '7, 24, 26'),
                L('9, 12, 16', '9, 12, 16'),
              ],
              answer: [0, 1],
              explain: L(
                '$10^2+24^2=100+576=676=26^2$ and $12^2+16^2=144+256=400=20^2$. For the others: $7^2+24^2=625$ but $26^2=676$, and $9^2+12^2=225$ but $16^2=256$.',
                '$10^2+24^2=100+576=676=26^2$ dan $12^2+16^2=144+256=400=20^2$. Untuk yang lain: $7^2+24^2=625$ tetapi $26^2=676$, dan $9^2+12^2=225$ tetapi $16^2=256$.',
              ),
              hint: L(
                'Take the largest number as $c$. Square it and compare with the sum of the other two squares.',
                'Ambil bilangan terbesar sebagai $c$. Kuadratkan, lalu bandingkan dengan jumlah kuadrat dua bilangan lainnya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The legs of a right triangle are 20 cm and 21 cm. Find the hypotenuse, and then the perimeter of the triangle.',
                'Sisi siku-siku suatu segitiga siku-siku adalah 20 cm dan 21 cm. Cari sisi miringnya, lalu keliling segitiga itu.',
              ),
              blanks: [
                { label: 'c =', answer: 29, after: '\\text{ cm}' },
                { label: { en: '\\text{perimeter} =', id: '\\text{keliling} =' }, answer: 70, after: '\\text{ cm}' },
              ],
              hints: [
                L(
                  'Which sides are given: the legs or the hypotenuse? That decides whether you add or subtract the squares.',
                  'Sisi mana yang diketahui: sisi siku-siku atau sisi miring? Itu menentukan apakah kuadrat dijumlahkan atau dikurangkan.',
                ),
                L(
                  'The legs are given, so $c^2=20^2+21^2$. Work out both squares and add them.',
                  'Sisi siku-siku yang diketahui, jadi $c^2=20^2+21^2$. Hitung kedua kuadrat lalu jumlahkan.',
                ),
                L(
                  'The sum of the two squares is a perfect square. Find its root. The perimeter is the sum of all three sides.',
                  'Jumlah kedua kuadrat itu adalah kuadrat sempurna. Cari akarnya. Keliling adalah jumlah ketiga sisi.',
                ),
              ],
              explain: L(
                '$c^2=20^2+21^2=400+441=841$, so $c=29$ cm. The perimeter is $20+21+29=70$ cm.',
                '$c^2=20^2+21^2=400+441=841$, jadi $c=29$ cm. Kelilingnya $20+21+29=70$ cm.',
              ),
              solution: ['c^2=20^2+21^2', 'c^2=400+441=841', 'c=\\sqrt{841}=29', 'P=20+21+29=70'],
            },
          ],
        },
        /* ------------------------------------------------ S2 L2 applying the theorem */
        {
          id: 'tka-smp-m5-s2-l2',
          title: L('Applying the Theorem', 'Menerapkan Teorema Pythagoras'),
          goal: L(
            'You can find the right triangle hidden in ladders, diagonals, distances on a grid and isosceles triangles, and you can test whether a triangle is right-angled.',
            'Kamu bisa menemukan segitiga siku-siku yang tersembunyi pada tangga, diagonal, jarak pada kisi, dan segitiga sama kaki, serta menguji apakah suatu segitiga siku-siku.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Right Triangles in Disguise', 'Ayo Amati: Segitiga Siku-siku yang Tersembunyi'),
              body: L(
                'A painter leans a 5 m ladder against a wall, with its foot 3 m from the wall. The wall and the ground meet at a right angle, so the wall, the ground and the ladder form a right triangle. The ladder is the hypotenuse, so it reaches $\\sqrt{5^2-3^2}=\\sqrt{16}=4$ m up the wall.\n\nMany problems hide a right triangle:\n\n| Situation | The hypotenuse is |\n|---|---|\n| A ladder against a wall | the ladder |\n| The diagonal of a rectangle | the diagonal |\n| The distance between two points | the straight segment that joins them |\n| The height of an isosceles triangle | one of the two equal sides |\n\nFirst draw the right triangle and mark the hypotenuse. Then decide: add the squares or subtract them.',
                'Seorang tukang cat menyandarkan tangga 5 m pada dinding, dengan kaki tangga 3 m dari dinding. Dinding dan tanah bertemu membentuk sudut siku-siku, sehingga dinding, tanah, dan tangga membentuk segitiga siku-siku. Tangga adalah sisi miringnya, jadi tangga mencapai $\\sqrt{5^2-3^2}=\\sqrt{16}=4$ m tingginya pada dinding.\n\nBanyak soal menyembunyikan segitiga siku-siku:\n\n| Keadaan | Sisi miringnya adalah |\n|---|---|\n| Tangga bersandar pada dinding | tangganya |\n| Diagonal persegi panjang | diagonalnya |\n| Jarak antara dua titik | ruas garis lurus yang menghubungkan keduanya |\n| Tinggi segitiga sama kaki | salah satu dari dua sisi yang sama panjang |\n\nGambar dulu segitiga siku-sikunya dan tandai sisi miringnya. Lalu putuskan: kuadrat dijumlahkan atau dikurangkan.',
              ),
              figure: {
                ...rightTri(3, 4, ['3', '5', '4']),
                caption: L(
                  'A ladder against a wall: the ladder is the hypotenuse of the right triangle.',
                  'Tangga bersandar pada dinding: tangga adalah sisi miring segitiga siku-siku.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Distance Between Two Points', 'Contoh Bertahap: Jarak Antara Dua Titik'),
              body: L(
                'Find the distance between $A(1,2)$ and $B(7,10)$.\n\n1. Step 1: Draw a right triangle with a horizontal leg and a vertical leg. The third corner is $C(7,2)$.\n2. Step 2: The horizontal leg is $AC=7-1=6$. The vertical leg is $BC=10-2=8$.\n3. Step 3: The distance $AB$ is the hypotenuse: $AB^2=6^2+8^2=36+64=100$.\n4. Step 4: $AB=\\sqrt{100}=10$ units.\n\n**Remember:**\n\n- The distance between $(x_1,y_1)$ and $(x_2,y_2)$ is $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.\n- Subtract the $x$-values for one leg and the $y$-values for the other.',
                'Cari jarak antara $A(1,2)$ dan $B(7,10)$.\n\n1. Langkah 1: Gambar segitiga siku-siku dengan satu sisi mendatar dan satu sisi tegak. Titik sudut ketiganya $C(7,2)$.\n2. Langkah 2: Sisi mendatarnya $AC=7-1=6$. Sisi tegaknya $BC=10-2=8$.\n3. Langkah 3: Jarak $AB$ adalah sisi miring: $AB^2=6^2+8^2=36+64=100$.\n4. Langkah 4: $AB=\\sqrt{100}=10$ satuan.\n\n**Ingat:**\n\n- Jarak antara $(x_1,y_1)$ dan $(x_2,y_2)$ adalah $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.\n- Kurangkan nilai-$x$ untuk satu sisi dan nilai-$y$ untuk sisi lainnya.',
              ),
              figure: {
                ...plane([-1, 10], [-1, 12], [
                  line([1, 2], [7, 10], 'a', { width: 3 }),
                  line([1, 2], [7, 2], 'b', { dashed: true }),
                  line([7, 2], [7, 10], 'b', { dashed: true }),
                  { t: 'right', at: [7, 2], from: [1, 2], to: [7, 10] },
                  { t: 'dot', x: 1, y: 2, label: 'A', color: 'a' },
                  { t: 'dot', x: 7, y: 10, label: 'B', color: 'a' },
                  { t: 'dot', x: 7, y: 2, label: 'C', color: 'a' },
                ]),
                caption: L(
                  'The distance AB is the hypotenuse of a right triangle with legs 6 and 8.',
                  'Jarak AB adalah sisi miring segitiga siku-siku dengan sisi siku-siku 6 dan 8.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Look Closely: Is It a Right Triangle?', 'Ayo Amati: Apakah Ini Segitiga Siku-siku?'),
              body: L(
                'The theorem works the other way round too. Take the longest side as $c$ and compare $a^2+b^2$ with $c^2$.\n\n| Compare | The triangle is |\n|---|---|\n| $a^2+b^2=c^2$ | right-angled |\n| $a^2+b^2>c^2$ | acute: all angles are less than $90^\\circ$ |\n| $a^2+b^2<c^2$ | obtuse: one angle is more than $90^\\circ$ |\n\nExample: sides 7, 9 and 12. The longest side is 12, so $c^2=144$. Then $7^2+9^2=49+81=130$, and $130<144$, so the triangle is obtuse. Sides 8, 15 and 17 give $64+225=289=17^2$, so that triangle is right-angled.',
                'Teorema ini berlaku juga sebaliknya. Ambil sisi terpanjang sebagai $c$ dan bandingkan $a^2+b^2$ dengan $c^2$.\n\n| Perbandingan | Segitiganya |\n|---|---|\n| $a^2+b^2=c^2$ | siku-siku |\n| $a^2+b^2>c^2$ | lancip: semua sudut kurang dari $90^\\circ$ |\n| $a^2+b^2<c^2$ | tumpul: satu sudut lebih dari $90^\\circ$ |\n\nContoh: sisi 7, 9, dan 12. Sisi terpanjang 12, jadi $c^2=144$. Lalu $7^2+9^2=49+81=130$, dan $130<144$, jadi segitiga itu tumpul. Sisi 8, 15, dan 17 memberi $64+225=289=17^2$, jadi segitiga itu siku-siku.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Longest Side, Half the Base, Straight Path', 'Awas, Jebakan!: Sisi Terpanjang, Setengah Alas, Jalur Lurus'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| Sides 5, 12, 13: $5^2+13^2=12^2$. | The longest side is always $c$: $5^2+12^2=169=13^2$. |\n| The height of the isosceles triangle in the picture is $\\sqrt{10^2-12^2}$ (the whole base is used). | The height cuts the base in half: $h=\\sqrt{10^2-6^2}=\\sqrt{64}=8$. |\n| The distance between $(1,2)$ and $(7,10)$ is $6+8=14$. | The straight way is the hypotenuse: $\\sqrt{6^2+8^2}=10$. The 14 is the way along the grid lines. |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| Sisi 5, 12, 13: $5^2+13^2=12^2$. | Sisi terpanjang selalu $c$: $5^2+12^2=169=13^2$. |\n| Tinggi segitiga sama kaki pada gambar adalah $\\sqrt{10^2-12^2}$ (seluruh alas dipakai). | Tinggi membagi alas menjadi dua sama panjang: $h=\\sqrt{10^2-6^2}=\\sqrt{64}=8$. |\n| Jarak antara $(1,2)$ dan $(7,10)$ adalah $6+8=14$. | Jalur lurusnya adalah sisi miring: $\\sqrt{6^2+8^2}=10$. Angka 14 adalah jalur menyusuri garis kisi. |',
              ),
              figure: {
                ...isoTri(6, 8, ['10', '12', '10']),
                caption: L(
                  'An isosceles triangle: the height h splits the base 12 into 6 and 6.',
                  'Segitiga sama kaki: tinggi h membagi alas 12 menjadi 6 dan 6.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A 13 m ladder leans against a wall with its foot 5 m from the wall. How high up the wall does it reach?',
                'Sebuah tangga 13 m bersandar pada dinding dengan kaki tangga 5 m dari dinding. Berapa tinggi dinding yang dicapai tangga?',
              ),
              figure: {
                ...rightTri(5, 12, ['5', '13', 'x']),
                caption: L('The ladder is the hypotenuse; x is the height reached.', 'Tangga adalah sisi miring; x adalah tinggi yang dicapai.'),
              },
              options: [
                L('$12$ m', '$12$ m'),
                L('$8$ m', '$8$ m'),
                L('$18$ m', '$18$ m'),
                L('$\\sqrt{194}$ m', '$\\sqrt{194}$ m'),
              ],
              answer: 0,
              explain: L(
                'The ladder is the hypotenuse, so $x=\\sqrt{13^2-5^2}=\\sqrt{144}=12$ m. The answer 8 subtracts the lengths, 18 adds them, and $\\sqrt{194}$ treats the ladder as a leg.',
                'Tangga adalah sisi miring, jadi $x=\\sqrt{13^2-5^2}=\\sqrt{144}=12$ m. Jawaban 8 mengurangkan panjangnya, 18 menjumlahkannya, dan $\\sqrt{194}$ menganggap tangga sebagai sisi siku-siku.',
              ),
              hint: L(
                'Which of the three lengths is the hypotenuse? Then decide: add or subtract the squares?',
                'Manakah dari ketiga panjang itu yang sisi miring? Lalu tentukan: kuadrat dijumlahkan atau dikurangkan?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find the distance between $P(1,1)$ and $Q(6,13)$. The third corner of the right triangle is $R(6,1)$.',
                'Coba bersama: cari jarak antara $P(1,1)$ dan $Q(6,13)$. Titik sudut ketiga segitiga siku-sikunya adalah $R(6,1)$.',
              ),
              figure: {
                ...plane([-1, 8], [-1, 15], [
                  line([1, 1], [6, 13], 'a', { width: 3 }),
                  line([1, 1], [6, 1], 'b', { dashed: true }),
                  line([6, 1], [6, 13], 'b', { dashed: true }),
                  { t: 'right', at: [6, 1], from: [1, 1], to: [6, 13] },
                  { t: 'dot', x: 1, y: 1, label: 'P', color: 'a' },
                  { t: 'dot', x: 6, y: 13, label: 'Q', color: 'a' },
                  { t: 'dot', x: 6, y: 1, label: 'R', color: 'a' },
                ]),
                caption: L('PQ is the hypotenuse of a right triangle PRQ.', 'PQ adalah sisi miring segitiga siku-siku PRQ.'),
              },
              template: '6-1=___ \\quad 13-1=___ \\quad d^2=25+144=___ \\quad d=___',
              blanks: ['5', '12', '169', '13'],
              explain: L(
                'The legs are $6-1=5$ and $13-1=12$. Then $d^2=25+144=169$ and $d=13$ units.',
                'Sisi siku-sikunya $6-1=5$ dan $13-1=12$. Lalu $d^2=25+144=169$ dan $d=13$ satuan.',
              ),
              hint: L(
                'Each leg is the difference of two coordinates: first the $x$-values, then the $y$-values.',
                'Setiap sisi siku-siku adalah selisih dua koordinat: dulu nilai-$x$, lalu nilai-$y$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A square has sides of 6 cm. How long is its diagonal $d$?',
                'Sebuah persegi bersisi 6 cm. Berapa panjang diagonalnya $d$?',
              ),
              figure: {
                ...shape({
                  pts: [[0, 0], [6, 0], [6, 6], [0, 6]],
                  sides: ['6', '6'],
                  rights: [0, 1, 2, 3],
                  extra: [line([0, 0], [6, 6], 'b', { dashed: true }), txt(2.4, 3.7, 'd', 'lg', 'result')],
                }),
                caption: L('The diagonal cuts the square into two right triangles.', 'Diagonal membagi persegi menjadi dua segitiga siku-siku.'),
              },
              options: [
                L('$6\\sqrt{2}$ cm', '$6\\sqrt{2}$ cm'),
                L('$12$ cm', '$12$ cm'),
                L('$\\sqrt{12}$ cm', '$\\sqrt{12}$ cm'),
                L('$72$ cm', '$72$ cm'),
              ],
              answer: 0,
              explain: L(
                'The diagonal is the hypotenuse of a right triangle with legs 6 and 6: $d=\\sqrt{36+36}=\\sqrt{72}=6\\sqrt{2}$ cm. The answer 12 adds the sides, $\\sqrt{12}$ adds the sides before taking the root, and 72 is $d^2$: the root is missing.',
                'Diagonal adalah sisi miring segitiga siku-siku dengan sisi siku-siku 6 dan 6: $d=\\sqrt{36+36}=\\sqrt{72}=6\\sqrt{2}$ cm. Jawaban 12 menjumlahkan sisinya, $\\sqrt{12}$ menjumlahkan sisinya sebelum menarik akar, dan 72 adalah $d^2$: akarnya belum ditarik.',
              ),
              hint: L(
                'The diagonal and two sides of the square form a right triangle. Which side is the hypotenuse, and are the squares added or subtracted?',
                'Diagonal dan dua sisi persegi membentuk segitiga siku-siku. Sisi mana yang sisi miring, dan apakah kuadratnya dijumlahkan atau dikurangkan?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'Decide whether each statement about a triangle with the given sides is True or False.',
                'Tentukan apakah setiap pernyataan tentang segitiga dengan panjang sisi yang diberikan Benar atau Salah.',
              ),
              statements: [
                L('A triangle with sides 4, 5 and 7 is acute.', 'Segitiga dengan sisi 4, 5, dan 7 adalah segitiga lancip.'),
                L('A triangle with sides 9, 12 and 15 is right-angled.', 'Segitiga dengan sisi 9, 12, dan 15 adalah segitiga siku-siku.'),
                L('A triangle with sides 5, 6 and 8 is obtuse.', 'Segitiga dengan sisi 5, 6, dan 8 adalah segitiga tumpul.'),
                L('A triangle with sides 6, 7 and 8 is right-angled.', 'Segitiga dengan sisi 6, 7, dan 8 adalah segitiga siku-siku.'),
              ],
              answer: [false, true, true, false],
              explain: L(
                '$4^2+5^2=41<49=7^2$, so it is obtuse, not acute. $9^2+12^2=225=15^2$, so it is right-angled. $5^2+6^2=61<64=8^2$, so it is obtuse. $6^2+7^2=85$ and $8^2=64$ are not equal, so it is not right-angled (it is acute).',
                '$4^2+5^2=41<49=7^2$, jadi tumpul, bukan lancip. $9^2+12^2=225=15^2$, jadi siku-siku. $5^2+6^2=61<64=8^2$, jadi tumpul. $6^2+7^2=85$ dan $8^2=64$ tidak sama, jadi bukan siku-siku (segitiga itu lancip).',
              ),
              hint: L(
                'For each triangle, square the longest side and compare it with the sum of the other two squares: equal, bigger or smaller?',
                'Untuk setiap segitiga, kuadratkan sisi terpanjang dan bandingkan dengan jumlah dua kuadrat lainnya: sama, lebih besar, atau lebih kecil?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'An isosceles triangle has two equal sides of 17 cm and a base of 16 cm. Find its height and its area.',
                'Sebuah segitiga sama kaki mempunyai dua sisi yang sama panjang 17 cm dan alas 16 cm. Cari tingginya dan luasnya.',
              ),
              figure: {
                ...isoTri(8, 15, ['17', '16', '17']),
                caption: L('The height h is drawn to the middle of the base.', 'Tinggi h ditarik ke tengah alas.'),
              },
              blanks: [
                { label: 'h =', answer: 15, after: '\\text{ cm}' },
                { label: { en: '\\text{area} =', id: '\\text{luas} =' }, answer: 120, after: '\\text{ cm}^2' },
              ],
              hints: [
                L(
                  'The height cuts the isosceles triangle into two equal right triangles. What is half of the base?',
                  'Tinggi membagi segitiga sama kaki menjadi dua segitiga siku-siku yang sama. Berapa setengah alasnya?',
                ),
                L(
                  'In one right triangle the hypotenuse is 17 and one leg is 8. Subtract the squares to find the other leg, $h$.',
                  'Pada satu segitiga siku-siku, sisi miringnya 17 dan satu sisi siku-sikunya 8. Kurangkan kuadratnya untuk mencari sisi siku-siku lainnya, $h$.',
                ),
                L(
                  'You get $h^2=289-64$. Work it out and take the root, then use area $=\\frac{1}{2}\\times\\text{base}\\times\\text{height}$ with the WHOLE base 16.',
                  'Diperoleh $h^2=289-64$. Hitung lalu tarik akarnya, lalu pakai luas $=\\frac{1}{2}\\times\\text{alas}\\times\\text{tinggi}$ dengan alas SELURUHNYA, yaitu 16.',
                ),
              ],
              explain: L(
                'Half the base is 8, so $h=\\sqrt{17^2-8^2}=\\sqrt{225}=15$ cm. The area is $\\frac{1}{2}\\times16\\times15=120$ cm$^2$.',
                'Setengah alas adalah 8, jadi $h=\\sqrt{17^2-8^2}=\\sqrt{225}=15$ cm. Luasnya $\\frac{1}{2}\\times16\\times15=120$ cm$^2$.',
              ),
              solution: ['h^2=17^2-8^2=289-64=225', 'h=15', 'A=\\frac{1}{2}\\times16\\times15=120'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m5-s2-p',
        runtime: 'math',
        title: L('The Theorem at Work', 'Teorema Pythagoras dalam Aksi'),
        brief: L(
          'Use a² + b² = c² for a triangle, a distance on a grid, a path across a field and a ladder that slips.',
          'Memakai a² + b² = c² untuk segitiga, jarak pada kisi, jalur melintasi lapangan, dan tangga yang merosot.',
        ),
        requirements: [
          L('Find a hypotenuse or a missing leg and give the result as a number or a root.', 'Mencari sisi miring atau sisi siku-siku yang hilang dan menuliskan hasilnya sebagai bilangan atau bentuk akar.'),
          L('Spot the right triangle in a word problem or on a coordinate grid, and combine several steps.', 'Menemukan segitiga siku-siku pada soal cerita atau pada kisi koordinat, dan menggabungkan beberapa langkah.'),
        ],
        hints: [
          L('Draw the right triangle and mark the hypotenuse first.', 'Gambar dulu segitiga siku-sikunya dan tandai sisi miringnya.'),
          L('Hypotenuse unknown: add the squares. A leg unknown: subtract the squares.', 'Sisi miring dicari: jumlahkan kuadratnya. Sisi siku-siku dicari: kurangkan kuadratnya.'),
          L('In a long problem, find one new length at a time and write it down before you go on.', 'Pada soal yang panjang, cari satu panjang baru demi satu panjang dan tuliskan sebelum melanjutkan.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'The legs of a right triangle are 15 cm and 20 cm. Find the hypotenuse $c$.',
              'Sisi siku-siku suatu segitiga siku-siku adalah 15 cm dan 20 cm. Cari sisi miring $c$.',
            ),
            figure: {
              ...rightTri(20, 15, ['20', 'c', '15']),
              caption: L('A right triangle with legs 15 and 20.', 'Segitiga siku-siku dengan sisi siku-siku 15 dan 20.'),
            },
            blanks: [{ label: 'c =', answer: 25, after: '\\text{ cm}' }],
            solution: ['c^2=15^2+20^2=225+400=625', 'c=\\sqrt{625}=25'],
          },
          {
            prompt: L(
              'Find the distance between the points $A(-4,-2)$ and $B(8,3)$.',
              'Cari jarak antara titik $A(-4,-2)$ dan $B(8,3)$.',
            ),
            figure: {
              ...plane([-6, 10], [-4, 6], [
                line([-4, -2], [8, 3], 'a', { width: 3 }),
                line([-4, -2], [8, -2], 'b', { dashed: true }),
                line([8, -2], [8, 3], 'b', { dashed: true }),
                { t: 'dot', x: -4, y: -2, label: 'A', color: 'a' },
                { t: 'dot', x: 8, y: 3, label: 'B', color: 'a' },
              ]),
              caption: L('The points A and B on a grid.', 'Titik A dan B pada kisi.'),
            },
            blanks: [{ label: 'AB =', answer: 13, after: { en: '\\text{ units}', id: '\\text{ satuan}' } }],
            solution: ['AC=8-(-4)=12', 'BC=3-(-2)=5', 'AB^2=12^2+5^2=144+25=169', 'AB=13'],
          },
          {
            prompt: L(
              'A rectangular field is 40 m long and 30 m wide. Mr. Eko lays a path along its diagonal, and the path costs Rp20,000 per meter. Find the length of the path and the total cost in thousand rupiah.',
              'Sebuah lapangan persegi panjang panjangnya 40 m dan lebarnya 30 m. Pak Eko membuat jalur di sepanjang diagonalnya, dan biaya jalur Rp20.000 per meter. Cari panjang jalur dan total biayanya dalam ribu rupiah.',
            ),
            blanks: [
              { label: { en: '\\text{path} =', id: '\\text{jalur} =' }, answer: 50, after: '\\text{ m}' },
              { label: { en: '\\text{cost} =', id: '\\text{biaya} =' }, answer: 1000, after: { en: '\\text{ thousand rupiah}', id: '\\text{ ribu rupiah}' } },
            ],
            solution: ['d=\\sqrt{40^2+30^2}=\\sqrt{2\\,500}=50', '50\\times20=1\\,000'],
          },
          {
            prompt: L(
              'A 25 m fire-engine ladder leans against a wall with its foot 7 m from the wall. Then the top slides 4 m down the wall. How high up the wall was the top at first, and how far does the foot slide out?',
              'Sebuah tangga mobil pemadam 25 m bersandar pada dinding dengan kaki tangga 7 m dari dinding. Kemudian ujung atas tangga merosot 4 m ke bawah. Berapa tinggi ujung atas pada awalnya, dan berapa jauh kaki tangga bergeser ke luar?',
            ),
            figure: {
              dim: 2,
              axes: false,
              ...fit([[-2, -2], [17, 26]], 0.5),
              items: [
                line([0, 0], [0, 25], 'muted', { width: 3 }),
                line([0, 0], [16, 0], 'muted', { width: 3 }),
                line([7, 0], [0, 24], 'a', { width: 3 }),
                line([15, 0], [0, 20], 'b', { dashed: true, width: 3 }),
                txt(3.9, 13, '25', 'md', 'a', 'start'),
                txt(3.5, -1.2, '7', 'md', 'a'),
                txt(-0.6, 22, '4', 'md', 'b', 'end'),
                txt(11, -1.2, 'x', 'md', 'b'),
              ],
              caption: L(
                'The ladder before (solid) and after (dashed) it slides. The ladder is 25 m both times.',
                'Tangga sebelum (garis penuh) dan sesudah (garis putus-putus) merosot. Panjang tangga 25 m pada kedua keadaan.',
              ),
            },
            inline: true,
            blanks: [
              { label: { en: '\\text{height at first} =', id: '\\text{tinggi awal} =' }, answer: 24, after: '\\text{ m}' },
              { label: { en: '\\text{foot slides out} =', id: '\\text{kaki bergeser} =' }, answer: 8, after: '\\text{ m}' },
            ],
            solution: ['h_1=\\sqrt{25^2-7^2}=\\sqrt{576}=24', 'h_2=24-4=20', 'd_2=\\sqrt{25^2-20^2}=\\sqrt{225}=15', '15-7=8'],
          },
        ],
      },
    },
    /* ======================================================= S3: congruence and similarity */
    {
      id: 'tka-smp-m5-s3',
      title: L('Congruence and Similarity', 'Kekongruenan dan Kesebangunan'),
      summary: L(
        'Figures with the same shape and size (congruent) and figures with the same shape but a different size (similar): corresponding parts, the conditions for triangles, scale factors, shadows and heights.',
        'Bangun dengan bentuk dan ukuran sama (kongruen) dan bangun dengan bentuk sama tetapi ukuran berbeda (sebangun): bagian yang bersesuaian, syarat pada segitiga, faktor skala, bayangan, dan tinggi.',
      ),
      lessons: [
        /* ------------------------------------------------ S3 L1 congruent figures */
        {
          id: 'tka-smp-m5-s3-l1',
          title: L('Congruent Figures', 'Bangun Kongruen'),
          goal: L(
            'You can tell when two figures are congruent, match their corresponding parts, use the SSS, SAS and ASA conditions, and find an unknown side or angle from a congruent partner.',
            'Kamu bisa menentukan kapan dua bangun kongruen, memasangkan bagian yang bersesuaian, memakai syarat s.s.s, s.sd.s, dan sd.s.sd, serta mencari sisi atau sudut yang belum diketahui dari pasangan yang kongruen.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Same Shape, Same Size', 'Ayo Amati: Bentuk Sama, Ukuran Sama'),
              body: L(
                'Two stamps printed from the same plate are exactly alike. You can slide, flip or turn one so that it fits exactly on top of the other. Figures like this are **congruent**: the same shape AND the same size.\n\nThe parts that land on each other are **corresponding** parts. In congruent figures:\n\n- corresponding sides are equal, and\n- corresponding angles are equal.\n\nIn the picture, △ABC ≅ △PQR; the sign ≅ means "is congruent to". The letters are in matching order: A matches P, B matches Q and C matches R. So $AB=PQ$, $BC=QR$ and $CA=RP$.',
                'Dua prangko yang dicetak dari cetakan yang sama persis serupa. Kamu bisa menggeser, membalik, atau memutar salah satunya sehingga tepat menutupi yang lain. Bangun seperti ini **kongruen**: bentuknya sama DAN ukurannya sama.\n\nBagian-bagian yang saling menutupi disebut bagian yang **bersesuaian**. Pada bangun yang kongruen:\n\n- sisi-sisi yang bersesuaian sama panjang, dan\n- sudut-sudut yang bersesuaian sama besar.\n\nPada gambar, △ABC ≅ △PQR; tanda ≅ berarti "kongruen dengan". Huruf-hurufnya sesuai urutan: A bersesuaian dengan P, B dengan Q, dan C dengan R. Jadi $AB=PQ$, $BC=QR$, dan $CA=RP$.',
              ),
              figure: (() => {
                const T1: Pt[] = [[0, 0], [4, 0], [0, 3]]
                const T2 = place(T1, { flip: true, rot: 20, dx: 11, dy: 1 })
                return {
                  ...both(
                    { pts: T1, names: 'ABC', sides: ['4', '5', '3'], rights: [0] },
                    { pts: T2, names: 'PQR', sides: ['4', '5', '3'], rights: [0], color: 'b' },
                  ),
                  caption: L(
                    'Two congruent triangles. The second one is flipped and turned.',
                    'Dua segitiga kongruen. Segitiga kedua dibalik dan diputar.',
                  ),
                }
              })(),
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Using a Congruent Partner', 'Contoh Bertahap: Memakai Pasangan yang Kongruen'),
              body: L(
                'Triangle $ABC$ is congruent to triangle $PQR$, with $A$ matching $P$, $B$ matching $Q$ and $C$ matching $R$. In triangle $ABC$ the angle at $B$ is a right angle, the angle at $A$ is $30^\\circ$, $AC=8$ cm and $BC=4$ cm. Find $x=QR$, $y=PR$ and the angle $z$ at $R$.\n\n1. Step 1: Write the matching pairs from the order of the letters: $AB\\leftrightarrow PQ$, $BC\\leftrightarrow QR$, $AC\\leftrightarrow PR$.\n2. Step 2: $QR$ matches $BC$, so $x=4$ cm.\n3. Step 3: $PR$ matches $AC$, so $y=8$ cm.\n4. Step 4: The angle at $R$ matches the angle at $C$. In triangle $ABC$, $\\angle C=180^\\circ-90^\\circ-30^\\circ=60^\\circ$, so $z=60^\\circ$.\n\n**Remember:**\n\n- Read the matching from the ORDER of the letters.\n- Matching sides are equal and matching angles are equal.',
                'Segitiga $ABC$ kongruen dengan segitiga $PQR$, dengan $A$ bersesuaian dengan $P$, $B$ dengan $Q$, dan $C$ dengan $R$. Pada segitiga $ABC$ sudut di $B$ siku-siku, sudut di $A$ adalah $30^\\circ$, $AC=8$ cm, dan $BC=4$ cm. Cari $x=QR$, $y=PR$, dan sudut $z$ di $R$.\n\n1. Langkah 1: Tulis pasangan yang bersesuaian dari urutan hurufnya: $AB\\leftrightarrow PQ$, $BC\\leftrightarrow QR$, $AC\\leftrightarrow PR$.\n2. Langkah 2: $QR$ bersesuaian dengan $BC$, jadi $x=4$ cm.\n3. Langkah 3: $PR$ bersesuaian dengan $AC$, jadi $y=8$ cm.\n4. Langkah 4: Sudut di $R$ bersesuaian dengan sudut di $C$. Pada segitiga $ABC$, $\\angle C=180^\\circ-90^\\circ-30^\\circ=60^\\circ$, jadi $z=60^\\circ$.\n\n**Ingat:**\n\n- Baca pasangan yang bersesuaian dari URUTAN hurufnya.\n- Sisi yang bersesuaian sama panjang dan sudut yang bersesuaian sama besar.',
              ),
              figure: (() => {
                const s3 = 4 * Math.sqrt(3)
                const T1: Pt[] = [[0, 0], [tidy(s3), 0], [0, 4]] // B, A, C
                const T2 = place(T1, { rot: 90, dx: 12 }) // Q, P, R
                return {
                  ...both(
                    { pts: T1, names: 'BAC', sides: [undefined, '8', '4'], rights: [0], extra: [arcAt(T1[1], T1[0], T1[2], '30°')] },
                    { pts: T2, names: 'QPR', sides: [undefined, 'y', 'x'], rights: [0], color: 'b', extra: [arcAt(T2[2], T2[0], T2[1], 'z')] },
                  ),
                  caption: L(
                    'Triangle ABC on the left and its congruent partner PQR on the right, turned a quarter turn.',
                    'Segitiga ABC di kiri dan pasangannya yang kongruen, PQR, di kanan, diputar seperempat putaran.',
                  ),
                }
              })(),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Look Closely: Three Ways to Show Congruence', 'Ayo Amati: Tiga Syarat Kongruen'),
              body: L(
                'You do not have to check all six parts. For triangles, three matching facts are enough, if they are the right three:\n\n| Condition | What must match |\n|---|---|\n| SSS (side, side, side) | all three pairs of sides are equal |\n| SAS (side, angle, side) | two pairs of sides are equal and the angle BETWEEN them is equal |\n| ASA (angle, side, angle) | two pairs of angles are equal and the side BETWEEN them is equal |\n\nThe picture shows SAS: two sides of 6 and 5 with the angle of $50^\\circ$ between them fix the whole triangle.',
                'Kamu tidak perlu memeriksa keenam bagiannya. Pada segitiga, tiga kesamaan sudah cukup, asalkan ketiganya tepat:\n\n| Syarat | Yang harus sama |\n|---|---|\n| sisi-sisi-sisi (s.s.s) | ketiga pasang sisi sama panjang |\n| sisi-sudut-sisi (s.sd.s) | dua pasang sisi sama panjang dan sudut DI ANTARA keduanya sama besar |\n| sudut-sisi-sudut (sd.s.sd) | dua pasang sudut sama besar dan sisi DI ANTARA keduanya sama panjang |\n\nGambar menunjukkan s.sd.s: dua sisi 6 dan 5 dengan sudut $50^\\circ$ di antara keduanya menentukan seluruh segitiga.',
              ),
              figure: (() => {
                const T1: Pt[] = [[0, 0], [6, 0], pol(50, 5)]
                const T2 = place(T1, { flip: true, dx: 13 })
                return {
                  ...both(
                    { pts: T1, names: 'ABC', sides: ['6', undefined, '5'], extra: [arcAt(T1[0], T1[1], T1[2], '50°')] },
                    { pts: T2, names: 'PQR', sides: ['6', undefined, '5'], color: 'b', extra: [arcAt(T2[0], T2[1], T2[2], '50°')] },
                  ),
                  caption: L(
                    'SAS: two sides and the angle between them are equal in both triangles.',
                    'S.sd.s: dua sisi dan sudut di antara keduanya sama pada kedua segitiga.',
                  ),
                }
              })(),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Wrong Matches', 'Awas, Jebakan!: Pasangan yang Salah'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| △ABC ≅ △PQR, so $BC=PQ$. | Match by the order of the letters: $BC=QR$ and $AB=PQ$. Always write congruent triangles with the letters in matching order. |\n| Two triangles with angles $60^\\circ$, $60^\\circ$, $60^\\circ$ are congruent. | Equal angles alone are not enough. An equilateral triangle with side 3 and one with side 5 have the same angles but different sizes. |\n| Two sides and an angle that is NOT between them are enough (SSA). | The angle must lie BETWEEN the two sides (SAS). Otherwise two different triangles can be drawn. |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| △ABC ≅ △PQR, jadi $BC=PQ$. | Pasangkan menurut urutan huruf: $BC=QR$ dan $AB=PQ$. Selalu tulis segitiga yang kongruen dengan huruf yang berurutan sesuai. |\n| Dua segitiga dengan sudut $60^\\circ$, $60^\\circ$, $60^\\circ$ pasti kongruen. | Sudut yang sama saja tidak cukup. Segitiga sama sisi dengan sisi 3 dan yang bersisi 5 punya sudut yang sama tetapi ukurannya berbeda. |\n| Dua sisi dan sebuah sudut yang TIDAK di antara keduanya sudah cukup (s.s.sd). | Sudutnya harus berada DI ANTARA kedua sisi (s.sd.s). Jika tidak, dua segitiga yang berbeda bisa digambar. |',
              ),
              figure: {
                ...both(
                  { pts: [[0, 0], [3, 0], [1.5, tidy(1.5 * Math.sqrt(3))]], sides: ['3', '3', '3'] },
                  { pts: [[5, 0], [10, 0], [7.5, tidy(2.5 * Math.sqrt(3))]], sides: ['5', '5', '5'], color: 'b' },
                ),
                caption: L(
                  'Both triangles have three angles of 60°, but they are not the same size.',
                  'Kedua segitiga punya tiga sudut 60°, tetapi ukurannya tidak sama.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Triangle $DEF$ is congruent to triangle $KLM$, with $D$ matching $K$, $E$ matching $L$ and $F$ matching $M$. $DE=7$ cm, $EF=9$ cm and $DF=11$ cm. How long is $LM$?',
                'Segitiga $DEF$ kongruen dengan segitiga $KLM$, dengan $D$ bersesuaian dengan $K$, $E$ dengan $L$, dan $F$ dengan $M$. $DE=7$ cm, $EF=9$ cm, dan $DF=11$ cm. Berapa panjang $LM$?',
              ),
              options: [
                L('$9$ cm', '$9$ cm'),
                L('$7$ cm', '$7$ cm'),
                L('$11$ cm', '$11$ cm'),
                L('$27$ cm', '$27$ cm'),
              ],
              answer: 0,
              explain: L(
                '$LM$ is made of the letters that match $E$ and $F$, so $LM=EF=9$ cm. The answers 7 and 11 are the other two sides ($KL$ and $KM$), and 27 is the perimeter.',
                '$LM$ terdiri dari huruf-huruf yang bersesuaian dengan $E$ dan $F$, jadi $LM=EF=9$ cm. Jawaban 7 dan 11 adalah dua sisi lainnya ($KL$ dan $KM$), dan 27 adalah kelilingnya.',
              ),
              hint: L(
                'Write the matching pairs of letters first. Which two letters of $DEF$ match $L$ and $M$?',
                'Tulis dulu pasangan huruf yang bersesuaian. Dua huruf mana pada $DEF$ yang bersesuaian dengan $L$ dan $M$?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: triangle $ABC$ is congruent to triangle $PQR$, with $A$ matching $P$, $B$ matching $Q$ and $C$ matching $R$. In triangle $ABC$, $\\angle A=35^\\circ$ and $\\angle B=85^\\circ$. Find $\\angle C$ and $\\angle R$.',
                'Coba bersama: segitiga $ABC$ kongruen dengan segitiga $PQR$, dengan $A$ bersesuaian dengan $P$, $B$ dengan $Q$, dan $C$ dengan $R$. Pada segitiga $ABC$, $\\angle A=35^\\circ$ dan $\\angle B=85^\\circ$. Cari $\\angle C$ dan $\\angle R$.',
              ),
              template: '\\angle C=180-35-85=___ \\quad \\angle R=\\angle C=___',
              blanks: ['60', '60'],
              explain: L(
                'The angles of triangle $ABC$ add up to $180^\\circ$, so $\\angle C=180-35-85=60$. The angle at $R$ matches the angle at $C$, so $\\angle R=60^\\circ$.',
                'Jumlah sudut segitiga $ABC$ adalah $180^\\circ$, jadi $\\angle C=180-35-85=60$. Sudut di $R$ bersesuaian dengan sudut di $C$, jadi $\\angle R=60^\\circ$.',
              ),
              hint: L(
                'First find the third angle of triangle $ABC$ from the angle sum. Then $R$ is the partner of $C$.',
                'Cari dulu sudut ketiga segitiga $ABC$ dari jumlah sudut. Lalu $R$ adalah pasangan dari $C$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Look at the two triangles. Which statement is correct?',
                'Perhatikan kedua segitiga. Pernyataan mana yang benar?',
              ),
              figure: (() => {
                const T1: Pt[] = [[0, 0], [5, 0], pol(40, 4)]
                const T2 = place(T1, { rot: 180, dx: 14, dy: 4 })
                return {
                  ...both(
                    { pts: T1, names: 'ABC', sides: ['5', undefined, '4'], extra: [arcAt(T1[0], T1[1], T1[2], '40°')] },
                    { pts: T2, names: 'PQR', sides: ['5', undefined, '4'], color: 'b', extra: [arcAt(T2[0], T2[1], T2[2], '40°')] },
                  ),
                  caption: L('Both triangles have sides 5 and 4 with a 40° angle between them.', 'Kedua segitiga punya sisi 5 dan 4 dengan sudut 40° di antaranya.'),
                }
              })(),
              options: [
                L('They are congruent by SAS: two pairs of sides and the angle between them are equal', 'Keduanya kongruen menurut s.sd.s: dua pasang sisi dan sudut di antaranya sama'),
                L('They are congruent by SSS: all three pairs of sides are equal', 'Keduanya kongruen menurut s.s.s: ketiga pasang sisi sama'),
                L('They are not congruent, because the third sides are not given', 'Keduanya tidak kongruen, karena sisi ketiganya tidak diberikan'),
                L('They are congruent by ASA: two angles and a side are equal', 'Keduanya kongruen menurut sd.s.sd: dua sudut dan satu sisi sama'),
              ],
              answer: 0,
              explain: L(
                'Two pairs of equal sides (5 and 4) with the equal $40^\\circ$ angle between them is the SAS condition. SSS would need the third sides, and ASA would need two angles. The third sides need not be given: SAS already fixes them.',
                'Dua pasang sisi yang sama (5 dan 4) dengan sudut $40^\\circ$ yang sama di antaranya adalah syarat s.sd.s. S.s.s memerlukan sisi ketiga, dan sd.s.sd memerlukan dua sudut. Sisi ketiga tidak perlu diberikan: s.sd.s sudah menentukannya.',
              ),
              hint: L(
                'List what is equal in both triangles: sides, angles, and where the angle sits. Which condition has exactly those parts?',
                'Daftar yang sama pada kedua segitiga: sisi, sudut, dan letak sudutnya. Syarat mana yang memuat tepat bagian-bagian itu?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('Two triangles with the same three angles are always congruent.', 'Dua segitiga dengan tiga sudut yang sama pasti kongruen.'),
                L('Congruent figures have the same shape and the same size.', 'Bangun yang kongruen mempunyai bentuk yang sama dan ukuran yang sama.'),
                L('Two triangles are congruent if two pairs of sides and a pair of angles that is NOT between them are equal.', 'Dua segitiga kongruen jika dua pasang sisi dan sepasang sudut yang TIDAK di antara keduanya sama.'),
                L('Two triangles with three pairs of equal sides are congruent.', 'Dua segitiga dengan tiga pasang sisi yang sama kongruen.'),
              ],
              answer: [false, true, false, true],
              explain: L(
                'Equal angles only give the same shape: a small and a big equilateral triangle have the same angles. Congruent means same shape AND size. An angle that is not between the two sides does not fix the triangle. Three pairs of equal sides (SSS) do.',
                'Sudut yang sama hanya memberi bentuk yang sama: segitiga sama sisi kecil dan besar punya sudut yang sama. Kongruen berarti bentuk DAN ukuran sama. Sudut yang tidak berada di antara kedua sisi tidak menentukan segitiganya. Tiga pasang sisi yang sama (s.s.s) menentukannya.',
              ),
              hint: L(
                'Think of a counter-example: can you draw two different triangles that fit the statement?',
                'Pikirkan contoh penyangkal: dapatkah kamu menggambar dua segitiga berbeda yang memenuhi pernyataan itu?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Triangle $ABC$ is congruent to triangle $PQR$, with $A$ matching $P$, $B$ matching $Q$ and $C$ matching $R$. $AB=(3x+2)$ cm and $PQ=(5x-12)$ cm. $\\angle C=(4y-10)^\\circ$ and $\\angle R=70^\\circ$. Find $x$ and $y$.',
                'Segitiga $ABC$ kongruen dengan segitiga $PQR$, dengan $A$ bersesuaian dengan $P$, $B$ dengan $Q$, dan $C$ dengan $R$. $AB=(3x+2)$ cm dan $PQ=(5x-12)$ cm. $\\angle C=(4y-10)^\\circ$ dan $\\angle R=70^\\circ$. Cari $x$ dan $y$.',
              ),
              blanks: [
                { label: 'x =', answer: 7 },
                { label: 'y =', answer: 20 },
              ],
              hints: [
                L(
                  '$AB$ and $PQ$ are matching sides, and $\\angle C$ and $\\angle R$ are matching angles. What do you know about matching parts?',
                  '$AB$ dan $PQ$ adalah sisi yang bersesuaian, dan $\\angle C$ serta $\\angle R$ adalah sudut yang bersesuaian. Apa yang kamu tahu tentang bagian yang bersesuaian?',
                ),
                L(
                  'They are equal. Write $3x+2=5x-12$ and, separately, $4y-10=70$.',
                  'Keduanya sama. Tulis $3x+2=5x-12$ dan, terpisah, $4y-10=70$.',
                ),
                L(
                  'For $x$: subtract $3x$ and add $12$ on both sides to get $14=2x$. For $y$: add $10$ to both sides, then divide by $4$.',
                  'Untuk $x$: kurangi $3x$ dan tambahkan $12$ pada kedua ruas sehingga $14=2x$. Untuk $y$: tambahkan $10$ pada kedua ruas, lalu bagi $4$.',
                ),
              ],
              explain: L(
                'Matching sides are equal: $3x+2=5x-12$ gives $x=7$ (both sides are 23 cm). Matching angles are equal: $4y-10=70$ gives $y=20$.',
                'Sisi yang bersesuaian sama panjang: $3x+2=5x-12$ memberi $x=7$ (kedua sisi 23 cm). Sudut yang bersesuaian sama besar: $4y-10=70$ memberi $y=20$.',
              ),
              solution: ['3x+2=5x-12', '14=2x', 'x=7', '4y-10=70', '4y=80', 'y=20'],
            },
          ],
        },
        /* ------------------------------------------------ S3 L2 similar figures */
        {
          id: 'tka-smp-m5-s3-l2',
          title: L('Similar Figures', 'Bangun Sebangun'),
          goal: L(
            'You can tell when figures are similar, use the scale factor and a proportion to find an unknown side, solve shadow and height problems, and tell similar from congruent.',
            'Kamu bisa menentukan kapan bangun sebangun, memakai faktor skala dan perbandingan untuk mencari sisi yang belum diketahui, menyelesaikan soal bayangan dan tinggi, serta membedakan sebangun dari kongruen.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Same Shape, Different Size', 'Ayo Amati: Bentuk Sama, Ukuran Berbeda'),
              body: L(
                'A photo and its enlargement have the same shape but not the same size. Figures like this are **similar**.\n\nIn similar figures:\n\n- corresponding angles are equal, and\n- corresponding sides are in the **same ratio**, called the **scale factor** $k$.\n\nThe small triangle has sides 3, 4 and 5 and the big one has sides 6, 8 and 10. Each side is doubled: $\\frac{6}{3}=\\frac{8}{4}=\\frac{10}{5}=2$, so $k=2$. With $k>1$ the figure is enlarged, with $k<1$ it shrinks, and with $k=1$ it is congruent.',
                'Sebuah foto dan hasil pembesarannya punya bentuk yang sama tetapi ukuran yang tidak sama. Bangun seperti ini **sebangun**.\n\nPada bangun yang sebangun:\n\n- sudut-sudut yang bersesuaian sama besar, dan\n- sisi-sisi yang bersesuaian memiliki **perbandingan yang sama**, disebut **faktor skala** $k$.\n\nSegitiga kecil bersisi 3, 4, dan 5, sedangkan yang besar bersisi 6, 8, dan 10. Setiap sisi menjadi dua kali: $\\frac{6}{3}=\\frac{8}{4}=\\frac{10}{5}=2$, jadi $k=2$. Jika $k>1$ bangun diperbesar, jika $k<1$ diperkecil, dan jika $k=1$ bangunnya kongruen.',
              ),
              figure: {
                ...both(
                  { pts: [[0, 0], [4, 0], [0, 3]], names: 'ABC', sides: ['4', '5', '3'], rights: [0] },
                  { pts: [[7, 0], [15, 0], [7, 6]], names: 'PQR', sides: ['8', '10', '6'], rights: [0], color: 'b' },
                ),
                caption: L(
                  'Two similar triangles: every side of the big one is twice the matching side of the small one.',
                  'Dua segitiga sebangun: setiap sisi yang besar dua kali sisi yang bersesuaian pada yang kecil.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Shadows and Heights', 'Contoh Bertahap: Bayangan dan Tinggi'),
              body: L(
                'At the same time of day, a pole 2 m tall casts a shadow of 3 m. A tree casts a shadow of 12 m. How tall is the tree?\n\n1. Step 1: The rays of the sun are parallel and the pole and the tree both stand upright, so the two right triangles have equal angles. They are similar.\n2. Step 2: Match the parts: the pole matches the tree (heights), and the shadow of the pole matches the shadow of the tree.\n3. Step 3: Write a proportion with the same kind of length in the same position: $\\frac{h}{2}=\\frac{12}{3}$.\n4. Step 4: $h=2\\times12\\div3=8$ m.\n\n**Remember:**\n\n- Put matching parts in the same position in both ratios: height over height, shadow over shadow.\n- Or use the scale factor: $12\\div3=4$, so the tree is 4 times as tall as the pole.',
                'Pada waktu yang sama, sebuah tiang setinggi 2 m membentuk bayangan 3 m. Sebuah pohon membentuk bayangan 12 m. Berapa tinggi pohon itu?\n\n1. Langkah 1: Sinar matahari sejajar dan tiang serta pohon sama-sama berdiri tegak, sehingga kedua segitiga siku-siku punya sudut yang sama. Keduanya sebangun.\n2. Langkah 2: Pasangkan bagiannya: tiang dengan pohon (tinggi), dan bayangan tiang dengan bayangan pohon.\n3. Langkah 3: Tulis perbandingan dengan jenis panjang yang sama di posisi yang sama: $\\frac{h}{2}=\\frac{12}{3}$.\n4. Langkah 4: $h=2\\times12\\div3=8$ m.\n\n**Ingat:**\n\n- Letakkan bagian yang bersesuaian pada posisi yang sama di kedua perbandingan: tinggi per tinggi, bayangan per bayangan.\n- Atau pakai faktor skala: $12\\div3=4$, jadi pohon itu 4 kali setinggi tiang.',
              ),
              figure: {
                ...both(
                  { pts: [[0, 0], [3, 0], [0, 2]], sides: ['3', undefined, '2'], rights: [0] },
                  { pts: [[4.5, 0], [16.5, 0], [4.5, 8]], sides: ['12', undefined, 'h'], rights: [0], color: 'b' },
                ),
                caption: L(
                  'The pole (small triangle) and the tree (big triangle) with their shadows on the ground.',
                  'Tiang (segitiga kecil) dan pohon (segitiga besar) beserta bayangannya di tanah.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Look Closely: Congruent or Similar?', 'Ayo Amati: Kongruen atau Sebangun?'),
              body: L(
                'Congruent figures are a special case of similar figures.\n\n| Property | Congruent | Similar |\n|---|---|---|\n| Shape | the same | the same |\n| Size | the same | can differ |\n| Corresponding angles | equal | equal |\n| Corresponding sides | equal | in the same ratio $k$ |\n| Scale factor | $k=1$ | any $k>0$ |\n\nSo congruent figures are always similar, but similar figures are not always congruent. The picture shows two similar rectangles with $k=2$.',
                'Bangun yang kongruen adalah kasus khusus dari bangun yang sebangun.\n\n| Sifat | Kongruen | Sebangun |\n|---|---|---|\n| Bentuk | sama | sama |\n| Ukuran | sama | boleh berbeda |\n| Sudut yang bersesuaian | sama besar | sama besar |\n| Sisi yang bersesuaian | sama panjang | memiliki perbandingan yang sama $k$ |\n| Faktor skala | $k=1$ | sembarang $k>0$ |\n\nJadi bangun yang kongruen selalu sebangun, tetapi bangun yang sebangun belum tentu kongruen. Gambar menunjukkan dua persegi panjang yang sebangun dengan $k=2$.',
              ),
              figure: {
                ...both(
                  { pts: [[0, 0], [3, 0], [3, 2], [0, 2]], sides: ['3', '2'], rights: [0, 1, 2, 3] },
                  { pts: [[5, 0], [11, 0], [11, 4], [5, 4]], sides: ['6', '4'], rights: [0, 1, 2, 3], color: 'b' },
                ),
                caption: L('Rectangles 3 by 2 and 6 by 4: the same shape, scale factor 2.', 'Persegi panjang 3 kali 2 dan 6 kali 4: bentuk sama, faktor skala 2.'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Adding, Flipping and Matching', 'Awas, Jebakan!: Menambah, Membalik, dan Memasangkan'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| Triangle 3, 4, 5 and triangle 5, 6, 7 are similar, because each side grew by 2. | Similar needs the SAME MULTIPLIER: $\\frac{5}{3}$, $\\frac{6}{4}$ and $\\frac{7}{5}$ are not equal, so they are not similar. |\n| The tree is $h$ and the pole is 2, so $\\frac{h}{2}=\\frac{3}{12}$. | Keep the same order in both ratios: tree over pole equals tree shadow over pole shadow, $\\frac{h}{2}=\\frac{12}{3}$. |\n| Match the sides by where they are drawn on the page. | Corresponding sides are the ones opposite equal angles, however the triangle is turned. |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| Segitiga 3, 4, 5 dan segitiga 5, 6, 7 sebangun, karena setiap sisi bertambah 2. | Sebangun memerlukan PENGALI YANG SAMA: $\\frac{5}{3}$, $\\frac{6}{4}$, dan $\\frac{7}{5}$ tidak sama, jadi tidak sebangun. |\n| Pohon $h$ dan tiang 2, jadi $\\frac{h}{2}=\\frac{3}{12}$. | Jaga urutan yang sama pada kedua perbandingan: pohon per tiang sama dengan bayangan pohon per bayangan tiang, $\\frac{h}{2}=\\frac{12}{3}$. |\n| Pasangkan sisi menurut letaknya pada gambar. | Sisi yang bersesuaian adalah sisi yang berhadapan dengan sudut yang sama, bagaimanapun segitiga itu diputar. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Triangle $ABC$ is similar to triangle $PQR$, with $A$ matching $P$, $B$ matching $Q$ and $C$ matching $R$. $AB=6$ cm, $BC=8$ cm and $PQ=9$ cm. How long is $QR$?',
                'Segitiga $ABC$ sebangun dengan segitiga $PQR$, dengan $A$ bersesuaian dengan $P$, $B$ dengan $Q$, dan $C$ dengan $R$. $AB=6$ cm, $BC=8$ cm, dan $PQ=9$ cm. Berapa panjang $QR$?',
              ),
              figure: {
                ...both(
                  { pts: [[0, 0], [8, 0], [0, 6]], names: 'BCA', sides: ['8', undefined, '6'], rights: [0] },
                  { pts: [[11, 0], [23, 0], [11, 9]], names: 'QRP', sides: ['x', undefined, '9'], rights: [0], color: 'b' },
                ),
                caption: L('The small triangle ABC and the big triangle PQR.', 'Segitiga kecil ABC dan segitiga besar PQR.'),
              },
              options: [
                L('$12$ cm', '$12$ cm'),
                L('$11$ cm', '$11$ cm'),
                L('$\\frac{16}{3}$ cm', '$\\frac{16}{3}$ cm'),
                L('$17$ cm', '$17$ cm'),
              ],
              answer: 0,
              explain: L(
                '$AB$ matches $PQ$, so $k=\\frac{9}{6}=\\frac{3}{2}$. $QR$ matches $BC$: $QR=8\\times\\frac{3}{2}=12$ cm. The answer 11 adds the gap $9-6=3$ instead of multiplying, $\\frac{16}{3}$ uses the ratio upside down ($8\\times\\frac{6}{9}$), and 17 adds $8+9$.',
                '$AB$ bersesuaian dengan $PQ$, jadi $k=\\frac{9}{6}=\\frac{3}{2}$. $QR$ bersesuaian dengan $BC$: $QR=8\\times\\frac{3}{2}=12$ cm. Jawaban 11 menambahkan selisih $9-6=3$ alih-alih mengalikan, $\\frac{16}{3}$ memakai perbandingan terbalik ($8\\times\\frac{6}{9}$), dan 17 menjumlahkan $8+9$.',
              ),
              hint: L(
                'First find the scale factor from the pair of sides you know in both triangles. Then use it on $BC$.',
                'Cari dulu faktor skala dari pasangan sisi yang diketahui pada kedua segitiga. Lalu pakai pada $BC$.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a pole 3 m tall casts a shadow of 4 m. At the same time a building casts a shadow of 24 m. How tall is the building, $h$?',
                'Coba bersama: sebuah tiang setinggi 3 m membentuk bayangan 4 m. Pada waktu yang sama sebuah gedung membentuk bayangan 24 m. Berapa tinggi gedung itu, $h$?',
              ),
              template: '\\frac{h}{3}=\\frac{24}{___} \\quad h=\\frac{3\\times24}{___}=___',
              blanks: ['4', '4', '18'],
              explain: L(
                'Building over pole equals building shadow over pole shadow: $\\frac{h}{3}=\\frac{24}{4}=6$, so $h=3\\times6=18$ m.',
                'Gedung per tiang sama dengan bayangan gedung per bayangan tiang: $\\frac{h}{3}=\\frac{24}{4}=6$, jadi $h=3\\times6=18$ m.',
              ),
              hint: L(
                'The pole has height 3, and the shadow that goes with the pole is the one that goes under the 24.',
                'Tiang punya tinggi 3, dan bayangan yang berpasangan dengan tiang adalah yang berada di bawah angka 24.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The two triangles are similar. How long is the side $x$ of the big triangle?',
                'Kedua segitiga sebangun. Berapa panjang sisi $x$ pada segitiga yang besar?',
              ),
              figure: (() => {
                const small = triBySides(4, 6, 8)
                const big = place(triBySides(10, 15, 20), { dx: 11 })
                return {
                  ...both(
                    { pts: small, sides: ['8', '4', '6'] },
                    { pts: big, sides: ['20', '10', 'x'], color: 'b' },
                    1.5,
                  ),
                  caption: L('Matching sides sit in the same place in both triangles.', 'Sisi yang bersesuaian berada di tempat yang sama pada kedua segitiga.'),
                }
              })(),
              options: [
                L('$15$', '$15$'),
                L('$12$', '$12$'),
                L('$\\frac{12}{5}$', '$\\frac{12}{5}$'),
                L('$20$', '$20$'),
              ],
              answer: 0,
              explain: L(
                'The side 4 matches 10, so $k=\\frac{10}{4}=\\frac{5}{2}$. The side $x$ matches 6: $x=6\\times\\frac{5}{2}=15$. The answer 12 adds the gap $10-4=6$ to 6, $\\frac{12}{5}$ uses the ratio upside down, and 20 is the base of the big triangle.',
                'Sisi 4 bersesuaian dengan 10, jadi $k=\\frac{10}{4}=\\frac{5}{2}$. Sisi $x$ bersesuaian dengan 6: $x=6\\times\\frac{5}{2}=15$. Jawaban 12 menambahkan selisih $10-4=6$ pada 6, $\\frac{12}{5}$ memakai perbandingan terbalik, dan 20 adalah alas segitiga yang besar.',
              ),
              hint: L(
                'Find the scale factor from a pair of matching sides that are both given. Then multiply the small side that matches $x$.',
                'Cari faktor skala dari sepasang sisi yang bersesuaian dan keduanya diketahui. Lalu kalikan sisi kecil yang bersesuaian dengan $x$.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('Any two rectangles are similar.', 'Dua persegi panjang sembarang selalu sebangun.'),
                L('If every side of a triangle is made 3 cm longer, the new triangle is always similar to the old one.', 'Jika setiap sisi sebuah segitiga diperpanjang 3 cm, segitiga baru selalu sebangun dengan yang lama.'),
                L('Any two squares are similar.', 'Dua persegi sembarang selalu sebangun.'),
                L('Congruent figures are always similar.', 'Bangun yang kongruen selalu sebangun.'),
              ],
              answer: [false, false, true, true],
              explain: L(
                'Rectangles can have different side ratios (2 by 3 and 2 by 5). Adding the same length to every side does not always keep the ratios: 3, 4, 5 becomes 6, 7, 8 and $\\frac{6}{3}\\neq\\frac{7}{4}$. All squares have four right angles and sides in the ratio 1 to 1. Congruent figures are similar with scale factor 1.',
                'Persegi panjang bisa punya perbandingan sisi yang berbeda (2 kali 3 dan 2 kali 5). Menambah panjang yang sama pada setiap sisi tidak selalu menjaga perbandingannya: 3, 4, 5 menjadi 6, 7, 8 dan $\\frac{6}{3}\\neq\\frac{7}{4}$. Semua persegi punya empat sudut siku-siku dan sisi dengan perbandingan 1 banding 1. Bangun yang kongruen sebangun dengan faktor skala 1.',
              ),
              hint: L(
                'Try a small example for each statement and check whether all the side ratios are equal.',
                'Coba contoh kecil untuk setiap pernyataan dan periksa apakah semua perbandingan sisinya sama.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Indah prints a photo of 12 cm by 18 cm. She enlarges it, keeping the same shape, so that the longer side becomes 45 cm. Find the shorter side and the area of the enlarged photo.',
                'Indah mencetak foto berukuran 12 cm kali 18 cm. Ia memperbesarnya dengan bentuk yang tetap sama, sehingga sisi yang lebih panjang menjadi 45 cm. Cari sisi yang lebih pendek dan luas foto yang diperbesar.',
              ),
              blanks: [
                { label: { en: '\\text{shorter side} =', id: '\\text{sisi pendek} =' }, answer: 30, after: '\\text{ cm}' },
                { label: { en: '\\text{area} =', id: '\\text{luas} =' }, answer: 1350, after: '\\text{ cm}^2' },
              ],
              hints: [
                L(
                  'The enlarged photo is similar to the old one, so every side is multiplied by the same scale factor. Which two sides give you that factor?',
                  'Foto yang diperbesar sebangun dengan yang lama, jadi setiap sisi dikali faktor skala yang sama. Dua sisi mana yang memberi faktor itu?',
                ),
                L(
                  'The longer sides give $k=\\frac{45}{18}$. Simplify it, then multiply the shorter side 12 by $k$.',
                  'Sisi yang lebih panjang memberi $k=\\frac{45}{18}$. Sederhanakan, lalu kalikan sisi pendek 12 dengan $k$.',
                ),
                L(
                  'You get $k=\\frac{5}{2}$. Multiply 12 by it for the shorter side. The area of a rectangle is length times width.',
                  'Diperoleh $k=\\frac{5}{2}$. Kalikan 12 dengannya untuk sisi pendek. Luas persegi panjang adalah panjang kali lebar.',
                ),
              ],
              explain: L(
                'The scale factor is $k=\\frac{45}{18}=\\frac{5}{2}$, so the shorter side is $12\\times\\frac{5}{2}=30$ cm. The area is $30\\times45=1\\,350$ cm$^2$.',
                'Faktor skalanya $k=\\frac{45}{18}=\\frac{5}{2}$, jadi sisi pendek $12\\times\\frac{5}{2}=30$ cm. Luasnya $30\\times45=1\\,350$ cm$^2$.',
              ),
              solution: ['k=\\frac{45}{18}=\\frac{5}{2}', '12\\times\\frac{5}{2}=30', 'A=30\\times45=1\\,350'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m5-s3-p',
        runtime: 'math',
        title: L('Congruent and Similar in Action', 'Kongruen dan Sebangun dalam Aksi'),
        brief: L(
          'Use matching parts and scale factors: a congruent partner, a shadow, a line parallel to a side and a lamp post.',
          'Memakai bagian yang bersesuaian dan faktor skala: pasangan yang kongruen, bayangan, garis yang sejajar dengan satu sisi, dan tiang lampu.',
        ),
        requirements: [
          L('Match corresponding parts of congruent and similar figures and use the scale factor.', 'Memasangkan bagian yang bersesuaian pada bangun kongruen dan sebangun serta memakai faktor skala.'),
          L('Find the similar triangles hidden in shadows, in a triangle cut by a parallel line and behind a lamp post.', 'Menemukan segitiga sebangun yang tersembunyi pada bayangan, pada segitiga yang dipotong garis sejajar, dan di balik tiang lampu.'),
        ],
        hints: [
          L('Write which corner matches which, then which side matches which.', 'Tulis sudut mana yang bersesuaian dengan sudut mana, lalu sisi mana dengan sisi mana.'),
          L('Find the scale factor from a pair of matching sides that you know in both figures.', 'Cari faktor skala dari sepasang sisi yang bersesuaian dan diketahui pada kedua bangun.'),
          L('Keep the same order in both ratios (small over big on both sides, or big over small on both sides).', 'Jaga urutan yang sama pada kedua perbandingan (kecil per besar di kedua ruas, atau besar per kecil di kedua ruas).'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Triangle $ABC$ is congruent to triangle $DEF$, with $A$ matching $D$, $B$ matching $E$ and $C$ matching $F$. In triangle $ABC$, $AB=6$ cm, $BC=9$ cm, $\\angle A=40^\\circ$ and $\\angle B=75^\\circ$. Find $DE$, $EF$ and $\\angle F$.',
              'Segitiga $ABC$ kongruen dengan segitiga $DEF$, dengan $A$ bersesuaian dengan $D$, $B$ dengan $E$, dan $C$ dengan $F$. Pada segitiga $ABC$, $AB=6$ cm, $BC=9$ cm, $\\angle A=40^\\circ$, dan $\\angle B=75^\\circ$. Cari $DE$, $EF$, dan $\\angle F$.',
            ),
            inline: true,
            blanks: [
              { label: 'DE =', answer: 6, after: '\\text{ cm}' },
              { label: 'EF =', answer: 9, after: '\\text{ cm}' },
              { label: '\\angle F =', answer: 65, after: '^\\circ' },
            ],
            solution: ['DE=AB=6', 'EF=BC=9', '\\angle C=180-40-75=65', '\\angle F=\\angle C=65'],
          },
          {
            prompt: L(
              'Dewi is 150 cm tall and her shadow is 90 cm long. At the same time a lamp post casts a shadow of 6 m. How tall is the lamp post, in meters?',
              'Dewi tingginya 150 cm dan bayangannya 90 cm. Pada waktu yang sama sebuah tiang lampu membentuk bayangan 6 m. Berapa tinggi tiang lampu itu, dalam meter?',
            ),
            blanks: [{ label: { en: '\\text{height} =', id: '\\text{tinggi} =' }, answer: 10, after: '\\text{ m}' }],
            solution: ['6\\text{ m}=600\\text{ cm}', '\\frac{h}{150}=\\frac{600}{90}', 'h=\\frac{150\\times600}{90}=1\\,000\\text{ cm}', 'h=10\\text{ m}'],
          },
          {
            prompt: L(
              'In triangle $ABC$ the line $DE$ is parallel to $BC$, with $D$ on $AB$ and $E$ on $AC$. Because of this, triangle $ADE$ is similar to triangle $ABC$. $AD=6$ cm, $DB=3$ cm and $DE=8$ cm. Find $BC$.',
              'Pada segitiga $ABC$ garis $DE$ sejajar dengan $BC$, dengan $D$ pada $AB$ dan $E$ pada $AC$. Karena itu, segitiga $ADE$ sebangun dengan segitiga $ABC$. $AD=6$ cm, $DB=3$ cm, dan $DE=8$ cm. Cari $BC$.',
            ),
            figure: (() => {
              const A: Pt = [3, 8]
              const B: Pt = [0, 0]
              const C: Pt = [12, 0]
              const D: Pt = [tidy(A[0] + (2 / 3) * (B[0] - A[0])), tidy(A[1] + (2 / 3) * (B[1] - A[1]))]
              const E: Pt = [tidy(A[0] + (2 / 3) * (C[0] - A[0])), tidy(A[1] + (2 / 3) * (C[1] - A[1]))]
              return {
                ...shape({
                  pts: [A, B, C],
                  names: 'ABC',
                  extra: [
                    line(D, E, 'b', { width: 2.6 }),
                    txt(D[0] - 0.7, D[1] + 0.5, 'D', 'lg', 'result'),
                    txt(E[0] + 0.7, E[1] + 0.5, 'E', 'lg', 'result'),
                    txt(1.1, 5.7, '6', 'md', 'muted', 'end'),
                    txt(-0.1, 1.4, '3', 'md', 'muted', 'end'),
                    txt(5, 3.4, '8', 'md', 'muted'),
                    txt(6, -0.8, 'x', 'md', 'muted'),
                  ],
                }),
                caption: L('DE is parallel to BC.', 'DE sejajar dengan BC.'),
              }
            })(),
            blanks: [{ label: 'BC =', answer: 12, after: '\\text{ cm}' }],
            solution: ['AB=6+3=9', '\\frac{BC}{DE}=\\frac{AB}{AD}=\\frac{9}{6}=\\frac{3}{2}', 'BC=8\\times\\frac{3}{2}=12'],
          },
          {
            prompt: L(
              'Citra is 120 cm tall. She stands 200 cm from the foot of a lamp post, and her shadow is 100 cm long. How tall is the lamp post?',
              'Citra tingginya 120 cm. Ia berdiri 200 cm dari kaki tiang lampu, dan bayangannya 100 cm. Berapa tinggi tiang lampu itu?',
            ),
            figure: {
              dim: 2,
              axes: false,
              ...fit([[-0.8, -1], [3.8, 4.2]], 0.3),
              items: [
                line([-0.5, 0], [3.4, 0], 'muted', { width: 2.5 }),
                line([0, 0], [0, 3.6], 'a', { width: 4 }),
                line([2, 0], [2, 1.2], 'b', { width: 4 }),
                line([0, 3.6], [3, 0], 'muted', { dashed: true }),
                { t: 'right', at: [0, 0], from: [1, 0], to: [0, 1] },
                { t: 'right', at: [2, 0], from: [3, 0], to: [2, 1] },
                txt(-0.15, 1.8, 'H', 'lg', 'a', 'end'),
                txt(2.15, 0.6, '120', 'md', 'b', 'start'),
                txt(1, -0.5, '200', 'md', 'muted'),
                txt(2.5, -0.5, '100', 'md', 'muted'),
              ],
              caption: L(
                'The lamp post, Citra and her shadow. The lengths are in cm.',
                'Tiang lampu, Citra, dan bayangannya. Panjangnya dalam cm.',
              ),
            },
            blanks: [{ label: 'H =', answer: 360, after: '\\text{ cm}' }],
            solution: ['200+100=300', '\\frac{H}{120}=\\frac{300}{100}', 'H=120\\times3=360'],
          },
        ],
      },
    },
  ],
}
