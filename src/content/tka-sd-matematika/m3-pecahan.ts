import type { Loc, MathBlank, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import { fit, fractionBars, fractionCircles, gridRect, numberLine, outline, rectPts, solid, txt } from './figs'

/** Module 3 — fractions: equivalent fractions, comparing and ordering,
 *  adding and subtracting, and a fraction times / divided by a WHOLE number.
 *  (Never fraction x fraction, never whole / fraction: outside the syllabus.) */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
const CYC: FigColor[] = ['a', 'b', 'c', 'result']

/** Label for a number-line tick: 0, 1/4, 1 1/2 ... `d` is the denominator the line is cut in. */
function fracFmt(d: number, o: { reduce?: boolean; mixed?: boolean } = {}) {
  return (v: number): string => {
    let n = Math.round(v * d)
    let den = d
    if (n === 0) return '0'
    if (n % den === 0) return String(n / den)
    if (o.reduce) {
      const g = gcd(n, den)
      n /= g
      den /= g
    }
    const whole = Math.floor(n / den)
    return o.mixed && whole > 0 ? `${whole} ${n - whole * den}/${den}` : `${n}/${den}`
  }
}

/** `times` copies of `per` pieces, each piece 1/den, laid end to end on bars of `den` cells.
 *  Each copy has its own color, so "3 groups of 2 fifths" can be seen as 3 groups. */
function repeatBars(den: number, per: number, times: number): Piece {
  const W = 10
  const total = per * times
  const bars = Math.ceil(total / den)
  const items: FigItem[] = []
  for (let b = 0; b < bars; b++) {
    const y0 = (bars - 1 - b) * 1.7
    for (let k = 0; k < den; k++) {
      const idx = b * den + k
      const cell = rectPts((k * W) / den, y0, W / den, 1)
      items.push(idx < total ? solid(cell, CYC[Math.floor(idx / per) % 4]) : outline(cell))
    }
  }
  return { dim: 2, axes: false, ...fit([[0, -0.2], [W + 0.2, (bars - 1) * 1.7 + 1.2]], 0.5), items }
}

/** Top bar: `p` equal parts with `s` shaded (the amount). Bottom bar: every part cut into `k`,
 *  so `p*k` small parts; the shaded small parts are shared out in `k` equal groups, one color each. */
function cutBar(p: number, s: number, k: number, labels?: [string, string]): Piece {
  const W = 10
  const items: FigItem[] = []
  for (let i = 0; i < p; i++) {
    const cell = rectPts((i * W) / p, 1.7, W / p, 1)
    items.push(i < s ? solid(cell, 'muted') : outline(cell))
  }
  const n = p * k
  for (let j = 0; j < n; j++) {
    const cell = rectPts((j * W) / n, 0, W / n, 1)
    items.push(j < s * k ? solid(cell, CYC[Math.floor(j / s) % 4]) : outline(cell))
  }
  if (labels) {
    items.push(txt(-0.4, 2.2, labels[0], 'lg', 'muted', 'end'))
    items.push(txt(-0.4, 0.5, labels[1], 'lg', 'muted', 'end'))
  }
  return { dim: 2, axes: false, ...fit([[labels ? -2.6 : 0, -0.2], [W + 0.2, 2.9]], 0.5), items }
}

const LBL_N = { en: '\\text{numerator} =', id: '\\text{pembilang} =' }
const LBL_D = { en: '\\text{denominator} =', id: '\\text{penyebut} =' }
const LBL_W = { en: '\\text{whole} =', id: '\\text{utuh} =' }

/** Two boxes for a fraction in simplest form: numerator, then denominator. */
const numDen = (n: number, d: number): MathBlank[] => [
  { label: LBL_N, answer: n },
  { label: LBL_D, answer: d },
]
/** Three boxes for a mixed number: whole, numerator, denominator. */
const mixed = (w: number, n: number, d: number): MathBlank[] => [
  { label: LBL_W, answer: w },
  { label: LBL_N, answer: n },
  { label: LBL_D, answer: d },
]

/* -------------------------------------------------------------- module */

export const module3: Module = {
  id: 'tka-m3',
  title: L('Fractions', 'Pecahan'),
  summary: L(
    'See a fraction as equal parts of a whole, compare and order fractions, add and subtract them, and multiply or divide a fraction by a whole number.',
    'Memahami pecahan sebagai bagian yang sama besar dari satu utuh, membandingkan dan mengurutkan pecahan, menjumlah dan mengurangnya, serta mengalikan dan membagi pecahan dengan bilangan asli.',
  ),
  submodules: [
    /* ======================================================= S1: understanding */
    {
      id: 'tka-m3-s1',
      title: L('Understanding Fractions', 'Memahami Pecahan'),
      summary: L(
        'Equal parts of a whole, fractions with different names but the same value, simplest form, and which fraction is bigger.',
        'Bagian yang sama besar dari satu utuh, pecahan yang namanya beda tetapi nilainya sama, bentuk paling sederhana, dan pecahan mana yang lebih besar.',
      ),
      lessons: [
        /* ---------------------------------------------------- S1 L1 equivalent */
        {
          id: 'tka-m3-s1-l1',
          title: L('Equivalent Fractions', 'Pecahan Senilai'),
          goal: L(
            'You can write the same fraction with different numbers and write it in its simplest form.',
            'Kamu bisa menulis pecahan yang sama dengan angka berbeda dan menyederhanakannya.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Different Names, Same Amount', 'Ayo Amati: Nama Berbeda, Jumlah Sama'),
              body: L(
                'Ani cuts a cake into 4 **equal parts** and eats 3 of them. That is written $\\frac{3}{4}$.\n\n- **Denominator** (bottom number): how many equal parts the whole is cut into.\n- **Numerator** (top number): how many parts we take.\n\nNow look at the three bars of the same length below. The colored part is the same size in all of them: $\\frac{1}{2}=\\frac{2}{4}=\\frac{4}{8}$. The names are different but the amount is the same. These are called **equivalent fractions**.\n\nNotice the pattern. From $\\frac{1}{2}$ to $\\frac{2}{4}$, the numerator and the denominator are both multiplied by 2. From $\\frac{1}{2}$ to $\\frac{4}{8}$, both are multiplied by 4.',
                'Ani memotong kue menjadi 4 bagian **sama besar**, lalu memakan 3 bagian. Itu ditulis $\\frac{3}{4}$.\n\n- **Penyebut** (angka bawah): kue dipotong menjadi berapa bagian sama besar.\n- **Pembilang** (angka atas): berapa bagian yang diambil.\n\nSekarang lihat tiga batang sama panjang di bawah. Bagian yang berwarna sama besar di semuanya: $\\frac{1}{2}=\\frac{2}{4}=\\frac{4}{8}$. Namanya beda, tetapi jumlahnya sama. Pecahan seperti ini disebut **pecahan senilai**.\n\nPerhatikan polanya. Dari $\\frac{1}{2}$ ke $\\frac{2}{4}$, pembilang dan penyebut sama-sama dikali 2. Dari $\\frac{1}{2}$ ke $\\frac{4}{8}$, keduanya dikali 4.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 2, shaded: 1, label: '1/2' },
                  { parts: 4, shaded: 2, label: '2/4' },
                  { parts: 8, shaded: 4, label: '4/8' },
                ]),
                caption: L(
                  'Three bars of the same length. The colored part is equally long in every bar.',
                  'Tiga batang sama panjang. Bagian yang berwarna sama panjang di setiap batang.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Simplifying a Fraction', 'Contoh Bertahap: Menyederhanakan Pecahan'),
              body: L(
                'The fraction $\\frac{12}{18}$ can be written with smaller numbers. Let us simplify it.\n\n1. Step 1: Find the greatest common factor (GCF) of 12 and 18. You learned this in the previous module: the GCF is 6.\n2. Step 2: Divide the numerator by 6: $12 \\div 6 = 2$.\n3. Step 3: Divide the denominator by 6 too: $18 \\div 6 = 3$.\n4. Step 4: Write the result: $\\frac{12}{18}=\\frac{2}{3}$. The numbers 2 and 3 share no factor except 1, so this is the **simplest form**.\n\n**Remember:**\n\n- Multiply the numerator and the denominator by the SAME number: you get an equivalent fraction.\n- Divide both by their GCF: you get the simplest form.',
                'Pecahan $\\frac{12}{18}$ bisa ditulis dengan angka yang lebih kecil. Mari kita sederhanakan.\n\n1. Langkah 1: Cari faktor persekutuan terbesar (FPB) dari 12 dan 18. Kamu sudah mempelajarinya di modul sebelumnya: FPB-nya 6.\n2. Langkah 2: Bagi pembilang dengan 6: $12 \\div 6 = 2$.\n3. Langkah 3: Bagi penyebut dengan 6 juga: $18 \\div 6 = 3$.\n4. Langkah 4: Tulis hasilnya: $\\frac{12}{18}=\\frac{2}{3}$. Angka 2 dan 3 tidak punya faktor yang sama selain 1, jadi ini **bentuk paling sederhana**.\n\n**Ingat:**\n\n- Kalikan pembilang dan penyebut dengan bilangan yang SAMA: kamu mendapat pecahan senilai.\n- Bagi keduanya dengan FPB-nya: kamu mendapat bentuk paling sederhana.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 18, shaded: 12, label: '12/18' },
                  { parts: 3, shaded: 2, label: '2/3' },
                ]),
                caption: L(
                  '12 of 18 small parts cover exactly the same length as 2 of 3 big parts.',
                  '12 dari 18 bagian kecil menutupi panjang yang sama persis dengan 2 dari 3 bagian besar.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Adding Is Not Multiplying', 'Awas, Jebakan!: Menambah Bukan Mengalikan'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $\\frac{1}{2}=\\frac{1+2}{2+2}=\\frac{3}{4}$ (adding changes the amount) | $\\frac{1}{2}=\\frac{1\\times2}{2\\times2}=\\frac{2}{4}$ (multiply both by the same number) |\n| ❌ $\\frac{6}{8}=\\frac{6}{4}$ (only the denominator was divided) | $\\frac{6}{8}=\\frac{3}{4}$ (divide both numbers) |\n| ❌ $\\frac{12}{18}=\\frac{6}{9}$ and stop (6 and 9 can still be divided by 3) | $\\frac{12}{18}=\\frac{2}{3}$ (keep going until no common factor is left) |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $\\frac{1}{2}=\\frac{1+2}{2+2}=\\frac{3}{4}$ (menambah mengubah jumlahnya) | $\\frac{1}{2}=\\frac{1\\times2}{2\\times2}=\\frac{2}{4}$ (kalikan keduanya dengan bilangan yang sama) |\n| ❌ $\\frac{6}{8}=\\frac{6}{4}$ (hanya penyebut yang dibagi) | $\\frac{6}{8}=\\frac{3}{4}$ (bagi kedua angka) |\n| ❌ $\\frac{12}{18}=\\frac{6}{9}$ lalu berhenti (6 dan 9 masih bisa dibagi 3) | $\\frac{12}{18}=\\frac{2}{3}$ (teruskan sampai tidak ada faktor yang sama) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A pizza is cut into equal parts. The colored parts have been eaten. What fraction of the pizza has been eaten?',
                'Sebuah pizza dipotong menjadi bagian-bagian sama besar. Bagian yang berwarna sudah dimakan. Berapa bagian pizza yang sudah dimakan?',
              ),
              figure: {
                ...fractionCircles([{ parts: 6, shaded: 4 }]),
                caption: L('A pizza cut into equal slices. The colored slices were eaten.', 'Sebuah pizza dipotong menjadi irisan sama besar. Irisan berwarna sudah dimakan.'),
              },
              options: [
                L('$\\frac{4}{6}$', '$\\frac{4}{6}$'),
                L('$\\frac{2}{6}$', '$\\frac{2}{6}$'),
                L('$\\frac{4}{2}$', '$\\frac{4}{2}$'),
                L('$\\frac{6}{4}$', '$\\frac{6}{4}$'),
              ],
              answer: 0,
              explain: L(
                'There are 6 equal slices in all (the denominator) and 4 are colored (the numerator). The fraction $\\frac{2}{6}$ is the part that was NOT eaten, and $\\frac{4}{2}$ compares eaten slices with the leftover slices.',
                'Ada 6 irisan sama besar seluruhnya (penyebut) dan 4 irisan berwarna (pembilang). Pecahan $\\frac{2}{6}$ adalah bagian yang BELUM dimakan, dan $\\frac{4}{2}$ membandingkan irisan yang dimakan dengan irisan yang tersisa.',
              ),
              hint: L(
                'Count all the slices of the pizza first, then count only the colored ones. Which count is the bottom number?',
                'Hitung dulu semua irisan pizza, lalu hitung hanya yang berwarna. Hitungan mana yang menjadi angka bawah?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: simplify $\\frac{8}{12}$. The GCF of 8 and 12 is 4. Divide the numerator and the denominator by 4.',
                'Coba bersama: sederhanakan $\\frac{8}{12}$. FPB dari 8 dan 12 adalah 4. Bagi pembilang dan penyebut dengan 4.',
              ),
              template: '8 \\div 4 = ___ \\quad 12 \\div 4 = ___',
              blanks: ['2', '3'],
              explain: L(
                '$\\frac{8}{12}=\\frac{2}{3}$. Both numbers were divided by the same number, 4, so the amount did not change.',
                '$\\frac{8}{12}=\\frac{2}{3}$. Kedua angka dibagi dengan bilangan yang sama, yaitu 4, jadi jumlahnya tidak berubah.',
              ),
              hint: L(
                'Divide the top number by 4 first, then the bottom number by 4.',
                'Bagi angka atas dengan 4 dulu, lalu angka bawah dengan 4.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The number line from 0 to 1 is cut into 6 equal steps. The red dot is on the 4th tick after 0. Which fraction is the red dot?',
                'Garis bilangan dari 0 sampai 1 dibagi menjadi 6 langkah sama panjang. Titik merah ada di tanda ke-4 setelah 0. Titik merah menunjukkan pecahan berapa?',
              ),
              figure: {
                ...numberLine({ from: 0, to: 1, step: 1 / 6, labelEvery: 6, marks: [{ at: 4 / 6 }] }),
                caption: L('Each small step on the line is the same length.', 'Setiap langkah kecil pada garis sama panjang.'),
              },
              options: [
                L('$\\frac{4}{6}$', '$\\frac{4}{6}$'),
                L('$\\frac{4}{7}$', '$\\frac{4}{7}$'),
                L('$\\frac{5}{6}$', '$\\frac{5}{6}$'),
                L('$\\frac{6}{4}$', '$\\frac{6}{4}$'),
              ],
              answer: 0,
              explain: L(
                'The line has 6 equal steps, so the denominator is 6, and the dot is 4 steps from 0. Counting the ticks instead of the steps gives $\\frac{4}{7}$ or $\\frac{5}{6}$.',
                'Garis punya 6 langkah sama panjang, jadi penyebutnya 6, dan titik berjarak 4 langkah dari 0. Menghitung tandanya, bukan langkahnya, memberi $\\frac{4}{7}$ atau $\\frac{5}{6}$.',
              ),
              hint: L(
                'Count the steps (the gaps between ticks), starting from 0, not the tick marks themselves.',
                'Hitung langkahnya (jarak antar tanda) mulai dari 0, bukan tanda-tandanya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The red dot is at $\\frac{3}{4}$ on this number line, which is cut into 8 equal steps. Choose the TWO fractions that name the same point.',
                'Titik merah ada di $\\frac{3}{4}$ pada garis bilangan ini, yang dibagi menjadi 8 langkah sama panjang. Pilih DUA pecahan yang menamai titik yang sama.',
              ),
              figure: {
                ...numberLine({ from: 0, to: 1, step: 1 / 8, fmt: fracFmt(8), marks: [{ at: 3 / 4 }] }),
                caption: L('A number line from 0 to 1 cut into eighths.', 'Garis bilangan dari 0 sampai 1 yang dibagi menjadi seperdelapan.'),
              },
              options: [
                L('$\\frac{6}{8}$', '$\\frac{6}{8}$'),
                L('$\\frac{9}{12}$', '$\\frac{9}{12}$'),
                L('$\\frac{5}{6}$', '$\\frac{5}{6}$'),
                L('$\\frac{3}{8}$', '$\\frac{3}{8}$'),
              ],
              answer: [0, 1],
              explain: L(
                '$\\frac{3}{4}=\\frac{6}{8}$ (multiply by 2) and $\\frac{3}{4}=\\frac{9}{12}$ (multiply by 3). The fraction $\\frac{5}{6}$ comes from ADDING 2 to both numbers, which changes the amount.',
                '$\\frac{3}{4}=\\frac{6}{8}$ (dikali 2) dan $\\frac{3}{4}=\\frac{9}{12}$ (dikali 3). Pecahan $\\frac{5}{6}$ berasal dari MENAMBAH 2 pada kedua angka, dan itu mengubah jumlahnya.',
              ),
              hint: L(
                'Multiply the top and the bottom of $\\frac{3}{4}$ by the same number, then see which options match.',
                'Kalikan angka atas dan bawah dari $\\frac{3}{4}$ dengan bilangan yang sama, lalu lihat pilihan mana yang cocok.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for simplifying $\\frac{18}{24}$ in order.', 'Urutkan langkah menyederhanakan $\\frac{18}{24}$.'),
              lines: {
                en: ['\\text{GCF of } 18 \\text{ and } 24 = 6', '18 \\div 6 = 3 \\quad 24 \\div 6 = 4', '\\frac{18}{24} = \\frac{3}{4}', '\\text{3 and 4 share no factor except 1: simplest form}'],
                id: ['\\text{FPB } 18 \\text{ dan } 24 = 6', '18 \\div 6 = 3 \\quad 24 \\div 6 = 4', '\\frac{18}{24} = \\frac{3}{4}', '\\text{3 dan 4 tidak punya faktor sama selain 1: paling sederhana}'],
              },
              explain: L(
                'First find the GCF, then divide both numbers by it, then write the new fraction and check that it cannot be simplified more.',
                'Cari FPB dulu, lalu bagi kedua angka dengan FPB itu, tulis pecahan barunya, dan periksa apakah masih bisa disederhanakan.',
              ),
              hint: L(
                'You need the number to divide by before you can divide, and you check the answer last.',
                'Kamu perlu tahu pembaginya sebelum membagi, dan memeriksa jawaban dilakukan paling akhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani ate $\\frac{3}{4}$ of a cake. Budi has a cake of the same size, cut into 12 equal pieces. How many pieces must Budi eat to eat the same amount as Ani?',
                'Ani memakan $\\frac{3}{4}$ bagian kue. Budi punya kue yang sama besar, dipotong menjadi 12 bagian sama besar. Berapa potong yang harus Budi makan agar sama banyak dengan Ani?',
              ),
              blanks: [{ answer: 9, after: { en: '\\text{ pieces}', id: '\\text{ potong}' } }],
              hints: [
                L(
                  'Ani\'s cake has 4 parts and Budi\'s has 12 parts. How many times more parts does Budi\'s cake have?',
                  'Kue Ani punya 4 bagian, kue Budi punya 12 bagian. Berapa kali lebih banyak bagian pada kue Budi?',
                ),
                L(
                  'Budi\'s cake has $12 \\div 4 = 3$ times as many parts. Multiply the numerator AND the denominator of $\\frac{3}{4}$ by that number.',
                  'Kue Budi punya $12 \\div 4 = 3$ kali lebih banyak bagian. Kalikan pembilang DAN penyebut $\\frac{3}{4}$ dengan bilangan itu.',
                ),
                L(
                  'The denominator becomes $4 \\times 3 = 12$. Do the same to the numerator 3: the result is the number of pieces.',
                  'Penyebut menjadi $4 \\times 3 = 12$. Lakukan hal yang sama pada pembilang 3: hasilnya adalah banyak potong.',
                ),
              ],
              explain: L(
                '$\\frac{3}{4}=\\frac{3\\times3}{4\\times3}=\\frac{9}{12}$, so Budi eats 9 pieces.',
                '$\\frac{3}{4}=\\frac{3\\times3}{4\\times3}=\\frac{9}{12}$, jadi Budi memakan 9 potong.',
              ),
              solution: ['12 \\div 4 = 3', '3 \\times 3 = 9', '\\frac{3}{4} = \\frac{9}{12}'],
            },
          ],
        },
        /* ----------------------------------------------- S1 L2 compare and order */
        {
          id: 'tka-m3-s1-l2',
          title: L('Comparing and Ordering Fractions', 'Membandingkan dan Mengurutkan Pecahan'),
          goal: L(
            'You can tell which fraction is bigger, put fractions in order, and change between mixed numbers and improper fractions.',
            'Kamu bisa menentukan pecahan mana yang lebih besar, mengurutkan pecahan, dan mengubah pecahan campuran menjadi pecahan tak wajar dan sebaliknya.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Which Fraction Is Bigger?', 'Ayo Amati: Pecahan Mana yang Lebih Besar?'),
              body: L(
                'Ani and Budi have cakes of the same size. Ani eats $\\frac{2}{5}$ of her cake and Budi eats $\\frac{4}{5}$ of his. Who ate more?\n\n- **Same denominator:** the pieces are the same size, so the bigger numerator is the bigger fraction. $\\frac{4}{5}>\\frac{2}{5}$.\n- **Same numerator:** the bigger the denominator, the smaller each piece. $\\frac{1}{3}>\\frac{1}{5}$.\n- **Use landmarks:** compare with $\\frac{1}{2}$ and with 1. For example, $\\frac{3}{8}$ is less than a half, and $\\frac{5}{6}$ is more than a half but less than 1.',
                'Ani dan Budi punya kue yang sama besar. Ani memakan $\\frac{2}{5}$ kuenya dan Budi memakan $\\frac{4}{5}$ kuenya. Siapa yang makan lebih banyak?\n\n- **Penyebut sama:** potongannya sama besar, jadi pembilang yang lebih besar berarti pecahan yang lebih besar. $\\frac{4}{5}>\\frac{2}{5}$.\n- **Pembilang sama:** makin besar penyebut, makin kecil tiap potongan. $\\frac{1}{3}>\\frac{1}{5}$.\n- **Pakai patokan:** bandingkan dengan $\\frac{1}{2}$ dan dengan 1. Contoh: $\\frac{3}{8}$ kurang dari setengah, dan $\\frac{5}{6}$ lebih dari setengah tetapi kurang dari 1.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 5, shaded: 2, label: 'Ani' },
                  { parts: 5, shaded: 4, label: 'Budi' },
                ]),
                caption: L('Two cakes of the same size, both cut into fifths.', 'Dua kue sama besar, keduanya dipotong menjadi seperlima.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Different Denominators', 'Contoh Bertahap: Penyebut Berbeda'),
              body: L(
                'Which is bigger, $\\frac{3}{4}$ or $\\frac{5}{6}$? The pieces are not the same size, so first we make them the same size.\n\n1. Step 1: Find the LCM of 4 and 6. Multiples of 4: 4, 8, 12. Multiples of 6: 6, 12. The LCM is 12.\n2. Step 2: Change $\\frac{3}{4}$. Since $12 \\div 4 = 3$, multiply both numbers by 3: $\\frac{3\\times3}{4\\times3}=\\frac{9}{12}$.\n3. Step 3: Change $\\frac{5}{6}$. Since $12 \\div 6 = 2$, multiply both numbers by 2: $\\frac{5\\times2}{6\\times2}=\\frac{10}{12}$.\n4. Step 4: Compare the numerators: $9<10$, so $\\frac{3}{4}<\\frac{5}{6}$.\n\n**Remember:**\n\n- Make the denominators the same, using the LCM.\n- Then compare the numerators.',
                'Mana yang lebih besar, $\\frac{3}{4}$ atau $\\frac{5}{6}$? Potongannya tidak sama besar, jadi kita samakan dulu ukurannya.\n\n1. Langkah 1: Cari KPK dari 4 dan 6. Kelipatan 4: 4, 8, 12. Kelipatan 6: 6, 12. KPK-nya 12.\n2. Langkah 2: Ubah $\\frac{3}{4}$. Karena $12 \\div 4 = 3$, kalikan kedua angka dengan 3: $\\frac{3\\times3}{4\\times3}=\\frac{9}{12}$.\n3. Langkah 3: Ubah $\\frac{5}{6}$. Karena $12 \\div 6 = 2$, kalikan kedua angka dengan 2: $\\frac{5\\times2}{6\\times2}=\\frac{10}{12}$.\n4. Langkah 4: Bandingkan pembilangnya: $9<10$, jadi $\\frac{3}{4}<\\frac{5}{6}$.\n\n**Ingat:**\n\n- Samakan penyebut dengan KPK.\n- Lalu bandingkan pembilangnya.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 4, shaded: 3, label: '3/4' },
                  { parts: 6, shaded: 5, label: '5/6' },
                  { parts: 12, shaded: 9, label: '9/12' },
                  { parts: 12, shaded: 10, label: '10/12' },
                ]),
                caption: L(
                  'Cut into twelfths, the two fractions can be compared piece by piece.',
                  'Setelah dipotong menjadi seperduabelas, kedua pecahan bisa dibandingkan potong demi potong.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Bigger Numbers Are Not Always Bigger Fractions', 'Awas, Jebakan!: Angka Besar Belum Tentu Pecahan Besar'),
              body: L(
                'Watch out for these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $\\frac{1}{3}>\\frac{1}{2}$ because 3 is bigger than 2 | $\\frac{1}{3}<\\frac{1}{2}$ (same numerator: a bigger denominator means smaller pieces) |\n| ❌ $\\frac{3}{5}>\\frac{2}{3}$ because 3>2 and 5>3 | $\\frac{3}{5}<\\frac{2}{3}$ (make the denominators equal: $\\frac{9}{15}<\\frac{10}{15}$) |\n| ❌ $2\\frac{1}{4}<1\\frac{3}{4}$ because $\\frac{1}{4}<\\frac{3}{4}$ | $2\\frac{1}{4}>1\\frac{3}{4}$ (compare the whole numbers first) |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $\\frac{1}{3}>\\frac{1}{2}$ karena 3 lebih besar dari 2 | $\\frac{1}{3}<\\frac{1}{2}$ (pembilang sama: penyebut lebih besar berarti potongan lebih kecil) |\n| ❌ $\\frac{3}{5}>\\frac{2}{3}$ karena 3>2 dan 5>3 | $\\frac{3}{5}<\\frac{2}{3}$ (samakan penyebut: $\\frac{9}{15}<\\frac{10}{15}$) |\n| ❌ $2\\frac{1}{4}<1\\frac{3}{4}$ karena $\\frac{1}{4}<\\frac{3}{4}$ | $2\\frac{1}{4}>1\\frac{3}{4}$ (bandingkan bilangan utuhnya dulu) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'On this number line, the green dot is at $\\frac{2}{3}$ and the red dot is at $\\frac{3}{4}$. Which statement is right?',
                'Pada garis bilangan ini, titik hijau ada di $\\frac{2}{3}$ dan titik merah ada di $\\frac{3}{4}$. Pernyataan mana yang benar?',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 1,
                  step: 1 / 12,
                  labelEvery: 3,
                  fmt: fracFmt(12, { reduce: true }),
                  marks: [
                    { at: 2 / 3, label: '2/3', color: 'a' },
                    { at: 3 / 4, label: '3/4', color: 'result' },
                  ],
                }),
                caption: L('A number line from 0 to 1 cut into twelfths.', 'Garis bilangan dari 0 sampai 1 yang dibagi menjadi seperduabelas.'),
              },
              options: [
                L('$\\frac{2}{3}<\\frac{3}{4}$, because the green dot is to the left of the red dot', '$\\frac{2}{3}<\\frac{3}{4}$, karena titik hijau ada di kiri titik merah'),
                L('$\\frac{2}{3}>\\frac{3}{4}$, because the denominator 3 is smaller than 4', '$\\frac{2}{3}>\\frac{3}{4}$, karena penyebut 3 lebih kecil dari 4'),
                L('$\\frac{2}{3}=\\frac{3}{4}$, because both are one step away from a whole', '$\\frac{2}{3}=\\frac{3}{4}$, karena keduanya selisih satu langkah dari satu utuh'),
                L('They cannot be compared, because the denominators are different', 'Keduanya tidak bisa dibandingkan, karena penyebutnya berbeda'),
              ],
              answer: 0,
              explain: L(
                'On a number line, the fraction further to the right is bigger. The smaller-denominator rule only works when the numerators are the same.',
                'Pada garis bilangan, pecahan yang lebih ke kanan lebih besar. Aturan penyebut lebih kecil hanya berlaku kalau pembilangnya sama.',
              ),
              hint: L(
                'On a number line, numbers grow to the right. Which dot is further right?',
                'Pada garis bilangan, bilangan makin besar ke arah kanan. Titik mana yang lebih ke kanan?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: compare $\\frac{2}{3}$ and $\\frac{3}{5}$. The LCM of 3 and 5 is 15. Find the new numerators: $\\frac{2}{3}=\\frac{?}{15}$ and $\\frac{3}{5}=\\frac{?}{15}$.',
                'Coba bersama: bandingkan $\\frac{2}{3}$ dan $\\frac{3}{5}$. KPK dari 3 dan 5 adalah 15. Cari pembilang barunya: $\\frac{2}{3}=\\frac{?}{15}$ dan $\\frac{3}{5}=\\frac{?}{15}$.',
              ),
              template: '2 \\times 5 = ___ \\quad 3 \\times 3 = ___',
              blanks: ['10', '9'],
              explain: L(
                '$\\frac{2}{3}=\\frac{10}{15}$ and $\\frac{3}{5}=\\frac{9}{15}$. Since $10>9$, the fraction $\\frac{2}{3}$ is bigger.',
                '$\\frac{2}{3}=\\frac{10}{15}$ dan $\\frac{3}{5}=\\frac{9}{15}$. Karena $10>9$, pecahan $\\frac{2}{3}$ lebih besar.',
              ),
              hint: L(
                'To get from 3 to 15 you multiply by 5. To get from 5 to 15 you multiply by 3. Do the same to the numerators.',
                'Dari 3 ke 15 kamu mengalikan dengan 5. Dari 5 ke 15 kamu mengalikan dengan 3. Lakukan hal yang sama pada pembilangnya.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Mixed Numbers and Improper Fractions', 'Contoh Bertahap: Pecahan Campuran dan Pecahan Tak Wajar'),
              body: L(
                'Citra eats 1 whole cake and $\\frac{3}{4}$ of another one. That is written $1\\frac{3}{4}$ and called a **mixed number**: a whole number together with a fraction.\n\nOne whole cake is 4 quarters. So 1 cake plus 3 quarters is 7 quarters, written $\\frac{7}{4}$. A fraction whose numerator is bigger than its denominator is called an **improper fraction**.\n\n1. Mixed number to improper fraction: for $1\\frac{3}{4}$, multiply the whole number by the denominator: $1\\times4=4$.\n2. Add the numerator: $4+3=7$. The denominator stays the same: $\\frac{7}{4}$.\n3. Improper fraction to mixed number: for $\\frac{7}{4}$, divide 7 by 4. The answer is 1 with 3 left over, so $\\frac{7}{4}=1\\frac{3}{4}$.',
                'Citra memakan 1 kue utuh dan $\\frac{3}{4}$ kue yang lain. Itu ditulis $1\\frac{3}{4}$ dan disebut **pecahan campuran**: bilangan utuh bersama pecahan.\n\nSatu kue utuh sama dengan 4 potong seperempat. Jadi 1 kue ditambah 3 potong adalah 7 potong seperempat, ditulis $\\frac{7}{4}$. Pecahan yang pembilangnya lebih besar dari penyebutnya disebut **pecahan tak wajar**.\n\n1. Campuran ke tak wajar: untuk $1\\frac{3}{4}$, kalikan bilangan utuh dengan penyebut: $1\\times4=4$.\n2. Tambahkan pembilang: $4+3=7$. Penyebut tetap sama: $\\frac{7}{4}$.\n3. Tak wajar ke campuran: untuk $\\frac{7}{4}$, bagi 7 dengan 4. Hasilnya 1 sisa 3, jadi $\\frac{7}{4}=1\\frac{3}{4}$.',
              ),
              figure: {
                ...fractionCircles([
                  { parts: 4, shaded: 4, label: '4/4' },
                  { parts: 4, shaded: 3, label: '3/4' },
                ]),
                caption: L(
                  'One whole circle (4 quarters) and 3 more quarters make 7 quarters.',
                  'Satu lingkaran utuh (4 seperempat) dan 3 seperempat lagi menjadi 7 seperempat.',
                ),
              },
            },
            {
              kind: 'fill',
              id: 'f2',
              math: true,
              prompt: L(
                'Try it together: change $3\\frac{2}{5}$ into an improper fraction. Multiply the whole number by the denominator, then add the numerator.',
                'Coba bersama: ubah $3\\frac{2}{5}$ menjadi pecahan tak wajar. Kalikan bilangan utuh dengan penyebut, lalu tambahkan pembilang.',
              ),
              template: '3 \\times 5 = ___ \\quad 15 + 2 = ___',
              blanks: ['15', '17'],
              explain: L(
                '$3\\frac{2}{5}=\\frac{3\\times5+2}{5}=\\frac{17}{5}$. Three wholes are 15 fifths, and 2 more fifths make 17 fifths.',
                '$3\\frac{2}{5}=\\frac{3\\times5+2}{5}=\\frac{17}{5}$. Tiga utuh adalah 15 seperlima, dan 2 seperlima lagi menjadi 17 seperlima.',
              ),
              hint: L(
                'Here every whole is worth 5 fifths. How many fifths are there in 3 wholes? Then add the fifths that are left over.',
                'Di sini setiap satu utuh bernilai 5 seperlima. Ada berapa seperlima dalam 3 utuh? Lalu tambahkan seperlima yang tersisa.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The red dot on the number line is a mixed number. Which improper fraction is it?',
                'Titik merah pada garis bilangan adalah pecahan campuran. Pecahan tak wajar yang mana dia?',
              ),
              figure: {
                ...numberLine({ from: 1, to: 2, step: 1 / 4, fmt: fracFmt(4, { reduce: true, mixed: true }), marks: [{ at: 1.75 }] }),
                caption: L('A number line from 1 to 2 cut into quarters.', 'Garis bilangan dari 1 sampai 2 yang dibagi menjadi seperempat.'),
              },
              options: [
                L('$\\frac{7}{4}$', '$\\frac{7}{4}$'),
                L('$\\frac{13}{4}$', '$\\frac{13}{4}$'),
                L('$\\frac{4}{7}$', '$\\frac{4}{7}$'),
                L('$\\frac{3}{4}$', '$\\frac{3}{4}$'),
              ],
              answer: 0,
              explain: L(
                'The dot is at $1\\frac{3}{4}$, and $1\\times4+3=7$, so it is $\\frac{7}{4}$. Writing the 1 next to the 3 gives $\\frac{13}{4}$, and leaving out the whole number gives $\\frac{3}{4}$.',
                'Titiknya di $1\\frac{3}{4}$, dan $1\\times4+3=7$, jadi dia $\\frac{7}{4}$. Menulis 1 di samping 3 memberi $\\frac{13}{4}$, dan melupakan bilangan utuhnya memberi $\\frac{3}{4}$.',
              ),
              hint: L(
                'First read the mixed number from the line. Then multiply the whole number by the denominator and add the numerator.',
                'Baca dulu pecahan campurannya dari garis. Lalu kalikan bilangan utuh dengan penyebut dan tambahkan pembilangnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'The three circles are pizzas of the same size, each cut into 3 equal slices. The colored slices are the pizza that is left. How much pizza is left, written as a mixed number?',
                'Ketiga lingkaran adalah pizza yang sama besar, masing-masing dipotong menjadi 3 irisan sama besar. Irisan berwarna adalah pizza yang tersisa. Berapa pizza yang tersisa, ditulis sebagai pecahan campuran?',
              ),
              figure: {
                ...fractionCircles([
                  { parts: 3, shaded: 3 },
                  { parts: 3, shaded: 3 },
                  { parts: 3, shaded: 1 },
                ]),
                caption: L('Two full pizzas and one pizza with only 1 slice of 3.', 'Dua pizza utuh dan satu pizza yang hanya tersisa 1 dari 3 irisan.'),
              },
              options: [
                L('$2\\frac{1}{3}$', '$2\\frac{1}{3}$'),
                L('$3\\frac{1}{3}$', '$3\\frac{1}{3}$'),
                L('$2\\frac{2}{3}$', '$2\\frac{2}{3}$'),
                L('$1\\frac{1}{3}$', '$1\\frac{1}{3}$'),
              ],
              answer: 0,
              explain: L(
                'There are 2 full pizzas and 1 slice of the third one, which is $\\frac{1}{3}$, so $2\\frac{1}{3}$. The answer $3\\frac{1}{3}$ counts the last pizza as a whole one and adds its slice again, and $2\\frac{2}{3}$ counts the 2 empty slices instead of the 1 colored slice.',
                'Ada 2 pizza utuh dan 1 irisan dari pizza ketiga, yaitu $\\frac{1}{3}$, jadi $2\\frac{1}{3}$. Jawaban $3\\frac{1}{3}$ menghitung pizza terakhir sebagai satu utuh lalu menambahkan irisannya lagi, dan $2\\frac{2}{3}$ menghitung 2 irisan yang kosong, bukan 1 irisan yang berwarna.',
              ),
              hint: L(
                'Count the circles that are completely colored. Then look at the last circle: how many slices are colored, out of how many?',
                'Hitung lingkaran yang berwarna penuh. Lalu lihat lingkaran terakhir: berapa irisan yang berwarna, dari berapa irisan?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\frac{3}{8}<\\frac{1}{2}$', '$\\frac{3}{8}<\\frac{1}{2}$'),
                L('$\\frac{2}{7}>\\frac{2}{5}$', '$\\frac{2}{7}>\\frac{2}{5}$'),
                L('$\\frac{9}{4}=2\\frac{1}{4}$', '$\\frac{9}{4}=2\\frac{1}{4}$'),
                L('$3\\frac{1}{2}=\\frac{31}{2}$', '$3\\frac{1}{2}=\\frac{31}{2}$'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$\\frac{3}{8}$ is less than $\\frac{4}{8}=\\frac{1}{2}$. With the same numerator, $\\frac{2}{7}$ has smaller pieces than $\\frac{2}{5}$, so it is smaller. $9\\div4=2$ remainder 1. And $3\\frac{1}{2}=\\frac{3\\times2+1}{2}=\\frac{7}{2}$, not $\\frac{31}{2}$.',
                '$\\frac{3}{8}$ kurang dari $\\frac{4}{8}=\\frac{1}{2}$. Dengan pembilang sama, $\\frac{2}{7}$ punya potongan lebih kecil daripada $\\frac{2}{5}$, jadi lebih kecil. $9\\div4=2$ sisa 1. Dan $3\\frac{1}{2}=\\frac{3\\times2+1}{2}=\\frac{7}{2}$, bukan $\\frac{31}{2}$.',
              ),
              hint: L(
                'For each one, picture bars or a number line. For mixed numbers, multiply the whole number by the denominator, then add.',
                'Untuk tiap pernyataan, bayangkan batang atau garis bilangan. Untuk pecahan campuran, kalikan bilangan utuh dengan penyebut, lalu tambahkan.',
              ),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'Dewi lays 23 pieces of ribbon end to end. Each piece is $\\frac{1}{4}$ m long, so the whole length is $\\frac{23}{4}$ m. Write the length as a mixed number.',
                'Dewi menyambung 23 potong pita ujung ke ujung. Tiap potong panjangnya $\\frac{1}{4}$ m, jadi panjang seluruhnya $\\frac{23}{4}$ m. Tulis panjangnya sebagai pecahan campuran.',
              ),
              inline: true,
              blanks: mixed(5, 3, 4),
              hints: [
                L(
                  'The numerator is bigger than the denominator, so there are whole meters inside. How many quarters make one whole meter?',
                  'Pembilangnya lebih besar dari penyebut, jadi ada meter utuh di dalamnya. Berapa seperempat yang membentuk satu meter utuh?',
                ),
                L(
                  'Divide the numerator by the denominator. The whole part is how many times 4 fits into 23, and the leftover is the new numerator.',
                  'Bagi pembilang dengan penyebut. Bagian utuhnya adalah berapa kali 4 muat di dalam 23, dan sisanya menjadi pembilang baru.',
                ),
                L(
                  'Check how close you are: $5\\times4=20$. How many quarters are left over from 23?',
                  'Periksa dengan: $5\\times4=20$. Berapa seperempat yang tersisa dari 23?',
                ),
              ],
              explain: L(
                '$23\\div4=5$ remainder 3, so $\\frac{23}{4}=5\\frac{3}{4}$ m: five whole meters and three quarters more.',
                '$23\\div4=5$ sisa 3, jadi $\\frac{23}{4}=5\\frac{3}{4}$ m: lima meter utuh dan tiga seperempat lagi.',
              ),
              solution: ['23 = 5 \\times 4 + 3', '\\frac{23}{4}=5\\frac{3}{4}'],
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Four ribbons: Ani has $\\frac{3}{4}$ m, Budi has $\\frac{2}{3}$ m, Citra has $\\frac{5}{6}$ m and Dewi has $\\frac{7}{12}$ m. Write all four with denominator 12. Then type the four numerators in order, from the shortest ribbon to the longest.',
                'Empat pita: Ani punya $\\frac{3}{4}$ m, Budi punya $\\frac{2}{3}$ m, Citra punya $\\frac{5}{6}$ m, dan Dewi punya $\\frac{7}{12}$ m. Tulis keempatnya dengan penyebut 12. Lalu ketik keempat pembilangnya berurutan, dari pita terpendek sampai terpanjang.',
              ),
              inline: true,
              blanks: [
                { answer: 7, after: '/12' },
                { answer: 8, after: '/12' },
                { answer: 9, after: '/12' },
                { answer: 10, after: '/12' },
              ],
              hints: [
                L(
                  'The denominators are 4, 3, 6 and 12. Which number can they all be changed into?',
                  'Penyebutnya 4, 3, 6, dan 12. Menjadi bilangan berapa semuanya bisa diubah?',
                ),
                L(
                  'The LCM is 12, which the problem already tells you. For $\\frac{3}{4}$, multiply the top and the bottom by $12\\div4=3$.',
                  'KPK-nya 12, seperti yang sudah dikatakan soal. Untuk $\\frac{3}{4}$, kalikan angka atas dan bawah dengan $12\\div4=3$.',
                ),
                L(
                  '$\\frac{3}{4}=\\frac{9}{12}$ and $\\frac{2}{3}=\\frac{8}{12}$. Do the same for $\\frac{5}{6}$, then list the four numerators from the smallest.',
                  '$\\frac{3}{4}=\\frac{9}{12}$ dan $\\frac{2}{3}=\\frac{8}{12}$. Lakukan hal yang sama untuk $\\frac{5}{6}$, lalu tulis keempat pembilangnya dari yang terkecil.',
                ),
              ],
              explain: L(
                'The ribbons are $\\frac{7}{12}$ (Dewi), $\\frac{8}{12}$ (Budi), $\\frac{9}{12}$ (Ani) and $\\frac{10}{12}$ (Citra). With equal denominators, the bigger numerator is the longer ribbon.',
                'Pitanya adalah $\\frac{7}{12}$ (Dewi), $\\frac{8}{12}$ (Budi), $\\frac{9}{12}$ (Ani), dan $\\frac{10}{12}$ (Citra). Dengan penyebut sama, pembilang yang lebih besar berarti pita yang lebih panjang.',
              ),
              solution: ['\\frac{3}{4}=\\frac{9}{12} \\quad \\frac{2}{3}=\\frac{8}{12} \\quad \\frac{5}{6}=\\frac{10}{12} \\quad \\frac{7}{12}', '7 < 8 < 9 < 10'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m3-s1-p',
        runtime: 'math',
        title: L('Equivalent Fractions and Comparing', 'Pecahan Senilai dan Membandingkan'),
        brief: L(
          'Write fractions in different ways, simplify them, and decide which is bigger, in plain sums and in pizza and number problems.',
          'Tulis pecahan dengan cara berbeda, sederhanakan, dan tentukan mana yang lebih besar, dalam hitungan biasa serta soal pizza dan teka-teki bilangan.',
        ),
        requirements: [
          L('Make equivalent fractions by multiplying or dividing both numbers by the same number.', 'Membuat pecahan senilai dengan mengalikan atau membagi kedua angka dengan bilangan yang sama.'),
          L('Compare fractions by making their denominators equal.', 'Membandingkan pecahan dengan menyamakan penyebutnya.'),
        ],
        hints: [
          L('For every fraction trick, ask: did I do the SAME thing to the top and the bottom?', 'Untuk setiap soal pecahan, tanyakan: apakah aku melakukan hal yang SAMA pada angka atas dan bawah?'),
          L('To simplify, look for the biggest number that divides both numbers (the GCF).', 'Untuk menyederhanakan, cari bilangan terbesar yang membagi kedua angka (FPB).'),
          L('To compare, change the fractions to the same denominator first.', 'Untuk membandingkan, ubah pecahan ke penyebut yang sama terlebih dahulu.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L('Find the missing numerator of the equivalent fraction.', 'Cari pembilang yang hilang pada pecahan senilai ini.'),
            given: '\\frac{3}{5}=\\frac{?}{20}',
            blanks: [{ label: LBL_N, answer: 12 }],
            solution: ['20 \\div 5 = 4', '3 \\times 4 = 12', '\\frac{3}{5}=\\frac{12}{20}'],
          },
          {
            prompt: L('Write $\\frac{24}{36}$ in its simplest form.', 'Tulis $\\frac{24}{36}$ dalam bentuk paling sederhana.'),
            inline: true,
            blanks: numDen(2, 3),
            solution: ['\\text{GCF}(24,36)=12', '24 \\div 12 = 2 \\quad 36 \\div 12 = 3', '\\frac{24}{36}=\\frac{2}{3}'],
          },
          {
            prompt: L(
              'Siti ate $\\frac{5}{8}$ of a pizza and Eko ate $\\frac{3}{4}$ of a pizza of the same size. If Eko\'s pizza is cut into 8 equal pieces, how many pieces did he eat? Then type 1 if Siti ate more, or 2 if Eko ate more.',
              'Siti memakan $\\frac{5}{8}$ bagian pizza dan Eko memakan $\\frac{3}{4}$ bagian pizza yang sama besar. Jika pizza Eko dipotong menjadi 8 bagian sama besar, berapa potong yang ia makan? Lalu ketik 1 jika Siti makan lebih banyak, atau 2 jika Eko makan lebih banyak.',
            ),
            blanks: [
              { label: { en: '\\text{pieces Eko ate} =', id: '\\text{potong yang Eko makan} =' }, answer: 6 },
              { label: { en: '\\text{who ate more} =', id: '\\text{yang makan lebih banyak} =' }, answer: 2 },
            ],
            solution: ['\\frac{3}{4}=\\frac{3\\times2}{4\\times2}=\\frac{6}{8}', '6 > 5 \\Rightarrow 2'],
          },
          {
            prompt: L(
              'Dewi thinks of a fraction $\\frac{a}{12}$, where $a$ is a whole number. The fraction is bigger than $\\frac{1}{2}$ and smaller than $\\frac{3}{4}$. What are the smallest and the biggest possible values of $a$?',
              'Dewi memikirkan pecahan $\\frac{a}{12}$, dengan $a$ bilangan asli. Pecahan itu lebih besar dari $\\frac{1}{2}$ dan lebih kecil dari $\\frac{3}{4}$. Berapa nilai $a$ yang terkecil dan yang terbesar?',
            ),
            figure: {
              ...numberLine({
                from: 0,
                to: 1,
                step: 1 / 12,
                labelEvery: 3,
                fmt: fracFmt(12, { reduce: true }),
                marks: [
                  { at: 1 / 2, label: '1/2', color: 'a' },
                  { at: 3 / 4, label: '3/4', color: 'result' },
                ],
              }),
              caption: L('The fraction must lie between the two dots.', 'Pecahan itu harus terletak di antara kedua titik.'),
            },
            blanks: [
              { label: { en: '\\text{smallest } a =', id: '\\text{terkecil } a =' }, answer: 7 },
              { label: { en: '\\text{biggest } a =', id: '\\text{terbesar } a =' }, answer: 8 },
            ],
            solution: ['\\frac{1}{2}=\\frac{6}{12} \\quad \\frac{3}{4}=\\frac{9}{12}', '6 < a < 9 \\Rightarrow a = 7 \\text{ or } 8', 'a = 7 \\quad a = 8'],
          },
        ],
      },
    },

    /* ================================================== S2: add and subtract */
    {
      id: 'tka-m3-s2',
      title: L('Adding and Subtracting Fractions', 'Menjumlah dan Mengurang Pecahan'),
      summary: L(
        'Add and subtract fractions with the same denominator, then with different denominators, including mixed numbers.',
        'Menjumlah dan mengurang pecahan dengan penyebut sama, lalu dengan penyebut berbeda, termasuk pecahan campuran.',
      ),
      lessons: [
        /* ------------------------------------------------ S2 L1 same denominator */
        {
          id: 'tka-m3-s2-l1',
          title: L('Same Denominator', 'Penyebut Sama'),
          goal: L(
            'You can add and subtract fractions with the same denominator, including mixed numbers.',
            'Kamu bisa menjumlah dan mengurang pecahan yang penyebutnya sama, termasuk pecahan campuran.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Putting Equal Parts Together', 'Ayo Amati: Menggabung Bagian yang Sama Besar'),
              body: L(
                'Ani eats $\\frac{2}{8}$ of a pizza and Budi eats $\\frac{3}{8}$ of it. How much did they eat together?\n\nThe slices are all the same size: eighths. We can count them like objects: 2 slices + 3 slices = 5 slices. So $\\frac{2}{8}+\\frac{3}{8}=\\frac{5}{8}$.\n\n- The **denominator** is the name of the slice (eighths), so it stays the same.\n- Only the **numerators** are added or subtracted. Taking away works the same way: $\\frac{5}{8}-\\frac{2}{8}=\\frac{3}{8}$.',
                'Ani memakan $\\frac{2}{8}$ pizza dan Budi memakan $\\frac{3}{8}$ pizza. Berapa yang mereka makan bersama?\n\nIrisannya sama besar: seperdelapan. Kita bisa menghitungnya seperti benda: 2 irisan + 3 irisan = 5 irisan. Jadi $\\frac{2}{8}+\\frac{3}{8}=\\frac{5}{8}$.\n\n- **Penyebut** adalah nama irisannya (seperdelapan), jadi tetap sama.\n- Hanya **pembilang** yang dijumlah atau dikurangi. Mengurangi caranya sama: $\\frac{5}{8}-\\frac{2}{8}=\\frac{3}{8}$.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 8, shaded: 2, label: '2/8' },
                  { parts: 8, shaded: 3, label: '3/8' },
                  { parts: 8, shaded: 5, label: '5/8' },
                ]),
                caption: L('2 eighths and 3 eighths together make 5 eighths.', '2 seperdelapan dan 3 seperdelapan bersama-sama menjadi 5 seperdelapan.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Mixed Numbers and a Sum Bigger Than 1', 'Contoh Bertahap: Pecahan Campuran dan Jumlah Lebih dari 1'),
              body: L(
                'Let us add $2\\frac{5}{6}+1\\frac{4}{6}$.\n\n1. Step 1: Add the whole numbers: $2+1=3$.\n2. Step 2: Add the fractions: $\\frac{5}{6}+\\frac{4}{6}=\\frac{9}{6}$.\n3. Step 3: $\\frac{9}{6}$ is more than 1. Divide 9 by 6: 1 with 3 left over, so $\\frac{9}{6}=1\\frac{3}{6}$.\n4. Step 4: Put it together: $3+1\\frac{3}{6}=4\\frac{3}{6}$.\n5. Step 5: Simplify the fraction part: $\\frac{3}{6}=\\frac{1}{2}$. The answer is $4\\frac{1}{2}$.\n\n**Remember:**\n\n- The denominator stays; add or subtract the numerators.\n- If the fraction part is 1 or more, change it to a mixed number. Then simplify.',
                'Mari kita jumlahkan $2\\frac{5}{6}+1\\frac{4}{6}$.\n\n1. Langkah 1: Jumlahkan bilangan utuhnya: $2+1=3$.\n2. Langkah 2: Jumlahkan pecahannya: $\\frac{5}{6}+\\frac{4}{6}=\\frac{9}{6}$.\n3. Langkah 3: $\\frac{9}{6}$ lebih dari 1. Bagi 9 dengan 6: 1 sisa 3, jadi $\\frac{9}{6}=1\\frac{3}{6}$.\n4. Langkah 4: Gabungkan: $3+1\\frac{3}{6}=4\\frac{3}{6}$.\n5. Langkah 5: Sederhanakan bagian pecahannya: $\\frac{3}{6}=\\frac{1}{2}$. Jawabannya $4\\frac{1}{2}$.\n\n**Ingat:**\n\n- Penyebut tetap; jumlahkan atau kurangkan pembilangnya.\n- Kalau bagian pecahannya 1 atau lebih, ubah menjadi pecahan campuran. Lalu sederhanakan.',
              ),
              figure: {
                ...fractionCircles([
                  { parts: 6, shaded: 5, label: '5/6' },
                  { parts: 6, shaded: 4, label: '4/6' },
                ]),
                caption: L(
                  '5 sixths and 4 sixths make 9 sixths: one whole circle and 3 sixths more.',
                  '5 seperenam dan 4 seperenam menjadi 9 seperenam: satu lingkaran utuh dan 3 seperenam lagi.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Adding the Denominators', 'Awas, Jebakan!: Menjumlah Penyebutnya'),
              body: L(
                'Be careful with these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $\\frac{2}{8}+\\frac{3}{8}=\\frac{5}{16}$ (the denominators were added) | $\\frac{2}{8}+\\frac{3}{8}=\\frac{5}{8}$ (the slices are still eighths) |\n| ❌ $2\\frac{3}{5}+1\\frac{3}{5}=3\\frac{6}{5}$ and stop (the fraction part is bigger than 1) | $2\\frac{3}{5}+1\\frac{3}{5}=3\\frac{6}{5}=4\\frac{1}{5}$ |\n| ❌ $\\frac{1}{6}+\\frac{3}{6}=\\frac{4}{6}$ and stop (not in simplest form) | $\\frac{1}{6}+\\frac{3}{6}=\\frac{4}{6}=\\frac{2}{3}$ |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $\\frac{2}{8}+\\frac{3}{8}=\\frac{5}{16}$ (penyebutnya ikut dijumlah) | $\\frac{2}{8}+\\frac{3}{8}=\\frac{5}{8}$ (irisannya tetap seperdelapan) |\n| ❌ $2\\frac{3}{5}+1\\frac{3}{5}=3\\frac{6}{5}$ lalu berhenti (bagian pecahannya lebih dari 1) | $2\\frac{3}{5}+1\\frac{3}{5}=3\\frac{6}{5}=4\\frac{1}{5}$ |\n| ❌ $\\frac{1}{6}+\\frac{3}{6}=\\frac{4}{6}$ lalu berhenti (belum paling sederhana) | $\\frac{1}{6}+\\frac{3}{6}=\\frac{4}{6}=\\frac{2}{3}$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Eko painted part of a fence in the morning (the first bar) and Fitri painted part in the afternoon (the second bar). How much of the fence has been painted in all?',
                'Eko mengecat sebagian pagar di pagi hari (batang pertama) dan Fitri mengecat sebagian di siang hari (batang kedua). Berapa bagian pagar yang sudah dicat seluruhnya?',
              ),
              figure: {
                ...fractionBars([
                  { parts: 10, shaded: 3, label: 'Eko' },
                  { parts: 10, shaded: 4, label: 'Fitri' },
                ]),
                caption: L('Two bars of the same fence, each cut into tenths.', 'Dua batang untuk pagar yang sama, masing-masing dipotong menjadi sepersepuluh.'),
              },
              options: [
                L('$\\frac{7}{10}$', '$\\frac{7}{10}$'),
                L('$\\frac{7}{20}$', '$\\frac{7}{20}$'),
                L('$\\frac{1}{10}$', '$\\frac{1}{10}$'),
                L('$\\frac{12}{10}$', '$\\frac{12}{10}$'),
              ],
              answer: 0,
              explain: L(
                '3 tenths + 4 tenths = 7 tenths. Adding the denominators gives $\\frac{7}{20}$, subtracting gives $\\frac{1}{10}$, and multiplying the numerators gives $\\frac{12}{10}$.',
                '3 persepuluh + 4 persepuluh = 7 persepuluh. Menjumlah penyebut memberi $\\frac{7}{20}$, mengurangi memberi $\\frac{1}{10}$, dan mengalikan pembilang memberi $\\frac{12}{10}$.',
              ),
              hint: L(
                'The pieces are all tenths. Read each bar, then decide: do the amounts join together, or does one take away from the other?',
                'Semua potongan adalah sepersepuluh. Baca tiap batang, lalu putuskan: apakah jumlahnya digabung, atau yang satu mengurangi yang lain?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: $\\frac{2}{5}+\\frac{4}{5}$. Add the numerators. Then divide the new numerator by 5 to change $\\frac{6}{5}$ into a mixed number.',
                'Coba bersama: $\\frac{2}{5}+\\frac{4}{5}$. Jumlahkan pembilangnya. Lalu bagi pembilang baru dengan 5 untuk mengubah $\\frac{6}{5}$ menjadi pecahan campuran.',
              ),
              template: {
                en: '2 + 4 = ___ \\quad 6 \\div 5 = ___ \\text{ remainder } ___',
                id: '2 + 4 = ___ \\quad 6 \\div 5 = ___ \\text{ sisa } ___',
              },
              blanks: ['6', '1', '1'],
              explain: L(
                '$\\frac{2}{5}+\\frac{4}{5}=\\frac{6}{5}=1\\frac{1}{5}$: one whole and one fifth more.',
                '$\\frac{2}{5}+\\frac{4}{5}=\\frac{6}{5}=1\\frac{1}{5}$: satu utuh dan satu seperlima lagi.',
              ),
              hint: L(
                'The denominator 5 stays. Add only the top numbers, then see how many whole 5s fit into the sum.',
                'Penyebut 5 tetap. Jumlahkan hanya angka atasnya, lalu lihat berapa kali 5 utuh muat di dalam hasilnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Mum has $\\frac{7}{8}$ of a tray of cake (the first bar). The children eat $\\frac{3}{8}$ of a tray (the second bar). Which fraction of a tray is left, in simplest form?',
                'Ibu punya $\\frac{7}{8}$ loyang kue (batang pertama). Anak-anak memakan $\\frac{3}{8}$ loyang (batang kedua). Berapa bagian loyang yang tersisa, dalam bentuk paling sederhana?',
              ),
              figure: {
                ...fractionBars([
                  { parts: 8, shaded: 7, label: '7/8' },
                  { parts: 8, shaded: 3, label: '3/8' },
                ]),
                caption: L('First bar: the cake Mum has. Second bar: the cake eaten.', 'Batang pertama: kue yang Ibu punya. Batang kedua: kue yang dimakan.'),
              },
              options: [
                L('$\\frac{1}{2}$', '$\\frac{1}{2}$'),
                L('$\\frac{4}{8}$', '$\\frac{4}{8}$'),
                L('$\\frac{10}{8}$', '$\\frac{10}{8}$'),
                L('$\\frac{4}{16}$', '$\\frac{4}{16}$'),
              ],
              answer: 0,
              explain: L(
                '$\\frac{7}{8}-\\frac{3}{8}=\\frac{4}{8}=\\frac{1}{2}$. The fraction $\\frac{4}{8}$ is right but not simplified, $\\frac{10}{8}$ added instead of subtracting, and $\\frac{4}{16}$ subtracted the numerators but added the denominators.',
                '$\\frac{7}{8}-\\frac{3}{8}=\\frac{4}{8}=\\frac{1}{2}$. Pecahan $\\frac{4}{8}$ nilainya benar tetapi belum sederhana, $\\frac{10}{8}$ menjumlah padahal harus mengurang, dan $\\frac{4}{16}$ mengurangi pembilang tetapi menjumlah penyebut.',
              ),
              hint: L(
                'Take the eaten part away from the part made, then check whether the answer can be simplified.',
                'Kurangkan bagian yang dimakan dari bagian yang dibuat, lalu periksa apakah hasilnya masih bisa disederhanakan.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the TWO statements that are correct.', 'Pilih DUA pernyataan yang benar.'),
              options: [
                L('$\\frac{3}{5}+\\frac{2}{5}=1$', '$\\frac{3}{5}+\\frac{2}{5}=1$'),
                L('$\\frac{7}{9}-\\frac{4}{9}=\\frac{1}{3}$', '$\\frac{7}{9}-\\frac{4}{9}=\\frac{1}{3}$'),
                L('$\\frac{2}{7}+\\frac{3}{7}=\\frac{5}{14}$', '$\\frac{2}{7}+\\frac{3}{7}=\\frac{5}{14}$'),
                L('$\\frac{5}{8}-\\frac{3}{8}=\\frac{8}{8}$', '$\\frac{5}{8}-\\frac{3}{8}=\\frac{8}{8}$'),
              ],
              answer: [0, 1],
              explain: L(
                '$\\frac{3}{5}+\\frac{2}{5}=\\frac{5}{5}=1$ and $\\frac{7}{9}-\\frac{4}{9}=\\frac{3}{9}=\\frac{1}{3}$. The other two have a denominator that was added, or a subtraction that was turned into an addition.',
                '$\\frac{3}{5}+\\frac{2}{5}=\\frac{5}{5}=1$ dan $\\frac{7}{9}-\\frac{4}{9}=\\frac{3}{9}=\\frac{1}{3}$. Dua yang lain penyebutnya ikut dijumlah, atau pengurangan yang berubah menjadi penjumlahan.',
              ),
              hint: L(
                'Check each one: does the denominator stay the same? Then recompute the numerator with the right operation.',
                'Periksa satu per satu: apakah penyebutnya tetap sama? Lalu hitung ulang pembilangnya dengan operasi yang tepat.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L(
                'Put the steps for $3\\frac{4}{7}+2\\frac{5}{7}$ in order. Work with the whole numbers first.',
                'Urutkan langkah menghitung $3\\frac{4}{7}+2\\frac{5}{7}$. Kerjakan bilangan utuhnya lebih dulu.',
              ),
              lines: {
                en: ['\\text{Add the whole numbers: } 3 + 2 = 5', '\\text{Add the fractions: } \\frac{4}{7}+\\frac{5}{7}=\\frac{9}{7}', '\\frac{9}{7} = 1\\frac{2}{7}', '5 + 1\\frac{2}{7} = 6\\frac{2}{7}'],
                id: ['\\text{Jumlahkan bilangan utuh: } 3 + 2 = 5', '\\text{Jumlahkan pecahan: } \\frac{4}{7}+\\frac{5}{7}=\\frac{9}{7}', '\\frac{9}{7} = 1\\frac{2}{7}', '5 + 1\\frac{2}{7} = 6\\frac{2}{7}'],
              },
              explain: L(
                'Add the whole numbers, add the fractions, change a fraction bigger than 1 into a mixed number, and join the two results.',
                'Jumlahkan bilangan utuh, jumlahkan pecahan, ubah pecahan yang lebih dari 1 menjadi pecahan campuran, lalu gabungkan kedua hasilnya.',
              ),
              hint: L(
                'The whole-number sum comes first, and the very last step joins everything together.',
                'Jumlah bilangan utuh dikerjakan pertama, dan langkah paling akhir menggabungkan semuanya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Mrs. Siti buys $1\\frac{5}{8}$ kg of sugar in the morning and $2\\frac{6}{8}$ kg in the afternoon. How many kilograms of sugar does she buy in all? Write the answer as a mixed number.',
                'Bu Siti membeli $1\\frac{5}{8}$ kg gula di pagi hari dan $2\\frac{6}{8}$ kg di sore hari. Berapa kilogram gula yang ia beli seluruhnya? Tulis jawabannya sebagai pecahan campuran.',
              ),
              inline: true,
              blanks: mixed(4, 3, 8),
              hints: [
                L(
                  'Both amounts are in eighths, so you can add them straight away. Do the whole numbers and the fractions separately.',
                  'Kedua jumlah dalam seperdelapan, jadi bisa langsung dijumlah. Kerjakan bilangan utuh dan pecahannya secara terpisah.',
                ),
                L(
                  'Whole numbers: $1+2=3$. Fractions: $\\frac{5}{8}+\\frac{6}{8}$. Is the result more than 1?',
                  'Bilangan utuh: $1+2=3$. Pecahan: $\\frac{5}{8}+\\frac{6}{8}$. Apakah hasilnya lebih dari 1?',
                ),
                L(
                  '$\\frac{5}{8}+\\frac{6}{8}=\\frac{11}{8}$, which is one whole and some eighths. Add that whole to the 3.',
                  '$\\frac{5}{8}+\\frac{6}{8}=\\frac{11}{8}$, yaitu satu utuh dan beberapa seperdelapan. Tambahkan satu utuh itu pada 3.',
                ),
              ],
              explain: L(
                '$3+\\frac{11}{8}=3+1\\frac{3}{8}=4\\frac{3}{8}$ kg. The fraction $\\frac{3}{8}$ cannot be simplified.',
                '$3+\\frac{11}{8}=3+1\\frac{3}{8}=4\\frac{3}{8}$ kg. Pecahan $\\frac{3}{8}$ tidak bisa disederhanakan.',
              ),
              solution: ['1 + 2 = 3', '\\frac{5}{8}+\\frac{6}{8}=\\frac{11}{8}=1\\frac{3}{8}', '3 + 1\\frac{3}{8} = 4\\frac{3}{8}'],
            },
          ],
        },
        /* -------------------------------------------- S2 L2 different denominators */
        {
          id: 'tka-m3-s2-l2',
          title: L('Different Denominators', 'Penyebut Berbeda'),
          goal: L(
            'You can add and subtract fractions with different denominators, including mixed numbers with borrowing.',
            'Kamu bisa menjumlah dan mengurang pecahan yang penyebutnya berbeda, termasuk pecahan campuran dengan meminjam.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: The Pieces Must Be the Same Size', 'Ayo Amati: Potongan Harus Sama Besar'),
              body: L(
                'Ani eats $\\frac{1}{2}$ of a pizza and Budi eats $\\frac{1}{4}$ of it. A half-slice and a quarter-slice are not the same size, so we cannot just count slices.\n\nFirst cut the half into quarters: $\\frac{1}{2}=\\frac{2}{4}$. Now all the slices are quarters, and $\\frac{2}{4}+\\frac{1}{4}=\\frac{3}{4}$.\n\n- Making the slices the same size means making the **denominators** the same.\n- Use the LCM of the denominators, then add or subtract as before.',
                'Ani memakan $\\frac{1}{2}$ pizza dan Budi memakan $\\frac{1}{4}$ pizza. Satu irisan setengah dan satu irisan seperempat tidak sama besar, jadi kita tidak bisa langsung menghitung irisan.\n\nPotong dulu setengah itu menjadi seperempat: $\\frac{1}{2}=\\frac{2}{4}$. Sekarang semua irisan adalah seperempat, dan $\\frac{2}{4}+\\frac{1}{4}=\\frac{3}{4}$.\n\n- Menyamakan ukuran irisan berarti menyamakan **penyebut**.\n- Pakai KPK dari penyebutnya, lalu jumlahkan atau kurangkan seperti tadi.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 2, shaded: 1, label: '1/2' },
                  { parts: 4, shaded: 1, label: '1/4' },
                  { parts: 4, shaded: 3, label: '3/4' },
                ]),
                caption: L('A half is 2 quarters, so a half and a quarter together are 3 quarters.', 'Setengah sama dengan 2 seperempat, jadi setengah ditambah seperempat menjadi 3 seperempat.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Adding with Different Denominators', 'Contoh Bertahap: Menjumlah dengan Penyebut Berbeda'),
              body: L(
                'Let us add $\\frac{2}{3}+\\frac{3}{4}$.\n\n1. Step 1: Find the LCM of 3 and 4. It is 12.\n2. Step 2: Change $\\frac{2}{3}$ into twelfths. Since $12\\div3=4$: $\\frac{2\\times4}{3\\times4}=\\frac{8}{12}$.\n3. Step 3: Change $\\frac{3}{4}$ into twelfths. Since $12\\div4=3$: $\\frac{3\\times3}{4\\times3}=\\frac{9}{12}$.\n4. Step 4: Add the numerators: $\\frac{8}{12}+\\frac{9}{12}=\\frac{17}{12}$.\n5. Step 5: Change to a mixed number: $17\\div12=1$ remainder 5, so the answer is $1\\frac{5}{12}$.\n\n**Remember:**\n\n- Same size pieces first (LCM), then add or subtract the numerators.\n- Finish by simplifying, or changing to a mixed number.',
                'Mari kita jumlahkan $\\frac{2}{3}+\\frac{3}{4}$.\n\n1. Langkah 1: Cari KPK dari 3 dan 4. Hasilnya 12.\n2. Langkah 2: Ubah $\\frac{2}{3}$ menjadi seperduabelas. Karena $12\\div3=4$: $\\frac{2\\times4}{3\\times4}=\\frac{8}{12}$.\n3. Langkah 3: Ubah $\\frac{3}{4}$ menjadi seperduabelas. Karena $12\\div4=3$: $\\frac{3\\times3}{4\\times3}=\\frac{9}{12}$.\n4. Langkah 4: Jumlahkan pembilangnya: $\\frac{8}{12}+\\frac{9}{12}=\\frac{17}{12}$.\n5. Langkah 5: Ubah ke pecahan campuran: $17\\div12=1$ sisa 5, jadi jawabannya $1\\frac{5}{12}$.\n\n**Ingat:**\n\n- Samakan ukuran potongan dulu (KPK), baru jumlahkan atau kurangkan pembilangnya.\n- Akhiri dengan menyederhanakan, atau mengubah ke pecahan campuran.',
              ),
              figure: {
                ...fractionBars([
                  { parts: 3, shaded: 2, label: '2/3' },
                  { parts: 4, shaded: 3, label: '3/4' },
                  { parts: 12, shaded: 8, label: '8/12' },
                  { parts: 12, shaded: 9, label: '9/12' },
                ]),
                caption: L('In twelfths, the pieces of both fractions are the same size.', 'Dalam seperduabelas, potongan kedua pecahan sama besar.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Subtracting Mixed Numbers', 'Contoh Bertahap: Mengurang Pecahan Campuran'),
              body: L(
                'Let us find $3\\frac{1}{4}-1\\frac{3}{4}$. The fraction $\\frac{1}{4}$ is too small to take $\\frac{3}{4}$ away from it, so we borrow a whole. The safe way is to change both numbers to improper fractions.\n\n1. Step 1: Change $3\\frac{1}{4}$: $3\\times4+1=13$, so it is $\\frac{13}{4}$.\n2. Step 2: Change $1\\frac{3}{4}$: $1\\times4+3=7$, so it is $\\frac{7}{4}$.\n3. Step 3: Subtract the numerators: $\\frac{13}{4}-\\frac{7}{4}=\\frac{6}{4}$.\n4. Step 4: Change to a mixed number and simplify: $\\frac{6}{4}=1\\frac{2}{4}=1\\frac{1}{2}$.\n\nCheck: $1\\frac{1}{2}+1\\frac{3}{4}=3\\frac{1}{4}$.',
                'Mari kita hitung $3\\frac{1}{4}-1\\frac{3}{4}$. Pecahan $\\frac{1}{4}$ terlalu kecil untuk dikurangi $\\frac{3}{4}$, jadi kita meminjam satu utuh. Cara yang aman adalah mengubah kedua bilangan menjadi pecahan tak wajar.\n\n1. Langkah 1: Ubah $3\\frac{1}{4}$: $3\\times4+1=13$, jadi $\\frac{13}{4}$.\n2. Langkah 2: Ubah $1\\frac{3}{4}$: $1\\times4+3=7$, jadi $\\frac{7}{4}$.\n3. Langkah 3: Kurangkan pembilangnya: $\\frac{13}{4}-\\frac{7}{4}=\\frac{6}{4}$.\n4. Langkah 4: Ubah ke pecahan campuran dan sederhanakan: $\\frac{6}{4}=1\\frac{2}{4}=1\\frac{1}{2}$.\n\nPeriksa: $1\\frac{1}{2}+1\\frac{3}{4}=3\\frac{1}{4}$.',
              ),
              figure: {
                ...fractionCircles([
                  { parts: 4, shaded: 4 },
                  { parts: 4, shaded: 4 },
                  { parts: 4, shaded: 4 },
                  { parts: 4, shaded: 1 },
                ]),
                caption: L('$3\\frac{1}{4}$ is 13 quarters: three whole circles and one more quarter.', '$3\\frac{1}{4}$ adalah 13 seperempat: tiga lingkaran utuh dan satu seperempat lagi.'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Different Denominators and Borrowing', 'Awas, Jebakan!: Penyebut Berbeda dan Meminjam'),
              body: L(
                'Watch out for these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $3\\frac{1}{4}-1\\frac{3}{4}=2\\frac{2}{4}$ (the smaller fraction was taken from the bigger one) | $3\\frac{1}{4}-1\\frac{3}{4}=\\frac{13}{4}-\\frac{7}{4}=1\\frac{1}{2}$ |\n| ❌ $\\frac{1}{2}+\\frac{1}{3}=\\frac{2}{5}$ (tops added, bottoms added) | $\\frac{1}{2}+\\frac{1}{3}=\\frac{3}{6}+\\frac{2}{6}=\\frac{5}{6}$ |\n| ❌ $\\frac{3}{4}-\\frac{1}{2}=\\frac{2}{2}=1$ (tops and bottoms both subtracted) | $\\frac{3}{4}-\\frac{1}{2}=\\frac{3}{4}-\\frac{2}{4}=\\frac{1}{4}$ |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $3\\frac{1}{4}-1\\frac{3}{4}=2\\frac{2}{4}$ (pecahan yang kecil dikurangkan dari yang besar) | $3\\frac{1}{4}-1\\frac{3}{4}=\\frac{13}{4}-\\frac{7}{4}=1\\frac{1}{2}$ |\n| ❌ $\\frac{1}{2}+\\frac{1}{3}=\\frac{2}{5}$ (atas dijumlah, bawah dijumlah) | $\\frac{1}{2}+\\frac{1}{3}=\\frac{3}{6}+\\frac{2}{6}=\\frac{5}{6}$ |\n| ❌ $\\frac{3}{4}-\\frac{1}{2}=\\frac{2}{2}=1$ (atas dan bawah sama-sama dikurangi) | $\\frac{3}{4}-\\frac{1}{2}=\\frac{3}{4}-\\frac{2}{4}=\\frac{1}{4}$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Citra ate $\\frac{1}{2}$ of a loaf of bread and Dewi ate $\\frac{1}{3}$ of the same loaf. How much of the loaf did they eat together?',
                'Citra memakan $\\frac{1}{2}$ roti dan Dewi memakan $\\frac{1}{3}$ roti yang sama. Berapa bagian roti yang mereka makan bersama?',
              ),
              figure: {
                ...fractionBars([
                  { parts: 6, shaded: 3, label: '1/2' },
                  { parts: 6, shaded: 2, label: '1/3' },
                ]),
                caption: L('Cut into sixths, a half is 3 pieces and a third is 2 pieces.', 'Dipotong menjadi seperenam, setengah adalah 3 potong dan sepertiga adalah 2 potong.'),
              },
              options: [
                L('$\\frac{5}{6}$', '$\\frac{5}{6}$'),
                L('$\\frac{2}{5}$', '$\\frac{2}{5}$'),
                L('$\\frac{1}{6}$', '$\\frac{1}{6}$'),
                L('$\\frac{2}{6}$', '$\\frac{2}{6}$'),
              ],
              answer: 0,
              explain: L(
                'In sixths, $\\frac{1}{2}=\\frac{3}{6}$ and $\\frac{1}{3}=\\frac{2}{6}$, so together $\\frac{5}{6}$. Adding tops and bottoms gives $\\frac{2}{5}$, and subtracting gives $\\frac{1}{6}$.',
                'Dalam seperenam, $\\frac{1}{2}=\\frac{3}{6}$ dan $\\frac{1}{3}=\\frac{2}{6}$, jadi bersama-sama $\\frac{5}{6}$. Menjumlah angka atas dan bawah memberi $\\frac{2}{5}$, dan mengurangi memberi $\\frac{1}{6}$.',
              ),
              hint: L(
                'The two pieces are different sizes, so you cannot add them yet. Read the bars: how many sixths is each part?',
                'Kedua potongan tidak sama besar, jadi belum bisa dijumlah. Baca batangnya: masing-masing berapa seperenam?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: $\\frac{1}{4}+\\frac{2}{3}$. The LCM is 12. Find the two new numerators, then add them.',
                'Coba bersama: $\\frac{1}{4}+\\frac{2}{3}$. KPK-nya 12. Cari kedua pembilang barunya, lalu jumlahkan.',
              ),
              template: '1 \\times 3 = ___ \\quad 2 \\times 4 = ___ \\quad 3 + 8 = ___',
              blanks: ['3', '8', '11'],
              explain: L(
                '$\\frac{1}{4}=\\frac{3}{12}$ and $\\frac{2}{3}=\\frac{8}{12}$, so the sum is $\\frac{11}{12}$.',
                '$\\frac{1}{4}=\\frac{3}{12}$ dan $\\frac{2}{3}=\\frac{8}{12}$, jadi jumlahnya $\\frac{11}{12}$.',
              ),
              hint: L(
                'From 4 to 12 you multiply by 3, and from 3 to 12 you multiply by 4. Do the same to each numerator.',
                'Dari 4 ke 12 kamu mengalikan dengan 3, dan dari 3 ke 12 kamu mengalikan dengan 4. Lakukan hal yang sama pada tiap pembilang.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A bucket is $\\frac{3}{4}$ full of water (first bar). Eko uses $\\frac{1}{3}$ of a bucket (second bar). How much of the bucket is still full of water?',
                'Sebuah ember berisi air $\\frac{3}{4}$ penuh (batang pertama). Eko memakai $\\frac{1}{3}$ ember (batang kedua). Berapa bagian ember yang masih terisi air?',
              ),
              figure: {
                ...fractionBars([
                  { parts: 12, shaded: 9, label: '3/4' },
                  { parts: 12, shaded: 4, label: '1/3' },
                ]),
                caption: L('Both amounts drawn in twelfths.', 'Kedua jumlah digambar dalam seperduabelas.'),
              },
              options: [
                L('$\\frac{5}{12}$', '$\\frac{5}{12}$'),
                L('$\\frac{2}{1}$', '$\\frac{2}{1}$'),
                L('$\\frac{2}{12}$', '$\\frac{2}{12}$'),
                L('$\\frac{13}{12}$', '$\\frac{13}{12}$'),
              ],
              answer: 0,
              explain: L(
                '$\\frac{3}{4}-\\frac{1}{3}=\\frac{9}{12}-\\frac{4}{12}=\\frac{5}{12}$. Subtracting tops and bottoms gives $\\frac{2}{1}$, and adding the amounts gives $\\frac{13}{12}$.',
                '$\\frac{3}{4}-\\frac{1}{3}=\\frac{9}{12}-\\frac{4}{12}=\\frac{5}{12}$. Mengurangi angka atas dan bawah memberi $\\frac{2}{1}$, dan menjumlah kedua jumlah memberi $\\frac{13}{12}$.',
              ),
              hint: L(
                'The bars show both amounts in the same size of piece. Take the second amount away from the first.',
                'Kedua batang menunjukkan jumlah dalam ukuran potongan yang sama. Kurangkan jumlah kedua dari jumlah pertama.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'A tailor has a roll of cloth 5 m long. He cuts off $2\\frac{1}{3}$ m for a dress. How many meters of cloth are left?',
                'Seorang penjahit punya segulung kain sepanjang 5 m. Ia memotong $2\\frac{1}{3}$ m untuk sebuah baju. Berapa meter kain yang tersisa?',
              ),
              options: [
                L('$2\\frac{2}{3}$', '$2\\frac{2}{3}$'),
                L('$3\\frac{1}{3}$', '$3\\frac{1}{3}$'),
                L('$2\\frac{1}{3}$', '$2\\frac{1}{3}$'),
                L('$3\\frac{2}{3}$', '$3\\frac{2}{3}$'),
              ],
              answer: 0,
              explain: L(
                'There is no fraction in 5 to take a third from, so borrow: $5=4\\frac{3}{3}$, and $4\\frac{3}{3}-2\\frac{1}{3}=2\\frac{2}{3}$. The answer $3\\frac{1}{3}$ adds the third instead of taking it away, $3\\frac{2}{3}$ forgets that a whole was borrowed, and $2\\frac{1}{3}$ just repeats the piece that was cut off.',
                'Pada 5 tidak ada pecahan untuk dikurangi sepertiga, jadi meminjam: $5=4\\frac{3}{3}$, dan $4\\frac{3}{3}-2\\frac{1}{3}=2\\frac{2}{3}$. Jawaban $3\\frac{1}{3}$ menambah sepertiga, bukan mengurangi, $3\\frac{2}{3}$ lupa bahwa satu utuh sudah dipinjam, dan $2\\frac{1}{3}$ hanya mengulang potongan yang dipotong.',
              ),
              hint: L(
                'The 5 has no fraction part to take a third away from. Borrow one whole and cut it into thirds first, or write both numbers as improper fractions.',
                'Bilangan 5 tidak punya bagian pecahan untuk dikurangi sepertiga. Pinjam satu utuh dan potong menjadi sepertiga dulu, atau tulis kedua bilangan sebagai pecahan tak wajar.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\frac{1}{2}+\\frac{1}{4}=\\frac{3}{4}$', '$\\frac{1}{2}+\\frac{1}{4}=\\frac{3}{4}$'),
                L('$\\frac{2}{3}-\\frac{1}{6}=\\frac{1}{3}$', '$\\frac{2}{3}-\\frac{1}{6}=\\frac{1}{3}$'),
                L('$2\\frac{1}{3}-1\\frac{2}{3}=\\frac{2}{3}$', '$2\\frac{1}{3}-1\\frac{2}{3}=\\frac{2}{3}$'),
                L('$\\frac{3}{4}+\\frac{5}{6}=\\frac{8}{10}$', '$\\frac{3}{4}+\\frac{5}{6}=\\frac{8}{10}$'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$\\frac{1}{2}+\\frac{1}{4}=\\frac{3}{4}$ is right. $\\frac{2}{3}-\\frac{1}{6}=\\frac{4}{6}-\\frac{1}{6}=\\frac{1}{2}$, not $\\frac{1}{3}$. $\\frac{7}{3}-\\frac{5}{3}=\\frac{2}{3}$ is right. And $\\frac{3}{4}+\\frac{5}{6}=\\frac{9}{12}+\\frac{10}{12}=\\frac{19}{12}$, not $\\frac{8}{10}$.',
                '$\\frac{1}{2}+\\frac{1}{4}=\\frac{3}{4}$ benar. $\\frac{2}{3}-\\frac{1}{6}=\\frac{4}{6}-\\frac{1}{6}=\\frac{1}{2}$, bukan $\\frac{1}{3}$. $\\frac{7}{3}-\\frac{5}{3}=\\frac{2}{3}$ benar. Dan $\\frac{3}{4}+\\frac{5}{6}=\\frac{9}{12}+\\frac{10}{12}=\\frac{19}{12}$, bukan $\\frac{8}{10}$.',
              ),
              hint: L(
                'Make the denominators the same before you decide. For mixed numbers, change them into improper fractions.',
                'Samakan penyebutnya sebelum memutuskan. Untuk pecahan campuran, ubah menjadi pecahan tak wajar.',
              ),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'Indah has two ribbons: one is $2\\frac{1}{2}$ m long and the other is $1\\frac{3}{4}$ m long. She ties them end to end. How long is the new ribbon? Write the answer as a mixed number.',
                'Indah punya dua pita: satu panjangnya $2\\frac{1}{2}$ m dan yang lain $1\\frac{3}{4}$ m. Ia menyambungnya ujung ke ujung. Berapa panjang pita yang baru? Tulis jawabannya sebagai pecahan campuran.',
              ),
              inline: true,
              blanks: mixed(4, 1, 4),
              hints: [
                L(
                  'The denominators are 2 and 4. Which denominator can both fractions use?',
                  'Penyebutnya 2 dan 4. Penyebut berapa yang bisa dipakai kedua pecahan?',
                ),
                L(
                  'Change the half into quarters: $2\\frac{1}{2}=2\\frac{2}{4}$. Then add the whole numbers and the fractions separately.',
                  'Ubah setengah menjadi seperempat: $2\\frac{1}{2}=2\\frac{2}{4}$. Lalu jumlahkan bilangan utuh dan pecahannya secara terpisah.',
                ),
                L(
                  'Whole numbers: $2+1=3$. The two fractions together are more than 1, so one more whole goes onto the 3.',
                  'Bilangan utuh: $2+1=3$. Kedua pecahan bersama-sama lebih dari 1, jadi satu utuh lagi ditambahkan pada 3.',
                ),
              ],
              explain: L(
                '$2\\frac{2}{4}+1\\frac{3}{4}=3+\\frac{5}{4}=3+1\\frac{1}{4}=4\\frac{1}{4}$ m.',
                '$2\\frac{2}{4}+1\\frac{3}{4}=3+\\frac{5}{4}=3+1\\frac{1}{4}=4\\frac{1}{4}$ m.',
              ),
              solution: ['2\\frac{1}{2}=2\\frac{2}{4}', '2+1=3 \\quad \\frac{2}{4}+\\frac{3}{4}=\\frac{5}{4}=1\\frac{1}{4}', '3+1\\frac{1}{4}=4\\frac{1}{4}'],
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Rudi has a ribbon $4\\frac{1}{3}$ m long. He uses $1\\frac{5}{6}$ m of it to wrap a gift. How long is the ribbon that is left? Write the answer as a mixed number in simplest form.',
                'Rudi punya pita sepanjang $4\\frac{1}{3}$ m. Ia memakai $1\\frac{5}{6}$ m untuk membungkus kado. Berapa panjang pita yang tersisa? Tulis jawabannya sebagai pecahan campuran dalam bentuk paling sederhana.',
              ),
              inline: true,
              blanks: mixed(2, 1, 2),
              hints: [
                L(
                  'The denominators are 3 and 6. Find a denominator that works for both, using the LCM.',
                  'Penyebutnya 3 dan 6. Cari penyebut yang cocok untuk keduanya dengan KPK.',
                ),
                L(
                  'The LCM is 6, so $4\\frac{1}{3}=4\\frac{2}{6}$. Since $\\frac{2}{6}$ is smaller than $\\frac{5}{6}$, change both numbers to improper fractions.',
                  'KPK-nya 6, jadi $4\\frac{1}{3}=4\\frac{2}{6}$. Karena $\\frac{2}{6}$ lebih kecil dari $\\frac{5}{6}$, ubah kedua bilangan menjadi pecahan tak wajar.',
                ),
                L(
                  '$4\\frac{2}{6}=\\frac{26}{6}$ and $1\\frac{5}{6}=\\frac{11}{6}$. Subtract the numerators, then change to a mixed number and simplify.',
                  '$4\\frac{2}{6}=\\frac{26}{6}$ dan $1\\frac{5}{6}=\\frac{11}{6}$. Kurangkan pembilangnya, lalu ubah ke pecahan campuran dan sederhanakan.',
                ),
              ],
              explain: L(
                '$\\frac{26}{6}-\\frac{11}{6}=\\frac{15}{6}=2\\frac{3}{6}=2\\frac{1}{2}$ m of ribbon is left.',
                '$\\frac{26}{6}-\\frac{11}{6}=\\frac{15}{6}=2\\frac{3}{6}=2\\frac{1}{2}$ m pita tersisa.',
              ),
              solution: ['4\\frac{1}{3}=4\\frac{2}{6}=\\frac{26}{6} \\quad 1\\frac{5}{6}=\\frac{11}{6}', '\\frac{26}{6}-\\frac{11}{6}=\\frac{15}{6}', '\\frac{15}{6}=2\\frac{3}{6}=2\\frac{1}{2}'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m3-s2-p',
        runtime: 'math',
        title: L('Add and Subtract Fractions', 'Menjumlah dan Mengurang Pecahan'),
        brief: L(
          'Add and subtract fractions in plain sums and in rope and juice problems.',
          'Jumlahkan dan kurangkan pecahan dalam hitungan biasa serta soal tali dan jus.',
        ),
        requirements: [
          L('Add and subtract fractions after making the denominators the same.', 'Menjumlah dan mengurang pecahan setelah menyamakan penyebutnya.'),
          L('Change between mixed numbers and improper fractions, and simplify the answer.', 'Mengubah pecahan campuran dan pecahan tak wajar, serta menyederhanakan jawaban.'),
        ],
        hints: [
          L('Always ask first: are the pieces the same size? If not, use the LCM.', 'Selalu tanyakan dulu: apakah potongannya sama besar? Kalau tidak, pakai KPK.'),
          L('For mixed numbers, change to improper fractions when you need to borrow.', 'Untuk pecahan campuran, ubah ke pecahan tak wajar kalau kamu perlu meminjam.'),
          L('For the last task, think: what must be added to the first amount to reach the second?', 'Untuk soal terakhir, pikirkan: apa yang harus ditambahkan pada jumlah pertama agar sampai ke jumlah kedua?'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Add. Write the answer as an improper fraction in simplest form.',
              'Jumlahkan. Tulis jawabannya sebagai pecahan tak wajar dalam bentuk paling sederhana.',
            ),
            given: '\\frac{3}{10}+\\frac{9}{10}',
            inline: true,
            blanks: numDen(6, 5),
            solution: ['\\frac{3}{10}+\\frac{9}{10}=\\frac{12}{10}', '\\frac{12}{10}=\\frac{12\\div2}{10\\div2}=\\frac{6}{5}'],
          },
          {
            prompt: L('Subtract. The answer is already in simplest form.', 'Kurangkan. Jawabannya sudah dalam bentuk paling sederhana.'),
            given: '\\frac{5}{6}-\\frac{3}{8}',
            inline: true,
            blanks: numDen(11, 24),
            solution: ['\\text{LCM}(6,8)=24', '\\frac{5}{6}=\\frac{20}{24} \\quad \\frac{3}{8}=\\frac{9}{24}', '\\frac{20}{24}-\\frac{9}{24}=\\frac{11}{24}'],
          },
          {
            prompt: L(
              'Rudi has a rope $3\\frac{1}{2}$ m long. He cuts off $1\\frac{3}{4}$ m for a swing. How long is the rope that is left? Write it as a mixed number.',
              'Rudi punya tali sepanjang $3\\frac{1}{2}$ m. Ia memotong $1\\frac{3}{4}$ m untuk ayunan. Berapa panjang tali yang tersisa? Tulis sebagai pecahan campuran.',
            ),
            inline: true,
            blanks: mixed(1, 3, 4),
            solution: ['3\\frac{1}{2}=\\frac{7}{2}=\\frac{14}{4} \\quad 1\\frac{3}{4}=\\frac{7}{4}', '\\frac{14}{4}-\\frac{7}{4}=\\frac{7}{4}', '\\frac{7}{4}=1\\frac{3}{4}'],
          },
          {
            prompt: L(
              'Citra has $\\frac{3}{4}$ liter of juice. She wants to have $1\\frac{1}{6}$ liters. How many liters of juice must she add? Write the fraction in simplest form.',
              'Citra punya $\\frac{3}{4}$ liter jus. Ia ingin punya $1\\frac{1}{6}$ liter. Berapa liter jus yang harus ia tambahkan? Tulis pecahannya dalam bentuk paling sederhana.',
            ),
            figure: {
              ...numberLine({
                from: 0,
                to: 1.5,
                step: 1 / 12,
                labelEvery: 3,
                fmt: fracFmt(12, { reduce: true, mixed: true }),
                marks: [
                  { at: 3 / 4, label: '3/4', color: 'a' },
                  { at: 7 / 6, label: '1 1/6', color: 'result' },
                ],
              }),
              caption: L('How far is it from the first dot to the second dot?', 'Berapa jarak dari titik pertama ke titik kedua?'),
            },
            inline: true,
            blanks: numDen(5, 12),
            solution: ['1\\frac{1}{6}=\\frac{7}{6}=\\frac{14}{12} \\quad \\frac{3}{4}=\\frac{9}{12}', '\\frac{14}{12}-\\frac{9}{12}=\\frac{5}{12}'],
          },
        ],
      },
    },

    /* ====================================== S3: fraction x and / whole number */
    {
      id: 'tka-m3-s3',
      title: L('Fractions Times and Divided by Whole Numbers', 'Pecahan dikali dan dibagi Bilangan Asli'),
      summary: L(
        'Multiply a fraction or a mixed number by a whole number (repeated addition and "a fraction of an amount") and divide a fraction or a mixed number by a whole number (cutting it into equal parts).',
        'Mengalikan pecahan atau pecahan campuran dengan bilangan asli (penjumlahan berulang dan "pecahan dari suatu jumlah") dan membagi pecahan atau pecahan campuran dengan bilangan asli (memotongnya menjadi bagian yang sama besar).',
      ),
      lessons: [
        /* ------------------------------------------------- S3 L1 fraction x whole */
        {
          id: 'tka-m3-s3-l1',
          title: L('Fraction × Whole Number', 'Pecahan × Bilangan Asli'),
          goal: L(
            'You can multiply a fraction or a mixed number by a whole number and find a fraction of an amount.',
            'Kamu bisa mengalikan pecahan atau pecahan campuran dengan bilangan asli dan mencari pecahan dari suatu jumlah.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Adding the Same Fraction Again and Again', 'Ayo Amati: Menjumlah Pecahan yang Sama Berulang-ulang'),
              body: L(
                'Ani drinks $\\frac{2}{5}$ liter of milk every day for 3 days. Three days means the same amount 3 times, so we add it again and again: $\\frac{2}{5}+\\frac{2}{5}+\\frac{2}{5}=\\frac{6}{5}$ liters.\n\nRepeated addition is written as multiplication: $3\\times\\frac{2}{5}=\\frac{6}{5}$. Look at the picture: there are 3 groups of 2 fifths, which is 6 fifths.\n\n- The denominator stays the same, because the pieces are still fifths.\n- The numerator is multiplied by the whole number: $3\\times2=6$.',
                'Ani minum $\\frac{2}{5}$ liter susu setiap hari selama 3 hari. Tiga hari berarti jumlah yang sama sebanyak 3 kali, jadi kita menjumlahkannya berulang: $\\frac{2}{5}+\\frac{2}{5}+\\frac{2}{5}=\\frac{6}{5}$ liter.\n\nPenjumlahan berulang ditulis sebagai perkalian: $3\\times\\frac{2}{5}=\\frac{6}{5}$. Lihat gambarnya: ada 3 kelompok yang masing-masing 2 seperlima, yaitu 6 seperlima.\n\n- Penyebut tetap sama, karena potongannya masih seperlima.\n- Pembilang dikali dengan bilangan asli: $3\\times2=6$.',
              ),
              figure: {
                ...repeatBars(5, 2, 3),
                caption: L(
                  'Three groups of 2 fifths, each group in its own color: 6 fifths in all.',
                  'Tiga kelompok berisi 2 seperlima, tiap kelompok warnanya sendiri: seluruhnya 6 seperlima.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: A Fraction of an Amount', 'Contoh Bertahap: Pecahan dari Suatu Jumlah'),
              body: L(
                'There are 24 marbles. Fitri takes $\\frac{3}{4}$ of them. How many marbles is that? "$\\frac{3}{4}$ of 24" is written $\\frac{3}{4}\\times24$.\n\n1. Step 1: Share the 24 marbles equally into 4 groups: $24\\div4=6$. One group is $\\frac{1}{4}$ of 24, which is 6 marbles.\n2. Step 2: Fitri takes 3 groups: $3\\times6=18$.\n3. Step 3: So $\\frac{3}{4}$ of 24 is 18 marbles: $\\frac{3}{4}\\times24=\\frac{3\\times24}{4}=18$.\n\n**Remember:**\n\n- Fraction × whole number: multiply the numerator by the whole number, and keep the denominator.\n- For an amount, it is easy to divide by the denominator first, then multiply by the numerator.',
                'Ada 24 kelereng. Fitri mengambil $\\frac{3}{4}$ dari kelereng itu. Berapa kelereng yang ia ambil? "$\\frac{3}{4}$ dari 24" ditulis $\\frac{3}{4}\\times24$.\n\n1. Langkah 1: Bagi 24 kelereng sama banyak menjadi 4 kelompok: $24\\div4=6$. Satu kelompok adalah $\\frac{1}{4}$ dari 24, yaitu 6 kelereng.\n2. Langkah 2: Fitri mengambil 3 kelompok: $3\\times6=18$.\n3. Langkah 3: Jadi $\\frac{3}{4}$ dari 24 adalah 18 kelereng: $\\frac{3}{4}\\times24=\\frac{3\\times24}{4}=18$.\n\n**Ingat:**\n\n- Pecahan × bilangan asli: kalikan pembilang dengan bilangan asli itu, dan penyebut tetap.\n- Untuk suatu jumlah, mudah kalau bagi dulu dengan penyebut, lalu kali dengan pembilang.',
              ),
              figure: {
                ...gridRect({ cols: 6, rows: 4, shade: 18 }),
                caption: L(
                  '24 marbles in 4 equal rows of 6. The 3 colored rows are $\\frac{3}{4}$ of the marbles.',
                  '24 kelereng dalam 4 baris sama banyak, masing-masing 6. Tiga baris berwarna adalah $\\frac{3}{4}$ dari kelereng.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: What Gets Multiplied?', 'Awas, Jebakan!: Apa yang Dikalikan?'),
              body: L(
                'Be careful with these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $\\frac{2}{5}\\times3=\\frac{6}{15}$ (the denominator was multiplied too) | $\\frac{2}{5}\\times3=\\frac{6}{5}$ (only the numerator is multiplied) |\n| ❌ $\\frac{3}{4}$ of $24=24\\div3\\times4=32$ (divided by the numerator) | $\\frac{3}{4}$ of $24=24\\div4\\times3=18$ (divide by the denominator) |\n| ❌ $\\frac{1}{4}\\times2=\\frac{1}{8}$ (the denominator was multiplied instead) | $\\frac{1}{4}\\times2=\\frac{2}{4}=\\frac{1}{2}$ |\n| ❌ $3\\times2\\frac{1}{4}=6\\frac{1}{4}$ (only the whole part was multiplied) | $3\\times2\\frac{1}{4}=6+\\frac{3}{4}=6\\frac{3}{4}$ (multiply the fraction part too) |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $\\frac{2}{5}\\times3=\\frac{6}{15}$ (penyebutnya ikut dikali) | $\\frac{2}{5}\\times3=\\frac{6}{5}$ (hanya pembilang yang dikali) |\n| ❌ $\\frac{3}{4}$ dari $24=24\\div3\\times4=32$ (dibagi dengan pembilang) | $\\frac{3}{4}$ dari $24=24\\div4\\times3=18$ (bagi dengan penyebut) |\n| ❌ $\\frac{1}{4}\\times2=\\frac{1}{8}$ (yang dikali justru penyebutnya) | $\\frac{1}{4}\\times2=\\frac{2}{4}=\\frac{1}{2}$ |\n| ❌ $3\\times2\\frac{1}{4}=6\\frac{1}{4}$ (hanya bagian utuhnya yang dikali) | $3\\times2\\frac{1}{4}=6+\\frac{3}{4}=6\\frac{3}{4}$ (bagian pecahannya juga dikali) |',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Mixed Number × Whole Number', 'Contoh Bertahap: Pecahan Campuran × Bilangan Asli'),
              body: L(
                'Mr. Eko buys 7 bags of rice. Each bag weighs $2\\frac{3}{4}$ kg. How many kilograms of rice is that? We need $7\\times2\\frac{3}{4}$.\n\n1. Step 1: Change the mixed number into an improper fraction: $2\\frac{3}{4}=\\frac{2\\times4+3}{4}=\\frac{11}{4}$.\n2. Step 2: Multiply the numerator by 7 and keep the denominator: $7\\times\\frac{11}{4}=\\frac{77}{4}$.\n3. Step 3: Change back to a mixed number: $77\\div4=19$ remainder 1, so $\\frac{77}{4}=19\\frac{1}{4}$ kg.\n4. Step 4: Check a second way. Whole parts: $7\\times2=14$. Fraction parts: $7\\times\\frac{3}{4}=\\frac{21}{4}=5\\frac{1}{4}$. Together: $14+5\\frac{1}{4}=19\\frac{1}{4}$.\n\n**Remember:**\n\n- Mixed number × whole number: change to an improper fraction first, or multiply the whole part and the fraction part separately and add the results.\n- Estimate to check: the answer is more than $7\\times2=14$ and less than $7\\times3=21$.',
                'Pak Eko membeli 7 karung beras. Tiap karung beratnya $2\\frac{3}{4}$ kg. Berapa kilogram beras itu? Kita perlu menghitung $7\\times2\\frac{3}{4}$.\n\n1. Langkah 1: Ubah pecahan campuran menjadi pecahan tak wajar: $2\\frac{3}{4}=\\frac{2\\times4+3}{4}=\\frac{11}{4}$.\n2. Langkah 2: Kalikan pembilang dengan 7 dan penyebut tetap: $7\\times\\frac{11}{4}=\\frac{77}{4}$.\n3. Langkah 3: Ubah kembali ke pecahan campuran: $77\\div4=19$ sisa 1, jadi $\\frac{77}{4}=19\\frac{1}{4}$ kg.\n4. Langkah 4: Periksa dengan cara kedua. Bagian utuh: $7\\times2=14$. Bagian pecahan: $7\\times\\frac{3}{4}=\\frac{21}{4}=5\\frac{1}{4}$. Digabung: $14+5\\frac{1}{4}=19\\frac{1}{4}$.\n\n**Ingat:**\n\n- Pecahan campuran × bilangan asli: ubah dulu menjadi pecahan tak wajar, atau kalikan bagian utuh dan bagian pecahan secara terpisah lalu jumlahkan hasilnya.\n- Perkirakan untuk memeriksa: hasilnya lebih dari $7\\times2=14$ dan kurang dari $7\\times3=21$.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Citra drinks $\\frac{3}{4}$ of a glass of milk, 3 times a day. The picture shows 3 groups of 3 quarters. How many glasses of milk does she drink in a day?',
                'Citra minum $\\frac{3}{4}$ gelas susu, 3 kali sehari. Gambar menunjukkan 3 kelompok berisi 3 seperempat. Berapa gelas susu yang ia minum dalam sehari?',
              ),
              figure: {
                ...repeatBars(4, 3, 3),
                caption: L('3 groups of 3 quarters. Each bar is one glass.', '3 kelompok berisi 3 seperempat. Setiap batang adalah satu gelas.'),
              },
              options: [
                L('$\\frac{9}{4}$', '$\\frac{9}{4}$'),
                L('$\\frac{9}{12}$', '$\\frac{9}{12}$'),
                L('$\\frac{6}{4}$', '$\\frac{6}{4}$'),
                L('$\\frac{3}{12}$', '$\\frac{3}{12}$'),
              ],
              answer: 0,
              explain: L(
                '$3\\times\\frac{3}{4}=\\frac{3\\times3}{4}=\\frac{9}{4}$ glasses. Multiplying the denominator too gives $\\frac{9}{12}$, and adding 3 + 3 gives $\\frac{6}{4}$.',
                '$3\\times\\frac{3}{4}=\\frac{3\\times3}{4}=\\frac{9}{4}$ gelas. Mengalikan penyebut juga memberi $\\frac{9}{12}$, dan menjumlah 3 + 3 memberi $\\frac{6}{4}$.',
              ),
              hint: L(
                'The pieces are still quarters. Count how many quarters there are in all the groups.',
                'Potongannya tetap seperempat. Hitung ada berapa seperempat di seluruh kelompok.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find $\\frac{2}{5}$ of 30 apples. First divide 30 into 5 equal groups. Then take 2 of those groups.',
                'Coba bersama: cari $\\frac{2}{5}$ dari 30 apel. Bagi dulu 30 menjadi 5 kelompok sama banyak. Lalu ambil 2 kelompok itu.',
              ),
              template: '30 \\div 5 = ___ \\quad 2 \\times ___ = ___',
              blanks: ['6', '6', '12'],
              explain: L(
                'One group is 6 apples, and 2 groups are 12 apples. So $\\frac{2}{5}$ of 30 is 12.',
                'Satu kelompok adalah 6 apel, dan 2 kelompok adalah 12 apel. Jadi $\\frac{2}{5}$ dari 30 adalah 12.',
              ),
              hint: L(
                'The size of one group comes from the first division. Use that number in the second part.',
                'Besar satu kelompok berasal dari pembagian pertama. Pakai bilangan itu di bagian kedua.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The picture shows 36 mangoes in equal rows. The colored mangoes were sold. How many mangoes were sold?',
                'Gambar menunjukkan 36 mangga dalam baris yang sama banyak. Mangga yang berwarna sudah terjual. Berapa mangga yang terjual?',
              ),
              figure: {
                ...gridRect({ cols: 6, rows: 6, shade: 30 }),
                caption: L('36 mangoes in 6 equal rows. The colored ones were sold.', '36 mangga dalam 6 baris sama banyak. Yang berwarna sudah terjual.'),
              },
              options: [
                L('30', '30'),
                L('6', '6'),
                L('180', '180'),
                L('41', '41'),
              ],
              answer: 0,
              explain: L(
                '5 of the 6 rows are colored, so $\\frac{5}{6}$ of 36: $36\\div6=6$ in each row, and $5\\times6=30$. Giving 6 forgets to multiply by 5, and 180 forgets to divide by 6.',
                '5 dari 6 baris berwarna, jadi $\\frac{5}{6}$ dari 36: $36\\div6=6$ di tiap baris, dan $5\\times6=30$. Jawaban 6 lupa dikali 5, dan 180 lupa dibagi 6.',
              ),
              hint: L(
                'Count the rows to find the fraction that is colored. Then count how many mangoes are in one row.',
                'Hitung barisnya untuk menemukan pecahan yang berwarna. Lalu hitung ada berapa mangga di satu baris.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'Ani has Rp48,000. She spends $\\frac{1}{4}$ of her money on a book and $\\frac{1}{3}$ of her money on lunch. How many rupiah does she have left?',
                'Ani punya uang Rp48.000. Ia menghabiskan $\\frac{1}{4}$ uangnya untuk membeli buku dan $\\frac{1}{3}$ uangnya untuk makan siang. Berapa rupiah uang yang masih ia punya?',
              ),
              options: [
                L('Rp20,000', 'Rp20.000'),
                L('Rp28,000', 'Rp28.000'),
                L('Rp36,000', 'Rp36.000'),
                L('Rp32,000', 'Rp32.000'),
              ],
              answer: 0,
              explain: L(
                'The book costs $\\frac{1}{4}\\times48\\,000=12\\,000$ and lunch costs $\\frac{1}{3}\\times48\\,000=16\\,000$. She spends $28\\,000$, so $48\\,000-28\\,000=20\\,000$ is left. Rp28,000 is what she spent, and the other two forget one of the two purchases.',
                'Buku harganya $\\frac{1}{4}\\times48\\,000=12\\,000$ dan makan siang $\\frac{1}{3}\\times48\\,000=16\\,000$. Ia menghabiskan $28\\,000$, jadi sisanya $48\\,000-28\\,000=20\\,000$. Rp28.000 adalah uang yang dihabiskan, dan dua pilihan lain lupa salah satu dari dua pembelian.',
              ),
              hint: L(
                'Both fractions are parts of the SAME Rp48,000. Find each amount, add them, and remember that the question asks for what is left.',
                'Kedua pecahan adalah bagian dari Rp48.000 yang SAMA. Cari tiap jumlahnya, jumlahkan, dan ingat soal menanyakan uang yang masih tersisa.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO answers that are equal to $4\\times\\frac{3}{5}$.',
                'Pilih DUA jawaban yang sama dengan $4\\times\\frac{3}{5}$.',
              ),
              options: [
                L('$\\frac{12}{5}$', '$\\frac{12}{5}$'),
                L('$2\\frac{2}{5}$', '$2\\frac{2}{5}$'),
                L('$\\frac{12}{20}$', '$\\frac{12}{20}$'),
                L('$\\frac{3}{20}$', '$\\frac{3}{20}$'),
              ],
              answer: [0, 1],
              explain: L(
                '$4\\times\\frac{3}{5}=\\frac{12}{5}$, and $12\\div5=2$ remainder 2, so it is also $2\\frac{2}{5}$. The other two have the denominator multiplied by 4.',
                '$4\\times\\frac{3}{5}=\\frac{12}{5}$, dan $12\\div5=2$ sisa 2, jadi juga $2\\frac{2}{5}$. Dua yang lain penyebutnya dikali 4.',
              ),
              hint: L(
                'Multiply only the numerator. Then see which options show the same number, perhaps written as a mixed number.',
                'Kalikan hanya pembilangnya. Lalu lihat pilihan mana yang menunjukkan bilangan yang sama, mungkin ditulis sebagai pecahan campuran.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for finding $\\frac{3}{5}$ of 40 in order.', 'Urutkan langkah mencari $\\frac{3}{5}$ dari 40.'),
              lines: {
                en: ['\\text{Share 40 into 5 equal groups: } 40 \\div 5 = 8', '\\text{One group is } \\frac{1}{5} \\text{ of 40, which is } 8', '\\text{Take 3 groups: } 3 \\times 8 = 24', '\\text{So } \\frac{3}{5} \\times 40 = 24'],
                id: ['\\text{Bagi 40 menjadi 5 kelompok sama banyak: } 40 \\div 5 = 8', '\\text{Satu kelompok adalah } \\frac{1}{5} \\text{ dari 40, yaitu } 8', '\\text{Ambil 3 kelompok: } 3 \\times 8 = 24', '\\text{Jadi } \\frac{3}{5} \\times 40 = 24'],
              },
              explain: L(
                'Share first, see what one group is, collect the groups you need, then state the answer.',
                'Bagi dulu, lihat berapa satu kelompok, kumpulkan kelompok yang dibutuhkan, lalu tulis jawabannya.',
              ),
              hint: L(
                'You cannot take 3 groups before you know how big one group is.',
                'Kamu tidak bisa mengambil 3 kelompok sebelum tahu seberapa besar satu kelompok.',
              ),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'Siti fills 6 bottles from a drum. Each bottle holds $1\\frac{3}{4}$ liters. How many liters of water are in the 6 bottles together? Write the answer as a mixed number in simplest form.',
                'Siti mengisi 6 botol dari sebuah drum. Tiap botol berisi $1\\frac{3}{4}$ liter. Berapa liter air di keenam botol itu bersama-sama? Tulis jawabannya sebagai pecahan campuran dalam bentuk paling sederhana.',
              ),
              inline: true,
              blanks: mixed(10, 1, 2),
              hints: [
                L(
                  'This is the same amount 6 times. Which operation do you use?',
                  'Ini adalah jumlah yang sama sebanyak 6 kali. Operasi apa yang kamu pakai?',
                ),
                L(
                  'Change $1\\frac{3}{4}$ into an improper fraction. Then multiply only the numerator by 6.',
                  'Ubah $1\\frac{3}{4}$ menjadi pecahan tak wajar. Lalu kalikan hanya pembilangnya dengan 6.',
                ),
                L(
                  '$1\\frac{3}{4}=\\frac{7}{4}$, so you get $\\frac{42}{4}$. Change it to a mixed number and simplify the fraction part. Check: is it between $6\\times1=6$ and $6\\times2=12$?',
                  '$1\\frac{3}{4}=\\frac{7}{4}$, jadi kamu mendapat $\\frac{42}{4}$. Ubah ke pecahan campuran dan sederhanakan bagian pecahannya. Periksa: apakah hasilnya di antara $6\\times1=6$ dan $6\\times2=12$?',
                ),
              ],
              explain: L(
                '$6\\times\\frac{7}{4}=\\frac{42}{4}=10\\frac{2}{4}=10\\frac{1}{2}$ liters. It is between 6 and 12, as the estimate says.',
                '$6\\times\\frac{7}{4}=\\frac{42}{4}=10\\frac{2}{4}=10\\frac{1}{2}$ liter. Hasilnya di antara 6 dan 12, sesuai perkiraan.',
              ),
              solution: ['1\\frac{3}{4}=\\frac{7}{4}', '6\\times\\frac{7}{4}=\\frac{42}{4}', '\\frac{42}{4}=10\\frac{2}{4}=10\\frac{1}{2}'],
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'In a class there are 36 pupils. $\\frac{5}{9}$ of them bring lunch from home. How many pupils do NOT bring lunch from home?',
                'Di sebuah kelas ada 36 murid. $\\frac{5}{9}$ dari mereka membawa bekal dari rumah. Berapa murid yang TIDAK membawa bekal dari rumah?',
              ),
              blanks: [{ answer: 16, after: { en: '\\text{ pupils}', id: '\\text{ murid}' } }],
              hints: [
                L(
                  'First find how many pupils DO bring lunch. That is $\\frac{5}{9}$ of 36.',
                  'Cari dulu berapa murid yang MEMBAWA bekal. Itu adalah $\\frac{5}{9}$ dari 36.',
                ),
                L(
                  'Share 36 into 9 equal groups, then take 5 groups.',
                  'Bagi 36 menjadi 9 kelompok sama banyak, lalu ambil 5 kelompok.',
                ),
                L(
                  '$36\\div9=4$, and $5\\times4$ pupils bring lunch. The question asks about the others, so subtract from 36.',
                  '$36\\div9=4$, dan $5\\times4$ murid membawa bekal. Soal menanyakan murid yang lain, jadi kurangkan dari 36.',
                ),
              ],
              explain: L(
                '$\\frac{5}{9}\\times36=20$ pupils bring lunch, so $36-20=16$ pupils do not.',
                '$\\frac{5}{9}\\times36=20$ murid membawa bekal, jadi $36-20=16$ murid tidak membawa.',
              ),
              solution: ['36 \\div 9 = 4', '5 \\times 4 = 20', '36 - 20 = 16'],
            },
          ],
        },
        /* ------------------------------------------------ S3 L2 fraction / whole */
        {
          id: 'tka-m3-s3-l2',
          title: L('Fraction ÷ Whole Number', 'Pecahan ÷ Bilangan Asli'),
          goal: L(
            'You can divide a fraction or a mixed number by a whole number by cutting it into equal parts.',
            'Kamu bisa membagi pecahan atau pecahan campuran dengan bilangan asli dengan memotongnya menjadi bagian yang sama besar.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Cutting a Fraction into Equal Parts', 'Ayo Amati: Memotong Pecahan Menjadi Bagian Sama Besar'),
              body: L(
                'Ani has $\\frac{1}{2}$ of a cake. She shares it equally among 4 little brothers and sisters. How much does each one get?\n\nCut each of the 2 halves of the cake into 4 smaller parts. Now the whole cake is made of 8 equal pieces, and the half is 4 of them. Each child gets 1 piece, which is $\\frac{1}{8}$ of the cake. So $\\frac{1}{2}\\div4=\\frac{1}{8}$.\n\n- Dividing a fraction cuts it into smaller pieces, so the answer is smaller than the fraction you started with.\n- The denominator is multiplied by 4: $2\\times4=8$. The numerator stays 1.',
                'Ani punya $\\frac{1}{2}$ kue. Ia membaginya sama banyak untuk 4 adiknya. Berapa bagian yang didapat tiap adik?\n\nPotong tiap setengah kue itu menjadi 4 bagian yang lebih kecil. Sekarang seluruh kue terdiri dari 8 potong sama besar, dan setengahnya adalah 4 potong. Tiap adik mendapat 1 potong, yaitu $\\frac{1}{8}$ kue. Jadi $\\frac{1}{2}\\div4=\\frac{1}{8}$.\n\n- Membagi pecahan berarti memotongnya menjadi potongan yang lebih kecil, jadi hasilnya lebih kecil dari pecahan awalnya.\n- Penyebut dikali 4: $2\\times4=8$. Pembilangnya tetap 1.',
              ),
              figure: {
                ...cutBar(2, 1, 4, ['1/2', '1/8']),
                caption: L(
                  'The gray half is cut into 4 equal shares. Each share is one small piece, $\\frac{1}{8}$ of the whole.',
                  'Setengah yang abu-abu dipotong menjadi 4 bagian sama besar. Tiap bagian adalah satu potong kecil, $\\frac{1}{8}$ dari seluruhnya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Dividing by a Whole Number', 'Contoh Bertahap: Membagi dengan Bilangan Asli'),
              body: L(
                'Mr. Joko has $\\frac{3}{4}$ liter of cooking oil. He pours it equally into 3 bottles. How much oil is in each bottle?\n\n1. Step 1: $\\frac{3}{4}$ is 3 pieces of one quarter each.\n2. Step 2: Shortcut: 3 pieces shared by 3 bottles is 1 piece each, so $3\\div3=1$ and the answer is $\\frac{1}{4}$ liter.\n3. Step 3: Check with the general rule. Multiply the denominator by 3: $\\frac{3}{4\\times3}=\\frac{3}{12}$.\n4. Step 4: Simplify: $\\frac{3}{12}=\\frac{1}{4}$. Both ways give the same answer.\n\n**Remember:**\n\n- Fraction ÷ whole number: keep the numerator and multiply the denominator by the whole number.\n- Simplify the answer. If the numerator divides evenly, you can just divide the numerator.',
                'Pak Joko punya $\\frac{3}{4}$ liter minyak goreng. Ia menuangkannya sama banyak ke 3 botol. Berapa liter minyak di tiap botol?\n\n1. Langkah 1: $\\frac{3}{4}$ adalah 3 potong yang masing-masing seperempat.\n2. Langkah 2: Cara cepat: 3 potong dibagi untuk 3 botol, tiap botol 1 potong, jadi $3\\div3=1$ dan jawabannya $\\frac{1}{4}$ liter.\n3. Langkah 3: Periksa dengan aturan umum. Kalikan penyebut dengan 3: $\\frac{3}{4\\times3}=\\frac{3}{12}$.\n4. Langkah 4: Sederhanakan: $\\frac{3}{12}=\\frac{1}{4}$. Kedua cara memberi jawaban yang sama.\n\n**Ingat:**\n\n- Pecahan ÷ bilangan asli: pembilang tetap dan penyebut dikali dengan bilangan asli itu.\n- Sederhanakan jawabannya. Kalau pembilang habis dibagi, kamu boleh langsung membagi pembilangnya.',
              ),
              figure: {
                ...cutBar(4, 3, 3, ['3/4', '3/12']),
                caption: L(
                  'The gray $\\frac{3}{4}$ is cut into 3 equal shares of 3 twelfths each, and 3 twelfths is the same as $\\frac{1}{4}$.',
                  '$\\frac{3}{4}$ yang abu-abu dipotong menjadi 3 bagian sama besar, masing-masing 3 seperduabelas, dan 3 seperduabelas sama dengan $\\frac{1}{4}$.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Multiplying or Dividing?', 'Awas, Jebakan!: Dikali atau Dibagi?'),
              body: L(
                'Watch out for these mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $\\frac{3}{4}\\div3=\\frac{9}{4}$ (the numerator was multiplied) | $\\frac{3}{4}\\div3=\\frac{3}{12}=\\frac{1}{4}$ (dividing makes the pieces smaller) |\n| ❌ $\\frac{4}{5}\\div2=\\frac{2}{10}$ (the numerator was divided AND the denominator multiplied) | $\\frac{4}{5}\\div2=\\frac{2}{5}$ or $\\frac{4}{10}$ (do only one of them) |\n| ❌ $\\frac{1}{3}\\div2=\\frac{1}{5}$ (2 was added to the denominator) | $\\frac{1}{3}\\div2=\\frac{1}{6}$ (the denominator is multiplied) |\n| ❌ $2\\frac{2}{3}\\div2=1\\frac{2}{3}$ (only the whole part was divided) | $2\\frac{2}{3}\\div2=\\frac{8}{3}\\div2=\\frac{8}{6}=1\\frac{1}{3}$ (divide the whole amount) |',
                'Hati-hati dengan kesalahan ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $\\frac{3}{4}\\div3=\\frac{9}{4}$ (pembilangnya dikali) | $\\frac{3}{4}\\div3=\\frac{3}{12}=\\frac{1}{4}$ (membagi membuat potongan lebih kecil) |\n| ❌ $\\frac{4}{5}\\div2=\\frac{2}{10}$ (pembilang dibagi DAN penyebut dikali) | $\\frac{4}{5}\\div2=\\frac{2}{5}$ atau $\\frac{4}{10}$ (lakukan salah satu saja) |\n| ❌ $\\frac{1}{3}\\div2=\\frac{1}{5}$ (penyebut ditambah 2) | $\\frac{1}{3}\\div2=\\frac{1}{6}$ (penyebut dikali) |\n| ❌ $2\\frac{2}{3}\\div2=1\\frac{2}{3}$ (hanya bagian utuhnya yang dibagi) | $2\\frac{2}{3}\\div2=\\frac{8}{3}\\div2=\\frac{8}{6}=1\\frac{1}{3}$ (bagi seluruh jumlahnya) |',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Mixed Number ÷ Whole Number', 'Contoh Bertahap: Pecahan Campuran ÷ Bilangan Asli'),
              body: L(
                'Mr. Joko has $5\\frac{1}{4}$ liters of cooking oil. He pours it equally into 3 jugs. How many liters are in each jug? We need $5\\frac{1}{4}\\div3$.\n\n1. Step 1: Change the mixed number into an improper fraction: $5\\frac{1}{4}=\\frac{5\\times4+1}{4}=\\frac{21}{4}$.\n2. Step 2: Multiply the denominator by 3: $\\frac{21}{4}\\div3=\\frac{21}{12}$. (Here you could also share the numerator, $21\\div3=7$, and get $\\frac{7}{4}$.)\n3. Step 3: Simplify and change to a mixed number: $\\frac{21}{12}=\\frac{7}{4}=1\\frac{3}{4}$ liters.\n4. Step 4: Check by multiplying back: $3\\times1\\frac{3}{4}=3\\times\\frac{7}{4}=\\frac{21}{4}=5\\frac{1}{4}$.\n\n**Remember:**\n\n- Mixed number ÷ whole number: change to an improper fraction first, then divide as before.\n- Check by multiplying back: the answer times the whole number must give the amount you started with.',
                'Pak Joko punya $5\\frac{1}{4}$ liter minyak goreng. Ia menuangkannya sama banyak ke 3 teko. Berapa liter minyak di tiap teko? Kita perlu menghitung $5\\frac{1}{4}\\div3$.\n\n1. Langkah 1: Ubah pecahan campuran menjadi pecahan tak wajar: $5\\frac{1}{4}=\\frac{5\\times4+1}{4}=\\frac{21}{4}$.\n2. Langkah 2: Kalikan penyebut dengan 3: $\\frac{21}{4}\\div3=\\frac{21}{12}$. (Di sini kamu juga bisa membagi pembilangnya, $21\\div3=7$, dan mendapat $\\frac{7}{4}$.)\n3. Langkah 3: Sederhanakan dan ubah ke pecahan campuran: $\\frac{21}{12}=\\frac{7}{4}=1\\frac{3}{4}$ liter.\n4. Langkah 4: Periksa dengan mengalikan kembali: $3\\times1\\frac{3}{4}=3\\times\\frac{7}{4}=\\frac{21}{4}=5\\frac{1}{4}$.\n\n**Ingat:**\n\n- Pecahan campuran ÷ bilangan asli: ubah dulu menjadi pecahan tak wajar, lalu bagi seperti tadi.\n- Periksa dengan mengalikan kembali: hasilnya dikali bilangan asli harus sama dengan jumlah awal.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Mum has $\\frac{1}{3}$ of a tray of cake (the gray part). She shares it equally between 2 children, as the picture shows. How much of the whole tray does each child get?',
                'Ibu punya $\\frac{1}{3}$ loyang kue (bagian abu-abu). Ia membaginya sama banyak untuk 2 anak, seperti terlihat pada gambar. Berapa bagian dari seluruh loyang yang didapat tiap anak?',
              ),
              figure: {
                ...cutBar(3, 1, 2),
                caption: L('The gray third is cut into 2 equal shares.', 'Sepertiga yang abu-abu dipotong menjadi 2 bagian sama besar.'),
              },
              options: [
                L('$\\frac{1}{6}$', '$\\frac{1}{6}$'),
                L('$\\frac{2}{3}$', '$\\frac{2}{3}$'),
                L('$\\frac{1}{5}$', '$\\frac{1}{5}$'),
                L('$\\frac{1}{2}$', '$\\frac{1}{2}$'),
              ],
              answer: 0,
              explain: L(
                'The tray is now cut into $3\\times2=6$ equal pieces, and each child gets 1 of them: $\\frac{1}{6}$. Giving $\\frac{2}{3}$ multiplies instead of dividing, and $\\frac{1}{5}$ adds 2 to the denominator.',
                'Loyang kini terpotong menjadi $3\\times2=6$ potong sama besar, dan tiap anak mendapat 1 potong: $\\frac{1}{6}$. Jawaban $\\frac{2}{3}$ mengalikan padahal harus membagi, dan $\\frac{1}{5}$ menambah 2 pada penyebut.',
              ),
              hint: L(
                'Count the small pieces that make up the whole tray in the lower bar. Each child gets one of them.',
                'Hitung potongan kecil yang membentuk seluruh loyang pada batang bawah. Tiap anak mendapat satu potong.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: $\\frac{2}{3}\\div4$. First multiply the denominator by 4. Then simplify $\\frac{2}{12}$ by dividing the numerator and the denominator by 2.',
                'Coba bersama: $\\frac{2}{3}\\div4$. Kalikan dulu penyebut dengan 4. Lalu sederhanakan $\\frac{2}{12}$ dengan membagi pembilang dan penyebut dengan 2.',
              ),
              template: '3 \\times 4 = ___ \\quad 2 \\div 2 = ___ \\quad 12 \\div 2 = ___',
              blanks: ['12', '1', '6'],
              explain: L(
                '$\\frac{2}{3}\\div4=\\frac{2}{12}=\\frac{1}{6}$.',
                '$\\frac{2}{3}\\div4=\\frac{2}{12}=\\frac{1}{6}$.',
              ),
              hint: L(
                'The numerator stays 2 in the first step. Only the denominator changes when you divide by a whole number.',
                'Pembilang tetap 2 pada langkah pertama. Hanya penyebut yang berubah ketika membagi dengan bilangan asli.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                '$\\frac{4}{5}$ liter of water (the gray part) is poured equally into 2 glasses, as the picture shows. How many liters are in each glass?',
                '$\\frac{4}{5}$ liter air (bagian abu-abu) dituang sama banyak ke 2 gelas, seperti terlihat pada gambar. Berapa liter air di tiap gelas?',
              ),
              figure: {
                ...cutBar(5, 4, 2),
                caption: L('The gray $\\frac{4}{5}$ is cut into 2 equal shares, one color each.', '$\\frac{4}{5}$ yang abu-abu dipotong menjadi 2 bagian sama besar, tiap bagian satu warna.'),
              },
              options: [
                L('$\\frac{2}{5}$', '$\\frac{2}{5}$'),
                L('$\\frac{2}{10}$', '$\\frac{2}{10}$'),
                L('$\\frac{8}{5}$', '$\\frac{8}{5}$'),
                L('$\\frac{4}{7}$', '$\\frac{4}{7}$'),
              ],
              answer: 0,
              explain: L(
                'Each glass gets 4 of the 10 small pieces, which is $\\frac{4}{10}=\\frac{2}{5}$. Giving $\\frac{2}{10}$ halves the numerator AND doubles the denominator, $\\frac{8}{5}$ multiplies, and $\\frac{4}{7}$ adds 2 to the denominator.',
                'Tiap gelas mendapat 4 dari 10 potong kecil, yaitu $\\frac{4}{10}=\\frac{2}{5}$. Jawaban $\\frac{2}{10}$ membagi dua pembilang DAN menggandakan penyebut, $\\frac{8}{5}$ mengalikan, dan $\\frac{4}{7}$ menambah 2 pada penyebut.',
              ),
              hint: L(
                'In the lower bar, count how many small pieces one color covers. How many small pieces make the whole?',
                'Pada batang bawah, hitung berapa potong kecil yang ditutupi satu warna. Berapa potong kecil yang membentuk seluruhnya?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\frac{1}{2}\\div4=\\frac{1}{8}$', '$\\frac{1}{2}\\div4=\\frac{1}{8}$'),
                L('$\\frac{3}{5}\\div3=\\frac{1}{15}$', '$\\frac{3}{5}\\div3=\\frac{1}{15}$'),
                L('$\\frac{2}{3}\\div2=\\frac{4}{3}$', '$\\frac{2}{3}\\div2=\\frac{4}{3}$'),
                L('Because $\\frac{3}{10}\\times2=\\frac{6}{10}$, we know that $\\frac{6}{10}\\div2=\\frac{3}{10}$', 'Karena $\\frac{3}{10}\\times2=\\frac{6}{10}$, kita tahu bahwa $\\frac{6}{10}\\div2=\\frac{3}{10}$'),
              ],
              answer: [true, false, false, true],
              explain: L(
                '$\\frac{1}{2}\\div4=\\frac{1}{8}$ is right. $\\frac{3}{5}\\div3=\\frac{3}{15}=\\frac{1}{5}$, not $\\frac{1}{15}$. $\\frac{2}{3}\\div2=\\frac{1}{3}$, and $\\frac{4}{3}$ is bigger than $\\frac{2}{3}$. Division is the opposite of multiplication, so the last one is right.',
                '$\\frac{1}{2}\\div4=\\frac{1}{8}$ benar. $\\frac{3}{5}\\div3=\\frac{3}{15}=\\frac{1}{5}$, bukan $\\frac{1}{15}$. $\\frac{2}{3}\\div2=\\frac{1}{3}$, dan $\\frac{4}{3}$ lebih besar dari $\\frac{2}{3}$. Pembagian adalah kebalikan perkalian, jadi yang terakhir benar.',
              ),
              hint: L(
                'The answer to a division by a whole number must be smaller than the fraction you started with. Check each one against that.',
                'Hasil pembagian dengan bilangan asli harus lebih kecil dari pecahan awalnya. Periksa tiap pernyataan dengan itu.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for $\\frac{6}{7}\\div4$ in order.', 'Urutkan langkah menghitung $\\frac{6}{7}\\div4$.'),
              lines: {
                en: ['\\frac{6}{7} \\div 4 = \\frac{6}{7 \\times 4}', '= \\frac{6}{28}', '\\text{GCF of 6 and 28} = 2', '= \\frac{6 \\div 2}{28 \\div 2} = \\frac{3}{14}'],
                id: ['\\frac{6}{7} \\div 4 = \\frac{6}{7 \\times 4}', '= \\frac{6}{28}', '\\text{FPB dari 6 dan 28} = 2', '= \\frac{6 \\div 2}{28 \\div 2} = \\frac{3}{14}'],
              },
              explain: L(
                'Multiply the denominator first, then look for the GCF, then divide both numbers by it.',
                'Kalikan penyebut dulu, lalu cari FPB, kemudian bagi kedua angka dengan FPB itu.',
              ),
              hint: L(
                'You can only simplify after the division has been written as one fraction.',
                'Kamu baru bisa menyederhanakan setelah pembagiannya ditulis sebagai satu pecahan.',
              ),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'Mr. Eko cuts a rope $8\\frac{1}{4}$ m long into 6 equal pieces. How long is each piece? Write the answer as a mixed number in simplest form.',
                'Pak Eko memotong seutas tali sepanjang $8\\frac{1}{4}$ m menjadi 6 potong sama panjang. Berapa panjang tiap potong? Tulis jawabannya sebagai pecahan campuran dalam bentuk paling sederhana.',
              ),
              inline: true,
              blanks: mixed(1, 3, 8),
              hints: [
                L(
                  'Cutting into equal pieces means dividing. First change the mixed number into an improper fraction.',
                  'Memotong menjadi bagian sama panjang berarti membagi. Ubah dulu pecahan campuran menjadi pecahan tak wajar.',
                ),
                L(
                  'Multiply the denominator of the improper fraction by 6, then simplify with the GCF.',
                  'Kalikan penyebut pecahan tak wajar itu dengan 6, lalu sederhanakan dengan FPB.',
                ),
                L(
                  '$8\\frac{1}{4}=\\frac{33}{4}$, so you get $\\frac{33}{24}$. Simplify it, then change it to a mixed number. Check by multiplying back by 6.',
                  '$8\\frac{1}{4}=\\frac{33}{4}$, jadi kamu mendapat $\\frac{33}{24}$. Sederhanakan, lalu ubah ke pecahan campuran. Periksa dengan mengalikan kembali dengan 6.',
                ),
              ],
              explain: L(
                '$\\frac{33}{4}\\div6=\\frac{33}{24}=\\frac{11}{8}=1\\frac{3}{8}$ m. Check: $6\\times\\frac{11}{8}=\\frac{66}{8}=8\\frac{1}{4}$.',
                '$\\frac{33}{4}\\div6=\\frac{33}{24}=\\frac{11}{8}=1\\frac{3}{8}$ m. Periksa: $6\\times\\frac{11}{8}=\\frac{66}{8}=8\\frac{1}{4}$.',
              ),
              solution: ['8\\frac{1}{4}=\\frac{33}{4}', '\\frac{33}{4}\\div6=\\frac{33}{24}=\\frac{11}{8}', '\\frac{11}{8}=1\\frac{3}{8}'],
            },
            {
              kind: 'judge',
              id: 'j2',
              prompt: L(
                'Mrs. Siti has 5 cans of cooking oil, each holding $2\\frac{3}{4}$ liters. She pours all the oil into 9 big bottles of equal size and 4 small bottles. Each small bottle holds half as much as a big bottle, and every bottle is filled completely. Decide whether each statement is True or False.',
                'Bu Siti punya 5 kaleng minyak goreng, masing-masing berisi $2\\frac{3}{4}$ liter. Ia menuangkan semua minyak itu ke 9 botol besar yang sama ukurannya dan 4 botol kecil. Tiap botol kecil memuat setengah dari botol besar, dan setiap botol terisi penuh. Tentukan apakah setiap pernyataan Benar atau Salah.',
              ),
              statements: [
                L('In all she has $13\\frac{3}{4}$ liters of oil.', 'Seluruhnya ia punya $13\\frac{3}{4}$ liter minyak.'),
                L('Each big bottle holds $1\\frac{1}{4}$ liters.', 'Tiap botol besar memuat $1\\frac{1}{4}$ liter.'),
                L('The 4 small bottles hold 2 liters together.', 'Keempat botol kecil memuat 2 liter bersama-sama.'),
                L('The 4 small bottles together hold as much oil as 2 big bottles.', 'Keempat botol kecil bersama-sama memuat minyak sebanyak 2 botol besar.'),
              ],
              answer: [true, true, false, true],
              explain: L(
                'Total: $5\\times2\\frac{3}{4}=5\\times\\frac{11}{4}=\\frac{55}{4}=13\\frac{3}{4}$ liters. Two small bottles equal one big one, so the 4 small bottles count as 2 big ones, and there are $9+2=11$ big bottles in all. Each big bottle holds $\\frac{55}{4}\\div11=\\frac{5}{4}=1\\frac{1}{4}$ liters, so the 4 small bottles hold $2\\times1\\frac{1}{4}=2\\frac{1}{2}$ liters, not 2.',
                'Jumlah: $5\\times2\\frac{3}{4}=5\\times\\frac{11}{4}=\\frac{55}{4}=13\\frac{3}{4}$ liter. Dua botol kecil sama dengan satu botol besar, jadi 4 botol kecil sama dengan 2 botol besar, dan seluruhnya ada $9+2=11$ botol besar. Tiap botol besar memuat $\\frac{55}{4}\\div11=\\frac{5}{4}=1\\frac{1}{4}$ liter, jadi 4 botol kecil memuat $2\\times1\\frac{1}{4}=2\\frac{1}{2}$ liter, bukan 2.',
              ),
              hint: L(
                'First find the total amount of oil. Then count the bottles as if they were all big ones: how many big bottles are the 4 small ones worth?',
                'Cari dulu jumlah seluruh minyak. Lalu hitung semua botol seolah-olah botol besar: 4 botol kecil sama dengan berapa botol besar?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Mr. Joko has $\\frac{4}{5}$ liter of paint. He pours it equally into 6 small cans. How many liters of paint are in 3 of those cans together? Write the fraction in simplest form.',
                'Pak Joko punya $\\frac{4}{5}$ liter cat. Ia menuangkannya sama banyak ke 6 kaleng kecil. Berapa liter cat dalam 3 kaleng itu bersama-sama? Tulis pecahannya dalam bentuk paling sederhana.',
              ),
              inline: true,
              blanks: numDen(2, 5),
              hints: [
                L(
                  'First find how much paint is in ONE can. That is $\\frac{4}{5}$ divided by 6.',
                  'Cari dulu berapa cat dalam SATU kaleng. Itu adalah $\\frac{4}{5}$ dibagi 6.',
                ),
                L(
                  'Multiply the denominator by 6 and simplify. Then multiply the numerator of your answer by 3.',
                  'Kalikan penyebut dengan 6 dan sederhanakan. Lalu kalikan pembilang jawabanmu dengan 3.',
                ),
                L(
                  'One can has $\\frac{4}{30}=\\frac{2}{15}$ liter. For 3 cans, multiply that by 3 and simplify again.',
                  'Satu kaleng berisi $\\frac{4}{30}=\\frac{2}{15}$ liter. Untuk 3 kaleng, kalikan itu dengan 3 dan sederhanakan lagi.',
                ),
              ],
              explain: L(
                'One can holds $\\frac{4}{5}\\div6=\\frac{4}{30}=\\frac{2}{15}$ liter. Three cans hold $3\\times\\frac{2}{15}=\\frac{6}{15}=\\frac{2}{5}$ liter.',
                'Satu kaleng berisi $\\frac{4}{5}\\div6=\\frac{4}{30}=\\frac{2}{15}$ liter. Tiga kaleng berisi $3\\times\\frac{2}{15}=\\frac{6}{15}=\\frac{2}{5}$ liter.',
              ),
              solution: ['\\frac{4}{5}\\div6=\\frac{4}{30}=\\frac{2}{15}', '3\\times\\frac{2}{15}=\\frac{6}{15}', '\\frac{6}{15}=\\frac{2}{5}'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m3-s3-p',
        runtime: 'math',
        title: L('Times and Divided by Whole Numbers', 'Dikali dan Dibagi Bilangan Asli'),
        brief: L(
          'Multiply and divide fractions and mixed numbers by whole numbers in plain sums and in rice, syrup and oil problems.',
          'Kalikan dan bagi pecahan serta pecahan campuran dengan bilangan asli dalam hitungan biasa serta soal beras, sirup, dan minyak.',
        ),
        requirements: [
          L('Multiply a fraction or a mixed number by a whole number.', 'Mengalikan pecahan atau pecahan campuran dengan bilangan asli.'),
          L('Divide a fraction or a mixed number by a whole number, and use both in one problem.', 'Membagi pecahan atau pecahan campuran dengan bilangan asli, dan memakai keduanya dalam satu soal.'),
        ],
        hints: [
          L('Times a whole number: only the numerator is multiplied. Divided by a whole number: only the denominator is multiplied.', 'Dikali bilangan asli: hanya pembilang yang dikali. Dibagi bilangan asli: hanya penyebut yang dikali.'),
          L('Check a division by multiplying back: the answer times the whole number must give the amount you started with.', 'Periksa pembagian dengan mengalikan kembali: hasilnya dikali bilangan asli harus sama dengan jumlah awal.'),
          L('For a mixed number, change it to an improper fraction first. For the last task, go step by step: the total, then one bottle, then 4 bottles.', 'Untuk pecahan campuran, ubah dulu menjadi pecahan tak wajar. Untuk soal terakhir, kerjakan langkah demi langkah: jumlah seluruhnya, lalu satu botol, lalu 4 botol.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L('Multiply. Write the answer as an improper fraction.', 'Kalikan. Tulis jawabannya sebagai pecahan tak wajar.'),
            given: '5\\times\\frac{2}{9}',
            inline: true,
            blanks: numDen(10, 9),
            solution: ['5\\times\\frac{2}{9}=\\frac{5\\times2}{9}', '=\\frac{10}{9}'],
          },
          {
            prompt: L(
              'Mum buys 6 packs of rice. Each pack weighs $2\\frac{1}{4}$ kg. How many kilograms of rice is that? Write it as a mixed number in simplest form.',
              'Ibu membeli 6 bungkus beras. Tiap bungkus beratnya $2\\frac{1}{4}$ kg. Berapa kilogram beras itu? Tulis sebagai pecahan campuran dalam bentuk paling sederhana.',
            ),
            inline: true,
            blanks: mixed(13, 1, 2),
            solution: ['2\\frac{1}{4}=\\frac{9}{4}', '6\\times\\frac{9}{4}=\\frac{54}{4}', '\\frac{54}{4}=13\\frac{2}{4}=13\\frac{1}{2}'],
          },
          {
            prompt: L(
              'Mum has $\\frac{3}{4}$ liter of syrup. She pours it equally into 6 glasses. How many liters of syrup are in each glass? Write the fraction in simplest form.',
              'Ibu punya $\\frac{3}{4}$ liter sirup. Ia menuangkannya sama banyak ke 6 gelas. Berapa liter sirup di tiap gelas? Tulis pecahannya dalam bentuk paling sederhana.',
            ),
            inline: true,
            blanks: numDen(1, 8),
            solution: ['\\frac{3}{4}\\div6=\\frac{3}{4\\times6}=\\frac{3}{24}', '\\frac{3}{24}=\\frac{3\\div3}{24\\div3}=\\frac{1}{8}'],
          },
          {
            prompt: L(
              'Mr. Joko pours the oil from 6 cans, each holding $2\\frac{1}{4}$ liters, equally into 9 bottles. How many liters of oil are in 4 of the bottles?',
              'Pak Joko menuangkan minyak dari 6 kaleng, masing-masing berisi $2\\frac{1}{4}$ liter, sama banyak ke 9 botol. Berapa liter minyak di 4 botol itu?',
            ),
            blanks: [{ answer: 6, after: { en: '\\text{ liters}', id: '\\text{ liter}' } }],
            solution: ['6\\times2\\frac{1}{4}=6\\times\\frac{9}{4}=\\frac{54}{4}=13\\frac{1}{2}', '13\\frac{1}{2}\\div9=\\frac{27}{2}\\div9=\\frac{27}{18}=\\frac{3}{2}', '4\\times\\frac{3}{2}=6'],
          },
        ],
      },
    },
  ],
}
