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
                en: '`int scores[5];` reserves five int-sized boxes in a row, all named `scores`. Reach one with `scores[i]` — `i` is the index, counted from 0. The first box is `scores[0]`, the last is `scores[4]`.',
                id: '`int nilai[5];` memesan lima kotak berukuran int berjajar, semuanya bernama `nilai`. Raih satu dengan `nilai[i]` — `i` adalah indeksnya, dihitung dari 0. Kotak pertama adalah `nilai[0]`, terakhir `nilai[4]`.',
              },
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5];\n    scores[0] = 80;\n    scores[1] = 90;\n    cout << scores[0] << " " << scores[1] << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5];\n    nilai[0] = 80;\n    nilai[1] = 90;\n    cout << nilai[0] << " " << nilai[1] << endl;\n    return 0;\n}',
              },
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
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5] = {80, 90, 70, 85, 75};\n    cout << scores[2] << endl;\n    cout << scores[4] << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {80, 90, 70, 85, 75};\n    cout << nilai[2] << endl;\n    cout << nilai[4] << endl;\n    return 0;\n}',
              },
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
                en: 'Declare `int scores[4] = {70, 85, 90, 60};`. Print `scores[0]` and `scores[3]`, each on its own line.',
                id: 'Deklarasikan `int nilai[4] = {70, 85, 90, 60};`. Cetak `nilai[0]` dan `nilai[3]`, masing-masing di barisnya sendiri.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n\n    return 0;\n}',
              tests: [{ name: { en: 'Prints 70 then 60', id: 'Mencetak 70 lalu 60' }, expectOutput: '70\n60' }],
              hints: [
                { en: 'int scores[4] = {70, 85, 90, 60};', id: 'int nilai[4] = {70, 85, 90, 60};' },
                { en: 'scores[0] is the first, scores[3] is the last.', id: 'nilai[0] adalah yang pertama, nilai[3] adalah yang terakhir.' },
              ],
              solution: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[4] = {70, 85, 90, 60};\n    cout << scores[0] << endl;\n    cout << scores[3] << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[4] = {70, 85, 90, 60};\n    cout << nilai[0] << endl;\n    cout << nilai[3] << endl;\n    return 0;\n}',
              },
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
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5] = {80, 90, 70, 85, 75};\n    int total = 0;\n    for (int i = 0; i < 5; i++) {\n        total += scores[i];\n    }\n    cout << total << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {80, 90, 70, 85, 75};\n    int total = 0;\n    for (int i = 0; i < 5; i++) {\n        total += nilai[i];\n    }\n    cout << total << endl;\n    return 0;\n}',
              },
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
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5] = {80, 90, 70, 85, 75};\n    int largest = scores[0];\n    for (int i = 1; i < 5; i++) {\n        if (scores[i] > largest) {\n            largest = scores[i];\n        }\n    }\n    cout << largest << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {80, 90, 70, 85, 75};\n    int terbesar = nilai[0];\n    for (int i = 1; i < 5; i++) {\n        if (nilai[i] > terbesar) {\n            terbesar = nilai[i];\n        }\n    }\n    cout << terbesar << endl;\n    return 0;\n}',
              },
              output: '90',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Why does the loop start largest at scores[0] instead of 0?', id: 'Mengapa perulangan memulai terbesar dari nilai[0], bukan 0?' },
              code: {
                en: 'int scores[3] = {-5, -2, -8};\nint largest = scores[0];\nfor (int i = 1; i < 3; i++) {\n    if (scores[i] > largest) largest = scores[i];\n}',
                id: 'int nilai[3] = {-5, -2, -8};\nint terbesar = nilai[0];\nfor (int i = 1; i < 3; i++) {\n    if (nilai[i] > terbesar) terbesar = nilai[i];\n}',
              },
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
                en: 'Arrange the loop that computes the average of a 4-element array `scores`.',
                id: 'Susun perulangan yang menghitung rata-rata array `nilai` berisi 4 elemen.',
              },
              lines: {
                en: [
                  'int total = 0;',
                  'for (int i = 0; i < 4; i++) {',
                  'total += scores[i];',
                  '}',
                  'double average = (double)total / 4;',
                ],
                id: [
                  'int total = 0;',
                  'for (int i = 0; i < 4; i++) {',
                  'total += nilai[i];',
                  '}',
                  'double rata = (double)total / 4;',
                ],
              },
              explain: {
                en: 'total must exist and start at 0 before the loop adds to it, and the average is only computed once the sum is complete.',
                id: 'total harus ada dan dimulai dari 0 sebelum perulangan menambahkannya, dan rata-ratanya baru dihitung setelah jumlahnya lengkap.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int scores[5] = {70, 80, 90, 60, 100};`. Print the smallest value.',
                id: 'Deklarasikan `int nilai[5] = {70, 80, 90, 60, 100};`. Cetak nilai terkecilnya.',
              },
              starter: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5] = {70, 80, 90, 60, 100};\n\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {70, 80, 90, 60, 100};\n\n    return 0;\n}',
              },
              tests: [{ name: { en: 'Smallest is 60', id: 'Terkecil adalah 60' }, expectOutput: '60' }],
              hints: [
                { en: 'Start smallest at scores[0], same shape as finding the largest.', id: 'Mulai terkecil dari nilai[0], bentuknya sama seperti mencari terbesar.' },
                { en: 'Flip > to < in the comparison.', id: 'Balik > menjadi < dalam perbandingannya.' },
              ],
              solution: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5] = {70, 80, 90, 60, 100};\n    int smallest = scores[0];\n    for (int i = 1; i < 5; i++) {\n        if (scores[i] < smallest) {\n            smallest = scores[i];\n        }\n    }\n    cout << smallest << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5] = {70, 80, 90, 60, 100};\n    int terkecil = nilai[0];\n    for (int i = 1; i < 5; i++) {\n        if (nilai[i] < terkecil) {\n            terkecil = nilai[i];\n        }\n    }\n    cout << terkecil << endl;\n    return 0;\n}',
              },
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
                en: '`int m[2][3];` is a grid with 2 rows and 3 columns. Reach a cell with `m[row][col]`, both counted from 0. Initialise it with nested braces, one inner `{ }` per row.',
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
          { en: 'Print `Total: <total>` on the first line.', id: 'Cetak `Total: <jumlah>` di baris pertama.' },
          { en: 'Print `Average: <average>` on the second — a double, computed without losing the fraction.', id: 'Cetak `Rata-rata: <rata>` di baris kedua — sebuah double, dihitung tanpa kehilangan pecahannya.' },
          { en: 'Print `Highest: <max>` on the third.', id: 'Cetak `Tertinggi: <maks>` di baris ketiga.' },
        ],
        starter: {
          en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5];\n    for (int i = 0; i < 5; i++) {\n        cin >> scores[i];\n    }\n\n    return 0;\n}',
          id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5];\n    for (int i = 0; i < 5; i++) {\n        cin >> nilai[i];\n    }\n\n    return 0;\n}',
        },
        tests: {
          en: [
            {
              name: { en: '70 80 90 60 100', id: '70 80 90 60 100' },
              stdin: ['70 80 90 60 100'],
              expectOutput: 'Total: 400\nAverage: 80\nHighest: 100',
            },
            {
              name: { en: '50 50 50 50 50', id: '50 50 50 50 50' },
              stdin: ['50 50 50 50 50'],
              expectOutput: 'Total: 250\nAverage: 50\nHighest: 50',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'Sum the array first, the same loop from the last lesson.', id: 'Jumlahkan array-nya lebih dulu, perulangan yang sama dari pelajaran sebelumnya.' },
          { en: 'double average = (double)total / 5;', id: 'double rata = (double)total / 5;' },
          { en: 'Find the highest with the "start from index 0, compare the rest" pattern.', id: 'Cari yang tertinggi dengan pola "mulai dari indeks 0, bandingkan sisanya".' },
        ],
        solution: {
          en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int scores[5];\n    for (int i = 0; i < 5; i++) {\n        cin >> scores[i];\n    }\n    int total = 0;\n    int max = scores[0];\n    for (int i = 0; i < 5; i++) {\n        total += scores[i];\n        if (scores[i] > max) max = scores[i];\n    }\n    double average = (double)total / 5;\n    cout << "Total: " << total << endl;\n    cout << "Average: " << average << endl;\n    cout << "Highest: " << max << endl;\n    return 0;\n}',
          id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[5];\n    for (int i = 0; i < 5; i++) {\n        cin >> nilai[i];\n    }\n    int total = 0;\n    int maks = nilai[0];\n    for (int i = 0; i < 5; i++) {\n        total += nilai[i];\n        if (nilai[i] > maks) maks = nilai[i];\n    }\n    double rata = (double)total / 5;\n    cout << "Total: " << total << endl;\n    cout << "Rata-rata: " << rata << endl;\n    cout << "Tertinggi: " << maks << endl;\n    return 0;\n}',
        },
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
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char name[20] = "Nunada";\n    cout << name << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char nama[20] = "Nunada";\n    cout << nama << endl;\n    return 0;\n}',
              },
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
              code: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char name[20];\n    cin >> name;\n    cout << "Hello, " << name << "!" << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char nama[20];\n    cin >> nama;\n    cout << "Halo, " << nama << "!" << endl;\n    return 0;\n}',
              },
              output: { en: 'Hello, Budi!', id: 'Halo, Budi!' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'The user types `Ani Kusuma`. What does name hold after `cin >> name;`?', id: 'Pengguna mengetik `Ani Kusuma`. Apa isi nama setelah `cin >> nama;`?' },
              code: {
                en: 'char name[20];\ncin >> name;',
                id: 'char nama[20];\ncin >> nama;',
              },
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
                en: 'Declare a char array with room for up to 30 characters, called `city`.',
                id: 'Deklarasikan array char dengan ruang hingga 30 karakter, bernama `kota`.',
              },
              template: {
                en: 'char city___;',
                id: 'char kota___;',
              },
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
                en: 'Read one word into `city` and print `City: <city>`.',
                id: 'Baca satu kata ke `kota` lalu cetak `Kota: <kota>`.',
              },
              starter: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char city[30];\n    cin >> city;\n\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char kota[30];\n    cin >> kota;\n\n    return 0;\n}',
              },
              tests: {
                en: [
                  { name: { en: 'Surabaya → City: Surabaya', id: 'Surabaya → Kota: Surabaya' }, stdin: ['Surabaya'], expectOutput: 'City: Surabaya' },
                  { name: { en: 'Malang → City: Malang', id: 'Malang → Kota: Malang' }, stdin: ['Malang'], expectOutput: 'City: Malang' },
                ],
                id: [
                  { name: { en: 'Surabaya → Kota: Surabaya', id: 'Surabaya → Kota: Surabaya' }, stdin: ['Surabaya'], expectOutput: 'Kota: Surabaya' },
                  { name: { en: 'Malang → Kota: Malang', id: 'Malang → Kota: Malang' }, stdin: ['Malang'], expectOutput: 'Kota: Malang' },
                ],
              },
              hints: [{ en: 'cout << "City: " << city << endl;', id: 'cout << "Kota: " << kota << endl;' }],
              solution: {
                en: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char city[30];\n    cin >> city;\n    cout << "City: " << city << endl;\n    return 0;\n}',
                id: '#include <iostream>\nusing namespace std;\n\nint main() {\n    char kota[30];\n    cin >> kota;\n    cout << "Kota: " << kota << endl;\n    return 0;\n}',
              },
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
              code: {
                en: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char name[20] = "Nunada";\n    cout << strlen(name) << endl;\n    return 0;\n}',
                id: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char nama[20] = "Nunada";\n    cout << strlen(nama) << endl;\n    return 0;\n}',
              },
              output: '6',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'strcpy replaces, strcat appends', id: 'strcpy mengganti, strcat menambahkan' },
              body: {
                en: '`strcpy(dest, src)` overwrites `dest` with a copy of `src`. `strcat(dest, src)` instead adds `src` onto the end of whatever `dest` already holds — `dest` needs enough room left for both.',
                id: '`strcpy(tujuan, sumber)` menimpa `tujuan` dengan salinan `sumber`. `strcat(tujuan, sumber)` sebaliknya menambahkan `sumber` ke ujung apa pun yang sudah dimiliki `tujuan` — `tujuan` butuh ruang tersisa yang cukup untuk keduanya.',
              },
              code: {
                en: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char sentence[30];\n    strcpy(sentence, "Hello");\n    strcat(sentence, ",");\n    strcat(sentence, " world!");\n    cout << sentence << endl;\n    return 0;\n}',
                id: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char kalimat[30];\n    strcpy(kalimat, "Halo");\n    strcat(kalimat, ",");\n    strcat(kalimat, " dunia!");\n    cout << kalimat << endl;\n    return 0;\n}',
              },
              output: { en: 'Hello, world!', id: 'Halo, dunia!' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: {
                en: 'char s[20] = "Reading";\nstrcat(s, " C++");\ncout << strlen(s) << endl;',
                id: 'char s[20] = "Belajar";\nstrcat(s, " C++");\ncout << strlen(s) << endl;',
              },
              options: [
                { en: '11', id: '11' },
                { en: '7', id: '7' },
                { en: '4', id: '4' },
                { en: '20', id: '20' },
              ],
              answer: 0,
              explain: {
                en: '"Reading" is 7 characters, " C++" adds 4 more, and strlen counts the result: 11.',
                id: '"Belajar" adalah 7 karakter, " C++" menambahkan 4 lagi, dan strlen menghitung hasilnya: 11.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Copy "Hello" into buf.',
                id: 'Salin "Halo" ke buf.',
              },
              template: {
                en: '___(buf, "Hello");',
                id: '___(buf, "Halo");',
              },
              blanks: ['strcpy'],
              explain: {
                en: 'strcpy(dest, src) copies src into dest.',
                id: 'strcpy(tujuan, sumber) menyalin sumber ke tujuan.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Read one word into `word`. Print the word, then on the next line print its length using strlen.',
                id: 'Baca satu kata ke `kata`. Cetak katanya, lalu di baris berikutnya cetak panjangnya memakai strlen.',
              },
              starter: {
                en: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char word[30];\n    cin >> word;\n\n    return 0;\n}',
                id: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char kata[30];\n    cin >> kata;\n\n    return 0;\n}',
              },
              tests: [
                { name: { en: 'Nunada → 6', id: 'Nunada → 6' }, stdin: ['Nunada'], expectOutput: 'Nunada\n6' },
                { name: { en: 'C → 1', id: 'C → 1' }, stdin: ['C'], expectOutput: 'C\n1' },
              ],
              hints: [
                { en: 'cout << word << endl;', id: 'cout << kata << endl;' },
                { en: 'cout << strlen(word) << endl;', id: 'cout << strlen(kata) << endl;' },
              ],
              solution: {
                en: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char word[30];\n    cin >> word;\n    cout << word << endl;\n    cout << strlen(word) << endl;\n    return 0;\n}',
                id: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char kata[30];\n    cin >> kata;\n    cout << kata << endl;\n    cout << strlen(kata) << endl;\n    return 0;\n}',
              },
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
          { en: 'Read `first` and `last` as two separate words with cin.', id: 'Baca `depan` dan `belakang` sebagai dua kata terpisah dengan cin.' },
          { en: 'Build `full` by copying first, then appending a space, then last.', id: 'Bangun `lengkap` dengan menyalin depan, lalu menambahkan spasi, lalu belakang.' },
          { en: 'Print `Hello, <full>! (<length> letters)` where length is strlen(full).', id: 'Cetak `Halo, <lengkap>! (<panjang> huruf)` dengan panjang adalah strlen(lengkap).' },
        ],
        starter: {
          en: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char first[20], last[20];\n    cin >> first >> last;\n    char full[41];\n\n    return 0;\n}',
          id: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char depan[20], belakang[20];\n    cin >> depan >> belakang;\n    char lengkap[41];\n\n    return 0;\n}',
        },
        tests: {
          en: [
            {
              name: { en: 'Budi Santoso', id: 'Budi Santoso' },
              stdin: ['Budi Santoso'],
              expectOutput: 'Hello, Budi Santoso! (12 letters)',
            },
            {
              name: { en: 'Ani Kusuma', id: 'Ani Kusuma' },
              stdin: ['Ani Kusuma'],
              expectOutput: 'Hello, Ani Kusuma! (10 letters)',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'strcpy(full, first); then strcat(full, " "); then strcat(full, last);', id: 'strcpy(lengkap, depan); lalu strcat(lengkap, " "); lalu strcat(lengkap, belakang);' },
          { en: 'int length = strlen(full);', id: 'int panjang = strlen(lengkap);' },
          { en: 'cout << "Hello, " << full << "! (" << length << " letters)" << endl;', id: 'cout << "Halo, " << lengkap << "! (" << panjang << " huruf)" << endl;' },
        ],
        solution: {
          en: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char first[20], last[20];\n    cin >> first >> last;\n    char full[41];\n    strcpy(full, first);\n    strcat(full, " ");\n    strcat(full, last);\n    int length = strlen(full);\n    cout << "Hello, " << full << "! (" << length << " letters)" << endl;\n    return 0;\n}',
          id: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char depan[20], belakang[20];\n    cin >> depan >> belakang;\n    char lengkap[41];\n    strcpy(lengkap, depan);\n    strcat(lengkap, " ");\n    strcat(lengkap, belakang);\n    int panjang = strlen(lengkap);\n    cout << "Halo, " << lengkap << "! (" << panjang << " huruf)" << endl;\n    return 0;\n}',
        },
        xp: 50,
      },
    },
  ],
}
