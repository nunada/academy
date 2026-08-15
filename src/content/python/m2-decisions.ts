import type { Module } from '../types'

/** Module 2 — comparison, boolean logic, then branching. */
export const module2: Module = {
  id: 'py-m2',
  title: { en: 'Making Decisions', id: 'Membuat Keputusan' },
  summary: {
    en: 'Compare values, combine conditions, and let the program choose a path.',
    id: 'Bandingkan nilai, gabungkan kondisi, dan biarkan program memilih jalannya.',
  },
  submodules: [
    /* ------------------------------------------------- 2.1 booleans & compare */
    {
      id: 'py-m2-s1',
      title: { en: 'True, False, and Comparison', id: 'True, False, dan Perbandingan' },
      summary: {
        en: 'Every decision starts as a question with a yes/no answer.',
        id: 'Setiap keputusan berawal dari pertanyaan berjawaban ya/tidak.',
      },
      lessons: [
        {
          id: 'py-m2-s1-l1',
          title: { en: 'Questions with two answers', id: 'Pertanyaan berjawaban dua' },
          goal: { en: 'Compare two values.', id: 'Membandingkan dua nilai.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A comparison is a value', id: 'Perbandingan adalah sebuah nilai' },
              body: {
                en: '`>` `<` `>=` `<=` `==` `!=` each produce `True` or `False` — a type called `bool`. You can print one, or store it, just like a number.',
                id: '`>` `<` `>=` `<=` `==` `!=` masing-masing menghasilkan `True` atau `False` — tipe bernama `bool`. Kamu bisa mencetaknya, atau menyimpannya, seperti angka biasa.',
              },
              code: 'nilai = 75\nprint(nilai > 70)\nprint(nilai == 100)\nlulus = nilai >= 70\nprint(lulus)',
              output: 'True\nFalse\nTrue',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '= assigns, == asks', id: '= menetapkan, == menanya' },
              body: {
                en: 'One equals sign puts a value into a variable. Two equals signs ask whether two things are the same. Mixing them up is the most common beginner bug in any language.',
                id: 'Satu tanda sama dengan memasukkan nilai ke variabel. Dua tanda sama dengan menanyakan apakah dua hal itu sama. Mempertukarkannya adalah bug pemula paling umum di bahasa mana pun.',
              },
              code: 'x = 5        # menetapkan\nprint(x == 5)  # menanya\nprint(x != 5)',
              output: 'True\nFalse',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'a = 3\nb = "3"\nprint(a == b)',
              options: [
                { en: 'False', id: 'False' },
                { en: 'True', id: 'True' },
                { en: '3', id: '3' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'The number 3 and the text "3" are different types, so they are not equal.',
                id: 'Angka 3 dan teks "3" bertipe berbeda, jadi tidak sama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Store whether `umur` is at least 17 in a variable `boleh`.',
                id: 'Simpan apakah `umur` minimal 17 ke variabel `boleh`.',
              },
              template: 'umur = 18\nboleh = umur ___ 17\nprint(boleh)',
              blanks: ['>='],
              explain: {
                en: '"At least 17" includes 17 itself, so use >= rather than >.',
                id: '"Minimal 17" termasuk 17 itu sendiri, jadi pakai >= bukan >.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Given `stok = 0`, store in `habis` whether the stock equals zero, and print it.',
                id: 'Diberikan `stok = 0`, simpan di `habis` apakah stoknya nol, lalu cetak.',
              },
              starter: 'stok = 0\n',
              tests: [
                { name: { en: 'Prints True', id: 'Mencetak True' }, expectOutput: 'True' },
                {
                  name: { en: '`habis` holds a bool', id: '`habis` berisi bool' },
                  assert: 'assert habis is True, "habis harus berupa hasil perbandingan, bukan angka"',
                },
              ],
              hints: [
                { en: 'Use == to compare, not =.', id: 'Gunakan == untuk membandingkan, bukan =.' },
                { en: 'habis = stok == 0', id: 'habis = stok == 0' },
              ],
              solution: 'stok = 0\nhabis = stok == 0\nprint(habis)',
            },
          ],
        },
        {
          id: 'py-m2-s1-l2',
          title: { en: 'and, or, not', id: 'and, or, not' },
          goal: { en: 'Combine two conditions into one.', id: 'Menggabungkan dua kondisi jadi satu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Both, either, or the opposite', id: 'Keduanya, salah satu, atau kebalikannya' },
              body: {
                en: '`and` is True only when both sides are True. `or` is True when at least one side is. `not` flips whatever it is given.',
                id: '`and` bernilai True hanya jika kedua sisi True. `or` bernilai True jika minimal satu sisi True. `not` membalik apa pun yang diberikan.',
              },
              code: 'umur = 20\npunya_ktp = True\nprint(umur >= 17 and punya_ktp)\nprint(umur < 17 or punya_ktp)\nprint(not punya_ktp)',
              output: 'True\nTrue\nFalse',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Ranges read naturally', id: 'Rentang terbaca alami' },
              body: {
                en: 'To test "between", chain two comparisons with `and`. Python also allows the shorter mathematical form.',
                id: 'Untuk menguji "di antara", rangkai dua perbandingan dengan `and`. Python juga mengizinkan bentuk matematis yang lebih pendek.',
              },
              code: 'nilai = 85\nprint(nilai >= 80 and nilai <= 89)\nprint(80 <= nilai <= 89)',
              output: 'True\nTrue',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'hujan = True\nbawa_payung = False\nprint(hujan and bawa_payung)',
              options: [
                { en: 'False', id: 'False' },
                { en: 'True', id: 'True' },
                { en: 'None', id: 'None' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: '`and` needs both sides True; the second one is False.',
                id: '`and` butuh kedua sisi True; sisi kedua bernilai False.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which expression means "the number is outside 1 to 10"?',
                id: 'Ekspresi mana yang berarti "angka berada di luar 1 sampai 10"?',
              },
              options: [
                { en: 'n < 1 or n > 10', id: 'n < 1 or n > 10' },
                { en: 'n < 1 and n > 10', id: 'n < 1 and n > 10' },
                { en: 'not n > 1', id: 'not n > 1' },
                { en: '1 < n < 10', id: '1 < n < 10' },
              ],
              answer: 0,
              explain: {
                en: 'A number cannot be both below 1 and above 10, so `and` would never be True.',
                id: 'Sebuah angka tak mungkin sekaligus di bawah 1 dan di atas 10, jadi `and` tak akan pernah True.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'A student passes when the score is at least 70 **and** attendance is at least 80. Store the answer in `lulus` and print it.',
                id: 'Seorang siswa lulus jika nilai minimal 70 **dan** kehadiran minimal 80. Simpan jawabannya di `lulus` lalu cetak.',
              },
              starter: 'nilai = 72\nkehadiran = 90\n',
              tests: [
                { name: { en: 'Prints True for 72 / 90', id: 'Mencetak True untuk 72 / 90' }, expectOutput: 'True' },
                {
                  name: { en: '`lulus` holds a bool', id: '`lulus` berisi bool' },
                  assert: 'assert lulus is True, "lulus harus berupa hasil perbandingan bernilai True"',
                },
              ],
              hints: [
                { en: 'Two comparisons joined with and.', id: 'Dua perbandingan digabung dengan and.' },
                { en: 'lulus = nilai >= 70 and kehadiran >= 80', id: 'lulus = nilai >= 70 and kehadiran >= 80' },
              ],
              solution: 'nilai = 72\nkehadiran = 90\nlulus = nilai >= 70 and kehadiran >= 80\nprint(lulus)',
            },
          ],
        },
      ],
      project: {
        id: 'py-m2-s1-p',
        title: { en: 'Ticket eligibility', id: 'Kelayakan tiket' },
        brief: {
          en: 'Decide whether someone may ride: they must be at least 120 cm tall and either 12 or older, or accompanied by an adult.',
          id: 'Tentukan apakah seseorang boleh naik: tingginya minimal 120 cm dan usianya 12 tahun ke atas, atau ditemani orang dewasa.',
        },
        requirements: [
          { en: 'Read `tinggi` (number) then `umur` (number) then `ditemani` ("ya"/"tidak").', id: 'Baca `tinggi` (angka), lalu `umur` (angka), lalu `ditemani` ("ya"/"tidak").' },
          { en: 'Print `BOLEH` or `TIDAK BOLEH`.', id: 'Cetak `BOLEH` atau `TIDAK BOLEH`.' },
          { en: 'Use and / or — no if statement needed yet.', id: 'Gunakan and / or — belum perlu pernyataan if.' },
        ],
        starter:
          '# Kelayakan naik wahana\ntinggi = int(input("Tinggi (cm): "))\numur = int(input("Umur: "))\nditemani = input("Ditemani dewasa? (ya/tidak): ")\n',
        tests: [
          {
            name: { en: '130 cm, 14, alone → BOLEH', id: '130 cm, 14, sendiri → BOLEH' },
            stdin: ['130', '14', 'tidak'],
            expectOutput: 'BOLEH',
          },
          {
            name: { en: '130 cm, 8, accompanied → BOLEH', id: '130 cm, 8, ditemani → BOLEH' },
            stdin: ['130', '8', 'ya'],
            expectOutput: 'BOLEH',
          },
          {
            name: { en: '110 cm, 20, alone → TIDAK BOLEH', id: '110 cm, 20, sendiri → TIDAK BOLEH' },
            stdin: ['110', '20', 'tidak'],
            expectOutput: 'TIDAK BOLEH',
          },
          {
            name: { en: '130 cm, 8, alone → TIDAK BOLEH', id: '130 cm, 8, sendiri → TIDAK BOLEH' },
            stdin: ['130', '8', 'tidak'],
            expectOutput: 'TIDAK BOLEH',
          },
        ],
        hints: [
          { en: 'Height is required no matter what, so it joins with `and`.', id: 'Tinggi wajib apa pun kondisinya, jadi digabung dengan `and`.' },
          { en: 'The age-or-companion part needs its own brackets.', id: 'Bagian umur-atau-ditemani butuh kurungnya sendiri.' },
          {
            en: 'boleh = tinggi >= 120 and (umur >= 12 or ditemani == "ya")',
            id: 'boleh = tinggi >= 120 and (umur >= 12 or ditemani == "ya")',
          },
          {
            en: 'Turn the bool into words with: print("BOLEH" if boleh else "TIDAK BOLEH")',
            id: 'Ubah bool jadi kata dengan: print("BOLEH" if boleh else "TIDAK BOLEH")',
          },
        ],
        solution:
          'tinggi = int(input("Tinggi (cm): "))\numur = int(input("Umur: "))\nditemani = input("Ditemani dewasa? (ya/tidak): ")\nboleh = tinggi >= 120 and (umur >= 12 or ditemani == "ya")\nprint("BOLEH" if boleh else "TIDAK BOLEH")',
        xp: 50,
      },
    },

    /* --------------------------------------------------------- 2.2 if / elif */
    {
      id: 'py-m2-s2',
      title: { en: 'if, elif, else', id: 'if, elif, else' },
      summary: {
        en: 'Run different code depending on the answer.',
        id: 'Menjalankan kode berbeda tergantung jawabannya.',
      },
      lessons: [
        {
          id: 'py-m2-s2-l1',
          title: { en: 'Two roads', id: 'Dua jalan' },
          goal: { en: 'Choose between two blocks of code.', id: 'Memilih antara dua blok kode.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'if and else', id: 'if dan else' },
              body: {
                en: 'The line ends with a colon, and everything indented under it belongs to that branch. Indentation is not decoration in Python — it *is* the grouping.',
                id: 'Barisnya diakhiri titik dua, dan semua yang menjorok di bawahnya milik cabang itu. Indentasi bukan hiasan di Python — indentasi *adalah* pengelompokannya.',
              },
              code: 'nilai = 65\n\nif nilai >= 70:\n    print("Lulus")\nelse:\n    print("Belum lulus")',
              output: 'Belum lulus',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'else is optional', id: 'else itu opsional' },
              body: {
                en: 'When there is nothing to do in the other case, leave `else` out. Code after the block, at the outer indentation, always runs.',
                id: 'Kalau tidak ada yang perlu dilakukan pada kasus lain, hilangkan saja `else`. Kode setelah blok, pada indentasi luar, selalu dijalankan.',
              },
              code: 'saldo = 100\nif saldo < 50:\n    print("Saldo menipis")\nprint("Selesai")',
              output: 'Selesai',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'x = 10\nif x > 10:\n    print("besar")\nelse:\n    print("tidak besar")\nprint("akhir")',
              options: [
                { en: 'tidak besar, then akhir', id: 'tidak besar, lalu akhir' },
                { en: 'besar, then akhir', id: 'besar, lalu akhir' },
                { en: 'tidak besar only', id: 'hanya tidak besar' },
                { en: 'akhir only', id: 'hanya akhir' },
              ],
              answer: 0,
              explain: {
                en: '10 is not greater than 10, so else runs. The last line is outside the if, so it always runs.',
                id: '10 tidak lebih besar dari 10, jadi else yang jalan. Baris terakhir di luar if, jadi selalu jalan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints `Dewasa` when umur is 18.',
                id: 'Susun program yang mencetak `Dewasa` ketika umur bernilai 18.',
              },
              lines: ['umur = 18', 'if umur >= 17:', '    print("Dewasa")', 'else:', '    print("Belum dewasa")'],
              explain: {
                en: 'The condition comes first; the indented line under it is what happens when it is True.',
                id: 'Kondisi lebih dulu; baris menjorok di bawahnya adalah yang terjadi bila kondisi True.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read a number. Print `Genap` if it divides by 2 with no remainder, otherwise `Ganjil`.',
                id: 'Baca sebuah angka. Cetak `Genap` jika habis dibagi 2, selain itu `Ganjil`.',
              },
              starter: 'n = int(input("Angka: "))\n',
              tests: [
                { name: { en: '4 → Genap', id: '4 → Genap' }, stdin: ['4'], expectContains: ['Genap'] },
                { name: { en: '7 → Ganjil', id: '7 → Ganjil' }, stdin: ['7'], expectContains: ['Ganjil'] },
                { name: { en: '0 → Genap', id: '0 → Genap' }, stdin: ['0'], expectContains: ['Genap'] },
              ],
              hints: [
                { en: 'Remember % gives the remainder.', id: 'Ingat, % memberi sisa bagi.' },
                { en: 'if n % 2 == 0:', id: 'if n % 2 == 0:' },
              ],
              solution: 'n = int(input("Angka: "))\nif n % 2 == 0:\n    print("Genap")\nelse:\n    print("Ganjil")',
            },
          ],
        },
        {
          id: 'py-m2-s2-l2',
          title: { en: 'More than two roads', id: 'Lebih dari dua jalan' },
          goal: { en: 'Pick one branch out of many with elif.', id: 'Memilih satu cabang dari banyak dengan elif.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'elif chains', id: 'Rantai elif' },
              body: {
                en: 'Python tries each condition top to bottom and runs the **first** one that is True, then skips the rest. That is why the order matters.',
                id: 'Python mencoba tiap kondisi dari atas ke bawah dan menjalankan yang **pertama** bernilai True, lalu melewati sisanya. Itulah sebabnya urutan penting.',
              },
              code: 'nilai = 85\n\nif nilai >= 90:\n    print("A")\nelif nilai >= 80:\n    print("B")\nelif nilai >= 70:\n    print("C")\nelse:\n    print("D")',
              output: 'B',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Order changes the answer', id: 'Urutan mengubah jawaban' },
              body: {
                en: 'Put the loosest condition first and every score matches it. Here 95 wrongly prints C, because `nilai >= 70` is checked before `nilai >= 90`.',
                id: 'Taruh kondisi paling longgar di depan, maka semua nilai akan cocok dengannya. Di sini 95 keliru mencetak C, karena `nilai >= 70` diperiksa sebelum `nilai >= 90`.',
              },
              code: 'nilai = 95\n\nif nilai >= 70:\n    print("C")\nelif nilai >= 90:\n    print("A")',
              output: 'C',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'With nilai = 70, what is printed?', id: 'Dengan nilai = 70, apa yang dicetak?' },
              code: 'if nilai > 70:\n    print("atas")\nelif nilai == 70:\n    print("pas")\nelse:\n    print("bawah")',
              options: [
                { en: 'pas', id: 'pas' },
                { en: 'atas', id: 'atas' },
                { en: 'bawah', id: 'bawah' },
                { en: 'atas and pas', id: 'atas dan pas' },
              ],
              answer: 0,
              explain: {
                en: 'The first condition is False, the second is True, and only one branch ever runs.',
                id: 'Kondisi pertama False, kedua True, dan hanya satu cabang yang dijalankan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the chain so 60 prints `Cukup`.',
                id: 'Lengkapi rantainya agar 60 mencetak `Cukup`.',
              },
              template: 'n = 60\nif n >= 80:\n    print("Baik")\n___ n >= 60:\n    print("Cukup")\n___:\n    print("Kurang")',
              blanks: ['elif', 'else'],
              explain: {
                en: 'elif adds another condition; else is the catch-all with no condition.',
                id: 'elif menambah kondisi lain; else adalah penampung terakhir tanpa kondisi.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read an hour (0–23) and print `Pagi` (5–10), `Siang` (11–14), `Sore` (15–18), or `Malam` (anything else).',
                id: 'Baca sebuah jam (0–23) lalu cetak `Pagi` (5–10), `Siang` (11–14), `Sore` (15–18), atau `Malam` (selain itu).',
              },
              starter: 'jam = int(input("Jam: "))\n',
              tests: [
                { name: { en: '7 → Pagi', id: '7 → Pagi' }, stdin: ['7'], expectContains: ['Pagi'] },
                { name: { en: '13 → Siang', id: '13 → Siang' }, stdin: ['13'], expectContains: ['Siang'] },
                { name: { en: '17 → Sore', id: '17 → Sore' }, stdin: ['17'], expectContains: ['Sore'] },
                { name: { en: '22 → Malam', id: '22 → Malam' }, stdin: ['22'], expectContains: ['Malam'] },
                { name: { en: '3 → Malam', id: '3 → Malam' }, stdin: ['3'], expectContains: ['Malam'] },
              ],
              hints: [
                { en: 'Check the earliest range first, then work upward.', id: 'Periksa rentang paling awal dulu, lalu naik.' },
                { en: 'Each range needs two bounds: 5 <= jam <= 10', id: 'Tiap rentang butuh dua batas: 5 <= jam <= 10' },
                { en: 'Malam is the else branch — it needs no condition.', id: 'Malam adalah cabang else — tidak butuh kondisi.' },
              ],
              solution:
                'jam = int(input("Jam: "))\nif 5 <= jam <= 10:\n    print("Pagi")\nelif 11 <= jam <= 14:\n    print("Siang")\nelif 15 <= jam <= 18:\n    print("Sore")\nelse:\n    print("Malam")',
            },
          ],
        },
      ],
      project: {
        id: 'py-m2-s2-p',
        title: { en: 'Letter grade', id: 'Nilai huruf' },
        brief: {
          en: 'Turn a numeric score into a letter grade, and refuse scores that make no sense.',
          id: 'Ubah nilai angka menjadi nilai huruf, dan tolak nilai yang tidak masuk akal.',
        },
        requirements: [
          { en: 'Read one whole number.', id: 'Baca satu bilangan bulat.' },
          { en: 'Below 0 or above 100 → print `Nilai tidak valid`.', id: 'Di bawah 0 atau di atas 100 → cetak `Nilai tidak valid`.' },
          { en: '90+ → A, 80–89 → B, 70–79 → C, 60–69 → D, below 60 → E.', id: '90+ → A, 80–89 → B, 70–79 → C, 60–69 → D, di bawah 60 → E.' },
          { en: 'Print only the letter, e.g. `B`.', id: 'Cetak hanya hurufnya, misalnya `B`.' },
        ],
        starter: '# Konversi nilai angka ke huruf\nnilai = int(input("Nilai: "))\n',
        tests: [
          { name: { en: '95 → A', id: '95 → A' }, stdin: ['95'], expectOutput: 'A' },
          { name: { en: '80 → B', id: '80 → B' }, stdin: ['80'], expectOutput: 'B' },
          { name: { en: '70 → C', id: '70 → C' }, stdin: ['70'], expectOutput: 'C' },
          { name: { en: '61 → D', id: '61 → D' }, stdin: ['61'], expectOutput: 'D' },
          { name: { en: '12 → E', id: '12 → E' }, stdin: ['12'], expectOutput: 'E' },
          { name: { en: '120 → tidak valid', id: '120 → tidak valid' }, stdin: ['120'], expectOutput: 'Nilai tidak valid' },
          { name: { en: '-5 → tidak valid', id: '-5 → tidak valid' }, stdin: ['-5'], expectOutput: 'Nilai tidak valid' },
        ],
        hints: [
          { en: 'Check the invalid range first, before any grade.', id: 'Periksa rentang tidak valid lebih dulu, sebelum nilai apa pun.' },
          { en: 'After that, an elif chain from highest to lowest needs only one bound each.', id: 'Setelah itu, rantai elif dari tertinggi ke terendah cukup satu batas tiap cabang.' },
          {
            en: 'if nilai < 0 or nilai > 100: … elif nilai >= 90: …',
            id: 'if nilai < 0 or nilai > 100: … elif nilai >= 90: …',
          },
        ],
        solution:
          'nilai = int(input("Nilai: "))\nif nilai < 0 or nilai > 100:\n    print("Nilai tidak valid")\nelif nilai >= 90:\n    print("A")\nelif nilai >= 80:\n    print("B")\nelif nilai >= 70:\n    print("C")\nelif nilai >= 60:\n    print("D")\nelse:\n    print("E")',
        xp: 50,
      },
    },
  ],
}
