import type { Module } from '../types'

/** Module 4 — the closing module: data you did not write, and shapes that make
 *  the wrong state impossible rather than merely unlikely. */

export const module4: Module = {
  id: 'ts-m4',
  title: { en: 'Types That Hold Up', id: 'Tipe yang Tahan Uji' },
  summary: {
    en: 'Check what comes from outside, and model your data so the bad states cannot be written.',
    id: 'Memeriksa yang datang dari luar, dan memodelkan datamu agar keadaan buruknya tak bisa ditulis.',
  },
  submodules: [
    {
      id: 'ts-m4-s1',
      title: { en: 'Outside Data, Solid Shapes', id: 'Data Luar, Bentuk yang Kokoh' },
      summary: {
        en: 'unknown and type predicates, then as const and readonly.',
        id: 'unknown dan predikat tipe, lalu as const dan readonly.',
      },
      lessons: [
        {
          id: 'ts-m4-s1-l1',
          title: { en: 'Data you did not write', id: 'Data yang bukan kamu yang menulis' },
          goal: { en: 'Turn unknown into a type you can trust.', id: 'Mengubah unknown menjadi tipe yang bisa kamu percaya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Every type in your program is a guess about the outside', id: 'Tiap tipe di programmu adalah tebakan tentang dunia luar' },
              body: {
                en: 'Inside your own code the compiler has checked everything. The moment data arrives from a file, a form, or a server, all it has is your word for it. `JSON.parse` is typed as `any` — which is to say, the checker has been switched off exactly where you know the least.',
                id: 'Di dalam kodemu sendiri kompilernya sudah memeriksa semuanya. Begitu data datang dari sebuah berkas, formulir, atau server, yang ia punya hanya perkataanmu. `JSON.parse` bertipe `any` — artinya, pemeriksanya dimatikan persis di tempat kamu paling sedikit tahu.',
              },
              code:
                'const data = JSON.parse(teks);   // any\n' +
                'data.produk.harga.toFixed(2);    // diterima kompiler, meledak saat dijalankan',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'unknown is any with the honesty left in', id: 'unknown adalah any yang kejujurannya tidak dibuang' },
              body: {
                en: 'Both hold anything. The difference is what they let you do next: with `any` you may do everything, with `unknown` you may do nothing until you have proved something. Annotate outside data as `unknown` and the compiler will not let you past without a check.',
                id: 'Keduanya bisa memuat apa saja. Bedanya ada pada apa yang boleh kamu lakukan setelahnya: dengan `any` kamu boleh melakukan segalanya, dengan `unknown` kamu tak boleh apa-apa sampai kamu membuktikan sesuatu. Beri keterangan `unknown` pada data luar dan kompilernya tak akan membiarkanmu lewat tanpa pemeriksaan.',
              },
              code:
                'const data: unknown = JSON.parse(teks);\n' +
                "data.harga;   // 'data' is of type 'unknown'.\n\n" +
                'if (typeof data === "object" && data !== null && "harga" in data) {\n' +
                '  // sekarang boleh\n' +
                '}',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A type predicate names the proof', id: 'Predikat tipe memberi nama pada pembuktiannya' },
              body: {
                en: 'Writing that check inline everywhere is miserable. A function returning `x is Produk` packages it: the body is ordinary JavaScript returning true or false, and the signature tells the compiler that a `true` result means the narrowing has been earned.',
                id: 'Menulis pemeriksaan itu berulang-ulang di segala tempat itu menyiksa. Fungsi yang mengembalikan `x is Produk` mengemasnya: badannya JavaScript biasa yang mengembalikan true atau false, dan tanda tangannya memberi tahu kompilernya bahwa hasil `true` berarti penyempitannya sudah dibayar.',
              },
              code:
                'function adalahProduk(x: unknown): x is Produk {\n' +
                '  return (\n' +
                '    typeof x === "object" && x !== null &&\n' +
                '    typeof (x as Produk).nama === "string" &&\n' +
                '    typeof (x as Produk).harga === "number"\n' +
                '  );\n' +
                '}\n\n' +
                'if (adalahProduk(data)) data.harga.toFixed(2);   // aman',
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'as on its own proves nothing', id: 'as sendirian tidak membuktikan apa pun' },
              body: {
                en: '`data as Produk` tells the compiler to believe you, and checks nothing. Inside a predicate it is honest — the check is right there on the next line. On its own it is the same gamble as `any`, wearing better clothes.',
                id: '`data as Produk` menyuruh kompilernya percaya padamu, dan tidak memeriksa apa pun. Di dalam sebuah predikat ia jujur — pemeriksaannya ada persis di baris berikutnya. Sendirian ia taruhan yang sama dengan `any`, hanya berpakaian lebih rapi.',
              },
              code:
                'const p = JSON.parse(teks) as Produk;   // tak ada yang diperiksa\n' +
                'p.harga.toFixed(2);                     // dan ini tetap bisa meledak',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the difference between `any` and `unknown` here?',
                id: 'Apa beda `any` dan `unknown` di sini?',
              },
              code: 'function f(a: any, u: unknown) {\n  a.apa.saja();\n  u.apa.saja();\n}',
              options: [
                { en: 'The first line is allowed, the second is refused', id: 'Baris pertama diizinkan, yang kedua ditolak' },
                { en: 'Both are refused', id: 'Keduanya ditolak' },
                { en: 'Both are allowed', id: 'Keduanya diizinkan' },
                { en: 'The second is allowed, the first is refused', id: 'Yang kedua diizinkan, yang pertama ditolak' },
              ],
              answer: 0,
              explain: {
                en: 'They accept the same values. They differ entirely in what you are allowed to do afterwards.',
                id: 'Keduanya menerima nilai yang sama. Bedanya sepenuhnya pada apa yang boleh kamu lakukan sesudahnya.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Write `adalahProduk(x): x is Produk`, checking that `nama` is a string and `harga` is a number, and `bacaProduk(teks)` which parses JSON and returns the product, or `null` if the text is not one.',
                id: 'Tulis `adalahProduk(x): x is Produk`, yang memeriksa `nama` berupa string dan `harga` berupa number, serta `bacaProduk(teks)` yang mengurai JSON dan mengembalikan produknya, atau `null` kalau teksnya bukan produk.',
              },
              starter:
                'interface Produk {\n' +
                '  nama: string;\n' +
                '  harga: number;\n' +
                '}\n\n' +
                'function adalahProduk(x: unknown): boolean {\n' +
                '  return true;\n' +
                '}\n\n' +
                'function bacaProduk(teks: string): Produk | null {\n' +
                '  return JSON.parse(teks);\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'A good product is read', id: 'Produk yang baik terbaca' },
                  check:
                    'const p = bacaProduk(\'{"nama":"Pensil","harga":3000}\');\n' +
                    'assert(p !== null, "produk yang sah tidak boleh null");\n' +
                    'assert(p.nama === "Pensil" && p.harga === 3000, "sekarang: " + JSON.stringify(p));',
                },
                {
                  name: { en: 'A wrong shape gives null', id: 'Bentuk yang salah memberi null' },
                  check:
                    'assert(bacaProduk(\'{"nama":"Pensil"}\') === null, "harga hilang harus null, sekarang: " + JSON.stringify(bacaProduk(\'{"nama":"Pensil"}\')));\n' +
                    'assert(bacaProduk(\'{"nama":"Pensil","harga":"3000"}\') === null, "harga berupa teks harus null");\n' +
                    'assert(bacaProduk(\'[1,2,3]\') === null, "array bukan produk");\n' +
                    'assert(bacaProduk(\'null\') === null, "null bukan produk");\n' +
                    'assert(bacaProduk(\'"halo"\') === null, "string bukan produk");',
                },
                {
                  name: { en: 'Broken JSON does not throw', id: 'JSON yang rusak tidak melempar' },
                  check:
                    'assert(bacaProduk("bukan json") === null, "teks yang bukan JSON harus null, bukan lemparan");\n' +
                    'assert(bacaProduk("") === null, "teks kosong harus null");',
                },
                {
                  name: { en: 'The predicate narrows', id: 'Predikatnya mempersempit' },
                  probe: 'const uji1: unknown = JSON.parse("{}");\nif (adalahProduk(uji1)) {\n  const uji2: number = uji1.harga;\n}',
                },
                {
                  name: { en: 'Without the check, unknown stays unknown', id: 'Tanpa pemeriksaan, unknown tetap unknown' },
                  probe: 'const uji3: unknown = JSON.parse("{}");\nconst uji4: number = uji3.harga;',
                  expectError: true,
                },
                {
                  name: { en: 'It really accepts unknown', id: 'Ia benar-benar menerima unknown' },
                  probe: 'const uji5: unknown = 1;\nadalahProduk(uji5);',
                },
                {
                  name: { en: 'The caller is made to face the null', id: 'Pemanggilnya dipaksa menghadapi null-nya' },
                  probe: 'const uji6: Produk = bacaProduk("{}");',
                  expectError: true,
                  errorCode: 2322,
                },
              ],
              hints: [
                { en: 'The starter returns `boolean`, so an `if` around it tells the compiler nothing.', id: 'Kode awalnya mengembalikan `boolean`, jadi `if` di sekitarnya tak memberi tahu kompilernya apa pun.' },
                { en: 'Change the return type to `x is Produk` — the body stays ordinary JavaScript.', id: 'Ubah tipe kembaliannya jadi `x is Produk` — badannya tetap JavaScript biasa.' },
                { en: '`typeof null` is `"object"`, so check `x !== null` as well.', id: '`typeof null` adalah `"object"`, jadi periksa juga `x !== null`.' },
                { en: 'Wrap the parse in try/catch, then run the predicate on the result.', id: 'Bungkus penguraiannya dalam try/catch, lalu jalankan predikatnya pada hasilnya.' },
              ],
              solution:
                'interface Produk {\n' +
                '  nama: string;\n' +
                '  harga: number;\n' +
                '}\n\n' +
                'function adalahProduk(x: unknown): x is Produk {\n' +
                '  if (typeof x !== "object" || x === null) return false;\n' +
                '  const p = x as Produk;\n' +
                '  return typeof p.nama === "string" && typeof p.harga === "number";\n' +
                '}\n\n' +
                'function bacaProduk(teks: string): Produk | null {\n' +
                '  let data: unknown;\n' +
                '  try {\n' +
                '    data = JSON.parse(teks);\n' +
                '  } catch {\n' +
                '    return null;\n' +
                '  }\n' +
                '  return adalahProduk(data) ? data : null;\n' +
                '}',
            },
          ],
        },
        {
          id: 'ts-m4-s1-l2',
          title: { en: 'Making the wrong state unwritable', id: 'Membuat keadaan yang salah tak bisa ditulis' },
          goal: { en: 'Derive types from values, and freeze what should not move.', id: 'Menurunkan tipe dari nilai, dan membekukan yang tak boleh bergerak.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'as const keeps the exact value', id: 'as const menjaga nilai persisnya' },
              body: {
                en: 'TypeScript widens `["merah", "hijau"]` to `string[]`, because arrays are usually meant to change. `as const` says this one is not: it becomes a readonly tuple of exactly those literals — and now the list of allowed values exists **once**, as a value you can also loop over.',
                id: 'TypeScript melebarkan `["merah", "hijau"]` menjadi `string[]`, karena array biasanya memang untuk diubah. `as const` menyatakan yang ini tidak: ia menjadi tuple readonly berisi persis literal itu — dan sekarang daftar nilai yang diizinkan ada **sekali**, sebagai nilai yang juga bisa kamu telusuri.',
              },
              code:
                'const WARNA = ["merah", "hijau", "biru"];\n' +
                '// string[]\n\n' +
                'const WARNA = ["merah", "hijau", "biru"] as const;\n' +
                '// readonly ["merah", "hijau", "biru"]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'And then the type comes from the value', id: 'Dan lalu tipenya datang dari nilainya' },
              body: {
                en: '`typeof WARNA` is the type of that constant; indexing it with `number` gives the union of everything in it. So the literal union is *derived* from the array — one place to add a colour, and both the runtime list and the type follow.',
                id: '`typeof WARNA` adalah tipe konstanta itu; mengindeksnya dengan `number` memberi union dari seluruh isinya. Jadi union literalnya *diturunkan* dari array-nya — satu tempat untuk menambah warna, dan daftar saat jalan maupun tipenya sama-sama ikut.',
              },
              code:
                'const WARNA = ["merah", "hijau", "biru"] as const;\n' +
                'type Warna = (typeof WARNA)[number];\n' +
                '// "merah" | "hijau" | "biru"\n\n' +
                'const w: Warna = "hijau";    // baik\n' +
                'const x: Warna = "kuning";   // ditolak',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'readonly says it will not move', id: 'readonly menyatakan ia tak akan bergerak' },
              body: {
                en: '`readonly` on a property refuses assignment after construction; `readonly T[]` refuses `push`, `sort` and the rest. It is not a runtime lock — the object is still mutable at runtime — but it does stop the code that would have done it from compiling, which is where you can still fix it.',
                id: '`readonly` pada sebuah properti menolak penugasan setelah objeknya dibuat; `readonly T[]` menolak `push`, `sort`, dan kawan-kawan. Ia bukan kunci saat program berjalan — objeknya tetap bisa diubah saat jalan — tetapi ia menghentikan kode yang akan melakukannya dari lolos kompilasi, dan di situlah kamu masih bisa membetulkannya.',
              },
              code:
                'interface Kotak {\n' +
                '  readonly id: number;\n' +
                '  warna: Warna;\n' +
                '}\n\n' +
                'k.warna = "biru";   // baik\n' +
                "k.id = 2;           // Cannot assign to 'id' because it is a read-only property.",
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'The point of all of it', id: 'Inti dari semuanya' },
              body: {
                en: 'Every technique in this course points the same way: put the rule in the type, so the wrong thing cannot be written at all. A comment saying "do not change the id" is a hope. `readonly id` is a fact — and unlike the comment, it is still true after somebody else edits the file.',
                id: 'Tiap teknik di kursus ini menunjuk ke arah yang sama: taruh aturannya di dalam tipenya, agar yang salah sama sekali tak bisa ditulis. Komentar bertuliskan "jangan ubah id-nya" adalah harapan. `readonly id` adalah fakta — dan tak seperti komentarnya, ia tetap benar setelah orang lain menyunting berkasnya.',
              },
              code:
                '// harapan\nconst STATUS = ["baru", "selesai"];   // jangan tambahkan apa pun di sini!\n\n' +
                '// fakta\nconst STATUS = ["baru", "selesai"] as const;',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is the last line refused?',
                id: 'Mengapa baris terakhirnya ditolak?',
              },
              code: 'const ARAH = ["naik", "turun"] as const;\ntype Arah = (typeof ARAH)[number];\n\nconst a: Arah = "naik";\nARAH.push("samping");',
              options: [
                { en: '`as const` made the array readonly, so it has no `push`', id: '`as const` membuat array-nya readonly, jadi ia tak punya `push`' },
                { en: '`push` needs two arguments', id: '`push` butuh dua argumen' },
                { en: 'A const array cannot be read either', id: 'Array const juga tak bisa dibaca' },
                { en: 'It is not refused', id: 'Ia tidak ditolak' },
              ],
              answer: 0,
              explain: {
                en: 'That is the whole benefit: the list the type was derived from cannot quietly grow behind the type\'s back.',
                id: 'Itulah seluruh keuntungannya: daftar tempat tipenya diturunkan tak bisa diam-diam tumbuh di belakang punggung tipenya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a list of allowed values and the type derived from it.',
                id: 'Susun daftar nilai yang diizinkan dan tipe yang diturunkan darinya.',
              },
              lines: [
                'const UKURAN = ["S", "M", "L"] as const;',
                'type Ukuran = (typeof UKURAN)[number];',
                'function muat(u: Ukuran): boolean {',
                '  return UKURAN.indexOf(u) >= 0;',
                '}',
              ],
              explain: {
                en: 'The value comes first, because the type is read off it — not the other way round.',
                id: 'Nilainya lebih dulu, karena tipenya dibaca darinya — bukan sebaliknya.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `WARNA` as a frozen list of `"merah"`, `"hijau"`, `"biru"`, derive `type Warna` from it, give `Kotak` a `readonly id` and a `warna`, and write `catUlang(k, warna)` returning a new box.',
                id: 'Deklarasikan `WARNA` sebagai daftar beku berisi `"merah"`, `"hijau"`, `"biru"`, turunkan `type Warna` darinya, beri `Kotak` sebuah `readonly id` dan sebuah `warna`, lalu tulis `catUlang(k, warna)` yang mengembalikan kotak baru.',
              },
              starter:
                'const WARNA = ["merah", "hijau", "biru"];\n\n' +
                'type Warna = string;\n\n' +
                'interface Kotak {\n' +
                '  id: number;\n' +
                '  warna: Warna;\n' +
                '}\n\n' +
                'function catUlang(k: Kotak, warna: Warna): Kotak {\n' +
                '  return { ...k, warna };\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'Repainting makes a new box', id: 'Mengecat ulang membuat kotak baru' },
                  check:
                    'const k = { id: 1, warna: "merah" };\n' +
                    'const b = catUlang(k, "biru");\n' +
                    'assert(b.warna === "biru" && b.id === 1, "sekarang: " + JSON.stringify(b));\n' +
                    'assert(k.warna === "merah", "kotak aslinya tidak boleh berubah, sekarang: " + k.warna);',
                },
                {
                  name: { en: 'The list still holds the three colours', id: 'Daftarnya tetap memuat ketiga warnanya' },
                  check:
                    'assert(WARNA.length === 3, "harus 3 warna, sekarang: " + WARNA.length);\n' +
                    'assert(WARNA[0] === "merah" && WARNA[1] === "hijau" && WARNA[2] === "biru", "sekarang: " + JSON.stringify(WARNA));',
                },
                {
                  name: { en: 'The three colours are accepted', id: 'Ketiga warnanya diterima' },
                  probe: 'const uji1: Warna = "merah";\nconst uji2: Warna = "hijau";\nconst uji3: Warna = "biru";',
                },
                {
                  name: { en: 'A fourth colour is refused', id: 'Warna keempat ditolak' },
                  probe: 'const uji4: Warna = "kuning";',
                  expectError: true,
                },
                {
                  name: { en: 'A plain string is not a colour', id: 'String biasa bukan sebuah warna' },
                  probe: 'const kata: string = "merah";\nconst uji5: Warna = kata;',
                  expectError: true,
                  errorCode: 2322,
                },
                {
                  name: { en: 'The list cannot grow', id: 'Daftarnya tak bisa tumbuh' },
                  probe: 'WARNA.push("kuning");',
                  expectError: true,
                  errorCode: 2339,
                },
                {
                  name: { en: 'The id cannot be reassigned', id: 'id-nya tak bisa ditugaskan ulang' },
                  probe: 'const uji6: Kotak = { id: 1, warna: "merah" };\nuji6.id = 2;',
                  expectError: true,
                  errorCode: 2540,
                },
                {
                  name: { en: 'The colour still can', id: 'Warnanya masih bisa' },
                  probe: 'const uji7: Kotak = { id: 1, warna: "merah" };\nuji7.warna = "biru";',
                },
                {
                  name: { en: 'Repainting refuses a colour that is not one', id: 'Mengecat ulang menolak warna yang bukan warna' },
                  probe: 'const uji8: Kotak = { id: 1, warna: "merah" };\ncatUlang(uji8, "kuning");',
                  expectError: true,
                  errorCode: 2345,
                },
              ],
              hints: [
                { en: 'Two words at the end of the array literal do most of the work.', id: 'Dua kata di ujung array literalnya mengerjakan sebagian besarnya.' },
                { en: 'Then `Warna` is read off it: `(typeof WARNA)[number]`.', id: 'Lalu `Warna` dibaca darinya: `(typeof WARNA)[number]`.' },
                { en: 'Only `id` gets `readonly` — the colour is meant to change.', id: 'Hanya `id` yang mendapat `readonly` — warnanya memang untuk diubah.' },
              ],
              solution:
                'const WARNA = ["merah", "hijau", "biru"] as const;\n\n' +
                'type Warna = (typeof WARNA)[number];\n\n' +
                'interface Kotak {\n' +
                '  readonly id: number;\n' +
                '  warna: Warna;\n' +
                '}\n\n' +
                'function catUlang(k: Kotak, warna: Warna): Kotak {\n' +
                '  return { ...k, warna };\n' +
                '}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m4-s1-p1',
        runtime: 'ts',
        title: { en: 'The Task Board', id: 'Papan Tugas' },
        brief: {
          en: 'A board loaded from text you did not write. Everything the course covered, aimed at one goal: after `bacaPapan` returns, nothing downstream needs to wonder whether the data is sound.',
          id: 'Sebuah papan yang dimuat dari teks yang bukan kamu tulis. Semua isi kursus ini, diarahkan ke satu tujuan: setelah `bacaPapan` mengembalikan nilainya, tak ada bagian selanjutnya yang perlu bertanya-tanya apakah datanya beres.',
        },
        requirements: [
          { en: '`STATUS` is a frozen list of `"baru"`, `"jalan"`, `"selesai"`, and `type Status` is derived from it.', id: '`STATUS` adalah daftar beku berisi `"baru"`, `"jalan"`, `"selesai"`, dan `type Status` diturunkan darinya.' },
          { en: '`interface Tugas` has a `readonly id` (number), `judul` (string), `status` (Status) and an optional `tenggat` (string).', id: '`interface Tugas` punya `readonly id` (number), `judul` (string), `status` (Status), dan `tenggat` opsional (string).' },
          { en: '`type Muat` is a tagged union on `fase`: `"memuat"`, `"siap"` with `tugas: readonly Tugas[]`, or `"galat"` with `pesan`.', id: '`type Muat` adalah union bertanda pada `fase`: `"memuat"`, `"siap"` dengan `tugas: readonly Tugas[]`, atau `"galat"` dengan `pesan`.' },
          { en: '`adalahTugas(x)` is a type predicate. A task is valid only if every field has the right type and `status` is one of the three.', id: '`adalahTugas(x)` adalah predikat tipe. Sebuah tugas hanya sah kalau tiap field-nya bertipe benar dan `status`-nya salah satu dari yang tiga.' },
          { en: '`bacaPapan(teks)` parses JSON and returns `siap`, or `galat` with `"JSON tidak valid"`, `"Bukan daftar"`, or `"Tugas tidak valid"`.', id: '`bacaPapan(teks)` mengurai JSON lalu mengembalikan `siap`, atau `galat` dengan `"JSON tidak valid"`, `"Bukan daftar"`, atau `"Tugas tidak valid"`.' },
          { en: '`ringkas(m)` returns `"Memuat…"`, `"Gagal: {pesan}"`, or `"3 tugas (1 selesai)"`.', id: '`ringkas(m)` mengembalikan `"Memuat…"`, `"Gagal: {pesan}"`, atau `"3 tugas (1 selesai)"`.' },
          { en: '`hitung(m)` returns a count per status — all zeros unless the board is ready.', id: '`hitung(m)` mengembalikan jumlah per status — semuanya nol kecuali papannya siap.' },
        ],
        starter:
          'const STATUS = ["baru", "jalan", "selesai"];\n\n' +
          'type Status = string;\n\n' +
          'interface Tugas {\n\n}\n\n' +
          'type Muat = { fase: string; tugas?: Tugas[]; pesan?: string };\n\n' +
          'function adalahTugas(x: unknown): boolean {\n\n}\n\n' +
          'function bacaPapan(teks: string): Muat {\n\n}\n\n' +
          'function ringkas(m: Muat): string {\n\n}\n\n' +
          'function hitung(m: Muat): Record<Status, number> {\n\n}\n',
        tests: [
          {
            name: { en: 'A good board is read', id: 'Papan yang baik terbaca' },
            check:
              'const teks = JSON.stringify([\n' +
              '  { id: 1, judul: "Tulis", status: "baru" },\n' +
              '  { id: 2, judul: "Uji", status: "selesai", tenggat: "2026-01-01" },\n' +
              ']);\n' +
              'const m = bacaPapan(teks);\n' +
              'assert(m.fase === "siap", "harus siap, sekarang: " + m.fase + " " + JSON.stringify(m));\n' +
              'assert(m.tugas.length === 2, "harus 2 tugas, sekarang: " + m.tugas.length);\n' +
              'assert(m.tugas[1].tenggat === "2026-01-01", "tenggatnya harus ikut terbawa");',
          },
          {
            name: { en: 'Each kind of bad input has its own message', id: 'Tiap jenis masukan buruk punya pesannya sendiri' },
            check:
              'const a = bacaPapan("bukan json");\n' +
              'assert(a.fase === "galat" && a.pesan === "JSON tidak valid", "sekarang: " + JSON.stringify(a));\n' +
              'const b = bacaPapan(\'{"id":1}\');\n' +
              'assert(b.fase === "galat" && b.pesan === "Bukan daftar", "objek bukan daftar, sekarang: " + JSON.stringify(b));\n' +
              'const c = bacaPapan(\'[{"id":1,"judul":"x","status":"entah"}]\');\n' +
              'assert(c.fase === "galat" && c.pesan === "Tugas tidak valid", "status asing, sekarang: " + JSON.stringify(c));\n' +
              'const d = bacaPapan(\'[{"id":"1","judul":"x","status":"baru"}]\');\n' +
              'assert(d.fase === "galat" && d.pesan === "Tugas tidak valid", "id berupa teks, sekarang: " + JSON.stringify(d));\n' +
              'const e = bacaPapan(\'[{"judul":"x","status":"baru"}]\');\n' +
              'assert(e.fase === "galat" && e.pesan === "Tugas tidak valid", "id hilang, sekarang: " + JSON.stringify(e));',
          },
          {
            name: { en: 'An empty board is still a board', id: 'Papan kosong tetap sebuah papan' },
            check:
              'const m = bacaPapan("[]");\n' +
              'assert(m.fase === "siap", "daftar kosong tetap siap, sekarang: " + JSON.stringify(m));\n' +
              'assert(m.tugas.length === 0, "dan tanpa tugas");',
          },
          {
            name: { en: 'The predicate is strict about the shape', id: 'Predikatnya ketat soal bentuknya' },
            check:
              'assert(adalahTugas({ id: 1, judul: "x", status: "baru" }) === true, "tugas sah harus true");\n' +
              'assert(adalahTugas({ id: 1, judul: "x", status: "baru", tenggat: "besok" }) === true, "tenggat opsional harus boleh");\n' +
              'assert(adalahTugas({ id: 1, judul: "x", status: "baru", tenggat: 7 }) === false, "tenggat bukan string harus false");\n' +
              'assert(adalahTugas(null) === false, "null harus false");\n' +
              'assert(adalahTugas([1, 2]) === false, "array harus false");\n' +
              'assert(adalahTugas("halo") === false, "string harus false");',
          },
          {
            name: { en: 'The summary reads for every phase', id: 'Ringkasannya terbaca untuk tiap fase' },
            check:
              'assert(ringkas({ fase: "memuat" }) === "Memuat…", "sekarang: " + JSON.stringify(ringkas({ fase: "memuat" })));\n' +
              'assert(ringkas({ fase: "galat", pesan: "Bukan daftar" }) === "Gagal: Bukan daftar", "sekarang: " + JSON.stringify(ringkas({ fase: "galat", pesan: "Bukan daftar" })));\n' +
              'const siap = bacaPapan(JSON.stringify([\n' +
              '  { id: 1, judul: "a", status: "baru" },\n' +
              '  { id: 2, judul: "b", status: "selesai" },\n' +
              '  { id: 3, judul: "c", status: "selesai" },\n' +
              ']));\n' +
              'assert(ringkas(siap) === "3 tugas (2 selesai)", "sekarang: " + JSON.stringify(ringkas(siap)));\n' +
              'assert(ringkas(bacaPapan("[]")) === "0 tugas (0 selesai)", "sekarang: " + JSON.stringify(ringkas(bacaPapan("[]"))));',
          },
          {
            name: { en: 'The counts add up, and every status is present', id: 'Hitungannya tepat, dan tiap status ada' },
            check:
              'const siap = bacaPapan(JSON.stringify([\n' +
              '  { id: 1, judul: "a", status: "baru" },\n' +
              '  { id: 2, judul: "b", status: "selesai" },\n' +
              '  { id: 3, judul: "c", status: "baru" },\n' +
              ']));\n' +
              'const h = hitung(siap);\n' +
              'assert(h.baru === 2 && h.jalan === 0 && h.selesai === 1, "sekarang: " + JSON.stringify(h));\n' +
              'const kosong = hitung({ fase: "memuat" });\n' +
              'assert(kosong.baru === 0 && kosong.jalan === 0 && kosong.selesai === 0, "fase memuat harus nol semua, sekarang: " + JSON.stringify(kosong));',
          },
          {
            name: { en: 'The three statuses are accepted', id: 'Ketiga statusnya diterima' },
            probe: 'const uji1: Status = "baru";\nconst uji2: Status = "jalan";\nconst uji3: Status = "selesai";',
          },
          {
            name: { en: 'A fourth status is refused', id: 'Status keempat ditolak' },
            probe: 'const uji4: Status = "batal";',
            expectError: true,
          },
          {
            name: { en: 'The status list cannot grow', id: 'Daftar statusnya tak bisa tumbuh' },
            probe: 'STATUS.push("batal");',
            expectError: true,
            errorCode: 2339,
          },
          {
            name: { en: 'A task id cannot be reassigned', id: 'id tugas tak bisa ditugaskan ulang' },
            probe: 'const uji5: Tugas = { id: 1, judul: "a", status: "baru" };\nuji5.id = 2;',
            expectError: true,
            errorCode: 2540,
          },
          {
            name: { en: 'A task without a title is refused', id: 'Tugas tanpa judul ditolak' },
            probe: 'const uji6: Tugas = { id: 1, status: "baru" };',
            expectError: true,
          },
          {
            name: { en: 'The predicate narrows unknown to a task', id: 'Predikatnya mempersempit unknown menjadi sebuah tugas' },
            probe: 'const uji7: unknown = JSON.parse("{}");\nif (adalahTugas(uji7)) {\n  const uji8: string = uji7.judul;\n}',
          },
          {
            name: { en: 'The tasks cannot be read before the phase is checked', id: 'Tugasnya tak bisa dibaca sebelum fasenya diperiksa' },
            probe: 'const uji9 = bacaPapan("[]");\nconst uji10 = uji9.tugas;',
            expectError: true,
            errorCode: 2339,
          },
          {
            name: { en: 'After the check they can, and they are frozen', id: 'Setelah diperiksa mereka bisa, dan mereka beku' },
            probe:
              'const uji11 = bacaPapan("[]");\n' +
              'if (uji11.fase === "siap") {\n' +
              '  const uji12: number = uji11.tugas.length;\n' +
              '}',
          },
          {
            name: { en: 'A ready board cannot be pushed to', id: 'Papan yang siap tak bisa ditambahi' },
            probe:
              'const uji13 = bacaPapan("[]");\n' +
              'if (uji13.fase === "siap") {\n' +
              '  uji13.tugas.push({ id: 1, judul: "a", status: "baru" });\n' +
              '}',
            expectError: true,
            errorCode: 2339,
          },
          {
            name: { en: 'An error carries no tasks', id: 'Kesalahan tidak membawa tugas' },
            probe: 'const uji14: Muat = { fase: "galat", pesan: "x", tugas: [] };',
            expectError: true,
          },
          {
            name: { en: 'The counts are keyed by status', id: 'Hitungannya berkunci status' },
            probe: 'const uji15: number = hitung({ fase: "memuat" }).selesai;',
          },
          {
            name: { en: 'A status that does not exist has no count', id: 'Status yang tidak ada tidak punya hitungan' },
            probe: 'hitung({ fase: "memuat" }).batal;',
            expectError: true,
          },
        ],
        hints: [
          { en: 'Work top to bottom. The first two lines decide everything below them: freeze the list, then derive the type from it.', id: 'Kerjakan dari atas ke bawah. Dua baris pertamanya menentukan semua di bawahnya: bekukan daftarnya, lalu turunkan tipenya darinya.' },
          { en: '`Muat` is a tagged union on `fase`, not one object with optional fields. Several tests exist only to prove the difference.', id: '`Muat` adalah union bertanda pada `fase`, bukan satu objek berisi field opsional. Beberapa tes ada hanya untuk membuktikan bedanya.' },
          { en: 'Checking a status inside the predicate: `STATUS` is a readonly tuple of literals, so `includes` will not accept a plain string. Widen it first — `(STATUS as readonly string[]).includes(s)`.', id: 'Memeriksa status di dalam predikatnya: `STATUS` adalah tuple readonly berisi literal, jadi `includes` tak akan menerima string biasa. Lebarkan dulu — `(STATUS as readonly string[]).includes(s)`.' },
          { en: 'The three error messages are distinguished before the tasks are: parse, then "is it an array", then "is every element a task".', id: 'Ketiga pesan galatnya dibedakan sebelum tugasnya: urai, lalu "apakah ini array", lalu "apakah tiap elemennya sebuah tugas".' },
          { en: '`hitung` starts from a zeroed record of every status, so the missing ones are still there: `{ baru: 0, jalan: 0, selesai: 0 }`.', id: '`hitung` mulai dari record nol untuk tiap status, agar yang tak ada pun tetap ada: `{ baru: 0, jalan: 0, selesai: 0 }`.' },
        ],
        solution:
          'const STATUS = ["baru", "jalan", "selesai"] as const;\n\n' +
          'type Status = (typeof STATUS)[number];\n\n' +
          'interface Tugas {\n' +
          '  readonly id: number;\n' +
          '  judul: string;\n' +
          '  status: Status;\n' +
          '  tenggat?: string;\n' +
          '}\n\n' +
          'type Muat =\n' +
          '  | { fase: "memuat" }\n' +
          '  | { fase: "siap"; tugas: readonly Tugas[] }\n' +
          '  | { fase: "galat"; pesan: string };\n\n' +
          'function adalahTugas(x: unknown): x is Tugas {\n' +
          '  if (typeof x !== "object" || x === null || Array.isArray(x)) return false;\n' +
          '  const t = x as Tugas;\n' +
          '  if (typeof t.id !== "number") return false;\n' +
          '  if (typeof t.judul !== "string") return false;\n' +
          '  if (typeof t.status !== "string") return false;\n' +
          '  if (!(STATUS as readonly string[]).includes(t.status)) return false;\n' +
          '  return t.tenggat === undefined || typeof t.tenggat === "string";\n' +
          '}\n\n' +
          'function bacaPapan(teks: string): Muat {\n' +
          '  let data: unknown;\n' +
          '  try {\n' +
          '    data = JSON.parse(teks);\n' +
          '  } catch {\n' +
          '    return { fase: "galat", pesan: "JSON tidak valid" };\n' +
          '  }\n' +
          '  if (!Array.isArray(data)) return { fase: "galat", pesan: "Bukan daftar" };\n' +
          '  if (!data.every(adalahTugas)) return { fase: "galat", pesan: "Tugas tidak valid" };\n' +
          '  return { fase: "siap", tugas: data };\n' +
          '}\n\n' +
          'function ringkas(m: Muat): string {\n' +
          '  switch (m.fase) {\n' +
          '    case "memuat":\n' +
          '      return "Memuat…";\n' +
          '    case "galat":\n' +
          '      return `Gagal: ${m.pesan}`;\n' +
          '    case "siap": {\n' +
          '      const selesai = m.tugas.filter((t) => t.status === "selesai").length;\n' +
          '      return `${m.tugas.length} tugas (${selesai} selesai)`;\n' +
          '    }\n' +
          '  }\n' +
          '}\n\n' +
          'function hitung(m: Muat): Record<Status, number> {\n' +
          '  const hasil: Record<Status, number> = { baru: 0, jalan: 0, selesai: 0 };\n' +
          '  if (m.fase !== "siap") return hasil;\n' +
          '  for (const t of m.tugas) hasil[t.status] += 1;\n' +
          '  return hasil;\n' +
          '}',
        xp: 80,
      },
    },
  ],
}
