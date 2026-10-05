import type { Submodule } from '../types'
import { L, barChart, dot, plane, shape, txt } from './figs'

/** Module 1, submodule 2 — exponents, roots (surds) and logarithms. */

export const m1s2: Submodule = {
  id: 'tka-sma-m1-s2',
  title: L('Exponents, Roots and Logarithms', 'Eksponen, Akar, dan Logaritma'),
  summary: L(
    'Use the laws of exponents including negative and fractional ones, simplify and rationalise roots, and use logarithms and their laws.',
    'Memakai hukum eksponen termasuk yang negatif dan pecahan, menyederhanakan dan merasionalkan akar, serta memakai logaritma dan sifat-sifatnya.',
  ),
  lessons: [
    /* ------------------------------------------------------------ L1 exponents, surds */
    {
      id: 'tka-sma-m1-s2-l1',
      title: L('Exponents and Surds', 'Eksponen dan Bentuk Akar'),
      goal: L(
        'You can simplify expressions with integer and fractional exponents, simplify a root, and rationalise a denominator.',
        'Kamu bisa menyederhanakan ekspresi dengan eksponen bulat dan pecahan, menyederhanakan akar, dan merasionalkan penyebut.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Doubling Again and Again', 'Ayo Amati: Berlipat Dua Terus-Menerus'),
          body: L(
            'A cell divides into 2 every hour. After $n$ hours there are $2^n$ cells: 1, 2, 4, 8, 16, $\\ldots$ Each bar is twice the one before.\n\n- $a^n$ means $a$ multiplied by itself $n$ times, and $a^0=1$.\n- Going one step **back** divides by 2: $2^0=1$, so $2^{-1}=\\frac{1}{2}$ and $2^{-2}=\\frac{1}{4}$. That is why $a^{-n}=\\frac{1}{a^n}$.\n- A **root** is a fractional exponent: $a^{\\frac{1}{2}}=\\sqrt{a}$, $a^{\\frac{1}{3}}=\\sqrt[3]{a}$ and $a^{\\frac{m}{n}}=\\sqrt[n]{a^m}$.',
            'Sebuah sel membelah menjadi 2 setiap jam. Setelah $n$ jam ada $2^n$ sel: 1, 2, 4, 8, 16, $\\ldots$ Setiap batang dua kali batang sebelumnya.\n\n- $a^n$ berarti $a$ dikalikan dengan dirinya sendiri $n$ kali, dan $a^0=1$.\n- Mundur satu langkah berarti dibagi 2: $2^0=1$, jadi $2^{-1}=\\frac{1}{2}$ dan $2^{-2}=\\frac{1}{4}$. Itulah sebabnya $a^{-n}=\\frac{1}{a^n}$.\n- **Akar** adalah eksponen pecahan: $a^{\\frac{1}{2}}=\\sqrt{a}$, $a^{\\frac{1}{3}}=\\sqrt[3]{a}$, dan $a^{\\frac{m}{n}}=\\sqrt[n]{a^m}$.',
          ),
          figure: {
            ...barChart({
              bars: [
                { label: '2⁰', value: 1, color: 'a' },
                { label: '2¹', value: 2, color: 'b' },
                { label: '2²', value: 4, color: 'c' },
                { label: '2³', value: 8, color: 'result' },
                { label: '2⁴', value: 16, color: 'a' },
              ],
              max: 16,
              step: 4,
            }),
            caption: L('Powers of 2: each bar doubles the one before.', 'Pangkat dari 2: tiap batang dua kali batang sebelumnya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Laws of Exponents', 'Contoh Bertahap: Hukum Eksponen'),
          body: L(
            'For $a,b>0$ and any exponents $m,n$:\n\n| Law | Example |\n|---|---|\n| $a^m\\cdot a^n=a^{m+n}$ | $3^2\\cdot3^4=3^6$ |\n| $\\frac{a^m}{a^n}=a^{m-n}$ | $\\frac{5^7}{5^3}=5^4$ |\n| $(a^m)^n=a^{mn}$ | $(2^3)^2=2^6$ |\n| $(ab)^n=a^nb^n$ | $(2x)^3=8x^3$ |\n\nSimplify $\\frac{(x^2)^3\\cdot x^{-4}}{x^{5}}$.\n\n1. Step 1: Power of a power: $(x^2)^3=x^6$.\n2. Step 2: Same base, add the exponents on top: $x^6\\cdot x^{-4}=x^{2}$.\n3. Step 3: Divide by subtracting: $\\frac{x^2}{x^5}=x^{-3}=\\frac{1}{x^3}$.\n\nFractional exponents follow the same laws: $8^{\\frac{2}{3}}=(\\sqrt[3]{8})^2=2^2=4$ and $27^{-\\frac{1}{3}}=\\frac{1}{\\sqrt[3]{27}}=\\frac{1}{3}$.',
            'Untuk $a,b>0$ dan sembarang eksponen $m,n$:\n\n| Sifat | Contoh |\n|---|---|\n| $a^m\\cdot a^n=a^{m+n}$ | $3^2\\cdot3^4=3^6$ |\n| $\\frac{a^m}{a^n}=a^{m-n}$ | $\\frac{5^7}{5^3}=5^4$ |\n| $(a^m)^n=a^{mn}$ | $(2^3)^2=2^6$ |\n| $(ab)^n=a^nb^n$ | $(2x)^3=8x^3$ |\n\nSederhanakan $\\frac{(x^2)^3\\cdot x^{-4}}{x^{5}}$.\n\n1. Langkah 1: Pangkat dari pangkat: $(x^2)^3=x^6$.\n2. Langkah 2: Basis sama, jumlahkan eksponen di atas: $x^6\\cdot x^{-4}=x^{2}$.\n3. Langkah 3: Bagi dengan mengurangkan: $\\frac{x^2}{x^5}=x^{-3}=\\frac{1}{x^3}$.\n\nEksponen pecahan mengikuti sifat yang sama: $8^{\\frac{2}{3}}=(\\sqrt[3]{8})^2=2^2=4$ dan $27^{-\\frac{1}{3}}=\\frac{1}{\\sqrt[3]{27}}=\\frac{1}{3}$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Simplifying and Rationalising Roots', 'Contoh Bertahap: Menyederhanakan dan Merasionalkan Akar'),
          body: L(
            'The square in the picture has area 12, so its side is $\\sqrt{12}$.\n\n**Simplify a root:** pull out the biggest perfect square factor. $12=4\\times3$, so $\\sqrt{12}=\\sqrt{4}\\cdot\\sqrt{3}=2\\sqrt{3}$.\n\nThe rules: $\\sqrt{ab}=\\sqrt{a}\\sqrt{b}$ and $\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{a}}{\\sqrt{b}}$. But $\\sqrt{a+b}\\neq\\sqrt{a}+\\sqrt{b}$: $\\sqrt{9+16}=5$, not $3+4$.\n\n**Rationalise a denominator** (remove the root from the bottom):\n\n- One root: $\\frac{6}{\\sqrt{3}}=\\frac{6\\sqrt{3}}{\\sqrt{3}\\cdot\\sqrt{3}}=\\frac{6\\sqrt{3}}{3}=2\\sqrt{3}$.\n- Two terms: multiply by the **conjugate**. $\\frac{1}{\\sqrt{5}-2}\\cdot\\frac{\\sqrt{5}+2}{\\sqrt{5}+2}=\\frac{\\sqrt{5}+2}{5-4}=\\sqrt{5}+2$, because $(a-b)(a+b)=a^2-b^2$.',
            'Persegi pada gambar luasnya 12, jadi sisinya $\\sqrt{12}$.\n\n**Menyederhanakan akar:** keluarkan faktor kuadrat sempurna terbesar. $12=4\\times3$, jadi $\\sqrt{12}=\\sqrt{4}\\cdot\\sqrt{3}=2\\sqrt{3}$.\n\nAturannya: $\\sqrt{ab}=\\sqrt{a}\\sqrt{b}$ dan $\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{a}}{\\sqrt{b}}$. Tetapi $\\sqrt{a+b}\\neq\\sqrt{a}+\\sqrt{b}$: $\\sqrt{9+16}=5$, bukan $3+4$.\n\n**Merasionalkan penyebut** (menghilangkan akar dari bawah):\n\n- Satu akar: $\\frac{6}{\\sqrt{3}}=\\frac{6\\sqrt{3}}{\\sqrt{3}\\cdot\\sqrt{3}}=\\frac{6\\sqrt{3}}{3}=2\\sqrt{3}$.\n- Dua suku: kalikan dengan **sekawannya**. $\\frac{1}{\\sqrt{5}-2}\\cdot\\frac{\\sqrt{5}+2}{\\sqrt{5}+2}=\\frac{\\sqrt{5}+2}{5-4}=\\sqrt{5}+2$, karena $(a-b)(a+b)=a^2-b^2$.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [4, 0], [4, 4], [0, 4]],
              names: 'ABCD',
              rights: [0, 1, 2, 3],
              extra: [txt(2, 2, '12', 'lg', 'muted')],
            }),
            caption: L('A square of area 12.', 'Sebuah persegi dengan luas 12.'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A square has area 12 (see the picture). Its perimeter is',
            'Sebuah persegi luasnya 12 (lihat gambar). Kelilingnya adalah',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [4, 0], [4, 4], [0, 4]],
              rights: [0, 1, 2, 3],
              extra: [txt(2, 2, '12', 'lg', 'muted')],
            }),
            caption: L('A square. Its area is written inside.', 'Sebuah persegi. Luasnya ditulis di dalam.'),
          },
          options: [L('$8\\sqrt{3}$', '$8\\sqrt{3}$'), L('$12$', '$12$'), L('$4\\sqrt{3}$', '$4\\sqrt{3}$'), L('$6\\sqrt{2}$', '$6\\sqrt{2}$')],
          answer: 0,
          explain: L(
            'The side is $\\sqrt{12}=2\\sqrt{3}$, so the perimeter is $4\\times2\\sqrt{3}=8\\sqrt{3}$.',
            'Sisinya $\\sqrt{12}=2\\sqrt{3}$, jadi kelilingnya $4\\times2\\sqrt{3}=8\\sqrt{3}$.',
          ),
          hint: L(
            'First find the side from the area, simplify it, then multiply by 4.',
            'Cari dulu sisi dari luasnya, sederhanakan, lalu kalikan 4.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: rationalise $\\frac{6}{\\sqrt{3}}$.',
            'Coba bersama: rasionalkan $\\frac{6}{\\sqrt{3}}$.',
          ),
          template: '\\frac{6}{\\sqrt{3}}=\\frac{6\\sqrt{3}}{___}=___\\sqrt{3}',
          blanks: ['3', '2'],
          explain: L(
            'Multiplying top and bottom by $\\sqrt{3}$ makes the bottom $\\sqrt{3}\\cdot\\sqrt{3}=3$. Then $\\frac{6\\sqrt{3}}{3}=2\\sqrt{3}$.',
            'Mengalikan atas dan bawah dengan $\\sqrt{3}$ membuat bagian bawah $\\sqrt{3}\\cdot\\sqrt{3}=3$. Lalu $\\frac{6\\sqrt{3}}{3}=2\\sqrt{3}$.',
          ),
          hint: L(
            'What is $\\sqrt{3}\\times\\sqrt{3}$? Then divide 6 by that.',
            'Berapa $\\sqrt{3}\\times\\sqrt{3}$? Lalu bagi 6 dengan hasilnya.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO numbers that equal $\\frac{1}{8}$.', 'Pilih DUA bilangan yang sama dengan $\\frac{1}{8}$.'),
          options: [
            L('$2^{-3}$', '$2^{-3}$'),
            L('$8^{-1}$', '$8^{-1}$'),
            L('$2^{-\\frac{1}{3}}$', '$2^{-\\frac{1}{3}}$'),
            L('$-2^{3}$', '$-2^{3}$'),
          ],
          answer: [0, 1],
          explain: L(
            '$2^{-3}=\\frac{1}{2^3}=\\frac{1}{8}$ and $8^{-1}=\\frac{1}{8}$. But $2^{-\\frac{1}{3}}=\\frac{1}{\\sqrt[3]{2}}$ and $-2^3=-8$.',
            '$2^{-3}=\\frac{1}{2^3}=\\frac{1}{8}$ dan $8^{-1}=\\frac{1}{8}$. Namun $2^{-\\frac{1}{3}}=\\frac{1}{\\sqrt[3]{2}}$ dan $-2^3=-8$.',
          ),
          hint: L(
            'A negative exponent means one over the power. Check what the exponent is attached to.',
            'Eksponen negatif berarti satu per pangkatnya. Periksa eksponen itu menempel pada apa.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$(a^2)^3=a^5$', '$(a^2)^3=a^5$'),
            L('$a^{-2}=\\frac{1}{a^2}$ for $a\\neq0$', '$a^{-2}=\\frac{1}{a^2}$ untuk $a\\neq0$'),
            L('$\\sqrt{18}=3\\sqrt{2}$', '$\\sqrt{18}=3\\sqrt{2}$'),
            L('$\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}$ for all $a,b>0$', '$\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}$ untuk semua $a,b>0$'),
          ],
          answer: [false, true, true, false],
          explain: L(
            '$(a^2)^3=a^{2\\times3}=a^6$. A negative exponent flips: $a^{-2}=\\frac{1}{a^2}$. $18=9\\times2$, so $\\sqrt{18}=3\\sqrt{2}$. And $\\sqrt{9+16}=5\\neq7$ shows the last one is false.',
            '$(a^2)^3=a^{2\\times3}=a^6$. Eksponen negatif membalik: $a^{-2}=\\frac{1}{a^2}$. $18=9\\times2$, jadi $\\sqrt{18}=3\\sqrt{2}$. Dan $\\sqrt{9+16}=5\\neq7$ menunjukkan yang terakhir salah.',
          ),
          hint: L(
            'For a power of a power, multiply the exponents. Test the last statement with $a=9,b=16$.',
            'Untuk pangkat dari pangkat, kalikan eksponennya. Uji pernyataan terakhir dengan $a=9,b=16$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'If $9^{x-1}=27$, find $x$.',
            'Jika $9^{x-1}=27$, tentukan $x$.',
          ),
          blanks: [{ label: 'x =', answer: 2.5 }],
          hints: [
            L('Write both sides as a power of the same base. Which base works for 9 and 27?', 'Tulis kedua ruas sebagai pangkat dari basis yang sama. Basis apa yang cocok untuk 9 dan 27?'),
            L('$9=3^2$ and $27=3^3$, so $(3^2)^{x-1}=3^3$, which is $3^{2(x-1)}=3^3$.', '$9=3^2$ dan $27=3^3$, jadi $(3^2)^{x-1}=3^3$, yaitu $3^{2(x-1)}=3^3$.'),
            L('Equal bases mean equal exponents: $2(x-1)=3$.', 'Basis sama berarti eksponen sama: $2(x-1)=3$.'),
          ],
          explain: L(
            '$2(x-1)=3$ gives $x-1=\\frac{3}{2}$, so $x=\\frac{5}{2}=2.5$.',
            '$2(x-1)=3$ memberi $x-1=\\frac{3}{2}$, jadi $x=\\frac{5}{2}=2{,}5$.',
          ),
          solution: {
            en: ['(3^2)^{x-1}=3^3 \\Rightarrow 3^{2x-2}=3^3', '2x-2=3', 'x=\\frac{5}{2}=2.5'],
            id: ['(3^2)^{x-1}=3^3 \\Rightarrow 3^{2x-2}=3^3', '2x-2=3', 'x=\\frac{5}{2}=2{,}5'],
          },
        },
      ],
    },
    /* ----------------------------------------------------------------- L2 logarithms */
    {
      id: 'tka-sma-m1-s2-l2',
      title: L('Logarithms', 'Logaritma'),
      goal: L(
        'You can read a logarithm as an exponent, use the laws of logarithms, and solve a simple equation with a logarithm.',
        'Kamu bisa membaca logaritma sebagai eksponen, memakai sifat-sifat logaritma, dan menyelesaikan persamaan sederhana dengan logaritma.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: The Question a Logarithm Asks', 'Ayo Amati: Pertanyaan yang Diajukan Logaritma'),
          body: L(
            '$2^3=8$ answers "what is 2 to the power 3?". The **logarithm** asks the opposite: "2 to which power gives 8?" The answer is $\\log_2 8=3$.\n\n$$\\log_a b=c\\iff a^c=b\\qquad(a>0,\\ a\\neq1,\\ b>0)$$\n\n- $\\log_2 32=5$ because $2^5=32$.\n- $\\log_3\\frac{1}{9}=-2$ because $3^{-2}=\\frac{1}{9}$.\n- $\\log_a 1=0$ and $\\log_a a=1$.\n- "$\\log$" with no base means base 10: $\\log 1000=3$.\n\nThe graph of $y=2^x$ is shown. The red dot $(3,8)$ says $2^3=8$, that is $\\log_2 8=3$: the logarithm reads the graph the other way round, from the height back to the exponent.',
            '$2^3=8$ menjawab "berapa 2 pangkat 3?". **Logaritma** bertanya sebaliknya: "2 dipangkatkan berapa agar hasilnya 8?" Jawabannya $\\log_2 8=3$.\n\n$$\\log_a b=c\\iff a^c=b\\qquad(a>0,\\ a\\neq1,\\ b>0)$$\n\n- $\\log_2 32=5$ karena $2^5=32$.\n- $\\log_3\\frac{1}{9}=-2$ karena $3^{-2}=\\frac{1}{9}$.\n- $\\log_a 1=0$ dan $\\log_a a=1$.\n- "$\\log$" tanpa basis berarti basis 10: $\\log 1000=3$.\n\nGrafik $y=2^x$ ditampilkan. Titik merah $(3,8)$ berarti $2^3=8$, yaitu $\\log_2 8=3$: logaritma membaca grafik dari arah sebaliknya, dari tinggi kembali ke eksponen.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2^x', from: -2, to: 3.4, color: 'a' },
                dot([3, 8], '(3, 8)', 'result'),
                dot([0, 1], undefined, 'b'),
              ],
              { x: [-3, 5], y: [-1, 10] },
            ),
            caption: L('The graph of y = 2^x. The red dot is (3, 8).', 'Grafik y = 2^x. Titik merah adalah (3, 8).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: The Laws of Logarithms', 'Contoh Bertahap: Sifat-Sifat Logaritma'),
          body: L(
            'Because a logarithm is an exponent, the laws of exponents turn into laws of logarithms:\n\n| Law | Example |\n|---|---|\n| $\\log_a(xy)=\\log_a x+\\log_a y$ | $\\log 2+\\log 50=\\log 100=2$ |\n| $\\log_a\\frac{x}{y}=\\log_a x-\\log_a y$ | $\\log_2 24-\\log_2 3=\\log_2 8=3$ |\n| $\\log_a x^n=n\\log_a x$ | $\\log_3 81=\\log_3 3^4=4$ |\n| $\\log_a b=\\frac{\\log_c b}{\\log_c a}$ | $\\log_4 8=\\frac{\\log_2 8}{\\log_2 4}=\\frac{3}{2}$ |\n\nSimplify $\\log_6 4+\\log_6 9$.\n\n1. Step 1: Same base, so add means multiply inside: $\\log_6(4\\times9)$.\n2. Step 2: $4\\times9=36$.\n3. Step 3: $\\log_6 36=2$, because $6^2=36$.',
            'Karena logaritma adalah eksponen, sifat eksponen berubah menjadi sifat logaritma:\n\n| Sifat | Contoh |\n|---|---|\n| $\\log_a(xy)=\\log_a x+\\log_a y$ | $\\log 2+\\log 50=\\log 100=2$ |\n| $\\log_a\\frac{x}{y}=\\log_a x-\\log_a y$ | $\\log_2 24-\\log_2 3=\\log_2 8=3$ |\n| $\\log_a x^n=n\\log_a x$ | $\\log_3 81=\\log_3 3^4=4$ |\n| $\\log_a b=\\frac{\\log_c b}{\\log_c a}$ | $\\log_4 8=\\frac{\\log_2 8}{\\log_2 4}=\\frac{3}{2}$ |\n\nSederhanakan $\\log_6 4+\\log_6 9$.\n\n1. Langkah 1: Basis sama, jadi menjumlah berarti mengalikan di dalam: $\\log_6(4\\times9)$.\n2. Langkah 2: $4\\times9=36$.\n3. Langkah 3: $\\log_6 36=2$, karena $6^2=36$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Mistakes and a Logarithm Equation', 'Awas, Jebakan!: Kesalahan dan Persamaan Logaritma'),
          body: L(
            'Two mistakes appear again and again:\n\n| Wrong | Right |\n|---|---|\n| $\\log(x+y)=\\log x+\\log y$ | $\\log(xy)=\\log x+\\log y$ (the product, not the sum) |\n| $\\frac{\\log x}{\\log y}=\\log x-\\log y$ | $\\log\\frac{x}{y}=\\log x-\\log y$ (a quotient inside, not two logarithms divided) |\n\nSolve $\\log_2(x+1)=4$.\n\n1. Step 1: Rewrite as a power: $x+1=2^4=16$.\n2. Step 2: Solve: $x=15$.\n3. Step 3: Check that the inside is positive: $15+1=16>0$. A logarithm needs a positive number inside, so always check.\n\nThe graph of $y=\\log_2 x$ is the graph of $y=2^x$ reflected in the line $y=x$. It passes through $(1,0)$ and $(2,1)$ and exists only for $x>0$.',
            'Dua kesalahan sering muncul:\n\n| Salah | Benar |\n|---|---|\n| $\\log(x+y)=\\log x+\\log y$ | $\\log(xy)=\\log x+\\log y$ (hasil kali, bukan jumlah) |\n| $\\frac{\\log x}{\\log y}=\\log x-\\log y$ | $\\log\\frac{x}{y}=\\log x-\\log y$ (hasil bagi di dalam, bukan dua logaritma yang dibagi) |\n\nSelesaikan $\\log_2(x+1)=4$.\n\n1. Langkah 1: Tulis sebagai pangkat: $x+1=2^4=16$.\n2. Langkah 2: Selesaikan: $x=15$.\n3. Langkah 3: Periksa bahwa isi di dalam positif: $15+1=16>0$. Logaritma memerlukan bilangan positif di dalamnya, jadi selalu periksa.\n\nGrafik $y=\\log_2 x$ adalah grafik $y=2^x$ yang dicerminkan terhadap garis $y=x$. Grafik ini melalui $(1,0)$ dan $(2,1)$ dan hanya ada untuk $x>0$.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2^x', from: -3, to: 3.3, color: 'a' },
                { t: 'curve', f: 'log2(x)', from: 0.12, to: 8, color: 'b' },
                { t: 'curve', f: 'x', from: -3, to: 8, color: 'muted', dashed: true },
              ],
              { x: [-3, 8], y: [-3, 8] },
            ),
            caption: L(
              'y = 2^x (green) and y = log2 x (orange) mirror each other in the dashed line y = x.',
              'y = 2^x (hijau) dan y = log2 x (oranye) saling mencerminkan pada garis putus-putus y = x.',
            ),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows $y=2^x$. The red dot is the point $(3,8)$. What is $\\log_2 8$?',
            'Grafik menunjukkan $y=2^x$. Titik merah adalah titik $(3,8)$. Berapa $\\log_2 8$?',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2^x', from: -2, to: 3.4, color: 'a' },
                dot([3, 8], '(3, 8)', 'result'),
              ],
              { x: [-3, 5], y: [-1, 10] },
            ),
            caption: L('The graph of y = 2^x.', 'Grafik y = 2^x.'),
          },
          options: [L('3', '3'), L('8', '8'), L('$\\frac{1}{3}$', '$\\frac{1}{3}$'), L('2', '2')],
          answer: 0,
          explain: L(
            '$\\log_2 8$ asks: 2 to which power gives 8? The dot says $2^3=8$, so the answer is 3, the exponent (the first coordinate).',
            '$\\log_2 8$ bertanya: 2 dipangkatkan berapa untuk mendapat 8? Titik itu menyatakan $2^3=8$, jadi jawabannya 3, yaitu eksponen (koordinat pertama).',
          ),
          hint: L(
            'A logarithm is an exponent. Which coordinate of the dot is the exponent?',
            'Logaritma adalah eksponen. Koordinat titik yang mana yang merupakan eksponen?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the two logarithms.',
            'Coba bersama: tentukan kedua logaritma ini.',
          ),
          template: '\\log_2 32=___ \\quad \\log_3\\frac{1}{9}=___',
          blanks: ['5', '-2'],
          explain: L(
            '$2^5=32$ and $3^{-2}=\\frac{1}{9}$.',
            '$2^5=32$ dan $3^{-2}=\\frac{1}{9}$.',
          ),
          hint: L(
            'Ask: the base to which power gives the number? A fraction like $\\frac{1}{9}$ needs a negative power.',
            'Tanyakan: basis dipangkatkan berapa untuk mendapat bilangan itu? Pecahan seperti $\\frac{1}{9}$ memerlukan pangkat negatif.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true equalities.', 'Pilih DUA kesamaan yang benar.'),
          options: [
            L('$\\log_2 16=4$', '$\\log_2 16=4$'),
            L('$\\log 20+\\log 5=2$', '$\\log 20+\\log 5=2$'),
            L('$\\log_3 9=3$', '$\\log_3 9=3$'),
            L('$\\log 2\\cdot\\log 5=\\log 10$', '$\\log 2\\cdot\\log 5=\\log 10$'),
          ],
          answer: [0, 1],
          explain: L(
            '$2^4=16$, and $\\log 20+\\log 5=\\log 100=2$. But $\\log_3 9=2$, and the sum of logarithms is the logarithm of a **product**, not the product of logarithms.',
            '$2^4=16$, dan $\\log 20+\\log 5=\\log 100=2$. Namun $\\log_3 9=2$, dan jumlah logaritma adalah logaritma dari **hasil kali**, bukan hasil kali logaritma.',
          ),
          hint: L(
            'Rewrite each logarithm as a power, and combine sums of logarithms into one.',
            'Tulis tiap logaritma sebagai pangkat, dan gabungkan jumlah logaritma menjadi satu.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$\\log_5 1=0$', '$\\log_5 1=0$'),
            L('$\\log(x+y)=\\log x+\\log y$', '$\\log(x+y)=\\log x+\\log y$'),
            L('$\\log_2 8^2=6$', '$\\log_2 8^2=6$'),
            L('$\\log_4 8=\\frac{3}{2}$', '$\\log_4 8=\\frac{3}{2}$'),
          ],
          answer: [true, false, true, true],
          explain: L(
            '$5^0=1$. The second is false (try $x=y=10$: $\\log20\\neq2$). $\\log_2 8^2=2\\log_2 8=2\\times3=6$. And $\\log_4 8=\\frac{\\log_2 8}{\\log_2 4}=\\frac{3}{2}$, since $4^{3/2}=8$.',
            '$5^0=1$. Yang kedua salah (coba $x=y=10$: $\\log20\\neq2$). $\\log_2 8^2=2\\log_2 8=2\\times3=6$. Dan $\\log_4 8=\\frac{\\log_2 8}{\\log_2 4}=\\frac{3}{2}$, sebab $4^{3/2}=8$.',
          ),
          hint: L(
            'For the last one, check whether $4^{\\frac{3}{2}}=8$.',
            'Untuk yang terakhir, periksa apakah $4^{\\frac{3}{2}}=8$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Solve $\\log_3(2x-1)=2$.',
            'Selesaikan $\\log_3(2x-1)=2$.',
          ),
          blanks: [{ label: 'x =', answer: 5 }],
          hints: [
            L('Turn the logarithm into a power: $\\log_a b=c$ means $a^c=b$.', 'Ubah logaritma menjadi pangkat: $\\log_a b=c$ berarti $a^c=b$.'),
            L('So $2x-1=3^2=9$.', 'Jadi $2x-1=3^2=9$.'),
            L('Solve the linear equation $2x-1=9$, then check that $2x-1>0$.', 'Selesaikan persamaan linear $2x-1=9$, lalu periksa bahwa $2x-1>0$.'),
          ],
          explain: L(
            '$2x-1=9$ gives $2x=10$ and $x=5$. Check: $2(5)-1=9>0$ and $\\log_3 9=2$.',
            '$2x-1=9$ memberi $2x=10$ dan $x=5$. Periksa: $2(5)-1=9>0$ dan $\\log_3 9=2$.',
          ),
          solution: {
            en: ['2x-1=3^2=9', '2x=10 \\Rightarrow x=5', '\\text{check: } \\log_3 9=2'],
            id: ['2x-1=3^2=9', '2x=10 \\Rightarrow x=5', '\\text{periksa: } \\log_3 9=2'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m1-s2-p',
    runtime: 'math',
    title: L('Exponents, Roots and Logarithms', 'Eksponen, Akar, dan Logaritma'),
    brief: L(
      'Simplify powers and roots, rationalise a denominator, and use logarithms to solve exponent equations.',
      'Sederhanakan pangkat dan akar, rasionalkan penyebut, dan pakai logaritma untuk menyelesaikan persamaan eksponen.',
    ),
    requirements: [
      L('Use the laws of exponents and the rules for roots.', 'Memakai hukum eksponen dan aturan akar.'),
      L('Use the laws of logarithms and solve equations.', 'Memakai sifat logaritma dan menyelesaikan persamaan.'),
    ],
    hints: [
      L('Write everything with the same base, then compare the exponents.', 'Tulis semuanya dengan basis yang sama, lalu bandingkan eksponennya.'),
      L('To rationalise $\\frac{1}{a+\\sqrt{b}}$, multiply by the conjugate $a-\\sqrt{b}$.', 'Untuk merasionalkan $\\frac{1}{a+\\sqrt{b}}$, kalikan dengan sekawannya $a-\\sqrt{b}$.'),
      L('A sum of logarithms with the same base is the logarithm of a product.', 'Jumlah logaritma dengan basis sama adalah logaritma dari hasil kali.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Find the value of each number.', 'Tentukan nilai tiap bilangan.'),
        inline: true,
        blanks: [
          { label: '16^{\\frac{3}{4}} =', answer: 8 },
          { label: '27^{-\\frac{1}{3}} =', answer: 1 / 3 },
        ],
        solution: ['16^{\\frac{3}{4}}=(\\sqrt[4]{16})^3=2^3=8', '27^{-\\frac{1}{3}}=\\frac{1}{\\sqrt[3]{27}}=\\frac{1}{3}'],
      },
      {
        prompt: L(
          'Write $\\frac{4}{\\sqrt{5}-1}$ as $a\\left(\\sqrt{5}+b\\right)$ with whole numbers $a$ and $b$.',
          'Tulis $\\frac{4}{\\sqrt{5}-1}$ sebagai $a\\left(\\sqrt{5}+b\\right)$ dengan bilangan bulat $a$ dan $b$.',
        ),
        inline: true,
        blanks: [
          { label: 'a =', answer: 1 },
          { label: 'b =', answer: 1 },
        ],
        solution: ['\\frac{4}{\\sqrt{5}-1}\\cdot\\frac{\\sqrt{5}+1}{\\sqrt{5}+1}=\\frac{4(\\sqrt{5}+1)}{5-1}', '=\\sqrt{5}+1=1\\cdot(\\sqrt{5}+1)'],
      },
      {
        prompt: L(
          'Solve $4^{x}=\\frac{1}{32}$.',
          'Selesaikan $4^{x}=\\frac{1}{32}$.',
        ),
        blanks: [{ label: 'x =', answer: -2.5 }],
        solution: {
          en: ['4^x=2^{2x} \\quad \\frac{1}{32}=2^{-5}', '2x=-5', 'x=-\\frac{5}{2}=-2.5'],
          id: ['4^x=2^{2x} \\quad \\frac{1}{32}=2^{-5}', '2x=-5', 'x=-\\frac{5}{2}=-2{,}5'],
        },
      },
      {
        prompt: L(
          'Find $\\log_2 12+\\log_2 \\frac{4}{3}$.',
          'Tentukan $\\log_2 12+\\log_2 \\frac{4}{3}$.',
        ),
        blanks: [{ answer: 4 }],
        solution: ['\\log_2 12+\\log_2\\frac{4}{3}=\\log_2\\left(12\\times\\frac{4}{3}\\right)', '=\\log_2 16=4'],
      },
      {
        prompt: L(
          'A culture of bacteria doubles every hour. It starts with 500 bacteria and has $500\\cdot2^t$ after $t$ hours. After how many hours are there 8 000 bacteria?',
          'Biakan bakteri berlipat dua setiap jam. Awalnya ada 500 bakteri dan setelah $t$ jam ada $500\\cdot2^t$. Setelah berapa jam bakteri berjumlah 8.000?',
        ),
        figure: {
          ...barChart({
            bars: [
              { label: '0', value: 500, color: 'a' },
              { label: '1', value: 1000, color: 'b' },
              { label: '2', value: 2000, color: 'c' },
              { label: '3', value: 4000, color: 'result' },
            ],
            max: 4000,
            step: 1000,
            showValues: false,
          }),
          caption: L('The number of bacteria after 0, 1, 2 and 3 hours.', 'Banyak bakteri setelah 0, 1, 2, dan 3 jam.'),
        },
        blanks: [{ label: 't =', answer: 4 }],
        solution: ['500\\cdot2^t=8000', '2^t=16 \\Rightarrow t=\\log_2 16=4'],
      },
    ],
  },
}
