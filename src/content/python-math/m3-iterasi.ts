import type { Module } from '../types'

/** Module 3 — for-loop accumulation, then while-loop numerical approximation. */
export const module3: Module = {
  id: 'pymat-m3',
  title: { en: 'Series and Iteration', id: 'Deret dan Iterasi' },
  summary: {
    en: 'Sum a series with a loop, then let a loop converge on an answer instead of computing it directly.',
    id: 'Jumlahkan deret dengan perulangan, lalu biarkan perulangan menghampiri jawaban alih-alih menghitungnya langsung.',
  },
  submodules: [
    /* --------------------------------------------- 3.1 for loops & accumulation */
    {
      id: 'pymat-m3-s1',
      title: { en: 'for Loops and Accumulation', id: 'Perulangan for dan Akumulasi' },
      summary: {
        en: 'Repeat with range(), and build a running total one term at a time.',
        id: 'Berulang dengan range(), dan bangun total berjalan satu suku demi satu suku.',
      },
      lessons: [
        {
          id: 'pymat-m3-s1-l1',
          title: { en: 'range() and for', id: 'range() dan for' },
          goal: { en: 'Repeat a fixed number of times.', id: 'Mengulang sejumlah kali yang tetap.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'for walks through a range', id: 'for berjalan menyusuri range' },
              body: {
                en: '`range(5)` counts `0, 1, 2, 3, 4` — five values, starting at 0, stopping *before* 5. `for i in range(5):` runs the indented block once for each of them, with `i` holding the current one.',
                id: '`range(5)` menghitung `0, 1, 2, 3, 4` — lima nilai, mulai dari 0, berhenti *sebelum* 5. `for i in range(5):` menjalankan blok yang menjorok satu kali untuk tiap nilainya, dengan `i` menyimpan nilai saat itu.',
              },
              code: 'for i in range(5):\n    print(i)',
              output: '0\n1\n2\n3\n4',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Starting somewhere other than 0', id: 'Mulai dari selain 0' },
              body: {
                en: '`range(a, b)` counts from `a` up to, but not including, `b`. To count `1` through `5`, the stop has to be `6`.',
                id: '`range(a, b)` menghitung dari `a` sampai, tapi tidak termasuk, `b`. Untuk menghitung `1` sampai `5`, batas akhirnya harus `6`.',
              },
              code: 'for i in range(1, 6):\n    print(i)',
              output: '1\n2\n3\n4\n5',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'for i in range(2, 10, 2):\n    print(i)',
              options: [
                { en: '2, then 4, then 6, then 8', id: '2, lalu 4, lalu 6, lalu 8' },
                { en: '2, then 4, then 6, then 8, then 10', id: '2, lalu 4, lalu 6, lalu 8, lalu 10' },
                { en: '2, then 3, then 4, ... then 9', id: '2, lalu 3, lalu 4, ... lalu 9' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'The third number in range is the step — count by 2s, stopping before 10.',
                id: 'Angka ketiga di range adalah langkahnya — hitung per 2, berhenti sebelum 10.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Print the numbers 1 through 10.',
                id: 'Cetak angka 1 sampai 10.',
              },
              template: 'for i in range(1, ___):\n    print(i)',
              blanks: ['11'],
              explain: {
                en: 'To include 10, the stop value has to be one past it.',
                id: 'Untuk mencakup 10, batas akhirnya harus satu lebih dari itu.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble the 3-times table from 3 to 30.',
                id: 'Susun tabel perkalian 3 dari 3 sampai 30.',
              },
              lines: ['for i in range(1, 11):', '    print(3 * i)'],
              explain: {
                en: 'i counts 1 through 10; multiplying each by 3 gives the table.',
                id: 'i menghitung 1 sampai 10; mengalikan tiap nilainya dengan 3 menghasilkan tabelnya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `n`. Print the numbers 1 through `n`, each on its own line.',
                id: 'Baca bilangan bulat `n`. Cetak angka 1 sampai `n`, masing-masing di baris sendiri.',
              },
              starter: 'n = int(input())\n',
              tests: [
                { name: { en: 'n = 3', id: 'n = 3' }, stdin: ['3'], expectOutput: '1\n2\n3' },
                { name: { en: 'n = 1', id: 'n = 1' }, stdin: ['1'], expectOutput: '1' },
                { name: { en: 'n = 5', id: 'n = 5' }, stdin: ['5'], expectOutput: '1\n2\n3\n4\n5' },
              ],
              hints: [
                { en: 'range(1, n + 1) — the +1 is what includes n itself.', id: 'range(1, n + 1) — +1 itulah yang membuat n sendiri ikut tercakup.' },
              ],
              solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)',
            },
          ],
        },
        {
          id: 'pymat-m3-s1-l2',
          title: { en: 'Accumulating a Sum', id: 'Mengakumulasi Jumlah' },
          goal: { en: 'Build a running total across a loop.', id: 'Membangun total berjalan sepanjang perulangan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A variable that grows', id: 'Variabel yang bertambah' },
              body: {
                en: 'Start a `total` at 0 before the loop, then add to it on every pass. `total = total + i` reads the current total, adds `i`, and stores the result back — a pattern called an **accumulator**.',
                id: 'Mulai `total` dari 0 sebelum perulangannya, lalu tambahkan padanya di tiap putaran. `total = total + i` membaca total saat itu, menambahkan `i`, dan menyimpan hasilnya kembali — pola yang disebut **akumulator**.',
              },
              code: 'total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)',
              output: '15',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '+= says the same thing, shorter', id: '+= mengatakan hal yang sama, lebih ringkas' },
              body: {
                en: '`total += i` means exactly `total = total + i`. It reads as "add i to total", which is usually what an accumulator is doing.',
                id: '`total += i` artinya persis `total = total + i`. Ia terbaca sebagai "tambahkan i ke total", yang biasanya memang itulah yang dilakukan sebuah akumulator.',
              },
              code: 'total = 0\nfor i in range(1, 5):\n    total += i ** 2\nprint(total)',
              output: '30',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'total = 0\nfor i in range(2, 7, 2):\n    total += i\nprint(total)',
              options: [
                { en: '12', id: '12' },
                { en: '20', id: '20' },
                { en: '6', id: '6' },
                { en: '2', id: '2' },
              ],
              answer: 0,
              explain: {
                en: 'The loop visits 2, 4, 6 — their sum is 12.',
                id: 'Perulangannya melewati 2, 4, 6 — jumlahnya 12.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Accumulate a product instead of a sum, to compute 1 × 2 × 3 × 4.',
                id: 'Akumulasikan hasil kali, bukan jumlah, untuk menghitung 1 × 2 × 3 × 4.',
              },
              template: 'hasil = 1\nfor i in range(1, 5):\n    hasil ___ i\nprint(hasil)',
              blanks: ['*='],
              explain: {
                en: 'A product accumulator starts at 1 (not 0) and multiplies on each pass.',
                id: 'Akumulator hasil kali mulai dari 1 (bukan 0) dan mengalikan di tiap putaran.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that sums the multiples of 3 from 1 to 20.',
                id: 'Susun program yang menjumlahkan kelipatan 3 dari 1 sampai 20.',
              },
              lines: ['total = 0', 'for i in range(1, 21):', '    if i % 3 == 0:', '        total += i', 'print(total)'],
              explain: {
                en: 'An if inside the loop decides which terms get added at all.',
                id: 'if di dalam perulangan menentukan suku mana saja yang benar-benar ditambahkan.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `n`. Print the sum of the squares 1² + 2² + ... + n².',
                id: 'Baca bilangan bulat `n`. Cetak jumlah kuadrat 1² + 2² + ... + n².',
              },
              starter: 'n = int(input())\n',
              tests: [
                { name: { en: 'n = 1 → 1', id: 'n = 1 → 1' }, stdin: ['1'], expectOutput: '1' },
                { name: { en: 'n = 2 → 5', id: 'n = 2 → 5' }, stdin: ['2'], expectOutput: '5' },
                { name: { en: 'n = 4 → 30', id: 'n = 4 → 30' }, stdin: ['4'], expectOutput: '30' },
                { name: { en: 'n = 5 → 55', id: 'n = 5 → 55' }, stdin: ['5'], expectOutput: '55' },
              ],
              hints: [
                { en: 'An accumulator starting at 0, adding i ** 2 each pass.', id: 'Akumulator mulai dari 0, menambahkan i ** 2 tiap putaran.' },
              ],
              solution: 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i ** 2\nprint(total)',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m3-s1-p',
        title: { en: 'Sum of an Arithmetic Series', id: 'Jumlah Deret Aritmetika' },
        brief: {
          en: 'An arithmetic series has a first term and a fixed difference between consecutive terms. Sum the first n terms.',
          id: 'Deret aritmetika punya suku pertama dan selisih tetap antar suku berurutan. Jumlahkan n suku pertamanya.',
        },
        requirements: [
          { en: 'Read `a` (first term), `d` (common difference), and `n` (number of terms) — a and d may have a decimal point.', id: 'Baca `a` (suku pertama), `d` (beda), dan `n` (banyak suku) — a dan d bisa desimal.' },
          { en: 'Term i (starting at 0) is `a + i * d`. Sum terms 0 through n-1.', id: 'Suku ke-i (mulai dari 0) adalah `a + i * d`. Jumlahkan suku 0 sampai n-1.' },
          { en: 'Print the total rounded to 2 decimal places.', id: 'Cetak totalnya dibulatkan ke 2 angka desimal.' },
        ],
        starter: 'a = float(input())\nd = float(input())\nn = int(input())\n',
        tests: [
          { name: { en: '1, 1, 5 terms → 15.0', id: '1, 1, 5 suku → 15.0' }, stdin: ['1', '1', '5'], expectOutput: '15.0' },
          { name: { en: '2, 3, 4 terms → 26.0', id: '2, 3, 4 suku → 26.0' }, stdin: ['2', '3', '4'], expectOutput: '26.0' },
          { name: { en: '0, 0.5, 3 terms → 1.5', id: '0, 0.5, 3 suku → 1.5' }, stdin: ['0', '0.5', '3'], expectOutput: '1.5' },
          { name: { en: 'decreasing series', id: 'deret menurun' }, stdin: ['10', '-2', '5'], expectOutput: '30.0' },
        ],
        hints: [
          { en: 'Loop i from 0 to n-1 with range(n).', id: 'Ulangi i dari 0 sampai n-1 dengan range(n).' },
          { en: 'Accumulate a + i * d each pass.', id: 'Akumulasikan a + i * d tiap putaran.' },
        ],
        solution:
          'a = float(input())\nd = float(input())\nn = int(input())\ntotal = 0\nfor i in range(n):\n    total += a + i * d\nprint(round(total, 2))',
        xp: 50,
      },
    },

    /* -------------------------------------- 3.2 while loops & numerical approximation */
    {
      id: 'pymat-m3-s2',
      title: { en: 'while Loops and Numerical Approximation', id: 'Perulangan while dan Pendekatan Numerik' },
      summary: {
        en: 'Repeat until a condition on the value itself says stop — the shape behind every numerical method.',
        id: 'Berulang sampai kondisi pada nilainya sendiri berkata berhenti — bentuk di balik setiap metode numerik.',
      },
      lessons: [
        {
          id: 'pymat-m3-s2-l1',
          title: { en: 'while Loops', id: 'Perulangan while' },
          goal: { en: 'Repeat based on a condition, not a fixed count.', id: 'Mengulang berdasarkan kondisi, bukan hitungan tetap.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'while checks before every pass', id: 'while memeriksa sebelum tiap putaran' },
              body: {
                en: '`while condition:` repeats the block for as long as `condition` stays `True`. Nothing here counts passes automatically — the loop only knows to stop because `i` is updated inside it.',
                id: '`while kondisi:` mengulang bloknya selama `kondisi` tetap `True`. Tak ada yang menghitung putaran secara otomatis di sini — perulangannya hanya tahu kapan berhenti karena `i` diperbarui di dalamnya.',
              },
              code: 'i = 1\nwhile i <= 5:\n    print(i)\n    i += 1',
              output: '1\n2\n3\n4\n5',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Stopping on the value, not a counter', id: 'Berhenti pada nilainya, bukan pencacah' },
              body: {
                en: 'A while loop does not need a counter at all — it can repeat until *the value itself* crosses a threshold. Here, halving stops as soon as x is no longer bigger than 1.',
                id: 'Perulangan while sama sekali tak butuh pencacah — ia bisa mengulang sampai *nilainya sendiri* melewati sebuah ambang batas. Di sini, membagi dua berhenti begitu x tidak lagi lebih besar dari 1.',
              },
              code: 'x = 100\nwhile x > 1:\n    x = x / 2\nprint(round(x, 2))',
              output: '0.78',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'How many times does x get halved, starting from 20, before x is no longer above 1?', id: 'Berapa kali x dibagi dua, mulai dari 20, sebelum x tak lagi di atas 1?' },
              code: 'x = 20\ncount = 0\nwhile x > 1:\n    x = x / 2\n    count += 1\nprint(count)',
              options: [
                { en: '5', id: '5' },
                { en: '4', id: '4' },
                { en: '20', id: '20' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: '20 → 10 → 5 → 2.5 → 1.25 → 0.625 — five halvings before it drops to 1 or under.',
                id: '20 → 10 → 5 → 2.5 → 1.25 → 0.625 — lima kali dibagi dua sebelum turun ke 1 atau kurang.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the loop so it keeps adding 1, 2, 3, ... while the total has not yet passed 50.',
                id: 'Lengkapi perulangannya agar terus menambahkan 1, 2, 3, ... selama totalnya belum melewati 50.',
              },
              template: 'total = 0\ni = 1\nwhile total ___ 50:\n    total += i\n    i += 1\nprint(total)',
              blanks: ['<='],
              explain: {
                en: 'The loop should keep going while the total is still at or under 50.',
                id: 'Perulangannya harus terus jalan selama totalnya masih di atau di bawah 50.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a countdown from 5 to 1, followed by "Selesai!".',
                id: 'Susun hitung mundur dari 5 ke 1, diikuti "Selesai!".',
              },
              lines: ['i = 5', 'while i > 0:', '    print(i)', '    i -= 1', 'print("Selesai!")'],
              explain: {
                en: 'The final print sits outside the loop, at the outer indentation — it runs once, after i reaches 0.',
                id: 'Print terakhirnya ada di luar perulangan, pada indentasi luar — ia berjalan sekali, setelah i mencapai 0.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a positive whole number `n`. Count how many times it can be halved with integer division (`n = n // 2`) before it is no longer above 1, and print the count.',
                id: 'Baca bilangan bulat positif `n`. Hitung berapa kali ia bisa dibagi dua dengan pembagian bulat (`n = n // 2`) sebelum tidak lagi di atas 1, lalu cetak hitungannya.',
              },
              starter: 'n = int(input())\n',
              tests: [
                { name: { en: 'n = 1 → 0', id: 'n = 1 → 0' }, stdin: ['1'], expectOutput: '0' },
                { name: { en: 'n = 2 → 1', id: 'n = 2 → 1' }, stdin: ['2'], expectOutput: '1' },
                { name: { en: 'n = 8 → 3', id: 'n = 8 → 3' }, stdin: ['8'], expectOutput: '3' },
                { name: { en: 'n = 16 → 4', id: 'n = 16 → 4' }, stdin: ['16'], expectOutput: '4' },
                { name: { en: 'n = 100 → 6', id: 'n = 100 → 6' }, stdin: ['100'], expectOutput: '6' },
              ],
              hints: [
                { en: 'The loop condition is n > 1, same as the countdown example but shrinking by halves.', id: 'Kondisi perulangannya n > 1, sama seperti contoh hitung mundur tapi mengecil per separuh.' },
              ],
              solution: 'n = int(input())\ncount = 0\nwhile n > 1:\n    n = n // 2\n    count += 1\nprint(count)',
            },
          ],
        },
        {
          id: 'pymat-m3-s2-l2',
          title: { en: "Approximating a Square Root (Newton's Method)", id: 'Menaksir Akar Kuadrat (Metode Newton)' },
          goal: { en: 'Let a loop converge on an answer instead of computing it directly.', id: 'Biarkan perulangan menghampiri jawaban alih-alih menghitungnya langsung.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Guess, then improve the guess', id: 'Menebak, lalu memperbaiki tebakan' },
              body: {
                en: "There is no `sqrt` here — only a guess that gets better each time. Averaging a guess with `n` divided by that guess pulls it toward the real root; repeating it a few times gets remarkably close. This is **Newton's method**.",
                id: 'Tidak ada `sqrt` di sini — hanya tebakan yang membaik tiap kali. Merata-ratakan sebuah tebakan dengan `n` dibagi tebakan itu menariknya mendekati akar sebenarnya; mengulanginya beberapa kali membuatnya sangat dekat. Inilah **metode Newton**.',
              },
              code: 'n = 10\ntebak = n / 2\ntebak = (tebak + n / tebak) / 2\ntebak = (tebak + n / tebak) / 2\nprint(round(tebak, 4))',
              output: '3.1786',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Repeat until it stops changing much', id: 'Ulangi sampai tak banyak berubah lagi' },
              body: {
                en: 'Instead of copying the update line a fixed number of times, a `while` loop repeats it until `tebak * tebak` is close enough to `n` — within `0.0001`, say. `abs()` measures "close" in either direction.',
                id: 'Alih-alih menyalin baris pembaruannya berkali-kali, perulangan `while` mengulanginya sampai `tebak * tebak` cukup dekat dengan `n` — dalam jarak `0.0001`, misalnya. `abs()` mengukur "dekat" dari kedua arah.',
              },
              code: 'n = 10\ntebak = n / 2\nwhile abs(tebak * tebak - n) > 0.0001:\n    tebak = (tebak + n / tebak) / 2\nprint(round(tebak, 4))',
              output: '3.1623',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'For n = 16, starting from tebak = 8, what is tebak after exactly one update?', id: 'Untuk n = 16, mulai dari tebak = 8, berapa tebak setelah tepat satu pembaruan?' },
              code: 'n = 16\ntebak = 8\ntebak = (tebak + n / tebak) / 2\nprint(tebak)',
              options: [
                { en: '5.0', id: '5.0' },
                { en: '8.0', id: '8.0' },
                { en: '4.0', id: '4.0' },
                { en: '2.0', id: '2.0' },
              ],
              answer: 0,
              explain: {
                en: '(8 + 16/8) / 2 is (8 + 2) / 2, which is 5.0.',
                id: '(8 + 16/8) / 2 adalah (8 + 2) / 2, yaitu 5.0.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the update formula.',
                id: 'Lengkapi rumus pembaruannya.',
              },
              template: 'n = 25\ntebak = 5\ntebak = (tebak + n / tebak) ___ 2\nprint(tebak)',
              blanks: ['/'],
              explain: {
                en: 'The average of two numbers is their sum divided by 2.',
                id: 'Rata-rata dua bilangan adalah jumlahnya dibagi 2.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: "Assemble Newton's method as a while loop, approximating the square root of 2.",
                id: 'Susun metode Newton sebagai perulangan while, menaksir akar dari 2.',
              },
              lines: [
                'n = 2',
                'tebak = 1.0',
                'while abs(tebak * tebak - n) > 0.0001:',
                '    tebak = (tebak + n / tebak) / 2',
                'print(round(tebak, 4))',
              ],
              explain: {
                en: 'Same shape as the concept above, with a starting guess of 1.0 instead of n / 2 — Newton\'s method does not need a particular starting point, only a nonzero one.',
                id: 'Bentuknya sama seperti pada konsep di atas, dengan tebakan awal 1.0 alih-alih n / 2 — metode Newton tidak butuh titik awal tertentu, hanya yang bukan nol.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a positive number `n`. Starting from `tebak = n / 2`, apply Newton\'s method — `tebak = (tebak + n / tebak) / 2` — until `abs(tebak * tebak - n)` is under `0.0001`. Leave the final value in `tebak` (printing it is optional).',
                id: 'Baca bilangan positif `n`. Mulai dari `tebak = n / 2`, terapkan metode Newton — `tebak = (tebak + n / tebak) / 2` — sampai `abs(tebak * tebak - n)` di bawah `0.0001`. Biarkan nilai akhirnya di `tebak` (mencetaknya opsional).',
              },
              starter: 'n = float(input())\ntebak = n / 2\n',
              tests: [
                {
                  name: { en: 'n = 4 → tebak ≈ 2.0', id: 'n = 4 → tebak ≈ 2.0' },
                  stdin: ['4'],
                  assert: 'assert abs(tebak - 2.0) < 0.001, f"tebak harus mendekati 2.0, sekarang: {tebak}"',
                },
                {
                  name: { en: 'n = 2 → tebak ≈ 1.41421', id: 'n = 2 → tebak ≈ 1,41421' },
                  stdin: ['2'],
                  assert: 'assert abs(tebak - 1.41421356) < 0.001, f"tebak harus mendekati 1.41421, sekarang: {tebak}"',
                },
                {
                  name: { en: 'n = 9 → tebak ≈ 3.0', id: 'n = 9 → tebak ≈ 3.0' },
                  stdin: ['9'],
                  assert: 'assert abs(tebak - 3.0) < 0.001, f"tebak harus mendekati 3.0, sekarang: {tebak}"',
                },
                {
                  name: { en: 'n = 100 → tebak ≈ 10.0', id: 'n = 100 → tebak ≈ 10.0' },
                  stdin: ['100'],
                  assert: 'assert abs(tebak - 10.0) < 0.001, f"tebak harus mendekati 10.0, sekarang: {tebak}"',
                },
              ],
              hints: [
                { en: 'The variable must end up named tebak — that is what gets checked.', id: 'Variabelnya harus tetap bernama tebak — itulah yang diperiksa.' },
                { en: 'This is the exact while loop from the concept steps above.', id: 'Ini persis perulangan while dari langkah konsep di atas.' },
              ],
              solution: 'n = float(input())\ntebak = n / 2\nwhile abs(tebak * tebak - n) > 0.0001:\n    tebak = (tebak + n / tebak) / 2\nprint(round(tebak, 4))',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m3-s2-p',
        title: { en: "Approximating a Cube Root (Newton's Method, Generalized)", id: 'Menaksir Akar Pangkat Tiga (Metode Newton, Diperumum)' },
        brief: {
          en: 'The same converging idea applies to any root. Adapt the update formula to approximate a cube root instead of a square root.',
          id: 'Ide penghampiran yang sama berlaku untuk akar apa pun. Sesuaikan rumus pembaruannya untuk menaksir akar pangkat tiga, bukan akar kuadrat.',
        },
        requirements: [
          { en: 'Read a positive number `n`.', id: 'Baca bilangan positif `n`.' },
          { en: 'Start from `tebak = n / 3`.', id: 'Mulai dari `tebak = n / 3`.' },
          { en: "Repeat `tebak = (2 * tebak + n / tebak ** 2) / 3` until `abs(tebak ** 3 - n)` is under `0.0001`.", id: 'Ulangi `tebak = (2 * tebak + n / tebak ** 2) / 3` sampai `abs(tebak ** 3 - n)` di bawah `0.0001`.' },
          { en: 'Leave the final value in `tebak`.', id: 'Biarkan nilai akhirnya di `tebak`.' },
        ],
        starter: 'n = float(input())\ntebak = n / 3\n',
        tests: [
          {
            name: { en: 'n = 8 → tebak ≈ 2.0', id: 'n = 8 → tebak ≈ 2.0' },
            stdin: ['8'],
            assert: 'assert abs(tebak - 2.0) < 0.001, f"tebak harus mendekati 2.0, sekarang: {tebak}"',
          },
          {
            name: { en: 'n = 27 → tebak ≈ 3.0', id: 'n = 27 → tebak ≈ 3.0' },
            stdin: ['27'],
            assert: 'assert abs(tebak - 3.0) < 0.001, f"tebak harus mendekati 3.0, sekarang: {tebak}"',
          },
          {
            name: { en: 'n = 1 → tebak ≈ 1.0', id: 'n = 1 → tebak ≈ 1.0' },
            stdin: ['1'],
            assert: 'assert abs(tebak - 1.0) < 0.001, f"tebak harus mendekati 1.0, sekarang: {tebak}"',
          },
          {
            name: { en: 'n = 1000 → tebak ≈ 10.0', id: 'n = 1000 → tebak ≈ 10.0' },
            stdin: ['1000'],
            assert: 'assert abs(tebak - 10.0) < 0.001, f"tebak harus mendekati 10.0, sekarang: {tebak}"',
          },
        ],
        hints: [
          { en: 'Same shape as the square-root version, with ** 2 and / 3 instead of / 2.', id: 'Bentuknya sama seperti versi akar kuadrat, dengan ** 2 dan / 3, bukan / 2.' },
          { en: 'The loop condition compares tebak ** 3 to n, not tebak * tebak.', id: 'Kondisi perulangannya membandingkan tebak ** 3 dengan n, bukan tebak * tebak.' },
        ],
        solution:
          'n = float(input())\ntebak = n / 3\nwhile abs(tebak ** 3 - n) > 0.0001:\n    tebak = (2 * tebak + n / tebak ** 2) / 3\nprint(round(tebak, 4))',
        xp: 50,
      },
    },
  ],
}
