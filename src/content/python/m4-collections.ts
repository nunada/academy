import type { Module } from '../types'

/** Module 4 — lists first (order matters), then dictionaries (names matter). */
export const module4: Module = {
  id: 'py-m4',
  title: { en: 'Collections', id: 'Koleksi Data' },
  summary: {
    en: 'Hold many values in one variable — in order, or looked up by name.',
    id: 'Menyimpan banyak nilai dalam satu variabel — berurutan, atau dicari lewat nama.',
  },
  submodules: [
    /* ------------------------------------------------------------ 4.1 lists */
    {
      id: 'py-m4-s1',
      title: { en: 'Lists', id: 'List' },
      summary: {
        en: 'An ordered box of values you can index, grow, and loop over.',
        id: 'Kotak nilai berurutan yang bisa diindeks, ditambah, dan diulang.',
      },
      lessons: [
        {
          id: 'py-m4-s1-l1',
          title: { en: 'Many values, one name', id: 'Banyak nilai, satu nama' },
          goal: { en: 'Create a list and reach into it.', id: 'Membuat list dan mengambil isinya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Square brackets make a list', id: 'Kurung siku membuat list' },
              body: {
                en: 'Ten scores do not need ten variables. A list holds them in order, and `len()` says how many there are.',
                id: 'Sepuluh nilai tidak butuh sepuluh variabel. List menyimpannya berurutan, dan `len()` memberi tahu jumlahnya.',
              },
              code: {
                en: 'scores = [80, 95, 70]\nprint(scores)\nprint(len(scores))',
                id: 'nilai = [80, 95, 70]\nprint(nilai)\nprint(len(nilai))',
              },
              output: '[80, 95, 70]\n3',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Positions start at 0', id: 'Posisi dimulai dari 0' },
              body: {
                en: 'The first item is `[0]`. Negative numbers count from the end, so `[-1]` is always the last item — handy when you do not know the length.',
                id: 'Item pertama adalah `[0]`. Angka negatif menghitung dari belakang, jadi `[-1]` selalu item terakhir — berguna saat kamu tak tahu panjangnya.',
              },
              code: {
                en: 'fruits = ["apple", "mango", "orange"]\nprint(fruits[0])\nprint(fruits[-1])\nfruits[1] = "banana"\nprint(fruits)',
                id: 'buah = ["apel", "mangga", "jeruk"]\nprint(buah[0])\nprint(buah[-1])\nbuah[1] = "pisang"\nprint(buah)',
              },
              output: { en: 'apple\norange\n[\'apple\', \'banana\', \'orange\']', id: 'apel\njeruk\n[\'apel\', \'pisang\', \'jeruk\']' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'x = [10, 20, 30]\nprint(x[1])',
              options: [
                { en: '20', id: '20' },
                { en: '10', id: '10' },
                { en: '30', id: '30' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'Index 1 is the second item, because counting starts at 0.',
                id: 'Indeks 1 adalah item kedua, karena penghitungan dimulai dari 0.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: { en: 'And this one?', id: 'Kalau yang ini?' },
              code: 'x = [10, 20, 30]\nprint(x[3])',
              options: [
                { en: 'IndexError — there is no position 3', id: 'IndexError — tidak ada posisi 3' },
                { en: '30', id: '30' },
                { en: 'None', id: 'None' },
                { en: '0', id: '0' },
              ],
              answer: 0,
              explain: {
                en: 'Three items occupy positions 0, 1, and 2. Position 3 does not exist.',
                id: 'Tiga item menempati posisi 0, 1, dan 2. Posisi 3 tidak ada.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Make a list `cities` with "Surabaya", "Malang", "Kediri". Print the first and the last, each on its own line.',
                id: 'Buat list `kota` berisi "Surabaya", "Malang", "Kediri". Cetak yang pertama dan yang terakhir, masing-masing di barisnya sendiri.',
              },
              starter: '',
              tests: {
                en: [
                  { name: { en: 'Prints Surabaya then Kediri', id: 'Mencetak Surabaya lalu Kediri' }, expectOutput: 'Surabaya\nKediri' },
                  {
                    name: { en: 'The list has three items', id: 'List berisi tiga item' },
                    assert: 'assert cities == ["Surabaya", "Malang", "Kediri"], "list contents are not right"',
                  },
                ],
                id: [
                  { name: { en: 'Prints Surabaya then Kediri', id: 'Mencetak Surabaya lalu Kediri' }, expectOutput: 'Surabaya\nKediri' },
                  {
                    name: { en: 'The list has three items', id: 'List berisi tiga item' },
                    assert: 'assert kota == ["Surabaya", "Malang", "Kediri"], "isi list belum sesuai"',
                  },
                ],
              },
              hints: [
                { en: 'Commas separate the items inside [ ].', id: 'Koma memisahkan item di dalam [ ].' },
                { en: 'cities[0] and cities[-1]', id: 'kota[0] dan kota[-1]' },
              ],
              solution: {
                en: 'cities = ["Surabaya", "Malang", "Kediri"]\nprint(cities[0])\nprint(cities[-1])',
                id: 'kota = ["Surabaya", "Malang", "Kediri"]\nprint(kota[0])\nprint(kota[-1])',
              },
            },
          ],
        },
        {
          id: 'py-m4-s1-l2',
          title: { en: 'Looping and growing', id: 'Mengulang dan menumbuhkan' },
          goal: { en: 'Walk a list, and add to it.', id: 'Menyusuri list, dan menambahnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'for walks the items directly', id: 'for menyusuri item secara langsung' },
              body: {
                en: 'You rarely need indexes to read a list. `for x in lst` hands you each value in turn.',
                id: 'Kamu jarang butuh indeks untuk membaca list. `for x in lst` memberimu tiap nilai bergantian.',
              },
              code: { en: 'scores = [80, 95, 70]\nfor n in scores:\n    print(n)', id: 'nilai = [80, 95, 70]\nfor n in nilai:\n    print(n)' },
              output: '80\n95\n70',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'append, sum, max', id: 'append, sum, max' },
              body: {
                en: '`append()` adds one item to the end. For totals and extremes Python already has `sum()`, `max()`, `min()` — no loop needed.',
                id: '`append()` menambah satu item di akhir. Untuk total dan nilai ekstrem, Python sudah punya `sum()`, `max()`, `min()` — tanpa perlu loop.',
              },
              code: {
                en: 'scores = [80, 95]\nscores.append(70)\nprint(scores)\nprint(sum(scores))\nprint(max(scores))',
                id: 'nilai = [80, 95]\nnilai.append(70)\nprint(nilai)\nprint(sum(nilai))\nprint(max(nilai))',
              },
              output: '[80, 95, 70]\n245\n95',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'a = [1, 2]\na.append(3)\nprint(len(a))',
              options: [
                { en: '3', id: '3' },
                { en: '2', id: '2' },
                { en: '6', id: '6' },
                { en: '[1, 2, 3]', id: '[1, 2, 3]' },
              ],
              answer: 0,
              explain: {
                en: 'append adds one item, so the length grows from 2 to 3.',
                id: 'append menambah satu item, jadi panjangnya bertambah dari 2 ke 3.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that collects the squares of 1 to 3 and prints `[1, 4, 9]`.',
                id: 'Susun program yang mengumpulkan kuadrat 1 sampai 3 lalu mencetak `[1, 4, 9]`.',
              },
              lines: {
                en: ['squares = []', 'for n in range(1, 4):', '    squares.append(n * n)', 'print(squares)'],
                id: ['kuadrat = []', 'for n in range(1, 4):', '    kuadrat.append(n * n)', 'print(kuadrat)'],
              },
              explain: {
                en: 'Start from an empty list, append inside the loop, print once at the end.',
                id: 'Mulai dari list kosong, append di dalam loop, cetak sekali di akhir.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Given `numbers = [4, 11, 7, 20, 3]`, print only the values above 5, one per line.',
                id: 'Diberikan `angka = [4, 11, 7, 20, 3]`, cetak hanya nilai di atas 5, satu per baris.',
              },
              starter: { en: 'numbers = [4, 11, 7, 20, 3]\n', id: 'angka = [4, 11, 7, 20, 3]\n' },
              tests: [{ name: { en: 'Prints 11, 7, 20', id: 'Mencetak 11, 7, 20' }, expectOutput: '11\n7\n20' }],
              hints: [
                { en: 'Loop over the list, then decide inside the loop.', id: 'Ulang list-nya, lalu putuskan di dalam loop.' },
                { en: 'for n in numbers: → if n > 5: → print(n)', id: 'for n in angka: → if n > 5: → print(n)' },
              ],
              solution: {
                en: 'numbers = [4, 11, 7, 20, 3]\nfor n in numbers:\n    if n > 5:\n        print(n)',
                id: 'angka = [4, 11, 7, 20, 3]\nfor n in angka:\n    if n > 5:\n        print(n)',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m4-s1-p',
        title: { en: 'Score report', id: 'Laporan nilai' },
        brief: {
          en: 'Collect scores until the user enters -1, then report how many, the total, the average, and the highest.',
          id: 'Kumpulkan nilai sampai pengguna memasukkan -1, lalu laporkan jumlah data, total, rata-rata, dan nilai tertinggi.',
        },
        requirements: [
          { en: 'Read whole numbers until -1 is entered (-1 is not a score).', id: 'Baca bilangan bulat sampai -1 dimasukkan (-1 bukan nilai).' },
          { en: 'Print `Count: N`.', id: 'Cetak `Jumlah data: N`.' },
          { en: 'Print `Total: T`.', id: 'Cetak `Total: T`.' },
          { en: 'Print `Average: R` rounded to one decimal.', id: 'Cetak `Rata-rata: R` dibulatkan satu angka desimal.' },
          { en: 'Print `Highest: M`.', id: 'Cetak `Tertinggi: M`.' },
          { en: 'If no scores were entered at all, print only `No data`.', id: 'Jika tidak ada nilai sama sekali, cetak hanya `Tidak ada data`.' },
        ],
        starter: { en: '# Score report\nscores = []\n', id: '# Laporan nilai\nnilai = []\n' },
        tests: {
          en: [
            {
              name: { en: '80, 95, 70 then -1', id: '80, 95, 70 lalu -1' },
              stdin: ['80', '95', '70', '-1'],
              expectOutput: 'Count: 3\nTotal: 245\nAverage: 81.7\nHighest: 95',
            },
            {
              name: { en: 'A single score', id: 'Satu nilai saja' },
              stdin: ['100', '-1'],
              expectOutput: 'Count: 1\nTotal: 100\nAverage: 100.0\nHighest: 100',
            },
            {
              name: { en: 'No scores at all', id: 'Tidak ada nilai sama sekali' },
              stdin: ['-1'],
              expectOutput: 'No data',
            },
          ],
          id: [
            {
              name: { en: '80, 95, 70 then -1', id: '80, 95, 70 lalu -1' },
              stdin: ['80', '95', '70', '-1'],
              expectOutput: 'Jumlah data: 3\nTotal: 245\nRata-rata: 81.7\nTertinggi: 95',
            },
            {
              name: { en: 'A single score', id: 'Satu nilai saja' },
              stdin: ['100', '-1'],
              expectOutput: 'Jumlah data: 1\nTotal: 100\nRata-rata: 100.0\nTertinggi: 100',
            },
            {
              name: { en: 'No scores at all', id: 'Tidak ada nilai sama sekali' },
              stdin: ['-1'],
              expectOutput: 'Tidak ada data',
            },
          ],
        },
        hints: [
          { en: 'Collect first with append, report afterwards.', id: 'Kumpulkan dulu dengan append, laporkan setelahnya.' },
          { en: 'An empty list must be handled separately — dividing by 0 crashes.', id: 'List kosong harus ditangani terpisah — membagi dengan 0 akan error.' },
          { en: 'round(sum(scores) / len(scores), 1) gives one decimal.', id: 'round(sum(nilai) / len(nilai), 1) memberi satu angka desimal.' },
        ],
        solution: {
          en: 'scores = []\nwhile True:\n    n = int(input("Score (-1 to finish): "))\n    if n == -1:\n        break\n    scores.append(n)\n\nif len(scores) == 0:\n    print("No data")\nelse:\n    print(f"Count: {len(scores)}")\n    print(f"Total: {sum(scores)}")\n    print(f"Average: {round(sum(scores) / len(scores), 1)}")\n    print(f"Highest: {max(scores)}")',
          id: 'nilai = []\nwhile True:\n    n = int(input("Nilai (-1 selesai): "))\n    if n == -1:\n        break\n    nilai.append(n)\n\nif len(nilai) == 0:\n    print("Tidak ada data")\nelse:\n    print(f"Jumlah data: {len(nilai)}")\n    print(f"Total: {sum(nilai)}")\n    print(f"Rata-rata: {round(sum(nilai) / len(nilai), 1)}")\n    print(f"Tertinggi: {max(nilai)}")',
        },
        xp: 50,
      },
    },

    /* ----------------------------------------------------- 4.2 dictionaries */
    {
      id: 'py-m4-s2',
      title: { en: 'Dictionaries', id: 'Dictionary' },
      summary: {
        en: 'Look values up by a name instead of a position.',
        id: 'Mencari nilai lewat nama, bukan lewat posisi.',
      },
      lessons: [
        {
          id: 'py-m4-s2-l1',
          title: { en: 'Key and value', id: 'Kunci dan nilai' },
          goal: { en: 'Store labelled data.', id: 'Menyimpan data berlabel.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A label for every value', id: 'Label untuk tiap nilai' },
              body: {
                en: 'A list says "the third one". A dictionary says "the one called name". Curly braces, and each entry is `key: value`.',
                id: 'List berkata "yang ketiga". Dictionary berkata "yang bernama nama". Pakai kurung kurawal, dan tiap entri berbentuk `kunci: nilai`.',
              },
              code: {
                en: 'student = {"name": "Ani", "age": 17}\nprint(student["name"])\nstudent["grade"] = 11\nprint(student)',
                id: 'siswa = {"nama": "Ani", "umur": 17}\nprint(siswa["nama"])\nsiswa["kelas"] = 11\nprint(siswa)',
              },
              output: {
                en: 'Ani\n{\'name\': \'Ani\', \'age\': 17, \'grade\': 11}',
                id: 'Ani\n{\'nama\': \'Ani\', \'umur\': 17, \'kelas\': 11}',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'get() when it might be missing', id: 'get() bila mungkin tidak ada' },
              body: {
                en: 'Asking for a key that is not there raises `KeyError`. `get()` returns `None` instead — or a default you choose.',
                id: 'Meminta kunci yang tidak ada memunculkan `KeyError`. `get()` mengembalikan `None` sebagai gantinya — atau nilai bawaan pilihanmu.',
              },
              code: {
                en: 'student = {"name": "Ani"}\nprint(student.get("age"))\nprint(student.get("age", 0))\nprint("name" in student)',
                id: 'siswa = {"nama": "Ani"}\nprint(siswa.get("umur"))\nprint(siswa.get("umur", 0))\nprint("nama" in siswa)',
              },
              output: 'None\n0\nTrue',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'd = {"a": 1, "b": 2}\nprint(d["b"])',
              options: [
                { en: '2', id: '2' },
                { en: 'b', id: 'b' },
                { en: '1', id: '1' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'The key "b" is looked up and its value, 2, comes back.',
                id: 'Kunci "b" dicari dan nilainya, 2, dikembalikan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Add the key `city` with value "Surabaya" to the dictionary.',
                id: 'Tambahkan kunci `kota` bernilai "Surabaya" ke dictionary.',
              },
              template: {
                en: 'student = {"name": "Ani"}\nstudent[___] = "Surabaya"\nprint(student["city"])',
                id: 'siswa = {"nama": "Ani"}\nsiswa[___] = "Surabaya"\nprint(siswa["kota"])',
              },
              blanks: { en: ['"city"'], id: ['"kota"'] },
              explain: {
                en: 'Assigning to a key that does not exist yet creates it.',
                id: 'Menetapkan nilai ke kunci yang belum ada akan membuatnya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Build a dictionary `book` with `title` = "Python Basics" and `pages` = 120, then print `Python Basics - 120 pages`.',
                id: 'Buat dictionary `buku` dengan `judul` = "Python Dasar" dan `halaman` = 120, lalu cetak `Python Dasar - 120 halaman`.',
              },
              starter: '',
              tests: {
                en: [
                  { name: { en: 'Prints the sentence', id: 'Mencetak kalimatnya' }, expectOutput: 'Python Basics - 120 pages' },
                  {
                    name: { en: 'Both keys exist', id: 'Kedua kunci ada' },
                    assert:
                      'assert book["title"] == "Python Basics", "title key is not right"\nassert book["pages"] == 120, "pages key is not right"',
                  },
                ],
                id: [
                  { name: { en: 'Prints the sentence', id: 'Mencetak kalimatnya' }, expectOutput: 'Python Dasar - 120 halaman' },
                  {
                    name: { en: 'Both keys exist', id: 'Kedua kunci ada' },
                    assert:
                      'assert buku["judul"] == "Python Dasar", "kunci judul belum benar"\nassert buku["halaman"] == 120, "kunci halaman belum benar"',
                  },
                ],
              },
              hints: [
                { en: 'Two entries inside { }, separated by a comma.', id: 'Dua entri di dalam { }, dipisah koma.' },
                {
                  en: 'print(f\'{book["title"]} - {book["pages"]} pages\')',
                  id: 'print(f\'{buku["judul"]} - {buku["halaman"]} halaman\')',
                },
              ],
              solution: {
                en: 'book = {"title": "Python Basics", "pages": 120}\nprint(f\'{book["title"]} - {book["pages"]} pages\')',
                id: 'buku = {"judul": "Python Dasar", "halaman": 120}\nprint(f\'{buku["judul"]} - {buku["halaman"]} halaman\')',
              },
            },
          ],
        },
        {
          id: 'py-m4-s2-l2',
          title: { en: 'Walking a dictionary', id: 'Menyusuri dictionary' },
          goal: { en: 'Loop over keys and values together.', id: 'Mengulang kunci dan nilai bersamaan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'items() gives both', id: 'items() memberi keduanya' },
              body: {
                en: 'Looping a dictionary directly gives only the keys. `.items()` gives the key and the value at once, which is almost always what you want.',
                id: 'Mengulang dictionary secara langsung hanya memberi kuncinya. `.items()` memberi kunci dan nilai sekaligus, dan itu hampir selalu yang kamu butuhkan.',
              },
              code: {
                en: 'prices = {"apple": 5000, "mango": 8000}\nfor item, price in prices.items():\n    print(f"{item}: {price}")',
                id: 'harga = {"apel": 5000, "mangga": 8000}\nfor nama, nilai in harga.items():\n    print(f"{nama}: {nilai}")',
              },
              output: { en: 'apple: 5000\nmango: 8000', id: 'apel: 5000\nmangga: 8000' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Counting with a dictionary', id: 'Menghitung dengan dictionary' },
              body: {
                en: 'A dictionary is the natural way to count things. `get(x, 0)` returns 0 the first time a key is seen, so the `+ 1` always works.',
                id: 'Dictionary adalah cara alami untuk menghitung sesuatu. `get(x, 0)` mengembalikan 0 saat kunci pertama kali muncul, jadi `+ 1` selalu berhasil.',
              },
              code: {
                en: 'letters = "aabca"\ncounts = {}\nfor h in letters:\n    counts[h] = counts.get(h, 0) + 1\nprint(counts)',
                id: 'huruf = "aabca"\njumlah = {}\nfor h in huruf:\n    jumlah[h] = jumlah.get(h, 0) + 1\nprint(jumlah)',
              },
              output: "{'a': 3, 'b': 1, 'c': 1}",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'd = {"x": 1, "y": 2}\nfor k in d:\n    print(k)',
              options: [
                { en: 'x then y', id: 'x lalu y' },
                { en: '1 then 2', id: '1 lalu 2' },
                { en: 'x: 1 then y: 2', id: 'x: 1 lalu y: 2' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'Looping a dictionary yields its keys. Use .items() or .values() for the values.',
                id: 'Mengulang dictionary menghasilkan kuncinya. Pakai .items() atau .values() untuk nilainya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Given `stock = {"pencil": 4, "book": 0, "bag": 7}`, print only the items whose stock is 0, one name per line.',
                id: 'Diberikan `stok = {"pensil": 4, "buku": 0, "tas": 7}`, cetak hanya barang yang stoknya 0, satu nama per baris.',
              },
              starter: { en: 'stock = {"pencil": 4, "book": 0, "bag": 7}\n', id: 'stok = {"pensil": 4, "buku": 0, "tas": 7}\n' },
              tests: {
                en: [{ name: { en: 'Prints book only', id: 'Hanya mencetak buku' }, expectOutput: 'book' }],
                id: [{ name: { en: 'Prints buku only', id: 'Hanya mencetak buku' }, expectOutput: 'buku' }],
              },
              hints: [
                { en: 'Loop with .items() so you have both name and count.', id: 'Ulang dengan .items() agar kamu punya nama dan jumlahnya.' },
                { en: 'for name, n in stock.items(): → if n == 0: → print(name)', id: 'for nama, n in stok.items(): → if n == 0: → print(nama)' },
              ],
              solution: {
                en: 'stock = {"pencil": 4, "book": 0, "bag": 7}\nfor name, n in stock.items():\n    if n == 0:\n        print(name)',
                id: 'stok = {"pensil": 4, "buku": 0, "tas": 7}\nfor nama, n in stok.items():\n    if n == 0:\n        print(nama)',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m4-s2-p',
        title: { en: 'Phone book', id: 'Buku telepon' },
        brief: {
          en: 'Store names and numbers, then answer lookups for them.',
          id: 'Simpan nama dan nomor, lalu jawab pencarian atasnya.',
        },
        requirements: [
          { en: 'Start from `contacts = {"Ani": "0811", "Budi": "0822", "Citra": "0833"}`.', id: 'Mulai dari `kontak = {"Ani": "0811", "Budi": "0822", "Citra": "0833"}`.' },
          { en: 'Read names one per line until the user types `done`.', id: 'Baca nama satu per baris sampai pengguna mengetik `selesai`.' },
          { en: 'Known name → print `Ani: 0811`.', id: 'Nama dikenal → cetak `Ani: 0811`.' },
          { en: 'Unknown name → print `Doni not found`.', id: 'Nama tak dikenal → cetak `Doni tidak ditemukan`.' },
          { en: 'After `done`, print `Total contacts: 3`.', id: 'Setelah `selesai`, cetak `Total kontak: 3`.' },
        ],
        starter: {
          en: '# Phone book\ncontacts = {"Ani": "0811", "Budi": "0822", "Citra": "0833"}\n',
          id: '# Buku telepon\nkontak = {"Ani": "0811", "Budi": "0822", "Citra": "0833"}\n',
        },
        tests: {
          en: [
            {
              name: { en: 'Two known names', id: 'Dua nama dikenal' },
              stdin: ['Ani', 'Citra', 'done'],
              expectOutput: 'Ani: 0811\nCitra: 0833\nTotal contacts: 3',
            },
            {
              name: { en: 'An unknown name', id: 'Nama tak dikenal' },
              stdin: ['Doni', 'done'],
              expectOutput: 'Doni not found\nTotal contacts: 3',
            },
            {
              name: { en: 'Straight to done', id: 'Langsung selesai' },
              stdin: ['done'],
              expectOutput: 'Total contacts: 3',
            },
          ],
          id: [
            {
              name: { en: 'Two known names', id: 'Dua nama dikenal' },
              stdin: ['Ani', 'Citra', 'selesai'],
              expectOutput: 'Ani: 0811\nCitra: 0833\nTotal kontak: 3',
            },
            {
              name: { en: 'An unknown name', id: 'Nama tak dikenal' },
              stdin: ['Doni', 'selesai'],
              expectOutput: 'Doni tidak ditemukan\nTotal kontak: 3',
            },
            {
              name: { en: 'Straight to selesai', id: 'Langsung selesai' },
              stdin: ['selesai'],
              expectOutput: 'Total kontak: 3',
            },
          ],
        },
        hints: [
          { en: '`while True:` and break when the input is "done".', id: '`while True:` lalu break saat input berisi "selesai".' },
          { en: '`in` tests whether a key exists: if name in contacts:', id: '`in` menguji apakah kunci ada: if nama in kontak:' },
          { en: 'len(contacts) is the number of entries.', id: 'len(kontak) adalah jumlah entrinya.' },
        ],
        solution: {
          en: 'contacts = {"Ani": "0811", "Budi": "0822", "Citra": "0833"}\nwhile True:\n    name = input("Find name: ")\n    if name == "done":\n        break\n    if name in contacts:\n        print(f"{name}: {contacts[name]}")\n    else:\n        print(f"{name} not found")\nprint(f"Total contacts: {len(contacts)}")',
          id: 'kontak = {"Ani": "0811", "Budi": "0822", "Citra": "0833"}\nwhile True:\n    nama = input("Cari nama: ")\n    if nama == "selesai":\n        break\n    if nama in kontak:\n        print(f"{nama}: {kontak[nama]}")\n    else:\n        print(f"{nama} tidak ditemukan")\nprint(f"Total kontak: {len(kontak)}")',
        },
        xp: 50,
      },
    },
  ],
}
