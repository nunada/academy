import type { Module } from '../types'

/** Module 4 — the closing module: statements that change the table rather than
 *  ask it something. */

/** A stockroom, with the constraints written out so they can be broken on
 *  purpose: `name` is UNIQUE, `price` has a CHECK, and `stock` has a DEFAULT. */
const SCHEMA = {
  en:
    `CREATE TABLE item (\n` +
    `  id       INTEGER PRIMARY KEY,\n` +
    `  name     TEXT    NOT NULL UNIQUE,\n` +
    `  category TEXT    NOT NULL,\n` +
    `  stock    INTEGER NOT NULL DEFAULT 0,\n` +
    `  price    INTEGER NOT NULL CHECK (price > 0)\n` +
    `);\n\n` +
    `INSERT INTO item VALUES\n` +
    `  (1, 'Pencil',    'Stationery', 40,  3000),\n` +
    `  (2, 'Eraser',    'Stationery', 12,  2000),\n` +
    `  (3, 'Notebook',  'Paper',       8,  5000),\n` +
    `  (4, 'Marker',    'Stationery',  0, 12000),\n` +
    `  (5, 'Folder',    'Paper',      25,  4000);`,
  id:
    `CREATE TABLE barang (\n` +
    `  id       INTEGER PRIMARY KEY,\n` +
    `  nama     TEXT    NOT NULL UNIQUE,\n` +
    `  kategori TEXT    NOT NULL,\n` +
    `  stok     INTEGER NOT NULL DEFAULT 0,\n` +
    `  harga    INTEGER NOT NULL CHECK (harga > 0)\n` +
    `);\n\n` +
    `INSERT INTO barang VALUES\n` +
    `  (1, 'Pensil',     'Tulis',  40,  3000),\n` +
    `  (2, 'Penghapus',  'Tulis',  12,  2000),\n` +
    `  (3, 'Buku Tulis', 'Kertas',  8,  5000),\n` +
    `  (4, 'Spidol',     'Tulis',   0, 12000),\n` +
    `  (5, 'Map',        'Kertas', 25,  4000);`,
}

export const module4: Module = {
  id: 'sql-m4',
  title: { en: 'Changing the Data', id: 'Mengubah Datanya' },
  summary: {
    en: 'Add rows, correct rows, remove rows — and the one word whose absence ruins all three.',
    id: 'Menambah baris, membetulkan baris, membuang baris — dan satu kata yang ketiadaannya merusak ketiganya.',
  },
  submodules: [
    {
      id: 'sql-m4-s1',
      title: { en: 'Writing to a Table', id: 'Menulis ke Tabel' },
      summary: {
        en: 'INSERT, UPDATE, DELETE, and the rules a table enforces on you.',
        id: 'INSERT, UPDATE, DELETE, dan aturan yang ditegakkan tabelnya kepadamu.',
      },
      lessons: [
        {
          id: 'sql-m4-s1-l1',
          title: { en: 'Adding rows', id: 'Menambahkan baris' },
          goal: { en: 'Insert data, and let the table refuse the bad kind.', id: 'Menyisipkan data, dan membiarkan tabelnya menolak yang buruk.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'INSERT names the columns and the values', id: 'INSERT menyebut kolom dan nilainya' },
              body: {
                en: 'You *can* leave the column list out and give a value for every column in order. Do not: the statement then breaks silently the day the table gains a column. Name the columns, and only the ones you are filling — the rest take their `DEFAULT`.',
                id: 'Kamu *boleh* menghilangkan daftar kolomnya dan memberi nilai untuk tiap kolom secara berurutan. Jangan: pernyataannya lalu rusak diam-diam pada hari tabelnya bertambah kolom. Sebut kolomnya, dan hanya yang kamu isi — sisanya mengambil `DEFAULT`-nya.',
              },
              code: {
                en:
                  "INSERT INTO item (id, name, category, stock, price)\nVALUES (6, 'Ruler', 'Stationery', 15, 6000);\n\n" +
                  "-- stock is not named, so it takes DEFAULT 0\nINSERT INTO item (id, name, category, price)\nVALUES (7, 'Stapler', 'Stationery', 25000);",
                id:
                  "INSERT INTO barang (id, nama, kategori, stok, harga)\nVALUES (6, 'Penggaris', 'Tulis', 15, 6000);\n\n" +
                  "-- stok tidak disebut, jadi ia memakai DEFAULT 0\nINSERT INTO barang (id, nama, kategori, harga)\nVALUES (7, 'Stapler', 'Tulis', 25000);",
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A write returns no rows', id: 'Penulisan tidak mengembalikan baris' },
              body: {
                en: 'Pressing **Run** on an `INSERT` shows you nothing, because an `INSERT` has nothing to show. To see what happened, add a `SELECT` after it. That is exactly how the checks in this module work: they run your statement, then query the table and look at what is there.',
                id: 'Menekan **Jalankan** pada `INSERT` tidak menampilkan apa pun, karena `INSERT` memang tak punya apa-apa untuk ditampilkan. Untuk melihat apa yang terjadi, tambahkan `SELECT` sesudahnya. Persis begitulah cara pemeriksaan di modul ini bekerja: ia menjalankan pernyataanmu, lalu mengkueri tabelnya dan melihat isinya.',
              },
              code: {
                en: "INSERT INTO item (id, name, category, stock, price)\nVALUES (6, 'Ruler', 'Stationery', 15, 6000);\n\nSELECT * FROM item;",
                id: "INSERT INTO barang (id, nama, kategori, stok, harga)\nVALUES (6, 'Penggaris', 'Tulis', 15, 6000);\n\nSELECT * FROM barang;",
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The table refuses data that breaks its rules', id: 'Tabelnya menolak data yang melanggar aturannya' },
              body: {
                en: '`NOT NULL`, `UNIQUE` and `CHECK` are written into the table itself, so no query can slip past them — not yours, not anyone else\'s, not a buggy program at three in the morning. A rejected statement changes nothing at all, and says why.',
                id: '`NOT NULL`, `UNIQUE`, dan `CHECK` tertulis di dalam tabelnya sendiri, jadi tak ada kueri yang bisa lolos darinya — bukan kuerimu, bukan kueri orang lain, bukan program bermasalah pada pukul tiga pagi. Pernyataan yang ditolak tidak mengubah apa pun, dan menyebutkan alasannya.',
              },
              code: {
                en:
                  "-- UNIQUE: 'Pencil' already exists\nINSERT INTO item (id, name, category, price) VALUES (8, 'Pencil', 'Stationery', 3000);\n" +
                  '-- UNIQUE constraint failed: item.name\n\n' +
                  "-- CHECK: price must be above zero\nINSERT INTO item (id, name, category, price) VALUES (9, 'Freebie', 'Stationery', 0);\n" +
                  '-- CHECK constraint failed',
                id:
                  "-- UNIQUE: 'Pensil' sudah ada\nINSERT INTO barang (id, nama, kategori, harga) VALUES (8, 'Pensil', 'Tulis', 3000);\n" +
                  '-- UNIQUE constraint failed: barang.nama\n\n' +
                  "-- CHECK: harga harus di atas nol\nINSERT INTO barang (id, nama, kategori, harga) VALUES (9, 'Gratisan', 'Tulis', 0);\n" +
                  '-- CHECK constraint failed',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The `stock` column is `NOT NULL DEFAULT 0`. What does this statement store in it?',
                id: 'Kolom `stok` adalah `NOT NULL DEFAULT 0`. Apa yang disimpan pernyataan ini di sana?',
              },
              code: {
                en: "INSERT INTO item (id, name, category, price) VALUES (7, 'Stapler', 'Stationery', 25000);",
                id: "INSERT INTO barang (id, nama, kategori, harga) VALUES (7, 'Stapler', 'Tulis', 25000);",
              },
              options: [
                { en: '0 — the default fills in', id: '0 — nilai bawaannya mengisi' },
                { en: 'NULL', id: 'NULL' },
                { en: 'Nothing — the statement is rejected', id: 'Tidak ada — pernyataannya ditolak' },
                { en: '25000, shifted from price', id: '25000, bergeser dari harga' },
              ],
              answer: 0,
              explain: {
                en: 'That is what DEFAULT is for: a column you did not mention still gets a sensible value, and NOT NULL stays satisfied.',
                id: 'Itulah gunanya DEFAULT: kolom yang tak kamu sebut tetap mendapat nilai yang masuk akal, dan NOT NULL tetap terpenuhi.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the statement that adds a row.',
                id: 'Lengkapi pernyataan yang menambahkan satu baris.',
              },
              template: {
                en: "___ INTO item (id, name, category, price)\n___ (8, 'Glue', 'Stationery', 4500);",
                id: "___ INTO barang (id, nama, kategori, harga)\n___ (8, 'Lem', 'Tulis', 4500);",
              },
              blanks: ['INSERT', 'VALUES'],
              explain: {
                en: 'INSERT INTO names the table and its columns; VALUES gives the row, in the same order.',
                id: 'INSERT INTO menyebut tabel dan kolomnya; VALUES memberi barisnya, dalam urutan yang sama.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Add one item to `item`: id 6, named `Ruler`, category `Stationery`, stock 15, price 6000. Change nothing else.',
                id: 'Tambahkan satu barang ke `barang`: id 6, bernama `Penggaris`, kategori `Tulis`, stok 15, harga 6000. Jangan ubah yang lain.',
              },
              starter: {
                en: '-- Write your statement here, then Run to see the table.\nSELECT * FROM item;\n',
                id: '-- Tulis pernyataanmu di sini, lalu Jalankan untuk melihat tabelnya.\nSELECT * FROM barang;\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'The new row is there, complete', id: 'Baris barunya ada, lengkap' },
                    verify: 'SELECT name, category, stock, price FROM item WHERE id = 6;',
                    expectRows: [['Ruler', 'Stationery', 15, 6000]],
                  },
                  {
                    name: { en: 'The table now holds six items', id: 'Tabelnya kini berisi enam barang' },
                    verify: 'SELECT COUNT(*) AS n FROM item;',
                    expectRows: [[6]],
                  },
                  {
                    name: { en: 'Nothing that was already there changed', id: 'Tak ada yang sudah ada di sana berubah' },
                    verify: 'SELECT name, stock, price FROM item WHERE id <= 5 ORDER BY id;',
                    ordered: true,
                    expectRows: [
                      ['Pencil', 40, 3000],
                      ['Eraser', 12, 2000],
                      ['Notebook', 8, 5000],
                      ['Marker', 0, 12000],
                      ['Folder', 25, 4000],
                    ],
                  },
                  {
                    name: { en: 'It works alongside rows added by someone else', id: 'Ia bekerja berdampingan dengan baris yang ditambahkan orang lain' },
                    setup: "INSERT INTO item (id, name, category, stock, price) VALUES (9, 'Clip', 'Stationery', 100, 1500);",
                    verify: 'SELECT COUNT(*) AS n FROM item;',
                    expectRows: [[7]],
                  },
                ],
                id: [
                  {
                    name: { en: 'The new row is there, complete', id: 'Baris barunya ada, lengkap' },
                    verify: 'SELECT nama, kategori, stok, harga FROM barang WHERE id = 6;',
                    expectRows: [['Penggaris', 'Tulis', 15, 6000]],
                  },
                  {
                    name: { en: 'The table now holds six items', id: 'Tabelnya kini berisi enam barang' },
                    verify: 'SELECT COUNT(*) AS n FROM barang;',
                    expectRows: [[6]],
                  },
                  {
                    name: { en: 'Nothing that was already there changed', id: 'Tak ada yang sudah ada di sana berubah' },
                    verify: 'SELECT nama, stok, harga FROM barang WHERE id <= 5 ORDER BY id;',
                    ordered: true,
                    expectRows: [
                      ['Pensil', 40, 3000],
                      ['Penghapus', 12, 2000],
                      ['Buku Tulis', 8, 5000],
                      ['Spidol', 0, 12000],
                      ['Map', 25, 4000],
                    ],
                  },
                  {
                    name: { en: 'It works alongside rows added by someone else', id: 'Ia bekerja berdampingan dengan baris yang ditambahkan orang lain' },
                    setup: "INSERT INTO barang (id, nama, kategori, stok, harga) VALUES (9, 'Klip', 'Tulis', 100, 1500);",
                    verify: 'SELECT COUNT(*) AS n FROM barang;',
                    expectRows: [[7]],
                  },
                ],
              },
              hints: [
                { en: 'INSERT INTO item (…) VALUES (…); — the column list and the value list line up one to one.', id: 'INSERT INTO barang (…) VALUES (…); — daftar kolom dan daftar nilainya sejajar satu lawan satu.' },
                { en: 'Text goes in single quotes; numbers do not.', id: 'Teks ditulis dalam kutip tunggal; angka tidak.' },
                { en: 'You may leave the SELECT underneath — the checks look at the table, not at what you printed.', id: 'Kamu boleh membiarkan SELECT-nya di bawah — pemeriksaannya melihat tabelnya, bukan apa yang kamu cetak.' },
              ],
              solution: {
                en: "INSERT INTO item (id, name, category, stock, price)\nVALUES (6, 'Ruler', 'Stationery', 15, 6000);",
                id: "INSERT INTO barang (id, nama, kategori, stok, harga)\nVALUES (6, 'Penggaris', 'Tulis', 15, 6000);",
              },
            },
          ],
        },
        {
          id: 'sql-m4-s1-l2',
          title: { en: 'Correcting and removing', id: 'Membetulkan dan membuang' },
          goal: { en: 'Change existing rows without touching the rest.', id: 'Mengubah baris yang ada tanpa menyentuh sisanya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'UPDATE … SET … WHERE', id: 'UPDATE … SET … WHERE' },
              body: {
                en: '`SET` says which columns change and to what; `WHERE` says which rows. The new value may be worked out from the old one — `stock = stock - 1` reads the row, subtracts, and writes it back, per row.',
                id: '`SET` menyatakan kolom mana yang berubah dan menjadi apa; `WHERE` menyatakan baris mana. Nilai barunya boleh dihitung dari nilai lamanya — `stok = stok - 1` membaca barisnya, mengurangi, lalu menuliskannya kembali, per baris.',
              },
              code: {
                en:
                  "UPDATE item SET stock = 30 WHERE name = 'Marker';\n\n" +
                  "UPDATE item SET stock = stock - 1 WHERE name = 'Pencil';\n\n" +
                  "-- two columns at once, separated by a comma\nUPDATE item SET stock = 5, price = 13000 WHERE id = 4;",
                id:
                  "UPDATE barang SET stok = 30 WHERE nama = 'Spidol';\n\n" +
                  "UPDATE barang SET stok = stok - 1 WHERE nama = 'Pensil';\n\n" +
                  "-- dua kolom sekaligus, dipisah koma\nUPDATE barang SET stok = 5, harga = 13000 WHERE id = 4;",
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The missing WHERE', id: 'WHERE yang hilang' },
              body: {
                en: 'An `UPDATE` with no `WHERE` changes **every row**, and a `DELETE` with no `WHERE` empties the table. There is no confirmation and no undo. This is the single most expensive mistake in SQL, and it is always the same mistake: writing the statement before writing the condition.',
                id: '`UPDATE` tanpa `WHERE` mengubah **semua baris**, dan `DELETE` tanpa `WHERE` mengosongkan tabelnya. Tak ada konfirmasi dan tak ada pembatalan. Ini kesalahan termahal di SQL, dan selalu kesalahan yang sama: menulis pernyataannya sebelum menulis kondisinya.',
              },
              code: {
                en:
                  '-- deletes EVERYTHING\nDELETE FROM item;\n\n' +
                  "-- deletes one\nDELETE FROM item WHERE name = 'Marker';\n\n" +
                  '-- deletes a group\nDELETE FROM item WHERE stock = 0;',
                id:
                  '-- menghapus SEMUANYA\nDELETE FROM barang;\n\n' +
                  "-- menghapus satu\nDELETE FROM barang WHERE nama = 'Spidol';\n\n" +
                  '-- menghapus sekelompok\nDELETE FROM barang WHERE stok = 0;',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Write the SELECT first', id: 'Tulis SELECT-nya lebih dulu' },
              body: {
                en: 'The habit that prevents it: write `SELECT * FROM item WHERE …` first, look at the rows that come back, and only then swap `SELECT *` for `DELETE` or `UPDATE … SET …`. The condition has already been proved on the rows it will hit.',
                id: 'Kebiasaan yang mencegahnya: tulis `SELECT * FROM barang WHERE …` lebih dulu, lihat baris yang kembali, dan baru setelah itu tukar `SELECT *` dengan `DELETE` atau `UPDATE … SET …`. Kondisinya sudah terbukti pada baris yang akan ia kenai.',
              },
              code: {
                en:
                  "-- 1. look first\nSELECT * FROM item WHERE category = 'Paper';\n\n" +
                  "-- 2. only then change\nUPDATE item SET price = price - 500 WHERE category = 'Paper';",
                id:
                  "-- 1. lihat dulu\nSELECT * FROM barang WHERE kategori = 'Kertas';\n\n" +
                  "-- 2. baru ubah\nUPDATE barang SET harga = harga - 500 WHERE kategori = 'Kertas';",
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'A transaction is all or nothing', id: 'Transaksi bersifat semua atau tidak sama sekali' },
              body: {
                en: 'Several statements that only make sense together belong in a transaction. Between `BEGIN` and `COMMIT` nothing is final; `ROLLBACK` throws the lot away as though it never happened. If the power fails halfway through, the database also rolls back — you never end up with half a transfer.',
                id: 'Beberapa pernyataan yang hanya bermakna bersama-sama sebaiknya dibungkus transaksi. Di antara `BEGIN` dan `COMMIT` tak ada yang final; `ROLLBACK` membuang semuanya seolah tak pernah terjadi. Kalau listrik mati di tengah jalan, basis datanya juga membatalkan — kamu tak pernah berakhir dengan setengah pemindahan.',
              },
              code: {
                en:
                  'BEGIN;\n' +
                  "  UPDATE item SET stock = stock - 5 WHERE name = 'Pencil';\n" +
                  "  UPDATE item SET stock = stock + 5 WHERE name = 'Eraser';\n" +
                  'COMMIT;',
                id:
                  'BEGIN;\n' +
                  "  UPDATE barang SET stok = stok - 5 WHERE nama = 'Pensil';\n" +
                  "  UPDATE barang SET stok = stok + 5 WHERE nama = 'Penghapus';\n" +
                  'COMMIT;',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The table has five rows. What does this statement do?',
                id: 'Tabelnya punya lima baris. Apa yang dilakukan pernyataan ini?',
              },
              code: { en: 'UPDATE item SET stock = 0;', id: 'UPDATE barang SET stok = 0;' },
              options: [
                { en: 'Sets every one of the five rows to zero stock', id: 'Menyetel kelima barisnya menjadi stok nol' },
                { en: 'Nothing — an UPDATE requires a WHERE', id: 'Tidak apa-apa — UPDATE mewajibkan WHERE' },
                { en: 'Sets only the first row', id: 'Menyetel baris pertamanya saja' },
                { en: 'Deletes the rows whose stock was already zero', id: 'Menghapus baris yang stoknya sudah nol' },
              ],
              answer: 0,
              explain: {
                en: 'No WHERE means no filter, and no filter means every row. The database does exactly what you asked.',
                id: 'Tanpa WHERE berarti tanpa penyaring, dan tanpa penyaring berarti semua baris. Basis datanya melakukan persis yang kamu minta.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put the safe way of running a risky change in order.',
                id: 'Susun cara aman menjalankan perubahan berisiko.',
              },
              lines: {
                en: [
                  'SELECT * FROM item WHERE stock = 0;',
                  'BEGIN;',
                  'DELETE FROM item WHERE stock = 0;',
                  'SELECT COUNT(*) FROM item;',
                  'COMMIT;',
                ],
                id: [
                  "SELECT * FROM barang WHERE stok = 0;",
                  'BEGIN;',
                  'DELETE FROM barang WHERE stok = 0;',
                  'SELECT COUNT(*) FROM barang;',
                  'COMMIT;',
                ],
              },
              explain: {
                en: 'Look at the rows, open a transaction, make the change, check it, and only then make it final.',
                id: 'Lihat barisnya, buka transaksi, lakukan perubahannya, periksa, dan baru setelah itu jadikan final.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Give the `Paper` items a 500 discount: reduce their `price` by 500, and leave every other category exactly as it was.',
                id: 'Beri diskon 500 pada barang `Kertas`: kurangi `harga`-nya sebesar 500, dan biarkan kategori lain persis seperti semula.',
              },
              starter: { en: 'UPDATE item SET price = price - 500;\n', id: 'UPDATE barang SET harga = harga - 500;\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Only the Paper prices moved', id: 'Hanya harga Kertas yang bergerak' },
                    verify: 'SELECT name, price FROM item ORDER BY id;',
                    ordered: true,
                    expectRows: [
                      ['Pencil', 3000],
                      ['Eraser', 2000],
                      ['Notebook', 4500],
                      ['Marker', 12000],
                      ['Folder', 3500],
                    ],
                  },
                  {
                    name: { en: 'A newly added Paper item is discounted too', id: 'Barang Kertas yang baru ditambahkan ikut didiskon' },
                    setup: "INSERT INTO item (id, name, category, stock, price) VALUES (6, 'Envelope', 'Paper', 30, 2000);",
                    verify: "SELECT name, price FROM item WHERE category = 'Paper' ORDER BY id;",
                    ordered: true,
                    expectRows: [
                      ['Notebook', 4500],
                      ['Folder', 3500],
                      ['Envelope', 1500],
                    ],
                  },
                  {
                    name: { en: 'A new Stationery item is left alone', id: 'Barang Tulis yang baru dibiarkan' },
                    setup: "INSERT INTO item (id, name, category, stock, price) VALUES (6, 'Glue', 'Stationery', 30, 4500);",
                    verify: "SELECT name, price FROM item WHERE category = 'Stationery' ORDER BY id;",
                    ordered: true,
                    expectRows: [
                      ['Pencil', 3000],
                      ['Eraser', 2000],
                      ['Marker', 12000],
                      ['Glue', 4500],
                    ],
                  },
                  {
                    name: { en: 'Nothing is deleted along the way', id: 'Tak ada yang terhapus di sepanjang jalan' },
                    verify: 'SELECT COUNT(*) AS n FROM item;',
                    expectRows: [[5]],
                  },
                ],
                id: [
                  {
                    name: { en: 'Only the Kertas prices moved', id: 'Hanya harga Kertas yang bergerak' },
                    verify: 'SELECT nama, harga FROM barang ORDER BY id;',
                    ordered: true,
                    expectRows: [
                      ['Pensil', 3000],
                      ['Penghapus', 2000],
                      ['Buku Tulis', 4500],
                      ['Spidol', 12000],
                      ['Map', 3500],
                    ],
                  },
                  {
                    name: { en: 'A newly added Kertas item is discounted too', id: 'Barang Kertas yang baru ditambahkan ikut didiskon' },
                    setup: "INSERT INTO barang (id, nama, kategori, stok, harga) VALUES (6, 'Amplop', 'Kertas', 30, 2000);",
                    verify: "SELECT nama, harga FROM barang WHERE kategori = 'Kertas' ORDER BY id;",
                    ordered: true,
                    expectRows: [
                      ['Buku Tulis', 4500],
                      ['Map', 3500],
                      ['Amplop', 1500],
                    ],
                  },
                  {
                    name: { en: 'A new Tulis item is left alone', id: 'Barang Tulis yang baru dibiarkan' },
                    setup: "INSERT INTO barang (id, nama, kategori, stok, harga) VALUES (6, 'Lem', 'Tulis', 30, 4500);",
                    verify: "SELECT nama, harga FROM barang WHERE kategori = 'Tulis' ORDER BY id;",
                    ordered: true,
                    expectRows: [
                      ['Pensil', 3000],
                      ['Penghapus', 2000],
                      ['Spidol', 12000],
                      ['Lem', 4500],
                    ],
                  },
                  {
                    name: { en: 'Nothing is deleted along the way', id: 'Tak ada yang terhapus di sepanjang jalan' },
                    verify: 'SELECT COUNT(*) AS n FROM barang;',
                    expectRows: [[5]],
                  },
                ],
              },
              hints: [
                { en: 'The starter is the dangerous version: it discounts everything.', id: 'Starter-nya adalah versi berbahayanya: ia mendiskon semuanya.' },
                { en: 'One clause is missing, and it goes at the end.', id: 'Satu klausa hilang, dan tempatnya di akhir.' },
                { en: "WHERE category = 'Paper'", id: "WHERE kategori = 'Kertas'" },
              ],
              solution: {
                en: "UPDATE item\nSET price = price - 500\nWHERE category = 'Paper';",
                id: "UPDATE barang\nSET harga = harga - 500\nWHERE kategori = 'Kertas';",
              },
            },
          ],
        },
      ],
      project: {
        id: 'sql-m4-s1-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: 'Tidying the Stockroom', id: 'Beres-beres Gudang' },
        brief: {
          en: 'Four jobs left on a note by the door. Write the statements that do them — all of them, in one go, without touching anything else.',
          id: 'Empat pekerjaan yang ditinggalkan di catatan dekat pintu. Tulis pernyataan yang mengerjakannya — semuanya, sekali jalan, tanpa menyentuh yang lain.',
        },
        requirements: [
          { en: 'Add a new item: id 6, `Ruler`, category `Stationery`, stock 15, price 6000.', id: 'Tambahkan barang baru: id 6, `Penggaris`, kategori `Tulis`, stok 15, harga 6000.' },
          { en: 'Remove every item whose stock is zero.', id: 'Buang setiap barang yang stoknya nol.' },
          { en: 'Raise the price of everything in category `Paper` by 1000.', id: 'Naikkan harga semua barang kategori `Kertas` sebesar 1000.' },
          { en: 'Set the stock of `Eraser` to 20.', id: 'Setel stok `Penghapus` menjadi 20.' },
          { en: 'Write one statement per job, each ending in a semicolon. The order is up to you.', id: 'Tulis satu pernyataan per pekerjaan, masing-masing diakhiri titik koma. Urutannya terserah kamu.' },
        ],
        starter: {
          en:
            '-- 1. add Ruler\n\n' +
            '-- 2. remove the ones with zero stock\n\n' +
            '-- 3. raise Paper prices by 1000\n\n' +
            '-- 4. set Eraser stock to 20\n\n' +
            'SELECT * FROM item ORDER BY id;\n',
          id:
            '-- 1. tambahkan Penggaris\n\n' +
            '-- 2. buang yang stoknya nol\n\n' +
            '-- 3. naikkan harga Kertas 1000\n\n' +
            '-- 4. stok Penghapus jadi 20\n\n' +
            'SELECT * FROM barang ORDER BY id;\n',
        },
        tests: {
          en: [
            {
              name: { en: 'The stockroom ends up exactly right', id: 'Gudangnya berakhir persis benar' },
              verify: 'SELECT id, name, category, stock, price FROM item ORDER BY id;',
              ordered: true,
              expectRows: [
                [1, 'Pencil', 'Stationery', 40, 3000],
                [2, 'Eraser', 'Stationery', 20, 2000],
                [3, 'Notebook', 'Paper', 8, 6000],
                [5, 'Folder', 'Paper', 25, 5000],
                [6, 'Ruler', 'Stationery', 15, 6000],
              ],
            },
            {
              name: { en: 'Five items remain', id: 'Lima barang tersisa' },
              verify: 'SELECT COUNT(*) AS n FROM item;',
              expectRows: [[5]],
            },
            {
              name: { en: 'Every empty item goes, not just Marker', id: 'Setiap barang kosong pergi, bukan hanya Spidol' },
              setup: "INSERT INTO item (id, name, category, stock, price) VALUES (7, 'Clip', 'Stationery', 0, 1500);",
              verify: 'SELECT name FROM item ORDER BY id;',
              ordered: true,
              expectRows: [['Pencil'], ['Eraser'], ['Notebook'], ['Folder'], ['Ruler']],
            },
            {
              name: { en: 'Every Paper item goes up, not just the two', id: 'Setiap barang Kertas naik, bukan hanya yang dua' },
              setup: "INSERT INTO item (id, name, category, stock, price) VALUES (7, 'Envelope', 'Paper', 30, 2000);",
              verify: "SELECT name, price FROM item WHERE category = 'Paper' ORDER BY id;",
              ordered: true,
              expectRows: [
                ['Notebook', 6000],
                ['Folder', 5000],
                ['Envelope', 3000],
              ],
            },
            {
              name: { en: 'An emptied item is removed even if it is Paper', id: 'Barang yang dikosongkan tetap dibuang walau ia Kertas' },
              setup: "UPDATE item SET stock = 0 WHERE name = 'Folder';",
              verify: 'SELECT name, category, price FROM item ORDER BY id;',
              ordered: true,
              expectRows: [
                ['Pencil', 'Stationery', 3000],
                ['Eraser', 'Stationery', 2000],
                ['Notebook', 'Paper', 6000],
                ['Ruler', 'Stationery', 6000],
              ],
            },
            {
              name: { en: 'Stationery prices are never touched', id: 'Harga Tulis tak pernah tersentuh' },
              setup: "INSERT INTO item (id, name, category, stock, price) VALUES (7, 'Glue', 'Stationery', 30, 4500);",
              verify: "SELECT name, price FROM item WHERE category = 'Stationery' ORDER BY id;",
              ordered: true,
              expectRows: [
                ['Pencil', 3000],
                ['Eraser', 2000],
                ['Ruler', 6000],
                ['Glue', 4500],
              ],
            },
          ],
          id: [
            {
              name: { en: 'The stockroom ends up exactly right', id: 'Gudangnya berakhir persis benar' },
              verify: 'SELECT id, nama, kategori, stok, harga FROM barang ORDER BY id;',
              ordered: true,
              expectRows: [
                [1, 'Pensil', 'Tulis', 40, 3000],
                [2, 'Penghapus', 'Tulis', 20, 2000],
                [3, 'Buku Tulis', 'Kertas', 8, 6000],
                [5, 'Map', 'Kertas', 25, 5000],
                [6, 'Penggaris', 'Tulis', 15, 6000],
              ],
            },
            {
              name: { en: 'Five items remain', id: 'Lima barang tersisa' },
              verify: 'SELECT COUNT(*) AS n FROM barang;',
              expectRows: [[5]],
            },
            {
              name: { en: 'Every empty item goes, not just Spidol', id: 'Setiap barang kosong pergi, bukan hanya Spidol' },
              setup: "INSERT INTO barang (id, nama, kategori, stok, harga) VALUES (7, 'Klip', 'Tulis', 0, 1500);",
              verify: 'SELECT nama FROM barang ORDER BY id;',
              ordered: true,
              expectRows: [['Pensil'], ['Penghapus'], ['Buku Tulis'], ['Map'], ['Penggaris']],
            },
            {
              name: { en: 'Every Kertas item goes up, not just the two', id: 'Setiap barang Kertas naik, bukan hanya yang dua' },
              setup: "INSERT INTO barang (id, nama, kategori, stok, harga) VALUES (7, 'Amplop', 'Kertas', 30, 2000);",
              verify: "SELECT nama, harga FROM barang WHERE kategori = 'Kertas' ORDER BY id;",
              ordered: true,
              expectRows: [
                ['Buku Tulis', 6000],
                ['Map', 5000],
                ['Amplop', 3000],
              ],
            },
            {
              name: { en: 'An emptied item is removed even if it is Kertas', id: 'Barang yang dikosongkan tetap dibuang walau ia Kertas' },
              setup: "UPDATE barang SET stok = 0 WHERE nama = 'Map';",
              verify: 'SELECT nama, kategori, harga FROM barang ORDER BY id;',
              ordered: true,
              expectRows: [
                ['Pensil', 'Tulis', 3000],
                ['Penghapus', 'Tulis', 2000],
                ['Buku Tulis', 'Kertas', 6000],
                ['Penggaris', 'Tulis', 6000],
              ],
            },
            {
              name: { en: 'Tulis prices are never touched', id: 'Harga Tulis tak pernah tersentuh' },
              setup: "INSERT INTO barang (id, nama, kategori, stok, harga) VALUES (7, 'Lem', 'Tulis', 30, 4500);",
              verify: "SELECT nama, harga FROM barang WHERE kategori = 'Tulis' ORDER BY id;",
              ordered: true,
              expectRows: [
                ['Pensil', 3000],
                ['Penghapus', 2000],
                ['Penggaris', 6000],
                ['Lem', 4500],
              ],
            },
          ],
        },
        hints: [
          { en: 'Four statements: one INSERT, one DELETE, and two UPDATEs.', id: 'Empat pernyataan: satu INSERT, satu DELETE, dan dua UPDATE.' },
          { en: 'Every one of the last three needs a WHERE. Two tests exist to catch a missing one.', id: 'Ketiga yang terakhir masing-masing butuh WHERE. Ada dua tes untuk menangkap yang hilang.' },
          { en: 'The price rise is worked out from the old price: price = price + 1000.', id: 'Kenaikan harganya dihitung dari harga lamanya: harga = harga + 1000.' },
          { en: 'The tests add extra rows of their own, so none of your conditions may name a fixed id.', id: 'Tesnya menambahkan baris tambahannya sendiri, jadi tak satu pun kondisimu boleh menyebut id tertentu.' },
        ],
        solution: {
          en:
            "INSERT INTO item (id, name, category, stock, price)\nVALUES (6, 'Ruler', 'Stationery', 15, 6000);\n\n" +
            'DELETE FROM item WHERE stock = 0;\n\n' +
            "UPDATE item SET price = price + 1000 WHERE category = 'Paper';\n\n" +
            "UPDATE item SET stock = 20 WHERE name = 'Eraser';",
          id:
            "INSERT INTO barang (id, nama, kategori, stok, harga)\nVALUES (6, 'Penggaris', 'Tulis', 15, 6000);\n\n" +
            'DELETE FROM barang WHERE stok = 0;\n\n' +
            "UPDATE barang SET harga = harga + 1000 WHERE kategori = 'Kertas';\n\n" +
            "UPDATE barang SET stok = 20 WHERE nama = 'Penghapus';",
        },
        xp: 80,
      },
    },
  ],
}
