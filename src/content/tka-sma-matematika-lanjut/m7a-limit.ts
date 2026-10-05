import type { Submodule } from '../types'
import { L, dot, hole, plane } from './figs'

/** Module 7 — limits of algebraic and trigonometric functions. */

/** y = x + 2 with a hole at (2, 4) and the value f(2) = 1 elsewhere. */
const holeGraph = () =>
  plane(
    [
      { t: 'curve', f: 'x+2', from: -1.5, to: 5, color: 'a' },
      hole([2, 4], undefined, 'a'),
      dot([2, 1], undefined, 'result'),
    ],
    { x: [-2, 5], y: [-1, 8] },
  )

/** y = (x^2 - 9)/(x - 3), a line with a hole at (3, 6). */
const factorGraph = () =>
  plane(
    [
      { t: 'curve', f: 'x+3', from: -2, to: 5, color: 'a' },
      hole([3, 6], undefined, 'a'),
    ],
    { x: [-3, 6], y: [-1, 9] },
  )

/** y = sin(3x)/(5x), with a hole at (0, 3/5). */
const sincGraph = () =>
  plane(
    [
      { t: 'curve', f: 'sin(3*x)/(5*x)', from: -4, to: -0.05, color: 'a' },
      { t: 'curve', f: 'sin(3*x)/(5*x)', from: 0.05, to: 4, color: 'a' },
      hole([0, 0.6], undefined, 'a'),
    ],
    { x: [-4, 4], y: [-0.4, 1] },
  )

export const m7s1: Submodule = {
  id: 'tka-sml-m7-s1',
  title: L('Limits', 'Limit'),
  summary: L(
    'Limits from graphs and by substitution, algebraic limits with factoring, rationalising and infinity, and trigonometric limits.',
    'Limit dari grafik dan dengan substitusi, limit aljabar dengan pemfaktoran, merasionalkan, dan tak hingga, serta limit trigonometri.',
  ),
  lessons: [
    /* ------------------------------------------- L1 the idea of a limit */
    {
      id: 'tka-sml-m7-s1-l1',
      title: L('The Idea of a Limit', 'Gagasan Limit'),
      goal: L(
        'You can read a limit from a graph and from a piecewise function, use one-sided limits, and find a limit by substitution.',
        'Kamu bisa membaca limit dari grafik dan dari fungsi sepotong-sepotong, memakai limit sepihak, dan mencari limit dengan substitusi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Where the Graph Is Heading', 'Ayo Amati: Ke Mana Grafik Menuju'),
          body: L(
            'The **limit** $\\lim_{x\\to a}f(x)=L$ says: when $x$ gets closer and closer to $a$ (from both sides, but never equal to $a$), $f(x)$ gets closer and closer to $L$.\n\nThe limit asks where the graph is **heading**, not where it is **at** $x=a$. In the picture the graph follows the line $y=x+2$ but has a hollow circle at $(2,4)$, and the function takes the odd value $f(2)=1$ (red point). As $x\\to2$ the graph heads to $4$, so\n\n$$\\lim_{x\\to2}f(x)=4\\qquad\\text{while}\\qquad f(2)=1$$',
            '**Limit** $\\lim_{x\\to a}f(x)=L$ menyatakan: bila $x$ makin dekat ke $a$ (dari kedua sisi, tetapi tidak pernah sama dengan $a$), $f(x)$ makin dekat ke $L$.\n\nLimit menanyakan ke mana grafik **menuju**, bukan di mana ia **berada** di $x=a$. Pada gambar grafik mengikuti garis $y=x+2$ tetapi punya lingkaran kosong di $(2,4)$, dan fungsi bernilai aneh $f(2)=1$ (titik merah). Saat $x\\to2$ grafik menuju $4$, jadi\n\n$$\\lim_{x\\to2}f(x)=4\\qquad\\text{sedangkan}\\qquad f(2)=1$$',
          ),
          figure: {
            ...holeGraph(),
            caption: L('The graph heads to 4 as x → 2 (hollow circle), but f(2) = 1 (red point).', 'Grafik menuju 4 saat x → 2 (lingkaran kosong), tetapi f(2) = 1 (titik merah).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: One-Sided Limits', 'Contoh Bertahap: Limit Sepihak'),
          body: L(
            'The **left limit** $\\lim_{x\\to a^-}$ uses $x<a$ and the **right limit** $\\lim_{x\\to a^+}$ uses $x>a$. The limit exists exactly when both are **equal**.\n\nLet $g(x)=\\begin{cases}2x-1,&x<1\\\\5,&x=1\\\\4-x,&x>1\\end{cases}$\n\n1. Step 1: Left at $1$: $2(1)-1=1$.\n2. Step 2: Right at $1$: $4-1=3$.\n3. Step 3: $1\\ne3$, so $\\lim_{x\\to1}g(x)$ **does not exist**, although $g(1)=5$.\n4. Step 4: At $x=3$ only the last rule matters: $\\lim_{x\\to3}g(x)=4-3=1$.\n\nThe value at the point itself plays no role.',
            '**Limit kiri** $\\lim_{x\\to a^-}$ memakai $x<a$ dan **limit kanan** $\\lim_{x\\to a^+}$ memakai $x>a$. Limit ada tepat ketika keduanya **sama**.\n\nMisalkan $g(x)=\\begin{cases}2x-1,&x<1\\\\5,&x=1\\\\4-x,&x>1\\end{cases}$\n\n1. Langkah 1: Kiri di $1$: $2(1)-1=1$.\n2. Langkah 2: Kanan di $1$: $4-1=3$.\n3. Langkah 3: $1\\ne3$, jadi $\\lim_{x\\to1}g(x)$ **tidak ada**, walaupun $g(1)=5$.\n4. Langkah 4: Di $x=3$ hanya aturan terakhir yang berlaku: $\\lim_{x\\to3}g(x)=4-3=1$.\n\nNilai di titik itu sendiri tidak berperan.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Substitution and the Limit Laws', 'Contoh Bertahap: Substitusi dan Hukum Limit'),
          body: L(
            'For a polynomial, or any function that is **continuous** at $a$ (no break there), just substitute: $\\lim_{x\\to a}f(x)=f(a)$.\n\nThe limit laws let you split the work, as long as each part has a limit:\n\n- $\\lim(f+g)=\\lim f+\\lim g$ and $\\lim(fg)=\\lim f\\cdot\\lim g$;\n- $\\lim\\dfrac fg=\\dfrac{\\lim f}{\\lim g}$ **if** $\\lim g\\ne0$.\n\nExample: $\\lim_{x\\to3}(x^2-2x+1)=9-6+1=4$.\n\nIf substituting gives $\\frac00$ (a quotient where both parts vanish), the function is not continuous there: you **cannot** stop. That is the next lesson.',
            'Untuk polinomial, atau fungsi apa pun yang **kontinu** di $a$ (tidak putus di situ), cukup substitusi: $\\lim_{x\\to a}f(x)=f(a)$.\n\nHukum limit memungkinkan memecah pekerjaan, selama tiap bagian punya limit:\n\n- $\\lim(f+g)=\\lim f+\\lim g$ dan $\\lim(fg)=\\lim f\\cdot\\lim g$;\n- $\\lim\\dfrac fg=\\dfrac{\\lim f}{\\lim g}$ **jika** $\\lim g\\ne0$.\n\nContoh: $\\lim_{x\\to3}(x^2-2x+1)=9-6+1=4$.\n\nBila substitusi memberi $\\frac00$ (hasil bagi dengan kedua bagian lenyap), fungsi tidak kontinu di situ: kamu **tidak boleh** berhenti. Itu pelajaran berikutnya.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is $\\lim_{x\\to2}f(x)$ for the function whose graph is shown?',
            'Berapa $\\lim_{x\\to2}f(x)$ untuk fungsi yang grafiknya ditunjukkan?',
          ),
          figure: {
            ...holeGraph(),
            caption: L('A graph with a hollow circle at (2, 4) and a red point at (2, 1).', 'Grafik dengan lingkaran kosong di (2, 4) dan titik merah di (2, 1).'),
          },
          options: [
            L('$4$', '$4$'),
            L('$1$', '$1$'),
            L('$2$', '$2$'),
            L('$6$', '$6$'),
            L('It does not exist', 'Tidak ada'),
          ],
          answer: 0,
          explain: L(
            'From the left and from the right the graph heads to the height $4$ (the hollow circle), so the limit is $4$. The value $f(2)=1$ is a different thing and does not matter. The limit does exist, because both sides agree.',
            'Dari kiri maupun kanan grafik menuju tinggi $4$ (lingkaran kosong), jadi limitnya $4$. Nilai $f(2)=1$ hal yang berbeda dan tidak berpengaruh. Limitnya ada, karena kedua sisi sama.',
          ),
          hint: L(
            'Follow the graph from both sides towards $x=2$. Ignore the point at $x=2$ itself.',
            'Ikuti grafik dari kedua sisi menuju $x=2$. Abaikan titik di $x=2$ itu sendiri.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: substitute.', 'Coba bersama: substitusikan.'),
          template: '\\lim_{x\\to3}(x^2-2x+1)=3^2-2\\cdot3+1=___',
          blanks: ['4'],
          explain: L('$9-6+1=4$.', '$9-6+1=4$.'),
          hint: L('A polynomial has no break, so just put $x=3$.', 'Polinomial tidak putus, jadi cukup masukkan $x=3$.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('A limit can exist even when $f(a)$ is not defined.', 'Limit dapat ada walaupun $f(a)$ tidak terdefinisi.'),
            L('If the left and right limits are both $L$, then $\\lim_{x\\to a}f(x)=L$.', 'Jika limit kiri dan kanan keduanya $L$, maka $\\lim_{x\\to a}f(x)=L$.'),
            L('The limit at $a$ always equals $f(a)$.', 'Limit di $a$ selalu sama dengan $f(a)$.'),
            L('If $f(a)$ is defined, the limit at $a$ exists.', 'Jika $f(a)$ terdefinisi, limit di $a$ ada.'),
          ],
          answer: [0, 1],
          explain: L(
            'The limit looks at nearby points, not at $a$. It equals $f(a)$ only for a function that is continuous at $a$, and a jump can leave the two sides different.',
            'Limit melihat titik-titik di sekitar, bukan di $a$. Ia sama dengan $f(a)$ hanya untuk fungsi yang kontinu di $a$, dan loncatan dapat membuat kedua sisi berbeda.',
          ),
          hint: L('Think of the hollow circle picture.', 'Ingat gambar dengan lingkaran kosong.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $g(x)=2x-1$ for $x<1$, $g(1)=5$, and $g(x)=4-x$ for $x>1$. Decide whether each statement is True or False.',
            'Misalkan $g(x)=2x-1$ untuk $x<1$, $g(1)=5$, dan $g(x)=4-x$ untuk $x>1$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$\\lim_{x\\to1^-}g(x)=1$', '$\\lim_{x\\to1^-}g(x)=1$'),
            L('$\\lim_{x\\to1^+}g(x)=3$', '$\\lim_{x\\to1^+}g(x)=3$'),
            L('$\\lim_{x\\to1}g(x)$ exists.', '$\\lim_{x\\to1}g(x)$ ada.'),
            L('$g(1)=5$', '$g(1)=5$'),
          ],
          answer: [true, true, false, true],
          explain: L(
            'The two one-sided limits are $1$ and $3$, which differ, so the two-sided limit does not exist. The value $g(1)=5$ is given.',
            'Kedua limit sepihak adalah $1$ dan $3$, yang berbeda, jadi limit dua sisi tidak ada. Nilai $g(1)=5$ diberikan.',
          ),
          hint: L('Use the rule for $x<1$ on the left and the rule for $x>1$ on the right.', 'Pakai aturan untuk $x<1$ di kiri dan aturan untuk $x>1$ di kanan.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Let $f(x)=3x-1$ for $x<2$ and $f(x)=x+3$ for $x\\ge2$. Find $\\lim_{x\\to2}f(x)$.',
            'Misalkan $f(x)=3x-1$ untuk $x<2$ dan $f(x)=x+3$ untuk $x\\ge2$. Cari $\\lim_{x\\to2}f(x)$.',
          ),
          blanks: [{ answer: 5 }],
          hints: [
            L('Find the left limit and the right limit.', 'Cari limit kiri dan limit kanan.'),
            L('Left: $3\\cdot2-1=5$. Right: $2+3=5$.', 'Kiri: $3\\cdot2-1=5$. Kanan: $2+3=5$.'),
            L('They agree, so the limit is that value.', 'Keduanya sama, jadi limitnya nilai itu.'),
          ],
          explain: L('Both sides give $5$, so the limit is $5$.', 'Kedua sisi memberi $5$, jadi limitnya $5$.'),
          solution: ['\\lim_{x\\to2^-}=3\\cdot2-1=5 \\qquad \\lim_{x\\to2^+}=2+3=5', '5'],
        },
      ],
    },
    /* ------------------------------------------------ L2 algebraic limits */
    {
      id: 'tka-sml-m7-s1-l2',
      title: L('Algebraic Limits', 'Limit Aljabar'),
      goal: L(
        'You can find limits of the form 0/0 by factoring or rationalising, and limits at infinity of fractions and differences of roots.',
        'Kamu bisa mencari limit berbentuk 0/0 dengan pemfaktoran atau merasionalkan, dan limit di tak hingga dari pecahan dan selisih akar.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Hole You Can Fill', 'Ayo Amati: Lubang yang Dapat Ditutup'),
          body: L(
            'Substituting $x=3$ into $\\dfrac{x^2-9}{x-3}$ gives $\\dfrac00$, which tells us nothing. The function is not defined at $3$, but it is the same as a simpler function everywhere else:\n\n$$\\frac{x^2-9}{x-3}=\\frac{(x-3)(x+3)}{x-3}=x+3\\quad(x\\ne3)$$\n\nSo the graph is the line $y=x+3$ with a **hole** at $x=3$ (the hollow circle). The limit is the height of the hole:\n\n$$\\lim_{x\\to3}\\frac{x^2-9}{x-3}=\\lim_{x\\to3}(x+3)=6$$\n\nCancelling is allowed because $x\\to3$ means $x\\ne3$.',
            'Substitusi $x=3$ ke $\\dfrac{x^2-9}{x-3}$ memberi $\\dfrac00$, yang tidak memberi tahu apa-apa. Fungsi itu tidak terdefinisi di $3$, tetapi sama dengan fungsi yang lebih sederhana di tempat lain:\n\n$$\\frac{x^2-9}{x-3}=\\frac{(x-3)(x+3)}{x-3}=x+3\\quad(x\\ne3)$$\n\nJadi grafiknya garis $y=x+3$ dengan **lubang** di $x=3$ (lingkaran kosong). Limitnya adalah tinggi lubang itu:\n\n$$\\lim_{x\\to3}\\frac{x^2-9}{x-3}=\\lim_{x\\to3}(x+3)=6$$\n\nMencoret dibolehkan karena $x\\to3$ berarti $x\\ne3$.',
          ),
          figure: {
            ...factorGraph(),
            caption: L('The graph of (x² − 9)/(x − 3): the line y = x + 3 with a hole at (3, 6).', 'Grafik (x² − 9)/(x − 3): garis y = x + 3 dengan lubang di (3, 6).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Factoring and Rationalising', 'Contoh Bertahap: Memfaktorkan dan Merasionalkan'),
          body: L(
            'For a $\\frac00$ form, **factor** if you can. If a **square root** is involved, multiply top and bottom by the **conjugate** (the same terms with the opposite sign in between) so that $(a-b)(a+b)=a^2-b^2$ removes the root.\n\n$$\\lim_{x\\to0}\\frac{\\sqrt{x+4}-2}{x}$$\n\n1. Step 1: Substitution gives $\\frac00$.\n2. Step 2: Multiply by $\\dfrac{\\sqrt{x+4}+2}{\\sqrt{x+4}+2}$: the top becomes $(x+4)-4=x$.\n3. Step 3: $\\dfrac{x}{x(\\sqrt{x+4}+2)}=\\dfrac{1}{\\sqrt{x+4}+2}$.\n4. Step 4: Substitute $x=0$: $\\dfrac{1}{2+2}=\\dfrac14$.',
            'Untuk bentuk $\\frac00$, **faktorkan** bila bisa. Bila ada **akar kuadrat**, kalikan pembilang dan penyebut dengan **sekawan**nya (suku yang sama dengan tanda berlawanan di tengah) agar $(a-b)(a+b)=a^2-b^2$ menghilangkan akar.\n\n$$\\lim_{x\\to0}\\frac{\\sqrt{x+4}-2}{x}$$\n\n1. Langkah 1: Substitusi memberi $\\frac00$.\n2. Langkah 2: Kalikan dengan $\\dfrac{\\sqrt{x+4}+2}{\\sqrt{x+4}+2}$: pembilang menjadi $(x+4)-4=x$.\n3. Langkah 3: $\\dfrac{x}{x(\\sqrt{x+4}+2)}=\\dfrac{1}{\\sqrt{x+4}+2}$.\n4. Langkah 4: Substitusi $x=0$: $\\dfrac{1}{2+2}=\\dfrac14$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Limits at Infinity', 'Contoh Bertahap: Limit di Tak Hingga'),
          body: L(
            'For $x\\to\\infty$ in a fraction of polynomials, **divide top and bottom by the highest power** of $x$:\n\n$$\\lim_{x\\to\\infty}\\frac{3x^2+x}{2x^2-5}=\\lim_{x\\to\\infty}\\frac{3+\\frac1x}{2-\\frac{5}{x^2}}=\\frac32$$\n\nThe rule: equal degrees give the ratio of leading coefficients; a smaller degree on top gives $0$; a larger degree on top gives no limit.\n\nFor a **difference of roots**, use the conjugate:\n\n$$\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+4x}-x\\right)=\\lim\\frac{4x}{\\sqrt{x^2+4x}+x}=\\lim\\frac{4}{\\sqrt{1+\\frac4x}+1}=\\frac{4}{2}=2$$',
            'Untuk $x\\to\\infty$ pada pecahan polinomial, **bagi pembilang dan penyebut dengan pangkat tertinggi** $x$:\n\n$$\\lim_{x\\to\\infty}\\frac{3x^2+x}{2x^2-5}=\\lim_{x\\to\\infty}\\frac{3+\\frac1x}{2-\\frac{5}{x^2}}=\\frac32$$\n\nAturannya: derajat sama memberi perbandingan koefisien utama; derajat pembilang lebih kecil memberi $0$; derajat pembilang lebih besar tidak punya limit.\n\nUntuk **selisih akar**, pakai sekawan:\n\n$$\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+4x}-x\\right)=\\lim\\frac{4x}{\\sqrt{x^2+4x}+x}=\\lim\\frac{4}{\\sqrt{1+\\frac4x}+1}=\\frac{4}{2}=2$$',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is $\\lim_{x\\to3}\\frac{x^2-9}{x-3}$, for the graph shown?',
            'Berapa $\\lim_{x\\to3}\\frac{x^2-9}{x-3}$, untuk grafik yang ditunjukkan?',
          ),
          figure: {
            ...factorGraph(),
            caption: L('A line with a hole at x = 3.', 'Garis dengan lubang di x = 3.'),
          },
          options: ['6', '0', '3', '9', '\\infty'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'Factor: $\\frac{(x-3)(x+3)}{x-3}=x+3\\to6$. The substitution $\\frac00$ is not the answer ($0$), and the hole sits at height $6$, as the picture shows.',
            'Faktorkan: $\\frac{(x-3)(x+3)}{x-3}=x+3\\to6$. Substitusi $\\frac00$ bukan jawabannya ($0$), dan lubang berada di tinggi $6$, seperti pada gambar.',
          ),
          hint: L('Factor the top and cancel $x-3$, or read the height of the hole.', 'Faktorkan pembilang dan coret $x-3$, atau baca tinggi lubang.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: factor and cancel.', 'Coba bersama: faktorkan dan coret.'),
          template: '\\frac{x^2-9}{x-3}=\\frac{(x-3)(x+3)}{x-3}=x+___\\ \\to\\ ___',
          blanks: ['3', '6'],
          explain: L('After cancelling we get $x+3$, which tends to $6$.', 'Setelah dicoret didapat $x+3$, yang menuju $6$.'),
          hint: L('Factor $x^2-9$ as a difference of squares.', 'Faktorkan $x^2-9$ sebagai selisih kuadrat.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$\\lim_{x\\to2}\\frac{x^2-4}{x-2}=4$', '$\\lim_{x\\to2}\\frac{x^2-4}{x-2}=4$'),
            L('$\\lim_{x\\to\\infty}\\frac{3x^2+x}{2x^2-5}=\\frac32$', '$\\lim_{x\\to\\infty}\\frac{3x^2+x}{2x^2-5}=\\frac32$'),
            L('$\\lim_{x\\to0}\\frac{\\sqrt{x+9}-3}{x}=0$', '$\\lim_{x\\to0}\\frac{\\sqrt{x+9}-3}{x}=0$'),
            L('$\\lim_{x\\to\\infty}\\frac{5x+1}{x^2+1}=5$', '$\\lim_{x\\to\\infty}\\frac{5x+1}{x^2+1}=5$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\frac{(x-2)(x+2)}{x-2}\\to4$ and the ratio of the leading coefficients is $\\frac32$. The third limit is $\\frac16$ by the conjugate. In the fourth, the larger degree is in the denominator, so the limit is $0$.',
            '$\\frac{(x-2)(x+2)}{x-2}\\to4$ dan perbandingan koefisien utama adalah $\\frac32$. Limit ketiga adalah $\\frac16$ dengan sekawan. Pada yang keempat, derajat yang lebih besar ada di penyebut, jadi limitnya $0$.',
          ),
          hint: L('For infinity, compare the degrees of top and bottom.', 'Untuk tak hingga, bandingkan derajat pembilang dan penyebut.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Consider $\\lim_{x\\to0}\\frac{\\sqrt{x+4}-2}{x}$. Decide whether each statement is True or False.',
            'Perhatikan $\\lim_{x\\to0}\\frac{\\sqrt{x+4}-2}{x}$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('Substituting $x=0$ gives $\\frac00$.', 'Substitusi $x=0$ memberi $\\frac00$.'),
            L('Multiplying by the conjugate gives $\\dfrac{1}{\\sqrt{x+4}+2}$.', 'Mengalikan dengan sekawan memberi $\\dfrac{1}{\\sqrt{x+4}+2}$.'),
            L('The limit is $\\frac14$.', 'Limitnya $\\frac14$.'),
            L('The limit is $0$.', 'Limitnya $0$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'The numerator becomes $x$, which cancels. Then $\\frac{1}{2+2}=\\frac14$. The $0$ comes from the top alone, which is not allowed in a $\\frac00$ form.',
            'Pembilang menjadi $x$, yang tercoret. Lalu $\\frac{1}{2+2}=\\frac14$. Nilai $0$ berasal dari pembilang saja, yang tidak dibolehkan pada bentuk $\\frac00$.',
          ),
          hint: L('Multiply top and bottom by $\\sqrt{x+4}+2$.', 'Kalikan pembilang dan penyebut dengan $\\sqrt{x+4}+2$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find $\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+4x}-x\\right)$.',
            'Cari $\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+4x}-x\\right)$.',
          ),
          blanks: [{ answer: 2 }],
          hints: [
            L('Multiply by the conjugate $\\sqrt{x^2+4x}+x$ over itself.', 'Kalikan dengan sekawan $\\sqrt{x^2+4x}+x$ per dirinya sendiri.'),
            L('The top becomes $(x^2+4x)-x^2=4x$.', 'Pembilang menjadi $(x^2+4x)-x^2=4x$.'),
            L('Divide by $x$: $\\frac{4}{\\sqrt{1+4/x}+1}\\to\\frac42$.', 'Bagi dengan $x$: $\\frac{4}{\\sqrt{1+4/x}+1}\\to\\frac42$.'),
          ],
          explain: L('The limit is $\\frac{4}{1+1}=2$.', 'Limitnya $\\frac{4}{1+1}=2$.'),
          solution: ['\\frac{4x}{\\sqrt{x^2+4x}+x}=\\frac{4}{\\sqrt{1+4/x}+1}', '\\to\\frac{4}{2}=2'],
        },
      ],
    },
    /* ------------------------------------------------- L3 trigonometric limits */
    {
      id: 'tka-sml-m7-s1-l3',
      title: L('Trigonometric Limits', 'Limit Trigonometri'),
      goal: L(
        'You can use $\\lim\\frac{\\sin x}{x}=1$ and its consequences to find limits with sine, tangent and cosine.',
        'Kamu bisa memakai $\\lim\\frac{\\sin x}{x}=1$ dan akibatnya untuk mencari limit dengan sinus, tangen, dan kosinus.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Key Limit', 'Ayo Amati: Limit Kunci'),
          body: L(
            'With $x$ in **radians**,\n\n$$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$$\n\nFor a small angle the sine is almost the angle itself. The picture shows $y=\\dfrac{\\sin3x}{5x}$: it is not defined at $x=0$, but the graph heads to the height $\\frac35$ there. This is because $\\frac{\\sin3x}{5x}=\\frac35\\cdot\\frac{\\sin3x}{3x}$, and $\\frac{\\sin3x}{3x}\\to1$ (the same limit, with $3x$ in place of $x$).\n\nSo $\\lim_{x\\to0}\\dfrac{\\sin3x}{5x}=\\dfrac35$.',
            'Dengan $x$ dalam **radian**,\n\n$$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$$\n\nUntuk sudut kecil sinus hampir sama dengan sudutnya. Gambar menunjukkan $y=\\dfrac{\\sin3x}{5x}$: ia tidak terdefinisi di $x=0$, tetapi grafik menuju tinggi $\\frac35$ di situ. Ini karena $\\frac{\\sin3x}{5x}=\\frac35\\cdot\\frac{\\sin3x}{3x}$, dan $\\frac{\\sin3x}{3x}\\to1$ (limit yang sama, dengan $3x$ menggantikan $x$).\n\nJadi $\\lim_{x\\to0}\\dfrac{\\sin3x}{5x}=\\dfrac35$.',
          ),
          figure: {
            ...sincGraph(),
            caption: L('The graph of sin 3x / 5x heads to 3/5 = 0.6 at x = 0.', 'Grafik sin 3x / 5x menuju 3/5 = 0,6 di x = 0.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: More Forms', 'Contoh Bertahap: Bentuk Lain'),
          body: L(
            'Rewrite each limit so that the key limit appears:\n\n- $\\lim_{x\\to0}\\frac{\\sin ax}{bx}=\\frac ab$ and $\\lim_{x\\to0}\\frac{\\tan ax}{bx}=\\frac ab$.\n- $\\lim_{x\\to0}\\frac{1-\\cos x}{x^2}=\\frac12$, because $1-\\cos x=2\\sin^2\\frac x2$.\n\nExamples:\n\n1. Step 1: $\\lim_{x\\to0}\\frac{\\tan2x}{x}=2$.\n2. Step 2: $\\lim_{x\\to0}\\frac{1-\\cos2x}{x^2}$: use $1-\\cos2x=2\\sin^2x$, so the limit is $2\\left(\\frac{\\sin x}{x}\\right)^2\\to2$.\n3. Step 3: $\\lim_{x\\to0}\\frac{\\sin5x}{\\sin2x}=\\frac{5x}{2x}=\\frac52$.',
            'Tulis ulang tiap limit agar limit kunci muncul:\n\n- $\\lim_{x\\to0}\\frac{\\sin ax}{bx}=\\frac ab$ dan $\\lim_{x\\to0}\\frac{\\tan ax}{bx}=\\frac ab$.\n- $\\lim_{x\\to0}\\frac{1-\\cos x}{x^2}=\\frac12$, karena $1-\\cos x=2\\sin^2\\frac x2$.\n\nContoh:\n\n1. Langkah 1: $\\lim_{x\\to0}\\frac{\\tan2x}{x}=2$.\n2. Langkah 2: $\\lim_{x\\to0}\\frac{1-\\cos2x}{x^2}$: pakai $1-\\cos2x=2\\sin^2x$, jadi limitnya $2\\left(\\frac{\\sin x}{x}\\right)^2\\to2$.\n3. Langkah 3: $\\lim_{x\\to0}\\frac{\\sin5x}{\\sin2x}=\\frac{5x}{2x}=\\frac52$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: When x Does Not Go to 0', 'Contoh Bertahap: Bila x Tidak Menuju 0'),
          body: L(
            'If $x\\to a$ with $a\\ne0$, set $u=x-a$ so that $u\\to0$.\n\n$$\\lim_{x\\to\\pi}\\frac{\\sin(x-\\pi)}{2(\\pi-x)\\cos3x}$$\n\n1. Step 1: Let $u=x-\\pi$, so $\\pi-x=-u$ and $u\\to0$.\n2. Step 2: $\\dfrac{\\sin u}{2(-u)}=-\\dfrac12\\cdot\\dfrac{\\sin u}{u}\\to-\\dfrac12$.\n3. Step 3: The other factor is continuous: $\\dfrac{1}{\\cos3x}\\to\\dfrac{1}{\\cos3\\pi}=\\dfrac1{-1}=-1$.\n4. Step 4: Multiply: $-\\dfrac12\\cdot(-1)=\\dfrac12$.\n\nWatch the sign: $\\pi-x$ is the opposite of $x-\\pi$.',
            'Jika $x\\to a$ dengan $a\\ne0$, misalkan $u=x-a$ sehingga $u\\to0$.\n\n$$\\lim_{x\\to\\pi}\\frac{\\sin(x-\\pi)}{2(\\pi-x)\\cos3x}$$\n\n1. Langkah 1: Misalkan $u=x-\\pi$, jadi $\\pi-x=-u$ dan $u\\to0$.\n2. Langkah 2: $\\dfrac{\\sin u}{2(-u)}=-\\dfrac12\\cdot\\dfrac{\\sin u}{u}\\to-\\dfrac12$.\n3. Langkah 3: Faktor lain kontinu: $\\dfrac{1}{\\cos3x}\\to\\dfrac{1}{\\cos3\\pi}=\\dfrac1{-1}=-1$.\n4. Langkah 4: Kalikan: $-\\dfrac12\\cdot(-1)=\\dfrac12$.\n\nPerhatikan tanda: $\\pi-x$ berlawanan dengan $x-\\pi$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What is $\\lim_{x\\to0}\\frac{\\sin3x}{5x}$, for the graph shown?',
            'Berapa $\\lim_{x\\to0}\\frac{\\sin3x}{5x}$, untuk grafik yang ditunjukkan?',
          ),
          figure: {
            ...sincGraph(),
            caption: L('The graph of sin 3x / 5x.', 'Grafik sin 3x / 5x.'),
          },
          options: ['\\frac{3}{5}', '\\frac{5}{3}', '1', '0', '3'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            '$\\frac{\\sin3x}{5x}=\\frac35\\cdot\\frac{\\sin3x}{3x}\\to\\frac35\\cdot1$. The graph heads to $0.6=\\frac35$. The value $\\frac53$ is the inverted ratio.',
            '$\\frac{\\sin3x}{5x}=\\frac35\\cdot\\frac{\\sin3x}{3x}\\to\\frac35\\cdot1$. Grafik menuju $0{,}6=\\frac35$. Nilai $\\frac53$ adalah perbandingan yang terbalik.',
          ),
          hint: L('Write $5x$ as $\\frac53\\cdot3x$ so that $\\frac{\\sin3x}{3x}$ appears.', 'Tulis $5x$ sebagai $\\frac53\\cdot3x$ agar $\\frac{\\sin3x}{3x}$ muncul.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: rewrite the limit.', 'Coba bersama: tulis ulang limitnya.'),
          template: '\\frac{\\sin3x}{5x}=\\frac{___}{5}\\cdot\\frac{\\sin3x}{3x}\\ \\to\\ \\frac{___}{5}',
          blanks: ['3', '3'],
          explain: L('$\\frac{\\sin3x}{5x}=\\frac35\\cdot\\frac{\\sin3x}{3x}$, and the last factor tends to $1$.', '$\\frac{\\sin3x}{5x}=\\frac35\\cdot\\frac{\\sin3x}{3x}$, dan faktor terakhir menuju $1$.'),
          hint: L('Multiply and divide by $3$.', 'Kalikan dan bagi dengan $3$.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$\\lim_{x\\to0}\\frac{\\sin2x}{x}=2$', '$\\lim_{x\\to0}\\frac{\\sin2x}{x}=2$'),
            L('$\\lim_{x\\to0}\\frac{\\tan x}{x}=1$', '$\\lim_{x\\to0}\\frac{\\tan x}{x}=1$'),
            L('$\\lim_{x\\to0}\\frac{\\sin x}{x}=0$', '$\\lim_{x\\to0}\\frac{\\sin x}{x}=0$'),
            L('$\\lim_{x\\to0}\\frac{1-\\cos x}{x}=1$', '$\\lim_{x\\to0}\\frac{1-\\cos x}{x}=1$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\frac{\\sin2x}{x}=2\\cdot\\frac{\\sin2x}{2x}\\to2$ and $\\frac{\\tan x}{x}=\\frac{\\sin x}{x}\\cdot\\frac{1}{\\cos x}\\to1$. The third limit is $1$, not $0$. In the fourth, $\\frac{1-\\cos x}{x}=\\frac{1-\\cos x}{x^2}\\cdot x\\to\\frac12\\cdot0=0$.',
            '$\\frac{\\sin2x}{x}=2\\cdot\\frac{\\sin2x}{2x}\\to2$ dan $\\frac{\\tan x}{x}=\\frac{\\sin x}{x}\\cdot\\frac{1}{\\cos x}\\to1$. Limit ketiga adalah $1$, bukan $0$. Pada yang keempat, $\\frac{1-\\cos x}{x}=\\frac{1-\\cos x}{x^2}\\cdot x\\to\\frac12\\cdot0=0$.',
          ),
          hint: L('Rewrite each so that $\\frac{\\sin u}{u}$ appears.', 'Tulis ulang tiap limit agar $\\frac{\\sin u}{u}$ muncul.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Consider $\\lim_{x\\to\\pi}\\frac{\\sin(x-\\pi)}{2(\\pi-x)\\cos3x}$. Decide whether each statement is True or False.',
            'Perhatikan $\\lim_{x\\to\\pi}\\frac{\\sin(x-\\pi)}{2(\\pi-x)\\cos3x}$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$\\dfrac{\\sin(x-\\pi)}{\\pi-x}\\to-1$', '$\\dfrac{\\sin(x-\\pi)}{\\pi-x}\\to-1$'),
            L('$\\cos3\\pi=-1$', '$\\cos3\\pi=-1$'),
            L('The limit is $\\frac12$.', 'Limitnya $\\frac12$.'),
            L('The limit is $-\\frac12$.', 'Limitnya $-\\frac12$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'With $u=x-\\pi$: $\\frac{\\sin u}{-u}\\to-1$. Then $\\frac{-1}{2\\cos3\\pi}=\\frac{-1}{2(-1)}=\\frac12$.',
            'Dengan $u=x-\\pi$: $\\frac{\\sin u}{-u}\\to-1$. Lalu $\\frac{-1}{2\\cos3\\pi}=\\frac{-1}{2(-1)}=\\frac12$.',
          ),
          hint: L('Set $u=x-\\pi$ and watch the signs.', 'Misalkan $u=x-\\pi$ dan perhatikan tandanya.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find $\\lim_{x\\to0}\\frac{1-\\cos2x}{x^2}$.',
            'Cari $\\lim_{x\\to0}\\frac{1-\\cos2x}{x^2}$.',
          ),
          blanks: [{ answer: 2 }],
          hints: [
            L('Use the identity $1-\\cos2x=2\\sin^2x$.', 'Pakai identitas $1-\\cos2x=2\\sin^2x$.'),
            L('The limit becomes $2\\left(\\dfrac{\\sin x}{x}\\right)^2$.', 'Limitnya menjadi $2\\left(\\dfrac{\\sin x}{x}\\right)^2$.'),
            L('$\\dfrac{\\sin x}{x}\\to1$.', '$\\dfrac{\\sin x}{x}\\to1$.'),
          ],
          explain: L('$2\\cdot1^2=2$.', '$2\\cdot1^2=2$.'),
          solution: ['\\frac{1-\\cos2x}{x^2}=2\\left(\\frac{\\sin x}{x}\\right)^2', '\\to2\\cdot1^2=2'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m7-s1-p',
    runtime: 'math',
    title: L('Limits at Work', 'Limit dalam Pemakaian'),
    brief: L(
      'Find limits by factoring, by the conjugate, at infinity and with sine.',
      'Cari limit dengan pemfaktoran, dengan sekawan, di tak hingga, dan dengan sinus.',
    ),
    requirements: [
      L('Recognise a $\\frac00$ form and remove it.', 'Mengenali bentuk $\\frac00$ dan menghilangkannya.'),
      L('Use $\\lim\\frac{\\sin x}{x}=1$.', 'Memakai $\\lim\\frac{\\sin x}{x}=1$.'),
    ],
    hints: [
      L('Try substituting first.', 'Coba substitusi dulu.'),
      L('Factor, or multiply by the conjugate.', 'Faktorkan, atau kalikan dengan sekawan.'),
      L('For $x\\to\\infty$, divide by the highest power.', 'Untuk $x\\to\\infty$, bagi dengan pangkat tertinggi.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Find $\\lim_{x\\to3}\\frac{x^2-x-6}{x-3}$.', 'Cari $\\lim_{x\\to3}\\frac{x^2-x-6}{x-3}$.'),
        blanks: [{ answer: 5 }],
        solution: ['\\frac{(x-3)(x+2)}{x-3}=x+2', '\\to5'],
      },
      {
        prompt: L('Find $\\lim_{x\\to0}\\frac{\\sqrt{x+25}-5}{x}$.', 'Cari $\\lim_{x\\to0}\\frac{\\sqrt{x+25}-5}{x}$.'),
        blanks: [{ answer: 1 / 10 }],
        solution: ['\\frac{x}{x(\\sqrt{x+25}+5)}=\\frac{1}{\\sqrt{x+25}+5}', '\\to\\frac{1}{10}'],
      },
      {
        prompt: L('Find $\\lim_{x\\to\\infty}\\frac{4x^2-x}{2x^2+3}$.', 'Cari $\\lim_{x\\to\\infty}\\frac{4x^2-x}{2x^2+3}$.'),
        blanks: [{ answer: 2 }],
        solution: ['\\frac{4-\\frac1x}{2+\\frac3{x^2}}', '\\to\\frac42=2'],
      },
      {
        prompt: L('Find $\\lim_{x\\to0}\\frac{\\sin5x}{2x}$.', 'Cari $\\lim_{x\\to0}\\frac{\\sin5x}{2x}$.'),
        blanks: [{ answer: 5 / 2 }],
        solution: ['\\frac52\\cdot\\frac{\\sin5x}{5x}', '\\to\\frac52'],
      },
      {
        prompt: L('Find $\\lim_{x\\to0}\\frac{\\tan4x}{\\sin2x}$.', 'Cari $\\lim_{x\\to0}\\frac{\\tan4x}{\\sin2x}$.'),
        blanks: [{ answer: 2 }],
        solution: ['\\frac{\\tan4x}{x}\\to4 \\quad \\frac{\\sin2x}{x}\\to2', '\\frac42=2'],
      },
    ],
  },
}
