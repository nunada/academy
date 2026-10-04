import type { Loc, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import { fit, line, numberLine, rectPts, solid, txt } from './figs'

/** Module 2 — prime factorisation with GCF/LCM, estimating a result, ratio, scale and
 *  proportion, direct and inverse proportion, and rate. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

type TNode = { v: number; k?: [TNode, TNode] }
const lf = (v: number): TNode => ({ v })
const nd = (v: number, a: TNode, b: TNode): TNode => ({ v, k: [a, b] })

const TREE_GAP = 1.6
const TREE_STEP = 1.7

/** One factor tree with its leftmost leaf at `x0`. Leaves (the primes) are green, the rest grey. */
function drawTree(root: TNode, x0: number, label?: string): { items: FigItem[]; pts: Pt[]; width: number } {
  const items: FigItem[] = []
  const pts: Pt[] = []
  let next = x0
  let deepest = 0
  const lay = (n: TNode, d: number): Pt => {
    deepest = Math.max(deepest, d)
    const y = -d * TREE_STEP
    let x: number
    if (!n.k) {
      x = next
      next += TREE_GAP
    } else {
      const a = lay(n.k[0], d + 1)
      const b = lay(n.k[1], d + 1)
      x = (a[0] + b[0]) / 2
      items.push(line([x, y - 0.42], [a[0], a[1] + 0.42], 'muted', { width: 2 }))
      items.push(line([x, y - 0.42], [b[0], b[1] + 0.42], 'muted', { width: 2 }))
    }
    items.push(txt(x, y, String(n.v), 'lg', n.k ? 'muted' : 'a'))
    pts.push([x, y])
    return [x, y]
  }
  const top = lay(root, 0)
  const width = next - TREE_GAP - x0
  if (label) {
    const y = -deepest * TREE_STEP - 1.4
    items.push(txt(x0 + width / 2, y, label, 'lg', 'result'))
    pts.push([x0 + width / 2, y])
  }
  pts.push([top[0], top[1] + 0.5])
  return { items, pts, width }
}

/** Factor trees side by side; `label` is written under each tree. */
function factorTrees(trees: { root: TNode; label?: string }[]): Piece {
  const items: FigItem[] = []
  const pts: Pt[] = []
  let x = 0
  for (const t of trees) {
    const d = drawTree(t.root, x, t.label)
    items.push(...d.items)
    pts.push(...d.pts)
    x += d.width + 3.2
  }
  return { dim: 2, axes: false, ...fit(pts, 0.9), items }
}

const BLOCK = 1.5
const BLOCK_GAP = 0.1

/** Rows of equal blocks, one row per quantity — a ratio drawn as a bar model. `each` is written in
 *  every block; `label` names the row. */
function ratioBars(rows: { n: number; color: FigColor; label?: string }[], o: { each?: string } = {}): Piece {
  const items: FigItem[] = []
  const most = Math.max(...rows.map((r) => r.n))
  rows.forEach((r, i) => {
    const y = (rows.length - 1 - i) * 1.5
    for (let k = 0; k < r.n; k++) {
      items.push(solid(rectPts(k * (BLOCK + BLOCK_GAP), y, BLOCK, 1), r.color))
      if (o.each) items.push(txt(k * (BLOCK + BLOCK_GAP) + BLOCK / 2, y + 0.5, o.each, 'md', 'muted'))
    }
    if (r.label) items.push(txt(-0.3, y + 0.5, r.label, 'lg', 'muted', 'end'))
  })
  const left = rows.some((r) => r.label) ? -2.8 : 0
  const w = most * (BLOCK + BLOCK_GAP)
  return { dim: 2, axes: false, ...fit([[left, -0.2], [w, (rows.length - 1) * 1.5 + 1.2]], 0.5), items }
}

/** One bar cut into the parts of a ratio, with a bracket over the whole carrying `total`. */
function sharedBar(parts: { n: number; color: FigColor }[], total: string, o: { each?: string } = {}): Piece {
  const items: FigItem[] = []
  let k = 0
  for (const p of parts) {
    for (let j = 0; j < p.n; j++, k++) {
      items.push(solid(rectPts(k * (BLOCK + BLOCK_GAP), 0, BLOCK, 1), p.color))
      if (o.each) items.push(txt(k * (BLOCK + BLOCK_GAP) + BLOCK / 2, 0.5, o.each, 'md', 'muted'))
    }
  }
  const w = k * (BLOCK + BLOCK_GAP) - BLOCK_GAP
  items.push(line([0, 1.5], [w, 1.5], 'result', { width: 3 }))
  items.push(line([0, 1.3], [0, 1.7], 'result', { width: 3 }))
  items.push(line([w, 1.3], [w, 1.7], 'result', { width: 3 }))
  items.push(txt(w / 2, 2.15, total, 'lg', 'result'))
  return { dim: 2, axes: false, ...fit([[0, -0.2], [w, 2.6]], 0.5), items }
}

/* -------------------------------------------------------------- module */

export const module2: Module = {
  id: 'tka-smp-m2',
  title: L('Factorisation, Estimation, Ratio and Rate', 'Faktorisasi, Estimasi, Perbandingan, dan Laju'),
  summary: L(
    'Break numbers into primes to find the GCF and the LCM, estimate the result of a calculation and judge whether an answer is reasonable, then compare quantities with ratios, scales, direct and inverse proportion, and rates such as speed.',
    'Menguraikan bilangan menjadi faktor prima untuk mencari FPB dan KPK, memperkirakan hasil perhitungan dan menilai apakah suatu jawaban masuk akal, lalu membandingkan besaran dengan perbandingan, skala, perbandingan senilai dan berbalik nilai, serta laju seperti kecepatan.',
  ),
  submodules: [
    /* ============================================ S1: primes and estimation */
    {
      id: 'tka-smp-m2-s1',
      title: L('Prime Factorisation and Estimation', 'Faktorisasi Prima dan Estimasi'),
      summary: L(
        'Write a number as a product of primes and use it for the GCF, the LCM and perfect squares and cubes; estimate the result of a calculation and decide whether an answer is reasonable.',
        'Menulis bilangan sebagai hasil kali bilangan prima dan memakainya untuk FPB, KPK, serta kuadrat dan kubik sempurna; memperkirakan hasil perhitungan dan menilai apakah suatu jawaban masuk akal.',
      ),
      lessons: [
        /* ------------------------------------------------ S1 L1 primes, GCF, LCM */
        {
          id: 'tka-smp-m2-s1-l1',
          title: L('Prime Factorisation, GCF and LCM', 'Faktorisasi Prima, FPB, dan KPK'),
          goal: L(
            'You can write a number as a product of primes and use it to find the GCF and the LCM, to test for perfect squares and cubes, and to solve problems about equal groups and repeating schedules.',
            'Kamu bisa menulis bilangan sebagai hasil kali bilangan prima dan memakainya untuk mencari FPB dan KPK, menguji kuadrat dan kubik sempurna, serta menyelesaikan soal kelompok sama banyak dan jadwal berulang.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Prime Factorisation and Factor Trees', 'Ayo Amati: Faktorisasi Prima dan Pohon Faktor'),
              body: L(
                'Every natural number bigger than 1 is either a prime or a product of primes. A **factor tree** shows how: split the number into two factors, then split those again, until every branch ends in a prime.\n\n- **Prime number**: a number with exactly two factors, 1 and itself (2, 3, 5, 7, 11, 13, ...).\n- **Prime factorisation**: the number written as a product of primes only.\n- **Exponent**: how many times a prime is repeated, for example $2 \\times 2 \\times 2 = 2^3$.\n\nLook at the tree of 72. The green numbers at the ends of the branches are primes, so $72 = 2 \\times 2 \\times 2 \\times 3 \\times 3 = 2^3 \\times 3^2$.\n\nYou can start the tree with any pair of factors, for example $72 = 6 \\times 12$. The primes at the end are always the same.',
                'Setiap bilangan asli yang lebih besar dari 1 adalah bilangan prima atau hasil kali bilangan prima. **Pohon faktor** menunjukkan caranya: pecah bilangan menjadi dua faktor, lalu pecah lagi faktor-faktor itu, sampai setiap cabang berakhir di bilangan prima.\n\n- **Bilangan prima**: bilangan yang punya tepat dua faktor, yaitu 1 dan dirinya sendiri (2, 3, 5, 7, 11, 13, ...).\n- **Faktorisasi prima**: bilangan yang ditulis sebagai hasil kali bilangan prima saja.\n- **Eksponen (pangkat)**: berapa kali suatu bilangan prima diulang, misalnya $2 \\times 2 \\times 2 = 2^3$.\n\nLihat pohon faktor 72. Bilangan hijau di ujung cabang adalah bilangan prima, jadi $72 = 2 \\times 2 \\times 2 \\times 3 \\times 3 = 2^3 \\times 3^2$.\n\nKamu boleh memulai pohon dengan pasangan faktor apa saja, misalnya $72 = 6 \\times 12$. Bilangan prima di ujungnya selalu sama.',
              ),
              figure: {
                ...factorTrees([{ root: nd(72, nd(8, lf(2), nd(4, lf(2), lf(2))), nd(9, lf(3), lf(3))), label: '72 = 2³ × 3²' }]),
                caption: L(
                  'A factor tree of 72. The green numbers at the ends are the primes.',
                  'Pohon faktor 72. Bilangan hijau di ujung cabang adalah bilangan prima.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: GCF and LCM from Prime Factors', 'Contoh Bertahap: FPB dan KPK dari Faktor Prima'),
              body: L(
                'Find the GCF and the LCM of 72 and 60.\n\n1. Step 1: Factorise both numbers: $72 = 2^3 \\times 3^2$ and $60 = 2^2 \\times 3 \\times 5$.\n2. Step 2: For the GCF, take only the primes that BOTH numbers have (2 and 3), each with its LOWEST exponent: $2^2 \\times 3^1$.\n3. Step 3: Multiply: GCF $= 4 \\times 3 = 12$.\n4. Step 4: For the LCM, take EVERY prime that appears (2, 3 and 5), each with its HIGHEST exponent: $2^3 \\times 3^2 \\times 5$.\n5. Step 5: Multiply: LCM $= 8 \\times 9 \\times 5 = 360$.\n\n**Remember:**\n\n- GCF: common primes, lowest exponents. LCM: all primes, highest exponents.\n- Check: GCF $\\times$ LCM = the two numbers multiplied: $12 \\times 360 = 4\\,320 = 72 \\times 60$.\n- A number is a **perfect square** when every exponent in its prime factorisation is even, and a **perfect cube** when every exponent is a multiple of 3.',
                'Cari FPB dan KPK dari 72 dan 60.\n\n1. Langkah 1: Faktorkan kedua bilangan: $72 = 2^3 \\times 3^2$ dan $60 = 2^2 \\times 3 \\times 5$.\n2. Langkah 2: Untuk FPB, ambil hanya bilangan prima yang dimiliki KEDUA bilangan (2 dan 3), masing-masing dengan eksponen TERKECIL: $2^2 \\times 3^1$.\n3. Langkah 3: Kalikan: FPB $= 4 \\times 3 = 12$.\n4. Langkah 4: Untuk KPK, ambil SEMUA bilangan prima yang muncul (2, 3, dan 5), masing-masing dengan eksponen TERBESAR: $2^3 \\times 3^2 \\times 5$.\n5. Langkah 5: Kalikan: KPK $= 8 \\times 9 \\times 5 = 360$.\n\n**Ingat:**\n\n- FPB: prima yang sama-sama ada, eksponen terkecil. KPK: semua prima, eksponen terbesar.\n- Periksa: FPB $\\times$ KPK = kedua bilangan dikalikan: $12 \\times 360 = 4\\,320 = 72 \\times 60$.\n- Bilangan disebut **kuadrat sempurna** jika semua eksponen pada faktorisasi primanya genap, dan **kubik sempurna** jika semua eksponennya kelipatan 3.',
              ),
              figure: {
                ...factorTrees([
                  { root: nd(72, nd(8, lf(2), nd(4, lf(2), lf(2))), nd(9, lf(3), lf(3))), label: '2³ × 3²' },
                  { root: nd(60, nd(6, lf(2), lf(3)), nd(10, lf(2), lf(5))), label: '2² × 3 × 5' },
                ]),
                caption: L(
                  'The prime factor trees of 72 (left) and 60 (right). The green numbers are the primes.',
                  'Pohon faktor prima 72 (kiri) dan 60 (kanan). Bilangan hijau adalah bilangan prima.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Traps with Primes, GCF and LCM', 'Awas, Jebakan!: Jebakan pada Bilangan Prima, FPB, dan KPK'),
              body: L(
                'Check yourself against these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| 1 is a prime number | 1 has only one factor, so it is not prime. And 2 IS prime: it is the only even prime |\n| $36 = 6 \\times 6$ is the prime factorisation | 6 is not prime. Split it: $36 = 2^2 \\times 3^2$ |\n| The GCF of 12 and 18 is $2^2 \\times 3^2 = 36$ (highest exponents) | The GCF takes the LOWEST exponents: $2 \\times 3 = 6$. The highest exponents give the LCM, 36 |',
                'Periksa dirimu dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| 1 adalah bilangan prima | 1 hanya punya satu faktor, jadi bukan prima. Dan 2 ADALAH prima: satu-satunya prima yang genap |\n| $36 = 6 \\times 6$ adalah faktorisasi prima | 6 bukan prima. Pecah lagi: $36 = 2^2 \\times 3^2$ |\n| FPB dari 12 dan 18 adalah $2^2 \\times 3^2 = 36$ (eksponen terbesar) | FPB mengambil eksponen TERKECIL: $2 \\times 3 = 6$. Eksponen terbesar memberi KPK, yaitu 36 |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The factor tree of 84 is finished. Which is the prime factorisation of 84?',
                'Pohon faktor 84 sudah selesai. Manakah faktorisasi prima dari 84?',
              ),
              figure: {
                ...factorTrees([{ root: nd(84, nd(4, lf(2), lf(2)), nd(21, lf(3), lf(7))) }]),
                caption: L(
                  'The factor tree of 84. The green numbers are primes.',
                  'Pohon faktor 84. Bilangan hijau adalah bilangan prima.',
                ),
              },
              options: [
                L('$2^2 \\times 3 \\times 7$', '$2^2 \\times 3 \\times 7$'),
                L('$4 \\times 3 \\times 7$', '$4 \\times 3 \\times 7$'),
                L('$2 \\times 3 \\times 14$', '$2 \\times 3 \\times 14$'),
                L('$2^2 \\times 21$', '$2^2 \\times 21$'),
              ],
              answer: 0,
              explain: L(
                'Follow every branch down to the green primes: 2, 2, 3 and 7. The two 2s are written $2^2$. The other options still contain 4, 14 or 21, and those can be split further, so they are not prime.',
                'Ikuti setiap cabang sampai ke bilangan prima hijau: 2, 2, 3, dan 7. Dua bilangan 2 ditulis $2^2$. Pilihan lain masih memuat 4, 14, atau 21, dan bilangan itu masih bisa dipecah, jadi bukan prima.',
              ),
              hint: L(
                'A prime factorisation may contain only primes. Which options still have a number that can be split into smaller factors?',
                'Faktorisasi prima hanya boleh memuat bilangan prima. Pilihan mana yang masih memuat bilangan yang bisa dipecah menjadi faktor lebih kecil?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find the GCF and the LCM of 24 and 36. First, $24 = 2^3 \\times 3$ and $36 = 2^2 \\times 3^2$. Lowest exponents give the GCF, highest exponents give the LCM.',
                'Coba bersama: cari FPB dan KPK dari 24 dan 36. Pertama, $24 = 2^3 \\times 3$ dan $36 = 2^2 \\times 3^2$. Eksponen terkecil memberi FPB, eksponen terbesar memberi KPK.',
              ),
              template: {
                en: '\\text{GCF} = 2^2 \\times 3 = ___ \\quad \\text{LCM} = 2^3 \\times 3^2 = ___',
                id: '\\text{FPB} = 2^2 \\times 3 = ___ \\quad \\text{KPK} = 2^3 \\times 3^2 = ___',
              },
              blanks: ['12', '72'],
              explain: L(
                '$2^2 \\times 3 = 4 \\times 3 = 12$ and $2^3 \\times 3^2 = 8 \\times 9 = 72$. Check: $12 \\times 72 = 864 = 24 \\times 36$.',
                '$2^2 \\times 3 = 4 \\times 3 = 12$ dan $2^3 \\times 3^2 = 8 \\times 9 = 72$. Periksa: $12 \\times 72 = 864 = 24 \\times 36$.',
              ),
              hint: L(
                'Work out each power first ($2^2 = 4$, $3^2 = 9$, ...), then multiply the results.',
                'Hitung tiap pangkat dulu ($2^2 = 4$, $3^2 = 9$, ...), lalu kalikan hasilnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Two buses leave the terminal together at 06.00. Bus A leaves every 12 minutes and bus B leaves every 18 minutes. The line shows the minutes after 06.00: green dots are departures of bus A, orange dots are departures of bus B, and red dots are departures of both. When do the two buses next leave together?',
                'Dua bus berangkat bersama dari terminal pukul 06.00. Bus A berangkat setiap 12 menit dan bus B setiap 18 menit. Garis menunjukkan menit setelah pukul 06.00: titik hijau adalah keberangkatan bus A, titik oranye keberangkatan bus B, dan titik merah keberangkatan keduanya. Pukul berapa kedua bus berangkat bersama lagi?',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 72,
                  step: 6,
                  labelEvery: 2,
                  marks: [
                    { at: 12, color: 'a' },
                    { at: 24, color: 'a' },
                    { at: 48, color: 'a' },
                    { at: 60, color: 'a' },
                    { at: 18, color: 'b' },
                    { at: 54, color: 'b' },
                    { at: 36, color: 'result' },
                    { at: 72, color: 'result' },
                  ],
                }),
                caption: L(
                  'Minutes after 06.00. Green: bus A. Orange: bus B. Red: both buses.',
                  'Menit setelah pukul 06.00. Hijau: bus A. Oranye: bus B. Merah: kedua bus.',
                ),
              },
              options: [
                L('06.36', '06.36'),
                L('06.06', '06.06'),
                L('09.36', '09.36'),
                L('06.30', '06.30'),
              ],
              answer: 0,
              explain: L(
                'The buses meet again after the LCM of 12 and 18: $12 = 2^2 \\times 3$ and $18 = 2 \\times 3^2$, so the LCM is $2^2 \\times 3^2 = 36$ minutes, which is 06.36. The GCF (6) gives 06.06, the product $12 \\times 18 = 216$ gives 09.36 (a common multiple, but not the first), and $12 + 18 = 30$ has no meaning here.',
                'Kedua bus bertemu lagi setelah KPK dari 12 dan 18: $12 = 2^2 \\times 3$ dan $18 = 2 \\times 3^2$, jadi KPK-nya $2^2 \\times 3^2 = 36$ menit, yaitu pukul 06.36. FPB (6) memberi 06.06, hasil kali $12 \\times 18 = 216$ memberi 09.36 (kelipatan persekutuan, tetapi bukan yang pertama), dan $12 + 18 = 30$ tidak bermakna di sini.',
              ),
              hint: L(
                'Look for the first red dot after 0. Or think: a repeating schedule that meets again asks for the LCM, not the GCF.',
                'Cari titik merah pertama setelah 0. Atau ingat: jadwal berulang yang bertemu lagi memakai KPK, bukan FPB.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO correct statements.',
                'Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('144 is a perfect square, because $144 = 2^4 \\times 3^2$ has only even exponents.', '144 adalah kuadrat sempurna, karena $144 = 2^4 \\times 3^2$ hanya punya eksponen genap.'),
                L('216 is a perfect cube, because $216 = 2^3 \\times 3^3$ has exponents that are multiples of 3.', '216 adalah kubik sempurna, karena $216 = 2^3 \\times 3^3$ punya eksponen yang kelipatan 3.'),
                L('108 is a perfect cube, because $108 = 2^2 \\times 3^3$ contains a cube.', '108 adalah kubik sempurna, karena $108 = 2^2 \\times 3^3$ memuat sebuah pangkat tiga.'),
                L('360 is a perfect square, because $360 = 2^3 \\times 3^2 \\times 5$ contains a square.', '360 adalah kuadrat sempurna, karena $360 = 2^3 \\times 3^2 \\times 5$ memuat sebuah pangkat dua.'),
              ],
              answer: [0, 1],
              explain: L(
                'A perfect square needs EVERY exponent even, and a perfect cube needs EVERY exponent to be a multiple of 3. Having one exponent that fits is not enough: $108 = 2^2 \\times 3^3$ contains $3^3$, but its exponent 2 is not a multiple of 3; and $360$ has $3^2$, but its exponents 3 and 1 are odd.',
                'Kuadrat sempurna memerlukan SEMUA eksponen genap, dan kubik sempurna memerlukan SEMUA eksponen kelipatan 3. Satu eksponen yang cocok tidak cukup: $108 = 2^2 \\times 3^3$ memuat $3^3$, tetapi eksponen 2 bukan kelipatan 3; dan $360$ punya $3^2$, tetapi eksponennya yang lain, 3 dan 1, ganjil.',
              ),
              hint: L(
                'Check ALL the exponents of a factorisation, not just one of them.',
                'Periksa SEMUA eksponen pada suatu faktorisasi, bukan hanya satu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Hasan has 90 notebooks and 126 pens. He packs them into identical packages, with no notebook and no pen left over. What is the greatest number of packages he can make?',
                'Hasan punya 90 buku tulis dan 126 pulpen. Ia mengemasnya ke dalam paket-paket yang sama isinya, tanpa ada buku tulis maupun pulpen yang tersisa. Berapa paket terbanyak yang dapat ia buat?',
              ),
              blanks: [{ answer: 18, after: { en: '\\text{ packages}', id: '\\text{ paket}' } }],
              hints: [
                L(
                  'The number of packages must divide 90 AND 126 exactly, and you want the greatest such number.',
                  'Banyak paket harus membagi 90 DAN 126 tanpa sisa, dan kamu mencari yang terbesar.',
                ),
                L(
                  'That is the GCF of 90 and 126. Write both numbers as products of primes.',
                  'Itu adalah FPB dari 90 dan 126. Tulis kedua bilangan sebagai hasil kali bilangan prima.',
                ),
                L(
                  '$90 = 2 \\times 3^2 \\times 5$ and $126 = 2 \\times 3^2 \\times 7$. Multiply the common primes, each with its lowest exponent.',
                  '$90 = 2 \\times 3^2 \\times 5$ dan $126 = 2 \\times 3^2 \\times 7$. Kalikan bilangan prima yang sama, masing-masing dengan eksponen terkecil.',
                ),
              ],
              explain: L(
                'The GCF is $2 \\times 3^2 = 18$, so Hasan makes 18 packages, each with $90 \\div 18 = 5$ notebooks and $126 \\div 18 = 7$ pens.',
                'FPB-nya $2 \\times 3^2 = 18$, jadi Hasan membuat 18 paket, tiap paket berisi $90 \\div 18 = 5$ buku tulis dan $126 \\div 18 = 7$ pulpen.',
              ),
              solution: {
                en: ['90 = 2 \\times 3^2 \\times 5', '126 = 2 \\times 3^2 \\times 7', '\\text{GCF} = 2 \\times 3^2 = 18'],
                id: ['90 = 2 \\times 3^2 \\times 5', '126 = 2 \\times 3^2 \\times 7', '\\text{FPB} = 2 \\times 3^2 = 18'],
              },
            },
          ],
        },
        /* ------------------------------------------------------ S1 L2 estimating */
        {
          id: 'tka-smp-m2-s1-l2',
          title: L('Estimating the Result of a Calculation', 'Memperkirakan Hasil Perhitungan'),
          goal: L(
            'You can estimate the result of a calculation, give a lower and an upper bound, choose a reasonable estimate and check an answer for reasonableness.',
            'Kamu bisa memperkirakan hasil perhitungan, menentukan batas bawah dan batas atas, memilih taksiran yang masuk akal, dan memeriksa apakah suatu jawaban masuk akal.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Estimate First, Calculate Later', 'Ayo Amati: Taksir Dulu, Hitung Kemudian'),
              body: L(
                'Siti buys three things for Rp19,800, Rp52,300 and Rp29,900. Before she uses a calculator, she wants to know roughly how much she must pay.\n\nAn **estimate** is a quick answer that is close to the exact one. We write $\\approx$ (read "is about"). The most common way is **rounding**: replace each number by a nearby number that is easy to work with. Here we round to the nearest ten thousand.\n\n$$19\\,800 + 52\\,300 + 29\\,900 \\approx 20\\,000 + 50\\,000 + 30\\,000 = 100\\,000$$\n\nThe exact total is Rp102,000, so the estimate is close. Estimating has two jobs: getting a quick answer, and **checking** that an exact answer is **reasonable**, that is, not far too big or far too small.',
                'Siti membeli tiga barang seharga Rp19.800, Rp52.300, dan Rp29.900. Sebelum memakai kalkulator, ia ingin tahu kira-kira berapa yang harus ia bayar.\n\n**Taksiran** (estimasi) adalah jawaban cepat yang dekat dengan jawaban pastinya. Kita menulis $\\approx$ (dibaca "kira-kira"). Cara yang paling umum adalah **pembulatan**: ganti setiap bilangan dengan bilangan di dekatnya yang mudah dihitung. Di sini kita membulatkan ke puluhan ribu terdekat.\n\n$$19\\,800 + 52\\,300 + 29\\,900 \\approx 20\\,000 + 50\\,000 + 30\\,000 = 100\\,000$$\n\nTotal sebenarnya Rp102.000, jadi taksirannya dekat. Menaksir punya dua tugas: mendapat jawaban cepat, dan **memeriksa** bahwa jawaban pasti **masuk akal**, yaitu tidak jauh terlalu besar atau terlalu kecil.',
              ),
              figure: {
                ...numberLine({
                  from: 90,
                  to: 110,
                  step: 2,
                  labelEvery: 5,
                  marks: [
                    { at: 102, color: 'a', label: '102' },
                    { at: 100, color: 'b', label: '100' },
                  ],
                }),
                caption: L(
                  'In thousands of rupiah. The green dot is the exact total and the orange dot is the estimate.',
                  'Dalam ribuan rupiah. Titik hijau adalah total pasti dan titik oranye adalah taksirannya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Rounding and Compatible Numbers', 'Contoh Bertahap: Pembulatan dan Bilangan yang Mudah'),
              body: L(
                'Estimate the cost of 19 notebooks at Rp4,850 each.\n\n1. Step 1: Round the number of notebooks to a friendly number: $19 \\approx 20$.\n2. Step 2: Round the price: $4\\,850 \\approx 5\\,000$.\n3. Step 3: Multiply the friendly numbers: $20 \\times 5\\,000 = 100\\,000$.\n4. Step 4: Decide: about Rp100,000. The exact cost is $19 \\times 4\\,850 = 92\\,150$, a bit less, because both numbers were rounded UP.\n\n**Remember:** choose the strategy that gives the easiest numbers.\n\n| Strategy | Idea | Example |\n|---|---|---|\n| Rounding | round each number to tens, hundreds, thousands | $4\\,870 \\approx 5\\,000$ |\n| Compatible numbers | change the numbers so they divide neatly | $4\\,870 \\div 24 \\approx 5\\,000 \\div 25 = 200$ |\n| Percents and fractions | use a friendly fraction | $24\\% \\text{ of } 500 \\approx \\frac{1}{4} \\times 500 = 125$ |\n| Roots | use the nearest perfect squares | $8^2 = 64$ and $9^2 = 81$, so $\\sqrt{70}$ is a little more than 8 |',
                'Taksir harga 19 buku tulis yang masing-masing Rp4.850.\n\n1. Langkah 1: Bulatkan banyak buku ke bilangan yang mudah: $19 \\approx 20$.\n2. Langkah 2: Bulatkan harganya: $4\\,850 \\approx 5\\,000$.\n3. Langkah 3: Kalikan bilangan yang mudah itu: $20 \\times 5\\,000 = 100\\,000$.\n4. Langkah 4: Putuskan: kira-kira Rp100.000. Harga pastinya $19 \\times 4\\,850 = 92\\,150$, sedikit lebih kecil, karena kedua bilangan dibulatkan KE ATAS.\n\n**Ingat:** pilih cara yang memberi bilangan paling mudah.\n\n| Cara | Gagasan | Contoh |\n|---|---|---|\n| Pembulatan | bulatkan tiap bilangan ke puluhan, ratusan, ribuan | $4\\,870 \\approx 5\\,000$ |\n| Bilangan yang cocok | ubah bilangan agar mudah dibagi | $4\\,870 \\div 24 \\approx 5\\,000 \\div 25 = 200$ |\n| Persen dan pecahan | pakai pecahan yang mudah | $24\\% \\text{ dari } 500 \\approx \\frac{1}{4} \\times 500 = 125$ |\n| Akar | pakai kuadrat sempurna terdekat | $8^2 = 64$ dan $9^2 = 81$, jadi $\\sqrt{70}$ sedikit lebih dari 8 |',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Lower and Upper Bounds', 'Contoh Bertahap: Batas Bawah dan Batas Atas'),
              body: L(
                'Budi has Rp85,000. He wants to buy a book for Rp18,400, a bag for Rp27,300 and shoes for Rp34,600. Is his money enough?\n\n1. Step 1: Round every price UP to the next thousand: $19\\,000$, $28\\,000$ and $35\\,000$.\n2. Step 2: Add: $19\\,000 + 28\\,000 + 35\\,000 = 82\\,000$. The real total is at MOST Rp82,000. This is an **upper bound**.\n3. Step 3: Compare: $82\\,000 < 85\\,000$, so the money is certainly enough.\n4. Step 4: Rounding every price DOWN gives $18\\,000 + 27\\,000 + 34\\,000 = 79\\,000$. This is a **lower bound**: the real total is at LEAST Rp79,000.\n\n**Remember:**\n\n- Upper bound ("at most"): round everything up. Use it to show that money or space is ENOUGH.\n- Lower bound ("at least"): round everything down. Use it to show that something is NOT enough.\n- The exact value always lies between the lower bound and the upper bound.',
                'Budi punya Rp85.000. Ia ingin membeli buku seharga Rp18.400, tas seharga Rp27.300, dan sepatu seharga Rp34.600. Apakah uangnya cukup?\n\n1. Langkah 1: Bulatkan setiap harga KE ATAS ke ribuan berikutnya: $19\\,000$, $28\\,000$, dan $35\\,000$.\n2. Langkah 2: Jumlahkan: $19\\,000 + 28\\,000 + 35\\,000 = 82\\,000$. Total sebenarnya paling BANYAK Rp82.000. Ini disebut **batas atas**.\n3. Langkah 3: Bandingkan: $82\\,000 < 85\\,000$, jadi uangnya pasti cukup.\n4. Langkah 4: Membulatkan setiap harga KE BAWAH memberi $18\\,000 + 27\\,000 + 34\\,000 = 79\\,000$. Ini **batas bawah**: total sebenarnya paling SEDIKIT Rp79.000.\n\n**Ingat:**\n\n- Batas atas ("paling banyak"): bulatkan semuanya ke atas. Pakai untuk menunjukkan uang atau tempat CUKUP.\n- Batas bawah ("paling sedikit"): bulatkan semuanya ke bawah. Pakai untuk menunjukkan sesuatu TIDAK cukup.\n- Nilai pasti selalu terletak di antara batas bawah dan batas atas.',
              ),
              figure: {
                ...numberLine({
                  from: 78,
                  to: 86,
                  step: 1,
                  labelEvery: 2,
                  marks: [
                    { at: 79, color: 'a', label: '79' },
                    { at: 82, color: 'b', label: '82' },
                    { at: 85, color: 'muted', label: '85' },
                  ],
                }),
                caption: L(
                  'In thousands of rupiah. Green: lower bound. Orange: upper bound. Grey: the money Budi has.',
                  'Dalam ribuan rupiah. Hijau: batas bawah. Oranye: batas atas. Abu-abu: uang yang dimiliki Budi.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Estimates Are Not Exact', 'Awas, Jebakan!: Taksiran Bukan Hasil Pasti'),
              body: L(
                'Check yourself against these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| $37 \\times 62 \\approx 40 \\times 60 = 2\\,400$, so $37 \\times 62 = 2\\,400$ | An estimate is close, not equal: write $\\approx$. The exact value is $2\\,294$ |\n| Budi has only Rp80,000. Rounding the same prices DOWN gives $79\\,000 < 80\\,000$, so it is enough | Rounding down gives only a lower bound. The exact total is Rp80,300, which is MORE than Rp80,000 |\n| $\\sqrt{50} \\approx 25$ (half of 50) | $7^2 = 49$, so $\\sqrt{50}$ is a little more than 7 |',
                'Periksa dirimu dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| $37 \\times 62 \\approx 40 \\times 60 = 2\\,400$, jadi $37 \\times 62 = 2\\,400$ | Taksiran itu dekat, bukan sama: tulis $\\approx$. Nilai pastinya $2\\,294$ |\n| Budi hanya punya Rp80.000. Membulatkan harga yang sama KE BAWAH memberi $79\\,000 < 80\\,000$, jadi cukup | Pembulatan ke bawah hanya memberi batas bawah. Total pastinya Rp80.300, yang LEBIH dari Rp80.000 |\n| $\\sqrt{50} \\approx 25$ (setengah dari 50) | $7^2 = 49$, jadi $\\sqrt{50}$ sedikit lebih dari 7 |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Ani buys three things for Rp12,600, Rp23,200 and Rp41,700. The line shows, in thousands of rupiah, the total with every price rounded DOWN to the thousand (green dot) and rounded UP to the next thousand (orange dot). What do you know about the exact total?',
                'Ani membeli tiga barang seharga Rp12.600, Rp23.200, dan Rp41.700. Garis menunjukkan, dalam ribuan rupiah, total jika setiap harga dibulatkan KE BAWAH ke ribuan (titik hijau) dan dibulatkan KE ATAS ke ribuan berikutnya (titik oranye). Apa yang kamu ketahui tentang total pastinya?',
              ),
              figure: {
                ...numberLine({
                  from: 74,
                  to: 80,
                  step: 1,
                  marks: [
                    { at: 76, color: 'a', label: '76' },
                    { at: 79, color: 'b', label: '79' },
                  ],
                }),
                caption: L(
                  'In thousands of rupiah. Green: every price rounded down. Orange: every price rounded up.',
                  'Dalam ribuan rupiah. Hijau: setiap harga dibulatkan ke bawah. Oranye: setiap harga dibulatkan ke atas.',
                ),
              },
              options: [
                L('It is at least Rp76,000 and at most Rp79,000.', 'Totalnya paling sedikit Rp76.000 dan paling banyak Rp79.000.'),
                L('It is less than Rp76,000.', 'Totalnya kurang dari Rp76.000.'),
                L('It is more than Rp79,000.', 'Totalnya lebih dari Rp79.000.'),
                L('It is exactly Rp76,000, because rounding down gives the real total.', 'Totalnya tepat Rp76.000, karena pembulatan ke bawah memberi total sebenarnya.'),
              ],
              answer: 0,
              explain: L(
                'Rounding every price down can only make the total smaller, and rounding every price up can only make it bigger. So the exact total is between the two: from Rp76,000 to Rp79,000 (it is Rp77,500).',
                'Membulatkan setiap harga ke bawah hanya membuat total lebih kecil, dan membulatkan ke atas hanya membuatnya lebih besar. Jadi total pastinya ada di antara keduanya: dari Rp76.000 sampai Rp79.000 (yaitu Rp77.500).',
              ),
              hint: L(
                'Which dot comes from prices that are all too small, and which from prices that are all too big? Where must the real total be?',
                'Titik mana yang berasal dari harga yang semuanya terlalu kecil, dan titik mana dari harga yang semuanya terlalu besar? Di mana letak total sebenarnya?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: estimate $41 \\times 29$ by rounding each number to the nearest ten, then multiplying.',
                'Coba bersama: taksir $41 \\times 29$ dengan membulatkan tiap bilangan ke puluhan terdekat, lalu mengalikannya.',
              ),
              template: '41 \\approx ___ \\quad 29 \\approx ___ \\quad 41 \\times 29 \\approx ___',
              blanks: ['40', '30', '1200'],
              explain: L(
                '$41 \\approx 40$ and $29 \\approx 30$, so $41 \\times 29 \\approx 40 \\times 30 = 1\\,200$. The exact answer is 1,189.',
                '$41 \\approx 40$ dan $29 \\approx 30$, jadi $41 \\times 29 \\approx 40 \\times 30 = 1\\,200$. Hasil pastinya 1.189.',
              ),
              hint: L(
                'Look at the ones digit: 5 or more rounds up, less than 5 rounds down. Then multiply the two rounded numbers.',
                'Lihat angka satuannya: 5 atau lebih dibulatkan ke atas, kurang dari 5 ke bawah. Lalu kalikan kedua bilangan hasil pembulatan.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                '1 kg of rice costs Rp14,800. About how much do 5.2 kg of rice cost?',
                '1 kg beras harganya Rp14.800. Kira-kira berapa harga 5,2 kg beras?',
              ),
              options: [
                L('About Rp75,000', 'Kira-kira Rp75.000'),
                L('About Rp7,500', 'Kira-kira Rp7.500'),
                L('About Rp150,000', 'Kira-kira Rp150.000'),
                L('About Rp20,000', 'Kira-kira Rp20.000'),
              ],
              answer: 0,
              explain: L(
                'Round 14,800 to 15,000 and 5.2 to 5: $5 \\times 15\\,000 = 75\\,000$. The exact price is Rp76,960. Rp7,500 and Rp150,000 have the wrong number of zeros, and Rp20,000 comes from adding $5 + 15$ instead of multiplying.',
                'Bulatkan 14.800 menjadi 15.000 dan 5,2 menjadi 5: $5 \\times 15\\,000 = 75\\,000$. Harga pastinya Rp76.960. Rp7.500 dan Rp150.000 salah banyak nol, dan Rp20.000 berasal dari menjumlah $5 + 15$, bukan mengalikan.',
              ),
              hint: L(
                'Round both numbers to friendly ones, then ask: should you add or multiply? Check the number of zeros at the end.',
                'Bulatkan kedua bilangan menjadi bilangan yang mudah, lalu tanyakan: dijumlah atau dikali? Periksa banyaknya nol di belakang.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$387 + 612 \\approx 1\\,000$ is a reasonable estimate.', '$387 + 612 \\approx 1\\,000$ adalah taksiran yang masuk akal.'),
                L('48% of Rp400,000 is about Rp100,000.', '48% dari Rp400.000 kira-kira Rp100.000.'),
                L('$\\sqrt{50}$ is between 7 and 8.', '$\\sqrt{50}$ terletak di antara 7 dan 8.'),
                L('If every price rounded DOWN fits in your budget, your money is surely enough.', 'Jika semua harga yang dibulatkan KE BAWAH muat dalam anggaranmu, uangmu pasti cukup.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$387 + 612 \\approx 400 + 600 = 1\\,000$ (the exact value is 999). 48% is almost one half, and half of Rp400,000 is Rp200,000. Since $7^2 = 49$ and $8^2 = 64$, $\\sqrt{50}$ is between 7 and 8. Rounding down gives only a lower bound, so it can never prove that the money is enough.',
                '$387 + 612 \\approx 400 + 600 = 1\\,000$ (nilai pastinya 999). 48% hampir setengah, dan setengah dari Rp400.000 adalah Rp200.000. Karena $7^2 = 49$ dan $8^2 = 64$, $\\sqrt{50}$ ada di antara 7 dan 8. Pembulatan ke bawah hanya memberi batas bawah, jadi tidak pernah bisa membuktikan uangnya cukup.',
              ),
              hint: L(
                'Round the numbers to friendly ones, use 48% is nearly 50%, compare $\\sqrt{50}$ with $7^2$ and $8^2$, and ask what a lower bound can prove.',
                'Bulatkan bilangan menjadi bilangan yang mudah, ingat 48% hampir 50%, bandingkan $\\sqrt{50}$ dengan $7^2$ dan $8^2$, lalu tanyakan apa yang bisa dibuktikan oleh batas bawah.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The school canteen sold 1,236 snacks on Monday, 1,748 on Tuesday and 1,489 on Wednesday. Round each number to the nearest hundred, then add, to estimate the total number of snacks.',
                'Kantin sekolah menjual 1.236 gorengan pada hari Senin, 1.748 pada hari Selasa, dan 1.489 pada hari Rabu. Bulatkan setiap bilangan ke ratusan terdekat, lalu jumlahkan, untuk menaksir total gorengan yang terjual.',
              ),
              blanks: [{ answer: 4400, after: { en: '\\text{ snacks}', id: '\\text{ gorengan}' } }],
              hints: [
                L(
                  'To round to the nearest hundred, look at the tens digit: 5 or more rounds up, less than 5 rounds down.',
                  'Untuk membulatkan ke ratusan terdekat, lihat angka puluhannya: 5 atau lebih dibulatkan ke atas, kurang dari 5 ke bawah.',
                ),
                L(
                  'Round all three numbers first. Only after that, add the three rounded numbers.',
                  'Bulatkan dulu ketiga bilangan. Baru setelah itu jumlahkan ketiga bilangan hasil pembulatan.',
                ),
                L(
                  '$1\\,236 \\approx 1\\,200$ and $1\\,748 \\approx 1\\,700$. Round 1,489 in the same way, then add the three numbers.',
                  '$1\\,236 \\approx 1\\,200$ dan $1\\,748 \\approx 1\\,700$. Bulatkan 1.489 dengan cara yang sama, lalu jumlahkan ketiga bilangan.',
                ),
              ],
              explain: L(
                '$1\\,236 \\approx 1\\,200$, $1\\,748 \\approx 1\\,700$ and $1\\,489 \\approx 1\\,500$, and $1\\,200 + 1\\,700 + 1\\,500 = 4\\,400$. The exact total is 4,473, so the estimate is close.',
                '$1\\,236 \\approx 1\\,200$, $1\\,748 \\approx 1\\,700$, dan $1\\,489 \\approx 1\\,500$, dan $1\\,200 + 1\\,700 + 1\\,500 = 4\\,400$. Total pastinya 4.473, jadi taksirannya dekat.',
              ),
              solution: ['1\\,236 \\approx 1\\,200 \\quad 1\\,748 \\approx 1\\,700 \\quad 1\\,489 \\approx 1\\,500', '1\\,200 + 1\\,700 + 1\\,500 = 4\\,400'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m2-s1-p',
        runtime: 'math',
        title: L('Primes, GCF, LCM and Estimates', 'Bilangan Prima, FPB, KPK, dan Taksiran'),
        brief: L(
          'Factorise numbers into primes, use them for schedules and perfect squares, and estimate the cost of a purchase.',
          'Faktorkan bilangan menjadi bilangan prima, pakai untuk jadwal dan kuadrat sempurna, lalu taksir harga suatu pembelian.',
        ),
        requirements: [
          L('Write a number as a product of primes with exponents and use it for the GCF, the LCM and perfect squares.', 'Menulis bilangan sebagai hasil kali bilangan prima dengan eksponen dan memakainya untuk FPB, KPK, dan kuadrat sempurna.'),
          L('Estimate a result by rounding to friendly numbers.', 'Menaksir hasil dengan membulatkan ke bilangan yang mudah.'),
        ],
        hints: [
          L('For a factorisation, divide by 2, then 3, then 5, and so on, until nothing can be divided any more.', 'Untuk faktorisasi, bagi dengan 2, lalu 3, lalu 5, dan seterusnya, sampai tidak ada lagi yang bisa dibagi.'),
          L('A schedule that repeats and meets again asks for the LCM. Sharing into equal groups asks for the GCF.', 'Jadwal berulang yang bertemu lagi memakai KPK. Membagi menjadi kelompok sama banyak memakai FPB.'),
          L('A perfect square has only even exponents. Look for the primes whose exponent is odd.', 'Kuadrat sempurna hanya punya eksponen genap. Cari bilangan prima yang eksponennya ganjil.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Write 360 as a product of primes in the form $2^a \\times 3^b \\times 5^c$. Type the exponents $a$, $b$ and $c$.',
              'Tulis 360 sebagai hasil kali bilangan prima dalam bentuk $2^a \\times 3^b \\times 5^c$. Ketik eksponen $a$, $b$, dan $c$.',
            ),
            inline: true,
            blanks: [
              { label: 'a =', answer: 3 },
              { label: 'b =', answer: 2 },
              { label: 'c =', answer: 1 },
            ],
            solution: ['360 = 36 \\times 10 = (2^2 \\times 3^2) \\times (2 \\times 5)', '360 = 2^3 \\times 3^2 \\times 5^1', 'a = 3 \\quad b = 2 \\quad c = 1'],
          },
          {
            prompt: L(
              'Light A flashes every 18 seconds and light B flashes every 24 seconds. They flash together at second 0. After how many seconds do they next flash together? How many times has light B flashed by then, counting that shared flash but not the one at second 0?',
              'Lampu A menyala setiap 18 detik dan lampu B menyala setiap 24 detik. Keduanya menyala bersama pada detik ke-0. Setelah berapa detik keduanya menyala bersama lagi? Berapa kali lampu B sudah menyala saat itu, dihitung dengan nyala bersama itu tetapi tanpa nyala pada detik ke-0?',
            ),
            blanks: [
              { label: { en: '\\text{seconds} =', id: '\\text{detik} =' }, answer: 72 },
              { label: { en: '\\text{flashes of B} =', id: '\\text{nyala B} =' }, answer: 3 },
            ],
            solution: {
              en: ['18 = 2 \\times 3^2 \\quad 24 = 2^3 \\times 3', '\\text{LCM} = 2^3 \\times 3^2 = 72', '72 \\div 24 = 3'],
              id: ['18 = 2 \\times 3^2 \\quad 24 = 2^3 \\times 3', '\\text{KPK} = 2^3 \\times 3^2 = 72', '72 \\div 24 = 3'],
            },
          },
          {
            prompt: L(
              'Ani buys 18 packets of paper at Rp4,950 each. Round the number of packets to the nearest ten and the price to the nearest thousand, then multiply to estimate the total price in rupiah.',
              'Ani membeli 18 pak kertas yang masing-masing Rp4.950. Bulatkan banyak pak ke puluhan terdekat dan harganya ke ribuan terdekat, lalu kalikan untuk menaksir total harga dalam rupiah.',
            ),
            blanks: [{ label: '\\text{Rp}', answer: 100000 }],
            solution: ['18 \\approx 20 \\quad 4\\,950 \\approx 5\\,000', '20 \\times 5\\,000 = 100\\,000'],
          },
          {
            prompt: L(
              'Eko wants to multiply 252 by the smallest natural number $n$ so that the product is a perfect square. Find $n$, and find the square root of the product.',
              'Eko ingin mengalikan 252 dengan bilangan asli terkecil $n$ agar hasil kalinya kuadrat sempurna. Cari $n$, dan cari akar kuadrat dari hasil kali itu.',
            ),
            figure: {
              ...factorTrees([{ root: nd(252, nd(4, lf(2), lf(2)), nd(63, lf(7), nd(9, lf(3), lf(3)))) }]),
              caption: L('The factor tree of 252. The green numbers are primes.', 'Pohon faktor 252. Bilangan hijau adalah bilangan prima.'),
            },
            blanks: [
              { label: '\\text{n} =', answer: 7 },
              { label: { en: '\\text{square root} =', id: '\\text{akar kuadrat} =' }, answer: 42 },
            ],
            solution: {
              en: ['252 = 2^2 \\times 3^2 \\times 7', '\\text{The exponent of 7 is odd, so } n = 7', '252 \\times 7 = 2^2 \\times 3^2 \\times 7^2 = (2 \\times 3 \\times 7)^2 = 42^2 = 1\\,764'],
              id: ['252 = 2^2 \\times 3^2 \\times 7', '\\text{Eksponen 7 ganjil, jadi } n = 7', '252 \\times 7 = 2^2 \\times 3^2 \\times 7^2 = (2 \\times 3 \\times 7)^2 = 42^2 = 1\\,764'],
            },
          },
        ],
      },
    },
    /* ============================================== S2: ratio, scale and rate */
    {
      id: 'tka-smp-m2-s2',
      title: L('Ratio, Scale and Rate', 'Perbandingan, Skala, dan Laju'),
      summary: L(
        'Compare quantities with ratios, solve proportions, read maps and plans, share a quantity in a ratio, and tell direct from inverse proportion; then work with rates such as speed and flow rate.',
        'Membandingkan besaran dengan perbandingan, menyelesaikan proporsi, membaca peta dan denah, membagi suatu besaran menurut perbandingan, dan membedakan perbandingan senilai dari berbalik nilai; lalu menghitung laju seperti kecepatan dan debit.',
      ),
      lessons: [
        /* --------------------------------------------- S2 L1 ratio, scale, proportion */
        {
          id: 'tka-smp-m2-s2-l1',
          title: L('Ratio, Scale and Proportion', 'Perbandingan, Skala, dan Proporsi'),
          goal: L(
            'You can write a ratio in simplest form, solve a proportion, use a map scale, and share a quantity in a given ratio.',
            'Kamu bisa menulis perbandingan dalam bentuk paling sederhana, menyelesaikan proporsi, memakai skala peta, dan membagi suatu besaran menurut perbandingan tertentu.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Comparing with a Ratio', 'Ayo Amati: Membandingkan dengan Perbandingan'),
              body: L(
                'Ani\'s ribbon is 12 m long and Budi\'s ribbon is 18 m long. We compare them with a **ratio**: Ani\'s ribbon : Budi\'s ribbon = 12 : 18, read "12 to 18".\n\nDivide both parts by their GCF, 6, to get the **simplest form**: 12 : 18 = 2 : 3. In the picture every block is 6 m long, so Ani has 2 blocks and Budi has 3 blocks.\n\nRatios with the same simplest form are **equivalent ratios**: multiply or divide both parts by the same number. A ratio table lists them.\n\n| Ani | 2 | 4 | 6 | 8 |\n|---|---|---|---|---|\n| Budi | 3 | 6 | 9 | 12 |\n\nThe table also solves a **proportion** (two equal ratios). If Ani has 10, then $10 = 2 \\times 5$, so Budi has $3 \\times 5 = 15$.',
                'Pita Ani panjangnya 12 m dan pita Budi panjangnya 18 m. Kita membandingkannya dengan **perbandingan**: pita Ani : pita Budi = 12 : 18, dibaca "12 banding 18".\n\nBagi kedua bagian dengan FPB-nya, yaitu 6, untuk mendapat **bentuk paling sederhana**: 12 : 18 = 2 : 3. Pada gambar setiap kotak panjangnya 6 m, jadi Ani punya 2 kotak dan Budi punya 3 kotak.\n\nPerbandingan yang bentuk sederhananya sama disebut **perbandingan yang setara**: kalikan atau bagi kedua bagian dengan bilangan yang sama. Tabel perbandingan mencantumkannya.\n\n| Ani | 2 | 4 | 6 | 8 |\n|---|---|---|---|---|\n| Budi | 3 | 6 | 9 | 12 |\n\nTabel itu juga menyelesaikan **proporsi** (dua perbandingan yang sama). Jika Ani punya 10, maka $10 = 2 \\times 5$, jadi Budi punya $3 \\times 5 = 15$.',
              ),
              figure: {
                ...ratioBars(
                  [
                    { n: 2, color: 'a', label: 'Ani' },
                    { n: 3, color: 'b', label: 'Budi' },
                  ],
                  { each: '6' },
                ),
                caption: L(
                  'Every block is 6 m. Ani\'s ribbon is 2 green blocks and Budi\'s ribbon is 3 orange blocks.',
                  'Setiap kotak 6 m. Pita Ani adalah 2 kotak hijau dan pita Budi adalah 3 kotak oranye.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Sharing in a Ratio', 'Contoh Bertahap: Membagi dalam Perbandingan'),
              body: L(
                'Ani and Budi share Rp240,000 in the ratio 3 : 5. How much does each one get?\n\n1. Step 1: Draw a bar model: Ani gets 3 equal parts and Budi gets 5 equal parts.\n2. Step 2: Count all the parts: $3 + 5 = 8$.\n3. Step 3: Find the value of one part: $240\\,000 \\div 8 = 30\\,000$.\n4. Step 4: Ani gets $3 \\times 30\\,000 = 90\\,000$ and Budi gets $5 \\times 30\\,000 = 150\\,000$.\n5. Step 5: Check: $90\\,000 + 150\\,000 = 240\\,000$.\n\n**Remember:**\n\n- The ratio 3 : 5 compares part with part. The whole has $3 + 5 = 8$ parts, so Ani gets $\\frac{3}{8}$ of the money and Budi gets $\\frac{5}{8}$.\n- A share = the number of its parts $\\times$ the value of one part.',
                'Ani dan Budi membagi uang Rp240.000 dengan perbandingan 3 : 5. Berapa bagian masing-masing?\n\n1. Langkah 1: Gambar model batang: Ani mendapat 3 bagian sama besar dan Budi mendapat 5 bagian sama besar.\n2. Langkah 2: Hitung semua bagian: $3 + 5 = 8$.\n3. Langkah 3: Cari nilai satu bagian: $240\\,000 \\div 8 = 30\\,000$.\n4. Langkah 4: Ani mendapat $3 \\times 30\\,000 = 90\\,000$ dan Budi mendapat $5 \\times 30\\,000 = 150\\,000$.\n5. Langkah 5: Periksa: $90\\,000 + 150\\,000 = 240\\,000$.\n\n**Ingat:**\n\n- Perbandingan 3 : 5 membandingkan bagian dengan bagian. Keseluruhan ada $3 + 5 = 8$ bagian, jadi Ani mendapat $\\frac{3}{8}$ dari uang itu dan Budi mendapat $\\frac{5}{8}$.\n- Bagian seseorang = banyak bagiannya $\\times$ nilai satu bagian.',
              ),
              figure: {
                ...sharedBar(
                  [
                    { n: 3, color: 'a' },
                    { n: 5, color: 'b' },
                  ],
                  '240',
                ),
                caption: L(
                  'In thousands of rupiah. Ani\'s 3 parts are green, Budi\'s 5 parts are orange, and the whole is 240.',
                  'Dalam ribuan rupiah. 3 bagian Ani berwarna hijau, 5 bagian Budi berwarna oranye, dan keseluruhannya 240.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Proportion and Scale', 'Contoh Bertahap: Proporsi dan Skala'),
              body: L(
                'On a map with scale 1 : 500,000, two towns are 6 cm apart. What is the real distance in km? The scale says that 1 cm on the map is 500,000 cm in real life.\n\n1. Step 1: Write the proportion: map : real = 1 : 500,000 = 6 : $x$.\n2. Step 2: Cross-multiply: $1 \\times x = 6 \\times 500\\,000$, so $x = 3\\,000\\,000$ cm. (Unit method: 1 cm is 500,000 cm, so 6 cm is $6 \\times 500\\,000$ cm.)\n3. Step 3: Change cm to km. Since $100\\,000$ cm = 1 km, we get $3\\,000\\,000 \\div 100\\,000 = 30$ km.\n4. Step 4: Going back: 45 km is $4\\,500\\,000$ cm, and $4\\,500\\,000 \\div 500\\,000 = 9$ cm on the map.\n\n**Remember:**\n\n- Real distance = map distance $\\times$ scale number. Map distance = real distance $\\div$ scale number.\n- Change the unit at the end: $100$ cm = 1 m and $100\\,000$ cm = 1 km.\n- Cross-multiplying: from $\\frac{a}{b} = \\frac{c}{d}$ we get $a \\times d = b \\times c$.',
                'Pada peta berskala 1 : 500.000, dua kota berjarak 6 cm. Berapa jarak sebenarnya dalam km? Skala itu berarti 1 cm pada peta sama dengan 500.000 cm di dunia nyata.\n\n1. Langkah 1: Tulis proporsinya: peta : sebenarnya = 1 : 500.000 = 6 : $x$.\n2. Langkah 2: Kalikan silang: $1 \\times x = 6 \\times 500\\,000$, jadi $x = 3\\,000\\,000$ cm. (Cara satuan: 1 cm adalah 500.000 cm, jadi 6 cm adalah $6 \\times 500\\,000$ cm.)\n3. Langkah 3: Ubah cm ke km. Karena $100\\,000$ cm = 1 km, kita mendapat $3\\,000\\,000 \\div 100\\,000 = 30$ km.\n4. Langkah 4: Kembali ke peta: 45 km adalah $4\\,500\\,000$ cm, dan $4\\,500\\,000 \\div 500\\,000 = 9$ cm pada peta.\n\n**Ingat:**\n\n- Jarak sebenarnya = jarak pada peta $\\times$ bilangan skala. Jarak pada peta = jarak sebenarnya $\\div$ bilangan skala.\n- Ubah satuan di akhir: $100$ cm = 1 m dan $100\\,000$ cm = 1 km.\n- Kali silang: dari $\\frac{a}{b} = \\frac{c}{d}$ kita mendapat $a \\times d = b \\times c$.',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 6,
                  step: 1,
                  marks: [
                    { at: 0, label: 'A' },
                    { at: 6, label: 'B' },
                  ],
                  jumps: [{ from: 0, to: 6, label: '6' }],
                }),
                caption: L(
                  'A ruler in cm. The towns A and B are 6 cm apart on the map (the red arrow).',
                  'Penggaris dalam cm. Kota A dan B berjarak 6 cm pada peta (panah merah).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Part and Whole, Units and Order', 'Awas, Jebakan!: Bagian dan Keseluruhan, Satuan, dan Urutan'),
              body: L(
                'Check yourself against these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| Ani : Budi = 3 : 5, so Ani gets $\\frac{3}{5}$ of the money | The whole is $3 + 5 = 8$ parts, so Ani gets $\\frac{3}{8}$ |\n| Scale 1 : 500,000 and 6 cm on the map: $6 \\times 500\\,000 = 3\\,000\\,000$ km | $3\\,000\\,000$ cm is 30 km. Change the unit after multiplying |\n| Boys : girls = 12 : 18, so girls : boys = 2 : 3 | Girls : boys = 3 : 2. The order of a ratio matters |',
                'Periksa dirimu dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| Ani : Budi = 3 : 5, jadi Ani mendapat $\\frac{3}{5}$ dari uang itu | Keseluruhan ada $3 + 5 = 8$ bagian, jadi Ani mendapat $\\frac{3}{8}$ |\n| Skala 1 : 500.000 dan 6 cm pada peta: $6 \\times 500\\,000 = 3\\,000\\,000$ km | $3\\,000\\,000$ cm sama dengan 30 km. Ubah satuannya setelah mengalikan |\n| Laki-laki : perempuan = 12 : 18, jadi perempuan : laki-laki = 2 : 3 | Perempuan : laki-laki = 3 : 2. Urutan perbandingan itu penting |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bars show the stickers of Citra and Dewi. Every block is 5 stickers. What is the ratio Citra : Dewi in simplest form?',
                'Batang-batang menunjukkan stiker milik Citra dan Dewi. Setiap kotak adalah 5 stiker. Berapa perbandingan Citra : Dewi dalam bentuk paling sederhana?',
              ),
              figure: {
                ...ratioBars(
                  [
                    { n: 4, color: 'a', label: 'Citra' },
                    { n: 6, color: 'b', label: 'Dewi' },
                  ],
                  { each: '5' },
                ),
                caption: L('Every block is 5 stickers.', 'Setiap kotak adalah 5 stiker.'),
              },
              options: [
                L('2 : 3', '2 : 3'),
                L('4 : 6', '4 : 6'),
                L('3 : 2', '3 : 2'),
                L('2 : 5', '2 : 5'),
              ],
              answer: 0,
              explain: L(
                'Citra has $4 \\times 5 = 20$ stickers and Dewi has $6 \\times 5 = 30$. Then $20 : 30 = 2 : 3$. The ratio 4 : 6 is not in simplest form, 3 : 2 has the order reversed, and 2 : 5 compares Citra with all the stickers (20 : 50).',
                'Citra punya $4 \\times 5 = 20$ stiker dan Dewi punya $6 \\times 5 = 30$. Jadi $20 : 30 = 2 : 3$. Perbandingan 4 : 6 belum paling sederhana, 3 : 2 urutannya terbalik, dan 2 : 5 membandingkan Citra dengan semua stiker (20 : 50).',
              ),
              hint: L(
                'Work out how many stickers each girl has, then divide both numbers by their GCF. Keep Citra first.',
                'Hitung dulu banyak stiker masing-masing anak, lalu bagi kedua bilangan dengan FPB-nya. Letakkan Citra di depan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: Eko and Fitri share 48 marbles in the ratio 3 : 5. Count the parts, find one part, then find Eko\'s share.',
                'Coba bersama: Eko dan Fitri membagi 48 kelereng dengan perbandingan 3 : 5. Hitung banyak bagian, cari satu bagian, lalu cari bagian Eko.',
              ),
              template: '3 + 5 = ___ \\quad 48 \\div 8 = ___ \\quad 3 \\times 6 = ___',
              blanks: ['8', '6', '18'],
              explain: L(
                'There are 8 parts, one part is 6 marbles, so Eko gets $3 \\times 6 = 18$ marbles and Fitri gets $5 \\times 6 = 30$.',
                'Ada 8 bagian, satu bagian adalah 6 kelereng, jadi Eko mendapat $3 \\times 6 = 18$ kelereng dan Fitri mendapat $5 \\times 6 = 30$.',
              ),
              hint: L(
                'The whole is the sum of the parts. Divide the total by it to get one part, then multiply by Eko\'s number of parts.',
                'Keseluruhan adalah jumlah semua bagian. Bagi total dengan jumlah itu untuk mendapat satu bagian, lalu kalikan dengan banyak bagian Eko.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A house plan has scale 1 : 200. The living room is 5 cm long on the plan. How long is the real living room?',
                'Denah sebuah rumah berskala 1 : 200. Ruang tamu panjangnya 5 cm pada denah. Berapa panjang ruang tamu sebenarnya?',
              ),
              options: [
                L('10 m', '10 m'),
                L('1,000 m', '1.000 m'),
                L('40 m', '40 m'),
                L('100 m', '100 m'),
              ],
              answer: 0,
              explain: L(
                '$5 \\times 200 = 1\\,000$ cm, and $1\\,000$ cm $= 10$ m. Writing 1,000 m forgets to change cm to m, 40 comes from dividing 200 by 5, and 100 m divides by 10 instead of 100.',
                '$5 \\times 200 = 1\\,000$ cm, dan $1\\,000$ cm $= 10$ m. Menulis 1.000 m lupa mengubah cm ke m, 40 berasal dari membagi 200 dengan 5, dan 100 m membagi dengan 10, bukan 100.',
              ),
              hint: L(
                'Multiply the plan length by the scale number first. The answer is in cm: then change it to metres.',
                'Kalikan dulu panjang pada denah dengan bilangan skala. Hasilnya dalam cm: ubah ke meter.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Orange juice and water are mixed in the ratio 2 : 5. Choose the TWO correct statements.',
                'Jus jeruk dan air dicampur dengan perbandingan 2 : 5. Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('For every 2 cups of juice there are 5 cups of water.', 'Untuk setiap 2 gelas jus ada 5 gelas air.'),
                L('The juice is $\\frac{2}{7}$ of the whole mixture.', 'Jus adalah $\\frac{2}{7}$ dari seluruh campuran.'),
                L('The juice is $\\frac{2}{5}$ of the whole mixture.', 'Jus adalah $\\frac{2}{5}$ dari seluruh campuran.'),
                L('With 10 cups of juice you need 20 cups of water.', 'Dengan 10 gelas jus kamu perlu 20 gelas air.'),
              ],
              answer: [0, 1],
              explain: L(
                'The ratio 2 : 5 is part to part, and the whole has $2 + 5 = 7$ parts, so the juice is $\\frac{2}{7}$. Wrong: $\\frac{2}{5}$ forgets the juice itself, and 10 cups of juice is $2 \\times 5$, so you need $5 \\times 5 = 25$ cups of water.',
                'Perbandingan 2 : 5 adalah bagian dengan bagian, dan keseluruhan ada $2 + 5 = 7$ bagian, jadi jus adalah $\\frac{2}{7}$. Yang salah: $\\frac{2}{5}$ melupakan jus itu sendiri, dan 10 gelas jus adalah $2 \\times 5$, jadi kamu perlu $5 \\times 5 = 25$ gelas air.',
              ),
              hint: L(
                'For a fraction of the whole, add the parts first. For a proportion, multiply both parts by the same number.',
                'Untuk pecahan dari keseluruhan, jumlahkan dulu semua bagian. Untuk proporsi, kalikan kedua bagian dengan bilangan yang sama.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'On a map with scale 1 : 750,000, two cities are 8 cm apart. What is the real distance between the cities, in km?',
                'Pada peta berskala 1 : 750.000, dua kota berjarak 8 cm. Berapa jarak sebenarnya kedua kota itu, dalam km?',
              ),
              blanks: [{ answer: 60, after: '\\text{ km}' }],
              hints: [
                L(
                  'The scale says 1 cm on the map is 750,000 cm in real life. What do you do with the 8 cm?',
                  'Skala itu berarti 1 cm pada peta adalah 750.000 cm sebenarnya. Apa yang kamu lakukan dengan 8 cm?',
                ),
                L(
                  'Multiply $8 \\times 750\\,000$ to get the real distance in cm. Then change cm to km: divide by $100\\,000$.',
                  'Kalikan $8 \\times 750\\,000$ untuk mendapat jarak sebenarnya dalam cm. Lalu ubah cm ke km: bagi dengan $100\\,000$.',
                ),
                L(
                  '$8 \\times 750\\,000 = 6\\,000\\,000$ cm. Divide this by $100\\,000$ to get the number of km.',
                  '$8 \\times 750\\,000 = 6\\,000\\,000$ cm. Bagi hasil ini dengan $100\\,000$ untuk mendapat banyak km.',
                ),
              ],
              explain: L(
                '$8 \\times 750\\,000 = 6\\,000\\,000$ cm, and $6\\,000\\,000 \\div 100\\,000 = 60$ km.',
                '$8 \\times 750\\,000 = 6\\,000\\,000$ cm, dan $6\\,000\\,000 \\div 100\\,000 = 60$ km.',
              ),
              solution: ['8 \\times 750\\,000 = 6\\,000\\,000 \\text{ cm}', '6\\,000\\,000 \\div 100\\,000 = 60 \\text{ km}'],
            },
          ],
        },
        /* ------------------------------------- S2 L2 direct, inverse, rate */
        {
          id: 'tka-smp-m2-s2-l2',
          title: L('Direct and Inverse Proportion, and Rate', 'Senilai, Berbalik Nilai, dan Laju'),
          goal: L(
            'You can tell direct from inverse proportion, solve both kinds of problem, and work out rates such as speed, flow rate and price per unit.',
            'Kamu bisa membedakan perbandingan senilai dari berbalik nilai, menyelesaikan kedua jenis soal itu, dan menghitung laju seperti kecepatan, debit, dan harga per satuan.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Direct Proportion', 'Ayo Amati: Perbandingan Senilai'),
              body: L(
                'Pencils cost Rp2,000 each. The more pencils you buy, the more you pay, and both grow at the same rate.\n\n| Pencils | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Price (Rp thousand) | 2 | 4 | 6 | 8 |\n\nThis is **direct proportion**: when one quantity doubles, the other doubles too. The quotient price $\\div$ pencils is always the same, here 2, the price of one pencil.\n\nIn the graph, the points lie on a **straight line through the origin** $(0, 0)$.',
                'Pensil harganya Rp2.000 per buah. Makin banyak pensil yang dibeli, makin banyak uang yang dibayar, dan keduanya bertambah dengan laju yang sama.\n\n| Pensil | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Harga (ribu Rp) | 2 | 4 | 6 | 8 |\n\nIni adalah **perbandingan senilai**: ketika satu besaran menjadi dua kali lipat, besaran yang lain juga menjadi dua kali lipat. Hasil bagi harga $\\div$ banyak pensil selalu sama, di sini 2, yaitu harga satu pensil.\n\nPada grafik, titik-titiknya terletak pada **garis lurus yang melalui titik asal** $(0, 0)$.',
              ),
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: '2*x', from: 0, to: 5.5, color: 'a' },
                  { t: 'dot', x: 1, y: 2, color: 'result' },
                  { t: 'dot', x: 2, y: 4, color: 'result' },
                  { t: 'dot', x: 3, y: 6, color: 'result' },
                  { t: 'dot', x: 4, y: 8, color: 'result' },
                ],
                caption: L(
                  'Horizontal: number of pencils. Vertical: price in thousands of rupiah. The red points lie on a straight green line through the origin.',
                  'Mendatar: banyak pensil. Tegak: harga dalam ribuan rupiah. Titik-titik merah terletak pada garis lurus hijau yang melalui titik asal.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Inverse Proportion', 'Contoh Bertahap: Perbandingan Berbalik Nilai'),
              body: L(
                '6 workers finish a job in 12 days. How many days do 9 workers need?\n\n1. Step 1: More workers means fewer days, so this is **inverse proportion**.\n2. Step 2: The total work stays the same: $6 \\times 12 = 72$ worker-days.\n3. Step 3: Write it for 9 workers: $9 \\times d = 72$.\n4. Step 4: Divide both sides by 9: $d = 72 \\div 9 = 8$ days.\n\n**Remember:** direct and inverse proportion side by side.\n\n| Feature | Direct proportion | Inverse proportion |\n|---|---|---|\n| Change | both grow together | one grows, the other shrinks |\n| What stays the same | the quotient $\\frac{y}{x}$ | the product $x \\times y$ |\n| Example | pencils and price | workers and days |\n| Graph | a straight line through the origin | a curve that falls |',
                '6 pekerja menyelesaikan suatu pekerjaan dalam 12 hari. Berapa hari yang dibutuhkan 9 pekerja?\n\n1. Langkah 1: Pekerja makin banyak berarti hari makin sedikit, jadi ini **perbandingan berbalik nilai**.\n2. Langkah 2: Jumlah pekerjaan tetap sama: $6 \\times 12 = 72$ hari-pekerja.\n3. Langkah 3: Tulis untuk 9 pekerja: $9 \\times d = 72$.\n4. Langkah 4: Bagi kedua ruas dengan 9: $d = 72 \\div 9 = 8$ hari.\n\n**Ingat:** perbandingan senilai dan berbalik nilai berdampingan.\n\n| Ciri | Senilai | Berbalik nilai |\n|---|---|---|\n| Perubahan | keduanya bertambah bersama | yang satu bertambah, yang lain berkurang |\n| Yang tetap sama | hasil bagi $\\frac{y}{x}$ | hasil kali $x \\times y$ |\n| Contoh | pensil dan harga | pekerja dan hari |\n| Grafik | garis lurus melalui titik asal | kurva yang menurun |',
              ),
              figure: {
                dim: 2,
                xSpan: [-1, 20],
                ySpan: [-1, 18],
                ticks: true,
                items: [
                  { t: 'curve', f: '72/x', from: 4.5, to: 18, color: 'b' },
                  { t: 'dot', x: 6, y: 12, color: 'result' },
                  { t: 'dot', x: 9, y: 8, color: 'result' },
                  { t: 'dot', x: 12, y: 6, color: 'result' },
                ],
                caption: L(
                  'Horizontal: number of workers. Vertical: days. The red points lie on an orange curve that falls as the workers increase.',
                  'Mendatar: banyak pekerja. Tegak: banyak hari. Titik-titik merah terletak pada kurva oranye yang menurun ketika pekerja bertambah.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Rate of Change', 'Contoh Bertahap: Laju Perubahan'),
              body: L(
                'A tap fills a 120-litre tank in 8 minutes. How fast does the water flow, and how long does a 300-litre tank take?\n\nA **rate** compares two different quantities by dividing: how much one quantity changes for each unit of the other.\n\n1. Step 1: Flow rate = volume $\\div$ time $= 120 \\div 8 = 15$ litres per minute.\n2. Step 2: The graph of volume against time is a straight line through the origin, and the rate tells how steep it is.\n3. Step 3: Time for 300 litres: $300 \\div 15 = 20$ minutes.\n\n**Remember:**\n\n- Speed = distance $\\div$ time (km/h, m/s). Flow rate = volume $\\div$ time (L/min). Price per unit = price $\\div$ amount (Rp/kg).\n- Changing units: 1 m/s = $3.6$ km/h, so 72 km/h = 20 m/s.',
                'Sebuah keran mengisi bak 120 liter dalam 8 menit. Seberapa cepat air mengalir, dan berapa lama untuk mengisi bak 300 liter?\n\n**Laju** membandingkan dua besaran yang berbeda dengan pembagian: seberapa banyak satu besaran berubah untuk setiap satu satuan besaran yang lain.\n\n1. Langkah 1: Debit = volume $\\div$ waktu $= 120 \\div 8 = 15$ liter per menit.\n2. Langkah 2: Grafik volume terhadap waktu adalah garis lurus melalui titik asal, dan lajunya menunjukkan seberapa curam garis itu.\n3. Langkah 3: Waktu untuk 300 liter: $300 \\div 15 = 20$ menit.\n\n**Ingat:**\n\n- Kecepatan = jarak $\\div$ waktu (km/jam, m/s). Debit = volume $\\div$ waktu (L/menit). Harga per satuan = harga $\\div$ banyak (Rp/kg).\n- Mengubah satuan: 1 m/s = $3{,}6$ km/jam, jadi 72 km/jam = 20 m/s.',
              ),
              figure: {
                dim: 2,
                xSpan: [-2, 24],
                ySpan: [-30, 330],
                ticks: true,
                items: [
                  { t: 'curve', f: '15*x', from: 0, to: 22, color: 'a' },
                  line([8, 0], [8, 120], 'muted', { dashed: true }),
                  line([0, 120], [8, 120], 'muted', { dashed: true }),
                  line([20, 0], [20, 300], 'muted', { dashed: true }),
                  line([0, 300], [20, 300], 'muted', { dashed: true }),
                  { t: 'dot', x: 8, y: 120, color: 'result' },
                  { t: 'dot', x: 20, y: 300, color: 'result' },
                ],
                caption: L(
                  'Horizontal: minutes. Vertical: litres. The green line passes through the red points (8, 120) and (20, 300).',
                  'Mendatar: menit. Tegak: liter. Garis hijau melalui titik merah (8, 120) dan (20, 300).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Direct or Inverse?', 'Awas, Jebakan!: Senilai atau Berbalik Nilai?'),
              body: L(
                'Check yourself against these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| 6 workers take 12 days, so 9 workers take $12 \\times \\frac{9}{6} = 18$ days | More workers means FEWER days: $6 \\times 12 = 9 \\times d$, so $d = 8$ |\n| Budi is 140 cm tall at age 10, so at age 20 he is 280 cm | Height is not directly proportional to age. Use proportion only when the quotient stays the same |\n| 72 km/h = 72 m/s | $72\\,000 \\text{ m} \\div 3\\,600 \\text{ s} = 20$ m/s |',
                'Periksa dirimu dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| 6 pekerja butuh 12 hari, jadi 9 pekerja butuh $12 \\times \\frac{9}{6} = 18$ hari | Pekerja lebih banyak berarti hari LEBIH SEDIKIT: $6 \\times 12 = 9 \\times d$, jadi $d = 8$ |\n| Tinggi Budi 140 cm saat berumur 10 tahun, jadi saat 20 tahun tingginya 280 cm | Tinggi badan tidak berbanding senilai dengan umur. Pakai proporsi hanya jika hasil baginya tetap sama |\n| 72 km/jam = 72 m/s | $72\\,000 \\text{ m} \\div 3\\,600 \\text{ s} = 20$ m/s |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The figure shows two graphs. Which statement is correct?',
                'Gambar menunjukkan dua grafik. Pernyataan mana yang benar?',
              ),
              figure: {
                dim: 2,
                xSpan: [-1, 13],
                ySpan: [-1, 13],
                ticks: true,
                items: [
                  { t: 'curve', f: '2*x', from: 0, to: 6, color: 'a' },
                  { t: 'curve', f: '12/x', from: 1, to: 12, color: 'b' },
                ],
                caption: L(
                  'A green straight line through the origin and an orange curve that falls.',
                  'Garis lurus hijau yang melalui titik asal dan kurva oranye yang menurun.',
                ),
              },
              options: [
                L('The green graph shows direct proportion and the orange graph shows inverse proportion.', 'Grafik hijau menunjukkan perbandingan senilai dan grafik oranye menunjukkan perbandingan berbalik nilai.'),
                L('The green graph shows inverse proportion and the orange graph shows direct proportion.', 'Grafik hijau menunjukkan perbandingan berbalik nilai dan grafik oranye menunjukkan perbandingan senilai.'),
                L('Both graphs show direct proportion.', 'Kedua grafik menunjukkan perbandingan senilai.'),
                L('Both graphs show inverse proportion.', 'Kedua grafik menunjukkan perbandingan berbalik nilai.'),
              ],
              answer: 0,
              explain: L(
                'In direct proportion the quotient $\\frac{y}{x}$ is constant, which gives a straight line through the origin (green). In inverse proportion the product $x \\times y$ is constant, so $y$ falls as $x$ grows (orange).',
                'Pada perbandingan senilai hasil bagi $\\frac{y}{x}$ tetap, sehingga grafiknya garis lurus melalui titik asal (hijau). Pada perbandingan berbalik nilai hasil kali $x \\times y$ tetap, jadi $y$ menurun ketika $x$ bertambah (oranye).',
              ),
              hint: L(
                'One graph rises with $x$ and the other falls. Which of them goes through the origin?',
                'Satu grafik naik ketika $x$ bertambah dan yang lain turun. Grafik mana yang melalui titik asal?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: 8 workers finish a job in 15 days. How many days do 12 workers need? The total work is $8 \\times 15$ worker-days.',
                'Coba bersama: 8 pekerja menyelesaikan suatu pekerjaan dalam 15 hari. Berapa hari yang dibutuhkan 12 pekerja? Jumlah pekerjaan adalah $8 \\times 15$ hari-pekerja.',
              ),
              template: '8 \\times 15 = ___ \\quad 12 \\times d = 120 \\Rightarrow d = ___',
              blanks: ['120', '10'],
              explain: L(
                'The total work is 120 worker-days. With 12 workers: $d = 120 \\div 12 = 10$ days. More workers, fewer days.',
                'Jumlah pekerjaan adalah 120 hari-pekerja. Dengan 12 pekerja: $d = 120 \\div 12 = 10$ hari. Pekerja lebih banyak, hari lebih sedikit.',
              ),
              hint: L(
                'In inverse proportion the product (workers times days) stays the same. Divide it by 12.',
                'Pada perbandingan berbalik nilai hasil kali (pekerja kali hari) tetap sama. Bagi hasil kali itu dengan 12.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('The number of workers and the days they need to build a wall are in inverse proportion.', 'Banyak pekerja dan banyak hari yang mereka butuhkan untuk membangun tembok berbanding berbalik nilai.'),
                L('The mass of rice bought at a fixed price per kg and the price paid are in inverse proportion.', 'Massa beras yang dibeli dengan harga tetap per kg dan harga yang dibayar berbanding berbalik nilai.'),
                L('The speed of a bus and the time of a trip of fixed length are in inverse proportion.', 'Kecepatan bus dan waktu perjalanan untuk jarak yang tetap berbanding berbalik nilai.'),
                L('The age of a child and the height of the child are in direct proportion.', 'Umur seorang anak dan tinggi badannya berbanding senilai.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Workers $\\times$ days is the same total work, and speed $\\times$ time is the same distance: inverse. Price $\\div$ mass is the same price per kg: that is direct proportion, not inverse. A child grows by different amounts as years pass, so height is not proportional to age.',
                'Pekerja $\\times$ hari adalah jumlah pekerjaan yang sama, dan kecepatan $\\times$ waktu adalah jarak yang sama: berbalik nilai. Harga $\\div$ massa adalah harga per kg yang sama: itu senilai, bukan berbalik nilai. Anak bertambah tinggi dengan jumlah yang berbeda-beda tiap tahun, jadi tinggi badan tidak sebanding dengan umur.',
              ),
              hint: L(
                'Ask which stays the same: the quotient (direct), the product (inverse), or neither.',
                'Tanyakan mana yang tetap sama: hasil bagi (senilai), hasil kali (berbalik nilai), atau tidak keduanya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A train moves at a speed of 90 km/h. What is its speed in metres per second?',
                'Sebuah kereta bergerak dengan kecepatan 90 km/jam. Berapa kecepatannya dalam meter per detik?',
              ),
              options: [
                L('25 m/s', '25 m/s'),
                L('90 m/s', '90 m/s'),
                L('1.5 m/s', '1,5 m/s'),
                L('324 m/s', '324 m/s'),
              ],
              answer: 0,
              explain: L(
                '$90 \\text{ km} = 90\\,000 \\text{ m}$ and $1$ hour $= 3\\,600$ s, so $90\\,000 \\div 3\\,600 = 25$ m/s. Keeping 90 does not change the unit, 1.5 comes from dividing by 60 only, and 324 multiplies by 3.6 instead of dividing.',
                '$90 \\text{ km} = 90\\,000 \\text{ m}$ dan $1$ jam $= 3\\,600$ detik, jadi $90\\,000 \\div 3\\,600 = 25$ m/s. Tetap 90 berarti satuannya tidak diubah, 1,5 berasal dari membagi 60 saja, dan 324 mengalikan dengan 3,6, bukan membagi.',
              ),
              hint: L(
                'Change km to m and hours to seconds. Does the number of metres per second come out bigger or smaller than the km/h number?',
                'Ubah km ke m dan jam ke detik. Apakah banyak meter per detik lebih besar atau lebih kecil daripada angka km/jam?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A tap has a flow rate of 20 litres per minute. Siti fills one drum of 80 litres and 4 buckets of 10 litres each from it. How many minutes does she need in all?',
                'Sebuah keran memiliki debit 20 liter per menit. Siti mengisi satu drum 80 liter dan 4 ember yang masing-masing 10 liter dari keran itu. Berapa menit yang ia butuhkan seluruhnya?',
              ),
              blanks: [{ answer: 6, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
              hints: [
                L(
                  'First find out how many litres of water Siti needs altogether.',
                  'Cari dulu berapa liter air yang Siti butuhkan seluruhnya.',
                ),
                L(
                  'Time = volume $\\div$ flow rate. Add the drum and the buckets to get the volume.',
                  'Waktu = volume $\\div$ debit. Jumlahkan drum dan ember untuk mendapat volumenya.',
                ),
                L(
                  'The volume is $80 + 4 \\times 10 = 120$ litres. Divide by 20 litres per minute.',
                  'Volumenya $80 + 4 \\times 10 = 120$ liter. Bagi dengan 20 liter per menit.',
                ),
              ],
              explain: L(
                'The volume is $80 + 4 \\times 10 = 120$ litres, and the time is $120 \\div 20 = 6$ minutes.',
                'Volumenya $80 + 4 \\times 10 = 120$ liter, dan waktunya $120 \\div 20 = 6$ menit.',
              ),
              solution: {
                en: ['80 + 4 \\times 10 = 120 \\text{ L}', '120 \\div 20 = 6 \\text{ minutes}'],
                id: ['80 + 4 \\times 10 = 120 \\text{ L}', '120 \\div 20 = 6 \\text{ menit}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m2-s2-p',
        runtime: 'math',
        title: L('Ratio, Scale and Rate', 'Perbandingan, Skala, dan Laju'),
        brief: L(
          'Work out a speed, read a plan, share money in a ratio and solve a work problem with inverse proportion.',
          'Hitung sebuah kecepatan, baca sebuah denah, bagi uang menurut perbandingan, dan selesaikan soal pekerjaan dengan perbandingan berbalik nilai.',
        ),
        requirements: [
          L('Use ratio, scale and sharing in a ratio with the right units.', 'Memakai perbandingan, skala, dan pembagian menurut perbandingan dengan satuan yang benar.'),
          L('Tell direct from inverse proportion and use a rate.', 'Membedakan senilai dari berbalik nilai dan memakai laju.'),
        ],
        hints: [
          L('Rate = how much per one unit: divide the amount by the time.', 'Laju = berapa untuk satu satuan: bagi banyaknya dengan waktunya.'),
          L('On a map or plan, multiply by the scale number to go to real life and divide to go back. Then fix the unit.', 'Pada peta atau denah, kalikan dengan bilangan skala untuk ke ukuran sebenarnya dan bagi untuk kembali. Lalu sesuaikan satuannya.'),
          L('When the product stays the same (workers times days), it is inverse proportion.', 'Jika hasil kali tetap sama (pekerja kali hari), itu berbalik nilai.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Rudi cycles 54 km in 3 hours at a constant speed. Find his speed in km/h and then in m/s.',
              'Rudi bersepeda 54 km dalam 3 jam dengan kecepatan tetap. Cari kecepatannya dalam km/jam lalu dalam m/s.',
            ),
            inline: true,
            blanks: [
              { answer: 18, after: { en: '\\text{ km/h}', id: '\\text{ km/jam}' } },
              { answer: 5, after: '\\text{ m/s}' },
            ],
            solution: {
              en: ['54 \\div 3 = 18 \\text{ km/h}', '18 \\div 3.6 = 5 \\text{ m/s}'],
              id: ['54 \\div 3 = 18 \\text{ km/jam}', '18 \\div 3{,}6 = 5 \\text{ m/s}'],
            },
          },
          {
            prompt: L(
              'A plan has scale 1 : 250. The hall is 6 cm long on the plan. How long is the real hall, in m? The real hall is 10 m wide: how wide is it on the plan, in cm?',
              'Sebuah denah berskala 1 : 250. Aula panjangnya 6 cm pada denah. Berapa panjang aula sebenarnya, dalam m? Lebar aula sebenarnya 10 m: berapa lebarnya pada denah, dalam cm?',
            ),
            blanks: [
              { label: { en: '\\text{real length} =', id: '\\text{panjang sebenarnya} =' }, answer: 15, after: '\\text{ m}' },
              { label: { en: '\\text{width on the plan} =', id: '\\text{lebar pada denah} =' }, answer: 4, after: '\\text{ cm}' },
            ],
            solution: ['6 \\times 250 = 1\\,500 \\text{ cm} = 15 \\text{ m}', '10 \\text{ m} = 1\\,000 \\text{ cm}', '1\\,000 \\div 250 = 4 \\text{ cm}'],
          },
          {
            prompt: L(
              'Citra, Dewi and Eko share Rp360,000 in the ratio 2 : 3 : 5. How many rupiah does Eko get, and how many rupiah more than Citra?',
              'Citra, Dewi, dan Eko membagi uang Rp360.000 dengan perbandingan 2 : 3 : 5. Berapa rupiah yang diterima Eko, dan berapa rupiah lebih banyak daripada Citra?',
            ),
            blanks: [
              { label: { en: '\\text{Eko gets } \\text{Rp}', id: '\\text{Eko menerima } \\text{Rp}' }, answer: 180000 },
              { label: { en: '\\text{more than Citra } \\text{Rp}', id: '\\text{lebih dari Citra } \\text{Rp}' }, answer: 108000 },
            ],
            solution: ['2 + 3 + 5 = 10 \\quad 360\\,000 \\div 10 = 36\\,000', '\\text{Eko: } 5 \\times 36\\,000 = 180\\,000', '\\text{Citra: } 2 \\times 36\\,000 = 72\\,000 \\quad 180\\,000 - 72\\,000 = 108\\,000'],
          },
          {
            prompt: L(
              '12 workers can finish a job in 10 days. After 4 days, 4 workers leave and the other workers carry on at the same pace. How many more days do the remaining workers need? How many days does the whole job take, from the start?',
              '12 pekerja dapat menyelesaikan suatu pekerjaan dalam 10 hari. Setelah 4 hari, 4 pekerja pergi dan pekerja lainnya melanjutkan dengan kecepatan yang sama. Berapa hari lagi yang dibutuhkan pekerja yang tersisa? Berapa hari seluruh pekerjaan itu berlangsung, dihitung dari awal?',
            ),
            blanks: [
              { label: { en: '\\text{more days} =', id: '\\text{hari lagi} =' }, answer: 9 },
              { label: { en: '\\text{total days} =', id: '\\text{total hari} =' }, answer: 13 },
            ],
            solution: {
              en: ['12 \\times 10 = 120 \\text{ worker-days in all}', '12 \\times 4 = 48 \\text{ done}, \\quad 120 - 48 = 72 \\text{ left}', '12 - 4 = 8 \\text{ workers}: \\quad 72 \\div 8 = 9 \\text{ days}', '4 + 9 = 13 \\text{ days}'],
              id: ['12 \\times 10 = 120 \\text{ hari-pekerja seluruhnya}', '12 \\times 4 = 48 \\text{ selesai}, \\quad 120 - 48 = 72 \\text{ sisa}', '12 - 4 = 8 \\text{ pekerja}: \\quad 72 \\div 8 = 9 \\text{ hari}', '4 + 9 = 13 \\text{ hari}'],
            },
          },
        ],
      },
    },
  ],
}
