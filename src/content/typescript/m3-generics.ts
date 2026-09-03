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
              code: {
                en:
                  'function last(list: unknown[]): unknown {\n' +
                  '  return list[list.length - 1];\n' +
                  '}\n\n' +
                  'const t = last(["a", "b"]);\n' +
                  "t.toUpperCase();   // 't' is of type 'unknown'.",
                id:
                  'function terakhir(daftar: unknown[]): unknown {\n' +
                  '  return daftar[daftar.length - 1];\n' +
                  '}\n\n' +
                  'const t = terakhir(["a", "b"]);\n' +
                  "t.toUpperCase();   // 't' is of type 'unknown'.",
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A type parameter carries it through', id: 'Parameter tipe membawanya sampai ujung' },
              body: {
                en: '`<T>` declares a **type parameter** — a type the caller supplies, the way a normal parameter is a value the caller supplies. Say the list is `T[]` and the result is `T`, and now the connection between them is written down. You almost never pass `T` by hand: TypeScript reads it off the argument.',
                id: '`<T>` mendeklarasikan **parameter tipe** — sebuah tipe yang disediakan pemanggil, seperti parameter biasa adalah nilai yang disediakan pemanggil. Nyatakan daftarnya `T[]` dan hasilnya `T`, dan sekarang hubungan di antara keduanya tertulis. Kamu nyaris tak pernah mengoper `T` dengan tangan: TypeScript membacanya dari argumennya.',
              },
              code: {
                en:
                  'function last<T>(list: T[]): T | undefined {\n' +
                  '  return list[list.length - 1];\n' +
                  '}\n\n' +
                  'last(["a", "b"]);   // string | undefined\n' +
                  'last([1, 2, 3]);    // number | undefined',
                id:
                  'function terakhir<T>(daftar: T[]): T | undefined {\n' +
                  '  return daftar[daftar.length - 1];\n' +
                  '}\n\n' +
                  'terakhir(["a", "b"]);   // string | undefined\n' +
                  'terakhir([1, 2, 3]);    // number | undefined',
              },
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
                  'function findById<T extends { id: number }>(list: T[], id: number): T | undefined {\n' +
                  '  return list.find((x) => x.id === id);\n' +
                  '}\n\n' +
                  'const p = findById([{ id: 1, name: "Ani" }], 1);\n' +
                  'p?.name;   // still there: the result is the full type that was passed in',
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
              code: {
                en: 'function first<T>(list: T[]): T | undefined {\n  return list[0];\n}\n\nconst x = first([true, false]);',
                id: 'function pertama<T>(daftar: T[]): T | undefined {\n  return daftar[0];\n}\n\nconst x = pertama([true, false]);',
              },
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
              template: {
                en: 'function reverse___(list: ___[]): ___[] {\n  return [...list].reverse();\n}',
                id: 'function balik___(daftar: ___[]): ___[] {\n  return [...daftar].reverse();\n}',
              },
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
                en: 'Make both functions generic. `last` returns the last item of any list, and `findById` finds an item by `id` in any list of things that have one — both keeping the caller\'s own type.',
                id: 'Buat kedua fungsinya generik. `terakhir` mengembalikan item terakhir dari daftar apa pun, dan `cariId` mencari item berdasarkan `id` di daftar apa pun yang punya `id` — keduanya menjaga tipe milik pemanggilnya.',
              },
              starter: {
                en:
                  'function last(list: unknown[]): unknown {\n' +
                  '  return list[list.length - 1];\n' +
                  '}\n\n' +
                  'function findById(list: { id: number }[], id: number): { id: number } | undefined {\n' +
                  '  return list.find((x) => x.id === id);\n' +
                  '}\n',
                id:
                  'function terakhir(daftar: unknown[]): unknown {\n' +
                  '  return daftar[daftar.length - 1];\n' +
                  '}\n\n' +
                  'function cariId(daftar: { id: number }[], id: number): { id: number } | undefined {\n' +
                  '  return daftar.find((x) => x.id === id);\n' +
                  '}\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'They still do their job', id: 'Keduanya tetap menjalankan tugasnya' },
                    check:
                      'assert(last([1, 2, 3]) === 3, "last([1,2,3]) should be 3, got: " + last([1, 2, 3]));\n' +
                      'assert(last(["a"]) === "a", "last([\\"a\\"]) should be \\"a\\", got: " + last(["a"]));\n' +
                      'assert(last([]) === undefined, "an empty list should be undefined, got: " + last([]));\n' +
                      'assert(findById([{ id: 1 }, { id: 2 }], 2).id === 2, "findById should find id 2");\n' +
                      'assert(findById([{ id: 1 }], 9) === undefined, "an id that is not there should be undefined, got: " + findById([{ id: 1 }], 9));',
                  },
                  {
                    name: { en: 'A list of strings gives back a string', id: 'Daftar string mengembalikan string' },
                    probe: 'const t1: string | undefined = last(["a", "b"]);',
                  },
                  {
                    name: { en: 'It is not secretly returning anything', id: 'Ia tidak diam-diam mengembalikan apa saja' },
                    probe: 'const t2: number | undefined = last(["a", "b"]);',
                    expectError: true,
                    errorCode: 2322,
                  },
                  {
                    name: { en: 'The result may be missing, and the caller is told', id: 'Hasilnya mungkin tidak ada, dan pemanggilnya diberi tahu' },
                    probe: 'const t3: number = last([1, 2]);',
                    expectError: true,
                    errorCode: 2322,
                  },
                  {
                    name: { en: 'findById hands back the whole object', id: 'cariId mengembalikan objek utuhnya' },
                    probe: 'const t4: string | undefined = findById([{ id: 1, name: "Ani" }], 1)?.name;',
                  },
                  {
                    name: { en: 'A list without ids is refused', id: 'Daftar tanpa id ditolak' },
                    probe: 'findById([{ name: "Ani" }], 1);',
                    expectError: true,
                    errorCode: 2353,
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'The starter compiles. What it does not do is remember what it was given.', id: 'Kode awalnya lolos kompilasi. Yang tidak ia lakukan adalah mengingat apa yang tadi diberikan padanya.' },
                { en: 'Declare `<T>` after the function name, before the round brackets.', id: 'Deklarasikan `<T>` setelah nama fungsinya, sebelum kurung bulatnya.' },
                { en: 'findById needs a constraint, because it reads `.id` inside: `<T extends { id: number }>`.', id: 'cariId butuh batasan, karena ia membaca `.id` di dalamnya: `<T extends { id: number }>`.' },
              ],
              solution: {
                en:
                  'function last<T>(list: T[]): T | undefined {\n' +
                  '  return list[list.length - 1];\n' +
                  '}\n\n' +
                  'function findById<T extends { id: number }>(list: T[], id: number): T | undefined {\n' +
                  '  return list.find((x) => x.id === id);\n' +
                  '}',
                id:
                  'function terakhir<T>(daftar: T[]): T | undefined {\n' +
                  '  return daftar[daftar.length - 1];\n' +
                  '}\n\n' +
                  'function cariId<T extends { id: number }>(daftar: T[], id: number): T | undefined {\n' +
                  '  return daftar.find((x) => x.id === id);\n' +
                  '}',
              },
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
              code: {
                en:
                  'type Box<T> = { content: T; created: number };\n\n' +
                  'const a: Box<string> = { content: "hello", created: 1 };\n' +
                  'const b: Box<number[]> = { content: [1, 2], created: 2 };',
                id:
                  'type Kotak<T> = { isi: T; dibuat: number };\n\n' +
                  'const a: Kotak<string> = { isi: "halo", dibuat: 1 };\n' +
                  'const b: Kotak<number[]> = { isi: [1, 2], dibuat: 2 };',
              },
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
                  'type Result<T> =\n' +
                  '  | { ok: true; data: T }\n' +
                  '  | { ok: false; message: string };\n\n' +
                  'const h: Result<number> = { ok: true, data: 7 };\n\n' +
                  "h.data;            // Property 'data' does not exist on type 'Result<number>'.\n" +
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
                  'const stock: Record<string, number> = { pencil: 40, marker: 0 };\n' +
                  'stock.pencil.toFixed(0);   // safe: the value is a number\n\n' +
                  'type Size = "small" | "large";\n' +
                  'const cost: Record<Size, number> = { small: 0, large: 10000 };\n' +
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
              code: {
                en: 'type Result<T> = { ok: true; data: T } | { ok: false; message: string };\n\nfunction f(h: Result<string>) {\n  return h.data;\n}',
                id: 'type Hasil<T> = { ok: true; data: T } | { ok: false; pesan: string };\n\nfunction f(h: Hasil<string>) {\n  return h.data;\n}',
              },
              options: [
                { en: 'The failure member has no `data`, and it has not been ruled out', id: 'Anggota gagalnya tak punya `data`, dan ia belum disingkirkan' },
                { en: '`data` is private', id: '`data` bersifat privat' },
                { en: 'Generic types cannot be read', id: 'Tipe generik tidak bisa dibaca' },
                { en: 'You must write `Result<any>`', id: 'Kamu harus menulis `Hasil<any>`' },
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
                en: 'Declare `type Result<T>` as a tagged union of `{ ok: true; data: T }` and `{ ok: false; message: string }`, then write `succeed`, `fail`, and `getData(h, fallback)` which returns the data or the fallback.',
                id: 'Deklarasikan `type Hasil<T>` sebagai union bertanda berisi `{ ok: true; data: T }` dan `{ ok: false; pesan: string }`, lalu tulis `berhasil`, `gagal`, dan `ambilData(h, cadangan)` yang mengembalikan datanya atau nilai cadangannya.',
              },
              starter: {
                en:
                  'type Result<T> = { ok: boolean; data?: T; message?: string };\n\n' +
                  'function succeed<T>(data: T): Result<T> {\n  return { ok: true, data };\n}\n\n' +
                  'function fail<T>(message: string): Result<T> {\n  return { ok: false, message };\n}\n\n' +
                  'function getData<T>(h: Result<T>, fallback: T): T {\n  return fallback;\n}\n',
                id:
                  'type Hasil<T> = { ok: boolean; data?: T; pesan?: string };\n\n' +
                  'function berhasil<T>(data: T): Hasil<T> {\n  return { ok: true, data };\n}\n\n' +
                  'function gagal<T>(pesan: string): Hasil<T> {\n  return { ok: false, pesan };\n}\n\n' +
                  'function ambilData<T>(h: Hasil<T>, cadangan: T): T {\n  return cadangan;\n}\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'The three functions behave', id: 'Ketiga fungsinya berperilaku benar' },
                    check:
                      'const a = succeed(7);\n' +
                      'assert(a.ok === true && a.data === 7, "succeed(7) should be { ok: true, data: 7 }");\n' +
                      'const b = fail("broken");\n' +
                      'assert(b.ok === false && b.message === "broken", "fail should carry its message");\n' +
                      'assert(getData(succeed(7), 0) === 7, "should get the data, got: " + getData(succeed(7), 0));\n' +
                      'assert(getData(fail("x"), 0) === 0, "should use the fallback, got: " + getData(fail("x"), 0));',
                  },
                  {
                    name: { en: 'A success carries its own type', id: 'Keberhasilan membawa tipenya sendiri' },
                    probe: 'const t1: Result<string> = succeed("a");',
                  },
                  {
                    name: { en: 'A number is not a Result<string>', id: 'Angka bukan sebuah Hasil<string>' },
                    probe: 'const t2: Result<string> = succeed(1);',
                    expectError: true,
                  },
                  {
                    name: { en: 'data cannot be read before ok is checked', id: 'data tak bisa dibaca sebelum ok diperiksa' },
                    probe: 'const t3 = succeed("a");\nconst t4: string = t3.data;',
                    expectError: true,
                    errorCode: 2339,
                  },
                  {
                    name: { en: 'After the check it can', id: 'Setelah diperiksa, ia bisa' },
                    probe: 'const t5 = succeed("a");\nif (t5.ok) {\n  const t6: string = t5.data;\n}',
                  },
                  {
                    name: { en: 'A failure has no data at all', id: 'Kegagalan sama sekali tak punya data' },
                    probe: 'const t7: Result<string> = { ok: false, message: "x", data: "a" };',
                    expectError: true,
                  },
                  {
                    name: { en: 'The fallback must match the payload', id: 'Cadangannya harus sejenis dengan muatannya' },
                    probe: 'getData(succeed("a"), 0);',
                    expectError: true,
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'The starter makes both fields optional, so nothing about it can be checked. Split it into two members.', id: 'Kode awalnya membuat kedua field-nya opsional, jadi tak ada yang bisa diperiksa. Pecah jadi dua anggota.' },
                { en: 'The tag here is `ok`, and its two literal types are `true` and `false`.', id: 'Penandanya di sini `ok`, dan dua tipe literalnya `true` dan `false`.' },
                { en: '`getData` narrows on `h.ok` and returns `h.data`, or the fallback.', id: '`ambilData` mempersempit pada `h.ok` lalu mengembalikan `h.data`, atau cadangannya.' },
              ],
              solution: {
                en:
                  'type Result<T> =\n' +
                  '  | { ok: true; data: T }\n' +
                  '  | { ok: false; message: string };\n\n' +
                  'function succeed<T>(data: T): Result<T> {\n' +
                  '  return { ok: true, data };\n' +
                  '}\n\n' +
                  'function fail<T>(message: string): Result<T> {\n' +
                  '  return { ok: false, message };\n' +
                  '}\n\n' +
                  'function getData<T>(h: Result<T>, fallback: T): T {\n' +
                  '  return h.ok ? h.data : fallback;\n' +
                  '}',
                id:
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
          { en: '`type Dict<T>` is a `Record` from string keys to values of type T.', id: '`type Kamus<T>` adalah `Record` dari kunci string ke nilai bertipe T.' },
          { en: '`set(k, key, value)` returns a **new** dictionary with that key set. The original is untouched.', id: '`simpan(k, kunci, nilai)` mengembalikan kamus **baru** dengan kunci itu terisi. Yang aslinya tak tersentuh.' },
          { en: '`get(k, key, fallback)` returns the value, or the fallback when the key is absent.', id: '`ambil(k, kunci, cadangan)` mengembalikan nilainya, atau cadangannya ketika kuncinya tidak ada.' },
          { en: '`keysOf(k)` returns the keys as `string[]`.', id: '`kunciDari(k)` mengembalikan kuncinya sebagai `string[]`.' },
          { en: '`mapValues(k, transform)` runs a function over every value and returns a dictionary of whatever that function returns — a **different** value type is allowed.', id: '`petakan(k, ubah)` menjalankan sebuah fungsi pada tiap nilainya dan mengembalikan kamus berisi apa pun yang dikembalikan fungsi itu — tipe nilai yang **berbeda** diperbolehkan.' },
        ],
        starter: {
          en:
            'type Dict<T> = Record<string, unknown>;\n\n' +
            'function set<T>(k: Dict<T>, key: string, value: T): Dict<T> {\n\n}\n\n' +
            'function get<T>(k: Dict<T>, key: string, fallback: T): T {\n\n}\n\n' +
            'function keysOf<T>(k: Dict<T>): string[] {\n\n}\n\n' +
            'function mapValues<T>(k: Dict<T>, transform: (value: T) => T): Dict<T> {\n\n}\n',
          id:
            'type Kamus<T> = Record<string, unknown>;\n\n' +
            'function simpan<T>(k: Kamus<T>, kunci: string, nilai: T): Kamus<T> {\n\n}\n\n' +
            'function ambil<T>(k: Kamus<T>, kunci: string, cadangan: T): T {\n\n}\n\n' +
            'function kunciDari<T>(k: Kamus<T>): string[] {\n\n}\n\n' +
            'function petakan<T>(k: Kamus<T>, ubah: (nilai: T) => T): Kamus<T> {\n\n}\n',
        },
        tests: {
          en: [
            {
              name: { en: 'Storing does not touch the original', id: 'Menyimpan tidak menyentuh yang asli' },
              check:
                'const initial = { pencil: 40 };\n' +
                'const updated = set(initial, "marker", 5);\n' +
                'assert(updated.marker === 5 && updated.pencil === 40, "the new dictionary should have both");\n' +
                'assert(initial.marker === undefined, "the original dictionary must not change");\n' +
                'const replaced = set(initial, "pencil", 1);\n' +
                'assert(replaced.pencil === 1 && initial.pencil === 40, "overwriting a key must also copy");',
            },
            {
              name: { en: 'Reading falls back when the key is absent', id: 'Membaca memakai cadangan ketika kuncinya tidak ada' },
              check:
                'const stock = { pencil: 40 };\n' +
                'assert(get(stock, "pencil", 0) === 40, "got: " + get(stock, "pencil", 0));\n' +
                'assert(get(stock, "marker", 0) === 0, "a missing key should use the fallback, got: " + get(stock, "marker", 0));\n' +
                'assert(get({ zero: 0 }, "zero", 99) === 0, "a value of 0 is not absence, got: " + get({ zero: 0 }, "zero", 99));',
            },
            {
              name: { en: 'The keys come back', id: 'Kuncinya kembali' },
              check:
                'const k = keysOf({ a: 1, b: 2 });\n' +
                'assert(k.length === 2 && k.includes("a") && k.includes("b"), "should be [a, b], got: " + JSON.stringify(k));\n' +
                'assert(keysOf({}).length === 0, "an empty dictionary should have no keys");',
            },
            {
              name: { en: 'Mapping visits every value', id: 'Pemetaan mengunjungi tiap nilai' },
              check:
                'const doubled = mapValues({ a: 1, b: 2 }, (n) => n * 2);\n' +
                'assert(doubled.a === 2 && doubled.b === 4, "got: " + JSON.stringify(doubled));\n' +
                'const tagged = mapValues({ a: 1 }, (n) => "#" + n);\n' +
                'assert(tagged.a === "#1", "should be able to change type, got: " + JSON.stringify(tagged));',
            },
            {
              name: { en: 'A dictionary of numbers holds numbers', id: 'Kamus angka berisi angka' },
              probe: 'const t1: Dict<number> = { a: 1 };\nconst t2: number = get(t1, "a", 0);',
            },
            {
              name: { en: 'A string is not a number', id: 'String bukan angka' },
              probe: 'const t3: Dict<number> = { a: "one" };',
              expectError: true,
            },
            {
              name: { en: 'The stored value must match the dictionary', id: 'Nilai yang disimpan harus sejenis dengan kamusnya' },
              probe: 'const t4: Dict<number> = { a: 1 };\nset(t4, "b", "two");',
              expectError: true,
              errorCode: 2345,
            },
            {
              name: { en: 'The fallback must match too', id: 'Cadangannya juga harus sejenis' },
              probe: 'const t5: Dict<number> = { a: 1 };\nget(t5, "a", "zero");',
              expectError: true,
              errorCode: 2345,
            },
            {
              name: { en: 'Mapping may change the value type', id: 'Pemetaan boleh mengubah tipe nilainya' },
              probe: 'const t6: Dict<number> = { a: 1 };\nconst t7: Dict<string> = mapValues(t6, (n) => `#${n}`);',
            },
            {
              name: { en: 'The mapped type is tracked, not guessed', id: 'Tipe hasil pemetaannya dilacak, bukan ditebak' },
              probe: 'const t8: Dict<number> = { a: 1 };\nconst t9: Dict<number> = mapValues(t8, (n) => `#${n}`);',
              expectError: true,
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'The starter declares `Dict<T>` without ever using T — that is why nothing is checked. Fix that line first.', id: 'Kode awalnya mendeklarasikan `Kamus<T>` tanpa pernah memakai T — itulah sebabnya tak ada yang diperiksa. Betulkan baris itu lebih dulu.' },
          { en: 'A new object with one key changed is `{ ...k, [key]: value }`.', id: 'Objek baru dengan satu kunci berubah adalah `{ ...k, [kunci]: nilai }`.' },
          { en: '"Absent" is not the same as falsy: use `key in k`, or `??`, not `||`.', id: '"Tidak ada" tidak sama dengan falsy: pakai `kunci in k`, atau `??`, jangan `||`.' },
          { en: '`mapValues` needs a second type parameter for what comes out: `<T, U>(k: Dict<T>, transform: (value: T) => U): Dict<U>`.', id: '`petakan` butuh parameter tipe kedua untuk yang keluar: `<T, U>(k: Kamus<T>, ubah: (nilai: T) => U): Kamus<U>`.' },
        ],
        solution: {
          en:
            'type Dict<T> = Record<string, T>;\n\n' +
            'function set<T>(k: Dict<T>, key: string, value: T): Dict<T> {\n' +
            '  return { ...k, [key]: value };\n' +
            '}\n\n' +
            'function get<T>(k: Dict<T>, key: string, fallback: T): T {\n' +
            '  return key in k ? k[key] : fallback;\n' +
            '}\n\n' +
            'function keysOf<T>(k: Dict<T>): string[] {\n' +
            '  return Object.keys(k);\n' +
            '}\n\n' +
            'function mapValues<T, U>(k: Dict<T>, transform: (value: T) => U): Dict<U> {\n' +
            '  const result: Dict<U> = {};\n' +
            '  for (const key of Object.keys(k)) {\n' +
            '    result[key] = transform(k[key]);\n' +
            '  }\n' +
            '  return result;\n' +
            '}',
          id:
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
        },
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
                en: 'For `{ name: string; age: number }`, `keyof` that type is `"name" | "age"` — a literal union, worked out from the shape rather than typed out again. Rename a property and the union follows; nothing gets left behind.',
                id: 'Untuk `{ nama: string; umur: number }`, `keyof` dari tipe itu adalah `"nama" | "umur"` — union literal, dihitung dari bentuknya alih-alih diketik ulang. Ganti nama sebuah properti dan union-nya ikut; tak ada yang tertinggal.',
              },
              code: {
                en:
                  'interface Person { name: string; age: number }\n\n' +
                  'type Key = keyof Person;   // "name" | "age"\n' +
                  'const k: Key = "age";      // fine\n' +
                  'const j: Key = "address";  // rejected',
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
                en: 'Indexing works on types the way it works on values. `Person["name"]` is `string`. Combine that with a constrained parameter and you get a getter whose return type depends on which key you asked for — different for every call, and correct every time.',
                id: 'Pengindeksan bekerja pada tipe seperti ia bekerja pada nilai. `Orang["nama"]` adalah `string`. Gabungkan itu dengan parameter yang dibatasi dan kamu mendapat pengambil nilai yang tipe kembaliannya bergantung pada kunci yang kamu minta — berbeda di tiap pemanggilan, dan benar setiap kali.',
              },
              code: {
                en:
                  'function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n' +
                  '  return obj[key];\n' +
                  '}\n\n' +
                  'const o = { name: "Ani", age: 17 };\n' +
                  'get(o, "name");   // string\n' +
                  'get(o, "age");    // number\n' +
                  'get(o, "city");   // rejected: not a key of o',
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
                en: 'The same function written with `key: string` compiles, and gives back a value the caller has to guess about. The `keyof` version rejects a mistyped key at the call site *and* tells the caller exactly what came back. Two problems, one signature.',
                id: 'Fungsi yang sama ditulis dengan `kunci: string` juga lolos kompilasi, dan mengembalikan nilai yang harus ditebak-tebak pemanggilnya. Versi `keyof` menolak kunci yang salah ketik tepat di tempat pemanggilannya *sekaligus* memberi tahu pemanggilnya persis apa yang kembali. Dua masalah, satu tanda tangan.',
              },
              code: {
                en:
                  '// loses two things at once\nfunction weakGet(obj: Record<string, unknown>, key: string): unknown {\n' +
                  '  return obj[key];\n' +
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
                en: 'With `get<T, K extends keyof T>(obj: T, key: K): T[K]`, what is the type of `x`?',
                id: 'Dengan `ambil<T, K extends keyof T>(obj: T, kunci: K): T[K]`, apa tipe `x`?',
              },
              code: {
                en: 'const p = { title: "Bumi Manusia", year: 1980 };\nconst x = get(p, "year");',
                id: 'const p = { judul: "Bumi Manusia", tahun: 1980 };\nconst x = ambil(p, "tahun");',
              },
              options: [
                { en: '`number`', id: '`number`' },
                { en: '`string | number`', id: '`string | number`' },
                { en: '`unknown`', id: '`unknown`' },
                { en: '`"year"`', id: '`"tahun"`' },
              ],
              answer: 0,
              explain: {
                en: 'K was inferred as the literal `"year"`, so `T[K]` is the type at exactly that key.',
                id: 'K disimpulkan sebagai literal `"tahun"`, jadi `T[K]` adalah tipe pada persis kunci itu.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Rewrite `get` so it accepts only real keys of the object and returns the type stored at that key. Then write `getMany`, taking a list of keys and returning a list of their values.',
                id: 'Tulis ulang `ambil` agar ia hanya menerima kunci yang benar-benar dimiliki objeknya dan mengembalikan tipe yang tersimpan di kunci itu. Lalu tulis `ambilBanyak`, yang menerima daftar kunci dan mengembalikan daftar nilainya.',
              },
              starter: {
                en:
                  'function get(obj: Record<string, unknown>, key: string): unknown {\n' +
                  '  return obj[key];\n' +
                  '}\n\n' +
                  'function getMany(obj: Record<string, unknown>, key: string[]): unknown[] {\n' +
                  '  return key.map((k) => obj[k]);\n' +
                  '}\n',
                id:
                  'function ambil(obj: Record<string, unknown>, kunci: string): unknown {\n' +
                  '  return obj[kunci];\n' +
                  '}\n\n' +
                  'function ambilBanyak(obj: Record<string, unknown>, kunci: string[]): unknown[] {\n' +
                  '  return kunci.map((k) => obj[k]);\n' +
                  '}\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'Both still read the object', id: 'Keduanya tetap membaca objeknya' },
                    check:
                      'const p = { title: "Bumi Manusia", year: 1980 };\n' +
                      'assert(get(p, "title") === "Bumi Manusia", "got: " + get(p, "title"));\n' +
                      'assert(get(p, "year") === 1980, "got: " + get(p, "year"));\n' +
                      'const both = getMany(p, ["title", "year"]);\n' +
                      'assert(both.length === 2 && both[0] === "Bumi Manusia" && both[1] === 1980, "got: " + JSON.stringify(both));\n' +
                      'assert(getMany(p, []).length === 0, "an empty key list should give an empty list");',
                  },
                  {
                    name: { en: 'A string key gives back a string', id: 'Kunci berisi string mengembalikan string' },
                    probe: 'const t1: string = get({ title: "a", year: 1 }, "title");',
                  },
                  {
                    name: { en: 'A number key gives back a number', id: 'Kunci berisi angka mengembalikan angka' },
                    probe: 'const t2: number = get({ title: "a", year: 1 }, "year");',
                  },
                  {
                    name: { en: 'It does not mix the two up', id: 'Ia tidak mencampuradukkan keduanya' },
                    probe: 'const t3: number = get({ title: "a", year: 1 }, "title");',
                    expectError: true,
                    errorCode: 2322,
                  },
                  {
                    name: { en: 'A key that is not there is refused', id: 'Kunci yang tidak ada ditolak' },
                    probe: 'get({ title: "a", year: 1 }, "author");',
                    expectError: true,
                    errorCode: 2345,
                  },
                  {
                    name: { en: 'getMany keeps the value type too', id: 'ambilBanyak juga menjaga tipe nilainya' },
                    probe: 'const t4: string[] = getMany({ title: "a", sub: "b" }, ["title", "sub"]);',
                  },
                  {
                    name: { en: 'A bad key in the list is refused', id: 'Kunci yang salah di dalam daftar ditolak' },
                    probe: 'getMany({ title: "a", year: 1 }, ["title", "author"]);',
                    expectError: true,
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'Two type parameters: one for the object, one for the key.', id: 'Dua parameter tipe: satu untuk objeknya, satu untuk kuncinya.' },
                { en: 'The key parameter is constrained: `K extends keyof T`.', id: 'Parameter kuncinya dibatasi: `K extends keyof T`.' },
                { en: 'The return type is written `T[K]` — and for the list version, `T[K][]`.', id: 'Tipe kembaliannya ditulis `T[K]` — dan untuk versi daftarnya, `T[K][]`.' },
              ],
              solution: {
                en:
                  'function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n' +
                  '  return obj[key];\n' +
                  '}\n\n' +
                  'function getMany<T, K extends keyof T>(obj: T, key: K[]): T[K][] {\n' +
                  '  return key.map((k) => obj[k]);\n' +
                  '}',
                id:
                  'function ambil<T, K extends keyof T>(obj: T, kunci: K): T[K] {\n' +
                  '  return obj[kunci];\n' +
                  '}\n\n' +
                  'function ambilBanyak<T, K extends keyof T>(obj: T, kunci: K[]): T[K][] {\n' +
                  '  return kunci.map((k) => obj[k]);\n' +
                  '}',
              },
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
                  'interface User { id: number; name: string; active: boolean }\n\n' +
                  'function update(p: User, patch: Partial<User>): User {\n' +
                  '  return { ...p, ...patch };\n' +
                  '}\n\n' +
                  'update(p, { name: "Ani" });   // fine\n' +
                  'update(p, { name: 1 });        // rejected: still has to be a string',
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
              code: {
                en:
                  'type Summary = Pick<User, "id" | "name">;\n' +
                  '// { id: number; name: string }\n\n' +
                  'type New = Omit<User, "id">;\n' +
                  '// { name: string; active: boolean }',
                id:
                  'type Ringkas = Pick<Pengguna, "id" | "nama">;\n' +
                  '// { id: number; nama: string }\n\n' +
                  'type Baru = Omit<Pengguna, "id">;\n' +
                  '// { nama: string; aktif: boolean }',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Derived beats duplicated', id: 'Diturunkan mengalahkan disalin' },
              body: {
                en: 'You could write `Summary` out by hand. It would be the same today and wrong in a month, the first time somebody renames a property in `User` and does not think to look here. Deriving it means the compiler does the looking.',
                id: 'Kamu bisa saja menulis `Ringkas` dengan tangan. Ia akan sama hari ini dan salah sebulan lagi, pertama kali seseorang mengganti nama properti di `Pengguna` dan tak terpikir untuk melihat ke sini. Menurunkannya berarti kompilernya yang melihat.',
              },
              code: {
                en:
                  '// fragile\ntype Summary = { id: number; name: string };\n\n' +
                  '// follows automatically\ntype Summary = Pick<User, "id" | "name">;',
                id:
                  '// rapuh\ntype Ringkas = { id: number; nama: string };\n\n' +
                  '// mengikuti dengan sendirinya\ntype Ringkas = Pick<Pengguna, "id" | "nama">;',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does `Omit<User, "id">` allow?',
                id: 'Apa yang diizinkan `Omit<Pengguna, "id">`?',
              },
              code: {
                en: 'interface User { id: number; name: string; active: boolean }',
                id: 'interface Pengguna { id: number; nama: string; aktif: boolean }',
              },
              options: [
                { en: 'An object with `name` and `active`, and no `id`', id: 'Objek dengan `nama` dan `aktif`, tanpa `id`' },
                { en: 'An object with only `id`', id: 'Objek yang hanya punya `id`' },
                { en: 'An object where `id` is optional', id: 'Objek yang `id`-nya opsional' },
                { en: 'Any object at all', id: 'Objek apa pun' },
              ],
              answer: 0,
              explain: {
                en: 'Omit removes the property entirely. Making it optional would be `Partial<Pick<User, "id">>` joined back on — a different thing.',
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
              template: {
                en: 'function change(p: User, u: ___<User>): User;\ntype Card = ___<User, "id" | "name">;',
                id: 'function ubah(p: Pengguna, u: ___<Pengguna>): Pengguna;\ntype Kartu = ___<Pengguna, "id" | "nama">;',
              },
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
                en: 'Declare `interface User` with `id` (number), `name` (string), `email` (string) and `active` (boolean). Derive `type Summary` (only id and name) and `type New` (everything except id), then write `update(p, patch)` taking a patch.',
                id: 'Deklarasikan `interface Pengguna` dengan `id` (number), `nama` (string), `surel` (string), dan `aktif` (boolean). Turunkan `type Ringkas` (hanya id dan nama) dan `type Baru` (semuanya kecuali id), lalu tulis `perbarui(p, ubahan)` yang menerima tambalan.',
              },
              starter: {
                en:
                  'interface User {\n\n}\n\n' +
                  'type Summary = User;\n\n' +
                  'type New = User;\n\n' +
                  'function update(p: User, patch: User): User {\n' +
                  '  return { ...p, ...patch };\n' +
                  '}\n',
                id:
                  'interface Pengguna {\n\n}\n\n' +
                  'type Ringkas = Pengguna;\n\n' +
                  'type Baru = Pengguna;\n\n' +
                  'function perbarui(p: Pengguna, ubahan: Pengguna): Pengguna {\n' +
                  '  return { ...p, ...ubahan };\n' +
                  '}\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'A patch overwrites only what it names', id: 'Tambalan hanya menimpa yang ia sebut' },
                    check:
                      'const p = { id: 1, name: "Ani", email: "a@b.c", active: true };\n' +
                      'const q = update(p, { name: "Budi" });\n' +
                      'assert(q.name === "Budi", "name should change, got: " + q.name);\n' +
                      'assert(q.email === "a@b.c" && q.active === true && q.id === 1, "the rest should stay intact");\n' +
                      'assert(p.name === "Ani", "the original must not change, got: " + p.name);\n' +
                      'assert(update(p, {}).name === "Ani", "an empty patch changes nothing");',
                  },
                  {
                    name: { en: 'A full user is accepted', id: 'Pengguna lengkap diterima' },
                    probe: 'const t1: User = { id: 1, name: "a", email: "b", active: true };',
                  },
                  {
                    name: { en: 'Summary holds only the two', id: 'Ringkas hanya memuat yang dua' },
                    probe: 'const t2: Summary = { id: 1, name: "a" };',
                  },
                  {
                    name: { en: 'Summary refuses the rest', id: 'Ringkas menolak sisanya' },
                    probe: 'const t3: Summary = { id: 1, name: "a", email: "b" };',
                    expectError: true,
                    errorCode: 2353,
                  },
                  {
                    name: { en: 'New has everything but the id', id: 'Baru punya semuanya kecuali id' },
                    probe: 'const t4: New = { name: "a", email: "b", active: true };',
                  },
                  {
                    name: { en: 'New refuses an id', id: 'Baru menolak id' },
                    probe: 'const t5: New = { id: 1, name: "a", email: "b", active: true };',
                    expectError: true,
                    errorCode: 2353,
                  },
                  {
                    name: { en: 'A patch may name one field', id: 'Tambalan boleh menyebut satu field' },
                    probe: 'const t6: User = { id: 1, name: "a", email: "b", active: true };\nupdate(t6, { active: false });',
                  },
                  {
                    name: { en: 'A patch still has to be the right type', id: 'Tambalannya tetap harus bertipe benar' },
                    probe: 'const t7: User = { id: 1, name: "a", email: "b", active: true };\nupdate(t7, { name: 1 });',
                    expectError: true,
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'Write the interface first; the three lines below all derive from it.', id: 'Tulis interface-nya lebih dulu; tiga baris di bawahnya semua diturunkan darinya.' },
                { en: 'Pick and Omit both take the keys as a union of string literals.', id: 'Pick dan Omit sama-sama menerima kuncinya sebagai union literal string.' },
                { en: 'The patch parameter is `Partial<User>` — the body already spreads it correctly.', id: 'Parameter tambalannya adalah `Partial<Pengguna>` — badan fungsinya sudah menyebarnya dengan benar.' },
              ],
              solution: {
                en:
                  'interface User {\n' +
                  '  id: number;\n' +
                  '  name: string;\n' +
                  '  email: string;\n' +
                  '  active: boolean;\n' +
                  '}\n\n' +
                  'type Summary = Pick<User, "id" | "name">;\n\n' +
                  'type New = Omit<User, "id">;\n\n' +
                  'function update(p: User, patch: Partial<User>): User {\n' +
                  '  return { ...p, ...patch };\n' +
                  '}',
                id:
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
          { en: '`interface Settings` has `theme` (`"light" | "dark"`), `language` (`"id" | "en"`), `notifications` (boolean) and `size` (number).', id: '`interface Pengaturan` punya `tema` (`"terang" | "gelap"`), `bahasa` (`"id" | "en"`), `notifikasi` (boolean), dan `ukuran` (number).' },
          { en: '`apply(base, patch)` applies a patch and returns a new object.', id: '`terapkan(dasar, ubahan)` menerapkan tambalan dan mengembalikan objek baru.' },
          { en: '`read(p, key)` returns the value at that key, with the type that key really holds.', id: '`baca(p, kunci)` mengembalikan nilai di kunci itu, dengan tipe yang benar-benar disimpan kunci itu.' },
          { en: '`display(p)` returns only `theme` and `language`, and its return type must be derived, not written out.', id: '`tampilan(p)` mengembalikan hanya `tema` dan `bahasa`, dan tipe kembaliannya harus diturunkan, bukan ditulis ulang.' },
          { en: '`diff(a, b)` returns the keys whose values differ, typed as keys of `Settings`.', id: '`berbeda(a, b)` mengembalikan kunci yang nilainya berbeda, bertipe kunci milik `Pengaturan`.' },
        ],
        starter: {
          en:
            'interface Settings {\n\n}\n\n' +
            'function apply(base: Settings, patch: Settings): Settings {\n\n}\n\n' +
            'function read(p: Settings, key: string): unknown {\n\n}\n\n' +
            'function display(p: Settings): Settings {\n\n}\n\n' +
            'function diff(a: Settings, b: Settings): string[] {\n\n}\n',
          id:
            'interface Pengaturan {\n\n}\n\n' +
            'function terapkan(dasar: Pengaturan, ubahan: Pengaturan): Pengaturan {\n\n}\n\n' +
            'function baca(p: Pengaturan, kunci: string): unknown {\n\n}\n\n' +
            'function tampilan(p: Pengaturan): Pengaturan {\n\n}\n\n' +
            'function berbeda(a: Pengaturan, b: Pengaturan): string[] {\n\n}\n',
        },
        tests: {
          en: [
            {
              name: { en: 'A patch changes only what it names', id: 'Tambalan hanya mengubah yang ia sebut' },
              check:
                'const base = { theme: "light", language: "id", notifications: true, size: 14 };\n' +
                'const updated = apply(base, { theme: "dark" });\n' +
                'assert(updated.theme === "dark", "theme should change, got: " + updated.theme);\n' +
                'assert(updated.language === "id" && updated.notifications === true && updated.size === 14, "the rest should stay intact");\n' +
                'assert(base.theme === "light", "the original must not change");\n' +
                'assert(apply(base, {}).size === 14, "an empty patch changes nothing");\n' +
                'assert(apply(base, { notifications: false }).notifications === false, "false must actually be applied");',
            },
            {
              name: { en: 'Reading gives the stored value', id: 'Membaca memberi nilai yang tersimpan' },
              check:
                'const p = { theme: "dark", language: "en", notifications: false, size: 16 };\n' +
                'assert(read(p, "theme") === "dark", "got: " + read(p, "theme"));\n' +
                'assert(read(p, "size") === 16, "got: " + read(p, "size"));\n' +
                'assert(read(p, "notifications") === false, "got: " + read(p, "notifications"));',
            },
            {
              name: { en: 'The display slice has two keys', id: 'Potongan tampilannya punya dua kunci' },
              check:
                'const p = { theme: "dark", language: "en", notifications: false, size: 16 };\n' +
                'const t = display(p);\n' +
                'assert(t.theme === "dark" && t.language === "en", "got: " + JSON.stringify(t));\n' +
                'assert(Object.keys(t).length === 2, "should be exactly two keys, got: " + JSON.stringify(Object.keys(t)));',
            },
            {
              name: { en: 'The difference lists exactly what changed', id: 'Selisihnya mendaftar persis yang berubah' },
              check:
                'const a = { theme: "light", language: "id", notifications: true, size: 14 };\n' +
                'assert(diff(a, a).length === 0, "the same object should have no difference");\n' +
                'const b = { theme: "dark", language: "id", notifications: true, size: 16 };\n' +
                'const d = diff(a, b);\n' +
                'assert(d.length === 2 && d.includes("theme") && d.includes("size"), "should be [theme, size], got: " + JSON.stringify(d));',
            },
            {
              name: { en: 'The settings shape is enforced', id: 'Bentuk pengaturannya ditegakkan' },
              probe: 'const t1: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };',
            },
            {
              name: { en: 'A third theme is refused', id: 'Tema ketiga ditolak' },
              probe: 'const t2: Settings = { theme: "sepia", language: "en", notifications: true, size: 14 };',
              expectError: true,
            },
            {
              name: { en: 'A patch may name one key', id: 'Tambalan boleh menyebut satu kunci' },
              probe: 'const t3: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };\napply(t3, { size: 18 });',
            },
            {
              name: { en: 'A patch with an unknown key is refused', id: 'Tambalan dengan kunci asing ditolak' },
              probe: 'const t4: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };\napply(t4, { color: "red" });',
              expectError: true,
            },
            {
              name: { en: 'read knows what each key holds', id: 'baca tahu apa isi tiap kuncinya' },
              probe:
                'const t5: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };\n' +
                'const t6: number = read(t5, "size");\n' +
                'const t7: boolean = read(t5, "notifications");',
            },
            {
              name: { en: 'read does not mix the key types up', id: 'baca tidak mencampuradukkan tipe kuncinya' },
              probe:
                'const t8: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };\n' +
                'const t9: number = read(t8, "notifications");',
              expectError: true,
              errorCode: 2322,
            },
            {
              name: { en: 'A key that does not exist is refused', id: 'Kunci yang tidak ada ditolak' },
              probe:
                'const t10: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };\n' +
                'read(t10, "color");',
              expectError: true,
              errorCode: 2345,
            },
            {
              name: { en: 'The differences are real keys', id: 'Selisihnya berupa kunci yang nyata' },
              probe:
                'const t11: Settings = { theme: "dark", language: "en", notifications: true, size: 14 };\n' +
                'const t12: (keyof Settings)[] = diff(t11, t11);\n' +
                'read(t11, t12[0]);',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'Only the interface has to be written out. Every signature below it derives from that one shape.', id: 'Hanya interface-nya yang harus ditulis lengkap. Tiap tanda tangan di bawahnya diturunkan dari satu bentuk itu.' },
          { en: 'The patch is `Partial<Settings>`; the display slice is `Pick<Settings, "theme" | "language">`.', id: 'Tambalannya `Partial<Pengaturan>`; potongan tampilannya `Pick<Pengaturan, "tema" | "bahasa">`.' },
          { en: '`read` needs its own key parameter: `<K extends keyof Settings>(p: Settings, key: K): Settings[K]`.', id: '`baca` butuh parameter kuncinya sendiri: `<K extends keyof Pengaturan>(p: Pengaturan, kunci: K): Pengaturan[K]`.' },
          { en: '`Object.keys` gives `string[]`, so `diff` iterates a typed list of keys instead — one test feeds its result straight back into `read`.', id: '`Object.keys` memberi `string[]`, jadi `berbeda` menelusuri daftar kunci bertipe sebagai gantinya — satu tes mengumpankan hasilnya langsung kembali ke `baca`.' },
        ],
        solution: {
          en:
            'interface Settings {\n' +
            '  theme: "light" | "dark";\n' +
            '  language: "id" | "en";\n' +
            '  notifications: boolean;\n' +
            '  size: number;\n' +
            '}\n\n' +
            'const KEYS: (keyof Settings)[] = ["theme", "language", "notifications", "size"];\n\n' +
            'function apply(base: Settings, patch: Partial<Settings>): Settings {\n' +
            '  return { ...base, ...patch };\n' +
            '}\n\n' +
            'function read<K extends keyof Settings>(p: Settings, key: K): Settings[K] {\n' +
            '  return p[key];\n' +
            '}\n\n' +
            'function display(p: Settings): Pick<Settings, "theme" | "language"> {\n' +
            '  return { theme: p.theme, language: p.language };\n' +
            '}\n\n' +
            'function diff(a: Settings, b: Settings): (keyof Settings)[] {\n' +
            '  return KEYS.filter((k) => a[k] !== b[k]);\n' +
            '}',
          id:
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
        },
        xp: 50,
      },
    },
  ],
}
