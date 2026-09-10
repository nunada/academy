import type { Module } from '../types'

/** Module 4 — two techniques that go beyond the two workhorses: an odd power
 *  of sine or cosine hides a u-substitution behind an identity, a square root
 *  of a^2 - x^2 turns into a plain trig integral once the geometry that
 *  produced it is un-hidden, and a rational function too tangled for direct
 *  antidifferentiation splits into pieces Module 1 already knows how to do. */
export const module4: Module = {
  id: 'int-m4',
  title: { en: 'Trigonometric Integrals and Partial Fractions', id: 'Integral Trigonometri dan Pecahan Parsial' },
  summary: {
    en: 'Powers of sine and cosine, substitution that turns a root into an angle, and splitting a rational function before integrating it.',
    id: 'Pangkat sinus dan cosinus, substitusi yang mengubah akar menjadi sudut, dan memecah fungsi rasional sebelum mengintegralkannya.',
  },
  submodules: [
    /* ------------------------------------- 4.1 trig integrals and substitution */
    {
      id: 'int-m4-s1',
      title: { en: 'Trigonometric Integrals and Substitution', id: 'Integral Trigonometri dan Substitusi' },
      summary: {
        en: 'Integrating odd and even powers of sine and cosine, then substituting a trig function to clear a stubborn square root.',
        id: 'Mengintegralkan pangkat ganjil dan genap dari sinus dan cosinus, lalu mensubstitusikan fungsi trigonometri untuk menghilangkan akar yang membandel.',
      },
      lessons: [
        {
          id: 'int-m4-s1-l1',
          title: { en: 'Integrals of Powers of Sine and Cosine', id: 'Integral Pangkat Sinus dan Cosinus' },
          goal: {
            en: 'Peel one factor off an odd power to set up a substitution, and use a double-angle identity when every power is even.',
            id: 'Melepaskan satu faktor dari pangkat ganjil untuk menyiapkan substitusi, dan memakai identitas sudut ganda ketika semua pangkatnya genap.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An odd power always has one factor to spare', id: 'Pangkat ganjil selalu punya satu faktor cadangan' },
              body: {
                en: '$\\int \\sin^3 x\\,dx$ has no obvious $u$ — until one factor of $\\sin x$ is peeled off and the rest rewritten with $\\sin^2 x = 1 - \\cos^2 x$:\n$$\\int \\sin^3 x\\,dx = \\int \\sin^2 x \\cdot \\sin x\\,dx = \\int (1-\\cos^2 x)\\sin x\\,dx$$\nNow $u = \\cos x$, $du = -\\sin x\\,dx$ turns it into a plain polynomial in $u$:\n$$-\\int (1-u^2)\\,du = -u + \\frac{u^3}{3} + C = -\\cos x + \\frac{\\cos^3 x}{3} + C$$\nAny odd power works the same way: peel off one factor to pair with $dx$, rewrite the remaining even power using $\\sin^2+\\cos^2=1$, then substitute.',
                id: '$\\int \\sin^3 x\\,dx$ tak punya $u$ yang jelas — sampai satu faktor $\\sin x$ dilepaskan dan sisanya ditulis ulang dengan $\\sin^2 x = 1 - \\cos^2 x$:\n$$\\int \\sin^3 x\\,dx = \\int \\sin^2 x \\cdot \\sin x\\,dx = \\int (1-\\cos^2 x)\\sin x\\,dx$$\nKini $u = \\cos x$, $du = -\\sin x\\,dx$ mengubahnya menjadi polinom biasa dalam $u$:\n$$-\\int (1-u^2)\\,du = -u + \\frac{u^3}{3} + C = -\\cos x + \\frac{\\cos^3 x}{3} + C$$\nPangkat ganjil mana pun bekerja dengan cara yang sama: lepaskan satu faktor untuk dipasangkan dengan $dx$, tulis ulang pangkat genap yang tersisa memakai $\\sin^2+\\cos^2=1$, lalu substitusikan.',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-1.5, 1.5],
                ticks: true,
                items: [{ t: 'curve', f: 'sin(x)^3', color: 'a' }],
                caption: {
                  en: '$y = \\sin^3(x)$ — an odd power, always solvable by peeling off one factor of sine.',
                  id: '$y = \\sin^3(x)$ — pangkat ganjil, selalu bisa diselesaikan dengan melepaskan satu faktor sinus.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'When every power is even, reach for the double angle', id: 'Ketika semua pangkatnya genap, pakai sudut ganda' },
              body: {
                en: 'No factor can ever be peeled off $\\sin^2 x$ to leave an even power inside — $u = \\cos x$ would need an odd $\\sin x$ left over, and there is none. Instead, rewrite with the double-angle identity $\\sin^2 x = \\frac{1-\\cos 2x}{2}$:\n$$\\int \\sin^2 x\\,dx = \\int \\frac{1-\\cos 2x}{2}\\,dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C$$\nCheck: $\\frac{d}{dx}\\left[\\frac{x}{2}-\\frac{\\sin 2x}{4}\\right] = \\frac{1}{2} - \\frac{2\\cos 2x}{4} = \\frac{1-\\cos 2x}{2} = \\sin^2 x$. The identity trades one hard power for an angle that is twice as fast — a trade that always leaves something directly integrable.',
                id: 'Tak ada faktor yang bisa dilepaskan dari $\\sin^2 x$ untuk menyisakan pangkat genap di dalamnya — $u = \\cos x$ akan memerlukan sisa $\\sin x$ ganjil, dan itu tak ada. Sebagai gantinya, tulis ulang dengan identitas sudut ganda $\\sin^2 x = \\frac{1-\\cos 2x}{2}$:\n$$\\int \\sin^2 x\\,dx = \\int \\frac{1-\\cos 2x}{2}\\,dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C$$\nPeriksa: $\\frac{d}{dx}\\left[\\frac{x}{2}-\\frac{\\sin 2x}{4}\\right] = \\frac{1}{2} - \\frac{2\\cos 2x}{4} = \\frac{1-\\cos 2x}{2} = \\sin^2 x$. Identitasnya menukar satu pangkat yang sulit dengan sudut yang dua kali lebih cepat — pertukaran yang selalu menyisakan sesuatu yang langsung bisa diintegralkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the key move for integrating an odd power like $\\sin^5(x)$?',
                id: 'Apa langkah kunci untuk mengintegralkan pangkat ganjil seperti $\\sin^5(x)$?',
              },
              options: [
                { en: 'Peel off one factor of sine, rewrite the remaining even power with $\\sin^2 = 1 - \\cos^2$, then substitute $u = \\cos x$', id: 'Lepaskan satu faktor sinus, tulis ulang pangkat genap yang tersisa dengan $\\sin^2 = 1 - \\cos^2$, lalu substitusikan $u = \\cos x$' },
                { en: 'Apply the double-angle identity directly to the odd power', id: 'Terapkan identitas sudut ganda langsung ke pangkat ganjilnya' },
                { en: 'Odd powers of sine have no antiderivative', id: 'Pangkat ganjil sinus tak punya antiturunan' },
                { en: 'Integrate term by term as if it were a polynomial in x', id: 'Integralkan suku demi suku seolah polinom dalam x' },
              ],
              answer: 0,
              explain: {
                en: 'Peeling off one factor leaves an even power, which the Pythagorean identity converts entirely into cosine — exactly what a $u = \\cos x$ substitution needs.',
                id: 'Melepaskan satu faktor menyisakan pangkat genap, yang diubah identitas Pythagoras sepenuhnya menjadi cosinus — persis yang diperlukan substitusi $u = \\cos x$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y = \\sin^3(x)$, why can this be integrated by the peel-off technique?',
                id: 'Dengan membaca grafik di atas dari $y = \\sin^3(x)$, mengapa ini bisa diintegralkan dengan teknik pelepasan faktor?',
              },
              figure: {
                dim: 2,
                xSpan: [-6.5, 6.5],
                ySpan: [-1.5, 1.5],
                ticks: true,
                items: [{ t: 'curve', f: 'sin(x)^3', color: 'a' }],
              },
              options: [
                { en: 'The exponent $3$ is odd, leaving one factor of sine to spare after using the Pythagorean identity', id: 'Pangkatnya $3$ adalah ganjil, menyisakan satu faktor sinus cadangan setelah memakai identitas Pythagoras' },
                { en: 'The curve is symmetric about the origin', id: 'Kurvanya simetris terhadap titik asal' },
                { en: 'The curve never crosses the x-axis', id: 'Kurvanya tak pernah memotong sumbu-x' },
                { en: 'It cannot be integrated at all', id: 'Sama sekali tak bisa diintegralkan' },
              ],
              answer: 0,
              explain: {
                en: 'The technique hinges entirely on the exponent\'s parity, not on any visual feature of the graph — an odd exponent is what guarantees a leftover factor for the substitution.',
                id: 'Tekniknya bergantung sepenuhnya pada paritas pangkatnya, bukan pada fitur visual grafiknya — pangkat ganjil itulah yang menjamin faktor sisa untuk substitusinya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the double-angle antiderivative of $\\cos^2(x)$.',
                id: 'Lengkapi antiturunan sudut ganda dari $\\cos^2(x)$.',
              },
              template: '\\cos^2 x = \\dfrac{1+\\cos 2x}{2} \\ \\Rightarrow \\ \\int \\cos^2 x\\,dx = \\dfrac{x}{2} + \\sin(2x)/___ + C',
              blanks: ['4'],
              explain: {
                en: 'Integrating $\\cos(2x)/2$ with respect to $x$ gives $\\sin(2x)/4$ — the inner derivative $2$ lands in the denominator.',
                id: 'Mengintegralkan $\\cos(2x)/2$ terhadap $x$ memberi $\\sin(2x)/4$ — turunan dalamnya $2$ mendarat di penyebut.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_0^\\pi \\sin^3(x)\\,dx$.',
                id: 'Hitung $\\int_0^\\pi \\sin^3(x)\\,dx$.',
              },
              blanks: [{ answer: 4 / 3 }],
              hints: [
                { en: '$F(x) = -\\cos x + \\cos^3(x)/3$.', id: '$F(x) = -\\cos x + \\cos^3(x)/3$.' },
              ],
              explain: {
                en: '$F(\\pi) = 1 - 1/3 = 2/3$. $F(0) = -1 + 1/3 = -2/3$. $F(\\pi) - F(0) = 2/3 + 2/3 = 4/3$.',
                id: '$F(\\pi) = 1 - 1/3 = 2/3$. $F(0) = -1 + 1/3 = -2/3$. $F(\\pi) - F(0) = 2/3 + 2/3 = 4/3$.',
              },
            },
          ],
        },
        {
          id: 'int-m4-s1-l2',
          title: { en: 'Trigonometric Substitution', id: 'Substitusi Trigonometri' },
          goal: {
            en: 'Substitute a sine function for x to clear a square root of the form sqrt(a squared minus x squared).',
            id: 'Mensubstitusikan fungsi sinus untuk x guna menghilangkan akar berbentuk sqrt(a kuadrat dikurangi x kuadrat).',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Choosing x = a sin(theta) to make the root vanish', id: 'Memilih x = a sin(theta) agar akarnya lenyap' },
              body: {
                en: '$\\sqrt{a^2-x^2}$ resists ordinary substitution — nothing inside is a matching derivative of anything else. But setting $x = a\\sin\\theta$ makes the Pythagorean identity clear the root completely:\n$$\\sqrt{a^2-x^2} = \\sqrt{a^2-a^2\\sin^2\\theta} = \\sqrt{a^2(1-\\sin^2\\theta)} = \\sqrt{a^2\\cos^2\\theta} = a\\cos\\theta$$\n(taking $\\cos\\theta \\geq 0$, valid for $\\theta \\in [-\\pi/2, \\pi/2]$). With $dx = a\\cos\\theta\\,d\\theta$, an integral built entirely from $x$ and the root becomes an integral entirely in $\\theta$ — exactly the powers-of-sine-and-cosine territory of the last lesson.',
                id: '$\\sqrt{a^2-x^2}$ menolak substitusi biasa — tak ada yang di dalamnya cocok sebagai turunan dari sesuatu yang lain. Tetapi menetapkan $x = a\\sin\\theta$ membuat identitas Pythagoras menghilangkan akarnya sepenuhnya:\n$$\\sqrt{a^2-x^2} = \\sqrt{a^2-a^2\\sin^2\\theta} = \\sqrt{a^2(1-\\sin^2\\theta)} = \\sqrt{a^2\\cos^2\\theta} = a\\cos\\theta$$\n(mengambil $\\cos\\theta \\geq 0$, berlaku untuk $\\theta \\in [-\\pi/2, \\pi/2]$). Dengan $dx = a\\cos\\theta\\,d\\theta$, integral yang seluruhnya dibangun dari $x$ dan akarnya menjadi integral yang seluruhnya dalam $\\theta$ — persis wilayah pangkat sinus-dan-cosinus pada pelajaran sebelumnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A quarter circle, computed by calculus and by geometry', id: 'Seperempat lingkaran, dihitung dengan kalkulus dan dengan geometri' },
              body: {
                en: 'Evaluate $\\int_0^2 \\sqrt{4-x^2}\\,dx$ with $a=2$: let $x = 2\\sin\\theta$, $dx = 2\\cos\\theta\\,d\\theta$. Bounds: $x=0 \\Rightarrow \\theta=0$; $x=2 \\Rightarrow \\theta=\\pi/2$.\n$$\\int_0^2 \\sqrt{4-x^2}\\,dx = \\int_0^{\\pi/2} 2\\cos\\theta \\cdot 2\\cos\\theta\\,d\\theta = 4\\int_0^{\\pi/2}\\cos^2\\theta\\,d\\theta = 4\\left[\\frac{\\theta}{2}+\\frac{\\sin 2\\theta}{4}\\right]_0^{\\pi/2} = 4\\cdot\\frac{\\pi}{4} = \\pi$$\nThat is not a coincidence: $y=\\sqrt{4-x^2}$ *is* the upper half of the circle $x^2+y^2=4$, so this integral is the area of a quarter-circle of radius $2$ — geometry\'s own formula, $\\frac{1}{4}\\pi r^2 = \\frac{1}{4}\\pi(4) = \\pi$, agrees exactly.',
                id: 'Hitung $\\int_0^2 \\sqrt{4-x^2}\\,dx$ dengan $a=2$: misalkan $x = 2\\sin\\theta$, $dx = 2\\cos\\theta\\,d\\theta$. Batas: $x=0 \\Rightarrow \\theta=0$; $x=2 \\Rightarrow \\theta=\\pi/2$.\n$$\\int_0^2 \\sqrt{4-x^2}\\,dx = \\int_0^{\\pi/2} 2\\cos\\theta \\cdot 2\\cos\\theta\\,d\\theta = 4\\int_0^{\\pi/2}\\cos^2\\theta\\,d\\theta = 4\\left[\\frac{\\theta}{2}+\\frac{\\sin 2\\theta}{4}\\right]_0^{\\pi/2} = 4\\cdot\\frac{\\pi}{4} = \\pi$$\nItu bukan kebetulan: $y=\\sqrt{4-x^2}$ *adalah* separuh atas lingkaran $x^2+y^2=4$, sehingga integral ini adalah luas seperempat lingkaran berjari-jari $2$ — rumus geometri sendiri, $\\frac{1}{4}\\pi r^2 = \\frac{1}{4}\\pi(4) = \\pi$, sepakat persis.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 3],
                ySpan: [-0.5, 3],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0, 2], [0.5, 1.936], [1, 1.732], [1.5, 1.323], [2, 0]], color: 'result' },
                  { t: 'curve', f: 'sqrt(4-x^2)', from: 0, to: 2, color: 'a' },
                ],
                caption: {
                  en: 'The shaded quarter-circle under $y = \\sqrt{4 - x^2}$ from $x = 0$ to $x = 2$ has area exactly $\\pi$, matching both the substitution and the geometry formula.',
                  id: 'Seperempat lingkaran bayangan di bawah $y = \\sqrt{4 - x^2}$ dari $x = 0$ sampai $x = 2$ punya luas tepat $\\pi$, cocok dengan substitusi maupun rumus geometri.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the substitution $x = a\\sin(\\theta)$ clear the square root in $\\sqrt{a^2 - x^2}$?',
                id: 'Mengapa substitusi $x = a\\sin(\\theta)$ menghilangkan akar dalam $\\sqrt{a^2 - x^2}$?',
              },
              options: [
                { en: '$a^2 - a^2\\sin^2(\\theta)$ factors as $a^2\\cos^2(\\theta)$ by the Pythagorean identity, and the square root of a perfect square is clean', id: '$a^2 - a^2\\sin^2(\\theta)$ difaktorkan sebagai $a^2\\cos^2(\\theta)$ oleh identitas Pythagoras, dan akar dari kuadrat sempurna itu bersih' },
                { en: 'Sine functions never appear under square roots', id: 'Fungsi sinus tak pernah muncul di bawah akar' },
                { en: 'It works only because $4$ is a perfect square', id: 'Hanya berlaku sebab $4$ adalah kuadrat sempurna' },
                { en: 'It does not actually clear the root — it only looks that way', id: 'Sebenarnya tak menghilangkan akarnya — hanya tampak begitu' },
              ],
              answer: 0,
              explain: {
                en: '$\\sin^2 + \\cos^2 = 1$ rearranges to $1 - \\sin^2(\\theta) = \\cos^2(\\theta)$, which is exactly what $a^2 - a^2\\sin^2(\\theta)$ becomes after factoring out $a^2$ — a perfect square under the root, for any $a$.',
                id: '$\\sin^2 + \\cos^2 = 1$ ditata ulang menjadi $1 - \\sin^2(\\theta) = \\cos^2(\\theta)$, persis yang menjadi $a^2 - a^2\\sin^2(\\theta)$ setelah memfaktorkan $a^2$ — kuadrat sempurna di bawah akar, untuk $a$ berapa pun.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, why does the quarter-circle area come out to exactly $\\pi$ rather than some other messy number?',
                id: 'Dengan membaca gambar di atas, mengapa luas seperempat lingkarannya keluar tepat $\\pi$, bukan angka rumit lainnya?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 3],
                ySpan: [-0.5, 3],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0, 2], [0.5, 1.936], [1, 1.732], [1.5, 1.323], [2, 0]], color: 'result' },
                  { t: 'curve', f: 'sqrt(4-x^2)', from: 0, to: 2, color: 'a' },
                ],
              },
              options: [
                { en: 'The curve is exactly a circular arc, so the integral equals a quarter of the circle\'s area formula', id: 'Kurvanya persis busur lingkaran, sehingga integralnya sama dengan seperempat rumus luas lingkaran' },
                { en: 'It is a coincidence with no geometric meaning', id: 'Ini kebetulan tanpa makna geometris' },
                { en: 'Every trigonometric substitution gives an answer of $\\pi$', id: 'Setiap substitusi trigonometri memberi jawaban $\\pi$' },
                { en: 'The shaded region is actually a triangle', id: 'Daerah bayangannya sebenarnya sebuah segitiga' },
              ],
              answer: 0,
              explain: {
                en: '$y = \\sqrt{4 - x^2}$ traces the upper half of the circle $x^2 + y^2 = 4$, so this region is precisely a quarter-disk of radius $2$ — its area was always going to match $\\frac{1}{4}\\pi(2^2) = \\pi$.',
                id: '$y = \\sqrt{4 - x^2}$ menjejaki separuh atas lingkaran $x^2 + y^2 = 4$, sehingga daerah ini persis seperempat cakram berjari-jari $2$ — luasnya memang akan cocok dengan $\\frac{1}{4}\\pi(2^2) = \\pi$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use trigonometric substitution to evaluate $\\int_0^3 \\sqrt{9 - x^2}\\,dx$.',
                id: 'Pakai substitusi trigonometri untuk menghitung $\\int_0^3 \\sqrt{9 - x^2}\\,dx$.',
              },
              blanks: [{ label: '=', answer: 2.25 * Math.PI }],
              hints: [
                { en: 'This is a quarter-circle of radius $3$ — the area formula $\\frac{1}{4}\\pi r^2$ checks the answer directly.', id: 'Ini seperempat lingkaran berjari-jari $3$ — rumus luas $\\frac{1}{4}\\pi r^2$ memeriksa jawabannya langsung.' },
              ],
              explain: {
                en: '$x = 3\\sin(\\theta)$ gives $9\\int_0^{\\pi/2}\\cos^2(\\theta)\\,d\\theta = 9(\\pi/4) = 9\\pi/4 \\approx 7.07$, matching $\\frac{1}{4}\\pi(3^2) = 9\\pi/4$.',
                id: '$x = 3\\sin(\\theta)$ memberi $9\\int_0^{\\pi/2}\\cos^2(\\theta)\\,d\\theta = 9(\\pi/4) = 9\\pi/4 \\approx 7,07$, cocok dengan $\\frac{1}{4}\\pi(3^2) = 9\\pi/4$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m4-s1-p',
        runtime: 'math',
        title: { en: 'Powers, Angles, and Roots', id: 'Pangkat, Sudut, dan Akar' },
        brief: {
          en: 'An odd-power integral, an even-power integral, and one trigonometric substitution.',
          id: 'Satu integral pangkat ganjil, satu integral pangkat genap, dan satu substitusi trigonometri.',
        },
        requirements: [
          { en: 'An odd power peels off one factor and uses the Pythagorean identity on the rest.', id: 'Pangkat ganjil melepaskan satu faktor dan memakai identitas Pythagoras pada sisanya.' },
          { en: 'A square root of $a^2 - x^2$ clears completely under $x = a\\sin(\\theta)$.', id: 'Akar dari $a^2 - x^2$ hilang sepenuhnya di bawah $x = a\\sin(\\theta)$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\int_0^{\\pi/2} \\cos^3(x)\\,dx$.', id: 'Hitung $\\int_0^{\\pi/2} \\cos^3(x)\\,dx$.' },
            blanks: [{ answer: 2 / 3 }],
            solution: ['F(x) = \\sin x - \\dfrac{\\sin^3 x}{3}, \\quad F(\\pi/2)-F(0) = \\left(1-\\tfrac13\\right)-0 = \\tfrac23'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^\\pi \\sin^2(x)\\,dx$.', id: 'Hitung $\\int_0^\\pi \\sin^2(x)\\,dx$.' },
            blanks: [{ answer: Math.PI / 2 }],
            solution: ['F(x) = \\dfrac{x}{2}-\\dfrac{\\sin 2x}{4}, \\quad F(\\pi)-F(0) = \\dfrac{\\pi}{2} - 0 = \\dfrac{\\pi}{2} \\approx 1{,}57'],
          },
          {
            prompt: { en: 'Use trigonometric substitution to evaluate $\\int_0^1 \\sqrt{1 - x^2}\\,dx$.', id: 'Pakai substitusi trigonometri untuk menghitung $\\int_0^1 \\sqrt{1 - x^2}\\,dx$.' },
            blanks: [{ answer: Math.PI / 4 }],
            solution: ['\\text{Quarter-circle of radius 1: } \\tfrac14\\pi(1)^2 = \\tfrac{\\pi}{4} \\approx 0{,}79'],
          },
        ],
        hints: [
          { en: 'Part 3 is another quarter-circle in disguise — the geometry formula checks the substitution result directly.', id: 'Butir 3 adalah seperempat lingkaran tersamar lainnya — rumus geometri memeriksa hasil substitusinya langsung.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------ 4.2 partial fractions */
    {
      id: 'int-m4-s2',
      title: { en: 'Partial Fractions', id: 'Pecahan Parsial' },
      summary: {
        en: 'Splitting a rational function with distinct linear factors into simple pieces, then integrating each piece separately.',
        id: 'Memecah fungsi rasional dengan faktor linear berbeda menjadi bagian sederhana, lalu mengintegralkan tiap bagian secara terpisah.',
      },
      lessons: [
        {
          id: 'int-m4-s2-l1',
          title: { en: 'Decomposing into Partial Fractions', id: 'Menguraikan Menjadi Pecahan Parsial' },
          goal: {
            en: 'Split a rational function with distinct linear factors in the denominator into a sum of simpler fractions.',
            id: 'Memecah fungsi rasional dengan faktor linear berbeda di penyebutnya menjadi jumlah pecahan yang lebih sederhana.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Running fraction addition backwards', id: 'Menjalankan penjumlahan pecahan secara terbalik' },
              body: {
                en: 'Adding $\\frac{2}{x-1} + \\frac{3}{x+2}$ over a common denominator gives $\\frac{2(x+2)+3(x-1)}{(x-1)(x+2)} = \\frac{5x+1}{(x-1)(x+2)}$. **Partial fractions** runs this backwards: given the combined fraction, recover the two simple pieces that were added to make it.\n\nFor $\\frac{5x+1}{(x-1)(x+2)}$, write $\\frac{A}{x-1} + \\frac{B}{x+2}$ and clear denominators: $5x+1 = A(x+2) + B(x-1)$. This must hold for *every* $x$, so choosing convenient values isolates each constant. At $x=1$: $5(1)+1 = A(3) \\Rightarrow 6 = 3A \\Rightarrow A=2$. At $x=-2$: $5(-2)+1 = B(-3) \\Rightarrow -9 = -3B \\Rightarrow B=3$.',
                id: 'Menjumlahkan $\\frac{2}{x-1} + \\frac{3}{x+2}$ dengan penyebut sekutu memberi $\\frac{2(x+2)+3(x-1)}{(x-1)(x+2)} = \\frac{5x+1}{(x-1)(x+2)}$. **Pecahan parsial** menjalankan ini terbalik: diberikan pecahan gabungannya, pulihkan kedua bagian sederhana yang dijumlahkan untuk membuatnya.\n\nUntuk $\\frac{5x+1}{(x-1)(x+2)}$, tulis $\\frac{A}{x-1} + \\frac{B}{x+2}$ dan hilangkan penyebutnya: $5x+1 = A(x+2) + B(x-1)$. Ini harus berlaku untuk $x$ *apa pun*, sehingga memilih nilai yang nyaman mengisolasi tiap konstanta. Di $x=1$: $5(1)+1 = A(3) \\Rightarrow 6 = 3A \\Rightarrow A=2$. Di $x=-2$: $5(-2)+1 = B(-3) \\Rightarrow -9 = -3B \\Rightarrow B=3$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Why the trick of substituting a root works', id: 'Mengapa trik mensubstitusikan sebuah akar berhasil' },
              body: {
                en: 'Substituting $x=1$ into $5x+1 = A(x+2)+B(x-1)$ makes the $B$ term vanish entirely, since $(x-1)=0$ there — the equation solves for $A$ alone with no simultaneous system needed. This only works because $x=1$ and $x=-2$ are exactly the roots of the original denominator: each root kills every term except the one built to survive it. With more than two factors, the same trick isolates one constant per root, one substitution at a time.',
                id: 'Mensubstitusikan $x=1$ ke $5x+1 = A(x+2)+B(x-1)$ membuat suku $B$ lenyap sepenuhnya, sebab $(x-1)=0$ di situ — persamaannya menyelesaikan $A$ saja tanpa perlu sistem simultan. Ini hanya berhasil karena $x=1$ dan $x=-2$ persis akar-akar dari penyebut aslinya: tiap akar mematikan setiap suku kecuali yang dibangun untuk bertahan darinya. Dengan lebih dari dua faktor, trik yang sama mengisolasi satu konstanta per akar, satu substitusi setiap kali.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does substituting $x = 1$ into $5x + 1 = A(x+2) + B(x-1)$ solve for $A$ without needing $B$ at all?',
                id: 'Mengapa mensubstitusikan $x = 1$ ke $5x + 1 = A(x+2) + B(x-1)$ menyelesaikan $A$ tanpa perlu $B$ sama sekali?',
              },
              options: [
                { en: '$x = 1$ is a root of $(x - 1)$, which makes the entire $B$ term vanish', id: '$x = 1$ adalah akar dari $(x - 1)$, yang membuat seluruh suku $B$ lenyap' },
                { en: '$B$ is always equal to zero in every partial fraction problem', id: '$B$ selalu sama dengan nol pada setiap soal pecahan parsial' },
                { en: 'It does not actually isolate $A$ — both constants remain unknown', id: 'Sebenarnya tak mengisolasi $A$ — kedua konstanta tetap tak diketahui' },
                { en: '$x = 1$ is simply the smallest convenient number to try', id: '$x = 1$ hanyalah angka nyaman terkecil untuk dicoba' },
              ],
              answer: 0,
              explain: {
                en: 'The factor $(x - 1)$ multiplying $B$ becomes zero exactly when $x = 1$, wiping out that whole term and leaving an equation in $A$ alone.',
                id: 'Faktor $(x - 1)$ yang mengalikan $B$ menjadi nol tepat ketika $x = 1$, menghapus seluruh suku itu dan menyisakan persamaan dalam $A$ saja.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Decompose $\\dfrac{7x - 6}{(x-2)(x-1)}$ into partial fractions by finding $A$ and $B$.',
                id: 'Uraikan $\\dfrac{7x - 6}{(x-2)(x-1)}$ menjadi pecahan parsial dengan mencari $A$ dan $B$.',
              },
              template: '\\dfrac{7x-6}{(x-2)(x-1)} = ___/(x-2) + ___/(x-1)',
              blanks: ['8', '-1'],
              explain: {
                en: 'At $x=2$: $7(2)-6=8=A(1)$, so $A=8$. At $x=1$: $7(1)-6=1=B(-1)$, so $B=-1$.',
                id: 'Di $x=2$: $7(2)-6=8=A(1)$, sehingga $A=8$. Di $x=1$: $7(1)-6=1=B(-1)$, sehingga $B=-1$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Decompose $\\dfrac{4}{(x-3)(x+1)}$ as $\\dfrac{A}{x-3} + \\dfrac{B}{x+1}$. Find $A$ and $B$.',
                id: 'Uraikan $\\dfrac{4}{(x-3)(x+1)}$ sebagai $\\dfrac{A}{x-3} + \\dfrac{B}{x+1}$. Cari $A$ dan $B$.',
              },
              blanks: [
                { label: 'A =', answer: 1 },
                { label: 'B =', answer: -1 },
              ],
              hints: [
                { en: 'At $x=3$: $4 = A(4)$. At $x=-1$: $4 = B(-4)$.', id: 'Di $x=3$: $4 = A(4)$. Di $x=-1$: $4 = B(-4)$.' },
              ],
              explain: {
                en: '$A = 4/4 = 1$. $B = 4/(-4) = -1$.',
                id: '$A = 4/4 = 1$. $B = 4/(-4) = -1$.',
              },
            },
          ],
        },
        {
          id: 'int-m4-s2-l2',
          title: { en: 'Integrating After Decomposition', id: 'Mengintegralkan Setelah Diuraikan' },
          goal: {
            en: 'Integrate each partial fraction using the ln|x| rule from Module 1, and combine them into one antiderivative.',
            id: 'Mengintegralkan tiap pecahan parsial memakai aturan ln|x| dari Modul 1, dan menggabungkannya menjadi satu antiturunan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Every piece is now Module 1\'s exception case', id: 'Setiap bagian kini kasus pengecualian Modul 1' },
              body: {
                en: 'Once split, each term has the shape $\\frac{k}{x-r}$ — exactly the $\\int \\frac{1}{x}\\,dx = \\ln|x|+C$ antiderivative from Module 1, shifted horizontally. For $\\frac{5x+1}{(x-1)(x+2)} = \\frac{2}{x-1}+\\frac{3}{x+2}$:\n$$\\int \\frac{5x+1}{(x-1)(x+2)}\\,dx = \\int \\frac{2}{x-1}\\,dx + \\int \\frac{3}{x+2}\\,dx = 2\\ln|x-1| + 3\\ln|x+2| + C$$\nWhat looked like an unreachable rational function at the start of this module is, after decomposition, nothing but two logarithm rules stacked together.',
                id: 'Setelah dipecah, tiap suku berbentuk $\\frac{k}{x-r}$ — persis antiturunan $\\int \\frac{1}{x}\\,dx = \\ln|x|+C$ dari Modul 1, digeser mendatar. Untuk $\\frac{5x+1}{(x-1)(x+2)} = \\frac{2}{x-1}+\\frac{3}{x+2}$:\n$$\\int \\frac{5x+1}{(x-1)(x+2)}\\,dx = \\int \\frac{2}{x-1}\\,dx + \\int \\frac{3}{x+2}\\,dx = 2\\ln|x-1| + 3\\ln|x+2| + C$$\nYang terlihat sebagai fungsi rasional yang tak terjangkau di awal modul ini, setelah diuraikan, tak lain hanyalah dua aturan logaritma yang ditumpuk bersama.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A definite integral, start to finish', id: 'Integral tentu, dari awal sampai akhir' },
              body: {
                en: 'Evaluate $\\int_2^3 \\frac{5x+1}{(x-1)(x+2)}\\,dx$ using the antiderivative just found:\n$$\\Big[2\\ln|x-1|+3\\ln|x+2|\\Big]_2^3 = \\big(2\\ln 2 + 3\\ln 5\\big) - \\big(2\\ln 1 + 3\\ln 4\\big)$$\nSince $\\ln 1 = 0$, this is $2\\ln 2 + 3\\ln 5 - 3\\ln 4 \\approx 1.386 + 4.828 - 4.159 \\approx 2.06$. Three separate skills — decomposing, antidifferentiating, and evaluating — chain together into one number.',
                id: 'Hitung $\\int_2^3 \\frac{5x+1}{(x-1)(x+2)}\\,dx$ memakai antiturunan yang baru saja ditemukan:\n$$\\Big[2\\ln|x-1|+3\\ln|x+2|\\Big]_2^3 = \\big(2\\ln 2 + 3\\ln 5\\big) - \\big(2\\ln 1 + 3\\ln 4\\big)$$\nKarena $\\ln 1 = 0$, ini adalah $2\\ln 2 + 3\\ln 5 - 3\\ln 4 \\approx 1.386 + 4.828 - 4.159 \\approx 2.06$. Tiga keterampilan terpisah — menguraikan, mengantiturunkan, dan mengevaluasi — dirangkai menjadi satu bilangan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'After decomposing into partial fractions, why is each piece easy to integrate?',
                id: 'Setelah diuraikan menjadi pecahan parsial, mengapa tiap bagiannya mudah diintegralkan?',
              },
              options: [
                { en: 'Each piece has the form $k/(x - r)$, matching the $\\ln|x|$ antiderivative shifted horizontally', id: 'Tiap bagian berbentuk $k/(x - r)$, cocok dengan antiturunan $\\ln|x|$ yang digeser mendatar' },
                { en: 'Every rational function integrates to a polynomial', id: 'Setiap fungsi rasional diintegralkan menjadi polinom' },
                { en: 'The pieces are all constant functions', id: 'Semua bagiannya adalah fungsi konstan' },
                { en: 'Partial fractions removes the need to integrate at all', id: 'Pecahan parsial menghilangkan keperluan mengintegralkan sama sekali' },
              ],
              answer: 0,
              explain: {
                en: '$k/(x - r)$ is exactly Module 1\'s exceptional power-rule case, just shifted — its antiderivative is $k \\cdot \\ln|x - r| + C$.',
                id: '$k/(x - r)$ persis kasus pengecualian aturan pangkat Modul 1, hanya digeser — antiturunannya adalah $k \\cdot \\ln|x - r| + C$.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the full solution for $\\int \\dfrac{7x-6}{(x-2)(x-1)}\\,dx$, using $A = 8$, $B = -1$ from the last lesson.',
                id: 'Susun penyelesaian lengkap untuk $\\int \\dfrac{7x-6}{(x-2)(x-1)}\\,dx$, memakai $A = 8$, $B = -1$ dari pelajaran sebelumnya.',
              },
              lines: [
                '\\dfrac{7x-6}{(x-2)(x-1)} = \\dfrac{8}{x-2} - \\dfrac{1}{x-1}',
                '\\int \\left(\\dfrac{8}{x-2} - \\dfrac{1}{x-1}\\right)dx',
                '= 8\\ln|x-2| - \\ln|x-1| + C',
              ],
              explain: {
                en: 'Write the decomposition first, then integrate term by term, then simplify to the final logarithmic form.',
                id: 'Tulis penguraiannya lebih dahulu, lalu integralkan suku demi suku, baru sederhanakan menjadi bentuk logaritma akhir.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_4^5 \\dfrac{4}{(x-3)(x+1)}\\,dx$ using $A = 1$, $B = -1$ from the last lesson. (Round to two decimal places.)',
                id: 'Hitung $\\int_4^5 \\dfrac{4}{(x-3)(x+1)}\\,dx$ memakai $A = 1$, $B = -1$ dari pelajaran sebelumnya. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 0.51 }],
              hints: [
                { en: '$F(x) = \\ln|x-3| - \\ln|x+1|$.', id: '$F(x) = \\ln|x-3| - \\ln|x+1|$.' },
              ],
              explain: {
                en: '$F(5) = \\ln 2 - \\ln 6 \\approx -1.10$. $F(4) = \\ln 1 - \\ln 5 \\approx -1.61$. $F(5) - F(4) \\approx 0.51$.',
                id: '$F(5) = \\ln 2 - \\ln 6 \\approx -1,10$. $F(4) = \\ln 1 - \\ln 5 \\approx -1,61$. $F(5) - F(4) \\approx 0,51$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m4-s2-p',
        runtime: 'math',
        title: { en: 'Decompose, Then Integrate', id: 'Uraikan, Lalu Integralkan' },
        brief: {
          en: 'One decomposition, and two definite integrals evaluated after splitting.',
          id: 'Satu penguraian, dan dua integral tentu dihitung setelah dipecah.',
        },
        requirements: [
          { en: 'Substitute each root of the denominator to isolate one constant at a time.', id: 'Substitusikan tiap akar penyebutnya untuk mengisolasi satu konstanta setiap kali.' },
          { en: 'Each partial fraction integrates to a multiple of $\\ln|x - r|$.', id: 'Tiap pecahan parsial diintegralkan menjadi kelipatan $\\ln|x - r|$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Decompose $\\dfrac{3}{(x-1)(x+2)}$ as $\\dfrac{A}{x-1} + \\dfrac{B}{x+2}$. Find $A$.', id: 'Uraikan $\\dfrac{3}{(x-1)(x+2)}$ sebagai $\\dfrac{A}{x-1} + \\dfrac{B}{x+2}$. Cari $A$.' },
            blanks: [{ answer: 1 }],
            solution: ['3 = A(x+2)+B(x-1); \\text{ at } x=1: 3=3A \\Rightarrow A=1'],
          },
          {
            prompt: { en: 'Using $A = 1$ and $B = -1$ for $\\dfrac{3}{(x-1)(x+2)}$, evaluate $\\int_2^4$ of it. (Round to two decimal places.)', id: 'Memakai $A = 1$ dan $B = -1$ untuk $\\dfrac{3}{(x-1)(x+2)}$, hitung $\\int_2^4$ darinya. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 0.69 }],
            solution: ['F(x)=\\ln|x-1|-\\ln|x+2|', 'F(4)-F(2) = (\\ln3-\\ln6)-(\\ln1-\\ln4) \\approx -0{,}693-(-1{,}386) = 0{,}69'],
          },
          {
            prompt: { en: 'Evaluate $\\int_5^6 \\dfrac{4}{(x-3)(x+1)}\\,dx$ using $A = 1$, $B = -1$. (Round to two decimal places.)', id: 'Hitung $\\int_5^6 \\dfrac{4}{(x-3)(x+1)}\\,dx$ memakai $A = 1$, $B = -1$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 0.25 }],
            solution: ['F(x)=\\ln|x-3|-\\ln|x+1|', 'F(6)-F(5) = (\\ln3-\\ln7)-(\\ln2-\\ln6) \\approx -0{,}847-(-1{,}099) = 0{,}25'],
          },
        ],
        hints: [
          { en: 'Work each logarithm to at least three decimal places before subtracting, so rounding error does not creep into the final answer.', id: 'Kerjakan tiap logaritma hingga setidaknya tiga desimal sebelum mengurangkan, agar galat pembulatan tak menyusup ke jawaban akhir.' },
        ],
        xp: 50,
      },
    },
  ],
}
