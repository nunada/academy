import type { Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import { fit, gridRect, line, numberLine, outline, rectPts, solid, txt } from './figs'
import type { Piece, Pt } from './figs'

/* ------------------------------------------------------------------ local drawing helpers */

/** Like `fit`, but when the picture is much taller than it is wide the frame is
 *  widened, so a small figure is not blown up to fill the whole width. */
function frame(pts: Pt[], pad = 0.5, ratio = 0): Pick<Piece, 'aspect' | 'xSpan' | 'ySpan'> {
  let all = pts
  if (ratio > 0) {
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const w = Math.max(...xs) - Math.min(...xs)
    const h = Math.max(...ys) - Math.min(...ys)
    const need = h * ratio
    if (w < need) {
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2
      all = [...pts, [cx - need / 2, ys[0]], [cx + need / 2, ys[0]]]
    }
  }
  return fit(all, pad)
}

/** The place-value chart: seven boxes (millions down to ones), each topped by
 *  what one digit in that box is worth. `mark` is the column (0 = millions)
 *  whose digit is printed in red. */
function placeChart(digits: string, mark?: number): Piece {
  const heads = ['1000000', '100000', '10000', '1000', '100', '10', '1']
  const cw = 3.4
  const off = 7 - digits.length
  const items: FigItem[] = []
  for (let i = 0; i < 7; i++) {
    const color: FigColor = i === 0 ? 'c' : i < 4 ? 'b' : 'a'
    items.push(outline(rectPts(i * cw, 0, cw, 2.6), color))
    items.push(txt(i * cw + cw / 2, 3.4, heads[i], 'sm', 'muted'))
    const j = i - off
    if (j >= 0) items.push(txt(i * cw + cw / 2, 1.3, digits[j], 'lg', mark === i ? 'result' : 'muted'))
  }
  return { dim: 2, axes: false, ...fit([[0, -0.2], [7 * cw, 3.9]], 0.3), items }
}

/** Numbers written the way a school notebook has them: right-aligned digits in
 *  columns, a sign at the left, a line under a row. Small rows hold the
 *  carried (or borrowed) digits above a column. */
type WRow = { cells: string[]; sign?: string; color?: FigColor; small?: boolean; line?: boolean }
const wr = (text: string, o: Omit<WRow, 'cells'> = {}): WRow => ({ cells: [...text], ...o })
const wc = (cells: string[], o: Omit<WRow, 'cells'> = {}): WRow => ({ cells, small: true, color: 'b', ...o })

function workings(rows: WRow[]): Piece {
  const N = Math.max(...rows.map((r) => r.cells.length))
  const dx = 1.2
  const items: FigItem[] = []
  let y = 0
  let prevH = 0
  let ymin = 0
  rows.forEach((r, i) => {
    const h = r.small ? 0.8 : 1.1
    if (i > 0) y -= (h + prevH) / 2
    prevH = h
    r.cells.forEach((c, k) => {
      if (c.trim()) items.push(txt((N - r.cells.length + k) * dx, y, c, r.small ? 'sm' : 'lg', r.color ?? 'muted'))
    })
    if (r.sign) items.push(txt(-1.4, y, r.sign, 'lg', 'muted'))
    if (r.line) {
      items.push(line([-0.7, y - 0.55], [(N - 1) * dx + 0.7, y - 0.55], 'muted', { width: 2 }))
      y -= 0.15
    }
    ymin = Math.min(ymin, y)
  })
  return { dim: 2, axes: false, ...frame([[-2, ymin - 0.7], [(N - 1) * dx + 0.8, 0.8]], 0.4, 1.7), items }
}

/** Long division the Indonesian way (porogapit): divisor at the left, the
 *  bracket, the quotient on top and the working underneath. `rows[k].end` is
 *  the column of the last digit of that row. */
function longDiv(o: { divisor: string; dividend: string; quotient: string; qStart: number; rows: { s: string; end: number; line?: boolean }[] }): Piece {
  const dx = 1.2
  const L = o.dividend.length
  const items: FigItem[] = []
  items.push(txt(-2.3, 0, o.divisor, 'lg', 'b'))
  const bottom = -(o.rows.length * 1.1) - 0.4
  items.push(line([-0.9, 0.7], [-0.9, bottom], 'muted', { width: 2 }))
  items.push(line([-0.9, 0.7], [(L - 1) * dx + 0.7, 0.7], 'muted', { width: 2 }))
  ;[...o.dividend].forEach((d, k) => items.push(txt(k * dx, 0, d, 'lg', 'muted')))
  ;[...o.quotient].forEach((d, k) => items.push(txt((o.qStart + k) * dx, 1.7, d, 'lg', 'result')))
  let y = 0
  for (const r of o.rows) {
    y -= 1.1
    ;[...r.s].forEach((d, k) => items.push(txt((r.end - r.s.length + 1 + k) * dx, y, d, 'lg', 'muted')))
    if (r.line) {
      items.push(line([(r.end - r.s.length + 1) * dx - 0.6, y - 0.55], [r.end * dx + 0.6, y - 0.55], 'muted', { width: 2 }))
      y -= 0.15
    }
  }
  return { dim: 2, axes: false, ...frame([[-3.2, bottom - 0.4], [(L - 1) * dx + 0.8, 2.4]], 0.4, 1.7), items }
}

/** One or more lines of calculation, one under the other, centered. */
function exprLines(lines: { t: string; color?: FigColor }[]): Piece {
  const items: FigItem[] = []
  const w = Math.max(...lines.map((l) => l.t.length)) * 0.55
  lines.forEach((l, i) => items.push(txt(0, -i * 1.5, l.t, 'lg', l.color ?? 'muted')))
  return { dim: 2, axes: false, ...frame([[-w, -(lines.length - 1) * 1.5 - 0.8], [w, 0.8]], 0.4, 2.2), items }
}

/** Bar model: each row is a bar made of parts whose lengths follow their values
 *  (same scale in every row). A part with `unknown` is the empty bar with a ?. */
type Seg = { v: number; text?: string; color?: FigColor; unknown?: boolean }
const thin = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
function barModel(rows: { label?: string; segs: Seg[] }[], o: { width?: number; plain?: boolean } = {}): Piece {
  const W = o.width ?? 13
  const total = (r: { segs: Seg[] }) => r.segs.reduce((s, g) => s + g.v, 0)
  const k = W / Math.max(...rows.map(total))
  const gap = 1.9
  const items: FigItem[] = []
  const n = rows.length
  const palette: FigColor[] = ['a', 'b', 'c', 'a', 'b', 'c']
  rows.forEach((r, i) => {
    const y0 = (n - 1 - i) * gap
    let x = 0
    r.segs.forEach((g, j) => {
      const w = g.v * k
      const cell = rectPts(x, y0, w, 1.2)
      if (g.unknown) {
        items.push(outline(cell, 'result'))
        items.push(txt(x + w / 2, y0 + 0.6, '?', 'lg', 'result'))
      } else {
        items.push(outline(cell, g.color ?? palette[j % palette.length]))
        items.push(txt(x + w / 2, y0 + 0.6, g.text ?? (o.plain ? String(g.v) : thin(g.v)), 'sm', 'muted'))
      }
      x += w
    })
    if (r.label) items.push(txt(-0.4, y0 + 0.6, r.label, 'md', 'muted', 'end'))
  })
  const left = rows.some((r) => r.label) ? -2.4 : 0
  return { dim: 2, axes: false, ...frame([[left, -0.3], [W + 0.3, (n - 1) * gap + 1.5]], 0.4, 1.9), items }
}

/** Boxes of dots: `n` boxes with `per` dots each, optionally one more box with
 *  `extra` dots (the leftovers, in red) and some `loose` dots outside any box. */
function groups(n: number, per: number, o: { cols?: number; extra?: number; loose?: number } = {}): Piece {
  const cols = o.cols ?? Math.min(per, 4)
  const rowsN = Math.ceil(per / cols)
  const s = 0.5
  const st = 0.7
  const bw = cols * st + 0.3
  const bh = rowsN * st + 0.3
  const gap = 0.6
  const items: FigItem[] = []
  let x = 0
  const dots = (x0: number, count: number, color: FigColor) => {
    for (let i = 0; i < count; i++) {
      const c = i % cols
      const r = Math.floor(i / cols)
      items.push(solid(rectPts(x0 + 0.25 + c * st, 0.25 + (rowsN - 1 - r) * st, s, s), color))
    }
  }
  if (o.loose) {
    const lc = Math.min(o.loose, 2)
    for (let i = 0; i < o.loose; i++) {
      const c = i % lc
      const r = Math.floor(i / lc)
      items.push(solid(rectPts(x + c * st, bh - 0.6 - r * st, s, s), 'b'))
    }
    x += lc * st + 1
  }
  for (let g = 0; g < n; g++) {
    items.push(outline(rectPts(x, 0, bw, bh), 'a'))
    dots(x, per, 'a')
    x += bw + gap
  }
  if (o.extra) {
    items.push(outline(rectPts(x, 0, bw, bh), 'result'))
    dots(x, o.extra, 'result')
    x += bw + gap
  }
  return { dim: 2, axes: false, ...frame([[0, -0.2], [x - gap, bh + 0.2]], 0.4, 2.4), items }
}

/** A rectangle cut into two parts, to show a number split in two and each part
 *  multiplied (not to scale). `inside` writes each product, otherwise only the
 *  question. */
function areaModel(a: number, b: number, c: number, inside: boolean): Piece {
  const items: FigItem[] = []
  const w1 = 8
  const w2 = 4.5
  const h = 4
  items.push(outline(rectPts(0, 0, w1, h), 'b'))
  items.push(outline(rectPts(w1, 0, w2, h), 'a'))
  items.push(txt(w1 / 2, h + 0.7, String(a), 'lg', 'b'))
  items.push(txt(w1 + w2 / 2, h + 0.7, String(b), 'lg', 'a'))
  items.push(txt(-0.7, h / 2, String(c), 'lg', 'muted', 'end'))
  items.push(txt(w1 / 2, h / 2 + 0.55, `${a} × ${c}`, 'lg'))
  items.push(txt(w1 + w2 / 2, h / 2 + 0.55, `${b} × ${c}`, 'lg'))
  if (inside) {
    items.push(txt(w1 / 2, h / 2 - 0.6, `= ${a * c}`, 'lg', 'result'))
    items.push(txt(w1 + w2 / 2, h / 2 - 0.6, `= ${b * c}`, 'lg', 'result'))
  }
  return { dim: 2, axes: false, ...frame([[-1.6, -0.2], [w1 + w2 + 0.3, h + 1.3]], 0.4, 1.7), items }
}

/* ---------------------------------------------------------------------------- the module */

/** Module 1 — whole numbers: place value up to the millions, comparing and
 *  rounding, the four operations, order of operations and multi-step stories. */
export const module1: Module = {
  id: 'tka-m1',
  title: { en: 'Whole Numbers and Operations', id: 'Bilangan Cacah dan Operasi Hitung' },
  summary: {
    en: 'Everything in the test is built on whole numbers. You will read and compare big numbers, add, subtract, multiply and divide them, and solve stories that need several steps.',
    id: 'Semua soal di tes dibangun dari bilangan cacah. Kamu akan membaca dan membandingkan bilangan besar, menjumlah, mengurang, mengalikan, dan membagi, lalu menyelesaikan soal cerita yang butuh beberapa langkah.',
  },
  submodules: [
    /* ------------------------------------------------------------------ place value and comparing */
    {
      id: 'tka-m1-s1',
      title: { en: 'Place Value and Comparing Numbers', id: 'Nilai Tempat dan Membandingkan Bilangan' },
      summary: {
        en: 'A digit’s place decides its value. You will read numbers up to the millions, compare and order them, and round them.',
        id: 'Tempat sebuah angka menentukan nilainya. Kamu akan membaca bilangan sampai jutaan, membandingkan dan mengurutkannya, lalu membulatkannya.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m1-s1-l1',
          title: { en: 'Place Value up to the Millions', id: 'Nilai Tempat sampai Jutaan' },
          goal: {
            en: 'You can read and write numbers up to 7 digits, and tell the value of each digit.',
            id: 'Kamu bisa membaca dan menulis bilangan sampai 7 angka, dan menyebutkan nilai tiap angka.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Digits and Their Places', id: 'Ayo Amati: Angka dan Tempatnya' },
              body: {
                en: 'A city has 2,345,678 residents. Look at the chart: every digit sits in its own box, and every box has a name and a size.\n\nThe box a digit sits in is its **place**. The place decides the digit’s **value**. In 2,345,678 the digit 5 sits in the thousands place, so it stands for 5,000, not just 5.\n\nTo read a big number, split it into groups of three digits, starting from the right: 2 million, 345 thousand, 678.',
                id: 'Sebuah kota punya 2.345.678 penduduk. Lihat bagannya: setiap angka (digit) duduk di kotaknya sendiri, dan setiap kotak punya nama dan ukuran.\n\nKotak tempat sebuah digit berada disebut **tempat**. Tempat itu menentukan **nilai** digit. Pada 2.345.678, digit 5 ada di tempat ribuan, jadi nilainya 5.000, bukan hanya 5.\n\nUntuk membaca bilangan besar, pisahkan menjadi kelompok tiga angka, mulai dari kanan: 2 juta, 345 ribu, 678.',
              },
              figure: {
                ...placeChart('2345678'),
                caption: {
                  en: 'The number 2,345,678 in a place-value chart. The number above each box is what one digit in that box is worth.',
                  id: 'Bilangan 2.345.678 pada bagan nilai tempat. Angka di atas tiap kotak adalah nilai satu angka di kotak itu.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Writing a Number from Words', id: 'Contoh Bertahap: Menulis Bilangan dari Kata-kata' },
              body: {
                en: 'Write "three million, four hundred five thousand, two hundred ten" with digits, then in expanded form.\n\n1. Step 1: The word "million" ends the first group. Three million is 3.\n2. Step 2: The word "thousand" ends the second group. Four hundred five thousand is 405.\n3. Step 3: The last group has no word. Two hundred ten is 210.\n4. Step 4: Join the groups: 3,405,210. A place that is not spoken gets a 0 (here the ten thousands and the ones).\n5. Step 5: Expanded form is each digit times its place: $3\\,000\\,000 + 400\\,000 + 5\\,000 + 200 + 10$.\n\n**Remember:** the place-value table.\n\n| Place | One digit is worth | Digit in 3,405,210 |\n| --- | --- | --- |\n| millions | 1,000,000 | 3 |\n| hundred thousands | 100,000 | 4 |\n| ten thousands | 10,000 | 0 |\n| thousands | 1,000 | 5 |\n| hundreds | 100 | 2 |\n| tens | 10 | 1 |\n| ones | 1 | 0 |',
                id: 'Tulis "tiga juta empat ratus lima ribu dua ratus sepuluh" dengan angka, lalu dalam bentuk panjang.\n\n1. Langkah 1: Kata "juta" mengakhiri kelompok pertama. Tiga juta ditulis 3.\n2. Langkah 2: Kata "ribu" mengakhiri kelompok kedua. Empat ratus lima ribu ditulis 405.\n3. Langkah 3: Kelompok terakhir tidak punya kata. Dua ratus sepuluh ditulis 210.\n4. Langkah 4: Sambung kelompoknya: 3.405.210. Tempat yang tidak disebut diisi 0 (di sini puluhan ribu dan satuan).\n5. Langkah 5: Bentuk panjang adalah tiap angka dikali tempatnya: $3\\,000\\,000 + 400\\,000 + 5\\,000 + 200 + 10$.\n\n**Ingat:** tabel nilai tempat.\n\n| Tempat | Nilai satu angka | Angka pada 3.405.210 |\n| --- | --- | --- |\n| jutaan | 1.000.000 | 3 |\n| ratusan ribu | 100.000 | 4 |\n| puluhan ribu | 10.000 | 0 |\n| ribuan | 1.000 | 5 |\n| ratusan | 100 | 2 |\n| puluhan | 10 | 1 |\n| satuan | 1 | 0 |',
              },
              figure: {
                ...placeChart('3405210'),
                caption: {
                  en: 'The number 3,405,210. The two zeros hold the places that were not spoken.',
                  id: 'Bilangan 3.405.210. Dua angka nol menjaga tempat yang tidak disebut.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Zeros and Values', id: 'Awas, Jebakan!: Angka Nol dan Nilai' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| Two million three thousand is 2,300,000. | It is 2,003,000. A place that is not spoken gets a 0. |\n| The value of 7 in 4,730,215 is 7. | The 7 is in the hundred thousands place, so its value is 700,000. |\n| The two 5s in 5,050 are worth the same. | The first 5 is worth 5,000 and the second is worth 50. The place decides the value. |',
                id: '| Salah | Benar |\n| --- | --- |\n| Dua juta tiga ribu ditulis 2.300.000. | Yang benar 2.003.000. Tempat yang tidak disebut diisi 0. |\n| Nilai angka 7 pada 4.730.215 adalah 7. | Angka 7 ada di tempat ratusan ribu, jadi nilainya 700.000. |\n| Dua angka 5 pada 5.050 nilainya sama. | Angka 5 yang pertama bernilai 5.000 dan yang kedua bernilai 50. Tempatnya yang menentukan nilai. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The chart shows 4,730,215. What is the value of the digit 7?',
                id: 'Bagan menunjukkan 4.730.215. Berapakah nilai angka 7?',
              },
              figure: {
                ...placeChart('4730215'),
                caption: { en: 'The number 4,730,215.', id: 'Bilangan 4.730.215.' },
              },
              options: [
                { en: '700,000', id: '700.000' },
                { en: '7', id: '7' },
                { en: '70,000', id: '70.000' },
                { en: '7,000', id: '7.000' },
              ],
              answer: 0,
              explain: {
                en: 'The 7 sits in the hundred thousands box, so it is worth 700,000. The digit alone is 7, and 70,000 and 7,000 are what a 7 would be worth in the ten thousands and thousands boxes.',
                id: 'Angka 7 ada di kotak ratusan ribu, jadi nilainya 700.000. Angkanya sendiri 7, dan 70.000 serta 7.000 adalah nilai angka 7 jika berada di kotak puluhan ribu dan ribuan.',
              },
              hint: {
                en: 'Find the box with the 7, then read the number written above that box.',
                id: 'Cari kotak yang berisi angka 7, lalu baca angka yang tertulis di atas kotak itu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: write 2,304,150 in expanded form. Type the numbers without dots or commas.',
                id: 'Coba bersama: tulis 2.304.150 dalam bentuk panjang. Ketik angkanya tanpa titik atau koma.',
              },
              template: '2\\,304\\,150 = 2\\,000\\,000 + 300\\,000 + ___ + 100 + ___',
              blanks: ['4000', '50'],
              explain: {
                en: 'The 4 is in the thousands place, so it is 4,000. The 5 is in the tens place, so it is 50. The zeros are left out.',
                id: 'Angka 4 ada di tempat ribuan, jadi nilainya 4.000. Angka 5 ada di tempat puluhan, jadi nilainya 50. Angka nol tidak ditulis.',
              },
              hint: {
                en: 'Put 2,304,150 into the place-value boxes. Which digit sits in the thousands box? Which one sits in the tens box?',
                id: 'Masukkan 2.304.150 ke kotak-kotak nilai tempat. Angka apa di kotak ribuan? Angka apa di kotak puluhan?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The chart shows a number. Which words read it correctly?',
                id: 'Bagan menunjukkan sebuah bilangan. Kata-kata mana yang membacanya dengan benar?',
              },
              figure: {
                ...placeChart('5060300'),
                caption: { en: 'A number with four zeros.', id: 'Bilangan dengan empat angka nol.' },
              },
              options: [
                { en: 'five million, sixty thousand, three hundred', id: 'lima juta enam puluh ribu tiga ratus' },
                { en: 'five million, six hundred thousand, three hundred', id: 'lima juta enam ratus ribu tiga ratus' },
                { en: 'fifty-six thousand, three hundred', id: 'lima puluh enam ribu tiga ratus' },
                { en: 'five million, six thousand, three hundred', id: 'lima juta enam ribu tiga ratus' },
              ],
              answer: 0,
              explain: {
                en: 'The groups are 5 | 060 | 300. The 6 is in the ten thousands place, so it is sixty thousand. The other readings move the 6 to a different place.',
                id: 'Kelompoknya adalah 5 | 060 | 300. Angka 6 ada di tempat puluhan ribu, jadi dibaca enam puluh ribu. Bacaan yang lain memindahkan angka 6 ke tempat yang berbeda.',
              },
              hint: {
                en: 'Read the groups from the left: millions, then thousands, then the rest. Which box is the 6 in?',
                id: 'Baca kelompoknya dari kiri: jutaan, lalu ribuan, lalu sisanya. Angka 6 ada di kotak yang mana?',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: { en: 'Choose the two that are equal to 40,305.', id: 'Pilih dua yang sama dengan 40.305.' },
              options: [
                { en: '40,000 + 300 + 5', id: '40.000 + 300 + 5' },
                { en: 'forty thousand, three hundred five', id: 'empat puluh ribu tiga ratus lima' },
                { en: '40,000 + 3,000 + 5', id: '40.000 + 3.000 + 5' },
                { en: '4,000 + 300 + 5', id: '4.000 + 300 + 5' },
              ],
              answer: [0, 1],
              explain: {
                en: '40,305 has 4 in the ten thousands, 3 in the hundreds and 5 in the ones. The other two lines are 43,005 and 4,305.',
                id: '40.305 punya angka 4 di puluhan ribu, 3 di ratusan, dan 5 di satuan. Dua baris lainnya bernilai 43.005 dan 4.305.',
              },
              hint: {
                en: 'First put the digits of 40,305 into the place-value boxes. Then add up each line and compare.',
                id: 'Pertama, masukkan angka-angka 40.305 ke kotak nilai tempat. Lalu jumlahkan tiap baris dan bandingkan.',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: {
                en: 'Look at the number 6,250,403. Decide whether each statement is True or False.',
                id: 'Perhatikan bilangan 6.250.403. Tentukan tiap pernyataan Benar atau Salah.',
              },
              statements: [
                { en: 'The digit 5 is worth 5,000.', id: 'Angka 5 bernilai 5.000.' },
                { en: 'The digit 4 is worth 400.', id: 'Angka 4 bernilai 400.' },
                { en: 'The digit 6 is worth 6,000,000.', id: 'Angka 6 bernilai 6.000.000.' },
                { en: 'The digit 2 is in the ten thousands place.', id: 'Angka 2 ada di tempat puluhan ribu.' },
              ],
              answer: [false, true, true, false],
              explain: {
                en: 'In 6,250,403 the 6 is in the millions (6,000,000), the 2 in the hundred thousands (200,000), the 5 in the ten thousands (50,000) and the 4 in the hundreds (400).',
                id: 'Pada 6.250.403, angka 6 ada di jutaan (6.000.000), angka 2 di ratusan ribu (200.000), angka 5 di puluhan ribu (50.000), dan angka 4 di ratusan (400).',
              },
              hint: {
                en: 'Write the number into a place-value chart and read the box of each digit.',
                id: 'Tulis bilangannya pada bagan nilai tempat dan baca kotak tiap angka.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A school library cost two million, ninety thousand, five hundred rupiah to build. Written with digits, how many rupiah is that? Type it without dots or commas.',
                id: 'Perpustakaan sekolah dibangun dengan biaya dua juta sembilan puluh ribu lima ratus rupiah. Jika ditulis dengan angka, berapa rupiah biayanya? Ketik tanpa titik atau koma.',
              },
              blanks: [{ answer: 2090500, label: '\\text{Rp}' }],
              hints: [
                {
                  en: 'Split the words into groups: "two million", "ninety thousand" and "five hundred".',
                  id: 'Pisahkan kata-katanya menjadi kelompok: "dua juta", "sembilan puluh ribu", dan "lima ratus".',
                },
                {
                  en: 'Make three groups: millions, thousands and ones. The thousands group and the ones group each have three digits.',
                  id: 'Buat tiga kelompok: jutaan, ribuan, dan satuan. Kelompok ribuan dan kelompok satuan masing-masing punya tiga angka.',
                },
                {
                  en: 'Ninety thousand is only two digits, 90, but the thousands group must have three digits, so it needs a 0 in front. Check the ones group too. Then join the three groups.',
                  id: 'Sembilan puluh ribu hanya dua angka, yaitu 90, padahal kelompok ribuan harus punya tiga angka, jadi perlu angka 0 di depannya. Periksa juga kelompok satuan. Lalu sambung ketiga kelompok itu.',
                },
              ],
              explain: {
                en: 'Two million is 2,000,000, ninety thousand is 90,000 and five hundred is 500. Together they make 2,090,500.',
                id: 'Dua juta adalah 2.000.000, sembilan puluh ribu adalah 90.000, dan lima ratus adalah 500. Bersama-sama menjadi 2.090.500.',
              },
              solution: ['2\\,000\\,000 + 90\\,000 + 500', '= 2\\,090\\,500'],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m1-s1-l2',
          title: { en: 'Comparing, Ordering and Rounding', id: 'Membandingkan, Mengurutkan, dan Membulatkan' },
          goal: {
            en: 'You can compare and order whole numbers, and round them to the nearest ten, hundred or thousand.',
            id: 'Kamu bisa membandingkan dan mengurutkan bilangan cacah, dan membulatkannya ke puluhan, ratusan, atau ribuan terdekat.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Which Number Is Bigger?', id: 'Ayo Amati: Bilangan Mana yang Lebih Besar?' },
              body: {
                en: 'Four villages have these numbers of residents: A 3,450, B 3,405, C 3,540 and D 3,045. On a number line, the number that is more to the right is bigger.\n\nTo **compare** without a line, use the signs $<$ (smaller than), $>$ (bigger than) and $=$ (equal). The open side of the sign always faces the bigger number.\n\n- Count the digits first. The number with more digits is bigger.\n- If the digit counts are the same, compare digit by digit from the left, and stop at the first place that is different.\n- So 3,450 and 3,405 both start with 3 and 4, then the tens differ: 5 is more than 0. That means $3\\,450 > 3\\,405$.',
                id: 'Empat desa punya jumlah penduduk: A 3.450, B 3.405, C 3.540, dan D 3.045. Pada garis bilangan, bilangan yang lebih ke kanan lebih besar.\n\nUntuk **membandingkan** tanpa garis, pakai tanda $<$ (lebih kecil dari), $>$ (lebih besar dari), dan $=$ (sama dengan). Sisi yang terbuka pada tanda selalu menghadap bilangan yang lebih besar.\n\n- Hitung dulu banyak angkanya. Bilangan yang angkanya lebih banyak lebih besar.\n- Jika banyak angkanya sama, bandingkan angka demi angka dari kiri, dan berhenti di tempat pertama yang berbeda.\n- Jadi 3.450 dan 3.405 sama-sama diawali 3 dan 4, lalu puluhannya berbeda: 5 lebih besar dari 0. Artinya $3\\,450 > 3\\,405$.',
              },
              figure: {
                ...numberLine({
                  from: 3000,
                  to: 3600,
                  step: 100,
                  marks: [
                    { at: 3450, label: 'A', color: 'a' },
                    { at: 3405, label: 'B', color: 'b' },
                    { at: 3540, label: 'C', color: 'c' },
                    { at: 3045, label: 'D', color: 'result' },
                  ],
                }),
                caption: {
                  en: 'The four villages on a number line. The further right, the more residents: D, B, A, C from smallest to biggest.',
                  id: 'Empat desa pada garis bilangan. Makin ke kanan makin banyak penduduknya: D, B, A, C dari yang terkecil ke terbesar.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Rounding 4,368', id: 'Contoh Bertahap: Membulatkan 4.368' },
              body: {
                en: 'Round 4,368 to the nearest ten, the nearest hundred and the nearest thousand.\n\n1. Step 1: Nearest ten. Look at the digit right after the tens place: the ones digit, 8. It is 5 or more, so round up: 4,370.\n2. Step 2: Nearest hundred. Look at the tens digit, 6. It is 5 or more, so round up: 4,400.\n3. Step 3: Nearest thousand. Look at the hundreds digit, 3. It is less than 5, so round down: 4,000.\n4. Step 4: Check on the number line. 4,368 is past the halfway point 4,350 (the gold dot), so it is closer to 4,400 than to 4,300.\n\n**Remember:** look only at the digit right after the place you round to.\n\n| The digit you look at | What happens |\n| --- | --- |\n| 0, 1, 2, 3 or 4 | round down: the place stays, everything after it becomes 0 |\n| 5, 6, 7, 8 or 9 | round up: the place goes up by 1, everything after it becomes 0 |',
                id: 'Bulatkan 4.368 ke puluhan terdekat, ratusan terdekat, dan ribuan terdekat.\n\n1. Langkah 1: Puluhan terdekat. Lihat angka tepat setelah tempat puluhan: angka satuan, yaitu 8. Angka itu 5 atau lebih, jadi dibulatkan ke atas: 4.370.\n2. Langkah 2: Ratusan terdekat. Lihat angka puluhan, yaitu 6. Angka itu 5 atau lebih, jadi dibulatkan ke atas: 4.400.\n3. Langkah 3: Ribuan terdekat. Lihat angka ratusan, yaitu 3. Angka itu kurang dari 5, jadi dibulatkan ke bawah: 4.000.\n4. Langkah 4: Cek pada garis bilangan. 4.368 sudah melewati titik tengah 4.350 (titik emas), jadi lebih dekat ke 4.400 daripada ke 4.300.\n\n**Ingat:** lihat hanya angka tepat setelah tempat yang dibulatkan.\n\n| Angka yang dilihat | Yang terjadi |\n| --- | --- |\n| 0, 1, 2, 3, atau 4 | dibulatkan ke bawah: tempatnya tetap, semua angka sesudahnya menjadi 0 |\n| 5, 6, 7, 8, atau 9 | dibulatkan ke atas: tempatnya naik 1, semua angka sesudahnya menjadi 0 |',
              },
              figure: {
                ...numberLine({
                  from: 4300,
                  to: 4400,
                  step: 10,
                  labelEvery: 5,
                  marks: [
                    { at: 4350, color: 'c' },
                    { at: 4368, color: 'result' },
                  ],
                }),
                caption: {
                  en: 'The gold dot is the halfway point, 4,350. The red dot is 4,368. It is on the 4,400 side.',
                  id: 'Titik emas adalah titik tengah, 4.350. Titik merah adalah 4.368. Titik itu ada di sisi 4.400.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Comparing and Rounding', id: 'Awas, Jebakan!: Membandingkan dan Membulatkan' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| 9,870 is bigger than 10,200, because 9 is bigger than 1. | Count the digits first. 10,200 has 5 digits and 9,870 has 4, so 10,200 is bigger. |\n| 4,368 rounded to the nearest hundred is 4,370. | That is rounding to the nearest ten. For hundreds look at the tens digit: 4,400. |\n| 3,499 rounded to the nearest thousand: 3,499 becomes 3,500, then 4,000. | Look only at the hundreds digit, 4. It is below 5, so the answer is 3,000. Never round twice. |',
                id: '| Salah | Benar |\n| --- | --- |\n| 9.870 lebih besar dari 10.200, karena 9 lebih besar dari 1. | Hitung dulu banyak angkanya. 10.200 punya 5 angka dan 9.870 punya 4, jadi 10.200 lebih besar. |\n| 4.368 dibulatkan ke ratusan terdekat menjadi 4.370. | Itu pembulatan ke puluhan terdekat. Untuk ratusan lihat angka puluhan: 4.400. |\n| 3.499 dibulatkan ke ribuan terdekat: 3.499 menjadi 3.500, lalu 4.000. | Lihat hanya angka ratusan, yaitu 4. Angka itu di bawah 5, jadi jawabannya 3.000. Jangan membulatkan dua kali. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The number line shows 6,057 and 6,507. Which statement is true?',
                id: 'Garis bilangan menunjukkan 6.057 dan 6.507. Pernyataan mana yang benar?',
              },
              figure: {
                ...numberLine({
                  from: 6000,
                  to: 6600,
                  step: 100,
                  marks: [
                    { at: 6057, color: 'a' },
                    { at: 6507, color: 'b' },
                  ],
                }),
                caption: { en: 'The green dot is 6,057 and the orange dot is 6,507.', id: 'Titik hijau adalah 6.057 dan titik oranye adalah 6.507.' },
              },
              options: [
                { en: '$6\\,057 < 6\\,507$', id: '$6\\,057 < 6\\,507$' },
                { en: '$6\\,057 > 6\\,507$', id: '$6\\,057 > 6\\,507$' },
                { en: '$6\\,057 = 6\\,507$', id: '$6\\,057 = 6\\,507$' },
                { en: '$48\\,900 < 9\\,999$', id: '$48\\,900 < 9\\,999$' },
              ],
              answer: 0,
              explain: {
                en: 'The orange dot is further to the right, so 6,507 is bigger and $6\\,057 < 6\\,507$. The hundreds digits decide: 0 is less than 5. The last line is wrong because 48,900 has more digits.',
                id: 'Titik oranye lebih ke kanan, jadi 6.507 lebih besar dan $6\\,057 < 6\\,507$. Angka ratusannya yang menentukan: 0 lebih kecil dari 5. Baris terakhir salah karena 48.900 punya lebih banyak angka.',
              },
              hint: {
                en: 'Which dot is more to the right? Or compare digit by digit from the left and stop at the first difference.',
                id: 'Titik mana yang lebih ke kanan? Atau bandingkan angka demi angka dari kiri dan berhenti di perbedaan pertama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: round 6,472 to the nearest hundred. Type the number without a dot or comma.',
                id: 'Coba bersama: bulatkan 6.472 ke ratusan terdekat. Ketik angkanya tanpa titik atau koma.',
              },
              template: {
                en: '\\text{tens digit} = ___ \\quad \\text{so} \\quad 6\\,472 \\approx ___',
                id: '\\text{angka puluhan} = ___ \\quad \\text{jadi} \\quad 6\\,472 \\approx ___',
              },
              blanks: ['7', '6500'],
              explain: {
                en: 'For the nearest hundred, look at the tens digit. It is 7, which is 5 or more, so round up: 6,500.',
                id: 'Untuk ratusan terdekat, lihat angka puluhan. Angkanya 7, yaitu 5 atau lebih, jadi dibulatkan ke atas: 6.500.',
              },
              hint: {
                en: 'Which digit is right after the hundreds place? Is it 5 or more?',
                id: 'Angka apa yang tepat setelah tempat ratusan? Apakah angka itu 5 atau lebih?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The red dot shows a number. Rounded to the nearest hundred, what does it become?',
                id: 'Titik merah menunjukkan sebuah bilangan. Jika dibulatkan ke ratusan terdekat, menjadi berapa?',
              },
              figure: {
                ...numberLine({
                  from: 7300,
                  to: 7400,
                  step: 10,
                  labelEvery: 5,
                  marks: [{ at: 7360, color: 'result' }],
                }),
                caption: { en: 'A number between 7,300 and 7,400.', id: 'Sebuah bilangan di antara 7.300 dan 7.400.' },
              },
              options: [
                { en: '7,400', id: '7.400' },
                { en: '7,300', id: '7.300' },
                { en: '7,360', id: '7.360' },
                { en: '7,370', id: '7.370' },
              ],
              answer: 0,
              explain: {
                en: 'The dot is at 7,360, past the halfway point 7,350, so it is closer to 7,400. 7,370 is the number rounded to the nearest ten, not the hundred.',
                id: 'Titiknya di 7.360, sudah melewati titik tengah 7.350, jadi lebih dekat ke 7.400. 7.370 adalah pembulatan ke puluhan terdekat, bukan ratusan.',
              },
              hint: {
                en: 'Read the number first. Then check whether it is before or after the halfway point between the two hundreds.',
                id: 'Baca dulu bilangannya. Lalu cek apakah ia sebelum atau sesudah titik tengah di antara dua ratusan itu.',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: {
                en: 'Choose the two numbers that become 5,000 when rounded to the nearest thousand.',
                id: 'Pilih dua bilangan yang menjadi 5.000 jika dibulatkan ke ribuan terdekat.',
              },
              options: [
                { en: '4,600', id: '4.600' },
                { en: '5,499', id: '5.499' },
                { en: '5,500', id: '5.500' },
                { en: '4,499', id: '4.499' },
              ],
              answer: [0, 1],
              explain: {
                en: '4,600 has hundreds digit 6, so it rounds up to 5,000. 5,499 has hundreds digit 4, so it rounds down to 5,000. 5,500 rounds up to 6,000 and 4,499 rounds down to 4,000.',
                id: '4.600 punya angka ratusan 6, jadi dibulatkan ke atas menjadi 5.000. 5.499 punya angka ratusan 4, jadi dibulatkan ke bawah menjadi 5.000. 5.500 menjadi 6.000 dan 4.499 menjadi 4.000.',
              },
              hint: {
                en: 'For each number, look at the hundreds digit and decide: up or down?',
                id: 'Untuk tiap bilangan, lihat angka ratusannya dan putuskan: ke atas atau ke bawah?',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: { en: 'Decide whether each statement is True or False.', id: 'Tentukan tiap pernyataan Benar atau Salah.' },
              statements: [
                { en: '$12\\,450 > 9\\,999$', id: '$12\\,450 > 9\\,999$' },
                { en: '3,950 rounded to the nearest thousand is 3,000.', id: '3.950 dibulatkan ke ribuan terdekat adalah 3.000.' },
                { en: '6,549 rounded to the nearest hundred is 6,500.', id: '6.549 dibulatkan ke ratusan terdekat adalah 6.500.' },
                { en: '$8\\,305 > 8\\,350$', id: '$8\\,305 > 8\\,350$' },
              ],
              answer: [true, false, true, false],
              explain: {
                en: '12,450 has 5 digits and 9,999 has 4, so the first is bigger. 3,950 has hundreds digit 9, so it rounds up to 4,000. 6,549 has tens digit 4, so it rounds down to 6,500. In 8,305 and 8,350 the tens decide: 0 is less than 5, so 8,305 is smaller.',
                id: '12.450 punya 5 angka dan 9.999 punya 4, jadi yang pertama lebih besar. 3.950 punya angka ratusan 9, jadi dibulatkan ke atas menjadi 4.000. 6.549 punya angka puluhan 4, jadi dibulatkan ke bawah menjadi 6.500. Pada 8.305 dan 8.350, puluhannya yang menentukan: 0 kurang dari 5, jadi 8.305 lebih kecil.',
              },
              hint: {
                en: 'Compare digit by digit from the left. For rounding, look at the digit right after the place.',
                id: 'Bandingkan angka demi angka dari kiri. Untuk pembulatan, lihat angka tepat setelah tempatnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Mr. Joko rounds his egg sales each day to the nearest hundred. In three days he sold 2,347, 1,862 and 2,451 eggs. After rounding each day, what is the total of the three days? Type it without a dot or comma.',
                id: 'Pak Joko membulatkan penjualan telurnya setiap hari ke ratusan terdekat. Dalam tiga hari ia menjual 2.347, 1.862, dan 2.451 butir telur. Setelah tiap hari dibulatkan, berapa jumlah ketiga hari itu? Ketik tanpa titik atau koma.',
              },
              blanks: [{ answer: 6700, after: { en: '\\text{ eggs}', id: '\\text{ butir}' } }],
              hints: [
                {
                  en: 'Rounding to the nearest hundred means looking at the tens digit of each number.',
                  id: 'Membulatkan ke ratusan terdekat berarti melihat angka puluhan tiap bilangan.',
                },
                {
                  en: 'First round each of the three numbers to the nearest hundred. Then add the three rounded numbers.',
                  id: 'Pertama, bulatkan ketiga bilangan ke ratusan terdekat. Lalu jumlahkan ketiga bilangan hasil pembulatan.',
                },
                {
                  en: 'The tens digits are 4, 6 and 5. So 2,347 goes down, and 1,862 and 2,451 go up. Write the three rounded numbers and add them.',
                  id: 'Angka puluhannya 4, 6, dan 5. Jadi 2.347 ke bawah, sedangkan 1.862 dan 2.451 ke atas. Tulis ketiga bilangan hasil pembulatan lalu jumlahkan.',
                },
              ],
              explain: {
                en: '2,347 becomes 2,300; 1,862 becomes 1,900; 2,451 becomes 2,500. Then $2\\,300 + 1\\,900 + 2\\,500 = 6\\,700$.',
                id: '2.347 menjadi 2.300; 1.862 menjadi 1.900; 2.451 menjadi 2.500. Lalu $2\\,300 + 1\\,900 + 2\\,500 = 6\\,700$.',
              },
              solution: ['2\\,347 \\approx 2\\,300', '1\\,862 \\approx 1\\,900', '2\\,451 \\approx 2\\,500', '2\\,300 + 1\\,900 + 2\\,500 = 6\\,700'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m1-s1-p',
        runtime: 'math',
        title: { en: 'Project: Big Numbers', id: 'Proyek: Bilangan Besar' },
        brief: {
          en: 'Four short problems about the value of digits, writing numbers, comparing and rounding. They start easy and end with a number puzzle.',
          id: 'Empat soal singkat tentang nilai angka, menulis bilangan, membandingkan, dan membulatkan. Dimulai dari yang mudah dan ditutup dengan teka-teki bilangan.',
        },
        requirements: [
          { en: 'Read and write numbers up to the millions.', id: 'Membaca dan menulis bilangan sampai jutaan.' },
          { en: 'Compare, order and round whole numbers.', id: 'Membandingkan, mengurutkan, dan membulatkan bilangan cacah.' },
        ],
        tasks: [
          {
            prompt: { en: 'In 3,482,150, what is the value of the digit 8?', id: 'Pada 3.482.150, berapakah nilai angka 8?' },
            blanks: [{ answer: 80000 }],
            solution: {
              en: ['\\text{The 8 is in the ten thousands place}', '8 \\times 10\\,000 = 80\\,000'],
              id: ['\\text{Angka 8 ada di tempat puluhan ribu}', '8 \\times 10\\,000 = 80\\,000'],
            },
          },
          {
            prompt: {
              en: 'Write "seven million, five hundred three thousand, twenty" with digits. Type it without dots or commas.',
              id: 'Tulis "tujuh juta lima ratus tiga ribu dua puluh" dengan angka. Ketik tanpa titik atau koma.',
            },
            blanks: [{ answer: 7503020 }],
            solution: ['7\\,000\\,000 + 503\\,000 + 20', '= 7\\,503\\,020'],
          },
          {
            prompt: {
              en: 'A shop sold these numbers of pens on five days: 12,450; 12,045; 12,540; 12,504; and 11,999. How many pens were sold on the day with the second most sales?',
              id: 'Sebuah toko menjual pulpen selama lima hari: 12.450; 12.045; 12.540; 12.504; dan 11.999 buah. Berapa pulpen terjual pada hari dengan penjualan terbanyak kedua?',
            },
            blanks: [{ answer: 12504, after: { en: '\\text{ pens}', id: '\\text{ buah}' } }],
            solution: ['12\\,540 > 12\\,504 > 12\\,450 > 12\\,045 > 11\\,999', '\\Rightarrow 12\\,504'],
          },
          {
            prompt: {
              en: 'I am a number with four digits. Rounded to the nearest hundred I become 5,300. My tens digit is 6, and my four digits add up to 14. Which number am I?',
              id: 'Aku bilangan empat angka. Jika dibulatkan ke ratusan terdekat, aku menjadi 5.300. Angka puluhanku 6, dan jumlah keempat angkaku 14. Bilangan berapakah aku?',
            },
            figure: {
              ...numberLine({ from: 5200, to: 5400, step: 50, shade: [5250, 5349], marks: [{ at: 5300, color: 'result' }] }),
              caption: {
                en: 'Numbers in the green stretch (5,250 to 5,349) round to 5,300.',
                id: 'Bilangan pada bagian hijau (5.250 sampai 5.349) dibulatkan menjadi 5.300.',
              },
            },
            blanks: [{ answer: 5261 }],
            solution: {
              en: ['5\\,250 \\leq n \\leq 5\\,349', '\\text{tens digit } 6 \\Rightarrow n \\text{ is from } 5\\,260 \\text{ to } 5\\,269', '5 + 2 + 6 + \\text{ones} = 14 \\Rightarrow \\text{ones} = 1', 'n = 5\\,261'],
              id: ['5\\,250 \\leq n \\leq 5\\,349', '\\text{angka puluhan } 6 \\Rightarrow n \\text{ dari } 5\\,260 \\text{ sampai } 5\\,269', '5 + 2 + 6 + \\text{satuan} = 14 \\Rightarrow \\text{satuan} = 1', 'n = 5\\,261'],
            },
          },
        ],
        hints: [
          {
            en: 'The place of a digit decides its value. Count the places from the right: ones, tens, hundreds, thousands...',
            id: 'Tempat sebuah angka menentukan nilainya. Hitung tempatnya dari kanan: satuan, puluhan, ratusan, ribuan...',
          },
          {
            en: 'To compare, count the digits first, then compare from the left. To round, look at the digit right after the place.',
            id: 'Untuk membandingkan, hitung dulu banyak angkanya, lalu bandingkan dari kiri. Untuk membulatkan, lihat angka tepat setelah tempatnya.',
          },
          {
            en: 'For the puzzle, first find which numbers round to 5,300, then use the other clues one by one.',
            id: 'Untuk teka-teki, cari dulu bilangan mana yang dibulatkan menjadi 5.300, lalu pakai petunjuk lainnya satu per satu.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------------ addition and subtraction */
    {
      id: 'tka-m1-s2',
      title: { en: 'Addition and Subtraction', id: 'Penjumlahan dan Pengurangan' },
      summary: {
        en: 'Add and subtract big numbers in columns, calculate smartly in your head, and turn stories into the right operation.',
        id: 'Menjumlah dan mengurang bilangan besar secara bersusun, berhitung cerdas di kepala, dan mengubah cerita menjadi operasi yang tepat.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m1-s2-l1',
          title: { en: 'Column Addition and Subtraction', id: 'Menjumlah dan Mengurang Bersusun' },
          goal: {
            en: 'You can add and subtract numbers up to 6 digits in columns, check your answer, and use quick tricks in your head.',
            id: 'Kamu bisa menjumlah dan mengurang bilangan sampai 6 angka secara bersusun, memeriksa jawabanmu, dan memakai cara cepat di kepala.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Adding in Columns', id: 'Ayo Amati: Menjumlah Bersusun' },
              body: {
                en: 'Mrs. Sari’s bakery sold 3,456 rolls in May and 2,789 rolls in June. How many rolls is that in all?\n\nFor big numbers, write them in **columns**: ones under ones, tens under tens, hundreds under hundreds. Then add one column at a time, starting from the right.\n\nIf a column adds up to 10 or more, write only the ones digit and **carry** the rest to the next column. Here 6 + 9 = 15, so write 5 and carry 1 ten to the tens column.',
                id: 'Toko roti Bu Sari menjual 3.456 roti pada bulan Mei dan 2.789 roti pada bulan Juni. Berapa roti seluruhnya?\n\nUntuk bilangan besar, tulis bilangan dalam **kolom**: satuan di bawah satuan, puluhan di bawah puluhan, ratusan di bawah ratusan. Lalu jumlahkan satu kolom demi satu kolom, mulai dari kanan.\n\nJika jumlah satu kolom 10 atau lebih, tulis hanya angka satuannya dan **simpan** sisanya ke kolom berikutnya. Di sini 6 + 9 = 15, jadi tulis 5 dan simpan 1 puluhan ke kolom puluhan.',
              },
              figure: {
                ...workings([wc(['1', '1', '1', '']), wr('3456'), wr('2789', { sign: '+', line: true }), wr('6245', { color: 'result' })]),
                caption: {
                  en: '3,456 + 2,789 = 6,245. The small orange 1s are the carried digits.',
                  id: '3.456 + 2.789 = 6.245. Angka 1 kecil berwarna oranye adalah angka yang disimpan.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Subtracting in Columns', id: 'Contoh Bertahap: Mengurang Bersusun' },
              body: {
                en: 'Ani had 6,431 stickers and gave away 2,758. How many are left? Work it out in columns.\n\n1. Step 1: Write the bigger number on top and the smaller one under it, ones under ones.\n2. Step 2: Ones: 1 is less than 8, so borrow. Take 1 ten from the 3 tens (it becomes 2). The ones become 11, and 11 − 8 = 3.\n3. Step 3: Tens: 2 is less than 5, so borrow 1 hundred from the 4 hundreds (it becomes 3). The tens become 12, and 12 − 5 = 7.\n4. Step 4: Hundreds: now 3 is less than 7, so borrow 1 thousand from the 6 (it becomes 5). The hundreds become 13, and 13 − 7 = 6.\n5. Step 5: Thousands: 5 − 2 = 3. The answer is 3,673.\n6. Step 6: Check with addition: $3\\,673 + 2\\,758 = 6\\,431$. It matches.\n\n**Remember:**\n\n- A column whose top digit is too small **borrows** 1 from the column on its left. That 1 is worth 10 in this column.\n- Check a subtraction with an addition: answer + smaller number = bigger number.',
                id: 'Ani punya 6.431 stiker dan memberikan 2.758 stiker. Berapa stiker yang tersisa? Hitunglah secara bersusun.\n\n1. Langkah 1: Tulis bilangan yang besar di atas dan yang kecil di bawahnya, satuan di bawah satuan.\n2. Langkah 2: Satuan: 1 kurang dari 8, jadi meminjam. Ambil 1 puluhan dari 3 puluhan (menjadi 2). Satuan menjadi 11, dan 11 − 8 = 3.\n3. Langkah 3: Puluhan: 2 kurang dari 5, jadi pinjam 1 ratusan dari 4 ratusan (menjadi 3). Puluhan menjadi 12, dan 12 − 5 = 7.\n4. Langkah 4: Ratusan: sekarang 3 kurang dari 7, jadi pinjam 1 ribuan dari angka 6 (menjadi 5). Ratusan menjadi 13, dan 13 − 7 = 6.\n5. Langkah 5: Ribuan: 5 − 2 = 3. Jawabannya 3.673.\n6. Langkah 6: Periksa dengan penjumlahan: $3\\,673 + 2\\,758 = 6\\,431$. Hasilnya cocok.\n\n**Ingat:**\n\n- Kolom yang angka atasnya terlalu kecil **meminjam** 1 dari kolom di sebelah kirinya. Angka 1 itu bernilai 10 di kolom ini.\n- Periksa pengurangan dengan penjumlahan: hasil + bilangan yang kecil = bilangan yang besar.',
              },
              figure: {
                ...workings([wc(['5', '13', '12', '11']), wr('6431'), wr('2758', { sign: '−', line: true }), wr('3673', { color: 'result' })]),
                caption: {
                  en: '6,431 − 2,758 = 3,673. The small orange numbers are what the top digits become after borrowing.',
                  id: '6.431 − 2.758 = 3.673. Angka kecil berwarna oranye adalah nilai baru angka atas setelah meminjam.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Columns', id: 'Awas, Jebakan!: Bersusun' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| 3,456 + 2,789 = 5,135 | The carries were forgotten. 6 + 9 = 15, so write 5 and carry 1. The answer is 6,245. |\n| 6,431 − 2,758 = 4,327, by taking the smaller digit from the bigger digit in every column. | Never flip a column. If the top digit is smaller, borrow from the left. The answer is 3,673. |\n| 4,305 + 987 with the 9 written under the 4. | Line up the ones first. The 9 is in the hundreds place, so it goes under the 3. The answer is 5,292. |',
                id: '| Salah | Benar |\n| --- | --- |\n| 3.456 + 2.789 = 5.135 | Angka simpanannya terlupa. 6 + 9 = 15, jadi tulis 5 dan simpan 1. Jawabannya 6.245. |\n| 6.431 − 2.758 = 4.327, dengan mengurangkan angka kecil dari angka besar di setiap kolom. | Jangan membalik kolom. Jika angka atas lebih kecil, pinjam dari kolom kiri. Jawabannya 3.673. |\n| 4.305 + 987 dengan angka 9 ditulis di bawah angka 4. | Sejajarkan satuan dulu. Angka 9 ada di tempat ratusan, jadi ia di bawah angka 3. Jawabannya 5.292. |',
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Look Closely: Quick Tricks in Your Head', id: 'Ayo Amati: Cara Cepat di Kepala' },
              body: {
                en: 'You do not always need columns. When a number is close to a round number, change the numbers first.\n\n| Trick | Example | Why it works |\n| --- | --- | --- |\n| Round, then adjust | 498 + 367 = 500 + 367 − 2 = 865 | 498 is 2 less than 500, so take 2 away at the end. |\n| Make a round number | 396 + 278 = 400 + 274 = 674 | Move 4 from one number to the other. The total stays the same. |\n| Count up | 5,000 − 3,860: 3,860 + 140 = 4,000, then 4,000 + 1,000 = 5,000, so the answer is 140 + 1,000 = 1,140 | A subtraction is the gap between two numbers. |\n\nThe number line shows the third trick: two jumps from 3,860 up to 5,000.',
                id: 'Kamu tidak selalu perlu bersusun. Jika sebuah bilangan dekat dengan bilangan bulat, ubah dulu bilangannya.\n\n| Cara | Contoh | Mengapa berhasil |\n| --- | --- | --- |\n| Bulatkan, lalu sesuaikan | 498 + 367 = 500 + 367 − 2 = 865 | 498 kurang 2 dari 500, jadi kurangi 2 di akhir. |\n| Buat bilangan bulat | 396 + 278 = 400 + 274 = 674 | Pindahkan 4 dari satu bilangan ke bilangan lain. Jumlahnya tetap sama. |\n| Hitung maju | 5.000 − 3.860: 3.860 + 140 = 4.000, lalu 4.000 + 1.000 = 5.000, jadi jawabannya 140 + 1.000 = 1.140 | Pengurangan adalah jarak antara dua bilangan. |\n\nGaris bilangan menunjukkan cara ketiga: dua lompatan dari 3.860 naik ke 5.000.',
              },
              figure: {
                ...numberLine({
                  from: 3800,
                  to: 5000,
                  step: 100,
                  labelEvery: 2,
                  marks: [{ at: 3860, color: 'a' }, { at: 4000, color: 'b' }, { at: 5000, color: 'result' }],
                  jumps: [
                    { from: 3860, to: 4000, label: '+140', color: 'b' },
                    { from: 4000, to: 5000, label: '+1000', color: 'a' },
                  ],
                }),
                caption: {
                  en: 'Count up from 3,860 to 5,000: first +140, then +1,000.',
                  id: 'Hitung maju dari 3.860 ke 5.000: pertama +140, lalu +1.000.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'The working shows the carried digits. What is 5,678 + 3,596?', id: 'Pengerjaan menunjukkan angka simpanan. Berapakah 5.678 + 3.596?' },
              figure: {
                ...workings([wc(['1', '1', '1', '']), wr('5678'), wr('3596', { sign: '+', line: true })]),
                caption: { en: 'Add column by column. The orange 1s are carried.', id: 'Jumlahkan kolom demi kolom. Angka 1 oranye adalah angka simpanan.' },
              },
              options: [
                { en: '9,274', id: '9.274' },
                { en: '8,164', id: '8.164' },
                { en: '9,264', id: '9.264' },
                { en: '8,274', id: '8.274' },
              ],
              answer: 0,
              explain: {
                en: 'Ones 8 + 6 = 14 (write 4, carry 1). Tens 7 + 9 + 1 = 17 (write 7, carry 1). Hundreds 6 + 5 + 1 = 12 (write 2, carry 1). Thousands 5 + 3 + 1 = 9. If all the carries are forgotten you get 8,164; if one carry is lost you get 9,264 or 8,274.',
                id: 'Satuan 8 + 6 = 14 (tulis 4, simpan 1). Puluhan 7 + 9 + 1 = 17 (tulis 7, simpan 1). Ratusan 6 + 5 + 1 = 12 (tulis 2, simpan 1). Ribuan 5 + 3 + 1 = 9. Jika semua simpanan terlupa hasilnya 8.164; jika satu simpanan hilang hasilnya 9.264 atau 8.274.',
              },
              hint: {
                en: 'Start at the ones column. When a column is 10 or more, carry. Do not forget to add the carried 1 in the next column.',
                id: 'Mulailah dari kolom satuan. Jika satu kolom 10 atau lebih, simpan. Jangan lupa menambahkan angka 1 simpanan di kolom berikutnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: finish 6,431 − 2,758 and check it. Type the numbers without dots or commas.',
                id: 'Coba bersama: selesaikan 6.431 − 2.758 dan periksa hasilnya. Ketik angkanya tanpa titik atau koma.',
              },
              template: {
                en: '\\text{ones: } 11 - 8 = ___ \\quad \\text{check: } 3\\,673 + 2\\,758 = ___',
                id: '\\text{satuan: } 11 - 8 = ___ \\quad \\text{periksa: } 3\\,673 + 2\\,758 = ___',
              },
              blanks: ['3', '6431'],
              explain: {
                en: 'The ones become 11 after borrowing, and 11 − 8 = 3. The check adds the answer to the smaller number, and it gives back the bigger number 6,431.',
                id: 'Satuan menjadi 11 setelah meminjam, dan 11 − 8 = 3. Pemeriksaan menjumlahkan hasil dengan bilangan yang kecil, dan hasilnya kembali ke bilangan yang besar, 6.431.',
              },
              hint: {
                en: 'Subtract the ones first. For the check, add the answer to the number you took away.',
                id: 'Kurangkan satuannya dulu. Untuk pemeriksaan, jumlahkan hasilnya dengan bilangan yang dikurangkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The working shows what the top digits become after borrowing. What is 5,203 − 2,468?',
                id: 'Pengerjaan menunjukkan nilai baru angka atas setelah meminjam. Berapakah 5.203 − 2.468?',
              },
              figure: {
                ...workings([wc(['4', '11', '9', '13']), wr('5203'), wr('2468', { sign: '−', line: true })]),
                caption: {
                  en: 'The 0 could not lend, so the 2 lent first and the 0 became 10, then 9 after it lent to the ones.',
                  id: 'Angka 0 tidak bisa meminjamkan, jadi angka 2 meminjamkan lebih dulu dan angka 0 menjadi 10, lalu 9 setelah meminjamkan ke satuan.',
                },
              },
              options: [
                { en: '2,735', id: '2.735' },
                { en: '3,265', id: '3.265' },
                { en: '2,745', id: '2.745' },
                { en: '3,735', id: '3.735' },
              ],
              answer: 0,
              explain: {
                en: 'Subtract each column with the new top digits: 13 − 8 = 5, 9 − 6 = 3, 11 − 4 = 7, 4 − 2 = 2. That gives 2,735. The answer 3,265 flips the columns, 2,745 forgets that the tens lent 1, and 3,735 forgets that the thousands lent 1.',
                id: 'Kurangkan tiap kolom dengan angka atas yang baru: 13 − 8 = 5, 9 − 6 = 3, 11 − 4 = 7, 4 − 2 = 2. Hasilnya 2.735. Jawaban 3.265 membalik kolom, 2.745 lupa bahwa puluhan meminjamkan 1, dan 3.735 lupa bahwa ribuan meminjamkan 1.',
              },
              hint: {
                en: 'Use the orange numbers as the top row. Subtract column by column from the right.',
                id: 'Pakai angka oranye sebagai baris atas. Kurangkan kolom demi kolom dari kanan.',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: { en: 'Choose the two lines that are correct.', id: 'Pilih dua baris yang benar.' },
              options: [
                { en: '498 + 367 = 500 + 367 − 2', id: '498 + 367 = 500 + 367 − 2' },
                { en: '396 + 278 = 400 + 274', id: '396 + 278 = 400 + 274' },
                { en: '498 + 367 = 500 + 367 + 2', id: '498 + 367 = 500 + 367 + 2' },
                { en: '396 + 278 = 400 + 278', id: '396 + 278 = 400 + 278' },
              ],
              answer: [0, 1],
              explain: {
                en: '498 is 2 less than 500, so after adding with 500 you must take 2 away. In 396 + 278, 4 moves from 278 to 396, so both sides stay equal. The other two lines add or lose some amount.',
                id: '498 kurang 2 dari 500, jadi setelah menjumlah dengan 500 kamu harus mengurangi 2. Pada 396 + 278, angka 4 dipindah dari 278 ke 396, jadi kedua sisi tetap sama. Dua baris yang lain menambah atau menghilangkan sejumlah nilai.',
              },
              hint: {
                en: 'When you change one number, the other side must change by the same amount so the result stays the same.',
                id: 'Ketika kamu mengubah satu bilangan, sisi lainnya harus berubah sebesar itu juga agar hasilnya tetap sama.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Mr. Eko pays for a cupboard that costs Rp134,750. He pays with Rp250,000. How many rupiah is his change? Use columns and type it without dots or commas.',
                id: 'Pak Eko membeli lemari seharga Rp134.750. Ia membayar dengan uang Rp250.000. Berapa rupiah kembaliannya? Hitung secara bersusun dan ketik tanpa titik atau koma.',
              },
              blanks: [{ answer: 115250, label: '\\text{Rp}' }],
              hints: [
                {
                  en: 'Change is the money you give minus the price.',
                  id: 'Kembalian adalah uang yang dibayarkan dikurangi harga barang.',
                },
                {
                  en: 'Subtract 134,750 from 250,000. The top number ends in zeros, so you will have to borrow from the left.',
                  id: 'Kurangkan 134.750 dari 250.000. Bilangan atas berakhiran nol, jadi kamu perlu meminjam dari kolom di kiri.',
                },
                {
                  en: 'The ones column is 0 − 0. The tens column needs to borrow, and that borrowing passes through the zeros. Check with an addition at the end.',
                  id: 'Kolom satuan adalah 0 − 0. Kolom puluhan perlu meminjam, dan peminjaman itu melewati angka-angka nol. Periksa dengan penjumlahan di akhir.',
                },
              ],
              explain: {
                en: '250,000 − 134,750 = 115,250. Check: 115,250 + 134,750 = 250,000.',
                id: '250.000 − 134.750 = 115.250. Periksa: 115.250 + 134.750 = 250.000.',
              },
              solution: ['250\\,000 - 134\\,750 = 115\\,250', '115\\,250 + 134\\,750 = 250\\,000'],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m1-s2-l2',
          title: { en: 'Add and Subtract Word Problems', id: 'Soal Cerita Tambah dan Kurang' },
          goal: {
            en: 'You can draw a bar model for a story, choose add or subtract by reading the whole sentence, and solve two-step problems.',
            id: 'Kamu bisa menggambar model batang untuk sebuah cerita, memilih tambah atau kurang dengan membaca seluruh kalimat, dan menyelesaikan soal dua langkah.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Bar Models', id: 'Ayo Amati: Model Batang' },
              body: {
                en: 'Budi has 378 marbles and Ani has 245. A **bar model** draws each amount as a bar. A longer bar means a bigger number.\n\nPut the bars one under the other. The piece that sticks out is the **difference**: how many more one person has than the other.\n\nThere are two kinds of pictures. When you put parts together, the answer is the whole bar, so you add. When you take a part away or compare two bars, the answer is a missing piece, so you subtract.',
                id: 'Budi punya 378 kelereng dan Ani punya 245. **Model batang** menggambar tiap jumlah sebagai sebuah batang. Batang yang lebih panjang berarti bilangan yang lebih besar.\n\nLetakkan batang-batang itu satu di bawah yang lain. Bagian yang menonjol adalah **selisih**: berapa banyak lebihnya satu orang dari orang lain.\n\nAda dua jenis gambar. Jika bagian-bagian digabung, jawabannya adalah seluruh batang, jadi kamu menjumlah. Jika sebuah bagian diambil atau dua batang dibandingkan, jawabannya adalah bagian yang hilang, jadi kamu mengurang.',
              },
              figure: {
                ...barModel([
                  { label: 'Budi', segs: [{ v: 378, color: 'b' }] },
                  { label: 'Ani', segs: [{ v: 245, color: 'a' }, { v: 133, unknown: true }] },
                ], { plain: true }),
                caption: {
                  en: 'Budi’s bar is longer. The red box with ? is the difference between the two bars.',
                  id: 'Batang Budi lebih panjang. Kotak merah dengan ? adalah selisih antara kedua batang.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: A Two-Step Story', id: 'Contoh Bertahap: Cerita Dua Langkah' },
              body: {
                en: 'Mr. Hasan’s shop had 1,250 eggs. In the morning 478 eggs were sold. In the afternoon 600 new eggs arrived. How many eggs are there now?\n\n1. Step 1: Read the story and draw it. The shop starts with 1,250 eggs. Some go out, then some come in.\n2. Step 2: Sold means fewer eggs, so subtract: $1\\,250 - 478 = 772$.\n3. Step 3: Arrived means more eggs, so add: $772 + 600 = 1\\,372$.\n4. Step 4: Check that the answer makes sense. 772 is less than 1,250, and 1,372 is more than 772, just as the story says.\n5. Step 5: Answer with the unit: 1,372 eggs.\n\n**Remember:** the words help, but the story decides.\n\n- Something goes out or is taken away: subtract.\n- Something comes in or is put together: add.\n- Two amounts are compared: subtract the smaller from the bigger.',
                id: 'Toko Pak Hasan punya 1.250 butir telur. Pagi hari terjual 478 butir. Sore hari datang kiriman 600 butir telur baru. Berapa butir telur sekarang?\n\n1. Langkah 1: Baca ceritanya dan gambarlah. Toko mulai dengan 1.250 butir telur. Ada yang keluar, lalu ada yang masuk.\n2. Langkah 2: Terjual berarti telur berkurang, jadi dikurangi: $1\\,250 - 478 = 772$.\n3. Langkah 3: Datang berarti telur bertambah, jadi dijumlah: $772 + 600 = 1\\,372$.\n4. Langkah 4: Periksa apakah jawabannya masuk akal. 772 kurang dari 1.250, dan 1.372 lebih dari 772, sesuai dengan cerita.\n5. Langkah 5: Jawab dengan satuannya: 1.372 butir telur.\n\n**Ingat:** kata-kata membantu, tetapi ceritanyalah yang menentukan.\n\n- Sesuatu keluar atau diambil: kurangi.\n- Sesuatu masuk atau digabung: jumlahkan.\n- Dua jumlah dibandingkan: kurangi bilangan besar dengan bilangan kecil.',
              },
              figure: {
                ...barModel([
                  { segs: [{ v: 1250, color: 'a' }] },
                  { segs: [{ v: 478, color: 'b' }, { v: 772, color: 'a' }] },
                  { segs: [{ v: 772, color: 'a' }, { v: 600, color: 'c' }] },
                ]),
                caption: {
                  en: 'Top: 1,250 eggs at the start. Middle: 478 sold, 772 left. Bottom: the 772 left and 600 new ones.',
                  id: 'Atas: 1.250 butir telur di awal. Tengah: 478 terjual, 772 tersisa. Bawah: 772 yang tersisa dan 600 yang baru.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Words Can Trick You', id: 'Awas, Jebakan!: Kata Bisa Menipu' },
              body: {
                en: 'Some words look like they mean add or subtract, but you must read the whole sentence.\n\n| In the story | What it really asks | Calculation |\n| --- | --- | --- |\n| Budi has 133 more than Ani, and Ani has 245. How many does Budi have? | Budi’s amount, which is bigger than Ani’s | 245 + 133 |\n| Budi has 378 and Ani has 245. How many more does Budi have than Ani? | The difference between two amounts | 378 − 245 |\n| A box has 40 books and 15 are given away. How many are left? | What remains after some leave | 40 − 15 |\n| Ani received 15 more books and now has 40. How many did she have at first? | The start, so go backward | 40 − 15 |\n\nNever choose the operation from one word. Ask yourself: does the amount grow, shrink, or are two amounts compared?',
                id: 'Beberapa kata tampak berarti tambah atau kurang, tetapi kamu harus membaca seluruh kalimat.\n\n| Dalam cerita | Sebenarnya menanyakan | Hitungan |\n| --- | --- | --- |\n| Budi punya 133 lebih banyak dari Ani, dan Ani punya 245. Berapa kelereng Budi? | Jumlah Budi, yang lebih besar dari jumlah Ani | 245 + 133 |\n| Budi punya 378 dan Ani punya 245. Kelereng Budi lebih banyak berapa daripada kelereng Ani? | Selisih antara dua jumlah | 378 − 245 |\n| Sebuah kotak berisi 40 buku dan 15 diberikan. Berapa sisanya? | Yang tersisa setelah sebagian keluar | 40 − 15 |\n| Ani menerima 15 buku lagi dan sekarang punya 40. Berapa buku Ani semula? | Jumlah awal, jadi dihitung mundur | 40 − 15 |\n\nJangan memilih operasi hanya dari satu kata. Tanyakan pada dirimu: apakah jumlahnya bertambah, berkurang, atau dua jumlah dibandingkan?',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Ani has 3,450 stickers and Budi has 2,875. How many more stickers does Ani have than Budi?',
                id: 'Ani punya 3.450 stiker dan Budi punya 2.875. Stiker Ani lebih banyak berapa daripada stiker Budi?',
              },
              figure: {
                ...barModel([
                  { label: 'Ani', segs: [{ v: 3450, color: 'a' }] },
                  { label: 'Budi', segs: [{ v: 2875, color: 'b' }, { v: 575, unknown: true }] },
                ]),
                caption: { en: 'The bars of Ani and Budi. The ? is the gap between them.', id: 'Batang Ani dan Budi. Tanda ? adalah jarak di antara keduanya.' },
              },
              options: [
                { en: '575', id: '575' },
                { en: '6,325', id: '6.325' },
                { en: '1,425', id: '1.425' },
                { en: '675', id: '675' },
              ],
              answer: 0,
              explain: {
                en: 'A comparison is a subtraction: $3\\,450 - 2\\,875 = 575$. The number 6,325 comes from adding, 1,425 from taking the smaller digit from the bigger one in each column, and 675 from a borrowing slip.',
                id: 'Membandingkan berarti mengurang: $3\\,450 - 2\\,875 = 575$. Bilangan 6.325 berasal dari menjumlah, 1.425 dari mengurangkan angka kecil dari angka besar di setiap kolom, dan 675 dari salah meminjam.',
              },
              hint: {
                en: 'The question compares two amounts. Which operation finds the gap between two bars?',
                id: 'Soal ini membandingkan dua jumlah. Operasi apa yang mencari jarak antara dua batang?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: solve the egg story from the example. Type the numbers without dots or commas.',
                id: 'Coba bersama: selesaikan cerita telur pada contoh. Ketik angkanya tanpa titik atau koma.',
              },
              template: '1\\,250 - 478 = ___ \\quad\\quad ___ + 600 = 1\\,372',
              blanks: ['772', '772'],
              explain: {
                en: 'First step: 1,250 − 478 = 772 eggs after the sale. Second step: add the 600 new eggs to those 772 to get 1,372.',
                id: 'Langkah pertama: 1.250 − 478 = 772 butir telur setelah terjual. Langkah kedua: tambahkan 600 telur baru ke 772 itu menjadi 1.372.',
              },
              hint: {
                en: 'The second blank is the number you get from the first step.',
                id: 'Isian kedua adalah bilangan yang kamu dapat dari langkah pertama.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'A bus has 48 children. At the first stop 15 children get off and 9 get on. Which number sentence fits the picture?',
                id: 'Sebuah bus membawa 48 anak. Di pemberhentian pertama 15 anak turun dan 9 anak naik. Kalimat bilangan mana yang sesuai dengan gambar?',
              },
              figure: {
                ...barModel([
                  { segs: [{ v: 15, color: 'b' }, { v: 33, color: 'a' }] },
                  { segs: [{ v: 33, color: 'a' }, { v: 9, color: 'c' }] },
                ], { plain: true }),
                caption: {
                  en: 'Top: 48 children, 15 of them get off and 33 stay. Bottom: the 33 who stay and the 9 who get on.',
                  id: 'Atas: 48 anak, 15 di antaranya turun dan 33 tetap. Bawah: 33 anak yang tetap dan 9 anak yang naik.',
                },
              },
              options: [
                { en: '$48 - 15 + 9$', id: '$48 - 15 + 9$' },
                { en: '$48 + 15 - 9$', id: '$48 + 15 - 9$' },
                { en: '$48 - 15 - 9$', id: '$48 - 15 - 9$' },
                { en: '$48 + 15 + 9$', id: '$48 + 15 + 9$' },
              ],
              answer: 0,
              explain: {
                en: 'Children getting off take away from 48, and children getting on add to what is left: $48 - 15 + 9 = 42$. The other sentences use the wrong sign for one or both events.',
                id: 'Anak yang turun mengurangi 48, dan anak yang naik menambah sisanya: $48 - 15 + 9 = 42$. Kalimat yang lain memakai tanda yang salah untuk satu atau kedua kejadian.',
              },
              hint: {
                en: 'Look at each part of the story: does it make the number of children smaller or bigger?',
                id: 'Perhatikan tiap bagian cerita: apakah jumlah anak menjadi lebih sedikit atau lebih banyak?',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: {
                en: 'A ribbon is 1,200 cm long. Ani cuts off 350 cm and Budi cuts off 275 cm. Choose the two ways that find the length that is left.',
                id: 'Sebuah pita panjangnya 1.200 cm. Ani memotong 350 cm dan Budi memotong 275 cm. Pilih dua cara yang menemukan panjang pita yang tersisa.',
              },
              options: [
                { en: '1,200 − 350 − 275', id: '1.200 − 350 − 275' },
                { en: '350 + 275 = 625, then 1,200 − 625', id: '350 + 275 = 625, lalu 1.200 − 625' },
                { en: '1,200 − 350 + 275', id: '1.200 − 350 + 275' },
                { en: '1,200 + 350 + 275', id: '1.200 + 350 + 275' },
              ],
              answer: [0, 1],
              explain: {
                en: 'Both cuts take ribbon away, so take them away one by one or take away their total. Adding 275 back, or adding both cuts to the ribbon, does not match the story. The ribbon left is 575 cm.',
                id: 'Kedua potongan mengambil pita, jadi ambil satu per satu atau ambil jumlah keduanya. Menambahkan 275 kembali, atau menambahkan kedua potongan ke pita, tidak sesuai dengan cerita. Pita yang tersisa 575 cm.',
              },
              hint: {
                en: 'Does each cut make the ribbon shorter or longer?',
                id: 'Apakah tiap potongan membuat pita lebih pendek atau lebih panjang?',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: { en: 'Read each statement and decide whether it is True or False.', id: 'Baca tiap pernyataan dan tentukan Benar atau Salah.' },
              statements: [
                {
                  en: 'Budi has 15 more stickers than Ani, and Ani has 40. To find Budi’s stickers, calculate 40 − 15.',
                  id: 'Budi punya 15 stiker lebih banyak dari Ani, dan Ani punya 40. Untuk mencari stiker Budi, hitung 40 − 15.',
                },
                {
                  en: 'Ani has 40 stickers and Budi has 55. The difference is 55 − 40 = 15.',
                  id: 'Ani punya 40 stiker dan Budi punya 55. Selisihnya adalah 55 − 40 = 15.',
                },
                {
                  en: 'Ani received 15 stickers and now has 40. At first she had 40 − 15 = 25.',
                  id: 'Ani menerima 15 stiker dan sekarang punya 40. Semula ia punya 40 − 15 = 25.',
                },
                {
                  en: 'The word "more" in a story always means add.',
                  id: 'Kata "lebih banyak" dalam sebuah cerita selalu berarti tambah.',
                },
              ],
              answer: [false, true, true, false],
              explain: {
                en: 'Budi has more than Ani, so add: 40 + 15 = 55. A difference compares two amounts by subtracting. If Ani received 15 and now has 40, going back means taking 15 away. "More" can mean add or compare, so read the whole sentence.',
                id: 'Budi punya lebih banyak dari Ani, jadi dijumlah: 40 + 15 = 55. Selisih membandingkan dua jumlah dengan mengurang. Jika Ani menerima 15 dan sekarang punya 40, mundur berarti mengambil 15. "Lebih banyak" bisa berarti tambah atau membandingkan, jadi baca seluruh kalimat.',
              },
              hint: {
                en: 'For each statement, decide whether the amount grows, shrinks, or two amounts are compared.',
                id: 'Untuk tiap pernyataan, tentukan apakah jumlahnya bertambah, berkurang, atau dua jumlah dibandingkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A factory made 125,480 bottles in January and 98,765 bottles in February. It has already sent 150,000 bottles to shops. How many bottles have not been sent yet? Type it without dots or commas.',
                id: 'Sebuah pabrik membuat 125.480 botol pada bulan Januari dan 98.765 botol pada bulan Februari. Pabrik sudah mengirim 150.000 botol ke toko-toko. Berapa botol yang belum dikirim? Ketik tanpa titik atau koma.',
              },
              blanks: [{ answer: 74245, after: { en: '\\text{ bottles}', id: '\\text{ botol}' } }],
              hints: [
                {
                  en: 'There are two steps. First, how many bottles were made in the two months together? Then, how many are left after sending some?',
                  id: 'Ada dua langkah. Pertama, berapa botol yang dibuat dalam dua bulan bersama? Lalu, berapa yang tersisa setelah sebagian dikirim?',
                },
                {
                  en: 'First add January and February. Then subtract the bottles that were sent.',
                  id: 'Pertama jumlahkan Januari dan Februari. Lalu kurangkan botol yang sudah dikirim.',
                },
                {
                  en: 'The two months together are a bit more than 220,000 bottles. Subtract 150,000 from that total.',
                  id: 'Dua bulan bersama sedikit lebih dari 220.000 botol. Kurangkan 150.000 dari jumlah itu.',
                },
              ],
              explain: {
                en: 'Made in all: 125,480 + 98,765 = 224,245. Not sent yet: 224,245 − 150,000 = 74,245.',
                id: 'Dibuat seluruhnya: 125.480 + 98.765 = 224.245. Belum dikirim: 224.245 − 150.000 = 74.245.',
              },
              solution: ['125\\,480 + 98\\,765 = 224\\,245', '224\\,245 - 150\\,000 = 74\\,245'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m1-s2-p',
        runtime: 'math',
        title: { en: 'Project: Adding and Subtracting', id: 'Proyek: Menjumlah dan Mengurang' },
        brief: {
          en: 'Four problems about adding and subtracting big numbers, from a plain calculation to a story with three children.',
          id: 'Empat soal tentang menjumlah dan mengurang bilangan besar, dari hitungan biasa sampai cerita tentang tiga anak.',
        },
        requirements: [
          { en: 'Add and subtract numbers up to 6 digits in columns.', id: 'Menjumlah dan mengurang bilangan sampai 6 angka secara bersusun.' },
          { en: 'Solve add and subtract stories with two or more steps.', id: 'Menyelesaikan soal cerita tambah dan kurang dengan dua langkah atau lebih.' },
        ],
        tasks: [
          {
            prompt: { en: 'Calculate $4\\,375 + 2\\,968$.', id: 'Hitunglah $4\\,375 + 2\\,968$.' },
            blanks: [{ answer: 7343 }],
            solution: ['5 + 8 = 13', '7 + 6 + 1 = 14', '3 + 9 + 1 = 13', '4 + 2 + 1 = 7', '4\\,375 + 2\\,968 = 7\\,343'],
          },
          {
            prompt: { en: 'Calculate $80\\,000 - 36\\,452$.', id: 'Hitunglah $80\\,000 - 36\\,452$.' },
            blanks: [{ answer: 43548 }],
            solution: ['80\\,000 - 36\\,452 = 43\\,548', '43\\,548 + 36\\,452 = 80\\,000'],
          },
          {
            prompt: {
              en: 'Mr. Eko’s orchard gave 12,450 mangoes. He sold 4,875 mangoes at the market and sent 3,960 mangoes to the city. How many mangoes are left?',
              id: 'Kebun Pak Eko menghasilkan 12.450 buah mangga. Ia menjual 4.875 mangga di pasar dan mengirim 3.960 mangga ke kota. Berapa mangga yang tersisa?',
            },
            blanks: [{ answer: 3615, after: { en: '\\text{ mangoes}', id: '\\text{ mangga}' } }],
            solution: ['12\\,450 - 4\\,875 = 7\\,575', '7\\,575 - 3\\,960 = 3\\,615'],
          },
          {
            prompt: {
              en: 'Ani, Budi and Citra collect used bottles. Ani collects 1,200 bottles. Budi collects 250 more than Ani. Citra collects 175 fewer than Budi. How many bottles do the three children collect together?',
              id: 'Ani, Budi, dan Citra mengumpulkan botol bekas. Ani mengumpulkan 1.200 botol. Budi mengumpulkan 250 botol lebih banyak dari Ani. Citra mengumpulkan 175 botol lebih sedikit dari Budi. Berapa botol yang dikumpulkan ketiga anak bersama-sama?',
            },
            figure: {
              ...barModel([
                { label: 'Ani', segs: [{ v: 1200, color: 'a' }] },
                { label: 'Budi', segs: [{ v: 1200, color: 'a' }, { v: 250, color: 'b' }] },
                { label: 'Citra', segs: [{ v: 1275, unknown: true }, { v: 175, color: 'muted' }] },
              ]),
              caption: {
                en: 'Budi’s bar is 250 longer than Ani’s. Citra’s bar is 175 shorter than Budi’s (the gray piece).',
                id: 'Batang Budi lebih panjang 250 dari batang Ani. Batang Citra lebih pendek 175 dari batang Budi (bagian abu-abu).',
              },
            },
            blanks: [{ answer: 3925, after: { en: '\\text{ bottles}', id: '\\text{ botol}' } }],
            solution: ['\\text{Budi: } 1\\,200 + 250 = 1\\,450', '\\text{Citra: } 1\\,450 - 175 = 1\\,275', '1\\,200 + 1\\,450 + 1\\,275 = 3\\,925'],
          },
        ],
        hints: [
          {
            en: 'Line up the ones under the ones. Carry when a column is 10 or more, borrow when the top digit is too small.',
            id: 'Sejajarkan satuan di bawah satuan. Simpan jika satu kolom 10 atau lebih, pinjam jika angka atas terlalu kecil.',
          },
          {
            en: 'In a story, ask: does the amount grow, shrink, or are two amounts compared? Then choose add or subtract.',
            id: 'Dalam cerita, tanyakan: apakah jumlahnya bertambah, berkurang, atau dua jumlah dibandingkan? Lalu pilih tambah atau kurang.',
          },
          {
            en: 'For the last task, find Budi’s number first, then Citra’s, and only then add all three.',
            id: 'Untuk soal terakhir, cari jumlah Budi dulu, lalu jumlah Citra, dan baru setelah itu jumlahkan ketiganya.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------------ multiplication and division */
    {
      id: 'tka-m1-s3',
      title: { en: 'Multiplication and Division', id: 'Perkalian dan Pembagian' },
      summary: {
        en: 'Multiply with arrays, partial products and zeros. Divide with long division and decide what a remainder means in a story.',
        id: 'Mengalikan dengan susunan baris-kolom, hasil kali sebagian, dan angka nol. Membagi dengan porogapit dan menentukan arti sisa pembagian dalam sebuah cerita.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m1-s3-l1',
          title: { en: 'Multiplication', id: 'Perkalian' },
          goal: {
            en: 'You can multiply by 10, 100 and 1,000, break a number apart, and multiply 2-digit and 3-digit numbers with partial products.',
            id: 'Kamu bisa mengalikan dengan 10, 100, dan 1.000, memecah sebuah bilangan, dan mengalikan bilangan 2 angka dan 3 angka dengan hasil kali sebagian.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Rows and Columns', id: 'Ayo Amati: Baris dan Kolom' },
              body: {
                en: 'A tray holds eggs in 4 rows, with 6 eggs in each row. How many eggs are there?\n\nYou can add the rows: 6 + 6 + 6 + 6 = 24. That is **repeated addition**. Multiplication is a short way to write it: $4 \\times 6 = 24$.\n\nThe eggs make an **array**: every row has the same number of eggs. Turn the tray around and you see 6 rows of 4 eggs. So $4 \\times 6 = 6 \\times 4$. The order of the two numbers does not change the answer. This is the **swap rule** (commutative property).',
                id: 'Sebuah nampan berisi telur dalam 4 baris, setiap baris berisi 6 butir. Ada berapa butir telur?\n\nKamu bisa menjumlahkan barisnya: 6 + 6 + 6 + 6 = 24. Itu disebut **penjumlahan berulang**. Perkalian adalah cara singkat menuliskannya: $4 \\times 6 = 24$.\n\nTelur-telur itu membentuk **susunan baris dan kolom**: setiap baris berisi telur yang sama banyak. Putar nampannya dan kamu melihat 6 baris dengan 4 butir. Jadi $4 \\times 6 = 6 \\times 4$. Urutan kedua bilangan tidak mengubah hasilnya. Ini disebut **sifat pertukaran** (komutatif).',
              },
              figure: {
                ...gridRect({ cols: 6, rows: 4, shade: 24, dims: ['6', '4'] }),
                caption: { en: 'An array of 4 rows and 6 columns: 24 squares.', id: 'Susunan 4 baris dan 6 kolom: 24 kotak.' },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Look Closely: Breaking a Number Apart', id: 'Ayo Amati: Memecah Sebuah Bilangan' },
              body: {
                en: 'A school has 4 boxes with 23 pencils in each box. Break 23 into 20 and 3. Multiply each part by 4, then add: $23 \\times 4 = 20 \\times 4 + 3 \\times 4$. This is the **splitting rule** (distributive property).\n\nThe rectangle shows it: one big piece, $20 \\times 4 = 80$, and one small piece, $3 \\times 4 = 12$. Together they make $80 + 12 = 92$ pencils.\n\nMultiplying by 10, 100 or 1,000 moves every digit 1, 2 or 3 places to the left. Zeros fill the empty places.\n\n| Multiply by | What happens | Example |\n| --- | --- | --- |\n| 10 | one zero joins the end | 36 × 10 = 360 |\n| 100 | two zeros join the end | 36 × 100 = 3,600 |\n| 1,000 | three zeros join the end | 36 × 1,000 = 36,000 |',
                id: 'Sebuah sekolah punya 4 kotak dengan 23 pensil di setiap kotak. Pecah 23 menjadi 20 dan 3. Kalikan tiap bagian dengan 4, lalu jumlahkan: $23 \\times 4 = 20 \\times 4 + 3 \\times 4$. Ini disebut **sifat distributif** (penguraian).\n\nPersegi panjang menunjukkannya: satu bagian besar, $20 \\times 4 = 80$, dan satu bagian kecil, $3 \\times 4 = 12$. Bersama-sama menjadi $80 + 12 = 92$ pensil.\n\nMengalikan dengan 10, 100, atau 1.000 menggeser setiap angka 1, 2, atau 3 tempat ke kiri. Angka nol mengisi tempat yang kosong.\n\n| Dikali | Yang terjadi | Contoh |\n| --- | --- | --- |\n| 10 | satu nol ditambahkan di belakang | 36 × 10 = 360 |\n| 100 | dua nol ditambahkan di belakang | 36 × 100 = 3.600 |\n| 1.000 | tiga nol ditambahkan di belakang | 36 × 1.000 = 36.000 |',
              },
              figure: {
                ...areaModel(20, 3, 4, true),
                caption: { en: '23 × 4 is split into 20 × 4 and 3 × 4 (not drawn to scale).', id: '23 × 4 dipecah menjadi 20 × 4 dan 3 × 4 (gambar tidak sesuai skala).' },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Step by Step: Long Multiplication', id: 'Contoh Bertahap: Perkalian Bersusun' },
              body: {
                en: 'A school orders 36 boxes of books. Each box holds 245 books. How many books is that?\n\n1. Step 1: Write 245 on top and 36 under it, ones under ones. Multiply by the ones digit 6: $245 \\times 6 = 1\\,470$.\n2. Step 2: Multiply by the tens digit 3. It really means 30, so first write a 0 in the ones place of the new row. Then $245 \\times 3 = 735$, so the row is 7,350.\n3. Step 3: Add the two rows: $1\\,470 + 7\\,350 = 8\\,820$.\n4. Step 4: Check with an estimate. 245 is about 250, and $250 \\times 36 = 9\\,000$. The answer 8,820 is close to that.\n\n**Remember:**\n\n- Each row is a **partial product**, one for each digit of the lower number.\n- The second row starts with a 0, because you multiply by tens.',
                id: 'Sebuah sekolah memesan 36 dus buku. Setiap dus berisi 245 buku. Berapa buku seluruhnya?\n\n1. Langkah 1: Tulis 245 di atas dan 36 di bawahnya, satuan di bawah satuan. Kalikan dengan angka satuan 6: $245 \\times 6 = 1\\,470$.\n2. Langkah 2: Kalikan dengan angka puluhan 3. Artinya sebenarnya 30, jadi tulis dulu angka 0 di tempat satuan pada baris baru. Lalu $245 \\times 3 = 735$, jadi barisnya 7.350.\n3. Langkah 3: Jumlahkan kedua baris: $1\\,470 + 7\\,350 = 8\\,820$.\n4. Langkah 4: Periksa dengan penaksiran. 245 kira-kira 250, dan $250 \\times 36 = 9\\,000$. Jawaban 8.820 dekat dengan itu.\n\n**Ingat:**\n\n- Setiap baris adalah **hasil kali sebagian**, satu untuk setiap angka pada bilangan bawah.\n- Baris kedua diawali angka 0, karena kamu mengalikan dengan puluhan.',
              },
              figure: {
                ...workings([wr('245'), wr('36', { sign: '×', line: true }), wr('1470'), wr('7350', { sign: '+', line: true }), wr('8820', { color: 'result' })]),
                caption: { en: '245 × 36 = 8,820. The two rows in the middle are the partial products.', id: '245 × 36 = 8.820. Dua baris di tengah adalah hasil kali sebagian.' },
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Watch Out!: Zeros', id: 'Awas, Jebakan!: Angka Nol' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| 36 × 100 = 360 | Two zeros join the end: 36 × 100 = 3,600. |\n| 40 × 300 = 1,200 | Multiply 4 × 3 = 12, then add all three zeros: 12,000. |\n| 245 × 36 with the second row written as 735, so 1,470 + 735 = 2,205. | The second row multiplies by tens, so it needs the 0: 7,350. The answer is 8,820. |',
                id: '| Salah | Benar |\n| --- | --- |\n| 36 × 100 = 360 | Dua nol ditambahkan di belakang: 36 × 100 = 3.600. |\n| 40 × 300 = 1.200 | Kalikan 4 × 3 = 12, lalu tambahkan ketiga nolnya: 12.000. |\n| 245 × 36 dengan baris kedua ditulis 735, sehingga 1.470 + 735 = 2.205. | Baris kedua mengalikan dengan puluhan, jadi perlu angka 0: 7.350. Jawabannya 8.820. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The picture shows an array of squares. How many squares are there?',
                id: 'Gambar menunjukkan susunan kotak. Ada berapa kotak?',
              },
              figure: {
                ...gridRect({ cols: 7, rows: 5, shade: 35, dims: ['7', '5'] }),
                caption: { en: 'An array with 5 rows and 7 columns.', id: 'Susunan dengan 5 baris dan 7 kolom.' },
              },
              options: [
                { en: '$5 \\times 7 = 35$', id: '$5 \\times 7 = 35$' },
                { en: '$5 + 7 = 12$', id: '$5 + 7 = 12$' },
                { en: '$7 \\times 7 = 49$', id: '$7 \\times 7 = 49$' },
                { en: '$5 \\times 5 = 25$', id: '$5 \\times 5 = 25$' },
              ],
              answer: 0,
              explain: {
                en: 'There are 5 rows with 7 squares in each row, so $5 \\times 7 = 35$. Adding the rows and the columns only counts the sides, and the other lines use a wrong row or column count.',
                id: 'Ada 5 baris dengan 7 kotak di setiap baris, jadi $5 \\times 7 = 35$. Menjumlah banyak baris dan kolom hanya menghitung sisinya, dan baris yang lain memakai banyak baris atau kolom yang salah.',
              },
              hint: {
                en: 'Count the rows and count the squares in one row. Then think: equal groups, so which operation?',
                id: 'Hitung banyak baris dan banyak kotak dalam satu baris. Lalu pikirkan: kelompok yang sama banyak, jadi operasi apa?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: finish 245 × 36 from the example. Type the numbers without dots or commas.',
                id: 'Coba bersama: selesaikan 245 × 36 pada contoh. Ketik angkanya tanpa titik atau koma.',
              },
              template: '245 \\times 30 = ___ \\quad\\quad 1\\,470 + 7\\,350 = ___',
              blanks: ['7350', '8820'],
              explain: {
                en: 'The tens digit 3 means 30, and $245 \\times 30 = 7\\,350$. Add the two partial products: $1\\,470 + 7\\,350 = 8\\,820$.',
                id: 'Angka puluhan 3 berarti 30, dan $245 \\times 30 = 7\\,350$. Jumlahkan kedua hasil kali sebagian: $1\\,470 + 7\\,350 = 8\\,820$.',
              },
              hint: {
                en: 'First find 245 × 3, then add the zero that shows you multiply by tens.',
                id: 'Cari dulu 245 × 3, lalu tambahkan angka nol yang menunjukkan kamu mengalikan dengan puluhan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The rectangle is split to find 34 × 6. What is 34 × 6?',
                id: 'Persegi panjang dipecah untuk mencari 34 × 6. Berapakah 34 × 6?',
              },
              figure: {
                ...areaModel(30, 4, 6, false),
                caption: { en: 'The two pieces: 30 × 6 and 4 × 6.', id: 'Dua bagiannya: 30 × 6 dan 4 × 6.' },
              },
              options: [
                { en: '204', id: '204' },
                { en: '184', id: '184' },
                { en: '180', id: '180' },
                { en: '40', id: '40' },
              ],
              answer: 0,
              explain: {
                en: '$30 \\times 6 = 180$ and $4 \\times 6 = 24$, and $180 + 24 = 204$. The answer 184 only adds 4 (not 4 × 6), 180 forgets the small piece and 40 adds the numbers instead of multiplying.',
                id: '$30 \\times 6 = 180$ dan $4 \\times 6 = 24$, lalu $180 + 24 = 204$. Jawaban 184 hanya menambah 4 (bukan 4 × 6), 180 melupakan bagian kecil, dan 40 menjumlahkan bilangannya, bukan mengalikan.',
              },
              hint: {
                en: 'Find the value of each piece first. Then put the two pieces together.',
                id: 'Cari nilai tiap bagian dulu. Lalu gabungkan kedua bagian itu.',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: { en: 'Choose the two that are equal to $7 \\times 36$.', id: 'Pilih dua yang sama dengan $7 \\times 36$.' },
              options: [
                { en: '$7 \\times 30 + 7 \\times 6$', id: '$7 \\times 30 + 7 \\times 6$' },
                { en: '$36 \\times 7$', id: '$36 \\times 7$' },
                { en: '$7 \\times 30 + 6$', id: '$7 \\times 30 + 6$' },
                { en: '$7 \\times 3 + 7 \\times 6$', id: '$7 \\times 3 + 7 \\times 6$' },
              ],
              answer: [0, 1],
              explain: {
                en: '36 = 30 + 6, and each part must be multiplied by 7. Also, 36 × 7 is the same as 7 × 36 because the order does not matter. The other lines forget to multiply the 6, or use 3 instead of 30.',
                id: '36 = 30 + 6, dan tiap bagian harus dikali 7. Selain itu 36 × 7 sama dengan 7 × 36 karena urutan tidak berpengaruh. Baris yang lain lupa mengalikan angka 6, atau memakai 3 bukan 30.',
              },
              hint: {
                en: 'Split 36 into tens and ones. Does every part get multiplied by 7?',
                id: 'Pecah 36 menjadi puluhan dan satuan. Apakah setiap bagian dikali 7?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A fruit market receives 37 crates of apples. Each crate holds 156 apples. How many apples is that in all? Type it without a dot or comma.',
                id: 'Sebuah pasar buah menerima 37 peti apel. Setiap peti berisi 156 apel. Berapa apel seluruhnya? Ketik tanpa titik atau koma.',
              },
              blanks: [{ answer: 5772, after: { en: '\\text{ apples}', id: '\\text{ apel}' } }],
              hints: [
                {
                  en: 'Every crate holds the same number of apples. Which operation fits equal groups?',
                  id: 'Setiap peti berisi apel yang sama banyak. Operasi apa yang cocok untuk kelompok yang sama banyak?',
                },
                {
                  en: 'Use long multiplication. Multiply 156 by the ones digit 7 first, then by the tens digit 3 (write a 0), and add the two rows.',
                  id: 'Pakai perkalian bersusun. Kalikan 156 dengan angka satuan 7 dulu, lalu dengan angka puluhan 3 (tulis angka 0), dan jumlahkan kedua baris.',
                },
                {
                  en: '156 × 7 is a little over 1,000, and 156 × 30 is a little under 5,000. Add the two partial products.',
                  id: '156 × 7 sedikit lebih dari 1.000, dan 156 × 30 sedikit kurang dari 5.000. Jumlahkan kedua hasil kali sebagian itu.',
                },
              ],
              explain: {
                en: '$156 \\times 7 = 1\\,092$ and $156 \\times 30 = 4\\,680$. Together $1\\,092 + 4\\,680 = 5\\,772$ apples.',
                id: '$156 \\times 7 = 1\\,092$ dan $156 \\times 30 = 4\\,680$. Bersama-sama $1\\,092 + 4\\,680 = 5\\,772$ apel.',
              },
              solution: ['156 \\times 7 = 1\\,092', '156 \\times 30 = 4\\,680', '1\\,092 + 4\\,680 = 5\\,772'],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m1-s3-l2',
          title: { en: 'Division', id: 'Pembagian' },
          goal: {
            en: 'You can divide 3-digit and 4-digit numbers by 1-digit and 2-digit numbers, and decide what a remainder means in a story.',
            id: 'Kamu bisa membagi bilangan 3 angka dan 4 angka dengan bilangan 1 angka dan 2 angka, dan menentukan arti sisa pembagian dalam sebuah cerita.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Sharing Equally', id: 'Ayo Amati: Membagi Sama Banyak' },
              body: {
                en: 'Ani has 24 marbles and shares them equally among 4 friends. How many marbles does each friend get?\n\nThis is **division**: $24 \\div 4 = 6$. You can also use **repeated subtraction**. Give out 4 marbles in each round, one for every friend. After 6 rounds nothing is left, so each friend has 6.\n\nDivision is the opposite of multiplication. Because $6 \\times 4 = 24$, we know that $24 \\div 4 = 6$.',
                id: 'Ani punya 24 kelereng dan membaginya sama banyak kepada 4 temannya. Berapa kelereng yang didapat tiap teman?\n\nIni disebut **pembagian**: $24 \\div 4 = 6$. Kamu juga bisa memakai **pengurangan berulang**. Bagikan 4 kelereng setiap putaran, satu untuk tiap teman. Setelah 6 putaran tidak ada yang tersisa, jadi tiap teman mendapat 6.\n\nPembagian adalah kebalikan perkalian. Karena $6 \\times 4 = 24$, kita tahu bahwa $24 \\div 4 = 6$.',
              },
              figure: {
                ...groups(4, 6),
                caption: { en: '24 marbles in 4 equal groups of 6.', id: '24 kelereng dalam 4 kelompok yang sama banyak, masing-masing 6.' },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Long Division', id: 'Contoh Bertahap: Pembagian Bersusun (Porogapit)' },
              body: {
                en: 'A tailor has 1,368 buttons and puts 6 buttons in each bag. How many bags does he fill? Divide $1\\,368 \\div 6$ with long division.\n\n1. Step 1: Take the first digits that are big enough: 13. How many 6s fit in 13? Twice, because $6 \\times 2 = 12$. Write 2 on top, write 12 under 13 and subtract: 13 − 12 = 1.\n2. Step 2: Bring down the next digit, 6, to make 16. How many 6s fit in 16? Twice again. Subtract: 16 − 12 = 4.\n3. Step 3: Bring down the last digit, 8, to make 48. How many 6s fit in 48? Eight times, because $6 \\times 8 = 48$. Subtract: 48 − 48 = 0.\n4. Step 4: Nothing is left. The number on top is the answer: 228 bags.\n5. Step 5: Check with multiplication: $228 \\times 6 = 1\\,368$.\n\n**Remember:** for every digit, repeat: divide, multiply, subtract, bring down.\n\n- To divide by 10, 100 or 1,000, take away 1, 2 or 3 zeros: $4\\,500 \\div 100 = 45$.\n- Check: answer × divisor + remainder = the number you started with.',
                id: 'Seorang penjahit punya 1.368 kancing dan memasukkan 6 kancing ke setiap kantong. Berapa kantong yang ia isi? Bagilah $1\\,368 \\div 6$ dengan pembagian bersusun (porogapit).\n\n1. Langkah 1: Ambil angka-angka pertama yang cukup besar: 13. Ada berapa 6 dalam 13? Dua kali, karena $6 \\times 2 = 12$. Tulis 2 di atas, tulis 12 di bawah 13 dan kurangkan: 13 − 12 = 1.\n2. Langkah 2: Turunkan angka berikutnya, 6, menjadi 16. Ada berapa 6 dalam 16? Dua kali lagi. Kurangkan: 16 − 12 = 4.\n3. Langkah 3: Turunkan angka terakhir, 8, menjadi 48. Ada berapa 6 dalam 48? Delapan kali, karena $6 \\times 8 = 48$. Kurangkan: 48 − 48 = 0.\n4. Langkah 4: Tidak ada yang tersisa. Bilangan di atas adalah jawabannya: 228 kantong.\n5. Langkah 5: Periksa dengan perkalian: $228 \\times 6 = 1\\,368$.\n\n**Ingat:** untuk setiap angka, ulangi: bagi, kalikan, kurangkan, turunkan.\n\n- Untuk membagi dengan 10, 100, atau 1.000, hilangkan 1, 2, atau 3 angka nol: $4\\,500 \\div 100 = 45$.\n- Periksa: hasil bagi × pembagi + sisa = bilangan awal.',
              },
              figure: {
                ...longDiv({
                  divisor: '6',
                  dividend: '1368',
                  quotient: '228',
                  qStart: 1,
                  rows: [
                    { s: '12', end: 1, line: true },
                    { s: '16', end: 2 },
                    { s: '12', end: 2, line: true },
                    { s: '48', end: 3 },
                    { s: '48', end: 3, line: true },
                    { s: '0', end: 3 },
                  ],
                }),
                caption: { en: '1,368 ÷ 6 = 228, worked out step by step.', id: '1.368 ÷ 6 = 228, dikerjakan langkah demi langkah.' },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Look Closely: What Is Left Over?', id: 'Ayo Amati: Apa Arti Sisanya?' },
              body: {
                en: '150 children go on a trip. One bus carries 40 children. $150 \\div 40 = 3$ with a **remainder** of 30. That means 3 full buses, and 30 children are left over.\n\nThe remainder is always smaller than the number you divide by. What it means depends on the question.\n\n| The question | What to do with the remainder | Answer |\n| --- | --- | --- |\n| How many buses are full? | Ignore the remainder | 3 |\n| How many buses are needed? | The 30 children still need a bus: add 1 | 4 |\n| How many children ride in the last bus? | The remainder is the answer | 30 |',
                id: '150 anak pergi berwisata. Satu bus memuat 40 anak. $150 \\div 40 = 3$ dengan **sisa** 30. Artinya 3 bus penuh, dan 30 anak tersisa.\n\nSisa selalu lebih kecil dari bilangan pembagi. Arti sisa bergantung pada pertanyaannya.\n\n| Pertanyaan | Yang dilakukan dengan sisa | Jawaban |\n| --- | --- | --- |\n| Berapa bus yang penuh? | Abaikan sisanya | 3 |\n| Berapa bus yang dibutuhkan? | 30 anak itu tetap butuh bus: tambah 1 | 4 |\n| Berapa anak yang naik di bus terakhir? | Sisanya adalah jawabannya | 30 |',
              },
              figure: {
                ...groups(3, 4, { extra: 3 }),
                caption: {
                  en: 'Each dot is 10 children. Three full buses and one bus with 3 dots, which is 30 children.',
                  id: 'Setiap titik adalah 10 anak. Tiga bus penuh dan satu bus dengan 3 titik, yaitu 30 anak.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Watch Out!: Division', id: 'Awas, Jebakan!: Pembagian' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| 4,500 ÷ 100 = 450 | Take away two zeros: 4,500 ÷ 100 = 45. |\n| 50 eggs go into boxes of 8: 50 ÷ 8 = 6 remainder 2, so 6 boxes are enough. | The 2 left-over eggs still need a box, so 7 boxes are needed. |\n| 2,412 ÷ 6 = 42 | When the divisor does not fit, write a 0. The answer is 402, and 402 × 6 = 2,412. |',
                id: '| Salah | Benar |\n| --- | --- |\n| 4.500 ÷ 100 = 450 | Hilangkan dua nol: 4.500 ÷ 100 = 45. |\n| 50 telur dimasukkan ke kotak berisi 8: 50 ÷ 8 = 6 sisa 2, jadi 6 kotak cukup. | 2 telur yang tersisa tetap butuh kotak, jadi dibutuhkan 7 kotak. |\n| 2.412 ÷ 6 = 42 | Jika pembagi tidak muat, tulis angka 0. Jawabannya 402, dan 402 × 6 = 2.412. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '35 stickers are shared equally among 5 children. How many stickers does each child get?',
                id: '35 stiker dibagi sama banyak kepada 5 anak. Berapa stiker yang didapat tiap anak?',
              },
              figure: {
                ...barModel([
                  { segs: [{ v: 35, color: 'a' }] },
                  { segs: [{ v: 7, unknown: true }, { v: 7, unknown: true }, { v: 7, unknown: true }, { v: 7, unknown: true }, { v: 7, unknown: true }] },
                ]),
                caption: { en: 'The 35 stickers cut into 5 equal parts, one part for each child. Each ? is one child’s share.', id: '35 stiker dibagi menjadi 5 bagian sama besar, satu bagian untuk setiap anak. Setiap ? adalah bagian satu anak.' },
              },
              options: [
                { en: '7', id: '7' },
                { en: '30', id: '30' },
                { en: '40', id: '40' },
                { en: '175', id: '175' },
              ],
              answer: 0,
              explain: {
                en: 'Sharing equally is division: $35 \\div 5 = 7$. The answer 30 comes from subtracting, 40 from adding and 175 from multiplying.',
                id: 'Membagi sama banyak berarti pembagian: $35 \\div 5 = 7$. Jawaban 30 berasal dari mengurang, 40 dari menjumlah, dan 175 dari mengalikan.',
              },
              hint: {
                en: 'The stickers are split into equal groups. Which operation does that?',
                id: 'Stiker dipecah menjadi kelompok yang sama banyak. Operasi apa yang melakukan itu?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: finish 1,368 ÷ 6 from the example. Type the numbers without dots or commas.',
                id: 'Coba bersama: selesaikan 1.368 ÷ 6 pada contoh. Ketik angkanya tanpa titik atau koma.',
              },
              template: '16 - 12 = ___ \\quad\\quad 48 \\div 6 = ___',
              blanks: ['4', '8'],
              explain: {
                en: 'After 12 is taken from 16, 4 is left. Bring down the 8 to make 48, and $48 \\div 6 = 8$, the last digit of the answer 228.',
                id: 'Setelah 12 diambil dari 16, tersisa 4. Turunkan angka 8 menjadi 48, dan $48 \\div 6 = 8$, angka terakhir dari jawaban 228.',
              },
              hint: {
                en: 'Subtract first. Then check how many 6s fit in 48 using the times table.',
                id: 'Kurangkan dulu. Lalu cek ada berapa 6 dalam 48 dengan tabel perkalian.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The long division shows $1\\,457 \\div 6 = 242$ with remainder 5. Which line checks it correctly?',
                id: 'Pembagian bersusun menunjukkan $1\\,457 \\div 6 = 242$ sisa 5. Baris mana yang memeriksanya dengan benar?',
              },
              figure: {
                ...longDiv({
                  divisor: '6',
                  dividend: '1457',
                  quotient: '242',
                  qStart: 1,
                  rows: [
                    { s: '12', end: 1, line: true },
                    { s: '25', end: 2 },
                    { s: '24', end: 2, line: true },
                    { s: '17', end: 3 },
                    { s: '12', end: 3, line: true },
                    { s: '5', end: 3 },
                  ],
                }),
                caption: { en: '1,457 ÷ 6 = 242 and 5 is left over.', id: '1.457 ÷ 6 = 242 dan sisa 5.' },
              },
              options: [
                { en: '$242 \\times 6 + 5 = 1\\,457$', id: '$242 \\times 6 + 5 = 1\\,457$' },
                { en: '$242 \\times 6 = 1\\,457$', id: '$242 \\times 6 = 1\\,457$' },
                { en: '$242 \\times 5 + 6 = 1\\,457$', id: '$242 \\times 5 + 6 = 1\\,457$' },
                { en: '$242 + 6 + 5 = 1\\,457$', id: '$242 + 6 + 5 = 1\\,457$' },
              ],
              answer: 0,
              explain: {
                en: 'The check is answer × divisor + remainder: $242 \\times 6 = 1\\,452$ and $1\\,452 + 5 = 1\\,457$. Without the remainder the product is 1,452, not 1,457.',
                id: 'Pemeriksaannya adalah hasil bagi × pembagi + sisa: $242 \\times 6 = 1\\,452$ dan $1\\,452 + 5 = 1\\,457$. Tanpa sisa, hasil kalinya 1.452, bukan 1.457.',
              },
              hint: {
                en: 'Division undoes multiplication. Multiply the answer by the divisor, then think about where the leftover goes.',
                id: 'Pembagian membatalkan perkalian. Kalikan hasil bagi dengan pembagi, lalu pikirkan di mana sisanya diletakkan.',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: { en: 'Decide whether each statement is True or False.', id: 'Tentukan tiap pernyataan Benar atau Salah.' },
              statements: [
                {
                  en: '150 children ride in buses of 40 children each. 4 buses are needed.',
                  id: '150 anak naik bus yang masing-masing memuat 40 anak. Dibutuhkan 4 bus.',
                },
                {
                  en: 'When you divide by 40, the remainder can be 40.',
                  id: 'Jika membagi dengan 40, sisanya bisa 40.',
                },
                { en: '$4\\,500 \\div 100 = 45$', id: '$4\\,500 \\div 100 = 45$' },
                {
                  en: 'If $7 \\times 12 = 84$, then $84 \\div 12 = 6$.',
                  id: 'Jika $7 \\times 12 = 84$, maka $84 \\div 12 = 6$.',
                },
              ],
              answer: [true, false, true, false],
              explain: {
                en: '150 ÷ 40 = 3 remainder 30, and those 30 children need a 4th bus. A remainder is always smaller than the divisor. Dividing by 100 takes away two zeros. Since 7 × 12 = 84, we get 84 ÷ 12 = 7, not 6.',
                id: '150 ÷ 40 = 3 sisa 30, dan 30 anak itu butuh bus ke-4. Sisa selalu lebih kecil dari pembagi. Membagi dengan 100 menghilangkan dua nol. Karena 7 × 12 = 84, maka 84 ÷ 12 = 7, bukan 6.',
              },
              hint: {
                en: 'Think about the leftovers and about which numbers a multiplication fact connects.',
                id: 'Pikirkan tentang sisa dan tentang bilangan-bilangan yang dihubungkan oleh sebuah fakta perkalian.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: '1,250 students will travel by bus. Each bus carries at most 48 students. How many buses are needed? Type the number of buses.',
                id: '1.250 siswa akan bepergian dengan bus. Setiap bus memuat paling banyak 48 siswa. Berapa bus yang dibutuhkan? Ketik banyak bus.',
              },
              blanks: [{ answer: 27, after: { en: '\\text{ buses}', id: '\\text{ bus}' } }],
              hints: [
                {
                  en: 'Find how many groups of 48 fit in 1,250. That is a division.',
                  id: 'Cari ada berapa kelompok 48 dalam 1.250. Itu adalah pembagian.',
                },
                {
                  en: 'Use long division: $1\\,250 \\div 48$. You will get a whole number and a remainder.',
                  id: 'Pakai pembagian bersusun: $1\\,250 \\div 48$. Kamu akan mendapat bilangan bulat dan sisa.',
                },
                {
                  en: 'The whole number is the number of full buses. Ask yourself: do the students in the remainder need a seat too?',
                  id: 'Bilangan bulatnya adalah banyak bus yang penuh. Tanyakan pada dirimu: apakah siswa yang masuk sisa juga butuh tempat duduk?',
                },
              ],
              explain: {
                en: '$1\\,250 \\div 48 = 26$ remainder 2, because $48 \\times 26 = 1\\,248$. The 2 students left still need a seat, so one more bus: 27 buses.',
                id: '$1\\,250 \\div 48 = 26$ sisa 2, karena $48 \\times 26 = 1\\,248$. Dua siswa yang tersisa tetap butuh tempat duduk, jadi ditambah satu bus: 27 bus.',
              },
              solution: ['1\\,250 \\div 48 = 26 \\text{ r } 2', '48 \\times 26 + 2 = 1\\,250', '26 + 1 = 27'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m1-s3-p',
        runtime: 'math',
        title: { en: 'Project: Multiply and Divide', id: 'Proyek: Mengalikan dan Membagi' },
        brief: {
          en: 'Four problems about multiplying, dividing and sharing. They end with a problem where the remainder matters.',
          id: 'Empat soal tentang mengalikan, membagi, dan membagi rata. Soal terakhir adalah soal yang sisanya sangat berpengaruh.',
        },
        requirements: [
          { en: 'Multiply and divide whole numbers with the written method.', id: 'Mengalikan dan membagi bilangan cacah dengan cara bersusun.' },
          { en: 'Decide what a remainder means in a story.', id: 'Menentukan arti sisa pembagian dalam sebuah cerita.' },
        ],
        tasks: [
          {
            prompt: { en: 'Break 36 into 30 + 6 to work out $7 \\times 36$.', id: 'Pecah 36 menjadi 30 + 6 untuk menghitung $7 \\times 36$.' },
            given: '7 \\times 36 = 7 \\times 30 + 7 \\times 6 = \\ ?',
            blanks: [{ answer: 252 }],
            solution: ['7 \\times 30 = 210', '7 \\times 6 = 42', '210 + 42 = 252'],
          },
          {
            prompt: { en: 'Calculate $2\\,832 \\div 8$.', id: 'Hitunglah $2\\,832 \\div 8$.' },
            blanks: [{ answer: 354 }],
            solution: ['28 \\div 8 = 3 \\text{ r } 4', '43 \\div 8 = 5 \\text{ r } 3', '32 \\div 8 = 4', '2\\,832 \\div 8 = 354', '354 \\times 8 = 2\\,832'],
          },
          {
            prompt: {
              en: 'A concert hall has 32 rows with 45 seats in each row. How many seats does the hall have?',
              id: 'Sebuah gedung pertunjukan punya 32 baris dengan 45 kursi di setiap baris. Berapa kursi di gedung itu?',
            },
            blanks: [{ answer: 1440, after: { en: '\\text{ seats}', id: '\\text{ kursi}' } }],
            solution: ['45 \\times 2 = 90', '45 \\times 30 = 1\\,350', '90 + 1\\,350 = 1\\,440'],
          },
          {
            prompt: {
              en: 'A school has 8 classes with 36 students in each class. All the students are put into teams of at most 7 students. At least how many teams are needed?',
              id: 'Sebuah sekolah punya 8 kelas dengan 36 siswa di setiap kelas. Semua siswa dibagi ke dalam tim yang masing-masing terdiri dari paling banyak 7 siswa. Paling sedikit dibutuhkan berapa tim?',
            },
            blanks: [{ answer: 42, after: { en: '\\text{ teams}', id: '\\text{ tim}' } }],
            solution: ['8 \\times 36 = 288', '288 \\div 7 = 41 \\text{ r } 1', '41 + 1 = 42'],
          },
        ],
        hints: [
          {
            en: 'Break a number into tens and ones, multiply each part, and add. Division undoes multiplication, so you can check by multiplying.',
            id: 'Pecah bilangan menjadi puluhan dan satuan, kalikan tiap bagian, lalu jumlahkan. Pembagian membatalkan perkalian, jadi kamu bisa memeriksa dengan mengalikan.',
          },
          {
            en: 'In a story, equal rows or groups mean multiply, and sharing equally or making groups means divide.',
            id: 'Dalam cerita, baris atau kelompok yang sama banyak berarti kali, dan membagi sama banyak atau membuat kelompok berarti bagi.',
          },
          {
            en: 'For the last task, first find the number of students. Then divide, and decide what to do with the remainder: leftover students still need a team.',
            id: 'Untuk soal terakhir, cari dulu banyak siswa. Lalu bagi, dan tentukan apa yang dilakukan dengan sisanya: siswa yang tersisa tetap butuh tim.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------------ mixed operations and multi-step problems */
    {
      id: 'tka-m1-s4',
      title: { en: 'Mixed Operations and Multi-Step Problems', id: 'Operasi Campuran dan Soal Bertahap' },
      summary: {
        en: 'Follow the order of operations, then turn longer stories into number sentences, plan the steps and check with an estimate.',
        id: 'Ikuti urutan mengerjakan operasi hitung, lalu ubah cerita yang lebih panjang menjadi kalimat bilangan, rencanakan langkahnya, dan periksa dengan penaksiran.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m1-s4-l1',
          title: { en: 'Order of Operations', id: 'Urutan Mengerjakan Operasi Hitung' },
          goal: {
            en: 'You can work out a number sentence with brackets, multiplication, division, addition and subtraction in the right order.',
            id: 'Kamu bisa menghitung sebuah kalimat bilangan dengan tanda kurung, perkalian, pembagian, penjumlahan, dan pengurangan dalam urutan yang benar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Who Goes First?', id: 'Ayo Amati: Siapa yang Dikerjakan Dulu?' },
              body: {
                en: 'Ani has 5 loose candies and 2 bags with 3 candies in each bag. How many candies does she have? The number sentence is $5 + 2 \\times 3$.\n\nThe 2 bags hold $2 \\times 3 = 6$ candies, so $5 + 6 = 11$. Working from left to right would give $5 + 2 = 7$ and then $7 \\times 3 = 21$, which is wrong.\n\nTo get the same answer every time, everybody follows the same **order of operations**.\n\n| Order | Do this | Example |\n| --- | --- | --- |\n| First | Brackets: work out what is inside ( ) | 3 × (4 + 2) becomes 3 × 6 |\n| Second | × and ÷, from left to right | 5 + 2 × 3 becomes 5 + 6 |\n| Third | + and −, from left to right | 5 + 6 = 11 |',
                id: 'Ani punya 5 permen lepas dan 2 kantong dengan 3 permen di setiap kantong. Berapa permen Ani? Kalimat bilangannya $5 + 2 \\times 3$.\n\n2 kantong berisi $2 \\times 3 = 6$ permen, jadi $5 + 6 = 11$. Jika dikerjakan dari kiri ke kanan hasilnya $5 + 2 = 7$ lalu $7 \\times 3 = 21$, yang salah.\n\nAgar hasilnya selalu sama, semua orang memakai **urutan mengerjakan operasi hitung** yang sama.\n\n| Urutan | Kerjakan | Contoh |\n| --- | --- | --- |\n| Pertama | Tanda kurung: hitung yang ada di dalam ( ) | 3 × (4 + 2) menjadi 3 × 6 |\n| Kedua | × dan ÷, dari kiri ke kanan | 5 + 2 × 3 menjadi 5 + 6 |\n| Ketiga | + dan −, dari kiri ke kanan | 5 + 6 = 11 |',
              },
              figure: {
                ...groups(2, 3, { loose: 5 }),
                caption: {
                  en: '5 loose candies and 2 bags of 3 candies: 5 + 2 × 3 = 11.',
                  id: '5 permen lepas dan 2 kantong berisi 3 permen: 5 + 2 × 3 = 11.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: 36 ÷ 4 × 3 + (10 − 4)', id: 'Contoh Bertahap: 36 ÷ 4 × 3 + (10 − 4)' },
              body: {
                en: 'Work out $36 \\div 4 \\times 3 + (10 - 4)$.\n\n1. Step 1: Brackets first: $10 - 4 = 6$. The sentence is now $36 \\div 4 \\times 3 + 6$.\n2. Step 2: Now × and ÷. They count the same, so go from left to right. First $36 \\div 4 = 9$.\n3. Step 3: Then $9 \\times 3 = 27$. The sentence is now $27 + 6$.\n4. Step 4: Last, + and −: $27 + 6 = 33$.\n5. Step 5: Check that every number and every sign was used once. The answer is 33.\n\n**Remember:**\n\n- Brackets first, then × and ÷, then + and −.\n- Signs at the same level go from left to right.',
                id: 'Hitunglah $36 \\div 4 \\times 3 + (10 - 4)$.\n\n1. Langkah 1: Kurung dulu: $10 - 4 = 6$. Kalimatnya sekarang $36 \\div 4 \\times 3 + 6$.\n2. Langkah 2: Sekarang × dan ÷. Tingkatnya sama, jadi kerjakan dari kiri ke kanan. Pertama $36 \\div 4 = 9$.\n3. Langkah 3: Lalu $9 \\times 3 = 27$. Kalimatnya sekarang $27 + 6$.\n4. Langkah 4: Terakhir, + dan −: $27 + 6 = 33$.\n5. Langkah 5: Periksa bahwa setiap bilangan dan setiap tanda sudah dipakai satu kali. Jawabannya 33.\n\n**Ingat:**\n\n- Kurung dulu, lalu × dan ÷, lalu + dan −.\n- Tanda yang tingkatnya sama dikerjakan dari kiri ke kanan.',
              },
              figure: {
                ...exprLines([
                  { t: '36 ÷ 4 × 3 + (10 − 4)' },
                  { t: '= 36 ÷ 4 × 3 + 6' },
                  { t: '= 9 × 3 + 6' },
                  { t: '= 27 + 6' },
                  { t: '= 33', color: 'result' },
                ]),
                caption: { en: 'Each line is one step. Only one thing changes per line.', id: 'Setiap baris adalah satu langkah. Hanya satu hal yang berubah di tiap baris.' },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Order of Operations', id: 'Awas, Jebakan!: Urutan Operasi' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| 6 + 4 × 5 = 50, worked from left to right. | × comes before +: 6 + 20 = 26. |\n| 24 ÷ 4 × 3 = 2, by doing × first. | × and ÷ go from left to right: 24 ÷ 4 = 6, then 6 × 3 = 18. |\n| 20 − 8 + 5 = 7, by doing + first. | + and − go from left to right: 20 − 8 = 12, then 12 + 5 = 17. |',
                id: '| Salah | Benar |\n| --- | --- |\n| 6 + 4 × 5 = 50, dikerjakan dari kiri ke kanan. | × dikerjakan sebelum +: 6 + 20 = 26. |\n| 24 ÷ 4 × 3 = 2, dengan mengerjakan × dulu. | × dan ÷ dikerjakan dari kiri ke kanan: 24 ÷ 4 = 6, lalu 6 × 3 = 18. |\n| 20 − 8 + 5 = 7, dengan mengerjakan + dulu. | + dan − dikerjakan dari kiri ke kanan: 20 − 8 = 12, lalu 12 + 5 = 17. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is the value of this number sentence?', id: 'Berapakah nilai kalimat bilangan ini?' },
              figure: {
                ...exprLines([{ t: '18 − 3 × 4 + 6' }]),
                caption: { en: 'A number sentence with three signs.', id: 'Kalimat bilangan dengan tiga tanda.' },
              },
              options: [
                { en: '12', id: '12' },
                { en: '66', id: '66' },
                { en: '0', id: '0' },
                { en: '6', id: '6' },
              ],
              answer: 0,
              explain: {
                en: '× first: $3 \\times 4 = 12$. Then from left to right: $18 - 12 = 6$ and $6 + 6 = 12$. The answer 66 works from left to right without the order, 0 adds 12 and 6 before subtracting, and 6 stops too early.',
                id: '× dulu: $3 \\times 4 = 12$. Lalu dari kiri ke kanan: $18 - 12 = 6$ dan $6 + 6 = 12$. Jawaban 66 mengerjakan dari kiri ke kanan tanpa urutan, 0 menjumlah 12 dan 6 sebelum mengurangi, dan 6 berhenti terlalu cepat.',
              },
              hint: {
                en: 'Which sign goes first when there is a × in the sentence? Then continue from left to right.',
                id: 'Tanda apa yang dikerjakan pertama jika ada × dalam kalimat? Lalu lanjutkan dari kiri ke kanan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: finish the last steps of the example.',
                id: 'Coba bersama: selesaikan langkah terakhir pada contoh.',
              },
              template: '9 \\times 3 + 6 = ___ + 6 = ___',
              blanks: ['27', '33'],
              explain: {
                en: 'Multiplication comes before addition: $9 \\times 3 = 27$. Then $27 + 6 = 33$.',
                id: 'Perkalian dikerjakan sebelum penjumlahan: $9 \\times 3 = 27$. Lalu $27 + 6 = 33$.',
              },
              hint: {
                en: 'Which sign do you do first, × or +?',
                id: 'Tanda mana yang dikerjakan lebih dulu, × atau +?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'A student worked out $12 + 3 \\times 6 - 4$ like this. Where is the first mistake?',
                id: 'Seorang siswa menghitung $12 + 3 \\times 6 - 4$ seperti ini. Di mana kesalahan pertamanya?',
              },
              figure: {
                ...exprLines([{ t: '12 + 3 × 6 − 4' }, { t: '= 15 × 6 − 4' }, { t: '= 90 − 4' }, { t: '= 86' }]),
                caption: { en: 'The student’s working, line by line.', id: 'Pengerjaan siswa, baris demi baris.' },
              },
              options: [
                { en: 'He added 12 + 3 before doing 3 × 6.', id: 'Ia menjumlah 12 + 3 sebelum mengerjakan 3 × 6.' },
                { en: '15 × 6 is not 90.', id: '15 × 6 bukan 90.' },
                { en: '90 − 4 is not 86.', id: '90 − 4 bukan 86.' },
                { en: 'There is no mistake.', id: 'Tidak ada kesalahan.' },
              ],
              answer: 0,
              explain: {
                en: '× comes before +, so 3 × 6 = 18 must be done first: 12 + 18 − 4 = 26. The multiplication and subtraction facts in the other lines are correct, but they continue from the wrong line.',
                id: '× dikerjakan sebelum +, jadi 3 × 6 = 18 harus dikerjakan dulu: 12 + 18 − 4 = 26. Fakta perkalian dan pengurangan di baris lain benar, tetapi melanjutkan dari baris yang salah.',
              },
              hint: {
                en: 'Check the first line. Which sign should be used first there?',
                id: 'Periksa baris pertama. Tanda apa yang seharusnya dikerjakan lebih dulu di sana?',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: { en: 'Choose the two number sentences that are equal to 20.', id: 'Pilih dua kalimat bilangan yang nilainya 20.' },
              options: [
                { en: '$4 + 4 \\times 4$', id: '$4 + 4 \\times 4$' },
                { en: '$50 - 6 \\times 5$', id: '$50 - 6 \\times 5$' },
                { en: '$(4 + 4) \\times 4$', id: '$(4 + 4) \\times 4$' },
                { en: '$(50 - 6) \\times 5$', id: '$(50 - 6) \\times 5$' },
              ],
              answer: [0, 1],
              explain: {
                en: '$4 + 4 \\times 4 = 4 + 16 = 20$ and $50 - 6 \\times 5 = 50 - 30 = 20$. With brackets the addition or subtraction goes first, which gives 32 and 220.',
                id: '$4 + 4 \\times 4 = 4 + 16 = 20$ dan $50 - 6 \\times 5 = 50 - 30 = 20$. Dengan kurung, penjumlahan atau pengurangan dikerjakan dulu, sehingga hasilnya 32 dan 220.',
              },
              hint: {
                en: 'Work out each sentence. Remember: brackets first, then ×, then + or −.',
                id: 'Hitung tiap kalimat. Ingat: kurung dulu, lalu ×, lalu + atau −.',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: { en: 'Decide whether each statement is True or False.', id: 'Tentukan tiap pernyataan Benar atau Salah.' },
              statements: [
                { en: '$8 + 2 \\times 5 = 18$', id: '$8 + 2 \\times 5 = 18$' },
                { en: '$24 \\div 6 \\times 2 = 2$', id: '$24 \\div 6 \\times 2 = 2$' },
                { en: '$(9 - 3) \\times 2 = 12$', id: '$(9 - 3) \\times 2 = 12$' },
                { en: '$30 - 10 + 5 = 15$', id: '$30 - 10 + 5 = 15$' },
              ],
              answer: [true, false, true, false],
              explain: {
                en: '8 + 10 = 18 is right. For 24 ÷ 6 × 2, go left to right: 4 × 2 = 8, not 2. The bracket gives 6 × 2 = 12. For 30 − 10 + 5, go left to right: 20 + 5 = 25, not 15.',
                id: '8 + 10 = 18 benar. Pada 24 ÷ 6 × 2, kerjakan dari kiri ke kanan: 4 × 2 = 8, bukan 2. Kurung memberi 6 × 2 = 12. Pada 30 − 10 + 5, kerjakan dari kiri ke kanan: 20 + 5 = 25, bukan 15.',
              },
              hint: {
                en: 'Work out each line by the order: brackets, then × and ÷ from left to right, then + and − from left to right.',
                id: 'Hitung tiap baris dengan urutan: kurung, lalu × dan ÷ dari kiri ke kanan, lalu + dan − dari kiri ke kanan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Work out $120 - 4 \\times (15 + 10) + 36 \\div 6$.',
                id: 'Hitunglah $120 - 4 \\times (15 + 10) + 36 \\div 6$.',
              },
              blanks: [{ answer: 26 }],
              hints: [
                {
                  en: 'Look for the brackets first. They are always worked out before anything else.',
                  id: 'Cari tanda kurung dulu. Tanda kurung selalu dikerjakan sebelum yang lain.',
                },
                {
                  en: 'After the brackets, do the × and the ÷ (two of them), then finish with − and + from left to right.',
                  id: 'Setelah kurung, kerjakan × dan ÷ (ada dua), lalu selesaikan dengan − dan + dari kiri ke kanan.',
                },
                {
                  en: 'After the brackets and the × and ÷, the sentence is 120 minus a number plus a small number. Work from left to right.',
                  id: 'Setelah kurung serta × dan ÷, kalimatnya menjadi 120 dikurangi sebuah bilangan ditambah bilangan kecil. Kerjakan dari kiri ke kanan.',
                },
              ],
              explain: {
                en: 'Brackets: 15 + 10 = 25. Then 4 × 25 = 100 and 36 ÷ 6 = 6. Finally 120 − 100 + 6 = 26.',
                id: 'Kurung: 15 + 10 = 25. Lalu 4 × 25 = 100 dan 36 ÷ 6 = 6. Terakhir 120 − 100 + 6 = 26.',
              },
              solution: ['15 + 10 = 25', '4 \\times 25 = 100', '36 \\div 6 = 6', '120 - 100 + 6 = 26'],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m1-s4-l2',
          title: { en: 'Multi-Step Word Problems', id: 'Soal Cerita Beberapa Langkah' },
          goal: {
            en: 'You can turn a story into a number sentence, plan the steps, estimate to check, and solve problems with 2 or 3 operations.',
            id: 'Kamu bisa mengubah cerita menjadi kalimat bilangan, merencanakan langkahnya, menaksir untuk memeriksa, dan menyelesaikan soal dengan 2 atau 3 operasi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: From Story to Number Sentence', id: 'Ayo Amati: Dari Cerita ke Kalimat Bilangan' },
              body: {
                en: 'Ani buys 3 notebooks at Rp4,500 each and pays with Rp20,000. How much change does she get?\n\nFirst turn the story into a **number sentence**. The money she has is 20,000, and the notebooks cost $3 \\times 4\\,500$. So the change is $20\\,000 - 3 \\times 4\\,500$.\n\nThen plan the steps in the right order: the multiplication first, then the subtraction.\n\nAlso **estimate** before you calculate. 4,500 is about 5,000, and $3 \\times 5\\,000 = 15\\,000$, so the change should be about 5,000.',
                id: 'Ani membeli 3 buku tulis seharga Rp4.500 per buah dan membayar dengan Rp20.000. Berapa kembaliannya?\n\nPertama ubah cerita menjadi **kalimat bilangan**. Uang yang ia punya 20.000, dan buku-buku itu berharga $3 \\times 4\\,500$. Jadi kembaliannya $20\\,000 - 3 \\times 4\\,500$.\n\nLalu rencanakan langkahnya dalam urutan yang benar: perkalian dulu, kemudian pengurangan.\n\nSelain itu **taksirlah** sebelum menghitung. 4.500 kira-kira 5.000, dan $3 \\times 5\\,000 = 15\\,000$, jadi kembaliannya kira-kira 5.000.',
              },
              figure: {
                ...barModel([{ segs: [{ v: 4500, color: 'a' }, { v: 4500, color: 'b' }, { v: 4500, color: 'c' }, { v: 6500, unknown: true }] }]),
                caption: {
                  en: 'The Rp20,000: three notebooks of 4,500 each and the change (?).',
                  id: 'Uang Rp20.000: tiga buku tulis masing-masing 4.500 dan kembaliannya (?).',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Pencils for the Classes', id: 'Contoh Bertahap: Pensil untuk Kelas-Kelas' },
              body: {
                en: 'Mrs. Rina’s school buys 6 boxes of pencils with 12 pencils in each box. There are also 8 old pencils. All the pencils are shared equally among 8 classes. How many pencils does each class get?\n\n1. Step 1: Find what is known and what is asked. Boxes 6, pencils per box 12, old pencils 8, classes 8. We want the pencils for each class.\n2. Step 2: Plan. First find all the pencils: $6 \\times 12 + 8$. Then share them, so divide by 8. The brackets show that the total comes first: $(6 \\times 12 + 8) \\div 8$.\n3. Step 3: Inside the brackets, × first: $6 \\times 12 = 72$. Then $72 + 8 = 80$.\n4. Step 4: Divide: $80 \\div 8 = 10$.\n5. Step 5: Estimate to check. 6 × 12 is about 70, plus 8 is about 78, and 78 ÷ 8 is a little under 10. So 10 is sensible. Each class gets 10 pencils.\n\n**Remember:**\n\n- Write the number sentence, and use brackets when a total must be found first.\n- Estimate to check that the answer is sensible.',
                id: 'Sekolah Bu Rina membeli 6 dus pensil dengan 12 pensil di setiap dus. Ada juga 8 pensil lama. Semua pensil dibagi sama banyak ke 8 kelas. Berapa pensil yang didapat tiap kelas?\n\n1. Langkah 1: Cari yang diketahui dan yang ditanyakan. Dus 6, pensil per dus 12, pensil lama 8, kelas 8. Kita mencari pensil untuk tiap kelas.\n2. Langkah 2: Rencanakan. Pertama cari seluruh pensil: $6 \\times 12 + 8$. Lalu bagikan, jadi bagi dengan 8. Tanda kurung menunjukkan bahwa jumlahnya dicari lebih dulu: $(6 \\times 12 + 8) \\div 8$.\n3. Langkah 3: Di dalam kurung, × dulu: $6 \\times 12 = 72$. Lalu $72 + 8 = 80$.\n4. Langkah 4: Bagi: $80 \\div 8 = 10$.\n5. Langkah 5: Periksa dengan penaksiran. 6 × 12 kira-kira 70, ditambah 8 kira-kira 78, dan 78 ÷ 8 sedikit kurang dari 10. Jadi 10 masuk akal. Tiap kelas mendapat 10 pensil.\n\n**Ingat:**\n\n- Tulis kalimat bilangannya, dan pakai kurung jika sebuah jumlah harus dicari lebih dulu.\n- Taksir untuk memeriksa bahwa jawabannya masuk akal.',
              },
              figure: {
                ...exprLines([
                  { t: '(6 × 12 + 8) ÷ 8' },
                  { t: '= (72 + 8) ÷ 8' },
                  { t: '= 80 ÷ 8' },
                  { t: '= 10', color: 'result' },
                ]),
                caption: { en: 'The number sentence, worked out one step per line.', id: 'Kalimat bilangannya, dikerjakan satu langkah per baris.' },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Multi-Step Problems', id: 'Awas, Jebakan!: Soal Bertahap' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| 6 × 12 + 8 ÷ 8 = 73 | The brackets are missing, so ÷ only touches the 8. Write (6 × 12 + 8) ÷ 8 = 10. |\n| Ani paid Rp20,000 and 3 notebooks cost Rp13,500, so the answer is Rp13,500. | The question asks for the change: 20,000 − 13,500 = 6,500. Re-read the question before you answer. |\n| 3 × 4,500 = 1,350 | An estimate catches this: 3 × 5,000 = 15,000, so 1,350 is far too small. The right answer is 13,500. |',
                id: '| Salah | Benar |\n| --- | --- |\n| 6 × 12 + 8 ÷ 8 = 73 | Tanda kurungnya hilang, jadi ÷ hanya mengenai angka 8. Tulis (6 × 12 + 8) ÷ 8 = 10. |\n| Ani membayar Rp20.000 dan 3 buku tulis berharga Rp13.500, jadi jawabannya Rp13.500. | Soal menanyakan kembalian: 20.000 − 13.500 = 6.500. Baca lagi soalnya sebelum menjawab. |\n| 3 × 4.500 = 1.350 | Penaksiran bisa menangkap ini: 3 × 5.000 = 15.000, jadi 1.350 terlalu kecil. Jawaban yang benar 13.500. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Budi has Rp50,000. He buys 4 books at Rp8,500 each. Which number sentence gives the money he has left?',
                id: 'Budi punya Rp50.000. Ia membeli 4 buku seharga Rp8.500 per buku. Kalimat bilangan mana yang menunjukkan uang Budi yang tersisa?',
              },
              figure: {
                ...barModel([{ segs: [{ v: 8500, color: 'a' }, { v: 8500, color: 'b' }, { v: 8500, color: 'c' }, { v: 8500, color: 'a' }, { v: 16000, unknown: true }] }]),
                caption: { en: 'The Rp50,000: four books and the money left (?).', id: 'Uang Rp50.000: empat buku dan uang yang tersisa (?).' },
              },
              options: [
                { en: '$50\\,000 - 4 \\times 8\\,500$', id: '$50\\,000 - 4 \\times 8\\,500$' },
                { en: '$(50\\,000 - 8\\,500) \\times 4$', id: '$(50\\,000 - 8\\,500) \\times 4$' },
                { en: '$50\\,000 - 8\\,500 + 4$', id: '$50\\,000 - 8\\,500 + 4$' },
                { en: '$50\\,000 \\div 8\\,500 \\times 4$', id: '$50\\,000 \\div 8\\,500 \\times 4$' },
              ],
              answer: 0,
              explain: {
                en: 'The 4 books cost $4 \\times 8\\,500 = 34\\,000$, and that is taken away from 50,000. The other sentences take away only one book, add the 4 as money, or divide instead of taking away.',
                id: '4 buku berharga $4 \\times 8\\,500 = 34\\,000$, dan itu dikurangkan dari 50.000. Kalimat yang lain hanya mengurangi satu buku, menjumlah angka 4 sebagai uang, atau membagi alih-alih mengurang.',
              },
              hint: {
                en: 'What is the total price of the 4 books? Then what happens to that money?',
                id: 'Berapa harga total 4 buku itu? Lalu apa yang terjadi dengan uang itu?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: finish the pencil problem from the example.',
                id: 'Coba bersama: selesaikan soal pensil pada contoh.',
              },
              template: '6 \\times 12 = ___ \\quad\\quad (72 + 8) \\div 8 = ___',
              blanks: ['72', '10'],
              explain: {
                en: 'Six boxes of 12 pencils are $6 \\times 12 = 72$ pencils. With the 8 old ones that is 80, and $80 \\div 8 = 10$ pencils for each class.',
                id: 'Enam dus berisi 12 pensil adalah $6 \\times 12 = 72$ pensil. Dengan 8 pensil lama menjadi 80, dan $80 \\div 8 = 10$ pensil untuk tiap kelas.',
              },
              hint: {
                en: 'Inside the brackets, 72 + 8 comes first. Then divide the total.',
                id: 'Di dalam kurung, 72 + 8 dikerjakan dulu. Lalu bagi jumlahnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Citra pays Rp100,000 for 2 bags of Rp35,000 each and 1 hat. The bar shows the money. How much does the hat cost?',
                id: 'Citra membayar Rp100.000 untuk 2 tas seharga Rp35.000 per buah dan 1 topi. Batang menunjukkan uangnya. Berapa harga topi itu?',
              },
              figure: {
                ...barModel([{ segs: [{ v: 35000, color: 'a' }, { v: 35000, color: 'a' }, { v: 30000, unknown: true }] }]),
                caption: { en: 'The Rp100,000 is two bags and a hat (?).', id: 'Uang Rp100.000 terdiri dari dua tas dan sebuah topi (?).' },
              },
              options: [
                { en: 'Rp30,000', id: 'Rp30.000' },
                { en: 'Rp65,000', id: 'Rp65.000' },
                { en: 'Rp170,000', id: 'Rp170.000' },
                { en: 'Rp135,000', id: 'Rp135.000' },
              ],
              answer: 0,
              explain: {
                en: 'The two bags cost $2 \\times 35\\,000 = 70\\,000$, so the hat costs $100\\,000 - 70\\,000 = 30\\,000$. The answer 65,000 takes away only one bag, and the others add instead of subtracting.',
                id: 'Dua tas berharga $2 \\times 35\\,000 = 70\\,000$, jadi topi berharga $100\\,000 - 70\\,000 = 30\\,000$. Jawaban 65.000 hanya mengurangi satu tas, dan yang lain menjumlah, bukan mengurang.',
              },
              hint: {
                en: 'Find the price of both bags first, then take that away from the total.',
                id: 'Cari harga kedua tas dulu, lalu kurangkan dari jumlah uangnya.',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: {
                en: 'Citra has Rp100,000. She buys 4 shirts at Rp15,000 each and 2 caps at Rp12,000 each. Choose the two number sentences that give her change.',
                id: 'Citra punya Rp100.000. Ia membeli 4 baju seharga Rp15.000 per buah dan 2 topi seharga Rp12.000 per buah. Pilih dua kalimat bilangan yang menunjukkan kembaliannya.',
              },
              options: [
                { en: '$100\\,000 - 4 \\times 15\\,000 - 2 \\times 12\\,000$', id: '$100\\,000 - 4 \\times 15\\,000 - 2 \\times 12\\,000$' },
                { en: '$100\\,000 - (4 \\times 15\\,000 + 2 \\times 12\\,000)$', id: '$100\\,000 - (4 \\times 15\\,000 + 2 \\times 12\\,000)$' },
                { en: '$100\\,000 - 4 \\times 15\\,000 + 2 \\times 12\\,000$', id: '$100\\,000 - 4 \\times 15\\,000 + 2 \\times 12\\,000$' },
                { en: '$100\\,000 - 15\\,000 - 12\\,000$', id: '$100\\,000 - 15\\,000 - 12\\,000$' },
              ],
              answer: [0, 1],
              explain: {
                en: 'Both correct sentences take the price of the shirts and the price of the caps away from 100,000, and the change is 16,000. Adding the caps back, or using only one shirt and one cap, does not match the story.',
                id: 'Kedua kalimat yang benar mengurangkan harga baju dan harga topi dari 100.000, dan kembaliannya 16.000. Menambahkan harga topi kembali, atau hanya memakai satu baju dan satu topi, tidak sesuai dengan cerita.',
              },
              hint: {
                en: 'The money for the shirts and the money for the caps both leave her purse. What happens to the 100,000?',
                id: 'Uang untuk baju dan uang untuk topi sama-sama keluar dari dompetnya. Apa yang terjadi pada 100.000?',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: {
                en: 'Mr. Joko buys 6 sacks of rice with 24 kg in each sack. He sells 100 kg. How many kilograms of rice does he have left? Decide whether each statement is True or False.',
                id: 'Pak Joko membeli 6 karung beras dengan 24 kg di setiap karung. Ia menjual 100 kg. Berapa kilogram beras yang tersisa? Tentukan tiap pernyataan Benar atau Salah.',
              },
              statements: [
                { en: 'The first step is $6 \\times 24 = 144$.', id: 'Langkah pertama adalah $6 \\times 24 = 144$.' },
                { en: 'He has 244 kg left.', id: 'Ia punya 244 kg tersisa.' },
                {
                  en: 'The estimate $6 \\times 25 - 100 = 50$ shows that 44 kg is a sensible answer.',
                  id: 'Penaksiran $6 \\times 25 - 100 = 50$ menunjukkan bahwa 44 kg adalah jawaban yang masuk akal.',
                },
                { en: 'The question asks how many kilograms he bought.', id: 'Soal menanyakan berapa kilogram yang ia beli.' },
              ],
              answer: [true, false, true, false],
              explain: {
                en: 'He buys 6 × 24 = 144 kg and sells 100 kg, so 144 − 100 = 44 kg are left. Adding would give 244, which is far from the estimate. The question asks for what is left, not for what he bought.',
                id: 'Ia membeli 6 × 24 = 144 kg dan menjual 100 kg, jadi 144 − 100 = 44 kg tersisa. Menjumlah akan memberi 244, yang jauh dari penaksiran. Soal menanyakan yang tersisa, bukan yang dibelinya.',
              },
              hint: {
                en: 'Work out the problem first. Then read each statement and check the question: what is asked?',
                id: 'Selesaikan soalnya dulu. Lalu baca tiap pernyataan dan cek pertanyaannya: apa yang ditanyakan?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A competition committee prepares 12 boxes of drinking bottles, with 24 bottles in each box. 18 bottles are broken. The bottles that are not broken are shared equally among 15 teams. How many bottles does each team get?',
                id: 'Panitia lomba menyiapkan 12 dus botol minuman, dengan 24 botol di setiap dus. Sebanyak 18 botol rusak. Botol yang tidak rusak dibagi sama banyak kepada 15 regu. Berapa botol yang didapat tiap regu?',
              },
              blanks: [{ answer: 18, after: { en: '\\text{ bottles}', id: '\\text{ botol}' } }],
              hints: [
                {
                  en: 'The story has three steps: how many bottles in all, how many are not broken, and how many for each team.',
                  id: 'Cerita ini punya tiga langkah: berapa botol seluruhnya, berapa botol yang tidak rusak, dan berapa botol untuk tiap regu.',
                },
                {
                  en: 'Write one number sentence with brackets: (boxes × bottles per box − broken) ÷ teams.',
                  id: 'Tulis satu kalimat bilangan dengan kurung: (dus × botol per dus − rusak) ÷ regu.',
                },
                {
                  en: '12 × 24 is a little under 300. Take away the 18 broken bottles, then share what is left among 15 teams.',
                  id: '12 × 24 sedikit kurang dari 300. Kurangi 18 botol yang rusak, lalu bagi sisanya kepada 15 regu.',
                },
              ],
              explain: {
                en: 'All bottles: 12 × 24 = 288. Not broken: 288 − 18 = 270. For each team: 270 ÷ 15 = 18.',
                id: 'Seluruh botol: 12 × 24 = 288. Yang tidak rusak: 288 − 18 = 270. Untuk tiap regu: 270 ÷ 15 = 18.',
              },
              solution: ['(12 \\times 24 - 18) \\div 15', '12 \\times 24 = 288', '288 - 18 = 270', '270 \\div 15 = 18'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-m1-s4-p',
        runtime: 'math',
        title: { en: 'Project: Mixed Operations', id: 'Proyek: Operasi Campuran' },
        brief: {
          en: 'Four problems about the order of operations and stories with several steps. The last one needs a plan and a sensible rounding.',
          id: 'Empat soal tentang urutan operasi hitung dan cerita dengan beberapa langkah. Soal terakhir membutuhkan rencana dan pembulatan yang masuk akal.',
        },
        requirements: [
          { en: 'Work out number sentences in the right order.', id: 'Menghitung kalimat bilangan dalam urutan yang benar.' },
          { en: 'Plan and solve stories with two or three operations.', id: 'Merencanakan dan menyelesaikan cerita dengan dua atau tiga operasi.' },
        ],
        tasks: [
          {
            prompt: { en: 'Work out $45 - 3 \\times (6 + 4)$.', id: 'Hitunglah $45 - 3 \\times (6 + 4)$.' },
            blanks: [{ answer: 15 }],
            solution: ['6 + 4 = 10', '3 \\times 10 = 30', '45 - 30 = 15'],
          },
          {
            prompt: { en: 'Work out $48 \\div 6 \\times 4 + 25 - 3 \\times 5$.', id: 'Hitunglah $48 \\div 6 \\times 4 + 25 - 3 \\times 5$.' },
            blanks: [{ answer: 42 }],
            solution: ['48 \\div 6 \\times 4 = 8 \\times 4 = 32', '3 \\times 5 = 15', '32 + 25 - 15 = 42'],
          },
          {
            prompt: {
              en: 'Mum buys 5 kg of oranges at Rp18,000 per kg and 3 kg of apples at Rp25,000 per kg. She pays with Rp200,000. How much change does she get?',
              id: 'Ibu membeli 5 kg jeruk seharga Rp18.000 per kg dan 3 kg apel seharga Rp25.000 per kg. Ia membayar dengan Rp200.000. Berapa kembaliannya?',
            },
            blanks: [{ answer: 35000, label: '\\text{Rp}' }],
            solution: ['5 \\times 18\\,000 = 90\\,000', '3 \\times 25\\,000 = 75\\,000', '200\\,000 - (90\\,000 + 75\\,000) = 35\\,000'],
          },
          {
            prompt: {
              en: 'Rudi wants a bicycle that costs Rp900,000. He has Rp350,000. Each week he saves Rp45,000. After how many weeks will he have enough money?',
              id: 'Rudi ingin membeli sepeda seharga Rp900.000. Ia punya Rp350.000. Setiap pekan ia menabung Rp45.000. Setelah berapa pekan uangnya cukup?',
            },
            figure: {
              ...barModel([
                { segs: [{ v: 900000, color: 'a' }] },
                { segs: [{ v: 350000, color: 'b' }, { v: 550000, unknown: true }] },
              ]),
              caption: {
                en: 'The bicycle costs 900,000. Rudi has 350,000. The ? is what he still has to save.',
                id: 'Sepeda berharga 900.000. Rudi punya 350.000. Tanda ? adalah yang masih harus ia tabung.',
              },
            },
            blanks: [{ answer: 13, after: { en: '\\text{ weeks}', id: '\\text{ pekan}' } }],
            solution: ['900\\,000 - 350\\,000 = 550\\,000', '550\\,000 \\div 45\\,000 = 12 \\text{ r } 10\\,000', '12 + 1 = 13'],
          },
        ],
        hints: [
          {
            en: 'Brackets first, then × and ÷ from left to right, then + and − from left to right.',
            id: 'Kurung dulu, lalu × dan ÷ dari kiri ke kanan, lalu + dan − dari kiri ke kanan.',
          },
          {
            en: 'For a story, write down what is known and what is asked. Then write a number sentence and estimate before you calculate.',
            id: 'Untuk cerita, tulis yang diketahui dan yang ditanyakan. Lalu tulis kalimat bilangan dan taksir sebelum menghitung.',
          },
          {
            en: 'For the last task, find how much he still needs, divide by the weekly saving, and think about what the remainder means.',
            id: 'Untuk soal terakhir, cari berapa lagi yang ia butuhkan, bagi dengan tabungan tiap pekan, dan pikirkan arti sisanya.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
