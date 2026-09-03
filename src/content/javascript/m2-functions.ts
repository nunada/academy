import type { Module } from '../types'

/** Module 2 — functions and the two collections.
 *
 *  From here the exercises define functions, which lets the checks call them
 *  with several inputs instead of inspecting a single fixed run. That is the
 *  first point in the course where a test can really prove the logic works. */
export const module2: Module = {
  id: 'js-m2',
  title: { en: 'Functions and Collections', id: 'Fungsi dan Koleksi' },
  summary: {
    en: 'Name a piece of work, then hold many values and work through them.',
    id: 'Menamai sepotong pekerjaan, lalu menyimpan banyak nilai dan mengolahnya.',
  },
  submodules: [
    /* ------------------------------------------------------------ 2.1 functions */
    {
      id: 'js-m2-s1',
      title: { en: 'Functions', id: 'Fungsi' },
      summary: {
        en: 'Wrap work in a name, feed it values, and hand a result back.',
        id: 'Bungkus pekerjaan dalam sebuah nama, beri nilai masukan, dan kembalikan hasilnya.',
      },
      lessons: [
        {
          id: 'js-m2-s1-l1',
          title: { en: 'Declaring and calling', id: 'Mendeklarasikan dan memanggil' },
          goal: { en: 'Write a function that returns something.', id: 'Menulis fungsi yang mengembalikan sesuatu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'return hands the value back', id: 'return menyerahkan nilainya kembali' },
              body: {
                en: 'A function that logs is a dead end — you cannot do anything with the number afterwards. `return` gives it to the caller, who can store it, add to it, or log it later.',
                id: 'Fungsi yang hanya menampilkan adalah jalan buntu — kamu tak bisa mengolah angkanya setelah itu. `return` menyerahkannya kepada pemanggil, yang bisa menyimpannya, menambahkannya, atau menampilkannya nanti.',
              },
              code: {
                en: 'function area(w, h) {\n  return w * h;\n}\n\nconst result = area(4, 5);\nconsole.log(result + 10);',
                id: 'function luas(p, l) {\n  return p * l;\n}\n\nconst hasil = luas(4, 5);\nconsole.log(hasil + 10);',
              },
              output: { en: '30', id: '30' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'No return means undefined', id: 'Tanpa return berarti undefined' },
              body: {
                en: 'Leave `return` out and the function still gives something back: `undefined`. This is the classic bug — the function clearly worked, yet the variable holding its result is empty.',
                id: 'Hilangkan `return` dan fungsinya tetap mengembalikan sesuatu: `undefined`. Inilah bug klasiknya — fungsinya jelas berjalan, tetapi variabel penampung hasilnya kosong.',
              },
              code: {
                en: 'function add(a, b) {\n  console.log(a + b);\n}\n\nconst x = add(2, 3);\nconsole.log(x);',
                id: 'function tambah(a, b) {\n  console.log(a + b);\n}\n\nconst x = tambah(2, 3);\nconsole.log(x);',
              },
              output: { en: '5\nundefined', id: '5\nundefined' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Arrow functions, shorter', id: 'Arrow function, lebih pendek' },
              body: {
                en: 'The arrow form does the same job with less ceremony, and a single expression needs no braces or `return` at all. Both forms are everywhere in real code, so you need to read both.',
                id: 'Bentuk panah melakukan pekerjaan sama dengan upacara lebih sedikit, dan satu ekspresi tunggal sama sekali tak butuh kurung kurawal atau `return`. Kedua bentuk ada di mana-mana pada kode nyata, jadi kamu perlu bisa membaca keduanya.',
              },
              code: {
                en: 'const area = (w, h) => w * h;\nconst greet = (name) => `Hello, ${name}`;\n\nconsole.log(area(3, 4));\nconsole.log(greet("Ani"));',
                id: 'const luas = (p, l) => p * l;\nconst sapa = (nama) => `Halo, ${nama}`;\n\nconsole.log(luas(3, 4));\nconsole.log(sapa("Ani"));',
              },
              output: { en: '12\nHello, Ani', id: '12\nHalo, Ani' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is logged?', id: 'Apa yang ditampilkan?' },
              code: {
                en: 'function double(n) {\n  n * 2;\n}\n\nconsole.log(double(5));',
                id: 'function dua(n) {\n  n * 2;\n}\n\nconsole.log(dua(5));',
              },
              options: [
                { en: 'undefined — the result is computed then thrown away', id: 'undefined — hasilnya dihitung lalu dibuang' },
                { en: '10', id: '10' },
                { en: '5', id: '5' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'The multiplication happens, but nothing returns it. `return n * 2;` is what was meant.',
                id: 'Perkaliannya terjadi, tetapi tak ada yang mengembalikannya. `return n * 2;` itulah yang dimaksud.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Give the caller the answer.', id: 'Beri pemanggilnya jawabannya.' },
              template: {
                en: 'function multiply(a, b) {\n  ___ a * b;\n}',
                id: 'function kali(a, b) {\n  ___ a * b;\n}',
              },
              blanks: ['return'],
              explain: {
                en: 'Without return the caller receives undefined.',
                id: 'Tanpa return, pemanggilnya menerima undefined.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Write `largest(a, b)` returning the larger of two numbers, and `greet(name)` returning `Hello, <name>!`. Return, do not log.',
                id: 'Tulis `terbesar(a, b)` yang mengembalikan angka terbesar dari dua angka, dan `sapa(nama)` yang mengembalikan `Halo, <nama>!`. Kembalikan, jangan tampilkan.',
              },
              starter: { en: 'function largest(a, b) {\n\n}\n\nfunction greet(name) {\n\n}\n', id: 'function terbesar(a, b) {\n\n}\n\nfunction sapa(nama) {\n\n}\n' },
              tests: {
                en: [
                  {
                    name: { en: 'largest picks the larger', id: 'largest picks the larger' },
                    check:
                      'assert(largest(3, 9) === 9, "largest(3, 9) must be 9, currently: " + JSON.stringify(largest(3, 9)));\nassert(largest(10, 2) === 10, "largest(10, 2) must be 10");\nassert(largest(4, 4) === 4, "two equal values must return that value");',
                  },
                  {
                    name: { en: 'It returns rather than logs', id: 'It returns rather than logs' },
                    check:
                      'assert(logs().length === 0, "this function must return, not console.log — currently " + logs().length + " lines of output");',
                  },
                  {
                    name: { en: 'greet builds the greeting', id: 'greet builds the greeting' },
                    check:
                      'assert(greet("Ani") === "Hello, Ani!", "greet(\\"Ani\\") must be \\"Hello, Ani!\\", currently: " + JSON.stringify(greet("Ani")));\nassert(greet("Budi") === "Hello, Budi!", "greet must use the name passed in, not a fixed name");',
                  },
                ],
                id: [
                  {
                    name: { en: 'largest picks the larger', id: 'terbesar memilih yang lebih besar' },
                    check:
                      'assert(terbesar(3, 9) === 9, "terbesar(3, 9) harus 9, sekarang: " + JSON.stringify(terbesar(3, 9)));\nassert(terbesar(10, 2) === 10, "terbesar(10, 2) harus 10");\nassert(terbesar(4, 4) === 4, "dua nilai sama harus mengembalikan nilai itu");',
                  },
                  {
                    name: { en: 'It returns rather than logs', id: 'Ia mengembalikan, bukan menampilkan' },
                    check:
                      'assert(logs().length === 0, "fungsi ini harus return, bukan console.log — sekarang ada " + logs().length + " baris keluaran");',
                  },
                  {
                    name: { en: 'greet builds the greeting', id: 'sapa menyusun sapaannya' },
                    check:
                      'assert(sapa("Ani") === "Halo, Ani!", "sapa(\\"Ani\\") harus \\"Halo, Ani!\\", sekarang: " + JSON.stringify(sapa("Ani")));\nassert(sapa("Budi") === "Halo, Budi!", "sapa harus memakai nama yang dioper, bukan nama tetap");',
                  },
                ],
              },
              hints: [
                { en: 'Compare with if, then return the winner.', id: 'Bandingkan dengan if, lalu kembalikan pemenangnya.' },
                { en: 'A template literal builds the greeting in one line.', id: 'Template literal menyusun sapaannya dalam satu baris.' },
                { en: 'return `Hello, ${name}!`;', id: 'return `Halo, ${nama}!`;' },
              ],
              solution: {
                en: 'function largest(a, b) {\n  if (a > b) {\n    return a;\n  }\n  return b;\n}\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}',
                id: 'function terbesar(a, b) {\n  if (a > b) {\n    return a;\n  }\n  return b;\n}\n\nfunction sapa(nama) {\n  return `Halo, ${nama}!`;\n}',
              },
            },
          ],
        },
        {
          id: 'js-m2-s1-l2',
          title: { en: 'Defaults and scope', id: 'Nilai bawaan dan cakupan' },
          goal: { en: 'Make a parameter optional, and know where a name lives.', id: 'Membuat parameter opsional, dan tahu di mana sebuah nama hidup.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A sensible fallback', id: 'Nilai cadangan yang masuk akal' },
              body: {
                en: 'Give a parameter a value in the signature and callers may leave it out. Without one, a missing argument arrives as `undefined` and the arithmetic quietly produces `NaN`.',
                id: 'Beri sebuah parameter nilai di tanda tangannya, maka pemanggil boleh melewatinya. Tanpa itu, argumen yang hilang tiba sebagai `undefined` dan hitungannya diam-diam menghasilkan `NaN`.',
              },
              code: {
                en: 'const discount = (price, percent = 10) => price * (100 - percent) / 100;\n\nconsole.log(discount(100000));\nconsole.log(discount(100000, 25));',
                id: 'const diskon = (harga, persen = 10) => harga * (100 - persen) / 100;\n\nconsole.log(diskon(100000));\nconsole.log(diskon(100000, 25));',
              },
              output: { en: '90000\n75000', id: '90000\n75000' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'What happens inside stays inside', id: 'Yang terjadi di dalam tetap di dalam' },
              body: {
                en: 'A name declared inside a function disappears when it ends. That isolation is a feature: two functions can both use `i` without ever colliding. A `{ ... }` block does the same for `let` and `const`.',
                id: 'Nama yang dideklarasikan di dalam fungsi lenyap saat fungsi itu berakhir. Keterpisahan itu justru keunggulan: dua fungsi bisa sama-sama memakai `i` tanpa pernah bentrok. Blok `{ ... }` melakukan hal sama untuk `let` dan `const`.',
              },
              code: {
                en: 'function compute() {\n  const total = 99;\n  return total;\n}\n\nconsole.log(compute());\nconsole.log(typeof total);',
                id: 'function hitung() {\n  const total = 99;\n  return total;\n}\n\nconsole.log(hitung());\nconsole.log(typeof total);',
              },
              output: { en: '99\nundefined', id: '99\nundefined' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A function is a value too', id: 'Fungsi juga sebuah nilai' },
              body: {
                en: 'Functions can be stored in variables and passed to other functions. That is not a curiosity — it is exactly how `map` and `filter` work in the next lesson.',
                id: 'Fungsi bisa disimpan dalam variabel dan dioper ke fungsi lain. Itu bukan keanehan — persis begitulah `map` dan `filter` bekerja di pelajaran berikutnya.',
              },
              code: {
                en: 'const double = (n) => n * 2;\n\nfunction apply(fn, value) {\n  return fn(value);\n}\n\nconsole.log(apply(double, 21));',
                id: 'const dua = (n) => n * 2;\n\nfunction terapkan(fn, nilai) {\n  return fn(nilai);\n}\n\nconsole.log(terapkan(dua, 21));',
              },
              output: { en: '42', id: '42' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is logged?', id: 'Apa yang ditampilkan?' },
              code: 'function f(a, b = 10) {\n  return a + b;\n}\n\nconsole.log(f(5));',
              options: [
                { en: '15 — b falls back to 10', id: '15 — b memakai cadangan 10' },
                { en: '5', id: '5' },
                { en: 'NaN', id: 'NaN' },
                { en: 'An error — b is missing', id: 'Error — b tidak diberikan' },
              ],
              answer: 0,
              explain: {
                en: 'Without the default, b would be undefined and 5 + undefined is NaN.',
                id: 'Tanpa nilai bawaannya, b akan undefined dan 5 + undefined menghasilkan NaN.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Write `truncate(text, maxLength = 10)` returning the text unchanged when it fits, and otherwise the first `maxLength` characters followed by `...`.',
                id: 'Tulis `potong(teks, panjang = 10)` yang mengembalikan teks apa adanya bila muat, dan selain itu `panjang` karakter pertama diikuti `...`.',
              },
              starter: { en: 'function truncate(text, maxLength = 10) {\n\n}\n', id: 'function potong(teks, panjang = 10) {\n\n}\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Short text is left alone', id: 'Short text is left alone' },
                    check:
                      'assert(truncate("hi") === "hi", "short text must stay whole, currently: " + JSON.stringify(truncate("hi")));\nassert(truncate("tencharstr") === "tencharstr", "text of exactly the right length must not be cut");',
                  },
                  {
                    name: { en: 'Long text is cut', id: 'Long text is cut' },
                    check:
                      'assert(truncate("learning javascript") === "learning j...", "the result: " + JSON.stringify(truncate("learning javascript")));',
                  },
                  {
                    name: { en: 'The length can be overridden', id: 'The length can be overridden' },
                    check:
                      'assert(truncate("learning javascript", 3) === "lea...", "with maxLength 3 the result: " + JSON.stringify(truncate("learning javascript", 3)));\nassert(truncate("abc", 3) === "abc", "an exact-length match is not cut");',
                  },
                ],
                id: [
                  {
                    name: { en: 'Short text is left alone', id: 'Teks pendek dibiarkan' },
                    check:
                      'assert(potong("halo") === "halo", "teks pendek harus utuh, sekarang: " + JSON.stringify(potong("halo")));\nassert(potong("tepat10car") === "tepat10car", "teks yang panjangnya pas tidak boleh dipotong");',
                  },
                  {
                    name: { en: 'Long text is cut', id: 'Teks panjang dipotong' },
                    check:
                      'assert(potong("belajar javascript") === "belajar ja...", "hasilnya: " + JSON.stringify(potong("belajar javascript")));',
                  },
                  {
                    name: { en: 'The length can be overridden', id: 'Panjangnya bisa diganti' },
                    check:
                      'assert(potong("belajar javascript", 3) === "bel...", "dengan panjang 3 hasilnya: " + JSON.stringify(potong("belajar javascript", 3)));\nassert(potong("abc", 3) === "abc", "panjang sama persis tidak dipotong");',
                  },
                ],
              },
              hints: [
                { en: 'Compare text.length against maxLength first.', id: 'Bandingkan teks.length dengan panjang lebih dulu.' },
                { en: '`slice(0, maxLength)` takes the first characters.', id: '`slice(0, panjang)` mengambil karakter pertamanya.' },
                { en: 'Only cut when it is genuinely longer, not when it is equal.', id: 'Potong hanya bila benar-benar lebih panjang, bukan saat sama.' },
              ],
              solution: {
                en: 'function truncate(text, maxLength = 10) {\n  if (text.length <= maxLength) {\n    return text;\n  }\n  return text.slice(0, maxLength) + "...";\n}',
                id: 'function potong(teks, panjang = 10) {\n  if (teks.length <= panjang) {\n    return teks;\n  }\n  return teks.slice(0, panjang) + "...";\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'js-m2-s1-p',
        runtime: 'web',
        js: true,
        title: { en: 'Text toolkit', id: 'Toolkit teks' },
        brief: {
          en: 'Four small functions another program could reuse.',
          id: 'Empat fungsi kecil yang bisa dipakai ulang program lain.',
        },
        requirements: [
          { en: '`reverse(text)` returns the text reversed.', id: '`balik(teks)` mengembalikan teks yang dibalik.' },
          { en: '`capitalize(text)` returns it with the first letter uppercased.', id: '`kapital(teks)` mengembalikannya dengan huruf pertama kapital.' },
          { en: '`countWords(text)` returns how many words it holds; empty or spaces only gives 0.', id: '`hitungKata(teks)` mengembalikan jumlah katanya; kosong atau hanya spasi memberi 0.' },
          { en: '`palindrome(text)` returns true when it reads the same backwards, ignoring case.', id: '`palindrom(teks)` mengembalikan true bila terbaca sama dari belakang, tanpa memedulikan besar-kecil huruf.' },
          { en: 'All four return; none of them log.', id: 'Keempatnya mengembalikan nilai; tak satu pun menampilkan.' },
        ],
        starter: {
          en: 'function reverse(text) {\n\n}\n\nfunction capitalize(text) {\n\n}\n\nfunction countWords(text) {\n\n}\n\nfunction palindrome(text) {\n\n}\n',
          id: 'function balik(teks) {\n\n}\n\nfunction kapital(teks) {\n\n}\n\nfunction hitungKata(teks) {\n\n}\n\nfunction palindrom(teks) {\n\n}\n',
        },
        tests: {
          en: [
            {
              name: { en: 'reverse reverses', id: 'reverse reverses' },
              check:
                'assert(reverse("abc") === "cba", "reverse(\\"abc\\") must be \\"cba\\", currently: " + JSON.stringify(reverse("abc")));\nassert(reverse("") === "", "empty text stays empty");',
            },
            {
              name: { en: 'capitalize raises the first letter only', id: 'capitalize raises the first letter only' },
              check:
                'assert(capitalize("ani") === "Ani", "capitalize(\\"ani\\") must be \\"Ani\\", currently: " + JSON.stringify(capitalize("ani")));\nassert(capitalize("budi santoso") === "Budi santoso", "only the first letter should change");\nassert(capitalize("") === "", "empty text stays empty");',
            },
            {
              name: { en: 'countWords counts words', id: 'countWords counts words' },
              check:
                'assert(countWords("one two three") === 3, "must be 3, currently: " + JSON.stringify(countWords("one two three")));\nassert(countWords("one") === 1, "one word must be 1");\nassert(countWords("") === 0, "empty text must be 0");\nassert(countWords("   ") === 0, "spaces only must be 0, currently: " + JSON.stringify(countWords("   ")));',
            },
            {
              name: { en: 'palindrome ignores case', id: 'palindrome ignores case' },
              check:
                'assert(palindrome("kayak") === true, "kayak is a palindrome");\nassert(palindrome("Kayak") === true, "case must be ignored");\nassert(palindrome("hello") === false, "hello is not a palindrome");',
            },
            {
              name: { en: 'Nothing is logged', id: 'Nothing is logged' },
              check: 'assert(logs().length === 0, "this toolkit must only return — currently " + logs().length + " lines of output");',
            },
          ],
          id: [
            {
              name: { en: 'reverse reverses', id: 'balik membalik' },
              check:
                'assert(balik("abc") === "cba", "balik(\\"abc\\") harus \\"cba\\", sekarang: " + JSON.stringify(balik("abc")));\nassert(balik("") === "", "teks kosong tetap kosong");',
            },
            {
              name: { en: 'capitalize raises the first letter only', id: 'kapital hanya menaikkan huruf pertama' },
              check:
                'assert(kapital("ani") === "Ani", "kapital(\\"ani\\") harus \\"Ani\\", sekarang: " + JSON.stringify(kapital("ani")));\nassert(kapital("budi santoso") === "Budi santoso", "hanya huruf pertama yang berubah");\nassert(kapital("") === "", "teks kosong tetap kosong");',
            },
            {
              name: { en: 'countWords counts words', id: 'hitungKata menghitung kata' },
              check:
                'assert(hitungKata("satu dua tiga") === 3, "harus 3, sekarang: " + JSON.stringify(hitungKata("satu dua tiga")));\nassert(hitungKata("satu") === 1, "satu kata harus 1");\nassert(hitungKata("") === 0, "teks kosong harus 0");\nassert(hitungKata("   ") === 0, "spasi saja harus 0, sekarang: " + JSON.stringify(hitungKata("   ")));',
            },
            {
              name: { en: 'palindrome ignores case', id: 'palindrom mengabaikan besar-kecil huruf' },
              check:
                'assert(palindrom("katak") === true, "katak adalah palindrom");\nassert(palindrom("Katak") === true, "besar-kecil huruf harus diabaikan");\nassert(palindrom("halo") === false, "halo bukan palindrom");',
            },
            {
              name: { en: 'Nothing is logged', id: 'Tidak ada yang ditampilkan' },
              check: 'assert(logs().length === 0, "toolkit ini harus return saja — sekarang ada " + logs().length + " baris keluaran");',
            },
          ],
        },
        hints: [
          { en: '`split("")`, `reverse()`, `join("")` turns a string round.', id: '`split("")`, `reverse()`, `join("")` membalik sebuah string.' },
          { en: 'For capitalize, take `text[0]` uppercased plus `text.slice(1)` — and guard the empty string.', id: 'Untuk kapitalnya, ambil `teks[0]` yang dibesarkan ditambah `teks.slice(1)` — dan amankan teks kosong.' },
          { en: '`trim()` first, then split on spaces; a trimmed empty string still splits into one empty item.', id: '`trim()` dulu, lalu pecah pada spasi; string kosong yang di-trim tetap terpecah jadi satu item kosong.' },
          { en: 'palindrome can reuse reverse, after lowercasing both sides.', id: 'palindrom bisa memakai ulang balik, setelah kedua sisinya dikecilkan.' },
        ],
        solution: {
          en: 'function reverse(text) {\n  return text.split("").reverse().join("");\n}\n\nfunction capitalize(text) {\n  if (text.length === 0) {\n    return text;\n  }\n  return text[0].toUpperCase() + text.slice(1);\n}\n\nfunction countWords(text) {\n  const trimmed = text.trim();\n  if (trimmed === "") {\n    return 0;\n  }\n  return trimmed.split(/\\s+/).length;\n}\n\nfunction palindrome(text) {\n  const lower = text.toLowerCase();\n  return lower === reverse(lower);\n}',
          id: 'function balik(teks) {\n  return teks.split("").reverse().join("");\n}\n\nfunction kapital(teks) {\n  if (teks.length === 0) {\n    return teks;\n  }\n  return teks[0].toUpperCase() + teks.slice(1);\n}\n\nfunction hitungKata(teks) {\n  const bersih = teks.trim();\n  if (bersih === "") {\n    return 0;\n  }\n  return bersih.split(/\\s+/).length;\n}\n\nfunction palindrom(teks) {\n  const kecil = teks.toLowerCase();\n  return kecil === balik(kecil);\n}',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------------ 2.2 arrays & objects */
    {
      id: 'js-m2-s2',
      title: { en: 'Arrays and Objects', id: 'Array dan Object' },
      summary: {
        en: 'Ordered lists, labelled records, and the methods that transform them.',
        id: 'Daftar berurut, catatan berlabel, dan method yang mengolahnya.',
      },
      lessons: [
        {
          id: 'js-m2-s2-l1',
          title: { en: 'Lists and records', id: 'Daftar dan catatan' },
          goal: { en: 'Hold many values, and labelled ones.', id: 'Menyimpan banyak nilai, dan yang berlabel.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An array is ordered', id: 'Array itu berurut' },
              body: {
                en: 'Square brackets, positions from 0, and `length` for how many. `push` adds to the end. Note that an array held in a `const` can still be changed — `const` fixes the name, not the contents.',
                id: 'Kurung siku, posisi mulai dari 0, dan `length` untuk jumlahnya. `push` menambah di ujung. Perhatikan: array dalam `const` tetap bisa diubah — `const` mengunci namanya, bukan isinya.',
              },
              code: {
                en: 'const scores = [80, 95, 70];\n\nconsole.log(scores[0]);\nconsole.log(scores.length);\n\nscores.push(60);\nconsole.log(scores);',
                id: 'const nilai = [80, 95, 70];\n\nconsole.log(nilai[0]);\nconsole.log(nilai.length);\n\nnilai.push(60);\nconsole.log(nilai);',
              },
              output: { en: '80\n3\n[80,95,70,60]', id: '80\n3\n[80,95,70,60]' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'An object is labelled', id: 'Object itu berlabel' },
              body: {
                en: 'An array says "the third one"; an object says "the one called name". Reach in with a dot. Asking for a key that is not there gives `undefined` rather than an error.',
                id: 'Array berkata "yang ketiga"; object berkata "yang bernama nama". Jangkau isinya dengan titik. Meminta kunci yang tidak ada memberi `undefined`, bukan error.',
              },
              code: {
                en: 'const student = { name: "Ani", score: 88 };\n\nconsole.log(student.name);\nconsole.log(student.city);\n\nstudent.city = "Surabaya";\nconsole.log(student.city);',
                id: 'const siswa = { nama: "Ani", nilai: 88 };\n\nconsole.log(siswa.nama);\nconsole.log(siswa.kota);\n\nsiswa.kota = "Surabaya";\nconsole.log(siswa.kota);',
              },
              output: { en: 'Ani\nundefined\nSurabaya', id: 'Ani\nundefined\nSurabaya' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The two nest', id: 'Keduanya bisa bersarang' },
              body: {
                en: 'An array of objects is the shape most real data arrives in — a list of records. Everything you know about looping applies to it unchanged.',
                id: 'Array berisi object adalah bentuk yang paling sering dipakai data nyata — sebuah daftar catatan. Semua yang kamu tahu tentang perulangan berlaku apa adanya di sini.',
              },
              code: {
                en: 'const students = [\n  { name: "Ani", score: 88 },\n  { name: "Budi", score: 65 },\n];\n\nfor (const s of students) {\n  console.log(`${s.name}: ${s.score}`);\n}',
                id: 'const kelas = [\n  { nama: "Ani", nilai: 88 },\n  { nama: "Budi", nilai: 65 },\n];\n\nfor (const s of kelas) {\n  console.log(`${s.nama}: ${s.nilai}`);\n}',
              },
              output: { en: 'Ani: 88\nBudi: 65', id: 'Ani: 88\nBudi: 65' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Does this throw?', id: 'Apakah ini memunculkan error?' },
              code: 'const a = [1, 2, 3];\na.push(4);',
              options: [
                { en: 'No — const fixes the name, not the contents', id: 'Tidak — const mengunci namanya, bukan isinya' },
                { en: 'Yes — a is const', id: 'Ya — a adalah const' },
                { en: 'Only in strict mode', id: 'Hanya dalam strict mode' },
                { en: 'Yes, arrays are frozen', id: 'Ya, array bersifat beku' },
              ],
              answer: 0,
              explain: {
                en: '`a = [4]` would throw. Changing what the array holds does not.',
                id: '`a = [4]` akan error. Mengubah isi array-nya tidak.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Read the name out of the record.', id: 'Baca nama dari catatannya.' },
              template: {
                en: 'const student = { name: "Ani", score: 88 };\nconsole.log(student___name);',
                id: 'const siswa = { nama: "Ani", nilai: 88 };\nconsole.log(siswa___nama);',
              },
              blanks: ['.'],
              explain: {
                en: 'A dot reaches a property by name. Brackets are for arrays, and for a key held in a variable.',
                id: 'Titik menjangkau properti berdasarkan namanya. Kurung siku untuk array, dan untuk kunci yang tersimpan dalam variabel.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Write `addStudent(students, name, score)` that pushes a new record `{ name, score }` onto the array and returns the new length.',
                id: 'Tulis `tambahSiswa(kelas, nama, nilai)` yang menambahkan catatan baru `{ nama, nilai }` ke array itu dan mengembalikan panjang barunya.',
              },
              starter: { en: 'function addStudent(students, name, score) {\n\n}\n', id: 'function tambahSiswa(kelas, nama, nilai) {\n\n}\n' },
              tests: {
                en: [
                  {
                    name: { en: 'The record lands in the array', id: 'The record lands in the array' },
                    check:
                      'var k = [];\naddStudent(k, "Ani", 88);\nassert(k.length === 1, "the array must grow, its length is now: " + k.length);\nassert(k[0].name === "Ani" && k[0].score === 88, "its content: " + JSON.stringify(k[0]));',
                  },
                  {
                    name: { en: 'It returns the new length', id: 'It returns the new length' },
                    check:
                      'var k = [{ name: "X", score: 1 }];\nvar n = addStudent(k, "Budi", 65);\nassert(n === 2, "must return 2, currently: " + JSON.stringify(n));',
                  },
                  {
                    name: { en: 'It appends rather than replaces', id: 'It appends rather than replaces' },
                    check:
                      'var k = [{ name: "X", score: 1 }];\naddStudent(k, "Budi", 65);\nassert(k[0].name === "X", "the old record must not be lost");\nassert(k[1].name === "Budi", "the new record must be in the last position");',
                  },
                ],
                id: [
                  {
                    name: { en: 'The record lands in the array', id: 'Catatannya masuk ke array' },
                    check:
                      'var k = [];\ntambahSiswa(k, "Ani", 88);\nassert(k.length === 1, "array harus bertambah, panjangnya sekarang: " + k.length);\nassert(k[0].nama === "Ani" && k[0].nilai === 88, "isinya: " + JSON.stringify(k[0]));',
                  },
                  {
                    name: { en: 'It returns the new length', id: 'Ia mengembalikan panjang barunya' },
                    check:
                      'var k = [{ nama: "X", nilai: 1 }];\nvar n = tambahSiswa(k, "Budi", 65);\nassert(n === 2, "harus mengembalikan 2, sekarang: " + JSON.stringify(n));',
                  },
                  {
                    name: { en: 'It appends rather than replaces', id: 'Ia menambah, bukan mengganti' },
                    check:
                      'var k = [{ nama: "X", nilai: 1 }];\ntambahSiswa(k, "Budi", 65);\nassert(k[0].nama === "X", "catatan lama tidak boleh hilang");\nassert(k[1].nama === "Budi", "catatan baru harus di posisi terakhir");',
                  },
                ],
              },
              hints: [
                { en: 'push returns the new length already.', id: 'push sudah mengembalikan panjang barunya.' },
                { en: 'Build the record as an object literal first.', id: 'Bangun catatannya sebagai object literal dulu.' },
                { en: 'return students.push({ name: name, score: score });', id: 'return kelas.push({ nama: nama, nilai: nilai });' },
              ],
              solution: {
                en: 'function addStudent(students, name, score) {\n  return students.push({ name, score });\n}',
                id: 'function tambahSiswa(kelas, nama, nilai) {\n  return kelas.push({ nama, nilai });\n}',
              },
            },
          ],
        },
        {
          id: 'js-m2-s2-l2',
          title: { en: 'map, filter, reduce', id: 'map, filter, reduce' },
          goal: { en: 'Transform a list without writing a loop.', id: 'Mengolah sebuah daftar tanpa menulis loop.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'map: same length, new values', id: 'map: panjang sama, nilai baru' },
              body: {
                en: '`map` runs your function on every item and collects what it returns. The result always has the same length as the original — that is the promise of `map`.',
                id: '`map` menjalankan fungsimu pada tiap item dan mengumpulkan apa yang dikembalikannya. Hasilnya selalu sepanjang aslinya — itulah janji `map`.',
              },
              code: {
                en: 'const scores = [80, 95, 70];\nconst raised = scores.map((n) => n + 5);\n\nconsole.log(raised);\nconsole.log(scores);',
                id: 'const nilai = [80, 95, 70];\nconst naik = nilai.map((n) => n + 5);\n\nconsole.log(naik);\nconsole.log(nilai);',
              },
              output: { en: '[85,100,75]\n[80,95,70]', id: '[85,100,75]\n[80,95,70]' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'filter: fewer items, unchanged', id: 'filter: item lebih sedikit, tak berubah' },
              body: {
                en: '`filter` keeps the items for which your function returns true. The items themselves are untouched — only how many survive changes.',
                id: '`filter` menyimpan item yang membuat fungsimu mengembalikan true. Itemnya sendiri tak tersentuh — hanya berapa yang bertahan yang berubah.',
              },
              code: {
                en: 'const scores = [80, 95, 70, 45];\nconst passed = scores.filter((n) => n >= 70);\n\nconsole.log(passed);\nconsole.log(passed.length);',
                id: 'const nilai = [80, 95, 70, 45];\nconst lulus = nilai.filter((n) => n >= 70);\n\nconsole.log(lulus);\nconsole.log(lulus.length);',
              },
              output: { en: '[80,95,70]\n3', id: '[80,95,70]\n3' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'reduce: many into one', id: 'reduce: banyak menjadi satu' },
              body: {
                en: '`reduce` folds a list down to a single value. The first argument is what has been accumulated so far, the second is the current item, and the number at the end is where it starts.',
                id: '`reduce` melipat sebuah daftar menjadi satu nilai. Argumen pertamanya adalah yang sudah terkumpul, kedua adalah item saat ini, dan angka di akhirnya adalah titik mulainya.',
              },
              code: {
                en: 'const scores = [80, 95, 70];\nconst total = scores.reduce((sum, n) => sum + n, 0);\n\nconsole.log(total);\nconsole.log(total / scores.length);',
                id: 'const nilai = [80, 95, 70];\nconst total = nilai.reduce((jumlah, n) => jumlah + n, 0);\n\nconsole.log(total);\nconsole.log(total / nilai.length);',
              },
              output: { en: '245\n81.66666666666667', id: '245\n81.66666666666667' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You need the names of everyone who passed. Which pair?',
                id: 'Kamu butuh nama semua yang lulus. Pasangan yang mana?',
              },
              options: [
                { en: 'filter then map', id: 'filter lalu map' },
                { en: 'map then reduce', id: 'map lalu reduce' },
                { en: 'reduce alone', id: 'reduce saja' },
                { en: 'map alone', id: 'map saja' },
              ],
              answer: 0,
              explain: {
                en: 'filter narrows to those who passed; map then turns each record into just its name.',
                id: 'filter menyaring yang lulus; map lalu mengubah tiap catatan menjadi namanya saja.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a chain that logs the names of everyone scoring 70 or more.',
                id: 'Susun rantai yang menampilkan nama semua yang bernilai 70 ke atas.',
              },
              lines: {
                en: [
                  'const students = [{ name: "Ani", score: 88 }, { name: "Budi", score: 65 }];',
                  'const passed = students',
                  '  .filter((s) => s.score >= 70)',
                  '  .map((s) => s.name);',
                  'console.log(passed);',
                ],
                id: [
                  'const kelas = [{ nama: "Ani", nilai: 88 }, { nama: "Budi", nilai: 65 }];',
                  'const lulus = kelas',
                  '  .filter((s) => s.nilai >= 70)',
                  '  .map((s) => s.nama);',
                  'console.log(lulus);',
                ],
              },
              explain: {
                en: 'Narrow first, then transform. Mapping first would throw away the score you still need.',
                id: 'Saring dulu, baru ubah. Mengubah lebih dulu akan membuang nilai yang justru masih kamu butuhkan.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Write `average(scores)` returning the average, or 0 for an empty array, and `passedNames(students)` returning an array of the names scoring 70 or more.',
                id: 'Tulis `rataRata(nilai)` yang mengembalikan rata-rata, atau 0 untuk array kosong, dan `namaLulus(kelas)` yang mengembalikan array nama yang bernilai 70 ke atas.',
              },
              starter: { en: 'function average(scores) {\n\n}\n\nfunction passedNames(students) {\n\n}\n', id: 'function rataRata(nilai) {\n\n}\n\nfunction namaLulus(kelas) {\n\n}\n' },
              tests: {
                en: [
                  {
                    name: { en: 'average averages', id: 'average averages' },
                    check:
                      'assert(average([80, 90]) === 85, "average([80, 90]) must be 85, currently: " + JSON.stringify(average([80, 90])));\nassert(average([100]) === 100, "one score must return that score");',
                  },
                  {
                    name: { en: 'The empty array is guarded', id: 'The empty array is guarded' },
                    check:
                      'assert(average([]) === 0, "an empty array must be 0, not NaN — currently: " + JSON.stringify(average([])));',
                  },
                  {
                    name: { en: 'passedNames narrows then names', id: 'passedNames narrows then names' },
                    check:
                      'var students = [{ name: "Ani", score: 88 }, { name: "Budi", score: 65 }, { name: "Citra", score: 70 }];\nvar result = passedNames(students);\nassert(Array.isArray(result), "must return an array, currently: " + typeof result);\nassert(result.join(",") === "Ani,Citra", "the result: " + JSON.stringify(result));',
                  },
                  {
                    name: { en: 'Nobody passing gives an empty array', id: 'Nobody passing gives an empty array' },
                    check:
                      'var result = passedNames([{ name: "X", score: 10 }]);\nassert(Array.isArray(result) && result.length === 0, "must be an empty array, currently: " + JSON.stringify(result));',
                  },
                ],
                id: [
                  {
                    name: { en: 'average averages', id: 'rataRata merata-ratakan' },
                    check:
                      'assert(rataRata([80, 90]) === 85, "rataRata([80, 90]) harus 85, sekarang: " + JSON.stringify(rataRata([80, 90])));\nassert(rataRata([100]) === 100, "satu nilai harus mengembalikan nilai itu");',
                  },
                  {
                    name: { en: 'The empty array is guarded', id: 'Array kosong diamankan' },
                    check:
                      'assert(rataRata([]) === 0, "array kosong harus 0, bukan NaN — sekarang: " + JSON.stringify(rataRata([])));',
                  },
                  {
                    name: { en: 'passedNames narrows then names', id: 'namaLulus menyaring lalu menamai' },
                    check:
                      'var kelas = [{ nama: "Ani", nilai: 88 }, { nama: "Budi", nilai: 65 }, { nama: "Citra", nilai: 70 }];\nvar hasil = namaLulus(kelas);\nassert(Array.isArray(hasil), "harus mengembalikan array, sekarang: " + typeof hasil);\nassert(hasil.join(",") === "Ani,Citra", "hasilnya: " + JSON.stringify(hasil));',
                  },
                  {
                    name: { en: 'Nobody passing gives an empty array', id: 'Tak ada yang lulus memberi array kosong' },
                    check:
                      'var hasil = namaLulus([{ nama: "X", nilai: 10 }]);\nassert(Array.isArray(hasil) && hasil.length === 0, "harus array kosong, sekarang: " + JSON.stringify(hasil));',
                  },
                ],
              },
              hints: [
                { en: 'Guard the empty array before dividing — dividing by 0 gives NaN.', id: 'Amankan array kosong sebelum membagi — membagi dengan 0 memberi NaN.' },
                { en: 'reduce sums the list in one line.', id: 'reduce menjumlahkan daftarnya dalam satu baris.' },
                { en: 'filter on the score, then map to the name.', id: 'filter berdasarkan nilainya, lalu map ke namanya.' },
              ],
              solution: {
                en: 'function average(scores) {\n  if (scores.length === 0) {\n    return 0;\n  }\n  return scores.reduce((sum, n) => sum + n, 0) / scores.length;\n}\n\nfunction passedNames(students) {\n  return students.filter((s) => s.score >= 70).map((s) => s.name);\n}',
                id: 'function rataRata(nilai) {\n  if (nilai.length === 0) {\n    return 0;\n  }\n  return nilai.reduce((jumlah, n) => jumlah + n, 0) / nilai.length;\n}\n\nfunction namaLulus(kelas) {\n  return kelas.filter((s) => s.nilai >= 70).map((s) => s.nama);\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'js-m2-s2-p',
        runtime: 'web',
        js: true,
        title: { en: 'Class statistics', id: 'Statistik kelas' },
        brief: {
          en: 'A set of functions that answer questions about a list of students.',
          id: 'Sekumpulan fungsi yang menjawab pertanyaan tentang daftar siswa.',
        },
        requirements: [
          { en: '`total(students)` returns the sum of every score.', id: '`total(kelas)` mengembalikan jumlah seluruh nilai.' },
          { en: '`average(students)` returns the average rounded to one decimal, or 0 when empty.', id: '`rataRata(kelas)` mengembalikan rata-rata dibulatkan satu desimal, atau 0 bila kosong.' },
          { en: '`best(students)` returns the record with the highest score, or null when empty.', id: '`terbaik(kelas)` mengembalikan catatan bernilai tertinggi, atau null bila kosong.' },
          { en: '`passed(students)` returns the records scoring 70 or more.', id: '`lulus(kelas)` mengembalikan catatan yang bernilai 70 ke atas.' },
          { en: '`summarize(students)` returns `3 students, average 77.7, best Ani`.', id: '`ringkas(kelas)` mengembalikan `3 siswa, rata-rata 77.7, terbaik Ani`.' },
        ],
        starter: {
          en: 'const example = [\n  { name: "Ani", score: 88 },\n  { name: "Budi", score: 65 },\n  { name: "Citra", score: 80 },\n];\n\nfunction total(students) {\n\n}\n\nfunction average(students) {\n\n}\n\nfunction best(students) {\n\n}\n\nfunction passed(students) {\n\n}\n\nfunction summarize(students) {\n\n}\n',
          id: 'const contoh = [\n  { nama: "Ani", nilai: 88 },\n  { nama: "Budi", nilai: 65 },\n  { nama: "Citra", nilai: 80 },\n];\n\nfunction total(kelas) {\n\n}\n\nfunction rataRata(kelas) {\n\n}\n\nfunction terbaik(kelas) {\n\n}\n\nfunction lulus(kelas) {\n\n}\n\nfunction ringkas(kelas) {\n\n}\n',
        },
        tests: {
          en: [
            {
              name: { en: 'total sums the scores', id: 'total sums the scores' },
              check:
                'assert(total(example) === 233, "total(example) must be 233, currently: " + JSON.stringify(total(example)));\nassert(total([]) === 0, "an empty list must be 0");',
            },
            {
              name: { en: 'average rounds to one decimal', id: 'average rounds to one decimal' },
              check:
                'assert(average(example) === 77.7, "average(example) must be 77.7, currently: " + JSON.stringify(average(example)));\nassert(average([]) === 0, "an empty list must be 0, not NaN");',
            },
            {
              name: { en: 'best finds the top record', id: 'best finds the top record' },
              check:
                'assert(best(example).name === "Ani", "the top scorer is Ani, currently: " + JSON.stringify(best(example)));\nassert(best([]) === null, "an empty list must be null");\nassert(best([{ name: "Solo", score: 5 }]).name === "Solo", "one student must return that student");',
            },
            {
              name: { en: 'passed keeps whole records', id: 'passed keeps whole records' },
              check:
                'var l = passed(example);\nassert(l.length === 2, "there must be two who passed, currently: " + l.length);\nassert(l[0].name === "Ani" && l[1].name === "Citra", "its content: " + JSON.stringify(l.map(function (s) { return s.name; })));\nassert(typeof l[0] === "object" && "score" in l[0], "return the whole record, not just the name");',
            },
            {
              name: { en: 'summarize reads as a sentence', id: 'summarize reads as a sentence' },
              check:
                'assert(summarize(example) === "3 students, average 77.7, best Ani", "the result: " + JSON.stringify(summarize(example)));\nvar other = [{ name: "X", score: 90 }, { name: "Y", score: 70 }];\nassert(summarize(other) === "2 students, average 80, best X", "for another list the result: " + JSON.stringify(summarize(other)));',
            },
          ],
          id: [
            {
              name: { en: 'total sums the scores', id: 'total menjumlahkan nilainya' },
              check:
                'assert(total(contoh) === 233, "total(contoh) harus 233, sekarang: " + JSON.stringify(total(contoh)));\nassert(total([]) === 0, "kelas kosong harus 0");',
            },
            {
              name: { en: 'average rounds to one decimal', id: 'rataRata membulatkan satu desimal' },
              check:
                'assert(rataRata(contoh) === 77.7, "rataRata(contoh) harus 77.7, sekarang: " + JSON.stringify(rataRata(contoh)));\nassert(rataRata([]) === 0, "kelas kosong harus 0, bukan NaN");',
            },
            {
              name: { en: 'best finds the top record', id: 'terbaik menemukan catatan teratas' },
              check:
                'assert(terbaik(contoh).nama === "Ani", "yang tertinggi adalah Ani, sekarang: " + JSON.stringify(terbaik(contoh)));\nassert(terbaik([]) === null, "kelas kosong harus null");\nassert(terbaik([{ nama: "Solo", nilai: 5 }]).nama === "Solo", "satu siswa harus mengembalikan siswa itu");',
            },
            {
              name: { en: 'passed keeps whole records', id: 'lulus menyimpan catatan utuhnya' },
              check:
                'var l = lulus(contoh);\nassert(l.length === 2, "harus dua yang lulus, sekarang: " + l.length);\nassert(l[0].nama === "Ani" && l[1].nama === "Citra", "isinya: " + JSON.stringify(l.map(function (s) { return s.nama; })));\nassert(typeof l[0] === "object" && "nilai" in l[0], "kembalikan catatan utuh, bukan hanya namanya");',
            },
            {
              name: { en: 'summarize reads as a sentence', id: 'ringkas terbaca sebagai kalimat' },
              check:
                'assert(ringkas(contoh) === "3 siswa, rata-rata 77.7, terbaik Ani", "hasilnya: " + JSON.stringify(ringkas(contoh)));\nvar lain = [{ nama: "X", nilai: 90 }, { nama: "Y", nilai: 70 }];\nassert(ringkas(lain) === "2 siswa, rata-rata 80, terbaik X", "untuk daftar lain hasilnya: " + JSON.stringify(ringkas(lain)));',
            },
          ],
        },
        hints: [
          { en: 'reduce gives you total in one line; the rest build on it.', id: 'reduce memberimu total dalam satu baris; sisanya dibangun di atasnya.' },
          { en: '`Math.round(x * 10) / 10` rounds to one decimal, and drops a trailing zero on its own.', id: '`Math.round(x * 10) / 10` membulatkan satu desimal, dan menghilangkan nol di ujung dengan sendirinya.' },
          { en: 'For best, reduce works too — keep whichever record has the bigger score.', id: 'Untuk terbaik, reduce juga bisa — simpan catatan mana pun yang nilainya lebih besar.' },
          { en: 'summarize reuses the other four rather than recomputing anything.', id: 'ringkas memakai ulang empat fungsi lainnya alih-alih menghitung ulang.' },
        ],
        solution: {
          en: 'const example = [\n  { name: "Ani", score: 88 },\n  { name: "Budi", score: 65 },\n  { name: "Citra", score: 80 },\n];\n\nfunction total(students) {\n  return students.reduce((sum, s) => sum + s.score, 0);\n}\n\nfunction average(students) {\n  if (students.length === 0) {\n    return 0;\n  }\n  return Math.round((total(students) / students.length) * 10) / 10;\n}\n\nfunction best(students) {\n  if (students.length === 0) {\n    return null;\n  }\n  return students.reduce((top, s) => (s.score > top.score ? s : top));\n}\n\nfunction passed(students) {\n  return students.filter((s) => s.score >= 70);\n}\n\nfunction summarize(students) {\n  return `${students.length} students, average ${average(students)}, best ${best(students).name}`;\n}',
          id: 'const contoh = [\n  { nama: "Ani", nilai: 88 },\n  { nama: "Budi", nilai: 65 },\n  { nama: "Citra", nilai: 80 },\n];\n\nfunction total(kelas) {\n  return kelas.reduce((jumlah, s) => jumlah + s.nilai, 0);\n}\n\nfunction rataRata(kelas) {\n  if (kelas.length === 0) {\n    return 0;\n  }\n  return Math.round((total(kelas) / kelas.length) * 10) / 10;\n}\n\nfunction terbaik(kelas) {\n  if (kelas.length === 0) {\n    return null;\n  }\n  return kelas.reduce((atas, s) => (s.nilai > atas.nilai ? s : atas));\n}\n\nfunction lulus(kelas) {\n  return kelas.filter((s) => s.nilai >= 70);\n}\n\nfunction ringkas(kelas) {\n  return `${kelas.length} siswa, rata-rata ${rataRata(kelas)}, terbaik ${terbaik(kelas).nama}`;\n}',
        },
        xp: 50,
      },
    },
  ],
}
