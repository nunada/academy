import type { Module } from '../types'

/** Module 3 — arrays, then the C-style strings built on top of a char array. */
export const module3: Module = {
  id: 'cpp-m3',
  title: { en: 'Arrays and C-Strings', id: 'Array dan C-String' },
  summary: {
    en: 'Store many values under one name, then use that to hold and edit text.',
    id: 'Menyimpan banyak nilai di bawah satu nama, lalu memakainya untuk menampung dan mengubah teks.',
  },
  submodules: [
    /* ------------------------------------------------------------- 3.1 array */
    {
      id: 'cpp-m3-s1',
      title: { en: 'Arrays', id: 'Array' },
      summary: {
        en: 'A fixed-size row of values of the same type, reached by position.',
        id: 'Sebaris nilai bertipe sama dengan ukuran tetap, diakses lewat posisinya.',
      },
      lessons: [
        {
          id: 'cpp-m3-s1-l1',
          title: { en: 'Declaring and indexing', id: 'Deklarasi dan indeks' },
          goal: { en: 'Store several values under one name.', id: 'Menyimpan beberapa nilai di bawah satu nama.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A row of boxes', id: 'Sebaris kotak' },
              body: {
                en: '`int nilai[5];` reserves five int-sized boxes in a row, all named `nilai`. Reach one with `nilai[i]` — `i` is the index, counted from 0. The first box is `nilai[0]`, the last is `nilai[4]`.',
                id: '`int nilai[5];` memesan lima kotak berukuran int berjajar, semuanya bernama `nilai`. Raih satu dengan `nilai[i]` — `i` adalah indeksnya, dihitung dari 0. Kotak pertama adalah `nilai[0]`, terakhir `nilai[4]`.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5];\n    nilai[0] = 80;\n    nilai[1] = 90;\n    cout << nilai[0] << " " << nilai[1] << endl;\n    return 0;\n}',
              output: '80 90',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Filling it in at once', id: 'Mengisi sekaligus' },
              body: {
                en: 'List the values in `{ }` at declaration time and the size can even be counted for you. This is usually easier to read than one assignment per box.',
                id: 'Sebutkan nilainya di dalam `{ }` saat deklarasi, ukurannya bahkan bisa dihitung sendiri untukmu. Ini biasanya lebih mudah dibaca daripada satu penetapan nilai per kotak.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {80, 90, 70, 85, 75};\n    cout << nilai[2] << endl;\n    cout << nilai[4] << endl;\n    return 0;\n}',
              output: '70\n75',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does arr[2] hold?', id: 'Apa isi arr[2]?' },
              code: 'int arr[4] = {10, 20, 30, 40};',
              options: [
                { en: '30', id: '30' },
                { en: '20', id: '20' },
                { en: '2', id: '2' },
                { en: 'An error — there is no index 2', id: 'Error — tidak ada indeks 2' },
              ],
              answer: 0,
              explain: {
                en: 'Counting from 0: arr[0]=10, arr[1]=20, arr[2]=30, arr[3]=40.',
                id: 'Menghitung dari 0: arr[0]=10, arr[1]=20, arr[2]=30, arr[3]=40.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Declare an array of 3 doubles holding 1.5, 2.5 and 3.5.',
                id: 'Deklarasikan array 3 double berisi 1.5, 2.5, dan 3.5.',
              },
              template: 'double x[3] = ___;',
              blanks: ['{1.5, 2.5, 3.5}'],
              explain: {
                en: 'Braces list the values in order, one per box.',
                id: 'Kurung kurawal menyebutkan nilainya berurutan, satu per kotak.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int nilai[4] = {70, 85, 90, 60};`. Print `nilai[0]` and `nilai[3]`, each on its own line.',
                id: 'Deklarasikan `int nilai[4] = {70, 85, 90, 60};`. Cetak `nilai[0]` dan `nilai[3]`, masing-masing di barisnya sendiri.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n\n    return 0;\n}',
              tests: [{ name: { en: 'Prints 70 then 60', id: 'Mencetak 70 lalu 60' }, expectOutput: '70\n60' }],
              hints: [
                { en: 'int nilai[4] = {70, 85, 90, 60};', id: 'int nilai[4] = {70, 85, 90, 60};' },
                { en: 'nilai[0] is the first, nilai[3] is the last.', id: 'nilai[0] adalah yang pertama, nilai[3] adalah yang terakhir.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[4] = {70, 85, 90, 60};\n    cout << nilai[0] << endl;\n    cout << nilai[3] << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m3-s1-l2',
          title: { en: 'Looping over an array', id: 'Perulangan atas array' },
          goal: { en: 'Total, average and find the largest value.', id: 'Menjumlah, merata-rata, dan mencari nilai terbesar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A for loop visits every box', id: 'Perulangan for mengunjungi setiap kotak' },
              body: {
                en: 'Loop `i` from 0 up to (but not including) the array\'s length, and `arr[i]` reaches every value in turn. This is the pattern behind almost everything you do with an array: sum it, search it, print it.',
                id: 'Putar `i` dari 0 sampai (tapi tidak termasuk) panjang array, dan `arr[i]` menjangkau setiap nilainya secara berurutan. Ini adalah pola di balik hampir semua yang kamu lakukan dengan array: menjumlahkannya, mencarinya, mencetaknya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {80, 90, 70, 85, 75};\n    int total = 0;\n    for (int i = 0; i < 5; i++) {\n        total += nilai[i];\n    }\n    cout << total << endl;\n    return 0;\n}',
              output: '400',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Tracking the largest so far', id: 'Melacak yang terbesar sejauh ini' },
              body: {
                en: 'Start by assuming the first element is the largest, then compare every later one against what you have so far, keeping whichever wins. The same shape finds the smallest — just flip the comparison.',
                id: 'Mulai dengan menganggap elemen pertama yang terbesar, lalu bandingkan setiap elemen berikutnya dengan yang sejauh ini, simpan mana pun yang menang. Bentuk yang sama dipakai untuk mencari yang terkecil — tinggal balik perbandingannya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {80, 90, 70, 85, 75};\n    int terbesar = nilai[0];\n    for (int i = 1; i < 5; i++) {\n        if (nilai[i] > terbesar) {\n            terbesar = nilai[i];\n        }\n    }\n    cout << terbesar << endl;\n    return 0;\n}',
              output: '90',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Why does the loop start terbesar at nilai[0] instead of 0?', id: 'Mengapa perulangan memulai terbesar dari nilai[0], bukan 0?' },
              code: 'int nilai[3] = {-5, -2, -8};\nint terbesar = nilai[0];\nfor (int i = 1; i < 3; i++) {\n    if (nilai[i] > terbesar) terbesar = nilai[i];\n}',
              options: [
                { en: 'So it still works when every value is negative', id: 'Agar tetap benar walau semua nilainya negatif' },
                { en: 'Because nilai[0] is always the biggest', id: 'Karena nilai[0] selalu yang terbesar' },
                { en: 'It makes no difference either way', id: 'Tidak ada bedanya sama sekali' },
                { en: 'Because arrays cannot start at 0', id: 'Karena array tidak boleh dimulai dari 0' },
              ],
              answer: 0,
              explain: {
                en: 'Starting from 0 would wrongly say the largest of {-5,-2,-8} is 0 — a value that is not even in the array.',
                id: 'Memulai dari 0 akan salah menyimpulkan yang terbesar dari {-5,-2,-8} adalah 0 — nilai yang bahkan tidak ada di array itu.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Arrange the loop that computes the average of a 4-element array `nilai`.',
                id: 'Susun perulangan yang menghitung rata-rata array `nilai` berisi 4 elemen.',
              },
              lines: [
                'int total = 0;',
                'for (int i = 0; i < 4; i++) {',
                'total += nilai[i];',
                '}',
                'double rata = (double)total / 4;',
              ],
              explain: {
                en: 'total must exist and start at 0 before the loop adds to it, and the average is only computed once the sum is complete.',
                id: 'total harus ada dan dimulai dari 0 sebelum perulangan menambahkannya, dan rata-ratanya baru dihitung setelah jumlahnya lengkap.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int nilai[5] = {70, 80, 90, 60, 100};`. Print the smallest value.',
                id: 'Deklarasikan `int nilai[5] = {70, 80, 90, 60, 100};`. Cetak nilai terkecilnya.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {70, 80, 90, 60, 100};\n\n    return 0;\n}',
              tests: [{ name: { en: 'Smallest is 60', id: 'Terkecil adalah 60' }, expectOutput: '60' }],
              hints: [
                { en: 'Start terkecil at nilai[0], same shape as finding the largest.', id: 'Mulai terkecil dari nilai[0], bentuknya sama seperti mencari terbesar.' },
                { en: 'Flip > to < in the comparison.', id: 'Balik > menjadi < dalam perbandingannya.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {70, 80, 90, 60, 100};\n    int terkecil = nilai[0];\n    for (int i = 1; i < 5; i++) {\n        if (nilai[i] < terkecil) {\n            terkecil = nilai[i];\n        }\n    }\n    cout << terkecil << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m3-s1-l3',
          title: { en: 'Two-dimensional arrays', id: 'Array dua dimensi' },
          goal: { en: 'Store a grid of values, rows and columns.', id: 'Menyimpan kisi nilai, baris dan kolom.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An array of rows', id: 'Array berisi baris-baris' },
              body: {
                en: '`int m[2][3];` is a grid with 2 rows and 3 columns. Reach a cell with `m[baris][kolom]`, both counted from 0. Initialise it with nested braces, one inner `{ }` per row.',
                id: '`int m[2][3];` adalah kisi berukuran 2 baris dan 3 kolom. Raih satu sel dengan `m[baris][kolom]`, keduanya dihitung dari 0. Inisialisasi dengan kurung kurawal bersarang, satu `{ }` bagian dalam per baris.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    cout << m[0][0] << endl;\n    cout << m[1][2] << endl;\n    return 0;\n}',
              output: '1\n6',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two nested loops', id: 'Dua perulangan bersarang' },
              body: {
                en: 'Visiting every cell of a grid takes one loop for the row and one for the column, nested — exactly the pattern from the last module\'s printed grid.',
                id: 'Mengunjungi setiap sel sebuah kisi membutuhkan satu perulangan untuk baris dan satu untuk kolom, bersarang — persis pola dari kisi yang dicetak di modul sebelumnya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    int total = 0;\n    for (int b = 0; b < 2; b++) {\n        for (int k = 0; k < 3; k++) {\n            total += m[b][k];\n        }\n    }\n    cout << total << endl;\n    return 0;\n}',
              output: '21',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is m[1][0] here?', id: 'Berapa m[1][0] di sini?' },
              code: 'int m[3][2] = {{5, 6}, {7, 8}, {9, 10}};',
              options: [
                { en: '7', id: '7' },
                { en: '6', id: '6' },
                { en: '5', id: '5' },
                { en: '8', id: '8' },
              ],
              answer: 0,
              explain: {
                en: 'Row 1 (the second row, counting from 0) is {7, 8}, and column 0 of it is 7.',
                id: 'Baris 1 (baris kedua, dihitung dari 0) adalah {7, 8}, dan kolom 0-nya adalah 7.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Reach the cell in row 2, column 1.',
                id: 'Raih sel di baris 2, kolom 1.',
              },
              template: 'cout << m___[1] << endl;',
              blanks: ['[2]'],
              explain: {
                en: 'The row index comes first: m[2][1].',
                id: 'Indeks baris datang lebih dulu: m[2][1].',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int m[2][2] = {{3, 5}, {7, 9}};`. Print the sum of each row on its own line: row 0 first, then row 1.',
                id: 'Deklarasikan `int m[2][2] = {{3, 5}, {7, 9}};`. Cetak jumlah setiap baris di barisnya sendiri: baris 0 lebih dulu, lalu baris 1.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int m[2][2] = {{3, 5}, {7, 9}};\n\n    return 0;\n}',
              tests: [{ name: { en: 'Prints 8 then 16', id: 'Mencetak 8 lalu 16' }, expectOutput: '8\n16' }],
              hints: [
                { en: 'One outer loop for the row, one inner loop adding up its columns.', id: 'Satu perulangan luar untuk baris, satu perulangan dalam menjumlahkan kolomnya.' },
                { en: 'Print the row total right after its inner loop finishes.', id: 'Cetak jumlah baris tepat setelah perulangan dalamnya selesai.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int m[2][2] = {{3, 5}, {7, 9}};\n    for (int b = 0; b < 2; b++) {\n        int total = 0;\n        for (int k = 0; k < 2; k++) {\n            total += m[b][k];\n        }\n        cout << total << endl;\n    }\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m3-s1-p',
        title: { en: 'Class statistics', id: 'Statistik kelas' },
        brief: {
          en: 'Read five scores into an array and report the total, average, and highest.',
          id: 'Baca lima nilai ke dalam array dan laporkan jumlah, rata-rata, dan tertingginya.',
        },
        requirements: [
          { en: 'Read five whole numbers into an array of size 5.', id: 'Baca lima bilangan bulat ke dalam array berukuran 5.' },
          { en: 'Print `Total: <jumlah>` on the first line.', id: 'Cetak `Total: <jumlah>` di baris pertama.' },
          { en: 'Print `Rata-rata: <rata>` on the second — a double, computed without losing the fraction.', id: 'Cetak `Rata-rata: <rata>` di baris kedua — sebuah double, dihitung tanpa kehilangan pecahannya.' },
          { en: 'Print `Tertinggi: <maks>` on the third.', id: 'Cetak `Tertinggi: <maks>` di baris ketiga.' },
        ],
        starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5];\n    for (int i = 0; i < 5; i++) {\n        cin >> nilai[i];\n    }\n\n    return 0;\n}',
        tests: [
          {
            name: { en: '70 80 90 60 100', id: '70 80 90 60 100' },
            stdin: ['70 80 90 60 100'],
            expectOutput: 'Total: 400\nRata-rata: 80\nTertinggi: 100',
          },
          {
            name: { en: '50 50 50 50 50', id: '50 50 50 50 50' },
            stdin: ['50 50 50 50 50'],
            expectOutput: 'Total: 250\nRata-rata: 50\nTertinggi: 50',
          },
        ],
        hints: [
          { en: 'Sum the array first, the same loop from the last lesson.', id: 'Jumlahkan array-nya lebih dulu, perulangan yang sama dari pelajaran sebelumnya.' },
          { en: 'double rata = (double)total / 5;', id: 'double rata = (double)total / 5;' },
          { en: 'Find the highest with the "start from index 0, compare the rest" pattern.', id: 'Cari yang tertinggi dengan pola "mulai dari indeks 0, bandingkan sisanya".' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5];\n    for (int i = 0; i < 5; i++) {\n        cin >> nilai[i];\n    }\n    int total = 0;\n    int maks = nilai[0];\n    for (int i = 0; i < 5; i++) {\n        total += nilai[i];\n        if (nilai[i] > maks) maks = nilai[i];\n    }\n    double rata = (double)total / 5;\n    cout << "Total: " << total << endl;\n    cout << "Rata-rata: " << rata << endl;\n    cout << "Tertinggi: " << maks << endl;\n    return 0;\n}',
        xp: 50,
      },
    },

    /* ---------------------------------------------------------- 3.2 strings */
    {
      id: 'cpp-m3-s2',
      title: { en: 'C-Strings', id: 'C-String' },
      summary: {
        en: 'Text as a char array, and the <cstring> functions built around it.',
        id: 'Teks sebagai array char, dan fungsi-fungsi <cstring> yang dibangun di sekitarnya.',
      },
      lessons: [
        {
          id: 'cpp-m3-s2-l1',
          title: { en: 'A char array holding text', id: 'Array char berisi teks' },
          goal: { en: 'Declare, print and read a piece of text.', id: 'Mendeklarasikan, mencetak, dan membaca sepotong teks.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Text is a row of characters', id: 'Teks adalah sebaris karakter' },
              body: {
                en: 'Without `std::string`, text is a `char` array — a row of single characters ending in an invisible marker C++ adds for you when you write it as `"..."`. Give the array room for the longest text you expect, plus a little.',
                id: 'Tanpa `std::string`, teks adalah array `char` — sebaris karakter tunggal yang diakhiri penanda tak terlihat yang ditambahkan C++ sendiri saat kamu menulisnya sebagai `"..."`. Beri array-nya ruang untuk teks terpanjang yang kamu perkirakan, plus sedikit lebih.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char nama[20] = "Nunada";\n    cout << nama << endl;\n    return 0;\n}',
              output: 'Nunada',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reading one word', id: 'Membaca satu kata' },
              body: {
                en: '`cin >> nama` fills a char array the same way it fills a number — but it stops at the first space, so it reads exactly one word. A full name with a space in it needs a different tool, later in this course.',
                id: '`cin >> nama` mengisi array char dengan cara yang sama seperti mengisi angka — tapi ia berhenti di spasi pertama, jadi ia membaca tepat satu kata. Nama lengkap dengan spasi di dalamnya butuh perkakas lain, nanti di kursus ini.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char nama[20];\n    cin >> nama;\n    cout << "Halo, " << nama << "!" << endl;\n    return 0;\n}',
              output: 'Halo, Budi!',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'The user types `Ani Kusuma`. What does nama hold after `cin >> nama;`?', id: 'Pengguna mengetik `Ani Kusuma`. Apa isi nama setelah `cin >> nama;`?' },
              code: 'char nama[20];\ncin >> nama;',
              options: [
                { en: '"Ani"', id: '"Ani"' },
                { en: '"Ani Kusuma"', id: '"Ani Kusuma"' },
                { en: '"Kusuma"', id: '"Kusuma"' },
                { en: 'An empty string', id: 'String kosong' },
              ],
              answer: 0,
              explain: {
                en: 'cin >> stops reading at the first space, so only the first word ends up in nama.',
                id: 'cin >> berhenti membaca di spasi pertama, jadi hanya kata pertama yang masuk ke nama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Declare a char array with room for up to 30 characters, called `kota`.',
                id: 'Deklarasikan array char dengan ruang hingga 30 karakter, bernama `kota`.',
              },
              template: 'char kota___;',
              blanks: ['[30]'],
              explain: {
                en: 'The number in brackets is how many characters the array can hold.',
                id: 'Angka di dalam kurung siku adalah berapa banyak karakter yang bisa ditampung array-nya.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read one word into `kota` and print `Kota: <kota>`.',
                id: 'Baca satu kata ke `kota` lalu cetak `Kota: <kota>`.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char kota[30];\n    cin >> kota;\n\n    return 0;\n}',
              tests: [
                { name: { en: 'Surabaya → Kota: Surabaya', id: 'Surabaya → Kota: Surabaya' }, stdin: ['Surabaya'], expectOutput: 'Kota: Surabaya' },
                { name: { en: 'Malang → Kota: Malang', id: 'Malang → Kota: Malang' }, stdin: ['Malang'], expectOutput: 'Kota: Malang' },
              ],
              hints: [{ en: 'cout << "Kota: " << kota << endl;', id: 'cout << "Kota: " << kota << endl;' }],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    char kota[30];\n    cin >> kota;\n    cout << "Kota: " << kota << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m3-s2-l2',
          title: { en: '<cstring>: length, copy, join', id: '<cstring>: panjang, salin, gabung' },
          goal: { en: 'Use strlen, strcpy and strcat.', id: 'Memakai strlen, strcpy, dan strcat.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'strlen counts characters', id: 'strlen menghitung karakter' },
              body: {
                en: '`#include <cstring>` brings in functions built for char arrays. `strlen(s)` counts the characters up to (not including) the invisible end marker.',
                id: '`#include <cstring>` memuat fungsi-fungsi yang dibangun untuk array char. `strlen(s)` menghitung karakter sampai (tidak termasuk) penanda akhir yang tak terlihat.',
              },
              code: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char nama[20] = "Nunada";\n    cout << strlen(nama) << endl;\n    return 0;\n}',
              output: '6',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'strcpy replaces, strcat appends', id: 'strcpy mengganti, strcat menambahkan' },
              body: {
                en: '`strcpy(tujuan, sumber)` overwrites `tujuan` with a copy of `sumber`. `strcat(tujuan, sumber)` instead adds `sumber` onto the end of whatever `tujuan` already holds — `tujuan` needs enough room left for both.',
                id: '`strcpy(tujuan, sumber)` menimpa `tujuan` dengan salinan `sumber`. `strcat(tujuan, sumber)` sebaliknya menambahkan `sumber` ke ujung apa pun yang sudah dimiliki `tujuan` — `tujuan` butuh ruang tersisa yang cukup untuk keduanya.',
              },
              code: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char kalimat[30];\n    strcpy(kalimat, "Halo");\n    strcat(kalimat, ",");\n    strcat(kalimat, " dunia!");\n    cout << kalimat << endl;\n    return 0;\n}',
              output: 'Halo, dunia!',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'char s[20] = "Belajar";\nstrcat(s, " C++");\ncout << strlen(s) << endl;',
              options: [
                { en: '11', id: '11' },
                { en: '7', id: '7' },
                { en: '4', id: '4' },
                { en: '20', id: '20' },
              ],
              answer: 0,
              explain: {
                en: '"Belajar" is 7 characters, " C++" adds 4 more, and strlen counts the result: 11.',
                id: '"Belajar" adalah 7 karakter, " C++" menambahkan 4 lagi, dan strlen menghitung hasilnya: 11.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Copy "Halo" into buf.',
                id: 'Salin "Halo" ke buf.',
              },
              template: '___(buf, "Halo");',
              blanks: ['strcpy'],
              explain: {
                en: 'strcpy(tujuan, sumber) copies sumber into tujuan.',
                id: 'strcpy(tujuan, sumber) menyalin sumber ke tujuan.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read one word into `kata`. Print the word, then on the next line print its length using strlen.',
                id: 'Baca satu kata ke `kata`. Cetak katanya, lalu di baris berikutnya cetak panjangnya memakai strlen.',
              },
              starter: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char kata[30];\n    cin >> kata;\n\n    return 0;\n}',
              tests: [
                { name: { en: 'Nunada → 6', id: 'Nunada → 6' }, stdin: ['Nunada'], expectOutput: 'Nunada\n6' },
                { name: { en: 'C → 1', id: 'C → 1' }, stdin: ['C'], expectOutput: 'C\n1' },
              ],
              hints: [
                { en: 'cout << kata << endl;', id: 'cout << kata << endl;' },
                { en: 'cout << strlen(kata) << endl;', id: 'cout << strlen(kata) << endl;' },
              ],
              solution:
                '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char kata[30];\n    cin >> kata;\n    cout << kata << endl;\n    cout << strlen(kata) << endl;\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m3-s2-p',
        title: { en: 'Full name tag', id: 'Label nama lengkap' },
        brief: {
          en: 'Read a first and last name as two words and join them into one greeting.',
          id: 'Baca nama depan dan belakang sebagai dua kata dan gabungkan menjadi satu sapaan.',
        },
        requirements: [
          { en: 'Read `depan` and `belakang` as two separate words with cin.', id: 'Baca `depan` dan `belakang` sebagai dua kata terpisah dengan cin.' },
          { en: 'Build `lengkap` by copying depan, then appending a space, then belakang.', id: 'Bangun `lengkap` dengan menyalin depan, lalu menambahkan spasi, lalu belakang.' },
          { en: 'Print `Halo, <lengkap>! (<panjang> huruf)` where panjang is strlen(lengkap).', id: 'Cetak `Halo, <lengkap>! (<panjang> huruf)` dengan panjang adalah strlen(lengkap).' },
        ],
        starter:
          '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char depan[20], belakang[20];\n    cin >> depan >> belakang;\n    char lengkap[41];\n\n    return 0;\n}',
        tests: [
          {
            name: { en: 'Budi Santoso', id: 'Budi Santoso' },
            stdin: ['Budi Santoso'],
            expectOutput: 'Halo, Budi Santoso! (12 huruf)',
          },
          {
            name: { en: 'Ani Kusuma', id: 'Ani Kusuma' },
            stdin: ['Ani Kusuma'],
            expectOutput: 'Halo, Ani Kusuma! (10 huruf)',
          },
        ],
        hints: [
          { en: 'strcpy(lengkap, depan); then strcat(lengkap, " "); then strcat(lengkap, belakang);', id: 'strcpy(lengkap, depan); lalu strcat(lengkap, " "); lalu strcat(lengkap, belakang);' },
          { en: 'int panjang = strlen(lengkap);', id: 'int panjang = strlen(lengkap);' },
          { en: 'cout << "Halo, " << lengkap << "! (" << panjang << " huruf)" << endl;', id: 'cout << "Halo, " << lengkap << "! (" << panjang << " huruf)" << endl;' },
        ],
        solution:
          '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char depan[20], belakang[20];\n    cin >> depan >> belakang;\n    char lengkap[41];\n    strcpy(lengkap, depan);\n    strcat(lengkap, " ");\n    strcat(lengkap, belakang);\n    int panjang = strlen(lengkap);\n    cout << "Halo, " << lengkap << "! (" << panjang << " huruf)" << endl;\n    return 0;\n}',
        xp: 50,
      },
    },
  ],
}
