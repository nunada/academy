import type { Module } from '../types'

/** Module 10 — closing the course by looking back at two things taken for
 *  granted since the Functions course: that ln x is the function it is (built
 *  here from nothing but an integral and the Fundamental Theorem), and that
 *  some functions simply outrun others as x grows (made precise with a limit,
 *  computed with L'Hopital's Rule from the Applications of Derivatives course). */
export const module2: Module = {
  id: 'int-m10',
  title: { en: 'The Logarithm as an Integral, and Relative Rates of Growth', id: 'Logaritma sebagai Integral, dan Laju Pertumbuhan Relatif' },
  summary: {
    en: 'Defining ln x directly as an accumulated area rather than as an inverse function, and making precise what it means for one function to grow faster than another.',
    id: 'Mendefinisikan ln x langsung sebagai luas terakumulasi, bukan sebagai fungsi invers, dan membuat persis apa artinya sebuah fungsi bertumbuh lebih cepat dari yang lain.',
  },
  submodules: [
    /* -------------------------------------------- 7.1 the logarithm as an integral */
    {
      id: 'int-m10-s1',
      title: { en: 'The Logarithm Defined as an Integral', id: 'Logaritma yang Didefinisikan sebagai Integral' },
      summary: {
        en: 'A third definition of ln x — as area under 1/t — that reproduces every property already known about it, this time proved rather than assumed.',
        id: 'Definisi ketiga dari ln x — sebagai luas di bawah 1/t — yang menghasilkan ulang setiap sifat yang sudah diketahui tentangnya, kali ini dibuktikan, bukan diasumsikan.',
      },
      lessons: [
        {
          id: 'int-m10-s1-l1',
          title: { en: 'ln x as an Accumulated Area', id: 'ln x sebagai Luas Terakumulasi' },
          goal: {
            en: 'Define ln x as an integral, and show its derivative is 1/x directly from the Fundamental Theorem of Calculus.',
            id: 'Mendefinisikan ln x sebagai sebuah integral, dan menunjukkan turunannya adalah 1/x langsung dari Teorema Dasar Kalkulus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One definition, stated as an area', id: 'Satu definisi, dinyatakan sebagai luas' },
              body: {
                en: 'The Functions course introduced $\\ln x$ as the inverse of $e^x$. There is a second, entirely independent way to define it, and a rigorous calculus course usually starts here instead:\n$$L(x) = \\int_1^x \\frac{1}{t}\\,dt, \\qquad x>0$$\n$L(x)$ is the signed area under $y=1/t$ from $1$ to $x$ — positive when $x>1$ (area to the right, accumulating), negative when $0<x<1$ (the bounds run backward, from Module 2\'s own convention $\\int_a^b = -\\int_b^a$), and exactly $0$ at $x=1$, since a region with no width holds no area.',
                id: 'Kursus Fungsi memperkenalkan $\\ln x$ sebagai invers dari $e^x$. Ada cara kedua yang sama sekali independen untuk mendefinisikannya, dan kursus kalkulus yang ketat biasanya justru dimulai dari sini:\n$$L(x) = \\int_1^x \\frac{1}{t}\\,dt, \\qquad x>0$$\n$L(x)$ adalah luas bertanda di bawah $y=1/t$ dari $1$ sampai $x$ — positif ketika $x>1$ (luas ke kanan, terakumulasi), negatif ketika $0<x<1$ (batasnya berjalan mundur, dari konvensi Modul 2 sendiri $\\int_a^b = -\\int_b^a$), dan tepat $0$ di $x=1$, sebab daerah tanpa lebar tak menyimpan luas.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 4.5],
                ySpan: [-0.3, 2.5],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.2, to: 4.3, color: 'a', label: '1/t' },
                  { t: 'poly', pts: [[1, 0], [3, 0], [3, 0.333], [2.5, 0.4], [2, 0.5], [1.5, 0.667], [1, 1]], color: 'result' },
                  { t: 'vline', x: 1, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'The shaded region is $L(3) = \\int_1^3 \\frac{1}{t}\\,dt$ — an ordinary area-under-a-curve problem from Module 2, computed here for a specific curve instead of a general one.',
                  id: 'Daerah berbayang adalah $L(3) = \\int_1^3 \\frac{1}{t}\\,dt$ — soal luas-di-bawah-kurva biasa dari Modul 2, dihitung di sini untuk kurva tertentu, bukan yang umum.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'FTC Part 1, applied to reveal an old friend', id: 'TDK Bagian 1, diterapkan untuk menyingkap kawan lama' },
              body: {
                en: 'Module 2\'s FTC Part 1 says the derivative of $\\int_a^x f(t)\\,dt$ is $f(x)$ itself. Applied here, with $f(t)=1/t$:\n$$L\'(x) = \\frac{d}{dx}\\int_1^x \\frac{1}{t}\\,dt = \\frac{1}{x}$$\nThat is exactly the derivative already proved for $\\ln x$ in the Transcendental Functions module of the Derivatives course. Since $L$ and $\\ln$ share the same derivative on $(0,\\infty)$, the corollary of the Mean Value Theorem proved in the Applications of Derivatives course says they differ only by a constant: $L(x)=\\ln x + C$. Setting $x=1$: $L(1)=0$ and $\\ln 1 = 0$, so $C=0$. **The two definitions are the same function.**',
                id: 'TDK Bagian 1 di Modul 2 mengatakan turunan dari $\\int_a^x f(t)\\,dt$ adalah $f(x)$ itu sendiri. Diterapkan di sini, dengan $f(t)=1/t$:\n$$L\'(x) = \\frac{d}{dx}\\int_1^x \\frac{1}{t}\\,dt = \\frac{1}{x}$$\nItu persis turunan yang sudah dibuktikan untuk $\\ln x$ pada modul Fungsi Transenden kursus Turunan. Karena $L$ dan $\\ln$ berbagi turunan yang sama pada $(0,\\infty)$, akibat Teorema Nilai Rata-rata yang dibuktikan pada kursus Aplikasi Turunan mengatakan keduanya hanya berbeda oleh sebuah konstanta: $L(x)=\\ln x + C$. Menyetel $x=1$: $L(1)=0$ dan $\\ln 1 = 0$, sehingga $C=0$. **Kedua definisi itu fungsi yang sama.**',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 4.5],
                ySpan: [-1, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)', from: 0.15, to: 4.3, color: 'result', label: 'ln x' },
                  { t: 'dot', x: 1, y: 0, color: 'a', label: '(1,0)' },
                ],
                caption: {
                  en: '$L(x)$, plotted from the integral definition, traces exactly the familiar $\\ln x$ curve — passing through $(1,0)$ and rising with slope $1/x$ everywhere, just as the derivative just found requires.',
                  id: '$L(x)$, digambar dari definisi integralnya, menjejaki persis kurva $\\ln x$ yang sudah dikenal — melalui $(1,0)$ dan naik dengan kemiringan $1/x$ di mana-mana, persis seperti yang dituntut turunan yang baru saja ditemukan.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must $L(1) = 0$ under the integral definition $L(x) = \\int_1^x \\frac{1}{t}\\,dt$?',
                id: 'Mengapa $L(1) = 0$ harus berlaku menurut definisi integral $L(x) = \\int_1^x \\frac{1}{t}\\,dt$?',
              },
              options: [
                { en: 'The upper and lower bounds coincide, so the interval has zero width and encloses no area', id: 'Batas atas dan bawahnya berimpit, sehingga intervalnya berlebar nol dan tak menutupi luas' },
                { en: '$1/t$ happens to equal zero at $t=1$', id: '$1/t$ kebetulan sama dengan nol di $t=1$' },
                { en: 'It is simply asserted, with no reason from the integral itself', id: 'Ini sekadar diasumsikan, tanpa alasan dari integralnya sendiri' },
                { en: 'Every integral is zero unless stated otherwise', id: 'Setiap integral bernilai nol kecuali dinyatakan sebaliknya' },
              ],
              answer: 0,
              explain: {
                en: '$\\int_a^a f(t)\\,dt=0$ for any $f$ and any $a$ — a defining property of the definite integral from Module 2, not something special about $1/t$.',
                id: '$\\int_a^a f(t)\\,dt=0$ untuk $f$ apa pun dan $a$ apa pun — sifat pendefinisi integral tentu dari Modul 2, bukan sesuatu yang khusus tentang $1/t$.',
              },
              hint: {
                en: 'Look at the bounds of $\\int_1^1 \\frac{1}{t}\\,dt$ — what does an integral with identical upper and lower bounds always work out to, for any integrand at all?',
                id: 'Perhatikan batas $\\int_1^1 \\frac{1}{t}\\,dt$ — integral dengan batas atas dan bawah yang identik selalu menghasilkan apa, untuk integrand apa pun?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the derivative found by applying FTC Part 1 to $L(x) = \\int_1^x \\frac{1}{t}\\,dt$.',
                id: 'Lengkapi turunan yang diperoleh dengan menerapkan TDK Bagian 1 pada $L(x) = \\int_1^x \\frac{1}{t}\\,dt$.',
              },
              template: "L'(x) = ___",
              blanks: ['1/x'],
              explain: {
                en: 'FTC Part 1 says the derivative of $\\int_a^x f(t)\\,dt$ is $f(x)$ itself — here $f(t)=1/t$, so the derivative is $1/x$.',
                id: 'TDK Bagian 1 mengatakan turunan dari $\\int_a^x f(t)\\,dt$ adalah $f(x)$ itu sendiri — di sini $f(t)=1/t$, sehingga turunannya $1/x$.',
              },
              hint: {
                en: 'FTC Part 1 says the derivative of $\\int_a^x f(t)\\,dt$ is just $f(x)$ with $x$ plugged in where $t$ was — here the integrand is $f(t) = 1/t$.',
                id: 'TDK Bagian 1 mengatakan turunan dari $\\int_a^x f(t)\\,dt$ adalah $f(x)$ dengan $x$ dimasukkan di tempat $t$ — di sini integrand-nya $f(t) = 1/t$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using the area interpretation and a left-endpoint estimate with two strips of equal width on $[1,3]$, estimate $L(3) = \\int_1^3 \\frac{1}{t}\\,dt$. (Round to two decimal places.)',
                id: 'Memakai tafsiran luas dan taksiran ujung-kiri dengan dua jalur berlebar sama pada $[1,3]$, taksirlah $L(3) = \\int_1^3 \\frac{1}{t}\\,dt$. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 1 * 1 + 0.5 * (1 / 1.5), tol: 0.02 }],
              hints: [
                { en: 'Two strips of width $1$: heights $1/1$ and $1/2$ at the left endpoints $t=1$ and $t=2$.', id: 'Dua jalur berlebar $1$: tinggi $1/1$ dan $1/2$ di ujung kiri $t=1$ dan $t=2$.' },
              ],
              explain: {
                en: 'Left sum: $1\\cdot\\frac{1}{1} + 1\\cdot\\frac{1}{2} = 1.5$ — an overestimate, since $1/t$ is decreasing (the true value is $\\ln 3 \\approx 1.10$, and finer strips would close the gap, exactly as Module 2 showed).',
                id: 'Jumlah kiri: $1\\cdot\\frac{1}{1} + 1\\cdot\\frac{1}{2} = 1.5$ — sebuah taksiran lebih, sebab $1/t$ menurun (nilai sebenarnya $\\ln 3 \\approx 1{,}10$, dan jalur yang lebih halus akan menutup celahnya, persis seperti ditunjukkan Modul 2).',
              },
            },
          ],
        },
        {
          id: 'int-m10-s1-l2',
          title: { en: 'Logarithm Laws, Derived From the Integral', id: 'Hukum Logaritma, Diturunkan dari Integral' },
          goal: {
            en: 'Prove ln(ab) = ln a + ln b directly from the integral definition, using substitution.',
            id: 'Membuktikan ln(ab) = ln a + ln b langsung dari definisi integral, memakai substitusi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Splitting the interval, then substituting one piece', id: 'Memecah intervalnya, lalu mensubstitusi satu bagian' },
              body: {
                en: 'The Functions course simply stated $\\ln(ab)=\\ln a+\\ln b$. Here is where it actually comes from. Split the interval $[1,ab]$ at $a$, using additivity of the integral (Module 2):\n$$\\ln(ab) = \\int_1^{ab}\\frac{1}{t}\\,dt = \\int_1^a \\frac{1}{t}\\,dt + \\int_a^{ab}\\frac{1}{t}\\,dt = \\ln a + \\int_a^{ab}\\frac{1}{t}\\,dt$$\nThe second piece is not yet $\\ln b$ — its bounds run from $a$ to $ab$, not from $1$ to $b$. Substitute $t=au$, so $dt=a\\,du$; when $t=a$, $u=1$, and when $t=ab$, $u=b$:\n$$\\int_a^{ab}\\frac{1}{t}\\,dt = \\int_1^{b}\\frac{1}{au}\\cdot a\\,du = \\int_1^b \\frac{1}{u}\\,du = \\ln b$$\nThe factor of $a$ introduced by $dt$ cancels exactly the $a$ in the denominator — the entire reason the substitution was chosen. Putting the two pieces back together: $\\ln(ab)=\\ln a+\\ln b$, proved with nothing but $u$-substitution from the Techniques of Integration course.',
                id: 'Kursus Fungsi hanya menyatakan $\\ln(ab)=\\ln a+\\ln b$. Di sinilah asalnya sebenarnya. Pecah interval $[1,ab]$ di $a$, memakai aditivitas integral (Modul 2):\n$$\\ln(ab) = \\int_1^{ab}\\frac{1}{t}\\,dt = \\int_1^a \\frac{1}{t}\\,dt + \\int_a^{ab}\\frac{1}{t}\\,dt = \\ln a + \\int_a^{ab}\\frac{1}{t}\\,dt$$\nBagian kedua belum $\\ln b$ — batasnya berjalan dari $a$ sampai $ab$, bukan dari $1$ sampai $b$. Substitusikan $t=au$, sehingga $dt=a\\,du$; ketika $t=a$, $u=1$, dan ketika $t=ab$, $u=b$:\n$$\\int_a^{ab}\\frac{1}{t}\\,dt = \\int_1^{b}\\frac{1}{au}\\cdot a\\,du = \\int_1^b \\frac{1}{u}\\,du = \\ln b$$\nFaktor $a$ yang diperkenalkan $dt$ persis meniadakan $a$ pada penyebutnya — inilah alasan tunggal substitusi ini dipilih. Menyatukan kedua bagian kembali: $\\ln(ab)=\\ln a+\\ln b$, terbukti hanya dengan substitusi-u dari kursus Teknik Pengintegralan.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 7],
                ySpan: [-0.3, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.25, to: 6.8, color: 'muted', dashed: true },
                  { t: 'poly', pts: [[1, 0], [2, 0], [2, 0.5], [1, 1]], color: 'a', label: 'ln a' },
                  { t: 'poly', pts: [[2, 0], [6, 0], [6, 0.167], [2, 0.5]], color: 'b', label: 'ln b (rescaled)' },
                ],
                caption: {
                  en: 'With $a=2$, $b=3$: the region for $\\ln 2$ (from $1$ to $2$) and the region from $a$ to $ab=6$ — the substitution shows the second region has exactly the same area as $\\ln 3$, just relocated.',
                  id: 'Dengan $a=2$, $b=3$: daerah untuk $\\ln 2$ (dari $1$ sampai $2$) dan daerah dari $a$ sampai $ab=6$ — substitusinya menunjukkan daerah kedua punya luas persis sama dengan $\\ln 3$, hanya berpindah tempat.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The power law, by the same equal-derivative trick', id: 'Hukum pangkat, dengan trik turunan-sama yang sama' },
              body: {
                en: 'The same trick from the previous lesson proves $\\ln(x^r)=r\\ln x$ for any real $r$, without a second substitution. Let $f(x)=\\ln(x^r)$ and $g(x)=r\\ln x$. By the Chain Rule, $f\'(x) = \\frac{1}{x^r}\\cdot rx^{r-1} = \\frac{r}{x}$, and directly $g\'(x)=\\frac{r}{x}$ — the same derivative. Both also agree at $x=1$: $f(1)=\\ln 1=0$ and $g(1)=r\\ln 1=0$. Equal derivative and equal value at one point forces $f=g$ everywhere on $(0,\\infty)$ — exactly the corollary used in the first lesson of this module.',
                id: 'Trik yang sama dari pelajaran sebelumnya membuktikan $\\ln(x^r)=r\\ln x$ untuk $r$ real apa pun, tanpa substitusi kedua. Misalkan $f(x)=\\ln(x^r)$ dan $g(x)=r\\ln x$. Dengan Aturan Rantai, $f\'(x) = \\frac{1}{x^r}\\cdot rx^{r-1} = \\frac{r}{x}$, dan langsung $g\'(x)=\\frac{r}{x}$ — turunan yang sama. Keduanya juga sepakat di $x=1$: $f(1)=\\ln 1=0$ dan $g(1)=r\\ln 1=0$. Turunan sama dan nilai sama di satu titik memaksa $f=g$ di mana-mana pada $(0,\\infty)$ — persis akibat yang dipakai pelajaran pertama modul ini.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 4.5],
                ySpan: [-1, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x^2)', from: 0.15, to: 4.3, color: 'a', label: 'ln(x²)' },
                  { t: 'curve', f: '2*ln(x)', from: 0.15, to: 4.3, color: 'result', dashed: true, label: '2 ln x' },
                ],
                caption: {
                  en: '$\\ln(x^2)$ and $2\\ln x$ trace exactly the same curve — one line hides completely under the other, since the two are provably identical, not merely close.',
                  id: '$\\ln(x^2)$ dan $2\\ln x$ menjejaki persis kurva yang sama — satu garis tersembunyi total di bawah yang lain, sebab keduanya terbukti identik, bukan sekadar berdekatan.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the substitution $t = au$ in $\\int_a^{ab}\\frac{1}{t}\\,dt$ turn it into exactly $\\int_1^b \\frac{1}{u}\\,du$?',
                id: 'Mengapa substitusi $t = au$ pada $\\int_a^{ab}\\frac{1}{t}\\,dt$ mengubahnya menjadi persis $\\int_1^b \\frac{1}{u}\\,du$?',
              },
              options: [
                { en: 'The factor of $a$ from $dt=a\\,du$ cancels the $a$ that appears in the denominator $\\frac{1}{au}$', id: 'Faktor $a$ dari $dt=a\\,du$ meniadakan $a$ yang muncul pada penyebut $\\frac{1}{au}$' },
                { en: 'Substitution never changes the bounds of an integral', id: 'Substitusi tak pernah mengubah batas sebuah integral' },
                { en: 'It is a coincidence with no algebraic explanation', id: 'Ini kebetulan tanpa penjelasan aljabar' },
                { en: '$a$ is treated as zero throughout the substitution', id: '$a$ diperlakukan sebagai nol sepanjang substitusi' },
              ],
              answer: 0,
              explain: {
                en: 'Substituting $t=au$ turns $\\frac{1}{t}\\,dt$ into $\\frac{1}{au}\\cdot a\\,du$, and the $a$ in the numerator (from $dt$) cancels the $a$ in the denominator exactly, leaving $\\frac{1}{u}\\,du$ — this cancellation is the entire point of choosing this substitution.',
                id: 'Mensubstitusikan $t=au$ mengubah $\\frac{1}{t}\\,dt$ menjadi $\\frac{1}{au}\\cdot a\\,du$, dan $a$ di pembilang (dari $dt$) persis meniadakan $a$ di penyebut, menyisakan $\\frac{1}{u}\\,du$ — peniadaan inilah seluruh alasan substitusi ini dipilih.',
              },
              hint: {
                en: 'Write out $\\frac{1}{t}\\,dt$ with $t$ replaced by $au$ and $dt$ replaced by $a\\,du$, then look for what cancels between the numerator and the denominator.',
                id: 'Tuliskan $\\frac{1}{t}\\,dt$ dengan $t$ diganti $au$ dan $dt$ diganti $a\\,du$, lalu cari apa yang saling meniadakan antara pembilang dan penyebut.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that prove $\\ln(ab) = \\ln a + \\ln b$ from the integral definition.',
                id: 'Susun langkah yang membuktikan $\\ln(ab) = \\ln a + \\ln b$ dari definisi integral.',
              },
              lines: [
                '\\ln(ab) = \\int_1^a \\frac{1}{t}\\,dt + \\int_a^{ab} \\frac{1}{t}\\,dt',
                '\\int_a^{ab} \\frac{1}{t}\\,dt = \\int_1^b \\frac{1}{au}\\cdot a\\,du \\quad (t=au)',
                '= \\int_1^b \\frac{1}{u}\\,du = \\ln b',
                '\\ln(ab) = \\ln a + \\ln b',
              ],
              explain: {
                en: 'Split the interval first, then substitute the second piece, then simplify it to ln b, and only then combine both results into the final identity.',
                id: 'Pecah intervalnya lebih dahulu, lalu substitusikan bagian kedua, lalu sederhanakan menjadi ln b, dan baru kemudian gabungkan kedua hasil menjadi identitas akhir.',
              },
              hint: {
                en: 'The substitution can only be applied to the piece from the split, and the final identity can only be written once that substituted piece has actually been simplified down to ln b.',
                id: 'Substitusinya hanya bisa diterapkan pada bagian dari pemecahan, dan identitas akhirnya hanya bisa dituliskan setelah bagian yang disubstitusi itu benar-benar disederhanakan menjadi ln b.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Given $\\ln 2 \\approx 0.6931$ and $\\ln 5 \\approx 1.6094$, use the logarithm laws to find $\\ln 20$. (Round to four decimal places.)',
                id: 'Diberikan $\\ln 2 \\approx 0.6931$ dan $\\ln 5 \\approx 1.6094$, pakai hukum logaritma untuk mencari $\\ln 20$. (Bulatkan ke empat desimal.)',
              },
              blanks: [{ answer: Math.log(20), tol: 0.001 }],
              hints: [
                { en: '$20 = 2^2 \\cdot 5$, so $\\ln 20 = 2\\ln 2 + \\ln 5$.', id: '$20 = 2^2 \\cdot 5$, sehingga $\\ln 20 = 2\\ln 2 + \\ln 5$.' },
              ],
              explain: {
                en: '$\\ln 20 = \\ln(2^2 \\cdot 5) = 2\\ln 2 + \\ln 5 \\approx 2(0.6931)+1.6094 = 2.9956$, matching $\\ln 20 \\approx 2.9957$.',
                id: '$\\ln 20 = \\ln(2^2 \\cdot 5) = 2\\ln 2 + \\ln 5 \\approx 2(0{,}6931)+1{,}6094 = 2{,}9956$, cocok dengan $\\ln 20 \\approx 2{,}9957$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m10-s1-p',
        runtime: 'math',
        title: { en: 'The Integral Definition of the Logarithm', id: 'Definisi Integral dari Logaritma' },
        brief: {
          en: 'One area estimate, and two applications of the logarithm laws just proved.',
          id: 'Satu taksiran luas, dan dua penerapan hukum logaritma yang baru dibuktikan.',
        },
        requirements: [
          { en: '$L(x) = \\int_1^x \\frac{1}{t}\\,dt$ and $\\ln x$ are the same function, proved from equal derivatives and equal value at $x=1$.', id: '$L(x) = \\int_1^x \\frac{1}{t}\\,dt$ dan $\\ln x$ adalah fungsi yang sama, terbukti dari turunan yang sama dan nilai yang sama di $x=1$.' },
          { en: '$\\ln(ab)=\\ln a+\\ln b$ and $\\ln(x^r)=r\\ln x$, both proved directly from the integral.', id: '$\\ln(ab)=\\ln a+\\ln b$ dan $\\ln(x^r)=r\\ln x$, keduanya terbukti langsung dari integralnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Using a right-endpoint estimate with two strips of equal width on $[1,3]$, estimate $\\int_1^3 \\frac{1}{t}\\,dt$. (Round to two decimal places.)', id: 'Memakai taksiran ujung-kanan dengan dua jalur berlebar sama pada $[1,3]$, taksirlah $\\int_1^3 \\frac{1}{t}\\,dt$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 1 * 0.5 + 1 * (1 / 3), tol: 0.02 }],
            solution: ['\\text{Strips at } t=2,3: \\ 1\\cdot\\tfrac12+1\\cdot\\tfrac13 = \\tfrac56 \\approx 0{,}83'],
          },
          {
            prompt: { en: 'Given $\\ln 3 \\approx 1.0986$, find $\\ln 81$. (Round to four decimal places.)', id: 'Diberikan $\\ln 3 \\approx 1.0986$, cari $\\ln 81$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: Math.log(81), tol: 0.002 }],
            solution: ['81=3^4, \\quad \\ln 81 = 4\\ln 3 \\approx 4{,}3944'],
          },
          {
            prompt: { en: 'Given $\\ln 2 \\approx 0.6931$ and $\\ln 7 \\approx 1.9459$, find $\\ln 28$. (Round to four decimal places.)', id: 'Diberikan $\\ln 2 \\approx 0.6931$ dan $\\ln 7 \\approx 1.9459$, cari $\\ln 28$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: Math.log(28), tol: 0.002 }],
            solution: ['28=2^2\\cdot 7, \\quad \\ln 28 = 2\\ln 2+\\ln 7 \\approx 3{,}3321'],
          },
        ],
        hints: [
          { en: 'Factor each number into primes first — the logarithm laws turn a product and a power into a sum and a multiple.', id: 'Faktorkan tiap bilangan menjadi bilangan prima lebih dahulu — hukum logaritma mengubah hasil kali dan pangkat menjadi jumlah dan kelipatan.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------------- 7.4 relative rates of growth */
    {
      id: 'int-m10-s2',
      title: { en: 'Relative Rates of Growth', id: 'Laju Pertumbuhan Relatif' },
      summary: {
        en: 'Making "grows faster" precise with a limit, computed with L\'Hôpital\'s Rule, and ranking exponentials, powers, and logarithms by how fast they grow.',
        id: 'Membuat "bertumbuh lebih cepat" persis dengan sebuah limit, dihitung dengan Aturan L\'Hôpital, dan mengurutkan eksponen, pangkat, dan logaritma menurut seberapa cepat mereka bertumbuh.',
      },
      lessons: [
        {
          id: 'int-m10-s2-l1',
          title: { en: 'Comparing Growth With a Limit', id: 'Membandingkan Pertumbuhan dengan Limit' },
          goal: {
            en: 'Define what it means for one function to grow faster than, slower than, or at the same rate as another, using a limit of their ratio.',
            id: 'Mendefinisikan apa artinya sebuah fungsi bertumbuh lebih cepat, lebih lambat, atau dengan laju yang sama dengan yang lain, memakai limit dari rasionya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three outcomes for a ratio as x grows', id: 'Tiga hasil untuk sebuah rasio ketika x membesar' },
              body: {
                en: 'Both $e^x$ and $x^2$ grow without bound, but not at the same speed — and "which grows faster" needs a precise meaning, not just a glance at two graphs. It is defined through the limit of their ratio as $x\\to\\infty$:\n\n- $f$ **grows faster** than $g$ if $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=\\infty$ (equivalently, $\\dfrac{g(x)}{f(x)}\\to 0$).\n- $f$ and $g$ **grow at the same rate** if $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=L$ for some finite $L\\neq 0$.\n- $f$ **grows slower** than $g$ if $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=0$.\n\nEvery one of these limits is a $\\frac{\\infty}{\\infty}$ indeterminate form — precisely what L\'Hôpital\'s Rule, from the Applications of Derivatives course, was built to resolve.',
                id: 'Baik $e^x$ maupun $x^2$ bertumbuh tanpa batas, tetapi tak dengan kecepatan yang sama — dan "mana yang bertumbuh lebih cepat" perlu makna yang persis, bukan sekadar melirik dua grafik. Ia didefinisikan lewat limit dari rasio keduanya ketika $x\\to\\infty$:\n\n- $f$ **bertumbuh lebih cepat** dari $g$ jika $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=\\infty$ (setara, $\\dfrac{g(x)}{f(x)}\\to 0$).\n- $f$ dan $g$ **bertumbuh dengan laju yang sama** jika $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=L$ untuk suatu $L\\neq 0$ yang hingga.\n- $f$ **bertumbuh lebih lambat** dari $g$ jika $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=0$.\n\nSetiap limit ini adalah bentuk tak tentu $\\frac{\\infty}{\\infty}$ — persis yang dibangun Aturan L\'Hôpital dari kursus Aplikasi Turunan untuk menyelesaikannya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 5],
                ySpan: [-2, 30],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', from: 0, to: 5, color: 'a', label: 'x²' },
                  { t: 'curve', f: 'e^x', from: 0, to: 3.4, color: 'result', label: 'eˣ' },
                ],
                caption: {
                  en: '$e^x$ overtakes $x^2$ for good near $x\\approx 3.7$ and never looks back — the visible signature of $\\lim_{x\\to\\infty} e^x/x^2=\\infty$, computed exactly in the next concept.',
                  id: '$e^x$ menyalip $x^2$ untuk seterusnya di dekat $x\\approx 3{,}7$ dan tak pernah menoleh lagi — tanda tampak dari $\\lim_{x\\to\\infty} e^x/x^2=\\infty$, dihitung eksak pada konsep berikutnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: "L'Hôpital, twice in a row", id: "L'Hôpital, dua kali berturut-turut" },
              body: {
                en: 'Confirm $e^x$ grows faster than $x^2$ by applying L\'Hôpital\'s Rule until the indeterminate form clears — each application differentiates the top and bottom separately:\n$$\\lim_{x\\to\\infty}\\frac{e^x}{x^2} = \\lim_{x\\to\\infty}\\frac{e^x}{2x} = \\lim_{x\\to\\infty}\\frac{e^x}{2} = \\infty$$\nEvery derivative of $e^x$ is $e^x$ again, unchanged, while the polynomial $x^2$ loses a degree each time and eventually becomes the constant $2$ — a race the exponential cannot lose. Now compare $g(x)=3x^2+5x$ against $f(x)=x^2$, same-rate territory:\n$$\\lim_{x\\to\\infty}\\frac{3x^2+5x}{x^2} = \\lim_{x\\to\\infty}\\left(3+\\frac{5}{x}\\right) = 3$$\na finite, nonzero limit — no L\'Hôpital even needed here, since dividing through directly already clears the indeterminate form.',
                id: 'Konfirmasi $e^x$ bertumbuh lebih cepat dari $x^2$ dengan menerapkan Aturan L\'Hôpital sampai bentuk tak tentunya lenyap — tiap penerapan menurunkan atas dan bawah secara terpisah:\n$$\\lim_{x\\to\\infty}\\frac{e^x}{x^2} = \\lim_{x\\to\\infty}\\frac{e^x}{2x} = \\lim_{x\\to\\infty}\\frac{e^x}{2} = \\infty$$\nSetiap turunan $e^x$ adalah $e^x$ lagi, tak berubah, sementara polinom $x^2$ kehilangan satu derajat tiap kali dan akhirnya menjadi konstanta $2$ — perlombaan yang tak mungkin dikalahkan eksponen. Sekarang bandingkan $g(x)=3x^2+5x$ terhadap $f(x)=x^2$, wilayah laju-sama:\n$$\\lim_{x\\to\\infty}\\frac{3x^2+5x}{x^2} = \\lim_{x\\to\\infty}\\left(3+\\frac{5}{x}\\right) = 3$$\nsebuah limit hingga dan tak nol — bahkan tak perlu L\'Hôpital di sini, sebab membagi langsung sudah menyelesaikan bentuk tak tentunya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 10],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(3*x^2+5*x)/x^2', from: 0.3, to: 10, color: 'a' },
                  { t: 'hline', y: 3, color: 'muted', dashed: true, label: 'L=3' },
                ],
                caption: {
                  en: 'The ratio $\\dfrac{3x^2+5x}{x^2}$ settles toward the horizontal asymptote $L=3$ — a finite, nonzero limit, exactly the signature of "same rate of growth" as $x^2$.',
                  id: 'Rasio $\\dfrac{3x^2+5x}{x^2}$ menuju asimtot datar $L=3$ — limit hingga dan tak nol, persis tanda "laju pertumbuhan yang sama" dengan $x^2$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=0$, what does that say about how $f$ and $g$ grow?',
                id: 'Jika $\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=0$, apa artinya itu tentang bagaimana $f$ dan $g$ bertumbuh?',
              },
              options: [
                { en: '$f$ grows slower than $g$', id: '$f$ bertumbuh lebih lambat dari $g$' },
                { en: '$f$ grows faster than $g$', id: '$f$ bertumbuh lebih cepat dari $g$' },
                { en: '$f$ and $g$ grow at the same rate', id: '$f$ dan $g$ bertumbuh dengan laju yang sama' },
                { en: 'Neither function actually grows', id: 'Tak satu pun fungsi sebenarnya bertumbuh' },
              ],
              answer: 0,
              explain: {
                en: 'A ratio $f/g$ shrinking to $0$ means $g$ dwarfs $f$ as $x$ grows — by definition, $f$ grows slower than $g$.',
                id: 'Rasio $f/g$ yang menyusut ke $0$ berarti $g$ jauh melampaui $f$ ketika $x$ membesar — menurut definisi, $f$ bertumbuh lebih lambat dari $g$.',
              },
              hint: {
                en: 'Re-read the three bullet points in the first concept — one of them names this exact limit value word for word.',
                id: 'Baca ulang tiga butir pada konsep pertama — salah satunya menamai persis nilai limit ini kata demi kata.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the first L\'Hôpital step for $\\lim_{x\\to\\infty}\\dfrac{x^2}{e^x}$.',
                id: 'Lengkapi langkah L\'Hôpital pertama untuk $\\lim_{x\\to\\infty}\\dfrac{x^2}{e^x}$.',
              },
              template: '\\lim_{x\\to\\infty}\\dfrac{x^2}{e^x} = \\lim_{x\\to\\infty}\\dfrac{___}{e^x}',
              blanks: ['2x'],
              explain: {
                en: 'Differentiating top and bottom separately: the derivative of $x^2$ is $2x$, and the derivative of $e^x$ is $e^x$ again.',
                id: 'Menurunkan atas dan bawah secara terpisah: turunan $x^2$ adalah $2x$, dan turunan $e^x$ adalah $e^x$ lagi.',
              },
              hint: {
                en: "L'Hôpital's Rule differentiates the numerator and the denominator separately — what is the derivative of $x^2$?",
                id: "Aturan L'Hôpital menurunkan pembilang dan penyebut secara terpisah — apa turunan dari $x^2$?",
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find $L = \\lim_{x\\to\\infty}\\dfrac{2x^2-x}{5x^2+1}$.',
                id: 'Cari $L = \\lim_{x\\to\\infty}\\dfrac{2x^2-x}{5x^2+1}$.',
              },
              blanks: [{ answer: 2 / 5 }],
              hints: [
                { en: 'Apply L\'Hôpital twice, or divide every term by $x^2$ directly.', id: "Terapkan L'Hôpital dua kali, atau bagi tiap suku dengan $x^2$ langsung." },
              ],
              explain: {
                en: 'Dividing every term by $x^2$: $\\dfrac{2-1/x}{5+1/x^2}\\to\\dfrac{2}{5}=0.4$ — a finite, nonzero limit, so the two polynomials grow at the same rate.',
                id: 'Membagi tiap suku dengan $x^2$: $\\dfrac{2-1/x}{5+1/x^2}\\to\\dfrac{2}{5}=0{,}4$ — limit hingga dan tak nol, sehingga kedua polinom bertumbuh dengan laju yang sama.',
              },
            },
          ],
        },
        {
          id: 'int-m10-s2-l2',
          title: { en: 'A Hierarchy of Growth Rates', id: 'Hierarki Laju Pertumbuhan' },
          goal: {
            en: 'Rank logarithms, powers, and exponentials by growth rate, and justify the ranking with L\'Hôpital\'s Rule.',
            id: 'Mengurutkan logaritma, pangkat, dan eksponen menurut laju pertumbuhan, dan membenarkan urutannya dengan Aturan L\'Hôpital.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Logarithms lose to every positive power', id: 'Logaritma kalah dari pangkat positif apa pun' },
              body: {
                en: 'Even the mild power $x^{0.5}$ beats $\\ln x$ eventually — a fact worth proving once, since it holds no matter how small the positive power is:\n$$\\lim_{x\\to\\infty}\\frac{\\ln x}{\\sqrt{x}} = \\lim_{x\\to\\infty}\\frac{1/x}{\\frac12x^{-1/2}} = \\lim_{x\\to\\infty}\\frac{2}{\\sqrt{x}} = 0$$\nSo $\\ln x$ grows slower than $\\sqrt{x}$ — and by the same computation with any exponent $r>0$ in place of $\\tfrac12$, slower than $x^r$ for **every** positive $r$, however small. A logarithm looks like it grows quickly on a small graph only because it starts so much smaller than everything else; given enough room, any positive power eventually leaves it behind.',
                id: 'Bahkan pangkat sekecil $x^{0.5}$ akhirnya mengalahkan $\\ln x$ — fakta yang layak dibuktikan sekali, sebab berlaku tak peduli seberapa kecil pangkat positifnya:\n$$\\lim_{x\\to\\infty}\\frac{\\ln x}{\\sqrt{x}} = \\lim_{x\\to\\infty}\\frac{1/x}{\\frac12x^{-1/2}} = \\lim_{x\\to\\infty}\\frac{2}{\\sqrt{x}} = 0$$\nJadi $\\ln x$ bertumbuh lebih lambat dari $\\sqrt{x}$ — dan dengan perhitungan yang sama untuk pangkat $r>0$ mana pun menggantikan $\\tfrac12$, lebih lambat dari $x^r$ untuk **setiap** $r$ positif, sekecil apa pun. Logaritma tampak bertumbuh cepat pada grafik kecil hanya karena ia mulai jauh lebih kecil dari segalanya; diberi ruang yang cukup, pangkat positif mana pun akhirnya meninggalkannya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 60],
                ySpan: [-1, 9],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)', from: 0.2, to: 58, color: 'a', label: 'ln x' },
                  { t: 'curve', f: 'sqrt(x)', from: 0, to: 58, color: 'result', label: 'sqrt(x)' },
                ],
                caption: {
                  en: '$\\sqrt{x}$ overtakes $\\ln x$ near $x\\approx 55$ — later than $e^x$ overtaking $x^2$ from the last lesson, but the outcome is the same, since $\\ln x/\\sqrt{x}\\to 0$.',
                  id: '$\\sqrt{x}$ menyalip $\\ln x$ di dekat $x\\approx 55$ — lebih lambat dari $e^x$ menyalip $x^2$ pada pelajaran sebelumnya, tetapi hasilnya sama, sebab $\\ln x/\\sqrt{x}\\to 0$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The three-tier ladder, in one picture', id: 'Tangga tiga tingkat, dalam satu gambar' },
              body: {
                en: 'Combining every comparison this module has made places three families of functions on a strict ladder, slowest to fastest:\n$$\\ln x \\ \\to \\ x^r\\ (r>0) \\ \\to \\ e^x$$\nwhere $f \\to g$ means $f$ grows strictly slower than $g$. A product like $x\\ln x$ sits with the power-function tier: $\\lim_{x\\to\\infty}\\frac{x\\ln x}{x^2} = \\lim_{x\\to\\infty}\\frac{\\ln x}{x} = 0$ by the same L\'Hôpital pattern as the previous concept, so $x\\ln x$ grows slower than $x^2$ but — by a similar computation — faster than $x$ alone. The ladder is not just a curiosity: it is exactly what later determines which term in a complicated expression dominates as $x\\to\\infty$, without computing a single extra limit by hand.',
                id: 'Menggabungkan setiap perbandingan yang dibuat modul ini menempatkan tiga keluarga fungsi pada tangga yang ketat, dari paling lambat ke paling cepat:\n$$\\ln x \\ \\to \\ x^r\\ (r>0) \\ \\to \\ e^x$$\ndengan $f \\to g$ berarti $f$ bertumbuh strict lebih lambat dari $g$. Hasil kali seperti $x\\ln x$ duduk bersama tingkat fungsi-pangkat: $\\lim_{x\\to\\infty}\\frac{x\\ln x}{x^2} = \\lim_{x\\to\\infty}\\frac{\\ln x}{x} = 0$ dengan pola L\'Hôpital yang sama seperti konsep sebelumnya, sehingga $x\\ln x$ bertumbuh lebih lambat dari $x^2$ tetapi — dengan perhitungan serupa — lebih cepat dari $x$ sendirian. Tangga ini bukan sekadar keingintahuan: inilah persis yang nantinya menentukan suku mana dalam sebuah ekspresi rumit yang mendominasi ketika $x\\to\\infty$, tanpa menghitung satu limit tambahan pun dengan tangan.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 20],
                ySpan: [-2, 30],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)', from: 0.2, to: 20, color: 'muted', label: 'ln x' },
                  { t: 'curve', f: 'x', from: 0, to: 20, color: 'a', label: 'x' },
                  { t: 'curve', f: 'x*ln(x)', from: 0.2, to: 8.5, color: 'b', label: 'x ln x' },
                  { t: 'curve', f: 'x^2/10', from: 0, to: 17.3, color: 'result', label: 'x²/10' },
                ],
                caption: {
                  en: 'Slowest to fastest, left to right along the visible order at large $x$: $\\ln x$, then $x$, then $x\\ln x$, then $x^2$ — the growth ladder made visible on one screen.',
                  id: 'Paling lambat ke paling cepat, kiri ke kanan sepanjang urutan yang tampak di $x$ besar: $\\ln x$, lalu $x$, lalu $x\\ln x$, lalu $x^2$ — tangga pertumbuhan yang tampak dalam satu layar.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'According to the growth ladder, which grows fastest as $x \\to \\infty$?',
                id: 'Menurut tangga pertumbuhan, mana yang bertumbuh paling cepat ketika $x \\to \\infty$?',
              },
              options: [
                { en: '$e^x$', id: '$e^x$' },
                { en: '$x^{100}$', id: '$x^{100}$' },
                { en: '$\\ln x$', id: '$\\ln x$' },
                { en: '$x\\ln x$', id: '$x\\ln x$' },
              ],
              answer: 0,
              explain: {
                en: 'The ladder $\\ln x \\to x^r \\to e^x$ places the exponential above **every** power, no matter how large the exponent — $x^{100}$ eventually loses to $e^x$ just as surely as $x^2$ did.',
                id: 'Tangga $\\ln x \\to x^r \\to e^x$ menempatkan eksponen di atas pangkat **apa pun**, seberapa besar pun eksponennya — $x^{100}$ akhirnya kalah dari $e^x$ sama pastinya seperti $x^2$.',
              },
              hint: {
                en: 'The ladder proved in this module places one entire family strictly above every power function, regardless of that power\'s size — which family is it?',
                id: 'Tangga yang dibuktikan modul ini menempatkan satu keluarga penuh strict di atas fungsi pangkat apa pun, tak peduli besar pangkatnya — keluarga mana itu?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that show $x\\ln x$ grows slower than $x^2$.',
                id: 'Susun langkah yang menunjukkan $x\\ln x$ bertumbuh lebih lambat dari $x^2$.',
              },
              lines: [
                '\\lim_{x\\to\\infty}\\dfrac{x\\ln x}{x^2} = \\lim_{x\\to\\infty}\\dfrac{\\ln x}{x}',
                '= \\lim_{x\\to\\infty}\\dfrac{1/x}{1}',
                '= \\lim_{x\\to\\infty}\\dfrac{1}{x} = 0',
              ],
              explain: {
                en: 'Cancel one factor of x algebraically first, then apply L\'Hôpital to the remaining indeterminate form, then read off the limit.',
                id: 'Coret satu faktor x secara aljabar lebih dahulu, lalu terapkan L\'Hôpital pada bentuk tak tentu yang tersisa, lalu baca limitnya.',
              },
              hint: {
                en: "L'Hôpital's Rule can only be applied once the expression is actually in an indeterminate $\\frac{\\infty}{\\infty}$ or $\\frac{0}{0}$ form — simplify what can be cancelled algebraically first.",
                id: "Aturan L'Hôpital hanya bisa diterapkan setelah ekspresinya benar-benar dalam bentuk tak tentu $\\frac{\\infty}{\\infty}$ atau $\\frac{0}{0}$ — sederhanakan dahulu apa yang bisa dicoret secara aljabar.",
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find $L = \\lim_{x\\to\\infty}\\dfrac{4x^3+2x}{7x^3-x^2}$.',
                id: 'Cari $L = \\lim_{x\\to\\infty}\\dfrac{4x^3+2x}{7x^3-x^2}$.',
              },
              blanks: [{ answer: 4 / 7 }],
              hints: [
                { en: 'Divide every term by $x^3$, the highest power present.', id: 'Bagi tiap suku dengan $x^3$, pangkat tertinggi yang ada.' },
              ],
              explain: {
                en: 'Dividing every term by $x^3$: $\\dfrac{4+2/x^2}{7-1/x}\\to\\dfrac{4}{7}\\approx 0.5714$ — same-rate growth, since the limit is finite and nonzero.',
                id: 'Membagi tiap suku dengan $x^3$: $\\dfrac{4+2/x^2}{7-1/x}\\to\\dfrac{4}{7}\\approx 0{,}5714$ — pertumbuhan laju-sama, sebab limitnya hingga dan tak nol.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m10-s2-p',
        runtime: 'math',
        title: { en: 'Ranking Growth Rates', id: 'Mengurutkan Laju Pertumbuhan' },
        brief: {
          en: 'Three limits, each settling a comparison between two functions\' growth rates.',
          id: 'Tiga limit, masing-masing menuntaskan perbandingan antara laju pertumbuhan dua fungsi.',
        },
        requirements: [
          { en: 'A limit of $\\infty$, $0$, or a finite nonzero L classifies the comparison as faster, slower, or same-rate, respectively.', id: 'Limit $\\infty$, $0$, atau L hingga tak nol berturut-turut mengklasifikasikan perbandingannya sebagai lebih cepat, lebih lambat, atau laju-sama.' },
          { en: 'Every ratio here is a $\\frac{\\infty}{\\infty}$ indeterminate form, resolved by L\'Hôpital\'s Rule or by dividing through by the highest power.', id: 'Setiap rasio di sini adalah bentuk tak tentu $\\frac{\\infty}{\\infty}$, diselesaikan dengan Aturan L\'Hôpital atau dengan membagi dengan pangkat tertinggi.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find $L = \\lim_{x\\to\\infty}\\dfrac{5x^2-3}{2x^2+x}$.', id: 'Cari $L = \\lim_{x\\to\\infty}\\dfrac{5x^2-3}{2x^2+x}$.' },
            blanks: [{ answer: 5 / 2 }],
            solution: ['\\text{Bagi dengan } x^2: \\ \\dfrac{5-3/x^2}{2+1/x}\\to \\dfrac52 = 2{,}5'],
          },
          {
            prompt: { en: 'Find $L = \\lim_{x\\to\\infty}\\dfrac{\\ln(x^2)}{\\ln(x^3)}$.', id: 'Cari $L = \\lim_{x\\to\\infty}\\dfrac{\\ln(x^2)}{\\ln(x^3)}$.' },
            blanks: [{ answer: 2 / 3 }],
            solution: ['\\dfrac{2\\ln x}{3\\ln x} = \\dfrac23 \\approx 0{,}67 \\text{ for every } x>1'],
          },
          {
            prompt: { en: 'Find $L = \\lim_{x\\to\\infty}\\dfrac{x^3}{e^x}$.', id: 'Cari $L = \\lim_{x\\to\\infty}\\dfrac{x^3}{e^x}$.' },
            blanks: [{ answer: 0 }],
            solution: ["\\text{L'Hôpital tiga kali: } \\dfrac{3x^2}{e^x}\\to\\dfrac{6x}{e^x}\\to\\dfrac{6}{e^x}\\to 0"],
          },
        ],
        hints: [
          { en: 'The second task needs no L\'Hôpital at all — the logarithm power law already turns both sides into a constant multiple of $\\ln x$.', id: 'Butir kedua tak perlu L\'Hôpital sama sekali — hukum pangkat logaritma sudah mengubah kedua ruas menjadi kelipatan konstanta dari $\\ln x$.' },
        ],
        xp: 50,
      },
    },
  ],
}
