import type { Module } from '../types'

/** Module 2 — the shortcuts that make Module 1's limit unnecessary to redo
 *  by hand every time. Each rule is provable straight from the limit
 *  definition; this module states them, uses them, and shows why the product
 *  rule in particular cannot be the naive guess. */
export const module2: Module = {
  id: 'tur-m2',
  title: { en: 'Differentiation Rules', id: 'Aturan Turunan' },
  summary: {
    en: 'The power, constant, sum and difference rules, then the product and quotient rules for combined functions.',
    id: 'Aturan pangkat, konstanta, jumlah, dan selisih, lalu aturan hasil kali dan hasil bagi untuk fungsi gabungan.',
  },
  submodules: [
    /* ------------------------------------------------------- 2.1 basic rules */
    {
      id: 'tur-m2-s1',
      title: { en: 'The Power, Sum and Difference Rules', id: 'Aturan Pangkat, Jumlah, dan Selisih' },
      summary: {
        en: 'Differentiate any power of x on sight, and combine terms with the sum and difference rules.',
        id: 'Menurunkan pangkat x apa pun sekali lihat, dan menggabungkan suku dengan aturan jumlah dan selisih.',
      },
      lessons: [
        {
          id: 'tur-m2-s1-l1',
          title: { en: 'The Power Rule', id: 'Aturan Pangkat' },
          goal: {
            en: 'Differentiate x^n for any real exponent n, including negative and fractional ones.',
            id: 'Menurunkan x^n untuk sebarang pangkat real n, termasuk yang negatif dan pecahan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Bring the power down, drop it by one', id: 'Turunkan pangkatnya ke depan, kurangi satu' },
              body: {
                en: 'For any real number $n$,\n$$\\frac{d}{dx}\\big(x^n\\big) = nx^{n-1}$$\nModule 1 proved the case $n=2$ by hand: $\\frac{d}{dx}(x^2) = 2x$, exactly this formula. The **power rule** says the same expanding-and-cancelling argument works for every power, so there is never a need to redo it.\n\nTwo companions come for free. The **constant rule**, $\\frac{d}{dx}(c) = 0$ — a constant function is a flat line, slope zero everywhere, which is also $n=0$ inside the power rule\'s own logic in disguise. And the **constant multiple rule**, $\\frac{d}{dx}\\big(c\\,f(x)\\big) = c\\,f\'(x)$ — scaling a function scales its tangent slopes by the same factor.',
                id: 'Untuk sebarang bilangan real $n$,\n$$\\frac{d}{dx}\\big(x^n\\big) = nx^{n-1}$$\nModul 1 membuktikan kasus $n=2$ secara manual: $\\frac{d}{dx}(x^2) = 2x$, persis rumus ini. **Aturan pangkat** mengatakan argumen jabarkan-lalu-coret yang sama berlaku untuk setiap pangkat, jadi tak pernah perlu mengulanginya.\n\nDua pendamping datang secara gratis. **Aturan konstanta**, $\\frac{d}{dx}(c) = 0$ — fungsi konstan adalah garis datar, kemiringannya nol di mana-mana, yang juga $n=0$ dalam logika aturan pangkat itu sendiri yang menyamar. Dan **aturan kelipatan konstanta**, $\\frac{d}{dx}\\big(c\\,f(x)\\big) = c\\,f\'(x)$ — menskalakan fungsi menskalakan kemiringan garis singgungnya dengan faktor yang sama.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Negative and fractional powers too', id: 'Pangkat negatif dan pecahan juga' },
              body: {
                en: 'The power rule does not care whether $n$ is a positive whole number. Rewrite first, then apply it exactly the same way:\n$$\\frac{d}{dx}\\left(\\frac{1}{x}\\right) = \\frac{d}{dx}\\big(x^{-1}\\big) = -1\\cdot x^{-2} = -\\frac{1}{x^2}$$\nmatching Module 1\'s $1/x$ result found the hard way, from the limit definition. And for a root:\n$$\\frac{d}{dx}\\big(\\sqrt{x}\\big) = \\frac{d}{dx}\\big(x^{1/2}\\big) = \\tfrac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$$\nThe habit worth building now: before differentiating, rewrite every root and every denominator as a power of $x$.',
                id: 'Aturan pangkat tak peduli apakah $n$ bilangan bulat positif. Tulis ulang dahulu, lalu terapkan dengan cara yang persis sama:\n$$\\frac{d}{dx}\\left(\\frac{1}{x}\\right) = \\frac{d}{dx}\\big(x^{-1}\\big) = -1\\cdot x^{-2} = -\\frac{1}{x^2}$$\ncocok dengan hasil $1/x$ Modul 1 yang ditemukan dengan cara sulit, dari definisi limit. Dan untuk akar:\n$$\\frac{d}{dx}\\big(\\sqrt{x}\\big) = \\frac{d}{dx}\\big(x^{1/2}\\big) = \\tfrac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$$\nKebiasaan yang layak dibangun sekarang: sebelum menurunkan, tulis ulang setiap akar dan setiap penyebut sebagai pangkat $x$.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-10, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3', color: 'a', label: 'f(x)=x³' },
                  { t: 'curve', f: '3*x^2', color: 'result', label: "f'(x)=3x²" },
                ],
                caption: {
                  en: '$\\frac{d}{dx}(x^3) = 3x^2$: never negative, matching that $x^3$ never actually decreases — it only ever flattens, right at $x=0$.',
                  id: '$\\frac{d}{dx}(x^3) = 3x^2$: tak pernah negatif, cocok dengan kenyataan $x^3$ tak pernah benar-benar turun — ia hanya sempat mendatar, tepat di $x=0$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\dfrac{d}{dx}\\big(x^5\\big)$?',
                id: 'Berapakah $\\dfrac{d}{dx}\\big(x^5\\big)$?',
              },
              options: [
                { en: '$5x^4$', id: '$5x^4$' },
                { en: '$5x^5$', id: '$5x^5$' },
                { en: '$x^4$', id: '$x^4$' },
                { en: '$4x^5$', id: '$4x^5$' },
              ],
              answer: 0,
              explain: {
                en: 'Bring the $5$ down as a coefficient, then drop the exponent by one: $5x^{5-1} = 5x^4$.',
                id: 'Turunkan $5$-nya menjadi koefisien, lalu kurangi pangkatnya satu: $5x^{5-1} = 5x^4$.',
              },
              hint: {
                en: 'The power rule is two steps: the exponent becomes a coefficient in front, and the exponent itself drops by exactly one.',
                id: 'Aturan pangkat adalah dua langkah: eksponennya menjadi koefisien di depan, dan eksponennya sendiri berkurang tepat satu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graphs above of $f(x)=x^3$ and $f\'(x)=3x^2$, what is the slope of the tangent to $y=x^3$ at $x=-1$?',
                id: 'Dengan membaca grafik $f(x)=x^3$ dan $f\'(x)=3x^2$ di atas, berapa kemiringan garis singgung $y=x^3$ di $x=-1$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-10, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3', color: 'a', label: 'f' },
                  { t: 'curve', f: '3*x^2', color: 'result', label: "f'" },
                ],
              },
              options: [
                { en: '3', id: '3' },
                { en: '-1', id: '-1' },
                { en: '-3', id: '-3' },
                { en: '1', id: '1' },
              ],
              answer: 0,
              explain: {
                en: 'Read the height of the $f\'$ curve at $x=-1$: it sits at $3$, since $3(-1)^2 = 3$. Squaring means $f\'$ is never negative, even where $f$ itself is.',
                id: 'Baca tinggi kurva $f\'$ di $x=-1$: berada di $3$, sebab $3(-1)^2 = 3$. Pengkuadratan membuat $f\'$ tak pernah negatif, sekalipun $f$ sendiri negatif di situ.',
              },
              hint: {
                en: 'The tangent slope at any $x$ is exactly the height of the $f\'$ curve there — no separate computation needed, just read it off the graph at $x=-1$.',
                id: 'Kemiringan garis singgung di $x$ mana pun persis tinggi kurva $f\'$ di situ — tak perlu penghitungan terpisah, tinggal baca dari grafiknya di $x=-1$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Differentiate each.',
                id: 'Turunkan masing-masing.',
              },
              blanks: [
                { label: '\\tfrac{d}{dx}(x^7) =', formula: '7*x^6', domain: [-2, 2] },
                { label: '\\tfrac{d}{dx}(4x^3) =', formula: '12*x^2', domain: [-2, 2] },
                { label: '\\tfrac{d}{dx}\\left(\\tfrac{1}{x^2}\\right) =', formula: '-2*x^(-3)', domain: [1, 3] },
              ],
              hints: [
                { en: 'Rewrite $\\frac{1}{x^2}$ as $x^{-2}$ before applying the power rule.', id: 'Tulis ulang $\\frac{1}{x^2}$ sebagai $x^{-2}$ sebelum memakai aturan pangkat.' },
              ],
              explain: {
                en: '$7x^6$, $4\\cdot 3x^2 = 12x^2$, and $-2x^{-3} = -\\dfrac{2}{x^3}$ — the constant multiple rule and the power rule, applied once each.',
                id: '$7x^6$, $4\\cdot 3x^2 = 12x^2$, dan $-2x^{-3} = -\\dfrac{2}{x^3}$ — aturan kelipatan konstanta dan aturan pangkat, masing-masing dipakai sekali.',
              },
            },
          ],
        },
        {
          id: 'tur-m2-s1-l2',
          title: { en: 'The Sum and Difference Rules', id: 'Aturan Jumlah dan Selisih' },
          goal: {
            en: 'Differentiate a polynomial term by term, and evaluate the result at a point.',
            id: 'Menurunkan polinom suku demi suku, dan menghitung hasilnya di suatu titik.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One term at a time', id: 'Satu suku setiap kali' },
              body: {
                en: 'If $f$ and $g$ are both differentiable,\n$$\\frac{d}{dx}\\big(f(x) + g(x)\\big) = f\'(x) + g\'(x), \\qquad \\frac{d}{dx}\\big(f(x) - g(x)\\big) = f\'(x) - g\'(x)$$\nTogether with the power rule and the constant multiple rule, this means **any polynomial can be differentiated term by term**, in one pass, with no limit computation needed at all:\n$$\\frac{d}{dx}\\big(3x^4 - 5x^2 + 7x - 9\\big) = 12x^3 - 10x + 7$$\nThe constant $-9$ vanished entirely — the constant rule, applied silently as one of the terms.',
                id: 'Jika $f$ dan $g$ keduanya terdiferensial,\n$$\\frac{d}{dx}\\big(f(x) + g(x)\\big) = f\'(x) + g\'(x), \\qquad \\frac{d}{dx}\\big(f(x) - g(x)\\big) = f\'(x) - g\'(x)$$\nBersama aturan pangkat dan aturan kelipatan konstanta, ini berarti **polinom apa pun bisa diturunkan suku demi suku**, dalam satu lintasan, tanpa perlu penghitungan limit sama sekali:\n$$\\frac{d}{dx}\\big(3x^4 - 5x^2 + 7x - 9\\big) = 12x^3 - 10x + 7$$\nKonstanta $-9$ lenyap sepenuhnya — aturan konstanta, dipakai diam-diam sebagai salah satu sukunya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reading the sign of the derivative', id: 'Membaca tanda turunannya' },
              body: {
                en: 'Once a polynomial is differentiated, its sign tells you where the original was climbing or falling — positive $f\'$ means $f$ rising, negative means falling, matching the pattern from Module 1\'s $x^2$ example. This will become the main tool of the last module of this course; for now, notice it as a free side-benefit of every derivative you compute.',
                id: 'Setelah polinomnya diturunkan, tandanya memberitahumu tempat aslinya menanjak atau menurun — $f\'$ positif berarti $f$ naik, negatif berarti turun, cocok dengan pola dari contoh $x^2$ Modul 1. Ini akan menjadi alat utama modul terakhir kursus ini; untuk sekarang, perhatikan saja sebagai manfaat sampingan gratis dari setiap turunan yang kamu hitung.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 4],
                ySpan: [-10, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x^2', color: 'a', label: 'f' },
                  { t: 'curve', f: '3*x^2-6*x', color: 'result', label: "f'" },
                ],
                caption: {
                  en: '$f(x) = x^3 - 3x^2$ has $f\'(x) = 3x^2 - 6x$. Where the green curve dips below the axis (between $x=0$ and $x=2$), $f$ itself is sloping downward.',
                  id: '$f(x) = x^3 - 3x^2$ mempunyai $f\'(x) = 3x^2 - 6x$. Tempat kurva hijaunya turun di bawah sumbu (antara $x=0$ dan $x=2$), $f$ sendiri melandai turun.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\dfrac{d}{dx}\\big(2x^3 + 5x - 6\\big)$?',
                id: 'Berapakah $\\dfrac{d}{dx}\\big(2x^3 + 5x - 6\\big)$?',
              },
              options: [
                { en: '$6x^2 + 5$', id: '$6x^2 + 5$' },
                { en: '$6x^2 + 5x$', id: '$6x^2 + 5x$' },
                { en: '$6x^2 + 5 - 6$', id: '$6x^2 + 5 - 6$' },
                { en: '$2x^2 + 5$', id: '$2x^2 + 5$' },
              ],
              answer: 0,
              explain: {
                en: 'Term by term: $2x^3 \\to 6x^2$, $5x \\to 5$, and the constant $-6 \\to 0$ and disappears entirely.',
                id: 'Suku demi suku: $2x^3 \\to 6x^2$, $5x \\to 5$, dan konstanta $-6 \\to 0$ lalu lenyap sepenuhnya.',
              },
              hint: {
                en: 'Differentiate each of the three terms separately using the power rule, and pay special attention to what a lone constant term becomes.',
                id: 'Turunkan masing-masing dari tiga sukunya secara terpisah memakai aturan pangkat, dan perhatikan khusus apa yang terjadi pada suku konstanta tunggal.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graphs above of $f(x)=x^3-3x^2$ and $f\'(x)=3x^2-6x$, on which interval is $f$ sloping downward?',
                id: 'Dengan membaca grafik $f(x)=x^3-3x^2$ dan $f\'(x)=3x^2-6x$ di atas, pada selang mana $f$ melandai turun?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 4],
                ySpan: [-10, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x^2', color: 'a', label: 'f' },
                  { t: 'curve', f: '3*x^2-6*x', color: 'result', label: "f'" },
                ],
              },
              options: [
                { en: '$(0, 2)$', id: '$(0, 2)$' },
                { en: '$(-3, 0)$', id: '$(-3, 0)$' },
                { en: '$(2, 4)$', id: '$(2, 4)$' },
                { en: 'Nowhere', id: 'Tidak di mana pun' },
              ],
              answer: 0,
              explain: {
                en: 'The green curve $f\'$ dips below the axis exactly on $(0,2)$ — that is precisely where $f$ is decreasing.',
                id: 'Kurva hijau $f\'$ turun di bawah sumbu persis pada $(0,2)$ — dan itulah persis tempat $f$ menurun.',
              },
              hint: {
                en: 'Look for the interval where the $f\'$ curve itself sits below the horizontal axis — a negative derivative is exactly where the original function is sloping downward.',
                id: 'Cari selang tempat kurva $f\'$ sendiri berada di bawah sumbu mendatar — turunan yang negatif persis tempat fungsi aslinya melandai turun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = x^4 - 2x^3 + 5$, find $f\'(x)$ and evaluate $f\'(2)$.',
                id: 'Untuk $f(x) = x^4 - 2x^3 + 5$, tentukan $f\'(x)$ dan hitung $f\'(2)$.',
              },
              blanks: [
                { label: 'f\'(x) =', formula: '4*x^3-6*x^2', domain: [-1, 3] },
                { label: 'f\'(2) =', answer: 8 },
              ],
              hints: [
                { en: 'The $+5$ differentiates to $0$ and drops out entirely.', id: '$+5$-nya diturunkan menjadi $0$ dan hilang sepenuhnya.' },
              ],
              explain: {
                en: '$f\'(x) = 4x^3 - 6x^2$, and $f\'(2) = 4(8) - 6(4) = 32 - 24 = 8$.',
                id: '$f\'(x) = 4x^3 - 6x^2$, dan $f\'(2) = 4(8) - 6(4) = 32 - 24 = 8$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m2-s1-p',
        runtime: 'math',
        title: { en: 'Term by Term', id: 'Suku demi Suku' },
        brief: {
          en: 'A rewritten power, a full polynomial, and one evaluated at a specific point.',
          id: 'Satu pangkat yang ditulis ulang, satu polinom penuh, dan satu yang dihitung di titik tertentu.',
        },
        requirements: [
          { en: 'Rewrite roots and denominators as powers of x before differentiating.', id: 'Tulis ulang akar dan penyebut sebagai pangkat x sebelum menurunkan.' },
          { en: 'A lone constant always differentiates to 0 and disappears.', id: 'Konstanta tunggal selalu diturunkan menjadi 0 dan lenyap.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find $\\dfrac{d}{dx}\\left(\\dfrac{1}{x^3}\\right)$.', id: 'Tentukan $\\dfrac{d}{dx}\\left(\\dfrac{1}{x^3}\\right)$.' },
            blanks: [{ formula: '-3*x^(-4)', domain: [1, 3] }],
            solution: ['\\dfrac{1}{x^3} = x^{-3} \\Rightarrow -3x^{-4}'],
          },
          {
            prompt: {
              en: 'Find $\\dfrac{d}{dx}\\big(5x^3 - 2x^2 + x - 8\\big)$.',
              id: 'Tentukan $\\dfrac{d}{dx}\\big(5x^3 - 2x^2 + x - 8\\big)$.',
            },
            blanks: [{ formula: '15*x^2-4*x+1', domain: [-1, 2] }],
            solution: ['15x^2 - 4x + 1'],
          },
          {
            prompt: {
              en: 'For $g(x) = 2x^4 - 3x^2 + 1$, find $g\'(x)$ and evaluate $g\'(-1)$.',
              id: 'Untuk $g(x) = 2x^4 - 3x^2 + 1$, tentukan $g\'(x)$ dan hitung $g\'(-1)$.',
            },
            blanks: [
              { label: 'g\'(x) =', formula: '8*x^3-6*x', domain: [-2, 2] },
              { label: 'g\'(-1) =', answer: -2 },
            ],
            solution: ['g\'(x) = 8x^3-6x \\Rightarrow g\'(-1) = -8+6 = -2'],
          },
        ],
        hints: [
          { en: 'Differentiate first, fully, before substituting any number in.', id: 'Turunkan dahulu sepenuhnya, sebelum mensubstitusikan bilangan apa pun.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------- 2.2 product and quotient */
    {
      id: 'tur-m2-s2',
      title: { en: 'The Product and Quotient Rules', id: 'Aturan Hasil Kali dan Hasil Bagi' },
      summary: {
        en: 'Differentiate a product and a quotient of two functions, and see why the obvious guess for a product is wrong.',
        id: 'Menurunkan hasil kali dan hasil bagi dua fungsi, dan melihat mengapa tebakan sederhana untuk hasil kali keliru.',
      },
      lessons: [
        {
          id: 'tur-m2-s2-l1',
          title: { en: 'The Product Rule', id: 'Aturan Hasil Kali' },
          goal: {
            en: 'Differentiate a product of two functions, and see why f\'g\' is not the answer.',
            id: 'Menurunkan hasil kali dua fungsi, dan melihat mengapa f\'g\' bukan jawabannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Not simply f\' times g\'', id: 'Bukan sekadar f\' dikali g\'' },
              body: {
                en: 'It is tempting to guess $\\frac{d}{dx}\\big(f(x)g(x)\\big) = f\'(x)g\'(x)$. Test it on $f(x)=g(x)=x$: the guess gives $1 \\times 1 = 1$, but $f(x)g(x) = x^2$, whose derivative is $2x$ — not $1$, and not even a constant. The guess is simply wrong.\n\nThe true **product rule**:\n$$\\frac{d}{dx}\\big(f(x)g(x)\\big) = f\'(x)g(x) + f(x)g\'(x)$$\n"the derivative of the first times the second, plus the first times the derivative of the second." Checking it against the counterexample: $f\'=1, g=x, f=x, g\'=1$, giving $1\\cdot x + x\\cdot 1 = 2x$ — matching perfectly.',
                id: 'Menggoda untuk menebak $\\frac{d}{dx}\\big(f(x)g(x)\\big) = f\'(x)g\'(x)$. Uji pada $f(x)=g(x)=x$: tebakannya memberi $1 \\times 1 = 1$, tetapi $f(x)g(x) = x^2$, yang turunannya $2x$ — bukan $1$, bahkan bukan konstanta. Tebakannya keliru.\n\n**Aturan hasil kali** yang benar:\n$$\\frac{d}{dx}\\big(f(x)g(x)\\big) = f\'(x)g(x) + f(x)g\'(x)$$\n"turunan yang pertama dikali yang kedua, ditambah yang pertama dikali turunan yang kedua." Memeriksanya pada contoh penyangkal: $f\'=1, g=x, f=x, g\'=1$, memberi $1\\cdot x + x\\cdot 1 = 2x$ — cocok sempurna.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A check against expanding it out', id: 'Pemeriksaan terhadap menjabarkannya' },
              body: {
                en: 'Differentiate $y = (x^2+1)(x+3)$ two ways. By the product rule, with $f=x^2+1$, $g=x+3$:\n$$y\' = (2x)(x+3) + (x^2+1)(1) = 2x^2+6x+x^2+1 = 3x^2+6x+1$$\nOr expand first, then use the sum rule: $y = x^3+3x^2+x+3$, so $y\' = 3x^2+6x+1$ — the same answer, found the long way. The product rule is not a new fact so much as a shortcut that skips the expansion, which matters enormously once the factors stop being simple polynomials.',
                id: 'Turunkan $y = (x^2+1)(x+3)$ dengan dua cara. Dengan aturan hasil kali, dengan $f=x^2+1$, $g=x+3$:\n$$y\' = (2x)(x+3) + (x^2+1)(1) = 2x^2+6x+x^2+1 = 3x^2+6x+1$$\nAtau jabarkan dahulu, lalu pakai aturan jumlah: $y = x^3+3x^2+x+3$, sehingga $y\' = 3x^2+6x+1$ — jawaban yang sama, ditemukan dengan cara panjang. Aturan hasil kali bukan fakta baru melainkan jalan pintas yang melewati penjabaran, dan itu sangat berarti begitu faktornya bukan lagi polinom sederhana.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For $y = f(x)g(x)$, which is the correct product rule?',
                id: 'Untuk $y = f(x)g(x)$, manakah aturan hasil kali yang benar?',
              },
              options: [
                { en: '$y\' = f\'g + fg\'$', id: '$y\' = f\'g + fg\'$' },
                { en: '$y\' = f\'g\'$', id: '$y\' = f\'g\'$' },
                { en: '$y\' = f\'g - fg\'$', id: '$y\' = f\'g - fg\'$' },
                { en: '$y\' = f\' + g\'$', id: '$y\' = f\' + g\'$' },
              ],
              answer: 0,
              explain: {
                en: 'The counterexample $f=g=x$ rules out the other three: only $f\'g+fg\' = 1\\cdot x + x\\cdot 1 = 2x$ matches the true derivative of $x^2$.',
                id: 'Contoh penyangkal $f=g=x$ menyingkirkan ketiga lainnya: hanya $f\'g+fg\' = 1\\cdot x + x\\cdot 1 = 2x$ yang cocok dengan turunan sejati $x^2$.',
              },
              hint: {
                en: 'Test each formula against $f=g=x$, whose product is $x^2$ with a known derivative. Which option actually reproduces that known answer?',
                id: 'Uji tiap rumus terhadap $f=g=x$, yang hasil kalinya $x^2$ dengan turunan yang sudah diketahui. Pilihan mana yang benar-benar menghasilkan jawaban yang sudah diketahui itu?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the product rule setup for $y = (3x)(x^2+1)$, with $f=3x$ and $g=x^2+1$.',
                id: 'Lengkapi susunan aturan hasil kali untuk $y = (3x)(x^2+1)$, dengan $f=3x$ dan $g=x^2+1$.',
              },
              template: 'y\' = (___)(x^2+1) + (3x)(___)',
              blanks: ['3', '2x'],
              explain: {
                en: '$f\' = 3$ and $g\' = 2x$ — each factor differentiated on its own, then slotted into the pattern.',
                id: '$f\' = 3$ dan $g\' = 2x$ — tiap faktor diturunkan sendiri-sendiri, lalu dimasukkan ke dalam polanya.',
              },
              hint: {
                en: 'Each blank is just the derivative of one factor, computed on its own — differentiate $3x$ for the first blank and $x^2+1$ for the second.',
                id: 'Tiap kotak hanyalah turunan satu faktor, dihitung sendiri-sendiri — turunkan $3x$ untuk kotak pertama dan $x^2+1$ untuk kotak kedua.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the product rule to differentiate $y = (x^2+1)(x+3)$, then evaluate $y\'$ at $x=1$.',
                id: 'Pakai aturan hasil kali untuk menurunkan $y = (x^2+1)(x+3)$, lalu hitung $y\'$ di $x=1$.',
              },
              blanks: [
                { label: 'y\' =', formula: '3*x^2+6*x+1', domain: [-1, 3] },
                { label: "y'(1) =", answer: 10 },
              ],
              hints: [
                { en: 'This is the worked example from the concept above — check your setup against it.', id: 'Ini contoh yang sudah dikerjakan di atas — cocokkan susunanmu dengannya.' },
              ],
              explain: {
                en: '$y\' = 3x^2+6x+1$, and $y\'(1) = 3+6+1 = 10$.',
                id: '$y\' = 3x^2+6x+1$, dan $y\'(1) = 3+6+1 = 10$.',
              },
            },
          ],
        },
        {
          id: 'tur-m2-s2-l2',
          title: { en: 'The Quotient Rule', id: 'Aturan Hasil Bagi' },
          goal: {
            en: 'Differentiate a quotient of two functions, remembering that the order in the numerator matters.',
            id: 'Menurunkan hasil bagi dua fungsi, mengingat urutan pada pembilangnya penting.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Unlike the product rule, order matters', id: 'Berbeda dari aturan hasil kali, urutan berpengaruh' },
              body: {
                en: 'For $y = \\dfrac{f(x)}{g(x)}$, with $g(x) \\neq 0$:\n$$y\' = \\frac{f\'(x)g(x) - f(x)g\'(x)}{\\big(g(x)\\big)^2}$$\nThe product rule\'s two pieces could be written in either order and it made no difference; here the **minus sign fixes an order** — swap $f$ and $g$ in the numerator and the sign flips. A memory aid some people use: "low d-high minus high d-low, over the square of what\'s below," where "low" is the denominator and "d" means "derivative of".',
                id: 'Untuk $y = \\dfrac{f(x)}{g(x)}$, dengan $g(x) \\neq 0$:\n$$y\' = \\frac{f\'(x)g(x) - f(x)g\'(x)}{\\big(g(x)\\big)^2}$$\nKedua bagian aturan hasil kali bisa ditulis dengan urutan mana pun dan tak jadi soal; di sini **tanda minusnya mengunci sebuah urutan** — tukar $f$ dan $g$ pada pembilangnya dan tandanya berbalik. Bantuan ingatan yang dipakai sebagian orang: "bawah kali turunan atas, dikurang atas kali turunan bawah, dibagi kuadrat yang di bawah."',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One example, worked in full', id: 'Satu contoh, dikerjakan tuntas' },
              body: {
                en: 'Differentiate $y = \\dfrac{x^2}{x+1}$. With $f=x^2$, $g=x+1$, so $f\'=2x$, $g\'=1$:\n$$y\' = \\frac{(2x)(x+1) - (x^2)(1)}{(x+1)^2} = \\frac{2x^2+2x-x^2}{(x+1)^2} = \\frac{x^2+2x}{(x+1)^2}$$\nAlways simplify the top before calling it finished — a factor sometimes cancels with the denominator, though not here. As a spot-check, this rule also recovers Module 1\'s $\\frac{1}{x}$ result with $f=1$, $g=x$: $y\' = \\dfrac{(0)(x)-(1)(1)}{x^2} = -\\dfrac{1}{x^2}$, exactly matching.',
                id: 'Turunkan $y = \\dfrac{x^2}{x+1}$. Dengan $f=x^2$, $g=x+1$, sehingga $f\'=2x$, $g\'=1$:\n$$y\' = \\frac{(2x)(x+1) - (x^2)(1)}{(x+1)^2} = \\frac{2x^2+2x-x^2}{(x+1)^2} = \\frac{x^2+2x}{(x+1)^2}$$\nSelalu sederhanakan bagian atasnya sebelum menyebutnya selesai — kadang ada faktor yang tercoret dengan penyebutnya, meski tidak di sini. Sebagai pemeriksaan cepat, aturan ini juga mengembalikan hasil $\\frac{1}{x}$ Modul 1 dengan $f=1$, $g=x$: $y\' = \\dfrac{(0)(x)-(1)(1)}{x^2} = -\\dfrac{1}{x^2}$, cocok persis.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does swapping f and g in the numerator of the quotient rule matter, unlike in the product rule?',
                id: 'Mengapa menukar f dan g pada pembilang aturan hasil bagi berpengaruh, berbeda dari aturan hasil kali?',
              },
              options: [
                { en: 'The quotient rule\'s numerator has a minus sign, so the order fixes which term is subtracted from which', id: 'Pembilang aturan hasil bagi mempunyai tanda minus, jadi urutan menentukan suku mana dikurangi dari suku mana' },
                { en: 'It never actually matters in either rule', id: 'Sebenarnya tak pernah berpengaruh pada kedua aturan' },
                { en: 'Division is commutative, unlike multiplication', id: 'Pembagian bersifat komutatif, berbeda dari perkalian' },
                { en: 'The quotient rule has no numerator at all', id: 'Aturan hasil bagi sama sekali tak punya pembilang' },
              ],
              answer: 0,
              explain: {
                en: 'The product rule adds its two pieces, and addition does not care about order. The quotient rule subtracts them, and subtraction very much does.',
                id: 'Aturan hasil kali menjumlahkan kedua bagiannya, dan penjumlahan tak peduli urutan. Aturan hasil bagi menguranginya, dan pengurangan sangat peduli.',
              },
              hint: {
                en: 'Compare the operation joining the two pieces in each formula — one rule adds them together, the other doesn\'t. Which of those two operations changes its result when you swap the order?',
                id: 'Bandingkan operasi yang menggabungkan kedua bagian pada tiap rumus — satu aturan menjumlahkannya, yang lain tidak. Operasi mana dari keduanya yang hasilnya berubah bila urutannya ditukar?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $\\dfrac{d}{dx}\\left(\\dfrac{x}{x^2+1}\\right)$.',
                id: 'Susun langkah untuk $\\dfrac{d}{dx}\\left(\\dfrac{x}{x^2+1}\\right)$.',
              },
              lines: [
                'f=x, \\ g=x^2+1 \\Rightarrow f\'=1, \\ g\'=2x',
                'y\' = \\dfrac{(1)(x^2+1) - (x)(2x)}{(x^2+1)^2}',
                'y\' = \\dfrac{x^2+1-2x^2}{(x^2+1)^2}',
                'y\' = \\dfrac{1-x^2}{(x^2+1)^2}',
              ],
              explain: {
                en: 'Identify $f, g$ and their derivatives first, slot them into the pattern, then simplify the numerator only — the denominator is left as $(g)^2$, never expanded.',
                id: 'Kenali $f, g$ dan turunannya dahulu, masukkan ke dalam polanya, lalu sederhanakan hanya pembilangnya — penyebutnya dibiarkan sebagai $(g)^2$, tak pernah dijabarkan.',
              },
              hint: {
                en: 'You need $f$, $g$ and their derivatives identified before anything can be slotted into the quotient rule\'s pattern, and that expression has to exist before its numerator can be simplified.',
                id: 'Kamu butuh $f$, $g$, dan turunannya dikenali dahulu sebelum apa pun bisa dimasukkan ke dalam pola aturan hasil bagi, dan bentuk itu harus ada dulu sebelum pembilangnya bisa disederhanakan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the quotient rule to differentiate $y = \\dfrac{x^2}{x+1}$, then evaluate $y\'$ at $x=1$.',
                id: 'Pakai aturan hasil bagi untuk menurunkan $y = \\dfrac{x^2}{x+1}$, lalu hitung $y\'$ di $x=1$.',
              },
              blanks: [
                { label: 'y\' =', formula: '(x^2+2*x)/(x+1)^2', domain: [0, 3] },
                { label: "y'(1) =", answer: 0.75 },
              ],
              hints: [
                { en: 'This matches the worked example above.', id: 'Ini cocok dengan contoh yang dikerjakan di atas.' },
              ],
              explain: {
                en: '$y\' = \\dfrac{x^2+2x}{(x+1)^2}$, and $y\'(1) = \\dfrac{1+2}{4} = \\dfrac{3}{4} = 0{,}75$.',
                id: '$y\' = \\dfrac{x^2+2x}{(x+1)^2}$, dan $y\'(1) = \\dfrac{1+2}{4} = \\dfrac{3}{4} = 0{,}75$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m2-s2-p',
        runtime: 'math',
        title: { en: 'Products and Quotients', id: 'Hasil Kali dan Hasil Bagi' },
        brief: {
          en: 'One product rule, one quotient rule, and one that needs both rules chosen correctly.',
          id: 'Satu aturan hasil kali, satu aturan hasil bagi, dan satu yang memerlukan pemilihan aturan yang tepat.',
        },
        requirements: [
          { en: 'Identify f and g, and their derivatives, before writing the rule out.', id: 'Kenali f dan g, serta turunannya, sebelum menuliskan aturannya.' },
          { en: 'Simplify the numerator; leave the denominator of a quotient rule as a square.', id: 'Sederhanakan pembilangnya; biarkan penyebut aturan hasil bagi sebagai kuadrat.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Use the product rule to differentiate $y = (2x+1)(x^2-3)$.',
              id: 'Pakai aturan hasil kali untuk menurunkan $y = (2x+1)(x^2-3)$.',
            },
            blanks: [{ formula: '6*x^2+2*x-6', domain: [-2, 2] }],
            solution: ['y\' = 2(x^2-3) + (2x+1)(2x) = 2x^2-6+4x^2+2x = 6x^2+2x-6'],
          },
          {
            prompt: {
              en: 'Use the quotient rule to differentiate $y = \\dfrac{3x}{x-2}$.',
              id: 'Pakai aturan hasil bagi untuk menurunkan $y = \\dfrac{3x}{x-2}$.',
            },
            blanks: [{ formula: '-6/(x-2)^2', domain: [3, 6] }],
            solution: ['y\' = \\dfrac{3(x-2)-3x(1)}{(x-2)^2} = \\dfrac{-6}{(x-2)^2}'],
          },
          {
            prompt: {
              en: 'For $y = \\dfrac{x^2+1}{x}$, find $y\'$ and evaluate it at $x=2$.',
              id: 'Untuk $y = \\dfrac{x^2+1}{x}$, tentukan $y\'$ dan hitung nilainya di $x=2$.',
            },
            blanks: [
              { label: 'y\' =', formula: '1-1/x^2', domain: [1, 3] },
              { label: "y'(2) =", answer: 0.75 },
            ],
            solution: [
              'y\' = \\dfrac{(2x)(x) - (x^2+1)(1)}{x^2} = \\dfrac{x^2-1}{x^2} = 1 - \\dfrac{1}{x^2}',
              'y\'(2) = 1 - \\tfrac{1}{4} = 0{,}75',
            ],
          },
        ],
        hints: [
          { en: 'Part 3 simplifies nicely if you divide the numerator by x^2 term by term after applying the rule.', id: 'Butir 3 menyederhana dengan rapi bila kamu membagi pembilangnya dengan x^2 suku demi suku setelah memakai aturannya.' },
        ],
        xp: 50,
      },
    },
  ],
}
