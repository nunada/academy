import type { Module } from '../types'

/** Module 1 — the whole course starts by running the last one backwards. Every
 *  derivative rule the Derivatives course proved becomes, read right to left,
 *  a rule for undoing a derivative — and undoing loses information a forward
 *  rule never had to account for: the +C. */
export const module1: Module = {
  id: 'int-m1',
  title: { en: 'Antiderivatives and the Indefinite Integral', id: 'Antiturunan dan Integral Tak Tentu' },
  summary: {
    en: 'Running differentiation backwards, the family of antiderivatives it produces, and pinning down one member of that family with an initial condition.',
    id: 'Menjalankan penurunan secara terbalik, keluarga antiturunan yang dihasilkannya, dan menentukan satu anggota keluarga itu dengan syarat awal.',
  },
  submodules: [
    /* ------------------------------------------------- 1.1 reversing the derivative */
    {
      id: 'int-m1-s1',
      title: { en: 'Reversing the Derivative', id: 'Membalik Turunan' },
      summary: {
        en: 'What an antiderivative is, why it is never unique, and the power rule run in reverse.',
        id: 'Apa itu antiturunan, mengapa ia tak pernah tunggal, dan aturan pangkat yang dijalankan terbalik.',
      },
      lessons: [
        {
          id: 'int-m1-s1-l1',
          title: { en: 'What an Antiderivative Is', id: 'Apa Itu Antiturunan' },
          goal: {
            en: 'Recognise F as an antiderivative of f when F prime equals f, and see why the answer is always a whole family, not one function.',
            id: 'Mengenali F sebagai antiturunan dari f ketika F aksen sama dengan f, dan melihat mengapa jawabannya selalu satu keluarga, bukan satu fungsi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Asking the derivative question backwards', id: 'Menanyakan soal turunan secara terbalik' },
              body: {
                en: 'The Derivatives course always asked: given $f$, find $f\'$. This course asks the reverse: given $f$, find a function $F$ with\n$$F\'(x) = f(x)$$\n$F$ is called an **antiderivative** of $f$. For $f(x) = 2x$, one antiderivative is $F(x) = x^2$, since $\\frac{d}{dx}(x^2) = 2x$. But $x^2 + 5$ works too — its derivative is still $2x$, since the derivative of a constant is $0$. So does $x^2 - 100$. Differentiation destroys any constant that was added on, so undoing it can never recover that constant — every antiderivative comes with company.',
                id: 'Kursus Turunan selalu bertanya: diberikan $f$, cari $f\'$. Kursus ini bertanya kebalikannya: diberikan $f$, cari fungsi $F$ dengan\n$$F\'(x) = f(x)$$\n$F$ disebut **antiturunan** dari $f$. Untuk $f(x) = 2x$, salah satu antiturunannya adalah $F(x) = x^2$, sebab $\\frac{d}{dx}(x^2) = 2x$. Tetapi $x^2 + 5$ juga berlaku — turunannya tetap $2x$, sebab turunan konstanta adalah $0$. Begitu pula $x^2 - 100$. Penurunan menghancurkan konstanta apa pun yang ditambahkan, sehingga membalikkannya tak pernah bisa memulihkan konstanta itu — setiap antiturunan datang dengan rombongan.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-2, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2+3', color: 'a' },
                  { t: 'curve', f: 'x^2', color: 'b' },
                  { t: 'curve', f: 'x^2-3', color: 'c' },
                ],
                caption: {
                  en: 'Three antiderivatives of $f(x) = 2x$, stacked directly on top of one another — same shape, same slope at every $x$, different height.',
                  id: 'Tiga antiturunan dari $f(x) = 2x$, bertumpuk tepat satu di atas yang lain — bentuk sama, kemiringan sama di setiap $x$, tinggi berbeda.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The whole family, and the notation for it', id: 'Seluruh keluarga, dan notasi untuknya' },
              body: {
                en: 'Since any two antiderivatives of the same $f$ differ only by a constant, the complete answer is written\n$$F(x) + C$$\nwhere $C$ is an arbitrary real number — the **general antiderivative**, sometimes called the **indefinite integral** and written $\\int f(x)\\,dx$. The $\\int$ and the $dx$ are notation this course introduces properly in Module 2; for now, read $\\int f(x)\\,dx = F(x) + C$ simply as "the family of all antiderivatives of $f$".\n\nEvery member of the family has the exact same slope at each $x$ — the graphs are vertical translates of one another, which is exactly what the figure above shows.',
                id: 'Karena dua antiturunan mana pun dari $f$ yang sama hanya berbeda oleh sebuah konstanta, jawaban lengkapnya ditulis\n$$F(x) + C$$\ndengan $C$ bilangan real sebarang — **antiturunan umum**, kadang disebut **integral tak tentu** dan ditulis $\\int f(x)\\,dx$. Simbol $\\int$ dan $dx$ adalah notasi yang diperkenalkan secara resmi kursus ini pada Modul 2; untuk saat ini, bacalah $\\int f(x)\\,dx = F(x) + C$ sederhananya sebagai "keluarga semua antiturunan dari $f$".\n\nSetiap anggota keluarga itu punya kemiringan yang persis sama di setiap $x$ — grafiknya adalah translasi vertikal satu sama lain, persis seperti yang ditunjukkan gambar di atas.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does an antiderivative always come as a whole family rather than a single function?',
                id: 'Mengapa antiturunan selalu datang sebagai satu keluarga, bukan satu fungsi tunggal?',
              },
              options: [
                { en: 'Differentiation erases any constant term, so undoing it cannot recover which constant was there', id: 'Penurunan menghapus suku konstanta apa pun, sehingga membalikkannya tak bisa memulihkan konstanta mana yang ada' },
                { en: 'Every function has infinitely many derivatives', id: 'Setiap fungsi punya turunan yang tak terhingga banyaknya' },
                { en: 'Antiderivatives are only ever defined up to a sign', id: 'Antiturunan hanya pernah terdefinisi hingga tanda' },
                { en: 'It is a notational convention with no mathematical reason', id: 'Ini hanyalah konvensi notasi tanpa alasan matematis' },
              ],
              answer: 0,
              explain: {
                en: 'The derivative of any constant is $0$, so adding a different constant to $F$ never changes $F\'$. Reversing the derivative can only recover $F$ up to that lost constant.',
                id: 'Turunan konstanta apa pun adalah $0$, jadi menambahkan konstanta berbeda ke $F$ tak pernah mengubah $F\'$. Membalik turunan hanya bisa memulihkan $F$ hingga konstanta yang hilang itu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of three antiderivatives of the same function, what do they have in common at every $x$?',
                id: 'Dengan membaca grafik di atas dari tiga antiturunan fungsi yang sama, apa kesamaan ketiganya di setiap $x$?',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-2, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2+3', color: 'a' },
                  { t: 'curve', f: 'x^2', color: 'b' },
                  { t: 'curve', f: 'x^2-3', color: 'c' },
                ],
              },
              options: [
                { en: 'The same slope', id: 'Kemiringan yang sama' },
                { en: 'The same height', id: 'Tinggi yang sama' },
                { en: 'The same x-intercepts', id: 'Titik potong sumbu-x yang sama' },
                { en: 'Nothing — they are unrelated curves', id: 'Tak ada — ketiganya kurva yang tak berkaitan' },
              ],
              answer: 0,
              explain: {
                en: 'At any given $x$, the three curves rise or fall at exactly the same rate — vertical translates share a slope everywhere, which is what "same derivative" looks like.',
                id: 'Pada $x$ tertentu mana pun, ketiga kurva naik atau turun dengan laju yang persis sama — translasi vertikal berbagi kemiringan di mana-mana, dan itulah rupa "turunan yang sama".',
              },
            },
            {
              kind: 'quiz',
              id: 'q3',
              prompt: {
                en: 'Which of the following is an antiderivative of $f(x) = 4x^3$?',
                id: 'Manakah dari berikut ini yang merupakan antiturunan dari $f(x) = 4x^3$?',
              },
              options: [
                { en: '$x^4 + 7$', id: '$x^4 + 7$' },
                { en: '$12x^2$', id: '$12x^2$' },
                { en: '$4x^4$', id: '$4x^4$' },
                { en: '$x^4/4$', id: '$x^4/4$' },
              ],
              answer: 0,
              explain: {
                en: 'Differentiating $x^4 + 7$ gives $4x^3$ exactly — the $+7$ vanishes and the exponent rule matches. Differentiating $12x^2$ gives $24x$, not $f$. Differentiating $4x^4$ gives $16x^3$.',
                id: 'Menurunkan $x^4 + 7$ memberi $4x^3$ persis — $+7$-nya lenyap dan aturan eksponennya cocok. Menurunkan $12x^2$ memberi $24x$, bukan $f$. Menurunkan $4x^4$ memberi $16x^3$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Check each candidate by differentiating it: does it equal $f(x) = 6x^2$? Type $1$ for yes, $0$ for no.',
                id: 'Periksa tiap kandidat dengan menurunkannya: apakah sama dengan $f(x) = 6x^2$? Ketik $1$ untuk ya, $0$ untuk tidak.',
              },
              blanks: [
                { label: '\\tfrac{d}{dx}(2x^3 - 4) \\overset{?}{=} 6x^2 \\ \\Rightarrow', answer: 1 },
                { label: '\\tfrac{d}{dx}(3x^3) \\overset{?}{=} 6x^2 \\ \\Rightarrow', answer: 0 },
              ],
              hints: [
                { en: 'Differentiate each candidate first, then compare to $6x^2$.', id: 'Turunkan tiap kandidat lebih dahulu, baru bandingkan dengan $6x^2$.' },
              ],
              explain: {
                en: '$\\frac{d}{dx}(2x^3 - 4) = 6x^2$: a match. $\\frac{d}{dx}(3x^3) = 9x^2$: not a match — the coefficient is wrong.',
                id: '$\\frac{d}{dx}(2x^3 - 4) = 6x^2$: cocok. $\\frac{d}{dx}(3x^3) = 9x^2$: tidak cocok — koefisiennya salah.',
              },
            },
          ],
        },
        {
          id: 'int-m1-s1-l2',
          title: { en: 'The Power Rule for Integration', id: 'Aturan Pangkat untuk Integral' },
          goal: {
            en: 'Reverse the power rule to antidifferentiate x^n for any exponent except -1, and handle the one exception separately.',
            id: 'Membalik aturan pangkat untuk mengantiturunkan x^n untuk sebarang pangkat kecuali -1, dan menangani pengecualiannya tersendiri.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Undo bring-down-and-drop by doing the opposite', id: 'Membalik turunkan-dan-kurangi dengan melakukan sebaliknya' },
              body: {
                en: 'The power rule for derivatives brings the exponent down and drops it by one: $\\frac{d}{dx}(x^n) = nx^{n-1}$. Running that backwards — raise the exponent by one, then divide by the new exponent — gives the **power rule for integration**:\n$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C, \\qquad n \\neq -1$$\nCheck it the way every reversed rule gets checked: differentiate the answer. $\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1}\\right) = \\frac{(n+1)x^n}{n+1} = x^n$. The two operations cancel exactly, which is the only test an antiderivative ever has to pass.\n\nFor $f(x) = x^5$: $\\int x^5\\,dx = \\frac{x^6}{6} + C$.',
                id: 'Aturan pangkat untuk turunan menurunkan pangkatnya lalu menguranginya satu: $\\frac{d}{dx}(x^n) = nx^{n-1}$. Menjalankannya terbalik — naikkan pangkatnya satu, lalu bagi dengan pangkat baru itu — memberi **aturan pangkat untuk integral**:\n$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C, \\qquad n \\neq -1$$\nPeriksa dengan cara setiap aturan yang dibalik diperiksa: turunkan jawabannya. $\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1}\\right) = \\frac{(n+1)x^n}{n+1} = x^n$. Kedua operasi saling meniadakan persis, dan itulah satu-satunya ujian yang harus dilalui antiturunan mana pun.\n\nUntuk $f(x) = x^5$: $\\int x^5\\,dx = \\frac{x^6}{6} + C$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Negative and fractional exponents, and the one case that breaks', id: 'Pangkat negatif dan pecahan, dan satu kasus yang gagal' },
              body: {
                en: 'The rule needs no modification for negative or fractional $n$: $\\int x^{-3}\\,dx = \\frac{x^{-2}}{-2} + C = -\\frac{1}{2x^2} + C$, and $\\int \\sqrt{x}\\,dx = \\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} + C = \\frac{2}{3}x^{3/2} + C$.\n\nBut $n = -1$ divides by zero in the formula, so $\\int x^{-1}\\,dx = \\int \\frac{1}{x}\\,dx$ needs a different answer entirely. The Derivatives course proved $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$ — running that backwards directly gives\n$$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$$\nThe absolute value matters: $\\frac{1}{x}$ is defined for negative $x$ too, and $\\ln|x|$ is what stays defined there (plain $\\ln x$ is not).',
                id: 'Aturannya tak perlu diubah untuk $n$ negatif atau pecahan: $\\int x^{-3}\\,dx = \\frac{x^{-2}}{-2} + C = -\\frac{1}{2x^2} + C$, dan $\\int \\sqrt{x}\\,dx = \\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} + C = \\frac{2}{3}x^{3/2} + C$.\n\nTetapi $n = -1$ membagi dengan nol pada rumusnya, sehingga $\\int x^{-1}\\,dx = \\int \\frac{1}{x}\\,dx$ memerlukan jawaban yang sama sekali berbeda. Kursus Turunan membuktikan $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$ — menjalankannya terbalik langsung memberi\n$$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$$\nNilai mutlaknya penting: $\\frac{1}{x}$ terdefinisi untuk $x$ negatif juga, dan $\\ln|x|$ itulah yang tetap terdefinisi di sana (sekadar $\\ln x$ tidak).',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the power rule for integration exclude $n = -1$?',
                id: 'Mengapa aturan pangkat untuk integral mengecualikan $n = -1$?',
              },
              options: [
                { en: 'The formula $x^{(n+1)}/(n+1)$ would divide by zero', id: 'Rumus $x^{(n+1)}/(n+1)$ akan membagi dengan nol' },
                { en: '$1/x$ has no antiderivative at all', id: '$1/x$ sama sekali tak punya antiturunan' },
                { en: 'Negative exponents are never allowed in integration', id: 'Pangkat negatif tak pernah diizinkan dalam integral' },
                { en: 'It is excluded only by historical convention, with no mathematical reason', id: 'Dikecualikan hanya karena konvensi sejarah, tanpa alasan matematis' },
              ],
              answer: 0,
              explain: {
                en: 'Substituting $n = -1$ into $(n+1)$ puts a $0$ in the denominator. $1/x$ does have an antiderivative — $\\ln|x|$ — it just is not the one the power-rule formula produces.',
                id: 'Mensubstitusikan $n = -1$ ke $(n+1)$ meletakkan $0$ di penyebut. $1/x$ memang punya antiturunan — $\\ln|x|$ — hanya saja bukan yang dihasilkan rumus aturan pangkat.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the antiderivative of $f(x) = x^{-4}$.',
                id: 'Lengkapi antiturunan dari $f(x) = x^{-4}$.',
              },
              template: '\\int x^{-4}\\,dx = x^{-3}/___ + ___',
              blanks: ['-3', 'C'],
              explain: {
                en: 'Raise the exponent to $-3$, then divide by that same $-3$ — and never drop the $+C$, since the family is the whole answer.',
                id: 'Naikkan pangkatnya menjadi $-3$, lalu bagi dengan $-3$ yang sama itu — dan jangan pernah membuang $+C$, sebab keluarganya adalah jawaban lengkapnya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that antidifferentiate $f(x) = \\sqrt{x}$.',
                id: 'Susun langkah yang mengantiturunkan $f(x) = \\sqrt{x}$.',
              },
              lines: [
                '\\int x^{1/2}\\,dx',
                '= \\frac{x^{3/2}}{3/2} + C',
                '= \\frac{2}{3}x^{3/2} + C',
              ],
              explain: {
                en: 'Rewrite the root as a fractional exponent first, then apply the power rule mechanically, then simplify the resulting fraction.',
                id: 'Tulis ulang akarnya sebagai pangkat pecahan lebih dahulu, lalu terapkan aturan pangkat secara mekanis, baru sederhanakan pecahan yang dihasilkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the antiderivative of $f(x) = 1/x^2$ with $F(1) = 0$, then evaluate $F(2)$.',
                id: 'Cari antiturunan dari $f(x) = 1/x^2$ dengan $F(1) = 0$, lalu hitung $F(2)$.',
              },
              blanks: [{ label: 'F(2) =', answer: 0.5 }],
              hints: [
                { en: '$f(x) = x^{-2}$, so $F(x) = -x^{-1} + C$.', id: '$f(x) = x^{-2}$, sehingga $F(x) = -x^{-1} + C$.' },
                { en: '$F(1) = -1 + C = 0$ pins down $C$.', id: '$F(1) = -1 + C = 0$ menentukan $C$.' },
              ],
              explain: {
                en: '$F(x) = -1/x + C$. $F(1) = -1 + C = 0$ gives $C = 1$, so $F(x) = -1/x + 1$. $F(2) = -1/2 + 1 = 0.5$.',
                id: '$F(x) = -1/x + C$. $F(1) = -1 + C = 0$ memberi $C = 1$, sehingga $F(x) = -1/x + 1$. $F(2) = -1/2 + 1 = 0,5$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m1-s1-p',
        runtime: 'math',
        title: { en: 'Finding Antiderivatives', id: 'Mencari Antiturunan' },
        brief: {
          en: 'Two power-rule antiderivatives, and the one case the power rule cannot reach.',
          id: 'Dua antiturunan aturan pangkat, dan satu kasus yang tak terjangkau aturan pangkat.',
        },
        requirements: [
          { en: 'Raise the exponent by one and divide by the new exponent — except at $n = -1$.', id: 'Naikkan pangkatnya satu dan bagi dengan pangkat barunya — kecuali di $n = -1$.' },
          { en: 'Check any answer by differentiating it back.', id: 'Periksa jawaban mana pun dengan menurunkannya kembali.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the antiderivative of $f(x) = x^6$ with $C = 0$, then evaluate it at $x = 2$.', id: 'Cari antiturunan dari $f(x) = x^6$ dengan $C = 0$, lalu hitung nilainya di $x = 2$.' },
            blanks: [{ answer: 128 / 7 }],
            solution: ['F(x) = \\dfrac{x^7}{7}, \\quad F(2) = \\dfrac{128}{7} \\approx 18{,}29'],
          },
          {
            prompt: { en: 'Find the antiderivative of $f(x) = x^{-2/3}$ with $C = 0$, then evaluate it at $x = 8$.', id: 'Cari antiturunan dari $f(x) = x^{-2/3}$ dengan $C = 0$, lalu hitung nilainya di $x = 8$.' },
            blanks: [{ answer: 6 }],
            solution: ['F(x) = \\dfrac{x^{1/3}}{1/3} = 3x^{1/3}, \\quad F(8) = 3(2) = 6'],
          },
          {
            prompt: { en: 'Find the antiderivative of $f(x) = 3/x$ with $F(1) = 0$, then evaluate it at $x = e$.', id: 'Cari antiturunan dari $f(x) = 3/x$ dengan $F(1) = 0$, lalu hitung nilainya di $x = e$.' },
            blanks: [{ answer: 3 }],
            solution: ['F(x) = 3\\ln|x| + C, \\quad F(1) = 0 \\Rightarrow C = 0, \\quad F(e) = 3\\ln e = 3'],
          },
        ],
        hints: [
          { en: 'Part 3 needs the $\\ln|x|$ antiderivative, not the power rule — $1/x$ is the excluded case.', id: 'Butir 3 memerlukan antiturunan $\\ln|x|$, bukan aturan pangkat — $1/x$ adalah kasus yang dikecualikan.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------- 1.2 basic rules and initial value problems */
    {
      id: 'int-m1-s2',
      title: { en: 'Basic Rules and Initial Value Problems', id: 'Aturan Dasar dan Soal Nilai Awal' },
      summary: {
        en: 'Sum, constant multiple, sine, cosine, and exponential antiderivatives, then using a known point to pin down C.',
        id: 'Antiturunan jumlah, kelipatan konstanta, sinus, cosinus, dan eksponen, lalu memakai titik yang diketahui untuk menentukan C.',
      },
      lessons: [
        {
          id: 'int-m1-s2-l1',
          title: { en: 'Sum, Constant Multiple, and the Basic Functions', id: 'Jumlah, Kelipatan Konstanta, dan Fungsi Dasar' },
          goal: {
            en: 'Antidifferentiate term by term, and know the antiderivatives of sine, cosine, and the exponential.',
            id: 'Mengantiturunkan suku demi suku, dan mengetahui antiturunan sinus, cosinus, dan eksponen.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Every linearity rule, reversed', id: 'Setiap aturan linearitas, dibalik' },
              body: {
                en: 'The sum, difference, and constant-multiple rules for derivatives reverse exactly as themselves:\n$$\\int \\big(f(x) \\pm g(x)\\big)\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx, \\qquad \\int k\\,f(x)\\,dx = k\\int f(x)\\,dx$$\nSo a polynomial antidifferentiates term by term, exactly the way it differentiates term by term. For $f(x) = 3x^4 - 2x + 7$:\n$$\\int (3x^4 - 2x + 7)\\,dx = \\frac{3x^5}{5} - x^2 + 7x + C$$\nOne $+C$ at the very end is enough — three separate constants would just add up to one arbitrary constant anyway.',
                id: 'Aturan jumlah, selisih, dan kelipatan konstanta untuk turunan dibalik persis seperti dirinya sendiri:\n$$\\int \\big(f(x) \\pm g(x)\\big)\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx, \\qquad \\int k\\,f(x)\\,dx = k\\int f(x)\\,dx$$\nJadi polinom diantiturunkan suku demi suku, persis seperti ia diturunkan suku demi suku. Untuk $f(x) = 3x^4 - 2x + 7$:\n$$\\int (3x^4 - 2x + 7)\\,dx = \\frac{3x^5}{5} - x^2 + 7x + C$$\nSatu $+C$ di akhir sudah cukup — tiga konstanta terpisah hanya akan berjumlah menjadi satu konstanta sebarang juga.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Sine, cosine, and the exponential, reversed', id: 'Sinus, cosinus, dan eksponen, dibalik' },
              body: {
                en: 'The Derivatives course proved $\\frac{d}{dx}(\\sin x) = \\cos x$ and $\\frac{d}{dx}(\\cos x) = -\\sin x$. Read backwards:\n$$\\int \\cos x\\,dx = \\sin x + C, \\qquad \\int \\sin x\\,dx = -\\cos x + C$$\nThe minus sign moves to the other side when reversing — check it: $\\frac{d}{dx}(-\\cos x) = -(-\\sin x) = \\sin x$. And since $\\frac{d}{dx}(e^x) = e^x$:\n$$\\int e^x\\,dx = e^x + C$$\nthe one function that is, again, its own antiderivative.',
                id: 'Kursus Turunan membuktikan $\\frac{d}{dx}(\\sin x) = \\cos x$ dan $\\frac{d}{dx}(\\cos x) = -\\sin x$. Dibaca terbalik:\n$$\\int \\cos x\\,dx = \\sin x + C, \\qquad \\int \\sin x\\,dx = -\\cos x + C$$\nTanda minusnya berpindah ke sisi lain ketika dibalik — periksa: $\\frac{d}{dx}(-\\cos x) = -(-\\sin x) = \\sin x$. Dan karena $\\frac{d}{dx}(e^x) = e^x$:\n$$\\int e^x\\,dx = e^x + C$$\nsatu-satunya fungsi yang, sekali lagi, menjadi antiturunannya sendiri.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the antiderivative of $f(x) = \\sin x$?',
                id: 'Berapakah antiturunan dari $f(x) = \\sin x$?',
              },
              options: [
                { en: '$-\\cos x + C$', id: '$-\\cos x + C$' },
                { en: '$\\cos x + C$', id: '$\\cos x + C$' },
                { en: '$-\\sin x + C$', id: '$-\\sin x + C$' },
                { en: '$\\sin x + C$', id: '$\\sin x + C$' },
              ],
              answer: 0,
              explain: {
                en: 'Differentiating $-\\cos x$ gives $-(-\\sin x) = \\sin x$, exactly $f$. The minus sign is easy to drop by accident — check by differentiating whenever in doubt.',
                id: 'Menurunkan $-\\cos x$ memberi $-(-\\sin x) = \\sin x$, persis $f$. Tanda minusnya mudah terlewat secara tak sengaja — periksa dengan menurunkan setiap kali ragu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which function is its own antiderivative (with $C = 0$)?',
                id: 'Fungsi manakah yang menjadi antiturunannya sendiri (dengan $C = 0$)?',
              },
              options: [
                { en: '$e^x$', id: '$e^x$' },
                { en: '$\\sin x$', id: '$\\sin x$' },
                { en: '$x^2$', id: '$x^2$' },
                { en: '$\\ln x$', id: '$\\ln x$' },
              ],
              answer: 0,
              explain: {
                en: '$e^x$ is its own derivative and, by the same fact read the other way, its own antiderivative.',
                id: '$e^x$ adalah turunannya sendiri dan, dengan fakta yang sama dibaca sebaliknya, antiturunannya sendiri.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the antiderivative of $f(x) = 6x^2 - 4\\sin x$.',
                id: 'Lengkapi antiturunan dari $f(x) = 6x^2 - 4\\sin x$.',
              },
              template: '\\int (6x^2 - 4\\sin x)\\,dx = ___x^3 + ___\\cos x + C',
              blanks: ['2', '4'],
              explain: {
                en: 'Term by term: $6x^2$ gives $2x^3$, and $-4\\sin x$ gives $-4 \\cdot (-\\cos x) = 4\\cos x$.',
                id: 'Suku demi suku: $6x^2$ memberi $2x^3$, dan $-4\\sin x$ memberi $-4 \\cdot (-\\cos x) = 4\\cos x$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the antiderivative of $f(x) = 4e^x + 2x$ with $C = 0$, then evaluate it at $x = 0$.',
                id: 'Cari antiturunan dari $f(x) = 4e^x + 2x$ dengan $C = 0$, lalu hitung nilainya di $x = 0$.',
              },
              blanks: [{ label: 'F(0) =', answer: 4 }],
              hints: [
                { en: '$F(x) = 4e^x + x^2 + C$.', id: '$F(x) = 4e^x + x^2 + C$.' },
              ],
              explain: {
                en: '$F(0) = 4e^0 + 0^2 = 4(1) + 0 = 4$.',
                id: '$F(0) = 4e^0 + 0^2 = 4(1) + 0 = 4$.',
              },
            },
          ],
        },
        {
          id: 'int-m1-s2-l2',
          title: { en: 'Initial Value Problems', id: 'Soal Nilai Awal' },
          goal: {
            en: 'Use one known point to pin down C, and recover a position function from a velocity function.',
            id: 'Memakai satu titik yang diketahui untuk menentukan C, dan memulihkan fungsi posisi dari fungsi kecepatan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One point picks out one member of the family', id: 'Satu titik memilih satu anggota keluarga' },
              body: {
                en: 'The family $F(x) + C$ has one member through every height — exactly one curve in the family passes through any given point. An **initial value problem** gives that point directly: find $F$ with $F\'(x) = f(x)$ and $F(x_0) = y_0$.\n\nFor $f(x) = 3x^2$ with $F(1) = 5$: first, $\\int 3x^2\\,dx = x^3 + C$. Then substitute the known point: $F(1) = 1^3 + C = 5$, so $C = 4$. The **particular antiderivative** is $F(x) = x^3 + 4$ — one specific curve, singled out of the whole family.',
                id: 'Keluarga $F(x) + C$ punya satu anggota untuk setiap ketinggian — tepat satu kurva dalam keluarga itu melalui titik tertentu mana pun. **Soal nilai awal** memberikan titik itu secara langsung: cari $F$ dengan $F\'(x) = f(x)$ dan $F(x_0) = y_0$.\n\nUntuk $f(x) = 3x^2$ dengan $F(1) = 5$: pertama, $\\int 3x^2\\,dx = x^3 + C$. Lalu substitusikan titik yang diketahui: $F(1) = 1^3 + C = 5$, sehingga $C = 4$. **Antiturunan khusus**-nya adalah $F(x) = x^3 + 4$ — satu kurva spesifik, dipilih dari seluruh keluarga.',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 2.5],
                ySpan: [-2, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3+4', color: 'a' },
                  { t: 'curve', f: 'x^3+1', color: 'muted', dashed: true },
                  { t: 'curve', f: 'x^3-2', color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 5, color: 'result', label: '(1, 5)' },
                ],
                caption: {
                  en: 'Out of the whole family $x^3 + C$, the point $(1, 5)$ singles out exactly one curve — the one with $C = 4$.',
                  id: 'Dari seluruh keluarga $x^3 + C$, titik $(1, 5)$ memilih tepat satu kurva — yang $C$-nya $4$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Position from velocity, twice over', id: 'Posisi dari kecepatan, dua kali' },
              body: {
                en: 'The Derivatives course established $v(t) = s\'(t)$ and $a(t) = v\'(t)$ — velocity is the derivative of position, acceleration the derivative of velocity. Antidifferentiation runs both arrows backwards: given acceleration and an initial velocity, recover velocity; given that velocity and an initial position, recover position.\n\nFor constant acceleration $a(t) = -10$ (gravity, in simplified units) with $v(0) = 20$ and $s(0) = 0$: $v(t) = \\int -10\\,dt = -10t + C_1$, and $v(0) = C_1 = 20$, so $v(t) = -10t + 20$. Then $s(t) = \\int (-10t + 20)\\,dt = -5t^2 + 20t + C_2$, and $s(0) = C_2 = 0$, so $s(t) = -5t^2 + 20t$ — two initial value problems, solved one after the other.',
                id: 'Kursus Turunan menetapkan $v(t) = s\'(t)$ dan $a(t) = v\'(t)$ — kecepatan adalah turunan posisi, percepatan turunan kecepatan. Antiturunan menjalankan kedua panah itu terbalik: diberikan percepatan dan kecepatan awal, pulihkan kecepatan; diberikan kecepatan itu dan posisi awal, pulihkan posisi.\n\nUntuk percepatan konstan $a(t) = -10$ (gravitasi, dalam satuan yang disederhanakan) dengan $v(0) = 20$ dan $s(0) = 0$: $v(t) = \\int -10\\,dt = -10t + C_1$, dan $v(0) = C_1 = 20$, sehingga $v(t) = -10t + 20$. Lalu $s(t) = \\int (-10t + 20)\\,dt = -5t^2 + 20t + C_2$, dan $s(0) = C_2 = 0$, sehingga $s(t) = -5t^2 + 20t$ — dua soal nilai awal, diselesaikan satu demi satu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does an initial value problem add to a plain antidifferentiation question?',
                id: 'Apa yang ditambahkan soal nilai awal pada pertanyaan antiturunan biasa?',
              },
              options: [
                { en: 'A known point that pins down the value of $C$', id: 'Titik yang diketahui, yang menentukan nilai $C$' },
                { en: 'A requirement that $C$ always equals zero', id: 'Syarat bahwa $C$ selalu sama dengan nol' },
                { en: 'A second, unrelated function to antidifferentiate', id: 'Fungsi kedua yang tak berkaitan untuk diantiturunkan' },
                { en: 'Nothing — it is solved exactly like any other antiderivative', id: 'Tak ada — diselesaikan persis seperti antiturunan lainnya' },
              ],
              answer: 0,
              explain: {
                en: 'Antidifferentiating alone gives a whole family $F(x) + C$. The initial condition is one point that family must pass through, which forces a specific $C$.',
                id: 'Mengantiturunkan saja memberi seluruh keluarga $F(x) + C$. Syarat awalnya adalah satu titik yang harus dilalui keluarga itu, yang memaksa $C$ tertentu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, which dashed curve, if any, passes through $(1, 5)$?',
                id: 'Dengan membaca gambar di atas, kurva putus-putus manakah, jika ada, yang melalui $(1, 5)$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2.5, 2.5],
                ySpan: [-2, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3+4', color: 'a' },
                  { t: 'curve', f: 'x^3+1', color: 'muted', dashed: true },
                  { t: 'curve', f: 'x^3-2', color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 5, color: 'result' },
                ],
              },
              options: [
                { en: 'Neither dashed curve — only the solid one does', id: 'Tak satu pun kurva putus-putus — hanya yang solid' },
                { en: 'The upper dashed curve', id: 'Kurva putus-putus atas' },
                { en: 'The lower dashed curve', id: 'Kurva putus-putus bawah' },
                { en: 'Both dashed curves', id: 'Kedua kurva putus-putus' },
              ],
              answer: 0,
              explain: {
                en: 'Only one member of the family passes through any given point — that is the solid curve, $x^3 + 4$. Both dashed curves miss $(1, 5)$ entirely.',
                id: 'Hanya satu anggota keluarga yang melalui titik tertentu mana pun — itulah kurva solidnya, $x^3 + 4$. Kedua kurva putus-putus sama sekali tak melalui $(1, 5)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find $F$ with $F\'(x) = 4x - 1$ and $F(2) = 10$, then evaluate $F(0)$.',
                id: 'Cari $F$ dengan $F\'(x) = 4x - 1$ dan $F(2) = 10$, lalu hitung $F(0)$.',
              },
              blanks: [{ label: 'F(0) =', answer: 4 }],
              hints: [
                { en: '$F(x) = 2x^2 - x + C$. Use $F(2) = 10$ to find $C$.', id: '$F(x) = 2x^2 - x + C$. Pakai $F(2) = 10$ untuk mencari $C$.' },
              ],
              explain: {
                en: '$F(2) = 8 - 2 + C = 10$ gives $C = 4$, so $F(x) = 2x^2 - x + 4$. $F(0) = 0 - 0 + 4 = 4$.',
                id: '$F(2) = 8 - 2 + C = 10$ memberi $C = 4$, sehingga $F(x) = 2x^2 - x + 4$. $F(0) = 0 - 0 + 4 = 4$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m1-s2-p',
        runtime: 'math',
        title: { en: 'Pinning Down the Constant', id: 'Menentukan Konstantanya' },
        brief: {
          en: 'Two initial value problems, and one recovering position from acceleration.',
          id: 'Dua soal nilai awal, dan satu memulihkan posisi dari percepatan.',
        },
        requirements: [
          { en: 'Antidifferentiate first, then substitute the known point to solve for $C$.', id: 'Antiturunkan lebih dahulu, baru substitusikan titik yang diketahui untuk menyelesaikan $C$.' },
          { en: 'Recovering position from acceleration is two initial value problems in a row.', id: 'Memulihkan posisi dari percepatan adalah dua soal nilai awal secara berturutan.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find $F$ with $F\'(x) = 3x^2 + 2$ and $F(0) = 5$, then evaluate $F(2)$.', id: 'Cari $F$ dengan $F\'(x) = 3x^2 + 2$ dan $F(0) = 5$, lalu hitung $F(2)$.' },
            blanks: [{ answer: 17 }],
            solution: ['F(x) = x^3+2x+C, \\ F(0)=C=5 \\Rightarrow F(x)=x^3+2x+5, \\ F(2)=8+4+5=17'],
          },
          {
            prompt: { en: 'Find $F$ with $F\'(x) = \\cos x$ and $F(0) = 2$, then evaluate $F(\\pi/2)$.', id: 'Cari $F$ dengan $F\'(x) = \\cos x$ dan $F(0) = 2$, lalu hitung $F(\\pi/2)$.' },
            blanks: [{ answer: 3 }],
            solution: ['F(x) = \\sin x + C, \\ F(0)=C=2 \\Rightarrow F(x) = \\sin x+2, \\ F(\\pi/2) = 1+2 = 3'],
          },
          {
            prompt: { en: 'A particle has $a(t) = 6t$, $v(0) = 0$, and $s(0) = 1$. Find $s(2)$.', id: 'Sebuah partikel punya $a(t) = 6t$, $v(0) = 0$, dan $s(0) = 1$. Cari $s(2)$.' },
            blanks: [{ answer: 9 }],
            solution: ['v(t)=3t^2+C_1, \\ v(0)=0 \\Rightarrow v(t)=3t^2', 's(t)=t^3+C_2, \\ s(0)=1 \\Rightarrow s(t)=t^3+1, \\ s(2)=8+1=9'],
          },
        ],
        hints: [
          { en: 'Part 3 chains two initial value problems — solve for velocity completely before starting on position.', id: 'Butir 3 merangkai dua soal nilai awal — selesaikan kecepatan sepenuhnya sebelum memulai posisi.' },
        ],
        xp: 50,
      },
    },
  ],
}
