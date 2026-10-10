import type { Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import { fit, gridRect, line, numberLine, outline, rectPts, solid, txt, ellipsePts } from './figs'
import type { Piece, Pt } from './figs'

/* ------------------------------------------------------------------ local drawing helpers */

/** Several grids of unit squares stacked on top of each other (bottom one first),
 *  each fully shaded, so the different rectangles that make the same number of
 *  tiles can be compared at a glance. `dims` = [bottom label, left label]. */
function gridStack(specs: { cols: number; rows: number; color: FigColor; dims: [string, string] }[]): Piece {
  const items: FigItem[] = []
  let y0 = 0
  let w = 0
  for (const s of specs) {
    const g = gridRect({ cols: s.cols, rows: s.rows, shade: s.cols * s.rows, dims: s.dims, color: s.color })
    for (const it of g.items) {
      if (it.t === 'poly') items.push({ ...it, pts: (it.pts as Pt[]).map((p) => [p[0], p[1] + y0] as Pt) })
      else if (it.t === 'text') {
        const at = it.at as Pt
        items.push({ ...it, at: [at[0], at[1] + y0] })
      }
    }
    w = Math.max(w, s.cols)
    y0 += s.rows + 1.8
  }
  return { dim: 2, axes: false, ...fit([[-2, -1.2], [w, y0 - 1.8]], 0.5), items }
}

type TNode = { n: number; kids?: [TNode, TNode] }
const T = (n: number, a?: TNode, b?: TNode): TNode => (a && b ? { n, kids: [a, b] } : { n })
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}

/** One or more factor trees side by side. Primes are circled, composites are plain. */
function factorTrees(trees: TNode[]): Piece {
  const items: FigItem[] = []
  const dx = 2.2
  const dy = 2.2
  const R = 0.85
  let leafX = 0
  const pts: Pt[] = []
  const place = (node: TNode, depth: number): Pt => {
    const y = -depth * dy
    const kids = node.kids?.map((k) => place(k, depth + 1))
    let x: number
    if (kids) x = (kids[0][0] + kids[1][0]) / 2
    else {
      x = leafX
      leafX += dx
    }
    if (kids) for (const k of kids) items.push(line([x, y - R + 0.1], [k[0], k[1] + R - 0.1], 'muted', { width: 2 }))
    const prime = isPrime(node.n)
    if (prime) items.push(outline(ellipsePts(x, y, R, R, 0, 360, 36), 'result'))
    items.push(txt(x, y, String(node.n), 'lg', prime ? 'result' : 'muted'))
    pts.push([x - R, y - R], [x + R, y + R])
    return [x, y]
  }
  trees.forEach((t, i) => {
    if (i > 0) leafX += dx * 0.8
    place(t, 0)
  })
  return { dim: 2, axes: false, ...fit(pts, 0.4), items }
}

/** Skip-counting on a number line from 0: jumps of `a` along the top, jumps of `b`
 *  underneath. `mark: 'first'` colors the first landing the two share. */
function skipLine(o: { to: number; a: number; b: number; labelEvery?: number; mark?: 'first' | 'none' }): Piece {
  const { to, a, b } = o
  const mult = (k: number) => Array.from({ length: Math.floor(to / k) }, (_, i) => (i + 1) * k)
  const as = mult(a)
  const bs = mult(b)
  const shared = as.find((v) => bs.includes(v))
  const base = numberLine({
    from: 0,
    to,
    step: 1,
    labelEvery: o.labelEvery ?? 1,
    jumps: as.map((v) => ({ from: v - a, to: v, color: 'a' as FigColor, label: `+${a}` })),
    marks: [
      ...as.map((v) => ({ at: v, color: 'a' as FigColor })),
      ...bs.map((v) => ({ at: v, color: 'b' as FigColor })),
      ...(o.mark === 'none' || shared === undefined ? [] : [{ at: shared, color: 'result' as FigColor }]),
    ],
  })
  const items: FigItem[] = [...base.items]
  for (const v of bs) {
    items.push({ t: 'vec', from: [v - b, -2.3], to: [v, -2.3], color: 'b' })
    items.push(txt(v - b / 2, -3.05, `+${b}`, 'md', 'b'))
  }
  return { dim: 2, axes: false, aspect: 1.9, xSpan: base.xSpan, ySpan: [-3.8, 2.4], items }
}

/** `n` bags, each holding `a` squares in the top row and `b` in the bottom row. */
function bags(n: number, a: number, b: number): Piece {
  const items: FigItem[] = []
  const s = 0.62
  const step = 0.74
  const bw = Math.max(a, b) * step + 0.4
  const gap = 0.6
  for (let i = 0; i < n; i++) {
    const x0 = i * (bw + gap)
    items.push(outline(rectPts(x0, 0, bw, 3), 'muted'))
    for (let j = 0; j < a; j++) items.push(solid(rectPts(x0 + 0.25 + j * step, 1.85, s, s), 'b'))
    for (let j = 0; j < b; j++) items.push(solid(rectPts(x0 + 0.25 + j * step, 0.55, s, s), 'result'))
  }
  const W = n * bw + (n - 1) * gap
  return { dim: 2, axes: false, ...fit([[0, 0], [W, 3]], 0.4), items }
}

/* ---------------------------------------------------------------------------- the module */

/** Module 2 — factors, primes, GCF (FPB), multiples, LCM (KPK), and the word
 *  problems that need one or the other. */
export const module2: Module = {
  id: 'tka-m2',
  title: { en: 'Factors, Multiples, LCM and GCF', id: 'Faktor, Kelipatan, KPK, dan FPB' },
  summary: {
    en: 'Factors and multiples are two sides of multiplication. You will find factors, primes, the GCF (FPB) and the LCM (KPK), then use them to solve word problems.',
    id: 'Faktor dan kelipatan adalah dua sisi dari perkalian. Kamu akan mencari faktor, bilangan prima, FPB, dan KPK, lalu memakainya untuk soal cerita.',
  },
  submodules: [
    /* ------------------------------------------------------------------ factors and FPB */
    {
      id: 'tka-m2-s1',
      title: { en: 'Factors and GCF', id: 'Faktor dan FPB' },
      summary: {
        en: 'A factor divides a number exactly. From factors you get primes, prime factorization and the greatest common factor.',
        id: 'Faktor membagi habis sebuah bilangan. Dari faktor, kita bisa mencari bilangan prima, faktorisasi prima, dan FPB.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m2-s1-l1',
          title: { en: 'Factors and Prime Numbers', id: 'Faktor dan Bilangan Prima' },
          goal: {
            en: 'You can find all the factors of a number and tell prime numbers from composite ones.',
            id: 'Kamu bisa mencari semua faktor suatu bilangan dan membedakan bilangan prima dari komposit.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Tiles and Factors', id: 'Ayo Amati: Ubin dan Faktor' },
              body: {
                en: 'Ani has 12 square tiles of the same size. She wants to arrange them into one full rectangle, with no gaps and none left over.\n\nThere are three ways: 1 row of 12 tiles, 2 rows of 6 tiles, or 3 rows of 4 tiles. The numbers on the sides of those rectangles are called **factors**: 1, 2, 3, 4, 6 and 12. A factor of 12 is a number that divides 12 exactly, with nothing left over.\n\nTry 7 tiles: there is only 1 row of 7. A number with exactly two factors, 1 and itself, is a **prime number**. A number with more than two factors, like 12, is a **composite number**.',
                id: 'Ani punya 12 ubin persegi yang sama besar. Ia ingin menyusunnya menjadi satu persegi panjang penuh, tanpa celah dan tanpa sisa.\n\nAda tiga cara: 1 baris berisi 12 ubin, 2 baris berisi 6 ubin, atau 3 baris berisi 4 ubin. Bilangan yang muncul di sisi persegi panjang itu disebut **faktor**: 1, 2, 3, 4, 6, dan 12. Faktor dari 12 adalah bilangan yang membagi habis 12, jadi tidak ada sisa.\n\nCoba 7 ubin: hanya bisa 1 baris berisi 7 ubin. Bilangan yang hanya punya dua faktor, yaitu 1 dan dirinya sendiri, disebut **bilangan prima**. Bilangan yang punya lebih dari dua faktor, seperti 12, disebut **bilangan komposit**.',
              },
              figure: {
                ...gridStack([
                  { cols: 4, rows: 3, color: 'a', dims: ['4', '3'] },
                  { cols: 6, rows: 2, color: 'b', dims: ['6', '2'] },
                  { cols: 12, rows: 1, color: 'c', dims: ['12', '1'] },
                ]),
                caption: {
                  en: 'Three ways to make 12 tiles into a rectangle: 1 × 12, 2 × 6 and 3 × 4.',
                  id: 'Tiga cara menyusun 12 ubin menjadi persegi panjang: 1 × 12, 2 × 6, dan 3 × 4.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Finding All the Factors', id: 'Contoh Bertahap: Mencari Semua Faktor' },
              body: {
                en: 'Find all the factors of 18. Look for them in pairs, so none is missed.\n\n1. Step 1: Start with 1. $1 \\times 18 = 18$, so 1 and 18 are factors.\n2. Step 2: Try 2. $18 \\div 2 = 9$ with nothing left over, so 2 and 9 are factors.\n3. Step 3: Try 3. $18 \\div 3 = 6$ with nothing left over, so 3 and 6 are factors.\n4. Step 4: Try 4 and 5. $18 \\div 4$ leaves 2 and $18 \\div 5$ leaves 3, so neither is a factor.\n5. Step 5: Stop when you meet a pair you already have (6 has already appeared). The factors of 18 are 1, 2, 3, 6, 9 and 18.\n\n**Remember:** there are quick checks to see if a number divides exactly.\n\n| Divisible by | The sign | Example |\n| --- | --- | --- |\n| 2 | the last digit is 0, 2, 4, 6 or 8 | 38 |\n| 3 | the digits add up to a number divisible by 3 | 51, because 5 + 1 = 6 |\n| 5 | the last digit is 0 or 5 | 85 |\n| 9 | the digits add up to a number divisible by 9 | 63, because 6 + 3 = 9 |\n| 10 | the last digit is 0 | 70 |',
                id: 'Cari semua faktor dari 18. Carilah secara berpasangan, supaya tidak ada yang terlewat.\n\n1. Langkah 1: Mulai dari 1. $1 \\times 18 = 18$, jadi 1 dan 18 adalah faktor.\n2. Langkah 2: Coba 2. $18 \\div 2 = 9$ tanpa sisa, jadi 2 dan 9 adalah faktor.\n3. Langkah 3: Coba 3. $18 \\div 3 = 6$ tanpa sisa, jadi 3 dan 6 adalah faktor.\n4. Langkah 4: Coba 4 dan 5. $18 \\div 4$ bersisa 2 dan $18 \\div 5$ bersisa 3, jadi keduanya bukan faktor.\n5. Langkah 5: Berhenti ketika kamu bertemu pasangan yang sudah ada (6 sudah muncul). Faktor dari 18 adalah 1, 2, 3, 6, 9, dan 18.\n\n**Ingat:** ada cara cepat untuk mengecek apakah suatu bilangan habis dibagi.\n\n| Habis dibagi | Cirinya | Contoh |\n| --- | --- | --- |\n| 2 | angka satuan 0, 2, 4, 6, atau 8 | 38 |\n| 3 | jumlah angkanya habis dibagi 3 | 51, karena 5 + 1 = 6 |\n| 5 | angka satuan 0 atau 5 | 85 |\n| 9 | jumlah angkanya habis dibagi 9 | 63, karena 6 + 3 = 9 |\n| 10 | angka satuan 0 | 70 |',
              },
              figure: {
                ...gridRect({ cols: 6, rows: 3, shade: 18, dims: ['6', '3'] }),
                caption: {
                  en: '18 tiles make a 3 × 6 rectangle. So 3 and 6 are a pair of factors of 18.',
                  id: '18 ubin membentuk persegi panjang 3 × 6. Jadi 3 dan 6 adalah sepasang faktor dari 18.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Factors and Primes', id: 'Awas, Jebakan!: Faktor dan Bilangan Prima' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| ❌ The factors of 12 are 2, 3, 4, 6. | The factors of 12 are 1, 2, 3, 4, 6, 12. The number 1 and the number itself are always factors. |\n| ❌ 1 is a prime number. | 1 is not prime and not composite, because it has only one factor: 1. A prime has exactly two factors. |\n| ❌ 9 is prime because it is odd. | 9 = 3 × 3, so 9 is composite. Odd does not mean prime. |',
                id: '| Salah | Benar |\n| --- | --- |\n| ❌ Faktor dari 12 adalah 2, 3, 4, 6. | Faktor dari 12 adalah 1, 2, 3, 4, 6, 12. Angka 1 dan bilangan itu sendiri selalu menjadi faktor. |\n| ❌ 1 adalah bilangan prima. | 1 bukan prima dan bukan komposit, karena faktornya hanya satu: 1. Bilangan prima punya tepat dua faktor. |\n| ❌ 9 adalah bilangan prima karena ganjil. | 9 = 3 × 3, jadi 9 komposit. Ganjil belum tentu prima. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The picture shows two ways to arrange 8 tiles into a rectangle. Which list has all the factors of 8?',
                id: 'Gambar menunjukkan dua cara menyusun 8 ubin menjadi persegi panjang. Daftar mana yang berisi semua faktor dari 8?',
              },
              figure: {
                ...gridStack([
                  { cols: 4, rows: 2, color: 'a', dims: ['4', '2'] },
                  { cols: 8, rows: 1, color: 'b', dims: ['8', '1'] },
                ]),
                caption: { en: '8 tiles as 2 × 4 and as 1 × 8.', id: '8 ubin sebagai 2 × 4 dan sebagai 1 × 8.' },
              },
              options: [
                { en: '1, 2, 4, 8', id: '1, 2, 4, 8' },
                { en: '2 and 4', id: '2 dan 4' },
                { en: '1, 2, 4', id: '1, 2, 4' },
                { en: '1, 2, 4, 8, 16', id: '1, 2, 4, 8, 16' },
              ],
              answer: 0,
              explain: {
                en: 'The sides of the rectangles are 1, 2, 4 and 8. The number 1 and 8 itself must be included, and 16 is a multiple of 8, not a factor.',
                id: 'Sisi-sisi persegi panjangnya adalah 1, 2, 4, dan 8. Angka 1 dan 8 sendiri harus ikut, dan 16 adalah kelipatan 8, bukan faktor.',
              },
              hint: {
                en: 'A factor divides 8 exactly. Is 1 on your list? Is 8 itself? Can a factor be bigger than the number?',
                id: 'Faktor membagi habis 8. Apakah 1 ada di daftarmu? Apakah 8 sendiri? Bisakah faktor lebih besar dari bilangannya?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: find the factors of 20 in pairs.',
                id: 'Coba bersama: cari faktor dari 20 secara berpasangan.',
              },
              template: '1 \\times 20 = 20,\\quad 2 \\times ___ = 20,\\quad 4 \\times ___ = 20',
              blanks: ['10', '5'],
              explain: {
                en: '$20 \\div 2 = 10$ and $20 \\div 4 = 5$. So the factors of 20 are 1, 2, 4, 5, 10 and 20.',
                id: '$20 \\div 2 = 10$ dan $20 \\div 4 = 5$. Jadi faktor dari 20 adalah 1, 2, 4, 5, 10, dan 20.',
              },
              hint: {
                en: 'Divide 20 by the number on the left of each blank: first $20 \\div 2$, then $20 \\div 4$.',
                id: 'Bagi 20 dengan bilangan di sebelah kiri tiap kotak: pertama $20 \\div 2$, lalu $20 \\div 4$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Seven tiles can only make one rectangle: 1 row of 7 tiles. What does this tell us about the number 7?',
                id: 'Tujuh ubin hanya bisa disusun menjadi satu persegi panjang: 1 baris berisi 7 ubin. Apa artinya bagi bilangan 7?',
              },
              figure: {
                ...gridRect({ cols: 7, rows: 1, shade: 7, dims: ['7', '1'] }),
                caption: { en: '7 tiles in one row.', id: '7 ubin dalam satu baris.' },
              },
              options: [
                { en: 'It is prime, because it has only two factors: 1 and 7', id: 'Prima, karena hanya punya dua faktor: 1 dan 7' },
                { en: 'It is composite, because 1 × 7 and 7 × 1 are two ways', id: 'Komposit, karena 1 × 7 dan 7 × 1 adalah dua cara' },
                { en: 'It is not prime, because 1 is one of its factors', id: 'Bukan prima, karena 1 adalah salah satu faktornya' },
                { en: 'It is neither prime nor composite, like the number 1', id: 'Bukan prima dan bukan komposit, seperti bilangan 1' },
              ],
              answer: 0,
              explain: {
                en: '7 has exactly two factors, 1 and 7, so it is prime. 1 × 7 and 7 × 1 are the same rectangle turned around, and every number has 1 as a factor.',
                id: '7 punya tepat dua faktor, yaitu 1 dan 7, jadi 7 prima. 1 × 7 dan 7 × 1 adalah persegi panjang yang sama hanya diputar, dan setiap bilangan punya faktor 1.',
              },
              hint: {
                en: 'Count the factors of 7. How many does a prime number have?',
                id: 'Hitung faktor dari 7. Berapa banyak faktor yang dimiliki bilangan prima?',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: { en: 'Choose the three prime numbers.', id: 'Pilih tiga bilangan prima.' },
              options: [
                { en: '2', id: '2' },
                { en: '13', id: '13' },
                { en: '19', id: '19' },
                { en: '9', id: '9' },
                { en: '1', id: '1' },
              ],
              answer: [0, 1, 2],
              explain: {
                en: '2, 13 and 19 each have only two factors. 9 = 3 × 3 has the factor 3 as well, and 1 has only one factor.',
                id: '2, 13, dan 19 masing-masing hanya punya dua faktor. 9 = 3 × 3 punya faktor 3 juga, dan 1 hanya punya satu faktor.',
              },
              hint: {
                en: 'A prime has exactly two factors. List the factors of each number; being odd is not enough.',
                id: 'Bilangan prima punya tepat dua faktor. Tulis faktor tiap bilangan; ganjil saja belum cukup.',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: { en: 'Decide whether each statement is True or False.', id: 'Tentukan tiap pernyataan Benar atau Salah.' },
              statements: [
                { en: 'All the factors of 16 are 1, 2, 4, 8 and 16.', id: 'Semua faktor dari 16 adalah 1, 2, 4, 8, dan 16.' },
                { en: 'The number 1 is a prime number.', id: 'Bilangan 1 adalah bilangan prima.' },
                { en: '51 is divisible by 3.', id: '51 habis dibagi 3.' },
                { en: '87 is divisible by 9.', id: '87 habis dibagi 9.' },
              ],
              answer: [true, false, true, false],
              explain: {
                en: '16 = 1 × 16 = 2 × 8 = 4 × 4, so the list is complete. 1 has only one factor, so it is not prime. For 51, 5 + 1 = 6 is divisible by 3. For 87, 8 + 7 = 15 is not divisible by 9.',
                id: '16 = 1 × 16 = 2 × 8 = 4 × 4, jadi daftarnya lengkap. 1 hanya punya satu faktor, jadi bukan prima. Untuk 51, 5 + 1 = 6 habis dibagi 3. Untuk 87, 8 + 7 = 15 tidak habis dibagi 9.',
              },
              hint: {
                en: 'Use the quick checks: add the digits for 3 and 9. For the factors of 16, try the pairs.',
                id: 'Pakai cara cepat: jumlahkan angka-angkanya untuk 3 dan 9. Untuk faktor 16, coba pasangannya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Mr. Eko lays 36 floor tiles into one full rectangle. The number of tiles in one row must divide 36 exactly. How many different choices are there for the number of tiles in one row?',
                id: 'Pak Eko memasang 36 ubin lantai menjadi satu persegi panjang penuh. Banyak ubin dalam satu baris harus membagi habis 36. Ada berapa pilihan banyak ubin dalam satu baris?',
              },
              blanks: [{ answer: 9, after: { en: '\\text{ choices}', id: '\\text{ pilihan}' } }],
              hints: [
                {
                  en: 'The number of tiles in a row has to be a factor of 36. So the question is: how many factors does 36 have?',
                  id: 'Banyak ubin dalam satu baris harus faktor dari 36. Jadi pertanyaannya: ada berapa faktor dari 36?',
                },
                {
                  en: 'Find the factors in pairs, starting at 1: $1 \\times 36$, $2 \\times 18$, and so on, until you meet a pair you already have.',
                  id: 'Cari faktor secara berpasangan, mulai dari 1: $1 \\times 36$, $2 \\times 18$, dan seterusnya, sampai bertemu pasangan yang sudah ada.',
                },
                {
                  en: 'The pairs are $1 \\times 36$, $2 \\times 18$, $3 \\times 12$, $4 \\times 9$ and $6 \\times 6$. Write every number once and count them. 6 is counted only once.',
                  id: 'Pasangannya adalah $1 \\times 36$, $2 \\times 18$, $3 \\times 12$, $4 \\times 9$, dan $6 \\times 6$. Tulis tiap bilangan satu kali dan hitung. Angka 6 hanya dihitung sekali.',
                },
              ],
              explain: {
                en: 'The factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18 and 36. That is 9 choices. In $6 \\times 6$ the pair is the same number, so it counts once.',
                id: 'Faktor dari 36 adalah 1, 2, 3, 4, 6, 9, 12, 18, dan 36. Itu ada 9 pilihan. Pada $6 \\times 6$ pasangannya bilangan yang sama, jadi dihitung sekali.',
              },
              solution: ['1 \\times 36', '2 \\times 18', '3 \\times 12', '4 \\times 9', '6 \\times 6', '1, 2, 3, 4, 6, 9, 12, 18, 36 \\rightarrow 9'],
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m2-s1-l2',
          title: { en: 'Prime Factorization and GCF', id: 'Faktorisasi Prima dan FPB' },
          goal: {
            en: 'You can write a number as a product of primes and find the GCF (FPB) of two numbers.',
            id: 'Kamu bisa menulis faktorisasi prima dan mencari FPB dua bilangan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: The Factor Tree', id: 'Ayo Amati: Pohon Faktor' },
              body: {
                en: 'A composite number can be "broken" into a product of two smaller numbers. Keep breaking until nothing can be broken any more, that is, until every number is prime.\n\nThe picture is the **factor tree** of 36. $36 = 4 \\times 9$, then $4 = 2 \\times 2$ and $9 = 3 \\times 3$. The primes at the tips (the circled ones) are 2, 2, 3 and 3.\n\nWriting a number as a product of primes only is called **prime factorization**. So $36 = 2 \\times 2 \\times 3 \\times 3$.',
                id: 'Sebuah bilangan komposit bisa "dipecah" menjadi perkalian dua bilangan yang lebih kecil. Teruskan memecah sampai tidak ada yang bisa dipecah lagi, yaitu sampai semua bilangan prima.\n\nGambar di bawah adalah **pohon faktor** dari 36. $36 = 4 \\times 9$, lalu $4 = 2 \\times 2$ dan $9 = 3 \\times 3$. Bilangan prima di ujung (yang dilingkari) adalah 2, 2, 3, dan 3.\n\nMenulis bilangan sebagai perkalian bilangan prima saja disebut **faktorisasi prima**. Jadi $36 = 2 \\times 2 \\times 3 \\times 3$.',
              },
              figure: {
                ...factorTrees([T(36, T(4, T(2), T(2)), T(9, T(3), T(3)))]),
                caption: {
                  en: 'The factor tree of 36. The circled numbers are primes.',
                  id: 'Pohon faktor dari 36. Bilangan yang dilingkari adalah bilangan prima.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: The GCF of 24 and 36', id: 'Contoh Bertahap: FPB dari 24 dan 36' },
              body: {
                en: 'Find the **GCF** (greatest common factor) of 24 and 36. In Indonesian it is called FPB. It is the biggest factor that both numbers share.\n\n1. Step 1: Make the factor tree of 24. $24 = 2 \\times 2 \\times 2 \\times 3$.\n2. Step 2: Make the factor tree of 36. $36 = 2 \\times 2 \\times 3 \\times 3$.\n3. Step 3: Find the primes that are in both lists. Both lists have two 2s and one 3 in common.\n4. Step 4: Multiply those shared primes. $2 \\times 2 \\times 3 = 12$, so the GCF is 12.\n5. Step 5: Check with the factor lists. 24: 1, 2, 3, 4, 6, 8, 12, 24. 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The biggest one they share is 12.\n\n**Remember:** there are two ways to find the GCF.\n\n- Listing: write the factors of both numbers, then pick the biggest one they share.\n- Prime factorization: take only the primes that are in both numbers, then multiply them.',
                id: 'Cari **FPB** dari 24 dan 36. FPB adalah faktor persekutuan terbesar, yaitu faktor terbesar yang dimiliki kedua bilangan.\n\n1. Langkah 1: Buat pohon faktor 24. $24 = 2 \\times 2 \\times 2 \\times 3$.\n2. Langkah 2: Buat pohon faktor 36. $36 = 2 \\times 2 \\times 3 \\times 3$.\n3. Langkah 3: Cari bilangan prima yang ada di kedua daftar. Keduanya punya dua angka 2 dan satu angka 3 yang sama.\n4. Langkah 4: Kalikan bilangan prima yang sama itu. $2 \\times 2 \\times 3 = 12$, jadi FPB-nya 12.\n5. Langkah 5: Cek dengan daftar faktor. 24: 1, 2, 3, 4, 6, 8, 12, 24. 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. Yang terbesar yang sama adalah 12.\n\n**Ingat:** ada dua cara mencari FPB.\n\n- Daftar faktor: tulis faktor kedua bilangan, lalu pilih yang sama dan terbesar.\n- Faktorisasi prima: ambil hanya bilangan prima yang ada di kedua bilangan, lalu kalikan.',
              },
              figure: {
                ...factorTrees([T(24, T(4, T(2), T(2)), T(6, T(2), T(3))), T(36, T(4, T(2), T(2)), T(9, T(3), T(3)))]),
                caption: {
                  en: 'The factor trees of 24 (left) and 36 (right).',
                  id: 'Pohon faktor dari 24 (kiri) dan 36 (kanan).',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Prime Factorization and the GCF', id: 'Awas, Jebakan!: Faktorisasi Prima dan FPB' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| ❌ $12 = 3 \\times 4$ is the prime factorization. | Every number at the tips must be prime. 4 can still be broken, so $12 = 2 \\times 2 \\times 3$. |\n| ❌ GCF of 12 and 18: use all the primes, $2 \\times 2 \\times 3 \\times 3 = 36$. | Use only the primes that are in both numbers: $2 \\times 3 = 6$. |\n| ❌ 8 and 15 have no GCF. | They always have one. 1 is a factor of every number, so the GCF of 8 and 15 is 1. |',
                id: '| Salah | Benar |\n| --- | --- |\n| ❌ $12 = 3 \\times 4$ adalah faktorisasi prima. | Semua bilangan di ujung harus prima. 4 masih bisa dipecah, jadi $12 = 2 \\times 2 \\times 3$. |\n| ❌ FPB 12 dan 18: pakai semua bilangan prima, $2 \\times 2 \\times 3 \\times 3 = 36$. | Pakai hanya bilangan prima yang ada di kedua bilangan: $2 \\times 3 = 6$. |\n| ❌ 8 dan 15 tidak punya FPB. | Selalu ada. 1 adalah faktor semua bilangan, jadi FPB dari 8 dan 15 adalah 1. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The factor tree of 60 is in the picture. What is the prime factorization of 60?',
                id: 'Pohon faktor 60 ada pada gambar. Bagaimana faktorisasi prima dari 60?',
              },
              figure: {
                ...factorTrees([T(60, T(6, T(2), T(3)), T(10, T(2), T(5)))]),
                caption: { en: 'The factor tree of 60.', id: 'Pohon faktor dari 60.' },
              },
              options: [
                { en: '$2 \\times 2 \\times 3 \\times 5$', id: '$2 \\times 2 \\times 3 \\times 5$' },
                { en: '$6 \\times 10$', id: '$6 \\times 10$' },
                { en: '$2 \\times 3 \\times 5$', id: '$2 \\times 3 \\times 5$' },
                { en: '$2 \\times 3 \\times 10$', id: '$2 \\times 3 \\times 10$' },
              ],
              answer: 0,
              explain: {
                en: 'The tips of the tree are 2, 3, 2 and 5. All of them must be written, and all are prime: $2 \\times 2 \\times 3 \\times 5 = 60$. 6 and 10 can still be broken, and leaving out a 2 gives only 30.',
                id: 'Ujung pohonnya adalah 2, 3, 2, dan 5. Semuanya harus ditulis, dan semuanya prima: $2 \\times 2 \\times 3 \\times 5 = 60$. 6 dan 10 masih bisa dipecah, dan kalau satu angka 2 dilewatkan hasilnya hanya 30.',
              },
              hint: {
                en: 'Read all the numbers at the tips of the tree. Each one must be prime. Then multiply: the product must be 60.',
                id: 'Baca semua bilangan di ujung pohon. Tiap bilangan harus prima. Lalu kalikan: hasilnya harus 60.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: { en: 'Try it together: find the GCF of 18 and 30.', id: 'Coba bersama: cari FPB dari 18 dan 30.' },
              template: {
                en: '18 = 2 \\times 3 \\times 3,\\quad 30 = 2 \\times 3 \\times 5,\\quad \\text{GCF} = 2 \\times ___ = ___',
                id: '18 = 2 \\times 3 \\times 3,\\quad 30 = 2 \\times 3 \\times 5,\\quad \\text{FPB} = 2 \\times ___ = ___',
              },
              blanks: ['3', '6'],
              explain: {
                en: 'The primes in both numbers are 2 and 3. $2 \\times 3 = 6$.',
                id: 'Bilangan prima yang ada di kedua bilangan adalah 2 dan 3. $2 \\times 3 = 6$.',
              },
              hint: {
                en: 'Which primes appear in 18 and also in 30? Multiply only those shared ones.',
                id: 'Bilangan prima mana yang muncul di 18 dan juga di 30? Kalikan hanya yang sama.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The picture shows the factor trees of 30 and 45. What is the GCF of 30 and 45?',
                id: 'Gambar menunjukkan pohon faktor 30 dan 45. Berapa FPB dari 30 dan 45?',
              },
              figure: {
                ...factorTrees([T(30, T(5), T(6, T(2), T(3))), T(45, T(5), T(9, T(3), T(3)))]),
                caption: { en: 'The factor trees of 30 (left) and 45 (right).', id: 'Pohon faktor dari 30 (kiri) dan 45 (kanan).' },
              },
              options: [
                { en: '15', id: '15' },
                { en: '90', id: '90' },
                { en: '5', id: '5' },
                { en: '30', id: '30' },
              ],
              answer: 0,
              explain: {
                en: 'The primes in both trees are 3 and 5, and $3 \\times 5 = 15$. 90 comes from using all the primes, 5 is only one of the shared primes, and 30 does not divide 45.',
                id: 'Bilangan prima yang ada di kedua pohon adalah 3 dan 5, dan $3 \\times 5 = 15$. 90 muncul kalau semua bilangan prima dipakai, 5 hanya satu dari bilangan prima yang sama, dan 30 tidak membagi 45.',
              },
              hint: {
                en: 'Circle the primes that appear in both trees, then multiply all of them.',
                id: 'Lingkari bilangan prima yang ada di kedua pohon, lalu kalikan semuanya.',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: {
                en: 'Choose the three of these numbers that are common factors of 24 and 36.',
                id: 'Pilih tiga dari bilangan ini yang merupakan faktor persekutuan 24 dan 36.',
              },
              options: [
                { en: '4', id: '4' },
                { en: '6', id: '6' },
                { en: '12', id: '12' },
                { en: '8', id: '8' },
                { en: '9', id: '9' },
              ],
              answer: [0, 1, 2],
              explain: {
                en: '4, 6 and 12 divide both 24 and 36. 8 divides 24 but not 36 (36 ÷ 8 leaves 4), and 9 divides 36 but not 24 (24 ÷ 9 leaves 6).',
                id: '4, 6, dan 12 membagi 24 dan juga 36. 8 membagi 24 tetapi tidak membagi 36 (36 ÷ 8 bersisa 4), dan 9 membagi 36 tetapi tidak membagi 24 (24 ÷ 9 bersisa 6).',
              },
              hint: {
                en: 'Test every number on BOTH 24 and 36. It must divide both exactly.',
                id: 'Uji tiap bilangan pada KEDUA bilangan, 24 dan 36. Ia harus membagi habis keduanya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put the steps for finding the GCF with prime factorization in order.',
                id: 'Urutkan langkah mencari FPB dengan faktorisasi prima.',
              },
              lines: {
                en: [
                  'Make a factor tree for each number',
                  'Write each number as a product of primes: 20 = 2 × 2 × 5 and 30 = 2 × 3 × 5',
                  'Circle the primes that are in both numbers: 2 and 5',
                  'Multiply them: GCF = 2 × 5 = 10',
                ],
                id: [
                  'Buat pohon faktor tiap bilangan',
                  'Tulis tiap bilangan sebagai perkalian bilangan prima: 20 = 2 × 2 × 5 dan 30 = 2 × 3 × 5',
                  'Lingkari bilangan prima yang ada di kedua bilangan: 2 dan 5',
                  'Kalikan: FPB = 2 × 5 = 10',
                ],
              },
              explain: {
                en: 'First break each number into primes, then see which primes they share, and only at the end multiply the shared ones.',
                id: 'Pertama pecah tiap bilangan menjadi bilangan prima, lalu lihat bilangan prima yang sama, dan baru di akhir kalikan yang sama itu.',
              },
              hint: {
                en: 'You cannot circle shared primes before you have written the primes, and you multiply last.',
                id: 'Kamu belum bisa melingkari bilangan prima yang sama sebelum menulis bilangan primanya, dan perkalian dilakukan terakhir.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Hasan wrote down two numbers, 72 and 84. What is the GCF of 72 and 84?',
                id: 'Hasan menulis dua bilangan, 72 dan 84. Berapa FPB dari 72 dan 84?',
              },
              blanks: [{ answer: 12 }],
              hints: [
                {
                  en: 'Look at both numbers: you need the biggest factor they share. A factor tree for each number can help.',
                  id: 'Lihat kedua bilangan: kamu butuh faktor terbesar yang dimiliki keduanya. Pohon faktor untuk tiap bilangan bisa membantu.',
                },
                {
                  en: 'Write the prime factorization of 72 and of 84. Then find the primes they share.',
                  id: 'Tulis faktorisasi prima dari 72 dan dari 84. Lalu cari bilangan prima yang sama.',
                },
                {
                  en: '$72 = 2 \\times 2 \\times 2 \\times 3 \\times 3$ and $84 = 2 \\times 2 \\times 3 \\times 7$. Take the primes that are in both, then multiply them.',
                  id: '$72 = 2 \\times 2 \\times 2 \\times 3 \\times 3$ dan $84 = 2 \\times 2 \\times 3 \\times 7$. Ambil bilangan prima yang ada di keduanya, lalu kalikan.',
                },
              ],
              explain: {
                en: 'Both numbers have two 2s and one 3 in common, and $2 \\times 2 \\times 3 = 12$. The 7 is only in 84, so it is left out.',
                id: 'Kedua bilangan punya dua angka 2 dan satu angka 3 yang sama, dan $2 \\times 2 \\times 3 = 12$. Angka 7 hanya ada di 84, jadi tidak diambil.',
              },
              solution: {
                en: [
                  '72 = 2 \\times 2 \\times 2 \\times 3 \\times 3',
                  '84 = 2 \\times 2 \\times 3 \\times 7',
                  '\\text{GCF} = 2 \\times 2 \\times 3 = 12',
                ],
                id: [
                  '72 = 2 \\times 2 \\times 2 \\times 3 \\times 3',
                  '84 = 2 \\times 2 \\times 3 \\times 7',
                  '\\text{FPB} = 2 \\times 2 \\times 3 = 12',
                ],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m2-s1-p',
        runtime: 'math',
        title: { en: 'Project: Factors and GCF', id: 'Proyek: Faktor dan FPB' },
        brief: {
          en: 'Four short problems about primes, factors and the GCF (FPB), from easy to tricky.',
          id: 'Empat soal singkat tentang bilangan prima, faktor, dan FPB, dari yang mudah sampai yang menantang.',
        },
        requirements: [
          { en: 'Write factors and recognize prime numbers.', id: 'Menuliskan faktor dan mengenali bilangan prima.' },
          { en: 'Find the GCF with factor lists or prime factorization.', id: 'Mencari FPB dengan daftar faktor atau faktorisasi prima.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'How many prime numbers are there between 20 and 40?',
              id: 'Ada berapa bilangan prima di antara 20 dan 40?',
            },
            blanks: [{ answer: 4 }],
            solution: ['23,\\ 29,\\ 31,\\ 37 \\rightarrow 4'],
          },
          {
            prompt: { en: 'What is the GCF of 48 and 60?', id: 'Berapa FPB dari 48 dan 60?' },
            blanks: [{ answer: 12 }],
            solution: {
              en: [
                '48 = 2 \\times 2 \\times 2 \\times 2 \\times 3',
                '60 = 2 \\times 2 \\times 3 \\times 5',
                '\\text{GCF} = 2 \\times 2 \\times 3 = 12',
              ],
              id: [
                '48 = 2 \\times 2 \\times 2 \\times 2 \\times 3',
                '60 = 2 \\times 2 \\times 3 \\times 5',
                '\\text{FPB} = 2 \\times 2 \\times 3 = 12',
              ],
            },
          },
          {
            prompt: {
              en: 'Mr. Joko wants to lay 48 tiles into one full rectangle. How many different rectangles can he make? (6 × 8 and 8 × 6 count as the same rectangle.)',
              id: 'Pak Joko ingin menyusun 48 ubin menjadi satu persegi panjang penuh. Ada berapa bentuk persegi panjang yang berbeda? (6 × 8 dan 8 × 6 dianggap sama.)',
            },
            blanks: [{ answer: 5, after: { en: '\\text{ rectangles}', id: '\\text{ bentuk}' } }],
            solution: ['1 \\times 48,\\ 2 \\times 24,\\ 3 \\times 16,\\ 4 \\times 12,\\ 6 \\times 8 \\rightarrow 5'],
          },
          {
            prompt: {
              en: 'I am an even number between 20 and 30. The GCF of me and 18 is 6. Which number am I? (Hint in the picture: the factor tree of 18.)',
              id: 'Aku bilangan genap di antara 20 dan 30. FPB aku dan 18 adalah 6. Bilangan berapakah aku? (Petunjuk pada gambar: pohon faktor 18.)',
            },
            figure: {
              ...factorTrees([T(18, T(2), T(9, T(3), T(3)))]),
              caption: { en: 'The factor tree of 18.', id: 'Pohon faktor dari 18.' },
            },
            blanks: [{ answer: 24 }],
            solution: {
              en: [
                '\\text{GCF}(22,18) = 2,\\ \\text{GCF}(24,18) = 6',
                '\\text{GCF}(26,18) = 2,\\ \\text{GCF}(28,18) = 2',
                '\\Rightarrow 24',
              ],
              id: [
                '\\text{FPB}(22,18) = 2,\\ \\text{FPB}(24,18) = 6',
                '\\text{FPB}(26,18) = 2,\\ \\text{FPB}(28,18) = 2',
                '\\Rightarrow 24',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'A prime has exactly two factors. The number 1 does not count as prime.',
            id: 'Bilangan prima punya tepat dua faktor. Bilangan 1 tidak dihitung prima.',
          },
          {
            en: 'For the GCF, write the prime factorization of both numbers and keep only the primes they share.',
            id: 'Untuk FPB, tulis faktorisasi prima kedua bilangan dan ambil hanya bilangan prima yang sama.',
          },
          {
            en: 'For the last task, list the even numbers between 20 and 30 and find the GCF of each with 18.',
            id: 'Untuk soal terakhir, tulis bilangan genap di antara 20 dan 30 dan cari FPB masing-masing dengan 18.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------------ multiples and LCM */
    {
      id: 'tka-m2-s2',
      title: { en: 'Multiples and LCM', id: 'Kelipatan dan KPK' },
      summary: {
        en: 'Multiples are skip-counting. Common multiples lead to the LCM (KPK), and the GCF (FPB) and LCM together solve many word problems.',
        id: 'Kelipatan adalah berhitung loncat. Kelipatan yang sama menuntun kita ke KPK, dan FPB bersama KPK menyelesaikan banyak soal cerita.',
      },
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m2-s2-l1',
          title: { en: 'Multiples and LCM', id: 'Kelipatan dan KPK' },
          goal: {
            en: 'You can list multiples and find the LCM (KPK) of two numbers.',
            id: 'Kamu bisa menuliskan kelipatan dan mencari KPK dua bilangan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Jumping on the Number Line', id: 'Ayo Amati: Melompat di Garis Bilangan' },
              body: {
                en: 'Ani jumps along the number line starting at 0, each jump 3 steps: 3, 6, 9, 12. Budi also starts at 0, but each of his jumps is 4 steps: 4, 8, 12.\n\nThe numbers where they land are called **multiples**. The multiples of 3 are 3, 6, 9, 12, ... and the multiples of 4 are 4, 8, 12, ... Multiples never stop.\n\nThe first place where Ani and Budi land together is 12. A number they both land on is a **common multiple**, and the smallest one is the **LCM** (lowest common multiple). In Indonesian it is called KPK. The LCM of 3 and 4 is 12.',
                id: 'Ani melompat di garis bilangan mulai dari 0, setiap lompatan 3 langkah: 3, 6, 9, 12. Budi juga mulai dari 0, tetapi setiap lompatannya 4 langkah: 4, 8, 12.\n\nBilangan tempat mereka mendarat disebut **kelipatan**. Kelipatan 3 adalah 3, 6, 9, 12, ... dan kelipatan 4 adalah 4, 8, 12, ... Kelipatan tidak pernah berhenti.\n\nPertama kali Ani dan Budi mendarat di tempat yang sama adalah 12. Bilangan yang sama itu disebut **kelipatan persekutuan**, dan yang terkecil adalah **KPK** (kelipatan persekutuan terkecil). KPK dari 3 dan 4 adalah 12.',
              },
              figure: {
                ...skipLine({ to: 14, a: 3, b: 4 }),
                caption: {
                  en: 'Ani jumps 3 steps at a time (top), Budi jumps 4 steps at a time (bottom). The red dot is where they first land together.',
                  id: 'Ani melompat 3 langkah (atas), Budi melompat 4 langkah (bawah). Titik merah adalah tempat pertama mereka mendarat bersama.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: The LCM of 6 and 8', id: 'Contoh Bertahap: KPK dari 6 dan 8' },
              body: {
                en: 'Find the LCM of 6 and 8.\n\n1. Step 1: Write the multiples of 6: 6, 12, 18, 24, 30, ...\n2. Step 2: Write the multiples of 8: 8, 16, 24, 32, ...\n3. Step 3: Find the numbers that are in both lists. These are the common multiples: 24, 48, ...\n4. Step 4: Take the smallest one. It is 24, so the LCM is 24.\n5. Step 5: Check with prime factorization. $6 = 2 \\times 3$ and $8 = 2 \\times 2 \\times 2$. Take each prime as many times as it appears most often: three 2s and one 3. $2 \\times 2 \\times 2 \\times 3 = 24$.\n\n**Remember:**\n\n- Multiples come from multiplying the number by 1, 2, 3, ...\n- The LCM is never smaller than the biggest of the numbers.\n- With prime factorization, take each prime as many times as it appears most often, then multiply.',
                id: 'Cari KPK dari 6 dan 8.\n\n1. Langkah 1: Tulis kelipatan 6: 6, 12, 18, 24, 30, ...\n2. Langkah 2: Tulis kelipatan 8: 8, 16, 24, 32, ...\n3. Langkah 3: Cari bilangan yang ada di kedua daftar. Itulah kelipatan persekutuan: 24, 48, ...\n4. Langkah 4: Ambil yang terkecil. Yaitu 24, jadi KPK-nya 24.\n5. Langkah 5: Cek dengan faktorisasi prima. $6 = 2 \\times 3$ dan $8 = 2 \\times 2 \\times 2$. Ambil tiap bilangan prima sebanyak kemunculan terbanyaknya: tiga angka 2 dan satu angka 3. $2 \\times 2 \\times 2 \\times 3 = 24$.\n\n**Ingat:**\n\n- Kelipatan didapat dari mengalikan bilangan itu dengan 1, 2, 3, ...\n- KPK tidak pernah lebih kecil daripada bilangan terbesarnya.\n- Dengan faktorisasi prima, ambil tiap bilangan prima sebanyak kemunculan terbanyaknya, lalu kalikan.',
              },
              figure: {
                ...skipLine({ to: 24, a: 6, b: 8, labelEvery: 2 }),
                caption: {
                  en: 'Jumps of 6 (top) and jumps of 8 (bottom). They first land together on 24.',
                  id: 'Lompatan 6 (atas) dan lompatan 8 (bawah). Mereka pertama kali mendarat bersama di 24.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Multiples and the LCM', id: 'Awas, Jebakan!: Kelipatan dan KPK' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| ❌ The LCM of 4 and 6 is 2. | 2 divides both numbers, so it is a factor (that is the GCF). The LCM looks for multiples: it is 12. |\n| ❌ The multiples of 5 are 1 and 5. | The multiples of 5 are 5, 10, 15, ... The numbers 1 and 5 are its factors. |\n| ❌ The LCM of 3 and 9 is 27 (3 × 9). | Look for the smallest one: 9 is already a multiple of 3, so the LCM is 9. |',
                id: '| Salah | Benar |\n| --- | --- |\n| ❌ KPK dari 4 dan 6 adalah 2. | 2 membagi kedua bilangan, jadi itu faktor (itulah FPB). KPK mencari kelipatan: yaitu 12. |\n| ❌ Kelipatan 5 adalah 1 dan 5. | Kelipatan 5 adalah 5, 10, 15, ... Angka 1 dan 5 adalah faktornya. |\n| ❌ KPK dari 3 dan 9 adalah 27 (3 × 9). | Cari yang terkecil: 9 sudah kelipatan 3, jadi KPK-nya 9. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Ani jumps 3 steps at a time and Budi jumps 5 steps at a time from 0, as in the picture. What is the LCM of 3 and 5?',
                id: 'Ani melompat 3 langkah dan Budi melompat 5 langkah dari 0, seperti pada gambar. Berapa KPK dari 3 dan 5?',
              },
              figure: {
                ...skipLine({ to: 16, a: 3, b: 5, mark: 'none' }),
                caption: {
                  en: 'Ani: jumps of 3 (top). Budi: jumps of 5 (bottom).',
                  id: 'Ani: lompatan 3 (atas). Budi: lompatan 5 (bawah).',
                },
              },
              options: [
                { en: '15', id: '15' },
                { en: '8', id: '8' },
                { en: '30', id: '30' },
                { en: '5', id: '5' },
              ],
              answer: 0,
              explain: {
                en: 'The two sets of jumps first land on the same number at 15. 8 is 3 + 5 (adding), 30 is also a common multiple but not the smallest, and 5 is not a multiple of 3.',
                id: 'Kedua lompatan pertama kali mendarat di bilangan yang sama di 15. 8 adalah 3 + 5 (menjumlah), 30 juga kelipatan persekutuan tetapi bukan yang terkecil, dan 5 bukan kelipatan 3.',
              },
              hint: {
                en: 'Look for the first spot that has an arrow ending on it from both rows.',
                id: 'Cari tempat pertama yang menjadi ujung panah dari kedua baris lompatan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: { en: 'Try it together: find the LCM of 4 and 10.', id: 'Coba bersama: cari KPK dari 4 dan 10.' },
              template: {
                en: '\\text{Multiples of 4: } 4,\\ 8,\\ 12,\\ ___,\\ 20 \\qquad \\text{Multiples of 10: } 10,\\ 20 \\qquad \\text{LCM} = ___',
                id: '\\text{Kelipatan 4: } 4,\\ 8,\\ 12,\\ ___,\\ 20 \\qquad \\text{Kelipatan 10: } 10,\\ 20 \\qquad \\text{KPK} = ___',
              },
              blanks: ['16', '20'],
              explain: {
                en: 'After 12, the next multiple of 4 is 16. The first number in both lists is 20, so the LCM is 20.',
                id: 'Setelah 12, kelipatan 4 berikutnya adalah 16. Bilangan pertama yang ada di kedua daftar adalah 20, jadi KPK-nya 20.',
              },
              hint: {
                en: 'Each multiple of 4 is 4 more than the one before it. Then find the first number that is in both lists.',
                id: 'Tiap kelipatan 4 lebih besar 4 dari sebelumnya. Lalu cari bilangan pertama yang ada di kedua daftar.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The picture shows the factor trees of 12 and 18. What is the LCM of 12 and 18?',
                id: 'Gambar menunjukkan pohon faktor 12 dan 18. Berapa KPK dari 12 dan 18?',
              },
              figure: {
                ...factorTrees([T(12, T(2), T(6, T(2), T(3))), T(18, T(2), T(9, T(3), T(3)))]),
                caption: { en: 'The factor trees of 12 (left) and 18 (right).', id: 'Pohon faktor dari 12 (kiri) dan 18 (kanan).' },
              },
              options: [
                { en: '36', id: '36' },
                { en: '6', id: '6' },
                { en: '216', id: '216' },
                { en: '30', id: '30' },
              ],
              answer: 0,
              explain: {
                en: 'Take each prime as many times as it appears most often: two 2s and two 3s. $2 \\times 2 \\times 3 \\times 3 = 36$. 6 is the GCF, 216 is $12 \\times 18$ (much too big) and 30 is $12 + 18$.',
                id: 'Ambil tiap bilangan prima sebanyak kemunculan terbanyaknya: dua angka 2 dan dua angka 3. $2 \\times 2 \\times 3 \\times 3 = 36$. 6 adalah FPB, 216 adalah $12 \\times 18$ (jauh terlalu besar), dan 30 adalah $12 + 18$.',
              },
              hint: {
                en: 'Count how many 2s are in each tree and keep the larger count. Do the same for the 3s.',
                id: 'Hitung berapa angka 2 di tiap pohon dan ambil yang lebih banyak. Lakukan hal yang sama untuk angka 3.',
              },
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: {
                en: 'The picture shows jumps of 4 and jumps of 6 from 0. Choose the two numbers in the picture that are common multiples of 4 and 6.',
                id: 'Gambar menunjukkan lompatan 4 dan lompatan 6 dari 0. Pilih dua bilangan pada gambar yang merupakan kelipatan persekutuan 4 dan 6.',
              },
              figure: {
                ...skipLine({ to: 24, a: 4, b: 6, labelEvery: 2, mark: 'none' }),
                caption: { en: 'Jumps of 4 (top) and jumps of 6 (bottom).', id: 'Lompatan 4 (atas) dan lompatan 6 (bawah).' },
              },
              options: [
                { en: '12', id: '12' },
                { en: '24', id: '24' },
                { en: '18', id: '18' },
                { en: '8', id: '8' },
                { en: '16', id: '16' },
              ],
              answer: [0, 1],
              explain: {
                en: '12 and 24 are where both sets of jumps land. 18 is only a multiple of 6, while 8 and 16 are only multiples of 4.',
                id: '12 dan 24 adalah tempat kedua lompatan mendarat. 18 hanya kelipatan 6, sedangkan 8 dan 16 hanya kelipatan 4.',
              },
              hint: {
                en: 'A common multiple must be a multiple of 4 and a multiple of 6 at the same time. Check each number against both rows.',
                id: 'Kelipatan persekutuan harus kelipatan 4 sekaligus kelipatan 6. Cek tiap bilangan pada kedua baris.',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: { en: 'Decide whether each statement is True or False.', id: 'Tentukan tiap pernyataan Benar atau Salah.' },
              statements: [
                { en: '24 is a multiple of 6.', id: '24 adalah kelipatan 6.' },
                { en: '6 is a multiple of 24.', id: '6 adalah kelipatan 24.' },
                { en: 'The LCM of 4 and 6 is 12.', id: 'KPK dari 4 dan 6 adalah 12.' },
                { en: 'The LCM of 5 and 10 is 50.', id: 'KPK dari 5 dan 10 adalah 50.' },
              ],
              answer: [true, false, true, false],
              explain: {
                en: '$6 \\times 4 = 24$, so 24 is a multiple of 6. Multiples of 24 start at 24, so 6 is not one. The LCM of 4 and 6 is 12. The LCM of 5 and 10 is 10, because 10 is already a multiple of 5.',
                id: '$6 \\times 4 = 24$, jadi 24 kelipatan 6. Kelipatan 24 dimulai dari 24, jadi 6 bukan kelipatannya. KPK dari 4 dan 6 adalah 12. KPK dari 5 dan 10 adalah 10, karena 10 sudah kelipatan 5.',
              },
              hint: {
                en: 'Multiples grow bigger: the number times 1, 2, 3, ... Is the first number a result of that?',
                id: 'Kelipatan makin besar: bilangan itu dikali 1, 2, 3, ... Apakah bilangan pertama termasuk hasilnya?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'What is the smallest positive whole number that can be divided exactly by 15 and also by 20?',
                id: 'Berapa bilangan asli terkecil yang habis dibagi 15 dan juga habis dibagi 20?',
              },
              blanks: [{ answer: 60 }],
              hints: [
                {
                  en: 'The number must be a multiple of 15 and a multiple of 20 at the same time. What do we call the smallest such number?',
                  id: 'Bilangan itu harus kelipatan 15 sekaligus kelipatan 20. Apa nama kelipatan persekutuan yang terkecil?',
                },
                {
                  en: 'Write the multiples of 15 and of 20 one by one, or write the prime factorization of both numbers.',
                  id: 'Tulis kelipatan 15 dan kelipatan 20 satu per satu, atau tulis faktorisasi prima kedua bilangan.',
                },
                {
                  en: '$15 = 3 \\times 5$ and $20 = 2 \\times 2 \\times 5$. Take two 2s, one 3 and one 5, then multiply.',
                  id: '$15 = 3 \\times 5$ dan $20 = 2 \\times 2 \\times 5$. Ambil dua angka 2, satu angka 3, dan satu angka 5, lalu kalikan.',
                },
              ],
              explain: {
                en: 'The LCM of 15 and 20 is $2 \\times 2 \\times 3 \\times 5 = 60$. Check: $60 \\div 15 = 4$ and $60 \\div 20 = 3$.',
                id: 'KPK dari 15 dan 20 adalah $2 \\times 2 \\times 3 \\times 5 = 60$. Cek: $60 \\div 15 = 4$ dan $60 \\div 20 = 3$.',
              },
              solution: {
                en: [
                  '15 = 3 \\times 5',
                  '20 = 2 \\times 2 \\times 5',
                  '\\text{LCM} = 2 \\times 2 \\times 3 \\times 5 = 60',
                ],
                id: [
                  '15 = 3 \\times 5',
                  '20 = 2 \\times 2 \\times 5',
                  '\\text{KPK} = 2 \\times 2 \\times 3 \\times 5 = 60',
                ],
              },
            },
          ],
        },

        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m2-s2-l2',
          title: { en: 'GCF and LCM Word Problems', id: 'Soal Cerita FPB dan KPK' },
          goal: {
            en: 'You can decide whether a story needs the GCF (FPB) or the LCM (KPK), then solve it.',
            id: 'Kamu bisa memilih FPB atau KPK untuk soal cerita, lalu menyelesaikannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Look Closely: Sharing or Repeating?', id: 'Ayo Amati: Membagi atau Mengulang?' },
              body: {
                en: 'These two stories look alike, but they need different tools. Story 1: Ani shares 8 chocolates and 12 strawberry sweets into bags that all hold the same. Story 2: light A flashes every 4 seconds and light B every 6 seconds. When do they flash together again?\n\nStory 1 is about **sharing**, so we use the GCF (FPB, greatest common factor). Story 2 is about **repeating**, so we use the LCM (KPK, lowest common multiple). Key words in the story tell us which tool.\n\n| Use the GCF (sharing) | Use the LCM (repeating) |\n| --- | --- |\n| shared equally, nothing left over | flash or leave together again |\n| the most groups or bags | repeats every few days or minutes |\n| the longest pieces or the biggest tiles | the soonest they meet again |\n\nAfter you calculate, check: the GCF is never bigger than the smaller number, and the LCM is never smaller than the bigger number.',
                id: 'Dua cerita ini mirip, tetapi alatnya berbeda. Cerita 1: Ani membagi 8 cokelat dan 12 permen stroberi ke kantong-kantong yang isinya sama. Cerita 2: lampu A menyala setiap 4 detik dan lampu B setiap 6 detik. Kapan keduanya menyala bersamaan lagi?\n\nCerita 1 tentang **membagi**, jadi kita memakai FPB. Cerita 2 tentang **mengulang**, jadi kita memakai KPK. Kata kunci di soal memberi tahu kita alatnya.\n\n| Pakai FPB (membagi) | Pakai KPK (mengulang) |\n| --- | --- |\n| dibagi sama banyak, tanpa sisa | menyala atau berangkat bersamaan lagi |\n| paling banyak kelompok atau kantong | berulang setiap beberapa hari atau menit |\n| potongan paling panjang atau ubin paling besar | paling cepat bertemu lagi |\n\nSetelah menghitung, periksa: FPB tidak pernah lebih besar daripada bilangan yang lebih kecil, dan KPK tidak pernah lebih kecil daripada bilangan yang lebih besar.',
              },
              figure: {
                ...skipLine({ to: 12, a: 4, b: 6 }),
                caption: {
                  en: 'Light A (top) flashes every 4 seconds, light B (bottom) every 6 seconds. They first flash together at second 12.',
                  id: 'Lampu A (atas) menyala tiap 4 detik, lampu B (bawah) tiap 6 detik. Mereka pertama kali menyala bersamaan di detik ke-12.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Step by Step: Packing Candy into Bags', id: 'Contoh Bertahap: Membagi Permen ke Kantong' },
              body: {
                en: 'Ani has 8 chocolates and 12 strawberry sweets. She wants to pack them into bags that all hold exactly the same, with none left over. What is the most bags she can make? How many of each sweet go in a bag?\n\n1. Step 1: Find the key words. "Exactly the same" and "the most bags" mean sharing, so use the GCF.\n2. Step 2: Write the factors of 8: 1, 2, 4, 8. Write the factors of 12: 1, 2, 3, 4, 6, 12.\n3. Step 3: The shared factors are 1, 2 and 4. The biggest is 4, so the GCF is 4.\n4. Step 4: So the most bags she can make is 4.\n5. Step 5: Work out what is in each bag. $8 \\div 4 = 2$ chocolates and $12 \\div 4 = 3$ strawberry sweets. Check: $4 \\times 2 = 8$ and $4 \\times 3 = 12$, nothing left over.\n\n**Remember:**\n\n- The GCF often means "the most groups". Read again what the question asks for.\n- After the GCF, a question may ask for one more step, such as what is in each bag.',
                id: 'Ani punya 8 cokelat dan 12 permen stroberi. Ia ingin mengemasnya ke kantong-kantong yang isinya persis sama, tanpa sisa. Paling banyak berapa kantong? Berapa permen tiap jenis di setiap kantong?\n\n1. Langkah 1: Cari kata kunci. "Persis sama" dan "paling banyak kantong" berarti membagi, jadi pakai FPB.\n2. Langkah 2: Tulis faktor 8: 1, 2, 4, 8. Tulis faktor 12: 1, 2, 3, 4, 6, 12.\n3. Langkah 3: Faktor yang sama adalah 1, 2, dan 4. Yang terbesar 4, jadi FPB-nya 4.\n4. Langkah 4: Jadi paling banyak ada 4 kantong.\n5. Langkah 5: Hitung isi tiap kantong. $8 \\div 4 = 2$ cokelat dan $12 \\div 4 = 3$ permen stroberi. Cek: $4 \\times 2 = 8$ dan $4 \\times 3 = 12$, tidak ada sisa.\n\n**Ingat:**\n\n- FPB sering berarti "paling banyak kelompok". Baca lagi apa yang ditanyakan.\n- Setelah FPB, soal bisa meminta satu langkah lagi, misalnya isi tiap kantong.',
              },
              figure: {
                ...bags(4, 2, 3),
                caption: {
                  en: 'Four bags. Each bag holds 2 chocolates (top row) and 3 strawberry sweets (bottom row).',
                  id: 'Empat kantong. Tiap kantong berisi 2 cokelat (baris atas) dan 3 permen stroberi (baris bawah).',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Watch Out!: Choosing the Wrong Tool', id: 'Awas, Jebakan!: Salah Memilih Alat' },
              body: {
                en: '| Wrong | Right |\n| --- | --- |\n| ❌ Two lights flash every 6 and 8 seconds. They flash together again after 2 seconds (the GCF). | "Together again" means the LCM, which is 24 seconds. Together cannot happen sooner than 6 seconds. |\n| ❌ 12 chocolates and 18 strawberry sweets, the most bags: LCM = 36 bags. | "The most bags" means the GCF = 6. There cannot be more bags than there are chocolates. |\n| ❌ The question asks what is in each bag, and the answer is 6 (the GCF). | The GCF = 6 is the number of bags. In each bag: 12 ÷ 6 = 2 chocolates and 18 ÷ 6 = 3 strawberry sweets. |',
                id: '| Salah | Benar |\n| --- | --- |\n| ❌ Dua lampu menyala tiap 6 dan 8 detik. Menyala bersama lagi setelah 2 detik (FPB). | "Bersama lagi" berarti KPK, yaitu 24 detik. Bersama tidak mungkin lebih cepat dari 6 detik. |\n| ❌ 12 cokelat dan 18 permen stroberi, paling banyak kantong: KPK = 36 kantong. | "Paling banyak kantong" berarti FPB = 6. Kantong tidak mungkin lebih banyak daripada cokelat yang ada. |\n| ❌ Ditanya isi tiap kantong, dijawab 6 (hasil FPB). | FPB = 6 adalah banyak kantong. Isi tiap kantong: 12 ÷ 6 = 2 cokelat dan 18 ÷ 6 = 3 permen stroberi. |',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Light A flashes every 8 seconds and light B every 12 seconds. They flash together now. In how many seconds will they flash together again? Which tool and what answer?',
                id: 'Lampu A menyala tiap 8 detik dan lampu B tiap 12 detik. Keduanya menyala bersamaan sekarang. Berapa detik lagi keduanya menyala bersamaan? Alat apa dan berapa jawabannya?',
              },
              figure: {
                ...skipLine({ to: 24, a: 8, b: 12, labelEvery: 4, mark: 'none' }),
                caption: {
                  en: 'Light A flashes every 8 seconds (top), light B every 12 seconds (bottom).',
                  id: 'Lampu A menyala tiap 8 detik (atas), lampu B tiap 12 detik (bawah).',
                },
              },
              options: [
                { en: 'LCM, 24 seconds', id: 'KPK, 24 detik' },
                { en: 'GCF, 4 seconds', id: 'FPB, 4 detik' },
                { en: 'LCM, 96 seconds', id: 'KPK, 96 detik' },
                { en: 'Add them, 20 seconds', id: 'Jumlahkan, 20 detik' },
              ],
              answer: 0,
              explain: {
                en: '"Together again" is repeating, so use the LCM of 8 and 12, which is 24. The GCF is for sharing. 96 is $8 \\times 12$ (not the smallest), and 20 is only $8 + 12$.',
                id: '"Bersamaan lagi" artinya mengulang, jadi pakai KPK dari 8 dan 12, yaitu 24. FPB untuk membagi. 96 adalah $8 \\times 12$ (bukan yang terkecil), dan 20 hanya $8 + 12$.',
              },
              hint: {
                en: 'Ask yourself: does this story share things out, or repeat something? Then find where both rows of jumps first meet.',
                id: 'Tanyakan: apakah soal ini membagi, atau mengulang? Lalu cari tempat kedua baris lompatan pertama kali bertemu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Try it together: Siti has 16 apples and 24 oranges. She packs them into bags that all hold the same, using as many bags as possible.',
                id: 'Coba bersama: Siti punya 16 apel dan 24 jeruk. Ia mengemasnya ke kantong yang isinya sama, dengan kantong sebanyak mungkin.',
              },
              template: {
                en: '\\text{Factors of 16: } 1, 2, 4, 8, 16 \\qquad \\text{Factors of 24: } 1, 2, 3, 4, 6, 8, 12, 24 \\qquad \\text{GCF} = ___ \\qquad \\text{apples in each bag} = ___',
                id: '\\text{Faktor 16: } 1, 2, 4, 8, 16 \\qquad \\text{Faktor 24: } 1, 2, 3, 4, 6, 8, 12, 24 \\qquad \\text{FPB} = ___ \\qquad \\text{apel tiap kantong} = ___',
              },
              blanks: ['8', '2'],
              explain: {
                en: 'The biggest shared factor is 8, so there are 8 bags. Each bag has $16 \\div 8 = 2$ apples.',
                id: 'Faktor sama terbesar adalah 8, jadi ada 8 kantong. Tiap kantong berisi $16 \\div 8 = 2$ apel.',
              },
              hint: {
                en: 'Find the biggest number in both factor lists. For the apples in each bag, divide 16 by the number of bags.',
                id: 'Cari bilangan terbesar yang ada di kedua daftar faktor. Untuk apel tiap kantong, bagi 16 dengan banyak kantong.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The picture shows 12 chocolates and 18 strawberry sweets packed into 3 bags. Ani wants more bags that still hold the same. What is the most bags she can make?',
                id: 'Gambar menunjukkan 12 cokelat dan 18 permen stroberi dikemas ke dalam 3 kantong. Ani ingin kantong yang lebih banyak dengan isi tetap sama. Paling banyak berapa kantong?',
              },
              figure: {
                ...bags(3, 4, 6),
                caption: {
                  en: 'Three bags. Each has 4 chocolates (top row) and 6 strawberry sweets (bottom row).',
                  id: 'Tiga kantong. Tiap kantong berisi 4 cokelat (baris atas) dan 6 permen stroberi (baris bawah).',
                },
              },
              options: [
                { en: '6 bags', id: '6 kantong' },
                { en: '3 bags', id: '3 kantong' },
                { en: '36 bags', id: '36 kantong' },
                { en: '12 bags', id: '12 kantong' },
              ],
              answer: 0,
              explain: {
                en: 'The most bags is the GCF of 12 and 18, which is 6 (2 chocolates and 3 sweets in each). 3 bags is just one possible way, 36 is the LCM, and 12 does not divide 18.',
                id: 'Kantong terbanyak adalah FPB dari 12 dan 18, yaitu 6 (isi tiap kantong 2 cokelat dan 3 permen). 3 kantong hanya satu cara yang mungkin, 36 adalah KPK, dan 12 tidak membagi 18.',
              },
              hint: {
                en: 'Three bags is not necessarily the most. Find the biggest number that divides both 12 and 18 exactly.',
                id: 'Tiga kantong belum tentu yang terbanyak. Cari bilangan terbesar yang membagi habis 12 dan 18.',
              },
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: {
                en: 'For each problem, decide whether the tool named is the right one (True) or not (False).',
                id: 'Untuk tiap soal, tentukan apakah alat yang disebutkan tepat (Benar) atau tidak (Salah).',
              },
              statements: [
                {
                  en: '"Share 20 pencils and 30 books into as many equal packs as possible" is solved with the GCF.',
                  id: '"Membagi 20 pensil dan 30 buku ke paket sama banyak sebanyak mungkin" dikerjakan dengan FPB.',
                },
                {
                  en: '"Two buses leave together this morning, bus A every 10 minutes and bus B every 15 minutes. When do they leave together again?" is solved with the GCF.',
                  id: '"Dua bus berangkat bersama pagi ini, bus A tiap 10 menit dan bus B tiap 15 menit. Kapan berangkat bersama lagi?" dikerjakan dengan FPB.',
                },
                {
                  en: '"Two lights flash together now, light A every 6 seconds and light B every 9 seconds. When do they flash together again?" is solved with the LCM.',
                  id: '"Dua lampu menyala bersama sekarang, lampu A tiap 6 detik dan lampu B tiap 9 detik. Kapan menyala bersama lagi?" dikerjakan dengan KPK.',
                },
                {
                  en: '"Cut ribbons of 40 cm and 60 cm into equal pieces, as long as possible" is solved with the LCM.',
                  id: '"Memotong pita 40 cm dan 60 cm menjadi potongan sama panjang, sepanjang mungkin" dikerjakan dengan KPK.',
                },
              ],
              answer: [true, false, true, false],
              explain: {
                en: 'Sharing equally and "as long as possible" cut-ups are about dividing, so they use the GCF. "Leave together again" and "flash together again" are about repeating, so they use the LCM. The bus problem needs the LCM, and the ribbon problem needs the GCF.',
                id: 'Membagi sama banyak dan memotong "sepanjang mungkin" tentang membagi, jadi memakai FPB. "Berangkat bersama lagi" dan "menyala bersama lagi" tentang mengulang, jadi memakai KPK. Soal bus perlu KPK, dan soal pita perlu FPB.',
              },
              hint: {
                en: 'For each story ask: is it dividing something up, or repeating something over and over?',
                id: 'Untuk tiap cerita tanyakan: apakah ia membagi sesuatu, atau mengulang sesuatu berkali-kali?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put the steps for solving a GCF or LCM story problem in order.',
                id: 'Urutkan langkah menyelesaikan soal cerita FPB atau KPK.',
              },
              lines: {
                en: [
                  'Read the story and find the key words',
                  'Choose the tool: GCF for sharing, LCM for repeating',
                  'Work out the GCF or the LCM',
                  'Check the answer and write the unit',
                ],
                id: [
                  'Baca soal dan cari kata kuncinya',
                  'Pilih alat: FPB untuk membagi, KPK untuk mengulang',
                  'Hitung FPB atau KPK-nya',
                  'Periksa jawaban dan tulis satuannya',
                ],
              },
              explain: {
                en: 'You must know what the story asks before choosing a tool, and you calculate only after the tool is chosen.',
                id: 'Kamu harus tahu apa yang ditanyakan soal sebelum memilih alat, dan menghitung baru setelah alatnya dipilih.',
              },
              hint: {
                en: 'You cannot choose the tool before reading the story, and checking comes last.',
                id: 'Kamu tidak bisa memilih alat sebelum membaca soal, dan memeriksa dilakukan terakhir.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Mr. Joko has a blue ribbon 48 cm long and a red ribbon 72 cm long. He cuts both ribbons into pieces of equal length, as long as possible. How many pieces does he get in all?',
                id: 'Pak Joko punya pita biru 48 cm dan pita merah 72 cm. Ia memotong kedua pita menjadi potongan yang sama panjang, sepanjang mungkin. Berapa banyak potongan yang ia dapat seluruhnya?',
              },
              blanks: [{ answer: 5, after: { en: '\\text{ pieces}', id: '\\text{ potongan}' } }],
              hints: [
                {
                  en: 'Look at the key words "equal length" and "as long as possible". Is this about sharing or repeating?',
                  id: 'Lihat kata kunci "sama panjang" dan "sepanjang mungkin". Apakah ini tentang membagi atau mengulang?',
                },
                {
                  en: 'It is sharing, so use the GCF of 48 and 72. That gives the length of one piece.',
                  id: 'Ini membagi, jadi pakai FPB dari 48 dan 72. Itu memberi panjang satu potongan.',
                },
                {
                  en: 'The GCF is 24 cm. The blue ribbon gives $48 \\div 24$ pieces and the red ribbon gives $72 \\div 24$ pieces. Add them.',
                  id: 'FPB-nya 24 cm. Pita biru menjadi $48 \\div 24$ potongan dan pita merah menjadi $72 \\div 24$ potongan. Jumlahkan.',
                },
              ],
              explain: {
                en: 'The GCF of 48 and 72 is 24, so each piece is 24 cm. The blue ribbon gives 2 pieces and the red ribbon gives 3, so $2 + 3 = 5$.',
                id: 'FPB dari 48 dan 72 adalah 24, jadi tiap potongan 24 cm. Pita biru menjadi 2 potongan dan pita merah menjadi 3, jadi $2 + 3 = 5$.',
              },
              solution: {
                en: [
                  '48 = 2 \\times 2 \\times 2 \\times 2 \\times 3',
                  '72 = 2 \\times 2 \\times 2 \\times 3 \\times 3',
                  '\\text{GCF} = 2 \\times 2 \\times 2 \\times 3 = 24',
                  '48 \\div 24 = 2,\\quad 72 \\div 24 = 3',
                  '2 + 3 = 5',
                ],
                id: [
                  '48 = 2 \\times 2 \\times 2 \\times 2 \\times 3',
                  '72 = 2 \\times 2 \\times 2 \\times 3 \\times 3',
                  '\\text{FPB} = 2 \\times 2 \\times 2 \\times 3 = 24',
                  '48 \\div 24 = 2,\\quad 72 \\div 24 = 3',
                  '2 + 3 = 5',
                ],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m2-s2-p',
        runtime: 'math',
        title: { en: 'Project: Multiples and LCM', id: 'Proyek: Kelipatan dan KPK' },
        brief: {
          en: 'Four problems about multiples, the LCM (KPK) and the GCF (FPB), ending with a puzzle that needs some thinking.',
          id: 'Empat soal tentang kelipatan, KPK, dan FPB, ditutup dengan teka-teki yang perlu berpikir.',
        },
        requirements: [
          { en: 'List multiples and find the LCM with a list or prime factorization.', id: 'Menuliskan kelipatan dan mencari KPK dengan daftar atau faktorisasi prima.' },
          { en: 'Choose the GCF or the LCM from the key words of a story.', id: 'Memilih FPB atau KPK dari kata kunci pada soal cerita.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'How many multiples of 6 are there that are bigger than 0 and smaller than 50?',
              id: 'Ada berapa kelipatan 6 yang lebih dari 0 dan kurang dari 50?',
            },
            blanks: [{ answer: 8 }],
            solution: ['6, 12, 18, 24, 30, 36, 42, 48 \\rightarrow 8'],
          },
          {
            prompt: {
              en: 'Mrs. Siti has 30 nastar cakes and 42 kastengel cakes. She puts them on plates that all hold the same, using as many plates as possible. How many plates does she use?',
              id: 'Bu Siti punya 30 kue nastar dan 42 kue kastengel. Ia menaruhnya di piring-piring yang isinya sama, dengan piring sebanyak mungkin. Berapa piring yang ia pakai?',
            },
            blanks: [{ answer: 6, after: { en: '\\text{ plates}', id: '\\text{ piring}' } }],
            solution: {
              en: ['30 = 2 \\times 3 \\times 5', '42 = 2 \\times 3 \\times 7', '\\text{GCF} = 2 \\times 3 = 6'],
              id: ['30 = 2 \\times 3 \\times 5', '42 = 2 \\times 3 \\times 7', '\\text{FPB} = 2 \\times 3 = 6'],
            },
          },
          {
            prompt: {
              en: 'Bus A leaves the terminal every 15 minutes and bus B every 18 minutes. They leave together at 06.00. After how many minutes do they leave together again?',
              id: 'Bus A berangkat dari terminal tiap 15 menit dan bus B tiap 18 menit. Keduanya berangkat bersama pukul 06.00. Berapa menit kemudian keduanya berangkat bersama lagi?',
            },
            blanks: [{ answer: 90, after: { en: '\\text{ minutes}', id: '\\text{ menit}' } }],
            solution: {
              en: ['15 = 3 \\times 5', '18 = 2 \\times 3 \\times 3', '\\text{LCM} = 2 \\times 3 \\times 3 \\times 5 = 90'],
              id: ['15 = 3 \\times 5', '18 = 2 \\times 3 \\times 3', '\\text{KPK} = 2 \\times 3 \\times 3 \\times 5 = 90'],
            },
          },
          {
            prompt: {
              en: 'Today (day 0) Ani and Budi swim together. After that, Ani swims every 4 days and Budi every 6 days. Counting from day 1 to day 60 (including day 60), how many times do they swim on the same day?',
              id: 'Hari ini (hari ke-0) Ani dan Budi berenang bersama. Setelah itu Ani berenang tiap 4 hari dan Budi tiap 6 hari. Dihitung dari hari ke-1 sampai hari ke-60 (termasuk hari ke-60), berapa kali mereka berenang pada hari yang sama?',
            },
            blanks: [{ answer: 5, after: { en: '\\text{ times}', id: '\\text{ kali}' } }],
            solution: {
              en: ['\\text{LCM}(4,6) = 12', '12,\\ 24,\\ 36,\\ 48,\\ 60 \\rightarrow 5'],
              id: ['\\text{KPK}(4,6) = 12', '12,\\ 24,\\ 36,\\ 48,\\ 60 \\rightarrow 5'],
            },
          },
        ],
        hints: [
          {
            en: 'Multiples of 6 come from 6 × 1, 6 × 2, 6 × 3, ... Keep going until you reach 50.',
            id: 'Kelipatan 6 didapat dari 6 × 1, 6 × 2, 6 × 3, ... Teruskan sampai mencapai 50.',
          },
          {
            en: 'Read the key words: "as many plates as possible" is sharing, "leave together again" is repeating.',
            id: 'Baca kata kuncinya: "piring sebanyak mungkin" berarti membagi, "berangkat bersama lagi" berarti mengulang.',
          },
          {
            en: 'For the last task, the days they swim together are the common multiples of 4 and 6. Find the LCM, then count its multiples up to 60.',
            id: 'Untuk soal terakhir, hari mereka berenang bersama adalah kelipatan persekutuan 4 dan 6. Cari KPK-nya, lalu hitung kelipatannya sampai 60.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
