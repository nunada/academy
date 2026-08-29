import type { Module } from '../types'

/** Module 1 — the shape every C++ program has, then variables, operators and
 *  input. Each lesson walks concept -> predict -> complete -> write, same as
 *  every other language course here. */
export const module1: Module = {
  id: 'cpp-m1',
  title: { en: 'Getting Started', id: 'Mulai dari Nol' },
  summary: {
    en: 'The shape of a C++ program, then variables, arithmetic and reading input.',
    id: 'Bentuk sebuah program C++, lalu variabel, aritmetika, dan membaca input.',
  },
  submodules: [
    /* ------------------------------------------------------ 1.1 first program */
    {
      id: 'cpp-m1-s1',
      title: { en: 'Your First Program', id: 'Program Pertamamu' },
      summary: {
        en: 'The lines every C++ program needs, and how to print something through them.',
        id: 'Baris-baris yang dibutuhkan setiap program C++, dan cara mencetak sesuatu lewatnya.',
      },
      lessons: [
        {
          id: 'cpp-m1-s1-l1',
          title: { en: 'Saying hello', id: 'Menyapa' },
          goal: { en: 'Print text to the screen.', id: 'Mencetak teks ke layar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The shape of a program', id: 'Bentuk sebuah program' },
              body: {
                en: 'Every C++ program you write in this course has the same skeleton. `#include <iostream>` brings in the tools for printing and reading text. `using namespace std;` lets you write `cout` instead of `std::cout`. Your own code lives between the braces of `int main() { ... }`, and `return 0;` tells the operating system the program finished without errors.',
                id: 'Setiap program C++ yang kamu tulis di kursus ini punya kerangka yang sama. `#include <iostream>` memuat perkakas untuk mencetak dan membaca teks. `using namespace std;` membuatmu bisa menulis `cout` alih-alih `std::cout`. Kodemu sendiri ada di antara kurung kurawal `int main() { ... }`, dan `return 0;` memberitahu sistem operasi bahwa program selesai tanpa error.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Halo, dunia!" << endl;\n    return 0;\n}',
              output: 'Halo, dunia!',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'cout and <<', id: 'cout dan <<' },
              body: {
                en: '`cout` is the output stream — the thing that writes to the screen. The `<<` arrows point at it, feeding it one piece at a time. `endl` ends the line, the way pressing Enter would. Chain as many `<<` as you like on one line.',
                id: '`cout` adalah aliran keluaran — hal yang menulis ke layar. Tanda panah `<<` menunjuk ke arahnya, menyodorkan satu bagian setiap kali. `endl` mengakhiri baris, seperti menekan Enter. Kamu boleh menyambung `<<` sebanyak yang kamu mau dalam satu baris.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Nama saya Nunada" << endl;\n    cout << "Saya belajar C++" << endl;\n    return 0;\n}',
              output: 'Nama saya Nunada\nSaya belajar C++',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this program print?', id: 'Apa yang dicetak program ini?' },
              code: 'cout << "A" << endl;\ncout << "B" << endl;',
              options: [
                { en: 'A then B, on two lines', id: 'A lalu B, pada dua baris' },
                { en: 'AB on one line', id: 'AB pada satu baris' },
                { en: 'B then A, on two lines', id: 'B lalu A, pada dua baris' },
                { en: 'Nothing — the quotes are missing something', id: 'Tidak ada — tanda kutipnya kurang sesuatu' },
              ],
              answer: 0,
              explain: {
                en: 'Each endl ends its own line, and statements run in the order written.',
                id: 'Setiap endl mengakhiri barisnya sendiri, dan pernyataan dijalankan sesuai urutan penulisan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the line so it prints: Selamat datang',
                id: 'Lengkapi baris ini agar mencetak: Selamat datang',
              },
              template: '___ << "Selamat datang" << endl;',
              blanks: ['cout'],
              explain: {
                en: 'cout is the output stream every printed line starts from.',
                id: 'cout adalah aliran keluaran yang menjadi awal setiap baris yang dicetak.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Write a program that prints exactly two lines: `Halo!` then `Nama saya Nunada`.',
                id: 'Tulis program yang mencetak tepat dua baris: `Halo!` lalu `Nama saya Nunada`.',
              },
              starter:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    // tulis kodemu di bawah ini\n\n    return 0;\n}',
              tests: [
                {
                  name: { en: 'Prints both lines in order', id: 'Mencetak kedua baris berurutan' },
                  expectOutput: 'Halo!\nNama saya Nunada',
                },
              ],
              hints: [
                { en: 'You need two cout lines, each ending with endl.', id: 'Kamu butuh dua baris cout, masing-masing diakhiri endl.' },
                { en: 'The text must match exactly, including the "!".', id: 'Teksnya harus sama persis, termasuk tanda "!".' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Halo!" << endl;\n    cout << "Nama saya Nunada" << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m1-s1-l2',
          title: { en: 'Comments and mistakes', id: 'Komentar dan kesalahan' },
          goal: {
            en: 'Leave notes in code, and read what the interpreter says when it cannot understand a line.',
            id: 'Menulis catatan di kode, dan membaca apa yang dikatakan interpreter saat tak memahami sebuah baris.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Notes for humans', id: 'Catatan untuk manusia' },
              body: {
                en: 'Text after `//` is a comment — the compiler ignores the rest of that line completely. It exists for whoever reads the code later, which is usually you.',
                id: 'Teks setelah `//` adalah komentar — kompiler mengabaikan sisa baris itu sepenuhnya. Ia ada untuk siapa pun yang membaca kodenya nanti, yang biasanya dirimu sendiri.',
              },
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // this is a note, and does not run\n    cout << "Ini dijalankan" << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // ini catatan, tidak dijalankan\n    cout << "Ini dijalankan" << endl;\n    return 0;\n}',
              },
              output: 'Ini dijalankan',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Every statement ends with ;', id: 'Setiap pernyataan diakhiri ;' },
              body: {
                en: 'C++ does not care about line breaks — it cares about the semicolon. Leave one out and the interpreter stops at the next line, confused about what it was expecting instead.',
                id: 'C++ tidak peduli soal baris baru — ia peduli soal titik koma. Lupakan satu, dan interpreter berhenti di baris berikutnya, bingung tentang apa yang seharusnya ada di sana.',
              },
              code: 'int a = 5\ncout << a << endl;',
              output: "error: expected ';' before 'cout'",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Which line will actually run?', id: 'Baris mana yang benar-benar dijalankan?' },
              code: '// cout << "satu" << endl;\ncout << "dua" << endl;',
              options: [
                { en: 'Only cout << "dua"', id: 'Hanya cout << "dua"' },
                { en: 'Both lines', id: 'Kedua baris' },
                { en: 'Only cout << "satu"', id: 'Hanya cout << "satu"' },
                { en: 'Neither', id: 'Tidak keduanya' },
              ],
              answer: 0,
              explain: {
                en: 'The first line is commented out, so it never compiles into anything.',
                id: 'Baris pertama dijadikan komentar, jadi tidak pernah dikompilasi menjadi apa pun.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: { en: 'What is missing from this line?', id: 'Apa yang hilang dari baris ini?' },
              code: 'cout << "Selamat pagi" << endl',
              options: [
                { en: 'A semicolon at the end', id: 'Titik koma di akhir' },
                { en: 'cout must be uppercase', id: 'cout harus huruf besar' },
                { en: 'Strings cannot have spaces', id: 'String tidak boleh mengandung spasi' },
                { en: 'Nothing is missing', id: 'Tidak ada yang hilang' },
              ],
              answer: 0,
              explain: {
                en: 'Every statement needs a closing ;. Without it the next line looks like part of the same statement.',
                id: 'Setiap pernyataan butuh ; penutup. Tanpanya, baris berikutnya terlihat seperti bagian dari pernyataan yang sama.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Fix the broken program so it prints `Belajar C++` — and add a comment above the line explaining what it does.',
                id: 'Perbaiki program yang rusak ini agar mencetak `Belajar C++` — dan tambahkan komentar di atas barisnya yang menjelaskan fungsinya.',
              },
              starter:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Belajar C++" << endl\n    return 0;\n}',
              tests: [
                {
                  name: { en: 'Prints the right text', id: 'Mencetak teks yang benar' },
                  expectOutput: 'Belajar C++',
                },
              ],
              hints: [
                { en: 'The cout line is missing its semicolon.', id: 'Baris cout kehilangan titik koma-nya.' },
                { en: 'A comment line starts with //.', id: 'Baris komentar diawali //.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    // mencetak status belajar\n    cout << "Belajar C++" << endl;\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m1-s1-p',
        title: { en: 'Name card', id: 'Kartu nama' },
        brief: {
          en: 'Print a small name card, exactly four lines, using only cout.',
          id: 'Cetak sebuah kartu nama kecil, tepat empat baris, hanya dengan cout.',
        },
        requirements: [
          { en: 'Line 1: `=== KARTU NAMA ===`', id: 'Baris 1: `=== KARTU NAMA ===`' },
          { en: 'Line 2: `Nama  : Nunada`', id: 'Baris 2: `Nama  : Nunada`' },
          { en: 'Line 3: `Kota  : Surabaya`', id: 'Baris 3: `Kota  : Surabaya`' },
          { en: 'Line 4: `==================`', id: 'Baris 4: `==================`' },
        ],
        starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Kartu nama\n\n    return 0;\n}',
        tests: [
          {
            name: { en: 'All four lines are exact', id: 'Keempat baris tepat' },
            expectOutput: '=== KARTU NAMA ===\nNama  : Nunada\nKota  : Surabaya\n==================',
          },
        ],
        hints: [
          { en: 'Four lines means four cout << ... << endl; statements.', id: 'Empat baris berarti empat pernyataan cout << ... << endl;.' },
          { en: 'Copy the spacing in `Nama  :` carefully — two spaces.', id: 'Perhatikan spasi pada `Nama  :` dengan cermat — dua spasi.' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "=== KARTU NAMA ===" << endl;\n    cout << "Nama  : Nunada" << endl;\n    cout << "Kota  : Surabaya" << endl;\n    cout << "==================" << endl;\n    return 0;\n}',
        xp: 50,
      },
    },

    /* -------------------------------------------------- 1.2 variables & input */
    {
      id: 'cpp-m1-s2',
      title: { en: 'Variables, Types and Operators', id: 'Variabel, Tipe, dan Operator' },
      summary: {
        en: 'Give values a name and a type, compute with them, and read one from the user.',
        id: 'Beri nama dan tipe pada nilai, hitung dengannya, dan baca satu dari pengguna.',
      },
      lessons: [
        {
          id: 'cpp-m1-s2-l1',
          title: { en: 'Boxes with names and types', id: 'Kotak bernama dan bertipe' },
          goal: { en: 'Declare a typed variable and reuse it.', id: 'Mendeklarasikan variabel bertipe dan memakainya lagi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A variable needs a type', id: 'Variabel butuh tipe' },
              body: {
                en: 'Unlike some languages, C++ asks you to say up front what kind of value a variable will hold. Write the type, then the name, then `=` and the value. Once declared, the name alone reads the value back.',
                id: 'Tidak seperti sebagian bahasa lain, C++ memintamu menyatakan sejak awal jenis nilai apa yang akan disimpan sebuah variabel. Tulis tipenya, lalu namanya, lalu `=` dan nilainya. Setelah dideklarasikan, namanya saja sudah membaca nilainya kembali.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int umur = 17;\n    cout << umur << endl;\n    return 0;\n}',
              output: '17',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The four types you need first', id: 'Empat tipe yang kamu butuhkan lebih dulu' },
              body: {
                en: '`int` is a whole number, `double` is a number with a decimal point, `char` is a single character in single quotes, `bool` is true or false. This course has no `std::string`, so text stays as `char` arrays for now — you will meet those in Module 3.',
                id: '`int` adalah bilangan bulat, `double` adalah bilangan dengan titik desimal, `char` adalah satu karakter dalam kutip tunggal, `bool` adalah true atau false. Kursus ini belum punya `std::string`, jadi teks untuk sementara memakai array `char` — kamu akan mempelajarinya di Modul 3.',
              },
              code: {
                en:
                  '#include <iostream>\nusing namespace std;\n\nint main() {\n' +
                  '    int umur = 17;      // whole number\n' +
                  '    double tinggi = 1.62; // decimal number\n' +
                  "    char inisial = 'A';  // one character\n" +
                  '    bool lulus = true;   // true or false\n' +
                  '    cout << umur << endl;\n    cout << tinggi << endl;\n    cout << inisial << endl;\n    cout << lulus << endl;\n    return 0;\n}',
                id:
                  '#include <iostream>\nusing namespace std;\n\nint main() {\n' +
                  '    int umur = 17;      // bilangan bulat\n' +
                  '    double tinggi = 1.62; // bilangan desimal\n' +
                  "    char inisial = 'A';  // satu karakter\n" +
                  '    bool lulus = true;   // benar atau salah\n' +
                  '    cout << umur << endl;\n    cout << tinggi << endl;\n    cout << inisial << endl;\n    cout << lulus << endl;\n    return 0;\n}',
              },
              output: '17\n1.62\nA\n1',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'bool cukup = false;\ncout << cukup << endl;',
              options: [
                { en: '0', id: '0' },
                { en: 'false', id: 'false' },
                { en: 'False', id: 'False' },
                { en: 'An error — bool cannot be printed', id: 'Error — bool tidak bisa dicetak' },
              ],
              answer: 0,
              explain: {
                en: 'cout prints a bool as 0 or 1 by default, not as the word.',
                id: 'cout mencetak bool sebagai 0 atau 1 secara bawaan, bukan sebagai kata.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Declare a whole-number variable called `kelas` holding 10.',
                id: 'Deklarasikan variabel bilangan bulat bernama `kelas` berisi 10.',
              },
              template: '___ kelas = 10;',
              blanks: ['int'],
              explain: {
                en: 'int declares a whole-number variable.',
                id: 'int mendeklarasikan variabel bilangan bulat.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int umur = 17;` and `double tinggi = 1.7;`, then print each on its own line.',
                id: 'Deklarasikan `int umur = 17;` dan `double tinggi = 1.7;`, lalu cetak masing-masing di barisnya sendiri.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n\n    return 0;\n}',
              tests: [
                {
                  name: { en: 'Prints 17 then 1.7', id: 'Mencetak 17 lalu 1.7' },
                  expectOutput: '17\n1.7',
                },
              ],
              hints: [
                { en: 'Two variables, two types: int and double.', id: 'Dua variabel, dua tipe: int dan double.' },
                { en: 'cout << umur << endl; then cout << tinggi << endl;', id: 'cout << umur << endl; lalu cout << tinggi << endl;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int umur = 17;\n    double tinggi = 1.7;\n    cout << umur << endl;\n    cout << tinggi << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m1-s2-l2',
          title: { en: 'Arithmetic', id: 'Hitungan' },
          goal: { en: 'Compute with variables, and see how int division differs from double division.', id: 'Menghitung dengan variabel, dan melihat perbedaan pembagian int dengan double.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The operators you need', id: 'Operator yang kamu butuhkan' },
              body: {
                en: 'Use `+ - * /` as usual, and `%` for the remainder. The trap: dividing two `int`s throws away anything after the decimal point, every time — `7 / 2` is `3`, not `3.5`.',
                id: 'Gunakan `+ - * /` seperti biasa, dan `%` untuk sisa bagi. Jebakannya: membagi dua `int` selalu membuang semua yang ada di belakang koma — `7 / 2` adalah `3`, bukan `3.5`.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 7 + 3 << endl;\n    cout << 7 / 2 << endl;\n    cout << 7 % 2 << endl;\n    cout << 7.0 / 2 << endl;\n    return 0;\n}',
              output: '10\n3\n1\n3.5',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'int division hides in variables too', id: 'Pembagian int juga bersembunyi di variabel' },
              body: {
                en: 'The rule looks at the two values being divided, not what you plan to store the result in. `int a = 7, b = 2; double hasil = a / b;` still divides as int first — `hasil` ends up `3`, not `3.5`. Make at least one side a double before dividing, or write the numbers as `7.0` and `2.0` from the start.',
                id: 'Aturannya melihat dua nilai yang dibagi, bukan ke mana hasilnya akan disimpan. `int a = 7, b = 2; double hasil = a / b;` tetap membagi sebagai int lebih dulu — `hasil` menjadi `3`, bukan `3.5`. Jadikan setidaknya satu sisi double sebelum membagi, atau tulis angkanya sebagai `7.0` dan `2.0` sejak awal.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 7, b = 2;\n    double salah = a / b;\n    double benar = (double)a / b;\n    cout << salah << endl;\n    cout << benar << endl;\n    return 0;\n}',
              output: '3\n3.5',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'int a = 10, b = 4;\ncout << a % b << endl;',
              options: [
                { en: '2', id: '2' },
                { en: '2.5', id: '2.5' },
                { en: '6', id: '6' },
                { en: '40', id: '40' },
              ],
              answer: 0,
              explain: {
                en: '10 divided by 4 is 2 remainder 2, and % keeps only the remainder.',
                id: '10 dibagi 4 hasilnya 2 sisa 2, dan % hanya menyimpan sisanya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Arrange a program that prints `Total: 15`.',
                id: 'Susun program yang mencetak `Total: 15`.',
              },
              lines: [
                'int a = 7;',
                'int b = 8;',
                'int total = a + b;',
                'cout << "Total: " << total << endl;',
              ],
              explain: {
                en: 'A variable must exist before it is used, so the declarations come first.',
                id: 'Variabel harus ada sebelum dipakai, jadi deklarasinya lebih dulu.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'A rectangle is 8 wide and 5 tall. Compute its area into a variable `luas` and print exactly: `Luas: 40`.',
                id: 'Sebuah persegi panjang lebarnya 8 dan tingginya 5. Hitung luasnya ke variabel `luas` lalu cetak tepat: `Luas: 40`.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int lebar = 8;\n    int tinggi = 5;\n\n    return 0;\n}',
              tests: [
                { name: { en: 'Prints the sentence', id: 'Mencetak kalimatnya' }, expectOutput: 'Luas: 40' },
              ],
              hints: [
                { en: 'Area is width times height: use *.', id: 'Luas adalah lebar kali tinggi: gunakan *.' },
                { en: 'cout << "Luas: " << luas << endl;', id: 'cout << "Luas: " << luas << endl;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int lebar = 8;\n    int tinggi = 5;\n    int luas = lebar * tinggi;\n    cout << "Luas: " << luas << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m1-s2-l3',
          title: { en: 'Asking the user', id: 'Bertanya ke pengguna' },
          goal: { en: 'Read a number with cin.', id: 'Membaca angka dengan cin.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'cin reads into a variable', id: 'cin membaca ke sebuah variabel' },
              body: {
                en: '`cin >>` is the mirror of `cout <<`: the arrows now point at the variable, filling it from what the user types. Unlike some languages, cin already knows the type — reading into an `int` gives you a number ready to compute with, no conversion needed.',
                id: '`cin >>` adalah cerminan dari `cout <<`: tanda panahnya kini menunjuk ke variabel, mengisinya dari apa yang diketik pengguna. Tidak seperti sebagian bahasa lain, cin sudah tahu tipenya — membaca ke `int` langsung memberimu angka yang siap dihitung, tanpa perlu konversi.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int umur;\n    cout << "Umur: ";\n    cin >> umur;\n    cout << umur + 1 << endl;\n    return 0;\n}',
              output: 'Umur: 21',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One >> reads one value', id: 'Satu >> membaca satu nilai' },
              body: {
                en: 'Chain `>>` to read several values in one go, in the order written. cin skips spaces and line breaks between them, so it does not matter whether the values were typed on one line or several.',
                id: 'Sambungkan `>>` untuk membaca beberapa nilai sekaligus, sesuai urutan penulisan. cin melewati spasi dan baris baru di antaranya, jadi tidak masalah apakah nilainya diketik dalam satu baris atau beberapa.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}',
              output: '7',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The user types `5 3`. What is printed?',
                id: 'Pengguna mengetik `5 3`. Apa yang dicetak?',
              },
              code: 'int a, b;\ncin >> a >> b;\ncout << a * b << endl;',
              options: [
                { en: '15', id: '15' },
                { en: '53', id: '53' },
                { en: '8', id: '8' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'a becomes 5, b becomes 3, and a * b is 15.',
                id: 'a menjadi 5, b menjadi 3, dan a * b adalah 15.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Read a whole number into `n`.',
                id: 'Baca sebuah bilangan bulat ke `n`.',
              },
              template: 'int n;\ncin ___ n;',
              blanks: ['>>'],
              explain: {
                en: '>> is how cin reads a value into a variable.',
                id: '>> adalah cara cin membaca nilai ke sebuah variabel.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read two whole numbers `a` and `b`, then print `Jumlah: <a+b>`.',
                id: 'Baca dua bilangan bulat `a` dan `b`, lalu cetak `Jumlah: <a+b>`.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n\n    return 0;\n}',
              tests: [
                { name: { en: '3 and 4 → 7', id: '3 dan 4 → 7' }, stdin: ['3 4'], expectContains: ['Jumlah: 7'] },
                { name: { en: '10 and 20 → 30', id: '10 dan 20 → 30' }, stdin: ['10 20'], expectContains: ['Jumlah: 30'] },
              ],
              hints: [
                { en: 'a and b are already read for you.', id: 'a dan b sudah dibaca untukmu.' },
                { en: 'cout << "Jumlah: " << a + b << endl;', id: 'cout << "Jumlah: " << a + b << endl;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << "Jumlah: " << a + b << endl;\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m1-s2-p',
        title: { en: 'Temperature converter', id: 'Konverter suhu' },
        brief: {
          en: 'Read a temperature in Celsius and report it in Fahrenheit.',
          id: 'Baca suhu dalam Celsius dan laporkan dalam Fahrenheit.',
        },
        requirements: [
          { en: 'Read one whole number with cin.', id: 'Baca satu bilangan bulat dengan cin.' },
          { en: 'Convert with F = C * 9 / 5 + 32, keeping the result a whole number.', id: 'Konversi dengan F = C * 9 / 5 + 32, hasilnya tetap bilangan bulat.' },
          { en: 'Print `<C>C = <F>F`, for example `25C = 77F`.', id: 'Cetak `<C>C = <F>F`, misalnya `25C = 77F`.' },
        ],
        starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Konverter suhu Celsius ke Fahrenheit\n    int celsius;\n    cin >> celsius;\n\n    return 0;\n}',
        tests: [
          { name: { en: '25 → 77', id: '25 → 77' }, stdin: ['25'], expectContains: ['25C = 77F'] },
          { name: { en: '0 → 32', id: '0 → 32' }, stdin: ['0'], expectContains: ['0C = 32F'] },
          { name: { en: '100 → 212', id: '100 → 212' }, stdin: ['100'], expectContains: ['100C = 212F'] },
        ],
        hints: [
          { en: 'Multiply by 9 before dividing by 5, so the int division does not lose the fraction early.', id: 'Kalikan dengan 9 sebelum membagi dengan 5, agar pembagian int tidak kehilangan pecahannya lebih awal.' },
          { en: 'int fahrenheit = celsius * 9 / 5 + 32;', id: 'int fahrenheit = celsius * 9 / 5 + 32;' },
          { en: 'cout << celsius << "C = " << fahrenheit << "F" << endl;', id: 'cout << celsius << "C = " << fahrenheit << "F" << endl;' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    int celsius;\n    cin >> celsius;\n    int fahrenheit = celsius * 9 / 5 + 32;\n    cout << celsius << "C = " << fahrenheit << "F" << endl;\n    return 0;\n}',
        xp: 50,
      },
    },
  ],
}
