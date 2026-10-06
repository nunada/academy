import type { Lesson } from '../types'
import { L, plane } from './figs'

/** Module 3 — rational functions: domain, codomain, range and the graph. */

const hyper = (f: string, vx: number, hy: number, o: { x: [number, number]; y: [number, number]; left: [number, number]; right: [number, number] }) =>
  plane(
    [
      { t: 'curve', f, from: o.left[0], to: o.left[1], color: 'a' },
      { t: 'curve', f, from: o.right[0], to: o.right[1], color: 'a' },
      { t: 'vline', x: vx, color: 'muted', dashed: true },
      { t: 'hline', y: hy, color: 'muted', dashed: true },
    ],
    { x: o.x, y: o.y },
  )

export const lessonRational: Lesson = {
  id: 'tka-sma-m3-s1-l3',
  title: L('Rational Functions', 'Fungsi Rasional'),
  goal: L(
    'You can find the domain, codomain, range and asymptotes of a rational function and read it from its formula and its graph.',
    'Kamu bisa mencari domain, kodomain, daerah hasil, dan asimtot fungsi rasional dan membacanya dari rumus dan grafiknya.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: A Graph in Two Pieces', 'Ayo Amati: Grafik dalam Dua Bagian'),
      body: L(
        'A **rational function** is a fraction of polynomials, like $f(x)=\\frac{1}{x-2}+1$. Look at its graph: it comes in **two branches**, because the function does not exist at $x=2$.\n\n- The dashed vertical line $x=2$ is the **vertical asymptote**: the curve climbs or falls along it but never touches it.\n- The dashed horizontal line $y=1$ is the **horizontal asymptote**: far to the left and right the curve gets closer and closer to it.\n- **Domain:** all $x\\neq2$. **Range:** all $y\\neq1$.\n- The **codomain** is the set of values the function is *allowed* to take, usually all real numbers. The **range** is the set it *really* takes, so the range can be smaller than the codomain.',
        '**Fungsi rasional** adalah pecahan dari polinom, seperti $f(x)=\\frac{1}{x-2}+1$. Lihat grafiknya: grafik ini punya **dua cabang**, karena fungsinya tidak ada di $x=2$.\n\n- Garis tegak putus-putus $x=2$ adalah **asimtot tegak**: kurva naik atau turun sepanjang garis itu tetapi tidak pernah menyentuhnya.\n- Garis mendatar putus-putus $y=1$ adalah **asimtot mendatar**: jauh di kiri dan kanan kurva makin dekat dengannya.\n- **Domain:** semua $x\\neq2$. **Daerah hasil:** semua $y\\neq1$.\n- **Kodomain** adalah himpunan nilai yang *boleh* diambil fungsi, biasanya semua bilangan real. **Daerah hasil** adalah himpunan yang *benar-benar* diambil, jadi daerah hasil bisa lebih kecil dari kodomain.',
      ),
      figure: {
        ...hyper('1/(x-2)+1', 2, 1, { x: [-3, 7], y: [-5, 7], left: [-2.5, 1.8], right: [2.25, 6.5] }),
        caption: L('The graph of y = 1/(x - 2) + 1 with its two asymptotes.', 'Grafik y = 1/(x - 2) + 1 dengan kedua asimtotnya.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: Reading a Formula', 'Contoh Bertahap: Membaca Rumus'),
      body: L(
        'For $f(x)=\\frac{ax+b}{cx+d}$ (with $c\\neq0$):\n\n- vertical asymptote where the denominator is zero: $x=-\\frac{d}{c}$;\n- horizontal asymptote $y=\\frac{a}{c}$;\n- $y$-intercept $f(0)$ and $x$-intercept where the numerator is zero.\n\nTake $f(x)=\\frac{2x+1}{x-3}$.\n\n1. Step 1: The denominator is 0 at $x=3$, so the vertical asymptote is $x=3$ and the domain is $x\\neq3$.\n2. Step 2: The horizontal asymptote is $y=\\frac{2}{1}=2$, so the range is $y\\neq2$.\n3. Step 3: Intercepts: $f(0)=\\frac{1}{-3}=-\\frac{1}{3}$, and $2x+1=0$ gives $x=-\\frac{1}{2}$.\n\nThe picture shows both branches around the asymptotes $x=3$ and $y=2$.',
        'Untuk $f(x)=\\frac{ax+b}{cx+d}$ (dengan $c\\neq0$):\n\n- asimtot tegak di tempat penyebut nol: $x=-\\frac{d}{c}$;\n- asimtot mendatar $y=\\frac{a}{c}$;\n- titik potong sumbu $y$ adalah $f(0)$ dan titik potong sumbu $x$ di tempat pembilang nol.\n\nAmbil $f(x)=\\frac{2x+1}{x-3}$.\n\n1. Langkah 1: Penyebut bernilai 0 di $x=3$, jadi asimtot tegaknya $x=3$ dan domainnya $x\\neq3$.\n2. Langkah 2: Asimtot mendatarnya $y=\\frac{2}{1}=2$, jadi daerah hasilnya $y\\neq2$.\n3. Langkah 3: Titik potong: $f(0)=\\frac{1}{-3}=-\\frac{1}{3}$, dan $2x+1=0$ memberi $x=-\\frac{1}{2}$.\n\nGambar menunjukkan kedua cabang di sekitar asimtot $x=3$ dan $y=2$.',
      ),
      figure: {
        ...hyper('(2*x+1)/(x-3)', 3, 2, { x: [-4, 10], y: [-8, 14], left: [-4, 2.7], right: [3.4, 10] }),
        caption: L('The graph of y = (2x + 1)/(x - 3), with asymptotes x = 3 and y = 2.', 'Grafik y = (2x + 1)/(x - 3), dengan asimtot x = 3 dan y = 2.'),
      },
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Step by Step: Rational Equations and Their Traps', 'Contoh Bertahap: Persamaan Rasional dan Jebakannya'),
      body: L(
        'To solve an equation with a fraction, multiply by the denominator, then **check the result against the domain**.\n\nSolve $\\frac{x+1}{x-2}=3$.\n\n1. Step 1: Note $x\\neq2$.\n2. Step 2: Multiply by $x-2$: $x+1=3(x-2)=3x-6$.\n3. Step 3: $7=2x$, so $x=\\frac{7}{2}=3.5$.\n4. Step 4: $3.5\\neq2$, so it is allowed. Check: $\\frac{4.5}{1.5}=3$ ✓.\n\nThe same function can be written in two ways: $\\frac{2x+1}{x-3}=2+\\frac{7}{x-3}$ (divide the numerator). The second form shows the shift directly: the graph of $\\frac{7}{x-3}$ moved up 2.\n\n**Watch out:** a value that makes a denominator 0 is never a solution, even if the algebra produces it.',
        'Untuk menyelesaikan persamaan berpecahan, kalikan dengan penyebut, lalu **periksa hasilnya terhadap domain**.\n\nSelesaikan $\\frac{x+1}{x-2}=3$.\n\n1. Langkah 1: Catat $x\\neq2$.\n2. Langkah 2: Kalikan dengan $x-2$: $x+1=3(x-2)=3x-6$.\n3. Langkah 3: $7=2x$, jadi $x=\\frac{7}{2}=3{,}5$.\n4. Langkah 4: $3{,}5\\neq2$, jadi diperbolehkan. Periksa: $\\frac{4{,}5}{1{,}5}=3$ ✓.\n\nFungsi yang sama dapat ditulis dua cara: $\\frac{2x+1}{x-3}=2+\\frac{7}{x-3}$ (bagi pembilangnya). Bentuk kedua menunjukkan pergeseran langsung: grafik $\\frac{7}{x-3}$ digeser naik 2.\n\n**Awas:** nilai yang membuat penyebut 0 tidak pernah menjadi penyelesaian, walaupun aljabarnya menghasilkannya.',
      ),
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'The graph is a rational function with two dashed asymptotes. What are the equations of the asymptotes?',
        'Grafik adalah fungsi rasional dengan dua asimtot putus-putus. Apa persamaan kedua asimtotnya?',
      ),
      figure: {
        ...hyper('1/(x+1)-2', -1, -2, { x: [-6, 4], y: [-8, 4], left: [-5.5, -1.2], right: [-0.75, 3.5] }),
        caption: L('A graph with two branches.', 'Grafik dengan dua cabang.'),
      },
      options: [
        L('$x=-1$ and $y=-2$', '$x=-1$ dan $y=-2$'),
        L('$x=1$ and $y=2$', '$x=1$ dan $y=2$'),
        L('$x=-1$ and $y=2$', '$x=-1$ dan $y=2$'),
        L('$x=-2$ and $y=-1$', '$x=-2$ dan $y=-1$'),
      ],
      answer: 0,
      explain: L(
        'The vertical dashed line crosses the $x$-axis at $-1$ and the horizontal one crosses the $y$-axis at $-2$. Read the sign of each position.',
        'Garis tegak putus-putus memotong sumbu $x$ di $-1$ dan yang mendatar memotong sumbu $y$ di $-2$. Baca tanda tiap posisi.',
      ),
      hint: L(
        'The vertical asymptote is $x=$ a number on the horizontal axis; the horizontal asymptote is $y=$ a number on the vertical axis.',
        'Asimtot tegak adalah $x=$ bilangan pada sumbu mendatar; asimtot mendatar adalah $y=$ bilangan pada sumbu tegak.',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: the asymptotes of $f(x)=\\frac{2x+1}{x-3}$.',
        'Coba bersama: asimtot dari $f(x)=\\frac{2x+1}{x-3}$.',
      ),
      template: 'x-3=0 \\Rightarrow x=___ \\qquad y=2\\div___=___',
      blanks: ['3', '1', '2'],
      explain: L(
        'The denominator is zero at $x=3$. The horizontal asymptote is the ratio of the leading coefficients, $\\frac{2}{1}=2$.',
        'Penyebut nol di $x=3$. Asimtot mendatar adalah rasio koefisien utama, $\\frac{2}{1}=2$.',
      ),
      hint: L(
        'For the horizontal asymptote, divide the coefficient of $x$ on top by the coefficient of $x$ at the bottom.',
        'Untuk asimtot mendatar, bagi koefisien $x$ di atas dengan koefisien $x$ di bawah.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('Choose the TWO true statements about $f(x)=\\frac{1}{x-2}+1$.', 'Pilih DUA pernyataan yang benar tentang $f(x)=\\frac{1}{x-2}+1$.'),
      options: [
        L('The domain is all $x\\neq2$.', 'Domainnya semua $x\\neq2$.'),
        L('The range is all $y\\neq1$.', 'Daerah hasilnya semua $y\\neq1$.'),
        L('$f(2)=1$.', '$f(2)=1$.'),
        L('The horizontal asymptote is $y=2$.', 'Asimtot mendatarnya $y=2$.'),
      ],
      answer: [0, 1],
      explain: L(
        '$f(2)$ does not exist (the denominator is zero), and the horizontal asymptote is $y=1$, the constant that was added.',
        '$f(2)$ tidak ada (penyebutnya nol), dan asimtot mendatarnya $y=1$, konstanta yang ditambahkan.',
      ),
      hint: L(
        'The fraction $\\frac{1}{x-2}$ is never 0, so $f(x)$ is never exactly 1.',
        'Pecahan $\\frac{1}{x-2}$ tidak pernah bernilai 0, jadi $f(x)$ tidak pernah tepat 1.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('A rational function is undefined where its denominator is zero.', 'Fungsi rasional tidak terdefinisi di tempat penyebutnya nol.'),
        L('The range of $f(x)=\\frac{1}{x}$ contains 0.', 'Daerah hasil $f(x)=\\frac{1}{x}$ memuat 0.'),
        L('The graph of $y=\\frac{2x+1}{x-3}$ has the horizontal asymptote $y=2$.', 'Grafik $y=\\frac{2x+1}{x-3}$ punya asimtot mendatar $y=2$.'),
        L('The codomain and the range of a function are always the same set.', 'Kodomain dan daerah hasil suatu fungsi selalu himpunan yang sama.'),
      ],
      answer: [true, false, true, false],
      explain: L(
        '$\\frac{1}{x}=0$ has no solution, so 0 is not in the range. The codomain is the allowed set, and the range may be smaller.',
        '$\\frac{1}{x}=0$ tidak punya penyelesaian, jadi 0 tidak termasuk daerah hasil. Kodomain adalah himpunan yang diperbolehkan, dan daerah hasil bisa lebih kecil.',
      ),
      hint: L(
        'Ask: can the fraction $\\frac{1}{x}$ ever be zero?',
        'Tanyakan: dapatkah pecahan $\\frac{1}{x}$ pernah bernilai nol?',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'Solve $\\frac{x+1}{x-2}=3$.',
        'Selesaikan $\\frac{x+1}{x-2}=3$.',
      ),
      blanks: [{ label: 'x =', answer: 3.5 }],
      hints: [
        L('Multiply both sides by $x-2$ (remember that $x\\neq2$).', 'Kalikan kedua ruas dengan $x-2$ (ingat bahwa $x\\neq2$).'),
        L('$x+1=3(x-2)$.', '$x+1=3(x-2)$.'),
        L('Expand: $x+1=3x-6$, then collect the $x$ terms.', 'Jabarkan: $x+1=3x-6$, lalu kumpulkan suku $x$.'),
      ],
      explain: L(
        '$7=2x$, so $x=3.5$. It is not 2, so it is allowed; check: $\\frac{4.5}{1.5}=3$.',
        '$7=2x$, jadi $x=3{,}5$. Nilainya bukan 2, jadi diperbolehkan; periksa: $\\frac{4{,}5}{1{,}5}=3$.',
      ),
      solution: {
        en: ['x+1=3(x-2)=3x-6', '7=2x \\Rightarrow x=3.5'],
        id: ['x+1=3(x-2)=3x-6', '7=2x \\Rightarrow x=3{,}5'],
      },
    },
  ],
}
