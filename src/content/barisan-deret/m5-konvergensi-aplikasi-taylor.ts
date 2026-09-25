import type { Module } from '../types'

/** Module 5 — closing the course by asking the question a Taylor series
 *  raises but never answers on its own (does it actually equal the function
 *  it was built from?), then spending that answer on the two things a power
 *  series is good for: approximating with a guaranteed error, and reaching
 *  integrals and limits nothing earlier in the track could touch directly. */
export const module5: Module = {
  id: 'der-m5',
  title: { en: 'Convergence and Applications of Taylor Series', id: 'Konvergensi dan Aplikasi Deret Taylor' },
  summary: {
    en: 'Why a Taylor series actually equals its function — and what that buys: guaranteed-accuracy approximation, integrals with no elementary antiderivative, and limits no earlier technique could reach.',
    id: 'Mengapa deret Taylor sungguh sama dengan fungsinya — dan apa yang dibeli fakta itu: hampiran dengan akurasi terjamin, integral tanpa antiturunan elementer, dan limit yang tak terjangkau teknik sebelumnya.',
  },
  submodules: [
    /* --------------------------------------------------- 9.9 convergence of taylor series */
    {
      id: 'der-m5-s1',
      title: { en: 'Convergence of Taylor Series', id: 'Konvergensi Deret Taylor' },
      summary: {
        en: 'Matching every derivative at one point is not automatically the same as equaling the function everywhere — Taylor\'s Theorem with a remainder term settles exactly when it does.',
        id: 'Mencocokkan setiap turunan di satu titik tak otomatis sama dengan menyamai fungsinya di mana-mana — Teorema Taylor dengan suku sisa menuntaskan persis kapan itu terjadi.',
      },
      lessons: [
        {
          id: 'der-m5-s1-l1',
          title: { en: "Taylor's Theorem and the Remainder", id: 'Teorema Taylor dan Suku Sisa' },
          goal: {
            en: 'State Taylor\'s Theorem with the Lagrange remainder, and see why a Taylor series equals its function exactly when the remainder vanishes.',
            id: 'Menyatakan Teorema Taylor dengan suku sisa Lagrange, dan melihat mengapa deret Taylor sama dengan fungsinya persis ketika suku sisanya lenyap.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Matching derivatives is not automatically matching values', id: 'Mencocokkan turunan tak otomatis mencocokkan nilai' },
              body: {
                en: 'Module 4 built series by matching derivatives at a single point $a$ — but a function sharing every derivative with its series **at $a$** is not automatically the same function **everywhere**. Writing $f(x) = P_n(x) + R_n(x)$, where $P_n$ is the degree-$n$ Taylor polynomial (the series truncated after $n$ terms) and $R_n$ is whatever is left over, **Taylor\'s Theorem** gives the leftover piece an exact form (the Lagrange remainder):\n$$R_n(x) = \\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$\nfor some $c$ strictly between $a$ and $x$ — the same existential $c$ the Mean Value Theorem produced in the Applications of Derivatives course, here promoted to an $(n+1)$th derivative. **The Taylor series converges to $f(x)$ exactly when $R_n(x)\\to 0$** as $n\\to\\infty$.',
                id: 'Modul 4 membangun deret dengan mencocokkan turunan di satu titik $a$ — tetapi fungsi yang berbagi setiap turunan dengan deretnya **di $a$** tak otomatis menjadi fungsi yang sama **di mana-mana**. Menuliskan $f(x) = P_n(x) + R_n(x)$, dengan $P_n$ polinom Taylor derajat-$n$ (deretnya dipotong setelah $n$ suku) dan $R_n$ apa pun yang tersisa, **Teorema Taylor** memberi bentuk eksak pada sisanya (suku sisa Lagrange):\n$$R_n(x) = \\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$\nuntuk suatu $c$ strict di antara $a$ dan $x$ — $c$ eksistensial yang sama yang dihasilkan Teorema Nilai Rata-rata pada kursus Aplikasi Turunan, di sini dinaikkan menjadi turunan ke-$(n+1)$. **Deret Taylor konvergen ke $f(x)$ persis ketika $R_n(x)\\to 0$** ketika $n\\to\\infty$.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-1, 2.5],
                ticks: true,
                params: [{ name: 'n', min: 1, max: 6, step: 1, value: 2, label: 'n' }],
                items: [
                  { t: 'curve', f: 'cos(x)', from: -4, to: 4, color: 'muted', dashed: true, label: 'cos x' },
                  { t: 'curve', f: '1-x^2/2', from: -2.6, to: 2.6, color: 'a', label: 'P₂' },
                ],
                caption: {
                  en: 'The gap between $\\cos x$ and its degree-2 Taylor polynomial $P_2$ is exactly $R_2(x)$ — visibly small near $0$, growing outward, and shrinking toward $0$ everywhere as more terms are added.',
                  id: 'Celah antara $\\cos x$ dan polinom Taylor derajat-2-nya $P_2$ persis $R_2(x)$ — tampak kecil di sekitar $0$, membesar ke luar, dan menyusut ke $0$ di mana-mana ketika lebih banyak suku ditambahkan.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The remainder shrinks to zero for e^x, everywhere', id: 'Suku sisanya menyusut ke nol untuk e^x, di mana-mana' },
              body: {
                en: 'For $f(x)=e^x$, every derivative is $e^x$ itself, bounded by $e^{|x|}$ on any interval containing $0$ and $x$. So\n$$|R_n(x)| \\leq \\frac{e^{|x|}}{(n+1)!}|x|^{n+1}$$\nFor any **fixed** $x$, $e^{|x|}$ is just a constant, and $\\dfrac{|x|^{n+1}}{(n+1)!}\\to 0$ as $n\\to\\infty$ — a fact already used implicitly in the Ratio Test of Module 4 ($n!$ eventually outgrows any fixed exponential base). So $R_n(x)\\to 0$ for **every** real $x$: the Maclaurin series for $e^x$ does not just share derivatives with $e^x$ at $0$, it genuinely **equals** $e^x$ everywhere — the fact silently relied on every time this course approximated $e^{0.5}$ or $e^{0.2}$ with a partial sum.',
                id: 'Untuk $f(x)=e^x$, setiap turunannya adalah $e^x$ itu sendiri, dibatasi oleh $e^{|x|}$ pada interval mana pun yang memuat $0$ dan $x$. Jadi\n$$|R_n(x)| \\leq \\frac{e^{|x|}}{(n+1)!}|x|^{n+1}$$\nUntuk $x$ **tetap** mana pun, $e^{|x|}$ hanyalah konstanta, dan $\\dfrac{|x|^{n+1}}{(n+1)!}\\to 0$ ketika $n\\to\\infty$ — fakta yang sudah dipakai secara diam-diam pada Uji Rasio Modul 4 ($n!$ akhirnya melampaui basis eksponen tetap mana pun). Jadi $R_n(x)\\to 0$ untuk **setiap** $x$ real: deret Maclaurin untuk $e^x$ tak hanya berbagi turunan dengan $e^x$ di $0$, ia sungguh **sama** dengan $e^x$ di mana-mana — fakta yang diam-diam disandari setiap kali kursus ini menghampiri $e^{0.5}$ atau $e^{0.2}$ dengan jumlah parsial.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 7.3],
                ySpan: [-1, 16],
                ticks: true,
                items: [
                  { t: 'dot', x: 0, y: 14.78, color: 'a' },
                  { t: 'dot', x: 1, y: 14.78, color: 'a' },
                  { t: 'dot', x: 2, y: 9.85, color: 'a' },
                  { t: 'dot', x: 3, y: 4.93, color: 'a' },
                  { t: 'dot', x: 4, y: 1.97, color: 'a' },
                  { t: 'dot', x: 5, y: 0.657, color: 'a' },
                  { t: 'dot', x: 6, y: 0.188, color: 'a' },
                  { t: 'dot', x: 7, y: 0.047, color: 'a' },
                  { t: 'hline', y: 0, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'For $x=2$ fixed, the remainder bound $\\frac{e^2\\cdot 2^{n+1}}{(n+1)!}$ (plotted at each $n$) holds steady, then collapses toward $0$ once the factorial in the denominator takes over — the same race the Relative Rates of Growth module already settled.',
                  id: 'Untuk $x=2$ tetap, batas suku sisa $\\frac{e^2\\cdot 2^{n+1}}{(n+1)!}$ (digambar di tiap $n$) bertahan datar, lalu runtuh menuju $0$ begitu faktorial di penyebut mengambil alih — perlombaan yang sama yang sudah dituntaskan modul Laju Pertumbuhan Relatif.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A Taylor series converges to its function f(x) exactly when what happens?',
                id: 'Deret Taylor konvergen ke fungsinya f(x) persis ketika apa yang terjadi?',
              },
              options: [
                { en: 'The remainder $R_n(x) \\to 0$ as $n \\to \\infty$', id: 'Suku sisa $R_n(x) \\to 0$ ketika $n \\to \\infty$' },
                { en: 'Every derivative of f is bounded', id: 'Setiap turunan f terbatas' },
                { en: 'It is automatic — every Taylor series equals its function everywhere', id: 'Otomatis — setiap deret Taylor sama dengan fungsinya di mana-mana' },
                { en: 'f must be a polynomial', id: 'f harus polinom' },
              ],
              answer: 0,
              explain: {
                en: 'Since $f(x)=P_n(x)+R_n(x)$ and $P_n(x)$ is the series\' own partial sum, the series converges to $f(x)$ precisely when the leftover piece $R_n(x)$ shrinks to $0$.',
                id: 'Karena $f(x)=P_n(x)+R_n(x)$ dan $P_n(x)$ adalah jumlah parsial deretnya sendiri, deretnya konvergen ke $f(x)$ persis ketika sisa $R_n(x)$ menyusut ke $0$.',
              },
              hint: {
                en: 'Re-read the bolded sentence right after the remainder formula is introduced.',
                id: 'Baca ulang kalimat tercetak tebal tepat setelah rumus suku sisanya diperkenalkan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the Lagrange remainder formula, centered at $a$.',
                id: 'Lengkapi rumus suku sisa Lagrange, berpusat di $a$.',
              },
              template: 'R_n(x) = \\dfrac{f^{(n+1)}(c)}{___}(x-a)^{n+1}',
              blanks: ['(n+1)!'],
              explain: {
                en: 'The denominator is $(n+1)!$ — one factorial higher than the $n!$ in the Taylor coefficient formula, matching the one extra derivative taken.',
                id: 'Penyebutnya $(n+1)!$ — satu faktorial lebih tinggi dari $n!$ pada rumus koefisien Taylor, cocok dengan satu turunan ekstra yang diambil.',
              },
              hint: {
                en: 'Compare this to the Taylor coefficient formula from Module 4 — the remainder uses one derivative order higher, so its factorial is one step higher too.',
                id: 'Bandingkan ini dengan rumus koefisien Taylor dari Modul 4 — suku sisanya memakai satu orde turunan lebih tinggi, sehingga faktorialnya pun satu langkah lebih tinggi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x)=e^x$ at $x=1$, bound $|R_3(1)|$ using $|f^{(4)}(c)|\\leq e^1$ for $c$ between $0$ and $1$. (Round to four decimal places.)',
                id: 'Untuk $f(x)=e^x$ di $x=1$, batasi $|R_3(1)|$ memakai $|f^{(4)}(c)|\\leq e^1$ untuk $c$ di antara $0$ dan $1$. (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: Math.E / 24, tol: 0.001 }],
              hints: [
                { en: '$|R_3(1)| \\leq \\dfrac{e}{4!}(1)^4 = \\dfrac{e}{24}$.', id: '$|R_3(1)| \\leq \\dfrac{e}{4!}(1)^4 = \\dfrac{e}{24}$.' },
              ],
              explain: {
                en: '$\\dfrac{e}{24}\\approx 0.1133$ — a small, guaranteed ceiling on the error of the degree-3 Taylor polynomial at $x=1$.',
                id: '$\\dfrac{e}{24}\\approx 0{,}1133$ — plafon kecil dan terjamin untuk galat polinom Taylor derajat-3 di $x=1$.',
              },
            },
          ],
        },
        {
          id: 'der-m5-s1-l2',
          title: { en: 'Bounding the Error of a Taylor Approximation', id: 'Membatasi Galat Hampiran Taylor' },
          goal: {
            en: 'Use the Lagrange remainder to bound the error of a Taylor polynomial approximation, and find how many terms guarantee a target accuracy.',
            id: 'Memakai suku sisa Lagrange untuk membatasi galat hampiran polinom Taylor, dan mencari berapa suku menjamin akurasi target.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A guaranteed ceiling, not just an observed error', id: 'Plafon terjamin, bukan sekadar galat teramati' },
              body: {
                en: 'The remainder bound is worth the most precisely when the true value is unknown — the entire reason for approximating in the first place. Bounding $\\sin x$\'s derivatives by $|f^{(n+1)}(c)|\\leq 1$ **always**, for **every** $n$ and $c$ (every derivative of $\\sin x$ is $\\pm\\sin$ or $\\pm\\cos$, each capped at $1$):\n$$|R_n(x)| \\leq \\frac{|x|^{n+1}}{(n+1)!}$$\nFor $x=1$, $n=4$ (approximating $\\sin(1)$ with the degree-4 polynomial, which for the odd series is really only 3 nonzero terms): $|R_4(1)| \\leq \\dfrac{1}{5!}=\\dfrac{1}{120}\\approx 0.0083$ — a guaranteed ceiling, found without ever knowing $\\sin(1)$\'s actual value.',
                id: 'Batas suku sisanya paling berharga justru ketika nilai sebenarnya tak diketahui — seluruh alasan menghampiri sejak awal. Membatasi turunan $\\sin x$ dengan $|f^{(n+1)}(c)|\\leq 1$ **selalu**, untuk **setiap** $n$ dan $c$ (setiap turunan $\\sin x$ adalah $\\pm\\sin$ atau $\\pm\\cos$, masing-masing dibatasi $1$):\n$$|R_n(x)| \\leq \\frac{|x|^{n+1}}{(n+1)!}$$\nUntuk $x=1$, $n=4$ (menghampiri $\\sin(1)$ dengan polinom derajat-4, yang untuk deret ganjilnya sebenarnya hanya 3 suku tak nol): $|R_4(1)| \\leq \\dfrac{1}{5!}=\\dfrac{1}{120}\\approx 0.0083$ — plafon terjamin, ditemukan tanpa pernah tahu nilai sebenarnya $\\sin(1)$.',
              },
              figure: {
                dim: 2,
                xSpan: [-3.2, 3.2],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)', from: -3.2, to: 3.2, color: 'muted', dashed: true, label: 'sin x' },
                  { t: 'curve', f: 'x-x^3/6+x^5/120', from: -2.8, to: 2.8, color: 'a', label: 'P₅' },
                ],
                caption: {
                  en: 'The degree-5 Taylor polynomial $P_5$ for $\\sin x$ — its worst-case error, bounded by $|x|^6/6!$, is exactly what the remainder formula guarantees without needing $\\sin x$\'s exact value anywhere.',
                  id: 'Polinom Taylor derajat-5 $P_5$ untuk $\\sin x$ — galat terburuknya, dibatasi oleh $|x|^6/6!$, persis apa yang dijamin rumus suku sisa tanpa perlu nilai eksak $\\sin x$ di mana pun.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Solving backward for a required degree', id: 'Menyelesaikan mundur untuk derajat yang diperlukan' },
              body: {
                en: 'Exactly like the Alternating Series Estimation Theorem in Module 3, the bound runs equally well in reverse: to guarantee $|R_n(1)|<0.0001$ for $\\sin(1)$, it suffices that $\\dfrac{1}{(n+1)!}<0.0001$, i.e. $(n+1)!>10000$. Since $7!=5040$ and $8!=40320$, the smallest working $n+1$ is $8$, so $n=7$ — using terms through the $x^7$ term guarantees four-decimal accuracy, without computing a single actual value of $\\sin x$ to check it against.',
                id: 'Persis seperti Teorema Taksiran Deret Berselang pada Modul 3, batasnya berjalan sama baiknya secara terbalik: untuk menjamin $|R_n(1)|<0.0001$ untuk $\\sin(1)$, cukup $\\dfrac{1}{(n+1)!}<0.0001$, yaitu $(n+1)!>10000$. Karena $7!=5040$ dan $8!=40320$, $n+1$ terkecil yang berhasil adalah $8$, sehingga $n=7$ — memakai suku sampai suku $x^7$ menjamin akurasi empat desimal, tanpa menghitung satu pun nilai sebenarnya $\\sin x$ untuk memeriksanya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 7.3],
                ySpan: [-0.05, 1.05],
                ticks: true,
                items: [
                  { t: 'dot', x: 0, y: 1, color: 'a' },
                  { t: 'dot', x: 1, y: 0.5, color: 'a' },
                  { t: 'dot', x: 2, y: 0.1667, color: 'a' },
                  { t: 'dot', x: 3, y: 0.0417, color: 'a' },
                  { t: 'dot', x: 4, y: 0.0083, color: 'a' },
                  { t: 'dot', x: 5, y: 0.0014, color: 'a' },
                  { t: 'dot', x: 6, y: 0.0002, color: 'a' },
                  { t: 'dot', x: 7, y: 0.00002, color: 'a' },
                  { t: 'hline', y: 0.0001, color: 'result', dashed: true, label: 'target' },
                ],
                caption: {
                  en: 'The required-degree computation solves for the smallest n where $1/(n+1)!$ (plotted at each n) first dives below the target — the same "solve for n" pattern used throughout this course\'s error bounds.',
                  id: 'Penghitungan derajat yang diperlukan menyelesaikan untuk n terkecil tempat $1/(n+1)!$ pertama kali menukik di bawah target — pola "selesaikan untuk n" yang sama yang dipakai di seluruh batas galat kursus ini.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why can every derivative of sin x be bounded by the same constant 1, for any n?',
                id: 'Mengapa setiap turunan sin x bisa dibatasi oleh konstanta yang sama 1, untuk n mana pun?',
              },
              options: [
                { en: 'Every derivative of sin x is $\\pm\\sin x$ or $\\pm\\cos x$, and both are always between $-1$ and $1$', id: 'Setiap turunan sin x adalah $\\pm\\sin x$ atau $\\pm\\cos x$, dan keduanya selalu di antara $-1$ dan $1$' },
                { en: 'sin x has only finitely many derivatives', id: 'sin x hanya punya turunan yang berhingga banyaknya' },
                { en: 'This is only true for the first derivative', id: 'Ini hanya benar untuk turunan pertama' },
                { en: 'It is not actually true', id: 'Ini sebenarnya tak benar' },
              ],
              answer: 0,
              explain: {
                en: 'The four-step derivative cycle from the Derivatives course cycles among $\\sin x, \\cos x, -\\sin x, -\\cos x$ forever — every single one bounded between $-1$ and $1$, so $1$ works as a bound at any order.',
                id: 'Siklus turunan empat langkah dari kursus Turunan berputar di antara $\\sin x, \\cos x, -\\sin x, -\\cos x$ selamanya — setiap satunya dibatasi antara $-1$ dan $1$, sehingga $1$ berhasil sebagai batas di orde mana pun.',
              },
              hint: {
                en: 'Recall the four-step cycle of sine\'s derivatives from the Derivatives course — what do all four functions in that cycle have in common about their range?',
                id: 'Ingat siklus empat langkah turunan sinus dari kursus Turunan — apa kesamaan keempat fungsi dalam siklus itu tentang rentang nilainya?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that find the smallest n guaranteeing $|R_n(1)|<0.001$ for cos(1).',
                id: 'Susun langkah yang mencari n terkecil yang menjamin $|R_n(1)|<0.001$ untuk cos(1).',
              },
              lines: [
                '|R_n(1)| \\leq \\dfrac{1}{(n+1)!} \\quad (\\text{every derivative of cos bounded by } 1)',
                '\\text{Need } (n+1)! > 1000',
                '6! = 720, \\ 7! = 5040 \\Rightarrow n+1 = 7 \\Rightarrow n = 6',
              ],
              explain: {
                en: 'Write the general bound first, then translate the target accuracy into a factorial inequality, then find the smallest factorial that actually clears it.',
                id: 'Tulis batas umumnya lebih dahulu, lalu terjemahkan akurasi target menjadi pertidaksamaan faktorial, lalu cari faktorial terkecil yang benar-benar melewatinya.',
              },
              hint: {
                en: 'The factorial inequality cannot be checked against specific values of n! until it has actually been written down as an inequality first.',
                id: 'Pertidaksamaan faktorialnya tak bisa diperiksa terhadap nilai n! tertentu sebelum benar-benar dituliskan sebagai pertidaksamaan lebih dahulu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $e^x$ at $x=1$, bound $|R_2(1)|$ using $|f^{(3)}(c)|\\leq e$ for $c$ between $0$ and $1$. (Round to four decimal places.)',
                id: 'Untuk $e^x$ di $x=1$, batasi $|R_2(1)|$ memakai $|f^{(3)}(c)|\\leq e$ untuk $c$ di antara $0$ dan $1$. (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: Math.E / 6, tol: 0.001 }],
              hints: [
                { en: '$|R_2(1)| \\leq \\dfrac{e}{3!}(1)^3 = \\dfrac{e}{6}$.', id: '$|R_2(1)| \\leq \\dfrac{e}{3!}(1)^3 = \\dfrac{e}{6}$.' },
              ],
              explain: {
                en: '$\\dfrac{e}{6}\\approx 0.4530$.',
                id: '$\\dfrac{e}{6}\\approx 0{,}4530$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m5-s1-p',
        runtime: 'math',
        title: { en: 'Bounding Taylor Approximation Error', id: 'Membatasi Galat Hampiran Taylor' },
        brief: {
          en: 'Two remainder bounds, and one required-degree computation.',
          id: 'Dua batas suku sisa, dan satu penghitungan derajat yang diperlukan.',
        },
        requirements: [
          { en: 'The Lagrange remainder is $R_n(x) = \\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ for some c between a and x.', id: 'Suku sisa Lagrange adalah $R_n(x) = \\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ untuk suatu c di antara a dan x.' },
          { en: 'A Taylor series equals its function exactly when $R_n(x)\\to 0$.', id: 'Deret Taylor sama dengan fungsinya persis ketika $R_n(x)\\to 0$.' },
        ],
        tasks: [
          {
            prompt: { en: 'For $\\cos x$ at $x=0.5$, bound $|R_3(0.5)|$ using $|f^{(4)}(c)|\\leq 1$. (Round to four decimal places.)', id: 'Untuk $\\cos x$ di $x=0.5$, batasi $|R_3(0.5)|$ memakai $|f^{(4)}(c)|\\leq 1$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 0.5 ** 4 / 24, tol: 0.0005 }],
            solution: ['|R_3(0.5)| \\leq \\dfrac{0.5^4}{4!} = \\dfrac{0.0625}{24} \\approx 0{,}0026'],
          },
          {
            prompt: { en: 'For $\\sin x$ at $x=2$, bound $|R_5(2)|$ using $|f^{(6)}(c)|\\leq 1$. (Round to four decimal places.)', id: 'Untuk $\\sin x$ di $x=2$, batasi $|R_5(2)|$ memakai $|f^{(6)}(c)|\\leq 1$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 2 ** 6 / 720, tol: 0.001 }],
            solution: ['|R_5(2)| \\leq \\dfrac{2^6}{6!} = \\dfrac{64}{720} \\approx 0{,}0889'],
          },
          {
            prompt: { en: 'Find the smallest n guaranteeing $|R_n(1)| < 0.0001$ for $e^x$ at $x=1$, using $|f^{(n+1)}(c)|\\leq e \\approx 2.72$.', id: 'Cari n terkecil yang menjamin $|R_n(1)| < 0.0001$ untuk $e^x$ di $x=1$, memakai $|f^{(n+1)}(c)|\\leq e \\approx 2.72$.' },
            blanks: [{ answer: 7 }],
            solution: ['\\dfrac{2{,}72}{(n+1)!}<0.0001 \\Rightarrow (n+1)!>27200; \\ 7!=5040, \\ 8!=40320 \\Rightarrow n+1=8 \\Rightarrow n=7'],
          },
        ],
        hints: [
          { en: 'Every step here follows the same recipe: bound the (n+1)th derivative, plug into the remainder formula, then solve for whatever is asked.', id: 'Tiap langkah di sini mengikuti resep yang sama: batasi turunan ke-(n+1), masukkan ke rumus suku sisa, lalu selesaikan apa pun yang ditanyakan.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------- 9.10 applications of taylor series */
    {
      id: 'der-m5-s2',
      title: { en: 'Applications of Taylor Series', id: 'Aplikasi Deret Taylor' },
      summary: {
        en: 'Spending every tool this course built on two problems nothing earlier could solve directly: integrating a function with no elementary antiderivative, and evaluating a limit no algebra could simplify.',
        id: 'Membelanjakan setiap alat yang dibangun kursus ini pada dua soal yang tak satu pun sebelumnya bisa langsung menyelesaikannya: mengintegralkan fungsi tanpa antiturunan elementer, dan mengevaluasi limit yang tak bisa disederhanakan aljabar apa pun.',
      },
      lessons: [
        {
          id: 'der-m5-s2-l1',
          title: { en: 'The Binomial Series, and an Integral With No Elementary Antiderivative', id: 'Deret Binomial, dan Integral Tanpa Antiturunan Elementer' },
          goal: {
            en: 'Build the binomial series from the Taylor coefficient formula, then approximate a definite integral by integrating its integrand\'s Taylor series term by term.',
            id: 'Membangun deret binomial dari rumus koefisien Taylor, lalu menghampiri integral tentu dengan mengintegralkan deret Taylor integrandnya suku demi suku.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c0',
              title: { en: 'A generalized binomial theorem, for any exponent at all', id: 'Teorema binomial yang digeneralisasi, untuk eksponen apa pun' },
              body: {
                en: 'The binomial theorem from ordinary algebra expands $(1+x)^m$ only for a positive integer $m$. The Taylor coefficient formula extends it to **any** real $m$. Differentiating $f(x)=(1+x)^m$ repeatedly: $f^{(k)}(x)=m(m-1)\\cdots(m-k+1)(1+x)^{m-k}$, so $f^{(k)}(0)=m(m-1)\\cdots(m-k+1)$, and the Maclaurin series is\n$$(1+x)^m = 1+mx+\\frac{m(m-1)}{2!}x^2+\\frac{m(m-1)(m-2)}{3!}x^3+\\cdots, \\qquad |x|<1$$\ncalled the **binomial series**. When $m$ is a nonnegative integer, the pattern $m(m-1)\\cdots(m-k+1)$ hits a factor of $0$ once $k>m$, and the series stops — exactly the finite binomial expansion already familiar from algebra. For any other $m$, it runs forever, and the Ratio Test confirms $R=1$: $\\left|\\dfrac{u_{k+1}}{u_k}\\right| = \\left|\\dfrac{m-k}{k+1}\\right||x| \\to |x|$.',
                id: 'Teorema binomial dari aljabar biasa menjabarkan $(1+x)^m$ hanya untuk $m$ bilangan bulat positif. Rumus koefisien Taylor menggeneralisasinya untuk $m$ real **apa pun**. Menurunkan $f(x)=(1+x)^m$ berulang kali: $f^{(k)}(x)=m(m-1)\\cdots(m-k+1)(1+x)^{m-k}$, sehingga $f^{(k)}(0)=m(m-1)\\cdots(m-k+1)$, dan deret Maclaurin-nya\n$$(1+x)^m = 1+mx+\\frac{m(m-1)}{2!}x^2+\\frac{m(m-1)(m-2)}{3!}x^3+\\cdots, \\qquad |x|<1$$\ndisebut **deret binomial**. Ketika $m$ bilangan bulat taknegatif, pola $m(m-1)\\cdots(m-k+1)$ menyentuh faktor $0$ begitu $k>m$, dan deretnya berhenti — persis penjabaran binomial hingga yang sudah dikenal dari aljabar. Untuk $m$ lainnya, ia berjalan selamanya, dan Uji Rasio mengonfirmasi $R=1$: $\\left|\\dfrac{u_{k+1}}{u_k}\\right| = \\left|\\dfrac{m-k}{k+1}\\right||x| \\to |x|$.',
              },
              figure: {
                dim: 2,
                xSpan: [-1.1, 3],
                ySpan: [-0.5, 2.5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(1+x)', from: -0.95, to: 3, color: 'muted', dashed: true, label: '√(1+x)' },
                  { t: 'curve', f: '1+x/2-x^2/8+x^3/16', from: -0.9, to: 1.6, color: 'a', label: '4-term binomial series' },
                ],
                caption: {
                  en: 'With $m=\\tfrac12$, the binomial series for $\\sqrt{1+x}$ hugs the true curve closely near $0$ — the same Taylor-polynomial behavior seen throughout this module, now generated by a fractional exponent.',
                  id: 'Dengan $m=\\tfrac12$, deret binomial untuk $\\sqrt{1+x}$ mendekap kurva sebenarnya dengan rapat di sekitar $0$ — perilaku polinom Taylor yang sama yang terlihat di seluruh modul ini, kini dibangkitkan oleh eksponen pecahan.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f0',
              math: true,
              prompt: {
                en: 'Complete the coefficient of $x^2$ in the binomial series for $(1+x)^{1/2}$.',
                id: 'Lengkapi koefisien $x^2$ pada deret binomial untuk $(1+x)^{1/2}$.',
              },
              template: '\\dfrac{m(m-1)}{2!} = \\dfrac{\\frac12\\left(-\\frac12\\right)}{2} = ___',
              blanks: ['-1/8'],
              explain: {
                en: '$\\frac12\\cdot\\left(-\\frac12\\right) = -\\frac14$, divided by $2! = 2$ gives $-\\frac18$ — matching the coefficient in the series shown above.',
                id: '$\\frac12\\cdot\\left(-\\frac12\\right) = -\\frac14$, dibagi $2! = 2$ memberi $-\\frac18$ — cocok dengan koefisien pada deret yang ditunjukkan di atas.',
              },
              hint: {
                en: 'Multiply $m=\\frac12$ by $m-1=-\\frac12$ first, then divide by $2!=2$.',
                id: 'Kalikan $m=\\frac12$ dengan $m-1=-\\frac12$ lebih dahulu, lalu bagi dengan $2!=2$.',
              },
            },
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The integral Numerical Integration was built for', id: 'Integral yang menjadi alasan Integral Numerik dibangun' },
              body: {
                en: '$\\int_0^1 e^{-x^2}\\,dx$ has no elementary antiderivative — the Techniques of Integration course could only reach it with the Trapezoidal Rule or Simpson\'s Rule. A power series gives an exact alternative: substituting $x\\to -x^2$ into the series for $e^x$ (Module 4) gives\n$$e^{-x^2} = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{n!} = 1-x^2+\\frac{x^4}{2!}-\\frac{x^6}{3!}+\\cdots$$\nvalid for every $x$. Integrating term by term from $0$ to $1$ (each term is now just a power rule antiderivative):\n$$\\int_0^1 e^{-x^2}\\,dx = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{n!(2n+1)} = 1-\\frac13+\\frac{1}{10}-\\frac{1}{42}+\\cdots$$\nAn alternating series — Module 3\'s error bound applies immediately, giving a guaranteed accuracy with no separate numerical method needed at all.',
                id: '$\\int_0^1 e^{-x^2}\\,dx$ tak punya antiturunan elementer — kursus Teknik Pengintegralan hanya bisa menjangkaunya dengan Aturan Trapesium atau Aturan Simpson. Deret pangkat memberi alternatif eksak: mensubstitusikan $x\\to -x^2$ ke deret $e^x$ (Modul 4) memberi\n$$e^{-x^2} = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{n!} = 1-x^2+\\frac{x^4}{2!}-\\frac{x^6}{3!}+\\cdots$$\nberlaku untuk setiap $x$. Mengintegralkan suku demi suku dari $0$ sampai $1$ (tiap suku kini sekadar antiturunan aturan pangkat biasa):\n$$\\int_0^1 e^{-x^2}\\,dx = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{n!(2n+1)} = 1-\\frac13+\\frac{1}{10}-\\frac{1}{42}+\\cdots$$\nDeret berselang — batas galat Modul 3 langsung berlaku, memberi akurasi terjamin tanpa perlu metode numerik terpisah sama sekali.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 1.3],
                ySpan: [-0.1, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'e^(-x^2)', from: 0, to: 1.2, color: 'a' },
                  { t: 'poly', pts: [[0, 0], [1, 0], [1, 0.368], [0.75, 0.57], [0.5, 0.779], [0.25, 0.939], [0, 1]], color: 'result' },
                ],
                caption: {
                  en: 'The shaded area $\\int_0^1 e^{-x^2}\\,dx$ has no elementary formula for its antiderivative — but its exact value is still reachable, one power-series term at a time.',
                  id: 'Daerah berbayang $\\int_0^1 e^{-x^2}\\,dx$ tak punya rumus elementer untuk antiturunannya — tetapi nilai eksaknya tetap terjangkau, satu suku deret pangkat setiap kalinya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Four terms, and a guaranteed error already tiny', id: 'Empat suku, dan galat terjamin yang sudah kecil' },
              body: {
                en: 'Summing the first four terms: $1-\\tfrac13+\\tfrac{1}{10}-\\tfrac{1}{42} = 1-0.3333+0.1-0.0238=0.7429$. By the Alternating Series Estimation Theorem (Module 3), the error is bounded by the next term, $\\dfrac{1}{4!\\cdot 9}=\\dfrac{1}{216}\\approx 0.0046$ — already accurate to two decimal places from just four terms, each one nothing harder than the power rule. This is the entire point of building Taylor series: **a function with no closed-form integral is integrated exactly anyway**, by trading one hard problem (an impossible antiderivative) for an easy one repeated many times (integrating a polynomial term).',
                id: 'Menjumlahkan empat suku pertama: $1-\\tfrac13+\\tfrac{1}{10}-\\tfrac{1}{42} = 1-0.3333+0.1-0.0238=0.7429$. Menurut Teorema Taksiran Deret Berselang (Modul 3), galatnya dibatasi oleh suku berikutnya, $\\dfrac{1}{4!\\cdot 9}=\\dfrac{1}{216}\\approx 0.0046$ — sudah akurat sampai dua desimal hanya dari empat suku, masing-masing tak lebih sulit dari aturan pangkat. Inilah seluruh maksud membangun deret Taylor: **fungsi tanpa integral bentuk tertutup tetap diintegralkan secara eksak**, dengan menukar satu soal sulit (antiturunan yang mustahil) dengan soal mudah yang diulang berkali-kali (mengintegralkan suku polinom).',
              },
              figure: {
                dim: 2,
                xSpan: [0, 6],
                ySpan: [0.7, 1.05],
                ticks: true,
                items: [
                  { t: 'dot', x: 1, y: 1, color: 'a' },
                  { t: 'dot', x: 2, y: 0.667, color: 'a' },
                  { t: 'dot', x: 3, y: 0.767, color: 'a' },
                  { t: 'dot', x: 4, y: 0.743, color: 'a' },
                  { t: 'hline', y: 0.7468, color: 'result', dashed: true, label: 'true value' },
                ],
                caption: {
                  en: 'Partial sums of the series for $\\int_0^1 e^{-x^2}dx$ zigzag toward the true value $\\approx 0.7468$ — the alternating pattern from Module 3, now approximating a genuinely un-integrable function.',
                  id: 'Jumlah parsial deret untuk $\\int_0^1 e^{-x^2}dx$ berzigzag menuju nilai sebenarnya $\\approx 0{,}7468$ — pola berselang dari Modul 3, kini menghampiri fungsi yang sungguh tak bisa diintegralkan elementer.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why can Module 3\'s Alternating Series Estimation Theorem be applied to the series for $\\int_0^1 e^{-x^2}dx$?',
                id: 'Mengapa Teorema Taksiran Deret Berselang Modul 3 bisa diterapkan pada deret untuk $\\int_0^1 e^{-x^2}dx$?',
              },
              options: [
                { en: 'The integrated series alternates in sign with terms decreasing to zero, exactly the shape the theorem requires', id: 'Deret yang terintegralkan berselang tanda dengan suku menurun ke nol, persis bentuk yang dituntut teoremanya' },
                { en: 'It cannot be applied — that theorem only works on the original function, not an integrated series', id: 'Tak bisa diterapkan — teorema itu hanya berlaku pada fungsi asli, bukan deret yang terintegralkan' },
                { en: 'Every convergent series automatically qualifies', id: 'Setiap deret konvergen otomatis memenuhi syarat' },
                { en: 'It only works because the answer happens to be less than 1', id: 'Hanya berhasil karena jawabannya kebetulan kurang dari 1' },
              ],
              answer: 0,
              explain: {
                en: 'Term-by-term integration produces a new series, and this particular one still alternates sign with shrinking terms — the theorem cares only about that shape, not where the series came from.',
                id: 'Pengintegralan suku demi suku menghasilkan deret baru, dan deret khusus ini masih berselang tanda dengan suku menyusut — teoremanya hanya peduli bentuk itu, bukan asal deretnya.',
              },
              hint: {
                en: 'Look at the series written out in the first concept — does it alternate in sign, and do the terms shrink toward zero?',
                id: 'Lihat deret yang dituliskan pada konsep pertama — apakah ia berselang tanda, dan apakah sukunya menyusut menuju nol?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the general term of the series for $\\int_0^1 e^{-x^2}\\,dx$.',
                id: 'Lengkapi suku umum deret untuk $\\int_0^1 e^{-x^2}\\,dx$.',
              },
              template: '\\int_0^1 e^{-x^2}\\,dx = \\sum_{n=0}^{\\infty} ___',
              blanks: ['\\dfrac{(-1)^n}{n!(2n+1)}'],
              explain: {
                en: 'Integrating $\\dfrac{(-1)^n x^{2n}}{n!}$ from $0$ to $1$ gives $\\dfrac{(-1)^n}{n!}\\cdot\\dfrac{1}{2n+1}$ — the power rule applied to each term, then evaluated at the bounds.',
                id: 'Mengintegralkan $\\dfrac{(-1)^n x^{2n}}{n!}$ dari $0$ sampai $1$ memberi $\\dfrac{(-1)^n}{n!}\\cdot\\dfrac{1}{2n+1}$ — aturan pangkat diterapkan pada tiap suku, lalu dievaluasi di batasnya.',
              },
              hint: {
                en: 'Apply the power rule to $x^{2n}$ term by term, then evaluate the antiderivative at $1$ and at $0$ — what factor does the exponent $2n+1$ in the denominator come from?',
                id: 'Terapkan aturan pangkat pada $x^{2n}$ suku demi suku, lalu evaluasi antiturunannya di $1$ dan di $0$ — faktor apa yang membuat eksponen $2n+1$ muncul di penyebut?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using the first 3 terms of the series, approximate $\\int_0^1 e^{-x^2}\\,dx$. (Round to four decimal places.)',
                id: 'Memakai 3 suku pertama deretnya, hampiri $\\int_0^1 e^{-x^2}\\,dx$. (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: 1 - 1 / 3 + 1 / 10, tol: 0.001 }],
              hints: [
                { en: '$1 - \\dfrac13 + \\dfrac{1}{10}$.', id: '$1 - \\dfrac13 + \\dfrac{1}{10}$.' },
              ],
              explain: {
                en: '$1-0.3333+0.1=0.7667$ — already within about $0.02$ of the true value $0.7468$, matching the guaranteed bound from the next omitted term.',
                id: '$1-0.3333+0.1=0.7667$ — sudah dalam sekitar $0{,}02$ dari nilai sebenarnya $0{,}7468$, cocok dengan batas terjamin dari suku berikutnya yang dihilangkan.',
              },
            },
          ],
        },
        {
          id: 'der-m5-s2-l2',
          title: { en: 'Evaluating Limits With Taylor Series', id: 'Mengevaluasi Limit dengan Deret Taylor' },
          goal: {
            en: 'Evaluate an indeterminate limit by substituting Taylor series for the functions involved, as an alternative to repeated L\'Hopital\'s Rule.',
            id: 'Mengevaluasi limit tak tentu dengan mensubstitusikan deret Taylor untuk fungsi yang terlibat, sebagai alternatif Aturan L\'Hôpital berulang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One substitution instead of three applications of a rule', id: 'Satu substitusi alih-alih tiga penerapan aturan' },
              body: {
                en: '$\\lim_{x\\to 0}\\dfrac{\\sin x - x}{x^3}$ is $\\frac00$, and repeated L\'Hôpital (three times, from the Applications of Derivatives course) would eventually reach it — but substituting the sine series directly is faster and clearer:\n$$\\frac{\\sin x - x}{x^3} = \\frac{\\left(x-\\dfrac{x^3}{3!}+\\dfrac{x^5}{5!}-\\cdots\\right)-x}{x^3} = \\frac{-\\dfrac{x^3}{6}+\\dfrac{x^5}{120}-\\cdots}{x^3} = -\\frac16+\\frac{x^2}{120}-\\cdots$$\nEvery remaining term carries a positive power of $x$, so as $x\\to 0$ they all vanish, leaving\n$$\\lim_{x\\to 0}\\frac{\\sin x - x}{x^3} = -\\frac16$$\nread off directly, with no derivative taken at all.',
                id: '$\\lim_{x\\to 0}\\dfrac{\\sin x - x}{x^3}$ berbentuk $\\frac00$, dan L\'Hôpital berulang (tiga kali, dari kursus Aplikasi Turunan) akhirnya akan mencapainya — tetapi mensubstitusikan deret sinus langsung lebih cepat dan lebih jelas:\n$$\\frac{\\sin x - x}{x^3} = \\frac{\\left(x-\\dfrac{x^3}{3!}+\\dfrac{x^5}{5!}-\\cdots\\right)-x}{x^3} = \\frac{-\\dfrac{x^3}{6}+\\dfrac{x^5}{120}-\\cdots}{x^3} = -\\frac16+\\frac{x^2}{120}-\\cdots$$\nSetiap suku yang tersisa membawa pangkat positif $x$, sehingga ketika $x\\to 0$ semuanya lenyap, menyisakan\n$$\\lim_{x\\to 0}\\frac{\\sin x - x}{x^3} = -\\frac16$$\ndibaca langsung, tanpa satu turunan pun diambil.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2],
                ySpan: [-0.4, 0.1],
                ticks: true,
                items: [
                  { t: 'curve', f: '(sin(x)-x)/x^3', from: -2, to: -0.05, color: 'a' },
                  { t: 'curve', f: '(sin(x)-x)/x^3', from: 0.05, to: 2, color: 'a' },
                  { t: 'hline', y: -0.1667, color: 'result', dashed: true, label: '-1/6' },
                  { t: 'dot', x: 0, y: -0.1667, color: 'result', open: true },
                ],
                caption: {
                  en: '$\\dfrac{\\sin x - x}{x^3}$ is undefined exactly at $x=0$ (the hollow circle) but the curve closes in on $-1/6$ from both sides — the removable gap the series computation fills in exactly.',
                  id: '$\\dfrac{\\sin x - x}{x^3}$ tak terdefinisi persis di $x=0$ (lingkaran berongga) tetapi kurvanya menutup menuju $-1/6$ dari kedua sisi — celah yang bisa dihapus, yang diisi persis oleh penghitungan deretnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A second example, and when to reach for which tool', id: 'Contoh kedua, dan kapan meraih alat yang mana' },
              body: {
                en: '$\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x^2}$ — a limit the Squeeze Theorem needed real geometric work to prove back in the Limit course — falls out just as fast:\n$$\\frac{1-\\cos x}{x^2} = \\frac{1-\\left(1-\\dfrac{x^2}{2!}+\\dfrac{x^4}{4!}-\\cdots\\right)}{x^2} = \\frac{\\dfrac{x^2}{2}-\\dfrac{x^4}{24}+\\cdots}{x^2} = \\frac12-\\frac{x^2}{24}+\\cdots \\to \\frac12$$\nAs a rule of thumb: L\'Hôpital is usually faster for a **single** application; a Taylor series wins once a limit would need **several** applications in a row, or once the series for the functions involved are already known by heart from Module 4 — at that point, substitution is just algebra, and algebra beats repeated differentiation.',
                id: '$\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x^2}$ — limit yang dulu memerlukan pekerjaan geometri sungguhan untuk dibuktikan Teorema Apit pada kursus Limit — jatuh sama cepatnya:\n$$\\frac{1-\\cos x}{x^2} = \\frac{1-\\left(1-\\dfrac{x^2}{2!}+\\dfrac{x^4}{4!}-\\cdots\\right)}{x^2} = \\frac{\\dfrac{x^2}{2}-\\dfrac{x^4}{24}+\\cdots}{x^2} = \\frac12-\\frac{x^2}{24}+\\cdots \\to \\frac12$$\nSebagai aturan praktis: L\'Hôpital biasanya lebih cepat untuk **satu** penerapan; deret Taylor menang begitu sebuah limit memerlukan **beberapa** penerapan berturut-turut, atau begitu deret fungsi yang terlibat sudah diketahui di luar kepala dari Modul 4 — pada titik itu, substitusi hanyalah aljabar, dan aljabar mengalahkan penurunan berulang.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-0.1, 0.6],
                ticks: true,
                items: [
                  { t: 'curve', f: '(1-cos(x))/x^2', from: -3, to: -0.05, color: 'a' },
                  { t: 'curve', f: '(1-cos(x))/x^2', from: 0.05, to: 3, color: 'a' },
                  { t: 'hline', y: 0.5, color: 'result', dashed: true, label: '1/2' },
                  { t: 'dot', x: 0, y: 0.5, color: 'result', open: true },
                ],
                caption: {
                  en: 'The same removable gap at $x=0$, closing in on $1/2$ from both sides — the exact limit the Squeeze Theorem once needed geometry to pin down, now read straight off a series substitution.',
                  id: 'Celah yang bisa dihapus yang sama di $x=0$, menutup menuju $1/2$ dari kedua sisi — limit eksak yang dulu memerlukan geometri untuk dipastikan Teorema Apit, kini dibaca langsung dari substitusi deret.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'When is the Taylor series method typically preferred over L\'Hôpital\'s Rule for a limit?',
                id: 'Kapan metode deret Taylor biasanya lebih disukai daripada Aturan L\'Hôpital untuk sebuah limit?',
              },
              options: [
                { en: 'When several applications of L\'Hôpital would be needed in a row', id: 'Ketika beberapa penerapan L\'Hôpital diperlukan berturut-turut' },
                { en: 'Always — L\'Hôpital should never be used', id: 'Selalu — L\'Hôpital tak boleh pernah dipakai' },
                { en: 'Only when the limit is not actually indeterminate', id: 'Hanya ketika limitnya sebenarnya tak tentu' },
                { en: 'Never — Taylor series cannot evaluate limits', id: 'Tak pernah — deret Taylor tak bisa mengevaluasi limit' },
              ],
              answer: 0,
              explain: {
                en: 'A single L\'Hôpital application is usually the quickest path; the series method pulls ahead exactly when repeated differentiation would otherwise be needed.',
                id: 'Satu penerapan L\'Hôpital biasanya jalan tercepat; metode deret unggul persis ketika penurunan berulang seharusnya diperlukan.',
              },
              hint: {
                en: 'Re-read the "rule of thumb" sentence in the second concept of this lesson.',
                id: 'Baca ulang kalimat "aturan praktis" pada konsep kedua pelajaran ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that evaluate $\\lim_{x\\to 0}\\dfrac{e^x - 1 - x}{x^2}$ using a Taylor series.',
                id: 'Susun langkah yang mengevaluasi $\\lim_{x\\to 0}\\dfrac{e^x - 1 - x}{x^2}$ memakai deret Taylor.',
              },
              lines: [
                'e^x - 1 - x = \\left(1+x+\\dfrac{x^2}{2}+\\dfrac{x^3}{6}+\\cdots\\right)-1-x = \\dfrac{x^2}{2}+\\dfrac{x^3}{6}+\\cdots',
                '\\dfrac{e^x-1-x}{x^2} = \\dfrac12+\\dfrac{x}{6}+\\cdots',
                '\\lim_{x\\to 0}\\left(\\dfrac12+\\dfrac{x}{6}+\\cdots\\right) = \\dfrac12',
              ],
              explain: {
                en: 'Substitute the series and simplify the numerator first, then divide through by $x^2$, then take the limit of what remains.',
                id: 'Substitusikan deretnya dan sederhanakan pembilangnya lebih dahulu, lalu bagi dengan $x^2$, lalu ambil limit dari yang tersisa.',
              },
              hint: {
                en: 'Division by $x^2$ can only happen once the numerator is actually written as a series, and the limit can only be read off once that division has already been carried out.',
                id: 'Pembagian dengan $x^2$ hanya bisa terjadi setelah pembilangnya benar-benar dituliskan sebagai deret, dan limitnya hanya bisa dibaca setelah pembagian itu sudah dilakukan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using the series for $\\cos x$, find $L = \\lim_{x\\to 0}\\dfrac{\\cos x - 1 + x^2/2}{x^4}$.',
                id: 'Memakai deret $\\cos x$, cari $L = \\lim_{x\\to 0}\\dfrac{\\cos x - 1 + x^2/2}{x^4}$.',
              },
              blanks: [{ answer: 1 / 24 }],
              hints: [
                { en: '$\\cos x - 1 + \\dfrac{x^2}{2} = \\dfrac{x^4}{24}-\\cdots$.', id: '$\\cos x - 1 + \\dfrac{x^2}{2} = \\dfrac{x^4}{24}-\\cdots$.' },
              ],
              explain: {
                en: '$\\cos x = 1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$, so $\\cos x - 1+\\frac{x^2}{2}=\\frac{x^4}{24}-\\cdots$, and dividing by $x^4$ gives $\\frac{1}{24}$ in the limit.',
                id: '$\\cos x = 1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$, sehingga $\\cos x - 1+\\frac{x^2}{2}=\\frac{x^4}{24}-\\cdots$, dan membagi dengan $x^4$ memberi $\\frac{1}{24}$ dalam limit.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m5-s2-p',
        runtime: 'math',
        title: { en: 'Applications of Taylor Series', id: 'Aplikasi Deret Taylor' },
        brief: {
          en: 'A binomial-series approximation, a series-based integral approximation, and two limits evaluated by substitution.',
          id: 'Sebuah hampiran deret binomial, sebuah hampiran integral berbasis deret, dan dua limit yang dievaluasi lewat substitusi.',
        },
        requirements: [
          { en: 'The binomial series $(1+x)^m = 1+mx+\\dfrac{m(m-1)}{2!}x^2+\\cdots$ works for any real exponent m, not just positive integers.', id: 'Deret binomial $(1+x)^m = 1+mx+\\dfrac{m(m-1)}{2!}x^2+\\cdots$ berlaku untuk eksponen m real apa pun, tak hanya bilangan bulat positif.' },
          { en: 'Integrating a Taylor series term by term turns an impossible antiderivative into an ordinary power-rule computation, one term at a time.', id: 'Mengintegralkan deret Taylor suku demi suku mengubah antiturunan yang mustahil menjadi penghitungan aturan pangkat biasa, satu suku setiap kali.' },
          { en: 'Substituting known series turns an indeterminate limit into an ordinary algebraic simplification.', id: 'Mensubstitusikan deret yang sudah diketahui mengubah limit tak tentu menjadi penyederhanaan aljabar biasa.' },
        ],
        tasks: [
          {
            prompt: { en: 'Using the first 3 terms of the binomial series with $m=\\frac13$, approximate $\\sqrt[3]{1.1}$. (Round to four decimal places.)', id: 'Memakai 3 suku pertama deret binomial dengan $m=\\frac13$, hampiri $\\sqrt[3]{1.1}$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 1 + 0.1 / 3 - 0.01 / 9, tol: 0.001 }],
            solution: ['(1+0.1)^{1/3} \\approx 1+\\tfrac13(0.1)-\\tfrac19(0.1)^2 = 1+0{,}0333-0{,}0011 = 1{,}0322'],
          },
          {
            prompt: { en: 'Using the first 3 terms of the series for $\\sin x$, approximate $\\int_0^1 \\dfrac{\\sin x}{x}\\,dx$ (with the integrand defined as $1$ at $x=0$). (Round to four decimal places.)', id: 'Memakai 3 suku pertama deret $\\sin x$, hampiri $\\int_0^1 \\dfrac{\\sin x}{x}\\,dx$ (dengan integrand didefinisikan $1$ di $x=0$). (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 1 - 1 / 18 + 1 / 600, tol: 0.001 }],
            solution: ["\\dfrac{\\sin x}{x} = 1-\\dfrac{x^2}{6}+\\dfrac{x^4}{120}, \\quad \\int_0^1 = 1-\\dfrac{1}{18}+\\dfrac{1}{600} \\approx 0{,}9461"],
          },
          {
            prompt: { en: 'Find $L = \\lim_{x\\to 0}\\dfrac{\\tan x - x}{x^3}$, using $\\tan x \\approx x + \\dfrac{x^3}{3}$ for small x.', id: 'Cari $L = \\lim_{x\\to 0}\\dfrac{\\tan x - x}{x^3}$, memakai $\\tan x \\approx x + \\dfrac{x^3}{3}$ untuk x kecil.' },
            blanks: [{ answer: 1 / 3 }],
            solution: ['\\tan x - x \\approx \\dfrac{x^3}{3} \\Rightarrow \\dfrac{\\tan x-x}{x^3}\\to\\dfrac13'],
          },
          {
            prompt: { en: 'Find $L = \\lim_{x\\to 0}\\dfrac{e^{x^2}-1}{x^2}$, using the series for $e^x$.', id: 'Cari $L = \\lim_{x\\to 0}\\dfrac{e^{x^2}-1}{x^2}$, memakai deret $e^x$.' },
            blanks: [{ answer: 1 }],
            solution: ['e^{x^2}-1 = x^2+\\dfrac{x^4}{2}+\\cdots \\Rightarrow \\dfrac{e^{x^2}-1}{x^2} \\to 1'],
          },
        ],
        hints: [
          { en: 'For the integral, integrate the series term by term first — the $x$ in the denominator just lowers every power by one before integrating.', id: 'Untuk integralnya, integralkan deretnya suku demi suku lebih dahulu — $x$ di penyebut sekadar menurunkan tiap pangkat satu sebelum diintegralkan.' },
        ],
        xp: 50,
      },
    },
  ],
}
