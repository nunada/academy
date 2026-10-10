import type { Submodule } from '../types'
import { L, dot, outline, plane, pm, solid } from './figs'
import type { Pt } from './figs'

/** Module 1, submodule 2 — the inverse of a matrix, matrix equations and
 *  systems of equations. */

const pts = (...p: Pt[]) => p

export const m1s2: Submodule = {
  id: 'tka-sml-m1-s2',
  title: L('Inverse Matrices', 'Invers Matriks'),
  summary: L(
    'Find the inverse of a 2 x 2 matrix, solve matrix equations, and solve systems of equations with an inverse.',
    'Mencari invers matriks 2 x 2, menyelesaikan persamaan matriks, dan menyelesaikan sistem persamaan dengan invers.',
  ),
  lessons: [
    /* ------------------------------------------------------ L1 the inverse */
    {
      id: 'tka-sml-m1-s2-l1',
      title: L('The Inverse of a 2 x 2 Matrix', 'Invers Matriks 2 x 2'),
      goal: L(
        'You can find the inverse of a 2 x 2 matrix, test whether it exists, and solve matrix equations such as AX = B.',
        'Kamu bisa mencari invers matriks 2 x 2, menguji apakah ada, dan menyelesaikan persamaan matriks seperti AX = B.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Undoing a Matrix', 'Ayo Amati: Membatalkan Sebuah Matriks'),
          body: L(
            `The **inverse** $A^{-1}$ of a matrix $A$ undoes it: $AA^{-1}=A^{-1}A=I$, where $I=${pm([1, 0], [0, 1])}$ is the **identity** matrix.\n\nFor a $2\\times2$ matrix:\n\n$$A=${pm(['a', 'b'], ['c', 'd'])}\\quad\\Rightarrow\\quad A^{-1}=\\frac{1}{ad-bc}${pm(['d', '-b'], ['-c', 'a'])}$$\n\nSwap $a$ and $d$, change the signs of $b$ and $c$, and divide by the determinant. The inverse exists only when $ad-bc\\ne0$.\n\nIn the picture $M=${pm([3, 1], [5, 2])}$ turns the gray square into the green parallelogram. $M^{-1}$ sends it back.`,
            `**Invers** $A^{-1}$ dari matriks $A$ membatalkannya: $AA^{-1}=A^{-1}A=I$, dengan $I=${pm([1, 0], [0, 1])}$ adalah matriks **identitas**.\n\nUntuk matriks $2\\times2$:\n\n$$A=${pm(['a', 'b'], ['c', 'd'])}\\quad\\Rightarrow\\quad A^{-1}=\\frac{1}{ad-bc}${pm(['d', '-b'], ['-c', 'a'])}$$\n\nTukar $a$ dan $d$, ubah tanda $b$ dan $c$, lalu bagi dengan determinan. Invers ada hanya bila $ad-bc\\ne0$.\n\nPada gambar $M=${pm([3, 1], [5, 2])}$ mengubah persegi abu-abu menjadi jajargenjang hijau. $M^{-1}$ mengembalikannya.`,
          ),
          figure: {
            ...plane(
              [
                outline(pts([0, 0], [1, 0], [1, 1], [0, 1]), 'muted'),
                solid(pts([0, 0], [3, 5], [4, 7], [1, 2]), 'a'),
                dot([3, 5], undefined, 'result'),
                dot([1, 2], undefined, 'b'),
              ],
              { x: [-1, 6], y: [-1, 9] },
            ),
            caption: L('M sends the unit square to the green parallelogram, which has area 1.', 'M mengirim persegi satuan ke jajargenjang hijau, yang berluas 1.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Solving a Matrix Equation', 'Contoh Bertahap: Menyelesaikan Persamaan Matriks'),
          body: L(
            `Solve $AX=B$ for $X$ by multiplying **on the left** by $A^{-1}$: $X=A^{-1}B$. For $XA=B$ multiply **on the right**: $X=BA^{-1}$. The side matters because $AB\\ne BA$.\n\nLet $A=${pm([2, 5], [1, 3])}$ and $B=${pm([1, 0], [0, 2])}$.\n\n1. Step 1: $\\det A=2\\cdot3-5\\cdot1=1$.\n2. Step 2: $A^{-1}=${pm([3, -5], [-1, 2])}$.\n3. Step 3: $X=A^{-1}B=${pm([3, -5], [-1, 2])}${pm([1, 0], [0, 2])}=${pm([3, -10], [-1, 4])}$.\n\nCheck: $AX$ should equal $B$.`,
            `Selesaikan $AX=B$ untuk $X$ dengan mengalikan **dari kiri** dengan $A^{-1}$: $X=A^{-1}B$. Untuk $XA=B$ kalikan **dari kanan**: $X=BA^{-1}$. Sisinya penting karena $AB\\ne BA$.\n\nMisalkan $A=${pm([2, 5], [1, 3])}$ dan $B=${pm([1, 0], [0, 2])}$.\n\n1. Langkah 1: $\\det A=2\\cdot3-5\\cdot1=1$.\n2. Langkah 2: $A^{-1}=${pm([3, -5], [-1, 2])}$.\n3. Langkah 3: $X=A^{-1}B=${pm([3, -5], [-1, 2])}${pm([1, 0], [0, 2])}=${pm([3, -10], [-1, 4])}$.\n\nPeriksa: $AX$ harus sama dengan $B$.`,
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: When There Is No Inverse', 'Awas, Jebakan!: Bila Tidak Ada Invers'),
          body: L(
            `If $\\det A=0$ the matrix is **singular**: it squashes the plane onto a line, and nothing can undo that. For example $${pm([2, 4], [1, 2])}$ has $\\det=4-4=0$.\n\nTwo more rules:\n\n- $(AB)^{-1}=B^{-1}A^{-1}$: the order **reverses**, like taking off shoes and socks.\n- $(A^{-1})^{-1}=A$.\n\nAlso keep the fraction: $\\frac{1}{\\det A}$ multiplies **every** entry of the swapped matrix.`,
            `Jika $\\det A=0$ matriks itu **singular**: ia memipihkan bidang menjadi garis, dan tidak ada yang dapat membatalkannya. Misalnya $${pm([2, 4], [1, 2])}$ berdeterminan $4-4=0$.\n\nDua aturan lagi:\n\n- $(AB)^{-1}=B^{-1}A^{-1}$: urutannya **terbalik**, seperti melepas sepatu dan kaus kaki.\n- $(A^{-1})^{-1}=A$.\n\nJaga juga pecahannya: $\\frac{1}{\\det A}$ mengalikan **setiap** entri matriks yang sudah ditukar.`,
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The picture shows what M does to the unit square. Which matrix is the inverse of M?',
            'Gambar menunjukkan apa yang dilakukan M pada persegi satuan. Matriks manakah invers dari M?',
          ),
          figure: {
            ...plane(
              [
                outline(pts([0, 0], [1, 0], [1, 1], [0, 1]), 'muted'),
                solid(pts([0, 0], [3, 5], [4, 7], [1, 2]), 'a'),
                dot([3, 5], undefined, 'result'),
                dot([1, 2], undefined, 'b'),
              ],
              { x: [-1, 6], y: [-1, 9] },
            ),
            caption: L('The red point is (3, 5) and the orange point is (1, 2).', 'Titik merah adalah (3, 5) dan titik oranye adalah (1, 2).'),
          },
          options: [
            L(`$${pm([2, -1], [-5, 3])}$`, `$${pm([2, -1], [-5, 3])}$`),
            L(`$${pm([2, 1], [5, 3])}$`, `$${pm([2, 1], [5, 3])}$`),
            L(`$${pm([-2, 1], [5, -3])}$`, `$${pm([-2, 1], [5, -3])}$`),
            L(`$${pm([3, -1], [-5, 2])}$`, `$${pm([3, -1], [-5, 2])}$`),
            L(`$${pm([2, -5], [-1, 3])}$`, `$${pm([2, -5], [-1, 3])}$`),
          ],
          answer: 0,
          explain: L(
            `The columns of M are $(3,5)$ and $(1,2)$, so $M=${pm([3, 1], [5, 2])}$ and $\\det M=6-5=1$. Swap the diagonal and negate the other two: $M^{-1}=${pm([2, -1], [-5, 3])}$. Check: the first row of $M$ times the first column of $M^{-1}$ is $3\\cdot2+1\\cdot(-5)=1$.`,
            `Kolom-kolom M adalah $(3,5)$ dan $(1,2)$, jadi $M=${pm([3, 1], [5, 2])}$ dan $\\det M=6-5=1$. Tukar diagonal dan negatifkan dua entri lainnya: $M^{-1}=${pm([2, -1], [-5, 3])}$. Periksa: baris pertama $M$ kali kolom pertama $M^{-1}$ adalah $3\\cdot2+1\\cdot(-5)=1$.`,
          ),
          hint: L(
            'Write M from its columns first. Then swap the main diagonal and change the signs of the other two entries.',
            'Tulis M dari kolom-kolomnya dulu. Lalu tukar diagonal utama dan ubah tanda dua entri lainnya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            `Try it together: find the inverse of $M=${pm([3, 1], [5, 2])}$.`,
            `Coba bersama: cari invers dari $M=${pm([3, 1], [5, 2])}$.`,
          ),
          template: '\\det M=3\\cdot2-1\\cdot5=___ \\qquad (M^{-1})_{11}=___ \\quad (M^{-1})_{22}=___',
          blanks: ['1', '2', '3'],
          explain: L(
            '$\\det M=1$. Swap the diagonal entries: the top-left entry is $2$ and the bottom-right entry is $3$.',
            '$\\det M=1$. Tukar entri diagonal: entri kiri atas adalah $2$ dan entri kanan bawah adalah $3$.',
          ),
          hint: L(
            'The determinant is $ad-bc$. In the inverse, $a$ and $d$ swap places.',
            'Determinan adalah $ad-bc$. Pada invers, $a$ dan $d$ bertukar tempat.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            `Let $M=${pm([3, 1], [5, 2])}$. Choose ALL pairs $(p,q)$ for which $pM^{-1}=q${pm([4, -2], [-10, 6])}$.`,
            `Misalkan $M=${pm([3, 1], [5, 2])}$. Pilih SEMUA pasangan $(p,q)$ yang memenuhi $pM^{-1}=q${pm([4, -2], [-10, 6])}$.`,
          ),
          options: [
            L('$p=2$ and $q=1$', '$p=2$ dan $q=1$'),
            L('$p=3$ and $q=1$', '$p=3$ dan $q=1$'),
            L('$p=6$ and $q=3$', '$p=6$ dan $q=3$'),
            L('$p=5$ and $q=2$', '$p=5$ dan $q=2$'),
            L('$p=1$ and $q=2$', '$p=1$ dan $q=2$'),
          ],
          answer: [0, 2],
          explain: L(
            `$M^{-1}=${pm([2, -1], [-5, 3])}$ and $${pm([4, -2], [-10, 6])}=2M^{-1}$. So $pM^{-1}=2qM^{-1}$, which means $p=2q$. The pairs $(2,1)$ and $(6,3)$ fit.`,
            `$M^{-1}=${pm([2, -1], [-5, 3])}$ dan $${pm([4, -2], [-10, 6])}=2M^{-1}$. Jadi $pM^{-1}=2qM^{-1}$, yang berarti $p=2q$. Pasangan $(2,1)$ dan $(6,3)$ cocok.`,
          ),
          hint: L(
            'Find $M^{-1}$ first, then compare it with the matrix on the right.',
            'Cari $M^{-1}$ dulu, lalu bandingkan dengan matriks di ruas kanan.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            `Let $A=${pm([2, 5], [1, 3])}$ and $B=${pm([1, 0], [0, 2])}$. For the equation $AX=B$, decide whether each statement is True or False.`,
            `Misalkan $A=${pm([2, 5], [1, 3])}$ dan $B=${pm([1, 0], [0, 2])}$. Untuk persamaan $AX=B$, tentukan tiap pernyataan Benar atau Salah.`,
          ),
          statements: [
            L('$X=A^{-1}B$', '$X=A^{-1}B$'),
            L('$X=BA^{-1}$', '$X=BA^{-1}$'),
            L(`$X=${pm([3, -10], [-1, 4])}$`, `$X=${pm([3, -10], [-1, 4])}$`),
            L('$\\det A=1$', '$\\det A=1$'),
          ],
          answer: [true, false, true, true],
          explain: L(
            'Multiply $AX=B$ on the left by $A^{-1}$, so $X=A^{-1}B$; $BA^{-1}$ has the wrong order. With $A^{-1}=\\begin{pmatrix}3&-5\\\\-1&2\\end{pmatrix}$ the product is $\\begin{pmatrix}3&-10\\\\-1&4\\end{pmatrix}$, and $\\det A=6-5=1$.',
            'Kalikan $AX=B$ dari kiri dengan $A^{-1}$, jadi $X=A^{-1}B$; $BA^{-1}$ urutannya salah. Dengan $A^{-1}=\\begin{pmatrix}3&-5\\\\-1&2\\end{pmatrix}$ hasil kalinya $\\begin{pmatrix}3&-10\\\\-1&4\\end{pmatrix}$, dan $\\det A=6-5=1$.',
          ),
          hint: L(
            'Which side must $A^{-1}$ be multiplied on? Then compute the product.',
            'Dari sisi mana $A^{-1}$ harus dikalikan? Lalu hitung hasil kalinya.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            `Find the entry in row 1, column 2 of $A^{-1}$ when $A=${pm([4, 3], [3, 2])}$.`,
            `Cari entri pada baris 1, kolom 2 dari $A^{-1}$ bila $A=${pm([4, 3], [3, 2])}$.`,
          ),
          blanks: [{ answer: 3 }],
          hints: [
            L('First find $\\det A=ad-bc$.', 'Cari dulu $\\det A=ad-bc$.'),
            L('$\\det A=8-9=-1$.', '$\\det A=8-9=-1$.'),
            L('The entry is $\\frac{-b}{\\det A}$ with $b=3$.', 'Entrinya $\\frac{-b}{\\det A}$ dengan $b=3$.'),
          ],
          explain: L('$A^{-1}=\\frac{1}{-1}\\begin{pmatrix}2&-3\\\\-3&4\\end{pmatrix}$, so the entry is $\\frac{-3}{-1}=3$.', '$A^{-1}=\\frac{1}{-1}\\begin{pmatrix}2&-3\\\\-3&4\\end{pmatrix}$, jadi entrinya $\\frac{-3}{-1}=3$.'),
          solution: ['\\det A=4\\cdot2-3\\cdot3=-1', 'A^{-1}=\\frac{1}{-1}\\begin{pmatrix}2&-3\\\\-3&4\\end{pmatrix}', 'a_{12}=\\frac{-3}{-1}=3'],
        },
      ],
    },
    /* ------------------------------------- L2 systems, 3 x 3 and properties */
    {
      id: 'tka-sml-m1-s2-l2',
      title: L('Systems of Equations and 3 x 3 Matrices', 'Sistem Persamaan dan Matriks 3 x 3'),
      goal: L(
        'You can solve a system with an inverse matrix, work with a 3 x 3 inverse that is given, and use the rules for inverses and determinants.',
        'Kamu bisa menyelesaikan sistem dengan matriks invers, memakai invers 3 x 3 yang diberikan, dan memakai aturan invers dan determinan.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A System as One Equation', 'Ayo Amati: Sistem sebagai Satu Persamaan'),
          body: L(
            `The system $3x+y=7$ and $5x+2y=12$ is one matrix equation:\n\n$$${pm([3, 1], [5, 2])}${pm(['x'], ['y'])}=${pm([7], [12])}$$\n\nWith $A=${pm([3, 1], [5, 2])}$ and $A^{-1}=${pm([2, -1], [-5, 3])}$:\n\n$$${pm(['x'], ['y'])}=A^{-1}${pm([7], [12])}=${pm([2], [1])}$$\n\nSo $x=2$ and $y=1$: the point where the two lines in the picture cross. This works whenever $\\det A\\ne0$.`,
            `Sistem $3x+y=7$ dan $5x+2y=12$ adalah satu persamaan matriks:\n\n$$${pm([3, 1], [5, 2])}${pm(['x'], ['y'])}=${pm([7], [12])}$$\n\nDengan $A=${pm([3, 1], [5, 2])}$ dan $A^{-1}=${pm([2, -1], [-5, 3])}$:\n\n$$${pm(['x'], ['y'])}=A^{-1}${pm([7], [12])}=${pm([2], [1])}$$\n\nJadi $x=2$ dan $y=1$: titik tempat dua garis pada gambar berpotongan. Ini berlaku selama $\\det A\\ne0$.`,
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '7-3*x', from: -0.5, to: 3.5, color: 'a' },
                { t: 'curve', f: '(12-5*x)/2', from: -0.5, to: 4.5, color: 'b' },
              ],
              { x: [-1, 5], y: [-3, 9] },
            ),
            caption: L('The lines 3x + y = 7 (green) and 5x + 2y = 12 (orange).', 'Garis 3x + y = 7 (hijau) dan 5x + 2y = 12 (oranye).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: A 3 x 3 Inverse', 'Contoh Bertahap: Invers 3 x 3'),
          body: L(
            `A $3\\times3$ inverse is long to compute by hand, so a test usually **gives** it or uses a simple matrix. Take\n\n$$A=${pm([1, 0, 0], [2, 1, 0], [0, 3, 1])}\\qquad A^{-1}=${pm([1, 0, 0], [-2, 1, 0], [6, -3, 1])}$$\n\nSolve $A\\mathbf{x}=${pm([1], [4], [10])}$:\n\n1. Step 1: $\\mathbf{x}=A^{-1}\\mathbf{b}$.\n2. Step 2: Row 1: $1\\cdot1=1$. Row 2: $-2\\cdot1+1\\cdot4=2$. Row 3: $6\\cdot1-3\\cdot4+1\\cdot10=4$.\n3. Step 3: $\\mathbf{x}=${pm([1], [2], [4])}$. Check row 3 of $A$: $0+3\\cdot2+4=10$ ✓.\n\nThe determinant of a triangular matrix is the product of its diagonal, here $1$.`,
            `Invers $3\\times3$ panjang bila dihitung dengan tangan, jadi tes biasanya **memberikannya** atau memakai matriks sederhana. Ambil\n\n$$A=${pm([1, 0, 0], [2, 1, 0], [0, 3, 1])}\\qquad A^{-1}=${pm([1, 0, 0], [-2, 1, 0], [6, -3, 1])}$$\n\nSelesaikan $A\\mathbf{x}=${pm([1], [4], [10])}$:\n\n1. Langkah 1: $\\mathbf{x}=A^{-1}\\mathbf{b}$.\n2. Langkah 2: Baris 1: $1\\cdot1=1$. Baris 2: $-2\\cdot1+1\\cdot4=2$. Baris 3: $6\\cdot1-3\\cdot4+1\\cdot10=4$.\n3. Langkah 3: $\\mathbf{x}=${pm([1], [2], [4])}$. Periksa baris 3 dari $A$: $0+3\\cdot2+4=10$ ✓.\n\nDeterminan matriks segitiga adalah hasil kali diagonalnya, di sini $1$.`,
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Rules for Inverses and Determinants', 'Contoh Bertahap: Aturan Invers dan Determinan'),
          body: L(
            `Let $A$ be a $3\\times3$ matrix with $\\det A=2$.\n\n1. Step 1: $\\det(2A)=2^3\\cdot2=16$ (three rows, each doubled).\n2. Step 2: $\\det(A^{-1})=\\frac{1}{\\det A}=\\frac{1}{2}$, because $\\det A\\cdot\\det A^{-1}=\\det I=1$.\n3. Step 3: $\\det(A^2)=2\\cdot2=4$.\n4. Step 4: $\\det(A^T)=2$.\n\nAn inverse exists exactly when $\\det A\\ne0$. And always keep the order: $(AB)^{-1}=B^{-1}A^{-1}$.`,
            `Misalkan $A$ matriks $3\\times3$ dengan $\\det A=2$.\n\n1. Langkah 1: $\\det(2A)=2^3\\cdot2=16$ (tiga baris, masing-masing digandakan).\n2. Langkah 2: $\\det(A^{-1})=\\frac{1}{\\det A}=\\frac{1}{2}$, karena $\\det A\\cdot\\det A^{-1}=\\det I=1$.\n3. Langkah 3: $\\det(A^2)=2\\cdot2=4$.\n4. Langkah 4: $\\det(A^T)=2$.\n\nInvers ada tepat ketika $\\det A\\ne0$. Dan selalu jaga urutan: $(AB)^{-1}=B^{-1}A^{-1}$.`,
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The two lines are the equations of a system $A\\mathbf{x}=\\mathbf{b}$. Which point is its solution?',
            'Dua garis itu adalah persamaan sebuah sistem $A\\mathbf{x}=\\mathbf{b}$. Titik manakah penyelesaiannya?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '7-3*x', from: -0.5, to: 3.5, color: 'a' },
                { t: 'curve', f: '(12-5*x)/2', from: -0.5, to: 4.5, color: 'b' },
              ],
              { x: [-1, 5], y: [-3, 9] },
            ),
            caption: L('Two lines of a system.', 'Dua garis dari sebuah sistem.'),
          },
          options: ['(2, 1)', '(1, 2)', '(7, 0)', '(3, -2)', '(1, 4)'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'The solution is the point on both lines. The green line passes through $(2,1)$ and so does the orange one. Check: $3\\cdot2+1=7$ and $5\\cdot2+2\\cdot1=12$. The point $(1,2)$ swaps the coordinates.',
            'Penyelesaiannya adalah titik yang terletak pada kedua garis. Garis hijau melalui $(2,1)$ dan garis oranye juga. Periksa: $3\\cdot2+1=7$ dan $5\\cdot2+2\\cdot1=12$. Titik $(1,2)$ menukar koordinatnya.',
          ),
          hint: L(
            'Find where the two lines cross, then read its coordinates.',
            'Cari tempat kedua garis berpotongan, lalu baca koordinatnya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            `Try it together: compute $A^{-1}\\mathbf{b}=${pm([2, -1], [-5, 3])}${pm([7], [12])}$, row by row.`,
            `Coba bersama: hitung $A^{-1}\\mathbf{b}=${pm([2, -1], [-5, 3])}${pm([7], [12])}$, baris demi baris.`,
          ),
          template: 'x=2\\cdot7+(-1)\\cdot12=___ \\qquad y=(-5)\\cdot7+3\\cdot12=___',
          blanks: ['2', '1'],
          explain: L('$2\\cdot7-1\\cdot12=2$ and $-5\\cdot7+3\\cdot12=1$.', '$2\\cdot7-1\\cdot12=2$ dan $-5\\cdot7+3\\cdot12=1$.'),
          hint: L('Each entry is a row of the matrix times the column.', 'Setiap entri adalah baris matriks kali kolom.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'A is a $3\\times3$ matrix with $\\det A=2$. Choose the TWO true statements.',
            'A adalah matriks $3\\times3$ dengan $\\det A=2$. Pilih DUA pernyataan yang benar.',
          ),
          options: [
            L('$\\det(2A)=16$', '$\\det(2A)=16$'),
            L('$\\det(A^{-1})=\\frac{1}{2}$', '$\\det(A^{-1})=\\frac{1}{2}$'),
            L('$\\det(A^{2})=2$', '$\\det(A^{2})=2$'),
            L('$\\det(3A)=6$', '$\\det(3A)=6$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\det(2A)=2^3\\cdot2=16$ and $\\det A^{-1}=\\frac12$. But $\\det A^2=4$ and $\\det(3A)=27\\cdot2=54$.',
            '$\\det(2A)=2^3\\cdot2=16$ dan $\\det A^{-1}=\\frac12$. Tetapi $\\det A^2=4$ dan $\\det(3A)=27\\cdot2=54$.',
          ),
          hint: L('Use $\\det(kA)=k^3\\det A$ for a $3\\times3$ matrix.', 'Pakai $\\det(kA)=k^3\\det A$ untuk matriks $3\\times3$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            `Let $A=${pm([1, 0, 0], [2, 1, 0], [0, 3, 1])}$ and $A^{-1}=${pm([1, 0, 0], [-2, 1, 0], [6, -3, 1])}$. Decide whether each statement is True or False.`,
            `Misalkan $A=${pm([1, 0, 0], [2, 1, 0], [0, 3, 1])}$ dan $A^{-1}=${pm([1, 0, 0], [-2, 1, 0], [6, -3, 1])}$. Tentukan tiap pernyataan Benar atau Salah.`,
          ),
          statements: [
            L('$A$ has an inverse.', '$A$ mempunyai invers.'),
            L('$\\det A=1$', '$\\det A=1$'),
            L('The last row of $A^{-1}$ is $(6,-3,1)$.', 'Baris terakhir $A^{-1}$ adalah $(6,-3,1)$.'),
            L('$A^{-1}=-A$', '$A^{-1}=-A$'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The determinant of a triangular matrix is the product of the diagonal: $1\\cdot1\\cdot1=1$, so the inverse exists. The last row of the given inverse is $(6,-3,1)$. But $-A$ has diagonal $-1$, so it is not $A^{-1}$.',
            'Determinan matriks segitiga adalah hasil kali diagonal: $1\\cdot1\\cdot1=1$, jadi invers ada. Baris terakhir invers yang diberikan adalah $(6,-3,1)$. Tetapi $-A$ berdiagonal $-1$, jadi bukan $A^{-1}$.',
          ),
          hint: L('Multiply the diagonal for the determinant, and read the rows of $A^{-1}$.', 'Kalikan diagonal untuk determinan, dan baca baris-baris $A^{-1}$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            `With $A$ and $A^{-1}$ as above, solve $A\\mathbf{x}=${pm([1], [4], [10])}$. Find the third component $z$.`,
            `Dengan $A$ dan $A^{-1}$ di atas, selesaikan $A\\mathbf{x}=${pm([1], [4], [10])}$. Cari komponen ketiga $z$.`,
          ),
          blanks: [{ label: 'z =', answer: 4 }],
          hints: [
            L('Multiply $A^{-1}$ by the right-hand side.', 'Kalikan $A^{-1}$ dengan ruas kanan.'),
            L('You only need the third row of $A^{-1}$: $(6,-3,1)$.', 'Kamu hanya perlu baris ketiga $A^{-1}$: $(6,-3,1)$.'),
            L('$6\\cdot1-3\\cdot4+1\\cdot10$.', '$6\\cdot1-3\\cdot4+1\\cdot10$.'),
          ],
          explain: L('$z=6-12+10=4$.', '$z=6-12+10=4$.'),
          solution: ['z=(6,-3,1)\\cdot(1,4,10)', '=6-12+10=4'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m1-s2-p',
    runtime: 'math',
    title: L('Inverses at Work', 'Invers dalam Pemakaian'),
    brief: L(
      'Find inverses, solve matrix equations and systems, and use the rules for determinants.',
      'Cari invers, selesaikan persamaan matriks dan sistem, dan pakai aturan determinan.',
    ),
    requirements: [
      L('Find the inverse of a $2\\times2$ matrix.', 'Mencari invers matriks $2\\times2$.'),
      L('Solve $AX=B$ and systems with an inverse.', 'Menyelesaikan $AX=B$ dan sistem dengan invers.'),
    ],
    hints: [
      L('The inverse needs $\\det A\\ne0$.', 'Invers memerlukan $\\det A\\ne0$.'),
      L('For $AX=B$ multiply by $A^{-1}$ on the left.', 'Untuk $AX=B$ kalikan $A^{-1}$ dari kiri.'),
      L('For a $3\\times3$ matrix, $\\det(kA)=k^3\\det A$.', 'Untuk matriks $3\\times3$, $\\det(kA)=k^3\\det A$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          `Find the sum of all entries of the inverse of $${pm([4, 7], [1, 2])}$.`,
          `Cari jumlah semua entri invers dari $${pm([4, 7], [1, 2])}$.`,
        ),
        blanks: [{ answer: -2 }],
        solution: ['\\det=8-7=1 \\quad A^{-1}=\\begin{pmatrix}2&-7\\\\-1&4\\end{pmatrix}', '2-7-1+4=-2'],
      },
      {
        prompt: L(
          `Solve $3x+2y=8$ and $4x+3y=11$ using the inverse of $${pm([3, 2], [4, 3])}$.`,
          `Selesaikan $3x+2y=8$ dan $4x+3y=11$ dengan invers dari $${pm([3, 2], [4, 3])}$.`,
        ),
        blanks: [{ label: 'x =', answer: 2 }, { label: 'y =', answer: 1 }],
        solution: ['A^{-1}=\\begin{pmatrix}3&-2\\\\-4&3\\end{pmatrix}', 'x=3\\cdot8-2\\cdot11=2 \\quad y=-4\\cdot8+3\\cdot11=1'],
      },
      {
        prompt: L(
          'A is a $3\\times3$ matrix with $\\det A=3$. Find $\\det(2A)$.',
          'A adalah matriks $3\\times3$ dengan $\\det A=3$. Cari $\\det(2A)$.',
        ),
        blanks: [{ answer: 24 }],
        solution: ['\\det(2A)=2^3\\cdot3', '=24'],
      },
      {
        prompt: L(
          `Let $A=${pm([1, 2], [0, 1])}$ and $B=${pm([3, 1], [1, 1])}$. Solve $AX=B$ and give the entry in row 1, column 2 of $X$.`,
          `Misalkan $A=${pm([1, 2], [0, 1])}$ dan $B=${pm([3, 1], [1, 1])}$. Selesaikan $AX=B$ dan berikan entri baris 1, kolom 2 dari $X$.`,
        ),
        blanks: [{ answer: -1 }],
        solution: [`A^{-1}=${pm([1, -2], [0, 1])}`, `X=A^{-1}B=${pm([1, -1], [1, 1])}`, 'x_{12}=-1'],
      },
      {
        prompt: L(
          `For which value of $k$ has $${pm(['k', 2], [3, 6])}$ no inverse?`,
          `Untuk nilai $k$ berapa $${pm(['k', 2], [3, 6])}$ tidak punya invers?`,
        ),
        blanks: [{ label: 'k =', answer: 1 }],
        solution: ['\\det=6k-6=0', 'k=1'],
      },
    ],
  },
}
