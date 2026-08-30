import type { Module } from '../types'

/** Module 2 — looping a generator into a whole worksheet with a key, then
 *  grading a set of answers against that key. */
export const module2: Module = {
  id: 'pymed-m2',
  title: { en: 'Worksheets and Automatic Grading', id: 'Lembar Kerja dan Penilai Otomatis' },
  summary: {
    en: 'One problem in a loop becomes a worksheet. A key and a zip() becomes a grader that never gets tired.',
    id: 'Satu soal dalam perulangan menjadi lembar kerja. Kunci dan zip() menjadi penilai yang tak pernah lelah.',
  },
  submodules: [
    /* ---------------------------------------------- 2.1 building a worksheet */
    {
      id: 'pymed-m2-s1',
      title: { en: 'Building a Worksheet', id: 'Menyusun Lembar Kerja' },
      summary: {
        en: 'A loop turns one generated problem into a whole batch — and a paired list keeps the answer key attached to each one.',
        id: 'Perulangan mengubah satu soal yang dihasilkan menjadi satu kelompok — dan list berpasangan menjaga kunci jawaban tetap melekat pada tiap soalnya.',
      },
      lessons: [
        {
          id: 'pymed-m2-s1-l1',
          title: { en: 'Looping to Make Many Problems', id: 'Mengulang untuk Membuat Banyak Soal' },
          goal: { en: 'Generate a batch of problems instead of one.', id: 'Menghasilkan sekelompok soal, bukan satu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The generator from module 1, looped', id: 'Generator dari modul 1, diulang' },
              body: {
                en: 'Nothing new is needed to make three problems instead of one — the same draw, inside a `for` loop, seeded once before the loop starts so the whole batch is reproducible together.',
                id: 'Tak ada yang baru untuk membuat tiga soal alih-alih satu — pengambilan yang sama, di dalam perulangan `for`, di-seed sekali sebelum perulangannya mulai supaya seluruh kelompoknya bisa diulang bersama.',
              },
              code: 'import random\nrandom.seed(1)\nfor i in range(3):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    print(f"{a} + {b} = ?")',
              output: '3 + 10 = ?\n2 + 5 = ?\n2 + 8 = ?',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Collecting instead of printing', id: 'Mengumpulkan, bukan langsung mencetak' },
              body: {
                en: 'Printing inside the loop is fine for a quick look, but a real worksheet needs the problems kept somewhere — `.append()` onto a list, then decide what to do with all of them afterward.',
                id: 'Mencetak di dalam perulangan cukup untuk melihat sekilas, tapi lembar kerja sungguhan butuh soal-soalnya disimpan di suatu tempat — `.append()` ke sebuah list, baru putuskan mau diapakan semuanya setelah itu.',
              },
              code: {
                en: 'import random\nrandom.seed(1)\nproblems = []\nfor i in range(3):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    problems.append(f"{a} + {b}")\nprint(problems)',
                id: 'import random\nrandom.seed(1)\nsoal = []\nfor i in range(3):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    soal.append(f"{a} + {b}")\nprint(soal)',
              },
              output: "['3 + 10', '2 + 5', '2 + 8']",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'random.seed(1) is set once, before a loop of 3 draws. What happens if random.seed(1) were placed INSIDE the loop instead, run every pass?',
                id: 'random.seed(1) diterapkan sekali, sebelum perulangan 3 kali pengambilan. Apa yang terjadi kalau random.seed(1) diletakkan DI DALAM perulangan, dijalankan tiap putaran?',
              },
              options: [
                { en: 'Every problem in the batch would be identical', id: 'Semua soal di kelompok itu akan identik' },
                { en: 'Nothing would change', id: 'Tidak ada yang berubah' },
                { en: 'The program would raise an error', id: 'Programnya akan melempar galat' },
                { en: 'Each problem would be even more random', id: 'Tiap soal akan makin acak' },
              ],
              answer: 0,
              explain: {
                en: 'Reseeding with the same number resets the sequence back to its start every time — the first draw after seed(1) is always the same draw.',
                id: 'Men-seed ulang dengan angka yang sama menata ulang urutannya kembali ke awal tiap kali — pengambilan pertama setelah seed(1) selalu pengambilan yang sama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the loop so it runs 5 times.',
                id: 'Lengkapi perulangannya agar berjalan 5 kali.',
              },
              template: {
                en: 'import random\nrandom.seed(2)\nproblems = []\nfor i in range(___):\n    a = random.randint(1, 6)\n    problems.append(a)\nprint(problems)',
                id: 'import random\nrandom.seed(2)\nsoal = []\nfor i in range(___):\n    a = random.randint(1, 6)\n    soal.append(a)\nprint(soal)',
              },
              blanks: ['5'],
              explain: {
                en: 'range(5) walks 0 through 4 — five passes through the loop body.',
                id: 'range(5) berjalan dari 0 sampai 4 — lima putaran melalui isi perulangannya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a loop collecting 4 random letters into a list.',
                id: 'Susun perulangan yang mengumpulkan 4 huruf acak ke dalam list.',
              },
              lines: {
                en: [
                  'import random',
                  'random.seed(8)',
                  'letters = ["a", "b", "c", "d", "e"]',
                  'picked = []',
                  'for i in range(4):',
                  '    picked.append(random.choice(letters))',
                  'print(picked)',
                ],
                id: [
                  'import random',
                  'random.seed(8)',
                  'huruf = ["a", "b", "c", "d", "e"]',
                  'terpilih = []',
                  'for i in range(4):',
                  '    terpilih.append(random.choice(huruf))',
                  'print(terpilih)',
                ],
              },
              explain: {
                en: 'The empty list has to exist before the loop appends to it.',
                id: 'List kosongnya harus ada sebelum perulangannya menambahkan ke situ.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `n`, then a whole number `s`. Seed with `s`, then print `n` addition problems (each `a` and `b` from 1 to 10), each formatted as `a + b = ?` on its own line.',
                id: 'Baca bilangan bulat `n`, lalu bilangan bulat `s`. Seed dengan `s`, lalu cetak `n` soal penjumlahan (masing-masing `a` dan `b` dari 1 sampai 10), diformat `a + b = ?` di baris sendiri-sendiri.',
              },
              starter: 'import random\nn = int(input())\ns = int(input())\n',
              tests: [
                { name: { en: 'n=3, s=1', id: 'n=3, s=1' }, stdin: ['3', '1'], expectOutput: '3 + 10 = ?\n2 + 5 = ?\n2 + 8 = ?' },
                { name: { en: 'n=2, s=5', id: 'n=2, s=5' }, stdin: ['2', '5'], expectOutput: '10 + 5 = ?\n6 + 9 = ?' },
                { name: { en: 'n=4, s=2', id: 'n=4, s=2' }, stdin: ['4', '2'], expectOutput: '1 + 2 = ?\n2 + 6 = ?\n3 + 5 = ?\n5 + 10 = ?' },
                { name: { en: 'n=1, s=9', id: 'n=1, s=9' }, stdin: ['1', '9'], expectOutput: '8 + 10 = ?' },
              ],
              hints: [
                { en: 'Read n and s first, then random.seed(s), then loop range(n).', id: 'Baca n dan s dulu, lalu random.seed(s), lalu ulangi range(n).' },
              ],
              solution:
                'import random\nn = int(input())\ns = int(input())\nrandom.seed(s)\nfor i in range(n):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    print(f"{a} + {b} = ?")',
            },
          ],
        },
        {
          id: 'pymed-m2-s1-l2',
          title: { en: 'Keeping the Answer Key Attached', id: 'Menyimpan Kunci Jawaban Terpisah' },
          goal: { en: 'Pair a problem with its answer so they cannot drift apart.', id: 'Memasangkan soal dengan jawabannya supaya keduanya tak bisa terpisah.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two separate lists, kept in step', id: 'Dua list terpisah, dijaga selaras' },
              body: {
                en: 'One list of problem texts and one list of answers, appended together on every pass, stay lined up by position — `problems[0]` matches `answers[0]`, and so on. It works, but nothing stops the two lists from silently drifting out of sync if either is edited alone later.',
                id: 'Satu list teks soal dan satu list jawaban, ditambahkan bersamaan tiap putaran, tetap selaras berdasarkan posisinya — `soal[0]` cocok dengan `kunci[0]`, dan seterusnya. Ini berjalan, tapi tak ada yang mencegah keduanya diam-diam tak lagi selaras kalau salah satunya diubah sendirian nanti.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One list, pairs instead', id: 'Satu list, isinya pasangan' },
              body: {
                en: 'A tuple `(problem, answer)` keeps a problem and its answer as one unit — appended together, they cannot be pulled apart by accident. Unpacking `for problem, answer in pairs:` reads both halves of each pair at once.',
                id: 'Tuple `(soal, jawaban)` menjaga sebuah soal dan jawabannya sebagai satu kesatuan — ditambahkan bersamaan, keduanya tak bisa terpisah secara tak sengaja. Membongkarnya dengan `for soal, jawaban in paket:` membaca kedua bagian tiap pasangan sekaligus.',
              },
              code: {
                en: 'import random\nrandom.seed(1)\npairs = []\nfor i in range(3):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    pairs.append((f"{a} + {b} = ?", a + b))\nfor problem, answer in pairs:\n    print(problem)',
                id: 'import random\nrandom.seed(1)\npaket = []\nfor i in range(3):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    paket.append((f"{a} + {b} = ?", a + b))\nfor soal, jawaban in paket:\n    print(soal)',
              },
              output: '3 + 10 = ?\n2 + 5 = ?\n2 + 8 = ?',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'pairs holds 3 (problem, answer) tuples. What does `for problem, answer in pairs:` do if pairs is empty?',
                id: 'paket menyimpan 3 tuple (soal, jawaban). Apa yang dilakukan `for soal, jawaban in paket:` kalau paket kosong?',
              },
              options: [
                { en: 'The loop body never runs', id: 'Isi perulangannya tak pernah berjalan' },
                { en: 'It raises an error', id: 'Ia melempar galat' },
                { en: 'problem and answer become None', id: 'soal dan jawaban menjadi None' },
                { en: 'It loops forever', id: 'Ia berulang selamanya' },
              ],
              answer: 0,
              explain: {
                en: 'A for loop over an empty sequence simply has nothing to iterate — the body is skipped entirely, same as any other empty list.',
                id: 'Perulangan for atas urutan kosong sekadar tak punya apa pun untuk diulang — isinya dilewati sepenuhnya, sama seperti list kosong lainnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Unpack each pair into its two names.',
                id: 'Bongkar tiap pasangan ke dua namanya.',
              },
              template: {
                en: 'pairs = [("2 + 2", 4), ("3 + 3", 6)]\nfor problem, ___ in pairs:\n    print(problem)',
                id: 'paket = [("2 + 2", 4), ("3 + 3", 6)]\nfor soal, ___ in paket:\n    print(soal)',
              },
              blanks: {
                en: ['answer'],
                id: ['jawaban'],
              },
              explain: {
                en: 'The two names on the left of "in" match the two items in each tuple, in order.',
                id: 'Kedua nama di sebelah kiri "in" cocok dengan kedua unsur tiap tuple-nya, berurutan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program printing only the answers from a ready-made list of pairs.',
                id: 'Susun program yang hanya mencetak jawaban-jawabannya dari list pasangan yang sudah jadi.',
              },
              lines: {
                en: ['pairs = [("4 + 1", 5), ("2 + 9", 11)]', 'for problem, answer in pairs:', '    print(answer)'],
                id: ['paket = [("4 + 1", 5), ("2 + 9", 11)]', 'for soal, jawaban in paket:', '    print(jawaban)'],
              },
              explain: {
                en: 'problem is unpacked but simply unused here — Python does not require using every name a loop unpacks.',
                id: 'soal tetap dibongkar tapi sekadar tak dipakai di sini — Python tak mewajibkan tiap nama yang dibongkar perulangan harus dipakai.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `n` and `s`. Seed with `s`. Build a list of `n` (problem, answer) pairs the same way as the concept above, then print only the `answer` values, one per line.',
                id: 'Baca `n` dan `s`. Seed dengan `s`. Bangun list `n` pasangan (soal, jawaban) seperti pada konsep di atas, lalu cetak hanya nilai `jawaban`-nya, satu per baris.',
              },
              starter: 'import random\nn = int(input())\ns = int(input())\n',
              tests: [
                { name: { en: 'n=3, s=1', id: 'n=3, s=1' }, stdin: ['3', '1'], expectOutput: '13\n7\n10' },
                { name: { en: 'n=2, s=5', id: 'n=2, s=5' }, stdin: ['2', '5'], expectOutput: '15\n15' },
                { name: { en: 'n=1, s=9', id: 'n=1, s=9' }, stdin: ['1', '9'], expectOutput: '18' },
                { name: { en: 'n=4, s=2', id: 'n=4, s=2' }, stdin: ['4', '2'], expectOutput: '3\n8\n8\n15' },
              ],
              hints: [
                { en: 'Build the pairs first, then a second loop (or the same one) that only prints answer.', id: 'Bangun pasangannya dulu, lalu perulangan kedua (atau yang sama) yang hanya mencetak jawaban.' },
              ],
              solution: {
                en: 'import random\nn = int(input())\ns = int(input())\nrandom.seed(s)\npairs = []\nfor i in range(n):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    pairs.append((f"{a} + {b} = ?", a + b))\nfor problem, answer in pairs:\n    print(answer)',
                id: 'import random\nn = int(input())\ns = int(input())\nrandom.seed(s)\npaket = []\nfor i in range(n):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    paket.append((f"{a} + {b} = ?", a + b))\nfor soal, jawaban in paket:\n    print(jawaban)',
              },
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m2-s1-p',
        title: { en: 'Problem Set With a Key', id: 'Paket Soal dengan Kunci' },
        brief: {
          en: 'Generate a whole worksheet, then print it in two parts: every question first, then every answer.',
          id: 'Hasilkan satu lembar kerja utuh, lalu cetak dalam dua bagian: semua pertanyaan dulu, baru semua jawaban.',
        },
        requirements: [
          { en: 'Read `n` and `s`, seed with `s`.', id: 'Baca `n` dan `s`, seed dengan `s`.' },
          { en: 'Build a list of `n` pairs `(problem, answer)`, each drawing `a` and `b` from 1 to 10 the same way as module 2\'s lessons.', id: 'Bangun list `n` pasangan `(soal, jawaban)`, masing-masing mengambil `a` dan `b` dari 1 sampai 10 seperti pada pelajaran modul 2.' },
          { en: 'Print every `problem` first, one per line, then every `answer`, one per line.', id: 'Cetak semua `soal` dulu, satu per baris, lalu semua `jawaban`, satu per baris.' },
        ],
        starter: 'import random\nn = int(input())\ns = int(input())\nrandom.seed(s)\n',
        tests: [
          { name: { en: 'n=3, s=1', id: 'n=3, s=1' }, stdin: ['3', '1'], expectOutput: '3 + 10 = ?\n2 + 5 = ?\n2 + 8 = ?\n13\n7\n10' },
          { name: { en: 'n=2, s=5', id: 'n=2, s=5' }, stdin: ['2', '5'], expectOutput: '10 + 5 = ?\n6 + 9 = ?\n15\n15' },
          { name: { en: 'n=1, s=9', id: 'n=1, s=9' }, stdin: ['1', '9'], expectOutput: '8 + 10 = ?\n18' },
          { name: { en: 'n=4, s=2', id: 'n=4, s=2' }, stdin: ['4', '2'], expectOutput: '1 + 2 = ?\n2 + 6 = ?\n3 + 5 = ?\n5 + 10 = ?\n3\n8\n8\n15' },
        ],
        hints: [
          { en: 'Two separate loops over the same pairs list — one printing problem, one printing answer.', id: 'Dua perulangan terpisah atas list paket yang sama — satu mencetak soal, satu mencetak jawaban.' },
        ],
        solution: {
          en: 'import random\nn = int(input())\ns = int(input())\nrandom.seed(s)\npairs = []\nfor i in range(n):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    pairs.append((f"{a} + {b} = ?", a + b))\nfor problem, answer in pairs:\n    print(problem)\nfor problem, answer in pairs:\n    print(answer)',
          id: 'import random\nn = int(input())\ns = int(input())\nrandom.seed(s)\npaket = []\nfor i in range(n):\n    a = random.randint(1, 10)\n    b = random.randint(1, 10)\n    paket.append((f"{a} + {b} = ?", a + b))\nfor soal, jawaban in paket:\n    print(soal)\nfor soal, jawaban in paket:\n    print(jawaban)',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------- 2.2 automatic grading */
    {
      id: 'pymed-m2-s2',
      title: { en: 'Automatic Grading', id: 'Penilai Otomatis' },
      summary: {
        en: 'Match a student\'s answers against the key, count what is right, and say so — the other half of a worksheet.',
        id: 'Cocokkan jawaban siswa dengan kuncinya, hitung yang benar, dan nyatakan itu — separuh lain dari sebuah lembar kerja.',
      },
      lessons: [
        {
          id: 'pymed-m2-s2-l1',
          title: { en: 'Matching Answers to a Key', id: 'Mencocokkan Jawaban dengan Kunci' },
          goal: { en: 'Compare two lists position by position.', id: 'Membandingkan dua list posisi demi posisi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'zip() walks two lists together', id: 'zip() berjalan menyusuri dua list bersamaan' },
              body: {
                en: '`zip(key, answers)` pairs up the first items from each list, then the second, and so on — reading both at once instead of tracking an index by hand.',
                id: '`zip(kunci, jawaban)` memasangkan unsur pertama dari tiap list, lalu yang kedua, dan seterusnya — membaca keduanya sekaligus alih-alih melacak indeks secara manual.',
              },
              code: {
                en: 'key = [5, 12, 7]\nanswers = [5, 10, 7]\ncorrect = 0\nfor k, a in zip(key, answers):\n    if k == a:\n        correct += 1\nprint(correct)',
                id: 'kunci = [5, 12, 7]\njawaban = [5, 10, 7]\nbenar = 0\nfor k, j in zip(kunci, jawaban):\n    if k == j:\n        benar += 1\nprint(benar)',
              },
              output: '2',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A count becomes a percentage', id: 'Hitungan menjadi persentase' },
              body: {
                en: 'A raw count of 2 out of 3 says less than "66.7%" does. Dividing by the total and multiplying by 100 turns a count into the number everyone actually reads on a graded worksheet.',
                id: 'Hitungan mentah 2 dari 3 mengatakan lebih sedikit daripada "66.7%". Membagi dengan totalnya lalu mengalikan 100 mengubah hitungan menjadi angka yang sungguh dibaca orang di lembar kerja yang sudah dinilai.',
              },
              code: {
                en: 'correct = 2\ntotal = 3\nscore = correct / total * 100\nprint(round(score, 1))',
                id: 'benar = 2\ntotal = 3\nskor = benar / total * 100\nprint(round(skor, 1))',
              },
              output: '66.7',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'key and answers each have 3 items, but zip is accidentally given a key with only 2. What happens?',
                id: 'kunci dan jawaban masing-masing punya 3 unsur, tapi zip tak sengaja diberi kunci dengan hanya 2 unsur. Apa yang terjadi?',
              },
              options: [
                { en: 'zip stops at the shorter list — only 2 pairs are checked', id: 'zip berhenti di list yang lebih pendek — hanya 2 pasangan yang diperiksa' },
                { en: 'It raises an error immediately', id: 'Ia langsung melempar galat' },
                { en: 'The missing spot is filled with None', id: 'Tempat yang hilang diisi None' },
                { en: 'It loops through all 3 anyway', id: 'Tetap mengulang ketiganya' },
              ],
              answer: 0,
              explain: {
                en: 'zip pairs items up only as far as the shorter sequence goes, then simply stops — no error, no filling in gaps.',
                id: 'zip memasangkan unsurnya hanya sejauh urutan yang lebih pendek, lalu sekadar berhenti — tanpa galat, tanpa mengisi kekosongan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Count how many pairs are NOT equal.',
                id: 'Hitung berapa pasangan yang TIDAK sama.',
              },
              template: {
                en: 'key = [1, 2, 3]\nanswers = [1, 0, 3]\nwrong = 0\nfor k, a in zip(key, answers):\n    if k ___ a:\n        wrong += 1\nprint(wrong)',
                id: 'kunci = [1, 2, 3]\njawaban = [1, 0, 3]\nsalah = 0\nfor k, j in zip(kunci, jawaban):\n    if k ___ j:\n        salah += 1\nprint(salah)',
              },
              blanks: ['!='],
              explain: {
                en: '!= is "not equal" — the mirror image of the == check from the concept above.',
                id: '!= artinya "tidak sama" — kebalikan dari pemeriksaan == pada konsep di atas.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program computing a percentage score from 4 correct out of 5.',
                id: 'Susun program yang menghitung skor persentase dari 4 benar dari 5.',
              },
              lines: {
                en: ['correct = 4', 'total = 5', 'score = correct / total * 100', 'print(round(score, 1))'],
                id: ['benar = 4', 'total = 5', 'skor = benar / total * 100', 'print(round(skor, 1))'],
              },
              explain: {
                en: 'Division has to happen before multiplying by 100, exactly as the concept above did it.',
                id: 'Pembagiannya harus terjadi sebelum dikalikan 100, persis seperti pada konsep di atas.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `n`, then `n` key answers, then `n` student answers (all whole numbers, one per line). Print how many match.',
                id: 'Baca `n`, lalu `n` jawaban kunci, lalu `n` jawaban siswa (semua bilangan bulat, satu per baris). Cetak berapa yang cocok.',
              },
              starter: {
                en: 'n = int(input())\nkey = [int(input()) for _ in range(n)]\nanswers = [int(input()) for _ in range(n)]\n',
                id: 'n = int(input())\nkunci = [int(input()) for _ in range(n)]\njawaban = [int(input()) for _ in range(n)]\n',
              },
              tests: [
                { name: { en: '2 of 3 correct', id: '2 dari 3 benar' }, stdin: ['3', '5', '12', '7', '5', '10', '7'], expectOutput: '2' },
                { name: { en: 'all correct', id: 'semua benar' }, stdin: ['2', '1', '1', '1', '1'], expectOutput: '2' },
                { name: { en: 'none correct', id: 'tak ada yang benar' }, stdin: ['2', '1', '1', '2', '2'], expectOutput: '0' },
                { name: { en: '2 of 4 correct', id: '2 dari 4 benar' }, stdin: ['4', '1', '2', '3', '4', '1', '0', '3', '0'], expectOutput: '2' },
              ],
              hints: [
                { en: 'Exactly the zip loop from the concept above — this only adds reading the two lists first.', id: 'Persis perulangan zip dari konsep di atas — ini cuma menambahkan pembacaan kedua listnya lebih dulu.' },
              ],
              solution: {
                en: 'n = int(input())\nkey = [int(input()) for _ in range(n)]\nanswers = [int(input()) for _ in range(n)]\ncorrect = 0\nfor k, a in zip(key, answers):\n    if k == a:\n        correct += 1\nprint(correct)',
                id: 'n = int(input())\nkunci = [int(input()) for _ in range(n)]\njawaban = [int(input()) for _ in range(n)]\nbenar = 0\nfor k, j in zip(kunci, jawaban):\n    if k == j:\n        benar += 1\nprint(benar)',
              },
            },
          ],
        },
        {
          id: 'pymed-m2-s2-l2',
          title: { en: 'Score and Feedback', id: 'Skor dan Umpan Balik' },
          goal: { en: 'Report both a per-item result and a final score.', id: 'Melaporkan hasil per-butir sekaligus skor akhir.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A verdict for every item', id: 'Vonis untuk tiap butir' },
              body: {
                en: 'A single total count is honest but not useful for reviewing — a student wants to know *which* answers were wrong, not just how many. The same zip loop, printing instead of counting, gives that.',
                id: 'Satu hitungan total memang jujur tapi tak berguna untuk ditinjau — siswa ingin tahu *soal mana* yang salah, bukan cuma berapa banyak. Perulangan zip yang sama, mencetak alih-alih menghitung, memberikan itu.',
              },
              code: {
                en: 'key = [5, 12, 7]\nanswers = [5, 10, 7]\nfor k, a in zip(key, answers):\n    if k == a:\n        print("Correct")\n    else:\n        print("Wrong")',
                id: 'kunci = [5, 12, 7]\njawaban = [5, 10, 7]\nfor k, j in zip(kunci, jawaban):\n    if k == j:\n        print("Benar")\n    else:\n        print("Salah")',
              },
              output: { en: 'Correct\nWrong\nCorrect', id: 'Benar\nSalah\nBenar' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Feedback and a count, together', id: 'Umpan balik dan hitungan, sekaligus' },
              body: {
                en: 'Nothing stops both from happening in the same loop — print the per-item verdict, and still add to a running total, then report the score once the loop ends.',
                id: 'Tak ada yang mencegah keduanya terjadi di perulangan yang sama — cetak vonis per-butir, dan tetap tambahkan ke total berjalan, lalu laporkan skornya begitu perulangannya selesai.',
              },
              code: {
                en: 'key = [5, 12, 7]\nanswers = [5, 10, 7]\ncorrect = 0\nfor k, a in zip(key, answers):\n    if k == a:\n        correct += 1\nscore = correct / len(key) * 100\nprint(round(score, 1))',
                id: 'kunci = [5, 12, 7]\njawaban = [5, 10, 7]\nbenar = 0\nfor k, j in zip(kunci, jawaban):\n    if k == j:\n        benar += 1\nskor = benar / len(kunci) * 100\nprint(round(skor, 1))',
              },
              output: '66.7',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The score line uses len(key) rather than a fixed number like 3. Why?',
                id: 'Baris skornya memakai len(kunci), bukan angka tetap seperti 3. Mengapa?',
              },
              options: [
                { en: 'So the same code works for any worksheet size, not just this one', id: 'Supaya kode yang sama bekerja untuk ukuran lembar kerja mana pun, tak hanya yang ini' },
                { en: 'len(key) runs faster than writing 3', id: 'len(kunci) berjalan lebih cepat daripada menulis 3' },
                { en: 'Because key might contain duplicates', id: 'Karena kunci mungkin berisi duplikat' },
                { en: 'It makes no difference either way', id: 'Tak ada bedanya baik dengan cara mana pun' },
              ],
              answer: 0,
              explain: {
                en: 'Hard-coding 3 would silently give the wrong score the moment the worksheet has a different number of problems.',
                id: 'Mengeraskan angka 3 akan diam-diam memberi skor yang salah begitu lembar kerjanya punya jumlah soal yang berbeda.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Print the score as a percentage.',
                id: 'Cetak skornya sebagai persentase.',
              },
              template: {
                en: 'correct = 3\ntotal = 4\nscore = correct / total ___ 100\nprint(round(score, 1))',
                id: 'benar = 3\ntotal = 4\nskor = benar / total ___ 100\nprint(round(skor, 1))',
              },
              blanks: ['*'],
              explain: {
                en: 'A fraction becomes a percentage by multiplying by 100.',
                id: 'Pecahan menjadi persentase dengan mengalikannya dengan 100.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a loop printing Correct/Wrong for two fixed lists.',
                id: 'Susun perulangan yang mencetak Benar/Salah untuk dua list tetap.',
              },
              lines: {
                en: [
                  'key = [10, 20, 30]',
                  'answers = [10, 0, 30]',
                  'for k, a in zip(key, answers):',
                  '    if k == a:',
                  '        print("Correct")',
                  '    else:',
                  '        print("Wrong")',
                ],
                id: [
                  'kunci = [10, 20, 30]',
                  'jawaban = [10, 0, 30]',
                  'for k, j in zip(kunci, jawaban):',
                  '    if k == j:',
                  '        print("Benar")',
                  '    else:',
                  '        print("Salah")',
                ],
              },
              explain: {
                en: 'Same shape as the lesson\'s first concept — the if/else decides which word to print.',
                id: 'Bentuknya sama seperti konsep pertama pelajaran ini — if/else menentukan kata mana yang dicetak.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `n`, then `n` key answers, then `n` student answers. Print `Correct` or `Wrong` for each pair, then the score as a percentage rounded to 1 decimal place.',
                id: 'Baca `n`, lalu `n` jawaban kunci, lalu `n` jawaban siswa. Cetak `Benar` atau `Salah` untuk tiap pasangan, lalu skornya sebagai persentase dibulatkan ke 1 angka desimal.',
              },
              starter: {
                en: 'n = int(input())\nkey = [int(input()) for _ in range(n)]\nanswers = [int(input()) for _ in range(n)]\n',
                id: 'n = int(input())\nkunci = [int(input()) for _ in range(n)]\njawaban = [int(input()) for _ in range(n)]\n',
              },
              tests: {
                en: [
                  { name: { en: '2 of 3', id: '2 dari 3' }, stdin: ['3', '5', '12', '7', '5', '10', '7'], expectOutput: 'Correct\nWrong\nCorrect\n66.7' },
                  { name: { en: 'all correct', id: 'semua benar' }, stdin: ['2', '10', '20', '10', '20'], expectOutput: 'Correct\nCorrect\n100.0' },
                  { name: { en: 'none correct', id: 'tak ada yang benar' }, stdin: ['2', '10', '20', '1', '2'], expectOutput: 'Wrong\nWrong\n0.0' },
                  { name: { en: '3 of 5', id: '3 dari 5' }, stdin: ['5', '1', '2', '3', '4', '5', '1', '0', '3', '0', '5'], expectOutput: 'Correct\nWrong\nCorrect\nWrong\nCorrect\n60.0' },
                ],
                id: [
                  { name: { en: '2 of 3', id: '2 dari 3' }, stdin: ['3', '5', '12', '7', '5', '10', '7'], expectOutput: 'Benar\nSalah\nBenar\n66.7' },
                  { name: { en: 'all correct', id: 'semua benar' }, stdin: ['2', '10', '20', '10', '20'], expectOutput: 'Benar\nBenar\n100.0' },
                  { name: { en: 'none correct', id: 'tak ada yang benar' }, stdin: ['2', '10', '20', '1', '2'], expectOutput: 'Salah\nSalah\n0.0' },
                  { name: { en: '3 of 5', id: '3 dari 5' }, stdin: ['5', '1', '2', '3', '4', '5', '1', '0', '3', '0', '5'], expectOutput: 'Benar\nSalah\nBenar\nSalah\nBenar\n60.0' },
                ],
              },
              hints: [
                { en: 'One loop can both print the verdict and add to a running total.', id: 'Satu perulangan bisa mencetak vonis sekaligus menambah total berjalan.' },
              ],
              solution: {
                en: 'n = int(input())\nkey = [int(input()) for _ in range(n)]\nanswers = [int(input()) for _ in range(n)]\ncorrect = 0\nfor k, a in zip(key, answers):\n    if k == a:\n        print("Correct")\n        correct += 1\n    else:\n        print("Wrong")\nscore = correct / n * 100\nprint(round(score, 1))',
                id: 'n = int(input())\nkunci = [int(input()) for _ in range(n)]\njawaban = [int(input()) for _ in range(n)]\nbenar = 0\nfor k, j in zip(kunci, jawaban):\n    if k == j:\n        print("Benar")\n        benar += 1\n    else:\n        print("Salah")\nskor = benar / n * 100\nprint(round(skor, 1))',
              },
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m2-s2-p',
        title: { en: 'Automatic Grader', id: 'Penilai Otomatis' },
        brief: {
          en: 'A finished grading report: per-item feedback, and a clearly labeled final score.',
          id: 'Laporan penilaian yang lengkap: umpan balik per-butir, dan skor akhir berlabel jelas.',
        },
        requirements: [
          { en: 'Read `n`, then `n` key answers, then `n` student answers.', id: 'Baca `n`, lalu `n` jawaban kunci, lalu `n` jawaban siswa.' },
          { en: 'Print `Correct` or `Wrong` for each pair, in order.', id: 'Cetak `Benar` atau `Salah` untuk tiap pasangan, berurutan.' },
          { en: 'Print a final line: `Score: X.X` — the percentage correct, rounded to 1 decimal place.', id: 'Cetak baris akhir: `Skor: X.X` — persentase yang benar, dibulatkan ke 1 angka desimal.' },
        ],
        starter: {
          en: 'n = int(input())\nkey = [int(input()) for _ in range(n)]\nanswers = [int(input()) for _ in range(n)]\n',
          id: 'n = int(input())\nkunci = [int(input()) for _ in range(n)]\njawaban = [int(input()) for _ in range(n)]\n',
        },
        tests: {
          en: [
            { name: { en: '2 of 3', id: '2 dari 3' }, stdin: ['3', '5', '12', '7', '5', '10', '7'], expectOutput: 'Correct\nWrong\nCorrect\nScore: 66.7' },
            { name: { en: 'all correct', id: 'semua benar' }, stdin: ['2', '10', '20', '10', '20'], expectOutput: 'Correct\nCorrect\nScore: 100.0' },
            { name: { en: 'none correct', id: 'tak ada yang benar' }, stdin: ['2', '10', '20', '1', '2'], expectOutput: 'Wrong\nWrong\nScore: 0.0' },
            { name: { en: '3 of 5', id: '3 dari 5' }, stdin: ['5', '1', '2', '3', '4', '5', '1', '0', '3', '0', '5'], expectOutput: 'Correct\nWrong\nCorrect\nWrong\nCorrect\nScore: 60.0' },
          ],
          id: [
            { name: { en: '2 of 3', id: '2 dari 3' }, stdin: ['3', '5', '12', '7', '5', '10', '7'], expectOutput: 'Benar\nSalah\nBenar\nSkor: 66.7' },
            { name: { en: 'all correct', id: 'semua benar' }, stdin: ['2', '10', '20', '10', '20'], expectOutput: 'Benar\nBenar\nSkor: 100.0' },
            { name: { en: 'none correct', id: 'tak ada yang benar' }, stdin: ['2', '10', '20', '1', '2'], expectOutput: 'Salah\nSalah\nSkor: 0.0' },
            { name: { en: '3 of 5', id: '3 dari 5' }, stdin: ['5', '1', '2', '3', '4', '5', '1', '0', '3', '0', '5'], expectOutput: 'Benar\nSalah\nBenar\nSalah\nBenar\nSkor: 60.0' },
          ],
        },
        hints: [
          { en: 'Same as the lesson\'s own exercise, with the final line given a "Score: " label via an f-string.', id: 'Sama seperti latihan di pelajarannya, dengan baris akhirnya diberi label "Skor: " lewat f-string.' },
        ],
        solution: {
          en: 'n = int(input())\nkey = [int(input()) for _ in range(n)]\nanswers = [int(input()) for _ in range(n)]\ncorrect = 0\nfor k, a in zip(key, answers):\n    if k == a:\n        print("Correct")\n        correct += 1\n    else:\n        print("Wrong")\nscore = correct / n * 100\nprint(f"Score: {round(score, 1)}")',
          id: 'n = int(input())\nkunci = [int(input()) for _ in range(n)]\njawaban = [int(input()) for _ in range(n)]\nbenar = 0\nfor k, j in zip(kunci, jawaban):\n    if k == j:\n        print("Benar")\n        benar += 1\n    else:\n        print("Salah")\nskor = benar / n * 100\nprint(f"Skor: {round(skor, 1)}")',
        },
        xp: 50,
      },
    },
  ],
}
