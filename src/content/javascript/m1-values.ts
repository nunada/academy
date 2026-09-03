import type { Module } from '../types'

/** Module 1 — values, then decisions and repetition.
 *
 *  Every `web` step here is `js: true` with no `html`: the exercise is pure
 *  logic, checked through `out()` and by naming the learner's own variables.
 *  The DOM arrives in module 3, once there is something worth putting on a page. */
export const module1: Module = {
  id: 'js-m1',
  title: { en: 'Values and Logic', id: 'Nilai dan Logika' },
  summary: {
    en: 'Store values, combine them, and let the program choose and repeat.',
    id: 'Menyimpan nilai, menggabungkannya, dan membiarkan program memilih serta mengulang.',
  },
  submodules: [
    /* --------------------------------------------------- 1.1 values & operators */
    {
      id: 'js-m1-s1',
      title: { en: 'Values and Variables', id: 'Nilai dan Variabel' },
      summary: {
        en: 'Print something, name it, and do arithmetic with it.',
        id: 'Menampilkan sesuatu, menamainya, dan menghitung dengannya.',
      },
      lessons: [
        {
          id: 'js-m1-s1-l1',
          title: { en: 'console.log and names', id: 'console.log dan nama' },
          goal: { en: 'Show a value and store one.', id: 'Menampilkan sebuah nilai dan menyimpannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'console.log is your window in', id: 'console.log adalah jendelamu ke dalam' },
              body: {
                en: 'JavaScript runs inside the page, where you cannot see it. `console.log()` is how you look: it prints a value to the browser console — and in these exercises, to the panel beside your editor.',
                id: 'JavaScript berjalan di dalam halaman, tempat yang tak terlihat. `console.log()` adalah caramu mengintip: ia menampilkan sebuah nilai ke konsol peramban — dan di latihan ini, ke panel di sebelah editormu.',
              },
              code: { en: 'console.log("Hello, world!");\nconsole.log(2 + 3);', id: 'console.log("Halo, dunia!");\nconsole.log(2 + 3);' },
              output: { en: 'Hello, world!\n5', id: 'Halo, dunia!\n5' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'const unless it has to change', id: 'const kecuali memang harus berubah' },
              body: {
                en: 'Both `const` and `let` name a value. Reach for `const` first — it says "this will not be reassigned", and the moment you try, JavaScript stops you. Use `let` only when the value genuinely changes. Ignore `var`; it belongs to an older JavaScript.',
                id: 'Baik `const` maupun `let` menamai sebuah nilai. Utamakan `const` — ia menyatakan "ini tidak akan ditetapkan ulang", dan begitu kamu mencoba, JavaScript menghentikanmu. Pakai `let` hanya bila nilainya memang berubah. Abaikan `var`; ia milik JavaScript yang lebih lama.',
              },
              code: { en: 'const name = "Ani";\nlet score = 0;\n\nscore = 10;\nconsole.log(name, score);', id: 'const nama = "Ani";\nlet skor = 0;\n\nskor = 10;\nconsole.log(nama, skor);' },
              output: { en: 'Ani 10', id: 'Ani 10' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The types you will meet first', id: 'Tipe yang pertama kamu temui' },
              body: {
                en: '`string` for text, `number` for any number — JavaScript makes no distinction between whole and decimal — and `boolean` for `true` / `false`. `typeof` tells you which one you have.',
                id: '`string` untuk teks, `number` untuk angka apa pun — JavaScript tidak membedakan bulat dan desimal — dan `boolean` untuk `true` / `false`. `typeof` memberitahumu yang mana yang sedang kamu pegang.',
              },
              code: { en: 'console.log(typeof "Ani");\nconsole.log(typeof 17);\nconsole.log(typeof 1.5);\nconsole.log(typeof true);', id: 'console.log(typeof "Ani");\nconsole.log(typeof 17);\nconsole.log(typeof 1.5);\nconsole.log(typeof true);' },
              output: { en: 'string\nnumber\nnumber\nboolean', id: 'string\nnumber\nnumber\nboolean' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What happens here?', id: 'Apa yang terjadi di sini?' },
              code: { en: 'const city = "Surabaya";\ncity = "Malang";', id: 'const kota = "Surabaya";\nkota = "Malang";' },
              options: [
                { en: 'TypeError — a const cannot be reassigned', id: 'TypeError — const tidak bisa ditetapkan ulang' },
                { en: 'city becomes "Malang"', id: 'kota menjadi "Malang"' },
                { en: 'city stays "Surabaya", silently', id: 'kota tetap "Surabaya", tanpa pesan' },
                { en: 'Nothing — both lines are fine', id: 'Tidak apa-apa — kedua baris benar' },
              ],
              answer: 0,
              explain: {
                en: 'That error is the point of const: it catches an accidental reassignment while you are writing, not in production.',
                id: 'Error itulah gunanya const: ia menangkap penetapan ulang yang tak disengaja saat kamu menulis, bukan nanti saat sudah rilis.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Name a value that will never change, then show it.',
                id: 'Namai sebuah nilai yang tak akan pernah berubah, lalu tampilkan.',
              },
              template: '___ pi = 3.14;\nconsole.___(pi);',
              blanks: ['const', 'log'],
              explain: {
                en: 'const for a fixed value; console.log to see it.',
                id: 'const untuk nilai tetap; console.log untuk melihatnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Create `name` holding `"Budi"` and `age` holding `20`, then log them on two separate lines.',
                id: 'Buat `nama` berisi `"Budi"` dan `umur` berisi `20`, lalu tampilkan keduanya dalam dua baris terpisah.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'Both names hold the right values', id: 'Both names hold the right values' },
                    check:
                      'assert(typeof name !== "undefined", "there is no variable named name yet");\nassert(name === "Budi", "name must be \\"Budi\\", currently: " + JSON.stringify(name));\nassert(age === 20, "age must be the number 20, currently: " + JSON.stringify(age));',
                  },
                  {
                    name: { en: 'age is a number, not text', id: 'age is a number, not text' },
                    check: 'assert(typeof age === "number", "age must be number, currently: " + typeof age);',
                  },
                  {
                    name: { en: 'Two lines are logged', id: 'Two lines are logged' },
                    check:
                      'assert(logs().length === 2, "there must be exactly two console.log, currently: " + logs().length);\nassert(out() === "Budi\\n20", "the output must be Budi then 20, currently: " + JSON.stringify(out()));',
                  },
                ],
                id: [
                  {
                    name: { en: 'Both names hold the right values', id: 'Kedua nama berisi nilai yang benar' },
                    check:
                      'assert(typeof nama !== "undefined", "belum ada variabel bernama nama");\nassert(nama === "Budi", "nama harus \\"Budi\\", sekarang: " + JSON.stringify(nama));\nassert(umur === 20, "umur harus angka 20, sekarang: " + JSON.stringify(umur));',
                  },
                  {
                    name: { en: 'umur is a number, not text', id: 'umur berupa angka, bukan teks' },
                    check: 'assert(typeof umur === "number", "umur harus number, sekarang: " + typeof umur);',
                  },
                  {
                    name: { en: 'Two lines are logged', id: 'Dua baris ditampilkan' },
                    check:
                      'assert(logs().length === 2, "harus tepat dua console.log, sekarang: " + logs().length);\nassert(out() === "Budi\\n20", "keluarannya harus Budi lalu 20, sekarang: " + JSON.stringify(out()));',
                  },
                ],
              },
              hints: [
                { en: 'Neither value changes, so both are const.', id: 'Kedua nilai tidak berubah, jadi keduanya const.' },
                { en: 'A number needs no quotes — quotes would make it a string.', id: 'Angka tidak butuh tanda kutip — kutip akan menjadikannya string.' },
                { en: 'Two separate console.log calls, one per line.', id: 'Dua pemanggilan console.log terpisah, satu per baris.' },
              ],
              solution: {
                en: 'const name = "Budi";\nconst age = 20;\n\nconsole.log(name);\nconsole.log(age);',
                id: 'const nama = "Budi";\nconst umur = 20;\n\nconsole.log(nama);\nconsole.log(umur);',
              },
            },
          ],
        },
        {
          id: 'js-m1-s1-l2',
          title: { en: 'Arithmetic and text', id: 'Hitungan dan teks' },
          goal: { en: 'Combine values, and compare them safely.', id: 'Menggabungkan nilai, dan membandingkannya dengan aman.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Template literals beat gluing', id: 'Template literal mengalahkan sambung-menyambung' },
              body: {
                en: 'Backticks let you drop a value straight into text with `${...}`. Compare it to joining pieces with `+` and the reason is obvious the moment there is more than one value.',
                id: 'Tanda petik-balik membuatmu bisa menyisipkan nilai langsung ke teks dengan `${...}`. Bandingkan dengan menyambung potongan memakai `+`, dan alasannya langsung jelas begitu nilainya lebih dari satu.',
              },
              code: {
                en: 'const name = "Ani";\nconst score = 88;\n\nconsole.log("Name: " + name + ", score: " + score);\nconsole.log(`Name: ${name}, score: ${score}`);',
                id: 'const nama = "Ani";\nconst nilai = 88;\n\nconsole.log("Nama: " + nama + ", nilai: " + nilai);\nconsole.log(`Nama: ${nama}, nilai: ${nilai}`);',
              },
              output: { en: 'Name: Ani, score: 88\nName: Ani, score: 88', id: 'Nama: Ani, nilai: 88\nNama: Ani, nilai: 88' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The + that means two things', id: 'Tanda + yang bermakna dua hal' },
              body: {
                en: 'With two numbers `+` adds. With a string on either side it joins instead — so `"3" + 4` is `"34"`, not `7`. Every other operator (`-`, `*`, `/`) converts to number first, which is why `"3" - 1` is `2`. Confusing, and worth knowing about rather than relying on.',
                id: 'Dengan dua angka, `+` menjumlahkan. Dengan string di salah satu sisinya, ia justru menyambung — jadi `"3" + 4` adalah `"34"`, bukan `7`. Operator lain (`-`, `*`, `/`) mengubah ke angka lebih dulu, itu sebabnya `"3" - 1` bernilai `2`. Membingungkan, dan lebih baik diketahui daripada diandalkan.',
              },
              code: { en: 'console.log(3 + 4);\nconsole.log("3" + 4);\nconsole.log("3" - 1);\nconsole.log(Number("3") + 4);', id: 'console.log(3 + 4);\nconsole.log("3" + 4);\nconsole.log("3" - 1);\nconsole.log(Number("3") + 4);' },
              output: { en: '7\n34\n2\n7', id: '7\n34\n2\n7' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Always ===, never ==', id: 'Selalu ===, jangan ==' },
              body: {
                en: '`==` converts before comparing, so `0 == "0"` is `true` and `0 == []` is too. `===` compares value **and** type, with no conversion. There is no good reason to reach for `==` — use `===` and `!==` everywhere.',
                id: '`==` mengonversi lebih dulu sebelum membandingkan, jadi `0 == "0"` bernilai `true`, begitu pula `0 == []`. `===` membandingkan nilai **dan** tipe, tanpa konversi. Tidak ada alasan bagus memakai `==` — pakailah `===` dan `!==` di mana-mana.',
              },
              code: { en: 'console.log(0 == "0");\nconsole.log(0 === "0");\nconsole.log(2 !== "2");', id: 'console.log(0 == "0");\nconsole.log(0 === "0");\nconsole.log(2 !== "2");' },
              output: { en: 'true\nfalse\ntrue', id: 'true\nfalse\ntrue' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is logged?', id: 'Apa yang ditampilkan?' },
              code: 'console.log("5" + 2);',
              options: [
                { en: '"52" — the string wins, so + joins', id: '"52" — string menang, jadi + menyambung' },
                { en: '7', id: '7' },
                { en: '3', id: '3' },
                { en: 'NaN', id: 'NaN' },
              ],
              answer: 0,
              explain: {
                en: 'With a string on one side, + joins rather than adds. Number("5") + 2 would give 7.',
                id: 'Dengan string di satu sisi, + menyambung alih-alih menjumlah. Number("5") + 2 akan memberi 7.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that logs `Total: 15`.',
                id: 'Susun program yang menampilkan `Total: 15`.',
              },
              lines: ['const a = 7;', 'const b = 8;', 'const total = a + b;', 'console.log(`Total: ${total}`);'],
              explain: {
                en: 'A name must exist before it is used, so the two values come first.',
                id: 'Sebuah nama harus ada sebelum dipakai, jadi kedua nilainya lebih dulu.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'A shirt costs 120000 and there is a 25 percent discount. Compute `saved` and `pay`, then log exactly `Saved 30000, pay 90000`.',
                id: 'Sebuah kaus berharga 120000 dengan diskon 25 persen. Hitung `hemat` dan `bayar`, lalu tampilkan tepat `Hemat 30000, bayar 90000`.',
              },
              starter: 'const price = 120000;\nconst discount = 25;\n',
              tests: {
                en: [
                  {
                    name: { en: 'The two amounts are right', id: 'The two amounts are right' },
                    check:
                      'assert(saved === 30000, "saved must be 30000, currently: " + JSON.stringify(saved));\nassert(pay === 90000, "pay must be 90000, currently: " + JSON.stringify(pay));',
                  },
                  {
                    name: { en: 'They are numbers', id: 'They are numbers' },
                    check:
                      'assert(typeof saved === "number" && typeof pay === "number", "both must be number, not string");',
                  },
                  {
                    name: { en: 'The sentence is exact', id: 'The sentence is exact' },
                    check: 'assert(out() === "Saved 30000, pay 90000", "the output: " + JSON.stringify(out()));',
                  },
                ],
                id: [
                  {
                    name: { en: 'The two amounts are right', id: 'Kedua jumlahnya benar' },
                    check:
                      'assert(hemat === 30000, "hemat harus 30000, sekarang: " + JSON.stringify(hemat));\nassert(bayar === 90000, "bayar harus 90000, sekarang: " + JSON.stringify(bayar));',
                  },
                  {
                    name: { en: 'They are numbers', id: 'Keduanya berupa angka' },
                    check:
                      'assert(typeof hemat === "number" && typeof bayar === "number", "keduanya harus number, bukan string");',
                  },
                  {
                    name: { en: 'The sentence is exact', id: 'Kalimatnya tepat' },
                    check: 'assert(out() === "Hemat 30000, bayar 90000", "keluarannya: " + JSON.stringify(out()));',
                  },
                ],
              },
              hints: [
                { en: 'A quarter of the price is price * discount / 100.', id: 'Seperempat harganya adalah harga * diskon / 100.' },
                { en: 'What you pay is the price minus what you saved.', id: 'Yang dibayar adalah harga dikurangi yang dihemat.' },
                { en: 'console.log(`Saved ${saved}, pay ${pay}`);', id: 'console.log(`Hemat ${hemat}, bayar ${bayar}`);' },
              ],
              solution: {
                en: 'const price = 120000;\nconst discount = 25;\n\nconst saved = price * discount / 100;\nconst pay = price - saved;\n\nconsole.log(`Saved ${saved}, pay ${pay}`);',
                id: 'const harga = 120000;\nconst diskon = 25;\n\nconst hemat = harga * diskon / 100;\nconst bayar = harga - hemat;\n\nconsole.log(`Hemat ${hemat}, bayar ${bayar}`);',
              },
            },
          ],
        },
      ],
      project: {
        id: 'js-m1-s1-p',
        runtime: 'web',
        js: true,
        title: { en: 'Receipt calculator', id: 'Kalkulator struk' },
        brief: {
          en: 'Work out a bill with a discount and tax, and print it as a small receipt.',
          id: 'Hitung sebuah tagihan dengan diskon dan pajak, lalu cetak sebagai struk ringkas.',
        },
        requirements: [
          { en: 'Start from `price = 250000`, `quantity = 3`, `discountPercent = 10`, `taxPercent = 11`.', id: 'Mulai dari `harga = 250000`, `jumlah = 3`, `diskonPersen = 10`, `pajakPersen = 11`.' },
          { en: '`subtotal` is price times quantity.', id: '`subtotal` adalah harga kali jumlah.' },
          { en: '`discount` is the discount on the subtotal; `afterDiscount` is what is left.', id: '`diskon` adalah potongan atas subtotal; `setelahDiskon` adalah sisanya.' },
          { en: '`tax` is the tax on `afterDiscount`; `total` is the two added.', id: '`pajak` adalah pajak atas `setelahDiskon`; `total` adalah keduanya dijumlahkan.' },
          { en: 'Log exactly four lines: `Subtotal: 750000`, `Discount: 75000`, `Tax: 74250`, `Total: 749250`.', id: 'Tampilkan tepat empat baris: `Subtotal: 750000`, `Diskon: 75000`, `Pajak: 74250`, `Total: 749250`.' },
        ],
        starter: {
          en: 'const price = 250000;\nconst quantity = 3;\nconst discountPercent = 10;\nconst taxPercent = 11;\n',
          id: 'const harga = 250000;\nconst jumlah = 3;\nconst diskonPersen = 10;\nconst pajakPersen = 11;\n',
        },
        tests: {
          en: [
            {
              name: { en: 'Subtotal and discount', id: 'Subtotal and discount' },
              check:
                'assert(subtotal === 750000, "subtotal must be 750000, currently: " + JSON.stringify(subtotal));\nassert(discount === 75000, "discount must be 75000, currently: " + JSON.stringify(discount));\nassert(afterDiscount === 675000, "afterDiscount must be 675000, currently: " + JSON.stringify(afterDiscount));',
            },
            {
              name: { en: 'Tax is taken after the discount', id: 'Tax is taken after the discount' },
              check:
                'assert(tax === 74250, "tax must be 74250 — computed from afterDiscount, not from subtotal; currently: " + JSON.stringify(tax));\nassert(total === 749250, "total must be 749250, currently: " + JSON.stringify(total));',
            },
            {
              name: { en: 'Every value is a number', id: 'Every value is a number' },
              check:
                '[["subtotal", subtotal], ["discount", discount], ["tax", tax], ["total", total]].forEach(function (p) {\n  assert(typeof p[1] === "number", p[0] + " must be number, currently: " + typeof p[1]);\n});',
            },
            {
              name: { en: 'The receipt reads exactly right', id: 'The receipt reads exactly right' },
              check:
                'assert(logs().length === 4, "there must be exactly four lines, currently: " + logs().length);\nassert(out() === "Subtotal: 750000\\nDiscount: 75000\\nTax: 74250\\nTotal: 749250", "the output: " + JSON.stringify(out()));',
            },
          ],
          id: [
            {
              name: { en: 'Subtotal and discount', id: 'Subtotal dan diskon' },
              check:
                'assert(subtotal === 750000, "subtotal harus 750000, sekarang: " + JSON.stringify(subtotal));\nassert(diskon === 75000, "diskon harus 75000, sekarang: " + JSON.stringify(diskon));\nassert(setelahDiskon === 675000, "setelahDiskon harus 675000, sekarang: " + JSON.stringify(setelahDiskon));',
            },
            {
              name: { en: 'Tax is taken after the discount', id: 'Pajak dihitung setelah diskon' },
              check:
                'assert(pajak === 74250, "pajak harus 74250 — dihitung dari setelahDiskon, bukan dari subtotal; sekarang: " + JSON.stringify(pajak));\nassert(total === 749250, "total harus 749250, sekarang: " + JSON.stringify(total));',
            },
            {
              name: { en: 'Every value is a number', id: 'Semua nilainya angka' },
              check:
                '[["subtotal", subtotal], ["diskon", diskon], ["pajak", pajak], ["total", total]].forEach(function (p) {\n  assert(typeof p[1] === "number", p[0] + " harus number, sekarang: " + typeof p[1]);\n});',
            },
            {
              name: { en: 'The receipt reads exactly right', id: 'Struknya terbaca tepat' },
              check:
                'assert(logs().length === 4, "harus tepat empat baris, sekarang: " + logs().length);\nassert(out() === "Subtotal: 750000\\nDiskon: 75000\\nPajak: 74250\\nTotal: 749250", "keluarannya: " + JSON.stringify(out()));',
            },
          ],
        },
        hints: [
          { en: 'Work down in order — each value builds on the one above it.', id: 'Kerjakan berurutan ke bawah — tiap nilai dibangun dari nilai di atasnya.' },
          { en: 'The tax is charged on what is left after the discount, not on the subtotal.', id: 'Pajaknya dikenakan atas sisa setelah diskon, bukan atas subtotal.' },
          { en: 'A percentage of x is `x * percent / 100`.', id: 'Persentase dari x adalah `x * persen / 100`.' },
          { en: 'Four template literals, one per line.', id: 'Empat template literal, satu per baris.' },
        ],
        solution: {
          en: 'const price = 250000;\nconst quantity = 3;\nconst discountPercent = 10;\nconst taxPercent = 11;\n\nconst subtotal = price * quantity;\nconst discount = subtotal * discountPercent / 100;\nconst afterDiscount = subtotal - discount;\nconst tax = afterDiscount * taxPercent / 100;\nconst total = afterDiscount + tax;\n\nconsole.log(`Subtotal: ${subtotal}`);\nconsole.log(`Discount: ${discount}`);\nconsole.log(`Tax: ${tax}`);\nconsole.log(`Total: ${total}`);',
          id: 'const harga = 250000;\nconst jumlah = 3;\nconst diskonPersen = 10;\nconst pajakPersen = 11;\n\nconst subtotal = harga * jumlah;\nconst diskon = subtotal * diskonPersen / 100;\nconst setelahDiskon = subtotal - diskon;\nconst pajak = setelahDiskon * pajakPersen / 100;\nconst total = setelahDiskon + pajak;\n\nconsole.log(`Subtotal: ${subtotal}`);\nconsole.log(`Diskon: ${diskon}`);\nconsole.log(`Pajak: ${pajak}`);\nconsole.log(`Total: ${total}`);',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------- 1.2 branching & looping */
    {
      id: 'js-m1-s2',
      title: { en: 'Choosing and Repeating', id: 'Memilih dan Mengulang' },
      summary: {
        en: 'Run different code on a condition, and run the same code many times.',
        id: 'Menjalankan kode berbeda tergantung kondisi, dan menjalankan kode sama berkali-kali.',
      },
      lessons: [
        {
          id: 'js-m1-s2-l1',
          title: { en: 'if, else, and truthiness', id: 'if, else, dan kebenaran nilai' },
          goal: { en: 'Branch on a condition.', id: 'Bercabang berdasarkan kondisi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The condition goes in brackets', id: 'Kondisinya ditulis di dalam kurung' },
              body: {
                en: 'The shape is `if (condition) { ... } else { ... }`. Unlike Python there is no colon and indentation is only for humans — the braces are what group the block.',
                id: 'Bentuknya `if (kondisi) { ... } else { ... }`. Tidak seperti Python, tak ada titik dua dan indentasi hanya untuk manusia — kurung kurawal itulah yang mengelompokkan bloknya.',
              },
              code: {
                en: 'const score = 65;\n\nif (score >= 70) {\n  console.log("Pass");\n} else {\n  console.log("Fail");\n}',
                id: 'const nilai = 65;\n\nif (nilai >= 70) {\n  console.log("Lulus");\n} else {\n  console.log("Belum lulus");\n}',
              },
              output: { en: 'Fail', id: 'Belum lulus' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'and, or, not — written as symbols', id: 'dan, atau, bukan — ditulis sebagai simbol' },
              body: {
                en: '`&&` is and, `||` is or, `!` is not. They combine conditions exactly as the words do, and brackets settle any doubt about what binds to what.',
                id: '`&&` adalah dan, `||` adalah atau, `!` adalah bukan. Ketiganya menggabungkan kondisi persis seperti kata-katanya, dan tanda kurung menyelesaikan keraguan tentang apa mengikat apa.',
              },
              code: {
                en: 'const age = 20;\nconst hasId = true;\n\nconsole.log(age >= 17 && hasId);\nconsole.log(age < 17 || hasId);\nconsole.log(!hasId);',
                id: 'const umur = 20;\nconst punyaKtp = true;\n\nconsole.log(umur >= 17 && punyaKtp);\nconsole.log(umur < 17 || punyaKtp);\nconsole.log(!punyaKtp);',
              },
              output: { en: 'true\ntrue\nfalse', id: 'true\ntrue\nfalse' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Falsy: the six values that count as no', id: 'Falsy: enam nilai yang dianggap tidak' },
              body: {
                en: 'An `if` accepts any value, not just a boolean. Six count as false — `false`, `0`, `""`, `null`, `undefined`, `NaN` — and everything else counts as true. That makes `if (name)` a neat way to ask "is this filled in", but it also means `0` is treated as empty.',
                id: 'Sebuah `if` menerima nilai apa pun, bukan hanya boolean. Enam nilai dianggap salah — `false`, `0`, `""`, `null`, `undefined`, `NaN` — dan selebihnya dianggap benar. Ini membuat `if (nama)` jadi cara ringkas menanyakan "sudah diisi belum", tetapi juga berarti `0` diperlakukan sebagai kosong.',
              },
              code: {
                en: 'const name = "";\n\nif (name) {\n  console.log("has content");\n} else {\n  console.log("empty");\n}',
                id: 'const nama = "";\n\nif (nama) {\n  console.log("ada isinya");\n} else {\n  console.log("kosong");\n}',
              },
              output: { en: 'empty', id: 'kosong' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is logged?', id: 'Apa yang ditampilkan?' },
              code: {
                en: 'const stock = 0;\n\nif (stock) {\n  console.log("in stock");\n} else {\n  console.log("out of stock");\n}',
                id: 'const stok = 0;\n\nif (stok) {\n  console.log("tersedia");\n} else {\n  console.log("habis");\n}',
              },
              options: [
                { en: 'out of stock — 0 is falsy', id: 'habis — 0 termasuk falsy' },
                { en: 'in stock — 0 is a real number', id: 'tersedia — 0 tetap angka sungguhan' },
                { en: 'Nothing', id: 'Tidak ada' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'This is exactly the trap: writing `if (stock > 0)` says what you mean, and would behave the same here but not for -1.',
                id: 'Inilah jebakannya: menulis `if (stok > 0)` menyatakan maksudmu, dan di sini hasilnya sama tetapi tidak untuk -1.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Pass only when both are true.', id: 'Lulus hanya bila keduanya benar.' },
              template: {
                en: 'if (score >= 70 ___ attendance >= 80) {\n  console.log("Pass");\n}',
                id: 'if (nilai >= 70 ___ hadir >= 80) {\n  console.log("Lulus");\n}',
              },
              blanks: ['&&'],
              explain: {
                en: '&& needs both sides true; || would pass on either one.',
                id: '&& butuh kedua sisi benar; || akan lolos dengan salah satu saja.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Read `hour` and log `Morning` when it is 5–10, `Midday` when 11–14, `Evening` when 15–18, and `Night` otherwise.',
                id: 'Baca `jam` lalu tampilkan `Pagi` bila 5–10, `Siang` bila 11–14, `Sore` bila 15–18, dan `Malam` selain itu.',
              },
              starter: { en: 'const hour = 13;\n', id: 'const jam = 13;\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Midday gives Midday', id: 'Midday gives Midday' },
                    check: 'assert(out() === "Midday", "with hour = 13 the output must be Midday, currently: " + JSON.stringify(out()));',
                  },
                  {
                    name: { en: 'One line only', id: 'One line only' },
                    check: 'assert(logs().length === 1, "only one line may be shown, currently: " + logs().length);',
                  },
                  {
                    name: { en: 'The label is one of the four', id: 'The label is one of the four' },
                    check:
                      'var l = logs()[0];\nassert(["Morning", "Midday", "Evening", "Night"].indexOf(l) !== -1, "the label must be one of Morning/Midday/Evening/Night, currently: " + JSON.stringify(l));',
                  },
                ],
                id: [
                  {
                    name: { en: 'Midday gives Siang', id: 'Tengah hari memberi Siang' },
                    check: 'assert(out() === "Siang", "dengan jam = 13 keluarannya harus Siang, sekarang: " + JSON.stringify(out()));',
                  },
                  {
                    name: { en: 'One line only', id: 'Hanya satu baris' },
                    check: 'assert(logs().length === 1, "hanya satu baris yang boleh tampil, sekarang: " + logs().length);',
                  },
                  {
                    name: { en: 'The label is one of the four', id: 'Labelnya salah satu dari empat' },
                    check:
                      'var l = logs()[0];\nassert(["Pagi", "Siang", "Sore", "Malam"].indexOf(l) !== -1, "labelnya harus salah satu dari Pagi/Siang/Sore/Malam, sekarang: " + JSON.stringify(l));',
                  },
                ],
              },
              hints: [
                { en: 'A chain: if, then else if, then else.', id: 'Sebuah rantai: if, lalu else if, lalu else.' },
                { en: 'A band needs two bounds: hour >= 5 && hour <= 10.', id: 'Sebuah rentang butuh dua batas: jam >= 5 && jam <= 10.' },
                { en: 'Night is the final else — it needs no condition.', id: 'Malam adalah else terakhir — tidak butuh kondisi.' },
              ],
              solution: {
                en: 'const hour = 13;\n\nif (hour >= 5 && hour <= 10) {\n  console.log("Morning");\n} else if (hour >= 11 && hour <= 14) {\n  console.log("Midday");\n} else if (hour >= 15 && hour <= 18) {\n  console.log("Evening");\n} else {\n  console.log("Night");\n}',
                id: 'const jam = 13;\n\nif (jam >= 5 && jam <= 10) {\n  console.log("Pagi");\n} else if (jam >= 11 && jam <= 14) {\n  console.log("Siang");\n} else if (jam >= 15 && jam <= 18) {\n  console.log("Sore");\n} else {\n  console.log("Malam");\n}',
              },
            },
          ],
        },
        {
          id: 'js-m1-s2-l2',
          title: { en: 'Loops', id: 'Perulangan' },
          goal: { en: 'Repeat work without repeating yourself.', id: 'Mengulang pekerjaan tanpa mengulang tulisan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'for: start, keep going, step', id: 'for: mulai, terus selama, melangkah' },
              body: {
                en: 'A `for` header holds three parts separated by semicolons: where to start, how long to keep going, and what to do after each round. Counting from 0 is the convention, because that is how arrays are indexed.',
                id: 'Kepala `for` memuat tiga bagian dipisah titik koma: mulai dari mana, terus selama apa, dan apa yang dilakukan setiap putaran selesai. Menghitung dari 0 adalah kelaziman, karena begitulah array diindeks.',
              },
              code: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}',
              output: '0\n1\n2',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Building up an answer', id: 'Membangun sebuah jawaban' },
              body: {
                en: 'Declare the accumulator **before** the loop, add to it **inside**, log it **after**. Those three positions matter more than the arithmetic — and the accumulator is `let`, because it is the one thing here that genuinely changes.',
                id: 'Deklarasikan akumulatornya **sebelum** loop, tambahkan **di dalamnya**, tampilkan **sesudahnya**. Ketiga posisi itu lebih penting daripada hitungannya — dan akumulatornya `let`, karena justru dialah yang benar-benar berubah.',
              },
              code: 'let total = 0;\n\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}\n\nconsole.log(total);',
              output: '10',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'for...of walks the items', id: 'for...of menyusuri itemnya' },
              body: {
                en: 'When you want the values rather than the positions, `for...of` hands them over one at a time. Use `while` for the other case — when you do not know how many rounds there will be, only when to stop.',
                id: 'Ketika yang kamu inginkan nilainya, bukan posisinya, `for...of` menyerahkannya satu per satu. Pakai `while` untuk kasus sebaliknya — saat kamu tidak tahu berapa putaran, hanya tahu kapan berhenti.',
              },
              code: {
                en: 'const cities = ["Surabaya", "Malang"];\n\nfor (const c of cities) {\n  console.log(c);\n}',
                id: 'const kota = ["Surabaya", "Malang"];\n\nfor (const k of kota) {\n  console.log(k);\n}',
              },
              output: { en: 'Surabaya\nMalang', id: 'Surabaya\nMalang' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'How many lines does this log?', id: 'Berapa baris yang ditampilkan ini?' },
              code: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
              options: [
                { en: '5 — from 1 to 5 inclusive', id: '5 — dari 1 sampai 5, keduanya ikut' },
                { en: '4', id: '4' },
                { en: '6', id: '6' },
                { en: 'Forever', id: 'Selamanya' },
              ],
              answer: 0,
              explain: {
                en: 'The condition uses <=, so 5 still runs. With < it would stop at 4.',
                id: 'Kondisinya memakai <=, jadi 5 masih dijalankan. Dengan < ia akan berhenti di 4.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              prompt: {
                en: 'Log the even numbers from 2 to 10, one per line, then log their total on a final line.',
                id: 'Tampilkan bilangan genap dari 2 sampai 10, satu per baris, lalu tampilkan totalnya di baris terakhir.',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'The five even numbers, in order', id: 'Kelima bilangan genapnya, berurutan' },
                  check:
                    'var l = logs();\nassert(l.length === 6, "harus enam baris: lima angka dan satu total, sekarang: " + l.length);\nassert(l.slice(0, 5).join(",") === "2,4,6,8,10", "lima baris pertama harus 2,4,6,8,10 — sekarang: " + l.slice(0, 5).join(","));',
                },
                {
                  name: { en: 'The total closes it', id: 'Totalnya menutup' },
                  check: 'var l = logs();\nassert(l[5] === "30", "baris terakhir harus 30, sekarang: " + JSON.stringify(l[5]));',
                },
              ],
              hints: [
                { en: 'Stepping by 2 gives the even numbers straight away.', id: 'Melangkah 2 langsung memberi bilangan genapnya.' },
                { en: 'The accumulator is declared before the loop with let.', id: 'Akumulatornya dideklarasikan sebelum loop dengan let.' },
                { en: 'for (let i = 2; i <= 10; i += 2) { … }', id: 'for (let i = 2; i <= 10; i += 2) { … }' },
              ],
              solution:
                'let total = 0;\n\nfor (let i = 2; i <= 10; i += 2) {\n  console.log(i);\n  total += i;\n}\n\nconsole.log(total);',
            },
          ],
        },
      ],
      project: {
        id: 'js-m1-s2-p',
        runtime: 'web',
        js: true,
        title: { en: 'Grade report', id: 'Laporan nilai' },
        brief: {
          en: 'Walk a list of scores, grade each one, and summarise the class.',
          id: 'Susuri daftar nilai, beri predikat tiap nilai, lalu ringkas kelasnya.',
        },
        requirements: [
          { en: 'Start from `const scores = [92, 78, 65, 45, 88];`.', id: 'Mulai dari `const nilai = [92, 78, 65, 45, 88];`.' },
          { en: 'For each score log `92: A` — A for 90+, B for 80+, C for 70+, D for 60+, E below.', id: 'Untuk tiap nilai tampilkan `92: A` — A untuk 90+, B untuk 80+, C untuk 70+, D untuk 60+, E di bawahnya.' },
          { en: 'Then log `Average: 73.6`.', id: 'Lalu tampilkan `Rata-rata: 73.6`.' },
          { en: 'Then log `Passed: 3 of 5` — a score of 70 or more passes.', id: 'Lalu tampilkan `Lulus: 3 dari 5` — nilai 70 ke atas dinyatakan lulus.' },
        ],
        starter: { en: 'const scores = [92, 78, 65, 45, 88];\n', id: 'const nilai = [92, 78, 65, 45, 88];\n' },
        tests: {
          en: [
            {
              name: { en: 'Each score is graded', id: 'Each score is graded' },
              check:
                'var l = logs();\nassert(l.length === 7, "there must be seven lines: five scores, the average, and the summary; currently: " + l.length);\nvar want = ["92: A", "78: C", "65: D", "45: E", "88: B"];\nfor (var i = 0; i < 5; i++) assert(l[i] === want[i], "line " + (i + 1) + " must be " + want[i] + ", currently: " + JSON.stringify(l[i]));',
            },
            {
              name: { en: 'The average is right', id: 'The average is right' },
              check: 'var l = logs();\nassert(l[5] === "Average: 73.6", "the average line: " + JSON.stringify(l[5]));',
            },
            {
              name: { en: 'The pass count is right', id: 'The pass count is right' },
              check: 'var l = logs();\nassert(l[6] === "Passed: 3 of 5", "the summary line: " + JSON.stringify(l[6]));',
            },
            {
              name: { en: 'Every grade follows from the array', id: 'Every grade follows from the array' },
              check:
                'var l = logs();\nscores.forEach(function (n, i) {\n  var h = n >= 90 ? "A" : n >= 80 ? "B" : n >= 70 ? "C" : n >= 60 ? "D" : "E";\n  assert(l[i] === n + ": " + h, "score " + n + " should be " + h + ", its line: " + JSON.stringify(l[i]));\n});\nvar passCount = scores.filter(function (n) { return n >= 70; }).length;\nassert(l[6] === "Passed: " + passCount + " of " + scores.length, "the summary does not match the array contents");',
            },
          ],
          id: [
            {
              name: { en: 'Each score is graded', id: 'Tiap nilai diberi predikat' },
              check:
                'var l = logs();\nassert(l.length === 7, "harus tujuh baris: lima nilai, rata-rata, dan ringkasan; sekarang: " + l.length);\nvar mau = ["92: A", "78: C", "65: D", "45: E", "88: B"];\nfor (var i = 0; i < 5; i++) assert(l[i] === mau[i], "baris ke-" + (i + 1) + " harus " + mau[i] + ", sekarang: " + JSON.stringify(l[i]));',
            },
            {
              name: { en: 'The average is right', id: 'Rata-ratanya benar' },
              check: 'var l = logs();\nassert(l[5] === "Rata-rata: 73.6", "baris rata-rata: " + JSON.stringify(l[5]));',
            },
            {
              name: { en: 'The pass count is right', id: 'Jumlah yang lulus benar' },
              check: 'var l = logs();\nassert(l[6] === "Lulus: 3 dari 5", "baris ringkasan: " + JSON.stringify(l[6]));',
            },
            {
              name: { en: 'Every grade follows from the array', id: 'Tiap predikat mengikuti isi array' },
              check:
                'var l = logs();\nnilai.forEach(function (n, i) {\n  var h = n >= 90 ? "A" : n >= 80 ? "B" : n >= 70 ? "C" : n >= 60 ? "D" : "E";\n  assert(l[i] === n + ": " + h, "nilai " + n + " seharusnya " + h + ", barisnya: " + JSON.stringify(l[i]));\n});\nvar jumlahLulus = nilai.filter(function (n) { return n >= 70; }).length;\nassert(l[6] === "Lulus: " + jumlahLulus + " dari " + nilai.length, "ringkasannya tidak cocok dengan isi array");',
            },
          ],
        },
        hints: [
          { en: 'One loop does the grading and the counting at the same time.', id: 'Satu loop bisa memberi predikat dan menghitung sekaligus.' },
          { en: 'An if/else if chain from highest to lowest needs only one bound each.', id: 'Rantai if/else if dari tertinggi ke terendah cukup satu batas tiap cabang.' },
          { en: 'The average is the running total divided by scores.length.', id: 'Rata-ratanya adalah total berjalan dibagi nilai.length.' },
          { en: '73.6 comes out exactly — no rounding needed here.', id: '73.6 keluar tepat — tidak perlu pembulatan di sini.' },
        ],
        solution: {
          en: 'const scores = [92, 78, 65, 45, 88];\n\nlet total = 0;\nlet passed = 0;\n\nfor (const n of scores) {\n  let letter;\n  if (n >= 90) {\n    letter = "A";\n  } else if (n >= 80) {\n    letter = "B";\n  } else if (n >= 70) {\n    letter = "C";\n  } else if (n >= 60) {\n    letter = "D";\n  } else {\n    letter = "E";\n  }\n\n  console.log(`${n}: ${letter}`);\n\n  total += n;\n  if (n >= 70) {\n    passed += 1;\n  }\n}\n\nconsole.log(`Average: ${total / scores.length}`);\nconsole.log(`Passed: ${passed} of ${scores.length}`);',
          id: 'const nilai = [92, 78, 65, 45, 88];\n\nlet total = 0;\nlet lulus = 0;\n\nfor (const n of nilai) {\n  let huruf;\n  if (n >= 90) {\n    huruf = "A";\n  } else if (n >= 80) {\n    huruf = "B";\n  } else if (n >= 70) {\n    huruf = "C";\n  } else if (n >= 60) {\n    huruf = "D";\n  } else {\n    huruf = "E";\n  }\n\n  console.log(`${n}: ${huruf}`);\n\n  total += n;\n  if (n >= 70) {\n    lulus += 1;\n  }\n}\n\nconsole.log(`Rata-rata: ${total / nilai.length}`);\nconsole.log(`Lulus: ${lulus} dari ${nilai.length}`);',
        },
        xp: 50,
      },
    },
  ],
}
