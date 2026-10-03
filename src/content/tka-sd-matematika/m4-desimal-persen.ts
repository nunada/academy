import type { Module } from '../types'
import type { FigItem } from '../../lib/figure'
import { barChart, fit, fractionBars, gridRect, numberLine, outline, rectPts, solid } from './figs'
import type { Piece } from './figs'

/** A 10 by 10 grid with `a` squares in the first colour and the next `b` in the
 *  second, counted row by row from the bottom left. */
function gridTwo(a: number, b: number): Piece {
  const items: FigItem[] = []
  for (let i = 0; i < 100; i++) {
    const cell = rectPts(i % 10, Math.floor(i / 10), 1, 1)
    items.push(i < a ? solid(cell, 'a') : i < a + b ? solid(cell, 'b') : outline(cell))
  }
  return { dim: 2, axes: false, ...fit([[0, 0], [10, 10]], 0.5), items }
}

/** Tick labels that read the same in both languages: whole numbers and fractions. */
const tenths = (v: number) => (v === 0 ? '0' : v === 1 ? '1' : `${Math.round(v * 10)}/10`)
const hundredths = (v: number) => `${Math.round(v * 100)}/100`
const percent = (v: number) => `${Math.round(v * 100)}%`

/** Module 4 — the three ways of writing a part of a whole: fraction, decimal,
 *  percent. Decimal place value first, then how the three forms turn into one
 *  another, then percent of an amount in everyday money and class situations. */
export const module4: Module = {
  id: 'tka-m4',
  title: { en: 'Decimals and Percent', id: 'Desimal dan Persen' },
  summary: {
    en: 'The same part of a whole can be written as a fraction, a decimal, or a percent. Learn to read decimals, switch between the three forms, compare them, and use percent for discounts and shares of a class.',
    id: 'Satu bagian dari keseluruhan bisa ditulis sebagai pecahan, desimal, atau persen. Pelajari cara membaca desimal, berpindah di antara ketiga bentuk, membandingkannya, dan memakai persen untuk diskon dan bagian dari sebuah kelas.',
  },
  submodules: [
    /* ------------------------------------------------------------ fractions and decimals */
    {
      id: 'tka-m4-s1',
      title: { en: 'Fractions and Decimals', id: 'Pecahan dan Desimal' },
      summary: {
        en: 'Read, write, compare and order decimals using place value, change fractions into decimals and back, and add and subtract decimals with lengths and money.',
        id: 'Membaca, menulis, membandingkan, dan mengurutkan desimal dengan nilai tempat, mengubah pecahan menjadi desimal dan sebaliknya, serta menjumlah dan mengurangi desimal pada panjang dan uang.',
      },
      lessons: [
        /* ------------------------------------------------------------ s1 l1: place value */
        {
          id: 'tka-m4-s1-l1',
          title: { en: 'Decimal Place Value', id: 'Nilai Tempat Desimal' },
          goal: {
            en: 'You can read, write, compare and order decimals up to thousandths.',
            id: 'Kamu bisa membaca, menulis, membandingkan, dan mengurutkan desimal sampai perseribuan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Parts of One Whole', id: 'Ayo Amati: Bagian dari Satu Utuh' },
              body: {
                en: 'A cake is cut into 10 equal pieces. Ani eats 3 pieces, so she eats $\\frac{3}{10}$ of the cake.\n\nThat part can also be written as a **decimal**: $0.3$. A decimal is a way to write a part of one whole using a **point** and place value. We read it "zero point three".\n\nEach digit after the point has its own place. One digit is **tenths** (one of 10 equal parts). Two digits are **hundredths** (one of 100 equal parts). Three digits are **thousandths** (one of 1,000 equal parts).\n\n| Number | Ones | Tenths | Hundredths | Thousandths |\n| --- | --- | --- | --- | --- |\n| $0.3$ | 0 | 3 | – | – |\n| $0.25$ | 0 | 2 | 5 | – |\n| $0.125$ | 0 | 1 | 2 | 5 |',
                id: 'Sebuah kue dipotong menjadi 10 bagian sama besar. Ani makan 3 bagian, jadi ia makan $\\frac{3}{10}$ kue.\n\nBagian itu bisa ditulis sebagai **desimal**: $0{,}3$. Desimal adalah cara menulis bagian dari satu utuh memakai **koma** dan nilai tempat. Kita membacanya "nol koma tiga".\n\nSetiap angka setelah koma punya tempatnya sendiri. Satu angka adalah **persepuluhan** (satu dari 10 bagian sama besar). Dua angka adalah **perseratusan** (satu dari 100 bagian sama besar). Tiga angka adalah **perseribuan** (satu dari 1.000 bagian sama besar).\n\n| Bilangan | Satuan | Persepuluhan | Perseratusan | Perseribuan |\n| --- | --- | --- | --- | --- |\n| $0{,}3$ | 0 | 3 | – | – |\n| $0{,}25$ | 0 | 2 | 5 | – |\n| $0{,}125$ | 0 | 1 | 2 | 5 |',
              },
              figure: {
                ...fractionBars([{ parts: 10, shaded: 3, label: '3/10' }]),
                caption: {
                  en: 'One whole cut into 10 equal parts. Three parts are shaded: $\\frac{3}{10} = 0.3$.',
                  id: 'Satu utuh dipotong menjadi 10 bagian sama besar. Tiga bagian diarsir: $\\frac{3}{10} = 0{,}3$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Writing 25 out of 100', id: 'Contoh Bertahap: Menulis 25 dari 100' },
              body: {
                en: 'A big square is cut into 100 small squares, and 25 of them are shaded. What decimal is that?\n\n1. Step 1: One small square is $\\frac{1}{100}$ of the whole square.\n2. Step 2: 25 small squares are shaded, so the shaded part is $\\frac{25}{100}$.\n3. Step 3: A full row has 10 squares, which is 1 tenth. There are 2 full rows and 5 more squares, so that is 2 tenths and 5 hundredths.\n4. Step 4: Write the digit of each place after the point: $0.25$. We read it "zero point two five".\n\n**Remember:**\n\n- The first digit after the point is tenths, the second is hundredths, the third is thousandths.\n- $\\frac{25}{100}$ has two zeros in the denominator, so there are two digits after the point.',
                id: 'Sebuah persegi besar dibagi menjadi 100 persegi kecil, dan 25 di antaranya diarsir. Berapa desimalnya?\n\n1. Langkah 1: Satu persegi kecil adalah $\\frac{1}{100}$ dari seluruh persegi.\n2. Langkah 2: Ada 25 persegi kecil yang diarsir, jadi bagian yang diarsir adalah $\\frac{25}{100}$.\n3. Langkah 3: Satu baris penuh berisi 10 persegi, yaitu 1 persepuluhan. Ada 2 baris penuh dan 5 persegi lagi, jadi bagiannya 2 persepuluhan dan 5 perseratusan.\n4. Langkah 4: Tulis angka tiap tempat setelah koma: $0{,}25$. Kita membacanya "nol koma dua lima".\n\n**Ingat:**\n\n- Angka pertama setelah koma adalah persepuluhan, angka kedua perseratusan, angka ketiga perseribuan.\n- $\\frac{25}{100}$ punya dua nol pada penyebutnya, jadi ada dua angka setelah koma.',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 25 }),
                caption: {
                  en: '100 small squares with 25 shaded: 2 full rows (2 tenths) and 5 more squares (5 hundredths).',
                  id: '100 persegi kecil dengan 25 diarsir: 2 baris penuh (2 persepuluhan) dan 5 persegi lagi (5 perseratusan).',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: More Digits Does Not Mean Bigger', id: 'Awas, Jebakan!: Banyak Angka Belum Tentu Besar' },
              body: {
                en: 'Compare decimals place by place. Do not compare them like whole numbers.\n\n| Wrong | Right |\n| --- | --- |\n| $0.45 > 0.5$ because 45 is bigger than 5 | $0.5 = 0.50$, and $50 > 45$, so $0.5 > 0.45$ |\n| $0.3 = 0.03$ | $0.3$ is 3 tenths, but $0.03$ is only 3 hundredths |\n| $0.7$ is read "zero point seventy" | $0.7$ is read "zero point seven" |\n\nWhen the numbers have different amounts of digits after the point, add zeros at the end until they match. Adding zeros at the end of a decimal does not change its value.',
                id: 'Bandingkan desimal tempat demi tempat. Jangan membandingkannya seperti bilangan bulat.\n\n| Salah | Benar |\n| --- | --- |\n| $0{,}45 > 0{,}5$ karena 45 lebih besar dari 5 | $0{,}5 = 0{,}50$, dan $50 > 45$, jadi $0{,}5 > 0{,}45$ |\n| $0{,}3 = 0{,}03$ | $0{,}3$ adalah 3 persepuluhan, sedangkan $0{,}03$ hanya 3 perseratusan |\n| $0{,}7$ dibaca "nol koma tujuh puluh" | $0{,}7$ dibaca "nol koma tujuh" |\n\nJika banyak angka setelah koma berbeda, tambahkan nol di belakang sampai sama. Menambah nol di belakang desimal tidak mengubah nilainya.',
              },
              figure: {
                ...numberLine({
                  from: 0.4,
                  to: 0.6,
                  step: 0.01,
                  labelEvery: 5,
                  fmt: hundredths,
                  marks: [
                    { at: 0.45, color: 'a' },
                    { at: 0.5, color: 'result' },
                  ],
                }),
                caption: {
                  en: 'The green dot is $0.45$ and the red dot is $0.5$. The red dot is further to the right, so $0.5$ is bigger.',
                  id: 'Titik hijau adalah $0{,}45$ dan titik merah adalah $0{,}5$. Titik merah lebih ke kanan, jadi $0{,}5$ lebih besar.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The picture has 100 small squares. The shaded part, written as a decimal, is ...',
                id: 'Gambar ini punya 100 persegi kecil. Bagian yang diarsir, ditulis sebagai desimal, adalah ...',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 35 }),
                caption: { en: '35 of the 100 squares are shaded.', id: '35 dari 100 persegi diarsir.' },
              },
              options: [
                { en: '$0.35$', id: '$0{,}35$' },
                { en: '$0.035$', id: '$0{,}035$' },
                { en: '$3.5$', id: '$3{,}5$' },
                { en: '$0.65$', id: '$0{,}65$' },
              ],
              answer: 0,
              explain: {
                en: '35 out of 100 squares are shaded, so the part is $\\frac{35}{100} = 0.35$. The decimal $0.035$ would mean 35 out of 1,000 parts, and $0.65$ is the part that is not shaded.',
                id: '35 dari 100 persegi diarsir, jadi bagiannya $\\frac{35}{100} = 0{,}35$. Bentuk $0{,}035$ berarti 35 dari 1.000 bagian, dan $0{,}65$ adalah bagian yang tidak diarsir.',
              },
              hint: {
                en: 'Count only the shaded squares. How many squares make the whole?',
                id: 'Hitung hanya persegi yang diarsir. Berapa persegi yang membentuk satu utuh?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together. 36 of the 100 squares are shaded. Complete the sentence.',
                id: 'Coba bersama. 36 dari 100 persegi diarsir. Lengkapi kalimatnya.',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 36 }),
                caption: { en: '36 of the 100 squares are shaded.', id: '36 dari 100 persegi diarsir.' },
              },
              template: {
                en: '\\dfrac{36}{100} = ___ \\text{ tenths} + ___ \\text{ hundredths}',
                id: '\\dfrac{36}{100} = ___ \\text{ persepuluhan} + ___ \\text{ perseratusan}',
              },
              blanks: ['3', '6'],
              explain: {
                en: '3 full rows are 3 tenths, and the 6 squares left over are 6 hundredths. That is $0.36$.',
                id: '3 baris penuh adalah 3 persepuluhan, dan 6 persegi sisanya adalah 6 perseratusan. Itu adalah $0{,}36$.',
              },
              hint: {
                en: 'One full row has 10 squares. How many full rows are shaded, and how many squares are left over?',
                id: 'Satu baris penuh berisi 10 persegi. Ada berapa baris penuh yang diarsir, dan berapa persegi sisanya?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The number line from 0 to 1 is cut into 10 equal parts. What number does point A show?',
                id: 'Garis bilangan dari 0 sampai 1 dibagi menjadi 10 bagian sama panjang. Berapa nilai titik A?',
              },
              figure: {
                ...numberLine({ from: 0, to: 1, step: 0.1, labelEvery: 10, marks: [{ at: 0.6, color: 'result', label: 'A' }] }),
                caption: {
                  en: 'A number line from 0 to 1 with 10 equal parts. Point A is on one of the marks.',
                  id: 'Garis bilangan dari 0 sampai 1 dengan 10 bagian sama panjang. Titik A ada pada salah satu tanda.',
                },
              },
              options: [
                { en: '$0.6$', id: '$0{,}6$' },
                { en: '$0.06$', id: '$0{,}06$' },
                { en: '$0.4$', id: '$0{,}4$' },
                { en: '$6$', id: '$6$' },
              ],
              answer: 0,
              explain: {
                en: 'Point A is 6 marks after 0, and each part is one tenth, so it shows 6 tenths, which is $0.6$. Counting from 1 instead of from 0 gives the wrong answer $0.4$.',
                id: 'Titik A ada 6 tanda setelah 0, dan tiap bagian adalah satu persepuluhan, jadi nilainya 6 persepuluhan, yaitu $0{,}6$. Menghitung dari 1 dan bukan dari 0 menghasilkan jawaban salah $0{,}4$.',
              },
              hint: {
                en: 'Start counting at 0, not at 1. What is the value of each small part?',
                id: 'Mulai menghitung dari 0, bukan dari 1. Berapa nilai tiap bagian kecil?',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: {
                en: 'Is each statement True or False?',
                id: 'Tentukan setiap pernyataan Benar atau Salah.',
              },
              statements: [
                { en: '$0.6 > 0.58$', id: '$0{,}6 > 0{,}58$' },
                { en: '$0.3 = 0.30$', id: '$0{,}3 = 0{,}30$' },
                { en: 'In $3.172$, the digit 1 is worth 1 hundredth.', id: 'Pada $3{,}172$, angka 1 bernilai 1 perseratusan.' },
                { en: '$0.45 > 0.5$ because $45 > 5$.', id: '$0{,}45 > 0{,}5$ karena $45 > 5$.' },
              ],
              answer: [true, true, false, false],
              explain: {
                en: '$0.6 = 0.60$ is bigger than $0.58$, and adding a zero at the end keeps the value. In $3.172$ the digit 1 is in the tenths place. Comparing $45$ with $5$ ignores place value: $0.5 = 0.50 > 0.45$.',
                id: '$0{,}6 = 0{,}60$ lebih besar dari $0{,}58$, dan menambah nol di belakang tidak mengubah nilai. Pada $3{,}172$ angka 1 ada di tempat persepuluhan. Membandingkan $45$ dengan $5$ mengabaikan nilai tempat: $0{,}5 = 0{,}50 > 0{,}45$.',
              },
              hint: {
                en: 'Make the numbers have the same amount of digits after the point before you compare. Name the place of each digit.',
                id: 'Samakan banyak angka setelah koma sebelum membandingkan. Sebutkan nama tempat tiap angka.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Three bottles hold $0.45$ L, $0.5$ L and $0.405$ L of water. How many litres are in the bottle with the least water?',
                id: 'Tiga botol berisi air $0{,}45$ L, $0{,}5$ L, dan $0{,}405$ L. Berapa liter air di botol yang isinya paling sedikit?',
              },
              blanks: [{ answer: 0.405, tol: 0.0001, after: '\\text{ L}' }],
              hints: [
                {
                  en: 'Look at the three numbers. They have different amounts of digits after the point. What can you do to make them match?',
                  id: 'Lihat ketiga bilangan itu. Banyak angka setelah komanya berbeda. Apa yang bisa kamu lakukan agar sama?',
                },
                {
                  en: 'Add zeros at the end so every number has three digits after the point.',
                  id: 'Tambahkan nol di belakang sampai setiap bilangan punya tiga angka setelah koma.',
                },
                {
                  en: 'Now compare 450, 500 and 405 as whole numbers. Which is the least? Write that bottle\'s amount.',
                  id: 'Sekarang bandingkan 450, 500, dan 405 sebagai bilangan bulat. Mana yang paling kecil? Tulis isi botol itu.',
                },
              ],
              explain: {
                en: 'Written with three digits, the amounts are $0.450$, $0.500$ and $0.405$. The least is $0.405$ L, even though it has the most digits.',
                id: 'Ditulis dengan tiga angka, isinya $0{,}450$, $0{,}500$, dan $0{,}405$. Yang paling sedikit adalah $0{,}405$ L, walaupun angkanya paling banyak.',
              },
              solution: {
                en: ['0.45 = 0.450 \\quad 0.5 = 0.500 \\quad 0.405', '405 < 450 < 500', '\\text{Least: } 0.405 \\text{ L}'],
                id: ['0{,}45 = 0{,}450 \\quad 0{,}5 = 0{,}500 \\quad 0{,}405', '405 < 450 < 500', '\\text{Paling sedikit: } 0{,}405 \\text{ L}'],
              },
            },
          ],
        },

        /* ------------------------------------------------------------ s1 l2: fractions <-> decimals, + and - */
        {
          id: 'tka-m4-s1-l2',
          title: { en: 'Fractions ↔ Decimals', id: 'Pecahan ↔ Desimal' },
          goal: {
            en: 'You can change fractions into decimals and back, compare them, and add and subtract decimals.',
            id: 'Kamu bisa mengubah pecahan menjadi desimal dan sebaliknya, membandingkannya, serta menjumlah dan mengurangi desimal.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Fractions with Denominator 10, 100, 1,000', id: 'Ayo Amati: Pecahan Berpenyebut 10, 100, 1.000' },
              body: {
                en: 'A ribbon is 1 metre long and marked every 10 cm, so it has 10 equal parts. A piece that is 3 parts long is $\\frac{3}{10}$ metre, which is $0.3$ metre.\n\nA fraction with denominator 10, 100 or 1,000 can be written straight away as a decimal. **The number of zeros in the denominator is the number of digits after the point.**\n\n| Fraction | Decimal | Read as |\n| --- | --- | --- |\n| $\\frac{3}{10}$ | $0.3$ | zero point three |\n| $\\frac{7}{100}$ | $0.07$ | zero point zero seven |\n| $\\frac{125}{1\\,000}$ | $0.125$ | zero point one two five |\n\nGoing the other way, a decimal can be written as a fraction and then simplified. For example, $0.36 = \\frac{36}{100} = \\frac{9}{25}$.',
                id: 'Sebuah pita panjangnya 1 meter dan ditandai tiap 10 cm, jadi ada 10 bagian sama panjang. Potongan sepanjang 3 bagian adalah $\\frac{3}{10}$ meter, yaitu $0{,}3$ meter.\n\nPecahan berpenyebut 10, 100, atau 1.000 bisa langsung ditulis sebagai desimal. **Banyak nol pada penyebut sama dengan banyak angka setelah koma.**\n\n| Pecahan | Desimal | Dibaca |\n| --- | --- | --- |\n| $\\frac{3}{10}$ | $0{,}3$ | nol koma tiga |\n| $\\frac{7}{100}$ | $0{,}07$ | nol koma nol tujuh |\n| $\\frac{125}{1\\,000}$ | $0{,}125$ | nol koma satu dua lima |\n\nSebaliknya, desimal bisa ditulis sebagai pecahan lalu disederhanakan. Contohnya, $0{,}36 = \\frac{36}{100} = \\frac{9}{25}$.',
              },
              figure: {
                ...numberLine({
                  from: 0,
                  to: 1,
                  step: 0.1,
                  fmt: tenths,
                  marks: [
                    { at: 0.3, color: 'result' },
                    { at: 0.7, color: 'a' },
                  ],
                }),
                caption: {
                  en: 'A 1 metre ribbon in 10 equal parts. The red dot is $\\frac{3}{10} = 0.3$ and the green dot is $\\frac{7}{10} = 0.7$.',
                  id: 'Pita 1 meter dalam 10 bagian sama panjang. Titik merah adalah $\\frac{3}{10} = 0{,}3$ dan titik hijau adalah $\\frac{7}{10} = 0{,}7$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Changing 3/4 into a Decimal', id: 'Contoh Bertahap: Mengubah 3/4 Menjadi Desimal' },
              body: {
                en: 'The fraction $\\frac{3}{4}$ does not have denominator 10, 100 or 1,000. First we change it into an equal fraction with denominator 100.\n\n1. Step 1: Find the number that makes 4 into 100 when we multiply. Since $4 \\times 25 = 100$, the number is 25.\n2. Step 2: Multiply the numerator and the denominator by 25: $\\frac{3 \\times 25}{4 \\times 25} = \\frac{75}{100}$.\n3. Step 3: Write it as a decimal: $\\frac{75}{100} = 0.75$.\n4. Step 4: Compare with $0.7$. Since $0.75 > 0.70$, we know $\\frac{3}{4} > 0.7$.\n\n**Remember:** multiply the numerator and the denominator by the same number, and the value does not change.\n\n| Fraction | Multiply top and bottom by | Decimal |\n| --- | --- | --- |\n| $\\frac{1}{2}$ | 5 | $\\frac{5}{10} = 0.5$ |\n| $\\frac{1}{4}$ | 25 | $\\frac{25}{100} = 0.25$ |\n| $\\frac{3}{4}$ | 25 | $\\frac{75}{100} = 0.75$ |\n| $\\frac{1}{5}$ | 2 | $\\frac{2}{10} = 0.2$ |\n| $\\frac{2}{5}$ | 2 | $\\frac{4}{10} = 0.4$ |\n| $\\frac{1}{8}$ | 125 | $\\frac{125}{1\\,000} = 0.125$ |',
                id: 'Pecahan $\\frac{3}{4}$ tidak berpenyebut 10, 100, atau 1.000. Pertama kita ubah menjadi pecahan senilai berpenyebut 100.\n\n1. Langkah 1: Cari bilangan yang membuat 4 menjadi 100 jika dikalikan. Karena $4 \\times 25 = 100$, bilangannya 25.\n2. Langkah 2: Kalikan pembilang dan penyebut dengan 25: $\\frac{3 \\times 25}{4 \\times 25} = \\frac{75}{100}$.\n3. Langkah 3: Tulis sebagai desimal: $\\frac{75}{100} = 0{,}75$.\n4. Langkah 4: Bandingkan dengan $0{,}7$. Karena $0{,}75 > 0{,}70$, kita tahu $\\frac{3}{4} > 0{,}7$.\n\n**Ingat:** kalikan pembilang dan penyebut dengan bilangan yang sama, maka nilainya tidak berubah.\n\n| Pecahan | Kalikan atas dan bawah dengan | Desimal |\n| --- | --- | --- |\n| $\\frac{1}{2}$ | 5 | $\\frac{5}{10} = 0{,}5$ |\n| $\\frac{1}{4}$ | 25 | $\\frac{25}{100} = 0{,}25$ |\n| $\\frac{3}{4}$ | 25 | $\\frac{75}{100} = 0{,}75$ |\n| $\\frac{1}{5}$ | 2 | $\\frac{2}{10} = 0{,}2$ |\n| $\\frac{2}{5}$ | 2 | $\\frac{4}{10} = 0{,}4$ |\n| $\\frac{1}{8}$ | 125 | $\\frac{125}{1\\,000} = 0{,}125$ |',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 75 }),
                caption: {
                  en: '$\\frac{3}{4}$ of a square is the same as 75 of its 100 small squares: $\\frac{75}{100} = 0.75$.',
                  id: '$\\frac{3}{4}$ dari sebuah persegi sama dengan 75 dari 100 persegi kecilnya: $\\frac{75}{100} = 0{,}75$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Step by Step: Adding Decimals', id: 'Contoh Bertahap: Menjumlah Desimal' },
              body: {
                en: 'Ani buys a ribbon $2.75$ m long and another one $1.5$ m long. How many metres of ribbon is that altogether?\n\n1. Step 1: Write one number under the other. **The point must be exactly under the point.**\n2. Step 2: Fill the empty places with zeros: $1.5 = 1.50$.\n3. Step 3: Add from right to left like whole numbers: $5 + 0 = 5$, then $7 + 5 = 12$ (write 2, carry 1), then $2 + 1 + 1 = 4$.\n4. Step 4: Put the point in the answer, straight under the other points: $4.25$ m.\n\nSubtracting decimals works the same way: line up the points, make the digits match with zeros, then subtract.',
                id: 'Ani membeli pita sepanjang $2{,}75$ m dan pita lain sepanjang $1{,}5$ m. Berapa meter panjang pita seluruhnya?\n\n1. Langkah 1: Tulis bilangan yang satu di bawah yang lain. **Koma harus tepat di bawah koma.**\n2. Langkah 2: Isi tempat yang kosong dengan nol: $1{,}5 = 1{,}50$.\n3. Langkah 3: Jumlahkan dari kanan ke kiri seperti bilangan bulat: $5 + 0 = 5$, lalu $7 + 5 = 12$ (tulis 2, simpan 1), lalu $2 + 1 + 1 = 4$.\n4. Langkah 4: Letakkan koma pada jawaban, tepat di bawah koma yang lain: $4{,}25$ m.\n\nMengurangi desimal caranya sama: sejajarkan koma, samakan angkanya dengan nol, lalu kurangkan.',
              },
              code: {
                en: '  2.75\n+ 1.50\n------\n  4.25',
                id: '  2,75\n+ 1,50\n------\n  4,25',
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Watch Out!: Denominators and Points', id: 'Awas, Jebakan!: Penyebut dan Koma' },
              body: {
                en: 'Three mistakes that often happen with fractions, decimals and sums.\n\n| Wrong | Right |\n| --- | --- |\n| $\\frac{1}{4} = 0.4$ because of the digit 4 | $\\frac{1}{4} = \\frac{25}{100} = 0.25$ |\n| $\\frac{3}{100} = 0.3$ | $\\frac{3}{100} = 0.03$ (two zeros, so two digits after the point) |\n| $2.75 + 1.5 = 2.90$ (digits lined up from the right) | $2.75 + 1.50 = 4.25$ (point under point) |',
                id: 'Tiga kesalahan yang sering terjadi pada pecahan, desimal, dan penjumlahan.\n\n| Salah | Benar |\n| --- | --- |\n| $\\frac{1}{4} = 0{,}4$ karena ada angka 4 | $\\frac{1}{4} = \\frac{25}{100} = 0{,}25$ |\n| $\\frac{3}{100} = 0{,}3$ | $\\frac{3}{100} = 0{,}03$ (dua nol, jadi dua angka setelah koma) |\n| $2{,}75 + 1{,}5 = 2{,}90$ (angka dijajarkan dari kanan) | $2{,}75 + 1{,}50 = 4{,}25$ (koma di bawah koma) |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The shaded part is $0.6$. Which is the simplest fraction equal to $0.6$?',
                id: 'Bagian yang diarsir adalah $0{,}6$. Pecahan paling sederhana yang sama dengan $0{,}6$ adalah ...',
              },
              figure: {
                ...fractionBars([{ parts: 10, shaded: 6 }]),
                caption: { en: 'A bar cut into 10 equal parts with 6 shaded.', id: 'Sebuah batang dibagi 10 bagian sama besar dengan 6 diarsir.' },
              },
              options: [
                { en: '$\\frac{3}{5}$', id: '$\\frac{3}{5}$' },
                { en: '$\\frac{6}{10}$', id: '$\\frac{6}{10}$' },
                { en: '$\\frac{6}{100}$', id: '$\\frac{6}{100}$' },
                { en: '$\\frac{1}{6}$', id: '$\\frac{1}{6}$' },
              ],
              answer: 0,
              explain: {
                en: '$0.6 = \\frac{6}{10}$, and dividing the top and bottom by 2 gives $\\frac{3}{5}$. The fraction $\\frac{6}{10}$ has the right value but can still be simplified.',
                id: '$0{,}6 = \\frac{6}{10}$, dan membagi pembilang dan penyebut dengan 2 menghasilkan $\\frac{3}{5}$. Pecahan $\\frac{6}{10}$ nilainya benar tetapi masih bisa disederhanakan.',
              },
              hint: {
                en: 'First write $0.6$ as a fraction with denominator 10. Then ask: can the top and bottom still be divided by the same number?',
                id: 'Tulis dulu $0{,}6$ sebagai pecahan berpenyebut 10. Lalu tanyakan: apakah pembilang dan penyebutnya masih bisa dibagi bilangan yang sama?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together. Change $\\frac{7}{20}$ into a fraction with denominator 100.',
                id: 'Coba bersama. Ubah $\\frac{7}{20}$ menjadi pecahan berpenyebut 100.',
              },
              template: '\\dfrac{7}{20} = \\dfrac{7 \\times ___}{20 \\times ___} = \\dfrac{___}{100}',
              blanks: ['5', '5', '35'],
              explain: {
                en: '$20 \\times 5 = 100$, so the top is multiplied by 5 too: $7 \\times 5 = 35$. So $\\frac{7}{20} = \\frac{35}{100} = 0.35$.',
                id: '$20 \\times 5 = 100$, jadi pembilang juga dikalikan 5: $7 \\times 5 = 35$. Jadi $\\frac{7}{20} = \\frac{35}{100} = 0{,}35$.',
              },
              hint: {
                en: 'What do you multiply 20 by to get 100? The top must be multiplied by the same number.',
                id: 'Dikalikan berapa agar 20 menjadi 100? Pembilang harus dikalikan dengan bilangan yang sama.',
              },
            },
            {
              kind: 'fill',
              id: 'f2',
              math: true,
              prompt: {
                en: 'Try it together. Add by changing both decimals into hundredths.',
                id: 'Coba bersama. Jumlahkan dengan mengubah kedua desimal menjadi perseratusan.',
              },
              template: {
                en: '3.40 + 2.85 = \\dfrac{340}{100} + \\dfrac{285}{100} = \\dfrac{___}{100} = ___ + \\dfrac{___}{100}',
                id: '3{,}40 + 2{,}85 = \\dfrac{340}{100} + \\dfrac{285}{100} = \\dfrac{___}{100} = ___ + \\dfrac{___}{100}',
              },
              blanks: ['625', '6', '25'],
              explain: {
                en: '$340 + 285 = 625$ hundredths. That is 6 ones and 25 hundredths, so the sum is $6.25$.',
                id: '$340 + 285 = 625$ perseratusan. Itu adalah 6 satuan dan 25 perseratusan, jadi jumlahnya $6{,}25$.',
              },
              hint: {
                en: 'Add the two numerators, 340 and 285. Then see how many wholes are inside the result: 100 hundredths make 1 whole.',
                id: 'Jumlahkan kedua pembilang, 340 dan 285. Lalu lihat ada berapa satuan utuh di dalam hasilnya: 100 perseratusan membentuk 1 satuan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which is greater, $\\frac{1}{4}$ or $0.3$?',
                id: 'Mana yang lebih besar, $\\frac{1}{4}$ atau $0{,}3$?',
              },
              figure: {
                ...fractionBars([
                  { parts: 4, shaded: 1, label: '1/4' },
                  { parts: 10, shaded: 3, label: '3/10' },
                ]),
                caption: {
                  en: 'Two bars of the same length. The top one shows $\\frac{1}{4}$ and the bottom one shows $0.3 = \\frac{3}{10}$.',
                  id: 'Dua batang dengan panjang sama. Yang atas menunjukkan $\\frac{1}{4}$ dan yang bawah menunjukkan $0{,}3 = \\frac{3}{10}$.',
                },
              },
              options: [
                { en: '$0.3$, because $\\frac{1}{4} = 0.25$ and $0.30 > 0.25$', id: '$0{,}3$, karena $\\frac{1}{4} = 0{,}25$ dan $0{,}30 > 0{,}25$' },
                { en: '$\\frac{1}{4}$, because 4 is bigger than 3', id: '$\\frac{1}{4}$, karena 4 lebih besar dari 3' },
                { en: '$\\frac{1}{4}$, because $\\frac{1}{4} = 0.4$', id: '$\\frac{1}{4}$, karena $\\frac{1}{4} = 0{,}4$' },
                { en: 'They are equal', id: 'Keduanya sama besar' },
              ],
              answer: 0,
              explain: {
                en: 'Change $\\frac{1}{4}$ to $\\frac{25}{100} = 0.25$. Then $0.30 > 0.25$, and the picture agrees: the shaded part of the bottom bar is longer.',
                id: 'Ubah $\\frac{1}{4}$ menjadi $\\frac{25}{100} = 0{,}25$. Lalu $0{,}30 > 0{,}25$, dan gambarnya setuju: bagian yang diarsir pada batang bawah lebih panjang.',
              },
              hint: {
                en: 'Write both numbers as decimals before comparing. Then check your answer against the lengths in the picture.',
                id: 'Tulis kedua bilangan sebagai desimal sebelum membandingkan. Lalu cocokkan jawabanmu dengan panjang pada gambar.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Pak Rudi buys a bicycle for Rp1.25 million and a helmet for Rp0.35 million. He pays with Rp2 million. How many million rupiah is his change?',
                id: 'Pak Rudi membeli sepeda seharga Rp1,25 juta dan helm seharga Rp0,35 juta. Ia membayar dengan uang Rp2 juta. Berapa juta rupiah kembaliannya?',
              },
              blanks: [{ answer: 0.4, tol: 0.0001, after: { en: '\\text{ million rupiah}', id: '\\text{ juta rupiah}' } }],
              hints: [
                {
                  en: 'He buys two things. What do you need to find first, before you can find the change?',
                  id: 'Ia membeli dua barang. Apa yang harus kamu cari dulu sebelum mencari kembalian?',
                },
                {
                  en: 'Add the two prices with the points lined up. Then subtract the total from 2.',
                  id: 'Jumlahkan kedua harga dengan koma sejajar. Lalu kurangkan jumlahnya dari 2.',
                },
                {
                  en: 'The total is $1.25 + 0.35$. Write 2 as $2.00$ and subtract the total from it.',
                  id: 'Jumlahnya adalah $1{,}25 + 0{,}35$. Tulis 2 sebagai $2{,}00$ lalu kurangkan jumlah itu darinya.',
                },
              ],
              explain: {
                en: 'The total is $1.25 + 0.35 = 1.60$ million. The change is $2.00 - 1.60 = 0.40$ million rupiah, which is Rp400,000.',
                id: 'Jumlahnya $1{,}25 + 0{,}35 = 1{,}60$ juta. Kembaliannya $2{,}00 - 1{,}60 = 0{,}40$ juta rupiah, yaitu Rp400.000.',
              },
              solution: {
                en: ['1.25 + 0.35 = 1.60', '2.00 - 1.60 = 0.40', '\\text{Change: } 0.4 \\text{ million rupiah}'],
                id: ['1{,}25 + 0{,}35 = 1{,}60', '2{,}00 - 1{,}60 = 0{,}40', '\\text{Kembalian: } 0{,}4 \\text{ juta rupiah}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m4-s1-p',
        runtime: 'math',
        title: { en: 'Converting and Calculating with Decimals', id: 'Mengubah dan Menghitung dengan Desimal' },
        brief: {
          en: 'Change fractions into decimals, then use decimals to find lengths and money left over.',
          id: 'Ubah pecahan menjadi desimal, lalu pakai desimal untuk mencari panjang dan sisa uang.',
        },
        requirements: [
          {
            en: 'Change a fraction into a decimal using an equal fraction with denominator 10, 100 or 1,000.',
            id: 'Mengubah pecahan menjadi desimal dengan pecahan senilai berpenyebut 10, 100, atau 1.000.',
          },
          {
            en: 'Add and subtract decimals with the points lined up.',
            id: 'Menjumlah dan mengurangi desimal dengan koma sejajar.',
          },
        ],
        tasks: [
          {
            prompt: { en: 'Write $\\frac{7}{100}$ as a decimal.', id: 'Tulis $\\frac{7}{100}$ sebagai desimal.' },
            blanks: [{ answer: 0.07, tol: 0.0001 }],
            solution: {
              en: ['\\dfrac{7}{100} = 0.07'],
              id: ['\\dfrac{7}{100} = 0{,}07'],
            },
          },
          {
            prompt: { en: 'Change $\\frac{3}{8}$ into a decimal.', id: 'Ubah $\\frac{3}{8}$ menjadi desimal.' },
            blanks: [{ answer: 0.375, tol: 0.0001 }],
            solution: {
              en: ['\\dfrac{3}{8} = \\dfrac{3 \\times 125}{8 \\times 125} = \\dfrac{375}{1\\,000} = 0.375'],
              id: ['\\dfrac{3}{8} = \\dfrac{3 \\times 125}{8 \\times 125} = \\dfrac{375}{1\\,000} = 0{,}375'],
            },
          },
          {
            prompt: {
              en: 'Budi wants a second-hand laptop that costs Rp2.35 million. He has saved Rp1.8 million. How many million rupiah does he still need?',
              id: 'Budi ingin membeli laptop bekas seharga Rp2,35 juta. Tabungannya baru Rp1,8 juta. Berapa juta rupiah lagi yang ia butuhkan?',
            },
            blanks: [{ answer: 0.55, tol: 0.0001, after: { en: '\\text{ million rupiah}', id: '\\text{ juta rupiah}' } }],
            solution: {
              en: ['2.35 - 1.80 = 0.55', '\\text{He needs } 0.55 \\text{ million rupiah}'],
              id: ['2{,}35 - 1{,}80 = 0{,}55', '\\text{Ia butuh } 0{,}55 \\text{ juta rupiah}'],
            },
          },
          {
            prompt: {
              en: 'A ribbon is 2 m long. Siti cuts off $\\frac{3}{4}$ m for a flower, then $0.6$ m for a hair band. How many metres of ribbon are left?',
              id: 'Sebuah pita panjangnya 2 m. Siti memotong $\\frac{3}{4}$ m untuk bunga, lalu $0{,}6$ m untuk pita rambut. Berapa meter pita yang tersisa?',
            },
            blanks: [{ answer: 0.65, tol: 0.0001, after: '\\text{ m}' }],
            solution: {
              en: ['\\dfrac{3}{4} = \\dfrac{75}{100} = 0.75', '0.75 + 0.60 = 1.35', '2.00 - 1.35 = 0.65'],
              id: ['\\dfrac{3}{4} = \\dfrac{75}{100} = 0{,}75', '0{,}75 + 0{,}60 = 1{,}35', '2{,}00 - 1{,}35 = 0{,}65'],
            },
          },
        ],
        hints: [
          {
            en: 'Write every number in the same form before you calculate, all as decimals or all as fractions.',
            id: 'Tulis semua bilangan dalam bentuk yang sama sebelum menghitung, semuanya desimal atau semuanya pecahan.',
          },
          {
            en: 'For a fraction like $\\frac{3}{8}$, look for the number that makes the denominator 1,000.',
            id: 'Untuk pecahan seperti $\\frac{3}{8}$, cari bilangan yang membuat penyebutnya 1.000.',
          },
          {
            en: 'When you add or subtract, put the point under the point and fill empty places with zeros.',
            id: 'Saat menjumlah atau mengurangi, letakkan koma di bawah koma dan isi tempat kosong dengan nol.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------ percent */
    {
      id: 'tka-m4-s2',
      title: { en: 'Percent', id: 'Persen' },
      summary: {
        en: 'Percent means "per hundred". Change between percent, fractions and decimals, order them, and find a percent of an amount for discounts and shares of a class.',
        id: 'Persen artinya "per seratus". Berpindah antara persen, pecahan, dan desimal, mengurutkannya, dan mencari persen dari sebuah jumlah untuk diskon dan bagian dari sebuah kelas.',
      },
      lessons: [
        /* ------------------------------------------------------------ s2 l1: percent, fractions, decimals */
        {
          id: 'tka-m4-s2-l1',
          title: { en: 'Percent, Fractions and Decimals', id: 'Persen, Pecahan, dan Desimal' },
          goal: {
            en: 'You can change between percent, fractions and decimals and put them in order.',
            id: 'Kamu bisa berpindah antara persen, pecahan, dan desimal serta mengurutkannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Per Hundred', id: 'Ayo Amati: Per Seratus' },
              body: {
                en: 'The floor of Dewi\'s room is covered with 100 small tiles. 40 of the tiles are green. So 40 out of every 100 tiles are green.\n\nThe word **percent** means "per hundred". Its sign is **%**. So 40 out of 100 tiles is 40 percent, written $40\\%$.\n\nThe same part can be written as a percent, a fraction or a decimal: $40\\% = \\frac{40}{100} = 0.4$.',
                id: 'Lantai kamar Dewi ditutup 100 ubin kecil. Sebanyak 40 ubin berwarna hijau. Jadi 40 dari tiap 100 ubin berwarna hijau.\n\nKata **persen** artinya "per seratus". Tandanya **%**. Jadi 40 dari 100 ubin adalah 40 persen, ditulis $40\\%$.\n\nBagian yang sama bisa ditulis sebagai persen, pecahan, atau desimal: $40\\% = \\frac{40}{100} = 0{,}4$.',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 40 }),
                caption: {
                  en: '100 tiles with 40 shaded: $40\\%$ of the floor.',
                  id: '100 ubin dengan 40 diarsir: $40\\%$ dari lantai.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Changing 35%', id: 'Contoh Bertahap: Mengubah 35%' },
              body: {
                en: 'Change $35\\%$ into a fraction in simplest form and into a decimal.\n\n1. Step 1: Percent means per hundred, so $35\\% = \\frac{35}{100}$.\n2. Step 2: Simplify by dividing the top and bottom by 5: $\\frac{35 \\div 5}{100 \\div 5} = \\frac{7}{20}$.\n3. Step 3: For the decimal, write $\\frac{35}{100}$ as $0.35$.\n\n**Remember:**\n\n- Percent to fraction: write it over 100, then simplify.\n- Percent to decimal: divide by 100, so the point moves two places to the left. Decimal to percent: multiply by 100.\n\n| Percent | Fraction | Decimal |\n| --- | --- | --- |\n| $10\\%$ | $\\frac{1}{10}$ | $0.1$ |\n| $20\\%$ | $\\frac{1}{5}$ | $0.2$ |\n| $25\\%$ | $\\frac{1}{4}$ | $0.25$ |\n| $50\\%$ | $\\frac{1}{2}$ | $0.5$ |\n| $75\\%$ | $\\frac{3}{4}$ | $0.75$ |\n| $100\\%$ | $1$ | $1$ |',
                id: 'Ubah $35\\%$ menjadi pecahan paling sederhana dan menjadi desimal.\n\n1. Langkah 1: Persen artinya per seratus, jadi $35\\% = \\frac{35}{100}$.\n2. Langkah 2: Sederhanakan dengan membagi pembilang dan penyebut dengan 5: $\\frac{35 \\div 5}{100 \\div 5} = \\frac{7}{20}$.\n3. Langkah 3: Untuk desimal, tulis $\\frac{35}{100}$ sebagai $0{,}35$.\n\n**Ingat:**\n\n- Persen ke pecahan: tulis per 100, lalu sederhanakan.\n- Persen ke desimal: bagi 100, jadi koma bergeser dua tempat ke kiri. Desimal ke persen: kali 100.\n\n| Persen | Pecahan | Desimal |\n| --- | --- | --- |\n| $10\\%$ | $\\frac{1}{10}$ | $0{,}1$ |\n| $20\\%$ | $\\frac{1}{5}$ | $0{,}2$ |\n| $25\\%$ | $\\frac{1}{4}$ | $0{,}25$ |\n| $50\\%$ | $\\frac{1}{2}$ | $0{,}5$ |\n| $75\\%$ | $\\frac{3}{4}$ | $0{,}75$ |\n| $100\\%$ | $1$ | $1$ |',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 35 }),
                caption: {
                  en: '35 of 100 squares shaded: $35\\% = \\frac{35}{100} = 0.35$.',
                  id: '35 dari 100 persegi diarsir: $35\\% = \\frac{35}{100} = 0{,}35$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Moving the Point', id: 'Awas, Jebakan!: Menggeser Koma' },
              body: {
                en: 'Three mistakes that often happen when changing the form.\n\n| Wrong | Right |\n| --- | --- |\n| $5\\% = 0.5$ | $5\\% = \\frac{5}{100} = 0.05$ (the point moves two places) |\n| $0.3 = 3\\%$ | $0.3 = 0.30 = 30\\%$ |\n| $\\frac{1}{4} = 4\\%$ | $\\frac{1}{4} = \\frac{25}{100} = 25\\%$ |',
                id: 'Tiga kesalahan yang sering terjadi saat mengubah bentuk.\n\n| Salah | Benar |\n| --- | --- |\n| $5\\% = 0{,}5$ | $5\\% = \\frac{5}{100} = 0{,}05$ (koma bergeser dua tempat) |\n| $0{,}3 = 3\\%$ | $0{,}3 = 0{,}30 = 30\\%$ |\n| $\\frac{1}{4} = 4\\%$ | $\\frac{1}{4} = \\frac{25}{100} = 25\\%$ |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The shaded part of the 100 squares is what percent?',
                id: 'Bagian yang diarsir dari 100 persegi ini adalah berapa persen?',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 60 }),
                caption: { en: '60 of the 100 squares are shaded.', id: '60 dari 100 persegi diarsir.' },
              },
              options: [
                { en: '$60\\%$', id: '$60\\%$' },
                { en: '$40\\%$', id: '$40\\%$' },
                { en: '$6\\%$', id: '$6\\%$' },
                { en: '$600\\%$', id: '$600\\%$' },
              ],
              answer: 0,
              explain: {
                en: '60 out of 100 squares are shaded, which is 60 per hundred, so $60\\%$. The answer $40\\%$ describes the part that is not shaded.',
                id: '60 dari 100 persegi diarsir, yaitu 60 per seratus, jadi $60\\%$. Jawaban $40\\%$ menggambarkan bagian yang tidak diarsir.',
              },
              hint: {
                en: 'Count only the shaded squares. Percent means "per how many"?',
                id: 'Hitung hanya persegi yang diarsir. Persen artinya "per berapa"?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together. Change $45\\%$ into a fraction in simplest form.',
                id: 'Coba bersama. Ubah $45\\%$ menjadi pecahan paling sederhana.',
              },
              figure: {
                ...gridRect({ cols: 10, rows: 10, shade: 45 }),
                caption: { en: '45 of the 100 squares are shaded.', id: '45 dari 100 persegi diarsir.' },
              },
              template: '45\\% = \\dfrac{___}{100} = \\dfrac{9}{___}',
              blanks: ['45', '20'],
              explain: {
                en: '$45\\% = \\frac{45}{100}$. Dividing the top and bottom by 5 gives $\\frac{9}{20}$.',
                id: '$45\\% = \\frac{45}{100}$. Membagi pembilang dan penyebut dengan 5 menghasilkan $\\frac{9}{20}$.',
              },
              hint: {
                en: 'Percent means per hundred, so the denominator starts as 100. Then find a number that divides both 45 and 100.',
                id: 'Persen artinya per seratus, jadi penyebutnya mula-mula 100. Lalu cari bilangan yang membagi 45 dan 100.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The number line goes from 0% to 100%. What percent does point A show?',
                id: 'Garis bilangan ini berjalan dari 0% sampai 100%. Titik A menunjukkan berapa persen?',
              },
              figure: {
                ...numberLine({ from: 0, to: 1, step: 0.05, labelEvery: 4, fmt: percent, marks: [{ at: 0.35, color: 'result', label: 'A' }] }),
                caption: {
                  en: 'Only some marks have a label. Each small mark is the same distance from the next one.',
                  id: 'Hanya sebagian tanda yang diberi label. Tiap tanda kecil berjarak sama dari tanda berikutnya.',
                },
              },
              options: [
                { en: '$35\\%$', id: '$35\\%$' },
                { en: '$30\\%$', id: '$30\\%$' },
                { en: '$45\\%$', id: '$45\\%$' },
                { en: '$3.5\\%$', id: '$3{,}5\\%$' },
              ],
              answer: 0,
              explain: {
                en: 'Between $20\\%$ and $40\\%$ there are 4 small parts, so each part is $5\\%$. Point A is 3 parts after $20\\%$: $20 + 15 = 35$, so $35\\%$.',
                id: 'Di antara $20\\%$ dan $40\\%$ ada 4 bagian kecil, jadi tiap bagian bernilai $5\\%$. Titik A berada 3 bagian setelah $20\\%$: $20 + 15 = 35$, jadi $35\\%$.',
              },
              hint: {
                en: 'Find the two labelled marks on each side of A. How many small parts are between them, and what is each part worth?',
                id: 'Cari dua tanda berlabel di kiri dan kanan A. Ada berapa bagian kecil di antara keduanya, dan berapa nilai tiap bagian?',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: {
                en: 'Choose the two numbers that are equal to $25\\%$.',
                id: 'Pilih dua bilangan yang sama dengan $25\\%$.',
              },
              options: [
                { en: '$\\frac{1}{4}$', id: '$\\frac{1}{4}$' },
                { en: '$0.25$', id: '$0{,}25$' },
                { en: '$2.5$', id: '$2{,}5$' },
                { en: '$\\frac{1}{25}$', id: '$\\frac{1}{25}$' },
              ],
              answer: [0, 1],
              explain: {
                en: '$25\\% = \\frac{25}{100} = \\frac{1}{4} = 0.25$. The number $2.5$ moves the point only one place, and $\\frac{1}{25}$ is the same as $4\\%$.',
                id: '$25\\% = \\frac{25}{100} = \\frac{1}{4} = 0{,}25$. Bilangan $2{,}5$ menggeser koma hanya satu tempat, dan $\\frac{1}{25}$ sama dengan $4\\%$.',
              },
              hint: {
                en: 'Write $25\\%$ as a fraction over 100. Simplify it, and write it as a decimal too.',
                id: 'Tulis $25\\%$ sebagai pecahan per 100. Sederhanakan, dan tulis juga sebagai desimal.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these numbers in order from the least to the greatest.',
                id: 'Urutkan bilangan-bilangan ini dari yang terkecil ke yang terbesar.',
              },
              lines: {
                en: ['\\dfrac{1}{4}', '0.3', '45\\%', '\\dfrac{3}{5}'],
                id: ['\\dfrac{1}{4}', '0{,}3', '45\\%', '\\dfrac{3}{5}'],
              },
              explain: {
                en: 'As decimals they are $0.25$, $0.3$, $0.45$ and $0.6$. Putting them in this order is now easy.',
                id: 'Dalam bentuk desimal, nilainya $0{,}25$, $0{,}3$, $0{,}45$, dan $0{,}6$. Mengurutkannya jadi mudah.',
              },
              hint: {
                en: 'Change every number into a decimal first. Then compare the decimals.',
                id: 'Ubah semua bilangan menjadi desimal lebih dulu. Lalu bandingkan desimalnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Ani spent $\\frac{3}{5}$ of her pocket money. What percent of her pocket money is left?',
                id: 'Ani menghabiskan $\\frac{3}{5}$ uang jajannya. Berapa persen uang jajannya yang masih tersisa?',
              },
              blanks: [{ answer: 40, after: '\\%' }],
              hints: [
                {
                  en: 'All of her pocket money is 100%. Which part did she spend?',
                  id: 'Seluruh uang jajannya adalah 100%. Bagian mana yang sudah ia habiskan?',
                },
                {
                  en: 'Change $\\frac{3}{5}$ into a fraction with denominator 100 to find the percent she spent.',
                  id: 'Ubah $\\frac{3}{5}$ menjadi pecahan berpenyebut 100 untuk mencari persen yang dihabiskan.',
                },
                {
                  en: '$\\frac{3}{5} = \\frac{60}{100}$. The part that is left is 100% minus the part she spent.',
                  id: '$\\frac{3}{5} = \\frac{60}{100}$. Bagian yang tersisa adalah 100% dikurangi bagian yang dihabiskan.',
                },
              ],
              explain: {
                en: '$\\frac{3}{5} = \\frac{60}{100} = 60\\%$ was spent, so $100\\% - 60\\% = 40\\%$ is left.',
                id: '$\\frac{3}{5} = \\frac{60}{100} = 60\\%$ sudah dihabiskan, jadi sisanya $100\\% - 60\\% = 40\\%$.',
              },
              solution: {
                en: ['\\dfrac{3}{5} = \\dfrac{60}{100} = 60\\%', '100\\% - 60\\% = 40\\%'],
                id: ['\\dfrac{3}{5} = \\dfrac{60}{100} = 60\\%', '100\\% - 60\\% = 40\\%'],
              },
            },
          ],
        },

        /* ------------------------------------------------------------ s2 l2: percent in everyday life */
        {
          id: 'tka-m4-s2-l2',
          title: { en: 'Percent in Everyday Life', id: 'Persen dalam Kehidupan' },
          goal: {
            en: 'You can find a percent of an amount, work out a discount, and use percent for parts of a whole.',
            id: 'Kamu bisa mencari persen dari sebuah jumlah, menghitung diskon, dan memakai persen untuk bagian-bagian dari satu utuh.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Percent of a Price', id: 'Ayo Amati: Persen dari Sebuah Harga' },
              body: {
                en: 'A shoe shop puts up a sign: **20% discount**. A **discount** is a cut in the price. It means the price goes down by 20 out of every 100 parts of the price.\n\nThe easy way to find a percent of an amount is to find **10%** first. Since $10\\% = \\frac{1}{10}$, just divide the amount by 10. Then multiply to get the percent you need.\n\nShoes cost Rp50,000. Cut the price into 10 equal parts. One part (10%) is Rp5,000, so a 20% discount is Rp10,000.',
                id: 'Sebuah toko sepatu memasang tulisan **diskon 20%**. **Diskon** adalah potongan harga. Artinya, harga turun 20 dari tiap 100 bagian harga.\n\nCara mudah mencari persen dari sebuah jumlah adalah mencari **10%** dulu. Karena $10\\% = \\frac{1}{10}$, cukup bagi jumlahnya dengan 10. Lalu kalikan untuk mendapat persen yang kamu perlukan.\n\nSepatu seharga Rp50.000. Bagi harga itu menjadi 10 bagian sama besar. Satu bagian (10%) adalah Rp5.000, jadi diskon 20% adalah Rp10.000.',
              },
              figure: {
                ...fractionBars([{ parts: 10, shaded: 2, label: '20%' }]),
                caption: {
                  en: 'The price is cut into 10 equal parts of Rp5,000 each (10% each). Two parts are shaded: a 20% discount.',
                  id: 'Harga dibagi menjadi 10 bagian sama besar, masing-masing Rp5.000 (10% tiap bagian). Dua bagian diarsir: diskon 20%.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: A 25% Discount', id: 'Contoh Bertahap: Diskon 25%' },
              body: {
                en: 'Shoes cost Rp80,000 and the shop gives a $25\\%$ discount. How many rupiah must you pay?\n\n1. Step 1: Change the percent into a fraction: $25\\% = \\frac{1}{4}$ (a quarter).\n2. Step 2: Find the discount, which is a quarter of the price: $80\\,000 \\div 4 = 20\\,000$.\n3. Step 3: Subtract the discount from the price: $80\\,000 - 20\\,000 = 60\\,000$.\n4. Step 4: So you pay Rp60,000.\n\n**Remember:** find 10% first, then build the percent you want.\n\n| Percent | How to find it | Of 80 |\n| --- | --- | --- |\n| $10\\%$ | divide by 10 | 8 |\n| $20\\%$ | $2 \\times 10\\%$ | 16 |\n| $25\\%$ | divide by 4 | 20 |\n| $50\\%$ | divide by 2 | 40 |\n| $75\\%$ | $3 \\times 25\\%$ | 60 |',
                id: 'Sepatu seharga Rp80.000 dan toko memberi diskon $25\\%$. Berapa rupiah yang harus kamu bayar?\n\n1. Langkah 1: Ubah persen menjadi pecahan: $25\\% = \\frac{1}{4}$ (seperempat).\n2. Langkah 2: Cari diskonnya, yaitu seperempat dari harga: $80\\,000 \\div 4 = 20\\,000$.\n3. Langkah 3: Kurangkan diskon dari harga: $80\\,000 - 20\\,000 = 60\\,000$.\n4. Langkah 4: Jadi kamu membayar Rp60.000.\n\n**Ingat:** cari 10% dulu, lalu susun persen yang kamu mau.\n\n| Persen | Cara mencarinya | Dari 80 |\n| --- | --- | --- |\n| $10\\%$ | bagi 10 | 8 |\n| $20\\%$ | $2 \\times 10\\%$ | 16 |\n| $25\\%$ | bagi 4 | 20 |\n| $50\\%$ | bagi 2 | 40 |\n| $75\\%$ | $3 \\times 25\\%$ | 60 |',
              },
              figure: {
                ...fractionBars([{ parts: 4, shaded: 1, label: '25%' }]),
                caption: {
                  en: 'The price of Rp80,000 is cut into 4 equal parts of Rp20,000. One part is shaded: the discount.',
                  id: 'Harga Rp80.000 dibagi menjadi 4 bagian sama besar, masing-masing Rp20.000. Satu bagian diarsir: diskonnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Discount or Price to Pay?', id: 'Awas, Jebakan!: Diskon atau Harga yang Dibayar?' },
              body: {
                en: 'Three mistakes that often happen with percent of an amount.\n\n| Wrong | Right |\n| --- | --- |\n| $25\\%$ of 80 is $80 \\div 25$ | $25\\% = \\frac{1}{4}$, so $80 \\div 4 = 20$ |\n| A 20% discount on Rp50,000 means you pay Rp10,000 | Rp10,000 is only the discount. You pay Rp50,000 − Rp10,000 = Rp40,000 |\n| 30 out of 50 children is $30\\%$ | $\\frac{30}{50} = \\frac{60}{100} = 60\\%$ |',
                id: 'Tiga kesalahan yang sering terjadi pada persen dari sebuah jumlah.\n\n| Salah | Benar |\n| --- | --- |\n| $25\\%$ dari 80 adalah $80 \\div 25$ | $25\\% = \\frac{1}{4}$, jadi $80 \\div 4 = 20$ |\n| Diskon 20% dari Rp50.000 berarti kamu membayar Rp10.000 | Rp10.000 hanya diskonnya. Kamu membayar Rp50.000 − Rp10.000 = Rp40.000 |\n| 30 dari 50 anak adalah $30\\%$ | $\\frac{30}{50} = \\frac{60}{100} = 60\\%$ |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A shirt costs Rp60,000 and has a 10% discount. How much is the discount?',
                id: 'Sebuah baju harganya Rp60.000 dan diskonnya 10%. Berapa rupiah potongan harganya?',
              },
              figure: {
                ...fractionBars([{ parts: 10, shaded: 1, label: '10%' }]),
                caption: {
                  en: 'The price is cut into 10 equal parts. One part is 10%.',
                  id: 'Harga dibagi menjadi 10 bagian sama besar. Satu bagian adalah 10%.',
                },
              },
              options: [
                { en: 'Rp6,000', id: 'Rp6.000' },
                { en: 'Rp54,000', id: 'Rp54.000' },
                { en: 'Rp600', id: 'Rp600' },
                { en: 'Rp10,000', id: 'Rp10.000' },
              ],
              answer: 0,
              explain: {
                en: '$10\\% = \\frac{1}{10}$, so the discount is $60\\,000 \\div 10 = 6\\,000$. The Rp54,000 is the price to pay, not the discount.',
                id: '$10\\% = \\frac{1}{10}$, jadi potongannya $60\\,000 \\div 10 = 6\\,000$. Rp54.000 adalah harga yang dibayar, bukan potongannya.',
              },
              hint: {
                en: 'The question asks for the discount, not the price to pay. 10% is one out of how many equal parts?',
                id: 'Soal menanyakan potongannya, bukan harga yang dibayar. 10% adalah satu dari berapa bagian sama besar?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together. A shirt costs Rp60,000 and has a 25% discount. Write the amounts in thousands of rupiah.',
                id: 'Coba bersama. Sebuah baju harganya Rp60.000 dan diskonnya 25%. Tulis jumlahnya dalam ribuan rupiah.',
              },
              template: {
                en: '\\text{Discount} = 60 \\div 4 = ___ \\quad \\text{Pay} = 60 - ___ = ___',
                id: '\\text{Diskon} = 60 \\div 4 = ___ \\quad \\text{Bayar} = 60 - ___ = ___',
              },
              blanks: ['15', '15', '45'],
              explain: {
                en: '$25\\% = \\frac{1}{4}$, so the discount is $60 \\div 4 = 15$ thousand. You pay $60 - 15 = 45$ thousand, which is Rp45,000.',
                id: '$25\\% = \\frac{1}{4}$, jadi diskonnya $60 \\div 4 = 15$ ribu. Kamu membayar $60 - 15 = 45$ ribu, yaitu Rp45.000.',
              },
              hint: {
                en: '25% is one quarter. Find the discount first, then subtract it from the price.',
                id: '25% adalah seperempat. Cari diskonnya lebih dulu, lalu kurangkan dari harga.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The chart shows the votes for class leader. There are 40 students and each student votes once. What percent of the students voted for Budi?',
                id: 'Diagram menunjukkan suara pemilihan ketua kelas. Ada 40 siswa dan tiap siswa memilih satu kali. Berapa persen siswa yang memilih Budi?',
              },
              figure: {
                ...barChart({
                  bars: [
                    { label: 'Ani', value: 20 },
                    { label: 'Budi', value: 10 },
                    { label: 'Citra', value: 6 },
                    { label: 'Dewi', value: 4 },
                  ],
                  max: 20,
                  step: 5,
                }),
                caption: {
                  en: 'Votes for class leader. 40 students voted.',
                  id: 'Suara untuk ketua kelas. 40 siswa memilih.',
                },
              },
              options: [
                { en: '$25\\%$', id: '$25\\%$' },
                { en: '$10\\%$', id: '$10\\%$' },
                { en: '$40\\%$', id: '$40\\%$' },
                { en: '$50\\%$', id: '$50\\%$' },
              ],
              answer: 0,
              explain: {
                en: 'Budi got 10 of the 40 votes. $\\frac{10}{40} = \\frac{1}{4} = 25\\%$. The answer $10\\%$ just reads the number of votes as if it were a percent.',
                id: 'Budi mendapat 10 dari 40 suara. $\\frac{10}{40} = \\frac{1}{4} = 25\\%$. Jawaban $10\\%$ hanya membaca banyak suara seolah-olah itu persen.',
              },
              hint: {
                en: 'Percent compares with the whole. How many students are there altogether? Budi\'s votes are what fraction of them?',
                id: 'Persen membandingkan dengan keseluruhan. Ada berapa siswa seluruhnya? Suara Budi itu pecahan berapa dari semuanya?',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: {
                en: 'Is each statement True or False?',
                id: 'Tentukan setiap pernyataan Benar atau Salah.',
              },
              statements: [
                { en: '$50\\%$ of Rp40,000 is Rp20,000.', id: '$50\\%$ dari Rp40.000 adalah Rp20.000.' },
                { en: '$25\\%$ of 80 is the same as $80 \\div 25$.', id: '$25\\%$ dari 80 sama dengan $80 \\div 25$.' },
                { en: '$10\\%$ of 350 is 35.', id: '$10\\%$ dari 350 adalah 35.' },
                { en: 'A Rp100,000 bag with a 30% discount costs Rp30,000.', id: 'Tas seharga Rp100.000 dengan diskon 30% harganya menjadi Rp30.000.' },
              ],
              answer: [true, false, true, false],
              explain: {
                en: '50% is half, and 10% is one tenth, so the first and third are right. 25% is a quarter, so divide by 4, not by 25. A 30% discount is Rp30,000, so you pay Rp70,000.',
                id: '50% adalah setengah dan 10% adalah sepersepuluh, jadi pernyataan pertama dan ketiga benar. 25% adalah seperempat, jadi dibagi 4, bukan 25. Diskon 30% adalah Rp30.000, jadi harga yang dibayar Rp70.000.',
              },
              hint: {
                en: 'Change each percent into a fraction first: 50%, 25% and 10%. For a discount, remember to subtract it from the price.',
                id: 'Ubah tiap persen menjadi pecahan lebih dulu: 50%, 25%, dan 10%. Pada diskon, ingat untuk mengurangkannya dari harga.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'In Eko\'s class there are 40 students. 25% bring rice for lunch, 35% bring bread, and the rest bring fruit. How many students bring fruit?',
                id: 'Di kelas Eko ada 40 siswa. Sebanyak 25% siswa membawa bekal nasi, 35% membawa roti, dan sisanya membawa buah. Berapa siswa yang membawa buah?',
              },
              blanks: [{ answer: 16, after: { en: '\\text{ students}', id: '\\text{ siswa}' } }],
              hints: [
                {
                  en: 'All the parts of a whole add up to 100%. What percent is not counted yet?',
                  id: 'Semua bagian dari satu utuh berjumlah 100%. Berapa persen yang belum dihitung?',
                },
                {
                  en: 'Add 25% and 35%, subtract the result from 100%, then find that percent of 40 students.',
                  id: 'Jumlahkan 25% dan 35%, kurangkan hasilnya dari 100%, lalu cari persen sisa itu dari 40 siswa.',
                },
                {
                  en: '$25\\% + 35\\% = 60\\%$, so the fruit group is 40%. Find 10% of 40 first, then multiply by 4.',
                  id: '$25\\% + 35\\% = 60\\%$, jadi kelompok buah adalah 40%. Cari 10% dari 40 dulu, lalu kalikan 4.',
                },
              ],
              explain: {
                en: 'The fruit group is $100\\% - 25\\% - 35\\% = 40\\%$ of the class. 10% of 40 is 4, so 40% is $4 \\times 4 = 16$ students.',
                id: 'Kelompok buah adalah $100\\% - 25\\% - 35\\% = 40\\%$ dari kelas. 10% dari 40 adalah 4, jadi 40% adalah $4 \\times 4 = 16$ siswa.',
              },
              solution: {
                en: ['25\\% + 35\\% = 60\\%', '100\\% - 60\\% = 40\\%', '10\\% \\text{ of } 40 = 4', '40\\% = 4 \\times 4 = 16'],
                id: ['25\\% + 35\\% = 60\\%', '100\\% - 60\\% = 40\\%', '10\\% \\text{ dari } 40 = 4', '40\\% = 4 \\times 4 = 16'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m4-s2-p',
        runtime: 'math',
        title: { en: 'Percent at Work', id: 'Persen dalam Hitungan' },
        brief: {
          en: 'Change decimals into percent, find a percent of an amount, work out a discount, and share a class into groups.',
          id: 'Ubah desimal menjadi persen, cari persen dari sebuah jumlah, hitung diskon, dan bagi sebuah kelas menjadi kelompok-kelompok.',
        },
        requirements: [
          {
            en: 'Change between percent, fractions and decimals.',
            id: 'Berpindah antara persen, pecahan, dan desimal.',
          },
          {
            en: 'Find 10%, 25%, 50% or 75% of an amount, and use the fact that all parts add up to 100%.',
            id: 'Mencari 10%, 25%, 50%, atau 75% dari sebuah jumlah, dan memakai fakta bahwa semua bagian berjumlah 100%.',
          },
        ],
        tasks: [
          {
            prompt: { en: 'Write $0.35$ as a percent.', id: 'Tulis $0{,}35$ sebagai persen.' },
            blanks: [{ answer: 35, after: '\\%' }],
            solution: {
              en: ['0.35 = \\dfrac{35}{100} = 35\\%'],
              id: ['0{,}35 = \\dfrac{35}{100} = 35\\%'],
            },
          },
          {
            prompt: { en: 'What is $75\\%$ of 80 marbles?', id: 'Berapa $75\\%$ dari 80 kelereng?' },
            blanks: [{ answer: 60, after: { en: '\\text{ marbles}', id: '\\text{ kelereng}' } }],
            solution: {
              en: ['75\\% = \\dfrac{3}{4}', '80 \\div 4 = 20', '3 \\times 20 = 60'],
              id: ['75\\% = \\dfrac{3}{4}', '80 \\div 4 = 20', '3 \\times 20 = 60'],
            },
          },
          {
            prompt: {
              en: 'Shoes cost Rp120,000 and have a 25% discount. How many rupiah must you pay?',
              id: 'Sepatu seharga Rp120.000 dan diskonnya 25%. Berapa rupiah yang harus dibayar?',
            },
            blanks: [{ answer: 90000, label: '\\text{Rp}' }],
            solution: {
              en: ['25\\% = \\dfrac{1}{4}', '120\\,000 \\div 4 = 30\\,000', '120\\,000 - 30\\,000 = 90\\,000'],
              id: ['25\\% = \\dfrac{1}{4}', '120\\,000 \\div 4 = 30\\,000', '120\\,000 - 30\\,000 = 90\\,000'],
            },
          },
          {
            prompt: {
              en: 'The 100 squares stand for the 40 students of class 6. Green squares are students who come by bus, orange squares come by bicycle, and empty squares walk. How many students walk?',
              id: '100 persegi ini mewakili 40 siswa kelas 6. Persegi hijau adalah siswa yang naik bus, persegi oranye naik sepeda, dan persegi kosong berjalan kaki. Berapa siswa yang berjalan kaki?',
            },
            figure: {
              ...gridTwo(50, 25),
              caption: {
                en: 'Green: by bus. Orange: by bicycle. Empty: on foot. The 100 squares stand for all 40 students.',
                id: 'Hijau: naik bus. Oranye: naik sepeda. Kosong: berjalan kaki. Seluruh 100 persegi mewakili ke-40 siswa itu.',
              },
            },
            blanks: [{ answer: 10, after: { en: '\\text{ students}', id: '\\text{ siswa}' } }],
            solution: {
              en: ['\\text{Bus } 50\\%, \\text{ bicycle } 25\\%', '100\\% - 50\\% - 25\\% = 25\\%', '25\\% = \\dfrac{1}{4}, \\quad 40 \\div 4 = 10'],
              id: ['\\text{Bus } 50\\%, \\text{ sepeda } 25\\%', '100\\% - 50\\% - 25\\% = 25\\%', '25\\% = \\dfrac{1}{4}, \\quad 40 \\div 4 = 10'],
            },
          },
        ],
        hints: [
          {
            en: 'Percent means per hundred. For example, $0.35 = \\frac{35}{100}$.',
            id: 'Persen artinya per seratus. Misalnya, $0{,}35 = \\frac{35}{100}$.',
          },
          {
            en: 'For a percent of an amount: 10% is divide by 10, 25% is divide by 4, 50% is divide by 2, and 75% is 3 times 25%.',
            id: 'Untuk persen dari sebuah jumlah: 10% berarti bagi 10, 25% bagi 4, 50% bagi 2, dan 75% adalah 3 kali 25%.',
          },
          {
            en: 'A discount is taken off the price, so subtract it. All the parts of a whole add up to 100%.',
            id: 'Diskon dikurangkan dari harga, jadi kurangkan. Semua bagian dari satu utuh berjumlah 100%.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
