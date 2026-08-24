import type { Module } from '../types'

/** Module 1 — arithmetic and the math module, in a math-flavored voice. */
export const module1: Module = {
  id: 'pymat-m1',
  title: { en: 'Values and Expressions', id: 'Nilai dan Ekspresi' },
  summary: {
    en: 'Do arithmetic, reach for the math module, and evaluate a formula the way you would on paper.',
    id: 'Berhitung, memakai modul math, dan mengevaluasi formula seperti di atas kertas.',
  },
  submodules: [
    /* ------------------------------------------------- 1.1 variables & arithmetic */
    {
      id: 'pymat-m1-s1',
      title: { en: 'Variables and Arithmetic', id: 'Variabel dan Aritmetika' },
      summary: {
        en: 'Store a number, combine it with others, and reach for math when + - * / are not enough.',
        id: 'Simpan sebuah angka, gabungkan dengan angka lain, dan pakai math saat + - * / tak cukup.',
      },
      lessons: [
        {
          id: 'pymat-m1-s1-l1',
          title: { en: 'Numbers and Operators', id: 'Angka dan Operator' },
          goal: { en: 'Compute with +, -, *, /, //, %, and **.', id: 'Berhitung dengan +, -, *, /, //, %, dan **.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The four you already know', id: 'Empat yang sudah kamu kenal' },
              body: {
                en: '`+` `-` `*` `/` work the way they do on paper. One difference: `/` always gives a **decimal** answer, even when it divides evenly — `10 / 2` is `5.0`, not `5`.',
                id: '`+` `-` `*` `/` bekerja seperti di atas kertas. Satu bedanya: `/` selalu memberi jawaban **desimal**, bahkan saat hasilnya bulat — `10 / 2` adalah `5.0`, bukan `5`.',
              },
              code: 'print(3 + 4)\nprint(10 - 6)\nprint(2 * 5)\nprint(9 / 4)',
              output: '7\n4\n10\n2.25',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Floor division, remainder, and power', id: 'Bagi bulat, sisa bagi, dan pangkat' },
              body: {
                en: '`//` keeps only the whole part of a division. `%` gives what is left over. `**` raises to a power. And Python follows the same order of operations as math class — multiplication and division before addition and subtraction — so parentheses are how you override it.',
                id: '`//` hanya menyimpan bagian bulat dari pembagian. `%` memberi sisanya. `**` memangkatkan. Dan Python mengikuti urutan operasi yang sama seperti pelajaran matematika — kali dan bagi sebelum tambah dan kurang — jadi kurung adalah cara mengubahnya.',
              },
              code: 'print(9 // 4)\nprint(9 % 4)\nprint(2 ** 5)\nprint(2 + 3 * 4)\nprint((2 + 3) * 4)',
              output: '2\n1\n32\n14\n20',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'a = 17\nb = 5\nprint(a // b)\nprint(a % b)',
              options: [
                { en: '3, then 2', id: '3, lalu 2' },
                { en: '3.4, then 2', id: '3.4, lalu 2' },
                { en: '2, then 3', id: '2, lalu 3' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: '17 fits into 5 three whole times (15), with 2 left over.',
                id: '17 memuat 5 sebanyak tiga kali penuh (15), sisanya 2.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Compute the area of a rectangle with length `p` and width `l`, store it in `luas`.',
                id: 'Hitung luas persegi panjang dengan panjang `p` dan lebar `l`, simpan di `luas`.',
              },
              template: 'p = 8\nl = 5\nluas = p ___ l\nprint(luas)',
              blanks: ['*'],
              explain: {
                en: 'Area is length times width — the same formula as on paper.',
                id: 'Luas adalah panjang kali lebar — formula yang sama seperti di atas kertas.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints the average of three values a, b, c (10, 20, 30).',
                id: 'Susun program yang mencetak rata-rata tiga nilai a, b, c (10, 20, 30).',
              },
              lines: ['a = 10', 'b = 20', 'c = 30', 'rata = (a + b + c) / 3', 'print(rata)'],
              explain: {
                en: 'The parentheses matter here: without them, `/ 3` would only divide `c`.',
                id: 'Kurungnya penting di sini: tanpanya, `/ 3` hanya akan membagi `c`.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read two whole numbers, `a` then `b`. Print their sum, their difference (`a - b`), and their product, each on its own line.',
                id: 'Baca dua bilangan bulat, `a` lalu `b`. Cetak jumlahnya, selisihnya (`a - b`), dan hasil kalinya, masing-masing di baris sendiri.',
              },
              starter: 'a = int(input())\nb = int(input())\n',
              tests: [
                { name: { en: '10, 3', id: '10, 3' }, stdin: ['10', '3'], expectOutput: '13\n7\n30' },
                { name: { en: '5, 5', id: '5, 5' }, stdin: ['5', '5'], expectOutput: '10\n0\n25' },
                { name: { en: '0, 7', id: '0, 7' }, stdin: ['0', '7'], expectOutput: '7\n-7\n0' },
                { name: { en: '-4, 6 (negative)', id: '-4, 6 (negatif)' }, stdin: ['-4', '6'], expectOutput: '2\n-10\n-24' },
              ],
              hints: [
                { en: 'Three print() calls, one per value.', id: 'Tiga pemanggilan print(), satu per nilai.' },
                { en: 'Order matters for the difference: it is a minus b, not b minus a.', id: 'Urutan penting untuk selisih: itu a dikurangi b, bukan b dikurangi a.' },
              ],
              solution: 'a = int(input())\nb = int(input())\nprint(a + b)\nprint(a - b)\nprint(a * b)',
            },
          ],
        },
        {
          id: 'pymat-m1-s1-l2',
          title: { en: 'The math Module', id: 'Modul math' },
          goal: { en: 'Reach for sqrt, floor, ceil, and pi.', id: 'Memakai sqrt, floor, ceil, dan pi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'import brings in more tools', id: 'import membawa lebih banyak alat' },
              body: {
                en: 'The operators cover arithmetic; everything else — square roots, trigonometry, constants like π — lives in the **`math` module**. `import math` loads it, and its tools are reached with a dot: `math.sqrt(16)`.',
                id: 'Operatornya mencakup aritmetika; selebihnya — akar kuadrat, trigonometri, konstanta seperti π — ada di **modul `math`**. `import math` memuatnya, dan alatnya dijangkau dengan titik: `math.sqrt(16)`.',
              },
              code: 'import math\nprint(math.sqrt(16))\nprint(math.sqrt(2))',
              output: '4.0\n1.4142135623730951',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Rounding, and a constant', id: 'Pembulatan, dan sebuah konstanta' },
              body: {
                en: '`math.floor` always rounds down, `math.ceil` always rounds up — both return a whole number. The built-in `round(x, n)` rounds to `n` decimal places instead. `math.pi` is π itself, already computed to many digits.',
                id: '`math.floor` selalu membulatkan ke bawah, `math.ceil` selalu ke atas — keduanya mengembalikan bilangan bulat. `round(x, n)` bawaan Python membulatkan ke `n` angka desimal. `math.pi` adalah π sendiri, sudah dihitung sampai banyak digit.',
              },
              code: 'import math\nprint(math.floor(4.7))\nprint(math.ceil(4.2))\nprint(round(math.pi, 2))',
              output: '4\n5\n3.14',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'import math\nprint(math.floor(-4.2))\nprint(math.ceil(-4.2))',
              options: [
                { en: '-5, then -4', id: '-5, lalu -4' },
                { en: '-4, then -5', id: '-4, lalu -5' },
                { en: '-4, then -4', id: '-4, lalu -4' },
                { en: '-5, then -5', id: '-5, lalu -5' },
              ],
              answer: 0,
              explain: {
                en: 'Down means more negative: floor(-4.2) is -5, not -4. Ceiling still rounds up, to -4.',
                id: 'Ke bawah berarti lebih negatif: floor(-4.2) adalah -5, bukan -4. Ceiling tetap membulatkan ke atas, ke -4.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Round the square root of 50 to 2 decimal places, store it in `hasil`.',
                id: 'Bulatkan akar dari 50 ke 2 angka desimal, simpan di `hasil`.',
              },
              template: 'import math\nhasil = ___(math.sqrt(50), 2)\nprint(hasil)',
              blanks: ['round'],
              explain: {
                en: 'round() takes the value first, then how many decimal places.',
                id: 'round() mengambil nilainya lebih dulu, lalu berapa angka desimalnya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints the circumference of a circle with radius 7 (`2 * pi * r`), rounded to 2 decimal places.',
                id: 'Susun program yang mencetak keliling lingkaran berjari-jari 7 (`2 * pi * r`), dibulatkan ke 2 angka desimal.',
              },
              lines: ['import math', 'r = 7', 'keliling = 2 * math.pi * r', 'print(round(keliling, 2))'],
              explain: {
                en: 'import has to come before math is used, and the formula reads left to right just like the name.',
                id: 'import harus datang sebelum math dipakai, dan formulanya dibaca kiri ke kanan seperti namanya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a radius `r` (it may have a decimal point). Print the area of the circle (`pi * r ** 2`), rounded to 2 decimal places.',
                id: 'Baca jari-jari `r` (bisa berupa desimal). Cetak luas lingkarannya (`pi * r ** 2`), dibulatkan ke 2 angka desimal.',
              },
              starter: 'import math\nr = float(input())\n',
              tests: [
                { name: { en: 'r = 1', id: 'r = 1' }, stdin: ['1'], expectOutput: '3.14' },
                { name: { en: 'r = 2', id: 'r = 2' }, stdin: ['2'], expectOutput: '12.57' },
                { name: { en: 'r = 5', id: 'r = 5' }, stdin: ['5'], expectOutput: '78.54' },
                { name: { en: 'r = 0', id: 'r = 0' }, stdin: ['0'], expectOutput: '0.0' },
              ],
              hints: [
                { en: 'The formula is math.pi * r ** 2 — ** binds tighter than *.', id: 'Formulanya math.pi * r ** 2 — ** mengikat lebih erat daripada *.' },
                { en: 'Round the final area, not r itself.', id: 'Bulatkan luas akhirnya, bukan r itu sendiri.' },
              ],
              solution: 'import math\nr = float(input())\nluas = math.pi * r ** 2\nprint(round(luas, 2))',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m1-s1-p',
        title: { en: 'Distance Between Two Points', id: 'Jarak Dua Titik' },
        brief: {
          en: 'Given two points on a plane, compute the straight-line distance between them.',
          id: 'Diberikan dua titik pada bidang, hitung jarak garis lurus antara keduanya.',
        },
        requirements: [
          { en: 'Read `x1`, `y1`, `x2`, `y2` — one per line, each may have a decimal point.', id: 'Baca `x1`, `y1`, `x2`, `y2` — satu per baris, masing-masing bisa desimal.' },
          { en: 'Compute the distance with `sqrt((x2 - x1)**2 + (y2 - y1)**2)`.', id: 'Hitung jaraknya dengan `sqrt((x2 - x1)**2 + (y2 - y1)**2)`.' },
          { en: 'Print it rounded to 2 decimal places.', id: 'Cetak hasilnya dibulatkan ke 2 angka desimal.' },
        ],
        starter: 'import math\nx1 = float(input())\ny1 = float(input())\nx2 = float(input())\ny2 = float(input())\n',
        tests: [
          { name: { en: '(0,0) to (3,4) → 5.0', id: '(0,0) ke (3,4) → 5.0' }, stdin: ['0', '0', '3', '4'], expectOutput: '5.0' },
          { name: { en: 'same point → 0.0', id: 'titik sama → 0.0' }, stdin: ['1', '1', '1', '1'], expectOutput: '0.0' },
          { name: { en: '(0,0) to (1,1) → 1.41', id: '(0,0) ke (1,1) → 1.41' }, stdin: ['0', '0', '1', '1'], expectOutput: '1.41' },
          { name: { en: 'negative coordinates', id: 'koordinat negatif' }, stdin: ['-2', '-3', '2', '3'], expectOutput: '7.21' },
        ],
        hints: [
          { en: 'Find dx and dy first: x2 - x1, y2 - y1.', id: 'Cari dx dan dy dulu: x2 - x1, y2 - y1.' },
          { en: 'math.sqrt takes one argument — build the sum under the root first.', id: 'math.sqrt mengambil satu argumen — susun dulu jumlah di bawah akarnya.' },
        ],
        solution:
          'import math\nx1 = float(input())\ny1 = float(input())\nx2 = float(input())\ny2 = float(input())\ndx = x2 - x1\ndy = y2 - y1\njarak = math.sqrt(dx ** 2 + dy ** 2)\nprint(round(jarak, 2))',
        xp: 50,
      },
    },

    /* --------------------------------------------------- 1.2 formulas & rounding */
    {
      id: 'pymat-m1-s2',
      title: { en: 'Formulas and Rounding', id: 'Formula dan Pembulatan' },
      summary: {
        en: 'Show numbers the way a report would, and evaluate a formula with several variables at once.',
        id: 'Tampilkan angka seperti pada laporan, dan evaluasi formula dengan beberapa variabel sekaligus.',
      },
      lessons: [
        {
          id: 'pymat-m1-s2-l1',
          title: { en: 'f-strings', id: 'f-string' },
          goal: { en: 'Show a value inside a sentence.', id: 'Menampilkan nilai di dalam kalimat.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A string with values baked in', id: 'String dengan nilai tertanam' },
              body: {
                en: 'An `f` before the opening quote turns `{ }` into a window onto a real expression. Python evaluates what is inside and drops the result straight into the text.',
                id: '`f` sebelum tanda kutip pembuka mengubah `{ }` menjadi jendela ke ekspresi sungguhan. Python mengevaluasi isinya dan menaruh hasilnya langsung ke dalam teks.',
              },
              code: 'nama = "Rina"\nnilai = 95\nprint(f"{nama} mendapat {nilai}")',
              output: 'Rina mendapat 95',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Controlling decimal places', id: 'Mengatur angka desimal' },
              body: {
                en: 'Add `:.2f` right before the closing brace and the value is shown with exactly that many decimal places — padded with zeros if it needs them. `round()` changes the *number*; `:.2f` only changes how it is *shown*.',
                id: 'Tambahkan `:.2f` tepat sebelum kurung tutupnya, dan nilainya ditampilkan dengan tepat sejumlah angka desimal itu — ditambal nol kalau perlu. `round()` mengubah *angkanya*; `:.2f` hanya mengubah cara *menampilkannya*.',
              },
              code: 'pi = 3.14159265\nprint(f"{pi:.2f}")\nprint(f"{pi:.4f}")',
              output: '3.14\n3.1416',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'x = 7\nprint(f"Nilai x adalah {x * 2}")',
              options: [
                { en: 'Nilai x adalah 14', id: 'Nilai x adalah 14' },
                { en: 'Nilai x adalah x * 2', id: 'Nilai x adalah x * 2' },
                { en: 'Nilai x adalah {x * 2}', id: 'Nilai x adalah {x * 2}' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'Whatever is inside { } is evaluated first — here, 7 * 2 — and only the result is shown.',
                id: 'Apa pun yang ada di dalam { } dievaluasi lebih dulu — di sini, 7 * 2 — dan hanya hasilnya yang ditampilkan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Print `Luas: 12.50` from `luas = 12.5`, with 2 decimal places.',
                id: 'Cetak `Luas: 12.50` dari `luas = 12.5`, dengan 2 angka desimal.',
              },
              template: 'luas = 12.5\nprint(f"Luas: {luas___}")',
              blanks: [':.2f'],
              explain: {
                en: 'The format spec goes right after the expression, still inside the braces.',
                id: 'Spesifikasi formatnya diletakkan tepat setelah ekspresinya, masih di dalam kurung kurawal.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints `Suhu: 36.7 C` from `celsius = 36.66`, rounded to 1 decimal place via the f-string.',
                id: 'Susun program yang mencetak `Suhu: 36.7 C` dari `celsius = 36.66`, dibulatkan ke 1 angka desimal lewat f-string.',
              },
              lines: ['celsius = 36.66', 'print(f"Suhu: {celsius:.1f} C")'],
              explain: {
                en: ':.1f rounds and shows one decimal place, all in one step.',
                id: ':.1f membulatkan dan menampilkan satu angka desimal, sekaligus.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a name and a decimal `nilai`. Print `nama: X.XX` with the value shown to 2 decimal places, using an f-string.',
                id: 'Baca sebuah nama dan `nilai` desimal. Cetak `nama: X.XX` dengan nilainya ditampilkan 2 angka desimal, memakai f-string.',
              },
              starter: 'nama = input()\nnilai = float(input())\n',
              tests: [
                { name: { en: 'Budi, 88', id: 'Budi, 88' }, stdin: ['Budi', '88'], expectOutput: 'Budi: 88.00' },
                { name: { en: 'Sari, 72.5', id: 'Sari, 72.5' }, stdin: ['Sari', '72.5'], expectOutput: 'Sari: 72.50' },
                { name: { en: 'Ali, 100', id: 'Ali, 100' }, stdin: ['Ali', '100'], expectOutput: 'Ali: 100.00' },
                { name: { en: 'Nina, 0', id: 'Nina, 0' }, stdin: ['Nina', '0'], expectOutput: 'Nina: 0.00' },
              ],
              hints: [
                { en: 'One f-string, both values inside it.', id: 'Satu f-string, kedua nilainya di dalamnya.' },
                { en: 'f"{nama}: {nilai:.2f}"', id: 'f"{nama}: {nilai:.2f}"' },
              ],
              solution: 'nama = input()\nnilai = float(input())\nprint(f"{nama}: {nilai:.2f}")',
            },
          ],
        },
        {
          id: 'pymat-m1-s2-l2',
          title: { en: 'Multi-variable Formulas', id: 'Formula Multi-variabel' },
          goal: { en: 'Evaluate a formula with several named quantities.', id: 'Mengevaluasi formula dengan beberapa besaran bernama.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Name every quantity first', id: 'Beri nama tiap besaran dulu' },
              body: {
                en: 'A formula reads best when every quantity has a name that matches the problem — `berat` and `tinggi`, not `a` and `b`. `**` binds tighter than `/`, so `berat / tinggi ** 2` divides by the *square* of `tinggi`, exactly as intended.',
                id: 'Formula paling enak dibaca kalau tiap besaran punya nama yang cocok dengan soalnya — `berat` dan `tinggi`, bukan `a` dan `b`. `**` mengikat lebih erat daripada `/`, jadi `berat / tinggi ** 2` membagi dengan *kuadrat* dari `tinggi`, persis seperti maksudnya.',
              },
              code: 'berat = 65\ntinggi = 1.7\nbmi = berat / tinggi ** 2\nprint(round(bmi, 1))',
              output: '22.5',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same formula, twice', id: 'Formula yang sama, dua kali' },
              body: {
                en: 'Nothing stops the same formula appearing more than once with different values. It works, but writing it out twice is also a hint — later you will wrap a formula like this in a function so it is written only once.',
                id: 'Tidak ada yang melarang formula yang sama muncul lebih dari sekali dengan nilai berbeda. Ini berjalan, tapi menulisnya dua kali juga sebuah petunjuk — nanti kamu akan membungkus formula seperti ini dalam sebuah fungsi supaya hanya ditulis sekali.',
              },
              code: 'p1 = 100000\np2 = 250000\npajak1 = p1 * 0.1\npajak2 = p2 * 0.1\nprint(pajak1)\nprint(pajak2)',
              output: '10000.0\n25000.0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'a = 2\nb = 3\nc = 4\nhasil = a + b * c\nprint(hasil)',
              options: [
                { en: '14', id: '14' },
                { en: '20', id: '20' },
                { en: '24', id: '24' },
                { en: '9', id: '9' },
              ],
              answer: 0,
              explain: {
                en: 'Multiplication first: b * c is 12, then a + 12 is 14.',
                id: 'Kali dulu: b * c adalah 12, lalu a + 12 adalah 14.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Compute a discounted price: the price minus (price times percent over 100). `harga = 200000`, `persen = 15`.',
                id: 'Hitung harga setelah diskon: harga dikurangi (harga kali persen per 100). `harga = 200000`, `persen = 15`.',
              },
              template: 'harga = 200000\npersen = 15\nharga_akhir = harga ___ (harga * persen / 100)\nprint(harga_akhir)',
              blanks: ['-'],
              explain: {
                en: 'The discount amount is computed first inside the parentheses, then subtracted.',
                id: 'Besaran diskonnya dihitung dulu di dalam kurung, baru dikurangkan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints the perimeter of a rectangle (`2 * (p + l)`) with `p = 12`, `l = 5`.',
                id: 'Susun program yang mencetak keliling persegi panjang (`2 * (p + l)`) dengan `p = 12`, `l = 5`.',
              },
              lines: ['p = 12', 'l = 5', 'keliling = 2 * (p + l)', 'print(keliling)'],
              explain: {
                en: 'Without the parentheses, 2 * p + l would only double p.',
                id: 'Tanpa kurungnya, 2 * p + l hanya akan menggandakan p.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `massa` (kg) and `tinggi` (m). Compute BMI (`massa / tinggi ** 2`) and print it rounded to 1 decimal place.',
                id: 'Baca `massa` (kg) dan `tinggi` (m). Hitung BMI (`massa / tinggi ** 2`) dan cetak dibulatkan ke 1 angka desimal.',
              },
              starter: 'massa = float(input())\ntinggi = float(input())\n',
              tests: [
                { name: { en: '65, 1.7', id: '65, 1.7' }, stdin: ['65', '1.7'], expectOutput: '22.5' },
                { name: { en: '80, 1.8', id: '80, 1.8' }, stdin: ['80', '1.8'], expectOutput: '24.7' },
                { name: { en: '50, 1.6', id: '50, 1.6' }, stdin: ['50', '1.6'], expectOutput: '19.5' },
                { name: { en: '90, 2.0', id: '90, 2.0' }, stdin: ['90', '2.0'], expectOutput: '22.5' },
              ],
              hints: [
                { en: 'One line for the formula, one to print it.', id: 'Satu baris untuk formulanya, satu untuk mencetaknya.' },
                { en: 'bmi = massa / tinggi ** 2', id: 'bmi = massa / tinggi ** 2' },
              ],
              solution: 'massa = float(input())\ntinggi = float(input())\nbmi = massa / tinggi ** 2\nprint(round(bmi, 1))',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m1-s2-p',
        title: { en: 'Compound Interest Calculator', id: 'Kalkulator Bunga Majemuk' },
        brief: {
          en: 'Given a starting amount, a yearly interest rate, and a number of years, compute the final amount.',
          id: 'Diberikan modal awal, suku bunga tahunan, dan lama tahun, hitung nilai akhirnya.',
        },
        requirements: [
          { en: 'Read `pokok` (starting amount), `bunga` (rate as a percent, e.g. 5 for 5%), and `tahun` (a whole number of years).', id: 'Baca `pokok` (modal awal), `bunga` (suku bunga dalam persen, mis. 5 untuk 5%), dan `tahun` (bilangan bulat tahun).' },
          { en: 'Compute the final amount: `pokok * (1 + bunga / 100) ** tahun`.', id: 'Hitung nilai akhirnya: `pokok * (1 + bunga / 100) ** tahun`.' },
          { en: 'Print it rounded to 2 decimal places.', id: 'Cetak hasilnya dibulatkan ke 2 angka desimal.' },
        ],
        starter: 'pokok = float(input())\nbunga = float(input())\ntahun = int(input())\n',
        tests: [
          { name: { en: '1,000,000 at 5% for 1 year', id: '1.000.000 pada 5% selama 1 tahun' }, stdin: ['1000000', '5', '1'], expectOutput: '1050000.0' },
          { name: { en: '1,000,000 at 5% for 2 years', id: '1.000.000 pada 5% selama 2 tahun' }, stdin: ['1000000', '5', '2'], expectOutput: '1102500.0' },
          { name: { en: '500,000 at 10% for 3 years', id: '500.000 pada 10% selama 3 tahun' }, stdin: ['500000', '10', '3'], expectOutput: '665500.0' },
          { name: { en: 'zero interest', id: 'bunga nol' }, stdin: ['200000', '0', '5'], expectOutput: '200000.0' },
        ],
        hints: [
          { en: 'Turn the percent into a fraction first: bunga / 100.', id: 'Ubah persennya jadi pecahan dulu: bunga / 100.' },
          { en: '** applies to (1 + bunga / 100) as a whole, raised to tahun.', id: '** berlaku untuk (1 + bunga / 100) sebagai satu kesatuan, dipangkatkan tahun.' },
        ],
        solution:
          'pokok = float(input())\nbunga = float(input())\ntahun = int(input())\nakhir = pokok * (1 + bunga / 100) ** tahun\nprint(round(akhir, 2))',
        xp: 50,
      },
    },
  ],
}
