import type { Module } from '../types'

/** Module 4 — inequalities behave like equations with one exception that
 *  changes everything: multiplying by a negative flips the direction. That
 *  single rule is why a sign diagram, not algebra alone, solves a nonlinear
 *  inequality. */
export const module4: Module = {
  id: 'dsr-m4',
  title: { en: 'Inequalities', id: 'Pertidaksamaan' },
  summary: {
    en: 'Linear, compound, and nonlinear inequalities solved with a sign diagram, absolute-value inequalities, and modeling with them.',
    id: 'Pertidaksamaan linear, gabungan, dan nonlinear yang diselesaikan dengan diagram tanda, pertidaksamaan nilai mutlak, dan memodelkan dengannya.',
  },
  submodules: [
    {
      id: 'dsr-m4-s1',
      title: { en: 'Solving Inequalities', id: 'Menyelesaikan Pertidaksamaan' },
      summary: {
        en: 'The one rule that differs from equations, the sign-diagram method for nonlinear inequalities, and absolute-value inequalities.',
        id: 'Satu aturan yang berbeda dari persamaan, metode diagram tanda untuk pertidaksamaan nonlinear, dan pertidaksamaan nilai mutlak.',
      },
      lessons: [
        {
          id: 'dsr-m4-s1-l1',
          title: { en: 'Linear and Compound Inequalities', id: 'Pertidaksamaan Linear dan Gabungan' },
          goal: {
            en: 'Solve a linear inequality, remembering to reverse it when multiplying by a negative, and solve a compound inequality.',
            id: 'Menyelesaikan pertidaksamaan linear, ingat membalikkannya saat mengalikan dengan bilangan negatif, dan menyelesaikan pertidaksamaan gabungan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The one rule that differs from equations', id: 'Satu aturan yang berbeda dari persamaan' },
              body: {
                en: 'Every rule for equations carries over to inequalities — **except** one. Adding or subtracting the same quantity from both sides preserves the inequality, and so does multiplying by a **positive** quantity. But multiplying (or dividing) by a **negative** quantity **reverses** the direction: multiplying $3 < 5$ by $-2$ gives $-6 > -10$, not $-6 < -10$.\n\nFor $3x < 9x+4$: subtract $9x$ to get $-6x<4$, then divide by $-6$ — and flip the inequality — to get $x > -\\frac{2}{3}$.',
                id: 'Setiap aturan untuk persamaan berlanjut ke pertidaksamaan — **kecuali** satu. Menambah atau mengurangi kuantitas yang sama pada kedua ruas mempertahankan pertidaksamaannya, begitu pula mengalikan dengan kuantitas **positif**. Tetapi mengalikan (atau membagi) dengan kuantitas **negatif** **membalik** arahnya: mengalikan $3 < 5$ dengan $-2$ memberi $-6 > -10$, bukan $-6 < -10$.\n\nUntuk $3x < 9x+4$: kurangi $9x$ untuk mendapat $-6x<4$, lalu bagi dengan $-6$ — dan balik pertidaksamaannya — untuk mendapat $x > -\\frac{2}{3}$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Compound inequalities', id: 'Pertidaksamaan gabungan' },
              body: {
                en: 'A compound inequality like $4 \\leq 3x-2 < 13$ says both $4 \\leq 3x-2$ and $3x-2<13$ at once — solve it by doing the same operation to **all three** parts simultaneously:\n$$4 \\leq 3x-2 < 13$$\nAdd $2$ to every part:\n$$6 \\leq 3x < 15$$\nDivide every part by $3$:\n$$2 \\leq x < 5$$\nThe solution is the interval $[2,5)$.',
                id: 'Pertidaksamaan gabungan seperti $4 \\leq 3x-2 < 13$ menyatakan $4 \\leq 3x-2$ dan $3x-2<13$ sekaligus — selesaikan dengan melakukan operasi yang sama pada **ketiga** bagian secara bersamaan:\n$$4 \\leq 3x-2 < 13$$\nTambahkan $2$ ke setiap bagian:\n$$6 \\leq 3x < 15$$\nBagi setiap bagian dengan $3$:\n$$2 \\leq x < 5$$\nSolusinya adalah interval $[2,5)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Solving $-4x < 12$ for $x$ gives:',
                id: 'Menyelesaikan $-4x < 12$ untuk $x$ memberi:',
              },
              options: [
                { en: '$x > -3$', id: '$x > -3$' },
                { en: '$x < -3$', id: '$x < -3$' },
                { en: '$x > 3$', id: '$x > 3$' },
                { en: '$x < 3$', id: '$x < 3$' },
              ],
              answer: 0,
              explain: {
                en: 'Dividing both sides by $-4$ (negative) reverses the inequality: $x > -3$.',
                id: 'Membagi kedua ruas dengan $-4$ (negatif) membalik pertidaksamaannya: $x > -3$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve the compound inequality $4 \\leq 3x - 2 < 13$, giving the interval.',
                id: 'Selesaikan pertidaksamaan gabungan $4 \\leq 3x - 2 < 13$, berikan intervalnya.',
              },
              template: '4 \\leq 3x - 2 < 13 \\ \\Rightarrow \\ x \\in ___',
              blanks: ['[2,5)'],
              explain: {
                en: 'Adding $2$ then dividing by $3$ across all three parts gives $2 \\leq x < 5$, i.e. $[2,5)$.',
                id: 'Menambah $2$ lalu membagi dengan $3$ pada ketiga bagian memberi $2 \\leq x < 5$, yaitu $[2,5)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Solve $-5x + 3 > 18$ for $x$, giving the boundary value.',
                id: 'Selesaikan $-5x + 3 > 18$ untuk $x$, berikan nilai batasnya.',
              },
              blanks: [{ answer: -3 }],
              hints: [
                { en: 'Subtract $3$, then divide by $-5$ — and reverse the inequality.', id: 'Kurangi $3$, lalu bagi dengan $-5$ — dan balik pertidaksamaannya.' },
              ],
              explain: {
                en: '$-5x>15 \\Rightarrow x<-3$ (dividing by $-5$ reverses the inequality). The boundary is $-3$.',
                id: '$-5x>15 \\Rightarrow x<-3$ (membagi dengan $-5$ membalik pertidaksamaannya). Batasnya adalah $-3$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m4-s1-l2',
          title: { en: 'Nonlinear Inequalities — the Sign-Diagram Method', id: 'Pertidaksamaan Nonlinear — Metode Diagram Tanda' },
          goal: {
            en: 'Solve a quadratic or rational inequality by factoring and building a sign diagram.',
            id: 'Menyelesaikan pertidaksamaan kuadrat atau rasional dengan memfaktorkan dan menyusun diagram tanda.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Five guidelines for a nonlinear inequality', id: 'Lima pedoman untuk pertidaksamaan nonlinear' },
              body: {
                en: 'A quadratic (or other nonlinear) inequality can\'t be isolated the way a linear one can — instead, move every term to one side, leaving $0$ on the other; **factor** the nonzero side; find the numbers where each factor is zero, which split the real line into **intervals**; pick a **test value** in each interval to find the sign of each factor there, and hence the sign of the whole product; and finally read off the intervals where the inequality holds, checking whether the endpoints themselves qualify.\n\nFor $x^2 < 5x+6$: rewrite as $x^2-5x-6<0$, factor as $(x-6)(x+1)<0$. The factors are zero at $x=-1$ and $x=6$.',
                id: 'Pertidaksamaan kuadrat (atau nonlinear lain) tak bisa diisolasi seperti pertidaksamaan linear — sebagai gantinya, pindahkan setiap suku ke satu ruas, menyisakan $0$ di ruas lain; **faktorkan** ruas taknolnya; cari bilangan di mana tiap faktor bernilai nol, yang membagi garis bilangan menjadi **interval**; pilih **nilai uji** pada tiap interval untuk mencari tanda tiap faktor di situ, dan karenanya tanda keseluruhan hasil kalinya; dan akhirnya baca interval di mana pertidaksamaannya berlaku, periksa apakah titik ujungnya sendiri memenuhi.\n\nUntuk $x^2 < 5x+6$: tulis ulang sebagai $x^2-5x-6<0$, faktorkan sebagai $(x-6)(x+1)<0$. Faktor-faktornya nol di $x=-1$ dan $x=6$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Building and reading the sign diagram', id: 'Menyusun dan membaca diagram tanda' },
              body: {
                en: 'The critical points $-1$ and $6$ split the line into three intervals. Pick one test value from each and check the sign of $(x-6)(x+1)$ there:\n$$x=-2: \\ (-)(-) = + \\qquad x=0: \\ (-)(+) = - \\qquad x=7: \\ (+)(+) = +$$\nSo the sign is $+$ on $(-\\infty,-1)$, $-$ on $(-1,6)$, and $+$ on $(6,\\infty)$ — a factor never changes sign inside one of these intervals, so a single test point speaks for the whole interval. We want where the product is **negative**: the solution is $(-1,6)$.',
                id: 'Titik kritis $-1$ dan $6$ membagi garisnya menjadi tiga interval. Ambil satu nilai uji dari tiap interval dan periksa tanda $(x-6)(x+1)$ di situ:\n$$x=-2: \\ (-)(-) = + \\qquad x=0: \\ (-)(+) = - \\qquad x=7: \\ (+)(+) = +$$\nJadi tandanya $+$ pada $(-\\infty,-1)$, $-$ pada $(-1,6)$, dan $+$ pada $(6,\\infty)$ — sebuah faktor tak pernah berganti tanda di dalam salah satu interval ini, sehingga satu titik uji mewakili seluruh intervalnya. Kita ingin di mana hasil kalinya **negatif**: solusinya $(-1,6)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For the inequality $(x-2)(x+5) > 0$, what are the critical points that split the real line?',
                id: 'Untuk pertidaksamaan $(x-2)(x+5) > 0$, apa titik kritis yang membagi garis bilangannya?',
              },
              options: [
                { en: '$x = 2$ and $x = -5$', id: '$x = 2$ dan $x = -5$' },
                { en: '$x = -2$ and $x = 5$', id: '$x = -2$ dan $x = 5$' },
                { en: '$x = 2$ and $x = 5$', id: '$x = 2$ dan $x = 5$' },
                { en: '$x = 0$ only', id: '$x = 0$ saja' },
              ],
              answer: 0,
              explain: {
                en: 'Each factor is zero where it vanishes: $x-2=0$ at $x=2$, and $x+5=0$ at $x=-5$.',
                id: 'Tiap faktor nol di tempat ia lenyap: $x-2=0$ di $x=2$, dan $x+5=0$ di $x=-5$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph of $y=(x-6)(x+1)$ below, on which interval is $y < 0$ (the parabola below the $x$-axis)?',
                id: 'Dengan membaca grafik $y=(x-6)(x+1)$ di bawah, pada interval mana $y < 0$ (parabola di bawah sumbu-$x$)?',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 9],
                ySpan: [-15, 20],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x-6)*(x+1)', color: 'a' },
                  { t: 'dot', x: -1, y: 0, color: 'muted' },
                  { t: 'dot', x: 6, y: 0, color: 'muted' },
                ],
              },
              options: [
                { en: '$(-1, 6)$', id: '$(-1, 6)$' },
                { en: '$(-\\infty, -1)$', id: '$(-\\infty, -1)$' },
                { en: '$(6, \\infty)$', id: '$(6, \\infty)$' },
                { en: '$(-\\infty, \\infty)$', id: '$(-\\infty, \\infty)$' },
              ],
              answer: 0,
              explain: {
                en: 'The parabola dips below the $x$-axis exactly between its two roots, $-1$ and $6$ — matching the sign diagram\'s result.',
                id: 'Parabolanya menukik di bawah sumbu-$x$ persis di antara kedua akarnya, $-1$ dan $6$ — cocok dengan hasil diagram tandanya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve $x^2 < 5x + 6$, giving the interval.',
                id: 'Selesaikan $x^2 < 5x + 6$, berikan intervalnya.',
              },
              template: 'x^2-5x-6<0 \\ \\Rightarrow \\ x \\in ___',
              blanks: ['(-1,6)'],
              explain: {
                en: 'Factoring gives $(x-6)(x+1)<0$, negative exactly between the roots: $(-1,6)$.',
                id: 'Memfaktorkan memberi $(x-6)(x+1)<0$, negatif persis di antara akar-akarnya: $(-1,6)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $(x-3)(x+2) < 0$, what is the smaller endpoint of the solution interval?',
                id: 'Untuk $(x-3)(x+2) < 0$, apa titik ujung yang lebih kecil dari interval solusinya?',
              },
              blanks: [{ answer: -2 }],
              hints: [
                { en: 'The product is negative strictly between the two roots.', id: 'Hasil kalinya negatif persis di antara kedua akarnya.' },
              ],
              explain: {
                en: 'The critical points are $x=3$ and $x=-2$; testing shows the product is negative on $(-2,3)$, so the smaller endpoint is $-2$.',
                id: 'Titik kritisnya $x=3$ dan $x=-2$; pengujian menunjukkan hasil kalinya negatif pada $(-2,3)$, sehingga titik ujung yang lebih kecil adalah $-2$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m4-s1-l3',
          title: { en: 'Absolute Value Inequalities, and Modeling', id: 'Pertidaksamaan Nilai Mutlak, dan Pemodelan' },
          goal: {
            en: 'Solve an absolute-value inequality, and model a real-world comparison with an inequality.',
            id: 'Menyelesaikan pertidaksamaan nilai mutlak, dan memodelkan perbandingan dunia nyata dengan pertidaksamaan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Absolute value inequalities as distance', id: 'Pertidaksamaan nilai mutlak sebagai jarak' },
              body: {
                en: 'For $c>0$:\n$$|x| < c \\iff -c<x<c, \\qquad |x| > c \\iff x<-c \\text{ or } x>c$$\nThese follow directly from $|x|$ being a distance from $0$: "closer than $c$" is between $-c$ and $c$; "farther than $c$" is beyond either end. Solving $|x-5|<2$: this says $-2<x-5<2$, so $3<x<7$ — the interval $(3,7)$.',
                id: 'Untuk $c>0$:\n$$|x| < c \\iff -c<x<c, \\qquad |x| > c \\iff x<-c \\text{ atau } x>c$$\nIni mengikuti langsung dari $|x|$ sebagai jarak dari $0$: "lebih dekat dari $c$" berarti di antara $-c$ dan $c$; "lebih jauh dari $c$" berarti melewati salah satu ujung. Menyelesaikan $|x-5|<2$: ini berarti $-2<x-5<2$, sehingga $3<x<7$ — interval $(3,7)$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Modeling a comparison', id: 'Memodelkan sebuah perbandingan' },
              body: {
                en: 'Company A charges ﹩19/day + ﹩0.40/mile; Company B charges ﹩68/day + ﹩0.26/mile. For a one-day rental, when is B cheaper?\n$$68 + 0.26x < 19 + 0.40x$$\n$$49 < 0.14x \\ \\Rightarrow \\ x > 350$$\nB is cheaper only once you drive more than $350$ miles — exactly the same four modeling guidelines from the equations module, just ending in an inequality instead of an equation.',
                id: 'Perusahaan A membebankan Rp190.000/hari + Rp4.000/mil; Perusahaan B membebankan Rp680.000/hari + Rp2.600/mil. Untuk sewa satu hari, kapan B lebih murah?\n$$680{.}000 + 2600x < 190{.}000 + 4000x$$\n$$490{.}000 < 1400x \\ \\Rightarrow \\ x > 350$$\nB hanya lebih murah begitu kamu menempuh lebih dari $350$ mil — persis empat pedoman pemodelan yang sama dari modul persamaan, hanya berakhir pada pertidaksamaan alih-alih persamaan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the solution of $|x + 3| > 4$?',
                id: 'Apa solusi dari $|x + 3| > 4$?',
              },
              options: [
                { en: '$x < -7$ or $x > 1$', id: '$x < -7$ atau $x > 1$' },
                { en: '$-7 < x < 1$', id: '$-7 < x < 1$' },
                { en: '$x > 1$ only', id: '$x > 1$ saja' },
                { en: '$x < -7$ only', id: '$x < -7$ saja' },
              ],
              answer: 0,
              explain: {
                en: '$|x+3|>4$ means $x+3<-4$ or $x+3>4$, giving $x<-7$ or $x>1$.',
                id: '$|x+3|>4$ berarti $x+3<-4$ atau $x+3>4$, memberi $x<-7$ atau $x>1$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve $|x - 5| < 2$, giving the interval.',
                id: 'Selesaikan $|x - 5| < 2$, berikan intervalnya.',
              },
              template: '|x-5|<2 \\ \\Rightarrow \\ x \\in ___',
              blanks: ['(3,7)'],
              explain: {
                en: '$-2<x-5<2 \\Rightarrow 3<x<7$, i.e. $(3,7)$.',
                id: '$-2<x-5<2 \\Rightarrow 3<x<7$, yaitu $(3,7)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Company C charges ﹩25/day + ﹩0.30/mile; Company D charges ﹩55/day + ﹩0.18/mile. For a one-day rental, beyond how many miles is D cheaper?',
                id: 'Perusahaan C membebankan Rp250.000/hari + Rp3.000/mil; Perusahaan D membebankan Rp550.000/hari + Rp1.800/mil. Untuk sewa satu hari, lewat berapa mil D lebih murah?',
              },
              blanks: [{ answer: 250 }],
              hints: [
                { en: 'Set up $55+0.18x < 25+0.30x$ and solve for $x$.', id: 'Susun $550{.}000+1800x < 250{.}000+3000x$ dan selesaikan untuk $x$.' },
              ],
              explain: {
                en: '$30<0.12x \\Rightarrow x>250$ miles.',
                id: '$300{.}000<1200x \\Rightarrow x>250$ mil.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m4-s1-p',
        runtime: 'math',
        title: { en: 'Solving Inequalities', id: 'Menyelesaikan Pertidaksamaan' },
        brief: {
          en: 'A compound inequality, a quadratic inequality solved with a sign diagram, and a rental-cost comparison.',
          id: 'Satu pertidaksamaan gabungan, satu pertidaksamaan kuadrat diselesaikan dengan diagram tanda, dan satu perbandingan biaya sewa.',
        },
        requirements: [
          { en: 'Multiplying or dividing an inequality by a negative number reverses its direction.', id: 'Mengalikan atau membagi pertidaksamaan dengan bilangan negatif membalik arahnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Solve $1 \\leq 2x + 5 < 11$. Give the smaller endpoint of the interval.', id: 'Selesaikan $1 \\leq 2x + 5 < 11$. Berikan titik ujung yang lebih kecil dari intervalnya.' },
            blanks: [{ answer: -2 }],
            solution: ['-4 \\leq 2x < 6 \\Rightarrow -2 \\leq x < 3'],
          },
          {
            prompt: { en: 'Solve $x^2 > 3x + 10$. Give the larger endpoint (or boundary) of the solution.', id: 'Selesaikan $x^2 > 3x + 10$. Berikan titik ujung (atau batas) yang lebih besar dari solusinya.' },
            blanks: [{ answer: 5 }],
            solution: ['x^2-3x-10>0 \\Rightarrow (x-5)(x+2)>0 \\Rightarrow x<-2 \\text{ or } x>5'],
          },
          {
            prompt: { en: 'Company E: ﹩15/day + ﹩0.45/mile. Company F: ﹩45/day + ﹩0.20/mile. Beyond how many miles is F cheaper for a one-day rental?', id: 'Perusahaan E: Rp150.000/hari + Rp4.500/mil. Perusahaan F: Rp450.000/hari + Rp2.000/mil. Lewat berapa mil F lebih murah untuk sewa satu hari?' },
            blanks: [{ answer: 120 }],
            solution: {
              en: ['45+0.20x<15+0.45x \\Rightarrow 30<0.25x \\Rightarrow x>120'],
              id: ['450{.}000+2000x<150{.}000+4500x \\Rightarrow 300{.}000<2500x \\Rightarrow x>120'],
            },
          },
        ],
        hints: [
          { en: 'For the quadratic task, the solution is a union of two rays — report the boundary value that separates them from the middle interval.', id: 'Untuk butir kuadrat, solusinya adalah gabungan dua sinar — laporkan nilai batas yang memisahkannya dari interval tengah.' },
        ],
        xp: 50,
      },
    },
  ],
}
