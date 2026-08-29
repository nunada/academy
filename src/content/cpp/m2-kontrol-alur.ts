import type { Module } from '../types'

/** Module 2 — branching and looping: the two ways a program stops running
 *  top to bottom in order. */
export const module2: Module = {
  id: 'cpp-m2',
  title: { en: 'Control Flow', id: 'Kontrol Alur' },
  summary: {
    en: 'Branching with if, else and switch, then repeating with for, while and do-while.',
    id: 'Percabangan dengan if, else, dan switch, lalu perulangan dengan for, while, dan do-while.',
  },
  submodules: [
    /* --------------------------------------------------------- 2.1 branching */
    {
      id: 'cpp-m2-s1',
      title: { en: 'Branching', id: 'Percabangan' },
      summary: {
        en: 'Run different code depending on a condition.',
        id: 'Menjalankan kode berbeda tergantung sebuah kondisi.',
      },
      lessons: [
        {
          id: 'cpp-m2-s1-l1',
          title: { en: 'if and else', id: 'if dan else' },
          goal: { en: 'Choose between two paths.', id: 'Memilih antara dua jalur.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One path or the other', id: 'Satu jalur atau yang lain' },
              body: {
                en: '`if (kondisi) { ... }` runs its block only when the condition is true. Add `else { ... }` for what happens otherwise. The parentheses around the condition are required; the braces are not, but keep them — a stray line quietly falling outside an `if` without them is a classic bug.',
                id: '`if (kondisi) { ... }` menjalankan bloknya hanya ketika kondisinya benar. Tambahkan `else { ... }` untuk yang terjadi sebaliknya. Kurung di sekitar kondisi wajib ada; kurung kurawalnya tidak, tapi pertahankan — sebuah baris yang diam-diam jatuh di luar `if` tanpanya adalah bug klasik.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai = 75;\n    if (nilai >= 60) {\n        cout << "Lulus" << endl;\n    } else {\n        cout << "Belum lulus" << endl;\n    }\n    return 0;\n}',
              output: 'Lulus',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'else if chains conditions', id: 'else if merangkai kondisi' },
              body: {
                en: 'Stack `else if` to test several conditions in order. C++ checks each one top to bottom and runs the first one that is true, skipping the rest — so put the more specific conditions first.',
                id: 'Susun `else if` untuk menguji beberapa kondisi berurutan. C++ memeriksa satu per satu dari atas ke bawah dan menjalankan yang pertama benar, melewati sisanya — jadi letakkan kondisi yang lebih spesifik lebih dulu.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai = 82;\n    if (nilai >= 90) {\n        cout << "A" << endl;\n    } else if (nilai >= 80) {\n        cout << "B" << endl;\n    } else if (nilai >= 70) {\n        cout << "C" << endl;\n    } else {\n        cout << "D" << endl;\n    }\n    return 0;\n}',
              output: 'B',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'int x = 5;\nif (x > 10) {\n    cout << "besar";\n} else if (x > 3) {\n    cout << "sedang";\n} else {\n    cout << "kecil";\n}',
              options: [
                { en: 'sedang', id: 'sedang' },
                { en: 'besar', id: 'besar' },
                { en: 'kecil', id: 'kecil' },
                { en: 'Nothing — x is never compared', id: 'Tidak ada — x tak pernah dibandingkan' },
              ],
              answer: 0,
              explain: {
                en: 'x > 10 is false, but x > 3 is true, and that branch runs before kecil is even checked.',
                id: 'x > 10 salah, tapi x > 3 benar, dan cabang itu berjalan sebelum kecil sempat diperiksa.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Print `Genap` when n is divisible by 2, otherwise `Ganjil`.',
                id: 'Cetak `Genap` bila n habis dibagi 2, jika tidak `Ganjil`.',
              },
              template: 'if (n % 2 == 0) {\n    cout << "Genap";\n} ___ {\n    cout << "Ganjil";\n}',
              blanks: ['else'],
              explain: {
                en: 'else covers every case the if did not.',
                id: 'else menutupi setiap kasus yang tidak ditangani if.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read a whole number `n`. Print `Positif` if it is greater than 0, `Negatif` if less than 0, otherwise `Nol`.',
                id: 'Baca sebuah bilangan bulat `n`. Cetak `Positif` bila lebih besar dari 0, `Negatif` bila kurang dari 0, jika tidak `Nol`.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n\n    return 0;\n}',
              tests: [
                { name: { en: '5 → Positif', id: '5 → Positif' }, stdin: ['5'], expectOutput: 'Positif' },
                { name: { en: '-3 → Negatif', id: '-3 → Negatif' }, stdin: ['-3'], expectOutput: 'Negatif' },
                { name: { en: '0 → Nol', id: '0 → Nol' }, stdin: ['0'], expectOutput: 'Nol' },
              ],
              hints: [
                { en: 'Three outcomes need if, else if, else.', id: 'Tiga kemungkinan hasil butuh if, else if, else.' },
                { en: 'Check n > 0 first, then n < 0, then whatever is left is 0.', id: 'Periksa n > 0 lebih dulu, lalu n < 0, sisanya pasti 0.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n > 0) {\n        cout << "Positif" << endl;\n    } else if (n < 0) {\n        cout << "Negatif" << endl;\n    } else {\n        cout << "Nol" << endl;\n    }\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m2-s1-l2',
          title: { en: 'Comparing and combining conditions', id: 'Membandingkan dan menggabungkan kondisi' },
          goal: { en: 'Use relational and logical operators together.', id: 'Memakai operator relasi dan logika bersamaan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Relational operators', id: 'Operator relasi' },
              body: {
                en: '`== != < > <= >=` compare two values and produce a bool. The easy mistake: `=` assigns, `==` compares. Writing `if (x = 5)` compiles but assigns 5 to x instead of testing it — always double the equals sign in a condition.',
                id: '`== != < > <= >=` membandingkan dua nilai dan menghasilkan bool. Kesalahan yang mudah terjadi: `=` menetapkan nilai, `==` membandingkan. Menulis `if (x = 5)` tetap terkompilasi tapi menetapkan 5 ke x alih-alih mengujinya — selalu gandakan tanda sama dengan dalam kondisi.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    cout << (x == 5) << endl;\n    cout << (x != 5) << endl;\n    cout << (x >= 10) << endl;\n    return 0;\n}',
              output: '1\n0\n0',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Logical operators', id: 'Operator logika' },
              body: {
                en: '`&&` is true when both sides are, `||` is true when either side is, `!` flips true and false. Combine several relational checks into one condition instead of nesting if-inside-if.',
                id: '`&&` benar ketika kedua sisinya benar, `||` benar ketika salah satu sisinya benar, `!` membalik true dan false. Gabungkan beberapa pemeriksaan relasi menjadi satu kondisi alih-alih menumpuk if di dalam if.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int umur = 20;\n    bool punyaKTP = true;\n    if (umur >= 17 && punyaKTP) {\n        cout << "Boleh memilih" << endl;\n    } else {\n        cout << "Belum boleh" << endl;\n    }\n    return 0;\n}',
              output: 'Boleh memilih',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'int n = 15;\ncout << (n % 3 == 0 || n % 5 == 0) << endl;',
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: '15', id: '15' },
                { en: 'true', id: 'true' },
              ],
              answer: 0,
              explain: {
                en: '15 is divisible by both 3 and 5, so at least one side of || is true — the result prints as 1.',
                id: '15 habis dibagi 3 maupun 5, jadi setidaknya satu sisi || benar — hasilnya dicetak sebagai 1.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Test whether n is between 1 and 100, inclusive.',
                id: 'Uji apakah n berada di antara 1 dan 100, termasuk keduanya.',
              },
              template: 'if (n >= 1 ___ n <= 100) {\n    cout << "Valid";\n}',
              blanks: ['&&'],
              explain: {
                en: 'Both sides must hold at once, so && is the right operator.',
                id: 'Kedua sisi harus terpenuhi sekaligus, jadi && adalah operator yang tepat.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read a whole number `n`. Print `Valid` if it is between 1 and 100 (inclusive), otherwise `Tidak valid`.',
                id: 'Baca sebuah bilangan bulat `n`. Cetak `Valid` bila berada di antara 1 dan 100 (termasuk keduanya), jika tidak `Tidak valid`.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n\n    return 0;\n}',
              tests: [
                { name: { en: '50 → Valid', id: '50 → Valid' }, stdin: ['50'], expectOutput: 'Valid' },
                { name: { en: '1 → Valid', id: '1 → Valid' }, stdin: ['1'], expectOutput: 'Valid' },
                { name: { en: '0 → Tidak valid', id: '0 → Tidak valid' }, stdin: ['0'], expectOutput: 'Tidak valid' },
                { name: { en: '150 → Tidak valid', id: '150 → Tidak valid' }, stdin: ['150'], expectOutput: 'Tidak valid' },
              ],
              hints: [
                { en: 'One if with && covers both edges at once.', id: 'Satu if dengan && menutupi kedua batas sekaligus.' },
                { en: 'if (n >= 1 && n <= 100) { ... } else { ... }', id: 'if (n >= 1 && n <= 100) { ... } else { ... }' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n >= 1 && n <= 100) {\n        cout << "Valid" << endl;\n    } else {\n        cout << "Tidak valid" << endl;\n    }\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m2-s1-l3',
          title: { en: 'switch and case', id: 'switch dan case' },
          goal: { en: 'Branch on one value with many exact matches.', id: 'Bercabang berdasarkan satu nilai dengan banyak kecocokan persis.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'switch tests exact values', id: 'switch menguji nilai persis' },
              body: {
                en: 'When every branch checks the same variable against exact values, `switch` reads better than a chain of `else if`. Each `case` needs its own `break;` — without one, execution falls through into the next case, running that too.',
                id: 'Ketika setiap cabang memeriksa variabel yang sama terhadap nilai persis, `switch` lebih enak dibaca daripada rangkaian `else if`. Setiap `case` butuh `break;` sendiri — tanpanya, eksekusi jatuh ke case berikutnya dan ikut menjalankannya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int hari = 3;\n    switch (hari) {\n        case 1: cout << "Senin" << endl; break;\n        case 2: cout << "Selasa" << endl; break;\n        case 3: cout << "Rabu" << endl; break;\n        default: cout << "Hari tak dikenal" << endl;\n    }\n    return 0;\n}',
              output: 'Rabu',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'default catches everything else', id: 'default menangkap sisanya' },
              body: {
                en: '`default:` runs when no `case` matched — the switch equivalent of a final `else`. It does not have to be last, but writing it last reads most naturally.',
                id: '`default:` berjalan ketika tidak ada `case` yang cocok — padanan switch untuk `else` terakhir. Ia tak harus diletakkan paling akhir, tapi menulisnya di akhir paling wajar dibaca.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int hari = 9;\n    switch (hari) {\n        case 1: cout << "Senin" << endl; break;\n        case 2: cout << "Selasa" << endl; break;\n        default: cout << "Hari tak dikenal" << endl;\n    }\n    return 0;\n}',
              output: 'Hari tak dikenal',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print? (Look closely at the breaks.)', id: 'Apa yang dicetak ini? (Perhatikan baik-baik break-nya.)' },
              code: 'int x = 1;\nswitch (x) {\n    case 1: cout << "satu ";\n    case 2: cout << "dua "; break;\n    case 3: cout << "tiga "; break;\n}',
              options: [
                { en: 'satu dua', id: 'satu dua' },
                { en: 'satu', id: 'satu' },
                { en: 'satu dua tiga', id: 'satu dua tiga' },
                { en: 'Nothing prints', id: 'Tidak ada yang dicetak' },
              ],
              answer: 0,
              explain: {
                en: 'case 1 has no break, so it falls through into case 2 and prints that too, stopping only at that break.',
                id: 'case 1 tidak punya break, jadi ia jatuh ke case 2 dan ikut mencetaknya, baru berhenti di break itu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Stop case 1 from falling into case 2.',
                id: 'Hentikan case 1 agar tidak jatuh ke case 2.',
              },
              template: 'switch (n) {\n    case 1: cout << "satu"; ___;\n    case 2: cout << "dua"; break;\n}',
              blanks: ['break'],
              explain: {
                en: 'break; ends the current case instead of falling through.',
                id: 'break; mengakhiri case saat ini alih-alih jatuh ke bawah.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read a whole number 1-4 into `hari`. Print the matching name — `Senin`, `Selasa`, `Rabu`, `Kamis` — or `Tidak dikenal` for anything else.',
                id: 'Baca sebuah bilangan bulat 1-4 ke `hari`. Cetak nama yang cocok — `Senin`, `Selasa`, `Rabu`, `Kamis` — atau `Tidak dikenal` untuk selain itu.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int hari;\n    cin >> hari;\n\n    return 0;\n}',
              tests: [
                { name: { en: '1 → Senin', id: '1 → Senin' }, stdin: ['1'], expectOutput: 'Senin' },
                { name: { en: '4 → Kamis', id: '4 → Kamis' }, stdin: ['4'], expectOutput: 'Kamis' },
                { name: { en: '9 → Tidak dikenal', id: '9 → Tidak dikenal' }, stdin: ['9'], expectOutput: 'Tidak dikenal' },
              ],
              hints: [
                { en: 'Four cases, each with its own break;.', id: 'Empat case, masing-masing dengan break; sendiri.' },
                { en: 'default: cout << "Tidak dikenal" << endl;', id: 'default: cout << "Tidak dikenal" << endl;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int hari;\n    cin >> hari;\n    switch (hari) {\n        case 1: cout << "Senin" << endl; break;\n        case 2: cout << "Selasa" << endl; break;\n        case 3: cout << "Rabu" << endl; break;\n        case 4: cout << "Kamis" << endl; break;\n        default: cout << "Tidak dikenal" << endl;\n    }\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m2-s1-p',
        title: { en: 'Grade report', id: 'Laporan nilai' },
        brief: {
          en: 'Read a score and print its letter grade.',
          id: 'Baca sebuah nilai dan cetak huruf mutunya.',
        },
        requirements: [
          { en: 'Read one whole number `nilai` with cin.', id: 'Baca satu bilangan bulat `nilai` dengan cin.' },
          { en: '90 and above is `A`, 80-89 is `B`, 70-79 is `C`, 60-69 is `D`, below 60 is `E`.', id: '90 ke atas adalah `A`, 80-89 adalah `B`, 70-79 adalah `C`, 60-69 adalah `D`, di bawah 60 adalah `E`.' },
          { en: 'Print just the letter, nothing else.', id: 'Cetak hanya hurufnya, tidak ada yang lain.' },
        ],
        starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai;\n    cin >> nilai;\n\n    return 0;\n}',
        tests: [
          { name: { en: '95 → A', id: '95 → A' }, stdin: ['95'], expectOutput: 'A' },
          { name: { en: '82 → B', id: '82 → B' }, stdin: ['82'], expectOutput: 'B' },
          { name: { en: '75 → C', id: '75 → C' }, stdin: ['75'], expectOutput: 'C' },
          { name: { en: '61 → D', id: '61 → D' }, stdin: ['61'], expectOutput: 'D' },
          { name: { en: '40 → E', id: '40 → E' }, stdin: ['40'], expectOutput: 'E' },
        ],
        hints: [
          { en: 'A chain of else if, checked from the highest boundary down, is simplest here.', id: 'Rangkaian else if, diperiksa dari batas tertinggi ke bawah, paling sederhana di sini.' },
          { en: 'if (nilai >= 90) ... else if (nilai >= 80) ... and so on.', id: 'if (nilai >= 90) ... else if (nilai >= 80) ... dan seterusnya.' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai;\n    cin >> nilai;\n    if (nilai >= 90) {\n        cout << "A" << endl;\n    } else if (nilai >= 80) {\n        cout << "B" << endl;\n    } else if (nilai >= 70) {\n        cout << "C" << endl;\n    } else if (nilai >= 60) {\n        cout << "D" << endl;\n    } else {\n        cout << "E" << endl;\n    }\n    return 0;\n}',
        xp: 50,
      },
    },

    /* --------------------------------------------------------- 2.2 looping */
    {
      id: 'cpp-m2-s2',
      title: { en: 'Looping', id: 'Perulangan' },
      summary: {
        en: 'Repeat work with for, while and do-while, and control it with break and continue.',
        id: 'Mengulang pekerjaan dengan for, while, dan do-while, serta mengendalikannya dengan break dan continue.',
      },
      lessons: [
        {
          id: 'cpp-m2-s2-l1',
          title: { en: 'The for loop', id: 'Perulangan for' },
          goal: { en: 'Repeat a known number of times.', id: 'Mengulang sejumlah kali yang sudah diketahui.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three parts, one line', id: 'Tiga bagian, satu baris' },
              body: {
                en: '`for (mulai; syarat; langkah)` packs a loop\'s whole life into one line: `mulai` runs once before the loop starts, `syarat` is checked before every round, `langkah` runs after every round. Reach for `for` whenever you already know how many times to repeat.',
                id: '`for (mulai; syarat; langkah)` memadatkan seluruh hidup sebuah perulangan ke satu baris: `mulai` berjalan sekali sebelum perulangan dimulai, `syarat` diperiksa sebelum setiap putaran, `langkah` berjalan setelah setiap putaran. Pakai `for` kapan pun kamu sudah tahu berapa kali harus mengulang.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << i << " ";\n    }\n    cout << endl;\n    return 0;\n}',
              output: '1 2 3 4 5 ',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'i is gone once the loop ends', id: 'i lenyap setelah perulangan berakhir' },
              body: {
                en: 'A variable declared inside `for (...)` only exists for the loop\'s lifetime. This lets you reuse `i` as a loop counter in a later loop without any conflict — each `for` gets its own.',
                id: 'Variabel yang dideklarasikan di dalam `for (...)` hanya ada selama perulangan berlangsung. Ini membuatmu bisa memakai ulang `i` sebagai penghitung di perulangan berikutnya tanpa konflik — setiap `for` punya miliknya sendiri.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int total = 0;\n    for (int i = 1; i <= 5; i++) {\n        total += i;\n    }\n    cout << total << endl;\n    return 0;\n}',
              output: '15',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'How many times does this loop run?', id: 'Berapa kali perulangan ini berjalan?' },
              code: 'for (int i = 0; i < 5; i++) {\n    cout << i;\n}',
              options: [
                { en: '5 times (0,1,2,3,4)', id: '5 kali (0,1,2,3,4)' },
                { en: '4 times', id: '4 kali' },
                { en: '6 times (0..5)', id: '6 kali (0..5)' },
                { en: 'Forever', id: 'Selamanya' },
              ],
              answer: 0,
              explain: {
                en: 'i starts at 0 and the loop stops the moment i is no longer < 5, so it runs for i = 0,1,2,3,4.',
                id: 'i dimulai dari 0 dan perulangan berhenti begitu i tidak lagi < 5, jadi ia berjalan untuk i = 0,1,2,3,4.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Count down from 5 to 1.',
                id: 'Hitung mundur dari 5 ke 1.',
              },
              template: 'for (int i = 5; i >= 1; ___) {\n    cout << i << " ";\n}',
              blanks: ['i--'],
              explain: {
                en: 'i-- decreases i by one each round, matching the count-down.',
                id: 'i-- mengurangi i satu setiap putaran, sesuai hitungan mundur.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read a whole number `n`. Print the sum 1 + 2 + ... + n as a single number.',
                id: 'Baca sebuah bilangan bulat `n`. Cetak jumlah 1 + 2 + ... + n sebagai satu angka.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int total = 0;\n\n    return 0;\n}',
              tests: [
                { name: { en: 'n=5 → 15', id: 'n=5 → 15' }, stdin: ['5'], expectOutput: '15' },
                { name: { en: 'n=10 → 55', id: 'n=10 → 55' }, stdin: ['10'], expectOutput: '55' },
                { name: { en: 'n=1 → 1', id: 'n=1 → 1' }, stdin: ['1'], expectOutput: '1' },
              ],
              hints: [
                { en: 'for (int i = 1; i <= n; i++) total += i;', id: 'for (int i = 1; i <= n; i++) total += i;' },
                { en: 'Print total after the loop ends.', id: 'Cetak total setelah perulangan berakhir.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int total = 0;\n    for (int i = 1; i <= n; i++) {\n        total += i;\n    }\n    cout << total << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m2-s2-l2',
          title: { en: 'while and do-while', id: 'while dan do-while' },
          goal: { en: 'Repeat until a condition changes.', id: 'Mengulang sampai sebuah kondisi berubah.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'while checks first', id: 'while memeriksa lebih dulu' },
              body: {
                en: '`while (syarat) { ... }` repeats for as long as the condition holds, checked before every round — including the very first. Reach for it when you do not know in advance how many rounds it will take.',
                id: '`while (syarat) { ... }` mengulang selama kondisinya terpenuhi, diperiksa sebelum setiap putaran — termasuk yang pertama. Pakai ini ketika kamu belum tahu sejak awal akan butuh berapa putaran.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 5, fakt = 1;\n    while (n > 1) {\n        fakt *= n;\n        n--;\n    }\n    cout << fakt << endl;\n    return 0;\n}',
              output: '120',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'do-while checks last', id: 'do-while memeriksa terakhir' },
              body: {
                en: '`do { ... } while (syarat);` runs its block once no matter what, and only then checks the condition. Useful for anything that must happen at least once — asking the user a question before deciding whether to ask again.',
                id: '`do { ... } while (syarat);` menjalankan bloknya sekali apa pun yang terjadi, dan baru sesudahnya memeriksa kondisinya. Berguna untuk apa pun yang harus terjadi setidaknya sekali — menanyakan sesuatu ke pengguna sebelum memutuskan apakah perlu bertanya lagi.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int i = 0;\n    do {\n        cout << i << " ";\n        i++;\n    } while (i < 3);\n    cout << endl;\n    return 0;\n}',
              output: '0 1 2 ',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'How many times does the block run?', id: 'Berapa kali blok ini berjalan?' },
              code: 'int i = 10;\ndo {\n    cout << i;\n    i++;\n} while (i < 5);',
              options: [
                { en: 'Once', id: 'Sekali' },
                { en: 'Zero times', id: 'Nol kali' },
                { en: 'Forever', id: 'Selamanya' },
                { en: '5 times', id: '5 kali' },
              ],
              answer: 0,
              explain: {
                en: 'do-while always runs its block before checking, so it runs once even though i < 5 is already false.',
                id: 'do-while selalu menjalankan bloknya sebelum memeriksa, jadi ia berjalan sekali walau i < 5 sudah salah sejak awal.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Print doubling powers of 2 while they stay under 100: 1 2 4 8 16 32 64.',
                id: 'Cetak pangkat dua yang berlipat ganda selama masih di bawah 100: 1 2 4 8 16 32 64.',
              },
              template: 'int x = 1;\nwhile (x ___ 100) {\n    cout << x << " ";\n    x *= 2;\n}',
              blanks: ['<'],
              explain: {
                en: 'The loop must stop once x reaches or passes 100, so the condition is x < 100.',
                id: 'Perulangan harus berhenti begitu x mencapai atau melewati 100, jadi kondisinya x < 100.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read a whole number `n` greater than 1. Print how many times it can be divided by 2 before it drops to 1 or below (integer division).',
                id: 'Baca bilangan bulat `n` lebih besar dari 1. Cetak berapa kali ia bisa dibagi 2 sebelum turun ke 1 atau kurang (pembagian bilangan bulat).',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int langkah = 0;\n\n    return 0;\n}',
              tests: [
                { name: { en: 'n=8 → 3', id: 'n=8 → 3' }, stdin: ['8'], expectOutput: '3' },
                { name: { en: 'n=16 → 4', id: 'n=16 → 4' }, stdin: ['16'], expectOutput: '4' },
                { name: { en: 'n=2 → 1', id: 'n=2 → 1' }, stdin: ['2'], expectOutput: '1' },
              ],
              hints: [
                { en: 'while (n > 1) { n /= 2; langkah++; }', id: 'while (n > 1) { n /= 2; langkah++; }' },
                { en: 'Print langkah after the loop ends.', id: 'Cetak langkah setelah perulangan berakhir.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int langkah = 0;\n    while (n > 1) {\n        n /= 2;\n        langkah++;\n    }\n    cout << langkah << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m2-s2-l3',
          title: { en: 'break, continue, and nesting', id: 'break, continue, dan penyarangan' },
          goal: { en: 'Leave a loop early, skip a round, and put one loop inside another.', id: 'Keluar dari perulangan lebih awal, melewati satu putaran, dan meletakkan perulangan di dalam perulangan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'break leaves, continue skips', id: 'break keluar, continue melewati' },
              body: {
                en: '`break;` stops the loop immediately, running nothing more of it. `continue;` stops just the current round and jumps to the next one — the loop keeps going, only this round is cut short.',
                id: '`break;` menghentikan perulangan seketika, tidak menjalankan sisanya sama sekali. `continue;` hanya menghentikan putaran saat ini dan melompat ke putaran berikutnya — perulangan tetap berlanjut, hanya putaran ini yang dipotong.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 10; i++) {\n        if (i % 2 == 0) continue;\n        if (i > 7) break;\n        cout << i << " ";\n    }\n    cout << endl;\n    return 0;\n}',
              output: '1 3 5 7 ',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A loop inside a loop', id: 'Perulangan di dalam perulangan' },
              body: {
                en: 'Nesting one `for` inside another is how a grid — rows and columns — gets visited. The inner loop finishes completely for every single round of the outer one.',
                id: 'Menyarangkan satu `for` di dalam yang lain adalah cara sebuah kisi — baris dan kolom — dikunjungi. Perulangan dalam selesai sepenuhnya untuk setiap satu putaran perulangan luar.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int baris = 1; baris <= 3; baris++) {\n        for (int kolom = 1; kolom <= 3; kolom++) {\n            cout << baris * kolom << " ";\n        }\n        cout << endl;\n    }\n    return 0;\n}',
              output: '1 2 3 \n2 4 6 \n3 6 9 ',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'A break inside the inner loop of a nested pair — what does it stop?', id: 'break di dalam perulangan dalam pada sepasang perulangan bersarang — apa yang dihentikannya?' },
              code: 'for (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        if (j == 1) break;\n        cout << i << j << " ";\n    }\n}',
              options: [
                { en: 'Only the inner loop — the outer one keeps going', id: 'Hanya perulangan dalam — yang luar tetap berjalan' },
                { en: 'Both loops at once', id: 'Kedua perulangan sekaligus' },
                { en: 'Nothing — break only works in a for by itself', id: 'Tidak ada — break hanya bekerja di for tunggal' },
                { en: 'Only the outer loop', id: 'Hanya perulangan luar' },
              ],
              answer: 0,
              explain: {
                en: 'break only ever leaves the loop it is directly written inside — here, the inner one. The outer loop moves on to its next i.',
                id: 'break hanya pernah keluar dari perulangan tempat ia langsung ditulis — di sini, yang dalam. Perulangan luar tetap lanjut ke i berikutnya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Arrange a loop that prints every number from 1 to 20 that is NOT divisible by 3.',
                id: 'Susun perulangan yang mencetak setiap angka dari 1 sampai 20 yang TIDAK habis dibagi 3.',
              },
              lines: [
                'for (int i = 1; i <= 20; i++) {',
                'if (i % 3 == 0) continue;',
                'cout << i << " ";',
                '}',
              ],
              explain: {
                en: 'The check and its continue must come before the print, or the print would run for every number.',
                id: 'Pemeriksaan beserta continue-nya harus lebih dulu dari cetaknya, atau cetaknya akan berjalan untuk setiap angka.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Print a 5x5 grid of `*`, one row per line, using a nested loop.',
                id: 'Cetak kisi `*` berukuran 5x5, satu baris per baris cetak, memakai perulangan bersarang.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n\n    return 0;\n}',
              tests: [
                {
                  name: { en: 'Prints five rows of five stars', id: 'Mencetak lima baris lima bintang' },
                  expectOutput: '*****\n*****\n*****\n*****\n*****',
                },
              ],
              hints: [
                { en: 'Outer loop for rows, inner loop for the stars in one row.', id: 'Perulangan luar untuk baris, perulangan dalam untuk bintang di satu baris.' },
                { en: 'End each row with cout << endl; after the inner loop finishes.', id: 'Akhiri setiap baris dengan cout << endl; setelah perulangan dalam selesai.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int baris = 1; baris <= 5; baris++) {\n        for (int kolom = 1; kolom <= 5; kolom++) {\n            cout << "*";\n        }\n        cout << endl;\n    }\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m2-s2-p',
        title: { en: 'Multiplication table', id: 'Tabel perkalian' },
        brief: {
          en: 'Read a whole number and print its multiplication table from 1 to 10.',
          id: 'Baca sebuah bilangan bulat dan cetak tabel perkaliannya dari 1 sampai 10.',
        },
        requirements: [
          { en: 'Read one whole number `n`.', id: 'Baca satu bilangan bulat `n`.' },
          { en: 'Print ten lines, formatted exactly `n x i = hasil` for i from 1 to 10.', id: 'Cetak sepuluh baris, berformat tepat `n x i = hasil` untuk i dari 1 sampai 10.' },
          { en: 'For n = 3, the first line is `3 x 1 = 3` and the last is `3 x 10 = 30`.', id: 'Untuk n = 3, baris pertama adalah `3 x 1 = 3` dan terakhir `3 x 10 = 30`.' },
        ],
        starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n\n    return 0;\n}',
        tests: [
          {
            name: { en: 'n=3 gives all ten lines', id: 'n=3 menghasilkan sepuluh baris' },
            stdin: ['3'],
            expectOutput:
              '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
          },
          {
            name: { en: 'n=7 gives the right last line', id: 'n=7 menghasilkan baris terakhir yang benar' },
            stdin: ['7'],
            expectContains: ['7 x 10 = 70'],
          },
        ],
        hints: [
          { en: 'for (int i = 1; i <= 10; i++) { ... }', id: 'for (int i = 1; i <= 10; i++) { ... }' },
          { en: 'cout << n << " x " << i << " = " << n * i << endl;', id: 'cout << n << " x " << i << " = " << n * i << endl;' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= 10; i++) {\n        cout << n << " x " << i << " = " << n * i << endl;\n    }\n    return 0;\n}',
        xp: 50,
      },
    },
  ],
}
