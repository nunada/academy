import type { Module } from '../types'

/** Module 3 — differentiating a function built out of another function, in
 *  two directions. The chain rule handles a composition written explicitly,
 *  $f(g(x))$; implicit differentiation handles the case where $y$ is tangled
 *  up with $x$ in one equation and was never solved for in the first place —
 *  and turns out to need the chain rule on every $y$ it touches. */
export const module3: Module = {
  id: 'tur-m3',
  title: { en: 'The Chain Rule and Implicit Differentiation', id: 'Aturan Rantai dan Turunan Implisit' },
  summary: {
    en: 'Differentiate a composition of functions, then differentiate an equation that was never solved for y at all.',
    id: 'Menurunkan komposisi fungsi, lalu menurunkan persamaan yang bahkan tak pernah diselesaikan untuk y.',
  },
  submodules: [
    /* --------------------------------------------------- 3.1 the chain rule */
    {
      id: 'tur-m3-s1',
      title: { en: 'The Chain Rule', id: 'Aturan Rantai' },
      summary: {
        en: 'Differentiate a composition by working from the outside in, then stack the rule through several layers.',
        id: 'Menurunkan komposisi dengan bekerja dari luar ke dalam, lalu menumpuk aturannya melalui beberapa lapis.',
      },
      lessons: [
        {
          id: 'tur-m3-s1-l1',
          title: { en: 'Differentiating a Composition', id: 'Menurunkan Komposisi' },
          goal: {
            en: 'Differentiate f(g(x)) by multiplying the outer derivative by the inner one.',
            id: 'Menurunkan f(g(x)) dengan mengalikan turunan luarnya dengan turunan dalamnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Outer derivative, times inner derivative', id: 'Turunan luar, dikali turunan dalam' },
              body: {
                en: 'For a composition $y = f(g(x))$ — "$f$ after $g$", exactly the notation from the Functions course — the **chain rule** says\n$$\\frac{dy}{dx} = f\'\\big(g(x)\\big) \\cdot g\'(x)$$\nDifferentiate the outer function, leaving the inner one untouched inside it, then multiply by the derivative of the inner function on its own. Neither piece alone is the answer; the product of the two is.\n\nFor $y = \\big(g(x)\\big)^n$, a composition with outer function "raise to the $n$": the outer derivative is $n\\big(g(x)\\big)^{n-1}$ by the power rule, so\n$$\\frac{d}{dx}\\Big[\\big(g(x)\\big)^n\\Big] = n\\big(g(x)\\big)^{n-1}\\cdot g\'(x)$$\nThis one pattern — power rule on the outside, inner derivative tacked on at the end — covers most of what this lesson asks for.',
                id: 'Untuk komposisi $y = f(g(x))$ — "$f$ setelah $g$", persis notasi dari kursus Fungsi — **aturan rantai** mengatakan\n$$\\frac{dy}{dx} = f\'\\big(g(x)\\big) \\cdot g\'(x)$$\nTurunkan fungsi luarnya, biarkan yang dalam tak tersentuh di dalamnya, lalu kalikan dengan turunan fungsi dalamnya sendiri. Bukan salah satu bagian saja yang menjadi jawaban; hasil kali keduanyalah jawabannya.\n\nUntuk $y = \\big(g(x)\\big)^n$, komposisi dengan fungsi luar "pangkatkan ke-$n$": turunan luarnya $n\\big(g(x)\\big)^{n-1}$ menurut aturan pangkat, sehingga\n$$\\frac{d}{dx}\\Big[\\big(g(x)\\big)^n\\Big] = n\\big(g(x)\\big)^{n-1}\\cdot g\'(x)$$\nSatu pola ini — aturan pangkat di luar, turunan dalam ditempelkan di akhir — mencakup sebagian besar yang diminta pelajaran ini.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One example, checked against expanding', id: 'Satu contoh, diperiksa terhadap penjabaran' },
              body: {
                en: 'Differentiate $y = (x^2+1)^5$. The outer function is "$(\\cdot)^5$", inner is $g(x) = x^2+1$, and $g\'(x) = 2x$:\n$$y\' = 5(x^2+1)^4 \\cdot 2x = 10x(x^2+1)^4$$\nExpanding $(x^2+1)^5$ into six terms and differentiating each would give the same answer — this is exactly why the chain rule earns its keep: it skips a genuinely painful expansion, and the skipping only gets more valuable as the exponent grows.',
                id: 'Turunkan $y = (x^2+1)^5$. Fungsi luarnya "$(\\cdot)^5$", dalamnya $g(x) = x^2+1$, dan $g\'(x) = 2x$:\n$$y\' = 5(x^2+1)^4 \\cdot 2x = 10x(x^2+1)^4$$\nMenjabarkan $(x^2+1)^5$ menjadi enam suku lalu menurunkan masing-masing akan memberi jawaban yang sama — dan inilah persis sebabnya aturan rantai layak dipakai: ia melewati penjabaran yang sungguh menyulitkan, dan semakin berharga saat pangkatnya membesar.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 4],
                ySpan: [-4, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(2*x-1)^3', color: 'a' },
                  { t: 'point', at: [1, 1], label: 'A' },
                  { t: 'seg', from: [0, -5], to: [2, 7], color: 'b' },
                ],
                caption: {
                  en: 'For $y=(2x-1)^3$: $y\' = 3(2x-1)^2\\cdot 2 = 6(2x-1)^2$, and at $x=1$ that is $6(1)^2=6$ — exactly the tangent line\'s slope.',
                  id: 'Untuk $y=(2x-1)^3$: $y\' = 3(2x-1)^2\\cdot 2 = 6(2x-1)^2$, dan di $x=1$ itu adalah $6(1)^2=6$ — persis kemiringan garis singgungnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For $y = (x^3+2)^4$, what is the inner function and its derivative?',
                id: 'Untuk $y = (x^3+2)^4$, apa fungsi dalamnya dan turunannya?',
              },
              options: [
                { en: '$g(x)=x^3+2$, $g\'(x)=3x^2$', id: '$g(x)=x^3+2$, $g\'(x)=3x^2$' },
                { en: '$g(x)=x^4$, $g\'(x)=4x^3$', id: '$g(x)=x^4$, $g\'(x)=4x^3$' },
                { en: '$g(x)=x^3+2$, $g\'(x)=x^2$', id: '$g(x)=x^3+2$, $g\'(x)=x^2$' },
                { en: 'There is no inner function here', id: 'Tak ada fungsi dalam di sini' },
              ],
              answer: 0,
              explain: {
                en: 'The inner function is whatever sits inside the parentheses being raised to a power, $x^3+2$, and its own derivative is $3x^2$ by the power and sum rules.',
                id: 'Fungsi dalamnya adalah apa pun yang berada di dalam kurung yang dipangkatkan, $x^3+2$, dan turunannya sendiri $3x^2$ menurut aturan pangkat dan jumlah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph above of $y=(2x-1)^3$, what is the slope of its tangent line at $x=1$?',
                id: 'Dengan membaca grafik $y=(2x-1)^3$ di atas, berapa kemiringan garis singgungnya di $x=1$?',
              },
              figure: {
                dim: 2,
                xSpan: [0, 4],
                ySpan: [-4, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(2*x-1)^3', color: 'a' },
                  { t: 'point', at: [1, 1], label: 'A' },
                  { t: 'seg', from: [0, -5], to: [2, 7], color: 'b' },
                ],
              },
              options: [
                { en: '6', id: '6' },
                { en: '3', id: '3' },
                { en: '1', id: '1' },
                { en: '2', id: '2' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent line runs from $(0,-5)$ to $(2,7)$: slope $= \\dfrac{7-(-5)}{2-0} = \\dfrac{12}{2} = 6$, matching $6(2(1)-1)^2 = 6$ from the chain rule.',
                id: 'Garis singgungnya berjalan dari $(0,-5)$ ke $(2,7)$: kemiringan $= \\dfrac{7-(-5)}{2-0} = \\dfrac{12}{2} = 6$, cocok dengan $6(2(1)-1)^2 = 6$ dari aturan rantai.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the chain rule to differentiate $y = (x^2+1)^5$, then evaluate $y\'$ at $x=1$.',
                id: 'Pakai aturan rantai untuk menurunkan $y = (x^2+1)^5$, lalu hitung $y\'$ di $x=1$.',
              },
              blanks: [
                { label: 'y\' =', formula: '10*x*(x^2+1)^4', domain: [0, 2] },
                { label: "y'(1) =", answer: 160 },
              ],
              hints: [
                { en: 'This is the worked example above — check your formula matches, then substitute.', id: 'Ini contoh yang dikerjakan di atas — cocokkan rumusmu, lalu substitusikan.' },
              ],
              explain: {
                en: '$y\' = 10x(x^2+1)^4$, and $y\'(1) = 10(1)(2)^4 = 10 \\cdot 16 = 160$.',
                id: '$y\' = 10x(x^2+1)^4$, dan $y\'(1) = 10(1)(2)^4 = 10 \\cdot 16 = 160$.',
              },
            },
          ],
        },
        {
          id: 'tur-m3-s1-l2',
          title: { en: 'Chain Rule with Multiple Layers', id: 'Aturan Rantai dengan Banyak Lapis' },
          goal: {
            en: 'Apply the chain rule twice in a row for a composition three functions deep, and handle a root as an outer layer.',
            id: 'Memakai aturan rantai dua kali berturut-turut untuk komposisi tiga fungsi dalam, dan menangani akar sebagai lapisan luar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Peel one layer, then peel the next', id: 'Kupas satu lapis, lalu kupas lapis berikutnya' },
              body: {
                en: 'Nothing stops a composition from having three layers instead of two, and the rule just applies again on the way in. For $y = \\big((3x+1)^2+4\\big)^3$: let $u = 3x+1$ and $v = u^2+4$, so $y = v^3$.\n$$\\frac{dy}{dx} = 3v^2\\cdot\\frac{dv}{dx}, \\qquad \\frac{dv}{dx} = 2u\\cdot\\frac{du}{dx}, \\qquad \\frac{du}{dx}=3$$\nMultiplying the chain all the way through: $\\dfrac{dy}{dx} = 3v^2 \\cdot 2u \\cdot 3 = 18uv^2$. At $x=0$: $u=1$, $v=1+4=5$, so $y\' = 18(1)(25) = 450$ — a number that would have taken expanding a degree-$6$ polynomial to reach any other way.',
                id: 'Tak ada yang menghalangi komposisi punya tiga lapis alih-alih dua, dan aturannya sekadar diterapkan lagi saat masuk ke dalam. Untuk $y = \\big((3x+1)^2+4\\big)^3$: misalkan $u = 3x+1$ dan $v = u^2+4$, sehingga $y = v^3$.\n$$\\frac{dy}{dx} = 3v^2\\cdot\\frac{dv}{dx}, \\qquad \\frac{dv}{dx} = 2u\\cdot\\frac{du}{dx}, \\qquad \\frac{du}{dx}=3$$\nMengalikan rantainya sampai tuntas: $\\dfrac{dy}{dx} = 3v^2 \\cdot 2u \\cdot 3 = 18uv^2$. Di $x=0$: $u=1$, $v=1+4=5$, sehingga $y\' = 18(1)(25) = 450$ — bilangan yang akan memerlukan penjabaran polinom berderajat $6$ untuk dicapai dengan cara lain.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A root as the outer layer', id: 'Akar sebagai lapisan luar' },
              body: {
                en: 'A square root composed with something is still just the power $\\tfrac{1}{2}$ on the outside. For $y = \\sqrt{5x+1} = (5x+1)^{1/2}$:\n$$y\' = \\tfrac{1}{2}(5x+1)^{-1/2}\\cdot 5 = \\frac{5}{2\\sqrt{5x+1}}$$\nSame recipe as always — outer power rule, inner derivative multiplied on — just with a fractional exponent doing the outer work instead of a whole number.',
                id: 'Akar kuadrat yang dikomposisikan dengan sesuatu tetap sekadar pangkat $\\tfrac{1}{2}$ di luarnya. Untuk $y = \\sqrt{5x+1} = (5x+1)^{1/2}$:\n$$y\' = \\tfrac{1}{2}(5x+1)^{-1/2}\\cdot 5 = \\frac{5}{2\\sqrt{5x+1}}$$\nResep yang sama seperti biasa — aturan pangkat di luar, turunan dalam dikalikan — hanya dengan pangkat pecahan yang mengerjakan bagian luarnya, alih-alih bilangan bulat.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For $y = \\big((x+1)^2+3\\big)^4$, what should you differentiate first?',
                id: 'Untuk $y = \\big((x+1)^2+3\\big)^4$, apa yang harus diturunkan lebih dulu?',
              },
              options: [
                { en: 'The outermost layer — the power $4$ — leaving everything inside untouched', id: 'Lapisan terluar — pangkat $4$ — membiarkan segala di dalamnya tak tersentuh' },
                { en: 'The innermost layer, $x+1$, first', id: 'Lapisan paling dalam, $x+1$, lebih dulu' },
                { en: 'All three layers at once, multiplied together immediately', id: 'Ketiga lapisnya sekaligus, dikalikan langsung' },
                { en: 'It does not matter which order', id: 'Urutannya tak jadi soal' },
              ],
              answer: 0,
              explain: {
                en: 'The chain rule always works from the outside in: differentiate the outermost layer first, leaving its argument alone, then multiply by the derivative of what is inside — repeating that same move for each layer still remaining.',
                id: 'Aturan rantai selalu bekerja dari luar ke dalam: turunkan lapisan terluar dahulu, biarkan argumennya, lalu kalikan dengan turunan dari yang di dalamnya — mengulangi gerakan yang sama untuk tiap lapis yang masih tersisa.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below of $y=(x-1)^4$, what is the slope of its tangent line at $x=2$?',
                id: 'Dengan membaca grafik $y=(x-1)^4$ di bawah, berapa kemiringan garis singgungnya di $x=2$?',
              },
              figure: {
                dim: 2,
                xSpan: [0, 4],
                ySpan: [-4, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x-1)^4', color: 'a' },
                  { t: 'point', at: [2, 1], label: 'A' },
                  { t: 'seg', from: [1, -3], to: [3, 5], color: 'b' },
                ],
              },
              options: [
                { en: '4', id: '4' },
                { en: '1', id: '1' },
                { en: '2', id: '2' },
                { en: '8', id: '8' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent line runs from $(1,-3)$ to $(3,5)$: slope $= \\dfrac{5-(-3)}{3-1} = \\dfrac{8}{2} = 4$, matching $4(2-1)^3 = 4$ from the chain rule.',
                id: 'Garis singgungnya berjalan dari $(1,-3)$ ke $(3,5)$: kemiringan $= \\dfrac{5-(-3)}{3-1} = \\dfrac{8}{2} = 4$, cocok dengan $4(2-1)^3 = 4$ dari aturan rantai.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the chain rule to differentiate $y = \\sqrt{5x+1}$, then evaluate $y\'$ at $x=3$.',
                id: 'Pakai aturan rantai untuk menurunkan $y = \\sqrt{5x+1}$, lalu hitung $y\'$ di $x=3$.',
              },
              blanks: [
                { label: 'y\' =', formula: '5/(2*sqrt(5*x+1))', domain: [1, 5] },
                { label: "y'(3) =", answer: 0.625 },
              ],
              hints: [
                { en: '$5(3)+1 = 16$, and $\\sqrt{16}=4$.', id: '$5(3)+1 = 16$, dan $\\sqrt{16}=4$.' },
              ],
              explain: {
                en: '$y\' = \\dfrac{5}{2\\sqrt{5x+1}}$, and $y\'(3) = \\dfrac{5}{2(4)} = \\dfrac{5}{8} = 0{,}625$.',
                id: '$y\' = \\dfrac{5}{2\\sqrt{5x+1}}$, dan $y\'(3) = \\dfrac{5}{2(4)} = \\dfrac{5}{8} = 0{,}625$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m3-s1-p',
        runtime: 'math',
        title: { en: 'Peeling the Layers', id: 'Mengupas Lapisan' },
        brief: {
          en: 'A single-layer composition, a root, and one evaluated at a specific point.',
          id: 'Satu komposisi selapis, satu akar, dan satu yang dihitung di titik tertentu.',
        },
        requirements: [
          { en: 'Differentiate the outermost layer first, leaving its argument untouched.', id: 'Turunkan lapisan terluar dahulu, biarkan argumennya tak tersentuh.' },
          { en: 'Multiply by the inner derivative at the very end, never before.', id: 'Kalikan dengan turunan dalam di akhir, jangan sebelumnya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Differentiate $y = (x^3-2)^4$.', id: 'Turunkan $y = (x^3-2)^4$.' },
            blanks: [{ formula: '12*x^2*(x^3-2)^3', domain: [1, 3] }],
            solution: ['y\' = 4(x^3-2)^3 \\cdot 3x^2 = 12x^2(x^3-2)^3'],
          },
          {
            prompt: { en: 'Differentiate $y = \\sqrt{4x+9}$.', id: 'Turunkan $y = \\sqrt{4x+9}$.' },
            blanks: [{ formula: '2/sqrt(4*x+9)', domain: [1, 4] }],
            solution: ['y\' = \\tfrac{1}{2}(4x+9)^{-1/2}\\cdot 4 = \\dfrac{2}{\\sqrt{4x+9}}'],
          },
          {
            prompt: {
              en: 'For $y = ((2x+1)^2+1)^2$, find $y\'$ and evaluate it at $x=0$.',
              id: 'Untuk $y = ((2x+1)^2+1)^2$, tentukan $y\'$ dan hitung nilainya di $x=0$.',
            },
            blanks: [
              { label: 'y\' =', formula: '2*((2*x+1)^2+1)*2*(2*x+1)*2', domain: [-1, 1] },
              { label: "y'(0) =", answer: 16 },
            ],
            solution: [
              'u=2x+1, \\ v=u^2+1, \\ y=v^2 \\Rightarrow y\' = 2v \\cdot 2u \\cdot 2 = 8uv',
              '\\text{at } x=0: u=1, v=2 \\Rightarrow y\' = 8(1)(2) = 16',
            ],
          },
        ],
        hints: [
          { en: 'Part 3 has three layers, same as the lesson\'s worked example — name u and v before differentiating anything.', id: 'Butir 3 punya tiga lapis, sama seperti contoh yang dikerjakan pelajaran — namai u dan v sebelum menurunkan apa pun.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------- 3.2 implicit differentiation */
    {
      id: 'tur-m3-s2',
      title: { en: 'Implicit Differentiation', id: 'Turunan Implisit' },
      summary: {
        en: 'Differentiate an equation that tangles x and y together, treating y as a function of x throughout.',
        id: 'Menurunkan persamaan yang mengaitkan x dan y bersama, memperlakukan y sebagai fungsi dari x sepanjang jalan.',
      },
      lessons: [
        {
          id: 'tur-m3-s2-l1',
          title: { en: 'Differentiating Both Sides', id: 'Menurunkan Kedua Ruas' },
          goal: {
            en: 'Differentiate an equation in x and y, applying the chain rule to every y, and solve for dy/dx.',
            id: 'Menurunkan persamaan dalam x dan y, memakai aturan rantai pada setiap y, dan menyelesaikan dy/dx.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'y is secretly a function of x', id: 'y secara diam-diam adalah fungsi dari x' },
              body: {
                en: 'The circle $x^2+y^2=25$ was never solved for $y$ — and near most points, it cannot be, not by a single formula. But close to any point on it, $y$ still behaves **as if** it were some function of $x$, whatever that function might secretly be.\n\nDifferentiating both sides with respect to $x$, treating $y$ that way, means every $y$ needs the chain rule: $\\dfrac{d}{dx}(y^2) = 2y\\cdot\\dfrac{dy}{dx}$, exactly as $\\dfrac{d}{dx}\\big(g(x)^2\\big) = 2g(x)g\'(x)$ from the last lesson, with $y$ playing the role of $g(x)$ and $\\frac{dy}{dx}$ playing the role of $g\'(x)$.\n$$\\frac{d}{dx}(x^2) + \\frac{d}{dx}(y^2) = \\frac{d}{dx}(25) \\ \\Rightarrow \\ 2x + 2y\\frac{dy}{dx} = 0$$\nSolving for the one thing being asked for:\n$$\\frac{dy}{dx} = -\\frac{x}{y}$$',
                id: 'Lingkaran $x^2+y^2=25$ tak pernah diselesaikan untuk $y$ — dan dekat sebagian besar titiknya, ia memang tak bisa, tidak dengan satu rumus tunggal. Tetapi dekat titik mana pun padanya, $y$ tetap berperilaku **seolah-olah** ia suatu fungsi dari $x$, apa pun fungsi rahasia itu sebenarnya.\n\nMenurunkan kedua ruas terhadap $x$, memperlakukan $y$ dengan cara itu, berarti setiap $y$ memerlukan aturan rantai: $\\dfrac{d}{dx}(y^2) = 2y\\cdot\\dfrac{dy}{dx}$, persis $\\dfrac{d}{dx}\\big(g(x)^2\\big) = 2g(x)g\'(x)$ dari pelajaran sebelumnya, dengan $y$ berperan sebagai $g(x)$ dan $\\frac{dy}{dx}$ berperan sebagai $g\'(x)$.\n$$\\frac{d}{dx}(x^2) + \\frac{d}{dx}(y^2) = \\frac{d}{dx}(25) \\ \\Rightarrow \\ 2x + 2y\\frac{dy}{dx} = 0$$\nMenyelesaikan untuk satu hal yang ditanyakan:\n$$\\frac{dy}{dx} = -\\frac{x}{y}$$',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 8],
                ySpan: [-6, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(25-x^2)', from: -5, to: 5, color: 'a' },
                  { t: 'curve', f: '-sqrt(25-x^2)', from: -5, to: 5, color: 'a' },
                  { t: 'point', at: [3, 4], label: 'A' },
                  { t: 'seg', from: [-1, 7], to: [7, 1], color: 'b' },
                ],
                caption: {
                  en: 'At $(3,4)$ on the circle, $\\frac{dy}{dx} = -\\frac{3}{4}$ — the slope of the tangent line drawn through it, found without ever writing $y$ as a formula in $x$.',
                  id: 'Di $(3,4)$ pada lingkaran, $\\frac{dy}{dx} = -\\frac{3}{4}$ — kemiringan garis singgung yang digambar melaluinya, ditemukan tanpa pernah menulis $y$ sebagai rumus dalam $x$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'When differentiating $y^3$ with respect to x implicitly, why does $\\frac{dy}{dx}$ appear in the result?',
                id: 'Saat menurunkan $y^3$ terhadap x secara implisit, mengapa $\\frac{dy}{dx}$ muncul pada hasilnya?',
              },
              options: [
                { en: 'y is being treated as a function of x, so the power rule on it needs the chain rule', id: 'y diperlakukan sebagai fungsi dari x, jadi aturan pangkat padanya memerlukan aturan rantai' },
                { en: 'It is a typo — plain $3y^2$ is correct', id: 'Itu salah ketik — $3y^2$ biasa sudah benar' },
                { en: '$\\frac{dy}{dx}$ only appears when x and y are on the same side', id: '$\\frac{dy}{dx}$ hanya muncul ketika x dan y berada di ruas yang sama' },
                { en: 'y is being treated as a constant', id: 'y diperlakukan sebagai konstanta' },
              ],
              answer: 0,
              explain: {
                en: '$y$ is standing in for some unknown function of $x$, so $y^3$ is a composition — exactly $\\big(g(x)\\big)^3$ — and the chain rule always attaches the inner derivative, here written $\\frac{dy}{dx}$ since there is no explicit formula to differentiate.',
                id: '$y$ mewakili suatu fungsi tak diketahui dari $x$, jadi $y^3$ adalah komposisi — persis $\\big(g(x)\\big)^3$ — dan aturan rantai selalu menempelkan turunan dalamnya, di sini ditulis $\\frac{dy}{dx}$ sebab tak ada rumus eksplisit untuk diturunkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the tangent line at $A(3,4)$ on the circle above, what is $\\dfrac{dy}{dx}$ there?',
                id: 'Dengan membaca garis singgung di $A(3,4)$ pada lingkaran di atas, berapakah $\\dfrac{dy}{dx}$ di situ?',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 8],
                ySpan: [-6, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(25-x^2)', from: -5, to: 5, color: 'a' },
                  { t: 'curve', f: '-sqrt(25-x^2)', from: -5, to: 5, color: 'a' },
                  { t: 'point', at: [3, 4], label: 'A' },
                  { t: 'seg', from: [-1, 7], to: [7, 1], color: 'b' },
                ],
              },
              options: [
                { en: '$-0.75$', id: '$-0{,}75$' },
                { en: '$0.75$', id: '$0{,}75$' },
                { en: '$-1.33$', id: '$-1{,}33$' },
                { en: '$1$', id: '$1$' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent runs from $(-1,7)$ to $(7,1)$: slope $= \\dfrac{1-7}{7-(-1)} = \\dfrac{-6}{8} = -0{,}75$, matching $-\\dfrac{3}{4}$ from $\\dfrac{dy}{dx}=-\\dfrac{x}{y}$ at $(3,4)$.',
                id: 'Garis singgungnya berjalan dari $(-1,7)$ ke $(7,1)$: kemiringan $= \\dfrac{1-7}{7-(-1)} = \\dfrac{-6}{8} = -0{,}75$, cocok dengan $-\\dfrac{3}{4}$ dari $\\dfrac{dy}{dx}=-\\dfrac{x}{y}$ di $(3,4)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $x^2+y^2=169$, use implicit differentiation to find $\\dfrac{dy}{dx}$ at the point $(5,12)$.',
                id: 'Untuk $x^2+y^2=169$, pakai turunan implisit untuk mencari $\\dfrac{dy}{dx}$ di titik $(5,12)$.',
              },
              blanks: [{ label: '\\tfrac{dy}{dx} =', answer: -5 / 12 }],
              hints: [
                { en: '$\\dfrac{dy}{dx} = -\\dfrac{x}{y}$, the same formula as the circle in the lesson.', id: '$\\dfrac{dy}{dx} = -\\dfrac{x}{y}$, rumus yang sama seperti lingkaran pada pelajaran.' },
              ],
              explain: {
                en: '$2x+2y\\frac{dy}{dx}=0 \\Rightarrow \\frac{dy}{dx} = -\\frac{x}{y} = -\\frac{5}{12}$.',
                id: '$2x+2y\\frac{dy}{dx}=0 \\Rightarrow \\frac{dy}{dx} = -\\frac{x}{y} = -\\frac{5}{12}$.',
              },
            },
          ],
        },
        {
          id: 'tur-m3-s2-l2',
          title: { en: 'Finding Slopes on Implicit Curves', id: 'Mencari Kemiringan pada Kurva Implisit' },
          goal: {
            en: 'Apply the product rule inside implicit differentiation whenever x and y are multiplied together.',
            id: 'Memakai aturan hasil kali di dalam turunan implisit setiap kali x dan y dikalikan bersama.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'When x and y are multiplied together', id: 'Ketika x dan y dikalikan bersama' },
              body: {
                en: 'A term like $xy$ mixes the two variables, and differentiating it needs the **product rule**, with $x$ as one factor and $y$ — standing in for a function of $x$ — as the other:\n$$\\frac{d}{dx}(xy) = (1)(y) + (x)\\frac{dy}{dx} = y + x\\frac{dy}{dx}$$\nThe recipe for any implicit curve is now complete: differentiate every term, using the power rule plainly on $x$-only terms, the chain rule on every $y$, and the product rule the moment $x$ and $y$ appear multiplied together in the same term. Then collect every $\\frac{dy}{dx}$ on one side and solve.',
                id: 'Suku seperti $xy$ mencampur kedua variabelnya, dan menurunkannya memerlukan **aturan hasil kali**, dengan $x$ sebagai satu faktor dan $y$ — mewakili fungsi dari $x$ — sebagai faktor yang lain:\n$$\\frac{d}{dx}(xy) = (1)(y) + (x)\\frac{dy}{dx} = y + x\\frac{dy}{dx}$$\nResep untuk kurva implisit mana pun kini lengkap: turunkan tiap suku, pakai aturan pangkat biasa pada suku yang hanya $x$, aturan rantai pada setiap $y$, dan aturan hasil kali begitu $x$ dan $y$ muncul dikalikan bersama dalam suku yang sama. Lalu kumpulkan setiap $\\frac{dy}{dx}$ ke satu ruas dan selesaikan.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One example, worked in full', id: 'Satu contoh, dikerjakan tuntas' },
              body: {
                en: 'For $xy=6$, differentiate both sides:\n$$\\frac{d}{dx}(xy) = \\frac{d}{dx}(6) \\ \\Rightarrow \\ y + x\\frac{dy}{dx} = 0 \\ \\Rightarrow \\ \\frac{dy}{dx} = -\\frac{y}{x}$$\nAt the point $(2,3)$, which satisfies $xy=6$: $\\dfrac{dy}{dx} = -\\dfrac{3}{2} = -1{,}5$.\n\nA slightly busier example, $xy^2=8$, needs both rules on the same term: $\\dfrac{d}{dx}(xy^2) = (1)(y^2) + (x)(2y)\\dfrac{dy}{dx}$, product rule on the outside, chain rule on the $y^2$ that came along for the ride.',
                id: 'Untuk $xy=6$, turunkan kedua ruas:\n$$\\frac{d}{dx}(xy) = \\frac{d}{dx}(6) \\ \\Rightarrow \\ y + x\\frac{dy}{dx} = 0 \\ \\Rightarrow \\ \\frac{dy}{dx} = -\\frac{y}{x}$$\nDi titik $(2,3)$, yang memenuhi $xy=6$: $\\dfrac{dy}{dx} = -\\dfrac{3}{2} = -1{,}5$.\n\nContoh yang sedikit lebih ramai, $xy^2=8$, memerlukan kedua aturan pada suku yang sama: $\\dfrac{d}{dx}(xy^2) = (1)(y^2) + (x)(2y)\\dfrac{dy}{dx}$, aturan hasil kali di luar, aturan rantai pada $y^2$ yang ikut serta.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '6/x', from: 0.7, to: 6, color: 'a' },
                  { t: 'point', at: [2, 3], label: 'A' },
                  { t: 'seg', from: [0, 6], to: [4, 0], color: 'b' },
                ],
                caption: {
                  en: 'At $(2,3)$ on $xy=6$, $\\dfrac{dy}{dx}=-1{,}5$ — the slope of the tangent drawn through it.',
                  id: 'Di $(2,3)$ pada $xy=6$, $\\dfrac{dy}{dx}=-1{,}5$ — kemiringan garis singgung yang digambar melaluinya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which term, when differentiated implicitly, needs the product rule?',
                id: 'Suku manakah yang, ketika diturunkan secara implisit, memerlukan aturan hasil kali?',
              },
              options: [
                { en: '$xy$', id: '$xy$' },
                { en: '$x^2$', id: '$x^2$' },
                { en: '$y^3$', id: '$y^3$' },
                { en: '$7$', id: '$7$' },
              ],
              answer: 0,
              explain: {
                en: '$xy$ is a product of two things that both change with $x$ — the plain $x$, and $y$ standing in for a function of $x$. $x^2$ needs only the power rule; $y^3$ needs only the chain rule; a bare constant needs neither.',
                id: '$xy$ adalah hasil kali dua hal yang sama-sama berubah terhadap $x$ — $x$ biasa, dan $y$ yang mewakili fungsi dari $x$. $x^2$ hanya perlu aturan pangkat; $y^3$ hanya perlu aturan rantai; konstanta polos tak perlu keduanya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the tangent line at $A(2,3)$ on the curve $xy=6$ above, what is $\\dfrac{dy}{dx}$ there?',
                id: 'Dengan membaca garis singgung di $A(2,3)$ pada kurva $xy=6$ di atas, berapakah $\\dfrac{dy}{dx}$ di situ?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '6/x', from: 0.7, to: 6, color: 'a' },
                  { t: 'point', at: [2, 3], label: 'A' },
                  { t: 'seg', from: [0, 6], to: [4, 0], color: 'b' },
                ],
              },
              options: [
                { en: '$-1.5$', id: '$-1{,}5$' },
                { en: '$1.5$', id: '$1{,}5$' },
                { en: '$-0.67$', id: '$-0{,}67$' },
                { en: '$6$', id: '$6$' },
              ],
              answer: 0,
              explain: {
                en: 'The tangent runs from $(0,6)$ to $(4,0)$: slope $= \\dfrac{0-6}{4-0} = -1{,}5$, matching $-\\dfrac{y}{x} = -\\dfrac{3}{2}$ at $(2,3)$.',
                id: 'Garis singgungnya berjalan dari $(0,6)$ ke $(4,0)$: kemiringan $= \\dfrac{0-6}{4-0} = -1{,}5$, cocok dengan $-\\dfrac{y}{x} = -\\dfrac{3}{2}$ di $(2,3)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $xy^2=8$, use implicit differentiation to find $\\dfrac{dy}{dx}$ at the point $(2,2)$.',
                id: 'Untuk $xy^2=8$, pakai turunan implisit untuk mencari $\\dfrac{dy}{dx}$ di titik $(2,2)$.',
              },
              blanks: [{ label: '\\tfrac{dy}{dx} =', answer: -0.5 }],
              hints: [
                { en: '$y^2 + 2xy\\dfrac{dy}{dx} = 0 \\Rightarrow \\dfrac{dy}{dx} = -\\dfrac{y^2}{2xy} = -\\dfrac{y}{2x}$.', id: '$y^2 + 2xy\\dfrac{dy}{dx} = 0 \\Rightarrow \\dfrac{dy}{dx} = -\\dfrac{y^2}{2xy} = -\\dfrac{y}{2x}$.' },
              ],
              explain: {
                en: '$\\dfrac{dy}{dx} = -\\dfrac{y}{2x} = -\\dfrac{2}{4} = -0{,}5$.',
                id: '$\\dfrac{dy}{dx} = -\\dfrac{y}{2x} = -\\dfrac{2}{4} = -0{,}5$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'tur-m3-s2-p',
        runtime: 'math',
        title: { en: 'Slopes Without Solving for y', id: 'Kemiringan Tanpa Menyelesaikan y' },
        brief: {
          en: 'Two circles and one product-rule curve, each evaluated at a point on it.',
          id: 'Dua lingkaran dan satu kurva beraturan hasil kali, masing-masing dihitung di titik pada kurva itu.',
        },
        requirements: [
          { en: 'Differentiate every term before collecting dy/dx onto one side.', id: 'Turunkan setiap suku sebelum mengumpulkan dy/dx ke satu ruas.' },
          { en: 'A term with both x and y multiplied together needs the product rule, not just the chain rule.', id: 'Suku dengan x dan y dikalikan bersama memerlukan aturan hasil kali, bukan hanya aturan rantai.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $x^2+y^2=100$, find $\\dfrac{dy}{dx}$ at $(6,8)$.',
              id: 'Untuk $x^2+y^2=100$, tentukan $\\dfrac{dy}{dx}$ di $(6,8)$.',
            },
            blanks: [{ answer: -0.75 }],
            solution: ['\\dfrac{dy}{dx} = -\\dfrac{x}{y} = -\\dfrac{6}{8} = -0{,}75'],
          },
          {
            prompt: {
              en: 'For $xy=10$, find $\\dfrac{dy}{dx}$ at $(2,5)$.',
              id: 'Untuk $xy=10$, tentukan $\\dfrac{dy}{dx}$ di $(2,5)$.',
            },
            blanks: [{ answer: -2.5 }],
            solution: ['\\dfrac{dy}{dx} = -\\dfrac{y}{x} = -\\dfrac{5}{2} = -2{,}5'],
          },
          {
            prompt: {
              en: 'For $x^2y=12$, find $\\dfrac{dy}{dx}$ at $(2,3)$.',
              id: 'Untuk $x^2y=12$, tentukan $\\dfrac{dy}{dx}$ di $(2,3)$.',
            },
            blanks: [{ answer: -3 }],
            solution: [
              '\\dfrac{d}{dx}(x^2y) = 2xy + x^2\\dfrac{dy}{dx} = 0 \\Rightarrow \\dfrac{dy}{dx} = -\\dfrac{2xy}{x^2} = -\\dfrac{2y}{x} = -\\dfrac{6}{2} = -3',
            ],
          },
        ],
        hints: [
          { en: 'Part 3 has $x^2$ and $y$ multiplied together — the product rule applies to the whole term, with $x^2$ as one factor.', id: 'Butir 3 mempunyai $x^2$ dan $y$ dikalikan bersama — aturan hasil kali berlaku pada seluruh sukunya, dengan $x^2$ sebagai satu faktor.' },
        ],
        xp: 50,
      },
    },
  ],
}
