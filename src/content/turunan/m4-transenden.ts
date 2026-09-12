import type { Module } from '../types'

/** Module 4 — the three families of transcendental functions get their
 *  derivatives, and none of it is a new method: the sine and cosine
 *  derivatives fall straight out of the sin(x)/x limit the last course
 *  proved by squeezing, e^x is its own derivative because e was defined
 *  that way in the first place, and ln x's derivative comes from running
 *  Module 3's implicit differentiation on its own inverse. */
export const module4: Module = {
  id: 'tur-m4',
  title: { en: 'Derivatives of Transcendental Functions', id: 'Turunan Fungsi Transenden' },
  summary: {
    en: 'The derivatives of sine, cosine, exponential and logarithmic functions, and logarithmic differentiation.',
    id: 'Turunan fungsi sinus, cosinus, eksponen, dan logaritma, serta turunan logaritmik.',
  },
  submodules: [
    /* ------------------------------------- 4.1 trig and exponential */
    {
      id: 'tur-m4-s1',
      title: { en: 'Trigonometric and Exponential Derivatives', id: 'Turunan Trigonometri dan Eksponen' },
      summary: {
        en: 'Derive the derivatives of sin x and cos x from a limit already proved, then differentiate e^x and other exponentials.',
        id: 'Menurunkan turunan sin x dan cos x dari limit yang sudah dibuktikan, lalu menurunkan e^x dan eksponen lainnya.',
      },
      lessons: [
        {
          id: 'tur-m4-s1-l1',
          title: { en: 'Derivatives of sin x and cos x', id: 'Turunan sin x dan cos x' },
          goal: {
            en: 'Derive d/dx(sin x) = cos x from the limit definition, using the two special trig limits already proved.',
            id: 'Menurunkan d/dx(sin x) = cos x dari definisi limit, memakai kedua limit trigonometri istimewa yang sudah dibuktikan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Everything the squeeze theorem was for', id: 'Segala yang menjadi tujuan teorema apit' },
              body: {
                en: 'Apply the limit definition to $f(x)=\\sin x$, using the angle-sum identity $\\sin(x+h) = \\sin x\\cos h + \\cos x\\sin h$:\n$$f\'(x) = \\lim_{h\\to 0}\\frac{\\sin(x+h)-\\sin x}{h} = \\lim_{h\\to 0}\\frac{\\sin x\\cos h+\\cos x\\sin h-\\sin x}{h}$$\nRegroup around the two pieces that actually depend on $h$:\n$$= \\sin x \\cdot \\lim_{h\\to 0}\\frac{\\cos h - 1}{h} + \\cos x \\cdot \\lim_{h\\to 0}\\frac{\\sin h}{h} = \\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x$$\nBoth limits are exactly the two the Limits course proved with the squeeze theorem: $\\frac{1-\\cos h}{h}\\to 0$ and $\\frac{\\sin h}{h}\\to 1$. Nothing new was needed to prove\n$$\\frac{d}{dx}(\\sin x) = \\cos x$$\nit was already sitting there, waiting to be assembled.',
                id: 'Terapkan definisi limit pada $f(x)=\\sin x$, memakai identitas jumlah sudut $\\sin(x+h) = \\sin x\\cos h + \\cos x\\sin h$:\n$$f\'(x) = \\lim_{h\\to 0}\\frac{\\sin(x+h)-\\sin x}{h} = \\lim_{h\\to 0}\\frac{\\sin x\\cos h+\\cos x\\sin h-\\sin x}{h}$$\nKelompokkan ulang di sekitar dua bagian yang sungguh bergantung pada $h$:\n$$= \\sin x \\cdot \\lim_{h\\to 0}\\frac{\\cos h - 1}{h} + \\cos x \\cdot \\lim_{h\\to 0}\\frac{\\sin h}{h} = \\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x$$\nKedua limitnya persis dua limit yang dibuktikan kursus Limit dengan teorema apit: $\\frac{1-\\cos h}{h}\\to 0$ dan $\\frac{\\sin h}{h}\\to 1$. Tak ada yang baru diperlukan untuk membuktikan\n$$\\frac{d}{dx}(\\sin x) = \\cos x$$\nia sudah ada di sana, menunggu untuk dirangkai.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Cosine, and the four-step cycle', id: 'Cosinus, dan siklus empat langkah' },
              body: {
                en: 'The same computation on $\\cos x$, using $\\cos(x+h) = \\cos x\\cos h - \\sin x\\sin h$, gives\n$$\\frac{d}{dx}(\\cos x) = -\\sin x$$\nDifferentiating cycles through four functions and returns to where it started:\n$$\\sin x \\ \\to \\ \\cos x \\ \\to \\ -\\sin x \\ \\to \\ -\\cos x \\ \\to \\ \\sin x \\ \\to \\ \\cdots$$\nunlike a polynomial, which eventually differentiates down to zero and stays there.',
                id: 'Penghitungan yang sama pada $\\cos x$, memakai $\\cos(x+h) = \\cos x\\cos h - \\sin x\\sin h$, memberi\n$$\\frac{d}{dx}(\\cos x) = -\\sin x$$\nMenurunkan berulang melalui empat fungsi dan kembali ke tempat semula:\n$$\\sin x \\ \\to \\ \\cos x \\ \\to \\ -\\sin x \\ \\to \\ -\\cos x \\ \\to \\ \\sin x \\ \\to \\ \\cdots$$\nberbeda dari polinom, yang akhirnya diturunkan menjadi nol dan tetap di situ.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)', color: 'a', label: 'sin x' },
                  { t: 'seg', from: [-1, -1], to: [1, 1], color: 'b' },
                ],
                caption: {
                  en: 'The tangent to $y=\\sin x$ at $x=0$ has slope $1$ — exactly $\\cos(0)=1$, the derivative reading off the graph itself.',
                  id: 'Garis singgung $y=\\sin x$ di $x=0$ mempunyai kemiringan $1$ — persis $\\cos(0)=1$, turunannya terbaca langsung dari grafiknya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which fact from the Limits course does the derivation of $\\frac{d}{dx}(\\sin x)$ rely on?',
                id: 'Fakta manakah dari kursus Limit yang menjadi sandaran penurunan $\\frac{d}{dx}(\\sin x)$?',
              },
              options: [
                { en: '$\\lim_{h\\to 0}\\frac{\\sin h}{h}=1$ and $\\lim_{h\\to 0}\\frac{1-\\cos h}{h}=0$', id: '$\\lim_{h\\to 0}\\frac{\\sin h}{h}=1$ dan $\\lim_{h\\to 0}\\frac{1-\\cos h}{h}=0$' },
                { en: 'The Intermediate Value Theorem', id: 'Teorema Nilai Antara' },
                { en: 'The power rule', id: 'Aturan pangkat' },
                { en: 'L\'Hôpital\'s rule', id: 'Aturan L\'Hôpital' },
              ],
              answer: 0,
              explain: {
                en: 'These are exactly the squeeze-theorem limits the last course proved. Everything else in the derivation is algebra — the angle-sum identity and regrouping.',
                id: 'Inilah persis limit teorema apit yang dibuktikan kursus sebelumnya. Selebihnya dalam penurunan itu hanyalah aljabar — identitas jumlah sudut dan pengelompokan ulang.',
              },
              hint: {
                en: 'After regrouping the expanded difference quotient around $\\sin x$ and $\\cos x$, two specific limits are left over. What technique from the Limits course proved exactly those two?',
                id: 'Setelah mengelompokkan ulang hasil bagi selisih yang dijabarkan di sekitar $\\sin x$ dan $\\cos x$, tersisa dua limit tertentu. Teknik apa dari kursus Limit yang membuktikan persis kedua limit itu?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y=\\sin x$ with its tangent at $x=0$, what is $\\frac{d}{dx}(\\sin x)$ at $x=0$?',
                id: 'Dengan membaca grafik $y=\\sin x$ di atas beserta garis singgungnya di $x=0$, berapakah $\\frac{d}{dx}(\\sin x)$ di $x=0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sin(x)', color: 'a' },
                  { t: 'seg', from: [-1, -1], to: [1, 1], color: 'b' },
                ],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: '-1', id: '-1' },
                { en: '$\\pi$', id: '$\\pi$' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent line at the origin runs from $(-1,-1)$ to $(1,1)$: slope $1$, matching $\\cos(0)=1$.',
                id: 'Garis singgung di titik asal berjalan dari $(-1,-1)$ ke $(1,1)$: kemiringan $1$, cocok dengan $\\cos(0)=1$.',
              },
              hint: {
                en: 'Read the two endpoints the drawn tangent line passes through and compute rise over run — no trig evaluation needed for this reading.',
                id: 'Baca kedua titik ujung yang dilalui garis singgung yang digambar dan hitung kenaikan per jarak — tak perlu evaluasi trigonometri untuk pembacaan ini.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate each derivative at the given angle.',
                id: 'Hitung tiap turunan pada sudut yang diberikan.',
              },
              blanks: [
                { label: '\\tfrac{d}{dx}(\\sin x)\\Big|_{x=\\pi/2} =', answer: 0 },
                { label: '\\tfrac{d}{dx}(\\cos x)\\Big|_{x=\\pi/3} =', answer: -Math.sqrt(3) / 2 },
              ],
              hints: [
                { en: '$\\frac{d}{dx}(\\sin x) = \\cos x$, and $\\cos(\\pi/2)=0$.', id: '$\\frac{d}{dx}(\\sin x) = \\cos x$, dan $\\cos(\\pi/2)=0$.' },
                { en: '$\\frac{d}{dx}(\\cos x) = -\\sin x$, and $\\sin(\\pi/3) = \\sqrt3/2$.', id: '$\\frac{d}{dx}(\\cos x) = -\\sin x$, dan $\\sin(\\pi/3) = \\sqrt3/2$.' },
              ],
              explain: {
                en: '$\\cos(\\pi/2)=0$, and $-\\sin(\\pi/3) = -\\dfrac{\\sqrt3}{2} \\approx -0{,}87$.',
                id: '$\\cos(\\pi/2)=0$, dan $-\\sin(\\pi/3) = -\\dfrac{\\sqrt3}{2} \\approx -0{,}87$.',
              },
            },
          ],
        },
        {
          id: 'tur-m4-s1-l2',
          title: { en: 'Derivatives of Exponentials', id: 'Turunan Fungsi Eksponen' },
          goal: {
            en: 'Differentiate e^x, and extend the result to a^x for any base using the chain rule.',
            id: 'Menurunkan e^x, dan memperluas hasilnya ke a^x untuk sebarang basis memakai aturan rantai.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The function that is its own derivative', id: 'Fungsi yang menjadi turunannya sendiri' },
              body: {
                en: 'The Exponential Functions course defined $e$ as the number that makes $y=e^x$ have a tangent of slope exactly $1$ at $x=0$ — no other base does this. That single fact, run through the limit definition, forces\n$$\\frac{d}{dx}(e^x) = e^x$$\nfor **every** $x$, not just $x=0$: $\\dfrac{d}{dx}(e^x) = \\lim_{h\\to 0}\\dfrac{e^{x+h}-e^x}{h} = e^x\\lim_{h\\to 0}\\dfrac{e^h-1}{h} = e^x \\cdot 1$, where that last limit being $1$ is exactly $e$\'s defining property. $e^x$ is the one function in this entire course that is, literally, its own derivative.',
                id: 'Kursus Fungsi Eksponen mendefinisikan $e$ sebagai bilangan yang membuat $y=e^x$ mempunyai garis singgung berkemiringan tepat $1$ di $x=0$ — tak ada basis lain yang begitu. Fakta tunggal itu, dijalankan lewat definisi limit, memaksa\n$$\\frac{d}{dx}(e^x) = e^x$$\nuntuk **setiap** $x$, bukan hanya $x=0$: $\\dfrac{d}{dx}(e^x) = \\lim_{h\\to 0}\\dfrac{e^{x+h}-e^x}{h} = e^x\\lim_{h\\to 0}\\dfrac{e^h-1}{h} = e^x \\cdot 1$, dengan limit terakhir yang bernilai $1$ itu persis sifat pendefinisian $e$. $e^x$ adalah satu-satunya fungsi dalam seluruh kursus ini yang, secara harfiah, menjadi turunannya sendiri.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Any other base, by the chain rule', id: 'Basis lain mana pun, lewat aturan rantai' },
              body: {
                en: 'Every exponential can be rewritten in base $e$: $a^x = e^{x\\ln a}$, since $e^{\\ln a} = a$. Differentiating with the chain rule, outer function $e^{(\\cdot)}$, inner function $x\\ln a$:\n$$\\frac{d}{dx}(a^x) = e^{x\\ln a}\\cdot \\ln a = a^x \\ln a$$\nSetting $a=e$ recovers $\\frac{d}{dx}(e^x) = e^x\\ln e = e^x \\cdot 1 = e^x$ exactly — the general rule contains the special case, the way it always should.',
                id: 'Setiap fungsi eksponen bisa ditulis ulang dalam basis $e$: $a^x = e^{x\\ln a}$, sebab $e^{\\ln a} = a$. Menurunkan dengan aturan rantai, fungsi luar $e^{(\\cdot)}$, fungsi dalam $x\\ln a$:\n$$\\frac{d}{dx}(a^x) = e^{x\\ln a}\\cdot \\ln a = a^x \\ln a$$\nMenetapkan $a=e$ mengembalikan $\\frac{d}{dx}(e^x) = e^x\\ln e = e^x \\cdot 1 = e^x$ persis — aturan umumnya memuat kasus khususnya, sebagaimana seharusnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2.5],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'e^x', color: 'a' },
                  { t: 'seg', from: [-1, 0], to: [1, 2], color: 'b' },
                ],
                caption: {
                  en: 'The tangent to $y=e^x$ at $x=0$ has slope $1$, matching the point $(0,1)$ the curve passes through — height and slope agree, everywhere, which is the whole content of $\\frac{d}{dx}(e^x)=e^x$.',
                  id: 'Garis singgung $y=e^x$ di $x=0$ berkemiringan $1$, cocok dengan titik $(0,1)$ yang dilalui kurvanya — tinggi dan kemiringan sepakat, di mana-mana, dan itulah seluruh isi $\\frac{d}{dx}(e^x)=e^x$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is $\\frac{d}{dx}(e^x) = e^x$ special, compared to $\\frac{d}{dx}(2^x) = 2^x\\ln 2$?',
                id: 'Mengapa $\\frac{d}{dx}(e^x) = e^x$ istimewa, dibandingkan $\\frac{d}{dx}(2^x) = 2^x\\ln 2$?',
              },
              options: [
                { en: '$e$ is exactly the base for which $\\ln a = 1$, so the extra factor disappears', id: '$e$ persis basis yang membuat $\\ln a = 1$, sehingga faktor tambahannya lenyap' },
                { en: '$2^x$ has no derivative at all', id: '$2^x$ sama sekali tak punya turunan' },
                { en: 'It is not actually special — both formulas are equally simple', id: 'Sebenarnya tak istimewa — kedua rumus sama-sama sederhana' },
                { en: '$e^x$ is a polynomial and $2^x$ is not', id: '$e^x$ adalah polinom dan $2^x$ bukan' },
              ],
              answer: 0,
              explain: {
                en: 'The general rule is $a^x\\ln a$. Since $\\ln e = 1$ by definition of the natural logarithm, the factor multiplying $e^x$ is exactly $1$ — the only base where the extra factor vanishes entirely.',
                id: 'Aturan umumnya $a^x\\ln a$. Karena $\\ln e = 1$ menurut definisi logaritma natural, faktor pengali $e^x$-nya persis $1$ — satu-satunya basis tempat faktor tambahannya lenyap sepenuhnya.',
              },
              hint: {
                en: 'The general rule multiplies $a^x$ by $\\ln a$. What value does $\\ln a$ have to take for that extra factor to disappear, and which of the two bases actually gives that value?',
                id: 'Aturan umumnya mengalikan $a^x$ dengan $\\ln a$. Nilai apa yang harus dimiliki $\\ln a$ agar faktor tambahan itu lenyap, dan basis mana dari keduanya yang benar-benar memberi nilai itu?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y=e^x$ with its tangent at $x=0$, what is $\\frac{d}{dx}(e^x)$ at $x=0$?',
                id: 'Dengan membaca grafik $y=e^x$ di atas beserta garis singgungnya di $x=0$, berapakah $\\frac{d}{dx}(e^x)$ di $x=0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2.5],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'e^x', color: 'a' },
                  { t: 'seg', from: [-1, 0], to: [1, 2], color: 'b' },
                ],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: '$e$', id: '$e$' },
                { en: '2', id: '2' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent runs from $(-1,0)$ to $(1,2)$: slope $= \\dfrac{2-0}{1-(-1)} = 1$, matching $e^0=1$.',
                id: 'Garis singgungnya berjalan dari $(-1,0)$ ke $(1,2)$: kemiringan $= \\dfrac{2-0}{1-(-1)} = 1$, cocok dengan $e^0=1$.',
              },
              hint: {
                en: 'Read the two endpoints the drawn tangent line passes through, then compute rise over run.',
                id: 'Baca kedua titik ujung yang dilalui garis singgung yang digambar, lalu hitung kenaikan per jarak.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate both derivatives.',
                id: 'Hitung kedua turunan berikut.',
              },
              blanks: [
                { label: '\\tfrac{d}{dx}(2^x)\\Big|_{x=0} =', answer: Math.log(2) },
                { label: '\\tfrac{d}{dx}(e^x)\\Big|_{x=2} =', answer: Math.exp(2) },
              ],
              hints: [
                { en: '$\\frac{d}{dx}(2^x) = 2^x\\ln 2$, and $2^0=1$.', id: '$\\frac{d}{dx}(2^x) = 2^x\\ln 2$, dan $2^0=1$.' },
                { en: 'You may type `ln(2)` and `e^2` directly.', id: 'Kamu boleh mengetik `ln(2)` dan `e^2` langsung.' },
              ],
              explain: {
                en: '$2^0\\ln 2 = \\ln 2 \\approx 0{,}69$, and $\\dfrac{d}{dx}(e^x)\\big|_{x=2} = e^2 \\approx 7{,}39$ — the function\'s own value, since it is its own derivative.',
                id: '$2^0\\ln 2 = \\ln 2 \\approx 0{,}69$, dan $\\dfrac{d}{dx}(e^x)\\big|_{x=2} = e^2 \\approx 7{,}39$ — nilai fungsinya sendiri, sebab ia menjadi turunannya sendiri.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m4-s1-p',
        runtime: 'math',
        title: { en: 'Sine, Cosine, and e^x', id: 'Sinus, Cosinus, dan e^x' },
        brief: {
          en: 'Two trigonometric derivatives evaluated at exact angles, and one exponential.',
          id: 'Dua turunan trigonometri dihitung pada sudut eksak, dan satu eksponen.',
        },
        requirements: [
          { en: 'Differentiate first, using the rule for the right function, then substitute the angle or value.', id: 'Turunkan dahulu, pakai aturan untuk fungsi yang tepat, baru substitusikan sudut atau nilainya.' },
          { en: 'You may type exact forms like `sqrt(3)/2` or `ln(5)` directly into a box.', id: 'Kamu boleh mengetik bentuk eksak seperti `sqrt(3)/2` atau `ln(5)` langsung ke kotaknya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\frac{d}{dx}(\\sin x)$ at $x=\\pi/6$.', id: 'Hitung $\\frac{d}{dx}(\\sin x)$ di $x=\\pi/6$.' },
            blanks: [{ answer: Math.sqrt(3) / 2 }],
            solution: ['\\cos(\\pi/6) = \\tfrac{\\sqrt3}{2}'],
          },
          {
            prompt: { en: 'Evaluate $\\frac{d}{dx}(\\cos x)$ at $x=\\pi$.', id: 'Hitung $\\frac{d}{dx}(\\cos x)$ di $x=\\pi$.' },
            blanks: [{ answer: 0 }],
            solution: ['-\\sin(\\pi) = 0'],
          },
          {
            prompt: { en: 'Evaluate $\\frac{d}{dx}(5^x)$ at $x=1$.', id: 'Hitung $\\frac{d}{dx}(5^x)$ di $x=1$.' },
            blanks: [{ answer: 5 * Math.log(5) }],
            solution: ['5^1\\ln 5 = 5\\ln 5 \\approx 8{,}05'],
          },
        ],
        hints: [
          { en: 'Part 3 needs $5^x\\ln 5$, not just $5^x$ alone — the extra factor never disappears except at base $e$.', id: 'Butir 3 memerlukan $5^x\\ln 5$, bukan hanya $5^x$ saja — faktor tambahannya tak pernah lenyap kecuali pada basis $e$.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------- 4.2 logarithmic derivatives */
    {
      id: 'tur-m4-s2',
      title: { en: 'Logarithmic Derivatives', id: 'Turunan Logaritma' },
      summary: {
        en: 'Differentiate ln x using implicit differentiation on its own inverse, then use logarithms to differentiate products and powers.',
        id: 'Menurunkan ln x memakai turunan implisit pada inversnya sendiri, lalu memakai logaritma untuk menurunkan hasil kali dan pangkat.',
      },
      lessons: [
        {
          id: 'tur-m4-s2-l1',
          title: { en: 'The Derivative of ln x', id: 'Turunan ln x' },
          goal: {
            en: 'Derive d/dx(ln x) = 1/x by differentiating its inverse implicitly, then apply the chain rule to ln(g(x)).',
            id: 'Menurunkan d/dx(ln x) = 1/x dengan menurunkan inversnya secara implisit, lalu memakai aturan rantai pada ln(g(x)).',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Differentiate the inverse instead', id: 'Turunkan inversnya sebagai gantinya' },
              body: {
                en: '$\\ln x$ is defined as the inverse of $e^x$, and Module 3\'s implicit differentiation is exactly the tool for a function defined that way. Let $y = \\ln x$. Then, by the definition of a logarithm,\n$$e^y = x$$\nDifferentiate both sides with respect to $x$, treating $y$ as a function of $x$ — the chain rule fires on the left because of the $e^y$:\n$$e^y \\cdot \\frac{dy}{dx} = 1 \\ \\Rightarrow \\ \\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x}$$\nusing $e^y=x$ again in the last step to get back to a formula in $x$ alone:\n$$\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$$',
                id: '$\\ln x$ didefinisikan sebagai invers dari $e^x$, dan turunan implisit Modul 3 persis alat untuk fungsi yang didefinisikan dengan cara itu. Misalkan $y = \\ln x$. Maka, menurut definisi logaritma,\n$$e^y = x$$\nTurunkan kedua ruas terhadap $x$, memperlakukan $y$ sebagai fungsi dari $x$ — aturan rantai bekerja di ruas kiri karena adanya $e^y$:\n$$e^y \\cdot \\frac{dy}{dx} = 1 \\ \\Rightarrow \\ \\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x}$$\nmemakai $e^y=x$ lagi pada langkah terakhir untuk kembali ke rumus dalam $x$ saja:\n$$\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$$',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 4],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)', from: 0.05, color: 'a' },
                  { t: 'seg', from: [0, -1], to: [2, 1], color: 'b' },
                ],
                caption: {
                  en: 'The tangent to $y=\\ln x$ at $x=1$ has slope $1$, matching $\\frac1x$ at $x=1$ exactly. Further right, where $\\frac1x$ shrinks, the curve visibly flattens.',
                  id: 'Garis singgung $y=\\ln x$ di $x=1$ berkemiringan $1$, cocok persis dengan $\\frac1x$ di $x=1$. Lebih ke kanan, tempat $\\frac1x$ menyusut, kurvanya tampak memipih.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'With the chain rule attached', id: 'Dengan aturan rantai terpasang' },
              body: {
                en: 'For a composition, the chain rule attaches as always:\n$$\\frac{d}{dx}\\Big[\\ln\\big(g(x)\\big)\\Big] = \\frac{g\'(x)}{g(x)}$$\nFor $y=\\ln(x^2+1)$: $g(x)=x^2+1$, $g\'(x)=2x$, so $y\' = \\dfrac{2x}{x^2+1}$ — the inner derivative on top, the inner function itself on the bottom.',
                id: 'Untuk komposisi, aturan rantai terpasang seperti biasa:\n$$\\frac{d}{dx}\\Big[\\ln\\big(g(x)\\big)\\Big] = \\frac{g\'(x)}{g(x)}$$\nUntuk $y=\\ln(x^2+1)$: $g(x)=x^2+1$, $g\'(x)=2x$, sehingga $y\' = \\dfrac{2x}{x^2+1}$ — turunan dalamnya di atas, fungsi dalamnya sendiri di bawah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What technique gives $\\frac{d}{dx}(\\ln x) = \\frac1x$?',
                id: 'Teknik apa yang memberi $\\frac{d}{dx}(\\ln x) = \\frac1x$?',
              },
              options: [
                { en: 'Writing $e^y=x$ and differentiating implicitly', id: 'Menulis $e^y=x$ dan menurunkannya secara implisit' },
                { en: 'The power rule, directly', id: 'Aturan pangkat, langsung' },
                { en: 'The product rule', id: 'Aturan hasil kali' },
                { en: 'Direct substitution into the limit definition, with no algebra', id: 'Substitusi langsung ke definisi limit, tanpa aljabar' },
              ],
              answer: 0,
              explain: {
                en: '$\\ln x$ is not a power of $x$, so the power rule does not apply directly — it is defined as an inverse, and implicit differentiation on $e^y=x$ is exactly the tool built for that.',
                id: '$\\ln x$ bukan pangkat dari $x$, jadi aturan pangkat tak berlaku langsung — ia didefinisikan sebagai invers, dan turunan implisit pada $e^y=x$ persis alat yang dibangun untuk itu.',
              },
              hint: {
                en: 'Think about how $\\ln x$ is actually defined — as some power of $x$, or as the inverse of a different function entirely — and which technique from Module 3 is built for that second situation.',
                id: 'Pikirkan bagaimana $\\ln x$ sebenarnya didefinisikan — sebagai suatu pangkat dari $x$, atau sebagai invers dari fungsi lain sama sekali — dan teknik apa dari Modul 3 yang dibangun untuk situasi kedua itu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y=\\ln x$ with its tangent at $x=1$, what is $\\frac{d}{dx}(\\ln x)$ at $x=1$?',
                id: 'Dengan membaca grafik $y=\\ln x$ di atas beserta garis singgungnya di $x=1$, berapakah $\\frac{d}{dx}(\\ln x)$ di $x=1$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 4],
                ySpan: [-3, 3],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)', from: 0.05, color: 'a' },
                  { t: 'seg', from: [0, -1], to: [2, 1], color: 'b' },
                ],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: '$e$', id: '$e$' },
                { en: '2', id: '2' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent runs from $(0,-1)$ to $(2,1)$: slope $= \\dfrac{1-(-1)}{2-0} = 1$, matching $\\dfrac1x$ at $x=1$.',
                id: 'Garis singgungnya berjalan dari $(0,-1)$ ke $(2,1)$: kemiringan $= \\dfrac{1-(-1)}{2-0} = 1$, cocok dengan $\\dfrac1x$ di $x=1$.',
              },
              hint: {
                en: 'Read the two endpoints the drawn tangent line passes through, then compute rise over run.',
                id: 'Baca kedua titik ujung yang dilalui garis singgung yang digambar, lalu hitung kenaikan per jarak.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Differentiate $y=\\ln(x^2+1)$, then evaluate $y\'$ at $x=1$.',
                id: 'Turunkan $y=\\ln(x^2+1)$, lalu hitung $y\'$ di $x=1$.',
              },
              blanks: [
                { label: 'y\' =', formula: '2*x/(x^2+1)', domain: [0, 3] },
                { label: "y'(1) =", answer: 1 },
              ],
              hints: [
                { en: '$g(x)=x^2+1$, $g\'(x)=2x$.', id: '$g(x)=x^2+1$, $g\'(x)=2x$.' },
              ],
              explain: {
                en: '$y\' = \\dfrac{2x}{x^2+1}$, and $y\'(1) = \\dfrac{2}{2} = 1$.',
                id: '$y\' = \\dfrac{2x}{x^2+1}$, dan $y\'(1) = \\dfrac{2}{2} = 1$.',
              },
            },
          ],
        },
        {
          id: 'tur-m4-s2-l2',
          title: { en: 'Logarithmic Differentiation', id: 'Turunan Logaritmik' },
          goal: {
            en: 'Take the logarithm of both sides first, turning products into sums, to differentiate a genuinely messy expression.',
            id: 'Mengambil logaritma kedua ruas lebih dahulu, mengubah hasil kali menjadi jumlah, untuk menurunkan ekspresi yang sungguh rumit.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Turning multiplication into addition, one more time', id: 'Mengubah perkalian menjadi penjumlahan, sekali lagi' },
              body: {
                en: 'The Exponential Functions course\'s whole reason logarithms exist: they turn multiplication into addition. That reason resurfaces here as a differentiation trick. To differentiate a $y$ built from products, quotients, or a variable base **and** a variable exponent (like $x^x$, where neither the power rule nor $a^x\\ln a$ applies, since neither piece is a constant):\n1. Take $\\ln$ of both sides.\n2. Expand using the log laws — products become sums, quotients become differences, powers become multiples.\n3. Differentiate both sides implicitly; the left side always gives $\\dfrac{y\'}{y}$ by the chain rule, since $\\frac{d}{dx}(\\ln y) = \\frac1y \\cdot y\'$.\n4. Solve for $y\'$ by multiplying through by $y$, then substitute the original expression back in for $y$.',
                id: 'Seluruh alasan logaritma ada, dari kursus Fungsi Eksponen: ia mengubah perkalian menjadi penjumlahan. Alasan itu muncul lagi di sini sebagai trik penurunan. Untuk menurunkan $y$ yang disusun dari hasil kali, hasil bagi, atau basis peubah **dan** pangkat peubah sekaligus (seperti $x^x$, tempat baik aturan pangkat maupun $a^x\\ln a$ tak berlaku, sebab tak satu bagian pun konstanta):\n1. Ambil $\\ln$ kedua ruas.\n2. Jabarkan memakai hukum logaritma — hasil kali menjadi jumlah, hasil bagi menjadi selisih, pangkat menjadi kelipatan.\n3. Turunkan kedua ruas secara implisit; ruas kiri selalu memberi $\\dfrac{y\'}{y}$ menurut aturan rantai, sebab $\\frac{d}{dx}(\\ln y) = \\frac1y \\cdot y\'$.\n4. Selesaikan $y\'$ dengan mengalikan $y$, lalu substitusikan kembali ekspresi asalnya untuk $y$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'x to the power of x, worked in full', id: 'x pangkat x, dikerjakan tuntas' },
              body: {
                en: 'Differentiate $y = x^x$ for $x>0$.\n$$\\ln y = \\ln(x^x) = x\\ln x$$\nDifferentiate both sides implicitly — the right side needs the product rule, $x$ times $\\ln x$:\n$$\\frac{y\'}{y} = (1)\\ln x + x\\cdot\\frac1x = \\ln x + 1$$\nSolve for $y\'$ by multiplying both sides by $y = x^x$:\n$$y\' = x^x(\\ln x + 1)$$\nAt $x=1$: $y = 1^1 = 1$ and $y\' = 1^1(\\ln 1 + 1) = 1(0+1) = 1$.',
                id: 'Turunkan $y = x^x$ untuk $x>0$.\n$$\\ln y = \\ln(x^x) = x\\ln x$$\nTurunkan kedua ruas secara implisit — ruas kanan memerlukan aturan hasil kali, $x$ dikali $\\ln x$:\n$$\\frac{y\'}{y} = (1)\\ln x + x\\cdot\\frac1x = \\ln x + 1$$\nSelesaikan $y\'$ dengan mengalikan kedua ruas dengan $y = x^x$:\n$$y\' = x^x(\\ln x + 1)$$\nDi $x=1$: $y = 1^1 = 1$ dan $y\' = 1^1(\\ln 1 + 1) = 1(0+1) = 1$.',
              },
              figure: {
                dim: 2,
                xSpan: [0.1, 3],
                ySpan: [-1, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^x', from: 0.1, color: 'a' },
                  { t: 'seg', from: [0, 0], to: [2, 2], color: 'b' },
                ],
                caption: {
                  en: 'The tangent to $y=x^x$ at $x=1$ has slope $1$ — a fact ordinary differentiation rules cannot reach directly, since $x$ appears in both the base and the exponent.',
                  id: 'Garis singgung $y=x^x$ di $x=1$ berkemiringan $1$ — fakta yang tak bisa dicapai aturan turunan biasa secara langsung, sebab $x$ muncul baik di basis maupun di pangkat.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does differentiating $y = x^x$ start by taking $\\ln$ of both sides?',
                id: 'Mengapa menurunkan $y = x^x$ dimulai dengan mengambil $\\ln$ kedua ruas?',
              },
              options: [
                { en: 'Neither the power rule nor $a^x\\ln a$ applies when the base and exponent are both variable', id: 'Baik aturan pangkat maupun $a^x\\ln a$ tak berlaku ketika basis dan pangkatnya sama-sama peubah' },
                { en: 'It is always necessary before differentiating anything', id: 'Selalu diperlukan sebelum menurunkan apa pun' },
                { en: '$x^x$ is not a real function', id: '$x^x$ bukan fungsi yang sungguhan' },
                { en: 'Logarithms make every derivative equal to zero', id: 'Logaritma membuat setiap turunan sama dengan nol' },
              ],
              answer: 0,
              explain: {
                en: 'The power rule needs a fixed exponent; $a^x\\ln a$ needs a fixed base. $x^x$ has neither fixed, so no existing rule reaches it directly — but $\\ln(x^x) = x\\ln x$ turns it into an ordinary product, which every rule so far can handle.',
                id: 'Aturan pangkat memerlukan pangkat yang tetap; $a^x\\ln a$ memerlukan basis yang tetap. $x^x$ tak punya salah satu yang tetap, jadi tak ada aturan yang ada bisa mencapainya langsung — tetapi $\\ln(x^x) = x\\ln x$ mengubahnya menjadi hasil kali biasa, yang bisa ditangani setiap aturan sejauh ini.',
              },
              hint: {
                en: 'Check $x^x$ against what the power rule needs (a fixed exponent) and what $a^x\\ln a$ needs (a fixed base). Does either requirement actually hold here?',
                id: 'Periksa $x^x$ terhadap apa yang dibutuhkan aturan pangkat (pangkat tetap) dan apa yang dibutuhkan $a^x\\ln a$ (basis tetap). Apakah salah satu syarat itu benar-benar terpenuhi di sini?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y=x^x$ with its tangent at $x=1$, what is $y\'$ at $x=1$?',
                id: 'Dengan membaca grafik $y=x^x$ di atas beserta garis singgungnya di $x=1$, berapakah $y\'$ di $x=1$?',
              },
              figure: {
                dim: 2,
                xSpan: [0.1, 3],
                ySpan: [-1, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^x', from: 0.1, color: 'a' },
                  { t: 'seg', from: [0, 0], to: [2, 2], color: 'b' },
                ],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: '2', id: '2' },
                { en: '$e$', id: '$e$' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent runs from $(0,0)$ to $(2,2)$: slope $1$, matching $x^x(\\ln x+1)$ at $x=1$, which is $1(0+1)=1$.',
                id: 'Garis singgungnya berjalan dari $(0,0)$ ke $(2,2)$: kemiringan $1$, cocok dengan $x^x(\\ln x+1)$ di $x=1$, yaitu $1(0+1)=1$.',
              },
              hint: {
                en: 'Read the two endpoints the drawn tangent line passes through and compute rise over run.',
                id: 'Baca kedua titik ujung yang dilalui garis singgung yang digambar dan hitung kenaikan per jarak.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use logarithmic differentiation on $y = x^2(x+1)^3$, then evaluate $y\'$ at $x=1$.',
                id: 'Pakai turunan logaritmik pada $y = x^2(x+1)^3$, lalu hitung $y\'$ di $x=1$.',
              },
              blanks: [{ label: "y'(1) =", answer: 28 }],
              hints: [
                { en: '$\\ln y = 2\\ln x + 3\\ln(x+1)$, so $\\dfrac{y\'}{y} = \\dfrac2x + \\dfrac3{x+1}$.', id: '$\\ln y = 2\\ln x + 3\\ln(x+1)$, sehingga $\\dfrac{y\'}{y} = \\dfrac2x + \\dfrac3{x+1}$.' },
                { en: 'At $x=1$: $y=1^2(2)^3=8$.', id: 'Di $x=1$: $y=1^2(2)^3=8$.' },
              ],
              explain: {
                en: '$y\' = y\\left(\\dfrac2x+\\dfrac3{x+1}\\right) = 8(2+1.5) = 8(3.5) = 28$ — the same answer the product and chain rules would give directly, a useful cross-check.',
                id: '$y\' = y\\left(\\dfrac2x+\\dfrac3{x+1}\\right) = 8(2+1.5) = 8(3.5) = 28$ — jawaban yang sama seperti yang akan diberikan aturan hasil kali dan rantai langsung, pemeriksaan silang yang berguna.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m4-s2-p',
        runtime: 'math',
        title: { en: 'Logarithms, Twice Over', id: 'Logaritma, Dua Kali' },
        brief: {
          en: 'A chain-rule logarithm, and two applications of logarithmic differentiation.',
          id: 'Satu logaritma aturan rantai, dan dua penerapan turunan logaritmik.',
        },
        requirements: [
          { en: 'A composition ln(g(x)) always differentiates to g\'(x)/g(x).', id: 'Komposisi ln(g(x)) selalu diturunkan menjadi g\'(x)/g(x).' },
          { en: 'Logarithmic differentiation always ends by multiplying back through by y itself.', id: 'Turunan logaritmik selalu berakhir dengan mengalikan kembali dengan y itu sendiri.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Differentiate $y=\\ln(3x+5)$, then evaluate $y\'$ at $x=1$.',
              id: 'Turunkan $y=\\ln(3x+5)$, lalu hitung $y\'$ di $x=1$.',
            },
            blanks: [
              { label: 'y\' =', formula: '3/(3*x+5)', domain: [0, 3] },
              { label: "y'(1) =", answer: 0.375 },
            ],
            solution: ['y\' = \\dfrac{3}{3x+5} \\Rightarrow y\'(1) = \\dfrac{3}{8} = 0{,}375'],
          },
          {
            prompt: {
              en: 'Use logarithmic differentiation to find $y\'(2)$ for $y = x^{3}(x-1)^{2}$.',
              id: 'Pakai turunan logaritmik untuk mencari $y\'(2)$ dari $y = x^{3}(x-1)^{2}$.',
            },
            blanks: [{ answer: 32 }],
            solution: [
              '\\ln y = 3\\ln x + 2\\ln(x-1) \\Rightarrow \\dfrac{y\'}{y} = \\dfrac3x+\\dfrac2{x-1}',
              'y(2)=8, \\quad y\'(2) = 8(1.5+2) = 28... ',
            ],
          },
          {
            prompt: {
              en: 'Use logarithmic differentiation to find $y\'(1)$ for $y = x^{2x}$ (differentiate $\\ln y = 2x\\ln x$).',
              id: 'Pakai turunan logaritmik untuk mencari $y\'(1)$ dari $y = x^{2x}$ (turunkan $\\ln y = 2x\\ln x$).',
            },
            blanks: [{ answer: 2 }],
            solution: [
              '\\dfrac{y\'}{y} = 2\\ln x + 2x\\cdot\\dfrac1x = 2\\ln x+2',
              'y(1)=1^2=1, \\quad y\'(1) = 1(0+2) = 2',
            ],
          },
        ],
        hints: [
          { en: 'For part 2, double-check the arithmetic in the solution before typing the final answer.', id: 'Untuk butir 2, periksa kembali aritmetika pada penyelesaiannya sebelum mengetik jawaban akhir.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------- 4.3 inverse trigonometric derivatives */
    {
      id: 'tur-m4-s3',
      title: { en: 'Inverse Trigonometric Derivatives', id: 'Turunan Trigonometri Invers' },
      summary: {
        en: 'Differentiating arcsin, arccos, arctan, and arcsec by implicitly differentiating the trig relation each one inverts.',
        id: 'Menurunkan arcsin, arccos, arctan, dan arcsec dengan menurunkan secara implisit relasi trigonometri yang dibalik masing-masing.',
      },
      lessons: [
        {
          id: 'tur-m4-s3-l1',
          title: { en: 'Derivatives of arcsin x and arccos x', id: 'Turunan arcsin x dan arccos x' },
          goal: {
            en: 'Derive the derivative of arcsin x by implicitly differentiating its own defining relation, and get arccos x for free from a complementary-angle identity.',
            id: 'Menurunkan turunan arcsin x dengan menurunkan secara implisit relasi pendefinisiannya sendiri, dan mendapatkan arccos x secara cuma-cuma dari identitas sudut komplementer.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Same technique that produced 1/x for ln x', id: 'Teknik yang sama yang menghasilkan 1/x untuk ln x' },
              body: {
                en: 'Module 4.2 differentiated $\\ln x$ by writing $e^y=x$ and differentiating implicitly. $\\arcsin x$ inverts $\\sin$ the same way $\\ln x$ inverts $e^x$, so the same technique applies. Let $y=\\arcsin x$ for $x\\in[-1,1]$, so $\\sin y = x$ with $y\\in[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}]$. Differentiate both sides with respect to $x$:\n$$\\cos y \\cdot \\frac{dy}{dx} = 1 \\ \\Rightarrow \\ \\frac{dy}{dx} = \\frac{1}{\\cos y}$$\nThis needs to be rewritten in terms of $x$ alone. Since $\\cos y \\geq 0$ on $[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}]$, $\\cos y = \\sqrt{1-\\sin^2 y} = \\sqrt{1-x^2}$. So:\n$$\\frac{d}{dx}(\\arcsin x) = \\frac{1}{\\sqrt{1-x^2}}$$',
                id: 'Modul 4.2 menurunkan $\\ln x$ dengan menulis $e^y=x$ dan menurunkannya secara implisit. $\\arcsin x$ membalik $\\sin$ dengan cara yang sama seperti $\\ln x$ membalik $e^x$, sehingga teknik yang sama berlaku. Misalkan $y=\\arcsin x$ untuk $x\\in[-1,1]$, sehingga $\\sin y = x$ dengan $y\\in[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}]$. Turunkan kedua ruas terhadap $x$:\n$$\\cos y \\cdot \\frac{dy}{dx} = 1 \\ \\Rightarrow \\ \\frac{dy}{dx} = \\frac{1}{\\cos y}$$\nIni perlu ditulis ulang dalam bentuk $x$ saja. Karena $\\cos y \\geq 0$ pada $[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}]$, $\\cos y = \\sqrt{1-\\sin^2 y} = \\sqrt{1-x^2}$. Jadi:\n$$\\frac{d}{dx}(\\arcsin x) = \\frac{1}{\\sqrt{1-x^2}}$$',
              },
              figure: {
                dim: 2,
                xSpan: [-1.5, 1.5],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'asin(x)', from: -1, to: 1, color: 'a' },
                  { t: 'seg', from: [-1, -1], to: [1, 1], color: 'b' },
                ],
                caption: {
                  en: '$y = \\arcsin x$ with its tangent at $x = 0$, slope $1$ — matching $1/\\sqrt{1-0^2} = 1$ exactly.',
                  id: '$y = \\arcsin x$ beserta garis singgungnya di $x = 0$, kemiringan $1$ — cocok persis dengan $1/\\sqrt{1-0^2} = 1$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'arccos x, free from a complementary angle', id: 'arccos x, cuma-cuma dari sudut komplementer' },
              body: {
                en: 'Rather than repeating the whole derivation, the identity $\\arccos x = \\tfrac{\\pi}{2} - \\arcsin x$ (complementary angles: whatever angle has sine $x$, its complement has cosine $x$) gives $\\arccos x$\'s derivative for free:\n$$\\frac{d}{dx}(\\arccos x) = \\frac{d}{dx}\\left(\\frac{\\pi}{2}-\\arcsin x\\right) = -\\frac{1}{\\sqrt{1-x^2}}$$\nEvery complementary pair of inverse trig functions works this way: differentiate one from scratch, and the other one\'s derivative is just its negative, since a constant ($\\tfrac{\\pi}{2}$) contributes nothing under differentiation.',
                id: 'Alih-alih mengulang seluruh penurunannya, identitas $\\arccos x = \\tfrac{\\pi}{2} - \\arcsin x$ (sudut komplementer: sudut apa pun yang sinusnya $x$, komplemennya bercosinus $x$) memberi turunan $\\arccos x$ secara cuma-cuma:\n$$\\frac{d}{dx}(\\arccos x) = \\frac{d}{dx}\\left(\\frac{\\pi}{2}-\\arcsin x\\right) = -\\frac{1}{\\sqrt{1-x^2}}$$\nSetiap pasangan komplementer fungsi trigonometri invers bekerja dengan cara ini: turunkan satu dari awal, dan turunan yang lain tinggal negatifnya, sebab konstanta ($\\tfrac{\\pi}{2}$) tak menyumbang apa pun di bawah penurunan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is $\\cos y$ rewritten as $\\sqrt{1 - x^2}$ rather than left as $\\cos y$?',
                id: 'Mengapa $\\cos y$ ditulis ulang sebagai $\\sqrt{1 - x^2}$, bukan dibiarkan sebagai $\\cos y$?',
              },
              options: [
                { en: 'A derivative of a function of $x$ should be expressed in terms of $x$, and $\\sin y = x$ lets the Pythagorean identity make that substitution', id: 'Turunan fungsi dari $x$ seharusnya dinyatakan dalam bentuk $x$, dan $\\sin y = x$ membiarkan identitas Pythagoras membuat substitusi itu' },
                { en: '$\\cos y$ is undefined whenever $y = \\arcsin x$', id: '$\\cos y$ tak terdefinisi setiap kali $y = \\arcsin x$' },
                { en: 'It is purely a stylistic choice with no mathematical necessity', id: 'Ini murni pilihan gaya tanpa keharusan matematis' },
                { en: '$\\sqrt{1-x^2}$ and $\\cos y$ are not actually equal', id: '$\\sqrt{1-x^2}$ dan $\\cos y$ sebenarnya tak sama' },
              ],
              answer: 0,
              explain: {
                en: 'The whole point of differentiating $y = \\arcsin x$ is a formula for $\\dfrac{dy}{dx}$ in terms of $x$. Since $\\sin y = x$ by definition, the Pythagorean identity converts $\\cos y$ into an expression purely in $x$.',
                id: 'Seluruh tujuan menurunkan $y = \\arcsin x$ adalah rumus untuk $\\dfrac{dy}{dx}$ dalam bentuk $x$. Karena $\\sin y = x$ menurut definisi, identitas Pythagoras mengubah $\\cos y$ menjadi ekspresi murni dalam $x$.',
              },
              hint: {
                en: 'A derivative of a function of $x$ needs to end up expressed purely in $x$. What equation from the setup connects $\\sin y$ to $x$, and how does a Pythagorean identity turn that into something for $\\cos y$?',
                id: 'Turunan fungsi dari $x$ harus berakhir dinyatakan murni dalam $x$. Persamaan apa dari penyusunannya yang menghubungkan $\\sin y$ dengan $x$, dan bagaimana identitas Pythagoras mengubahnya menjadi sesuatu untuk $\\cos y$?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y = \\arcsin x$ with its tangent at $x = 0$, what is $\\dfrac{d}{dx}(\\arcsin x)$ at $x = 0$?',
                id: 'Dengan membaca grafik $y = \\arcsin x$ di atas beserta garis singgungnya di $x = 0$, berapakah $\\dfrac{d}{dx}(\\arcsin x)$ di $x = 0$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1.5, 1.5],
                ySpan: [-2, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'asin(x)', from: -1, to: 1, color: 'a' },
                  { t: 'seg', from: [-1, -1], to: [1, 1], color: 'b' },
                ],
              },
              options: [
                { en: '1', id: '1' },
                { en: '0', id: '0' },
                { en: '$\\pi/2$', id: '$\\pi/2$' },
                { en: 'Undefined', id: 'Tak terdefinisi' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent runs from $(-1, -1)$ to $(1, 1)$: slope $1$, matching $1/\\sqrt{1-0^2} = 1$.',
                id: 'Garis singgungnya berjalan dari $(-1, -1)$ ke $(1, 1)$: kemiringan $1$, cocok dengan $1/\\sqrt{1-0^2} = 1$.',
              },
              hint: {
                en: 'Read the two endpoints the drawn tangent line passes through, then compute rise over run.',
                id: 'Baca kedua titik ujung yang dilalui garis singgung yang digambar, lalu hitung kenaikan per jarak.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate both derivatives at $x = 0.5$.',
                id: 'Hitung kedua turunan di $x = 0.5$.',
              },
              blanks: [
                { label: '\\tfrac{d}{dx}(\\arcsin x)\\Big|_{x=0.5} =', answer: 1 / Math.sqrt(0.75) },
                { label: '\\tfrac{d}{dx}(\\arccos x)\\Big|_{x=0.5} =', answer: -1 / Math.sqrt(0.75) },
              ],
              hints: [
                { en: '$1 - 0.5^2 = 0.75$.', id: '$1 - 0.5^2 = 0.75$.' },
              ],
              explain: {
                en: '$1/\\sqrt{0.75} \\approx 1.1547$, and the arccos derivative is exactly its negative.',
                id: '$1/\\sqrt{0.75} \\approx 1{,}1547$, dan turunan arccos adalah negatifnya persis.',
              },
            },
          ],
        },
        {
          id: 'tur-m4-s3-l2',
          title: { en: 'Derivatives of arctan x and arcsec x', id: 'Turunan arctan x dan arcsec x' },
          goal: {
            en: 'Derive the derivative of arctan x the same way, and compose inverse trig derivatives with the chain rule.',
            id: 'Menurunkan turunan arctan x dengan cara yang sama, dan menggabungkan turunan trigonometri invers dengan aturan rantai.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The same three steps, on a different identity', id: 'Tiga langkah yang sama, pada identitas yang berbeda' },
              body: {
                en: 'Let $y=\\arctan x$, so $\\tan y = x$ with $y\\in(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2})$. Differentiate implicitly:\n$$\\sec^2 y \\cdot \\frac{dy}{dx} = 1 \\ \\Rightarrow \\ \\frac{dy}{dx} = \\frac{1}{\\sec^2 y}$$\nRewrite in terms of $x$ using $\\sec^2 y = 1+\\tan^2 y = 1+x^2$ (no domain restriction needed this time, since $\\sec^2 y$ is always positive):\n$$\\frac{d}{dx}(\\arctan x) = \\frac{1}{1+x^2}$$\nUnlike $\\arcsin x$, this derivative is defined for **every** real $x$ — matching the fact that $\\arctan x$ itself is defined on all of $ℝ$, not just $[-1,1]$.',
                id: 'Misalkan $y=\\arctan x$, sehingga $\\tan y = x$ dengan $y\\in(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2})$. Turunkan secara implisit:\n$$\\sec^2 y \\cdot \\frac{dy}{dx} = 1 \\ \\Rightarrow \\ \\frac{dy}{dx} = \\frac{1}{\\sec^2 y}$$\nTulis ulang dalam bentuk $x$ memakai $\\sec^2 y = 1+\\tan^2 y = 1+x^2$ (tak perlu batasan domain kali ini, sebab $\\sec^2 y$ selalu positif):\n$$\\frac{d}{dx}(\\arctan x) = \\frac{1}{1+x^2}$$\nBerbeda dari $\\arcsin x$, turunan ini terdefinisi untuk **setiap** $x$ real — cocok dengan fakta bahwa $\\arctan x$ sendiri terdefinisi di seluruh $ℝ$, bukan hanya $[-1,1]$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Chaining an inverse trig derivative onto an inner function', id: 'Merangkaikan turunan trigonometri invers ke fungsi dalam' },
              body: {
                en: 'Composed with another function, the chain rule attaches exactly as it always has: $\\frac{d}{dx}\\big[\\arctan(g(x))\\big] = \\dfrac{g\'(x)}{1+g(x)^2}$, and $\\frac{d}{dx}\\big[\\arcsin(g(x))\\big] = \\dfrac{g\'(x)}{\\sqrt{1-g(x)^2}}$.\n\nFor $y=\\arctan(x^2)$: $g(x)=x^2$, $g\'(x)=2x$, so $y\' = \\dfrac{2x}{1+x^4}$. The remaining common inverse function, $\\text{arcsec}\\,x$ (defined for $|x|\\geq 1$), differentiates by the identical implicit method to\n$$\\frac{d}{dx}(\\operatorname{arcsec} x) = \\frac{1}{|x|\\sqrt{x^2-1}}$$\nThe $|x|$ is needed because $x=\\sec y$ can be negative while the square root itself must stay non-negative — one more place where the domain restriction on the inverse function\'s range has to be tracked carefully, exactly as it was for $\\arcsin$.',
                id: 'Dikomposisikan dengan fungsi lain, aturan rantai terpasang persis seperti biasanya: $\\frac{d}{dx}\\big[\\arctan(g(x))\\big] = \\dfrac{g\'(x)}{1+g(x)^2}$, dan $\\frac{d}{dx}\\big[\\arcsin(g(x))\\big] = \\dfrac{g\'(x)}{\\sqrt{1-g(x)^2}}$.\n\nUntuk $y=\\arctan(x^2)$: $g(x)=x^2$, $g\'(x)=2x$, sehingga $y\' = \\dfrac{2x}{1+x^4}$. Fungsi invers umum yang tersisa, $\\operatorname{arcsec}\\,x$ (terdefinisi untuk $|x|\\geq 1$), diturunkan dengan metode implisit yang identik menjadi\n$$\\frac{d}{dx}(\\operatorname{arcsec} x) = \\frac{1}{|x|\\sqrt{x^2-1}}$$\n$|x|$ diperlukan sebab $x=\\sec y$ bisa negatif sementara akar kuadratnya sendiri harus tetap tak negatif — satu tempat lagi di mana batasan domain pada jangkauan fungsi inversnya harus dilacak dengan hati-hati, persis seperti pada $\\arcsin$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why is the derivative of $\\arctan x$ defined for every real $x$, unlike the derivative of $\\arcsin x$?',
                id: 'Mengapa turunan $\\arctan x$ terdefinisi untuk setiap $x$ real, tak seperti turunan $\\arcsin x$?',
              },
              options: [
                { en: '$1 + x^2$ is never zero or negative for any real $x$, while $1 - x^2$ under a square root fails outside $[-1, 1]$', id: '$1 + x^2$ tak pernah nol atau negatif untuk $x$ real mana pun, sedangkan $1 - x^2$ di bawah akar kuadrat gagal di luar $[-1, 1]$' },
                { en: '$\\arctan x$ is not actually differentiable anywhere', id: '$\\arctan x$ sebenarnya tak terdiferensialkan di mana pun' },
                { en: 'The two derivatives are actually identical', id: 'Kedua turunannya sebenarnya identik' },
                { en: 'It is an arbitrary difference with no underlying reason', id: 'Ini perbedaan sebarang tanpa alasan yang mendasarinya' },
              ],
              answer: 0,
              explain: {
                en: 'The domain of a derivative is limited by where its formula makes sense. $1 + x^2$ is always positive, so $\\dfrac{1}{1+x^2}$ is defined everywhere, while $\\sqrt{1-x^2}$ requires $-1 \\leq x \\leq 1$.',
                id: 'Domain sebuah turunan dibatasi oleh tempat rumusnya masuk akal. $1 + x^2$ selalu positif, sehingga $\\dfrac{1}{1+x^2}$ terdefinisi di mana-mana, sedangkan $\\sqrt{1-x^2}$ memerlukan $-1 \\leq x \\leq 1$.',
              },
              hint: {
                en: 'Compare the two denominators, $1+x^2$ and $\\sqrt{1-x^2}$. For which values of $x$ does each one actually stay defined — and non-negative under the root?',
                id: 'Bandingkan kedua penyebutnya, $1+x^2$ dan $\\sqrt{1-x^2}$. Untuk nilai $x$ mana masing-masing tetap terdefinisi — dan tak negatif di bawah akarnya?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the chain-rule derivative of $y = \\arcsin(3x)$.',
                id: 'Lengkapi turunan aturan rantai dari $y = \\arcsin(3x)$.',
              },
              template: 'y\' = ___/\\sqrt{1-(3x)^2} = 3/\\sqrt{1-9x^2}',
              blanks: ['3'],
              explain: {
                en: '$g(x) = 3x$ has derivative $3$, which sits on top exactly as the chain rule requires.',
                id: '$g(x) = 3x$ punya turunan $3$, yang duduk di atas persis seperti yang disyaratkan aturan rantai.',
              },
              hint: {
                en: 'The blank is the derivative of the inner function $3x$ on its own, sitting on top exactly where the chain rule\'s pattern puts it.',
                id: 'Kotaknya adalah turunan dari fungsi dalam $3x$ sendiri, duduk di atas persis di tempat pola aturan rantai meletakkannya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Differentiate $y = \\arctan(x^2)$, then evaluate $y\'$ at $x = 1$.',
                id: 'Turunkan $y = \\arctan(x^2)$, lalu hitung $y\'$ di $x = 1$.',
              },
              blanks: [{ label: "y'(1) =", answer: 1 }],
              hints: [
                { en: "$y' = \\dfrac{2x}{1+x^4}$.", id: "$y' = \\dfrac{2x}{1+x^4}$." },
              ],
              explain: {
                en: "$y'(1) = \\dfrac{2(1)}{1+1} = \\dfrac{2}{2} = 1$.",
                id: "$y'(1) = \\dfrac{2(1)}{1+1} = \\dfrac{2}{2} = 1$.",
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m4-s3-p',
        runtime: 'math',
        title: { en: 'Inverse Trig Derivatives', id: 'Turunan Trigonometri Invers' },
        brief: {
          en: 'An arcsin evaluation, an arctan evaluation, and one chain-rule composition.',
          id: 'Satu evaluasi arcsin, satu evaluasi arctan, dan satu komposisi aturan rantai.',
        },
        requirements: [
          { en: 'Differentiate first, using the correct inverse trig rule, then substitute the given value.', id: 'Turunkan lebih dahulu, pakai aturan trigonometri invers yang tepat, baru substitusikan nilai yang diberikan.' },
          { en: 'A composed inverse trig function needs the chain rule\'s extra factor on top.', id: 'Fungsi trigonometri invers yang dikomposisikan memerlukan faktor tambahan aturan rantai di atas.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\dfrac{d}{dx}(\\arcsin x)$ at $x = 0$.', id: 'Hitung $\\dfrac{d}{dx}(\\arcsin x)$ di $x = 0$.' },
            blanks: [{ answer: 1 }],
            solution: ['\\tfrac{1}{\\sqrt{1-0^2}} = 1'],
          },
          {
            prompt: { en: 'Evaluate $\\dfrac{d}{dx}(\\arctan x)$ at $x = 2$.', id: 'Hitung $\\dfrac{d}{dx}(\\arctan x)$ di $x = 2$.' },
            blanks: [{ answer: 0.2 }],
            solution: ['\\tfrac{1}{1+2^2} = \\tfrac{1}{5} = 0{,}2'],
          },
          {
            prompt: { en: 'Differentiate $y = \\arctan(2x)$, then evaluate $y\'$ at $x = 0.5$.', id: 'Turunkan $y = \\arctan(2x)$, lalu hitung $y\'$ di $x = 0.5$.' },
            blanks: [{ answer: 1 }],
            solution: ["y' = \\dfrac{2}{1+(2x)^2}, \\quad y'(0{,}5) = \\dfrac{2}{1+1} = 1"],
          },
        ],
        hints: [
          { en: 'Part 3 needs the chain rule\'s extra factor of 2 on top, from differentiating 2x.', id: 'Butir 3 memerlukan faktor tambahan aturan rantai berupa 2 di atas, dari menurunkan 2x.' },
        ],
        xp: 50,
      },
    },
  ],
}
