import type { Module } from '../types'

/** Module 1 — first program, then variables and input.
 *  Each lesson walks concept -> predict -> complete -> write. */
export const module1: Module = {
  id: 'py-m1',
  title: { en: 'Getting Started', id: 'Mulai dari Nol' },
  summary: {
    en: 'Print your first line of Python, then store and combine values.',
    id: 'Cetak baris Python pertamamu, lalu simpan dan gabungkan nilai.',
  },
  submodules: [
    /* ------------------------------------------------------ 1.1 first program */
    {
      id: 'py-m1-s1',
      title: { en: 'Your First Program', id: 'Program Pertamamu' },
      summary: {
        en: 'Make the computer say something, and learn to read what it says back.',
        id: 'Buat komputer mengatakan sesuatu, dan belajar membaca balasannya.',
      },
      lessons: [
        {
          id: 'py-m1-s1-l1',
          title: { en: 'Saying hello', id: 'Menyapa' },
          goal: { en: 'Print text to the screen.', id: 'Mencetak teks ke layar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'print() shows things', id: 'print() menampilkan sesuatu' },
              body: {
                en: 'A program that says nothing is hard to trust. `print()` puts text on the screen. The text goes inside the brackets, wrapped in quotes.',
                id: 'Program yang diam sulit dipercaya. `print()` menampilkan teks di layar. Teksnya ditulis di dalam kurung, diapit tanda kutip.',
              },
              code: { en: 'print("Hello, world!")', id: 'print("Halo, dunia!")' },
              output: { en: 'Hello, world!', id: 'Halo, dunia!' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One line at a time', id: 'Satu baris sekali jalan' },
              body: {
                en: 'Python runs your lines top to bottom. Two `print()` calls give two lines, in the order you wrote them.',
                id: 'Python menjalankan barismu dari atas ke bawah. Dua `print()` menghasilkan dua baris, sesuai urutan penulisan.',
              },
              code: {
                en: 'print("My name is Nunada")\nprint("I am learning Python")',
                id: 'print("Nama saya Nunada")\nprint("Saya belajar Python")',
              },
              output: { en: 'My name is Nunada\nI am learning Python', id: 'Nama saya Nunada\nSaya belajar Python' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this program print?', id: 'Apa yang dicetak program ini?' },
              code: 'print("A")\nprint("B")',
              options: [
                { en: 'A then B, on two lines', id: 'A lalu B, pada dua baris' },
                { en: 'AB on one line', id: 'AB pada satu baris' },
                { en: 'B then A, on two lines', id: 'B lalu A, pada dua baris' },
                { en: 'Nothing — quotes are missing', id: 'Tidak ada — tanda kutip hilang' },
              ],
              answer: 0,
              explain: {
                en: 'Each print() ends its own line, and lines run in the order written.',
                id: 'Setiap print() mengakhiri barisnya sendiri, dan baris dijalankan sesuai urutan penulisan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the program so it prints: Welcome',
                id: 'Lengkapi program agar mencetak: Selamat datang',
              },
              template: { en: '___("Welcome")', id: '___("Selamat datang")' },
              blanks: ['print'],
              explain: {
                en: 'print is the built-in function that writes to the screen.',
                id: 'print adalah fungsi bawaan yang menulis ke layar.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write a program that prints exactly two lines: `Hello!` then `My name is Nunada`.',
                id: 'Tulis program yang mencetak tepat dua baris: `Halo!` lalu `Nama saya Nunada`.',
              },
              starter: { en: '# write your code below\n', id: '# tulis kodemu di bawah ini\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Prints both lines in order', id: 'Mencetak kedua baris berurutan' },
                    expectOutput: 'Hello!\nMy name is Nunada',
                  },
                ],
                id: [
                  {
                    name: { en: 'Prints both lines in order', id: 'Mencetak kedua baris berurutan' },
                    expectOutput: 'Halo!\nNama saya Nunada',
                  },
                ],
              },
              hints: [
                { en: 'You need two print() calls.', id: 'Kamu butuh dua pemanggilan print().' },
                { en: 'The text must match exactly, including the "!".', id: 'Teksnya harus sama persis, termasuk tanda "!".' },
              ],
              solution: {
                en: 'print("Hello!")\nprint("My name is Nunada")',
                id: 'print("Halo!")\nprint("Nama saya Nunada")',
              },
            },
          ],
        },
        {
          id: 'py-m1-s1-l2',
          title: { en: 'Comments and mistakes', id: 'Komentar dan kesalahan' },
          goal: {
            en: 'Leave notes in code, and read an error message.',
            id: 'Menulis catatan di kode, dan membaca pesan error.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Notes for humans', id: 'Catatan untuk manusia' },
              body: {
                en: 'A line starting with `#` is a comment. Python ignores it completely — it is there for whoever reads the code later, which is usually you.',
                id: 'Baris yang diawali `#` adalah komentar. Python mengabaikannya — komentar itu untuk siapa pun yang membaca kodenya nanti, yang biasanya dirimu sendiri.',
              },
              code: {
                en: '# this is a note, and does not run\nprint("This runs")',
                id: '# ini catatan, tidak dijalankan\nprint("Ini dijalankan")',
              },
              output: { en: 'This runs', id: 'Ini dijalankan' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Errors are instructions', id: 'Error itu petunjuk' },
              body: {
                en: 'When Python cannot understand a line it stops and tells you the line number and the kind of problem. `SyntaxError` almost always means a missing bracket or quote.',
                id: 'Ketika Python tidak memahami sebuah baris, ia berhenti dan memberi tahu nomor baris serta jenis masalahnya. `SyntaxError` hampir selalu berarti kurung atau kutip yang hilang.',
              },
              code: { en: 'print("Hello)', id: 'print("Halo)' },
              output: 'SyntaxError: unterminated string literal (detected at line 1)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Which line will Python actually run?', id: 'Baris mana yang benar-benar dijalankan Python?' },
              code: { en: '# print("one")\nprint("two")', id: '# print("satu")\nprint("dua")' },
              options: [
                { en: 'Only print("two")', id: 'Hanya print("dua")' },
                { en: 'Both lines', id: 'Kedua baris' },
                { en: 'Only print("one")', id: 'Hanya print("satu")' },
                { en: 'Neither', id: 'Tidak keduanya' },
              ],
              answer: 0,
              explain: {
                en: 'The first line is commented out, so it never runs.',
                id: 'Baris pertama dijadikan komentar, jadi tidak pernah dijalankan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: { en: 'What is wrong with this line?', id: 'Apa yang salah pada baris ini?' },
              code: { en: 'print("Good morning"', id: 'print("Selamat pagi"' },
              options: [
                { en: 'The closing bracket is missing', id: 'Kurung tutup hilang' },
                { en: 'print must be uppercase', id: 'print harus huruf besar' },
                { en: 'Strings cannot have spaces', id: 'String tidak boleh mengandung spasi' },
                { en: 'Nothing is wrong', id: 'Tidak ada yang salah' },
              ],
              answer: 0,
              explain: {
                en: 'Every ( needs a matching ). Python reports this as a SyntaxError.',
                id: 'Setiap ( butuh pasangan ). Python melaporkannya sebagai SyntaxError.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Fix the broken program so it prints `Learning Python` — and add a comment above it explaining what it does.',
                id: 'Perbaiki program yang rusak ini agar mencetak `Belajar Python` — dan tambahkan komentar di atasnya yang menjelaskan fungsinya.',
              },
              starter: { en: 'print("Learning Python', id: 'print("Belajar Python' },
              tests: {
                en: [
                  {
                    name: { en: 'Prints the right text', id: 'Mencetak teks yang benar' },
                    expectOutput: 'Learning Python',
                  },
                ],
                id: [
                  {
                    name: { en: 'Prints the right text', id: 'Mencetak teks yang benar' },
                    expectOutput: 'Belajar Python',
                  },
                ],
              },
              hints: [
                { en: 'Close the string with a quote, then close the bracket.', id: 'Tutup string dengan tanda kutip, lalu tutup kurungnya.' },
                { en: 'A comment line starts with #.', id: 'Baris komentar diawali #.' },
              ],
              solution: {
                en: '# prints a greeting\nprint("Learning Python")',
                id: '# mencetak sapaan\nprint("Belajar Python")',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m1-s1-p',
        title: { en: 'Name card', id: 'Kartu nama' },
        brief: {
          en: 'Print a small name card, exactly four lines, using only print().',
          id: 'Cetak sebuah kartu nama kecil, tepat empat baris, hanya dengan print().',
        },
        requirements: [
          { en: 'Line 1: `=== NAME CARD ===`', id: 'Baris 1: `=== KARTU NAMA ===`' },
          { en: 'Line 2: `Name  : Nunada`', id: 'Baris 2: `Nama  : Nunada`' },
          { en: 'Line 3: `City  : Surabaya`', id: 'Baris 3: `Kota  : Surabaya`' },
          { en: 'Line 4: `==================`', id: 'Baris 4: `==================`' },
        ],
        starter: { en: '# Name card\n', id: '# Kartu nama\n' },
        tests: {
          en: [
            {
              name: { en: 'All four lines are exact', id: 'Keempat baris tepat' },
              expectOutput: '=== NAME CARD ===\nName  : Nunada\nCity  : Surabaya\n==================',
            },
          ],
          id: [
            {
              name: { en: 'All four lines are exact', id: 'Keempat baris tepat' },
              expectOutput: '=== KARTU NAMA ===\nNama  : Nunada\nKota  : Surabaya\n==================',
            },
          ],
        },
        hints: [
          { en: 'Four lines means four print() calls.', id: 'Empat baris berarti empat print().' },
          { en: 'Copy the spacing in `Name  :` carefully — two spaces.', id: 'Perhatikan spasi pada `Nama  :` — dua spasi.' },
        ],
        solution: {
          en: 'print("=== NAME CARD ===")\nprint("Name  : Nunada")\nprint("City  : Surabaya")\nprint("==================")',
          id: 'print("=== KARTU NAMA ===")\nprint("Nama  : Nunada")\nprint("Kota  : Surabaya")\nprint("==================")',
        },
        xp: 50,
      },
    },

    /* -------------------------------------------------- 1.2 variables & input */
    {
      id: 'py-m1-s2',
      title: { en: 'Variables and Input', id: 'Variabel dan Input' },
      summary: {
        en: 'Give values a name, do arithmetic with them, and ask the user for one.',
        id: 'Beri nama pada nilai, hitung dengannya, dan minta satu dari pengguna.',
      },
      lessons: [
        {
          id: 'py-m1-s2-l1',
          title: { en: 'Boxes with names', id: 'Kotak bernama' },
          goal: { en: 'Store a value and reuse it.', id: 'Menyimpan nilai dan memakainya lagi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A variable remembers', id: 'Variabel mengingat' },
              body: {
                en: 'Writing the same value twice is a bug waiting to happen. Give it a name once with `=`, then use the name.',
                id: 'Menulis nilai yang sama dua kali adalah bug yang menunggu terjadi. Beri nama sekali dengan `=`, lalu pakai namanya.',
              },
              code: { en: 'name = "Nunada"\nprint(name)\nprint(name)', id: 'nama = "Nunada"\nprint(nama)\nprint(nama)' },
              output: 'Nunada\nNunada',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Text, whole numbers, decimals', id: 'Teks, bilangan bulat, desimal' },
              body: {
                en: 'Three types cover most beginner work: `str` for text (in quotes), `int` for whole numbers, `float` for decimals. Quotes are what make it text — `"7"` is not the number 7.',
                id: 'Tiga tipe menutupi hampir semua pekerjaan pemula: `str` untuk teks (dalam kutip), `int` untuk bilangan bulat, `float` untuk desimal. Tanda kutiplah yang membuatnya teks — `"7"` bukan angka 7.',
              },
              code: {
                en: 'name = "Ani"      # str\nage = 17          # int\nheight = 1.62     # float\nprint(name, age, height)',
                id: 'nama = "Ani"      # str\numur = 17         # int\ntinggi = 1.62     # float\nprint(nama, umur, tinggi)',
              },
              output: 'Ani 17 1.62',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: { en: 'city = "Surabaya"\ncity = "Malang"\nprint(city)', id: 'kota = "Surabaya"\nkota = "Malang"\nprint(kota)' },
              options: [
                { en: 'Malang', id: 'Malang' },
                { en: 'Surabaya', id: 'Surabaya' },
                { en: 'Surabaya Malang', id: 'Surabaya Malang' },
                { en: 'An error — city was set twice', id: 'Error — kota diisi dua kali' },
              ],
              answer: 0,
              explain: {
                en: 'Assigning again replaces the old value. The variable holds the latest one.',
                id: 'Menetapkan ulang mengganti nilai lama. Variabel menyimpan nilai terakhir.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Store the number 25 in a variable called `age`, then print it.',
                id: 'Simpan angka 25 dalam variabel bernama `umur`, lalu cetak.',
              },
              template: { en: 'age ___ 25\nprint(___)', id: 'umur ___ 25\nprint(___)' },
              blanks: { en: ['=', 'age'], id: ['=', 'umur'] },
              explain: {
                en: '= assigns; printing the name prints the stored value.',
                id: '= menetapkan nilai; mencetak namanya berarti mencetak nilai yang tersimpan.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Create `name` = "Budi" and `grade` = 10, then print each on its own line.',
                id: 'Buat `nama` = "Budi" dan `kelas` = 10, lalu cetak masing-masing di barisnya sendiri.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'Prints Budi then 10', id: 'Mencetak Budi lalu 10' },
                    expectOutput: 'Budi\n10',
                  },
                  {
                    name: { en: 'Uses the right variable names', id: 'Memakai nama variabel yang benar' },
                    assert: 'assert name == "Budi", "variable name must contain Budi"\nassert grade == 10, "variable grade must contain the number 10"',
                  },
                ],
                id: [
                  {
                    name: { en: 'Prints Budi then 10', id: 'Mencetak Budi lalu 10' },
                    expectOutput: 'Budi\n10',
                  },
                  {
                    name: { en: 'Uses the right variable names', id: 'Memakai nama variabel yang benar' },
                    assert: 'assert nama == "Budi", "variabel nama harus berisi Budi"\nassert kelas == 10, "variabel kelas harus berisi angka 10"',
                  },
                ],
              },
              hints: [
                { en: 'Text needs quotes; numbers do not.', id: 'Teks butuh tanda kutip; angka tidak.' },
                { en: 'print(name) on one line, print(grade) on the next.', id: 'print(nama) di satu baris, print(kelas) di baris berikutnya.' },
              ],
              solution: {
                en: 'name = "Budi"\ngrade = 10\nprint(name)\nprint(grade)',
                id: 'nama = "Budi"\nkelas = 10\nprint(nama)\nprint(kelas)',
              },
            },
          ],
        },
        {
          id: 'py-m1-s2-l2',
          title: { en: 'Maths and f-strings', id: 'Hitungan dan f-string' },
          goal: {
            en: 'Calculate with variables and drop the result into a sentence.',
            id: 'Menghitung dengan variabel dan menyisipkan hasilnya ke kalimat.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The arithmetic you need', id: 'Operasi hitung yang dibutuhkan' },
              body: {
                en: 'Use `+ - * /` as usual. Two extras matter: `//` divides and throws away the remainder, `%` keeps only the remainder. Note that `/` always gives a decimal.',
                id: 'Gunakan `+ - * /` seperti biasa. Dua tambahan penting: `//` membagi dan membuang sisanya, `%` hanya menyimpan sisanya. Perhatikan `/` selalu menghasilkan desimal.',
              },
              code: 'print(7 + 3)\nprint(7 / 2)\nprint(7 // 2)\nprint(7 % 2)',
              output: '10\n3.5\n3\n1',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Putting values inside text', id: 'Menyisipkan nilai ke dalam teks' },
              body: {
                en: 'Put `f` before the opening quote and you may write variables inside `{ }`. This reads far better than gluing pieces together with `+`.',
                id: 'Letakkan `f` sebelum tanda kutip pembuka, lalu kamu boleh menulis variabel di dalam `{ }`. Ini jauh lebih enak dibaca daripada menyambung dengan `+`.',
              },
              code: {
                en: 'name = "Ani"\nscore = 88\nprint(f"{name} scored {score}")',
                id: 'nama = "Ani"\nnilai = 88\nprint(f"{nama} mendapat nilai {nilai}")',
              },
              output: { en: 'Ani scored 88', id: 'Ani mendapat nilai 88' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'a = 10\nb = 4\nprint(a % b)',
              options: [
                { en: '2', id: '2' },
                { en: '2.5', id: '2.5' },
                { en: '6', id: '6' },
                { en: '40', id: '40' },
              ],
              answer: 0,
              explain: {
                en: '10 divided by 4 is 2 remainder 2, and % keeps the remainder.',
                id: '10 dibagi 4 hasilnya 2 sisa 2, dan % mengambil sisanya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Arrange a program that prints `Total: 15`.',
                id: 'Susun program yang mencetak `Total: 15`.',
              },
              lines: ['a = 7', 'b = 8', 'total = a + b', 'print(f"Total: {total}")'],
              explain: {
                en: 'A variable must exist before it is used, so the assignments come first.',
                id: 'Variabel harus ada sebelum dipakai, jadi penetapan nilainya lebih dulu.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'A rectangle is 8 wide and 5 tall. Compute its area into a variable `area` and print exactly: `Area: 40`.',
                id: 'Sebuah persegi panjang lebarnya 8 dan tingginya 5. Hitung luasnya ke variabel `luas` lalu cetak tepat: `Luas: 40`.',
              },
              starter: { en: 'width = 8\nheight = 5\n', id: 'lebar = 8\ntinggi = 5\n' },
              tests: {
                en: [
                  { name: { en: 'Prints the sentence', id: 'Mencetak kalimatnya' }, expectOutput: 'Area: 40' },
                  {
                    name: { en: 'Stores the area in `area`', id: 'Menyimpan luas di `luas`' },
                    assert: 'assert area == 40, "variable area must equal 40"',
                  },
                ],
                id: [
                  { name: { en: 'Prints the sentence', id: 'Mencetak kalimatnya' }, expectOutput: 'Luas: 40' },
                  {
                    name: { en: 'Stores the area in `luas`', id: 'Menyimpan luas di `luas`' },
                    assert: 'assert luas == 40, "variabel luas harus bernilai 40"',
                  },
                ],
              },
              hints: [
                { en: 'Area is width times height: use *.', id: 'Luas adalah lebar kali tinggi: gunakan *.' },
                { en: 'print(f"Area: {area}")', id: 'print(f"Luas: {luas}")' },
              ],
              solution: {
                en: 'width = 8\nheight = 5\narea = width * height\nprint(f"Area: {area}")',
                id: 'lebar = 8\ntinggi = 5\nluas = lebar * tinggi\nprint(f"Luas: {luas}")',
              },
            },
          ],
        },
        {
          id: 'py-m1-s2-l3',
          title: { en: 'Asking the user', id: 'Bertanya ke pengguna' },
          goal: {
            en: 'Read input and convert it to a number.',
            id: 'Membaca input dan mengubahnya menjadi angka.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'input() always gives text', id: 'input() selalu memberi teks' },
              body: {
                en: 'This is the trap that catches everyone: whatever the user types, `input()` hands back a `str`. Adding to it glues text together instead of doing maths.',
                id: 'Ini jebakan yang menjerat semua orang: apa pun yang diketik pengguna, `input()` mengembalikan `str`. Menambahkannya justru menyambung teks, bukan menghitung.',
              },
              code: { en: 'answer = input("Age: ")\nprint(answer + "1")', id: 'jawab = input("Umur: ")\nprint(jawab + "1")' },
              output: { en: 'Age: 20\n201', id: 'Umur: 20\n201' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'int() and float() convert', id: 'int() dan float() mengubah' },
              body: {
                en: 'Wrap the input in `int()` for a whole number or `float()` for a decimal, and the maths behaves.',
                id: 'Bungkus input dengan `int()` untuk bilangan bulat atau `float()` untuk desimal, maka hitungannya benar.',
              },
              code: { en: 'age = int(input("Age: "))\nprint(age + 1)', id: 'umur = int(input("Umur: "))\nprint(umur + 1)' },
              output: { en: 'Age: 20\n21', id: 'Umur: 20\n21' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The user types 5. What is printed?',
                id: 'Pengguna mengetik 5. Apa yang dicetak?',
              },
              code: { en: 'n = input("Number: ")\nprint(n * 2)', id: 'n = input("Angka: ")\nprint(n * 2)' },
              options: [
                { en: '55', id: '55' },
                { en: '10', id: '10' },
                { en: '5 5', id: '5 5' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'n is the text "5". Multiplying text by 2 repeats it.',
                id: 'n berisi teks "5". Mengalikan teks dengan 2 berarti mengulanginya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Read a whole number into `n` so that `n + 1` does real arithmetic.',
                id: 'Baca sebuah bilangan bulat ke `n` agar `n + 1` benar-benar menghitung.',
              },
              template: { en: 'n = ___(input("Number: "))\nprint(n + 1)', id: 'n = ___(input("Angka: "))\nprint(n + 1)' },
              blanks: ['int'],
              explain: {
                en: 'int() turns the text into a whole number.',
                id: 'int() mengubah teks menjadi bilangan bulat.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Ask for a name, then an age (whole number), then print `<name> will turn <age+1> next year`.',
                id: 'Minta nama, lalu umur (bilangan bulat), lalu cetak `<nama> akan berumur <umur+1> tahun depan`.',
              },
              starter: { en: 'name = input("Name: ")\n', id: 'nama = input("Nama: ")\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Ani, 17 → 18', id: 'Ani, 17 → 18' },
                    stdin: ['Ani', '17'],
                    expectContains: ['Ani will turn 18 next year'],
                  },
                  {
                    name: { en: 'Budi, 9 → 10', id: 'Budi, 9 → 10' },
                    stdin: ['Budi', '9'],
                    expectContains: ['Budi will turn 10 next year'],
                  },
                ],
                id: [
                  {
                    name: { en: 'Ani, 17 → 18', id: 'Ani, 17 → 18' },
                    stdin: ['Ani', '17'],
                    expectContains: ['Ani akan berumur 18 tahun depan'],
                  },
                  {
                    name: { en: 'Budi, 9 → 10', id: 'Budi, 9 → 10' },
                    stdin: ['Budi', '9'],
                    expectContains: ['Budi akan berumur 10 tahun depan'],
                  },
                ],
              },
              hints: [
                { en: 'Two input() calls, in the order name then age.', id: 'Dua input(), urutannya nama lalu umur.' },
                { en: 'Wrap the age input in int().', id: 'Bungkus input umur dengan int().' },
                {
                  en: 'print(f"{name} will turn {age + 1} next year")',
                  id: 'print(f"{nama} akan berumur {umur + 1} tahun depan")',
                },
              ],
              solution: {
                en: 'name = input("Name: ")\nage = int(input("Age: "))\nprint(f"{name} will turn {age + 1} next year")',
                id: 'nama = input("Nama: ")\numur = int(input("Umur: "))\nprint(f"{nama} akan berumur {umur + 1} tahun depan")',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m1-s2-p',
        title: { en: 'Temperature converter', id: 'Konverter suhu' },
        brief: {
          en: 'Read a temperature in Celsius and report it in Fahrenheit.',
          id: 'Baca suhu dalam Celsius dan laporkan dalam Fahrenheit.',
        },
        requirements: [
          { en: 'Read one number with input() — decimals allowed.', id: 'Baca satu angka dengan input() — boleh desimal.' },
          { en: 'Convert with F = C × 9 / 5 + 32.', id: 'Konversi dengan F = C × 9 / 5 + 32.' },
          { en: 'Print `<C>C = <F>F`, for example `25.0C = 77.0F`.', id: 'Cetak `<C>C = <F>F`, misalnya `25.0C = 77.0F`.' },
        ],
        starter: {
          en: '# Celsius to Fahrenheit temperature converter\ncelsius = float(input("Temperature (C): "))\n',
          id: '# Konverter suhu Celsius ke Fahrenheit\ncelsius = float(input("Suhu (C): "))\n',
        },
        tests: [
          {
            name: { en: '25 → 77', id: '25 → 77' },
            stdin: ['25'],
            expectContains: ['25.0C = 77.0F'],
          },
          {
            name: { en: '0 → 32', id: '0 → 32' },
            stdin: ['0'],
            expectContains: ['0.0C = 32.0F'],
          },
          {
            name: { en: '-40 → -40', id: '-40 → -40' },
            stdin: ['-40'],
            expectContains: ['-40.0C = -40.0F'],
          },
        ],
        hints: [
          { en: 'float() keeps the decimal point, so 25 becomes 25.0.', id: 'float() mempertahankan koma desimal, jadi 25 menjadi 25.0.' },
          { en: 'Store the result: fahrenheit = celsius * 9 / 5 + 32', id: 'Simpan hasilnya: fahrenheit = celsius * 9 / 5 + 32' },
          { en: 'print(f"{celsius}C = {fahrenheit}F")', id: 'print(f"{celsius}C = {fahrenheit}F")' },
        ],
        solution: {
          en: 'celsius = float(input("Temperature (C): "))\nfahrenheit = celsius * 9 / 5 + 32\nprint(f"{celsius}C = {fahrenheit}F")',
          id: 'celsius = float(input("Suhu (C): "))\nfahrenheit = celsius * 9 / 5 + 32\nprint(f"{celsius}C = {fahrenheit}F")',
        },
        xp: 50,
      },
    },
  ],
}
