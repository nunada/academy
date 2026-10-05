import type { Lesson } from '../types'
import { L, dot, plane, pm } from './figs'

/** Practice test 2: twelve questions, with different numbers and contexts. */

const cubic = () =>
  plane(
    [
      { t: 'curve', f: 'x^3-x^2-4*x+4', from: -2.5, to: 2.6, color: 'a' },
      dot([-2, 0], undefined, 'result'),
      dot([1, 0], undefined, 'result'),
      dot([2, 0], undefined, 'result'),
      dot([0, 4], undefined, 'result'),
    ],
    { x: [-3.5, 3.5], y: [-8, 10] },
  )

/** y = 3 cos 2x - 1 with x in degrees. */
const wave = () => ({
  ...plane(
    [
      { t: 'curve', f: '3*cos(x*pi/90)-1', from: 0, to: 360, color: 'a' },
      { t: 'hline', y: -1, color: 'muted', dashed: true },
      dot([0, 2], undefined, 'result'),
      dot([90, -4], undefined, 'result'),
      dot([180, 2], undefined, 'result'),
    ],
    { x: [-45, 405], y: [-5, 3] },
  ),
  aspect: 1.8,
})

const plain = (s: string) => L(`$${s}$`, `$${s}$`)

export const test2: Lesson = {
  id: 'tka-sml-m8-s2-l2',
  title: L('Practice Test 2', 'Simulasi TKA Tingkat Lanjut 2'),
  goal: L(
    'You can finish a second practice test with new numbers and contexts, a little faster and with more checking.',
    'Kamu bisa menyelesaikan simulasi kedua dengan bilangan dan konteks baru, sedikit lebih cepat dan dengan lebih banyak pemeriksaan.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: How Practice Test 2 Works', 'Ayo Amati: Cara Kerja Simulasi 2'),
      body: L(
        'Practice test 2 has 12 questions again, with different numbers and a different mix of forms. Try to do it in a little less time than test 1.\n\n- Go through once and answer what you can do quickly.\n- Mark the long questions and return to them.\n- Test every option of a choose-all question.\n- Keep a few minutes for checking.',
        'Simulasi 2 kembali berisi 12 soal, dengan bilangan yang berbeda dan campuran bentuk yang berbeda. Cobalah mengerjakannya dalam waktu sedikit lebih singkat daripada simulasi 1.\n\n- Kerjakan sekali jalan dan jawab yang bisa dikerjakan cepat.\n- Tandai soal yang panjang dan kembali ke sana.\n- Uji setiap pilihan pada soal pilih-semua.\n- Sisakan beberapa menit untuk memeriksa.',
      ),
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        `Let $A=${pm([2, 0], [1, 3])}$ and $B=${pm([1, -1], [4, 2])}$. Which matrix is $AB$?`,
        `Misalkan $A=${pm([2, 0], [1, 3])}$ dan $B=${pm([1, -1], [4, 2])}$. Matriks manakah $AB$?`,
      ),
      options: [pm([2, -2], [13, 5]), pm([1, -3], [10, 6]), pm([2, 0], [4, 6]), pm([3, -1], [5, 5]), pm([2, -2], [5, 13])].map(plain),
      answer: 0,
      explain: L(
        'Row by column: row 1 gives $2\\cdot1+0\\cdot4=2$ and $2\\cdot(-1)+0\\cdot2=-2$; row 2 gives $1\\cdot1+3\\cdot4=13$ and $1\\cdot(-1)+3\\cdot2=5$. The matrix $\\begin{pmatrix}1&-3\\\\10&6\\end{pmatrix}$ is $BA$, which is a different matrix.',
        'Baris kali kolom: baris 1 memberi $2\\cdot1+0\\cdot4=2$ dan $2\\cdot(-1)+0\\cdot2=-2$; baris 2 memberi $1\\cdot1+3\\cdot4=13$ dan $1\\cdot(-1)+3\\cdot2=5$. Matriks $\\begin{pmatrix}1&-3\\\\10&6\\end{pmatrix}$ adalah $BA$, yang merupakan matriks berbeda.',
      ),
      hint: L('Multiply each row of $A$ by each column of $B$.', 'Kalikan tiap baris $A$ dengan tiap kolom $B$.'),
    },
    {
      kind: 'quiz',
      id: 'q2',
      prompt: L(`Find $\\det${pm([1, 0, 2], [3, 1, 0], [0, 2, 1])}$.`, `Cari $\\det${pm([1, 0, 2], [3, 1, 0], [0, 2, 1])}$.`),
      options: ['13', '11', '1', '-13', '12'].map(plain),
      answer: 0,
      explain: L(
        'Expand along the first row: $1\\cdot(1\\cdot1-0\\cdot2)-0+2\\cdot(3\\cdot2-1\\cdot0)=1+12=13$.',
        'Ekspansikan sepanjang baris pertama: $1\\cdot(1\\cdot1-0\\cdot2)-0+2\\cdot(3\\cdot2-1\\cdot0)=1+12=13$.',
      ),
      hint: L('The middle entry of the first row is $0$, so that term vanishes.', 'Entri tengah baris pertama adalah $0$, jadi suku itu hilang.'),
    },
    {
      kind: 'quiz',
      id: 'q3',
      prompt: L(
        'The graph of a cubic crosses the x-axis at −2, 1 and 2, and the y-axis at 4. Which is p(x)?',
        'Grafik sebuah kubik memotong sumbu x di −2, 1, dan 2, dan sumbu y di 4. Manakah p(x)?',
      ),
      figure: { ...cubic(), caption: L('A cubic with the zeros −2, 1 and 2.', 'Sebuah kubik dengan nol −2, 1, dan 2.') },
      options: ['x^3-x^2-4x+4', 'x^3+x^2-4x-4', 'x^3-x^2-4x-4', '-x^3+x^2+4x-4', 'x^3-4x'].map((s) => plain(`p(x)=${s}`)),
      answer: 0,
      explain: L(
        '$(x-1)(x-2)(x+2)=(x-1)(x^2-4)=x^3-x^2-4x+4$, and $p(0)=4$ ✓. The option $-x^3+x^2+4x-4$ has the same zeros but the opposite sign, so $p(0)=-4$. The option $x^3-4x$ has a zero at $0$ instead of at $1$.',
        '$(x-1)(x-2)(x+2)=(x-1)(x^2-4)=x^3-x^2-4x+4$, dan $p(0)=4$ ✓. Pilihan $-x^3+x^2+4x-4$ bernol sama tetapi tandanya berlawanan, jadi $p(0)=-4$. Pilihan $x^3-4x$ bernol di $0$, bukan di $1$.',
      ),
      hint: L('Write the factors from the zeros, multiply, and check $p(0)$.', 'Tulis faktor dari nol-nolnya, kalikan, dan periksa $p(0)$.'),
    },
    {
      kind: 'quiz',
      id: 'q4',
      prompt: L('Find $\\log_3 54-\\log_3 2$.', 'Cari $\\log_3 54-\\log_3 2$.'),
      options: ['3', '2', '4', '27', '52'].map(plain),
      answer: 0,
      explain: L(
        '$\\log_3 54-\\log_3 2=\\log_3\\frac{54}{2}=\\log_3 27=3$. The value $52$ subtracts the numbers instead of dividing them.',
        '$\\log_3 54-\\log_3 2=\\log_3\\frac{54}{2}=\\log_3 27=3$. Nilai $52$ mengurangkan bilangannya, bukan membaginya.',
      ),
      hint: L('A difference of logarithms is the logarithm of a quotient.', 'Selisih logaritma adalah logaritma hasil bagi.'),
    },
    {
      kind: 'quiz',
      id: 'q5',
      prompt: L(
        'The graph shows a wave with its midline dashed. Which function is it ($x$ in degrees)?',
        'Grafik menunjukkan gelombang dengan garis tengah putus-putus. Fungsi manakah itu ($x$ dalam derajat)?',
      ),
      figure: { ...wave(), caption: L('A wave with top 2 at 0° and bottom −4 at 90°.', 'Gelombang dengan puncak 2 di 0° dan dasar −4 di 90°.') },
      options: ['3\\cos2x-1', '3\\sin2x-1', '3\\cos x-1', '2\\cos2x-1', '3\\cos2x+1'].map((s) => plain(`y=${s}`)),
      answer: 0,
      explain: L(
        'The top is $2$ and the bottom is $-4$, so the midline is $y=-1$ and the amplitude is $3$. One wave takes $180^{\\circ}$, so $b=2$. It starts at its top, which is a cosine. A sine would start on the midline.',
        'Puncaknya $2$ dan dasarnya $-4$, jadi garis tengahnya $y=-1$ dan amplitudonya $3$. Satu gelombang memerlukan $180^{\\circ}$, jadi $b=2$. Ia mulai dari puncaknya, yaitu kosinus. Sinus akan mulai dari garis tengah.',
      ),
      hint: L('Find the midline and the amplitude, then the length of one wave.', 'Cari garis tengah dan amplitudo, lalu panjang satu gelombang.'),
    },
    {
      kind: 'quiz',
      id: 'q6',
      prompt: L('Find $\\lim_{x\\to\\infty}\\frac{6x^2-x}{3x^2+2}$.', 'Cari $\\lim_{x\\to\\infty}\\frac{6x^2-x}{3x^2+2}$.'),
      options: ['2', '6', '3', '0', '\\frac13'].map(plain),
      answer: 0,
      explain: L(
        'Divide top and bottom by $x^2$: $\\frac{6-\\frac1x}{3+\\frac{2}{x^2}}\\to\\frac63=2$. Equal degrees give the ratio of the leading coefficients.',
        'Bagi pembilang dan penyebut dengan $x^2$: $\\frac{6-\\frac1x}{3+\\frac{2}{x^2}}\\to\\frac63=2$. Derajat yang sama memberi perbandingan koefisien utama.',
      ),
      hint: L('Divide by the highest power of $x$.', 'Bagi dengan pangkat tertinggi $x$.'),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L(
        'Let $\\mathbf{u}=(2,-1,2)$ and $\\mathbf{v}=(2,2,-1)$. Choose the TWO true statements.',
        'Misalkan $\\mathbf{u}=(2,-1,2)$ dan $\\mathbf{v}=(2,2,-1)$. Pilih DUA pernyataan yang benar.',
      ),
      options: [
        L('$|\\mathbf{u}|=3$', '$|\\mathbf{u}|=3$'),
        L('$\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular.', '$\\mathbf{u}$ dan $\\mathbf{v}$ tegak lurus.'),
        L('$|\\mathbf{u}+\\mathbf{v}|=6$', '$|\\mathbf{u}+\\mathbf{v}|=6$'),
        L('$\\mathbf{u}\\cdot\\mathbf{v}=4$', '$\\mathbf{u}\\cdot\\mathbf{v}=4$'),
        L('$\\mathbf{v}$ is a unit vector.', '$\\mathbf{v}$ adalah vektor satuan.'),
      ],
      answer: [0, 1],
      explain: L(
        '$|\\mathbf{u}|=\\sqrt{4+1+4}=3$ and $\\mathbf{u}\\cdot\\mathbf{v}=4-2-2=0$, so they are perpendicular. Then $\\mathbf{u}+\\mathbf{v}=(4,1,1)$ has length $\\sqrt{18}$, not $6$, and $|\\mathbf{v}|=3$, not $1$.',
        '$|\\mathbf{u}|=\\sqrt{4+1+4}=3$ dan $\\mathbf{u}\\cdot\\mathbf{v}=4-2-2=0$, jadi keduanya tegak lurus. Lalu $\\mathbf{u}+\\mathbf{v}=(4,1,1)$ berpanjang $\\sqrt{18}$, bukan $6$, dan $|\\mathbf{v}|=3$, bukan $1$.',
      ),
      hint: L('Compute the lengths and the dot product.', 'Hitung panjang dan hasil kali titiknya.'),
    },
    {
      kind: 'multi',
      id: 'mc2',
      prompt: L(
        'Consider the circle $x^2+y^2=25$. Choose the TWO true statements.',
        'Perhatikan lingkaran $x^2+y^2=25$. Pilih DUA pernyataan yang benar.',
      ),
      options: [
        L('The tangent at $(4,3)$ is $4x+3y=25$.', 'Garis singgung di $(4,3)$ adalah $4x+3y=25$.'),
        L('The line $y=5$ is tangent to the circle.', 'Garis $y=5$ menyinggung lingkaran.'),
        L('The line $x+y=7$ is tangent to the circle.', 'Garis $x+y=7$ menyinggung lingkaran.'),
        L('The tangent length from $(13,0)$ is $13$.', 'Panjang garis singgung dari $(13,0)$ adalah $13$.'),
      ],
      answer: [0, 1],
      explain: L(
        'For a circle at the origin the tangent at $(x_1,y_1)$ is $x_1x+y_1y=r^2$. The distance from the origin to $y=5$ is $5=r$. The line $x+y=7$ is at distance $\\frac{7}{\\sqrt2}\\approx4.95<5$, so it cuts the circle. The tangent length is $\\sqrt{169-25}=12$.',
        'Untuk lingkaran di titik asal garis singgung di $(x_1,y_1)$ adalah $x_1x+y_1y=r^2$. Jarak dari titik asal ke $y=5$ adalah $5=r$. Garis $x+y=7$ berjarak $\\frac{7}{\\sqrt2}\\approx4{,}95<5$, jadi memotong lingkaran. Panjang garis singgung adalah $\\sqrt{169-25}=12$.',
      ),
      hint: L('Compare the distance from the centre with the radius.', 'Bandingkan jarak dari pusat dengan jari-jari.'),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L(
        'The polynomial $p(x)=x^3+ax^2+bx-6$ has $p(1)=0$ and $p(-1)=-12$. Decide whether each statement is True or False.',
        'Polinomial $p(x)=x^3+ax^2+bx-6$ memiliki $p(1)=0$ dan $p(-1)=-12$. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      statements: [
        L('$a=0$', '$a=0$'),
        L('$b=5$', '$b=5$'),
        L('The remainder of $p(x)\\div(x-2)$ is $16$.', 'Sisa $p(x)\\div(x-2)$ adalah $16$.'),
        L('$x-1$ is a factor of $p(x)$.', '$x-1$ adalah faktor $p(x)$.'),
      ],
      answer: [true, true, false, true],
      explain: L(
        '$p(1)=a+b-5=0$ and $p(-1)=a-b-7=-12$, so $a+b=5$ and $a-b=-5$: $a=0$, $b=5$. Then $p(2)=8+10-6=12$, not $16$, and $p(1)=0$ makes $x-1$ a factor.',
        '$p(1)=a+b-5=0$ dan $p(-1)=a-b-7=-12$, jadi $a+b=5$ dan $a-b=-5$: $a=0$, $b=5$. Lalu $p(2)=8+10-6=12$, bukan $16$, dan $p(1)=0$ membuat $x-1$ faktor.',
      ),
      hint: L('Write the two conditions as equations in $a$ and $b$.', 'Tulis kedua syarat sebagai persamaan dalam $a$ dan $b$.'),
    },
    {
      kind: 'judge',
      id: 'j2',
      prompt: L(
        'The point $P(2,1)$ is rotated by $90^{\\circ}$ anticlockwise about the origin and then reflected in the $x$-axis. Decide whether each statement is True or False.',
        'Titik $P(2,1)$ diputar $90^{\\circ}$ berlawanan jarum jam terhadap titik asal lalu direfleksikan terhadap sumbu $x$. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      statements: [
        L('After the rotation the image is $(-1,2)$.', 'Setelah rotasi bayangannya $(-1,2)$.'),
        L('After both transformations the image is $(-1,-2)$.', 'Setelah kedua transformasi bayangannya $(-1,-2)$.'),
        L('The composition is the reflection in the line $y=x$.', 'Komposisinya adalah refleksi terhadap garis $y=x$.'),
        L('The matrix of the composition has determinant $-1$.', 'Matriks komposisinya berdeterminan $-1$.'),
      ],
      answer: [true, true, false, true],
      explain: L(
        'The rotation sends $(x,y)\\to(-y,x)$: $(2,1)\\to(-1,2)$. The reflection gives $(-1,-2)$. In general $(x,y)\\to(-y,-x)$, the reflection in $y=-x$, with matrix $\\begin{pmatrix}0&-1\\\\-1&0\\end{pmatrix}$ and determinant $-1$.',
        'Rotasi mengirim $(x,y)\\to(-y,x)$: $(2,1)\\to(-1,2)$. Refleksi memberi $(-1,-2)$. Secara umum $(x,y)\\to(-y,-x)$, refleksi terhadap $y=-x$, dengan matriks $\\begin{pmatrix}0&-1\\\\-1&0\\end{pmatrix}$ dan determinan $-1$.',
      ),
      hint: L('Follow the point step by step.', 'Ikuti titiknya langkah demi langkah.'),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'Find $\\lim_{x\\to0}\\frac{\\sqrt{x+16}-4}{x}$.',
        'Cari $\\lim_{x\\to0}\\frac{\\sqrt{x+16}-4}{x}$.',
      ),
      blanks: [{ answer: 1 / 8 }],
      hints: [
        L('Substituting gives $\\frac00$. Multiply by the conjugate.', 'Substitusi memberi $\\frac00$. Kalikan dengan sekawan.'),
        L('The top becomes $(x+16)-16=x$, which cancels.', 'Pembilang menjadi $(x+16)-16=x$, yang tercoret.'),
        L('You are left with $\\frac{1}{\\sqrt{x+16}+4}$.', 'Tersisa $\\frac{1}{\\sqrt{x+16}+4}$.'),
      ],
      explain: L('At $x=0$: $\\frac{1}{4+4}=\\frac18$.', 'Di $x=0$: $\\frac{1}{4+4}=\\frac18$.'),
      solution: ['\\frac{x}{x(\\sqrt{x+16}+4)}=\\frac{1}{\\sqrt{x+16}+4}', '\\to\\frac18'],
    },
    {
      kind: 'math',
      id: 'm2',
      prompt: L(
        'The point $T$ lies on $AB$ with $AT:TB=2:1$, where $A=(0,0,0)$ and $B=(6,3,9)$. Find the sum of the coordinates of $T$.',
        'Titik $T$ terletak pada $AB$ dengan $AT:TB=2:1$, dengan $A=(0,0,0)$ dan $B=(6,3,9)$. Cari jumlah koordinat $T$.',
      ),
      blanks: [{ answer: 12 }],
      hints: [
        L('$\\vec{AT}=\\frac{2}{3}\\vec{AB}$.', '$\\vec{AT}=\\frac{2}{3}\\vec{AB}$.'),
        L('$\\vec{AB}=(6,3,9)$.', '$\\vec{AB}=(6,3,9)$.'),
        L('$T=\\frac23(6,3,9)=(4,2,6)$.', '$T=\\frac23(6,3,9)=(4,2,6)$.'),
      ],
      explain: L('$T=(4,2,6)$ and $4+2+6=12$.', '$T=(4,2,6)$ dan $4+2+6=12$.'),
      solution: ['T=\\frac23(6,3,9)=(4,2,6)', '4+2+6=12'],
    },
  ],
}
