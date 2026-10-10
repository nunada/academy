import type { Submodule } from '../types'
import { L, dm, dot, outline, plane, pm, solid } from './figs'
import type { Pt } from './figs'

/** Module 1, submodule 1 — matrix operations and determinants. */

const pts = (...p: Pt[]) => p

/** The unit square (gray outline) and its image under a matrix with columns
 *  `a` and `b` (green), drawn on a plane of the given window. */
const imageOfSquare = (a: Pt, b: Pt, x: [number, number], y: [number, number]) =>
  plane(
    [
      outline(pts([0, 0], [1, 0], [1, 1], [0, 1]), 'muted'),
      solid(pts([0, 0], a, [a[0] + b[0], a[1] + b[1]], b), 'a'),
      dot(a, undefined, 'result'),
      dot(b, undefined, 'b'),
    ],
    { x, y },
  )

export const m1s1: Submodule = {
  id: 'tka-sml-m1-s1',
  title: L('Matrix Operations and Determinants', 'Operasi Matriks dan Determinan'),
  summary: L(
    'Add, scale and multiply matrices, and find the determinant of a 2 x 2 or 3 x 3 matrix.',
    'Menjumlah, mengalikan skalar, dan mengalikan matriks, serta mencari determinan matriks 2 x 2 atau 3 x 3.',
  ),
  lessons: [
    /* ------------------------------------------------------- L1 operations */
    {
      id: 'tka-sml-m1-s1-l1',
      title: L('Matrix Operations', 'Operasi Matriks'),
      goal: L(
        'You can add, subtract and scale matrices, multiply two matrices row by column, and know that the order of a product matters.',
        'Kamu bisa menjumlah, mengurangi, dan mengalikan skalar matriks, mengalikan dua matriks baris kali kolom, dan tahu bahwa urutan perkalian berpengaruh.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Table of Numbers That Moves Points', 'Ayo Amati: Tabel Bilangan yang Memindahkan Titik'),
          body: L(
            `A **matrix** is a rectangular table of numbers. A matrix with $m$ rows and $n$ columns has **size** $m\\times n$.\n\nThe matrix $A=${pm([2, 1], [0, 3])}$ has size $2\\times2$. Its **columns** tell where the two unit vectors $(1,0)$ and $(0,1)$ go:\n\n- the first column $(2,0)$ is the image of $(1,0)$;\n- the second column $(1,3)$ is the image of $(0,1)$.\n\nSo $A$ turns the gray unit square into the green parallelogram of the picture. This is why matrices describe transformations, and it is the key to determinants and inverses.`,
            `**Matriks** adalah tabel bilangan berbentuk persegi panjang. Matriks dengan $m$ baris dan $n$ kolom berukuran $m\\times n$.\n\nMatriks $A=${pm([2, 1], [0, 3])}$ berukuran $2\\times2$. **Kolom**-kolomnya menunjukkan ke mana dua vektor satuan $(1,0)$ dan $(0,1)$ pergi:\n\n- kolom pertama $(2,0)$ adalah bayangan $(1,0)$;\n- kolom kedua $(1,3)$ adalah bayangan $(0,1)$.\n\nJadi $A$ mengubah persegi satuan abu-abu menjadi jajargenjang hijau pada gambar. Inilah sebabnya matriks menggambarkan transformasi, dan ini kunci untuk determinan dan invers.`,
          ),
          figure: {
            ...imageOfSquare([2, 0], [1, 3], [-1, 5], [-1, 5]),
            caption: L(
              'The unit square (gray) and its image (green) under A. The red point is (2, 0) and the orange point is (1, 3).',
              'Persegi satuan (abu-abu) dan bayangannya (hijau) oleh A. Titik merah adalah (2, 0) dan titik oranye adalah (1, 3).',
            ),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Add, Subtract and Scale', 'Contoh Bertahap: Jumlah, Selisih, dan Kelipatan'),
          body: L(
            `Matrices of the **same size** are added or subtracted entry by entry. Multiplying by a number $k$ multiplies **every** entry.\n\nLet $A=${pm([1, 2], [3, 4])}$ and $B=${pm([0, -1], [5, 2])}$.\n\n1. Step 1: $A+B=${pm([1, 1], [8, 6])}$.\n2. Step 2: $2A=${pm([2, 4], [6, 8])}$.\n3. Step 3: $2A-B$: subtract entry by entry, $${pm([2, 5], [1, 6])}$$\n\nA sum of matrices of different sizes does not exist.`,
            `Matriks yang **berukuran sama** dijumlah atau dikurang entri demi entri. Mengalikan dengan bilangan $k$ mengalikan **setiap** entri.\n\nMisalkan $A=${pm([1, 2], [3, 4])}$ dan $B=${pm([0, -1], [5, 2])}$.\n\n1. Langkah 1: $A+B=${pm([1, 1], [8, 6])}$.\n2. Langkah 2: $2A=${pm([2, 4], [6, 8])}$.\n3. Langkah 3: $2A-B$: kurangkan entri demi entri, $${pm([2, 5], [1, 6])}$$\n\nJumlah matriks yang ukurannya berbeda tidak ada.`,
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Multiply Rows by Columns', 'Contoh Bertahap: Mengalikan Baris dengan Kolom'),
          body: L(
            `To find the entry in **row $i$, column $j$** of $AB$, multiply row $i$ of $A$ by column $j$ of $B$ and add. This needs the number of **columns of $A$** to equal the number of **rows of $B$**: an $m\\times n$ matrix times an $n\\times p$ matrix is $m\\times p$.\n\nWith the same $A$ and $B$:\n\n1. Step 1: Row 1 times column 1: $1\\cdot0+2\\cdot5=10$. Row 1 times column 2: $1\\cdot(-1)+2\\cdot2=3$.\n2. Step 2: Row 2 times column 1: $3\\cdot0+4\\cdot5=20$. Row 2 times column 2: $3\\cdot(-1)+4\\cdot2=5$.\n3. Step 3: $AB=${pm([10, 3], [20, 5])}$.\n\nNow $BA=${pm([-3, -4], [11, 18])}$, which is **different**. In general $AB\\ne BA$.\n\n**Sizes.** If $A$ is $2\\times3$, $B$ is $3\\times4$ and $C$ is $4\\times2$, then $AB$ is $2\\times4$ and $(AB)C$ is $2\\times2$. When a test gives only the sizes, check them from left to right.`,
            `Untuk mencari entri pada **baris $i$, kolom $j$** dari $AB$, kalikan baris $i$ dari $A$ dengan kolom $j$ dari $B$ lalu jumlahkan. Ini memerlukan banyak **kolom $A$** sama dengan banyak **baris $B$**: matriks $m\\times n$ kali matriks $n\\times p$ berukuran $m\\times p$.\n\nDengan $A$ dan $B$ yang sama:\n\n1. Langkah 1: Baris 1 kali kolom 1: $1\\cdot0+2\\cdot5=10$. Baris 1 kali kolom 2: $1\\cdot(-1)+2\\cdot2=3$.\n2. Langkah 2: Baris 2 kali kolom 1: $3\\cdot0+4\\cdot5=20$. Baris 2 kali kolom 2: $3\\cdot(-1)+4\\cdot2=5$.\n3. Langkah 3: $AB=${pm([10, 3], [20, 5])}$.\n\nSedangkan $BA=${pm([-3, -4], [11, 18])}$, yang **berbeda**. Pada umumnya $AB\\ne BA$.\n\n**Ukuran.** Jika $A$ berukuran $2\\times3$, $B$ berukuran $3\\times4$, dan $C$ berukuran $4\\times2$, maka $AB$ berukuran $2\\times4$ dan $(AB)C$ berukuran $2\\times2$. Bila soal hanya memberi ukuran, periksa dari kiri ke kanan.`,
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The green parallelogram is the image of the unit square under a matrix M. Which matrix is M?',
            'Jajargenjang hijau adalah bayangan persegi satuan oleh suatu matriks M. Matriks manakah M?',
          ),
          figure: {
            ...imageOfSquare([3, 0], [1, 2], [-1, 6], [-1, 4]),
            caption: L('The image of the unit square. The red point is (3, 0) and the orange point is (1, 2).', 'Bayangan persegi satuan. Titik merah adalah (3, 0) dan titik oranye adalah (1, 2).'),
          },
          options: [
            L(`$${pm([3, 1], [0, 2])}$`, `$${pm([3, 1], [0, 2])}$`),
            L(`$${pm([3, 0], [1, 2])}$`, `$${pm([3, 0], [1, 2])}$`),
            L(`$${pm([1, 3], [2, 0])}$`, `$${pm([1, 3], [2, 0])}$`),
            L(`$${pm([3, 1], [2, 0])}$`, `$${pm([3, 1], [2, 0])}$`),
            L(`$${pm([0, 3], [2, 1])}$`, `$${pm([0, 3], [2, 1])}$`),
          ],
          answer: 0,
          explain: L(
            'The columns of M are the images of $(1,0)$ and $(0,1)$: $(3,0)$ and $(1,2)$. So the first column is $(3,0)$ and the second is $(1,2)$. Writing these numbers as rows instead gives the transpose, which is a different matrix.',
            'Kolom-kolom M adalah bayangan $(1,0)$ dan $(0,1)$: $(3,0)$ dan $(1,2)$. Jadi kolom pertama $(3,0)$ dan kolom kedua $(1,2)$. Menulis bilangan itu sebagai baris justru memberi transpos, yaitu matriks yang berbeda.',
          ),
          hint: L(
            'Read where the points $(1,0)$ and $(0,1)$ of the square have gone. Those are the columns.',
            'Baca ke mana titik $(1,0)$ dan $(0,1)$ pada persegi itu pergi. Itulah kolom-kolomnya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            `Try it together: find the four entries of $AB$ for $A=${pm([1, 2], [3, 4])}$ and $B=${pm([0, -1], [5, 2])}$.`,
            `Coba bersama: cari keempat entri $AB$ untuk $A=${pm([1, 2], [3, 4])}$ dan $B=${pm([0, -1], [5, 2])}$.`,
          ),
          template: '(AB)_{11}=___ \\quad (AB)_{12}=___ \\quad (AB)_{21}=___ \\quad (AB)_{22}=___',
          blanks: ['10', '3', '20', '5'],
          explain: L(
            'Row by column: $1\\cdot0+2\\cdot5=10$, $1\\cdot(-1)+2\\cdot2=3$, $3\\cdot0+4\\cdot5=20$, $3\\cdot(-1)+4\\cdot2=5$.',
            'Baris kali kolom: $1\\cdot0+2\\cdot5=10$, $1\\cdot(-1)+2\\cdot2=3$, $3\\cdot0+4\\cdot5=20$, $3\\cdot(-1)+4\\cdot2=5$.',
          ),
          hint: L(
            'Each entry is a row of the first matrix times a column of the second, added up.',
            'Setiap entri adalah baris matriks pertama kali kolom matriks kedua, lalu dijumlahkan.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('If A is $2\\times3$ and B is $3\\times4$, then AB exists and is $2\\times4$.', 'Jika A berukuran $2\\times3$ dan B berukuran $3\\times4$, maka AB ada dan berukuran $2\\times4$.'),
            L('$AB=BA$ for any two square matrices of the same size.', '$AB=BA$ untuk dua matriks persegi mana pun yang berukuran sama.'),
            L('Two matrices can be added only when they have the same size.', 'Dua matriks dapat dijumlah hanya bila berukuran sama.'),
            L('A $2\\times3$ matrix can be multiplied by another $2\\times3$ matrix.', 'Matriks $2\\times3$ dapat dikalikan dengan matriks $2\\times3$ lainnya.'),
          ],
          answer: [0, 2],
          explain: L(
            'The inner sizes must match: $3=3$ works for the first. The product of square matrices usually depends on the order. For $2\\times3$ times $2\\times3$ the inner sizes are $3$ and $2$, so it does not exist.',
            'Ukuran dalam harus sama: $3=3$ berlaku untuk yang pertama. Hasil kali matriks persegi biasanya bergantung pada urutan. Untuk $2\\times3$ kali $2\\times3$ ukuran dalamnya $3$ dan $2$, jadi tidak ada.',
          ),
          hint: L(
            'Write the two sizes next to each other. The two numbers in the middle must be equal.',
            'Tulis kedua ukuran berdampingan. Dua bilangan di tengah harus sama.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            `Let $A=${pm([1, 2], [3, 4])}$ and $B=${pm([0, -1], [5, 2])}$. Decide whether each statement is True or False.`,
            `Misalkan $A=${pm([1, 2], [3, 4])}$ dan $B=${pm([0, -1], [5, 2])}$. Tentukan tiap pernyataan Benar atau Salah.`,
          ),
          statements: [
            L(`$A+B=${pm([1, 1], [8, 6])}$`, `$A+B=${pm([1, 1], [8, 6])}$`),
            L(`$2A-B=${pm([2, 5], [1, 6])}$`, `$2A-B=${pm([2, 5], [1, 6])}$`),
            L('$AB=BA$', '$AB=BA$'),
            L('The entry in row 2, column 1 of $AB$ is $20$.', 'Entri pada baris 2, kolom 1 dari $AB$ adalah $20$.'),
          ],
          answer: [true, true, false, true],
          explain: L(
            '$A+B$ and $2A-B$ are computed entry by entry. $AB=\\begin{pmatrix}10&3\\\\20&5\\end{pmatrix}$ while $BA=\\begin{pmatrix}-3&-4\\\\11&18\\end{pmatrix}$, so they are not equal, and the entry in row 2, column 1 of $AB$ is $3\\cdot0+4\\cdot5=20$.',
            '$A+B$ dan $2A-B$ dihitung entri demi entri. $AB=\\begin{pmatrix}10&3\\\\20&5\\end{pmatrix}$ sedangkan $BA=\\begin{pmatrix}-3&-4\\\\11&18\\end{pmatrix}$, jadi tidak sama, dan entri baris 2, kolom 1 dari $AB$ adalah $3\\cdot0+4\\cdot5=20$.',
          ),
          hint: L(
            'Compute each one. For a product use row by column.',
            'Hitung masing-masing. Untuk hasil kali pakai baris kali kolom.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            `Let $M=${pm([2, 1], [0, 3])}$ and $N=${pm([1, 4], [2, 0])}$. Find the entry in row 1, column 2 of $MN$.`,
            `Misalkan $M=${pm([2, 1], [0, 3])}$ dan $N=${pm([1, 4], [2, 0])}$. Cari entri pada baris 1, kolom 2 dari $MN$.`,
          ),
          blanks: [{ answer: 8 }],
          hints: [
            L('Use row 1 of $M$ and column 2 of $N$.', 'Pakai baris 1 dari $M$ dan kolom 2 dari $N$.'),
            L('Row 1 of $M$ is $(2,1)$ and column 2 of $N$ is $(4,0)$.', 'Baris 1 dari $M$ adalah $(2,1)$ dan kolom 2 dari $N$ adalah $(4,0)$.'),
            L('Multiply in pairs and add: $2\\cdot4+1\\cdot0$.', 'Kalikan berpasangan lalu jumlahkan: $2\\cdot4+1\\cdot0$.'),
          ],
          explain: L('$2\\cdot4+1\\cdot0=8$.', '$2\\cdot4+1\\cdot0=8$.'),
          solution: ['(2,1)\\cdot(4,0)=2\\cdot4+1\\cdot0', '=8'],
        },
      ],
    },
    /* ----------------------------------------------------- L2 determinants */
    {
      id: 'tka-sml-m1-s1-l2',
      title: L('Determinants', 'Determinan'),
      goal: L(
        'You can find the determinant of a 2 x 2 and a 3 x 3 matrix, read it as an area factor, and use its basic properties.',
        'Kamu bisa mencari determinan matriks 2 x 2 dan 3 x 3, membacanya sebagai faktor luas, dan memakai sifat dasarnya.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Area Factor', 'Ayo Amati: Faktor Luas'),
          body: L(
            `For a $2\\times2$ matrix the **determinant** is\n\n$$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc$$\n\nTake $M=${pm([3, 1], [0, 2])}$. Then $\\det M=3\\cdot2-1\\cdot0=6$. The picture shows the image of the unit square (area $1$): a parallelogram of area $6$.\n\nSo $|\\det M|$ is the factor by which $M$ **scales areas**. A negative determinant means the picture is flipped over. A determinant of $0$ squashes the plane onto a line, and then the matrix has **no inverse**.`,
            `Untuk matriks $2\\times2$, **determinan** adalah\n\n$$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc$$\n\nAmbil $M=${pm([3, 1], [0, 2])}$. Maka $\\det M=3\\cdot2-1\\cdot0=6$. Gambar menunjukkan bayangan persegi satuan (luas $1$): jajargenjang berluas $6$.\n\nJadi $|\\det M|$ adalah faktor $M$ **mengalikan luas**. Determinan negatif berarti gambarnya terbalik. Determinan $0$ memipihkan bidang menjadi garis, dan matriks itu **tidak punya invers**.`,
          ),
          figure: {
            ...imageOfSquare([3, 0], [1, 2], [-1, 6], [-1, 4]),
            caption: L('The image of the unit square has area 6, the determinant.', 'Bayangan persegi satuan berluas 6, yaitu determinannya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Determinant of a 3 x 3 Matrix', 'Contoh Bertahap: Determinan Matriks 3 x 3'),
          body: L(
            `Expand along the **first row**, with signs $+\\;-\\;+$. Each entry multiplies the $2\\times2$ determinant left when its row and column are crossed out.\n\n$M=${pm([2, 0, 1], [1, 3, 2], [0, 1, 4])}$\n\n1. Step 1: Entry $2$: $2\\cdot${dm([3, 2], [1, 4])}$=2\\cdot(12-2)=20$.\n2. Step 2: Entry $0$: $-0\\cdot${dm([1, 2], [0, 4])}$=0$.\n3. Step 3: Entry $1$: $+1\\cdot${dm([1, 3], [0, 1])}$=1\\cdot(1-0)=1$.\n4. Step 4: Add: $\\det M=20+0+1=21$.\n\nChoose a row or column with **zeros** to save work.`,
            `Ekspansikan sepanjang **baris pertama**, dengan tanda $+\\;-\\;+$. Tiap entri mengalikan determinan $2\\times2$ yang tersisa bila baris dan kolomnya dicoret.\n\n$M=${pm([2, 0, 1], [1, 3, 2], [0, 1, 4])}$\n\n1. Langkah 1: Entri $2$: $2\\cdot${dm([3, 2], [1, 4])}$=2\\cdot(12-2)=20$.\n2. Langkah 2: Entri $0$: $-0\\cdot${dm([1, 2], [0, 4])}$=0$.\n3. Langkah 3: Entri $1$: $+1\\cdot${dm([1, 3], [0, 1])}$=1\\cdot(1-0)=1$.\n4. Langkah 4: Jumlahkan: $\\det M=20+0+1=21$.\n\nPilih baris atau kolom yang berisi **nol** agar kerja lebih singkat.`,
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Rules for Determinants', 'Awas, Jebakan!: Aturan Determinan'),
          body: L(
            `For $n\\times n$ matrices:\n\n- $\\det(AB)=\\det A\\cdot\\det B$\n- $\\det(A^{T})=\\det A$\n- $\\det(kA)=k^{n}\\det A$ (every one of the $n$ rows gets multiplied by $k$)\n- Swapping two rows changes the sign; a row of zeros gives $0$.\n- In general $\\det(A+B)\\ne\\det A+\\det B$.\n\nExample: $A$ is $2\\times2$ with $\\det A=5$. Then $\\det(3A)=3^2\\cdot5=45$, not $15$.`,
            `Untuk matriks $n\\times n$:\n\n- $\\det(AB)=\\det A\\cdot\\det B$\n- $\\det(A^{T})=\\det A$\n- $\\det(kA)=k^{n}\\det A$ (tiap dari $n$ baris dikalikan $k$)\n- Menukar dua baris mengubah tanda; baris nol memberi $0$.\n- Pada umumnya $\\det(A+B)\\ne\\det A+\\det B$.\n\nContoh: $A$ berukuran $2\\times2$ dengan $\\det A=5$. Maka $\\det(3A)=3^2\\cdot5=45$, bukan $15$.`,
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The green parallelogram is the image of the unit square under a matrix M. What is the determinant of M?',
            'Jajargenjang hijau adalah bayangan persegi satuan oleh suatu matriks M. Berapa determinan M?',
          ),
          figure: {
            ...imageOfSquare([2, 1], [1, 3], [-1, 5], [-1, 5]),
            caption: L('The image of the unit square. The red point is (2, 1) and the orange point is (1, 3).', 'Bayangan persegi satuan. Titik merah adalah (2, 1) dan titik oranye adalah (1, 3).'),
          },
          options: ['5', '7', '6', '1', '-5'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'The columns of M are $(2,1)$ and $(1,3)$, so $\\det M=2\\cdot3-1\\cdot1=5$. The value $7$ adds the products instead of subtracting, and $6$ forgets the second product.',
            'Kolom-kolom M adalah $(2,1)$ dan $(1,3)$, jadi $\\det M=2\\cdot3-1\\cdot1=5$. Nilai $7$ menjumlahkan hasil kali, bukan mengurangkan, dan $6$ lupa hasil kali kedua.',
          ),
          hint: L(
            'Read the two columns from the picture, then use $ad-bc$.',
            'Baca kedua kolom dari gambar, lalu pakai $ad-bc$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            `Try it together: find $\\det${pm([4, 3], [2, 5])}$.`,
            `Coba bersama: cari $\\det${pm([4, 3], [2, 5])}$.`,
          ),
          template: 'ad-bc=4\\cdot5-3\\cdot2=___-___=___',
          blanks: ['20', '6', '14'],
          explain: L('$20-6=14$.', '$20-6=14$.'),
          hint: L(
            'Multiply along the main diagonal, then subtract the product of the other diagonal.',
            'Kalikan sepanjang diagonal utama, lalu kurangkan hasil kali diagonal lainnya.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L(`$\\det${pm([1, 2], [2, 4])}=0$`, `$\\det${pm([1, 2], [2, 4])}=0$`),
            L(`$\\det${pm([0, 1], [1, 0])}=-1$`, `$\\det${pm([0, 1], [1, 0])}=-1$`),
            L(`$\\det${pm([3, 0], [0, 2])}=5$`, `$\\det${pm([3, 0], [0, 2])}=5$`),
            L('If $\\det A=2$ and $\\det B=3$, then $\\det(A+B)=5$.', 'Jika $\\det A=2$ dan $\\det B=3$, maka $\\det(A+B)=5$.'),
          ],
          answer: [0, 1],
          explain: L(
            '$1\\cdot4-2\\cdot2=0$ and $0\\cdot0-1\\cdot1=-1$. For the diagonal matrix $3\\cdot2=6$, not $5$. The determinant of a sum is not the sum of the determinants.',
            '$1\\cdot4-2\\cdot2=0$ dan $0\\cdot0-1\\cdot1=-1$. Untuk matriks diagonal $3\\cdot2=6$, bukan $5$. Determinan jumlah bukan jumlah determinan.',
          ),
          hint: L('Compute $ad-bc$ for each matrix.', 'Hitung $ad-bc$ untuk tiap matriks.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'A is a $2\\times2$ matrix with $\\det A=4$. Decide whether each statement is True or False.',
            'A adalah matriks $2\\times2$ dengan $\\det A=4$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$\\det(2A)=16$', '$\\det(2A)=16$'),
            L('$\\det(A^{T})=4$', '$\\det(A^{T})=4$'),
            L('$\\det(A^{2})=8$', '$\\det(A^{2})=8$'),
            L('A has an inverse.', 'A mempunyai invers.'),
          ],
          answer: [true, true, false, true],
          explain: L(
            '$\\det(2A)=2^2\\cdot4=16$, the transpose has the same determinant, and $\\det(A^2)=4\\cdot4=16$, not $8$. A determinant that is not $0$ means an inverse exists.',
            '$\\det(2A)=2^2\\cdot4=16$, transpos berdeterminan sama, dan $\\det(A^2)=4\\cdot4=16$, bukan $8$. Determinan yang bukan $0$ berarti invers ada.',
          ),
          hint: L(
            'Use $\\det(kA)=k^n\\det A$ and $\\det(AB)=\\det A\\det B$.',
            'Pakai $\\det(kA)=k^n\\det A$ dan $\\det(AB)=\\det A\\det B$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            `Find $\\det${pm([2, 0, 1], [1, 3, 2], [0, 1, 4])}$.`,
            `Cari $\\det${pm([2, 0, 1], [1, 3, 2], [0, 1, 4])}$.`,
          ),
          blanks: [{ answer: 21 }],
          hints: [
            L('Expand along the first row with signs $+,-,+$.', 'Ekspansikan sepanjang baris pertama dengan tanda $+,-,+$.'),
            L('The middle term has the entry $0$, so it vanishes.', 'Suku tengah berentri $0$, jadi hilang.'),
            L('$2(12-2)+1(1-0)$.', '$2(12-2)+1(1-0)$.'),
          ],
          explain: L('$2(3\\cdot4-2\\cdot1)-0+1(1\\cdot1-3\\cdot0)=20+1=21$.', '$2(3\\cdot4-2\\cdot1)-0+1(1\\cdot1-3\\cdot0)=20+1=21$.'),
          solution: ['2(12-2)-0+1(1-0)', '=20+1=21'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m1-s1-p',
    runtime: 'math',
    title: L('Matrices at Work', 'Matriks dalam Pemakaian'),
    brief: L(
      'Compute sums, products and determinants of small matrices.',
      'Hitung jumlah, hasil kali, dan determinan matriks kecil.',
    ),
    requirements: [
      L('Multiply matrices row by column.', 'Mengalikan matriks baris kali kolom.'),
      L('Find determinants of $2\\times2$ and $3\\times3$ matrices.', 'Mencari determinan matriks $2\\times2$ dan $3\\times3$.'),
    ],
    hints: [
      L('Check the sizes before you multiply.', 'Periksa ukuran sebelum mengalikan.'),
      L('For a $2\\times2$ determinant use $ad-bc$.', 'Untuk determinan $2\\times2$ pakai $ad-bc$.'),
      L('For $3\\times3$, expand along a row with zeros.', 'Untuk $3\\times3$, ekspansikan sepanjang baris yang berisi nol.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          `Let $A=${pm([2, 1], [3, 0])}$ and $B=${pm([1, -1], [2, 4])}$. Find the sum of all entries of $2A+3B$.`,
          `Misalkan $A=${pm([2, 1], [3, 0])}$ dan $B=${pm([1, -1], [2, 4])}$. Cari jumlah semua entri dari $2A+3B$.`,
        ),
        blanks: [{ answer: 30 }],
        solution: [`2A+3B=${pm([7, -1], [12, 12])}`, '7-1+12+12=30'],
      },
      {
        prompt: L(
          `With the same $A$ and $B$, find the entry in row 2, column 2 of $AB$.`,
          `Dengan $A$ dan $B$ yang sama, cari entri pada baris 2, kolom 2 dari $AB$.`,
        ),
        blanks: [{ answer: -3 }],
        solution: ['(3,0)\\cdot(-1,4)=3\\cdot(-1)+0\\cdot4', '=-3'],
      },
      {
        prompt: L(`Find $\\det${pm([5, 2], [4, 3])}$.`, `Cari $\\det${pm([5, 2], [4, 3])}$.`),
        blanks: [{ answer: 7 }],
        solution: ['5\\cdot3-2\\cdot4=15-8', '=7'],
      },
      {
        prompt: L(`Find $\\det${pm([1, 2, 3], [0, 1, 4], [5, 6, 0])}$.`, `Cari $\\det${pm([1, 2, 3], [0, 1, 4], [5, 6, 0])}$.`),
        blanks: [{ answer: 1 }],
        solution: ['1(0-24)-2(0-20)+3(0-5)', '=-24+40-15=1'],
      },
      {
        prompt: L(
          `The matrix $${pm(['k', 4], [1, 'k'])}$ has no inverse and $k>0$. Find $k$.`,
          `Matriks $${pm(['k', 4], [1, 'k'])}$ tidak punya invers dan $k>0$. Tentukan $k$.`,
        ),
        blanks: [{ label: 'k =', answer: 2 }],
        solution: ['\\det=k^2-4=0', 'k=2'],
      },
    ],
  },
}
