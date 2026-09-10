import type { Module } from '../types'

/** Module 7 — a rule that trivialises a result the Limits course worked hard
 *  to earn, and two procedures — one exact, one iterative — that turn a
 *  derivative into the tool that actually answers a real question: the best
 *  possible choice, or a root nothing else can find in closed form. */
export const module7: Module = {
  id: 'tur-m7',
  title: { en: "L'Hôpital's Rule, Optimization, and Newton's Method", id: "Aturan L'Hôpital, Optimisasi, dan Metode Newton" },
  summary: {
    en: 'A derivative-powered shortcut for indeterminate limits, and two procedures that turn a derivative into the best possible choice or an arbitrarily precise root.',
    id: 'Jalan pintas bertenaga turunan untuk limit tak tentu, dan dua prosedur yang mengubah turunan menjadi pilihan terbaik atau akar yang presisinya sebarang.',
  },
  submodules: [
    /* --------------------------------------------------------- 7.1 l'hopital's rule */
    {
      id: 'tur-m7-s1',
      title: { en: "L'Hôpital's Rule", id: "Aturan L'Hôpital" },
      summary: {
        en: 'Resolving 0/0 and infinity/infinity forms by differentiating top and bottom separately, and extending the trick to products, differences, and powers.',
        id: 'Menyelesaikan bentuk 0/0 dan tak hingga/tak hingga dengan menurunkan atas dan bawah secara terpisah, dan memperluas triknya ke hasil kali, selisih, dan pangkat.',
      },
      lessons: [
        {
          id: 'tur-m7-s1-l1',
          title: { en: 'The 0/0 and Infinity/Infinity Forms', id: 'Bentuk 0/0 dan Tak Hingga/Tak Hingga' },
          goal: {
            en: 'Apply L\'Hôpital\'s Rule to resolve 0/0 and infinity/infinity limits by differentiating numerator and denominator separately.',
            id: 'Menerapkan Aturan L\'Hôpital untuk menyelesaikan limit 0/0 dan tak hingga/tak hingga dengan menurunkan pembilang dan penyebut secara terpisah.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A famous hard-won limit, made instant', id: 'Limit sulit yang termasyhur, dibuat instan' },
              body: {
                en: 'The Limits course proved $\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$ using the squeeze theorem — trapping the expression between two bounding functions, a genuinely geometric argument. **L\'Hôpital\'s Rule** offers a shortcut for exactly this shape of problem: if $\\lim_{x\\to c}f(x)=0$ and $\\lim_{x\\to c}g(x)=0$ (a $\\frac{0}{0}$ form), then\n$$\\lim_{x\\to c}\\frac{f(x)}{g(x)} = \\lim_{x\\to c}\\frac{f\'(x)}{g\'(x)}$$\nprovided the right-hand limit exists. For $\\lim_{x\\to 0}\\frac{\\sin x}{x}$: both numerator and denominator vanish at $0$, so differentiate each separately: $\\lim_{x\\to 0}\\frac{\\cos x}{1} = \\cos 0 = 1$ — the same answer, reached in one line instead of a geometric squeeze.\n\n(This is not circular: the derivative $\\frac{d}{dx}(\\sin x)=\\cos x$ was itself proved using the squeeze-theorem limit, so the geometric argument was genuinely needed once — L\'Hôpital\'s Rule now reuses that result everywhere else.)',
                id: 'Kursus Limit membuktikan $\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$ memakai teorema apit — menjebak ekspresinya di antara dua fungsi pembatas, argumen yang sungguh geometris. **Aturan L\'Hôpital** menawarkan jalan pintas untuk persis bentuk soal ini: jika $\\lim_{x\\to c}f(x)=0$ dan $\\lim_{x\\to c}g(x)=0$ (bentuk $\\frac{0}{0}$), maka\n$$\\lim_{x\\to c}\\frac{f(x)}{g(x)} = \\lim_{x\\to c}\\frac{f\'(x)}{g\'(x)}$$\nasalkan limit ruas kanannya ada. Untuk $\\lim_{x\\to 0}\\frac{\\sin x}{x}$: pembilang dan penyebutnya sama-sama lenyap di $0$, jadi turunkan masing-masing secara terpisah: $\\lim_{x\\to 0}\\frac{\\cos x}{1} = \\cos 0 = 1$ — jawaban yang sama, dicapai dalam satu baris alih-alih penjepitan geometris.\n\n(Ini bukan penalaran melingkar: turunan $\\frac{d}{dx}(\\sin x)=\\cos x$ sendiri dibuktikan memakai limit teorema apit, sehingga argumen geometrisnya memang benar-benar diperlukan sekali — Aturan L\'Hôpital kini memakai ulang hasil itu di tempat lain mana pun.)',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A limit no earlier technique could reach', id: 'Limit yang tak terjangkau teknik sebelumnya' },
              body: {
                en: 'The same rule applies to $\\frac{\\infty}{\\infty}$ forms. $\\lim_{x\\to\\infty}\\frac{\\ln x}{x}$: both numerator and denominator grow without bound. Differentiating each:\n$$\\lim_{x\\to\\infty}\\frac{\\ln x}{x} = \\lim_{x\\to\\infty}\\frac{1/x}{1} = \\lim_{x\\to\\infty}\\frac{1}{x} = 0$$\nUnlike the rational-function limits from the Limits course (settled by comparing polynomial degrees), $\\ln x$ is not a polynomial at all — no earlier technique in either course could touch this limit directly. L\'Hôpital\'s Rule can even be applied repeatedly, differentiating top and bottom again each time the result is still an indeterminate form.',
                id: 'Aturan yang sama berlaku untuk bentuk $\\frac{\\infty}{\\infty}$. $\\lim_{x\\to\\infty}\\frac{\\ln x}{x}$: pembilang dan penyebutnya sama-sama bertumbuh tanpa batas. Menurunkan masing-masing:\n$$\\lim_{x\\to\\infty}\\frac{\\ln x}{x} = \\lim_{x\\to\\infty}\\frac{1/x}{1} = \\lim_{x\\to\\infty}\\frac{1}{x} = 0$$\nBerbeda dari limit fungsi rasional dari kursus Limit (dituntaskan dengan membandingkan derajat polinom), $\\ln x$ sama sekali bukan polinom — tak ada teknik sebelumnya di kursus mana pun yang bisa menyentuh limit ini secara langsung. Aturan L\'Hôpital bahkan bisa diterapkan berulang kali, menurunkan atas dan bawah lagi setiap kali hasilnya masih bentuk tak tentu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: "Before applying L'Hôpital's Rule to a limit of $f(x)/g(x)$, what must be checked first?",
                id: "Sebelum menerapkan Aturan L'Hôpital pada limit dari $f(x)/g(x)$, apa yang harus diperiksa lebih dahulu?",
              },
              options: [
                { en: 'That the limit is actually a $0/0$ or $\\infty/\\infty$ indeterminate form', id: 'Bahwa limitnya sungguh bentuk tak tentu $0/0$ atau $\\infty/\\infty$' },
                { en: 'That $f$ and $g$ are both polynomials', id: 'Bahwa $f$ dan $g$ keduanya polinom' },
                { en: 'That $f$ and $g$ have the same degree', id: 'Bahwa $f$ dan $g$ punya derajat yang sama' },
                { en: 'Nothing — the rule applies to every limit of a quotient', id: 'Tak ada — aturannya berlaku untuk setiap limit hasil bagi' },
              ],
              answer: 0,
              explain: {
                en: "L'Hôpital's Rule specifically resolves the 0/0 and infinity/infinity indeterminate forms. Applying it to a limit that is not actually indeterminate — say, one where direct substitution already gives a clean answer — would silently produce a wrong result.",
                id: "Aturan L'Hôpital secara khusus menyelesaikan bentuk tak tentu 0/0 dan tak hingga/tak hingga. Menerapkannya pada limit yang sebenarnya bukan tak tentu — misalnya, yang substitusi langsungnya sudah memberi jawaban bersih — akan diam-diam menghasilkan jawaban yang salah.",
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: "L'Hôpital's Rule re-derives the Limits course's $\\sin(x)/x$ result in one line. Why is this not circular reasoning?",
                id: "Aturan L'Hôpital menurunkan ulang hasil $\\sin(x)/x$ kursus Limit dalam satu baris. Mengapa ini bukan penalaran melingkar?",
              },
              options: [
                { en: "The derivative of $\\sin x$ used inside L'Hôpital's Rule was itself proved using the squeeze theorem, so the geometric work was genuinely done once, earlier", id: "Turunan $\\sin x$ yang dipakai di dalam Aturan L'Hôpital sendiri dibuktikan memakai teorema apit, sehingga kerja geometrisnya memang sungguh dilakukan sekali, lebih awal" },
                { en: "L'Hôpital's Rule does not actually use the derivative of $\\sin x$ at all", id: "Aturan L'Hôpital sebenarnya sama sekali tak memakai turunan $\\sin x$" },
                { en: 'The squeeze theorem and L\'Hôpital\'s Rule are proving two unrelated facts', id: "Teorema apit dan Aturan L'Hôpital membuktikan dua fakta yang tak berkaitan" },
                { en: 'It is circular, and the shortcut should not actually be trusted', id: 'Ini memang melingkar, dan jalan pintasnya sebenarnya tak boleh dipercaya' },
              ],
              answer: 0,
              explain: {
                en: "The chain of dependency runs one way only: squeeze theorem, then the derivative of $\\sin x$, then L'Hôpital's Rule reusing that derivative. Nothing here assumes the $\\sin(x)/x$ limit in order to prove itself.",
                id: "Rantai ketergantungannya berjalan satu arah saja: teorema apit, lalu turunan $\\sin x$, lalu Aturan L'Hôpital memakai ulang turunan itu. Tak ada di sini yang mengasumsikan limit $\\sin(x)/x$ untuk membuktikan dirinya sendiri.",
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: "Use L'Hôpital's Rule to evaluate $\\lim_{x\\to 0}\\dfrac{e^x - 1}{x}$.",
                id: "Pakai Aturan L'Hôpital untuk menghitung $\\lim_{x\\to 0}\\dfrac{e^x - 1}{x}$.",
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Both numerator and denominator vanish at $x = 0$. Differentiate each.', id: 'Pembilang dan penyebutnya sama-sama lenyap di $x = 0$. Turunkan masing-masing.' },
              ],
              explain: {
                en: '$\\lim_{x\\to 0} \\dfrac{e^x}{1} = e^0 = 1$.',
                id: '$\\lim_{x\\to 0} \\dfrac{e^x}{1} = e^0 = 1$.',
              },
            },
          ],
        },
        {
          id: 'tur-m7-s1-l2',
          title: { en: 'Indeterminate Products, Differences, and Powers', id: 'Hasil Kali, Selisih, dan Pangkat Tak Tentu' },
          goal: {
            en: 'Rewrite a 0 times infinity or infinity minus infinity form as a quotient, and use logarithms to resolve indeterminate powers.',
            id: 'Menulis ulang bentuk 0 kali tak hingga atau tak hingga dikurangi tak hingga sebagai hasil bagi, dan memakai logaritma untuk menyelesaikan pangkat tak tentu.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Turning a product into a quotient first', id: 'Mengubah hasil kali menjadi hasil bagi lebih dahulu' },
              body: {
                en: "$\\lim_{x\\to 0^+} x\\ln x$ is a $0\\cdot\\infty$ form — neither $\\frac{0}{0}$ nor $\\frac{\\infty}{\\infty}$ as written, so L'Hôpital's Rule cannot apply directly. Rewriting $x$ as $\\frac{1}{1/x}$ converts it into a genuine $\\frac{\\infty}{\\infty}$ form:\n$$\\lim_{x\\to 0^+} x\\ln x = \\lim_{x\\to 0^+}\\frac{\\ln x}{1/x} = \\lim_{x\\to 0^+}\\frac{1/x}{-1/x^2} = \\lim_{x\\to 0^+}(-x) = 0$$\nThe same trick handles $\\infty-\\infty$ forms by combining the two pieces into a single fraction first (usually over a common denominator), which almost always reveals a $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$ form underneath.",
                id: "$\\lim_{x\\to 0^+} x\\ln x$ adalah bentuk $0\\cdot\\infty$ — bukan $\\frac{0}{0}$ atau $\\frac{\\infty}{\\infty}$ seperti yang tertulis, sehingga Aturan L'Hôpital tak bisa langsung diterapkan. Menulis ulang $x$ sebagai $\\frac{1}{1/x}$ mengubahnya menjadi bentuk $\\frac{\\infty}{\\infty}$ yang sungguhan:\n$$\\lim_{x\\to 0^+} x\\ln x = \\lim_{x\\to 0^+}\\frac{\\ln x}{1/x} = \\lim_{x\\to 0^+}\\frac{1/x}{-1/x^2} = \\lim_{x\\to 0^+}(-x) = 0$$\nTrik yang sama menangani bentuk $\\infty-\\infty$ dengan menggabungkan kedua bagiannya menjadi satu pecahan lebih dahulu (biasanya dengan penyebut sekutu), yang hampir selalu mengungkap bentuk $\\frac{0}{0}$ atau $\\frac{\\infty}{\\infty}$ di baliknya.",
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Taking the log first, exactly like logarithmic differentiation', id: 'Mengambil log lebih dahulu, persis seperti turunan logaritmik' },
              body: {
                en: 'The indeterminate powers $0^0$, $\\infty^0$, and $1^\\infty$ resist L\'Hôpital\'s Rule directly, since it is built for quotients, not exponents. The fix reuses Module 2\'s logarithmic differentiation trick: take $\\ln$ of the expression first, turning a power into a product.\n\nEvaluate $\\lim_{x\\to 0^+} x^x$ (a $0^0$ form). Let $y=x^x$, so $\\ln y = x\\ln x$ — exactly the $0\\cdot\\infty$ limit just found: $\\lim_{x\\to 0^+}\\ln y = 0$. Since $\\ln y\\to 0$ means $y\\to e^0=1$:\n$$\\lim_{x\\to 0^+} x^x = 1$$\nA genuinely strange-looking result — a positive number raised to its own vanishing power settles on $1$ — confirmed rigorously, not just suspected.',
                id: 'Pangkat tak tentu $0^0$, $\\infty^0$, dan $1^\\infty$ menolak Aturan L\'Hôpital secara langsung, sebab dibangun untuk hasil bagi, bukan pangkat. Perbaikannya memakai ulang trik turunan logaritmik Modul 2: ambil $\\ln$ dari ekspresinya lebih dahulu, mengubah pangkat menjadi hasil kali.\n\nHitung $\\lim_{x\\to 0^+} x^x$ (bentuk $0^0$). Misalkan $y=x^x$, sehingga $\\ln y = x\\ln x$ — persis limit $0\\cdot\\infty$ yang baru saja ditemukan: $\\lim_{x\\to 0^+}\\ln y = 0$. Karena $\\ln y\\to 0$ berarti $y\\to e^0=1$:\n$$\\lim_{x\\to 0^+} x^x = 1$$\nHasil yang sungguh terlihat aneh — bilangan positif dipangkatkan dengan pangkatnya sendiri yang lenyap mengendap pada $1$ — dikonfirmasi secara ketat, bukan sekadar diduga.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.2, 3],
                ySpan: [-0.5, 5],
                ticks: true,
                items: [{ t: 'curve', f: 'x^x', from: 0.02, to: 3, color: 'a' }],
                caption: {
                  en: '$y = x^x$ — as $x$ shrinks toward $0$ from the right, the curve visibly settles toward height $1$, exactly as the log-based limit computation predicts.',
                  id: '$y = x^x$ — saat $x$ menyusut menuju $0$ dari kanan, kurvanya tampak mengendap menuju ketinggian $1$, persis seperti yang diprediksi penghitungan limit berbasis log.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: "Why can't L'Hôpital's Rule be applied directly to a $0^0$ form like $x^x$?",
                id: "Mengapa Aturan L'Hôpital tak bisa langsung diterapkan pada bentuk $0^0$ seperti $x^x$?",
              },
              options: [
                { en: "L'Hôpital's Rule is built for quotients of the form $0/0$ or $\\infty/\\infty$, not for exponents", id: "Aturan L'Hôpital dibangun untuk hasil bagi berbentuk $0/0$ atau $\\infty/\\infty$, bukan untuk pangkat" },
                { en: '$0^0$ is always exactly equal to $1$, with no limit needed', id: '$0^0$ selalu tepat sama dengan $1$, tanpa perlu limit' },
                { en: '$x^x$ has no derivative anywhere', id: '$x^x$ tak punya turunan di mana pun' },
                { en: 'Powers can never be indeterminate forms', id: 'Pangkat tak pernah bisa menjadi bentuk tak tentu' },
              ],
              answer: 0,
              explain: {
                en: "The rule's hypothesis is specifically a ratio of two functions each tending to 0, or each tending to infinity. An exponent is neither, so the expression must first be converted — via a logarithm — into a product, and from there into a quotient.",
                id: "Hipotesis aturannya secara khusus adalah rasio dua fungsi yang masing-masing menuju 0, atau masing-masing menuju tak hingga. Sebuah pangkat bukan keduanya, sehingga ekspresinya harus dikonversi lebih dahulu — lewat logaritma — menjadi hasil kali, dan dari situ menjadi hasil bagi.",
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y = x^x$, what does the curve appear to approach as $x$ shrinks toward $0$ from the right?',
                id: 'Dengan membaca grafik $y = x^x$ di atas, apa yang tampak didekati kurvanya saat $x$ menyusut menuju $0$ dari kanan?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.2, 3],
                ySpan: [-0.5, 5],
                ticks: true,
                items: [{ t: 'curve', f: 'x^x', from: 0.02, to: 3, color: 'a' }],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: 'Infinity', id: 'Tak hingga' },
                { en: 'It oscillates with no settled value', id: 'Berosilasi tanpa nilai yang mengendap' },
              ],
              answer: 0,
              explain: {
                en: 'The curve visibly dips down and levels off near height 1 as x approaches 0 from the right — matching the log-based computation exactly.',
                id: 'Kurvanya tampak menurun lalu melandai dekat ketinggian 1 saat x mendekati 0 dari kanan — cocok persis dengan penghitungan berbasis log.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\lim_{x\\to 0^+} x^2 \\ln(x)$.',
                id: 'Hitung $\\lim_{x\\to 0^+} x^2 \\ln(x)$.',
              },
              blanks: [{ answer: 0 }],
              hints: [
                { en: 'Rewrite as $\\dfrac{\\ln(x)}{1/x^2}$, an $\\infty/\\infty$ form.', id: 'Tulis ulang sebagai $\\dfrac{\\ln(x)}{1/x^2}$, bentuk $\\infty/\\infty$.' },
              ],
              explain: {
                en: "L'Hôpital: $\\dfrac{1/x}{-2/x^3} = -\\dfrac{x^2}{2}$, which approaches $0$ as $x$ approaches $0$.",
                id: "L'Hôpital: $\\dfrac{1/x}{-2/x^3} = -\\dfrac{x^2}{2}$, yang mendekati $0$ saat $x$ mendekati $0$.",
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m7-s1-p',
        runtime: 'math',
        title: { en: 'Indeterminate Forms', id: 'Bentuk Tak Tentu' },
        brief: {
          en: 'A 0/0 form, an infinity/infinity form, and one indeterminate product.',
          id: 'Satu bentuk 0/0, satu bentuk tak hingga/tak hingga, dan satu hasil kali tak tentu.',
        },
        requirements: [
          { en: 'Confirm the limit is actually 0/0 or infinity/infinity before differentiating top and bottom.', id: 'Pastikan limitnya sungguh 0/0 atau tak hingga/tak hingga sebelum menurunkan atas dan bawah.' },
          { en: 'A 0 times infinity form must be rewritten as a quotient first.', id: 'Bentuk 0 kali tak hingga harus ditulis ulang sebagai hasil bagi lebih dahulu.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\lim_{x\\to 0}\\dfrac{1 - \\cos x}{x^2}$.', id: 'Hitung $\\lim_{x\\to 0}\\dfrac{1 - \\cos x}{x^2}$.' },
            blanks: [{ answer: 0.5 }],
            solution: ["\\lim \\dfrac{\\sin x}{2x} = \\lim\\dfrac{\\cos x}{2} = \\dfrac12"],
          },
          {
            prompt: { en: 'Evaluate $\\lim_{x\\to 1}\\dfrac{\\ln x}{x - 1}$.', id: 'Hitung $\\lim_{x\\to 1}\\dfrac{\\ln x}{x - 1}$.' },
            blanks: [{ answer: 1 }],
            solution: ["\\lim \\dfrac{1/x}{1} = 1"],
          },
          {
            prompt: { en: 'Evaluate $\\lim_{x\\to\\infty} \\left(x\\cdot e^{1/x} - x\\right)$. (This is an $\\infty \\cdot 0$ form after rewriting; round to two decimal places.)', id: 'Hitung $\\lim_{x\\to\\infty} \\left(x\\cdot e^{1/x} - x\\right)$. (Ini bentuk $\\infty \\cdot 0$ setelah ditulis ulang; bulatkan ke dua desimal.)' },
            blanks: [{ answer: 1 }],
            solution: ["x(e^{1/x}-1) = \\dfrac{e^{1/x}-1}{1/x}, \\text{ let } t=1/x\\to 0: \\lim_{t\\to0}\\dfrac{e^t-1}{t} = 1"],
          },
        ],
        hints: [
          { en: 'Part 3: substituting t = 1/x turns the limit as x approaches infinity into a limit as t approaches 0.', id: 'Butir 3: mensubstitusikan t = 1/x mengubah limit saat x menuju tak hingga menjadi limit saat t menuju 0.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------- 7.2 optimization and newton's method */
    {
      id: 'tur-m7-s2',
      title: { en: "Optimization and Newton's Method", id: "Optimisasi dan Metode Newton" },
      summary: {
        en: 'Turning a word problem into a function to optimize with the closed interval method, then finding a root no algebra reaches by iterating a tangent line.',
        id: 'Mengubah soal cerita menjadi fungsi untuk dioptimalkan dengan metode selang tertutup, lalu mencari akar yang tak terjangkau aljabar dengan mengulang garis singgung.',
      },
      lessons: [
        {
          id: 'tur-m7-s2-l1',
          title: { en: 'Applied Optimization', id: 'Optimisasi Terapan' },
          goal: {
            en: 'Translate a word problem into a function of one variable, then use calculus to find the best possible value.',
            id: 'Menerjemahkan soal cerita menjadi fungsi satu peubah, lalu memakai kalkulus untuk mencari nilai terbaik yang mungkin.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'From a sentence to a function of one variable', id: 'Dari sebuah kalimat menjadi fungsi satu peubah' },
              body: {
                en: 'A farmer has $100$ m of fencing to enclose a rectangular field against a straight river — no fence needed along the river side. What dimensions maximise the enclosed area?\n\nLet $x$ be the width of each of the two sides perpendicular to the river, and $y$ the side parallel to it. The fencing constraint is $2x+y=100$, so $y=100-2x$. The quantity to maximise, area, becomes a function of $x$ alone:\n$$A(x) = xy = x(100-2x) = 100x-2x^2, \\qquad x\\in[0,50]$$\nThe domain is bounded because $x$ cannot be negative, nor so large that $y$ runs negative — every optimization problem\'s first real step is finding this one-variable function and its domain, before any derivative is taken at all.',
                id: 'Seorang petani punya $100$ m pagar untuk memagari lahan berbentuk persegi panjang bersebelahan dengan sungai lurus — tak perlu pagar di sisi sungai. Ukuran apa yang memaksimalkan luas yang dipagari?\n\nMisalkan $x$ adalah lebar tiap dua sisi yang tegak lurus sungai, dan $y$ sisi yang sejajar dengannya. Kendala pagarnya adalah $2x+y=100$, sehingga $y=100-2x$. Besaran yang dimaksimalkan, luas, menjadi fungsi $x$ saja:\n$$A(x) = xy = x(100-2x) = 100x-2x^2, \\qquad x\\in[0,50]$$\nDomainnya terbatas sebab $x$ tak boleh negatif, juga tak boleh sebesar itu sehingga $y$ menjadi negatif — langkah nyata pertama setiap soal optimisasi adalah menemukan fungsi satu peubah ini beserta domainnya, sebelum turunan apa pun diambil sama sekali.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The closed interval method finishes the job', id: 'Metode selang tertutup menuntaskan pekerjaannya' },
              body: {
                en: 'With $A(x)=100x-2x^2$ on $[0,50]$, apply Module 6\'s Closed Interval Method directly: $A\'(x)=100-4x=0$ gives $x=25$, the only critical point, inside the interval. Evaluating all three candidates: $A(0)=0$, $A(25)=25(50)=1250$, $A(50)=0$. The maximum area is $1250\\text{ m}^2$, at $x=25$, $y=100-50=50$.\n\nEvery applied optimization problem follows this same shape: (1) identify the quantity to optimize and any constraint, (2) reduce to one variable and state the domain, (3) apply the closed interval method exactly as before. Nothing new is needed past Module 6 — only the translation step is new.',
                id: 'Dengan $A(x)=100x-2x^2$ pada $[0,50]$, terapkan Metode Selang Tertutup Modul 6 secara langsung: $A\'(x)=100-4x=0$ memberi $x=25$, satu-satunya titik kritis, di dalam interval. Mengevaluasi ketiga kandidatnya: $A(0)=0$, $A(25)=25(50)=1250$, $A(50)=0$. Luas maksimumnya adalah $1250\\text{ m}^2$, di $x=25$, $y=100-50=50$.\n\nSetiap soal optimisasi terapan mengikuti bentuk yang sama ini: (1) kenali besaran yang dioptimalkan dan kendala apa pun, (2) reduksi menjadi satu peubah dan nyatakan domainnya, (3) terapkan metode selang tertutup persis seperti sebelumnya. Tak ada yang baru diperlukan melampaui Modul 6 — hanya langkah penerjemahannya yang baru.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 52],
                ySpan: [-50, 1400],
                ticks: true,
                params: [{ name: 'x0', min: 0, max: 50, step: 1, value: 10, label: 'x' }],
                items: [
                  { t: 'curve', f: '100*x-2*x^2', from: 0, to: 50, color: 'a' },
                  { t: 'dot', x: 25, y: 1250, color: 'result', label: '(25, 1250)' },
                  { t: 'dot', x: 'x0', y: '100*x0-2*x0^2', color: 'b', label: 'A(x)' },
                ],
                caption: {
                  en: 'Drag $x$ from $0$ to $50$ and watch the area rise, then fall — try to beat the marked peak at $x=25$ and you can\'t; the area function peaks exactly at the critical point.',
                  id: 'Geser $x$ dari $0$ sampai $50$ dan lihat luasnya naik, lalu turun — coba kalahkan puncak yang ditandai di $x=25$ dan kamu tak akan bisa; fungsi luasnya memuncak tepat di titik kritis itu.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the first real step in solving any applied optimization problem?',
                id: 'Apa langkah nyata pertama dalam menyelesaikan soal optimisasi terapan mana pun?',
              },
              options: [
                { en: 'Reducing the quantity to optimize to a function of a single variable, with a stated domain', id: 'Mereduksi besaran yang dioptimalkan menjadi fungsi satu peubah, dengan domain yang dinyatakan' },
                { en: 'Taking the derivative immediately, before setting up any function', id: 'Langsung mengambil turunan, sebelum menyusun fungsi apa pun' },
                { en: 'Guessing the answer and checking it', id: 'Menebak jawabannya lalu memeriksanya' },
                { en: 'Assuming the domain is always all real numbers', id: 'Mengasumsikan domainnya selalu seluruh bilangan real' },
              ],
              answer: 0,
              explain: {
                en: 'Every optimization problem starts as a word problem with more than one unknown quantity. Using the given constraint to eliminate one variable is what turns it into something the closed interval method can actually be applied to.',
                id: 'Setiap soal optimisasi dimulai sebagai soal cerita dengan lebih dari satu besaran yang tak diketahui. Memakai kendala yang diberikan untuk mengeliminasi satu peubah itulah yang mengubahnya menjadi sesuatu yang benar-benar bisa diterapkan metode selang tertutup.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above, why does $A(x)$ return to $0$ at both $x = 0$ and $x = 50$?',
                id: 'Dengan membaca grafik di atas, mengapa $A(x)$ kembali ke $0$ di $x = 0$ maupun $x = 50$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 52],
                ySpan: [-50, 1400],
                ticks: true,
                items: [
                  { t: 'curve', f: '100*x-2*x^2', from: 0, to: 50, color: 'a' },
                  { t: 'dot', x: 25, y: 1250, color: 'result' },
                ],
              },
              options: [
                { en: 'At both extremes the rectangle degenerates — either width or length shrinks to zero, leaving no area', id: 'Di kedua ekstremnya persegi panjangnya merosot — entah lebar atau panjangnya menyusut menjadi nol, tak menyisakan luas' },
                { en: 'The area function has no real meaning near the endpoints', id: 'Fungsi luasnya tak punya makna sungguhan di dekat titik ujungnya' },
                { en: 'It is a coincidence with no geometric explanation', id: 'Ini kebetulan tanpa penjelasan geometris' },
                { en: '$A(x)$ is actually undefined at both endpoints', id: '$A(x)$ sebenarnya tak terdefinisi di kedua titik ujung' },
              ],
              answer: 0,
              explain: {
                en: 'At $x = 0$, the width perpendicular to the river vanishes; at $x = 50$, the constraint $2x + y = 100$ forces $y = 0$, the parallel side vanishing instead. Either way, a degenerate rectangle encloses no area at all.',
                id: 'Di $x = 0$, lebar tegak lurus sungai lenyap; di $x = 50$, kendala $2x + y = 100$ memaksa $y = 0$, sisi sejajarnya yang lenyap sebagai gantinya. Bagaimanapun, persegi panjang yang merosot tak melingkupi luas sama sekali.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A rectangle has a fixed perimeter of 40 m. Find the width $x$ that maximizes its area $A(x) = x(20-x)$, then report the maximum area.',
                id: 'Persegi panjang punya keliling tetap 40 m. Cari lebar $x$ yang memaksimalkan luasnya $A(x) = x(20-x)$, lalu laporkan luas maksimumnya.',
              },
              blanks: [{ label: 'A_{max} =', answer: 100 }],
              hints: [
                { en: "$A'(x) = 20 - 2x = 0$ gives $x = 10$.", id: "$A'(x) = 20 - 2x = 0$ memberi $x = 10$." },
              ],
              explain: {
                en: '$A(10) = 10(10) = 100$ — a square, as it always turns out to be for a fixed-perimeter rectangle of maximum area.',
                id: '$A(10) = 10(10) = 100$ — sebuah persegi, seperti yang selalu ternyata untuk persegi panjang berkeliling tetap dengan luas maksimum.',
              },
            },
          ],
        },
        {
          id: 'tur-m7-s2-l2',
          title: { en: "Newton's Method", id: "Metode Newton" },
          goal: {
            en: 'Use the tangent line at a guess to produce a better guess, and iterate toward a root no algebra formula can reach.',
            id: 'Memakai garis singgung pada sebuah tebakan untuk menghasilkan tebakan yang lebih baik, dan mengulanginya menuju akar yang tak terjangkau rumus aljabar mana pun.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Following the tangent line down to the axis', id: 'Mengikuti garis singgung turun ke sumbu' },
              body: {
                en: 'Some equations, like $x^2-2=0$, have roots with no exact decimal form. **Newton\'s Method** approximates a root of $f(x)=0$ by repeatedly following the tangent line at a current guess $x_n$ down to where **it** crosses the axis, and using that crossing as the next, better guess $x_{n+1}$:\n$$x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}$$\nEach step is a linear approximation — Module 5\'s tangent-line idea, aimed specifically at hunting down a zero instead of estimating a nearby function value.\n\nApproximate $\\sqrt{2}$ as the positive root of $f(x)=x^2-2$, $f\'(x)=2x$, starting at $x_0=1$:\n$$x_1 = 1-\\frac{1-2}{2} = 1.5, \\qquad x_2 = 1.5-\\frac{2.25-2}{3} \\approx 1.41667, \\qquad x_3 \\approx 1.41422$$',
                id: 'Beberapa persamaan, seperti $x^2-2=0$, punya akar yang tak punya bentuk desimal eksak. **Metode Newton** menghampiri akar dari $f(x)=0$ dengan berulang kali mengikuti garis singgung pada tebakan saat ini $x_n$ turun ke tempat garis **itu** memotong sumbunya, dan memakai titik potong itu sebagai tebakan berikutnya yang lebih baik, $x_{n+1}$:\n$$x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}$$\nTiap langkah adalah hampiran linear — gagasan garis singgung Modul 5, diarahkan secara khusus untuk memburu sebuah nol alih-alih menaksir nilai fungsi di dekatnya.\n\nHampiri $\\sqrt{2}$ sebagai akar positif dari $f(x)=x^2-2$, $f\'(x)=2x$, mulai dari $x_0=1$:\n$$x_1 = 1-\\frac{1-2}{2} = 1.5, \\qquad x_2 = 1.5-\\frac{2.25-2}{3} \\approx 1.41667, \\qquad x_3 \\approx 1.41422$$',
              },
              figure: {
                dim: 2,
                xSpan: [0.5, 2.2],
                ySpan: [-2.5, 2.5],
                ticks: true,
                params: [{ name: 'x0', min: 0.6, max: 2.2, step: 0.02, value: 1, label: 'x₀' }],
                items: [
                  { t: 'curve', f: 'x^2-2', from: 0.5, to: 2.2, color: 'a' },
                  { t: 'curve', f: '(x0^2-2)+(2*x0)*(x-x0)', color: 'b', dashed: true },
                  { t: 'dot', x: 'x0', y: 'x0^2-2', color: 'b', label: 'x_0' },
                  { t: 'dot', x: 'x0-(x0^2-2)/(2*x0)', y: 0, color: 'result', label: 'x_1' },
                ],
                caption: {
                  en: 'Drag the starting guess $x_0$: its tangent line always crosses the axis closer to $\\sqrt2 \\approx 1.41421$ than $x_0$ was — try a guess near $0$, where $f\'$ is small, and $x_1$ flies far away instead.',
                  id: 'Geser tebakan awal $x_0$: garis singgungnya selalu memotong sumbu lebih dekat ke $\\sqrt2 \\approx 1{,}41421$ daripada $x_0$ semula — coba tebakan dekat $0$, tempat $f\'$ kecil, dan $x_1$ malah melesat jauh.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Doubling correct digits, and where it can go wrong', id: 'Menggandakan digit yang benar, dan tempat ia bisa keliru' },
              body: {
                en: 'By $x_3\\approx 1.41422$, already four decimal digits agree with $\\sqrt{2}\\approx 1.41421356$ — this rapid, roughly digit-doubling convergence is typical of Newton\'s Method near a root where $f\'\\neq 0$. It is not infallible, though: if $f\'(x_n)=0$ at some step, the formula divides by zero and breaks down entirely; a poorly chosen starting guess can also send the iteration far from the intended root, or toward a different one altogether. The method trades the certainty of an exact algebraic formula for speed — and needs a reasonable starting guess to pay off.',
                id: 'Pada $x_3\\approx 1.41422$, sudah empat digit desimal yang cocok dengan $\\sqrt{2}\\approx 1.41421356$ — konvergensi yang cepat, kurang lebih menggandakan digit ini khas Metode Newton di dekat akar tempat $f\'\\neq 0$. Meski begitu, tak selalu berhasil: jika $f\'(x_n)=0$ pada suatu langkah, rumusnya membagi dengan nol dan gagal sepenuhnya; tebakan awal yang dipilih dengan buruk juga bisa mengirim iterasinya jauh dari akar yang dituju, atau menuju akar yang sama sekali berbeda. Metodenya menukar kepastian rumus aljabar eksak dengan kecepatan — dan memerlukan tebakan awal yang wajar agar berhasil.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: "What does each step of Newton's Method actually compute?",
                id: 'Apa yang sebenarnya dihitung tiap langkah Metode Newton?',
              },
              options: [
                { en: 'Where the tangent line at the current guess crosses the x-axis', id: 'Tempat garis singgung pada tebakan saat ini memotong sumbu-x' },
                { en: 'The exact root of the original function, in one step', id: 'Akar eksak fungsi aslinya, dalam satu langkah' },
                { en: 'The average of the current guess and zero', id: 'Rata-rata tebakan saat ini dan nol' },
                { en: 'A random nearby value with no relation to the tangent line', id: 'Nilai dekat yang acak tanpa kaitan dengan garis singgungnya' },
              ],
              answer: 0,
              explain: {
                en: "The formula $x_n - f(x_n)/f'(x_n)$ is exactly the $x$-intercept of the tangent line at $(x_n, f(x_n))$ — the line's own zero standing in for the curve's harder-to-find zero.",
                id: "Rumus $x_n - f(x_n)/f'(x_n)$ persis titik potong sumbu-$x$ dari garis singgung di $(x_n, f(x_n))$ — nol garis itu sendiri menggantikan nol kurva yang lebih sulit dicari.",
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: "Reading the figure above, what does $x_1 = 1.5$ represent in Newton's Method?",
                id: 'Dengan membaca gambar di atas, apa yang direpresentasikan $x_1 = 1.5$ dalam Metode Newton?',
              },
              figure: {
                dim: 2,
                xSpan: [0.5, 2.2],
                ySpan: [-2.5, 2.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-2', from: 0.5, to: 2.2, color: 'a' },
                  { t: 'seg', from: [1, -1], to: [1.5, 1], color: 'b', dashed: true },
                  { t: 'dot', x: 1, y: -1, color: 'b' },
                  { t: 'dot', x: 1.5, y: 0, color: 'result' },
                ],
              },
              options: [
                { en: 'The $x$-intercept of the tangent line drawn at the starting guess $x_0 = 1$', id: 'Titik potong sumbu-$x$ dari garis singgung yang digambar pada tebakan awal $x_0 = 1$' },
                { en: 'The exact value of $\\sqrt{2}$', id: 'Nilai eksak dari $\\sqrt{2}$' },
                { en: 'A point where $f(x)$ itself equals $0$ exactly', id: 'Titik tempat $f(x)$ sendiri tepat sama dengan $0$' },
                { en: 'The starting guess itself', id: 'Tebakan awal itu sendiri' },
              ],
              answer: 0,
              explain: {
                en: 'The dashed tangent line at $(1, -1)$ crosses the $x$-axis at $x = 1.5$ — not the true root itself, but a step closer to it, ready to become the next tangent point.',
                id: 'Garis singgung putus-putus di $(1, -1)$ memotong sumbu-$x$ di $x = 1.5$ — bukan akar sebenarnya, tetapi selangkah lebih dekat ke situ, siap menjadi titik singgung berikutnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use one step of Newton\'s Method on $f(x) = x^2 - 5$, starting at $x_0 = 2$, to find $x_1$.',
                id: 'Pakai satu langkah Metode Newton pada $f(x) = x^2 - 5$, mulai dari $x_0 = 2$, untuk mencari $x_1$.',
              },
              blanks: [{ answer: 2.25 }],
              hints: [
                { en: "$x_1 = 2 - f(2)/f'(2) = 2 - (-1)/4$.", id: "$x_1 = 2 - f(2)/f'(2) = 2 - (-1)/4$." },
              ],
              explain: {
                en: '$x_1 = 2 - (4-5)/4 = 2 + 0.25 = 2.25$, already close to $\\sqrt{5} \\approx 2.2361$.',
                id: '$x_1 = 2 - (4-5)/4 = 2 + 0{,}25 = 2{,}25$, sudah dekat dengan $\\sqrt{5} \\approx 2{,}2361$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m7-s2-p',
        runtime: 'math',
        title: { en: 'Optimizing and Approximating', id: 'Mengoptimalkan dan Menghampiri' },
        brief: {
          en: 'One optimization problem, and two steps of Newton\'s Method.',
          id: 'Satu soal optimisasi, dan dua langkah Metode Newton.',
        },
        requirements: [
          { en: 'Reduce the optimization problem to one variable before applying the closed interval method.', id: 'Reduksi soal optimisasinya menjadi satu peubah sebelum menerapkan metode selang tertutup.' },
          { en: "Each Newton's Method step uses the previous guess to compute the next.", id: 'Tiap langkah Metode Newton memakai tebakan sebelumnya untuk menghitung yang berikutnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Two numbers have a sum of 20. Maximize their product $P(x) = x(20-x)$. Report the maximum product.', id: 'Dua bilangan berjumlah 20. Maksimalkan hasil kalinya $P(x) = x(20-x)$. Laporkan hasil kali maksimumnya.' },
            blanks: [{ answer: 100 }],
            solution: ["P'(x)=20-2x=0 \\Rightarrow x=10, \\quad P(10)=100"],
          },
          {
            prompt: { en: 'Use one step of Newton\'s Method on $f(x) = x^2 - 10$, starting at $x_0 = 3$, to find $x_1$.', id: 'Pakai satu langkah Metode Newton pada $f(x) = x^2 - 10$, mulai dari $x_0 = 3$, untuk mencari $x_1$.' },
            blanks: [{ answer: 19 / 6, tol: 0.001 }],
            solution: ["x_1 = 3 - \\dfrac{9-10}{6} = 3+\\dfrac16 = \\dfrac{19}{6} \\approx 3{,}1667"],
          },
          {
            prompt: { en: 'Continuing from $x_1 = 19/6$, use one more step of Newton\'s Method on the same $f(x) = x^2 - 10$ to find $x_2$. (Round to four decimal places.)', id: 'Melanjutkan dari $x_1 = 19/6$, pakai satu langkah lagi Metode Newton pada $f(x) = x^2 - 10$ yang sama untuk mencari $x_2$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 3.1623, tol: 0.001 }],
            solution: ["x_2 = 3{,}1667 - \\dfrac{3{,}1667^2-10}{2(3{,}1667)} \\approx 3{,}1623, \\text{ matching } \\sqrt{10}\\approx 3{,}16228"],
          },
        ],
        hints: [
          { en: 'Part 3: keep at least four decimal places throughout, since Newton\'s Method converges fast and rounding too early costs accuracy.', id: 'Butir 3: pertahankan setidaknya empat desimal sepanjang perhitungan, sebab Metode Newton konvergen cepat dan membulatkan terlalu dini mengorbankan akurasi.' },
        ],
        xp: 50,
      },
    },
  ],
}
