import type { Module } from '../types'

/** Module 1 — the question itself: which columns, and which rows. */

/** One small table, used by every exercise in this module. Six rows is few
 *  enough that a learner can check an answer by eye, and enough that a filter
 *  has something to throw away. */
const SCHEMA = {
  en:
    `CREATE TABLE book (\n` +
    `  id      INTEGER PRIMARY KEY,\n` +
    `  title   TEXT    NOT NULL,\n` +
    `  author  TEXT    NOT NULL,\n` +
    `  year    INTEGER NOT NULL,\n` +
    `  price   INTEGER NOT NULL,\n` +
    `  stock   INTEGER NOT NULL\n` +
    `);\n\n` +
    `INSERT INTO book VALUES\n` +
    `  (1, 'Laskar Pelangi',  'Andrea Hirata', 2005,  85000, 12),\n` +
    `  (2, 'Bumi Manusia',    'Pramoedya',     1980, 110000,  3),\n` +
    `  (3, 'Perahu Kertas',   'Dee Lestari',   2009,  78000,  0),\n` +
    `  (4, 'Negeri 5 Menara', 'Ahmad Fuadi',   2009,  92000,  7),\n` +
    `  (5, 'Cantik Itu Luka', 'Eka Kurniawan', 2002, 125000,  4),\n` +
    `  (6, 'Pulang',          'Leila Chudori', 2012,  99000,  0);`,
  id:
    `CREATE TABLE buku (\n` +
    `  id      INTEGER PRIMARY KEY,\n` +
    `  judul   TEXT    NOT NULL,\n` +
    `  penulis TEXT    NOT NULL,\n` +
    `  tahun   INTEGER NOT NULL,\n` +
    `  harga   INTEGER NOT NULL,\n` +
    `  stok    INTEGER NOT NULL\n` +
    `);\n\n` +
    `INSERT INTO buku VALUES\n` +
    `  (1, 'Laskar Pelangi',  'Andrea Hirata', 2005,  85000, 12),\n` +
    `  (2, 'Bumi Manusia',    'Pramoedya',     1980, 110000,  3),\n` +
    `  (3, 'Perahu Kertas',   'Dee Lestari',   2009,  78000,  0),\n` +
    `  (4, 'Negeri 5 Menara', 'Ahmad Fuadi',   2009,  92000,  7),\n` +
    `  (5, 'Cantik Itu Luka', 'Eka Kurniawan', 2002, 125000,  4),\n` +
    `  (6, 'Pulang',          'Leila Chudori', 2012,  99000,  0);`,
}

export const module1: Module = {
  id: 'sql-m1',
  title: { en: 'Asking a Table', id: 'Bertanya kepada Tabel' },
  summary: {
    en: 'Pick the columns you want, then keep only the rows you meant.',
    id: 'Memilih kolom yang kamu inginkan, lalu menyisakan hanya baris yang kamu maksud.',
  },
  submodules: [
    {
      id: 'sql-m1-s1',
      title: { en: 'Columns and Rows', id: 'Kolom dan Baris' },
      summary: {
        en: 'SELECT names the columns; WHERE decides which rows survive.',
        id: 'SELECT menyebut kolomnya; WHERE menentukan baris mana yang bertahan.',
      },
      lessons: [
        {
          id: 'sql-m1-s1-l1',
          title: { en: 'Your first question', id: 'Pertanyaan pertamamu' },
          goal: { en: 'Ask a table for particular columns.', id: 'Meminta kolom tertentu dari sebuah tabel.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A table is a grid with named columns', id: 'Tabel adalah kisi dengan kolom bernama' },
              body: {
                en: 'A database keeps data in tables. Each **row** is one thing — one book — and each **column** is one fact about it, with a name and a type. SQL is how you ask that grid a question. You describe *what you want*; the database works out how to get it.',
                id: 'Basis data menyimpan data dalam tabel. Tiap **baris** adalah satu benda — satu buku — dan tiap **kolom** adalah satu fakta tentangnya, punya nama dan tipe. SQL adalah caramu bertanya kepada kisi itu. Kamu menjelaskan *apa yang kamu mau*; basis datanya yang memikirkan cara mendapatkannya.',
              },
              code: SCHEMA,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'SELECT what, FROM where', id: 'SELECT apa, FROM mana' },
              body: {
                en: 'A query names the columns after `SELECT` and the table after `FROM`. The semicolon ends the statement. You get back a **result** — itself a grid, with only the columns you asked for and, for now, every row.',
                id: 'Sebuah kueri menyebut kolomnya setelah `SELECT` dan tabelnya setelah `FROM`. Titik koma mengakhiri pernyataannya. Kamu menerima sebuah **hasil** — juga berupa kisi, hanya dengan kolom yang kamu minta dan, untuk sekarang, seluruh barisnya.',
              },
              code: { en: 'SELECT title, price FROM book;', id: 'SELECT judul, harga FROM buku;' },
              output: {
                en:
                  'title            price\n' +
                  'Laskar Pelangi   85000\n' +
                  'Bumi Manusia     110000\n' +
                  'Perahu Kertas    78000\n' +
                  'Negeri 5 Menara  92000\n' +
                  'Cantik Itu Luka  125000\n' +
                  'Pulang           99000',
                id:
                  'judul            harga\n' +
                  'Laskar Pelangi   85000\n' +
                  'Bumi Manusia     110000\n' +
                  'Perahu Kertas    78000\n' +
                  'Negeri 5 Menara  92000\n' +
                  'Cantik Itu Luka  125000\n' +
                  'Pulang           99000',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: '`*` means every column', id: '`*` berarti semua kolom' },
              body: {
                en: '`SELECT *` hands back every column the table has. It is perfect while you are exploring a table you do not know yet. It is a poor thing to leave in finished code: the query silently changes meaning the day somebody adds a column.',
                id: '`SELECT *` mengembalikan semua kolom yang dimiliki tabelnya. Ini sempurna saat kamu sedang menjelajahi tabel yang belum kamu kenal. Ini pilihan buruk untuk ditinggalkan di kode jadi: kuerinya diam-diam berubah makna pada hari seseorang menambahkan kolom.',
              },
              code: { en: 'SELECT * FROM book;', id: 'SELECT * FROM buku;' },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Rename a column with AS', id: 'Ganti nama kolom dengan AS' },
              body: {
                en: '`AS` gives a column a different name in the result. The stored column is untouched — only the answer is relabelled. It matters more than it looks: the name in the result is what the rest of your program will read.',
                id: '`AS` memberi sebuah kolom nama lain di hasilnya. Kolom yang tersimpan tidak tersentuh — hanya jawabannya yang dilabeli ulang. Ini lebih penting dari kelihatannya: nama di hasil itulah yang akan dibaca sisa programmu.',
              },
              code: { en: 'SELECT title AS name, year AS published FROM book;', id: 'SELECT judul AS nama, tahun AS terbit FROM buku;' },
              output: {
                en:
                  'name             published\n' +
                  'Laskar Pelangi   2005\n' +
                  'Bumi Manusia     1980\n' +
                  '...',
                id:
                  'nama             terbit\n' +
                  'Laskar Pelangi   2005\n' +
                  'Bumi Manusia     1980\n' +
                  '...',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The table has 6 rows and 6 columns. What is the shape of this result?',
                id: 'Tabelnya punya 6 baris dan 6 kolom. Bagaimana bentuk hasil ini?',
              },
              code: { en: 'SELECT author FROM book;', id: 'SELECT penulis FROM buku;' },
              options: [
                { en: '6 rows, 1 column', id: '6 baris, 1 kolom' },
                { en: '1 row, 6 columns', id: '1 baris, 6 kolom' },
                { en: '1 row, 1 column', id: '1 baris, 1 kolom' },
                { en: '6 rows, 6 columns', id: '6 baris, 6 kolom' },
              ],
              answer: 0,
              explain: {
                en: 'SELECT chooses columns, not rows. Naming one column still returns every row.',
                id: 'SELECT memilih kolom, bukan baris. Menyebut satu kolom tetap mengembalikan seluruh baris.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the query that returns the author and the year, with the author labelled `by`.',
                id: 'Lengkapi kueri yang mengembalikan penulis dan tahun, dengan penulis dilabeli `oleh`.',
              },
              template: {
                en: 'SELECT author ___ by, year ___ book;',
                id: 'SELECT penulis ___ oleh, tahun ___ buku;',
              },
              blanks: ['AS', 'FROM'],
              explain: {
                en: 'AS renames a column in the result; FROM says which table to read.',
                id: 'AS mengganti nama kolom di hasilnya; FROM menyebut tabel mana yang dibaca.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return two columns from `book`: the title labelled `name`, and the year. Nothing else.',
                id: 'Kembalikan dua kolom dari `buku`: judulnya dilabeli `nama`, dan tahunnya. Tidak ada yang lain.',
              },
              starter: { en: 'SELECT * FROM book;\n', id: 'SELECT * FROM buku;\n' },
              tests: {
                en: [
                  {
                    name: { en: 'The columns are name and year', id: 'Kolomnya nama dan tahun' },
                    expectColumns: ['name', 'year'],
                  },
                  {
                    name: { en: 'Every book is there', id: 'Semua bukunya ada' },
                    expectRows: [
                      ['Laskar Pelangi', 2005],
                      ['Bumi Manusia', 1980],
                      ['Perahu Kertas', 2009],
                      ['Negeri 5 Menara', 2009],
                      ['Cantik Itu Luka', 2002],
                      ['Pulang', 2012],
                    ],
                  },
                  {
                    name: { en: 'A new book shows up too', id: 'Buku baru pun ikut muncul' },
                    setup: "INSERT INTO book VALUES (7, 'Ronggeng Dukuh Paruk', 'Ahmad Tohari', 1982, 88000, 5);",
                    expectRows: [
                      ['Laskar Pelangi', 2005],
                      ['Bumi Manusia', 1980],
                      ['Perahu Kertas', 2009],
                      ['Negeri 5 Menara', 2009],
                      ['Cantik Itu Luka', 2002],
                      ['Pulang', 2012],
                      ['Ronggeng Dukuh Paruk', 1982],
                    ],
                  },
                ],
                id: [
                  {
                    name: { en: 'The columns are nama and tahun', id: 'Kolomnya nama dan tahun' },
                    expectColumns: ['nama', 'tahun'],
                  },
                  {
                    name: { en: 'Every book is there', id: 'Semua bukunya ada' },
                    expectRows: [
                      ['Laskar Pelangi', 2005],
                      ['Bumi Manusia', 1980],
                      ['Perahu Kertas', 2009],
                      ['Negeri 5 Menara', 2009],
                      ['Cantik Itu Luka', 2002],
                      ['Pulang', 2012],
                    ],
                  },
                  {
                    name: { en: 'A new book shows up too', id: 'Buku baru pun ikut muncul' },
                    setup: "INSERT INTO buku VALUES (7, 'Ronggeng Dukuh Paruk', 'Ahmad Tohari', 1982, 88000, 5);",
                    expectRows: [
                      ['Laskar Pelangi', 2005],
                      ['Bumi Manusia', 1980],
                      ['Perahu Kertas', 2009],
                      ['Negeri 5 Menara', 2009],
                      ['Cantik Itu Luka', 2002],
                      ['Pulang', 2012],
                      ['Ronggeng Dukuh Paruk', 1982],
                    ],
                  },
                ],
              },
              hints: [
                { en: 'Two column names after SELECT, separated by a comma.', id: 'Dua nama kolom setelah SELECT, dipisah koma.' },
                { en: 'Only `title` needs renaming; `year` is already right.', id: 'Hanya `judul` yang perlu diganti namanya; `tahun` sudah benar.' },
                { en: 'SELECT title AS name, ... FROM book;', id: 'SELECT judul AS nama, ... FROM buku;' },
              ],
              solution: { en: 'SELECT title AS name, year FROM book;', id: 'SELECT judul AS nama, tahun FROM buku;' },
            },
          ],
        },
        {
          id: 'sql-m1-s1-l2',
          title: { en: 'Keeping only some rows', id: 'Menyisakan sebagian baris' },
          goal: { en: 'Filter a table with WHERE.', id: 'Menyaring tabel dengan WHERE.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'WHERE tests every row', id: 'WHERE menguji tiap baris' },
              body: {
                en: 'A `WHERE` clause is a question asked of each row on its own: keep it, or drop it. The row is kept when the condition is true. Everything else falls away — the database never shows you what it rejected.',
                id: 'Klausa `WHERE` adalah pertanyaan yang diajukan ke tiap baris satu per satu: simpan, atau buang. Barisnya disimpan ketika kondisinya benar. Sisanya gugur — basis data tidak pernah menunjukkan apa yang ia tolak.',
              },
              code: { en: 'SELECT title, stock FROM book WHERE stock = 0;', id: 'SELECT judul, stok FROM buku WHERE stok = 0;' },
              output: {
                en: 'title          stock\nPerahu Kertas  0\nPulang         0',
                id: 'judul          stok\nPerahu Kertas  0\nPulang         0',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The comparisons', id: 'Perbandingannya' },
              body: {
                en: '`=` equal, `<>` not equal, and `<`, `>`, `<=`, `>=` for order. Note `=` — a single equals sign, not the `==` you write in most programming languages. Text goes in single quotes; numbers do not.',
                id: '`=` sama dengan, `<>` tidak sama dengan, dan `<`, `>`, `<=`, `>=` untuk urutan. Perhatikan `=` — satu tanda sama dengan, bukan `==` seperti yang kamu tulis di kebanyakan bahasa pemrograman. Teks ditulis dalam kutip tunggal; angka tidak.',
              },
              code: {
                en:
                  "SELECT title FROM book WHERE author = 'Dee Lestari';\n" +
                  'SELECT title FROM book WHERE price >= 100000;\n' +
                  'SELECT title FROM book WHERE year <> 2009;',
                id:
                  "SELECT judul FROM buku WHERE penulis = 'Dee Lestari';\n" +
                  'SELECT judul FROM buku WHERE harga >= 100000;\n' +
                  'SELECT judul FROM buku WHERE tahun <> 2009;',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'AND, OR, NOT', id: 'AND, OR, NOT' },
              body: {
                en: 'Join conditions with `AND` (both must hold) and `OR` (either will do). `AND` binds tighter than `OR`, so when you mix them, use brackets and say what you mean — that unwritten bracket is one of the most common wrong answers in SQL.',
                id: 'Gabungkan kondisi dengan `AND` (keduanya harus benar) dan `OR` (salah satu cukup). `AND` mengikat lebih kuat daripada `OR`, jadi saat kamu mencampurnya, pakai kurung dan katakan maksudmu — kurung yang tak ditulis itu salah satu jawaban salah paling umum di SQL.',
              },
              code: {
                en:
                  'SELECT title FROM book WHERE stock > 0 AND price < 100000;\n\n' +
                  '-- these two queries are NOT the same:\n' +
                  'SELECT title FROM book WHERE year = 2009 OR year = 2005 AND stock > 0;\n' +
                  'SELECT title FROM book WHERE (year = 2009 OR year = 2005) AND stock > 0;',
                id:
                  'SELECT judul FROM buku WHERE stok > 0 AND harga < 100000;\n\n' +
                  '-- dua kueri ini TIDAK sama:\n' +
                  'SELECT judul FROM buku WHERE tahun = 2009 OR tahun = 2005 AND stok > 0;\n' +
                  'SELECT judul FROM buku WHERE (tahun = 2009 OR tahun = 2005) AND stok > 0;',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which rows come back?',
                id: 'Baris mana yang kembali?',
              },
              code: { en: 'SELECT title FROM book WHERE price < 100000 AND stock > 5;', id: 'SELECT judul FROM buku WHERE harga < 100000 AND stok > 5;' },
              options: [
                { en: 'Laskar Pelangi and Negeri 5 Menara', id: 'Laskar Pelangi dan Negeri 5 Menara' },
                { en: 'Laskar Pelangi, Perahu Kertas, Negeri 5 Menara, Pulang', id: 'Laskar Pelangi, Perahu Kertas, Negeri 5 Menara, Pulang' },
                { en: 'Laskar Pelangi only', id: 'Hanya Laskar Pelangi' },
                { en: 'Nothing at all', id: 'Tidak ada sama sekali' },
              ],
              answer: 0,
              explain: {
                en: 'Both conditions must hold. Perahu Kertas is cheap but has 0 stock; Pulang has 0 too. Laskar Pelangi (85000, 12) and Negeri 5 Menara (92000, 7) pass both.',
                id: 'Kedua kondisinya harus benar. Perahu Kertas murah tapi stoknya 0; Pulang juga 0. Laskar Pelangi (85000, 12) dan Negeri 5 Menara (92000, 7) lolos keduanya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put the clauses in the order SQL expects.',
                id: 'Susun klausanya sesuai urutan yang diharapkan SQL.',
              },
              lines: {
                en: ['SELECT title, author', 'FROM book', "WHERE author = 'Eka Kurniawan'", 'ORDER BY title;'],
                id: ['SELECT judul, penulis', 'FROM buku', "WHERE penulis = 'Eka Kurniawan'", 'ORDER BY judul;'],
              },
              explain: {
                en: 'SELECT, FROM, WHERE, ORDER BY — always that order, whatever order you thought of them in.',
                id: 'SELECT, FROM, WHERE, ORDER BY — selalu urutan itu, dalam urutan apa pun kamu memikirkannya.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `title` and `stock` for the books that are actually in stock — stock above zero.',
                id: 'Kembalikan `judul` dan `stok` untuk buku yang benar-benar tersedia — stok di atas nol.',
              },
              starter: { en: 'SELECT title, stock FROM book;\n', id: 'SELECT judul, stok FROM buku;\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Only books in stock', id: 'Hanya buku yang tersedia' },
                    expectColumns: ['title', 'stock'],
                    expectRows: [
                      ['Laskar Pelangi', 12],
                      ['Bumi Manusia', 3],
                      ['Negeri 5 Menara', 7],
                      ['Cantik Itu Luka', 4],
                    ],
                  },
                  {
                    name: { en: 'A book that sells out drops off', id: 'Buku yang habis ikut hilang' },
                    setup: "UPDATE book SET stock = 0 WHERE title = 'Laskar Pelangi';",
                    expectRows: [
                      ['Bumi Manusia', 3],
                      ['Negeri 5 Menara', 7],
                      ['Cantik Itu Luka', 4],
                    ],
                  },
                  {
                    name: { en: 'A restocked book comes back', id: 'Buku yang diisi ulang kembali muncul' },
                    setup: "UPDATE book SET stock = 2 WHERE title = 'Pulang';",
                    expectRows: [
                      ['Laskar Pelangi', 12],
                      ['Bumi Manusia', 3],
                      ['Negeri 5 Menara', 7],
                      ['Cantik Itu Luka', 4],
                      ['Pulang', 2],
                    ],
                  },
                ],
                id: [
                  {
                    name: { en: 'Only books in stock', id: 'Hanya buku yang tersedia' },
                    expectColumns: ['judul', 'stok'],
                    expectRows: [
                      ['Laskar Pelangi', 12],
                      ['Bumi Manusia', 3],
                      ['Negeri 5 Menara', 7],
                      ['Cantik Itu Luka', 4],
                    ],
                  },
                  {
                    name: { en: 'A book that sells out drops off', id: 'Buku yang habis ikut hilang' },
                    setup: 'UPDATE buku SET stok = 0 WHERE judul = \'Laskar Pelangi\';',
                    expectRows: [
                      ['Bumi Manusia', 3],
                      ['Negeri 5 Menara', 7],
                      ['Cantik Itu Luka', 4],
                    ],
                  },
                  {
                    name: { en: 'A restocked book comes back', id: 'Buku yang diisi ulang kembali muncul' },
                    setup: "UPDATE buku SET stok = 2 WHERE judul = 'Pulang';",
                    expectRows: [
                      ['Laskar Pelangi', 12],
                      ['Bumi Manusia', 3],
                      ['Negeri 5 Menara', 7],
                      ['Cantik Itu Luka', 4],
                      ['Pulang', 2],
                    ],
                  },
                ],
              },
              hints: [
                { en: 'WHERE goes after FROM, before the semicolon.', id: 'WHERE ditulis setelah FROM, sebelum titik koma.' },
                { en: '"In stock" means more than zero, not "not zero" — though here they agree.', id: '"Tersedia" berarti lebih dari nol, bukan "bukan nol" — walau di sini keduanya sama.' },
                { en: 'SELECT title, stock FROM book WHERE stock > 0;', id: 'SELECT judul, stok FROM buku WHERE stok > 0;' },
              ],
              solution: { en: 'SELECT title, stock FROM book WHERE stock > 0;', id: 'SELECT judul, stok FROM buku WHERE stok > 0;' },
            },
          ],
        },
      ],
      project: {
        id: 'sql-m1-s1-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: 'The Affordable Shelf', id: 'Rak Terjangkau' },
        brief: {
          en: 'One query that a shop assistant could run every morning: what can I sell today, without it costing a fortune?',
          id: 'Satu kueri yang bisa dijalankan pramuniaga tiap pagi: apa yang bisa kujual hari ini, tanpa harganya selangit?',
        },
        requirements: [
          { en: 'Return exactly two columns: the title labelled `book`, and `price`.', id: 'Kembalikan tepat dua kolom: judulnya dilabeli `buku`, dan `harga`.' },
          { en: 'Keep only books priced 100000 or less — a book at exactly 100000 counts.', id: 'Sisakan hanya buku seharga 100000 atau kurang — buku tepat 100000 ikut terhitung.' },
          { en: 'Keep only books with stock above zero.', id: 'Sisakan hanya buku dengan stok di atas nol.' },
          { en: 'It has to keep working when the prices and the stock change.', id: 'Ia harus tetap bekerja ketika harga dan stoknya berubah.' },
        ],
        starter: { en: 'SELECT title, price FROM book;\n', id: 'SELECT judul, harga FROM buku;\n' },
        tests: {
          en: [
            {
              name: { en: 'The columns are book and price', id: 'Kolomnya buku dan harga' },
              expectColumns: ['book', 'price'],
            },
            {
              name: { en: 'Two books qualify today', id: 'Dua buku memenuhi syarat hari ini' },
              expectRows: [
                ['Laskar Pelangi', 85000],
                ['Negeri 5 Menara', 92000],
              ],
            },
            {
              name: { en: 'Restocking a cheap book adds it', id: 'Mengisi ulang buku murah menambahkannya' },
              setup: "UPDATE book SET stock = 5 WHERE title = 'Perahu Kertas';",
              expectRows: [
                ['Laskar Pelangi', 85000],
                ['Perahu Kertas', 78000],
                ['Negeri 5 Menara', 92000],
              ],
            },
            {
              name: { en: 'Exactly 100000 still counts', id: 'Tepat 100000 tetap terhitung' },
              setup: "UPDATE book SET price = 100000, stock = 2 WHERE title = 'Pulang';",
              expectRows: [
                ['Laskar Pelangi', 85000],
                ['Negeri 5 Menara', 92000],
                ['Pulang', 100000],
              ],
            },
            {
              name: { en: 'An expensive book never sneaks in', id: 'Buku mahal tidak pernah menyelinap masuk' },
              setup: "UPDATE book SET price = 100001 WHERE title = 'Laskar Pelangi';",
              expectRows: [['Negeri 5 Menara', 92000]],
            },
            {
              name: { en: 'An empty shop returns nothing', id: 'Toko kosong tidak mengembalikan apa pun' },
              setup: 'UPDATE book SET stock = 0;',
              expectRows: [],
            },
          ],
          id: [
            {
              name: { en: 'The columns are buku and harga', id: 'Kolomnya buku dan harga' },
              expectColumns: ['buku', 'harga'],
            },
            {
              name: { en: 'Two books qualify today', id: 'Dua buku memenuhi syarat hari ini' },
              expectRows: [
                ['Laskar Pelangi', 85000],
                ['Negeri 5 Menara', 92000],
              ],
            },
            {
              name: { en: 'Restocking a cheap book adds it', id: 'Mengisi ulang buku murah menambahkannya' },
              setup: "UPDATE buku SET stok = 5 WHERE judul = 'Perahu Kertas';",
              expectRows: [
                ['Laskar Pelangi', 85000],
                ['Perahu Kertas', 78000],
                ['Negeri 5 Menara', 92000],
              ],
            },
            {
              name: { en: 'Exactly 100000 still counts', id: 'Tepat 100000 tetap terhitung' },
              setup: "UPDATE buku SET harga = 100000, stok = 2 WHERE judul = 'Pulang';",
              expectRows: [
                ['Laskar Pelangi', 85000],
                ['Negeri 5 Menara', 92000],
                ['Pulang', 100000],
              ],
            },
            {
              name: { en: 'An expensive book never sneaks in', id: 'Buku mahal tidak pernah menyelinap masuk' },
              setup: "UPDATE buku SET harga = 100001 WHERE judul = 'Laskar Pelangi';",
              expectRows: [['Negeri 5 Menara', 92000]],
            },
            {
              name: { en: 'An empty shop returns nothing', id: 'Toko kosong tidak mengembalikan apa pun' },
              setup: 'UPDATE buku SET stok = 0;',
              expectRows: [],
            },
          ],
        },
        hints: [
          { en: 'Two conditions, both of which must hold — so AND, not OR.', id: 'Dua kondisi, keduanya harus benar — jadi AND, bukan OR.' },
          { en: '"100000 or less" is `<=`, not `<`. One test exists purely to catch that.', id: '"100000 atau kurang" adalah `<=`, bukan `<`. Satu tes ada khusus untuk menangkap itu.' },
          { en: 'Rename with AS in the SELECT list: title AS book.', id: 'Ganti nama dengan AS di daftar SELECT: judul AS buku.' },
        ],
        solution: {
          en: 'SELECT title AS book, price\nFROM book\nWHERE price <= 100000\n  AND stock > 0;',
          id: 'SELECT judul AS buku, harga\nFROM buku\nWHERE harga <= 100000\n  AND stok > 0;',
        },
        xp: 50,
      },
    },
    {
      id: 'sql-m1-s2',
      title: { en: 'Order and Patterns', id: 'Urutan dan Pola' },
      summary: {
        en: 'Sort the answer, cut it short, and match text by shape.',
        id: 'Mengurutkan jawabannya, memotongnya, dan mencocokkan teks berdasarkan bentuk.',
      },
      lessons: [
        {
          id: 'sql-m1-s2-l1',
          title: { en: 'Sorting and cutting', id: 'Mengurutkan dan memotong' },
          goal: { en: 'Control the order of the answer, and its length.', id: 'Mengendalikan urutan jawabannya, dan panjangnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Rows have no order until you give them one', id: 'Baris tidak punya urutan sampai kamu memberinya' },
              body: {
                en: 'A table is a *set* of rows. Without `ORDER BY`, the order you get is whatever was convenient for the database, and it may change between two runs of the same query. If the order matters, say so.',
                id: 'Tabel adalah *himpunan* baris. Tanpa `ORDER BY`, urutan yang kamu terima adalah apa pun yang kebetulan mudah bagi basis datanya, dan itu bisa berubah antara dua kali menjalankan kueri yang sama. Kalau urutannya penting, katakanlah.',
              },
              code: { en: 'SELECT title, price FROM book ORDER BY price;', id: 'SELECT judul, harga FROM buku ORDER BY harga;' },
              output: {
                en:
                  'title            price\n' +
                  'Perahu Kertas    78000\n' +
                  'Laskar Pelangi   85000\n' +
                  'Negeri 5 Menara  92000\n' +
                  'Pulang           99000\n' +
                  'Bumi Manusia     110000\n' +
                  'Cantik Itu Luka  125000',
                id:
                  'judul            harga\n' +
                  'Perahu Kertas    78000\n' +
                  'Laskar Pelangi   85000\n' +
                  'Negeri 5 Menara  92000\n' +
                  'Pulang           99000\n' +
                  'Bumi Manusia     110000\n' +
                  'Cantik Itu Luka  125000',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'DESC, and tie-breakers', id: 'DESC, dan pemutus seri' },
              body: {
                en: 'Sorting runs upwards by default; `DESC` turns it round. A second column after the comma is the tie-breaker — it decides only among rows the first column could not separate. Without one, tied rows land in an arbitrary order.',
                id: 'Pengurutan berjalan menaik secara bawaan; `DESC` membaliknya. Kolom kedua setelah koma adalah pemutus serinya — ia hanya memutuskan di antara baris yang tak bisa dipisahkan kolom pertama. Tanpa itu, baris yang seri mendarat dalam urutan sembarang.',
              },
              code: { en: 'SELECT title, year FROM book ORDER BY year DESC, title;', id: 'SELECT judul, tahun FROM buku ORDER BY tahun DESC, judul;' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'LIMIT takes the first few', id: 'LIMIT mengambil beberapa yang pertama' },
              body: {
                en: '`LIMIT n` stops after n rows. It only means "the top n" when an `ORDER BY` has already decided what "top" is — `LIMIT` on its own just grabs whatever rows came first.',
                id: '`LIMIT n` berhenti setelah n baris. Ia baru berarti "n teratas" ketika `ORDER BY` sudah menentukan apa itu "teratas" — `LIMIT` sendirian hanya menyambar baris mana pun yang kebetulan datang duluan.',
              },
              code: { en: 'SELECT title, price FROM book ORDER BY price DESC LIMIT 2;', id: 'SELECT judul, harga FROM buku ORDER BY harga DESC LIMIT 2;' },
              output: {
                en: 'title            price\nCantik Itu Luka  125000\nBumi Manusia     110000',
                id: 'judul            harga\nCantik Itu Luka  125000\nBumi Manusia     110000',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is this query unreliable?',
                id: 'Mengapa kueri ini tidak dapat diandalkan?',
              },
              code: { en: 'SELECT title FROM book LIMIT 3;', id: 'SELECT judul FROM buku LIMIT 3;' },
              options: [
                { en: 'With no ORDER BY, which three rows you get is not defined', id: 'Tanpa ORDER BY, tiga baris mana yang kamu dapat tidak ditentukan' },
                { en: 'LIMIT must always come before FROM', id: 'LIMIT harus selalu ditulis sebelum FROM' },
                { en: 'LIMIT does not work on text columns', id: 'LIMIT tidak bekerja pada kolom teks' },
                { en: 'It is fine — it always returns the first three inserted', id: 'Tidak apa-apa — ia selalu mengembalikan tiga yang dimasukkan pertama' },
              ],
              answer: 0,
              explain: {
                en: 'It happens to look stable on a tiny table, which is exactly what makes the habit dangerous later.',
                id: 'Ia kebetulan tampak stabil pada tabel mungil, dan justru itulah yang membuat kebiasaan ini berbahaya nanti.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the query for the three newest books, newest first.',
                id: 'Lengkapi kueri untuk tiga buku terbaru, yang terbaru dulu.',
              },
              template: {
                en: 'SELECT title FROM book ORDER BY year ___ ___ 3;',
                id: 'SELECT judul FROM buku ORDER BY tahun ___ ___ 3;',
              },
              blanks: ['DESC', 'LIMIT'],
              explain: {
                en: 'DESC makes the biggest year first; LIMIT then cuts the list to three.',
                id: 'DESC menaruh tahun terbesar di depan; LIMIT lalu memotong daftarnya jadi tiga.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `title` and `price` for the three most expensive books, most expensive first.',
                id: 'Kembalikan `judul` dan `harga` untuk tiga buku termahal, yang termahal dulu.',
              },
              starter: { en: 'SELECT title, price FROM book;\n', id: 'SELECT judul, harga FROM buku;\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Three rows, most expensive first', id: 'Tiga baris, yang termahal dulu' },
                    expectColumns: ['title', 'price'],
                    ordered: true,
                    expectRows: [
                      ['Cantik Itu Luka', 125000],
                      ['Bumi Manusia', 110000],
                      ['Pulang', 99000],
                    ],
                  },
                  {
                    name: { en: 'A pricier book takes the top spot', id: 'Buku yang lebih mahal merebut puncaknya' },
                    setup: "INSERT INTO book VALUES (7, 'Ensiklopedia', 'Tim Redaksi', 2015, 400000, 1);",
                    ordered: true,
                    expectRows: [
                      ['Ensiklopedia', 400000],
                      ['Cantik Itu Luka', 125000],
                      ['Bumi Manusia', 110000],
                    ],
                  },
                  {
                    name: { en: 'It is a sort, not a fixed list', id: 'Ini pengurutan, bukan daftar tetap' },
                    setup: "UPDATE book SET price = 1000 WHERE title = 'Cantik Itu Luka';",
                    ordered: true,
                    expectRows: [
                      ['Bumi Manusia', 110000],
                      ['Pulang', 99000],
                      ['Negeri 5 Menara', 92000],
                    ],
                  },
                ],
                id: [
                  {
                    name: { en: 'Three rows, most expensive first', id: 'Tiga baris, yang termahal dulu' },
                    expectColumns: ['judul', 'harga'],
                    ordered: true,
                    expectRows: [
                      ['Cantik Itu Luka', 125000],
                      ['Bumi Manusia', 110000],
                      ['Pulang', 99000],
                    ],
                  },
                  {
                    name: { en: 'A pricier book takes the top spot', id: 'Buku yang lebih mahal merebut puncaknya' },
                    setup: "INSERT INTO buku VALUES (7, 'Ensiklopedia', 'Tim Redaksi', 2015, 400000, 1);",
                    ordered: true,
                    expectRows: [
                      ['Ensiklopedia', 400000],
                      ['Cantik Itu Luka', 125000],
                      ['Bumi Manusia', 110000],
                    ],
                  },
                  {
                    name: { en: 'It is a sort, not a fixed list', id: 'Ini pengurutan, bukan daftar tetap' },
                    setup: "UPDATE buku SET harga = 1000 WHERE judul = 'Cantik Itu Luka';",
                    ordered: true,
                    expectRows: [
                      ['Bumi Manusia', 110000],
                      ['Pulang', 99000],
                      ['Negeri 5 Menara', 92000],
                    ],
                  },
                ],
              },
              hints: [
                { en: 'Sort first, then cut — the database applies ORDER BY before LIMIT.', id: 'Urutkan dulu, baru potong — basis datanya menerapkan ORDER BY sebelum LIMIT.' },
                { en: '"Most expensive first" is descending.', id: '"Termahal dulu" berarti menurun.' },
                { en: 'ORDER BY price DESC LIMIT 3', id: 'ORDER BY harga DESC LIMIT 3' },
              ],
              solution: {
                en: 'SELECT title, price\nFROM book\nORDER BY price DESC\nLIMIT 3;',
                id: 'SELECT judul, harga\nFROM buku\nORDER BY harga DESC\nLIMIT 3;',
              },
            },
          ],
        },
        {
          id: 'sql-m1-s2-l2',
          title: { en: 'Ranges and text patterns', id: 'Rentang dan pola teks' },
          goal: { en: 'Match by range, by list, and by the shape of a word.', id: 'Mencocokkan berdasarkan rentang, daftar, dan bentuk sebuah kata.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'BETWEEN and IN', id: 'BETWEEN dan IN' },
              body: {
                en: '`BETWEEN a AND b` is shorthand for `>= a AND <= b` — both ends are **included**, which surprises people. `IN (…)` asks whether the value is one of a list, and saves a pile of `OR`s.',
                id: '`BETWEEN a AND b` adalah singkatan dari `>= a AND <= b` — kedua ujungnya **termasuk**, dan itu mengejutkan banyak orang. `IN (…)` menanyakan apakah nilainya salah satu dari sebuah daftar, dan menghemat setumpuk `OR`.',
              },
              code: {
                en:
                  'SELECT title FROM book WHERE year BETWEEN 2005 AND 2009;\n' +
                  "SELECT title FROM book WHERE author IN ('Dee Lestari', 'Ahmad Fuadi');",
                id:
                  'SELECT judul FROM buku WHERE tahun BETWEEN 2005 AND 2009;\n' +
                  "SELECT judul FROM buku WHERE penulis IN ('Dee Lestari', 'Ahmad Fuadi');",
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'LIKE matches a shape', id: 'LIKE mencocokkan bentuk' },
              body: {
                en: 'In a `LIKE` pattern, `%` stands for any run of characters — including none — and `_` for exactly one. So `\'A%\'` means "starts with A", `\'%a\'` means "ends with a", and `\'%an%\'` means "contains an". In SQLite, LIKE ignores case for plain ASCII letters.',
                id: 'Dalam pola `LIKE`, `%` mewakili rangkaian karakter apa pun — termasuk kosong — dan `_` mewakili tepat satu. Jadi `\'A%\'` berarti "diawali A", `\'%a\'` berarti "diakhiri a", dan `\'%an%\'` berarti "mengandung an". Di SQLite, LIKE mengabaikan besar-kecil huruf untuk huruf ASCII biasa.',
              },
              code: { en: "SELECT title FROM book WHERE title LIKE 'P%';", id: "SELECT judul FROM buku WHERE judul LIKE 'P%';" },
              output: { en: 'title\nPerahu Kertas\nPulang', id: 'judul\nPerahu Kertas\nPulang' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How many of the six books does this match?',
                id: 'Berapa dari enam buku yang cocok dengan ini?',
              },
              code: { en: "SELECT title FROM book WHERE title LIKE '%a%';", id: "SELECT judul FROM buku WHERE judul LIKE '%a%';" },
              options: [
                { en: 'All six — every title contains an "a"', id: 'Keenamnya — tiap judul mengandung "a"' },
                { en: 'Two', id: 'Dua' },
                { en: 'None — % is not a wildcard', id: 'Tidak ada — % bukan wildcard' },
                { en: 'Only the ones starting with "a"', id: 'Hanya yang diawali "a"' },
              ],
              answer: 0,
              explain: {
                en: 'A pattern wrapped in % on both sides is a "contains" test, and it is very easy to make too loose.',
                id: 'Pola yang diapit % di kedua sisi adalah uji "mengandung", dan sangat mudah dibuat terlalu longgar.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a query for books by an author whose name starts with D, cheapest first.',
                id: 'Susun kueri untuk buku dari penulis yang namanya diawali D, termurah dulu.',
              },
              lines: {
                en: ['SELECT title, price', 'FROM book', "WHERE author LIKE 'D%'", 'ORDER BY price;'],
                id: ['SELECT judul, harga', 'FROM buku', "WHERE penulis LIKE 'D%'", 'ORDER BY harga;'],
              },
              explain: {
                en: 'The clause order never changes, however you thought of the question.',
                id: 'Urutan klausanya tidak pernah berubah, bagaimanapun kamu memikirkan pertanyaannya.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `title` and `author` for books whose author\'s name **starts with** the letter A.',
                id: 'Kembalikan `judul` dan `penulis` untuk buku yang nama penulisnya **diawali** huruf A.',
              },
              starter: {
                en: "SELECT title, author FROM book WHERE author = 'A';\n",
                id: "SELECT judul, penulis FROM buku WHERE penulis = 'A';\n",
              },
              tests: {
                en: [
                  {
                    name: { en: 'Two authors match', id: 'Dua penulis cocok' },
                    expectColumns: ['title', 'author'],
                    expectRows: [
                      ['Laskar Pelangi', 'Andrea Hirata'],
                      ['Negeri 5 Menara', 'Ahmad Fuadi'],
                    ],
                  },
                  {
                    name: { en: 'A new A-author is found', id: 'Penulis A yang baru ikut ditemukan' },
                    setup: "INSERT INTO book VALUES (7, 'Saman', 'Ayu Utami', 1998, 76000, 6);",
                    expectRows: [
                      ['Laskar Pelangi', 'Andrea Hirata'],
                      ['Negeri 5 Menara', 'Ahmad Fuadi'],
                      ['Saman', 'Ayu Utami'],
                    ],
                  },
                  {
                    name: { en: 'An A in the middle does not count', id: 'Huruf A di tengah tidak terhitung' },
                    setup: "INSERT INTO book VALUES (7, 'Bilangan Fu', 'Nadia Ayu', 2008, 91000, 2);",
                    expectRows: [
                      ['Laskar Pelangi', 'Andrea Hirata'],
                      ['Negeri 5 Menara', 'Ahmad Fuadi'],
                    ],
                  },
                ],
                id: [
                  {
                    name: { en: 'Two authors match', id: 'Dua penulis cocok' },
                    expectColumns: ['judul', 'penulis'],
                    expectRows: [
                      ['Laskar Pelangi', 'Andrea Hirata'],
                      ['Negeri 5 Menara', 'Ahmad Fuadi'],
                    ],
                  },
                  {
                    name: { en: 'A new A-author is found', id: 'Penulis A yang baru ikut ditemukan' },
                    setup: "INSERT INTO buku VALUES (7, 'Saman', 'Ayu Utami', 1998, 76000, 6);",
                    expectRows: [
                      ['Laskar Pelangi', 'Andrea Hirata'],
                      ['Negeri 5 Menara', 'Ahmad Fuadi'],
                      ['Saman', 'Ayu Utami'],
                    ],
                  },
                  {
                    name: { en: 'An A in the middle does not count', id: 'Huruf A di tengah tidak terhitung' },
                    setup: "INSERT INTO buku VALUES (7, 'Bilangan Fu', 'Nadia Ayu', 2008, 91000, 2);",
                    expectRows: [
                      ['Laskar Pelangi', 'Andrea Hirata'],
                      ['Negeri 5 Menara', 'Ahmad Fuadi'],
                    ],
                  },
                ],
              },
              hints: [
                { en: '`=` compares the whole value. You need a pattern, so you need LIKE.', id: '`=` membandingkan seluruh nilainya. Kamu butuh pola, jadi kamu butuh LIKE.' },
                { en: 'The % goes on the end, not the front — "starts with" is anchored at the left.', id: 'Tanda % ditaruh di belakang, bukan di depan — "diawali" berjangkar di kiri.' },
                { en: "WHERE author LIKE 'A%'", id: "WHERE penulis LIKE 'A%'" },
              ],
              solution: {
                en: "SELECT title, author\nFROM book\nWHERE author LIKE 'A%';",
                id: "SELECT judul, penulis\nFROM buku\nWHERE penulis LIKE 'A%';",
              },
            },
          ],
        },
      ],
      project: {
        id: 'sql-m1-s2-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: 'The Millennium Shelf', id: 'Rak Milenium' },
        brief: {
          en: 'A display shelf for this century\'s first decade: what is on it, and in what order.',
          id: 'Rak pajangan untuk dekade pertama abad ini: apa isinya, dan dalam urutan apa.',
        },
        requirements: [
          { en: 'Return three columns: the title labelled `book`, then `price` and `stock`.', id: 'Kembalikan tiga kolom: judulnya dilabeli `buku`, lalu `harga` dan `stok`.' },
          { en: 'Keep only books published from 2000 to 2010, both years included.', id: 'Sisakan hanya buku terbitan 2000 sampai 2010, kedua tahunnya termasuk.' },
          { en: 'Keep only books with stock above zero.', id: 'Sisakan hanya buku dengan stok di atas nol.' },
          { en: 'Sort by price, most expensive first.', id: 'Urutkan berdasarkan harga, yang termahal dulu.' },
        ],
        starter: { en: 'SELECT title, price, stock FROM book;\n', id: 'SELECT judul, harga, stok FROM buku;\n' },
        tests: {
          en: [
            {
              name: { en: 'The columns are book, price, stock', id: 'Kolomnya buku, harga, stok' },
              expectColumns: ['book', 'price', 'stock'],
            },
            {
              name: { en: 'Three books, priciest first', id: 'Tiga buku, yang termahal dulu' },
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
            {
              name: { en: 'The year 2000 itself is included', id: 'Tahun 2000 sendiri termasuk' },
              setup: "INSERT INTO book VALUES (7, 'Supernova', 'Dee Lestari', 2000, 130000, 3);",
              ordered: true,
              expectRows: [
                ['Supernova', 130000, 3],
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
            {
              name: { en: 'The year 2010 itself is included', id: 'Tahun 2010 sendiri termasuk' },
              setup: "INSERT INTO book VALUES (7, 'Sepotong Senja', 'Seno Gumira', 2010, 70000, 1);",
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
                ['Sepotong Senja', 70000, 1],
              ],
            },
            {
              name: { en: '1999 and 2011 stay out', id: '1999 dan 2011 tetap di luar' },
              setup:
                "INSERT INTO book VALUES (7, 'Ayat Ayat Cinta', 'Habiburrahman', 1999, 88000, 9), (8, 'Rindu', 'Tere Liye', 2011, 89000, 9);",
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
            {
              name: { en: 'Out-of-stock books never appear', id: 'Buku yang kosong tidak pernah muncul' },
              setup: "UPDATE book SET stock = 0 WHERE title = 'Negeri 5 Menara';",
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
          ],
          id: [
            {
              name: { en: 'The columns are buku, harga, stok', id: 'Kolomnya buku, harga, stok' },
              expectColumns: ['buku', 'harga', 'stok'],
            },
            {
              name: { en: 'Three books, priciest first', id: 'Tiga buku, yang termahal dulu' },
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
            {
              name: { en: 'The year 2000 itself is included', id: 'Tahun 2000 sendiri termasuk' },
              setup: "INSERT INTO buku VALUES (7, 'Supernova', 'Dee Lestari', 2000, 130000, 3);",
              ordered: true,
              expectRows: [
                ['Supernova', 130000, 3],
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
            {
              name: { en: 'The year 2010 itself is included', id: 'Tahun 2010 sendiri termasuk' },
              setup: "INSERT INTO buku VALUES (7, 'Sepotong Senja', 'Seno Gumira', 2010, 70000, 1);",
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
                ['Sepotong Senja', 70000, 1],
              ],
            },
            {
              name: { en: '1999 and 2011 stay out', id: '1999 dan 2011 tetap di luar' },
              setup:
                "INSERT INTO buku VALUES (7, 'Ayat Ayat Cinta', 'Habiburrahman', 1999, 88000, 9), (8, 'Rindu', 'Tere Liye', 2011, 89000, 9);",
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Negeri 5 Menara', 92000, 7],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
            {
              name: { en: 'Out-of-stock books never appear', id: 'Buku yang kosong tidak pernah muncul' },
              setup: "UPDATE buku SET stok = 0 WHERE judul = 'Negeri 5 Menara';",
              ordered: true,
              expectRows: [
                ['Cantik Itu Luka', 125000, 4],
                ['Laskar Pelangi', 85000, 12],
              ],
            },
          ],
        },
        hints: [
          { en: 'Two conditions joined with AND, then a sort at the end.', id: 'Dua kondisi digabung dengan AND, lalu pengurutan di akhir.' },
          { en: 'BETWEEN 2000 AND 2010 includes both ends — two tests check exactly that.', id: 'BETWEEN 2000 AND 2010 mencakup kedua ujungnya — dua tes memeriksa persis itu.' },
          { en: 'ORDER BY comes after WHERE, never before it.', id: 'ORDER BY ditulis setelah WHERE, tidak pernah sebelumnya.' },
        ],
        solution: {
          en:
            'SELECT title AS book, price, stock\nFROM book\nWHERE year BETWEEN 2000 AND 2010\n  AND stock > 0\nORDER BY price DESC;',
          id:
            'SELECT judul AS buku, harga, stok\nFROM buku\nWHERE tahun BETWEEN 2000 AND 2010\n  AND stok > 0\nORDER BY harga DESC;',
        },
        xp: 50,
      },
    },
  ],
}
