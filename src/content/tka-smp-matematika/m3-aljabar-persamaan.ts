import type { Loc, MathBlank, Module } from '../types'
import type { FigColor, FigItem, Figure } from '../../lib/figure'
import type { Piece } from './figs'
import { fit, numberLine, rectPts, shape, solid, txt } from './figs'

/** Module 3 — algebraic expressions (terms, like terms, the three properties,
 *  expanding), linear equations and inequalities in one variable, and systems of
 *  two linear equations. Quadratic equations are outside the syllabus: an
 *  expansion may end in x squared, but nothing here asks to solve one. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

type TileKind = 'x' | 'y' | '1'
const TILE: Record<TileKind, { w: number; color: FigColor }> = {
  x: { w: 2, color: 'a' },
  y: { w: 2, color: 'b' },
  '1': { w: 1, color: 'c' },
}

/** Rows of algebra tiles: green x, orange y, gold unit squares. Each row may carry a
 *  label on the left and a total on the right. */
function tileRows(rows: { label?: string; tiles: [TileKind, number][]; after?: string }[]): Piece {
  const GAP = 0.15
  const items: FigItem[] = []
  let maxX = 0
  let labelLen = 0
  let afterLen = 0
  rows.forEach((r, i) => {
    const y0 = (rows.length - 1 - i) * 1.6
    let x = 0
    for (const [kind, n] of r.tiles) {
      const t = TILE[kind]
      for (let k = 0; k < n; k++) {
        items.push(solid(rectPts(x, y0, t.w, 1), t.color))
        items.push(txt(x + t.w / 2, y0 + 0.5, kind, 'md', 'muted'))
        x += t.w + GAP
      }
    }
    maxX = Math.max(maxX, x - GAP)
    if (r.label) {
      items.push(txt(-0.4, y0 + 0.5, r.label, 'lg', 'muted', 'end'))
      labelLen = Math.max(labelLen, r.label.length)
    }
    if (r.after) {
      items.push(txt(x + 0.3, y0 + 0.5, r.after, 'lg', 'muted', 'start'))
      afterLen = Math.max(afterLen, r.after.length)
    }
  })
  const top = (rows.length - 1) * 1.6 + 1
  const left = labelLen ? -(labelLen * 0.55 + 0.8) : 0
  const right = maxX + (afterLen ? afterLen * 0.55 + 1 : 0.2)
  return { dim: 2, axes: false, ...fit([[left, -0.2], [right, top + 0.2]], 0.5), items }
}

/** A rectangle cut into cells for an area model. Columns run left to right, rows top to bottom;
 *  `cells[row][col]` is the text written in a cell and `colors` its color. */
function areaModel(o: {
  cols: { label: string; w: number }[]
  rows: { label: string; h: number }[]
  cells: string[][]
  colors: FigColor[][]
}): Piece {
  const W = o.cols.reduce((s, c) => s + c.w, 0)
  const H = o.rows.reduce((s, r) => s + r.h, 0)
  const items: FigItem[] = []
  let yTop = H
  o.rows.forEach((r, i) => {
    const y0 = yTop - r.h
    let x = 0
    o.cols.forEach((c, j) => {
      items.push(solid(rectPts(x, y0, c.w, r.h), o.colors[i][j]))
      items.push(txt(x + c.w / 2, y0 + r.h / 2, o.cells[i][j], 'lg', 'muted'))
      x += c.w
    })
    items.push(txt(-0.4, y0 + r.h / 2, r.label, 'lg', 'muted', 'end'))
    yTop = y0
  })
  let x = 0
  for (const c of o.cols) {
    items.push(txt(x + c.w / 2, H + 0.6, c.label, 'lg', 'muted'))
    x += c.w
  }
  return { dim: 2, axes: false, ...fit([[-1.6, -0.2], [W + 0.2, H + 1.2]], 0.5), items }
}

/** A balance that is level. Each side holds `x` boxes (green, weight x) and `ones` unit weights (gold). */
function balance(o: { left: { x?: number; ones?: number }; right: { x?: number; ones?: number } }): Piece {
  const items: FigItem[] = [
    solid([[-8.5, -0.35], [8.5, -0.35], [8.5, 0], [-8.5, 0]], 'muted'),
    solid([[-1.1, -3], [1.1, -3], [0, -0.35]], 'muted'),
    solid([[-2.6, -3.35], [2.6, -3.35], [2.6, -3], [-2.6, -3]], 'muted'),
  ]
  let top = 1
  const pile = (cx: number, side: { x?: number; ones?: number }) => {
    const blocks: ('x' | '1')[] = [...Array<'x'>(side.x ?? 0).fill('x'), ...Array<'1'>(side.ones ?? 0).fill('1')]
    const wOf = (b: 'x' | '1') => (b === 'x' ? 1.9 : 0.8)
    const gap = 0.12
    const cap = 6.6
    const rows: ('x' | '1')[][] = [[]]
    let used = 0
    for (const b of blocks) {
      if (used + wOf(b) > cap && rows[rows.length - 1].length) {
        rows.push([])
        used = 0
      }
      rows[rows.length - 1].push(b)
      used += wOf(b) + gap
    }
    rows.forEach((row, r) => {
      const total = row.reduce((s, b) => s + wOf(b) + gap, -gap)
      let x = cx - total / 2
      const y0 = 0.1 + r * 1.05
      for (const b of row) {
        const h = b === 'x' ? 0.95 : 0.8
        items.push(solid(rectPts(x, y0, wOf(b), h), b === 'x' ? 'a' : 'c'))
        if (b === 'x') items.push(txt(x + wOf(b) / 2, y0 + h / 2, 'x', 'md', 'muted'))
        x += wOf(b) + gap
      }
      top = Math.max(top, y0 + 1)
    })
  }
  pile(-5, o.left)
  pile(5, o.right)
  return { dim: 2, axes: false, ...fit([[-9, -3.6], [9, top + 0.3]], 0.4), items }
}

/** Two lines `y = f1(x)` (green) and `y = f2(x)` (orange) on a labeled plane, with an optional
 *  red dot where they cross. */
function twoLines(o: { f1: string; f2: string; at?: [number, number]; name?: string; xSpan: [number, number]; ySpan: [number, number] }): Pick<Figure, 'dim' | 'xSpan' | 'ySpan' | 'ticks' | 'items'> {
  const items: FigItem[] = [
    { t: 'curve', f: o.f1, color: 'a' },
    { t: 'curve', f: o.f2, color: 'b' },
  ]
  if (o.at) items.push({ t: 'dot', x: o.at[0], y: o.at[1], color: 'result', label: o.name })
  return { dim: 2, xSpan: o.xSpan, ySpan: o.ySpan, ticks: true, items }
}

/** Two boxes for the answer of a system: `x =` and `y =`. */
const xy = (x: number, y: number): MathBlank[] => [
  { label: 'x =', answer: x },
  { label: 'y =', answer: y },
]

/* -------------------------------------------------------------- module */

export const module3: Module = {
  id: 'tka-smp-m3',
  title: L('Algebraic Expressions, Equations and Inequalities', 'Bentuk Aljabar, Persamaan, dan Pertidaksamaan'),
  summary: L(
    'Name and simplify algebraic expressions, use the properties of operations, solve linear equations and inequalities in one variable, and solve a system of two linear equations by substitution and elimination.',
    'Menamai dan menyederhanakan bentuk aljabar, memakai sifat-sifat operasi, menyelesaikan persamaan dan pertidaksamaan linear satu variabel, serta menyelesaikan sistem dua persamaan linear dengan substitusi dan eliminasi.',
  ),
  submodules: [
    /* ======================================================= S1: algebraic expressions */
    {
      id: 'tka-smp-m3-s1',
      title: L('Algebraic Expressions', 'Bentuk Aljabar'),
      summary: L(
        'Terms, coefficients and like terms; adding, subtracting and multiplying expressions; and the commutative, associative and distributive properties.',
        'Suku, koefisien, dan suku sejenis; menjumlah, mengurang, dan mengalikan bentuk aljabar; serta sifat komutatif, asosiatif, dan distributif.',
      ),
      lessons: [
        /* ------------------------------------------------ S1 L1 terms, adding, subtracting */
        {
          id: 'tka-smp-m3-s1-l1',
          title: L('Terms, Coefficients, Adding and Subtracting', 'Suku, Koefisien, Penjumlahan dan Pengurangan'),
          goal: L(
            'You can name the parts of an algebraic expression, collect like terms, evaluate an expression, and write one from a story.',
            'Kamu bisa menyebutkan bagian-bagian bentuk aljabar, menyederhanakan suku sejenis, menghitung nilainya, dan menulis bentuk aljabar dari sebuah cerita.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Letters That Stand for Numbers', 'Ayo Amati: Huruf yang Mewakili Bilangan'),
              body: L(
                'A box holds $x$ pencils. Citra has 3 boxes and 2 loose pencils, so she has $3x + 2$ pencils. The letter $x$ stands for a number that is unknown or can change.\n\n- **Variable**: a letter that stands for a number, like $x$.\n- **Constant**: a number on its own, like 2.\n- **Term**: one part of an expression, separated by + or −. The expression $3x + 2$ has two terms.\n- **Coefficient**: the number that multiplies the variable. In $3x$ the coefficient is 3.\n\nThe picture shows $3x + 2$: three green tiles for $x$ and two gold squares for the 1s.\n\n| Expression | Terms | Coefficient of $x$ | Constant |\n|---|---|---|---|\n| $3x + 2$ | $3x$ and $2$ | 3 | 2 |\n| $5x - 7$ | $5x$ and $-7$ | 5 | $-7$ |\n| $x + 9$ | $x$ and $9$ | 1 | 9 |',
                'Satu kotak berisi $x$ pensil. Citra punya 3 kotak dan 2 pensil lepas, jadi ia punya $3x + 2$ pensil. Huruf $x$ mewakili bilangan yang belum diketahui atau bisa berubah.\n\n- **Variabel**: huruf yang mewakili suatu bilangan, misalnya $x$.\n- **Konstanta**: bilangan yang berdiri sendiri, misalnya 2.\n- **Suku**: satu bagian bentuk aljabar, dipisahkan oleh tanda + atau −. Bentuk $3x + 2$ punya dua suku.\n- **Koefisien**: bilangan yang mengalikan variabel. Pada $3x$ koefisiennya 3.\n\nGambar menunjukkan $3x + 2$: tiga ubin hijau untuk $x$ dan dua kotak emas untuk bilangan 1.\n\n| Bentuk | Suku | Koefisien $x$ | Konstanta |\n|---|---|---|---|\n| $3x + 2$ | $3x$ dan $2$ | 3 | 2 |\n| $5x - 7$ | $5x$ dan $-7$ | 5 | $-7$ |\n| $x + 9$ | $x$ dan $9$ | 1 | 9 |',
              ),
              figure: {
                ...tileRows([{ label: '3x + 2', tiles: [['x', 3], ['1', 2]] }]),
                caption: L(
                  'Three green tiles for 3x and two gold squares for the constant 2.',
                  'Tiga ubin hijau untuk 3x dan dua kotak emas untuk konstanta 2.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Collecting Like Terms', 'Contoh Bertahap: Menyederhanakan Suku Sejenis'),
              body: L(
                'Citra has 3 boxes and 2 loose pencils. Dewi has 1 box and 4 loose pencils. Together they have $3x + 2 + x + 4$ pencils. Let us simplify it.\n\n1. Step 1: Spot the **like terms**, the terms with the same variable part: $3x$ and $x$ are boxes, and 2 and 4 are loose pencils.\n2. Step 2: Group them: $(3x + x) + (2 + 4)$.\n3. Step 3: Add the coefficients: $3x + x = 4x$ (remember that $x$ means $1x$), and $2 + 4 = 6$.\n4. Step 4: Write the result: $4x + 6$. It cannot be simplified more, because $4x$ and $6$ are **unlike terms**.\n\n| Like terms | Unlike terms |\n|---|---|\n| $3x$ and $5x$ | $3x$ and $5$ |\n| $4$ and $-9$ | $3x$ and $3y$ |\n\n**Remember:** add or subtract the coefficients of like terms, and keep the variable part the same. For example, $5x - 2x = 3x$.',
                'Citra punya 3 kotak dan 2 pensil lepas. Dewi punya 1 kotak dan 4 pensil lepas. Bersama-sama mereka punya $3x + 2 + x + 4$ pensil. Mari kita sederhanakan.\n\n1. Langkah 1: Cari **suku sejenis**, yaitu suku dengan bagian variabel yang sama: $3x$ dan $x$ adalah kotak, sedangkan 2 dan 4 adalah pensil lepas.\n2. Langkah 2: Kelompokkan: $(3x + x) + (2 + 4)$.\n3. Langkah 3: Jumlahkan koefisiennya: $3x + x = 4x$ (ingat bahwa $x$ berarti $1x$), dan $2 + 4 = 6$.\n4. Langkah 4: Tulis hasilnya: $4x + 6$. Bentuk ini tidak bisa disederhanakan lagi, karena $4x$ dan $6$ adalah **suku tidak sejenis**.\n\n| Suku sejenis | Suku tidak sejenis |\n|---|---|\n| $3x$ dan $5x$ | $3x$ dan $5$ |\n| $4$ dan $-9$ | $3x$ dan $3y$ |\n\n**Ingat:** jumlahkan atau kurangkan koefisien suku sejenis, dan biarkan bagian variabelnya tetap. Contohnya, $5x - 2x = 3x$.',
              ),
              figure: {
                ...tileRows([
                  { label: '3x + 2', tiles: [['x', 3], ['1', 2]] },
                  { label: 'x + 4', tiles: [['x', 1], ['1', 4]] },
                  { label: '4x + 6', tiles: [['x', 4], ['1', 6]] },
                ]),
                caption: L(
                  'The green tiles of both rows join into 4x, and the gold squares join into 6.',
                  'Ubin hijau dari kedua baris bergabung menjadi 4x, dan kotak emas bergabung menjadi 6.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Evaluating and Writing from a Story', 'Contoh Bertahap: Menghitung Nilai dan Menulis dari Cerita'),
              body: L(
                'A cinema sells tickets at Rp20,000 each. The whole order also pays a booking fee of Rp5,000 once. Let $n$ be the number of tickets. What is the cost, and what does it come to for 3 tickets?\n\n1. Step 1: Choose the variable: $n$ is the number of tickets.\n2. Step 2: The tickets cost $20\\,000 \\times n = 20\\,000n$.\n3. Step 3: The fee is added once, so the cost is $C = 20\\,000n + 5\\,000$.\n4. Step 4: To **evaluate** for $n = 3$, replace $n$ by 3: $20\\,000 \\times 3 + 5\\,000 = 65\\,000$. Three tickets cost Rp65,000.\n\n**Remember:** to evaluate, replace the variable by its number, then follow the order of operations: multiply before you add.',
                'Sebuah bioskop menjual tiket seharga Rp20.000 per lembar. Seluruh pesanan juga membayar biaya pemesanan Rp5.000 satu kali. Misalkan $n$ adalah banyak tiket. Berapa biayanya, dan berapa untuk 3 tiket?\n\n1. Langkah 1: Pilih variabelnya: $n$ adalah banyak tiket.\n2. Langkah 2: Harga tiketnya $20\\,000 \\times n = 20\\,000n$.\n3. Langkah 3: Biaya pemesanan ditambahkan satu kali, jadi biayanya $C = 20\\,000n + 5\\,000$.\n4. Langkah 4: Untuk **menghitung nilai** saat $n = 3$, ganti $n$ dengan 3: $20\\,000 \\times 3 + 5\\,000 = 65\\,000$. Tiga tiket berharga Rp65.000.\n\n**Ingat:** untuk menghitung nilai, ganti variabel dengan bilangannya, lalu ikuti urutan operasi: kalikan dulu sebelum menjumlah.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Only Like Terms Combine', 'Awas, Jebakan!: Hanya Suku Sejenis yang Bisa Digabung'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $3x + 2 = 5x$ (unlike terms were added) | $3x + 2$ stays as it is: $3x$ and 2 are unlike terms |\n| ❌ $x + x = x^2$ (adding was mixed up with multiplying) | $x + x = 2x$ (two boxes, not a square) |\n| ❌ $7x - 3x = 4$ (the variable disappeared) | $7x - 3x = 4x$ (subtract the coefficients, keep $x$) |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $3x + 2 = 5x$ (suku tidak sejenis dijumlahkan) | $3x + 2$ tetap seperti itu: $3x$ dan 2 adalah suku tidak sejenis |\n| ❌ $x + x = x^2$ (penjumlahan tertukar dengan perkalian) | $x + x = 2x$ (dua kotak, bukan persegi) |\n| ❌ $7x - 3x = 4$ (variabelnya hilang) | $7x - 3x = 4x$ (kurangkan koefisiennya, biarkan $x$) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Green tiles stand for $x$ and gold squares stand for 1. Which expression do the tiles show?',
                'Ubin hijau mewakili $x$ dan kotak emas mewakili 1. Bentuk aljabar mana yang ditunjukkan ubin-ubin ini?',
              ),
              figure: {
                ...tileRows([{ tiles: [['x', 4], ['1', 3]] }]),
                caption: L('Some green tiles and some gold squares.', 'Beberapa ubin hijau dan beberapa kotak emas.'),
              },
              options: [
                L('$4x + 3$', '$4x + 3$'),
                L('$3x + 4$', '$3x + 4$'),
                L('$7x$', '$7x$'),
                L('$x + 7$', '$x + 7$'),
              ],
              answer: 0,
              explain: L(
                'Each green tile is one $x$ and there are 4 of them, so $4x$. The 3 gold squares add 3. Writing $7x$ adds unlike terms, and $3x + 4$ swaps the two counts.',
                'Setiap ubin hijau adalah satu $x$ dan ada 4, jadi $4x$. Tiga kotak emas menambah 3. Menulis $7x$ berarti menjumlahkan suku tidak sejenis, dan $3x + 4$ menukar kedua banyaknya.',
              ),
              hint: L(
                'Count the green tiles and the gold squares separately. The green count is the coefficient of $x$.',
                'Hitung ubin hijau dan kotak emas secara terpisah. Banyak ubin hijau adalah koefisien $x$.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: simplify $4x + 3 + 2x + 5$. Add the $x$ terms and add the constants.',
                'Coba bersama: sederhanakan $4x + 3 + 2x + 5$. Jumlahkan suku $x$ dan jumlahkan konstantanya.',
              ),
              template: '(4x + 2x) + (3 + 5) = ___x + ___',
              blanks: ['6', '8'],
              explain: L(
                '$4x + 2x = 6x$ and $3 + 5 = 8$, so the result is $6x + 8$.',
                '$4x + 2x = 6x$ dan $3 + 5 = 8$, jadi hasilnya $6x + 8$.',
              ),
              hint: L(
                'Add the coefficients 4 and 2 for the first blank. Add the constants 3 and 5 for the second.',
                'Jumlahkan koefisien 4 dan 2 untuk kotak pertama. Jumlahkan konstanta 3 dan 5 untuk kotak kedua.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO terms that are like terms of $5x$.',
                'Pilih DUA suku yang sejenis dengan $5x$.',
              ),
              options: [
                L('$-2x$', '$-2x$'),
                L('$9x$', '$9x$'),
                L('$5y$', '$5y$'),
                L('$5$', '$5$'),
              ],
              answer: [0, 1],
              explain: L(
                'Like terms have the same variable part. The coefficient may be any number, even a negative one. $5y$ has a different letter, and 5 has no variable at all.',
                'Suku sejenis punya bagian variabel yang sama. Koefisiennya boleh bilangan apa saja, termasuk negatif. $5y$ memakai huruf lain, dan 5 tidak punya variabel sama sekali.',
              ),
              hint: L(
                'Ignore the coefficient and look at the letter part. Which terms have exactly $x$, and nothing else?',
                'Abaikan koefisiennya dan lihat bagian hurufnya. Suku mana yang memuat tepat $x$, tidak lebih?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'On a school trip, each student pays Rp15,000 for an entry ticket, and the whole class pays a guide fee of Rp30,000 once. Let $n$ be the number of students. Write the total cost $C$ in rupiah as an expression in $n$ (type digits only, like 15000n), then find the cost for 20 students.',
                'Pada karyawisata, setiap siswa membayar Rp15.000 untuk tiket masuk, dan seluruh kelas membayar biaya pemandu Rp30.000 satu kali. Misalkan $n$ adalah banyak siswa. Tulis total biaya $C$ dalam rupiah sebagai bentuk aljabar dalam $n$ (ketik angka saja, tanpa titik, misalnya 15000n), lalu hitung biaya untuk 20 siswa.',
              ),
              blanks: [
                { label: 'C =', formula: '15000*n+30000', variable: 'n', domain: [0, 60] },
                { label: { en: '\\text{cost for 20 students} =', id: '\\text{biaya untuk 20 siswa} =' }, answer: 330000 },
              ],
              hints: [
                L(
                  'Ask which part of the cost changes with the number of students, and which part is paid only once.',
                  'Tanyakan bagian biaya mana yang berubah menurut banyak siswa, dan bagian mana yang hanya dibayar sekali.',
                ),
                L(
                  'Each of the $n$ students pays 15 000, so that part is $15\\,000 \\times n$. The guide fee 30 000 is just added.',
                  'Setiap dari $n$ siswa membayar 15 000, jadi bagian itu $15\\,000 \\times n$. Biaya pemandu 30 000 tinggal ditambahkan.',
                ),
                L(
                  'Add the guide fee once to the part that depends on $n$. For 20 students, replace $n$ by 20, multiply first, then add the fee.',
                  'Tambahkan biaya pemandu satu kali pada bagian yang bergantung pada $n$. Untuk 20 siswa, ganti $n$ dengan 20, kalikan dulu, lalu tambahkan biaya pemandu.',
                ),
              ],
              explain: L(
                'The cost is $C = 15\\,000n + 30\\,000$. For $n = 20$: $15\\,000 \\times 20 + 30\\,000 = 330\\,000$, so Rp330,000.',
                'Biayanya $C = 15\\,000n + 30\\,000$. Untuk $n = 20$: $15\\,000 \\times 20 + 30\\,000 = 330\\,000$, jadi Rp330.000.',
              ),
              solution: ['C = 15\\,000 \\times n + 30\\,000', 'C = 15\\,000n + 30\\,000', 'n = 20: \\; 15\\,000 \\times 20 + 30\\,000 = 300\\,000 + 30\\,000 = 330\\,000'],
            },
          ],
        },
        /* ------------------------------------------------ S1 L2 multiplication and properties */
        {
          id: 'tka-smp-m3-s1-l2',
          title: L('Multiplication, Properties and Simplifying', 'Perkalian, Sifat Operasi, dan Penyederhanaan'),
          goal: L(
            'You can use the commutative, associative and distributive properties, expand brackets, and simplify products of expressions.',
            'Kamu bisa memakai sifat komutatif, asosiatif, dan distributif, menguraikan tanda kurung, dan menyederhanakan hasil kali bentuk aljabar.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Three Properties That Make Calculating Easier', 'Ayo Amati: Tiga Sifat yang Memudahkan Hitungan'),
              body: L(
                'Siti wants $47 \\times 12$ without a calculator. She splits 12 into $10 + 2$: $47 \\times 12 = 47 \\times 10 + 47 \\times 2 = 470 + 94 = 564$. The picture shows the same split as two rectangles.\n\nThree properties of operations make this kind of thinking safe.\n\n| Property | Meaning | With numbers | With letters |\n|---|---|---|---|\n| **Commutative** | the order does not matter | $3 \\times 7 = 7 \\times 3$ | $a + b = b + a$ and $ab = ba$ |\n| **Associative** | the grouping does not matter | $(2 \\times 5) \\times 4 = 2 \\times (5 \\times 4)$ | $(a + b) + c = a + (b + c)$ |\n| **Distributive** | multiply a sum by multiplying each part | $6 \\times 12 = 6 \\times 10 + 6 \\times 2$ | $a(b + c) = ab + ac$ |\n\nThese hold for addition and multiplication. They do **not** hold for subtraction and division: $5 - 3 \\neq 3 - 5$.',
                'Siti ingin menghitung $47 \\times 12$ tanpa kalkulator. Ia memecah 12 menjadi $10 + 2$: $47 \\times 12 = 47 \\times 10 + 47 \\times 2 = 470 + 94 = 564$. Gambar menunjukkan pemecahan yang sama sebagai dua persegi panjang.\n\nTiga sifat operasi membuat cara berpikir seperti ini aman dipakai.\n\n| Sifat | Artinya | Dengan bilangan | Dengan huruf |\n|---|---|---|---|\n| **Komutatif** | urutan tidak berpengaruh | $3 \\times 7 = 7 \\times 3$ | $a + b = b + a$ dan $ab = ba$ |\n| **Asosiatif** | pengelompokan tidak berpengaruh | $(2 \\times 5) \\times 4 = 2 \\times (5 \\times 4)$ | $(a + b) + c = a + (b + c)$ |\n| **Distributif** | mengalikan jumlah dengan mengalikan tiap bagian | $6 \\times 12 = 6 \\times 10 + 6 \\times 2$ | $a(b + c) = ab + ac$ |\n\nSifat ini berlaku untuk penjumlahan dan perkalian. Sifat ini **tidak** berlaku untuk pengurangan dan pembagian: $5 - 3 \\neq 3 - 5$.',
              ),
              figure: {
                ...areaModel({
                  cols: [{ label: '10', w: 10 }, { label: '2', w: 2 }],
                  rows: [{ label: '47', h: 4.7 }],
                  cells: [['470', '94']],
                  colors: [['a', 'b']],
                }),
                caption: L(
                  'A rectangle 47 by 12 cut into a green part (47 by 10) and an orange part (47 by 2).',
                  'Persegi panjang 47 kali 12 dipotong menjadi bagian hijau (47 kali 10) dan bagian oranye (47 kali 2).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Expanding with an Area Model', 'Contoh Bertahap: Menguraikan dengan Model Luas'),
              body: L(
                'A rectangle has sides $x + 3$ and $x + 2$. Its area is $(x + 3)(x + 2)$. Let us **expand** it, which means writing it without brackets.\n\n1. Step 1: Cut the rectangle into four parts, using the lengths $x$, 3 and $x$, 2.\n2. Step 2: Find each area. The green square is $x \\cdot x = x^2$. The two orange rectangles are $x \\cdot 3 = 3x$ and $2 \\cdot x = 2x$. The gold square is $2 \\cdot 3 = 6$.\n3. Step 3: Add the four areas: $x^2 + 3x + 2x + 6$.\n4. Step 4: Collect like terms: $x^2 + 5x + 6$.\n\n**Remember:**\n\n- $a(b + c) = ab + ac$: multiply EVERY term inside the brackets.\n- A monomial times a binomial: $2x(x + 5) = 2x^2 + 10x$.\n- $(x + a)(x + b) = x^2 + (a + b)x + ab$.',
                'Sebuah persegi panjang bersisi $x + 3$ dan $x + 2$. Luasnya $(x + 3)(x + 2)$. Mari kita **uraikan**, artinya menuliskannya tanpa tanda kurung.\n\n1. Langkah 1: Potong persegi panjang menjadi empat bagian, memakai panjang $x$, 3 dan $x$, 2.\n2. Langkah 2: Cari luas tiap bagian. Persegi hijau luasnya $x \\cdot x = x^2$. Dua persegi panjang oranye luasnya $x \\cdot 3 = 3x$ dan $2 \\cdot x = 2x$. Kotak emas luasnya $2 \\cdot 3 = 6$.\n3. Langkah 3: Jumlahkan keempat luas: $x^2 + 3x + 2x + 6$.\n4. Langkah 4: Gabungkan suku sejenis: $x^2 + 5x + 6$.\n\n**Ingat:**\n\n- $a(b + c) = ab + ac$: kalikan SETIAP suku di dalam kurung.\n- Suku tunggal kali suku dua: $2x(x + 5) = 2x^2 + 10x$.\n- $(x + a)(x + b) = x^2 + (a + b)x + ab$.',
              ),
              figure: {
                ...areaModel({
                  cols: [{ label: 'x', w: 3.2 }, { label: '3', w: 1.6 }],
                  rows: [{ label: 'x', h: 3.2 }, { label: '2', h: 1.1 }],
                  cells: [['x²', '3x'], ['2x', '6']],
                  colors: [['a', 'b'], ['b', 'c']],
                }),
                caption: L(
                  'A green square x², two orange rectangles 3x and 2x, and a gold square 6.',
                  'Persegi hijau x², dua persegi panjang oranye 3x dan 2x, dan kotak emas 6.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Every Term, Every Sign', 'Awas, Jebakan!: Setiap Suku, Setiap Tanda'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $3(x + 4) = 3x + 4$ (the second term was not multiplied) | $3(x + 4) = 3x + 12$ |\n| ❌ $-2(x - 3) = -2x - 6$ (a sign error: negative times negative is positive) | $-2(x - 3) = -2x + 6$ |\n| ❌ $(x + 3)^2 = x^2 + 9$ (squaring a sum is not squaring each part) | $(x + 3)^2 = (x + 3)(x + 3) = x^2 + 6x + 9$ |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $3(x + 4) = 3x + 4$ (suku kedua tidak dikalikan) | $3(x + 4) = 3x + 12$ |\n| ❌ $-2(x - 3) = -2x - 6$ (salah tanda: negatif kali negatif hasilnya positif) | $-2(x - 3) = -2x + 6$ |\n| ❌ $(x + 3)^2 = x^2 + 9$ (mengkuadratkan jumlah tidak sama dengan mengkuadratkan tiap bagian) | $(x + 3)^2 = (x + 3)(x + 3) = x^2 + 6x + 9$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The rectangle has height 2 and width $x + 5$, split into a green part and an orange part. Which expression is its total area?',
                'Persegi panjang ini tingginya 2 dan lebarnya $x + 5$, dibagi menjadi bagian hijau dan bagian oranye. Bentuk aljabar mana yang menyatakan luas seluruhnya?',
              ),
              figure: {
                ...areaModel({
                  cols: [{ label: 'x', w: 3.2 }, { label: '5', w: 2 }],
                  rows: [{ label: '2', h: 1.2 }],
                  cells: [['2x', '10']],
                  colors: [['a', 'b']],
                }),
                caption: L('Two parts: 2 by x (green) and 2 by 5 (orange).', 'Dua bagian: 2 kali x (hijau) dan 2 kali 5 (oranye).'),
              },
              options: [
                L('$2x + 10$', '$2x + 10$'),
                L('$2x + 5$', '$2x + 5$'),
                L('$x + 10$', '$x + 10$'),
                L('$2x + 7$', '$2x + 7$'),
              ],
              answer: 0,
              explain: L(
                'The height 2 multiplies both widths: $2 \\cdot x = 2x$ and $2 \\cdot 5 = 10$. Forgetting to multiply the 5 gives $2x + 5$.',
                'Tinggi 2 mengalikan kedua lebar: $2 \\cdot x = 2x$ dan $2 \\cdot 5 = 10$. Lupa mengalikan 5 menghasilkan $2x + 5$.',
              ),
              hint: L(
                'Find the area of the green part and of the orange part, then add them.',
                'Cari luas bagian hijau dan luas bagian oranye, lalu jumlahkan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: expand $(x + 2)(x + 4)$. The four parts are $x^2$, $4x$, $2x$ and 8. Collect the like terms.',
                'Coba bersama: uraikan $(x + 2)(x + 4)$. Keempat bagiannya $x^2$, $4x$, $2x$, dan 8. Gabungkan suku sejenisnya.',
              ),
              template: '(x + 2)(x + 4) = x^2 + 4x + 2x + 8 = x^2 + ___x + ___',
              blanks: ['6', '8'],
              explain: L(
                '$4x + 2x = 6x$, and 8 stays, so $(x + 2)(x + 4) = x^2 + 6x + 8$.',
                '$4x + 2x = 6x$, dan 8 tetap, jadi $(x + 2)(x + 4) = x^2 + 6x + 8$.',
              ),
              hint: L(
                'Only $4x$ and $2x$ are like terms. Add their coefficients for the first blank.',
                'Hanya $4x$ dan $2x$ yang sejenis. Jumlahkan koefisiennya untuk kotak pertama.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$3(x - 4) = 3x - 12$', '$3(x - 4) = 3x - 12$'),
                L('$(x + 2)^2 = x^2 + 4$', '$(x + 2)^2 = x^2 + 4$'),
                L(
                  '$25 \\times 8 \\times 4$ can be found as $(25 \\times 4) \\times 8 = 800$ by the commutative and associative properties.',
                  '$25 \\times 8 \\times 4$ bisa dihitung sebagai $(25 \\times 4) \\times 8 = 800$ dengan sifat komutatif dan asosiatif.',
                ),
                L('$a - b = b - a$ for all numbers $a$ and $b$.', '$a - b = b - a$ untuk semua bilangan $a$ dan $b$.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$3(x - 4) = 3x - 12$ multiplies both terms. $(x + 2)^2 = x^2 + 4x + 4$, not $x^2 + 4$. Order and grouping do not matter for multiplication, and $25 \\times 4 = 100$. Subtraction is not commutative: $5 - 3 \\neq 3 - 5$.',
                '$3(x - 4) = 3x - 12$ mengalikan kedua suku. $(x + 2)^2 = x^2 + 4x + 4$, bukan $x^2 + 4$. Urutan dan pengelompokan tidak berpengaruh pada perkalian, dan $25 \\times 4 = 100$. Pengurangan tidak komutatif: $5 - 3 \\neq 3 - 5$.',
              ),
              hint: L(
                'Test a statement with small numbers, for example $x = 1$ or $a = 5$, $b = 3$. If the two sides differ, it is false.',
                'Uji tiap pernyataan dengan bilangan kecil, misalnya $x = 1$ atau $a = 5$, $b = 3$. Jika kedua ruas berbeda, pernyataannya salah.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for simplifying $3(x + 2) - 2(x - 1)$ in order.', 'Urutkan langkah menyederhanakan $3(x + 2) - 2(x - 1)$.'),
              lines: ['3(x + 2) - 2(x - 1)', '= 3x + 6 - 2x + 2', '= (3x - 2x) + (6 + 2)', '= x + 8'],
              explain: L(
                'First remove the brackets, taking care of the sign of $-2 \\times (-1) = +2$. Then group the like terms and add.',
                'Hilangkan dulu tanda kurung, dengan memperhatikan tanda $-2 \\times (-1) = +2$. Lalu kelompokkan suku sejenis dan jumlahkan.',
              ),
              hint: L(
                'The brackets must go before the like terms can be grouped, and the simplest form comes last.',
                'Tanda kurung harus hilang sebelum suku sejenis bisa dikelompokkan, dan bentuk paling sederhana ada di akhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Garden A is a rectangle with sides $(x + 5)$ m and $(x - 2)$ m. Garden B is a rectangle with sides $x$ m and $(x + 1)$ m. Write the area of A minus the area of B as the simplest expression in $x$.',
                'Kebun A berbentuk persegi panjang dengan sisi $(x + 5)$ m dan $(x - 2)$ m. Kebun B berbentuk persegi panjang dengan sisi $x$ m dan $(x + 1)$ m. Tulis luas A dikurangi luas B sebagai bentuk paling sederhana dalam $x$.',
              ),
              blanks: [{ label: 'A - B =', formula: '2*x-10', variable: 'x', domain: [-6, 8] }],
              hints: [
                L(
                  'Find each area on its own first: multiply the two sides of each garden.',
                  'Cari dulu luas masing-masing kebun: kalikan dua sisi tiap kebun.',
                ),
                L(
                  'Area of A $= (x + 5)(x - 2)$ and area of B $= x(x + 1)$. Expand both, watching the signs.',
                  'Luas A $= (x + 5)(x - 2)$ dan luas B $= x(x + 1)$. Uraikan keduanya dengan memperhatikan tanda.',
                ),
                L(
                  'A $= x^2 + 3x - 10$ and B $= x^2 + x$. Subtract B from A: put B in brackets so that BOTH its terms change sign.',
                  'A $= x^2 + 3x - 10$ dan B $= x^2 + x$. Kurangkan B dari A: beri B tanda kurung supaya KEDUA sukunya berubah tanda.',
                ),
              ],
              explain: L(
                '$(x^2 + 3x - 10) - (x^2 + x) = x^2 + 3x - 10 - x^2 - x = 2x - 10$. The $x^2$ terms cancel.',
                '$(x^2 + 3x - 10) - (x^2 + x) = x^2 + 3x - 10 - x^2 - x = 2x - 10$. Suku $x^2$ saling menghapus.',
              ),
              solution: ['(x + 5)(x - 2) = x^2 - 2x + 5x - 10 = x^2 + 3x - 10', 'x(x + 1) = x^2 + x', '(x^2 + 3x - 10) - (x^2 + x) = x^2 + 3x - 10 - x^2 - x', '= 2x - 10'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m3-s1-p',
        runtime: 'math',
        title: L('Algebraic Expressions in Action', 'Bentuk Aljabar dalam Aksi'),
        brief: L(
          'Read the parts of an expression, simplify and expand, and use algebra to describe a garden and to catch a common mistake.',
          'Baca bagian-bagian bentuk aljabar, sederhanakan dan uraikan, lalu pakai aljabar untuk menggambarkan sebuah kebun dan menemukan kesalahan yang sering terjadi.',
        ),
        requirements: [
          L('Name terms, coefficients and constants, and collect like terms.', 'Menyebutkan suku, koefisien, dan konstanta, serta menggabungkan suku sejenis.'),
          L('Expand brackets with the distributive property, including sign care.', 'Menguraikan tanda kurung dengan sifat distributif, termasuk teliti pada tanda.'),
        ],
        hints: [
          L('Before you simplify, circle every term together with the sign in front of it.', 'Sebelum menyederhanakan, lingkari setiap suku bersama tanda di depannya.'),
          L('When a bracket has a minus in front, every term inside changes sign.', 'Jika ada tanda minus di depan kurung, setiap suku di dalamnya berubah tanda.'),
          L('To check an expansion, try a small number such as $x = 2$ in both forms.', 'Untuk memeriksa hasil uraian, coba bilangan kecil seperti $x = 2$ pada kedua bentuk.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Look at the expression $7a - 3b + 4$. Type the coefficient of $a$, the coefficient of $b$, and the constant.',
              'Perhatikan bentuk $7a - 3b + 4$. Ketik koefisien $a$, koefisien $b$, dan konstantanya.',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{coefficient of } a =', id: '\\text{koefisien } a =' }, answer: 7 },
              { label: { en: '\\text{coefficient of } b =', id: '\\text{koefisien } b =' }, answer: -3 },
              { label: { en: '\\text{constant} =', id: '\\text{konstanta} =' }, answer: 4 },
            ],
            solution: {
              en: ['7a - 3b + 4 = 7a + (-3b) + 4', '\\text{coefficients: } 7 \\text{ and } -3 \\quad \\text{constant: } 4'],
              id: ['7a - 3b + 4 = 7a + (-3b) + 4', '\\text{koefisien: } 7 \\text{ dan } -3 \\quad \\text{konstanta: } 4'],
            },
          },
          {
            prompt: L('Simplify $4(2x - 3) - 3(x - 5)$.', 'Sederhanakan $4(2x - 3) - 3(x - 5)$.'),
            blanks: [{ formula: '5*x+3', variable: 'x', domain: [-6, 6] }],
            solution: ['4(2x - 3) - 3(x - 5) = 8x - 12 - 3x + 15', '= (8x - 3x) + (-12 + 15)', '= 5x + 3'],
          },
          {
            prompt: L(
              'A rectangular field has length $(2x + 3)$ m and width $x$ m. Write its perimeter as the simplest expression in $x$, then find the perimeter when $x = 5$.',
              'Sebuah lapangan persegi panjang panjangnya $(2x + 3)$ m dan lebarnya $x$ m. Tulis kelilingnya sebagai bentuk paling sederhana dalam $x$, lalu hitung kelilingnya saat $x = 5$.',
            ),
            figure: {
              ...shape({ pts: [[0, 0], [6, 0], [6, 3], [0, 3]], sides: ['2x + 3', 'x', '2x + 3', 'x'], rights: [0, 1, 2, 3], pad: 1.4 }),
              caption: L('A rectangle with its length and width written on the sides.', 'Persegi panjang dengan panjang dan lebar tertulis pada sisinya.'),
            },
            blanks: [
              { label: { en: 'P =', id: 'K =' }, formula: '6*x+6', variable: 'x', domain: [0, 20] },
              { label: { en: '\\text{perimeter when } x = 5 =', id: '\\text{keliling saat } x = 5 =' }, answer: 36 },
            ],
            solution: ['P = 2\\,[(2x + 3) + x] = 2(3x + 3)', 'P = 6x + 6', 'x = 5: \\; 6 \\times 5 + 6 = 36'],
          },
          {
            prompt: L(
              'Dewi claims that $(x + 3)^2 = x^2 + 9$. Test her claim with $x = 2$. Type the value of $(x + 3)^2$ and the value of $x^2 + 9$. Then find the correct expansion $x^2 + ?x + 9$ and type the missing coefficient.',
              'Dewi mengklaim bahwa $(x + 3)^2 = x^2 + 9$. Uji klaimnya dengan $x = 2$. Ketik nilai $(x + 3)^2$ dan nilai $x^2 + 9$. Lalu cari uraian yang benar $x^2 + ?x + 9$ dan ketik koefisien yang hilang.',
            ),
            blanks: [
              { label: '(x + 3)^2 =', answer: 25 },
              { label: 'x^2 + 9 =', answer: 13 },
              { label: { en: '\\text{missing coefficient} =', id: '\\text{koefisien yang hilang} =' }, answer: 6 },
            ],
            solution: ['x = 2: \\; (2 + 3)^2 = 25', 'x = 2: \\; 2^2 + 9 = 13 \\neq 25', '(x + 3)(x + 3) = x^2 + 3x + 3x + 9 = x^2 + 6x + 9'],
          },
        ],
      },
    },
    /* ======================================================= S2: equations and inequalities */
    {
      id: 'tka-smp-m3-s2',
      title: L('Linear Equations and Inequalities in One Variable', 'Persamaan dan Pertidaksamaan Linear Satu Variabel'),
      summary: L(
        'Solve equations with the balance idea, check the answer, model word problems, and solve inequalities with their solution sets on the number line.',
        'Menyelesaikan persamaan dengan gagasan timbangan, memeriksa jawaban, memodelkan soal cerita, dan menyelesaikan pertidaksamaan dengan himpunan penyelesaiannya pada garis bilangan.',
      ),
      lessons: [
        /* ------------------------------------------------ S2 L1 linear equations */
        {
          id: 'tka-smp-m3-s2-l1',
          title: L('Linear Equations in One Variable', 'Persamaan Linear Satu Variabel'),
          goal: L(
            'You can solve a linear equation by doing the same to both sides, and turn a word problem into an equation and check it.',
            'Kamu bisa menyelesaikan persamaan linear dengan melakukan hal yang sama pada kedua ruas, dan mengubah soal cerita menjadi persamaan lalu memeriksanya.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: The Balance', 'Ayo Amati: Timbangan'),
              body: L(
                'A balance is level when both sides weigh the same. An **equation** works the same way: both sides are equal. To **solve** it, we find the value of $x$ that keeps it true.\n\nIn the picture, the left side holds 2 green boxes of weight $x$ and 3 gold weights of 1. The right side holds 11 gold weights. So $2x + 3 = 11$.\n\nThe golden rule: **whatever you do to one side, do to the other side as well.** Then the balance stays level.\n\n- Take 3 off both sides: $2x = 8$.\n- Cut both sides into 2 equal parts: $x = 4$.\n\n| To undo | Use the inverse operation |\n|---|---|\n| adding | subtracting |\n| subtracting | adding |\n| multiplying | dividing |\n| dividing | multiplying |',
                'Timbangan seimbang kalau kedua sisinya sama berat. **Persamaan** bekerja dengan cara yang sama: kedua ruasnya sama. **Menyelesaikan** persamaan berarti mencari nilai $x$ yang membuatnya tetap benar.\n\nPada gambar, sisi kiri berisi 2 kotak hijau berbobot $x$ dan 3 anak timbangan emas berbobot 1. Sisi kanan berisi 11 anak timbangan emas. Jadi $2x + 3 = 11$.\n\nAturan emasnya: **apa pun yang kamu lakukan pada satu ruas, lakukan juga pada ruas yang lain.** Dengan begitu timbangan tetap seimbang.\n\n- Ambil 3 dari kedua ruas: $2x = 8$.\n- Bagi kedua ruas menjadi 2 bagian sama besar: $x = 4$.\n\n| Untuk membatalkan | Pakai operasi kebalikannya |\n|---|---|\n| penjumlahan | pengurangan |\n| pengurangan | penjumlahan |\n| perkalian | pembagian |\n| pembagian | perkalian |',
              ),
              figure: {
                ...balance({ left: { x: 2, ones: 3 }, right: { ones: 11 } }),
                caption: L(
                  'A level balance: two green boxes and three gold weights on the left, eleven gold weights on the right.',
                  'Timbangan seimbang: dua kotak hijau dan tiga anak timbangan emas di kiri, sebelas anak timbangan emas di kanan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Variables on Both Sides', 'Contoh Bertahap: Variabel di Kedua Ruas'),
              body: L(
                'Solve $5x - 4 = 2x + 11$. The variable is on both sides, so we first gather it on one side.\n\n1. Step 1: Subtract $2x$ from both sides: $5x - 2x - 4 = 11$, which is $3x - 4 = 11$.\n2. Step 2: Add 4 to both sides: $3x = 15$.\n3. Step 3: Divide both sides by 3: $x = 5$.\n4. Step 4: Check with $x = 5$ in both sides: $5(5) - 4 = 21$ and $2(5) + 11 = 21$. They match.\n\n**Remember:**\n\n- Brackets first: $2(x + 3) = 14$ becomes $2x + 6 = 14$.\n- Fractions: multiply EVERY term by the denominator. $\\frac{x}{3} + 2 = 5$ becomes $x + 6 = 15$.\n- Always finish with a check.',
                'Selesaikan $5x - 4 = 2x + 11$. Variabelnya ada di kedua ruas, jadi kita kumpulkan dulu di satu ruas.\n\n1. Langkah 1: Kurangi kedua ruas dengan $2x$: $5x - 2x - 4 = 11$, yaitu $3x - 4 = 11$.\n2. Langkah 2: Tambahkan 4 pada kedua ruas: $3x = 15$.\n3. Langkah 3: Bagi kedua ruas dengan 3: $x = 5$.\n4. Langkah 4: Periksa dengan $x = 5$ di kedua ruas: $5(5) - 4 = 21$ dan $2(5) + 11 = 21$. Hasilnya sama.\n\n**Ingat:**\n\n- Kurung dulu: $2(x + 3) = 14$ menjadi $2x + 6 = 14$.\n- Pecahan: kalikan SETIAP suku dengan penyebutnya. $\\frac{x}{3} + 2 = 5$ menjadi $x + 6 = 15$.\n- Selalu akhiri dengan memeriksa jawaban.',
              ),
              figure: {
                ...balance({ left: { x: 3 }, right: { ones: 15 } }),
                caption: L(
                  'After steps 1 and 2 the balance shows 3x = 15: three equal green boxes weigh 15 together.',
                  'Setelah langkah 1 dan 2, timbangan menunjukkan 3x = 15: tiga kotak hijau yang sama beratnya bersama-sama 15.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: A Word Problem in 4 Steps', 'Contoh Bertahap: Soal Cerita dalam 4 Langkah'),
              body: L(
                'A taxi charges a starting fee of Rp8,000 plus Rp3,000 for every kilometer. Siti paid Rp26,000. How far did she ride?\n\n1. Step 1: Understand. The unknown is the distance, so let $k$ be the number of kilometers.\n2. Step 2: Model. Fee plus distance charge equals the total: $8\\,000 + 3\\,000k = 26\\,000$.\n3. Step 3: Solve. Subtract 8 000 from both sides: $3\\,000k = 18\\,000$. Divide both sides by 3 000: $k = 6$.\n4. Step 4: Check in the story: $8\\,000 + 3\\,000 \\times 6 = 26\\,000$. Siti rode 6 km.\n\nThe solution is one point on the number line: the single number that makes the equation true.',
                'Sebuah taksi menarik biaya awal Rp8.000 ditambah Rp3.000 untuk setiap kilometer. Siti membayar Rp26.000. Berapa jauh ia naik taksi?\n\n1. Langkah 1: Pahami. Yang tidak diketahui adalah jaraknya, jadi misalkan $k$ adalah banyak kilometer.\n2. Langkah 2: Modelkan. Biaya awal ditambah biaya jarak sama dengan totalnya: $8\\,000 + 3\\,000k = 26\\,000$.\n3. Langkah 3: Selesaikan. Kurangi kedua ruas dengan 8 000: $3\\,000k = 18\\,000$. Bagi kedua ruas dengan 3 000: $k = 6$.\n4. Langkah 4: Periksa pada cerita: $8\\,000 + 3\\,000 \\times 6 = 26\\,000$. Siti naik taksi sejauh 6 km.\n\nPenyelesaiannya adalah satu titik pada garis bilangan: satu-satunya bilangan yang membuat persamaan itu benar.',
              ),
              figure: {
                ...numberLine({ from: 0, to: 10, step: 1, marks: [{ at: 6 }] }),
                caption: L(
                  'The red dot at 6 is the one number on the line that makes the equation true.',
                  'Titik merah di 6 adalah satu-satunya bilangan pada garis yang membuat persamaan itu benar.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Both Sides, Whole Sides', 'Awas, Jebakan!: Kedua Ruas, Seluruh Ruas'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $\\frac{x}{3} + 2 = 5 \\Rightarrow x + 2 = 15$ (only the first term was multiplied by 3) | $x + 6 = 15$ (multiply EVERY term by 3), so $x = 9$ |\n| ❌ $5x - 4 = 2x + 11 \\Rightarrow 5x + 2x = 11 - 4$ (the sign did not change when $2x$ moved) | $5x - 2x = 11 + 4$ (moving a term to the other side reverses its sign) |\n| ❌ $2(x + 3) = 14 \\Rightarrow 2x + 3 = 14$ (the 3 was not multiplied) | $2x + 6 = 14$ (multiply both terms in the bracket) |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $\\frac{x}{3} + 2 = 5 \\Rightarrow x + 2 = 15$ (hanya suku pertama yang dikali 3) | $x + 6 = 15$ (kalikan SETIAP suku dengan 3), jadi $x = 9$ |\n| ❌ $5x - 4 = 2x + 11 \\Rightarrow 5x + 2x = 11 - 4$ (tanda tidak berubah saat $2x$ pindah) | $5x - 2x = 11 + 4$ (memindahkan suku ke ruas lain membalik tandanya) |\n| ❌ $2(x + 3) = 14 \\Rightarrow 2x + 3 = 14$ (3 tidak dikalikan) | $2x + 6 = 14$ (kalikan kedua suku di dalam kurung) |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The balance is level. The green box has weight $x$ and each gold weight is 1. Which equation does the balance show?',
                'Timbangan ini seimbang. Kotak hijau berbobot $x$ dan setiap anak timbangan emas berbobot 1. Persamaan mana yang ditunjukkan timbangan?',
              ),
              figure: {
                ...balance({ left: { x: 1, ones: 5 }, right: { ones: 12 } }),
                caption: L('One green box and five gold weights balance twelve gold weights.', 'Satu kotak hijau dan lima anak timbangan emas seimbang dengan dua belas anak timbangan emas.'),
              },
              options: [
                L('$x + 5 = 12$', '$x + 5 = 12$'),
                L('$5x = 12$', '$5x = 12$'),
                L('$x + 12 = 5$', '$x + 12 = 5$'),
                L('$x = 12 + 5$', '$x = 12 + 5$'),
              ],
              answer: 0,
              explain: L(
                'The left side is one box ($x$) plus 5, and the right side is 12. $5x$ would mean five boxes, and the other two options mix up the sides.',
                'Sisi kiri adalah satu kotak ($x$) ditambah 5, dan sisi kanan adalah 12. $5x$ berarti lima kotak, dan dua pilihan lain menukar isi kedua sisi.',
              ),
              hint: L(
                'Write what is on the left pan, then what is on the right pan, with an equals sign between them.',
                'Tuliskan isi pan kiri, lalu isi pan kanan, dengan tanda sama dengan di antaranya.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: solve $4x - 3 = 13$. Add 3 to both sides, then divide both sides by 4.',
                'Coba bersama: selesaikan $4x - 3 = 13$. Tambahkan 3 pada kedua ruas, lalu bagi kedua ruas dengan 4.',
              ),
              template: '4x - 3 = 13 \\Rightarrow 4x = ___ \\Rightarrow x = ___',
              blanks: ['16', '4'],
              explain: L(
                '$13 + 3 = 16$, and $16 \\div 4 = 4$. Check: $4 \\times 4 - 3 = 13$.',
                '$13 + 3 = 16$, dan $16 \\div 4 = 4$. Periksa: $4 \\times 4 - 3 = 13$.',
              ),
              hint: L(
                'First blank: what is 13 after adding 3? Second blank: divide that number by 4.',
                'Kotak pertama: berapa 13 setelah ditambah 3? Kotak kedua: bagi bilangan itu dengan 4.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The red dot on the number line is the solution of exactly one of these equations. Which one?',
                'Titik merah pada garis bilangan adalah penyelesaian dari tepat satu persamaan berikut. Yang mana?',
              ),
              figure: {
                ...numberLine({ from: -2, to: 8, step: 1, marks: [{ at: 3 }] }),
                caption: L('A number line with a red dot.', 'Garis bilangan dengan sebuah titik merah.'),
              },
              options: [
                L('$2x + 1 = 7$', '$2x + 1 = 7$'),
                L('$2x + 1 = 5$', '$2x + 1 = 5$'),
                L('$x - 3 = 6$', '$x - 3 = 6$'),
                L('$3x = 6$', '$3x = 6$'),
              ],
              answer: 0,
              explain: L(
                'Read the dot: $x = 3$. Then $2(3) + 1 = 7$. The other equations give $x = 2$, $x = 9$ and $x = 2$.',
                'Baca titiknya: $x = 3$. Maka $2(3) + 1 = 7$. Persamaan lain memberi $x = 2$, $x = 9$, dan $x = 2$.',
              ),
              hint: L(
                'Read the number under the dot, then put it in place of $x$ in each equation.',
                'Baca bilangan di bawah titik, lalu gantikan $x$ dengan bilangan itu pada tiap persamaan.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for solving $3(x - 1) + 2 = 14$ in order.', 'Urutkan langkah menyelesaikan $3(x - 1) + 2 = 14$.'),
              lines: ['3(x - 1) + 2 = 14', '3x - 3 + 2 = 14', '3x - 1 = 14', '3x = 15', 'x = 5'],
              explain: L(
                'Expand the bracket, collect the constants, add 1 to both sides, then divide both sides by 3.',
                'Uraikan kurungnya, gabungkan konstanta, tambahkan 1 pada kedua ruas, lalu bagi kedua ruas dengan 3.',
              ),
              hint: L(
                'Remove the bracket first. The variable must be alone last.',
                'Hilangkan kurung dulu. Variabel harus sendirian di langkah terakhir.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Ani has Rp20,000 and saves Rp6,000 every week. Budi has Rp50,000 but spends Rp4,000 every week. After how many weeks do they have the same amount? How much does each have then (in rupiah)?',
                'Ani punya Rp20.000 dan menabung Rp6.000 setiap minggu. Budi punya Rp50.000 tetapi menghabiskan Rp4.000 setiap minggu. Setelah berapa minggu uang mereka sama banyak? Berapa rupiah uang masing-masing saat itu?',
              ),
              blanks: [
                { label: { en: '\\text{weeks} =', id: '\\text{minggu} =' }, answer: 3 },
                { label: { en: '\\text{each has} =', id: '\\text{masing-masing punya} =' }, answer: 38000 },
              ],
              hints: [
                L(
                  'Let $w$ be the number of weeks. Write what Ani has after $w$ weeks and what Budi has after $w$ weeks.',
                  'Misalkan $w$ adalah banyak minggu. Tulis uang Ani setelah $w$ minggu dan uang Budi setelah $w$ minggu.',
                ),
                L(
                  'Ani: $20\\,000 + 6\\,000w$. Budi: $50\\,000 - 4\\,000w$. The amounts are equal, so put an equals sign between them.',
                  'Ani: $20\\,000 + 6\\,000w$. Budi: $50\\,000 - 4\\,000w$. Uang mereka sama, jadi beri tanda sama dengan di antaranya.',
                ),
                L(
                  'Gather $w$ on the left: $10\\,000w = 30\\,000$. Divide by 10 000 for the weeks, then put $w$ back into one side for the money.',
                  'Kumpulkan $w$ di kiri: $10\\,000w = 30\\,000$. Bagi dengan 10 000 untuk mendapat minggunya, lalu masukkan $w$ ke salah satu ruas untuk mendapat uangnya.',
                ),
              ],
              explain: L(
                '$20\\,000 + 6\\,000w = 50\\,000 - 4\\,000w$ gives $w = 3$. Ani: $20\\,000 + 18\\,000 = 38\\,000$. Budi: $50\\,000 - 12\\,000 = 38\\,000$.',
                '$20\\,000 + 6\\,000w = 50\\,000 - 4\\,000w$ memberi $w = 3$. Ani: $20\\,000 + 18\\,000 = 38\\,000$. Budi: $50\\,000 - 12\\,000 = 38\\,000$.',
              ),
              solution: ['20\\,000 + 6\\,000w = 50\\,000 - 4\\,000w', '6\\,000w + 4\\,000w = 50\\,000 - 20\\,000', '10\\,000w = 30\\,000', 'w = 3', '20\\,000 + 6\\,000 \\times 3 = 38\\,000 \\quad 50\\,000 - 4\\,000 \\times 3 = 38\\,000'],
            },
          ],
        },
        /* ------------------------------------------------ S2 L2 linear inequalities */
        {
          id: 'tka-smp-m3-s2-l2',
          title: L('Linear Inequalities in One Variable', 'Pertidaksamaan Linear Satu Variabel'),
          goal: L(
            'You can solve a linear inequality, show its solution set on a number line, and turn words like "at least" into symbols.',
            'Kamu bisa menyelesaikan pertidaksamaan linear, menunjukkan himpunan penyelesaiannya pada garis bilangan, dan mengubah kata seperti "paling sedikit" menjadi simbol.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Many Answers, Not Just One', 'Ayo Amati: Banyak Jawaban, Bukan Satu'),
              body: L(
                'A ride says: riders must be at least 120 cm tall. Many heights work: 120, 121, 130, and more. We write $h \\geq 120$. An **inequality** compares two sides with a symbol, and it usually has many solutions. All of them together are the **solution set**.\n\n| Symbol | Meaning | In words | Dot on the number line |\n|---|---|---|---|\n| $<$ | less than | fewer than, below | open |\n| $>$ | greater than | more than, above | open |\n| $\\leq$ | less than or equal to | at most, no more than | closed |\n| $\\geq$ | greater than or equal to | at least, no less than | closed |\n\nA **closed** (filled) dot means the number is included. An **open** (hollow) dot means it is not. The green stretch shows all the solutions. The picture shows $x > 2$: the number 2 itself is not a solution.',
                'Sebuah wahana berkata: penumpang harus setinggi paling sedikit 120 cm. Banyak tinggi yang cocok: 120, 121, 130, dan seterusnya. Kita tulis $h \\geq 120$. **Pertidaksamaan** membandingkan dua ruas dengan sebuah simbol, dan biasanya punya banyak penyelesaian. Semuanya bersama-sama disebut **himpunan penyelesaian**.\n\n| Simbol | Artinya | Dalam kata | Titik pada garis bilangan |\n|---|---|---|---|\n| $<$ | kurang dari | lebih sedikit dari, di bawah | kosong |\n| $>$ | lebih dari | lebih banyak dari, di atas | kosong |\n| $\\leq$ | kurang dari atau sama dengan | paling banyak, tidak lebih dari | penuh |\n| $\\geq$ | lebih dari atau sama dengan | paling sedikit, tidak kurang dari | penuh |\n\nTitik **penuh** (terisi) berarti bilangan itu termasuk. Titik **kosong** (berlubang) berarti bilangan itu tidak termasuk. Bagian hijau menunjukkan semua penyelesaian. Gambar menunjukkan $x > 2$: bilangan 2 sendiri bukan penyelesaian.',
              ),
              figure: {
                ...numberLine({ from: -2, to: 8, step: 1, marks: [{ at: 2, open: true }], shade: [2, 8] }),
                caption: L(
                  'The open dot at 2 and the green stretch to its right show x > 2.',
                  'Titik kosong di 2 dan bagian hijau di kanannya menunjukkan x > 2.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Solving and Flipping the Sign', 'Contoh Bertahap: Menyelesaikan dan Membalik Tanda'),
              body: L(
                'Solve $-2x + 3 > 11$. We solve it like an equation, with one new rule.\n\n1. Step 1: Subtract 3 from both sides: $-2x > 8$.\n2. Step 2: Divide both sides by $-2$. Dividing by a negative number **flips** the sign: $x < -4$.\n3. Step 3: Check two numbers. $x = -5$ gives $-2(-5) + 3 = 13 > 11$, which is true. $x = 0$ gives $3 > 11$, which is false.\n4. Step 4: Draw it: an open dot at $-4$ and the stretch to the left.\n\n**Remember:**\n\n- Why the flip? $2 < 5$, but $-2 > -5$: multiplying by a negative reverses the order.\n- Flip the sign only when you multiply or divide by a NEGATIVE number.\n- From $x < -4$ the greatest whole number is $-5$, because $-4$ itself is not included.',
                'Selesaikan $-2x + 3 > 11$. Kita menyelesaikannya seperti persamaan, dengan satu aturan baru.\n\n1. Langkah 1: Kurangi kedua ruas dengan 3: $-2x > 8$.\n2. Langkah 2: Bagi kedua ruas dengan $-2$. Membagi dengan bilangan negatif **membalik** tandanya: $x < -4$.\n3. Langkah 3: Periksa dua bilangan. $x = -5$ memberi $-2(-5) + 3 = 13 > 11$, yang benar. $x = 0$ memberi $3 > 11$, yang salah.\n4. Langkah 4: Gambar: titik kosong di $-4$ dan bagian ke arah kiri.\n\n**Ingat:**\n\n- Mengapa dibalik? $2 < 5$, tetapi $-2 > -5$: mengalikan dengan bilangan negatif membalik urutannya.\n- Balik tanda hanya ketika mengalikan atau membagi dengan bilangan NEGATIF.\n- Dari $x < -4$, bilangan bulat terbesarnya adalah $-5$, karena $-4$ sendiri tidak termasuk.',
              ),
              figure: {
                ...numberLine({ from: -8, to: 2, step: 1, marks: [{ at: -4, open: true }], shade: [-8, -4] }),
                caption: L('The solution set of x < -4: an open dot at -4 and a green stretch to the left.', 'Himpunan penyelesaian x < -4: titik kosong di -4 dan bagian hijau ke kiri.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Flips, Words and Dots', 'Awas, Jebakan!: Pembalikan, Kata, dan Titik'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $-3x < 12 \\Rightarrow x < -4$ (the sign was not flipped) | $x > -4$ (dividing by $-3$ flips the sign) |\n| ❌ "At most 5" written as $x < 5$ | $x \\leq 5$ ("at most" includes 5, so the dot is closed) |\n| ❌ $x \\geq 3$ drawn with an open dot | a closed dot, because 3 itself is a solution |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $-3x < 12 \\Rightarrow x < -4$ (tanda tidak dibalik) | $x > -4$ (membagi dengan $-3$ membalik tanda) |\n| ❌ "Paling banyak 5" ditulis $x < 5$ | $x \\leq 5$ ("paling banyak" mencakup 5, jadi titiknya penuh) |\n| ❌ $x \\geq 3$ digambar dengan titik kosong | titik penuh, karena 3 sendiri adalah penyelesaian |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The red dot is filled in and the green stretch goes to the left. Which inequality does the number line show?',
                'Titik merah terisi penuh dan bagian hijau menuju ke kiri. Pertidaksamaan mana yang ditunjukkan garis bilangan ini?',
              ),
              figure: {
                ...numberLine({ from: -5, to: 5, step: 1, marks: [{ at: -1 }], shade: [-5, -1] }),
                caption: L('A number line with a filled red dot and a green stretch.', 'Garis bilangan dengan titik merah penuh dan bagian hijau.'),
              },
              options: [
                L('$x \\leq -1$', '$x \\leq -1$'),
                L('$x < -1$', '$x < -1$'),
                L('$x \\geq -1$', '$x \\geq -1$'),
                L('$x > -1$', '$x > -1$'),
              ],
              answer: 0,
              explain: L(
                'The stretch goes to the left, so the numbers are smaller than $-1$. The dot is filled in, so $-1$ is included: $x \\leq -1$.',
                'Bagian hijau menuju kiri, jadi bilangannya lebih kecil dari $-1$. Titiknya penuh, jadi $-1$ termasuk: $x \\leq -1$.',
              ),
              hint: L(
                'Decide two things: which way the stretch points, and whether the dot is filled or hollow.',
                'Tentukan dua hal: ke arah mana bagian hijau menuju, dan apakah titiknya penuh atau kosong.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: solve $3x - 5 \\leq 7$. Add 5 to both sides, then divide both sides by 3. Dividing by a positive number keeps the sign.',
                'Coba bersama: selesaikan $3x - 5 \\leq 7$. Tambahkan 5 pada kedua ruas, lalu bagi kedua ruas dengan 3. Membagi dengan bilangan positif tidak mengubah tanda.',
              ),
              template: '3x - 5 \\leq 7 \\Rightarrow 3x \\leq ___ \\Rightarrow x \\leq ___',
              blanks: ['12', '4'],
              explain: L(
                '$7 + 5 = 12$ and $12 \\div 3 = 4$, so $x \\leq 4$. The sign stays $\\leq$ because 3 is positive.',
                '$7 + 5 = 12$ dan $12 \\div 3 = 4$, jadi $x \\leq 4$. Tandanya tetap $\\leq$ karena 3 positif.',
              ),
              hint: L(
                'First blank: 7 plus 5. Second blank: divide that number by 3.',
                'Kotak pertama: 7 ditambah 5. Kotak kedua: bagi bilangan itu dengan 3.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Which numbers are solutions of $2x - 1 < 7$? Choose the TWO that are.',
                'Bilangan mana yang merupakan penyelesaian $2x - 1 < 7$? Pilih DUA yang benar.',
              ),
              options: [
                L('$-2$', '$-2$'),
                L('$3$', '$3$'),
                L('$4$', '$4$'),
                L('$7$', '$7$'),
              ],
              answer: [0, 1],
              explain: L(
                'Solving gives $x < 4$. So $-2$ and $3$ work. The number 4 does not, because $2(4) - 1 = 7$ is not less than 7, and 7 is too big.',
                'Penyelesaiannya $x < 4$. Jadi $-2$ dan $3$ cocok. Bilangan 4 tidak, karena $2(4) - 1 = 7$ tidak kurang dari 7, dan 7 terlalu besar.',
              ),
              hint: L(
                'Solve the inequality first, then ask whether each number is in the solution set. Is 4 itself included?',
                'Selesaikan dulu pertidaksamaannya, lalu tanyakan apakah tiap bilangan ada di himpunan penyelesaian. Apakah 4 sendiri termasuk?',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A lift may carry at most 400 kg. Rudi weighs 60 kg and each box weighs 20 kg. Which inequality says that Rudi and $n$ boxes are allowed together?',
                'Sebuah lift boleh membawa paling banyak 400 kg. Rudi beratnya 60 kg dan setiap kotak beratnya 20 kg. Pertidaksamaan mana yang menyatakan bahwa Rudi dan $n$ kotak boleh naik bersama?',
              ),
              options: [
                L('$60 + 20n \\leq 400$', '$60 + 20n \\leq 400$'),
                L('$60 + 20n < 400$', '$60 + 20n < 400$'),
                L('$60 + 20n \\geq 400$', '$60 + 20n \\geq 400$'),
                L('$20n \\leq 400$', '$20n \\leq 400$'),
              ],
              answer: 0,
              explain: L(
                'The total weight must be at most 400, and exactly 400 is still allowed, so we use $\\leq$. The total includes Rudi, so $20n \\leq 400$ forgets his 60 kg.',
                'Berat total harus paling banyak 400, dan tepat 400 masih boleh, jadi dipakai $\\leq$. Totalnya mencakup Rudi, jadi $20n \\leq 400$ melupakan 60 kg miliknya.',
              ),
              hint: L(
                'Write the total weight first. Then ask: may it be exactly 400 kg?',
                'Tulis dulu berat totalnya. Lalu tanyakan: bolehkah tepat 400 kg?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Fitri has Rp100,000. She buys a bag for Rp35,000 and then buys $n$ notebooks at Rp6,000 each. What is the greatest whole number of notebooks she can buy? How much money (in rupiah) is left then?',
                'Fitri punya Rp100.000. Ia membeli tas seharga Rp35.000 lalu membeli $n$ buku tulis seharga Rp6.000 per buku. Berapa banyak buku tulis terbanyak (bilangan bulat) yang bisa ia beli? Berapa rupiah uang yang tersisa saat itu?',
              ),
              blanks: [
                { label: { en: '\\text{notebooks} =', id: '\\text{buku tulis} =' }, answer: 10 },
                { label: { en: '\\text{money left} =', id: '\\text{sisa uang} =' }, answer: 5000 },
              ],
              hints: [
                L(
                  'What she spends in total must be at most Rp100,000. Write what she spends with $n$ notebooks.',
                  'Total yang ia belanjakan harus paling banyak Rp100.000. Tulis berapa yang ia belanjakan untuk $n$ buku tulis.',
                ),
                L(
                  'The inequality is $35\\,000 + 6\\,000n \\leq 100\\,000$. Subtract 35 000 from both sides.',
                  'Pertidaksamaannya $35\\,000 + 6\\,000n \\leq 100\\,000$. Kurangi kedua ruas dengan 35 000.',
                ),
                L(
                  '$6\\,000n \\leq 65\\,000$. Divide both sides by 6 000. She cannot buy a part of a notebook, so take the greatest whole number that fits. The money left is 100 000 minus the total spent.',
                  '$6\\,000n \\leq 65\\,000$. Bagi kedua ruas dengan 6 000. Ia tidak bisa membeli sebagian buku, jadi ambil bilangan bulat terbesar yang memenuhi. Sisa uang adalah 100 000 dikurangi total belanja.',
                ),
              ],
              explain: L(
                '$n \\leq 65\\,000 \\div 6\\,000 \\approx 10.8$, so at most 10 notebooks. She spends $35\\,000 + 60\\,000 = 95\\,000$ and has Rp5,000 left.',
                '$n \\leq 65\\,000 \\div 6\\,000 \\approx 10{,}8$, jadi paling banyak 10 buku tulis. Ia membelanjakan $35\\,000 + 60\\,000 = 95\\,000$ dan sisanya Rp5.000.',
              ),
              solution: {
                en: ['35\\,000 + 6\\,000n \\leq 100\\,000', '6\\,000n \\leq 65\\,000', 'n \\leq 10\\text{ and a bit} \\Rightarrow n = 10', '100\\,000 - 35\\,000 - 6\\,000 \\times 10 = 5\\,000'],
                id: ['35\\,000 + 6\\,000n \\leq 100\\,000', '6\\,000n \\leq 65\\,000', 'n \\leq 10\\text{ lebih sedikit} \\Rightarrow n = 10', '100\\,000 - 35\\,000 - 6\\,000 \\times 10 = 5\\,000'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m3-s2-p',
        runtime: 'math',
        title: L('Equations and Inequalities at Work', 'Persamaan dan Pertidaksamaan di Sekitar Kita'),
        brief: L(
          'Solve equations with brackets and variables on both sides, then use an inequality to find the most or the least that a limit allows.',
          'Selesaikan persamaan dengan kurung dan variabel di kedua ruas, lalu pakai pertidaksamaan untuk mencari yang terbanyak atau tersedikit yang diizinkan suatu batas.',
        ),
        requirements: [
          L('Solve linear equations by doing the same to both sides, and check the answer.', 'Menyelesaikan persamaan linear dengan melakukan hal yang sama pada kedua ruas, dan memeriksa jawaban.'),
          L('Turn a limit in words into an inequality and read off the greatest or smallest whole number.', 'Mengubah batas dalam kata menjadi pertidaksamaan dan menentukan bilangan bulat terbesar atau terkecilnya.'),
        ],
        hints: [
          L('Write each step as its own line and say what you did to BOTH sides.', 'Tulis tiap langkah pada barisnya sendiri dan sebutkan apa yang kamu lakukan pada KEDUA ruas.'),
          L('Put your answer back into the original equation to check it.', 'Masukkan jawabanmu ke persamaan semula untuk memeriksanya.'),
          L('In an inequality, "at most" means $\\leq$ and "at least" means $\\geq$. Flip the sign only when you divide by a negative number.', 'Pada pertidaksamaan, "paling banyak" berarti $\\leq$ dan "paling sedikit" berarti $\\geq$. Balik tanda hanya saat membagi dengan bilangan negatif.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L('Solve $4x + 5 = 29$.', 'Selesaikan $4x + 5 = 29$.'),
            blanks: [{ label: 'x =', answer: 6 }],
            solution: {
              en: ['4x + 5 = 29', '4x = 24', 'x = 6', '\\text{Check: } 4 \\times 6 + 5 = 29'],
              id: ['4x + 5 = 29', '4x = 24', 'x = 6', '\\text{Periksa: } 4 \\times 6 + 5 = 29'],
            },
          },
          {
            prompt: L('Solve $3(x - 2) = 2x + 5$.', 'Selesaikan $3(x - 2) = 2x + 5$.'),
            blanks: [{ label: 'x =', answer: 11 }],
            solution: {
              en: ['3(x - 2) = 2x + 5', '3x - 6 = 2x + 5', '3x - 2x = 5 + 6', 'x = 11', '\\text{Check: } 3 \\times 9 = 27 = 2 \\times 11 + 5'],
              id: ['3(x - 2) = 2x + 5', '3x - 6 = 2x + 5', '3x - 2x = 5 + 6', 'x = 11', '\\text{Periksa: } 3 \\times 9 = 27 = 2 \\times 11 + 5'],
            },
          },
          {
            prompt: L(
              'Citra has Rp60,000. Entry to the fun fair costs Rp15,000, and each snack costs Rp5,000. What is the greatest number of snacks she can buy?',
              'Citra punya Rp60.000. Tiket masuk pasar malam Rp15.000, dan setiap jajanan Rp5.000. Berapa jajanan terbanyak yang bisa ia beli?',
            ),
            blanks: [{ label: { en: '\\text{snacks} =', id: '\\text{jajanan} =' }, answer: 9 }],
            solution: ['15\\,000 + 5\\,000n \\leq 60\\,000', '5\\,000n \\leq 45\\,000', 'n \\leq 9', 'n = 9'],
          },
          {
            prompt: L(
              'A triangle has sides $x$ cm, $(x + 3)$ cm and $(2x - 1)$ cm. Its perimeter must be at most 40 cm. Find the greatest whole number $x$ that works, and the perimeter of the triangle for that $x$.',
              'Sebuah segitiga bersisi $x$ cm, $(x + 3)$ cm, dan $(2x - 1)$ cm. Kelilingnya harus paling besar 40 cm. Tentukan bilangan bulat $x$ terbesar yang memenuhi, dan keliling segitiga untuk $x$ itu.',
            ),
            figure: {
              ...shape({ pts: [[0, 0], [6, 0], [2, 4]], sides: ['x + 3', '2x - 1', 'x'], pad: 1.4 }),
              caption: L('A triangle with its three sides written as expressions (not to scale).', 'Segitiga dengan ketiga sisinya ditulis sebagai bentuk aljabar (tidak sesuai skala).'),
            },
            blanks: [
              { label: { en: '\\text{greatest } x =', id: '\\text{terbesar: } x =' }, answer: 9 },
              { label: { en: '\\text{perimeter} =', id: '\\text{keliling} =' }, answer: 38 },
            ],
            solution: {
              en: ['x + (x + 3) + (2x - 1) \\leq 40', '4x + 2 \\leq 40', '4x \\leq 38 \\Rightarrow x \\leq 9.5', 'x = 9: \\; 4 \\times 9 + 2 = 38'],
              id: ['x + (x + 3) + (2x - 1) \\leq 40', '4x + 2 \\leq 40', '4x \\leq 38 \\Rightarrow x \\leq 9{,}5', 'x = 9: \\; 4 \\times 9 + 2 = 38'],
            },
          },
        ],
      },
    },
    /* ======================================================= S3: systems of two equations */
    {
      id: 'tka-smp-m3-s3',
      title: L('Systems of Two Linear Equations', 'Sistem Persamaan Linear Dua Variabel'),
      summary: L(
        'Two clues, two unknowns: read the solution from a graph, solve by substitution and by elimination, choose a method, and solve word problems.',
        'Dua petunjuk, dua yang tidak diketahui: membaca penyelesaian dari grafik, menyelesaikan dengan substitusi dan eliminasi, memilih metode, dan menyelesaikan soal cerita.',
      ),
      lessons: [
        /* ------------------------------------------------ S3 L1 graphs and substitution */
        {
          id: 'tka-smp-m3-s3-l1',
          title: L('Meet the System: Graphs and Substitution', 'Mengenal SPLDV: Grafik dan Substitusi'),
          goal: L(
            'You can write a system from a story, read its solution from a graph, and solve it by substitution and check it in both equations.',
            'Kamu bisa menulis sistem persamaan dari sebuah cerita, membaca penyelesaiannya dari grafik, menyelesaikannya dengan substitusi, dan memeriksanya pada kedua persamaan.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Two Unknowns, Two Clues', 'Ayo Amati: Dua yang Tidak Diketahui, Dua Petunjuk'),
              body: L(
                'Ani buys 1 pen and 1 book for Rp8,000. Budi buys 2 pens and 1 book for Rp11,000. Let $x$ be the price of a pen and $y$ the price of a book, both in thousands of rupiah, so $x = 3$ means Rp3,000.\n\n- Clue 1 (Ani): $x + y = 8$\n- Clue 2 (Budi): $2x + y = 11$\n\nTogether the two equations form a **system of linear equations in two variables**. A **solution** is a pair $(x, y)$ that makes BOTH equations true. One equation alone has many pairs, like $(1, 7)$, $(2, 6)$ and $(3, 5)$ for $x + y = 8$. Only one pair fits both clues.\n\nEach equation is a straight line. The pair that fits both lies on both lines, so it is the point where they cross. The green line is $x + y = 8$, the orange line is $2x + y = 11$, and the red dot is the solution $(3, 5)$: a pen costs Rp3,000 and a book costs Rp5,000.',
                'Ani membeli 1 pulpen dan 1 buku seharga Rp8.000. Budi membeli 2 pulpen dan 1 buku seharga Rp11.000. Misalkan $x$ harga sebuah pulpen dan $y$ harga sebuah buku, keduanya dalam ribuan rupiah, jadi $x = 3$ berarti Rp3.000.\n\n- Petunjuk 1 (Ani): $x + y = 8$\n- Petunjuk 2 (Budi): $2x + y = 11$\n\nKedua persamaan itu bersama-sama membentuk **sistem persamaan linear dua variabel**. Sebuah **penyelesaian** adalah pasangan $(x, y)$ yang membuat KEDUA persamaan benar. Satu persamaan saja punya banyak pasangan, seperti $(1, 7)$, $(2, 6)$, dan $(3, 5)$ untuk $x + y = 8$. Hanya satu pasangan yang cocok dengan kedua petunjuk.\n\nSetiap persamaan adalah sebuah garis lurus. Pasangan yang cocok dengan keduanya terletak pada kedua garis, jadi ia adalah titik tempat kedua garis berpotongan. Garis hijau adalah $x + y = 8$, garis oranye adalah $2x + y = 11$, dan titik merah adalah penyelesaiannya $(3, 5)$: sebuah pulpen Rp3.000 dan sebuah buku Rp5.000.',
              ),
              figure: {
                ...twoLines({ f1: '8-x', f2: '11-2*x', at: [3, 5], name: 'P', xSpan: [-1, 9], ySpan: [-1, 12] }),
                caption: L(
                  'Two lines cross at the red dot P, which is the point (3, 5).',
                  'Dua garis berpotongan di titik merah P, yaitu titik (3, 5).',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Substitution', 'Contoh Bertahap: Substitusi'),
              body: L(
                'Solve the same system: $x + y = 8$ and $2x + y = 11$. **Substitution** means replacing a variable by an expression that equals it.\n\n1. Step 1: Solve one equation for one variable. From $x + y = 8$ we get $y = 8 - x$.\n2. Step 2: Substitute it into the OTHER equation: $2x + (8 - x) = 11$.\n3. Step 3: Solve the one-variable equation: $2x + 8 - x = 11$, so $x + 8 = 11$ and $x = 3$.\n4. Step 4: Put $x = 3$ back into $y = 8 - x$: $y = 5$.\n5. Step 5: Check in BOTH original equations: $3 + 5 = 8$ and $2(3) + 5 = 11$. Both are true.\n\n**Remember:**\n\n- Isolate the variable that is easiest to free, usually the one with coefficient 1.\n- Put brackets around the expression you substitute.\n- The answer is a pair, and it must pass both checks.',
                'Selesaikan sistem yang sama: $x + y = 8$ dan $2x + y = 11$. **Substitusi** berarti mengganti sebuah variabel dengan bentuk yang sama nilainya.\n\n1. Langkah 1: Ubah satu persamaan menjadi bentuk untuk satu variabel. Dari $x + y = 8$ didapat $y = 8 - x$.\n2. Langkah 2: Substitusikan ke persamaan YANG LAIN: $2x + (8 - x) = 11$.\n3. Langkah 3: Selesaikan persamaan satu variabel itu: $2x + 8 - x = 11$, jadi $x + 8 = 11$ dan $x = 3$.\n4. Langkah 4: Masukkan $x = 3$ ke $y = 8 - x$: $y = 5$.\n5. Langkah 5: Periksa pada KEDUA persamaan semula: $3 + 5 = 8$ dan $2(3) + 5 = 11$. Keduanya benar.\n\n**Ingat:**\n\n- Pilih variabel yang paling mudah dibebaskan, biasanya yang berkoefisien 1.\n- Beri tanda kurung pada bentuk yang kamu substitusikan.\n- Jawabannya sepasang bilangan, dan harus lolos kedua pemeriksaan.',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Substituting and Stopping Too Soon', 'Awas, Jebakan!: Salah Substitusi dan Berhenti Terlalu Cepat'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ Put $y = 8 - x$ back into the SAME equation: $x + 8 - x = 8$, which only says $8 = 8$ | Substitute into the OTHER equation, $2x + y = 11$ |\n| ❌ $2x + (8 - x) = 11 \\Rightarrow 2x + 8 + x = 11$ (the minus sign was lost) | $2x + 8 - x = 11$, so $x + 8 = 11$ |\n| ❌ Stop at $x = 3$ and answer "3" | Find $y$ too: the solution is the pair $(3, 5)$, checked in both equations |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ Memasukkan $y = 8 - x$ kembali ke persamaan YANG SAMA: $x + 8 - x = 8$, yang hanya berkata $8 = 8$ | Substitusikan ke persamaan YANG LAIN, $2x + y = 11$ |\n| ❌ $2x + (8 - x) = 11 \\Rightarrow 2x + 8 + x = 11$ (tanda minus hilang) | $2x + 8 - x = 11$, jadi $x + 8 = 11$ |\n| ❌ Berhenti di $x = 3$ dan menjawab "3" | Cari juga $y$: penyelesaiannya pasangan $(3, 5)$, diperiksa pada kedua persamaan |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The green line is $y = x + 2$ and the orange line is $y = 6 - x$. Which pair $(x, y)$ is the solution of the system, shown by the red dot?',
                'Garis hijau adalah $y = x + 2$ dan garis oranye adalah $y = 6 - x$. Pasangan $(x, y)$ mana yang merupakan penyelesaian sistem, yang ditunjukkan titik merah?',
              ),
              figure: {
                ...twoLines({ f1: 'x+2', f2: '6-x', at: [2, 4], xSpan: [-1, 7], ySpan: [-1, 7] }),
                caption: L('Two lines and the red dot where they cross.', 'Dua garis dan titik merah tempat keduanya berpotongan.'),
              },
              options: [
                L('$(2, 4)$', '$(2, 4)$'),
                L('$(4, 2)$', '$(4, 2)$'),
                L('$(0, 2)$', '$(0, 2)$'),
                L('$(0, 6)$', '$(0, 6)$'),
              ],
              answer: 0,
              explain: L(
                'The red dot is 2 across and 4 up, so $(2, 4)$. The pair $(4, 2)$ swaps the coordinates. The pairs $(0, 2)$ and $(0, 6)$ each lie on only one of the two lines.',
                'Titik merah berjarak 2 ke kanan dan 4 ke atas, jadi $(2, 4)$. Pasangan $(4, 2)$ menukar koordinatnya. Pasangan $(0, 2)$ dan $(0, 6)$ masing-masing hanya terletak pada salah satu garis.',
              ),
              hint: L(
                'The solution lies on BOTH lines. Read how far the dot is across first, then how far up.',
                'Penyelesaian terletak pada KEDUA garis. Baca dulu jarak titik ke kanan, lalu jarak ke atas.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: solve $x + y = 10$ and $y = x + 2$. Substitute $y = x + 2$ into the first equation, then solve.',
                'Coba bersama: selesaikan $x + y = 10$ dan $y = x + 2$. Substitusikan $y = x + 2$ ke persamaan pertama, lalu selesaikan.',
              ),
              template: 'x + (x + 2) = 10 \\Rightarrow 2x = ___ \\Rightarrow x = ___',
              blanks: ['8', '4'],
              explain: L(
                '$2x + 2 = 10$, so $2x = 8$ and $x = 4$. Then $y = 4 + 2 = 6$, and $4 + 6 = 10$.',
                '$2x + 2 = 10$, jadi $2x = 8$ dan $x = 4$. Lalu $y = 4 + 2 = 6$, dan $4 + 6 = 10$.',
              ),
              hint: L(
                'Combine $x + x$ and move the 2 to the other side. Then divide by 2.',
                'Gabungkan $x + x$ dan pindahkan 2 ke ruas lain. Lalu bagi dengan 2.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L(
                'Consider the system $x + y = 9$ and $x - y = 1$. Decide whether each statement is True or False.',
                'Perhatikan sistem $x + y = 9$ dan $x - y = 1$. Tentukan apakah setiap pernyataan Benar atau Salah.',
              ),
              statements: [
                L('The pair $(5, 4)$ satisfies $x + y = 9$.', 'Pasangan $(5, 4)$ memenuhi $x + y = 9$.'),
                L('The pair $(4, 5)$ satisfies $x - y = 1$.', 'Pasangan $(4, 5)$ memenuhi $x - y = 1$.'),
                L('The pair $(5, 4)$ is the solution of the system.', 'Pasangan $(5, 4)$ adalah penyelesaian sistem.'),
                L(
                  'The pair $(4, 5)$ is a solution of the system, because it satisfies $x + y = 9$.',
                  'Pasangan $(4, 5)$ adalah penyelesaian sistem, karena memenuhi $x + y = 9$.',
                ),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$(5, 4)$: $5 + 4 = 9$ and $5 - 4 = 1$, so it fits both. $(4, 5)$: $4 - 5 = -1$, not 1. A solution must satisfy BOTH equations, not just one.',
                '$(5, 4)$: $5 + 4 = 9$ dan $5 - 4 = 1$, jadi cocok dengan keduanya. $(4, 5)$: $4 - 5 = -1$, bukan 1. Penyelesaian harus memenuhi KEDUA persamaan, bukan hanya satu.',
              ),
              hint: L(
                'Put the numbers into each equation one at a time. A pair is a solution only if it passes both.',
                'Masukkan bilangan ke tiap persamaan satu per satu. Sebuah pasangan adalah penyelesaian hanya jika lolos keduanya.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Siti buys 3 erasers and 2 pencils for Rp9,000. Eko buys 1 eraser and 4 pencils for Rp13,000. Let $x$ be the price of an eraser and $y$ the price of a pencil, in thousands of rupiah. Which system matches the story?',
                'Siti membeli 3 penghapus dan 2 pensil seharga Rp9.000. Eko membeli 1 penghapus dan 4 pensil seharga Rp13.000. Misalkan $x$ harga sebuah penghapus dan $y$ harga sebuah pensil, dalam ribuan rupiah. Sistem mana yang sesuai dengan cerita?',
              ),
              options: [
                L('$3x + 2y = 9$ and $x + 4y = 13$', '$3x + 2y = 9$ dan $x + 4y = 13$'),
                L('$2x + 3y = 9$ and $4x + y = 13$', '$2x + 3y = 9$ dan $4x + y = 13$'),
                L('$3x + 2y = 13$ and $x + 4y = 9$', '$3x + 2y = 13$ dan $x + 4y = 9$'),
                L('$3x + 2y + x + 4y = 22$', '$3x + 2y + x + 4y = 22$'),
              ],
              answer: 0,
              explain: L(
                'Each person gives one equation: the number of erasers goes with $x$, the number of pencils with $y$, and the total on the right. The other options swap the coefficients, swap the totals, or merge the two clues into one equation.',
                'Setiap orang memberi satu persamaan: banyak penghapus bersama $x$, banyak pensil bersama $y$, dan totalnya di ruas kanan. Pilihan lain menukar koefisien, menukar total, atau menggabungkan dua petunjuk menjadi satu persamaan.',
              ),
              hint: L(
                'Write one equation for Siti and one for Eko. Which variable goes with erasers?',
                'Tulis satu persamaan untuk Siti dan satu untuk Eko. Variabel mana yang menyertai penghapus?',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for solving $y = x - 1$ and $x + y = 9$ by substitution in order.', 'Urutkan langkah menyelesaikan $y = x - 1$ dan $x + y = 9$ dengan substitusi.'),
              lines: {
                en: ['y = x - 1 \\quad x + y = 9', 'x + (x - 1) = 9', '2x - 1 = 9 \\Rightarrow x = 5', 'y = 5 - 1 = 4', '\\text{Check: } 5 + 4 = 9, \\; 4 = 5 - 1'],
                id: ['y = x - 1 \\quad x + y = 9', 'x + (x - 1) = 9', '2x - 1 = 9 \\Rightarrow x = 5', 'y = 5 - 1 = 4', '\\text{Periksa: } 5 + 4 = 9, \\; 4 = 5 - 1'],
              },
              explain: L(
                'Substitute first, solve for $x$, then find $y$, and finish by checking in both equations.',
                'Substitusikan dulu, selesaikan untuk $x$, lalu cari $y$, dan akhiri dengan memeriksa pada kedua persamaan.',
              ),
              hint: L(
                'You cannot find $y$ before you know $x$, and the check comes last.',
                'Kamu tidak bisa mencari $y$ sebelum tahu $x$, dan pemeriksaan di langkah terakhir.',
              ),
            },
            {
              kind: 'fill',
              id: 'u1',
              math: true,
              prompt: L(
                'Try it together: the system $ax+3y=11$ and $2x-by=5$ has the solution $(x,y)=(4,1)$. Put $x=4$ and $y=1$ into each equation to find the unknown coefficients $a$ and $b$.',
                'Coba bersama: sistem $ax+3y=11$ dan $2x-by=5$ mempunyai penyelesaian $(x,y)=(4,1)$. Masukkan $x=4$ dan $y=1$ ke tiap persamaan untuk mencari koefisien $a$ dan $b$ yang belum diketahui.',
              ),
              template: 'a\\times4+3\\times1=11 \\Rightarrow 4a=___ \\Rightarrow a=___ \\quad 2\\times4-b\\times1=5 \\Rightarrow b=___',
              blanks: ['8', '2', '3'],
              explain: L(
                'A solution makes both equations true. First equation: $4a+3=11$, so $4a=8$ and $a=2$. Second equation: $8-b=5$, so $b=3$. Check: $2\\times4+3\\times1=11$ and $2\\times4-3\\times1=5$.',
                'Penyelesaian membuat kedua persamaan benar. Persamaan pertama: $4a+3=11$, jadi $4a=8$ dan $a=2$. Persamaan kedua: $8-b=5$, jadi $b=3$. Periksa: $2\\times4+3\\times1=11$ dan $2\\times4-3\\times1=5$.',
              ),
              hint: L(
                'Replace $x$ by 4 and $y$ by 1 in each equation. Each equation then has only ONE unknown left, so solve them one at a time.',
                'Ganti $x$ dengan 4 dan $y$ dengan 1 pada tiap persamaan. Setiap persamaan lalu hanya punya SATU yang belum diketahui, jadi selesaikan satu per satu.',
              ),
            },
            {
              kind: 'judge',
              id: 'u2',
              prompt: L(
                'The system $ax+4y=7$ and $x+by=11$ has the solution $(x,y)=(3,-2)$. Decide whether each statement is True or False.',
                'Sistem $ax+4y=7$ dan $x+by=11$ mempunyai penyelesaian $(x,y)=(3,-2)$. Tentukan apakah setiap pernyataan Benar atau Salah.',
              ),
              statements: [
                L('$a$ is a prime number.', '$a$ adalah bilangan prima.'),
                L('$b$ is an odd number.', '$b$ adalah bilangan ganjil.'),
                L('$2a+b=6$.', '$2a+b=6$.'),
                L('$a\\times b=20$.', '$a\\times b=20$.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'Substitute $x=3$ and $y=-2$. First equation: $3a-8=7$, so $3a=15$ and $a=5$, which is prime. Second equation: $3-2b=11$, so $-2b=8$ and $b=-4$, which is even. Then $2a+b=10-4=6$ is true, and $a\\times b=5\\times(-4)=-20$, not 20.',
                'Substitusikan $x=3$ dan $y=-2$. Persamaan pertama: $3a-8=7$, jadi $3a=15$ dan $a=5$, yang prima. Persamaan kedua: $3-2b=11$, jadi $-2b=8$ dan $b=-4$, yang genap. Maka $2a+b=10-4=6$ benar, dan $a\\times b=5\\times(-4)=-20$, bukan 20.',
              ),
              hint: L(
                'Do not solve the whole system. Put the given $x$ and $y$ into each equation, find $a$ and $b$, then test every statement with those numbers.',
                'Jangan selesaikan seluruh sistem. Masukkan $x$ dan $y$ yang diketahui ke tiap persamaan, cari $a$ dan $b$, lalu uji setiap pernyataan dengan bilangan itu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A notebook costs Rp2,000 more than a pen. Rudi buys 2 pens and 3 notebooks and pays Rp26,000. Let $x$ be the price of a pen and $y$ the price of a notebook, in thousands of rupiah. Find $x$ and $y$.',
                'Sebuah buku tulis harganya Rp2.000 lebih mahal daripada sebuah pulpen. Rudi membeli 2 pulpen dan 3 buku tulis dan membayar Rp26.000. Misalkan $x$ harga sebuah pulpen dan $y$ harga sebuah buku tulis, dalam ribuan rupiah. Tentukan $x$ dan $y$.',
              ),
              inline: true,
              blanks: xy(4, 6),
              hints: [
                L(
                  'Write two equations: one for "2,000 more" and one for the total Rudi pays.',
                  'Tulis dua persamaan: satu untuk "lebih mahal 2.000" dan satu untuk total yang Rudi bayar.',
                ),
                L(
                  'The system is $y = x + 2$ and $2x + 3y = 26$. The first equation already has $y$ alone, so substitute it into the second.',
                  'Sistemnya $y = x + 2$ dan $2x + 3y = 26$. Persamaan pertama sudah punya $y$ sendirian, jadi substitusikan ke persamaan kedua.',
                ),
                L(
                  '$2x + 3(x + 2) = 26$. Expand the bracket and solve for $x$, then find $y = x + 2$. Check in both equations.',
                  '$2x + 3(x + 2) = 26$. Uraikan kurungnya dan selesaikan untuk $x$, lalu cari $y = x + 2$. Periksa pada kedua persamaan.',
                ),
              ],
              explain: L(
                '$2x + 3(x + 2) = 26$ gives $5x + 6 = 26$, so $x = 4$ and $y = 6$. Check: $2(4) + 3(6) = 26$ and $6 = 4 + 2$. A pen costs Rp4,000 and a notebook Rp6,000.',
                '$2x + 3(x + 2) = 26$ memberi $5x + 6 = 26$, jadi $x = 4$ dan $y = 6$. Periksa: $2(4) + 3(6) = 26$ dan $6 = 4 + 2$. Pulpen Rp4.000 dan buku tulis Rp6.000.',
              ),
              solution: {
                en: ['y = x + 2 \\quad 2x + 3y = 26', '2x + 3(x + 2) = 26', '5x + 6 = 26', '5x = 20 \\Rightarrow x = 4', 'y = 4 + 2 = 6', '\\text{Check: } 2(4) + 3(6) = 26'],
                id: ['y = x + 2 \\quad 2x + 3y = 26', '2x + 3(x + 2) = 26', '5x + 6 = 26', '5x = 20 \\Rightarrow x = 4', 'y = 4 + 2 = 6', '\\text{Periksa: } 2(4) + 3(6) = 26'],
              },
            },
          ],
        },
        /* ------------------------------------------------ S3 L2 elimination and word problems */
        {
          id: 'tka-smp-m3-s3-l2',
          title: L('Elimination and Word Problems', 'Eliminasi dan Soal Cerita'),
          goal: L(
            'You can solve a system by elimination, choose the quicker method, and solve word problems about prices, ages, coins and tickets.',
            'Kamu bisa menyelesaikan sistem dengan eliminasi, memilih metode yang lebih cepat, dan menyelesaikan soal cerita tentang harga, umur, koin, dan tiket.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Make One Unknown Disappear', 'Ayo Amati: Hilangkan Salah Satu yang Tidak Diketahui'),
              body: L(
                'Dewi buys 3 apples and 2 oranges for Rp12,000. Eko buys 1 apple and 2 oranges for Rp8,000. Both baskets hold 2 oranges, so the only difference is 2 apples. The price difference is Rp4,000, so one apple costs Rp2,000.\n\nThis is **elimination**: combine the two equations so that one variable disappears. With $x$ for an apple and $y$ for an orange, in thousands of rupiah:\n\n- Clue 1: $3x + 2y = 12$\n- Clue 2: $x + 2y = 8$\n\nSubtract clue 2 from clue 1: $(3x + 2y) - (x + 2y) = 12 - 8$, so $2x = 4$ and $x = 2$. Then $2 + 2y = 8$ gives $y = 3$.\n\nThe picture lines up the two baskets. Green tiles are $x$ and orange tiles are $y$.',
                'Dewi membeli 3 apel dan 2 jeruk seharga Rp12.000. Eko membeli 1 apel dan 2 jeruk seharga Rp8.000. Kedua keranjang berisi 2 jeruk, jadi satu-satunya beda adalah 2 apel. Selisih harganya Rp4.000, jadi satu apel Rp2.000.\n\nInilah **eliminasi**: gabungkan kedua persamaan supaya satu variabel hilang. Dengan $x$ untuk apel dan $y$ untuk jeruk, dalam ribuan rupiah:\n\n- Petunjuk 1: $3x + 2y = 12$\n- Petunjuk 2: $x + 2y = 8$\n\nKurangkan petunjuk 2 dari petunjuk 1: $(3x + 2y) - (x + 2y) = 12 - 8$, jadi $2x = 4$ dan $x = 2$. Lalu $2 + 2y = 8$ memberi $y = 3$.\n\nGambar menyejajarkan kedua keranjang. Ubin hijau adalah $x$ dan ubin oranye adalah $y$.',
              ),
              figure: {
                ...tileRows([
                  { label: '3x + 2y', tiles: [['x', 3], ['y', 2]], after: '= 12' },
                  { label: 'x + 2y', tiles: [['x', 1], ['y', 2]], after: '= 8' },
                ]),
                caption: L(
                  'Both rows have two orange tiles, so the difference is two green tiles.',
                  'Kedua baris punya dua ubin oranye, jadi selisihnya adalah dua ubin hijau.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: When the Coefficients Do Not Match', 'Contoh Bertahap: Ketika Koefisien Belum Sama'),
              body: L(
                'Solve $2x + 3y = 13$ and $3x - y = 3$.\n\n1. Step 1: To eliminate $y$, multiply the second equation by 3 so the $y$ coefficients match: $9x - 3y = 9$. Multiply EVERY term, including the right side.\n2. Step 2: The $y$ terms are $+3y$ and $-3y$, so ADD the equations: $11x = 22$.\n3. Step 3: Divide both sides by 11: $x = 2$.\n4. Step 4: Substitute into $3x - y = 3$: $6 - y = 3$, so $y = 3$.\n5. Step 5: Check in both: $2(2) + 3(3) = 13$ and $3(2) - 3 = 3$.\n\n**Remember:**\n\n- Same signs on the matching terms: subtract the equations. Opposite signs: add them.\n- Multiply EVERY term of an equation, including the right side.\n- If one variable is already alone, substitution is quicker. If both equations look like $ax + by = c$, elimination is quicker.',
                'Selesaikan $2x + 3y = 13$ dan $3x - y = 3$.\n\n1. Langkah 1: Untuk menghilangkan $y$, kalikan persamaan kedua dengan 3 supaya koefisien $y$ sama: $9x - 3y = 9$. Kalikan SETIAP suku, termasuk ruas kanan.\n2. Langkah 2: Suku $y$-nya $+3y$ dan $-3y$, jadi JUMLAHKAN kedua persamaan: $11x = 22$.\n3. Langkah 3: Bagi kedua ruas dengan 11: $x = 2$.\n4. Langkah 4: Substitusikan ke $3x - y = 3$: $6 - y = 3$, jadi $y = 3$.\n5. Langkah 5: Periksa pada keduanya: $2(2) + 3(3) = 13$ dan $3(2) - 3 = 3$.\n\n**Ingat:**\n\n- Tanda sama pada suku yang cocok: kurangkan persamaannya. Tanda berlawanan: jumlahkan.\n- Kalikan SETIAP suku suatu persamaan, termasuk ruas kanan.\n- Jika satu variabel sudah sendirian, substitusi lebih cepat. Jika kedua persamaan berbentuk $ax + by = c$, eliminasi lebih cepat.',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Signs, Right Sides and Parallel Lines', 'Awas, Jebakan!: Tanda, Ruas Kanan, dan Garis Sejajar'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| ❌ $(3x + 2y) - (x + 2y) = 2x + 4y$ (the sign of $2y$ was not reversed) | $2x + 0y = 2x$: the $y$ terms cancel |\n| ❌ $3x - y = 3 \\Rightarrow 9x - 3y = 3$ (only the left side was multiplied) | $9x - 3y = 9$ (multiply the right side too) |\n| ❌ Find $x = 2$ and stop | Find $y$ as well and write the pair $(2, 3)$ |\n\n**A special case.** If the two lines are parallel, they never meet, so the system has **no solution**. In the picture, $y = x + 1$ (green) and $y = x + 3$ (orange) run side by side. Elimination ends with something false, like $0 = 2$.',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| ❌ $(3x + 2y) - (x + 2y) = 2x + 4y$ (tanda $2y$ tidak dibalik) | $2x + 0y = 2x$: suku $y$ saling menghapus |\n| ❌ $3x - y = 3 \\Rightarrow 9x - 3y = 3$ (hanya ruas kiri yang dikali) | $9x - 3y = 9$ (ruas kanan juga dikali) |\n| ❌ Menemukan $x = 2$ lalu berhenti | Cari juga $y$ dan tulis pasangan $(2, 3)$ |\n\n**Kasus khusus.** Jika kedua garis sejajar, keduanya tidak pernah bertemu, jadi sistemnya **tidak punya penyelesaian**. Pada gambar, $y = x + 1$ (hijau) dan $y = x + 3$ (oranye) berjalan berdampingan. Eliminasi berakhir dengan sesuatu yang salah, misalnya $0 = 2$.',
              ),
              figure: {
                ...twoLines({ f1: 'x+1', f2: 'x+3', xSpan: [-4, 4], ySpan: [-3, 7] }),
                caption: L('Two parallel lines: they never cross, so there is no solution.', 'Dua garis sejajar: keduanya tidak pernah berpotongan, jadi tidak ada penyelesaian.'),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'For $4x + 3y = 22$ and $4x + y = 10$, what do you get by subtracting the second equation from the first?',
                'Untuk $4x + 3y = 22$ dan $4x + y = 10$, apa yang kamu dapat dengan mengurangkan persamaan kedua dari persamaan pertama?',
              ),
              figure: {
                ...tileRows([
                  { label: '4x + 3y', tiles: [['x', 4], ['y', 3]], after: '= 22' },
                  { label: '4x + y', tiles: [['x', 4], ['y', 1]], after: '= 10' },
                ]),
                caption: L(
                  'Both rows have four green tiles. Green tiles are x and orange tiles are y.',
                  'Kedua baris punya empat ubin hijau. Ubin hijau adalah x dan ubin oranye adalah y.',
                ),
              },
              options: [
                L('$2y = 12$', '$2y = 12$'),
                L('$2y = 32$', '$2y = 32$'),
                L('$8x + 4y = 32$', '$8x + 4y = 32$'),
                L('$4y = 12$', '$4y = 12$'),
              ],
              answer: 0,
              explain: L(
                '$4x - 4x = 0$, $3y - y = 2y$ and $22 - 10 = 12$, so $2y = 12$. The options $2y = 32$ and $8x + 4y = 32$ come from adding, and $4y = 12$ adds the $y$ terms but subtracts the numbers.',
                '$4x - 4x = 0$, $3y - y = 2y$, dan $22 - 10 = 12$, jadi $2y = 12$. Pilihan $2y = 32$ dan $8x + 4y = 32$ berasal dari menjumlahkan, dan $4y = 12$ menjumlahkan suku $y$ tetapi mengurangkan bilangannya.',
              ),
              hint: L(
                'Subtract left side from left side and right side from right side, term by term.',
                'Kurangkan ruas kiri dengan ruas kiri dan ruas kanan dengan ruas kanan, suku demi suku.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: solve $5x + y = 17$ and $2x + y = 8$. Subtract the second equation from the first so $y$ disappears.',
                'Coba bersama: selesaikan $5x + y = 17$ dan $2x + y = 8$. Kurangkan persamaan kedua dari persamaan pertama sehingga $y$ hilang.',
              ),
              template: '3x = ___ \\Rightarrow x = ___',
              blanks: ['9', '3'],
              explain: L(
                '$17 - 8 = 9$, so $3x = 9$ and $x = 3$. Then $6 + y = 8$ gives $y = 2$, and $15 + 2 = 17$.',
                '$17 - 8 = 9$, jadi $3x = 9$ dan $x = 3$. Lalu $6 + y = 8$ memberi $y = 2$, dan $15 + 2 = 17$.',
              ),
              hint: L(
                'The $x$ part is $5x - 2x$. The right side is 17 minus 8.',
                'Bagian $x$ adalah $5x - 2x$. Ruas kanannya 17 dikurangi 8.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L(
                  'To eliminate $y$ from $2x + 3y = 7$ and $4x - 3y = 5$, add the equations.',
                  'Untuk menghilangkan $y$ dari $2x + 3y = 7$ dan $4x - 3y = 5$, jumlahkan persamaannya.',
                ),
                L(
                  'To eliminate $x$ from $3x + y = 10$ and $3x - y = 2$, add the equations.',
                  'Untuk menghilangkan $x$ dari $3x + y = 10$ dan $3x - y = 2$, jumlahkan persamaannya.',
                ),
                L(
                  'When you multiply an equation by 3, you must also multiply its right side by 3.',
                  'Ketika kamu mengalikan suatu persamaan dengan 3, ruas kanannya juga harus dikali 3.',
                ),
                L(
                  'A system whose two lines are parallel has exactly one solution.',
                  'Sistem yang kedua garisnya sejajar punya tepat satu penyelesaian.',
                ),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The $y$ terms $+3y$ and $-3y$ cancel when added. The $x$ terms $3x$ and $3x$ cancel only when SUBTRACTED. Multiplying must be done to every term, both sides included. Parallel lines never meet, so there is no solution.',
                'Suku $y$ yaitu $+3y$ dan $-3y$ saling menghapus saat dijumlahkan. Suku $x$ yaitu $3x$ dan $3x$ hanya saling menghapus saat DIKURANGKAN. Perkalian harus dilakukan pada setiap suku, kedua ruas. Garis sejajar tidak pernah bertemu, jadi tidak ada penyelesaian.',
              ),
              hint: L(
                'For each pair, look at the signs of the matching terms: same signs need subtracting, opposite signs need adding.',
                'Untuk tiap pasangan, lihat tanda suku yang cocok: tanda sama perlu dikurangkan, tanda berlawanan perlu dijumlahkan.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Which method is the quickest start for $x = 2y + 1$ and $3x + 4y = 13$?',
                'Metode mana yang paling cepat untuk memulai $x = 2y + 1$ dan $3x + 4y = 13$?',
              ),
              options: [
                L('Substitute $x = 2y + 1$ into the second equation, because $x$ is already alone', 'Substitusikan $x = 2y + 1$ ke persamaan kedua, karena $x$ sudah sendirian'),
                L('Add the two equations as they are, because adding always removes a variable', 'Jumlahkan kedua persamaan apa adanya, karena menjumlahkan selalu menghilangkan satu variabel'),
                L('Subtract the two equations as they are, because the coefficients are equal', 'Kurangkan kedua persamaan apa adanya, karena koefisiennya sama'),
                L('Neither method works, because the equations are not both in the form $ax + by = c$', 'Tidak ada metode yang bisa dipakai, karena kedua persamaan tidak berbentuk $ax + by = c$'),
              ],
              answer: 0,
              explain: L(
                'Since $x$ is already alone, substitution gives $3(2y + 1) + 4y = 13$ at once. Adding or subtracting removes a variable only when the coefficients match or are opposite, and here they do not.',
                'Karena $x$ sudah sendirian, substitusi langsung memberi $3(2y + 1) + 4y = 13$. Menjumlahkan atau mengurangkan hanya menghilangkan variabel jika koefisiennya sama atau berlawanan, dan di sini tidak.',
              ),
              hint: L(
                'Look for a variable that is already written alone on one side.',
                'Cari variabel yang sudah tertulis sendirian di salah satu ruas.',
              ),
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: L('Put the steps for solving $x + 2y = 11$ and $x - y = 2$ by elimination in order.', 'Urutkan langkah menyelesaikan $x + 2y = 11$ dan $x - y = 2$ dengan eliminasi.'),
              lines: {
                en: ['x + 2y = 11 \\quad x - y = 2', '(x + 2y) - (x - y) = 11 - 2 \\Rightarrow 3y = 9', 'y = 3', 'x - 3 = 2 \\Rightarrow x = 5', '\\text{Check: } 5 + 6 = 11, \\; 5 - 3 = 2'],
                id: ['x + 2y = 11 \\quad x - y = 2', '(x + 2y) - (x - y) = 11 - 2 \\Rightarrow 3y = 9', 'y = 3', 'x - 3 = 2 \\Rightarrow x = 5', '\\text{Periksa: } 5 + 6 = 11, \\; 5 - 3 = 2'],
              },
              explain: L(
                'Eliminate one variable first, solve for the other, substitute back, then check in both equations.',
                'Hilangkan dulu satu variabel, selesaikan variabel lainnya, substitusikan kembali, lalu periksa pada kedua persamaan.',
              ),
              hint: L(
                'The remaining variable can only be found after the two equations are combined.',
                'Variabel yang tersisa baru bisa dicari setelah kedua persamaan dikombinasikan.',
              ),
            },
            {
              kind: 'quiz',
              id: 'v1',
              prompt: L(
                'A school play sells 120 tickets in all. An adult ticket costs Rp25,000 and a child ticket costs Rp15,000, and the takings are Rp2,400,000. Let $x$ be the number of adult tickets and $y$ the number of child tickets. Money is counted in thousands of rupiah. Which system matches the story?',
                'Sebuah pentas sekolah menjual 120 tiket seluruhnya. Tiket dewasa harganya Rp25.000 dan tiket anak Rp15.000, dan hasil penjualannya Rp2.400.000. Misalkan $x$ banyak tiket dewasa dan $y$ banyak tiket anak. Uang dihitung dalam ribuan rupiah. Sistem mana yang sesuai dengan cerita?',
              ),
              options: [
                L('$x+y=120$ and $25x+15y=2\\,400$', '$x+y=120$ dan $25x+15y=2\\,400$'),
                L('$x+y=120$ and $15x+25y=2\\,400$', '$x+y=120$ dan $15x+25y=2\\,400$'),
                L('$x+y=2\\,400$ and $25x+15y=120$', '$x+y=2\\,400$ dan $25x+15y=120$'),
                L('$40(x+y)=2\\,400$', '$40(x+y)=2\\,400$'),
              ],
              answer: 0,
              explain: L(
                'One equation counts the tickets, $x+y=120$, and the other counts the money: each adult ticket brings 25 and each child ticket brings 15, so $25x+15y=2\\,400$. Wrong systems swap the two prices, swap the two totals, or treat every ticket as costing 40, which merges the two clues into one.',
                'Satu persamaan menghitung tiket, $x+y=120$, dan yang lain menghitung uang: tiap tiket dewasa membawa 25 dan tiap tiket anak membawa 15, jadi $25x+15y=2\\,400$. Sistem yang salah menukar kedua harga, menukar kedua total, atau menganggap setiap tiket berharga 40, yang menggabungkan dua petunjuk menjadi satu.',
              ),
              hint: L(
                'There are two different totals in the story: a number of tickets and an amount of money. Each total needs its own equation, with the right coefficients.',
                'Ada dua total yang berbeda dalam cerita: banyak tiket dan jumlah uang. Setiap total memerlukan persamaannya sendiri, dengan koefisien yang tepat.',
              ),
            },
            {
              kind: 'judge',
              id: 'v2',
              prompt: L(
                'Decide whether each statement about the quicker way to solve a system is True or False.',
                'Tentukan apakah setiap pernyataan tentang cara yang lebih cepat untuk menyelesaikan suatu sistem Benar atau Salah.',
              ),
              statements: [
                L('For $y=3x-2$ and $4x+y=19$, substitution is quicker than elimination.', 'Untuk $y=3x-2$ dan $4x+y=19$, substitusi lebih cepat daripada eliminasi.'),
                L('For $2x+5y=26$ and $2x+y=10$, subtracting the two equations is quicker than substitution.', 'Untuk $2x+5y=26$ dan $2x+y=10$, mengurangkan kedua persamaan lebih cepat daripada substitusi.'),
                L('For $y=2x+1$ and $3x+2y=16$, elimination is the only method that works.', 'Untuk $y=2x+1$ dan $3x+2y=16$, eliminasi adalah satu-satunya metode yang bisa dipakai.'),
                L('For $3x+2y=16$ and $3x-2y=8$, adding the two equations removes $x$.', 'Untuk $3x+2y=16$ dan $3x-2y=8$, menjumlahkan kedua persamaan menghilangkan $x$.'),
              ],
              answer: [true, true, false, false],
              explain: L(
                'In the first system $y$ is already alone, so substituting gives $4x+3x-2=19$ at once. In the second, the $x$ terms are equal, so subtracting leaves $4y=16$. In the third, substitution also works: $3x+2(2x+1)=16$ gives $x=2$. In the fourth, adding gives $6x=24$: the $y$ terms cancel, not the $x$ terms.',
                'Pada sistem pertama $y$ sudah sendirian, jadi substitusi langsung memberi $4x+3x-2=19$. Pada sistem kedua, suku $x$ sama, jadi pengurangan menyisakan $4y=16$. Pada sistem ketiga, substitusi juga bisa: $3x+2(2x+1)=16$ memberi $x=2$. Pada sistem keempat, penjumlahan memberi $6x=24$: suku $y$ yang saling menghapus, bukan suku $x$.',
              ),
              hint: L(
                'For each system look for a variable that is alone, or for two terms that are equal or opposite. That tells you the quickest start.',
                'Untuk tiap sistem, cari variabel yang sudah sendirian, atau dua suku yang sama atau berlawanan. Itu menunjukkan cara memulai yang paling cepat.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'At a zoo, Mr. Joko pays Rp54,000 for 2 adult tickets and 3 child tickets. Mrs. Dewi pays Rp61,000 for 3 adult tickets and 2 child tickets. Let $x$ be the price of an adult ticket and $y$ the price of a child ticket, in thousands of rupiah. Find $x$ and $y$.',
                'Di sebuah kebun binatang, Pak Joko membayar Rp54.000 untuk 2 tiket dewasa dan 3 tiket anak. Bu Dewi membayar Rp61.000 untuk 3 tiket dewasa dan 2 tiket anak. Misalkan $x$ harga tiket dewasa dan $y$ harga tiket anak, dalam ribuan rupiah. Tentukan $x$ dan $y$.',
              ),
              inline: true,
              blanks: xy(15, 8),
              hints: [
                L(
                  'Write one equation for each family, with the numbers of tickets as coefficients.',
                  'Tulis satu persamaan untuk setiap keluarga, dengan banyak tiket sebagai koefisien.',
                ),
                L(
                  'The system is $2x + 3y = 54$ and $3x + 2y = 61$. Make the $x$ coefficients match: multiply the first equation by 3 and the second by 2.',
                  'Sistemnya $2x + 3y = 54$ dan $3x + 2y = 61$. Samakan koefisien $x$: kalikan persamaan pertama dengan 3 dan persamaan kedua dengan 2.',
                ),
                L(
                  'You get $6x + 9y = 162$ and $6x + 4y = 122$. Subtract to remove $x$, solve for $y$, then substitute to find $x$.',
                  'Kamu mendapat $6x + 9y = 162$ dan $6x + 4y = 122$. Kurangkan untuk menghilangkan $x$, selesaikan untuk $y$, lalu substitusikan untuk mencari $x$.',
                ),
              ],
              explain: L(
                'Subtracting gives $5y = 40$, so $y = 8$. Then $2x + 24 = 54$ gives $x = 15$. Check: $3(15) + 2(8) = 61$. An adult ticket is Rp15,000 and a child ticket Rp8,000.',
                'Pengurangan memberi $5y = 40$, jadi $y = 8$. Lalu $2x + 24 = 54$ memberi $x = 15$. Periksa: $3(15) + 2(8) = 61$. Tiket dewasa Rp15.000 dan tiket anak Rp8.000.',
              ),
              solution: {
                en: ['2x + 3y = 54 \\;(\\times 3) \\Rightarrow 6x + 9y = 162', '3x + 2y = 61 \\;(\\times 2) \\Rightarrow 6x + 4y = 122', '(6x + 9y) - (6x + 4y) = 162 - 122 \\Rightarrow 5y = 40', 'y = 8', '2x + 3 \\times 8 = 54 \\Rightarrow 2x = 30 \\Rightarrow x = 15', '\\text{Check: } 3 \\times 15 + 2 \\times 8 = 61'],
                id: ['2x + 3y = 54 \\;(\\times 3) \\Rightarrow 6x + 9y = 162', '3x + 2y = 61 \\;(\\times 2) \\Rightarrow 6x + 4y = 122', '(6x + 9y) - (6x + 4y) = 162 - 122 \\Rightarrow 5y = 40', 'y = 8', '2x + 3 \\times 8 = 54 \\Rightarrow 2x = 30 \\Rightarrow x = 15', '\\text{Periksa: } 3 \\times 15 + 2 \\times 8 = 61'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m3-s3-p',
        runtime: 'math',
        title: L('Solve the System', 'Menyelesaikan Sistem Persamaan'),
        brief: L(
          'Read a solution from a graph, find unknown coefficients from a given solution, and use a system for coins and ages.',
          'Baca penyelesaian dari grafik, cari koefisien yang belum diketahui dari penyelesaian yang diberikan, dan pakai sistem persamaan untuk koin dan umur.',
        ),
        requirements: [
          L('Solve a system of two linear equations by substitution, elimination, or by finding unknown coefficients.', 'Menyelesaikan sistem dua persamaan linear dengan substitusi, eliminasi, atau dengan mencari koefisien yang belum diketahui.'),
          L('Write a system from a story and check the pair in both equations.', 'Menulis sistem persamaan dari sebuah cerita dan memeriksa pasangannya pada kedua persamaan.'),
        ],
        hints: [
          L('Name the two unknowns first, and write one equation for each clue.', 'Namai dulu kedua yang tidak diketahui, dan tulis satu persamaan untuk setiap petunjuk.'),
          L('Use substitution when a variable is alone, and elimination when both equations look like $ax + by = c$.', 'Pakai substitusi jika sebuah variabel sudah sendirian, dan eliminasi jika kedua persamaan berbentuk $ax + by = c$.'),
          L('Always check the pair in BOTH original equations.', 'Selalu periksa pasangannya pada KEDUA persamaan semula.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'The green line is $y = x + 1$ and the orange line is $y = 5 - x$. Read the solution of the system from the red dot.',
              'Garis hijau adalah $y = x + 1$ dan garis oranye adalah $y = 5 - x$. Baca penyelesaian sistem dari titik merah.',
            ),
            figure: {
              ...twoLines({ f1: 'x+1', f2: '5-x', at: [2, 3], xSpan: [-1, 7], ySpan: [-1, 7] }),
              caption: L('Two lines cross at the red dot.', 'Dua garis berpotongan di titik merah.'),
            },
            inline: true,
            blanks: xy(2, 3),
            solution: {
              en: ['\\text{The red dot is 2 across and 3 up: } (2, 3)', '3 = 2 + 1 \\quad 3 = 5 - 2'],
              id: ['\\text{Titik merah 2 ke kanan dan 3 ke atas: } (2, 3)', '3 = 2 + 1 \\quad 3 = 5 - 2'],
            },
          },
          {
            prompt: L(
              'The system $ax + 5y = 3$ and $3x + by = 1$ has the solution $(x, y) = (-1, 2)$. Find the coefficients $a$ and $b$.',
              'Sistem $ax + 5y = 3$ dan $3x + by = 1$ mempunyai penyelesaian $(x, y) = (-1, 2)$. Tentukan koefisien $a$ dan $b$.',
            ),
            inline: true,
            blanks: [
              { label: 'a =', answer: 7 },
              { label: 'b =', answer: 2 },
            ],
            solution: {
              en: ['a(-1) + 5(2) = 3 \\Rightarrow -a + 10 = 3 \\Rightarrow a = 7', '3(-1) + b(2) = 1 \\Rightarrow -3 + 2b = 1 \\Rightarrow 2b = 4 \\Rightarrow b = 2', '\\text{Check: } 7(-1) + 5(2) = 3 \\quad 3(-1) + 2(2) = 1'],
              id: ['a(-1) + 5(2) = 3 \\Rightarrow -a + 10 = 3 \\Rightarrow a = 7', '3(-1) + b(2) = 1 \\Rightarrow -3 + 2b = 1 \\Rightarrow 2b = 4 \\Rightarrow b = 2', '\\text{Periksa: } 7(-1) + 5(2) = 3 \\quad 3(-1) + 2(2) = 1'],
            },
          },
          {
            prompt: L(
              'Gita has 12 coins, all of Rp500 or Rp1,000, worth Rp8,000 in total. How many coins of each kind does she have?',
              'Gita punya 12 koin, semuanya Rp500 atau Rp1.000, dengan nilai total Rp8.000. Berapa koin dari tiap jenis yang ia punya?',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{Rp500 coins} =', id: '\\text{koin Rp500} =' }, answer: 8 },
              { label: { en: '\\text{Rp1,000 coins} =', id: '\\text{koin Rp1.000} =' }, answer: 4 },
            ],
            solution: {
              en: ['a + b = 12 \\quad 500a + 1\\,000b = 8\\,000', 'a + 2b = 16', '(a + 2b) - (a + b) = 16 - 12 \\Rightarrow b = 4', 'a = 12 - 4 = 8', '\\text{Check: } 500 \\times 8 + 1\\,000 \\times 4 = 8\\,000'],
              id: ['a + b = 12 \\quad 500a + 1\\,000b = 8\\,000', 'a + 2b = 16', '(a + 2b) - (a + b) = 16 - 12 \\Rightarrow b = 4', 'a = 12 - 4 = 8', '\\text{Periksa: } 500 \\times 8 + 1\\,000 \\times 4 = 8\\,000'],
            },
          },
          {
            prompt: L(
              'Fitri is 3 times as old as her sister. In 4 years, the sum of their ages will be 32. How old are they now?',
              'Umur Fitri 3 kali umur adiknya. Empat tahun lagi, jumlah umur mereka 32. Berapa umur mereka sekarang?',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{sister} =', id: '\\text{adik} =' }, answer: 6 },
              { label: { en: '\\text{Fitri} =', id: '\\text{Fitri} =' }, answer: 18 },
            ],
            solution: {
              en: ['f = 3s \\quad (f + 4) + (s + 4) = 32', '3s + 4 + s + 4 = 32 \\Rightarrow 4s = 24 \\Rightarrow s = 6', 'f = 3 \\times 6 = 18', '\\text{Check: } 22 + 10 = 32'],
              id: ['f = 3s \\quad (f + 4) + (s + 4) = 32', '3s + 4 + s + 4 = 32 \\Rightarrow 4s = 24 \\Rightarrow s = 6', 'f = 3 \\times 6 = 18', '\\text{Periksa: } 22 + 10 = 32'],
            },
          },
        ],
      },
    },
  ],
}
