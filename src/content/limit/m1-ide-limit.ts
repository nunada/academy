import type { Module } from '../types'

/** Module 1 — the idea a limit is trying to capture, before any algebra
 *  touches it: what a function does *near* a point, which is a question
 *  entirely separate from what it does *at* that point. Every later module
 *  is a way of answering this same question faster. */
export const module1: Module = {
  id: 'lim-m1',
  title: { en: 'The Idea of a Limit', id: 'Gagasan Limit' },
  summary: {
    en: 'What "approaches" means, one-sided limits, and the three ways a limit can fail to exist.',
    id: 'Apa arti "mendekati", limit sepihak, dan tiga cara limit bisa tidak ada.',
  },
  submodules: [
    /* ------------------------------------------ 1.1 reading a limit off a table and a graph */
    {
      id: 'lim-m1-s1',
      title: { en: 'Reading Limits from a Table and a Graph', id: 'Membaca Limit dari Tabel dan Grafik' },
      summary: {
        en: 'Say what a limit means, read one off numbers approaching a point, and split it into two one-sided limits.',
        id: 'Menyebut arti limit, membacanya dari bilangan yang mendekati suatu titik, dan memecahnya menjadi dua limit sepihak.',
      },
      lessons: [
        {
          id: 'lim-m1-s1-l1',
          title: { en: 'What a Limit Says', id: 'Apa yang Dikatakan Limit' },
          goal: {
            en: 'Read lim(x→a) f(x) = L correctly, and see why it can talk about a point where f is undefined.',
            id: 'Membaca lim(x→a) f(x) = L dengan benar, dan melihat mengapa ia bisa berbicara tentang titik tempat f tak terdefinisi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Approaching, not arriving', id: 'Mendekati, bukan tiba' },
              body: {
                en: 'We write\n$$\\lim_{x \\to a} f(x) = L$$\nread "the limit of $f(x)$ as $x$ approaches $a$ is $L$", to say: as $x$ is taken **closer and closer** to $a$ — from either side, but never equal to $a$ — the values $f(x)$ get closer and closer to $L$.\n\nThat "never equal to $a$" is not a technicality to skip past. A limit is a statement about the **neighbourhood** of $a$, and it is deliberately silent about $a$ itself. $f(a)$ might equal $L$, might equal something else, or might not exist at all — none of that has been asked yet. This lesson is entirely about what happens on the way in.',
                id: 'Kita tulis\n$$\\lim_{x \\to a} f(x) = L$$\ndibaca "limit $f(x)$ untuk $x$ mendekati $a$ adalah $L$", untuk menyatakan: ketika $x$ diambil **semakin dekat** ke $a$ — dari sisi mana pun, tetapi tak pernah sama dengan $a$ — nilai $f(x)$ menjadi semakin dekat ke $L$.\n\n"Tak pernah sama dengan $a$" itu bukan detail teknis yang bisa dilewati. Limit adalah pernyataan tentang **sekitar** $a$, dan ia sengaja diam tentang $a$ itu sendiri. $f(a)$ bisa saja sama dengan $L$, bisa berbeda, atau bisa saja tak ada — tak satu pun dari itu sedang ditanyakan di sini. Pelajaran ini seluruhnya tentang apa yang terjadi dalam perjalanan menuju $a$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A limit at a point the function refuses', id: 'Limit di titik yang ditolak fungsinya' },
              body: {
                en: 'Take $f(x) = \\dfrac{x^2 - 1}{x - 1}$. Plug in $x = 1$ and you get $\\tfrac{0}{0}$ — undefined. So $f(1)$ does not exist. But for **every other** $x$,\n$$f(x) = \\frac{(x-1)(x+1)}{x-1} = x + 1 \\qquad (x \\neq 1)$$\nso the graph of $f$ is the line $y = x + 1$ with a single point missing at $x = 1$. As $x$ creeps toward $1$ from either side, $f(x)$ creeps toward $2$ — the value the line would have taken, hole or no hole. So\n$$\\lim_{x \\to 1} f(x) = 2$$\nperfectly well-defined, at a point where $f$ itself has nothing to say.',
                id: 'Ambil $f(x) = \\dfrac{x^2 - 1}{x - 1}$. Masukkan $x = 1$ dan diperoleh $\\tfrac{0}{0}$ — tak terdefinisi. Jadi $f(1)$ tidak ada. Tetapi untuk **setiap** $x$ lainnya,\n$$f(x) = \\frac{(x-1)(x+1)}{x-1} = x + 1 \\qquad (x \\neq 1)$$\nsehingga grafik $f$ adalah garis $y = x + 1$ dengan satu titik hilang di $x = 1$. Ketika $x$ merayap menuju $1$ dari sisi mana pun, $f(x)$ merayap menuju $2$ — nilai yang akan diberikan garis itu, berlubang atau tidak. Jadi\n$$\\lim_{x \\to 1} f(x) = 2$$\nterdefinisi dengan sempurna, di titik yang justru tak dikatakan apa-apa oleh $f$ sendiri.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 4],
                ySpan: [-2, 5],
                ticks: true,
                params: [{ name: 'd', min: -1, max: 1, step: 0.05, value: 0.6, label: 'x−1' }],
                items: [
                  { t: 'curve', f: '(x^2-1)/(x-1)', color: 'a', label: 'f(x)' },
                  { t: 'dot', x: 1, y: 2, open: true, color: 'a' },
                  { t: 'dot', x: '1+d', y: '((1+d)^2-1)/((1+d)-1)', color: 'b', label: 'x' },
                ],
                caption: {
                  en: 'Drag $x-1$ toward $0$ from either side — the marked point slides along the curve straight into the hole, its height heading for $2$. At exactly $0$ the point itself vanishes: $f(1)$ truly does not exist.',
                  id: 'Geser $x-1$ menuju $0$ dari sisi mana pun — titik yang ditandai bergeser sepanjang kurva tepat menuju lubangnya, tingginya menuju $2$. Tepat di $0$ titiknya sendiri lenyap: $f(1)$ memang tak ada.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'As $x$ gets closer and closer to $3$ (never equal to it), $f(x)$ gets closer and closer to $7$. What can you conclude?',
                id: 'Ketika $x$ semakin dekat ke $3$ (tak pernah sama dengannya), $f(x)$ semakin dekat ke $7$. Apa yang bisa disimpulkan?',
              },
              options: [
                { en: '$\\lim_{x \\to 3} f(x) = 7$', id: '$\\lim_{x \\to 3} f(x) = 7$' },
                { en: '$f(3) = 7$', id: '$f(3) = 7$' },
                { en: 'Both of the above', id: 'Keduanya' },
                { en: 'Nothing — $f(3)$ must be checked separately', id: 'Tak ada — $f(3)$ harus diperiksa terpisah' },
              ],
              answer: 0,
              explain: {
                en: 'The limit describes only the approach, so $\\lim_{x \\to 3} f(x) = 7$ follows directly. Whether $f(3)$ also equals $7$, equals something else, or does not exist is a completely separate question — the limit alone cannot answer it.',
                id: 'Limit hanya menggambarkan pendekatannya, jadi $\\lim_{x \\to 3} f(x) = 7$ langsung mengikuti. Apakah $f(3)$ juga sama dengan $7$, berbeda, atau bahkan tak ada, adalah pertanyaan yang sama sekali terpisah — limit saja tak bisa menjawabnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, what is $\\lim_{x \\to 1} f(x)$?',
                id: 'Dengan membaca grafik di bawah, berapakah $\\lim_{x \\to 1} f(x)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 4],
                ySpan: [-2, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x^2-1)/(x-1)', color: 'a' },
                  { t: 'dot', x: 1, y: 2, open: true, color: 'a' },
                ],
              },
              options: [
                { en: '2', id: '2' },
                { en: '0', id: '0' },
                { en: 'Undefined — the graph has a hole there', id: 'Tak terdefinisi — grafiknya berlubang di situ' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: 'The hole says $f(1)$ is undefined — but the limit only cares where the curve is heading, and from both sides it heads for height $2$.',
                id: 'Lubangnya mengatakan $f(1)$ tak terdefinisi — tetapi limit hanya peduli ke mana kurvanya menuju, dan dari kedua sisi ia menuju tinggi $2$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The table shows $f(x) = \\dfrac{x^2 - 9}{x - 3}$ at values of $x$ close to $3$.\n$$x = 2.9,\\ 2.99,\\ 2.999 \\ \\to \\ f(x) = 5.9,\\ 5.99,\\ 5.999$$\n$$x = 3.1,\\ 3.01,\\ 3.001 \\ \\to \\ f(x) = 6.1,\\ 6.01,\\ 6.001$$\nWhat does the table suggest for $\\lim_{x \\to 3} f(x)$?',
                id: 'Tabel menunjukkan $f(x) = \\dfrac{x^2 - 9}{x - 3}$ pada nilai $x$ dekat $3$.\n$$x = 2{,}9,\\ 2{,}99,\\ 2{,}999 \\ \\to \\ f(x) = 5{,}9,\\ 5{,}99,\\ 5{,}999$$\n$$x = 3{,}1,\\ 3{,}01,\\ 3{,}001 \\ \\to \\ f(x) = 6{,}1,\\ 6{,}01,\\ 6{,}001$$\nApa yang disarankan tabel itu untuk $\\lim_{x \\to 3} f(x)$?',
              },
              blanks: [{ label: '\\lim_{x \\to 3} f(x) =', answer: 6 }],
              hints: [
                { en: 'From both sides the values are closing in on one number — read it off the pattern.', id: 'Dari kedua sisi nilainya semakin merapat ke satu bilangan — baca dari polanya.' },
              ],
              explain: {
                en: 'From below, $f(x) \\to 6$; from above, $f(x) \\to 6$ as well. They agree, so the table points to $\\lim_{x \\to 3} f(x) = 6$ — and indeed $\\frac{x^2-9}{x-3} = x + 3$ for $x \\neq 3$, which is $6$ at $x = 3$.',
                id: 'Dari bawah, $f(x) \\to 6$; dari atas, $f(x) \\to 6$ juga. Keduanya sepakat, jadi tabel menunjuk ke $\\lim_{x \\to 3} f(x) = 6$ — dan memang $\\frac{x^2-9}{x-3} = x + 3$ untuk $x \\neq 3$, yang bernilai $6$ di $x = 3$.',
              },
            },
          ],
        },
        {
          id: 'lim-m1-s1-l2',
          title: { en: 'One-Sided Limits', id: 'Limit Sepihak' },
          goal: {
            en: 'Tell a left-hand limit from a right-hand one, and know exactly when the two-sided limit exists.',
            id: 'Membedakan limit kiri dari limit kanan, dan mengetahui persis kapan limit dua sisi ada.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Approaching from one direction only', id: 'Mendekati dari satu arah saja' },
              body: {
                en: 'Sometimes it matters which side $x$ approaches from. The **left-hand limit**\n$$\\lim_{x \\to a^-} f(x)$$\nlooks only at $x$ values less than $a$, closing in from below. The **right-hand limit**\n$$\\lim_{x \\to a^+} f(x)$$\nlooks only at $x$ values greater than $a$, closing in from above.\n\nThe two-sided limit $\\lim_{x \\to a} f(x)$ exists **exactly when both one-sided limits exist and agree** — and then it equals their common value. If they disagree, the two-sided limit simply does not exist: there is no single number the function is closing in on, because it is closing in on two different ones depending on which way you look.',
                id: 'Kadang penting dari sisi mana $x$ mendekat. **Limit kiri**\n$$\\lim_{x \\to a^-} f(x)$$\nhanya memandang nilai $x$ yang kurang dari $a$, merapat dari bawah. **Limit kanan**\n$$\\lim_{x \\to a^+} f(x)$$\nhanya memandang nilai $x$ yang lebih dari $a$, merapat dari atas.\n\nLimit dua sisi $\\lim_{x \\to a} f(x)$ ada **tepat ketika kedua limit sepihak ada dan sepakat** — dan nilainya adalah nilai bersama itu. Bila keduanya tidak sepakat, limit dua sisinya sekadar tidak ada: tak ada satu bilangan pun yang didekati fungsi itu, sebab ia mendekati dua bilangan berbeda tergantung dari arah mana kamu memandang.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 4],
                ySpan: [-1, 5],
                ticks: true,
                params: [
                  { name: 'dl', min: -1.5, max: -0.02, step: 0.02, value: -0.6, label: 'left' },
                  { name: 'dr', min: 0.02, max: 1.5, step: 0.02, value: 0.6, label: 'right' },
                ],
                items: [
                  { t: 'curve', f: 'x+1', from: -2, to: 1, color: 'a' },
                  { t: 'dot', x: 1, y: 2, open: true, color: 'a' },
                  { t: 'curve', f: 'x^2+2', from: 1, to: 3, color: 'b' },
                  { t: 'dot', x: 1, y: 3, color: 'b' },
                  { t: 'dot', x: '1+dl', y: '(1+dl)+1', color: 'result', label: 'from left' },
                  { t: 'dot', x: '1+dr', y: '(1+dr)^2+2', color: 'c', label: 'from right' },
                ],
                caption: {
                  en: 'Drag both sliders toward $0$: the left point heads for height $2$, the right point for height $3$ — two different destinations, which is exactly why the two-sided limit at $x=1$ does not exist, even though $f(1)=3$ (the filled dot) is perfectly defined.',
                  id: 'Geser kedua slider menuju $0$: titik kiri menuju tinggi $2$, titik kanan menuju tinggi $3$ — dua tujuan berbeda, dan itulah persis sebabnya limit dua sisi di $x=1$ tidak ada, meskipun $f(1)=3$ (titik penuh) terdefinisi sempurna.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $\\lim_{x \\to a^-} f(x) = 3$ and $\\lim_{x \\to a^+} f(x) = 5$, does $\\lim_{x \\to a} f(x)$ exist?',
                id: 'Jika $\\lim_{x \\to a^-} f(x) = 3$ dan $\\lim_{x \\to a^+} f(x) = 5$, apakah $\\lim_{x \\to a} f(x)$ ada?',
              },
              options: [
                { en: 'No — the one-sided limits disagree', id: 'Tidak — kedua limit sepihaknya tidak sepakat' },
                { en: 'Yes, and it equals $3$', id: 'Ya, dan sama dengan $3$' },
                { en: 'Yes, and it equals $5$', id: 'Ya, dan sama dengan $5$' },
                { en: 'Yes, and it equals $4$, the average', id: 'Ya, dan sama dengan $4$, rata-ratanya' },
              ],
              answer: 0,
              explain: {
                en: 'The two-sided limit needs the one-sided limits to agree. They do not — $3 \\neq 5$ — so there is no single value the function is approaching, and the limit does not exist. It is never the average of the two.',
                id: 'Limit dua sisi memerlukan kedua limit sepihaknya sepakat. Keduanya tidak — $3 \\neq 5$ — jadi tak ada satu nilai pun yang didekati fungsinya, dan limitnya tidak ada. Ia tak pernah menjadi rata-rata keduanya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, what is $\\lim_{x \\to 1^+} f(x)$?',
                id: 'Dengan membaca grafik di bawah, berapakah $\\lim_{x \\to 1^+} f(x)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 4],
                ySpan: [-1, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x+1', from: -2, to: 1, color: 'a' },
                  { t: 'dot', x: 1, y: 2, open: true, color: 'a' },
                  { t: 'curve', f: 'x^2+2', from: 1, to: 3, color: 'b' },
                  { t: 'dot', x: 1, y: 3, color: 'b' },
                ],
              },
              options: [
                { en: '3', id: '3' },
                { en: '2', id: '2' },
                { en: 'Does not exist', id: 'Tidak ada' },
                { en: '5', id: '5' },
              ],
              answer: 0,
              explain: {
                en: 'The right-hand limit looks only at $x > 1$, where the curve is the upper branch heading for height $3$ as $x \\to 1^+$.',
                id: 'Limit kanan hanya memandang $x > 1$, tempat kurvanya adalah cabang atas yang menuju tinggi $3$ saat $x \\to 1^+$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = x + 1$ for $x < 2$ and $f(x) = x^2$ for $x \\geq 2$. Find both one-sided limits at $x = 2$.',
                id: 'Misalkan $f(x) = x + 1$ untuk $x < 2$ dan $f(x) = x^2$ untuk $x \\geq 2$. Tentukan kedua limit sepihak di $x = 2$.',
              },
              blanks: [
                { label: '\\lim_{x \\to 2^-} f(x) =', answer: 3 },
                { label: '\\lim_{x \\to 2^+} f(x) =', answer: 4 },
              ],
              hints: [
                { en: 'For the left-hand limit, use the rule that applies just below $2$; for the right-hand limit, the rule that applies at and above $2$.', id: 'Untuk limit kiri, pakai aturan yang berlaku tepat di bawah $2$; untuk limit kanan, aturan yang berlaku di $2$ dan di atasnya.' },
              ],
              explain: {
                en: 'From the left, $f(x) = x+1 \\to 3$. From the right, $f(x) = x^2 \\to 4$. They disagree, $3 \\neq 4$, so $\\lim_{x \\to 2} f(x)$ does not exist — even though $f(2) = 4$ is perfectly defined.',
                id: 'Dari kiri, $f(x) = x+1 \\to 3$. Dari kanan, $f(x) = x^2 \\to 4$. Keduanya tidak sepakat, $3 \\neq 4$, jadi $\\lim_{x \\to 2} f(x)$ tidak ada — meskipun $f(2) = 4$ terdefinisi sempurna.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m1-s1-p',
        runtime: 'math',
        title: { en: 'Reading Limits', id: 'Membaca Limit' },
        brief: {
          en: 'A limit from a table, a pair of one-sided limits, and a limit read off a graph with a hole.',
          id: 'Satu limit dari tabel, sepasang limit sepihak, dan satu limit yang dibaca dari grafik berlubang.',
        },
        requirements: [
          { en: 'A limit describes the approach, never the value at the point itself.', id: 'Limit menggambarkan pendekatannya, tak pernah nilai di titik itu sendiri.' },
          { en: 'Two one-sided limits must agree before the two-sided limit exists.', id: 'Kedua limit sepihak harus sepakat sebelum limit dua sisinya ada.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'As $x \\to 5$, the values of $g(x) = \\dfrac{x^2 - 25}{x-5}$ close in on one number. Find $\\lim_{x \\to 5} g(x)$.',
              id: 'Saat $x \\to 5$, nilai $g(x) = \\dfrac{x^2 - 25}{x-5}$ merapat ke satu bilangan. Tentukan $\\lim_{x \\to 5} g(x)$.',
            },
            blanks: [{ answer: 10 }],
            solution: ['g(x) = \\dfrac{(x-5)(x+5)}{x-5} = x+5 \\ (x \\neq 5) \\Rightarrow \\lim_{x \\to 5} g(x) = 10'],
          },
          {
            prompt: {
              en: 'Let $h(x) = 2x$ for $x \\leq 0$ and $h(x) = x + 3$ for $x > 0$. Find both one-sided limits at $x = 0$.',
              id: 'Misalkan $h(x) = 2x$ untuk $x \\leq 0$ dan $h(x) = x + 3$ untuk $x > 0$. Tentukan kedua limit sepihak di $x = 0$.',
            },
            blanks: [
              { label: '\\lim_{x \\to 0^-} h(x) =', answer: 0 },
              { label: '\\lim_{x \\to 0^+} h(x) =', answer: 3 },
            ],
            solution: ['\\lim_{x \\to 0^-} h(x) = 2(0) = 0, \\qquad \\lim_{x \\to 0^+} h(x) = 0 + 3 = 3'],
          },
          {
            prompt: {
              en: 'A graph shows $f(x) = \\sqrt{x-1}$, starting at the point $(1, 0)$ and rising to the right. What is $\\lim_{x \\to 1^+} f(x)$?',
              id: 'Sebuah grafik menunjukkan $f(x) = \\sqrt{x-1}$, bermula di titik $(1, 0)$ dan naik ke kanan. Berapakah $\\lim_{x \\to 1^+} f(x)$?',
            },
            blanks: [{ answer: 0 }],
            solution: ['\\text{The curve starts exactly at } (1,0), \\text{ so } \\lim_{x \\to 1^+}\\sqrt{x-1} = 0'],
          },
        ],
        hints: [
          { en: 'For part 1, factor first — the same technique from the lesson.', id: 'Untuk butir 1, faktorkan dahulu — teknik yang sama dari pelajaran.' },
          { en: 'For part 3, only the right-hand limit makes sense here: $\\sqrt{x-1}$ has no left-hand side to approach from at $x=1$.', id: 'Untuk butir 3, hanya limit kanan yang masuk akal di sini: $\\sqrt{x-1}$ tak punya sisi kiri untuk didekati di $x=1$.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------- 1.2 when a limit fails to exist */
    {
      id: 'lim-m1-s2',
      title: { en: 'When a Limit Fails to Exist', id: 'Ketika Limit Tidak Ada' },
      summary: {
        en: 'Three ways a limit can fail, and why the limit never depends on how the point itself is defined.',
        id: 'Tiga cara limit bisa gagal ada, dan mengapa limit tak pernah bergantung pada bagaimana titik itu sendiri didefinisikan.',
      },
      lessons: [
        {
          id: 'lim-m1-s2-l1',
          title: { en: 'Three Ways a Limit Can Fail', id: 'Tiga Cara Limit Bisa Gagal' },
          goal: {
            en: 'Recognise a jump, an unbounded run-away, and an oscillation as the three ways a limit fails to exist.',
            id: 'Mengenali lompatan, larian tak terbatas, dan osilasi sebagai tiga cara limit gagal ada.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A jump, a run-away, or a refusal to settle', id: 'Lompatan, larian, atau penolakan untuk mereda' },
              body: {
                en: 'A limit fails to exist in essentially three ways.\n\n**A jump.** The one-sided limits exist but disagree — the last lesson\'s example. The function is closing in on two different heights depending on the direction.\n\n**An unbounded run-away.** $f(x)$ grows past every bound as $x \\to a$, in either direction — it never settles near any single number because it never settles at all. $\\dfrac{1}{x^2}$ as $x \\to 0$ does this: it rockets to $+\\infty$ from both sides.\n\n**Endless oscillation.** $f(x)$ keeps swinging between values without ever narrowing in on one. $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ does this as $x \\to 0$: it sweeps through every value from $-1$ to $1$ infinitely many times, no matter how close $x$ gets to $0$.',
                id: 'Limit gagal ada pada dasarnya dengan tiga cara.\n\n**Lompatan.** Kedua limit sepihaknya ada tetapi tidak sepakat — contoh pelajaran sebelumnya. Fungsinya merapat ke dua ketinggian berbeda tergantung arahnya.\n\n**Larian tak terbatas.** $f(x)$ tumbuh melewati batas apa pun saat $x \\to a$, ke arah mana pun — ia tak pernah mereda mendekati satu bilangan sebab ia memang tak pernah mereda. $\\dfrac{1}{x^2}$ saat $x \\to 0$ berperilaku begini: ia melesat ke $+\\infty$ dari kedua sisi.\n\n**Osilasi tanpa henti.** $f(x)$ terus berayun di antara nilai-nilai tanpa pernah merapat ke satu titik. $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ begini saat $x \\to 0$: ia menyapu setiap nilai dari $-1$ sampai $1$ tak berhingga kali, sedekat apa pun $x$ menuju $0$.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [-1, 8],
                ticks: true,
                items: [{ t: 'curve', f: '1/x^2', color: 'a', label: '1/x²' }],
                caption: {
                  en: 'Neither side settles near a number — both race upward without bound as $x \\to 0$. There is nothing for the limit to equal.',
                  id: 'Tak satu sisi pun mereda mendekati suatu bilangan — keduanya melesat ke atas tanpa batas saat $x \\to 0$. Tak ada apa pun yang bisa disamakan dengan limitnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A function oscillates faster and faster between $-1$ and $1$ as $x \\to 0$, never settling. Which failure is this?',
                id: 'Sebuah fungsi berosilasi semakin cepat antara $-1$ dan $1$ saat $x \\to 0$, tak pernah mereda. Kegagalan manakah ini?',
              },
              options: [
                { en: 'Endless oscillation', id: 'Osilasi tanpa henti' },
                { en: 'A jump', id: 'Lompatan' },
                { en: 'An unbounded run-away', id: 'Larian tak terbatas' },
                { en: 'This is not a failure — the limit is $0$', id: 'Ini bukan kegagalan — limitnya $0$' },
              ],
              answer: 0,
              explain: {
                en: 'It is bounded (never leaves $[-1,1]$) and one-sided limits are not even in play here — it simply never narrows in on a single height. That is oscillation, the third way.',
                id: 'Ia terbatas (tak pernah keluar dari $[-1,1]$) dan limit sepihak bahkan tak relevan di sini — ia sekadar tak pernah merapat ke satu ketinggian. Itulah osilasi, cara yang ketiga.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph of $y = \\dfrac{1}{x}$ below, why does $\\lim_{x \\to 0} \\dfrac{1}{x}$ fail to exist?',
                id: 'Dengan membaca grafik $y = \\dfrac{1}{x}$ di bawah, mengapa $\\lim_{x \\to 0} \\dfrac{1}{x}$ gagal ada?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-6, 6],
                ticks: true,
                items: [{ t: 'curve', f: '1/x', color: 'a' }],
              },
              options: [
                { en: 'It runs away in different directions on each side — $-\\infty$ from the left, $+\\infty$ from the right', id: 'Ia lari ke arah berbeda di tiap sisi — $-\\infty$ dari kiri, $+\\infty$ dari kanan' },
                { en: 'It oscillates near $x = 0$', id: 'Ia berosilasi di dekat $x = 0$' },
                { en: 'It is a jump between two finite heights', id: 'Ia lompatan antara dua ketinggian berhingga' },
                { en: 'The limit actually does exist, and equals $0$', id: 'Limitnya sebenarnya ada, dan sama dengan $0$' },
              ],
              answer: 0,
              explain: {
                en: 'From the left the curve plunges toward $-\\infty$; from the right it rockets toward $+\\infty$. Both sides run away — just in opposite directions — so there is no number, finite or otherwise, that both sides are closing in on.',
                id: 'Dari kiri kurvanya terjun menuju $-\\infty$; dari kanan ia melesat menuju $+\\infty$. Kedua sisi lari — hanya berlawanan arah — jadi tak ada bilangan, berhingga atau tidak, yang didekati kedua sisi itu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Not every limit fails. By contrast, evaluate $\\displaystyle\\lim_{x \\to 3} \\frac{x^2 - 4x + 3}{x - 3}$ — an ordinary limit that exists, using the factoring trick from the last lesson.',
                id: 'Tak semua limit gagal. Sebagai perbandingan, hitung $\\displaystyle\\lim_{x \\to 3} \\frac{x^2 - 4x + 3}{x - 3}$ — limit biasa yang ada, dengan trik pemfaktoran dari pelajaran sebelumnya.',
              },
              blanks: [{ label: '\\lim_{x \\to 3} \\tfrac{x^2-4x+3}{x-3} =', answer: 2 }],
              hints: [
                { en: '$x^2 - 4x + 3 = (x-1)(x-3)$.', id: '$x^2 - 4x + 3 = (x-1)(x-3)$.' },
              ],
              explain: {
                en: '$\\dfrac{(x-1)(x-3)}{x-3} = x - 1$ for $x \\neq 3$, and $x - 1 \\to 2$ as $x \\to 3$. Module 2 turns this factoring move into a full technique — most limits you will meet are exactly this well-behaved.',
                id: '$\\dfrac{(x-1)(x-3)}{x-3} = x - 1$ untuk $x \\neq 3$, dan $x - 1 \\to 2$ saat $x \\to 3$. Modul 2 mengubah gerakan pemfaktoran ini menjadi teknik penuh — sebagian besar limit yang akan kamu temui memang sebaik ini.',
              },
            },
          ],
        },
        {
          id: 'lim-m1-s2-l2',
          title: { en: 'The Limit Ignores the Point Itself', id: 'Limit Mengabaikan Titik Itu Sendiri' },
          goal: {
            en: 'Separate lim(x→a) f(x) from f(a) completely, in every direction that separation can go.',
            id: 'Memisahkan lim(x→a) f(x) dari f(a) sepenuhnya, ke segala arah pemisahan itu bisa terjadi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three relationships, all legal', id: 'Tiga hubungan, semuanya sah' },
              body: {
                en: 'Because a limit only looks at points near $a$ and never at $a$ itself, $\\lim_{x \\to a} f(x)$ and $f(a)$ are free to relate in any of these ways:\n\n- **Both exist and agree.** The ordinary, well-behaved case — this is what Module 4 will name **continuous**.\n- **Both exist but disagree.** $f(a)$ was defined by hand to be something the surrounding values do not point to — a deliberately placed patch.\n- **The limit exists but $f(a)$ does not.** The hole from the last lesson: the formula simply has nothing to say at $a$, even though its neighbours all point the same way.\n\nWhat can **never** happen is the limit **depending** on $f(a)$ — changing $f(a)$, or even leaving it undefined, never changes what the function does next door.',
                id: 'Karena limit hanya memandang titik-titik dekat $a$ dan tak pernah $a$ itu sendiri, $\\lim_{x \\to a} f(x)$ dan $f(a)$ bebas berhubungan dengan salah satu cara berikut:\n\n- **Keduanya ada dan sepakat.** Kasus biasa yang berperilaku baik — inilah yang akan dinamai **kontinu** pada Modul 4.\n- **Keduanya ada tetapi tidak sepakat.** $f(a)$ didefinisikan secara manual menjadi sesuatu yang tak ditunjuk oleh nilai-nilai di sekitarnya — sebuah tambalan yang sengaja ditaruh.\n- **Limitnya ada tetapi $f(a)$ tidak.** Lubang dari pelajaran sebelumnya: rumusnya sekadar tak punya apa-apa untuk dikatakan di $a$, meski semua tetangganya menunjuk arah yang sama.\n\nYang **tak pernah** bisa terjadi adalah limitnya **bergantung** pada $f(a)$ — mengubah $f(a)$, atau bahkan membiarkannya tak terdefinisi, tak pernah mengubah apa yang dilakukan fungsi itu di sebelahnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 4],
                ySpan: [-1, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x^2-1)/(x-1)', color: 'a' },
                  { t: 'dot', x: 1, y: 2, open: true, color: 'a' },
                  { t: 'dot', x: 1, y: 5, color: 'b' },
                ],
                caption: {
                  en: 'The natural curve heads for the hollow point at $(1, 2)$ — that is the limit. Someone has separately decreed $f(1) = 5$, the filled dot well off the curve. The limit never noticed.',
                  id: 'Kurva alaminya menuju titik kosong di $(1, 2)$ — itulah limitnya. Seseorang secara terpisah menetapkan $f(1) = 5$, titik penuh yang jauh dari kurva. Limitnya sama sekali tak terpengaruh.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For the function graphed above, what are $\\lim_{x \\to 1} f(x)$ and $f(1)$?',
                id: 'Untuk fungsi yang digambar di atas, berapakah $\\lim_{x \\to 1} f(x)$ dan $f(1)$?',
              },
              options: [
                { en: '$\\lim = 2$, $f(1) = 5$ — different, and both perfectly legal', id: '$\\lim = 2$, $f(1) = 5$ — berbeda, dan keduanya sah' },
                { en: '$\\lim = 5$, $f(1) = 2$', id: '$\\lim = 5$, $f(1) = 2$' },
                { en: 'They must be equal, so this graph is impossible', id: 'Keduanya harus sama, jadi grafik ini mustahil' },
                { en: '$\\lim = 2$, and $f(1)$ does not exist', id: '$\\lim = 2$, dan $f(1)$ tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'The hollow dot at $(1,2)$ is where the limit points; the filled dot at $(1,5)$ is the function\'s actual, separately-declared value. Disagreeing is perfectly legal — the limit was never obligated to match it.',
                id: 'Titik kosong di $(1,2)$ adalah arah tunjuk limitnya; titik penuh di $(1,5)$ adalah nilai fungsi yang sebenarnya, dideklarasikan terpisah. Tidak sepakat itu sah-sah saja — limitnya tak pernah wajib mencocokkannya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, what is $\\lim_{x \\to 2} f(x)$?',
                id: 'Dengan membaca grafik di bawah, berapakah $\\lim_{x \\to 2} f(x)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x^2-4)/(x-2)', color: 'a' },
                  { t: 'dot', x: 2, y: 4, open: true, color: 'a' },
                  { t: 'dot', x: 2, y: 7, color: 'b' },
                ],
              },
              options: [
                { en: '4', id: '4' },
                { en: '7', id: '7' },
                { en: 'Both — it is defined twice', id: 'Keduanya — ia terdefinisi dua kali' },
                { en: 'Undefined', id: 'Tak terdefinisi' },
              ],
              answer: 0,
              explain: {
                en: 'The curve itself — the hollow point — heads for height $4$. The filled dot at $(2,7)$ is $f(2)$, a separate fact the limit does not consult.',
                id: 'Kurvanya sendiri — titik kosong — menuju tinggi $4$. Titik penuh di $(2,7)$ adalah $f(2)$, fakta terpisah yang tak dikonsultasikan limitnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = \\dfrac{x^2 - 4}{x - 2}$ for $x \\neq 2$, and separately declare $f(2) = 10$. Find both facts about $x = 2$.',
                id: 'Misalkan $f(x) = \\dfrac{x^2 - 4}{x - 2}$ untuk $x \\neq 2$, dan secara terpisah tetapkan $f(2) = 10$. Tentukan kedua fakta tentang $x = 2$.',
              },
              blanks: [
                { label: '\\lim_{x \\to 2} f(x) =', answer: 4 },
                { label: 'f(2) =', answer: 10 },
              ],
              hints: [
                { en: 'Factor the numerator to find the limit; the declared value is simply given.', id: 'Faktorkan pembilangnya untuk mencari limitnya; nilai yang dideklarasikan sudah diberikan langsung.' },
              ],
              explain: {
                en: '$\\dfrac{(x-2)(x+2)}{x-2} = x+2 \\to 4$ as $x \\to 2$, while $f(2) = 10$ by separate decree. Two different, equally legitimate facts about the same point.',
                id: '$\\dfrac{(x-2)(x+2)}{x-2} = x+2 \\to 4$ saat $x \\to 2$, sementara $f(2) = 10$ menurut ketetapan terpisah. Dua fakta berbeda, sama-sama sah, tentang titik yang sama.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m1-s2-p',
        runtime: 'math',
        title: { en: 'Failures and the Point Itself', id: 'Kegagalan dan Titik Itu Sendiri' },
        brief: {
          en: 'One disagreeing pair of one-sided limits, a hole with a patched value, and a factorable limit for practice.',
          id: 'Satu pasang limit sepihak yang tak sepakat, satu lubang dengan nilai tambalan, dan satu limit yang bisa difaktorkan untuk latihan.',
        },
        requirements: [
          { en: 'A one-sided limit only ever looks at one side.', id: 'Limit sepihak hanya pernah memandang satu sisi.' },
          { en: 'The limit and the declared value at a point are never required to match.', id: 'Limit dan nilai yang dideklarasikan di suatu titik tak pernah wajib cocok.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Let $f(x) = 3x$ for $x < 1$ and $f(x) = x + 5$ for $x \\geq 1$. Find both one-sided limits at $x = 1$.',
              id: 'Misalkan $f(x) = 3x$ untuk $x < 1$ dan $f(x) = x + 5$ untuk $x \\geq 1$. Tentukan kedua limit sepihak di $x = 1$.',
            },
            blanks: [
              { label: '\\lim_{x \\to 1^-} f(x) =', answer: 3 },
              { label: '\\lim_{x \\to 1^+} f(x) =', answer: 6 },
            ],
            solution: ['\\lim_{x \\to 1^-} f(x) = 3(1) = 3, \\qquad \\lim_{x \\to 1^+} f(x) = 1 + 5 = 6'],
          },
          {
            prompt: {
              en: 'Let $g(x) = \\dfrac{x^2 - 6x + 5}{x - 5}$ for $x \\neq 5$, with $g(5) = 0$ declared separately. Find $\\lim_{x \\to 5} g(x)$ and $g(5)$.',
              id: 'Misalkan $g(x) = \\dfrac{x^2 - 6x + 5}{x - 5}$ untuk $x \\neq 5$, dengan $g(5) = 0$ ditetapkan terpisah. Tentukan $\\lim_{x \\to 5} g(x)$ dan $g(5)$.',
            },
            blanks: [
              { label: '\\lim_{x \\to 5} g(x) =', answer: 4 },
              { label: 'g(5) =', answer: 0 },
            ],
            solution: [
              'x^2 - 6x + 5 = (x-1)(x-5) \\Rightarrow \\dfrac{(x-1)(x-5)}{x-5} = x - 1 \\to 4',
              'g(5) = 0 \\text{ by separate declaration}',
            ],
          },
          {
            prompt: {
              en: 'Evaluate $\\displaystyle\\lim_{x \\to -2} \\frac{x^2 - 4}{x + 2}$.',
              id: 'Hitung $\\displaystyle\\lim_{x \\to -2} \\frac{x^2 - 4}{x + 2}$.',
            },
            blanks: [{ answer: -4 }],
            solution: ['\\dfrac{(x-2)(x+2)}{x+2} = x - 2 \\to -4 \\text{ as } x \\to -2'],
          },
        ],
        hints: [
          { en: 'In part 1, use whichever rule applies on each side of $1$ — never both at once.', id: 'Pada butir 1, pakai aturan yang berlaku di masing-masing sisi $1$ — jangan pernah keduanya sekaligus.' },
          { en: 'In parts 2 and 3, factor first; the $x - a$ in the denominator always cancels when the limit exists this way.', id: 'Pada butir 2 dan 3, faktorkan dahulu; $x - a$ di penyebut selalu tercoret ketika limitnya ada dengan cara ini.' },
        ],
        xp: 50,
      },
    },
  ],
}
