import type { Submodule } from '../types'
import { L, arrow, dot, plane, pm, solid } from './figs'
import type { Pt } from './figs'

/** Module 6 — geometric transformations with their matrices, compositions,
 *  and the images of lines and curves. */

const pts = (...p: Pt[]) => p

const rotated = () =>
  plane(
    [
      solid(pts([1, 1], [3, 1], [1, 2]), 'a'),
      solid(pts([-1, 1], [-1, 3], [-2, 1]), 'b'),
      dot([3, 1], 'B', 'result'),
      dot([-1, 3], "B'", 'result'),
    ],
    { x: [-5, 5], y: [-1, 5] },
  )

export const m6s1: Submodule = {
  id: 'tka-sml-m6-s1',
  title: L('Transformations and Matrices', 'Transformasi dan Matriks'),
  summary: L(
    'Reflection, rotation, dilation and translation with their matrices, compositions, and the image of a line, a curve or a region.',
    'Refleksi, rotasi, dilatasi, dan translasi dengan matriksnya, komposisi, serta bayangan garis, kurva, atau daerah.',
  ),
  lessons: [
    /* ------------------------------------------- L1 the transformation matrices */
    {
      id: 'tka-sml-m6-s1-l1',
      title: L('Transformation Matrices', 'Matriks Transformasi'),
      goal: L(
        'You can use the matrix of a reflection, rotation or dilation to find an image, and a vector to translate.',
        'Kamu bisa memakai matriks refleksi, rotasi, atau dilatasi untuk mencari bayangan, dan vektor untuk menggeser.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Matrix That Turns', 'Ayo Amati: Matriks yang Memutar'),
          body: L(
            `A matrix $M$ moves the point $(x,y)$ to the point given by $M\\begin{pmatrix}x\\\\y\\end{pmatrix}$. The columns of $M$ are the images of $(1,0)$ and $(0,1)$.\n\nA **rotation by $90^{\\circ}$ counterclockwise** about the origin sends $(1,0)\\to(0,1)$ and $(0,1)\\to(-1,0)$, so $M=${pm([0, -1], [1, 0])}$. In the picture the green triangle with $B(3,1)$ is turned into the orange triangle: $B'=(-1,3)$.\n\nCheck: $${pm([0, -1], [1, 0])}${pm([3], [1])}=${pm([-1], [3])}$$`,
            `Matriks $M$ memindahkan titik $(x,y)$ ke titik $M\\begin{pmatrix}x\\\\y\\end{pmatrix}$. Kolom-kolom $M$ adalah bayangan $(1,0)$ dan $(0,1)$.\n\n**Rotasi $90^{\\circ}$ berlawanan arah jarum jam** terhadap titik asal mengirim $(1,0)\\to(0,1)$ dan $(0,1)\\to(-1,0)$, jadi $M=${pm([0, -1], [1, 0])}$. Pada gambar segitiga hijau dengan $B(3,1)$ diputar menjadi segitiga oranye: $B'=(-1,3)$.\n\nPeriksa: $${pm([0, -1], [1, 0])}${pm([3], [1])}=${pm([-1], [3])}$$`,
          ),
          figure: {
            ...rotated(),
            caption: L("The triangle (green) turned by 90° about the origin gives the orange triangle. B(3, 1) goes to B'(−1, 3).", "Segitiga (hijau) diputar 90° terhadap titik asal menjadi segitiga oranye. B(3, 1) menjadi B'(−1, 3)."),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Matrices to Know', 'Contoh Bertahap: Matriks yang Perlu Diketahui'),
          body: L(
            `| Transformation | Matrix | $(x,y)\\to$ |\n|---|---|---|\n| reflection in the $x$-axis | $${pm([1, 0], [0, -1])}$ | $(x,-y)$ |\n| reflection in the $y$-axis | $${pm([-1, 0], [0, 1])}$ | $(-x,y)$ |\n| reflection in $y=x$ | $${pm([0, 1], [1, 0])}$ | $(y,x)$ |\n| rotation $90^{\\circ}$ counterclockwise | $${pm([0, -1], [1, 0])}$ | $(-y,x)$ |\n| rotation $180^{\\circ}$ | $${pm([-1, 0], [0, -1])}$ | $(-x,-y)$ |\n| dilation $(O,k)$ | $${pm(['k', 0], [0, 'k'])}$ | $(kx,ky)$ |\n\nApply them to $P(3,1)$: the $x$-axis reflection gives $(3,-1)$; the line $y=x$ gives $(1,3)$; the half-turn gives $(-3,-1)$; the dilation $(O,2)$ gives $(6,2)$.`,
            `| Transformasi | Matriks | $(x,y)\\to$ |\n|---|---|---|\n| refleksi terhadap sumbu $x$ | $${pm([1, 0], [0, -1])}$ | $(x,-y)$ |\n| refleksi terhadap sumbu $y$ | $${pm([-1, 0], [0, 1])}$ | $(-x,y)$ |\n| refleksi terhadap $y=x$ | $${pm([0, 1], [1, 0])}$ | $(y,x)$ |\n| rotasi $90^{\\circ}$ berlawanan jarum jam | $${pm([0, -1], [1, 0])}$ | $(-y,x)$ |\n| rotasi $180^{\\circ}$ | $${pm([-1, 0], [0, -1])}$ | $(-x,-y)$ |\n| dilatasi $(O,k)$ | $${pm(['k', 0], [0, 'k'])}$ | $(kx,ky)$ |\n\nTerapkan pada $P(3,1)$: refleksi sumbu $x$ memberi $(3,-1)$; garis $y=x$ memberi $(1,3)$; setengah putaran memberi $(-3,-1)$; dilatasi $(O,2)$ memberi $(6,2)$.`,
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Translation and Other Centers', 'Awas, Jebakan!: Translasi dan Pusat Lain'),
          body: L(
            `A **translation** by $(p,q)$ is **not** a matrix product. It **adds** a vector: $(x,y)\\to(x+p,\\,y+q)$. For example $(3,1)$ translated by $(2,-1)$ is $(5,0)$.\n\nA **dilation with center $C(a,b)$** and factor $k$: first measure from the center, then scale, then come back:\n\n$$X'=C+k\\,(X-C)$$\n\nDilate $X(5,4)$ about $C(1,2)$ with $k=3$: $X-C=(4,2)$, times $3$ is $(12,6)$, plus $C$ gives $X'=(13,8)$.\n\nA positive angle turns **counterclockwise**; $-90^{\\circ}$ (clockwise) has the matrix $${pm([0, 1], [-1, 0])}$.`,
            `**Translasi** oleh $(p,q)$ **bukan** hasil kali matriks. Ia **menambah** sebuah vektor: $(x,y)\\to(x+p,\\,y+q)$. Misalnya $(3,1)$ yang digeser $(2,-1)$ menjadi $(5,0)$.\n\n**Dilatasi berpusat di $C(a,b)$** dengan faktor $k$: ukur dulu dari pusat, lalu skala, lalu kembali:\n\n$$X'=C+k\\,(X-C)$$\n\nDilatasikan $X(5,4)$ terhadap $C(1,2)$ dengan $k=3$: $X-C=(4,2)$, kali $3$ adalah $(12,6)$, tambah $C$ memberi $X'=(13,8)$.\n\nSudut positif memutar **berlawanan jarum jam**; $-90^{\\circ}$ (searah jarum jam) bermatriks $${pm([0, 1], [-1, 0])}$.`,
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            "Which transformation maps the green triangle onto the orange triangle? Notice that B(3, 1) goes to B'(−1, 3).",
            "Transformasi manakah yang memetakan segitiga hijau ke segitiga oranye? Perhatikan bahwa B(3, 1) menjadi B'(−1, 3).",
          ),
          figure: {
            ...rotated(),
            caption: L('A triangle and its image.', 'Sebuah segitiga dan bayangannya.'),
          },
          options: [
            L('Rotation by $90^{\\circ}$ counterclockwise about the origin', 'Rotasi $90^{\\circ}$ berlawanan jarum jam terhadap titik asal'),
            L('Reflection in the $y$-axis', 'Refleksi terhadap sumbu $y$'),
            L('Reflection in the line $y=x$', 'Refleksi terhadap garis $y=x$'),
            L('Rotation by $90^{\\circ}$ clockwise about the origin', 'Rotasi $90^{\\circ}$ searah jarum jam terhadap titik asal'),
            L('Dilation $(O,-1)$', 'Dilatasi $(O,-1)$'),
          ],
          answer: 0,
          explain: L(
            "The rule $(x,y)\\to(-y,x)$ gives $B(3,1)\\to(-1,3)$ ✓. A reflection in the $y$-axis would send $B$ to $(-3,1)$, and in $y=x$ to $(1,3)$. A clockwise turn sends $B$ to $(1,-3)$, and $(O,-1)$ sends it to $(-3,-1)$.",
            'Aturan $(x,y)\\to(-y,x)$ memberi $B(3,1)\\to(-1,3)$ ✓. Refleksi terhadap sumbu $y$ akan mengirim $B$ ke $(-3,1)$, dan terhadap $y=x$ ke $(1,3)$. Putaran searah jarum jam mengirim $B$ ke $(1,-3)$, dan $(O,-1)$ mengirimnya ke $(-3,-1)$.',
          ),
          hint: L(
            "Follow one corner only, $B(3,1)\\to B'(-1,3)$, and test each transformation on it.",
            "Ikuti satu titik sudut saja, $B(3,1)\\to B'(-1,3)$, dan uji tiap transformasi padanya.",
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            `Try it together: rotate $(3,1)$ by $90^{\\circ}$ counterclockwise with $M=${pm([0, -1], [1, 0])}$, row by row.`,
            `Coba bersama: putar $(3,1)$ sebesar $90^{\\circ}$ berlawanan jarum jam dengan $M=${pm([0, -1], [1, 0])}$, baris demi baris.`,
          ),
          template: "x'=0\\cdot3-1\\cdot1=___ \\qquad y'=1\\cdot3+0\\cdot1=___",
          blanks: ['-1', '3'],
          explain: L('$0\\cdot3-1\\cdot1=-1$ and $1\\cdot3+0\\cdot1=3$.', '$0\\cdot3-1\\cdot1=-1$ dan $1\\cdot3+0\\cdot1=3$.'),
          hint: L('Row by column: each entry is a row of the matrix times the point.', 'Baris kali kolom: tiap entri adalah baris matriks kali titik.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L(`Reflection in the $y$-axis has the matrix $${pm([-1, 0], [0, 1])}$.`, `Refleksi terhadap sumbu $y$ bermatriks $${pm([-1, 0], [0, 1])}$.`),
            L(`Dilation $(O,3)$ has the matrix $${pm([3, 0], [0, 3])}$.`, `Dilatasi $(O,3)$ bermatriks $${pm([3, 0], [0, 3])}$.`),
            L(`Rotation by $90^{\\circ}$ counterclockwise has the matrix $${pm([0, 1], [-1, 0])}$.`, `Rotasi $90^{\\circ}$ berlawanan jarum jam bermatriks $${pm([0, 1], [-1, 0])}$.`),
            L('A translation is a $2\\times2$ matrix times the point.', 'Translasi adalah matriks $2\\times2$ kali titik.'),
          ],
          answer: [0, 1],
          explain: L(
            'The $y$-axis reflection flips the sign of $x$, and a dilation scales both coordinates. The matrix with $-1$ in the bottom left is a clockwise turn. A translation adds a vector.',
            'Refleksi sumbu $y$ membalik tanda $x$, dan dilatasi mengalikan kedua koordinat. Matriks dengan $-1$ di kiri bawah adalah putaran searah jarum jam. Translasi menambahkan vektor.',
          ),
          hint: L('Test each matrix on $(1,0)$ and $(0,1)$.', 'Uji tiap matriks pada $(1,0)$ dan $(0,1)$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'The point $P(3,1)$ is transformed. Decide whether each statement is True or False.',
            'Titik $P(3,1)$ ditransformasikan. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('Its image in the $x$-axis is $(3,-1)$.', 'Bayangannya pada sumbu $x$ adalah $(3,-1)$.'),
            L('Its image in the line $y=x$ is $(1,3)$.', 'Bayangannya pada garis $y=x$ adalah $(1,3)$.'),
            L('Its image under a rotation by $180^{\\circ}$ about $O$ is $(-3,-1)$.', 'Bayangannya oleh rotasi $180^{\\circ}$ terhadap $O$ adalah $(-3,-1)$.'),
            L('Its image under the dilation $(O,2)$ is $(6,1)$.', 'Bayangannya oleh dilatasi $(O,2)$ adalah $(6,1)$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'A dilation multiplies **both** coordinates: $(6,2)$, not $(6,1)$.',
            'Dilatasi mengalikan **kedua** koordinat: $(6,2)$, bukan $(6,1)$.',
          ),
          hint: L('Use the table of matrices.', 'Pakai tabel matriks.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The point $(4,-2)$ is rotated by $90^{\\circ}$ counterclockwise about the origin. Find the sum of the coordinates of its image.',
            'Titik $(4,-2)$ diputar $90^{\\circ}$ berlawanan jarum jam terhadap titik asal. Cari jumlah koordinat bayangannya.',
          ),
          blanks: [{ answer: 6 }],
          hints: [
            L('The rotation sends $(x,y)$ to $(-y,x)$.', 'Rotasi mengirim $(x,y)$ ke $(-y,x)$.'),
            L('$(4,-2)\\to(2,4)$.', '$(4,-2)\\to(2,4)$.'),
            L('Add $2+4$.', 'Jumlahkan $2+4$.'),
          ],
          explain: L('The image is $(2,4)$ and $2+4=6$.', 'Bayangannya $(2,4)$ dan $2+4=6$.'),
          solution: ['(x,y)\\to(-y,x):\\ (4,-2)\\to(2,4)', '2+4=6'],
        },
      ],
    },
    /* ------------------------------------ L2 compositions, lines and curves */
    {
      id: 'tka-sml-m6-s1-l2',
      title: L('Compositions, Lines, Curves and Areas', 'Komposisi, Garis, Kurva, dan Luas'),
      goal: L(
        'You can compose transformations with matrices, find the image of a line or a curve, and see how an area changes.',
        'Kamu bisa mengomposisikan transformasi dengan matriks, mencari bayangan garis atau kurva, dan melihat bagaimana luas berubah.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Later Matrix Goes on the Left', 'Ayo Amati: Matriks yang Belakangan di Sebelah Kiri'),
          body: L(
            `Do $T_1$ first and then $T_2$. The point goes $X\\to M_1X\\to M_2(M_1X)$, so the single matrix is $M=M_2M_1$: the **later** transformation is written on the **left**.\n\nReflect in the $x$-axis ($F$) and then rotate by $90^{\\circ}$ counterclockwise ($R$):\n\n$$RF=${pm([0, -1], [1, 0])}${pm([1, 0], [0, -1])}=${pm([0, 1], [1, 0])}$$\n\nThis is the reflection in $y=x$. Check with $(3,1)$: the reflection gives $(3,-1)$, then the rotation gives $(1,3)$ ✓. The picture follows the point.`,
            `Lakukan $T_1$ dulu lalu $T_2$. Titik berjalan $X\\to M_1X\\to M_2(M_1X)$, jadi matriks tunggalnya $M=M_2M_1$: transformasi yang **belakangan** ditulis di sebelah **kiri**.\n\nRefleksikan terhadap sumbu $x$ ($F$) lalu putar $90^{\\circ}$ berlawanan jarum jam ($R$):\n\n$$RF=${pm([0, -1], [1, 0])}${pm([1, 0], [0, -1])}=${pm([0, 1], [1, 0])}$$\n\nIni adalah refleksi terhadap $y=x$. Periksa dengan $(3,1)$: refleksi memberi $(3,-1)$, lalu rotasi memberi $(1,3)$ ✓. Gambar mengikuti titiknya.`,
          ),
          figure: {
            ...plane(
              [
                dot([3, 1], 'P', 'a'),
                dot([3, -1], undefined, 'b'),
                dot([1, 3], undefined, 'result'),
                arrow([3, -1], undefined, 'muted', [3, 1]),
                arrow([1, 3], undefined, 'muted', [3, -1]),
                { t: 'curve', f: 'x', from: -1, to: 5, color: 'muted', dashed: true },
              ],
              { x: [-1, 5], y: [-3, 5] },
            ),
            caption: L('P(3, 1) goes to (3, −1) (orange) and then to (1, 3) (red).', 'P(3, 1) menjadi (3, −1) (oranye) lalu menjadi (1, 3) (merah).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Image of a Line', 'Contoh Bertahap: Bayangan Sebuah Garis'),
          body: L(
            'To find the image of a graph, call the new point $(x\',y\')$, write the old $x,y$ in terms of $x\',y\'$, and substitute into the old equation.\n\nLine $y=2x+1$:\n\n1. Step 1: **Reflection in the $x$-axis**: $x\'=x$, $y\'=-y$, so $y=-y\'$. Then $-y\'=2x\'+1$, so $y=-2x-1$.\n2. Step 2: **Translation by $(3,0)$**: $x\'=x+3$, so $x=x\'-3$ and $y\'=2(x\'-3)+1=2x\'-5$.\n3. Step 3: **Dilation $(O,2)$**: $x=\\frac{x\'}{2}$ and $y=\\frac{y\'}{2}$, so $\\frac{y\'}{2}=2\\cdot\\frac{x\'}{2}+1$ and $y\'=2x\'+2$.\n\nThen drop the primes. A shift **right** by $3$ replaces $x$ by $x-3$.',
            'Untuk mencari bayangan sebuah grafik, namai titik baru $(x\',y\')$, tulis $x,y$ lama dalam $x\',y\'$, dan substitusikan ke persamaan lama.\n\nGaris $y=2x+1$:\n\n1. Langkah 1: **Refleksi terhadap sumbu $x$**: $x\'=x$, $y\'=-y$, jadi $y=-y\'$. Maka $-y\'=2x\'+1$, sehingga $y=-2x-1$.\n2. Langkah 2: **Translasi $(3,0)$**: $x\'=x+3$, jadi $x=x\'-3$ dan $y\'=2(x\'-3)+1=2x\'-5$.\n3. Langkah 3: **Dilatasi $(O,2)$**: $x=\\frac{x\'}{2}$ dan $y=\\frac{y\'}{2}$, jadi $\\frac{y\'}{2}=2\\cdot\\frac{x\'}{2}+1$ dan $y\'=2x\'+2$.\n\nLalu hilangkan tanda aksen. Pergeseran ke **kanan** sebesar $3$ mengganti $x$ dengan $x-3$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: A Curve and an Area', 'Contoh Bertahap: Kurva dan Luas'),
          body: L(
            'Find the image of $y=2x^2-5$ after a translation by $(1,-3)$ and then a dilation $(O,2)$.\n\n1. Step 1: Translation: replace $x$ by $x-1$ and $y$ by $y+3$: $y+3=2(x-1)^2-5$, so $y=2(x-1)^2-8$.\n2. Step 2: Dilation: replace $x$ by $\\frac x2$ and $y$ by $\\frac y2$: $\\frac y2=2\\left(\\frac x2-1\\right)^2-8$.\n3. Step 3: Multiply by $2$: $y=4\\left(\\frac x2-1\\right)^2-16=(x-2)^2-16=x^2-4x-12$.\n\nCheck with the vertex: $(0,-5)\\to(1,-8)\\to(2,-16)$, and $2^2-4\\cdot2-12=-16$ ✓.\n\n**Areas.** A transformation with matrix $M$ multiplies areas by $|\\det M|$. A reflection or a rotation keeps the area ($|\\det|=1$); a dilation by $k$ multiplies it by $k^2$. A triangle of area $6$ dilated by $3$ has area $54$.',
            'Cari bayangan $y=2x^2-5$ setelah translasi $(1,-3)$ lalu dilatasi $(O,2)$.\n\n1. Langkah 1: Translasi: ganti $x$ dengan $x-1$ dan $y$ dengan $y+3$: $y+3=2(x-1)^2-5$, jadi $y=2(x-1)^2-8$.\n2. Langkah 2: Dilatasi: ganti $x$ dengan $\\frac x2$ dan $y$ dengan $\\frac y2$: $\\frac y2=2\\left(\\frac x2-1\\right)^2-8$.\n3. Langkah 3: Kalikan $2$: $y=4\\left(\\frac x2-1\\right)^2-16=(x-2)^2-16=x^2-4x-12$.\n\nPeriksa dengan titik puncak: $(0,-5)\\to(1,-8)\\to(2,-16)$, dan $2^2-4\\cdot2-12=-16$ ✓.\n\n**Luas.** Transformasi bermatriks $M$ mengalikan luas dengan $|\\det M|$. Refleksi atau rotasi mempertahankan luas ($|\\det|=1$); dilatasi $k$ mengalikannya dengan $k^2$. Segitiga berluas $6$ yang didilatasikan $3$ berluas $54$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The line y = 2x + 1 in the picture is reflected in the x-axis. What is the equation of its image?',
            'Garis y = 2x + 1 pada gambar direfleksikan terhadap sumbu x. Apa persamaan bayangannya?',
          ),
          figure: {
            ...plane([{ t: 'curve', f: '2*x+1', from: -3, to: 3, color: 'a' }], { x: [-4, 4], y: [-6, 8] }),
            caption: L('The line y = 2x + 1.', 'Garis y = 2x + 1.'),
          },
          options: ['y=-2x-1', 'y=-2x+1', 'y=2x-1', 'y=-\\frac{x}{2}-1', 'x=2y+1'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'A reflection in the $x$-axis sends $(x,y)$ to $(x,-y)$, so the new $y$ equals $-(2x+1)=-2x-1$. The option $y=-2x+1$ only changes the sign of the slope, and $y=2x-1$ only changes the sign of the constant.',
            'Refleksi terhadap sumbu $x$ mengirim $(x,y)$ ke $(x,-y)$, jadi $y$ yang baru sama dengan $-(2x+1)=-2x-1$. Pilihan $y=-2x+1$ hanya mengubah tanda gradien, dan $y=2x-1$ hanya mengubah tanda konstanta.',
          ),
          hint: L('Every $y$ is replaced by its opposite: negate the whole right side.', 'Setiap $y$ diganti lawannya: negatifkan seluruh ruas kanan.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            `Try it together: find the four entries of $RF=${pm([0, -1], [1, 0])}${pm([1, 0], [0, -1])}$.`,
            `Coba bersama: cari keempat entri $RF=${pm([0, -1], [1, 0])}${pm([1, 0], [0, -1])}$.`,
          ),
          template: '(RF)_{11}=___ \\quad (RF)_{12}=___ \\quad (RF)_{21}=___ \\quad (RF)_{22}=___',
          blanks: ['0', '1', '1', '0'],
          explain: L('Row by column: $0\\cdot1+(-1)\\cdot0=0$, $0\\cdot0+(-1)(-1)=1$, $1\\cdot1+0=1$, $1\\cdot0+0\\cdot(-1)=0$.', 'Baris kali kolom: $0\\cdot1+(-1)\\cdot0=0$, $0\\cdot0+(-1)(-1)=1$, $1\\cdot1+0=1$, $1\\cdot0+0\\cdot(-1)=0$.'),
          hint: L('Multiply row by column, with the left matrix first.', 'Kalikan baris kali kolom, matriks kiri dulu.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('Reflecting in the $x$-axis and then rotating $90^{\\circ}$ counterclockwise equals reflecting in $y=x$.', 'Refleksi terhadap sumbu $x$ lalu rotasi $90^{\\circ}$ berlawanan jarum jam sama dengan refleksi terhadap $y=x$.'),
            L('After the dilation $(O,3)$ the area of a figure is multiplied by $9$.', 'Setelah dilatasi $(O,3)$ luas suatu bangun dikalikan $9$.'),
            L('After the dilation $(O,3)$ the area of a figure is multiplied by $3$.', 'Setelah dilatasi $(O,3)$ luas suatu bangun dikalikan $3$.'),
            L('For the composition $M_2M_1$, the matrix $M_2$ is applied first.', 'Untuk komposisi $M_2M_1$, matriks $M_2$ diterapkan lebih dulu.'),
          ],
          answer: [0, 1],
          explain: L(
            'Lengths scale by $3$, so areas scale by $3^2=9$. In $M_2M_1$ the matrix next to the point, $M_1$, acts first.',
            'Panjang diskalakan $3$, jadi luas diskalakan $3^2=9$. Pada $M_2M_1$ matriks yang dekat dengan titik, $M_1$, bekerja lebih dulu.',
          ),
          hint: L('Area is length times length.', 'Luas adalah panjang kali panjang.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'The curve $y=2x^2-5$ is translated by $(1,-3)$ and then dilated $(O,2)$. Decide whether each statement is True or False.',
            'Kurva $y=2x^2-5$ ditranslasikan $(1,-3)$ lalu didilatasikan $(O,2)$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('After the translation the curve is $y=2(x-1)^2-8$.', 'Setelah translasi kurvanya $y=2(x-1)^2-8$.'),
            L('After both transformations the curve is $y=x^2-4x-12$.', 'Setelah kedua transformasi kurvanya $y=x^2-4x-12$.'),
            L('The vertex of the final curve is $(2,-16)$.', 'Titik puncak kurva akhir adalah $(2,-16)$.'),
            L('The final curve is $y=2x^2-10$.', 'Kurva akhirnya $y=2x^2-10$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The vertex $(0,-5)$ moves to $(1,-8)$ and then to $(2,-16)$. The dilation also changes the opening of the parabola, from $2x^2$ to $x^2$, so the curve is not $2x^2-10$.',
            'Titik puncak $(0,-5)$ pindah ke $(1,-8)$ lalu ke $(2,-16)$. Dilatasi juga mengubah bukaan parabola, dari $2x^2$ menjadi $x^2$, jadi kurvanya bukan $2x^2-10$.',
          ),
          hint: L('Follow the vertex through both transformations.', 'Ikuti titik puncak melalui kedua transformasi.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A triangle with vertices $(0,0)$, $(4,0)$ and $(0,3)$ is dilated by $(O,3)$. Find the area of the image.',
            'Segitiga dengan titik sudut $(0,0)$, $(4,0)$, dan $(0,3)$ didilatasikan $(O,3)$. Cari luas bayangannya.',
          ),
          blanks: [{ answer: 54 }],
          hints: [
            L('First the area of the original triangle.', 'Pertama luas segitiga asal.'),
            L('$\\frac12\\cdot4\\cdot3=6$.', '$\\frac12\\cdot4\\cdot3=6$.'),
            L('The area is multiplied by $3^2=9$.', 'Luasnya dikalikan $3^2=9$.'),
          ],
          explain: L('$6\\times9=54$. The image has the vertices $(0,0)$, $(12,0)$, $(0,9)$ with area $\\frac12\\cdot12\\cdot9=54$ ✓.', '$6\\times9=54$. Bayangannya bertitik sudut $(0,0)$, $(12,0)$, $(0,9)$ dengan luas $\\frac12\\cdot12\\cdot9=54$ ✓.'),
          solution: ['\\frac12\\cdot4\\cdot3=6', '6\\cdot3^2=54'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m6-s1-p',
    runtime: 'math',
    title: L('Transformations at Work', 'Transformasi dalam Pemakaian'),
    brief: L(
      'Find images of points, lines and curves, matrices of compositions, and areas.',
      'Cari bayangan titik, garis, dan kurva, matriks komposisi, dan luas.',
    ),
    requirements: [
      L('Use the matrix of a reflection, rotation or dilation.', 'Memakai matriks refleksi, rotasi, atau dilatasi.'),
      L('Find the image of a line or curve and the change of area.', 'Mencari bayangan garis atau kurva dan perubahan luas.'),
    ],
    hints: [
      L('In a composition the later matrix is on the left.', 'Pada komposisi matriks yang belakangan di sebelah kiri.'),
      L('Replace $x$ by $x-p$ for a shift right by $p$.', 'Ganti $x$ dengan $x-p$ untuk pergeseran ke kanan sebesar $p$.'),
      L('Area is multiplied by $|\\det M|$.', 'Luas dikalikan $|\\det M|$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'The point $(5,2)$ is reflected in the line $y=x$ and then translated by $(-1,3)$. Find the $y$-coordinate of the image.',
          'Titik $(5,2)$ direfleksikan terhadap garis $y=x$ lalu ditranslasikan $(-1,3)$. Cari koordinat $y$ bayangannya.',
        ),
        blanks: [{ answer: 8 }],
        solution: ['(5,2)\\to(2,5)\\to(2-1,\\,5+3)', '(1,8)'],
      },
      {
        prompt: L(
          'A rotation by $90^{\\circ}$ counterclockwise is followed by a dilation $(O,2)$. The matrix of the composition is $\\begin{pmatrix}0&k\\\\2&0\\end{pmatrix}$. Find $k$.',
          'Rotasi $90^{\\circ}$ berlawanan jarum jam diikuti dilatasi $(O,2)$. Matriks komposisinya $\\begin{pmatrix}0&k\\\\2&0\\end{pmatrix}$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: -2 }],
        solution: ['\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix}\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}=\\begin{pmatrix}0&-2\\\\2&0\\end{pmatrix}', 'k=-2'],
      },
      {
        prompt: L(
          'The line $y=3x-2$ is translated by $(2,1)$. Its image is $y=3x+c$. Find $c$.',
          'Garis $y=3x-2$ ditranslasikan $(2,1)$. Bayangannya $y=3x+c$. Tentukan $c$.',
        ),
        blanks: [{ label: 'c =', answer: -7 }],
        solution: ['y-1=3(x-2)-2', 'y=3x-7'],
      },
      {
        prompt: L(
          'A region of area $5$ is dilated by $(O,4)$ and then rotated by $90^{\\circ}$. Find the area of the image.',
          'Suatu daerah berluas $5$ didilatasikan $(O,4)$ lalu diputar $90^{\\circ}$. Cari luas bayangannya.',
        ),
        blanks: [{ answer: 80 }],
        solution: ['5\\cdot4^2=80'],
      },
      {
        prompt: L(
          'The parabola $y=x^2$ is translated by $(2,3)$ and then reflected in the $x$-axis. It meets the $y$-axis at $(0,c)$. Find $c$.',
          'Parabola $y=x^2$ ditranslasikan $(2,3)$ lalu direfleksikan terhadap sumbu $x$. Ia memotong sumbu $y$ di $(0,c)$. Tentukan $c$.',
        ),
        blanks: [{ label: 'c =', answer: -7 }],
        solution: ['y=(x-2)^2+3 \\to y=-(x-2)^2-3', 'c=-4-3=-7'],
      },
    ],
  },
}
