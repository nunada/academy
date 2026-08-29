import type { Module } from '../types'

/** Module 4 — packaging code into functions, then pointers: the mechanism
 *  that lets a function reach back and change a variable it was not handed
 *  a copy of. */
export const module4: Module = {
  id: 'cpp-m4',
  title: { en: 'Functions and Pointers', id: 'Fungsi dan Pointer' },
  summary: {
    en: 'Package code into reusable functions, then use pointers to let one change a variable outside itself.',
    id: 'Mengemas kode menjadi fungsi yang bisa dipakai ulang, lalu memakai pointer agar sebuah fungsi bisa mengubah variabel di luar dirinya.',
  },
  submodules: [
    /* -------------------------------------------------------- 4.1 functions */
    {
      id: 'cpp-m4-s1',
      title: { en: 'Functions', id: 'Fungsi' },
      summary: {
        en: 'Give a piece of code a name, parameters, and a result.',
        id: 'Memberi nama, parameter, dan hasil pada sepotong kode.',
      },
      lessons: [
        {
          id: 'cpp-m4-s1-l1',
          title: { en: 'Defining and calling', id: 'Mendefinisikan dan memanggil' },
          goal: { en: 'Write a function that takes values in and returns one out.', id: 'Menulis fungsi yang menerima nilai masuk dan mengembalikan satu nilai keluar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A function is a named piece of code', id: 'Fungsi adalah sepotong kode bernama' },
              body: {
                en: 'A function declaration reads like a variable declaration with parentheses: a return type, a name, and the parameters it needs in those parentheses. `return` hands back the result and ends the function immediately.',
                id: 'Deklarasi fungsi terbaca seperti deklarasi variabel dengan kurung: tipe kembalian, nama, dan parameter yang dibutuhkannya di dalam kurung itu. `return` menyerahkan hasilnya dan langsung mengakhiri fungsinya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint kuadrat(int x) {\n    return x * x;\n}\n\nint main() {\n    cout << kuadrat(5) << endl;\n    return 0;\n}',
              output: '25',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'As many parameters as you need', id: 'Sebanyak apa pun parameter yang kamu butuhkan' },
              body: {
                en: 'List several parameters separated by commas, and call the function as many times as you like with different arguments each time — that reuse is the whole point of writing one.',
                id: 'Sebutkan beberapa parameter dipisah koma, dan panggil fungsinya sesukamu dengan argumen berbeda setiap kali — pemakaian ulang itulah inti dari menulisnya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint tambah(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    cout << tambah(3, 4) << endl;\n    cout << tambah(10, 20) << endl;\n    return 0;\n}',
              output: '7\n30',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'int kali(int a, int b) {\n    return a * b;\n}\nint main() {\n    cout << kali(6, 7) << endl;\n}',
              options: [
                { en: '42', id: '42' },
                { en: '13', id: '13' },
                { en: '67', id: '67' },
                { en: 'Nothing — kali is never called', id: 'Tidak ada — kali tak pernah dipanggil' },
              ],
              answer: 0,
              explain: {
                en: 'kali(6, 7) runs a=6, b=7, returns a*b, which cout then prints: 42.',
                id: 'kali(6, 7) berjalan dengan a=6, b=7, mengembalikan a*b, yang lalu dicetak cout: 42.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Write a function that returns the larger of two ints.',
                id: 'Tulis fungsi yang mengembalikan yang lebih besar dari dua int.',
              },
              template: 'int maksimum(int a, int b) {\n    if (a > b) ___ a;\n    return b;\n}',
              blanks: ['return'],
              explain: {
                en: 'return hands back a value and exits the function right there.',
                id: 'return menyerahkan sebuah nilai dan langsung keluar dari fungsi di situ juga.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Write `int luas(int p, int l)` returning the area of a rectangle, then use it to print the area of an 8 by 5 rectangle.',
                id: 'Tulis `int luas(int p, int l)` yang mengembalikan luas persegi panjang, lalu pakai untuk mencetak luas persegi panjang berukuran 8 kali 5.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\n// tulis fungsi luas di sini\n\nint main() {\n\n    return 0;\n}',
              tests: [{ name: { en: '8 x 5 → 40', id: '8 x 5 → 40' }, expectOutput: '40' }],
              hints: [
                { en: 'int luas(int p, int l) { return p * l; }', id: 'int luas(int p, int l) { return p * l; }' },
                { en: 'cout << luas(8, 5) << endl;', id: 'cout << luas(8, 5) << endl;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint luas(int p, int l) {\n    return p * l;\n}\n\nint main() {\n    cout << luas(8, 5) << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m4-s1-l2',
          title: { en: 'void functions and prototypes', id: 'Fungsi void dan prototipe' },
          goal: { en: 'Write a function with no return value, and declare one before it is defined.', id: 'Menulis fungsi tanpa nilai kembalian, dan mendeklarasikannya sebelum didefinisikan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'void means no result to return', id: 'void berarti tidak ada hasil yang dikembalikan' },
              body: {
                en: 'Not every function computes a value — some just do something, like printing. `void` in place of a return type says exactly that, and the function ends when it runs off the closing brace, no `return` needed.',
                id: 'Tidak setiap fungsi menghitung sebuah nilai — sebagian hanya melakukan sesuatu, seperti mencetak. `void` di tempat tipe kembalian menyatakan persis itu, dan fungsinya berakhir begitu mencapai kurung kurawal penutup, tanpa perlu `return`.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nvoid cetakGaris(int n) {\n    for (int i = 0; i < n; i++) {\n        cout << "=";\n    }\n    cout << endl;\n}\n\nint main() {\n    cetakGaris(10);\n    return 0;\n}',
              output: '==========',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A prototype lets you write main first', id: 'Prototipe membiarkanmu menulis main lebih dulu' },
              body: {
                en: 'C++ reads top to bottom, so a function normally has to appear before anything that calls it. A prototype — the signature alone, ending in `;` — promises the compiler a definition is coming later, so `main` can be written first and stay the first thing a reader sees.',
                id: 'C++ membaca dari atas ke bawah, jadi sebuah fungsi biasanya harus muncul sebelum apa pun yang memanggilnya. Prototipe — hanya tanda tangannya, diakhiri `;` — menjanjikan kompiler bahwa definisinya akan menyusul, sehingga `main` bisa ditulis lebih dulu dan tetap jadi hal pertama yang dibaca.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint tambah(int a, int b);\n\nint main() {\n    cout << tambah(3, 4) << endl;\n    return 0;\n}\n\nint tambah(int a, int b) {\n    return a + b;\n}',
              output: '7',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Which return type says "this function prints something but hands nothing back"?', id: 'Tipe kembalian mana yang menyatakan "fungsi ini mencetak sesuatu tapi tak mengembalikan apa pun"?' },
              options: [
                { en: 'void', id: 'void' },
                { en: 'int', id: 'int' },
                { en: 'empty', id: 'empty' },
                { en: 'none', id: 'none' },
              ],
              answer: 0,
              explain: {
                en: 'void is the return type for a function that acts but does not compute a value to hand back.',
                id: 'void adalah tipe kembalian untuk fungsi yang bertindak tapi tidak menghitung nilai untuk diserahkan kembali.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Write a function that prints a greeting and returns nothing.',
                id: 'Tulis fungsi yang mencetak sapaan dan tidak mengembalikan apa pun.',
              },
              template: '___ sapa() {\n    cout << "Halo!" << endl;\n}',
              blanks: ['void'],
              explain: {
                en: 'void is the return type for a function with no result.',
                id: 'void adalah tipe kembalian untuk fungsi tanpa hasil.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Write `void cetakKotak(int n)` that prints an n by n box of `*`, then call it with 3.',
                id: 'Tulis `void cetakKotak(int n)` yang mencetak kotak `*` berukuran n kali n, lalu panggil dengan 3.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\n// tulis fungsi cetakKotak di sini\n\nint main() {\n\n    return 0;\n}',
              tests: [{ name: { en: '3x3 box of stars', id: 'Kotak bintang 3x3' }, expectOutput: '***\n***\n***' }],
              hints: [
                { en: 'A nested loop, same shape as the grid from Module 2.', id: 'Perulangan bersarang, bentuknya sama seperti kisi dari Modul 2.' },
                { en: 'void cetakKotak(int n) { for (...) { for (...) cout << "*"; cout << endl; } }', id: 'void cetakKotak(int n) { for (...) { for (...) cout << "*"; cout << endl; } }' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nvoid cetakKotak(int n) {\n    for (int b = 0; b < n; b++) {\n        for (int k = 0; k < n; k++) {\n            cout << "*";\n        }\n        cout << endl;\n    }\n}\n\nint main() {\n    cetakKotak(3);\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m4-s1-l3',
          title: { en: 'Arrays as parameters', id: 'Array sebagai parameter' },
          goal: { en: 'Pass an array to a function, and change it there.', id: 'Mengoper array ke fungsi, dan mengubahnya di sana.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An array parameter has no fixed size', id: 'Parameter array tak punya ukuran tetap' },
              body: {
                en: '`int arr[]` in a parameter list accepts an array of any length — which is exactly why it needs a second parameter alongside it saying how many elements there actually are. The array itself never carries its own length around.',
                id: '`int arr[]` di daftar parameter menerima array dengan panjang berapa pun — dan justru karena itulah ia butuh parameter kedua di sampingnya yang menyatakan berapa banyak elemen yang sebenarnya ada. Array itu sendiri tak pernah membawa panjangnya sendiri.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint jumlahkan(int arr[], int n) {\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n        total += arr[i];\n    }\n    return total;\n}\n\nint main() {\n    int nilai[4] = {1, 2, 3, 4};\n    cout << jumlahkan(nilai, 4) << endl;\n    return 0;\n}',
              output: '10',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A change inside the function stays outside it', id: 'Perubahan di dalam fungsi tetap ada di luarnya' },
              body: {
                en: 'This is different from an `int` parameter, which the function only ever gets a copy of. An array parameter reaches the same boxes the caller has — so writing to `arr[i]` inside the function really does change the caller\'s array.',
                id: 'Ini berbeda dari parameter `int`, yang hanya pernah diberi salinan oleh fungsinya. Parameter array menjangkau kotak yang sama yang dimiliki pemanggil — jadi menulis ke `arr[i]` di dalam fungsi benar-benar mengubah array milik pemanggil.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nvoid gandakan(int arr[], int n) {\n    for (int i = 0; i < n; i++) {\n        arr[i] = arr[i] * 2;\n    }\n}\n\nint main() {\n    int nilai[3] = {1, 2, 3};\n    gandakan(nilai, 3);\n    for (int i = 0; i < 3; i++) cout << nilai[i] << " ";\n    cout << endl;\n    return 0;\n}',
              output: '2 4 6 ',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'After naikkan(nilai, 3) runs below, what does main print?', id: 'Setelah naikkan(nilai, 3) berjalan di bawah, apa yang dicetak main?' },
              code: 'void naikkan(int arr[], int n) {\n    for (int i = 0; i < n; i++) arr[i]++;\n}\nint main() {\n    int nilai[3] = {5, 5, 5};\n    naikkan(nilai, 3);\n    // cetak nilai[0]\n}',
              options: [
                { en: '6', id: '6' },
                { en: '5', id: '5' },
                { en: '0', id: '0' },
                { en: 'A compile error', id: 'Error kompilasi' },
              ],
              answer: 0,
              explain: {
                en: 'The array parameter reaches the caller\'s own boxes, so arr[i]++ inside naikkan really increments nilai[0] too.',
                id: 'Parameter array menjangkau kotak milik pemanggil sendiri, jadi arr[i]++ di dalam naikkan benar-benar menaikkan nilai[0] juga.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Declare a function that counts how many elements of an array are negative.',
                id: 'Deklarasikan fungsi yang menghitung berapa elemen array yang negatif.',
              },
              template: 'int hitungNegatif(int arr[], int ___) {\n    int c = 0;\n    for (int i = 0; i < n; i++) if (arr[i] < 0) c++;\n    return c;\n}',
              blanks: ['n'],
              explain: {
                en: 'An array parameter always needs a companion telling the function how many elements to look at.',
                id: 'Parameter array selalu butuh pendamping yang memberi tahu fungsi berapa elemen yang harus dilihat.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Write `void kalikan(int arr[], int n, int faktor)` that multiplies every element by faktor in place. Apply it to `{1,2,3,4}` with faktor 3 and print the result, space-separated.',
                id: 'Tulis `void kalikan(int arr[], int n, int faktor)` yang mengalikan setiap elemen dengan faktor di tempat. Terapkan pada `{1,2,3,4}` dengan faktor 3 dan cetak hasilnya, dipisah spasi.',
              },
              starter:
                '#include <iostream>\nusing namespace std;\n\n// tulis fungsi kalikan di sini\n\nint main() {\n    int nilai[4] = {1, 2, 3, 4};\n\n    return 0;\n}',
              tests: [{ name: { en: 'Prints 3 6 9 12', id: 'Mencetak 3 6 9 12' }, expectOutput: '3 6 9 12 ' }],
              hints: [
                { en: 'void kalikan(int arr[], int n, int faktor) { for (...) arr[i] *= faktor; }', id: 'void kalikan(int arr[], int n, int faktor) { for (...) arr[i] *= faktor; }' },
                { en: 'Print the array with a loop after calling kalikan.', id: 'Cetak array-nya dengan perulangan setelah memanggil kalikan.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nvoid kalikan(int arr[], int n, int faktor) {\n    for (int i = 0; i < n; i++) {\n        arr[i] *= faktor;\n    }\n}\n\nint main() {\n    int nilai[4] = {1, 2, 3, 4};\n    kalikan(nilai, 4, 3);\n    for (int i = 0; i < 4; i++) cout << nilai[i] << " ";\n    cout << endl;\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m4-s1-p',
        title: { en: 'Simple calculator', id: 'Kalkulator sederhana' },
        brief: {
          en: 'Read two numbers and an operator, and dispatch to the matching function.',
          id: 'Baca dua angka dan sebuah operator, lalu arahkan ke fungsi yang cocok.',
        },
        requirements: [
          { en: 'Write tambah, kurang and kali, each taking two ints and returning an int.', id: 'Tulis tambah, kurang, dan kali, masing-masing menerima dua int dan mengembalikan int.' },
          { en: 'Write bagi taking two ints and returning a double, computed without losing the fraction.', id: 'Tulis bagi menerima dua int dan mengembalikan double, dihitung tanpa kehilangan pecahannya.' },
          { en: 'Read `a`, an operator character `op`, then `b` — for example `6 + 3`.', id: 'Baca `a`, sebuah karakter operator `op`, lalu `b` — misalnya `6 + 3`.' },
          { en: 'Print only the result of calling the matching function for +, -, * or /.', id: 'Cetak hanya hasil pemanggilan fungsi yang cocok untuk +, -, *, atau /.' },
        ],
        starter:
          '#include <iostream>\nusing namespace std;\n\n// tulis tambah, kurang, kali, bagi di sini\n\nint main() {\n    int a, b;\n    char op;\n    cin >> a >> op >> b;\n\n    return 0;\n}',
        tests: [
          { name: { en: '6 + 3 → 9', id: '6 + 3 → 9' }, stdin: ['6 + 3'], expectOutput: '9' },
          { name: { en: '10 - 4 → 6', id: '10 - 4 → 6' }, stdin: ['10 - 4'], expectOutput: '6' },
          { name: { en: '5 * 6 → 30', id: '5 * 6 → 30' }, stdin: ['5 * 6'], expectOutput: '30' },
          { name: { en: '7 / 2 → 3.5', id: '7 / 2 → 3.5' }, stdin: ['7 / 2'], expectOutput: '3.5' },
        ],
        hints: [
          { en: 'double bagi(int a, int b) { return (double)a / b; }', id: 'double bagi(int a, int b) { return (double)a / b; }' },
          { en: 'switch (op) { case \'+\': cout << tambah(a, b) << endl; break; ... }', id: 'switch (op) { case \'+\': cout << tambah(a, b) << endl; break; ... }' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nint tambah(int a, int b) { return a + b; }\nint kurang(int a, int b) { return a - b; }\nint kali(int a, int b) { return a * b; }\ndouble bagi(int a, int b) { return (double)a / b; }\n\nint main() {\n    int a, b;\n    char op;\n    cin >> a >> op >> b;\n    switch (op) {\n        case \'+\': cout << tambah(a, b) << endl; break;\n        case \'-\': cout << kurang(a, b) << endl; break;\n        case \'*\': cout << kali(a, b) << endl; break;\n        case \'/\': cout << bagi(a, b) << endl; break;\n        default: cout << "Operator tidak dikenal" << endl;\n    }\n    return 0;\n}',
        xp: 50,
      },
    },

    /* --------------------------------------------------------- 4.2 pointers */
    {
      id: 'cpp-m4-s2',
      title: { en: 'Pointers', id: 'Pointer' },
      summary: {
        en: 'Hold the address of a variable, and use it to reach back and change what a function was not given a copy of.',
        id: 'Menyimpan alamat sebuah variabel, dan memakainya untuk menjangkau balik serta mengubah apa yang tak diberikan sebagai salinan ke sebuah fungsi.',
      },
      lessons: [
        {
          id: 'cpp-m4-s2-l1',
          title: { en: 'Addresses, & and *', id: 'Alamat, & dan *' },
          goal: { en: 'Store the address of a variable and change it through that address.', id: 'Menyimpan alamat sebuah variabel dan mengubahnya lewat alamat itu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Every variable lives somewhere', id: 'Setiap variabel hidup di suatu tempat' },
              body: {
                en: 'A variable is a value sitting in memory, and `&nama` asks for the address it sits at rather than the value itself. A pointer variable, declared with a `*` after its type, is built to hold exactly that kind of address.',
                id: 'Variabel adalah sebuah nilai yang duduk di memori, dan `&nama` meminta alamat tempatnya duduk, bukan nilainya sendiri. Variabel pointer, dideklarasikan dengan `*` setelah tipenya, dibangun untuk menyimpan persis alamat semacam itu.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;\n    int *p = &a;\n    cout << *p << endl;\n    return 0;\n}',
              output: '5',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '*p reaches back to a', id: '*p menjangkau balik ke a' },
              body: {
                en: 'The same `*` that declares a pointer also dereferences one — used on an existing pointer, `*p` means "the value at the address p holds". Assign to `*p` and you are not changing p, you are reaching through it to change a.',
                id: '`*` yang sama yang mendeklarasikan pointer juga men-dereferensikannya — dipakai pada pointer yang sudah ada, `*p` berarti "nilai di alamat yang disimpan p". Tetapkan nilai ke `*p` dan kamu bukan mengubah p, kamu menjangkau lewatnya untuk mengubah a.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;\n    int *p = &a;\n    *p = 10;\n    cout << a << endl;\n    return 0;\n}',
              output: '10',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'int x = 3;\nint *p = &x;\n*p = *p + 7;\ncout << x << endl;',
              options: [
                { en: '10', id: '10' },
                { en: '3', id: '3' },
                { en: '7', id: '7' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: '*p reads x (3), adds 7, and writes the result back through p — which is the same box as x.',
                id: '*p membaca x (3), menambah 7, dan menulis hasilnya kembali lewat p — yang merupakan kotak yang sama dengan x.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Make p point at a.',
                id: 'Buat p menunjuk ke a.',
              },
              template: 'int a = 9;\nint *p = ___a;',
              blanks: ['&'],
              explain: {
                en: '& takes the address of a variable — exactly what a pointer needs to hold.',
                id: '& mengambil alamat sebuah variabel — persis yang dibutuhkan sebuah pointer untuk disimpan.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int x = 7;`, a pointer `p` at its address, then use `*p` to double x. Print x.',
                id: 'Deklarasikan `int x = 7;`, sebuah pointer `p` ke alamatnya, lalu pakai `*p` untuk menggandakan x. Cetak x.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 7;\n\n    return 0;\n}',
              tests: [{ name: { en: 'x becomes 14', id: 'x menjadi 14' }, expectOutput: '14' }],
              hints: [
                { en: 'int *p = &x;', id: 'int *p = &x;' },
                { en: '*p = *p * 2;', id: '*p = *p * 2;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 7;\n    int *p = &x;\n    *p = *p * 2;\n    cout << x << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m4-s2-l2',
          title: { en: 'Pointers as parameters', id: 'Pointer sebagai parameter' },
          goal: { en: 'Let a function change a caller\'s variable.', id: 'Membiarkan sebuah fungsi mengubah variabel milik pemanggil.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An int parameter is only a copy', id: 'Parameter int hanyalah sebuah salinan' },
              body: {
                en: 'A function normally works on copies of what it is handed — changing a parameter inside the function never reaches the caller\'s own variable. This is easy to see by trying to swap two numbers the plain way, and watching it fail.',
                id: 'Sebuah fungsi biasanya bekerja pada salinan dari apa yang diberikan padanya — mengubah parameter di dalam fungsi tak pernah menjangkau variabel milik pemanggil sendiri. Ini mudah dilihat dengan mencoba menukar dua angka dengan cara biasa, dan menyaksikannya gagal.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nvoid gagalTukar(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\nint main() {\n    int x = 5, y = 10;\n    gagalTukar(x, y);\n    cout << x << " " << y << endl;\n    return 0;\n}',
              output: '5 10',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A pointer parameter reaches the original', id: 'Parameter pointer menjangkau yang asli' },
              body: {
                en: 'Hand the function the addresses instead, with `int *a`, and `*a` inside it reaches straight back to the caller\'s variable. Now the swap actually happens where it is supposed to.',
                id: 'Berikan fungsinya alamat-alamatnya, dengan `int *a`, dan `*a` di dalamnya menjangkau langsung balik ke variabel milik pemanggil. Kini pertukarannya benar-benar terjadi di tempat yang seharusnya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nvoid tukar(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 5, y = 10;\n    tukar(&x, &y);\n    cout << x << " " << y << endl;\n    return 0;\n}',
              output: '10 5',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Why does gagalTukar(x, y) leave x and y unchanged?', id: 'Mengapa gagalTukar(x, y) membiarkan x dan y tidak berubah?' },
              code: 'void gagalTukar(int a, int b) {\n    int temp = a; a = b; b = temp;\n}',
              options: [
                { en: 'a and b are copies of x and y, not the variables themselves', id: 'a dan b adalah salinan dari x dan y, bukan variabelnya sendiri' },
                { en: 'temp is declared with the wrong type', id: 'temp dideklarasikan dengan tipe yang salah' },
                { en: 'C++ does not allow swapping variables', id: 'C++ tidak mengizinkan pertukaran variabel' },
                { en: 'The function needs a return statement', id: 'Fungsinya butuh pernyataan return' },
              ],
              answer: 0,
              explain: {
                en: 'Swapping the copies inside the function does nothing to the originals sitting in main.',
                id: 'Menukar salinan di dalam fungsi tidak berpengaruh apa pun pada yang asli yang duduk di main.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Call tukar so it actually reaches x and y.',
                id: 'Panggil tukar agar benar-benar menjangkau x dan y.',
              },
              template: 'tukar(___x, ___y);',
              blanks: ['&', '&'],
              explain: {
                en: 'tukar expects addresses, so both arguments need &.',
                id: 'tukar mengharapkan alamat, jadi kedua argumennya butuh &.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Write `void keNol(int *p)` that sets whatever p points at to 0. Apply it to a variable `x` starting at 99 and print x.',
                id: 'Tulis `void keNol(int *p)` yang menetapkan apa pun yang ditunjuk p menjadi 0. Terapkan pada variabel `x` yang dimulai dari 99 dan cetak x.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\n// tulis fungsi keNol di sini\n\nint main() {\n    int x = 99;\n\n    return 0;\n}',
              tests: [{ name: { en: 'x becomes 0', id: 'x menjadi 0' }, expectOutput: '0' }],
              hints: [
                { en: 'void keNol(int *p) { *p = 0; }', id: 'void keNol(int *p) { *p = 0; }' },
                { en: 'keNol(&x); then print x.', id: 'keNol(&x); lalu cetak x.' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nvoid keNol(int *p) {\n    *p = 0;\n}\n\nint main() {\n    int x = 99;\n    keNol(&x);\n    cout << x << endl;\n    return 0;\n}',
            },
          ],
        },
        {
          id: 'cpp-m4-s2-l3',
          title: { en: 'Pointers and arrays', id: 'Pointer dan array' },
          goal: { en: 'Index a pointer the same way as an array.', id: 'Mengindeks pointer dengan cara yang sama seperti array.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An array parameter is secretly a pointer', id: 'Parameter array diam-diam adalah pointer' },
              body: {
                en: 'This is why `int arr[]` and `int *arr` work identically as a function parameter — both hold the address of the array\'s first element, and `arr[i]` means the same thing either way.',
                id: 'Inilah sebabnya `int arr[]` dan `int *arr` bekerja sama persis sebagai parameter fungsi — keduanya menyimpan alamat elemen pertama array-nya, dan `arr[i]` berarti hal yang sama pada keduanya.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint jumlahkan(int *arr, int n) {\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n        total += arr[i];\n    }\n    return total;\n}\n\nint main() {\n    int nilai[4] = {2, 4, 6, 8};\n    cout << jumlahkan(nilai, 4) << endl;\n    return 0;\n}',
              output: '20',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'p[i] works on a plain pointer too', id: 'p[i] juga bekerja pada pointer biasa' },
              body: {
                en: 'Point `p` at the start of an array and `p[i]` reaches the same elements `arr[i]` would — `[ ]` is really just a shorthand built on top of pointers.',
                id: 'Arahkan `p` ke awal sebuah array dan `p[i]` menjangkau elemen yang sama seperti `arr[i]` — `[ ]` sebenarnya hanyalah singkatan yang dibangun di atas pointer.',
              },
              code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[3] = {10, 20, 30};\n    int *p = nilai;\n    cout << p[0] << " " << p[1] << " " << p[2] << endl;\n    return 0;\n}',
              output: '10 20 30',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'p points at the start of nilai. What is p[2]?', id: 'p menunjuk ke awal nilai. Berapa p[2]?' },
              code: 'int nilai[4] = {1, 3, 5, 7};\nint *p = nilai;',
              options: [
                { en: '5', id: '5' },
                { en: '2', id: '2' },
                { en: '7', id: '7' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'p[2] is the third element (counting from 0), same as nilai[2]: 5.',
                id: 'p[2] adalah elemen ketiga (dihitung dari 0), sama seperti nilai[2]: 5.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Point p at the start of nilai.',
                id: 'Arahkan p ke awal nilai.',
              },
              template: 'int nilai[5] = {1,2,3,4,5};\nint *p = ___;',
              blanks: ['nilai'],
              explain: {
                en: 'An array name alone already is the address of its first element.',
                id: 'Nama array saja sudah merupakan alamat elemen pertamanya.',
              },
            },
            {
              kind: 'cpp',
              id: 'w1',
              prompt: {
                en: 'Declare `int nilai[4] = {3, 6, 9, 12};` and a pointer `p` at its start. Print `p[1] + p[3]`.',
                id: 'Deklarasikan `int nilai[4] = {3, 6, 9, 12};` dan sebuah pointer `p` ke awalnya. Cetak `p[1] + p[3]`.',
              },
              starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[4] = {3, 6, 9, 12};\n\n    return 0;\n}',
              tests: [{ name: { en: '6 + 12 = 18', id: '6 + 12 = 18' }, expectOutput: '18' }],
              hints: [
                { en: 'int *p = nilai;', id: 'int *p = nilai;' },
                { en: 'cout << p[1] + p[3] << endl;', id: 'cout << p[1] + p[3] << endl;' },
              ],
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nilai[4] = {3, 6, 9, 12};\n    int *p = nilai;\n    cout << p[1] + p[3] << endl;\n    return 0;\n}',
            },
          ],
        },
      ],
      project: {
        runtime: 'cpp',
        id: 'cpp-m4-s2-p',
        title: { en: 'Swap and sort', id: 'Tukar dan urutkan' },
        brief: {
          en: 'Read three numbers and print them smallest to largest, using only a pointer-based swap function.',
          id: 'Baca tiga angka dan cetak dari yang terkecil ke terbesar, hanya memakai fungsi tukar berbasis pointer.',
        },
        requirements: [
          { en: 'Write `void tukar(int *a, int *b)` that swaps what the two pointers point at.', id: 'Tulis `void tukar(int *a, int *b)` yang menukar apa yang ditunjuk kedua pointer.' },
          { en: 'Read three whole numbers a, b, c.', id: 'Baca tiga bilangan bulat a, b, c.' },
          { en: 'Sort them ascending using only calls to tukar — no other reassignment.', id: 'Urutkan menaik hanya memakai pemanggilan tukar — tidak ada penetapan ulang lain.' },
          { en: 'Print `<terkecil> <tengah> <terbesar>` on one line.', id: 'Cetak `<terkecil> <tengah> <terbesar>` dalam satu baris.' },
        ],
        starter:
          '#include <iostream>\nusing namespace std;\n\nvoid tukar(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n\n    return 0;\n}',
        tests: [
          { name: { en: '5 1 3 → 1 3 5', id: '5 1 3 → 1 3 5' }, stdin: ['5 1 3'], expectOutput: '1 3 5' },
          { name: { en: '3 2 1 → 1 2 3', id: '3 2 1 → 1 2 3' }, stdin: ['3 2 1'], expectOutput: '1 2 3' },
          { name: { en: '9 9 9 → 9 9 9', id: '9 9 9 → 9 9 9' }, stdin: ['9 9 9'], expectOutput: '9 9 9' },
          { name: { en: '1 2 3 → 1 2 3 (already sorted)', id: '1 2 3 → 1 2 3 (sudah urut)' }, stdin: ['1 2 3'], expectOutput: '1 2 3' },
        ],
        hints: [
          { en: 'Three compares are enough: if (a>b) tukar(&a,&b); if (b>c) tukar(&b,&c); if (a>b) tukar(&a,&b);', id: 'Tiga perbandingan sudah cukup: if (a>b) tukar(&a,&b); if (b>c) tukar(&b,&c); if (a>b) tukar(&a,&b);' },
          { en: 'The first two compares put the largest in c; the third fixes a and b between themselves.', id: 'Dua perbandingan pertama menaruh yang terbesar di c; yang ketiga membereskan a dan b di antara mereka sendiri.' },
        ],
        solution:
          '#include <iostream>\nusing namespace std;\n\nvoid tukar(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    if (a > b) tukar(&a, &b);\n    if (b > c) tukar(&b, &c);\n    if (a > b) tukar(&a, &b);\n    cout << a << " " << b << " " << c << endl;\n    return 0;\n}',
        xp: 50,
      },
    },
  ],
}
