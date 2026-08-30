import type { Module } from '../types'

/** Module 3 — counted repetition first, then condition-driven repetition. */
export const module3: Module = {
  id: 'py-m3',
  title: { en: 'Repeating Work', id: 'Mengulang Pekerjaan' },
  summary: {
    en: 'Do something many times without writing it many times.',
    id: 'Melakukan sesuatu berkali-kali tanpa menulisnya berkali-kali.',
  },
  submodules: [
    /* ------------------------------------------------------- 3.1 for & range */
    {
      id: 'py-m3-s1',
      title: { en: 'for and range', id: 'for dan range' },
      summary: {
        en: 'Repeat a known number of times, and accumulate a result as you go.',
        id: 'Mengulang sebanyak jumlah yang diketahui, dan mengumpulkan hasil sambil berjalan.',
      },
      lessons: [
        {
          id: 'py-m3-s1-l1',
          title: { en: 'Counting loops', id: 'Perulangan berhitung' },
          goal: { en: 'Repeat a block a fixed number of times.', id: 'Mengulang blok sebanyak jumlah tertentu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'range(n) counts from 0', id: 'range(n) menghitung dari 0' },
              body: {
                en: '`range(5)` gives 0, 1, 2, 3, 4 — five numbers, but the last one is 4, not 5. Counting from zero is the single most surprising thing about programming, and it never stops being useful.',
                id: '`range(5)` memberi 0, 1, 2, 3, 4 — lima angka, tetapi yang terakhir 4, bukan 5. Berhitung dari nol adalah hal paling mengejutkan dalam pemrograman, dan selamanya berguna.',
              },
              code: 'for i in range(5):\n    print(i)',
              output: '0\n1\n2\n3\n4',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Start, stop, step', id: 'Mulai, berhenti, langkah' },
              body: {
                en: '`range(start, stop)` begins where you say and stops *before* `stop`. A third number is the step size.',
                id: '`range(start, stop)` mulai dari yang kamu sebut dan berhenti *sebelum* `stop`. Angka ketiga adalah besar langkahnya.',
              },
              code: 'for n in range(1, 4):\n    print(n)\n\nfor n in range(0, 10, 5):\n    print(n)',
              output: '1\n2\n3\n0\n5',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'How many lines does this print?', id: 'Berapa baris yang dicetak ini?' },
              code: { en: 'for i in range(3):\n    print("hello")', id: 'for i in range(3):\n    print("halo")' },
              options: [
                { en: '3', id: '3' },
                { en: '2', id: '2' },
                { en: '4', id: '4' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: 'range(3) produces 0, 1, 2 — three values, so the body runs three times.',
                id: 'range(3) menghasilkan 0, 1, 2 — tiga nilai, jadi badan loop jalan tiga kali.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Print the numbers 1 to 5, one per line.',
                id: 'Cetak angka 1 sampai 5, satu per baris.',
              },
              template: 'for i in range(___, ___):\n    print(i)',
              blanks: ['1', '6'],
              explain: {
                en: 'The stop value is never reached, so 6 is needed to include 5.',
                id: 'Nilai stop tidak pernah tercapai, jadi 6 dibutuhkan agar 5 ikut tercetak.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Print the even numbers from 2 to 10, one per line.',
                id: 'Cetak bilangan genap dari 2 sampai 10, satu per baris.',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'Prints 2 4 6 8 10', id: 'Mencetak 2 4 6 8 10' },
                  expectOutput: '2\n4\n6\n8\n10',
                },
              ],
              hints: [
                { en: 'A step of 2 skips every other number.', id: 'Langkah 2 melewati tiap angka kedua.' },
                { en: 'range(2, 11, 2) — the stop must be past 10.', id: 'range(2, 11, 2) — nilai stop harus melewati 10.' },
              ],
              solution: 'for n in range(2, 11, 2):\n    print(n)',
            },
          ],
        },
        {
          id: 'py-m3-s1-l2',
          title: { en: 'Collecting a result', id: 'Mengumpulkan hasil' },
          goal: { en: 'Build up a total inside a loop.', id: 'Membangun total di dalam loop.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The accumulator pattern', id: 'Pola akumulator' },
              body: {
                en: 'Start a variable at 0 **before** the loop, add to it **inside** the loop, print it **after**. Those three positions matter more than the arithmetic. `total += n` is short for `total = total + n`.',
                id: 'Mulai variabel dari 0 **sebelum** loop, tambahkan **di dalam** loop, cetak **sesudahnya**. Ketiga posisi itu lebih penting daripada hitungannya. `total += n` adalah singkatan dari `total = total + n`.',
              },
              code: 'total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)',
              output: '10',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Where the print goes', id: 'Di mana print diletakkan' },
              body: {
                en: 'Move the print inside the loop and you see every step instead of the answer. Both are useful — just not the same thing.',
                id: 'Pindahkan print ke dalam loop dan kamu melihat tiap langkah, bukan jawabannya. Keduanya berguna — hanya saja tidak sama.',
              },
              code: 'total = 0\nfor n in range(1, 4):\n    total += n\n    print(total)',
              output: '1\n3\n6',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: {
                en: 'result = 1\nfor i in range(1, 4):\n    result *= i\nprint(result)',
                id: 'hasil = 1\nfor i in range(1, 4):\n    hasil *= i\nprint(hasil)',
              },
              options: [
                { en: '6', id: '6' },
                { en: '3', id: '3' },
                { en: '0', id: '0' },
                { en: '9', id: '9' },
              ],
              answer: 0,
              explain: {
                en: '1 × 1 × 2 × 3 = 6. A multiplying accumulator must start at 1, not 0.',
                id: '1 × 1 × 2 × 3 = 6. Akumulator perkalian harus dimulai dari 1, bukan 0.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that prints the sum 1+2+…+10.',
                id: 'Susun program yang mencetak jumlah 1+2+…+10.',
              },
              lines: ['total = 0', 'for n in range(1, 11):', '    total += n', 'print(total)'],
              explain: {
                en: 'The accumulator is created before the loop and printed after it ends.',
                id: 'Akumulator dibuat sebelum loop dan dicetak setelah loop selesai.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read a whole number `n`, then print the sum of 1 to n. For 5 that is 15.',
                id: 'Baca bilangan bulat `n`, lalu cetak jumlah 1 sampai n. Untuk 5 hasilnya 15.',
              },
              starter: 'n = int(input("n: "))\n',
              tests: [
                { name: { en: '5 → 15', id: '5 → 15' }, stdin: ['5'], expectOutput: '15' },
                { name: { en: '1 → 1', id: '1 → 1' }, stdin: ['1'], expectOutput: '1' },
                { name: { en: '100 → 5050', id: '100 → 5050' }, stdin: ['100'], expectOutput: '5050' },
              ],
              hints: [
                { en: 'Start total at 0 before the loop.', id: 'Mulai total dari 0 sebelum loop.' },
                { en: 'range(1, n + 1) so n itself is included.', id: 'range(1, n + 1) agar n ikut terhitung.' },
                { en: 'Print after the loop, not inside it.', id: 'Cetak setelah loop, bukan di dalamnya.' },
              ],
              solution: 'n = int(input("n: "))\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)',
            },
          ],
        },
      ],
      project: {
        id: 'py-m3-s1-p',
        title: { en: 'Times table', id: 'Tabel perkalian' },
        brief: {
          en: 'Print the full times table for a number the user chooses.',
          id: 'Cetak tabel perkalian lengkap untuk angka yang dipilih pengguna.',
        },
        requirements: [
          { en: 'Read one whole number.', id: 'Baca satu bilangan bulat.' },
          { en: 'Print ten lines, from ×1 to ×10.', id: 'Cetak sepuluh baris, dari ×1 sampai ×10.' },
          { en: 'Each line reads `7 x 3 = 21`.', id: 'Tiap baris berbentuk `7 x 3 = 21`.' },
        ],
        starter: { en: '# Times table\nn = int(input("Number: "))\n', id: '# Tabel perkalian\nn = int(input("Angka: "))\n' },
        tests: [
          {
            name: { en: 'Table of 7', id: 'Tabel 7' },
            stdin: ['7'],
            expectOutput:
              '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70',
          },
          {
            name: { en: 'Table of 1 starts at 1 x 1 = 1', id: 'Tabel 1 dimulai 1 x 1 = 1' },
            stdin: ['1'],
            expectOutput:
              '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10',
          },
        ],
        hints: [
          { en: 'Loop the multiplier from 1 to 10.', id: 'Ulang penggandanya dari 1 sampai 10.' },
          { en: 'An f-string can hold a calculation: {n * i}', id: 'f-string bisa memuat perhitungan: {n * i}' },
          { en: 'print(f"{n} x {i} = {n * i}")', id: 'print(f"{n} x {i} = {n * i}")' },
        ],
        solution: {
          en: 'n = int(input("Number: "))\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")',
          id: 'n = int(input("Angka: "))\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------------ 3.2 while & flow */
    {
      id: 'py-m3-s2',
      title: { en: 'while and Loop Control', id: 'while dan Kendali Loop' },
      summary: {
        en: 'Repeat until something becomes true, and leave early when you need to.',
        id: 'Mengulang sampai sesuatu terpenuhi, dan keluar lebih awal bila perlu.',
      },
      lessons: [
        {
          id: 'py-m3-s2-l1',
          title: { en: 'Looping until', id: 'Mengulang sampai' },
          goal: { en: 'Repeat while a condition holds.', id: 'Mengulang selama sebuah kondisi terpenuhi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'while checks first', id: 'while memeriksa lebih dulu' },
              body: {
                en: 'Use `for` when you know how many times; use `while` when you only know when to stop. Something inside the loop must move the condition toward False, or it runs forever.',
                id: 'Pakai `for` bila kamu tahu berapa kali; pakai `while` bila kamu hanya tahu kapan berhenti. Sesuatu di dalam loop harus menggerakkan kondisi menuju False, atau loop berjalan selamanya.',
              },
              code: {
                en: 'remaining = 3\nwhile remaining > 0:\n    print(f"remaining {remaining}")\n    remaining -= 1\nprint("done")',
                id: 'sisa = 3\nwhile sisa > 0:\n    print(f"sisa {sisa}")\n    sisa -= 1\nprint("habis")',
              },
              output: { en: 'remaining 3\nremaining 2\nremaining 1\ndone', id: 'sisa 3\nsisa 2\nsisa 1\nhabis' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The loop that never ends', id: 'Loop yang tak pernah berakhir' },
              body: {
                en: 'Forget the `-= 1` and `sisa` stays 3 forever. If your program hangs, this is almost always why: the condition never changes.',
                id: 'Lupakan `-= 1` dan `sisa` akan tetap 3 selamanya. Kalau programmu menggantung, hampir selalu inilah sebabnya: kondisinya tidak pernah berubah.',
              },
              code: {
                en: '# do NOT run this\nremaining = 3\nwhile remaining > 0:\n    print("hello")',
                id: '# JANGAN dijalankan\nsisa = 3\nwhile sisa > 0:\n    print("halo")',
              },
              output: { en: 'hello\nhello\nhello\n…never stops', id: 'halo\nhalo\nhalo\n…tak pernah berhenti' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'How many times does the body run?', id: 'Berapa kali badan loop dijalankan?' },
              code: 'i = 0\nwhile i < 3:\n    i += 1\n    print(i)',
              options: [
                { en: '3', id: '3' },
                { en: '2', id: '2' },
                { en: '4', id: '4' },
                { en: 'Forever', id: 'Selamanya' },
              ],
              answer: 0,
              explain: {
                en: 'i takes the values 0, 1, 2 at the check, so the body runs three times and prints 1, 2, 3.',
                id: 'i bernilai 0, 1, 2 saat diperiksa, jadi badan loop jalan tiga kali dan mencetak 1, 2, 3.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Count down from 5 to 1.',
                id: 'Hitung mundur dari 5 ke 1.',
              },
              template: 'n = 5\nwhile n ___ 0:\n    print(n)\n    n ___ 1',
              blanks: ['>', '-='],
              explain: {
                en: 'The condition stops at 0, and n must shrink each round or the loop never ends.',
                id: 'Kondisi berhenti di 0, dan n harus mengecil tiap putaran atau loop tak pernah berakhir.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read a whole number and print how many times you can halve it (with `//`) before it reaches 0. For 8 the answer is 4.',
                id: 'Baca bilangan bulat lalu cetak berapa kali ia bisa dibagi dua (dengan `//`) sebelum mencapai 0. Untuk 8 jawabannya 4.',
              },
              starter: { en: 'n = int(input("Number: "))\nsteps = 0\n', id: 'n = int(input("Angka: "))\nlangkah = 0\n' },
              tests: [
                { name: { en: '8 → 4', id: '8 → 4' }, stdin: ['8'], expectOutput: '4' },
                { name: { en: '1 → 1', id: '1 → 1' }, stdin: ['1'], expectOutput: '1' },
                { name: { en: '0 → 0', id: '0 → 0' }, stdin: ['0'], expectOutput: '0' },
                { name: { en: '100 → 7', id: '100 → 7' }, stdin: ['100'], expectOutput: '7' },
              ],
              hints: [
                { en: 'Keep going while n is bigger than 0.', id: 'Terus jalan selama n lebih besar dari 0.' },
                { en: 'Inside: n = n // 2 and steps += 1', id: 'Di dalam: n = n // 2 dan langkah += 1' },
                { en: 'Print steps after the loop.', id: 'Cetak langkah setelah loop.' },
              ],
              solution: {
                en: 'n = int(input("Number: "))\nsteps = 0\nwhile n > 0:\n    n = n // 2\n    steps += 1\nprint(steps)',
                id: 'n = int(input("Angka: "))\nlangkah = 0\nwhile n > 0:\n    n = n // 2\n    langkah += 1\nprint(langkah)',
              },
            },
          ],
        },
        {
          id: 'py-m3-s2-l2',
          title: { en: 'break and continue', id: 'break dan continue' },
          goal: { en: 'Leave a loop early, or skip one round.', id: 'Keluar loop lebih awal, atau lewati satu putaran.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'break leaves immediately', id: 'break langsung keluar' },
              body: {
                en: '`break` stops the whole loop on the spot. Everything after it in that round is skipped, and the loop does not run again.',
                id: '`break` menghentikan seluruh loop saat itu juga. Semua sisanya di putaran itu dilewati, dan loop tidak diulang lagi.',
              },
              code: 'for n in range(1, 10):\n    if n == 4:\n        break\n    print(n)',
              output: '1\n2\n3',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'continue skips one round', id: 'continue melewati satu putaran' },
              body: {
                en: '`continue` jumps straight to the next round. The loop keeps going — only the rest of *this* round is skipped.',
                id: '`continue` melompat langsung ke putaran berikutnya. Loop tetap berjalan — hanya sisa putaran *ini* yang dilewati.',
              },
              code: 'for n in range(1, 6):\n    if n % 2 == 0:\n        continue\n    print(n)',
              output: '1\n3\n5',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'for i in range(5):\n    if i == 2:\n        break\n    print(i)',
              options: [
                { en: '0 then 1', id: '0 lalu 1' },
                { en: '0, 1, 3, 4', id: '0, 1, 3, 4' },
                { en: '0, 1, 2', id: '0, 1, 2' },
                { en: 'Nothing', id: 'Tidak ada' },
              ],
              answer: 0,
              explain: {
                en: 'At i = 2 the loop stops entirely, so only 0 and 1 were printed.',
                id: 'Saat i = 2 loop berhenti total, jadi hanya 0 dan 1 yang tercetak.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Swap the break for continue in the code above. What is printed then?',
                id: 'Ganti break menjadi continue pada kode di atas. Apa yang dicetak?',
              },
              options: [
                { en: '0, 1, 3, 4', id: '0, 1, 3, 4' },
                { en: '0 then 1', id: '0 lalu 1' },
                { en: '0, 1, 2, 3, 4', id: '0, 1, 2, 3, 4' },
                { en: '2 only', id: 'Hanya 2' },
              ],
              answer: 0,
              explain: {
                en: 'Only the round where i is 2 is skipped; the loop finishes the rest.',
                id: 'Hanya putaran ketika i bernilai 2 yang dilewati; loop menyelesaikan sisanya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read numbers one per line until the user types `0`, then print how many numbers were entered before the 0.',
                id: 'Baca angka satu per baris sampai pengguna mengetik `0`, lalu cetak berapa angka yang dimasukkan sebelum 0.',
              },
              starter: {
                en: 'count = 0\nwhile True:\n    n = int(input("Number (0 to finish): "))\n',
                id: 'jumlah = 0\nwhile True:\n    n = int(input("Angka (0 untuk selesai): "))\n',
              },
              tests: [
                { name: { en: '3 numbers then 0 → 3', id: '3 angka lalu 0 → 3' }, stdin: ['5', '9', '1', '0'], expectOutput: '3' },
                { name: { en: 'Immediate 0 → 0', id: 'Langsung 0 → 0' }, stdin: ['0'], expectOutput: '0' },
              ],
              hints: [
                { en: '`while True:` loops forever — break is what ends it.', id: '`while True:` mengulang selamanya — break-lah yang mengakhirinya.' },
                { en: 'Check for 0 *before* counting, or the 0 gets counted too.', id: 'Periksa 0 *sebelum* menghitung, atau 0 ikut terhitung.' },
                { en: 'if n == 0: break — then count += 1', id: 'if n == 0: break — lalu jumlah += 1' },
              ],
              solution: {
                en: 'count = 0\nwhile True:\n    n = int(input("Number (0 to finish): "))\n    if n == 0:\n        break\n    count += 1\nprint(count)',
                id: 'jumlah = 0\nwhile True:\n    n = int(input("Angka (0 untuk selesai): "))\n    if n == 0:\n        break\n    jumlah += 1\nprint(jumlah)',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m3-s2-p',
        title: { en: 'Guess the number', id: 'Tebak angka' },
        brief: {
          en: 'The secret is 42. Keep asking until the player gets it, guiding them each time.',
          id: 'Angka rahasianya 42. Terus tanya sampai pemain menebaknya, sambil memberi arahan tiap kali.',
        },
        requirements: [
          { en: 'Loop until the guess equals 42.', id: 'Ulang sampai tebakan sama dengan 42.' },
          { en: 'Too low → print `Too low`.', id: 'Terlalu kecil → cetak `Terlalu kecil`.' },
          { en: 'Too high → print `Too high`.', id: 'Terlalu besar → cetak `Terlalu besar`.' },
          { en: 'Correct → print `Correct! You guessed it in N tries` and stop.', id: 'Benar → cetak `Benar! Kamu menebak dalam N percobaan` lalu berhenti.' },
        ],
        starter: { en: '# Guess the number\nsecret = 42\nattempts = 0\n', id: '# Tebak angka\nrahasia = 42\npercobaan = 0\n' },
        tests: {
          en: [
            {
              name: { en: 'Three guesses: 10, 50, 42', id: 'Tiga tebakan: 10, 50, 42' },
              stdin: ['10', '50', '42'],
              expectOutput: 'Too low\nToo high\nCorrect! You guessed it in 3 tries',
            },
            {
              name: { en: 'First guess correct', id: 'Tebakan pertama benar' },
              stdin: ['42'],
              expectOutput: 'Correct! You guessed it in 1 tries',
            },
            {
              name: { en: 'Two high guesses first', id: 'Dua tebakan terlalu besar dulu' },
              stdin: ['99', '43', '42'],
              expectOutput: 'Too high\nToo high\nCorrect! You guessed it in 3 tries',
            },
          ],
          id: [
            {
              name: { en: 'Three guesses: 10, 50, 42', id: 'Tiga tebakan: 10, 50, 42' },
              stdin: ['10', '50', '42'],
              expectOutput: 'Terlalu kecil\nTerlalu besar\nBenar! Kamu menebak dalam 3 percobaan',
            },
            {
              name: { en: 'First guess correct', id: 'Tebakan pertama benar' },
              stdin: ['42'],
              expectOutput: 'Benar! Kamu menebak dalam 1 percobaan',
            },
            {
              name: { en: 'Two high guesses first', id: 'Dua tebakan terlalu besar dulu' },
              stdin: ['99', '43', '42'],
              expectOutput: 'Terlalu besar\nTerlalu besar\nBenar! Kamu menebak dalam 3 percobaan',
            },
          ],
        },
        hints: [
          { en: 'Count every guess, including the correct one.', id: 'Hitung setiap tebakan, termasuk yang benar.' },
          { en: '`while True:` with a `break` after the correct message is the cleanest shape.', id: '`while True:` dengan `break` setelah pesan benar adalah bentuk paling rapi.' },
          {
            en: 'if guess < secret: … elif guess > secret: … else: print + break',
            id: 'if tebak < rahasia: … elif tebak > rahasia: … else: print + break',
          },
        ],
        solution: {
          en: 'secret = 42\nattempts = 0\nwhile True:\n    guess = int(input("Guess: "))\n    attempts += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\n    else:\n        print(f"Correct! You guessed it in {attempts} tries")\n        break',
          id: 'rahasia = 42\npercobaan = 0\nwhile True:\n    tebak = int(input("Tebakan: "))\n    percobaan += 1\n    if tebak < rahasia:\n        print("Terlalu kecil")\n    elif tebak > rahasia:\n        print("Terlalu besar")\n    else:\n        print(f"Benar! Kamu menebak dalam {percobaan} percobaan")\n        break',
        },
        xp: 50,
      },
    },
  ],
}
