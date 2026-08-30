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
              code: {
                en: 'score = 75\nprint(score > 70)\nprint(score == 100)\npassed = score >= 70\nprint(passed)',
                id: 'nilai = 75\nprint(nilai > 70)\nprint(nilai == 100)\nlulus = nilai >= 70\nprint(lulus)',
              },
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
              code: {
                en: 'x = 5        # assigns\nprint(x == 5)  # asks\nprint(x != 5)',
                id: 'x = 5        # menetapkan\nprint(x == 5)  # menanya\nprint(x != 5)',
              },
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
                en: 'Store whether `age` is at least 17 in a variable `allowed`.',
                id: 'Simpan apakah `umur` minimal 17 ke variabel `boleh`.',
              },
              template: { en: 'age = 18\nallowed = age ___ 17\nprint(allowed)', id: 'umur = 18\nboleh = umur ___ 17\nprint(boleh)' },
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
                en: 'Given `stock = 0`, store in `out_of_stock` whether the stock equals zero, and print it.',
                id: 'Diberikan `stok = 0`, simpan di `habis` apakah stoknya nol, lalu cetak.',
              },
              starter: { en: 'stock = 0\n', id: 'stok = 0\n' },
              tests: {
                en: [
                  { name: { en: 'Prints True', id: 'Mencetak True' }, expectOutput: 'True' },
                  {
                    name: { en: '`out_of_stock` holds a bool', id: '`habis` berisi bool' },
                    assert: 'assert out_of_stock is True, "out_of_stock must be a comparison result, not a number"',
                  },
                ],
                id: [
                  { name: { en: 'Prints True', id: 'Mencetak True' }, expectOutput: 'True' },
                  {
                    name: { en: '`habis` holds a bool', id: '`habis` berisi bool' },
                    assert: 'assert habis is True, "habis harus berupa hasil perbandingan, bukan angka"',
                  },
                ],
              },
              hints: [
                { en: 'Use == to compare, not =.', id: 'Gunakan == untuk membandingkan, bukan =.' },
                { en: 'out_of_stock = stock == 0', id: 'habis = stok == 0' },
              ],
              solution: { en: 'stock = 0\nout_of_stock = stock == 0\nprint(out_of_stock)', id: 'stok = 0\nhabis = stok == 0\nprint(habis)' },
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
              code: {
                en: 'age = 20\nhas_id = True\nprint(age >= 17 and has_id)\nprint(age < 17 or has_id)\nprint(not has_id)',
                id: 'umur = 20\npunya_ktp = True\nprint(umur >= 17 and punya_ktp)\nprint(umur < 17 or punya_ktp)\nprint(not punya_ktp)',
              },
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
              code: {
                en: 'score = 85\nprint(score >= 80 and score <= 89)\nprint(80 <= score <= 89)',
                id: 'nilai = 85\nprint(nilai >= 80 and nilai <= 89)\nprint(80 <= nilai <= 89)',
              },
              output: 'True\nTrue',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: {
                en: 'raining = True\nbring_umbrella = False\nprint(raining and bring_umbrella)',
                id: 'hujan = True\nbawa_payung = False\nprint(hujan and bawa_payung)',
              },
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
                en: 'A student passes when the score is at least 70 **and** attendance is at least 80. Store the answer in `passed` and print it.',
                id: 'Seorang siswa lulus jika nilai minimal 70 **dan** kehadiran minimal 80. Simpan jawabannya di `lulus` lalu cetak.',
              },
              starter: { en: 'score = 72\nattendance = 90\n', id: 'nilai = 72\nkehadiran = 90\n' },
              tests: {
                en: [
                  { name: { en: 'Prints True for 72 / 90', id: 'Mencetak True untuk 72 / 90' }, expectOutput: 'True' },
                  {
                    name: { en: '`passed` holds a bool', id: '`lulus` berisi bool' },
                    assert: 'assert passed is True, "passed must be a comparison result that is True"',
                  },
                ],
                id: [
                  { name: { en: 'Prints True for 72 / 90', id: 'Mencetak True untuk 72 / 90' }, expectOutput: 'True' },
                  {
                    name: { en: '`lulus` holds a bool', id: '`lulus` berisi bool' },
                    assert: 'assert lulus is True, "lulus harus berupa hasil perbandingan bernilai True"',
                  },
                ],
              },
              hints: [
                { en: 'Two comparisons joined with and.', id: 'Dua perbandingan digabung dengan and.' },
                { en: 'passed = score >= 70 and attendance >= 80', id: 'lulus = nilai >= 70 and kehadiran >= 80' },
              ],
              solution: {
                en: 'score = 72\nattendance = 90\npassed = score >= 70 and attendance >= 80\nprint(passed)',
                id: 'nilai = 72\nkehadiran = 90\nlulus = nilai >= 70 and kehadiran >= 80\nprint(lulus)',
              },
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
          { en: 'Read `height` (number) then `age` (number) then `accompanied` ("yes"/"no").', id: 'Baca `tinggi` (angka), lalu `umur` (angka), lalu `ditemani` ("ya"/"tidak").' },
          { en: 'Print `ALLOWED` or `NOT ALLOWED`.', id: 'Cetak `BOLEH` atau `TIDAK BOLEH`.' },
          { en: 'Use and / or — no if statement needed yet.', id: 'Gunakan and / or — belum perlu pernyataan if.' },
        ],
        starter: {
          en: '# Ride eligibility\nheight = int(input("Height (cm): "))\nage = int(input("Age: "))\naccompanied = input("Accompanied by an adult? (yes/no): ")\n',
          id: '# Kelayakan naik wahana\ntinggi = int(input("Tinggi (cm): "))\numur = int(input("Umur: "))\nditemani = input("Ditemani dewasa? (ya/tidak): ")\n',
        },
        tests: {
          en: [
            {
              name: { en: '130 cm, 14, alone → ALLOWED', id: '130 cm, 14, sendiri → BOLEH' },
              stdin: ['130', '14', 'no'],
              expectOutput: 'ALLOWED',
            },
            {
              name: { en: '130 cm, 8, accompanied → ALLOWED', id: '130 cm, 8, ditemani → BOLEH' },
              stdin: ['130', '8', 'yes'],
              expectOutput: 'ALLOWED',
            },
            {
              name: { en: '110 cm, 20, alone → NOT ALLOWED', id: '110 cm, 20, sendiri → TIDAK BOLEH' },
              stdin: ['110', '20', 'no'],
              expectOutput: 'NOT ALLOWED',
            },
            {
              name: { en: '130 cm, 8, alone → NOT ALLOWED', id: '130 cm, 8, sendiri → TIDAK BOLEH' },
              stdin: ['130', '8', 'no'],
              expectOutput: 'NOT ALLOWED',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'Height is required no matter what, so it joins with `and`.', id: 'Tinggi wajib apa pun kondisinya, jadi digabung dengan `and`.' },
          { en: 'The age-or-companion part needs its own brackets.', id: 'Bagian umur-atau-ditemani butuh kurungnya sendiri.' },
          {
            en: 'allowed = height >= 120 and (age >= 12 or accompanied == "yes")',
            id: 'boleh = tinggi >= 120 and (umur >= 12 or ditemani == "ya")',
          },
          {
            en: 'Turn the bool into words with: print("ALLOWED" if allowed else "NOT ALLOWED")',
            id: 'Ubah bool jadi kata dengan: print("BOLEH" if boleh else "TIDAK BOLEH")',
          },
        ],
        solution: {
          en: 'height = int(input("Height (cm): "))\nage = int(input("Age: "))\naccompanied = input("Accompanied by an adult? (yes/no): ")\nallowed = height >= 120 and (age >= 12 or accompanied == "yes")\nprint("ALLOWED" if allowed else "NOT ALLOWED")',
          id: 'tinggi = int(input("Tinggi (cm): "))\numur = int(input("Umur: "))\nditemani = input("Ditemani dewasa? (ya/tidak): ")\nboleh = tinggi >= 120 and (umur >= 12 or ditemani == "ya")\nprint("BOLEH" if boleh else "TIDAK BOLEH")',
        },
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
              code: {
                en: 'score = 65\n\nif score >= 70:\n    print("Pass")\nelse:\n    print("Not passing")',
                id: 'nilai = 65\n\nif nilai >= 70:\n    print("Lulus")\nelse:\n    print("Belum lulus")',
              },
              output: { en: 'Not passing', id: 'Belum lulus' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'else is optional', id: 'else itu opsional' },
              body: {
                en: 'When there is nothing to do in the other case, leave `else` out. Code after the block, at the outer indentation, always runs.',
                id: 'Kalau tidak ada yang perlu dilakukan pada kasus lain, hilangkan saja `else`. Kode setelah blok, pada indentasi luar, selalu dijalankan.',
              },
              code: {
                en: 'balance = 100\nif balance < 50:\n    print("Balance running low")\nprint("Done")',
                id: 'saldo = 100\nif saldo < 50:\n    print("Saldo menipis")\nprint("Selesai")',
              },
              output: { en: 'Done', id: 'Selesai' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: {
                en: 'x = 10\nif x > 10:\n    print("big")\nelse:\n    print("not big")\nprint("end")',
                id: 'x = 10\nif x > 10:\n    print("besar")\nelse:\n    print("tidak besar")\nprint("akhir")',
              },
              options: [
                { en: 'not big, then end', id: 'tidak besar, lalu akhir' },
                { en: 'big, then end', id: 'besar, lalu akhir' },
                { en: 'not big only', id: 'hanya tidak besar' },
                { en: 'end only', id: 'hanya akhir' },
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
                en: 'Assemble a program that prints `Adult` when age is 18.',
                id: 'Susun program yang mencetak `Dewasa` ketika umur bernilai 18.',
              },
              lines: {
                en: ['age = 18', 'if age >= 17:', '    print("Adult")', 'else:', '    print("Not an adult")'],
                id: ['umur = 18', 'if umur >= 17:', '    print("Dewasa")', 'else:', '    print("Belum dewasa")'],
              },
              explain: {
                en: 'The condition comes first; the indented line under it is what happens when it is True.',
                id: 'Kondisi lebih dulu; baris menjorok di bawahnya adalah yang terjadi bila kondisi True.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read a number. Print `Even` if it divides by 2 with no remainder, otherwise `Odd`.',
                id: 'Baca sebuah angka. Cetak `Genap` jika habis dibagi 2, selain itu `Ganjil`.',
              },
              starter: { en: 'n = int(input("Number: "))\n', id: 'n = int(input("Angka: "))\n' },
              tests: {
                en: [
                  { name: { en: '4 → Even', id: '4 → Genap' }, stdin: ['4'], expectContains: ['Even'] },
                  { name: { en: '7 → Odd', id: '7 → Ganjil' }, stdin: ['7'], expectContains: ['Odd'] },
                  { name: { en: '0 → Even', id: '0 → Genap' }, stdin: ['0'], expectContains: ['Even'] },
                ],
                id: [
                  { name: { en: '4 → Genap', id: '4 → Genap' }, stdin: ['4'], expectContains: ['Genap'] },
                  { name: { en: '7 → Ganjil', id: '7 → Ganjil' }, stdin: ['7'], expectContains: ['Ganjil'] },
                  { name: { en: '0 → Genap', id: '0 → Genap' }, stdin: ['0'], expectContains: ['Genap'] },
                ],
              },
              hints: [
                { en: 'Remember % gives the remainder.', id: 'Ingat, % memberi sisa bagi.' },
                { en: 'if n % 2 == 0:', id: 'if n % 2 == 0:' },
              ],
              solution: {
                en: 'n = int(input("Number: "))\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
                id: 'n = int(input("Angka: "))\nif n % 2 == 0:\n    print("Genap")\nelse:\n    print("Ganjil")',
              },
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
              code: {
                en: 'score = 85\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("D")',
                id: 'nilai = 85\n\nif nilai >= 90:\n    print("A")\nelif nilai >= 80:\n    print("B")\nelif nilai >= 70:\n    print("C")\nelse:\n    print("D")',
              },
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
              code: {
                en: 'score = 95\n\nif score >= 70:\n    print("C")\nelif score >= 90:\n    print("A")',
                id: 'nilai = 95\n\nif nilai >= 70:\n    print("C")\nelif nilai >= 90:\n    print("A")',
              },
              output: 'C',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'With score = 70, what is printed?', id: 'Dengan nilai = 70, apa yang dicetak?' },
              code: {
                en: 'if score > 70:\n    print("above")\nelif score == 70:\n    print("exact")\nelse:\n    print("below")',
                id: 'if nilai > 70:\n    print("atas")\nelif nilai == 70:\n    print("pas")\nelse:\n    print("bawah")',
              },
              options: [
                { en: 'exact', id: 'pas' },
                { en: 'above', id: 'atas' },
                { en: 'below', id: 'bawah' },
                { en: 'above and exact', id: 'atas dan pas' },
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
                en: 'Complete the chain so 60 prints `Enough`.',
                id: 'Lengkapi rantainya agar 60 mencetak `Cukup`.',
              },
              template: {
                en: 'n = 60\nif n >= 80:\n    print("Good")\n___ n >= 60:\n    print("Enough")\n___:\n    print("Not enough")',
                id: 'n = 60\nif n >= 80:\n    print("Baik")\n___ n >= 60:\n    print("Cukup")\n___:\n    print("Kurang")',
              },
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
                en: 'Read an hour (0–23) and print `Morning` (5–10), `Midday` (11–14), `Afternoon` (15–18), or `Night` (anything else).',
                id: 'Baca sebuah jam (0–23) lalu cetak `Pagi` (5–10), `Siang` (11–14), `Sore` (15–18), atau `Malam` (selain itu).',
              },
              starter: { en: 'hour = int(input("Hour: "))\n', id: 'jam = int(input("Jam: "))\n' },
              tests: {
                en: [
                  { name: { en: '7 → Morning', id: '7 → Pagi' }, stdin: ['7'], expectContains: ['Morning'] },
                  { name: { en: '13 → Midday', id: '13 → Siang' }, stdin: ['13'], expectContains: ['Midday'] },
                  { name: { en: '17 → Afternoon', id: '17 → Sore' }, stdin: ['17'], expectContains: ['Afternoon'] },
                  { name: { en: '22 → Night', id: '22 → Malam' }, stdin: ['22'], expectContains: ['Night'] },
                  { name: { en: '3 → Night', id: '3 → Malam' }, stdin: ['3'], expectContains: ['Night'] },
                ],
                id: [
                  { name: { en: '7 → Pagi', id: '7 → Pagi' }, stdin: ['7'], expectContains: ['Pagi'] },
                  { name: { en: '13 → Siang', id: '13 → Siang' }, stdin: ['13'], expectContains: ['Siang'] },
                  { name: { en: '17 → Sore', id: '17 → Sore' }, stdin: ['17'], expectContains: ['Sore'] },
                  { name: { en: '22 → Malam', id: '22 → Malam' }, stdin: ['22'], expectContains: ['Malam'] },
                  { name: { en: '3 → Malam', id: '3 → Malam' }, stdin: ['3'], expectContains: ['Malam'] },
                ],
              },
              hints: [
                { en: 'Check the earliest range first, then work upward.', id: 'Periksa rentang paling awal dulu, lalu naik.' },
                { en: 'Each range needs two bounds: 5 <= hour <= 10', id: 'Tiap rentang butuh dua batas: 5 <= jam <= 10' },
                { en: 'Night is the else branch — it needs no condition.', id: 'Malam adalah cabang else — tidak butuh kondisi.' },
              ],
              solution: {
                en: 'hour = int(input("Hour: "))\nif 5 <= hour <= 10:\n    print("Morning")\nelif 11 <= hour <= 14:\n    print("Midday")\nelif 15 <= hour <= 18:\n    print("Afternoon")\nelse:\n    print("Night")',
                id: 'jam = int(input("Jam: "))\nif 5 <= jam <= 10:\n    print("Pagi")\nelif 11 <= jam <= 14:\n    print("Siang")\nelif 15 <= jam <= 18:\n    print("Sore")\nelse:\n    print("Malam")',
              },
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
          { en: 'Below 0 or above 100 → print `Invalid score`.', id: 'Di bawah 0 atau di atas 100 → cetak `Nilai tidak valid`.' },
          { en: '90+ → A, 80–89 → B, 70–79 → C, 60–69 → D, below 60 → E.', id: '90+ → A, 80–89 → B, 70–79 → C, 60–69 → D, di bawah 60 → E.' },
          { en: 'Print only the letter, e.g. `B`.', id: 'Cetak hanya hurufnya, misalnya `B`.' },
        ],
        starter: {
          en: '# Convert numeric score to letter\nscore = int(input("Score: "))\n',
          id: '# Konversi nilai angka ke huruf\nnilai = int(input("Nilai: "))\n',
        },
        tests: {
          en: [
            { name: { en: '95 → A', id: '95 → A' }, stdin: ['95'], expectOutput: 'A' },
            { name: { en: '80 → B', id: '80 → B' }, stdin: ['80'], expectOutput: 'B' },
            { name: { en: '70 → C', id: '70 → C' }, stdin: ['70'], expectOutput: 'C' },
            { name: { en: '61 → D', id: '61 → D' }, stdin: ['61'], expectOutput: 'D' },
            { name: { en: '12 → E', id: '12 → E' }, stdin: ['12'], expectOutput: 'E' },
            { name: { en: '120 → invalid', id: '120 → tidak valid' }, stdin: ['120'], expectOutput: 'Invalid score' },
            { name: { en: '-5 → invalid', id: '-5 → tidak valid' }, stdin: ['-5'], expectOutput: 'Invalid score' },
          ],
          id: [
            { name: { en: '95 → A', id: '95 → A' }, stdin: ['95'], expectOutput: 'A' },
            { name: { en: '80 → B', id: '80 → B' }, stdin: ['80'], expectOutput: 'B' },
            { name: { en: '70 → C', id: '70 → C' }, stdin: ['70'], expectOutput: 'C' },
            { name: { en: '61 → D', id: '61 → D' }, stdin: ['61'], expectOutput: 'D' },
            { name: { en: '12 → E', id: '12 → E' }, stdin: ['12'], expectOutput: 'E' },
            { name: { en: '120 → tidak valid', id: '120 → tidak valid' }, stdin: ['120'], expectOutput: 'Nilai tidak valid' },
            { name: { en: '-5 → tidak valid', id: '-5 → tidak valid' }, stdin: ['-5'], expectOutput: 'Nilai tidak valid' },
          ],
        },
        hints: [
          { en: 'Check the invalid range first, before any grade.', id: 'Periksa rentang tidak valid lebih dulu, sebelum nilai apa pun.' },
          { en: 'After that, an elif chain from highest to lowest needs only one bound each.', id: 'Setelah itu, rantai elif dari tertinggi ke terendah cukup satu batas tiap cabang.' },
          {
            en: 'if score < 0 or score > 100: … elif score >= 90: …',
            id: 'if nilai < 0 or nilai > 100: … elif nilai >= 90: …',
          },
        ],
        solution: {
          en: 'score = int(input("Score: "))\nif score < 0 or score > 100:\n    print("Invalid score")\nelif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("E")',
          id: 'nilai = int(input("Nilai: "))\nif nilai < 0 or nilai > 100:\n    print("Nilai tidak valid")\nelif nilai >= 90:\n    print("A")\nelif nilai >= 80:\n    print("B")\nelif nilai >= 70:\n    print("C")\nelif nilai >= 60:\n    print("D")\nelse:\n    print("E")',
        },
        xp: 50,
      },
    },
  ],
}
