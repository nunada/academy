import type { Module } from '../types'

/** Module 3 — equations as the central object of algebra: linear, quadratic
 *  (three solution methods), the complex numbers a negative discriminant
 *  forces into existence, and finally equations built from a word problem
 *  instead of handed to you already symbolic. */
export const module3: Module = {
  id: 'dsr-m3',
  title: { en: 'Equations', id: 'Persamaan' },
  summary: {
    en: 'Solving linear and quadratic equations by every standard method, complex numbers, equations that hide extraneous solutions, and translating a word problem into algebra.',
    id: 'Menyelesaikan persamaan linear dan kuadrat dengan setiap metode standar, bilangan kompleks, persamaan yang menyembunyikan solusi ekstraneus, dan menerjemahkan soal cerita menjadi aljabar.',
  },
  submodules: [
    /* ------------------------------------------- 1.5a linear and quadratic */
    {
      id: 'dsr-m3-s1',
      title: { en: 'Linear and Quadratic Equations', id: 'Persamaan Linear dan Kuadrat' },
      summary: {
        en: 'Solving a linear equation and a formula, then a quadratic by factoring, completing the square, and the Quadratic Formula.',
        id: 'Menyelesaikan persamaan linear dan sebuah formula, lalu persamaan kuadrat dengan pemfaktoran, melengkapkan kuadrat, dan Rumus Kuadrat.',
      },
      lessons: [
        {
          id: 'dsr-m3-s1-l1',
          title: { en: 'Solving Linear Equations, and Formulas', id: 'Menyelesaikan Persamaan Linear, dan Formula' },
          goal: {
            en: 'Solve a linear equation by isolating the variable, and solve a formula for one variable in terms of the others.',
            id: 'Menyelesaikan persamaan linear dengan mengisolasi variabelnya, dan menyelesaikan formula untuk satu variabel dalam bentuk yang lain.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Isolating the variable', id: 'Mengisolasi variabelnya' },
              body: {
                en: 'A **linear equation** in $x$ is equivalent to $ax+b=0$ — every term is a constant or a multiple of $x$ (no $x^2$, no $\\sqrt{x}$, no $\\frac{1}{x}$). Two properties justify every step of solving one: add the same quantity to both sides, or multiply both sides by the same nonzero quantity.\n\nFor $7x-4=3x+8$: add $4$ to both sides, $7x=3x+12$; subtract $3x$, $4x=12$; divide by $4$, $x=3$. Checking: $7(3)-4=17$ and $3(3)+8=17$. ✓',
                id: '**Persamaan linear** dalam $x$ setara dengan $ax+b=0$ — setiap suku adalah konstanta atau kelipatan $x$ (tak ada $x^2$, tak ada $\\sqrt{x}$, tak ada $\\frac{1}{x}$). Dua sifat membenarkan setiap langkah menyelesaikannya: tambahkan kuantitas yang sama pada kedua ruas, atau kalikan kedua ruas dengan kuantitas taknol yang sama.\n\nUntuk $7x-4=3x+8$: tambah $4$ ke kedua ruas, $7x=3x+12$; kurangi $3x$, $4x=12$; bagi dengan $4$, $x=3$. Memeriksa: $7(3)-4=17$ dan $3(3)+8=17$. ✓',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Solving a formula for one variable', id: 'Menyelesaikan formula untuk satu variabel' },
              body: {
                en: 'A **formula** relates several variables, and you can solve for any one of them by treating the others as if they were numbers. Newton\'s Law of Gravity, $F = G\\dfrac{mM}{r^2}$, solved for $M$:\n$$F = \\left(\\frac{Gm}{r^2}\\right)M \\quad \\Rightarrow \\quad M = \\frac{Fr^2}{Gm}$$\nThe box\'s surface area $A = 2\\ell w + 2wh + 2\\ell h$ solved for $w$ requires collecting **both** $w$-terms first: $A - 2\\ell h = (2\\ell+2h)w$, so $w = \\dfrac{A-2\\ell h}{2\\ell+2h}$.',
                id: '**Formula** mengaitkan beberapa variabel, dan kamu bisa menyelesaikan untuk salah satunya dengan memperlakukan yang lain seolah bilangan. Hukum Gravitasi Newton, $F = G\\dfrac{mM}{r^2}$, diselesaikan untuk $M$:\n$$F = \\left(\\frac{Gm}{r^2}\\right)M \\quad \\Rightarrow \\quad M = \\frac{Fr^2}{Gm}$$\nLuas permukaan kotak $A = 2\\ell w + 2wh + 2\\ell h$ diselesaikan untuk $w$ memerlukan mengumpulkan **kedua** suku $w$ terlebih dahulu: $A - 2\\ell h = (2\\ell+2h)w$, sehingga $w = \\dfrac{A-2\\ell h}{2\\ell+2h}$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is a linear equation in $x$?',
                id: 'Manakah dari ini yang merupakan persamaan linear dalam $x$?',
              },
              options: [
                { en: '$2x - \\dfrac{1}{3} = x + 7$', id: '$2x - \\dfrac{1}{3} = x + 7$' },
                { en: '$x^2 - 2x = 8$', id: '$x^2 - 2x = 8$' },
                { en: '$\\sqrt{x} = 6x$', id: '$\\sqrt{x} = 6x$' },
                { en: '$\\dfrac{3}{x} = 2x + 1$', id: '$\\dfrac{3}{x} = 2x + 1$' },
              ],
              answer: 0,
              explain: {
                en: 'Every term in $2x - \\frac{1}{3} = x + 7$ is either a constant or a constant multiple of $x$ — no squares, no roots of $x$, no $x$ in a denominator. The other three each break one of those conditions.',
                id: 'Setiap suku dalam $2x - \\frac{1}{3} = x + 7$ adalah konstanta atau kelipatan konstanta dari $x$ — tak ada kuadrat, tak ada akar dari $x$, tak ada $x$ di penyebut. Tiga lainnya masing-masing melanggar salah satu syarat itu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve $5x + 3 = 2x + 18$.',
                id: 'Selesaikan $5x + 3 = 2x + 18$.',
              },
              template: '5x + 3 = 2x + 18 \\ \\Rightarrow \\ x = ___',
              blanks: ['5'],
              explain: {
                en: 'Subtracting $2x$ and $3$ from both sides gives $3x=15$, so $x=5$.',
                id: 'Mengurangi $2x$ dan $3$ dari kedua ruas memberi $3x=15$, sehingga $x=5$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Solve $4(x - 3) = 2x + 10$ for $x$.',
                id: 'Selesaikan $4(x - 3) = 2x + 10$ untuk $x$.',
              },
              blanks: [{ answer: 11 }],
              hints: [
                { en: 'Distribute the $4$ on the left first: $4x - 12 = 2x + 10$.', id: 'Sebarkan $4$ di ruas kiri dulu: $4x - 12 = 2x + 10$.' },
              ],
              explain: {
                en: '$4x-12=2x+10 \\Rightarrow 2x=22 \\Rightarrow x=11$.',
                id: '$4x-12=2x+10 \\Rightarrow 2x=22 \\Rightarrow x=11$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m3-s1-l2',
          title: { en: 'Quadratic Equations — Factoring and Completing the Square', id: 'Persamaan Kuadrat — Pemfaktoran dan Melengkapkan Kuadrat' },
          goal: {
            en: 'Solve a quadratic equation using the Zero-Product Property, and by completing the square.',
            id: 'Menyelesaikan persamaan kuadrat memakai Sifat Hasil Kali Nol, dan dengan melengkapkan kuadrat.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The Zero-Product Property', id: 'Sifat Hasil Kali Nol' },
              body: {
                en: 'A **quadratic equation** has the form $ax^2+bx+c=0$ with $a \\neq 0$. If it factors, the **Zero-Product Property** — $AB=0$ if and only if $A=0$ or $B=0$ — solves it instantly, but only once one side is $0$.\n\nFor $x^2-5x=24$: rewrite as $x^2-5x-24=0$, factor as $(x+3)(x-8)=0$, so $x+3=0$ or $x-8=0$, giving $x=-3$ or $x=8$. Trying to factor the **original** form $x(x-5)=24$ doesn\'t help — $24$ factors in far too many ways.',
                id: '**Persamaan kuadrat** berbentuk $ax^2+bx+c=0$ dengan $a \\neq 0$. Jika ia bisa difaktorkan, **Sifat Hasil Kali Nol** — $AB=0$ jika dan hanya jika $A=0$ atau $B=0$ — menyelesaikannya seketika, tetapi hanya setelah satu ruas adalah $0$.\n\nUntuk $x^2-5x=24$: tulis ulang sebagai $x^2-5x-24=0$, faktorkan sebagai $(x+3)(x-8)=0$, sehingga $x+3=0$ atau $x-8=0$, memberi $x=-3$ atau $x=8$. Mencoba memfaktorkan bentuk **asli** $x(x-5)=24$ tak membantu — $24$ punya terlalu banyak cara difaktorkan.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Completing the square', id: 'Melengkapkan kuadrat' },
              body: {
                en: 'When a quadratic doesn\'t factor nicely, **complete the square**: add $\\left(\\frac{b}{2}\\right)^2$ to turn $x^2+bx$ into a perfect square $\\left(x+\\frac{b}{2}\\right)^2$. For $x^2+8x+13=0$:\n$$x^2+8x=-13 \\ \\Rightarrow \\ x^2+8x+16=-13+16 \\ \\Rightarrow \\ (x+4)^2=3 \\ \\Rightarrow \\ x=-4\\pm\\sqrt{3}$$\nIf the leading coefficient isn\'t $1$, factor it out of the $x$-terms first, before completing the square inside.',
                id: 'Ketika kuadrat tak bisa difaktorkan dengan rapi, **lengkapkan kuadrat**: tambahkan $\\left(\\frac{b}{2}\\right)^2$ untuk mengubah $x^2+bx$ menjadi kuadrat sempurna $\\left(x+\\frac{b}{2}\\right)^2$. Untuk $x^2+8x+13=0$:\n$$x^2+8x=-13 \\ \\Rightarrow \\ x^2+8x+16=-13+16 \\ \\Rightarrow \\ (x+4)^2=3 \\ \\Rightarrow \\ x=-4\\pm\\sqrt{3}$$\nJika koefisien utamanya bukan $1$, keluarkan dulu dari suku-suku $x$ sebelum melengkapkan kuadrat di dalamnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What must be added to $x^2 + 10x$ to complete the square?',
                id: 'Apa yang harus ditambahkan ke $x^2 + 10x$ untuk melengkapkan kuadrat?',
              },
              options: [
                { en: '$25$', id: '$25$' },
                { en: '$10$', id: '$10$' },
                { en: '$100$', id: '$100$' },
                { en: '$5$', id: '$5$' },
              ],
              answer: 0,
              explain: {
                en: 'Half the coefficient of $x$ is $5$, and $5^2=25$: $x^2+10x+25=(x+5)^2$.',
                id: 'Setengah koefisien $x$ adalah $5$, dan $5^2=25$: $x^2+10x+25=(x+5)^2$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Solve $x^2 - 5x - 24 = 0$ using the Zero-Product Property.',
                id: 'Selesaikan $x^2 - 5x - 24 = 0$ memakai Sifat Hasil Kali Nol.',
              },
              options: [
                { en: '$x = -3$ or $x = 8$', id: '$x = -3$ atau $x = 8$' },
                { en: '$x = 3$ or $x = -8$', id: '$x = 3$ atau $x = -8$' },
                { en: '$x = -3$ or $x = -8$', id: '$x = -3$ atau $x = -8$' },
                { en: '$x = 24$', id: '$x = 24$' },
              ],
              answer: 0,
              explain: {
                en: '$x^2-5x-24=(x+3)(x-8)=0$, so $x=-3$ or $x=8$ — check: $(-3)^2-5(-3)-24=9+15-24=0$. ✓',
                id: '$x^2-5x-24=(x+3)(x-8)=0$, sehingga $x=-3$ atau $x=8$ — periksa: $(-3)^2-5(-3)-24=9+15-24=0$. ✓',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the square on $x^2 + 8x + 13 = 0$ to find the missing number below.',
                id: 'Lengkapkan kuadrat pada $x^2 + 8x + 13 = 0$ untuk mencari bilangan yang hilang di bawah.',
              },
              template: '(x+4)^2 = ___, \\quad x = -4 \\pm \\sqrt{3}',
              blanks: ['3'],
              explain: {
                en: 'Adding $16$ to both sides of $x^2+8x=-13$ gives $(x+4)^2=3$, so $x=-4\\pm\\sqrt{3}$.',
                id: 'Menambahkan $16$ ke kedua ruas $x^2+8x=-13$ memberi $(x+4)^2=3$, sehingga $x=-4\\pm\\sqrt{3}$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'One solution of $x^2 - 2x - 15 = 0$ is negative. Find it.',
                id: 'Salah satu solusi dari $x^2 - 2x - 15 = 0$ negatif. Carilah.',
              },
              blanks: [{ answer: -3 }],
              hints: [
                { en: 'Factor as $(x-5)(x+3)=0$.', id: 'Faktorkan sebagai $(x-5)(x+3)=0$.' },
              ],
              explain: {
                en: '$(x-5)(x+3)=0$ gives $x=5$ or $x=-3$; the negative one is $x=-3$.',
                id: '$(x-5)(x+3)=0$ memberi $x=5$ atau $x=-3$; yang negatif adalah $x=-3$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m3-s1-l3',
          title: { en: 'The Quadratic Formula and the Discriminant', id: 'Rumus Kuadrat dan Diskriminan' },
          goal: {
            en: 'Solve any quadratic with the Quadratic Formula, and use the discriminant to predict how many real solutions it has.',
            id: 'Menyelesaikan kuadrat mana pun dengan Rumus Kuadrat, dan memakai diskriminan untuk memprediksi berapa banyak solusi realnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The Quadratic Formula', id: 'Rumus Kuadrat' },
              body: {
                en: 'Completing the square on the **general** equation $ax^2+bx+c=0$ derives a formula that solves every quadratic at once:\n$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$\nFor $3x^2+5x-1=0$: $a=3, b=5, c=-1$, so $x = \\dfrac{-5\\pm\\sqrt{25+12}}{6} = \\dfrac{-5\\pm\\sqrt{37}}{6}$.',
                id: 'Melengkapkan kuadrat pada persamaan **umum** $ax^2+bx+c=0$ menurunkan formula yang menyelesaikan setiap kuadrat sekaligus:\n$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$\nUntuk $3x^2+5x-1=0$: $a=3, b=5, c=-1$, sehingga $x = \\dfrac{-5\\pm\\sqrt{25+12}}{6} = \\dfrac{-5\\pm\\sqrt{37}}{6}$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The discriminant counts the real solutions', id: 'Diskriminan menghitung banyak solusi real' },
              body: {
                en: 'The quantity under the root, $D = b^2-4ac$, is the **discriminant**, and its sign alone tells you how many real solutions exist, no need to finish solving: $D>0$ gives two distinct real solutions, $D=0$ gives exactly one real solution (a repeated root), and $D<0$ gives no real solution at all, since the root of a negative number is not real.\n\nDrag the slider below: the parabola is $y=x^2-4x+c$, whose roots are exactly the solutions of $x^2-4x+c=0$. Watch the two roots merge into one as $c$ reaches $4$ (where $D=16-4c=0$), then vanish entirely once $c>4$ and $D<0$.',
                id: 'Kuantitas di bawah akar, $D = b^2-4ac$, adalah **diskriminan**, dan tandanya saja memberitahu berapa banyak solusi real yang ada, tanpa perlu menuntaskan penyelesaiannya: $D>0$ memberi dua solusi real berbeda, $D=0$ memberi tepat satu solusi real (akar berulang), dan $D<0$ memberi tak ada solusi real sama sekali, sebab akar dari bilangan negatif bukan bilangan real.\n\nGeser penggeser di bawah: parabolanya adalah $y=x^2-4x+c$, yang akarnya persis solusi dari $x^2-4x+c=0$. Amati kedua akar menyatu menjadi satu ketika $c$ mencapai $4$ (saat $D=16-4c=0$), lalu lenyap sepenuhnya begitu $c>4$ dan $D<0$.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 7],
                ySpan: [-8, 12],
                ticks: true,
                params: [{ name: 'c', min: -2, max: 8, step: 0.5, value: 0, label: 'c' }],
                items: [
                  { t: 'curve', f: 'x^2-4*x+c', color: 'a' },
                  { t: 'vline', x: 2, color: 'muted', dashed: true },
                  { t: 'dot', x: '2+sqrt(4-c)', y: 0, color: 'result' },
                  { t: 'dot', x: '2-sqrt(4-c)', y: 0, color: 'result' },
                ],
                caption: {
                  en: 'The dots mark the real roots — they exist only while $c \\leq 4$, since $D=16-4c$.',
                  id: 'Titik-titik itu menandai akar realnya — hanya ada selama $c \\leq 4$, sebab $D=16-4c$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How many real solutions does $4x^2 - 12x + 9 = 0$ have?',
                id: 'Berapa banyak solusi real yang dimiliki $4x^2 - 12x + 9 = 0$?',
              },
              options: [
                { en: 'Exactly one', id: 'Tepat satu' },
                { en: 'Two distinct solutions', id: 'Dua solusi berbeda' },
                { en: 'None', id: 'Tak ada' },
                { en: 'Infinitely many', id: 'Tak terhingga banyaknya' },
              ],
              answer: 0,
              explain: {
                en: '$D = (-12)^2-4(4)(9) = 144-144=0$, so the equation has exactly one real solution — a repeated root.',
                id: '$D = (-12)^2-4(4)(9) = 144-144=0$, sehingga persamaannya punya tepat satu solusi real — akar berulang.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In the figure above, at roughly what value of $c$ do the two dots merge into one?',
                id: 'Pada gambar di atas, kira-kira di nilai $c$ berapa kedua titik menyatu menjadi satu?',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 7],
                ySpan: [-8, 12],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-4*x+4', color: 'a' },
                  { t: 'dot', x: 2, y: 0, color: 'result' },
                ],
              },
              options: [
                { en: '$c = 4$', id: '$c = 4$' },
                { en: '$c = 0$', id: '$c = 0$' },
                { en: '$c = -2$', id: '$c = -2$' },
                { en: '$c = 8$', id: '$c = 8$' },
              ],
              answer: 0,
              explain: {
                en: 'The two roots merge exactly when $D=16-4c=0$, i.e. $c=4$ — the parabola\'s vertex just touches the $x$-axis there, shown in the figure.',
                id: 'Kedua akar menyatu persis ketika $D=16-4c=0$, yaitu $c=4$ — puncak parabolanya tepat menyentuh sumbu-$x$ di situ, ditunjukkan pada gambar.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Find the discriminant of $2x^2 - 4x + 5 = 0$, and state how many real solutions it has.',
                id: 'Cari diskriminan dari $2x^2 - 4x + 5 = 0$, dan nyatakan berapa banyak solusi realnya.',
              },
              template: 'D = (-4)^2 - 4(2)(5) = ___',
              blanks: ['-24'],
              explain: {
                en: '$D=16-40=-24 < 0$, so the equation has no real solution.',
                id: '$D=16-40=-24 < 0$, sehingga persamaannya tak punya solusi real.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the Quadratic Formula to find the larger solution of $x^2 - 2x - 2 = 0$. (Round to two decimal places.)',
                id: 'Pakai Rumus Kuadrat untuk mencari solusi yang lebih besar dari $x^2 - 2x - 2 = 0$. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 1 + Math.sqrt(3), tol: 0.01 }],
              hints: [
                { en: '$a=1, b=-2, c=-2$.', id: '$a=1, b=-2, c=-2$.' },
              ],
              explain: {
                en: '$x = \\dfrac{2\\pm\\sqrt{4+8}}{2} = 1\\pm\\sqrt{3}$; the larger solution is $1+\\sqrt{3}\\approx 2{,}73$.',
                id: '$x = \\dfrac{2\\pm\\sqrt{4+8}}{2} = 1\\pm\\sqrt{3}$; solusi yang lebih besar adalah $1+\\sqrt{3}\\approx 2{,}73$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m3-s1-p',
        runtime: 'math',
        title: { en: 'Solving Quadratic Equations', id: 'Menyelesaikan Persamaan Kuadrat' },
        brief: {
          en: 'One equation solved by factoring, one by completing the square, and one discriminant check.',
          id: 'Satu persamaan diselesaikan dengan pemfaktoran, satu dengan melengkapkan kuadrat, dan satu pemeriksaan diskriminan.',
        },
        requirements: [
          { en: 'The Zero-Product Property only applies once one side of the equation is $0$.', id: 'Sifat Hasil Kali Nol hanya berlaku setelah satu ruas persamaan adalah $0$.' },
          { en: 'The discriminant is $D=b^2-4ac$; its sign alone determines how many real solutions exist.', id: 'Diskriminannya adalah $D=b^2-4ac$; tandanya saja menentukan berapa banyak solusi real yang ada.' },
        ],
        tasks: [
          {
            prompt: { en: 'Solve $x^2 + 2x - 15 = 0$. Give the positive solution.', id: 'Selesaikan $x^2 + 2x - 15 = 0$. Berikan solusi positifnya.' },
            blanks: [{ answer: 3 }],
            solution: ['x^2+2x-15=(x+5)(x-3)=0 \\Rightarrow x=-5 \\text{ or } x=3'],
          },
          {
            prompt: { en: 'Solve $x^2 - 6x + 4 = 0$ by completing the square. Give the larger solution. (Round to two decimal places.)', id: 'Selesaikan $x^2 - 6x + 4 = 0$ dengan melengkapkan kuadrat. Berikan solusi yang lebih besar. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 3 + Math.sqrt(5), tol: 0.01 }],
            solution: ['(x-3)^2=5 \\Rightarrow x=3\\pm\\sqrt5, \\text{ larger is } 3+\\sqrt5\\approx5{,}24'],
          },
          {
            prompt: { en: 'Find the discriminant of $5x^2 + 2x + 1 = 0$.', id: 'Cari diskriminan dari $5x^2 + 2x + 1 = 0$.' },
            blanks: [{ answer: -16 }],
            solution: ['D = 2^2-4(5)(1) = 4-20 = -16'],
          },
        ],
        hints: [
          { en: 'A negative discriminant means: don\'t bother looking for a real solution — there isn\'t one.', id: 'Diskriminan negatif berarti: jangan repot mencari solusi real — memang tak ada.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------ 1.5b/1.6 other equations, complex */
    {
      id: 'dsr-m3-s2',
      title: { en: 'Other Equations, and Complex Numbers', id: 'Persamaan Lain, dan Bilangan Kompleks' },
      summary: {
        en: 'Radical and fractional equations that demand a check, equations of quadratic type, and the complex numbers that make every quadratic solvable.',
        id: 'Persamaan berakar dan berpecahan yang menuntut pemeriksaan, persamaan bertipe kuadrat, dan bilangan kompleks yang membuat setiap kuadrat terselesaikan.',
      },
      lessons: [
        {
          id: 'dsr-m3-s2-l1',
          title: { en: 'Extraneous Solutions', id: 'Solusi Ekstraneus' },
          goal: {
            en: 'Solve radical and fractional equations, and recognize when a candidate solution must be rejected.',
            id: 'Menyelesaikan persamaan berakar dan berpecahan, dan mengenali kapan sebuah kandidat solusi harus ditolak.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Fractional equations can manufacture false solutions', id: 'Persamaan berpecahan bisa menciptakan solusi palsu' },
              body: {
                en: 'Clearing denominators by multiplying through by the LCD can introduce **extraneous solutions** — candidates that satisfy the cleared equation but not the original, because they were undefined in it all along.\n\nSolve $\\dfrac{3}{x} - \\dfrac{2}{x+3} = \\dfrac{12}{x^2-9}$: multiplying by the LCD $x(x-3)(x+3)$ gives $3(x-3)(x+3) - 2x(x-3) = 12x$, which simplifies to $x^2-6x-27=0$, i.e. $(x-9)(x+3)=0$, so $x=9$ or $x=-3$. But $x=-3$ makes the **original** denominators $x+3$ and $x^2-9$ both zero — it is extraneous. Only $x=9$ is a genuine solution.',
                id: 'Menghilangkan penyebut dengan mengalikan dengan KPK bisa memunculkan **solusi ekstraneus** — kandidat yang memenuhi persamaan yang sudah dibersihkan tetapi tidak persamaan aslinya, karena sejak awal tak terdefinisi di situ.\n\nSelesaikan $\\dfrac{3}{x} - \\dfrac{2}{x+3} = \\dfrac{12}{x^2-9}$: mengalikan dengan KPK $x(x-3)(x+3)$ memberi $3(x-3)(x+3) - 2x(x-3) = 12x$, yang menyederhana menjadi $x^2-6x-27=0$, yaitu $(x-9)(x+3)=0$, sehingga $x=9$ atau $x=-3$. Tetapi $x=-3$ membuat penyebut **asli** $x+3$ dan $x^2-9$ sama-sama nol — ia ekstraneus. Hanya $x=9$ solusi yang sah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Squaring a radical equation can too', id: 'Mengkuadratkan persamaan berakar juga bisa' },
              body: {
                en: 'Squaring both sides of an equation can turn a false statement true — $-1 \\neq 1$, but $(-1)^2=1^2$ — so a radical equation must always be checked after squaring.\n\nSolve $2x-1=\\sqrt{2-x}$: squaring gives $(2x-1)^2=2-x$, i.e. $4x^2-4x+1=2-x$, i.e. $4x^2-3x-1=0$, which factors as $(4x+1)(x-1)=0$, so $x=1$ or $x=-\\frac{1}{4}$. Checking $x=1$: LHS $=1$, RHS $=\\sqrt{1}=1$. ✓ Checking $x=-\\frac{1}{4}$: LHS $=-1.5$, but a square root is never negative, so RHS $\\neq$ LHS — extraneous. Only $x=1$ works.',
                id: 'Mengkuadratkan kedua ruas persamaan bisa mengubah pernyataan salah menjadi benar — $-1 \\neq 1$, tetapi $(-1)^2=1^2$ — sehingga persamaan berakar selalu harus diperiksa setelah dikuadratkan.\n\nSelesaikan $2x-1=\\sqrt{2-x}$: mengkuadratkan memberi $(2x-1)^2=2-x$, yaitu $4x^2-4x+1=2-x$, yaitu $4x^2-3x-1=0$, yang difaktorkan sebagai $(4x+1)(x-1)=0$, sehingga $x=1$ atau $x=-\\frac{1}{4}$. Memeriksa $x=1$: RK $=1$, RN $=\\sqrt{1}=1$. ✓ Memeriksa $x=-\\frac{1}{4}$: RK $=-1.5$, tetapi akar kuadrat tak pernah negatif, sehingga RN $\\neq$ RK — ekstraneus. Hanya $x=1$ yang berhasil.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why must every solution of a squared radical equation be checked against the original?',
                id: 'Mengapa setiap solusi dari persamaan berakar yang dikuadratkan harus diperiksa terhadap persamaan aslinya?',
              },
              options: [
                { en: 'Squaring can make a false equation true, so a candidate might satisfy the squared version without satisfying the original', id: 'Mengkuadratkan bisa membuat persamaan salah menjadi benar, sehingga kandidat mungkin memenuhi versi terkuadratkan tanpa memenuhi yang asli' },
                { en: 'Squaring always changes the solution set completely', id: 'Mengkuadratkan selalu mengubah seluruh himpunan solusi' },
                { en: 'It is just a formality with no real mathematical reason', id: 'Ini hanya formalitas tanpa alasan matematis yang sungguhan' },
                { en: 'Radical equations never actually have real solutions', id: 'Persamaan berakar sebenarnya tak pernah punya solusi real' },
              ],
              answer: 0,
              explain: {
                en: 'Squaring loses information about sign — $(-1)^2=1^2$ even though $-1 \\neq 1$ — so a value can pass the squared equation while failing the original, which is exactly what makes checking mandatory.',
                id: 'Mengkuadratkan kehilangan informasi tentang tanda — $(-1)^2=1^2$ meskipun $-1 \\neq 1$ — sehingga suatu nilai bisa lolos persamaan terkuadratkan tetapi gagal pada yang asli, yang persis membuat pemeriksaan itu wajib.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve $\\dfrac{3}{x} - \\dfrac{2}{x+3} = \\dfrac{12}{x^2-9}$, giving only the valid (non-extraneous) solution.',
                id: 'Selesaikan $\\dfrac{3}{x} - \\dfrac{2}{x+3} = \\dfrac{12}{x^2-9}$, berikan hanya solusi yang sah (bukan ekstraneus).',
              },
              template: 'x = ___',
              blanks: ['9'],
              explain: {
                en: 'Clearing denominators gives $x=9$ or $x=-3$, but $x=-3$ is extraneous since it makes the original denominators zero. Only $x=9$ is valid.',
                id: 'Menghilangkan penyebut memberi $x=9$ atau $x=-3$, tetapi $x=-3$ ekstraneus sebab membuat penyebut aslinya nol. Hanya $x=9$ yang sah.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Solve $2x - 1 = \\sqrt{2 - x}$, giving only the valid solution.',
                id: 'Selesaikan $2x - 1 = \\sqrt{2 - x}$, berikan hanya solusi yang sah.',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Square both sides, solve the resulting quadratic, then check both candidates in the original equation.', id: 'Kuadratkan kedua ruas, selesaikan kuadrat yang dihasilkan, lalu periksa kedua kandidat pada persamaan aslinya.' },
              ],
              explain: {
                en: 'Squaring gives $x=1$ or $x=-\\frac{1}{4}$; only $x=1$ satisfies the original (the left side must be $\\geq 0$ to equal a square root, which rules out $x=-\\frac{1}{4}$).',
                id: 'Mengkuadratkan memberi $x=1$ atau $x=-\\frac{1}{4}$; hanya $x=1$ memenuhi yang asli (ruas kiri harus $\\geq 0$ agar sama dengan akar kuadrat, yang menyingkirkan $x=-\\frac{1}{4}$).',
              },
            },
          ],
        },
        {
          id: 'dsr-m3-s2-l2',
          title: { en: 'Equations of Quadratic Type', id: 'Persamaan Bertipe Kuadrat' },
          goal: {
            en: 'Solve an equation of quadratic type by substituting for a repeated expression.',
            id: 'Menyelesaikan persamaan bertipe kuadrat dengan mensubstitusi bentuk yang berulang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Spotting the hidden quadratic', id: 'Mengenali kuadrat yang tersembunyi' },
              body: {
                en: 'An equation $aW^2+bW+c=0$, where $W$ stands for some algebraic expression, is of **quadratic type**. Substitute a single letter for that expression, solve the resulting ordinary quadratic, then substitute back.\n\nFor $x^4-8x^2+8=0$, notice $x^4=(x^2)^2$. Let $W=x^2$:\n$$W^2-8W+8=0 \\ \\Rightarrow \\ W = \\frac{8\\pm\\sqrt{64-32}}{2} = 4\\pm2\\sqrt{2}$$\nBoth values are positive, so each gives two real values of $x$: $x=\\pm\\sqrt{4+2\\sqrt2}$ and $x=\\pm\\sqrt{4-2\\sqrt2}$ — four solutions in total.',
                id: 'Persamaan $aW^2+bW+c=0$, dengan $W$ mewakili suatu bentuk aljabar, bertipe **kuadrat**. Substitusikan satu huruf untuk bentuk itu, selesaikan kuadrat biasa yang dihasilkan, lalu substitusikan kembali.\n\nUntuk $x^4-8x^2+8=0$, perhatikan $x^4=(x^2)^2$. Misalkan $W=x^2$:\n$$W^2-8W+8=0 \\ \\Rightarrow \\ W = \\frac{8\\pm\\sqrt{64-32}}{2} = 4\\pm2\\sqrt{2}$$\nKeduanya positif, sehingga masing-masing memberi dua nilai real $x$: $x=\\pm\\sqrt{4+2\\sqrt2}$ dan $x=\\pm\\sqrt{4-2\\sqrt2}$ — empat solusi seluruhnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A fractional-exponent version', id: 'Versi eksponen pecahan' },
              body: {
                en: 'The same trick works with fractional exponents. For $x^{1/3}-x^{1/6}-2=0$, notice $x^{1/3}=\\left(x^{1/6}\\right)^2$. Let $W=x^{1/6}$:\n$$W^2-W-2=0 \\ \\Rightarrow \\ (W-2)(W+1)=0 \\ \\Rightarrow \\ W=2 \\text{ or } W=-1$$\nSince $W=x^{1/6}$ is an even root, $W$ cannot be negative — reject $W=-1$. From $W=2$: $x^{1/6}=2 \\Rightarrow x=2^6=64$.',
                id: 'Trik yang sama berlaku dengan eksponen pecahan. Untuk $x^{1/3}-x^{1/6}-2=0$, perhatikan $x^{1/3}=\\left(x^{1/6}\\right)^2$. Misalkan $W=x^{1/6}$:\n$$W^2-W-2=0 \\ \\Rightarrow \\ (W-2)(W+1)=0 \\ \\Rightarrow \\ W=2 \\text{ atau } W=-1$$\nKarena $W=x^{1/6}$ adalah akar genap, $W$ tak boleh negatif — tolak $W=-1$. Dari $W=2$: $x^{1/6}=2 \\Rightarrow x=2^6=64$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For $x^4 - 8x^2 + 8 = 0$, what substitution turns it into an ordinary quadratic?',
                id: 'Untuk $x^4 - 8x^2 + 8 = 0$, substitusi apa yang mengubahnya menjadi kuadrat biasa?',
              },
              options: [
                { en: '$W = x^2$', id: '$W = x^2$' },
                { en: '$W = x^4$', id: '$W = x^4$' },
                { en: '$W = x$', id: '$W = x$' },
                { en: '$W = \\sqrt{x}$', id: '$W = \\sqrt{x}$' },
              ],
              answer: 0,
              explain: {
                en: 'Since $x^4=(x^2)^2$, setting $W=x^2$ turns the equation into $W^2-8W+8=0$, an ordinary quadratic in $W$.',
                id: 'Karena $x^4=(x^2)^2$, memisalkan $W=x^2$ mengubah persamaannya menjadi $W^2-8W+8=0$, kuadrat biasa dalam $W$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve $x^{1/3} - x^{1/6} - 2 = 0$.',
                id: 'Selesaikan $x^{1/3} - x^{1/6} - 2 = 0$.',
              },
              template: 'x = ___',
              blanks: ['64'],
              explain: {
                en: 'Letting $W=x^{1/6}$ gives $W^2-W-2=(W-2)(W+1)=0$; rejecting the negative root $W=-1$ leaves $W=2$, so $x=2^6=64$.',
                id: 'Memisalkan $W=x^{1/6}$ memberi $W^2-W-2=(W-2)(W+1)=0$; menolak akar negatif $W=-1$ menyisakan $W=2$, sehingga $x=2^6=64$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $x^4 - 8x^2 + 8 = 0$, find the largest real solution. (Round to two decimal places.)',
                id: 'Untuk $x^4 - 8x^2 + 8 = 0$, cari solusi real terbesar. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: Math.sqrt(4 + 2 * Math.sqrt(2)), tol: 0.01 }],
              hints: [
                { en: 'Let $W=x^2$; solve $W^2-8W+8=0$, then take the positive square root of the larger $W$.', id: 'Misalkan $W=x^2$; selesaikan $W^2-8W+8=0$, lalu ambil akar kuadrat positif dari $W$ yang lebih besar.' },
              ],
              explain: {
                en: '$W=4\\pm2\\sqrt2$; the larger root is $x=\\sqrt{4+2\\sqrt2}\\approx2{,}61$.',
                id: '$W=4\\pm2\\sqrt2$; akar yang lebih besar adalah $x=\\sqrt{4+2\\sqrt2}\\approx2{,}61$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m3-s2-l3',
          title: { en: 'Complex Numbers', id: 'Bilangan Kompleks' },
          goal: {
            en: 'Add, subtract, multiply, and divide complex numbers, and solve a quadratic with complex solutions.',
            id: 'Menjumlahkan, mengurangkan, mengalikan, dan membagi bilangan kompleks, dan menyelesaikan kuadrat dengan solusi kompleks.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A number whose square is negative', id: 'Bilangan yang kuadratnya negatif' },
              body: {
                en: '$x^2=-1$ has no real solution, since a square is never negative. Define $i = \\sqrt{-1}$, so $i^2=-1$. A **complex number** is $a+bi$ with $a, b$ real — $a$ the real part, $b$ the imaginary part. Complex numbers add, subtract, and multiply exactly like binomials, using $i^2=-1$ wherever it appears:\n$$(3+5i)+(4-2i) = 7+3i, \\qquad (3+5i)-(4-2i) = -1+7i$$\n$$(3+5i)(4-2i) = 12-6i+20i-10i^2 = 12+14i+10 = 22+14i$$',
                id: '$x^2=-1$ tak punya solusi real, sebab kuadrat tak pernah negatif. Definisikan $i = \\sqrt{-1}$, sehingga $i^2=-1$. **Bilangan kompleks** adalah $a+bi$ dengan $a, b$ real — $a$ bagian real, $b$ bagian imajiner. Bilangan kompleks dijumlahkan, dikurangkan, dan dikalikan persis seperti binomial, memakai $i^2=-1$ di mana pun ia muncul:\n$$(3+5i)+(4-2i) = 7+3i, \\qquad (3+5i)-(4-2i) = -1+7i$$\n$$(3+5i)(4-2i) = 12-6i+20i-10i^2 = 12+14i+10 = 22+14i$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Conjugates, division, and negative square roots', id: 'Konjugat, pembagian, dan akar kuadrat negatif' },
              body: {
                en: 'The **conjugate** of $a+bi$ is $\\overline{a+bi}=a-bi$, and $(a+bi)(a-bi)=a^2+b^2$ is always a nonnegative real — which is exactly what clears $i$ from a denominator:\n$$\\frac{3+5i}{1+2i} \\cdot \\frac{1-2i}{1-2i} = \\frac{13-i}{5} = \\frac{13}{5}-\\frac{1}{5}i$$\nFor $r<0$, the principal square root is $\\sqrt{r}=i\\sqrt{|r|}$, e.g. $\\sqrt{-16}=4i$. Always convert $\\sqrt{\\text{negative}}$ to $i\\sqrt{\\text{positive}}$ **before** multiplying two such roots — $\\sqrt{-2}\\cdot\\sqrt{-3} \\neq \\sqrt{6}$; it equals $i\\sqrt2 \\cdot i\\sqrt3 = i^2\\sqrt6 = -\\sqrt6$.',
                id: '**Konjugat** dari $a+bi$ adalah $\\overline{a+bi}=a-bi$, dan $(a+bi)(a-bi)=a^2+b^2$ selalu bilangan real taknegatif — yang persis menghilangkan $i$ dari penyebut:\n$$\\frac{3+5i}{1+2i} \\cdot \\frac{1-2i}{1-2i} = \\frac{13-i}{5} = \\frac{13}{5}-\\frac{1}{5}i$$\nUntuk $r<0$, akar kuadrat utamanya adalah $\\sqrt{r}=i\\sqrt{|r|}$, mis. $\\sqrt{-16}=4i$. Selalu ubah $\\sqrt{\\text{negatif}}$ menjadi $i\\sqrt{\\text{positif}}$ **sebelum** mengalikan dua akar semacam itu — $\\sqrt{-2}\\cdot\\sqrt{-3} \\neq \\sqrt{6}$; nilainya $i\\sqrt2 \\cdot i\\sqrt3 = i^2\\sqrt6 = -\\sqrt6$.',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Complex solutions of a quadratic', id: 'Solusi kompleks dari sebuah kuadrat' },
              body: {
                en: 'When $D=b^2-4ac<0$, the Quadratic Formula still works — it just produces complex solutions, always a conjugate pair since $\\pm\\sqrt{D}$ splits into $\\pm i\\sqrt{|D|}$.\n\nFor $x^2+4x+5=0$: $D=16-20=-4$, so\n$$x = \\frac{-4\\pm\\sqrt{-4}}{2} = \\frac{-4\\pm2i}{2} = -2\\pm i$$\nEvery quadratic equation has a solution once complex numbers are allowed — real if $D\\geq0$, complex if $D<0$.',
                id: 'Ketika $D=b^2-4ac<0$, Rumus Kuadrat tetap berlaku — ia hanya menghasilkan solusi kompleks, selalu sepasang konjugat sebab $\\pm\\sqrt{D}$ terbagi menjadi $\\pm i\\sqrt{|D|}$.\n\nUntuk $x^2+4x+5=0$: $D=16-20=-4$, sehingga\n$$x = \\frac{-4\\pm\\sqrt{-4}}{2} = \\frac{-4\\pm2i}{2} = -2\\pm i$$\nSetiap persamaan kuadrat punya solusi begitu bilangan kompleks diizinkan — real jika $D\\geq0$, kompleks jika $D<0$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $i^{23}$?',
                id: 'Berapakah $i^{23}$?',
              },
              options: [
                { en: '$-i$', id: '$-i$' },
                { en: '$i$', id: '$i$' },
                { en: '$1$', id: '$1$' },
                { en: '$-1$', id: '$-1$' },
              ],
              answer: 0,
              explain: {
                en: 'Powers of $i$ cycle every $4$: $i^{23}=i^{20}\\cdot i^3=(i^4)^5\\cdot i^3=1\\cdot(-i)=-i$, since $i^3=i^2\\cdot i=-i$.',
                id: 'Pangkat dari $i$ berputar setiap $4$: $i^{23}=i^{20}\\cdot i^3=(i^4)^5\\cdot i^3=1\\cdot(-i)=-i$, sebab $i^3=i^2\\cdot i=-i$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Solve $x^2 + 9 = 0$.',
                id: 'Selesaikan $x^2 + 9 = 0$.',
              },
              options: [
                { en: '$x = \\pm3i$', id: '$x = \\pm3i$' },
                { en: '$x = \\pm3$', id: '$x = \\pm3$' },
                { en: '$x = \\pm9i$', id: '$x = \\pm9i$' },
                { en: 'No solution exists', id: 'Tak ada solusi' },
              ],
              answer: 0,
              explain: {
                en: '$x^2=-9$, so $x=\\pm\\sqrt{-9}=\\pm3i$.',
                id: '$x^2=-9$, sehingga $x=\\pm\\sqrt{-9}=\\pm3i$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Multiply: $(3+5i)(4-2i)$, in the form $a + bi$.',
                id: 'Kalikan: $(3+5i)(4-2i)$, dalam bentuk $a + bi$.',
              },
              template: '(3+5i)(4-2i) = ___',
              blanks: ['22+14i'],
              explain: {
                en: 'FOIL with $i^2=-1$: $12-6i+20i-10i^2 = 12+14i+10 = 22+14i$.',
                id: 'FOIL dengan $i^2=-1$: $12-6i+20i-10i^2 = 12+14i+10 = 22+14i$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Solve $x^2 + 4x + 5 = 0$. Give the imaginary part of the solution with positive imaginary part.',
                id: 'Selesaikan $x^2 + 4x + 5 = 0$. Berikan bagian imajiner dari solusi dengan bagian imajiner positif.',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'The discriminant is $-4$, so $\\sqrt{D} = 2i$.', id: 'Diskriminannya $-4$, sehingga $\\sqrt{D} = 2i$.' },
              ],
              explain: {
                en: '$x = \\dfrac{-4\\pm2i}{2} = -2\\pm i$; the imaginary part of $-2+i$ is $1$.',
                id: '$x = \\dfrac{-4\\pm2i}{2} = -2\\pm i$; bagian imajiner dari $-2+i$ adalah $1$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m3-s2-p',
        runtime: 'math',
        title: { en: 'Extraneous Solutions and Complex Numbers', id: 'Solusi Ekstraneus dan Bilangan Kompleks' },
        brief: {
          en: 'A radical equation to check for extraneous roots, a quadratic-type substitution, and complex-number arithmetic.',
          id: 'Satu persamaan berakar untuk diperiksa akar ekstraneusnya, satu substitusi bertipe kuadrat, dan aritmetika bilangan kompleks.',
        },
        requirements: [
          { en: 'Every candidate from squaring or clearing denominators must be checked in the original equation.', id: 'Setiap kandidat dari mengkuadratkan atau menghilangkan penyebut harus diperiksa pada persamaan aslinya.' },
        ],
        tasks: [
          {
            prompt: { en: 'Solve $x = \\sqrt{x + 2}$, giving only the valid solution.', id: 'Selesaikan $x = \\sqrt{x + 2}$, berikan hanya solusi yang sah.' },
            blanks: [{ answer: 2 }],
            solution: ['x^2=x+2 \\Rightarrow x^2-x-2=0 \\Rightarrow (x-2)(x+1)=0; \\ x=-1 \\text{ is extraneous (LHS negative), so } x=2'],
          },
          {
            prompt: { en: 'Solve $x^{2/3} = 4$, giving the positive solution.', id: 'Selesaikan $x^{2/3} = 4$, berikan solusi positifnya.' },
            blanks: [{ answer: 8 }],
            solution: ['\\left(x^{1/3}\\right)^2=4 \\Rightarrow x^{1/3}=2 \\Rightarrow x=8'],
          },
          {
            prompt: { en: 'Find the real part of $\\dfrac{1+i}{1-i}$.', id: 'Cari bagian real dari $\\dfrac{1+i}{1-i}$.' },
            blanks: [{ answer: 0 }],
            solution: ['\\dfrac{1+i}{1-i}\\cdot\\dfrac{1+i}{1+i} = \\dfrac{(1+i)^2}{2} = \\dfrac{2i}{2} = i, \\text{ real part } 0'],
          },
        ],
        hints: [
          { en: 'For the first task, $x^{1/3}=-2$ has no rejection issue since cube roots of negatives are real — only even-root substitutions force you to discard a negative $W$.', id: 'Untuk butir pertama, $x^{1/3}=-2$ tak punya masalah penolakan sebab akar pangkat tiga dari bilangan negatif itu real — hanya substitusi akar genap yang memaksamu membuang $W$ negatif.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------- 1.7 modeling with equations */
    {
      id: 'dsr-m3-s3',
      title: { en: 'Modeling with Equations', id: 'Memodelkan dengan Persamaan' },
      summary: {
        en: 'Translating a word problem into an equation — interest, area, length, and similar triangles.',
        id: 'Menerjemahkan soal cerita menjadi persamaan — bunga, luas, panjang, dan segitiga sebangun.',
      },
      lessons: [
        {
          id: 'dsr-m3-s3-l1',
          title: { en: 'Translating Words into Equations', id: 'Menerjemahkan Kata-Kata Menjadi Persamaan' },
          goal: {
            en: 'Follow the four guidelines for setting up an equation from a word problem.',
            id: 'Mengikuti empat pedoman untuk menyusun persamaan dari soal cerita.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Four guidelines', id: 'Empat pedoman' },
              body: {
                en: 'Turning words into an equation always follows the same four steps: **identify the variable** (the quantity the question actually asks for), **translate to algebra** (express every quantity mentioned in terms of that variable), **set up the model** (find the sentence in the problem that becomes the equation), and **solve, and check** that the answer makes sense in the real-world context.\n\nA car rental costs \\$30/day plus 15¢/mile; a 2-day rental bills \\$108. Let $x$ = miles driven. Mileage cost is $0.15x$, daily cost is $2(30)=60$. The model: $0.15x+60=108$, so $x=320$ miles.',
                id: 'Mengubah kata-kata menjadi persamaan selalu mengikuti empat langkah yang sama: **identifikasi variabelnya** (kuantitas yang sungguh ditanyakan soalnya), **terjemahkan ke aljabar** (nyatakan setiap kuantitas yang disebut dalam bentuk variabel itu), **susun modelnya** (temukan kalimat dalam soal yang menjadi persamaannya), dan **selesaikan, dan periksa** apakah jawabannya masuk akal dalam konteks dunia nyata.\n\nSewa mobil berharga \\$30/hari plus 15¢/mil; sewa 2 hari menagih \\$108. Misalkan $x$ = mil yang ditempuh. Biaya jarak adalah $0.15x$, biaya harian adalah $2(30)=60$. Modelnya: $0.15x+60=108$, sehingga $x=320$ mil.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Interest problems', id: 'Soal bunga' },
              body: {
                en: 'Simple interest is $I=Prt$ ($P$ principal, $r$ annual rate as a decimal, $t$ years). If \\$100,000 is split between two accounts paying $6\\%$ and $4.5\\%$, totaling \\$5025 interest per year: let $x$ = amount at $6\\%$, so $100{,}000-x$ is at $4.5\\%$.\n$$0.06x + 0.045(100{,}000-x) = 5025$$\n$$0.06x+4500-0.045x = 5025 \\ \\Rightarrow \\ 0.015x=525 \\ \\Rightarrow \\ x=35{,}000$$\nSo \\$35,000 is invested at $6\\%$ and \\$65,000 at $4.5\\%$.',
                id: 'Bunga sederhana adalah $I=Prt$ ($P$ pokok, $r$ laju tahunan sebagai desimal, $t$ tahun). Jika \\$100.000 dibagi ke dua rekening berbunga $6\\%$ dan $4.5\\%$, totalnya \\$5025 bunga per tahun: misalkan $x$ = jumlah pada $6\\%$, sehingga $100{.}000-x$ pada $4.5\\%$.\n$$0.06x + 0.045(100{.}000-x) = 5025$$\n$$0.06x+4500-0.045x = 5025 \\ \\Rightarrow \\ 0.015x=525 \\ \\Rightarrow \\ x=35{.}000$$\nJadi \\$35.000 diinvestasikan pada $6\\%$ dan \\$65.000 pada $4.5\\%$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the first step in modeling a word problem with an equation?',
                id: 'Apa langkah pertama dalam memodelkan soal cerita dengan persamaan?',
              },
              options: [
                { en: 'Identify the variable — the quantity the question asks for', id: 'Identifikasi variabelnya — kuantitas yang ditanyakan soal' },
                { en: 'Solve for x immediately', id: 'Langsung selesaikan untuk x' },
                { en: 'Guess an answer and check it', id: 'Tebak sebuah jawaban dan periksa' },
                { en: 'Draw the graph of the equation', id: 'Gambar grafik persamaannya' },
              ],
              answer: 0,
              explain: {
                en: 'Every other step depends on first naming, with a variable, the exact quantity the problem is asking you to find.',
                id: 'Setiap langkah lain bergantung pada terlebih dahulu menamai, dengan sebuah variabel, kuantitas persis yang diminta soal untuk dicari.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'A rental charges \\$25/day plus 20¢/mile. A 3-day rental bills \\$115. Set up and solve for miles driven $x$.',
                id: 'Sebuah sewa membebankan \\$25/hari plus 20¢/mil. Sewa 3 hari menagih \\$115. Susun dan selesaikan untuk mil yang ditempuh $x$.',
              },
              template: '0.20x + 3(25) = 115 \\ \\Rightarrow \\ x = ___',
              blanks: ['200'],
              explain: {
                en: '$0.20x+75=115 \\Rightarrow 0.20x=40 \\Rightarrow x=200$ miles.',
                id: '$0.20x+75=115 \\Rightarrow 0.20x=40 \\Rightarrow x=200$ mil.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: '\\$50,000 is split between accounts paying $5\\%$ and $3\\%$, earning \\$2100 total interest per year. Find the amount invested at $5\\%$.',
                id: '\\$50.000 dibagi ke rekening berbunga $5\\%$ dan $3\\%$, menghasilkan total \\$2100 bunga per tahun. Cari jumlah yang diinvestasikan pada $5\\%$.',
              },
              blanks: [{ answer: 30000 }],
              hints: [
                { en: 'Let $x$ = amount at $5\\%$: $0.05x + 0.03(50{,}000-x) = 2100$.', id: 'Misalkan $x$ = jumlah pada $5\\%$: $0.05x + 0.03(50{.}000-x) = 2100$.' },
              ],
              explain: {
                en: '$0.05x+1500-0.03x=2100 \\Rightarrow 0.02x=600 \\Rightarrow x=30{,}000$.',
                id: '$0.05x+1500-0.03x=2100 \\Rightarrow 0.02x=600 \\Rightarrow x=30{.}000$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m3-s3-l2',
          title: { en: 'Area, Length, and Similar Triangles', id: 'Luas, Panjang, dan Segitiga Sebangun' },
          goal: {
            en: 'Model a geometric word problem using area, perimeter, or similar-triangle ratios.',
            id: 'Memodelkan soal cerita geometris memakai luas, keliling, atau rasio segitiga sebangun.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A garden with a walkway', id: 'Taman dengan jalan setapak' },
              body: {
                en: 'A square garden has a $3$-ft walkway around its outer edge; the **entire** area (garden plus walkway) is $18{,}000\\text{ ft}^2$. Let $x$ = the side of the planted area. The entire square then has side $x+6$ (the walkway adds $3$ ft on **each** side):\n$$(x+6)^2 = 18{,}000 \\ \\Rightarrow \\ x+6 = \\sqrt{18{,}000} \\ \\Rightarrow \\ x = \\sqrt{18{,}000}-6 \\approx 128 \\text{ ft}$$\nA rectangular lot $8$ ft longer than it is wide, with area $2900 \\text{ ft}^2$: let $w$ = width, so length is $w+8$:\n$$w(w+8)=2900 \\ \\Rightarrow \\ w^2+8w-2900=0 \\ \\Rightarrow \\ (w-50)(w+58)=0$$\nOnly the positive root makes sense: $w=50$ ft, length $58$ ft.',
                id: 'Taman berbentuk persegi punya jalan setapak $3$ kaki di sekeliling tepi luarnya; luas **seluruhnya** (taman plus jalan setapak) adalah $18{.}000\\text{ ft}^2$. Misalkan $x$ = sisi area yang ditanami. Seluruh persegi itu lalu bersisi $x+6$ (jalan setapak menambah $3$ kaki di **setiap** sisi):\n$$(x+6)^2 = 18{.}000 \\ \\Rightarrow \\ x+6 = \\sqrt{18{.}000} \\ \\Rightarrow \\ x = \\sqrt{18{.}000}-6 \\approx 128 \\text{ ft}$$\nLahan persegi panjang $8$ kaki lebih panjang dari lebarnya, dengan luas $2900 \\text{ ft}^2$: misalkan $w$ = lebar, sehingga panjangnya $w+8$:\n$$w(w+8)=2900 \\ \\Rightarrow \\ w^2+8w-2900=0 \\ \\Rightarrow \\ (w-50)(w+58)=0$$\nHanya akar positif yang masuk akal: $w=50$ kaki, panjang $58$ kaki.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Similar triangles', id: 'Segitiga sebangun' },
              body: {
                en: 'For similar triangles, the ratios of corresponding sides are equal. A person $6$ ft tall casts a $3.5$-ft shadow next to a building whose shadow is $28$ ft. Letting $h$ = building height, the small and large triangles give:\n$$\\frac{h}{28} = \\frac{6}{3.5} \\ \\Rightarrow \\ h = \\frac{6 \\cdot 28}{3.5} = 48 \\text{ ft}$$',
                id: 'Untuk segitiga sebangun, rasio sisi-sisi yang bersesuaian sama. Seseorang setinggi $6$ kaki membuat bayangan $3.5$ kaki di samping gedung yang bayangannya $28$ kaki. Misalkan $h$ = tinggi gedung, segitiga kecil dan besar memberi:\n$$\\frac{h}{28} = \\frac{6}{3.5} \\ \\Rightarrow \\ h = \\frac{6 \\cdot 28}{3.5} = 48 \\text{ ft}$$',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A rectangular lot is $5$ ft longer than it is wide, with area $500 \\text{ ft}^2$. Which equation models this, with $w$ = width?',
                id: 'Lahan persegi panjang $5$ kaki lebih panjang dari lebarnya, dengan luas $500 \\text{ ft}^2$. Persamaan mana yang memodelkan ini, dengan $w$ = lebar?',
              },
              options: [
                { en: '$w(w+5) = 500$', id: '$w(w+5) = 500$' },
                { en: '$w + (w+5) = 500$', id: '$w + (w+5) = 500$' },
                { en: '$w^2 = 500$', id: '$w^2 = 500$' },
                { en: '$2w + 2(w+5) = 500$', id: '$2w + 2(w+5) = 500$' },
              ],
              answer: 0,
              explain: {
                en: 'Area is width times length: $w \\cdot (w+5) = 500$. The last option models perimeter, not area.',
                id: 'Luas adalah lebar kali panjang: $w \\cdot (w+5) = 500$. Pilihan terakhir memodelkan keliling, bukan luas.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Solve $w(w+5) = 500$ for the positive value of $w$. (Round to two decimal places.)',
                id: 'Selesaikan $w(w+5) = 500$ untuk nilai positif $w$. (Bulatkan ke dua desimal.)',
              },
              template: 'w^2+5w-500=0 \\ \\Rightarrow \\ w = ___',
              blanks: ['20.85'],
              explain: {
                en: 'By the Quadratic Formula, $w=\\dfrac{-5+\\sqrt{25+2000}}{2}=\\dfrac{-5+\\sqrt{2025}}{2}=\\dfrac{-5+45}{2}=20$. (Note: $\\sqrt{2025}=45$ exactly, giving $w=20$ — round only if your intermediate steps used a decimal approximation.)',
                id: 'Dengan Rumus Kuadrat, $w=\\dfrac{-5+\\sqrt{25+2000}}{2}=\\dfrac{-5+\\sqrt{2025}}{2}=\\dfrac{-5+45}{2}=20$. (Catatan: $\\sqrt{2025}=45$ persis, memberi $w=20$ — bulatkan hanya jika langkah antaramu memakai pendekatan desimal.)',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A person $5.5$ ft tall casts a $4$-ft shadow beside a building with a $32$-ft shadow. Find the building\'s height. (Round to one decimal place.)',
                id: 'Seseorang setinggi $5.5$ kaki membuat bayangan $4$ kaki di samping gedung berbayangan $32$ kaki. Cari tinggi gedungnya. (Bulatkan ke satu desimal.)',
              },
              blanks: [{ answer: 44, tol: 0.1 }],
              hints: [
                { en: '$\\dfrac{h}{32} = \\dfrac{5.5}{4}$.', id: '$\\dfrac{h}{32} = \\dfrac{5.5}{4}$.' },
              ],
              explain: {
                en: '$h = \\dfrac{5.5 \\cdot 32}{4} = 44$ ft.',
                id: '$h = \\dfrac{5.5 \\cdot 32}{4} = 44$ ft.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m3-s3-p',
        runtime: 'math',
        title: { en: 'Modeling Word Problems', id: 'Memodelkan Soal Cerita' },
        brief: {
          en: 'An interest split, a rectangular-area problem, and a similar-triangles height problem.',
          id: 'Satu pembagian bunga, satu soal luas persegi panjang, dan satu soal tinggi memakai segitiga sebangun.',
        },
        requirements: [
          { en: 'Always name the variable first, in a sentence, before writing any algebra.', id: 'Selalu namai variabelnya terlebih dahulu, dalam sebuah kalimat, sebelum menulis aljabar apa pun.' },
        ],
        tasks: [
          {
            prompt: { en: '\\$20,000 is split between accounts at $7\\%$ and $4\\%$, earning \\$1160 per year. Find the amount at $7\\%$.', id: '\\$20.000 dibagi ke rekening berbunga $7\\%$ dan $4\\%$, menghasilkan \\$1160 per tahun. Cari jumlah pada $7\\%$.' },
            blanks: [{ answer: 12000 }],
            solution: ['0.07x+0.04(20{,}000-x)=1160 \\Rightarrow 0.03x=360 \\Rightarrow x=12{,}000'],
          },
          {
            prompt: { en: 'A rectangular lot is $3$ ft longer than it is wide, with area $154 \\text{ ft}^2$. Find the width.', id: 'Lahan persegi panjang $3$ kaki lebih panjang dari lebarnya, dengan luas $154 \\text{ ft}^2$. Cari lebarnya.' },
            blanks: [{ answer: 11 }],
            solution: ['w(w+3)=154 \\Rightarrow w^2+3w-154=0 \\Rightarrow (w-11)(w+14)=0 \\Rightarrow w=11'],
          },
          {
            prompt: { en: 'A $6$-ft person casts a $4$-ft shadow beside a tower with a $50$-ft shadow. Find the tower\'s height.', id: 'Orang setinggi $6$ kaki membuat bayangan $4$ kaki di samping menara berbayangan $50$ kaki. Cari tinggi menaranya.' },
            blanks: [{ answer: 75 }],
            solution: ['\\dfrac{h}{50}=\\dfrac{6}{4} \\Rightarrow h=75 \\text{ ft}'],
          },
        ],
        hints: [
          { en: 'For the area task, reject any negative root of the quadratic — a width can\'t be negative.', id: 'Untuk butir luas, tolak akar negatif mana pun dari kuadratnya — lebar tak bisa negatif.' },
        ],
        xp: 50,
      },
    },
  ],
}
