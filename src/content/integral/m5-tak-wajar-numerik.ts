import type { Module } from '../types'

/** Module 5 — two ways the definite integral gets stretched past where the
 *  Fundamental Theorem alone can reach: a bound that runs off to infinity, an
 *  integrand that blows up inside the interval, and (turning the problem
 *  around entirely) a function with no elementary antiderivative at all,
 *  handled by returning to the Riemann-sum idea Module 2 started with. */
export const module5: Module = {
  id: 'int-m5',
  title: { en: 'Improper Integrals and Numerical Integration', id: 'Integral Tak Wajar dan Integral Numerik' },
  summary: {
    en: 'Integrals over an infinite interval or across a vertical asymptote, and estimating an integral that has no elementary antiderivative.',
    id: 'Integral pada interval tak hingga atau melewati asimtot tegak, dan menaksir integral yang tak punya antiturunan elementer.',
  },
  submodules: [
    /* ------------------------------------------------------- 5.1 improper integrals */
    {
      id: 'int-m5-s1',
      title: { en: 'Improper Integrals', id: 'Integral Tak Wajar' },
      summary: {
        en: 'Making sense of an integral with an infinite bound or a blow-up in the integrand, by taking a limit of ordinary integrals.',
        id: 'Memaknai integral dengan batas tak hingga atau ledakan pada integrandnya, dengan mengambil limit dari integral biasa.',
      },
      lessons: [
        {
          id: 'int-m5-s1-l1',
          title: { en: 'Infinite Limits of Integration', id: 'Batas Integrasi Tak Hingga' },
          goal: {
            en: 'Define an integral over an infinite interval as a limit, and tell whether it converges or diverges.',
            id: 'Mendefinisikan integral pada interval tak hingga sebagai sebuah limit, dan menentukan apakah ia konvergen atau divergen.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Replacing infinity with a variable that runs toward it', id: 'Mengganti tak hingga dengan peubah yang berlari menujunya' },
              body: {
                en: 'The Fundamental Theorem needs two actual numbers to subtract — $\\infty$ is not one. An **improper integral** with an infinite bound is defined instead as a limit of ordinary integrals:\n$$\\int_a^\\infty f(x)\\,dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\,dx$$\nIf the limit exists (a finite number), the integral **converges** to it; otherwise it **diverges**. For $\\int_1^\\infty \\frac{1}{x^2}\\,dx$:\n$$\\lim_{t\\to\\infty}\\int_1^t x^{-2}\\,dx = \\lim_{t\\to\\infty}\\Big[-x^{-1}\\Big]_1^t = \\lim_{t\\to\\infty}\\left(-\\frac{1}{t}+1\\right) = 0+1 = 1$$\nAn infinitely long region under a curve can still enclose a perfectly finite area — this is the number that says how much.',
                id: 'Teorema Dasar memerlukan dua bilangan sungguhan untuk dikurangkan — $\\infty$ bukan salah satunya. **Integral tak wajar** dengan batas tak hingga sebagai gantinya didefinisikan sebagai limit dari integral biasa:\n$$\\int_a^\\infty f(x)\\,dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\,dx$$\nJika limitnya ada (sebuah bilangan hingga), integralnya **konvergen** ke situ; jika tidak, ia **divergen**. Untuk $\\int_1^\\infty \\frac{1}{x^2}\\,dx$:\n$$\\lim_{t\\to\\infty}\\int_1^t x^{-2}\\,dx = \\lim_{t\\to\\infty}\\Big[-x^{-1}\\Big]_1^t = \\lim_{t\\to\\infty}\\left(-\\frac{1}{t}+1\\right) = 0+1 = 1$$\nDaerah yang panjangnya tak hingga di bawah sebuah kurva masih bisa melingkupi luas yang sungguh-sungguh hingga — inilah bilangan yang menyatakan berapa banyak.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 6.5],
                ySpan: [-0.2, 2.2],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[1, 0], [1, 1], [2, 0.25], [3, 0.111], [4, 0.0625], [5, 0.04], [6, 0.0278], [6, 0]], color: 'result' },
                  { t: 'curve', f: '1/x^2', from: 1, to: 6, color: 'a' },
                ],
                caption: {
                  en: '$y = 1/x^2$ for $x \\geq 1$, shown out to $x = 6$ — the tail keeps thinning forever, but the total shaded area still converges to exactly $1$.',
                  id: '$y = 1/x^2$ untuk $x \\geq 1$, ditampilkan sampai $x = 6$ — ekornya terus menipis selamanya, tetapi total luas bayangannya tetap konvergen ke tepat $1$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A close relative that diverges instead', id: 'Kerabat dekat yang justru divergen' },
              body: {
                en: 'Change only the exponent: $\\int_1^\\infty \\frac{1}{x}\\,dx$.\n$$\\lim_{t\\to\\infty}\\int_1^t x^{-1}\\,dx = \\lim_{t\\to\\infty}\\Big[\\ln x\\Big]_1^t = \\lim_{t\\to\\infty}\\big(\\ln t - 0\\big) = \\infty$$\n$\\ln t$ grows without bound, however slowly, so the limit does not exist as a finite number — the integral **diverges**. $\\frac{1}{x^2}$ and $\\frac{1}{x}$ look almost identical far out, and both tend to $0$, but $\\frac{1}{x}$ does not shrink **fast enough** for its infinite tail to enclose a finite area. This single contrast is the seed of the general fact that $\\int_1^\\infty x^{-p}\\,dx$ converges exactly when $p>1$.',
                id: 'Ubah hanya pangkatnya: $\\int_1^\\infty \\frac{1}{x}\\,dx$.\n$$\\lim_{t\\to\\infty}\\int_1^t x^{-1}\\,dx = \\lim_{t\\to\\infty}\\Big[\\ln x\\Big]_1^t = \\lim_{t\\to\\infty}\\big(\\ln t - 0\\big) = \\infty$$\n$\\ln t$ bertambah tanpa batas, betapapun lambatnya, sehingga limitnya tak ada sebagai bilangan hingga — integralnya **divergen**. $\\frac{1}{x^2}$ dan $\\frac{1}{x}$ terlihat hampir identik jauh di sana, dan keduanya menuju $0$, tetapi $\\frac{1}{x}$ tak menyusut **cukup cepat** agar ekor tak hingganya melingkupi luas yang hingga. Kontras tunggal ini adalah benih dari fakta umum bahwa $\\int_1^\\infty x^{-p}\\,dx$ konvergen tepat ketika $p>1$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What determines whether an improper integral with an infinite bound converges or diverges?',
                id: 'Apa yang menentukan apakah integral tak wajar dengan batas tak hingga konvergen atau divergen?',
              },
              options: [
                { en: 'Whether the limit of ordinary integrals as $t$ approaches infinity comes out to a finite number', id: 'Apakah limit dari integral biasa saat $t$ menuju tak hingga menghasilkan bilangan hingga' },
                { en: 'Whether the integrand is positive everywhere', id: 'Apakah integrandnya positif di mana-mana' },
                { en: 'Whether the integrand has an elementary antiderivative', id: 'Apakah integrandnya punya antiturunan elementer' },
                { en: 'It always diverges when the bound is infinite', id: 'Selalu divergen ketika batasnya tak hingga' },
              ],
              answer: 0,
              explain: {
                en: 'Convergence is decided entirely by whether that defining limit exists as a finite number — $1/x^2$ does, $1/x$ does not, even though both are perfectly ordinary functions with elementary antiderivatives.',
                id: 'Konvergensi ditentukan sepenuhnya oleh apakah limit pendefinisiannya ada sebagai bilangan hingga — $1/x^2$ begitu, $1/x$ tidak, meski keduanya fungsi biasa dengan antiturunan elementer.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which integral converges: $\\int_1^\\infty \\frac{1}{x^3}\\,dx$, or $\\int_1^\\infty \\frac{1}{\\sqrt{x}}\\,dx$?',
                id: 'Manakah yang konvergen: $\\int_1^\\infty \\frac{1}{x^3}\\,dx$, atau $\\int_1^\\infty \\frac{1}{\\sqrt{x}}\\,dx$?',
              },
              options: [
                { en: '$1/x^3$, since its exponent $p = 3$ is greater than $1$', id: '$1/x^3$, sebab pangkatnya $p = 3$ lebih besar dari $1$' },
                { en: '$1/\\sqrt{x}$, since it shrinks toward zero', id: '$1/\\sqrt{x}$, sebab menyusut menuju nol' },
                { en: 'Both converge', id: 'Keduanya konvergen' },
                { en: 'Neither converges', id: 'Tak satu pun konvergen' },
              ],
              answer: 0,
              explain: {
                en: '$1/x^3$ has $p = 3 > 1$, so it converges. $1/\\sqrt{x} = x^{-1/2}$ has $p = 1/2 < 1$ — even though it shrinks toward zero, it does so too slowly, and its integral diverges just as $1/x$ did.',
                id: '$1/x^3$ punya $p = 3 > 1$, sehingga konvergen. $1/\\sqrt{x} = x^{-1/2}$ punya $p = 1/2 < 1$ — meski menyusut menuju nol, ia melakukannya terlalu lambat, dan integralnya divergen persis seperti $1/x$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\displaystyle\\int_1^\\infty \\frac{1}{x^3}\\,dx$.',
                id: 'Hitung $\\displaystyle\\int_1^\\infty \\frac{1}{x^3}\\,dx$.',
              },
              blanks: [{ answer: 0.5 }],
              hints: [
                { en: '$\\displaystyle\\int_1^t x^{-3}\\,dx = \\left[-\\tfrac{1}{2x^2}\\right]_1^t$.', id: '$\\displaystyle\\int_1^t x^{-3}\\,dx = \\left[-\\tfrac{1}{2x^2}\\right]_1^t$.' },
              ],
              explain: {
                en: '$\\lim_{t\\to\\infty}\\left(-\\tfrac{1}{2t^2}+\\tfrac12\\right) = 0+\\tfrac12 = 0.5$.',
                id: '$\\lim_{t\\to\\infty}\\left(-\\tfrac{1}{2t^2}+\\tfrac12\\right) = 0+\\tfrac12 = 0,5$.',
              },
            },
          ],
        },
        {
          id: 'int-m5-s1-l2',
          title: { en: 'Discontinuous Integrands', id: 'Integrand Diskontinu' },
          goal: {
            en: 'Define an integral across a vertical asymptote as a limit, and tell whether it converges or diverges.',
            id: 'Mendefinisikan integral yang melewati asimtot tegak sebagai sebuah limit, dan menentukan apakah ia konvergen atau divergen.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The other way an integral can be improper', id: 'Cara lain integral bisa menjadi tak wajar' },
              body: {
                en: 'An integral is also improper when the integrand itself blows up somewhere inside — or at an endpoint of — the interval. If $f$ is undefined at $x=a$ but continuous on $(a,b]$:\n$$\\int_a^b f(x)\\,dx = \\lim_{t \\to a^+} \\int_t^b f(x)\\,dx$$\nFor $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ (undefined at $x=0$):\n$$\\lim_{t\\to 0^+}\\int_t^1 x^{-1/2}\\,dx = \\lim_{t\\to 0^+}\\Big[2\\sqrt{x}\\Big]_t^1 = \\lim_{t\\to 0^+}\\big(2 - 2\\sqrt{t}\\big) = 2 - 0 = 2$$\nThe vertical asymptote at $x=0$ makes the region infinitely tall there, but — just as an infinitely long region could enclose a finite area — an infinitely tall one can too.',
                id: 'Integral juga tak wajar ketika integrandnya sendiri meledak di suatu tempat di dalam — atau di titik ujung — intervalnya. Jika $f$ tak terdefinisi di $x=a$ tetapi kontinu pada $(a,b]$:\n$$\\int_a^b f(x)\\,dx = \\lim_{t \\to a^+} \\int_t^b f(x)\\,dx$$\nUntuk $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ (tak terdefinisi di $x=0$):\n$$\\lim_{t\\to 0^+}\\int_t^1 x^{-1/2}\\,dx = \\lim_{t\\to 0^+}\\Big[2\\sqrt{x}\\Big]_t^1 = \\lim_{t\\to 0^+}\\big(2 - 2\\sqrt{t}\\big) = 2 - 0 = 2$$\nAsimtot tegak di $x=0$ membuat daerahnya tak hingga tingginya di situ, tetapi — persis seperti daerah yang tak hingga panjangnya bisa melingkupi luas yang hingga — yang tak hingga tingginya pun bisa juga.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.2, 1.3],
                ySpan: [-0.3, 4.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0.1, 0], [0.1, 3.162], [0.3, 1.826], [0.5, 1.414], [0.7, 1.195], [1, 1], [1, 0]], color: 'result' },
                  { t: 'curve', f: '1/sqrt(x)', from: 0.05, to: 1, color: 'a' },
                ],
                caption: {
                  en: '$y = 1/\\sqrt{x}$ on $(0, 1]$ — the curve shoots upward without bound near $x = 0$, yet the enclosed area still converges to exactly $2$.',
                  id: '$y = 1/\\sqrt{x}$ pada $(0, 1]$ — kurvanya melesat ke atas tanpa batas di dekat $x = 0$, namun luas yang dilingkupinya tetap konvergen ke tepat $2$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same contrast, one dimension rotated', id: 'Kontras yang sama, satu dimensi diputar' },
              body: {
                en: 'Just as $\\int_1^\\infty \\frac{1}{x}\\,dx$ diverged while $\\int_1^\\infty \\frac{1}{x^2}\\,dx$ converged, the discontinuous version shows the opposite pattern: $\\int_0^1 \\frac{1}{x}\\,dx$ diverges —\n$$\\lim_{t\\to 0^+}\\Big[\\ln x\\Big]_t^1 = \\lim_{t\\to 0^+}\\big(0 - \\ln t\\big) = 0 - (-\\infty) = \\infty$$\nsince $\\ln t \\to -\\infty$ as $t \\to 0^+$. But $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ converges, as just shown. Near a vertical asymptote a **smaller** exponent on $x$ in the denominator is the one that survives — the roles of "fast" and "slow" flip when the blow-up happens at a finite point instead of at infinity.',
                id: 'Persis seperti $\\int_1^\\infty \\frac{1}{x}\\,dx$ divergen sedangkan $\\int_1^\\infty \\frac{1}{x^2}\\,dx$ konvergen, versi diskontinunya menunjukkan pola yang berkebalikan: $\\int_0^1 \\frac{1}{x}\\,dx$ divergen —\n$$\\lim_{t\\to 0^+}\\Big[\\ln x\\Big]_t^1 = \\lim_{t\\to 0^+}\\big(0 - \\ln t\\big) = 0 - (-\\infty) = \\infty$$\nsebab $\\ln t \\to -\\infty$ ketika $t \\to 0^+$. Tetapi $\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$ konvergen, seperti baru saja ditunjukkan. Di dekat asimtot tegak, pangkat $x$ di penyebut yang **lebih kecil** itulah yang bertahan — peran "cepat" dan "lambat" terbalik ketika ledakannya terjadi di titik hingga, bukan di tak hingga.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is $\\displaystyle\\int_0^1 \\frac{1}{x}\\,dx$ improper?',
                id: 'Mengapa $\\displaystyle\\int_0^1 \\frac{1}{x}\\,dx$ tak wajar?',
              },
              options: [
                { en: 'The integrand is undefined at $x = 0$, an endpoint of the interval', id: 'Integrandnya tak terdefinisi di $x = 0$, titik ujung interval' },
                { en: 'The interval $[0, 1]$ is infinitely long', id: 'Interval $[0, 1]$ panjangnya tak hingga' },
                { en: 'It is not actually improper — this is an ordinary integral', id: 'Sebenarnya tak tak wajar — ini integral biasa' },
                { en: '$1/x$ has no antiderivative', id: '$1/x$ tak punya antiturunan' },
              ],
              answer: 0,
              explain: {
                en: '$1/x$ blows up as $x$ approaches $0$ from the right, exactly at the left endpoint of the interval — the integrand itself is the source of the impropriety, not the length of the interval.',
                id: '$1/x$ meledak ketika $x$ mendekati $0$ dari kanan, persis di titik ujung kiri intervalnya — integrandnya sendirilah sumber ketakwajarannya, bukan panjang intervalnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above of $y = 1/\\sqrt{x}$, what happens to the curve as $x$ approaches $0$ from the right?',
                id: 'Dengan membaca gambar di atas dari $y = 1/\\sqrt{x}$, apa yang terjadi pada kurvanya saat $x$ mendekati $0$ dari kanan?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.2, 1.3],
                ySpan: [-0.3, 4.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0.1, 0], [0.1, 3.162], [0.3, 1.826], [0.5, 1.414], [0.7, 1.195], [1, 1], [1, 0]], color: 'result' },
                  { t: 'curve', f: '1/sqrt(x)', from: 0.05, to: 1, color: 'a' },
                ],
              },
              options: [
                { en: 'It rises without bound, yet the shaded area under it still converges', id: 'Naik tanpa batas, namun luas bayangan di bawahnya tetap konvergen' },
                { en: 'It levels off at a finite height', id: 'Melandai pada ketinggian yang hingga' },
                { en: 'It crosses the x-axis', id: 'Memotong sumbu-x' },
                { en: 'It is not defined for any x shown in the figure', id: 'Tak terdefinisi untuk x mana pun yang ditampilkan pada gambar' },
              ],
              answer: 0,
              explain: {
                en: 'The curve shoots upward as $x$ shrinks toward $0$ — a vertical asymptote — yet the area it encloses with the axis converges to the finite value $2$.',
                id: 'Kurvanya melesat ke atas ketika $x$ menyusut menuju $0$ — sebuah asimtot tegak — namun luas yang dilingkupinya dengan sumbu tetap konvergen ke nilai hingga $2$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\displaystyle\\int_0^1 x^{-1/3}\\,dx$.',
                id: 'Hitung $\\displaystyle\\int_0^1 x^{-1/3}\\,dx$.',
              },
              blanks: [{ answer: 1.5 }],
              hints: [
                { en: 'Antiderivative: $\\tfrac32 x^{2/3}$. Take the limit as the lower bound approaches $0$.', id: 'Antiturunan: $\\tfrac32 x^{2/3}$. Ambil limitnya ketika batas bawah mendekati $0$.' },
              ],
              explain: {
                en: '$\\lim_{t\\to 0^+}\\left[\\tfrac32(1) - \\tfrac32 t^{2/3}\\right] = \\tfrac32 - 0 = 1.5$.',
                id: '$\\lim_{t\\to 0^+}\\left[\\tfrac32(1) - \\tfrac32 t^{2/3}\\right] = \\tfrac32 - 0 = 1,5$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m5-s1-p',
        runtime: 'math',
        title: { en: 'Converge or Diverge', id: 'Konvergen atau Divergen' },
        brief: {
          en: 'Two convergent improper integrals, one infinite and one discontinuous.',
          id: 'Dua integral tak wajar yang konvergen, satu tak hingga dan satu diskontinu.',
        },
        requirements: [
          { en: 'Replace the problematic bound with a variable, then take the limit as it approaches that bound.', id: 'Ganti batas yang bermasalah dengan sebuah peubah, lalu ambil limitnya saat peubah itu mendekati batas tersebut.' },
          { en: 'A finite limit means convergence; an infinite or nonexistent limit means divergence.', id: 'Limit yang hingga berarti konvergen; limit yang tak hingga atau tak ada berarti divergen.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\displaystyle\\int_2^\\infty \\frac{1}{x^2}\\,dx$.', id: 'Hitung $\\displaystyle\\int_2^\\infty \\frac{1}{x^2}\\,dx$.' },
            blanks: [{ answer: 0.5 }],
            solution: ['\\lim_{t\\to\\infty}\\left(-\\tfrac1t+\\tfrac12\\right) = \\tfrac12'],
          },
          {
            prompt: { en: 'Evaluate $\\displaystyle\\int_0^4 \\frac{1}{\\sqrt{x}}\\,dx$.', id: 'Hitung $\\displaystyle\\int_0^4 \\frac{1}{\\sqrt{x}}\\,dx$.' },
            blanks: [{ answer: 4 }],
            solution: ['\\lim_{t\\to0^+}\\left(2\\sqrt4-2\\sqrt t\\right) = 4-0 = 4'],
          },
          {
            prompt: { en: 'Evaluate $\\displaystyle\\int_1^\\infty e^{-x}\\,dx$.', id: 'Hitung $\\displaystyle\\int_1^\\infty e^{-x}\\,dx$.' },
            blanks: [{ answer: 1 / Math.E }],
            solution: ['\\lim_{t\\to\\infty}\\left(-e^{-t}+e^{-1}\\right) = 0+e^{-1} \\approx 0{,}37'],
          },
        ],
        hints: [
          { en: 'Part 3 needs the antiderivative of $e^{-x}$, which is $-e^{-x}$ (chain rule in reverse).', id: 'Butir 3 memerlukan antiturunan $e^{-x}$, yaitu $-e^{-x}$ (aturan rantai secara terbalik).' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------------- 5.2 numerical integration */
    {
      id: 'int-m5-s2',
      title: { en: 'Numerical Integration', id: 'Integral Numerik' },
      summary: {
        en: 'Estimating a definite integral with the trapezoidal rule and the more accurate Simpson\'s rule, for integrands no technique reaches exactly.',
        id: 'Menaksir integral tentu dengan aturan trapesium dan aturan Simpson yang lebih akurat, untuk integrand yang tak terjangkau teknik mana pun secara eksak.',
      },
      lessons: [
        {
          id: 'int-m5-s2-l1',
          title: { en: 'The Trapezoidal Rule', id: 'Aturan Trapesium' },
          goal: {
            en: 'Approximate a definite integral by replacing rectangles with trapezoids for a better fit against a curve.',
            id: 'Menghampiri integral tentu dengan mengganti persegi panjang dengan trapesium agar lebih pas terhadap kurva.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A slanted top fits a curve better than a flat one', id: 'Puncak miring lebih pas ke kurva dibanding yang datar' },
              body: {
                en: 'Some functions — like $e^{-x^2}$, central to statistics — have no elementary antiderivative at all, so the Fundamental Theorem simply cannot evaluate their definite integrals exactly. Approximation becomes the only option, and a **trapezoid** — connecting $f(x_i)$ to $f(x_{i+1})$ with a straight **slanted** top instead of a flat one — tracks a curve better than any rectangle can.\n\nFor $n$ strips of width $\\Delta x = \\frac{b-a}{n}$, each trapezoid has area $\\frac{\\Delta x}{2}\\big(f(x_i)+f(x_{i+1})\\big)$. Summing all $n$ and noticing every interior height is shared by two neighbouring trapezoids gives the **Trapezoidal Rule**:\n$$T_n = \\frac{\\Delta x}{2}\\Big[f(x_0) + 2f(x_1) + 2f(x_2) + \\cdots + 2f(x_{n-1}) + f(x_n)\\Big]$$\nevery interior point counted twice, the two endpoints once.',
                id: 'Beberapa fungsi — seperti $e^{-x^2}$, sentral dalam statistika — sama sekali tak punya antiturunan elementer, sehingga Teorema Dasar sekadar tak bisa menghitung integral tentunya secara eksak. Hampiran menjadi satu-satunya pilihan, dan sebuah **trapesium** — menghubungkan $f(x_i)$ ke $f(x_{i+1})$ dengan puncak lurus yang **miring**, bukan yang datar — mengikuti kurva lebih baik dibanding persegi panjang mana pun.\n\nUntuk $n$ jalur berlebar $\\Delta x = \\frac{b-a}{n}$, tiap trapesium punya luas $\\frac{\\Delta x}{2}\\big(f(x_i)+f(x_{i+1})\\big)$. Menjumlahkan semua $n$ dan menyadari tiap tinggi di dalamnya dipakai bersama oleh dua trapesium tetangga memberi **Aturan Trapesium**:\n$$T_n = \\frac{\\Delta x}{2}\\Big[f(x_0) + 2f(x_1) + 2f(x_2) + \\cdots + 2f(x_{n-1}) + f(x_n)\\Big]$$\nsetiap titik di dalamnya dihitung dua kali, kedua titik ujungnya sekali.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.5, 0], [0.5, 1.25], [0, 1]], color: 'muted' },
                  { t: 'poly', pts: [[0.5, 0], [1, 0], [1, 2], [0.5, 1.25]], color: 'muted' },
                  { t: 'poly', pts: [[1, 0], [1.5, 0], [1.5, 3.25], [1, 2]], color: 'muted' },
                  { t: 'poly', pts: [[1.5, 0], [2, 0], [2, 5], [1.5, 3.25]], color: 'muted' },
                  { t: 'curve', f: 'x^2+1', from: 0, to: 2, color: 'a' },
                ],
                caption: {
                  en: 'Four trapezoids under $f(x) = x^2 + 1$ on $[0, 2]$ — each slanted top hugs the curve, closer than a flat-topped rectangle ever could.',
                  id: 'Empat trapesium di bawah $f(x) = x^2 + 1$ pada $[0, 2]$ — tiap puncak miring merapat ke kurva, lebih dekat dari yang pernah bisa dicapai persegi panjang berpuncak datar.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same function this course has used before', id: 'Fungsi yang sama yang sudah dipakai kursus ini sebelumnya' },
              body: {
                en: 'Apply $T_4$ to $f(x) = x^2+1$ on $[0,2]$ — the exact running example from Module 2, where the true value was found to be $\\frac{14}{3} \\approx 4.667$. With $\\Delta x = 0.5$ and heights $1, 1.25, 2, 3.25, 5$:\n$$T_4 = \\frac{0.5}{2}\\big[1 + 2(1.25) + 2(2) + 2(3.25) + 5\\big] = 0.25\\big[1+2.5+4+6.5+5\\big] = 0.25(19) = 4.75$$\nCloser to $4.667$ than either one-sided Riemann sum from Module 2 ($3.75$ or $5.75$), though not exact — a straight slanted top still cannot trace a genuinely curved parabola perfectly.',
                id: 'Terapkan $T_4$ pada $f(x) = x^2+1$ pada $[0,2]$ — contoh berjalan yang eksak dari Modul 2, tempat nilai sebenarnya ditemukan sebagai $\\frac{14}{3} \\approx 4.667$. Dengan $\\Delta x = 0.5$ dan tinggi $1, 1.25, 2, 3.25, 5$:\n$$T_4 = \\frac{0.5}{2}\\big[1 + 2(1.25) + 2(2) + 2(3.25) + 5\\big] = 0.25\\big[1+2.5+4+6.5+5\\big] = 0.25(19) = 4.75$$\nLebih dekat ke $4.667$ dibanding jumlah Riemann satu sisi mana pun dari Modul 2 ($3.75$ atau $5.75$), meski belum eksak — puncak lurus yang miring masih tak bisa menjejaki parabola yang sungguh melengkung secara sempurna.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In the trapezoidal rule\'s sum, why are the interior heights multiplied by $2$ while the two endpoints are not?',
                id: 'Dalam jumlah aturan trapesium, mengapa tinggi di dalamnya dikalikan $2$ sedangkan kedua titik ujungnya tidak?',
              },
              options: [
                { en: 'Each interior height is shared by two neighbouring trapezoids, so it is counted once for each', id: 'Tiap tinggi di dalamnya dipakai bersama oleh dua trapesium tetangga, sehingga dihitung sekali untuk masing-masing' },
                { en: 'It is an arbitrary convention with no geometric reason', id: 'Ini konvensi sebarang tanpa alasan geometris' },
                { en: 'The endpoints are always exactly zero', id: 'Titik ujungnya selalu tepat nol' },
                { en: 'Doubling makes the estimate deliberately less accurate', id: 'Menggandakan sengaja membuat taksirannya kurang akurat' },
              ],
              answer: 0,
              explain: {
                en: 'Every interior $x$-value is the right end of one trapezoid and the left end of the next, so its height appears in two separate trapezoid-area terms — which collapses to a factor of $2$ when the sum is collected.',
                id: 'Tiap nilai $x$ di dalamnya adalah ujung kanan satu trapesium dan ujung kiri trapesium berikutnya, sehingga tingginya muncul di dua suku luas trapesium yang terpisah — yang menyusut menjadi faktor $2$ ketika jumlahnya dikumpulkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, why does a trapezoid fit the curve better than a flat-topped rectangle would?',
                id: 'Dengan membaca gambar di atas, mengapa trapesium lebih pas ke kurva dibanding persegi panjang berpuncak datar?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.5, 0], [0.5, 1.25], [0, 1]], color: 'muted' },
                  { t: 'poly', pts: [[0.5, 0], [1, 0], [1, 2], [0.5, 1.25]], color: 'muted' },
                  { t: 'poly', pts: [[1, 0], [1.5, 0], [1.5, 3.25], [1, 2]], color: 'muted' },
                  { t: 'poly', pts: [[1.5, 0], [2, 0], [2, 5], [1.5, 3.25]], color: 'muted' },
                  { t: 'curve', f: 'x^2+1', from: 0, to: 2, color: 'a' },
                ],
              },
              options: [
                { en: 'Its slanted top rises across the strip the way the curve itself does, instead of staying flat', id: 'Puncak miringnya naik sepanjang jalur seperti kurvanya sendiri, alih-alih tetap datar' },
                { en: 'It has a smaller width than a rectangle', id: 'Lebarnya lebih kecil dari persegi panjang' },
                { en: 'It is actually identical to a rectangle', id: 'Sebenarnya identik dengan persegi panjang' },
                { en: 'Trapezoids always give the exact answer', id: 'Trapesium selalu memberi jawaban eksak' },
              ],
              answer: 0,
              explain: {
                en: 'A flat top locks in one height for the whole strip; a slanted top interpolates between the two endpoint heights, following the curve\'s own rise instead of ignoring it.',
                id: 'Puncak datar mengunci satu tinggi untuk seluruh jalur; puncak miring menginterpolasi antara kedua tinggi titik ujungnya, mengikuti kenaikan kurva itu sendiri alih-alih mengabaikannya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the trapezoidal rule with $n = 4$ to estimate $\\displaystyle\\int_0^4 \\sqrt{x}\\,dx$. Heights at $x = 0, 1, 2, 3, 4$ are $0, 1, 1.4142, 1.7321, 2$.',
                id: 'Pakai aturan trapesium dengan $n = 4$ untuk menaksir $\\displaystyle\\int_0^4 \\sqrt{x}\\,dx$. Tinggi di $x = 0, 1, 2, 3, 4$ adalah $0, 1, 1.4142, 1.7321, 2$.',
              },
              blanks: [{ label: 'T_4 \\approx', answer: 5.146, tol: 0.02 }],
              hints: [
                { en: '$T_4 = \\tfrac12[f(0) + 2f(1) + 2f(2) + 2f(3) + f(4)]$.', id: '$T_4 = \\tfrac12[f(0) + 2f(1) + 2f(2) + 2f(3) + f(4)]$.' },
              ],
              explain: {
                en: '$T_4 = 0.5[0 + 2(1) + 2(1.4142) + 2(1.7321) + 2] = 0.5(10.2926) \\approx 5.146$.',
                id: '$T_4 = 0,5[0 + 2(1) + 2(1,4142) + 2(1,7321) + 2] = 0,5(10,2926) \\approx 5,146$.',
              },
            },
          ],
        },
        {
          id: 'int-m5-s2-l2',
          title: { en: 'Simpson\'s Rule', id: 'Aturan Simpson' },
          goal: {
            en: 'Fit a parabola through each pair of strips instead of a straight line, for a more accurate estimate at no extra data.',
            id: 'Memasangkan sebuah parabola pada tiap sepasang jalur alih-alih garis lurus, untuk taksiran yang lebih akurat tanpa data tambahan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A parabola instead of a straight line', id: 'Sebuah parabola alih-alih garis lurus' },
              body: {
                en: 'A trapezoid\'s straight top is still a rough match for a curved function. **Simpson\'s Rule** fits a **parabola** through each group of three consecutive points instead — curved segments approximating a curve, rather than straight ones. For an even $n$:\n$$S_n = \\frac{\\Delta x}{3}\\Big[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\cdots + 4f(x_{n-1}) + f(x_n)\\Big]$$\nThe coefficient pattern $1,4,2,4,2,\\ldots,4,1$ alternates because odd-indexed points sit at the peak of each fitted parabola (weighted $4$) and even-indexed interior points are shared between two parabolas (weighted $2$), just as trapezoid endpoints were shared before.',
                id: 'Puncak lurus trapesium masih hanya kecocokan kasar untuk fungsi yang melengkung. **Aturan Simpson** memasangkan sebuah **parabola** melalui tiap kelompok tiga titik berurutan sebagai gantinya — segmen melengkung yang menghampiri kurva, bukan yang lurus. Untuk $n$ genap:\n$$S_n = \\frac{\\Delta x}{3}\\Big[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\cdots + 4f(x_{n-1}) + f(x_n)\\Big]$$\nPola koefisien $1,4,2,4,2,\\ldots,4,1$ berselang-seling sebab titik berindeks ganjil duduk di puncak tiap parabola yang dipasangkan (berbobot $4$) dan titik di dalamnya berindeks genap dipakai bersama dua parabola (berbobot $2$), persis seperti titik ujung trapesium dipakai bersama sebelumnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Exact, when the curve already is a parabola', id: 'Eksak, ketika kurvanya sendiri sudah sebuah parabola' },
              body: {
                en: 'Apply $S_4$ to the same running example, $f(x)=x^2+1$ on $[0,2]$, heights $1, 1.25, 2, 3.25, 5$:\n$$S_4 = \\frac{0.5}{3}\\big[1 + 4(1.25) + 2(2) + 4(3.25) + 5\\big] = \\frac{0.5}{3}\\big[1+5+4+13+5\\big] = \\frac{0.5}{3}(28) = \\frac{14}{3}$$\nExactly $\\frac{14}{3}$ — the true value, with no error at all. This is not a coincidence: fitting a parabola through points of a function that already **is** a parabola reproduces it perfectly, which is why Simpson\'s Rule is exact for every polynomial of degree $3$ or less, and startlingly accurate for smooth functions in general.',
                id: 'Terapkan $S_4$ pada contoh berjalan yang sama, $f(x)=x^2+1$ pada $[0,2]$, tinggi $1, 1.25, 2, 3.25, 5$:\n$$S_4 = \\frac{0.5}{3}\\big[1 + 4(1.25) + 2(2) + 4(3.25) + 5\\big] = \\frac{0.5}{3}\\big[1+5+4+13+5\\big] = \\frac{0.5}{3}(28) = \\frac{14}{3}$$\nTepat $\\frac{14}{3}$ — nilai sebenarnya, tanpa galat sama sekali. Ini bukan kebetulan: memasangkan parabola melalui titik-titik fungsi yang sendiri sudah **sebuah** parabola mereproduksinya dengan sempurna, itulah sebabnya Aturan Simpson eksak untuk setiap polinom berderajat $3$ atau kurang, dan sangat akurat untuk fungsi mulus pada umumnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is Simpson\'s Rule exact when applied to a quadratic function?',
                id: 'Mengapa Aturan Simpson eksak ketika diterapkan pada fungsi kuadrat?',
              },
              options: [
                { en: 'It fits a parabola through the points, and the points already lie on a parabola, so the fit reproduces the function exactly', id: 'Ia memasangkan parabola melalui titik-titiknya, dan titik-titiknya sudah terletak pada sebuah parabola, sehingga pemasangannya mereproduksi fungsinya secara eksak' },
                { en: 'It always rounds to the nearest whole number', id: 'Selalu membulatkan ke bilangan bulat terdekat' },
                { en: 'Quadratic functions have no integral at all', id: 'Fungsi kuadrat sama sekali tak punya integral' },
                { en: 'It is a coincidence with no underlying reason', id: 'Ini kebetulan tanpa alasan yang mendasarinya' },
              ],
              answer: 0,
              explain: {
                en: 'Simpson\'s Rule works by approximating the integrand with a parabola on each pair of strips — when the integrand already is a parabola, that approximation is not an approximation at all, but an exact match.',
                id: 'Aturan Simpson bekerja dengan menghampiri integrandnya memakai parabola pada tiap sepasang jalur — ketika integrandnya sudah sebuah parabola, hampiran itu bukan hampiran sama sekali, melainkan kecocokan eksak.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the coefficient pattern for Simpson\'s Rule with $n = 6$ (seven points).',
                id: 'Lengkapi pola koefisien Aturan Simpson dengan $n = 6$ (tujuh titik).',
              },
              template: 'S_6 = \\dfrac{\\Delta x}{3}\\big[f(x_0) + 4f(x_1) + ___f(x_2) + 4f(x_3) + 2f(x_4) + ___f(x_5) + f(x_6)\\big]',
              blanks: ['2', '4'],
              explain: {
                en: 'The pattern always alternates $4, 2, 4, 2, \\ldots, 4$ between the two endpoints, regardless of how many strips there are (as long as $n$ is even).',
                id: 'Polanya selalu berselang-seling $4, 2, 4, 2, \\ldots, 4$ di antara kedua titik ujungnya, tak peduli berapa banyak jalurnya (selama $n$ genap).',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use Simpson\'s Rule with $n = 4$ to estimate $\\displaystyle\\int_0^4 \\sqrt{x}\\,dx$. Heights at $x = 0, 1, 2, 3, 4$ are $0, 1, 1.4142, 1.7321, 2$.',
                id: 'Pakai Aturan Simpson dengan $n = 4$ untuk menaksir $\\displaystyle\\int_0^4 \\sqrt{x}\\,dx$. Tinggi di $x = 0, 1, 2, 3, 4$ adalah $0, 1, 1.4142, 1.7321, 2$.',
              },
              blanks: [{ label: 'S_4 \\approx', answer: 5.25, tol: 0.02 }],
              hints: [
                { en: '$S_4 = \\tfrac13[f(0) + 4f(1) + 2f(2) + 4f(3) + f(4)]$.', id: '$S_4 = \\tfrac13[f(0) + 4f(1) + 2f(2) + 4f(3) + f(4)]$.' },
              ],
              explain: {
                en: '$S_4 = \\tfrac13(15.757) \\approx 5.25$ — closer than the trapezoidal estimate to the true value of about $5.33$.',
                id: '$S_4 = \\tfrac13(15,757) \\approx 5,25$ — lebih dekat dari taksiran trapesium terhadap nilai sebenarnya sekitar $5,33$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m5-s2-p',
        runtime: 'math',
        title: { en: 'Estimating an Integral Two Ways', id: 'Menaksir Integral dengan Dua Cara' },
        brief: {
          en: 'A trapezoidal estimate and a Simpson estimate of the same integral, and one comparison of their accuracy.',
          id: 'Satu taksiran trapesium dan satu taksiran Simpson dari integral yang sama, dan satu perbandingan akurasinya.',
        },
        requirements: [
          { en: 'The trapezoidal rule weights interior points by $2$, endpoints by $1$.', id: 'Aturan trapesium membobot titik di dalamnya dengan $2$, titik ujungnya dengan $1$.' },
          { en: 'Simpson\'s Rule alternates weights of $4$ and $2$ between the two endpoints, both weighted $1$.', id: 'Aturan Simpson berselang-seling bobot $4$ dan $2$ di antara kedua titik ujungnya, keduanya berbobot $1$.' },
        ],
        tasks: [
          {
            prompt: { en: 'For $f(x) = \\frac{1}{1+x^2}$ on $[0, 2]$ with $n = 4$, heights at $x = 0, 0.5, 1, 1.5, 2$ are $1, 0.8, 0.5, 0.3077, 0.2$. Estimate with the trapezoidal rule.', id: 'Untuk $f(x) = \\frac{1}{1+x^2}$ pada $[0, 2]$ dengan $n = 4$, tinggi di $x = 0, 0.5, 1, 1.5, 2$ adalah $1, 0.8, 0.5, 0.3077, 0.2$. Taksir dengan aturan trapesium.' },
            blanks: [{ answer: 1.1038, tol: 0.01 }],
            solution: ['T_4 = \\tfrac{0.5}{2}[1+2(0.8)+2(0.5)+2(0.3077)+0.2] \\approx 1{,}1038'],
          },
          {
            prompt: { en: 'Using the same data, estimate with Simpson\'s Rule.', id: 'Memakai data yang sama, taksir dengan Aturan Simpson.' },
            blanks: [{ answer: 1.1051, tol: 0.01 }],
            solution: ['S_4 = \\tfrac{0.5}{3}[1+4(0.8)+2(0.5)+4(0.3077)+0.2] \\approx 1{,}1051'],
          },
          {
            prompt: { en: 'The true value of this integral is $\\arctan(2) \\approx 1.1071$. Which estimate is closer: type $1$ for trapezoidal, $2$ for Simpson.', id: 'Nilai sebenarnya integral ini adalah $\\arctan(2) \\approx 1.1071$. Taksiran mana yang lebih dekat: ketik $1$ untuk trapesium, $2$ untuk Simpson.' },
            blanks: [{ answer: 2 }],
            solution: ['|1{,}1038-1{,}1071| \\approx 0{,}0033, \\quad |1{,}1051-1{,}1071| \\approx 0{,}0020', '\\text{Simpson lebih dekat, seperti biasanya — memasangkan parabola mengikuti lengkungan fungsi ini lebih baik daripada garis lurus}'],
          },
        ],
        hints: [
          { en: 'Part 3: compute both errors to at least three decimal places before comparing them — the two estimates are close together.', id: 'Butir 3: hitung kedua galatnya hingga setidaknya tiga desimal sebelum membandingkannya — kedua taksirannya berdekatan.' },
        ],
        xp: 50,
      },
    },
  ],
}
