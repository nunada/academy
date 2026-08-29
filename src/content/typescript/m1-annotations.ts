import type { Module } from '../types'

/** Module 1 — what an annotation is, and the two places TypeScript cannot
 *  work it out for you: parameters, and the shape of an object. */

export const module1: Module = {
  id: 'ts-m1',
  title: { en: 'Saying What You Mean', id: 'Menyatakan Maksudmu' },
  summary: {
    en: 'Annotate a value, and let the compiler hold you to it.',
    id: 'Memberi keterangan pada nilai, dan membiarkan kompiler menagihmu untuk itu.',
  },
  submodules: [
    {
      id: 'ts-m1-s1',
      title: { en: 'Values and Functions', id: 'Nilai dan Fungsi' },
      summary: {
        en: 'Where a type is inferred, and where you have to write it.',
        id: 'Di mana tipe disimpulkan sendiri, dan di mana kamu harus menulisnya.',
      },
      lessons: [
        {
          id: 'ts-m1-s1-l1',
          title: { en: 'A checker that reads first', id: 'Pemeriksa yang membaca lebih dulu' },
          goal: { en: 'Annotate a value and see the compiler object.', id: 'Memberi keterangan pada nilai dan melihat kompilernya keberatan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'TypeScript runs before your program does', id: 'TypeScript berjalan sebelum programmu' },
              body: {
                en: 'TypeScript is JavaScript plus a **checker**. It reads your code, decides whether it makes sense, and then throws the types away — what actually runs is plain JavaScript. Nothing is checked while the program is running; everything is checked before it ever starts.',
                id: 'TypeScript adalah JavaScript ditambah sebuah **pemeriksa**. Ia membaca kodemu, memutuskan apakah kodenya masuk akal, lalu membuang tipenya — yang benar-benar berjalan adalah JavaScript biasa. Tidak ada yang diperiksa saat program berjalan; semuanya diperiksa sebelum ia sempat mulai.',
              },
              code: '// TypeScript\nconst umur: number = 17;\nconsole.log(umur + 1);',
              output: '// JavaScript hasilnya\nconst umur = 17;\nconsole.log(umur + 1);',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'An annotation is a promise', id: 'Keterangan tipe adalah sebuah janji' },
              body: {
                en: '`: number` after a name says "this will always be a number". From then on the compiler holds you to it, and every line that breaks the promise is reported with a file and a line number — before anybody runs anything.',
                id: '`: number` setelah sebuah nama berarti "ini akan selalu berupa angka". Sejak saat itu kompiler menagihmu untuk janji itu, dan tiap baris yang melanggarnya dilaporkan lengkap dengan berkas dan nomor barisnya — sebelum ada yang menjalankan apa pun.',
              },
              code: {
                en: 'let jumlah: number = 5;\njumlah = 6;        // fine\njumlah = "enam";   // Type \'string\' is not assignable to type \'number\'.',
                id: 'let jumlah: number = 5;\njumlah = 6;        // baik\njumlah = "enam";   // Type \'string\' is not assignable to type \'number\'.',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Most of the time you write nothing', id: 'Sebagian besar waktu kamu tak menulis apa-apa' },
              body: {
                en: 'TypeScript **infers** the type from the value, so annotating a variable you are initialising right there is usually noise. The compiler already knows. Write the annotation where it cannot know: on function parameters.',
                id: 'TypeScript **menyimpulkan** tipenya dari nilainya, jadi memberi keterangan pada variabel yang langsung kamu isi biasanya cuma kebisingan. Kompilernya sudah tahu. Tulis keterangannya di tempat ia tak bisa tahu: pada parameter fungsi.',
              },
              code: {
                en:
                  'const nama = "Nunada";   // string, without being told\n' +
                  'const tahun = 2024;      // number\n\n' +
                  "function sapa(nama) {    // ...but this one? TypeScript can't guess.\n" +
                  '  return "Halo, " + nama;\n' +
                  '}',
                id:
                  'const nama = "Nunada";   // string, tanpa diberi tahu\n' +
                  'const tahun = 2024;      // number\n\n' +
                  'function sapa(nama) {    // ...tapi yang ini? TypeScript tidak bisa menebak.\n' +
                  '  return "Halo, " + nama;\n' +
                  '}',
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'any switches the checker off', id: 'any mematikan pemeriksanya' },
              body: {
                en: '`any` means "stop checking this". It is occasionally the honest answer, and it is very often a way of making an error message go away without fixing anything — the mistake simply moves to runtime, where it costs more. In this course `any` is never the answer.',
                id: '`any` berarti "berhenti memeriksa yang ini". Kadang ia jawaban yang jujur, dan sangat sering ia cara menghilangkan pesan galat tanpa membetulkan apa pun — kesalahannya sekadar pindah ke waktu jalan, tempat ia jadi lebih mahal. Di kursus ini `any` tidak pernah jadi jawabannya.',
              },
              code: {
                en:
                  'let x: any = "halo";\n' +
                  'console.log(x.toFixed(2));  // accepted by the compiler\n' +
                  '// ...then blows up at runtime: x.toFixed is not a function',
                id:
                  'let x: any = "halo";\n' +
                  'console.log(x.toFixed(2));  // diterima kompiler\n' +
                  '// ...lalu meledak saat dijalankan: x.toFixed is not a function',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which line does the compiler complain about?',
                id: 'Baris mana yang dikeluhkan kompilernya?',
              },
              code: 'const kota = "Surabaya";\nconst jumlah: number = 3;\nconst pesan = kota + jumlah;\nconst salah: number = kota;',
              options: [
                { en: 'Only the last one', id: 'Hanya yang terakhir' },
                { en: 'The third and the last', id: 'Yang ketiga dan yang terakhir' },
                { en: 'None of them', id: 'Tidak ada' },
                { en: 'The second one', id: 'Yang kedua' },
              ],
              answer: 0,
              explain: {
                en: 'A string plus a number is legal JavaScript and TypeScript allows it. Assigning a string to a `number` is not.',
                id: 'String ditambah angka itu JavaScript yang sah dan TypeScript membolehkannya. Menugaskan string ke `number` tidak.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Annotate the parameter and the return type.',
                id: 'Beri keterangan tipe pada parameternya dan tipe kembaliannya.',
              },
              template: 'function dua(n: ___): ___ {\n  return n * 2;\n}',
              blanks: ['number', 'number'],
              explain: {
                en: 'The parameter is the part TypeScript cannot infer; the return type it could, but writing it makes the function state its own contract.',
                id: 'Parameternya bagian yang tak bisa disimpulkan TypeScript; tipe kembaliannya sebenarnya bisa, tetapi menuliskannya membuat fungsinya menyatakan kontraknya sendiri.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Write `sapa`, taking a `nama` of type string and returning the string `Halo, {nama}!`. The starter does not compile — read what the compiler says about it.',
                id: 'Tulis `sapa`, menerima `nama` bertipe string dan mengembalikan string `Halo, {nama}!`. Kode awalnya tidak bisa dikompilasi — baca dulu apa kata kompilernya.',
              },
              starter: 'function sapa(nama) {\n  return "Halo, " + nama + "!";\n}\n',
              tests: [
                {
                  name: { en: 'It greets by name', id: 'Ia menyapa dengan namanya' },
                  check:
                    'assert(sapa("Nunada") === "Halo, Nunada!", "sapa(\\"Nunada\\") harus \\"Halo, Nunada!\\", sekarang: " + JSON.stringify(sapa("Nunada")));\n' +
                    'assert(sapa("Ani") === "Halo, Ani!", "sapa(\\"Ani\\") harus \\"Halo, Ani!\\", sekarang: " + JSON.stringify(sapa("Ani")));',
                },
                {
                  name: { en: 'A string goes in', id: 'String boleh masuk' },
                  probe: 'const uji1 = sapa("Ani");',
                },
                {
                  name: { en: 'A number is refused', id: 'Angka ditolak' },
                  probe: 'sapa(42);',
                  expectError: true,
                  errorCode: 2345,
                },
                {
                  name: { en: 'It is declared to return a string', id: 'Ia dinyatakan mengembalikan string' },
                  probe: 'const uji2: number = sapa("Ani");',
                  expectError: true,
                  errorCode: 2322,
                },
              ],
              hints: [
                { en: 'The compiler is complaining about the parameter, not the body.', id: 'Kompilernya mengeluhkan parameternya, bukan isi fungsinya.' },
                { en: 'The annotation goes right after the name: `nama: string`.', id: 'Keterangannya ditulis tepat setelah namanya: `nama: string`.' },
                { en: 'The return type goes after the brackets: `function sapa(nama: string): string`.', id: 'Tipe kembaliannya ditulis setelah kurungnya: `function sapa(nama: string): string`.' },
              ],
              solution: 'function sapa(nama: string): string {\n  return `Halo, ${nama}!`;\n}',
            },
          ],
        },
        {
          id: 'ts-m1-s1-l2',
          title: { en: 'Parameters that may be missing', id: 'Parameter yang boleh tidak ada' },
          goal: { en: 'Write optional parameters and defaults.', id: 'Menulis parameter opsional dan nilai bawaan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'TypeScript counts your arguments', id: 'TypeScript menghitung argumenmu' },
              body: {
                en: 'In JavaScript, calling a two-parameter function with one argument is legal and quietly gives you `undefined`. TypeScript refuses it. That refusal is one of the plainest wins in the language — a whole category of "why is this undefined" simply stops happening.',
                id: 'Di JavaScript, memanggil fungsi berparameter dua dengan satu argumen itu sah dan diam-diam memberimu `undefined`. TypeScript menolaknya. Penolakan itu salah satu keuntungan paling gamblang dari bahasanya — satu kategori penuh pertanyaan "kenapa ini undefined" berhenti terjadi.',
              },
              code:
                'function luas(panjang: number, lebar: number): number {\n  return panjang * lebar;\n}\n\n' +
                'luas(3);        // Expected 2 arguments, but got 1.\n' +
                'luas(3, 4, 5);  // Expected 2 arguments, but got 3.',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A ? makes it optional', id: 'Tanda ? membuatnya opsional' },
              body: {
                en: 'A `?` says the argument may be left out — and then, inside the function, its type includes `undefined`, so the compiler makes you deal with that before you use it. You do not get to forget.',
                id: 'Tanda `?` menyatakan argumennya boleh dihilangkan — dan di dalam fungsinya, tipenya lalu mencakup `undefined`, jadi kompilernya memaksamu menanganinya sebelum kamu memakainya. Kamu tak diberi kesempatan lupa.',
              },
              code: {
                en:
                  'function sapa(nama: string, gelar?: string): string {\n' +
                  '  // gelar has type string | undefined here\n' +
                  '  return gelar ? `Halo, ${gelar} ${nama}` : `Halo, ${nama}`;\n' +
                  '}',
                id:
                  'function sapa(nama: string, gelar?: string): string {\n' +
                  '  // gelar bertipe string | undefined di sini\n' +
                  '  return gelar ? `Halo, ${gelar} ${nama}` : `Halo, ${nama}`;\n' +
                  '}',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A default is usually nicer', id: 'Nilai bawaan biasanya lebih enak' },
              body: {
                en: 'Give the parameter a default and it becomes optional to the caller *and* stays a plain `number` inside the function — no `undefined` to handle at all. Reach for `?` only when "not given" genuinely means something different from any value you could default to.',
                id: 'Beri parameternya nilai bawaan dan ia jadi opsional bagi pemanggil *sekaligus* tetap `number` biasa di dalam fungsinya — tak ada `undefined` yang perlu ditangani sama sekali. Pakai `?` hanya kalau "tidak diberikan" memang bermakna berbeda dari nilai bawaan mana pun.',
              },
              code:
                'function hargaAkhir(harga: number, diskon: number = 0): number {\n' +
                '  return harga - (harga * diskon) / 100;\n' +
                '}\n\n' +
                'hargaAkhir(100000);      // 100000\n' +
                'hargaAkhir(100000, 10);  // 90000',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Inside this function, what is the type of `catatan`?',
                id: 'Di dalam fungsi ini, apa tipe `catatan`?',
              },
              code: 'function simpan(isi: string, catatan?: string) { /* ... */ }',
              options: [
                { en: '`string | undefined`', id: '`string | undefined`' },
                { en: '`string`', id: '`string`' },
                { en: '`any`', id: '`any`' },
                { en: '`undefined`', id: '`undefined`' },
              ],
              answer: 0,
              explain: {
                en: 'That is exactly what the `?` bought you: the compiler will not let you use it as a string until you have checked.',
                id: 'Persis itulah yang dibeli tanda `?`: kompilernya tak akan membiarkanmu memakainya sebagai string sebelum kamu memeriksanya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a function with one required and one defaulted parameter.',
                id: 'Susun fungsi dengan satu parameter wajib dan satu berpilai bawaan.',
              },
              lines: [
                'function ulang(teks: string, kali: number = 2): string {',
                '  return teks.repeat(kali);',
                '}',
              ],
              explain: {
                en: 'A defaulted parameter has to come after the required ones — there would be no way to skip it otherwise.',
                id: 'Parameter bernilai bawaan harus ditulis setelah yang wajib — kalau tidak, tak ada cara melewatinya.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Write `hargaAkhir(harga, diskon)` returning the price after a percentage discount, rounded down with `Math.floor`. `diskon` may be left out, and then nothing is taken off.',
                id: 'Tulis `hargaAkhir(harga, diskon)` yang mengembalikan harga setelah potongan persen, dibulatkan ke bawah dengan `Math.floor`. `diskon` boleh tidak diberikan, dan kalau begitu tidak ada yang dipotong.',
              },
              starter: 'function hargaAkhir(harga: number, diskon: number): number {\n  return harga;\n}\n',
              tests: [
                {
                  name: { en: 'It takes the percentage off', id: 'Ia memotong persennya' },
                  check:
                    'assert(hargaAkhir(100000, 10) === 90000, "hargaAkhir(100000, 10) harus 90000, sekarang: " + hargaAkhir(100000, 10));\n' +
                    'assert(hargaAkhir(75000, 25) === 56250, "hargaAkhir(75000, 25) harus 56250, sekarang: " + hargaAkhir(75000, 25));\n' +
                    'assert(hargaAkhir(9999, 33) === 6699, "hargaAkhir(9999, 33) harus 6699 (dibulatkan ke bawah), sekarang: " + hargaAkhir(9999, 33));',
                },
                {
                  name: { en: 'Without a discount the price is unchanged', id: 'Tanpa diskon harganya tak berubah' },
                  check:
                    'assert(hargaAkhir(100000) === 100000, "hargaAkhir(100000) harus 100000, sekarang: " + hargaAkhir(100000));',
                },
                {
                  name: { en: 'One argument is enough', id: 'Satu argumen sudah cukup' },
                  probe: 'const uji1 = hargaAkhir(100000);',
                },
                {
                  name: { en: 'A price written as text is refused', id: 'Harga yang ditulis sebagai teks ditolak' },
                  probe: 'hargaAkhir("100000", 10);',
                  expectError: true,
                  errorCode: 2345,
                },
                {
                  name: { en: 'A third argument is refused', id: 'Argumen ketiga ditolak' },
                  probe: 'hargaAkhir(100000, 10, 5);',
                  expectError: true,
                  errorCode: 2554,
                },
              ],
              hints: [
                { en: 'The starter demands both arguments. Give the second one a default.', id: 'Kode awalnya mewajibkan kedua argumennya. Beri yang kedua nilai bawaan.' },
                { en: 'A discount of 0 takes nothing off, which is exactly the behaviour you want.', id: 'Diskon 0 tidak memotong apa pun, dan persis itulah perilaku yang kamu mau.' },
                { en: 'Math.floor(harga - (harga * diskon) / 100)', id: 'Math.floor(harga - (harga * diskon) / 100)' },
              ],
              solution:
                'function hargaAkhir(harga: number, diskon: number = 0): number {\n' +
                '  return Math.floor(harga - (harga * diskon) / 100);\n}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m1-s1-p1',
        runtime: 'ts',
        title: { en: 'The Health Check', id: 'Pemeriksaan Kesehatan' },
        brief: {
          en: 'Three small functions that have to agree with each other. Get the types right and they cannot be called wrongly.',
          id: 'Tiga fungsi kecil yang harus sepakat satu sama lain. Betulkan tipenya dan mereka tak bisa dipanggil dengan salah.',
        },
        requirements: [
          { en: '`bmi(berat, tinggi)` takes weight in kg and height in **cm**, and returns the BMI rounded to one decimal.', id: '`bmi(berat, tinggi)` menerima berat dalam kg dan tinggi dalam **cm**, lalu mengembalikan BMI dibulatkan satu desimal.' },
          { en: '`kategori(nilai)` returns `Kurus` below 18.5, `Normal` below 25, `Gemuk` below 30, and `Obesitas` otherwise.', id: '`kategori(nilai)` mengembalikan `Kurus` di bawah 18,5, `Normal` di bawah 25, `Gemuk` di bawah 30, dan `Obesitas` selain itu.' },
          { en: '`laporan(nama, berat, tinggi)` returns `"Ani: 20.8 (Normal)"`.', id: '`laporan(nama, berat, tinggi)` mengembalikan `"Ani: 20.8 (Normal)"`.' },
          { en: 'Annotate every parameter and every return type. Nothing may be `any`.', id: 'Beri keterangan pada tiap parameter dan tiap tipe kembalian. Tak boleh ada yang `any`.' },
        ],
        starter:
          'function bmi(berat, tinggi) {\n\n}\n\n' +
          'function kategori(nilai) {\n\n}\n\n' +
          'function laporan(nama, berat, tinggi) {\n\n}\n',
        tests: [
          {
            name: { en: 'BMI is right, to one decimal', id: 'BMI-nya benar, satu desimal' },
            check:
              'assert(bmi(60, 170) === 20.8, "bmi(60, 170) harus 20.8, sekarang: " + bmi(60, 170));\n' +
              'assert(bmi(45, 170) === 15.6, "bmi(45, 170) harus 15.6, sekarang: " + bmi(45, 170));\n' +
              'assert(bmi(80, 170) === 27.7, "bmi(80, 170) harus 27.7, sekarang: " + bmi(80, 170));\n' +
              'assert(bmi(95, 170) === 32.9, "bmi(95, 170) harus 32.9, sekarang: " + bmi(95, 170));',
          },
          {
            name: { en: 'Every band is named correctly', id: 'Tiap rentangnya dinamai dengan benar' },
            check:
              'const kasus = [[15, "Kurus"], [18.4, "Kurus"], [18.5, "Normal"], [24.9, "Normal"], [25, "Gemuk"], [29.9, "Gemuk"], [30, "Obesitas"], [40, "Obesitas"]];\n' +
              'for (const [n, harus] of kasus) {\n' +
              '  assert(kategori(n) === harus, "kategori(" + n + ") harus " + JSON.stringify(harus) + ", sekarang: " + JSON.stringify(kategori(n)));\n' +
              '}',
          },
          {
            name: { en: 'The report reads as one line', id: 'Laporannya terbaca sebagai satu baris' },
            check:
              'assert(laporan("Ani", 60, 170) === "Ani: 20.8 (Normal)", "laporan(\\"Ani\\", 60, 170) harus \\"Ani: 20.8 (Normal)\\", sekarang: " + JSON.stringify(laporan("Ani", 60, 170)));\n' +
              'assert(laporan("Budi", 95, 170) === "Budi: 32.9 (Obesitas)", "laporan(\\"Budi\\", 95, 170) harus \\"Budi: 32.9 (Obesitas)\\", sekarang: " + JSON.stringify(laporan("Budi", 95, 170)));',
          },
          {
            name: { en: 'The report is built from the other two', id: 'Laporannya dibangun dari dua fungsi lainnya' },
            check:
              'const semua = [["Ani", 60, 170], ["Budi", 95, 170], ["Citra", 45, 170], ["Dedi", 80, 170]];\n' +
              'for (const [n, b, t] of semua) {\n' +
              '  const harus = n + ": " + bmi(b, t) + " (" + kategori(bmi(b, t)) + ")";\n' +
              '  assert(laporan(n, b, t) === harus, "laporan(" + n + ", " + b + ", " + t + ") harus " + JSON.stringify(harus) + ", sekarang: " + JSON.stringify(laporan(n, b, t)));\n' +
              '}',
          },
          {
            name: { en: 'bmi refuses a height written as text', id: 'bmi menolak tinggi yang ditulis sebagai teks' },
            probe: 'bmi(60, "170");',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'bmi is declared to return a number', id: 'bmi dinyatakan mengembalikan angka' },
            probe: 'const uji1: string = bmi(60, 170);',
            expectError: true,
            errorCode: 2322,
          },
          {
            name: { en: 'kategori is declared to return a string', id: 'kategori dinyatakan mengembalikan string' },
            probe: 'const uji2: number = kategori(20);',
            expectError: true,
            errorCode: 2322,
          },
          {
            name: { en: 'laporan wants a name, not a number', id: 'laporan meminta nama, bukan angka' },
            probe: 'laporan(1, 60, 170);',
            expectError: true,
            errorCode: 2345,
          },
          {
            name: { en: 'Called properly, everything is accepted', id: 'Dipanggil dengan benar, semuanya diterima' },
            probe: 'const uji3: string = laporan("Ani", 60, 170);\nconst uji4: number = bmi(60, 170);\nconst uji5: string = kategori(20);',
          },
        ],
        hints: [
          { en: 'The starter has no annotations at all, so it does not compile. Read the errors — they name the parameter.', id: 'Kode awalnya sama sekali tak punya keterangan tipe, jadi ia tak bisa dikompilasi. Baca galatnya — ia menyebut parameternya.' },
          { en: 'Height in cm becomes metres: tinggi / 100.', id: 'Tinggi dalam cm menjadi meter: tinggi / 100.' },
          { en: 'One decimal place: Math.round(x * 10) / 10.', id: 'Satu angka desimal: Math.round(x * 10) / 10.' },
          { en: 'The bands are open at the bottom and closed at the top: below 18.5 is Kurus, and 18.5 itself is already Normal.', id: 'Rentangnya terbuka di bawah dan tertutup di atas: di bawah 18,5 itu Kurus, dan 18,5 sendiri sudah Normal.' },
        ],
        solution:
          'function bmi(berat: number, tinggi: number): number {\n' +
          '  const meter = tinggi / 100;\n' +
          '  return Math.round((berat / (meter * meter)) * 10) / 10;\n' +
          '}\n\n' +
          'function kategori(nilai: number): string {\n' +
          '  if (nilai < 18.5) return "Kurus";\n' +
          '  if (nilai < 25) return "Normal";\n' +
          '  if (nilai < 30) return "Gemuk";\n' +
          '  return "Obesitas";\n' +
          '}\n\n' +
          'function laporan(nama: string, berat: number, tinggi: number): string {\n' +
          '  const nilai = bmi(berat, tinggi);\n' +
          '  return `${nama}: ${nilai} (${kategori(nilai)})`;\n' +
          '}',
        xp: 50,
      },
    },
    {
      id: 'ts-m1-s2',
      title: { en: 'Shapes', id: 'Bentuk' },
      summary: {
        en: 'Describe an object, an array, and a pair that is not an array.',
        id: 'Menjelaskan sebuah objek, sebuah array, dan sepasang nilai yang bukan array.',
      },
      lessons: [
        {
          id: 'ts-m1-s2-l1',
          title: { en: 'The shape of an object', id: 'Bentuk sebuah objek' },
          goal: { en: 'Write an interface and hold objects to it.', id: 'Menulis interface dan menagih objek untuk memenuhinya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An interface names a shape', id: 'Interface memberi nama pada sebuah bentuk' },
              body: {
                en: 'An `interface` says which properties an object has and what type each one is. It describes a shape; it creates nothing at runtime. Written once, it can be used everywhere the shape is meant, and the name becomes the vocabulary of your program.',
                id: 'Sebuah `interface` menyatakan properti apa saja yang dimiliki sebuah objek dan apa tipe masing-masing. Ia menjelaskan sebuah bentuk; ia tidak membuat apa pun saat program berjalan. Ditulis sekali, ia bisa dipakai di mana pun bentuk itu dimaksudkan, dan namanya menjadi kosakata programmu.',
              },
              code:
                'interface Buku {\n' +
                '  judul: string;\n' +
                '  penulis: string;\n' +
                '  tahun: number;\n' +
                '}\n\n' +
                'const b: Buku = { judul: "Bumi Manusia", penulis: "Pramoedya", tahun: 1980 };',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Missing is an error, extra is an error', id: 'Kurang itu galat, lebih juga galat' },
              body: {
                en: 'Leave a property out and you get *missing property*. Add one that was never declared and you get an *excess property* error — TypeScript takes an object literal you wrote right there as a statement of intent, and assumes the extra key is a typo, which it very often is.',
                id: 'Hilangkan satu properti dan kamu mendapat *properti yang hilang*. Tambahkan satu yang tak pernah dideklarasikan dan kamu mendapat galat *properti berlebih* — TypeScript menganggap objek literal yang baru kamu tulis di situ sebagai pernyataan niat, dan mengira kunci tambahannya salah ketik, dan itu memang sangat sering benar.',
              },
              code:
                'const a: Buku = { judul: "x", penulis: "y" };\n' +
                "// Property 'tahun' is missing\n\n" +
                'const c: Buku = { judul: "x", penulis: "y", tahun: 1, judl: "z" };\n' +
                "// Object literal may only specify known properties",
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Optional and readonly', id: 'Opsional dan readonly' },
              body: {
                en: 'A `?` marks a property that may be absent — and reading it gives you `string | undefined`, so the compiler makes you check. `readonly` marks one that may be read but never written after the object is built.',
                id: 'Tanda `?` menandai properti yang boleh tidak ada — dan membacanya memberimu `string | undefined`, jadi kompilernya memaksamu memeriksa. `readonly` menandai properti yang boleh dibaca tetapi tak pernah ditulis setelah objeknya dibuat.',
              },
              code:
                'interface Buku {\n' +
                '  readonly id: number;\n' +
                '  judul: string;\n' +
                '  terjual?: number;\n' +
                '}\n\n' +
                'const b: Buku = { id: 1, judul: "x" };\n' +
                "b.id = 2;        // Cannot assign to 'id' because it is a read-only property.",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With `terjual?: number`, what does `b.terjual + 1` do?',
                id: 'Dengan `terjual?: number`, apa yang terjadi pada `b.terjual + 1`?',
              },
              options: [
                { en: "It is an error — `b.terjual` might be undefined", id: 'Itu galat — `b.terjual` mungkin undefined' },
                { en: 'It gives 1 when the property is absent', id: 'Ia menghasilkan 1 ketika propertinya tak ada' },
                { en: 'It gives NaN', id: 'Ia menghasilkan NaN' },
                { en: 'It is fine — the ? only affects writing', id: 'Tidak apa-apa — tanda ? hanya memengaruhi penulisan' },
              ],
              answer: 0,
              explain: {
                en: 'It would be NaN at runtime, which is exactly the bug the compiler is stopping before it happens.',
                id: 'Ia akan jadi NaN saat dijalankan, dan persis itulah kutu yang dicegah kompilernya sebelum terjadi.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the interface: a required name, and an optional note.',
                id: 'Lengkapi interface-nya: nama yang wajib, dan catatan yang opsional.',
              },
              template: 'interface Anggota {\n  nama: ___;\n  catatan___: string;\n}',
              blanks: ['string', '?'],
              explain: {
                en: 'The ? goes on the property name, before the colon.',
                id: 'Tanda ? ditulis pada nama propertinya, sebelum titik dua.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `interface Buku` with `judul` and `penulis` as strings, `tahun` as a number, and an optional `terjual` number. Then write `ringkas(b: Buku): string` returning `"judul — penulis (tahun)"`.',
                id: 'Deklarasikan `interface Buku` dengan `judul` dan `penulis` bertipe string, `tahun` bertipe number, dan `terjual` opsional bertipe number. Lalu tulis `ringkas(b: Buku): string` yang mengembalikan `"judul — penulis (tahun)"`.',
              },
              starter:
                'interface Buku {\n\n}\n\n' +
                'function ringkas(b: Buku): string {\n  return "";\n}\n',
              tests: [
                {
                  name: { en: 'It summarises a book', id: 'Ia meringkas sebuah buku' },
                  check:
                    'const b = { judul: "Bumi Manusia", penulis: "Pramoedya", tahun: 1980 };\n' +
                    'assert(ringkas(b) === "Bumi Manusia — Pramoedya (1980)", "ringkas harus \\"Bumi Manusia — Pramoedya (1980)\\", sekarang: " + JSON.stringify(ringkas(b)));',
                },
                {
                  name: { en: 'A complete book is accepted', id: 'Buku yang lengkap diterima' },
                  probe: 'const uji1: Buku = { judul: "a", penulis: "b", tahun: 1, terjual: 5 };',
                },
                {
                  name: { en: 'terjual may be left out', id: 'terjual boleh tidak ada' },
                  probe: 'const uji2: Buku = { judul: "a", penulis: "b", tahun: 1 };',
                },
                {
                  name: { en: 'A missing tahun is refused', id: 'tahun yang hilang ditolak' },
                  probe: 'const uji3: Buku = { judul: "a", penulis: "b" };',
                  expectError: true,
                  errorCode: 2741,
                },
                {
                  name: { en: 'A year written as text is refused', id: 'Tahun yang ditulis sebagai teks ditolak' },
                  probe: 'const uji4: Buku = { judul: "a", penulis: "b", tahun: "1980" };',
                  expectError: true,
                  errorCode: 2322,
                },
                {
                  name: { en: 'A misspelt property is refused', id: 'Properti yang salah ketik ditolak' },
                  probe: 'const uji5: Buku = { judul: "a", penulis: "b", tahun: 1, terjal: 5 };',
                  expectError: true,
                  errorCode: 2561,
                },
              ],
              hints: [
                { en: 'Each property on its own line: `nama: tipe;`.', id: 'Tiap properti di barisnya sendiri: `nama: tipe;`.' },
                { en: 'Only `terjual` gets the question mark.', id: 'Hanya `terjual` yang mendapat tanda tanya.' },
                { en: 'The separator in the summary is an em dash with spaces: `${b.judul} — ${b.penulis} (${b.tahun})`.', id: 'Pemisah di ringkasannya adalah tanda pisah dengan spasi: `${b.judul} — ${b.penulis} (${b.tahun})`.' },
              ],
              solution:
                'interface Buku {\n' +
                '  judul: string;\n' +
                '  penulis: string;\n' +
                '  tahun: number;\n' +
                '  terjual?: number;\n' +
                '}\n\n' +
                'function ringkas(b: Buku): string {\n' +
                '  return `${b.judul} — ${b.penulis} (${b.tahun})`;\n' +
                '}',
            },
          ],
        },
        {
          id: 'ts-m1-s2-l2',
          title: { en: 'Lists, and pairs that are not lists', id: 'Daftar, dan pasangan yang bukan daftar' },
          goal: { en: 'Type an array, and a fixed-length tuple.', id: 'Memberi tipe pada array, dan pada tuple berpanjang tetap.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An array of one type', id: 'Array berisi satu tipe' },
              body: {
                en: '`number[]` is an array whose every element is a number — any length, all the same kind. It is written `Array<number>` too; the two mean exactly the same thing. Reading an element gives you a `number`, so the methods you expect are there and the ones you do not are refused.',
                id: '`number[]` adalah array yang setiap elemennya angka — panjangnya bebas, jenisnya sama semua. Ia juga ditulis `Array<number>`; keduanya bermakna persis sama. Membaca satu elemen memberimu `number`, jadi method yang kamu harapkan ada dan yang tidak kamu harapkan ditolak.',
              },
              code: {
                en:
                  'const nilai: number[] = [80, 92, 75];\n' +
                  'const nama: string[] = ["Ani", "Budi"];\n\n' +
                  'nilai.push("100");   // rejected\n' +
                  'nilai[0].toFixed(1); // fine: the element is a number',
                id:
                  'const nilai: number[] = [80, 92, 75];\n' +
                  'const nama: string[] = ["Ani", "Budi"];\n\n' +
                  'nilai.push("100");   // ditolak\n' +
                  'nilai[0].toFixed(1); // baik: elemennya number',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A tuple has a length and an order', id: 'Tuple punya panjang dan urutan' },
              body: {
                en: '`[number, number]` is a **tuple**: exactly two elements, each a number. Unlike an array it has a fixed length, and each position may have its own type. It is how you say "a coordinate" or "a key and its value" without inventing an object for it.',
                id: '`[number, number]` adalah **tuple**: tepat dua elemen, masing-masing angka. Berbeda dari array, panjangnya tetap, dan tiap posisi boleh punya tipenya sendiri. Inilah cara menyatakan "sebuah koordinat" atau "sebuah kunci dan nilainya" tanpa mengarang objek untuknya.',
              },
              code: {
                en:
                  'type Titik = [number, number];\n' +
                  'const asal: Titik = [0, 0];\n\n' +
                  'const salah: Titik = [0, 0, 0];   // the length does not match\n\n' +
                  'type Entri = [string, number];    // each position has its own type\n' +
                  'const e: Entri = ["stok", 12];',
                id:
                  'type Titik = [number, number];\n' +
                  'const asal: Titik = [0, 0];\n\n' +
                  'const salah: Titik = [0, 0, 0];   // panjangnya tidak cocok\n\n' +
                  'type Entri = [string, number];    // tiap posisi punya tipenya sendiri\n' +
                  'const e: Entri = ["stok", 12];',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'type gives any type a name', id: 'type memberi nama pada tipe apa pun' },
              body: {
                en: '`type X = ...` is an alias: a name for a type you would otherwise write out. `interface` only names object shapes; `type` names anything at all — a tuple, an array, a union, a primitive. Use whichever reads better where you are.',
                id: '`type X = ...` adalah alias: nama untuk tipe yang kalau tidak begitu harus kamu tulis panjang-panjang. `interface` hanya menamai bentuk objek; `type` menamai apa saja — tuple, array, union, tipe dasar. Pakai yang mana pun yang lebih enak dibaca di tempatmu.',
              },
              code:
                'type Titik = [number, number];\n' +
                'type Nilai = number[];\n' +
                'type Nama = string;',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is refused?',
                id: 'Mana di antara ini yang ditolak?',
              },
              code: 'type Titik = [number, number];\n\nconst a: Titik = [1, 2];\nconst b: Titik = [1, 2, 3];\nconst c: number[] = [1, 2, 3];',
              options: [
                { en: 'Only `b`', id: 'Hanya `b`' },
                { en: '`b` and `c`', id: '`b` dan `c`' },
                { en: 'None of them', id: 'Tidak ada' },
                { en: 'Only `c`', id: 'Hanya `c`' },
              ],
              answer: 0,
              explain: {
                en: 'A tuple pins the length; an array does not. Three numbers are fine as a `number[]` and wrong as a two-element tuple.',
                id: 'Tuple mematok panjangnya; array tidak. Tiga angka baik-baik saja sebagai `number[]` dan salah sebagai tuple dua elemen.',
              },
            },
            {
              kind: 'ts',
              id: 't1',
              prompt: {
                en: 'Declare `type Titik = [number, number]`, then write `jarak(a: Titik, b: Titik): number` for the straight-line distance, and `panjangJalur(titik: Titik[]): number` for the total length of a path through the points in order.',
                id: 'Deklarasikan `type Titik = [number, number]`, lalu tulis `jarak(a: Titik, b: Titik): number` untuk jarak garis lurusnya, dan `panjangJalur(titik: Titik[]): number` untuk panjang total jalur yang melewati titik-titiknya secara berurutan.',
              },
              starter:
                'type Titik = number[];\n\n' +
                'function jarak(a: Titik, b: Titik): number {\n  return 0;\n}\n\n' +
                'function panjangJalur(titik: Titik[]): number {\n  return 0;\n}\n',
              tests: [
                {
                  name: { en: 'The distance is right', id: 'Jaraknya benar' },
                  check:
                    'assert(jarak([0, 0], [3, 4]) === 5, "jarak([0,0],[3,4]) harus 5, sekarang: " + jarak([0, 0], [3, 4]));\n' +
                    'assert(jarak([1, 1], [1, 1]) === 0, "jarak titik yang sama harus 0, sekarang: " + jarak([1, 1], [1, 1]));\n' +
                    'assert(jarak([2, 0], [0, 0]) === 2, "jarak([2,0],[0,0]) harus 2, sekarang: " + jarak([2, 0], [0, 0]));',
                },
                {
                  name: { en: 'The path adds up its legs', id: 'Jalurnya menjumlahkan ruas-ruasnya' },
                  check:
                    'assert(panjangJalur([[0, 0], [3, 4], [3, 0]]) === 9, "harus 9, sekarang: " + panjangJalur([[0, 0], [3, 4], [3, 0]]));\n' +
                    'assert(panjangJalur([[0, 0]]) === 0, "satu titik saja harus 0, sekarang: " + panjangJalur([[0, 0]]));\n' +
                    'assert(panjangJalur([]) === 0, "jalur kosong harus 0, sekarang: " + panjangJalur([]));',
                },
                {
                  name: { en: 'A point is exactly two numbers', id: 'Satu titik tepat dua angka' },
                  probe: 'const uji1: Titik = [1, 2];',
                },
                {
                  name: { en: 'Three numbers are not a point', id: 'Tiga angka bukan sebuah titik' },
                  probe: 'const uji2: Titik = [1, 2, 3];',
                  expectError: true,
                },
                {
                  name: { en: 'One number is not a point either', id: 'Satu angka juga bukan sebuah titik' },
                  probe: 'const uji3: Titik = [1];',
                  expectError: true,
                },
                {
                  name: { en: 'A path is a list of points', id: 'Jalur adalah daftar titik' },
                  probe: 'const uji4 = panjangJalur([[0, 0], [1, 1]]);',
                },
                {
                  name: { en: 'A list of numbers is not a path', id: 'Daftar angka bukan sebuah jalur' },
                  probe: 'panjangJalur([0, 0, 1, 1]);',
                  expectError: true,
                  errorCode: 2322,
                },
              ],
              hints: [
                { en: 'The starter calls a point `number[]`, which is why any length gets through.', id: 'Kode awalnya menyebut titik sebagai `number[]`, dan itulah sebabnya panjang berapa pun lolos.' },
                { en: 'Math.hypot(dx, dy) is the straight-line distance in one call.', id: 'Math.hypot(dx, dy) adalah jarak garis lurusnya dalam satu panggilan.' },
                { en: 'The path starts at index 1 and adds the distance back to the point before it.', id: 'Jalurnya mulai dari indeks 1 dan menambahkan jarak ke titik sebelumnya.' },
              ],
              solution:
                'type Titik = [number, number];\n\n' +
                'function jarak(a: Titik, b: Titik): number {\n' +
                '  return Math.hypot(a[0] - b[0], a[1] - b[1]);\n' +
                '}\n\n' +
                'function panjangJalur(titik: Titik[]): number {\n' +
                '  let total = 0;\n' +
                '  for (let i = 1; i < titik.length; i++) {\n' +
                '    total += jarak(titik[i - 1], titik[i]);\n' +
                '  }\n' +
                '  return total;\n' +
                '}',
            },
          ],
        },
      ],
      project: {
        id: 'ts-m1-s2-p1',
        runtime: 'ts',
        title: { en: 'The Stock List', id: 'Daftar Stok' },
        brief: {
          en: 'A shape for a product, and three functions over a list of them. Once the shape is right, the functions almost write themselves.',
          id: 'Sebuah bentuk untuk produk, dan tiga fungsi yang bekerja pada daftarnya. Begitu bentuknya benar, fungsinya nyaris menulis dirinya sendiri.',
        },
        requirements: [
          { en: '`interface Produk` has `nama` (string), `harga` (number), `stok` (number), and an optional `diskon` (number, a percentage).', id: '`interface Produk` punya `nama` (string), `harga` (number), `stok` (number), dan `diskon` opsional (number, berupa persen).' },
          { en: '`hargaJual(p)` returns the price after the discount, rounded down. No discount means the full price.', id: '`hargaJual(p)` mengembalikan harga setelah diskon, dibulatkan ke bawah. Tanpa diskon berarti harga penuh.' },
          { en: '`tersedia(daftar)` returns only the products with stock above zero, in the order given.', id: '`tersedia(daftar)` mengembalikan hanya produk yang stoknya di atas nol, dalam urutan yang diberikan.' },
          { en: '`totalNilai(daftar)` returns the sum of `hargaJual` × `stok` over the whole list.', id: '`totalNilai(daftar)` mengembalikan jumlah `hargaJual` × `stok` untuk seluruh daftarnya.' },
          { en: 'Annotate everything. Nothing may be `any`.', id: 'Beri keterangan pada semuanya. Tak boleh ada yang `any`.' },
        ],
        starter:
          'interface Produk {\n\n}\n\n' +
          'function hargaJual(p: Produk): number {\n\n}\n\n' +
          'function tersedia(daftar: Produk[]): Produk[] {\n\n}\n\n' +
          'function totalNilai(daftar: Produk[]): number {\n\n}\n',
        tests: [
          {
            name: { en: 'The discount comes off, rounded down', id: 'Diskonnya terpotong, dibulatkan ke bawah' },
            check:
              'assert(hargaJual({ nama: "a", harga: 100000, stok: 1, diskon: 10 }) === 90000, "diskon 10% dari 100000 harus 90000");\n' +
              'assert(hargaJual({ nama: "a", harga: 9999, stok: 1, diskon: 33 }) === 6699, "harus dibulatkan ke bawah, sekarang: " + hargaJual({ nama: "a", harga: 9999, stok: 1, diskon: 33 }));',
          },
          {
            name: { en: 'No discount means the full price', id: 'Tanpa diskon berarti harga penuh' },
            check:
              'assert(hargaJual({ nama: "a", harga: 100000, stok: 1 }) === 100000, "tanpa diskon harus 100000, sekarang: " + hargaJual({ nama: "a", harga: 100000, stok: 1 }));',
          },
          {
            name: { en: 'Only what is in stock comes back', id: 'Hanya yang tersedia yang kembali' },
            check:
              'const daftar = [\n' +
              '  { nama: "Pensil", harga: 3000, stok: 40 },\n' +
              '  { nama: "Spidol", harga: 12000, stok: 0 },\n' +
              '  { nama: "Map", harga: 4000, stok: 25 },\n' +
              '];\n' +
              'const ada = tersedia(daftar);\n' +
              'assert(ada.length === 2, "harus 2 produk, sekarang: " + ada.length);\n' +
              'assert(ada[0].nama === "Pensil" && ada[1].nama === "Map", "urutannya harus dipertahankan, sekarang: " + ada.map((p) => p.nama).join(", "));\n' +
              'assert(daftar.length === 3, "daftar aslinya tidak boleh diubah, sekarang panjangnya: " + daftar.length);',
          },
          {
            name: { en: 'The total counts every line', id: 'Totalnya menghitung tiap barisnya' },
            check:
              'const daftar = [\n' +
              '  { nama: "Pensil", harga: 3000, stok: 40 },\n' +
              '  { nama: "Buku", harga: 5000, stok: 10, diskon: 20 },\n' +
              '  { nama: "Spidol", harga: 12000, stok: 0 },\n' +
              '];\n' +
              'assert(totalNilai(daftar) === 160000, "40*3000 + 10*4000 + 0 = 160000, sekarang: " + totalNilai(daftar));\n' +
              'assert(totalNilai([]) === 0, "daftar kosong harus 0, sekarang: " + totalNilai([]));',
          },
          {
            name: { en: 'A complete product is accepted', id: 'Produk yang lengkap diterima' },
            probe: 'const uji1: Produk = { nama: "a", harga: 1, stok: 2, diskon: 3 };',
          },
          {
            name: { en: 'diskon may be left out', id: 'diskon boleh tidak ada' },
            probe: 'const uji2: Produk = { nama: "a", harga: 1, stok: 2 };',
          },
          {
            name: { en: 'A missing stok is refused', id: 'stok yang hilang ditolak' },
            probe: 'const uji3: Produk = { nama: "a", harga: 1 };',
            expectError: true,
            errorCode: 2741,
          },
          {
            name: { en: 'A price written as text is refused', id: 'Harga yang ditulis sebagai teks ditolak' },
            probe: 'const uji4: Produk = { nama: "a", harga: "1", stok: 2 };',
            expectError: true,
            errorCode: 2322,
          },
          {
            name: { en: 'tersedia gives back products, not names', id: 'tersedia mengembalikan produk, bukan nama' },
            probe: 'const uji5: string[] = tersedia([{ nama: "a", harga: 1, stok: 2 }]);',
            expectError: true,
            errorCode: 2322,
          },
          {
            name: { en: 'totalNilai wants a list, not one product', id: 'totalNilai meminta daftar, bukan satu produk' },
            probe: 'totalNilai({ nama: "a", harga: 1, stok: 2 });',
            expectError: true,
            errorCode: 2353,
          },
        ],
        hints: [
          { en: 'Write the interface first. Every function below already says it takes a Produk, so the shape is the only thing missing.', id: 'Tulis interface-nya lebih dulu. Tiap fungsi di bawahnya sudah menyatakan menerima Produk, jadi bentuknya satu-satunya yang kurang.' },
          { en: 'An optional discount is `undefined` when absent, so give it a floor: `p.diskon ?? 0`.', id: 'Diskon opsional bernilai `undefined` saat tak ada, jadi beri ia lantai: `p.diskon ?? 0`.' },
          { en: '`filter` returns a new array — the original list must come back unchanged.', id: '`filter` mengembalikan array baru — daftar aslinya harus kembali tanpa berubah.' },
          { en: 'The total is built from hargaJual, not from harga: the discount has to be in it.', id: 'Totalnya dibangun dari hargaJual, bukan dari harga: diskonnya harus ikut di dalamnya.' },
        ],
        solution:
          'interface Produk {\n' +
          '  nama: string;\n' +
          '  harga: number;\n' +
          '  stok: number;\n' +
          '  diskon?: number;\n' +
          '}\n\n' +
          'function hargaJual(p: Produk): number {\n' +
          '  const diskon = p.diskon ?? 0;\n' +
          '  return Math.floor(p.harga - (p.harga * diskon) / 100);\n' +
          '}\n\n' +
          'function tersedia(daftar: Produk[]): Produk[] {\n' +
          '  return daftar.filter((p) => p.stok > 0);\n' +
          '}\n\n' +
          'function totalNilai(daftar: Produk[]): number {\n' +
          '  return daftar.reduce((jumlah, p) => jumlah + hargaJual(p) * p.stok, 0);\n' +
          '}',
        xp: 50,
      },
    },
  ],
}
