import type { Module } from '../types'

/** Module 1 — numpy arrays as vectors: elementwise arithmetic, indexing, dot
 *  product, and magnitude. The first course content in this app that loads a
 *  real extra package (numpy), via ensurePackages in src/lib/python.ts. */
export const module1: Module = {
  id: 'pynum-m1',
  title: { en: 'Arrays as Vectors', id: 'Array sebagai Vektor' },
  summary: {
    en: 'A numpy array does arithmetic on a whole list of numbers at once — no loop needed for what a vector actually is.',
    id: 'Array numpy melakukan aritmetika pada seluruh daftar angka sekaligus — tak perlu perulangan untuk apa yang sebenarnya sebuah vektor.',
  },
  submodules: [
    /* -------------------------------------------- 1.1 arrays & elementwise ops */
    {
      id: 'pynum-m1-s1',
      title: { en: 'Creating and Operating on Arrays', id: 'Membuat dan Mengoperasikan Array' },
      summary: {
        en: 'np.array turns a list into something + and * work on directly, element by element.',
        id: 'np.array mengubah list menjadi sesuatu yang bisa langsung dikenai + dan *, unsur demi unsur.',
      },
      lessons: [
        {
          id: 'pynum-m1-s1-l1',
          title: { en: 'np.array and Elementwise Operations', id: 'np.array dan Operasi Elementwise' },
          goal: { en: 'Add and multiply whole arrays at once.', id: 'Menjumlahkan dan mengalikan seluruh array sekaligus.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A list becomes something math works on', id: 'List menjadi sesuatu yang bisa dihitung' },
              body: {
                en: 'A plain Python list has no idea what `+` between two lists should mean — it just joins them. `np.array` wraps a list into something that treats `+` the way a vector does: adding the first elements, then the second, and so on, all at once.',
                id: 'List Python biasa tak tahu `+` antara dua list seharusnya berarti apa — ia sekadar menggabungkannya. `np.array` membungkus list menjadi sesuatu yang memperlakukan `+` seperti vektor: menjumlahkan unsur pertama, lalu kedua, dan seterusnya, sekaligus.',
              },
              code: 'import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a + b)',
              output: '[5 7 9]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A single number reaches every element', id: 'Satu angka menjangkau tiap unsur' },
              body: {
                en: '`a * 2` multiplies every element by 2 — a single number spreads across the whole array. `a * a` multiplies two arrays elementwise, the same as `a + b` did.',
                id: '`a * 2` mengalikan tiap unsur dengan 2 — satu angka menjangkau seluruh array. `a * a` mengalikan dua array elementwise, sama seperti `a + b` tadi.',
              },
              code: 'import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)\nprint(a * a)',
              output: '[2 4 6]\n[1 4 9]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'import numpy as np\na = np.array([10, 20, 30])\nb = np.array([1, 2, 3])\nprint(a - b)',
              options: [
                { en: '[ 9 18 27]', id: '[ 9 18 27]' },
                { en: '[11 22 33]', id: '[11 22 33]' },
                { en: '[10 20 30, 1 2 3]', id: '[10 20 30, 1 2 3]' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'Subtraction works elementwise too: 10-1, 20-2, 30-3.',
                id: 'Pengurangan juga bekerja elementwise: 10-1, 20-2, 30-3.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Double every element of a, elementwise.',
                id: 'Gandakan tiap unsur a, secara elementwise.',
              },
              template: 'import numpy as np\na = np.array([5, 10, 15])\nhasil = a ___ 2\nprint(hasil)',
              blanks: ['*'],
              explain: {
                en: 'Multiplying by a single number scales every element the same way.',
                id: 'Mengalikan dengan satu angka menskalakan tiap unsur dengan cara yang sama.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that adds two arrays and prints the result.',
                id: 'Susun program yang menjumlahkan dua array dan mencetak hasilnya.',
              },
              lines: ['import numpy as np', 'a = np.array([1, 1, 1])', 'b = np.array([2, 3, 4])', 'print(a + b)'],
              explain: {
                en: 'Both arrays have to exist before they can be added together.',
                id: 'Kedua arraynya harus ada dulu sebelum bisa dijumlahkan.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read a whole number `n`, then `n` numbers into array `a`, then `n` more into array `b`. Print `a + b`.',
                id: 'Baca bilangan bulat `n`, lalu `n` angka ke dalam array `a`, lalu `n` angka lagi ke dalam array `b`. Cetak `a + b`.',
              },
              starter: 'import numpy as np\nn = int(input())\na = np.array([int(input()) for _ in range(n)])\nb = np.array([int(input()) for _ in range(n)])\n',
              tests: [
                { name: { en: 'n=3', id: 'n=3' }, stdin: ['3', '1', '2', '3', '4', '5', '6'], expectOutput: '[5 7 9]' },
                { name: { en: 'n=2', id: 'n=2' }, stdin: ['2', '10', '20', '1', '1'], expectOutput: '[11 21]' },
                { name: { en: 'n=4, zeros', id: 'n=4, nol' }, stdin: ['4', '0', '0', '0', '0', '1', '2', '3', '4'], expectOutput: '[1 2 3 4]' },
                { name: { en: 'n=1', id: 'n=1' }, stdin: ['1', '5', '5'], expectOutput: '[10]' },
              ],
              hints: [
                { en: 'The reading is already done in the starter — one line does the rest.', id: 'Pembacaannya sudah selesai di starter — satu baris menyelesaikan sisanya.' },
              ],
              solution: 'import numpy as np\nn = int(input())\na = np.array([int(input()) for _ in range(n)])\nb = np.array([int(input()) for _ in range(n)])\nprint(a + b)',
            },
          ],
        },
        {
          id: 'pynum-m1-s1-l2',
          title: { en: 'Indexing and Slicing', id: 'Indexing dan Slicing' },
          goal: { en: 'Read one element, or a whole range of them.', id: 'Membaca satu unsur, atau sederet unsur sekaligus.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One element at a time', id: 'Satu unsur setiap kali' },
              body: {
                en: 'Indexing a numpy array reads exactly like indexing a list: `a[1]` is the second element, `a[-1]` is the last one — counting from 0, same as everywhere else in Python.',
                id: 'Meng-indeks array numpy terbaca persis seperti meng-indeks list: `a[1]` adalah unsur kedua, `a[-1]` adalah unsur terakhir — dihitung dari 0, sama seperti di tempat lain di Python.',
              },
              code: 'import numpy as np\na = np.array([10, 20, 30, 40, 50])\nprint(a[1])\nprint(a[-1])',
              output: '20\n50',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A range of elements at once', id: 'Sederet unsur sekaligus' },
              body: {
                en: '`a[1:3]` reads elements from index 1 up to, but not including, index 3. Leaving one side of the colon empty means "to the start" or "to the end" — `a[:2]` is the first two elements.',
                id: '`a[1:3]` membaca unsur dari indeks 1 sampai, tapi tidak termasuk, indeks 3. Mengosongkan salah satu sisi titik dua berarti "sampai awal" atau "sampai akhir" — `a[:2]` adalah dua unsur pertama.',
              },
              code: 'import numpy as np\na = np.array([10, 20, 30, 40, 50])\nprint(a[1:3])\nprint(a[:2])',
              output: '[20 30]\n[10 20]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'a = [10, 20, 30, 40, 50]. What is a[2:4]?',
                id: 'a = [10, 20, 30, 40, 50]. Berapa a[2:4]?',
              },
              options: [
                { en: '[30 40]', id: '[30 40]' },
                { en: '[30 40 50]', id: '[30 40 50]' },
                { en: '[20 30 40]', id: '[20 30 40]' },
                { en: '[40]', id: '[40]' },
              ],
              answer: 0,
              explain: {
                en: 'Index 2 through 4, not including 4 — that is the elements at positions 2 and 3: 30 and 40.',
                id: 'Indeks 2 sampai 4, tidak termasuk 4 — itu unsur pada posisi 2 dan 3: 30 dan 40.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Read everything from index 2 to the end.',
                id: 'Baca semuanya dari indeks 2 sampai akhir.',
              },
              template: 'import numpy as np\na = np.array([1, 2, 3, 4, 5])\nprint(a[2___])',
              blanks: [':'],
              explain: {
                en: 'Leaving the right side of the colon empty means "through the end of the array".',
                id: 'Mengosongkan sisi kanan titik dua berarti "sampai akhir array".',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program printing the last two elements of an array.',
                id: 'Susun program yang mencetak dua unsur terakhir sebuah array.',
              },
              lines: ['import numpy as np', 'a = np.array([3, 1, 4, 1, 5])', 'print(a[-2:])'],
              explain: {
                en: 'A negative start with an empty end reaches from that far back to the very end.',
                id: 'Awalan negatif dengan akhiran kosong menjangkau dari sejauh itu ke belakang sampai ke ujung.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read 5 numbers into array `a`. Print the first 3 elements, then the last 2 elements, each on its own line.',
                id: 'Baca 5 angka ke dalam array `a`. Cetak 3 unsur pertama, lalu 2 unsur terakhir, masing-masing di baris sendiri.',
              },
              starter: 'import numpy as np\na = np.array([int(input()) for _ in range(5)])\n',
              tests: [
                { name: { en: '1..5', id: '1..5' }, stdin: ['1', '2', '3', '4', '5'], expectOutput: '[1 2 3]\n[4 5]' },
                { name: { en: '10..50', id: '10..50' }, stdin: ['10', '20', '30', '40', '50'], expectOutput: '[10 20 30]\n[40 50]' },
                { name: { en: 'all zeros', id: 'semua nol' }, stdin: ['0', '0', '0', '0', '0'], expectOutput: '[0 0 0]\n[0 0]' },
                { name: { en: 'descending', id: 'menurun' }, stdin: ['7', '6', '5', '4', '3'], expectOutput: '[7 6 5]\n[4 3]' },
              ],
              hints: [
                { en: 'print(a[:3]) and print(a[-2:]).', id: 'print(a[:3]) dan print(a[-2:]).' },
              ],
              solution: 'import numpy as np\na = np.array([int(input()) for _ in range(5)])\nprint(a[:3])\nprint(a[-2:])',
            },
          ],
        },
      ],
      project: {
        id: 'pynum-m1-s1-p',
        title: { en: 'Resultant Force Vector', id: 'Vektor Resultan Gaya' },
        brief: {
          en: 'Given several forces acting on an object, each with an x and y component, find the single combined force.',
          id: 'Diberikan beberapa gaya yang bekerja pada sebuah benda, masing-masing dengan komponen x dan y, cari satu gaya gabungannya.',
        },
        requirements: [
          { en: 'Read `n`, then `n` pairs of `fx`, `fy` (each may have a decimal point).', id: 'Baca `n`, lalu `n` pasang `fx`, `fy` (masing-masing bisa desimal).' },
          { en: 'Sum every force into one array `resultan`, starting from `np.array([0.0, 0.0])`.', id: 'Jumlahkan setiap gaya ke satu array `resultan`, mulai dari `np.array([0.0, 0.0])`.' },
          { en: 'Print `resultan`, then its magnitude (`np.linalg.norm`) rounded to 2 decimal places.', id: 'Cetak `resultan`, lalu besarnya (`np.linalg.norm`) dibulatkan ke 2 angka desimal.' },
        ],
        starter: 'import numpy as np\nn = int(input())\nresultan = np.array([0.0, 0.0])\nfor _ in range(n):\n    fx = float(input())\n    fy = float(input())\n',
        tests: [
          { name: { en: 'one force (3,4) → magnitude 5', id: 'satu gaya (3,4) → besar 5' }, stdin: ['1', '3', '4'], expectOutput: '[3. 4.]\n5.0' },
          { name: { en: 'two forces summing to (3,4)', id: 'dua gaya berjumlah (3,4)' }, stdin: ['2', '3', '0', '0', '4'], expectOutput: '[3. 4.]\n5.0' },
          { name: { en: 'three forces summing to (2,2)', id: 'tiga gaya berjumlah (2,2)' }, stdin: ['3', '1', '0', '0', '1', '1', '1'], expectOutput: '[2. 2.]\n2.83' },
          { name: { en: 'one force (5,12) → magnitude 13', id: 'satu gaya (5,12) → besar 13' }, stdin: ['1', '5', '12'], expectOutput: '[ 5. 12.]\n13.0' },
        ],
        hints: [
          { en: 'resultan = resultan + np.array([fx, fy]) inside the loop.', id: 'resultan = resultan + np.array([fx, fy]) di dalam perulangan.' },
          { en: 'np.linalg.norm(resultan) gives the length of the combined vector directly.', id: 'np.linalg.norm(resultan) langsung memberi panjang vektor gabungannya.' },
        ],
        solution:
          'import numpy as np\nn = int(input())\nresultan = np.array([0.0, 0.0])\nfor _ in range(n):\n    fx = float(input())\n    fy = float(input())\n    resultan = resultan + np.array([fx, fy])\nprint(resultan)\nprint(round(np.linalg.norm(resultan), 2))',
        xp: 50,
      },
    },

    /* ------------------------------------------------ 1.2 dot product & norm */
    {
      id: 'pynum-m1-s2',
      title: { en: 'Dot Product and Norm', id: 'Dot Product dan Norma' },
      summary: {
        en: 'One number tells you how aligned two vectors are; one function tells you how long a vector is.',
        id: 'Satu angka memberi tahu seberapa selaras dua vektor; satu fungsi memberi tahu seberapa panjang sebuah vektor.',
      },
      lessons: [
        {
          id: 'pynum-m1-s2-l1',
          title: { en: 'np.dot and the Angle Between Vectors', id: 'np.dot dan Sudut Antar Vektor' },
          goal: { en: 'Combine two vectors into a single number.', id: 'Menggabungkan dua vektor menjadi satu angka.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Multiply, then add it all up', id: 'Kalikan, lalu jumlahkan semuanya' },
              body: {
                en: '`np.dot(a, b)` multiplies each pair of elements and adds the results together into one number — `1*4 + 2*5 + 3*6`. It is the single most useful number two vectors can produce together.',
                id: '`np.dot(a, b)` mengalikan tiap pasang unsur dan menjumlahkan hasilnya jadi satu angka — `1*4 + 2*5 + 3*6`. Itulah satu angka paling berguna yang bisa dihasilkan dua vektor bersama.',
              },
              code: 'import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(np.dot(a, b))',
              output: '32',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Zero means perpendicular', id: 'Nol berarti tegak lurus' },
              body: {
                en: 'The dot product of two perpendicular vectors is always exactly 0 — no matter their length, only their direction relative to each other matters.',
                id: 'Dot product dari dua vektor yang tegak lurus selalu tepat 0 — panjangnya tak berpengaruh, hanya arahnya satu sama lain yang menentukan.',
              },
              code: 'import numpy as np\na = np.array([1, 0])\nb = np.array([0, 1])\nprint(np.dot(a, b))',
              output: '0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'a = [2, 0] and b = [3, 0] point the same direction. What is np.dot(a, b)?',
                id: 'a = [2, 0] dan b = [3, 0] mengarah ke arah yang sama. Berapa np.dot(a, b)?',
              },
              options: [
                { en: '6', id: '6' },
                { en: '0', id: '0' },
                { en: '5', id: '5' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: '2*3 + 0*0 = 6 — two vectors pointing the same way always give a positive dot product.',
                id: '2*3 + 0*0 = 6 — dua vektor yang mengarah sama selalu menghasilkan dot product positif.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Compute the dot product of two arrays.',
                id: 'Hitung dot product dua array.',
              },
              template: 'import numpy as np\na = np.array([2, 3])\nb = np.array([4, 1])\nhasil = np.___(a, b)\nprint(hasil)',
              blanks: ['dot'],
              explain: {
                en: 'np.dot is the function that multiplies and sums in one step.',
                id: 'np.dot adalah fungsi yang mengalikan dan menjumlahkan dalam satu langkah.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program printing the dot product of two arrays.',
                id: 'Susun program yang mencetak dot product dua array.',
              },
              lines: ['import numpy as np', 'a = np.array([1, 1, 1])', 'b = np.array([5, 5, 5])', 'print(np.dot(a, b))'],
              explain: {
                en: 'Both arrays have to exist before np.dot can combine them.',
                id: 'Kedua arraynya harus ada dulu sebelum np.dot bisa menggabungkannya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read 3 numbers into array `a`, then 3 more into array `b`. Print `np.dot(a, b)`.',
                id: 'Baca 3 angka ke dalam array `a`, lalu 3 angka lagi ke dalam array `b`. Cetak `np.dot(a, b)`.',
              },
              starter: 'import numpy as np\na = np.array([int(input()) for _ in range(3)])\nb = np.array([int(input()) for _ in range(3)])\n',
              tests: [
                { name: { en: '[1,2,3]·[4,5,6]', id: '[1,2,3]·[4,5,6]' }, stdin: ['1', '2', '3', '4', '5', '6'], expectOutput: '32' },
                { name: { en: 'perpendicular-ish', id: 'hampir tegak lurus' }, stdin: ['1', '0', '0', '0', '1', '0'], expectOutput: '0' },
                { name: { en: 'all ones', id: 'semua satu' }, stdin: ['1', '1', '1', '1', '1', '1'], expectOutput: '3' },
                { name: { en: 'negative components', id: 'komponen negatif' }, stdin: ['-1', '2', '-3', '1', '1', '1'], expectOutput: '-2' },
              ],
              hints: [
                { en: 'One line: print(np.dot(a, b)).', id: 'Satu baris: print(np.dot(a, b)).' },
              ],
              solution: 'import numpy as np\na = np.array([int(input()) for _ in range(3)])\nb = np.array([int(input()) for _ in range(3)])\nprint(np.dot(a, b))',
            },
          ],
        },
        {
          id: 'pynum-m1-s2-l2',
          title: { en: 'np.linalg.norm', id: 'np.linalg.norm' },
          goal: { en: 'Measure the length of a vector.', id: 'Mengukur panjang sebuah vektor.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A vector\'s own length', id: 'Panjang sebuah vektor itu sendiri' },
              body: {
                en: '`np.linalg.norm(a)` computes a vector\'s length — the straight-line distance from the origin to the point it represents. For `[3, 4]` that is the familiar 3-4-5 triangle: exactly 5.',
                id: '`np.linalg.norm(a)` menghitung panjang sebuah vektor — jarak garis lurus dari titik asal ke titik yang diwakilinya. Untuk `[3, 4]` itu segitiga 3-4-5 yang dikenal: tepat 5.',
              },
              code: 'import numpy as np\na = np.array([3, 4])\nprint(np.linalg.norm(a))',
              output: '5.0',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Dividing by your own length', id: 'Membagi dengan panjang sendiri' },
              body: {
                en: 'A vector divided by its own norm keeps its direction but always has length exactly 1 — a **unit vector**. Useful whenever only the direction matters, not how far it reaches.',
                id: 'Vektor yang dibagi dengan normanya sendiri tetap mempertahankan arahnya tapi selalu berpanjang tepat 1 — **vektor satuan**. Berguna kapan pun hanya arahnya yang penting, bukan seberapa jauh ia menjangkau.',
              },
              code: 'import numpy as np\na = np.array([3.0, 4.0])\nunit = a / np.linalg.norm(a)\nprint(unit)',
              output: '[0.6 0.8]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is np.linalg.norm(np.array([5, 12]))?', id: 'Berapa np.linalg.norm(np.array([5, 12]))?' },
              options: [
                { en: '13.0', id: '13.0' },
                { en: '17.0', id: '17.0' },
                { en: '60.0', id: '60.0' },
                { en: '7.0', id: '7.0' },
              ],
              answer: 0,
              explain: {
                en: 'sqrt(5² + 12²) is sqrt(169), which is 13 — the 5-12-13 triangle.',
                id: 'sqrt(5² + 12²) adalah sqrt(169), yaitu 13 — segitiga 5-12-13.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Compute the length of a vector.',
                id: 'Hitung panjang sebuah vektor.',
              },
              template: 'import numpy as np\na = np.array([6, 8])\npanjang = np.linalg.___(a)\nprint(panjang)',
              blanks: ['norm'],
              explain: {
                en: 'norm is the function under np.linalg that measures a vector\'s length.',
                id: 'norm adalah fungsi di bawah np.linalg yang mengukur panjang sebuah vektor.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program printing the length of a 3D vector.',
                id: 'Susun program yang mencetak panjang vektor 3D.',
              },
              lines: ['import numpy as np', 'a = np.array([1, 2, 2])', 'print(np.linalg.norm(a))'],
              explain: {
                en: 'norm works on a vector of any length, not only 2D ones.',
                id: 'norm bekerja pada vektor sepanjang apa pun, tak hanya yang 2D.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `x` and `y`. Print `np.linalg.norm` of the vector `(x, y)`, rounded to 2 decimal places.',
                id: 'Baca `x` dan `y`. Cetak `np.linalg.norm` dari vektor `(x, y)`, dibulatkan ke 2 angka desimal.',
              },
              starter: 'import numpy as np\nx = float(input())\ny = float(input())\n',
              tests: [
                { name: { en: '(3, 4) → 5.0', id: '(3, 4) → 5.0' }, stdin: ['3', '4'], expectOutput: '5.0' },
                { name: { en: '(5, 12) → 13.0', id: '(5, 12) → 13.0' }, stdin: ['5', '12'], expectOutput: '13.0' },
                { name: { en: '(1, 1) → 1.41', id: '(1, 1) → 1.41' }, stdin: ['1', '1'], expectOutput: '1.41' },
                { name: { en: '(0, 0) → 0.0', id: '(0, 0) → 0.0' }, stdin: ['0', '0'], expectOutput: '0.0' },
              ],
              hints: [
                { en: 'a = np.array([x, y]), then round(np.linalg.norm(a), 2).', id: 'a = np.array([x, y]), lalu round(np.linalg.norm(a), 2).' },
              ],
              solution: 'import numpy as np\nx = float(input())\ny = float(input())\na = np.array([x, y])\nprint(round(np.linalg.norm(a), 2))',
            },
          ],
        },
      ],
      project: {
        id: 'pynum-m1-s2-p',
        title: { en: 'Angle Between Two Vectors', id: 'Sudut Antara Dua Vektor' },
        brief: {
          en: 'Combine the dot product and the norm into the formula that finds the angle between any two vectors.',
          id: 'Gabungkan dot product dan norma menjadi formula yang mencari sudut antara dua vektor mana pun.',
        },
        requirements: [
          { en: 'Read `ax`, `ay`, `bx`, `by` (each may have a decimal point).', id: 'Baca `ax`, `ay`, `bx`, `by` (masing-masing bisa desimal).' },
          { en: 'Compute `cos(sudut) = dot(a, b) / (norm(a) * norm(b))`.', id: 'Hitung `cos(sudut) = dot(a, b) / (norm(a) * norm(b))`.' },
          { en: 'Use `np.arccos` to recover the angle in radians, then `np.degrees` to convert it to degrees.', id: 'Pakai `np.arccos` untuk mendapatkan sudutnya dalam radian, lalu `np.degrees` untuk mengubahnya ke derajat.' },
          { en: 'Print the angle rounded to 1 decimal place.', id: 'Cetak sudutnya dibulatkan ke 1 angka desimal.' },
        ],
        starter: 'import numpy as np\nax = float(input())\nay = float(input())\nbx = float(input())\nby = float(input())\n',
        tests: [
          { name: { en: 'perpendicular → 90°', id: 'tegak lurus → 90°' }, stdin: ['1', '0', '0', '1'], expectOutput: '90.0' },
          { name: { en: 'same direction → 0°', id: 'searah → 0°' }, stdin: ['1', '0', '1', '0'], expectOutput: '0.0' },
          { name: { en: 'opposite → 180°', id: 'berlawanan → 180°' }, stdin: ['1', '0', '-1', '0'], expectOutput: '180.0' },
          { name: { en: '45°', id: '45°' }, stdin: ['1', '1', '1', '0'], expectOutput: '45.0' },
        ],
        hints: [
          { en: 'a = np.array([ax, ay]); b = np.array([bx, by]).', id: 'a = np.array([ax, ay]); b = np.array([bx, by]).' },
          { en: 'cos_sudut = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))', id: 'cos_sudut = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))' },
        ],
        solution:
          'import numpy as np\nax = float(input())\nay = float(input())\nbx = float(input())\nby = float(input())\na = np.array([ax, ay])\nb = np.array([bx, by])\ncos_sudut = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\nsudut = np.degrees(np.arccos(cos_sudut))\nprint(round(sudut, 1))',
        xp: 50,
      },
    },
  ],
}
