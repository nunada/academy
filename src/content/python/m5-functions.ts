import type { Module } from '../types'

/** Module 5 — naming a piece of work, then composing several of them. */
export const module5: Module = {
  id: 'py-m5',
  title: { en: 'Functions', id: 'Fungsi' },
  summary: {
    en: 'Name a piece of work once, then reuse it everywhere.',
    id: 'Beri nama sebuah pekerjaan sekali, lalu pakai ulang di mana saja.',
  },
  submodules: [
    /* ------------------------------------------------------ 5.1 def & return */
    {
      id: 'py-m5-s1',
      title: { en: 'Defining a Function', id: 'Mendefinisikan Fungsi' },
      summary: {
        en: 'Wrap code in a name, feed it values, and get an answer back.',
        id: 'Bungkus kode dalam sebuah nama, beri nilai masukan, dan terima jawabannya.',
      },
      lessons: [
        {
          id: 'py-m5-s1-l1',
          title: { en: 'def and call', id: 'def dan pemanggilan' },
          goal: { en: 'Write a function and run it.', id: 'Menulis fungsi dan menjalankannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Defining is not running', id: 'Mendefinisikan bukan menjalankan' },
              body: {
                en: '`def` only *describes* the work. Nothing happens until you call the name with brackets — and you may call it as often as you like.',
                id: '`def` hanya *menjelaskan* pekerjaannya. Tidak ada yang terjadi sampai kamu memanggil namanya dengan kurung — dan kamu boleh memanggilnya sesering yang kamu mau.',
              },
              code: 'def sapa():\n    print("Halo!")\n\nsapa()\nsapa()',
              output: 'Halo!\nHalo!',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Parameters carry values in', id: 'Parameter membawa nilai masuk' },
              body: {
                en: 'Names inside the brackets are placeholders. Whatever you pass at call time lands in them.',
                id: 'Nama di dalam kurung adalah tempat kosong. Apa pun yang kamu berikan saat memanggil akan masuk ke sana.',
              },
              code: 'def sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Ani")\nsapa("Budi")',
              output: 'Halo, Ani!\nHalo, Budi!',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this program print?', id: 'Apa yang dicetak program ini?' },
              code: 'def halo():\n    print("hai")',
              options: [
                { en: 'Nothing — the function is never called', id: 'Tidak ada — fungsinya tidak pernah dipanggil' },
                { en: 'hai', id: 'hai' },
                { en: 'halo', id: 'halo' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'Defining a function stores it. It runs only when called: halo()',
                id: 'Mendefinisikan fungsi hanya menyimpannya. Ia jalan hanya saat dipanggil: halo()',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Define a function `luas` taking `p` and `l`, then call it.',
                id: 'Definisikan fungsi `luas` yang menerima `p` dan `l`, lalu panggil.',
              },
              template: '___ luas(p, l):\n    print(p * l)\n\n___(4, 5)',
              blanks: ['def', 'luas'],
              explain: {
                en: 'def introduces the definition; the bare name with brackets calls it.',
                id: 'def memperkenalkan definisinya; nama polos dengan kurung memanggilnya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write a function `garis(n)` that prints `n` dashes on one line, e.g. `garis(3)` prints `---`. Call it with 5.',
                id: 'Tulis fungsi `garis(n)` yang mencetak `n` tanda hubung dalam satu baris, misal `garis(3)` mencetak `---`. Panggil dengan 5.',
              },
              starter: '',
              tests: [
                { name: { en: 'garis(5) prints -----', id: 'garis(5) mencetak -----' }, expectOutput: '-----' },
                {
                  name: { en: 'Works for other sizes too', id: 'Berfungsi untuk ukuran lain juga' },
                  assert: 'garis(2)',
                  expectOutput: '-----\n--',
                },
              ],
              hints: [
                { en: 'Multiplying a string repeats it: "-" * 3 is "---".', id: 'Mengalikan string mengulanginya: "-" * 3 adalah "---".' },
                { en: 'def garis(n): → print("-" * n)', id: 'def garis(n): → print("-" * n)' },
              ],
              solution: 'def garis(n):\n    print("-" * n)\n\ngaris(5)',
            },
          ],
        },
        {
          id: 'py-m5-s1-l2',
          title: { en: 'return sends a value back', id: 'return mengirim nilai kembali' },
          goal: { en: 'Get a result out of a function.', id: 'Mendapatkan hasil keluar dari fungsi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'print shows, return gives', id: 'print menampilkan, return memberikan' },
              body: {
                en: 'A function that prints is a dead end — you cannot do anything with the number. A function that `return`s hands the value back so you can store it, add to it, or print it later.',
                id: 'Fungsi yang mencetak adalah jalan buntu — kamu tak bisa mengolah angkanya. Fungsi yang `return` menyerahkan nilainya kembali sehingga bisa kamu simpan, tambahkan, atau cetak nanti.',
              },
              code: 'def luas(p, l):\n    return p * l\n\nhasil = luas(4, 5)\nprint(hasil + 10)',
              output: '30',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'return also exits', id: 'return juga mengakhiri' },
              body: {
                en: 'The moment `return` runs, the function is over — later lines never execute. That makes an early `return` a clean way to handle a special case.',
                id: 'Begitu `return` dijalankan, fungsi itu berakhir — baris setelahnya tak pernah dieksekusi. Karena itu `return` awal adalah cara rapi menangani kasus khusus.',
              },
              code: 'def bagi(a, b):\n    if b == 0:\n        return "tidak bisa dibagi nol"\n    return a / b\n\nprint(bagi(10, 2))\nprint(bagi(10, 0))',
              output: '5.0\ntidak bisa dibagi nol',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'def tambah(a, b):\n    print(a + b)\n\nx = tambah(2, 3)\nprint(x)',
              options: [
                { en: '5 then None', id: '5 lalu None' },
                { en: '5 then 5', id: '5 lalu 5' },
                { en: 'None then 5', id: 'None lalu 5' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'The function prints 5 but returns nothing, so x is None. This is the classic print-instead-of-return mistake.',
                id: 'Fungsinya mencetak 5 tapi tidak mengembalikan apa pun, jadi x bernilai None. Ini kesalahan klasik print-alih-alih-return.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints 12.',
                id: 'Susun program yang mencetak 12.',
              },
              lines: ['def kali(a, b):', '    return a * b', '', 'hasil = kali(3, 4)', 'print(hasil)'],
              explain: {
                en: 'The definition must come before the call, and the result is captured into a variable.',
                id: 'Definisi harus mendahului pemanggilan, dan hasilnya ditampung ke sebuah variabel.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `terbesar(a, b)` that returns the larger of two numbers (return, do not print). Then print `terbesar(3, 9)`.',
                id: 'Tulis `terbesar(a, b)` yang mengembalikan angka terbesar dari dua angka (return, bukan print). Lalu cetak `terbesar(3, 9)`.',
              },
              starter: '',
              tests: [
                { name: { en: 'Prints 9', id: 'Mencetak 9' }, expectOutput: '9' },
                {
                  name: { en: 'Returns, not prints', id: 'Mengembalikan, bukan mencetak' },
                  assert:
                    'assert terbesar(10, 2) == 10, "harus mengembalikan nilai terbesar"\nassert terbesar(4, 4) == 4, "nilai sama harus mengembalikan nilai itu"',
                },
              ],
              hints: [
                { en: 'Compare with if, then return the winner.', id: 'Bandingkan dengan if, lalu kembalikan pemenangnya.' },
                { en: 'if a > b: return a — else: return b', id: 'if a > b: return a — else: return b' },
              ],
              solution:
                'def terbesar(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(terbesar(3, 9))',
            },
          ],
        },
      ],
      project: {
        id: 'py-m5-s1-p',
        title: { en: 'Text toolkit', id: 'Toolkit teks' },
        brief: {
          en: 'Build three small functions that other programs could reuse.',
          id: 'Bangun tiga fungsi kecil yang bisa dipakai ulang program lain.',
        },
        requirements: [
          { en: '`balik(teks)` returns the text reversed.', id: '`balik(teks)` mengembalikan teks yang dibalik.' },
          { en: '`vokal(teks)` returns how many vowels (a, i, u, e, o) it contains.', id: '`vokal(teks)` mengembalikan jumlah huruf vokal (a, i, u, e, o) di dalamnya.' },
          { en: '`palindrom(teks)` returns True when the text reads the same backwards.', id: '`palindrom(teks)` mengembalikan True bila teks terbaca sama dari belakang.' },
          { en: 'All three must return, not print.', id: 'Ketiganya harus return, bukan print.' },
        ],
        starter:
          '# Toolkit teks\ndef balik(teks):\n    pass\n\ndef vokal(teks):\n    pass\n\ndef palindrom(teks):\n    pass\n',
        tests: [
          {
            name: { en: 'balik works', id: 'balik berfungsi' },
            assert:
              'assert balik("abc") == "cba", "balik(\'abc\') harus \'cba\'"\nassert balik("") == "", "teks kosong tetap kosong"',
          },
          {
            name: { en: 'vokal counts vowels', id: 'vokal menghitung huruf vokal' },
            assert:
              'assert vokal("halo") == 2, "halo punya 2 vokal"\nassert vokal("xyz") == 0, "xyz tidak punya vokal"\nassert vokal("aiueo") == 5, "aiueo punya 5 vokal"',
          },
          {
            name: { en: 'palindrom detects both cases', id: 'palindrom mengenali kedua kasus' },
            assert:
              'assert palindrom("katak") is True, "katak adalah palindrom"\nassert palindrom("halo") is False, "halo bukan palindrom"',
          },
        ],
        hints: [
          { en: 'A slice with a negative step reverses a string: teks[::-1]', id: 'Slice dengan langkah negatif membalik string: teks[::-1]' },
          { en: 'Count by looping the characters and testing `if h in "aiueo"`.', id: 'Hitung dengan mengulang tiap karakter dan menguji `if h in "aiueo"`.' },
          { en: 'palindrom can reuse balik: return teks == balik(teks)', id: 'palindrom bisa memakai ulang balik: return teks == balik(teks)' },
        ],
        solution:
          'def balik(teks):\n    return teks[::-1]\n\ndef vokal(teks):\n    jumlah = 0\n    for h in teks:\n        if h in "aiueo":\n            jumlah += 1\n    return jumlah\n\ndef palindrom(teks):\n    return teks == balik(teks)',
        xp: 50,
      },
    },

    /* ------------------------------------------------- 5.2 composing & finale */
    {
      id: 'py-m5-s2',
      title: { en: 'Putting It Together', id: 'Menyatukan Semuanya' },
      summary: {
        en: 'Default values, functions calling functions, and one last build.',
        id: 'Nilai bawaan, fungsi memanggil fungsi, dan satu bangunan terakhir.',
      },
      lessons: [
        {
          id: 'py-m5-s2-l1',
          title: { en: 'Default values', id: 'Nilai bawaan' },
          goal: { en: 'Make a parameter optional.', id: 'Membuat parameter menjadi opsional.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A sensible fallback', id: 'Nilai cadangan yang masuk akal' },
              body: {
                en: 'Give a parameter a value in the `def` line and callers may leave it out. Defaults must come after the required parameters.',
                id: 'Beri sebuah parameter nilai di baris `def`, maka pemanggil boleh melewatinya. Parameter bernilai bawaan harus diletakkan setelah parameter wajib.',
              },
              code: 'def sapa(nama, salam="Halo"):\n    print(f"{salam}, {nama}!")\n\nsapa("Ani")\nsapa("Budi", "Selamat pagi")',
              output: 'Halo, Ani!\nSelamat pagi, Budi!',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Naming arguments at the call', id: 'Menyebut nama argumen saat memanggil' },
              body: {
                en: 'You can pass by name, in any order. Long calls become readable, and you can skip over defaults you do not care about.',
                id: 'Kamu bisa mengoper berdasarkan nama, dalam urutan bebas. Pemanggilan panjang jadi terbaca, dan kamu bisa melewati nilai bawaan yang tidak kamu pedulikan.',
              },
              code: 'def kotak(lebar=1, tinggi=1):\n    return lebar * tinggi\n\nprint(kotak(tinggi=5))\nprint(kotak(lebar=2, tinggi=3))',
              output: '5\n6',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'def f(a, b=10):\n    return a + b\n\nprint(f(5))',
              options: [
                { en: '15', id: '15' },
                { en: '5', id: '5' },
                { en: '10', id: '10' },
                { en: 'An error — b is missing', id: 'Error — b tidak diberikan' },
              ],
              answer: 0,
              explain: {
                en: 'b falls back to its default of 10, so the result is 5 + 10.',
                id: 'b memakai nilai bawaannya, 10, jadi hasilnya 5 + 10.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `diskon(harga, persen=10)` returning the price after the discount. `diskon(100000)` is 90000.0 and `diskon(100000, 25)` is 75000.0. Print both.',
                id: 'Tulis `diskon(harga, persen=10)` yang mengembalikan harga setelah potongan. `diskon(100000)` = 90000.0 dan `diskon(100000, 25)` = 75000.0. Cetak keduanya.',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'Prints 90000.0 then 75000.0', id: 'Mencetak 90000.0 lalu 75000.0' },
                  expectOutput: '90000.0\n75000.0',
                },
                {
                  name: { en: 'The default is 10 percent', id: 'Nilai bawaannya 10 persen' },
                  assert: 'assert diskon(200000) == 180000.0, "tanpa argumen kedua harus potong 10 persen"',
                },
              ],
              hints: [
                { en: 'The remaining share is (100 - persen) / 100.', id: 'Sisa yang dibayar adalah (100 - persen) / 100.' },
                { en: 'return harga * (100 - persen) / 100', id: 'return harga * (100 - persen) / 100' },
              ],
              solution:
                'def diskon(harga, persen=10):\n    return harga * (100 - persen) / 100\n\nprint(diskon(100000))\nprint(diskon(100000, 25))',
            },
          ],
        },
        {
          id: 'py-m5-s2-l2',
          title: { en: 'Functions using functions', id: 'Fungsi memakai fungsi' },
          goal: { en: 'Split a problem into small named pieces.', id: 'Memecah masalah menjadi bagian kecil bernama.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Small pieces, composed', id: 'Bagian kecil, dirangkai' },
              body: {
                en: 'Each function should do one thing. A larger job then reads as a list of those names, which is far easier to check than one long block.',
                id: 'Tiap fungsi sebaiknya melakukan satu hal. Pekerjaan besar lalu terbaca sebagai daftar nama-nama itu, jauh lebih mudah diperiksa daripada satu blok panjang.',
              },
              code: 'def rata(angka):\n    return sum(angka) / len(angka)\n\ndef predikat(nilai):\n    if nilai >= 80:\n        return "Baik"\n    return "Cukup"\n\ndata = [90, 85, 80]\nprint(predikat(rata(data)))',
              output: 'Baik',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Local names stay local', id: 'Nama lokal tetap lokal' },
              body: {
                en: 'A variable created inside a function disappears when the function ends. That isolation is a feature — two functions can both use `i` without ever colliding.',
                id: 'Variabel yang dibuat di dalam fungsi lenyap saat fungsi berakhir. Keterpisahan itu justru keunggulan — dua fungsi bisa sama-sama memakai `i` tanpa pernah bentrok.',
              },
              code: 'def hitung():\n    total = 99\n    return total\n\nprint(hitung())\nprint("total" in dir())',
              output: '99\nFalse',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What happens?', id: 'Apa yang terjadi?' },
              code: 'def f():\n    x = 5\n\nf()\nprint(x)',
              options: [
                { en: 'NameError — x does not exist outside f', id: 'NameError — x tidak ada di luar f' },
                { en: '5', id: '5' },
                { en: 'None', id: 'None' },
                { en: '0', id: '0' },
              ],
              answer: 0,
              explain: {
                en: 'x lives only inside f. To get it out, return it.',
                id: 'x hanya hidup di dalam f. Untuk mengeluarkannya, kembalikan dengan return.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `ganjil(n)` returning True for odd numbers, and `hitung_ganjil(daftar)` that uses it to return how many odd numbers a list holds.',
                id: 'Tulis `ganjil(n)` yang mengembalikan True untuk angka ganjil, dan `hitung_ganjil(daftar)` yang memakainya untuk mengembalikan berapa banyak angka ganjil dalam sebuah list.',
              },
              starter: 'def ganjil(n):\n    pass\n\ndef hitung_ganjil(daftar):\n    pass\n',
              tests: [
                {
                  name: { en: 'ganjil works', id: 'ganjil berfungsi' },
                  assert: 'assert ganjil(3) is True\nassert ganjil(4) is False\nassert ganjil(0) is False',
                },
                {
                  name: { en: 'hitung_ganjil counts', id: 'hitung_ganjil menghitung' },
                  assert:
                    'assert hitung_ganjil([1, 2, 3, 4, 5]) == 3\nassert hitung_ganjil([2, 4]) == 0\nassert hitung_ganjil([]) == 0',
                },
              ],
              hints: [
                { en: 'n % 2 == 1 is True exactly for odd numbers.', id: 'n % 2 == 1 bernilai True tepat untuk angka ganjil.' },
                { en: 'Loop the list, call ganjil(x), count the Trues.', id: 'Ulang list-nya, panggil ganjil(x), hitung yang True.' },
              ],
              solution:
                'def ganjil(n):\n    return n % 2 == 1\n\ndef hitung_ganjil(daftar):\n    jumlah = 0\n    for n in daftar:\n        if ganjil(n):\n            jumlah += 1\n    return jumlah',
            },
          ],
        },
      ],
      project: {
        id: 'py-m5-s2-p',
        title: { en: 'Class gradebook', id: 'Buku nilai kelas' },
        brief: {
          en: 'Everything at once — a dictionary of students, functions to analyse it, and a printed report.',
          id: 'Semuanya sekaligus — dictionary berisi siswa, fungsi untuk menganalisisnya, dan laporan tercetak.',
        },
        requirements: [
          { en: '`rata_rata(nilai)` returns the average of a list, or 0 for an empty list.', id: '`rata_rata(nilai)` mengembalikan rata-rata sebuah list, atau 0 untuk list kosong.' },
          { en: '`predikat(n)` returns "A" for 90+, "B" for 80+, "C" for 70+, otherwise "D".', id: '`predikat(n)` mengembalikan "A" untuk 90+, "B" untuk 80+, "C" untuk 70+, selain itu "D".' },
          { en: '`terbaik(kelas)` returns the name of the student with the highest average.', id: '`terbaik(kelas)` mengembalikan nama siswa dengan rata-rata tertinggi.' },
          { en: '`laporan(kelas)` prints one line per student: `Ani: 85.0 (B)` with the average rounded to one decimal.', id: '`laporan(kelas)` mencetak satu baris per siswa: `Ani: 85.0 (B)` dengan rata-rata dibulatkan satu desimal.' },
        ],
        starter:
          '# Buku nilai kelas\nkelas = {\n    "Ani": [90, 80],\n    "Budi": [70, 60],\n    "Citra": [95, 100],\n}\n\ndef rata_rata(nilai):\n    pass\n\ndef predikat(n):\n    pass\n\ndef terbaik(kelas):\n    pass\n\ndef laporan(kelas):\n    pass\n',
        tests: [
          {
            name: { en: 'rata_rata handles the empty list', id: 'rata_rata menangani list kosong' },
            assert: 'assert rata_rata([90, 80]) == 85\nassert rata_rata([]) == 0',
          },
          {
            name: { en: 'predikat covers every band', id: 'predikat mencakup semua rentang' },
            assert:
              'assert predikat(95) == "A"\nassert predikat(80) == "B"\nassert predikat(70) == "C"\nassert predikat(10) == "D"',
          },
          {
            name: { en: 'terbaik finds the top student', id: 'terbaik menemukan siswa teratas' },
            assert:
              'assert terbaik(kelas) == "Citra"\nassert terbaik({"X": [10], "Y": [20]}) == "Y"',
          },
          {
            name: { en: 'laporan prints one line per student', id: 'laporan mencetak satu baris per siswa' },
            assert: 'laporan(kelas)',
            expectOutput: 'Ani: 85.0 (B)\nBudi: 65.0 (D)\nCitra: 97.5 (A)',
          },
        ],
        hints: [
          { en: 'Guard the empty list first: if len(nilai) == 0: return 0', id: 'Amankan list kosong lebih dulu: if len(nilai) == 0: return 0' },
          { en: 'predikat is an elif chain from highest to lowest.', id: 'predikat adalah rantai elif dari tertinggi ke terendah.' },
          {
            en: 'For terbaik, keep the best name and best score as you loop .items().',
            id: 'Untuk terbaik, simpan nama dan skor terbaik sambil mengulang .items().',
          },
          {
            en: 'laporan reuses the other three: print(f"{nama}: {round(r, 1)} ({predikat(r)})")',
            id: 'laporan memakai ulang tiga fungsi lain: print(f"{nama}: {round(r, 1)} ({predikat(r)})")',
          },
        ],
        solution:
          'kelas = {\n    "Ani": [90, 80],\n    "Budi": [70, 60],\n    "Citra": [95, 100],\n}\n\ndef rata_rata(nilai):\n    if len(nilai) == 0:\n        return 0\n    return sum(nilai) / len(nilai)\n\ndef predikat(n):\n    if n >= 90:\n        return "A"\n    elif n >= 80:\n        return "B"\n    elif n >= 70:\n        return "C"\n    return "D"\n\ndef terbaik(kelas):\n    nama_terbaik = ""\n    skor_terbaik = -1\n    for nama, nilai in kelas.items():\n        r = rata_rata(nilai)\n        if r > skor_terbaik:\n            skor_terbaik = r\n            nama_terbaik = nama\n    return nama_terbaik\n\ndef laporan(kelas):\n    for nama, nilai in kelas.items():\n        r = rata_rata(nilai)\n        print(f"{nama}: {round(r, 1)} ({predikat(r)})")',
        xp: 80,
      },
    },
  ],
}
