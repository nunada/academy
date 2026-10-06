import type { Lesson } from '../types'
import { L, dot, plane, pm } from './figs'

/** Practice test 1: twelve questions across the matrix, easy to hard. */

const rational = () =>
  plane(
    [
      { t: 'curve', f: '(x-1)/(x-2)', from: -4, to: 1.7, color: 'a' },
      { t: 'curve', f: '(x-1)/(x-2)', from: 2.3, to: 8, color: 'a' },
      { t: 'vline', x: 2, color: 'muted', dashed: true },
      { t: 'hline', y: 1, color: 'muted', dashed: true },
      dot([1, 0], undefined, 'result'),
      dot([0, 0.5], undefined, 'result'),
    ],
    { x: [-4, 8], y: [-6, 8] },
  )

const plain = (s: string) => L(`$${s}$`, `$${s}$`)

export const test1: Lesson = {
  id: 'tka-sml-m8-s2-l1',
  title: L('Practice Test 1', 'Simulasi TKA Tingkat Lanjut 1'),
  goal: L(
    'You can finish a practice test with a mix of question forms and levels, using the plan and the checks of the earlier lessons.',
    'Kamu bisa menyelesaikan simulasi dengan berbagai bentuk dan tingkat soal, memakai rencana dan pemeriksaan dari pelajaran sebelumnya.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: How Practice Test 1 Works', 'Ayo Amati: Cara Kerja Simulasi 1'),
      body: L(
        'This test has 12 questions in the three forms: one-answer, choose-all and True/False. They cover matrices, polynomials, functions, vectors, circles, transformations and limits.\n\n- Plan your time before you start, and use a timer if you can.\n- Answer the easy questions first and mark the long ones.\n- In a choose-all or True/False question, test **every** option or statement.\n- Check by substitution when you can.\n\nYou can open the explanation after each answer, so use them to learn from your mistakes.',
        'Tes ini terdiri dari 12 soal dalam tiga bentuk: satu jawaban, pilih-semua, dan Benar/Salah. Soal-soalnya mencakup matriks, polinomial, fungsi, vektor, lingkaran, transformasi, dan limit.\n\n- Rencanakan waktumu sebelum mulai, dan pakai pengatur waktu bila bisa.\n- Jawab soal yang mudah lebih dulu dan tandai yang panjang.\n- Pada soal pilih-semua atau Benar/Salah, uji **setiap** pilihan atau pernyataan.\n- Periksa dengan substitusi bila bisa.\n\nKamu dapat membuka penjelasan setelah tiap jawaban, jadi pakailah untuk belajar dari kesalahanmu.',
      ),
    },
    /* 1 — matrices, understanding */
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(`Find $\\det${pm([3, 2], [-1, 4])}$.`, `Cari $\\det${pm([3, 2], [-1, 4])}$.`),
      options: ['14', '10', '-14', '12', '2'].map(plain),
      answer: 0,
      explain: L(
        '$ad-bc=3\\cdot4-2\\cdot(-1)=12+2=14$. The value $10$ forgets that subtracting $-2$ adds, and $12$ is only $ad$.',
        '$ad-bc=3\\cdot4-2\\cdot(-1)=12+2=14$. Nilai $10$ lupa bahwa mengurangkan $-2$ berarti menambah, dan $12$ hanya $ad$.',
      ),
      hint: L('Use $ad-bc$ and watch the minus sign.', 'Pakai $ad-bc$ dan perhatikan tanda minus.'),
    },
    /* 2 — matrices, inverse */
    {
      kind: 'quiz',
      id: 'q2',
      prompt: L(`Which matrix is the inverse of $${pm([2, 3], [1, 2])}$?`, `Matriks manakah invers dari $${pm([2, 3], [1, 2])}$?`),
      options: [pm([2, -3], [-1, 2]), pm([2, 3], [1, 2]), pm([-2, 3], [1, -2]), pm([2, -3], [1, 2]), pm([1, -3], [-1, 2])].map(plain),
      answer: 0,
      explain: L(
        'The determinant is $4-3=1$. Swap the diagonal and negate the other two entries. One of the options is the matrix itself, and the others change the wrong signs.',
        'Determinannya $4-3=1$. Tukar diagonal dan negatifkan dua entri lainnya. Salah satu pilihan adalah matriks itu sendiri, dan yang lain mengubah tanda yang salah.',
      ),
      hint: L('Swap $a$ and $d$, change the signs of $b$ and $c$, divide by the determinant.', 'Tukar $a$ dan $d$, ubah tanda $b$ dan $c$, bagi dengan determinan.'),
    },
    /* 3 — polynomials, remainder */
    {
      kind: 'quiz',
      id: 'q3',
      prompt: L(
        'What is the remainder when $p(x)=x^3-2x^2+x-5$ is divided by $x-2$?',
        'Berapa sisa bila $p(x)=x^3-2x^2+x-5$ dibagi $x-2$?',
      ),
      options: ['-3', '3', '5', '-5', '1'].map(plain),
      answer: 0,
      explain: L(
        '$p(2)=8-8+2-5=-3$. The values $3$ and $-5$ come from a slip in a sign, and $-5$ is only the constant term.',
        '$p(2)=8-8+2-5=-3$. Nilai $3$ dan $-5$ berasal dari salah tanda, dan $-5$ hanya suku konstan.',
      ),
      hint: L('The remainder on division by $x-2$ is $p(2)$.', 'Sisa pembagian oleh $x-2$ adalah $p(2)$.'),
    },
    /* 4 — functions, graph of a rational function */
    {
      kind: 'quiz',
      id: 'q4',
      prompt: L(
        'The graph has the vertical asymptote x = 2, the horizontal asymptote y = 1, and passes through (1, 0) and (0, 1/2). Which function is it?',
        'Grafik memiliki asimtot tegak x = 2, asimtot datar y = 1, dan melalui (1, 0) serta (0, 1/2). Fungsi manakah itu?',
      ),
      figure: { ...rational(), caption: L('A rational graph with two asymptotes.', 'Grafik rasional dengan dua asimtot.') },
      options: ['\\frac{x-1}{x-2}', '\\frac{x-2}{x-1}', '\\frac{1}{x-2}', '\\frac{x+1}{x-2}', '\\frac{x}{x-2}'].map((s) => plain(`f(x)=${s}`)),
      answer: 0,
      explain: L(
        'The denominator $x-2$ gives the vertical asymptote $x=2$, and equal leading coefficients give $y=1$. The zero at $x=1$ needs the numerator $x-1$. The option $\\frac{x-2}{x-1}$ has its asymptote at $x=1$, and $\\frac{x}{x-2}$ has its zero at $0$.',
        'Penyebut $x-2$ memberi asimtot tegak $x=2$, dan koefisien utama yang sama memberi $y=1$. Nol di $x=1$ memerlukan pembilang $x-1$. Pilihan $\\frac{x-2}{x-1}$ berasimtot di $x=1$, dan $\\frac{x}{x-2}$ bernol di $0$.',
      ),
      hint: L('Use the asymptotes first, then the zero.', 'Pakai asimtot dulu, lalu nolnya.'),
    },
    /* 5 — trigonometric function */
    {
      kind: 'quiz',
      id: 'q5',
      prompt: L(
        'What are the maximum value and the period of $y=3\\cos2x-1$ ($x$ in degrees)?',
        'Berapa nilai maksimum dan periode $y=3\\cos2x-1$ ($x$ dalam derajat)?',
      ),
      options: [
        L('Maximum $2$, period $180^{\\circ}$', 'Maksimum $2$, periode $180^{\\circ}$'),
        L('Maximum $3$, period $180^{\\circ}$', 'Maksimum $3$, periode $180^{\\circ}$'),
        L('Maximum $2$, period $360^{\\circ}$', 'Maksimum $2$, periode $360^{\\circ}$'),
        L('Maximum $3$, period $360^{\\circ}$', 'Maksimum $3$, periode $360^{\\circ}$'),
        L('Maximum $2$, period $90^{\\circ}$', 'Maksimum $2$, periode $90^{\\circ}$'),
      ],
      answer: 0,
      explain: L(
        'The maximum is the midline plus the amplitude: $-1+3=2$. The period is $\\frac{360^{\\circ}}{2}=180^{\\circ}$. The maximum $3$ forgets the shift of $-1$.',
        'Maksimum adalah garis tengah ditambah amplitudo: $-1+3=2$. Periodenya $\\frac{360^{\\circ}}{2}=180^{\\circ}$. Maksimum $3$ melupakan pergeseran $-1$.',
      ),
      hint: L('Maximum $=d+|a|$ and period $=\\frac{360^{\\circ}}{b}$.', 'Maksimum $=d+|a|$ dan periode $=\\frac{360^{\\circ}}{b}$.'),
    },
    /* 6 — limit */
    {
      kind: 'quiz',
      id: 'q6',
      prompt: L('Find $\\lim_{x\\to2}\\frac{x^2+x-6}{x-2}$.', 'Cari $\\lim_{x\\to2}\\frac{x^2+x-6}{x-2}$.'),
      options: ['5', '0', '-5', '2', '\\infty'].map(plain),
      answer: 0,
      explain: L(
        'Substituting gives $\\frac00$. Factor: $\\frac{(x+3)(x-2)}{x-2}=x+3\\to5$. The answer is not $0$ although the top is $0$ at $x=2$.',
        'Substitusi memberi $\\frac00$. Faktorkan: $\\frac{(x+3)(x-2)}{x-2}=x+3\\to5$. Jawabannya bukan $0$ walaupun pembilang $0$ di $x=2$.',
      ),
      hint: L('Factor the top and cancel.', 'Faktorkan pembilang dan coret.'),
    },
    /* 7 — vectors, choose all */
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L(
        'Let $\\mathbf{u}=(2,1,-1)$, $\\mathbf{v}=(1,v_1,3)$ and $\\mathbf{w}=(1,w_1,w_2)$ with $\\mathbf{w}=\\mathbf{u}-\\mathbf{v}$. Choose ALL possible pairs $(v_1,w_1)$.',
        'Misalkan $\\mathbf{u}=(2,1,-1)$, $\\mathbf{v}=(1,v_1,3)$ dan $\\mathbf{w}=(1,w_1,w_2)$ dengan $\\mathbf{w}=\\mathbf{u}-\\mathbf{v}$. Pilih SEMUA pasangan $(v_1,w_1)$ yang mungkin.',
      ),
      options: [
        L('$v_1=0$ and $w_1=1$', '$v_1=0$ dan $w_1=1$'),
        L('$v_1=2$ and $w_1=-1$', '$v_1=2$ dan $w_1=-1$'),
        L('$v_1=1$ and $w_1=1$', '$v_1=1$ dan $w_1=1$'),
        L('$v_1=3$ and $w_1=-2$', '$v_1=3$ dan $w_1=-2$'),
        L('$v_1=-1$ and $w_1=1$', '$v_1=-1$ dan $w_1=1$'),
      ],
      answer: [0, 1, 3],
      explain: L(
        'The second components give $w_1=1-v_1$. So $v_1=0\\to1$, $v_1=2\\to-1$ and $v_1=3\\to-2$ fit. For $v_1=1$ it would be $0$, and for $v_1=-1$ it would be $2$.',
        'Komponen kedua memberi $w_1=1-v_1$. Jadi $v_1=0\\to1$, $v_1=2\\to-1$, dan $v_1=3\\to-2$ cocok. Untuk $v_1=1$ nilainya $0$, dan untuk $v_1=-1$ nilainya $2$.',
      ),
      hint: L('Write $w_1$ in terms of $v_1$, then test each pair.', 'Tulis $w_1$ dalam $v_1$, lalu uji tiap pasangan.'),
    },
    /* 8 — circles, choose all */
    {
      kind: 'multi',
      id: 'mc2',
      prompt: L(
        'A circle has the equation $x^2+y^2-6x+2y-15=0$. Choose the TWO true statements.',
        'Sebuah lingkaran berpersamaan $x^2+y^2-6x+2y-15=0$. Pilih DUA pernyataan yang benar.',
      ),
      options: [
        L('The centre is $(3,-1)$.', 'Pusatnya $(3,-1)$.'),
        L('The radius is $5$.', 'Jari-jarinya $5$.'),
        L('The centre is $(-3,1)$.', 'Pusatnya $(-3,1)$.'),
        L('The radius is $25$.', 'Jari-jarinya $25$.'),
        L('The point $(0,0)$ lies on the circle.', 'Titik $(0,0)$ terletak pada lingkaran.'),
      ],
      answer: [0, 1],
      explain: L(
        'Completing the squares: $(x-3)^2+(y+1)^2=15+9+1=25$, so the centre is $(3,-1)$ and $r=5$. The value $25$ is $r^2$. The origin gives $-15\\ne0$.',
        'Melengkapkan kuadrat: $(x-3)^2+(y+1)^2=15+9+1=25$, jadi pusatnya $(3,-1)$ dan $r=5$. Nilai $25$ adalah $r^2$. Titik asal memberi $-15\\ne0$.',
      ),
      hint: L('Complete the square in $x$ and in $y$.', 'Lengkapkan kuadrat dalam $x$ dan $y$.'),
    },
    /* 9 — exponential model, True/False */
    {
      kind: 'judge',
      id: 'j1',
      prompt: L(
        'A pond plant covers $A(w)=4\\cdot3^{w}$ m$^2$ after $w$ weeks. Decide whether each statement is True or False.',
        'Sebuah tanaman kolam menutupi $A(w)=4\\cdot3^{w}$ m$^2$ setelah $w$ minggu. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      statements: [
        L('At the start it covers $4$ m$^2$.', 'Pada awalnya ia menutupi $4$ m$^2$.'),
        L('After $2$ weeks it covers $36$ m$^2$.', 'Setelah $2$ minggu ia menutupi $36$ m$^2$.'),
        L('After $3$ weeks it covers $36$ m$^2$.', 'Setelah $3$ minggu ia menutupi $36$ m$^2$.'),
        L('The model cannot be right for a very large $w$, because the pond is finite.', 'Model tidak mungkin benar untuk $w$ yang sangat besar, karena kolamnya terbatas.'),
      ],
      answer: [true, true, false, true],
      explain: L(
        '$A(0)=4$, $A(2)=4\\cdot9=36$ and $A(3)=4\\cdot27=108$, not $36$. A model of growth fails when it predicts more than the pond can hold.',
        '$A(0)=4$, $A(2)=4\\cdot9=36$ dan $A(3)=4\\cdot27=108$, bukan $36$. Model pertumbuhan gagal bila meramalkan lebih dari yang dapat ditampung kolam.',
      ),
      hint: L('Evaluate $A$ at $0$, $2$ and $3$.', 'Hitung $A$ di $0$, $2$, dan $3$.'),
    },
    /* 10 — limits, True/False */
    {
      kind: 'judge',
      id: 'j2',
      prompt: L(
        'Let $f(x)=x^2-1$ for $x<2$, $f(2)=3$, and $f(x)=7-x$ for $x>2$. Decide whether each statement is True or False.',
        'Misalkan $f(x)=x^2-1$ untuk $x<2$, $f(2)=3$, dan $f(x)=7-x$ untuk $x>2$. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      statements: [
        L('$\\lim_{x\\to2^-}f(x)=3$', '$\\lim_{x\\to2^-}f(x)=3$'),
        L('$\\lim_{x\\to2^+}f(x)=5$', '$\\lim_{x\\to2^+}f(x)=5$'),
        L('$\\lim_{x\\to2}f(x)$ exists.', '$\\lim_{x\\to2}f(x)$ ada.'),
        L('$\\lim_{x\\to4}f(x)=3$', '$\\lim_{x\\to4}f(x)=3$'),
      ],
      answer: [true, true, false, true],
      explain: L(
        'Left: $2^2-1=3$. Right: $7-2=5$. They differ, so the two-sided limit does not exist, even though $f(2)=3$. At $x=4$ only $7-x$ matters: $3$.',
        'Kiri: $2^2-1=3$. Kanan: $7-2=5$. Keduanya berbeda, jadi limit dua sisi tidak ada, walaupun $f(2)=3$. Di $x=4$ hanya $7-x$ yang berlaku: $3$.',
      ),
      hint: L('Use the rule for $x<2$ on the left and the rule for $x>2$ on the right.', 'Pakai aturan untuk $x<2$ di kiri dan aturan untuk $x>2$ di kanan.'),
    },
    /* 11 — matrices, typed */
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        `Let $A=${pm([1, 2], [0, 1])}$ and $B=${pm([3, 1], [-1, 2])}$. Find $\\det(AB)$.`,
        `Misalkan $A=${pm([1, 2], [0, 1])}$ dan $B=${pm([3, 1], [-1, 2])}$. Cari $\\det(AB)$.`,
      ),
      blanks: [{ answer: 7 }],
      hints: [
        L('$\\det(AB)=\\det A\\cdot\\det B$.', '$\\det(AB)=\\det A\\cdot\\det B$.'),
        L('$\\det A=1$.', '$\\det A=1$.'),
        L('$\\det B=3\\cdot2-1\\cdot(-1)=7$.', '$\\det B=3\\cdot2-1\\cdot(-1)=7$.'),
      ],
      explain: L('$1\\cdot7=7$.', '$1\\cdot7=7$.'),
      solution: ['\\det A=1 \\quad \\det B=6+1=7', '\\det(AB)=7'],
    },
    /* 12 — sectors, typed */
    {
      kind: 'math',
      id: 'm2',
      prompt: L(
        'A sector has radius $12$ and central angle $150^{\\circ}$. Its arc length is $k\\pi$. Find $k$.',
        'Sebuah juring berjari-jari $12$ dan sudut pusat $150^{\\circ}$. Panjang busurnya $k\\pi$. Tentukan $k$.',
      ),
      blanks: [{ label: 'k =', answer: 10 }],
      hints: [
        L('The arc is the fraction $\\frac{150}{360}$ of the circumference.', 'Busur adalah bagian $\\frac{150}{360}$ dari keliling.'),
        L('The circumference is $2\\pi\\cdot12=24\\pi$.', 'Kelilingnya $2\\pi\\cdot12=24\\pi$.'),
        L('$\\frac{150}{360}\\cdot24\\pi$.', '$\\frac{150}{360}\\cdot24\\pi$.'),
      ],
      explain: L('$\\frac{5}{12}\\cdot24\\pi=10\\pi$.', '$\\frac{5}{12}\\cdot24\\pi=10\\pi$.'),
      solution: ['\\frac{150}{360}\\cdot2\\pi\\cdot12=\\frac{5}{12}\\cdot24\\pi', '=10\\pi'],
    },
  ],
}
