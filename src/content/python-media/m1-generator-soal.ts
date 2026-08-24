import type { Module } from '../types'

/** Module 1 — random.randint/choice/shuffle, anchored on random.seed() so a
 *  generated problem can be reproduced and checked, not just produced. */
export const module1: Module = {
  id: 'pymed-m1',
  title: { en: 'Problem Generators', id: 'Generator Soal' },
  summary: {
    en: 'Stop writing one problem at a time — write a program that manufactures a fresh batch every time it runs, with an answer key that never gets lost.',
    id: 'Berhenti menulis soal satu-satu — tulis program yang membuat sekumpulan soal baru tiap kali dijalankan, dengan kunci jawaban yang tak pernah hilang.',
  },
  submodules: [
    /* -------------------------------------------- 1.1 reproducible randomness */
    {
      id: 'pymed-m1-s1',
      title: { en: 'Random Numbers You Can Reproduce', id: 'Angka Acak yang Bisa Diulang' },
      summary: {
        en: 'random.randint and random.choice make the variety; random.seed makes it possible to check.',
        id: 'random.randint dan random.choice membuat variasinya; random.seed membuatnya bisa diperiksa.',
      },
      lessons: [
        {
          id: 'pymed-m1-s1-l1',
          title: { en: 'random.randint and seed', id: 'random.randint dan seed' },
          goal: { en: 'Generate a random number, then make it reproducible.', id: 'Menghasilkan angka acak, lalu membuatnya bisa diulang.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A number, different nearly every time', id: 'Angka, berbeda nyaris tiap kali' },
              body: {
                en: '`random.randint(a, b)` picks a whole number from `a` to `b`, both ends included — a different one almost every time it is called. Good for making a problem vary; bad for testing code, since the answer cannot be known ahead of time.',
                id: '`random.randint(a, b)` memilih satu bilangan bulat dari `a` sampai `b`, kedua ujungnya termasuk — nyaris selalu berbeda tiap kali dipanggil. Bagus untuk membuat soal bervariasi; buruk untuk menguji kode, karena jawabannya tak bisa diketahui lebih dulu.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'seed makes it reproducible', id: 'seed membuatnya bisa diulang' },
              body: {
                en: '`random.seed(n)` resets the random generator so that everything drawn afterward follows the same sequence, every time, for the same `n`. This is not only a testing trick — it is how a generated problem can be recreated exactly, later, for grading.',
                id: '`random.seed(n)` menata ulang generator acaknya supaya semua yang diambil setelahnya mengikuti urutan yang sama, tiap kali, untuk `n` yang sama. Ini bukan cuma trik menguji — ini caranya sebuah soal yang dihasilkan bisa dibuat ulang persis sama nanti, untuk dikoreksi.',
              },
              code: 'import random\nrandom.seed(1)\nprint(random.randint(1, 100))\nprint(random.randint(1, 100))',
              output: '18\n73',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'random.seed(5) is set, then random.randint(1, 10) is called once. This is real, deterministic Python — the value is fixed for this seed.',
                id: 'random.seed(5) diterapkan, lalu random.randint(1, 10) dipanggil sekali. Ini Python sungguhan dan deterministik — nilainya tetap untuk seed ini.',
              },
              code: 'import random\nrandom.seed(5)\nprint(random.randint(1, 10))',
              options: [
                { en: '10', id: '10' },
                { en: '5', id: '5' },
                { en: '1', id: '1' },
                { en: 'A different number every time this runs', id: 'Angka berbeda tiap kali ini dijalankan' },
              ],
              answer: 0,
              explain: {
                en: 'Seeded, the sequence is fixed — running this exact code always prints 10.',
                id: 'Dengan seed, urutannya tetap — menjalankan kode persis ini selalu mencetak 10.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Make the two dice rolls below reproducible.',
                id: 'Buat dua lemparan dadu di bawah ini bisa diulang.',
              },
              template: 'import random\nrandom.___(7)\nprint(random.randint(1, 6))\nprint(random.randint(1, 6))',
              blanks: ['seed'],
              explain: {
                en: 'random.seed(7) fixes the sequence that follows it.',
                id: 'random.seed(7) menetapkan urutan yang mengikutinya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that seeds the generator before drawing a number, not after.',
                id: 'Susun program yang men-seed generatornya sebelum mengambil angka, bukan sesudahnya.',
              },
              lines: ['import random', 'random.seed(3)', 'nilai = random.randint(1, 20)', 'print(nilai)'],
              explain: {
                en: 'Seeding after the draw would do nothing for that draw — order matters.',
                id: 'Men-seed setelah pengambilan tidak berpengaruh pada pengambilan itu — urutan penting.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `s`. Seed with it, then print two dice rolls (1 to 6), each on its own line.',
                id: 'Baca bilangan bulat `s`. Seed dengannya, lalu cetak dua lemparan dadu (1 sampai 6), masing-masing di baris sendiri.',
              },
              starter: 'import random\ns = int(input())\n',
              tests: [
                { name: { en: 's = 1 → 2, 5', id: 's = 1 → 2, 5' }, stdin: ['1'], expectOutput: '2\n5' },
                { name: { en: 's = 2 → 1, 1', id: 's = 2 → 1, 1' }, stdin: ['2'], expectOutput: '1\n1' },
                { name: { en: 's = 9 → 4, 5', id: 's = 9 → 4, 5' }, stdin: ['9'], expectOutput: '4\n5' },
                { name: { en: 's = 100 → 2, 4', id: 's = 100 → 2, 4' }, stdin: ['100'], expectOutput: '2\n4' },
              ],
              hints: [
                { en: 'random.seed(s) first, then two calls to random.randint(1, 6).', id: 'random.seed(s) dulu, baru dua kali random.randint(1, 6).' },
              ],
              solution: 'import random\ns = int(input())\nrandom.seed(s)\nprint(random.randint(1, 6))\nprint(random.randint(1, 6))',
            },
          ],
        },
        {
          id: 'pymed-m1-s1-l2',
          title: { en: 'random.choice and random.shuffle', id: 'random.choice dan random.shuffle' },
          goal: { en: 'Pick from a list, and reorder one, both reproducibly.', id: 'Memilih dari list, dan mengacak urutannya, keduanya bisa diulang.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Picking one item from a list', id: 'Memilih satu unsur dari list' },
              body: {
                en: '`random.choice(daftar)` returns one item from `daftar`, chosen at random — useful for picking an operator, a word-problem character, or a unit of measurement from a list you control.',
                id: '`random.choice(daftar)` mengembalikan satu unsur dari `daftar`, dipilih secara acak — berguna untuk memilih operator, tokoh soal cerita, atau satuan ukuran dari daftar yang kamu kendalikan.',
              },
              code: 'import random\nrandom.seed(2)\nbuah = ["apel", "jeruk", "mangga", "pisang"]\nprint(random.choice(buah))',
              output: 'apel',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reordering a whole list', id: 'Mengacak urutan seluruh list' },
              body: {
                en: '`random.shuffle(daftar)` reorders `daftar` in place — it changes the list itself and returns nothing. Useful for handing out the same set of problems in a different order to every student.',
                id: '`random.shuffle(daftar)` mengacak urutan `daftar` di tempat — ia mengubah list-nya sendiri dan tidak mengembalikan apa-apa. Berguna untuk membagikan set soal yang sama dengan urutan berbeda ke tiap siswa.',
              },
              code: 'import random\nrandom.seed(3)\nangka = [1, 2, 3, 4, 5]\nrandom.shuffle(angka)\nprint(angka)',
              output: '[1, 3, 4, 5, 2]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'import random\nrandom.seed(7)\nwarna = ["merah", "biru", "hijau"]\nprint(random.choice(warna))',
              options: [
                { en: 'biru', id: 'biru' },
                { en: 'merah', id: 'merah' },
                { en: 'hijau', id: 'hijau' },
                { en: 'A different colour every time', id: 'Warna berbeda tiap kali' },
              ],
              answer: 0,
              explain: {
                en: 'Seeded with 7, this exact sequence of calls always lands on "biru".',
                id: 'Dengan seed 7, urutan pemanggilan persis ini selalu jatuh pada "biru".',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Pick one operator from the list, reproducibly.',
                id: 'Pilih satu operator dari list-nya, secara bisa diulang.',
              },
              template: 'import random\nrandom.seed(4)\noperator = ["+", "-", "*"]\npilihan = random.___(operator)\nprint(pilihan)',
              blanks: ['choice'],
              explain: {
                en: 'choice picks one item; shuffle would reorder the whole list instead.',
                id: 'choice memilih satu unsur; shuffle sebaliknya mengacak seluruh urutan list-nya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that shuffles a list of three names and prints the result.',
                id: 'Susun program yang mengacak list tiga nama dan mencetak hasilnya.',
              },
              lines: ['import random', 'random.seed(6)', 'nama = ["Ani", "Budi", "Citra"]', 'random.shuffle(nama)', 'print(nama)'],
              explain: {
                en: 'shuffle changes nama itself — there is nothing to assign the result to.',
                id: 'shuffle mengubah nama itu sendiri — tak ada hasil yang perlu ditugaskan ke mana pun.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `s`. Seed with it, then print one operator chosen from `["+", "-", "*"]`.',
                id: 'Baca bilangan bulat `s`. Seed dengannya, lalu cetak satu operator yang dipilih dari `["+", "-", "*"]`.',
              },
              starter: 'import random\ns = int(input())\noperator = ["+", "-", "*"]\n',
              tests: [
                { name: { en: 's = 1 → +', id: 's = 1 → +' }, stdin: ['1'], expectOutput: '+' },
                { name: { en: 's = 5 → *', id: 's = 5 → *' }, stdin: ['5'], expectOutput: '*' },
                { name: { en: 's = 7 → -', id: 's = 7 → -' }, stdin: ['7'], expectOutput: '-' },
                { name: { en: 's = 9 → -', id: 's = 9 → -' }, stdin: ['9'], expectOutput: '-' },
              ],
              hints: [
                { en: 'random.seed(s), then random.choice(operator).', id: 'random.seed(s), lalu random.choice(operator).' },
              ],
              solution: 'import random\ns = int(input())\noperator = ["+", "-", "*"]\nrandom.seed(s)\nprint(random.choice(operator))',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m1-s1-p',
        title: { en: 'Random Addition Problem', id: 'Generator Soal Penjumlahan Acak' },
        brief: {
          en: 'Generate one addition problem with an answer, reproducible from a seed.',
          id: 'Hasilkan satu soal penjumlahan lengkap dengan jawabannya, bisa diulang dari sebuah seed.',
        },
        requirements: [
          { en: 'Read a whole number `s`, seed with it.', id: 'Baca bilangan bulat `s`, seed dengannya.' },
          { en: 'Draw `a` and `b`, each a random whole number from 1 to 20.', id: 'Ambil `a` dan `b`, masing-masing bilangan bulat acak dari 1 sampai 20.' },
          { en: 'Print `a + b = ?` on one line, then the answer (`a + b`) on the next.', id: 'Cetak `a + b = ?` di satu baris, lalu jawabannya (`a + b`) di baris berikutnya.' },
        ],
        starter: 'import random\ns = int(input())\nrandom.seed(s)\n',
        tests: [
          { name: { en: 's = 1', id: 's = 1' }, stdin: ['1'], expectOutput: '5 + 19 = ?\n24' },
          { name: { en: 's = 2', id: 's = 2' }, stdin: ['2'], expectOutput: '2 + 3 = ?\n5' },
          { name: { en: 's = 3', id: 's = 3' }, stdin: ['3'], expectOutput: '8 + 19 = ?\n27' },
          { name: { en: 's = 42', id: 's = 42' }, stdin: ['42'], expectOutput: '4 + 1 = ?\n5' },
        ],
        hints: [
          { en: 'Draw a before b — drawing them in the other order changes both values.', id: 'Ambil a sebelum b — mengambilnya dalam urutan terbalik mengubah kedua nilainya.' },
          { en: 'f"{a} + {b} = ?" builds the first line in one step.', id: 'f"{a} + {b} = ?" menyusun baris pertama sekaligus.' },
        ],
        solution:
          'import random\ns = int(input())\nrandom.seed(s)\na = random.randint(1, 20)\nb = random.randint(1, 20)\nprint(f"{a} + {b} = ?")\nprint(a + b)',
        xp: 50,
      },
    },
  ],
}
