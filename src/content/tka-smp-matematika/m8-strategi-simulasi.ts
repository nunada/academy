import type { Loc, MathBlank, Module } from '../types'
import type { FigColor, Figure, FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import {
  arrowDiagram,
  barChart,
  cylinder2d,
  fit,
  line,
  lineChart,
  numberLine,
  outline,
  parallelLines,
  pieChart,
  prism3d,
  rectPts,
  sectorPts,
  shape,
  solid,
  sphere2d,
  triPrismNet,
  txt,
} from './figs'

/** Module 8 — strategies for word problems, the three TKA question formats, time
 *  management, two full practice tests and a final try-out. */

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
 *  sticks in a new colour, so the "+3" can be seen. */
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

/** A coordinate plane with numbers on the axes. */
const plane = (x: [number, number], y: [number, number], items: FigItem[]): Figure => ({
  dim: 2,
  xSpan: x,
  ySpan: y,
  aspect: Math.max(0.5, Math.min(3, (x[1] - x[0]) / (y[1] - y[0]))),
  ticks: true,
  items,
})

const RP: MathBlank['label'] = '\\text{Rp}'

/* ---------------------------------------------------------------------------- the module */

export const module8: Module = {
  id: 'tka-smp-m8',
  title: L('Strategy and Practice Tests', 'Strategi dan Simulasi TKA'),
  summary: L(
    'Learn a plan for every word problem, get to know the three TKA question formats, manage your 75 minutes, and then try two full practice tests and a final try-out.',
    'Pelajari rencana untuk setiap soal cerita, kenali tiga bentuk soal TKA, atur waktu 75 menitmu, lalu coba dua simulasi lengkap dan satu try-out akhir.',
  ),
  submodules: [
    /* ======================================================================== S1: strategies */
    {
      id: 'tka-smp-m8-s1',
      title: L('Problem-Solving Strategies', 'Strategi Memecahkan Soal'),
      summary: L(
        'A four-step plan for word problems, with bar models, algebra, guess and check, working backwards and estimating, and then reasoning problems that mix topics.',
        'Rencana empat langkah untuk soal cerita, dengan model batang, aljabar, coba-coba, berpikir mundur, dan menaksir, lalu soal bernalar yang mencampur beberapa topik.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-smp-m8-s1-l1',
          title: L('Four Steps for Word Problems', 'Empat Langkah Memecahkan Soal Cerita'),
          goal: L(
            'You can solve a word problem with four steps (understand, plan, calculate, check) and choose a strategy that fits.',
            'Kamu bisa memecahkan soal cerita dengan empat langkah (pahami, rencanakan, hitung, periksa) dan memilih strategi yang cocok.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Four Steps', 'Ayo Amati: Empat Langkah'),
              body: L(
                `Dewi buys 4 exercise books at Rp7,500 each and a ruler for Rp4,000. She pays with Rp50,000. How much change does she get?\n\nA word problem is a small story with a question hiding inside. Do not rush to add up every number! Use the same four steps every time.\n\n| Step | What you do |\n| --- | --- |\n| Understand | Read it twice. Underline what is asked and circle what is given. |\n| Plan | Choose a strategy: draw a diagram or bar model, make a table, let $x$ be the unknown, guess and check, or work backwards. |\n| Calculate | Work one small step at a time and write the units. |\n| Check | Does the answer fit the story? Is it sensible? Estimate to check. |\n\nThe bar model shows Dewi's story: the money she pays is made of 4 books, the ruler and the change.`,
                `Dewi membeli 4 buku tulis seharga Rp7.500 per buah dan sebuah penggaris seharga Rp4.000. Ia membayar dengan Rp50.000. Berapa uang kembaliannya?\n\nSoal cerita adalah cerita pendek dengan pertanyaan yang tersembunyi di dalamnya. Jangan buru-buru menjumlahkan semua angka! Pakai empat langkah yang sama setiap kali.\n\n| Langkah | Yang kamu lakukan |\n| --- | --- |\n| Pahami | Baca dua kali. Garis bawahi yang ditanyakan dan lingkari yang diketahui. |\n| Rencanakan | Pilih strategi: gambar diagram atau model batang, buat tabel, misalkan $x$ sebagai yang dicari, coba-coba, atau berpikir mundur. |\n| Hitung | Kerjakan satu langkah kecil demi satu langkah dan tulis satuannya. |\n| Periksa | Apakah jawabannya cocok dengan cerita? Masuk akal? Taksir untuk memeriksa. |\n\nModel batang menunjukkan cerita Dewi: uang yang ia bayarkan terdiri dari 4 buku, penggaris, dan uang kembalian.`,
              ),
              figure: {
                ...barModel([
                  {
                    segs: [
                      { w: 7500, text: '7500', color: 'a' },
                      { w: 7500, text: '7500', color: 'a' },
                      { w: 7500, text: '7500', color: 'a' },
                      { w: 7500, text: '7500', color: 'a' },
                      { w: 4000, text: '4000', color: 'b' },
                      { w: 16000, text: '?', color: 'result' },
                    ],
                    brace: '50000',
                  },
                ]),
                caption: L(
                  'A bar model of the story, in rupiah. The four green pieces are the books, the orange piece is the ruler, and the red piece is the change.',
                  'Model batang dari cerita itu, dalam rupiah. Empat bagian hijau adalah buku tulis, bagian oranye adalah penggaris, dan bagian merah adalah uang kembalian.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: A Bar Model', 'Contoh Bertahap: Model Batang'),
              body: L(
                `Ani and Budi save money in the ratio $3 : 5$. Together they have Rp240,000. How much more money does Budi have than Ani?\n\n1. Step 1, Understand: given, the ratio $3 : 5$ and a total of Rp240,000. Asked, the difference between Budi's money and Ani's.\n2. Step 2, Plan: draw Ani's bar with 3 equal parts and Budi's bar with 5 equal parts. Together there are $3 + 5 = 8$ equal parts.\n3. Step 3, Calculate: one part is $240\\,000 \\div 8 = 30\\,000$. Budi has $5 - 3 = 2$ parts more than Ani, so the difference is $2 \\times 30\\,000 = 60\\,000$.\n4. Step 4, Check: Ani has $3 \\times 30\\,000 = 90\\,000$ and Budi has $5 \\times 30\\,000 = 150\\,000$. Together $240\\,000$, and the difference is $60\\,000$. It fits!\n\n**Remember:**\n\n- Draw first, calculate second.\n- For a ratio, the number of equal parts is the sum of the ratio numbers.\n- One part is the total divided by the number of parts.`,
                `Ani dan Budi menabung dengan perbandingan $3 : 5$. Bersama-sama mereka punya Rp240.000. Berapa rupiah uang Budi lebih banyak daripada uang Ani?\n\n1. Langkah 1, Pahami: diketahui perbandingan $3 : 5$ dan jumlah Rp240.000. Ditanyakan selisih uang Budi dan uang Ani.\n2. Langkah 2, Rencanakan: gambar batang Ani dengan 3 bagian sama besar dan batang Budi dengan 5 bagian sama besar. Seluruhnya ada $3 + 5 = 8$ bagian sama besar.\n3. Langkah 3, Hitung: satu bagian adalah $240\\,000 \\div 8 = 30\\,000$. Budi punya $5 - 3 = 2$ bagian lebih banyak daripada Ani, jadi selisihnya $2 \\times 30\\,000 = 60\\,000$.\n4. Langkah 4, Periksa: Ani punya $3 \\times 30\\,000 = 90\\,000$ dan Budi punya $5 \\times 30\\,000 = 150\\,000$. Jumlahnya $240\\,000$, dan selisihnya $60\\,000$. Cocok!\n\n**Ingat:**\n\n- Gambar dulu, hitung kemudian.\n- Untuk perbandingan, banyak bagian sama besar adalah jumlah bilangan-bilangan perbandingannya.\n- Satu bagian adalah jumlah seluruhnya dibagi banyak bagian.`,
              ),
              figure: {
                ...barModel([
                  { name: 'Ani', segs: [{ w: 1, text: '30', color: 'a' }, { w: 1, text: '30', color: 'a' }, { w: 1, text: '30', color: 'a' }] },
                  { name: 'Budi', segs: [{ w: 1, text: '30', color: 'a' }, { w: 1, text: '30', color: 'a' }, { w: 1, text: '30', color: 'a' }, { w: 1, text: '30', color: 'b' }, { w: 1, text: '30', color: 'b' }] },
                ]),
                caption: L(
                  'In thousands of rupiah. Ani has 3 parts and Budi has 5 parts. The 2 orange parts are the difference.',
                  'Dalam ribuan rupiah. Ani punya 3 bagian dan Budi punya 5 bagian. Dua bagian oranye adalah selisihnya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Let x Be ...', 'Contoh Bertahap: Misalkan x adalah ...'),
              body: L(
                `A taxi charges a starting fee of Rp9,000 plus Rp3,000 for each kilometre. Gita paid Rp42,000. How many kilometres did she ride?\n\n1. Step 1, Understand: fee Rp9,000, then Rp3,000 per km, total Rp42,000. Asked, the distance.\n2. Step 2, Plan: say in words what the unknown is. Let $x$ be the number of kilometres. The cost is $9\\,000 + 3\\,000x$.\n3. Step 3, Calculate: write the equation $9\\,000 + 3\\,000x = 42\\,000$. Subtract $9\\,000$ from both sides to get $3\\,000x = 33\\,000$. Divide both sides by $3\\,000$ to get $x = 11$.\n4. Step 4, Check: $9\\,000 + 3\\,000 \\times 11 = 9\\,000 + 33\\,000$, which is $42\\,000$. Gita rode 11 km.\n\n**Remember:**\n\n- Begin with "Let $x$ be ..." and say what $x$ counts, with its unit.\n- Turn the story into an equation, then do the same thing to both sides.\n- Answer the question in words, with the unit.`,
                `Sebuah taksi menetapkan tarif awal Rp9.000 ditambah Rp3.000 untuk setiap kilometer. Gita membayar Rp42.000. Berapa kilometer jarak yang ia tempuh?\n\n1. Langkah 1, Pahami: tarif awal Rp9.000, lalu Rp3.000 per km, jumlah Rp42.000. Ditanyakan jaraknya.\n2. Langkah 2, Rencanakan: sebutkan dengan kata-kata apa yang dicari. Misalkan $x$ adalah banyak kilometer. Biayanya $9\\,000 + 3\\,000x$.\n3. Langkah 3, Hitung: tulis persamaan $9\\,000 + 3\\,000x = 42\\,000$. Kurangkan $9\\,000$ pada kedua ruas sehingga $3\\,000x = 33\\,000$. Bagi kedua ruas dengan $3\\,000$ sehingga $x = 11$.\n4. Langkah 4, Periksa: $9\\,000 + 3\\,000 \\times 11 = 9\\,000 + 33\\,000$, yaitu $42\\,000$. Gita menempuh 11 km.\n\n**Ingat:**\n\n- Mulailah dengan "Misalkan $x$ adalah ..." dan sebutkan apa yang dihitung $x$, beserta satuannya.\n- Ubah cerita menjadi persamaan, lalu lakukan hal yang sama pada kedua ruas.\n- Jawab pertanyaannya dengan kalimat, lengkap dengan satuan.`,
              ),
              figure: {
                ...barModel([
                  {
                    segs: [
                      { w: 9, text: '9', color: 'b' },
                      ...Array.from({ length: 11 }, () => ({ w: 3, color: 'a' as FigColor })),
                    ],
                    brace: '42',
                  },
                ]),
                caption: L(
                  'In thousands of rupiah. The orange piece is the starting fee. Each green piece is the price of 1 km.',
                  'Dalam ribuan rupiah. Bagian oranye adalah tarif awal. Setiap bagian hijau adalah harga untuk 1 km.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Guess and Check', 'Contoh Bertahap: Coba-coba dan Periksa'),
              body: L(
                `Joko has 25 coins, some of Rp500 and some of Rp1,000, worth Rp17,500 in all. How many Rp1,000 coins does he have?\n\n1. Step 1: make a sensible first guess, say 5 coins of Rp1,000. Then there are $25 - 5 = 20$ coins of Rp500.\n2. Step 2: check the value, $5 \\times 1\\,000 + 20 \\times 500 = 5\\,000 + 10\\,000$, which is $15\\,000$. That is too low, so we need more Rp1,000 coins.\n3. Step 3: guess again, but not too far. With 10 coins of Rp1,000 and 15 of Rp500, $10\\,000 + 7\\,500 = 17\\,500$. It matches!\n4. Step 4: the answer is 10 coins. Write every guess in a table, so you never repeat one.\n\n| Rp1,000 coins | Rp500 coins | Total value | Too low or too high? |\n| --- | --- | --- | --- |\n| 5 | 20 | 15,000 | too low |\n| 15 | 10 | 20,000 | too high |\n| 10 | 15 | 17,500 | just right |\n\n**Remember:** after every guess, ask "too low or too high?" and use the answer to move your next guess in the right direction.`,
                `Joko punya 25 koin, sebagian Rp500 dan sebagian Rp1.000, nilainya seluruhnya Rp17.500. Berapa koin Rp1.000 yang ia punya?\n\n1. Langkah 1: buat tebakan pertama yang masuk akal, misalnya 5 koin Rp1.000. Maka ada $25 - 5 = 20$ koin Rp500.\n2. Langkah 2: periksa nilainya, $5 \\times 1\\,000 + 20 \\times 500 = 5\\,000 + 10\\,000$, yaitu $15\\,000$. Itu terlalu kecil, jadi kita perlu lebih banyak koin Rp1.000.\n3. Langkah 3: tebak lagi, tetapi jangan terlalu jauh. Dengan 10 koin Rp1.000 dan 15 koin Rp500, $10\\,000 + 7\\,500 = 17\\,500$. Cocok!\n4. Langkah 4: jawabannya 10 koin. Tulis setiap tebakan dalam tabel, supaya tidak mengulang tebakan yang sama.\n\n| Koin Rp1.000 | Koin Rp500 | Jumlah nilai | Terlalu kecil atau besar? |\n| --- | --- | --- | --- |\n| 5 | 20 | 15.000 | terlalu kecil |\n| 15 | 10 | 20.000 | terlalu besar |\n| 10 | 15 | 17.500 | tepat |\n\n**Ingat:** setelah setiap tebakan, tanyakan "terlalu kecil atau terlalu besar?" lalu gunakan jawabannya untuk menggeser tebakan berikutnya ke arah yang benar.`,
              ),
            },
            {
              kind: 'concept',
              id: 'c5',
              title: L('Step by Step: Working Backwards', 'Contoh Bertahap: Berpikir Mundur'),
              body: L(
                `A bus has some passengers when it leaves the terminal. At the first stop half of them get off and 6 get on. At the second stop 10 get off. Now there are 20 passengers. How many were on the bus at the start?\n\n1. Step 1: write the story as a chain. Start, then half get off, then plus 6, then minus 10, and the end is 20.\n2. Step 2: go backwards and undo each step in reverse order. The last step was "minus 10", so undo it: $20 + 10 = 30$.\n3. Step 3: undo "plus 6": $30 - 6 = 24$. Then undo "half get off", which means "halve", by doubling: $24 \\times 2 = 48$.\n4. Step 4: check by going forwards. $48 \\div 2 = 24$, then $24 + 6 = 30$, then $30 - 10 = 20$. Correct!\n\n**Remember:** to work backwards, start from the end and undo the steps in reverse order. Plus becomes minus, and times becomes divide.`,
                `Sebuah bus membawa sejumlah penumpang saat berangkat dari terminal. Di perhentian pertama setengah penumpang turun dan 6 orang naik. Di perhentian kedua 10 orang turun. Sekarang ada 20 penumpang. Berapa penumpang di bus pada awalnya?\n\n1. Langkah 1: tulis ceritanya sebagai rantai. Mula-mula, lalu setengahnya turun, lalu tambah 6, lalu kurang 10, dan akhirnya 20.\n2. Langkah 2: berjalan mundur dan batalkan tiap langkah dengan urutan terbalik. Langkah terakhir "kurang 10", jadi batalkan: $20 + 10 = 30$.\n3. Langkah 3: batalkan "tambah 6": $30 - 6 = 24$. Lalu batalkan "setengahnya turun", yaitu "dibagi dua", dengan menggandakan: $24 \\times 2 = 48$.\n4. Langkah 4: periksa dengan berjalan maju. $48 \\div 2 = 24$, lalu $24 + 6 = 30$, lalu $30 - 10 = 20$. Benar!\n\n**Ingat:** untuk berpikir mundur, mulai dari akhir dan batalkan langkah-langkahnya dengan urutan terbalik. Tambah menjadi kurang, dan kali menjadi bagi.`,
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 50,
                  step: 5,
                  jumps: [
                    { from: 20, to: 30, label: '+10', color: 'a' },
                    { from: 30, to: 24, label: '-6', color: 'b' },
                    { from: 24, to: 48, label: '+24', color: 'c' },
                  ],
                  marks: [{ at: 20, color: 'a' }, { at: 48, color: 'result' }],
                }),
                caption: L(
                  'From the end (20) we undo "minus 10", then "plus 6", then "halve" (which is +24 here) and reach the start (48, red).',
                  'Dari akhir (20) kita membatalkan "kurang 10", lalu "tambah 6", lalu "dibagi dua" (yaitu +24 di sini) dan sampai di awal (48, merah).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c6',
              title: L('Step by Step: Estimate to Check', 'Contoh Bertahap: Menaksir untuk Memeriksa'),
              body: L(
                `Rudi says that $0.52 \\times 398 = 2\\,069.6$. Is that sensible?\n\n1. Step 1: round to friendly numbers. $0.52$ is close to $0.5$ and $398$ is close to $400$.\n2. Step 2: estimate. Half of 400 is $0.5 \\times 400 = 200$.\n3. Step 3: compare. $2\\,069.6$ is about ten times bigger than 200, so Rudi's answer is not sensible. The decimal point is in the wrong place.\n4. Step 4: calculate carefully, $0.52 \\times 398 = 206.96$. This is close to 200, so 206.96 is sensible.\n\n**Remember:**\n\n- An estimate is not the exact answer, but it warns you when an answer is far off.\n- Round to numbers that are easy to calculate in your head.\n- Also check the size, the sign and the unit of your answer.`,
                `Rudi bilang bahwa $0{,}52 \\times 398 = 2\\,069{,}6$. Masuk akalkah?\n\n1. Langkah 1: bulatkan ke bilangan yang mudah. $0{,}52$ dekat dengan $0{,}5$ dan $398$ dekat dengan $400$.\n2. Langkah 2: taksir. Setengah dari 400 adalah $0{,}5 \\times 400 = 200$.\n3. Langkah 3: bandingkan. $2\\,069{,}6$ kira-kira sepuluh kali lebih besar daripada 200, jadi jawaban Rudi tidak masuk akal. Letak koma desimalnya salah.\n4. Langkah 4: hitung dengan teliti, $0{,}52 \\times 398 = 206{,}96$. Ini dekat dengan 200, jadi 206,96 masuk akal.\n\n**Ingat:**\n\n- Taksiran bukan jawaban pasti, tetapi memperingatkanmu kalau jawaban terlalu jauh.\n- Bulatkan ke bilangan yang mudah dihitung di kepala.\n- Periksa juga besar, tanda, dan satuan jawabanmu.`,
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 2200,
                  step: 200,
                  labelEvery: 2,
                  marks: [{ at: 200, color: 'b', label: '200' }, { at: 2070, color: 'result', label: '2070' }],
                }),
                caption: L(
                  'The estimate (200, orange) and Rudi\'s answer (2,069.6, red). They are far apart.',
                  'Taksiran (200, oranye) dan jawaban Rudi (2.069,6, merah). Keduanya berjauhan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c7',
              title: L('Watch Out!: Word Problem Traps', 'Awas, Jebakan!: Jebakan Soal Cerita'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| Dewi buys 4 books and a ruler for Rp34,000, so the change is Rp34,000. | That is only what she spent. The question asks for the change: Rp50,000 − Rp34,000 = Rp16,000. Read the question again before you write the answer. |\n| Ratio $3 : 5$ and total 240,000, so one part is $240\\,000 \\div 5$. | Divide by the total number of parts, $3 + 5 = 8$. |\n| From $3\\,000x = 33\\,000$ the answer is 33,000 km. | $x$ is the number of kilometres: $x = 11$. 33,000 is a cost in rupiah, not a distance. |`,
                `| Salah | Benar |\n| --- | --- |\n| Dewi membeli 4 buku dan penggaris seharga Rp34.000, jadi kembaliannya Rp34.000. | Itu baru yang ia belanjakan. Yang ditanya uang kembalian: Rp50.000 − Rp34.000 = Rp16.000. Baca lagi pertanyaannya sebelum menulis jawaban. |\n| Perbandingan $3 : 5$ dan jumlah 240.000, jadi satu bagian $240\\,000 \\div 5$. | Bagi dengan jumlah seluruh bagian, $3 + 5 = 8$. |\n| Dari $3\\,000x = 33\\,000$ jawabannya 33.000 km. | $x$ adalah banyak kilometer: $x = 11$. 33.000 adalah biaya dalam rupiah, bukan jarak. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Gita and Hasan have Rp360,000 together. Gita has Rp40,000 less than Hasan, as the bar model shows. Which calculation gives the money Hasan has?',
                'Gita dan Hasan punya uang Rp360.000 bersama-sama. Uang Gita Rp40.000 lebih sedikit daripada uang Hasan, seperti pada model batang. Perhitungan mana yang memberi uang Hasan?',
              ),
              figure: {
                ...barModel([
                  { name: 'Gita', segs: [{ w: 16, text: '?', color: 'a' }] },
                  { name: 'Hasan', segs: [{ w: 16, text: '?', color: 'a' }, { w: 4, text: '40000', color: 'b' }] },
                ]),
                caption: L(
                  'Gita has one bar. Hasan has the same bar and Rp40,000 more.',
                  'Gita punya satu batang. Hasan punya batang yang sama dan Rp40.000 lebih banyak.',
                ),
              },
              options: [
                L('$(360\\,000 + 40\\,000) \\div 2$', '$(360\\,000 + 40\\,000) \\div 2$'),
                L('$(360\\,000 - 40\\,000) \\div 2$', '$(360\\,000 - 40\\,000) \\div 2$'),
                L('$360\\,000 \\div 2$', '$360\\,000 \\div 2$'),
                L('$360\\,000 + 40\\,000$', '$360\\,000 + 40\\,000$'),
              ],
              answer: 0,
              explain: L(
                'If Gita had Rp40,000 more, both bars would be as long as Hasan\'s, and the total would be $360\\,000 + 40\\,000$. Two equal bars are shared, so Hasan has $(360\\,000 + 40\\,000) \\div 2 = 200\\,000$. $(360\\,000 - 40\\,000) \\div 2$ is Gita\'s money, and $360\\,000 \\div 2$ forgets the difference.',
                'Kalau uang Gita Rp40.000 lebih banyak, kedua batang sama panjang dengan batang Hasan, dan jumlahnya menjadi $360\\,000 + 40\\,000$. Dua batang yang sama panjang dibagi, jadi Hasan punya $(360\\,000 + 40\\,000) \\div 2 = 200\\,000$. $(360\\,000 - 40\\,000) \\div 2$ adalah uang Gita, dan $360\\,000 \\div 2$ melupakan selisihnya.',
              ),
              hint: L(
                'Which bar is the longer one? If Gita\'s bar grew by Rp40,000 so that both bars were equal, what would the total be?',
                'Batang mana yang lebih panjang? Kalau batang Gita bertambah Rp40.000 sehingga kedua batang sama panjang, berapa jumlahnya?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a rectangle has a perimeter of 40 cm. Its length is 4 cm more than its width. Let $x$ be the width in cm, so the perimeter is $2(x + x + 4) = 40$.',
                'Coba bersama: sebuah persegi panjang kelilingnya 40 cm. Panjangnya 4 cm lebih daripada lebarnya. Misalkan $x$ adalah lebar dalam cm, sehingga kelilingnya $2(x + x + 4) = 40$.',
              ),
              template: '4x + 8 = 40 \\qquad 4x = ___ \\qquad x = ___',
              blanks: ['32', '8'],
              explain: L(
                'Subtract 8 from both sides to get $4x = 32$, then divide both sides by 4 to get $x = 8$. The width is 8 cm and the length is 12 cm. Check: $2(8 + 12) = 40$.',
                'Kurangkan 8 pada kedua ruas sehingga $4x = 32$, lalu bagi kedua ruas dengan 4 sehingga $x = 8$. Lebarnya 8 cm dan panjangnya 12 cm. Periksa: $2(8 + 12) = 40$.',
              ),
              hint: L(
                'First expand the brackets: $2(2x + 4) = 4x + 8$. Then undo the +8, and then undo the times 4.',
                'Pertama jabarkan kurungnya: $2(2x + 4) = 4x + 8$. Lalu batalkan +8, kemudian batalkan kali 4.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A car uses 7.8 litres of petrol for every 100 km. By estimating, about how many litres does it use for a trip of 395 km?',
                'Sebuah mobil memakai 7,8 liter bensin untuk setiap 100 km. Dengan menaksir, kira-kira berapa liter yang dipakai untuk perjalanan 395 km?',
              ),
              options: [
                L('31 litres', '31 liter'),
                L('3.1 litres', '3,1 liter'),
                L('310 litres', '310 liter'),
                L('62 litres', '62 liter'),
              ],
              answer: 0,
              explain: L(
                'Round 7.8 to 8 and 395 km to 400 km, which is 4 hundreds. Then $8 \\times 4 = 32$ litres. Only 31 is close to that. 3.1 and 310 have the decimal point in the wrong place, and 62 doubles the distance.',
                'Bulatkan 7,8 menjadi 8 dan 395 km menjadi 400 km, yaitu 4 ratusan. Maka $8 \\times 4 = 32$ liter. Hanya 31 yang dekat dengan itu. 3,1 dan 310 salah letak koma desimalnya, dan 62 menggandakan jaraknya.',
              ),
              hint: L(
                'Round both numbers to friendly ones. How many times does 100 km fit into about 400 km?',
                'Bulatkan kedua bilangan menjadi bilangan yang mudah. Berapa kali 100 km termuat dalam sekitar 400 km?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the THREE good ways to check an answer.', 'Pilih TIGA cara yang baik untuk memeriksa jawaban.'),
              options: [
                L('Put the answer back into the story and see if it fits.', 'Masukkan jawaban kembali ke cerita dan lihat apakah cocok.'),
                L('Estimate with rounded numbers and compare.', 'Taksir dengan bilangan yang dibulatkan lalu bandingkan.'),
                L('Check that the size, the sign and the unit make sense.', 'Periksa apakah besar, tanda, dan satuannya masuk akal.'),
                L('Choose the biggest number you got, because big answers are usually right.', 'Pilih bilangan terbesar yang kamu dapat, karena jawaban besar biasanya benar.'),
                L('Calculate again in exactly the same way and hope it changes.', 'Hitung lagi dengan cara yang persis sama dan berharap hasilnya berubah.'),
              ],
              answer: [0, 1, 2],
              explain: L(
                'Putting the answer back in the story, estimating, and checking size, sign and unit can all catch a mistake. A big number is not more likely to be right, and repeating the same mistake gives the same wrong answer.',
                'Memasukkan jawaban ke cerita, menaksir, dan memeriksa besar, tanda, serta satuan sama-sama bisa menangkap kesalahan. Bilangan besar tidak lebih mungkin benar, dan mengulang kesalahan yang sama memberi jawaban salah yang sama.',
              ),
              hint: L(
                'A good check can find a mistake. Which options could show you that an answer is wrong?',
                'Pemeriksaan yang baik bisa menemukan kesalahan. Pilihan mana yang bisa menunjukkan bahwa jawaban salah?',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: L('Put the steps of the "let $x$ be ..." strategy in order.', 'Urutkan langkah-langkah strategi "misalkan $x$ adalah ...".'),
              lines: {
                en: [
                  'Say in words what $x$ stands for, for example the width in cm',
                  'Write the story as an equation using $x$',
                  'Solve the equation, doing the same to both sides',
                  'Put the value back into the story and check that it fits',
                ],
                id: [
                  'Sebutkan dengan kata-kata apa arti $x$, misalnya lebar dalam cm',
                  'Tulis ceritanya sebagai persamaan dengan $x$',
                  'Selesaikan persamaannya, lakukan hal yang sama pada kedua ruas',
                  'Masukkan nilainya kembali ke cerita dan periksa apakah cocok',
                ],
              },
              explain: L(
                'First decide what $x$ means, then write the equation, then solve it, and check last.',
                'Pertama tentukan arti $x$, lalu tulis persamaannya, lalu selesaikan, dan periksa di akhir.',
              ),
              hint: L(
                'You cannot write an equation before you know what $x$ stands for, and the check comes when you have a value.',
                'Kamu tidak bisa menulis persamaan sebelum tahu arti $x$, dan pemeriksaan dilakukan setelah ada nilainya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A film ticket costs Rp35,000 for an adult and Rp20,000 for a child. A group of 12 people pays Rp330,000 in all. How many adults are in the group?',
                'Tiket film seharga Rp35.000 untuk orang dewasa dan Rp20.000 untuk anak. Sekelompok 12 orang membayar Rp330.000 seluruhnya. Berapa orang dewasa dalam kelompok itu?',
              ),
              blanks: [{ answer: 6, after: { en: '\\text{ adults}', id: '\\text{ orang dewasa}' } }],
              hints: [
                L(
                  'Underline what is asked. List what is given: the two prices, 12 people and the total.',
                  'Garis bawahi yang ditanyakan. Daftar yang diketahui: dua harga, 12 orang, dan jumlah uangnya.',
                ),
                L(
                  'Choose a strategy. Let $a$ be the number of adults. Then there are $12 - a$ children. (Or guess and check with a table.)',
                  'Pilih strategi. Misalkan $a$ adalah banyak orang dewasa. Maka ada $12 - a$ anak. (Atau coba-coba dengan tabel.)',
                ),
                L(
                  'Write $35\\,000a + 20\\,000(12 - a) = 330\\,000$. Expand the bracket, collect the terms with $a$, and solve.',
                  'Tulis $35\\,000a + 20\\,000(12 - a) = 330\\,000$. Jabarkan kurungnya, kumpulkan suku-suku dengan $a$, lalu selesaikan.',
                ),
              ],
              explain: L(
                'The equation simplifies to $15\\,000a + 240\\,000 = 330\\,000$, so $a = 6$. Check: 6 adults pay $210\\,000$ and 6 children pay $120\\,000$, in all $330\\,000$.',
                'Persamaannya menjadi $15\\,000a + 240\\,000 = 330\\,000$, sehingga $a = 6$. Periksa: 6 orang dewasa membayar $210\\,000$ dan 6 anak membayar $120\\,000$, seluruhnya $330\\,000$.',
              ),
              solution: [
                '35\\,000a + 20\\,000(12 - a) = 330\\,000',
                '15\\,000a + 240\\,000 = 330\\,000',
                '15\\,000a = 90\\,000',
                'a = 6',
                '6 \\times 35\\,000 + 6 \\times 20\\,000 = 210\\,000 + 120\\,000 = 330\\,000',
              ],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-smp-m8-s1-l2',
          title: L('Reasoning: Multi-Step and Mixed-Topic Problems', 'Bernalar: Soal Bertahap dan Lintas Topik'),
          goal: L(
            'You can break a problem that mixes topics into small questions, find patterns, and reason about what must be true.',
            'Kamu bisa memecah soal yang mencampur topik menjadi pertanyaan kecil, mencari pola, dan bernalar tentang apa yang pasti benar.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Problems That Mix Topics', 'Ayo Amati: Soal yang Mencampur Topik'),
              body: L(
                `Some TKA items mix topics, for example ratio with probability, algebra with geometry, or sequences with functions. They look hard, but the numbers are friendly. You only need a plan.\n\nHere is one. A bag holds green, orange and gold marbles in the ratio $2 : 3 : 5$. There are 40 marbles in all. One marble is picked at random. What is the probability that it is NOT orange?\n\nBreak it into small questions:\n\n- How many equal parts are there in all?\n- How many marbles are in one part?\n- How many marbles are orange?\n- What fraction of the marbles are not orange?`,
                `Beberapa soal TKA mencampur topik, misalnya perbandingan dengan peluang, aljabar dengan geometri, atau barisan dengan fungsi. Kelihatannya sulit, tetapi angkanya bersahabat. Kamu hanya butuh rencana.\n\nIni salah satunya. Sebuah kantong berisi kelereng hijau, oranye, dan emas dengan perbandingan $2 : 3 : 5$. Seluruhnya ada 40 kelereng. Satu kelereng diambil secara acak. Berapa peluang yang terambil BUKAN oranye?\n\nPecah menjadi pertanyaan-pertanyaan kecil:\n\n- Ada berapa bagian sama besar seluruhnya?\n- Berapa kelereng dalam satu bagian?\n- Berapa kelereng yang oranye?\n- Berapa bagian kelereng yang bukan oranye?`,
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
                      { w: 1, color: 'c' },
                      { w: 1, color: 'c' },
                      { w: 1, color: 'c' },
                      { w: 1, color: 'c' },
                      { w: 1, color: 'c' },
                    ],
                    brace: '40',
                  },
                ]),
                caption: L(
                  'The 40 marbles in 10 equal parts: 2 green parts, 3 orange parts and 5 gold parts. The orange parts are the orange marbles.',
                  '40 kelereng dalam 10 bagian sama besar: 2 bagian hijau, 3 bagian oranye, dan 5 bagian emas. Bagian oranye adalah kelereng oranye.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Solving the Marble Puzzle', 'Contoh Bertahap: Memecahkan Teka-teki Kelereng'),
              body: L(
                `Let us answer the small questions one by one.\n\n1. Step 1, Understand: ratio $2 : 3 : 5$, 40 marbles, one is picked at random. Asked, the probability that it is not orange.\n2. Step 2, Plan: find the number of parts, then the size of one part, then the number of orange marbles, then the probability.\n3. Step 3, Calculate: the number of parts is $2 + 3 + 5 = 10$, so one part is $40 \\div 10 = 4$ marbles. Orange is 3 parts, $3 \\times 4 = 12$ marbles, so $40 - 12 = 28$ marbles are not orange.\n4. Step 4, Calculate: $P(\\text{not orange}) = \\frac{28}{40} = \\frac{7}{10}$.\n5. Step 5, Check: $P(\\text{orange}) = \\frac{12}{40} = \\frac{3}{10}$, and $\\frac{3}{10} + \\frac{7}{10} = 1$. It fits!\n\n**Remember:**\n\n- Write every small answer with what it counts.\n- The last small answer is not always the one asked for, so check what the question wants.\n- The probabilities of an event and of "not the event" add up to 1.`,
                `Mari kita jawab pertanyaan-pertanyaan kecil itu satu per satu.\n\n1. Langkah 1, Pahami: perbandingan $2 : 3 : 5$, 40 kelereng, satu diambil secara acak. Ditanyakan peluang yang terambil bukan oranye.\n2. Langkah 2, Rencanakan: cari banyak bagian, lalu besar satu bagian, lalu banyak kelereng oranye, lalu peluangnya.\n3. Langkah 3, Hitung: banyak bagian adalah $2 + 3 + 5 = 10$, jadi satu bagian adalah $40 \\div 10 = 4$ kelereng. Oranye ada 3 bagian, $3 \\times 4 = 12$ kelereng, sehingga $40 - 12 = 28$ kelereng bukan oranye.\n4. Langkah 4, Hitung: $P(\\text{bukan oranye}) = \\frac{28}{40} = \\frac{7}{10}$.\n5. Langkah 5, Periksa: $P(\\text{oranye}) = \\frac{12}{40} = \\frac{3}{10}$, dan $\\frac{3}{10} + \\frac{7}{10} = 1$. Cocok!\n\n**Ingat:**\n\n- Tulis setiap jawaban kecil beserta apa yang dihitungnya.\n- Jawaban kecil yang terakhir belum tentu yang ditanyakan, jadi periksa apa yang diminta soal.\n- Peluang suatu kejadian dan peluang "bukan kejadian itu" jumlahnya 1.`,
              ),
              figure: {
                ...barModel([
                  {
                    segs: [
                      { w: 4, text: '4', color: 'a' },
                      { w: 4, text: '4', color: 'a' },
                      { w: 4, text: '4', color: 'b' },
                      { w: 4, text: '4', color: 'b' },
                      { w: 4, text: '4', color: 'b' },
                      { w: 4, text: '4', color: 'c' },
                      { w: 4, text: '4', color: 'c' },
                      { w: 4, text: '4', color: 'c' },
                      { w: 4, text: '4', color: 'c' },
                      { w: 4, text: '4', color: 'c' },
                    ],
                    brace: '40',
                  },
                ]),
                caption: L(
                  'One part is 4 marbles. The 3 orange parts are the 12 orange marbles. The other 7 parts (28 marbles) are not orange.',
                  'Satu bagian adalah 4 kelereng. Tiga bagian oranye adalah 12 kelereng oranye. Tujuh bagian lainnya (28 kelereng) bukan oranye.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: What Must Be True?', 'Contoh Bertahap: Apa yang Pasti Benar?'),
              body: L(
                `Some items ask what MUST be true. That means true for every allowed value, not only for one lucky example.\n\nProblem: $a$ and $b$ are numbers and $a > b$. Is it certain that $a^2 > b^2$?\n\n1. Step 1, Understand: "must be true" means true in every case.\n2. Step 2, Plan: try a few values, including negative numbers, zero and fractions. One case that fails is enough to show that the statement is not certain.\n3. Step 3, Test: $a = 1$ and $b = -2$ give $a > b$. But $a^2 = 1$ and $b^2 = 4$, so $a^2 < b^2$. The statement fails.\n4. Step 4, Decide: it is not certain. Now compare with other statements about $a > b$.\n\n| Statement | Always true? | Why |\n| --- | --- | --- |\n| $a + 3 > b + 3$ | yes | Adding the same number keeps the order. |\n| $2a > 2b$ | yes | Multiplying by a positive number keeps the order. |\n| $-2a > -2b$ | no | Multiplying by a negative number reverses the order. |\n| $a^2 > b^2$ | no | $a = 1$, $b = -2$ is a counter-example. |`,
                `Beberapa soal menanyakan apa yang PASTI benar. Artinya benar untuk setiap nilai yang diperbolehkan, bukan hanya untuk satu contoh yang kebetulan cocok.\n\nSoal: $a$ dan $b$ adalah bilangan dan $a > b$. Apakah pasti $a^2 > b^2$?\n\n1. Langkah 1, Pahami: "pasti benar" berarti benar pada setiap kasus.\n2. Langkah 2, Rencanakan: coba beberapa nilai, termasuk bilangan negatif, nol, dan pecahan. Satu kasus yang gagal sudah cukup untuk menunjukkan bahwa pernyataan itu tidak pasti.\n3. Langkah 3, Uji: $a = 1$ dan $b = -2$ memenuhi $a > b$. Tetapi $a^2 = 1$ dan $b^2 = 4$, jadi $a^2 < b^2$. Pernyataannya gagal.\n4. Langkah 4, Putuskan: pernyataan itu tidak pasti. Sekarang bandingkan dengan pernyataan lain tentang $a > b$.\n\n| Pernyataan | Selalu benar? | Alasan |\n| --- | --- | --- |\n| $a + 3 > b + 3$ | ya | Menambah bilangan yang sama tidak mengubah urutan. |\n| $2a > 2b$ | ya | Mengalikan dengan bilangan positif tidak mengubah urutan. |\n| $-2a > -2b$ | tidak | Mengalikan dengan bilangan negatif membalik urutan. |\n| $a^2 > b^2$ | tidak | $a = 1$, $b = -2$ adalah contoh penyangkal. |`,
              ),
              figure: {
                ...numberLine({
                  from: -5,
                  to: 5,
                  step: 1,
                  marks: [{ at: -2, color: 'b', label: 'b' }, { at: 1, color: 'a', label: 'a' }],
                }),
                caption: L(
                  'Here $a = 1$ is to the right of $b = -2$, so $a > b$. But $b$ is farther from 0, so $b^2$ is bigger than $a^2$.',
                  'Di sini $a = 1$ berada di kanan $b = -2$, jadi $a > b$. Tetapi $b$ lebih jauh dari 0, jadi $b^2$ lebih besar daripada $a^2$.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: Finding a Pattern', 'Contoh Bertahap: Mencari Pola'),
              body: L(
                `Citra makes squares in a row from matchsticks. One square needs 4 sticks, two squares in a row need 7 sticks, and three squares need 10 sticks. How many squares can she make with exactly 100 sticks?\n\n1. Step 1: write the numbers: 4, 7, 10.\n2. Step 2: find the jump, $7 - 4 = 3$ and $10 - 7 = 3$. Each new square adds 3 sticks, because it shares one side with the square before it. The rule is $U_n = 4 + (n - 1) \\times 3 = 3n + 1$.\n3. Step 3: put the 100 sticks into the rule: $3n + 1 = 100$, so $3n = 99$ and $n = 33$.\n4. Step 4: check the rule on a case you know and test the answer. For 3 squares, $3 \\times 3 + 1 = 10$. For 33 squares, $3 \\times 33 + 1 = 100$.\n\n**Remember:**\n\n- A pattern with the same jump $b$ each time has the rule $U_n = a + (n - 1)b$.\n- The rule is also a function of $n$, so you can ask "for which $n$?" by solving an equation.\n- The number of the term must be a whole number.`,
                `Citra menyusun persegi berjajar dari batang korek api. Satu persegi memerlukan 4 batang, dua persegi berjajar memerlukan 7 batang, dan tiga persegi memerlukan 10 batang. Berapa persegi yang bisa ia susun dengan tepat 100 batang?\n\n1. Langkah 1: tulis bilangannya: 4, 7, 10.\n2. Langkah 2: cari loncatannya, $7 - 4 = 3$ dan $10 - 7 = 3$. Setiap persegi baru menambah 3 batang, karena satu sisinya dipakai bersama dengan persegi sebelumnya. Aturannya $U_n = 4 + (n - 1) \\times 3 = 3n + 1$.\n3. Langkah 3: masukkan 100 batang ke aturan: $3n + 1 = 100$, jadi $3n = 99$ dan $n = 33$.\n4. Langkah 4: uji aturan pada kasus yang kamu tahu dan uji jawabannya. Untuk 3 persegi, $3 \\times 3 + 1 = 10$. Untuk 33 persegi, $3 \\times 33 + 1 = 100$.\n\n**Ingat:**\n\n- Pola dengan loncatan $b$ yang sama setiap kali mempunyai aturan $U_n = a + (n - 1)b$.\n- Aturan itu juga fungsi dari $n$, jadi kamu bisa bertanya "untuk $n$ berapa?" dengan menyelesaikan persamaan.\n- Nomor suku harus bilangan bulat.`,
              ),
              figure: {
                ...sticks(4),
                caption: L(
                  'Four squares in a row. The first square has 4 sticks, and each new square adds 3 sticks of a new colour.',
                  'Empat persegi berjajar. Persegi pertama 4 batang, dan setiap persegi baru menambah 3 batang dengan warna baru.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c5',
              title: L('Watch Out!: Mixed-Topic Traps', 'Awas, Jebakan!: Jebakan Soal Campuran'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| $P(\\text{not orange}) = \\frac{3}{10}$. | $\\frac{3}{10}$ is the probability of orange. "Not orange" is the rest: $1 - \\frac{3}{10} = \\frac{7}{10}$. |\n| Ratio $2 : 3 : 5$ with 40 marbles, so one part is $40 \\div 3$. | Divide by all the parts together, $2 + 3 + 5 = 10$. |\n| The statement works for $a = 5$ and $b = 2$, so it must be true. | One example never proves "must be true". Try negative numbers, zero and fractions to look for a counter-example. |`,
                `| Salah | Benar |\n| --- | --- |\n| $P(\\text{bukan oranye}) = \\frac{3}{10}$. | $\\frac{3}{10}$ adalah peluang oranye. "Bukan oranye" adalah sisanya: $1 - \\frac{3}{10} = \\frac{7}{10}$. |\n| Perbandingan $2 : 3 : 5$ dengan 40 kelereng, jadi satu bagian $40 \\div 3$. | Bagi dengan semua bagian bersama-sama, $2 + 3 + 5 = 10$. |\n| Pernyataan itu berlaku untuk $a = 5$ dan $b = 2$, jadi pasti benar. | Satu contoh tidak pernah membuktikan "pasti benar". Coba bilangan negatif, nol, dan pecahan untuk mencari contoh penyangkal. |`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bar chart shows the favourite sport of 30 students (F is futsal, B is badminton, S is swimming and V is volleyball). What fraction of the students chose badminton or volleyball?',
                'Diagram batang menunjukkan olahraga favorit 30 siswa (F adalah futsal, B adalah bulu tangkis, S adalah renang, dan V adalah bola voli). Berapa bagian siswa yang memilih bulu tangkis atau bola voli?',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'F', value: 12, color: 'a' },
                    { label: 'B', value: 8, color: 'b' },
                    { label: 'S', value: 6, color: 'c' },
                    { label: 'V', value: 4, color: 'result' },
                  ],
                  max: 12,
                  step: 2,
                }),
                caption: L('Favourite sports of 30 students.', 'Olahraga favorit 30 siswa.'),
              },
              options: [
                L('$\\frac{2}{5}$', '$\\frac{2}{5}$'),
                L('$\\frac{4}{15}$', '$\\frac{4}{15}$'),
                L('$\\frac{2}{3}$', '$\\frac{2}{3}$'),
                L('$12$', '$12$'),
              ],
              answer: 0,
              explain: L(
                'Badminton and volleyball together are $8 + 4 = 12$ students out of 30, and $\\frac{12}{30} = \\frac{2}{5}$. $\\frac{4}{15}$ is badminton alone, $\\frac{2}{3}$ compares the 12 with the 18 others instead of the 30, and 12 is a number of students, not a fraction.',
                'Bulu tangkis dan bola voli bersama-sama adalah $8 + 4 = 12$ siswa dari 30, dan $\\frac{12}{30} = \\frac{2}{5}$. $\\frac{4}{15}$ adalah bulu tangkis saja, $\\frac{2}{3}$ membandingkan 12 dengan 18 siswa lainnya, bukan dengan 30, dan 12 adalah banyak siswa, bukan pecahan.',
              ),
              hint: L(
                'Add the two bars first. A fraction of the students compares that number with ALL the students.',
                'Jumlahkan dulu kedua batang. Bagian dari siswa membandingkan bilangan itu dengan SEMUA siswa.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a bag holds red, white and green balls in the ratio $1 : 3 : 4$, 48 balls in all. How many balls are white?',
                'Coba bersama: sebuah kantong berisi bola merah, putih, dan hijau dengan perbandingan $1 : 3 : 4$, seluruhnya 48 bola. Berapa bola putih?',
              ),
              template: '1 + 3 + 4 = ___ \\qquad 48 \\div 8 = ___ \\qquad 3 \\times 6 = ___',
              blanks: ['8', '6', '18'],
              explain: L(
                'There are $1 + 3 + 4 = 8$ parts, so one part is $48 \\div 8 = 6$ balls. White is 3 parts, $3 \\times 6 = 18$ balls.',
                'Ada $1 + 3 + 4 = 8$ bagian, jadi satu bagian adalah $48 \\div 8 = 6$ bola. Putih ada 3 bagian, $3 \\times 6 = 18$ bola.',
              ),
              hint: L(
                'Add the ratio numbers to get the number of parts. Then find one part, and then 3 parts.',
                'Jumlahkan bilangan perbandingan untuk mendapat banyak bagian. Lalu cari satu bagian, kemudian 3 bagian.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The perimeter of this triangle is 38 cm. The sides are $x$, $x + 3$ and $2x - 1$ (in cm). What is the length of the longest side?',
                'Keliling segitiga ini 38 cm. Panjang sisinya $x$, $x + 3$, dan $2x - 1$ (dalam cm). Berapa panjang sisi terpanjang?',
              ),
              figure: {
                ...shape({ pts: [[0, 0], [17, 0], [10.35, 6.07]], sides: ['2x-1', 'x', 'x+3'] }),
                caption: L('A triangle with sides x, x + 3 and 2x − 1.', 'Sebuah segitiga dengan sisi x, x + 3, dan 2x − 1.'),
              },
              options: [
                L('17 cm', '17 cm'),
                L('9 cm', '9 cm'),
                L('12 cm', '12 cm'),
                L('19 cm', '19 cm'),
              ],
              answer: 0,
              explain: L(
                'The perimeter gives $x + (x + 3) + (2x - 1) = 4x + 2 = 38$, so $4x = 36$ and $x = 9$. The sides are 9, 12 and $2 \\times 9 - 1 = 17$ cm. 9 is only $x$, 12 is the middle side, and 19 comes from $2x + 1$.',
                'Kelilingnya memberi $x + (x + 3) + (2x - 1) = 4x + 2 = 38$, jadi $4x = 36$ dan $x = 9$. Sisinya 9, 12, dan $2 \\times 9 - 1 = 17$ cm. 9 hanya $x$, 12 adalah sisi tengah, dan 19 berasal dari $2x + 1$.',
              ),
              hint: L(
                'Add the three sides and make the sum equal to 38. Find $x$ first, then work out all three sides.',
                'Jumlahkan ketiga sisi dan samakan dengan 38. Cari $x$ dulu, lalu hitung ketiga sisinya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                '$x$ and $y$ are numbers with $x > y > 0$. Choose the THREE statements that must be true.',
                '$x$ dan $y$ adalah bilangan dengan $x > y > 0$. Pilih TIGA pernyataan yang pasti benar.',
              ),
              options: [
                L('$x - y > 0$', '$x - y > 0$'),
                L('$\\frac{x}{y} > 1$', '$\\frac{x}{y} > 1$'),
                L('$\\frac{1}{x} < \\frac{1}{y}$', '$\\frac{1}{x} < \\frac{1}{y}$'),
                L('$x + 1 < y$', '$x + 1 < y$'),
                L('$-x > -y$', '$-x > -y$'),
              ],
              answer: [0, 1, 2],
              explain: L(
                'Test with $x = 3$ and $y = 2$. $x - y = 1 > 0$, $\\frac{3}{2} > 1$ and $\\frac{1}{3} < \\frac{1}{2}$, and for positive numbers these always hold. But $x + 1 < y$ fails (4 is not less than 2), and $-x > -y$ fails ($-3$ is less than $-2$).',
                'Uji dengan $x = 3$ dan $y = 2$. $x - y = 1 > 0$, $\\frac{3}{2} > 1$, dan $\\frac{1}{3} < \\frac{1}{2}$, dan untuk bilangan positif semuanya selalu berlaku. Tetapi $x + 1 < y$ gagal (4 tidak kurang dari 2), dan $-x > -y$ gagal ($-3$ kurang dari $-2$).',
              ),
              hint: L(
                '"Must be true" means true for every pair. Try $x = 3$, $y = 2$ and then another pair, such as $x = 10$, $y = 0.5$. Check all five.',
                '"Pasti benar" berarti benar untuk setiap pasangan. Coba $x = 3$, $y = 2$ lalu pasangan lain, misalnya $x = 10$, $y = 0{,}5$. Periksa kelimanya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'The graph shows the first four terms of the sequence $5, 9, 13, 17, \\ldots$ (the points are $(n, U_n)$). Decide whether each statement is True or False.',
                'Grafik menunjukkan empat suku pertama barisan $5, 9, 13, 17, \\ldots$ (titik-titiknya $(n, U_n)$). Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...plane([0, 6], [0, 24], [
                  { t: 'dot', x: 1, y: 5, color: 'a' },
                  { t: 'dot', x: 2, y: 9, color: 'a' },
                  { t: 'dot', x: 3, y: 13, color: 'a' },
                  { t: 'dot', x: 4, y: 17, color: 'a' },
                ]),
                caption: L('The first four terms: each term is 4 more than the one before.', 'Empat suku pertama: setiap suku 4 lebih besar daripada suku sebelumnya.'),
              },
              statements: [
                L('The 10th term is 41.', 'Suku ke-10 adalah 41.'),
                L('Every term of the sequence is an odd number.', 'Setiap suku barisan itu adalah bilangan ganjil.'),
                L('The number 100 is a term of the sequence.', 'Bilangan 100 adalah suku barisan itu.'),
                L('The 20th term is 85.', 'Suku ke-20 adalah 85.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'The rule is $U_n = 5 + (n - 1) \\times 4 = 4n + 1$. $U_{10} = 41$, and $4n + 1$ is always odd because $4n$ is even. For 100, $4n + 1 = 100$ gives $n = 24.75$, which is not a whole number. And $U_{20} = 81$, not 85.',
                'Aturannya $U_n = 5 + (n - 1) \\times 4 = 4n + 1$. $U_{10} = 41$, dan $4n + 1$ selalu ganjil karena $4n$ genap. Untuk 100, $4n + 1 = 100$ memberi $n = 24{,}75$, yang bukan bilangan bulat. Dan $U_{20} = 81$, bukan 85.',
              ),
              hint: L(
                'First find the rule for $U_n$. Then judge each statement alone: put in the number, or solve for $n$.',
                'Pertama cari aturan $U_n$. Lalu nilai tiap pernyataan sendiri-sendiri: masukkan bilangannya, atau selesaikan untuk $n$.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A class has 32 students. The ratio of boys to girls is $3 : 5$. The mean score of the boys is 72, and the mean score of all 32 students is 77. What is the mean score of the girls?',
                'Sebuah kelas terdiri dari 32 siswa. Perbandingan siswa laki-laki dan perempuan adalah $3 : 5$. Rata-rata nilai siswa laki-laki 72, dan rata-rata nilai seluruh 32 siswa 77. Berapa rata-rata nilai siswa perempuan?',
              ),
              blanks: [{ answer: 80 }],
              hints: [
                L(
                  'Split the problem into small questions. First: how many boys and how many girls are there?',
                  'Pecah soal menjadi pertanyaan kecil. Pertama: ada berapa siswa laki-laki dan berapa siswa perempuan?',
                ),
                L(
                  'The mean times the number of students gives the total score. Find the total score of everybody and of the boys.',
                  'Rata-rata kali banyak siswa memberi jumlah nilai. Cari jumlah nilai semua siswa dan jumlah nilai siswa laki-laki.',
                ),
                L(
                  'The girls\' total score is (total of all) minus (total of the boys). Divide it by the number of girls.',
                  'Jumlah nilai siswa perempuan adalah (jumlah semua) dikurangi (jumlah siswa laki-laki). Bagi dengan banyak siswa perempuan.',
                ),
              ],
              explain: L(
                'There are $3 + 5 = 8$ parts of 4 students, so 12 boys and 20 girls. All students scored $32 \\times 77 = 2\\,464$ and the boys scored $12 \\times 72 = 864$, so the girls scored $2\\,464 - 864 = 1\\,600$. Their mean is $1\\,600 \\div 20 = 80$.',
                'Ada $3 + 5 = 8$ bagian yang masing-masing 4 siswa, jadi 12 laki-laki dan 20 perempuan. Seluruh siswa mendapat $32 \\times 77 = 2\\,464$ dan siswa laki-laki mendapat $12 \\times 72 = 864$, jadi siswa perempuan mendapat $2\\,464 - 864 = 1\\,600$. Rata-ratanya $1\\,600 \\div 20 = 80$.',
              ),
              solution: {
                en: [
                  '32 \\div 8 = 4,\\quad 3 \\times 4 = 12 \\text{ boys},\\quad 5 \\times 4 = 20 \\text{ girls}',
                  '32 \\times 77 = 2\\,464,\\quad 12 \\times 72 = 864',
                  '2\\,464 - 864 = 1\\,600',
                  '1\\,600 \\div 20 = 80',
                ],
                id: [
                  '32 \\div 8 = 4,\\quad 3 \\times 4 = 12 \\text{ laki-laki},\\quad 5 \\times 4 = 20 \\text{ perempuan}',
                  '32 \\times 77 = 2\\,464,\\quad 12 \\times 72 = 864',
                  '2\\,464 - 864 = 1\\,600',
                  '1\\,600 \\div 20 = 80',
                ],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m8-s1-p',
        runtime: 'math',
        title: L('Project: Plan, Calculate, Check', 'Proyek: Rencanakan, Hitung, Periksa'),
        brief: L(
          'Four word problems that need a plan, from easy to a real reasoning puzzle. Use working backwards, an equation, a bar model or small questions.',
          'Empat soal cerita yang memerlukan rencana, dari yang mudah sampai teka-teki bernalar. Pakai berpikir mundur, persamaan, model batang, atau pertanyaan-pertanyaan kecil.',
        ),
        requirements: [
          L('Use the four steps and a strategy for each word problem.', 'Memakai empat langkah dan satu strategi untuk setiap soal cerita.'),
          L('Break a mixed-topic problem into small questions.', 'Memecah soal lintas topik menjadi pertanyaan-pertanyaan kecil.'),
        ],
        tasks: [
          {
            prompt: L(
              'Eko thinks of a number. He multiplies it by 4 and then subtracts 6. The result is 30. What number did Eko think of?',
              'Eko memikirkan sebuah bilangan. Ia mengalikannya dengan 4 lalu mengurangi 6. Hasilnya 30. Bilangan berapa yang Eko pikirkan?',
            ),
            blanks: [{ answer: 9 }],
            solution: {
              en: [
                '30 + 6 = 36 \\text{ (undo the subtraction)}',
                '36 \\div 4 = 9 \\text{ (undo the multiplication)}',
                '9 \\times 4 - 6 = 30',
              ],
              id: [
                '30 + 6 = 36 \\text{ (batalkan pengurangan)}',
                '36 \\div 4 = 9 \\text{ (batalkan perkalian)}',
                '9 \\times 4 - 6 = 30',
              ],
            },
          },
          {
            prompt: L(
              'An online shop charges a shipping fee of Rp12,000 plus Rp8,000 for each kilogram. Siti paid Rp68,000 for shipping. How many kilograms was her parcel?',
              'Sebuah toko daring menetapkan ongkos kirim Rp12.000 ditambah Rp8.000 untuk setiap kilogram. Siti membayar ongkos kirim Rp68.000. Berapa kilogram paket Siti?',
            ),
            blanks: [{ answer: 7, after: '\\text{ kg}' }],
            solution: [
              '12\\,000 + 8\\,000x = 68\\,000',
              '8\\,000x = 56\\,000',
              'x = 7',
            ],
          },
          {
            prompt: L(
              'Two numbers are in the ratio $4 : 7$ and they differ by 36. What is the larger number?',
              'Dua bilangan berperbandingan $4 : 7$ dan selisihnya 36. Berapa bilangan yang lebih besar?',
            ),
            blanks: [{ answer: 84 }],
            solution: {
              en: [
                '7 - 4 = 3 \\text{ parts} = 36',
                '1 \\text{ part} = 36 \\div 3 = 12',
                '7 \\times 12 = 84',
              ],
              id: [
                '7 - 4 = 3 \\text{ bagian} = 36',
                '1 \\text{ bagian} = 36 \\div 3 = 12',
                '7 \\times 12 = 84',
              ],
            },
          },
          {
            prompt: L(
              'The length of a rectangle is 3 times its width. If the length is decreased by 4 cm and the width is increased by 4 cm, the rectangle becomes a square. What is the perimeter of the original rectangle?',
              'Panjang sebuah persegi panjang adalah 3 kali lebarnya. Jika panjangnya dikurangi 4 cm dan lebarnya ditambah 4 cm, persegi panjang itu menjadi persegi. Berapa keliling persegi panjang semula?',
            ),
            figure: {
              ...shape({ pts: rectPts(0, 0, 9, 3), sides: ['3w', 'w'], rights: [0, 1, 2, 3] }),
              caption: L('The original rectangle: width w and length 3w.', 'Persegi panjang semula: lebar w dan panjang 3w.'),
            },
            blanks: [{ answer: 32, after: '\\text{ cm}' }],
            solution: {
              en: [
                'w \\text{ cm wide},\\quad 3w \\text{ cm long}',
                '3w - 4 = w + 4',
                '2w = 8,\\quad w = 4,\\quad 3w = 12',
                '2(4 + 12) = 32 \\text{ cm}',
              ],
              id: [
                'w \\text{ cm lebar},\\quad 3w \\text{ cm panjang}',
                '3w - 4 = w + 4',
                '2w = 8,\\quad w = 4,\\quad 3w = 12',
                '2(4 + 12) = 32 \\text{ cm}',
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
            'When a story ends with the result and asks about the start, work backwards and undo every step. When there is an unknown amount, say "let $x$ be ..." and write an equation.',
            'Kalau cerita berakhir dengan hasil dan menanyakan awalnya, berpikir mundur dan batalkan setiap langkah. Kalau ada jumlah yang dicari, tulis "misalkan $x$ adalah ..." lalu buat persamaan.',
          ),
          L(
            'For the last task, let $w$ be the width. Write the length of the square from the length side and from the width side, and make them equal.',
            'Untuk soal terakhir, misalkan $w$ adalah lebar. Tulis sisi persegi dari sisi panjang dan dari sisi lebar, lalu samakan keduanya.',
          ),
        ],
        xp: 50,
      },
    },

    /* ======================================================================== S2: question formats */
    {
      id: 'tka-smp-m8-s2',
      title: L('TKA Question Formats', 'Bentuk Soal TKA'),
      summary: L(
        'How to read one-answer questions, choose-all questions and True/False tables, and how to use your 75 minutes well.',
        'Cara membaca soal satu jawaban, soal pilih semua yang benar, dan tabel Benar/Salah, serta cara memakai waktu 75 menitmu dengan baik.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-smp-m8-s2-l1',
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
                `The TKA uses three kinds of questions. Look at what each one asks you to do.\n\n| Kind | What you do | How it is marked |\n| --- | --- | --- |\n| One answer | Choose the one correct option. | Right or wrong. |\n| Choose all that apply | Choose every correct option. There can be 1, 2 or 3 of them. | All the correct options and none that are wrong, or no points. |\n| True or False | Mark each statement True or False. | Every statement must be right. |\n\nRead like a detective. Circle the question word (how many, which, NOT, only, most), underline the units, and look at the picture, its title and its scale before you read the options.\n\nIn the line chart, the dots are the data and the numbers at the side are the scale. Read the scale, not only how high a dot looks.`,
                `TKA memakai tiga jenis soal. Lihat apa yang diminta oleh masing-masing.\n\n| Jenis | Yang kamu lakukan | Cara menilainya |\n| --- | --- | --- |\n| Satu jawaban | Pilih satu pilihan yang benar. | Benar atau salah. |\n| Pilih semua yang benar | Pilih setiap pilihan yang benar. Bisa ada 1, 2, atau 3. | Semua pilihan benar terpilih dan tidak ada yang salah, kalau tidak, tidak ada nilai. |\n| Benar atau Salah | Tandai tiap pernyataan Benar atau Salah. | Setiap pernyataan harus tepat. |\n\nBacalah seperti detektif. Lingkari kata tanya (berapa, manakah, BUKAN, hanya, paling), garis bawahi satuannya, dan lihat gambar, judul, serta skalanya sebelum membaca pilihan.\n\nPada diagram garis, titik-titik adalah datanya dan angka di samping adalah skalanya. Baca skalanya, jangan hanya melihat setinggi apa letak titiknya.`,
              ),
              figure: {
                ...lineChart({
                  points: [
                    { label: '1', value: 20 },
                    { label: '2', value: 28 },
                    { label: '3', value: 24 },
                    { label: '4', value: 36 },
                  ],
                  max: 40,
                  step: 10,
                  showValues: false,
                }),
                caption: L(
                  'Books borrowed from the school library in weeks 1 to 4. The scale goes up in tens.',
                  'Buku yang dipinjam dari perpustakaan sekolah pada minggu ke-1 sampai ke-4. Skalanya naik sepuluh-sepuluh.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: One Answer, by Elimination', 'Contoh Bertahap: Satu Jawaban dengan Eliminasi'),
              body: L(
                `Which of these numbers is irrational? The options are $\\sqrt{16}$, $0.25$, $\\sqrt{20}$ and $\\frac{22}{7}$.\n\n1. Step 1: read the question word. An irrational number cannot be written as a fraction of two integers, and its decimal never ends or repeats.\n2. Step 2: simplify each option. $\\sqrt{16} = 4$, $0.25 = \\frac{1}{4}$, and $\\frac{22}{7}$ is already a fraction.\n3. Step 3: cross out the options that are clearly rational. $4$, $\\frac{1}{4}$ and $\\frac{22}{7}$ are all fractions of integers.\n4. Step 4: check the option that is left. $4^2 = 16$ and $5^2 = 25$, so $\\sqrt{20}$ lies between 4 and 5 and is not a whole number. 20 is not a perfect square, so $\\sqrt{20}$ is irrational.\n\n**Remember:**\n\n- Cross out options you know are wrong, instead of only looking for the right one.\n- Even when one option is left, check it against the question.\n- $\\frac{22}{7}$ is only close to $\\pi$. It is a fraction itself, so it is rational.`,
                `Manakah di antara bilangan berikut yang irasional? Pilihannya $\\sqrt{16}$, $0{,}25$, $\\sqrt{20}$, dan $\\frac{22}{7}$.\n\n1. Langkah 1: baca kata tanyanya. Bilangan irasional tidak dapat ditulis sebagai pecahan dua bilangan bulat, dan desimalnya tidak berakhir dan tidak berulang.\n2. Langkah 2: sederhanakan setiap pilihan. $\\sqrt{16} = 4$, $0{,}25 = \\frac{1}{4}$, dan $\\frac{22}{7}$ sudah berupa pecahan.\n3. Langkah 3: coret pilihan yang jelas rasional. $4$, $\\frac{1}{4}$, dan $\\frac{22}{7}$ semuanya pecahan dari bilangan bulat.\n4. Langkah 4: periksa pilihan yang tersisa. $4^2 = 16$ dan $5^2 = 25$, jadi $\\sqrt{20}$ terletak di antara 4 dan 5 dan bukan bilangan bulat. 20 bukan kuadrat sempurna, jadi $\\sqrt{20}$ irasional.\n\n**Ingat:**\n\n- Coret pilihan yang kamu tahu salah, jangan hanya mencari yang benar.\n- Walaupun tinggal satu pilihan, periksa dengan pertanyaannya.\n- $\\frac{22}{7}$ hanya dekat dengan $\\pi$. Ia sendiri pecahan, jadi rasional.`,
              ),
              figure: {
                ...numberLine({
                  from: 3,
                  to: 5,
                  step: 0.5,
                  marks: [{ at: 4, color: 'b' }, { at: 4.4721, color: 'result' }, { at: 5, color: 'b' }],
                }),
                caption: L(
                  'The red dot is the square root of 20. It lies between the whole numbers 4 and 5 (orange dots), but it is not one of them.',
                  'Titik merah adalah akar kuadrat dari 20. Letaknya di antara bilangan bulat 4 dan 5 (titik oranye), tetapi ia bukan salah satunya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Choose All That Apply', 'Contoh Bertahap: Pilih Semua yang Benar'),
              body: L(
                `Choose all the equations that have $x = 4$ as a solution. The options are $2x + 1 = 9$, $3x - 2 = 10$, $\\frac{x}{2} + 3 = 5$, $5x = 24$ and $x - 7 = 3$.\n\n1. Step 1: read the instruction. "Choose all" means there may be 1, 2 or 3 correct options. You must tick every correct option and no wrong one.\n2. Step 2: choose a method. Put $x = 4$ into the left side of each equation and compare it with the right side.\n3. Step 3: check the options one by one, and write a tick or a cross next to each, as in the table.\n4. Step 4: count the ticks. There are three, so tick exactly those three options.\n\n| Equation | Left side when $x = 4$ | Right side | Is $x = 4$ a solution? |\n| --- | --- | --- | --- |\n| $2x + 1 = 9$ | 9 | 9 | yes |\n| $3x - 2 = 10$ | 10 | 10 | yes |\n| $\\frac{x}{2} + 3 = 5$ | 5 | 5 | yes |\n| $5x = 24$ | 20 | 24 | no |\n| $x - 7 = 3$ | $-3$ | 3 | no |\n\n**Remember:** there is no partial credit. Do not stop at the first correct option. Check every option.`,
                `Pilih semua persamaan yang mempunyai $x = 4$ sebagai penyelesaian. Pilihannya $2x + 1 = 9$, $3x - 2 = 10$, $\\frac{x}{2} + 3 = 5$, $5x = 24$, dan $x - 7 = 3$.\n\n1. Langkah 1: baca perintahnya. "Pilih semua" berarti mungkin ada 1, 2, atau 3 pilihan yang benar. Kamu harus memilih setiap pilihan yang benar dan tidak ada yang salah.\n2. Langkah 2: pilih cara. Masukkan $x = 4$ ke ruas kiri setiap persamaan dan bandingkan dengan ruas kanan.\n3. Langkah 3: periksa pilihan satu per satu, dan tulis tanda centang atau silang di sebelah masing-masing, seperti pada tabel.\n4. Langkah 4: hitung centangnya. Ada tiga, jadi pilih tepat ketiga pilihan itu.\n\n| Persamaan | Ruas kiri saat $x = 4$ | Ruas kanan | Apakah $x = 4$ penyelesaian? |\n| --- | --- | --- | --- |\n| $2x + 1 = 9$ | 9 | 9 | ya |\n| $3x - 2 = 10$ | 10 | 10 | ya |\n| $\\frac{x}{2} + 3 = 5$ | 5 | 5 | ya |\n| $5x = 24$ | 20 | 24 | tidak |\n| $x - 7 = 3$ | $-3$ | 3 | tidak |\n\n**Ingat:** tidak ada nilai sebagian. Jangan berhenti pada pilihan benar yang pertama. Periksa setiap pilihan.`,
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
              prompt: L('Which of these is NOT a prime factor of 90?', 'Manakah di antara berikut yang BUKAN faktor prima dari 90?'),
              options: [
                L('9', '9'),
                L('2', '2'),
                L('3', '3'),
                L('5', '5'),
              ],
              answer: 0,
              explain: L(
                'The word NOT turns the question around. $90 = 2 \\times 3^2 \\times 5$, so the prime factors are 2, 3 and 5. The number 9 divides 90, but it is not prime ($9 = 3 \\times 3$).',
                'Kata BUKAN membalik pertanyaan. $90 = 2 \\times 3^2 \\times 5$, jadi faktor primanya 2, 3, dan 5. Bilangan 9 membagi 90, tetapi bukan bilangan prima ($9 = 3 \\times 3$).',
              ),
              hint: L(
                'Write 90 as a product of primes. Which option is not in that list?',
                'Tulis 90 sebagai hasil kali bilangan prima. Pilihan mana yang tidak ada dalam daftar itu?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: is $\\sqrt{20}$ rational? First find the squares of 4 and 5.',
                'Coba bersama: apakah $\\sqrt{20}$ rasional? Pertama cari kuadrat dari 4 dan 5.',
              ),
              template: '4^2 = ___ \\qquad 5^2 = ___',
              blanks: ['16', '25'],
              explain: L(
                '$4^2 = 16$ and $5^2 = 25$. Since 20 is between 16 and 25, $\\sqrt{20}$ is between 4 and 5. It is not a whole number and 20 is not a perfect square, so $\\sqrt{20}$ is irrational.',
                '$4^2 = 16$ dan $5^2 = 25$. Karena 20 berada di antara 16 dan 25, $\\sqrt{20}$ berada di antara 4 dan 5. Ia bukan bilangan bulat dan 20 bukan kuadrat sempurna, jadi $\\sqrt{20}$ irasional.',
              ),
              hint: L(
                'Multiply each number by itself.',
                'Kalikan setiap bilangan dengan dirinya sendiri.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L('What is the length of the hypotenuse of this right triangle?', 'Berapa panjang sisi miring segitiga siku-siku ini?'),
              figure: {
                ...shape({ pts: [[0, 0], [12, 0], [0, 9]], sides: ['12 cm', '?', '9 cm'], rights: [0] }),
                caption: L('A right triangle. The two sides next to the right angle are 12 cm and 9 cm.', 'Sebuah segitiga siku-siku. Dua sisi di samping sudut siku-siku adalah 12 cm dan 9 cm.'),
              },
              options: [
                L('15 cm', '15 cm'),
                L('21 cm', '21 cm'),
                L('225 cm', '225 cm'),
                L('$\\sqrt{63}$ cm', '$\\sqrt{63}$ cm'),
              ],
              answer: 0,
              explain: L(
                '$c^2 = 12^2 + 9^2 = 144 + 81 = 225$, so $c = 15$. 21 adds the two sides, 225 forgets the square root, and $\\sqrt{63}$ subtracts instead of adding.',
                '$c^2 = 12^2 + 9^2 = 144 + 81 = 225$, jadi $c = 15$. 21 menjumlahkan kedua sisi, 225 lupa akar kuadrat, dan $\\sqrt{63}$ mengurangi, bukan menjumlahkan.',
              ),
              hint: L(
                'The hypotenuse is the longest side. Use $c^2 = a^2 + b^2$, and do not forget the last step.',
                'Sisi miring adalah sisi terpanjang. Pakai $c^2 = a^2 + b^2$, dan jangan lupa langkah terakhir.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'In a class election 200 students voted. The pie chart shows the percent of the votes for each candidate. How many students voted for Citra or Dewi?',
                'Dalam pemilihan ketua kelas, 200 siswa memberikan suara. Diagram lingkaran menunjukkan persen suara untuk tiap calon. Berapa siswa yang memilih Citra atau Dewi?',
              ),
              figure: {
                ...pieChart({
                  slices: [
                    { label: 'Ani', value: 40, color: 'a' },
                    { label: 'Budi', value: 25, color: 'b' },
                    { label: 'Citra', value: 20, color: 'c' },
                    { label: 'Dewi', value: 15, color: 'result' },
                  ],
                  unit: '%',
                }),
                caption: L('Percent of the 200 votes for each candidate.', 'Persen dari 200 suara untuk tiap calon.'),
              },
              options: [
                L('70', '70'),
                L('35', '35'),
                L('130', '130'),
                L('15', '15'),
              ],
              answer: 0,
              explain: L(
                'Citra and Dewi together got $20\\% + 15\\% = 35\\%$ of the votes, and $35\\% \\text{ of } 200 = 70$. The answer 35 is the percent, not a number of students, and 130 is the number of votes for Ani and Budi.',
                'Citra dan Dewi bersama-sama mendapat $20\\% + 15\\% = 35\\%$ suara, dan $35\\% \\text{ dari } 200 = 70$. Jawaban 35 adalah persennya, bukan banyak siswa, dan 130 adalah banyak suara untuk Ani dan Budi.',
              ),
              hint: L(
                'Add the two percents first. Then find that percent of 200. Remember that the question asks for a number of students.',
                'Jumlahkan dulu kedua persen itu. Lalu cari persen tersebut dari 200. Ingat bahwa yang ditanya adalah banyak siswa.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the THREE numbers that are equal to 0.0045.', 'Pilih TIGA bilangan yang sama dengan 0,0045.'),
              options: [
                L('$4.5 \\times 10^{-3}$', '$4{,}5 \\times 10^{-3}$'),
                L('$45 \\times 10^{-4}$', '$45 \\times 10^{-4}$'),
                L('$0.45\\%$', '$0{,}45\\%$'),
                L('$4.5 \\times 10^{-2}$', '$4{,}5 \\times 10^{-2}$'),
                L('$4.5 \\times 10^{3}$', '$4{,}5 \\times 10^{3}$'),
              ],
              answer: [0, 1, 2],
              explain: L(
                '$4.5 \\times 10^{-3} = 0.0045$, and $45 \\times 10^{-4}$ also gives 0.0045. $0.45\\% = \\frac{0.45}{100} = 0.0045$. But $4.5 \\times 10^{-2} = 0.045$ is ten times too big, and $4.5 \\times 10^{3} = 4\\,500$.',
                '$4{,}5 \\times 10^{-3} = 0{,}0045$, dan $45 \\times 10^{-4}$ juga memberi 0,0045. $0{,}45\\% = \\frac{0{,}45}{100} = 0{,}0045$. Tetapi $4{,}5 \\times 10^{-2} = 0{,}045$ sepuluh kali terlalu besar, dan $4{,}5 \\times 10^{3} = 4\\,500$.',
              ),
              hint: L(
                'Write every option as an ordinary decimal. A negative exponent moves the decimal point to the left. Check all five.',
                'Tulis setiap pilihan sebagai desimal biasa. Eksponen negatif menggeser koma ke kiri. Periksa kelima-limanya.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc2',
              prompt: L('Choose the THREE values of $x$ that satisfy $3x - 4 < 11$.', 'Pilih TIGA nilai $x$ yang memenuhi $3x - 4 < 11$.'),
              options: [
                L('$x = 4$', '$x = 4$'),
                L('$x = 0$', '$x = 0$'),
                L('$x = -3$', '$x = -3$'),
                L('$x = 5$', '$x = 5$'),
                L('$x = 6$', '$x = 6$'),
              ],
              answer: [0, 1, 2],
              explain: L(
                'Solve it: $3x < 15$, so $x < 5$. The values 4, 0 and $-3$ are all less than 5. The value 5 is not less than 5 ($3 \\times 5 - 4 = 11$, and 11 is not less than 11), and 6 is bigger.',
                'Selesaikan: $3x < 15$, jadi $x < 5$. Nilai 4, 0, dan $-3$ semuanya kurang dari 5. Nilai 5 tidak kurang dari 5 ($3 \\times 5 - 4 = 11$, dan 11 tidak kurang dari 11), dan 6 lebih besar.',
              ),
              hint: L(
                'Solve the inequality first, then check each value. Watch out for the value on the boundary.',
                'Selesaikan dulu pertidaksamaannya, lalu periksa setiap nilai. Hati-hati dengan nilai yang tepat di batas.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc3',
              prompt: L(
                'This cylinder has radius 7 cm and height 10 cm. Use $\\pi = \\frac{22}{7}$. Choose all the true statements.',
                'Tabung ini berjari-jari 7 cm dan tinggi 10 cm. Pakai $\\pi = \\frac{22}{7}$. Pilih semua pernyataan yang benar.',
              ),
              figure: {
                ...cylinder2d({ r: 3, h: 5, labels: { r: '7', h: '10' } }),
                caption: L('A cylinder. The radius is 7 cm and the height is 10 cm.', 'Sebuah tabung. Jari-jarinya 7 cm dan tingginya 10 cm.'),
              },
              options: [
                L('The area of the base is $154\\text{ cm}^2$.', 'Luas alasnya $154\\text{ cm}^2$.'),
                L('The volume is $1\\,540\\text{ cm}^3$.', 'Volumenya $1\\,540\\text{ cm}^3$.'),
                L('The volume is $490\\text{ cm}^3$.', 'Volumenya $490\\text{ cm}^3$.'),
                L('The volume is $4\\,620\\text{ cm}^3$.', 'Volumenya $4\\,620\\text{ cm}^3$.'),
              ],
              answer: [0, 1],
              explain: L(
                'The base is a circle: $\\frac{22}{7} \\times 7^2 = 154$ cm². The volume is base times height, $154 \\times 10 = 1\\,540$ cm³. 490 forgets $\\pi$ ($7^2 \\times 10$), and 4,620 is three times too big.',
                'Alasnya lingkaran: $\\frac{22}{7} \\times 7^2 = 154$ cm². Volumenya luas alas kali tinggi, $154 \\times 10 = 1\\,540$ cm³. 490 lupa $\\pi$ ($7^2 \\times 10$), dan 4.620 tiga kali terlalu besar.',
              ),
              hint: L(
                'Find the area of the circular base first. Then multiply by the height. Check each statement on its own.',
                'Cari dulu luas alas yang berbentuk lingkaran. Lalu kalikan dengan tinggi. Periksa setiap pernyataan satu per satu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'On a map with scale $1 : 250\\,000$, two towns are 6.4 cm apart. What is the real distance between the towns?',
                'Pada sebuah peta berskala $1 : 250\\,000$, dua kota berjarak 6,4 cm. Berapa jarak sebenarnya kedua kota itu?',
              ),
              blanks: [{ answer: 16, after: '\\text{ km}' }],
              hints: [
                L(
                  'Underline what is asked, and in which unit the answer must be.',
                  'Garis bawahi yang ditanyakan, dan dalam satuan apa jawabannya.',
                ),
                L(
                  'The scale says that 1 cm on the map is 250,000 cm in real life. First find the real distance in cm.',
                  'Skala itu berarti 1 cm pada peta adalah 250.000 cm pada kenyataan. Pertama cari jarak sebenarnya dalam cm.',
                ),
                L(
                  'Work out $6.4 \\times 250\\,000$ in cm. Then change cm to km: 1 km = 100,000 cm.',
                  'Hitung $6{,}4 \\times 250\\,000$ dalam cm. Lalu ubah cm ke km: 1 km = 100.000 cm.',
                ),
              ],
              explain: L(
                '$6.4 \\times 250\\,000 = 1\\,600\\,000$ cm. Since 1 km = 100,000 cm, that is 16 km. A quick check: 6 cm is about 6 quarters of a million cm, which is about 1.5 million cm, so about 15 km.',
                '$6{,}4 \\times 250\\,000 = 1\\,600\\,000$ cm. Karena 1 km = 100.000 cm, itu 16 km. Pemeriksaan cepat: 6 cm kira-kira 6 kali seperempat juta cm, yaitu sekitar 1,5 juta cm, jadi sekitar 15 km.',
              ),
              solution: {
                en: ['6.4 \\times 250\\,000 = 1\\,600\\,000 \\text{ cm}', '1\\,600\\,000 \\div 100\\,000 = 16 \\text{ km}'],
                id: ['6{,}4 \\times 250\\,000 = 1\\,600\\,000 \\text{ cm}', '1\\,600\\,000 \\div 100\\,000 = 16 \\text{ km}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-smp-m8-s2-l2',
          title: L('True/False Statements and Managing Your Time', 'Pernyataan Benar/Salah dan Mengatur Waktu'),
          goal: L(
            'You can judge each statement on its own, check units, signs and the question word, and plan your time during the test.',
            'Kamu bisa menilai setiap pernyataan satu per satu, memeriksa satuan, tanda, dan kata tanya, serta merencanakan waktumu selama tes.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: True or False, One by One', 'Ayo Amati: Benar atau Salah, Satu per Satu'),
              body: L(
                `Here is a True/False item about the graph of the function $f(x) = 2x + 1$. Each statement is a small question of its own.\n\n| Statement | True or False? |\n| --- | --- |\n| $f(0) = 1$ | True |\n| $f(3) = 7$ | True |\n| $f(2) = 4$ | False |\n| $f(x) = 5$ when $x = 3$ | False |\n\nHere two statements are True and two are False, but that is only this example. In a real item, all of them can be True, or all can be False. **Judge every statement on its own** and never guess a pattern.`,
                `Ini soal Benar/Salah tentang grafik fungsi $f(x) = 2x + 1$. Setiap pernyataan adalah pertanyaan kecil tersendiri.\n\n| Pernyataan | Benar atau Salah? |\n| --- | --- |\n| $f(0) = 1$ | Benar |\n| $f(3) = 7$ | Benar |\n| $f(2) = 4$ | Salah |\n| $f(x) = 5$ saat $x = 3$ | Salah |\n\nDi sini dua pernyataan Benar dan dua Salah, tetapi itu hanya contoh ini. Pada soal sebenarnya, semuanya bisa Benar, atau semuanya bisa Salah. **Nilai setiap pernyataan satu per satu** dan jangan menebak pola.`,
              ),
              figure: {
                ...plane([-3, 5], [-3, 11], [
                  { t: 'curve', f: '2*x+1', color: 'a' },
                  { t: 'dot', x: 0, y: 1, color: 'result' },
                  { t: 'dot', x: 2, y: 5, color: 'result' },
                ]),
                caption: L('The graph of f(x) = 2x + 1. The red dots show f(0) = 1 and f(2) = 5.', 'Grafik f(x) = 2x + 1. Titik merah menunjukkan f(0) = 1 dan f(2) = 5.'),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Judging One Statement', 'Contoh Bertahap: Menilai Satu Pernyataan'),
              body: L(
                `Look at one statement at a time. Here is a statement about the data 4, 7, 9, 12: "The mean is 9".\n\n1. Step 1: read the statement slowly and find the claim. Is the mean of 4, 7, 9 and 12 equal to 9?\n2. Step 2: calculate. The sum is $4 + 7 + 9 + 12 = 32$ and $32 \\div 4 = 8$.\n3. Step 3: compare. The mean is 8, not 9, so the claim is wrong. The answer is False.\n4. Step 4: mark it and move on to the next statement. Do not let this answer decide the next one.\n\n**Remember:** here are four statements judged in this way.\n\n| Statement | Check | Answer |\n| --- | --- | --- |\n| $2^{-3} = -8$ | $2^{-3} = \\frac{1}{2^3} = \\frac{1}{8}$ | False |\n| If $3x + 1 = 13$ then $x = 4$ | $3 \\times 4 + 1 = 13$ | True |\n| The mean of 4, 7, 9, 12 is 9 | $32 \\div 4 = 8$ | False |\n| A triangle with sides 5, 12 and 13 is a right triangle | $5^2 + 12^2 = 169 = 13^2$ | True |`,
                `Lihat satu pernyataan pada satu waktu. Ini sebuah pernyataan tentang data 4, 7, 9, 12: "Rata-ratanya 9".\n\n1. Langkah 1: baca pernyataan pelan-pelan dan cari klaimnya. Apakah rata-rata 4, 7, 9, dan 12 sama dengan 9?\n2. Langkah 2: hitung. Jumlahnya $4 + 7 + 9 + 12 = 32$ dan $32 \\div 4 = 8$.\n3. Langkah 3: bandingkan. Rata-ratanya 8, bukan 9, jadi klaimnya salah. Jawabannya Salah.\n4. Langkah 4: tandai dan lanjut ke pernyataan berikutnya. Jangan biarkan jawaban ini menentukan jawaban berikutnya.\n\n**Ingat:** ini empat pernyataan yang dinilai dengan cara itu.\n\n| Pernyataan | Pemeriksaan | Jawaban |\n| --- | --- | --- |\n| $2^{-3} = -8$ | $2^{-3} = \\frac{1}{2^3} = \\frac{1}{8}$ | Salah |\n| Jika $3x + 1 = 13$ maka $x = 4$ | $3 \\times 4 + 1 = 13$ | Benar |\n| Rata-rata 4, 7, 9, 12 adalah 9 | $32 \\div 4 = 8$ | Salah |\n| Segitiga dengan sisi 5, 12, dan 13 adalah segitiga siku-siku | $5^2 + 12^2 = 169 = 13^2$ | Benar |`,
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 14,
                  step: 1,
                  marks: [{ at: 4, color: 'b' }, { at: 7, color: 'b' }, { at: 9, color: 'b' }, { at: 12, color: 'b' }, { at: 8, color: 'result' }],
                }),
                caption: L(
                  'The four data values (orange dots) and their mean 8 (red dot). The mean is not 9.',
                  'Keempat data (titik oranye) dan rata-ratanya 8 (titik merah). Rata-ratanya bukan 9.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Planning Your Time', 'Contoh Bertahap: Merencanakan Waktu'),
              body: L(
                `The TKA has about 30 to 40 items in about 75 minutes. Let us make a time plan for a test with 35 items.\n\n1. Step 1: count. There are 35 items and 75 minutes.\n2. Step 2: keep 5 minutes at the end for checking. $75 - 5 = 70$ minutes to answer.\n3. Step 3: time for each item, $70 \\div 35 = 2$ minutes. So aim for about 2 minutes per item.\n4. Step 4: make a check-point. After 30 minutes you should be at about item 15 ($30 \\div 2$).\n5. Step 5: if one item takes more than about 3 minutes, mark it, skip it and come back later.\n\n**Remember:**\n\n- Round 1: answer the items you can do quickly. The easy items come first, so do not rush them, but do not slow down either.\n- Round 2: go back to the items you skipped, and the reasoning items that need more time.\n- Last minutes: check your answers and make sure no item is empty.`,
                `TKA terdiri dari sekitar 30 sampai 40 soal dalam sekitar 75 menit. Mari kita buat rencana waktu untuk tes dengan 35 soal.\n\n1. Langkah 1: hitung. Ada 35 soal dan 75 menit.\n2. Langkah 2: sisakan 5 menit di akhir untuk memeriksa. $75 - 5 = 70$ menit untuk menjawab.\n3. Langkah 3: waktu tiap soal, $70 \\div 35 = 2$ menit. Jadi usahakan sekitar 2 menit per soal.\n4. Langkah 4: buat titik periksa. Setelah 30 menit kamu seharusnya sudah di soal nomor 15 ($30 \\div 2$).\n5. Langkah 5: kalau satu soal memakan lebih dari sekitar 3 menit, tandai, lewati, dan kembali lagi nanti.\n\n**Ingat:**\n\n- Putaran 1: jawab soal yang bisa kamu kerjakan dengan cepat. Soal mudah ada di awal, jadi jangan terburu-buru, tetapi jangan juga terlalu lambat.\n- Putaran 2: kembali ke soal yang kamu lewati, dan soal bernalar yang memerlukan waktu lebih lama.\n- Menit terakhir: periksa jawabanmu dan pastikan tidak ada soal yang kosong.`,
              ),
              figure: {
                ...numberLine({ from: 0, to: 75, step: 5, labelEvery: 3, shade: [0, 70], marks: [{ at: 30, color: 'b' }, { at: 70, color: 'result' }] }),
                caption: L(
                  'The 75 minutes. The green part (70 minutes) is for answering. The orange dot at minute 30 is the check-point, and the last 5 minutes are for checking.',
                  'Waktu 75 menit. Bagian hijau (70 menit) untuk menjawab. Titik oranye di menit ke-30 adalah titik periksa, dan 5 menit terakhir untuk memeriksa.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Statements, Time and Nerves', 'Awas, Jebakan!: Pernyataan, Waktu, dan Rasa Gugup'),
              body: L(
                `| Wrong | Right |\n| --- | --- |\n| Stay 10 minutes on one hard item. | Mark it, skip it and come back. Every item is worth the same. |\n| Leave an item empty because you are not sure. | Always choose your best answer before time is up. |\n| "The last two statements were True, so this one must be False." | Every statement is separate. There is no pattern to follow. |\n| Compare numbers and ignore the unit, the sign or the question word. | Check the unit (cm or m?), the sign (+ or −?) and the question word (how many MORE?) before you mark. |\n\nCalm-test habits:\n\n- Breathe slowly before you start, and again when you feel stuck.\n- Read each question twice and circle words like NOT and only.\n- Do not watch how fast other students finish.`,
                `| Salah | Benar |\n| --- | --- |\n| Bertahan 10 menit pada satu soal sulit. | Tandai, lewati, dan kembali lagi. Setiap soal nilainya sama. |\n| Mengosongkan soal karena tidak yakin. | Selalu pilih jawaban terbaikmu sebelum waktu habis. |\n| "Dua pernyataan terakhir Benar, jadi yang ini pasti Salah." | Setiap pernyataan terpisah. Tidak ada pola yang bisa diikuti. |\n| Membandingkan angka dan mengabaikan satuan, tanda, atau kata tanya. | Periksa satuan (cm atau m?), tanda (+ atau −?), dan kata tanya (berapa LEBIH banyak?) sebelum menandai. |\n\nKebiasaan tenang saat tes:\n\n- Tarik napas pelan-pelan sebelum mulai, dan lagi saat kamu merasa buntu.\n- Baca setiap soal dua kali dan lingkari kata seperti BUKAN dan hanya.\n- Jangan memperhatikan seberapa cepat siswa lain selesai.`,
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A test has 40 items in 75 minutes. Dewi keeps 5 minutes at the end for checking. On average, about how long can she spend on each item?',
                'Sebuah tes terdiri dari 40 soal dalam 75 menit. Dewi menyisakan 5 menit di akhir untuk memeriksa. Rata-rata, kira-kira berapa lama ia bisa memakai waktu untuk tiap soal?',
              ),
              figure: {
                ...numberLine({ from: 0, to: 75, step: 15, marks: [{ at: 70, color: 'a' }, { at: 75, color: 'result' }] }),
                caption: L(
                  'The 75 minutes of the test. The 5 minutes between the green dot (minute 70) and the red dot (minute 75) are kept for checking.',
                  'Waktu tes 75 menit. 5 menit antara titik hijau (menit ke-70) dan titik merah (menit ke-75) disisakan untuk memeriksa.',
                ),
              },
              options: [
                L('1.75 minutes', '1,75 menit'),
                L('1.9 minutes', '1,9 menit'),
                L('3.5 minutes', '3,5 menit'),
                L('1.5 minutes', '1,5 menit'),
              ],
              answer: 0,
              explain: L(
                'She has $75 - 5 = 70$ minutes to answer, and $70 \\div 40 = 1.75$ minutes, which is 1 minute 45 seconds. The answer 1.9 forgets the checking time ($75 \\div 40 = 1.875$), and the others do not come from dividing the answering time by the number of items.',
                'Ia punya $75 - 5 = 70$ menit untuk menjawab, dan $70 \\div 40 = 1{,}75$ menit, yaitu 1 menit 45 detik. Jawaban 1,9 melupakan waktu memeriksa ($75 \\div 40 = 1{,}875$), dan yang lain tidak berasal dari membagi waktu menjawab dengan banyak soal.',
              ),
              hint: L(
                'First take the checking time away from the 75 minutes. Then share what is left between the 40 items.',
                'Pertama kurangi 75 menit dengan waktu memeriksa. Lalu bagi sisanya untuk 40 soal.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a test has 35 items and 75 minutes. Keep 5 minutes for checking. How many minutes can you use for each item?',
                'Coba bersama: sebuah tes terdiri dari 35 soal dan 75 menit. Sisakan 5 menit untuk memeriksa. Berapa menit yang bisa kamu pakai untuk tiap soal?',
              ),
              template: '75 - 5 = ___ \\qquad 70 \\div 35 = ___',
              blanks: ['70', '2'],
              explain: L(
                'You have $75 - 5 = 70$ minutes to answer, so each item gets $70 \\div 35 = 2$ minutes.',
                'Kamu punya $75 - 5 = 70$ menit untuk menjawab, jadi tiap soal mendapat $70 \\div 35 = 2$ menit.',
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
                L(
                  'If an item takes more than about 3 minutes, it is a good idea to mark it, skip it and come back later.',
                  'Kalau satu soal memakan lebih dari sekitar 3 menit, sebaiknya tandai, lewati, dan kembali lagi nanti.',
                ),
                L(
                  'In a True/False table, if the first two statements are True, the third must be False.',
                  'Dalam tabel Benar/Salah, kalau dua pernyataan pertama Benar, pernyataan ketiga pasti Salah.',
                ),
                L(
                  'If you are not sure about an item, it is better to leave it empty.',
                  'Kalau tidak yakin pada suatu soal, lebih baik membiarkannya kosong.',
                ),
                L(
                  'Reading each question twice and circling words such as NOT and only is a good habit.',
                  'Membaca setiap soal dua kali dan melingkari kata seperti BUKAN dan hanya adalah kebiasaan yang baik.',
                ),
              ],
              answer: [true, false, false, true],
              explain: L(
                'Skipping a slow item and returning keeps your pace. Each statement is separate, so there is no pattern. An empty item can never earn points, so choose your best answer. Circling the question words stops careless mistakes.',
                'Melewati soal yang lambat lalu kembali menjaga kecepatanmu. Setiap pernyataan terpisah, jadi tidak ada pola. Soal kosong tidak pernah mendapat nilai, jadi pilih jawaban terbaikmu. Melingkari kata tanya mencegah kesalahan karena kurang teliti.',
              ),
              hint: L(
                'Go back to this lesson: what did it say about slow items, about patterns between statements, about unsure items and about reading questions?',
                'Kembali ke pelajaran ini: apa katanya tentang soal yang lambat, pola antarpernyataan, soal yang tidak yakin, dan cara membaca soal?',
              ),
            },
            {
              kind: 'judge',
              id: 'j2',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$5.2 \\times 10^{-4} = 0.00052$', '$5{,}2 \\times 10^{-4} = 0{,}00052$'),
                L('$\\sqrt{45}$ is between 6 and 7.', '$\\sqrt{45}$ berada di antara 6 dan 7.'),
                L('$72 = 2^2 \\times 3^3$', '$72 = 2^2 \\times 3^3$'),
                L('The GCF (FPB) of 24 and 36 is 12.', 'FPB dari 24 dan 36 adalah 12.'),
              ],
              answer: [true, true, false, true],
              explain: L(
                '$10^{-4}$ moves the decimal point 4 places left: 0.00052. $6^2 = 36 < 45 < 49 = 7^2$. But $2^2 \\times 3^3 = 4 \\times 27 = 108$; the prime factorisation of 72 is $2^3 \\times 3^2$. And $24 = 2^3 \\times 3$, $36 = 2^2 \\times 3^2$, so the GCF is $2^2 \\times 3 = 12$.',
                '$10^{-4}$ menggeser koma 4 tempat ke kiri: 0,00052. $6^2 = 36 < 45 < 49 = 7^2$. Tetapi $2^2 \\times 3^3 = 4 \\times 27 = 108$; faktorisasi prima 72 adalah $2^3 \\times 3^2$. Dan $24 = 2^3 \\times 3$, $36 = 2^2 \\times 3^2$, jadi FPB-nya $2^2 \\times 3 = 12$.',
              ),
              hint: L(
                'Check each statement alone: move the decimal point, square 6 and 7, multiply out the primes, and factorise 24 and 36.',
                'Periksa tiap pernyataan sendiri-sendiri: geser koma, kuadratkan 6 dan 7, kalikan faktor primanya, dan faktorkan 24 dan 36.',
              ),
            },
            {
              kind: 'judge',
              id: 'j3',
              prompt: L(
                'The graph is of the function $f(x) = -x + 4$. Decide whether each statement is True or False.',
                'Grafik berikut adalah grafik fungsi $f(x) = -x + 4$. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...plane([-3, 7], [-3, 7], [
                  { t: 'curve', f: '-x+4', color: 'a' },
                  { t: 'dot', x: 0, y: 4, color: 'result' },
                  { t: 'dot', x: 4, y: 0, color: 'result' },
                ]),
                caption: L('The graph of f(x) = −x + 4. It crosses the axes at (0, 4) and (4, 0).', 'Grafik f(x) = −x + 4. Grafik memotong sumbu di (0, 4) dan (4, 0).'),
              },
              statements: [
                L('$f(1) = 4$', '$f(1) = 4$'),
                L('$f(-1) = 3$', '$f(-1) = 3$'),
                L('The graph passes through the point $(2, 1)$.', 'Grafik melalui titik $(2, 1)$.'),
                L('$f(x) = 0$ when $x = -4$.', '$f(x) = 0$ saat $x = -4$.'),
              ],
              answer: [false, false, false, false],
              explain: L(
                '$f(1) = -1 + 4 = 3$, not 4. $f(-1) = 1 + 4 = 5$, not 3. At $x = 2$ the graph is at $f(2) = 2$, not 1. And $f(x) = 0$ when $-x + 4 = 0$, which is $x = 4$, not $-4$. Here all four statements are False, which is allowed.',
                '$f(1) = -1 + 4 = 3$, bukan 4. $f(-1) = 1 + 4 = 5$, bukan 3. Pada $x = 2$ grafik berada di $f(2) = 2$, bukan 1. Dan $f(x) = 0$ saat $-x + 4 = 0$, yaitu $x = 4$, bukan $-4$. Di sini keempat pernyataan Salah, dan itu diperbolehkan.',
              ),
              hint: L(
                'Do not look for a pattern. Put each number into $f(x) = -x + 4$ and compare it with the claim, and read the graph too.',
                'Jangan mencari pola. Masukkan tiap bilangan ke $f(x) = -x + 4$ dan bandingkan dengan klaimnya, dan baca juga grafiknya.',
              ),
            },
            {
              kind: 'judge',
              id: 'j4',
              prompt: L(
                'In the picture the two horizontal lines are parallel. The angle marked 65 is 65 degrees. Decide whether each statement is True or False.',
                'Pada gambar kedua garis mendatar sejajar. Sudut yang bertanda 65 besarnya 65 derajat. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...parallelLines({ deg: 65, labels: ['65', 'b', undefined, undefined, 'c', undefined, undefined, 'd'] }),
                caption: L('Two parallel lines cut by a transversal. The angles are 65, b, c and d.', 'Dua garis sejajar dipotong oleh sebuah garis lain. Besar sudutnya 65, b, c, dan d.'),
              },
              statements: [
                L('Angle $c$ is $65^\\circ$.', 'Sudut $c$ besarnya $65^\\circ$.'),
                L('Angle $d$ is $65^\\circ$.', 'Sudut $d$ besarnya $65^\\circ$.'),
                L('Angle $b$ is $115^\\circ$.', 'Sudut $b$ besarnya $115^\\circ$.'),
                L('Angle $b$ and angle $c$ add up to $180^\\circ$.', 'Sudut $b$ dan sudut $c$ jumlahnya $180^\\circ$.'),
              ],
              answer: [true, false, true, true],
              explain: L(
                'Angle $c$ is in the same position as the $65^\\circ$ angle, so they are corresponding and equal. Angle $b$ is on a straight line with the $65^\\circ$ angle, so $b = 180^\\circ - 65^\\circ = 115^\\circ$. Angle $d$ is on a straight line with $c$, so it is also $115^\\circ$, not $65^\\circ$. And $115^\\circ + 65^\\circ = 180^\\circ$.',
                'Sudut $c$ berada di posisi yang sama dengan sudut $65^\\circ$, jadi keduanya sehadap dan sama besar. Sudut $b$ berpelurus dengan sudut $65^\\circ$, jadi $b = 180^\\circ - 65^\\circ = 115^\\circ$. Sudut $d$ berpelurus dengan $c$, jadi juga $115^\\circ$, bukan $65^\\circ$. Dan $115^\\circ + 65^\\circ = 180^\\circ$.',
              ),
              hint: L(
                'Look for corresponding angles (same position at each line) and angles on a straight line (they add up to 180 degrees).',
                'Cari sudut sehadap (posisi sama pada tiap garis) dan sudut berpelurus (jumlahnya 180 derajat).',
              ),
            },
            {
              kind: 'judge',
              id: 'j5',
              prompt: L(
                'The bar chart shows the marks of six students, A to F: 3, 5, 5, 6, 8 and 9. Decide whether each statement is True or False.',
                'Diagram batang menunjukkan nilai enam siswa, A sampai F: 3, 5, 5, 6, 8, dan 9. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'A', value: 3, color: 'a' },
                    { label: 'B', value: 5, color: 'a' },
                    { label: 'C', value: 5, color: 'a' },
                    { label: 'D', value: 6, color: 'a' },
                    { label: 'E', value: 8, color: 'a' },
                    { label: 'F', value: 9, color: 'a' },
                  ],
                  max: 10,
                  step: 2,
                  showValues: false,
                }),
                caption: L('The marks of six students.', 'Nilai enam siswa.'),
              },
              statements: [
                L('The mean mark is 6.', 'Rata-rata nilainya 6.'),
                L('The median mark is 6.', 'Median nilainya 6.'),
                L('The mode is 5.', 'Modusnya 5.'),
                L('If the mark 9 is replaced by 15, the mean stays the same.', 'Kalau nilai 9 diganti 15, rata-ratanya tetap sama.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The sum is 36 and $36 \\div 6 = 6$. The median is the middle of the 3rd and 4th values, $\\frac{5 + 6}{2} = 5.5$, not 6. The value 5 appears most often. With 15 instead of 9, the sum is 42 and the mean is 7.',
                'Jumlahnya 36 dan $36 \\div 6 = 6$. Median adalah tengah dari data ke-3 dan ke-4, $\\frac{5 + 6}{2} = 5{,}5$, bukan 6. Nilai 5 paling sering muncul. Dengan 15 sebagai pengganti 9, jumlahnya 42 dan rata-ratanya 7.',
              ),
              hint: L(
                'Add the marks for the mean. For the median, the marks are already in order: take the middle two. For the last statement, work out the new sum.',
                'Jumlahkan nilainya untuk rata-rata. Untuk median, nilainya sudah berurutan: ambil dua nilai tengah. Untuk pernyataan terakhir, hitung jumlah yang baru.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A test has 36 items and lasts 75 minutes. Citra spends 1.5 minutes on each of the first 24 items and keeps 3 minutes at the end for checking. If she spends the same time on each of the last 12 items, how many minutes can she spend on each one?',
                'Sebuah tes terdiri dari 36 soal dan berlangsung 75 menit. Citra memakai 1,5 menit untuk tiap dari 24 soal pertama dan menyisakan 3 menit di akhir untuk memeriksa. Jika ia memakai waktu yang sama untuk tiap dari 12 soal terakhir, berapa menit yang bisa ia pakai untuk tiap soal?',
              ),
              blanks: [{ answer: 3, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
              hints: [
                L(
                  'Underline what is asked. How much time is used already, and how much is kept for checking?',
                  'Garis bawahi yang ditanyakan. Berapa waktu yang sudah terpakai, dan berapa yang disisakan untuk memeriksa?',
                ),
                L(
                  'Find the time for the first 24 items. Then take that time and the checking time away from 75 minutes.',
                  'Cari waktu untuk 24 soal pertama. Lalu kurangi 75 menit dengan waktu itu dan waktu memeriksa.',
                ),
                L(
                  'The first 24 items take $24 \\times 1.5$ minutes. Subtract it and the 3 minutes from 75, then divide what is left by 12.',
                  '24 soal pertama memakan $24 \\times 1{,}5$ menit. Kurangkan dari 75 bersama 3 menit, lalu bagi sisanya dengan 12.',
                ),
              ],
              explain: L(
                'The first 24 items take $24 \\times 1.5 = 36$ minutes. Left for the last items: $75 - 36 - 3 = 36$ minutes. So each of the 12 items gets $36 \\div 12 = 3$ minutes.',
                '24 soal pertama memakan $24 \\times 1{,}5 = 36$ menit. Tersisa untuk soal-soal terakhir: $75 - 36 - 3 = 36$ menit. Jadi tiap dari 12 soal mendapat $36 \\div 12 = 3$ menit.',
              ),
              solution: {
                en: ['24 \\times 1.5 = 36 \\text{ min}', '75 - 36 - 3 = 36 \\text{ min}', '36 \\div 12 = 3 \\text{ min}'],
                id: ['24 \\times 1{,}5 = 36 \\text{ menit}', '75 - 36 - 3 = 36 \\text{ menit}', '36 \\div 12 = 3 \\text{ menit}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m8-s2-p',
        runtime: 'math',
        title: L('Project: Test Like a Pro', 'Proyek: Mengerjakan Tes Seperti Ahli'),
        brief: L(
          'Four questions about the tricks of the test: choose-all items, True/False statements and managing time.',
          'Empat soal tentang trik tes: soal pilih semua, pernyataan Benar/Salah, dan mengatur waktu.',
        ),
        requirements: [
          L('Check every option or statement on its own.', 'Memeriksa setiap pilihan atau pernyataan satu per satu.'),
          L('Plan your time and reason about what must be true.', 'Merencanakan waktu dan bernalar tentang apa yang pasti benar.'),
        ],
        tasks: [
          {
            prompt: L(
              'A choose-all item says: "Choose all the numbers equal to 16." The options are $2^4$, $4^2$, $8 \\times 2$, $2^8$, $4 \\times 4$ and $32 \\div 4$. How many options must you tick?',
              'Sebuah soal pilih semua berbunyi: "Pilih semua bilangan yang sama dengan 16." Pilihannya $2^4$, $4^2$, $8 \\times 2$, $2^8$, $4 \\times 4$, dan $32 \\div 4$. Berapa pilihan yang harus kamu centang?',
            ),
            blanks: [{ answer: 4, after: { en: '\\text{ options}', id: '\\text{ pilihan}' } }],
            solution: {
              en: [
                '2^4 = 16,\\ 4^2 = 16,\\ 8 \\times 2 = 16,\\ 4 \\times 4 = 16',
                '2^8 = 256,\\ 32 \\div 4 = 8 \\text{ are not}',
                '\\rightarrow 4',
              ],
              id: [
                '2^4 = 16,\\ 4^2 = 16,\\ 8 \\times 2 = 16,\\ 4 \\times 4 = 16',
                '2^8 = 256,\\ 32 \\div 4 = 8 \\text{ bukan}',
                '\\rightarrow 4',
              ],
            },
          },
          {
            prompt: L(
              'How many of these four statements are True? (1) $\\frac{3}{8} = 0.375$. (2) The solution of $5x - 3 = 22$ is $x = 4$. (3) A triangle with sides 6, 8 and 10 is a right triangle. (4) The mean of 2, 4 and 9 is 5.',
              'Berapa dari empat pernyataan ini yang Benar? (1) $\\frac{3}{8} = 0{,}375$. (2) Penyelesaian $5x - 3 = 22$ adalah $x = 4$. (3) Segitiga dengan sisi 6, 8, dan 10 adalah segitiga siku-siku. (4) Rata-rata 2, 4, dan 9 adalah 5.',
            ),
            blanks: [{ answer: 3, after: { en: '\\text{ statements}', id: '\\text{ pernyataan}' } }],
            solution: {
              en: [
                '(1)\\ 3 \\div 8 = 0.375 \\rightarrow \\text{true}',
                '(2)\\ 5x = 25,\\ x = 5 \\neq 4 \\rightarrow \\text{false}',
                '(3)\\ 6^2 + 8^2 = 100 = 10^2 \\rightarrow \\text{true}',
                '(4)\\ (2 + 4 + 9) \\div 3 = 5 \\rightarrow \\text{true}',
                '3 \\text{ true}',
              ],
              id: [
                '(1)\\ 3 \\div 8 = 0{,}375 \\rightarrow \\text{benar}',
                '(2)\\ 5x = 25,\\ x = 5 \\neq 4 \\rightarrow \\text{salah}',
                '(3)\\ 6^2 + 8^2 = 100 = 10^2 \\rightarrow \\text{benar}',
                '(4)\\ (2 + 4 + 9) \\div 3 = 5 \\rightarrow \\text{benar}',
                '3 \\text{ benar}',
              ],
            },
          },
          {
            prompt: L(
              'A test has 30 items in 75 minutes. Eko plans 4 minutes for each of the 5 hardest items and 5 minutes for checking at the end. The other 25 items share the rest of the time equally. How many minutes can he spend on each of the other 25 items?',
              'Sebuah tes terdiri dari 30 soal dalam 75 menit. Eko merencanakan 4 menit untuk tiap dari 5 soal tersulit dan 5 menit untuk memeriksa di akhir. Ke-25 soal lainnya berbagi sisa waktu secara sama. Berapa menit yang bisa ia pakai untuk tiap dari 25 soal lainnya?',
            ),
            blanks: [{ answer: 2, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
            solution: {
              en: ['5 \\times 4 = 20 \\text{ min for the hardest items}', '75 - 20 - 5 = 50 \\text{ min}', '50 \\div 25 = 2 \\text{ min}'],
              id: ['5 \\times 4 = 20 \\text{ menit untuk soal tersulit}', '75 - 20 - 5 = 50 \\text{ menit}', '50 \\div 25 = 2 \\text{ menit}'],
            },
          },
          {
            prompt: L(
              '$n$ can be any whole number ($0, 1, 2, \\ldots$). How many of these statements must be true for every such $n$? (1) $n^2 > n$. (2) $n + 1$ is even. (3) $2n + 1$ is odd. (4) $n(n + 1)$ is even.',
              '$n$ dapat berupa bilangan cacah apa saja ($0, 1, 2, \\ldots$). Berapa dari pernyataan berikut yang pasti benar untuk setiap $n$ seperti itu? (1) $n^2 > n$. (2) $n + 1$ genap. (3) $2n + 1$ ganjil. (4) $n(n + 1)$ genap.',
            ),
            blanks: [{ answer: 2, after: { en: '\\text{ statements}', id: '\\text{ pernyataan}' } }],
            solution: {
              en: [
                '(1)\\ n = 0: 0^2 = 0, \\text{ not } > 0 \\rightarrow \\text{not certain}',
                '(2)\\ n = 0: 0 + 1 = 1 \\text{ is odd} \\rightarrow \\text{not certain}',
                '(3)\\ 2n \\text{ is even, so } 2n + 1 \\text{ is odd} \\rightarrow \\text{certain}',
                '(4)\\ n \\text{ and } n + 1 \\text{ are consecutive: one of them is even} \\rightarrow \\text{certain}',
                '2 \\text{ statements}',
              ],
              id: [
                '(1)\\ n = 0: 0^2 = 0, \\text{ bukan } > 0 \\rightarrow \\text{tidak pasti}',
                '(2)\\ n = 0: 0 + 1 = 1 \\text{ ganjil} \\rightarrow \\text{tidak pasti}',
                '(3)\\ 2n \\text{ genap, jadi } 2n + 1 \\text{ ganjil} \\rightarrow \\text{pasti}',
                '(4)\\ n \\text{ dan } n + 1 \\text{ berurutan: salah satunya genap} \\rightarrow \\text{pasti}',
                '2 \\text{ pernyataan}',
              ],
            },
          },
        ],
        hints: [
          L(
            'In a choose-all item, check every option separately. Work out each power or product first.',
            'Pada soal pilih semua, periksa setiap pilihan satu per satu. Hitung dulu setiap pangkat atau hasil kali.',
          ),
          L(
            'For the time task, first find the minutes that are already planned. Then share what is left.',
            'Untuk soal waktu, pertama cari menit yang sudah direncanakan. Lalu bagikan sisanya.',
          ),
          L(
            'For the last task, test each statement with $n = 0$, $n = 1$ and $n = 2$. One failing case shows that a statement is not certain.',
            'Untuk soal terakhir, uji tiap pernyataan dengan $n = 0$, $n = 1$, dan $n = 2$. Satu kasus yang gagal menunjukkan bahwa pernyataan itu tidak pasti.',
          ),
        ],
        xp: 50,
      },
    },

    /* ======================================================================== S3: practice tests */
    {
      id: 'tka-smp-m8-s3',
      title: L('Practice Tests', 'Simulasi TKA'),
      summary: L(
        'Two practice tests in the style of the TKA SMP, with questions from numbers, algebra, geometry and measurement, and data and probability, and a final try-out of typed answers.',
        'Dua simulasi bergaya TKA SMP, dengan soal dari bilangan, aljabar, geometri dan pengukuran, serta data dan peluang, dan satu try-out akhir dengan jawaban ketikan.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- Test 1 */
        {
          id: 'tka-smp-m8-s3-l1',
          title: L('Practice Test 1', 'Simulasi TKA SMP 1'),
          goal: L(
            'You can finish a practice test with a mix of question types and levels, from easy to hard, using the four steps and your time plan.',
            'Kamu bisa menyelesaikan simulasi dengan berbagai bentuk dan tingkat soal, dari yang mudah sampai yang sulit, memakai empat langkah dan rencana waktumu.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Practice Test 1 Works', 'Ayo Amati: Cara Kerja Simulasi TKA SMP 1'),
              body: L(
                `This practice test has 13 questions, like a small TKA. Plan about 2 minutes for each question, which is about 26 minutes in all. Use a timer if you can.\n\n- The questions go from easy to hard, and the last two need the most reasoning.\n- You will meet one-answer questions, choose-all questions, True/False statements and typed answers.\n- Choose-all and True/False questions need every part right, with no partial credit.\n\nA hint appears when an answer is wrong, and an explanation appears when it is right. Use the four steps, check your answers and stay calm. Good luck!`,
                `Simulasi ini terdiri dari 13 soal, seperti TKA kecil. Rencanakan sekitar 2 menit untuk tiap soal, jadi sekitar 26 menit seluruhnya. Pakai pengatur waktu kalau bisa.\n\n- Soal-soal berjalan dari mudah ke sulit, dan dua soal terakhir paling memerlukan penalaran.\n- Kamu akan bertemu soal satu jawaban, soal pilih semua, pernyataan Benar/Salah, dan jawaban ketikan.\n- Soal pilih semua dan Benar/Salah memerlukan setiap bagian benar, tanpa nilai sebagian.\n\nPetunjuk muncul kalau jawabanmu salah, dan penjelasan muncul kalau benar. Pakai empat langkah, periksa jawabanmu, dan tetap tenang. Semoga berhasil!`,
              ),
            },
            /* 1 — numbers, Memahami */
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('Which of these numbers is the greatest?', 'Manakah di antara bilangan berikut yang paling besar?'),
              options: [
                L('$\\frac{5}{8}$', '$\\frac{5}{8}$'),
                L('$0.6$', '$0{,}6$'),
                L('$62\\%$', '$62\\%$'),
                L('$\\frac{3}{5}$', '$\\frac{3}{5}$'),
              ],
              answer: 0,
              explain: L(
                'Write every option as a decimal. $\\frac{5}{8} = 0.625$, $62\\% = 0.62$, $0.6 = 0.6$ and $\\frac{3}{5} = 0.6$. The greatest is $\\frac{5}{8}$.',
                'Tulis setiap pilihan sebagai desimal. $\\frac{5}{8} = 0{,}625$, $62\\% = 0{,}62$, $0{,}6 = 0{,}6$, dan $\\frac{3}{5} = 0{,}6$. Yang terbesar adalah $\\frac{5}{8}$.',
              ),
              hint: L(
                'Change every option to a decimal before you compare them.',
                'Ubah setiap pilihan menjadi desimal sebelum membandingkannya.',
              ),
            },
            /* 2 — probability, Memahami */
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A bag holds 3 green, 5 orange and 12 red marbles. One marble is picked at random. What is the probability that it is NOT red?',
                'Sebuah kantong berisi 3 kelereng hijau, 5 kelereng oranye, dan 12 kelereng merah. Satu kelereng diambil secara acak. Berapa peluang kelereng yang terambil BUKAN merah?',
              ),
              options: [
                L('$\\frac{2}{5}$', '$\\frac{2}{5}$'),
                L('$\\frac{3}{5}$', '$\\frac{3}{5}$'),
                L('$\\frac{2}{3}$', '$\\frac{2}{3}$'),
                L('$\\frac{3}{20}$', '$\\frac{3}{20}$'),
              ],
              answer: 0,
              explain: L(
                'There are $3 + 5 + 12 = 20$ marbles, all equally likely, and $3 + 5 = 8$ of them are not red. So $P(\\text{not red}) = \\frac{8}{20} = \\frac{2}{5}$. The answer $\\frac{3}{5}$ is the probability of red, $\\frac{2}{3}$ compares the 8 marbles that are not red with the 12 red ones instead of with all 20, and $\\frac{3}{20}$ is the probability of green.',
                'Ada $3 + 5 + 12 = 20$ kelereng yang semuanya sama mungkin, dan $3 + 5 = 8$ di antaranya bukan merah. Jadi $P(\\text{bukan merah}) = \\frac{8}{20} = \\frac{2}{5}$. Jawaban $\\frac{3}{5}$ adalah peluang merah, $\\frac{2}{3}$ membandingkan 8 kelereng yang bukan merah dengan 12 kelereng merah, bukan dengan seluruh 20 kelereng, dan $\\frac{3}{20}$ adalah peluang hijau.',
              ),
              hint: L(
                'Count all the marbles first: that is the bottom of the fraction. Then count the marbles that are NOT red.',
                'Hitung dulu semua kelereng: itulah penyebut pecahan. Lalu hitung kelereng yang BUKAN merah.',
              ),
            },
            /* 3 — algebra, Memahami */
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L('Simplify $3(2x - 4) - 2(x - 3)$.', 'Sederhanakan $3(2x - 4) - 2(x - 3)$.'),
              options: [
                L('$4x - 6$', '$4x - 6$'),
                L('$4x + 2$', '$4x + 2$'),
                L('$4x - 18$', '$4x - 18$'),
                L('$8x - 6$', '$8x - 6$'),
              ],
              answer: 0,
              explain: L(
                '$3(2x - 4) = 6x - 12$ and $-2(x - 3) = -2x + 6$, so the sum is $4x - 6$. $4x + 2$ forgets to multiply the $-4$ by 3, $4x - 18$ makes $-2 \\times (-3) = -6$, and $8x - 6$ forgets to change the sign of $2x$.',
                '$3(2x - 4) = 6x - 12$ dan $-2(x - 3) = -2x + 6$, jadi jumlahnya $4x - 6$. $4x + 2$ lupa mengalikan $-4$ dengan 3, $4x - 18$ menganggap $-2 \\times (-3) = -6$, dan $8x - 6$ lupa mengubah tanda $2x$.',
              ),
              hint: L(
                'Expand each bracket first. Be careful with the minus sign in front of the second bracket.',
                'Jabarkan dulu setiap kurung. Hati-hati dengan tanda minus di depan kurung kedua.',
              ),
            },
            /* 4 — geometry, Memahami */
            {
              kind: 'quiz',
              id: 'q4',
              prompt: L('What is the size of angle $x$ in this triangle?', 'Berapa besar sudut $x$ pada segitiga ini?'),
              figure: {
                ...shape({
                  pts: [[0, 0], [10, 0], [8.9, 6.23]],
                  names: 'ABC',
                  extra: [
                    { t: 'angle', at: [0, 0], from: [10, 0], to: [8.9, 6.23], label: '35' },
                    { t: 'angle', at: [10, 0], from: [0, 0], to: [8.9, 6.23], label: '80' },
                    { t: 'angle', at: [8.9, 6.23], from: [0, 0], to: [10, 0], label: 'x' },
                  ],
                }),
                caption: L('A triangle with angles of 35 and 80 degrees and an angle x at the top.', 'Sebuah segitiga dengan sudut 35 dan 80 derajat dan sudut x di puncak.'),
              },
              options: [
                L('$65^\\circ$', '$65^\\circ$'),
                L('$115^\\circ$', '$115^\\circ$'),
                L('$45^\\circ$', '$45^\\circ$'),
                L('$145^\\circ$', '$145^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'The angles of a triangle add up to $180^\\circ$. $35^\\circ + 80^\\circ = 115^\\circ$, so $x = 180^\\circ - 115^\\circ = 65^\\circ$. $115^\\circ$ is the sum of the two known angles, $45^\\circ$ is their difference, and $145^\\circ$ takes away only one angle.',
                'Jumlah sudut segitiga adalah $180^\\circ$. $35^\\circ + 80^\\circ = 115^\\circ$, jadi $x = 180^\\circ - 115^\\circ = 65^\\circ$. $115^\\circ$ adalah jumlah dua sudut yang diketahui, $45^\\circ$ adalah selisihnya, dan $145^\\circ$ hanya mengurangi satu sudut.',
              ),
              hint: L(
                'What do the three angles of any triangle add up to? Subtract the two angles you know.',
                'Berapa jumlah ketiga sudut segitiga mana pun? Kurangkan dua sudut yang kamu ketahui.',
              ),
            },
            /* 5 — algebra (relations), Memahami / Mengaplikasikan */
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'The arrow diagram shows a relation from the set on the left to the set on the right. Decide whether each statement is True or False.',
                'Diagram panah menunjukkan relasi dari himpunan di kiri ke himpunan di kanan. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...arrowDiagram({ domain: ['1', '2', '3'], codomain: ['2', '4', '6', '8'], pairs: [[0, 0], [1, 1], [2, 2]] }),
                caption: L('An arrow diagram. The left set is the domain and the right set is the codomain.', 'Sebuah diagram panah. Himpunan kiri adalah domain dan himpunan kanan adalah kodomain.'),
              },
              statements: [
                L('This relation is a function.', 'Relasi ini adalah fungsi.'),
                L('The range is $\\{2, 4, 6, 8\\}$.', 'Daerah hasilnya adalah $\\{2, 4, 6, 8\\}$.'),
                L('The domain is $\\{1, 2, 3\\}$.', 'Domainnya adalah $\\{1, 2, 3\\}$.'),
                L('The rule of the function is $f(x) = 2x$.', 'Rumus fungsinya adalah $f(x) = 2x$.'),
              ],
              answer: [true, false, true, true],
              explain: L(
                'Every member of the domain has exactly one arrow, so it is a function. The range holds only the outputs that are reached, $\\{2, 4, 6\\}$, so 8 does not belong to it (it is only in the codomain). The domain is $\\{1, 2, 3\\}$, and each output is double its input.',
                'Setiap anggota domain mempunyai tepat satu panah, jadi ini fungsi. Daerah hasil hanya berisi keluaran yang terjangkau, $\\{2, 4, 6\\}$, jadi 8 bukan anggotanya (ia hanya ada di kodomain). Domainnya $\\{1, 2, 3\\}$, dan setiap keluaran adalah dua kali masukannya.',
              ),
              hint: L(
                'Count the arrows leaving each number on the left. For the range, list only the numbers on the right that an arrow reaches.',
                'Hitung panah yang keluar dari tiap bilangan di kiri. Untuk daerah hasil, tulis hanya bilangan di kanan yang dicapai panah.',
              ),
            },
            /* 6 — numbers, Mengaplikasikan */
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Pak Joko\'s 6 workers need 15 days to build a wall. All workers work at the same speed. How many days would 9 workers need to build the same wall?',
                '6 pekerja Pak Joko memerlukan 15 hari untuk membangun sebuah tembok. Semua pekerja bekerja dengan kecepatan yang sama. Berapa hari yang diperlukan 9 pekerja untuk membangun tembok yang sama?',
              ),
              blanks: [{ answer: 10, after: { en: '\\text{ days}', id: '\\text{ hari}' } }],
              hints: [
                L(
                  'More workers means fewer days. Is this direct or inverse proportion?',
                  'Pekerja lebih banyak berarti hari lebih sedikit. Apakah ini perbandingan senilai atau berbalik nilai?',
                ),
                L(
                  'In inverse proportion the product stays the same: workers × days is the same for every team.',
                  'Pada perbandingan berbalik nilai hasil kalinya tetap: pekerja × hari sama untuk setiap tim.',
                ),
                L(
                  'Work out $6 \\times 15$, the total "worker-days" of the wall. Then divide it by 9 workers.',
                  'Hitung $6 \\times 15$, yaitu jumlah "hari-pekerja" untuk tembok itu. Lalu bagi dengan 9 pekerja.',
                ),
              ],
              explain: L(
                'The wall needs $6 \\times 15 = 90$ worker-days. With 9 workers it takes $90 \\div 9 = 10$ days. It is sensible: 9 is more workers than 6, so fewer than 15 days.',
                'Tembok itu memerlukan $6 \\times 15 = 90$ hari-pekerja. Dengan 9 pekerja diperlukan $90 \\div 9 = 10$ hari. Ini masuk akal: 9 pekerja lebih banyak daripada 6, jadi kurang dari 15 hari.',
              ),
              solution: [
                '6 \\times 15 = 90',
                '9 \\times d = 90',
                'd = 90 \\div 9 = 10',
              ],
            },
            /* 7 — geometry, Mengaplikasikan */
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The shape is a rectangle with a semicircle on one side. The lengths are in cm and $\\pi = \\frac{22}{7}$. Choose the TWO true statements.',
                'Bangun ini adalah persegi panjang dengan setengah lingkaran di salah satu sisinya. Panjangnya dalam cm dan $\\pi = \\frac{22}{7}$. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                dim: 2,
                axes: false,
                ...fit([[-1.5, -1.4], [28, 15.4]], 0.4),
                items: [
                  solid(rectPts(0, 0, 20, 14), 'a'),
                  solid(sectorPts(20, 7, 7, -90, 90), 'b'),
                  txt(10, -0.9, '20', 'md', 'muted'),
                  txt(-0.6, 7, '14', 'md', 'muted', 'end'),
                  line([20, 7], [27, 7], 'result', { width: 2.4 }),
                  txt(23.5, 7.9, '7', 'md', 'result'),
                ],
                caption: L(
                  'A rectangle 20 cm long and 14 cm wide, with a semicircle of radius 7 cm on its right side.',
                  'Sebuah persegi panjang dengan panjang 20 cm dan lebar 14 cm, dengan setengah lingkaran berjari-jari 7 cm di sisi kanannya.',
                ),
              },
              options: [
                L('The area is $357\\text{ cm}^2$.', 'Luasnya $357\\text{ cm}^2$.'),
                L('The perimeter is 76 cm.', 'Kelilingnya 76 cm.'),
                L('The area is $434\\text{ cm}^2$.', 'Luasnya $434\\text{ cm}^2$.'),
                L('The perimeter is 54 cm.', 'Kelilingnya 54 cm.'),
              ],
              answer: [0, 1],
              explain: L(
                'Area: the rectangle is $20 \\times 14 = 280$ and the semicircle is $\\frac{1}{2} \\times \\frac{22}{7} \\times 7^2 = 77$, so the total is 357 cm². Perimeter: $14 + 20 + 20$ plus the curved edge $\\frac{1}{2} \\times 2 \\times \\frac{22}{7} \\times 7 = 22$, so 76 cm. 434 adds a whole circle (154), and 54 leaves out the curved edge.',
                'Luas: persegi panjangnya $20 \\times 14 = 280$ dan setengah lingkarannya $\\frac{1}{2} \\times \\frac{22}{7} \\times 7^2 = 77$, jadi jumlahnya 357 cm². Keliling: $14 + 20 + 20$ ditambah sisi lengkung $\\frac{1}{2} \\times 2 \\times \\frac{22}{7} \\times 7 = 22$, jadi 76 cm. 434 menambahkan satu lingkaran penuh (154), dan 54 melewatkan sisi lengkungnya.',
              ),
              hint: L(
                'Split the shape into a rectangle and half a circle. For the perimeter, only the outside edge counts: the line where they join is inside.',
                'Bagi bangun menjadi persegi panjang dan setengah lingkaran. Untuk keliling, hanya sisi luar yang dihitung: garis tempat keduanya menyambung berada di dalam.',
              ),
            },
            /* 8 — algebra, Mengaplikasikan */
            {
              kind: 'quiz',
              id: 'q5',
              prompt: L('Solve $5x - 7 = 2x + 11$.', 'Selesaikan $5x - 7 = 2x + 11$.'),
              options: [
                L('$x = 6$', '$x = 6$'),
                L('$x = \\frac{4}{3}$', '$x = \\frac{4}{3}$'),
                L('$x = \\frac{4}{7}$', '$x = \\frac{4}{7}$'),
                L('$x = \\frac{18}{7}$', '$x = \\frac{18}{7}$'),
              ],
              answer: 0,
              explain: L(
                'Subtract $2x$ from both sides: $3x - 7 = 11$. Add 7 to both sides: $3x = 18$. Divide by 3: $x = 6$. $\\frac{4}{3}$ moves the 7 with the wrong sign, $\\frac{4}{7}$ adds $2x$ instead of subtracting, and $\\frac{18}{7}$ adds $2x$ to both sides by mistake.',
                'Kurangkan $2x$ pada kedua ruas: $3x - 7 = 11$. Tambahkan 7 pada kedua ruas: $3x = 18$. Bagi dengan 3: $x = 6$. $\\frac{4}{3}$ memindahkan 7 dengan tanda yang salah, $\\frac{4}{7}$ menjumlahkan $2x$, bukan mengurangkan, dan $\\frac{18}{7}$ keliru menambahkan $2x$ pada kedua ruas.',
              ),
              hint: L(
                'Collect the terms with $x$ on one side and the numbers on the other. Do the same to both sides each time.',
                'Kumpulkan suku-suku dengan $x$ di satu ruas dan bilangan di ruas lainnya. Lakukan hal yang sama pada kedua ruas setiap kali.',
              ),
            },
            /* 9 — data, Mengaplikasikan */
            {
              kind: 'multi',
              id: 'mc2',
              prompt: L(
                'The bar chart shows the marks of six students, A to F: 6, 8, 8, 10, 12 and 16. Choose the TWO true statements.',
                'Diagram batang menunjukkan nilai enam siswa, A sampai F: 6, 8, 8, 10, 12, dan 16. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: 'A', value: 6, color: 'a' },
                    { label: 'B', value: 8, color: 'a' },
                    { label: 'C', value: 8, color: 'a' },
                    { label: 'D', value: 10, color: 'a' },
                    { label: 'E', value: 12, color: 'a' },
                    { label: 'F', value: 16, color: 'a' },
                  ],
                  max: 16,
                  step: 4,
                }),
                caption: L('The marks of six students.', 'Nilai enam siswa.'),
              },
              options: [
                L('The mean is 10.', 'Rata-ratanya 10.'),
                L('The mode is 8.', 'Modusnya 8.'),
                L('The median is 10.', 'Mediannya 10.'),
                L('The range is 16.', 'Jangkauannya 16.'),
              ],
              answer: [0, 1],
              explain: L(
                'The sum is 60 and $60 \\div 6 = 10$, so the mean is 10. The mark 8 appears twice, so the mode is 8. The median is the middle of 8 and 10, which is 9, not 10. The range is $16 - 6 = 10$, not 16.',
                'Jumlahnya 60 dan $60 \\div 6 = 10$, jadi rata-ratanya 10. Nilai 8 muncul dua kali, jadi modusnya 8. Median adalah tengah dari 8 dan 10, yaitu 9, bukan 10. Jangkauannya $16 - 6 = 10$, bukan 16.',
              ),
              hint: L(
                'Work out the mean, median, mode and range one by one. The six marks are already in order.',
                'Hitung rata-rata, median, modus, dan jangkauan satu per satu. Keenam nilai sudah berurutan.',
              ),
            },
            /* 10 — geometry, Mengaplikasikan */
            {
              kind: 'judge',
              id: 'j2',
              prompt: L(
                'Triangle DEF is the image of triangle ABC after one transformation. Decide whether each statement is True or False.',
                'Segitiga DEF adalah bayangan segitiga ABC setelah satu transformasi. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...plane([-6, 6], [-2, 5], [
                  { t: 'poly', pts: [[1, 1], [4, 1], [1, 3]], color: 'a' },
                  { t: 'poly', pts: [[-1, 1], [-4, 1], [-1, 3]], color: 'b' },
                  { t: 'dot', x: 1, y: 1, label: 'A', color: 'a' },
                  { t: 'dot', x: 4, y: 1, label: 'B', color: 'a' },
                  { t: 'dot', x: 1, y: 3, label: 'C', color: 'a' },
                  { t: 'dot', x: -1, y: 1, label: 'D', color: 'b' },
                  { t: 'dot', x: -4, y: 1, label: 'E', color: 'b' },
                  { t: 'dot', x: -1, y: 3, label: 'F', color: 'b' },
                ]),
                caption: L('Triangle ABC (green) and its image DEF (orange).', 'Segitiga ABC (hijau) dan bayangannya DEF (oranye).'),
              },
              statements: [
                L('The point $E$ is $(4, -1)$.', 'Titik $E$ adalah $(4, -1)$.'),
                L('Triangle $DEF$ is congruent to triangle $ABC$.', 'Segitiga $DEF$ kongruen dengan segitiga $ABC$.'),
                L('Each point and its image are the same distance from the $y$-axis.', 'Setiap titik dan bayangannya berjarak sama dari sumbu $y$.'),
                L('Triangle $DEF$ is the image of triangle $ABC$ under a translation.', 'Segitiga $DEF$ adalah bayangan segitiga $ABC$ oleh suatu translasi.'),
              ],
              answer: [false, true, true, false],
              explain: L(
                'Read $E$ from the grid: it is $(-4, 1)$, not $(4, -1)$. A reflection keeps the size and the shape, so the two triangles are congruent. $A$ is 1 to the right of the $y$-axis and $D$ is 1 to the left, and the same holds for the other points. The image is a mirror image in the $y$-axis (a reflection), not a translation, because the triangle is flipped.',
                'Baca $E$ dari kisi: titiknya $(-4, 1)$, bukan $(4, -1)$. Pencerminan mempertahankan ukuran dan bentuk, jadi kedua segitiga kongruen. $A$ berjarak 1 di kanan sumbu $y$ dan $D$ berjarak 1 di kiri, dan hal yang sama berlaku untuk titik-titik lain. Bayangannya adalah bayangan cermin terhadap sumbu $y$ (pencerminan), bukan translasi, karena segitiganya terbalik.',
              ),
              hint: L(
                'Read the coordinates of each point from the grid. Ask: has the figure been moved, or flipped like a mirror image?',
                'Baca koordinat tiap titik dari kisi. Tanyakan: apakah bangunnya hanya digeser, atau dibalik seperti bayangan cermin?',
              ),
            },
            /* 11 — geometry, Mengaplikasikan */
            {
              kind: 'quiz',
              id: 'q6',
              prompt: L(
                'This pyramid has a square base of side 6 cm and a height of 10 cm. What is its volume?',
                'Limas ini beralas persegi dengan sisi 6 cm dan tinggi 10 cm. Berapa volumenya?',
              ),
              figure: {
                ...prism3d({ base: [[0, 0], [6, 0], [6, 6], [0, 6]], h: 10, apex: true }),
                caption: L('A pyramid with a square base of side 6 cm and a height of 10 cm.', 'Sebuah limas dengan alas persegi bersisi 6 cm dan tinggi 10 cm.'),
              },
              options: [
                L('$120\\text{ cm}^3$', '$120\\text{ cm}^3$'),
                L('$360\\text{ cm}^3$', '$360\\text{ cm}^3$'),
                L('$180\\text{ cm}^3$', '$180\\text{ cm}^3$'),
                L('$20\\text{ cm}^3$', '$20\\text{ cm}^3$'),
              ],
              answer: 0,
              explain: L(
                '$V = \\frac{1}{3} \\times \\text{base area} \\times \\text{height} = \\frac{1}{3} \\times 36 \\times 10 = 120$ cm³. 360 forgets the $\\frac{1}{3}$ (that is a prism), 180 uses $\\frac{1}{2}$, and 20 uses the side 6 instead of the base area 36.',
                '$V = \\frac{1}{3} \\times \\text{luas alas} \\times \\text{tinggi} = \\frac{1}{3} \\times 36 \\times 10 = 120$ cm³. 360 lupa $\\frac{1}{3}$ (itu volume prisma), 180 memakai $\\frac{1}{2}$, dan 20 memakai sisi 6, bukan luas alas 36.',
              ),
              hint: L(
                'Find the area of the square base first. Then use the volume formula for a pyramid: it has a fraction in front.',
                'Cari dulu luas alas persegi. Lalu pakai rumus volume limas: ada pecahan di depannya.',
              ),
            },
            /* 12 — algebra + geometry, Bernalar */
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'The length of a rectangular garden is 3 m more than twice its width, and its perimeter is 60 m. By how many square metres is the area of a square with the same perimeter larger than the area of the garden?',
                'Panjang sebuah kebun berbentuk persegi panjang adalah 3 m lebih dari dua kali lebarnya, dan kelilingnya 60 m. Luas persegi yang kelilingnya sama dengan keliling kebun itu lebih besar berapa meter persegi daripada luas kebun?',
              ),
              figure: {
                ...shape({ pts: rectPts(0, 0, 7, 3), sides: ['2w+3', 'w'], rights: [0, 1, 2, 3] }),
                caption: L('The garden: width w and length 2w + 3.', 'Kebun itu: lebar w dan panjang 2w + 3.'),
              },
              blanks: [{ answer: 36, after: '\\text{ m}^2' }],
              hints: [
                L(
                  'Plan in small questions: find the width and length of the garden, then its area, then the square, then the difference.',
                  'Rencanakan dengan pertanyaan kecil: cari lebar dan panjang kebun, lalu luasnya, lalu persegi itu, lalu selisihnya.',
                ),
                L(
                  'Let $w$ be the width. The perimeter gives $2(w + 2w + 3) = 60$. Solve for $w$.',
                  'Misalkan $w$ adalah lebar. Keliling memberi $2(w + 2w + 3) = 60$. Selesaikan untuk $w$.',
                ),
                L(
                  'Then the length is $2w + 3$ and the area is length times width. The square has side $60 \\div 4$. Subtract the two areas.',
                  'Lalu panjangnya $2w + 3$ dan luasnya panjang kali lebar. Persegi itu bersisi $60 \\div 4$. Kurangkan kedua luas itu.',
                ),
              ],
              explain: L(
                '$6w + 6 = 60$ gives $w = 9$ and the length is 21, so the garden has area $9 \\times 21 = 189$ m². The square has side $60 \\div 4 = 15$ and area $225$ m². The difference is $225 - 189 = 36$ m².',
                '$6w + 6 = 60$ memberi $w = 9$ dan panjangnya 21, jadi luas kebun $9 \\times 21 = 189$ m². Persegi itu bersisi $60 \\div 4 = 15$ dan luasnya $225$ m². Selisihnya $225 - 189 = 36$ m².',
              ),
              solution: {
                en: [
                  '2(w + 2w + 3) = 60',
                  '6w + 6 = 60,\\quad 6w = 54,\\quad w = 9',
                  '\\text{length} = 2 \\times 9 + 3 = 21,\\quad \\text{area} = 9 \\times 21 = 189',
                  '\\text{square side} = 60 \\div 4 = 15,\\quad \\text{area} = 225',
                  '225 - 189 = 36',
                ],
                id: [
                  '2(w + 2w + 3) = 60',
                  '6w + 6 = 60,\\quad 6w = 54,\\quad w = 9',
                  '\\text{panjang} = 2 \\times 9 + 3 = 21,\\quad \\text{luas} = 9 \\times 21 = 189',
                  '\\text{sisi persegi} = 60 \\div 4 = 15,\\quad \\text{luas} = 225',
                  '225 - 189 = 36',
                ],
              },
            },
            /* 13 — numbers (scale + rate), Bernalar */
            {
              kind: 'math',
              id: 'm3',
              prompt: L(
                'On a map with scale $1 : 2\\,500\\,000$, two cities are 8 cm apart. A bus drives between them at a constant 80 km/h while it is moving, and makes one stop of 30 minutes on the way. How many hours does the whole trip take?',
                'Pada sebuah peta berskala $1 : 2\\,500\\,000$, dua kota berjarak 8 cm. Sebuah bus melaju di antara keduanya dengan kecepatan tetap 80 km/jam selama bergerak, dan berhenti sekali selama 30 menit di perjalanan. Berapa jam seluruh perjalanan itu?',
              ),
              blanks: [{ answer: 3, after: { en: '\\text{ hours}', id: '\\text{ jam}' } }],
              hints: [
                L(
                  'Break it into small questions: the real distance, the driving time, and then the stop.',
                  'Pecah menjadi pertanyaan kecil: jarak sebenarnya, waktu mengemudi, lalu waktu berhenti.',
                ),
                L(
                  'Real distance = map distance × 2,500,000, in cm. Change it to km (1 km = 100,000 cm). Then time = distance ÷ speed.',
                  'Jarak sebenarnya = jarak pada peta × 2.500.000, dalam cm. Ubah ke km (1 km = 100.000 cm). Lalu waktu = jarak ÷ kecepatan.',
                ),
                L(
                  'The distance is $8 \\times 2\\,500\\,000 = 20\\,000\\,000$ cm. Convert to km, divide by 80 for the driving time, and add half an hour.',
                  'Jaraknya $8 \\times 2\\,500\\,000 = 20\\,000\\,000$ cm. Ubah ke km, bagi 80 untuk waktu mengemudi, lalu tambahkan setengah jam.',
                ),
              ],
              explain: L(
                'The real distance is $8 \\times 2\\,500\\,000 = 20\\,000\\,000$ cm $= 200$ km. Driving takes $200 \\div 80 = 2.5$ hours, and the stop adds 0.5 hours, so the trip takes 3 hours.',
                'Jarak sebenarnya $8 \\times 2\\,500\\,000 = 20\\,000\\,000$ cm $= 200$ km. Mengemudi memerlukan $200 \\div 80 = 2{,}5$ jam, dan berhenti menambah 0,5 jam, jadi perjalanan memerlukan 3 jam.',
              ),
              solution: {
                en: ['8 \\times 2\\,500\\,000 = 20\\,000\\,000 \\text{ cm} = 200 \\text{ km}', '200 \\div 80 = 2.5 \\text{ h}', '2.5 + 0.5 = 3 \\text{ h}'],
                id: ['8 \\times 2\\,500\\,000 = 20\\,000\\,000 \\text{ cm} = 200 \\text{ km}', '200 \\div 80 = 2{,}5 \\text{ jam}', '2{,}5 + 0{,}5 = 3 \\text{ jam}'],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- Test 2 */
        {
          id: 'tka-smp-m8-s3-l2',
          title: L('Practice Test 2', 'Simulasi TKA SMP 2'),
          goal: L(
            'You can finish a second practice test with new situations, from easy to hard, and keep to your time plan.',
            'Kamu bisa menyelesaikan simulasi kedua dengan situasi baru, dari yang mudah sampai yang sulit, dan tetap mengikuti rencana waktumu.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Practice Test 2 Works', 'Ayo Amati: Cara Kerja Simulasi TKA SMP 2'),
              body: L(
                `This second practice test also has 13 questions, with new situations and new numbers. Plan about 2 minutes for each question, about 26 minutes in all, and keep an eye on your check-points.\n\n- The questions go from easy to hard, and the last two are the hardest.\n- If a question takes more than about 3 minutes, mark it, skip it and come back later.\n- Choose-all and True/False questions need every part right, and the statements may all be True or all be False.\n\nA hint appears when an answer is wrong, and an explanation appears when it is right. Read each question twice, circle words like NOT and only, and check your answers. Good luck!`,
                `Simulasi kedua ini juga terdiri dari 13 soal, dengan situasi dan bilangan yang baru. Rencanakan sekitar 2 menit untuk tiap soal, jadi sekitar 26 menit seluruhnya, dan perhatikan titik-titik periksamu.\n\n- Soal-soal berjalan dari mudah ke sulit, dan dua soal terakhir paling sulit.\n- Kalau satu soal memakan lebih dari sekitar 3 menit, tandai, lewati, dan kembali lagi nanti.\n- Soal pilih semua dan Benar/Salah memerlukan setiap bagian benar, dan pernyataannya bisa semuanya Benar atau semuanya Salah.\n\nPetunjuk muncul kalau jawabanmu salah, dan penjelasan muncul kalau benar. Baca setiap soal dua kali, lingkari kata seperti BUKAN dan hanya, dan periksa jawabanmu. Semoga berhasil!`,
              ),
            },
            /* 1 — numbers, Memahami */
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('What is the value of $3^{-2}$?', 'Berapa nilai $3^{-2}$?'),
              options: [
                L('$\\frac{1}{9}$', '$\\frac{1}{9}$'),
                L('$-9$', '$-9$'),
                L('$-6$', '$-6$'),
                L('$\\frac{1}{6}$', '$\\frac{1}{6}$'),
              ],
              answer: 0,
              explain: L(
                'A negative exponent means "one over": $3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$. The answer $-9$ thinks the minus sign makes the number negative, $-6$ multiplies $3 \\times (-2)$, and $\\frac{1}{6}$ multiplies $3 \\times 2$ in the bottom.',
                'Eksponen negatif berarti "satu per": $3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$. Jawaban $-9$ mengira tanda minus membuat bilangannya negatif, $-6$ mengalikan $3 \\times (-2)$, dan $\\frac{1}{6}$ mengalikan $3 \\times 2$ di penyebut.',
              ),
              hint: L(
                'What does a negative exponent do: does it make the number negative, or does it flip it?',
                'Apa yang dilakukan eksponen negatif: membuat bilangannya negatif, atau membaliknya?',
              ),
            },
            /* 2 — data, Memahami */
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'In a school election 240 students voted. The pie chart shows the percent of the votes for each candidate. How many students voted for Budi?',
                'Dalam pemilihan di sekolah, 240 siswa memberikan suara. Diagram lingkaran menunjukkan persen suara untuk tiap calon. Berapa siswa yang memilih Budi?',
              ),
              figure: {
                ...pieChart({
                  slices: [
                    { label: 'Ani', value: 35, color: 'a' },
                    { label: 'Budi', value: 30, color: 'b' },
                    { label: 'Citra', value: 20, color: 'c' },
                    { label: 'Dewi', value: 15, color: 'result' },
                  ],
                  unit: '%',
                }),
                caption: L('Percent of the 240 votes for each candidate.', 'Persen dari 240 suara untuk tiap calon.'),
              },
              options: [
                L('72', '72'),
                L('30', '30'),
                L('84', '84'),
                L('36', '36'),
              ],
              answer: 0,
              explain: L(
                'Budi got $30\\%$ of 240 votes: $0.3 \\times 240 = 72$. The answer 30 is the percent, not a number of students, 84 is the number for Ani ($35\\%$), and 36 is the number for Dewi ($15\\%$).',
                'Budi mendapat $30\\%$ dari 240 suara: $0{,}3 \\times 240 = 72$. Jawaban 30 adalah persennya, bukan banyak siswa, 84 adalah banyak suara Ani ($35\\%$), dan 36 adalah banyak suara Dewi ($15\\%$).',
              ),
              hint: L(
                'Find Budi\'s slice in the chart. Then find that percent of 240.',
                'Cari juring Budi pada diagram. Lalu cari persen itu dari 240.',
              ),
            },
            /* 3 — algebra (sequence), Memahami */
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L('Find the 10th term of the sequence $7, 10, 13, 16, \\ldots$', 'Tentukan suku ke-10 dari barisan $7, 10, 13, 16, \\ldots$'),
              options: [
                L('34', '34'),
                L('37', '37'),
                L('31', '31'),
                L('30', '30'),
              ],
              answer: 0,
              explain: L(
                'It is arithmetic with first term 7 and difference 3, so $U_n = 7 + (n - 1) \\times 3$ and $U_{10} = 7 + 9 \\times 3 = 34$. 37 uses $10 \\times 3$ instead of $9 \\times 3$, 31 counts only 8 jumps, and 30 is just $10 \\times 3$.',
                'Ini barisan aritmetika dengan suku pertama 7 dan beda 3, jadi $U_n = 7 + (n - 1) \\times 3$ dan $U_{10} = 7 + 9 \\times 3 = 34$. 37 memakai $10 \\times 3$, bukan $9 \\times 3$, 31 hanya menghitung 8 loncatan, dan 30 hanya $10 \\times 3$.',
              ),
              hint: L(
                'Find the first term and the common difference. How many jumps are there from the 1st to the 10th term?',
                'Cari suku pertama dan bedanya. Ada berapa loncatan dari suku ke-1 ke suku ke-10?',
              ),
            },
            /* 4 — geometry, Memahami */
            {
              kind: 'quiz',
              id: 'q4',
              prompt: L(
                'In the picture the two horizontal lines are parallel and the angle marked 70 is 70 degrees. What is the size of angle $x$?',
                'Pada gambar kedua garis mendatar sejajar dan sudut yang bertanda 70 besarnya 70 derajat. Berapa besar sudut $x$?',
              ),
              figure: {
                ...parallelLines({ deg: 70, labels: ['70', undefined, undefined, undefined, undefined, undefined, undefined, 'x'] }),
                caption: L('Two parallel lines cut by a transversal. One angle is 70 degrees and another is x.', 'Dua garis sejajar dipotong oleh sebuah garis lain. Satu sudut 70 derajat dan sudut lainnya x.'),
              },
              options: [
                L('$110^\\circ$', '$110^\\circ$'),
                L('$70^\\circ$', '$70^\\circ$'),
                L('$20^\\circ$', '$20^\\circ$'),
                L('$100^\\circ$', '$100^\\circ$'),
              ],
              answer: 0,
              explain: L(
                'At the upper line, the angle in the same position as $x$ is on a straight line with the $70^\\circ$ angle, so it is $180^\\circ - 70^\\circ = 110^\\circ$. Corresponding angles are equal, so $x = 110^\\circ$. $70^\\circ$ wrongly assumes $x$ equals the marked angle, and $20^\\circ$ comes from $90^\\circ - 70^\\circ$.',
                'Pada garis atas, sudut yang posisinya sama dengan $x$ berpelurus dengan sudut $70^\\circ$, jadi besarnya $180^\\circ - 70^\\circ = 110^\\circ$. Sudut sehadap sama besar, jadi $x = 110^\\circ$. $70^\\circ$ keliru mengira $x$ sama dengan sudut yang bertanda, dan $20^\\circ$ berasal dari $90^\\circ - 70^\\circ$.',
              ),
              hint: L(
                'Is $x$ on the same side of the transversal as the 70-degree angle, or on the other side of the line? Use a straight line (180 degrees) and corresponding angles.',
                'Apakah $x$ berada pada sisi yang sama dengan sudut 70 derajat, atau di seberang garis? Pakai garis lurus (180 derajat) dan sudut sehadap.',
              ),
            },
            /* 5 — algebra, Memahami / Mengaplikasikan */
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              statements: [
                L('$5x - 2(x - 4) = 3x + 8$', '$5x - 2(x - 4) = 3x + 8$'),
                L('The solution of $4x - 9 = 15$ is $x = 6$.', 'Penyelesaian $4x - 9 = 15$ adalah $x = 6$.'),
                L('$x = -2$ satisfies the inequality $3x + 1 < -4$.', '$x = -2$ memenuhi pertidaksamaan $3x + 1 < -4$.'),
                L('The solution of $2(x - 1) = x + 5$ is $x = 7$.', 'Penyelesaian $2(x - 1) = x + 5$ adalah $x = 7$.'),
              ],
              answer: [true, true, true, true],
              explain: L(
                '$5x - 2x + 8 = 3x + 8$. $4x = 24$ gives $x = 6$. For $x = -2$: $3(-2) + 1 = -5$, and $-5 < -4$. And $2x - 2 = x + 5$ gives $x = 7$. Here all four statements are True, which is allowed.',
                '$5x - 2x + 8 = 3x + 8$. $4x = 24$ memberi $x = 6$. Untuk $x = -2$: $3(-2) + 1 = -5$, dan $-5 < -4$. Dan $2x - 2 = x + 5$ memberi $x = 7$. Di sini keempat pernyataan Benar, dan itu diperbolehkan.',
              ),
              hint: L(
                'Do not look for a pattern. Expand, solve or substitute for each statement on its own.',
                'Jangan mencari pola. Jabarkan, selesaikan, atau substitusikan untuk tiap pernyataan sendiri-sendiri.',
              ),
            },
            /* 6 — numbers, Mengaplikasikan */
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Two ropes are 84 cm and 126 cm long. They are cut into equal pieces that are as long as possible, with nothing left over. How long is each piece?',
                'Dua tali panjangnya 84 cm dan 126 cm. Keduanya dipotong menjadi potongan-potongan sama panjang yang sepanjang mungkin, tanpa sisa. Berapa panjang tiap potongan?',
              ),
              blanks: [{ answer: 42, after: '\\text{ cm}' }],
              hints: [
                L(
                  'The piece must divide both 84 and 126 exactly, and it must be as long as possible. Which idea is that: GCF or LCM?',
                  'Potongan harus membagi habis 84 dan 126, dan harus sepanjang mungkin. Itu gagasan yang mana: FPB atau KPK?',
                ),
                L(
                  'Write 84 and 126 as products of prime factors.',
                  'Tulis 84 dan 126 sebagai hasil kali faktor prima.',
                ),
                L(
                  '$84 = 2^2 \\times 3 \\times 7$ and $126 = 2 \\times 3^2 \\times 7$. Multiply the primes they share, each with the smaller power.',
                  '$84 = 2^2 \\times 3 \\times 7$ dan $126 = 2 \\times 3^2 \\times 7$. Kalikan bilangan prima yang sama-sama ada, masing-masing dengan pangkat terkecil.',
                ),
              ],
              explain: L(
                'The longest piece is the GCF (FPB) of 84 and 126. The shared primes are 2, 3 and 7, each with the smaller power, so $2 \\times 3 \\times 7 = 42$ cm. Check: $84 = 2 \\times 42$ and $126 = 3 \\times 42$.',
                'Potongan terpanjang adalah FPB dari 84 dan 126. Bilangan prima yang sama-sama ada adalah 2, 3, dan 7, masing-masing dengan pangkat terkecil, jadi $2 \\times 3 \\times 7 = 42$ cm. Periksa: $84 = 2 \\times 42$ dan $126 = 3 \\times 42$.',
              ),
              solution: {
                en: ['84 = 2^2 \\times 3 \\times 7', '126 = 2 \\times 3^2 \\times 7', '\\text{GCF} = 2 \\times 3 \\times 7 = 42', '84 \\div 42 = 2,\\quad 126 \\div 42 = 3'],
                id: ['84 = 2^2 \\times 3 \\times 7', '126 = 2 \\times 3^2 \\times 7', '\\text{FPB} = 2 \\times 3 \\times 7 = 42', '84 \\div 42 = 2,\\quad 126 \\div 42 = 3'],
              },
            },
            /* 7 — geometry, Mengaplikasikan */
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The picture shows the net of a triangular prism. The triangles have sides of 3, 4 and 5 cm, and the prism is 10 cm long. Choose the THREE true statements.',
                'Gambar menunjukkan jaring-jaring sebuah prisma segitiga. Segitiganya bersisi 3, 4, dan 5 cm, dan prisma itu panjangnya 10 cm. Pilih TIGA pernyataan yang benar.',
              ),
              figure: {
                ...triPrismNet({ a: 3, b: 4, c: 5, h: 10 }),
                caption: L('The net of a triangular prism: three rectangles in a row and two triangles.', 'Jaring-jaring prisma segitiga: tiga persegi panjang berderet dan dua segitiga.'),
              },
              options: [
                L('The solid has 5 faces.', 'Bangun ruang itu mempunyai 5 sisi.'),
                L('The volume is $60\\text{ cm}^3$.', 'Volumenya $60\\text{ cm}^3$.'),
                L('The solid has 9 edges.', 'Bangun ruang itu mempunyai 9 rusuk.'),
                L('The solid has 6 faces.', 'Bangun ruang itu mempunyai 6 sisi.'),
                L('The volume is $120\\text{ cm}^3$.', 'Volumenya $120\\text{ cm}^3$.'),
              ],
              answer: [0, 1, 2],
              explain: L(
                'The net has 3 rectangles and 2 triangles, so 5 faces, and the prism has 3 edges on each triangle plus 3 long edges, which is 9. The base is a right triangle with area $\\frac{1}{2} \\times 3 \\times 4 = 6$, so $V = 6 \\times 10 = 60$ cm³. It does not have 6 faces, and 120 forgets the $\\frac{1}{2}$ in the area of the triangle.',
                'Jaring-jaring itu terdiri dari 3 persegi panjang dan 2 segitiga, jadi 5 sisi, dan prisma itu mempunyai 3 rusuk pada tiap segitiga ditambah 3 rusuk panjang, yaitu 9. Alasnya segitiga siku-siku dengan luas $\\frac{1}{2} \\times 3 \\times 4 = 6$, jadi $V = 6 \\times 10 = 60$ cm³. Prisma itu tidak punya 6 sisi, dan 120 lupa $\\frac{1}{2}$ pada luas segitiga.',
              ),
              hint: L(
                'Count the faces in the net (rectangles and triangles). For the edges, count them on the folded prism. For the volume, find the area of the triangle first.',
                'Hitung sisi pada jaring-jaring (persegi panjang dan segitiga). Untuk rusuk, hitung pada prisma yang sudah terlipat. Untuk volume, cari dulu luas segitiganya.',
              ),
            },
            /* 8 — algebra, Mengaplikasikan */
            {
              kind: 'quiz',
              id: 'q5',
              prompt: L(
                'Ani buys 3 pens and 2 notebooks for Rp19,000. Budi buys 1 pen and 2 notebooks of the same kinds for Rp11,000. What is the price of one pen?',
                'Ani membeli 3 pulpen dan 2 buku tulis seharga Rp19.000. Budi membeli 1 pulpen dan 2 buku tulis yang sama seharga Rp11.000. Berapa harga satu pulpen?',
              ),
              options: [
                L('Rp4,000', 'Rp4.000'),
                L('Rp3,500', 'Rp3.500'),
                L('Rp8,000', 'Rp8.000'),
                L('Rp5,000', 'Rp5.000'),
              ],
              answer: 0,
              explain: L(
                'Subtract Budi\'s purchase from Ani\'s: the notebooks cancel, and 2 pens cost $19\\,000 - 11\\,000 = 8\\,000$, so one pen costs Rp4,000. Rp3,500 is the price of a notebook, Rp8,000 is the price of 2 pens, and Rp5,000 does not fit Budi\'s purchase.',
                'Kurangkan pembelian Budi dari pembelian Ani: buku tulisnya habis, dan 2 pulpen berharga $19\\,000 - 11\\,000 = 8\\,000$, jadi satu pulpen Rp4.000. Rp3.500 adalah harga sebuah buku tulis, Rp8.000 adalah harga 2 pulpen, dan Rp5.000 tidak cocok dengan pembelian Budi.',
              ),
              hint: L(
                'Write two equations with $p$ for a pen and $b$ for a notebook. Subtract one from the other so that $b$ disappears.',
                'Tulis dua persamaan dengan $p$ untuk pulpen dan $b$ untuk buku tulis. Kurangkan yang satu dari yang lain sehingga $b$ hilang.',
              ),
            },
            /* 9 — numbers, Mengaplikasikan */
            {
              kind: 'multi',
              id: 'mc2',
              prompt: L('Choose the THREE irrational numbers.', 'Pilih TIGA bilangan irasional.'),
              options: [
                L('$\\sqrt{12}$', '$\\sqrt{12}$'),
                L('$\\pi$', '$\\pi$'),
                L('$\\sqrt{50}$', '$\\sqrt{50}$'),
                L('$\\sqrt{81}$', '$\\sqrt{81}$'),
                L('$\\frac{3}{7}$', '$\\frac{3}{7}$'),
              ],
              answer: [0, 1, 2],
              explain: L(
                '12 and 50 are not perfect squares, so $\\sqrt{12}$ and $\\sqrt{50}$ are irrational, and $\\pi$ is irrational too. But $\\sqrt{81} = 9$ is a whole number, and $\\frac{3}{7}$ is a fraction (its decimal repeats), so both are rational.',
                '12 dan 50 bukan kuadrat sempurna, jadi $\\sqrt{12}$ dan $\\sqrt{50}$ irasional, dan $\\pi$ juga irasional. Tetapi $\\sqrt{81} = 9$ adalah bilangan bulat, dan $\\frac{3}{7}$ adalah pecahan (desimalnya berulang), jadi keduanya rasional.',
              ),
              hint: L(
                'A number is rational if it can be written as a fraction of integers. Simplify each root first, then check all five.',
                'Bilangan rasional jika dapat ditulis sebagai pecahan bilangan bulat. Sederhanakan dulu setiap akar, lalu periksa kelimanya.',
              ),
            },
            /* 10 — geometry, Mengaplikasikan */
            {
              kind: 'judge',
              id: 'j2',
              prompt: L(
                'The two right triangles are similar. The small one has sides 3, 4 and 5 cm and the large one has sides 6, 8 and 10 cm. Decide whether each statement is True or False.',
                'Kedua segitiga siku-siku itu sebangun. Segitiga kecil bersisi 3, 4, dan 5 cm dan segitiga besar bersisi 6, 8, dan 10 cm. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                dim: 2,
                axes: false,
                ...fit([[0, 0], [11, 8]], 0.7),
                items: [
                  solid([[0, 0], [3, 0], [0, 4]], 'a'),
                  solid([[5, 0], [11, 0], [5, 8]], 'b'),
                  { t: 'right', at: [0, 0], from: [3, 0], to: [0, 4] },
                  { t: 'right', at: [5, 0], from: [11, 0], to: [5, 8] },
                  txt(1.5, -0.6, '3', 'md', 'muted'),
                  txt(-0.5, 2, '4', 'md', 'muted', 'end'),
                  txt(8, -0.6, '6', 'md', 'muted'),
                  txt(4.5, 4, '8', 'md', 'muted', 'end'),
                ],
                caption: L('A small and a large right triangle.', 'Sebuah segitiga siku-siku kecil dan sebuah yang besar.'),
              },
              statements: [
                L('The perimeter of the large triangle is 24 cm.', 'Keliling segitiga besar adalah 24 cm.'),
                L('The area of the large triangle is 2 times the area of the small triangle.', 'Luas segitiga besar adalah 2 kali luas segitiga kecil.'),
                L('The corresponding angles of the two triangles are equal.', 'Sudut-sudut yang bersesuaian pada kedua segitiga sama besar.'),
                L('$\\frac{3}{6} = \\frac{4}{8} = \\frac{5}{10}$', '$\\frac{3}{6} = \\frac{4}{8} = \\frac{5}{10}$'),
              ],
              answer: [true, false, true, true],
              explain: L(
                '$6 + 8 + 10 = 24$. The lengths are doubled, so the areas are $2^2 = 4$ times bigger: the small area is $\\frac{1}{2} \\times 3 \\times 4 = 6$ and the large one is $\\frac{1}{2} \\times 6 \\times 8 = 24$. Similar figures have equal corresponding angles and equal ratios of corresponding sides.',
                '$6 + 8 + 10 = 24$. Panjangnya dua kali lipat, jadi luasnya $2^2 = 4$ kali lebih besar: luas yang kecil $\\frac{1}{2} \\times 3 \\times 4 = 6$ dan yang besar $\\frac{1}{2} \\times 6 \\times 8 = 24$. Bangun sebangun mempunyai sudut bersesuaian yang sama besar dan perbandingan sisi bersesuaian yang sama.',
              ),
              hint: L(
                'Find the scale factor first. Lengths grow by the scale factor, but areas grow by its square.',
                'Cari dulu faktor skalanya. Panjang bertambah sebesar faktor skala, tetapi luas bertambah sebesar kuadratnya.',
              ),
            },
            /* 11 — geometry, Mengaplikasikan */
            {
              kind: 'quiz',
              id: 'q6',
              prompt: L(
                'A ball is a sphere with radius 6 cm. What is its volume?',
                'Sebuah bola berjari-jari 6 cm. Berapa volumenya?',
              ),
              figure: {
                ...sphere2d({ r: 3, label: '6' }),
                caption: L('A sphere with radius 6 cm.', 'Sebuah bola dengan jari-jari 6 cm.'),
              },
              options: [
                L('$288\\pi\\text{ cm}^3$', '$288\\pi\\text{ cm}^3$'),
                L('$864\\pi\\text{ cm}^3$', '$864\\pi\\text{ cm}^3$'),
                L('$48\\pi\\text{ cm}^3$', '$48\\pi\\text{ cm}^3$'),
                L('$144\\pi\\text{ cm}^3$', '$144\\pi\\text{ cm}^3$'),
              ],
              answer: 0,
              explain: L(
                '$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\times 6^3 = \\frac{4}{3}\\pi \\times 216 = 288\\pi$ cm³. 864π forgets the $\\frac{1}{3}$, 48π uses $r^2$ instead of $r^3$, and 144π is half of the right volume.',
                '$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\times 6^3 = \\frac{4}{3}\\pi \\times 216 = 288\\pi$ cm³. 864π lupa $\\frac{1}{3}$, 48π memakai $r^2$, bukan $r^3$, dan 144π setengah dari volume yang benar.',
              ),
              hint: L(
                'The volume of a sphere uses the radius cubed, not squared. Work out $6^3$ first.',
                'Volume bola memakai jari-jari pangkat tiga, bukan pangkat dua. Hitung dulu $6^3$.',
              ),
            },
            /* 12 — algebra (sequence + series), Bernalar */
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'In a hall the first row has 14 seats, and every next row has 3 seats more than the row before. The last row has 59 seats. How many seats does the hall have altogether?',
                'Dalam sebuah aula, baris pertama berisi 14 kursi, dan setiap baris berikutnya berisi 3 kursi lebih banyak daripada baris sebelumnya. Baris terakhir berisi 59 kursi. Berapa kursi seluruhnya di aula itu?',
              ),
              blanks: [{ answer: 584, after: { en: '\\text{ seats}', id: '\\text{ kursi}' } }],
              hints: [
                L(
                  'Break it into two questions: how many rows are there, and what is the total number of seats?',
                  'Pecah menjadi dua pertanyaan: ada berapa baris, dan berapa jumlah seluruh kursi?',
                ),
                L(
                  'It is an arithmetic sequence with $a = 14$ and $b = 3$. Put the last term 59 into $U_n = a + (n - 1)b$ to find $n$.',
                  'Ini barisan aritmetika dengan $a = 14$ dan $b = 3$. Masukkan suku terakhir 59 ke $U_n = a + (n - 1)b$ untuk mencari $n$.',
                ),
                L(
                  'Then the total is the series $S_n = \\frac{n}{2}(a + U_n)$, with the first and the last term.',
                  'Lalu jumlah seluruhnya adalah deret $S_n = \\frac{n}{2}(a + U_n)$, dengan suku pertama dan suku terakhir.',
                ),
              ],
              explain: L(
                '$14 + (n - 1) \\times 3 = 59$ gives $(n - 1) \\times 3 = 45$, so $n = 16$ rows. The total is $S_{16} = \\frac{16}{2}(14 + 59) = 8 \\times 73 = 584$ seats.',
                '$14 + (n - 1) \\times 3 = 59$ memberi $(n - 1) \\times 3 = 45$, jadi $n = 16$ baris. Jumlah seluruhnya $S_{16} = \\frac{16}{2}(14 + 59) = 8 \\times 73 = 584$ kursi.',
              ),
              solution: [
                '14 + (n - 1) \\times 3 = 59',
                '(n - 1) \\times 3 = 45,\\quad n = 16',
                'S_{16} = \\frac{16}{2}(14 + 59)',
                'S_{16} = 8 \\times 73 = 584',
              ],
            },
            /* 13 — probability + ratio, Bernalar */
            {
              kind: 'math',
              id: 'm3',
              prompt: L(
                'A bag holds red and blue balls in the ratio $3 : 5$. After 6 more red balls are added, the probability of picking a red ball at random is exactly $\\frac{1}{2}$. How many balls were in the bag at the start?',
                'Sebuah kantong berisi bola merah dan biru dengan perbandingan $3 : 5$. Setelah 6 bola merah ditambahkan, peluang terambilnya bola merah secara acak tepat $\\frac{1}{2}$. Berapa bola di dalam kantong pada awalnya?',
              ),
              blanks: [{ answer: 24, after: { en: '\\text{ balls}', id: '\\text{ bola}' } }],
              hints: [
                L(
                  'Let the numbers of balls be $3k$ red and $5k$ blue. What does a probability of one half tell you about the red and blue balls after adding 6?',
                  'Misalkan banyak bola $3k$ merah dan $5k$ biru. Apa yang dikatakan peluang setengah tentang bola merah dan biru setelah ditambah 6?',
                ),
                L(
                  'A probability of $\\frac{1}{2}$ means there are as many red as blue balls. So $3k + 6 = 5k$.',
                  'Peluang $\\frac{1}{2}$ berarti bola merah sama banyak dengan bola biru. Jadi $3k + 6 = 5k$.',
                ),
                L(
                  'Solve $3k + 6 = 5k$ for $k$. The balls at the start are $3k + 5k = 8k$.',
                  'Selesaikan $3k + 6 = 5k$ untuk $k$. Bola pada awalnya adalah $3k + 5k = 8k$.',
                ),
              ],
              explain: L(
                'After adding, red is $3k + 6$ and blue is $5k$. A probability of $\\frac{1}{2}$ means they are equal: $3k + 6 = 5k$, so $k = 3$. At the start there were $3 \\times 3 = 9$ red and $5 \\times 3 = 15$ blue balls, which is 24 balls. Check: $15$ red and $15$ blue gives $\\frac{15}{30} = \\frac{1}{2}$.',
                'Setelah ditambah, merah $3k + 6$ dan biru $5k$. Peluang $\\frac{1}{2}$ berarti keduanya sama: $3k + 6 = 5k$, jadi $k = 3$. Pada awalnya ada $3 \\times 3 = 9$ bola merah dan $5 \\times 3 = 15$ bola biru, yaitu 24 bola. Periksa: $15$ merah dan $15$ biru memberi $\\frac{15}{30} = \\frac{1}{2}$.',
              ),
              solution: {
                en: [
                  '\\text{red} = 3k,\\quad \\text{blue} = 5k',
                  'P(\\text{red}) = \\frac{1}{2} \\Rightarrow 3k + 6 = 5k',
                  '2k = 6,\\quad k = 3',
                  '3k + 5k = 8 \\times 3 = 24',
                ],
                id: [
                  '\\text{merah} = 3k,\\quad \\text{biru} = 5k',
                  'P(\\text{merah}) = \\frac{1}{2} \\Rightarrow 3k + 6 = 5k',
                  '2k = 6,\\quad k = 3',
                  '3k + 5k = 8 \\times 3 = 24',
                ],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m8-s3-p',
        runtime: 'math',
        title: L('Final Try-Out', 'Try-out Akhir'),
        brief: L(
          'Eight typed-answer questions from numbers, algebra, geometry and measurement, and data. They get harder, and the last two need real reasoning.',
          'Delapan soal dengan jawaban ketikan dari bilangan, aljabar, geometri dan pengukuran, serta data. Soalnya makin sulit, dan dua soal terakhir memerlukan penalaran.',
        ),
        requirements: [
          L('Use the four steps and check every answer.', 'Memakai empat langkah dan memeriksa setiap jawaban.'),
          L('Mix what you learned in all eight modules.', 'Memadukan apa yang kamu pelajari di kedelapan modul.'),
        ],
        tasks: [
          {
            prompt: L(
              'Write $0.00046$ in scientific notation $a \\times 10^{b}$, where $1 \\leq a < 10$. Give $a$ and $b$.',
              'Tulis $0{,}00046$ dalam notasi ilmiah $a \\times 10^{b}$, dengan $1 \\leq a < 10$. Tentukan $a$ dan $b$.',
            ),
            inline: true,
            blanks: [
              { label: 'a =', answer: 4.6 },
              { label: 'b =', answer: -4 },
            ],
            solution: {
              en: [
                '0.00046 = 4.6 \\times 10^{-4}',
                '\\text{The decimal point moves 4 places to the right to make } 4.6',
              ],
              id: [
                '0{,}00046 = 4{,}6 \\times 10^{-4}',
                '\\text{Koma desimal digeser 4 tempat ke kanan menjadi } 4{,}6',
              ],
            },
          },
          {
            prompt: L('Simplify $4(x + 2) - 3(x - 1)$.', 'Sederhanakan $4(x + 2) - 3(x - 1)$.'),
            blanks: [{ formula: 'x+11', variable: 'x', domain: [-5, 5] }],
            solution: [
              '4(x + 2) - 3(x - 1) = 4x + 8 - 3x + 3',
              '= x + 11',
            ],
          },
          {
            prompt: L(
              'A rectangular field is 24 m long and 7 m wide. How long is its diagonal?',
              'Sebuah lapangan berbentuk persegi panjang panjangnya 24 m dan lebarnya 7 m. Berapa panjang diagonalnya?',
            ),
            figure: {
              ...shape({ pts: rectPts(0, 0, 24, 7), sides: ['24 m', '7 m'], rights: [0, 1, 2, 3], extra: [line([0, 0], [24, 7], 'result', { dashed: true })] }),
              caption: L('The field and its diagonal (dashed).', 'Lapangan itu dan diagonalnya (putus-putus).'),
            },
            blanks: [{ answer: 25, after: '\\text{ m}' }],
            solution: [
              'd^2 = 24^2 + 7^2 = 576 + 49 = 625',
              'd = \\sqrt{625} = 25 \\text{ m}',
            ],
          },
          {
            prompt: L(
              'Class A has 25 students with a mean score of 72. Class B has 15 students with a mean score of 80. What is the mean score of all 40 students together?',
              'Kelas A terdiri dari 25 siswa dengan rata-rata nilai 72. Kelas B terdiri dari 15 siswa dengan rata-rata nilai 80. Berapa rata-rata nilai seluruh 40 siswa bersama-sama?',
            ),
            blanks: [{ answer: 75 }],
            solution: [
              '25 \\times 72 = 1\\,800,\\quad 15 \\times 80 = 1\\,200',
              '1\\,800 + 1\\,200 = 3\\,000',
              '3\\,000 \\div 40 = 75',
            ],
          },
          {
            prompt: L(
              'A car uses 8 litres of petrol for every 100 km. Petrol costs Rp12,000 per litre. How much does the petrol cost for a trip of 350 km?',
              'Sebuah mobil memakai 8 liter bensin untuk setiap 100 km. Harga bensin Rp12.000 per liter. Berapa biaya bensin untuk perjalanan 350 km?',
            ),
            blanks: [{ label: RP, answer: 336000 }],
            solution: {
              en: [
                '350 \\div 100 \\times 8 = 28 \\text{ litres}',
                '28 \\times 12\\,000 = 336\\,000',
              ],
              id: [
                '350 \\div 100 \\times 8 = 28 \\text{ liter}',
                '28 \\times 12\\,000 = 336\\,000',
              ],
            },
          },
          {
            prompt: L(
              'A cylindrical water tank has a radius of 7 dm and a height of 10 dm. How many litres of water does it hold when it is full? Use $\\pi = \\frac{22}{7}$ and remember that $1\\text{ dm}^3 = 1$ litre.',
              'Sebuah bak air berbentuk tabung berjari-jari 7 dm dan tinggi 10 dm. Berapa liter air yang termuat saat bak penuh? Pakai $\\pi = \\frac{22}{7}$ dan ingat bahwa $1\\text{ dm}^3 = 1$ liter.',
            ),
            figure: {
              ...cylinder2d({ r: 3, h: 5, labels: { r: '7', h: '10' } }),
              caption: L('The tank. The sides are in dm.', 'Bak air. Ukuran sisinya dalam dm.'),
            },
            blanks: [{ answer: 1540, after: { en: '\\text{ litres}', id: '\\text{ liter}' } }],
            solution: {
              en: [
                'V = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 10',
                'V = 22 \\times 7 \\times 10 = 1\\,540 \\text{ dm}^3',
                '1\\,540 \\text{ dm}^3 = 1\\,540 \\text{ litres}',
              ],
              id: [
                'V = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 10',
                'V = 22 \\times 7 \\times 10 = 1\\,540 \\text{ dm}^3',
                '1\\,540 \\text{ dm}^3 = 1\\,540 \\text{ liter}',
              ],
            },
          },
          {
            prompt: L(
              'A car park holds only cars (4 wheels) and motorbikes (2 wheels). There are 30 vehicles with 84 wheels in all. How many cars are there?',
              'Sebuah tempat parkir hanya berisi mobil (4 roda) dan sepeda motor (2 roda). Ada 30 kendaraan dengan 84 roda seluruhnya. Berapa banyak mobil?',
            ),
            blanks: [{ answer: 12, after: { en: '\\text{ cars}', id: '\\text{ mobil}' } }],
            solution: [
              'c + m = 30,\\quad 4c + 2m = 84',
              '4c + 2(30 - c) = 84',
              '2c + 60 = 84,\\quad 2c = 24',
              'c = 12',
            ],
          },
          {
            prompt: L(
              'A photo is 12 cm wide and 18 cm long. It is enlarged to a similar photo whose longer side is 45 cm. By how many square centimetres does the area of the photo grow?',
              'Sebuah foto lebarnya 12 cm dan panjangnya 18 cm. Foto itu diperbesar menjadi foto sebangun yang sisi terpanjangnya 45 cm. Berapa sentimeter persegi luas foto bertambah?',
            ),
            figure: {
              ...shape({ pts: rectPts(0, 0, 18, 12), sides: ['18 cm', '12 cm'], rights: [0, 1, 2, 3] }),
              caption: L('The original photo.', 'Foto semula.'),
            },
            blanks: [{ answer: 1134, after: '\\text{ cm}^2' }],
            solution: {
              en: [
                '\\text{scale factor} = 45 \\div 18 = 2.5',
                '\\text{new width} = 12 \\times 2.5 = 30 \\text{ cm}',
                '\\text{new area} = 30 \\times 45 = 1\\,350,\\quad \\text{old area} = 12 \\times 18 = 216',
                '1\\,350 - 216 = 1\\,134',
              ],
              id: [
                '\\text{faktor skala} = 45 \\div 18 = 2{,}5',
                '\\text{lebar baru} = 12 \\times 2{,}5 = 30 \\text{ cm}',
                '\\text{luas baru} = 30 \\times 45 = 1\\,350,\\quad \\text{luas lama} = 12 \\times 18 = 216',
                '1\\,350 - 216 = 1\\,134',
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
            'Choose a strategy: a diagram, an equation with "let $x$ be ...", guess and check, or working backwards. For similar figures, lengths grow by the scale factor and areas by its square.',
            'Pilih strategi: diagram, persamaan dengan "misalkan $x$ adalah ...", coba-coba, atau berpikir mundur. Pada bangun sebangun, panjang bertambah sebesar faktor skala dan luas sebesar kuadratnya.',
          ),
          L(
            'For the car park, let $c$ be the number of cars, so there are $30 - c$ motorbikes. For the photo, find the scale factor first.',
            'Untuk tempat parkir, misalkan $c$ adalah banyak mobil, sehingga ada $30 - c$ sepeda motor. Untuk foto, cari dulu faktor skalanya.',
          ),
        ],
        xp: 50,
      },
    },
  ],
}
