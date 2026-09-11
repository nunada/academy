import type { Module } from '../types'

/** Module 5 — the squeeze theorem, and the one limit it was built to prove:
 *  $\sin x / x \to 1$. Neither factoring nor rationalising touches this
 *  limit — it needs a genuinely different idea, and it is the idea the next
 *  course leans on to differentiate sine at all. */
export const module5: Module = {
  id: 'lim-m5',
  title: { en: 'The Squeeze Theorem', id: 'Teorema Apit' },
  summary: {
    en: 'Trap a function between two others that share a limit, then use it to prove the famous sin(x)/x limit.',
    id: 'Menjepit sebuah fungsi di antara dua fungsi lain yang berbagi limit, lalu memakainya untuk membuktikan limit sin(x)/x yang terkenal.',
  },
  submodules: [
    /* --------------------------------------------- 5.1 the squeeze theorem */
    {
      id: 'lim-m5-s1',
      title: { en: 'Trapped Between Two Functions', id: 'Terjepit di Antara Dua Fungsi' },
      summary: {
        en: 'State the squeeze theorem, and use it on a function too wild to evaluate directly.',
        id: 'Menyatakan teorema apit, dan memakainya pada fungsi yang terlalu liar untuk dihitung langsung.',
      },
      lessons: [
        {
          id: 'lim-m5-s1-l1',
          title: { en: 'A Function Too Wild to Evaluate Directly', id: 'Fungsi yang Terlalu Liar untuk Dihitung Langsung' },
          goal: {
            en: 'State the squeeze theorem, and see why it rescues a limit no algebra can reach.',
            id: 'Menyatakan teorema apit, dan melihat mengapa ia menyelamatkan limit yang tak bisa dicapai aljabar apa pun.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'If the walls agree, so must what is between them', id: 'Bila dinding-dindingnya sepakat, yang di antaranya pun harus sepakat' },
              body: {
                en: 'Suppose $g(x) \\leq f(x) \\leq h(x)$ for every $x$ near $a$ (never mind $a$ itself), and\n$$\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$$\nThen $\\lim_{x \\to a} f(x) = L$ too. This is the **squeeze theorem**: $f$ is trapped between two functions that are themselves closing in on the same number, so $f$ has nowhere else to go but that number as well.\n\nThe theorem is only useful when a direct computation of $f$\'s own limit is out of reach — which is exactly the case for a function that oscillates wildly, like $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ near $0$. No algebra evaluates that limit directly, because the function never settles by itself. But wrap it in a shrinking envelope, and the envelope does the settling for it.',
                id: 'Misalkan $g(x) \\leq f(x) \\leq h(x)$ untuk setiap $x$ dekat $a$ (lupakan $a$ itu sendiri), dan\n$$\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$$\nMaka $\\lim_{x \\to a} f(x) = L$ juga. Inilah **teorema apit**: $f$ terjepit di antara dua fungsi yang sendirinya sedang merapat ke bilangan yang sama, sehingga $f$ tak punya tempat lain untuk dituju selain bilangan itu juga.\n\nTeorema ini hanya berguna ketika menghitung limit $f$ sendiri secara langsung tak terjangkau — dan itu persis kasus fungsi yang berosilasi liar, seperti $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ dekat $0$. Tak ada aljabar yang menghitung limit itu secara langsung, sebab fungsinya sendiri tak pernah mereda. Tetapi bungkus ia dalam amplop yang menyusut, dan amplopnya yang mereda untuknya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 1],
                ySpan: [-1, 1],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'muted', dashed: true, label: 'x²' },
                  { t: 'curve', f: '-x^2', color: 'muted', dashed: true, label: '-x²' },
                  { t: 'curve', f: 'x^2*sin(1/x)', color: 'a', label: 'x²sin(1/x)' },
                ],
                caption: {
                  en: 'The wild curve is trapped between $-x^2$ and $x^2$, since $\\left|\\sin\\frac{1}{x}\\right| \\leq 1$ always. Both walls close in on $0$ as $x \\to 0$, so the squeeze theorem forces the trapped curve to $0$ as well — however wildly it wiggles in between.',
                  id: 'Kurva liarnya terjepit di antara $-x^2$ dan $x^2$, sebab $\\left|\\sin\\frac{1}{x}\\right| \\leq 1$ selalu. Kedua dindingnya merapat ke $0$ saat $x \\to 0$, jadi teorema apit memaksa kurva yang terjepit itu juga menuju $0$ — sebagaimana liar pun ia berkelok di antaranya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why can\'t the limit of $x^2\\sin\\!\\left(\\frac1x\\right)$ as $x \\to 0$ be found by direct substitution or factoring?',
                id: 'Mengapa limit $x^2\\sin\\!\\left(\\frac1x\\right)$ saat $x \\to 0$ tak bisa dicari lewat substitusi langsung atau pemfaktoran?',
              },
              options: [
                { en: '$\\sin(1/x)$ oscillates without settling as $x \\to 0$ — there is no single value to substitute in for it', id: '$\\sin(1/x)$ berosilasi tanpa mereda saat $x \\to 0$ — tak ada satu nilai pun untuk disubstitusikan' },
                { en: 'The function is not defined at any point near $0$', id: 'Fungsinya tak terdefinisi di titik mana pun dekat $0$' },
                { en: '$x^2$ cannot be factored', id: '$x^2$ tak bisa difaktorkan' },
                { en: 'It actually can, and equals $0$ by direct substitution', id: 'Sebenarnya bisa, dan sama dengan $0$ lewat substitusi langsung' },
              ],
              answer: 0,
              explain: {
                en: '$\\sin(1/x)$ has no limit of its own as $x \\to 0$ — it keeps oscillating. There is nothing to "plug in", which is exactly why a squeeze, rather than algebra, is needed.',
                id: '$\\sin(1/x)$ sendiri tak punya limit saat $x \\to 0$ — ia terus berosilasi. Tak ada apa pun untuk "dimasukkan", dan itulah sebabnya diperlukan penjepitan, bukan aljabar.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above, what is $\\lim_{x \\to 0} x^2\\sin\\!\\left(\\frac1x\\right)$?',
                id: 'Dengan membaca grafik di atas, berapakah $\\lim_{x \\to 0} x^2\\sin\\!\\left(\\frac1x\\right)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 1],
                ySpan: [-1, 1],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'muted', dashed: true },
                  { t: 'curve', f: '-x^2', color: 'muted', dashed: true },
                  { t: 'curve', f: 'x^2*sin(1/x)', color: 'a' },
                ],
              },
              options: [
                { en: '0', id: '0' },
                { en: '1', id: '1' },
                { en: 'Does not exist — it oscillates forever', id: 'Tak ada — ia berosilasi selamanya' },
                { en: '$-1$', id: '$-1$' },
              ],
              answer: 0,
              explain: {
                en: 'Both dashed walls pinch to $0$ as $x \\to 0$, and the wiggly curve is trapped between them the whole way — it has no choice but to be squeezed to $0$ too.',
                id: 'Kedua dinding putus-putus mengerucut ke $0$ saat $x \\to 0$, dan kurva yang berkelok terjepit di antaranya sepanjang jalan — ia tak punya pilihan selain ikut terjepit ke $0$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'By the same reasoning, $-x^2 \\leq x^2\\cos\\!\\left(\\frac1x\\right) \\leq x^2$ for every $x \\neq 0$. Find $\\lim_{x \\to 0} x^2\\cos\\!\\left(\\frac1x\\right)$.',
                id: 'Dengan penalaran yang sama, $-x^2 \\leq x^2\\cos\\!\\left(\\frac1x\\right) \\leq x^2$ untuk setiap $x \\neq 0$. Tentukan $\\lim_{x \\to 0} x^2\\cos\\!\\left(\\frac1x\\right)$.',
              },
              blanks: [{ answer: 0 }],
              hints: [{ en: 'Both walls of the squeeze close in on the same number here.', id: 'Kedua dinding penjepitnya merapat ke bilangan yang sama di sini.' }],
              explain: {
                en: 'Both $-x^2$ and $x^2$ go to $0$ as $x \\to 0$, so by the squeeze theorem the trapped function does too — the cosine inside never had to settle by itself.',
                id: 'Baik $-x^2$ maupun $x^2$ menuju $0$ saat $x \\to 0$, jadi menurut teorema apit fungsi yang terjepit itu juga menuju $0$ — cosinus di dalamnya tak pernah harus mereda sendiri.',
              },
            },
          ],
        },
        {
          id: 'lim-m5-s1-l2',
          title: { en: 'Applying the Squeeze Theorem', id: 'Menerapkan Teorema Apit' },
          goal: {
            en: 'Given bounding functions directly, apply the squeeze theorem to any target limit, zero or otherwise.',
            id: 'Diberikan fungsi pengapit secara langsung, menerapkan teorema apit ke limit target mana pun, nol atau bukan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The recipe, in three checks', id: 'Caranya, dalam tiga pemeriksaan' },
              body: {
                en: 'Using the squeeze theorem is always the same three checks, in order:\n1. Confirm $g(x) \\leq f(x) \\leq h(x)$ near $a$.\n2. Compute $\\lim_{x\\to a} g(x)$ and $\\lim_{x\\to a} h(x)$ separately — ordinary limits, by whatever technique fits.\n3. Confirm the two agree. If they do, that shared value is $\\lim_{x\\to a} f(x)$ too, no further work needed.\n\nThe target does not have to be $0$. If $g(x) \\to 5$ and $h(x) \\to 5$, the trapped function is squeezed to $5$ — the theorem cares only that the walls meet, not what they meet at.',
                id: 'Memakai teorema apit selalu tiga pemeriksaan yang sama, berurutan:\n1. Pastikan $g(x) \\leq f(x) \\leq h(x)$ dekat $a$.\n2. Hitung $\\lim_{x\\to a} g(x)$ dan $\\lim_{x\\to a} h(x)$ secara terpisah — limit biasa, dengan teknik apa pun yang cocok.\n3. Pastikan keduanya sepakat. Bila iya, nilai bersama itu jugalah $\\lim_{x\\to a} f(x)$, tanpa kerja tambahan.\n\nTargetnya tak harus $0$. Bila $g(x) \\to 5$ dan $h(x) \\to 5$, fungsi yang terjepit dipaksa menuju $5$ — teoremanya hanya peduli kedua dindingnya bertemu, bukan di mana mereka bertemu.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [0, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '3+x^2', color: 'muted', dashed: true, label: '3+x²' },
                  { t: 'curve', f: '3-x^2', color: 'muted', dashed: true, label: '3-x²' },
                  { t: 'hline', y: 3, color: 'result' },
                ],
                caption: {
                  en: 'Both walls close in on $3$, not $0$, as $x \\to 0$ — so anything trapped between them is squeezed to $3$. The target the walls agree on is whatever it happens to be.',
                  id: 'Kedua dindingnya merapat ke $3$, bukan $0$, saat $x \\to 0$ — jadi apa pun yang terjepit di antaranya dipaksa menuju $3$. Target yang disepakati dindingnya adalah apa pun yang kebetulan itu.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $-x^2 \\leq f(x) \\leq x^2$ for all $x$ near $0$, what is $\\lim_{x \\to 0} f(x)$?',
                id: 'Jika $-x^2 \\leq f(x) \\leq x^2$ untuk semua $x$ dekat $0$, berapakah $\\lim_{x \\to 0} f(x)$?',
              },
              options: [
                { en: '0', id: '0' },
                { en: 'It cannot be determined without knowing $f$ exactly', id: 'Tak bisa ditentukan tanpa mengetahui $f$ secara pasti' },
                { en: '1', id: '1' },
                { en: 'It does not exist', id: 'Tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'Both bounds go to $0$ as $x \\to 0$, so the squeeze theorem pins $f$\'s limit to $0$ too — no need to know anything else about $f$.',
                id: 'Kedua batasnya menuju $0$ saat $x \\to 0$, jadi teorema apit memaku limit $f$ juga ke $0$ — tak perlu mengetahui apa pun lagi tentang $f$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above, if a function is trapped between the two dashed walls, what is its limit as $x \\to 0$?',
                id: 'Dengan membaca grafik di atas, jika sebuah fungsi terjepit di antara kedua dinding putus-putus, berapa limitnya saat $x \\to 0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [0, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '3+x^2', color: 'muted', dashed: true },
                  { t: 'curve', f: '3-x^2', color: 'muted', dashed: true },
                ],
              },
              options: [
                { en: '3', id: '3' },
                { en: '0', id: '0' },
                { en: 'Cannot be told without the trapped function\'s formula', id: 'Tak bisa ditentukan tanpa rumus fungsi yang terjepit' },
                { en: '8', id: '8' },
              ],
              answer: 0,
              explain: {
                en: 'Both walls pinch together at height $3$ as $x \\to 0$, so anything trapped between them is forced to the same height, whatever its own formula happens to be.',
                id: 'Kedua dindingnya mengerucut bersama pada tinggi $3$ saat $x \\to 0$, jadi apa pun yang terjepit di antaranya dipaksa ke tinggi yang sama, apa pun rumusnya sendiri.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Given $2 - x^2 \\leq g(x) \\leq 2 + x^2$ for all $x$ near $0$, find $\\lim_{x \\to 0} g(x)$.',
                id: 'Diberikan $2 - x^2 \\leq g(x) \\leq 2 + x^2$ untuk semua $x$ dekat $0$, tentukan $\\lim_{x \\to 0} g(x)$.',
              },
              blanks: [{ answer: 2 }],
              hints: [{ en: 'Both bounds approach the same number as $x \\to 0$ — find that number.', id: 'Kedua batasnya mendekati bilangan yang sama saat $x \\to 0$ — cari bilangan itu.' }],
              explain: {
                en: 'Both $2-x^2$ and $2+x^2$ go to $2$ as $x \\to 0$, so the squeeze theorem forces $g$\'s limit to $2$ as well.',
                id: 'Baik $2-x^2$ maupun $2+x^2$ menuju $2$ saat $x \\to 0$, jadi teorema apit memaksa limit $g$ juga menuju $2$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m5-s1-p',
        runtime: 'math',
        title: { en: 'Three Squeezes', id: 'Tiga Penjepitan' },
        brief: {
          en: 'Three applications of the squeeze theorem, with three different target values.',
          id: 'Tiga penerapan teorema apit, dengan tiga nilai target yang berbeda.',
        },
        requirements: [
          { en: 'Find the limit of each wall separately before comparing them.', id: 'Cari limit tiap dinding secara terpisah sebelum membandingkannya.' },
          { en: 'The squeeze theorem never needs the trapped function\'s own formula, only its bounds.', id: 'Teorema apit tak pernah memerlukan rumus fungsi yang terjepit itu sendiri, hanya batas-batasnya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Given $-x^4 \\leq f(x) \\leq x^4$ for all $x$ near $0$, find $\\lim_{x \\to 0} f(x)$.',
              id: 'Diberikan $-x^4 \\leq f(x) \\leq x^4$ untuk semua $x$ dekat $0$, tentukan $\\lim_{x \\to 0} f(x)$.',
            },
            blanks: [{ answer: 0 }],
            solution: ['\\lim_{x\\to 0}(-x^4) = \\lim_{x\\to 0} x^4 = 0 \\Rightarrow \\lim_{x\\to 0} f(x) = 0'],
          },
          {
            prompt: {
              en: 'Given $5 - |x| \\leq g(x) \\leq 5 + |x|$ for all $x$ near $0$, find $\\lim_{x \\to 0} g(x)$.',
              id: 'Diberikan $5 - |x| \\leq g(x) \\leq 5 + |x|$ untuk semua $x$ dekat $0$, tentukan $\\lim_{x \\to 0} g(x)$.',
            },
            blanks: [{ answer: 5 }],
            solution: ['\\lim_{x\\to 0}(5-|x|) = \\lim_{x\\to 0}(5+|x|) = 5 \\Rightarrow \\lim_{x\\to 0} g(x) = 5'],
          },
          {
            prompt: {
              en: 'Given $-2x^2 \\leq h(x) - 7 \\leq 2x^2$ for all $x$ near $0$, find $\\lim_{x \\to 0} h(x)$.',
              id: 'Diberikan $-2x^2 \\leq h(x) - 7 \\leq 2x^2$ untuk semua $x$ dekat $0$, tentukan $\\lim_{x \\to 0} h(x)$.',
            },
            blanks: [{ answer: 7 }],
            solution: ['\\text{squeeze gives } \\lim_{x\\to 0}(h(x)-7) = 0 \\Rightarrow \\lim_{x\\to 0} h(x) = 7'],
          },
        ],
        hints: [
          { en: 'In part 3, squeeze $h(x) - 7$ first, then add $7$ back at the end.', id: 'Pada butir 3, jepit $h(x) - 7$ dahulu, baru tambahkan $7$ kembali di akhir.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------- 5.2 the limit sin(x)/x */
    {
      id: 'lim-m5-s2',
      title: { en: 'The Limit sin(x)/x', id: 'Limit sin(x)/x' },
      summary: {
        en: 'The one famous limit no algebra reaches, proved by squeezing, and the family of trig limits it unlocks.',
        id: 'Satu limit terkenal yang tak tercapai aljabar mana pun, dibuktikan dengan penjepitan, dan keluarga limit trigonometri yang dibukanya.',
      },
      lessons: [
        {
          id: 'lim-m5-s2-l1',
          title: { en: 'Why sin(x)/x Approaches 1', id: 'Mengapa sin(x)/x Mendekati 1' },
          goal: {
            en: 'State lim(x→0) sin(x)/x = 1, and see it as a squeeze theorem result rather than an algebra trick.',
            id: 'Menyatakan lim(x→0) sin(x)/x = 1, dan melihatnya sebagai hasil teorema apit, bukan trik aljabar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A limit neither factoring nor rationalising can touch', id: 'Limit yang tak tersentuh pemfaktoran maupun perasionalan' },
              body: {
                en: '$\\dfrac{\\sin x}{x}$ substitutes to $\\dfrac{0}{0}$ at $x=0$ — the familiar warning sign. But $\\sin x$ has no algebraic factor of $x$ to cancel; Module 2\'s tools have nothing to grab onto here. This limit needs the squeeze theorem instead.\n\nA geometric argument (comparing the area of a thin triangle, a circular sector, and a slightly larger triangle, all built on an angle $x$) produces exactly the inequality\n$$\\cos x \\leq \\frac{\\sin x}{x} \\leq 1 \\qquad \\text{for } x \\text{ near } 0$$\nSince $\\cos x \\to 1$ and the constant $1$ trivially stays at $1$ as $x \\to 0$, the squeeze theorem finishes the job:\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$\nThis is one of the handful of limits in this course that is a genuinely new fact, not a consequence of the earlier techniques — and it is the fact the next course builds the derivative of $\\sin x$ on top of.',
                id: '$\\dfrac{\\sin x}{x}$ tersubstitusi menjadi $\\dfrac{0}{0}$ di $x=0$ — tanda peringatan yang sudah dikenal. Tetapi $\\sin x$ tak punya faktor aljabar dari $x$ untuk dicoret; alat-alat Modul 2 tak punya pegangan di sini. Limit ini memerlukan teorema apit sebagai gantinya.\n\nSebuah argumen geometris (membandingkan luas segitiga tipis, juring lingkaran, dan segitiga sedikit lebih besar, semuanya dibangun di atas sudut $x$) menghasilkan persis ketaksamaan\n$$\\cos x \\leq \\frac{\\sin x}{x} \\leq 1 \\qquad \\text{untuk } x \\text{ dekat } 0$$\nKarena $\\cos x \\to 1$ dan konstanta $1$ jelas tetap di $1$ saat $x \\to 0$, teorema apit menuntaskan pekerjaannya:\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$\nIni salah satu dari sedikit limit dalam kursus ini yang merupakan fakta baru sungguhan, bukan akibat dari teknik-teknik sebelumnya — dan inilah fakta yang menjadi dasar turunan $\\sin x$ pada kursus berikutnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-0.5, 1.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)/x', color: 'a' },
                  { t: 'hline', y: 1, color: 'muted', dashed: true },
                  { t: 'dot', x: 0, y: 1, open: true, color: 'a' },
                ],
                caption: {
                  en: 'The function is not even defined at $x=0$ — yet the curve heads straight for the hollow point at height $1$ from both sides.',
                  id: 'Fungsinya bahkan tak terdefinisi di $x=0$ — namun kurvanya menuju tepat ke titik kosong pada tinggi $1$ dari kedua sisi.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$ need the squeeze theorem rather than factoring?',
                id: 'Mengapa $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$ memerlukan teorema apit, bukan pemfaktoran?',
              },
              options: [
                { en: '$\\sin x$ has no algebraic factor of $x$ that can be cancelled', id: '$\\sin x$ tak punya faktor aljabar $x$ yang bisa dicoret' },
                { en: 'The limit does not actually exist', id: 'Limitnya sebenarnya tak ada' },
                { en: 'Direct substitution already works fine here', id: 'Substitusi langsung sudah berhasil di sini' },
                { en: '$x$ cannot appear in a denominator', id: '$x$ tak boleh muncul di penyebut' },
              ],
              answer: 0,
              explain: {
                en: 'Factoring rescues $\\frac{0}{0}$ only when a polynomial factor is shared top and bottom. $\\sin x$ is not a polynomial, so there is nothing of that kind to find — a geometric squeeze is what actually proves this one.',
                id: 'Pemfaktoran menyelamatkan $\\frac{0}{0}$ hanya ketika ada faktor polinom yang sama di atas dan bawah. $\\sin x$ bukan polinom, jadi tak ada yang semacam itu untuk ditemukan — penjepitan geometrislah yang sebenarnya membuktikan limit ini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above, what does $y = \\dfrac{\\sin x}{x}$ approach as $x \\to 0$?',
                id: 'Dengan membaca grafik di atas, apa yang didekati $y = \\dfrac{\\sin x}{x}$ saat $x \\to 0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-0.5, 1.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)/x', color: 'a' },
                  { t: 'hline', y: 1, color: 'muted', dashed: true },
                  { t: 'dot', x: 0, y: 1, open: true, color: 'a' },
                ],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: 'It does not exist — the function is undefined at $x=0$', id: 'Tak ada — fungsinya tak terdefinisi di $x=0$' },
                { en: '$\\infty$', id: '$\\infty$' },
              ],
              answer: 0,
              explain: {
                en: 'The curve heads for the hollow point at height $1$ from both directions — the function being undefined right at $x=0$ has no bearing on where its limit points, exactly as Module 1 established.',
                id: 'Kurvanya menuju titik kosong pada tinggi $1$ dari kedua arah — fungsinya yang tak terdefinisi tepat di $x=0$ tak berpengaruh pada ke mana limitnya menunjuk, persis seperti yang ditetapkan Modul 1.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use $\\lim_{u \\to 0} \\dfrac{\\sin u}{u} = 1$ with $u = 3x$ to evaluate $\\lim_{x \\to 0} \\frac{\\sin 3x}{3x}$.',
                id: 'Pakai $\\lim_{u \\to 0} \\dfrac{\\sin u}{u} = 1$ dengan $u = 3x$ untuk menghitung $\\lim_{x \\to 0} \\frac{\\sin 3x}{3x}$.',
              },
              blanks: [{ answer: 1 }],
              hints: [{ en: 'As $x \\to 0$, $u = 3x \\to 0$ too — it is the exact same special limit, just relabelled.', id: 'Saat $x \\to 0$, $u = 3x \\to 0$ juga — ini limit istimewa yang persis sama, hanya diberi label ulang.' }],
              explain: {
                en: 'Whatever sits inside — $x$, $3x$, or any expression going to $0$ — the pattern $\\dfrac{\\sin(\\text{that thing})}{\\text{that thing}}$ always approaches $1$.',
                id: 'Apa pun yang ada di dalamnya — $x$, $3x$, atau ekspresi apa pun yang menuju $0$ — pola $\\dfrac{\\sin(\\text{itu})}{\\text{itu}}$ selalu mendekati $1$.',
              },
            },
          ],
        },
        {
          id: 'lim-m5-s2-l2',
          title: { en: 'Consequences and Related Limits', id: 'Akibat dan Limit Terkait' },
          goal: {
            en: 'Derive (1 − cos x)/x → 0 from the sine limit, and evaluate the whole family sin(kx)/x.',
            id: 'Menurunkan (1 − cos x)/x → 0 dari limit sinus, dan menghitung seluruh keluarga sin(kx)/x.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One more limit, built on the first', id: 'Satu limit lagi, dibangun di atas yang pertama' },
              body: {
                en: 'A close relative: $\\lim_{x\\to 0} \\dfrac{1-\\cos x}{x}$. Multiply by the conjugate $1+\\cos x$ — Module 2\'s rationalising move, still at work here:\n$$\\frac{1-\\cos x}{x} \\cdot \\frac{1+\\cos x}{1+\\cos x} = \\frac{1-\\cos^2 x}{x(1+\\cos x)} = \\frac{\\sin^2 x}{x(1+\\cos x)} = \\frac{\\sin x}{x} \\cdot \\frac{\\sin x}{1+\\cos x}$$\nAs $x \\to 0$: the first factor $\\to 1$ (this lesson\'s limit), and the second factor $\\to \\dfrac{0}{2} = 0$. Their product goes to $1 \\cdot 0 = 0$:\n$$\\lim_{x \\to 0} \\frac{1-\\cos x}{x} = 0$$\nAnd the same substitution trick generalises the first limit into a whole family:\n$$\\lim_{x \\to 0} \\frac{\\sin kx}{x} = k, \\qquad \\lim_{x \\to 0} \\frac{\\tan x}{x} = 1$$\nthe second because $\\tan x = \\dfrac{\\sin x}{\\cos x}$, and $\\cos x \\to 1$ contributes nothing to change.',
                id: 'Kerabat dekatnya: $\\lim_{x\\to 0} \\dfrac{1-\\cos x}{x}$. Kalikan dengan sekawan $1+\\cos x$ — gerakan perasionalan Modul 2, masih bekerja di sini:\n$$\\frac{1-\\cos x}{x} \\cdot \\frac{1+\\cos x}{1+\\cos x} = \\frac{1-\\cos^2 x}{x(1+\\cos x)} = \\frac{\\sin^2 x}{x(1+\\cos x)} = \\frac{\\sin x}{x} \\cdot \\frac{\\sin x}{1+\\cos x}$$\nSaat $x \\to 0$: faktor pertama $\\to 1$ (limit pelajaran ini), dan faktor kedua $\\to \\dfrac{0}{2} = 0$. Hasil kali keduanya menuju $1 \\cdot 0 = 0$:\n$$\\lim_{x \\to 0} \\frac{1-\\cos x}{x} = 0$$\nDan trik substitusi yang sama menggeneralisasi limit pertama menjadi satu keluarga penuh:\n$$\\lim_{x \\to 0} \\frac{\\sin kx}{x} = k, \\qquad \\lim_{x \\to 0} \\frac{\\tan x}{x} = 1$$\nyang kedua sebab $\\tan x = \\dfrac{\\sin x}{\\cos x}$, dan $\\cos x \\to 1$ tak menyumbang perubahan apa pun.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-0.5, 1],
                ticks: true,
                items: [
                  { t: 'curve', f: '(1-cos(x))/x', color: 'a' },
                  { t: 'dot', x: 0, y: 0, open: true, color: 'a' },
                ],
                caption: {
                  en: 'Undefined right at $x=0$, but the curve flattens toward height $0$ from both sides — the second limit this lesson derives.',
                  id: 'Tak terdefinisi tepat di $x=0$, tetapi kurvanya memipih menuju tinggi $0$ dari kedua sisi — limit kedua yang diturunkan pelajaran ini.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\lim_{x \\to 0} \\dfrac{\\sin 7x}{x}$?',
                id: 'Berapakah $\\lim_{x \\to 0} \\dfrac{\\sin 7x}{x}$?',
              },
              options: [
                { en: '7', id: '7' },
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: 'Does not exist', id: 'Tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'This matches the family $\\lim_{x\\to 0}\\frac{\\sin kx}{x} = k$ with $k=7$ directly.',
                id: 'Ini persis cocok dengan keluarga $\\lim_{x\\to 0}\\frac{\\sin kx}{x} = k$ dengan $k=7$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y = \\dfrac{1-\\cos x}{x}$, what does it approach as $x \\to 0$?',
                id: 'Dengan membaca grafik $y = \\dfrac{1-\\cos x}{x}$ di atas, apa yang didekatinya saat $x \\to 0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-0.5, 1],
                ticks: true,
                items: [
                  { t: 'curve', f: '(1-cos(x))/x', color: 'a' },
                  { t: 'dot', x: 0, y: 0, open: true, color: 'a' },
                ],
              },
              options: [
                { en: '0', id: '0' },
                { en: '1', id: '1' },
                { en: '0.5', id: '0,5' },
                { en: 'It does not exist', id: 'Tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'Both sides flatten toward the hollow point at height $0$.',
                id: 'Kedua sisi memipih menuju titik kosong pada tinggi $0$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate both, using the family of limits from this lesson.',
                id: 'Hitung keduanya, dengan memakai keluarga limit dari pelajaran ini.',
              },
              blanks: [
                { label: '\\lim_{x \\to 0} \\dfrac{\\sin 4x}{x} =', answer: 4 },
                { label: '\\lim_{x \\to 0} \\dfrac{\\tan x}{x} =', answer: 1 },
              ],
              hints: [{ en: 'The first matches $\\frac{\\sin kx}{x} \\to k$; the second is a limit stated directly in the lesson.', id: 'Yang pertama cocok dengan $\\frac{\\sin kx}{x} \\to k$; yang kedua adalah limit yang dinyatakan langsung di pelajaran.' }],
              explain: {
                en: '$\\dfrac{\\sin 4x}{x} \\to 4$, and $\\dfrac{\\tan x}{x} \\to 1$ — both direct applications of the family this lesson built on top of $\\frac{\\sin x}{x} \\to 1$.',
                id: '$\\dfrac{\\sin 4x}{x} \\to 4$, dan $\\dfrac{\\tan x}{x} \\to 1$ — keduanya penerapan langsung keluarga yang dibangun pelajaran ini di atas $\\frac{\\sin x}{x} \\to 1$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m5-s2-p',
        runtime: 'math',
        title: { en: 'The sin(x)/x Family', id: 'Keluarga sin(x)/x' },
        brief: {
          en: 'Three limits from the family this module built: a scaled sine, a cosine consequence, and a combination.',
          id: 'Tiga limit dari keluarga yang dibangun modul ini: sinus berskala, akibat cosinus, dan sebuah gabungan.',
        },
        requirements: [
          { en: 'Every limit here traces back to $\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1$.', id: 'Setiap limit di sini bermuara pada $\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1$.' },
          { en: 'Match the expression to one member of the family before computing anything.', id: 'Cocokkan ekspresinya dengan salah satu anggota keluarga sebelum menghitung apa pun.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 10x}{x}$.', id: 'Hitung $\\lim_{x \\to 0} \\dfrac{\\sin 10x}{x}$.' },
            blanks: [{ answer: 10 }],
            solution: ['\\lim_{x\\to 0}\\frac{\\sin kx}{x} = k \\text{ with } k=10'],
          },
          {
            prompt: { en: 'Evaluate $\\lim_{x \\to 0} \\dfrac{1-\\cos 2x}{x}$.', id: 'Hitung $\\lim_{x \\to 0} \\dfrac{1-\\cos 2x}{x}$.' },
            blanks: [{ answer: 0 }],
            solution: ['\\text{Same derivation as the lesson, with } 2x \\text{ in place of } x \\Rightarrow 0'],
          },
          {
            prompt: {
              en: 'Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 6x}{\\sin 2x}$ by writing each as $\\dfrac{\\sin kx}{x}$ over a common $x$.',
              id: 'Hitung $\\lim_{x \\to 0} \\dfrac{\\sin 6x}{\\sin 2x}$ dengan menulis masing-masing sebagai $\\dfrac{\\sin kx}{x}$ atas $x$ yang sama.',
            },
            blanks: [{ answer: 3 }],
            solution: [
              '\\frac{\\sin 6x}{\\sin 2x} = \\frac{\\sin 6x / x}{\\sin 2x / x} \\to \\frac{6}{2} = 3',
            ],
          },
        ],
        hints: [
          { en: 'For part 3, divide top and bottom by the same $x$ first — then two members of the family appear at once.', id: 'Untuk butir 3, bagi atas dan bawah dengan $x$ yang sama dahulu — lalu dua anggota keluarga muncul sekaligus.' },
        ],
        xp: 50,
      },
    },
  ],
}
