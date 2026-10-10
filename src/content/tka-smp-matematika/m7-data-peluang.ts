import type { Loc, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import { barChart, ellipsePts, fit, line, lineChart, numberLine, outline, pieChart, rectPts, sectorPts, solid, txt } from './figs'

/** Module 7 — data and probability. Data: statistical questions, tables and bar, line
 *  and pie charts, then mean, median, mode and range. Probability: a single event,
 *  the probability from equally likely outcomes, and the relative frequency. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

type BarOpts = Parameters<typeof barChart>[0]
type LineOpts = Parameters<typeof lineChart>[0]

/** Bars from parallel lists of labels and values (all one color when `color` is given). */
const bars = (labels: string[], values: number[], color?: FigColor): BarOpts['bars'] => labels.map((label, i) => ({ label, value: values[i], color }))

/** A table of cells, written only with numbers and names. `head` colors the first row or column. */
function gridTable(rows: string[][], o: { cw?: number; head?: 'row' | 'col' | 'none' } = {}): Piece {
  const cw = o.cw ?? 2
  const ch = 1.2
  const head = o.head ?? 'row'
  const R = rows.length
  let maxC = 0
  const items: FigItem[] = []
  rows.forEach((r, ri) => {
    const y = (R - 1 - ri) * ch
    maxC = Math.max(maxC, r.length)
    r.forEach((cell, ci) => {
      const isHead = (head === 'row' && ri === 0) || (head === 'col' && ci === 0)
      items.push(outline(rectPts(ci * cw, y, cw, ch), isHead ? 'a' : 'muted'))
      items.push(txt(ci * cw + cw / 2, y + ch / 2, cell, 'lg', isHead ? 'a' : 'muted'))
    })
  })
  return { dim: 2, axes: false, ...fit([[0, 0], [maxC * cw, R * ch]], 0.4), items }
}

/** A bar chart with dashed lines across it (the mean, the median …), each with its value at the right. */
function chartWithLines(o: BarOpts, marks: { at: number; color: FigColor }[]): Piece {
  const p = barChart(o)
  const k = 6 / o.max
  const xEnd = o.bars.length * 1.7 + 0.4
  const extra: FigItem[] = []
  for (const m of marks) {
    extra.push(line([0, m.at * k], [xEnd, m.at * k], m.color, { dashed: true, width: 3 }))
    extra.push(txt(xEnd + 0.15, m.at * k, String(m.at), 'md', m.color, 'start'))
  }
  return { ...p, items: [...p.items, ...extra] }
}

/** A bar chart whose vertical axis starts at `base`, not at 0: the bars are cut off at the bottom,
 *  which is exactly how a misleading graph is made. The axis numbers are drawn, the bar values are not. */
function truncBars(o: { bars: { label: string; value: number }[]; base: number; max: number; step: number }): Piece {
  const H = 6
  const k = H / (o.max - o.base)
  const xEnd = o.bars.length * 1.7 + 0.4
  const items: FigItem[] = []
  for (let v = o.base; v <= o.max + 1e-9; v += o.step) {
    const y = (v - o.base) * k
    if (v > o.base) items.push(line([0, y], [xEnd, y], 'muted', { dashed: true }))
    items.push(txt(-0.25, y, String(v), 'sm', 'muted', 'end'))
  }
  o.bars.forEach((b, i) => {
    const x = 0.5 + i * 1.7
    items.push(solid(rectPts(x, 0, 1, (b.value - o.base) * k), i % 2 === 0 ? 'a' : 'b'))
    items.push(txt(x + 0.5, -0.55, b.label, 'sm', 'muted'))
  })
  items.push(line([0, 0], [xEnd, 0], 'muted', { width: 2.5 }), line([0, 0], [0, H + 0.2], 'muted', { width: 2.5 }))
  return { dim: 2, axes: false, ...fit([[-1.2, -1.1], [xEnd + 0.3, H + 0.6]], 0.3), items }
}

/** A line chart with a dashed red reference line across it at `at` (the theoretical value). */
function lineWithRef(o: LineOpts, at: number): Piece {
  const p = lineChart(o)
  const k = 6 / o.max
  const xEnd = (o.points.length - 1) * 1.6 + 1
  return { ...p, items: [...p.items, line([0, at * k], [xEnd + 0.5, at * k], 'result', { dashed: true, width: 2.5 })] }
}

/** A bag of marbles: every marble drawn, grouped by color, so they can be counted. */
function bag(groups: { n: number; color: FigColor }[], cols = 5): Piece {
  const marbles: FigColor[] = groups.flatMap((g) => Array<FigColor>(g.n).fill(g.color))
  const rows = Math.ceil(marbles.length / cols)
  const W = cols * 1.1 + 0.6
  const H = rows * 1.1 + 0.6
  const items: FigItem[] = [outline(rectPts(0, 0, W, H), 'muted')]
  marbles.forEach((c, i) => {
    const r = Math.floor(i / cols)
    const k = i % cols
    items.push(solid(ellipsePts(0.8 + k * 1.1, H - 0.8 - r * 1.1, 0.42, 0.42, 0, 360, 24), c))
  })
  return { dim: 2, axes: false, ...fit([[0, 0], [W, H]], 0.5), items }
}

/** A spinner: sectors of `deg` degrees, clockwise from the top, with a pointer; labels sit outside. */
function spinner(sectors: { deg: number; color: FigColor; label?: string }[]): Piece {
  const R = 3
  const rad = (d: number) => (d * Math.PI) / 180
  const items: FigItem[] = []
  let a = 90
  for (const s of sectors) {
    items.push(solid(sectorPts(0, 0, R, a, a - s.deg), s.color))
    items.push(line([0, 0], [R * Math.cos(rad(a)), R * Math.sin(rad(a))], 'muted', { width: 2 }))
    if (s.label) {
      const mid = rad(a - s.deg / 2)
      items.push(txt(1.28 * R * Math.cos(mid), 1.28 * R * Math.sin(mid), s.label, 'lg', 'muted'))
    }
    a -= s.deg
  }
  items.push(outline(ellipsePts(0, 0, R, R), 'muted'))
  items.push(solid([[-0.35, R + 1.2], [0.35, R + 1.2], [0, R + 0.35]], 'muted'))
  return { dim: 2, axes: false, ...fit([[-1.5 * R, -1.4 * R], [1.5 * R, 1.4 * R + 0.9]], 0.2), items }
}

/** The six faces of a die as six squares, the numbers underneath; the `shaded` faces are filled. */
function dieStrip(shaded: number[]): Piece {
  const items: FigItem[] = []
  for (let n = 1; n <= 6; n++) {
    const x = (n - 1) * 1.5
    items.push(shaded.includes(n) ? solid(rectPts(x, 0, 1, 1), 'a') : outline(rectPts(x, 0, 1, 1), 'muted'))
    items.push(txt(x + 0.5, -0.6, String(n), 'lg', 'muted'))
  }
  return { dim: 2, axes: false, ...fit([[-0.2, -1.1], [8.2, 1.2]], 0.4), items }
}

/** One square per trial, ten to a row: the first `filled` squares are filled (the event happened). */
function trialSquares(total: number, filled: number): Piece {
  const items: FigItem[] = []
  for (let i = 0; i < total; i++) {
    const x = (i % 10) * 1.2
    const y = -Math.floor(i / 10) * 1.2
    items.push(i < filled ? solid(rectPts(x, y, 1, 1), 'a') : outline(rectPts(x, y, 1, 1), 'muted'))
  }
  const rows = Math.ceil(total / 10)
  return { dim: 2, axes: false, ...fit([[0, -(rows - 1) * 1.2], [11.8, 1]], 0.4), items }
}

const NAMES5 = ['Ani', 'Budi', 'Citra', 'Dewi', 'Eko']

/* -------------------------------------------------------------- module */

export const module7: Module = {
  id: 'tka-smp-m7',
  title: L('Data and Probability', 'Data dan Peluang'),
  summary: L(
    'Ask statistical questions, show data in tables and charts, spot a misleading graph, use the mean, median, mode and range, and find the probability and relative frequency of a single event.',
    'Merumuskan pertanyaan statistik, menyajikan data dalam tabel dan diagram, mengenali grafik yang menyesatkan, memakai rata-rata, median, modus, dan jangkauan, serta menentukan peluang dan frekuensi relatif suatu kejadian tunggal.',
  ),
  submodules: [
    /* ================================================= S1: data */
    {
      id: 'tka-smp-m7-s1',
      title: L('Data', 'Data'),
      summary: L(
        'Write a statistical question, collect and present data in a table or chart, read it and spot a misleading graph; then describe a data set with the mean, median, mode and range and compare two data sets.',
        'Merumuskan pertanyaan statistik, mengumpulkan dan menyajikan data dalam tabel atau diagram, membacanya dan mengenali grafik yang menyesatkan; lalu menggambarkan data dengan rata-rata, median, modus, dan jangkauan serta membandingkan dua kumpulan data.',
      ),
      lessons: [
        /* ------------------------------------ S1 L1 questions, presenting, interpreting */
        {
          id: 'tka-smp-m7-s1-l1',
          title: L('Asking Questions, Presenting and Interpreting Data', 'Merumuskan Pertanyaan, Menyajikan, dan Menafsirkan Data'),
          goal: L(
            'You can write a statistical question, collect data, choose a suitable table or chart, read it correctly and spot a misleading graph.',
            'Kamu bisa merumuskan pertanyaan statistik, mengumpulkan data, memilih tabel atau diagram yang sesuai, membacanya dengan benar, dan mengenali grafik yang menyesatkan.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Questions That Need Data', 'Ayo Amati: Pertanyaan yang Membutuhkan Data'),
              body: L(
                'Ani wants to know more about her class, Class 7A. Compare two questions:\n\n- "How many students are in Class 7A?" has **one** answer: 32. It is not a statistical question.\n- "How many brothers and sisters does each student in Class 7A have?" expects **different** answers from different students. It is a **statistical question**.\n\nTo answer a statistical question we collect **data**. There are three common ways:\n\n- **Survey:** ask people (a questionnaire, a vote).\n- **Observation:** watch and count (the motorbikes passing the school gate).\n- **Measurement:** measure with a tool (height, mass, time).\n\nAni asks all 32 students and writes the answers in a **table** with clear labels for both columns. The picture shows the same data as a bar chart.\n\n| Brothers and sisters | Number of students |\n|---|---|\n| 0 | 8 |\n| 1 | 14 |\n| 2 | 7 |\n| 3 | 3 |',
                'Ani ingin tahu lebih banyak tentang kelasnya, Kelas 7A. Bandingkan dua pertanyaan:\n\n- "Berapa banyak siswa di Kelas 7A?" hanya punya **satu** jawaban: 32. Ini bukan pertanyaan statistik.\n- "Berapa banyak kakak dan adik yang dimiliki setiap siswa Kelas 7A?" mengharapkan jawaban yang **berbeda-beda** dari tiap siswa. Ini adalah **pertanyaan statistik**.\n\nUntuk menjawab pertanyaan statistik, kita mengumpulkan **data**. Ada tiga cara yang umum:\n\n- **Survei:** bertanya kepada orang (angket, pemungutan suara).\n- **Observasi:** mengamati lalu menghitung (sepeda motor yang lewat di depan gerbang sekolah).\n- **Pengukuran:** mengukur dengan alat (tinggi, massa, waktu).\n\nAni bertanya kepada semua 32 siswa dan menuliskan jawabannya dalam sebuah **tabel** dengan label yang jelas di kedua kolom. Gambar menunjukkan data yang sama sebagai diagram batang.\n\n| Banyak kakak dan adik | Banyak siswa |\n|---|---|\n| 0 | 8 |\n| 1 | 14 |\n| 2 | 7 |\n| 3 | 3 |',
              ),
              figure: {
                ...barChart({ bars: bars(['0', '1', '2', '3'], [8, 14, 7, 3]), max: 16, step: 4 }),
                caption: L(
                  'The same data as a bar chart. Below the bars: the number of brothers and sisters. The height of a bar: the number of students.',
                  'Data yang sama sebagai diagram batang. Di bawah batang: banyak kakak dan adik. Tinggi batang: banyak siswa.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Choosing a Chart and Making a Pie Chart', 'Contoh Bertahap: Memilih Diagram dan Membuat Diagram Lingkaran'),
              body: L(
                'Every display has a job. Choose the one that matches your question.\n\n| Display | Best for | Example |\n|---|---|---|\n| Table | exact values with labels | the number of students for each answer |\n| Bar chart | comparing amounts in separate categories | the books borrowed by each class |\n| Line chart | showing change over time | the rainfall in each month |\n| Pie chart | showing parts of a whole | how a class votes for a trip |\n\nNow a pie chart. In a vote, Ani got 40%, Budi 25%, Citra 20% and Dewi 15%.\n\n1. Step 1: Check that the parts make a whole: $40+25+20+15=100$, so 100%.\n2. Step 2: The whole circle is $360^\\circ$, so 1% is $3.6^\\circ$. The angle is $\\text{percent}\\times3.6$.\n3. Step 3: The slice of Ani: $40\\times3.6=144^\\circ$.\n4. Step 4: If 40 students voted, Ani got $40\\%\\times40=16$ votes.\n\n**Remember:**\n\n- In a pie chart the angle is $\\text{percent}\\times3.6^\\circ$, and all angles add up to $360^\\circ$.\n- A good chart has a title and labels on the categories and on the axes.',
                'Setiap penyajian punya tugasnya sendiri. Pilih yang sesuai dengan pertanyaanmu.\n\n| Penyajian | Cocok untuk | Contoh |\n|---|---|---|\n| Tabel | nilai tepat dengan label | banyak siswa untuk setiap jawaban |\n| Diagram batang | membandingkan jumlah pada kategori terpisah | buku yang dipinjam tiap kelas |\n| Diagram garis | menunjukkan perubahan menurut waktu | curah hujan tiap bulan |\n| Diagram lingkaran | menunjukkan bagian dari keseluruhan | cara satu kelas memilih tempat wisata |\n\nSekarang diagram lingkaran. Dalam sebuah pemungutan suara, Ani mendapat 40%, Budi 25%, Citra 20%, dan Dewi 15%.\n\n1. Langkah 1: Periksa bahwa bagian-bagiannya membentuk keseluruhan: $40+25+20+15=100$, jadi 100%.\n2. Langkah 2: Satu lingkaran penuh adalah $360^\\circ$, jadi 1% adalah $3{,}6^\\circ$. Sudutnya adalah $\\text{persen}\\times3{,}6$.\n3. Langkah 3: Juring Ani: $40\\times3{,}6=144^\\circ$.\n4. Langkah 4: Jika 40 siswa memilih, Ani mendapat $40\\%\\times40=16$ suara.\n\n**Ingat:**\n\n- Pada diagram lingkaran, sudutnya adalah $\\text{persen}\\times3{,}6^\\circ$, dan semua sudut berjumlah $360^\\circ$.\n- Diagram yang baik punya judul serta label pada kategori dan pada sumbunya.',
              ),
              figure: {
                ...pieChart({
                  slices: [
                    { label: 'Ani', value: 40 },
                    { label: 'Budi', value: 25 },
                    { label: 'Citra', value: 20 },
                    { label: 'Dewi', value: 15 },
                  ],
                  unit: '%',
                }),
                caption: L(
                  'A pie chart of the vote: Ani 40%, Budi 25%, Citra 20%, Dewi 15%.',
                  'Diagram lingkaran hasil pemungutan suara: Ani 40%, Budi 25%, Citra 20%, Dewi 15%.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Misleading Graphs and Wrong Charts', 'Awas, Jebakan!: Grafik yang Menyesatkan dan Diagram yang Keliru'),
              body: L(
                'Two charts can show the same numbers and still give a very different feeling. Always look at the vertical axis first.\n\n| Wrong | Right |\n|---|---|\n| The bar of 7B is three times as tall as the bar of 7A, so 7B scored three times as much | The axis starts at 50, not at 0. The scores are 52 and 56, so 7B is only a little higher |\n| A line chart is fine for comparing favorite fruits | Use a bar chart for separate categories. A line joins values that follow each other in time |\n| The parts 40%, 30% and 50% make a good pie chart | The parts of a pie chart must add up to 100%, but $40+30+50=120$ |',
                'Dua diagram bisa menampilkan angka yang sama tetapi memberi kesan yang sangat berbeda. Selalu lihat sumbu tegaknya lebih dulu.\n\n| Salah | Benar |\n|---|---|\n| Batang 7B tiga kali setinggi batang 7A, jadi nilai 7B tiga kali lebih besar | Sumbunya mulai dari 50, bukan 0. Nilainya 52 dan 56, jadi 7B hanya sedikit lebih tinggi |\n| Diagram garis cocok untuk membandingkan buah kesukaan | Pakai diagram batang untuk kategori terpisah. Garis menghubungkan nilai yang berurutan menurut waktu |\n| Bagian 40%, 30%, dan 50% membentuk diagram lingkaran yang baik | Bagian-bagian diagram lingkaran harus berjumlah 100%, tetapi $40+30+50=120$ |',
              ),
              figure: {
                ...truncBars({ bars: [{ label: '7A', value: 52 }, { label: '7B', value: 56 }], base: 50, max: 58, step: 2 }),
                caption: L(
                  'The axis starts at 50. The bar of 7B looks three times as tall as the bar of 7A, but the scores are 52 and 56.',
                  'Sumbu mulai dari 50. Batang 7B tampak tiga kali setinggi batang 7A, padahal nilainya 52 dan 56.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('Which of these is a statistical question?', 'Manakah yang merupakan pertanyaan statistik?'),
              options: [
                L('How many minutes does each student in Class 7A need to get to school?', 'Berapa menit yang dibutuhkan setiap siswa Kelas 7A untuk sampai ke sekolah?'),
                L('How many students are in Class 7A?', 'Berapa banyak siswa di Kelas 7A?'),
                L('On which day is the school sports day held?', 'Pada hari apa lomba olahraga sekolah diadakan?'),
                L('How many corners does a rectangle have?', 'Berapa banyak sudut pada sebuah persegi panjang?'),
              ],
              answer: 0,
              explain: L(
                'A statistical question expects different answers, here a different number of minutes from different students. The other three questions have one fixed answer.',
                'Pertanyaan statistik mengharapkan jawaban yang berbeda-beda, di sini banyak menit yang berbeda dari tiap siswa. Tiga pertanyaan lainnya punya satu jawaban tetap.',
              ),
              hint: L(
                'Ask yourself: will every student give the same answer? A statistical question needs data that vary.',
                'Tanyakan pada dirimu: apakah semua siswa akan memberi jawaban yang sama? Pertanyaan statistik membutuhkan data yang bervariasi.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: in the vote, Budi got 25%. Complete the working for his slice and for his votes (40 students voted).',
                'Coba bersama: dalam pemungutan suara, Budi mendapat 25%. Lengkapi hitungan untuk juringnya dan untuk suaranya (40 siswa memilih).',
              ),
              template: {
                en: '25\\times3.6=\\ ___^\\circ,\\qquad 25\\%\\times40=\\ ___',
                id: '25\\times3{,}6=\\ ___^\\circ,\\qquad 25\\%\\times40=\\ ___',
              },
              blanks: ['90', '10'],
              explain: L(
                '$25\\times3.6=90$, so the slice is $90^\\circ$, a quarter of the circle. And $25\\%$ of 40 is $\\frac{25}{100}\\times40=10$ votes.',
                '$25\\times3{,}6=90$, jadi juringnya $90^\\circ$, seperempat lingkaran. Dan $25\\%$ dari 40 adalah $\\frac{25}{100}\\times40=10$ suara.',
              ),
              hint: L(
                'Multiply the percentage by 3.6 to get the angle. For the votes, find 25% of 40: a quarter of 40.',
                'Kalikan persentasenya dengan 3,6 untuk mendapat sudut. Untuk suaranya, cari 25% dari 40: seperempat dari 40.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The line chart shows how many students joined the reading club in each of five weeks. Between which two weeks did the number rise the most?',
                'Diagram garis menunjukkan banyak siswa yang bergabung dengan klub membaca pada tiap minggu dari lima minggu. Antara dua minggu manakah kenaikannya paling besar?',
              ),
              figure: {
                ...lineChart({ points: ['1', '2', '3', '4', '5'].map((label, i) => ({ label, value: [12, 15, 24, 20, 23][i] })), max: 30, step: 10 }),
                caption: L(
                  'The number of students in the reading club in weeks 1 to 5.',
                  'Banyak siswa klub membaca pada minggu ke-1 sampai ke-5.',
                ),
              },
              options: [
                L('From week 2 to week 3', 'Dari minggu ke-2 ke minggu ke-3'),
                L('From week 1 to week 2', 'Dari minggu ke-1 ke minggu ke-2'),
                L('From week 3 to week 4', 'Dari minggu ke-3 ke minggu ke-4'),
                L('From week 4 to week 5', 'Dari minggu ke-4 ke minggu ke-5'),
              ],
              answer: 0,
              explain: L(
                'The rise is the difference between two neighboring points: $24-15=9$ is the biggest. From week 1 to 2 and from week 4 to 5 the number rises by only 3, and from week 3 to 4 the line goes down.',
                'Kenaikan adalah selisih dua titik yang berdekatan: $24-15=9$ adalah yang terbesar. Dari minggu ke-1 ke-2 dan dari minggu ke-4 ke-5 kenaikannya hanya 3, dan dari minggu ke-3 ke-4 garisnya turun.',
              ),
              hint: L(
                'For each pair of neighboring weeks, subtract the lower value from the higher one. Does the line go up or down?',
                'Untuk setiap pasangan minggu yang berdekatan, kurangkan nilai yang lebih rendah dari yang lebih tinggi. Apakah garisnya naik atau turun?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The bar chart shows the kilograms of used paper collected by five classes. Choose the TWO statements that are true.',
                'Diagram batang menunjukkan kilogram kertas bekas yang dikumpulkan lima kelas. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...barChart({ bars: bars(['7A', '7B', '7C', '7D', '7E'], [24, 36, 18, 36, 30]), max: 40, step: 10 }),
                caption: L('Used paper collected, in kg.', 'Kertas bekas yang terkumpul, dalam kg.'),
              },
              options: [
                L('Class 7B and Class 7D collected the same amount.', 'Kelas 7B dan Kelas 7D mengumpulkan jumlah yang sama.'),
                L('Class 7C collected half as much as Class 7B.', 'Kelas 7C mengumpulkan setengah dari yang dikumpulkan Kelas 7B.'),
                L('Class 7A collected more than Class 7E.', 'Kelas 7A mengumpulkan lebih banyak daripada Kelas 7E.'),
                L('The five classes collected 150 kg together.', 'Kelima kelas mengumpulkan 150 kg bersama-sama.'),
              ],
              answer: [0, 1],
              explain: L(
                'The bars of 7B and 7D both reach 36, and 18 is half of 36. Class 7A collected 24 kg, less than Class 7E with 30 kg, and the total is $24+36+18+36+30=144$ kg, not 150.',
                'Batang 7B dan 7D sama-sama mencapai 36, dan 18 adalah setengah dari 36. Kelas 7A mengumpulkan 24 kg, lebih sedikit daripada Kelas 7E dengan 30 kg, dan jumlahnya $24+36+18+36+30=144$ kg, bukan 150.',
              ),
              hint: L(
                'Read the value of each bar first, then check every statement against those numbers.',
                'Baca dulu nilai setiap batang, lalu periksa setiap pernyataan dengan angka-angka itu.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('"How tall is each student in Class 7A?" is a statistical question.', '"Berapa tinggi setiap siswa Kelas 7A?" adalah pertanyaan statistik.'),
                L('A pie chart is the best way to show how the temperature changes hour by hour.', 'Diagram lingkaran adalah cara terbaik untuk menunjukkan perubahan suhu dari jam ke jam.'),
                L('A bar chart is a good way to compare the amounts of several separate categories.', 'Diagram batang cocok untuk membandingkan jumlah beberapa kategori yang terpisah.'),
                L('If one bar is twice as tall as another bar, its value is always twice as large.', 'Jika satu batang dua kali setinggi batang lain, nilainya selalu dua kali lebih besar.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Heights differ from student to student, so the question is statistical. Change over time needs a line chart, not a pie chart. Bars are proportional to the values only when the axis starts at 0.',
                'Tinggi tiap siswa berbeda-beda, jadi pertanyaannya statistik. Perubahan menurut waktu membutuhkan diagram garis, bukan diagram lingkaran. Batang sebanding dengan nilainya hanya jika sumbunya mulai dari 0.',
              ),
              hint: L(
                'For each statement ask: what is the question, and which display or axis would show the data honestly?',
                'Untuk setiap pernyataan tanyakan: apa pertanyaannya, dan penyajian atau sumbu mana yang menampilkan data dengan jujur?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The pie chart shows how 480 kg of used paper was shared among four classes. Find the mass collected by Class 7C and the angle of the slice of Class 7A.',
                'Diagram lingkaran menunjukkan pembagian 480 kg kertas bekas dari empat kelas. Cari massa yang dikumpulkan Kelas 7C dan besar sudut juring Kelas 7A.',
              ),
              figure: {
                ...pieChart({
                  slices: [
                    { label: '7A', value: 35 },
                    { label: '7B', value: 25 },
                    { label: '7C', value: 15 },
                    { label: '7D', value: 25 },
                  ],
                  unit: '%',
                }),
                caption: L('The share of each class in the 480 kg.', 'Bagian setiap kelas dari 480 kg.'),
              },
              inline: true,
              blanks: [
                { label: { en: '\\text{Class 7C} =', id: '\\text{Kelas 7C} =' }, answer: 72, after: '\\text{ kg}' },
                { label: { en: '\\text{angle of 7A} =', id: '\\text{sudut 7A} =' }, answer: 126, after: '^\\circ' },
              ],
              hints: [
                L(
                  'The pie chart gives percentages. The whole circle is 100%, and also $360^\\circ$.',
                  'Diagram lingkaran memberi persentase. Satu lingkaran penuh adalah 100%, juga $360^\\circ$.',
                ),
                L(
                  'For the mass, find 15% of 480 kg. For the angle, multiply the percentage of 7A by 3.6.',
                  'Untuk massa, cari 15% dari 480 kg. Untuk sudut, kalikan persentase 7A dengan 3,6.',
                ),
                L(
                  'Mass: $\\frac{15}{100}\\times480$. Angle: $35\\times3.6$. Work out both products.',
                  'Massa: $\\frac{15}{100}\\times480$. Sudut: $35\\times3{,}6$. Hitung kedua hasil kalinya.',
                ),
              ],
              explain: L(
                'Class 7C collected $15\\%$ of 480 kg, that is $0.15\\times480=72$ kg. The slice of 7A is $35\\times3.6=126$ degrees.',
                'Kelas 7C mengumpulkan $15\\%$ dari 480 kg, yaitu $0{,}15\\times480=72$ kg. Juring 7A besarnya $35\\times3{,}6=126$ derajat.',
              ),
              solution: {
                en: ['\\text{7C}: 15\\%\\times480=\\frac{15}{100}\\times480=72', '\\text{7A}: 35\\times3.6=126'],
                id: ['\\text{7C}: 15\\%\\times480=\\frac{15}{100}\\times480=72', '\\text{7A}: 35\\times3{,}6=126'],
              },
            },
          ],
        },
        /* ------------------------------------ S1 L2 mean, median, mode, range */
        {
          id: 'tka-smp-m7-s1-l2',
          title: L('Mean, Median, Mode and Range', 'Rata-rata, Median, Modus, dan Jangkauan'),
          goal: L(
            'You can find the mean, median, mode and range, estimate a mean from a chart, and compare two data sets using a center and a spread.',
            'Kamu bisa menentukan rata-rata, median, modus, dan jangkauan, menaksir rata-rata dari diagram, serta membandingkan dua kumpulan data dengan ukuran pusat dan ukuran sebaran.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Leveling Out', 'Ayo Amati: Meratakan'),
              body: L(
                'Five friends tell how many books they read in the holidays: Ani 4, Budi 7, Citra 5, Dewi 8 and Eko 6. Which one number can describe the whole group?\n\nImagine moving books from the tall bars to the short bars until all bars are equally tall. That equal height is the **mean**, also called the average. The dashed line shows it. The bars above the line stick out by $1+2=3$ and the bars below it fall short by $2+1=3$, so they level out.\n\nFour numbers describe a data set:\n\n| Measure | Meaning | Here |\n|---|---|---|\n| Mean | sum of the values $\\div$ number of values | $(4+7+5+8+6)\\div5=6$ |\n| Median | the middle value after ordering | 4, 5, 6, 7, 8 gives 6 |\n| Mode | the value that occurs most often | none, every value occurs once |\n| Range | largest value $-$ smallest value | $8-4=4$ |',
                'Lima teman bercerita berapa buku yang mereka baca selama liburan: Ani 4, Budi 7, Citra 5, Dewi 8, dan Eko 6. Satu bilangan apa yang dapat menggambarkan seluruh kelompok?\n\nBayangkan memindahkan buku dari batang yang tinggi ke batang yang pendek sampai semua batang sama tinggi. Tinggi yang sama itu adalah **rata-rata** (mean). Garis putus-putus menunjukkannya. Batang di atas garis menonjol $1+2=3$ dan batang di bawah garis kurang $2+1=3$, jadi keduanya saling meratakan.\n\nEmpat bilangan menggambarkan sebuah kumpulan data:\n\n| Ukuran | Arti | Di sini |\n|---|---|---|\n| Rata-rata | jumlah nilai $\\div$ banyak nilai | $(4+7+5+8+6)\\div5=6$ |\n| Median | nilai tengah setelah diurutkan | 4, 5, 6, 7, 8 menghasilkan 6 |\n| Modus | nilai yang paling sering muncul | tidak ada, setiap nilai muncul sekali |\n| Jangkauan | nilai terbesar $-$ nilai terkecil | $8-4=4$ |',
              ),
              figure: {
                ...chartWithLines({ bars: bars(NAMES5, [4, 7, 5, 8, 6], 'a'), max: 10, step: 2 }, [{ at: 6, color: 'result' }]),
                caption: L(
                  'Books read by five friends. The red dashed line is the mean, 6.',
                  'Buku yang dibaca lima teman. Garis putus-putus merah adalah rata-rata, 6.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: All Four Measures', 'Contoh Bertahap: Keempat Ukuran'),
              body: L(
                'Budi practiced the guitar for 12, 8, 15, 8, 10 and 7 minutes on six days.\n\n1. Step 1 (mean): add the values and divide by how many there are: $\\frac{12+8+15+8+10+7}{6}=\\frac{60}{6}=10$.\n2. Step 2 (order): write the values from smallest to largest: 7, 8, 8, 10, 12, 15.\n3. Step 3 (median): there are 6 values, an even number, so there are two middle values, 8 and 10. The median is their mean: $\\frac{8+10}{2}=9$.\n4. Step 4 (mode): 8 occurs twice, more often than any other value, so the mode is 8.\n5. Step 5 (range): $15-7=8$.\n\n**Remember:**\n\n- An odd number of values: the median is the middle one. An even number: the mean of the two middle ones.\n- A data set can have no mode, one mode or more than one mode.\n- A mean always lies between the smallest and the largest value.',
                'Budi berlatih gitar selama 12, 8, 15, 8, 10, dan 7 menit pada enam hari.\n\n1. Langkah 1 (rata-rata): jumlahkan nilainya lalu bagi dengan banyak nilai: $\\frac{12+8+15+8+10+7}{6}=\\frac{60}{6}=10$.\n2. Langkah 2 (urutkan): tulis nilainya dari yang terkecil ke terbesar: 7, 8, 8, 10, 12, 15.\n3. Langkah 3 (median): ada 6 nilai, yaitu bilangan genap, jadi ada dua nilai tengah, 8 dan 10. Mediannya adalah rata-rata keduanya: $\\frac{8+10}{2}=9$.\n4. Langkah 4 (modus): 8 muncul dua kali, lebih sering daripada nilai lain, jadi modusnya 8.\n5. Langkah 5 (jangkauan): $15-7=8$.\n\n**Ingat:**\n\n- Banyak nilai ganjil: median adalah nilai yang di tengah. Banyak nilai genap: rata-rata dari dua nilai tengah.\n- Kumpulan data bisa tidak punya modus, punya satu modus, atau punya lebih dari satu modus.\n- Rata-rata selalu terletak di antara nilai terkecil dan nilai terbesar.',
              ),
              figure: {
                ...gridTable([['7', '8', '8', '10', '12', '15']], { cw: 1.6, head: 'none' }),
                caption: L(
                  'Budi\'s practice times in minutes, in order from smallest to largest. The two middle values are 8 and 10.',
                  'Waktu latihan Budi dalam menit, urut dari terkecil ke terbesar. Dua nilai tengahnya adalah 8 dan 10.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Extreme Values and Common Slips', 'Awas, Jebakan!: Nilai Ekstrem dan Kesalahan Umum'),
              body: L(
                'A value far away from the others is called an **outlier**. In the picture, Dewi read 28 books instead of 8. The mean jumps from 6 to 10, but the median stays at 6.\n\nSo choose the measure that fits the situation:\n\n- **Mean:** a fair share, when there are no extreme values.\n- **Median:** a typical value, when there is an outlier (house prices, salaries).\n- **Mode:** the most popular choice (the shoe size a shop should stock most).\n- **Range:** how far the data are spread out.\n\n| Wrong | Right |\n|---|---|\n| The median of 3, 9, 5 is 9, the middle number as written | Order first: 3, 5, 9. The median is 5 |\n| The range of 4, 7, 5, 28, 6 is 28, the largest value | The range is $28-4=24$: largest minus smallest |\n| The mean 10 describes a typical friend | The outlier pulls the mean up. Four of the five friends read less than 10, so the median 6 is more typical |',
                'Nilai yang jauh dari nilai-nilai lain disebut **pencilan**. Pada gambar, Dewi membaca 28 buku, bukan 8. Rata-rata melonjak dari 6 menjadi 10, tetapi median tetap 6.\n\nJadi pilih ukuran yang sesuai dengan keadaannya:\n\n- **Rata-rata:** pembagian yang adil, bila tidak ada nilai ekstrem.\n- **Median:** nilai yang khas, bila ada pencilan (harga rumah, gaji).\n- **Modus:** pilihan yang paling populer (ukuran sepatu yang paling banyak harus disediakan toko).\n- **Jangkauan:** seberapa jauh data tersebar.\n\n| Salah | Benar |\n|---|---|\n| Median dari 3, 9, 5 adalah 9, bilangan tengah menurut urutan penulisan | Urutkan dulu: 3, 5, 9. Mediannya 5 |\n| Jangkauan dari 4, 7, 5, 28, 6 adalah 28, nilai terbesar | Jangkauannya $28-4=24$: terbesar dikurangi terkecil |\n| Rata-rata 10 menggambarkan teman yang khas | Pencilan menarik rata-rata ke atas. Empat dari lima teman membaca kurang dari 10, jadi median 6 lebih khas |',
              ),
              figure: {
                ...chartWithLines({ bars: bars(NAMES5, [4, 7, 5, 28, 6], 'a'), max: 30, step: 10 }, [
                  { at: 10, color: 'result' },
                  { at: 6, color: 'b' },
                ]),
                caption: L(
                  'Dewi read 28 books. The red dashed line is the mean (10) and the orange dashed line is the median (6).',
                  'Dewi membaca 28 buku. Garis putus-putus merah adalah rata-rata (10) dan garis putus-putus oranye adalah median (6).',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bar chart shows the points scored by five students in a game. Without adding, what is the best estimate of the mean?',
                'Diagram batang menunjukkan poin yang diperoleh lima siswa dalam sebuah permainan. Tanpa menjumlahkan, berapa taksiran terbaik untuk rata-ratanya?',
              ),
              figure: {
                ...barChart({ bars: bars(NAMES5, [4, 10, 6, 9, 6], 'a'), max: 12, step: 2 }),
                caption: L('Points scored by five students.', 'Poin yang diperoleh lima siswa.'),
              },
              options: [
                L('About 7: the bars above that height and the bars below it level out', 'Sekitar 7: batang di atas tinggi itu dan batang di bawahnya saling meratakan'),
                L('About 10: the mean is the tallest bar', 'Sekitar 10: rata-rata adalah batang tertinggi'),
                L('About 4: the mean is the shortest bar', 'Sekitar 4: rata-rata adalah batang terpendek'),
                L('About 35: the heights added together', 'Sekitar 35: tinggi semua batang dijumlahkan'),
              ],
              answer: 0,
              explain: L(
                'The mean lies between the smallest and the largest value and is the height where the bars level out. Here $4+10+6+9+6=35$ and $35\\div5=7$. The tallest bar is the largest value, the shortest bar is the smallest value, and 35 is a sum that was never divided.',
                'Rata-rata terletak di antara nilai terkecil dan terbesar dan merupakan tinggi tempat batang-batang saling meratakan. Di sini $4+10+6+9+6=35$ dan $35\\div5=7$. Batang tertinggi adalah nilai terbesar, batang terpendek adalah nilai terkecil, dan 35 adalah jumlah yang belum dibagi.',
              ),
              hint: L(
                'The mean cannot be bigger than the tallest bar or smaller than the shortest bar. Where would the bars level out?',
                'Rata-rata tidak mungkin lebih besar daripada batang tertinggi atau lebih kecil daripada batang terpendek. Di tinggi berapa batang-batang itu saling meratakan?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: Hasan scored 2, 8, 6, 9, 3 and 8 points in six games. Complete the working for his mean.',
                'Coba bersama: Hasan memperoleh 2, 8, 6, 9, 3, dan 8 poin dalam enam permainan. Lengkapi hitungan rata-ratanya.',
              ),
              template: '\\frac{2+8+6+9+3+8}{6}=\\frac{\\ ___\\ }{6}=\\ ___',
              blanks: ['36', '6'],
              explain: L(
                'The sum is $2+8+6+9+3+8=36$, and $36\\div6=6$. His mean score is 6 points.',
                'Jumlahnya $2+8+6+9+3+8=36$, dan $36\\div6=6$. Rata-rata poin Hasan adalah 6.',
              ),
              hint: L(
                'Add all six scores first. Then divide that sum by the number of games.',
                'Jumlahkan dulu keenam skor. Lalu bagi jumlah itu dengan banyak permainan.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A team scored these goals in 7 matches: 2, 5, 1, 3, 0, 4, 2. What is the median?',
                'Sebuah tim mencetak gol sebanyak ini dalam 7 pertandingan: 2, 5, 1, 3, 0, 4, 2. Berapa mediannya?',
              ),
              figure: {
                ...gridTable([['2', '5', '1', '3', '0', '4', '2']], { cw: 1.6, head: 'none' }),
                caption: L('The goals in the order of the matches.', 'Gol menurut urutan pertandingan.'),
              },
              options: [
                L('$2$', '$2$'),
                L('$3$', '$3$'),
                L('$5$', '$5$'),
                L('$\\frac{17}{7}$', '$\\frac{17}{7}$'),
              ],
              answer: 0,
              explain: L(
                'Order the values first: 0, 1, 2, 2, 3, 4, 5. With 7 values the median is the 4th one, which is 2. The middle of the list as written is 3 (the slip), 5 is the largest value and $\\frac{17}{7}$ is the mean.',
                'Urutkan nilainya dulu: 0, 1, 2, 2, 3, 4, 5. Dengan 7 nilai, median adalah nilai ke-4, yaitu 2. Bilangan tengah menurut urutan penulisan adalah 3 (kesalahannya), 5 adalah nilai terbesar, dan $\\frac{17}{7}$ adalah rata-rata.',
              ),
              hint: L(
                'The values are not in order. Write them from smallest to largest, then pick the middle one.',
                'Nilai-nilainya belum berurutan. Tulis dari terkecil ke terbesar, lalu ambil yang di tengah.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Five friends compare their savings, in thousand rupiah. Citra received a big gift. Choose the TWO statements that are true.',
                'Lima teman membandingkan tabungan mereka, dalam ribu rupiah. Citra menerima hadiah besar. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...gridTable([NAMES5, ['20', '25', '150', '25', '30']], { cw: 2.2, head: 'row' }),
                caption: L('The savings of five friends, in thousand rupiah.', 'Tabungan lima teman, dalam ribu rupiah.'),
              },
              options: [
                L('The median is 25, and the big gift does not change it.', 'Mediannya 25, dan hadiah besar itu tidak mengubahnya.'),
                L('The mean is 50, which is higher than four of the five savings.', 'Rata-ratanya 50, lebih tinggi daripada empat dari lima tabungan.'),
                L('The mean is 25, the same as the median.', 'Rata-ratanya 25, sama dengan median.'),
                L('The range is 150.', 'Jangkauannya 150.'),
              ],
              answer: [0, 1],
              explain: L(
                'In order the values are 20, 25, 25, 30, 150, so the median is 25. The sum is 250 and $250\\div5=50$, pulled up by the gift. The range is $150-20=130$, not 150.',
                'Berurutan, nilainya 20, 25, 25, 30, 150, jadi mediannya 25. Jumlahnya 250 dan $250\\div5=50$, tertarik naik oleh hadiah itu. Jangkauannya $150-20=130$, bukan 150.',
              ),
              hint: L(
                'Work out the mean, the median and the range yourself before you read the statements.',
                'Hitung sendiri rata-rata, median, dan jangkauannya sebelum membaca pernyataan.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'Teams A and B each played five games. The table shows their scores. Decide whether each statement is True or False.',
                'Tim A dan tim B masing-masing bermain lima pertandingan. Tabel menunjukkan skor mereka. Tentukan apakah setiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...gridTable([['A', '5', '6', '7', '8', '9'], ['B', '1', '3', '7', '11', '13']], { cw: 1.6, head: 'col' }),
                caption: L('The scores of team A and team B.', 'Skor tim A dan tim B.'),
              },
              statements: [
                L('Both teams have a mean score of 7.', 'Kedua tim punya rata-rata skor 7.'),
                L('The range of team A is 9.', 'Jangkauan tim A adalah 9.'),
                L('Team B is more spread out, because its range is bigger than the range of team A.', 'Skor tim B lebih tersebar, karena jangkauannya lebih besar daripada jangkauan tim A.'),
                L('The means are equal, so the two teams played equally consistently.', 'Rata-ratanya sama, jadi kedua tim bermain sama konsistennya.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Both sums are 35, so both means are 7. The range of A is $9-5=4$ and the range of B is $13-1=12$. Equal means do not mean equal spread: the smaller range shows the more consistent team, here A.',
                'Kedua jumlah adalah 35, jadi kedua rata-rata adalah 7. Jangkauan A adalah $9-5=4$ dan jangkauan B adalah $13-1=12$. Rata-rata yang sama tidak berarti sebaran yang sama: jangkauan yang lebih kecil menunjukkan tim yang lebih konsisten, di sini A.',
              ),
              hint: L(
                'Find the mean and the range of each team. A center alone does not tell you how spread out the scores are.',
                'Cari rata-rata dan jangkauan setiap tim. Ukuran pusat saja tidak menunjukkan seberapa tersebar skornya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Citra scored 78, 85, 90 and 72 on her first four tests. She wants a mean of 82 over five tests. What must she score on the fifth test? Then find the range of her five scores.',
                'Citra memperoleh nilai 78, 85, 90, dan 72 pada empat ulangan pertamanya. Ia ingin rata-rata 82 dari lima ulangan. Berapa nilai yang harus ia peroleh pada ulangan kelima? Lalu cari jangkauan kelima nilainya.',
              ),
              inline: true,
              blanks: [
                { label: { en: '\\text{fifth test} =', id: '\\text{ulangan kelima} =' }, answer: 85 },
                { label: { en: '\\text{range} =', id: '\\text{jangkauan} =' }, answer: 18 },
              ],
              hints: [
                L(
                  'A mean of 82 over five tests means a certain total. Work out that total first.',
                  'Rata-rata 82 dari lima ulangan berarti jumlah tertentu. Hitung dulu jumlah itu.',
                ),
                L(
                  'The total needed is $82\\times5$. Subtract the sum of her first four scores to find the fifth.',
                  'Jumlah yang dibutuhkan adalah $82\\times5$. Kurangkan jumlah keempat nilai pertamanya untuk mencari nilai kelima.',
                ),
                L(
                  'Fifth score $=410-(78+85+90+72)$. For the range, subtract the smallest of the five scores from the largest.',
                  'Nilai kelima $=410-(78+85+90+72)$. Untuk jangkauan, kurangkan nilai terkecil dari nilai terbesar di antara kelima nilai.',
                ),
              ],
              explain: L(
                'Five tests with a mean of 82 need $82\\times5=410$ points. The first four give $325$, so she needs $410-325=85$. The scores 72, 78, 85, 85, 90 have range $90-72=18$.',
                'Lima ulangan dengan rata-rata 82 membutuhkan $82\\times5=410$ poin. Keempat yang pertama memberi $325$, jadi ia butuh $410-325=85$. Nilai 72, 78, 85, 85, 90 punya jangkauan $90-72=18$.',
              ),
              solution: {
                en: ['78+85+90+72=325', '82\\times5=410', '410-325=85', '\\text{range}=90-72=18'],
                id: ['78+85+90+72=325', '82\\times5=410', '410-325=85', '\\text{jangkauan}=90-72=18'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m7-s1-p',
        runtime: 'math',
        title: L('Data in Action', 'Data dalam Aksi'),
        brief: L(
          'Read charts and tables, work out the mean, median, mode and range, and decide which number tells the true story of a data set.',
          'Membaca diagram dan tabel, menghitung rata-rata, median, modus, dan jangkauan, lalu menentukan bilangan mana yang menceritakan data dengan jujur.',
        ),
        requirements: [
          L('Read a bar chart, a pie chart and a table correctly, and turn percentages and angles into amounts.', 'Membaca diagram batang, diagram lingkaran, dan tabel dengan benar, serta mengubah persentase dan sudut menjadi jumlah.'),
          L('Find the mean, median, mode and range, and judge the effect of an extreme value.', 'Menentukan rata-rata, median, modus, dan jangkauan, serta menilai pengaruh nilai ekstrem.'),
        ],
        hints: [
          L('In a pie chart, the whole circle is $360^\\circ$ and also 100%, so 1% is $3.6^\\circ$.', 'Pada diagram lingkaran, satu lingkaran penuh adalah $360^\\circ$ dan juga 100%, jadi 1% adalah $3{,}6^\\circ$.'),
          L('For a mean, think of the total: mean $\\times$ number of values $=$ sum.', 'Untuk rata-rata, pikirkan jumlahnya: rata-rata $\\times$ banyak nilai $=$ jumlah.'),
          L('Order the values before you look for the median, and subtract the smallest from the largest for the range.', 'Urutkan nilainya sebelum mencari median, dan kurangkan nilai terkecil dari terbesar untuk jangkauan.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'The bar chart shows the number of books read by six friends. Find the mode and the range of the data.',
              'Diagram batang menunjukkan banyak buku yang dibaca enam teman. Cari modus dan jangkauan data tersebut.',
            ),
            figure: {
              ...barChart({ bars: bars(['Ani', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri'], [6, 9, 4, 9, 7, 5], 'a'), max: 10, step: 2 }),
              caption: L('Books read by six friends.', 'Buku yang dibaca enam teman.'),
            },
            inline: true,
            blanks: [
              { label: { en: '\\text{mode} =', id: '\\text{modus} =' }, answer: 9 },
              { label: { en: '\\text{range} =', id: '\\text{jangkauan} =' }, answer: 5 },
            ],
            solution: {
              en: ['\\text{values}: 6, 9, 4, 9, 7, 5', '\\text{mode}=9 \\text{ (it occurs twice)}', '\\text{range}=9-4=5'],
              id: ['\\text{nilai}: 6, 9, 4, 9, 7, 5', '\\text{modus}=9 \\text{ (muncul dua kali)}', '\\text{jangkauan}=9-4=5'],
            },
          },
          {
            prompt: L(
              '200 students chose their favorite school club. The pie chart gives the angle of each slice. Find the percentage of slice P and the number of students it stands for.',
              '200 siswa memilih ekstrakurikuler favorit mereka. Diagram lingkaran memberi sudut setiap juring. Cari persentase juring P dan banyak siswa yang diwakilinya.',
            ),
            figure: {
              ...pieChart({
                slices: [
                  { label: 'P', value: 108 },
                  { label: 'Q', value: 90 },
                  { label: 'R', value: 72 },
                  { label: 'S', value: 90 },
                ],
                unit: '°',
              }),
              caption: L('The angles of the slices add up to 360 degrees.', 'Sudut-sudut juring berjumlah 360 derajat.'),
            },
            inline: true,
            blanks: [
              { label: { en: '\\text{slice P} =', id: '\\text{juring P} =' }, answer: 30, after: '\\%' },
              { label: { en: '\\text{students} =', id: '\\text{siswa} =' }, answer: 60 },
            ],
            solution: {
              en: ['108\\div3.6=30', '30\\%\\times200=\\frac{30}{100}\\times200=60'],
              id: ['108\\div3{,}6=30', '30\\%\\times200=\\frac{30}{100}\\times200=60'],
            },
          },
          {
            prompt: L(
              'Rudi\'s mean over his first 4 basketball games is 15 points. After the fifth game the mean is 17 points. How many points did he score in the fifth game?',
              'Rata-rata poin Rudi dalam 4 pertandingan basket pertamanya adalah 15. Setelah pertandingan kelima, rata-ratanya menjadi 17. Berapa poin yang ia cetak pada pertandingan kelima?',
            ),
            blanks: [{ label: { en: '\\text{fifth game} =', id: '\\text{pertandingan kelima} =' }, answer: 25, after: { en: '\\text{ points}', id: '\\text{ poin}' } }],
            solution: ['4\\times15=60', '5\\times17=85', '85-60=25'],
          },
          {
            prompt: L(
              'A stall owner says: "A typical day brings Rp8 million." The table shows the sales on 5 days, in million rupiah. Find the mean, the median, and the number of days with sales below the mean.',
              'Seorang pemilik warung berkata: "Hari yang biasa menghasilkan Rp8 juta." Tabel menunjukkan penjualan 5 hari, dalam juta rupiah. Cari rata-rata, median, dan banyak hari dengan penjualan di bawah rata-rata.',
            ),
            figure: {
              ...gridTable([['1', '2', '3', '4', '5'], ['4', '5', '4', '6', '21']], { cw: 1.8, head: 'row' }),
              caption: L('Top row: the day. Bottom row: the sales in million rupiah.', 'Baris atas: hari. Baris bawah: penjualan dalam juta rupiah.'),
            },
            inline: true,
            blanks: [
              { label: { en: '\\text{mean} =', id: '\\text{rata-rata} =' }, answer: 8 },
              { label: { en: '\\text{median} =', id: '\\text{median} =' }, answer: 5 },
              { label: { en: '\\text{days below mean} =', id: '\\text{hari di bawah rata-rata} =' }, answer: 4 },
            ],
            solution: {
              en: ['\\text{mean}=\\frac{4+5+4+6+21}{5}=\\frac{40}{5}=8', '\\text{in order}: 4, 4, 5, 6, 21 \\Rightarrow \\text{median}=5', '\\text{below } 8: 4, 5, 4, 6 \\Rightarrow 4 \\text{ days}'],
              id: ['\\text{rata-rata}=\\frac{4+5+4+6+21}{5}=\\frac{40}{5}=8', '\\text{urut}: 4, 4, 5, 6, 21 \\Rightarrow \\text{median}=5', '\\text{di bawah } 8: 4, 5, 4, 6 \\Rightarrow 4 \\text{ hari}'],
            },
          },
        ],
      },
    },
    /* ================================================= S2: probability */
    {
      id: 'tka-smp-m7-s2',
      title: L('Probability', 'Peluang'),
      summary: L(
        'Find the probability of a single event from equally likely outcomes, use P(not A) = 1 - P(A), then compare relative frequencies from experiments with theory and predict how often an event happens.',
        'Menentukan peluang kejadian tunggal dari hasil yang sama mungkin, memakai P(bukan A) = 1 - P(A), lalu membandingkan frekuensi relatif dari percobaan dengan teori serta memperkirakan seberapa sering suatu kejadian terjadi.',
      ),
      lessons: [
        /* ------------------------------------ S2 L1 probability of a single event */
        {
          id: 'tka-smp-m7-s2-l1',
          title: L('Probability of a Single Event', 'Peluang Kejadian Tunggal'),
          goal: L(
            'You can list the outcomes of an experiment, find the probability of an event as a fraction, and use P(not A) = 1 - P(A).',
            'Kamu bisa menuliskan hasil-hasil suatu percobaan, menentukan peluang suatu kejadian sebagai pecahan, dan memakai P(bukan A) = 1 - P(A).',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Outcomes and Events', 'Ayo Amati: Hasil dan Kejadian'),
              body: L(
                'Budi rolls a fair die. Rolling is an **experiment**: we cannot be sure of the result in advance. Each possible result is an **outcome**, and the set of all outcomes is the **sample space**: $\\{1,2,3,4,5,6\\}$.\n\nAn **event** is a group of outcomes we are interested in. The event "an even number" is $\\{2,4,6\\}$: 3 favorable outcomes out of 6.\n\nWhen all outcomes are **equally likely** (a fair die, a fair coin), the probability of an event $A$ is\n\n$$P(A)=\\frac{\\text{number of favorable outcomes}}{\\text{number of equally likely outcomes}}$$\n\nSo $P(\\text{even})=\\frac{3}{6}=\\frac{1}{2}$.',
                'Budi melempar sebuah dadu yang adil. Melempar dadu adalah sebuah **percobaan**: kita tidak bisa memastikan hasilnya sebelumnya. Setiap hasil yang mungkin disebut **hasil**, dan himpunan semua hasil disebut **ruang sampel**: $\\{1,2,3,4,5,6\\}$.\n\n**Kejadian** adalah sekelompok hasil yang kita perhatikan. Kejadian "mata dadu genap" adalah $\\{2,4,6\\}$: 3 hasil yang diharapkan dari 6 hasil.\n\nBila semua hasil **sama mungkin** (dadu yang adil, koin yang adil), peluang kejadian $A$ adalah\n\n$$P(A)=\\frac{\\text{banyak hasil yang diharapkan}}{\\text{banyak hasil yang sama mungkin}}$$\n\nJadi $P(\\text{genap})=\\frac{3}{6}=\\frac{1}{2}$.',
              ),
              figure: {
                ...dieStrip([2, 4, 6]),
                caption: L(
                  'The six outcomes of a die. The filled squares are the outcomes of the event "an even number".',
                  'Enam hasil pada sebuah dadu. Kotak yang terisi adalah hasil-hasil kejadian "mata dadu genap".',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Marbles in a Bag', 'Contoh Bertahap: Kelereng dalam Kantong'),
              body: L(
                'A bag holds 3 green, 2 orange and 5 red marbles. Eko picks one marble without looking. What is the probability that it is orange?\n\n1. Step 1: Count all the marbles: $3+2+5=10$. Every marble is equally likely, so there are 10 outcomes.\n2. Step 2: Count the favorable outcomes: there are 2 orange marbles.\n3. Step 3: $P(\\text{orange})=\\frac{2}{10}=\\frac{1}{5}$.\n4. Step 4: The event "not orange" is the other 8 marbles: $P(\\text{not orange})=1-\\frac{1}{5}=\\frac{4}{5}$.\n\n**Remember:**\n\n- A probability is always from 0 to 1. An **impossible** event has $P=0$ and a **certain** event has $P=1$.\n- $P(\\text{not }A)=1-P(A)$.\n- A probability can be a fraction, a decimal or a percentage: $\\frac{1}{5}=0.2=20\\%$.',
                'Sebuah kantong berisi 3 kelereng hijau, 2 kelereng oranye, dan 5 kelereng merah. Eko mengambil satu kelereng tanpa melihat. Berapa peluang kelereng itu berwarna oranye?\n\n1. Langkah 1: Hitung semua kelereng: $3+2+5=10$. Setiap kelereng sama mungkin, jadi ada 10 hasil.\n2. Langkah 2: Hitung hasil yang diharapkan: ada 2 kelereng oranye.\n3. Langkah 3: $P(\\text{oranye})=\\frac{2}{10}=\\frac{1}{5}$.\n4. Langkah 4: Kejadian "bukan oranye" adalah 8 kelereng yang lain: $P(\\text{bukan oranye})=1-\\frac{1}{5}=\\frac{4}{5}$.\n\n**Ingat:**\n\n- Peluang selalu dari 0 sampai 1. Kejadian yang **mustahil** punya $P=0$ dan kejadian yang **pasti** punya $P=1$.\n- $P(\\text{bukan }A)=1-P(A)$.\n- Peluang dapat ditulis sebagai pecahan, desimal, atau persen: $\\frac{1}{5}=0{,}2=20\\%$.',
              ),
              figure: {
                ...bag([{ n: 3, color: 'a' }, { n: 2, color: 'b' }, { n: 5, color: 'result' }]),
                caption: L('The bag: 3 green, 2 orange and 5 red marbles.', 'Kantongnya: 3 kelereng hijau, 2 kelereng oranye, dan 5 kelereng merah.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Equally Likely, and Counted Once', 'Awas, Jebakan!: Sama Mungkin dan Dihitung Sekali'),
              body: L(
                'The formula works only when the outcomes are equally likely. Also, count every favorable outcome only once.\n\n| Wrong | Right |\n|---|---|\n| A spinner has 3 sectors, so each one has probability $\\frac{1}{3}$ | Only if the sectors are equal. A sector that is half of the circle has probability $\\frac{1}{2}$ |\n| A bag has 2 green and 8 orange marbles, so $P(\\text{green})=\\frac{1}{2}$ because there are two colors | $P(\\text{green})=\\frac{2}{10}=\\frac{1}{5}$: count marbles, not colors |\n| For a die, "even or a multiple of 3": $3+2=5$ outcomes, so $\\frac{5}{6}$ | The 6 is in both groups. The favorable outcomes are 2, 3, 4, 6, so $\\frac{4}{6}=\\frac{2}{3}$ |',
                'Rumus ini hanya berlaku bila hasil-hasilnya sama mungkin. Selain itu, hitung setiap hasil yang diharapkan hanya satu kali.\n\n| Salah | Benar |\n|---|---|\n| Sebuah roda putar (spinner) punya 3 juring, jadi setiap juring berpeluang $\\frac{1}{3}$ | Hanya jika juring-juringnya sama besar. Juring yang setengah lingkaran berpeluang $\\frac{1}{2}$ |\n| Sebuah kantong berisi 2 kelereng hijau dan 8 kelereng oranye, jadi $P(\\text{hijau})=\\frac{1}{2}$ karena ada dua warna | $P(\\text{hijau})=\\frac{2}{10}=\\frac{1}{5}$: hitung kelerengnya, bukan warnanya |\n| Pada dadu, "genap atau kelipatan 3": $3+2=5$ hasil, jadi $\\frac{5}{6}$ | Angka 6 ada di kedua kelompok. Hasil yang diharapkan adalah 2, 3, 4, 6, jadi $\\frac{4}{6}=\\frac{2}{3}$ |',
              ),
              figure: {
                ...pieChart({
                  slices: [
                    { label: 'A', value: 50 },
                    { label: 'B', value: 25 },
                    { label: 'C', value: 25 },
                  ],
                  unit: '%',
                }),
                caption: L(
                  'A spinner with three sectors that are not equal: sector A is half of the circle.',
                  'Sebuah roda putar dengan tiga juring yang tidak sama besar: juring A setengah lingkaran.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Which point on the number line shows the probability that a fair die shows a number smaller than 7?',
                'Titik manakah pada garis bilangan yang menunjukkan peluang sebuah dadu yang adil menunjukkan angka yang lebih kecil dari 7?',
              ),
              figure: {
                ...numberLine({
                  from: 0,
                  to: 1,
                  step: 0.25,
                  fmt: (v) => ({ 0: '0', 0.25: '1/4', 0.5: '1/2', 0.75: '3/4', 1: '1' } as Record<number, string>)[v] ?? String(v),
                  marks: [
                    { at: 0, label: 'P', color: 'a' },
                    { at: 0.25, label: 'Q', color: 'b' },
                    { at: 0.5, label: 'R', color: 'c' },
                    { at: 1, label: 'S', color: 'result' },
                  ],
                }),
                caption: L('Probabilities lie from 0 to 1 on a number line.', 'Peluang terletak dari 0 sampai 1 pada garis bilangan.'),
              },
              options: [
                L('Point S', 'Titik S'),
                L('Point R', 'Titik R'),
                L('Point P', 'Titik P'),
                L('Point Q', 'Titik Q'),
              ],
              answer: 0,
              explain: L(
                'Every number on a die, 1 to 6, is smaller than 7, so the event is certain and $P=1$. A probability of 0 means impossible, and $\\frac{1}{2}$ means the event happens for half of the outcomes.',
                'Setiap angka pada dadu, 1 sampai 6, lebih kecil dari 7, jadi kejadiannya pasti dan $P=1$. Peluang 0 berarti mustahil, dan $\\frac{1}{2}$ berarti kejadian itu terjadi pada setengah dari semua hasil.',
              ),
              hint: L(
                'How many of the six faces are smaller than 7? Is that some of them, none of them, or all of them?',
                'Berapa dari enam sisi dadu yang lebih kecil dari 7? Sebagian, tidak ada, atau semuanya?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a bag holds 4 green, 3 orange and 5 red marbles. Complete the working for the probability of picking a red marble.',
                'Coba bersama: sebuah kantong berisi 4 kelereng hijau, 3 kelereng oranye, dan 5 kelereng merah. Lengkapi hitungan peluang terambilnya kelereng merah.',
              ),
              template: '4+3+5=\\ ___,\\qquad P=\\frac{5}{\\ ___\\ }',
              blanks: ['12', '12'],
              explain: L(
                'There are $4+3+5=12$ marbles, all equally likely, and 5 of them are red. So the probability is $\\frac{5}{12}$.',
                'Ada $4+3+5=12$ kelereng yang semuanya sama mungkin, dan 5 di antaranya merah. Jadi peluangnya $\\frac{5}{12}$.',
              ),
              hint: L(
                'The bottom of the fraction counts ALL the marbles, not only the red ones.',
                'Penyebut pecahan menghitung SEMUA kelereng, bukan hanya yang merah.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A fair spinner has 8 equal sectors numbered 1 to 8. What is the probability that it stops on a multiple of 2 or a multiple of 4?',
                'Sebuah roda putar yang adil punya 8 juring sama besar bernomor 1 sampai 8. Berapa peluang roda putar berhenti pada kelipatan 2 atau kelipatan 4?',
              ),
              figure: {
                ...spinner([1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => ({ deg: 45, color: (i % 2 === 0 ? 'a' : 'c') as FigColor, label: String(n) }))),
                caption: L('A fair spinner with 8 equal sectors.', 'Roda putar yang adil dengan 8 juring sama besar.'),
              },
              options: [
                L('$\\frac{1}{2}$', '$\\frac{1}{2}$'),
                L('$\\frac{3}{4}$', '$\\frac{3}{4}$'),
                L('$\\frac{1}{4}$', '$\\frac{1}{4}$'),
                L('$\\frac{1}{8}$', '$\\frac{1}{8}$'),
              ],
              answer: 0,
              explain: L(
                'The favorable outcomes are 2, 4, 6 and 8: 4 of the 8 equal sectors, so $\\frac{4}{8}=\\frac{1}{2}$. The answer $\\frac{3}{4}$ counts 4 and 8 twice (4 multiples of 2 plus 2 multiples of 4 gives 6). $\\frac{1}{4}$ counts only the multiples of 4.',
                'Hasil yang diharapkan adalah 2, 4, 6, dan 8: 4 dari 8 juring yang sama besar, jadi $\\frac{4}{8}=\\frac{1}{2}$. Jawaban $\\frac{3}{4}$ menghitung 4 dan 8 dua kali (4 kelipatan 2 ditambah 2 kelipatan 4 menjadi 6). $\\frac{1}{4}$ hanya menghitung kelipatan 4.',
              ),
              hint: L(
                'List the numbers from 1 to 8 that are multiples of 2 or of 4. Write each number only once.',
                'Daftar bilangan dari 1 sampai 8 yang merupakan kelipatan 2 atau kelipatan 4. Tulis setiap bilangan hanya sekali.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'A bag holds 4 green, 2 orange and 6 red marbles. One marble is picked at random. Choose the TWO events whose probability is $\\frac{1}{2}$.',
                'Sebuah kantong berisi 4 kelereng hijau, 2 kelereng oranye, dan 6 kelereng merah. Satu kelereng diambil secara acak. Pilih DUA kejadian yang peluangnya $\\frac{1}{2}$.',
              ),
              figure: {
                ...bag([{ n: 4, color: 'a' }, { n: 2, color: 'b' }, { n: 6, color: 'result' }], 6),
                caption: L('The bag: 4 green, 2 orange and 6 red marbles.', 'Kantongnya: 4 kelereng hijau, 2 kelereng oranye, dan 6 kelereng merah.'),
              },
              options: [
                L('Picking a red marble', 'Terambil kelereng merah'),
                L('Picking a marble that is not red', 'Terambil kelereng yang bukan merah'),
                L('Picking a green marble', 'Terambil kelereng hijau'),
                L('Picking an orange marble', 'Terambil kelereng oranye'),
              ],
              answer: [0, 1],
              explain: L(
                'There are 12 marbles. Red: $\\frac{6}{12}=\\frac{1}{2}$, and not red: $1-\\frac{1}{2}=\\frac{1}{2}$. Green is $\\frac{4}{12}=\\frac{1}{3}$ and orange is $\\frac{2}{12}=\\frac{1}{6}$.',
                'Ada 12 kelereng. Merah: $\\frac{6}{12}=\\frac{1}{2}$, dan bukan merah: $1-\\frac{1}{2}=\\frac{1}{2}$. Hijau $\\frac{4}{12}=\\frac{1}{3}$ dan oranye $\\frac{2}{12}=\\frac{1}{6}$.',
              ),
              hint: L(
                'Count all the marbles first, then write the probability of each event as a fraction and simplify.',
                'Hitung dulu semua kelereng, lalu tulis peluang setiap kejadian sebagai pecahan dan sederhanakan.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('The probability of an impossible event is 0.', 'Peluang kejadian yang mustahil adalah 0.'),
                L('A probability can be 1.2 when an event is very likely.', 'Peluang bisa bernilai 1,2 bila suatu kejadian sangat mungkin terjadi.'),
                L('If the probability of rain is 0.3, the probability of no rain is 0.7.', 'Jika peluang hujan adalah 0,3, peluang tidak hujan adalah 0,7.'),
                L('A bag has 2 green and 8 orange marbles, so the probability of green is $\\frac{1}{2}$ because there are two colors.', 'Sebuah kantong berisi 2 kelereng hijau dan 8 kelereng oranye, jadi peluang hijau adalah $\\frac{1}{2}$ karena ada dua warna.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'A probability is between 0 (impossible) and 1 (certain), so 1.2 is not possible. P(not A) is $1-P(A)=1-0.3=0.7$. The marbles are not equally likely to be green or orange: $P(\\text{green})=\\frac{2}{10}=\\frac{1}{5}$.',
                'Peluang berada di antara 0 (mustahil) dan 1 (pasti), jadi 1,2 tidak mungkin. P(bukan A) adalah $1-P(A)=1-0{,}3=0{,}7$. Kelereng hijau dan oranye tidak sama mungkin: $P(\\text{hijau})=\\frac{2}{10}=\\frac{1}{5}$.',
              ),
              hint: L(
                'Remember the range of a probability, and that you count outcomes (marbles), not colors.',
                'Ingat batas nilai peluang, dan bahwa yang dihitung adalah hasilnya (kelereng), bukan warnanya.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Eko\'s bag holds 3 green, 4 orange and 5 red marbles. He picks one marble at random. Find the probability of picking an orange marble and the probability of NOT picking a red marble. Write each as a fraction.',
                'Kantong Eko berisi 3 kelereng hijau, 4 kelereng oranye, dan 5 kelereng merah. Ia mengambil satu kelereng secara acak. Cari peluang terambilnya kelereng oranye dan peluang TIDAK terambilnya kelereng merah. Tulis masing-masing sebagai pecahan.',
              ),
              figure: {
                ...bag([{ n: 3, color: 'a' }, { n: 4, color: 'b' }, { n: 5, color: 'result' }], 6),
                caption: L('The bag: 3 green, 4 orange and 5 red marbles.', 'Kantongnya: 3 kelereng hijau, 4 kelereng oranye, dan 5 kelereng merah.'),
              },
              inline: true,
              blanks: [
                { label: { en: 'P(\\text{orange}) =', id: 'P(\\text{oranye}) =' }, answer: 1 / 3 },
                { label: { en: 'P(\\text{not red}) =', id: 'P(\\text{bukan merah}) =' }, answer: 7 / 12 },
              ],
              hints: [
                L(
                  'First count all the marbles in the bag: that is the bottom of both fractions.',
                  'Hitung dulu semua kelereng dalam kantong: itulah penyebut kedua pecahan.',
                ),
                L(
                  'Orange: 4 favorable marbles. "Not red" can be found as $1-P(\\text{red})$, or by counting the marbles that are not red.',
                  'Oranye: 4 kelereng yang diharapkan. "Bukan merah" dapat dicari sebagai $1-P(\\text{merah})$, atau dengan menghitung kelereng yang bukan merah.',
                ),
                L(
                  'There are 12 marbles. $P(\\text{orange})=\\frac{4}{12}$, to be simplified, and $P(\\text{not red})=1-\\frac{5}{12}$.',
                  'Ada 12 kelereng. $P(\\text{oranye})=\\frac{4}{12}$, yang disederhanakan, dan $P(\\text{bukan merah})=1-\\frac{5}{12}$.',
                ),
              ],
              explain: L(
                'There are $3+4+5=12$ marbles. $P(\\text{orange})=\\frac{4}{12}=\\frac{1}{3}$ and $P(\\text{not red})=1-\\frac{5}{12}=\\frac{7}{12}$, which is also the 7 marbles that are green or orange out of 12.',
                'Ada $3+4+5=12$ kelereng. $P(\\text{oranye})=\\frac{4}{12}=\\frac{1}{3}$ dan $P(\\text{bukan merah})=1-\\frac{5}{12}=\\frac{7}{12}$, yaitu juga 7 kelereng hijau atau oranye dari 12.',
              ),
              solution: {
                en: ['3+4+5=12', 'P(\\text{orange})=\\frac{4}{12}=\\frac{1}{3}', 'P(\\text{not red})=1-\\frac{5}{12}=\\frac{7}{12}'],
                id: ['3+4+5=12', 'P(\\text{oranye})=\\frac{4}{12}=\\frac{1}{3}', 'P(\\text{bukan merah})=1-\\frac{5}{12}=\\frac{7}{12}'],
              },
            },
          ],
        },
        /* ------------------------------------ S2 L2 relative frequency */
        {
          id: 'tka-smp-m7-s2-l2',
          title: L('Relative Frequency and Probability', 'Frekuensi Relatif dan Peluang'),
          goal: L(
            'You can find a relative frequency from an experiment, compare it with the probability from theory, and predict how often an event will happen.',
            'Kamu bisa menentukan frekuensi relatif dari suatu percobaan, membandingkannya dengan peluang menurut teori, dan memperkirakan seberapa sering suatu kejadian akan terjadi.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: What Really Happened', 'Ayo Amati: Apa yang Sebenarnya Terjadi'),
              body: L(
                'Dewi tosses a coin 20 times and gets heads 12 times. The **relative frequency** of heads compares how often it happened with how many tries there were:\n\n$$\\text{relative frequency}=\\frac{\\text{number of times the event happened}}{\\text{number of trials}}$$\n\nHere it is $\\frac{12}{20}=\\frac{3}{5}=0.6=60\\%$.\n\nTheory says $P(\\text{heads})=\\frac{1}{2}$. The two numbers are close, but not equal. Dewi keeps tossing and writes down the results:\n\n| Number of tosses | Heads | Relative frequency |\n|---|---|---|\n| 10 | 7 | 70% |\n| 20 | 12 | 60% |\n| 50 | 27 | 54% |\n| 100 | 52 | 52% |\n| 200 | 102 | 51% |',
                'Dewi melempar sebuah koin 20 kali dan mendapat sisi gambar 12 kali. **Frekuensi relatif** sisi gambar membandingkan seberapa sering kejadian itu muncul dengan banyaknya percobaan:\n\n$$\\text{frekuensi relatif}=\\frac{\\text{banyak kejadian muncul}}{\\text{banyak percobaan}}$$\n\nDi sini nilainya $\\frac{12}{20}=\\frac{3}{5}=0{,}6=60\\%$.\n\nMenurut teori, $P(\\text{gambar})=\\frac{1}{2}$. Kedua bilangan itu dekat, tetapi tidak sama. Dewi terus melempar dan mencatat hasilnya:\n\n| Banyak lemparan | Gambar | Frekuensi relatif |\n|---|---|---|\n| 10 | 7 | 70% |\n| 20 | 12 | 60% |\n| 50 | 27 | 54% |\n| 100 | 52 | 52% |\n| 200 | 102 | 51% |',
              ),
              figure: {
                ...trialSquares(20, 12),
                caption: L(
                  'Each square is one of the 20 tosses: 12 filled squares are heads and 8 empty squares are tails.',
                  'Setiap kotak adalah satu dari 20 lemparan: 12 kotak terisi adalah gambar dan 8 kotak kosong adalah angka.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Compare, Then Predict', 'Contoh Bertahap: Bandingkan, Lalu Perkirakan'),
              body: L(
                'Rudi rolls a die 60 times and gets a six 13 times. Let us compare the experiment with theory, and then predict.\n\n1. Step 1: The relative frequency of a six is $\\frac{13}{60}\\approx0.22$ (rounded to two decimal places).\n2. Step 2: The probability from theory is $P(\\text{six})=\\frac{1}{6}\\approx0.17$.\n3. Step 3: Compare: 0.22 is close to 0.17 but not the same. For only 60 rolls, this is normal.\n4. Step 4: Predict. In $n$ trials we expect about $n\\times P(A)$ results. In 300 rolls: $300\\times\\frac{1}{6}=50$ sixes.\n\n**Remember:**\n\n- A relative frequency comes from an experiment. A probability $P(A)$ comes from theory.\n- Expected number $\\approx n\\times P(A)$. It is a prediction, not a promise.',
                'Rudi melempar sebuah dadu 60 kali dan mendapat angka enam 13 kali. Mari kita bandingkan percobaan dengan teori, lalu membuat perkiraan.\n\n1. Langkah 1: Frekuensi relatif angka enam adalah $\\frac{13}{60}\\approx0{,}22$ (dibulatkan sampai dua tempat desimal).\n2. Langkah 2: Peluang menurut teori adalah $P(\\text{enam})=\\frac{1}{6}\\approx0{,}17$.\n3. Langkah 3: Bandingkan: 0,22 dekat dengan 0,17 tetapi tidak sama. Untuk hanya 60 lemparan, ini wajar.\n4. Langkah 4: Perkirakan. Dalam $n$ percobaan kita mengharapkan sekitar $n\\times P(A)$ kejadian. Dalam 300 lemparan: $300\\times\\frac{1}{6}=50$ kali angka enam.\n\n**Ingat:**\n\n- Frekuensi relatif berasal dari percobaan. Peluang $P(A)$ berasal dari teori.\n- Banyak yang diharapkan $\\approx n\\times P(A)$. Ini perkiraan, bukan kepastian.',
              ),
              figure: {
                ...barChart({
                  bars: ['1', '2', '3', '4', '5', '6'].map((label, i) => ({ label, value: [9, 11, 10, 8, 9, 13][i], color: (i === 5 ? 'result' : 'a') as FigColor })),
                  max: 14,
                  step: 2,
                }),
                caption: L(
                  'The results of 60 rolls. The red bar is the six: it came up 13 times.',
                  'Hasil 60 lemparan. Batang merah adalah angka enam: muncul 13 kali.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Luck Evens Out Slowly', 'Awas, Jebakan!: Keberuntungan Merata Secara Perlahan'),
              body: L(
                'The more trials, the closer the relative frequency usually gets to the probability. The picture shows Dewi\'s coin results.\n\n| Wrong | Right |\n|---|---|\n| After 10 tosses there are 7 heads, so the coin must be unfair | A small number of trials varies a lot. After 200 tosses the relative frequency is 51%, close to 50% |\n| Three heads in a row, so tails is "due" next | Every toss is new. $P(\\text{tails})$ is still $\\frac{1}{2}$ |\n| The relative frequency must be equal to the probability | They are usually a little different. They come closer as the number of trials grows |',
                'Makin banyak percobaan, frekuensi relatif biasanya makin dekat dengan peluangnya. Gambar menunjukkan hasil lemparan koin Dewi.\n\n| Salah | Benar |\n|---|---|\n| Setelah 10 lemparan ada 7 gambar, jadi koinnya pasti tidak adil | Percobaan yang sedikit sangat bervariasi. Setelah 200 lemparan frekuensi relatifnya 51%, dekat dengan 50% |\n| Tiga kali gambar berturut-turut, jadi angka "giliran" muncul berikutnya | Setiap lemparan baru. $P(\\text{angka})$ tetap $\\frac{1}{2}$ |\n| Frekuensi relatif harus sama dengan peluangnya | Biasanya sedikit berbeda. Keduanya makin dekat ketika banyak percobaan bertambah |',
              ),
              figure: {
                ...lineWithRef({ points: ['10', '20', '50', '100', '200'].map((label, i) => ({ label, value: [70, 60, 54, 52, 51][i] })), max: 80, step: 20 }, 50),
                caption: L(
                  'The relative frequency of heads, in percent, after 10, 20, 50, 100 and 200 tosses. The red dashed line is the probability from theory, 50%.',
                  'Frekuensi relatif sisi gambar, dalam persen, setelah 10, 20, 50, 100, dan 200 lemparan. Garis putus-putus merah adalah peluang menurut teori, 50%.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Rudi rolled a die 50 times. The bar chart shows how often each number came up. What is the relative frequency of rolling a 5?',
                'Rudi melempar sebuah dadu 50 kali. Diagram batang menunjukkan seberapa sering tiap angka muncul. Berapa frekuensi relatif munculnya angka 5?',
              ),
              figure: {
                ...barChart({ bars: bars(['1', '2', '3', '4', '5', '6'], [6, 9, 8, 7, 12, 8], 'a'), max: 14, step: 2 }),
                caption: L('The number of times each face came up in 50 rolls.', 'Banyak kemunculan tiap sisi dalam 50 lemparan.'),
              },
              options: [
                L('$\\frac{6}{25}$', '$\\frac{6}{25}$'),
                L('$\\frac{1}{6}$', '$\\frac{1}{6}$'),
                L('$\\frac{1}{10}$', '$\\frac{1}{10}$'),
                L('$\\frac{6}{19}$', '$\\frac{6}{19}$'),
              ],
              answer: 0,
              explain: L(
                'A 5 came up 12 times in 50 rolls: $\\frac{12}{50}=\\frac{6}{25}$. The fraction $\\frac{1}{6}$ is the probability from theory, $\\frac{1}{10}$ uses the number 5 instead of the count 12, and $\\frac{6}{19}$ divides by the 38 rolls that were not a 5.',
                'Angka 5 muncul 12 kali dalam 50 lemparan: $\\frac{12}{50}=\\frac{6}{25}$. Pecahan $\\frac{1}{6}$ adalah peluang menurut teori, $\\frac{1}{10}$ memakai angka 5 bukan banyak kemunculan 12, dan $\\frac{6}{19}$ membagi dengan 38 lemparan yang bukan angka 5.',
              ),
              hint: L(
                'Read how many times the 5 came up from its bar. The bottom of the fraction is the total number of rolls.',
                'Baca berapa kali angka 5 muncul dari batangnya. Penyebut pecahan adalah banyak seluruh lemparan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a fair coin is tossed 120 times. How many heads do we expect? Then, if 66 heads came up, how many more than expected is that?',
                'Coba bersama: sebuah koin yang adil dilempar 120 kali. Berapa kali sisi gambar diharapkan muncul? Lalu, jika sisi gambar muncul 66 kali, berapa lebihnya dari yang diharapkan?',
              ),
              template: {
                en: '\\frac{1}{2}\\times120=\\ ___,\\qquad 66-\\text{expected}=\\ ___',
                id: '\\frac{1}{2}\\times120=\\ ___,\\qquad 66-\\text{perkiraan}=\\ ___',
              },
              blanks: ['60', '6'],
              explain: L(
                'Expected heads: $\\frac{1}{2}\\times120=60$. The coin showed $66-60=6$ more heads than expected, which is normal.',
                'Perkiraan gambar: $\\frac{1}{2}\\times120=60$. Koin menunjukkan $66-60=6$ gambar lebih banyak dari perkiraan, dan ini wajar.',
              ),
              hint: L(
                'The expected number is the number of trials times the probability of heads.',
                'Banyak yang diharapkan adalah banyak percobaan dikali peluang sisi gambar.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The line chart shows the relative frequency of a six, in percent, for more and more rolls of a fair die. Which statement does the chart support?',
                'Diagram garis menunjukkan frekuensi relatif angka enam, dalam persen, untuk lemparan sebuah dadu yang adil yang makin banyak. Pernyataan mana yang didukung diagram?',
              ),
              figure: {
                ...lineWithRef({ points: ['10', '50', '100', '500', '1000'].map((label, i) => ({ label, value: [30, 24, 20, 18, 17][i] })), max: 40, step: 10 }, (1 / 6) * 100),
                caption: L(
                  'The relative frequency of a six after 10, 50, 100, 500 and 1000 rolls. The red dashed line is 1/6, about 16.7%.',
                  'Frekuensi relatif angka enam setelah 10, 50, 100, 500, dan 1000 lemparan. Garis putus-putus merah adalah 1/6, sekitar 16,7%.',
                ),
              },
              options: [
                L('With more rolls, the relative frequency gets closer to the probability from theory, $\\frac{1}{6}$.', 'Dengan lemparan yang makin banyak, frekuensi relatif makin dekat dengan peluang menurut teori, $\\frac{1}{6}$.'),
                L('10 rolls give the most reliable result, because the relative frequency is highest there.', '10 lemparan memberi hasil yang paling andal, karena frekuensi relatifnya paling tinggi di sana.'),
                L('After 100 rolls the relative frequency stays exactly 20%.', 'Setelah 100 lemparan frekuensi relatifnya tetap tepat 20%.'),
                L('The die is unfair, because the relative frequency was 30% at the start.', 'Dadunya tidak adil, karena frekuensi relatifnya 30% di awal.'),
              ],
              answer: 0,
              explain: L(
                'The points move toward the dashed line, so more rolls bring the relative frequency closer to $\\frac{1}{6}\\approx17\\%$. A small number of rolls is the least reliable, the value keeps changing after 100 rolls, and a high start is normal for few rolls.',
                'Titik-titiknya bergerak mendekati garis putus-putus, jadi lemparan yang makin banyak membuat frekuensi relatif makin dekat dengan $\\frac{1}{6}\\approx17\\%$. Lemparan yang sedikit paling tidak andal, nilainya terus berubah setelah 100 lemparan, dan awal yang tinggi wajar untuk lemparan yang sedikit.',
              ),
              hint: L(
                'Follow the line from left to right. Does it move toward the dashed line or away from it?',
                'Ikuti garis dari kiri ke kanan. Apakah garis itu bergerak mendekati garis putus-putus atau menjauhinya?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Gita draws a card from 10 cards numbered 1 to 10, notes the number and puts the card back. In 40 draws she gets a multiple of 5 nine times. Choose the TWO statements that are true.',
                'Gita mengambil sebuah kartu dari 10 kartu bernomor 1 sampai 10, mencatat nomornya, lalu mengembalikan kartu itu. Dalam 40 pengambilan ia mendapat kelipatan 5 sebanyak sembilan kali. Pilih DUA pernyataan yang benar.',
              ),
              options: [
                L('The relative frequency of a multiple of 5 is $\\frac{9}{40}$.', 'Frekuensi relatif kelipatan 5 adalah $\\frac{9}{40}$.'),
                L('The probability from theory of a multiple of 5 is $\\frac{1}{5}$.', 'Peluang kelipatan 5 menurut teori adalah $\\frac{1}{5}$.'),
                L('The probability from theory of a multiple of 5 is $\\frac{9}{40}$.', 'Peluang kelipatan 5 menurut teori adalah $\\frac{9}{40}$.'),
                L('In the next 100 draws she will get a multiple of 5 exactly 20 times.', 'Dalam 100 pengambilan berikutnya ia pasti mendapat kelipatan 5 tepat 20 kali.'),
              ],
              answer: [0, 1],
              explain: L(
                'Nine out of 40 draws gives the relative frequency $\\frac{9}{40}$. The multiples of 5 are 5 and 10, so theory gives $\\frac{2}{10}=\\frac{1}{5}$. A count like 20 in 100 draws is only a prediction.',
                'Sembilan dari 40 pengambilan memberi frekuensi relatif $\\frac{9}{40}$. Kelipatan 5 adalah 5 dan 10, jadi teori memberi $\\frac{2}{10}=\\frac{1}{5}$. Banyak seperti 20 dalam 100 pengambilan hanyalah perkiraan.',
              ),
              hint: L(
                'One statement comes from what happened, another from counting the cards. Do not mix them up.',
                'Satu pernyataan berasal dari apa yang terjadi, yang lain dari menghitung kartu. Jangan tertukar.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('Relative frequency is the number of times the event happened divided by the number of trials.', 'Frekuensi relatif adalah banyak kejadian muncul dibagi banyak percobaan.'),
                L('A fair coin shows heads three times in a row, so tails is more likely on the next toss.', 'Sebuah koin yang adil menunjukkan gambar tiga kali berturut-turut, jadi angka lebih mungkin muncul pada lemparan berikutnya.'),
                L('In 600 rolls of a fair die, a six is expected about 100 times.', 'Dalam 600 lemparan dadu yang adil, angka enam diharapkan muncul sekitar 100 kali.'),
                L('A relative frequency of 0.6 after 10 tosses proves that the probability of heads is 0.6.', 'Frekuensi relatif 0,6 setelah 10 lemparan membuktikan bahwa peluang gambar adalah 0,6.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Every toss is independent of the earlier ones, so tails is still as likely as heads. Expected sixes are $600\\times\\frac{1}{6}=100$. A few trials prove nothing about the probability, because the result varies a lot.',
                'Setiap lemparan tidak bergantung pada lemparan sebelumnya, jadi angka tetap sama mungkin dengan gambar. Banyak angka enam yang diharapkan adalah $600\\times\\frac{1}{6}=100$. Beberapa percobaan tidak membuktikan apa pun tentang peluang, karena hasilnya sangat bervariasi.',
              ),
              hint: L(
                'Ask: does a toss remember the earlier tosses? And is 10 trials a lot or a little?',
                'Tanyakan: apakah sebuah lemparan mengingat lemparan sebelumnya? Dan apakah 10 percobaan itu banyak atau sedikit?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'This fair spinner has 4 equal sectors, one of them orange. Hasan spins it 80 times and the orange sector comes up 22 times. Find the relative frequency of orange as a fraction, and the number of orange results that theory predicts in 80 spins.',
                'Roda putar yang adil ini punya 4 juring sama besar, satu di antaranya oranye. Hasan memutarnya 80 kali dan juring oranye muncul 22 kali. Cari frekuensi relatif oranye sebagai pecahan, dan banyak hasil oranye yang diperkirakan teori dalam 80 putaran.',
              ),
              figure: {
                ...spinner([
                  { deg: 90, color: 'b' },
                  { deg: 90, color: 'a' },
                  { deg: 90, color: 'c' },
                  { deg: 90, color: 'result' },
                ]),
                caption: L('A fair spinner with 4 equal sectors.', 'Roda putar yang adil dengan 4 juring sama besar.'),
              },
              inline: true,
              blanks: [
                { label: { en: '\\text{relative frequency} =', id: '\\text{frekuensi relatif} =' }, answer: 11 / 40 },
                { label: { en: '\\text{predicted} =', id: '\\text{perkiraan} =' }, answer: 20 },
              ],
              hints: [
                L(
                  'The relative frequency uses what really happened. The prediction uses the probability from theory.',
                  'Frekuensi relatif memakai apa yang benar-benar terjadi. Perkiraan memakai peluang menurut teori.',
                ),
                L(
                  'Relative frequency: times it happened over the number of spins. Probability of orange: 1 sector out of 4 equal sectors.',
                  'Frekuensi relatif: banyak kemunculan dibagi banyak putaran. Peluang oranye: 1 juring dari 4 juring yang sama besar.',
                ),
                L(
                  'Relative frequency $=\\frac{22}{80}$, to be simplified. Prediction $=80\\times\\frac{1}{4}$.',
                  'Frekuensi relatif $=\\frac{22}{80}$, yang disederhanakan. Perkiraan $=80\\times\\frac{1}{4}$.',
                ),
              ],
              explain: L(
                'The relative frequency is $\\frac{22}{80}=\\frac{11}{40}$. Theory gives $P(\\text{orange})=\\frac{1}{4}$, so we expect $80\\times\\frac{1}{4}=20$ orange results. The 22 that really came up is close to that.',
                'Frekuensi relatifnya $\\frac{22}{80}=\\frac{11}{40}$. Teori memberi $P(\\text{oranye})=\\frac{1}{4}$, jadi kita mengharapkan $80\\times\\frac{1}{4}=20$ hasil oranye. Hasil nyata 22 dekat dengan perkiraan itu.',
              ),
              solution: {
                en: ['\\text{relative frequency}=\\frac{22}{80}=\\frac{11}{40}', 'P(\\text{orange})=\\frac{1}{4}', '80\\times\\frac{1}{4}=20'],
                id: ['\\text{frekuensi relatif}=\\frac{22}{80}=\\frac{11}{40}', 'P(\\text{oranye})=\\frac{1}{4}', '80\\times\\frac{1}{4}=20'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m7-s2-p',
        runtime: 'math',
        title: L('Probability in Action', 'Peluang dalam Aksi'),
        brief: L(
          'Find probabilities from equally likely outcomes, use relative frequencies from experiments, and solve a puzzle about a bag of marbles.',
          'Menentukan peluang dari hasil yang sama mungkin, memakai frekuensi relatif dari percobaan, dan memecahkan teka-teki tentang kantong kelereng.',
        ),
        requirements: [
          L('Write the probability of an event as a fraction and use P(not A) = 1 - P(A).', 'Menuliskan peluang suatu kejadian sebagai pecahan dan memakai P(bukan A) = 1 - P(A).'),
          L('Find a relative frequency from an experiment and use n x P to predict how often an event happens.', 'Menentukan frekuensi relatif dari suatu percobaan dan memakai n x P untuk memperkirakan seberapa sering kejadian terjadi.'),
        ],
        hints: [
          L('Count ALL the equally likely outcomes first: that is the bottom of the fraction.', 'Hitung dulu SEMUA hasil yang sama mungkin: itulah penyebut pecahan.'),
          L('Relative frequency uses the results of an experiment. A prediction uses $n\\times P$.', 'Frekuensi relatif memakai hasil percobaan. Perkiraan memakai $n\\times P$.'),
          L('For a puzzle about adding marbles, write the new probability as a fraction with the new numbers.', 'Untuk teka-teki tentang menambah kelereng, tulis peluang yang baru sebagai pecahan dengan bilangan yang baru.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'A fair spinner has 8 equal sectors numbered 1 to 8. Find the probability that it stops on a number greater than 5, and the probability that it does NOT.',
              'Sebuah roda putar yang adil punya 8 juring sama besar bernomor 1 sampai 8. Cari peluang roda putar berhenti pada bilangan yang lebih besar dari 5, dan peluang roda putar TIDAK berhenti di bilangan itu.',
            ),
            figure: {
              ...spinner([1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => ({ deg: 45, color: (i % 2 === 0 ? 'a' : 'c') as FigColor, label: String(n) }))),
              caption: L('A fair spinner with 8 equal sectors.', 'Roda putar yang adil dengan 8 juring sama besar.'),
            },
            inline: true,
            blanks: [
              { label: { en: 'P(\\text{greater than 5}) =', id: 'P(\\text{lebih dari 5}) =' }, answer: 3 / 8 },
              { label: { en: 'P(\\text{not greater than 5}) =', id: 'P(\\text{tidak lebih dari 5}) =' }, answer: 5 / 8 },
            ],
            solution: {
              en: ['\\text{favorable}: 6, 7, 8 \\Rightarrow P=\\frac{3}{8}', 'P(\\text{not})=1-\\frac{3}{8}=\\frac{5}{8}'],
              id: ['\\text{diharapkan}: 6, 7, 8 \\Rightarrow P=\\frac{3}{8}', 'P(\\text{bukan})=1-\\frac{3}{8}=\\frac{5}{8}'],
            },
          },
          {
            prompt: L(
              'A bag holds 6 green, 9 orange and 5 red marbles. One marble is picked at random. Find the probability of picking a red marble and the probability of NOT picking an orange marble.',
              'Sebuah kantong berisi 6 kelereng hijau, 9 kelereng oranye, dan 5 kelereng merah. Satu kelereng diambil secara acak. Cari peluang terambilnya kelereng merah dan peluang TIDAK terambilnya kelereng oranye.',
            ),
            figure: {
              ...bag([{ n: 6, color: 'a' }, { n: 9, color: 'b' }, { n: 5, color: 'result' }]),
              caption: L('The bag: 6 green, 9 orange and 5 red marbles.', 'Kantongnya: 6 kelereng hijau, 9 kelereng oranye, dan 5 kelereng merah.'),
            },
            inline: true,
            blanks: [
              { label: { en: 'P(\\text{red}) =', id: 'P(\\text{merah}) =' }, answer: 1 / 4 },
              { label: { en: 'P(\\text{not orange}) =', id: 'P(\\text{bukan oranye}) =' }, answer: 11 / 20 },
            ],
            solution: {
              en: ['6+9+5=20', 'P(\\text{red})=\\frac{5}{20}=\\frac{1}{4}', 'P(\\text{not orange})=1-\\frac{9}{20}=\\frac{11}{20}'],
              id: ['6+9+5=20', 'P(\\text{merah})=\\frac{5}{20}=\\frac{1}{4}', 'P(\\text{bukan oranye})=1-\\frac{9}{20}=\\frac{11}{20}'],
            },
          },
          {
            prompt: L(
              'A factory tests 500 light bulbs and finds that 15 are faulty. Find the relative frequency of a faulty bulb as a fraction. Then predict how many faulty bulbs there will be in a delivery of 12,000 bulbs.',
              'Sebuah pabrik menguji 500 bola lampu dan menemukan 15 yang rusak. Cari frekuensi relatif bola lampu rusak sebagai pecahan. Lalu perkirakan banyak bola lampu rusak dalam kiriman 12.000 bola lampu.',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{relative frequency} =', id: '\\text{frekuensi relatif} =' }, answer: 3 / 100 },
              { label: { en: '\\text{predicted faulty} =', id: '\\text{perkiraan rusak} =' }, answer: 360 },
            ],
            solution: {
              en: ['\\text{relative frequency}=\\frac{15}{500}=\\frac{3}{100}', '12\\,000\\times\\frac{3}{100}=360'],
              id: ['\\text{frekuensi relatif}=\\frac{15}{500}=\\frac{3}{100}', '12\\,000\\times\\frac{3}{100}=360'],
            },
          },
          {
            prompt: L(
              'A bag holds 3 green and 5 orange marbles. How many orange marbles must be added so that the probability of picking an orange marble becomes $\\frac{3}{4}$? How many marbles are then in the bag?',
              'Sebuah kantong berisi 3 kelereng hijau dan 5 kelereng oranye. Berapa kelereng oranye yang harus ditambahkan agar peluang terambilnya kelereng oranye menjadi $\\frac{3}{4}$? Berapa banyak kelereng dalam kantong setelah itu?',
            ),
            figure: {
              ...bag([{ n: 3, color: 'a' }, { n: 5, color: 'b' }], 4),
              caption: L('The bag at the start: 3 green and 5 orange marbles.', 'Kantong pada awalnya: 3 kelereng hijau dan 5 kelereng oranye.'),
            },
            inline: true,
            blanks: [
              { label: { en: '\\text{orange to add} =', id: '\\text{oranye yang ditambah} =' }, answer: 4 },
              { label: { en: '\\text{marbles in the bag} =', id: '\\text{kelereng dalam kantong} =' }, answer: 12 },
            ],
            solution: {
              en: ['\\text{the 3 green marbles must be } 1-\\frac{3}{4}=\\frac{1}{4} \\text{ of all}', '3\\times4=12 \\text{ marbles in the bag}', '12-8=4 \\text{ orange marbles to add}'],
              id: ['\\text{3 kelereng hijau harus menjadi } 1-\\frac{3}{4}=\\frac{1}{4} \\text{ dari seluruhnya}', '3\\times4=12 \\text{ kelereng dalam kantong}', '12-8=4 \\text{ kelereng oranye yang ditambah}'],
            },
          },
        ],
      },
    },
  ],
}
