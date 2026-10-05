import type { Submodule } from '../types'
import { L, dot, plane } from './figs'

/** Module 2 — polynomials: operations, factoring and the remainder. */

const cubic = (f: string, from: number, to: number, x: [number, number], y: [number, number], dots: [number, number][]) =>
  plane([{ t: 'curve', f, from, to, color: 'a' }, ...dots.map((p) => dot(p, undefined, 'result'))], { x, y })

export const m2s1: Submodule = {
  id: 'tka-sml-m2-s1',
  title: L('Polynomials', 'Polinomial'),
  summary: L(
    'Add, multiply and divide polynomials of degree at most 4, factor them with the factor theorem, and find remainders.',
    'Menjumlah, mengalikan, dan membagi polinomial berderajat paling tinggi 4, memfaktorkannya dengan teorema faktor, dan mencari sisa.',
  ),
  lessons: [
    /* ------------------------------------------------------ L1 operations */
    {
      id: 'tka-sml-m2-s1-l1',
      title: L('Polynomial Operations', 'Operasi Polinomial'),
      goal: L(
        'You can add, subtract, multiply and divide polynomials, and find the degree of a result.',
        'Kamu bisa menjumlah, mengurangi, mengalikan, dan membagi polinomial, serta menentukan derajat hasilnya.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Degree and the Shape of a Graph', 'Ayo Amati: Derajat dan Bentuk Grafik'),
          body: L(
            'A **polynomial** is a sum of terms $a_nx^n+\\ldots+a_1x+a_0$ with real coefficients. The highest power $n$ with $a_n\\ne0$ is the **degree**.\n\nThe picture shows $p(x)=x^3-2x^2-x+2$, of degree $3$:\n\n- it meets the $x$-axis at most $3$ times (here at $-1$, $1$ and $2$);\n- it meets the $y$-axis at the constant term, $p(0)=2$;\n- for a very large $x$ the highest power decides: this graph goes up on the right and down on the left.\n\nA polynomial of degree $4$ meets the $x$-axis at most $4$ times.',
            '**Polinomial** adalah jumlah suku $a_nx^n+\\ldots+a_1x+a_0$ dengan koefisien real. Pangkat tertinggi $n$ dengan $a_n\\ne0$ disebut **derajat**.\n\nGambar menunjukkan $p(x)=x^3-2x^2-x+2$, berderajat $3$:\n\n- ia memotong sumbu $x$ paling banyak $3$ kali (di sini di $-1$, $1$, dan $2$);\n- ia memotong sumbu $y$ di suku konstan, $p(0)=2$;\n- untuk $x$ yang sangat besar pangkat tertinggi menentukan: grafik ini naik di kanan dan turun di kiri.\n\nPolinomial berderajat $4$ memotong sumbu $x$ paling banyak $4$ kali.',
          ),
          figure: {
            ...cubic('x^3-2*x^2-x+2', -1.7, 2.7, [-3, 4], [-5, 7], [[-1, 0], [1, 0], [2, 0], [0, 2]]),
            caption: L('The graph of x³ − 2x² − x + 2. The red points are its three zeros and its y-intercept.', 'Grafik x³ − 2x² − x + 2. Titik merah adalah tiga nolnya dan titik potong sumbu y.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Add, Subtract and Multiply', 'Contoh Bertahap: Jumlah, Selisih, dan Hasil Kali'),
          body: L(
            'Let $P=2x^2+3x-1$ and $Q=x^2-x+4$.\n\n1. Step 1: Add like terms: $P+Q=3x^2+2x+3$.\n2. Step 2: Subtract, changing every sign of $Q$: $P-Q=x^2+4x-5$.\n3. Step 3: Multiply every term of $P$ by every term of $Q$:\n$$PQ=2x^4-2x^3+8x^2+3x^3-3x^2+12x-x^2+x-4=2x^4+x^3+4x^2+13x-4$$\n\nDegrees: $\\deg(PQ)=\\deg P+\\deg Q=4$, but $\\deg(P+Q)\\le\\max(\\deg P,\\deg Q)$ and can be lower.',
            'Misalkan $P=2x^2+3x-1$ dan $Q=x^2-x+4$.\n\n1. Langkah 1: Jumlahkan suku sejenis: $P+Q=3x^2+2x+3$.\n2. Langkah 2: Kurangkan, ubah setiap tanda $Q$: $P-Q=x^2+4x-5$.\n3. Langkah 3: Kalikan setiap suku $P$ dengan setiap suku $Q$:\n$$PQ=2x^4-2x^3+8x^2+3x^3-3x^2+12x-x^2+x-4=2x^4+x^3+4x^2+13x-4$$\n\nDerajat: $\\deg(PQ)=\\deg P+\\deg Q=4$, tetapi $\\deg(P+Q)\\le\\max(\\deg P,\\deg Q)$ dan bisa lebih rendah.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Dividing by x − a (Horner)', 'Contoh Bertahap: Membagi dengan x − a (Horner)'),
          body: L(
            'To divide by $x-a$, write the coefficients, bring down the first, and repeat: **multiply by $a$, add to the next**.\n\nDivide $x^3+2x^2-5x+1$ by $x-1$ ($a=1$):\n\n| | $x^3$ | $x^2$ | $x$ | const |\n|---|---|---|---|---|\n| coefficients | $1$ | $2$ | $-5$ | $1$ |\n| times $a=1$ | | $1$ | $3$ | $-2$ |\n| sums | $1$ | $3$ | $-2$ | $-1$ |\n\n1. Step 1: Bring down $1$. Then $1\\cdot1=1$, and $2+1=3$.\n2. Step 2: $3\\cdot1=3$, and $-5+3=-2$. Then $-2\\cdot1=-2$, and $1-2=-1$.\n3. Step 3: The last number is the **remainder** $-1$; the others are the quotient $x^2+3x-2$.\n\nSo $x^3+2x^2-5x+1=(x-1)(x^2+3x-2)-1$.',
            'Untuk membagi dengan $x-a$, tulis koefisien-koefisiennya, turunkan yang pertama, lalu ulangi: **kalikan dengan $a$, jumlahkan ke yang berikutnya**.\n\nBagi $x^3+2x^2-5x+1$ dengan $x-1$ ($a=1$):\n\n| | $x^3$ | $x^2$ | $x$ | konstanta |\n|---|---|---|---|---|\n| koefisien | $1$ | $2$ | $-5$ | $1$ |\n| kali $a=1$ | | $1$ | $3$ | $-2$ |\n| jumlah | $1$ | $3$ | $-2$ | $-1$ |\n\n1. Langkah 1: Turunkan $1$. Lalu $1\\cdot1=1$, dan $2+1=3$.\n2. Langkah 2: $3\\cdot1=3$, dan $-5+3=-2$. Lalu $-2\\cdot1=-2$, dan $1-2=-1$.\n3. Langkah 3: Bilangan terakhir adalah **sisa** $-1$; yang lain adalah hasil bagi $x^2+3x-2$.\n\nJadi $x^3+2x^2-5x+1=(x-1)(x^2+3x-2)-1$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph of a cubic p crosses the x-axis at −1, 1 and 2, and crosses the y-axis at 2. Which is p(x)?',
            'Grafik kubik p memotong sumbu x di −1, 1, dan 2, dan memotong sumbu y di 2. Manakah p(x)?',
          ),
          figure: {
            ...cubic('x^3-2*x^2-x+2', -1.7, 2.7, [-3, 4], [-5, 7], []),
            caption: L('The graph of a cubic.', 'Grafik sebuah kubik.'),
          },
          options: [
            'x^3-2x^2-x+2',
            'x^3+2x^2-x-2',
            '-x^3+2x^2+x-2',
            'x^3-2x^2+x-2',
            'x^3-x^2-2x+2',
          ].map((s) => L(`$p(x)=${s}$`, `$p(x)=${s}$`)),
          answer: 0,
          explain: L(
            'Test the points. $p(0)=2$ rules out the options whose constant term is $-2$, even $-x^3+2x^2+x-2$ which has the same zeros but is turned upside down. For the correct one, $p(1)=1-2-1+2=0$, $p(2)=8-8-2+2=0$ and $p(-1)=-1-2+1+2=0$. The option $x^3-x^2-2x+2$ has $p(2)=2\\ne0$.',
            'Uji titik-titiknya. $p(0)=2$ menyingkirkan pilihan yang suku konstannya $-2$, termasuk $-x^3+2x^2+x-2$ yang nolnya sama tetapi terbalik. Untuk yang benar, $p(1)=1-2-1+2=0$, $p(2)=8-8-2+2=0$, dan $p(-1)=-1-2+1+2=0$. Pilihan $x^3-x^2-2x+2$ punya $p(2)=2\\ne0$.',
          ),
          hint: L(
            'Check the constant term against the $y$-intercept, then substitute $x=1$.',
            'Cocokkan suku konstan dengan titik potong sumbu $y$, lalu substitusikan $x=1$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: multiply out.', 'Coba bersama: kalikan.'),
          template: '(x+2)(x^2-x+3)=x^3+___x^2+___x+___',
          blanks: ['1', '1', '6'],
          explain: L(
            '$x\\cdot(x^2-x+3)=x^3-x^2+3x$ and $2\\cdot(x^2-x+3)=2x^2-2x+6$. Add: $x^3+x^2+x+6$.',
            '$x\\cdot(x^2-x+3)=x^3-x^2+3x$ dan $2\\cdot(x^2-x+3)=2x^2-2x+6$. Jumlahkan: $x^3+x^2+x+6$.',
          ),
          hint: L(
            'Multiply the whole bracket by $x$, then by $2$, and add like terms.',
            'Kalikan seluruh kurung dengan $x$, lalu dengan $2$, dan jumlahkan suku sejenis.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The product of a degree-2 and a degree-3 polynomial has degree 5.', 'Hasil kali polinomial berderajat 2 dan berderajat 3 berderajat 5.'),
            L('The degree of a sum is never more than the larger of the two degrees.', 'Derajat suatu jumlah tidak pernah lebih dari derajat yang lebih besar.'),
            L('The degree of a sum is always the sum of the degrees.', 'Derajat suatu jumlah selalu sama dengan jumlah derajatnya.'),
            L('A polynomial of degree 3 always meets the x-axis exactly 3 times.', 'Polinomial berderajat 3 selalu memotong sumbu x tepat 3 kali.'),
          ],
          answer: [0, 1],
          explain: L(
            'Degrees add for a product: $2+3=5$. A sum cannot have a higher degree than its terms. A cubic meets the axis at most $3$ times, and it can meet it only once.',
            'Derajat dijumlahkan pada hasil kali: $2+3=5$. Jumlah tidak mungkin berderajat lebih tinggi dari sukunya. Kubik memotong sumbu paling banyak $3$ kali, dan bisa hanya sekali.',
          ),
          hint: L('Think of the highest power in each result.', 'Pikirkan pangkat tertinggi pada tiap hasil.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $P=2x^2+3x-1$ and $Q=x^2-x+4$. Decide whether each statement is True or False.',
            'Misalkan $P=2x^2+3x-1$ dan $Q=x^2-x+4$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$P+Q=3x^2+2x+3$', '$P+Q=3x^2+2x+3$'),
            L('$P-Q=x^2+4x-5$', '$P-Q=x^2+4x-5$'),
            L('$PQ$ has degree $4$.', '$PQ$ berderajat $4$.'),
            L('The constant term of $PQ$ is $3$.', 'Suku konstan $PQ$ adalah $3$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'Adding and subtracting works term by term. The product has degree $2+2=4$, and its constant term is $(-1)\\cdot4=-4$, not $3$.',
            'Menjumlah dan mengurang dilakukan suku demi suku. Hasil kalinya berderajat $2+2=4$, dan suku konstannya $(-1)\\cdot4=-4$, bukan $3$.',
          ),
          hint: L('The constant term of a product is the product of the constant terms.', 'Suku konstan hasil kali adalah hasil kali suku-suku konstan.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find the coefficient of $x^2$ in $(x^2+2x+3)(2x^2-x+1)$.',
            'Cari koefisien $x^2$ dalam $(x^2+2x+3)(2x^2-x+1)$.',
          ),
          blanks: [{ answer: 5 }],
          hints: [
            L('Only some pairs of terms give an $x^2$.', 'Hanya beberapa pasangan suku yang menghasilkan $x^2$.'),
            L('The pairs are $x^2\\cdot1$, $2x\\cdot(-x)$ and $3\\cdot2x^2$.', 'Pasangannya adalah $x^2\\cdot1$, $2x\\cdot(-x)$, dan $3\\cdot2x^2$.'),
            L('Add $1$, $-2$ and $6$.', 'Jumlahkan $1$, $-2$, dan $6$.'),
          ],
          explain: L('$1-2+6=5$. The full product is $2x^4+3x^3+5x^2-x+3$.', '$1-2+6=5$. Hasil kali lengkapnya $2x^4+3x^3+5x^2-x+3$.'),
          solution: ['x^2\\cdot1+2x\\cdot(-x)+3\\cdot2x^2', '=1-2+6=5'],
        },
      ],
    },
    /* ------------------------------------------------- L2 factoring, roots */
    {
      id: 'tka-sml-m2-s1-l2',
      title: L('Factoring and Roots', 'Pemfaktoran dan Akar'),
      goal: L(
        'You can use the factor theorem to factor a polynomial of degree 3 or 4, and read zeros and their multiplicity from a graph.',
        'Kamu bisa memakai teorema faktor untuk memfaktorkan polinomial berderajat 3 atau 4, dan membaca nol serta kebergandaannya dari grafik.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Zeros and Factors', 'Ayo Amati: Nol dan Faktor'),
          body: L(
            'The **factor theorem**: $x-a$ is a factor of $p(x)$ exactly when $p(a)=0$, that is, when the graph meets the $x$-axis at $x=a$.\n\nThe picture shows $p(x)=x^3-3x^2-x+3$. It meets the axis at $x=-1$, $x=1$ and $x=3$, so\n\n$$p(x)=(x+1)(x-1)(x-3)$$\n\nCheck $p(1)=1-3-1+3=0$ ✓. Reading the zeros from a graph gives the factors at once.',
            '**Teorema faktor**: $x-a$ adalah faktor $p(x)$ tepat ketika $p(a)=0$, yaitu ketika grafik memotong sumbu $x$ di $x=a$.\n\nGambar menunjukkan $p(x)=x^3-3x^2-x+3$. Ia memotong sumbu di $x=-1$, $x=1$, dan $x=3$, jadi\n\n$$p(x)=(x+1)(x-1)(x-3)$$\n\nPeriksa $p(1)=1-3-1+3=0$ ✓. Membaca nol dari grafik langsung memberi faktornya.',
          ),
          figure: {
            ...cubic('x^3-3*x^2-x+3', -1.6, 3.5, [-3, 5], [-6, 8], [[-1, 0], [1, 0], [3, 0]]),
            caption: L('The graph of x³ − 3x² − x + 3 with its zeros marked.', 'Grafik x³ − 3x² − x + 3 dengan nol-nolnya ditandai.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Finding a First Factor', 'Contoh Bertahap: Mencari Faktor Pertama'),
          body: L(
            'When no graph is given, **try the divisors of the constant term**: a whole-number zero divides it.\n\nFactor $p(x)=x^3-3x^2-x+3$. The divisors of $3$ are $\\pm1,\\pm3$.\n\n1. Step 1: $p(1)=1-3-1+3=0$, so $x-1$ is a factor.\n2. Step 2: Divide with Horner: coefficients $1,-3,-1,3$ give $1,-2,-3$ and remainder $0$. The quotient is $x^2-2x-3$.\n3. Step 3: Factor it: $x^2-2x-3=(x-3)(x+1)$.\n4. Step 4: $p(x)=(x-1)(x-3)(x+1)$.\n\nFor a quartic such as $x^4-5x^2+4$, treat $x^2$ as one unknown: $(x^2-1)(x^2-4)=(x-1)(x+1)(x-2)(x+2)$.',
            'Bila tidak ada grafik, **coba pembagi suku konstan**: nol bilangan bulat membagi suku konstan itu.\n\nFaktorkan $p(x)=x^3-3x^2-x+3$. Pembagi $3$ adalah $\\pm1,\\pm3$.\n\n1. Langkah 1: $p(1)=1-3-1+3=0$, jadi $x-1$ faktor.\n2. Langkah 2: Bagi dengan Horner: koefisien $1,-3,-1,3$ memberi $1,-2,-3$ dan sisa $0$. Hasil baginya $x^2-2x-3$.\n3. Langkah 3: Faktorkan: $x^2-2x-3=(x-3)(x+1)$.\n4. Langkah 4: $p(x)=(x-1)(x-3)(x+1)$.\n\nUntuk kuartik seperti $x^4-5x^2+4$, anggap $x^2$ sebagai satu bilangan: $(x^2-1)(x^2-4)=(x-1)(x+1)(x-2)(x+2)$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Repeated Zeros and Sums of Roots', 'Awas, Jebakan!: Nol Berulang dan Jumlah Akar'),
          body: L(
            'A factor that appears twice, like $(x-1)^2$, gives a **double zero**: the graph **touches** the axis and turns back instead of crossing.\n\nFor $ax^3+bx^2+cx+d=0$ with roots $x_1,x_2,x_3$:\n\n$$x_1+x_2+x_3=-\\frac{b}{a}\\qquad x_1x_2x_3=-\\frac{d}{a}$$\n\nFor $x^3-3x^2-x+3$: the roots $-1,1,3$ add to $3=-\\frac{-3}{1}$ ✓ and multiply to $-3=-\\frac{3}{1}$ ✓. These shortcuts answer "the sum of the roots" without finding them.',
            'Faktor yang muncul dua kali, seperti $(x-1)^2$, memberi **nol ganda**: grafik **menyinggung** sumbu dan berbalik, bukan memotong.\n\nUntuk $ax^3+bx^2+cx+d=0$ dengan akar $x_1,x_2,x_3$:\n\n$$x_1+x_2+x_3=-\\frac{b}{a}\\qquad x_1x_2x_3=-\\frac{d}{a}$$\n\nUntuk $x^3-3x^2-x+3$: akar $-1,1,3$ berjumlah $3=-\\frac{-3}{1}$ ✓ dan berhasil kali $-3=-\\frac{3}{1}$ ✓. Jalan pintas ini menjawab "jumlah akar" tanpa mencari akarnya.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph of a cubic crosses the x-axis at −2, touches it at 1, and meets the y-axis at 2. Which is p(x)?',
            'Grafik sebuah kubik memotong sumbu x di −2, menyinggungnya di 1, dan memotong sumbu y di 2. Manakah p(x)?',
          ),
          figure: {
            ...cubic('x^3-3*x+2', -2.3, 2.2, [-3, 3], [-4, 8], []),
            caption: L('A cubic that crosses the axis once and touches it once.', 'Sebuah kubik yang memotong sumbu sekali dan menyinggungnya sekali.'),
          },
          options: ['(x+2)(x-1)^2', '(x-2)(x+1)^2', '(x+2)(x-1)', '(x+2)^2(x-1)', '(x-2)^2(x+1)'].map((s) => L(`$p(x)=${s}$`, `$p(x)=${s}$`)),
          answer: 0,
          explain: L(
            'A zero at $-2$ gives the factor $(x+2)$. A touching point at $1$ gives the squared factor $(x-1)^2$. Check the $y$-intercept: $(0+2)(0-1)^2=2$ ✓. Swapping the squared factor gives $(x+2)^2(x-1)$, whose $y$-intercept is $-4$.',
            'Nol di $-2$ memberi faktor $(x+2)$. Titik singgung di $1$ memberi faktor kuadrat $(x-1)^2$. Periksa titik potong sumbu $y$: $(0+2)(0-1)^2=2$ ✓. Menukar faktor kuadratnya memberi $(x+2)^2(x-1)$, yang titik potong sumbu $y$-nya $-4$.',
          ),
          hint: L(
            'A crossing gives a single factor and a touching point a squared factor. Check the $y$-intercept.',
            'Titik potong memberi faktor tunggal dan titik singgung memberi faktor kuadrat. Periksa titik potong sumbu $y$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: factor $x^3-3x^2-x+3$.', 'Coba bersama: faktorkan $x^3-3x^2-x+3$.'),
          template: 'p(1)=1-3-1+3=___ \\qquad p(x)=(x-1)(x^2-2x-___)',
          blanks: ['0', '3'],
          explain: L(
            '$p(1)=0$, so $x-1$ is a factor. Horner gives the quotient $x^2-2x-3$.',
            '$p(1)=0$, jadi $x-1$ adalah faktor. Horner memberi hasil bagi $x^2-2x-3$.',
          ),
          hint: L(
            'Substitute $x=1$. Then divide by $x-1$.',
            'Substitusikan $x=1$. Lalu bagi dengan $x-1$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L(
            'Choose ALL the roots of $x^3-3x^2-x+3=0$.',
            'Pilih SEMUA akar dari $x^3-3x^2-x+3=0$.',
          ),
          options: ['x=-1', 'x=1', 'x=3', 'x=-3', 'x=0'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: [0, 1, 2],
          explain: L(
            'The polynomial factors as $(x+1)(x-1)(x-3)$. The values $-3$ and $0$ give $p(-3)=-48$ and $p(0)=3$.',
            'Polinomial itu difaktorkan menjadi $(x+1)(x-1)(x-3)$. Nilai $-3$ dan $0$ memberi $p(-3)=-48$ dan $p(0)=3$.',
          ),
          hint: L('Substitute each value, or factor first.', 'Substitusikan tiap nilai, atau faktorkan dulu.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $p(x)=x^4-5x^2+4$. Decide whether each statement is True or False.',
            'Misalkan $p(x)=x^4-5x^2+4$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$x=2$ is a root.', '$x=2$ adalah akar.'),
            L('$(x-1)(x+1)$ is a factor.', '$(x-1)(x+1)$ adalah faktor.'),
            L('$p$ has exactly two real roots.', '$p$ mempunyai tepat dua akar real.'),
            L('The sum of the roots is $0$.', 'Jumlah akarnya adalah $0$.'),
          ],
          answer: [true, true, false, true],
          explain: L(
            '$p(x)=(x^2-1)(x^2-4)$ has the four roots $\\pm1$ and $\\pm2$. Their sum is $0$. It does not have exactly two roots.',
            '$p(x)=(x^2-1)(x^2-4)$ mempunyai empat akar $\\pm1$ dan $\\pm2$. Jumlahnya $0$. Akarnya bukan tepat dua.',
          ),
          hint: L('Factor $x^4-5x^2+4$ like a quadratic in $x^2$.', 'Faktorkan $x^4-5x^2+4$ seperti kuadrat dalam $x^2$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The polynomial $x^3-6x^2+11x-6$ has the root $x=1$. Find its largest root.',
            'Polinomial $x^3-6x^2+11x-6$ mempunyai akar $x=1$. Cari akar terbesarnya.',
          ),
          blanks: [{ answer: 3 }],
          hints: [
            L('Divide by $x-1$ with Horner.', 'Bagi dengan $x-1$ memakai Horner.'),
            L('The coefficients $1,-6,11,-6$ give the quotient $x^2-5x+6$.', 'Koefisien $1,-6,11,-6$ memberi hasil bagi $x^2-5x+6$.'),
            L('Factor $x^2-5x+6=(x-2)(x-3)$.', 'Faktorkan $x^2-5x+6=(x-2)(x-3)$.'),
          ],
          explain: L('The roots are $1$, $2$ and $3$, so the largest is $3$.', 'Akar-akarnya $1$, $2$, dan $3$, jadi yang terbesar $3$.'),
          solution: ['x^3-6x^2+11x-6=(x-1)(x^2-5x+6)', '=(x-1)(x-2)(x-3)', 'x_{\\max}=3'],
        },
      ],
    },
    /* ------------------------------------------------------ L3 remainders */
    {
      id: 'tka-sml-m2-s1-l3',
      title: L('The Remainder', 'Sisa Pembagian'),
      goal: L(
        'You can find the remainder of a division with the remainder theorem, including a divisor ax − b and a quadratic divisor, and find an unknown coefficient.',
        'Kamu bisa mencari sisa pembagian dengan teorema sisa, termasuk pembagi ax − b dan pembagi kuadrat, serta mencari koefisien yang belum diketahui.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Remainder Is a Value', 'Ayo Amati: Sisa Adalah Sebuah Nilai'),
          body: L(
            'The **remainder theorem**: dividing $p(x)$ by $x-a$ leaves the remainder $p(a)$.\n\nTake $p(x)=x^3+2x^2-5x+1$ and divide by $x-1$. The remainder is $p(1)=1+2-5+1=-1$. This agrees with the Horner table of the earlier lesson. In the picture, the red point at $x=1$ has height $-1$: **the remainder is the height of the graph at $a$**.\n\nNo long division is needed.',
            '**Teorema sisa**: membagi $p(x)$ dengan $x-a$ menyisakan $p(a)$.\n\nAmbil $p(x)=x^3+2x^2-5x+1$ dan bagi dengan $x-1$. Sisanya $p(1)=1+2-5+1=-1$. Ini sesuai dengan tabel Horner pada pelajaran sebelumnya. Pada gambar, titik merah di $x=1$ berketinggian $-1$: **sisa adalah tinggi grafik di $a$**.\n\nTidak perlu pembagian bersusun.',
          ),
          figure: {
            ...cubic('x^3+2*x^2-5*x+1', -3.4, 2.1, [-4, 3], [-8, 10], [[1, -1]]),
            caption: L('The graph of x³ + 2x² − 5x + 1. At x = 1 its height is −1.', 'Grafik x³ + 2x² − 5x + 1. Di x = 1 tingginya −1.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: A Divisor ax − b', 'Contoh Bertahap: Pembagi ax − b'),
          body: L(
            'For the divisor $ax-b$, the remainder is $p\\left(\\frac{b}{a}\\right)$, because $ax-b=0$ at $x=\\frac{b}{a}$.\n\nFind the remainder when $p(x)=2x^3-x^2+3x-4$ is divided by $2x-1$.\n\n1. Step 1: $2x-1=0$ at $x=\\frac12$.\n2. Step 2: $p\\left(\\frac12\\right)=2\\cdot\\frac18-\\frac14+\\frac32-4$.\n3. Step 3: $=\\frac14-\\frac14+\\frac32-4=-\\frac52$.\n\nThe remainder is $-\\frac52$.',
            'Untuk pembagi $ax-b$, sisanya adalah $p\\left(\\frac{b}{a}\\right)$, karena $ax-b=0$ di $x=\\frac{b}{a}$.\n\nCari sisa bila $p(x)=2x^3-x^2+3x-4$ dibagi $2x-1$.\n\n1. Langkah 1: $2x-1=0$ di $x=\\frac12$.\n2. Langkah 2: $p\\left(\\frac12\\right)=2\\cdot\\frac18-\\frac14+\\frac32-4$.\n3. Langkah 3: $=\\frac14-\\frac14+\\frac32-4=-\\frac52$.\n\nSisanya $-\\frac52$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Unknown Coefficients and Quadratic Divisors', 'Contoh Bertahap: Koefisien Tak Diketahui dan Pembagi Kuadrat'),
          body: L(
            '**A coefficient.** $p(x)=x^3+ax^2-x+6$ is divisible by $x-2$, so $p(2)=0$: $8+4a-2+6=4a+12=0$, hence $a=-3$.\n\n**A quadratic divisor.** Dividing by $(x-1)(x+2)$ leaves a remainder of degree at most $1$: $r(x)=mx+n$. Suppose $p(1)=3$ and $p(-2)=-3$. Then $r(1)=3$ and $r(-2)=-3$:\n\n1. Step 1: $m+n=3$ and $-2m+n=-3$.\n2. Step 2: Subtract: $3m=6$, so $m=2$ and $n=1$.\n3. Step 3: The remainder is $2x+1$.\n\nThe zeros of the divisor are the points where you know the remainder.\n\n**Two unknowns.** $p(x)=x^3+3x^2+ax+b$ leaves the remainder $5$ on division by $x-1$ and $1$ on division by $x+1$. Then $p(1)=4+a+b=5$ and $p(-1)=2-a+b=1$, so $a+b=1$ and $-a+b=-1$. Adding: $2b=0$, so $b=0$ and $a=1$.',
            '**Sebuah koefisien.** $p(x)=x^3+ax^2-x+6$ habis dibagi $x-2$, jadi $p(2)=0$: $8+4a-2+6=4a+12=0$, sehingga $a=-3$.\n\n**Pembagi kuadrat.** Membagi dengan $(x-1)(x+2)$ menyisakan sisa berderajat paling tinggi $1$: $r(x)=mx+n$. Misalkan $p(1)=3$ dan $p(-2)=-3$. Maka $r(1)=3$ dan $r(-2)=-3$:\n\n1. Langkah 1: $m+n=3$ dan $-2m+n=-3$.\n2. Langkah 2: Kurangkan: $3m=6$, jadi $m=2$ dan $n=1$.\n3. Langkah 3: Sisanya $2x+1$.\n\nNol-nol pembagi adalah titik yang sisanya kamu ketahui.\n\n**Dua bilangan tak diketahui.** $p(x)=x^3+3x^2+ax+b$ bersisa $5$ bila dibagi $x-1$ dan $1$ bila dibagi $x+1$. Maka $p(1)=4+a+b=5$ dan $p(-1)=2-a+b=1$, jadi $a+b=1$ dan $-a+b=-1$. Jumlahkan: $2b=0$, jadi $b=0$ dan $a=1$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows p(x) = x³ + 2x² − 5x + 1. What is the remainder when p(x) is divided by x − 1?',
            'Grafik menunjukkan p(x) = x³ + 2x² − 5x + 1. Berapa sisa bila p(x) dibagi x − 1?',
          ),
          figure: {
            ...cubic('x^3+2*x^2-5*x+1', -3.4, 2.1, [-4, 3], [-8, 10], [[1, -1]]),
            caption: L('The red point is at x = 1.', 'Titik merah ada di x = 1.'),
          },
          options: ['-1', '1', '0', '3', '-5'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 0,
          explain: L(
            'The remainder is $p(1)=1+2-5+1=-1$, which is also the height of the red point. The value $0$ would mean $x-1$ is a factor, and $1$ is the constant term.',
            'Sisanya $p(1)=1+2-5+1=-1$, yang juga tinggi titik merah. Nilai $0$ berarti $x-1$ adalah faktor, dan $1$ adalah suku konstan.',
          ),
          hint: L('Substitute $x=1$ into $p$.', 'Substitusikan $x=1$ ke $p$.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: the remainder of $x^3+2x^2-5x+1$ divided by $x-2$.', 'Coba bersama: sisa $x^3+2x^2-5x+1$ dibagi $x-2$.'),
          template: 'p(2)=8+8-10+1=___',
          blanks: ['7'],
          explain: L('$p(2)=8+8-10+1=7$.', '$p(2)=8+8-10+1=7$.'),
          hint: L('The remainder on division by $x-2$ is $p(2)$.', 'Sisa pembagian oleh $x-2$ adalah $p(2)$.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('If $p(3)=0$, then $x-3$ is a factor of $p(x)$.', 'Jika $p(3)=0$, maka $x-3$ adalah faktor $p(x)$.'),
            L('The remainder of $p(x)\\div(x+2)$ is $p(-2)$.', 'Sisa $p(x)\\div(x+2)$ adalah $p(-2)$.'),
            L('The remainder of $p(x)\\div(x+2)$ is $p(2)$.', 'Sisa $p(x)\\div(x+2)$ adalah $p(2)$.'),
            L('A remainder of $0$ means $x-a$ does not divide $p(x)$.', 'Sisa $0$ berarti $x-a$ tidak membagi $p(x)$.'),
          ],
          answer: [0, 1],
          explain: L(
            '$x+2=0$ at $x=-2$, so the remainder is $p(-2)$, not $p(2)$. A remainder of $0$ means the division is exact.',
            '$x+2=0$ di $x=-2$, jadi sisanya $p(-2)$, bukan $p(2)$. Sisa $0$ berarti pembagiannya habis.',
          ),
          hint: L('Set the divisor equal to $0$ and solve for $x$.', 'Samakan pembagi dengan $0$ dan selesaikan $x$.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $p(x)=x^3+ax^2-x+6$. Decide whether each statement is True or False.',
            'Misalkan $p(x)=x^3+ax^2-x+6$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('$p(2)=4a+12$', '$p(2)=4a+12$'),
            L('For $a=-3$, $x-2$ is a factor of $p(x)$.', 'Untuk $a=-3$, $x-2$ adalah faktor $p(x)$.'),
            L('For $a=0$, the remainder of $p(x)\\div(x-2)$ is $12$.', 'Untuk $a=0$, sisa $p(x)\\div(x-2)$ adalah $12$.'),
            L('For $a=1$, $x-2$ is a factor of $p(x)$.', 'Untuk $a=1$, $x-2$ adalah faktor $p(x)$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            '$p(2)=8+4a-2+6=4a+12$. It is $0$ for $a=-3$, $12$ for $a=0$ and $16$ for $a=1$.',
            '$p(2)=8+4a-2+6=4a+12$. Nilainya $0$ untuk $a=-3$, $12$ untuk $a=0$, dan $16$ untuk $a=1$.',
          ),
          hint: L('Compute $p(2)$ in terms of $a$ first.', 'Hitung dulu $p(2)$ dalam $a$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The polynomial $x^3+ax^2-x+6$ is divisible by $x-2$. Find $a$.',
            'Polinomial $x^3+ax^2-x+6$ habis dibagi $x-2$. Tentukan $a$.',
          ),
          blanks: [{ label: 'a =', answer: -3 }],
          hints: [
            L('Divisible by $x-2$ means $p(2)=0$.', 'Habis dibagi $x-2$ berarti $p(2)=0$.'),
            L('$p(2)=8+4a-2+6$.', '$p(2)=8+4a-2+6$.'),
            L('Solve $4a+12=0$.', 'Selesaikan $4a+12=0$.'),
          ],
          explain: L('$4a+12=0$ gives $a=-3$.', '$4a+12=0$ memberi $a=-3$.'),
          solution: ['p(2)=8+4a-2+6=4a+12=0', 'a=-3'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m2-s1-p',
    runtime: 'math',
    title: L('Polynomials at Work', 'Polinomial dalam Pemakaian'),
    brief: L(
      'Multiply, factor and find remainders.',
      'Kalikan, faktorkan, dan cari sisa.',
    ),
    requirements: [
      L('Multiply polynomials and read off a coefficient.', 'Mengalikan polinomial dan membaca satu koefisien.'),
      L('Use the factor and remainder theorems.', 'Memakai teorema faktor dan teorema sisa.'),
    ],
    hints: [
      L('A zero $a$ gives the factor $x-a$.', 'Nol $a$ memberi faktor $x-a$.'),
      L('The remainder on division by $x-a$ is $p(a)$.', 'Sisa pembagian oleh $x-a$ adalah $p(a)$.'),
      L('For a quadratic divisor, the remainder is $mx+n$.', 'Untuk pembagi kuadrat, sisanya $mx+n$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Find the coefficient of $x$ in $(x^2-3x+2)(x+4)$.',
          'Cari koefisien $x$ dalam $(x^2-3x+2)(x+4)$.',
        ),
        blanks: [{ answer: -10 }],
        solution: ['(x^2-3x+2)(x+4)=x^3+x^2-10x+8', '-10'],
      },
      {
        prompt: L(
          'Find the remainder when $x^4-2x^2+x-5$ is divided by $x+1$.',
          'Cari sisa bila $x^4-2x^2+x-5$ dibagi $x+1$.',
        ),
        blanks: [{ answer: -7 }],
        solution: ['p(-1)=1-2-1-5', '=-7'],
      },
      {
        prompt: L(
          'Find the largest root of $x^3-7x+6=0$.',
          'Cari akar terbesar dari $x^3-7x+6=0$.',
        ),
        blanks: [{ answer: 2 }],
        solution: ['x^3-7x+6=(x-1)(x-2)(x+3)', 'x_{\\max}=2'],
      },
      {
        prompt: L(
          'The polynomial $2x^3-x^2+kx+6$ has the factor $x+1$. Find $k$.',
          'Polinomial $2x^3-x^2+kx+6$ mempunyai faktor $x+1$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 3 }],
        solution: ['p(-1)=-2-1-k+6=3-k=0', 'k=3'],
      },
      {
        prompt: L(
          'A polynomial $p$ leaves the remainder $4$ when divided by $x-1$ and $7$ when divided by $x-2$. Its remainder on division by $(x-1)(x-2)$ is $r(x)=mx+n$. Find $r(3)$.',
          'Sebuah polinomial $p$ bersisa $4$ bila dibagi $x-1$ dan $7$ bila dibagi $x-2$. Sisanya bila dibagi $(x-1)(x-2)$ adalah $r(x)=mx+n$. Cari $r(3)$.',
        ),
        blanks: [{ answer: 10 }],
        solution: ['m+n=4 \\quad 2m+n=7 \\Rightarrow m=3,\\ n=1', 'r(3)=3\\cdot3+1=10'],
      },
    ],
  },
}
