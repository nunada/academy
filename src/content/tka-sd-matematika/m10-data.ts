import type { Loc, MathBlank, Module } from '../types'
import type { FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import { barChart, fit, line, outline, pictogram, rectPts, solid, txt } from './figs'

/** Module 10 — data: presenting data (tally, frequency table, pictogram, bar chart)
 *  and using it (reading information, comparing, totals, changes and conclusions). */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

type BarOpts = Parameters<typeof barChart>[0]

/** Bars from parallel lists of labels and values. */
const bars = (labels: string[], values: number[]): BarOpts['bars'] => labels.map((label, i) => ({ label, value: values[i] }))

/** Tally marks: every fifth stroke crosses the four before it. One row per name. */
function tally(rows: { label: string; count: number }[]): Piece {
  const items: FigItem[] = []
  const gap = 1.7
  const n = rows.length
  let maxX = 1
  rows.forEach((r, i) => {
    const y = (n - 1 - i) * gap
    items.push(txt(-0.4, y + 0.55, r.label, 'md', 'muted', 'end'))
    const groups = Math.floor(r.count / 5)
    const rest = r.count % 5
    let x = 0.3
    for (let g = 0; g < groups; g++) {
      for (let k = 0; k < 4; k++) items.push(line([x + k * 0.45, y + 0.05], [x + k * 0.45, y + 1.05], 'a', { width: 3.5 }))
      items.push(line([x - 0.2, y + 0.2], [x + 3 * 0.45 + 0.2, y + 0.9], 'b', { width: 3.5 }))
      x += 2.1
    }
    for (let k = 0; k < rest; k++) items.push(line([x + k * 0.45, y + 0.05], [x + k * 0.45, y + 1.05], 'a', { width: 3.5 }))
    x += rest * 0.45
    maxX = Math.max(maxX, x)
  })
  return { dim: 2, axes: false, ...fit([[-3.4, -0.3], [maxX + 0.2, (n - 1) * gap + 1.3]], 0.4), items }
}

/** A pictogram with its key drawn under it: one square stands for `per`. */
function pict(rows: { label: string; count: number }[], per: number): Piece {
  const p = pictogram({ rows, key: `= ${per}` })
  return { ...p, items: [...p.items, solid(rectPts(-1.1, -1.3, 0.9, 0.8), 'muted')] }
}

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

/** A bar chart with one row of boxed numbers under the bars, one box under each bar. */
function chartWithBoxes(o: BarOpts, boxes: number[]): Piece {
  const p = barChart(o)
  const xEnd = o.bars.length * 1.7 + 0.4
  const items: FigItem[] = [...p.items]
  boxes.forEach((n, i) => {
    const x = 0.5 + i * 1.7
    items.push(outline(rectPts(x, -2.3, 1, 1), 'b'))
    items.push(txt(x + 0.5, -1.8, String(n), 'md', 'b'))
  })
  return { dim: 2, axes: false, ...fit([[-1.2, -2.5], [xEnd + 0.3, 6.6]], 0.3), items }
}

/** Two boxes for a fraction in simplest form: numerator, then denominator. */
const fracBlanks = (n: number, d: number): MathBlank[] => [
  { label: { en: '\\text{numerator} =', id: '\\text{pembilang} =' }, answer: n },
  { label: { en: '\\text{denominator} =', id: '\\text{penyebut} =' }, answer: d },
]

const NAMES4 = ['Ani', 'Budi', 'Citra', 'Dewi']
const NAMES5 = ['Ani', 'Budi', 'Citra', 'Dewi', 'Eko']
const DAYS5 = ['1', '2', '3', '4', '5']

const AFTER = {
  books: { en: '\\text{ books}', id: '\\text{ buku}' },
  stickers: { en: '\\text{ stickers}', id: '\\text{ stiker}' },
  squares: { en: '\\text{ squares}', id: '\\text{ kotak}' },
  votes: { en: '\\text{ votes}', id: '\\text{ suara}' },
  kg: '\\text{ kg}',
  eggs: { en: '\\text{ eggs}', id: '\\text{ butir}' },
  visitors: { en: '\\text{ visitors}', id: '\\text{ pengunjung}' },
}

/* -------------------------------------------------------------- module */

export const module10: Module = {
  id: 'tka-m10',
  title: L('Data', 'Data'),
  summary: L(
    'Collect data with tally marks, show it in frequency tables, pictograms and bar charts, then read it, compare it and draw conclusions from it.',
    'Mengumpulkan data dengan turus, menyajikannya dalam tabel frekuensi, piktogram, dan diagram batang, lalu membacanya, membandingkannya, dan menarik kesimpulan darinya.',
  ),
  submodules: [
    /* ============================================================ S1: presenting data */
    {
      id: 'tka-m10-s1',
      title: L('Presenting Data', 'Menyajikan Data'),
      summary: L(
        'Tally marks and frequency tables, pictograms with a key, and bar charts with their scale.',
        'Turus dan tabel frekuensi, piktogram dengan kunci, serta diagram batang dengan skalanya.',
      ),
      lessons: [
        /* ------------------------------------- S1 L1 frequency tables and pictograms */
        {
          id: 'tka-m10-s1-l1',
          title: L('Frequency Tables and Pictograms', 'Tabel Frekuensi dan Piktogram'),
          goal: L(
            'You can collect data with tally marks, write a frequency table, and read and make a pictogram with a key.',
            'Kamu bisa mengumpulkan data dengan turus, menulis tabel frekuensi, serta membaca dan membuat piktogram dengan kunci.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Counting with Tally Marks', 'Ayo Amati: Menghitung dengan Turus'),
              body: L(
                'Class 6 chooses a class leader. Each child says one name, and the teacher draws one little stroke for every vote. These strokes are called **tally marks**. Every fifth stroke crosses the four before it, so you can count in fives.\n\nThe number of votes for each name is its **frequency**. When the frequencies are written neatly, we get a **frequency table**.\n\n| Name | Frequency |\n|---|---|\n| Ani | 7 |\n| Budi | 5 |\n| Citra | 8 |\n| Total | 20 |\n\nNumbers collected like this are called **data**. The total of all the frequencies is the number of children who were asked.',
                'Kelas 6 memilih ketua kelas. Setiap anak menyebut satu nama, dan bu guru menggambar satu garis kecil untuk setiap suara. Garis-garis kecil ini disebut **turus**. Setiap garis kelima dicoret miring melewati empat garis sebelumnya, jadi kita bisa menghitung loncat 5.\n\nBanyak suara untuk setiap nama disebut **frekuensi**. Kalau semua frekuensi ditulis dengan rapi, kita mendapat **tabel frekuensi**.\n\n| Nama | Frekuensi |\n|---|---|\n| Ani | 7 |\n| Budi | 5 |\n| Citra | 8 |\n| Jumlah | 20 |\n\nAngka-angka yang dikumpulkan seperti ini disebut **data**. Jumlah semua frekuensi sama dengan banyak anak yang ditanya.',
              ),
              figure: {
                ...tally([{ label: 'Ani', count: 7 }, { label: 'Budi', count: 5 }, { label: 'Citra', count: 8 }]),
                caption: L(
                  'The votes as tally marks. Ani has one group of five and two more strokes.',
                  'Suara-suara dalam bentuk turus. Ani punya satu kelompok lima dan dua garis lagi.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Making a Pictogram', 'Contoh Bertahap: Membuat Piktogram'),
              body: L(
                'The class library counted the books four children read this month: Ani 40, Budi 25, Citra 30 and Dewi 15. Let us show this in a **pictogram**, a picture that uses symbols to show data.\n\n1. Step 1: Choose the **key**: 1 square = 10 books. A half square means 5 books.\n2. Step 2: Divide each number by 10. Ani: $40 \\div 10 = 4$ squares. Budi: $25 \\div 10 = 2.5$ squares.\n3. Step 3: Citra: $30 \\div 10 = 3$ squares. Dewi: $15 \\div 10 = 1.5$ squares.\n4. Step 4: Draw the squares, and write the key under the picture.\n\n**Remember:**\n\n- The key tells you what one square is worth. Without the key the picture cannot be read.\n- Number of books = number of squares $\\times$ value of one square.\n- A half square is half of the key.',
                'Perpustakaan kelas menghitung buku yang dibaca empat anak bulan ini: Ani 40, Budi 25, Citra 30, dan Dewi 15. Mari kita sajikan dalam **piktogram**, yaitu gambar yang memakai simbol untuk menunjukkan data.\n\n1. Langkah 1: Tentukan **kunci**: 1 kotak = 10 buku. Setengah kotak berarti 5 buku.\n2. Langkah 2: Bagi tiap angka dengan 10. Ani: $40 \\div 10 = 4$ kotak. Budi: $25 \\div 10 = 2{,}5$ kotak.\n3. Langkah 3: Citra: $30 \\div 10 = 3$ kotak. Dewi: $15 \\div 10 = 1{,}5$ kotak.\n4. Langkah 4: Gambar kotaknya, lalu tulis kuncinya di bawah gambar.\n\n**Ingat:**\n\n- Kunci memberi tahu nilai satu kotak. Tanpa kunci, gambar tidak bisa dibaca.\n- Banyak buku = banyak kotak $\\times$ nilai satu kotak.\n- Setengah kotak sama dengan setengah dari kunci.',
              ),
              figure: {
                ...pict([{ label: 'Ani', count: 4 }, { label: 'Budi', count: 2.5 }, { label: 'Citra', count: 3 }, { label: 'Dewi', count: 1.5 }], 10),
                caption: L(
                  'Books read this month. The key at the bottom: one square = 10 books.',
                  'Buku yang dibaca bulan ini. Kunci di bagian bawah: satu kotak = 10 buku.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Ignoring the Key', 'Awas, Jebakan!: Lupa Membaca Kunci'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| Ani has 4 squares, so she read 4 books | Read the key first: $4 \\times 10 = 40$ books |\n| A half square counts as a whole square, so 2.5 squares is 3 squares | A half square is half of the key, which is 5 books |\n| 3 groups of five and 2 strokes is $3 + 2 = 5$ | Each group is worth 5: $3 \\times 5 + 2 = 17$ |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| Ani punya 4 kotak, jadi ia membaca 4 buku | Baca kuncinya dulu: $4 \\times 10 = 40$ buku |\n| Setengah kotak dihitung satu kotak penuh, jadi 2,5 kotak menjadi 3 kotak | Setengah kotak adalah setengah dari kunci, yaitu 5 buku |\n| 3 kelompok lima dan 2 garis adalah $3 + 2 = 5$ | Setiap kelompok bernilai 5: $3 \\times 5 + 2 = 17$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The pictogram shows how many marbles four children have. How many marbles does Gita have?',
                'Piktogram menunjukkan banyak kelereng empat anak. Berapa kelereng yang dimiliki Gita?',
              ),
              figure: {
                ...pict([{ label: 'Eko', count: 2 }, { label: 'Fitri', count: 4 }, { label: 'Gita', count: 3.5 }, { label: 'Hasan', count: 1 }], 10),
                caption: L(
                  'Marbles. The key at the bottom: one square = 10 marbles.',
                  'Kelereng. Kunci di bagian bawah: satu kotak = 10 kelereng.',
                ),
              },
              options: [L('35', '35'), L('3.5', '3,5'), L('40', '40'), L('30', '30')],
              answer: 0,
              explain: L(
                'Gita has 3 whole squares and a half square: $3 \\times 10 + 5 = 35$. The number 3.5 is only the number of squares, 40 counts the half square as a whole one, and 30 forgets the half square.',
                'Gita punya 3 kotak penuh dan setengah kotak: $3 \\times 10 + 5 = 35$. Angka 3,5 hanya banyak kotaknya, 40 menghitung setengah kotak sebagai satu kotak penuh, dan 30 melupakan setengah kotaknya.',
              ),
              hint: L(
                'Look at the key first: what is one square worth? Then think about what a half square is worth.',
                'Lihat kuncinya dulu: berapa nilai satu kotak? Lalu pikirkan berapa nilai setengah kotak.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: in the pictogram of books, Budi\'s row has 2 whole squares and 1 half square. One square is 10 books. How many books did Budi read?',
                'Coba bersama: pada piktogram buku, baris Budi punya 2 kotak penuh dan 1 setengah kotak. Satu kotak adalah 10 buku. Berapa buku yang dibaca Budi?',
              ),
              figure: {
                ...pict([{ label: 'Ani', count: 4 }, { label: 'Budi', count: 2.5 }, { label: 'Citra', count: 3 }, { label: 'Dewi', count: 1.5 }], 10),
                caption: L('Books read. One square = 10 books.', 'Buku yang dibaca. Satu kotak = 10 buku.'),
              },
              template: '2 \\times 10 = ___ \\qquad 20 + ___ = 25',
              blanks: ['20', '5'],
              explain: L(
                'Two whole squares are 20 books, and the half square adds 5 books: 25 books in all.',
                'Dua kotak penuh adalah 20 buku, dan setengah kotak menambah 5 buku: seluruhnya 25 buku.',
              ),
              hint: L(
                'Count the whole squares times 10 first. Then add what a half square is worth.',
                'Hitung dulu kotak penuh dikali 10. Lalu tambahkan nilai setengah kotak.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The frequency table shows how many brothers and sisters the children in a class have. The top row is the number of brothers and sisters, and the bottom row is the number of children. How many children were asked in all?',
                'Tabel frekuensi menunjukkan banyak saudara kandung anak-anak di satu kelas. Baris atas adalah banyak saudara kandung, dan baris bawah adalah banyak anak. Berapa anak yang ditanya seluruhnya?',
              ),
              figure: {
                ...gridTable([['0', '1', '2', '3'], ['5', '9', '4', '2']], { cw: 2 }),
                caption: L(
                  'Top row: brothers and sisters. Bottom row: children.',
                  'Baris atas: saudara kandung. Baris bawah: anak.',
                ),
              },
              options: [L('20 children', '20 anak'), L('6 children', '6 anak'), L('9 children', '9 anak'), L('4 children', '4 anak')],
              answer: 0,
              explain: L(
                'Add the frequencies, which is the bottom row: $5 + 9 + 4 + 2 = 20$. Adding the top row ($0 + 1 + 2 + 3 = 6$) adds up the numbers of brothers and sisters, not the children.',
                'Jumlahkan frekuensinya, yaitu baris bawah: $5 + 9 + 4 + 2 = 20$. Menjumlahkan baris atas ($0 + 1 + 2 + 3 = 6$) hanya menjumlahkan banyak saudara kandung, bukan banyak anak.',
              ),
              hint: L(
                'Each number in the bottom row is a group of children. How can you find all the children together?',
                'Setiap angka di baris bawah adalah sekelompok anak. Bagaimana cara mencari semua anak sekaligus?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose TWO correct statements about the pictogram.', 'Pilih DUA pernyataan yang benar tentang piktogram ini.'),
              figure: {
                ...pict([{ label: 'Ani', count: 3 }, { label: 'Budi', count: 4.5 }, { label: 'Citra', count: 2 }, { label: 'Dewi', count: 4 }], 10),
                caption: L(
                  'Books read this month. One square = 10 books.',
                  'Buku yang dibaca bulan ini. Satu kotak = 10 buku.',
                ),
              },
              options: [
                L('Budi read 45 books.', 'Budi membaca 45 buku.'),
                L('Ani and Citra read 50 books together.', 'Ani dan Citra membaca 50 buku bersama-sama.'),
                L('Dewi read 4 books.', 'Dewi membaca 4 buku.'),
                L('Citra read more books than Ani.', 'Citra membaca lebih banyak buku daripada Ani.'),
              ],
              answer: [0, 1],
              explain: L(
                'Budi: $4.5 \\times 10 = 45$. Ani and Citra: $30 + 20 = 50$. Dewi read $4 \\times 10 = 40$ books, not 4, and Citra read 20 books, which is fewer than Ani\'s 30.',
                'Budi: $4{,}5 \\times 10 = 45$. Ani dan Citra: $30 + 20 = 50$. Dewi membaca $4 \\times 10 = 40$ buku, bukan 4, dan Citra membaca 20 buku, lebih sedikit daripada 30 buku milik Ani.',
              ),
              hint: L(
                'Change every row into a number of books with the key before you decide.',
                'Ubah dulu setiap baris menjadi banyak buku dengan kunci, baru tentukan.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: L(
                'Put the steps in order for making a frequency table from a class survey.',
                'Urutkan langkah membuat tabel frekuensi dari survei di kelas.',
              ),
              lines: {
                en: [
                  'Ask every child and draw one tally stroke for each answer.',
                  'Count each row of tally marks: the groups of five first, then the rest.',
                  'Write the counts in a table. These are the frequencies.',
                  'Add all the frequencies and check that the total is the number of children asked.',
                ],
                id: [
                  'Tanya setiap anak dan gambar satu garis turus untuk setiap jawaban.',
                  'Hitung tiap baris turus: kelompok lima dulu, lalu sisanya.',
                  'Tulis hasil hitungan di dalam tabel. Itulah frekuensinya.',
                  'Jumlahkan semua frekuensi dan periksa bahwa jumlahnya sama dengan banyak anak yang ditanya.',
                ],
              },
              explain: L(
                'First collect the answers, then count, then write the table, and last check the total.',
                'Pertama kumpulkan jawaban, lalu hitung, lalu tulis tabelnya, dan terakhir periksa jumlahnya.',
              ),
              hint: L(
                'You cannot count before you have asked, and you check the total only at the very end.',
                'Kamu belum bisa menghitung sebelum bertanya, dan jumlah diperiksa paling akhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The pictogram shows how many stickers four children have. How many stickers do Fitri and Gita have together?',
                'Piktogram menunjukkan banyak stiker empat anak. Berapa stiker yang dimiliki Fitri dan Gita bersama-sama?',
              ),
              figure: {
                ...pict([{ label: 'Eko', count: 3 }, { label: 'Fitri', count: 4.5 }, { label: 'Gita', count: 2 }, { label: 'Hasan', count: 3.5 }], 20),
                caption: L('Stickers. One square = 20 stickers.', 'Stiker. Satu kotak = 20 stiker.'),
              },
              blanks: [{ answer: 130, after: AFTER.stickers }],
              hints: [
                L('Look at the key under the picture. How many stickers is one square?', 'Lihat kunci di bawah gambar. Satu kotak berapa stiker?'),
                L('Find the number of squares for Fitri and for Gita. A half square is half of the key.', 'Cari banyak kotak untuk Fitri dan untuk Gita. Setengah kotak adalah setengah dari kunci.'),
                L('Fitri has 4.5 squares and Gita has 2 squares. Change both to stickers, then add.', 'Fitri punya 4,5 kotak dan Gita punya 2 kotak. Ubah keduanya menjadi stiker, lalu jumlahkan.'),
              ],
              explain: L(
                'Fitri: $4.5 \\times 20 = 90$ stickers. Gita: $2 \\times 20 = 40$ stickers. Together: $90 + 40 = 130$.',
                'Fitri: $4{,}5 \\times 20 = 90$ stiker. Gita: $2 \\times 20 = 40$ stiker. Bersama-sama: $90 + 40 = 130$.',
              ),
              solution: {
                en: ['\\text{Fitri: } 4.5 \\times 20 = 90', '\\text{Gita: } 2 \\times 20 = 40', '90 + 40 = 130'],
                id: ['\\text{Fitri: } 4{,}5 \\times 20 = 90', '\\text{Gita: } 2 \\times 20 = 40', '90 + 40 = 130'],
              },
            },
          ],
        },
        /* ------------------------------------------------ S1 L2 bar charts */
        {
          id: 'tka-m10-s1-l2',
          title: L('Bar Charts', 'Diagram Batang'),
          goal: L(
            'You can name the parts of a bar chart, read bars on any scale, pick a sensible scale, and tell which statements a chart supports.',
            'Kamu bisa menyebut bagian-bagian diagram batang, membaca batang pada skala apa pun, memilih skala yang masuk akal, dan menentukan pernyataan yang didukung diagram.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: The Parts of a Bar Chart', 'Ayo Amati: Bagian-Bagian Diagram Batang'),
              body: L(
                'Eko, Fitri, Gita and Hasan count their marbles. A **bar chart** shows the data with bars. The taller the bar, the bigger the number.\n\nA bar chart has these parts:\n\n- The **title** says what the chart is about. Here the caption under the picture tells it: marbles of four children.\n- The **vertical axis** carries the numbers. The **scale** is how much the numbers go up from one line to the next. Here the scale goes up by 10.\n- The **horizontal axis** names each bar.\n- Each **bar** is as high as its value.\n\nTo read a bar, look at the top of the bar and then across to the numbers on the left.',
                'Eko, Fitri, Gita, dan Hasan menghitung kelereng mereka. **Diagram batang** menyajikan data dengan batang. Makin tinggi batangnya, makin besar angkanya.\n\nDiagram batang punya bagian-bagian berikut:\n\n- **Judul** menjelaskan tentang apa diagram itu. Di sini keterangan di bawah gambar yang menyebutkannya: kelereng empat anak.\n- **Sumbu tegak** memuat angka-angka. **Skala** adalah kenaikan angka dari satu garis ke garis berikutnya. Di sini skalanya naik 10.\n- **Sumbu mendatar** memberi nama setiap batang.\n- Setiap **batang** setinggi nilainya.\n\nUntuk membaca batang, lihat ujung atas batang, lalu geser mata ke angka di sebelah kiri.',
              ),
              figure: {
                ...barChart({ bars: bars(['Eko', 'Fitri', 'Gita', 'Hasan'], [30, 50, 20, 40]), max: 60, step: 10 }),
                caption: L(
                  'Marbles of four children. The scale goes up by 10.',
                  'Kelereng empat anak. Skalanya naik 10.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Reading a Bar on a Bigger Scale', 'Contoh Bertahap: Membaca Batang pada Skala yang Lebih Besar'),
              body: L(
                'This chart shows how many stickers four children have. The scale goes up by 20. How many stickers does Budi have?\n\n1. Step 1: Look at the scale. The numbers are 0, 20, 40, 60, 80, 100, so every line is 20 more than the line before.\n2. Step 2: Find the top of Budi\'s bar and look across to the numbers.\n3. Step 3: The top is between the lines 80 and 100. It does not touch a line.\n4. Step 4: It is exactly halfway, so $(80 + 100) \\div 2 = 90$. Budi has 90 stickers.\n\n**Remember:**\n\n- Read the numbers on the axis. Do not count the lines.\n- If the top of a bar is between two lines, find the halfway number.\n- Halfway = the lower line + half of the scale.',
                'Diagram ini menunjukkan banyak stiker empat anak. Skalanya naik 20. Berapa stiker yang dimiliki Budi?\n\n1. Langkah 1: Lihat skalanya. Angkanya 0, 20, 40, 60, 80, 100, jadi setiap garis lebih besar 20 daripada garis sebelumnya.\n2. Langkah 2: Cari ujung atas batang Budi, lalu geser mata ke angka-angkanya.\n3. Langkah 3: Ujungnya berada di antara garis 80 dan 100. Ujung itu tidak menyentuh garis.\n4. Langkah 4: Ujungnya tepat di tengah, jadi $(80 + 100) \\div 2 = 90$. Budi punya 90 stiker.\n\n**Ingat:**\n\n- Baca angka pada sumbu. Jangan menghitung banyak garis.\n- Kalau ujung batang berada di antara dua garis, cari angka di tengahnya.\n- Tengah = garis bawah + setengah dari skala.',
              ),
              figure: {
                ...barChart({ bars: bars(NAMES4, [60, 90, 70, 40]), max: 100, step: 20, showValues: false }),
                caption: L(
                  'Stickers of four children. The scale goes up by 20.',
                  'Stiker empat anak. Skalanya naik 20.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Lines, Not Numbers', 'Awas, Jebakan!: Garis, Bukan Angka'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| The scale goes up by 5 and the bar reaches the 3rd line, so the value is 3 | Read the number at the line: $3 \\times 5 = 15$ |\n| A bar ends exactly between 40 and 60, so it is 60 | The top is halfway between the lines, so the value is 50 |\n| The biggest value is 75, but the scale stops at 60 | The scale must reach at least the biggest value, for example up to 80 in steps of 10 |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| Skalanya naik 5 dan batang sampai garis ke-3, jadi nilainya 3 | Baca angka pada garisnya: $3 \\times 5 = 15$ |\n| Batang berujung tepat di antara 40 dan 60, jadi nilainya 60 | Ujungnya tepat di tengah kedua garis, jadi nilainya 50 |\n| Nilai terbesar 75, tetapi skalanya berhenti di 60 | Skala harus sampai paling sedikit nilai terbesar, misalnya sampai 80 dengan loncatan 10 |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bar chart shows the number of stickers of four children. The scale goes up by 20. How many stickers does Budi have?',
                'Diagram batang menunjukkan banyak stiker empat anak. Skalanya naik 20. Berapa stiker yang dimiliki Budi?',
              ),
              figure: {
                ...barChart({ bars: bars(NAMES4, [80, 50, 100, 40]), max: 100, step: 20, showValues: false }),
                caption: L(
                  'Stickers. Look at where the top of each bar is.',
                  'Stiker. Perhatikan di mana ujung atas tiap batang.',
                ),
              },
              options: [L('50', '50'), L('40', '40'), L('60', '60'), L('2.5', '2,5')],
              answer: 0,
              explain: L(
                'The top of Budi\'s bar is halfway between 40 and 60, so it is 50. Reading 40 or 60 takes a line instead of the halfway point, and 2.5 counts lines instead of reading the numbers.',
                'Ujung batang Budi tepat di tengah antara 40 dan 60, jadi nilainya 50. Membaca 40 atau 60 berarti mengambil garis, bukan titik tengahnya, dan 2,5 menghitung garis, bukan membaca angkanya.',
              ),
              hint: L(
                'The top of the bar does not touch a line. Which two lines is it between, and where in the middle is it?',
                'Ujung batang tidak menyentuh garis. Berada di antara dua garis yang mana, dan di bagian tengah mana?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: in the stickers chart, Citra\'s bar ends between the lines 60 and 80. Find the scale, then the value of her bar.',
                'Coba bersama: pada diagram stiker, batang Citra berujung di antara garis 60 dan 80. Cari skalanya, lalu nilai batangnya.',
              ),
              figure: {
                ...barChart({ bars: bars(NAMES4, [60, 90, 70, 40]), max: 100, step: 20, showValues: false }),
                caption: L(
                  'The same chart of stickers. The scale goes up by 20.',
                  'Diagram stiker yang sama. Skalanya naik 20.',
                ),
              },
              template: {
                en: '\\text{scale: } 80 - 60 = ___ \\qquad \\text{bar: } 60 + ___ \\div 2 = ___',
                id: '\\text{skala: } 80 - 60 = ___ \\qquad \\text{batang: } 60 + ___ \\div 2 = ___',
              },
              blanks: ['20', '20', '70'],
              explain: L(
                'The scale is $80 - 60 = 20$. Halfway is the lower line plus half of the scale: $60 + 20 \\div 2 = 70$.',
                'Skalanya $80 - 60 = 20$. Titik tengah adalah garis bawah ditambah setengah skala: $60 + 20 \\div 2 = 70$.',
              ),
              hint: L(
                'The scale is the difference between two neighboring lines. Half of the scale is added to the lower line.',
                'Skala adalah selisih dua garis yang bersebelahan. Setengah dari skala ditambahkan ke garis bawah.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Eko sold 35 notebooks. The guide lines of a chart are 10, 20, 30, 40 and 50. Four bars were drawn. Which bar shows Eko\'s 35 notebooks?',
                'Eko menjual 35 buku tulis. Garis bantu pada diagram adalah 10, 20, 30, 40, dan 50. Empat batang sudah digambar. Batang mana yang menunjukkan 35 buku tulis milik Eko?',
              ),
              figure: {
                ...barChart({ bars: bars(['P', 'Q', 'R', 'S'], [40, 30, 35, 25]), max: 50, step: 10, showValues: false }),
                caption: L(
                  'Four bars named P, Q, R and S.',
                  'Empat batang bernama P, Q, R, dan S.',
                ),
              },
              options: [L('Bar R', 'Batang R'), L('Bar P', 'Batang P'), L('Bar Q', 'Batang Q'), L('Bar S', 'Batang S')],
              answer: 0,
              explain: L(
                '35 is halfway between the lines 30 and 40, and only bar R ends there. Bar P ends on 40, bar Q ends on 30, and bar S ends halfway between 20 and 30.',
                '35 tepat di tengah antara garis 30 dan 40, dan hanya batang R yang berujung di situ. Batang P berujung di 40, batang Q berujung di 30, dan batang S berujung di tengah antara 20 dan 30.',
              ),
              hint: L(
                'Find the number 35 on the axis. Which two lines is it between, and is it closer to either of them?',
                'Cari angka 35 pada sumbu. Berada di antara dua garis yang mana, dan apakah lebih dekat ke salah satunya?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: L(
                'The table shows the kilograms of rice sold by four stalls. Which scale is the most sensible for a bar chart of this table?',
                'Tabel menunjukkan kilogram beras yang dijual empat warung. Skala mana yang paling masuk akal untuk diagram batang dari tabel ini?',
              ),
              figure: {
                ...gridTable([['Ani', 'Budi', 'Citra', 'Dewi'], ['150', '300', '250', '100']], { cw: 2.4 }),
                caption: L(
                  'Top row: the stalls. Bottom row: kilograms of rice.',
                  'Baris atas: warung-warung. Baris bawah: kilogram beras.',
                ),
              },
              options: [
                L('Up to 300 in steps of 50', 'Sampai 300 dengan loncatan 50'),
                L('Up to 200 in steps of 50', 'Sampai 200 dengan loncatan 50'),
                L('Up to 300 in steps of 1', 'Sampai 300 dengan loncatan 1'),
                L('Up to 1,000 in steps of 500', 'Sampai 1.000 dengan loncatan 500'),
              ],
              answer: 0,
              explain: L(
                'The scale must reach the biggest value, 300, and steps of 50 put 150 and 250 on a line. A top of 200 is too short for 300, steps of 1 would need 300 lines, and steps of 500 make the bars tiny.',
                'Skala harus sampai nilai terbesar, yaitu 300, dan loncatan 50 membuat 150 dan 250 tepat di garis. Batas atas 200 terlalu pendek untuk 300, loncatan 1 butuh 300 garis, dan loncatan 500 membuat batangnya sangat kecil.',
              ),
              hint: L(
                'Check two things: does the scale reach the biggest value, and are there not too many or too few lines?',
                'Periksa dua hal: apakah skalanya sampai nilai terbesar, dan apakah garisnya tidak terlalu banyak atau terlalu sedikit?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'The chart shows the books four children read. Decide whether each statement is True or False.',
                'Diagram menunjukkan buku yang dibaca empat anak. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...barChart({ bars: bars(NAMES4, [40, 60, 20, 50]), max: 60, step: 10, showValues: false }),
                caption: L('Books read. The scale goes up by 10.', 'Buku yang dibaca. Skalanya naik 10.'),
              },
              statements: [
                L('Budi read the most books.', 'Budi membaca buku paling banyak.'),
                L('Ani read twice as many books as Citra.', 'Ani membaca buku dua kali lebih banyak daripada Citra.'),
                L('Dewi read 5 books more than Ani.', 'Dewi membaca 5 buku lebih banyak daripada Ani.'),
                L('Budi and Citra read 100 books together.', 'Budi dan Citra membaca 100 buku bersama-sama.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'Budi\'s bar is the tallest (60). Ani read 40 and Citra read 20, and $2 \\times 20 = 40$. Dewi read 50, which is 10 more than Ani, not 5. Budi and Citra read $60 + 20 = 80$, not 100.',
                'Batang Budi paling tinggi (60). Ani membaca 40 dan Citra membaca 20, dan $2 \\times 20 = 40$. Dewi membaca 50, yaitu 10 lebih banyak daripada Ani, bukan 5. Budi dan Citra membaca $60 + 20 = 80$, bukan 100.',
              ),
              hint: L(
                'Read the value of every bar first. Then test each statement with those numbers.',
                'Baca dulu nilai setiap batang. Lalu uji tiap pernyataan dengan angka-angka itu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The bar chart shows the stamps of four children. The scale goes up by 20. How many stamps do the four children have in all?',
                'Diagram batang menunjukkan perangko empat anak. Skalanya naik 20. Berapa perangko yang dimiliki keempat anak itu seluruhnya?',
              ),
              figure: {
                ...barChart({ bars: bars(['Gita', 'Hasan', 'Indah', 'Joko'], [70, 90, 50, 30]), max: 100, step: 20, showValues: false }),
                caption: L('Stamps. The scale goes up by 20.', 'Perangko. Skalanya naik 20.'),
              },
              blanks: [{ answer: 240, after: { en: '\\text{ stamps}', id: '\\text{ perangko}' } }],
              hints: [
                L('Look at the scale first: how much does it go up from one line to the next?', 'Lihat dulu skalanya: naik berapa dari satu garis ke garis berikutnya?'),
                L('Every bar ends halfway between two lines. Read each value, then add the four values.', 'Setiap batang berujung di tengah dua garis. Baca nilai tiap batang, lalu jumlahkan keempat nilainya.'),
                L('The values are 70, 90, 50 and 30. Add them up.', 'Nilainya 70, 90, 50, dan 30. Jumlahkan semuanya.'),
              ],
              explain: L(
                'Each bar is halfway between two lines: 70, 90, 50 and 30. Together $70 + 90 + 50 + 30 = 240$.',
                'Setiap batang berada di tengah dua garis: 70, 90, 50, dan 30. Seluruhnya $70 + 90 + 50 + 30 = 240$.',
              ),
              solution: ['70 + 90 = 160', '50 + 30 = 80', '160 + 80 = 240'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m10-s1-p',
        runtime: 'math',
        title: L('Tally, Pictogram and Bar Chart', 'Turus, Piktogram, dan Diagram Batang'),
        brief: L(
          'Count tally marks, work with a key, and read a bar chart to solve problems.',
          'Hitung turus, kerjakan soal dengan kunci, dan baca diagram batang untuk menyelesaikan soal.',
        ),
        requirements: [
          L('Read tally marks, tables and pictograms with a key.', 'Membaca turus, tabel, dan piktogram dengan kunci.'),
          L('Read a bar chart and use its values to solve a problem.', 'Membaca diagram batang dan memakai nilainya untuk menyelesaikan soal.'),
        ],
        hints: [
          L('Always look at the key or the scale before you read any value.', 'Selalu lihat kunci atau skala sebelum membaca nilai apa pun.'),
          L('Change every symbol or bar into a number first, then do the calculation.', 'Ubah dulu setiap simbol atau batang menjadi angka, baru lakukan perhitungan.'),
          L('For a bar between two lines, find the halfway number. A half square is half of the key.', 'Untuk batang di antara dua garis, cari angka di tengahnya. Setengah kotak adalah setengah dari kunci.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'The tally marks show the votes for a class leader. How many votes did Gita get?',
              'Turus menunjukkan suara untuk ketua kelas. Berapa suara yang didapat Gita?',
            ),
            figure: {
              ...tally([{ label: 'Fitri', count: 8 }, { label: 'Gita', count: 13 }, { label: 'Hasan', count: 6 }]),
              caption: L('Votes as tally marks.', 'Suara dalam bentuk turus.'),
            },
            blanks: [{ answer: 13, after: AFTER.votes }],
            solution: {
              en: ['\\text{two groups of five: } 2 \\times 5 = 10', '10 + 3 = 13'],
              id: ['\\text{dua kelompok lima: } 2 \\times 5 = 10', '10 + 3 = 13'],
            },
          },
          {
            prompt: L(
              'The table shows the books three children read. In a pictogram, one square stands for 5 books. How many squares does Budi\'s row need?',
              'Tabel menunjukkan buku yang dibaca tiga anak. Pada piktogram, satu kotak mewakili 5 buku. Berapa kotak yang diperlukan baris Budi?',
            ),
            figure: {
              ...gridTable([['Ani', 'Budi', 'Citra'], ['30', '45', '20']], { cw: 2.4 }),
              caption: L('Top row: the children. Bottom row: books read.', 'Baris atas: anak-anak. Baris bawah: buku yang dibaca.'),
            },
            blanks: [{ answer: 9, after: AFTER.squares }],
            solution: ['45 \\div 5 = 9'],
          },
          {
            prompt: L(
              'The pictogram shows the kilograms of oranges four children sold. How many kilograms did the four children sell in all?',
              'Piktogram menunjukkan kilogram jeruk yang dijual empat anak. Berapa kilogram jeruk yang dijual keempat anak itu seluruhnya?',
            ),
            figure: {
              ...pict([{ label: 'Fitri', count: 3.5 }, { label: 'Gita', count: 5 }, { label: 'Hasan', count: 2.5 }, { label: 'Indah', count: 4 }], 20),
              caption: L('Oranges sold. One square = 20 kg.', 'Jeruk yang dijual. Satu kotak = 20 kg.'),
            },
            blanks: [{ answer: 300, after: AFTER.kg }],
            solution: {
              en: ['\\text{squares: } 3.5 + 5 + 2.5 + 4 = 15', '15 \\times 20 = 300'],
              id: ['\\text{kotak: } 3{,}5 + 5 + 2{,}5 + 4 = 15', '15 \\times 20 = 300'],
            },
          },
          {
            prompt: L(
              'The bar chart shows the stickers of four children. Ani gives some stickers to Citra, so that Ani and Citra then have the same number. How many stickers does Ani give?',
              'Diagram batang menunjukkan stiker empat anak. Ani memberikan beberapa stikernya kepada Citra, sehingga Ani dan Citra punya stiker sama banyak. Berapa stiker yang diberikan Ani?',
            ),
            figure: {
              ...barChart({ bars: bars(NAMES4, [80, 60, 30, 50]), max: 90, step: 10, showValues: false }),
              caption: L('Stickers. The scale goes up by 10.', 'Stiker. Skalanya naik 10.'),
            },
            blanks: [{ answer: 25, after: AFTER.stickers }],
            solution: {
              en: ['\\text{Ani } 80, \\ \\text{Citra } 30', '80 - 30 = 50 \\ \\text{(the gap)}', '50 \\div 2 = 25'],
              id: ['\\text{Ani } 80, \\ \\text{Citra } 30', '80 - 30 = 50 \\ \\text{(selisih)}', '50 \\div 2 = 25'],
            },
          },
        ],
      },
    },
    /* ============================================================ S2: using data */
    {
      id: 'tka-m10-s2',
      title: L('Using Data', 'Menggunakan Data'),
      summary: L(
        'Reading charts and tables to answer questions, comparing values with fractions, and deciding which conclusions the data support.',
        'Membaca diagram dan tabel untuk menjawab pertanyaan, membandingkan nilai dengan pecahan, dan menentukan kesimpulan yang didukung data.',
      ),
      lessons: [
        /* ----------------------------------- S2 L1 reading information from data */
        {
          id: 'tka-m10-s2-l1',
          title: L('Reading Information from Data', 'Membaca dan Mengambil Informasi dari Data'),
          goal: L(
            'You can answer questions about most, least, in all and how many more, and decide which conclusions the data support.',
            'Kamu bisa menjawab pertanyaan tentang paling banyak, paling sedikit, seluruhnya, dan berapa lebih banyak, serta menentukan kesimpulan yang didukung data.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Questions We Ask About Data', 'Ayo Amati: Pertanyaan yang Sering Diajukan tentang Data'),
              body: L(
                'Data are useful when we can answer questions with them. This bar chart shows how many books five children read. Here are the questions we ask most often.\n\n| Question | What to do |\n|---|---|\n| Who has the most? Who has the least? | Find the tallest and the shortest bar |\n| How many in all? | Add the values of all the bars |\n| How many more than...? What is the difference? | Subtract the smaller value from the bigger one |\n| How did it change from one day to the next? | Subtract two bars that stand next to each other |\n\nFor example, Citra read the most (50 books) and Dewi read the least (10 books). The difference is $50 - 10 = 40$ books.',
                'Data berguna kalau kita bisa menjawab pertanyaan dengan data itu. Diagram batang ini menunjukkan banyak buku yang dibaca lima anak. Berikut pertanyaan yang paling sering diajukan.\n\n| Pertanyaan | Yang dilakukan |\n|---|---|\n| Siapa yang paling banyak? Siapa yang paling sedikit? | Cari batang yang paling tinggi dan paling pendek |\n| Berapa seluruhnya? | Jumlahkan nilai semua batang |\n| Berapa lebih banyak dari...? Berapa selisihnya? | Kurangkan nilai yang lebih kecil dari nilai yang lebih besar |\n| Bagaimana perubahan dari satu hari ke hari berikutnya? | Kurangkan dua batang yang bersebelahan |\n\nMisalnya, Citra membaca paling banyak (50 buku) dan Dewi membaca paling sedikit (10 buku). Selisihnya $50 - 10 = 40$ buku.',
              ),
              figure: {
                ...barChart({ bars: bars(NAMES5, [30, 20, 50, 10, 40]), max: 50, step: 10 }),
                caption: L(
                  'Books read by five children. The scale goes up by 10.',
                  'Buku yang dibaca lima anak. Skalanya naik 10.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Rises, Falls and Totals', 'Contoh Bertahap: Naik, Turun, dan Jumlah'),
              body: L(
                'The chart shows the number of visitors at the village library on days 1 to 5. On which day was the rise from the day before the biggest? How many visitors came in all?\n\n1. Step 1: Read every bar: 30, 50, 40, 70 and 60 visitors.\n2. Step 2: Find the change from each day to the next. Day 1 to day 2: $50 - 30 = 20$ more. Day 2 to day 3: $50 - 40 = 10$ fewer.\n3. Step 3: Day 3 to day 4: $70 - 40 = 30$ more. Day 4 to day 5: $70 - 60 = 10$ fewer. The biggest rise is 30, on day 4.\n4. Step 4: Add all the bars: $30 + 50 + 40 + 70 + 60 = 250$ visitors in all.\n\n**Remember:**\n\n- A change from one day to the next is the difference between two bars that stand next to each other.\n- The tallest bar is the biggest value, but not always the biggest change.\n- Write "more" or "fewer" next to the number, so you remember which way it went.',
                'Diagram menunjukkan banyak pengunjung perpustakaan desa pada hari ke-1 sampai ke-5. Pada hari ke berapa kenaikan dari hari sebelumnya paling besar? Berapa pengunjung yang datang seluruhnya?\n\n1. Langkah 1: Baca setiap batang: 30, 50, 40, 70, dan 60 pengunjung.\n2. Langkah 2: Cari perubahan dari tiap hari ke hari berikutnya. Hari ke-1 ke hari ke-2: $50 - 30 = 20$ lebih banyak. Hari ke-2 ke hari ke-3: $50 - 40 = 10$ lebih sedikit.\n3. Langkah 3: Hari ke-3 ke hari ke-4: $70 - 40 = 30$ lebih banyak. Hari ke-4 ke hari ke-5: $70 - 60 = 10$ lebih sedikit. Kenaikan terbesar adalah 30, pada hari ke-4.\n4. Langkah 4: Jumlahkan semua batang: $30 + 50 + 40 + 70 + 60 = 250$ pengunjung seluruhnya.\n\n**Ingat:**\n\n- Perubahan dari satu hari ke hari berikutnya adalah selisih dua batang yang bersebelahan.\n- Batang tertinggi adalah nilai terbesar, tetapi belum tentu perubahan terbesar.\n- Tulis "lebih banyak" atau "lebih sedikit" di samping angkanya, supaya kamu ingat arah perubahannya.',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [30, 50, 40, 70, 60]), max: 80, step: 10 }),
                caption: L(
                  'Visitors on days 1 to 5. The number under each bar is the day.',
                  'Pengunjung pada hari ke-1 sampai ke-5. Angka di bawah tiap batang adalah harinya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Adding When You Should Subtract', 'Awas, Jebakan!: Menjumlah Padahal Harus Mengurang'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| How many more books did Citra (50) read than Dewi (10)? $50 + 10 = 60$ | "How many more" compares two values: $50 - 10 = 40$ |\n| The tallest bar (90) must be the day with the biggest rise | A rise is the difference between neighboring bars. From 60 to 80 is 20, from 80 to 90 is only 10 |\n| "How many in all?" is the tallest bar | "In all" means you add all the bars together |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| Berapa buku Citra (50) lebih banyak daripada Dewi (10)? $50 + 10 = 60$ | "Berapa lebih banyak" membandingkan dua nilai: $50 - 10 = 40$ |\n| Batang tertinggi (90) pasti hari dengan kenaikan terbesar | Kenaikan adalah selisih batang yang bersebelahan. Dari 60 ke 80 naik 20, dari 80 ke 90 hanya naik 10 |\n| "Berapa seluruhnya" adalah batang tertinggi | "Seluruhnya" berarti semua batang dijumlahkan |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The chart shows the kilograms of vegetables sold by four sellers. How many kilograms more did Joko sell than Indah?',
                'Diagram menunjukkan kilogram sayur yang dijual empat penjual. Berapa kilogram lebih banyak yang dijual Joko daripada Indah?',
              ),
              figure: {
                ...barChart({ bars: bars(['Hasan', 'Indah', 'Joko', 'Rudi'], [60, 40, 90, 30]), max: 100, step: 10, showValues: false }),
                caption: L('Vegetables sold. The scale goes up by 10.', 'Sayur yang dijual. Skalanya naik 10.'),
              },
              options: [L('50 kg', '50 kg'), L('130 kg', '130 kg'), L('90 kg', '90 kg'), L('40 kg', '40 kg')],
              answer: 0,
              explain: L(
                'Joko sold 90 kg and Indah sold 40 kg, so Joko sold $90 - 40 = 50$ kg more. Adding gives 130, and 90 and 40 are just one seller\'s value.',
                'Joko menjual 90 kg dan Indah menjual 40 kg, jadi Joko menjual $90 - 40 = 50$ kg lebih banyak. Menjumlahkan menghasilkan 130, dan 90 serta 40 hanyalah nilai satu penjual.',
              ),
              hint: L(
                'Read both bars first. "How many more" compares the two values. Which operation does that need?',
                'Baca dulu kedua batang. "Berapa lebih banyak" membandingkan dua nilai. Operasi apa yang diperlukan?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: in the chart of visitors, how many more visitors came on day 4 than on day 3? Read both bars, then subtract.',
                'Coba bersama: pada diagram pengunjung, berapa pengunjung lebih banyak yang datang pada hari ke-4 daripada hari ke-3? Baca kedua batang, lalu kurangkan.',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [30, 50, 40, 70, 60]), max: 80, step: 10, showValues: false }),
                caption: L('Visitors on days 1 to 5.', 'Pengunjung pada hari ke-1 sampai ke-5.'),
              },
              template: {
                en: '\\text{day 4} - \\text{day 3} = ___ - ___ = ___',
                id: '\\text{hari ke-4} - \\text{hari ke-3} = ___ - ___ = ___',
              },
              blanks: ['70', '40', '30'],
              explain: L(
                'Day 4 has 70 visitors and day 3 has 40, so day 4 had $70 - 40 = 30$ more visitors.',
                'Hari ke-4 ada 70 pengunjung dan hari ke-3 ada 40, jadi hari ke-4 ada $70 - 40 = 30$ pengunjung lebih banyak.',
              ),
              hint: L(
                'Find the top of the day 4 bar and the day 3 bar on the scale. The bigger value comes first.',
                'Cari ujung batang hari ke-4 dan hari ke-3 pada skala. Nilai yang lebih besar ditulis lebih dulu.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Pak Rudi sells oranges for Rp5,000 per kg. The chart shows the kilograms he sold on four days. How much money did he get on the day he sold the most?',
                'Pak Rudi menjual jeruk seharga Rp5.000 per kg. Diagram menunjukkan kilogram jeruk yang ia jual selama empat hari. Berapa uang yang ia dapat pada hari ia menjual paling banyak?',
              ),
              figure: {
                ...barChart({ bars: bars(['1', '2', '3', '4'], [30, 50, 20, 40]), max: 60, step: 10, showValues: false }),
                caption: L(
                  'Oranges sold in kg on days 1 to 4.',
                  'Jeruk yang dijual (kg) pada hari ke-1 sampai ke-4.',
                ),
              },
              options: [L('Rp250,000', 'Rp250.000'), L('Rp50,000', 'Rp50.000'), L('Rp700,000', 'Rp700.000'), L('Rp100,000', 'Rp100.000')],
              answer: 0,
              explain: L(
                'The most was 50 kg, and $50 \\times 5\\,000 = 250\\,000$. Rp50,000 treats every kilogram as Rp1,000, Rp100,000 is for the day with the least (20 kg), and Rp700,000 is for all four days (140 kg).',
                'Paling banyak adalah 50 kg, dan $50 \\times 5\\,000 = 250\\,000$. Rp50.000 menganggap setiap kilogram Rp1.000, Rp100.000 untuk hari dengan jual paling sedikit (20 kg), dan Rp700.000 untuk keempat hari (140 kg).',
              ),
              hint: L(
                'First find the day with the tallest bar. Then use the price per kilogram.',
                'Cari dulu hari dengan batang tertinggi. Lalu pakai harga per kilogram.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('The chart shows the visitors of the village library. Choose TWO statements that the chart supports.', 'Diagram menunjukkan pengunjung perpustakaan desa. Pilih DUA pernyataan yang didukung diagram.'),
              figure: {
                ...barChart({ bars: bars(DAYS5, [40, 60, 50, 30, 70]), max: 80, step: 10, showValues: false }),
                caption: L(
                  'Visitors on days 1 to 5. The scale goes up by 10.',
                  'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 10.',
                ),
              },
              options: [
                L('Day 5 had the most visitors.', 'Hari ke-5 punya pengunjung paling banyak.'),
                L('Day 2 had twice as many visitors as day 4.', 'Hari ke-2 punya pengunjung dua kali lebih banyak daripada hari ke-4.'),
                L('The number of visitors went up every day.', 'Banyak pengunjung naik setiap hari.'),
                L('In all, 240 visitors came in the 5 days.', 'Seluruhnya 240 pengunjung datang dalam 5 hari.'),
              ],
              answer: [0, 1],
              explain: L(
                'Day 5 has the tallest bar (70), and day 2 has 60 visitors, which is $2 \\times 30$ for day 4. The numbers went down on days 3 and 4, and the total is $40 + 60 + 50 + 30 + 70 = 250$, not 240.',
                'Hari ke-5 punya batang tertinggi (70), dan hari ke-2 punya 60 pengunjung, yaitu $2 \\times 30$ milik hari ke-4. Banyak pengunjung turun pada hari ke-3 dan ke-4, dan jumlahnya $40 + 60 + 50 + 30 + 70 = 250$, bukan 240.',
              ),
              hint: L(
                'Read all five bars first. Then test each statement with the numbers, one by one.',
                'Baca dulu kelima batang. Lalu uji tiap pernyataan dengan angka-angkanya, satu per satu.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'The pictogram shows the votes for a class leader. Decide whether each statement is True or False.',
                'Piktogram menunjukkan suara untuk ketua kelas. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...pict([{ label: 'Ani', count: 5 }, { label: 'Budi', count: 4 }, { label: 'Citra', count: 3.5 }, { label: 'Dewi', count: 2.5 }], 2),
                caption: L('Votes. One square = 2 votes.', 'Suara. Satu kotak = 2 suara.'),
              },
              statements: [
                L('Ani got the most votes.', 'Ani mendapat suara paling banyak.'),
                L('In all, 30 children voted.', 'Seluruhnya 30 anak memberikan suara.'),
                L('Citra got 3 votes more than Dewi.', 'Citra mendapat 3 suara lebih banyak daripada Dewi.'),
                L('Ani got half of all the votes.', 'Ani mendapat setengah dari semua suara.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'The votes are Ani 10, Budi 8, Citra 7 and Dewi 5, so Ani has the most and the total is 30. Citra has $7 - 5 = 2$ more than Dewi, not 3. Ani has 10 of 30 votes, which is one third and not a half.',
                'Suaranya Ani 10, Budi 8, Citra 7, dan Dewi 5, jadi Ani paling banyak dan jumlahnya 30. Citra punya $7 - 5 = 2$ suara lebih banyak daripada Dewi, bukan 3. Ani mendapat 10 dari 30 suara, yaitu sepertiga, bukan setengah.',
              ),
              hint: L(
                'Use the key to change every row into votes. Then check each statement with those numbers.',
                'Pakai kunci untuk mengubah tiap baris menjadi banyak suara. Lalu periksa tiap pernyataan dengan angka-angka itu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The chart shows the eggs sold at Bu Siti\'s stall on days 1 to 5. One egg costs Rp2,000. How much money did Bu Siti get from the eggs sold on days 2, 3 and 4?',
                'Diagram menunjukkan telur yang dijual di warung Bu Siti pada hari ke-1 sampai ke-5. Satu butir telur harganya Rp2.000. Berapa uang yang didapat Bu Siti dari telur yang dijual pada hari ke-2, ke-3, dan ke-4?',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [80, 60, 100, 40, 90]), max: 100, step: 20, showValues: false }),
                caption: L('Eggs sold on days 1 to 5. The scale goes up by 20.', 'Telur yang dijual pada hari ke-1 sampai ke-5. Skalanya naik 20.'),
              },
              blanks: [{ label: '\\text{Rp}', answer: 400000 }],
              hints: [
                L('Which three bars do you need? Read their values on the scale.', 'Batang mana saja yang kamu perlukan? Baca nilainya pada skala.'),
                L('Add the eggs of days 2, 3 and 4 first. Then use the price of one egg.', 'Jumlahkan dulu telur hari ke-2, ke-3, dan ke-4. Lalu pakai harga satu butir telur.'),
                L('The three bars are 60, 100 and 40 eggs. Multiply their total by $2\\,000$.', 'Ketiga batangnya 60, 100, dan 40 butir. Kalikan jumlahnya dengan $2\\,000$.'),
              ],
              explain: L(
                'Eggs: $60 + 100 + 40 = 200$. Money: $200 \\times 2\\,000 = 400\\,000$ rupiah.',
                'Telur: $60 + 100 + 40 = 200$. Uang: $200 \\times 2\\,000 = 400\\,000$ rupiah.',
              ),
              solution: ['60 + 100 + 40 = 200', '200 \\times 2\\,000 = 400\\,000'],
            },
          ],
        },
        /* ---------------------------------- S2 L2 drawing conclusions from data */
        {
          id: 'tka-m10-s2-l2',
          title: L('Drawing Conclusions from Data', 'Menyimpulkan dari Data'),
          goal: L(
            'You can compare two values with a fraction, add data over several days, find the biggest rise, combine a table with a chart, and decide which statements the data support.',
            'Kamu bisa membandingkan dua nilai dengan pecahan, menjumlahkan data beberapa hari, mencari kenaikan terbesar, memadukan tabel dengan diagram, dan menentukan pernyataan yang didukung data.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: What the Data Can Tell Us', 'Ayo Amati: Apa yang Bisa Dikatakan Data'),
              body: L(
                'The village library counts its visitors on days 1 to 5 and shows them in a bar chart. From the chart we can say true things about the visitors. A statement that the numbers prove is called a **conclusion**.\n\nHere are the questions we ask, and what to do.\n\n| Question | What to do |\n|---|---|\n| Is one value only $\\frac{3}{4}$ of another? | Compare with a fraction: write one value over the other and simplify |\n| How many in all over several days? | Add the bars of those days |\n| How much did it change from one day to the next? | Subtract two bars that stand next to each other |\n| Does the data support a statement? | Test the statement with the numbers from the chart |\n\nFor example, day 1 had 30 visitors and day 3 had 40. Since $\\frac{30}{40} = \\frac{3}{4}$, we can say that day 1 had only $\\frac{3}{4}$ of the visitors of day 3.',
                'Perpustakaan desa mencatat pengunjungnya pada hari ke-1 sampai ke-5 dan menyajikannya dalam diagram batang. Dari diagram itu kita bisa mengatakan hal-hal yang benar tentang pengunjung. Pernyataan yang dibuktikan oleh angka-angka disebut **kesimpulan**.\n\nBerikut pertanyaan yang kita ajukan, dan yang dilakukan.\n\n| Pertanyaan | Yang dilakukan |\n|---|---|\n| Apakah satu nilai hanya $\\frac{3}{4}$ dari nilai lain? | Bandingkan dengan pecahan: tulis satu nilai di atas nilai lainnya lalu sederhanakan |\n| Berapa seluruhnya selama beberapa hari? | Jumlahkan batang-batang hari itu |\n| Berapa perubahan dari satu hari ke hari berikutnya? | Kurangkan dua batang yang bersebelahan |\n| Apakah data mendukung sebuah pernyataan? | Uji pernyataan itu dengan angka dari diagram |\n\nMisalnya, hari ke-1 ada 30 pengunjung dan hari ke-3 ada 40. Karena $\\frac{30}{40} = \\frac{3}{4}$, kita bisa mengatakan bahwa hari ke-1 hanya punya $\\frac{3}{4}$ dari pengunjung hari ke-3.',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [30, 20, 40, 50, 60]), max: 60, step: 10 }),
                caption: L(
                  'Visitors of the village library on days 1 to 5. The number under each bar is the day.',
                  'Pengunjung perpustakaan desa pada hari ke-1 sampai ke-5. Angka di bawah tiap batang adalah harinya.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Testing Two Statements', 'Contoh Bertahap: Menguji Dua Pernyataan'),
              body: L(
                'Look at the chart of visitors on days 1 to 5. Test the statement "Day 1 had only $\\frac{3}{4}$ of the visitors of day 3" and the statement "The number of visitors went up every day". Then find the biggest rise.\n\n1. Step 1: read every bar: 30, 20, 40, 50 and 60 visitors.\n2. Step 2: test the first statement. $\\frac{3}{4}$ of 40 is $40 \\div 4 \\times 3 = 30$, and day 1 had 30 visitors. The statement is true.\n3. Step 3: find the rises. Day 1 to day 2: 10 fewer. Day 2 to day 3: $40 - 20 = 20$ more. Day 3 to day 4: $50 - 40 = 10$ more. Day 4 to day 5: $60 - 50 = 10$ more. The biggest rise is 20, from day 2 to day 3.\n4. Step 4: test the second statement. From day 1 to day 2 the number went down, so it did not go up every day. The statement is false.\n\n**Remember:**\n\n- "Only $\\frac{3}{4}$ of" means: find $\\frac{3}{4}$ of the bigger value and compare.\n- One day that does not fit is enough to make a statement false.\n- A rise is the difference between two bars that stand next to each other.',
                'Lihat diagram pengunjung pada hari ke-1 sampai ke-5. Uji pernyataan "Hari ke-1 hanya punya $\\frac{3}{4}$ dari pengunjung hari ke-3" dan pernyataan "Banyak pengunjung naik setiap hari". Lalu cari kenaikan terbesar.\n\n1. Langkah 1: baca setiap batang: 30, 20, 40, 50, dan 60 pengunjung.\n2. Langkah 2: uji pernyataan pertama. $\\frac{3}{4}$ dari 40 adalah $40 \\div 4 \\times 3 = 30$, dan hari ke-1 ada 30 pengunjung. Pernyataan itu benar.\n3. Langkah 3: cari kenaikannya. Hari ke-1 ke hari ke-2: 10 lebih sedikit. Hari ke-2 ke hari ke-3: $40 - 20 = 20$ lebih banyak. Hari ke-3 ke hari ke-4: $50 - 40 = 10$ lebih banyak. Hari ke-4 ke hari ke-5: $60 - 50 = 10$ lebih banyak. Kenaikan terbesar adalah 20, dari hari ke-2 ke hari ke-3.\n4. Langkah 4: uji pernyataan kedua. Dari hari ke-1 ke hari ke-2 banyaknya turun, jadi tidak naik setiap hari. Pernyataan itu salah.\n\n**Ingat:**\n\n- "Hanya $\\frac{3}{4}$ dari" berarti: cari $\\frac{3}{4}$ dari nilai yang lebih besar lalu bandingkan.\n- Satu hari yang tidak cocok sudah cukup untuk membuat pernyataan salah.\n- Kenaikan adalah selisih dua batang yang bersebelahan.',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [30, 20, 40, 50, 60]), max: 60, step: 10, showValues: false }),
                caption: L(
                  'Visitors on days 1 to 5. The scale goes up by 10.',
                  'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 10.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Conclusions That Go Too Far', 'Awas, Jebakan!: Kesimpulan yang Terlalu Jauh'),
              body: L(
                'Watch out for these three mistakes.\n\n| Wrong | Right |\n|---|---|\n| Day 1 (30) is 10 fewer than day 3 (40), so it is $\\frac{1}{10}$ of day 3 | A fraction says "out of": 30 out of 40 is $\\frac{30}{40} = \\frac{3}{4}$ |\n| The tallest bar (60) is the biggest rise | A rise is the difference between neighboring bars: 20 from day 2 to day 3, but only 10 from day 4 to day 5 |\n| The bars went up on days 3, 4 and 5, so day 6 will be even higher | The data only tell what happened. We cannot be sure about a day that is not in the chart |',
                'Awas, ada tiga kesalahan yang sering terjadi.\n\n| Salah | Benar |\n|---|---|\n| Hari ke-1 (30) kurang 10 dari hari ke-3 (40), jadi sepersepuluh dari hari ke-3 | Pecahan berarti "dari": 30 dari 40 adalah $\\frac{30}{40} = \\frac{3}{4}$ |\n| Batang tertinggi (60) adalah kenaikan terbesar | Kenaikan adalah selisih batang yang bersebelahan: 20 dari hari ke-2 ke hari ke-3, tetapi hanya 10 dari hari ke-4 ke hari ke-5 |\n| Batang naik pada hari ke-3, ke-4, dan ke-5, jadi hari ke-6 pasti lebih tinggi lagi | Data hanya menceritakan yang sudah terjadi. Kita tidak bisa yakin tentang hari yang tidak ada di diagram |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The chart shows the kilograms of rice a stall sold on days 1 to 4. On day 4 the stall sold only a fraction of what it sold on day 3. Which fraction?',
                'Diagram menunjukkan kilogram beras yang dijual sebuah warung pada hari ke-1 sampai ke-4. Pada hari ke-4 warung itu hanya menjual sebagian dari yang dijual pada hari ke-3. Berapa bagiannya?',
              ),
              figure: {
                ...barChart({ bars: bars(['1', '2', '3', '4'], [30, 40, 60, 20]), max: 60, step: 10, showValues: false }),
                caption: L('Rice sold in kg on days 1 to 4. The scale goes up by 10.', 'Beras yang dijual (kg) pada hari ke-1 sampai ke-4. Skalanya naik 10.'),
              },
              options: [L('$\\frac{1}{3}$', '$\\frac{1}{3}$'), L('$\\frac{2}{3}$', '$\\frac{2}{3}$'), L('$\\frac{1}{4}$', '$\\frac{1}{4}$'), L('3', '3')],
              answer: 0,
              explain: L(
                'Day 4 sold 20 kg and day 3 sold 60 kg, so day 4 is $\\frac{20}{60} = \\frac{1}{3}$ of day 3. The fraction $\\frac{2}{3}$ is how much less was sold (40 kg out of 60), $\\frac{1}{4}$ compares 20 with both days together (20 out of 80), and 3 turns it around: day 3 is 3 times day 4.',
                'Hari ke-4 terjual 20 kg dan hari ke-3 terjual 60 kg, jadi hari ke-4 adalah $\\frac{20}{60} = \\frac{1}{3}$ dari hari ke-3. Pecahan $\\frac{2}{3}$ adalah bagian yang berkurang (40 kg dari 60), $\\frac{1}{4}$ membandingkan 20 dengan kedua hari bersama (20 dari 80), dan 3 membaliknya: hari ke-3 adalah 3 kali hari ke-4.',
              ),
              hint: L(
                'Read the bars of day 3 and day 4 first. Day 4 is compared with day 3: which number goes on top of the fraction, and which on the bottom?',
                'Baca dulu batang hari ke-3 dan hari ke-4. Hari ke-4 dibandingkan dengan hari ke-3: angka mana di atas pecahan, dan angka mana di bawah?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: in the chart of visitors, day 1 had 30 visitors and day 5 had 60. Day 1 had only what fraction of the visitors of day 5? Simplify it.',
                'Coba bersama: pada diagram pengunjung, hari ke-1 ada 30 pengunjung dan hari ke-5 ada 60. Hari ke-1 hanya punya berapa bagian dari pengunjung hari ke-5? Sederhanakan.',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [30, 20, 40, 50, 60]), max: 60, step: 10, showValues: false }),
                caption: L('Visitors on days 1 to 5. The scale goes up by 10.', 'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 10.'),
              },
              template: '\\frac{30}{60} = \\frac{30 \\div 30}{60 \\div 30} = \\frac{___}{___}',
              blanks: ['1', '2'],
              explain: L(
                '30 out of 60 is $\\frac{30}{60}$. Dividing the top and the bottom by 30 gives $\\frac{1}{2}$, so day 1 had only half of the visitors of day 5.',
                '30 dari 60 adalah $\\frac{30}{60}$. Membagi pembilang dan penyebut dengan 30 memberi $\\frac{1}{2}$, jadi hari ke-1 hanya punya setengah dari pengunjung hari ke-5.',
              ),
              hint: L(
                'Write the smaller value over the bigger one. Then divide the top and the bottom by the same number.',
                'Tulis nilai yang lebih kecil di atas nilai yang lebih besar. Lalu bagi pembilang dan penyebut dengan bilangan yang sama.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The chart shows how many children are in four clubs: P, Q, R and S. The number in the box under each bar is how many of them are girls. How many boys are in club R and club S together?',
                'Diagram menunjukkan banyak anak dalam empat klub: P, Q, R, dan S. Angka dalam kotak di bawah tiap batang adalah banyak anak perempuan di klub itu. Berapa anak laki-laki di klub R dan klub S bersama-sama?',
              ),
              figure: {
                ...chartWithBoxes({ bars: bars(['P', 'Q', 'R', 'S'], [20, 30, 40, 10]), max: 40, step: 10, showValues: false }, [12, 10, 25, 5]),
                caption: L(
                  'Children in four clubs (bars). The boxes under the bars show the girls.',
                  'Anak dalam empat klub (batang). Kotak di bawah batang menunjukkan anak perempuan.',
                ),
              },
              options: [L('20', '20'), L('30', '30'), L('50', '50'), L('15', '15')],
              answer: 0,
              explain: L(
                'Club R has 40 children and 25 girls, so $40 - 25 = 15$ boys. Club S has 10 children and 5 girls, so 5 boys. Together $15 + 5 = 20$. The number 30 is the girls of R and S, 50 is all the children of R and S, and 15 is the boys of club R only.',
                'Klub R punya 40 anak dan 25 perempuan, jadi $40 - 25 = 15$ laki-laki. Klub S punya 10 anak dan 5 perempuan, jadi 5 laki-laki. Bersama-sama $15 + 5 = 20$. Angka 30 adalah perempuan di R dan S, 50 adalah semua anak di R dan S, dan 15 hanya laki-laki di klub R.',
              ),
              hint: L(
                'Read the bar and the box of each club. The boys are what is left when the girls are taken away from the whole club.',
                'Baca batang dan kotak tiap klub. Anak laki-laki adalah sisanya kalau anak perempuan dikurangkan dari seluruh klub.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'The pictogram shows the books a school library lent on days 1 to 4. Decide whether each statement is True or False.',
                'Piktogram menunjukkan buku yang dipinjamkan perpustakaan sekolah pada hari ke-1 sampai ke-4. Tentukan tiap pernyataan Benar atau Salah.',
              ),
              figure: {
                ...pict([{ label: '1', count: 3 }, { label: '2', count: 4.5 }, { label: '3', count: 2 }, { label: '4', count: 4 }], 10),
                caption: L('Books lent on days 1 to 4. One square = 10 books.', 'Buku yang dipinjamkan pada hari ke-1 sampai ke-4. Satu kotak = 10 buku.'),
              },
              statements: [
                L('On day 3, only $\\frac{2}{3}$ as many books were lent as on day 1.', 'Pada hari ke-3, buku yang dipinjamkan hanya $\\frac{2}{3}$ dari hari ke-1.'),
                L('In the four days, 135 books were lent in all.', 'Dalam empat hari, seluruhnya 135 buku dipinjamkan.'),
                L('The biggest rise from one day to the next was 25 books.', 'Kenaikan terbesar dari satu hari ke hari berikutnya adalah 25 buku.'),
                L('We can be sure that more than 40 books will be lent on day 5.', 'Kita bisa yakin bahwa lebih dari 40 buku akan dipinjamkan pada hari ke-5.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'The books lent were 30, 45, 20 and 40. Day 3 has 20 out of 30, which is $\\frac{2}{3}$, and the total is $30 + 45 + 20 + 40 = 135$. The rises are 15 (day 1 to 2) and 20 (day 3 to 4). The 25 is a fall from day 2 to day 3, not a rise. The data say nothing sure about day 5.',
                'Buku yang dipinjamkan 30, 45, 20, dan 40. Hari ke-3 ada 20 dari 30, yaitu $\\frac{2}{3}$, dan jumlahnya $30 + 45 + 20 + 40 = 135$. Kenaikannya 15 (dari hari ke-1 ke hari ke-2) dan 20 (dari hari ke-3 ke hari ke-4). Angka 25 adalah penurunan dari hari ke-2 ke hari ke-3, bukan kenaikan. Data tidak memberi kepastian tentang hari ke-5.',
              ),
              hint: L(
                'Use the key to change every row into books. Then test each statement. A rise means the number went up.',
                'Pakai kunci untuk mengubah tiap baris menjadi banyak buku. Lalu uji tiap pernyataan. Kenaikan berarti banyaknya bertambah.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'The table shows the visitors of the village library on days 1 to 5. The top row is the day and the bottom row is the number of visitors. Choose TWO statements that the table supports.',
                'Tabel menunjukkan pengunjung perpustakaan desa pada hari ke-1 sampai ke-5. Baris atas adalah hari dan baris bawah adalah banyak pengunjung. Pilih DUA pernyataan yang didukung tabel.',
              ),
              figure: {
                ...gridTable([['1', '2', '3', '4', '5'], ['20', '30', '25', '40', '45']], { cw: 1.8 }),
                caption: L('Top row: the day. Bottom row: visitors.', 'Baris atas: hari. Baris bawah: pengunjung.'),
              },
              options: [
                L('Day 2 had $\\frac{3}{4}$ as many visitors as day 4.', 'Hari ke-2 punya $\\frac{3}{4}$ dari pengunjung hari ke-4.'),
                L('In the five days, 160 visitors came in all.', 'Dalam lima hari, seluruhnya 160 pengunjung datang.'),
                L('The number of visitors went up every day.', 'Banyak pengunjung naik setiap hari.'),
                L('Day 5 had twice as many visitors as day 1.', 'Hari ke-5 punya pengunjung dua kali lebih banyak daripada hari ke-1.'),
              ],
              answer: [0, 1],
              explain: L(
                'Day 2 had 30 and day 4 had 40, and $\\frac{30}{40} = \\frac{3}{4}$. The total is $20 + 30 + 25 + 40 + 45 = 160$. The number fell from day 2 to day 3 (30 to 25), so it did not rise every day. Twice day 1 is 40, but day 5 had 45.',
                'Hari ke-2 ada 30 dan hari ke-4 ada 40, dan $\\frac{30}{40} = \\frac{3}{4}$. Jumlahnya $20 + 30 + 25 + 40 + 45 = 160$. Banyaknya turun dari hari ke-2 ke hari ke-3 (30 ke 25), jadi tidak naik setiap hari. Dua kali hari ke-1 adalah 40, tetapi hari ke-5 ada 45.',
              ),
              hint: L(
                'Read the five numbers first. Then test each statement with them, one by one.',
                'Baca dulu kelima angka itu. Lalu uji tiap pernyataan dengan angka-angka itu, satu per satu.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: L(
                'Put the steps in order for deciding whether the data support a statement.',
                'Urutkan langkah untuk menentukan apakah data mendukung sebuah pernyataan.',
              ),
              lines: {
                en: [
                  'Read the values from the chart or the table.',
                  'Read the statement and find what it claims: a fraction, a total or a change.',
                  'Calculate with the values from the data.',
                  'Compare your result with the claim. If the data cannot show it, the statement is not supported.',
                ],
                id: [
                  'Baca nilai-nilainya dari diagram atau tabel.',
                  'Baca pernyataannya dan cari yang diklaim: pecahan, jumlah, atau perubahan.',
                  'Hitung dengan nilai-nilai dari data.',
                  'Bandingkan hasilmu dengan klaimnya. Kalau data tidak bisa menunjukkannya, pernyataan itu tidak didukung.',
                ],
              },
              explain: L(
                'First read the data, then see what the statement claims, then calculate, and last compare.',
                'Pertama baca datanya, lalu lihat yang diklaim pernyataan, lalu hitung, dan terakhir bandingkan.',
              ),
              hint: L(
                'You need the numbers before you can calculate, and the comparison with the claim comes last.',
                'Kamu perlu angka-angkanya sebelum bisa menghitung, dan perbandingan dengan klaim dilakukan paling akhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The chart shows the visitors at a swimming pool on days 1 to 5. On day 6 the pool had only $\\frac{3}{4}$ as many visitors as on day 4. How many visitors came on days 4, 5 and 6 together?',
                'Diagram menunjukkan pengunjung kolam renang pada hari ke-1 sampai ke-5. Pada hari ke-6 kolam itu hanya punya $\\frac{3}{4}$ dari pengunjung hari ke-4. Berapa pengunjung yang datang pada hari ke-4, ke-5, dan ke-6 bersama-sama?',
              ),
              figure: {
                ...barChart({ bars: bars(DAYS5, [40, 50, 70, 80, 60]), max: 80, step: 10, showValues: false }),
                caption: L('Visitors on days 1 to 5. The scale goes up by 10.', 'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 10.'),
              },
              blanks: [{ answer: 200, after: AFTER.visitors }],
              hints: [
                L('Which days do you need? Read their bars first. Day 6 is not in the chart.', 'Hari mana saja yang kamu perlukan? Baca dulu batangnya. Hari ke-6 tidak ada di diagram.'),
                L('Find the visitors of day 6 from day 4: take $\\frac{3}{4}$ of the value of day 4.', 'Cari pengunjung hari ke-6 dari hari ke-4: ambil $\\frac{3}{4}$ dari nilai hari ke-4.'),
                L('Day 4 has 80 visitors and day 5 has 60. Find $\\frac{3}{4}$ of 80, then add the three days.', 'Hari ke-4 ada 80 pengunjung dan hari ke-5 ada 60. Cari $\\frac{3}{4}$ dari 80, lalu jumlahkan ketiga hari.'),
              ],
              explain: L(
                'Day 4 has 80 and day 5 has 60. Day 6 has $\\frac{3}{4}$ of 80, which is $80 \\div 4 \\times 3 = 60$. Together $80 + 60 + 60 = 200$ visitors.',
                'Hari ke-4 ada 80 dan hari ke-5 ada 60. Hari ke-6 punya $\\frac{3}{4}$ dari 80, yaitu $80 \\div 4 \\times 3 = 60$. Bersama-sama $80 + 60 + 60 = 200$ pengunjung.',
              ),
              solution: ['80 \\div 4 \\times 3 = 60', '80 + 60 + 60 = 200'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m10-s2-p',
        runtime: 'math',
        title: L('Using Data to Draw Conclusions', 'Memakai Data untuk Menarik Kesimpulan'),
        brief: L(
          'Read tables and charts, compare values with fractions, find the biggest rise and decide which statements the data support.',
          'Baca tabel dan diagram, bandingkan nilai dengan pecahan, cari kenaikan terbesar, dan tentukan pernyataan yang didukung data.',
        ),
        requirements: [
          L('Add data, compare values with a fraction and find a change.', 'Menjumlahkan data, membandingkan nilai dengan pecahan, dan mencari perubahan.'),
          L('Decide which statements a chart supports.', 'Menentukan pernyataan yang didukung sebuah diagram.'),
        ],
        hints: [
          L('Read every value from the table or the bars before you calculate.', 'Baca setiap nilai dari tabel atau batang sebelum menghitung.'),
          L('To compare with a fraction, write one value over the other and simplify. A change is the difference of two neighboring bars.', 'Untuk membandingkan dengan pecahan, tulis satu nilai di atas nilai lainnya lalu sederhanakan. Perubahan adalah selisih dua batang yang bersebelahan.'),
          L('To judge a statement, test it with the numbers one statement at a time. One value that does not fit makes it false.', 'Untuk menilai pernyataan, ujilah dengan angka-angka itu satu pernyataan pada satu waktu. Satu nilai yang tidak cocok membuatnya salah.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'The table shows the visitors of the village library on days 1 to 4. How many visitors came in the four days?',
              'Tabel menunjukkan pengunjung perpustakaan desa pada hari ke-1 sampai ke-4. Berapa pengunjung yang datang dalam empat hari itu?',
            ),
            figure: {
              ...gridTable([['1', '2', '3', '4'], ['25', '40', '35', '30']], { cw: 2 }),
              caption: L('Top row: the day. Bottom row: visitors.', 'Baris atas: hari. Baris bawah: pengunjung.'),
            },
            blanks: [{ answer: 130, after: AFTER.visitors }],
            solution: ['25 + 40 + 35 + 30 = 130'],
          },
          {
            prompt: L(
              'The chart shows the kilograms of rice sold by four stalls. Citra\'s stall sold only a fraction of what Dewi\'s stall sold. Write the fraction in simplest form.',
              'Diagram menunjukkan kilogram beras yang dijual empat warung. Warung Citra hanya menjual sebagian dari yang dijual warung Dewi. Tulis bagian itu dalam bentuk paling sederhana.',
            ),
            figure: {
              ...barChart({ bars: bars(NAMES4, [60, 80, 40, 100]), max: 100, step: 20, showValues: false }),
              caption: L('Rice sold in kg. The scale goes up by 20.', 'Beras yang dijual (kg). Skalanya naik 20.'),
            },
            blanks: fracBlanks(2, 5),
            solution: ['\\frac{40}{100} = \\frac{2}{5}'],
          },
          {
            prompt: L(
              'The village market counted its visitors on days 1 to 5. From one day to the next, what is the biggest rise in the number of visitors?',
              'Pasar desa mencatat pengunjungnya pada hari ke-1 sampai ke-5. Dari satu hari ke hari berikutnya, berapa kenaikan terbesar banyak pengunjung?',
            ),
            figure: {
              ...barChart({ bars: bars(DAYS5, [20, 40, 30, 60, 50]), max: 60, step: 10, showValues: false }),
              caption: L('Visitors on days 1 to 5. The scale goes up by 10.', 'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 10.'),
            },
            blanks: [{ answer: 30, after: AFTER.visitors }],
            solution: {
              en: ['40 - 20 = 20, \\quad 60 - 30 = 30', '\\text{the other days went down}', '\\text{biggest rise} = 30'],
              id: ['40 - 20 = 20, \\quad 60 - 30 = 30', '\\text{hari lainnya turun}', '\\text{kenaikan terbesar} = 30'],
            },
          },
          {
            prompt: L(
              'The chart shows the visitors of a reading corner on days 1 to 5. How many of these statements does the chart support? (1) Day 2 had only $\\frac{3}{4}$ of the visitors of day 4. (2) In all, 250 visitors came. (3) Day 3 had half as many visitors as day 2. (4) The number of visitors went up every day.',
              'Diagram menunjukkan pengunjung pojok baca pada hari ke-1 sampai ke-5. Berapa dari pernyataan berikut yang didukung diagram? (1) Hari ke-2 hanya punya $\\frac{3}{4}$ dari pengunjung hari ke-4. (2) Seluruhnya 250 pengunjung datang. (3) Hari ke-3 punya setengah dari pengunjung hari ke-2. (4) Banyak pengunjung naik setiap hari.',
            ),
            figure: {
              ...barChart({ bars: bars(DAYS5, [40, 60, 30, 80, 50]), max: 80, step: 10, showValues: false }),
              caption: L('Visitors on days 1 to 5. The scale goes up by 10.', 'Pengunjung pada hari ke-1 sampai ke-5. Skalanya naik 10.'),
            },
            blanks: [{ answer: 2, after: { en: '\\text{ statements}', id: '\\text{ pernyataan}' } }],
            solution: {
              en: [
                '40, 60, 30, 80, 50',
                '(1)\\ \\frac{60}{80} = \\frac{3}{4} \\rightarrow \\text{yes}',
                '(2)\\ 40 + 60 + 30 + 80 + 50 = 260 \\neq 250 \\rightarrow \\text{no}',
                '(3)\\ \\frac{30}{60} = \\frac{1}{2} \\rightarrow \\text{yes}',
                '(4)\\ \\text{day 3 is lower than day 2} \\rightarrow \\text{no}',
                '2 \\text{ statements}',
              ],
              id: [
                '40, 60, 30, 80, 50',
                '(1)\\ \\frac{60}{80} = \\frac{3}{4} \\rightarrow \\text{ya}',
                '(2)\\ 40 + 60 + 30 + 80 + 50 = 260 \\neq 250 \\rightarrow \\text{tidak}',
                '(3)\\ \\frac{30}{60} = \\frac{1}{2} \\rightarrow \\text{ya}',
                '(4)\\ \\text{hari ke-3 lebih rendah dari hari ke-2} \\rightarrow \\text{tidak}',
                '2 \\text{ pernyataan}',
              ],
            },
          },
        ],
      },
    },
  ],
}
