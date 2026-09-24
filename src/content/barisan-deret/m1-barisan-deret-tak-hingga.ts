import type { Module } from '../types'

/** Module 1 — an infinite list of numbers, and what it means to sum every one
 *  of them. Every idea here is a sequence's-worth version of something the
 *  Limit course already proved for functions: the same definition of a limit,
 *  the same squeeze theorem, applied to n instead of x. */
export const module1: Module = {
  id: 'der-m1',
  title: { en: 'Sequences and Infinite Series', id: 'Barisan dan Deret Tak Hingga' },
  summary: {
    en: 'An infinite list of numbers and the limit it may approach, then an infinite sum built from one — and the first proof that infinitely many positive numbers can add up to something finite.',
    id: 'Daftar tak hingga bilangan dan limit yang mungkin didekatinya, lalu sebuah jumlah tak hingga yang dibangun darinya — dan bukti pertama bahwa tak hingga banyak bilangan positif bisa berjumlah sesuatu yang hingga.',
  },
  submodules: [
    /* -------------------------------------------------------------- 9.1 sequences */
    {
      id: 'der-m1-s1',
      title: { en: 'Sequences', id: 'Barisan' },
      summary: {
        en: 'A sequence as a function of the counting numbers, and what it means for one to converge — the same limit already defined for functions, applied to n instead of x.',
        id: 'Barisan sebagai fungsi dari bilangan cacah, dan apa artinya sebuah barisan konvergen — limit yang sama yang sudah didefinisikan untuk fungsi, diterapkan pada n, bukan x.',
      },
      lessons: [
        {
          id: 'der-m1-s1-l1',
          title: { en: 'Defining a Sequence', id: 'Mendefinisikan Barisan' },
          goal: {
            en: 'Write the general term of a sequence from a pattern, and evaluate specific terms.',
            id: 'Menuliskan suku umum sebuah barisan dari sebuah pola, dan menghitung suku-suku tertentu.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An infinite list, indexed by the counting numbers', id: 'Daftar tak hingga, diindeks oleh bilangan cacah' },
              body: {
                en: 'A **sequence** is an ordered, infinite list of numbers $a_1, a_2, a_3, \\ldots$ — formally, a function whose domain is the positive integers, written $a_n$ instead of $a(n)$. The number $a_n$ is the **general term**, and gives a formula for every term at once. For $a_n = \\dfrac{n}{n+1}$:\n$$a_1=\\tfrac12, \\quad a_2=\\tfrac23, \\quad a_3=\\tfrac34, \\quad a_4=\\tfrac45, \\ \\ldots$$\nEach term is a plain evaluation — no calculus yet, just arithmetic on the index $n$.',
                id: 'Sebuah **barisan** adalah daftar tak hingga yang terurut $a_1, a_2, a_3, \\ldots$ — secara formal, sebuah fungsi yang domainnya bilangan bulat positif, ditulis $a_n$, bukan $a(n)$. Bilangan $a_n$ adalah **suku umum**, dan memberi rumus untuk setiap suku sekaligus. Untuk $a_n = \\dfrac{n}{n+1}$:\n$$a_1=\\tfrac12, \\quad a_2=\\tfrac23, \\quad a_3=\\tfrac34, \\quad a_4=\\tfrac45, \\ \\ldots$$\nSetiap suku hanyalah evaluasi biasa — belum ada kalkulus, sekadar aritmetika pada indeks $n$.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 10],
                ySpan: [-0.2, 1.3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x/(x+1)', from: 0.4, to: 10, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 0.5, color: 'a', label: 'a₁' },
                  { t: 'dot', x: 2, y: 0.667, color: 'a', label: 'a₂' },
                  { t: 'dot', x: 3, y: 0.75, color: 'a', label: 'a₃' },
                  { t: 'dot', x: 4, y: 0.8, color: 'a', label: 'a₄' },
                  { t: 'dot', x: 6, y: 0.857, color: 'a' },
                  { t: 'dot', x: 9, y: 0.9, color: 'a' },
                  { t: 'hline', y: 1, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'The dashed curve $y=\\frac{x}{x+1}$ is only a guide to the eye — a sequence is really just the dots, one for each positive integer $n$, sitting on that curve.',
                  id: 'Kurva putus-putus $y=\\frac{x}{x+1}$ hanyalah bantuan visual — sebuah barisan sesungguhnya hanyalah titik-titiknya, satu untuk tiap bilangan bulat positif $n$, duduk di kurva itu.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Not every sequence has a tidy closed form', id: 'Tak setiap barisan punya bentuk tertutup yang rapi' },
              body: {
                en: 'A sequence may also alternate sign, like $a_n=(-1)^n\\dfrac{1}{n}$:\n$$a_1=-1, \\quad a_2=\\tfrac12, \\quad a_3=-\\tfrac13, \\quad a_4=\\tfrac14, \\ \\ldots$$\nor be defined **recursively**, each term built from the one before rather than from $n$ directly — $a_1=1$, $a_{n+1}=a_n+2n+1$ generates $1, 4, 9, 16, \\ldots$ (the perfect squares, though nothing in the definition mentions squaring at all). Both are still sequences; only the second needs every earlier term computed to reach a later one.',
                id: 'Sebuah barisan juga bisa berganti tanda, seperti $a_n=(-1)^n\\dfrac{1}{n}$:\n$$a_1=-1, \\quad a_2=\\tfrac12, \\quad a_3=-\\tfrac13, \\quad a_4=\\tfrac14, \\ \\ldots$$\natau didefinisikan secara **rekursif**, tiap suku dibangun dari suku sebelumnya, bukan langsung dari $n$ — $a_1=1$, $a_{n+1}=a_n+2n+1$ membangkitkan $1, 4, 9, 16, \\ldots$ (bilangan kuadrat sempurna, meski tak ada yang menyebut pengkuadratan sama sekali dalam definisinya). Keduanya tetap barisan; hanya yang kedua memerlukan setiap suku sebelumnya dihitung untuk mencapai suku berikutnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 7],
                ySpan: [-1.3, 1.3],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.7, to: 7, color: 'muted', dashed: true },
                  { t: 'curve', f: '-1/x', from: 0.7, to: 7, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: -1, color: 'b' },
                  { t: 'dot', x: 2, y: 0.5, color: 'b' },
                  { t: 'dot', x: 3, y: -0.333, color: 'b' },
                  { t: 'dot', x: 4, y: 0.25, color: 'b' },
                  { t: 'dot', x: 5, y: -0.2, color: 'b' },
                  { t: 'dot', x: 6, y: 0.167, color: 'b' },
                  { t: 'hline', y: 0, color: 'result', dashed: true },
                ],
                caption: {
                  en: 'Terms alternate above and below the axis, trapped between the envelopes $1/x$ and $-1/x$ (dashed) — squeezed tighter with every step, exactly the picture the next lesson makes precise.',
                  id: 'Suku-sukunya berganti-ganti di atas dan di bawah sumbu, terperangkap di antara amplop $1/x$ dan $-1/x$ (putus-putus) — terjepit makin ketat tiap langkah, persis gambaran yang dibuat presisi pada pelajaran berikutnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the domain of a sequence, formally?',
                id: 'Apa domain sebuah barisan, secara formal?',
              },
              options: [
                { en: 'The positive integers $1, 2, 3, \\ldots$', id: 'Bilangan bulat positif $1, 2, 3, \\ldots$' },
                { en: 'All real numbers', id: 'Semua bilangan real' },
                { en: 'Only the even integers', id: 'Hanya bilangan bulat genap' },
                { en: 'A sequence has no domain', id: 'Barisan tak punya domain' },
              ],
              answer: 0,
              explain: {
                en: 'A sequence is a function whose input is a positive integer $n$ (the index) and whose output is the term $a_n$ — its domain is exactly the counting numbers.',
                id: 'Barisan adalah fungsi yang masukannya bilangan bulat positif $n$ (indeksnya) dan keluarannya suku $a_n$ — domainnya persis bilangan cacah.',
              },
              hint: {
                en: 'Re-read the opening definition — a sequence was described as a function whose input is which kind of number?',
                id: 'Baca ulang definisi pembuka — barisan dideskripsikan sebagai fungsi yang masukannya jenis bilangan apa?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete $a_5$ for the sequence $a_n = \\dfrac{2n-1}{3n+2}$.',
                id: 'Lengkapi $a_5$ untuk barisan $a_n = \\dfrac{2n-1}{3n+2}$.',
              },
              template: 'a_5 = \\dfrac{2(5)-1}{3(5)+2} = ___',
              blanks: ['9/17'],
              explain: {
                en: 'Substituting $n=5$: numerator $2(5)-1=9$, denominator $3(5)+2=17$, giving $\\frac{9}{17}$.',
                id: 'Mensubstitusikan $n=5$: pembilang $2(5)-1=9$, penyebut $3(5)+2=17$, memberi $\\frac{9}{17}$.',
              },
              hint: {
                en: 'Substitute $n=5$ into both the numerator and the denominator separately before dividing.',
                id: 'Substitusikan $n=5$ ke pembilang dan penyebut secara terpisah sebelum membagi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For the recursive sequence $a_1 = 2$, $a_{n+1} = 3a_n - 1$, find $a_4$.',
                id: 'Untuk barisan rekursif $a_1 = 2$, $a_{n+1} = 3a_n - 1$, cari $a_4$.',
              },
              blanks: [{ answer: 41 }],
              hints: [
                { en: '$a_2=3(2)-1=5$, $a_3=3(5)-1=14$, then find $a_4$ the same way.', id: '$a_2=3(2)-1=5$, $a_3=3(5)-1=14$, lalu cari $a_4$ dengan cara yang sama.' },
              ],
              explain: {
                en: '$a_2=5$, $a_3=14$, $a_4=3(14)-1=41$ — each term needs every earlier one, computed in order.',
                id: '$a_2=5$, $a_3=14$, $a_4=3(14)-1=41$ — tiap suku memerlukan semua suku sebelumnya, dihitung berurutan.',
              },
            },
          ],
        },
        {
          id: 'der-m1-s1-l2',
          title: { en: 'Limits of Sequences', id: 'Limit Barisan' },
          goal: {
            en: 'Determine whether a sequence converges, using the same limit laws, squeeze theorem, and growth-rate facts already proved for functions.',
            id: 'Menentukan apakah sebuah barisan konvergen, memakai hukum limit, teorema apit, dan fakta laju pertumbuhan yang sama yang sudah dibuktikan untuk fungsi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The same limit, one integer step at a time', id: 'Limit yang sama, selangkah demi selangkah bilangan bulat' },
              body: {
                en: 'A sequence $\\{a_n\\}$ **converges** to $L$ if $a_n$ gets arbitrarily close to $L$ as $n\\to\\infty$ — exactly the Limit course\'s definition of $\\lim_{x\\to\\infty}f(x)=L$, restricted to integer inputs. Every limit law from that course carries over unchanged: sums, products, and quotients of convergent sequences behave exactly as they did for functions. If $\\{a_n\\}$ has no such $L$, it **diverges**.\n\nOne extra tool is available whenever a sequence\'s formula is also a formula in a continuous variable: if $f(n)=a_n$ for a function $f$ with $\\lim_{x\\to\\infty}f(x)=L$, then $\\lim_{n\\to\\infty}a_n=L$ too — so $\\dfrac{\\ln n}{n}\\to 0$ follows immediately from the identical limit already computed for $\\dfrac{\\ln x}{x}$ in the Integrals and Transcendental Functions course, with L\'Hôpital\'s Rule doing the work there.',
                id: 'Sebuah barisan $\\{a_n\\}$ **konvergen** ke $L$ jika $a_n$ mendekati $L$ sedekat apa pun ketika $n\\to\\infty$ — persis definisi $\\lim_{x\\to\\infty}f(x)=L$ dari kursus Limit, dibatasi pada masukan bilangan bulat. Setiap hukum limit dari kursus itu berlaku tanpa berubah: jumlah, hasil kali, dan hasil bagi barisan yang konvergen berperilaku persis seperti pada fungsi. Jika $\\{a_n\\}$ tak punya $L$ semacam itu, ia **divergen**.\n\nSatu alat tambahan tersedia setiap kali rumus sebuah barisan juga rumus dalam peubah sinambung: jika $f(n)=a_n$ untuk suatu fungsi $f$ dengan $\\lim_{x\\to\\infty}f(x)=L$, maka $\\lim_{n\\to\\infty}a_n=L$ juga — sehingga $\\dfrac{\\ln n}{n}\\to 0$ langsung mengikuti dari limit identik yang sudah dihitung untuk $\\dfrac{\\ln x}{x}$ pada kursus Integral dan Fungsi Transenden, dengan Aturan L\'Hôpital yang mengerjakannya di sana.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 12],
                ySpan: [-0.1, 0.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)/x', from: 1, to: 12, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 0, color: 'a' },
                  { t: 'dot', x: 2, y: 0.347, color: 'a' },
                  { t: 'dot', x: 3, y: 0.366, color: 'a' },
                  { t: 'dot', x: 5, y: 0.322, color: 'a' },
                  { t: 'dot', x: 8, y: 0.26, color: 'a' },
                  { t: 'dot', x: 11, y: 0.218, color: 'a' },
                  { t: 'hline', y: 0, color: 'result', dashed: true },
                ],
                caption: {
                  en: 'The sequence $a_n=\\frac{\\ln n}{n}$ rises briefly, then heads to $0$ — inheriting the limit already proved for the continuous function $\\frac{\\ln x}{x}$ with no new work.',
                  id: 'Barisan $a_n=\\frac{\\ln n}{n}$ naik sebentar, lalu menuju $0$ — mewarisi limit yang sudah dibuktikan untuk fungsi sinambung $\\frac{\\ln x}{x}$ tanpa pekerjaan baru.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The Squeeze Theorem, for sequences', id: 'Teorema Apit, untuk barisan' },
              body: {
                en: 'The Squeeze Theorem from the Limit course carries over word for word: if $b_n\\leq a_n\\leq c_n$ for every $n$ past some point, and $b_n\\to L$ and $c_n\\to L$, then $a_n\\to L$ too. It is exactly the tool for a sequence with no algebraic limit law to apply directly — one whose sign keeps changing.\n\nFor $a_n=\\dfrac{\\sin n}{n}$: since $-1\\leq \\sin n\\leq 1$ for every $n$, dividing through by the positive $n$ gives\n$$-\\frac{1}{n} \\leq \\frac{\\sin n}{n} \\leq \\frac{1}{n}$$\nBoth outer sequences go to $0$, so by the Squeeze Theorem, $\\dfrac{\\sin n}{n}\\to 0$ — settled without ever needing to know exactly where $\\sin n$ lands for each $n$.',
                id: 'Teorema Apit dari kursus Limit berlaku persis kata demi kata: jika $b_n\\leq a_n\\leq c_n$ untuk setiap $n$ melewati suatu titik, dan $b_n\\to L$ serta $c_n\\to L$, maka $a_n\\to L$ juga. Inilah persis alat untuk barisan yang tak punya hukum limit aljabar yang bisa diterapkan langsung — yang tandanya terus berganti.\n\nUntuk $a_n=\\dfrac{\\sin n}{n}$: karena $-1\\leq \\sin n\\leq 1$ untuk setiap $n$, membagi dengan $n$ yang positif memberi\n$$-\\frac{1}{n} \\leq \\frac{\\sin n}{n} \\leq \\frac{1}{n}$$\nKedua barisan luarnya menuju $0$, sehingga menurut Teorema Apit, $\\dfrac{\\sin n}{n}\\to 0$ — tuntas tanpa pernah perlu tahu persis di mana $\\sin n$ mendarat untuk tiap $n$.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 15],
                ySpan: [-1.1, 1.1],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.7, to: 15, color: 'muted', dashed: true },
                  { t: 'curve', f: '-1/x', from: 0.7, to: 15, color: 'muted', dashed: true },
                  { t: 'curve', f: 'sin(x)/x', from: 0.5, to: 15, color: 'result' },
                ],
                caption: {
                  en: '$\\frac{\\sin n}{n}$ oscillates inside the shrinking envelope $\\pm\\frac{1}{n}$ — squeezed to $0$ exactly as the argument shows, with no need to track the wiggle itself.',
                  id: '$\\frac{\\sin n}{n}$ berosilasi di dalam amplop $\\pm\\frac{1}{n}$ yang menyusut — terjepit ke $0$ persis seperti yang ditunjukkan argumennya, tanpa perlu melacak liukannya sendiri.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why can the Squeeze Theorem determine $\\lim_{n\\to\\infty}\\frac{\\sin n}{n} = 0$ without knowing the exact value of $\\sin n$ for each n?',
                id: 'Mengapa Teorema Apit bisa menentukan $\\lim_{n\\to\\infty}\\frac{\\sin n}{n} = 0$ tanpa tahu nilai persis $\\sin n$ untuk tiap n?',
              },
              options: [
                { en: 'Both bounding sequences $\\pm 1/n$ converge to the same limit, trapping the sequence between them regardless of its exact wiggle', id: 'Kedua barisan pembatas $\\pm 1/n$ konvergen ke limit yang sama, menjepit barisannya di antara keduanya tak peduli liukan persisnya' },
                { en: '$\\sin n$ is actually always equal to zero', id: '$\\sin n$ sebenarnya selalu sama dengan nol' },
                { en: 'The Squeeze Theorem only works for sequences that never change sign', id: 'Teorema Apit hanya berlaku untuk barisan yang tak pernah berganti tanda' },
                { en: 'It cannot actually be determined this way', id: 'Sebenarnya tak bisa ditentukan dengan cara ini' },
              ],
              answer: 0,
              explain: {
                en: 'The Squeeze Theorem needs only the two bounding sequences to share a limit — it never needs to know exactly where the trapped sequence sits between them at each step.',
                id: 'Teorema Apit hanya perlu kedua barisan pembatas berbagi satu limit — ia tak pernah perlu tahu persis di mana barisan yang terjepit itu duduk di antara keduanya pada tiap langkah.',
              },
              hint: {
                en: 'Recall exactly what the Squeeze Theorem requires from the Limit course — does it ever ask for the trapped sequence\'s exact values, or only for the two outer ones?',
                id: 'Ingat kembali persis apa yang dituntut Teorema Apit dari kursus Limit — apakah ia pernah meminta nilai persis barisan yang terjepit, atau hanya kedua barisan luarnya?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that find $\\lim_{n\\to\\infty}\\dfrac{n}{e^n}$.',
                id: 'Susun langkah yang mencari $\\lim_{n\\to\\infty}\\dfrac{n}{e^n}$.',
              },
              lines: [
                '\\text{Treat } n \\text{ as a continuous variable } x: \\ \\lim_{x\\to\\infty}\\dfrac{x}{e^x}',
                '= \\lim_{x\\to\\infty}\\dfrac{1}{e^x} \\quad (\\text{L\'Hôpital}, \\ \\infty/\\infty)',
                '= 0',
              ],
              explain: {
                en: 'First swap in the continuous variable so L\'Hôpital can even be applied, then differentiate top and bottom, then read off the limit.',
                id: 'Pertama gantikan dengan peubah sinambung agar L\'Hôpital bisa diterapkan, lalu turunkan atas dan bawah, lalu baca limitnya.',
              },
              hint: {
                en: "L'Hôpital's Rule differentiates with respect to a continuous variable — it cannot be applied directly to n until that substitution is made first.",
                id: "Aturan L'Hôpital menurunkan terhadap peubah sinambung — ia tak bisa diterapkan langsung pada n sebelum substitusi itu dibuat lebih dahulu.",
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find $L = \\lim_{n\\to\\infty}\\dfrac{3n^2+1}{5n^2-2n}$.',
                id: 'Cari $L = \\lim_{n\\to\\infty}\\dfrac{3n^2+1}{5n^2-2n}$.',
              },
              blanks: [{ answer: 0.6 }],
              hints: [
                { en: 'Divide every term by $n^2$, the highest power present — the same trick from the Integrals and Transcendental Functions course.', id: 'Bagi tiap suku dengan $n^2$, pangkat tertinggi yang ada — trik yang sama dari kursus Integral dan Fungsi Transenden.' },
              ],
              explain: {
                en: 'Dividing every term by $n^2$: $\\dfrac{3+1/n^2}{5-2/n}\\to\\dfrac{3}{5}=0.6$.',
                id: 'Membagi tiap suku dengan $n^2$: $\\dfrac{3+1/n^2}{5-2/n}\\to\\dfrac{3}{5}=0{,}6$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m1-s1-p',
        runtime: 'math',
        title: { en: 'Sequences and Their Limits', id: 'Barisan dan Limitnya' },
        brief: {
          en: 'Evaluating specific terms, then determining whether three sequences converge.',
          id: 'Menghitung suku tertentu, lalu menentukan apakah tiga barisan konvergen.',
        },
        requirements: [
          { en: 'A recursive sequence needs every earlier term computed in order.', id: 'Barisan rekursif memerlukan setiap suku sebelumnya dihitung secara berurutan.' },
          { en: 'The Squeeze Theorem and known growth-rate limits both carry over unchanged from functions to sequences.', id: 'Teorema Apit dan limit laju pertumbuhan yang sudah diketahui keduanya berlaku tanpa berubah dari fungsi ke barisan.' },
        ],
        tasks: [
          {
            prompt: { en: 'For $a_1=3$, $a_{n+1}=2a_n+1$, find $a_4$.', id: 'Untuk $a_1=3$, $a_{n+1}=2a_n+1$, cari $a_4$.' },
            blanks: [{ answer: 31 }],
            solution: ['a_2=2(3)+1=7, \\ a_3=2(7)+1=15, \\ a_4=2(15)+1=31'],
          },
          {
            prompt: { en: 'Find $L = \\lim_{n\\to\\infty}\\dfrac{\\cos n}{n^2}$.', id: 'Cari $L = \\lim_{n\\to\\infty}\\dfrac{\\cos n}{n^2}$.' },
            blanks: [{ answer: 0 }],
            solution: ['-\\tfrac{1}{n^2}\\leq\\tfrac{\\cos n}{n^2}\\leq\\tfrac{1}{n^2}, \\text{ kedua ruas} \\to 0 \\Rightarrow L=0 \\text{ (Teorema Apit)}'],
          },
          {
            prompt: { en: 'Find $L = \\lim_{n\\to\\infty}\\dfrac{n^2}{e^n}$.', id: 'Cari $L = \\lim_{n\\to\\infty}\\dfrac{n^2}{e^n}$.' },
            blanks: [{ answer: 0 }],
            solution: ["\\text{L'Hôpital dua kali (peubah sinambung): } \\dfrac{2x}{e^x}\\to\\dfrac{2}{e^x}\\to 0"],
          },
        ],
        hints: [
          { en: 'A cosine or sine in the numerator, with nothing else known about it, is almost always a Squeeze Theorem setup.', id: 'Cosinus atau sinus di pembilang, tanpa hal lain yang diketahui tentangnya, hampir selalu adalah penyusunan Teorema Apit.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------------------- 9.2 infinite series */
    {
      id: 'der-m1-s2',
      title: { en: 'Infinite Series', id: 'Deret Tak Hingga' },
      summary: {
        en: 'Summing infinitely many terms by taking a limit of partial sums, the geometric series formula, and the first two tests a series must pass before anything fancier is tried.',
        id: 'Menjumlahkan tak hingga banyak suku dengan mengambil limit jumlah parsial, rumus deret geometri, dan dua uji pertama yang harus dilewati sebuah deret sebelum yang lebih rumit dicoba.',
      },
      lessons: [
        {
          id: 'der-m1-s2-l1',
          title: { en: 'Partial Sums and the Geometric Series', id: 'Jumlah Parsial dan Deret Geometri' },
          goal: {
            en: 'Define the sum of an infinite series as the limit of its partial sums, and derive the geometric series formula.',
            id: 'Mendefinisikan jumlah deret tak hingga sebagai limit jumlah parsialnya, dan menurunkan rumus deret geometri.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A running total, then a limit', id: 'Total yang berjalan, lalu sebuah limit' },
              body: {
                en: 'Given a sequence $\\{a_n\\}$, its **infinite series** is the formal sum $\\sum_{n=1}^{\\infty} a_n = a_1+a_2+a_3+\\cdots$. Adding infinitely many numbers has no direct meaning, so it is defined through a new sequence, the **partial sums**: $S_n = a_1+a_2+\\cdots+a_n$. The series **converges** to $S$ if $\\lim_{n\\to\\infty} S_n = S$, and $S$ is called its **sum**; otherwise the series **diverges**. This is exactly a sequence limit, from the previous lesson, applied to a sequence built by accumulation rather than given directly.',
                id: 'Diberikan sebuah barisan $\\{a_n\\}$, **deret tak hingganya** adalah jumlah formal $\\sum_{n=1}^{\\infty} a_n = a_1+a_2+a_3+\\cdots$. Menjumlahkan tak hingga banyak bilangan tak punya makna langsung, sehingga ia didefinisikan lewat barisan baru, **jumlah parsial**: $S_n = a_1+a_2+\\cdots+a_n$. Deretnya **konvergen** ke $S$ jika $\\lim_{n\\to\\infty} S_n = S$, dan $S$ disebut **jumlahnya**; jika tidak, deretnya **divergen**. Ini persis limit barisan dari pelajaran sebelumnya, diterapkan pada barisan yang dibangun dengan akumulasi, bukan diberikan langsung.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 9],
                ySpan: [-0.3, 7],
                ticks: true,
                items: [
                  { t: 'curve', f: '6*(1-0.5^x)', from: 0, to: 8, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 3, color: 'a' },
                  { t: 'dot', x: 2, y: 4.5, color: 'a' },
                  { t: 'dot', x: 3, y: 5.25, color: 'a' },
                  { t: 'dot', x: 4, y: 5.625, color: 'a' },
                  { t: 'dot', x: 5, y: 5.8125, color: 'a' },
                  { t: 'hline', y: 6, color: 'result', dashed: true },
                ],
                caption: {
                  en: 'Partial sums $S_n$ of $3+1.5+0.75+\\cdots$ climb toward $6$ — the series\' sum is defined as exactly this limit, not the impossible idea of adding infinitely many terms one by one.',
                  id: 'Jumlah parsial $S_n$ dari $3+1.5+0.75+\\cdots$ naik menuju $6$ — jumlah deretnya didefinisikan persis sebagai limit ini, bukan gagasan mustahil menjumlahkan tak hingga suku satu per satu.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The one series summed in closed form: geometric', id: 'Satu-satunya deret yang dijumlahkan dalam bentuk tertutup: geometri' },
              body: {
                en: 'A **geometric series** $\\sum_{n=0}^{\\infty} ar^n = a+ar+ar^2+\\cdots$ has a partial sum with a closed form, found by the classic trick of subtracting a shifted copy: $S_n=a\\dfrac{1-r^n}{1-r}$ for $r\\neq 1$. If $|r|<1$, then $r^n\\to 0$, so\n$$\\sum_{n=0}^{\\infty} ar^n = \\lim_{n\\to\\infty} S_n = \\frac{a}{1-r}$$\nIf $|r|\\geq 1$, $r^n$ does not go to $0$ and the series diverges. For $3+1.5+0.75+\\cdots$ ($a=3$, $r=\\tfrac12$): $\\dfrac{3}{1-\\frac12}=6$ — exactly the limit the figure above already showed the partial sums climbing toward.\n\nA repeating decimal is secretly this same series: $0.333\\ldots = \\dfrac{3}{10}+\\dfrac{3}{100}+\\cdots$, geometric with $a=0.3$, $r=0.1$, summing to $\\dfrac{0.3}{0.9}=\\dfrac13$ — the fraction it was always equal to.',
                id: 'Sebuah **deret geometri** $\\sum_{n=0}^{\\infty} ar^n = a+ar+ar^2+\\cdots$ punya jumlah parsial dengan bentuk tertutup, ditemukan dengan trik klasik mengurangkan salinan yang digeser: $S_n=a\\dfrac{1-r^n}{1-r}$ untuk $r\\neq 1$. Jika $|r|<1$, maka $r^n\\to 0$, sehingga\n$$\\sum_{n=0}^{\\infty} ar^n = \\lim_{n\\to\\infty} S_n = \\frac{a}{1-r}$$\nJika $|r|\\geq 1$, $r^n$ tak menuju $0$ dan deretnya divergen. Untuk $3+1.5+0.75+\\cdots$ ($a=3$, $r=\\tfrac12$): $\\dfrac{3}{1-\\frac12}=6$ — persis limit yang sudah ditunjukkan jumlah parsialnya naik menuju pada gambar di atas.\n\nSebuah desimal berulang diam-diam adalah deret ini juga: $0.333\\ldots = \\dfrac{3}{10}+\\dfrac{3}{100}+\\cdots$, geometri dengan $a=0.3$, $r=0.1$, berjumlah $\\dfrac{0.3}{0.9}=\\dfrac13$ — pecahan yang selalu sama dengannya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1.5, 1.5],
                ySpan: [-1, 12],
                ticks: true,
                params: [{ name: 'r', min: -0.95, max: 0.95, step: 0.05, value: 0.5, label: 'r' }],
                items: [
                  { t: 'curve', f: '1/(1-r)', from: -1.4, to: 1.4, color: 'muted', dashed: true },
                  { t: 'dot', x: 'r', y: '1/(1-r)', color: 'result' },
                ],
                caption: {
                  en: 'Drag $r$: the sum of $\\sum r^n$ (with $a=1$) blows up as $r\\to 1^-$ and again as $r\\to -1^+$ — the series only converges strictly inside $-1<r<1$, exactly where $1/(1-r)$ stays finite.',
                  id: 'Geser $r$: jumlah $\\sum r^n$ (dengan $a=1$) meledak ketika $r\\to 1^-$ dan lagi ketika $r\\to -1^+$ — deretnya hanya konvergen strict di dalam $-1<r<1$, persis tempat $1/(1-r)$ tetap hingga.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For which values of $r$ does the geometric series $\\sum ar^n$ converge?',
                id: 'Untuk nilai $r$ mana deret geometri $\\sum ar^n$ konvergen?',
              },
              options: [
                { en: '$-1 < r < 1$', id: '$-1 < r < 1$' },
                { en: 'Every real number $r$', id: 'Setiap bilangan real $r$' },
                { en: 'Only $r > 0$', id: 'Hanya $r > 0$' },
                { en: 'Only $r = 1$', id: 'Hanya $r = 1$' },
              ],
              answer: 0,
              explain: {
                en: 'Convergence needs $r^n\\to 0$, which happens exactly when $|r|<1$ — outside that range $r^n$ either blows up or fails to settle.',
                id: 'Konvergensi memerlukan $r^n\\to 0$, yang terjadi persis ketika $|r|<1$ — di luar rentang itu $r^n$ meledak atau gagal menetap.',
              },
              hint: {
                en: 'The partial sum formula $S_n=a\\frac{1-r^n}{1-r}$ has a limit exactly when $r^n$ itself has a limit of $0$ — for which $r$ does that happen?',
                id: 'Rumus jumlah parsial $S_n=a\\frac{1-r^n}{1-r}$ punya limit persis ketika $r^n$ sendiri punya limit $0$ — untuk $r$ mana itu terjadi?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the sum of $2 + 1 + \\dfrac12 + \\dfrac14 + \\cdots$ using the geometric series formula.',
                id: 'Lengkapi jumlah $2 + 1 + \\dfrac12 + \\dfrac14 + \\cdots$ memakai rumus deret geometri.',
              },
              template: '\\dfrac{a}{1-r} = \\dfrac{2}{1-\\frac12} = ___',
              blanks: ['4'],
              explain: {
                en: 'With $a=2$ and $r=\\frac12$: $\\dfrac{2}{1/2}=4$.',
                id: 'Dengan $a=2$ dan $r=\\frac12$: $\\dfrac{2}{1/2}=4$.',
              },
              hint: {
                en: 'Simplify the denominator $1-\\frac12$ first, then divide $2$ by the result.',
                id: 'Sederhanakan penyebut $1-\\frac12$ lebih dahulu, lalu bagi $2$ dengan hasilnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Write $0.7222\\ldots = 0.7\\overline{2}$ as a fraction by summing $0.02+0.002+0.0002+\\cdots$ as a geometric series and adding it to $0.7$.',
                id: 'Tuliskan $0.7222\\ldots = 0.7\\overline{2}$ sebagai pecahan dengan menjumlahkan $0.02+0.002+0.0002+\\cdots$ sebagai deret geometri dan menambahkannya ke $0.7$.',
              },
              blanks: [{ answer: 13 / 18, tol: 0.0005 }],
              hints: [
                { en: 'The repeating part is geometric with $a=0.02$, $r=0.1$, summing to $0.02/0.9$.', id: 'Bagian berulangnya geometri dengan $a=0.02$, $r=0.1$, berjumlah $0.02/0.9$.' },
              ],
              explain: {
                en: '$\\frac{0.02}{0.9}=\\frac{1}{45}$, plus $0.7=\\frac{7}{10}$: $\\frac{7}{10}+\\frac{1}{45} = \\frac{63}{90}+\\frac{2}{90}=\\frac{65}{90}=\\frac{13}{18}\\approx 0.7222$.',
                id: '$\\frac{0.02}{0.9}=\\frac{1}{45}$, ditambah $0.7=\\frac{7}{10}$: $\\frac{7}{10}+\\frac{1}{45} = \\frac{63}{90}+\\frac{2}{90}=\\frac{65}{90}=\\frac{13}{18}\\approx 0{,}7222$.',
              },
            },
          ],
        },
        {
          id: 'der-m1-s2-l2',
          title: { en: 'The nth-Term Test and Telescoping Series', id: 'Uji Suku ke-n dan Deret Teleskopik' },
          goal: {
            en: 'Apply the nth-Term Test for divergence, and sum a telescoping series by watching interior terms cancel.',
            id: 'Menerapkan Uji Suku ke-n untuk divergensi, dan menjumlahkan deret teleskopik dengan mengamati suku-suku dalam saling meniadakan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A quick way to rule a series out', id: 'Cara cepat menyingkirkan sebuah deret' },
              body: {
                en: 'If $\\sum a_n$ converges to $S$, then $a_n = S_n - S_{n-1} \\to S-S=0$ — the terms themselves must shrink to zero. Contrapositive, this is the **nth-Term Test for Divergence**: if $\\lim_{n\\to\\infty} a_n \\neq 0$ (or does not exist), $\\sum a_n$ **diverges**. For $\\sum \\dfrac{n}{n+1}$: the terms approach $1$, not $0$, so the series diverges immediately — no partial sum formula needed.\n\n**The test only ever rules a series out — it never confirms convergence.** $a_n\\to 0$ is necessary, not sufficient; the next lesson\'s harmonic series is the standing counterexample.',
                id: 'Jika $\\sum a_n$ konvergen ke $S$, maka $a_n = S_n - S_{n-1} \\to S-S=0$ — suku-sukunya sendiri harus menyusut ke nol. Kontraposisinya, inilah **Uji Suku ke-n untuk Divergensi**: jika $\\lim_{n\\to\\infty} a_n \\neq 0$ (atau tak ada), $\\sum a_n$ **divergen**. Untuk $\\sum \\dfrac{n}{n+1}$: suku-sukunya mendekati $1$, bukan $0$, sehingga deretnya langsung divergen — tak perlu rumus jumlah parsial.\n\n**Ujinya hanya pernah menyingkirkan sebuah deret — tak pernah mengonfirmasi konvergensi.** $a_n\\to 0$ perlu, tetapi tak cukup; deret harmonik pelajaran berikutnya adalah kontoh penyangkalnya yang baku.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 10],
                ySpan: [-0.1, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x/(x+1)', from: 0.3, to: 10, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 0.5, color: 'a' },
                  { t: 'dot', x: 2, y: 0.667, color: 'a' },
                  { t: 'dot', x: 4, y: 0.8, color: 'a' },
                  { t: 'dot', x: 7, y: 0.875, color: 'a' },
                  { t: 'hline', y: 1, color: 'result', dashed: true },
                ],
                caption: {
                  en: 'The terms of $\\sum \\frac{n}{n+1}$ head to $1$, not $0$ — every one of them, from some point on, adds nearly a whole unit to the running total, which can only diverge.',
                  id: 'Suku-suku $\\sum \\frac{n}{n+1}$ menuju $1$, bukan $0$ — tiap suku, mulai dari suatu titik, menambahkan hampir satu unit penuh ke total yang berjalan, yang hanya bisa divergen.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A sum where almost everything cancels', id: 'Jumlah tempat hampir segalanya saling meniadakan' },
              body: {
                en: 'A **telescoping series** collapses through cancellation. Partial fractions splits $\\dfrac{1}{n(n+1)} = \\dfrac{1}{n}-\\dfrac{1}{n+1}$ (the same decomposition from the Techniques of Integration course), so\n$$S_n = \\left(1-\\tfrac12\\right)+\\left(\\tfrac12-\\tfrac13\\right)+\\cdots+\\left(\\tfrac1n-\\tfrac{1}{n+1}\\right) = 1-\\frac{1}{n+1}$$\nevery interior term cancels the one before it, leaving only the very first and the very last piece. Taking the limit: $S_n \\to 1-0=1$, so $\\sum_{n=1}^\\infty \\dfrac{1}{n(n+1)} = 1$ — an exact sum, found without ever invoking the geometric series formula.',
                id: 'Sebuah **deret teleskopik** runtuh lewat peniadaan. Pecahan parsial memecah $\\dfrac{1}{n(n+1)} = \\dfrac{1}{n}-\\dfrac{1}{n+1}$ (dekomposisi yang sama dari kursus Teknik Pengintegralan), sehingga\n$$S_n = \\left(1-\\tfrac12\\right)+\\left(\\tfrac12-\\tfrac13\\right)+\\cdots+\\left(\\tfrac1n-\\tfrac{1}{n+1}\\right) = 1-\\frac{1}{n+1}$$\nsetiap suku dalam meniadakan suku sebelumnya, menyisakan hanya potongan paling awal dan paling akhir. Mengambil limitnya: $S_n \\to 1-0=1$, sehingga $\\sum_{n=1}^\\infty \\dfrac{1}{n(n+1)} = 1$ — jumlah eksak, ditemukan tanpa pernah memanggil rumus deret geometri.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 10],
                ySpan: [-0.1, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: '1-1/(x+1)', from: 0, to: 10, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 0.5, color: 'a' },
                  { t: 'dot', x: 2, y: 0.667, color: 'a' },
                  { t: 'dot', x: 3, y: 0.75, color: 'a' },
                  { t: 'dot', x: 5, y: 0.833, color: 'a' },
                  { t: 'dot', x: 8, y: 0.889, color: 'a' },
                  { t: 'hline', y: 1, color: 'result', dashed: true },
                ],
                caption: {
                  en: 'Partial sums $S_n=1-\\frac{1}{n+1}$ of the telescoping series climb toward $1$ — the closed form falls straight out of the cancellation, with no separate limit computation needed.',
                  id: 'Jumlah parsial $S_n=1-\\frac{1}{n+1}$ dari deret teleskopik naik menuju $1$ — bentuk tertutupnya langsung jatuh dari peniadaannya, tanpa perlu penghitungan limit terpisah.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A sequence $a_n \\to 0$. What can be concluded about $\\sum a_n$?',
                id: 'Sebuah barisan $a_n \\to 0$. Apa yang bisa disimpulkan tentang $\\sum a_n$?',
              },
              options: [
                { en: 'Nothing yet — $a_n \\to 0$ is necessary for convergence but not sufficient', id: 'Belum ada — $a_n \\to 0$ perlu untuk konvergensi tetapi tak cukup' },
                { en: 'The series must converge', id: 'Deretnya pasti konvergen' },
                { en: 'The series must diverge', id: 'Deretnya pasti divergen' },
                { en: 'The series equals exactly $0$', id: 'Deretnya sama dengan tepat $0$' },
              ],
              answer: 0,
              explain: {
                en: 'The nth-Term Test only rules a series out when the terms do *not* go to zero — when they do, the test is silent, and a separate argument (the next lesson\'s Integral Test, among others) is needed.',
                id: 'Uji Suku ke-n hanya menyingkirkan sebuah deret ketika sukunya *tidak* menuju nol — ketika sukunya menuju nol, ujinya diam, dan argumen terpisah (Uji Integral pelajaran berikutnya, di antara yang lain) diperlukan.',
              },
              hint: {
                en: 'The nth-Term Test was built as a contrapositive — re-read exactly which direction it proves, and which direction it stays silent on.',
                id: 'Uji Suku ke-n dibangun sebagai kontraposisi — baca ulang persis arah mana yang dibuktikannya, dan arah mana yang ia diamkan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that sum the telescoping series $\\sum_{n=1}^{\\infty}\\left(\\dfrac{1}{n}-\\dfrac{1}{n+2}\\right)$.',
                id: 'Susun langkah yang menjumlahkan deret teleskopik $\\sum_{n=1}^{\\infty}\\left(\\dfrac{1}{n}-\\dfrac{1}{n+2}\\right)$.',
              },
              lines: [
                'S_n = \\left(1+\\tfrac12-\\tfrac1{n+1}-\\tfrac1{n+2}\\right) \\quad (\\text{two terms survive the gap of 2})',
                '\\lim_{n\\to\\infty}\\tfrac1{n+1}=0, \\quad \\lim_{n\\to\\infty}\\tfrac1{n+2}=0',
                'S = 1+\\tfrac12-0-0 = \\tfrac32',
              ],
              explain: {
                en: 'First identify which terms survive the cancellation (a gap of 2 leaves two terms at each end, not one), then take the limit of the vanishing terms, then combine everything into the final sum.',
                id: 'Pertama kenali suku mana yang bertahan dari peniadaan (celah 2 menyisakan dua suku di tiap ujung, bukan satu), lalu ambil limit suku yang lenyap, lalu gabungkan semuanya menjadi jumlah akhir.',
              },
              hint: {
                en: 'With a gap of 2 between the two fractions in each term, cancellation leaves two surviving terms at the start, not just one — work out which terms those are before taking any limit.',
                id: 'Dengan celah 2 di antara kedua pecahan pada tiap suku, peniadaan menyisakan dua suku yang bertahan di awal, bukan hanya satu — cari tahu suku mana itu sebelum mengambil limit apa pun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Sum $\\sum_{n=1}^{\\infty}\\left(\\dfrac{1}{n+1}-\\dfrac{1}{n+2}\\right)$.',
                id: 'Jumlahkan $\\sum_{n=1}^{\\infty}\\left(\\dfrac{1}{n+1}-\\dfrac{1}{n+2}\\right)$.',
              },
              blanks: [{ answer: 0.5 }],
              hints: [
                { en: '$S_n = \\dfrac{1}{2}-\\dfrac{1}{n+2}$ — only the very first piece survives as $n\\to\\infty$.', id: '$S_n = \\dfrac{1}{2}-\\dfrac{1}{n+2}$ — hanya potongan paling awal yang bertahan ketika $n\\to\\infty$.' },
              ],
              explain: {
                en: 'Every interior term cancels, leaving $S_n=\\frac12-\\frac{1}{n+2}\\to\\frac12-0=\\frac12$.',
                id: 'Setiap suku dalam saling meniadakan, menyisakan $S_n=\\frac12-\\frac{1}{n+2}\\to\\frac12-0=\\frac12$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m1-s2-p',
        runtime: 'math',
        title: { en: 'Summing Series', id: 'Menjumlahkan Deret' },
        brief: {
          en: 'A geometric sum, an nth-Term Test verdict, and a telescoping sum.',
          id: 'Sebuah jumlah geometri, sebuah putusan Uji Suku ke-n, dan sebuah jumlah teleskopik.',
        },
        requirements: [
          { en: 'The geometric series $\\sum ar^n$ sums to $\\dfrac{a}{1-r}$ exactly when $|r|<1$.', id: 'Deret geometri $\\sum ar^n$ berjumlah $\\dfrac{a}{1-r}$ persis ketika $|r|<1$.' },
          { en: 'If the terms of a series do not go to $0$, the series diverges immediately.', id: 'Jika suku sebuah deret tak menuju $0$, deretnya langsung divergen.' },
        ],
        tasks: [
          {
            prompt: { en: 'Sum $4 - 2 + 1 - \\dfrac12 + \\cdots$.', id: 'Jumlahkan $4 - 2 + 1 - \\dfrac12 + \\cdots$.' },
            blanks: [{ answer: 8 / 3, tol: 0.01 }],
            solution: ['a=4, \\ r=-\\tfrac12, \\quad S=\\dfrac{4}{1-(-1/2)}=\\dfrac{4}{3/2}=\\dfrac83 \\approx 2{,}67'],
          },
          {
            prompt: { en: 'Does $\\sum_{n=1}^{\\infty} \\dfrac{2n+1}{n+3}$ converge or diverge? Type $1$ for converges, $0$ for diverges.', id: 'Apakah $\\sum_{n=1}^{\\infty} \\dfrac{2n+1}{n+3}$ konvergen atau divergen? Ketik $1$ untuk konvergen, $0$ untuk divergen.' },
            blanks: [{ answer: 0 }],
            solution: ['\\lim_{n\\to\\infty}\\dfrac{2n+1}{n+3} = 2 \\neq 0 \\Rightarrow \\text{divergen (Uji Suku ke-n)}'],
          },
          {
            prompt: { en: 'Sum $\\sum_{n=1}^{\\infty}\\left(\\dfrac{1}{n}-\\dfrac{1}{n+1}\\right)$.', id: 'Jumlahkan $\\sum_{n=1}^{\\infty}\\left(\\dfrac{1}{n}-\\dfrac{1}{n+1}\\right)$.' },
            blanks: [{ answer: 1 }],
            solution: ['S_n = 1-\\dfrac{1}{n+1} \\to 1'],
          },
        ],
        hints: [
          { en: 'Always try the nth-Term Test first — it is the cheapest check, even though it can only ever prove divergence.', id: 'Selalu coba Uji Suku ke-n lebih dahulu — inilah pemeriksaan termurah, meski hanya pernah bisa membuktikan divergensi.' },
        ],
        xp: 50,
      },
    },
  ],
}
