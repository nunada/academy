import type { Module } from '../types'

/** Module 3 — the two ways a limit meets infinity: the input running off
 *  toward a vertical asymptote, and the input itself running off toward
 *  infinity while the output settles toward a horizontal one. Same word,
 *  two entirely different pictures. */
export const module3: Module = {
  id: 'lim-m3',
  title: { en: 'Infinite Limits and Limits at Infinity', id: 'Limit Tak Hingga dan Limit di Tak Hingga' },
  summary: {
    en: 'Vertical asymptotes from limits that blow up, and horizontal asymptotes from limits as x runs off to infinity.',
    id: 'Asimtot tegak dari limit yang meledak, dan asimtot datar dari limit ketika x lari menuju tak hingga.',
  },
  submodules: [
    /* -------------------------------------------- 3.1 vertical asymptotes */
    {
      id: 'lim-m3-s1',
      title: { en: 'Infinite Limits', id: 'Limit Tak Hingga' },
      summary: {
        en: 'Say what it means for a limit to be infinite, and locate the vertical asymptotes of a rational function.',
        id: 'Menyebut arti limit yang tak hingga, dan menentukan asimtot tegak fungsi rasional.',
      },
      lessons: [
        {
          id: 'lim-m3-s1-l1',
          title: { en: 'When a Limit Blows Up', id: 'Ketika Limit Meledak' },
          goal: {
            en: 'Read $\\lim_{x \\to a} f(x) = \\infty$ correctly, as a description of behaviour rather than a value.',
            id: 'Membaca $\\lim_{x \\to a} f(x) = \\infty$ dengan benar, sebagai gambaran perilaku, bukan sebuah nilai.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A symbol for "grows past every bound"', id: 'Simbol untuk "tumbuh melewati batas apa pun"' },
              body: {
                en: 'We write\n$$\\lim_{x \\to a} f(x) = \\infty$$\nto mean: as $x \\to a$, $f(x)$ grows larger than **every** number you could name — past $100$, past a million, past anything. $-\\infty$ means the mirror image, plunging below every bound.\n\nThis is worth reading carefully: $\\infty$ here is **not a value the limit equals** — it is shorthand for a specific kind of failure to settle, the "unbounded run-away" from Module 1. The limit still does not exist in the ordinary sense; writing $=\\infty$ is a more informative way of saying so than just "does not exist", because it also says *how* it fails.',
                id: 'Kita tulis\n$$\\lim_{x \\to a} f(x) = \\infty$$\nuntuk berarti: saat $x \\to a$, $f(x)$ tumbuh lebih besar dari **setiap** bilangan yang bisa kamu sebutkan — melewati $100$, melewati sejuta, melewati apa pun. $-\\infty$ berarti bayangan cerminnya, terjun di bawah batas apa pun.\n\nIni layak dibaca dengan cermat: $\\infty$ di sini **bukan nilai yang disamai limitnya** — ia singkatan untuk jenis kegagalan mereda yang khusus, "larian tak terbatas" dari Modul 1. Limitnya tetap tak ada dalam pengertian biasa; menulis $=\\infty$ hanyalah cara yang lebih informatif untuk mengatakan itu, sebab ia juga mengatakan *bagaimana* ia gagal.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/(x-1)^2', color: 'a' },
                  { t: 'vline', x: 1, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'Both sides shoot upward without any bound as $x \\to 1$. We say $\\lim_{x \\to 1}\\frac{1}{(x-1)^2} = \\infty$, and the dashed line at $x=1$ is the **vertical asymptote** it describes.',
                  id: 'Kedua sisi melesat ke atas tanpa batas saat $x \\to 1$. Kita katakan $\\lim_{x \\to 1}\\frac{1}{(x-1)^2} = \\infty$, dan garis putus-putus di $x=1$ adalah **asimtot tegak** yang digambarkannya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does writing $\\lim_{x \\to a} f(x) = \\infty$ actually mean?',
                id: 'Apa sebenarnya arti menulis $\\lim_{x \\to a} f(x) = \\infty$?',
              },
              options: [
                { en: 'The limit does not exist, and it fails specifically by growing past every bound', id: 'Limitnya tak ada, dan ia gagal secara khusus dengan tumbuh melewati batas apa pun' },
                { en: 'The limit exists, and its value is the number $\\infty$', id: 'Limitnya ada, dan nilainya adalah bilangan $\\infty$' },
                { en: '$f(a) = \\infty$', id: '$f(a) = \\infty$' },
                { en: 'The function is undefined near $a$', id: 'Fungsinya tak terdefinisi di dekat $a$' },
              ],
              answer: 0,
              explain: {
                en: '$\\infty$ is not a number the limit equals — the limit still fails to exist in the ordinary sense. Writing $=\\infty$ is a description of the particular way it fails: unbounded growth, not a jump or an oscillation.',
                id: '$\\infty$ bukan bilangan yang disamai limitnya — limitnya tetap gagal ada dalam pengertian biasa. Menulis $=\\infty$ adalah gambaran cara khusus ia gagal: pertumbuhan tak terbatas, bukan lompatan atau osilasi.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, what is $\\lim_{x \\to 0^+} \\dfrac{1}{x}$?',
                id: 'Dengan membaca grafik di bawah, berapakah $\\lim_{x \\to 0^+} \\dfrac{1}{x}$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-6, 6],
                ticks: true,
                items: [{ t: 'curve', f: '1/x', color: 'a' }],
              },
              options: [
                { en: '$\\infty$', id: '$\\infty$' },
                { en: '$-\\infty$', id: '$-\\infty$' },
                { en: '0', id: '0' },
                { en: 'It does not exist, with no further description', id: 'Tak ada, tanpa keterangan lebih lanjut' },
              ],
              answer: 0,
              explain: {
                en: 'Approaching $0$ from the right ($x > 0$), the curve rockets straight up, past every bound. That one-sided limit is $\\infty$ — the left-hand side, by contrast, plunges to $-\\infty$, which is why the full two-sided limit has no such clean description.',
                id: 'Mendekati $0$ dari kanan ($x > 0$), kurvanya melesat lurus ke atas, melewati batas apa pun. Limit sepihak itu adalah $\\infty$ — sisi kiri, sebaliknya, terjun ke $-\\infty$, dan itu sebabnya limit dua sisinya tak punya keterangan sebersih itu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Not every limit involves infinity. For contrast, evaluate $\\displaystyle\\lim_{x \\to 5} \\frac{x^2-25}{x-5}$ — an ordinary finite limit, using Module 2\'s factoring technique.',
                id: 'Tak semua limit melibatkan tak hingga. Sebagai perbandingan, hitung $\\displaystyle\\lim_{x \\to 5} \\frac{x^2-25}{x-5}$ — limit berhingga biasa, dengan teknik pemfaktoran Modul 2.',
              },
              blanks: [{ answer: 10 }],
              hints: [{ en: '$x^2-25 = (x-5)(x+5)$.', id: '$x^2-25 = (x-5)(x+5)$.' }],
              explain: {
                en: '$\\dfrac{(x-5)(x+5)}{x-5} = x+5 \\to 10$. A perfectly ordinary limit — infinite limits are the exception, not the rule.',
                id: '$\\dfrac{(x-5)(x+5)}{x-5} = x+5 \\to 10$. Limit yang biasa saja — limit tak hingga adalah pengecualian, bukan aturan umum.',
              },
            },
          ],
        },
        {
          id: 'lim-m3-s1-l2',
          title: { en: 'Finding Vertical Asymptotes', id: 'Menentukan Asimtot Tegak' },
          goal: {
            en: 'Locate the vertical asymptotes of a rational function from its denominator, and read off the sign on each side.',
            id: 'Menentukan asimtot tegak fungsi rasional dari penyebutnya, dan membaca tandanya di tiap sisi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Where the denominator vanishes and the top does not', id: 'Tempat penyebut lenyap dan pembilang tidak' },
              body: {
                en: 'For a rational function already in lowest terms — no common factor left to cancel — a **vertical asymptote** sits at every $x = a$ where the denominator is $0$ but the numerator is not. That is exactly the opposite of Module 2\'s $\\frac{0}{0}$ signal: here the top survives being nonzero, so there is nothing to factor away, and the fraction genuinely runs off to $\\pm\\infty$.\n\nTo read the sign on each side, check the sign of the whole fraction just to the left and just to the right of $a$ — a positive numerator over a denominator sliding through $0$ from the positive side gives $+\\infty$; from the negative side, $-\\infty$.',
                id: 'Untuk fungsi rasional yang sudah dalam bentuk paling sederhana — tak ada lagi faktor sekutu untuk dicoret — sebuah **asimtot tegak** berada di setiap $x = a$ tempat penyebutnya $0$ tetapi pembilangnya tidak. Itu persis kebalikan dari sinyal $\\frac{0}{0}$ Modul 2: di sini pembilangnya selamat karena tak nol, jadi tak ada yang bisa dicoret, dan pecahannya sungguh-sungguh lari menuju $\\pm\\infty$.\n\nUntuk membaca tanda di tiap sisi, periksa tanda seluruh pecahannya tepat di kiri dan tepat di kanan $a$ — pembilang positif dibagi penyebut yang meluncur melewati $0$ dari sisi positif memberi $+\\infty$; dari sisi negatif, $-\\infty$.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 5],
                ySpan: [-8, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x+1)/(x-2)', color: 'a' },
                  { t: 'vline', x: 2, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'For $\\dfrac{x+1}{x-2}$, the denominator vanishes only at $x=2$, and the numerator there is $3 \\neq 0$ — a genuine vertical asymptote, not a removable hole. The curve dives to $-\\infty$ from the left and rockets to $+\\infty$ from the right.',
                  id: 'Untuk $\\dfrac{x+1}{x-2}$, penyebutnya hanya lenyap di $x=2$, dan pembilangnya di situ $3 \\neq 0$ — asimtot tegak sejati, bukan lubang yang bisa dihapus. Kurvanya terjun ke $-\\infty$ dari kiri dan melesat ke $+\\infty$ dari kanan.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does $f(x) = \\dfrac{x-3}{x^2-9}$ have a vertical asymptote?',
                id: 'Di mana $f(x) = \\dfrac{x-3}{x^2-9}$ mempunyai asimtot tegak?',
              },
              options: [
                { en: 'At $x = -3$ only', id: 'Hanya di $x = -3$' },
                { en: 'At $x = 3$ and $x = -3$', id: 'Di $x = 3$ dan $x = -3$' },
                { en: 'At $x = 3$ only', id: 'Hanya di $x = 3$' },
                { en: 'Nowhere', id: 'Tidak di mana pun' },
              ],
              answer: 0,
              explain: {
                en: '$f(x) = \\dfrac{x-3}{(x-3)(x+3)} = \\dfrac{1}{x+3}$ for $x \\neq 3$ — the $x=3$ zero cancels, a removable hole, not an asymptote. Only $x=-3$ survives as a genuine vertical asymptote, where the (now-simplified) denominator vanishes but the numerator does not.',
                id: '$f(x) = \\dfrac{x-3}{(x-3)(x+3)} = \\dfrac{1}{x+3}$ untuk $x \\neq 3$ — akar $x=3$ tercoret, sebuah lubang yang bisa dihapus, bukan asimtot. Hanya $x=-3$ yang bertahan sebagai asimtot tegak sejati, tempat penyebut (yang sudah disederhanakan) lenyap tetapi pembilangnya tidak.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph of $y = \\dfrac{x+1}{x-2}$ below, what is $\\lim_{x \\to 2^-} \\dfrac{x+1}{x-2}$?',
                id: 'Dengan membaca grafik $y = \\dfrac{x+1}{x-2}$ di bawah, berapakah $\\lim_{x \\to 2^-} \\dfrac{x+1}{x-2}$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 5],
                ySpan: [-8, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x+1)/(x-2)', color: 'a' },
                  { t: 'vline', x: 2, color: 'muted', dashed: true },
                ],
              },
              options: [
                { en: '$-\\infty$', id: '$-\\infty$' },
                { en: '$+\\infty$', id: '$+\\infty$' },
                { en: '$1.5$', id: '$1{,}5$' },
                { en: '0', id: '0' },
              ],
              answer: 0,
              explain: {
                en: 'Approaching the asymptote from the left ($x < 2$), the curve dives downward without bound.',
                id: 'Mendekati asimtotnya dari kiri ($x < 2$), kurvanya terjun ke bawah tanpa batas.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $g(x) = \\dfrac{x-4}{x^2-4x}$, first simplify, then find where the genuine vertical asymptote sits.',
                id: 'Untuk $g(x) = \\dfrac{x-4}{x^2-4x}$, sederhanakan dahulu, lalu tentukan letak asimtot tegak sejatinya.',
              },
              blanks: [{ label: 'x =', answer: 0 }],
              hints: [
                { en: 'Factor the denominator: $x^2 - 4x = x(x-4)$.', id: 'Faktorkan penyebutnya: $x^2 - 4x = x(x-4)$.' },
              ],
              explain: {
                en: '$g(x) = \\dfrac{x-4}{x(x-4)} = \\dfrac{1}{x}$ for $x \\neq 4$: the $x=4$ zero is a removable hole, leaving only $x=0$ as a genuine vertical asymptote.',
                id: '$g(x) = \\dfrac{x-4}{x(x-4)} = \\dfrac{1}{x}$ untuk $x \\neq 4$: akar $x=4$ adalah lubang yang bisa dihapus, menyisakan hanya $x=0$ sebagai asimtot tegak sejati.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m3-s1-p',
        runtime: 'math',
        title: { en: 'Blowing Up', id: 'Meledak' },
        brief: {
          en: 'Spot a removable hole hiding among genuine vertical asymptotes, twice over.',
          id: 'Mengenali lubang yang bisa dihapus di antara asimtot tegak sejati, dua kali.',
        },
        requirements: [
          { en: 'Simplify a rational function fully before naming its vertical asymptotes.', id: 'Sederhanakan fungsi rasional sepenuhnya sebelum menyebut asimtot tegaknya.' },
          { en: 'A hole and an asymptote both start from a zero denominator — only factoring tells them apart.', id: 'Lubang dan asimtot sama-sama bermula dari penyebut nol — hanya pemfaktoran yang membedakan keduanya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find the vertical asymptote of $f(x) = \\dfrac{x+2}{x^2-4}$ that survives after simplifying.',
              id: 'Tentukan asimtot tegak $f(x) = \\dfrac{x+2}{x^2-4}$ yang bertahan setelah disederhanakan.',
            },
            blanks: [{ label: 'x =', answer: 2 }],
            solution: ['f(x) = \\dfrac{x+2}{(x-2)(x+2)} = \\dfrac{1}{x-2}: x=-2 \\text{ is a hole}; x=2 \\text{ is the asymptote}'],
          },
          {
            prompt: {
              en: 'For $g(x) = \\dfrac{x^2-1}{x^2-3x+2}$, find the vertical asymptote (there is exactly one, after a hole cancels).',
              id: 'Untuk $g(x) = \\dfrac{x^2-1}{x^2-3x+2}$, tentukan asimtot tegaknya (hanya ada satu, setelah satu lubang tercoret).',
            },
            blanks: [{ label: 'x =', answer: 2 }],
            solution: [
              'g(x) = \\dfrac{(x-1)(x+1)}{(x-1)(x-2)} = \\dfrac{x+1}{x-2}: x=1 \\text{ is a hole}; x=2 \\text{ is the asymptote}',
            ],
          },
          {
            prompt: {
              en: 'For $h(x) = \\dfrac{x+3}{x^2+x-6}$, find the vertical asymptote that survives after a hole cancels.',
              id: 'Untuk $h(x) = \\dfrac{x+3}{x^2+x-6}$, tentukan asimtot tegak yang bertahan setelah satu lubang tercoret.',
            },
            blanks: [{ label: 'x =', answer: 2 }],
            solution: [
              'x^2+x-6 = (x-2)(x+3) \\Rightarrow h(x) = \\dfrac{1}{x-2} \\text{ for } x \\neq -3: x=-3 \\text{ is a hole}; x=2 \\text{ is the asymptote}',
            ],
          },
        ],
        hints: [
          { en: 'Every task starts the same way: factor completely, then cancel what you can before naming anything.', id: 'Setiap butir dimulai dengan cara yang sama: faktorkan sepenuhnya, lalu coret yang bisa dicoret sebelum menamai apa pun.' },
        ],
        xp: 50,
      },
    },

    /* ----------------------------------------------- 3.2 end behaviour */
    {
      id: 'lim-m3-s2',
      title: { en: 'Limits at Infinity', id: 'Limit di Tak Hingga' },
      summary: {
        en: 'Let x itself run off to infinity, read the horizontal asymptote it settles toward, and compare growth rates.',
        id: 'Membiarkan x sendiri lari menuju tak hingga, membaca asimtot datar yang dituju, dan membandingkan laju pertumbuhan.',
      },
      lessons: [
        {
          id: 'lim-m3-s2-l1',
          title: { en: 'What Happens Far Out', id: 'Apa yang Terjadi Jauh di Sana' },
          goal: {
            en: 'Evaluate $\\lim_{x \\to \\infty} f(x)$ for a rational function, and read off the horizontal asymptote it names.',
            id: 'Menghitung $\\lim_{x \\to \\infty} f(x)$ untuk fungsi rasional, dan membaca asimtot datar yang dinamainya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Now it is x that runs off', id: 'Kini x-lah yang lari' },
              body: {
                en: '$$\\lim_{x \\to \\infty} f(x) = L$$\nasks a different question from everything so far: not what happens as $x$ nears some finite point, but what $f(x)$ **settles toward as $x$ itself grows without bound**. If the values approach one number $L$, the graph has a **horizontal asymptote** $y = L$ far to the right; $\\lim_{x \\to -\\infty} f(x)$ asks the same thing heading left.\n\nThe key trick for a rational function: divide every term, top and bottom, by the **highest power of $x$ in the denominator**. Each piece of the form $\\dfrac{c}{x^n}$ then vanishes as $x \\to \\infty$, since a fixed number divided by something enormous shrinks to nothing.',
                id: '$$\\lim_{x \\to \\infty} f(x) = L$$\nmenanyakan hal yang berbeda dari semua yang sejauh ini: bukan apa yang terjadi saat $x$ mendekati suatu titik berhingga, melainkan ke mana $f(x)$ **mereda saat $x$ sendiri tumbuh tanpa batas**. Jika nilai-nilainya mendekati satu bilangan $L$, grafiknya punya **asimtot datar** $y = L$ jauh di kanan; $\\lim_{x \\to -\\infty} f(x)$ menanyakan hal yang sama menuju kiri.\n\nTrik utama untuk fungsi rasional: bagi setiap suku, atas dan bawah, dengan **pangkat tertinggi $x$ pada penyebutnya**. Tiap suku berbentuk $\\dfrac{c}{x^n}$ kemudian lenyap saat $x \\to \\infty$, sebab bilangan tetap dibagi sesuatu yang sangat besar menyusut menjadi tak berarti.',
              },
              figure: {
                dim: 2,
                xSpan: [-30, 30],
                ySpan: [-2, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: '(2*x+1)/(x-1)', color: 'a' },
                  { t: 'hline', y: 2, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'Far to the right and far to the left, the curve hugs the dashed line $y = 2$ ever more closely — that is $\\lim_{x \\to \\pm\\infty} \\dfrac{2x+1}{x-1} = 2$, the horizontal asymptote.',
                  id: 'Jauh di kanan dan jauh di kiri, kurvanya semakin merapat ke garis putus-putus $y = 2$ — itulah $\\lim_{x \\to \\pm\\infty} \\dfrac{2x+1}{x-1} = 2$, asimtot datarnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'As $x \\to \\infty$, what happens to $\\dfrac{7}{x^3}$?',
                id: 'Saat $x \\to \\infty$, apa yang terjadi pada $\\dfrac{7}{x^3}$?',
              },
              options: [
                { en: 'It approaches $0$', id: 'Ia mendekati $0$' },
                { en: 'It approaches $7$', id: 'Ia mendekati $7$' },
                { en: 'It grows without bound', id: 'Ia tumbuh tanpa batas' },
                { en: 'It oscillates', id: 'Ia berosilasi' },
              ],
              answer: 0,
              explain: {
                en: 'A fixed numerator over a power of $x$ that is racing to infinity shrinks toward $0$ — the whole basis of the divide-by-the-highest-power trick.',
                id: 'Pembilang tetap dibagi pangkat $x$ yang melesat menuju tak hingga menyusut menuju $0$ — itulah seluruh dasar trik membagi dengan pangkat tertinggi.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, what is the horizontal asymptote of $y = \\dfrac{2x+1}{x-1}$?',
                id: 'Dengan membaca grafik di bawah, berapa asimtot datar dari $y = \\dfrac{2x+1}{x-1}$?',
              },
              figure: {
                dim: 2,
                xSpan: [-30, 30],
                ySpan: [-2, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: '(2*x+1)/(x-1)', color: 'a' },
                  { t: 'hline', y: 2, color: 'muted', dashed: true },
                ],
              },
              options: [
                { en: '$y = 2$', id: '$y = 2$' },
                { en: '$y = 1$', id: '$y = 1$' },
                { en: '$x = 1$', id: '$x = 1$' },
                { en: 'There is none', id: 'Tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'Far to either side, the curve flattens toward the dashed line $y=2$ and never leaves it — that dashed line is the horizontal asymptote.',
                id: 'Jauh ke sisi mana pun, kurvanya memipih menuju garis putus-putus $y=2$ dan tak pernah meninggalkannya — garis putus-putus itulah asimtot datarnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\displaystyle\\lim_{x \\to \\infty} \\frac{3x+5}{x-2}$ by dividing every term by $x$.',
                id: 'Hitung $\\displaystyle\\lim_{x \\to \\infty} \\frac{3x+5}{x-2}$ dengan membagi tiap suku dengan $x$.',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: '$\\dfrac{3x+5}{x-2} = \\dfrac{3 + 5/x}{1 - 2/x}$, and both fractions vanish as $x \\to \\infty$.', id: '$\\dfrac{3x+5}{x-2} = \\dfrac{3 + 5/x}{1 - 2/x}$, dan kedua pecahannya lenyap saat $x \\to \\infty$.' },
              ],
              explain: {
                en: 'Dividing top and bottom by $x$ leaves $\\dfrac{3 + 5/x}{1 - 2/x} \\to \\dfrac{3+0}{1-0} = 3$.',
                id: 'Membagi atas dan bawah dengan $x$ menyisakan $\\dfrac{3 + 5/x}{1 - 2/x} \\to \\dfrac{3+0}{1-0} = 3$.',
              },
            },
          ],
        },
        {
          id: 'lim-m3-s2-l2',
          title: { en: 'Comparing Growth Rates', id: 'Membandingkan Laju Pertumbuhan' },
          goal: {
            en: 'Predict a limit at infinity from the degrees of the numerator and denominator alone, no division required.',
            id: 'Menebak limit di tak hingga hanya dari derajat pembilang dan penyebut, tanpa perlu pembagian.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three cases, decided by degree', id: 'Tiga kasus, ditentukan oleh derajat' },
              body: {
                en: 'For a rational function $\\dfrac{p(x)}{q(x)}$, comparing the **degrees** of $p$ and $q$ answers $\\lim_{x \\to \\infty}$ without any division at all.\n\n**Degree of top $<$ degree of bottom.** The denominator grows faster, crushing the fraction to $0$: $\\lim_{x\\to\\infty}\\dfrac{3x+1}{x^2} = 0$.\n\n**Degree of top $=$ degree of bottom.** They grow at the same rate, and the limit is the ratio of their **leading coefficients**: $\\lim_{x\\to\\infty}\\dfrac{2x+1}{x-1} = \\dfrac{2}{1} = 2$, matching the last lesson exactly.\n\n**Degree of top $>$ degree of bottom.** The numerator wins, and the fraction runs off to $\\pm\\infty$ rather than settling anywhere — no horizontal asymptote at all.\n\nThis is a shortcut for the division trick, not a different fact — dividing by the highest power always lands on one of these three outcomes.',
                id: 'Untuk fungsi rasional $\\dfrac{p(x)}{q(x)}$, membandingkan **derajat** $p$ dan $q$ menjawab $\\lim_{x \\to \\infty}$ tanpa pembagian sama sekali.\n\n**Derajat atas $<$ derajat bawah.** Penyebutnya tumbuh lebih cepat, menggencet pecahannya menjadi $0$: $\\lim_{x\\to\\infty}\\dfrac{3x+1}{x^2} = 0$.\n\n**Derajat atas $=$ derajat bawah.** Keduanya tumbuh dengan laju yang sama, dan limitnya adalah rasio **koefisien utama** keduanya: $\\lim_{x\\to\\infty}\\dfrac{2x+1}{x-1} = \\dfrac{2}{1} = 2$, persis cocok dengan pelajaran sebelumnya.\n\n**Derajat atas $>$ derajat bawah.** Pembilangnya menang, dan pecahannya lari menuju $\\pm\\infty$ alih-alih mereda di mana pun — tak ada asimtot datar sama sekali.\n\nIni jalan pintas untuk trik pembagian, bukan fakta yang berbeda — membagi dengan pangkat tertinggi selalu berakhir pada salah satu dari tiga hasil ini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\lim_{x \\to \\infty} \\dfrac{5x^2 + 1}{x^3 - 2}$?',
                id: 'Berapakah $\\lim_{x \\to \\infty} \\dfrac{5x^2 + 1}{x^3 - 2}$?',
              },
              options: [
                { en: '0', id: '0' },
                { en: '5', id: '5' },
                { en: '$\\infty$', id: '$\\infty$' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: 'The bottom has the higher degree ($3 > 2$), so it grows faster and crushes the fraction to $0$.',
                id: 'Penyebutnya berderajat lebih tinggi ($3 > 2$), jadi ia tumbuh lebih cepat dan menggencet pecahannya menjadi $0$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What is $\\lim_{x \\to \\infty} \\dfrac{x^3 + 2}{x^2 - 5}$?',
                id: 'Berapakah $\\lim_{x \\to \\infty} \\dfrac{x^3 + 2}{x^2 - 5}$?',
              },
              options: [
                { en: '$\\infty$ — no horizontal asymptote', id: '$\\infty$ — tak ada asimtot datar' },
                { en: '0', id: '0' },
                { en: '1', id: '1' },
                { en: '$\\dfrac{2}{-5}$', id: '$\\dfrac{2}{-5}$' },
              ],
              answer: 0,
              explain: {
                en: 'The top has the higher degree ($3 > 2$), so it wins and the fraction races off to infinity rather than settling toward any horizontal line.',
                id: 'Pembilangnya berderajat lebih tinggi ($3 > 2$), jadi ia menang dan pecahannya melesat menuju tak hingga alih-alih mereda menuju garis datar mana pun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use degrees alone to evaluate $\\displaystyle\\lim_{x \\to \\infty} \\frac{4x^2 - 1}{2x^2 + 7}$.',
                id: 'Pakai derajat saja untuk menghitung $\\displaystyle\\lim_{x \\to \\infty} \\frac{4x^2 - 1}{2x^2 + 7}$.',
              },
              blanks: [{ answer: 2 }],
              hints: [
                { en: 'Same degree top and bottom — the limit is the ratio of leading coefficients.', id: 'Derajat atas dan bawah sama — limitnya adalah rasio koefisien utamanya.' },
              ],
              explain: {
                en: 'Both are degree $2$, so the limit is $\\dfrac{4}{2} = 2$, without dividing out a single term.',
                id: 'Keduanya berderajat $2$, jadi limitnya $\\dfrac{4}{2} = 2$, tanpa membagi habis satu suku pun.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m3-s2-p',
        runtime: 'math',
        title: { en: 'Reading the End Behaviour', id: 'Membaca Perilaku Ujung' },
        brief: {
          en: 'Three limits at infinity, one from each of the three degree cases.',
          id: 'Tiga limit di tak hingga, satu dari masing-masing tiga kasus derajat.',
        },
        requirements: [
          { en: 'Compare degrees first — it settles the case before any arithmetic is needed.', id: 'Bandingkan derajat dahulu — itu menentukan kasusnya sebelum aritmetika apa pun diperlukan.' },
          { en: 'The ratio-of-leading-coefficients case needs their signs too, not just their sizes.', id: 'Kasus rasio koefisien utama juga memerlukan tandanya, bukan hanya besarnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\lim_{x \\to \\infty} \\dfrac{6x+1}{2x^2-3}$.', id: 'Hitung $\\lim_{x \\to \\infty} \\dfrac{6x+1}{2x^2-3}$.' },
            blanks: [{ answer: 0 }],
            solution: ['\\text{degree } 1 < \\text{degree } 2 \\Rightarrow \\text{limit} = 0'],
          },
          {
            prompt: { en: 'Evaluate $\\lim_{x \\to \\infty} \\dfrac{-3x+2}{5x-1}$.', id: 'Hitung $\\lim_{x \\to \\infty} \\dfrac{-3x+2}{5x-1}$.' },
            blanks: [{ answer: -0.6 }],
            solution: ['\\text{same degree} \\Rightarrow \\text{limit} = \\dfrac{-3}{5} = -0{,}6'],
          },
          {
            prompt: {
              en: 'For $\\lim_{x \\to \\infty} \\dfrac{x^4-1}{x^2+1}$, the fraction runs off to infinity — but which sign? Give $+1$ or $-1$.',
              id: 'Untuk $\\lim_{x \\to \\infty} \\dfrac{x^4-1}{x^2+1}$, pecahannya lari menuju tak hingga — tetapi tanda mana? Sebutkan $+1$ atau $-1$.',
            },
            blanks: [{ label: '\\text{sign} =', answer: 1 }],
            solution: ['\\text{degree } 4 > \\text{degree } 2, \\text{ and both leading coefficients are positive} \\Rightarrow +\\infty'],
          },
        ],
        hints: [
          { en: 'In part 3, the top and bottom leading coefficients are both positive, so nothing flips the sign on the way to $+\\infty$.', id: 'Pada butir 3, koefisien utama atas dan bawah sama-sama positif, jadi tak ada yang membalik tanda menuju $+\\infty$.' },
        ],
        xp: 50,
      },
    },
  ],
}
