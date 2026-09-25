import type { Module } from '../types'

/** Module 4 — a series that is itself a function of x, found either by
 *  building new ones out of the geometric series through term-by-term
 *  calculus, or by matching every derivative of a known function at a single
 *  point. Both routes lead to the same series for e^x, sin x and cos x. */
export const module4: Module = {
  id: 'der-m4',
  title: { en: 'Power Series and Taylor Series', id: 'Deret Pangkat dan Deret Taylor' },
  summary: {
    en: 'A series whose terms carry x rather than only n — where it converges, how to build new ones by differentiating or integrating term by term, and how to construct one from any function\'s own derivatives.',
    id: 'Deret yang suku-sukunya membawa x, bukan hanya n — di mana ia konvergen, cara membangun yang baru dengan menurunkan atau mengintegralkan suku demi suku, dan cara menyusunnya dari turunan fungsi apa pun.',
  },
  submodules: [
    /* ------------------------------------------------------------------- 9.7 power series */
    {
      id: 'der-m4-s1',
      title: { en: 'Power Series', id: 'Deret Pangkat' },
      summary: {
        en: 'A series in powers of x, the interval where it converges, and building new series from the geometric one by differentiating and integrating term by term.',
        id: 'Deret dalam pangkat x, interval tempat ia konvergen, dan membangun deret baru dari deret geometri dengan menurunkan dan mengintegralkan suku demi suku.',
      },
      lessons: [
        {
          id: 'der-m4-s1-l1',
          title: { en: 'Radius and Interval of Convergence', id: 'Jari-jari dan Interval Konvergensi' },
          goal: {
            en: 'Find the radius and interval of convergence of a power series using the Ratio Test.',
            id: 'Mencari jari-jari dan interval konvergensi deret pangkat memakai Uji Rasio.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A series that is a function of x', id: 'Deret yang adalah fungsi dari x' },
              body: {
                en: 'A **power series** centered at $0$ is $\\sum_{n=0}^{\\infty} c_n x^n = c_0+c_1x+c_2x^2+\\cdots$ — for each fixed $x$, a series of numbers, exactly Module 1\'s kind, that may converge or diverge depending on $x$. The Ratio Test, applied with $x$ held as a parameter, is the standard tool: for $\\sum \\dfrac{x^n}{n!}$,\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\left|\\frac{x^{n+1}/(n+1)!}{x^n/n!}\\right| = \\frac{|x|}{n+1} \\to 0$$\nfor **every** real $x$ — the limit is $0<1$ no matter how large $|x|$ is, so this series converges absolutely everywhere: its **radius of convergence** is $R=\\infty$.',
                id: 'Sebuah **deret pangkat** berpusat di $0$ adalah $\\sum_{n=0}^{\\infty} c_n x^n = c_0+c_1x+c_2x^2+\\cdots$ — untuk tiap $x$ tetap, sebuah deret bilangan, persis jenis Modul 1, yang mungkin konvergen atau divergen bergantung pada $x$. Uji Rasio, diterapkan dengan $x$ dipegang sebagai parameter, adalah alat standarnya: untuk $\\sum \\dfrac{x^n}{n!}$,\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\left|\\frac{x^{n+1}/(n+1)!}{x^n/n!}\\right| = \\frac{|x|}{n+1} \\to 0$$\nuntuk **setiap** $x$ real — limitnya $0<1$ tak peduli seberapa besar $|x|$-nya, sehingga deret ini konvergen mutlak di mana-mana: **jari-jari konvergensinya** $R=\\infty$.',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-2, 40],
                ticks: true,
                params: [{ name: 'n', min: 1, max: 12, step: 1, value: 4, label: 'terms' }],
                items: [
                  { t: 'curve', f: 'e^x', from: -6, to: 4.5, color: 'muted', dashed: true, label: 'eˣ' },
                  { t: 'curve', f: '1+x+x^2/2+x^3/6+x^4/24', from: -6, to: 6, color: 'a', label: 'partial sum' },
                ],
                caption: {
                  en: 'The partial sum of $\\sum x^n/n!$ up to $n=4$ already tracks $e^x$ closely near $0$ — with $R=\\infty$, adding more terms keeps closing the gap however far out $x$ goes.',
                  id: 'Jumlah parsial $\\sum x^n/n!$ sampai $n=4$ sudah mengikuti $e^x$ dengan dekat di sekitar $0$ — dengan $R=\\infty$, menambah lebih banyak suku terus menutup celahnya sejauh apa pun $x$ pergi.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A finite radius, and endpoints that need their own check', id: 'Jari-jari hingga, dan titik ujung yang perlu diperiksa sendiri' },
              body: {
                en: 'For $\\sum n x^n$:\n$$\\left|\\frac{(n+1)x^{n+1}}{nx^n}\\right| = \\frac{n+1}{n}|x| \\to |x|$$\nConverges when $|x|<1$, diverges when $|x|>1$: **radius of convergence $R=1$**. The Ratio Test is silent exactly at the two endpoints $x=\\pm 1$, which need checking by hand: at $x=1$, the series is $\\sum n$, terms growing without bound — diverges (nth-Term Test). At $x=-1$, it is $\\sum n(-1)^n$, terms that do not even go to $0$ — diverges too. So the full **interval of convergence** is the open interval $(-1,1)$, radius $1$, with both endpoints excluded.',
                id: 'Untuk $\\sum n x^n$:\n$$\\left|\\frac{(n+1)x^{n+1}}{nx^n}\\right| = \\frac{n+1}{n}|x| \\to |x|$$\nKonvergen ketika $|x|<1$, divergen ketika $|x|>1$: **jari-jari konvergensi $R=1$**. Uji Rasio diam persis di kedua titik ujung $x=\\pm 1$, yang perlu diperiksa dengan tangan: di $x=1$, deretnya $\\sum n$, suku yang membesar tanpa batas — divergen (Uji Suku ke-n). Di $x=-1$, ia $\\sum n(-1)^n$, suku yang bahkan tak menuju $0$ — divergen juga. Jadi **interval konvergensi** penuhnya adalah interval terbuka $(-1,1)$, jari-jari $1$, dengan kedua titik ujung dikeluarkan.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [-0.5, 0.5],
                ticks: true,
                items: [
                  { t: 'seg', from: [-1, 0], to: [1, 0], color: 'result' },
                  { t: 'dot', x: -1, y: 0, color: 'b', open: true, label: '-1' },
                  { t: 'dot', x: 1, y: 0, color: 'b', open: true, label: '1' },
                ],
                caption: {
                  en: 'The interval of convergence for $\\sum nx^n$: solid between $-1$ and $1$, hollow circles at both ends marking that neither endpoint is included.',
                  id: 'Interval konvergensi untuk $\\sum nx^n$: pejal di antara $-1$ dan $1$, lingkaran berongga di kedua ujung menandai tak satu pun titik ujung yang termasuk.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must the endpoints of an interval of convergence be checked separately, rather than relying on the Ratio Test?',
                id: 'Mengapa titik ujung interval konvergensi harus diperiksa terpisah, bukan mengandalkan Uji Rasio?',
              },
              options: [
                { en: 'The Ratio Test gives $L=1$ exactly at the endpoints, which is always inconclusive', id: 'Uji Rasio memberi $L=1$ persis di titik ujung, yang selalu tak tuntas' },
                { en: 'Endpoints never actually belong to any interval', id: 'Titik ujung sebenarnya tak pernah masuk interval apa pun' },
                { en: 'The Ratio Test cannot be used on power series at all', id: 'Uji Rasio sama sekali tak bisa dipakai pada deret pangkat' },
                { en: 'Every power series diverges at both endpoints', id: 'Setiap deret pangkat divergen di kedua titik ujung' },
              ],
              answer: 0,
              explain: {
                en: 'At $x=\\pm R$, the Ratio Test\'s limit is exactly $1$ by construction — the boundary case it was already established to say nothing about.',
                id: 'Di $x=\\pm R$, limit Uji Rasio persis $1$ menurut konstruksinya — kasus batas yang sudah ditetapkan tak mengatakan apa-apa tentangnya.',
              },
              hint: {
                en: 'Recall from the Ratio Test module exactly what value of L is always reached right at the boundary of where a series converges.',
                id: 'Ingat dari modul Uji Rasio persis nilai L apa yang selalu tercapai tepat di batas tempat sebuah deret konvergen.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the Ratio Test computation for $\\sum \\dfrac{x^n}{n}$.',
                id: 'Lengkapi penghitungan Uji Rasio untuk $\\sum \\dfrac{x^n}{n}$.',
              },
              template: '\\left|\\dfrac{x^{n+1}/(n+1)}{x^n/n}\\right| = \\dfrac{n}{n+1}|x| \\to ___',
              blanks: ['|x|'],
              explain: {
                en: 'As $n\\to\\infty$, $\\dfrac{n}{n+1}\\to 1$, leaving the limit equal to $|x|$ — the radius of convergence follows from $|x|<1$.',
                id: 'Ketika $n\\to\\infty$, $\\dfrac{n}{n+1}\\to 1$, menyisakan limitnya sama dengan $|x|$ — jari-jari konvergensinya mengikuti dari $|x|<1$.',
              },
              hint: {
                en: 'The factor $\\frac{n}{n+1}$ approaches a very simple number as $n\\to\\infty$ — what does it approach, and what does that leave multiplying $|x|$?',
                id: 'Faktor $\\frac{n}{n+1}$ mendekati bilangan yang sangat sederhana ketika $n\\to\\infty$ — mendekati apa, dan itu menyisakan apa yang mengalikan $|x|$?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the radius of convergence $R$ of $\\sum \\dfrac{x^n}{3^n}$.',
                id: 'Cari jari-jari konvergensi $R$ dari $\\sum \\dfrac{x^n}{3^n}$.',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: 'The Ratio Test gives $\\left|\\dfrac{x}{3}\\right| < 1$ for convergence.', id: 'Uji Rasio memberi $\\left|\\dfrac{x}{3}\\right| < 1$ untuk konvergensi.' },
              ],
              explain: {
                en: '$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{|x|}{3} < 1 \\iff |x|<3$, so $R=3$.',
                id: '$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{|x|}{3} < 1 \\iff |x|<3$, sehingga $R=3$.',
              },
            },
          ],
        },
        {
          id: 'der-m4-s1-l2',
          title: { en: 'Building New Series by Differentiating and Integrating', id: 'Membangun Deret Baru dengan Menurunkan dan Mengintegralkan' },
          goal: {
            en: 'Differentiate and integrate a power series term by term to build a new one from the geometric series.',
            id: 'Menurunkan dan mengintegralkan deret pangkat suku demi suku untuk membangun deret baru dari deret geometri.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Term by term, same radius of convergence', id: 'Suku demi suku, jari-jari konvergensi yang sama' },
              body: {
                en: 'Inside its radius of convergence, a power series may be differentiated or integrated **term by term**, exactly as if it were a (very long) polynomial, and the result has the **same radius of convergence**. Starting from the geometric series (Module 1):\n$$\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n, \\qquad |x|<1$$\nDifferentiating both sides term by term:\n$$\\frac{1}{(1-x)^2} = \\sum_{n=1}^{\\infty} n x^{n-1}$$\nA single known series, one differentiation, and a brand new one — no separate Ratio Test computation needed, since term-by-term differentiation never changes $R$.',
                id: 'Di dalam jari-jari konvergensinya, sebuah deret pangkat boleh diturunkan atau diintegralkan **suku demi suku**, persis seakan ia polinom (yang sangat panjang), dan hasilnya punya **jari-jari konvergensi yang sama**. Mulai dari deret geometri (Modul 1):\n$$\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n, \\qquad |x|<1$$\nMenurunkan kedua ruas suku demi suku:\n$$\\frac{1}{(1-x)^2} = \\sum_{n=1}^{\\infty} n x^{n-1}$$\nSatu deret yang sudah diketahui, satu penurunan, dan satu deret baru — tak perlu penghitungan Uji Rasio terpisah, sebab penurunan suku demi suku tak pernah mengubah $R$.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.9, 0.9],
                ySpan: [-1, 15],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/(1-x)^2', from: -0.85, to: 0.85, color: 'muted', dashed: true, label: '1/(1-x)²' },
                  { t: 'curve', f: '1+2*x+3*x^2+4*x^3+5*x^4', from: -0.85, to: 0.85, color: 'a', label: 'partial sum' },
                ],
                caption: {
                  en: 'The 5-term partial sum of $\\sum nx^{n-1}$ tracks $1/(1-x)^2$ closely well inside $|x|<1$ — visibly worse near the endpoints, exactly where the radius of convergence runs out.',
                  id: 'Jumlah parsial 5 suku dari $\\sum nx^{n-1}$ mengikuti $1/(1-x)^2$ dengan dekat di dalam $|x|<1$ — tampak lebih buruk mendekati titik ujung, persis tempat jari-jari konvergensinya habis.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Integrating instead, and meeting the logarithm again', id: 'Mengintegralkan sebagai gantinya, dan bertemu logaritma lagi' },
              body: {
                en: 'Integrating the geometric series instead, term by term, from $0$ to $x$:\n$$\\int_0^x \\frac{1}{1-t}\\,dt = \\sum_{n=0}^{\\infty} \\int_0^x t^n\\,dt = \\sum_{n=0}^{\\infty} \\frac{x^{n+1}}{n+1}$$\nThe left side is $-\\ln(1-x)$ — a substitution $u=1-t$ turns it into exactly the integral that defined the logarithm in the Integrals and Transcendental Functions course. So\n$$-\\ln(1-x) = \\sum_{n=1}^{\\infty} \\frac{x^n}{n} = x+\\frac{x^2}{2}+\\frac{x^3}{3}+\\cdots, \\qquad |x|<1$$\nAt $x=-1$ (an endpoint, checked separately just like the previous lesson): this becomes $\\ln 2 = 1-\\tfrac12+\\tfrac13-\\cdots$ — the alternating harmonic series from Module 3, now identified as the exact value it was always converging to.',
                id: 'Mengintegralkan deret geometri sebagai gantinya, suku demi suku, dari $0$ sampai $x$:\n$$\\int_0^x \\frac{1}{1-t}\\,dt = \\sum_{n=0}^{\\infty} \\int_0^x t^n\\,dt = \\sum_{n=0}^{\\infty} \\frac{x^{n+1}}{n+1}$$\nRuas kirinya adalah $-\\ln(1-x)$ — substitusi $u=1-t$ mengubahnya menjadi persis integral yang mendefinisikan logaritma pada kursus Integral dan Fungsi Transenden. Jadi\n$$-\\ln(1-x) = \\sum_{n=1}^{\\infty} \\frac{x^n}{n} = x+\\frac{x^2}{2}+\\frac{x^3}{3}+\\cdots, \\qquad |x|<1$$\nDi $x=-1$ (titik ujung, diperiksa terpisah persis seperti pelajaran sebelumnya): ini menjadi $\\ln 2 = 1-\\tfrac12+\\tfrac13-\\cdots$ — deret harmonik berselang dari Modul 3, kini dikenali sebagai nilai eksak yang selalu didekatinya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.9, 0.9],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: '-ln(1-x)', from: -0.85, to: 0.85, color: 'muted', dashed: true, label: '-ln(1-x)' },
                  { t: 'curve', f: 'x+x^2/2+x^3/3+x^4/4+x^5/5', from: -0.85, to: 0.85, color: 'a', label: 'partial sum' },
                ],
                caption: {
                  en: 'The 5-term partial sum tracks $-\\ln(1-x)$ closely near $0$, drifting apart nearer the endpoints — the same signature as every power series inside its own radius of convergence.',
                  id: 'Jumlah parsial 5 suku mengikuti $-\\ln(1-x)$ dengan dekat di sekitar $0$, menjauh mendekati titik ujung — tanda yang sama seperti deret pangkat mana pun di dalam jari-jari konvergensinya sendiri.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What happens to the radius of convergence when a power series is differentiated term by term?',
                id: 'Apa yang terjadi pada jari-jari konvergensi ketika deret pangkat diturunkan suku demi suku?',
              },
              options: [
                { en: 'It stays exactly the same', id: 'Tetap persis sama' },
                { en: 'It always shrinks to zero', id: 'Selalu menyusut ke nol' },
                { en: 'It always grows without bound', id: 'Selalu membesar tanpa batas' },
                { en: 'It becomes undefined', id: 'Menjadi tak terdefinisi' },
              ],
              answer: 0,
              explain: {
                en: 'Term-by-term differentiation (and integration) preserves the radius of convergence exactly — only behavior at the endpoints can change.',
                id: 'Penurunan (dan pengintegralan) suku demi suku mempertahankan jari-jari konvergensi persis — hanya perilaku di titik ujung yang bisa berubah.',
              },
              hint: {
                en: 'Re-read the opening sentence of the first concept — it states directly what stays the same under term-by-term calculus.',
                id: 'Baca ulang kalimat pembuka konsep pertama — ia menyatakan langsung apa yang tetap sama di bawah kalkulus suku demi suku.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that build a series for $\\arctan x$ by integrating $\\dfrac{1}{1+x^2}$.',
                id: 'Susun langkah yang membangun deret untuk $\\arctan x$ dengan mengintegralkan $\\dfrac{1}{1+x^2}$.',
              },
              lines: [
                '\\frac{1}{1+t^2} = \\sum_{n=0}^\\infty (-1)^n t^{2n} \\quad (\\text{geometric, ratio } -t^2)',
                '\\int_0^x \\frac{1}{1+t^2}\\,dt = \\sum_{n=0}^\\infty (-1)^n \\int_0^x t^{2n}\\,dt',
                '\\arctan x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{2n+1}',
              ],
              explain: {
                en: 'Write the integrand as a geometric series first, then integrate both sides term by term, then simplify the left side to arctan x using the Derivatives course\'s own formula for its derivative.',
                id: 'Tulis integrand-nya sebagai deret geometri lebih dahulu, lalu integralkan kedua ruas suku demi suku, lalu sederhanakan ruas kiri menjadi arctan x memakai rumus turunannya sendiri dari kursus Turunan.',
              },
              hint: {
                en: 'Term-by-term integration can only be applied once the integrand is actually written as a series — and the final identity needs that integration already carried out.',
                id: 'Pengintegralan suku demi suku hanya bisa diterapkan setelah integrand-nya benar-benar dituliskan sebagai deret — dan identitas akhirnya memerlukan pengintegralan itu sudah dilakukan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using $-\\ln(1-x) = \\sum \\dfrac{x^n}{n}$, approximate $\\ln(1.1)$ using the first two terms with $x=-0.1$ (so the series gives $\\ln(1-x)=\\ln(1.1)$). (Round to four decimal places.)',
                id: 'Memakai $-\\ln(1-x) = \\sum \\dfrac{x^n}{n}$, hampiri $\\ln(1.1)$ memakai dua suku pertama dengan $x=-0.1$ (sehingga deretnya memberi $\\ln(1-x)=\\ln(1.1)$). (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: 0.095, tol: 0.001 }],
              hints: [
                { en: '$-\\ln(1-(-0.1)) = -0.1 + \\dfrac{(-0.1)^2}{2} \\Rightarrow \\ln(1.1) \\approx 0.1 - 0.005$.', id: '$-\\ln(1-(-0.1)) = -0.1 + \\dfrac{(-0.1)^2}{2} \\Rightarrow \\ln(1.1) \\approx 0.1 - 0.005$.' },
              ],
              explain: {
                en: 'With $x=-0.1$: $-\\ln(1.1) \\approx -0.1+0.005=-0.095$, so $\\ln(1.1)\\approx 0.095$ — close to the true value $0.0953$.',
                id: 'Dengan $x=-0.1$: $-\\ln(1.1) \\approx -0.1+0.005=-0.095$, sehingga $\\ln(1.1)\\approx 0.095$ — dekat dengan nilai sebenarnya $0.0953$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m4-s1-p',
        runtime: 'math',
        title: { en: 'Power Series', id: 'Deret Pangkat' },
        brief: {
          en: 'Two radii of convergence, and a new series built by term-by-term calculus.',
          id: 'Dua jari-jari konvergensi, dan sebuah deret baru yang dibangun lewat kalkulus suku demi suku.',
        },
        requirements: [
          { en: 'The Ratio Test finds the radius of convergence; the endpoints $x=\\pm R$ always need a separate check.', id: 'Uji Rasio mencari jari-jari konvergensi; titik ujung $x=\\pm R$ selalu memerlukan pemeriksaan terpisah.' },
          { en: 'Differentiating or integrating a power series term by term never changes its radius of convergence.', id: 'Menurunkan atau mengintegralkan deret pangkat suku demi suku tak pernah mengubah jari-jari konvergensinya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the radius of convergence $R$ of $\\sum \\dfrac{x^n}{2^n}$.', id: 'Cari jari-jari konvergensi $R$ dari $\\sum \\dfrac{x^n}{2^n}$.' },
            blanks: [{ answer: 2 }],
            solution: ['\\left|\\dfrac{x}{2}\\right|<1 \\iff |x|<2 \\Rightarrow R=2'],
          },
          {
            prompt: { en: 'Find the radius of convergence $R$ of $\\sum n^2 x^n$.', id: 'Cari jari-jari konvergensi $R$ dari $\\sum n^2 x^n$.' },
            blanks: [{ answer: 1 }],
            solution: ['\\left|\\dfrac{(n+1)^2}{n^2}\\right||x| \\to |x| < 1 \\Rightarrow R=1'],
          },
          {
            prompt: { en: 'Differentiate $\\dfrac{1}{1-x}=\\sum x^n$ term by term to find the coefficient of $x^3$ in the series for $\\dfrac{1}{(1-x)^2}$.', id: 'Turunkan $\\dfrac{1}{1-x}=\\sum x^n$ suku demi suku untuk mencari koefisien $x^3$ pada deret $\\dfrac{1}{(1-x)^2}$.' },
            blanks: [{ answer: 4 }],
            solution: ['\\dfrac{1}{(1-x)^2}=\\sum n x^{n-1}, \\text{ koefisien } x^3 \\text{ datang dari } n-1=3 \\Rightarrow n=4'],
          },
        ],
        hints: [
          { en: 'The coefficient of $x^k$ in $\\sum n x^{n-1}$ comes from the term with $n-1=k$.', id: 'Koefisien $x^k$ pada $\\sum n x^{n-1}$ datang dari suku dengan $n-1=k$.' },
        ],
        xp: 50,
      },
    },

    /* ---------------------------------------------------- 9.8 taylor and maclaurin series */
    {
      id: 'der-m4-s2',
      title: { en: 'Taylor and Maclaurin Series', id: 'Deret Taylor dan Maclaurin' },
      summary: {
        en: 'Building a power series directly from a function\'s own derivatives at a point, matching e^x, sin x and cos x to the series already found or guessed at.',
        id: 'Membangun deret pangkat langsung dari turunan fungsi itu sendiri di suatu titik, mencocokkan e^x, sin x, dan cos x dengan deret yang sudah ditemukan atau ditebak.',
      },
      lessons: [
        {
          id: 'der-m4-s2-l1',
          title: { en: 'The Taylor Coefficient Formula', id: 'Rumus Koefisien Taylor' },
          goal: {
            en: 'Derive the Taylor coefficient formula and build the Maclaurin series for e^x.',
            id: 'Menurunkan rumus koefisien Taylor dan membangun deret Maclaurin untuk e^x.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Matching every derivative at one point', id: 'Mencocokkan setiap turunan di satu titik' },
              body: {
                en: 'Rather than build a series and identify the function afterward, a **Taylor series** starts from a known function $f$ and asks: which coefficients $c_n$ make $\\sum c_n(x-a)^n$ share every derivative with $f$ at $x=a$? Differentiating the series $n$ times and setting $x=a$ kills every term except the one that survives, giving\n$$c_n = \\frac{f^{(n)}(a)}{n!}$$\nCentered at $a=0$, this is called a **Maclaurin series**. For $f(x)=e^x$: every derivative is $e^x$ itself, and $e^0=1$, so $f^{(n)}(0)=1$ for every $n$:\n$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\cdots$$\nexactly the series whose radius of convergence, $R=\\infty$, was already found in the previous lesson — now identified as belonging to $e^x$ specifically.',
                id: 'Alih-alih membangun deret dan mengenali fungsinya belakangan, sebuah **deret Taylor** dimulai dari fungsi $f$ yang diketahui dan bertanya: koefisien $c_n$ mana yang membuat $\\sum c_n(x-a)^n$ berbagi setiap turunan dengan $f$ di $x=a$? Menurunkan deretnya $n$ kali dan menyetel $x=a$ mematikan setiap suku kecuali yang bertahan, memberi\n$$c_n = \\frac{f^{(n)}(a)}{n!}$$\nBerpusat di $a=0$, ini disebut **deret Maclaurin**. Untuk $f(x)=e^x$: setiap turunannya $e^x$ itu sendiri, dan $e^0=1$, sehingga $f^{(n)}(0)=1$ untuk setiap $n$:\n$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\cdots$$\npersis deret yang jari-jari konvergensinya, $R=\\infty$, sudah ditemukan pada pelajaran sebelumnya — kini dikenali sebagai milik $e^x$ secara khusus.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-1, 12],
                ticks: true,
                params: [{ name: 'n', min: 1, max: 8, step: 1, value: 3, label: 'terms' }],
                items: [
                  { t: 'curve', f: 'e^x', from: -3, to: 2.4, color: 'muted', dashed: true, label: 'eˣ' },
                  { t: 'curve', f: '1+x+x^2/2+x^3/6', from: -3, to: 3, color: 'a', label: '3-term Taylor' },
                ],
                caption: {
                  en: 'The Maclaurin polynomial through the $x^3$ term already hugs $e^x$ closely near $0$ — every extra term this module adds pushes that agreement further out.',
                  id: 'Polinom Maclaurin sampai suku $x^3$ sudah mendekap $e^x$ dengan rapat di sekitar $0$ — tiap suku tambahan yang dibubuhkan modul ini mendorong kecocokan itu lebih jauh.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'sin x, from a four-step cycle of derivatives', id: 'sin x, dari siklus empat langkah turunan' },
              body: {
                en: 'The Derivatives course found that $\\sin x$\'s derivatives cycle every four steps: $\\sin x\\to\\cos x\\to-\\sin x\\to-\\cos x\\to\\sin x$. At $x=0$: $\\sin 0=0$, $\\cos 0=1$, $-\\sin 0=0$, $-\\cos 0=-1$, repeating — so every **even**-order derivative is $0$, and the odd ones alternate $1,-1,1,-1,\\ldots$. Plugging into the Taylor coefficient formula, only odd powers of $x$ survive:\n$$\\sin x = x - \\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$$\nAn **odd** function, matching every $\\sin x$ built from odd powers alone — no even-power term could ever appear.',
                id: 'Kursus Turunan menemukan bahwa turunan $\\sin x$ berputar tiap empat langkah: $\\sin x\\to\\cos x\\to-\\sin x\\to-\\cos x\\to\\sin x$. Di $x=0$: $\\sin 0=0$, $\\cos 0=1$, $-\\sin 0=0$, $-\\cos 0=-1$, berulang — sehingga setiap turunan berorde **genap** adalah $0$, dan yang ganjil berselang $1,-1,1,-1,\\ldots$. Memasukkannya ke rumus koefisien Taylor, hanya pangkat ganjil $x$ yang bertahan:\n$$\\sin x = x - \\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$$\nFungsi **ganjil**, cocok dengan $\\sin x$ mana pun yang dibangun dari pangkat ganjil saja — tak ada suku berpangkat genap yang pernah bisa muncul.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)', from: -6.5, to: 6.5, color: 'muted', dashed: true, label: 'sin x' },
                  { t: 'curve', f: 'x-x^3/6+x^5/120', from: -3.2, to: 3.2, color: 'a', label: '3-term Taylor' },
                ],
                caption: {
                  en: 'The 3-term Maclaurin polynomial for $\\sin x$ tracks the true curve closely near $0$ and peels away past $|x|\\approx 3$ — visibly odd-symmetric, just like $\\sin x$ itself.',
                  id: 'Polinom Maclaurin 3-suku untuk $\\sin x$ mengikuti kurva sebenarnya dengan dekat di sekitar $0$ dan mengelupas melewati $|x|\\approx 3$ — tampak simetri ganjil, persis seperti $\\sin x$ sendiri.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the Taylor coefficient formula for $c_n$, centered at $a$?',
                id: 'Apa rumus koefisien Taylor untuk $c_n$, berpusat di $a$?',
              },
              options: [
                { en: '$c_n = \\dfrac{f^{(n)}(a)}{n!}$', id: '$c_n = \\dfrac{f^{(n)}(a)}{n!}$' },
                { en: '$c_n = f^{(n)}(a)$', id: '$c_n = f^{(n)}(a)$' },
                { en: '$c_n = \\dfrac{f(a)}{n!}$', id: '$c_n = \\dfrac{f(a)}{n!}$' },
                { en: '$c_n = n! \\, f^{(n)}(a)$', id: '$c_n = n! \\, f^{(n)}(a)$' },
              ],
              answer: 0,
              explain: {
                en: 'The $n!$ in the denominator is exactly what survives from differentiating $(x-a)^n$ n times — without it, the coefficient would not actually match the nth derivative at $a$.',
                id: '$n!$ di penyebut persis yang bertahan dari menurunkan $(x-a)^n$ sebanyak n kali — tanpanya, koefisiennya sebenarnya tak akan cocok dengan turunan ke-n di $a$.',
              },
              hint: {
                en: 'Re-read the boxed formula in the first concept, right after "giving" — what sits in the denominator?',
                id: 'Baca ulang rumus berkotak pada konsep pertama, tepat setelah "memberi" — apa yang duduk di penyebutnya?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the pattern of derivatives of $\\sin x$ at $x=0$: $0, 1, 0, -1, 0, 1, \\ldots$ — what is the 6th derivative at $0$?',
                id: 'Lengkapi pola turunan $\\sin x$ di $x=0$: $0, 1, 0, -1, 0, 1, \\ldots$ — apa turunan ke-6 di $0$?',
              },
              template: 'f^{(6)}(0) = ___',
              blanks: ['0'],
              explain: {
                en: 'The 6th derivative is even-order, and every even-order derivative of $\\sin x$ at $0$ is $0$ — the pattern cycles every 4 steps, and $6 = 4+2$ lands back on the same position as the 2nd derivative, an even, zero-valued one.',
                id: 'Turunan ke-6 berorde genap, dan setiap turunan berorde genap dari $\\sin x$ di $0$ adalah $0$ — polanya berputar tiap 4 langkah, dan $6 = 4+2$ mendarat kembali di posisi yang sama seperti turunan ke-2, posisi genap bernilai nol.',
              },
              hint: {
                en: 'The pattern repeats every 4 derivatives — which of the four listed values does the 6th derivative land on?',
                id: 'Polanya berulang tiap 4 turunan — pada nilai mana dari keempat yang terdaftar turunan ke-6 mendarat?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using the first 4 terms of $e^x=\\sum x^n/n!$, approximate $e^{0.5}$. (Round to four decimal places.)',
                id: 'Memakai 4 suku pertama dari $e^x=\\sum x^n/n!$, hampiri $e^{0.5}$. (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: 1 + 0.5 + 0.125 + 0.5 ** 3 / 6, tol: 0.001 }],
              hints: [
                { en: '$1 + 0.5 + \\dfrac{0.5^2}{2} + \\dfrac{0.5^3}{6}$.', id: '$1 + 0.5 + \\dfrac{0.5^2}{2} + \\dfrac{0.5^3}{6}$.' },
              ],
              explain: {
                en: '$1+0.5+0.125+0.0208=1.6458$ — close to the true value $e^{0.5}\\approx 1.6487$.',
                id: '$1+0.5+0.125+0.0208=1.6458$ — dekat dengan nilai sebenarnya $e^{0.5}\\approx 1.6487$.',
              },
            },
          ],
        },
        {
          id: 'der-m4-s2-l2',
          title: { en: 'The Cosine Series, and Using Known Series', id: 'Deret Cosinus, dan Memakai Deret yang Sudah Diketahui' },
          goal: {
            en: 'Find the Maclaurin series for cos x by differentiating the sine series, and build new series by substitution.',
            id: 'Mencari deret Maclaurin untuk cos x dengan menurunkan deret sinus, dan membangun deret baru lewat substitusi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Differentiating a series instead of starting over', id: 'Menurunkan sebuah deret alih-alih memulai dari awal' },
              body: {
                en: 'Since $\\dfrac{d}{dx}(\\sin x)=\\cos x$, the cosine series falls straight out of differentiating the sine series term by term — no new coefficient computation needed, exactly the term-by-term calculus from this module\'s first lesson:\n$$\\cos x = \\frac{d}{dx}\\left[x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots\\right] = 1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}$$\nAn **even** function, built from even powers only — matching $\\cos(-x)=\\cos x$ exactly the way $\\sin x$\'s odd series matched $\\sin(-x)=-\\sin x$.',
                id: 'Karena $\\dfrac{d}{dx}(\\sin x)=\\cos x$, deret cosinusnya langsung jatuh dari menurunkan deret sinus suku demi suku — tak perlu penghitungan koefisien baru, persis kalkulus suku demi suku dari pelajaran pertama modul ini:\n$$\\cos x = \\frac{d}{dx}\\left[x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots\\right] = 1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}$$\nFungsi **genap**, dibangun dari pangkat genap saja — cocok dengan $\\cos(-x)=\\cos x$ persis seperti deret ganjil $\\sin x$ cocok dengan $\\sin(-x)=-\\sin x$.',
              },
              figure: {
                dim: 2,
                xSpan: [-4.5, 4.5],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'cos(x)', from: -4.5, to: 4.5, color: 'muted', dashed: true, label: 'cos x' },
                  { t: 'curve', f: '1-x^2/2+x^4/24', from: -2.5, to: 2.5, color: 'a', label: '3-term Taylor' },
                ],
                caption: {
                  en: 'The 3-term Maclaurin polynomial for $\\cos x$, inherited by differentiating the sine series — no separate derivation, and visibly even-symmetric like $\\cos x$ itself.',
                  id: 'Polinom Maclaurin 3-suku untuk $\\cos x$, diwarisi dengan menurunkan deret sinus — tanpa penurunan terpisah, dan tampak simetri genap seperti $\\cos x$ sendiri.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Substituting into a series already in hand', id: 'Mensubstitusi ke dalam deret yang sudah di tangan' },
              body: {
                en: 'A new Maclaurin series rarely needs a fresh derivative computation — substituting into a known one is usually enough. Replacing $x$ with $-x^2$ in the series for $e^x$:\n$$e^{-x^2} = \\sum_{n=0}^{\\infty} \\frac{(-x^2)^n}{n!} = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{n!} = 1-x^2+\\frac{x^4}{2!}-\\frac{x^6}{3!}+\\cdots$$\nvalid for every real $x$, since the original series was. This exact series is what later makes it possible to integrate $e^{-x^2}$ — a function with no elementary antiderivative at all, as the Techniques of Integration course could only handle numerically — term by term instead.',
                id: 'Deret Maclaurin baru jarang memerlukan penghitungan turunan yang segar — mensubstitusi ke deret yang sudah diketahui biasanya sudah cukup. Mengganti $x$ dengan $-x^2$ pada deret $e^x$:\n$$e^{-x^2} = \\sum_{n=0}^{\\infty} \\frac{(-x^2)^n}{n!} = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{n!} = 1-x^2+\\frac{x^4}{2!}-\\frac{x^6}{3!}+\\cdots$$\nberlaku untuk setiap $x$ real, sebab deret aslinya begitu. Deret persis inilah yang nantinya memungkinkan mengintegralkan $e^{-x^2}$ — fungsi yang sama sekali tak punya antiturunan elementer, yang kursus Teknik Pengintegralan hanya bisa menanganinya secara numerik — suku demi suku sebagai gantinya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2.2, 2.2],
                ySpan: [-1, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'e^(-x^2)', from: -2.2, to: 2.2, color: 'muted', dashed: true, label: 'e^(-x²)' },
                  { t: 'curve', f: '1-x^2+x^4/2-x^6/6', from: -1.7, to: 1.7, color: 'a', label: '4-term Taylor' },
                ],
                caption: {
                  en: 'The bell-shaped $e^{-x^2}$ (dashed) and its 4-term Maclaurin polynomial (solid) — built by substitution alone, no new derivative computed at all.',
                  id: '$e^{-x^2}$ berbentuk lonceng (putus-putus) dan polinom Maclaurin 4-sukunya (pejal) — dibangun hanya lewat substitusi, tanpa turunan baru dihitung sama sekali.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How was the cosine series found in this lesson?',
                id: 'Bagaimana deret cosinus ditemukan pada pelajaran ini?',
              },
              options: [
                { en: 'By differentiating the already-known sine series term by term', id: 'Dengan menurunkan deret sinus yang sudah diketahui suku demi suku' },
                { en: 'By computing every derivative of cos x at 0 from scratch', id: 'Dengan menghitung setiap turunan cos x di 0 dari awal' },
                { en: 'By guessing and checking numerically', id: 'Dengan menebak dan memeriksa secara numerik' },
                { en: 'It cannot be found without a computer', id: 'Tak bisa ditemukan tanpa komputer' },
              ],
              answer: 0,
              explain: {
                en: 'The lesson reused the sine series and differentiated it term by term — the term-by-term calculus rule from the first lesson of this module, applied directly.',
                id: 'Pelajaran ini memakai ulang deret sinus dan menurunkannya suku demi suku — aturan kalkulus suku demi suku dari pelajaran pertama modul ini, diterapkan langsung.',
              },
              hint: {
                en: 'Re-read the title and opening line of the first concept in this lesson.',
                id: 'Baca ulang judul dan kalimat pembuka konsep pertama pelajaran ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that build the Maclaurin series for $\\cos(2x)$ by substitution.',
                id: 'Susun langkah yang membangun deret Maclaurin untuk $\\cos(2x)$ lewat substitusi.',
              },
              lines: [
                '\\cos x = \\sum_{n=0}^\\infty \\dfrac{(-1)^n x^{2n}}{(2n)!} \\quad (\\text{known series})',
                '\\text{Replace } x \\text{ with } 2x: \\quad \\cos(2x) = \\sum_{n=0}^\\infty \\dfrac{(-1)^n (2x)^{2n}}{(2n)!}',
                '= \\sum_{n=0}^\\infty \\dfrac{(-1)^n 4^n x^{2n}}{(2n)!}',
              ],
              explain: {
                en: 'Start from the already-known cosine series, substitute $2x$ for $x$ everywhere it appears, then simplify $(2x)^{2n}$ into $4^n x^{2n}$.',
                id: 'Mulai dari deret cosinus yang sudah diketahui, substitusikan $2x$ untuk $x$ di setiap tempat ia muncul, lalu sederhanakan $(2x)^{2n}$ menjadi $4^n x^{2n}$.',
              },
              hint: {
                en: 'The simplification in the last line can only happen after the substitution in the middle line has actually been written down.',
                id: 'Penyederhanaan pada baris terakhir hanya bisa terjadi setelah substitusi pada baris tengah benar-benar dituliskan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using the first 3 terms of the series for $\\sin x$, approximate $\\sin(0.5)$. (Round to four decimal places.)',
                id: 'Memakai 3 suku pertama deret $\\sin x$, hampiri $\\sin(0.5)$. (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: 0.5 - 0.5 ** 3 / 6 + 0.5 ** 5 / 120, tol: 0.0005 }],
              hints: [
                { en: '$0.5 - \\dfrac{0.5^3}{6} + \\dfrac{0.5^5}{120}$.', id: '$0.5 - \\dfrac{0.5^3}{6} + \\dfrac{0.5^5}{120}$.' },
              ],
              explain: {
                en: '$0.5-0.02083+0.00026=0.47943$ — matching the true value $\\sin(0.5)\\approx 0.4794$ to four decimal places.',
                id: '$0.5-0.02083+0.00026=0.47943$ — cocok dengan nilai sebenarnya $\\sin(0.5)\\approx 0.4794$ sampai empat desimal.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m4-s2-p',
        runtime: 'math',
        title: { en: 'Building Taylor Series', id: 'Membangun Deret Taylor' },
        brief: {
          en: 'A derivative-pattern check, a substitution, and a numeric approximation from a known series.',
          id: 'Pemeriksaan pola turunan, sebuah substitusi, dan sebuah hampiran numerik dari deret yang sudah diketahui.',
        },
        requirements: [
          { en: 'The Taylor coefficient is $c_n = f^{(n)}(a)/n!$.', id: 'Koefisien Taylor adalah $c_n = f^{(n)}(a)/n!$.' },
          { en: 'Substituting into a known series is almost always easier than computing a fresh derivative pattern.', id: 'Mensubstitusi ke deret yang sudah diketahui hampir selalu lebih mudah daripada menghitung pola turunan yang segar.' },
        ],
        tasks: [
          {
            prompt: { en: 'For $f(x)=\\cos x$, what is $f^{(4)}(0)$?', id: 'Untuk $f(x)=\\cos x$, berapa $f^{(4)}(0)$?' },
            blanks: [{ answer: 1 }],
            solution: ['\\cos\\to-\\sin\\to-\\cos\\to\\sin\\to\\cos, \\ f^{(4)}(0)=\\cos(0)=1'],
          },
          {
            prompt: { en: 'Using $e^x=\\sum x^n/n!$, substitute to find the coefficient of $x^2$ in the series for $e^{3x}$.', id: 'Memakai $e^x=\\sum x^n/n!$, substitusikan untuk mencari koefisien $x^2$ pada deret $e^{3x}$.' },
            blanks: [{ answer: 4.5 }],
            solution: ['e^{3x}=\\sum \\dfrac{(3x)^n}{n!}, \\text{ koefisien } x^2: \\dfrac{3^2}{2!}=\\dfrac{9}{2}=4{,}5'],
          },
          {
            prompt: { en: 'Using the first 3 terms of $e^x=\\sum x^n/n!$, approximate $e^{0.2}$. (Round to four decimal places.)', id: 'Memakai 3 suku pertama $e^x=\\sum x^n/n!$, hampiri $e^{0.2}$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 1 + 0.2 + 0.02, tol: 0.001 }],
            solution: ['1+0.2+\\dfrac{0.2^2}{2} = 1{,}22 \\ (\\text{sebenarnya } e^{0.2}\\approx 1{,}2214)'],
          },
        ],
        hints: [
          { en: 'For the second task, remember the coefficient of $x^n$ already carries a factor of $1/n!$ before the substitution\'s own powers are multiplied in.', id: 'Untuk butir kedua, ingat koefisien $x^n$ sudah membawa faktor $1/n!$ sebelum pangkat dari substitusinya sendiri dikalikan.' },
        ],
        xp: 50,
      },
    },
  ],
}
