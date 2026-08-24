import type { Module } from '../types'

/** Module 2 — comparisons, classification, and piecewise functions via elif. */
export const module2: Module = {
  id: 'pymat-m2',
  title: { en: 'Decisions for Math Domains', id: 'Keputusan untuk Domain Matematika' },
  summary: {
    en: 'Compare values, classify numbers and shapes, and evaluate a function that behaves differently across its domain.',
    id: 'Bandingkan nilai, klasifikasikan angka dan bangun, dan evaluasi fungsi yang berperilaku berbeda di tiap bagian domainnya.',
  },
  submodules: [
    /* ---------------------------------------------- 2.1 comparison & classification */
    {
      id: 'pymat-m2-s1',
      title: { en: 'Comparison and Classification', id: 'Perbandingan dan Klasifikasi' },
      summary: {
        en: 'Turn a comparison into a decision, and sort a value into one of several categories.',
        id: 'Ubah perbandingan menjadi keputusan, dan golongkan sebuah nilai ke salah satu dari beberapa kategori.',
      },
      lessons: [
        {
          id: 'pymat-m2-s1-l1',
          title: { en: 'Comparing Values', id: 'Membandingkan Nilai' },
          goal: { en: 'Produce and store a True/False answer.', id: 'Menghasilkan dan menyimpan jawaban True/False.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A comparison is a value', id: 'Perbandingan adalah sebuah nilai' },
              body: {
                en: '`>` `<` `>=` `<=` `==` `!=` each produce `True` or `False` — a type called `bool`. It can be printed, or stored, exactly like a number.',
                id: '`>` `<` `>=` `<=` `==` `!=` masing-masing menghasilkan `True` atau `False` — tipe bernama `bool`. Ia bisa dicetak, atau disimpan, persis seperti angka.',
              },
              code: 'print(5 > 3)\nprint(5 == 5)\nprint(5 != 3)\nprint(3 >= 5)',
              output: 'True\nTrue\nTrue\nFalse',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Naming the result', id: 'Menamai hasilnya' },
              body: {
                en: 'Store the comparison in a variable with a name that reads like the question it answers, and it slots straight into an f-string.',
                id: 'Simpan hasil perbandingannya di variabel dengan nama yang terbaca seperti pertanyaan yang dijawabnya, dan ia langsung masuk ke f-string.',
              },
              code: 'suhu = 38.5\ndemam = suhu > 37.5\nprint(f"Demam: {demam}")',
              output: 'Demam: True',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'a = 10\nb = 10.0\nprint(a == b)\nprint(a != b)',
              options: [
                { en: 'True, then False', id: 'True, lalu False' },
                { en: 'False, then True', id: 'False, lalu True' },
                { en: 'False, then False', id: 'False, lalu False' },
                { en: 'An error — different types', id: 'Error — tipe berbeda' },
              ],
              answer: 0,
              explain: {
                en: 'Python compares the values, not the types — 10 and 10.0 are equal.',
                id: 'Python membandingkan nilainya, bukan tipenya — 10 dan 10.0 sama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Store whether `umur` (17) is at least 17 in a variable `boleh`.',
                id: 'Simpan apakah `umur` (17) sudah minimal 17 di variabel `boleh`.',
              },
              template: 'umur = 17\nboleh = umur ___ 17\nprint(boleh)',
              blanks: ['>='],
              explain: {
                en: '"At least" includes the boundary, so it is >=, not >.',
                id: '"Minimal" mencakup batasnya sendiri, jadi >=, bukan >.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints whether x equals y (x = 8, y = 8).',
                id: 'Susun program yang mencetak apakah x sama dengan y (x = 8, y = 8).',
              },
              lines: ['x = 8', 'y = 8', 'sama = x == y', 'print(sama)'],
              explain: {
                en: '== asks a question; = stores an answer. They are never interchangeable.',
                id: '== bertanya; = menyimpan jawaban. Keduanya tak pernah bisa saling gantikan.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a number `n`. Print `True` if it is positive (greater than 0), `False` otherwise.',
                id: 'Baca sebuah bilangan `n`. Cetak `True` jika ia positif (lebih dari 0), `False` selain itu.',
              },
              starter: 'n = int(input())\n',
              tests: [
                { name: { en: '5 → True', id: '5 → True' }, stdin: ['5'], expectOutput: 'True' },
                { name: { en: '-3 → False', id: '-3 → False' }, stdin: ['-3'], expectOutput: 'False' },
                { name: { en: '0 → False', id: '0 → False' }, stdin: ['0'], expectOutput: 'False' },
                { name: { en: '100 → True', id: '100 → True' }, stdin: ['100'], expectOutput: 'True' },
              ],
              hints: [
                { en: 'Zero is not positive.', id: 'Nol bukan bilangan positif.' },
                { en: 'One line: print(n > 0).', id: 'Satu baris: print(n > 0).' },
              ],
              solution: 'n = int(input())\nprint(n > 0)',
            },
          ],
        },
        {
          id: 'pymat-m2-s1-l2',
          title: { en: 'Classifying with if/else', id: 'Klasifikasi dengan if/else' },
          goal: { en: 'Choose between two or three outcomes.', id: 'Memilih di antara dua atau tiga hasil.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Even or odd', id: 'Genap atau ganjil' },
              body: {
                en: '`n % 2` is 0 for an even number and 1 for an odd one — the classic use of the remainder operator. The line ends with a colon, and everything indented under it belongs to that branch.',
                id: '`n % 2` bernilai 0 untuk bilangan genap dan 1 untuk ganjil — pemakaian klasik operator sisa bagi. Barisnya diakhiri titik dua, dan semua yang menjorok di bawahnya milik cabang itu.',
              },
              code: 'n = 7\nif n % 2 == 0:\n    print("Genap")\nelse:\n    print("Ganjil")',
              output: 'Ganjil',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Three outcomes: elif', id: 'Tiga hasil: elif' },
              body: {
                en: 'A number is positive, negative, or exactly zero — three outcomes need `elif` between `if` and `else`. Python checks each condition in order and stops at the first one that is `True`.',
                id: 'Sebuah bilangan itu positif, negatif, atau tepat nol — tiga hasil butuh `elif` di antara `if` dan `else`. Python memeriksa tiap kondisi berurutan dan berhenti di yang pertama bernilai `True`.',
              },
              code: 'x = -4\nif x > 0:\n    print("Positif")\nelif x < 0:\n    print("Negatif")\nelse:\n    print("Nol")',
              output: 'Negatif',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'With x = 0, what is printed?', id: 'Dengan x = 0, apa yang dicetak?' },
              code: 'x = 0\nif x > 0:\n    print("Positif")\nelif x < 0:\n    print("Negatif")\nelse:\n    print("Nol")',
              options: [
                { en: 'Nol', id: 'Nol' },
                { en: 'Positif', id: 'Positif' },
                { en: 'Negatif', id: 'Negatif' },
                { en: 'Nothing is printed', id: 'Tidak ada yang dicetak' },
              ],
              answer: 0,
              explain: {
                en: 'Neither > 0 nor < 0 is True for zero, so control falls through to else.',
                id: 'Baik > 0 maupun < 0 tidak True untuk nol, jadi jatuh ke else.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the even/odd check for `n = 12`.',
                id: 'Lengkapi pemeriksaan genap/ganjil untuk `n = 12`.',
              },
              template: 'n = 12\nif n % 2 ___ 0:\n    print("Genap")\nelse:\n    print("Ganjil")',
              blanks: ['=='],
              explain: {
                en: 'Comparing needs ==; a single = would try to assign, which is not allowed here.',
                id: 'Membandingkan butuh ==; = tunggal akan mencoba menugaskan, yang tidak diperbolehkan di sini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that classifies y = 15 as Positif, Negatif, or Nol.',
                id: 'Susun program yang mengklasifikasikan y = 15 sebagai Positif, Negatif, atau Nol.',
              },
              lines: ['y = 15', 'if y > 0:', '    print("Positif")', 'elif y < 0:', '    print("Negatif")', 'else:', '    print("Nol")'],
              explain: {
                en: 'Same shape as the concept above, with y in place of x.',
                id: 'Bentuknya sama seperti pada konsep di atas, dengan y menggantikan x.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `n`. Print `Genap` if it divides evenly by 2, `Ganjil` otherwise.',
                id: 'Baca bilangan bulat `n`. Cetak `Genap` jika habis dibagi 2, `Ganjil` selain itu.',
              },
              starter: 'n = int(input())\n',
              tests: [
                { name: { en: '4 → Genap', id: '4 → Genap' }, stdin: ['4'], expectOutput: 'Genap' },
                { name: { en: '7 → Ganjil', id: '7 → Ganjil' }, stdin: ['7'], expectOutput: 'Ganjil' },
                { name: { en: '0 → Genap', id: '0 → Genap' }, stdin: ['0'], expectOutput: 'Genap' },
                { name: { en: '-4 → Genap (negative)', id: '-4 → Genap (negatif)' }, stdin: ['-4'], expectOutput: 'Genap' },
              ],
              hints: [
                { en: 'The same n % 2 == 0 check as the lesson above.', id: 'Pemeriksaan n % 2 == 0 yang sama seperti pada pelajaran di atas.' },
              ],
              solution: 'n = int(input())\nif n % 2 == 0:\n    print("Genap")\nelse:\n    print("Ganjil")',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m2-s1-p',
        title: { en: 'Classify a Triangle', id: 'Klasifikasikan Segitiga' },
        brief: {
          en: 'Given three side lengths, decide whether they form a triangle, and if so, what kind.',
          id: 'Diberikan tiga panjang sisi, tentukan apakah membentuk segitiga, dan jika ya, jenis apa.',
        },
        requirements: [
          { en: 'Read three side lengths `a`, `b`, `c` (each may have a decimal point).', id: 'Baca tiga panjang sisi `a`, `b`, `c` (masing-masing bisa desimal).' },
          { en: 'If any two sides do not together exceed the third, print `Bukan segitiga`.', id: 'Jika ada dua sisi yang jumlahnya tidak melebihi sisi ketiga, cetak `Bukan segitiga`.' },
          { en: 'Otherwise print `Sama sisi` (all three equal), `Sama kaki` (exactly two equal), or `Sembarang` (all different).', id: 'Selain itu cetak `Sama sisi` (ketiganya sama), `Sama kaki` (tepat dua sama), atau `Sembarang` (semua beda).' },
        ],
        starter: 'a = float(input())\nb = float(input())\nc = float(input())\n',
        tests: [
          { name: { en: '3, 3, 3 → Sama sisi', id: '3, 3, 3 → Sama sisi' }, stdin: ['3', '3', '3'], expectOutput: 'Sama sisi' },
          { name: { en: '3, 3, 5 → Sama kaki', id: '3, 3, 5 → Sama kaki' }, stdin: ['3', '3', '5'], expectOutput: 'Sama kaki' },
          { name: { en: '3, 4, 5 → Sembarang', id: '3, 4, 5 → Sembarang' }, stdin: ['3', '4', '5'], expectOutput: 'Sembarang' },
          { name: { en: '1, 1, 5 → Bukan segitiga', id: '1, 1, 5 → Bukan segitiga' }, stdin: ['1', '1', '5'], expectOutput: 'Bukan segitiga' },
        ],
        hints: [
          { en: 'Check the triangle inequality first — the whole answer depends on it.', id: 'Periksa dulu ketaksamaan segitiganya — seluruh jawaban bergantung padanya.' },
          { en: 'A valid triangle needs all three: a+b>c, b+c>a, a+c>b.', id: 'Segitiga yang sah butuh ketiganya: a+b>c, b+c>a, a+c>b.' },
        ],
        solution:
          'a = float(input())\nb = float(input())\nc = float(input())\nif a + b <= c or b + c <= a or a + c <= b:\n    print("Bukan segitiga")\nelif a == b and b == c:\n    print("Sama sisi")\nelif a == b or b == c or a == c:\n    print("Sama kaki")\nelse:\n    print("Sembarang")',
        xp: 50,
      },
    },

    /* --------------------------------------- 2.2 compound conditions & piecewise fn */
    {
      id: 'pymat-m2-s2',
      title: { en: 'Compound Conditions and Piecewise Functions', id: 'Kondisi Majemuk dan Fungsi Sepotong-sepotong' },
      summary: {
        en: 'Combine conditions with and/or/not, then use an elif chain to evaluate a function that changes rule across its domain.',
        id: 'Gabungkan kondisi dengan and/or/not, lalu pakai rantai elif untuk mengevaluasi fungsi yang berganti aturan di tiap bagian domainnya.',
      },
      lessons: [
        {
          id: 'pymat-m2-s2-l1',
          title: { en: 'and, or, not', id: 'and, or, not' },
          goal: { en: 'Combine more than one condition.', id: 'Menggabungkan lebih dari satu kondisi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'and — every part must be True', id: 'and — semua bagian harus True' },
              body: {
                en: '`and` is only `True` when both sides are. It reads the way "and" reads in a requirement: both conditions have to hold.',
                id: '`and` hanya `True` kalau kedua sisinya True. Ia terbaca seperti "dan" pada sebuah syarat: kedua kondisi harus terpenuhi.',
              },
              code: 'umur = 25\npunya_ktp = True\nboleh_pinjam = umur >= 21 and punya_ktp\nprint(boleh_pinjam)',
              output: 'True',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'or, and flipping with not', id: 'or, dan membalik dengan not' },
              body: {
                en: '`or` is `True` when at least one side is. `not` flips a `True`/`False` to its opposite.',
                id: '`or` bernilai `True` kalau setidaknya satu sisinya True. `not` membalik `True`/`False` ke lawannya.',
              },
              code: 'x = 3\ndalam_rentang = x < 0 or x > 10\nprint(dalam_rentang)\nprint(not dalam_rentang)',
              output: 'False\nTrue',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'a = 5\nb = 15\nprint(a > 0 and b > 20)\nprint(a > 0 or b > 20)',
              options: [
                { en: 'False, then True', id: 'False, lalu True' },
                { en: 'True, then True', id: 'True, lalu True' },
                { en: 'False, then False', id: 'False, lalu False' },
                { en: 'True, then False', id: 'True, lalu False' },
              ],
              answer: 0,
              explain: {
                en: 'b > 20 is False, so the and fails; but a > 0 alone is enough for the or.',
                id: 'b > 20 bernilai False, jadi and-nya gagal; tapi a > 0 saja sudah cukup untuk or-nya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Check whether `n` divides evenly by 3 AND by 5 (a multiple of 15).',
                id: 'Cek apakah `n` habis dibagi 3 DAN habis dibagi 5 (kelipatan 15).',
              },
              template: 'n = 30\nkelipatan15 = n % 3 == 0 ___ n % 5 == 0\nprint(kelipatan15)',
              blanks: ['and'],
              explain: {
                en: 'Both conditions must hold for a true multiple of 15.',
                id: 'Kedua kondisi harus terpenuhi untuk benar-benar kelipatan 15.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that flags a score as invalid when it is below 0 or above 100 (score = 150).',
                id: 'Susun program yang menandai skor sebagai tidak sah kalau di bawah 0 atau di atas 100 (skor = 150).',
              },
              lines: ['skor = 150', 'tidak_sah = skor < 0 or skor > 100', 'print(tidak_sah)'],
              explain: {
                en: 'Either extreme alone is enough to make it invalid — that is what or means here.',
                id: 'Salah satu ujungnya saja sudah cukup membuatnya tidak sah — itulah arti or di sini.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `x`. Print `True` if it is between 1 and 10, inclusive on both ends — `False` otherwise.',
                id: 'Baca bilangan bulat `x`. Cetak `True` jika berada di antara 1 dan 10, termasuk kedua batasnya — `False` selain itu.',
              },
              starter: 'x = int(input())\n',
              tests: [
                { name: { en: '5 → True', id: '5 → True' }, stdin: ['5'], expectOutput: 'True' },
                { name: { en: '0 → False', id: '0 → False' }, stdin: ['0'], expectOutput: 'False' },
                { name: { en: '10 → True (boundary)', id: '10 → True (batas)' }, stdin: ['10'], expectOutput: 'True' },
                { name: { en: '11 → False', id: '11 → False' }, stdin: ['11'], expectOutput: 'False' },
                { name: { en: '1 → True (boundary)', id: '1 → True (batas)' }, stdin: ['1'], expectOutput: 'True' },
              ],
              hints: [
                { en: 'Both ends are inclusive, so use >= and <=.', id: 'Kedua ujungnya termasuk, jadi pakai >= dan <=.' },
                { en: 'print(x >= 1 and x <= 10)', id: 'print(x >= 1 and x <= 10)' },
              ],
              solution: 'x = int(input())\nprint(x >= 1 and x <= 10)',
            },
          ],
        },
        {
          id: 'pymat-m2-s2-l2',
          title: { en: 'elif Chains for Piecewise Functions', id: 'Rantai elif untuk Fungsi Sepotong-sepotong' },
          goal: { en: 'Evaluate a function that follows a different rule in different ranges.', id: 'Mengevaluasi fungsi yang mengikuti aturan berbeda di rentang berbeda.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A function in three pieces', id: 'Fungsi dalam tiga potongan' },
              body: {
                en: 'A piecewise function is just an elif chain where each branch computes the value a different way. Here: `-x` when `x` is negative, `x**2` when it is under 5, and 25 otherwise.',
                id: 'Fungsi sepotong-sepotong hanyalah rantai elif yang tiap cabangnya menghitung nilai dengan cara berbeda. Di sini: `-x` kalau `x` negatif, `x**2` kalau di bawah 5, dan 25 selain itu.',
              },
              code: 'x = 7\nif x < 0:\n    hasil = -x\nelif x < 5:\n    hasil = x ** 2\nelse:\n    hasil = 25\nprint(hasil)',
              output: '25',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same function, a different x', id: 'Fungsi yang sama, x yang berbeda' },
              body: {
                en: 'Change only `x` and a different branch runs. `-3` is negative, so it takes the first branch: `-(-3)` is `3`.',
                id: 'Ubah hanya `x` dan cabang yang berbeda yang berjalan. `-3` negatif, jadi mengambil cabang pertama: `-(-3)` adalah `3`.',
              },
              code: 'x = -3\nif x < 0:\n    hasil = -x\nelif x < 5:\n    hasil = x ** 2\nelse:\n    hasil = 25\nprint(hasil)',
              output: '3',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'With x = 2, what is printed by the same three branches?', id: 'Dengan x = 2, apa yang dicetak oleh tiga cabang yang sama?' },
              code: 'x = 2\nif x < 0:\n    hasil = -x\nelif x < 5:\n    hasil = x ** 2\nelse:\n    hasil = 25\nprint(hasil)',
              options: [
                { en: '4', id: '4' },
                { en: '2', id: '2' },
                { en: '25', id: '25' },
                { en: '-2', id: '-2' },
              ],
              answer: 0,
              explain: {
                en: '2 is not negative but is under 5, so the middle branch runs: 2 ** 2 is 4.',
                id: '2 tidak negatif tapi di bawah 5, jadi cabang tengah yang jalan: 2 ** 2 adalah 4.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the chain so it correctly separates the negative and middle branches.',
                id: 'Lengkapi rantainya agar benar memisahkan cabang negatif dan tengah.',
              },
              template: 'x = 5\nif x < 0:\n    hasil = -x\nelif x ___ 5:\n    hasil = x ** 2\nelse:\n    hasil = 25\nprint(hasil)',
              blanks: ['<'],
              explain: {
                en: 'The same boundary as the worked example: strictly less than 5 for the middle branch.',
                id: 'Batasnya sama seperti pada contoh: kurang dari 5 secara tegas untuk cabang tengah.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a grading scale: 90+ is A, 75+ is B, 60+ is C, otherwise D (nilai = 68).',
                id: 'Susun skala nilai: 90 ke atas A, 75 ke atas B, 60 ke atas C, selain itu D (nilai = 68).',
              },
              lines: [
                'nilai = 68',
                'if nilai >= 90:',
                '    huruf = "A"',
                'elif nilai >= 75:',
                '    huruf = "B"',
                'elif nilai >= 60:',
                '    huruf = "C"',
                'else:',
                '    huruf = "D"',
                'print(huruf)',
              ],
              explain: {
                en: 'Each threshold is checked in order, from highest to lowest.',
                id: 'Tiap ambang batas diperiksa berurutan, dari tertinggi ke terendah.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `x`. Compute `hasil` using the three branches from this lesson (`-x` if negative, `x**2` if under 5, 25 otherwise), and print it.',
                id: 'Baca bilangan bulat `x`. Hitung `hasil` memakai tiga cabang dari pelajaran ini (`-x` kalau negatif, `x**2` kalau di bawah 5, 25 selain itu), lalu cetak.',
              },
              starter: 'x = int(input())\n',
              tests: [
                { name: { en: '-3 → 3', id: '-3 → 3' }, stdin: ['-3'], expectOutput: '3' },
                { name: { en: '2 → 4', id: '2 → 4' }, stdin: ['2'], expectOutput: '4' },
                { name: { en: '5 → 25', id: '5 → 25' }, stdin: ['5'], expectOutput: '25' },
                { name: { en: '10 → 25', id: '10 → 25' }, stdin: ['10'], expectOutput: '25' },
                { name: { en: '0 → 0', id: '0 → 0' }, stdin: ['0'], expectOutput: '0' },
              ],
              hints: [
                { en: 'Exactly the three branches from the concept steps above.', id: 'Persis tiga cabang dari langkah konsep di atas.' },
              ],
              solution: 'x = int(input())\nif x < 0:\n    hasil = -x\nelif x < 5:\n    hasil = x ** 2\nelse:\n    hasil = 25\nprint(hasil)',
            },
          ],
        },
      ],
      project: {
        id: 'pymat-m2-s2-p',
        title: { en: 'Piecewise Function Evaluator: Electricity Billing', id: 'Evaluator Fungsi Sepotong-sepotong: Tagihan Listrik' },
        brief: {
          en: 'Electricity is billed in tiers: the first 50 kWh are free, the next 100 kWh cost 1000 per kWh, and anything beyond 150 kWh costs 1500 per kWh.',
          id: 'Listrik ditagih bertingkat: 50 kWh pertama gratis, 100 kWh berikutnya seharga 1000 per kWh, dan di atas 150 kWh seharga 1500 per kWh.',
        },
        requirements: [
          { en: 'Read `pemakaian`, a whole number of kWh.', id: 'Baca `pemakaian`, bilangan bulat kWh.' },
          { en: 'If it is 50 or under, the bill is 0.', id: 'Jika 50 atau kurang, tagihannya 0.' },
          { en: 'If it is 150 or under, the bill is `(pemakaian - 50) * 1000`.', id: 'Jika 150 atau kurang, tagihannya `(pemakaian - 50) * 1000`.' },
          { en: 'Otherwise, the bill is `100 * 1000 + (pemakaian - 150) * 1500`.', id: 'Selain itu, tagihannya `100 * 1000 + (pemakaian - 150) * 1500`.' },
          { en: 'Print the bill.', id: 'Cetak tagihannya.' },
        ],
        starter: 'pemakaian = int(input())\n',
        tests: [
          { name: { en: '30 kWh → 0', id: '30 kWh → 0' }, stdin: ['30'], expectOutput: '0' },
          { name: { en: '50 kWh (boundary) → 0', id: '50 kWh (batas) → 0' }, stdin: ['50'], expectOutput: '0' },
          { name: { en: '100 kWh → 50000', id: '100 kWh → 50000' }, stdin: ['100'], expectOutput: '50000' },
          { name: { en: '150 kWh (boundary) → 100000', id: '150 kWh (batas) → 100000' }, stdin: ['150'], expectOutput: '100000' },
          { name: { en: '200 kWh → 175000', id: '200 kWh → 175000' }, stdin: ['200'], expectOutput: '175000' },
        ],
        hints: [
          { en: 'Three branches, checked from the lowest boundary to the highest.', id: 'Tiga cabang, diperiksa dari batas terendah ke tertinggi.' },
          { en: 'The middle branch only counts kWh past the free 50.', id: 'Cabang tengah hanya menghitung kWh setelah 50 yang gratis.' },
        ],
        solution:
          'pemakaian = int(input())\nif pemakaian <= 50:\n    tagihan = 0\nelif pemakaian <= 150:\n    tagihan = (pemakaian - 50) * 1000\nelse:\n    tagihan = 100 * 1000 + (pemakaian - 150) * 1500\nprint(tagihan)',
        xp: 50,
      },
    },
  ],
}
