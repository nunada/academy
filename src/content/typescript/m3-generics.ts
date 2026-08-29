import type { Module } from '../types'

/** Module 3 — writing one type that works for many, and deriving types from
 *  types you already have. */

export const module3: Module = {
  id: 'ts-m3',
  title: { en: 'Types That Take a Type', id: 'Tipe yang Menerima Tipe' },
  summary: {
    en: 'Write it once for every type, and derive the rest from what you already declared.',
    id: 'Menulisnya sekali untuk tiap tipe, dan menurunkan sisanya dari yang sudah kamu deklarasikan.',
  },
  submodules: [
    {
      id: 'ts-m3-s1',
      title: { en: 'Generics', id: 'Generik' },
      summary: {
        en: 'A type parameter, filled in at the call.',
        id: 'Sebuah parameter tipe, yang diisi saat pemanggilan.',
      },
      lessons: [
        {
          id: 'ts-m3-s1-l1',
          title: { en: 'A function for every type', id: 'Fungsi untuk tiap tipe' },
          goal: { en: 'Write a generic function that keeps the type it was given.', id: 'Menulis fungsi generik yang menjaga tipe yang diberikan padanya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The problem: a function that forgets', id: 'Masalahnya: fungsi yang lupa' },
              body: {
                en: '"Give me the last item of a list" works for any list. Write it with `unknown[]` and it works — but it hands back `unknown`, and the caller who passed strings has to convince the compiler all over again that they will get a string. The function threw away something it knew.',
                id: '"Berikan aku item terakhir dari sebuah daftar" berlaku untuk daftar apa pun. Tulis dengan `unknown[]` dan ia bekerja — tetapi ia mengembalikan `unknown`, dan pemanggil yang tadi mengirim string harus meyakinkan kompilernya lagi dari awal bahwa ia akan menerima string. Fungsinya membuang sesuatu yang ia tahu.',
              },
              code:
                'function terakhir(daftar: unknown[]): unknown {\n' +
                '  return daftar[daftar.length - 1];\n' +
                '}\n\n' +
                'const t = terakhir(["a", "b"]);\n' +
                "t.toUpperCase();   // 't' is of type 'unknown'.",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A type parameter carries it through', id: 'Parameter tipe membawanya sampai ujung' },
              body: {
                en: '`<T>` declares a **type parameter** — a type the caller supplies, the way a normal parameter is a value the caller supplies. Say the list is `T[]` and the result is `T`, and now the connection between them is written down. You almost never pass `T` by hand: TypeScript reads it off the argument.',
                id: '`<T>` mendeklarasikan **parameter tipe** — sebuah tipe yang disediakan pemanggil, seperti parameter biasa adalah nilai yang disediakan pemanggil. Nyatakan daftarnya `T[]` dan hasilnya `T`, dan sekarang hubungan di antara keduanya tertulis. Kamu nyaris tak pernah mengoper `T` dengan tangan: TypeScript membacanya dari argumennya.',
              },
              code:
                'function terakhir<T>(daftar: T[]): T | undefined {\n' +
                '  return daftar[daftar.length - 1];\n' +
                '}\n\n' +
                'terakhir(["a", "b"]);   // string | undefined\n' +
                'terakhir([1, 2, 3]);    // number | undefined',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'extends says what T must have', id: 'extends menyatakan apa yang harus dimiliki T' },
              body: {
                en: 'A bare `T` could be anything, so you may do nothing with it. `T extends { id: number }` says T is *at least* that — so inside the function you may read `.id`, and outside it the caller still gets back their own full type, not the narrow one you constrained to.',
                id: '`T` polos bisa apa saja, jadi kamu tak bisa berbuat apa pun dengannya. `T extends { id: number }` menyatakan T *sekurang-kurangnya* itu — jadi di dalam fungsinya kamu boleh membaca `.id`, dan di luar sana pemanggilnya tetap menerima tipe penuhnya sendiri, bukan tipe sempit yang kamu batasi tadi.',
              },
              code: {
                en:
                  'function cariId<T extends { id: number }>(daftar: T[], id: number): T | undefined {\n' +
                  '  return daftar.find((x) => x.id === id);\n' +
                  '}\n\n' +
                  'const p = cariId([{ id: 1, nama: "Ani" }], 1);\n' +
                  'p?.nama;   // still there: the result is the full type that was passed in',
                id:
                  'function cariId<T extends { id: number }>(daftar: T[], id: number): T | undefined {\n' +
                  '  return daftar.find((x) => x.id === id);\n' +
                  '}\n\n' +
                  'const p = cariId([{ id: 1, nama: "Ani" }], 1);\n' +
                  'p?.nama;   // masih ada: hasilnya tipe penuh yang tadi dikirim',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the type of `x`?',
                id: 'Apa tipe `x`?',
              },
              code: 'function pertama<T>(daftar: T[]): T | undefined {\n  return daftar[0];\n}\n\nconst x = pertama([true, false]);',
              options: [
                { en: '`boolean | undefined`', id: '`boolean | undefined`' },
                { en: '`unknown`', id: '`unknown`' },
                { en: '`T`', id: '`T`' },
                { en: '`boolean[]`', id: '`boolean[]`' },
              ],
              answer: 0,
              explain: {
                en: 'T was inferred as `boolean` from the argument, and the return type was written in terms of T.',
                id: 'T disimpulkan sebagai `boolean` dari argumennya, dan tipe kembaliannya ditulis dalam bentuk T.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Make this function generic: it returns a copy of the list, reversed.',
                id: 'Buat fungsi ini generik: ia mengembalikan salinan daftarnya, terbalik.',
              },
              template: 'function balik___(daftar: ___[]): ___[] {\n  return [...daftar].reverse();\n}',
              blanks: ['<T>', 'T', 'T'],
              explain: {
                en: 'Declare the parameter once in the angle brackets, then use it wherever the type belongs.',
                id: 'Deklarasikan parameternya sekali di dalam kurung sudut, lalu pakai di mana pun tipenya berada.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Make both functions generic. `terakhir` returns the last item of any list, and `cariId` finds an item by `id` in any list of things that have one — both keeping the caller\'s own type.',
                id: 'Buat kedua fungsinya generik. `terakhir` mengembalikan item terakhir dari daftar apa pun, dan `cariId` mencari item berdasarkan `id` di daftar apa pun yang punya `id` — keduanya menjaga tipe milik pemanggilnya.',
              },
              starter:
                'function terakhir(daftar: unknown[]): unknown {\n' +
                '  return daftar[daftar.length - 1];\n' +
                '}\n\n' +
                'function cariId(daftar: { id: number }[], id: number): { id: number } | undefined {\n' +
                '  return daftar.find((x) => x.id === id);\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'They still do their job', id: 'Keduanya tetap menjalankan tugasnya' },
                  check:
                    'assert(terakhir([1, 2, 3]) === 3, "terakhir([1,2,3]) harus 3, sekarang: " + terakhir([1, 2, 3]));\n' +
                    'assert(terakhir(["a"]) === "a", "terakhir([\\"a\\"]) harus \\"a\\", sekarang: " + terakhir(["a"]));\n' +
                    'assert(terakhir([]) === undefined, "daftar kosong harus undefined, sekarang: " + terakhir([]));\n' +
                    'assert(cariId([{ id: 1 }, { id: 2 }], 2).id === 2, "cariId harus menemukan id 2");\n' +
                    'assert(cariId([{ id: 1 }], 9) === undefined, "id yang tak ada harus undefined, sekarang: " + cariId([{ id: 1 }], 9));',
                },
                {
                  name: { en: 'A list of strings gives back a string', id: 'Daftar string mengembalikan string' },
                  probe: 'const uji1: string | undefined = terakhir(["a", "b"]);',
                },
                {
                  name: { en: 'It is not secretly returning anything', id: 'Ia tidak diam-diam mengembalikan apa saja' },
                  probe: 'const uji2: number | undefined = terakhir(["a", "b"]);',
                  expectError: true,
                  errorCode: 2322,
                },
                {
                  name: { en: 'The result may be missing, and the caller is told', id: 'Hasilnya mungkin tidak ada, dan pemanggilnya diberi tahu' },
                  probe: 'const uji3: number = terakhir([1, 2]);',
                  expectError: true,
                  errorCode: 2322,
                },
                {
                  name: { en: 'cariId hands back the whole object', id: 'cariId mengembalikan objek utuhnya' },
                  probe: 'const uji4: string | undefined = cariId([{ id: 1, nama: "Ani" }], 1)?.nama;',
                },
                {
                  name: { en: 'A list without ids is refused', id: 'Daftar tanpa id ditolak' },
                  probe: 'cariId([{ nama: "Ani" }], 1);',
                  expectError: true,
                  errorCode: 2353,
                },
              ],
              hints: [
                { en: 'The starter compiles. What it does not do is remember what it was given.', id: 'Kode awalnya lolos kompilasi. Yang tidak ia lakukan adalah mengingat apa yang tadi diberikan padanya.' },
                { en: 'Declare `<T>` after the function name, before the round brackets.', id: 'Deklarasikan `<T>` setelah nama fungsinya, sebelum kurung bulatnya.' },
                { en: 'cariId needs a constraint, because it reads `.id` inside: `<T extends { id: number }>`.', id: 'cariId butuh batasan, karena ia membaca `.id` di dalamnya: `<T extends { id: number }>`.' },
              ],
              solution:
                'function terakhir<T>(daftar: T[]): T | undefined {\n' +
                '  return daftar[daftar.length - 1];\n' +
                '}\n\n' +
                'function cariId<T extends { id: number }>(daftar: T[], id: number): T | undefined {\n' +
                '  return daftar.find((x) => x.id === id);\n' +
                '}',
            },
          ],
        },
        {
          id: 'ts-m3-s1-l2',
          title: { en: 'A type that takes a type', id: 'Tipe yang menerima tipe' },
          goal: { en: 'Declare a generic type and use it.', id: 'Mendeklarasikan tipe generik dan memakainya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Types take parameters too', id: 'Tipe juga menerima parameter' },
              body: {
                en: 'You have been using one all along: `Array<T>` is a generic type, and `T[]` is shorthand for it. Your own types can take parameters the same way — write `<T>` after the name and use `T` in the body.',
                id: 'Kamu sudah memakainya sejak tadi: `Array<T>` adalah tipe generik, dan `T[]` adalah singkatannya. Tipe buatanmu bisa menerima parameter dengan cara yang sama — tulis `<T>` setelah namanya dan pakai `T` di dalam badannya.',
              },
              code:
                'type Kotak<T> = { isi: T; dibuat: number };\n\n' +
                'const a: Kotak<string> = { isi: "halo", dibuat: 1 };\n' +
                'const b: Kotak<number[]> = { isi: [1, 2], dibuat: 2 };',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A generic tagged union', id: 'Union bertanda yang generik' },
              body: {
                en: 'Put the two ideas together and you get the shape every program eventually needs: a result that either carries a value or explains why it does not. Because the members differ in `ok`, the compiler will not let you read `data` until you have checked — you cannot forget the failure case.',
                id: 'Satukan kedua gagasannya dan kamu mendapat bentuk yang cepat atau lambat dibutuhkan tiap program: sebuah hasil yang entah membawa nilai atau menjelaskan mengapa tidak. Karena anggotanya berbeda pada `ok`, kompilernya tak akan membiarkanmu membaca `data` sebelum kamu memeriksa — kamu tak bisa melupakan kasus gagalnya.',
              },
              code: {
                en:
                  'type Hasil<T> =\n' +
                  '  | { ok: true; data: T }\n' +
                  '  | { ok: false; pesan: string };\n\n' +
                  'const h: Hasil<number> = { ok: true, data: 7 };\n\n' +
                  "h.data;            // Property 'data' does not exist on type 'Hasil<number>'.\n" +
                  'if (h.ok) h.data;  // fine',
                id:
                  'type Hasil<T> =\n' +
                  '  | { ok: true; data: T }\n' +
                  '  | { ok: false; pesan: string };\n\n' +
                  'const h: Hasil<number> = { ok: true, data: 7 };\n\n' +
                  "h.data;            // Property 'data' does not exist on type 'Hasil<number>'.\n" +
                  'if (h.ok) h.data;  // baik',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Record for a keyed collection', id: 'Record untuk koleksi berkunci' },
              body: {
                en: '`Record<K, V>` is an object used as a lookup: every key of type K maps to a value of type V. `Record<string, number>` is "any string name, always a number" — a dictionary whose values are all checked, unlike a plain object where each key is its own little surprise.',
                id: '`Record<K, V>` adalah objek yang dipakai sebagai tabel pencarian: tiap kunci bertipe K memetakan ke nilai bertipe V. `Record<string, number>` berarti "nama string apa pun, selalu berupa angka" — kamus yang semua nilainya terperiksa, tak seperti objek biasa yang tiap kuncinya jadi kejutan kecil sendiri.',
              },
              code: {
                en:
                  'const stok: Record<string, number> = { pensil: 40, spidol: 0 };\n' +
                  'stok.pensil.toFixed(0);   // safe: the value is a number\n\n' +
                  'type Ukuran = "kecil" | "besar";\n' +
                  'const biaya: Record<Ukuran, number> = { kecil: 0, besar: 10000 };\n' +
                  '// leaving out one of the keys is an error',
                id:
                  'const stok: Record<string, number> = { pensil: 40, spidol: 0 };\n' +
                  'stok.pensil.toFixed(0);   // aman: nilainya number\n\n' +
                  'type Ukuran = "kecil" | "besar";\n' +
                  'const biaya: Record<Ukuran, number> = { kecil: 0, besar: 10000 };\n' +
                  '// menghilangkan salah satu kuncinya adalah galat',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is `h.data` refused here?',
                id: 'Mengapa `h.data` ditolak di sini?',
              },
              code: 'type Hasil<T> = { ok: true; data: T } | { ok: false; pesan: string };\n\nfunction f(h: Hasil<string>) {\n  return h.data;\n}',
              options: [
                { en: 'The failure member has no `data`, and it has not been ruled out', id: 'Anggota gagalnya tak punya `data`, dan ia belum disingkirkan' },
                { en: '`data` is private', id: '`data` bersifat privat' },
                { en: 'Generic types cannot be read', id: 'Tipe generik tidak bisa dibaca' },
                { en: 'You must write `Hasil<any>`', id: 'Kamu harus menulis `Hasil<any>`' },
              ],
              answer: 0,
              explain: {
                en: 'Only properties every member has are available before narrowing — here that is just `ok`, which is exactly the one you are meant to check.',
                id: 'Hanya properti yang dimiliki tiap anggota yang tersedia sebelum penyempitan — di sini hanya `ok`, dan justru itulah yang memang harus kamu periksa.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `type Hasil<T>` as a tagged union of `{ ok: true; data: T }` and `{ ok: false; pesan: string }`, then write `berhasil`, `gagal`, and `ambilData(h, cadangan)` which returns the data or the fallback.',
                id: 'Deklarasikan `type Hasil<T>` sebagai union bertanda berisi `{ ok: true; data: T }` dan `{ ok: false; pesan: string }`, lalu tulis `berhasil`, `gagal`, dan `ambilData(h, cadangan)` yang mengembalikan datanya atau nilai cadangannya.',
              },
              starter:
                'type Hasil<T> = { ok: boolean; data?: T; pesan?: string };\n\n' +
                'function berhasil<T>(data: T): Hasil<T> {\n  return { ok: true, data };\n}\n\n' +
                'function gagal<T>(pesan: string): Hasil<T> {\n  return { ok: false, pesan };\n}\n\n' +
                'function ambilData<T>(h: Hasil<T>, cadangan: T): T {\n  return cadangan;\n}\n',
              tests: [
                {
                  name: { en: 'The three functions behave', id: 'Ketiga fungsinya berperilaku benar' },
                  check:
                    'const a = berhasil(7);\n' +
                    'assert(a.ok === true && a.data === 7, "berhasil(7) harus { ok: true, data: 7 }");\n' +
                    'const b = gagal("rusak");\n' +
                    'assert(b.ok === false && b.pesan === "rusak", "gagal harus membawa pesannya");\n' +
                    'assert(ambilData(berhasil(7), 0) === 7, "harus mengambil datanya, sekarang: " + ambilData(berhasil(7), 0));\n' +
                    'assert(ambilData(gagal("x"), 0) === 0, "harus memakai cadangannya, sekarang: " + ambilData(gagal("x"), 0));',
                },
                {
                  name: { en: 'A success carries its own type', id: 'Keberhasilan membawa tipenya sendiri' },
                  probe: 'const uji1: Hasil<string> = berhasil("a");',
                },
                {
                  name: { en: 'A number is not a Hasil<string>', id: 'Angka bukan sebuah Hasil<string>' },
                  probe: 'const uji2: Hasil<string> = berhasil(1);',
                  expectError: true,
                },
                {
                  name: { en: 'data cannot be read before ok is checked', id: 'data tak bisa dibaca sebelum ok diperiksa' },
                  probe: 'const uji3 = berhasil("a");\nconst uji4: string = uji3.data;',
                  expectError: true,
                  errorCode: 2339,
                },
                {
                  name: { en: 'After the check it can', id: 'Setelah diperiksa, ia bisa' },
                  probe: 'const uji5 = berhasil("a");\nif (uji5.ok) {\n  const uji6: string = uji5.data;\n}',
                },
                {
                  name: { en: 'A failure has no data at all', id: 'Kegagalan sama sekali tak punya data' },
                  probe: 'const uji7: Hasil<string> = { ok: false, pesan: "x", data: "a" };',
                  expectError: true,
                },
                {
                  name: { en: 'The fallback must match the payload', id: 'Cadangannya harus sejenis dengan muatannya' },
                  probe: 'ambilData(berhasil("a"), 0);',
                  expectError: true,
                },
              ],
              hints: [
                { en: 'The starter makes both fields optional, so nothing about it can be checked. Split it into two members.', id: 'Kode awalnya membuat kedua field-nya opsional, jadi tak ada yang bisa diperiksa. Pecah jadi dua anggota.' },
                { en: 'The tag here is `ok`, and its two literal types are `true` and `false`.', id: 'Penandanya di sini `ok`, dan dua tipe literalnya `true` dan `false`.' },
                { en: '`ambilData` narrows on `h.ok` and returns `h.data`, or the fallback.', id: '`ambilData` mempersempit pada `h.ok` lalu mengembalikan `h.data`, atau cadangannya.' },
              ],
              solution:
                'type Hasil<T> =\n' +
                '  | { ok: true; data: T }\n' +
                '  | { ok: false; pesan: string };\n\n' +
                'function berhasil<T>(data: T): Hasil<T> {\n' +
                '  return { ok: true, data };\n' +
                '}\n\n' +
                'function gagal<T>(pesan: string): Hasil<T> {\n' +
                '  return { ok: false, pesan };\n' +
                '}\n\n' +
                'function ambilData<T>(h: Hasil<T>, cadangan: T): T {\n' +
                '  return h.ok ? h.data : cadangan;\n' +
                '}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m3-s1-p1',
        runtime: 'ts',
        title: { en: 'The Typed Dictionary', id: 'Kamus Bertipe' },
        brief: {
          en: 'A small lookup table that works for any value type — and a map function that changes the value type as it goes.',
          id: 'Tabel pencarian kecil yang berlaku untuk tipe nilai apa pun — dan fungsi pemeta yang mengubah tipe nilainya sambil jalan.',
        },
        requirements: [
          { en: '`type Kamus<T>` is a `Record` from string keys to values of type T.', id: '`type Kamus<T>` adalah `Record` dari kunci string ke nilai bertipe T.' },
          { en: '`simpan(k, kunci, nilai)` returns a **new** dictionary with that key set. The original is untouched.', id: '`simpan(k, kunci, nilai)` mengembalikan kamus **baru** dengan kunci itu terisi. Yang aslinya tak tersentuh.' },
          { en: '`ambil(k, kunci, cadangan)` returns the value, or the fallback when the key is absent.', id: '`ambil(k, kunci, cadangan)` mengembalikan nilainya, atau cadangannya ketika kuncinya tidak ada.' },
          { en: '`kunciDari(k)` returns the keys as `string[]`.', id: '`kunciDari(k)` mengembalikan kuncinya sebagai `string[]`.' },
          { en: '`petakan(k, ubah)` runs a function over every value and returns a dictionary of whatever that function returns — a **different** value type is allowed.', id: '`petakan(k, ubah)` menjalankan sebuah fungsi pada tiap nilainya dan mengembalikan kamus berisi apa pun yang dikembalikan fungsi itu — tipe nilai yang **berbeda** diperbolehkan.' },
        ],
        starter:
          'type Kamus<T> = Record<string, unknown>;\n\n' +
          'function simpan<T>(k: Kamus<T>, kunci: string, nilai: T): Kamus<T> {\n\n}\n\n' +
          'function ambil<T>(k: Kamus<T>, kunci: string, cadangan: T): T {\n\n}\n\n' +
          'function kunciDari<T>(k: Kamus<T>): string[] {\n\n}\n\n' +
          'function petakan<T>(k: Kamus<T>, ubah: (nilai: T) => T): Kamus<T> {\n\n}\n',
        tests: [
          {
            name: { en: 'Storing does not touch the original', id: 'Menyimpan tidak menyentuh yang asli' },
            check:
              'const awal = { pensil: 40 };\n' +
              'const baru = simpan(awal, "spidol", 5);\n' +
              'assert(baru.spidol === 5 && baru.pensil === 40, "kamus barunya harus punya keduanya");\n' +
              'assert(awal.spidol === undefined, "kamus aslinya tidak boleh berubah");\n' +
              'const ganti = simpan(awal, "pensil", 1);\n' +
              'assert(ganti.pensil === 1 && awal.pensil === 40, "menimpa kunci juga harus menyalin");',
          },
          {
            name: { en: 'Reading falls back when the key is absent', id: 'Membaca memakai cadangan ketika kuncinya tidak ada' },
            check:
              'const stok = { pensil: 40 };\n' +
              'assert(ambil(stok, "pensil", 0) === 40, "sekarang: " + ambil(stok, "pensil", 0));\n' +
              'assert(ambil(stok, "spidol", 0) === 0, "kunci yang tak ada harus memakai cadangan, sekarang: " + ambil(stok, "spidol", 0));\n' +
              'assert(ambil({ nol: 0 }, "nol", 99) === 0, "nilai 0 bukan ketiadaan, sekarang: " + ambil({ nol: 0 }, "nol", 99));',
          },
          {
            name: { en: 'The keys come back', id: 'Kuncinya kembali' },
            check:
              'const k = kunciDari({ a: 1, b: 2 });\n' +
              'assert(k.length === 2 && k.includes("a") && k.includes("b"), "harus [a, b], sekarang: " + JSON.stringify(k));\n' +
              'assert(kunciDari({}).length === 0, "kamus kosong harus tanpa kunci");',
          },
          {
            name: { en: 'Mapping visits every value', id: 'Pemetaan mengunjungi tiap nilai' },
            check:
              'const dua = petakan({ a: 1, b: 2 }, (n) => n * 2);\n' +
              'assert(dua.a === 2 && dua.b === 4, "sekarang: " + JSON.stringify(dua));\n' +
              'const teks = petakan({ a: 1 }, (n) => "#" + n);\n' +
              'assert(teks.a === "#1", "harus bisa berganti tipe, sekarang: " + JSON.stringify(teks));',
          },
          {
            name: { en: 'A dictionary of numbers holds numbers', id: 'Kamus angka berisi angka' },
            probe: 'const uji1: Kamus<number> = { a: 1 };\nconst uji2: number = ambil(uji1, "a", 0);',
          },
          {
            name: { en: 'A string is not a number', id: 'String bukan angka' },
            probe: 'const uji3: Kamus<number> = { a: "satu" };',
            expectError: true,
          },
          {
            name: { en: 'The stored value must match the dictionary', id: 'Nilai yang disimpan harus sejenis dengan kamusnya' },
            probe: 'const uji4: Kamus<number> = { a: 1 };\nsimpan(uji4, "b", "dua");',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'The fallback must match too', id: 'Cadangannya juga harus sejenis' },
            probe: 'const uji5: Kamus<number> = { a: 1 };\nambil(uji5, "a", "nol");',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'Mapping may change the value type', id: 'Pemetaan boleh mengubah tipe nilainya' },
            probe: 'const uji6: Kamus<number> = { a: 1 };\nconst uji7: Kamus<string> = petakan(uji6, (n) => `#${n}`);',
          },
          {
            name: { en: 'The mapped type is tracked, not guessed', id: 'Tipe hasil pemetaannya dilacak, bukan ditebak' },
            probe: 'const uji8: Kamus<number> = { a: 1 };\nconst uji9: Kamus<number> = petakan(uji8, (n) => `#${n}`);',
            expectError: true,
          },
        ],
        hints: [
          { en: 'The starter declares `Kamus<T>` without ever using T — that is why nothing is checked. Fix that line first.', id: 'Kode awalnya mendeklarasikan `Kamus<T>` tanpa pernah memakai T — itulah sebabnya tak ada yang diperiksa. Betulkan baris itu lebih dulu.' },
          { en: 'A new object with one key changed is `{ ...k, [kunci]: nilai }`.', id: 'Objek baru dengan satu kunci berubah adalah `{ ...k, [kunci]: nilai }`.' },
          { en: '"Absent" is not the same as falsy: use `kunci in k`, or `??`, not `||`.', id: '"Tidak ada" tidak sama dengan falsy: pakai `kunci in k`, atau `??`, jangan `||`.' },
          { en: '`petakan` needs a second type parameter for what comes out: `<T, U>(k: Kamus<T>, ubah: (nilai: T) => U): Kamus<U>`.', id: '`petakan` butuh parameter tipe kedua untuk yang keluar: `<T, U>(k: Kamus<T>, ubah: (nilai: T) => U): Kamus<U>`.' },
        ],
        solution:
          'type Kamus<T> = Record<string, T>;\n\n' +
          'function simpan<T>(k: Kamus<T>, kunci: string, nilai: T): Kamus<T> {\n' +
          '  return { ...k, [kunci]: nilai };\n' +
          '}\n\n' +
          'function ambil<T>(k: Kamus<T>, kunci: string, cadangan: T): T {\n' +
          '  return kunci in k ? k[kunci] : cadangan;\n' +
          '}\n\n' +
          'function kunciDari<T>(k: Kamus<T>): string[] {\n' +
          '  return Object.keys(k);\n' +
          '}\n\n' +
          'function petakan<T, U>(k: Kamus<T>, ubah: (nilai: T) => U): Kamus<U> {\n' +
          '  const hasil: Kamus<U> = {};\n' +
          '  for (const kunci of Object.keys(k)) {\n' +
          '    hasil[kunci] = ubah(k[kunci]);\n' +
          '  }\n' +
          '  return hasil;\n' +
          '}',
        xp: 50,
      },
    },
    {
      id: 'ts-m3-s2',
      title: { en: 'Types Made From Types', id: 'Tipe yang Dibuat dari Tipe' },
      summary: {
        en: 'Derive one type from another so the two can never drift apart.',
        id: 'Menurunkan satu tipe dari tipe lain agar keduanya tak pernah berselisih.',
      },
      lessons: [
        {
          id: 'ts-m3-s2-l1',
          title: { en: 'keyof, and the type at a key', id: 'keyof, dan tipe pada sebuah kunci' },
          goal: { en: 'Write a getter that knows what it returns.', id: 'Menulis pengambil nilai yang tahu apa yang ia kembalikan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'keyof T is the union of its key names', id: 'keyof T adalah union nama kuncinya' },
              body: {
                en: 'For `{ nama: string; umur: number }`, `keyof` that type is `"nama" | "umur"` — a literal union, worked out from the shape rather than typed out again. Rename a property and the union follows; nothing gets left behind.',
                id: 'Untuk `{ nama: string; umur: number }`, `keyof` dari tipe itu adalah `"nama" | "umur"` — union literal, dihitung dari bentuknya alih-alih diketik ulang. Ganti nama sebuah properti dan union-nya ikut; tak ada yang tertinggal.',
              },
              code: {
                en:
                  'interface Orang { nama: string; umur: number }\n\n' +
                  'type Kunci = keyof Orang;   // "nama" | "umur"\n' +
                  'const k: Kunci = "umur";    // fine\n' +
                  'const j: Kunci = "alamat";  // rejected',
                id:
                  'interface Orang { nama: string; umur: number }\n\n' +
                  'type Kunci = keyof Orang;   // "nama" | "umur"\n' +
                  'const k: Kunci = "umur";    // baik\n' +
                  'const j: Kunci = "alamat";  // ditolak',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'T[K] is the type stored at that key', id: 'T[K] adalah tipe yang tersimpan di kunci itu' },
              body: {
                en: 'Indexing works on types the way it works on values. `Orang["nama"]` is `string`. Combine that with a constrained parameter and you get a getter whose return type depends on which key you asked for — different for every call, and correct every time.',
                id: 'Pengindeksan bekerja pada tipe seperti ia bekerja pada nilai. `Orang["nama"]` adalah `string`. Gabungkan itu dengan parameter yang dibatasi dan kamu mendapat pengambil nilai yang tipe kembaliannya bergantung pada kunci yang kamu minta — berbeda di tiap pemanggilan, dan benar setiap kali.',
              },
              code: {
                en:
                  'function ambil<T, K extends keyof T>(obj: T, kunci: K): T[K] {\n' +
                  '  return obj[kunci];\n' +
                  '}\n\n' +
                  'const o = { nama: "Ani", umur: 17 };\n' +
                  'ambil(o, "nama");   // string\n' +
                  'ambil(o, "umur");   // number\n' +
                  'ambil(o, "kota");   // rejected: not a key of o',
                id:
                  'function ambil<T, K extends keyof T>(obj: T, kunci: K): T[K] {\n' +
                  '  return obj[kunci];\n' +
                  '}\n\n' +
                  'const o = { nama: "Ani", umur: 17 };\n' +
                  'ambil(o, "nama");   // string\n' +
                  'ambil(o, "umur");   // number\n' +
                  'ambil(o, "kota");   // ditolak: bukan kunci milik o',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'This is why it beats a string', id: 'Inilah sebabnya ini mengalahkan string' },
              body: {
                en: 'The same function written with `kunci: string` compiles, and gives back a value the caller has to guess about. The `keyof` version rejects a mistyped key at the call site *and* tells the caller exactly what came back. Two problems, one signature.',
                id: 'Fungsi yang sama ditulis dengan `kunci: string` juga lolos kompilasi, dan mengembalikan nilai yang harus ditebak-tebak pemanggilnya. Versi `keyof` menolak kunci yang salah ketik tepat di tempat pemanggilannya *sekaligus* memberi tahu pemanggilnya persis apa yang kembali. Dua masalah, satu tanda tangan.',
              },
              code: {
                en:
                  '// loses two things at once\nfunction ambilLemah(obj: Record<string, unknown>, kunci: string): unknown {\n' +
                  '  return obj[kunci];\n' +
                  '}',
                id:
                  '// kehilangan dua hal sekaligus\nfunction ambilLemah(obj: Record<string, unknown>, kunci: string): unknown {\n' +
                  '  return obj[kunci];\n' +
                  '}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With `ambil<T, K extends keyof T>(obj: T, kunci: K): T[K]`, what is the type of `x`?',
                id: 'Dengan `ambil<T, K extends keyof T>(obj: T, kunci: K): T[K]`, apa tipe `x`?',
              },
              code: 'const p = { judul: "Bumi Manusia", tahun: 1980 };\nconst x = ambil(p, "tahun");',
              options: [
                { en: '`number`', id: '`number`' },
                { en: '`string | number`', id: '`string | number`' },
                { en: '`unknown`', id: '`unknown`' },
                { en: '`"tahun"`', id: '`"tahun"`' },
              ],
              answer: 0,
              explain: {
                en: 'K was inferred as the literal `"tahun"`, so `T[K]` is the type at exactly that key.',
                id: 'K disimpulkan sebagai literal `"tahun"`, jadi `T[K]` adalah tipe pada persis kunci itu.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Rewrite `ambil` so it accepts only real keys of the object and returns the type stored at that key. Then write `ambilBanyak`, taking a list of keys and returning a list of their values.',
                id: 'Tulis ulang `ambil` agar ia hanya menerima kunci yang benar-benar dimiliki objeknya dan mengembalikan tipe yang tersimpan di kunci itu. Lalu tulis `ambilBanyak`, yang menerima daftar kunci dan mengembalikan daftar nilainya.',
              },
              starter:
                'function ambil(obj: Record<string, unknown>, kunci: string): unknown {\n' +
                '  return obj[kunci];\n' +
                '}\n\n' +
                'function ambilBanyak(obj: Record<string, unknown>, kunci: string[]): unknown[] {\n' +
                '  return kunci.map((k) => obj[k]);\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'Both still read the object', id: 'Keduanya tetap membaca objeknya' },
                  check:
                    'const p = { judul: "Bumi Manusia", tahun: 1980 };\n' +
                    'assert(ambil(p, "judul") === "Bumi Manusia", "sekarang: " + ambil(p, "judul"));\n' +
                    'assert(ambil(p, "tahun") === 1980, "sekarang: " + ambil(p, "tahun"));\n' +
                    'const dua = ambilBanyak(p, ["judul", "tahun"]);\n' +
                    'assert(dua.length === 2 && dua[0] === "Bumi Manusia" && dua[1] === 1980, "sekarang: " + JSON.stringify(dua));\n' +
                    'assert(ambilBanyak(p, []).length === 0, "daftar kunci kosong harus memberi daftar kosong");',
                },
                {
                  name: { en: 'A string key gives back a string', id: 'Kunci berisi string mengembalikan string' },
                  probe: 'const uji1: string = ambil({ judul: "a", tahun: 1 }, "judul");',
                },
                {
                  name: { en: 'A number key gives back a number', id: 'Kunci berisi angka mengembalikan angka' },
                  probe: 'const uji2: number = ambil({ judul: "a", tahun: 1 }, "tahun");',
                },
                {
                  name: { en: 'It does not mix the two up', id: 'Ia tidak mencampuradukkan keduanya' },
                  probe: 'const uji3: number = ambil({ judul: "a", tahun: 1 }, "judul");',
                  expectError: true,
                  errorCode: 2322,
                },
                {
                  name: { en: 'A key that is not there is refused', id: 'Kunci yang tidak ada ditolak' },
                  probe: 'ambil({ judul: "a", tahun: 1 }, "penulis");',
                  expectError: true,
                  errorCode: 2345,
                },
                {
                  name: { en: 'ambilBanyak keeps the value type too', id: 'ambilBanyak juga menjaga tipe nilainya' },
                  probe: 'const uji4: string[] = ambilBanyak({ judul: "a", sub: "b" }, ["judul", "sub"]);',
                },
                {
                  name: { en: 'A bad key in the list is refused', id: 'Kunci yang salah di dalam daftar ditolak' },
                  probe: 'ambilBanyak({ judul: "a", tahun: 1 }, ["judul", "penulis"]);',
                  expectError: true,
                },
              ],
              hints: [
                { en: 'Two type parameters: one for the object, one for the key.', id: 'Dua parameter tipe: satu untuk objeknya, satu untuk kuncinya.' },
                { en: 'The key parameter is constrained: `K extends keyof T`.', id: 'Parameter kuncinya dibatasi: `K extends keyof T`.' },
                { en: 'The return type is written `T[K]` — and for the list version, `T[K][]`.', id: 'Tipe kembaliannya ditulis `T[K]` — dan untuk versi daftarnya, `T[K][]`.' },
              ],
              solution:
                'function ambil<T, K extends keyof T>(obj: T, kunci: K): T[K] {\n' +
                '  return obj[kunci];\n' +
                '}\n\n' +
                'function ambilBanyak<T, K extends keyof T>(obj: T, kunci: K[]): T[K][] {\n' +
                '  return kunci.map((k) => obj[k]);\n' +
                '}',
            },
          ],
        },
        {
          id: 'ts-m3-s2-l2',
          title: { en: 'The types that come with TypeScript', id: 'Tipe bawaan TypeScript' },
          goal: { en: 'Use Partial, Pick and Omit instead of retyping a shape.', id: 'Memakai Partial, Pick, dan Omit alih-alih mengetik ulang sebuah bentuk.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Partial and Readonly', id: 'Partial dan Readonly' },
              body: {
                en: '`Partial<T>` is T with every property optional — exactly what a "patch" argument is. `Readonly<T>` is T with every property read-only. Both are derived from T, so adding a property to T updates them for free, and none of your code goes stale.',
                id: '`Partial<T>` adalah T dengan tiap propertinya opsional — persis seperti argumen "tambalan". `Readonly<T>` adalah T dengan tiap propertinya read-only. Keduanya diturunkan dari T, jadi menambahkan properti ke T memperbaruinya secara cuma-cuma, dan tak ada kodemu yang jadi basi.',
              },
              code: {
                en:
                  'interface Pengguna { id: number; nama: string; aktif: boolean }\n\n' +
                  'function perbarui(p: Pengguna, ubahan: Partial<Pengguna>): Pengguna {\n' +
                  '  return { ...p, ...ubahan };\n' +
                  '}\n\n' +
                  'perbarui(p, { nama: "Ani" });   // fine\n' +
                  'perbarui(p, { nama: 1 });        // rejected: still has to be a string',
                id:
                  'interface Pengguna { id: number; nama: string; aktif: boolean }\n\n' +
                  'function perbarui(p: Pengguna, ubahan: Partial<Pengguna>): Pengguna {\n' +
                  '  return { ...p, ...ubahan };\n' +
                  '}\n\n' +
                  'perbarui(p, { nama: "Ani" });   // baik\n' +
                  'perbarui(p, { nama: 1 });        // ditolak: tetap harus string',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Pick and Omit choose properties', id: 'Pick dan Omit memilih properti' },
              body: {
                en: '`Pick<T, K>` keeps only the listed properties; `Omit<T, K>` keeps everything except them. Use them for the shapes that are "the same thing, minus the parts this bit does not need" — a summary for a list, or a form for creating something that has no id yet.',
                id: '`Pick<T, K>` menyimpan hanya properti yang disebut; `Omit<T, K>` menyimpan semuanya kecuali itu. Pakai untuk bentuk yang berupa "benda yang sama, dikurangi bagian yang tak dibutuhkan di sini" — ringkasan untuk sebuah daftar, atau formulir untuk membuat sesuatu yang belum punya id.',
              },
              code:
                'type Ringkas = Pick<Pengguna, "id" | "nama">;\n' +
                '// { id: number; nama: string }\n\n' +
                'type Baru = Omit<Pengguna, "id">;\n' +
                '// { nama: string; aktif: boolean }',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Derived beats duplicated', id: 'Diturunkan mengalahkan disalin' },
              body: {
                en: 'You could write `Ringkas` out by hand. It would be the same today and wrong in a month, the first time somebody renames a property in `Pengguna` and does not think to look here. Deriving it means the compiler does the looking.',
                id: 'Kamu bisa saja menulis `Ringkas` dengan tangan. Ia akan sama hari ini dan salah sebulan lagi, pertama kali seseorang mengganti nama properti di `Pengguna` dan tak terpikir untuk melihat ke sini. Menurunkannya berarti kompilernya yang melihat.',
              },
              code: {
                en:
                  '// fragile\ntype Ringkas = { id: number; nama: string };\n\n' +
                  '// follows automatically\ntype Ringkas = Pick<Pengguna, "id" | "nama">;',
                id:
                  '// rapuh\ntype Ringkas = { id: number; nama: string };\n\n' +
                  '// mengikuti dengan sendirinya\ntype Ringkas = Pick<Pengguna, "id" | "nama">;',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does `Omit<Pengguna, "id">` allow?',
                id: 'Apa yang diizinkan `Omit<Pengguna, "id">`?',
              },
              code: 'interface Pengguna { id: number; nama: string; aktif: boolean }',
              options: [
                { en: 'An object with `nama` and `aktif`, and no `id`', id: 'Objek dengan `nama` dan `aktif`, tanpa `id`' },
                { en: 'An object with only `id`', id: 'Objek yang hanya punya `id`' },
                { en: 'An object where `id` is optional', id: 'Objek yang `id`-nya opsional' },
                { en: 'Any object at all', id: 'Objek apa pun' },
              ],
              answer: 0,
              explain: {
                en: 'Omit removes the property entirely. Making it optional would be `Partial<Pick<Pengguna, "id">>` joined back on — a different thing.',
                id: 'Omit membuang propertinya sama sekali. Membuatnya opsional berarti `Partial<Pick<Pengguna, "id">>` digabung kembali — hal yang berbeda.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'A patch argument, and a summary shape.',
                id: 'Argumen tambalan, dan bentuk ringkasan.',
              },
              template: 'function ubah(p: Pengguna, u: ___<Pengguna>): Pengguna;\ntype Kartu = ___<Pengguna, "id" | "nama">;',
              blanks: ['Partial', 'Pick'],
              explain: {
                en: 'Partial makes everything optional; Pick keeps only what you list.',
                id: 'Partial membuat semuanya opsional; Pick menyimpan hanya yang kamu sebut.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `interface Pengguna` with `id` (number), `nama` (string), `surel` (string) and `aktif` (boolean). Derive `type Ringkas` (only id and nama) and `type Baru` (everything except id), then write `perbarui(p, ubahan)` taking a patch.',
                id: 'Deklarasikan `interface Pengguna` dengan `id` (number), `nama` (string), `surel` (string), dan `aktif` (boolean). Turunkan `type Ringkas` (hanya id dan nama) dan `type Baru` (semuanya kecuali id), lalu tulis `perbarui(p, ubahan)` yang menerima tambalan.',
              },
              starter:
                'interface Pengguna {\n\n}\n\n' +
                'type Ringkas = Pengguna;\n\n' +
                'type Baru = Pengguna;\n\n' +
                'function perbarui(p: Pengguna, ubahan: Pengguna): Pengguna {\n' +
                '  return { ...p, ...ubahan };\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'A patch overwrites only what it names', id: 'Tambalan hanya menimpa yang ia sebut' },
                  check:
                    'const p = { id: 1, nama: "Ani", surel: "a@b.c", aktif: true };\n' +
                    'const q = perbarui(p, { nama: "Budi" });\n' +
                    'assert(q.nama === "Budi", "nama harus berubah, sekarang: " + q.nama);\n' +
                    'assert(q.surel === "a@b.c" && q.aktif === true && q.id === 1, "sisanya harus utuh");\n' +
                    'assert(p.nama === "Ani", "yang asli tidak boleh berubah, sekarang: " + p.nama);\n' +
                    'assert(perbarui(p, {}).nama === "Ani", "tambalan kosong tidak mengubah apa pun");',
                },
                {
                  name: { en: 'A full user is accepted', id: 'Pengguna lengkap diterima' },
                  probe: 'const uji1: Pengguna = { id: 1, nama: "a", surel: "b", aktif: true };',
                },
                {
                  name: { en: 'Ringkas holds only the two', id: 'Ringkas hanya memuat yang dua' },
                  probe: 'const uji2: Ringkas = { id: 1, nama: "a" };',
                },
                {
                  name: { en: 'Ringkas refuses the rest', id: 'Ringkas menolak sisanya' },
                  probe: 'const uji3: Ringkas = { id: 1, nama: "a", surel: "b" };',
                  expectError: true,
                  errorCode: 2353,
                },
                {
                  name: { en: 'Baru has everything but the id', id: 'Baru punya semuanya kecuali id' },
                  probe: 'const uji4: Baru = { nama: "a", surel: "b", aktif: true };',
                },
                {
                  name: { en: 'Baru refuses an id', id: 'Baru menolak id' },
                  probe: 'const uji5: Baru = { id: 1, nama: "a", surel: "b", aktif: true };',
                  expectError: true,
                  errorCode: 2353,
                },
                {
                  name: { en: 'A patch may name one field', id: 'Tambalan boleh menyebut satu field' },
                  probe: 'const uji6: Pengguna = { id: 1, nama: "a", surel: "b", aktif: true };\nperbarui(uji6, { aktif: false });',
                },
                {
                  name: { en: 'A patch still has to be the right type', id: 'Tambalannya tetap harus bertipe benar' },
                  probe: 'const uji7: Pengguna = { id: 1, nama: "a", surel: "b", aktif: true };\nperbarui(uji7, { nama: 1 });',
                  expectError: true,
                },
              ],
              hints: [
                { en: 'Write the interface first; the three lines below all derive from it.', id: 'Tulis interface-nya lebih dulu; tiga baris di bawahnya semua diturunkan darinya.' },
                { en: 'Pick and Omit both take the keys as a union of string literals.', id: 'Pick dan Omit sama-sama menerima kuncinya sebagai union literal string.' },
                { en: 'The patch parameter is `Partial<Pengguna>` — the body already spreads it correctly.', id: 'Parameter tambalannya adalah `Partial<Pengguna>` — badan fungsinya sudah menyebarnya dengan benar.' },
              ],
              solution:
                'interface Pengguna {\n' +
                '  id: number;\n' +
                '  nama: string;\n' +
                '  surel: string;\n' +
                '  aktif: boolean;\n' +
                '}\n\n' +
                'type Ringkas = Pick<Pengguna, "id" | "nama">;\n\n' +
                'type Baru = Omit<Pengguna, "id">;\n\n' +
                'function perbarui(p: Pengguna, ubahan: Partial<Pengguna>): Pengguna {\n' +
                '  return { ...p, ...ubahan };\n' +
                '}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m3-s2-p1',
        runtime: 'ts',
        title: { en: 'The Settings Panel', id: 'Panel Pengaturan' },
        brief: {
          en: 'One shape, and four functions derived from it. Nothing here restates a property name that is already written down once.',
          id: 'Satu bentuk, dan empat fungsi yang diturunkan darinya. Tak ada di sini yang mengulang nama properti yang sudah tertulis sekali.',
        },
        requirements: [
          { en: '`interface Pengaturan` has `tema` (`"terang" | "gelap"`), `bahasa` (`"id" | "en"`), `notifikasi` (boolean) and `ukuran` (number).', id: '`interface Pengaturan` punya `tema` (`"terang" | "gelap"`), `bahasa` (`"id" | "en"`), `notifikasi` (boolean), dan `ukuran` (number).' },
          { en: '`terapkan(dasar, ubahan)` applies a patch and returns a new object.', id: '`terapkan(dasar, ubahan)` menerapkan tambalan dan mengembalikan objek baru.' },
          { en: '`baca(p, kunci)` returns the value at that key, with the type that key really holds.', id: '`baca(p, kunci)` mengembalikan nilai di kunci itu, dengan tipe yang benar-benar disimpan kunci itu.' },
          { en: '`tampilan(p)` returns only `tema` and `bahasa`, and its return type must be derived, not written out.', id: '`tampilan(p)` mengembalikan hanya `tema` dan `bahasa`, dan tipe kembaliannya harus diturunkan, bukan ditulis ulang.' },
          { en: '`berbeda(a, b)` returns the keys whose values differ, typed as keys of `Pengaturan`.', id: '`berbeda(a, b)` mengembalikan kunci yang nilainya berbeda, bertipe kunci milik `Pengaturan`.' },
        ],
        starter:
          'interface Pengaturan {\n\n}\n\n' +
          'function terapkan(dasar: Pengaturan, ubahan: Pengaturan): Pengaturan {\n\n}\n\n' +
          'function baca(p: Pengaturan, kunci: string): unknown {\n\n}\n\n' +
          'function tampilan(p: Pengaturan): Pengaturan {\n\n}\n\n' +
          'function berbeda(a: Pengaturan, b: Pengaturan): string[] {\n\n}\n',
        tests: [
          {
            name: { en: 'A patch changes only what it names', id: 'Tambalan hanya mengubah yang ia sebut' },
            check:
              'const dasar = { tema: "terang", bahasa: "id", notifikasi: true, ukuran: 14 };\n' +
              'const baru = terapkan(dasar, { tema: "gelap" });\n' +
              'assert(baru.tema === "gelap", "tema harus berubah, sekarang: " + baru.tema);\n' +
              'assert(baru.bahasa === "id" && baru.notifikasi === true && baru.ukuran === 14, "sisanya harus utuh");\n' +
              'assert(dasar.tema === "terang", "yang asli tidak boleh berubah");\n' +
              'assert(terapkan(dasar, {}).ukuran === 14, "tambalan kosong tidak mengubah apa pun");\n' +
              'assert(terapkan(dasar, { notifikasi: false }).notifikasi === false, "false harus benar-benar diterapkan");',
          },
          {
            name: { en: 'Reading gives the stored value', id: 'Membaca memberi nilai yang tersimpan' },
            check:
              'const p = { tema: "gelap", bahasa: "en", notifikasi: false, ukuran: 16 };\n' +
              'assert(baca(p, "tema") === "gelap", "sekarang: " + baca(p, "tema"));\n' +
              'assert(baca(p, "ukuran") === 16, "sekarang: " + baca(p, "ukuran"));\n' +
              'assert(baca(p, "notifikasi") === false, "sekarang: " + baca(p, "notifikasi"));',
          },
          {
            name: { en: 'The display slice has two keys', id: 'Potongan tampilannya punya dua kunci' },
            check:
              'const p = { tema: "gelap", bahasa: "en", notifikasi: false, ukuran: 16 };\n' +
              'const t = tampilan(p);\n' +
              'assert(t.tema === "gelap" && t.bahasa === "en", "sekarang: " + JSON.stringify(t));\n' +
              'assert(Object.keys(t).length === 2, "harus tepat dua kunci, sekarang: " + JSON.stringify(Object.keys(t)));',
          },
          {
            name: { en: 'The difference lists exactly what changed', id: 'Selisihnya mendaftar persis yang berubah' },
            check:
              'const a = { tema: "terang", bahasa: "id", notifikasi: true, ukuran: 14 };\n' +
              'assert(berbeda(a, a).length === 0, "objek yang sama harus tanpa selisih");\n' +
              'const b = { tema: "gelap", bahasa: "id", notifikasi: true, ukuran: 16 };\n' +
              'const d = berbeda(a, b);\n' +
              'assert(d.length === 2 && d.includes("tema") && d.includes("ukuran"), "harus [tema, ukuran], sekarang: " + JSON.stringify(d));',
          },
          {
            name: { en: 'The settings shape is enforced', id: 'Bentuk pengaturannya ditegakkan' },
            probe: 'const uji1: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };',
          },
          {
            name: { en: 'A third theme is refused', id: 'Tema ketiga ditolak' },
            probe: 'const uji2: Pengaturan = { tema: "sepia", bahasa: "en", notifikasi: true, ukuran: 14 };',
            expectError: true,
          },
          {
            name: { en: 'A patch may name one key', id: 'Tambalan boleh menyebut satu kunci' },
            probe: 'const uji3: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };\nterapkan(uji3, { ukuran: 18 });',
          },
          {
            name: { en: 'A patch with an unknown key is refused', id: 'Tambalan dengan kunci asing ditolak' },
            probe: 'const uji4: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };\nterapkan(uji4, { warna: "merah" });',
            expectError: true,
          },
          {
            name: { en: 'baca knows what each key holds', id: 'baca tahu apa isi tiap kuncinya' },
            probe:
              'const uji5: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };\n' +
              'const uji6: number = baca(uji5, "ukuran");\n' +
              'const uji7: boolean = baca(uji5, "notifikasi");',
          },
          {
            name: { en: 'baca does not mix the key types up', id: 'baca tidak mencampuradukkan tipe kuncinya' },
            probe:
              'const uji8: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };\n' +
              'const uji9: number = baca(uji8, "notifikasi");',
            expectError: true,
            errorCode: 2322,
          },
          {
            name: { en: 'A key that does not exist is refused', id: 'Kunci yang tidak ada ditolak' },
            probe:
              'const uji10: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };\n' +
              'baca(uji10, "warna");',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'The differences are real keys', id: 'Selisihnya berupa kunci yang nyata' },
            probe:
              'const uji11: Pengaturan = { tema: "gelap", bahasa: "en", notifikasi: true, ukuran: 14 };\n' +
              'const uji12: (keyof Pengaturan)[] = berbeda(uji11, uji11);\n' +
              'baca(uji11, uji12[0]);',
          },
        ],
        hints: [
          { en: 'Only the interface has to be written out. Every signature below it derives from that one shape.', id: 'Hanya interface-nya yang harus ditulis lengkap. Tiap tanda tangan di bawahnya diturunkan dari satu bentuk itu.' },
          { en: 'The patch is `Partial<Pengaturan>`; the display slice is `Pick<Pengaturan, "tema" | "bahasa">`.', id: 'Tambalannya `Partial<Pengaturan>`; potongan tampilannya `Pick<Pengaturan, "tema" | "bahasa">`.' },
          { en: '`baca` needs its own key parameter: `<K extends keyof Pengaturan>(p: Pengaturan, kunci: K): Pengaturan[K]`.', id: '`baca` butuh parameter kuncinya sendiri: `<K extends keyof Pengaturan>(p: Pengaturan, kunci: K): Pengaturan[K]`.' },
          { en: '`Object.keys` gives `string[]`, so `berbeda` iterates a typed list of keys instead — one test feeds its result straight back into `baca`.', id: '`Object.keys` memberi `string[]`, jadi `berbeda` menelusuri daftar kunci bertipe sebagai gantinya — satu tes mengumpankan hasilnya langsung kembali ke `baca`.' },
        ],
        solution:
          'interface Pengaturan {\n' +
          '  tema: "terang" | "gelap";\n' +
          '  bahasa: "id" | "en";\n' +
          '  notifikasi: boolean;\n' +
          '  ukuran: number;\n' +
          '}\n\n' +
          'const KUNCI: (keyof Pengaturan)[] = ["tema", "bahasa", "notifikasi", "ukuran"];\n\n' +
          'function terapkan(dasar: Pengaturan, ubahan: Partial<Pengaturan>): Pengaturan {\n' +
          '  return { ...dasar, ...ubahan };\n' +
          '}\n\n' +
          'function baca<K extends keyof Pengaturan>(p: Pengaturan, kunci: K): Pengaturan[K] {\n' +
          '  return p[kunci];\n' +
          '}\n\n' +
          'function tampilan(p: Pengaturan): Pick<Pengaturan, "tema" | "bahasa"> {\n' +
          '  return { tema: p.tema, bahasa: p.bahasa };\n' +
          '}\n\n' +
          'function berbeda(a: Pengaturan, b: Pengaturan): (keyof Pengaturan)[] {\n' +
          '  return KUNCI.filter((k) => a[k] !== b[k]);\n' +
          '}',
        xp: 50,
      },
    },
  ],
}
