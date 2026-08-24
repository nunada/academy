import type { Module } from '../types'

/** Module 4 — functions as f(x), then recursion. */
export const module4: Module = {
  id: 'pymat-m4',
  title: { en: 'Functions as f(x)', id: 'Fungsi sebagai f(x)' },
  summary: {
    en: 'Wrap a formula in a function so it is written once and called many times, then let a function call itself.',
    id: 'Bungkus formula dalam fungsi supaya ditulis sekali dan dipanggil berkali-kali, lalu biarkan fungsi memanggil dirinya sendiri.',
  },
  submodules: [
    /* ------------------------------------------- 4.1 defining math functions */
    {
      id: 'pymat-m4-s1',
      title: { en: 'Defining Math Functions', id: 'Mendefinisikan Fungsi Matematis' },
      summary: {
        en: 'def turns a formula into something you call with different inputs, instead of writing it out each time.',
        id: 'def mengubah formula menjadi sesuatu yang dipanggil dengan input berbeda, alih-alih menuliskannya ulang tiap kali.',
      },
      lessons: [
        {
          id: 'pymat-m4-s1-l1',
          title: { en: 'def and return', id: 'def dan return' },
          goal: { en: 'Turn a formula into a reusable function.', id: 'Mengubah formula menjadi fungsi yang bisa dipakai ulang.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A function is a named formula', id: 'Fungsi adalah formula bernama' },
              body: {
                en: '`def kuadrat(x):` names a function and the input it expects. `return` hands back the result of calling it, without printing anything itself — the caller decides what to do with it.',
                id: '`def kuadrat(x):` menamai sebuah fungsi dan input yang diharapkannya. `return` mengembalikan hasil pemanggilannya, tanpa mencetak apa pun sendiri — pemanggilnya yang menentukan mau diapakan hasilnya.',
              },
              code: 'def kuadrat(x):\n    return x ** 2\n\nprint(kuadrat(3))\nprint(kuadrat(5))',
              output: '9\n25',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One formula, written once', id: 'Satu formula, ditulis sekali' },
              body: {
                en: 'This is the payoff from module 1: the tax formula that was written out twice there now lives in one place, called with whatever price it is needed for.',
                id: 'Inilah manfaat yang dijanjikan di modul 1: formula pajak yang dulu ditulis dua kali di sana kini hidup di satu tempat, dipanggil dengan harga berapa pun yang dibutuhkan.',
              },
              code: 'def pajak(harga):\n    return harga * 0.1\n\nprint(pajak(100000))\nprint(pajak(250000))',
              output: '10000.0\n25000.0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'def kali_dua(n):\n    return n * 2\n\nhasil = kali_dua(7) + kali_dua(3)\nprint(hasil)',
              options: [
                { en: '20', id: '20' },
                { en: '10', id: '10' },
                { en: '14', id: '14' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'kali_dua(7) is 14 and kali_dua(3) is 6 — 14 + 6 is 20.',
                id: 'kali_dua(7) adalah 14 dan kali_dua(3) adalah 6 — 14 + 6 adalah 20.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete a function that cubes its input.',
                id: 'Lengkapi fungsi yang memangkatkan tiga inputnya.',
              },
              template: 'def pangkat_tiga(x):\n    return x ___ 3\n\nprint(pangkat_tiga(2))',
              blanks: ['**'],
              explain: {
                en: 'Cubing is raising to the power of 3.',
                id: 'Memangkatkan tiga berarti dipangkatkan 3.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a function converting Celsius to Fahrenheit, and call it with 100.',
                id: 'Susun fungsi yang mengonversi Celsius ke Fahrenheit, dan panggil dengan 100.',
              },
              lines: ['def ke_fahrenheit(celsius):', '    return celsius * 9 / 5 + 32', 'print(ke_fahrenheit(100))'],
              explain: {
                en: 'The def line and its indented body have to stay together, before any call to it.',
                id: 'Baris def dan isinya yang menjorok harus tetap bersama, sebelum ada pemanggilan padanya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Define `f(x)` returning `x**2 - 3*x + 2`. Read a whole number `x` and print `f(x)`.',
                id: 'Definisikan `f(x)` yang mengembalikan `x**2 - 3*x + 2`. Baca bilangan bulat `x` dan cetak `f(x)`.',
              },
              starter: 'def f(x):\n    pass\n\nx = int(input())\n',
              tests: [
                { name: { en: 'x = 0 → 2', id: 'x = 0 → 2' }, stdin: ['0'], expectOutput: '2' },
                { name: { en: 'x = 1 → 0', id: 'x = 1 → 0' }, stdin: ['1'], expectOutput: '0' },
                { name: { en: 'x = 2 → 0', id: 'x = 2 → 0' }, stdin: ['2'], expectOutput: '0' },
                { name: { en: 'x = 5 → 12', id: 'x = 5 → 12' }, stdin: ['5'], expectOutput: '12' },
                { name: { en: 'x = -1 → 6', id: 'x = -1 → 6' }, stdin: ['-1'], expectOutput: '6' },
              ],
              hints: [
                { en: 'return x ** 2 - 3 * x + 2, then call f(x) inside print.', id: 'return x ** 2 - 3 * x + 2, lalu panggil f(x) di dalam print.' },
              ],
              solution: 'def f(x):\n    return x ** 2 - 3 * x + 2\n\nx = int(input())\nprint(f(x))',
            },
          ],
        },
        {
          id: 'pymat-m4-s1-l2',
          title: { en: 'Functions with Several Parameters', id: 'Fungsi dengan Banyak Parameter' },
          goal: { en: 'Take more than one input, and call one function from another.', id: 'Menerima lebih dari satu input, dan memanggil satu fungsi dari fungsi lain.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'More than one parameter', id: 'Lebih dari satu parameter' },
              body: {
                en: 'Separate parameters with commas, in the definition and in every call. Their order is how Python matches each argument to each name.',
                id: 'Pisahkan parameter dengan koma, baik di definisi maupun tiap pemanggilan. Urutannya adalah cara Python mencocokkan tiap argumen dengan tiap nama.',
              },
              code: 'def luas_persegi_panjang(p, l):\n    return p * l\n\nprint(luas_persegi_panjang(8, 5))\nprint(luas_persegi_panjang(3, 3))',
              output: '40\n9',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A function calling a function', id: 'Fungsi memanggil fungsi' },
              body: {
                en: 'Once `kuadrat` exists, other functions can call it just like anything else — this is how a big formula gets built out of small, named pieces.',
                id: 'Begitu `kuadrat` ada, fungsi lain bisa memanggilnya seperti hal lain — begitulah cara formula besar dibangun dari potongan-potongan kecil yang bernama.',
              },
              code: 'def kuadrat(x):\n    return x ** 2\n\ndef jumlah_kuadrat(a, b):\n    return kuadrat(a) + kuadrat(b)\n\nprint(jumlah_kuadrat(3, 4))',
              output: '25',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'def volume_balok(p, l, t):\n    return p * l * t\n\nprint(volume_balok(2, 3, 4))',
              options: [
                { en: '24', id: '24' },
                { en: '9', id: '9' },
                { en: '20', id: '20' },
                { en: 'An error — too many arguments', id: 'Error — argumennya terlalu banyak' },
              ],
              answer: 0,
              explain: {
                en: 'p, l, t match 2, 3, 4 in order; 2 * 3 * 4 is 24.',
                id: 'p, l, t cocok dengan 2, 3, 4 berurutan; 2 * 3 * 4 adalah 24.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete a function computing the hypotenuse of a right triangle from legs a and b.',
                id: 'Lengkapi fungsi yang menghitung sisi miring segitiga siku-siku dari sisi a dan b.',
              },
              template: 'import math\n\ndef sisi_miring(a, b):\n    return math.sqrt(a ___ 2 + b ** 2)\n\nprint(sisi_miring(3, 4))',
              blanks: ['**'],
              explain: {
                en: 'Both legs are squared before being added, the same as the concept from module 1.',
                id: 'Kedua sisinya dikuadratkan sebelum dijumlahkan, sama seperti konsep dari modul 1.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a BMI function and print the result for massa=65, tinggi=1.7, rounded to 1 decimal place.',
                id: 'Susun fungsi BMI dan cetak hasilnya untuk massa=65, tinggi=1.7, dibulatkan ke 1 angka desimal.',
              },
              lines: ['def hitung_bmi(massa, tinggi):', '    return massa / tinggi ** 2', 'print(round(hitung_bmi(65, 1.7), 1))'],
              explain: {
                en: 'The same BMI formula from module 1, now wrapped as a function that can be called with anyone\'s numbers.',
                id: 'Formula BMI yang sama dari modul 1, kini dibungkus sebagai fungsi yang bisa dipanggil dengan angka siapa saja.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Define `jarak(x1, y1, x2, y2)` returning the distance between the two points. Read the four values and print `jarak(...)` rounded to 2 decimal places.',
                id: 'Definisikan `jarak(x1, y1, x2, y2)` yang mengembalikan jarak antara kedua titik. Baca keempat nilainya dan cetak `jarak(...)` dibulatkan ke 2 angka desimal.',
              },
              starter: 'import math\n\ndef jarak(x1, y1, x2, y2):\n    pass\n\nx1 = float(input())\ny1 = float(input())\nx2 = float(input())\ny2 = float(input())\n',
              tests: [
                { name: { en: '(0,0) to (3,4) → 5.0', id: '(0,0) ke (3,4) → 5.0' }, stdin: ['0', '0', '3', '4'], expectOutput: '5.0' },
                { name: { en: 'same point → 0.0', id: 'titik sama → 0.0' }, stdin: ['1', '1', '1', '1'], expectOutput: '0.0' },
                { name: { en: '(0,0) to (1,1) → 1.41', id: '(0,0) ke (1,1) → 1.41' }, stdin: ['0', '0', '1', '1'], expectOutput: '1.41' },
                { name: { en: 'negative coordinates', id: 'koordinat negatif' }, stdin: ['-2', '-3', '2', '3'], expectOutput: '7.21' },
              ],
              hints: [
                { en: 'The same formula as the module 1 project, now inside a function.', id: 'Formula yang sama seperti proyek modul 1, kini di dalam fungsi.' },
              ],
              solution:
                'import math\n\ndef jarak(x1, y1, x2, y2):\n    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)\n\nx1 = float(input())\ny1 = float(input())\nx2 = float(input())\ny2 = float(input())\nprint(round(jarak(x1, y1, x2, y2), 2))',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m4-s1-p',
        title: { en: 'Function Table', id: 'Tabel Nilai Fungsi' },
        brief: {
          en: 'Print a table of x and f(x) for a range of whole-number x values.',
          id: 'Cetak tabel x dan f(x) untuk sederet nilai x bilangan bulat.',
        },
        requirements: [
          { en: 'Define `f(x)` returning `2 * x - 1`.', id: 'Definisikan `f(x)` yang mengembalikan `2 * x - 1`.' },
          { en: 'Read `awal` and `akhir` (whole numbers, inclusive on both ends).', id: 'Baca `awal` dan `akhir` (bilangan bulat, kedua batasnya termasuk).' },
          { en: 'For each x from awal to akhir, print `x f(x)` separated by a single space.', id: 'Untuk tiap x dari awal sampai akhir, cetak `x f(x)` dipisah satu spasi.' },
        ],
        starter: 'def f(x):\n    return 2 * x - 1\n\nawal = int(input())\nakhir = int(input())\n',
        tests: [
          { name: { en: '1 to 3', id: '1 sampai 3' }, stdin: ['1', '3'], expectOutput: '1 1\n2 3\n3 5' },
          { name: { en: '0 to 2 (includes negative f)', id: '0 sampai 2 (ada f negatif)' }, stdin: ['0', '2'], expectOutput: '0 -1\n1 1\n2 3' },
          { name: { en: 'single value', id: 'satu nilai' }, stdin: ['5', '5'], expectOutput: '5 9' },
        ],
        hints: [
          { en: 'range(awal, akhir + 1) — the +1 keeps akhir itself in the table.', id: 'range(awal, akhir + 1) — +1-nya membuat akhir sendiri tetap masuk tabel.' },
          { en: 'f"{x} {f(x)}" builds the whole line in one f-string.', id: 'f"{x} {f(x)}" menyusun seluruh barisnya dalam satu f-string.' },
        ],
        solution: 'def f(x):\n    return 2 * x - 1\n\nawal = int(input())\nakhir = int(input())\nfor x in range(awal, akhir + 1):\n    print(f"{x} {f(x)}")',
        xp: 50,
      },
    },

    /* --------------------------------------------------------------- 4.2 recursion */
    {
      id: 'pymat-m4-s2',
      title: { en: 'Recursion', id: 'Rekursi' },
      summary: {
        en: 'A function that calls itself, on a smaller version of the same problem, until a base case ends it.',
        id: 'Fungsi yang memanggil dirinya sendiri, pada versi lebih kecil dari soal yang sama, sampai kasus dasar mengakhirinya.',
      },
      lessons: [
        {
          id: 'pymat-m4-s2-l1',
          title: { en: 'A Function Calling Itself', id: 'Fungsi Memanggil Dirinya Sendiri' },
          goal: { en: 'Write a recursive function with a base case.', id: 'Menulis fungsi rekursif dengan kasus dasar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Factorial, defined by itself', id: 'Faktorial, didefinisikan oleh dirinya sendiri' },
              body: {
                en: '`n!` is `n` times `(n-1)!`, and `0!` is 1 by definition. That second part is the **base case** — without it, the function would call itself forever. Every recursive function needs one.',
                id: '`n!` adalah `n` dikali `(n-1)!`, dan `0!` adalah 1 menurut definisi. Bagian kedua itulah **kasus dasar** — tanpanya, fungsinya akan memanggil dirinya sendiri selamanya. Tiap fungsi rekursif butuh itu.',
              },
              code: 'def faktorial(n):\n    if n == 0:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(5))',
              output: '120',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A smaller example, unwound', id: 'Contoh lebih kecil, terurai' },
              body: {
                en: '`faktorial(3)` calls `faktorial(2)`, which calls `faktorial(1)`, which calls `faktorial(0)` — that last one hits the base case and returns 1 without calling anything further. Then each waiting call multiplies and returns: 1, then 1, then 2, then 6.',
                id: '`faktorial(3)` memanggil `faktorial(2)`, yang memanggil `faktorial(1)`, yang memanggil `faktorial(0)` — yang terakhir itu mencapai kasus dasar dan mengembalikan 1 tanpa memanggil apa pun lagi. Lalu tiap pemanggilan yang menunggu mengalikan dan mengembalikan: 1, lalu 1, lalu 2, lalu 6.',
              },
              code: 'def faktorial(n):\n    if n == 0:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(3))\nprint(faktorial(0))',
              output: '6\n1',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'def faktorial(n):\n    if n == 0:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(4))',
              options: [
                { en: '24', id: '24' },
                { en: '10', id: '10' },
                { en: '4', id: '4' },
                { en: '12', id: '12' },
              ],
              answer: 0,
              explain: {
                en: '4! is 4 × 3 × 2 × 1, which is 24.',
                id: '4! adalah 4 × 3 × 2 × 1, yaitu 24.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the base case.',
                id: 'Lengkapi kasus dasarnya.',
              },
              template: 'def faktorial(n):\n    if n == ___:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(6))',
              blanks: ['0'],
              explain: {
                en: 'The recursion has to stop somewhere, and 0! = 1 is that stopping point.',
                id: 'Rekursinya harus berhenti di suatu titik, dan 0! = 1 adalah titik berhentinya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a recursive function summing 1 through n, and call it with 5.',
                id: 'Susun fungsi rekursif yang menjumlahkan 1 sampai n, dan panggil dengan 5.',
              },
              lines: ['def jumlah(n):', '    if n == 0:', '        return 0', '    return n + jumlah(n - 1)', 'print(jumlah(5))'],
              explain: {
                en: 'Same shape as factorial: a base case at 0, and a step that shrinks n by one.',
                id: 'Bentuknya sama seperti faktorial: kasus dasar di 0, dan langkah yang mengecilkan n satu-satu.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Define `faktorial(n)` recursively. Read a whole number `n` and print `faktorial(n)`.',
                id: 'Definisikan `faktorial(n)` secara rekursif. Baca bilangan bulat `n` dan cetak `faktorial(n)`.',
              },
              starter: 'def faktorial(n):\n    pass\n\nn = int(input())\n',
              tests: [
                { name: { en: 'n = 0 → 1', id: 'n = 0 → 1' }, stdin: ['0'], expectOutput: '1' },
                { name: { en: 'n = 1 → 1', id: 'n = 1 → 1' }, stdin: ['1'], expectOutput: '1' },
                { name: { en: 'n = 5 → 120', id: 'n = 5 → 120' }, stdin: ['5'], expectOutput: '120' },
                { name: { en: 'n = 6 → 720', id: 'n = 6 → 720' }, stdin: ['6'], expectOutput: '720' },
              ],
              hints: [
                { en: 'Exactly the definition from the concept steps above.', id: 'Persis definisi dari langkah konsep di atas.' },
              ],
              solution: 'def faktorial(n):\n    if n == 0:\n        return 1\n    return n * faktorial(n - 1)\n\nn = int(input())\nprint(faktorial(n))',
            },
          ],
        },
        {
          id: 'pymat-m4-s2-l2',
          title: { en: 'Recursive Fibonacci', id: 'Fibonacci Rekursif' },
          goal: { en: 'Write a recursive function with two base cases.', id: 'Menulis fungsi rekursif dengan dua kasus dasar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two base cases this time', id: 'Kali ini dua kasus dasar' },
              body: {
                en: 'Each Fibonacci number is the sum of the two before it — so this function calls itself **twice**. It needs a base case for both `0` and `1`, which `n <= 1` covers in one condition.',
                id: 'Tiap bilangan Fibonacci adalah jumlah dua bilangan sebelumnya — jadi fungsi ini memanggil dirinya sendiri **dua kali**. Ia butuh kasus dasar untuk `0` maupun `1`, yang dicakup `n <= 1` dalam satu kondisi.',
              },
              code: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(6))',
              output: '8',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The sequence, printed', id: 'Deretnya, dicetak' },
              body: {
                en: 'Calling `fib` in a loop, once per index, prints the familiar sequence: each number the sum of the two before it, starting from 0 and 1.',
                id: 'Memanggil `fib` dalam perulangan, sekali per indeks, mencetak deret yang dikenal: tiap bilangan adalah jumlah dua sebelumnya, mulai dari 0 dan 1.',
              },
              code: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nfor i in range(7):\n    print(fib(i))',
              output: '0\n1\n1\n2\n3\n5\n8',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does fib(7) print, continuing the same sequence?', id: 'Apa yang dicetak fib(7), melanjutkan deret yang sama?' },
              code: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(7))',
              options: [
                { en: '13', id: '13' },
                { en: '11', id: '11' },
                { en: '8', id: '8' },
                { en: '21', id: '21' },
              ],
              answer: 0,
              explain: {
                en: 'The sequence continues 0,1,1,2,3,5,8,13 — fib(7) is 13.',
                id: 'Deretnya berlanjut 0,1,1,2,3,5,8,13 — fib(7) adalah 13.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the base-case condition.',
                id: 'Lengkapi kondisi kasus dasarnya.',
              },
              template: 'def fib(n):\n    if n ___ 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(8))',
              blanks: ['<='],
              explain: {
                en: 'n <= 1 covers both base cases, 0 and 1, in a single condition.',
                id: 'n <= 1 mencakup kedua kasus dasarnya, 0 dan 1, dalam satu kondisi.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program printing the first 5 Fibonacci numbers.',
                id: 'Susun program yang mencetak 5 bilangan Fibonacci pertama.',
              },
              lines: [
                'def fib(n):',
                '    if n <= 1:',
                '        return n',
                '    return fib(n - 1) + fib(n - 2)',
                'for i in range(5):',
                '    print(fib(i))',
              ],
              explain: {
                en: 'The function is defined once, then called five times from the loop.',
                id: 'Fungsinya didefinisikan sekali, lalu dipanggil lima kali dari perulangannya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Define `fib(n)` recursively. Read a whole number `n` and print `fib(n)`.',
                id: 'Definisikan `fib(n)` secara rekursif. Baca bilangan bulat `n` dan cetak `fib(n)`.',
              },
              starter: 'def fib(n):\n    pass\n\nn = int(input())\n',
              tests: [
                { name: { en: 'n = 0 → 0', id: 'n = 0 → 0' }, stdin: ['0'], expectOutput: '0' },
                { name: { en: 'n = 1 → 1', id: 'n = 1 → 1' }, stdin: ['1'], expectOutput: '1' },
                { name: { en: 'n = 6 → 8', id: 'n = 6 → 8' }, stdin: ['6'], expectOutput: '8' },
                { name: { en: 'n = 10 → 55', id: 'n = 10 → 55' }, stdin: ['10'], expectOutput: '55' },
              ],
              hints: [
                { en: 'Two base cases in one condition: n <= 1.', id: 'Dua kasus dasar dalam satu kondisi: n <= 1.' },
              ],
              solution: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nn = int(input())\nprint(fib(n))',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m4-s2-p',
        title: { en: "Pascal's Triangle Row", id: 'Baris Segitiga Pascal' },
        brief: {
          en: 'Each entry in Pascal\'s triangle is a binomial coefficient, itself defined recursively. Print one whole row.',
          id: 'Tiap entri di segitiga Pascal adalah koefisien binomial, yang didefinisikan secara rekursif juga. Cetak satu baris utuh.',
        },
        requirements: [
          { en: 'Define `C(n, k)`: returns 1 when `k == 0` or `k == n`; otherwise `C(n-1, k-1) + C(n-1, k)`.', id: 'Definisikan `C(n, k)`: mengembalikan 1 kalau `k == 0` atau `k == n`; selain itu `C(n-1, k-1) + C(n-1, k)`.' },
          { en: 'Read a row number `n` (starting from 0).', id: 'Baca nomor baris `n` (mulai dari 0).' },
          { en: 'Print `C(n, 0)` through `C(n, n)`, separated by single spaces, on one line.', id: 'Cetak `C(n, 0)` sampai `C(n, n)`, dipisah satu spasi, dalam satu baris.' },
        ],
        starter: 'def C(n, k):\n    pass\n\nn = int(input())\n',
        tests: [
          { name: { en: 'row 0 → 1', id: 'baris 0 → 1' }, stdin: ['0'], expectOutput: '1' },
          { name: { en: 'row 1 → 1 1', id: 'baris 1 → 1 1' }, stdin: ['1'], expectOutput: '1 1' },
          { name: { en: 'row 4 → 1 4 6 4 1', id: 'baris 4 → 1 4 6 4 1' }, stdin: ['4'], expectOutput: '1 4 6 4 1' },
          { name: { en: 'row 5 → 1 5 10 10 5 1', id: 'baris 5 → 1 5 10 10 5 1' }, stdin: ['5'], expectOutput: '1 5 10 10 5 1' },
        ],
        hints: [
          { en: 'C has two base cases, at the two edges of the row: k == 0 and k == n.', id: 'C punya dua kasus dasar, di kedua ujung barisnya: k == 0 dan k == n.' },
          { en: '" ".join(...) turns a list of pieces into one spaced-out line — join needs strings, so wrap each number in str(...) first.', id: '" ".join(...) mengubah daftar potongan jadi satu baris berspasi — join butuh string, jadi bungkus tiap angkanya dengan str(...) dulu.' },
        ],
        solution:
          'def C(n, k):\n    if k == 0 or k == n:\n        return 1\n    return C(n - 1, k - 1) + C(n - 1, k)\n\nn = int(input())\nbaris = [str(C(n, k)) for k in range(n + 1)]\nprint(" ".join(baris))',
        xp: 50,
      },
    },
  ],
}
