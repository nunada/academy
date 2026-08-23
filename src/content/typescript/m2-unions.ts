import type { Module } from '../types'

/** Module 2 — a value that is one of several things, and the checks that tell
 *  the compiler which one you are holding. */

export const module2: Module = {
  id: 'ts-m2',
  title: { en: 'One of Several', id: 'Salah Satu dari Beberapa' },
  summary: {
    en: 'Unions say what a value may be; narrowing proves which one it is.',
    id: 'Union menyatakan sebuah nilai boleh apa saja; penyempitan membuktikan ia yang mana.',
  },
  submodules: [
    {
      id: 'ts-m2-s1',
      title: { en: 'Unions and Narrowing', id: 'Union dan Penyempitan' },
      summary: {
        en: 'A short list of allowed values, and how to work with one.',
        id: 'Daftar pendek nilai yang diizinkan, dan cara bekerja dengannya.',
      },
      lessons: [
        {
          id: 'ts-m2-s1-l1',
          title: { en: 'A value from a short list', id: 'Nilai dari daftar pendek' },
          goal: { en: 'Use unions and literal types.', id: 'Memakai union dan tipe literal.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The vertical bar means "or"', id: 'Garis tegak berarti "atau"' },
              body: {
                en: '`string | number` is a **union**: the value is one of those, and TypeScript does not know which. So it lets you do only what is safe for *both* — the things every member of the union can do. Anything else has to wait until you have narrowed it down.',
                id: '`string | number` adalah **union**: nilainya salah satu dari itu, dan TypeScript tidak tahu yang mana. Jadi ia hanya membolehkanmu melakukan yang aman bagi *keduanya* — hal-hal yang bisa dilakukan tiap anggota union-nya. Selain itu harus menunggu sampai kamu mempersempitnya.',
              },
              code:
                'let id: string | number;\n' +
                'id = "A-1";   // baik\n' +
                'id = 7;       // baik\n' +
                'id = true;    // ditolak\n\n' +
                "id.toUpperCase();  // Property 'toUpperCase' does not exist on type 'string | number'.",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A single value can be a type', id: 'Satu nilai pun bisa jadi tipe' },
              body: {
                en: 'The type `"kecil"` contains exactly one value: the string `"kecil"`. On its own that is useless; as a union it is one of the most useful things in the language. `"kecil" | "sedang" | "besar"` is a set of allowed strings, checked at every call, spelled correctly or not at all.',
                id: 'Tipe `"kecil"` memuat tepat satu nilai: string `"kecil"`. Sendirian itu tak berguna; sebagai union ia salah satu hal paling berguna di bahasanya. `"kecil" | "sedang" | "besar"` adalah himpunan string yang diizinkan, diperiksa di tiap pemanggilan, dieja benar atau tidak sama sekali.',
              },
              code:
                'type Ukuran = "kecil" | "sedang" | "besar";\n\n' +
                'let u: Ukuran = "sedang";  // baik\n' +
                'u = "Sedang";              // ditolak: huruf besarnya berbeda\n' +
                'u = "raksasa";             // ditolak: bukan salah satunya',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'This is what an enum of strings is for', id: 'Inilah gunanya enum berupa string' },
              body: {
                en: 'Before literal types, a function taking a "mode" took a `string`, and a typo became a bug you found in production. With a literal union the typo is a red squiggle, your editor offers the three choices, and renaming one of them shows you every place it is used.',
                id: 'Sebelum ada tipe literal, fungsi yang menerima sebuah "mode" menerima `string`, dan salah ketik jadi kutu yang baru kamu temukan di produksi. Dengan union literal, salah ketiknya jadi garis merah, editormu menawarkan ketiga pilihannya, dan mengganti nama salah satunya menunjukkan tiap tempat ia dipakai.',
              },
              code:
                'function kirim(mode: "cepat" | "hemat"): void { /* ... */ }\n\n' +
                'kirim("cepat");   // baik\n' +
                'kirim("cepatt");  // Argument of type \'"cepatt"\' is not assignable...',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which line is refused?',
                id: 'Baris mana yang ditolak?',
              },
              code: 'type Arah = "naik" | "turun";\n\nlet a: Arah = "naik";\na = "turun";\nlet b: string = a;\nlet c: Arah = b;',
              options: [
                { en: 'Only the last one', id: 'Hanya yang terakhir' },
                { en: 'The third and the last', id: 'Yang ketiga dan yang terakhir' },
                { en: 'None of them', id: 'Tidak ada' },
                { en: 'Only the third', id: 'Hanya yang ketiga' },
              ],
              answer: 0,
              explain: {
                en: 'Every `Arah` is a string, so widening is fine. Going back the other way is not: a `string` could hold anything.',
                id: 'Tiap `Arah` adalah string, jadi melebar itu boleh. Kembali ke arah sebaliknya tidak: `string` bisa berisi apa saja.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the type: a status that is one of three words.',
                id: 'Lengkapi tipenya: status yang berupa salah satu dari tiga kata.',
              },
              template: 'type Status = "baru" ___ "diproses" ___ "selesai";',
              blanks: ['|', '|'],
              explain: {
                en: 'The bar separates the members of a union, the same way it reads in English: this or this or this.',
                id: 'Garis tegaknya memisahkan anggota union-nya, sama seperti bacaannya: ini atau ini atau ini.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `type Ukuran = "kecil" | "sedang" | "besar"`, then write `harga(dasar: number, ukuran: Ukuran): number` which adds 0, 5000 or 10000 respectively.',
                id: 'Deklarasikan `type Ukuran = "kecil" | "sedang" | "besar"`, lalu tulis `harga(dasar: number, ukuran: Ukuran): number` yang menambahkan 0, 5000, atau 10000 secara berurutan.',
              },
              starter:
                'type Ukuran = string;\n\n' +
                'function harga(dasar: number, ukuran: Ukuran): number {\n  return dasar;\n}\n',
              tests: [
                {
                  name: { en: 'Each size costs the right amount', id: 'Tiap ukuran berbiaya tepat' },
                  check:
                    'assert(harga(20000, "kecil") === 20000, "kecil harus 20000, sekarang: " + harga(20000, "kecil"));\n' +
                    'assert(harga(20000, "sedang") === 25000, "sedang harus 25000, sekarang: " + harga(20000, "sedang"));\n' +
                    'assert(harga(20000, "besar") === 30000, "besar harus 30000, sekarang: " + harga(20000, "besar"));',
                },
                {
                  name: { en: 'The three sizes are accepted', id: 'Ketiga ukurannya diterima' },
                  probe: 'const uji1: Ukuran = "kecil";\nconst uji2: Ukuran = "sedang";\nconst uji3: Ukuran = "besar";',
                },
                {
                  name: { en: 'A fourth size is refused', id: 'Ukuran keempat ditolak' },
                  probe: 'harga(1000, "raksasa");',
                  expectError: true,
                  errorCode: 2345,
                },
                {
                  name: { en: 'Capitalisation matters', id: 'Besar-kecil hurufnya berarti' },
                  probe: 'const uji4: Ukuran = "Kecil";',
                  expectError: true,
                  errorCode: 2820,
                },
                {
                  name: { en: 'A plain string is not a size', id: 'String biasa bukan sebuah ukuran' },
                  probe: 'const kata: string = "kecil";\nharga(1000, kata);',
                  expectError: true,
                  errorCode: 2345,
                },
              ],
              hints: [
                { en: 'The starter calls a size `string`, which is why every word gets through.', id: 'Kode awalnya menyebut ukuran sebagai `string`, dan itulah sebabnya tiap kata lolos.' },
                { en: 'Three literals, separated by bars.', id: 'Tiga literal, dipisah garis tegak.' },
                { en: 'Inside the function an if or a switch on `ukuran` is all you need.', id: 'Di dalam fungsinya, if atau switch pada `ukuran` sudah cukup.' },
              ],
              solution:
                'type Ukuran = "kecil" | "sedang" | "besar";\n\n' +
                'function harga(dasar: number, ukuran: Ukuran): number {\n' +
                '  if (ukuran === "sedang") return dasar + 5000;\n' +
                '  if (ukuran === "besar") return dasar + 10000;\n' +
                '  return dasar;\n' +
                '}',
            },
          ],
        },
        {
          id: 'ts-m2-s1-l2',
          title: { en: 'Proving which one it is', id: 'Membuktikan ia yang mana' },
          goal: { en: 'Narrow a union with an ordinary check.', id: 'Mempersempit union dengan pemeriksaan biasa.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'typeof narrows', id: 'typeof mempersempit' },
              body: {
                en: 'This is the part that surprises people: TypeScript reads your `if`. Inside a branch guarded by `typeof x === "string"`, the type of `x` **is** `string` — not the union any more — so every string method is available and the compiler stops objecting. Nothing special was added to JavaScript; the checker just follows the same reasoning you do.',
                id: 'Inilah bagian yang mengejutkan banyak orang: TypeScript membaca `if`-mu. Di dalam cabang yang dijaga `typeof x === "string"`, tipe `x` **adalah** `string` — bukan union-nya lagi — jadi tiap method string tersedia dan kompilernya berhenti keberatan. Tak ada yang ditambahkan ke JavaScript; pemeriksanya sekadar mengikuti penalaran yang sama denganmu.',
              },
              code:
                'function tampil(nilai: string | number): string {\n' +
                '  if (typeof nilai === "string") {\n' +
                '    return nilai.toUpperCase();   // di sini nilai bertipe string\n' +
                '  }\n' +
                '  return nilai.toFixed(2);        // dan di sini number\n' +
                '}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'So does === on a literal', id: 'Begitu juga === pada sebuah literal' },
              body: {
                en: 'Comparing against one member of a literal union narrows it too, and so does an early `return`: after `if (u === "kecil") return ...`, the compiler knows that below that line `u` can only be `"sedang" | "besar"`. It keeps track as you go.',
                id: 'Membandingkan dengan salah satu anggota union literal juga mempersempitnya, begitu pula `return` lebih awal: setelah `if (u === "kecil") return ...`, kompilernya tahu bahwa di bawah baris itu `u` hanya bisa `"sedang" | "besar"`. Ia terus mencatat sambil jalan.',
              },
              code:
                'function biaya(u: "kecil" | "sedang" | "besar"): number {\n' +
                '  if (u === "kecil") return 0;\n' +
                '  // u di sini: "sedang" | "besar"\n' +
                '  return u === "sedang" ? 5000 : 10000;\n' +
                '}',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Arrays need Array.isArray', id: 'Array butuh Array.isArray' },
              body: {
                en: '`typeof []` is `"object"`, which tells you nothing useful, so an array in a union is narrowed with `Array.isArray(x)`. For objects that are not arrays, the `in` operator does the job: `"kota" in alamat` narrows to the member that has that property.',
                id: '`typeof []` adalah `"object"`, yang tak memberi tahu apa pun yang berguna, jadi array di dalam union dipersempit dengan `Array.isArray(x)`. Untuk objek yang bukan array, operator `in` yang bekerja: `"kota" in alamat` mempersempit ke anggota yang punya properti itu.',
              },
              code:
                'function gabung(x: string | string[]): string {\n' +
                '  if (Array.isArray(x)) return x.join(", ");\n' +
                '  return x;\n' +
                '}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is the last line refused?',
                id: 'Mengapa baris terakhirnya ditolak?',
              },
              code: 'function f(x: string | number) {\n  if (typeof x === "string") {\n    console.log(x.length);\n  }\n  console.log(x.length);\n}',
              options: [
                { en: 'Outside the if, x is the union again — a number has no length', id: 'Di luar if, x kembali jadi union — angka tak punya length' },
                { en: 'length only works on arrays', id: 'length hanya berlaku pada array' },
                { en: 'A function may only narrow once', id: 'Sebuah fungsi hanya boleh mempersempit sekali' },
                { en: 'It is not refused', id: 'Ia tidak ditolak' },
              ],
              answer: 0,
              explain: {
                en: 'Narrowing lasts exactly as long as the branch that proved it. Step outside and you know less again.',
                id: 'Penyempitannya bertahan tepat selama cabang yang membuktikannya. Melangkah keluar dan kamu tahu lebih sedikit lagi.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a function that narrows before it acts.',
                id: 'Susun fungsi yang mempersempit sebelum bertindak.',
              },
              lines: [
                'function panjang(x: string | string[]): number {',
                '  if (Array.isArray(x)) {',
                '    return x.length;',
                '  }',
                '  return x.length;',
                '}',
              ],
              explain: {
                en: 'Both branches say `.length`, but they mean different things — and the compiler had to be shown which before it allowed either.',
                id: 'Kedua cabangnya menulis `.length`, tetapi maknanya berbeda — dan kompilernya harus ditunjukkan yang mana sebelum membolehkan keduanya.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Fix `ringkas(nilai: string | number | string[]): string`. A string comes back unchanged, a number comes back with two decimals, and a list comes back joined with `", "`.',
                id: 'Betulkan `ringkas(nilai: string | number | string[]): string`. String kembali apa adanya, angka kembali dengan dua desimal, dan daftar kembali digabung dengan `", "`.',
              },
              starter:
                'function ringkas(nilai: string | number | string[]): string {\n' +
                '  return nilai.toFixed(2);\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'A string comes back as it was', id: 'String kembali apa adanya' },
                  check:
                    'assert(ringkas("halo") === "halo", "ringkas(\\"halo\\") harus \\"halo\\", sekarang: " + JSON.stringify(ringkas("halo")));',
                },
                {
                  name: { en: 'A number gets two decimals', id: 'Angka mendapat dua desimal' },
                  check:
                    'assert(ringkas(3.14159) === "3.14", "ringkas(3.14159) harus \\"3.14\\", sekarang: " + JSON.stringify(ringkas(3.14159)));\n' +
                    'assert(ringkas(7) === "7.00", "ringkas(7) harus \\"7.00\\", sekarang: " + JSON.stringify(ringkas(7)));',
                },
                {
                  name: { en: 'A list is joined', id: 'Daftar digabungkan' },
                  check:
                    'assert(ringkas(["a", "b", "c"]) === "a, b, c", "ringkas([\\"a\\",\\"b\\",\\"c\\"]) harus \\"a, b, c\\", sekarang: " + JSON.stringify(ringkas(["a", "b", "c"])));\n' +
                    'assert(ringkas([]) === "", "daftar kosong harus string kosong, sekarang: " + JSON.stringify(ringkas([])));',
                },
                {
                  name: { en: 'All three kinds are accepted', id: 'Ketiga jenisnya diterima' },
                  probe: 'const uji1 = ringkas("a");\nconst uji2 = ringkas(1);\nconst uji3 = ringkas(["a"]);',
                },
                {
                  name: { en: 'A boolean is refused', id: 'Boolean ditolak' },
                  probe: 'ringkas(true);',
                  expectError: true,
                  errorCode: 2345,
                },
                {
                  name: { en: 'A list of numbers is refused', id: 'Daftar angka ditolak' },
                  probe: 'ringkas([1, 2]);',
                  expectError: true,
                  errorCode: 2322,
                },
              ],
              hints: [
                { en: 'The starter calls `.toFixed` on the whole union. Read the error: it names all three members.', id: 'Kode awalnya memanggil `.toFixed` pada seluruh union-nya. Baca galatnya: ia menyebut ketiga anggotanya.' },
                { en: 'Check the array first — `typeof` cannot tell an array from an object.', id: 'Periksa array-nya lebih dulu — `typeof` tak bisa membedakan array dari objek.' },
                { en: 'Array.isArray(nilai), then typeof nilai === "number", and what is left is the string.', id: 'Array.isArray(nilai), lalu typeof nilai === "number", dan yang tersisa adalah string-nya.' },
              ],
              solution:
                'function ringkas(nilai: string | number | string[]): string {\n' +
                '  if (Array.isArray(nilai)) return nilai.join(", ");\n' +
                '  if (typeof nilai === "number") return nilai.toFixed(2);\n' +
                '  return nilai;\n' +
                '}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m2-s1-p1',
        runtime: 'ts',
        title: { en: 'The Notification Line', id: 'Baris Notifikasi' },
        brief: {
          en: 'Three functions around one small set of levels. The whole point is that a misspelt level cannot reach any of them.',
          id: 'Tiga fungsi di sekitar satu himpunan tingkat yang kecil. Intinya adalah tingkat yang salah ketik tak bisa sampai ke satu pun dari mereka.',
        },
        requirements: [
          { en: '`type Tingkat` is exactly `"info"`, `"peringatan"` or `"galat"`.', id: '`type Tingkat` tepat berisi `"info"`, `"peringatan"`, atau `"galat"`.' },
          { en: '`label(t)` returns `INFO`, `PERINGATAN` or `GALAT`.', id: '`label(t)` mengembalikan `INFO`, `PERINGATAN`, atau `GALAT`.' },
          { en: '`format(t, pesan)` returns `"[INFO] halo"`. A list of messages is joined with `"; "` first.', id: '`format(t, pesan)` mengembalikan `"[INFO] halo"`. Daftar pesan digabung dengan `"; "` lebih dulu.' },
          { en: '`paling(daftar)` returns the most serious level in the list — `"info"` for an empty list — and its return type must be `Tingkat`, not `string`.', id: '`paling(daftar)` mengembalikan tingkat paling serius dalam daftarnya — `"info"` untuk daftar kosong — dan tipe kembaliannya harus `Tingkat`, bukan `string`.' },
        ],
        starter:
          'type Tingkat = string;\n\n' +
          'function label(t: Tingkat): string {\n\n}\n\n' +
          'function format(t: Tingkat, pesan: string | string[]): string {\n\n}\n\n' +
          'function paling(daftar: Tingkat[]): Tingkat {\n\n}\n',
        tests: [
          {
            name: { en: 'Each level has its label', id: 'Tiap tingkat punya labelnya' },
            check:
              'assert(label("info") === "INFO", "label(\\"info\\") harus \\"INFO\\", sekarang: " + JSON.stringify(label("info")));\n' +
              'assert(label("peringatan") === "PERINGATAN", "label(\\"peringatan\\") harus \\"PERINGATAN\\", sekarang: " + JSON.stringify(label("peringatan")));\n' +
              'assert(label("galat") === "GALAT", "label(\\"galat\\") harus \\"GALAT\\", sekarang: " + JSON.stringify(label("galat")));',
          },
          {
            name: { en: 'A single message is bracketed', id: 'Satu pesan diberi kurung siku' },
            check:
              'assert(format("info", "halo") === "[INFO] halo", "harus \\"[INFO] halo\\", sekarang: " + JSON.stringify(format("info", "halo")));\n' +
              'assert(format("galat", "gagal") === "[GALAT] gagal", "harus \\"[GALAT] gagal\\", sekarang: " + JSON.stringify(format("galat", "gagal")));',
          },
          {
            name: { en: 'Several messages are joined first', id: 'Beberapa pesan digabung lebih dulu' },
            check:
              'assert(format("peringatan", ["a", "b"]) === "[PERINGATAN] a; b", "harus \\"[PERINGATAN] a; b\\", sekarang: " + JSON.stringify(format("peringatan", ["a", "b"])));\n' +
              'assert(format("info", []) === "[INFO] ", "daftar kosong harus menyisakan label dan spasi, sekarang: " + JSON.stringify(format("info", [])));',
          },
          {
            name: { en: 'The worst level wins', id: 'Tingkat terburuk yang menang' },
            check:
              'assert(paling([]) === "info", "daftar kosong harus \\"info\\", sekarang: " + JSON.stringify(paling([])));\n' +
              'assert(paling(["info", "info"]) === "info", "sekarang: " + JSON.stringify(paling(["info", "info"])));\n' +
              'assert(paling(["info", "peringatan"]) === "peringatan", "sekarang: " + JSON.stringify(paling(["info", "peringatan"])));\n' +
              'assert(paling(["galat", "info", "peringatan"]) === "galat", "sekarang: " + JSON.stringify(paling(["galat", "info", "peringatan"])));\n' +
              'assert(paling(["peringatan", "galat"]) === "galat", "urutan dalam daftar tidak boleh berpengaruh, sekarang: " + JSON.stringify(paling(["peringatan", "galat"])));',
          },
          {
            name: { en: 'The three levels are accepted', id: 'Ketiga tingkatnya diterima' },
            probe: 'const uji1: Tingkat = "info";\nconst uji2: Tingkat = "peringatan";\nconst uji3: Tingkat = "galat";',
          },
          {
            name: { en: 'A fourth level is refused', id: 'Tingkat keempat ditolak' },
            probe: 'label("fatal");',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'A plain string is not a level', id: 'String biasa bukan sebuah tingkat' },
            probe: 'const kata: string = "info";\nlabel(kata);',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'format wants text, not a number', id: 'format meminta teks, bukan angka' },
            probe: 'format("info", 42);',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'A bad level in the list is refused', id: 'Tingkat yang salah di dalam daftar ditolak' },
            probe: 'paling(["info", "fatal"]);',
            expectError: true,
          },
          {
            name: { en: 'paling gives back a Tingkat, usable as one', id: 'paling mengembalikan Tingkat, dan bisa dipakai sebagai itu' },
            probe: 'const uji4: Tingkat = paling(["info"]);\nlabel(paling(["galat"]));',
          },
        ],
        hints: [
          { en: 'The starter says a level is any string. That single line is why nothing else can be checked.', id: 'Kode awalnya menyatakan tingkat adalah string apa pun. Satu baris itulah sebabnya tak ada lagi yang bisa diperiksa.' },
          { en: '`format` takes a union for the message: narrow it with Array.isArray before joining.', id: '`format` menerima union untuk pesannya: persempit dengan Array.isArray sebelum menggabung.' },
          { en: 'Give the levels an order — an array `["info", "peringatan", "galat"]` and indexOf is enough.', id: 'Beri tingkatnya sebuah urutan — array `["info", "peringatan", "galat"]` dan indexOf sudah cukup.' },
          { en: 'One test calls `label(paling(...))`. That only compiles if `paling` really returns a Tingkat.', id: 'Satu tes memanggil `label(paling(...))`. Itu hanya lolos kompilasi kalau `paling` benar-benar mengembalikan Tingkat.' },
        ],
        solution:
          'type Tingkat = "info" | "peringatan" | "galat";\n\n' +
          'const URUTAN: Tingkat[] = ["info", "peringatan", "galat"];\n\n' +
          'function label(t: Tingkat): string {\n' +
          '  if (t === "info") return "INFO";\n' +
          '  if (t === "peringatan") return "PERINGATAN";\n' +
          '  return "GALAT";\n' +
          '}\n\n' +
          'function format(t: Tingkat, pesan: string | string[]): string {\n' +
          '  const isi = Array.isArray(pesan) ? pesan.join("; ") : pesan;\n' +
          '  return `[${label(t)}] ${isi}`;\n' +
          '}\n\n' +
          'function paling(daftar: Tingkat[]): Tingkat {\n' +
          '  let hasil: Tingkat = "info";\n' +
          '  for (const t of daftar) {\n' +
          '    if (URUTAN.indexOf(t) > URUTAN.indexOf(hasil)) hasil = t;\n' +
          '  }\n' +
          '  return hasil;\n' +
          '}',
        xp: 50,
      },
    },
    {
      id: 'ts-m2-s2',
      title: { en: 'Tagged Shapes, and Nothing At All', id: 'Bentuk Bertanda, dan Ketiadaan' },
      summary: {
        en: 'A union of objects that says which one it is, and values that may be missing.',
        id: 'Union objek yang menyatakan dirinya yang mana, dan nilai yang mungkin tidak ada.',
      },
      lessons: [
        {
          id: 'ts-m2-s2-l1',
          title: { en: 'A union that identifies itself', id: 'Union yang memperkenalkan dirinya' },
          goal: { en: 'Model alternatives with a tag field.', id: 'Memodelkan pilihan dengan sebuah field penanda.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Give every member the same tag field', id: 'Beri tiap anggota field penanda yang sama' },
              body: {
                en: 'A union of object shapes is hard to narrow — `typeof` says `"object"` for all of them. So give each member a property whose type is a distinct literal. Checking that one property tells the compiler exactly which member you are holding, and every other property of that member becomes available.',
                id: 'Union berisi bentuk objek sulit dipersempit — `typeof` menyebut `"object"` untuk semuanya. Maka beri tiap anggota sebuah properti yang tipenya literal berbeda. Memeriksa satu properti itu memberi tahu kompilernya persis anggota mana yang sedang kamu pegang, dan tiap properti lain milik anggota itu jadi tersedia.',
              },
              code:
                'type Bentuk =\n' +
                '  | { jenis: "lingkaran"; jari: number }\n' +
                '  | { jenis: "persegi"; sisi: number };\n\n' +
                'function luas(b: Bentuk): number {\n' +
                '  if (b.jenis === "lingkaran") return Math.PI * b.jari ** 2;\n' +
                '  return b.sisi ** 2;   // di sini b pasti persegi\n' +
                '}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reach for the wrong field and it says so', id: 'Menjangkau field yang salah dan ia menegurmu' },
              body: {
                en: 'This is the payoff. A circle has no `sisi`, so asking for one inside the circle branch is an error — not a silent `undefined` that becomes `NaN` three lines later. The shape of the data and the code that reads it can no longer drift apart.',
                id: 'Inilah hasilnya. Lingkaran tak punya `sisi`, jadi memintanya di dalam cabang lingkaran adalah galat — bukan `undefined` diam-diam yang jadi `NaN` tiga baris kemudian. Bentuk datanya dan kode yang membacanya tak bisa lagi berselisih.',
              },
              code:
                'if (b.jenis === "lingkaran") {\n' +
                "  return b.sisi;  // Property 'sisi' does not exist on type '{ jenis: \"lingkaran\"; jari: number; }'.\n" +
                '}',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'never catches the case you forgot', id: 'never menangkap kasus yang kamu lupakan' },
              body: {
                en: 'When every member has been handled, what is left is `never` — the type with no values. Assigning the leftover to a `never` therefore compiles today; add a fourth shape tomorrow and that same line stops compiling, pointing at the switch you forgot to extend. It is a reminder that cannot be ignored.',
                id: 'Ketika tiap anggotanya sudah ditangani, yang tersisa adalah `never` — tipe tanpa nilai. Menugaskan sisanya ke `never` karena itu lolos kompilasi hari ini; tambahkan bentuk keempat besok dan baris yang sama berhenti lolos, sambil menunjuk switch yang lupa kamu perluas. Ini pengingat yang tak bisa diabaikan.',
              },
              code:
                'function luas(b: Bentuk): number {\n' +
                '  switch (b.jenis) {\n' +
                '    case "lingkaran": return Math.PI * b.jari ** 2;\n' +
                '    case "persegi": return b.sisi ** 2;\n' +
                '    default: {\n' +
                '      const belum: never = b;\n' +
                '      return belum;\n' +
                '    }\n' +
                '  }\n' +
                '}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must the tag be a literal type rather than `string`?',
                id: 'Mengapa penandanya harus tipe literal, bukan `string`?',
              },
              options: [
                { en: 'Comparing a `string` proves nothing, so no member is ruled out', id: 'Membandingkan `string` tidak membuktikan apa pun, jadi tak ada anggota yang tersingkir' },
                { en: '`string` cannot be compared with ===', id: '`string` tidak bisa dibandingkan dengan ===' },
                { en: 'Tags must be numbers', id: 'Penanda harus berupa angka' },
                { en: 'It makes no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'Narrowing works by elimination. If both members say `jenis: string`, a comparison eliminates neither.',
                id: 'Penyempitan bekerja dengan menyingkirkan. Kalau kedua anggotanya menyebut `jenis: string`, sebuah perbandingan tak menyingkirkan satu pun.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `type Bentuk` as a tagged union of a circle (`"lingkaran"` with `jari`), a square (`"persegi"` with `sisi`) and a rectangle (`"persegipanjang"` with `panjang` and `lebar`), then write `luas(b: Bentuk): number`.',
                id: 'Deklarasikan `type Bentuk` sebagai union bertanda berisi lingkaran (`"lingkaran"` dengan `jari`), persegi (`"persegi"` dengan `sisi`), dan persegi panjang (`"persegipanjang"` dengan `panjang` dan `lebar`), lalu tulis `luas(b: Bentuk): number`.',
              },
              starter:
                'type Bentuk = { jenis: string; jari?: number; sisi?: number; panjang?: number; lebar?: number };\n\n' +
                'function luas(b: Bentuk): number {\n  return 0;\n}\n',
              tests: [
                {
                  name: { en: 'Every shape has the right area', id: 'Tiap bentuk punya luas yang benar' },
                  check:
                    'assert(Math.abs(luas({ jenis: "lingkaran", jari: 2 }) - Math.PI * 4) < 1e-9, "lingkaran jari 2 harus pi*4, sekarang: " + luas({ jenis: "lingkaran", jari: 2 }));\n' +
                    'assert(luas({ jenis: "persegi", sisi: 3 }) === 9, "persegi sisi 3 harus 9, sekarang: " + luas({ jenis: "persegi", sisi: 3 }));\n' +
                    'assert(luas({ jenis: "persegipanjang", panjang: 3, lebar: 4 }) === 12, "3x4 harus 12, sekarang: " + luas({ jenis: "persegipanjang", panjang: 3, lebar: 4 }));',
                },
                {
                  name: { en: 'All three shapes are accepted', id: 'Ketiga bentuknya diterima' },
                  probe:
                    'const uji1: Bentuk = { jenis: "lingkaran", jari: 1 };\n' +
                    'const uji2: Bentuk = { jenis: "persegi", sisi: 1 };\n' +
                    'const uji3: Bentuk = { jenis: "persegipanjang", panjang: 1, lebar: 2 };',
                },
                {
                  name: { en: 'A circle without a radius is refused', id: 'Lingkaran tanpa jari-jari ditolak' },
                  probe: 'const uji4: Bentuk = { jenis: "lingkaran" };',
                  expectError: true,
                },
                {
                  name: { en: 'A square carrying a radius is refused', id: 'Persegi yang membawa jari-jari ditolak' },
                  probe: 'const uji5: Bentuk = { jenis: "persegi", sisi: 1, jari: 2 };',
                  expectError: true,
                },
                {
                  name: { en: 'A fourth kind of shape is refused', id: 'Bentuk jenis keempat ditolak' },
                  probe: 'const uji6: Bentuk = { jenis: "segitiga", alas: 1, tinggi: 2 };',
                  expectError: true,
                },
                {
                  name: { en: 'A rectangle needs both sides', id: 'Persegi panjang butuh kedua sisinya' },
                  probe: 'const uji7: Bentuk = { jenis: "persegipanjang", panjang: 3 };',
                  expectError: true,
                },
              ],
              hints: [
                { en: 'The starter is one shape with everything optional — which is exactly the design a tagged union replaces.', id: 'Kode awalnya satu bentuk dengan semuanya opsional — dan persis desain itulah yang digantikan union bertanda.' },
                { en: 'Three members, separated by bars, each with its own `jenis` literal.', id: 'Tiga anggota, dipisah garis tegak, masing-masing dengan literal `jenis`-nya sendiri.' },
                { en: 'Inside `luas`, switch on `b.jenis`; each case sees only that member\'s fields.', id: 'Di dalam `luas`, switch pada `b.jenis`; tiap case hanya melihat field milik anggota itu.' },
              ],
              solution:
                'type Bentuk =\n' +
                '  | { jenis: "lingkaran"; jari: number }\n' +
                '  | { jenis: "persegi"; sisi: number }\n' +
                '  | { jenis: "persegipanjang"; panjang: number; lebar: number };\n\n' +
                'function luas(b: Bentuk): number {\n' +
                '  switch (b.jenis) {\n' +
                '    case "lingkaran":\n' +
                '      return Math.PI * b.jari ** 2;\n' +
                '    case "persegi":\n' +
                '      return b.sisi ** 2;\n' +
                '    case "persegipanjang":\n' +
                '      return b.panjang * b.lebar;\n' +
                '  }\n' +
                '}',
            },
          ],
        },
        {
          id: 'ts-m2-s2-l2',
          title: { en: 'When there is nothing there', id: 'Ketika di sana tidak ada apa-apa' },
          goal: { en: 'Handle null and undefined before the compiler lets you past.', id: 'Menangani null dan undefined sebelum kompilernya membiarkanmu lewat.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'null is not a member of every type', id: 'null bukan anggota tiap tipe' },
              body: {
                en: 'Under `strict`, a `string` is a string — never `null`, never `undefined`. If a value may be absent you say so: `string | null`. And having said so, the compiler will not let you use it until you have checked. This one rule removes most of the "cannot read property of undefined" family.',
                id: 'Di bawah `strict`, sebuah `string` adalah string — tak pernah `null`, tak pernah `undefined`. Kalau sebuah nilai mungkin tidak ada, katakanlah: `string | null`. Dan setelah mengatakannya, kompilernya tak akan membiarkanmu memakainya sebelum kamu memeriksa. Satu aturan ini menghapus sebagian besar keluarga "cannot read property of undefined".',
              },
              code:
                'function panjang(teks: string | null): number {\n' +
                "  return teks.length;   // 'teks' is possibly 'null'.\n" +
                '}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '?. stops early, ?? supplies a fallback', id: '?. berhenti lebih awal, ?? menyediakan cadangan' },
              body: {
                en: '`a?.b` gives `undefined` instead of throwing when `a` is null or undefined, so a whole chain can be walked safely. `x ?? y` gives `y` only when `x` is null or undefined — unlike `||`, which also replaces `0` and `""`, and has quietly broken a great many programs.',
                id: '`a?.b` menghasilkan `undefined` alih-alih melempar ketika `a` bernilai null atau undefined, jadi seluruh rantainya bisa ditelusuri dengan aman. `x ?? y` menghasilkan `y` hanya ketika `x` bernilai null atau undefined — berbeda dari `||`, yang juga mengganti `0` dan `""`, dan diam-diam sudah merusak sangat banyak program.',
              },
              code:
                'const kota = profil.alamat?.kota ?? "Tidak diketahui";\n\n' +
                'const jumlah = pesanan.jumlah ?? 1;   // 0 tetap 0\n' +
                'const salah = pesanan.jumlah || 1;    // 0 berubah jadi 1',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The ! is a promise you cannot keep', id: 'Tanda ! adalah janji yang tak bisa kamu tepati' },
              body: {
                en: '`x!` tells the compiler "trust me, this is not null". It silences the error and changes nothing about the value. If you are wrong, you have swapped a message you would have read for a crash a user will see. Check instead; `!` is for the rare case where you can prove what the compiler cannot.',
                id: '`x!` memberi tahu kompilernya "percaya saja, ini bukan null". Ia membungkam galatnya dan tak mengubah apa pun pada nilainya. Kalau kamu salah, kamu menukar pesan yang tadinya kamu baca dengan kerusakan yang akan dilihat pengguna. Periksa saja; `!` untuk kasus langka ketika kamu bisa membuktikan apa yang tak bisa dibuktikan kompilernya.',
              },
              code:
                'const el = cari(id)!;   // berani\n' +
                'const el = cari(id);    // lebih baik\n' +
                'if (el === null) return;',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '`jumlah` is `number | undefined` and holds `0`. What do these give?',
                id: '`jumlah` bertipe `number | undefined` dan berisi `0`. Apa hasil keduanya?',
              },
              code: 'const a = jumlah ?? 10;\nconst b = jumlah || 10;',
              options: [
                { en: 'a is 0, b is 10', id: 'a bernilai 0, b bernilai 10' },
                { en: 'Both are 0', id: 'Keduanya 0' },
                { en: 'Both are 10', id: 'Keduanya 10' },
                { en: 'a is 10, b is 0', id: 'a bernilai 10, b bernilai 0' },
              ],
              answer: 0,
              explain: {
                en: '`??` only reacts to null and undefined. `||` reacts to anything falsy, and 0 is falsy — which is why a quantity of zero so often turns into one.',
                id: '`??` hanya bereaksi pada null dan undefined. `||` bereaksi pada apa pun yang falsy, dan 0 itu falsy — dan itulah sebabnya jumlah nol begitu sering berubah jadi satu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Read a possibly-missing city, falling back to a dash.',
                id: 'Baca kota yang mungkin tidak ada, dengan cadangan berupa tanda hubung.',
              },
              template: 'const kota = p.alamat___.kota ___ "-";',
              blanks: ['?', '??'],
              explain: {
                en: 'The optional chain stops the walk; the nullish coalescing supplies what to use instead.',
                id: 'Rantai opsionalnya menghentikan penelusuran; operator penggabung nullish-nya menyediakan penggantinya.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'The starter does not compile: both functions walk into an optional property. Fix them so `kota` falls back to `"Tidak diketahui"` and `pos` falls back to `"-"`.',
                id: 'Kode awalnya tidak bisa dikompilasi: kedua fungsinya menjangkau properti opsional. Betulkan agar `kota` bercadangan `"Tidak diketahui"` dan `pos` bercadangan `"-"`.',
              },
              starter:
                'interface Profil {\n' +
                '  nama: string;\n' +
                '  alamat?: { kota: string; pos?: string };\n' +
                '}\n\n' +
                'function kota(p: Profil): string {\n' +
                '  return p.alamat.kota;\n' +
                '}\n\n' +
                'function pos(p: Profil): string {\n' +
                '  return p.alamat.pos;\n' +
                '}\n',
              tests: [
                {
                  name: { en: 'A missing address falls back', id: 'Alamat yang tidak ada punya cadangan' },
                  check:
                    'assert(kota({ nama: "Ani" }) === "Tidak diketahui", "tanpa alamat harus \\"Tidak diketahui\\", sekarang: " + JSON.stringify(kota({ nama: "Ani" })));\n' +
                    'assert(pos({ nama: "Ani" }) === "-", "tanpa alamat harus \\"-\\", sekarang: " + JSON.stringify(pos({ nama: "Ani" })));',
                },
                {
                  name: { en: 'A present city is used', id: 'Kota yang ada dipakai' },
                  check:
                    'assert(kota({ nama: "Ani", alamat: { kota: "Surabaya" } }) === "Surabaya", "sekarang: " + JSON.stringify(kota({ nama: "Ani", alamat: { kota: "Surabaya" } })));',
                },
                {
                  name: { en: 'A missing postcode falls back on its own', id: 'Kode pos yang tidak ada punya cadangannya sendiri' },
                  check:
                    'assert(pos({ nama: "Ani", alamat: { kota: "Surabaya" } }) === "-", "alamat ada tapi pos tidak, harus \\"-\\", sekarang: " + JSON.stringify(pos({ nama: "Ani", alamat: { kota: "Surabaya" } })));\n' +
                    'assert(pos({ nama: "Ani", alamat: { kota: "Surabaya", pos: "60111" } }) === "60111", "sekarang: " + JSON.stringify(pos({ nama: "Ani", alamat: { kota: "Surabaya", pos: "60111" } })));',
                },
                {
                  name: { en: 'A profile without an address is accepted', id: 'Profil tanpa alamat diterima' },
                  probe: 'const uji1: Profil = { nama: "Ani" };',
                },
                {
                  name: { en: 'A profile without a name is refused', id: 'Profil tanpa nama ditolak' },
                  probe: 'const uji2: Profil = { alamat: { kota: "Surabaya" } };',
                  expectError: true,
                  errorCode: 2741,
                },
                {
                  name: { en: 'An address without a city is refused', id: 'Alamat tanpa kota ditolak' },
                  probe: 'const uji3: Profil = { nama: "Ani", alamat: { pos: "60111" } };',
                  expectError: true,
                },
                {
                  name: { en: 'Both functions promise a string', id: 'Kedua fungsinya menjanjikan string' },
                  probe: 'const uji4: string = kota({ nama: "a" });\nconst uji5: string = pos({ nama: "a" });',
                },
              ],
              hints: [
                { en: 'Read the two errors first — they name the expression that might be undefined.', id: 'Baca dulu kedua galatnya — keduanya menyebut ekspresi yang mungkin undefined.' },
                { en: 'An optional chain walks past a missing address: `p.alamat?.kota`.', id: 'Rantai opsional melewati alamat yang tidak ada: `p.alamat?.kota`.' },
                { en: '`pos` needs two steps of safety, because the postcode is optional even when the address is there.', id: '`pos` butuh dua langkah pengamanan, karena kode posnya opsional bahkan ketika alamatnya ada.' },
              ],
              solution:
                'interface Profil {\n' +
                '  nama: string;\n' +
                '  alamat?: { kota: string; pos?: string };\n' +
                '}\n\n' +
                'function kota(p: Profil): string {\n' +
                '  return p.alamat?.kota ?? "Tidak diketahui";\n' +
                '}\n\n' +
                'function pos(p: Profil): string {\n' +
                '  return p.alamat?.pos ?? "-";\n' +
                '}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m2-s2-p1',
        runtime: 'ts',
        title: { en: 'The Activity Feed', id: 'Lini Masa Aktivitas' },
        brief: {
          en: 'Three kinds of event in one list. Model them so that reading the wrong field is a compile error rather than a blank space on somebody\'s screen.',
          id: 'Tiga jenis peristiwa dalam satu daftar. Modelkan agar membaca field yang salah jadi galat kompilasi, bukan ruang kosong di layar seseorang.',
        },
        requirements: [
          { en: '`type Peristiwa` is a tagged union of `"pesan"` (with `dari` and `isi`), `"suka"` (with `dari`), and `"sistem"` (with `kode` and an optional `catatan`).', id: '`type Peristiwa` adalah union bertanda berisi `"pesan"` (dengan `dari` dan `isi`), `"suka"` (dengan `dari`), dan `"sistem"` (dengan `kode` dan `catatan` opsional).' },
          { en: '`ringkas(p)` returns `"Ani: halo"`, `"Ani menyukai kirimanmu"`, or `"Sistem #404"` — and `"Sistem #404 (tidak ditemukan)"` when there is a note.', id: '`ringkas(p)` mengembalikan `"Ani: halo"`, `"Ani menyukai kirimanmu"`, atau `"Sistem #404"` — dan `"Sistem #404 (tidak ditemukan)"` ketika ada catatannya.' },
          { en: '`dariSiapa(p)` returns the sender, or `null` for a system event. Its return type must say `string | null`.', id: '`dariSiapa(p)` mengembalikan pengirimnya, atau `null` untuk peristiwa sistem. Tipe kembaliannya harus menyatakan `string | null`.' },
          { en: '`hitungPesan(daftar)` returns how many of the events are messages.', id: '`hitungPesan(daftar)` mengembalikan berapa banyak peristiwanya yang berupa pesan.' },
        ],
        starter:
          'type Peristiwa = {\n' +
          '  jenis: string;\n' +
          '  dari?: string;\n' +
          '  isi?: string;\n' +
          '  kode?: number;\n' +
          '  catatan?: string;\n' +
          '};\n\n' +
          'function ringkas(p: Peristiwa): string {\n\n}\n\n' +
          'function dariSiapa(p: Peristiwa): string | null {\n\n}\n\n' +
          'function hitungPesan(daftar: Peristiwa[]): number {\n\n}\n',
        tests: [
          {
            name: { en: 'Each kind reads correctly', id: 'Tiap jenisnya terbaca dengan benar' },
            check:
              'assert(ringkas({ jenis: "pesan", dari: "Ani", isi: "halo" }) === "Ani: halo", "sekarang: " + JSON.stringify(ringkas({ jenis: "pesan", dari: "Ani", isi: "halo" })));\n' +
              'assert(ringkas({ jenis: "suka", dari: "Budi" }) === "Budi menyukai kirimanmu", "sekarang: " + JSON.stringify(ringkas({ jenis: "suka", dari: "Budi" })));\n' +
              'assert(ringkas({ jenis: "sistem", kode: 404 }) === "Sistem #404", "sekarang: " + JSON.stringify(ringkas({ jenis: "sistem", kode: 404 })));',
          },
          {
            name: { en: 'A note is appended in brackets', id: 'Catatannya ditambahkan dalam kurung' },
            check:
              'assert(ringkas({ jenis: "sistem", kode: 404, catatan: "tidak ditemukan" }) === "Sistem #404 (tidak ditemukan)", "sekarang: " + JSON.stringify(ringkas({ jenis: "sistem", kode: 404, catatan: "tidak ditemukan" })));',
          },
          {
            name: { en: 'The sender is found, or is null', id: 'Pengirimnya ditemukan, atau null' },
            check:
              'assert(dariSiapa({ jenis: "pesan", dari: "Ani", isi: "x" }) === "Ani", "sekarang: " + JSON.stringify(dariSiapa({ jenis: "pesan", dari: "Ani", isi: "x" })));\n' +
              'assert(dariSiapa({ jenis: "suka", dari: "Budi" }) === "Budi", "sekarang: " + JSON.stringify(dariSiapa({ jenis: "suka", dari: "Budi" })));\n' +
              'assert(dariSiapa({ jenis: "sistem", kode: 500 }) === null, "peristiwa sistem harus null, sekarang: " + JSON.stringify(dariSiapa({ jenis: "sistem", kode: 500 })));',
          },
          {
            name: { en: 'Messages are counted, nothing else', id: 'Pesannya dihitung, yang lain tidak' },
            check:
              'const daftar = [\n' +
              '  { jenis: "pesan", dari: "Ani", isi: "a" },\n' +
              '  { jenis: "suka", dari: "Budi" },\n' +
              '  { jenis: "pesan", dari: "Citra", isi: "b" },\n' +
              '  { jenis: "sistem", kode: 200 },\n' +
              '];\n' +
              'assert(hitungPesan(daftar) === 2, "harus 2, sekarang: " + hitungPesan(daftar));\n' +
              'assert(hitungPesan([]) === 0, "daftar kosong harus 0, sekarang: " + hitungPesan([]));',
          },
          {
            name: { en: 'All three kinds are accepted', id: 'Ketiga jenisnya diterima' },
            probe:
              'const uji1: Peristiwa = { jenis: "pesan", dari: "a", isi: "b" };\n' +
              'const uji2: Peristiwa = { jenis: "suka", dari: "a" };\n' +
              'const uji3: Peristiwa = { jenis: "sistem", kode: 1 };\n' +
              'const uji4: Peristiwa = { jenis: "sistem", kode: 1, catatan: "c" };',
          },
          {
            name: { en: 'A message without its text is refused', id: 'Pesan tanpa isinya ditolak' },
            probe: 'const uji5: Peristiwa = { jenis: "pesan", dari: "a" };',
            expectError: true,
          },
          {
            name: { en: 'A like carrying a message body is refused', id: 'Suka yang membawa isi pesan ditolak' },
            probe: 'const uji6: Peristiwa = { jenis: "suka", dari: "a", isi: "b" };',
            expectError: true,
          },
          {
            name: { en: 'A system event has no sender', id: 'Peristiwa sistem tak punya pengirim' },
            probe: 'const uji7: Peristiwa = { jenis: "sistem", kode: 1, dari: "a" };',
            expectError: true,
          },
          {
            name: { en: 'A fourth kind is refused', id: 'Jenis keempat ditolak' },
            probe: 'const uji8: Peristiwa = { jenis: "undangan", dari: "a" };',
            expectError: true,
          },
          {
            name: { en: 'The sender may be null, and the caller is made to know it', id: 'Pengirimnya boleh null, dan pemanggilnya dipaksa tahu' },
            probe: 'const uji9: string = dariSiapa({ jenis: "suka", dari: "a" });',
            expectError: true,
            errorCode: 2322,
          },
        ],
        hints: [
          { en: 'The starter is the shape this lesson exists to replace: one object with everything optional, where nothing can be checked.', id: 'Kode awalnya adalah bentuk yang keberadaan pelajaran ini justru untuk menggantikannya: satu objek dengan semuanya opsional, tempat tak ada yang bisa diperiksa.' },
          { en: 'Three members, each with its own `jenis` literal, and only the fields that member really has.', id: 'Tiga anggota, masing-masing dengan literal `jenis`-nya sendiri, dan hanya field yang benar-benar dimiliki anggota itu.' },
          { en: 'A switch on `p.jenis` inside each function gives you the right fields with no checking of your own.', id: 'Switch pada `p.jenis` di dalam tiap fungsinya memberimu field yang tepat tanpa perlu memeriksa sendiri.' },
          { en: 'Only `catatan` stays optional — reach for `??` there, not for the tag.', id: 'Hanya `catatan` yang tetap opsional — pakai `??` di situ, bukan pada penandanya.' },
        ],
        solution:
          'type Peristiwa =\n' +
          '  | { jenis: "pesan"; dari: string; isi: string }\n' +
          '  | { jenis: "suka"; dari: string }\n' +
          '  | { jenis: "sistem"; kode: number; catatan?: string };\n\n' +
          'function ringkas(p: Peristiwa): string {\n' +
          '  switch (p.jenis) {\n' +
          '    case "pesan":\n' +
          '      return `${p.dari}: ${p.isi}`;\n' +
          '    case "suka":\n' +
          '      return `${p.dari} menyukai kirimanmu`;\n' +
          '    case "sistem":\n' +
          '      return p.catatan ? `Sistem #${p.kode} (${p.catatan})` : `Sistem #${p.kode}`;\n' +
          '  }\n' +
          '}\n\n' +
          'function dariSiapa(p: Peristiwa): string | null {\n' +
          '  return p.jenis === "sistem" ? null : p.dari;\n' +
          '}\n\n' +
          'function hitungPesan(daftar: Peristiwa[]): number {\n' +
          '  return daftar.filter((p) => p.jenis === "pesan").length;\n' +
          '}',
        xp: 50,
      },
    },
  ],
}
