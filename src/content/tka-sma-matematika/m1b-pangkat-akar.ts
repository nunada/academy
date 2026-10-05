import type { Submodule } from '../types'
import { L, barChart, shape, txt } from './figs'

/** Module 1, submodule 2 — exponents and roots (surds). */

export const m1s2: Submodule = {
  id: 'tka-sma-m1-s2',
  title: L('Exponents and Roots', 'Eksponen dan Akar'),
  summary: L(
    'Use the laws of exponents including negative and fractional ones, and simplify and rationalise roots.',
    'Memakai hukum eksponen termasuk yang negatif dan pecahan, serta menyederhanakan dan merasionalkan akar.',
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
          template: '\\sqrt{3}\\cdot\\sqrt{3}=___ \\qquad \\frac{6\\sqrt{3}}{3}=___\\sqrt{3}',
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
  ],
  project: {
    id: 'tka-sma-m1-s2-p',
    runtime: 'math',
    title: L('Exponents and Roots', 'Eksponen dan Akar'),
    brief: L(
      'Simplify powers and roots, rationalise a denominator, and solve exponent equations by matching bases.',
      'Sederhanakan pangkat dan akar, rasionalkan penyebut, dan selesaikan persamaan eksponen dengan menyamakan basis.',
    ),
    requirements: [
      L('Use the laws of exponents and the rules for roots.', 'Memakai hukum eksponen dan aturan akar.'),
      L('Solve exponent equations by writing both sides with the same base.', 'Menyelesaikan persamaan eksponen dengan menulis kedua ruas dengan basis yang sama.'),
    ],
    hints: [
      L('Write everything with the same base, then compare the exponents.', 'Tulis semuanya dengan basis yang sama, lalu bandingkan eksponennya.'),
      L('To rationalise $\\frac{1}{a+\\sqrt{b}}$, multiply by the conjugate $a-\\sqrt{b}$.', 'Untuk merasionalkan $\\frac{1}{a+\\sqrt{b}}$, kalikan dengan sekawannya $a-\\sqrt{b}$.'),
      L('Fractional exponents are roots: $a^{\\frac{m}{n}}=\\sqrt[n]{a^m}$.', 'Eksponen pecahan adalah akar: $a^{\\frac{m}{n}}=\\sqrt[n]{a^m}$.'),
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
          'Simplify $\\left(\\frac{1}{8}\\right)^{-\\frac{2}{3}}$.',
          'Sederhanakan $\\left(\\frac{1}{8}\\right)^{-\\frac{2}{3}}$.',
        ),
        blanks: [{ answer: 4 }],
        solution: ['\\left(\\frac{1}{8}\\right)^{-\\frac{2}{3}}=8^{\\frac{2}{3}}', '=(\\sqrt[3]{8})^2=2^2=4'],
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
        solution: ['500\\cdot2^t=8000 \\Rightarrow 2^t=16=2^4', 't=4'],
      },
    ],
  },
}
