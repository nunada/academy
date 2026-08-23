import type { Module } from '../types'

/** Module 3 — the point of a *relational* database: rows in one table that
 *  point at rows in another. */

/** Three tables with two deliberate gaps: class X-C has no students, and Eka
 *  has neither a class nor a score. Those two rows are what make the
 *  difference between JOIN and LEFT JOIN visible instead of academic. */
const SCHEMA = `CREATE TABLE kelas (
  id   INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  guru TEXT NOT NULL
);

CREATE TABLE siswa (
  id       INTEGER PRIMARY KEY,
  nama     TEXT NOT NULL,
  kelas_id INTEGER REFERENCES kelas(id)   -- NULL = belum ditempatkan
);

CREATE TABLE nilai (
  id       INTEGER PRIMARY KEY,
  siswa_id INTEGER NOT NULL REFERENCES siswa(id),
  mapel    TEXT    NOT NULL,
  skor     INTEGER NOT NULL
);

INSERT INTO kelas VALUES
  (1, 'X-A', 'Bu Ratna'),
  (2, 'X-B', 'Pak Anwar'),
  (3, 'X-C', 'Bu Sinta');

INSERT INTO siswa VALUES
  (1, 'Adi',    1),
  (2, 'Bela',   1),
  (3, 'Candra', 2),
  (4, 'Dina',   2),
  (5, 'Eka',    NULL);

INSERT INTO nilai VALUES
  (1, 1, 'Matematika', 88),
  (2, 1, 'Biologi',    75),
  (3, 2, 'Matematika', 92),
  (4, 3, 'Matematika', 64),
  (5, 3, 'Biologi',    81),
  (6, 4, 'Matematika', 79),
  (7, 4, 'Biologi',    95),
  (8, 2, 'Biologi',    70);`

export const module3: Module = {
  id: 'sql-m3',
  title: { en: 'More Than One Table', id: 'Lebih dari Satu Tabel' },
  summary: {
    en: 'Follow the key from one table to another — and decide what to do about the rows with no match.',
    id: 'Mengikuti kunci dari satu tabel ke tabel lain — dan memutuskan apa yang dilakukan pada baris yang tak berpasangan.',
  },
  submodules: [
    {
      id: 'sql-m3-s1',
      title: { en: 'Joining', id: 'Menggabungkan' },
      summary: {
        en: 'Keys, JOIN … ON, and queries that reach across three tables.',
        id: 'Kunci, JOIN … ON, dan kueri yang menjangkau tiga tabel.',
      },
      lessons: [
        {
          id: 'sql-m3-s1-l1',
          title: { en: 'Following a key', id: 'Mengikuti sebuah kunci' },
          goal: { en: 'Combine two tables into one result.', id: 'Menggabungkan dua tabel menjadi satu hasil.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Why the data is split up', id: 'Mengapa datanya dipecah' },
              body: {
                en: 'You could store the teacher\'s name on every student row. Then a teacher who changes school means editing thirty rows, and missing one leaves the database saying two different things at once. So the class lives in its own table, once, and each student keeps only a **foreign key**: `kelas_id`, the `id` of its class.',
                id: 'Kamu bisa saja menyimpan nama gurunya di tiap baris siswa. Lalu seorang guru yang pindah sekolah berarti menyunting tiga puluh baris, dan satu yang terlewat membuat basis datanya mengatakan dua hal berbeda sekaligus. Maka kelasnya hidup di tabelnya sendiri, sekali, dan tiap siswa hanya menyimpan sebuah **kunci asing**: `kelas_id`, yaitu `id` kelasnya.',
              },
              code: 'kelas:  id=1, nama=X-A, guru=Bu Ratna\nsiswa:  id=1, nama=Adi,  kelas_id=1   -- menunjuk ke kelas 1',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'JOIN … ON puts them back together', id: 'JOIN … ON menyatukannya kembali' },
              body: {
                en: '`JOIN` names the second table and `ON` says how a row in one lines up with a row in the other. The result has the columns of both. Rows with no partner on either side are simply not there — that is what makes it an *inner* join.',
                id: '`JOIN` menyebut tabel keduanya dan `ON` menyatakan bagaimana satu baris di sini berpasangan dengan satu baris di sana. Hasilnya memuat kolom dari keduanya. Baris yang tak punya pasangan di salah satu sisi sekadar tidak ada — itulah yang membuatnya join *dalam*.',
              },
              code:
                'SELECT siswa.nama, kelas.nama, kelas.guru\n' +
                'FROM siswa\n' +
                'JOIN kelas ON kelas.id = siswa.kelas_id;',
              output:
                'nama    nama  guru\n' +
                'Adi     X-A   Bu Ratna\n' +
                'Bela    X-A   Bu Ratna\n' +
                'Candra  X-B   Pak Anwar\n' +
                'Dina    X-B   Pak Anwar',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Aliases, and saying which nama you mean', id: 'Alias, dan menyatakan nama yang mana' },
              body: {
                en: 'Both tables have a column called `nama`, so a bare `nama` is ambiguous. Write `siswa.nama`, or give the table a short alias — `FROM siswa s` — and write `s.nama`. Aliases are not decoration: past two tables, a query without them becomes very hard to read.',
                id: 'Kedua tabel punya kolom bernama `nama`, jadi `nama` polos itu ambigu. Tulis `siswa.nama`, atau beri tabelnya alias pendek — `FROM siswa s` — lalu tulis `s.nama`. Alias bukan hiasan: lewat dua tabel, kueri tanpa alias jadi sangat sulit dibaca.',
              },
              code:
                'SELECT s.nama AS siswa, k.nama AS kelas\n' +
                'FROM siswa s\n' +
                'JOIN kelas k ON k.id = s.kelas_id;',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'There are 5 students, but one of them has no class. How many rows does the inner join return?',
                id: 'Ada 5 siswa, tapi salah satunya belum punya kelas. Berapa baris yang dikembalikan join dalam itu?',
              },
              code: 'SELECT s.nama FROM siswa s JOIN kelas k ON k.id = s.kelas_id;',
              options: [
                { en: '4 — the student with no class drops out', id: '4 — siswa tanpa kelas itu gugur' },
                { en: '5 — every student is listed', id: '5 — tiap siswa terdaftar' },
                { en: '15 — every student against every class', id: '15 — tiap siswa dipasangkan tiap kelas' },
                { en: '3 — one row per class', id: '3 — satu baris per kelas' },
              ],
              answer: 0,
              explain: {
                en: 'An inner join keeps only rows that matched. Silently losing a row this way is one of the most common bugs in SQL.',
                id: 'Join dalam hanya menyimpan baris yang berpasangan. Kehilangan baris diam-diam seperti ini salah satu kutu paling umum di SQL.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the join between the two tables.',
                id: 'Lengkapi penggabungan antara kedua tabel.',
              },
              template: 'SELECT s.nama, k.guru FROM siswa s ___ kelas k ___ k.id = s.kelas_id;',
              blanks: ['JOIN', 'ON'],
              explain: {
                en: 'JOIN names the other table; ON gives the rule that pairs the rows.',
                id: 'JOIN menyebut tabel satunya; ON memberi aturan yang memasangkan barisnya.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `siswa` (the student\'s name) and `kelas` (their class name) for every student who has a class, sorted by student name.',
                id: 'Kembalikan `siswa` (nama siswanya) dan `kelas` (nama kelasnya) untuk tiap siswa yang punya kelas, urut nama siswa.',
              },
              starter: 'SELECT nama AS siswa FROM siswa ORDER BY nama;\n',
              tests: [
                {
                  name: { en: 'Two columns, siswa and kelas', id: 'Dua kolom, siswa dan kelas' },
                  expectColumns: ['siswa', 'kelas'],
                },
                {
                  name: { en: 'Four placed students, in order', id: 'Empat siswa yang ditempatkan, dalam urutan' },
                  ordered: true,
                  expectRows: [
                    ['Adi', 'X-A'],
                    ['Bela', 'X-A'],
                    ['Candra', 'X-B'],
                    ['Dina', 'X-B'],
                  ],
                },
                {
                  name: { en: 'Moving a student moves the class name', id: 'Memindah siswa ikut memindah nama kelasnya' },
                  setup: "UPDATE siswa SET kelas_id = 3 WHERE nama = 'Bela';",
                  ordered: true,
                  expectRows: [
                    ['Adi', 'X-A'],
                    ['Bela', 'X-C'],
                    ['Candra', 'X-B'],
                    ['Dina', 'X-B'],
                  ],
                },
                {
                  name: { en: 'A newly placed student appears', id: 'Siswa yang baru ditempatkan ikut muncul' },
                  setup: "UPDATE siswa SET kelas_id = 2 WHERE nama = 'Eka';",
                  ordered: true,
                  expectRows: [
                    ['Adi', 'X-A'],
                    ['Bela', 'X-A'],
                    ['Candra', 'X-B'],
                    ['Dina', 'X-B'],
                    ['Eka', 'X-B'],
                  ],
                },
              ],
              hints: [
                { en: 'Two tables in the FROM: siswa, joined to kelas.', id: 'Dua tabel di FROM: siswa, digabung ke kelas.' },
                { en: 'The rule is k.id = s.kelas_id — the key on one side, the id on the other.', id: 'Aturannya k.id = s.kelas_id — kuncinya di satu sisi, id-nya di sisi lain.' },
                { en: 'Both tables have `nama`, so both need renaming with AS.', id: 'Kedua tabel punya `nama`, jadi keduanya perlu diganti nama dengan AS.' },
              ],
              solution:
                'SELECT s.nama AS siswa, k.nama AS kelas\n' +
                'FROM siswa s\n' +
                'JOIN kelas k ON k.id = s.kelas_id\n' +
                'ORDER BY s.nama;',
            },
          ],
        },
        {
          id: 'sql-m3-s1-l2',
          title: { en: 'Three tables, one question', id: 'Tiga tabel, satu pertanyaan' },
          goal: { en: 'Chain joins, and aggregate across them.', id: 'Merangkai join, dan mengagregasi lintas tabel.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A join is a step, and steps chain', id: 'Join adalah satu langkah, dan langkah bisa dirangkai' },
              body: {
                en: 'Each `JOIN` adds one more table to what you have so far. A score points at a student, and a student points at a class, so two joins take you from a score all the way to a teacher. Order the joins the way the keys point and the query almost writes itself.',
                id: 'Tiap `JOIN` menambahkan satu tabel lagi ke apa yang sudah kamu punya. Sebuah nilai menunjuk ke siswa, dan siswa menunjuk ke kelas, jadi dua join membawamu dari sebuah nilai sampai ke gurunya. Urutkan join-nya mengikuti arah kuncinya dan kuerinya hampir menulis dirinya sendiri.',
              },
              code:
                'SELECT n.mapel, n.skor, s.nama AS siswa, k.guru\n' +
                'FROM nilai n\n' +
                'JOIN siswa s ON s.id = n.siswa_id\n' +
                'JOIN kelas k ON k.id = s.kelas_id;',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Group the joined rows', id: 'Kelompokkan baris hasil gabungannya' },
              body: {
                en: 'Once the tables are joined, everything from the last module still applies: the result is just rows, so `GROUP BY` buckets them and the aggregates run per bucket. Grouping by a column from *another* table is the normal way to write "per class" or "per teacher".',
                id: 'Setelah tabelnya digabung, semua dari modul lalu tetap berlaku: hasilnya sekadar baris, jadi `GROUP BY` mengembernya dan agregatnya berjalan per ember. Mengelompokkan berdasarkan kolom dari tabel *lain* adalah cara biasa menulis "per kelas" atau "per guru".',
              },
              code:
                'SELECT k.nama AS kelas, COUNT(*) AS banyak_nilai\n' +
                'FROM nilai n\n' +
                'JOIN siswa s ON s.id = n.siswa_id\n' +
                'JOIN kelas k ON k.id = s.kelas_id\n' +
                'GROUP BY k.nama;',
              output: 'kelas  banyak_nilai\nX-A    4\nX-B    4',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does class X-C not appear in the query above?',
                id: 'Mengapa kelas X-C tidak muncul di kueri di atas?',
              },
              options: [
                { en: 'It has no students, so no score row ever reaches it', id: 'Ia tak punya siswa, jadi tak ada baris nilai yang sampai kepadanya' },
                { en: 'GROUP BY skips groups of zero', id: 'GROUP BY melewati kelompok yang nol' },
                { en: 'COUNT(*) cannot return 0', id: 'COUNT(*) tak bisa mengembalikan 0' },
                { en: 'Its name sorts last', id: 'Namanya terurut paling akhir' },
              ],
              answer: 0,
              explain: {
                en: 'The grouping never sees it: the inner joins dropped it long before GROUP BY ran. The next submodule is about fixing exactly this.',
                id: 'Pengelompokannya tak pernah melihatnya: join dalamnya sudah membuangnya jauh sebelum GROUP BY berjalan. Submodul berikutnya membahas persis perbaikan ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble the average score per subject.',
                id: 'Susun rata-rata skor per mata pelajaran.',
              },
              lines: [
                'SELECT n.mapel, ROUND(AVG(n.skor), 2) AS rata_rata',
                'FROM nilai n',
                'JOIN siswa s ON s.id = n.siswa_id',
                'GROUP BY n.mapel',
                'ORDER BY rata_rata DESC;',
              ],
              explain: {
                en: 'FROM and its joins first, then grouping, then the sort — the order never varies.',
                id: 'FROM dan join-nya dulu, lalu pengelompokan, lalu pengurutan — urutannya tak pernah berubah.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'For each class that has scores, return `kelas` and `rata_rata` — the average score, rounded to two decimals — best average first.',
                id: 'Untuk tiap kelas yang punya nilai, kembalikan `kelas` dan `rata_rata` — rata-rata skornya, dibulatkan dua desimal — rata-rata terbaik dulu.',
              },
              starter: 'SELECT skor FROM nilai;\n',
              tests: [
                {
                  name: { en: 'Two columns, kelas and rata_rata', id: 'Dua kolom, kelas dan rata_rata' },
                  expectColumns: ['kelas', 'rata_rata'],
                },
                {
                  name: { en: 'X-A just edges out X-B', id: 'X-A unggul tipis atas X-B' },
                  ordered: true,
                  expectRows: [
                    ['X-A', 81.25],
                    ['X-B', 79.75],
                  ],
                },
                {
                  name: { en: 'A new score changes the average', id: 'Nilai baru mengubah rata-ratanya' },
                  setup: "INSERT INTO nilai VALUES (9, 3, 'Kimia', 100);",
                  ordered: true,
                  expectRows: [
                    ['X-B', 83.8],
                    ['X-A', 81.25],
                  ],
                },
                {
                  name: { en: 'It follows the student to their new class', id: 'Ia mengikuti siswanya ke kelas barunya' },
                  setup: "UPDATE siswa SET kelas_id = 2 WHERE nama = 'Bela';",
                  ordered: true,
                  expectRows: [
                    ['X-A', 81.5],
                    ['X-B', 80.17],
                  ],
                },
              ],
              hints: [
                { en: 'Start from `nilai`, because that is where the scores live, then join your way to `kelas`.', id: 'Mulai dari `nilai`, karena di situlah skornya berada, lalu gabungkan sampai ke `kelas`.' },
                { en: 'Two joins: nilai → siswa, then siswa → kelas.', id: 'Dua join: nilai → siswa, lalu siswa → kelas.' },
                { en: 'GROUP BY k.nama, and ROUND(AVG(n.skor), 2) for the average.', id: 'GROUP BY k.nama, dan ROUND(AVG(n.skor), 2) untuk rata-ratanya.' },
              ],
              solution:
                'SELECT k.nama AS kelas, ROUND(AVG(n.skor), 2) AS rata_rata\n' +
                'FROM nilai n\n' +
                'JOIN siswa s ON s.id = n.siswa_id\n' +
                'JOIN kelas k ON k.id = s.kelas_id\n' +
                'GROUP BY k.nama\n' +
                'ORDER BY rata_rata DESC;',
            },
          ],
        },
      ],
      project: {
        id: 'sql-m3-s1-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: 'The Class Scoreboard', id: 'Papan Nilai Kelas' },
        brief: {
          en: 'One line per class, for the noticeboard outside the staff room.',
          id: 'Satu baris per kelas, untuk papan pengumuman di depan ruang guru.',
        },
        requirements: [
          { en: 'Return five columns, in this order: `kelas`, `guru`, `banyak_nilai`, `rata_rata`, `tertinggi`.', id: 'Kembalikan lima kolom, dalam urutan ini: `kelas`, `guru`, `banyak_nilai`, `rata_rata`, `tertinggi`.' },
          { en: 'Reach from `nilai` through `siswa` to `kelas`.', id: 'Jangkau dari `nilai` lewat `siswa` sampai ke `kelas`.' },
          { en: '`rata_rata` is rounded to two decimals; `tertinggi` is the best single score.', id: '`rata_rata` dibulatkan dua desimal; `tertinggi` adalah skor tunggal terbaik.' },
          { en: 'One row per class, best average first.', id: 'Satu baris per kelas, rata-rata terbaik dulu.' },
        ],
        starter: 'SELECT n.mapel, n.skor\nFROM nilai n\nJOIN siswa s ON s.id = n.siswa_id;\n',
        tests: [
          {
            name: { en: 'Five columns, in the right order', id: 'Lima kolom, dalam urutan yang benar' },
            expectColumns: ['kelas', 'guru', 'banyak_nilai', 'rata_rata', 'tertinggi'],
          },
          {
            name: { en: 'Both classes, best average first', id: 'Kedua kelasnya, rata-rata terbaik dulu' },
            ordered: true,
            expectRows: [
              ['X-A', 'Bu Ratna', 4, 81.25, 92],
              ['X-B', 'Pak Anwar', 4, 79.75, 95],
            ],
          },
          {
            name: { en: 'The teacher travels with the class', id: 'Gurunya ikut bersama kelasnya' },
            setup: "UPDATE kelas SET guru = 'Pak Joko' WHERE nama = 'X-A';",
            ordered: true,
            expectRows: [
              ['X-A', 'Pak Joko', 4, 81.25, 92],
              ['X-B', 'Pak Anwar', 4, 79.75, 95],
            ],
          },
          {
            name: { en: 'A new score counts everywhere', id: 'Nilai baru terhitung di mana-mana' },
            setup: "INSERT INTO nilai VALUES (9, 1, 'Kimia', 100);",
            ordered: true,
            expectRows: [
              ['X-A', 'Bu Ratna', 5, 85, 100],
              ['X-B', 'Pak Anwar', 4, 79.75, 95],
            ],
          },
          {
            name: { en: 'A class with no scores is not on the board', id: 'Kelas tanpa nilai tidak ada di papannya' },
            setup: "INSERT INTO siswa VALUES (6, 'Fajar', 3);",
            ordered: true,
            expectRows: [
              ['X-A', 'Bu Ratna', 4, 81.25, 92],
              ['X-B', 'Pak Anwar', 4, 79.75, 95],
            ],
          },
          {
            name: { en: 'The order follows the averages', id: 'Urutannya mengikuti rata-ratanya' },
            setup: 'UPDATE nilai SET skor = 100 WHERE siswa_id = 3;',
            ordered: true,
            expectRows: [
              ['X-B', 'Pak Anwar', 4, 93.5, 100],
              ['X-A', 'Bu Ratna', 4, 81.25, 92],
            ],
          },
        ],
        hints: [
          { en: 'Start the FROM at `nilai` — every number you need lives there.', id: 'Mulai FROM-nya di `nilai` — semua angka yang kamu butuhkan ada di sana.' },
          { en: 'Group by both `k.nama` and `k.guru`: the teacher is not an aggregate, so it must be a grouping column.', id: 'Kelompokkan berdasarkan `k.nama` dan `k.guru`: gurunya bukan agregat, jadi ia harus jadi kolom pengelompokan.' },
          { en: 'MAX(n.skor) for the best single score, ROUND(AVG(n.skor), 2) for the average.', id: 'MAX(n.skor) untuk skor tunggal terbaik, ROUND(AVG(n.skor), 2) untuk rata-ratanya.' },
        ],
        solution:
          'SELECT k.nama AS kelas,\n' +
          '       k.guru AS guru,\n' +
          '       COUNT(*) AS banyak_nilai,\n' +
          '       ROUND(AVG(n.skor), 2) AS rata_rata,\n' +
          '       MAX(n.skor) AS tertinggi\n' +
          'FROM nilai n\n' +
          'JOIN siswa s ON s.id = n.siswa_id\n' +
          'JOIN kelas k ON k.id = s.kelas_id\n' +
          'GROUP BY k.nama, k.guru\n' +
          'ORDER BY rata_rata DESC;',
        xp: 50,
      },
    },
    {
      id: 'sql-m3-s2',
      title: { en: 'Missing Matches and Nested Questions', id: 'Pasangan yang Hilang dan Pertanyaan Bersarang' },
      summary: {
        en: 'LEFT JOIN keeps the rows that matched nothing; a subquery answers a question inside a question.',
        id: 'LEFT JOIN menyimpan baris yang tak berpasangan; subkueri menjawab pertanyaan di dalam pertanyaan.',
      },
      lessons: [
        {
          id: 'sql-m3-s2-l1',
          title: { en: 'Keeping the unmatched rows', id: 'Menyimpan baris yang tak berpasangan' },
          goal: { en: 'Use LEFT JOIN, and count it correctly.', id: 'Memakai LEFT JOIN, dan menghitungnya dengan benar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'LEFT JOIN keeps the left side whole', id: 'LEFT JOIN menjaga sisi kirinya utuh' },
              body: {
                en: 'A `LEFT JOIN` returns every row of the left table whether or not it found a partner. When there is no partner, the right table\'s columns come back as `NULL`. Nothing is lost — and "zero" becomes something you can see rather than something that vanished.',
                id: '`LEFT JOIN` mengembalikan tiap baris tabel kiri, berpasangan atau tidak. Ketika tak ada pasangan, kolom tabel kanannya kembali sebagai `NULL`. Tak ada yang hilang — dan "nol" jadi sesuatu yang bisa kamu lihat, bukan sesuatu yang lenyap.',
              },
              code: 'SELECT k.nama AS kelas, s.nama AS siswa\nFROM kelas k\nLEFT JOIN siswa s ON s.kelas_id = k.id;',
              output:
                'kelas  siswa\n' +
                'X-A    Adi\n' +
                'X-A    Bela\n' +
                'X-B    Candra\n' +
                'X-B    Dina\n' +
                'X-C    NULL',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'COUNT(*) will lie to you here', id: 'COUNT(*) akan berbohong kepadamu di sini' },
              body: {
                en: 'The empty class still produces one row — a row full of `NULL`s. `COUNT(*)` counts rows, so it reports **1** student. `COUNT(s.id)` counts values, and `NULL` is not a value, so it correctly reports **0**. After a LEFT JOIN, count the column from the right-hand table, never `*`.',
                id: 'Kelas kosong itu tetap menghasilkan satu baris — baris penuh `NULL`. `COUNT(*)` menghitung baris, jadi ia melaporkan **1** siswa. `COUNT(s.id)` menghitung nilai, dan `NULL` bukan nilai, jadi ia melaporkan **0** dengan benar. Setelah LEFT JOIN, hitung kolom dari tabel kanannya, jangan pernah `*`.',
              },
              code:
                'SELECT k.nama, COUNT(*) AS salah, COUNT(s.id) AS benar\n' +
                'FROM kelas k\n' +
                'LEFT JOIN siswa s ON s.kelas_id = k.id\n' +
                'GROUP BY k.nama;',
              output: 'nama  salah  benar\nX-A   2      2\nX-B   2      2\nX-C   1      0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Five students, one of whom has no class. How many rows does this return?',
                id: 'Lima siswa, salah satunya tanpa kelas. Berapa baris yang dikembalikan ini?',
              },
              code: 'SELECT s.nama, k.nama FROM siswa s LEFT JOIN kelas k ON k.id = s.kelas_id;',
              options: [
                { en: '5 — the class-less student comes back with NULL', id: '5 — siswa tanpa kelas itu kembali dengan NULL' },
                { en: '4 — the class-less student is dropped', id: '4 — siswa tanpa kelas itu dibuang' },
                { en: '3 — one per class', id: '3 — satu per kelas' },
                { en: '0 — a LEFT JOIN needs a WHERE', id: '0 — LEFT JOIN butuh WHERE' },
              ],
              answer: 0,
              explain: {
                en: 'The left table is `siswa`, so every student survives — with NULLs where the class would have been.',
                id: 'Tabel kirinya adalah `siswa`, jadi tiap siswa selamat — dengan NULL di tempat kelasnya seharusnya berada.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `kelas` and `banyak_siswa` for **every** class, including the one that has no students yet. Sort by class name.',
                id: 'Kembalikan `kelas` dan `banyak_siswa` untuk **setiap** kelas, termasuk yang belum punya siswa. Urut nama kelas.',
              },
              starter:
                'SELECT k.nama AS kelas, COUNT(*) AS banyak_siswa\n' +
                'FROM kelas k\n' +
                'JOIN siswa s ON s.kelas_id = k.id\n' +
                'GROUP BY k.nama\n' +
                'ORDER BY k.nama;\n',
              tests: [
                {
                  name: { en: 'Two columns, kelas and banyak_siswa', id: 'Dua kolom, kelas dan banyak_siswa' },
                  expectColumns: ['kelas', 'banyak_siswa'],
                },
                {
                  name: { en: 'All three classes, and X-C has zero', id: 'Ketiga kelasnya, dan X-C bernilai nol' },
                  ordered: true,
                  expectRows: [
                    ['X-A', 2],
                    ['X-B', 2],
                    ['X-C', 0],
                  ],
                },
                {
                  name: { en: 'An empty class fills up', id: 'Kelas kosong terisi' },
                  setup: "UPDATE siswa SET kelas_id = 3 WHERE nama IN ('Eka', 'Dina');",
                  ordered: true,
                  expectRows: [
                    ['X-A', 2],
                    ['X-B', 1],
                    ['X-C', 2],
                  ],
                },
                {
                  name: { en: 'A class emptied out reads zero, not one', id: 'Kelas yang dikosongkan terbaca nol, bukan satu' },
                  setup: 'UPDATE siswa SET kelas_id = NULL WHERE kelas_id = 1;',
                  ordered: true,
                  expectRows: [
                    ['X-A', 0],
                    ['X-B', 2],
                    ['X-C', 0],
                  ],
                },
              ],
              hints: [
                { en: 'The starter uses a plain JOIN, which is why one class is missing.', id: 'Starter-nya memakai JOIN biasa, dan itulah sebabnya satu kelas hilang.' },
                { en: '`kelas` has to be the left table — it is the side you want kept whole.', id: '`kelas` harus jadi tabel kirinya — itu sisi yang ingin kamu jaga utuh.' },
                { en: 'COUNT(*) would say 1 for the empty class. Count s.id instead.', id: 'COUNT(*) akan menyebut 1 untuk kelas kosong itu. Hitung s.id sebagai gantinya.' },
              ],
              solution:
                'SELECT k.nama AS kelas, COUNT(s.id) AS banyak_siswa\n' +
                'FROM kelas k\n' +
                'LEFT JOIN siswa s ON s.kelas_id = k.id\n' +
                'GROUP BY k.nama\n' +
                'ORDER BY k.nama;',
            },
          ],
        },
        {
          id: 'sql-m3-s2-l2',
          title: { en: 'A query inside a query', id: 'Kueri di dalam kueri' },
          goal: { en: 'Compare a row against something the database works out first.', id: 'Membandingkan baris dengan sesuatu yang dihitung basis data lebih dulu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A subquery that returns one value', id: 'Subkueri yang mengembalikan satu nilai' },
              body: {
                en: 'A query in brackets can stand wherever a value can. `(SELECT AVG(skor) FROM nilai)` produces a single number, and the outer query compares against it. This is the answer to "above average" — a question you cannot ask with a plain `WHERE`, because the average is not known until every row has been read.',
                id: 'Kueri dalam kurung boleh berdiri di mana pun sebuah nilai boleh berdiri. `(SELECT AVG(skor) FROM nilai)` menghasilkan satu angka, dan kueri luarnya membandingkan terhadapnya. Inilah jawaban untuk "di atas rata-rata" — pertanyaan yang tak bisa kamu ajukan dengan `WHERE` biasa, karena rata-ratanya belum diketahui sampai semua barisnya dibaca.',
              },
              code: 'SELECT mapel, skor\nFROM nilai\nWHERE skor > (SELECT AVG(skor) FROM nilai);',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A subquery that returns a list', id: 'Subkueri yang mengembalikan daftar' },
              body: {
                en: 'With `IN`, the subquery may return many rows — one column of them — and the test is "is my value one of these". It reads like the question you actually asked, which is often clearer than the equivalent join.',
                id: 'Dengan `IN`, subkuerinya boleh mengembalikan banyak baris — satu kolom saja — dan ujinya adalah "apakah nilaiku salah satu dari ini". Bacaannya seperti pertanyaan yang sungguh kamu ajukan, dan itu sering lebih jelas daripada join yang setara.',
              },
              code:
                'SELECT nama\nFROM siswa\n' +
                "WHERE id IN (SELECT siswa_id FROM nilai WHERE mapel = 'Biologi' AND skor >= 90);",
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A subquery may go in HAVING too', id: 'Subkueri boleh ditulis di HAVING juga' },
              body: {
                en: 'The clause order still holds, so a subquery in `HAVING` is compared against a group\'s aggregate. "Students whose average beats the school average" is two averages at two different scopes, in one statement.',
                id: 'Urutan klausanya tetap berlaku, jadi subkueri di `HAVING` dibandingkan dengan agregat sebuah kelompok. "Siswa yang rata-ratanya melampaui rata-rata sekolah" adalah dua rata-rata pada dua cakupan berbeda, dalam satu pernyataan.',
              },
              code:
                'SELECT s.nama, AVG(n.skor) AS rata_rata\n' +
                'FROM siswa s\n' +
                'JOIN nilai n ON n.siswa_id = s.id\n' +
                'GROUP BY s.nama\n' +
                'HAVING AVG(n.skor) > (SELECT AVG(skor) FROM nilai);',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How many times does the database work out the inner average here?',
                id: 'Berapa kali basis datanya menghitung rata-rata bagian dalam di sini?',
              },
              code: 'SELECT mapel FROM nilai WHERE skor > (SELECT AVG(skor) FROM nilai);',
              options: [
                { en: 'Once — it does not depend on the outer row', id: 'Sekali — ia tak bergantung pada baris luarnya' },
                { en: 'Once per row', id: 'Sekali per baris' },
                { en: 'Twice', id: 'Dua kali' },
                { en: 'Never — it is only a comment', id: 'Tak pernah — ia hanya komentar' },
              ],
              answer: 0,
              explain: {
                en: 'The inner query mentions nothing from the outer one, so its answer is the same every time and is computed once.',
                id: 'Kueri dalamnya tak menyebut apa pun dari kueri luarnya, jadi jawabannya sama setiap saat dan dihitung sekali.',
              },
            },
            {
              kind: 'sql',
              id: 's1',
              schema: SCHEMA,
              prompt: {
                en: 'Return `siswa` and `rata_rata` (rounded to two decimals) for the students whose own average beats the average of every score in the school. Best first.',
                id: 'Kembalikan `siswa` dan `rata_rata` (dibulatkan dua desimal) untuk siswa yang rata-ratanya sendiri melampaui rata-rata seluruh skor di sekolah. Terbaik dulu.',
              },
              starter:
                'SELECT s.nama AS siswa, ROUND(AVG(n.skor), 2) AS rata_rata\n' +
                'FROM siswa s\n' +
                'JOIN nilai n ON n.siswa_id = s.id\n' +
                'GROUP BY s.nama\n' +
                'ORDER BY rata_rata DESC;\n',
              tests: [
                {
                  name: { en: 'Two columns, siswa and rata_rata', id: 'Dua kolom, siswa dan rata_rata' },
                  expectColumns: ['siswa', 'rata_rata'],
                },
                {
                  name: { en: 'Three students beat the school average', id: 'Tiga siswa melampaui rata-rata sekolah' },
                  ordered: true,
                  expectRows: [
                    ['Dina', 87],
                    ['Adi', 81.5],
                    ['Bela', 81],
                  ],
                },
                {
                  name: { en: 'A run of low scores moves the bar', id: 'Deretan skor rendah menggeser batasnya' },
                  setup: "INSERT INTO nilai VALUES (9, 3, 'Kimia', 10), (10, 3, 'Fisika', 10);",
                  ordered: true,
                  expectRows: [
                    ['Dina', 87],
                    ['Adi', 81.5],
                    ['Bela', 81],
                  ],
                },
                {
                  name: { en: 'A star pupil raises the bar on everyone', id: 'Seorang bintang kelas menaikkan batas bagi semua' },
                  setup: "INSERT INTO nilai VALUES (9, 3, 'Kimia', 100), (10, 3, 'Fisika', 100), (11, 3, 'Sejarah', 100);",
                  ordered: true,
                  expectRows: [
                    ['Candra', 89],
                    ['Dina', 87],
                  ],
                },
              ],
              hints: [
                { en: 'The starter is the whole query except for one clause.', id: 'Starter-nya sudah seluruh kuerinya kecuali satu klausa.' },
                { en: 'The condition is about a group, so it belongs in HAVING.', id: 'Kondisinya tentang sebuah kelompok, jadi tempatnya di HAVING.' },
                { en: 'HAVING AVG(n.skor) > (SELECT AVG(skor) FROM nilai)', id: 'HAVING AVG(n.skor) > (SELECT AVG(skor) FROM nilai)' },
              ],
              solution:
                'SELECT s.nama AS siswa, ROUND(AVG(n.skor), 2) AS rata_rata\n' +
                'FROM siswa s\n' +
                'JOIN nilai n ON n.siswa_id = s.id\n' +
                'GROUP BY s.nama\n' +
                'HAVING AVG(n.skor) > (SELECT AVG(skor) FROM nilai)\n' +
                'ORDER BY rata_rata DESC;',
            },
          ],
        },
      ],
      project: {
        id: 'sql-m3-s2-p1',
        runtime: 'sql',
        schema: SCHEMA,
        title: { en: 'Nobody Left Out', id: 'Tak Ada yang Tertinggal' },
        brief: {
          en: 'A register that lists every single student — including the one with no class and no scores at all, who is exactly the one a report must not hide.',
          id: 'Daftar hadir yang memuat tiap siswa — termasuk yang belum punya kelas dan belum punya nilai sama sekali, yang justru paling tak boleh disembunyikan sebuah laporan.',
        },
        requirements: [
          { en: 'Return five columns, in this order: `siswa`, `kelas`, `banyak_nilai`, `rata_rata`, `selisih`.', id: 'Kembalikan lima kolom, dalam urutan ini: `siswa`, `kelas`, `banyak_nilai`, `rata_rata`, `selisih`.' },
          { en: 'Every student appears, even with no class and no scores.', id: 'Tiap siswa muncul, bahkan yang tanpa kelas dan tanpa nilai.' },
          { en: '`kelas` is NULL for an unplaced student; `banyak_nilai` is 0 when there are no scores.', id: '`kelas` bernilai NULL untuk siswa yang belum ditempatkan; `banyak_nilai` bernilai 0 saat tak ada nilai.' },
          { en: '`rata_rata` is their average rounded to two decimals, and `selisih` is that average minus the school average, also rounded to two decimals.', id: '`rata_rata` adalah rata-ratanya dibulatkan dua desimal, dan `selisih` adalah rata-rata itu dikurangi rata-rata sekolah, juga dibulatkan dua desimal.' },
          { en: 'Sorted by student name, A to Z.', id: 'Diurutkan berdasarkan nama siswa, A ke Z.' },
        ],
        starter:
          'SELECT s.nama AS siswa, k.nama AS kelas\n' +
          'FROM siswa s\n' +
          'JOIN kelas k ON k.id = s.kelas_id\n' +
          'ORDER BY s.nama;\n',
        tests: [
          {
            name: { en: 'Five columns, in the right order', id: 'Lima kolom, dalam urutan yang benar' },
            expectColumns: ['siswa', 'kelas', 'banyak_nilai', 'rata_rata', 'selisih'],
          },
          {
            name: { en: 'All five students, Eka included', id: 'Kelima siswanya, Eka termasuk' },
            ordered: true,
            expectRows: [
              ['Adi', 'X-A', 2, 81.5, 1],
              ['Bela', 'X-A', 2, 81, 0.5],
              ['Candra', 'X-B', 2, 72.5, -8],
              ['Dina', 'X-B', 2, 87, 6.5],
              ['Eka', null, 0, null, null],
            ],
          },
          {
            name: { en: 'A student with a class but no scores still shows 0', id: 'Siswa yang punya kelas tapi tanpa nilai tetap menunjukkan 0' },
            setup: "UPDATE siswa SET kelas_id = 3 WHERE nama = 'Eka';",
            ordered: true,
            expectRows: [
              ['Adi', 'X-A', 2, 81.5, 1],
              ['Bela', 'X-A', 2, 81, 0.5],
              ['Candra', 'X-B', 2, 72.5, -8],
              ['Dina', 'X-B', 2, 87, 6.5],
              ['Eka', 'X-C', 0, null, null],
            ],
          },
          {
            name: { en: 'A brand-new student appears immediately', id: 'Siswa yang baru saja masuk langsung muncul' },
            setup: "INSERT INTO siswa VALUES (6, 'Fajar', NULL);",
            ordered: true,
            expectRows: [
              ['Adi', 'X-A', 2, 81.5, 1],
              ['Bela', 'X-A', 2, 81, 0.5],
              ['Candra', 'X-B', 2, 72.5, -8],
              ['Dina', 'X-B', 2, 87, 6.5],
              ['Eka', null, 0, null, null],
              ['Fajar', null, 0, null, null],
            ],
          },
          {
            name: { en: 'The gap is measured against the whole school', id: 'Selisihnya diukur terhadap seluruh sekolah' },
            setup: "INSERT INTO nilai VALUES (9, 5, 'Kimia', 100), (10, 5, 'Fisika', 100);",
            ordered: true,
            expectRows: [
              ['Adi', 'X-A', 2, 81.5, -2.9],
              ['Bela', 'X-A', 2, 81, -3.4],
              ['Candra', 'X-B', 2, 72.5, -11.9],
              ['Dina', 'X-B', 2, 87, 2.6],
              ['Eka', null, 2, 100, 15.6],
            ],
          },
        ],
        hints: [
          { en: 'Start the FROM at `siswa`: it is the side that must survive, so it goes on the left of both joins.', id: 'Mulai FROM-nya di `siswa`: itu sisi yang harus selamat, jadi ia ada di kiri kedua join-nya.' },
          { en: 'Two LEFT JOINs — one to kelas, one to nilai.', id: 'Dua LEFT JOIN — satu ke kelas, satu ke nilai.' },
          { en: 'COUNT(n.id), not COUNT(*), or the student with no scores will read as 1.', id: 'COUNT(n.id), bukan COUNT(*), atau siswa tanpa nilai akan terbaca 1.' },
          { en: 'The school average is a subquery: (SELECT AVG(skor) FROM nilai). Subtract it, then round the whole thing.', id: 'Rata-rata sekolah adalah subkueri: (SELECT AVG(skor) FROM nilai). Kurangkan, lalu bulatkan keseluruhannya.' },
        ],
        solution:
          'SELECT s.nama AS siswa,\n' +
          '       k.nama AS kelas,\n' +
          '       COUNT(n.id) AS banyak_nilai,\n' +
          '       ROUND(AVG(n.skor), 2) AS rata_rata,\n' +
          '       ROUND(AVG(n.skor) - (SELECT AVG(skor) FROM nilai), 2) AS selisih\n' +
          'FROM siswa s\n' +
          'LEFT JOIN kelas k ON k.id = s.kelas_id\n' +
          'LEFT JOIN nilai n ON n.siswa_id = s.id\n' +
          'GROUP BY s.id, s.nama, k.nama\n' +
          'ORDER BY s.nama;',
        xp: 50,
      },
    },
  ],
}
