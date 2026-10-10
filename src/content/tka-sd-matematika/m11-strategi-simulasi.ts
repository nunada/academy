import type { Loc, MathBlank, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece, Pt } from './figs'
import { barChart, clockFace, cubeStack3d, cuboid3d, fractionBars, fit, line, numberLine, outline, pictogram, rectPts, shape, solid, txt } from './figs'

/** Module 11 — strategies for word problems, the three TKA question formats,
 *  time management, and two full practice tests plus a final try-out. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- local drawing helpers */

type Seg = { w: number; text?: string; color?: FigColor; empty?: boolean }
type BarRow = { name?: string; segs: Seg[]; offset?: number; brace?: string }

/** Bar models: each row is a bar cut into segments whose widths are in proportion
 *  (`w` is the real amount). `offset` starts a row part-way along; `brace` draws a
 *  bracket and a number over the whole row. Figure text is numbers and names only. */
function barModel(rows: BarRow[]): Piece {
  const W = 10
  const widthOf = (r: BarRow) => (r.offset ?? 0) + r.segs.reduce((s, g) => s + g.w, 0)
  const k = W / Math.max(...rows.map(widthOf))
  const hasBrace = rows.some((r) => r.brace)
  const gap = hasBrace ? 2.7 : 1.7
  const items: FigItem[] = []
  rows.forEach((r, i) => {
    const y0 = (rows.length - 1 - i) * gap
    const x0 = (r.offset ?? 0) * k
    let x = x0
    for (const g of r.segs) {
      const cell = rectPts(x, y0, g.w * k, 1)
      items.push(g.empty ? outline(cell) : solid(cell, g.color ?? 'a'))
      if (g.text) items.push(txt(x + (g.w * k) / 2, y0 + 0.5, g.text, 'md', 'muted'))
      x += g.w * k
    }
    if (r.name) items.push(txt(-0.4, y0 + 0.5, r.name, 'md', 'muted', 'end'))
    if (r.brace) {
      items.push(line([x0, y0 + 1.3], [x, y0 + 1.3], 'result', { width: 3 }))
      items.push(txt((x0 + x) / 2, y0 + 1.95, r.brace, 'md', 'result'))
    }
  })
  const top = (rows.length - 1) * gap + 1 + (hasBrace ? 1.2 : 0)
  const left = rows.some((r) => r.name) ? -2.8 : 0
  return { dim: 2, axes: false, ...fit([[left, -0.2], [W + 0.2, top]], 0.5), items }
}

/** `n` squares in a row made of matchsticks; each new square adds its own three
 *  sticks in a new color, so the "+3" can be seen. */
function sticks(n: number): Piece {
  const items: FigItem[] = []
  const cols: FigColor[] = ['a', 'b', 'c', 'result']
  for (let i = 0; i < n; i++) {
    const c = cols[i % 4]
    items.push(line([i, 1], [i + 1, 1], c, { width: 5 }), line([i, 0], [i + 1, 0], c, { width: 5 }), line([i + 1, 0], [i + 1, 1], c, { width: 5 }))
    if (i === 0) items.push(line([0, 0], [0, 1], c, { width: 5 }))
  }
  return { dim: 2, axes: false, ...fit([[0, 0], [n, 1]], 0.7), items }
}

/** A die seen from one corner: the top, left and right faces show, with their dots. */
function dieView(top: number, left: number, right: number): Piece {
  const s = 1.732
  const UL: Pt = [-s, 1]
  const T: Pt = [0, 2]
  const UR: Pt = [s, 1]
  const C: Pt = [0, 0]
  const LL: Pt = [-s, -1]
  const B: Pt = [0, -2]
  const spots: Record<number, Pt[]> = {
    1: [[0.5, 0.5]],
    2: [[0.25, 0.25], [0.75, 0.75]],
    3: [[0.2, 0.2], [0.5, 0.5], [0.8, 0.8]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.25, 0.2], [0.25, 0.5], [0.25, 0.8], [0.75, 0.2], [0.75, 0.5], [0.75, 0.8]],
  }
  const items: FigItem[] = []
  const face = (o: Pt, u: Pt, v: Pt, n: number) => {
    items.push(outline([o, [o[0] + u[0], o[1] + u[1]], [o[0] + u[0] + v[0], o[1] + u[1] + v[1]], [o[0] + v[0], o[1] + v[1]]], 'muted'))
    for (const [a, b] of spots[n]) items.push({ t: 'dot', x: o[0] + a * u[0] + b * v[0], y: o[1] + a * u[1] + b * v[1], color: 'a' })
  }
  face(UL, [T[0] - UL[0], T[1] - UL[1]], [C[0] - UL[0], C[1] - UL[1]], top)
  face(UL, [C[0] - UL[0], C[1] - UL[1]], [LL[0] - UL[0], LL[1] - UL[1]], left)
  face(C, [UR[0] - C[0], UR[1] - C[1]], [B[0] - C[0], B[1] - C[1]], right)
  return { dim: 2, axes: false, ...fit([[-s, -2], [s, 2]], 0.4), items }
}

/** Tick labels in eighths: 0, 1/8, 2/8, ... 1. */
const eighths = (v: number): string => {
  const n = Math.round(v * 8)
  return n === 0 ? '0' : n === 8 ? '1' : `${n}/8`
}

const LBL_N = { en: '\\text{numerator} =', id: '\\text{pembilang} =' }
const LBL_D = { en: '\\text{denominator} =', id: '\\text{penyebut} =' }
/** Two boxes for a fraction in simplest form: numerator, then denominator. */
const numDen = (n: number, d: number): MathBlank[] => [
  { label: LBL_N, answer: n },
  { label: LBL_D, answer: d },
]
const RP: MathBlank['label'] = '\\text{Rp}'

/* ---------------------------------------------------------------------------- the module */

export const module11: Module = {
  id: 'tka-m11',
  title: L('Strategy and Practice Tests', 'Strategi dan Simulasi TKA'),
  summary: L(
    'Learn a plan for every word problem, get to know the three TKA question formats, manage your time, and then try two practice tests, a final try-out and questions in the style of the official framework.',
    'Pelajari rencana untuk setiap soal cerita, kenali tiga bentuk soal TKA, atur waktumu, lalu coba dua simulasi, satu try-out akhir, dan soal bergaya kerangka asesmen resmi.',
  ),
  submodules: [
    /* ======================================================================== S1: strategies */
    {
      id: 'tka-m11-s1',
      title: L('Problem-Solving Strategies', 'Strategi Memecahkan Soal'),
      summary: L(
        'A four-step plan for word problems, with bar models, tables, guess and check, working backward and estimating, and then reasoning problems that mix topics.',
        'Rencana empat langkah untuk soal cerita, dengan model batang, tabel, coba-coba, berpikir mundur, dan menaksir, lalu soal bernalar yang mencampur beberapa topik.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m11-s1-l1',
          title: L('Four Steps for Word Problems', 'Empat Langkah Memecahkan Soal Cerita'),
          goal: L(
            'You can solve a word problem with four steps: understand, plan, calculate and check.',
            'Kamu bisa memecahkan soal cerita dengan empat langkah: pahami, rencanakan, hitung, dan periksa.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Four Steps', 'Ayo Amati: Empat Langkah'),
              body: L(
                `Ani buys 3 notebooks at Rp4,000 each and 1 pen for Rp2,500. She pays with Rp20,000. How much change does she get?\n\nA word problem is a small story with a question hiding inside. Do not rush to add up every number! Use the same four steps every time.\n\n| Step | What you do |\n| --- | --- |\n| Understand | Read it twice. Underline what is asked. Circle what is given. |\n| Plan | Choose a plan: draw a bar model, make a table, guess and check, or work backward. |\n| Calculate | Work one small step at a time and write the units. |\n| Check | Does the answer fit the question? Is it sensible? Estimate to check. |\n\nThe bar model shows Ani's story: the money she pays is made of 3 notebooks, 1 pen and the change.`,
                `Ani membeli 3 buku tulis seharga Rp4.000 per buah dan 1 pulpen seharga Rp2.500. Ia membayar dengan Rp20.000. Berapa uang kembaliannya?\n\nSoal cerita adalah cerita pendek dengan pertanyaan yang tersembunyi di dalamnya. Jangan buru-buru menjumlahkan semua angka! Pakai empat langkah yang sama setiap kali.\n\n| Langkah | Yang kamu lakukan |\n| --- | --- |\n| Pahami | Baca dua kali. Garis bawahi yang ditanyakan. Lingkari yang diketahui. |\n| Rencanakan | Pilih rencana: gambar model batang, buat tabel, coba-coba, atau berpikir mundur. |\n| Hitung | Kerjakan satu langkah kecil demi satu langkah dan tulis satuannya. |\n| Periksa | Apakah jawabannya cocok dengan pertanyaan? Masuk akal? Taksir untuk memeriksa. |\n\nModel batang menunjukkan cerita Ani: uang yang ia bayarkan terdiri dari 3 buku tulis, 1 pulpen, dan uang kembalian.`,
              ),
              figure: {
                ...barModel([
                  {
                    segs: [
                      { w: 4000, text: '4000', color: 'a' },
                      { w: 4000, text: '4000', color: 'a' },
                      { w: 4000, text: '4000', color: 'a' },
                      { w: 2500, text: '2500', color: 'b' },
                      { w: 5500, text: '?', color: 'result' },
                    ],
                    brace: '20000',
                  },
                ]),
                caption: L(
                  'A bar model of the story, in rupiah. The three green pieces are the notebooks, the orange piece is the pen, and the red piece is the change.',
                  'Model batang dari cerita itu, dalam rupiah. Tiga bagian hijau adalah buku tulis, bagian oranye adalah pulpen, dan bagian merah adalah uang kembalian.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: A Bar Model', 'Contoh Bertahap: Model Batang'),
              body: L(
                `Ani and Budi have 56 marbles together. Ani has 8 more marbles than Budi. How many marbles does Budi have?\n\n1. Step 1, Understand: given, 56 marbles in all and Ani has 8 more. Asked, the number of marbles Budi has.\n2. Step 2, Plan: draw two bars. Ani's bar is Budi's bar plus an extra piece of 8.\n3. Step 3, Calculate: take the extra piece away first, $56 - 8 = 48$. Now the two bars are equal, so $48 \\div 2 = 24$. Budi has 24 marbles.\n4. Step 4, Check: Ani has $24 + 8 = 32$ and together $24 + 32 = 56$. It fits!\n\n**Remember:**\n\n- Draw first, calculate second.\n- Take away the extra piece, so that equal bars are left to share.\n- Always check by putting the answer back into the story.`,
                `Ani dan Budi punya 56 kelereng bersama-sama. Kelereng Ani 8 lebih banyak daripada kelereng Budi. Berapa kelereng Budi?\n\n1. Langkah 1, Pahami: diketahui 56 kelereng seluruhnya dan Ani punya 8 lebih banyak. Ditanyakan banyak kelereng Budi.\n2. Langkah 2, Rencanakan: gambar dua batang. Batang Ani adalah batang Budi ditambah satu bagian ekstra sebesar 8.\n3. Langkah 3, Hitung: buang bagian ekstra dulu, $56 - 8 = 48$. Sekarang kedua batang sama panjang, jadi $48 \\div 2 = 24$. Kelereng Budi ada 24.\n4. Langkah 4, Periksa: kelereng Ani $24 + 8 = 32$ dan jumlahnya $24 + 32 = 56$. Cocok!\n\n**Ingat:**\n\n- Gambar dulu, hitung kemudian.\n- Buang bagian ekstra, supaya tersisa batang-batang sama panjang yang tinggal dibagi.\n- Selalu periksa dengan memasukkan jawaban kembali ke cerita.`,
              ),
              figure: {
                ...barModel([
                  { name: 'Budi', segs: [{ w: 24, text: '?', color: 'a' }] },
                  { name: 'Ani', segs: [{ w: 24, text: '?', color: 'a' }, { w: 8, text: '8', color: 'b' }] },
                ]),
                caption: L(
                  'Budi has one bar. Ani has the same bar and 8 more. Together they have 56.',
                  'Budi punya satu batang. Ani punya batang yang sama dan 8 lagi. Bersama-sama mereka punya 56.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Guess and Check', 'Contoh Bertahap: Coba-coba dan Periksa'),
              body: L(
                `Pak Eko has chickens and goats in his yard. There are 10 animals with 28 legs in all. How many goats are there? (A chicken has 2 legs and a goat has 4 legs.)\n\n1. Step 1: make a sensible first guess, say 3 goats. Then there are $10 - 3 = 7$ chickens.\n2. Step 2: check the legs, $3 \\times 4 + 7 \\times 2 = 12 + 14 = 26$. That is too few, so we need more goats, because goats have more legs.\n3. Step 3: guess again, 4 goats and 6 chickens. $4 \\times 4 + 6 \\times 2 = 16 + 12 = 28$. It matches!\n4. Step 4: the answer is 4 goats. Write every guess in a table, so you never repeat one.\n\n| Goats | Chickens | Legs | Too low or too high? |\n| --- | --- | --- | --- |\n| 3 | 7 | 26 | too low |\n| 4 | 6 | 28 | just right |\n\n**Remember:** after every guess, ask "too low or too high?" and move your next guess in the right direction.`,
                `Pak Eko punya ayam dan kambing di halaman. Ada 10 hewan dengan 28 kaki seluruhnya. Berapa ekor kambingnya? (Ayam berkaki 2 dan kambing berkaki 4.)\n\n1. Langkah 1: buat tebakan pertama yang masuk akal, misalnya 3 kambing. Maka ada $10 - 3 = 7$ ayam.\n2. Langkah 2: periksa jumlah kaki, $3 \\times 4 + 7 \\times 2 = 12 + 14 = 26$. Itu terlalu sedikit, jadi kita perlu lebih banyak kambing, karena kambing punya lebih banyak kaki.\n3. Langkah 3: tebak lagi, 4 kambing dan 6 ayam. $4 \\times 4 + 6 \\times 2 = 16 + 12 = 28$. Cocok!\n4. Langkah 4: jawabannya 4 kambing. Tulis setiap tebakan dalam tabel, supaya tidak mengulang tebakan yang sama.\n\n| Kambing | Ayam | Kaki | Terlalu kecil atau besar? |\n| --- | --- | --- | --- |\n| 3 | 7 | 26 | terlalu kecil |\n| 4 | 6 | 28 | tepat |\n\n**Ingat:** setelah setiap tebakan, tanyakan "terlalu kecil atau terlalu besar?" lalu geser tebakan berikutnya ke arah yang benar.`,
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Working Backward', 'Contoh Bertahap: Berpikir Mundur'),
              body: L(
                `Citra had some money. She spent Rp5,000 on lunch. Then her mother gave her Rp3,000. Now she has Rp12,000. How much money did she have at the start?\n\n1. Step 1: write the story in order. Start, then minus 5, then plus 3, and the end is 12 (in thousands of rupiah).\n2. Step 2: go backward and do the opposite of each step. The last step was "plus 3", so undo it: $12 - 3 = 9$.\n3. Step 3: the step before was "minus 5", so undo it: $9 + 5 = 14$. Citra started with Rp14,000.\n4. Step 4: check by going forward, $14 - 5 = 9$ and then $9 + 3 = 12$. Correct!\n\n**Remember:** to work backward, start from the end and undo each step in reverse order. Plus becomes minus, and times becomes divide.`,
                `Citra punya sejumlah uang. Ia membelanjakan Rp5.000 untuk makan siang. Lalu ibunya memberinya Rp3.000. Sekarang uangnya Rp12.000. Berapa uang Citra mula-mula?\n\n1. Langkah 1: tulis ceritanya berurutan. Mula-mula, lalu kurang 5, lalu tambah 3, dan akhirnya 12 (dalam ribuan rupiah).\n2. Langkah 2: berjalan mundur dan lakukan kebalikan setiap langkah. Langkah terakhir "tambah 3", jadi batalkan: $12 - 3 = 9$.\n3. Langkah 3: langkah sebelumnya "kurang 5", jadi batalkan: $9 + 5 = 14$. Uang Citra mula-mula Rp14.000.\n4. Langkah 4: periksa dengan berjalan maju, $14 - 5 = 9$ lalu $9 + 3 = 12$. Benar!\n\n**Ingat:** untuk berpikir mundur, mulai dari akhir dan batalkan tiap langkah dengan urutan terbalik. Tambah menjadi kurang, dan kali menjadi bagi.`,
              ),
              figure: {
                ...numberLine({
                  from: 8,
                  to: 15,
                  step: 1,
                  jumps: [
                    { from: 12, to: 9, label: '-3', color: 'a' },
                    { from: 9, to: 14, label: '+5', color: 'b' },
                  ],
                  marks: [{ at: 12, color: 'a' }, { at: 14, color: 'result' }],
                }),
                caption: L(
                  'In thousands of rupiah. From the end (12) we undo "plus 3" and then undo "minus 5" and reach the start (14, red).',
                  'Dalam ribuan rupiah. Dari akhir (12) kita membatalkan "tambah 3" lalu membatalkan "kurang 5" dan sampai di awal (14, merah).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c5',
              title: L('Step by Step: Estimate to Check', 'Contoh Bertahap: Menaksir untuk Memeriksa'),
              body: L(
                `Budi buys 19 packs of pencils with 12 pencils in each pack. He says he has 328 pencils. Is that sensible?\n\n1. Step 1: round to friendly numbers. 19 is close to 20.\n2. Step 2: estimate, $20 \\times 12 = 240$.\n3. Step 3: compare. 328 is far from 240, so Budi's answer is not sensible.\n4. Step 4: calculate carefully, $19 \\times 12 = 228$. This is close to 240, so 228 is sensible.\n\n**Remember:**\n\n- An estimate is not the exact answer, but it warns you when an answer is far off.\n- Round to numbers that are easy to calculate in your head.\n- Check the last digit too: $9 \\times 2 = 18$ ends in 8, so the answer must end in 8.`,
                `Budi membeli 19 bungkus pensil dengan isi 12 pensil per bungkus. Ia bilang pensilnya ada 328. Masuk akalkah?\n\n1. Langkah 1: bulatkan ke bilangan yang mudah. 19 dekat dengan 20.\n2. Langkah 2: taksir, $20 \\times 12 = 240$.\n3. Langkah 3: bandingkan. 328 jauh dari 240, jadi jawaban Budi tidak masuk akal.\n4. Langkah 4: hitung dengan teliti, $19 \\times 12 = 228$. Ini dekat dengan 240, jadi 228 masuk akal.\n\n**Ingat:**\n\n- Taksiran bukan jawaban pasti, tetapi memperingatkanmu kalau jawaban terlalu jauh.\n- Bulatkan ke bilangan yang mudah dihitung di kepala.\n- Periksa juga angka satuannya: $9 \\times 2 = 18$ berakhir 8, jadi jawabannya harus berakhir 8.`,
              ),
              figure: {
                ...numberLine({
                  from: 200,
                  to: 340,
                  step: 20,
                  marks: [{ at: 240, color: 'b', label: '240' }, { at: 328, color: 'result', label: '328' }],
                }),
                caption: L(
                  'The estimate (240, orange) and Budi\'s answer (328, red). They are far apart.',
                  'Taksiran (240, oranye) dan jawaban Budi (328, merah). Keduanya berjauhan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c6',
              title: L('Watch Out!: Word Problem Traps', 'Awas, Jebakan!: Jebakan Soal Cerita'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| Ani buys 3 notebooks and a pen for Rp14,500, so the answer is Rp14,500. | That is only the total spent. The question asks for the change: Rp20,000 − Rp14,500 = Rp5,500. Read the question again before you write the answer. |\n| Add all the numbers in the story: 56 + 8. | Not every number is added. Draw a bar model first to see what each number does. |\n| Write the first answer you get and move on. | Put the answer back in the story or estimate. Change that is bigger than the money paid is clearly wrong. |`,
                `| Salah | Benar |\n| --- | --- |\n| Ani membeli 3 buku tulis dan pulpen seharga Rp14.500, jadi jawabannya Rp14.500. | Itu baru jumlah yang dibelanjakan. Yang ditanya uang kembalian: Rp20.000 − Rp14.500 = Rp5.500. Baca lagi pertanyaannya sebelum menulis jawaban. |\n| Jumlahkan semua angka dalam cerita: 56 + 8. | Tidak semua angka dijumlahkan. Gambar model batang dulu untuk melihat fungsi tiap angka. |\n| Tulis jawaban pertama yang didapat lalu lanjut. | Masukkan jawaban kembali ke cerita atau taksir. Uang kembalian yang lebih besar daripada uang yang dibayarkan jelas salah. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Rudi and Hasan have Rp45,000 together. Rudi has Rp9,000 more than Hasan, as the bar model shows. Which calculation gives the money Hasan has?',
                'Rudi dan Hasan punya uang Rp45.000 bersama-sama. Uang Rudi Rp9.000 lebih banyak daripada uang Hasan, seperti pada model batang. Perhitungan mana yang memberi uang Hasan?',
              ),
              figure: {
                ...barModel([
                  { name: 'Hasan', segs: [{ w: 18, text: '?', color: 'a' }] },
                  { name: 'Rudi', segs: [{ w: 18, text: '?', color: 'a' }, { w: 9, text: '9000', color: 'b' }] },
                ]),
                caption: L('Hasan has one bar. Rudi has the same bar and Rp9,000 more.', 'Hasan punya satu batang. Rudi punya batang yang sama dan Rp9.000 lebih banyak.'),
              },
              options: [
                L('$(45\\,000 - 9\\,000) \\div 2$', '$(45\\,000 - 9\\,000) \\div 2$'),
                L('$45\\,000 \\div 2$', '$45\\,000 \\div 2$'),
                L('$45\\,000 - 9\\,000$', '$45\\,000 - 9\\,000$'),
                L('$(45\\,000 + 9\\,000) \\div 2$', '$(45\\,000 + 9\\,000) \\div 2$'),
              ],
              answer: 0,
              explain: L(
                'Take away Rudi\'s extra piece first, then the two equal bars can be shared. Dividing 45,000 by 2 forgets the extra piece, subtracting only leaves both bars together, and adding 9,000 gives Rudi\'s money, not Hasan\'s.',
                'Buang dulu bagian ekstra milik Rudi, lalu kedua batang yang sama panjang bisa dibagi. Membagi 45.000 dengan 2 melupakan bagian ekstra, hanya mengurangi masih menyisakan kedua batang, dan menambah 9.000 memberi uang Rudi, bukan Hasan.',
              ),
              hint: L(
                'Which two bars are the same size once Rudi\'s extra piece is taken away?',
                'Kedua batang mana yang sama panjang setelah bagian ekstra Rudi dibuang?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: Ani and Budi have 40 marbles together. Ani has 6 more than Budi. How many marbles does Budi have?',
                'Coba bersama: Ani dan Budi punya 40 kelereng bersama-sama. Kelereng Ani 6 lebih banyak daripada Budi. Berapa kelereng Budi?',
              ),
              template: '40 - 6 = ___ \\qquad 34 \\div 2 = ___',
              blanks: ['34', '17'],
              explain: L(
                'Without the extra 6, the two bars are equal and hold 34 marbles together. Each bar is $34 \\div 2 = 17$, so Budi has 17 marbles. Check: Ani has 23 and $17 + 23 = 40$.',
                'Tanpa tambahan 6, kedua batang sama panjang dan berisi 34 kelereng. Tiap batang $34 \\div 2 = 17$, jadi Budi punya 17 kelereng. Periksa: Ani punya 23 dan $17 + 23 = 40$.',
              ),
              hint: L(
                'First take the extra 6 away from 40. Then share what is left between the two equal bars.',
                'Pertama buang tambahan 6 dari 40. Lalu bagi sisanya untuk kedua batang yang sama panjang.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Rudi buys 4 notebooks at Rp7,800 each and pays with Rp50,000. By estimating, which amount is the change he gets?',
                'Rudi membeli 4 buku tulis seharga Rp7.800 per buah dan membayar dengan Rp50.000. Dengan menaksir, uang kembalian mana yang ia terima?',
              ),
              options: [
                L('Rp18,800', 'Rp18.800'),
                L('Rp28,800', 'Rp28.800'),
                L('Rp8,800', 'Rp8.800'),
                L('Rp38,800', 'Rp38.800'),
              ],
              answer: 0,
              explain: L(
                'Round Rp7,800 to Rp8,000. Then $4 \\times 8\\,000 = 32\\,000$ and the change is about $50\\,000 - 32\\,000 = 18\\,000$. Only Rp18,800 is close to that. The exact change is $50\\,000 - 31\\,200 = 18\\,800$.',
                'Bulatkan Rp7.800 menjadi Rp8.000. Maka $4 \\times 8\\,000 = 32\\,000$ dan kembaliannya sekitar $50\\,000 - 32\\,000 = 18\\,000$. Hanya Rp18.800 yang dekat dengan itu. Kembalian pastinya $50\\,000 - 31\\,200 = 18\\,800$.',
              ),
              hint: L(
                'Round the price to a friendly number, multiply by 4, and subtract from Rp50,000. Which option is close to your estimate?',
                'Bulatkan harga ke bilangan yang mudah, kalikan 4, lalu kurangkan dari Rp50.000. Pilihan mana yang dekat dengan taksiranmu?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the TWO good ways to check an answer.', 'Pilih DUA cara yang baik untuk memeriksa jawaban.'),
              options: [
                L('Put the answer back into the story and see if it fits.', 'Masukkan jawaban kembali ke cerita dan lihat apakah cocok.'),
                L('Estimate with rounded numbers and compare.', 'Taksir dengan bilangan yang dibulatkan lalu bandingkan.'),
                L('Choose the biggest number you got, because big answers are usually right.', 'Pilih bilangan terbesar yang kamu dapat, karena jawaban besar biasanya benar.'),
                L('Calculate again in exactly the same way and hope it changes.', 'Hitung lagi dengan cara yang persis sama dan berharap hasilnya berubah.'),
              ],
              answer: [0, 1],
              explain: L(
                'Putting the answer back in the story and estimating can both catch a mistake. A big number is not more likely to be right, and repeating the same mistake gives the same wrong answer.',
                'Memasukkan jawaban ke cerita dan menaksir sama-sama bisa menangkap kesalahan. Bilangan besar tidak lebih mungkin benar, dan mengulang kesalahan yang sama memberi jawaban salah yang sama.',
              ),
              hint: L(
                'A good check can find a mistake. Which options could show you that an answer is wrong?',
                'Pemeriksaan yang baik bisa menemukan kesalahan. Pilihan mana yang bisa menunjukkan bahwa jawaban salah?',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: L('Put the four steps for solving a word problem in order.', 'Urutkan empat langkah memecahkan soal cerita.'),
              lines: {
                en: [
                  'Read the problem, underline what is asked and circle what is given',
                  'Choose a plan, for example draw a bar model',
                  'Calculate one small step at a time',
                  'Put the answer back into the story to check it',
                ],
                id: [
                  'Baca soal, garis bawahi yang ditanyakan dan lingkari yang diketahui',
                  'Pilih rencana, misalnya gambar model batang',
                  'Hitung satu langkah kecil demi satu langkah',
                  'Masukkan jawaban kembali ke cerita untuk memeriksanya',
                ],
              },
              explain: L(
                'First understand the problem, then plan, then calculate, and check last.',
                'Pertama pahami soal, lalu rencanakan, lalu hitung, dan periksa di akhir.',
              ),
              hint: L(
                'You cannot calculate before you know what is asked, and the check comes when you have an answer.',
                'Kamu tidak bisa menghitung sebelum tahu apa yang ditanyakan, dan pemeriksaan dilakukan setelah ada jawaban.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Bu Siti buys 3 kg of rice at Rp12,500 per kg and 2 bottles of cooking oil at Rp15,000 each. She pays with Rp100,000. How much change does she get?',
                'Bu Siti membeli 3 kg beras seharga Rp12.500 per kg dan 2 botol minyak goreng seharga Rp15.000 per botol. Ia membayar dengan Rp100.000. Berapa uang kembaliannya?',
              ),
              blanks: [{ label: RP, answer: 32500 }],
              hints: [
                L(
                  'Underline the question and list what Bu Siti buys. What does she pay with?',
                  'Garis bawahi pertanyaannya dan daftar apa yang dibeli Bu Siti. Ia membayar dengan berapa?',
                ),
                L(
                  'Find what she spends on rice, then what she spends on oil. Add them to get the total she spends.',
                  'Cari uang untuk beras, lalu uang untuk minyak. Jumlahkan untuk mendapat total yang ia belanjakan.',
                ),
                L(
                  'Rice is $3 \\times 12\\,500$ and oil is $2 \\times 15\\,000$. Add the two amounts, then subtract the total from $100\\,000$.',
                  'Beras $3 \\times 12\\,500$ dan minyak $2 \\times 15\\,000$. Jumlahkan kedua uang itu, lalu kurangkan totalnya dari $100\\,000$.',
                ),
              ],
              explain: L(
                'Rice costs Rp37,500 and oil costs Rp30,000, so she spends Rp67,500. The change is $100\\,000 - 67\\,500 = 32\\,500$. Check by estimating: $3 \\times 12\\,000 + 2 \\times 15\\,000 = 66\\,000$, close to 67,500.',
                'Beras Rp37.500 dan minyak Rp30.000, jadi ia membelanjakan Rp67.500. Kembaliannya $100\\,000 - 67\\,500 = 32\\,500$. Periksa dengan menaksir: $3 \\times 12\\,000 + 2 \\times 15\\,000 = 66\\,000$, dekat dengan 67.500.',
              ),
              solution: [
                '3 \\times 12\\,500 = 37\\,500',
                '2 \\times 15\\,000 = 30\\,000',
                '37\\,500 + 30\\,000 = 67\\,500',
                '100\\,000 - 67\\,500 = 32\\,500',
              ],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m11-s1-l2',
          title: L('Reasoning: Multi-Step and Mixed-Topic Problems', 'Bernalar: Soal Bertahap dan Lintas Topik'),
          goal: L(
            'You can break a problem that mixes topics into small questions and reason about what must be true.',
            'Kamu bisa memecah soal yang mencampur topik menjadi pertanyaan kecil dan bernalar tentang apa yang pasti benar.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Puzzles That Mix Topics', 'Ayo Amati: Soal yang Mencampur Topik'),
              body: L(
                `Some TKA problems mix topics, for example fractions with measuring, or data with percent. They look hard, but the numbers are not big. You only need a plan.\n\nHere is one. Pak Joko has a wire 2 m long. He uses $\\frac{2}{5}$ of it for a frame and cuts the rest into 4 equal pieces. How long is each piece?\n\nBreak it into small questions:\n\n- How many centimeters are in 2 m?\n- How long is $\\frac{2}{5}$ of the wire?\n- How much wire is left?\n- How long is each of the 4 pieces?`,
                `Beberapa soal TKA mencampur topik, misalnya pecahan dengan pengukuran, atau data dengan persen. Kelihatannya sulit, tetapi angkanya tidak besar. Kamu hanya butuh rencana.\n\nIni salah satunya. Pak Joko punya kawat sepanjang 2 m. Ia memakai $\\frac{2}{5}$ bagian untuk membuat bingkai dan memotong sisanya menjadi 4 bagian sama panjang. Berapa panjang tiap potongan?\n\nPecah menjadi pertanyaan-pertanyaan kecil:\n\n- Ada berapa sentimeter dalam 2 m?\n- Berapa panjang $\\frac{2}{5}$ bagian kawat itu?\n- Berapa kawat yang tersisa?\n- Berapa panjang masing-masing dari 4 potongan?`,
              ),
              figure: {
                ...barModel([
                  {
                    segs: [
                      { w: 1, color: 'a' },
                      { w: 1, color: 'a' },
                      { w: 1, color: 'b' },
                      { w: 1, color: 'b' },
                      { w: 1, color: 'b' },
                    ],
                    brace: '200',
                  },
                ]),
                caption: L(
                  'The wire is 200 cm long, cut into 5 equal parts. The 2 green parts are used for the frame.',
                  'Kawat panjangnya 200 cm, dibagi menjadi 5 bagian sama panjang. 2 bagian hijau dipakai untuk bingkai.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Solving the Wire Puzzle', 'Contoh Bertahap: Memecahkan Teka-teki Kawat'),
              body: L(
                `Let us answer the small questions one by one.\n\n1. Step 1, Understand: the wire is 2 m long, $\\frac{2}{5}$ is used, and the rest is cut into 4 equal pieces. Asked, the length of one piece.\n2. Step 2, Plan: change meters to centimeters, find $\\frac{2}{5}$ of the wire, subtract, then divide by 4.\n3. Step 3, Calculate: $2\\text{ m} = 200\\text{ cm}$. One fifth is $200 \\div 5 = 40$, so two fifths is $2 \\times 40 = 80\\text{ cm}$.\n4. Step 4, Calculate: what is left is $200 - 80 = 120\\text{ cm}$, and each piece is $120 \\div 4 = 30\\text{ cm}$.\n5. Step 5, Check: $4 \\times 30 = 120$ and $120 + 80 = 200$. It fits!\n\n**Remember:**\n\n- Write every small answer with its unit.\n- Use the same unit all the way through.\n- The last small answer is not always the one asked for, so check what the question wants.`,
                `Mari kita jawab pertanyaan-pertanyaan kecil itu satu per satu.\n\n1. Langkah 1, Pahami: kawat panjangnya 2 m, $\\frac{2}{5}$ bagian dipakai, dan sisanya dipotong menjadi 4 bagian sama panjang. Ditanyakan panjang satu potongan.\n2. Langkah 2, Rencanakan: ubah meter ke sentimeter, cari $\\frac{2}{5}$ bagian kawat, kurangkan, lalu bagi 4.\n3. Langkah 3, Hitung: $2\\text{ m} = 200\\text{ cm}$. Seperlima adalah $200 \\div 5 = 40$, jadi dua perlima adalah $2 \\times 40 = 80\\text{ cm}$.\n4. Langkah 4, Hitung: sisanya $200 - 80 = 120\\text{ cm}$, dan tiap potongan $120 \\div 4 = 30\\text{ cm}$.\n5. Langkah 5, Periksa: $4 \\times 30 = 120$ dan $120 + 80 = 200$. Cocok!\n\n**Ingat:**\n\n- Tulis setiap jawaban kecil dengan satuannya.\n- Pakai satuan yang sama sampai akhir.\n- Jawaban kecil yang terakhir belum tentu yang ditanyakan, jadi periksa apa yang diminta soal.`,
              ),
              figure: {
                ...barModel([
                  {
                    segs: [
                      { w: 40, text: '40', color: 'a' },
                      { w: 40, text: '40', color: 'a' },
                      { w: 40, text: '40', color: 'b' },
                      { w: 40, text: '40', color: 'b' },
                      { w: 40, text: '40', color: 'b' },
                    ],
                    brace: '200',
                  },
                  {
                    offset: 80,
                    segs: [
                      { w: 30, text: '30', color: 'c' },
                      { w: 30, text: '30', color: 'c' },
                      { w: 30, text: '30', color: 'c' },
                      { w: 30, text: '30', color: 'c' },
                    ],
                  },
                ]),
                caption: L(
                  'In cm. The 3 orange parts that are left (120 cm) are cut again into 4 equal pieces of 30 cm.',
                  'Dalam cm. 3 bagian oranye yang tersisa (120 cm) dipotong lagi menjadi 4 potongan sama panjang, masing-masing 30 cm.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Finding a Pattern', 'Contoh Bertahap: Mencari Pola'),
              body: L(
                `Citra makes squares in a row from matchsticks. One square needs 4 sticks, two squares in a row need 7 sticks, and three squares need 10 sticks. How many sticks do 10 squares need?\n\n1. Step 1: write the numbers: 4, 7, 10.\n2. Step 2: find the jump, $7 - 4 = 3$ and $10 - 7 = 3$. Each new square adds 3 sticks, because it shares one side with the square before it.\n3. Step 3: the first square has 4 sticks and the other 9 squares add 3 sticks each, $4 + 9 \\times 3 = 4 + 27 = 31$.\n4. Step 4: test the rule on a case you know. For 3 squares, $4 + 2 \\times 3 = 10$. It matches the picture.\n\n**Remember:** when a pattern goes up by the same amount each time, the number you want is the first number plus (the number of steps) × (the jump).`,
                `Citra menyusun persegi berjajar dari batang korek api. Satu persegi memerlukan 4 batang, dua persegi berjajar memerlukan 7 batang, dan tiga persegi memerlukan 10 batang. Berapa batang yang diperlukan untuk 10 persegi?\n\n1. Langkah 1: tulis bilangannya: 4, 7, 10.\n2. Langkah 2: cari loncatannya, $7 - 4 = 3$ dan $10 - 7 = 3$. Setiap persegi baru menambah 3 batang, karena satu sisinya dipakai bersama dengan persegi sebelumnya.\n3. Langkah 3: persegi pertama 4 batang dan 9 persegi lainnya menambah 3 batang masing-masing, $4 + 9 \\times 3 = 4 + 27 = 31$.\n4. Langkah 4: uji aturannya pada kasus yang kamu tahu. Untuk 3 persegi, $4 + 2 \\times 3 = 10$. Cocok dengan gambar.\n\n**Ingat:** kalau pola naik dengan jumlah yang sama setiap kali, bilangan yang dicari adalah bilangan pertama ditambah (banyak langkah) × (loncatan).`,
              ),
              figure: {
                ...sticks(3),
                caption: L(
                  'Three squares in a row. The first square has 4 sticks, and each new square adds 3 sticks of a new color.',
                  'Tiga persegi berjajar. Persegi pertama 4 batang, dan setiap persegi baru menambah 3 batang dengan warna baru.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Mixed-Topic Traps', 'Awas, Jebakan!: Jebakan Soal Campuran'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| $\\frac{2}{5}$ of 200 cm is 80 cm, so each piece is 80 cm. | 80 cm is only the wire used for the frame. Keep going until you answer what is asked: each piece is 30 cm. |\n| 2 m − 80 cm = 78. | Change to the same unit first: 200 cm − 80 cm = 120 cm. |\n| 4, 7, 10, ... so 10 squares need 10 × 4 = 40 sticks. | The squares share sides, so each new square adds only 3 sticks: 31 sticks. |`,
                `| Salah | Benar |\n| --- | --- |\n| $\\frac{2}{5}$ dari 200 cm adalah 80 cm, jadi tiap potongan 80 cm. | 80 cm baru kawat yang dipakai untuk bingkai. Teruskan sampai menjawab yang ditanyakan: tiap potongan 30 cm. |\n| 2 m − 80 cm = 78. | Ubah ke satuan yang sama dulu: 200 cm − 80 cm = 120 cm. |\n| 4, 7, 10, ... jadi 10 persegi memerlukan 10 × 4 = 40 batang. | Persegi-persegi berbagi sisi, jadi tiap persegi baru hanya menambah 3 batang: 31 batang. |`,
              ),
            },
            {
              kind: 'concept',
              id: 'c5',
              title: L('Look Closely: The Three Levels of Questions', 'Ayo Amati: Tiga Tingkat Soal'),
              body: L(
                `The TKA asks for three kinds of thinking, from easier to harder. When you know which one a question wants, you know what to do.\n\n| Level | What you do | Example |\n| --- | --- | --- |\n| Understand | Calculate, read a table or a chart, sort into groups, recognize | How many books did Ani read? Read her bar. |\n| Apply | Turn a story into a math sentence, use a formula, explain what an answer means | 3 notebooks at Rp4,000 and a pen at Rp2,500: write the sum and say what it tells you. |\n| Reason | Connect several ideas, choose the best strategy, draw a conclusion | Which shop is cheaper? Which statement does the chart really support? |\n\nA test mixes all three levels, so practice all of them. Before you start, ask yourself: do I only read and calculate, do I turn a story into a math sentence, or do I have to think it through?`,
                `TKA meminta tiga macam berpikir, dari yang lebih mudah sampai yang lebih sulit. Kalau kamu tahu soal itu meminta yang mana, kamu tahu apa yang harus dilakukan.\n\n| Tingkat | Yang kamu lakukan | Contoh |\n| --- | --- | --- |\n| Memahami | Menghitung, membaca tabel atau diagram, mengelompokkan, mengenali | Berapa buku yang dibaca Ani? Baca batang miliknya. |\n| Mengaplikasikan | Mengubah cerita menjadi kalimat matematika, memakai rumus, menjelaskan makna sebuah jawaban | 3 buku tulis seharga Rp4.000 dan sebuah pulpen Rp2.500: tulis jumlahnya dan jelaskan artinya. |\n| Bernalar | Menghubungkan beberapa konsep, memilih strategi terbaik, menarik kesimpulan | Toko mana yang lebih murah? Pernyataan mana yang benar-benar didukung diagram? |\n\nSebuah tes mencampur ketiga tingkat itu, jadi latihlah semuanya. Sebelum mulai, tanyakan pada dirimu: apakah aku hanya membaca dan menghitung, mengubah cerita menjadi kalimat matematika, atau harus memikirkannya sampai tuntas?`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bar chart shows the votes in a class election. Each of the 25 children voted once. What percent of the children voted for Citra or Dewi?',
                'Diagram batang menunjukkan suara dalam pemilihan ketua kelas. Setiap dari 25 anak memilih satu kali. Berapa persen anak yang memilih Citra atau Dewi?',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 10, color: 'a' },
                    { label: 'Budi', value: 6, color: 'b' },
                    { label: 'Citra', value: 5, color: 'c' },
                    { label: 'Dewi', value: 4, color: 'result' },
                  ],
                  max: 12,
                  step: 2,
                }),
                caption: L('Votes for each candidate.', 'Banyak suara untuk setiap calon.'),
              },
              options: [
                L('36%', '36%'),
                L('9%', '9%'),
                L('64%', '64%'),
                L('45%', '45%'),
              ],
              answer: 0,
              explain: L(
                'Citra and Dewi got $5 + 4 = 9$ votes. 25 votes make 100%, so one vote is 4%, and $9 \\times 4 = 36$. The 9% answer uses the votes as a percent, and 64% is the share of Ani and Budi.',
                'Citra dan Dewi mendapat $5 + 4 = 9$ suara. 25 suara sama dengan 100%, jadi satu suara 4%, dan $9 \\times 4 = 36$. Jawaban 9% memakai banyak suara sebagai persen, dan 64% adalah bagian Ani dan Budi.',
              ),
              hint: L(
                'Add the votes for Citra and Dewi first. How many percent is one vote worth if 25 votes make 100%?',
                'Jumlahkan dulu suara Citra dan Dewi. Satu suara bernilai berapa persen kalau 25 suara sama dengan 100%?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: what percent of the 25 children voted for Ani (10 votes)?',
                'Coba bersama: berapa persen dari 25 anak yang memilih Ani (10 suara)?',
              ),
              template: '100 \\div 25 = ___ \\qquad 10 \\times 4 = ___',
              blanks: ['4', '40'],
              explain: L(
                'One vote is worth $100 \\div 25 = 4$ percent, so 10 votes are $10 \\times 4 = 40$ percent.',
                'Satu suara bernilai $100 \\div 25 = 4$ persen, jadi 10 suara adalah $10 \\times 4 = 40$ persen.',
              ),
              hint: L(
                'First find how many percent one vote is worth. Then multiply by the number of votes.',
                'Pertama cari satu suara bernilai berapa persen. Lalu kalikan dengan banyak suara.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The perimeter of this rectangle is 28 cm and its length is 9 cm. What is its area?',
                'Keliling persegi panjang ini 28 cm dan panjangnya 9 cm. Berapa luasnya?',
              ),
              figure: {
                ...shape({ pts: rectPts(0, 0, 9, 5), sides: ['9 cm', '?', undefined, undefined], rights: [0, 1, 2, 3] }),
                caption: L('A rectangle. The length is 9 cm and the width is not known.', 'Sebuah persegi panjang. Panjangnya 9 cm dan lebarnya belum diketahui.'),
              },
              options: [
                L('$45\\text{ cm}^2$', '$45\\text{ cm}^2$'),
                L('$126\\text{ cm}^2$', '$126\\text{ cm}^2$'),
                L('$171\\text{ cm}^2$', '$171\\text{ cm}^2$'),
                L('$36\\text{ cm}^2$', '$36\\text{ cm}^2$'),
              ],
              answer: 0,
              explain: L(
                'The two lengths use $2 \\times 9 = 18$ cm of the 28 cm, so the two widths share $28 - 18 = 10$ cm and each width is 5 cm. The area is $9 \\times 5 = 45$ cm². The answer 126 uses half the perimeter (14) as the width.',
                'Dua panjang memakai $2 \\times 9 = 18$ cm dari 28 cm, jadi dua lebar berbagi $28 - 18 = 10$ cm dan tiap lebar 5 cm. Luasnya $9 \\times 5 = 45$ cm². Jawaban 126 memakai setengah keliling (14) sebagai lebar.',
              ),
              hint: L(
                'You need the width first. The perimeter is made of 2 lengths and 2 widths.',
                'Kamu perlu lebarnya dulu. Keliling terdiri dari 2 panjang dan 2 lebar.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'A whole number is a multiple of 6. Choose the TWO statements that must be true.',
                'Sebuah bilangan cacah adalah kelipatan 6. Pilih DUA pernyataan yang pasti benar.',
              ),
              options: [
                L('The number is even.', 'Bilangan itu genap.'),
                L('The number is a multiple of 3.', 'Bilangan itu kelipatan 3.'),
                L('The number is a multiple of 4.', 'Bilangan itu kelipatan 4.'),
                L('The number is a multiple of 12.', 'Bilangan itu kelipatan 12.'),
              ],
              answer: [0, 1],
              explain: L(
                '$6 = 2 \\times 3$, so every multiple of 6 is a multiple of 2 (even) and of 3. But 6 and 18 are multiples of 6 that are not multiples of 4 or of 12, so those two need not be true.',
                '$6 = 2 \\times 3$, jadi setiap kelipatan 6 adalah kelipatan 2 (genap) dan kelipatan 3. Tetapi 6 dan 18 adalah kelipatan 6 yang bukan kelipatan 4 atau 12, jadi kedua pernyataan itu belum tentu benar.',
              ),
              hint: L(
                '"Must be true" means true for every multiple of 6. Test a statement on 6, 12 and 18. One counter-example makes it not certain.',
                '"Pasti benar" berarti benar untuk setiap kelipatan 6. Uji pernyataan pada 6, 12, dan 18. Satu contoh yang tidak cocok membuatnya tidak pasti.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'Citra keeps making squares in a row from matchsticks, as in the picture. Decide whether each statement is True or False.',
                'Citra terus menyusun persegi berjajar dari batang korek api, seperti pada gambar. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...sticks(3),
                caption: L('3 squares need 10 sticks. Each new square adds 3 more.', '3 persegi memerlukan 10 batang. Setiap persegi baru menambah 3 batang lagi.'),
              },
              statements: [
                L('5 squares in a row need 16 sticks.', '5 persegi berjajar memerlukan 16 batang.'),
                L('The number of sticks is always an even number.', 'Banyak batang selalu bilangan genap.'),
                L('Every new square adds 3 sticks.', 'Setiap persegi baru menambah 3 batang.'),
                L('20 squares in a row need 80 sticks.', '20 persegi berjajar memerlukan 80 batang.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The rule is $4 + (\\text{squares} - 1) \\times 3$. For 5 squares, $4 + 12 = 16$. For 20 squares, $4 + 19 \\times 3 = 61$, not 80. The sticks go 4, 7, 10, ..., so odd numbers appear too.',
                'Aturannya $4 + (\\text{persegi} - 1) \\times 3$. Untuk 5 persegi, $4 + 12 = 16$. Untuk 20 persegi, $4 + 19 \\times 3 = 61$, bukan 80. Banyak batang 4, 7, 10, ..., jadi ada juga bilangan ganjil.',
              ),
              hint: L(
                'Use the rule: 4 sticks for the first square, then 3 more for each new one. Test it on the picture first.',
                'Pakai aturan: 4 batang untuk persegi pertama, lalu 3 batang lagi untuk setiap persegi baru. Uji dulu pada gambar.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Rudi rides from town A to town B, 90 km away. He rides the first $\\frac{1}{3}$ of the distance at 30 km/h and the rest at 40 km/h. How many minutes does the whole trip take?',
                'Pak Rudi mengendarai motor dari kota A ke kota B sejauh 90 km. Ia menempuh $\\frac{1}{3}$ jarak pertama dengan kecepatan 30 km/jam dan sisanya dengan kecepatan 40 km/jam. Berapa menit seluruh perjalanan itu?',
              ),
              blanks: [{ answer: 150, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
              hints: [
                L(
                  'Split the trip into two parts. How long is each part?',
                  'Bagi perjalanan menjadi dua bagian. Berapa panjang masing-masing bagian?',
                ),
                L(
                  'Part one is $\\frac{1}{3}$ of 90 km, and part two is the rest. For each part, time = distance ÷ speed.',
                  'Bagian pertama adalah $\\frac{1}{3}$ dari 90 km, dan bagian kedua adalah sisanya. Untuk tiap bagian, waktu = jarak ÷ kecepatan.',
                ),
                L(
                  'Part one is 30 km at 30 km/h and part two is 60 km at 40 km/h. Find both times in hours, add them, and change the hours to minutes.',
                  'Bagian pertama 30 km dengan 30 km/jam dan bagian kedua 60 km dengan 40 km/jam. Cari kedua waktu dalam jam, jumlahkan, lalu ubah jam menjadi menit.',
                ),
              ],
              explain: L(
                'Part one: 30 km at 30 km/h takes 1 hour. Part two: 60 km at 40 km/h takes 1.5 hours. In all 2.5 hours, which is 150 minutes.',
                'Bagian pertama: 30 km dengan 30 km/jam memerlukan 1 jam. Bagian kedua: 60 km dengan 40 km/jam memerlukan 1,5 jam. Seluruhnya 2,5 jam, yaitu 150 menit.',
              ),
              solution: [
                '\\frac{1}{3} \\times 90 = 30 \\text{ km},\\quad 90 - 30 = 60 \\text{ km}',
                '30 \\div 30 = 1 \\text{ h},\\quad 60 \\div 40 = \\frac{3}{2} \\text{ h}',
                '1 + \\frac{3}{2} = \\frac{5}{2} \\text{ h}',
                '\\frac{5}{2} \\times 60 = 150 \\text{ min}',
              ],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m11-s1-p',
        runtime: 'math',
        title: L('Project: Plan, Calculate, Check', 'Proyek: Rencanakan, Hitung, Periksa'),
        brief: L(
          'Four word problems that need a plan, from easy to a real reasoning puzzle. Use a bar model, working backward or small questions.',
          'Empat soal cerita yang memerlukan rencana, dari yang mudah sampai teka-teki bernalar. Pakai model batang, berpikir mundur, atau pertanyaan-pertanyaan kecil.',
        ),
        requirements: [
          L('Use the four steps and a plan for each word problem.', 'Memakai empat langkah dan satu rencana untuk setiap soal cerita.'),
          L('Break a mixed-topic problem into small questions.', 'Memecah soal lintas topik menjadi pertanyaan-pertanyaan kecil.'),
        ],
        tasks: [
          {
            prompt: L(
              'A bus has 40 seats. Three buses are full, and one more bus carries 25 passengers. How many passengers are there in all?',
              'Sebuah bus punya 40 tempat duduk. Tiga bus penuh, dan satu bus lagi membawa 25 penumpang. Berapa penumpang seluruhnya?',
            ),
            blanks: [{ answer: 145, after: { en: '\\text{ passengers}', id: '\\text{ penumpang}' } }],
            solution: ['3 \\times 40 = 120', '120 + 25 = 145'],
          },
          {
            prompt: L(
              'Hasan and Gita have Rp90,000 together. Hasan has Rp14,000 more than Gita. How much money does Hasan have?',
              'Hasan dan Gita punya uang Rp90.000 bersama-sama. Uang Hasan Rp14.000 lebih banyak daripada uang Gita. Berapa uang Hasan?',
            ),
            blanks: [{ label: RP, answer: 52000 }],
            solution: [
              '90\\,000 - 14\\,000 = 76\\,000',
              '76\\,000 \\div 2 = 38\\,000 \\text{ (Gita)}',
              '38\\,000 + 14\\,000 = 52\\,000 \\text{ (Hasan)}',
            ],
          },
          {
            prompt: L(
              'Pak Joko sold half of the mangoes in his basket in the morning. In the afternoon he sold 12 more. Now 8 mangoes are left. How many mangoes were in the basket at the start?',
              'Pak Joko menjual setengah dari mangga dalam keranjangnya pada pagi hari. Siang harinya ia menjual 12 lagi. Sekarang tersisa 8 mangga. Berapa mangga dalam keranjang pada awalnya?',
            ),
            blanks: [{ answer: 40, after: { en: '\\text{ mangoes}', id: '\\text{ mangga}' } }],
            solution: {
              en: [
                '8 + 12 = 20 \\text{ (half of the mangoes)}',
                '20 \\times 2 = 40',
                '40 \\div 2 = 20,\\quad 20 - 12 = 8',
              ],
              id: [
                '8 + 12 = 20 \\text{ (setengah dari mangga)}',
                '20 \\times 2 = 40',
                '40 \\div 2 = 20,\\quad 20 - 12 = 8',
              ],
            },
          },
          {
            prompt: L(
              'A water tank is 60 cm long, 40 cm wide and 50 cm high (inside). It is $\\frac{3}{5}$ full of water. How many more liters of water are needed to fill it?',
              'Sebuah bak air panjangnya 60 cm, lebarnya 40 cm, dan tingginya 50 cm (bagian dalam). Bak itu terisi $\\frac{3}{5}$ bagian air. Berapa liter air lagi yang diperlukan untuk memenuhinya?',
            ),
            figure: {
              ...cuboid3d({ l: 6, w: 4, h: 5, labels: { l: '60', w: '40', h: '50' } }),
              caption: L('The tank. The sides are in cm.', 'Bak air. Ukuran sisinya dalam cm.'),
            },
            blanks: [{ answer: 48, after: { en: '\\text{ liters}', id: '\\text{ liter}' } }],
            solution: {
              en: [
                '60 \\times 40 \\times 50 = 120\\,000 \\text{ cm}^3 = 120 \\text{ l}',
                '\\frac{3}{5} \\text{ of } 120 = 120 \\div 5 \\times 3 = 72 \\text{ l}',
                '120 - 72 = 48 \\text{ l}',
              ],
              id: [
                '60 \\times 40 \\times 50 = 120\\,000 \\text{ cm}^3 = 120 \\text{ l}',
                '\\frac{3}{5} \\text{ dari } 120 = 120 \\div 5 \\times 3 = 72 \\text{ l}',
                '120 - 72 = 48 \\text{ l}',
              ],
            },
          },
        ],
        hints: [
          L(
            'Draw a picture or a bar model before you calculate. Ask: what is asked, and what is given?',
            'Gambar atau buat model batang sebelum menghitung. Tanyakan: apa yang ditanyakan, dan apa yang diketahui?',
          ),
          L(
            'When a story ends with the answer and asks about the start, work backward and undo every step.',
            'Kalau cerita berakhir dengan jawaban dan menanyakan awalnya, berpikir mundur dan batalkan setiap langkah.',
          ),
          L(
            'For the tank, find how many liters it holds when full, then how many liters are in it now.',
            'Untuk bak air, cari berapa liter yang termuat saat penuh, lalu berapa liter yang ada di dalamnya sekarang.',
          ),
        ],
        xp: 50,
      },
    },

    /* ======================================================================== S2: question formats */
    {
      id: 'tka-m11-s2',
      title: L('TKA Question Formats', 'Bentuk Soal TKA'),
      summary: L(
        'How to read one-answer questions, choose-all questions and True/False tables, and how to use your 75 minutes well.',
        'Cara membaca soal satu jawaban, soal pilih semua yang benar, dan tabel Benar/Salah, serta cara memakai waktu 75 menitmu dengan baik.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m11-s2-l1',
          title: L('Multiple Choice and Choose-All-That-Apply', 'Pilihan Ganda dan Pilihan Ganda Kompleks'),
          goal: L(
            'You can read a question carefully, cross out wrong options, and check every option in a choose-all question.',
            'Kamu bisa membaca soal dengan teliti, mencoret pilihan yang salah, dan memeriksa setiap pilihan pada soal pilih semua yang benar.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Reading a TKA Question', 'Ayo Amati: Membaca Soal TKA'),
              body: L(
                `The TKA uses three kinds of questions. Look at what each one asks you to do.\n\n| Kind | What you do | How it is marked |\n| --- | --- | --- |\n| One answer | Choose the one correct option. | Right or wrong. |\n| Choose all that apply | Choose every correct option. More than one answer is correct. | All the correct options and none that are wrong, or no points. |\n| True or False | Mark each statement True or False. | Every statement must be right. |\n\nIn a choose-all question the test says: "Choose the correct answers! More than one answer is correct." Some questions also come in a group: several questions about one shared picture or table. Read the shared picture once, carefully, and use it for every question in the group.\n\nRead like a detective. Circle the question word (how many, which, NOT, only, most), underline the units, and look at the picture, its title and its scale before you read the options.\n\nIn the chart, the bars are the data and the numbers at the side are the scale. Read the scale, not only how tall a bar looks.`,
                `TKA memakai tiga jenis soal. Lihat apa yang diminta oleh masing-masing.\n\n| Jenis | Yang kamu lakukan | Cara menilainya |\n| --- | --- | --- |\n| Satu jawaban | Pilih satu pilihan yang benar. | Benar atau salah. |\n| Pilih semua yang benar | Pilih setiap pilihan yang benar. Jawaban benar lebih dari satu. | Semua pilihan benar terpilih dan tidak ada yang salah, kalau tidak, tidak ada nilai. |\n| Benar atau Salah | Tandai tiap pernyataan Benar atau Salah. | Setiap pernyataan harus tepat. |\n\nPada soal pilih semua, tes menuliskan: "Pilihlah jawaban yang benar! Jawaban benar lebih dari satu." Ada juga soal yang datang berkelompok: beberapa soal tentang satu gambar atau satu tabel yang sama. Baca gambar bersama itu satu kali dengan teliti, lalu pakai untuk setiap soal dalam kelompok itu.\n\nBacalah seperti detektif. Lingkari kata tanya (berapa, manakah, BUKAN, hanya, paling), garis bawahi satuannya, dan lihat gambar, judul, serta skalanya sebelum membaca pilihan.\n\nPada diagram, batang adalah datanya dan angka di samping adalah skalanya. Baca skalanya, jangan hanya melihat setinggi apa batangnya.`,
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 12, color: 'a' },
                    { label: 'Budi', value: 8, color: 'b' },
                    { label: 'Citra', value: 15, color: 'c' },
                    { label: 'Dewi', value: 10, color: 'result' },
                  ],
                  max: 16,
                  step: 4,
                  showValues: false,
                }),
                caption: L(
                  'Books read by four children. The scale goes up in fours.',
                  'Buku yang dibaca empat anak. Skalanya naik empat-empat.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: One Answer, by Elimination', 'Contoh Bertahap: Satu Jawaban dengan Eliminasi'),
              body: L(
                `Which fraction is between $\\frac{1}{2}$ and $\\frac{3}{4}$? The options are $\\frac{3}{8}$, $\\frac{5}{8}$, $\\frac{7}{8}$ and $\\frac{1}{4}$.\n\n1. Step 1: read the question word. "Between" means bigger than $\\frac{1}{2}$ and smaller than $\\frac{3}{4}$.\n2. Step 2: write everything in eighths. $\\frac{1}{2} = \\frac{4}{8}$ and $\\frac{3}{4} = \\frac{6}{8}$.\n3. Step 3: cross out the options that are clearly wrong. $\\frac{3}{8}$ and $\\frac{1}{4} = \\frac{2}{8}$ are smaller than $\\frac{4}{8}$. $\\frac{7}{8}$ is bigger than $\\frac{6}{8}$.\n4. Step 4: check the option that is left against the question. $\\frac{5}{8}$ is bigger than $\\frac{4}{8}$ and smaller than $\\frac{6}{8}$. It is the answer.\n\n**Remember:**\n\n- Cross out options you know are wrong, instead of only looking for the right one.\n- Even when one option is left, check it against the question.\n- If you are stuck, guess from the options that are left.`,
                `Pecahan manakah yang berada di antara $\\frac{1}{2}$ dan $\\frac{3}{4}$? Pilihannya $\\frac{3}{8}$, $\\frac{5}{8}$, $\\frac{7}{8}$, dan $\\frac{1}{4}$.\n\n1. Langkah 1: baca kata tanyanya. "Di antara" berarti lebih besar dari $\\frac{1}{2}$ dan lebih kecil dari $\\frac{3}{4}$.\n2. Langkah 2: tulis semuanya dalam perdelapan. $\\frac{1}{2} = \\frac{4}{8}$ dan $\\frac{3}{4} = \\frac{6}{8}$.\n3. Langkah 3: coret pilihan yang jelas salah. $\\frac{3}{8}$ dan $\\frac{1}{4} = \\frac{2}{8}$ lebih kecil dari $\\frac{4}{8}$. $\\frac{7}{8}$ lebih besar dari $\\frac{6}{8}$.\n4. Langkah 4: periksa pilihan yang tersisa dengan pertanyaannya. $\\frac{5}{8}$ lebih besar dari $\\frac{4}{8}$ dan lebih kecil dari $\\frac{6}{8}$. Itulah jawabannya.\n\n**Ingat:**\n\n- Coret pilihan yang kamu tahu salah, jangan hanya mencari yang benar.\n- Walaupun tinggal satu pilihan, periksa dengan pertanyaannya.\n- Kalau buntu, tebaklah dari pilihan yang tersisa.`,
              ),
              figure: {
                ...numberLine({ from: 0, to: 1, step: 1 / 8, fmt: eighths, shade: [0.5, 0.75], marks: [{ at: 0.5, color: 'b' }, { at: 0.75, color: 'b' }] }),
                caption: L(
                  'The green stretch is between 1/2 and 3/4. A fraction that is between them must land on it.',
                  'Bagian hijau berada di antara 1/2 dan 3/4. Pecahan yang berada di antara keduanya harus jatuh di bagian itu.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Choose All That Apply', 'Contoh Bertahap: Pilih Semua yang Benar'),
              body: L(
                `Choose all the lengths that are equal to 2.5 m. The options are 250 cm, 25 cm, 25 dm, 0.25 km and 2,500 mm.\n\n1. Step 1: read the instruction. "Choose all" means more than one option is correct. You must tick every correct option and no wrong one.\n2. Step 2: choose one unit to compare in. Let us use centimeters, $2.5\\text{ m} = 250\\text{ cm}$.\n3. Step 3: check the options one by one, and write a tick or a cross next to each, as in the table.\n4. Step 4: count the ticks. There are three, so tick exactly those three options.\n\n| Option | In centimeters | Equal to 2.5 m? |\n| --- | --- | --- |\n| 250 cm | 250 cm | yes |\n| 25 cm | 25 cm | no |\n| 25 dm | 250 cm | yes |\n| 0.25 km | 25,000 cm | no |\n| 2,500 mm | 250 cm | yes |\n\n**Remember:** there is no partial credit. Do not stop at the first correct option. Check every option.`,
                `Pilih semua panjang yang sama dengan 2,5 m. Pilihannya 250 cm, 25 cm, 25 dm, 0,25 km, dan 2.500 mm.\n\n1. Langkah 1: baca perintahnya. "Pilih semua" berarti pilihan yang benar lebih dari satu. Kamu harus memilih setiap pilihan yang benar dan tidak ada yang salah.\n2. Langkah 2: pilih satu satuan untuk membandingkan. Mari pakai sentimeter, $2{,}5\\text{ m} = 250\\text{ cm}$.\n3. Langkah 3: periksa pilihan satu per satu, dan tulis tanda centang atau silang di sebelah masing-masing, seperti pada tabel.\n4. Langkah 4: hitung centangnya. Ada tiga, jadi pilih tepat ketiga pilihan itu.\n\n| Pilihan | Dalam sentimeter | Sama dengan 2,5 m? |\n| --- | --- | --- |\n| 250 cm | 250 cm | ya |\n| 25 cm | 25 cm | tidak |\n| 25 dm | 250 cm | ya |\n| 0,25 km | 25.000 cm | tidak |\n| 2.500 mm | 250 cm | ya |\n\n**Ingat:** tidak ada nilai sebagian. Jangan berhenti pada pilihan benar yang pertama. Periksa setiap pilihan.`,
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Reading Traps', 'Awas, Jebakan!: Jebakan Saat Membaca'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| Tick the first correct option and stop. | Check every option. A choose-all item needs all the correct options. |\n| Skip the word NOT and pick a true statement. | Circle words like NOT, only, most and least. They turn the question around. |\n| Compare 250 cm with 2.5 m by looking at the numbers. | Change to the same unit first, then compare. |\n| Tick three options when the question says choose two. | Tick exactly as many options as the question asks for. |`,
                `| Salah | Benar |\n| --- | --- |\n| Memilih pilihan benar yang pertama lalu berhenti. | Periksa setiap pilihan. Soal pilih semua memerlukan semua pilihan yang benar. |\n| Melewatkan kata BUKAN dan memilih pernyataan yang benar. | Lingkari kata seperti BUKAN, hanya, paling besar, dan paling kecil. Kata-kata itu membalik pertanyaan. |\n| Membandingkan 250 cm dengan 2,5 m hanya dari angkanya. | Ubah ke satuan yang sama dulu, lalu bandingkan. |\n| Memilih tiga pilihan padahal soal meminta dua. | Pilih tepat sebanyak yang diminta soal. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('Which of these is NOT a factor of 36?', 'Manakah di antara berikut yang BUKAN faktor dari 36?'),
              options: [
                L('8', '8'),
                L('4', '4'),
                L('9', '9'),
                L('12', '12'),
              ],
              answer: 0,
              explain: L(
                'The word NOT turns the question around. $36 \\div 4 = 9$, $36 \\div 9 = 4$ and $36 \\div 12 = 3$ leave nothing over, so they are factors. $36 \\div 8$ leaves 4, so 8 is not a factor.',
                'Kata BUKAN membalik pertanyaan. $36 \\div 4 = 9$, $36 \\div 9 = 4$, dan $36 \\div 12 = 3$ habis dibagi, jadi semuanya faktor. $36 \\div 8$ bersisa 4, jadi 8 bukan faktor.',
              ),
              hint: L(
                'Test every option: does it divide 36 exactly? You are looking for the one that does NOT.',
                'Uji setiap pilihan: apakah ia membagi habis 36? Kamu mencari yang TIDAK membagi habis.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: which fraction is between $\\frac{1}{2}$ and $\\frac{3}{4}$? First write both as eighths.',
                'Coba bersama: pecahan mana yang berada di antara $\\frac{1}{2}$ dan $\\frac{3}{4}$? Pertama tulis keduanya dalam perdelapan.',
              ),
              template: '\\frac{1}{2} = \\frac{___}{8} \\qquad \\frac{3}{4} = \\frac{___}{8}',
              blanks: ['4', '6'],
              explain: L(
                '$\\frac{1}{2} = \\frac{4}{8}$ and $\\frac{3}{4} = \\frac{6}{8}$. The only whole number between 4 and 6 is 5, so the fraction between them is $\\frac{5}{8}$.',
                '$\\frac{1}{2} = \\frac{4}{8}$ dan $\\frac{3}{4} = \\frac{6}{8}$. Satu-satunya bilangan cacah di antara 4 dan 6 adalah 5, jadi pecahan di antara keduanya adalah $\\frac{5}{8}$.',
              ),
              hint: L(
                'Multiply the top and the bottom of each fraction by the same number, so that the bottom becomes 8.',
                'Kalikan pembilang dan penyebut tiap pecahan dengan bilangan yang sama, sehingga penyebutnya menjadi 8.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L('What is the area of this right triangle?', 'Berapa luas segitiga siku-siku ini?'),
              figure: {
                ...shape({ pts: [[0, 0], [10, 0], [0, 6]], sides: ['10 cm', undefined, '6 cm'], rights: [0] }),
                caption: L('A right triangle. The two sides next to the right angle are 10 cm and 6 cm.', 'Sebuah segitiga siku-siku. Dua sisi di samping sudut siku-siku adalah 10 cm dan 6 cm.'),
              },
              options: [
                L('$30\\text{ cm}^2$', '$30\\text{ cm}^2$'),
                L('$60\\text{ cm}^2$', '$60\\text{ cm}^2$'),
                L('$16\\text{ cm}^2$', '$16\\text{ cm}^2$'),
                L('$30\\text{ cm}$', '$30\\text{ cm}$'),
              ],
              answer: 0,
              explain: L(
                'Area of a triangle = ½ × base × height = ½ × 10 × 6 = 30 cm². 60 forgets the ½, 16 adds the sides, and 30 cm has the unit of a length, but an area is in square centimeters.',
                'Luas segitiga = ½ × alas × tinggi = ½ × 10 × 6 = 30 cm². 60 lupa ½, 16 menjumlahkan sisinya, dan 30 cm memakai satuan panjang, padahal luas dalam sentimeter persegi.',
              ),
              hint: L(
                'Which formula gives the area of a triangle? Also look at the unit in each option: an area is in square units.',
                'Rumus mana yang memberi luas segitiga? Lihat juga satuan pada tiap pilihan: luas memakai satuan persegi.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'In the pictogram each square stands for 4 books. How many books did the four children read altogether?',
                'Pada piktogram, setiap kotak menyatakan 4 buku. Berapa buku yang dibaca keempat anak seluruhnya?',
              ),
              figure: {
                ...pictogram({
                  rows: [
                    { label: 'Ani', count: 3, color: 'a' },
                    { label: 'Budi', count: 2, color: 'b' },
                    { label: 'Citra', count: 4, color: 'c' },
                    { label: 'Dewi', count: 2.5, color: 'result' },
                  ],
                  key: '■ = 4',
                }),
                caption: L('Books read. Each square is 4 books and a half square is 2 books.', 'Buku yang dibaca. Setiap kotak adalah 4 buku dan setengah kotak adalah 2 buku.'),
              },
              options: [
                L('46', '46'),
                L('11.5', '11,5'),
                L('48', '48'),
                L('16', '16'),
              ],
              answer: 0,
              explain: L(
                'There are $3 + 2 + 4 + 2.5 = 11.5$ squares, and $11.5 \\times 4 = 46$ books. 11.5 forgets the key, 48 counts the half square as a whole one, and 16 is only the biggest row.',
                'Ada $3 + 2 + 4 + 2{,}5 = 11{,}5$ kotak, dan $11{,}5 \\times 4 = 46$ buku. 11,5 lupa kuncinya, 48 menghitung setengah kotak sebagai satu kotak utuh, dan 16 hanya baris terbanyak.',
              ),
              hint: L(
                'Count the squares first (a half square is half). Then use the key: what is one square worth?',
                'Hitung dulu kotaknya (setengah kotak itu setengah). Lalu pakai kuncinya: satu kotak bernilai berapa?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the TWO numbers that are equal to 0.6.', 'Pilih DUA bilangan yang sama dengan 0,6.'),
              options: [
                L('60%', '60%'),
                L('$\\frac{3}{5}$', '$\\frac{3}{5}$'),
                L('6%', '6%'),
                L('0.06', '0,06'),
                L('$\\frac{1}{6}$', '$\\frac{1}{6}$'),
              ],
              answer: [0, 1],
              explain: L(
                '$0.6 = \\frac{6}{10} = \\frac{3}{5} = \\frac{60}{100} = 60\\%$. And 6% and 0.06 both mean $\\frac{6}{100}$, which is much smaller, while $\\frac{1}{6}$ is about 0.17.',
                '$0{,}6 = \\frac{6}{10} = \\frac{3}{5} = \\frac{60}{100} = 60\\%$. Sedangkan 6% dan 0,06 sama-sama berarti $\\frac{6}{100}$, yang jauh lebih kecil, dan $\\frac{1}{6}$ kira-kira 0,17.',
              ),
              hint: L(
                'Change every option to a decimal, or to a fraction with 10 or 100 at the bottom. Check all five.',
                'Ubah setiap pilihan menjadi desimal, atau pecahan dengan penyebut 10 atau 100. Periksa kelima-limanya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc2',
              prompt: L('Choose the THREE amounts of time that are equal to 2 hours 30 minutes.', 'Pilih TIGA waktu yang sama dengan 2 jam 30 menit.'),
              options: [
                L('150 minutes', '150 menit'),
                L('2.5 hours', '2,5 jam'),
                L('9,000 seconds', '9.000 detik'),
                L('2.3 hours', '2,3 jam'),
                L('230 minutes', '230 menit'),
              ],
              answer: [0, 1, 2],
              explain: L(
                '2 h 30 min = 120 + 30 = 150 minutes. 30 minutes is half an hour, so it is 2.5 hours, and $150 \\times 60 = 9\\,000$ seconds. 230 minutes and 2.3 hours copy "2" and "30" as if they were one number.',
                '2 jam 30 menit = 120 + 30 = 150 menit. 30 menit adalah setengah jam, jadi 2,5 jam, dan $150 \\times 60 = 9\\,000$ detik. 230 menit dan 2,3 jam menyalin "2" dan "30" seolah-olah satu bilangan.',
              ),
              hint: L(
                'Change everything to minutes first. Remember: 1 hour = 60 minutes and 1 minute = 60 seconds.',
                'Ubah semuanya ke menit dulu. Ingat: 1 jam = 60 menit dan 1 menit = 60 detik.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc3',
              prompt: L(
                'The box is built from unit cubes. Choose the TWO true statements.',
                'Balok ini disusun dari kubus satuan. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...cuboid3d({ l: 4, w: 3, h: 2, grid: true }),
                caption: L('A box 4 cubes long, 3 cubes wide and 2 cubes high.', 'Sebuah balok sepanjang 4 kubus, selebar 3 kubus, dan setinggi 2 kubus.'),
              },
              options: [
                L('The box holds 24 cubes.', 'Balok itu memuat 24 kubus.'),
                L('One layer has 12 cubes.', 'Satu lapisan terdiri dari 12 kubus.'),
                L('The box holds 9 cubes.', 'Balok itu memuat 9 kubus.'),
                L('The box has 3 layers.', 'Balok itu punya 3 lapisan.'),
              ],
              answer: [0, 1],
              explain: L(
                'One layer has $4 \\times 3 = 12$ cubes and there are 2 layers, so the box holds $12 \\times 2 = 24$ cubes. The number 9 comes from adding the sides ($4 + 3 + 2$), and the box has 2 layers, not 3.',
                'Satu lapisan berisi $4 \\times 3 = 12$ kubus dan ada 2 lapisan, jadi balok memuat $12 \\times 2 = 24$ kubus. Angka 9 berasal dari menjumlahkan sisinya ($4 + 3 + 2$), dan balok punya 2 lapisan, bukan 3.',
              ),
              hint: L(
                'Count the cubes in one layer first, then count the layers. Check each statement on its own.',
                'Hitung dulu kubus dalam satu lapisan, lalu hitung lapisannya. Periksa setiap pernyataan satu per satu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A cake recipe uses 250 g of flour. Ani bakes 6 cakes. How many kilograms of flour does she need?',
                'Resep sebuah kue memakai 250 g tepung. Ani membuat 6 kue. Berapa kilogram tepung yang ia perlukan?',
              ),
              blanks: [{ answer: 1.5, after: '\\text{ kg}' }],
              hints: [
                L(
                  'Underline what is asked, and in which unit the answer must be.',
                  'Garis bawahi yang ditanyakan, dan dalam satuan apa jawabannya.',
                ),
                L(
                  'First find the flour for 6 cakes in grams.',
                  'Pertama cari tepung untuk 6 kue dalam gram.',
                ),
                L(
                  'Work out $6 \\times 250$ in grams. Then change grams to kilograms: divide by 1,000.',
                  'Hitung $6 \\times 250$ dalam gram. Lalu ubah gram ke kilogram: bagi dengan 1.000.',
                ),
              ],
              explain: L(
                '6 cakes need $6 \\times 250 = 1\\,500$ g. Since 1 kg = 1,000 g, that is 1.5 kg. A quick check: 6 cakes is about 6 × 250 g, a bit more than a kilogram.',
                '6 kue memerlukan $6 \\times 250 = 1\\,500$ g. Karena 1 kg = 1.000 g, itu 1,5 kg. Pemeriksaan cepat: 6 kue sekitar 6 × 250 g, sedikit lebih dari satu kilogram.',
              ),
              solution: {
                en: ['6 \\times 250 = 1\\,500 \\text{ g}', '1\\,500 \\text{ g} = 1.5 \\text{ kg}'],
                id: ['6 \\times 250 = 1\\,500 \\text{ g}', '1\\,500 \\text{ g} = 1{,}5 \\text{ kg}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m11-s2-l2',
          title: L('True/False Statements and Managing Your Time', 'Pernyataan Benar/Salah dan Mengatur Waktu'),
          goal: L(
            'You can judge each statement on its own and plan your time during the test.',
            'Kamu bisa menilai setiap pernyataan satu per satu dan merencanakan waktumu selama tes.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: True or False, One by One', 'Ayo Amati: Benar atau Salah, Satu per Satu'),
              body: L(
                `Here is a True/False item about the rectangle in the picture. Each statement is a small question of its own.\n\n| Statement | True or False? |\n| --- | --- |\n| The perimeter is 26 cm. | True |\n| The area is 40 cm². | True |\n| The area is 26 cm². | False |\n| The perimeter is 40 cm. | False |\n\nHere two statements are True and two are False, but that is only this example. In a real item, all of them can be True, or all can be False. **Judge every statement on its own** and never guess a pattern.`,
                `Ini soal Benar/Salah tentang persegi panjang pada gambar. Setiap pernyataan adalah pertanyaan kecil tersendiri.\n\n| Pernyataan | Benar atau Salah? |\n| --- | --- |\n| Kelilingnya 26 cm. | Benar |\n| Luasnya 40 cm². | Benar |\n| Luasnya 26 cm². | Salah |\n| Kelilingnya 40 cm. | Salah |\n\nDi sini dua pernyataan Benar dan dua Salah, tetapi itu hanya contoh ini. Pada soal sebenarnya, semuanya bisa Benar, atau semuanya bisa Salah. **Nilai setiap pernyataan satu per satu** dan jangan menebak pola.`,
              ),
              figure: {
                ...shape({ pts: rectPts(0, 0, 8, 5), sides: ['8 cm', '5 cm'], rights: [0, 1, 2, 3] }),
                caption: L('A rectangle 8 cm long and 5 cm wide.', 'Sebuah persegi panjang sepanjang 8 cm dan selebar 5 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Judging One Statement', 'Contoh Bertahap: Menilai Satu Pernyataan'),
              body: L(
                `Look at one statement at a time. Here is a statement: "$\\frac{3}{4}$ is greater than 0.8".\n\n1. Step 1: read the statement slowly and find the claim. Is $\\frac{3}{4}$ greater than 0.8?\n2. Step 2: write both numbers in the same form. $\\frac{3}{4} = 0.75$.\n3. Step 3: compare. 0.75 is smaller than 0.8, so the claim is wrong. The answer is False.\n4. Step 4: mark it and move on to the next statement. Do not let this answer decide the next one.\n\n**Remember:** here are four statements judged in this way.\n\n| Statement | Check | Answer |\n| --- | --- | --- |\n| $\\frac{3}{4} = 0.75$ | $3 \\div 4 = 0.75$ | True |\n| $\\frac{3}{4}$ is greater than 0.8 | $0.75 < 0.8$ | False |\n| $\\frac{1}{5} = 20\\%$ | $\\frac{20}{100} = \\frac{1}{5}$ | True |\n| $\\frac{2}{5} = 0.25$ | $\\frac{2}{5} = 0.4$ | False |`,
                `Lihat satu pernyataan pada satu waktu. Ini sebuah pernyataan: "$\\frac{3}{4}$ lebih besar daripada 0,8".\n\n1. Langkah 1: baca pernyataan pelan-pelan dan cari klaimnya. Apakah $\\frac{3}{4}$ lebih besar daripada 0,8?\n2. Langkah 2: tulis kedua bilangan dalam bentuk yang sama. $\\frac{3}{4} = 0{,}75$.\n3. Langkah 3: bandingkan. 0,75 lebih kecil daripada 0,8, jadi klaimnya salah. Jawabannya Salah.\n4. Langkah 4: tandai dan lanjut ke pernyataan berikutnya. Jangan biarkan jawaban ini menentukan jawaban berikutnya.\n\n**Ingat:** ini empat pernyataan yang dinilai dengan cara itu.\n\n| Pernyataan | Pemeriksaan | Jawaban |\n| --- | --- | --- |\n| $\\frac{3}{4} = 0{,}75$ | $3 \\div 4 = 0{,}75$ | Benar |\n| $\\frac{3}{4}$ lebih besar daripada 0,8 | $0{,}75 < 0{,}8$ | Salah |\n| $\\frac{1}{5} = 20\\%$ | $\\frac{20}{100} = \\frac{1}{5}$ | Benar |\n| $\\frac{2}{5} = 0{,}25$ | $\\frac{2}{5} = 0{,}4$ | Salah |`,
              ),
              figure: {
                ...fractionBars([
                  { parts: 4, shaded: 3, label: '3/4' },
                  { parts: 5, shaded: 4, label: '4/5' },
                ]),
                caption: L(
                  '3/4 is a little shorter than 4/5, and 4/5 is 0.8.',
                  '3/4 sedikit lebih pendek daripada 4/5, dan 4/5 adalah 0,8.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Planning Your Time', 'Contoh Bertahap: Merencanakan Waktu'),
              body: L(
                `The TKA Mathematics test has 30 items in 75 minutes. That is $75 \\div 30 = 2.5$ minutes for each item, but you also need time to check. Let us make a time plan.\n\n1. Step 1: count. There are 30 items and 75 minutes.\n2. Step 2: keep 15 minutes at the end for checking and for the items you skipped. $75 - 15 = 60$ minutes to answer.\n3. Step 3: time for each item, $60 \\div 30 = 2$ minutes. So aim for about 2 minutes per item.\n4. Step 4: make a check-point. After 30 minutes you should be at about item 15 ($30 \\div 2$).\n5. Step 5: if one item takes more than about 3 minutes, mark it, skip it and come back later.\n\n**Remember:**\n\n- Round 1: answer the items you can do quickly.\n- Round 2: go back to the items you skipped.\n- Last minutes: check your answers and make sure no item is empty.`,
                `Tes TKA Matematika terdiri dari 30 soal dalam 75 menit. Itu $75 \\div 30 = 2{,}5$ menit untuk tiap soal, tetapi kamu juga memerlukan waktu untuk memeriksa. Mari kita buat rencana waktu.\n\n1. Langkah 1: hitung. Ada 30 soal dan 75 menit.\n2. Langkah 2: sisakan 15 menit di akhir untuk memeriksa dan untuk soal yang kamu lewati. $75 - 15 = 60$ menit untuk menjawab.\n3. Langkah 3: waktu tiap soal, $60 \\div 30 = 2$ menit. Jadi usahakan sekitar 2 menit per soal.\n4. Langkah 4: buat titik periksa. Setelah 30 menit kamu seharusnya sudah di soal nomor 15 ($30 \\div 2$).\n5. Langkah 5: kalau satu soal memakan lebih dari sekitar 3 menit, tandai, lewati, dan kembali lagi nanti.\n\n**Ingat:**\n\n- Putaran 1: jawab soal yang bisa kamu kerjakan dengan cepat.\n- Putaran 2: kembali ke soal yang kamu lewati.\n- Menit terakhir: periksa jawabanmu dan pastikan tidak ada soal yang kosong.`,
              ),
              figure: {
                ...numberLine({ from: 0, to: 75, step: 5, labelEvery: 3, shade: [0, 60], marks: [{ at: 30, color: 'b' }, { at: 60, color: 'result' }] }),
                caption: L(
                  'The 75 minutes. The green part (60 minutes) is for answering. The orange dot at minute 30 is the check-point, and the last 15 minutes are for checking.',
                  'Waktu 75 menit. Bagian hijau (60 menit) untuk menjawab. Titik oranye di menit ke-30 adalah titik periksa, dan 15 menit terakhir untuk memeriksa.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Time and Nerves', 'Awas, Jebakan!: Waktu dan Rasa Gugup'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| Stay 10 minutes on one hard item. | Mark it, skip it and come back. Every item is worth the same. |\n| Leave an item empty because you are not sure. | Always choose your best answer before time is up. |\n| "The last two statements were True, so this one must be False." | Every statement is separate. There is no pattern to follow. |\n\nCalm-test habits:\n\n- Breathe slowly before you start, and again when you feel stuck.\n- Read each question twice and circle words like NOT and only.\n- Do not watch how fast other children finish.`,
                `| Salah | Benar |\n| --- | --- |\n| Bertahan 10 menit pada satu soal sulit. | Tandai, lewati, dan kembali lagi. Setiap soal nilainya sama. |\n| Mengosongkan soal karena tidak yakin. | Selalu pilih jawaban terbaikmu sebelum waktu habis. |\n| "Dua pernyataan terakhir Benar, jadi yang ini pasti Salah." | Setiap pernyataan terpisah. Tidak ada pola yang bisa diikuti. |\n\nKebiasaan tenang saat tes:\n\n- Tarik napas pelan-pelan sebelum mulai, dan lagi saat kamu merasa buntu.\n- Baca setiap soal dua kali dan lingkari kata seperti BUKAN dan hanya.\n- Jangan memperhatikan seberapa cepat anak lain selesai.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The test has 30 items and 75 minutes, so your plan is about 2 minutes per item. After 30 minutes you are only at item 10. What is the best next move?',
                'Tes ini terdiri dari 30 soal dan 75 menit, jadi rencanamu sekitar 2 menit per soal. Setelah 30 menit kamu baru sampai soal ke-10. Apa langkah terbaik berikutnya?',
              ),
              figure: {
                ...numberLine({ from: 0, to: 75, step: 15, marks: [{ at: 30, color: 'result' }, { at: 75, color: 'b' }] }),
                caption: L(
                  'The 75 minutes of the test. The red dot is the 30 minutes that have already passed; the orange dot is the end of the test.',
                  'Waktu tes 75 menit. Titik merah adalah 30 menit yang sudah berlalu; titik oranye adalah akhir tes.',
                ),
              },
              options: [
                L('Speed up a little, and skip any item that takes more than about 3 minutes to come back to later.', 'Bekerja sedikit lebih cepat, dan lewati soal yang memakan lebih dari sekitar 3 menit untuk dikerjakan nanti.'),
                L('Spend 10 more minutes on the item you are stuck on.', 'Menghabiskan 10 menit lagi untuk soal yang membuatmu buntu.'),
                L('Choose the same answer for all the items that are left.', 'Memilih jawaban yang sama untuk semua soal yang tersisa.'),
                L('Leave the remaining items empty.', 'Mengosongkan soal-soal yang tersisa.'),
              ],
              answer: 0,
              explain: L(
                'You are behind your plan, so you need to move faster without giving up. Skipping items that take too long and returning later gets the quick points first. Spending more time on one item or leaving items empty throws points away.',
                'Kamu tertinggal dari rencana, jadi perlu bekerja lebih cepat tanpa menyerah. Melewati soal yang terlalu lama dan kembali nanti mengamankan nilai dari soal yang cepat dahulu. Menghabiskan waktu pada satu soal atau mengosongkan soal membuang nilai.',
              ),
              hint: L(
                'Think about the plan: about 2 minutes per item. Which option keeps you moving and still tries every item?',
                'Pikirkan rencananya: sekitar 2 menit per soal. Pilihan mana yang membuatmu terus maju dan tetap mencoba setiap soal?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a test has 30 items and 75 minutes. Keep 15 minutes for checking. How many minutes can you use for each item?',
                'Coba bersama: sebuah tes terdiri dari 30 soal dan 75 menit. Sisakan 15 menit untuk memeriksa. Berapa menit yang bisa kamu pakai untuk tiap soal?',
              ),
              template: '75 - 15 = ___ \\qquad 60 \\div 30 = ___',
              blanks: ['60', '2'],
              explain: L(
                'You have $75 - 15 = 60$ minutes to answer, so each item gets $60 \\div 30 = 2$ minutes.',
                'Kamu punya $75 - 15 = 60$ menit untuk menjawab, jadi tiap soal mendapat $60 \\div 30 = 2$ menit.',
              ),
              hint: L(
                'First take the checking time away from the 75 minutes. Then share what is left between the items.',
                'Pertama kurangi 75 menit dengan waktu memeriksa. Lalu bagi sisanya untuk semua soal.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\frac{5}{8}$ is greater than 0.6.', '$\\frac{5}{8}$ lebih besar daripada 0,6.'),
                L('25% of 80 is 25.', '25% dari 80 adalah 25.'),
                L('The LCM (KPK) of 6 and 10 is 30.', 'KPK dari 6 dan 10 adalah 30.'),
                L('The GCF (FPB) of 12 and 18 is 36.', 'FPB dari 12 dan 18 adalah 36.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$\\frac{5}{8} = 0.625$, which is more than 0.6. 25% of 80 is $80 \\div 4 = 20$. The smallest number in both lists of multiples of 6 and 10 is 30. 36 is the product, but the GCF of 12 and 18 is 6.',
                '$\\frac{5}{8} = 0{,}625$, yang lebih dari 0,6. 25% dari 80 adalah $80 \\div 4 = 20$. Bilangan terkecil yang ada di kedua daftar kelipatan 6 dan 10 adalah 30. 36 adalah hasil kalinya, tetapi FPB dari 12 dan 18 adalah 6.',
              ),
              hint: L(
                'Judge each statement alone. Change fractions to decimals, and for the LCM and GCF write lists.',
                'Nilai tiap pernyataan sendiri-sendiri. Ubah pecahan ke desimal, dan untuk KPK dan FPB tulis daftarnya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j2',
              prompt: L('Look at the picture and decide whether each statement is True or False.', 'Lihat gambar dan tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...shape({ pts: [[0, 0], [11, 0], [8, 4], [0, 4]], sides: ['11', '5', '8', '4'], rights: [0, 3] }),
                caption: L('A flat shape. The sides are in cm.', 'Sebuah bangun datar. Panjang sisinya dalam cm.'),
              },
              statements: [
                L('The area is $76\\text{ cm}^2$.', 'Luasnya $76\\text{ cm}^2$.'),
                L('The perimeter is 28 cm.', 'Kelilingnya 28 cm.'),
                L('The area is $38\\text{ cm}^2$.', 'Luasnya $38\\text{ cm}^2$.'),
                L('The shape has exactly one pair of parallel sides.', 'Bangun itu punya tepat satu pasang sisi sejajar.'),
              ],
              answer: [false, true, true, true],
              explain: L(
                'It is a trapezoid. Its area is ½ × (11 + 8) × 4 = 38 cm², and 76 forgets the ½. Its perimeter is $11 + 5 + 8 + 4 = 28$ cm. Only the top and the bottom are parallel.',
                'Bangun itu trapesium. Luasnya ½ × (11 + 8) × 4 = 38 cm², dan 76 lupa ½. Kelilingnya $11 + 5 + 8 + 4 = 28$ cm. Hanya sisi atas dan sisi bawah yang sejajar.',
              ),
              hint: L(
                'For the area, use ½ × (top + bottom) × height. For the perimeter, add all four sides. Check the units.',
                'Untuk luas, pakai ½ × (atas + bawah) × tinggi. Untuk keliling, jumlahkan keempat sisi. Periksa satuannya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j3',
              prompt: L(
                'The bar chart shows the test scores of five children. Decide whether each statement is True or False.',
                'Diagram batang menunjukkan nilai tes lima anak. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 70, color: 'a' },
                    { label: 'Budi', value: 80, color: 'b' },
                    { label: 'Citra', value: 90, color: 'c' },
                    { label: 'Dewi', value: 80, color: 'result' },
                    { label: 'Eko', value: 100, color: 'a' },
                  ],
                  max: 100,
                  step: 20,
                }),
                caption: L('Test scores.', 'Nilai tes.'),
              },
              statements: [
                L('The five scores add up to 420.', 'Kelima nilai itu berjumlah 420.'),
                L('Budi and Dewi have the same score.', 'Budi dan Dewi mendapat nilai yang sama.'),
                L('The highest score is 40 more than the lowest score.', 'Nilai tertinggi 40 lebih besar daripada nilai terendah.'),
                L('Ani\'s score is half of Eko\'s score.', 'Nilai Ani setengah dari nilai Eko.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'The scores are 70, 80, 90, 80 and 100, and $70 + 80 + 90 + 80 + 100 = 420$. Budi and Dewi both have 80. The highest minus the lowest is $100 - 70 = 30$, not 40. Half of Eko\'s 100 is 50, but Ani has 70.',
                'Nilainya 70, 80, 90, 80, dan 100, dan $70 + 80 + 90 + 80 + 100 = 420$. Budi dan Dewi sama-sama 80. Nilai tertinggi dikurangi terendah adalah $100 - 70 = 30$, bukan 40. Setengah dari 100 milik Eko adalah 50, padahal nilai Ani 70.',
              ),
              hint: L(
                'Read the value of all five bars first. Then test each statement with those numbers.',
                'Baca dulu nilai kelima batang. Lalu uji tiap pernyataan dengan angka-angka itu.',
              ),
            },
            {
              kind: 'judge',
              id: 'j4',
              prompt: L('Decide whether each statement is True or False. Careful with the units!', 'Tentukan tiap pernyataan Benar atau Salah. Hati-hati dengan satuannya!'),
              statements: [
                L('A car driving at 60 km/h travels 150 km in 2 hours.', 'Mobil yang melaju 60 km/jam menempuh 150 km dalam 2 jam.'),
                L('$2.5\\text{ kg}$ is equal to 250 g.', '$2{,}5\\text{ kg}$ sama dengan 250 g.'),
                L('$\\frac{3}{4}$ of an hour is 40 minutes.', '$\\frac{3}{4}$ jam adalah 40 menit.'),
                L('A cube with edges of 3 cm has a volume of $9\\text{ cm}^3$.', 'Kubus dengan rusuk 3 cm punya volume $9\\text{ cm}^3$.'),
              ],
              answer: [false, false, false, false],
              explain: L(
                'All four are False. In 2 hours the car travels $60 \\times 2 = 120$ km. $2.5\\text{ kg} = 2\\,500$ g. $\\frac{3}{4}$ of 60 minutes is 45 minutes. The volume is $3 \\times 3 \\times 3 = 27\\text{ cm}^3$. It is allowed for every statement to be False!',
                'Keempatnya Salah. Dalam 2 jam mobil menempuh $60 \\times 2 = 120$ km. $2{,}5\\text{ kg} = 2\\,500$ g. $\\frac{3}{4}$ dari 60 menit adalah 45 menit. Volumenya $3 \\times 3 \\times 3 = 27\\text{ cm}^3$. Boleh saja semua pernyataan Salah!',
              ),
              hint: L(
                'Work each one out separately: distance = speed × time, change kg to g, take $\\frac{3}{4}$ of 60 minutes, and multiply three edges.',
                'Hitung satu per satu: jarak = kecepatan × waktu, ubah kg ke g, ambil $\\frac{3}{4}$ dari 60 menit, dan kalikan tiga rusuk.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A test has 30 items in 75 minutes. Dewi keeps 15 minutes for checking. She spends 24 minutes on the first 12 items. If she spends the same time on each of the other items, how many minutes can she spend on each one?',
                'Sebuah tes terdiri dari 30 soal dalam 75 menit. Dewi menyisakan 15 menit untuk memeriksa. Ia menghabiskan 24 menit untuk 12 soal pertama. Jika ia memakai waktu yang sama untuk tiap soal yang lain, berapa menit yang bisa ia pakai untuk setiap soal?',
              ),
              blanks: [{ answer: 2, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
              hints: [
                L(
                  'Underline what is asked. How many items are left after the first 12?',
                  'Garis bawahi yang ditanyakan. Berapa soal yang tersisa setelah 12 soal pertama?',
                ),
                L(
                  'Find the minutes she may still use for answering: take the checking time and the 24 minutes away from 75.',
                  'Cari menit yang masih boleh dipakai untuk menjawab: kurangi 75 dengan waktu memeriksa dan 24 menit.',
                ),
                L(
                  'There are $30 - 12 = 18$ items left and $75 - 15 - 24 = 36$ minutes. Now share the minutes between the items.',
                  'Tersisa $30 - 12 = 18$ soal dan $75 - 15 - 24 = 36$ menit. Sekarang bagi menitnya untuk semua soal.',
                ),
              ],
              explain: L(
                '18 items are left and 36 minutes remain for answering, so each item gets $36 \\div 18 = 2$ minutes, the same as the plan.',
                'Tersisa 18 soal dan 36 menit untuk menjawab, jadi tiap soal mendapat $36 \\div 18 = 2$ menit, sama dengan rencananya.',
              ),
              solution: {
                en: [
                  '30 - 12 = 18 \\text{ items}',
                  '75 - 15 - 24 = 36 \\text{ min}',
                  '36 \\div 18 = 2 \\text{ min}',
                ],
                id: [
                  '30 - 12 = 18 \\text{ soal}',
                  '75 - 15 - 24 = 36 \\text{ menit}',
                  '36 \\div 18 = 2 \\text{ menit}',
                ],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m11-s2-p',
        runtime: 'math',
        title: L('Project: Test Like a Pro', 'Proyek: Mengerjakan Tes Seperti Ahli'),
        brief: L(
          'Four questions about the tricks of the test: choose-all items, True/False statements and managing time.',
          'Empat soal tentang trik tes: soal pilih semua, pernyataan Benar/Salah, dan mengatur waktu.',
        ),
        requirements: [
          L('Check every option or statement on its own.', 'Memeriksa setiap pilihan atau pernyataan satu per satu.'),
          L('Plan your time and reason about conditions.', 'Merencanakan waktu dan bernalar tentang syarat-syarat.'),
        ],
        tasks: [
          {
            prompt: L(
              'A choose-all item says: "Choose all the multiples of 6." The options are 12, 16, 18, 21, 30 and 35. How many options must you tick?',
              'Sebuah soal pilih semua berbunyi: "Pilih semua kelipatan 6." Pilihannya 12, 16, 18, 21, 30, dan 35. Berapa pilihan yang harus kamu centang?',
            ),
            blanks: [{ answer: 3, after: { en: '\\text{ options}', id: '\\text{ pilihan}' } }],
            solution: {
              en: ['12 = 2 \\times 6,\\ 18 = 3 \\times 6,\\ 30 = 5 \\times 6', '16, 21, 35 \\text{ are not}', '\\rightarrow 3'],
              id: ['12 = 2 \\times 6,\\ 18 = 3 \\times 6,\\ 30 = 5 \\times 6', '16, 21, 35 \\text{ bukan}', '\\rightarrow 3'],
            },
          },
          {
            prompt: L(
              'How many of these four statements are True? (1) 0.5 = 50%. (2) $\\frac{3}{4}$ of 20 is 15. (3) The LCM (KPK) of 6 and 9 is 18. (4) 2 hours = 100 minutes.',
              'Berapa dari empat pernyataan ini yang Benar? (1) 0,5 = 50%. (2) $\\frac{3}{4}$ dari 20 adalah 15. (3) KPK dari 6 dan 9 adalah 18. (4) 2 jam = 100 menit.',
            ),
            blanks: [{ answer: 3, after: { en: '\\text{ statements}', id: '\\text{ pernyataan}' } }],
            solution: {
              en: [
                '(1)\\ \\frac{50}{100} = 0.5 \\rightarrow \\text{true}',
                '(2)\\ 20 \\div 4 \\times 3 = 15 \\rightarrow \\text{true}',
                '(3)\\ 6, 12, 18 \\text{ and } 9, 18 \\rightarrow 18 \\text{, true}',
                '(4)\\ 2 \\times 60 = 120 \\neq 100 \\rightarrow \\text{false}',
                '3 \\text{ true}',
              ],
              id: [
                '(1)\\ \\frac{50}{100} = 0{,}5 \\rightarrow \\text{benar}',
                '(2)\\ 20 \\div 4 \\times 3 = 15 \\rightarrow \\text{benar}',
                '(3)\\ 6, 12, 18 \\text{ dan } 9, 18 \\rightarrow 18 \\text{, benar}',
                '(4)\\ 2 \\times 60 = 120 \\neq 100 \\rightarrow \\text{salah}',
                '3 \\text{ benar}',
              ],
            },
          },
          {
            prompt: L(
              'A test has 30 items in 75 minutes. Budi keeps 15 minutes for checking. He answers the first 24 items in 42 minutes. How many minutes can he spend on each of the last 6 items, if he spends the same time on each?',
              'Sebuah tes terdiri dari 30 soal dalam 75 menit. Budi menyisakan 15 menit untuk memeriksa. Ia menjawab 24 soal pertama dalam 42 menit. Berapa menit yang bisa ia pakai untuk tiap dari 6 soal terakhir, jika waktunya sama untuk tiap soal?',
            ),
            blanks: [{ answer: 3, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
            solution: {
              en: ['75 - 15 - 42 = 18 \\text{ min}', '30 - 24 = 6 \\text{ items left}', '18 \\div 6 = 3 \\text{ min}'],
              id: ['75 - 15 - 42 = 18 \\text{ menit}', '30 - 24 = 6 \\text{ soal tersisa}', '18 \\div 6 = 3 \\text{ menit}'],
            },
          },
          {
            prompt: L(
              'I am a whole number between 10 and 30. I am a multiple of 4, and I am also a factor of 48. Several numbers fit this description. What is the sum of all of them?',
              'Aku bilangan cacah di antara 10 dan 30. Aku kelipatan 4, dan aku juga faktor dari 48. Ada beberapa bilangan yang cocok. Berapa jumlah semuanya?',
            ),
            blanks: [{ answer: 52 }],
            solution: {
              en: [
                '\\text{Factors of } 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48',
                '\\text{Multiples of 4 between 10 and 30: } 12, 16, 24',
                '12 + 16 + 24 = 52',
              ],
              id: [
                '\\text{Faktor dari } 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48',
                '\\text{Kelipatan 4 di antara 10 dan 30: } 12, 16, 24',
                '12 + 16 + 24 = 52',
              ],
            },
          },
        ],
        hints: [
          L(
            'In a choose-all item, check every option separately. For multiples of 6, divide each option by 6.',
            'Pada soal pilih semua, periksa setiap pilihan satu per satu. Untuk kelipatan 6, bagi setiap pilihan dengan 6.',
          ),
          L(
            'For the time task, first find the minutes that are left for the last items. Then share them.',
            'Untuk soal waktu, pertama cari menit yang tersisa untuk soal-soal terakhir. Lalu bagikan.',
          ),
          L(
            'For the last task, list the factors of 48 first and cross out every number that does not fit the other conditions.',
            'Untuk soal terakhir, tulis dulu faktor dari 48 dan coret setiap bilangan yang tidak cocok dengan syarat lainnya.',
          ),
        ],
        xp: 50,
      },
    },

    /* ======================================================================== S3: practice tests */
    {
      id: 'tka-m11-s3',
      title: L('Practice Tests', 'Simulasi TKA'),
      summary: L(
        'Two practice tests in the style of the TKA, with questions from numbers, geometry and measurement, and data, and a final try-out of typed answers.',
        'Dua simulasi bergaya TKA, dengan soal dari bilangan, geometri dan pengukuran, serta data, dan satu try-out akhir dengan jawaban ketikan.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- Test 1 */
        {
          id: 'tka-m11-s3-l1',
          title: L('Practice Test 1', 'Simulasi TKA 1'),
          goal: L(
            'You can finish a short practice test with a mix of question types, level by level, from easy to hard.',
            'Kamu bisa menyelesaikan simulasi singkat dengan berbagai bentuk soal, tingkat demi tingkat, dari yang mudah sampai yang sulit.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Practice Test 1 Works', 'Ayo Amati: Cara Kerja Simulasi TKA 1'),
              body: L(
                `This practice test has 12 questions, like a small TKA. Plan about 2 minutes for each question, which is about 24 minutes in all. Use a timer if you can.\n\n- The questions go from easy to hard, and the last two are the hardest.\n- You will meet one-answer questions, choose-all questions, True/False tables and typed answers.\n- Choose-all and True/False questions need every part right, with no partial credit.\n\nA hint appears when an answer is wrong, and an explanation appears when it is right. Use the four steps, check your answers and stay calm. Good luck!`,
                `Simulasi ini terdiri dari 12 soal, seperti TKA kecil. Rencanakan sekitar 2 menit untuk tiap soal, jadi sekitar 24 menit seluruhnya. Pakai pengatur waktu kalau bisa.\n\n- Soal-soal berjalan dari mudah ke sulit, dan dua soal terakhir paling sulit.\n- Kamu akan bertemu soal satu jawaban, soal pilih semua, tabel Benar/Salah, dan jawaban ketikan.\n- Soal pilih semua dan Benar/Salah memerlukan setiap bagian benar, tanpa nilai sebagian.\n\nPetunjuk muncul kalau jawabanmu salah, dan penjelasan muncul kalau benar. Pakai empat langkah, periksa jawabanmu, dan tetap tenang. Semoga berhasil!`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('In the number 3,482,506, what is the value of the digit 4?', 'Pada bilangan 3.482.506, berapa nilai angka 4?'),
              options: [
                L('400,000', '400.000'),
                L('4,000', '4.000'),
                L('40,000', '40.000'),
                L('4', '4'),
              ],
              answer: 0,
              explain: L(
                'The digit 4 stands in the hundred-thousands place, so its value is 400,000. 40,000 would be the next place to the right, and 4,000 the one after that.',
                'Angka 4 berada di tempat ratusan ribu, jadi nilainya 400.000. 40.000 adalah tempat berikutnya di sebelah kanan, dan 4.000 tempat sesudahnya.',
              ),
              hint: L(
                'Count the places from the right: ones, tens, hundreds, thousands... Which place is the 4 in?',
                'Hitung tempatnya dari kanan: satuan, puluhan, ratusan, ribuan... Angka 4 berada di tempat apa?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L('How many meters is 3.5 km?', 'Berapa meter 3,5 km?'),
              options: [
                L('3,500 m', '3.500 m'),
                L('350 m', '350 m'),
                L('35,000 m', '35.000 m'),
                L('35 m', '35 m'),
              ],
              answer: 0,
              explain: L(
                '1 km = 1,000 m, so $3.5 \\times 1\\,000 = 3\\,500$ m. The answer 350 m multiplies by 100 and 35,000 m by 10,000.',
                '1 km = 1.000 m, jadi $3{,}5 \\times 1\\,000 = 3\\,500$ m. Jawaban 350 m mengalikan 100 dan 35.000 m mengalikan 10.000.',
              ),
              hint: L(
                'How many meters are there in 1 km? Then multiply by 3.5.',
                'Ada berapa meter dalam 1 km? Lalu kalikan dengan 3,5.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'The bar chart shows the stickers that four children have. How many more stickers does Citra have than Dewi?',
                'Diagram batang menunjukkan stiker milik empat anak. Berapa stiker Citra lebih banyak daripada Dewi?',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 15, color: 'a' },
                    { label: 'Budi', value: 20, color: 'b' },
                    { label: 'Citra', value: 25, color: 'c' },
                    { label: 'Dewi', value: 10, color: 'result' },
                  ],
                  max: 25,
                  step: 5,
                  showValues: false,
                }),
                caption: L('Stickers of four children.', 'Stiker empat anak.'),
              },
              options: [
                L('15', '15'),
                L('35', '35'),
                L('10', '10'),
                L('25', '25'),
              ],
              answer: 0,
              explain: L(
                'Citra has 25 stickers and Dewi has 10, so Citra has $25 - 10 = 15$ more. 35 adds the two bars, and 10 and 25 are just single bars.',
                'Citra punya 25 stiker dan Dewi punya 10, jadi Citra punya $25 - 10 = 15$ lebih banyak. 35 menjumlahkan kedua batang, dan 10 serta 25 hanya satu batang.',
              ),
              hint: L(
                'Read the two bars from the scale on the left. "How many more" asks for the difference: do you add or subtract?',
                'Baca kedua batang dari skala di sebelah kiri. "Berapa lebih banyak" menanyakan selisih: kamu menjumlah atau mengurang?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('0.5 is greater than $\\frac{3}{5}$.', '0,5 lebih besar daripada $\\frac{3}{5}$.'),
                L('25% of 80 is 20.', '25% dari 80 adalah 20.'),
                L('The LCM (KPK) of 6 and 10 is 60.', 'KPK dari 6 dan 10 adalah 60.'),
                L('$\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$.', '$\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$.'),
              ],
              answer: [false, true, false, true],
              explain: L(
                '$\\frac{3}{5} = 0.6$, which is more than 0.5. 25% is a quarter, and $80 \\div 4 = 20$. The multiples of 6 and 10 first meet at 30, not 60. And $\\frac{1}{2} = \\frac{2}{4}$, so $\\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$.',
                '$\\frac{3}{5} = 0{,}6$, yang lebih besar daripada 0,5. 25% adalah seperempat, dan $80 \\div 4 = 20$. Kelipatan 6 dan 10 pertama kali bertemu di 30, bukan 60. Dan $\\frac{1}{2} = \\frac{2}{4}$, jadi $\\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$.',
              ),
              hint: L(
                'Judge each statement alone. Change $\\frac{3}{5}$ to a decimal, take a quarter of 80, list multiples, and use quarters for the sum.',
                'Nilai tiap pernyataan sendiri-sendiri. Ubah $\\frac{3}{5}$ ke desimal, ambil seperempat dari 80, tulis kelipatan, dan pakai perempatan untuk jumlahnya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q4',
              prompt: L(
                'Ani starts her homework when the clock looks like this (in the afternoon). She works for 1 hour 50 minutes. At what time does she finish?',
                'Ani mulai mengerjakan PR saat jam seperti pada gambar (sore hari). Ia mengerjakannya selama 1 jam 50 menit. Pukul berapa ia selesai?',
              ),
              figure: {
                ...clockFace({ h: 3, m: 25 }),
                caption: L('The clock when Ani starts.', 'Jam saat Ani mulai.'),
              },
              options: [
                L('5:15 p.m.', '17.15'),
                L('5:25 p.m.', '17.25'),
                L('5:35 p.m.', '17.35'),
                L('4:15 p.m.', '16.15'),
              ],
              answer: 0,
              explain: L(
                'The clock shows 3:25. Add 1 hour to get 4:25, then add 50 minutes: 25 + 50 = 75 minutes, which is 1 hour 15 minutes, so 5:15 p.m. The time 4:15 forgets the hour, and 5:25 adds a whole 2 hours.',
                'Jam menunjukkan 15.25. Tambah 1 jam menjadi 16.25, lalu tambah 50 menit: 25 + 50 = 75 menit, yaitu 1 jam 15 menit, jadi 17.15. Pukul 16.15 melupakan jamnya, dan 17.25 menambah 2 jam penuh.',
              ),
              hint: L(
                'Read the clock first. Then add the hours, then the minutes. Remember that 60 minutes make 1 hour.',
                'Baca jamnya dulu. Lalu tambahkan jamnya, kemudian menitnya. Ingat 60 menit adalah 1 jam.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A shop has 8 boxes of pencils with 24 pencils in each box. All the pencils are packed in packs of 6, and each pack is sold for Rp9,000. How much money does the shop get if every pack is sold?',
                'Sebuah toko punya 8 kotak pensil dengan 24 pensil di setiap kotak. Semua pensil dikemas dalam bungkus berisi 6 pensil, dan setiap bungkus dijual Rp9.000. Berapa uang yang diterima toko jika semua bungkus terjual?',
              ),
              blanks: [{ label: RP, answer: 288000 }],
              hints: [
                L(
                  'Underline what is asked. You need the number of packs before you can find the money.',
                  'Garis bawahi yang ditanyakan. Kamu perlu banyak bungkus sebelum bisa mencari uangnya.',
                ),
                L(
                  'First find the number of pencils in all, then the number of packs of 6.',
                  'Pertama cari banyak pensil seluruhnya, lalu banyak bungkus berisi 6.',
                ),
                L(
                  'There are $8 \\times 24$ pencils. Divide that by 6 to get the packs. Then multiply the packs by $9\\,000$.',
                  'Ada $8 \\times 24$ pensil. Bagi dengan 6 untuk mendapat banyak bungkus. Lalu kalikan banyak bungkus dengan $9\\,000$.',
                ),
              ],
              explain: L(
                '$8 \\times 24 = 192$ pencils, and $192 \\div 6 = 32$ packs. The shop gets $32 \\times 9\\,000 = 288\\,000$ rupiah.',
                '$8 \\times 24 = 192$ pensil, dan $192 \\div 6 = 32$ bungkus. Toko menerima $32 \\times 9\\,000 = 288\\,000$ rupiah.',
              ),
              solution: [
                '8 \\times 24 = 192',
                '192 \\div 6 = 32',
                '32 \\times 9\\,000 = 288\\,000',
              ],
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The picture shows a flat shape made of straight sides. The sides are in cm. Choose the TWO true statements.',
                'Gambar menunjukkan bangun datar dengan sisi-sisi lurus. Panjang sisinya dalam cm. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...shape({ pts: [[0, 0], [10, 0], [10, 5], [6, 5], [6, 8], [0, 8]], sides: ['10', '5', '4', '3', '6', '8'], rights: [0, 1, 2, 3, 4, 5] }),
                caption: L('A shape with six sides. All its corners are right angles.', 'Sebuah bangun dengan enam sisi. Semua sudutnya siku-siku.'),
              },
              options: [
                L('The perimeter is 36 cm.', 'Kelilingnya 36 cm.'),
                L('The area is $68\\text{ cm}^2$.', 'Luasnya $68\\text{ cm}^2$.'),
                L('The area is $80\\text{ cm}^2$.', 'Luasnya $80\\text{ cm}^2$.'),
                L('The perimeter is 29 cm.', 'Kelilingnya 29 cm.'),
              ],
              answer: [0, 1],
              explain: L(
                'Perimeter: $10 + 5 + 4 + 3 + 6 + 8 = 36$ cm (it is the same as the rectangle around it, $2 \\times (10 + 8)$). Area: the rectangle $10 \\times 8 = 80$ minus the missing corner $4 \\times 3 = 12$ gives 68 cm². 80 forgets the missing corner, and 29 leaves out the two sides of the notch.',
                'Keliling: $10 + 5 + 4 + 3 + 6 + 8 = 36$ cm (sama dengan persegi panjang yang mengelilinginya, $2 \\times (10 + 8)$). Luas: persegi panjang $10 \\times 8 = 80$ dikurangi sudut yang hilang $4 \\times 3 = 12$ menjadi 68 cm². 80 lupa sudut yang hilang, dan 29 melewatkan dua sisi lekukan.',
              ),
              hint: L(
                'For the perimeter add every side. For the area, think of a big rectangle with a corner cut away.',
                'Untuk keliling jumlahkan setiap sisi. Untuk luas, bayangkan persegi panjang besar yang salah satu sudutnya terpotong.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q5',
              prompt: L(
                'Two buses leave the terminal together at 06:00. Bus A leaves again every 12 minutes and bus B every 18 minutes. After how many minutes do they leave together again for the first time?',
                'Dua bus berangkat bersama dari terminal pukul 06.00. Bus A berangkat lagi setiap 12 menit dan bus B setiap 18 menit. Setelah berapa menit keduanya berangkat bersama lagi untuk pertama kalinya?',
              ),
              options: [
                L('36', '36'),
                L('6', '6'),
                L('30', '30'),
                L('216', '216'),
              ],
              answer: 0,
              explain: L(
                'Buses repeat, so use multiples. A: 12, 24, 36. B: 18, 36. The first number in both lists is 36, the LCM (KPK). 6 is the GCF (FPB), 30 is 12 + 18, and 216 is $12 \\times 18$, which is a common multiple but not the first.',
                'Bus berulang, jadi pakai kelipatan. A: 12, 24, 36. B: 18, 36. Bilangan pertama di kedua daftar adalah 36 (KPK). 6 adalah FPB, 30 adalah 12 + 18, dan 216 adalah $12 \\times 18$, yang kelipatan persekutuan tetapi bukan yang pertama.',
              ),
              hint: L(
                'Things that repeat ask for the LCM (KPK). Write the multiples of 12 and of 18 until you find the first common one.',
                'Hal yang berulang memerlukan KPK. Tulis kelipatan 12 dan 18 sampai menemukan yang pertama sama.',
              ),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'An aquarium is 50 cm long, 30 cm wide and 40 cm high. How many liters of water fit in it when it is full to the top?',
                'Sebuah akuarium panjangnya 50 cm, lebarnya 30 cm, dan tingginya 40 cm. Berapa liter air yang muat di dalamnya jika penuh sampai ke atas?',
              ),
              figure: {
                ...cuboid3d({ l: 5, w: 3, h: 4, labels: { l: '50', w: '30', h: '40' } }),
                caption: L('The aquarium. The sides are in cm.', 'Akuarium. Ukuran sisinya dalam cm.'),
              },
              blanks: [{ answer: 60, after: { en: '\\text{ liters}', id: '\\text{ liter}' } }],
              hints: [
                L(
                  'The volume of a box tells how much fits inside. Which three numbers do you need?',
                  'Volume balok menunjukkan berapa banyak yang muat di dalamnya. Tiga bilangan mana yang kamu perlukan?',
                ),
                L(
                  'Multiply length × width × height. That gives cubic centimeters, and the question asks for liters.',
                  'Kalikan panjang × lebar × tinggi. Itu memberi sentimeter kubik, dan soal menanyakan liter.',
                ),
                L(
                  'The volume is $50 \\times 30 \\times 40$ in cm³. Remember that 1 liter = $1\\,000\\text{ cm}^3$.',
                  'Volumenya $50 \\times 30 \\times 40$ dalam cm³. Ingat 1 liter = $1\\,000\\text{ cm}^3$.',
                ),
              ],
              explain: L(
                '$50 \\times 30 \\times 40 = 60\\,000\\text{ cm}^3$. Since 1 liter is $1\\,000\\text{ cm}^3$, the aquarium holds $60\\,000 \\div 1\\,000 = 60$ liters.',
                '$50 \\times 30 \\times 40 = 60\\,000\\text{ cm}^3$. Karena 1 liter adalah $1\\,000\\text{ cm}^3$, akuarium memuat $60\\,000 \\div 1\\,000 = 60$ liter.',
              ),
              solution: [
                '50 \\times 30 \\times 40 = 60\\,000 \\text{ cm}^3',
                '60\\,000 \\div 1\\,000 = 60 \\text{ l}',
              ],
            },
            {
              kind: 'judge',
              id: 'j2',
              prompt: L(
                'The bar chart shows the scores of five children on a quiz. Decide whether each statement is True or False.',
                'Diagram batang menunjukkan nilai kuis lima anak. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 6, color: 'a' },
                    { label: 'Budi', value: 8, color: 'b' },
                    { label: 'Citra', value: 7, color: 'c' },
                    { label: 'Dewi', value: 8, color: 'result' },
                    { label: 'Eko', value: 11, color: 'a' },
                  ],
                  max: 12,
                  step: 2,
                }),
                caption: L('Quiz scores of five children.', 'Nilai kuis lima anak.'),
              },
              statements: [
                L('The five children scored 40 in all.', 'Kelima anak itu mendapat nilai 40 seluruhnya.'),
                L('The difference between the highest and the lowest score is 5.', 'Selisih nilai tertinggi dan terendah adalah 5.'),
                L('Citra scored 2 less than Budi.', 'Nilai Citra 2 lebih rendah daripada nilai Budi.'),
                L('Budi and Dewi scored the same.', 'Budi dan Dewi mendapat nilai yang sama.'),
              ],
              answer: [true, true, false, true],
              explain: L(
                'The scores are 6, 8, 7, 8 and 11, and $6 + 8 + 7 + 8 + 11 = 40$. The highest minus the lowest is $11 - 6 = 5$. Citra has 7 and Budi has 8, so Citra scored only 1 less, not 2. Budi and Dewi both scored 8.',
                'Nilainya 6, 8, 7, 8, dan 11, dan $6 + 8 + 7 + 8 + 11 = 40$. Nilai tertinggi dikurangi terendah adalah $11 - 6 = 5$. Citra mendapat 7 dan Budi mendapat 8, jadi nilai Citra hanya 1 lebih rendah, bukan 2. Budi dan Dewi sama-sama mendapat 8.',
              ),
              hint: L(
                'Read the value of all five bars first. Then add them, subtract, and compare, one statement at a time.',
                'Baca dulu nilai kelima batang. Lalu jumlahkan, kurangkan, dan bandingkan, satu pernyataan pada satu waktu.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc2',
              prompt: L(
                'On Saturday Siti read $\\frac{2}{5}$ of a storybook. On Sunday she read $\\frac{1}{4}$ of it. Choose the THREE true statements.',
                'Pada hari Sabtu Siti membaca $\\frac{2}{5}$ bagian sebuah buku cerita. Pada hari Minggu ia membaca $\\frac{1}{4}$ bagian. Pilih TIGA pernyataan yang benar.',
              ),
              options: [
                L('She read $\\frac{13}{20}$ of the book in all.', 'Ia membaca $\\frac{13}{20}$ bagian buku seluruhnya.'),
                L('She read more on Saturday than on Sunday.', 'Ia membaca lebih banyak pada hari Sabtu daripada hari Minggu.'),
                L('$\\frac{7}{20}$ of the book is still unread.', '$\\frac{7}{20}$ bagian buku belum dibaca.'),
                L('She read more than $\\frac{3}{4}$ of the book.', 'Ia membaca lebih dari $\\frac{3}{4}$ bagian buku.'),
                L('She read $\\frac{3}{9}$ of the book in all.', 'Ia membaca $\\frac{3}{9}$ bagian buku seluruhnya.'),
              ],
              answer: [0, 1, 2],
              explain: L(
                'In twentieths, $\\frac{2}{5} = \\frac{8}{20}$ and $\\frac{1}{4} = \\frac{5}{20}$. Together $\\frac{13}{20}$, so $\\frac{20}{20} - \\frac{13}{20} = \\frac{7}{20}$ is unread, and 8 twentieths is more than 5. But $\\frac{13}{20}$ is less than $\\frac{15}{20} = \\frac{3}{4}$, and $\\frac{3}{9}$ comes from adding the tops and the bottoms, which is not how to add fractions.',
                'Dalam duapuluhan, $\\frac{2}{5} = \\frac{8}{20}$ dan $\\frac{1}{4} = \\frac{5}{20}$. Jumlahnya $\\frac{13}{20}$, jadi yang belum dibaca $\\frac{20}{20} - \\frac{13}{20} = \\frac{7}{20}$, dan 8 duapuluhan lebih banyak dari 5. Tetapi $\\frac{13}{20}$ kurang dari $\\frac{15}{20} = \\frac{3}{4}$, dan $\\frac{3}{9}$ berasal dari menjumlahkan pembilang dan penyebutnya, yang bukan cara menjumlah pecahan.',
              ),
              hint: L(
                'Write both fractions with the same denominator, 20. Then check every statement against them.',
                'Tulis kedua pecahan dengan penyebut yang sama, 20. Lalu periksa setiap pernyataan dengan keduanya.',
              ),
            },
            {
              kind: 'math',
              id: 'm3',
              prompt: L(
                'A train leaves station A at 08:15 and arrives at station B at 11:00. On the way it stops for 15 minutes. Whenever it is moving, it goes at 72 km/h. How many kilometers is it from A to B?',
                'Sebuah kereta berangkat dari stasiun A pukul 08.15 dan tiba di stasiun B pukul 11.00. Di perjalanan kereta berhenti selama 15 menit. Saat bergerak, kecepatannya 72 km/jam. Berapa kilometer jarak dari A ke B?',
              ),
              blanks: [{ answer: 180, after: '\\text{ km}' }],
              hints: [
                L(
                  'Underline what is asked. The train does not move while it stops, so which time do you need?',
                  'Garis bawahi yang ditanyakan. Kereta tidak bergerak saat berhenti, jadi waktu mana yang kamu perlukan?',
                ),
                L(
                  'Find the whole trip time, take away the stop, and change it to hours. Then use distance = speed × time.',
                  'Cari lama seluruh perjalanan, kurangi waktu berhenti, dan ubah ke jam. Lalu pakai jarak = kecepatan × waktu.',
                ),
                L(
                  'From 08:15 to 11:00 is 2 hours 45 minutes. Without the 15-minute stop it is 2 hours 30 minutes, which is 2.5 hours. Multiply by 72.',
                  'Dari 08.15 sampai 11.00 adalah 2 jam 45 menit. Tanpa berhenti 15 menit menjadi 2 jam 30 menit, yaitu 2,5 jam. Kalikan dengan 72.',
                ),
              ],
              explain: L(
                'The trip takes 2 h 45 min, and without the 15-minute stop it moves for 2 h 30 min = 2.5 h. The distance is $72 \\times 2.5 = 180$ km. Check: 72 km in an hour, so about 70 × 2.5 = 175.',
                'Perjalanan memakan 2 jam 45 menit, dan tanpa berhenti 15 menit kereta bergerak 2 jam 30 menit = 2,5 jam. Jaraknya $72 \\times 2{,}5 = 180$ km. Periksa: 72 km tiap jam, jadi sekitar 70 × 2,5 = 175.',
              ),
              solution: {
                en: ['11:00 - 08:15 = 2\\text{ h } 45\\text{ min}', '2\\text{ h } 45\\text{ min} - 15\\text{ min} = 2.5 \\text{ h}', '72 \\times 2.5 = 180 \\text{ km}'],
                id: ['11:00 - 08:15 = 2\\text{ jam } 45\\text{ menit}', '2\\text{ jam } 45\\text{ menit} - 15\\text{ menit} = 2{,}5 \\text{ jam}', '72 \\times 2{,}5 = 180 \\text{ km}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- Test 2 */
        {
          id: 'tka-m11-s3-l2',
          title: L('Practice Test 2', 'Simulasi TKA 2'),
          goal: L(
            'You can finish a second practice test with new situations and numbers, level by level, from easy to hard.',
            'Kamu bisa menyelesaikan simulasi kedua dengan situasi dan bilangan baru, tingkat demi tingkat, dari yang mudah sampai yang sulit.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Practice Test 2 Works', 'Ayo Amati: Cara Kerja Simulasi TKA 2'),
              body: L(
                `This is the second practice test, with new situations and new numbers. It has 12 questions, so plan about 24 minutes. Try to beat your plan from Practice Test 1.\n\n- The questions go from easy to hard, and the last two are the hardest.\n- In choose-all questions, more than one answer is correct.\n- In True/False tables, judge every statement on its own.\n\nA hint appears when an answer is wrong, and an explanation appears when it is right. Skip and return if you are stuck, and leave a minute to check. Good luck!`,
                `Ini simulasi kedua, dengan situasi dan bilangan baru. Terdiri dari 12 soal, jadi rencanakan sekitar 24 menit. Cobalah mengalahkan rencanamu pada Simulasi TKA 1.\n\n- Soal-soal berjalan dari mudah ke sulit, dan dua soal terakhir paling sulit.\n- Pada soal pilih semua, jawaban yang benar lebih dari satu.\n- Pada tabel Benar/Salah, nilai setiap pernyataan satu per satu.\n\nPetunjuk muncul kalau jawabanmu salah, dan penjelasan muncul kalau benar. Lewati dan kembali kalau buntu, dan sisakan satu menit untuk memeriksa. Semoga berhasil!`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('Round 3,847 to the nearest hundred.', 'Bulatkan 3.847 ke ratusan terdekat.'),
              options: [
                L('3,800', '3.800'),
                L('3,900', '3.900'),
                L('3,850', '3.850'),
                L('4,000', '4.000'),
              ],
              answer: 0,
              explain: L(
                'Look at the tens digit, which is 4. It is less than 5, so we keep the hundreds and get 3,800. 3,900 rounds up wrongly, 3,850 is rounded to tens, and 4,000 is rounded to thousands.',
                'Lihat angka puluhan, yaitu 4. Kurang dari 5, jadi ratusannya tetap dan hasilnya 3.800. 3.900 membulatkan ke atas dengan salah, 3.850 dibulatkan ke puluhan, dan 4.000 dibulatkan ke ribuan.',
              ),
              hint: L(
                'Look only at the digit to the right of the hundreds place. Is it 5 or more, or less than 5?',
                'Lihat hanya angka di sebelah kanan tempat ratusan. Apakah 5 atau lebih, atau kurang dari 5?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L('What is the name of this shape?', 'Apa nama bangun ini?'),
              figure: {
                ...shape({ pts: [[0, 0], [6, 0], [8, 3], [2, 3]] }),
                caption: L('A quadrilateral with two pairs of parallel sides and no right angles.', 'Sebuah segiempat dengan dua pasang sisi sejajar dan tanpa sudut siku-siku.'),
              },
              options: [
                L('Parallelogram', 'Jajargenjang'),
                L('Rectangle', 'Persegi panjang'),
                L('Trapezoid', 'Trapesium'),
                L('Rhombus', 'Belah ketupat'),
              ],
              answer: 0,
              explain: L(
                'Two pairs of parallel sides and no right angles make a parallelogram. A rectangle has four right angles, a trapezoid has only one pair of parallel sides, and a rhombus has four equal sides (here the long and short sides differ).',
                'Dua pasang sisi sejajar dan tanpa sudut siku-siku membentuk jajargenjang. Persegi panjang punya empat sudut siku-siku, trapesium hanya punya satu pasang sisi sejajar, dan belah ketupat punya empat sisi sama panjang (di sini sisi panjang dan pendeknya berbeda).',
              ),
              hint: L(
                'Look at the corners (are there right angles?) and the sides (how many pairs are parallel? are they all equal?).',
                'Lihat sudut-sudutnya (ada sudut siku-siku?) dan sisi-sisinya (berapa pasang yang sejajar? apakah semuanya sama panjang?).',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'The pictogram shows the bottles four children collected. Each square stands for 6 bottles. How many bottles did Hasan and Indah collect together?',
                'Piktogram menunjukkan botol yang dikumpulkan empat anak. Setiap kotak menyatakan 6 botol. Berapa botol yang dikumpulkan Hasan dan Indah bersama-sama?',
              ),
              figure: {
                ...pictogram({
                  rows: [
                    { label: 'Gita', count: 3, color: 'a' },
                    { label: 'Hasan', count: 4.5, color: 'b' },
                    { label: 'Indah', count: 2, color: 'c' },
                    { label: 'Joko', count: 3.5, color: 'result' },
                  ],
                  key: '■ = 6',
                }),
                caption: L('Bottles collected. Each square is 6 bottles and a half square is 3 bottles.', 'Botol yang dikumpulkan. Setiap kotak adalah 6 botol dan setengah kotak adalah 3 botol.'),
              },
              options: [
                L('39', '39'),
                L('6.5', '6,5'),
                L('36', '36'),
                L('42', '42'),
              ],
              answer: 0,
              explain: L(
                'Hasan has 4.5 squares and Indah has 2, so $(4.5 + 2) \\times 6 = 39$ bottles. 6.5 forgets the key, 36 ignores the half square, and 42 counts the half square as a whole one.',
                'Hasan punya 4,5 kotak dan Indah punya 2, jadi $(4{,}5 + 2) \\times 6 = 39$ botol. 6,5 lupa kuncinya, 36 mengabaikan setengah kotak, dan 42 menghitung setengah kotak sebagai satu kotak utuh.',
              ),
              hint: L(
                'Count the squares for the two children only (a half square is half). Then use the key.',
                'Hitung kotak untuk kedua anak itu saja (setengah kotak itu setengah). Lalu pakai kuncinya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\frac{1}{4}$ of 36 is 9.', '$\\frac{1}{4}$ dari 36 adalah 9.'),
                L('1.2 is greater than 1.15.', '1,2 lebih besar daripada 1,15.'),
                L('The LCM (KPK) of 5 and 15 is 75.', 'KPK dari 5 dan 15 adalah 75.'),
                L('$\\frac{2}{3} = \\frac{6}{8}$.', '$\\frac{2}{3} = \\frac{6}{8}$.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                '$36 \\div 4 = 9$. 1.20 is greater than 1.15. 15 is already a multiple of 5, so the LCM is 15, not 75. And $\\frac{2}{3} = \\frac{6}{9}$, so it is not $\\frac{6}{8}$.',
                '$36 \\div 4 = 9$. 1,20 lebih besar daripada 1,15. 15 sudah kelipatan 5, jadi KPK-nya 15, bukan 75. Dan $\\frac{2}{3} = \\frac{6}{9}$, jadi bukan $\\frac{6}{8}$.',
              ),
              hint: L(
                'Judge each statement alone. Write 1.2 as 1.20 to compare, and multiply the top and the bottom by the same number for the last one.',
                'Nilai tiap pernyataan sendiri-sendiri. Tulis 1,2 sebagai 1,20 untuk membandingkan, dan kalikan pembilang dan penyebut dengan bilangan yang sama untuk yang terakhir.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q4',
              prompt: L(
                'Ani pours 2.5 liters of juice equally into glasses that each hold 250 ml. How many glasses does she fill?',
                'Ani menuang 2,5 liter jus sama banyak ke dalam gelas yang masing-masing memuat 250 ml. Berapa gelas yang ia isi?',
              ),
              options: [
                L('10', '10'),
                L('100', '100'),
                L('1', '1'),
                L('25', '25'),
              ],
              answer: 0,
              explain: L(
                'Use the same unit. 2.5 l = 2,500 ml, and $2\\,500 \\div 250 = 10$ glasses. The other numbers come from changing liters to milliliters in the wrong way.',
                'Pakai satuan yang sama. 2,5 l = 2.500 ml, dan $2\\,500 \\div 250 = 10$ gelas. Bilangan lainnya muncul dari mengubah liter ke mililiter dengan cara yang salah.',
              ),
              hint: L(
                'Change liters to milliliters first (1 l = 1,000 ml). Then divide by the size of one glass.',
                'Ubah dulu liter ke mililiter (1 l = 1.000 ml). Lalu bagi dengan ukuran satu gelas.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Dewi spent $\\frac{3}{10}$ of her savings on a book and $\\frac{1}{5}$ of her savings on a bag. What fraction of her savings is left? Write it in simplest form.',
                'Dewi menghabiskan $\\frac{3}{10}$ bagian tabungannya untuk sebuah buku dan $\\frac{1}{5}$ bagian tabungannya untuk sebuah tas. Berapa bagian tabungannya yang tersisa? Tulis dalam bentuk paling sederhana.',
              ),
              blanks: numDen(1, 2),
              hints: [
                L(
                  'The whole savings is $\\frac{10}{10}$. First find what fraction she spent in all.',
                  'Seluruh tabungan adalah $\\frac{10}{10}$. Pertama cari berapa bagian yang ia belanjakan seluruhnya.',
                ),
                L(
                  'Write $\\frac{1}{5}$ in tenths, add the two fractions, then subtract the total from 1 whole.',
                  'Tulis $\\frac{1}{5}$ dalam persepuluhan, jumlahkan kedua pecahan, lalu kurangkan jumlahnya dari 1 utuh.',
                ),
                L(
                  '$\\frac{1}{5} = \\frac{2}{10}$, so she spent $\\frac{3}{10} + \\frac{2}{10}$. Subtract that from $\\frac{10}{10}$ and simplify.',
                  '$\\frac{1}{5} = \\frac{2}{10}$, jadi ia menghabiskan $\\frac{3}{10} + \\frac{2}{10}$. Kurangkan dari $\\frac{10}{10}$ lalu sederhanakan.',
                ),
              ],
              explain: L(
                'She spent $\\frac{3}{10} + \\frac{2}{10} = \\frac{5}{10}$. What is left is $\\frac{10}{10} - \\frac{5}{10} = \\frac{5}{10}$, and dividing the top and the bottom by 5 gives $\\frac{1}{2}$.',
                'Ia menghabiskan $\\frac{3}{10} + \\frac{2}{10} = \\frac{5}{10}$. Sisanya $\\frac{10}{10} - \\frac{5}{10} = \\frac{5}{10}$, dan membagi pembilang dan penyebut dengan 5 memberi $\\frac{1}{2}$.',
              ),
              solution: [
                '\\frac{1}{5} = \\frac{2}{10}',
                '\\frac{3}{10} + \\frac{2}{10} = \\frac{5}{10}',
                '1 - \\frac{5}{10} = \\frac{5}{10} = \\frac{1}{2}',
              ],
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The picture shows a stack of unit cubes. Choose the TWO true statements.',
                'Gambar menunjukkan tumpukan kubus satuan. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...cubeStack3d([[2, 1], [1, 1]]),
                caption: L('A stack of unit cubes on a 2 by 2 floor.', 'Tumpukan kubus satuan pada alas 2 kali 2.'),
              },
              options: [
                L('The stack is made of 5 cubes.', 'Tumpukan itu terdiri dari 5 kubus.'),
                L('Seen from above, the stack covers 4 squares.', 'Dilihat dari atas, tumpukan itu menutupi 4 persegi.'),
                L('The tallest tower is 3 cubes high.', 'Menara tertinggi setinggi 3 kubus.'),
                L('The stack is made of 4 cubes.', 'Tumpukan itu terdiri dari 4 kubus.'),
              ],
              answer: [0, 1],
              explain: L(
                'The towers have 2, 1, 1 and 1 cubes, so there are $2 + 1 + 1 + 1 = 5$ cubes. The floor is 2 by 2, so from above you see 4 squares. The tallest tower has 2 cubes, and 4 is only the number of squares on the floor.',
                'Menara-menaranya berisi 2, 1, 1, dan 1 kubus, jadi ada $2 + 1 + 1 + 1 = 5$ kubus. Alasnya 2 kali 2, jadi dari atas kamu melihat 4 persegi. Menara tertinggi berisi 2 kubus, dan 4 hanya banyaknya persegi pada alas.',
              ),
              hint: L(
                'Count the cubes tower by tower, also the ones behind. Then think about the floor: how many squares does it have?',
                'Hitung kubus menara demi menara, juga yang di belakang. Lalu pikirkan alasnya: ada berapa persegi?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q5',
              prompt: L(
                'Eko has 42 red beads and 28 white beads. He makes bags that are exactly the same, with no beads left over, and he wants as many bags as possible. How many bags can he make?',
                'Eko punya 42 manik merah dan 28 manik putih. Ia membuat kantong yang persis sama, tanpa ada manik tersisa, dan ia ingin kantong sebanyak mungkin. Berapa kantong yang bisa ia buat?',
              ),
              options: [
                L('14', '14'),
                L('84', '84'),
                L('7', '7'),
                L('70', '70'),
              ],
              answer: 0,
              explain: L(
                'Sharing out equally with the most bags asks for the GCF (FPB). $42 = 2 \\times 3 \\times 7$ and $28 = 2 \\times 2 \\times 7$, so the GCF is $2 \\times 7 = 14$. 84 is the LCM (KPK), 7 works but is not the most, and 70 is the sum.',
                'Membagi sama banyak dengan kantong terbanyak memerlukan FPB. $42 = 2 \\times 3 \\times 7$ dan $28 = 2 \\times 2 \\times 7$, jadi FPB-nya $2 \\times 7 = 14$. 84 adalah KPK, 7 bisa tetapi bukan yang terbanyak, dan 70 adalah jumlahnya.',
              ),
              hint: L(
                'Sharing into equal groups with the biggest number of groups asks for a common factor. Which common factor is the greatest?',
                'Membagi menjadi kelompok yang sama dengan jumlah kelompok terbanyak memerlukan faktor persekutuan. Faktor persekutuan mana yang terbesar?',
              ),
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'What is the area of this trapezoid? The sides are in cm.',
                'Berapa luas trapesium ini? Panjang sisinya dalam cm.',
              ),
              figure: {
                ...shape({ pts: [[0, 0], [13, 0], [7, 8], [0, 8]], sides: ['13', undefined, '7', '8'], rights: [0, 3] }),
                caption: L('A trapezoid with parallel sides of 13 cm and 7 cm. The height is 8 cm.', 'Sebuah trapesium dengan sisi sejajar 13 cm dan 7 cm. Tingginya 8 cm.'),
              },
              blanks: [{ answer: 80, after: '\\text{ cm}^2' }],
              hints: [
                L(
                  'Which two sides are parallel? And which side is the height?',
                  'Dua sisi mana yang sejajar? Dan sisi mana yang menjadi tinggi?',
                ),
                L(
                  'The area of a trapezoid is ½ × (top + bottom) × height.',
                  'Luas trapesium adalah ½ × (atas + bawah) × tinggi.',
                ),
                L(
                  'Add the two parallel sides, $13 + 7$, then multiply by the height 8 and take half.',
                  'Jumlahkan dua sisi sejajar, $13 + 7$, lalu kalikan dengan tinggi 8 dan ambil setengahnya.',
                ),
              ],
              explain: L(
                '$13 + 7 = 20$, $20 \\times 8 = 160$, and half of 160 is 80. The area is $80\\text{ cm}^2$.',
                '$13 + 7 = 20$, $20 \\times 8 = 160$, dan setengah dari 160 adalah 80. Luasnya $80\\text{ cm}^2$.',
              ),
              solution: [
                '\\frac{1}{2} \\times (13 + 7) \\times 8',
                '= \\frac{1}{2} \\times 20 \\times 8 = 80 \\text{ cm}^2',
              ],
            },
            {
              kind: 'judge',
              id: 'j2',
              prompt: L(
                'The bar chart shows the marbles that five children have. Decide whether each statement is True or False.',
                'Diagram batang menunjukkan kelereng milik lima anak. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 14, color: 'a' },
                    { label: 'Budi', value: 9, color: 'b' },
                    { label: 'Citra', value: 12, color: 'c' },
                    { label: 'Dewi', value: 9, color: 'result' },
                    { label: 'Eko', value: 6, color: 'a' },
                  ],
                  max: 14,
                  step: 2,
                }),
                caption: L('Marbles of five children.', 'Kelereng lima anak.'),
              },
              statements: [
                L('Together the five children have 50 marbles.', 'Kelima anak itu punya 50 kelereng bersama-sama.'),
                L('Ani has 5 more marbles than Citra.', 'Kelereng Ani 5 lebih banyak daripada Citra.'),
                L('Budi and Dewi have the same number of marbles.', 'Budi dan Dewi punya kelereng sama banyak.'),
                L('Eko has half as many marbles as Budi.', 'Kelereng Eko setengah dari kelereng Budi.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The marbles are 14, 9, 12, 9 and 6, and $14 + 9 + 12 + 9 + 6 = 50$. Ani has $14 - 12 = 2$ more than Citra, not 5. Budi and Dewi both have 9. Half of Budi\'s 9 would be 4.5, not 6.',
                'Kelerengnya 14, 9, 12, 9, dan 6, dan $14 + 9 + 12 + 9 + 6 = 50$. Ani punya $14 - 12 = 2$ lebih banyak daripada Citra, bukan 5. Budi dan Dewi sama-sama punya 9. Setengah dari 9 milik Budi adalah 4,5, bukan 6.',
              ),
              hint: L(
                'Read the value of all five bars first. Then add, subtract or compare for each statement, one at a time.',
                'Baca dulu nilai kelima batang. Lalu jumlahkan, kurangkan, atau bandingkan untuk tiap pernyataan, satu per satu.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc2',
              prompt: L(
                'A school bag costs Rp80,000. This week there is a 25% discount. Choose the TWO true statements.',
                'Sebuah tas sekolah harganya Rp80.000. Minggu ini ada diskon 25%. Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('The discount is Rp20,000.', 'Diskonnya Rp20.000.'),
                L('Ani pays Rp60,000 for the bag.', 'Ani membayar Rp60.000 untuk tas itu.'),
                L('Ani pays Rp20,000 for the bag.', 'Ani membayar Rp20.000 untuk tas itu.'),
                L('If Ani pays with Rp100,000, her change is Rp30,000.', 'Jika Ani membayar dengan Rp100.000, kembaliannya Rp30.000.'),
              ],
              answer: [0, 1],
              explain: L(
                '25% is a quarter, and $80\\,000 \\div 4 = 20\\,000$, so the discount is Rp20,000 and the price to pay is $80\\,000 - 20\\,000 = 60\\,000$. Rp20,000 is the discount, not the price. The change from Rp100,000 is $100\\,000 - 60\\,000 = 40\\,000$, not 30,000.',
                '25% adalah seperempat, dan $80\\,000 \\div 4 = 20\\,000$, jadi diskonnya Rp20.000 dan harga yang dibayar $80\\,000 - 20\\,000 = 60\\,000$. Rp20.000 adalah diskon, bukan harga yang dibayar. Kembalian dari Rp100.000 adalah $100\\,000 - 60\\,000 = 40\\,000$, bukan 30.000.',
              ),
              hint: L(
                'Find the discount first, then the price after the discount. Check every statement against both numbers.',
                'Cari diskonnya dulu, lalu harga setelah diskon. Periksa setiap pernyataan dengan kedua bilangan itu.',
              ),
            },
            {
              kind: 'math',
              id: 'm3',
              prompt: L(
                'A water tank inside is 50 cm long, 40 cm wide and 30 cm high. It is $\\frac{2}{5}$ full of water. Ani pours in 12 more liters. How high is the water now, in cm?',
                'Sebuah bak air bagian dalamnya panjang 50 cm, lebar 40 cm, dan tinggi 30 cm. Bak itu terisi $\\frac{2}{5}$ bagian air. Ani menuang 12 liter air lagi. Berapa cm tinggi air sekarang?',
              ),
              figure: {
                ...cuboid3d({ l: 5, w: 4, h: 3, labels: { l: '50', w: '40', h: '30' } }),
                caption: L('The tank. The sides are in cm.', 'Bak air. Ukuran sisinya dalam cm.'),
              },
              blanks: [{ answer: 18, after: '\\text{ cm}' }],
              hints: [
                L(
                  'Break it into small questions: how many liters does the tank hold when full, and how many liters are in it now?',
                  'Pecah menjadi pertanyaan kecil: berapa liter yang termuat saat penuh, dan berapa liter yang ada sekarang?',
                ),
                L(
                  'Full tank: $50 \\times 40 \\times 30$ in cm³, changed to liters. Then take $\\frac{2}{5}$ of that and add 12 liters.',
                  'Bak penuh: $50 \\times 40 \\times 30$ dalam cm³, diubah ke liter. Lalu ambil $\\frac{2}{5}$ bagiannya dan tambahkan 12 liter.',
                ),
                L(
                  'The tank holds 60 liters, so it first has 24 liters and now 36 liters, which is $36\\,000\\text{ cm}^3$. The floor is $50 \\times 40$. Height = volume ÷ floor area.',
                  'Bak memuat 60 liter, jadi mula-mula berisi 24 liter dan sekarang 36 liter, yaitu $36\\,000\\text{ cm}^3$. Alasnya $50 \\times 40$. Tinggi = volume ÷ luas alas.',
                ),
              ],
              explain: L(
                'The full tank is $50 \\times 40 \\times 30 = 60\\,000\\text{ cm}^3 = 60$ liters. $\\frac{2}{5}$ of 60 is 24 liters, and 12 more makes 36 liters, which is $36\\,000\\text{ cm}^3$. The floor is $50 \\times 40 = 2\\,000\\text{ cm}^2$, so the height is $36\\,000 \\div 2\\,000 = 18$ cm, which is less than 30, so it fits.',
                'Bak penuh $50 \\times 40 \\times 30 = 60\\,000\\text{ cm}^3 = 60$ liter. $\\frac{2}{5}$ dari 60 adalah 24 liter, dan 12 lagi menjadi 36 liter, yaitu $36\\,000\\text{ cm}^3$. Alasnya $50 \\times 40 = 2\\,000\\text{ cm}^2$, jadi tingginya $36\\,000 \\div 2\\,000 = 18$ cm, yang kurang dari 30, jadi masuk akal.',
              ),
              solution: [
                '50 \\times 40 \\times 30 = 60\\,000 \\text{ cm}^3 = 60 \\text{ l}',
                '60 \\div 5 \\times 2 = 24 \\text{ l},\\quad 24 + 12 = 36 \\text{ l} = 36\\,000 \\text{ cm}^3',
                '50 \\times 40 = 2\\,000 \\text{ cm}^2',
                '36\\,000 \\div 2\\,000 = 18 \\text{ cm}',
              ],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m11-s3-p',
        runtime: 'math',
        title: L('Final Try-Out', 'Try-out Akhir'),
        brief: L(
          'Eight typed-answer questions from numbers, geometry and measurement, and data. They get harder, and the last two need real reasoning.',
          'Delapan soal dengan jawaban ketikan dari bilangan, geometri dan pengukuran, serta data. Soalnya makin sulit, dan dua soal terakhir memerlukan penalaran.',
        ),
        requirements: [
          L('Use the four steps and check every answer.', 'Memakai empat langkah dan memeriksa setiap jawaban.'),
          L('Mix what you learned in all eleven modules.', 'Memadukan apa yang kamu pelajari di kesebelas modul.'),
        ],
        tasks: [
          {
            prompt: L('What is the LCM (KPK) of 6 and 15?', 'Berapa KPK dari 6 dan 15?'),
            blanks: [{ answer: 30 }],
            solution: {
              en: ['6, 12, 18, 24, 30', '15, 30', '\\text{LCM} = 30'],
              id: ['6, 12, 18, 24, 30', '15, 30', '\\text{KPK} = 30'],
            },
          },
          {
            prompt: L(
              'A box is 6 cm long, 5 cm wide and 3 cm high. What is its volume?',
              'Sebuah balok panjangnya 6 cm, lebarnya 5 cm, dan tingginya 3 cm. Berapa volumenya?',
            ),
            blanks: [{ answer: 90, after: '\\text{ cm}^3' }],
            solution: ['6 \\times 5 \\times 3 = 90 \\text{ cm}^3'],
          },
          {
            prompt: L(
              'Work out $\\frac{7}{10} - \\frac{1}{4}$. Write the answer as a fraction in simplest form.',
              'Hitung $\\frac{7}{10} - \\frac{1}{4}$. Tulis jawabannya sebagai pecahan paling sederhana.',
            ),
            blanks: numDen(9, 20),
            solution: [
              '\\frac{7}{10} = \\frac{14}{20},\\quad \\frac{1}{4} = \\frac{5}{20}',
              '\\frac{14}{20} - \\frac{5}{20} = \\frac{9}{20}',
            ],
          },
          {
            prompt: L(
              'The bar chart shows the books four children read. What fraction of all the books did Ani read? Write it in simplest form.',
              'Diagram batang menunjukkan buku yang dibaca empat anak. Berapa bagian dari seluruh buku yang dibaca Ani? Tulis dalam bentuk paling sederhana.',
            ),
            figure: {
              ...barChart({
                bars: [
                  { label: 'Ani', value: 12, color: 'a' },
                  { label: 'Budi', value: 8, color: 'b' },
                  { label: 'Citra', value: 15, color: 'c' },
                  { label: 'Dewi', value: 5, color: 'result' },
                ],
                max: 16,
                step: 4,
              }),
              caption: L('Books read by four children.', 'Buku yang dibaca empat anak.'),
            },
            blanks: numDen(3, 10),
            solution: ['12 + 8 + 15 + 5 = 40', '\\frac{12}{40} = \\frac{3}{10}'],
          },
          {
            prompt: L(
              'What is the area of this shape? The sides are in cm and all corners are right angles.',
              'Berapa luas bangun ini? Panjang sisinya dalam cm dan semua sudutnya siku-siku.',
            ),
            figure: {
              ...shape({ pts: [[0, 0], [12, 0], [12, 4], [5, 4], [5, 9], [0, 9]], sides: ['12', '4', '7', '5', '5', '9'], rights: [0, 1, 2, 3, 4, 5] }),
              caption: L('A shape made of two rectangles.', 'Sebuah bangun yang terdiri dari dua persegi panjang.'),
            },
            blanks: [{ answer: 73, after: '\\text{ cm}^2' }],
            solution: {
              en: [
                '\\text{Bottom part: } 12 \\times 4 = 48',
                '\\text{Upper part: } 5 \\times 5 = 25',
                '48 + 25 = 73 \\text{ cm}^2',
              ],
              id: [
                '\\text{Bagian bawah: } 12 \\times 4 = 48',
                '\\text{Bagian atas: } 5 \\times 5 = 25',
                '48 + 25 = 73 \\text{ cm}^2',
              ],
            },
          },
          {
            prompt: L(
              'A motorbike travels at 45 km/h for 2 hours 20 minutes. How many kilometers does it travel?',
              'Sebuah sepeda motor melaju dengan kecepatan 45 km/jam selama 2 jam 20 menit. Berapa kilometer yang ia tempuh?',
            ),
            blanks: [{ answer: 105, after: '\\text{ km}' }],
            solution: [
              '20 \\text{ min} = \\frac{1}{3} \\text{ h}',
              '45 \\times 2 = 90 \\text{ km},\\quad 45 \\div 3 = 15 \\text{ km}',
              '90 + 15 = 105 \\text{ km}',
            ],
          },
          {
            prompt: L(
              'A shirt costs Rp120,000 with 25% off. Trousers cost Rp80,000 with 10% off. Bu Dewi buys both and pays with Rp200,000. How much change does she get?',
              'Sebuah kemeja harganya Rp120.000 dengan diskon 25%. Sebuah celana harganya Rp80.000 dengan diskon 10%. Bu Dewi membeli keduanya dan membayar dengan Rp200.000. Berapa uang kembaliannya?',
            ),
            blanks: [{ label: RP, answer: 38000 }],
            solution: [
              '25\\% \\text{ of } 120\\,000 = 30\\,000 \\rightarrow 120\\,000 - 30\\,000 = 90\\,000',
              '10\\% \\text{ of } 80\\,000 = 8\\,000 \\rightarrow 80\\,000 - 8\\,000 = 72\\,000',
              '90\\,000 + 72\\,000 = 162\\,000',
              '200\\,000 - 162\\,000 = 38\\,000',
            ],
          },
          {
            prompt: L(
              'Two buses leave the terminal together at 06:00. Bus A leaves every 40 minutes and bus B leaves every 60 minutes. How many times do they leave together after 06:00, up to and including 14:00?',
              'Dua bus berangkat bersama dari terminal pukul 06.00. Bus A berangkat setiap 40 menit dan bus B berangkat setiap 60 menit. Berapa kali keduanya berangkat bersama setelah pukul 06.00, sampai dengan pukul 14.00?',
            ),
            blanks: [{ answer: 4, after: { en: '\\text{ times}', id: '\\text{ kali}' } }],
            solution: {
              en: [
                '\\text{LCM}(40, 60) = 120 \\text{ min} = 2 \\text{ h}',
                '\\text{They meet at } 08:00,\\ 10:00,\\ 12:00,\\ 14:00',
                '\\text{From } 06:00 \\text{ to } 14:00 \\text{ is } 480 \\text{ min},\\quad 480 \\div 120 = 4',
              ],
              id: [
                '\\text{KPK}(40, 60) = 120 \\text{ menit} = 2 \\text{ jam}',
                '\\text{Mereka bertemu pukul } 08.00,\\ 10.00,\\ 12.00,\\ 14.00',
                '\\text{Dari } 06.00 \\text{ sampai } 14.00 \\text{ adalah } 480 \\text{ menit},\\quad 480 \\div 120 = 4',
              ],
            },
          },
        ],
        hints: [
          L(
            'Take the tasks one at a time, and skip and return if you are stuck. Check each answer with an estimate.',
            'Kerjakan soal satu per satu, dan lewati lalu kembali kalau buntu. Periksa tiap jawaban dengan taksiran.',
          ),
          L(
            'For shapes made of rectangles, split the shape into rectangles or take a rectangle away from a bigger one.',
            'Untuk bangun yang terdiri dari persegi panjang, bagi bangun menjadi persegi panjang atau kurangi persegi panjang besar dengan sebagiannya.',
          ),
          L(
            'For the last task, find when the buses first leave together again, and then count how many times that fits.',
            'Untuk soal terakhir, cari kapan kedua bus pertama kali berangkat bersama lagi, lalu hitung berapa kali itu muat.',
          ),
        ],
        xp: 50,
      },
    },

    /* ======================================================================== S4: official-style practice */
    {
      id: 'tka-m11-s4',
      title: L('Practice in the Style of the Official Framework', 'Contoh Soal ala Kerangka Asesmen'),
      summary: L(
        'Six questions that copy the form and the level of the sample questions in the official TKA framework, and a project of four typed-answer questions of the same kind.',
        'Enam soal yang meniru bentuk dan tingkat soal-soal contoh pada kerangka asesmen TKA resmi, dan proyek berisi empat soal jawaban ketikan yang sejenis.',
      ),
      lessons: [
        {
          id: 'tka-m11-s4-l1',
          title: L('Official-Style Questions', 'Soal Bergaya Resmi'),
          goal: L(
            'You can work through questions that look like the official TKA samples: a mixed calculation, a discount, True/False tables, a die, a choose-all question and a bar chart.',
            'Kamu bisa mengerjakan soal yang mirip contoh resmi TKA: hitungan campuran, diskon, tabel Benar/Salah, dadu, soal pilih semua, dan diagram batang.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Questions Shaped Like the Real Ones', 'Ayo Amati: Soal yang Bentuknya Seperti Aslinya'),
              body: L(
                `The next questions copy the shape of the sample questions in the official TKA framework. They are not the real test questions, but they have the same forms and the same levels.\n\n| Form | What it looks like |\n| --- | --- |\n| One answer | A story or a calculation with four options. Choose one. |\n| True/False table | Several statements. Mark every one True or False. |\n| Choose-all | More than one answer is correct. Choose every correct one. |\n\nTreat each question as the real thing. Read it twice, work it out on paper, and only then choose. If a question has a picture, the picture is part of the question.`,
                `Soal-soal berikut meniru bentuk soal contoh pada kerangka asesmen TKA resmi. Soal-soal ini bukan soal tes yang sebenarnya, tetapi bentuk dan tingkatnya sama.\n\n| Bentuk | Seperti apa |\n| --- | --- |\n| Satu jawaban | Cerita atau hitungan dengan empat pilihan. Pilih satu. |\n| Tabel Benar/Salah | Beberapa pernyataan. Tandai setiap pernyataan Benar atau Salah. |\n| Pilih semua | Jawaban benar lebih dari satu. Pilih setiap jawaban yang benar. |\n\nAnggaplah setiap soal sebagai soal sebenarnya. Baca dua kali, hitung di kertas, baru pilih. Kalau soal punya gambar, gambar itu bagian dari soal.`,
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'P', value: 20, color: 'a' },
                    { label: 'Q', value: 30, color: 'b' },
                    { label: 'R', value: 10, color: 'c' },
                  ],
                  max: 30,
                  step: 10,
                  showValues: false,
                }),
                caption: L(
                  'A picture like this can belong to the question, so read its scale before you read the options.',
                  'Gambar seperti ini bisa menjadi bagian soal, jadi baca skalanya sebelum membaca pilihan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Working Through a True/False Table', 'Contoh Bertahap: Mengerjakan Tabel Benar/Salah'),
              body: L(
                `Bu Rina fills 4 bottles with $2\\frac{1}{2}$ liters of syrup each. One statement says: "She has 10 liters of syrup in all." Is it True or False?\n\n1. Step 1: read the instruction. Every statement is judged on its own, so do not copy a pattern from the other rows.\n2. Step 2: underline the numbers in the story: 4 bottles and $2\\frac{1}{2}$ liters each.\n3. Step 3: work it out on paper. $4 \\times 2\\frac{1}{2} = 4 \\times 2 + 4 \\times \\frac{1}{2} = 8 + 2 = 10$ liters.\n4. Step 4: compare with the statement. It says 10 liters, so mark True.\n\n**Remember:**\n\n- Work the answer out first, then compare it with each statement.\n- A mixed number times a whole number: multiply the whole part and the fraction part separately, then add.\n- Check every statement, even when the first ones were easy.`,
                `Bu Rina mengisi 4 botol dengan sirup $2\\frac{1}{2}$ liter tiap botol. Sebuah pernyataan berbunyi: "Ia punya 10 liter sirup seluruhnya." Benar atau Salah?\n\n1. Langkah 1: baca perintahnya. Setiap pernyataan dinilai sendiri-sendiri, jadi jangan meniru pola dari baris lain.\n2. Langkah 2: garis bawahi angka dalam cerita: 4 botol dan $2\\frac{1}{2}$ liter tiap botol.\n3. Langkah 3: hitung di kertas. $4 \\times 2\\frac{1}{2} = 4 \\times 2 + 4 \\times \\frac{1}{2} = 8 + 2 = 10$ liter.\n4. Langkah 4: bandingkan dengan pernyataan. Pernyataan itu menyebut 10 liter, jadi tandai Benar.\n\n**Ingat:**\n\n- Hitung jawabannya dulu, lalu bandingkan dengan tiap pernyataan.\n- Pecahan campuran dikali bilangan asli: kalikan bagian utuh dan bagian pecahan secara terpisah, lalu jumlahkan.\n- Periksa setiap pernyataan, walaupun beberapa yang pertama mudah.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Work out $130\\% - 2 + 3 \\times 0.5 + \\frac{1}{4}$.',
                'Hitunglah $130\\% - 2 + 3 \\times 0{,}5 + \\frac{1}{4}$.',
              ),
              options: [
                L('$\\frac{21}{20}$', '$\\frac{21}{20}$'),
                L('$\\frac{7}{5}$', '$\\frac{7}{5}$'),
                L('$\\frac{3}{20}$', '$\\frac{3}{20}$'),
                L('$\\frac{1}{20}$', '$\\frac{1}{20}$'),
              ],
              answer: 0,
              explain: L(
                'Write everything as a decimal: $130\\% = 1.3$ and $\\frac{1}{4} = 0.25$. Multiply first, $3 \\times 0.5 = 1.5$. Then add first and subtract 2 last: $1.3 + 1.5 + 0.25 - 2 = 3.05 - 2 = 1.05 = \\frac{21}{20}$. The answer $\\frac{7}{5}$ goes from left to right and multiplies last, $\\frac{3}{20}$ uses $\\frac{1}{5}$ for 0.5, and $\\frac{1}{20}$ uses 30% instead of 130%.',
                'Tulis semuanya sebagai desimal: $130\\% = 1{,}3$ dan $\\frac{1}{4} = 0{,}25$. Kalikan dulu, $3 \\times 0{,}5 = 1{,}5$. Lalu jumlahkan dulu dan kurangi 2 paling akhir: $1{,}3 + 1{,}5 + 0{,}25 - 2 = 3{,}05 - 2 = 1{,}05 = \\frac{21}{20}$. Jawaban $\\frac{7}{5}$ menghitung dari kiri ke kanan dan mengalikan paling akhir, $\\frac{3}{20}$ memakai $\\frac{1}{5}$ untuk 0,5, dan $\\frac{1}{20}$ memakai 30% bukan 130%.',
              ),
              hint: L(
                'Change the percent and the fraction into decimals first. Remember which operation is done before adding and subtracting.',
                'Ubah dulu persen dan pecahan menjadi desimal. Ingat operasi mana yang dikerjakan sebelum menjumlah dan mengurang.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The school co-op gives a 20% discount on everything. A bag Y costs Rp60,000. A set of colored pencils X costs $\\frac{1}{3}$ of the price of bag Y, and a water bottle Z costs 0.75 times the price of bag Y. After the discount, what is the price of X + Z?',
                'Koperasi sekolah memberi diskon 20% untuk semua barang. Harga tas Y adalah Rp60.000. Harga satu set pensil warna X adalah $\\frac{1}{3}$ dari harga tas Y, dan harga botol minum Z adalah 0,75 kali harga tas Y. Setelah diskon, berapa harga X + Z?',
              ),
              options: [
                L('Rp52,000', 'Rp52.000'),
                L('Rp65,000', 'Rp65.000'),
                L('Rp13,000', 'Rp13.000'),
                L('Rp56,000', 'Rp56.000'),
              ],
              answer: 0,
              explain: L(
                'X costs $60\\,000 \\div 3 = 20\\,000$ and Z costs $0.75 \\times 60\\,000 = 45\\,000$, so together $65\\,000$. The discount is 20% of that, $13\\,000$, and $65\\,000 - 13\\,000 = 52\\,000$. Rp65,000 forgets the discount, Rp13,000 is only the discount, and Rp56,000 gives the discount to Z alone.',
                'X harganya $60\\,000 \\div 3 = 20\\,000$ dan Z harganya $0{,}75 \\times 60\\,000 = 45\\,000$, jadi bersama $65\\,000$. Diskonnya 20% dari itu, yaitu $13\\,000$, dan $65\\,000 - 13\\,000 = 52\\,000$. Rp65.000 lupa diskon, Rp13.000 hanya diskonnya, dan Rp56.000 memberi diskon hanya untuk Z.',
              ),
              hint: L(
                'Find the price of X and the price of Z from the price of Y first. Then think about what the discount is taken from.',
                'Cari dulu harga X dan harga Z dari harga Y. Lalu pikirkan diskon itu diambil dari harga yang mana.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'Bu Wati sells herbal drink. One day she makes 7 jugs with $3\\frac{2}{5}$ liters of herbal drink in each jug. She pours all of it into 10 large bottles of equal size and into 8 small bottles. Each small bottle holds half as much as a large bottle. Decide whether each statement about Bu Wati\'s herbal drink is True or False.',
                'Bu Wati menjual jamu. Suatu hari ia membuat 7 kendi yang masing-masing berisi $3\\frac{2}{5}$ liter jamu. Seluruh jamu itu dituang ke dalam 10 botol besar yang isinya sama banyak dan ke dalam 8 botol kecil. Isi setiap botol kecil adalah setengah isi botol besar. Tentukan Benar atau Salah untuk setiap pernyataan tentang jamu Bu Wati!',
              ),
              statements: [
                L('Bu Wati made $23\\frac{4}{5}$ liters of herbal drink that day.', 'Hari itu Bu Wati membuat $23\\frac{4}{5}$ liter jamu.'),
                L('Each large bottle holds 2 liters.', 'Setiap botol besar berisi 2 liter.'),
                L('The small bottles hold $6\\frac{4}{5}$ liters in all.', 'Seluruh botol kecil berisi $6\\frac{4}{5}$ liter.'),
              ],
              answer: [true, false, true],
              explain: L(
                'The jugs hold $7 \\times 3\\frac{2}{5} = 21 + \\frac{14}{5} = 23\\frac{4}{5}$ liters. Eight small bottles are worth 4 large ones, so everything fills $10 + 4 = 14$ large bottles. One large bottle holds $\\frac{119}{5} \\div 14 = \\frac{17}{10} = 1\\frac{7}{10}$ liters, not 2. The small bottles hold $4 \\times 1\\frac{7}{10} = 6\\frac{4}{5}$ liters.',
                'Kendi-kendi itu berisi $7 \\times 3\\frac{2}{5} = 21 + \\frac{14}{5} = 23\\frac{4}{5}$ liter. Delapan botol kecil sama dengan 4 botol besar, jadi semuanya mengisi $10 + 4 = 14$ botol besar. Satu botol besar berisi $\\frac{119}{5} \\div 14 = \\frac{17}{10} = 1\\frac{7}{10}$ liter, bukan 2. Botol kecil berisi $4 \\times 1\\frac{7}{10} = 6\\frac{4}{5}$ liter.',
              ),
              hint: L(
                'Find the total amount first. Then ask how many large bottles all the small bottles are worth together.',
                'Cari dulu jumlah seluruhnya. Lalu tanyakan semua botol kecil itu sama dengan berapa botol besar.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'Dewi plays ludo with Eko. A die has 1, 2, 3, 4, 5 and 6 dots, and the dots on every two opposite faces add up to the same number. Dewi throws the die and it lands as in the picture. How many dots are on the bottom face?',
                'Dewi bermain ludo dengan Eko. Sebuah dadu punya 1, 2, 3, 4, 5, dan 6 titik, dan jumlah titik pada setiap dua sisi berlawanan sama. Dewi melempar dadu dan dadunya jatuh seperti pada gambar. Berapa banyak titik pada sisi bawah?',
              ),
              figure: {
                ...dieView(5, 3, 6),
                caption: L(
                  'The die after the throw. You can see the top face and two side faces.',
                  'Dadu setelah dilempar. Kamu bisa melihat sisi atas dan dua sisi samping.',
                ),
              },
              options: [L('2', '2'), L('1', '1'), L('4', '4'), L('5', '5')],
              answer: 0,
              explain: L(
                'All six faces together have $1 + 2 + 3 + 4 + 5 + 6 = 21$ dots, shared by 3 pairs, so every pair adds up to 7. The top has 5, so the bottom has $7 - 5 = 2$. The numbers 4 and 1 are on faces we cannot see, and 5 is the top face itself.',
                'Keenam sisi bersama-sama punya $1 + 2 + 3 + 4 + 5 + 6 = 21$ titik, dibagi untuk 3 pasang, jadi setiap pasang berjumlah 7. Sisi atas punya 5, jadi sisi bawah punya $7 - 5 = 2$. Angka 4 dan 1 ada pada sisi yang tidak terlihat, dan 5 adalah sisi atas itu sendiri.',
              ),
              hint: L(
                'How many dots are there on all six faces together? Those dots are shared by three pairs with the same total.',
                'Ada berapa titik pada keenam sisi seluruhnya? Titik-titik itu dibagi untuk tiga pasang yang jumlahnya sama.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'For a school trip the class packs a snack hamper with 2 kg of rice, 3 bags of sugar of 4 hg each, and 6 packets of crackers of 75 g each. (Remember 1 kg = 1,000 g and 1 hg = 100 g.) How heavy is the hamper? Choose the correct answers! More than one answer is correct.',
                'Untuk karya wisata, kelas mengemas keranjang makanan berisi 2 kg beras, 3 kantong gula masing-masing 4 hg, dan 6 bungkus biskuit masing-masing 75 g. (Ingat 1 kg = 1.000 g dan 1 hg = 100 g.) Seberapa berat keranjang itu? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.',
              ),
              options: [
                L('The sugar weighs 1.2 kilograms in all.', 'Seluruh gula beratnya 1,2 kilogram.'),
                L('The rice is heavier than the sugar and the crackers together.', 'Beras lebih berat daripada gula dan biskuit digabungkan.'),
                L('The hamper weighs 2,570 grams in all.', 'Keranjang itu beratnya 2.570 gram seluruhnya.'),
              ],
              answer: [0, 1],
              explain: L(
                'Rice is 2,000 g. Sugar is $3 \\times 4 = 12$ hg, which is 1,200 g or 1.2 kg. Crackers are $6 \\times 75 = 450$ g. Together the hamper weighs 3,650 g. The sugar and crackers weigh 1,650 g, less than the 2,000 g of rice. The number 2,570 comes from treating 1 hg as 10 g.',
                'Beras 2.000 g. Gula $3 \\times 4 = 12$ hg, yaitu 1.200 g atau 1,2 kg. Biskuit $6 \\times 75 = 450$ g. Bersama-sama keranjang itu beratnya 3.650 g. Gula dan biskuit beratnya 1.650 g, kurang dari 2.000 g beras. Angka 2.570 muncul karena menganggap 1 hg sama dengan 10 g.',
              ),
              hint: L(
                'Change every amount to grams first. Then check each statement on its own.',
                'Ubah dulu setiap berat menjadi gram. Lalu periksa setiap pernyataan satu per satu.',
              ),
            },
            {
              kind: 'judge',
              id: 'j2',
              prompt: L(
                'The new school garden counts its visitors for the first five days. The chart shows the data. Decide whether each statement about the data is True or False.',
                'Kebun sekolah yang baru mendata pengunjungnya selama lima hari pertama. Diagram menunjukkan datanya. Tentukan Benar atau Salah untuk setiap pernyataan tentang data itu!',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: '1', value: 20, color: 'a' },
                    { label: '2', value: 25, color: 'b' },
                    { label: '3', value: 30, color: 'c' },
                    { label: '4', value: 15, color: 'result' },
                    { label: '5', value: 25, color: 'a' },
                  ],
                  max: 30,
                  step: 5,
                  showValues: false,
                }),
                caption: L(
                  'Visitors on days 1 to 5. The scale goes up by 5.',
                  'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 5.',
                ),
              },
              statements: [
                L('On day 1 there were only $\\frac{2}{3}$ as many visitors as on day 3.', 'Pada hari ke-1 pengunjungnya hanya $\\frac{2}{3}$ dari pengunjung hari ke-3.'),
                L('In the five days, 115 visitors came in all.', 'Dalam lima hari, seluruhnya 115 pengunjung datang.'),
                L('From one day to the next, the number of visitors never changed by more than 10.', 'Dari satu hari ke hari berikutnya, banyak pengunjung tidak pernah berubah lebih dari 10.'),
              ],
              answer: [true, true, false],
              explain: L(
                'Day 1 had 20 visitors and day 3 had 30, and $\\frac{20}{30} = \\frac{2}{3}$. The total is $20 + 25 + 30 + 15 + 25 = 115$. From day 3 to day 4 the number fell from 30 to 15, a change of 15, which is more than 10.',
                'Hari ke-1 ada 20 pengunjung dan hari ke-3 ada 30, dan $\\frac{20}{30} = \\frac{2}{3}$. Jumlahnya $20 + 25 + 30 + 15 + 25 = 115$. Dari hari ke-3 ke hari ke-4 banyaknya turun dari 30 menjadi 15, perubahan sebesar 15, yang lebih dari 10.',
              ),
              hint: L(
                'Read all five bars first. For the last statement, subtract each day from the day before it.',
                'Baca dulu kelima batang. Untuk pernyataan terakhir, kurangkan setiap hari dengan hari sebelumnya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A baker uses $4\\frac{3}{4}$ kg of flour for each batch of bread. How many kilograms of flour does the baker need for 6 batches? Write the answer as a decimal.',
                'Seorang pembuat roti memakai $4\\frac{3}{4}$ kg tepung untuk setiap adonan roti. Berapa kilogram tepung yang diperlukan untuk 6 adonan? Tulis jawaban sebagai desimal.',
              ),
              blanks: [{ answer: 28.5, after: '\\text{ kg}' }],
              hints: [
                L(
                  'Underline what is asked. What do you do to find the flour for 6 equal batches?',
                  'Garis bawahi yang ditanyakan. Apa yang kamu lakukan untuk mencari tepung dari 6 adonan yang sama?',
                ),
                L(
                  'Multiply 6 by the mixed number. Do the whole part and the fraction part separately.',
                  'Kalikan 6 dengan bilangan campuran itu. Kerjakan bagian bulat dan bagian pecahannya secara terpisah.',
                ),
                L(
                  '$6 \\times 4$ is the whole part. $6 \\times \\frac{3}{4}$ is the fraction part. Add the two parts.',
                  '$6 \\times 4$ adalah bagian bulatnya. $6 \\times \\frac{3}{4}$ adalah bagian pecahannya. Jumlahkan kedua bagian itu.',
                ),
              ],
              explain: L(
                'The whole part is $6 \\times 4 = 24$ and the fraction part is $6 \\times \\frac{3}{4} = \\frac{18}{4} = 4.5$. Together the baker needs $24 + 4.5 = 28.5$ kg.',
                'Bagian bulatnya $6 \\times 4 = 24$ dan bagian pecahannya $6 \\times \\frac{3}{4} = \\frac{18}{4} = 4{,}5$. Bersama-sama pembuat roti memerlukan $24 + 4{,}5 = 28{,}5$ kg.',
              ),
              solution: {
                en: ['6 \\times 4 = 24', '6 \\times \\frac{3}{4} = \\frac{18}{4} = 4.5', '24 + 4.5 = 28.5'],
                id: ['6 \\times 4 = 24', '6 \\times \\frac{3}{4} = \\frac{18}{4} = 4{,}5', '24 + 4{,}5 = 28{,}5'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m11-s4-p',
        runtime: 'math',
        title: L('Project: Official-Style Questions', 'Proyek: Soal Bergaya Resmi'),
        brief: L(
          'Four typed-answer questions of the same kind as the official samples: a mixed calculation, a discount, masses in a hamper and a conclusion from a chart.',
          'Empat soal jawaban ketikan yang sejenis dengan contoh resmi: hitungan campuran, diskon, berat isi keranjang, dan kesimpulan dari diagram.',
        ),
        requirements: [
          L('Work out a mixed calculation, a discount and a unit change step by step.', 'Menghitung hitungan campuran, diskon, dan perubahan satuan langkah demi langkah.'),
          L('Decide which statements a chart supports.', 'Menentukan pernyataan yang didukung oleh sebuah diagram.'),
        ],
        tasks: [
          {
            prompt: L(
              'Work out the value. You may type a decimal or a fraction.',
              'Hitunglah nilainya. Kamu boleh mengetik desimal atau pecahan.',
            ),
            given: {
              en: '140\\% - 1 + 3 \\times 0.5 - \\frac{2}{5}',
              id: '140\\% - 1 + 3 \\times 0{,}5 - \\frac{2}{5}',
            },
            blanks: [{ label: '=', answer: 1.5 }],
            solution: {
              en: ['140\\% = 1.4, \\quad \\frac{2}{5} = 0.4', '3 \\times 0.5 = 1.5', '1.4 - 1 + 1.5 - 0.4 = 1.5'],
              id: ['140\\% = 1{,}4, \\quad \\frac{2}{5} = 0{,}4', '3 \\times 0{,}5 = 1{,}5', '1{,}4 - 1 + 1{,}5 - 0{,}4 = 1{,}5'],
            },
          },
          {
            prompt: L(
              'A toy shop gives a 25% discount on everything. A ball costs Rp40,000. A toy car costs $\\frac{3}{4}$ of the price of the ball, and a doll costs 1.5 times the price of the ball. How much do the toy car and the doll cost together after the discount?',
              'Sebuah toko mainan memberi diskon 25% untuk semua barang. Sebuah bola harganya Rp40.000. Sebuah mobil mainan harganya $\\frac{3}{4}$ dari harga bola, dan sebuah boneka harganya 1,5 kali harga bola. Berapa harga mobil mainan dan boneka bersama-sama setelah diskon?',
            ),
            blanks: [{ label: RP, answer: 67500 }],
            solution: {
              en: [
                '\\frac{3}{4} \\times 40\\,000 = 30\\,000, \\quad 1.5 \\times 40\\,000 = 60\\,000',
                '30\\,000 + 60\\,000 = 90\\,000',
                '90\\,000 - \\frac{1}{4} \\times 90\\,000 = 90\\,000 - 22\\,500 = 67\\,500',
              ],
              id: [
                '\\frac{3}{4} \\times 40\\,000 = 30\\,000, \\quad 1{,}5 \\times 40\\,000 = 60\\,000',
                '30\\,000 + 60\\,000 = 90\\,000',
                '90\\,000 - \\frac{1}{4} \\times 90\\,000 = 90\\,000 - 22\\,500 = 67\\,500',
              ],
            },
          },
          {
            prompt: L(
              'Bu Rina packs a picnic basket with 3 bags of flour of 750 g each, 4 packs of sugar of 2 hg each, and 1 kg of rice. How many kilograms does the basket weigh in all?',
              'Bu Rina mengemas keranjang piknik berisi 3 kantong tepung masing-masing 750 g, 4 bungkus gula masing-masing 2 hg, dan 1 kg beras. Berapa kilogram berat keranjang itu seluruhnya?',
            ),
            blanks: [{ answer: 4.05, after: '\\text{ kg}' }],
            solution: {
              en: ['3 \\times 750 = 2\\,250 \\text{ g}, \\quad 4 \\times 2 \\text{ hg} = 8 \\text{ hg} = 800 \\text{ g}', '2\\,250 + 800 + 1\\,000 = 4\\,050 \\text{ g}', '4\\,050 \\text{ g} = 4.05 \\text{ kg}'],
              id: ['3 \\times 750 = 2\\,250 \\text{ g}, \\quad 4 \\times 2 \\text{ hg} = 8 \\text{ hg} = 800 \\text{ g}', '2\\,250 + 800 + 1\\,000 = 4\\,050 \\text{ g}', '4\\,050 \\text{ g} = 4{,}05 \\text{ kg}'],
            },
          },
          {
            prompt: L(
              'The chart shows the children at the reading corner on days 1 to 5. How many of these statements does the chart support? (1) On day 1 only $\\frac{3}{4}$ as many children came as on day 2. (2) In all, 90 children came. (3) On day 4 only $\\frac{2}{5}$ as many children came as on day 3. (4) From one day to the next the number never changed by more than 10.',
              'Diagram menunjukkan anak-anak di pojok baca pada hari ke-1 sampai ke-5. Berapa dari pernyataan berikut yang didukung diagram? (1) Pada hari ke-1 hanya $\\frac{3}{4}$ dari anak hari ke-2 yang datang. (2) Seluruhnya 90 anak datang. (3) Pada hari ke-4 hanya $\\frac{2}{5}$ dari anak hari ke-3 yang datang. (4) Dari satu hari ke hari berikutnya banyak anak tidak pernah berubah lebih dari 10.',
            ),
            figure: {
              ...barChart({
                bars: [
                  { label: '1', value: 15, color: 'a' },
                  { label: '2', value: 20, color: 'b' },
                  { label: '3', value: 25, color: 'c' },
                  { label: '4', value: 10, color: 'result' },
                  { label: '5', value: 20, color: 'a' },
                ],
                max: 25,
                step: 5,
                showValues: false,
              }),
              caption: L('Children at the reading corner. The scale goes up by 5.', 'Anak di pojok baca. Skalanya naik 5.'),
            },
            blanks: [{ answer: 3, after: { en: '\\text{ statements}', id: '\\text{ pernyataan}' } }],
            solution: {
              en: [
                '15, 20, 25, 10, 20',
                '(1)\\ \\frac{15}{20} = \\frac{3}{4} \\rightarrow \\text{yes}',
                '(2)\\ 15 + 20 + 25 + 10 + 20 = 90 \\rightarrow \\text{yes}',
                '(3)\\ \\frac{10}{25} = \\frac{2}{5} \\rightarrow \\text{yes}',
                '(4)\\ 25 - 10 = 15 > 10 \\rightarrow \\text{no}',
                '3 \\text{ statements}',
              ],
              id: [
                '15, 20, 25, 10, 20',
                '(1)\\ \\frac{15}{20} = \\frac{3}{4} \\rightarrow \\text{ya}',
                '(2)\\ 15 + 20 + 25 + 10 + 20 = 90 \\rightarrow \\text{ya}',
                '(3)\\ \\frac{10}{25} = \\frac{2}{5} \\rightarrow \\text{ya}',
                '(4)\\ 25 - 10 = 15 > 10 \\rightarrow \\text{tidak}',
                '3 \\text{ pernyataan}',
              ],
            },
          },
        ],
        hints: [
          L(
            'Change percents and fractions to the same form, and do multiplying before adding and subtracting.',
            'Ubah persen dan pecahan ke bentuk yang sama, dan kerjakan perkalian sebelum penjumlahan dan pengurangan.',
          ),
          L(
            'Write every amount of mass in grams before you add. Remember 1 hg = 100 g and 1 kg = 1,000 g.',
            'Tulis setiap berat dalam gram sebelum menjumlahkan. Ingat 1 hg = 100 g dan 1 kg = 1.000 g.',
          ),
          L(
            'For the chart, read all five bars first and test each statement on its own with those numbers.',
            'Untuk diagram, baca dulu kelima batang dan uji tiap pernyataan sendiri-sendiri dengan angka-angka itu.',
          ),
        ],
        xp: 50,
      },
    },
  ],
}
