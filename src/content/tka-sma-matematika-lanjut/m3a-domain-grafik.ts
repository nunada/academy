import type { Submodule } from '../types'
import { L, dot, plane } from './figs'

/** Module 3, submodule 1 — domain, range and graphs of polynomial, rational,
 *  root and absolute-value functions. */

export const m3s1: Submodule = {
  id: 'tka-sml-m3-s1',
  title: L('Domain, Range and Graphs', 'Domain, Daerah Hasil, dan Grafik'),
  summary: L(
    'Find the domain and range of polynomial, rational, root and absolute-value functions, and recognise them from their graphs.',
    'Mencari domain dan daerah hasil fungsi polinom, rasional, akar, dan mutlak, serta mengenalinya dari grafiknya.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 domain, range */
    {
      id: 'tka-sml-m3-s1-l1',
      title: L('Domain and Range', 'Domain dan Daerah Hasil'),
      goal: L(
        'You can find the domain and the range of polynomial, rational, root and absolute-value functions.',
        'Kamu bisa mencari domain dan daerah hasil fungsi polinom, rasional, akar, dan mutlak.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Which x, Which y', 'Ayo Amati: x Mana, y Mana'),
          body: L(
            'For a function $f$, the **domain** is the set of inputs $x$ that are allowed, and the **range** is the set of outputs $y$ that actually occur. The **codomain** is the set the outputs are said to lie in; the range can be smaller.\n\nThe picture shows $f(x)=\\sqrt{x-2}$:\n\n- the graph starts at $x=2$ and goes right, so the domain is $x\\ge2$;\n- the graph never goes below the $x$-axis, so the range is $y\\ge0$.\n\nReading a graph: the domain is the stretch of the $x$-axis the graph covers, and the range is the stretch of the $y$-axis it covers.',
            'Untuk fungsi $f$, **domain** adalah himpunan masukan $x$ yang diperbolehkan, dan **daerah hasil** (range) adalah himpunan keluaran $y$ yang benar-benar terjadi. **Kodomain** adalah himpunan tempat keluaran dikatakan berada; daerah hasil bisa lebih kecil.\n\nGambar menunjukkan $f(x)=\\sqrt{x-2}$:\n\n- grafik mulai di $x=2$ dan ke kanan, jadi domainnya $x\\ge2$;\n- grafik tidak pernah di bawah sumbu $x$, jadi daerah hasilnya $y\\ge0$.\n\nMembaca grafik: domain adalah bagian sumbu $x$ yang dicakup grafik, dan daerah hasil adalah bagian sumbu $y$ yang dicakupnya.',
          ),
          figure: {
            ...plane([{ t: 'curve', f: 'sqrt(x-2)', from: 2, to: 9, color: 'a' }, dot([2, 0], undefined, 'result')], { x: [-1, 9], y: [-1, 4] }),
            caption: L('The graph of √(x − 2) starts at the red point (2, 0).', 'Grafik √(x − 2) mulai dari titik merah (2, 0).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Rules for the Domain', 'Contoh Bertahap: Aturan untuk Domain'),
          body: L(
            'Start from "all real numbers" and remove what breaks the formula:\n\n| Function | Condition |\n|---|---|\n| polynomial | none: all real $x$ |\n| $\\frac{1}{g(x)}$ | $g(x)\\ne0$ |\n| $\\sqrt{g(x)}$ | $g(x)\\ge0$ |\n| $\\log g(x)$ | $g(x)>0$ |\n| $| g(x)|$ | none |\n\nFind the domain of $f(x)=\\dfrac{\\sqrt{x-2}}{x-5}$.\n\n1. Step 1: The root needs $x-2\\ge0$, so $x\\ge2$.\n2. Step 2: The denominator needs $x\\ne5$.\n3. Step 3: Domain: $x\\ge2$ with $x\\ne5$.\n\nAnother: $g(x)=\\frac{1}{x^2-4}$ needs $x^2-4\\ne0$, so $x\\ne\\pm2$.',
            'Mulai dari "semua bilangan real" lalu buang yang merusak rumus:\n\n| Fungsi | Syarat |\n|---|---|\n| polinom | tidak ada: semua $x$ real |\n| $\\frac{1}{g(x)}$ | $g(x)\\ne0$ |\n| $\\sqrt{g(x)}$ | $g(x)\\ge0$ |\n| $\\log g(x)$ | $g(x)>0$ |\n| $| g(x)|$ | tidak ada |\n\nCari domain $f(x)=\\dfrac{\\sqrt{x-2}}{x-5}$.\n\n1. Langkah 1: Akar memerlukan $x-2\\ge0$, jadi $x\\ge2$.\n2. Langkah 2: Penyebut memerlukan $x\\ne5$.\n3. Langkah 3: Domain: $x\\ge2$ dengan $x\\ne5$.\n\nContoh lain: $g(x)=\\frac{1}{x^2-4}$ memerlukan $x^2-4\\ne0$, jadi $x\\ne\\pm2$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Finding the Range', 'Contoh Bertahap: Mencari Daerah Hasil'),
          body: L(
            'Find the range by asking "what is the lowest or highest value, and what is skipped?"\n\n- $f(x)=x^2-4x+7=(x-2)^2+3$: a square is never negative, so the lowest value is $3$ and the range is $y\\ge3$.\n- $f(x)=| x-3|+1$: an absolute value is at least $0$, so the range is $y\\ge1$.\n- $f(x)=\\dfrac{3}{x-1}$: it can take every value except $0$, so the range is $y\\ne0$.\n- $f(x)=\\sqrt{x-2}$: the range is $y\\ge0$.\n\nA quick check is to read the lowest or highest point of the graph.',
            'Cari daerah hasil dengan bertanya "berapa nilai terendah atau tertinggi, dan apa yang terlewat?"\n\n- $f(x)=x^2-4x+7=(x-2)^2+3$: kuadrat tidak pernah negatif, jadi nilai terendahnya $3$ dan daerah hasilnya $y\\ge3$.\n- $f(x)=| x-3|+1$: nilai mutlak paling kecil $0$, jadi daerah hasilnya $y\\ge1$.\n- $f(x)=\\dfrac{3}{x-1}$: ia dapat bernilai apa saja kecuali $0$, jadi daerah hasilnya $y\\ne0$.\n- $f(x)=\\sqrt{x-2}$: daerah hasilnya $y\\ge0$.\n\nPemeriksaan cepat adalah membaca titik terendah atau tertinggi grafik.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'What are the domain and the range of the function whose graph is shown?',
            'Apa domain dan daerah hasil fungsi yang grafiknya ditunjukkan?',
          ),
          figure: {
            ...plane([{ t: 'curve', f: 'sqrt(x-2)', from: 2, to: 9, color: 'a' }, dot([2, 0], undefined, 'result')], { x: [-1, 9], y: [-1, 4] }),
            caption: L('A graph that starts at the red point (2, 0).', 'Grafik yang mulai dari titik merah (2, 0).'),
          },
          options: [
            L('Domain $x\\ge2$, range $y\\ge0$', 'Domain $x\\ge2$, daerah hasil $y\\ge0$'),
            L('Domain $x\\ge0$, range $y\\ge2$', 'Domain $x\\ge0$, daerah hasil $y\\ge2$'),
            L('Domain $x>2$, range $y>0$', 'Domain $x>2$, daerah hasil $y>0$'),
            L('Domain all real numbers, range $y\\ge0$', 'Domain semua bilangan real, daerah hasil $y\\ge0$'),
            L('Domain $x\\ge2$, range $y\\ge2$', 'Domain $x\\ge2$, daerah hasil $y\\ge2$'),
          ],
          answer: 0,
          explain: L(
            'The graph starts at $(2,0)$ and goes right and up. The $x$ values begin at $2$ and the $y$ values begin at $0$. Both ends are included because the starting point is filled in. The domain and range are not interchangeable: one starts at $2$ and the other at $0$.',
            'Grafik mulai di $(2,0)$ lalu ke kanan dan ke atas. Nilai $x$ mulai dari $2$ dan nilai $y$ mulai dari $0$. Kedua ujungnya termasuk karena titik awalnya terisi. Domain dan daerah hasil tidak dapat dipertukarkan: yang satu mulai di $2$ dan yang lain di $0$.',
          ),
          hint: L(
            'Read the $x$ values the graph covers for the domain, and the $y$ values for the range.',
            'Baca nilai $x$ yang dicakup grafik untuk domain, dan nilai $y$ untuk daerah hasil.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: the domain of $\\sqrt{x-2}$.', 'Coba bersama: domain $\\sqrt{x-2}$.'),
          template: 'x-2\\ge___ \\Rightarrow x\\ge___',
          blanks: ['0', '2'],
          explain: L('A square root needs a non-negative number inside: $x-2\\ge0$, so $x\\ge2$.', 'Akar kuadrat memerlukan bilangan tak negatif di dalamnya: $x-2\\ge0$, jadi $x\\ge2$.'),
          hint: L('What must be true of the number under a square root?', 'Apa yang harus benar tentang bilangan di bawah akar kuadrat?'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The domain of $\\dfrac{1}{x^2-4}$ excludes $x=2$ and $x=-2$.', 'Domain $\\dfrac{1}{x^2-4}$ tidak memuat $x=2$ dan $x=-2$.'),
            L('The domain of $\\sqrt{x+3}$ is $x\\ge-3$.', 'Domain $\\sqrt{x+3}$ adalah $x\\ge-3$.'),
            L('The domain of $\\log x$ is $x\\ge0$.', 'Domain $\\log x$ adalah $x\\ge0$.'),
            L('The range of $| x|$ is all real numbers.', 'Daerah hasil $| x|$ adalah semua bilangan real.'),
          ],
          answer: [0, 1],
          explain: L(
            '$x^2-4=0$ at $x=\\pm2$. $x+3\\ge0$ gives $x\\ge-3$. A logarithm needs $x>0$, not $x\\ge0$. An absolute value is never negative.',
            '$x^2-4=0$ di $x=\\pm2$. $x+3\\ge0$ memberi $x\\ge-3$. Logaritma memerlukan $x>0$, bukan $x\\ge0$. Nilai mutlak tidak pernah negatif.',
          ),
          hint: L('Ask what could go wrong for each formula: a zero denominator, a negative under a root, a non-positive log.', 'Tanyakan apa yang bisa salah pada tiap rumus: penyebut nol, negatif di bawah akar, log tak positif.'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $f(x)=| x-3|+1$. Decide whether each statement is True or False.',
            'Misalkan $f(x)=| x-3|+1$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('The domain is all real numbers.', 'Domainnya semua bilangan real.'),
            L('The range is $y\\ge1$.', 'Daerah hasilnya $y\\ge1$.'),
            L('The lowest value $1$ is reached at $x=3$.', 'Nilai terendah $1$ dicapai di $x=3$.'),
            L('The range is $y\\ge0$.', 'Daerah hasilnya $y\\ge0$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            '$| x-3|\\ge0$ with equality at $x=3$, so $f\\ge1$ and $f(3)=1$. The range starts at $1$, not $0$.',
            '$| x-3|\\ge0$ dengan kesamaan di $x=3$, jadi $f\\ge1$ dan $f(3)=1$. Daerah hasilnya mulai di $1$, bukan $0$.',
          ),
          hint: L('The smallest value of an absolute value is $0$. Then add $1$.', 'Nilai terkecil dari nilai mutlak adalah $0$. Lalu tambah $1$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Find the smallest integer in the domain of $f(x)=\\sqrt{2x-7}$.',
            'Cari bilangan bulat terkecil dalam domain $f(x)=\\sqrt{2x-7}$.',
          ),
          blanks: [{ answer: 4 }],
          hints: [
            L('The number under the root cannot be negative.', 'Bilangan di bawah akar tidak boleh negatif.'),
            L('Solve $2x-7\\ge0$.', 'Selesaikan $2x-7\\ge0$.'),
            L('$x\\ge\\frac{7}{2}$. Which integer comes first?', '$x\\ge\\frac{7}{2}$. Bilangan bulat mana yang pertama?'),
          ],
          explain: L('$x\\ge3\\frac12$, so the smallest integer is $4$.', '$x\\ge3\\frac12$, jadi bilangan bulat terkecilnya $4$.'),
          solution: ['2x-7\\ge0 \\Rightarrow x\\ge\\frac{7}{2}', 'x_{\\min}=4'],
        },
      ],
    },
    /* ------------------------------------------------------- L2 the graphs */
    {
      id: 'tka-sml-m3-s1-l2',
      title: L('Graphs of Functions', 'Grafik Fungsi'),
      goal: L(
        'You can sketch and recognise graphs of polynomial, rational, root and absolute-value functions, including shifts and asymptotes.',
        'Kamu bisa membuat sketsa dan mengenali grafik fungsi polinom, rasional, akar, dan mutlak, termasuk pergeseran dan asimtot.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Asymptotes of a Rational Function', 'Ayo Amati: Asimtot Fungsi Rasional'),
          body: L(
            'A graph can approach a line without touching it. That line is an **asymptote**.\n\nThe picture shows $f(x)=\\dfrac{x+1}{x-1}$:\n\n- **vertical asymptote** $x=1$, where the denominator is $0$ and the numerator is not;\n- **horizontal asymptote** $y=1$: for very large $x$, $\\frac{x+1}{x-1}\\to\\frac{1}{1}=1$ (the ratio of the leading coefficients);\n- zero at $x=-1$ (numerator $0$) and $y$-intercept $f(0)=-1$.\n\nThe graph has two separate branches.',
            'Grafik dapat mendekati suatu garis tanpa menyentuhnya. Garis itu disebut **asimtot**.\n\nGambar menunjukkan $f(x)=\\dfrac{x+1}{x-1}$:\n\n- **asimtot tegak** $x=1$, tempat penyebut bernilai $0$ dan pembilang tidak;\n- **asimtot datar** $y=1$: untuk $x$ yang sangat besar, $\\frac{x+1}{x-1}\\to\\frac{1}{1}=1$ (perbandingan koefisien utama);\n- nol di $x=-1$ (pembilang $0$) dan titik potong sumbu $y$ di $f(0)=-1$.\n\nGrafiknya terdiri dari dua cabang terpisah.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '(x+1)/(x-1)', from: -5, to: 0.7, color: 'a' },
                { t: 'curve', f: '(x+1)/(x-1)', from: 1.3, to: 6, color: 'a' },
                { t: 'vline', x: 1, color: 'muted', dashed: true },
                { t: 'hline', y: 1, color: 'muted', dashed: true },
                dot([-1, 0], undefined, 'result'),
                dot([0, -1], undefined, 'result'),
              ],
              { x: [-5, 6], y: [-6, 8] },
            ),
            caption: L('The graph of (x + 1)/(x − 1) with its asymptotes (grey dashes).', 'Grafik (x + 1)/(x − 1) dengan asimtotnya (garis putus-putus abu-abu).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Shifting, Flipping and Folding', 'Contoh Bertahap: Menggeser, Membalik, dan Melipat'),
          body: L(
            'Start from a known graph $y=f(x)$ and change it:\n\n- $y=f(x-a)+b$: shift **right** $a$ and **up** $b$.\n- $y=-f(x)$: flip over the $x$-axis.\n- $y=| f(x)|$: **fold** the part below the $x$-axis up.\n\nExample: $y=| x-3|+1$. The basic graph $y=| x|$ has its corner at $(0,0)$. Shifting right $3$ and up $1$ moves the corner to $(3,1)$.\n\nExample: $y=\\sqrt{x+2}-1$ starts at $(-2,-1)$.',
            'Mulai dari grafik yang dikenal $y=f(x)$ dan ubah:\n\n- $y=f(x-a)+b$: geser ke **kanan** $a$ dan ke **atas** $b$.\n- $y=-f(x)$: balik terhadap sumbu $x$.\n- $y=| f(x)|$: **lipat** bagian di bawah sumbu $x$ ke atas.\n\nContoh: $y=| x-3|+1$. Grafik dasar $y=| x|$ bersudut di $(0,0)$. Menggeser ke kanan $3$ dan ke atas $1$ memindahkan sudutnya ke $(3,1)$.\n\nContoh: $y=\\sqrt{x+2}-1$ mulai di $(-2,-1)$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Matching a Formula to a Graph', 'Awas, Jebakan!: Mencocokkan Rumus dengan Grafik'),
          body: L(
            'To match a graph, check the **features**, one by one, and cross out options:\n\n1. **Intercepts**: $f(0)$ and the zeros.\n2. **Asymptotes**: where a denominator is $0$; the ratio of leading coefficients.\n3. **Where it starts or has a corner**: roots and absolute values.\n4. **Ends**: for a polynomial, the highest power and its sign decide how the ends point.\n\nFor $f(x)=x^4-5x^2+4$: both ends go **up** (even degree, positive coefficient), $f(0)=4$ and the graph is symmetric about the $y$-axis because only even powers appear.',
            'Untuk mencocokkan grafik, periksa **ciri-cirinya** satu per satu dan coret pilihan:\n\n1. **Titik potong**: $f(0)$ dan nol-nolnya.\n2. **Asimtot**: tempat penyebut $0$; perbandingan koefisien utama.\n3. **Tempat mulai atau bersudut**: akar dan nilai mutlak.\n4. **Ujung-ujungnya**: untuk polinomial, pangkat tertinggi dan tandanya menentukan arah ujung.\n\nUntuk $f(x)=x^4-5x^2+4$: kedua ujung **naik** (derajat genap, koefisien positif), $f(0)=4$ dan grafik simetris terhadap sumbu $y$ karena hanya ada pangkat genap.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph has the vertical asymptote x = 1, the horizontal asymptote y = 1, and passes through (−1, 0) and (0, −1). Which function is it?',
            'Grafik memiliki asimtot tegak x = 1, asimtot datar y = 1, dan melalui (−1, 0) serta (0, −1). Fungsi manakah itu?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '(x+1)/(x-1)', from: -5, to: 0.7, color: 'a' },
                { t: 'curve', f: '(x+1)/(x-1)', from: 1.3, to: 6, color: 'a' },
                { t: 'vline', x: 1, color: 'muted', dashed: true },
                { t: 'hline', y: 1, color: 'muted', dashed: true },
                dot([-1, 0], undefined, 'result'),
                dot([0, -1], undefined, 'result'),
              ],
              { x: [-5, 6], y: [-6, 8] },
            ),
            caption: L('A rational graph with two asymptotes.', 'Grafik rasional dengan dua asimtot.'),
          },
          options: [
            '\\frac{x+1}{x-1}',
            '\\frac{x-1}{x+1}',
            '\\frac{1}{x-1}',
            '\\frac{2x}{x-1}',
            '\\frac{x}{x-1}',
          ].map((s) => L(`$f(x)=${s}$`, `$f(x)=${s}$`)),
          answer: 0,
          explain: L(
            'The vertical asymptote $x=1$ needs the denominator $x-1$. The horizontal asymptote $y=1$ needs equal leading coefficients, which removes $\\frac{1}{x-1}$ ($y=0$) and $\\frac{2x}{x-1}$ ($y=2$). The zero at $-1$ needs the numerator $x+1$, which removes $\\frac{x}{x-1}$.',
            'Asimtot tegak $x=1$ memerlukan penyebut $x-1$. Asimtot datar $y=1$ memerlukan koefisien utama yang sama, yang menyingkirkan $\\frac{1}{x-1}$ ($y=0$) dan $\\frac{2x}{x-1}$ ($y=2$). Nol di $-1$ memerlukan pembilang $x+1$, yang menyingkirkan $\\frac{x}{x-1}$.',
          ),
          hint: L(
            'Use the asymptotes first, then the zero at $x=-1$.',
            'Pakai asimtot dulu, lalu nol di $x=-1$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: the asymptotes of $\\dfrac{2x+3}{x-1}$.', 'Coba bersama: asimtot dari $\\dfrac{2x+3}{x-1}$.'),
          template: 'x-1=0\\Rightarrow x=___ \\qquad y\\to\\frac{2}{1}=___',
          blanks: ['1', '2'],
          explain: L(
            'The denominator is $0$ at $x=1$, giving the vertical asymptote. For large $x$ the ratio tends to $\\frac21=2$.',
            'Penyebut bernilai $0$ di $x=1$, memberi asimtot tegak. Untuk $x$ besar perbandingannya mendekati $\\frac21=2$.',
          ),
          hint: L('Vertical: where the denominator is $0$. Horizontal: the ratio of the leading coefficients.', 'Tegak: tempat penyebut $0$. Datar: perbandingan koefisien utama.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('The graph of $y=| x-3|+1$ has its lowest point at $(3,1)$.', 'Grafik $y=| x-3|+1$ titik terendahnya di $(3,1)$.'),
            L('The graph of $y=\\dfrac{2}{x-1}$ has the vertical asymptote $x=1$.', 'Grafik $y=\\dfrac{2}{x-1}$ mempunyai asimtot tegak $x=1$.'),
            L('The graph of $y=\\sqrt{x}$ is defined for every real $x$.', 'Grafik $y=\\sqrt{x}$ terdefinisi untuk setiap $x$ real.'),
            L('The graph of $y=x^3$ goes up on the far left.', 'Grafik $y=x^3$ naik di ujung kiri.'),
          ],
          answer: [0, 1],
          explain: L(
            'The corner of $| x-3|+1$ is at $(3,1)$, and $\\frac{2}{x-1}$ is not defined at $x=1$. $\\sqrt{x}$ needs $x\\ge0$. And $x^3$ is negative for negative $x$, so the left end goes down.',
            'Sudut $| x-3|+1$ ada di $(3,1)$, dan $\\frac{2}{x-1}$ tidak terdefinisi di $x=1$. $\\sqrt{x}$ memerlukan $x\\ge0$. Dan $x^3$ negatif untuk $x$ negatif, jadi ujung kiri turun.',
          ),
          hint: L('Think of each graph: where is its corner, its break, its start?', 'Bayangkan tiap grafik: di mana sudutnya, putusnya, mulainya?'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'Let $f(x)=x^4-5x^2+4$. Decide whether each statement is True or False.',
            'Misalkan $f(x)=x^4-5x^2+4$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('Both ends of the graph go up.', 'Kedua ujung grafik naik.'),
            L('The graph is symmetric about the $y$-axis.', 'Grafik simetris terhadap sumbu $y$.'),
            L('$f(0)=4$', '$f(0)=4$'),
            L('The graph meets the $x$-axis exactly twice.', 'Grafik memotong sumbu $x$ tepat dua kali.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'Even degree with a positive leading coefficient: both ends go up. Only even powers appear, so $f(-x)=f(x)$. $f(0)=4$. The zeros are $\\pm1,\\pm2$, so the axis is met four times.',
            'Derajat genap dengan koefisien utama positif: kedua ujung naik. Hanya pangkat genap yang muncul, jadi $f(-x)=f(x)$. $f(0)=4$. Nolnya $\\pm1,\\pm2$, jadi sumbu dipotong empat kali.',
          ),
          hint: L('Look at the highest power, and at which powers appear.', 'Lihat pangkat tertinggi, dan pangkat mana yang muncul.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The graph of $y=\\dfrac{3x+1}{x-2}$ has the horizontal asymptote $y=k$. Find $k$.',
            'Grafik $y=\\dfrac{3x+1}{x-2}$ memiliki asimtot datar $y=k$. Tentukan $k$.',
          ),
          blanks: [{ label: 'k =', answer: 3 }],
          hints: [
            L('Think about very large $x$.', 'Pikirkan $x$ yang sangat besar.'),
            L('Then only the highest powers matter: $\\frac{3x}{x}$.', 'Maka hanya pangkat tertinggi yang berpengaruh: $\\frac{3x}{x}$.'),
            L('The ratio of the leading coefficients is $\\frac{3}{1}$.', 'Perbandingan koefisien utamanya $\\frac{3}{1}$.'),
          ],
          explain: L('For large $x$, $\\frac{3x+1}{x-2}\\approx\\frac{3x}{x}=3$.', 'Untuk $x$ besar, $\\frac{3x+1}{x-2}\\approx\\frac{3x}{x}=3$.'),
          solution: ['\\frac{3x+1}{x-2}\\to\\frac{3}{1}', 'k=3'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m3-s1-p',
    runtime: 'math',
    title: L('Domains and Graphs at Work', 'Domain dan Grafik dalam Pemakaian'),
    brief: L(
      'Find domains, ranges and asymptotes.',
      'Cari domain, daerah hasil, dan asimtot.',
    ),
    requirements: [
      L('Find the domain of a root or rational function.', 'Mencari domain fungsi akar atau rasional.'),
      L('Find a range, a minimum and an asymptote.', 'Mencari daerah hasil, nilai minimum, dan asimtot.'),
    ],
    hints: [
      L('A root needs a non-negative inside; a denominator cannot be $0$.', 'Akar memerlukan isi tak negatif; penyebut tidak boleh $0$.'),
      L('Complete the square to find a minimum.', 'Lengkapkan kuadrat untuk mencari minimum.'),
      L('Vertical asymptote: denominator $0$. Horizontal: leading coefficients.', 'Asimtot tegak: penyebut $0$. Datar: koefisien utama.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Find the largest integer in the domain of $f(x)=\\sqrt{10-3x}$.',
          'Cari bilangan bulat terbesar dalam domain $f(x)=\\sqrt{10-3x}$.',
        ),
        blanks: [{ answer: 3 }],
        solution: ['10-3x\\ge0 \\Rightarrow x\\le\\frac{10}{3}', 'x_{\\max}=3'],
      },
      {
        prompt: L(
          'Find the minimum value of $f(x)=x^2-4x+7$.',
          'Cari nilai minimum $f(x)=x^2-4x+7$.',
        ),
        blanks: [{ answer: 3 }],
        solution: ['f(x)=(x-2)^2+3', 'f_{\\min}=3'],
      },
      {
        prompt: L(
          'The graph of $y=\\dfrac{2x+1}{x-4}$ has the vertical asymptote $x=k$. Find $k$.',
          'Grafik $y=\\dfrac{2x+1}{x-4}$ memiliki asimtot tegak $x=k$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 4 }],
        solution: ['x-4=0', 'k=4'],
      },
      {
        prompt: L(
          'The graph of $y=\\dfrac{5x+2}{x+3}$ has the horizontal asymptote $y=k$. Find $k$.',
          'Grafik $y=\\dfrac{5x+2}{x+3}$ memiliki asimtot datar $y=k$. Tentukan $k$.',
        ),
        blanks: [{ label: 'k =', answer: 5 }],
        solution: ['\\frac{5x+2}{x+3}\\to\\frac{5}{1}', 'k=5'],
      },
      {
        prompt: L(
          'Find the minimum value of $y=|2x-6|-4$.',
          'Cari nilai minimum $y=|2x-6|-4$.',
        ),
        blanks: [{ answer: -4 }],
        solution: ['|2x-6|\\ge0', 'y_{\\min}=0-4=-4'],
      },
    ],
  },
}
