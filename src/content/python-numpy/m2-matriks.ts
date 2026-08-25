import type { Module } from '../types'

/** Module 2 — 2D arrays as matrices: @ for matrix multiplication (a
 *  transformation applied to points), and np.linalg.solve for a system of
 *  linear equations that would otherwise be solved by hand, one substitution
 *  at a time. */
export const module2: Module = {
  id: 'pynum-m2',
  title: { en: 'Matrices and Linear Systems', id: 'Matriks dan Sistem Linear' },
  summary: {
    en: 'A 2D array transforms points with a single @; np.linalg.solve answers a system of equations directly, no substitution required.',
    id: 'Array 2D mentransformasikan titik dengan satu @; np.linalg.solve langsung menjawab sistem persamaan, tanpa substitusi manual.',
  },
  submodules: [
    /* -------------------------------------------------- 2.1 matrices as 2D arrays */
    {
      id: 'pynum-m2-s1',
      title: { en: 'Matrices as 2D Arrays', id: 'Matriks sebagai Array 2D' },
      summary: {
        en: 'A list of lists becomes a matrix, and @ applies it to a point the way a formula applies to a number.',
        id: 'List berisi list menjadi matriks, dan @ menerapkannya ke sebuah titik seperti formula diterapkan ke sebuah angka.',
      },
      lessons: [
        {
          id: 'pynum-m2-s1-l1',
          title: { en: 'Creating a Matrix and Its Transpose', id: 'Membuat Matriks dan Transpos' },
          goal: { en: 'Build a 2D array and flip its rows and columns.', id: 'Membangun array 2D dan menukar barisnya dengan kolomnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A list of rows', id: 'List berisi baris' },
              body: {
                en: 'A matrix is a list of lists — each inner list is one row. `np.array([[1, 2], [3, 4]])` makes a 2-by-2 matrix, and it prints with one row per line, brackets nested to show the structure.',
                id: 'Matriks adalah list berisi list — tiap list dalamnya satu baris. `np.array([[1, 2], [3, 4]])` membuat matriks 2 kali 2, dan dicetak dengan satu baris per baris teks, kurungnya bersarang menunjukkan strukturnya.',
              },
              code: 'import numpy as np\nA = np.array([[1, 2], [3, 4]])\nprint(A)',
              output: '[[1 2]\n [3 4]]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Rows become columns', id: 'Baris menjadi kolom' },
              body: {
                en: '`.T` transposes a matrix — every row becomes a column, and every column becomes a row. A 2-by-3 matrix transposes into a 3-by-2 one.',
                id: '`.T` mentransposisikan matriks — tiap baris menjadi kolom, dan tiap kolom menjadi baris. Matriks 2 kali 3 bertransposisi menjadi 3 kali 2.',
              },
              code: 'import numpy as np\nA = np.array([[1, 2, 3], [4, 5, 6]])\nprint(A.T)',
              output: '[[1 4]\n [2 5]\n [3 6]]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A has 2 rows and 3 columns. How many rows and columns does A.T have?',
                id: 'A punya 2 baris dan 3 kolom. Berapa baris dan kolom A.T?',
              },
              options: [
                { en: '3 rows, 2 columns', id: '3 baris, 2 kolom' },
                { en: '2 rows, 3 columns — unchanged', id: '2 baris, 3 kolom — tak berubah' },
                { en: '3 rows, 3 columns', id: '3 baris, 3 kolom' },
                { en: 'It depends on the values', id: 'Bergantung pada nilainya' },
              ],
              answer: 0,
              explain: {
                en: 'Transposing always swaps the row and column counts — the shape flips.',
                id: 'Transposisi selalu menukar jumlah baris dan kolom — bentuknya berbalik.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Transpose a matrix.',
                id: 'Transposisikan sebuah matriks.',
              },
              template: 'import numpy as np\nA = np.array([[1, 2], [3, 4], [5, 6]])\nprint(A.___)',
              blanks: ['T'],
              explain: {
                en: '.T is the attribute (no parentheses) that flips rows and columns.',
                id: '.T adalah atribut (tanpa kurung) yang membalik baris dan kolom.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program creating a matrix and printing its transpose.',
                id: 'Susun program yang membuat matriks dan mencetak transposnya.',
              },
              lines: ['import numpy as np', 'A = np.array([[7, 8], [9, 10]])', 'print(A.T)'],
              explain: {
                en: 'The matrix has to exist before .T can flip it.',
                id: 'Matriksnya harus ada dulu sebelum .T bisa membaliknya.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read four numbers `a`, `b`, `c`, `d`. Build the matrix `[[a, b], [c, d]]` and print it, then print its transpose.',
                id: 'Baca empat angka `a`, `b`, `c`, `d`. Bangun matriks `[[a, b], [c, d]]` dan cetak, lalu cetak transposnya.',
              },
              starter: 'import numpy as np\na = int(input())\nb = int(input())\nc = int(input())\nd = int(input())\n',
              tests: [
                { name: { en: '1,2,3,4', id: '1,2,3,4' }, stdin: ['1', '2', '3', '4'], expectOutput: '[[1 2]\n [3 4]]\n[[1 3]\n [2 4]]' },
                { name: { en: '5,0,0,5', id: '5,0,0,5' }, stdin: ['5', '0', '0', '5'], expectOutput: '[[5 0]\n [0 5]]\n[[5 0]\n [0 5]]' },
                { name: { en: '1,2,3,4 reversed digits', id: '1,2,3,4 dibalik' }, stdin: ['9', '8', '7', '6'], expectOutput: '[[9 8]\n [7 6]]\n[[9 7]\n [8 6]]' },
              ],
              hints: [
                { en: 'A = np.array([[a, b], [c, d]]), then print(A) and print(A.T).', id: 'A = np.array([[a, b], [c, d]]), lalu print(A) dan print(A.T).' },
              ],
              solution: 'import numpy as np\na = int(input())\nb = int(input())\nc = int(input())\nd = int(input())\nA = np.array([[a, b], [c, d]])\nprint(A)\nprint(A.T)',
            },
          ],
        },
        {
          id: 'pynum-m2-s1-l2',
          title: { en: 'Matrix Multiplication with @', id: 'Perkalian Matriks dengan @' },
          goal: { en: 'Apply a matrix to a point.', id: 'Menerapkan matriks pada sebuah titik.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: '@ is matrix multiplication, not elementwise', id: '@ adalah perkalian matriks, bukan elementwise' },
              body: {
                en: '`*` between two arrays multiplies elementwise; `@` does real matrix multiplication instead. The identity matrix `[[1, 0], [0, 1]]` leaves any point exactly where it was — a useful matrix to check your work against.',
                id: '`*` antara dua array mengalikan elementwise; `@` sebaliknya melakukan perkalian matriks sungguhan. Matriks identitas `[[1, 0], [0, 1]]` membiarkan titik mana pun tepat di tempatnya — matriks yang berguna untuk memeriksa pekerjaanmu.',
              },
              code: 'import numpy as np\nA = np.array([[1, 0], [0, 1]])\nv = np.array([5, 3])\nprint(A @ v)',
              output: '[5 3]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A matrix that scales', id: 'Matriks yang menskalakan' },
              body: {
                en: '`[[2, 0], [0, 2]]` doubles both coordinates of any point it is applied to — a scaling transformation. The matrix\'s numbers decide exactly what happens to a point; changing them changes the transformation.',
                id: '`[[2, 0], [0, 2]]` menggandakan kedua koordinat titik mana pun yang dikenainya — transformasi penskalaan. Angka-angka pada matriksnya menentukan persis apa yang terjadi pada sebuah titik; mengubahnya mengubah transformasinya.',
              },
              code: 'import numpy as np\nA = np.array([[2, 0], [0, 2]])\nv = np.array([3, 4])\nprint(A @ v)',
              output: '[6 8]',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A = [[0, -1], [1, 0]] applied to v = [1, 0]. What comes out?',
                id: 'A = [[0, -1], [1, 0]] diterapkan pada v = [1, 0]. Apa yang keluar?',
              },
              options: [
                { en: '[0 1]', id: '[0 1]' },
                { en: '[1 0]', id: '[1 0]' },
                { en: '[-1 0]', id: '[-1 0]' },
                { en: '[0 -1]', id: '[0 -1]' },
              ],
              answer: 0,
              explain: {
                en: 'Row 1 gives 0*1 + (-1)*0 = 0; row 2 gives 1*1 + 0*0 = 1 — this particular matrix rotates a point 90°.',
                id: 'Baris 1 memberi 0*1 + (-1)*0 = 0; baris 2 memberi 1*1 + 0*0 = 1 — matriks khusus ini memutar titik 90°.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Apply a matrix to a vector.',
                id: 'Terapkan matriks pada vektor.',
              },
              template: 'import numpy as np\nA = np.array([[3, 0], [0, 3]])\nv = np.array([2, 5])\nhasil = A ___ v\nprint(hasil)',
              blanks: ['@'],
              explain: {
                en: '@ is the operator for real matrix (or matrix-vector) multiplication.',
                id: '@ adalah operator untuk perkalian matriks (atau matriks-vektor) sungguhan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program applying a reflection matrix to a point.',
                id: 'Susun program yang menerapkan matriks pencerminan pada sebuah titik.',
              },
              lines: ['import numpy as np', 'A = np.array([[1, 0], [0, -1]])', 'v = np.array([2, 3])', 'print(A @ v)'],
              explain: {
                en: 'This particular matrix flips the y-coordinate, leaving x untouched — a reflection over the x-axis.',
                id: 'Matriks khusus ini membalik koordinat y, membiarkan x tak tersentuh — pencerminan terhadap sumbu x.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read four numbers `a, b, c, d` (the matrix `[[a, b], [c, d]]`), then two more `x, y` (the point). Print `A @ v`.',
                id: 'Baca empat angka `a, b, c, d` (matriks `[[a, b], [c, d]]`), lalu dua angka lagi `x, y` (titiknya). Cetak `A @ v`.',
              },
              starter: 'import numpy as np\na = int(input())\nb = int(input())\nc = int(input())\nd = int(input())\nx = int(input())\ny = int(input())\n',
              tests: [
                { name: { en: 'identity on (5,3)', id: 'identitas pada (5,3)' }, stdin: ['1', '0', '0', '1', '5', '3'], expectOutput: '[5 3]' },
                { name: { en: 'scale by 2 on (3,4)', id: 'skala 2 pada (3,4)' }, stdin: ['2', '0', '0', '2', '3', '4'], expectOutput: '[6 8]' },
                { name: { en: 'rotate 90 on (1,0)', id: 'putar 90 pada (1,0)' }, stdin: ['0', '-1', '1', '0', '1', '0'], expectOutput: '[0 1]' },
                { name: { en: 'reflect x on (2,3)', id: 'cerminkan x pada (2,3)' }, stdin: ['1', '0', '0', '-1', '2', '3'], expectOutput: '[ 2 -3]' },
              ],
              hints: [
                { en: 'A = np.array([[a, b], [c, d]]); v = np.array([x, y]); print(A @ v).', id: 'A = np.array([[a, b], [c, d]]); v = np.array([x, y]); print(A @ v).' },
              ],
              solution:
                'import numpy as np\na = int(input())\nb = int(input())\nc = int(input())\nd = int(input())\nx = int(input())\ny = int(input())\nA = np.array([[a, b], [c, d]])\nv = np.array([x, y])\nprint(A @ v)',
            },
          ],
        },
      ],
      project: {
        id: 'pynum-m2-s1-p',
        title: { en: 'Transforming a Set of Points', id: 'Transformasi Sekumpulan Titik' },
        brief: {
          en: 'Apply the same transformation matrix to every point in a list, one at a time.',
          id: 'Terapkan matriks transformasi yang sama ke tiap titik dalam sebuah daftar, satu per satu.',
        },
        requirements: [
          { en: 'Read `a, b, c, d` (the matrix `[[a, b], [c, d]]`), then `n`, then `n` points as `x, y` pairs.', id: 'Baca `a, b, c, d` (matriks `[[a, b], [c, d]]`), lalu `n`, lalu `n` titik sebagai pasangan `x, y`.' },
          { en: 'For each point, print `A @ v` where v is that point.', id: 'Untuk tiap titik, cetak `A @ v` dengan v adalah titik itu.' },
        ],
        starter: 'import numpy as np\na = int(input())\nb = int(input())\nc = int(input())\nd = int(input())\nA = np.array([[a, b], [c, d]])\nn = int(input())\n',
        tests: [
          { name: { en: 'identity, one point', id: 'identitas, satu titik' }, stdin: ['1', '0', '0', '1', '1', '3', '4'], expectOutput: '[3 4]' },
          { name: { en: 'scale by 2, two points', id: 'skala 2, dua titik' }, stdin: ['2', '0', '0', '2', '2', '1', '2', '3', '4'], expectOutput: '[2 4]\n[6 8]' },
          { name: { en: 'rotate 90, one point', id: 'putar 90, satu titik' }, stdin: ['0', '-1', '1', '0', '1', '1', '0'], expectOutput: '[0 1]' },
          { name: { en: 'reflect x, one point', id: 'cerminkan x, satu titik' }, stdin: ['1', '0', '0', '-1', '1', '2', '3'], expectOutput: '[ 2 -3]' },
        ],
        hints: [
          { en: 'A loop reading a point, building a vector, and printing A @ v — repeated n times.', id: 'Perulangan yang membaca titik, membangun vektor, dan mencetak A @ v — diulang n kali.' },
        ],
        solution:
          'import numpy as np\na = int(input())\nb = int(input())\nc = int(input())\nd = int(input())\nA = np.array([[a, b], [c, d]])\nn = int(input())\nfor _ in range(n):\n    x = int(input())\n    y = int(input())\n    v = np.array([x, y])\n    print(A @ v)',
        xp: 50,
      },
    },

    /* ---------------------------------------------- 2.2 solving linear systems */
    {
      id: 'pynum-m2-s2',
      title: { en: 'Solving Systems of Linear Equations', id: 'Menyelesaikan Sistem Persamaan Linear' },
      summary: {
        en: 'Two equations, two unknowns, no substitution — np.linalg.solve answers directly, and A @ x checks the answer.',
        id: 'Dua persamaan, dua yang tak diketahui, tanpa substitusi — np.linalg.solve langsung menjawab, dan A @ x memeriksa jawabannya.',
      },
      lessons: [
        {
          id: 'pynum-m2-s2-l1',
          title: { en: 'np.linalg.solve', id: 'np.linalg.solve' },
          goal: { en: 'Solve a system of equations in one call.', id: 'Menyelesaikan sistem persamaan dalam satu pemanggilan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A system as a matrix and a vector', id: 'Sistem sebagai matriks dan vektor' },
              body: {
                en: '`2x + y = 5` and `x + 3y = 10` become a matrix of coefficients and a vector of right-hand sides: `A = [[2, 1], [1, 3]]`, `b = [5, 10]`. `np.linalg.solve(A, b)` finds `x` and `y` directly — no substitution, no elimination by hand.',
                id: '`2x + y = 5` dan `x + 3y = 10` menjadi matriks koefisien dan vektor ruas kanan: `A = [[2, 1], [1, 3]]`, `b = [5, 10]`. `np.linalg.solve(A, b)` langsung mencari `x` dan `y` — tanpa substitusi, tanpa eliminasi manual.',
              },
              code: 'import numpy as np\nA = np.array([[2, 1], [1, 3]])\nb = np.array([5, 10])\nhasil = np.linalg.solve(A, b)\nprint(hasil)',
              output: '[1. 3.]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reading two unknowns out of the result', id: 'Membaca dua yang tak diketahui dari hasilnya' },
              body: {
                en: 'The result is an array with one value per unknown, in the order the columns were written — `hasil[0]` is x, `hasil[1]` is y, matching the order `A` was built in.',
                id: 'Hasilnya berupa array dengan satu nilai per yang-tak-diketahui, sesuai urutan kolomnya ditulis — `hasil[0]` adalah x, `hasil[1]` adalah y, sesuai urutan `A` dibangun.',
              },
              code: 'import numpy as np\nA = np.array([[2, 1], [1, 3]])\nb = np.array([5, 10])\nhasil = np.linalg.solve(A, b)\nprint(round(hasil[0], 1))\nprint(round(hasil[1], 1))',
              output: '1.0\n3.0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'x + y = 10 and x - y = 2. Which A and b describe this system?',
                id: 'x + y = 10 dan x - y = 2. Manakah A dan b yang menggambarkan sistem ini?',
              },
              options: [
                { en: 'A = [[1, 1], [1, -1]], b = [10, 2]', id: 'A = [[1, 1], [1, -1]], b = [10, 2]' },
                { en: 'A = [[1, 1], [1, -1]], b = [2, 10]', id: 'A = [[1, 1], [1, -1]], b = [2, 10]' },
                { en: 'A = [[1, -1], [1, 1]], b = [10, 2]', id: 'A = [[1, -1], [1, 1]], b = [10, 2]' },
                { en: 'A = [[10, 2], [1, 1]], b = [1, -1]', id: 'A = [[10, 2], [1, 1]], b = [1, -1]' },
              ],
              answer: 0,
              explain: {
                en: 'Each row of A holds one equation\'s coefficients, in the same order as the matching entry in b.',
                id: 'Tiap baris A menyimpan koefisien satu persamaan, dalam urutan yang sama seperti entri yang cocok di b.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Solve a system of equations.',
                id: 'Selesaikan sebuah sistem persamaan.',
              },
              template: 'import numpy as np\nA = np.array([[1, 1], [1, -1]])\nb = np.array([10, 2])\nhasil = np.linalg.___(A, b)\nprint(hasil)',
              blanks: ['solve'],
              explain: {
                en: 'solve is the function under np.linalg that answers a system of equations directly.',
                id: 'solve adalah fungsi di bawah np.linalg yang langsung menjawab sistem persamaan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program solving x + y = 10, x - y = 2.',
                id: 'Susun program yang menyelesaikan x + y = 10, x - y = 2.',
              },
              lines: ['import numpy as np', 'A = np.array([[1, 1], [1, -1]])', 'b = np.array([10, 2])', 'print(np.linalg.solve(A, b))'],
              explain: {
                en: 'A and b both have to exist before solve can use them together.',
                id: 'A dan b harus ada dulu keduanya sebelum solve bisa memakainya bersama.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read six numbers: `a1, b1, c1` for the first equation `a1*x + b1*y = c1`, then `a2, b2, c2` for the second. Print x then y, each rounded to 1 decimal place.',
                id: 'Baca enam angka: `a1, b1, c1` untuk persamaan pertama `a1*x + b1*y = c1`, lalu `a2, b2, c2` untuk yang kedua. Cetak x lalu y, masing-masing dibulatkan ke 1 angka desimal.',
              },
              starter: 'import numpy as np\na1 = float(input())\nb1 = float(input())\nc1 = float(input())\na2 = float(input())\nb2 = float(input())\nc2 = float(input())\n',
              tests: [
                { name: { en: 'x=6, y=4', id: 'x=6, y=4' }, stdin: ['1', '1', '10', '1', '-1', '2'], expectOutput: '6.0\n4.0' },
                { name: { en: 'x=1, y=3', id: 'x=1, y=3' }, stdin: ['2', '1', '5', '1', '3', '10'], expectOutput: '1.0\n3.0' },
                { name: { en: 'x=2, y=3', id: 'x=2, y=3' }, stdin: ['3', '2', '12', '1', '1', '5'], expectOutput: '2.0\n3.0' },
              ],
              hints: [
                { en: 'A = np.array([[a1, b1], [a2, b2]]); b = np.array([c1, c2]).', id: 'A = np.array([[a1, b1], [a2, b2]]); b = np.array([c1, c2]).' },
              ],
              solution:
                'import numpy as np\na1 = float(input())\nb1 = float(input())\nc1 = float(input())\na2 = float(input())\nb2 = float(input())\nc2 = float(input())\nA = np.array([[a1, b1], [a2, b2]])\nb = np.array([c1, c2])\nhasil = np.linalg.solve(A, b)\nprint(round(hasil[0], 1))\nprint(round(hasil[1], 1))',
            },
          ],
        },
        {
          id: 'pynum-m2-s2-l2',
          title: { en: 'Checking a Solution', id: 'Memeriksa Solusi' },
          goal: { en: 'Confirm a solution by substituting it back in.', id: 'Memastikan sebuah solusi dengan mensubstitusinya kembali.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A @ x should give back b', id: 'A @ x seharusnya mengembalikan b' },
              body: {
                en: 'If `x` is a genuine solution to `A @ x = b`, multiplying it back through `A` should reproduce `b` almost exactly — this is the same check anyone does by hand, substituting an answer back into the original equations.',
                id: 'Kalau `x` benar-benar solusi dari `A @ x = b`, mengalikannya kembali lewat `A` seharusnya menghasilkan `b` nyaris persis — pemeriksaan yang sama seperti yang dilakukan siapa pun secara manual, mensubstitusi jawaban kembali ke persamaan aslinya.',
              },
              code: 'import numpy as np\nA = np.array([[2, 1], [1, 3]])\nx = np.array([1.0, 3.0])\nprint(A @ x)',
              output: '[ 5. 10.]',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Comparing with a tolerance', id: 'Membandingkan dengan toleransi' },
              body: {
                en: 'Solved values often carry tiny floating-point noise, so comparing them to the original `b` exactly can fail even for a correct answer. `np.allclose(a, b)` compares two arrays allowing a small, sensible difference.',
                id: 'Nilai hasil solve sering membawa derau titik-mengambang yang sangat kecil, jadi membandingkannya dengan `b` asli secara persis bisa gagal meski jawabannya benar. `np.allclose(a, b)` membandingkan dua array dengan mengizinkan selisih kecil yang wajar.',
              },
              code: 'import numpy as np\nA = np.array([[2, 1], [1, 3]])\nb = np.array([5, 10])\nx = np.linalg.solve(A, b)\nprint(np.allclose(A @ x, b))',
              output: 'True',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'x = [1.0, 3.0] is checked against A = [[2, 1], [1, 3]] and b = [5, 11] (note: 11, not 10). What does np.allclose(A @ x, b) return?',
                id: 'x = [1.0, 3.0] diperiksa terhadap A = [[2, 1], [1, 3]] dan b = [5, 11] (catat: 11, bukan 10). Apa yang dikembalikan np.allclose(A @ x, b)?',
              },
              options: [
                { en: 'False', id: 'False' },
                { en: 'True', id: 'True' },
                { en: 'An error', id: 'Error' },
                { en: '[5, 10]', id: '[5, 10]' },
              ],
              answer: 0,
              explain: {
                en: 'A @ x is [5, 10], and 10 is not close to 11 by any sensible tolerance — allclose correctly says False.',
                id: 'A @ x adalah [5, 10], dan 10 tidak dekat dengan 11 dengan toleransi wajar mana pun — allclose dengan benar mengatakan False.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Check a solution against the original b.',
                id: 'Periksa sebuah solusi terhadap b aslinya.',
              },
              template: 'import numpy as np\nA = np.array([[1, 1], [1, -1]])\nb = np.array([10, 2])\nx = np.linalg.solve(A, b)\nprint(np.___(A @ x, b))',
              blanks: ['allclose'],
              explain: {
                en: 'allclose is the tolerant comparison built for exactly this kind of check.',
                id: 'allclose adalah perbandingan toleran yang dibangun persis untuk pemeriksaan semacam ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program solving a system, then verifying the answer.',
                id: 'Susun program yang menyelesaikan sistem, lalu memastikan jawabannya.',
              },
              lines: [
                'import numpy as np',
                'A = np.array([[3, 2], [1, 1]])',
                'b = np.array([12, 5])',
                'x = np.linalg.solve(A, b)',
                'print(np.allclose(A @ x, b))',
              ],
              explain: {
                en: 'x has to be solved for before it can be checked — the verification always comes last.',
                id: 'x harus diselesaikan dulu sebelum bisa diperiksa — verifikasinya selalu datang terakhir.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'Read `a1, b1, c1, a2, b2, c2` as in the last lesson. Solve for `x`, then print `np.allclose(A @ x, b)`.',
                id: 'Baca `a1, b1, c1, a2, b2, c2` seperti pada pelajaran lalu. Selesaikan untuk `x`, lalu cetak `np.allclose(A @ x, b)`.',
              },
              starter:
                'import numpy as np\na1 = float(input())\nb1 = float(input())\nc1 = float(input())\na2 = float(input())\nb2 = float(input())\nc2 = float(input())\n',
              tests: [
                { name: { en: 'always true for a real solution', id: 'selalu true untuk solusi sungguhan' }, stdin: ['1', '1', '10', '1', '-1', '2'], expectOutput: 'True' },
                { name: { en: 'still true for another system', id: 'masih true untuk sistem lain' }, stdin: ['2', '1', '5', '1', '3', '10'], expectOutput: 'True' },
                { name: { en: 'true for a third system', id: 'true untuk sistem ketiga' }, stdin: ['3', '2', '12', '1', '1', '5'], expectOutput: 'True' },
              ],
              hints: [
                { en: 'A @ x should always reproduce b for a genuine solution — the check is meant to always pass here.', id: 'A @ x seharusnya selalu menghasilkan b untuk solusi sungguhan — pemeriksaannya memang seharusnya selalu lolos di sini.' },
              ],
              solution:
                'import numpy as np\na1 = float(input())\nb1 = float(input())\nc1 = float(input())\na2 = float(input())\nb2 = float(input())\nc2 = float(input())\nA = np.array([[a1, b1], [a2, b2]])\nb = np.array([c1, c2])\nx = np.linalg.solve(A, b)\nprint(np.allclose(A @ x, b))',
            },
          ],
        },
      ],
      project: {
        id: 'pynum-m2-s2-p',
        title: { en: 'A Word Problem as a Linear System', id: 'Soal Cerita sebagai Sistem Linear' },
        brief: {
          en: 'Buying 2 pencils and 3 books costs 26000. Buying 4 pencils and 1 book costs 18000. Find the price of one pencil and one book.',
          id: 'Membeli 2 pensil dan 3 buku seharga 26000. Membeli 4 pensil dan 1 buku seharga 18000. Cari harga satu pensil dan satu buku.',
        },
        requirements: [
          { en: 'Read the six numbers describing two such purchases: `q1a, q1b, total1, q2a, q2b, total2` — quantities of item A and item B, and the total, for two purchases.', id: 'Baca enam angka yang menggambarkan dua pembelian seperti itu: `q1a, q1b, total1, q2a, q2b, total2` — jumlah barang A dan barang B, dan totalnya, untuk dua pembelian.' },
          { en: 'Set up and solve the system for the price of A and the price of B.', id: 'Susun dan selesaikan sistemnya untuk harga A dan harga B.' },
          { en: 'Print the price of A, then the price of B, each rounded to 1 decimal place.', id: 'Cetak harga A, lalu harga B, masing-masing dibulatkan ke 1 angka desimal.' },
        ],
        starter: 'import numpy as np\nq1a = float(input())\nq1b = float(input())\ntotal1 = float(input())\nq2a = float(input())\nq2b = float(input())\ntotal2 = float(input())\n',
        tests: [
          { name: { en: 'pencils and books', id: 'pensil dan buku' }, stdin: ['2', '3', '26000', '4', '1', '18000'], expectOutput: '2800.0\n6800.0' },
          { name: { en: 'x + y = 10, x - y = 2 shape', id: 'bentuk x + y = 10, x - y = 2' }, stdin: ['1', '1', '10', '1', '-1', '2'], expectOutput: '6.0\n4.0' },
          { name: { en: 'another pair', id: 'pasangan lain' }, stdin: ['3', '2', '12', '1', '1', '5'], expectOutput: '2.0\n3.0' },
        ],
        hints: [
          { en: 'Exactly the same setup as this submodule\'s own lessons — only the variable names describe a story now.', id: 'Persis susunan yang sama seperti pelajaran submodul ini sendiri — hanya nama variabelnya kini menceritakan sebuah kisah.' },
        ],
        solution:
          'import numpy as np\nq1a = float(input())\nq1b = float(input())\ntotal1 = float(input())\nq2a = float(input())\nq2b = float(input())\ntotal2 = float(input())\nA = np.array([[q1a, q1b], [q2a, q2b]])\nb = np.array([total1, total2])\nhasil = np.linalg.solve(A, b)\nprint(round(hasil[0], 1))\nprint(round(hasil[1], 1))',
        xp: 50,
      },
    },
  ],
}
