import type { Loc, Module } from '../types'
import type { FigItem } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import { clockFace, fit, fractionCircles, line, numberLine, outline, protractor, rectPts, shape, solid, txt } from './figs'

/** Module 7 — size of angles (kinds, protractor, clock hands, missing angles)
 *  and estimating (sizes of things, results of calculations). */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

const rad = (d: number) => (d * Math.PI) / 180
const tidy = (n: number) => Number(n.toFixed(4))
/** The point at distance `r` from (cx, cy) in direction `deg` (counterclockwise from the right). */
const at = (cx: number, cy: number, r: number, deg: number): Pt => [tidy(cx + r * Math.cos(rad(deg))), tidy(cy + r * Math.sin(rad(deg)))]
const plus = (p: Piece, extra: FigItem[]): Piece => ({ ...p, items: [...p.items, ...extra] })

/** An arc of radius `r` from direction `a0` to `a1`, drawn as short segments (works past 180 degrees too). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number): FigItem[] {
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 8))
  return Array.from({ length: n }, (_, i) => line(at(cx, cy, r, a0 + ((a1 - a0) * i) / n), at(cx, cy, r, a0 + ((a1 - a0) * (i + 1)) / n), 'result', { width: 2.5 }))
}

/** One angle: an arm along the right, a second arm at `deg`, and the turn between them marked. */
function angleAt(cx: number, cy: number, deg: number, len = 2): FigItem[] {
  const mark: FigItem[] =
    deg === 90
      ? [{ t: 'right', at: [cx, cy], from: at(cx, cy, len, 0), to: at(cx, cy, len, 90) }]
      : arc(cx, cy, Math.min(0.8, len * 0.4), 0, deg)
  return [line([cx, cy], at(cx, cy, len, 0), 'a', { width: 3.5 }), line([cx, cy], at(cx, cy, len, deg), 'a', { width: 3.5 }), ...mark, { t: 'dot', x: cx, y: cy, color: 'muted' }]
}

/** The five kinds of angle side by side, each with its size written underneath. */
function kindsFigure(): Piece {
  const items: FigItem[] = []
  ;[40, 90, 130, 180, 250].forEach((d, i) => {
    items.push(...angleAt(i * 5, 0, d, 2), txt(i * 5, -2.8, `${d}°`, 'md', 'muted'))
  })
  return { dim: 2, axes: false, ...fit([[-2.4, -3.4], [22.4, 2.4]], 0.4), items }
}

/** A protractor reading. `from` says which side of the protractor the red arm lies on
 *  (the angle is measured from that arm to the green ray); `label` is written inside the angle. */
function protr(deg: number, from: 'right' | 'left', label?: string): Piece {
  const R = 5
  const a0 = from === 'right' ? 0 : deg
  const a1 = from === 'right' ? deg : 180
  const extra: FigItem[] = [line([0, 0], at(0, 0, R + 0.4, from === 'right' ? 0 : 180), 'result', { width: 4.5 })]
  if (label) extra.push(txt(...at(0, 0, 2.2, (a0 + a1) / 2), label, 'lg', 'result'))
  return plus(protractor({ deg }), extra)
}

/** A clock at `h`:00 with the turn between the two hands marked. (Not for 6:00.) */
function clockAngle(h: number, label: string): Piece {
  const th = rad(h * 30)
  return plus(clockFace({ h, m: 0 }), [{ t: 'angle', at: [0, 0], from: [0, 1], to: [tidy(Math.sin(th)), tidy(Math.cos(th))], label }])
}

/** Triangle with the corners listed A, B, C (counterclockwise): B at the origin, C on the x axis. */
function triPts(angB: number, angC: number, bc: number): [Pt, Pt, Pt] {
  const angA = 180 - angB - angC
  const ab = (bc * Math.sin(rad(angC))) / Math.sin(rad(angA))
  return [[tidy(ab * Math.cos(rad(angB))), tidy(ab * Math.sin(rad(angB)))], [0, 0], [bc, 0]]
}
const ang = (p: Pt, from: Pt, to: Pt, label: string): FigItem => ({ t: 'angle', at: p, from, to, label })

/** A triangle with its three angles marked by `labels` (A, B, C). `extra` adds more drawing. */
function triFig(angB: number, angC: number, bc: number, labels: [string, string, string], extra: FigItem[] = []): Piece {
  const [A, B, C] = triPts(angB, angC, bc)
  return shape({ pts: [A, B, C], names: 'ABC', extra: [ang(A, B, C, labels[0]), ang(B, C, A, labels[1]), ang(C, A, B, labels[2]), ...extra] })
}

/** The triangle of the exterior-angle problems: B, C, D on one straight line, and the angle between CD and CA marked. */
function triLineFig(angB: number, angC: number, bc: number, labels: [string, string, string]): Piece {
  const [A, B, C] = triPts(angB, angC, bc)
  const D: Pt = [bc + 2.4, 0]
  return shape({
    pts: [A, B, C],
    names: 'ABC',
    extra: [line(C, [bc + 2.2, 0], 'a', { width: 3 }), txt(D[0], 0, 'D', 'lg', 'result'), ang(A, B, C, labels[0]), ang(B, C, A, labels[1]), ang(C, D, A, labels[2])],
  })
}

/** A quadrilateral ABCD cut by the diagonal BD into two triangles; the angles at B and D split as given. */
function quadFig(t1: number, d1: number, t2: number, d2: number, bd: number, labels: [string, string, string, string]): Piece {
  const B: Pt = [0, 0]
  const D: Pt = [bd, 0]
  const angA = 180 - t1 - d1
  const angC = 180 - t2 - d2
  const ab = (bd * Math.sin(rad(d1))) / Math.sin(rad(angA))
  const cb = (bd * Math.sin(rad(d2))) / Math.sin(rad(angC))
  const A: Pt = [tidy(ab * Math.cos(rad(t1))), tidy(ab * Math.sin(rad(t1)))]
  const C: Pt = [tidy(cb * Math.cos(rad(t2))), tidy(-cb * Math.sin(rad(t2)))]
  return shape({ pts: [A, B, C, D], names: 'ABCD', extra: [ang(A, D, B, labels[0]), ang(B, A, C, labels[1]), ang(C, B, D, labels[2]), ang(D, C, A, labels[3])] })
}

/** Angles that fit together: two on a straight line, and four around a point. */
function fitFigure(): Piece {
  const items: FigItem[] = [line([-3, 0], [3, 0], 'a', { width: 3.5 }), line([0, 0], at(0, 0, 3, 65), 'b', { width: 3.5 }), { t: 'dot', x: 0, y: 0, color: 'muted' }]
  items.push(ang([0, 0], [3, 0], at(0, 0, 3, 65), '65°'), ang([0, 0], at(0, 0, 3, 65), [-3, 0], '115°'))
  const rays = [0, 80, 170, 260]
  rays.forEach((a) => items.push(line([8, 0], at(8, 0, 2.6, a), 'a', { width: 3.5 })))
  items.push({ t: 'dot', x: 8, y: 0, color: 'muted' })
  const gaps = ['80°', '90°', '90°', '100°']
  rays.forEach((a, i) => items.push(ang([8, 0], at(8, 0, 2.6, a), at(8, 0, 2.6, rays[(i + 1) % 4]), gaps[i])))
  return { dim: 2, axes: false, ...fit([[-3.4, -3], [11, 3.3]], 0.5), items }
}

/** A ruler marked 0 to 20 cm with a pencil lying along it from 0 to `len`. */
function rulerPencil(len: number): Piece {
  const items: FigItem[] = [outline(rectPts(0, 0, 20, 1.6), 'muted')]
  for (let c = 0; c <= 20; c++) {
    items.push(line([c, 1.6], [c, c % 5 === 0 ? 0.8 : 1.15], 'muted', { width: c % 5 === 0 ? 2 : 1 }))
    if (c % 5 === 0) items.push(txt(c, 0.4, String(c), 'sm', 'muted'))
  }
  items.push(txt(21.2, 0.8, 'cm', 'sm', 'muted'))
  items.push(solid(rectPts(0, 2.0, len - 1, 0.9), 'c'))
  items.push(solid([[len - 1, 2.0], [len, 2.45], [len - 1, 2.9]], 'b'))
  return { dim: 2, axes: false, ...fit([[-0.6, -0.4], [22, 3.3]], 0.3), items }
}

/** A bench with `n` equal hand spans (or pencils) laid along it, the first one labeled. */
function spansFig(n: number, label: string): Piece {
  const items: FigItem[] = [outline(rectPts(0, 0, n, 0.7), 'muted')]
  for (let i = 0; i < n; i++) items.push(solid(rectPts(i, 0.9, 1, 0.6), i % 2 ? 'b' : 'a'))
  items.push(txt(0.5, 2.0, label, 'md', 'muted'))
  return { dim: 2, axes: false, ...fit([[-0.3, -0.3], [n + 0.3, 2.4]], 0.4), items }
}

const DEG = { en: '^\\circ', id: '^\\circ' }

/* -------------------------------------------------------------- module */

export const module7: Module = {
  id: 'tka-m7',
  title: L('Angles and Estimation', 'Sudut dan Penaksiran'),
  summary: L(
    'Name, measure and work out the size of angles, and estimate the size of things and the result of a calculation with sensible numbers and units.',
    'Menyebut, mengukur, dan menghitung besar sudut, serta menaksir ukuran benda dan hasil hitung dengan bilangan dan satuan yang masuk akal.',
  ),
  submodules: [
    /* ============================================================ S1: angles */
    {
      id: 'tka-m7-s1',
      title: L('Size of Angles', 'Besar Sudut'),
      summary: L(
        'The kinds of angles, measuring with a protractor, the angle between the clock hands, and finding a missing angle.',
        'Jenis-jenis sudut, mengukur dengan busur derajat, sudut antara jarum jam, dan mencari sudut yang hilang.',
      ),
      lessons: [
        /* ------------------------------------------------- S1 L1 kinds and measuring */
        {
          id: 'tka-m7-s1-l1',
          title: L('Recognizing and Measuring Angles', 'Mengenal dan Mengukur Sudut'),
          goal: L(
            'You can name the kinds of angles, read a protractor on the right scale, and find the angle between the clock hands.',
            'Kamu bisa menyebut jenis-jenis sudut, membaca busur derajat pada skala yang benar, dan mencari sudut antara jarum jam.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: An Angle Is a Turn', 'Ayo Amati: Sudut Adalah Putaran'),
              body: L(
                'When you open a door, the door **turns** around its hinge. The wider you open it, the bigger the turn.\n\nThe turn between two lines that meet at one point is called an **angle**. The two lines are the **arms** and the point where they meet is the **corner point**.\n\nWe measure an angle in **degrees**, written like $40^\\circ$. One full turn all the way round is $360^\\circ$.\n\nHere are five kinds of angles. Look at the pictures and then read the table.\n\n| Name | Size | Where you see it |\n|---|---|---|\n| Acute angle | less than $90^\\circ$ | the tip of a sharp pencil |\n| Right angle | exactly $90^\\circ$ | the corner of a book |\n| Obtuse angle | between $90^\\circ$ and $180^\\circ$ | a laptop opened wide |\n| Straight angle | exactly $180^\\circ$ | a straight ruler |\n| Reflex angle | more than $180^\\circ$, up to $360^\\circ$ | the turn of the long clock hand from 12 to 8 (40 minutes) |',
                'Ketika kamu membuka pintu, daun pintu **berputar** pada engselnya. Makin lebar kamu membukanya, makin besar putarannya.\n\nPutaran di antara dua garis yang bertemu di satu titik disebut **sudut**. Kedua garis itu adalah **kaki sudut**, dan titik tempat keduanya bertemu adalah **titik sudut**.\n\nBesar sudut diukur dalam **derajat**, ditulis seperti $40^\\circ$. Satu putaran penuh sampai kembali ke awal adalah $360^\\circ$.\n\nBerikut lima jenis sudut. Lihat gambarnya, lalu baca tabelnya.\n\n| Nama | Besar | Contohnya |\n|---|---|---|\n| Sudut lancip | kurang dari $90^\\circ$ | ujung pensil yang runcing |\n| Sudut siku-siku | tepat $90^\\circ$ | sudut pojok buku |\n| Sudut tumpul | antara $90^\\circ$ dan $180^\\circ$ | laptop yang dibuka lebar |\n| Sudut lurus | tepat $180^\\circ$ | penggaris yang lurus |\n| Sudut refleks | lebih dari $180^\\circ$ sampai $360^\\circ$ | putaran jarum panjang jam dari angka 12 ke angka 8 (40 menit) |',
              ),
              figure: {
                ...kindsFigure(),
                caption: L(
                  'Five angles: 40, 90, 130, 180 and 250 degrees. The red mark shows the turn between the two arms.',
                  'Lima sudut: 40, 90, 130, 180, dan 250 derajat. Tanda merah menunjukkan putaran di antara kedua kaki sudut.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Measuring with a Protractor', 'Contoh Bertahap: Mengukur dengan Busur Derajat'),
              body: L(
                'A **protractor** has two rows of numbers that run in opposite directions. Let us measure the angle between the thick red arm and the green arm.\n\n1. Step 1: Put the middle point of the protractor on the corner point of the angle.\n2. Step 2: Turn the protractor so its flat edge lies along the red arm.\n3. Step 3: The red arm is on the right side, so use the row of numbers that starts at 0 on the right side.\n4. Step 4: Follow that row up to the green arm. It passes 30, then two small marks (40 and 50). Each small mark is $10^\\circ$, so the angle is $50^\\circ$.\n5. Step 5: Check: $50^\\circ$ is less than $90^\\circ$, so it must be an acute angle. That matches the picture.\n\n**Remember:**\n\n- Always use the row of numbers that starts at 0 on your red arm.\n- Check your number against the kind of angle you see.',
                'Sebuah **busur derajat** punya dua baris angka yang arahnya berlawanan. Mari kita ukur sudut di antara kaki merah yang tebal dan kaki hijau.\n\n1. Langkah 1: Letakkan titik tengah busur derajat tepat di titik sudut.\n2. Langkah 2: Putar busur supaya sisi lurusnya berimpit dengan kaki merah.\n3. Langkah 3: Kaki merah ada di sisi kanan, jadi pakai baris angka yang dimulai dari 0 di sisi kanan.\n4. Langkah 4: Ikuti baris itu sampai kaki hijau. Kamu melewati 30, lalu dua tanda kecil (40 dan 50). Tiap tanda kecil adalah $10^\\circ$, jadi sudutnya $50^\\circ$.\n5. Langkah 5: Periksa: $50^\\circ$ kurang dari $90^\\circ$, jadi harus sudut lancip. Itu cocok dengan gambar.\n\n**Ingat:**\n\n- Selalu pakai baris angka yang dimulai dari 0 pada kaki merahmu.\n- Periksa angkamu dengan jenis sudut yang kamu lihat.',
              ),
              figure: {
                ...protr(50, 'right', '50°'),
                caption: L(
                  'The red arm is on the right side. The green arm is 50 degrees away from it.',
                  'Kaki merah ada di sisi kanan. Kaki hijau berjarak 50 derajat darinya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Reading the Wrong Scale', 'Awas, Jebakan!: Membaca Skala yang Salah'),
              body: L(
                'These mistakes happen a lot with a protractor.\n\n| Wrong | Right |\n|---|---|\n| ❌ $130^\\circ$ for an angle that looks acute (the other row of numbers was read) | $50^\\circ$ (use the row that starts at 0 on your arm, and check: acute means less than $90^\\circ$) |\n| ❌ Reading the closest number that is printed, $60^\\circ$ | Count the small marks from a printed number: each mark is $10^\\circ$ |\n| ❌ $110^\\circ$ for the big angle on the outside (only the small angle was measured) | $360^\\circ-110^\\circ=250^\\circ$ (the two angles together make a full turn) |',
                'Kesalahan ini sering terjadi saat memakai busur derajat.\n\n| Salah | Benar |\n|---|---|\n| ❌ $130^\\circ$ untuk sudut yang tampak lancip (yang dibaca baris angka yang lain) | $50^\\circ$ (pakai baris yang dimulai dari 0 pada kakimu, lalu periksa: lancip berarti kurang dari $90^\\circ$) |\n| ❌ Membaca angka tercetak yang terdekat, $60^\\circ$ | Hitung tanda kecil dari angka tercetak: tiap tanda adalah $10^\\circ$ |\n| ❌ $110^\\circ$ untuk sudut besar di bagian luar (yang diukur hanya sudut kecil) | $360^\\circ-110^\\circ=250^\\circ$ (kedua sudut itu bersama-sama membentuk satu putaran penuh) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Look at the angle. The dashed line shows a right angle, like the corner of a book. What kind of angle is it?',
                'Perhatikan sudut ini. Garis putus-putus menunjukkan sudut siku-siku, seperti pojok buku. Termasuk jenis sudut apa ini?',
              ),
              figure: {
                dim: 2,
                axes: false,
                ...fit([[-0.8, -0.5], [3.5, 3.4]], 0.6),
                items: [...angleAt(0, 0, 130, 3), line([0, 0], [0, 3.1], 'muted', { dashed: true, width: 2 })],
                caption: L('The dashed line is a right angle.', 'Garis putus-putus adalah sudut siku-siku.'),
              },
              options: [
                L('Obtuse angle', 'Sudut tumpul'),
                L('Acute angle', 'Sudut lancip'),
                L('Right angle', 'Sudut siku-siku'),
                L('Straight angle', 'Sudut lurus'),
              ],
              answer: 0,
              explain: L(
                'The arm is opened wider than the dashed right angle, but the two arms do not make a straight line yet. So the angle is between $90^\\circ$ and $180^\\circ$: an obtuse angle.',
                'Kaki sudut terbuka lebih lebar daripada sudut siku-siku yang putus-putus, tetapi kedua kaki belum membentuk garis lurus. Jadi sudutnya antara $90^\\circ$ dan $180^\\circ$: sudut tumpul.',
              ),
              hint: L(
                'Compare the arm with the dashed line. Is the angle narrower or wider than a book corner? Is it already a straight line?',
                'Bandingkan kaki sudut dengan garis putus-putus. Apakah sudutnya lebih sempit atau lebih lebar daripada pojok buku? Apakah sudah menjadi garis lurus?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: the red arm is on the right side, so use the row of numbers that starts at 0 on the right. Read where the green arm points.',
                'Coba bersama: kaki merah ada di sisi kanan, jadi pakai baris angka yang dimulai dari 0 di sisi kanan. Baca ke mana kaki hijau menunjuk.',
              ),
              figure: {
                ...protr(70, 'right', '?'),
                caption: L('Measure the angle between the red arm and the green arm.', 'Ukur sudut di antara kaki merah dan kaki hijau.'),
              },
              template: {
                en: '\\text{angle} = ___ ^\\circ \\quad \\text{acute: less than } ___ ^\\circ',
                id: '\\text{sudut} = ___ ^\\circ \\quad \\text{lancip: kurang dari } ___ ^\\circ',
              },
              blanks: ['70', '90'],
              explain: L(
                'The green arm is one small mark after 60, so the angle is $70^\\circ$. It is less than $90^\\circ$, which fits an acute angle.',
                'Kaki hijau ada satu tanda kecil setelah 60, jadi sudutnya $70^\\circ$. Besarnya kurang dari $90^\\circ$, cocok untuk sudut lancip.',
              ),
              hint: L(
                'Find the long mark 60, then count the small marks after it. Each one is $10^\\circ$.',
                'Cari tanda panjang 60, lalu hitung tanda kecil sesudahnya. Tiap tanda adalah $10^\\circ$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'This time the red arm is on the left side of the protractor. How big is the angle between the red arm and the green arm?',
                'Sekarang kaki merah ada di sisi kiri busur derajat. Berapa besar sudut di antara kaki merah dan kaki hijau?',
              ),
              figure: {
                ...protr(130, 'left'),
                caption: L('The red arm lies on the left side.', 'Kaki merah ada di sisi kiri.'),
              },
              options: [
                L('$50^\\circ$', '$50^\\circ$'),
                L('$130^\\circ$', '$130^\\circ$'),
                L('$40^\\circ$', '$40^\\circ$'),
                L('$140^\\circ$', '$140^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'For an arm on the left, use the row of numbers that starts at 0 on the left. The green arm is at 50 on that row. The number $130^\\circ$ comes from the row that starts at 0 on the other side.',
                'Untuk kaki di sisi kiri, pakai baris angka yang dimulai dari 0 di sisi kiri. Kaki hijau ada di angka 50 pada baris itu. Angka $130^\\circ$ berasal dari baris yang dimulai dari 0 di sisi lain.',
              ),
              hint: L(
                'Where is the 0 for the red arm? Read the row that starts there. Does the angle look acute or obtuse?',
                'Di mana angka 0 untuk kaki merah? Baca baris yang dimulai dari sana. Apakah sudutnya tampak lancip atau tumpul?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('An angle of $90^\\circ$ is a right angle.', 'Sudut $90^\\circ$ adalah sudut siku-siku.'),
                L('An obtuse angle is smaller than a right angle.', 'Sudut tumpul lebih kecil daripada sudut siku-siku.'),
                L('An angle of $250^\\circ$ is a reflex angle.', 'Sudut $250^\\circ$ adalah sudut refleks.'),
                L(
                  'If the small angle is $110^\\circ$, the reflex angle on the outside is $70^\\circ$.',
                  'Jika sudut kecilnya $110^\\circ$, sudut refleks di bagian luarnya adalah $70^\\circ$.',
                ),
              ],
              answer: [true, false, true, false],
              explain: L(
                'A right angle is exactly $90^\\circ$ and an obtuse angle is bigger than that. A reflex angle is more than $180^\\circ$. The reflex angle outside a $110^\\circ$ angle is $360^\\circ-110^\\circ=250^\\circ$, not $70^\\circ$.',
                'Sudut siku-siku tepat $90^\\circ$ dan sudut tumpul lebih besar daripada itu. Sudut refleks lebih dari $180^\\circ$. Sudut refleks di luar sudut $110^\\circ$ adalah $360^\\circ-110^\\circ=250^\\circ$, bukan $70^\\circ$.',
              ),
              hint: L(
                'Remember the sizes: acute is under $90^\\circ$, obtuse is between $90^\\circ$ and $180^\\circ$, reflex is over $180^\\circ$. Two angles that make a full turn add up to $360^\\circ$.',
                'Ingat besarnya: lancip di bawah $90^\\circ$, tumpul di antara $90^\\circ$ dan $180^\\circ$, refleks di atas $180^\\circ$. Dua sudut yang membentuk satu putaran penuh jumlahnya $360^\\circ$.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: The Angle Between the Clock Hands', 'Contoh Bertahap: Sudut di Antara Jarum Jam'),
              body: L(
                'A clock face is one full turn, $360^\\circ$. The numbers 1 to 12 are spread out evenly, so one gap between two neighboring numbers is $360^\\circ\\div12=30^\\circ$.\n\n1. Step 1: At 4:00 the long hand points at 12 and the short hand points at 4.\n2. Step 2: Count the gaps from 12 to 4. There are 4 gaps.\n3. Step 3: Each gap is $30^\\circ$, so the angle is $4\\times30^\\circ=120^\\circ$.\n4. Step 4: Choose the smaller angle. If you get more than $180^\\circ$, subtract it from $360^\\circ$.\n\n**Remember:**\n\n- One hour on the clock is $30^\\circ$.\n- "The angle between the hands" means the smaller angle.',
                'Muka jam adalah satu putaran penuh, $360^\\circ$. Angka 1 sampai 12 tersebar merata, jadi satu celah di antara dua angka yang bersebelahan adalah $360^\\circ\\div12=30^\\circ$.\n\n1. Langkah 1: Pada pukul 4.00 jarum panjang menunjuk angka 12 dan jarum pendek menunjuk angka 4.\n2. Langkah 2: Hitung celah dari 12 sampai 4. Ada 4 celah.\n3. Langkah 3: Tiap celah $30^\\circ$, jadi sudutnya $4\\times30^\\circ=120^\\circ$.\n4. Langkah 4: Pilih sudut yang lebih kecil. Jika hasilnya lebih dari $180^\\circ$, kurangkan dari $360^\\circ$.\n\n**Ingat:**\n\n- Satu jam pada jam adalah $30^\\circ$.\n- "Sudut di antara jarum" berarti sudut yang lebih kecil.',
              ),
              figure: {
                ...clockAngle(4, '120°'),
                caption: L('At 4:00 there are 4 gaps of 30 degrees between the hands.', 'Pada pukul 4.00 ada 4 celah 30 derajat di antara kedua jarum.'),
              },
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'What is the angle between the two clock hands at 2:00?',
                'Berapa sudut di antara kedua jarum jam pada pukul 2.00?',
              ),
              figure: {
                ...clockAngle(2, '?'),
                caption: L('The clock shows 2:00.', 'Jam menunjukkan pukul 2.00.'),
              },
              options: [
                L('$60^\\circ$', '$60^\\circ$'),
                L('$30^\\circ$', '$30^\\circ$'),
                L('$120^\\circ$', '$120^\\circ$'),
                L('$300^\\circ$', '$300^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'From 12 to 2 there are 2 gaps, and $2\\times30^\\circ=60^\\circ$. One gap alone is $30^\\circ$, and $300^\\circ$ is the long way round.',
                'Dari 12 ke 2 ada 2 celah, dan $2\\times30^\\circ=60^\\circ$. Satu celah saja $30^\\circ$, dan $300^\\circ$ adalah jalan memutar yang panjang.',
              ),
              hint: L(
                'Count the gaps between the numbers from 12 to the hour hand. Each gap is $30^\\circ$.',
                'Hitung celah di antara angka dari 12 sampai jarum pendek. Tiap celah adalah $30^\\circ$.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Siti looks at the clock at exactly 8:00. What is the smaller angle between the two hands?',
                'Siti melihat jam tepat pukul 8.00. Berapa sudut yang lebih kecil di antara kedua jarum?',
              ),
              figure: {
                ...clockAngle(8, '?'),
                caption: L('The clock shows 8:00.', 'Jam menunjukkan pukul 8.00.'),
              },
              blanks: [{ answer: 120, after: DEG }],
              hints: [
                L(
                  'Where does the long hand point at 8:00? Where does the short hand point?',
                  'Ke mana jarum panjang menunjuk pada pukul 8.00? Ke mana jarum pendek menunjuk?',
                ),
                L(
                  'Count the gaps from 12 to 8 and multiply by $30^\\circ$.',
                  'Hitung celah dari 12 sampai 8 lalu kalikan dengan $30^\\circ$.',
                ),
                L(
                  '$8\\times30^\\circ=240^\\circ$, but that is the long way round. The question wants the smaller angle, so subtract from $360^\\circ$.',
                  '$8\\times30^\\circ=240^\\circ$, tetapi itu jalan memutar yang panjang. Soal meminta sudut yang lebih kecil, jadi kurangkan dari $360^\\circ$.',
                ),
              ],
              explain: L(
                'The way from 12 round to 8 is $8\\times30^\\circ=240^\\circ$. The smaller angle is $360^\\circ-240^\\circ=120^\\circ$, which is 4 gaps from 8 to 12.',
                'Jalan dari 12 memutar ke 8 adalah $8\\times30^\\circ=240^\\circ$. Sudut yang lebih kecil adalah $360^\\circ-240^\\circ=120^\\circ$, yaitu 4 celah dari 8 ke 12.',
              ),
              solution: ['8 \\times 30 = 240', '240 > 180 \\Rightarrow 360 - 240 = 120', '120^\\circ'],
            },
          ],
        },
        /* ------------------------------------------------- S1 L2 working out angles */
        {
          id: 'tka-m7-s1-l2',
          title: L('Working Out Angles', 'Menghitung Besar Sudut'),
          goal: L(
            'You can find a missing angle on a straight line, around a point, in a triangle and in a quadrilateral.',
            'Kamu bisa mencari sudut yang hilang pada garis lurus, di sekeliling titik, pada segitiga, dan pada segiempat.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Angles That Fit Together', 'Ayo Amati: Sudut-Sudut yang Bersama-sama Berjumlah Tetap'),
              body: L(
                'Ani cuts a round pizza from the middle into slices. All the slices together fill the whole circle, one full turn. Angles that fit together always add up to the same number.\n\n- **Right angle:** $90^\\circ$.\n- **Angles on a straight line** add up to $180^\\circ$.\n- **Angles around a point** add up to $360^\\circ$.\n\nIn the picture, the two angles on the straight line are $65^\\circ$ and $115^\\circ$, and $65+115=180$. The four angles around the other point are $80^\\circ$, $90^\\circ$, $90^\\circ$ and $100^\\circ$, and together they make $360^\\circ$.',
                'Ani memotong pizza bulat dari tengah menjadi irisan-irisan. Semua irisan bersama-sama memenuhi seluruh lingkaran, yaitu satu putaran penuh. Sudut-sudut yang menyatu seperti ini selalu berjumlah sama.\n\n- **Sudut siku-siku:** $90^\\circ$.\n- **Sudut-sudut pada garis lurus** berjumlah $180^\\circ$.\n- **Sudut-sudut di sekeliling satu titik** berjumlah $360^\\circ$.\n\nPada gambar, kedua sudut pada garis lurus adalah $65^\\circ$ dan $115^\\circ$, dan $65+115=180$. Keempat sudut di sekeliling titik yang lain adalah $80^\\circ$, $90^\\circ$, $90^\\circ$, dan $100^\\circ$, dan jumlahnya $360^\\circ$.',
              ),
              figure: {
                ...fitFigure(),
                caption: L(
                  'Left: two angles on a straight line. Right: four angles around one point.',
                  'Kiri: dua sudut pada garis lurus. Kanan: empat sudut di sekeliling satu titik.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: The Missing Angle of a Triangle', 'Contoh Bertahap: Sudut yang Hilang pada Segitiga'),
              body: L(
                'Tear the three corners off a paper triangle and put them side by side: they make a straight line. So the three angles of any triangle add up to $180^\\circ$. A quadrilateral (a shape with four corners) can be cut into two triangles, so its four angles add up to $2\\times180^\\circ=360^\\circ$.\n\nIn triangle ABC, angle A is $50^\\circ$ and angle B is $60^\\circ$. Find angle C.\n\n1. Step 1: The three angles of a triangle add up to $180^\\circ$.\n2. Step 2: Add the angles you know: $50^\\circ+60^\\circ=110^\\circ$.\n3. Step 3: Subtract that from $180^\\circ$: $180^\\circ-110^\\circ=70^\\circ$.\n4. Step 4: Check: $50+60+70=180$. So angle C is $70^\\circ$.\n\n**Remember:**\n\n| Shape | Sum of its angles |\n|---|---|\n| Triangle | $180^\\circ$ |\n| Quadrilateral | $360^\\circ$ |',
                'Sobek ketiga sudut dari segitiga kertas lalu letakkan berdampingan: hasilnya membentuk garis lurus. Jadi ketiga sudut segitiga apa pun berjumlah $180^\\circ$. Sebuah segiempat (bangun dengan empat sudut) bisa dibelah menjadi dua segitiga, jadi keempat sudutnya berjumlah $2\\times180^\\circ=360^\\circ$.\n\nPada segitiga ABC, sudut A adalah $50^\\circ$ dan sudut B adalah $60^\\circ$. Cari sudut C.\n\n1. Langkah 1: Ketiga sudut segitiga berjumlah $180^\\circ$.\n2. Langkah 2: Jumlahkan sudut yang sudah diketahui: $50^\\circ+60^\\circ=110^\\circ$.\n3. Langkah 3: Kurangkan dari $180^\\circ$: $180^\\circ-110^\\circ=70^\\circ$.\n4. Langkah 4: Periksa: $50+60+70=180$. Jadi sudut C adalah $70^\\circ$.\n\n**Ingat:**\n\n| Bangun | Jumlah sudutnya |\n|---|---|\n| Segitiga | $180^\\circ$ |\n| Segiempat | $360^\\circ$ |',
              ),
              figure: {
                ...triFig(60, 70, 5, ['50°', '60°', '?']),
                caption: L('Triangle ABC. Angle C is the one we look for.', 'Segitiga ABC. Sudut C adalah yang kita cari.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Which Total, and Did You Subtract?', 'Awas, Jebakan!: Jumlahnya Berapa, dan Sudah Dikurangkan?'),
              body: L(
                'Watch out for these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $50^\\circ+60^\\circ=110^\\circ$, so angle C is $110^\\circ$ (forgot to subtract from $180^\\circ$) | $180^\\circ-110^\\circ=70^\\circ$ (the sum of the known angles is not the answer) |\n| ❌ The four angles of a quadrilateral add up to $180^\\circ$ | They add up to $360^\\circ$ (four corners, two triangles) |\n| ❌ One angle on a straight line is $65^\\circ$, so the other is $90^\\circ-65^\\circ=25^\\circ$ | $180^\\circ-65^\\circ=115^\\circ$ (a straight line is $180^\\circ$; $90^\\circ$ is only for a right angle) |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $50^\\circ+60^\\circ=110^\\circ$, jadi sudut C adalah $110^\\circ$ (lupa mengurangkan dari $180^\\circ$) | $180^\\circ-110^\\circ=70^\\circ$ (jumlah sudut yang diketahui bukan jawabannya) |\n| ❌ Keempat sudut segiempat berjumlah $180^\\circ$ | Jumlahnya $360^\\circ$ (empat sudut, dua segitiga) |\n| ❌ Satu sudut pada garis lurus adalah $65^\\circ$, jadi yang lain $90^\\circ-65^\\circ=25^\\circ$ | $180^\\circ-65^\\circ=115^\\circ$ (garis lurus adalah $180^\\circ$; $90^\\circ$ hanya untuk sudut siku-siku) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Two angles sit next to each other on a straight line. One of them is $65^\\circ$. How big is the other angle?',
                'Dua sudut berdampingan pada sebuah garis lurus. Salah satunya $65^\\circ$. Berapa besar sudut yang lain?',
              ),
              figure: {
                dim: 2,
                axes: false,
                ...fit([[-3.4, -0.6], [3.4, 3.2]], 0.6),
                items: [
                  line([-3, 0], [3, 0], 'a', { width: 3.5 }),
                  line([0, 0], at(0, 0, 3, 115), 'b', { width: 3.5 }),
                  { t: 'dot', x: 0, y: 0, color: 'muted' },
                  ang([0, 0], at(0, 0, 3, 115), [-3, 0], '65°'),
                  ang([0, 0], [3, 0], at(0, 0, 3, 115), '?'),
                ],
                caption: L('Two angles on one straight line.', 'Dua sudut pada satu garis lurus.'),
              },
              options: [
                L('$115^\\circ$', '$115^\\circ$'),
                L('$25^\\circ$', '$25^\\circ$'),
                L('$295^\\circ$', '$295^\\circ$'),
                L('$65^\\circ$', '$65^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'Angles on a straight line add up to $180^\\circ$, so the other angle is $180^\\circ-65^\\circ=115^\\circ$. Using $90^\\circ$ gives $25^\\circ$, using $360^\\circ$ gives $295^\\circ$, and the two angles are not equal.',
                'Sudut-sudut pada garis lurus berjumlah $180^\\circ$, jadi sudut yang lain adalah $180^\\circ-65^\\circ=115^\\circ$. Memakai $90^\\circ$ memberi $25^\\circ$, memakai $360^\\circ$ memberi $295^\\circ$, dan kedua sudut itu tidak sama besar.',
              ),
              hint: L(
                'Which total do angles on a straight line make? Subtract the angle you know from that total.',
                'Berapa jumlah sudut-sudut pada garis lurus? Kurangkan sudut yang kamu tahu dari jumlah itu.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find angle A in this triangle. First add the two angles you know, then subtract from $180^\\circ$.',
                'Coba bersama: cari sudut A pada segitiga ini. Jumlahkan dulu dua sudut yang kamu tahu, lalu kurangkan dari $180^\\circ$.',
              ),
              figure: {
                ...triFig(40, 75, 5, ['?', '40°', '75°']),
                caption: L('Triangle ABC with angle B and angle C known.', 'Segitiga ABC dengan sudut B dan sudut C diketahui.'),
              },
              template: '40 + 75 = ___ \\quad 180 - 40 - 75 = ___',
              blanks: ['115', '65'],
              explain: L(
                'The two known angles make $115^\\circ$, and $180^\\circ-115^\\circ=65^\\circ$. So angle A is $65^\\circ$.',
                'Kedua sudut yang diketahui berjumlah $115^\\circ$, dan $180^\\circ-115^\\circ=65^\\circ$. Jadi sudut A adalah $65^\\circ$.',
              ),
              hint: L(
                'Add 40 and 75 first. Then take that total away from 180.',
                'Jumlahkan 40 dan 75 dulu. Lalu kurangkan jumlah itu dari 180.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The quadrilateral ABCD has three known angles. How big is angle D?',
                'Segiempat ABCD punya tiga sudut yang diketahui. Berapa besar sudut D?',
              ),
              figure: {
                ...quadFig(40, 80, 30, 70, 5, ['60°', '70°', '80°', '?']),
                caption: L('Quadrilateral ABCD.', 'Segiempat ABCD.'),
              },
              options: [
                L('$150^\\circ$', '$150^\\circ$'),
                L('$210^\\circ$', '$210^\\circ$'),
                L('$230^\\circ$', '$230^\\circ$'),
                L('$120^\\circ$', '$120^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'The four angles add up to $360^\\circ$. The known ones make $60+70+80=210$, and $360-210=150$. The number $210^\\circ$ is the sum before subtracting, $230^\\circ$ forgets one angle, and $120^\\circ$ is $180^\\circ-60^\\circ$, which uses the straight-line total and only one angle.',
                'Keempat sudut berjumlah $360^\\circ$. Yang diketahui berjumlah $60+70+80=210$, dan $360-210=150$. Angka $210^\\circ$ adalah jumlah sebelum dikurangkan, $230^\\circ$ melupakan satu sudut, dan $120^\\circ$ adalah $180^\\circ-60^\\circ$, yaitu memakai jumlah garis lurus dan hanya satu sudut.',
              ),
              hint: L(
                'A quadrilateral has four corners. Add the three known angles, then subtract from the total of a quadrilateral.',
                'Segiempat punya empat sudut. Jumlahkan ketiga sudut yang diketahui, lalu kurangkan dari jumlah sudut segiempat.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Look at the triangle. Choose the TWO statements that are true.',
                'Perhatikan segitiga ini. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...triFig(65, 70, 5, ['45°', '65°', '?']),
                caption: L('Triangle ABC.', 'Segitiga ABC.'),
              },
              options: [
                L('Angle C is $70^\\circ$.', 'Sudut C adalah $70^\\circ$.'),
                L('Angle C is the biggest angle of this triangle.', 'Sudut C adalah sudut terbesar pada segitiga ini.'),
                L('Angle C is $110^\\circ$.', 'Sudut C adalah $110^\\circ$.'),
                L('The three angles of this triangle add up to $360^\\circ$.', 'Ketiga sudut segitiga ini berjumlah $360^\\circ$.'),
              ],
              answer: [0, 1],
              explain: L(
                '$45+65=110$ and $180-110=70$, so angle C is $70^\\circ$. That is bigger than $65^\\circ$ and $45^\\circ$. The number $110^\\circ$ is only the sum of the two known angles, and the angles of a triangle add up to $180^\\circ$.',
                '$45+65=110$ dan $180-110=70$, jadi sudut C adalah $70^\\circ$. Itu lebih besar daripada $65^\\circ$ dan $45^\\circ$. Angka $110^\\circ$ hanyalah jumlah dua sudut yang diketahui, dan sudut-sudut segitiga berjumlah $180^\\circ$.',
              ),
              hint: L(
                'Work out angle C first. Then compare it with the other two angles and check each statement.',
                'Cari sudut C dulu. Lalu bandingkan dengan dua sudut yang lain dan periksa tiap pernyataan.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('The angles $50^\\circ$, $60^\\circ$ and $70^\\circ$ can be the three angles of a triangle.', 'Sudut $50^\\circ$, $60^\\circ$, dan $70^\\circ$ bisa menjadi ketiga sudut sebuah segitiga.'),
                L('The angles $90^\\circ$, $60^\\circ$ and $60^\\circ$ can be the three angles of a triangle.', 'Sudut $90^\\circ$, $60^\\circ$, dan $60^\\circ$ bisa menjadi ketiga sudut sebuah segitiga.'),
                L('Two angles of $110^\\circ$ and $70^\\circ$ can sit together on a straight line.', 'Dua sudut $110^\\circ$ dan $70^\\circ$ bisa berdampingan pada sebuah garis lurus.'),
                L('The angles $90^\\circ$, $80^\\circ$, $100^\\circ$ and $100^\\circ$ can be the four angles of a quadrilateral.', 'Sudut $90^\\circ$, $80^\\circ$, $100^\\circ$, dan $100^\\circ$ bisa menjadi keempat sudut sebuah segiempat.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$50+60+70=180$, so the first can be a triangle. $90+60+60=210$, which is too much. $110+70=180$ fits a straight line. $90+80+100+100=370$, but a quadrilateral needs $360$.',
                '$50+60+70=180$, jadi yang pertama bisa menjadi segitiga. $90+60+60=210$, terlalu banyak. $110+70=180$ cocok untuk garis lurus. $90+80+100+100=370$, padahal segiempat butuh $360$.',
              ),
              hint: L(
                'Add the angles in each statement and compare with the right total: 180 for a triangle or a straight line, 360 for a quadrilateral.',
                'Jumlahkan sudut pada tiap pernyataan lalu bandingkan dengan jumlah yang benar: 180 untuk segitiga atau garis lurus, 360 untuk segiempat.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps in order to find angle C of a triangle where A is $50^\\circ$ and B is $60^\\circ$.',
                'Urutkan langkah untuk mencari sudut C pada segitiga dengan A $50^\\circ$ dan B $60^\\circ$.',
              ),
              lines: {
                en: ['\\text{a triangle: the angles add up to } 180^\\circ', '50^\\circ + 60^\\circ = 110^\\circ', '180^\\circ - 110^\\circ = 70^\\circ', '\\text{angle C} = 70^\\circ'],
                id: ['\\text{segitiga: jumlah sudut} = 180^\\circ', '50^\\circ + 60^\\circ = 110^\\circ', '180^\\circ - 110^\\circ = 70^\\circ', '\\text{sudut C} = 70^\\circ'],
              },
              explain: L(
                'Start with the rule, add the angles you know, subtract from the total, then state the answer.',
                'Mulai dari aturannya, jumlahkan sudut yang diketahui, kurangkan dari jumlah totalnya, lalu tulis jawabannya.',
              ),
              hint: L(
                'You need the sum of the known angles before you can subtract it.',
                'Kamu perlu jumlah sudut yang diketahui sebelum bisa mengurangkannya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'In the picture, B, C and D lie on one straight line. Angle A is $50^\\circ$ and angle B is $60^\\circ$. How big is the angle marked ? at C, between CD and CA?',
                'Pada gambar, B, C, dan D terletak pada satu garis lurus. Sudut A adalah $50^\\circ$ dan sudut B adalah $60^\\circ$. Berapa besar sudut bertanda ? di C, di antara CD dan CA?',
              ),
              figure: {
                ...triLineFig(60, 70, 5, ['50°', '60°', '?']),
                caption: L('B, C and D are on one straight line.', 'B, C, dan D berada pada satu garis lurus.'),
              },
              blanks: [{ answer: 110, after: DEG }],
              hints: [
                L(
                  'First find the angle inside the triangle at C. Then look at the straight line B, C, D.',
                  'Cari dulu sudut di dalam segitiga pada titik C. Lalu perhatikan garis lurus B, C, D.',
                ),
                L(
                  'The angles of the triangle add up to $180^\\circ$, so the angle inside at C is $180^\\circ-50^\\circ-60^\\circ$.',
                  'Sudut-sudut segitiga berjumlah $180^\\circ$, jadi sudut di dalam pada C adalah $180^\\circ-50^\\circ-60^\\circ$.',
                ),
                L(
                  'The angle inside at C is $70^\\circ$. Together with the angle marked ? it makes a straight line, so subtract $70^\\circ$ from $180^\\circ$.',
                  'Sudut di dalam pada C adalah $70^\\circ$. Bersama sudut bertanda ? keduanya membentuk garis lurus, jadi kurangkan $70^\\circ$ dari $180^\\circ$.',
                ),
              ],
              explain: L(
                'The angle inside the triangle at C is $180^\\circ-50^\\circ-60^\\circ=70^\\circ$. The two angles at C lie on a straight line, so the marked angle is $180^\\circ-70^\\circ=110^\\circ$.',
                'Sudut di dalam segitiga pada C adalah $180^\\circ-50^\\circ-60^\\circ=70^\\circ$. Kedua sudut di C berada pada garis lurus, jadi sudut yang ditandai adalah $180^\\circ-70^\\circ=110^\\circ$.',
              ),
              solution: ['180 - 50 - 60 = 70', '180 - 70 = 110', '110^\\circ'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m7-s1-p',
        runtime: 'math',
        title: L('Angle Detective', 'Detektif Sudut'),
        brief: L(
          'Read a protractor, cut a pizza, and track down missing angles in triangles.',
          'Bacalah busur derajat, potonglah pizza, dan temukan sudut-sudut yang hilang pada segitiga.',
        ),
        requirements: [
          L('Read a protractor on the correct scale.', 'Membaca busur derajat pada skala yang benar.'),
          L('Use the totals 180 and 360 to find a missing angle.', 'Memakai jumlah 180 dan 360 untuk mencari sudut yang hilang.'),
        ],
        hints: [
          L('Before you calculate, ask: which total belongs here, 90, 180 or 360?', 'Sebelum menghitung, tanyakan: jumlah mana yang dipakai di sini, 90, 180, atau 360?'),
          L('On a protractor, start counting at the 0 that lies on your arm.', 'Pada busur derajat, mulai menghitung dari angka 0 yang ada pada kakimu.'),
          L('When two things need finding, find the one inside the triangle first.', 'Kalau ada dua hal yang harus dicari, cari dulu yang ada di dalam segitiga.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'The red arm is on the left side of the protractor. How many degrees is the angle between the red arm and the green arm?',
              'Kaki merah ada di sisi kiri busur derajat. Berapa derajat sudut di antara kaki merah dan kaki hijau?',
            ),
            figure: {
              ...protr(60, 'left'),
              caption: L('Measure from the red arm on the left.', 'Ukur dari kaki merah di sisi kiri.'),
            },
            blanks: [{ answer: 120, after: DEG }],
            solution: {
              en: ['\\text{the row that starts at 0 on the left reads } 120', '180 - 60 = 120 \\quad \\text{(check)}', '120^\\circ'],
              id: ['\\text{baris yang dimulai dari 0 di kiri terbaca } 120', '180 - 60 = 120 \\quad \\text{(periksa)}', '120^\\circ'],
            },
          },
          {
            prompt: L('Find angle A of the triangle.', 'Cari sudut A pada segitiga ini.'),
            figure: {
              ...triFig(38, 77, 5, ['?', '38°', '77°']),
              caption: L('Triangle ABC.', 'Segitiga ABC.'),
            },
            blanks: [{ label: { en: '\\text{angle A} =', id: '\\text{sudut A} =' }, answer: 65, after: DEG }],
            solution: ['38 + 77 = 115', '180 - 115 = 65', '65^\\circ'],
          },
          {
            prompt: L(
              'Mrs. Rina cuts a round pizza from the middle into 8 equal slices. How many degrees is the angle of one slice at the middle?',
              'Ibu memotong pizza bulat dari tengah menjadi 8 irisan sama besar. Berapa derajat sudut satu irisan di bagian tengah?',
            ),
            figure: {
              ...fractionCircles([{ parts: 8, shaded: 1 }]),
              caption: L('A pizza cut into 8 equal slices.', 'Pizza yang dipotong menjadi 8 irisan sama besar.'),
            },
            blanks: [{ answer: 45, after: DEG }],
            solution: {
              en: ['\\text{all slices make one full turn: } 360^\\circ', '360 \\div 8 = 45', '45^\\circ'],
              id: ['\\text{semua irisan membentuk satu putaran penuh: } 360^\\circ', '360 \\div 8 = 45', '45^\\circ'],
            },
          },
          {
            prompt: L(
              'B, C and D lie on one straight line. Angle A is $55^\\circ$ and the angle between CD and CA is $125^\\circ$. How big is angle B?',
              'B, C, dan D terletak pada satu garis lurus. Sudut A adalah $55^\\circ$ dan sudut di antara CD dan CA adalah $125^\\circ$. Berapa besar sudut B?',
            ),
            figure: {
              ...triLineFig(70, 55, 5, ['55°', '?', '125°']),
              caption: L('B, C and D are on one straight line.', 'B, C, dan D berada pada satu garis lurus.'),
            },
            blanks: [{ label: { en: '\\text{angle B} =', id: '\\text{sudut B} =' }, answer: 70, after: DEG }],
            solution: {
              en: ['\\text{angle C inside the triangle: } 180 - 125 = 55', '180 - 55 - 55 = 70', '70^\\circ'],
              id: ['\\text{sudut C di dalam segitiga: } 180 - 125 = 55', '180 - 55 - 55 = 70', '70^\\circ'],
            },
          },
        ],
      },
    },
    /* ============================================================ S2: estimating */
    {
      id: 'tka-m7-s2',
      title: L('Estimating Measurements', 'Penaksiran Ukuran'),
      summary: L(
        'Guess sizes with objects you know, choose a sensible unit, and estimate sums, differences and products by rounding first.',
        'Menaksir ukuran dengan benda yang kamu kenal, memilih satuan yang masuk akal, dan menaksir hasil tambah, kurang, dan kali dengan membulatkan dulu.',
      ),
      lessons: [
        /* ---------------------------------------------- S2 L1 estimating the size of things */
        {
          id: 'tka-m7-s2-l1',
          title: L('Estimating the Size of Things', 'Menaksir Ukuran Benda'),
          goal: L(
            'You can use familiar objects to estimate a length, a weight or an amount of liquid, with a sensible number and a sensible unit.',
            'Kamu bisa memakai benda yang kamu kenal untuk menaksir panjang, berat, atau isi cairan, dengan bilangan dan satuan yang masuk akal.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Use Things You Know', 'Ayo Amati: Pakai Benda yang Kamu Kenal'),
              body: L(
                'Ani has no ruler. How long is her desk? She lays her pencil along the desk again and again. The pencil is about 15 cm long and it fits 4 times, so the desk is about 60 cm.\n\nTo **estimate** means to find a size that is close, using a clever guess and not a wild one. A thing you know well and use to compare is called a **reference**.\n\nHere are some references to remember.\n\n| Thing | About how big |\n|---|---|\n| A new pencil | 15 cm long |\n| Your hand span | about 15 cm (measure yours once) |\n| A door | 2 m high |\n| A small bottle of mineral water | 600 ml |\n| One mango | 300 g |\n| A bag of sugar | 1 kg |',
                'Ani tidak punya penggaris. Berapa panjang mejanya? Ia meletakkan pensilnya berulang-ulang di sepanjang meja. Pensil itu panjangnya kira-kira 15 cm dan muat 4 kali, jadi meja itu kira-kira 60 cm.\n\n**Menaksir** berarti mencari ukuran yang dekat dengan memakai perkiraan yang cerdas, bukan tebakan asal. Benda yang kamu kenal baik dan kamu pakai untuk membandingkan disebut **patokan**.\n\nBerikut beberapa patokan yang perlu diingat.\n\n| Benda | Kira-kira sebesar |\n|---|---|\n| Pensil baru | panjang 15 cm |\n| Jengkal tanganmu | sekitar 15 cm (ukurlah jengkalmu sekali) |\n| Pintu | tinggi 2 m |\n| Botol kecil air mineral | 600 ml |\n| Sebuah mangga | 300 g |\n| Sekantong gula | 1 kg |',
              ),
              figure: {
                ...rulerPencil(15),
                caption: L('A new pencil is about 15 cm long.', 'Pensil baru panjangnya kira-kira 15 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Estimating a Length', 'Contoh Bertahap: Menaksir Panjang'),
              body: L(
                'Budi wants to estimate how long a bench is. He lays his hand span, about 15 cm, along the bench. It fits 8 times.\n\n1. Step 1: Pick a reference you know: one hand span is about 15 cm.\n2. Step 2: Count how many times it fits along the bench: 8 times.\n3. Step 3: Multiply: $8\\times15=120$.\n4. Step 4: Choose a sensible unit. 120 cm is a little more than 1 m, so the bench is about 120 cm long. A bench of 120 m or 120 mm would make no sense.\n\n**Remember:** a good estimate has a sensible number AND a sensible unit.\n\n| What you measure | A good unit |\n|---|---|\n| Length of a pencil | cm |\n| Distance between two towns | km |\n| Weight of a mango | g |\n| Water in a bucket | l |',
                'Budi ingin menaksir panjang sebuah bangku. Ia meletakkan jengkal tangannya, sekitar 15 cm, di sepanjang bangku. Jengkalnya muat 8 kali.\n\n1. Langkah 1: Pilih patokan yang kamu kenal: satu jengkal sekitar 15 cm.\n2. Langkah 2: Hitung berapa kali patokan itu muat di sepanjang bangku: 8 kali.\n3. Langkah 3: Kalikan: $8\\times15=120$.\n4. Langkah 4: Pilih satuan yang masuk akal. 120 cm sedikit lebih dari 1 m, jadi bangku itu kira-kira panjangnya 120 cm. Bangku sepanjang 120 m atau 120 mm tidak masuk akal.\n\n**Ingat:** taksiran yang baik punya bilangan DAN satuan yang masuk akal.\n\n| Yang diukur | Satuan yang cocok |\n|---|---|\n| Panjang pensil | cm |\n| Jarak antara dua kota | km |\n| Berat sebuah mangga | g |\n| Air dalam ember | l |',
              ),
              figure: {
                ...spansFig(8, '15 cm'),
                caption: L('A bench measured in hand spans. Each hand span is about 15 cm.', 'Sebuah bangku diukur dengan jengkal. Setiap jengkal sekitar 15 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Right Number, Wrong Unit', 'Awas, Jebakan!: Angka Benar, Satuan Salah'),
              body: L(
                'Be careful with these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ A door is about 2 cm high | About 2 m (the number is fine, but the unit is far too small) |\n| ❌ A school bag weighs about 30 kg | About 3 kg (30 kg is as heavy as a whole child) |\n| ❌ A small bottle of water holds about 6 l | About 600 ml (6 l would be ten bottles) |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ Tinggi pintu kira-kira 2 cm | Kira-kira 2 m (angkanya pas, tetapi satuannya terlalu kecil) |\n| ❌ Tas sekolah beratnya kira-kira 30 kg | Kira-kira 3 kg (30 kg seberat satu anak) |\n| ❌ Botol kecil air berisi kira-kira 6 l | Kira-kira 600 ml (6 l sama dengan sepuluh botol) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'About how long is the pencil in the picture?',
                'Kira-kira berapa panjang pensil pada gambar?',
              ),
              figure: {
                ...rulerPencil(14),
                caption: L('A pencil lying along a ruler.', 'Sebuah pensil terletak di sepanjang penggaris.'),
              },
              options: [
                L('14 cm', '14 cm'),
                L('14 mm', '14 mm'),
                L('14 m', '14 m'),
                L('140 cm', '140 cm'),
              ],
              answer: 0,
              explain: L(
                'The pencil ends at the mark 14 on a ruler marked in cm. 14 mm is shorter than a fingernail, 14 m is longer than a bus, and 140 cm is as long as a child is tall.',
                'Pensil berakhir di tanda 14 pada penggaris bersatuan cm. 14 mm lebih pendek daripada kuku jari, 14 m lebih panjang daripada bus, dan 140 cm sama dengan tinggi seorang anak.',
              ),
              hint: L(
                'Read the number where the pencil ends, then ask which unit fits a small pencil.',
                'Baca angka di ujung pensil, lalu tanyakan satuan mana yang cocok untuk sebuah pensil kecil.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a table is 4 pencils long and one pencil is about 15 cm. How long is the table? Remember that 1 m is the same as 100 cm.',
                'Coba bersama: sebuah meja panjangnya 4 pensil dan satu pensil sekitar 15 cm. Berapa panjang meja itu? Ingat 1 m sama dengan 100 cm.',
              ),
              figure: {
                ...spansFig(4, '15 cm'),
                caption: L('A table measured with 4 pencils.', 'Sebuah meja diukur dengan 4 pensil.'),
              },
              template: '4 \\times 15 = ___ \\text{ cm} \\quad 1 \\text{ m} = ___ \\text{ cm}',
              blanks: ['60', '100'],
              explain: L(
                '$4\\times15=60$, so the table is about 60 cm. That is less than 1 m, which is 100 cm, so cm is a sensible unit.',
                '$4\\times15=60$, jadi meja itu kira-kira 60 cm. Itu kurang dari 1 m, yaitu 100 cm, jadi cm adalah satuan yang masuk akal.',
              ),
              hint: L(
                'Multiply the number of pencils by the length of one pencil.',
                'Kalikan banyak pensil dengan panjang satu pensil.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The pencil is exactly 15 cm long. Four children estimated its length. Whose estimate is the closest?',
                'Pensil itu panjangnya tepat 15 cm. Empat anak menaksir panjangnya. Taksiran siapa yang paling dekat?',
              ),
              figure: {
                ...rulerPencil(15),
                caption: L('The real length of the pencil is 15 cm.', 'Panjang pensil yang sebenarnya adalah 15 cm.'),
              },
              options: [
                L('Ani: 14 cm', 'Ani: 14 cm'),
                L('Budi: 20 cm', 'Budi: 20 cm'),
                L('Citra: 9 cm', 'Citra: 9 cm'),
                L('Dewi: 30 cm', 'Dewi: 30 cm'),
              ],
              answer: 0,
              explain: L(
                'Ani is only 1 cm away from 15 cm. The others are 5 cm, 6 cm and 15 cm away. The closest estimate has the smallest difference from the real size.',
                'Ani hanya selisih 1 cm dari 15 cm. Yang lain selisih 5 cm, 6 cm, dan 15 cm. Taksiran yang paling dekat punya selisih terkecil dari ukuran sebenarnya.',
              ),
              hint: L(
                'For each child, find the difference from 15 by subtracting the smaller number from the bigger one.',
                'Untuk tiap anak, cari selisih dari 15 dengan mengurangkan bilangan yang lebih kecil dari yang lebih besar.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each estimate makes sense (True) or not (False).', 'Tentukan apakah setiap taksiran masuk akal (Benar) atau tidak (Salah).'),
              statements: [
                L('A school bag weighs about 3 kg.', 'Tas sekolah beratnya kira-kira 3 kg.'),
                L('A classroom door is about 2 cm high.', 'Pintu kelas tingginya kira-kira 2 cm.'),
                L('A small bottle of mineral water holds about 600 ml.', 'Botol kecil air mineral berisi kira-kira 600 ml.'),
                L('One mango weighs about 3 kg.', 'Satu buah mangga beratnya kira-kira 3 kg.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'A bag of about 3 kg is normal, and a small bottle is about 600 ml. A door is about 2 m, not 2 cm. A mango is about 300 g, so 3 kg would be ten mangoes.',
                'Tas seberat kira-kira 3 kg itu wajar, dan botol kecil berisi kira-kira 600 ml. Pintu tingginya sekitar 2 m, bukan 2 cm. Sebuah mangga sekitar 300 g, jadi 3 kg sama dengan sepuluh mangga.',
              ),
              hint: L(
                'Compare each one with a reference you know: a pencil, a door, a bottle, a mango.',
                'Bandingkan tiap pernyataan dengan patokan yang kamu kenal: pensil, pintu, botol, mangga.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the TWO estimates that make sense.', 'Pilih DUA taksiran yang masuk akal.'),
              options: [
                L('A school ruler is about 30 cm long.', 'Penggaris sekolah panjangnya kira-kira 30 cm.'),
                L('A glass of drinking water holds about 200 ml.', 'Segelas air minum berisi kira-kira 200 ml.'),
                L('A chicken weighs about 2 g.', 'Seekor ayam beratnya kira-kira 2 g.'),
                L('The way from Budi\'s house to school is about 800 mm.', 'Jarak dari rumah Budi ke sekolah kira-kira 800 mm.'),
              ],
              answer: [0, 1],
              explain: L(
                'A ruler of 30 cm and a glass of 200 ml are both normal. A chicken weighs about 2 kg, not 2 g, and 800 mm is less than 1 m, much too short for the way to school.',
                'Penggaris 30 cm dan segelas air 200 ml sama-sama wajar. Seekor ayam beratnya sekitar 2 kg, bukan 2 g, dan 800 mm kurang dari 1 m, terlalu pendek untuk jarak ke sekolah.',
              ),
              hint: L(
                'For each one, ask: is the number sensible AND is the unit sensible?',
                'Untuk tiap pernyataan, tanyakan: apakah bilangannya masuk akal DAN satuannya masuk akal?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani lays a 30 cm ruler end to end along the whiteboard. It fits 6 times. About how many meters long is the whiteboard?',
                'Ani meletakkan penggaris 30 cm berurutan di sepanjang papan tulis. Penggaris itu muat 6 kali. Kira-kira berapa meter panjang papan tulis itu?',
              ),
              blanks: [{ answer: 1.8, after: '\\text{ m}' }],
              hints: [
                L(
                  'First find the whole length in centimeters. How many rulers fit?',
                  'Cari dulu panjang seluruhnya dalam sentimeter. Berapa penggaris yang muat?',
                ),
                L(
                  'Multiply the number of rulers by 30 cm. The question wants meters, so change cm into m.',
                  'Kalikan banyak penggaris dengan 30 cm. Soal meminta meter, jadi ubah cm menjadi m.',
                ),
                L(
                  '$6\\times30=180$ cm. 100 cm make 1 m, so divide 180 by 100.',
                  '$6\\times30=180$ cm. 100 cm sama dengan 1 m, jadi bagi 180 dengan 100.',
                ),
              ],
              explain: L(
                '$6\\times30=180$ cm, and $180\\div100=1.8$, so the whiteboard is about 1.8 m long.',
                '$6\\times30=180$ cm, dan $180\\div100=1{,}8$, jadi papan tulis itu kira-kira panjangnya 1,8 m.',
              ),
              solution: {
                en: ['6 \\times 30 = 180 \\text{ cm}', '100 \\text{ cm} = 1 \\text{ m}', '180 \\div 100 = 1.8'],
                id: ['6 \\times 30 = 180 \\text{ cm}', '100 \\text{ cm} = 1 \\text{ m}', '180 \\div 100 = 1{,}8'],
              },
            },
          ],
        },
        /* ---------------------------------------------- S2 L2 estimating a calculation */
        {
          id: 'tka-m7-s2-l2',
          title: L('Estimating the Result of a Calculation', 'Menaksir Hasil Hitung'),
          goal: L(
            'You can round numbers first to estimate a sum, a difference or a product, and check whether an answer is reasonable.',
            'Kamu bisa membulatkan bilangan dulu untuk menaksir hasil tambah, kurang, atau kali, dan memeriksa apakah suatu jawaban masuk akal.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Round First', 'Ayo Amati: Bulatkan Dulu'),
              body: L(
                'Budi has 498 stickers and his sister has 303. About how many do they have together? You do not need the exact number. 498 is almost 500 and 303 is almost 300, so they have about $500+300=800$.\n\nThis quick answer is called an **estimate**. We write it with the sign $\\approx$, which means "is about equal to".\n\nYou learned rounding in the first module. To **round** a number, look at the digit just to the right of the place you round to. If it is 5 or more, round up. If it is less than 5, keep the digit.',
                'Budi punya 498 stiker dan kakaknya punya 303. Kira-kira berapa jumlah stiker mereka? Kamu tidak perlu angka yang tepat. 498 hampir 500 dan 303 hampir 300, jadi jumlahnya kira-kira $500+300=800$.\n\nJawaban cepat ini disebut **taksiran**. Kita menulisnya dengan tanda $\\approx$, yang berarti "kira-kira sama dengan".\n\nKamu sudah belajar pembulatan di modul pertama. Untuk **membulatkan** bilangan, lihat angka tepat di sebelah kanan tempat yang dibulatkan. Jika angkanya 5 atau lebih, bulatkan ke atas. Jika kurang dari 5, angkanya tetap.',
              ),
              figure: {
                ...numberLine({ from: 300, to: 500, step: 50, marks: [{ at: 303, label: '303' }, { at: 498, label: '498' }] }),
                caption: L('303 sits next to 300 and 498 sits next to 500.', '303 berada di dekat 300 dan 498 berada di dekat 500.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Round, Then Calculate', 'Contoh Bertahap: Bulatkan, Lalu Hitung'),
              body: L(
                'Ani has Rp30,000. She wants a book for Rp19,800 and a pencil case for Rp8,400. Does she have enough money?\n\n1. Step 1: Decide how to round. Ani wants to be SURE she has enough, so we round each price UP to the next thousand.\n2. Step 2: Round each price up. Rp19,800 becomes Rp20,000. Rp8,400 becomes Rp9,000.\n3. Step 3: Add: $20\\,000+9\\,000=29\\,000$.\n4. Step 4: Compare: Rp29,000 is less than Rp30,000. The real total is even smaller, so Ani surely has enough money.\n\n**Remember:**\n\n- Round first, then add, subtract or multiply.\n- To round to the nearest thousand: 5 hundreds or more, round up; less than 5, keep.\n- To be sure there is enough money, round the prices UP.\n- For a product, round both numbers: $49\\times21\\approx50\\times20=1\\,000$.',
                'Ani punya Rp30.000. Ia ingin membeli buku seharga Rp19.800 dan kotak pensil seharga Rp8.400. Cukupkah uangnya?\n\n1. Langkah 1: Tentukan cara membulatkan. Ani ingin YAKIN uangnya cukup, jadi kita membulatkan tiap harga KE ATAS ke ribuan berikutnya.\n2. Langkah 2: Bulatkan tiap harga ke atas. Rp19.800 menjadi Rp20.000. Rp8.400 menjadi Rp9.000.\n3. Langkah 3: Jumlahkan: $20\\,000+9\\,000=29\\,000$.\n4. Langkah 4: Bandingkan: Rp29.000 kurang dari Rp30.000. Jumlah sebenarnya malah lebih kecil, jadi uang Ani pasti cukup.\n\n**Ingat:**\n\n- Bulatkan dulu, lalu jumlahkan, kurangkan, atau kalikan.\n- Membulatkan ke ribuan terdekat: 5 ratusan atau lebih, bulatkan ke atas; kurang dari 5, tetap.\n- Agar yakin uangnya cukup, bulatkan harga ke atas.\n- Untuk perkalian, bulatkan kedua bilangan: $49\\times21\\approx50\\times20=1\\,000$.',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 30000,
                  step: 5000,
                  marks: [{ at: 30000, label: '30000', color: 'a' }],
                  jumps: [{ from: 0, to: 20000, label: '20000' }, { from: 20000, to: 29000, label: '9000' }],
                }),
                caption: L(
                  'On a number line, 20,000 and then 9,000 more reach 29,000, which is still below 30,000.',
                  'Pada garis bilangan, 20.000 lalu 9.000 lagi sampai 29.000, yang masih di bawah 30.000.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Rounding the Wrong Way', 'Awas, Jebakan!: Membulatkan ke Arah yang Salah'),
              body: L(
                'Watch out for these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $498\\approx400$ (looked at the hundreds digit, not the tens digit) | $498\\approx500$ (the tens digit 9 is 5 or more, so round up) |\n| ❌ $49\\times21\\approx50\\times30$ (21 was rounded to the wrong ten) | $49\\times21\\approx50\\times20$ (the ones digit 1 is less than 5, so keep 20) |\n| ❌ To be sure there is enough money, round the prices down | Round the prices up: the real total can only be smaller |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $498\\approx400$ (melihat angka ratusan, bukan angka puluhan) | $498\\approx500$ (angka puluhan 9 adalah 5 atau lebih, jadi dibulatkan ke atas) |\n| ❌ $49\\times21\\approx50\\times30$ (21 dibulatkan ke puluhan yang salah) | $49\\times21\\approx50\\times20$ (angka satuan 1 kurang dari 5, jadi tetap 20) |\n| ❌ Agar yakin uangnya cukup, bulatkan harga ke bawah | Bulatkan harga ke atas: jumlah sebenarnya hanya bisa lebih kecil |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Round each number to the nearest hundred. What is the best estimate of $598+203$?',
                'Bulatkan tiap bilangan ke ratusan terdekat. Berapa taksiran terbaik untuk $598+203$?',
              ),
              figure: {
                ...numberLine({ from: 0, to: 700, step: 100, marks: [{ at: 203, label: '203' }, { at: 598, label: '598' }] }),
                caption: L('Where 203 and 598 sit among the hundreds.', 'Letak 203 dan 598 di antara bilangan ratusan.'),
              },
              options: [
                L('$800$', '$800$'),
                L('$700$', '$700$'),
                L('$900$', '$900$'),
                L('$600$', '$600$'),
              ],
              answer: 0,
              explain: L(
                '598 rounds to 600 and 203 rounds to 200, so $600+200=800$. The answer 700 rounds 598 down to 500, 900 rounds 203 up to 300, and 600 forgets the second number.',
                '598 dibulatkan menjadi 600 dan 203 menjadi 200, jadi $600+200=800$. Jawaban 700 membulatkan 598 ke bawah menjadi 500, 900 membulatkan 203 ke atas menjadi 300, dan 600 melupakan bilangan kedua.',
              ),
              hint: L(
                'Which hundred is each number closest to? Look at the tens digit to decide.',
                'Bilangan ratusan mana yang paling dekat dengan tiap bilangan? Lihat angka puluhannya untuk memutuskan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: estimate $698-302$. Round each number to the nearest hundred.',
                'Coba bersama: taksirlah $698-302$. Bulatkan tiap bilangan ke ratusan terdekat.',
              ),
              template: '698 \\approx ___ \\quad 302 \\approx ___ \\quad \\text{so } 698 - 302 \\approx 400',
              blanks: ['700', '300'],
              explain: L(
                '698 is close to 700 and 302 is close to 300, so $700-300=400$. The exact answer is 396, which is very close.',
                '698 dekat dengan 700 dan 302 dekat dengan 300, jadi $700-300=400$. Jawaban tepatnya 396, yang sangat dekat.',
              ),
              hint: L(
                'Look at the tens digit of each number: is it 5 or more, or less than 5?',
                'Lihat angka puluhan tiap bilangan: apakah 5 atau lebih, atau kurang dari 5?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Ani calculated $3\\times49$ and wrote 247. She checks it with an estimate. Which sentence is right?',
                'Ani menghitung $3\\times49$ dan menulis 247. Ia memeriksanya dengan taksiran. Kalimat mana yang benar?',
              ),
              figure: {
                ...numberLine({ from: 0, to: 300, step: 50, marks: [{ at: 247, label: 'Ani' }], jumps: [{ from: 0, to: 150, label: '3 × 50' }] }),
                caption: L('The estimate 3 × 50 = 150 and Ani\'s answer on one number line.', 'Taksiran 3 × 50 = 150 dan jawaban Ani pada satu garis bilangan.'),
              },
              options: [
                L('Not reasonable: $3\\times50=150$, and 247 is much bigger than 150.', 'Tidak masuk akal: $3\\times50=150$, dan 247 jauh lebih besar daripada 150.'),
                L('Reasonable, because 247 is close to 250.', 'Masuk akal, karena 247 dekat dengan 250.'),
                L('Reasonable, because $3\\times49$ must be bigger than 200.', 'Masuk akal, karena $3\\times49$ pasti lebih besar daripada 200.'),
                L('Not reasonable, because the answer should be about 300.', 'Tidak masuk akal, karena jawabannya seharusnya sekitar 300.'),
              ],
              answer: 0,
              explain: L(
                '49 is about 50, so $3\\times49$ is about 150. Ani\'s 247 is far from that, so she made a mistake (the exact answer is 147). Being close to 250 does not matter, and 49 is not about 100.',
                '49 sekitar 50, jadi $3\\times49$ sekitar 150. Jawaban Ani, 247, jauh dari itu, jadi ia membuat kesalahan (jawaban tepatnya 147). Dekat dengan 250 tidak penting, dan 49 bukan sekitar 100.',
              ),
              hint: L(
                'Round 49 to the nearest ten, multiply by 3, and see whether the answer lands near 247.',
                'Bulatkan 49 ke puluhan terdekat, kalikan dengan 3, lalu lihat apakah hasilnya dekat dengan 247.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each estimate is reasonable (True) or not (False).', 'Tentukan apakah setiap taksiran masuk akal (Benar) atau tidak (Salah).'),
              statements: [
                L('$398+502$ is about $900$.', '$398+502$ kira-kira $900$.'),
                L('$612-389$ is about $400$.', '$612-389$ kira-kira $400$.'),
                L('$21\\times49$ is about $1\\,000$.', '$21\\times49$ kira-kira $1.000$.'),
                L('$5\\,020+4\\,980$ is about $9\\,000$.', '$5.020+4.980$ kira-kira $9.000$.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$400+500=900$ and $20\\times50=1\\,000$ are right. $612-389$ is about $600-400=200$, not 400. And $5\\,020+4\\,980$ is about $5\\,000+5\\,000=10\\,000$, not 9,000.',
                '$400+500=900$ dan $20\\times50=1.000$ sudah benar. $612-389$ kira-kira $600-400=200$, bukan 400. Dan $5.020+4.980$ kira-kira $5.000+5.000=10.000$, bukan 9.000.',
              ),
              hint: L(
                'Round the numbers in each statement and do the quick calculation yourself.',
                'Bulatkan bilangan pada tiap pernyataan lalu hitung cepat sendiri.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Mrs. Rina has Rp30,000. She buys a shirt for Rp11,800, a hat for Rp9,700 and a belt for Rp7,600. She wants to be SURE she has enough money. Choose the TWO correct statements.',
                'Ibu punya Rp30.000. Ia membeli baju seharga Rp11.800, topi seharga Rp9.700, dan ikat pinggang seharga Rp7.600. Ia ingin YAKIN uangnya cukup. Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('Rounding each price up to the next thousand gives $12\\,000+10\\,000+8\\,000=30\\,000$.', 'Membulatkan tiap harga ke atas ke ribuan berikutnya memberi $12.000+10.000+8.000=30.000$.'),
                L('The rounded-up total is not more than Rp30,000, so the money is certainly enough.', 'Jumlah hasil pembulatan ke atas tidak lebih dari Rp30.000, jadi uangnya pasti cukup.'),
                L('Rounding each price down gives $27\\,000$, so the money is certainly enough.', 'Membulatkan tiap harga ke bawah memberi $27.000$, jadi uangnya pasti cukup.'),
                L('The estimate of the total is Rp33,000.', 'Taksiran jumlahnya adalah Rp33.000.'),
              ],
              answer: [0, 1],
              explain: L(
                'Rounding every price UP gives Rp30,000, and the real total can only be smaller (it is Rp29,100), so the money is enough. Rounding DOWN can make the total too small, so it cannot prove anything.',
                'Membulatkan setiap harga KE ATAS memberi Rp30.000, dan jumlah sebenarnya hanya bisa lebih kecil (yaitu Rp29.100), jadi uangnya cukup. Membulatkan KE BAWAH bisa membuat jumlahnya terlalu kecil, jadi tidak membuktikan apa-apa.',
              ),
              hint: L(
                'To be sure there is enough money, should the estimate be a little too big or a little too small?',
                'Agar yakin uangnya cukup, sebaiknya taksirannya sedikit terlalu besar atau sedikit terlalu kecil?',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for estimating $498+303$ in order.', 'Urutkan langkah menaksir $498+303$.'),
              lines: {
                en: ['\\text{round to the nearest hundred}', '498 \\approx 500 \\quad 303 \\approx 300', '500 + 300 = 800', '498 + 303 \\approx 800'],
                id: ['\\text{bulatkan ke ratusan terdekat}', '498 \\approx 500 \\quad 303 \\approx 300', '500 + 300 = 800', '498 + 303 \\approx 800'],
              },
              explain: L(
                'First choose how to round, then round the numbers, then calculate with the rounded numbers, and last write the estimate with the sign for "about".',
                'Pertama pilih cara membulatkan, lalu bulatkan bilangannya, lalu hitung dengan bilangan yang sudah dibulatkan, dan terakhir tulis taksirannya dengan tanda "kira-kira".',
              ),
              hint: L(
                'You cannot add the rounded numbers before you have rounded them.',
                'Kamu tidak bisa menjumlahkan bilangan bulat sebelum membulatkannya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A bus carries 39 passengers and each pays Rp4,900. Round the number of passengers to the nearest ten and the fare to the nearest thousand, then multiply. What is the estimate of the money collected?',
                'Sebuah bus membawa 39 penumpang dan tiap penumpang membayar Rp4.900. Bulatkan banyak penumpang ke puluhan terdekat dan ongkos ke ribuan terdekat, lalu kalikan. Berapa taksiran uang yang terkumpul?',
              ),
              blanks: [{ label: '\\text{Rp}', answer: 200000, tol: 0.5 }],
              hints: [
                L(
                  'Round each number first. Which ten is 39 closest to, and which thousand is 4,900 closest to?',
                  'Bulatkan tiap bilangan dulu. Puluhan mana yang paling dekat dengan 39, dan ribuan mana yang paling dekat dengan 4.900?',
                ),
                L(
                  'Replace the numbers by the rounded ones and multiply them.',
                  'Ganti bilangannya dengan yang sudah dibulatkan lalu kalikan.',
                ),
                L(
                  '39 is about 40 and 4,900 is about 5,000. Multiply 4 by 5, then put the zeros back.',
                  '39 sekitar 40 dan 4.900 sekitar 5.000. Kalikan 4 dengan 5, lalu kembalikan nol-nolnya.',
                ),
              ],
              explain: L(
                '$40\\times5\\,000=200\\,000$. The exact total is $39\\times4\\,900=191\\,100$, so the estimate is close.',
                '$40\\times5\\,000=200\\,000$. Jumlah tepatnya adalah $39\\times4\\,900=191\\,100$, jadi taksirannya dekat.',
              ),
              solution: ['39 \\approx 40 \\quad 4\\,900 \\approx 5\\,000', '40 \\times 5\\,000 = 200\\,000'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m7-s2-p',
        runtime: 'math',
        title: L('Estimating Like a Smart Shopper', 'Menaksir Seperti Pembeli yang Cerdas'),
        brief: L(
          'Use reference objects and rounding to estimate quickly, and decide when you can be sure.',
          'Pakai benda patokan dan pembulatan untuk menaksir dengan cepat, lalu tentukan kapan kamu bisa yakin.',
        ),
        requirements: [
          L('Estimate a size with a reference object and a sensible unit.', 'Menaksir ukuran dengan benda patokan dan satuan yang masuk akal.'),
          L('Round first to estimate a sum or a product, and round up to be safe.', 'Membulatkan dulu untuk menaksir hasil tambah atau kali, dan membulatkan ke atas agar aman.'),
        ],
        hints: [
          L('Say how you will round before you start: to the ten, hundred or thousand?', 'Katakan dulu cara membulatkanmu sebelum mulai: ke puluhan, ratusan, atau ribuan?'),
          L('Look at the digit to the right of the place you round to: 5 or more goes up.', 'Lihat angka di sebelah kanan tempat yang dibulatkan: 5 atau lebih naik.'),
          L('To be sure you have enough money, round the prices up.', 'Agar yakin uangmu cukup, bulatkan harga ke atas.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Round each number to the nearest hundred, then add: $396+704$.',
              'Bulatkan tiap bilangan ke ratusan terdekat, lalu jumlahkan: $396+704$.',
            ),
            blanks: [{ answer: 1100, tol: 0.5 }],
            solution: ['396 \\approx 400 \\quad 704 \\approx 700', '400 + 700 = 1\\,100'],
          },
          {
            prompt: L(
              'One mango weighs about 300 g. Mrs. Rina buys 9 mangoes. About how many kilograms is that?',
              'Satu mangga beratnya sekitar 300 g. Ibu membeli 9 mangga. Kira-kira berapa kilogram beratnya?',
            ),
            blanks: [{ answer: 2.7, after: '\\text{ kg}' }],
            solution: {
              en: ['9 \\times 300 = 2\\,700 \\text{ g}', '1\\,000 \\text{ g} = 1 \\text{ kg}', '2\\,700 \\div 1\\,000 = 2.7'],
              id: ['9 \\times 300 = 2\\,700 \\text{ g}', '1\\,000 \\text{ g} = 1 \\text{ kg}', '2\\,700 \\div 1\\,000 = 2{,}7'],
            },
          },
          {
            prompt: L(
              'Eko buys 3 books at Rp7,900 each and 2 pencils at Rp2,100 each. Round each price to the nearest thousand, then estimate the total.',
              'Eko membeli 3 buku seharga Rp7.900 per buah dan 2 pensil seharga Rp2.100 per buah. Bulatkan tiap harga ke ribuan terdekat, lalu taksir jumlahnya.',
            ),
            blanks: [{ label: '\\text{Rp}', answer: 28000, tol: 0.5 }],
            solution: ['7\\,900 \\approx 8\\,000 \\quad 2\\,100 \\approx 2\\,000', '3 \\times 8\\,000 = 24\\,000 \\quad 2 \\times 2\\,000 = 4\\,000', '24\\,000 + 4\\,000 = 28\\,000'],
          },
          {
            prompt: L(
              'Mrs. Rina has Rp50,000. She buys four things costing Rp14,800, Rp9,300, Rp12,600 and Rp11,900. Round each price UP to the next thousand and add them. Then type 1 if she is sure to have enough money, or 2 if she cannot be sure.',
              'Ibu punya Rp50.000. Ia membeli empat barang seharga Rp14.800, Rp9.300, Rp12.600, dan Rp11.900. Bulatkan tiap harga KE ATAS ke ribuan berikutnya lalu jumlahkan. Kemudian ketik 1 jika ia pasti cukup uangnya, atau 2 jika ia tidak bisa yakin.',
            ),
            blanks: [
              { label: { en: '\\text{rounded-up total: Rp}', id: '\\text{jumlah pembulatan ke atas: Rp}' }, answer: 50000, tol: 0.5 },
              { label: { en: '\\text{enough money?} =', id: '\\text{uang cukup?} =' }, answer: 1 },
            ],
            solution: {
              en: ['15\\,000 + 10\\,000 + 13\\,000 + 12\\,000 = 50\\,000', '50\\,000 \\leq 50\\,000 \\Rightarrow \\text{the real total is not more: } 1'],
              id: ['15\\,000 + 10\\,000 + 13\\,000 + 12\\,000 = 50\\,000', '50\\,000 \\leq 50\\,000 \\Rightarrow \\text{jumlah sebenarnya tidak lebih: } 1'],
            },
          },
        ],
      },
    },
  ],
}
