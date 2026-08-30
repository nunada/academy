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
              code: {
                en: 'def greet():\n    print("Hello!")\n\ngreet()\ngreet()',
                id: 'def sapa():\n    print("Halo!")\n\nsapa()\nsapa()',
              },
              output: { en: 'Hello!\nHello!', id: 'Halo!\nHalo!' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Parameters carry values in', id: 'Parameter membawa nilai masuk' },
              body: {
                en: 'Names inside the brackets are placeholders. Whatever you pass at call time lands in them.',
                id: 'Nama di dalam kurung adalah tempat kosong. Apa pun yang kamu berikan saat memanggil akan masuk ke sana.',
              },
              code: {
                en: 'def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("Ani")\ngreet("Budi")',
                id: 'def sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Ani")\nsapa("Budi")',
              },
              output: { en: 'Hello, Ani!\nHello, Budi!', id: 'Halo, Ani!\nHalo, Budi!' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this program print?', id: 'Apa yang dicetak program ini?' },
              code: { en: 'def hello():\n    print("hi")', id: 'def halo():\n    print("hai")' },
              options: [
                { en: 'Nothing — the function is never called', id: 'Tidak ada — fungsinya tidak pernah dipanggil' },
                { en: 'hi', id: 'hai' },
                { en: 'hello', id: 'halo' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'Defining a function stores it. It runs only when called: hello()',
                id: 'Mendefinisikan fungsi hanya menyimpannya. Ia jalan hanya saat dipanggil: halo()',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Define a function `area` taking `p` and `l`, then call it.',
                id: 'Definisikan fungsi `luas` yang menerima `p` dan `l`, lalu panggil.',
              },
              template: { en: '___ area(p, l):\n    print(p * l)\n\n___(4, 5)', id: '___ luas(p, l):\n    print(p * l)\n\n___(4, 5)' },
              blanks: { en: ['def', 'area'], id: ['def', 'luas'] },
              explain: {
                en: 'def introduces the definition; the bare name with brackets calls it.',
                id: 'def memperkenalkan definisinya; nama polos dengan kurung memanggilnya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write a function `dashes(n)` that prints `n` dashes on one line, e.g. `dashes(3)` prints `---`. Call it with 5.',
                id: 'Tulis fungsi `garis(n)` yang mencetak `n` tanda hubung dalam satu baris, misal `garis(3)` mencetak `---`. Panggil dengan 5.',
              },
              starter: '',
              tests: {
                en: [
                  { name: { en: 'dashes(5) prints -----', id: 'garis(5) mencetak -----' }, expectOutput: '-----' },
                  {
                    name: { en: 'Works for other sizes too', id: 'Berfungsi untuk ukuran lain juga' },
                    assert: 'dashes(2)',
                    expectOutput: '-----\n--',
                  },
                ],
                id: [
                  { name: { en: 'garis(5) prints -----', id: 'garis(5) mencetak -----' }, expectOutput: '-----' },
                  {
                    name: { en: 'Works for other sizes too', id: 'Berfungsi untuk ukuran lain juga' },
                    assert: 'garis(2)',
                    expectOutput: '-----\n--',
                  },
                ],
              },
              hints: [
                { en: 'Multiplying a string repeats it: "-" * 3 is "---".', id: 'Mengalikan string mengulanginya: "-" * 3 adalah "---".' },
                { en: 'def dashes(n): → print("-" * n)', id: 'def garis(n): → print("-" * n)' },
              ],
              solution: { en: 'def dashes(n):\n    print("-" * n)\n\ndashes(5)', id: 'def garis(n):\n    print("-" * n)\n\ngaris(5)' },
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
              code: {
                en: 'def area(p, l):\n    return p * l\n\nresult = area(4, 5)\nprint(result + 10)',
                id: 'def luas(p, l):\n    return p * l\n\nhasil = luas(4, 5)\nprint(hasil + 10)',
              },
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
              code: {
                en: 'def divide(a, b):\n    if b == 0:\n        return "cannot divide by zero"\n    return a / b\n\nprint(divide(10, 2))\nprint(divide(10, 0))',
                id: 'def bagi(a, b):\n    if b == 0:\n        return "tidak bisa dibagi nol"\n    return a / b\n\nprint(bagi(10, 2))\nprint(bagi(10, 0))',
              },
              output: { en: '5.0\ncannot divide by zero', id: '5.0\ntidak bisa dibagi nol' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: {
                en: 'def add(a, b):\n    print(a + b)\n\nx = add(2, 3)\nprint(x)',
                id: 'def tambah(a, b):\n    print(a + b)\n\nx = tambah(2, 3)\nprint(x)',
              },
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
              lines: {
                en: ['def multiply(a, b):', '    return a * b', '', 'result = multiply(3, 4)', 'print(result)'],
                id: ['def kali(a, b):', '    return a * b', '', 'hasil = kali(3, 4)', 'print(hasil)'],
              },
              explain: {
                en: 'The definition must come before the call, and the result is captured into a variable.',
                id: 'Definisi harus mendahului pemanggilan, dan hasilnya ditampung ke sebuah variabel.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `largest(a, b)` that returns the larger of two numbers (return, do not print). Then print `largest(3, 9)`.',
                id: 'Tulis `terbesar(a, b)` yang mengembalikan angka terbesar dari dua angka (return, bukan print). Lalu cetak `terbesar(3, 9)`.',
              },
              starter: '',
              tests: {
                en: [
                  { name: { en: 'Prints 9', id: 'Mencetak 9' }, expectOutput: '9' },
                  {
                    name: { en: 'Returns, not prints', id: 'Mengembalikan, bukan mencetak' },
                    assert:
                      'assert largest(10, 2) == 10, "must return the largest value"\nassert largest(4, 4) == 4, "equal values must return that value"',
                  },
                ],
                id: [
                  { name: { en: 'Prints 9', id: 'Mencetak 9' }, expectOutput: '9' },
                  {
                    name: { en: 'Returns, not prints', id: 'Mengembalikan, bukan mencetak' },
                    assert:
                      'assert terbesar(10, 2) == 10, "harus mengembalikan nilai terbesar"\nassert terbesar(4, 4) == 4, "nilai sama harus mengembalikan nilai itu"',
                  },
                ],
              },
              hints: [
                { en: 'Compare with if, then return the winner.', id: 'Bandingkan dengan if, lalu kembalikan pemenangnya.' },
                { en: 'if a > b: return a — else: return b', id: 'if a > b: return a — else: return b' },
              ],
              solution: {
                en: 'def largest(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(largest(3, 9))',
                id: 'def terbesar(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(terbesar(3, 9))',
              },
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
          { en: '`reverse(text)` returns the text reversed.', id: '`balik(teks)` mengembalikan teks yang dibalik.' },
          { en: '`vowels(text)` returns how many vowels (a, i, u, e, o) it contains.', id: '`vokal(teks)` mengembalikan jumlah huruf vokal (a, i, u, e, o) di dalamnya.' },
          { en: '`palindrome(text)` returns True when the text reads the same backwards.', id: '`palindrom(teks)` mengembalikan True bila teks terbaca sama dari belakang.' },
          { en: 'All three must return, not print.', id: 'Ketiganya harus return, bukan print.' },
        ],
        starter: {
          en: '# Text toolkit\ndef reverse(text):\n    pass\n\ndef vowels(text):\n    pass\n\ndef palindrome(text):\n    pass\n',
          id: '# Toolkit teks\ndef balik(teks):\n    pass\n\ndef vokal(teks):\n    pass\n\ndef palindrom(teks):\n    pass\n',
        },
        tests: {
          en: [
            {
              name: { en: 'reverse works', id: 'balik berfungsi' },
              assert:
                'assert reverse("abc") == "cba", "reverse(\'abc\') must be \'cba\'"\nassert reverse("") == "", "empty text stays empty"',
            },
            {
              name: { en: 'vowels counts vowels', id: 'vokal menghitung huruf vokal' },
              assert:
                'assert vowels("hello") == 2, "hello has 2 vowels"\nassert vowels("xyz") == 0, "xyz has no vowels"\nassert vowels("aeiou") == 5, "aeiou has 5 vowels"',
            },
            {
              name: { en: 'palindrome detects both cases', id: 'palindrom mengenali kedua kasus' },
              assert:
                'assert palindrome("level") is True, "level is a palindrome"\nassert palindrome("hello") is False, "hello is not a palindrome"',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'A slice with a negative step reverses a string: text[::-1]', id: 'Slice dengan langkah negatif membalik string: teks[::-1]' },
          { en: 'Count by looping the characters and testing `if h in "aeiou"`.', id: 'Hitung dengan mengulang tiap karakter dan menguji `if h in "aiueo"`.' },
          { en: 'palindrome can reuse reverse: return text == reverse(text)', id: 'palindrom bisa memakai ulang balik: return teks == balik(teks)' },
        ],
        solution: {
          en: 'def reverse(text):\n    return text[::-1]\n\ndef vowels(text):\n    count = 0\n    for h in text:\n        if h in "aeiou":\n            count += 1\n    return count\n\ndef palindrome(text):\n    return text == reverse(text)',
          id: 'def balik(teks):\n    return teks[::-1]\n\ndef vokal(teks):\n    jumlah = 0\n    for h in teks:\n        if h in "aiueo":\n            jumlah += 1\n    return jumlah\n\ndef palindrom(teks):\n    return teks == balik(teks)',
        },
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
              code: {
                en: 'def greet(name, greeting="Hello"):\n    print(f"{greeting}, {name}!")\n\ngreet("Ani")\ngreet("Budi", "Good morning")',
                id: 'def sapa(nama, salam="Halo"):\n    print(f"{salam}, {nama}!")\n\nsapa("Ani")\nsapa("Budi", "Selamat pagi")',
              },
              output: { en: 'Hello, Ani!\nGood morning, Budi!', id: 'Halo, Ani!\nSelamat pagi, Budi!' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Naming arguments at the call', id: 'Menyebut nama argumen saat memanggil' },
              body: {
                en: 'You can pass by name, in any order. Long calls become readable, and you can skip over defaults you do not care about.',
                id: 'Kamu bisa mengoper berdasarkan nama, dalam urutan bebas. Pemanggilan panjang jadi terbaca, dan kamu bisa melewati nilai bawaan yang tidak kamu pedulikan.',
              },
              code: {
                en: 'def box(width=1, height=1):\n    return width * height\n\nprint(box(height=5))\nprint(box(width=2, height=3))',
                id: 'def kotak(lebar=1, tinggi=1):\n    return lebar * tinggi\n\nprint(kotak(tinggi=5))\nprint(kotak(lebar=2, tinggi=3))',
              },
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
                en: 'Write `discount(price, percent=10)` returning the price after the discount. `discount(100000)` is 90000.0 and `discount(100000, 25)` is 75000.0. Print both.',
                id: 'Tulis `diskon(harga, persen=10)` yang mengembalikan harga setelah potongan. `diskon(100000)` = 90000.0 dan `diskon(100000, 25)` = 75000.0. Cetak keduanya.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'Prints 90000.0 then 75000.0', id: 'Mencetak 90000.0 lalu 75000.0' },
                    expectOutput: '90000.0\n75000.0',
                  },
                  {
                    name: { en: 'The default is 10 percent', id: 'Nilai bawaannya 10 persen' },
                    assert: 'assert discount(200000) == 180000.0, "without a second argument it must cut 10 percent"',
                  },
                ],
                id: [
                  {
                    name: { en: 'Prints 90000.0 then 75000.0', id: 'Mencetak 90000.0 lalu 75000.0' },
                    expectOutput: '90000.0\n75000.0',
                  },
                  {
                    name: { en: 'The default is 10 percent', id: 'Nilai bawaannya 10 persen' },
                    assert: 'assert diskon(200000) == 180000.0, "tanpa argumen kedua harus potong 10 persen"',
                  },
                ],
              },
              hints: [
                { en: 'The remaining share is (100 - percent) / 100.', id: 'Sisa yang dibayar adalah (100 - persen) / 100.' },
                { en: 'return price * (100 - percent) / 100', id: 'return harga * (100 - persen) / 100' },
              ],
              solution: {
                en: 'def discount(price, percent=10):\n    return price * (100 - percent) / 100\n\nprint(discount(100000))\nprint(discount(100000, 25))',
                id: 'def diskon(harga, persen=10):\n    return harga * (100 - persen) / 100\n\nprint(diskon(100000))\nprint(diskon(100000, 25))',
              },
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
              code: {
                en: 'def average(numbers):\n    return sum(numbers) / len(numbers)\n\ndef rating(value):\n    if value >= 80:\n        return "Good"\n    return "Enough"\n\ndata = [90, 85, 80]\nprint(rating(average(data)))',
                id: 'def rata(angka):\n    return sum(angka) / len(angka)\n\ndef predikat(nilai):\n    if nilai >= 80:\n        return "Baik"\n    return "Cukup"\n\ndata = [90, 85, 80]\nprint(predikat(rata(data)))',
              },
              output: { en: 'Good', id: 'Baik' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Local names stay local', id: 'Nama lokal tetap lokal' },
              body: {
                en: 'A variable created inside a function disappears when the function ends. That isolation is a feature — two functions can both use `i` without ever colliding.',
                id: 'Variabel yang dibuat di dalam fungsi lenyap saat fungsi berakhir. Keterpisahan itu justru keunggulan — dua fungsi bisa sama-sama memakai `i` tanpa pernah bentrok.',
              },
              code: {
                en: 'def calculate():\n    total = 99\n    return total\n\nprint(calculate())\nprint("total" in dir())',
                id: 'def hitung():\n    total = 99\n    return total\n\nprint(hitung())\nprint("total" in dir())',
              },
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
                en: 'Write `is_odd(n)` returning True for odd numbers, and `count_odd(numbers)` that uses it to return how many odd numbers a list holds.',
                id: 'Tulis `ganjil(n)` yang mengembalikan True untuk angka ganjil, dan `hitung_ganjil(daftar)` yang memakainya untuk mengembalikan berapa banyak angka ganjil dalam sebuah list.',
              },
              starter: {
                en: 'def is_odd(n):\n    pass\n\ndef count_odd(numbers):\n    pass\n',
                id: 'def ganjil(n):\n    pass\n\ndef hitung_ganjil(daftar):\n    pass\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'is_odd works', id: 'ganjil berfungsi' },
                    assert: 'assert is_odd(3) is True\nassert is_odd(4) is False\nassert is_odd(0) is False',
                  },
                  {
                    name: { en: 'count_odd counts', id: 'hitung_ganjil menghitung' },
                    assert:
                      'assert count_odd([1, 2, 3, 4, 5]) == 3\nassert count_odd([2, 4]) == 0\nassert count_odd([]) == 0',
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'n % 2 == 1 is True exactly for odd numbers.', id: 'n % 2 == 1 bernilai True tepat untuk angka ganjil.' },
                { en: 'Loop the list, call is_odd(x), count the Trues.', id: 'Ulang list-nya, panggil ganjil(x), hitung yang True.' },
              ],
              solution: {
                en: 'def is_odd(n):\n    return n % 2 == 1\n\ndef count_odd(numbers):\n    count = 0\n    for n in numbers:\n        if is_odd(n):\n            count += 1\n    return count',
                id: 'def ganjil(n):\n    return n % 2 == 1\n\ndef hitung_ganjil(daftar):\n    jumlah = 0\n    for n in daftar:\n        if ganjil(n):\n            jumlah += 1\n    return jumlah',
              },
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
          { en: '`average(grades)` returns the average of a list, or 0 for an empty list.', id: '`rata_rata(nilai)` mengembalikan rata-rata sebuah list, atau 0 untuk list kosong.' },
          { en: '`grade(n)` returns "A" for 90+, "B" for 80+, "C" for 70+, otherwise "D".', id: '`predikat(n)` mengembalikan "A" untuk 90+, "B" untuk 80+, "C" untuk 70+, selain itu "D".' },
          { en: '`best_student(classroom)` returns the name of the student with the highest average.', id: '`terbaik(kelas)` mengembalikan nama siswa dengan rata-rata tertinggi.' },
          { en: '`report(classroom)` prints one line per student: `Ani: 85.0 (B)` with the average rounded to one decimal.', id: '`laporan(kelas)` mencetak satu baris per siswa: `Ani: 85.0 (B)` dengan rata-rata dibulatkan satu desimal.' },
        ],
        starter: {
          en: '# Class gradebook\nclassroom = {\n    "Ani": [90, 80],\n    "Budi": [70, 60],\n    "Citra": [95, 100],\n}\n\ndef average(grades):\n    pass\n\ndef grade(n):\n    pass\n\ndef best_student(classroom):\n    pass\n\ndef report(classroom):\n    pass\n',
          id: '# Buku nilai kelas\nkelas = {\n    "Ani": [90, 80],\n    "Budi": [70, 60],\n    "Citra": [95, 100],\n}\n\ndef rata_rata(nilai):\n    pass\n\ndef predikat(n):\n    pass\n\ndef terbaik(kelas):\n    pass\n\ndef laporan(kelas):\n    pass\n',
        },
        tests: {
          en: [
            {
              name: { en: 'average handles the empty list', id: 'rata_rata menangani list kosong' },
              assert: 'assert average([90, 80]) == 85\nassert average([]) == 0',
            },
            {
              name: { en: 'grade covers every band', id: 'predikat mencakup semua rentang' },
              assert:
                'assert grade(95) == "A"\nassert grade(80) == "B"\nassert grade(70) == "C"\nassert grade(10) == "D"',
            },
            {
              name: { en: 'best_student finds the top student', id: 'terbaik menemukan siswa teratas' },
              assert:
                'assert best_student(classroom) == "Citra"\nassert best_student({"X": [10], "Y": [20]}) == "Y"',
            },
            {
              name: { en: 'report prints one line per student', id: 'laporan mencetak satu baris per siswa' },
              assert: 'report(classroom)',
              expectOutput: 'Ani: 85.0 (B)\nBudi: 65.0 (D)\nCitra: 97.5 (A)',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'Guard the empty list first: if len(grades) == 0: return 0', id: 'Amankan list kosong lebih dulu: if len(nilai) == 0: return 0' },
          { en: 'grade is an elif chain from highest to lowest.', id: 'predikat adalah rantai elif dari tertinggi ke terendah.' },
          {
            en: 'For best_student, keep the best name and best score as you loop .items().',
            id: 'Untuk terbaik, simpan nama dan skor terbaik sambil mengulang .items().',
          },
          {
            en: 'report reuses the other three: print(f"{name}: {round(r, 1)} ({grade(r)})")',
            id: 'laporan memakai ulang tiga fungsi lain: print(f"{nama}: {round(r, 1)} ({predikat(r)})")',
          },
        ],
        solution: {
          en: 'classroom = {\n    "Ani": [90, 80],\n    "Budi": [70, 60],\n    "Citra": [95, 100],\n}\n\ndef average(grades):\n    if len(grades) == 0:\n        return 0\n    return sum(grades) / len(grades)\n\ndef grade(n):\n    if n >= 90:\n        return "A"\n    elif n >= 80:\n        return "B"\n    elif n >= 70:\n        return "C"\n    return "D"\n\ndef best_student(classroom):\n    best_name = ""\n    best_score = -1\n    for name, grades in classroom.items():\n        r = average(grades)\n        if r > best_score:\n            best_score = r\n            best_name = name\n    return best_name\n\ndef report(classroom):\n    for name, grades in classroom.items():\n        r = average(grades)\n        print(f"{name}: {round(r, 1)} ({grade(r)})")',
          id: 'kelas = {\n    "Ani": [90, 80],\n    "Budi": [70, 60],\n    "Citra": [95, 100],\n}\n\ndef rata_rata(nilai):\n    if len(nilai) == 0:\n        return 0\n    return sum(nilai) / len(nilai)\n\ndef predikat(n):\n    if n >= 90:\n        return "A"\n    elif n >= 80:\n        return "B"\n    elif n >= 70:\n        return "C"\n    return "D"\n\ndef terbaik(kelas):\n    nama_terbaik = ""\n    skor_terbaik = -1\n    for nama, nilai in kelas.items():\n        r = rata_rata(nilai)\n        if r > skor_terbaik:\n            skor_terbaik = r\n            nama_terbaik = nama\n    return nama_terbaik\n\ndef laporan(kelas):\n    for nama, nilai in kelas.items():\n        r = rata_rata(nilai)\n        print(f"{nama}: {round(r, 1)} ({predikat(r)})")',
        },
        xp: 80,
      },
    },
  ],
}
