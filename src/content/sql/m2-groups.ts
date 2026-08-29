import type { Module } from '../types'

/** Module 2 — from "which rows" to "what do they add up to". */

/** Orders, deliberately shaped for this module: repeated customers, repeated
 *  cities, repeated products, and a mostly-empty `kupon` column so the
 *  difference between COUNT(*) and COUNT(column) is visible rather than
 *  theoretical. */
const SCHEMA = `CREATE TABLE pesanan (
  id        INTEGER PRIMARY KEY,
  pelanggan TEXT    NOT NULL,
  kota      TEXT    NOT NULL,
  produk    TEXT    NOT NULL,
  jumlah    INTEGER NOT NULL,
  total     INTEGER NOT NULL,
  kupon     TEXT
);

INSERT INTO pesanan VALUES
  (1, 'Rina', 'Surabaya', 'Keyboard', 1,  350000, NULL),
  (2, 'Budi', 'Jakarta',  'Mouse',    2,  180000, 'HEMAT10'),
  (3, 'Rina', 'Surabaya', 'Mouse',    1,   90000, NULL),
  (4, 'Sari', 'Bandung',  'Monitor',  1, 1200000, NULL),
  (5, 'Budi', 'Jakarta',  'Keyboard', 3, 1050000, 'HEMAT10'),
  (6, 'Tono', 'Surabaya', 'Mouse',    4,  360000, NULL),
  (7, 'Sari', 'Bandung',  'Keyboard', 1,  350000, 'GRATISONGKIR'),
  (8, 'Rina', 'Surabaya', 'Monitor',  2, 2400000, NULL);`

export const module2: Module = {
  id: 'sql-m2',
  title: { en: 'Counting and Grouping', id: 'Menghitung dan Mengelompokkan' },
  summary: {
    en: 'Turn many rows into one number — then into one number per group.',
    id: 'Mengubah banyak baris menjadi satu angka — lalu menjadi satu angka per kelompok.',
  },
  submodules: [
    {
      id: 'sql-m2-s1',
      title: { en: 'One Answer From Many Rows', id: 'Satu Jawaban dari Banyak Baris' },
      summary: {
        en: 'COUNT, SUM, AVG, MIN, MAX — and what they do about missing values.',
        id: 'COUNT, SUM, AVG, MIN, MAX — dan apa yang mereka lakukan pada nilai yang hilang.',
      },
      lessons: [
        {
          id: 'sql-m2-s1-l1',
          title: { en: 'Collapsing a table to a number', id: 'Meringkas tabel menjadi angka' },
          goal: { en: 'Summarise a whole table in one row.', id: 'Merangkum seluruh tabel dalam satu baris.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An aggregate reads many rows and returns one', id: 'Agregat membaca banyak baris dan mengembalikan satu' },
              body: {
                en: 'Everything so far returned one result row per table row. An **aggregate function** breaks that: `COUNT`, `SUM`, `AVG`, `MIN` and `MAX` each read the whole set of rows and hand back a single value. With no `GROUP BY`, the whole table is one group, so you get exactly one row back.',
                id: 'Semua yang tadi mengembalikan satu baris hasil per baris tabel. **Fungsi agregat** mematahkan itu: `COUNT`, `SUM`, `AVG`, `MIN`, dan `MAX` masing-masing membaca seluruh himpunan barisnya dan mengembalikan satu nilai. Tanpa `GROUP BY`, seluruh tabel adalah satu kelompok, jadi kamu menerima tepat satu baris.',
              },
              code: 'SELECT COUNT(*) AS baris, SUM(total) AS pendapatan, MAX(total) AS terbesar\nFROM pesanan;',
              output: 'baris  pendapatan  terbesar\n8      5980000     2400000',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'COUNT(*) and COUNT(column) are different questions', id: 'COUNT(*) dan COUNT(kolom) adalah pertanyaan berbeda' },
              body: {
                en: '`COUNT(*)` counts **rows**. `COUNT(kupon)` counts rows where `kupon` **has a value** — a `NULL` is not a value, so it is skipped. Every other aggregate skips NULL too: `AVG` divides by how many values it actually saw, not by how many rows there were.',
                id: '`COUNT(*)` menghitung **baris**. `COUNT(kupon)` menghitung baris yang `kupon`-nya **punya nilai** — `NULL` bukan nilai, jadi ia dilewati. Semua agregat lain juga melewati NULL: `AVG` membagi dengan banyaknya nilai yang benar-benar ia lihat, bukan dengan banyaknya baris.',
              },
              code: 'SELECT COUNT(*) AS semua, COUNT(kupon) AS pakai_kupon\nFROM pesanan;',
              output: 'semua  pakai_kupon\n8      3',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'WHERE runs first', id: 'WHERE berjalan lebih dulu' },
              body: {
                en: 'A `WHERE` clause still filters rows one at a time, and it does so **before** the aggregate sees anything. So this is "the average of the large orders", not "the large ones among the averages" — a phrase that would not even mean anything.',
                id: 'Klausa `WHERE` tetap menyaring baris satu per satu, dan ia melakukannya **sebelum** agregatnya melihat apa pun. Jadi ini adalah "rata-rata dari pesanan besar", bukan "yang besar di antara rata-rata" — kalimat yang bahkan tidak bermakna.',
              },
              code: 'SELECT AVG(total) AS rata_rata\nFROM pesanan\nWHERE jumlah > 1;',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Three of the eight orders have a coupon. What do these two numbers come out as?',
                id: 'Tiga dari delapan pesanan punya kupon. Kedua angka ini menjadi berapa?',
              },
              code: 'SELECT COUNT(*), COUNT(kupon) FROM pesanan;',
              options: [
                { en: '8 and 3', id: '8 dan 3' },
                { en: '8 and 8', id: '8 dan 8' },
                { en: '3 and 3', id: '3 dan 3' },
                { en: '8 and 5', id: '8 dan 5' },
              ],
              answer: 0,
              explain: {
                en: 'COUNT(*) counts rows; COUNT(kupon) counts the rows where that column is not NULL.',
                id: 'COUNT(*) menghitung baris; COUNT(kupon) menghitung baris yang kolom itu bukan NULL.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the query for the cheapest and the dearest order.',
                id: 'Lengkapi kueri untuk pesanan termurah dan termahal.',
              },
              template: 'SELECT ___(total) AS termurah, ___(total) AS termahal FROM pesanan;',
              blanks: ['MIN', 'MAX'],
              explain: {
                en: 'MIN and MAX read a column across every row and keep one value each.',
                id: 'MIN dan MAX membaca satu kolom di seluruh baris dan menyimpan satu nilai masing-masing.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return one row with three columns: `banyak_pesanan` (how many orders), `pendapatan` (the sum of `total`), and `terbesar` (the largest `total`).',
                id: 'Kembalikan satu baris dengan tiga kolom: `banyak_pesanan` (banyaknya pesanan), `pendapatan` (jumlah kolom `total`), dan `terbesar` (nilai `total` terbesar).',
              },
              starter: 'SELECT total FROM pesanan;\n',
              tests: [
                {
                  name: { en: 'The three columns are named right', id: 'Ketiga kolomnya dinamai dengan benar' },
                  expectColumns: ['banyak_pesanan', 'pendapatan', 'terbesar'],
                },
                {
                  name: { en: 'The summary is correct', id: 'Rangkumannya benar' },
                  expectRows: [[8, 5980000, 2400000]],
                },
                {
                  name: { en: 'A new order moves all three', id: 'Pesanan baru menggerakkan ketiganya' },
                  setup: "INSERT INTO pesanan VALUES (9, 'Yuni', 'Malang', 'Monitor', 3, 3000000, NULL);",
                  expectRows: [[9, 8980000, 3000000]],
                },
                {
                  name: { en: 'It is a count of rows, not a fixed 8', id: 'Ini menghitung baris, bukan angka 8 yang dipatok' },
                  setup: 'DELETE FROM pesanan WHERE id IN (7, 8);',
                  expectRows: [[6, 3230000, 1200000]],
                },
              ],
              hints: [
                { en: 'Three aggregates in one SELECT list, each with its own AS.', id: 'Tiga agregat dalam satu daftar SELECT, masing-masing dengan AS-nya sendiri.' },
                { en: '"How many orders" counts rows — that is COUNT(*).', id: '"Banyaknya pesanan" menghitung baris — itu COUNT(*).' },
                { en: 'SELECT COUNT(*) AS banyak_pesanan, SUM(total) AS pendapatan, ...', id: 'SELECT COUNT(*) AS banyak_pesanan, SUM(total) AS pendapatan, ...' },
              ],
              solution:
                'SELECT COUNT(*)   AS banyak_pesanan,\n       SUM(total) AS pendapatan,\n       MAX(total) AS terbesar\nFROM pesanan;',
            },
          ],
        },
        {
          id: 'sql-m2-s1-l2',
          title: { en: 'Distinct values, tidy numbers', id: 'Nilai berbeda, angka yang rapi' },
          goal: { en: 'Count what is different, and round what is fractional.', id: 'Menghitung yang berbeda, dan membulatkan yang pecahan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'DISTINCT drops repeats', id: 'DISTINCT membuang pengulangan' },
              body: {
                en: '`SELECT DISTINCT kota FROM pesanan` returns each city once, however many orders came from it. Inside an aggregate, `COUNT(DISTINCT kota)` answers "how many different cities" — a very different number from `COUNT(kota)`, which is just how many rows had one.',
                id: '`SELECT DISTINCT kota FROM pesanan` mengembalikan tiap kota sekali, berapa pun pesanan yang datang darinya. Di dalam agregat, `COUNT(DISTINCT kota)` menjawab "berapa kota yang berbeda" — angka yang sangat berbeda dari `COUNT(kota)`, yang hanya berarti berapa baris yang punya kota.',
              },
              code:
                'SELECT DISTINCT kota FROM pesanan;\n' +
                '-- Surabaya, Jakarta, Bandung\n\n' +
                'SELECT COUNT(DISTINCT kota) AS kota, COUNT(kota) AS baris FROM pesanan;\n' +
                '-- 3, 8',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'AVG gives you a fraction', id: 'AVG memberimu pecahan' },
              body: {
                en: '`AVG` divides, so it returns a fractional number even when every input was whole. `ROUND(x)` rounds to the nearest whole number and `ROUND(x, 2)` keeps two decimals. Round when you present a number, not while you are still calculating with it.',
                id: '`AVG` membagi, jadi ia mengembalikan bilangan pecahan bahkan ketika semua masukannya bulat. `ROUND(x)` membulatkan ke bilangan bulat terdekat dan `ROUND(x, 2)` menyisakan dua desimal. Bulatkan saat kamu menyajikan angkanya, bukan saat kamu masih berhitung dengannya.',
              },
              code: 'SELECT ROUND(AVG(total)) AS rata_rata FROM pesanan;',
              output: 'rata_rata\n747500.0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Four customers placed eight orders between them. What does this return?',
                id: 'Empat pelanggan membuat delapan pesanan. Apa yang dikembalikan ini?',
              },
              code: 'SELECT COUNT(DISTINCT pelanggan) FROM pesanan;',
              options: [
                { en: '4', id: '4' },
                { en: '8', id: '8' },
                { en: '1', id: '1' },
                { en: '32', id: '32' },
              ],
              answer: 0,
              explain: {
                en: 'DISTINCT collapses the repeats first, and only then does COUNT do its counting.',
                id: 'DISTINCT meringkas pengulangannya dulu, dan baru setelah itu COUNT menghitung.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a query for the average order value in Surabaya, rounded.',
                id: 'Susun kueri untuk nilai rata-rata pesanan di Surabaya, dibulatkan.',
              },
              lines: ['SELECT ROUND(AVG(total)) AS rata_rata', 'FROM pesanan', "WHERE kota = 'Surabaya';"],
              explain: {
                en: 'The WHERE narrows the rows; the aggregate then works on what is left.',
                id: 'WHERE mempersempit barisnya; agregatnya lalu bekerja pada yang tersisa.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Looking only at orders of more than one item, return `kota_berbeda` (how many different cities) and `rata_rata` (the average `total`, rounded to a whole number).',
                id: 'Dengan hanya melihat pesanan berisi lebih dari satu barang, kembalikan `kota_berbeda` (berapa kota yang berbeda) dan `rata_rata` (rata-rata `total`, dibulatkan ke bilangan bulat).',
              },
              starter: 'SELECT kota, total FROM pesanan;\n',
              tests: [
                {
                  name: { en: 'Two columns, named right', id: 'Dua kolom, dinamai dengan benar' },
                  expectColumns: ['kota_berbeda', 'rata_rata'],
                },
                {
                  name: { en: 'Two cities, average 997500', id: 'Dua kota, rata-rata 997500' },
                  expectRows: [[2, 997500]],
                },
                {
                  name: { en: 'A third city is counted once', id: 'Kota ketiga terhitung sekali' },
                  setup:
                    "INSERT INTO pesanan VALUES (9, 'Yuni', 'Medan', 'Mouse', 5, 500000, NULL), (10, 'Yuni', 'Medan', 'Mouse', 5, 500000, NULL);",
                  expectRows: [[3, 831667]],
                },
                {
                  name: { en: 'Single-item orders are left out', id: 'Pesanan berisi satu barang ditinggalkan' },
                  setup: "INSERT INTO pesanan VALUES (9, 'Yuni', 'Medan', 'Mouse', 1, 90000, NULL);",
                  expectRows: [[2, 997500]],
                },
              ],
              hints: [
                { en: 'The filter comes first: WHERE jumlah > 1.', id: 'Penyaringnya lebih dulu: WHERE jumlah > 1.' },
                { en: '"How many different" is COUNT(DISTINCT …), not COUNT(…).', id: '"Berapa yang berbeda" adalah COUNT(DISTINCT …), bukan COUNT(…).' },
                { en: 'ROUND wraps the whole average: ROUND(AVG(total)).', id: 'ROUND membungkus seluruh rata-ratanya: ROUND(AVG(total)).' },
              ],
              solution:
                'SELECT COUNT(DISTINCT kota) AS kota_berbeda,\n       ROUND(AVG(total))    AS rata_rata\nFROM pesanan\nWHERE jumlah > 1;',
            },
          ],
        },
      ],
      project: {
        id: 'sql-m2-s1-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: "The Day's Figures", id: 'Angka Hari Ini' },
        brief: {
          en: 'The single row a shop owner wants at closing time: how much moved, how much came in, and how much of it was discounted.',
          id: 'Satu baris yang diinginkan pemilik toko saat tutup: berapa yang bergerak, berapa yang masuk, dan berapa yang didiskon.',
        },
        requirements: [
          { en: 'Return exactly one row with five columns, in this order: `banyak_pesanan`, `barang_terjual`, `pendapatan`, `rata_rata`, `pakai_kupon`.', id: 'Kembalikan tepat satu baris dengan lima kolom, dalam urutan ini: `banyak_pesanan`, `barang_terjual`, `pendapatan`, `rata_rata`, `pakai_kupon`.' },
          { en: '`barang_terjual` is the total of `jumlah`, not the number of orders.', id: '`barang_terjual` adalah jumlah kolom `jumlah`, bukan banyaknya pesanan.' },
          { en: '`rata_rata` is the average `total`, rounded to a whole number.', id: '`rata_rata` adalah rata-rata `total`, dibulatkan ke bilangan bulat.' },
          { en: '`pakai_kupon` counts only the orders that actually have a coupon.', id: '`pakai_kupon` hanya menghitung pesanan yang benar-benar punya kupon.' },
        ],
        starter: 'SELECT COUNT(*) FROM pesanan;\n',
        tests: [
          {
            name: { en: 'Five columns, in the right order', id: 'Lima kolom, dalam urutan yang benar' },
            expectColumns: ['banyak_pesanan', 'barang_terjual', 'pendapatan', 'rata_rata', 'pakai_kupon'],
          },
          {
            name: { en: "Today's figures", id: 'Angka hari ini' },
            expectRows: [[8, 15, 5980000, 747500, 3]],
          },
          {
            name: { en: 'Items sold is not the number of orders', id: 'Barang terjual bukan banyaknya pesanan' },
            setup: "INSERT INTO pesanan VALUES (9, 'Yuni', 'Medan', 'Mouse', 10, 900000, NULL);",
            expectRows: [[9, 25, 6880000, 764444, 3]],
          },
          {
            name: { en: 'A coupon on a new order is counted', id: 'Kupon pada pesanan baru ikut terhitung' },
            setup: "INSERT INTO pesanan VALUES (9, 'Yuni', 'Medan', 'Mouse', 1, 100000, 'HEMAT10');",
            expectRows: [[9, 16, 6080000, 675556, 4]],
          },
          {
            name: { en: 'Orders without a coupon never count towards it', id: 'Pesanan tanpa kupon tidak pernah ikut terhitung' },
            setup: 'UPDATE pesanan SET kupon = NULL;',
            expectRows: [[8, 15, 5980000, 747500, 0]],
          },
          {
            name: { en: 'It follows a shrinking table', id: 'Ia mengikuti tabel yang menyusut' },
            setup: 'DELETE FROM pesanan WHERE id > 4;',
            expectRows: [[4, 5, 1820000, 455000, 1]],
          },
        ],
        hints: [
          { en: 'Five aggregates, one SELECT, no WHERE — the whole table is the group.', id: 'Lima agregat, satu SELECT, tanpa WHERE — seluruh tabel adalah kelompoknya.' },
          { en: 'SUM(jumlah) and COUNT(*) answer different questions; one test exists to tell them apart.', id: 'SUM(jumlah) dan COUNT(*) menjawab pertanyaan berbeda; ada satu tes untuk membedakannya.' },
          { en: 'COUNT(kupon) skips NULL all by itself — you do not need a WHERE for it.', id: 'COUNT(kupon) melewati NULL dengan sendirinya — kamu tidak butuh WHERE untuk itu.' },
        ],
        solution:
          'SELECT COUNT(*)          AS banyak_pesanan,\n' +
          '       SUM(jumlah)       AS barang_terjual,\n' +
          '       SUM(total)        AS pendapatan,\n' +
          '       ROUND(AVG(total)) AS rata_rata,\n' +
          '       COUNT(kupon)      AS pakai_kupon\n' +
          'FROM pesanan;',
        xp: 50,
      },
    },
    {
      id: 'sql-m2-s2',
      title: { en: 'One Row Per Group', id: 'Satu Baris per Kelompok' },
      summary: {
        en: 'GROUP BY makes the buckets; HAVING throws some of the buckets away.',
        id: 'GROUP BY membuat embernya; HAVING membuang sebagian embernya.',
      },
      lessons: [
        {
          id: 'sql-m2-s2-l1',
          title: { en: 'GROUP BY', id: 'GROUP BY' },
          goal: { en: 'Get one summary row per category.', id: 'Mendapat satu baris rangkuman per kategori.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Buckets, then one row each', id: 'Ember, lalu satu baris untuk tiap ember' },
              body: {
                en: '`GROUP BY kota` sorts the rows into one bucket per city. Every aggregate in the `SELECT` then runs **inside each bucket** on its own, and you get one output row per bucket. Nothing else about the query changes.',
                id: '`GROUP BY kota` memilah barisnya menjadi satu ember per kota. Tiap agregat di `SELECT` lalu berjalan **di dalam tiap ember** sendiri-sendiri, dan kamu menerima satu baris keluaran per ember. Tidak ada bagian lain dari kuerinya yang berubah.',
              },
              code: 'SELECT kota, COUNT(*) AS pesanan, SUM(total) AS pendapatan\nFROM pesanan\nGROUP BY kota;',
              output:
                'kota      pesanan  pendapatan\n' +
                'Bandung   2        1550000\n' +
                'Jakarta   2        1230000\n' +
                'Surabaya  4        3200000',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Every plain column must be a grouping column', id: 'Tiap kolom polos harus jadi kolom pengelompokan' },
              body: {
                en: 'If you group by `kota` and also select `pelanggan`, the question has no answer — a bucket holds several customers, and only one can fit in the cell. SQLite quietly picks one; most other databases refuse the query outright. Select the grouping columns and aggregates, nothing else.',
                id: 'Kalau kamu mengelompokkan berdasarkan `kota` dan juga memilih `pelanggan`, pertanyaannya tak punya jawaban — satu ember berisi beberapa pelanggan, dan hanya satu yang muat di selnya. SQLite diam-diam memilih salah satu; kebanyakan basis data lain menolak kuerinya mentah-mentah. Pilih kolom pengelompokan dan agregat saja, tidak lebih.',
              },
              code: {
                en:
                  '-- misleading: which customer?\n' +
                  'SELECT kota, pelanggan, SUM(total) FROM pesanan GROUP BY kota;\n\n' +
                  '-- clear: group by both\n' +
                  'SELECT kota, pelanggan, SUM(total) FROM pesanan GROUP BY kota, pelanggan;',
                id:
                  '-- menyesatkan: pelanggan yang mana?\n' +
                  'SELECT kota, pelanggan, SUM(total) FROM pesanan GROUP BY kota;\n\n' +
                  '-- jelas: kelompokkan berdasarkan keduanya\n' +
                  'SELECT kota, pelanggan, SUM(total) FROM pesanan GROUP BY kota, pelanggan;',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'You may sort by an aggregate', id: 'Kamu boleh mengurutkan berdasarkan agregat' },
              body: {
                en: '`ORDER BY` runs last of all, on the finished result — so it can sort by an aggregate, and it can use the alias you gave that aggregate. This is the ordinary way to write "the biggest earners first".',
                id: '`ORDER BY` berjalan paling akhir, pada hasil yang sudah jadi — jadi ia bisa mengurutkan berdasarkan agregat, dan bisa memakai alias yang kamu berikan pada agregat itu. Ini cara biasa menulis "penghasil terbesar dulu".',
              },
              code: 'SELECT kota, SUM(total) AS pendapatan\nFROM pesanan\nGROUP BY kota\nORDER BY pendapatan DESC;',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The eight orders come from three cities. How many rows does this return?',
                id: 'Delapan pesanan itu datang dari tiga kota. Berapa baris yang dikembalikan ini?',
              },
              code: 'SELECT kota, COUNT(*) FROM pesanan GROUP BY kota;',
              options: [
                { en: '3 — one per city', id: '3 — satu per kota' },
                { en: '8 — one per order', id: '8 — satu per pesanan' },
                { en: '1 — aggregates always return one row', id: '1 — agregat selalu mengembalikan satu baris' },
                { en: '24', id: '24' },
              ],
              answer: 0,
              explain: {
                en: 'One row per bucket, and GROUP BY kota makes one bucket per distinct city.',
                id: 'Satu baris per ember, dan GROUP BY kota membuat satu ember per kota yang berbeda.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'For each city, return `kota` and `pendapatan` (the sum of `total`), biggest earner first.',
                id: 'Untuk tiap kota, kembalikan `kota` dan `pendapatan` (jumlah kolom `total`), penghasil terbesar dulu.',
              },
              starter: 'SELECT kota, total FROM pesanan;\n',
              tests: [
                {
                  name: { en: 'Two columns, kota and pendapatan', id: 'Dua kolom, kota dan pendapatan' },
                  expectColumns: ['kota', 'pendapatan'],
                },
                {
                  name: { en: 'One row per city, biggest first', id: 'Satu baris per kota, terbesar dulu' },
                  ordered: true,
                  expectRows: [
                    ['Surabaya', 3200000],
                    ['Bandung', 1550000],
                    ['Jakarta', 1230000],
                  ],
                },
                {
                  name: { en: 'A new city gets its own row', id: 'Kota baru mendapat barisnya sendiri' },
                  setup: "INSERT INTO pesanan VALUES (9, 'Yuni', 'Medan', 'Monitor', 1, 2000000, NULL);",
                  ordered: true,
                  expectRows: [
                    ['Surabaya', 3200000],
                    ['Medan', 2000000],
                    ['Bandung', 1550000],
                    ['Jakarta', 1230000],
                  ],
                },
                {
                  name: { en: 'The order follows the money', id: 'Urutannya mengikuti uangnya' },
                  setup: "UPDATE pesanan SET total = 9000000 WHERE kota = 'Jakarta' AND id = 2;",
                  ordered: true,
                  expectRows: [
                    ['Jakarta', 10050000],
                    ['Surabaya', 3200000],
                    ['Bandung', 1550000],
                  ],
                },
              ],
              hints: [
                { en: 'GROUP BY goes after FROM and before ORDER BY.', id: 'GROUP BY ditulis setelah FROM dan sebelum ORDER BY.' },
                { en: 'The SELECT list holds only the grouping column and the aggregate.', id: 'Daftar SELECT-nya hanya berisi kolom pengelompokan dan agregatnya.' },
                { en: 'ORDER BY can name the alias: ORDER BY pendapatan DESC.', id: 'ORDER BY boleh menyebut aliasnya: ORDER BY pendapatan DESC.' },
              ],
              solution:
                'SELECT kota, SUM(total) AS pendapatan\nFROM pesanan\nGROUP BY kota\nORDER BY pendapatan DESC;',
            },
          ],
        },
        {
          id: 'sql-m2-s2-l2',
          title: { en: 'Filtering the groups', id: 'Menyaring kelompoknya' },
          goal: { en: 'Use HAVING, and know why WHERE cannot do it.', id: 'Memakai HAVING, dan tahu mengapa WHERE tak bisa melakukannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'WHERE filters rows, HAVING filters groups', id: 'WHERE menyaring baris, HAVING menyaring kelompok' },
              body: {
                en: 'The clauses run in a fixed order: `FROM`, then `WHERE`, then `GROUP BY`, then `HAVING`, then `SELECT`, then `ORDER BY`. `WHERE` happens before the buckets exist, so it cannot mention a total. `HAVING` happens after, so it can.',
                id: 'Klausanya berjalan dalam urutan tetap: `FROM`, lalu `WHERE`, lalu `GROUP BY`, lalu `HAVING`, lalu `SELECT`, lalu `ORDER BY`. `WHERE` terjadi sebelum embernya ada, jadi ia tak bisa menyebut sebuah total. `HAVING` terjadi sesudahnya, jadi ia bisa.',
              },
              code: {
                en:
                  'SELECT kota, SUM(total) AS pendapatan\n' +
                  'FROM pesanan\n' +
                  'WHERE jumlah > 0          -- discards rows\n' +
                  'GROUP BY kota\n' +
                  'HAVING SUM(total) > 1500000;  -- discards groups',
                id:
                  'SELECT kota, SUM(total) AS pendapatan\n' +
                  'FROM pesanan\n' +
                  'WHERE jumlah > 0          -- membuang baris\n' +
                  'GROUP BY kota\n' +
                  'HAVING SUM(total) > 1500000;  -- membuang kelompok',
              },
              output: 'kota      pendapatan\nBandung   1550000\nSurabaya  3200000',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'An aggregate in WHERE is an error', id: 'Agregat di dalam WHERE adalah kesalahan' },
              body: {
                en: 'Writing `WHERE SUM(total) > 1500000` fails, and the message is often unhelpful. The reason is simply timing: when `WHERE` runs, there are no groups yet, so there is nothing to sum. If a condition talks about a group, it belongs in `HAVING`.',
                id: 'Menulis `WHERE SUM(total) > 1500000` gagal, dan pesannya sering tidak membantu. Alasannya sekadar waktu: saat `WHERE` berjalan, belum ada kelompok apa pun, jadi tidak ada yang bisa dijumlahkan. Kalau sebuah kondisi berbicara tentang kelompok, tempatnya di `HAVING`.',
              },
              code: {
                en:
                  '-- wrong\nSELECT kota FROM pesanan WHERE SUM(total) > 1500000 GROUP BY kota;\n\n' +
                  '-- correct\nSELECT kota FROM pesanan GROUP BY kota HAVING SUM(total) > 1500000;',
                id:
                  '-- salah\nSELECT kota FROM pesanan WHERE SUM(total) > 1500000 GROUP BY kota;\n\n' +
                  '-- benar\nSELECT kota FROM pesanan GROUP BY kota HAVING SUM(total) > 1500000;',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You want the cities whose orders average over 500000. Where does that condition go?',
                id: 'Kamu ingin kota yang rata-rata pesanannya di atas 500000. Di mana kondisi itu ditulis?',
              },
              options: [
                { en: 'HAVING — it is about a group', id: 'HAVING — ia tentang sebuah kelompok' },
                { en: 'WHERE — it is a condition like any other', id: 'WHERE — ia kondisi seperti yang lain' },
                { en: 'ORDER BY', id: 'ORDER BY' },
                { en: 'It cannot be expressed in SQL', id: 'Ia tak bisa diungkapkan dalam SQL' },
              ],
              answer: 0,
              explain: {
                en: 'An average only exists once the rows are grouped, and HAVING is the clause that runs after that.',
                id: 'Rata-rata baru ada setelah barisnya dikelompokkan, dan HAVING adalah klausa yang berjalan sesudah itu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the query for products ordered more than twice.',
                id: 'Lengkapi kueri untuk produk yang dipesan lebih dari dua kali.',
              },
              template: 'SELECT produk FROM pesanan ___ produk ___ COUNT(*) > 2;',
              blanks: ['GROUP BY', 'HAVING'],
              explain: {
                en: 'GROUP BY builds one bucket per product; HAVING then discards the small ones.',
                id: 'GROUP BY membangun satu ember per produk; HAVING lalu membuang yang kecil.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `pelanggan` and `banyak_pesanan` for the customers who ordered more than once. Most orders first, and ties broken by name, A to Z.',
                id: 'Kembalikan `pelanggan` dan `banyak_pesanan` untuk pelanggan yang memesan lebih dari sekali. Yang terbanyak dulu, dan seri dipisah berdasarkan nama, A ke Z.',
              },
              starter: 'SELECT pelanggan, COUNT(*) AS banyak_pesanan\nFROM pesanan\nGROUP BY pelanggan;\n',
              tests: [
                {
                  name: { en: 'Two columns, named right', id: 'Dua kolom, dinamai dengan benar' },
                  expectColumns: ['pelanggan', 'banyak_pesanan'],
                },
                {
                  name: { en: 'Three repeat customers, in order', id: 'Tiga pelanggan berulang, dalam urutan' },
                  ordered: true,
                  expectRows: [
                    ['Rina', 3],
                    ['Budi', 2],
                    ['Sari', 2],
                  ],
                },
                {
                  name: { en: 'A one-order customer stays out', id: 'Pelanggan dengan satu pesanan tetap di luar' },
                  setup: "INSERT INTO pesanan VALUES (9, 'Yuni', 'Medan', 'Mouse', 1, 90000, NULL);",
                  ordered: true,
                  expectRows: [
                    ['Rina', 3],
                    ['Budi', 2],
                    ['Sari', 2],
                  ],
                },
                {
                  name: { en: 'A second order lets them in', id: 'Pesanan kedua memasukkan mereka' },
                  setup:
                    "INSERT INTO pesanan VALUES (9, 'Tono', 'Surabaya', 'Mouse', 1, 90000, NULL), (10, 'Tono', 'Surabaya', 'Mouse', 1, 90000, NULL);",
                  ordered: true,
                  expectRows: [
                    ['Rina', 3],
                    ['Tono', 3],
                    ['Budi', 2],
                    ['Sari', 2],
                  ],
                },
              ],
              hints: [
                { en: 'The starter already groups. What it is missing is the filter on the groups.', id: 'Starter-nya sudah mengelompokkan. Yang kurang adalah penyaring pada kelompoknya.' },
                { en: 'Two sort keys, separated by a comma — the second one breaks the ties.', id: 'Dua kunci pengurutan, dipisah koma — yang kedua memutus serinya.' },
                { en: 'HAVING COUNT(*) > 1 … ORDER BY banyak_pesanan DESC, pelanggan', id: 'HAVING COUNT(*) > 1 … ORDER BY banyak_pesanan DESC, pelanggan' },
              ],
              solution:
                'SELECT pelanggan, COUNT(*) AS banyak_pesanan\n' +
                'FROM pesanan\n' +
                'GROUP BY pelanggan\n' +
                'HAVING COUNT(*) > 1\n' +
                'ORDER BY banyak_pesanan DESC, pelanggan;',
            },
          ],
        },
      ],
      project: {
        id: 'sql-m2-s2-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: 'The Product Report', id: 'Rapor Produk' },
        brief: {
          en: 'Which products are actually carrying the shop? One row each, and only for the ones that matter.',
          id: 'Produk mana yang sebenarnya menopang toko ini? Satu baris untuk tiap produk, dan hanya untuk yang berarti.',
        },
        requirements: [
          { en: 'Return three columns: `produk`, `terjual` (the total of `jumlah`), and `pendapatan` (the total of `total`).', id: 'Kembalikan tiga kolom: `produk`, `terjual` (jumlah kolom `jumlah`), dan `pendapatan` (jumlah kolom `total`).' },
          { en: 'Ignore orders whose `total` is below 100000 — they are too small to report on.', id: 'Abaikan pesanan yang `total`-nya di bawah 100000 — terlalu kecil untuk dilaporkan.' },
          { en: 'One row per product.', id: 'Satu baris per produk.' },
          { en: 'Keep only products whose reported `pendapatan` reaches 1000000 or more.', id: 'Sisakan hanya produk yang `pendapatan` terlaporkannya mencapai 1000000 atau lebih.' },
          { en: 'Biggest earner first.', id: 'Penghasil terbesar dulu.' },
        ],
        starter: 'SELECT produk, jumlah, total FROM pesanan;\n',
        tests: [
          {
            name: { en: 'Three columns, named right', id: 'Tiga kolom, dinamai dengan benar' },
            expectColumns: ['produk', 'terjual', 'pendapatan'],
          },
          {
            name: { en: 'Two products make the report', id: 'Dua produk masuk laporan' },
            ordered: true,
            expectRows: [
              ['Monitor', 3, 3600000],
              ['Keyboard', 5, 1750000],
            ],
          },
          {
            name: { en: 'A small order is left out of the totals', id: 'Pesanan kecil ditinggalkan dari totalnya' },
            setup: "INSERT INTO pesanan VALUES (9, 'Rina', 'Surabaya', 'Monitor', 1, 50000, NULL);",
            ordered: true,
            expectRows: [
              ['Monitor', 3, 3600000],
              ['Keyboard', 5, 1750000],
            ],
          },
          {
            name: { en: 'A product can earn its way in', id: 'Sebuah produk bisa mendapatkan tempatnya' },
            setup: "INSERT INTO pesanan VALUES (9, 'Tono', 'Surabaya', 'Mouse', 10, 900000, NULL);",
            ordered: true,
            expectRows: [
              ['Monitor', 3, 3600000],
              ['Keyboard', 5, 1750000],
              ['Mouse', 16, 1440000],
            ],
          },
          {
            name: { en: 'Exactly 1000000 is enough', id: 'Tepat 1000000 sudah cukup' },
            setup: 'DELETE FROM pesanan WHERE id IN (5, 7);\nUPDATE pesanan SET total = 1000000 WHERE id = 1;',
            ordered: true,
            expectRows: [
              ['Monitor', 3, 3600000],
              ['Keyboard', 1, 1000000],
            ],
          },
          {
            name: { en: 'The order follows the money', id: 'Urutannya mengikuti uangnya' },
            setup: 'UPDATE pesanan SET total = 5000000 WHERE id = 5;',
            ordered: true,
            expectRows: [
              ['Keyboard', 5, 5700000],
              ['Monitor', 3, 3600000],
            ],
          },
        ],
        hints: [
          { en: 'Both filters appear: one on rows, one on groups. They are different clauses.', id: 'Kedua penyaringnya muncul: satu pada baris, satu pada kelompok. Keduanya klausa berbeda.' },
          { en: '"Reaches 1000000 or more" is >=, and one test checks the boundary exactly.', id: '"Mencapai 1000000 atau lebih" adalah >=, dan satu tes memeriksa batasnya persis.' },
          { en: 'FROM, WHERE, GROUP BY, HAVING, ORDER BY — write them in that order and it falls out.', id: 'FROM, WHERE, GROUP BY, HAVING, ORDER BY — tulis dalam urutan itu dan jawabannya muncul sendiri.' },
        ],
        solution:
          'SELECT produk,\n' +
          '       SUM(jumlah) AS terjual,\n' +
          '       SUM(total)  AS pendapatan\n' +
          'FROM pesanan\n' +
          'WHERE total >= 100000\n' +
          'GROUP BY produk\n' +
          'HAVING SUM(total) >= 1000000\n' +
          'ORDER BY pendapatan DESC;',
        xp: 50,
      },
    },
  ],
}
