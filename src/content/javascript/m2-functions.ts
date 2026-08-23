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
              code: 'function luas(p, l) {\n  return p * l;\n}\n\nconst hasil = luas(4, 5);\nconsole.log(hasil + 10);',
              output: '30',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'No return means undefined', id: 'Tanpa return berarti undefined' },
              body: {
                en: 'Leave `return` out and the function still gives something back: `undefined`. This is the classic bug — the function clearly worked, yet the variable holding its result is empty.',
                id: 'Hilangkan `return` dan fungsinya tetap mengembalikan sesuatu: `undefined`. Inilah bug klasiknya — fungsinya jelas berjalan, tetapi variabel penampung hasilnya kosong.',
              },
              code: 'function tambah(a, b) {\n  console.log(a + b);\n}\n\nconst x = tambah(2, 3);\nconsole.log(x);',
              output: '5\nundefined',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Arrow functions, shorter', id: 'Arrow function, lebih pendek' },
              body: {
                en: 'The arrow form does the same job with less ceremony, and a single expression needs no braces or `return` at all. Both forms are everywhere in real code, so you need to read both.',
                id: 'Bentuk panah melakukan pekerjaan sama dengan upacara lebih sedikit, dan satu ekspresi tunggal sama sekali tak butuh kurung kurawal atau `return`. Kedua bentuk ada di mana-mana pada kode nyata, jadi kamu perlu bisa membaca keduanya.',
              },
              code: 'const luas = (p, l) => p * l;\nconst sapa = (nama) => `Halo, ${nama}`;\n\nconsole.log(luas(3, 4));\nconsole.log(sapa("Ani"));',
              output: '12\nHalo, Ani',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is logged?', id: 'Apa yang ditampilkan?' },
              code: 'function dua(n) {\n  n * 2;\n}\n\nconsole.log(dua(5));',
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
              template: 'function kali(a, b) {\n  ___ a * b;\n}',
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
                en: 'Write `terbesar(a, b)` returning the larger of two numbers, and `sapa(nama)` returning `Halo, <nama>!`. Return, do not log.',
                id: 'Tulis `terbesar(a, b)` yang mengembalikan angka terbesar dari dua angka, dan `sapa(nama)` yang mengembalikan `Halo, <nama>!`. Kembalikan, jangan tampilkan.',
              },
              starter: 'function terbesar(a, b) {\n\n}\n\nfunction sapa(nama) {\n\n}\n',
              tests: [
                {
                  name: { en: 'terbesar picks the larger', id: 'terbesar memilih yang lebih besar' },
                  check:
                    'assert(terbesar(3, 9) === 9, "terbesar(3, 9) harus 9, sekarang: " + JSON.stringify(terbesar(3, 9)));\nassert(terbesar(10, 2) === 10, "terbesar(10, 2) harus 10");\nassert(terbesar(4, 4) === 4, "dua nilai sama harus mengembalikan nilai itu");',
                },
                {
                  name: { en: 'It returns rather than logs', id: 'Ia mengembalikan, bukan menampilkan' },
                  check:
                    'assert(logs().length === 0, "fungsi ini harus return, bukan console.log — sekarang ada " + logs().length + " baris keluaran");',
                },
                {
                  name: { en: 'sapa builds the greeting', id: 'sapa menyusun sapaannya' },
                  check:
                    'assert(sapa("Ani") === "Halo, Ani!", "sapa(\\"Ani\\") harus \\"Halo, Ani!\\", sekarang: " + JSON.stringify(sapa("Ani")));\nassert(sapa("Budi") === "Halo, Budi!", "sapa harus memakai nama yang dioper, bukan nama tetap");',
                },
              ],
              hints: [
                { en: 'Compare with if, then return the winner.', id: 'Bandingkan dengan if, lalu kembalikan pemenangnya.' },
                { en: 'A template literal builds the greeting in one line.', id: 'Template literal menyusun sapaannya dalam satu baris.' },
                { en: 'return `Halo, ${nama}!`;', id: 'return `Halo, ${nama}!`;' },
              ],
              solution:
                'function terbesar(a, b) {\n  if (a > b) {\n    return a;\n  }\n  return b;\n}\n\nfunction sapa(nama) {\n  return `Halo, ${nama}!`;\n}',
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
              code: 'const diskon = (harga, persen = 10) => harga * (100 - persen) / 100;\n\nconsole.log(diskon(100000));\nconsole.log(diskon(100000, 25));',
              output: '90000\n75000',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'What happens inside stays inside', id: 'Yang terjadi di dalam tetap di dalam' },
              body: {
                en: 'A name declared inside a function disappears when it ends. That isolation is a feature: two functions can both use `i` without ever colliding. A `{ ... }` block does the same for `let` and `const`.',
                id: 'Nama yang dideklarasikan di dalam fungsi lenyap saat fungsi itu berakhir. Keterpisahan itu justru keunggulan: dua fungsi bisa sama-sama memakai `i` tanpa pernah bentrok. Blok `{ ... }` melakukan hal sama untuk `let` dan `const`.',
              },
              code: 'function hitung() {\n  const total = 99;\n  return total;\n}\n\nconsole.log(hitung());\nconsole.log(typeof total);',
              output: '99\nundefined',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A function is a value too', id: 'Fungsi juga sebuah nilai' },
              body: {
                en: 'Functions can be stored in variables and passed to other functions. That is not a curiosity — it is exactly how `map` and `filter` work in the next lesson.',
                id: 'Fungsi bisa disimpan dalam variabel dan dioper ke fungsi lain. Itu bukan keanehan — persis begitulah `map` dan `filter` bekerja di pelajaran berikutnya.',
              },
              code: 'const dua = (n) => n * 2;\n\nfunction terapkan(fn, nilai) {\n  return fn(nilai);\n}\n\nconsole.log(terapkan(dua, 21));',
              output: '42',
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
                en: 'Write `potong(teks, panjang = 10)` returning the text unchanged when it fits, and otherwise the first `panjang` characters followed by `...`.',
                id: 'Tulis `potong(teks, panjang = 10)` yang mengembalikan teks apa adanya bila muat, dan selain itu `panjang` karakter pertama diikuti `...`.',
              },
              starter: 'function potong(teks, panjang = 10) {\n\n}\n',
              tests: [
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
              hints: [
                { en: 'Compare teks.length against panjang first.', id: 'Bandingkan teks.length dengan panjang lebih dulu.' },
                { en: '`slice(0, panjang)` takes the first characters.', id: '`slice(0, panjang)` mengambil karakter pertamanya.' },
                { en: 'Only cut when it is genuinely longer, not when it is equal.', id: 'Potong hanya bila benar-benar lebih panjang, bukan saat sama.' },
              ],
              solution:
                'function potong(teks, panjang = 10) {\n  if (teks.length <= panjang) {\n    return teks;\n  }\n  return teks.slice(0, panjang) + "...";\n}',
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
          { en: '`balik(teks)` returns the text reversed.', id: '`balik(teks)` mengembalikan teks yang dibalik.' },
          { en: '`kapital(teks)` returns it with the first letter uppercased.', id: '`kapital(teks)` mengembalikannya dengan huruf pertama kapital.' },
          { en: '`hitungKata(teks)` returns how many words it holds; empty or spaces only gives 0.', id: '`hitungKata(teks)` mengembalikan jumlah katanya; kosong atau hanya spasi memberi 0.' },
          { en: '`palindrom(teks)` returns true when it reads the same backwards, ignoring case.', id: '`palindrom(teks)` mengembalikan true bila terbaca sama dari belakang, tanpa memedulikan besar-kecil huruf.' },
          { en: 'All four return; none of them log.', id: 'Keempatnya mengembalikan nilai; tak satu pun menampilkan.' },
        ],
        starter:
          'function balik(teks) {\n\n}\n\nfunction kapital(teks) {\n\n}\n\nfunction hitungKata(teks) {\n\n}\n\nfunction palindrom(teks) {\n\n}\n',
        tests: [
          {
            name: { en: 'balik reverses', id: 'balik membalik' },
            check:
              'assert(balik("abc") === "cba", "balik(\\"abc\\") harus \\"cba\\", sekarang: " + JSON.stringify(balik("abc")));\nassert(balik("") === "", "teks kosong tetap kosong");',
          },
          {
            name: { en: 'kapital raises the first letter only', id: 'kapital hanya menaikkan huruf pertama' },
            check:
              'assert(kapital("ani") === "Ani", "kapital(\\"ani\\") harus \\"Ani\\", sekarang: " + JSON.stringify(kapital("ani")));\nassert(kapital("budi santoso") === "Budi santoso", "hanya huruf pertama yang berubah");\nassert(kapital("") === "", "teks kosong tetap kosong");',
          },
          {
            name: { en: 'hitungKata counts words', id: 'hitungKata menghitung kata' },
            check:
              'assert(hitungKata("satu dua tiga") === 3, "harus 3, sekarang: " + JSON.stringify(hitungKata("satu dua tiga")));\nassert(hitungKata("satu") === 1, "satu kata harus 1");\nassert(hitungKata("") === 0, "teks kosong harus 0");\nassert(hitungKata("   ") === 0, "spasi saja harus 0, sekarang: " + JSON.stringify(hitungKata("   ")));',
          },
          {
            name: { en: 'palindrom ignores case', id: 'palindrom mengabaikan besar-kecil huruf' },
            check:
              'assert(palindrom("katak") === true, "katak adalah palindrom");\nassert(palindrom("Katak") === true, "besar-kecil huruf harus diabaikan");\nassert(palindrom("halo") === false, "halo bukan palindrom");',
          },
          {
            name: { en: 'Nothing is logged', id: 'Tidak ada yang ditampilkan' },
            check: 'assert(logs().length === 0, "toolkit ini harus return saja — sekarang ada " + logs().length + " baris keluaran");',
          },
        ],
        hints: [
          { en: '`split("")`, `reverse()`, `join("")` turns a string round.', id: '`split("")`, `reverse()`, `join("")` membalik sebuah string.' },
          { en: 'For the capital, take `teks[0]` uppercased plus `teks.slice(1)` — and guard the empty string.', id: 'Untuk kapitalnya, ambil `teks[0]` yang dibesarkan ditambah `teks.slice(1)` — dan amankan teks kosong.' },
          { en: '`trim()` first, then split on spaces; a trimmed empty string still splits into one empty item.', id: '`trim()` dulu, lalu pecah pada spasi; string kosong yang di-trim tetap terpecah jadi satu item kosong.' },
          { en: 'palindrom can reuse balik, after lowercasing both sides.', id: 'palindrom bisa memakai ulang balik, setelah kedua sisinya dikecilkan.' },
        ],
        solution:
          'function balik(teks) {\n  return teks.split("").reverse().join("");\n}\n\nfunction kapital(teks) {\n  if (teks.length === 0) {\n    return teks;\n  }\n  return teks[0].toUpperCase() + teks.slice(1);\n}\n\nfunction hitungKata(teks) {\n  const bersih = teks.trim();\n  if (bersih === "") {\n    return 0;\n  }\n  return bersih.split(/\\s+/).length;\n}\n\nfunction palindrom(teks) {\n  const kecil = teks.toLowerCase();\n  return kecil === balik(kecil);\n}',
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
              code: 'const nilai = [80, 95, 70];\n\nconsole.log(nilai[0]);\nconsole.log(nilai.length);\n\nnilai.push(60);\nconsole.log(nilai);',
              output: '80\n3\n[80,95,70,60]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'An object is labelled', id: 'Object itu berlabel' },
              body: {
                en: 'An array says "the third one"; an object says "the one called nama". Reach in with a dot. Asking for a key that is not there gives `undefined` rather than an error.',
                id: 'Array berkata "yang ketiga"; object berkata "yang bernama nama". Jangkau isinya dengan titik. Meminta kunci yang tidak ada memberi `undefined`, bukan error.',
              },
              code: 'const siswa = { nama: "Ani", nilai: 88 };\n\nconsole.log(siswa.nama);\nconsole.log(siswa.kota);\n\nsiswa.kota = "Surabaya";\nconsole.log(siswa.kota);',
              output: 'Ani\nundefined\nSurabaya',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The two nest', id: 'Keduanya bisa bersarang' },
              body: {
                en: 'An array of objects is the shape most real data arrives in — a list of records. Everything you know about looping applies to it unchanged.',
                id: 'Array berisi object adalah bentuk yang paling sering dipakai data nyata — sebuah daftar catatan. Semua yang kamu tahu tentang perulangan berlaku apa adanya di sini.',
              },
              code: 'const kelas = [\n  { nama: "Ani", nilai: 88 },\n  { nama: "Budi", nilai: 65 },\n];\n\nfor (const s of kelas) {\n  console.log(`${s.nama}: ${s.nilai}`);\n}',
              output: 'Ani: 88\nBudi: 65',
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
              template: 'const siswa = { nama: "Ani", nilai: 88 };\nconsole.log(siswa___nama);',
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
                en: 'Write `tambahSiswa(kelas, nama, nilai)` that pushes a new record `{ nama, nilai }` onto the array and returns the new length.',
                id: 'Tulis `tambahSiswa(kelas, nama, nilai)` yang menambahkan catatan baru `{ nama, nilai }` ke array itu dan mengembalikan panjang barunya.',
              },
              starter: 'function tambahSiswa(kelas, nama, nilai) {\n\n}\n',
              tests: [
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
              hints: [
                { en: 'push returns the new length already.', id: 'push sudah mengembalikan panjang barunya.' },
                { en: 'Build the record as an object literal first.', id: 'Bangun catatannya sebagai object literal dulu.' },
                { en: 'return kelas.push({ nama: nama, nilai: nilai });', id: 'return kelas.push({ nama: nama, nilai: nilai });' },
              ],
              solution: 'function tambahSiswa(kelas, nama, nilai) {\n  return kelas.push({ nama, nilai });\n}',
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
              code: 'const nilai = [80, 95, 70];\nconst naik = nilai.map((n) => n + 5);\n\nconsole.log(naik);\nconsole.log(nilai);',
              output: '[85,100,75]\n[80,95,70]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'filter: fewer items, unchanged', id: 'filter: item lebih sedikit, tak berubah' },
              body: {
                en: '`filter` keeps the items for which your function returns true. The items themselves are untouched — only how many survive changes.',
                id: '`filter` menyimpan item yang membuat fungsimu mengembalikan true. Itemnya sendiri tak tersentuh — hanya berapa yang bertahan yang berubah.',
              },
              code: 'const nilai = [80, 95, 70, 45];\nconst lulus = nilai.filter((n) => n >= 70);\n\nconsole.log(lulus);\nconsole.log(lulus.length);',
              output: '[80,95,70]\n3',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'reduce: many into one', id: 'reduce: banyak menjadi satu' },
              body: {
                en: '`reduce` folds a list down to a single value. The first argument is what has been accumulated so far, the second is the current item, and the number at the end is where it starts.',
                id: '`reduce` melipat sebuah daftar menjadi satu nilai. Argumen pertamanya adalah yang sudah terkumpul, kedua adalah item saat ini, dan angka di akhirnya adalah titik mulainya.',
              },
              code: 'const nilai = [80, 95, 70];\nconst total = nilai.reduce((jumlah, n) => jumlah + n, 0);\n\nconsole.log(total);\nconsole.log(total / nilai.length);',
              output: '245\n81.66666666666667',
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
              lines: [
                'const kelas = [{ nama: "Ani", nilai: 88 }, { nama: "Budi", nilai: 65 }];',
                'const lulus = kelas',
                '  .filter((s) => s.nilai >= 70)',
                '  .map((s) => s.nama);',
                'console.log(lulus);',
              ],
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
                en: 'Write `rataRata(nilai)` returning the average, or 0 for an empty array, and `namaLulus(kelas)` returning an array of the names scoring 70 or more.',
                id: 'Tulis `rataRata(nilai)` yang mengembalikan rata-rata, atau 0 untuk array kosong, dan `namaLulus(kelas)` yang mengembalikan array nama yang bernilai 70 ke atas.',
              },
              starter: 'function rataRata(nilai) {\n\n}\n\nfunction namaLulus(kelas) {\n\n}\n',
              tests: [
                {
                  name: { en: 'rataRata averages', id: 'rataRata merata-ratakan' },
                  check:
                    'assert(rataRata([80, 90]) === 85, "rataRata([80, 90]) harus 85, sekarang: " + JSON.stringify(rataRata([80, 90])));\nassert(rataRata([100]) === 100, "satu nilai harus mengembalikan nilai itu");',
                },
                {
                  name: { en: 'The empty array is guarded', id: 'Array kosong diamankan' },
                  check:
                    'assert(rataRata([]) === 0, "array kosong harus 0, bukan NaN — sekarang: " + JSON.stringify(rataRata([])));',
                },
                {
                  name: { en: 'namaLulus narrows then names', id: 'namaLulus menyaring lalu menamai' },
                  check:
                    'var kelas = [{ nama: "Ani", nilai: 88 }, { nama: "Budi", nilai: 65 }, { nama: "Citra", nilai: 70 }];\nvar hasil = namaLulus(kelas);\nassert(Array.isArray(hasil), "harus mengembalikan array, sekarang: " + typeof hasil);\nassert(hasil.join(",") === "Ani,Citra", "hasilnya: " + JSON.stringify(hasil));',
                },
                {
                  name: { en: 'Nobody passing gives an empty array', id: 'Tak ada yang lulus memberi array kosong' },
                  check:
                    'var hasil = namaLulus([{ nama: "X", nilai: 10 }]);\nassert(Array.isArray(hasil) && hasil.length === 0, "harus array kosong, sekarang: " + JSON.stringify(hasil));',
                },
              ],
              hints: [
                { en: 'Guard the empty array before dividing — dividing by 0 gives NaN.', id: 'Amankan array kosong sebelum membagi — membagi dengan 0 memberi NaN.' },
                { en: 'reduce sums the list in one line.', id: 'reduce menjumlahkan daftarnya dalam satu baris.' },
                { en: 'filter on the score, then map to the name.', id: 'filter berdasarkan nilainya, lalu map ke namanya.' },
              ],
              solution:
                'function rataRata(nilai) {\n  if (nilai.length === 0) {\n    return 0;\n  }\n  return nilai.reduce((jumlah, n) => jumlah + n, 0) / nilai.length;\n}\n\nfunction namaLulus(kelas) {\n  return kelas.filter((s) => s.nilai >= 70).map((s) => s.nama);\n}',
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
          { en: '`total(kelas)` returns the sum of every score.', id: '`total(kelas)` mengembalikan jumlah seluruh nilai.' },
          { en: '`rataRata(kelas)` returns the average rounded to one decimal, or 0 when empty.', id: '`rataRata(kelas)` mengembalikan rata-rata dibulatkan satu desimal, atau 0 bila kosong.' },
          { en: '`terbaik(kelas)` returns the record with the highest score, or null when empty.', id: '`terbaik(kelas)` mengembalikan catatan bernilai tertinggi, atau null bila kosong.' },
          { en: '`lulus(kelas)` returns the records scoring 70 or more.', id: '`lulus(kelas)` mengembalikan catatan yang bernilai 70 ke atas.' },
          { en: '`ringkas(kelas)` returns `3 siswa, rata-rata 77.7, terbaik Ani`.', id: '`ringkas(kelas)` mengembalikan `3 siswa, rata-rata 77.7, terbaik Ani`.' },
        ],
        starter:
          'const contoh = [\n  { nama: "Ani", nilai: 88 },\n  { nama: "Budi", nilai: 65 },\n  { nama: "Citra", nilai: 80 },\n];\n\nfunction total(kelas) {\n\n}\n\nfunction rataRata(kelas) {\n\n}\n\nfunction terbaik(kelas) {\n\n}\n\nfunction lulus(kelas) {\n\n}\n\nfunction ringkas(kelas) {\n\n}\n',
        tests: [
          {
            name: { en: 'total sums the scores', id: 'total menjumlahkan nilainya' },
            check:
              'assert(total(contoh) === 233, "total(contoh) harus 233, sekarang: " + JSON.stringify(total(contoh)));\nassert(total([]) === 0, "kelas kosong harus 0");',
          },
          {
            name: { en: 'rataRata rounds to one decimal', id: 'rataRata membulatkan satu desimal' },
            check:
              'assert(rataRata(contoh) === 77.7, "rataRata(contoh) harus 77.7, sekarang: " + JSON.stringify(rataRata(contoh)));\nassert(rataRata([]) === 0, "kelas kosong harus 0, bukan NaN");',
          },
          {
            name: { en: 'terbaik finds the top record', id: 'terbaik menemukan catatan teratas' },
            check:
              'assert(terbaik(contoh).nama === "Ani", "yang tertinggi adalah Ani, sekarang: " + JSON.stringify(terbaik(contoh)));\nassert(terbaik([]) === null, "kelas kosong harus null");\nassert(terbaik([{ nama: "Solo", nilai: 5 }]).nama === "Solo", "satu siswa harus mengembalikan siswa itu");',
          },
          {
            name: { en: 'lulus keeps whole records', id: 'lulus menyimpan catatan utuhnya' },
            check:
              'var l = lulus(contoh);\nassert(l.length === 2, "harus dua yang lulus, sekarang: " + l.length);\nassert(l[0].nama === "Ani" && l[1].nama === "Citra", "isinya: " + JSON.stringify(l.map(function (s) { return s.nama; })));\nassert(typeof l[0] === "object" && "nilai" in l[0], "kembalikan catatan utuh, bukan hanya namanya");',
          },
          {
            name: { en: 'ringkas reads as a sentence', id: 'ringkas terbaca sebagai kalimat' },
            check:
              'assert(ringkas(contoh) === "3 siswa, rata-rata 77.7, terbaik Ani", "hasilnya: " + JSON.stringify(ringkas(contoh)));\nvar lain = [{ nama: "X", nilai: 90 }, { nama: "Y", nilai: 70 }];\nassert(ringkas(lain) === "2 siswa, rata-rata 80, terbaik X", "untuk daftar lain hasilnya: " + JSON.stringify(ringkas(lain)));',
          },
        ],
        hints: [
          { en: 'reduce gives you total in one line; the rest build on it.', id: 'reduce memberimu total dalam satu baris; sisanya dibangun di atasnya.' },
          { en: '`Math.round(x * 10) / 10` rounds to one decimal, and drops a trailing zero on its own.', id: '`Math.round(x * 10) / 10` membulatkan satu desimal, dan menghilangkan nol di ujung dengan sendirinya.' },
          { en: 'For terbaik, reduce works too — keep whichever record has the bigger score.', id: 'Untuk terbaik, reduce juga bisa — simpan catatan mana pun yang nilainya lebih besar.' },
          { en: 'ringkas reuses the other four rather than recomputing anything.', id: 'ringkas memakai ulang empat fungsi lainnya alih-alih menghitung ulang.' },
        ],
        solution:
          'const contoh = [\n  { nama: "Ani", nilai: 88 },\n  { nama: "Budi", nilai: 65 },\n  { nama: "Citra", nilai: 80 },\n];\n\nfunction total(kelas) {\n  return kelas.reduce((jumlah, s) => jumlah + s.nilai, 0);\n}\n\nfunction rataRata(kelas) {\n  if (kelas.length === 0) {\n    return 0;\n  }\n  return Math.round((total(kelas) / kelas.length) * 10) / 10;\n}\n\nfunction terbaik(kelas) {\n  if (kelas.length === 0) {\n    return null;\n  }\n  return kelas.reduce((atas, s) => (s.nilai > atas.nilai ? s : atas));\n}\n\nfunction lulus(kelas) {\n  return kelas.filter((s) => s.nilai >= 70);\n}\n\nfunction ringkas(kelas) {\n  return `${kelas.length} siswa, rata-rata ${rataRata(kelas)}, terbaik ${terbaik(kelas).nama}`;\n}',
        xp: 50,
      },
    },
  ],
}
