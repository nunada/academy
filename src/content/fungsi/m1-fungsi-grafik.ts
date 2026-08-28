import type { Module } from '../types'

/** Module 1 — what a function is, and what its graph shows you.
 *
 *  This is the chapter every calculus course opens with, and the one students
 *  arrive thinking they already know. They usually know how to evaluate; what
 *  they have not been made to do is say where a function is allowed to be
 *  evaluated, and read that off a picture. So domain comes early and stays. */
export const module1: Module = {
  id: 'fun-m1',
  title: { en: 'Functions and Their Graphs', id: 'Fungsi dan Grafiknya' },
  summary: {
    en: 'What a function is, where it is allowed to act, and everything its graph tells you at a glance.',
    id: 'Apa itu fungsi, di mana ia boleh bekerja, dan segala yang langsung diberitahukan grafiknya.',
  },
  submodules: [
    /* ------------------------------------------------ 1.1 domain and range */
    {
      id: 'fun-m1-s1',
      title: { en: 'Functions, Domain and Range', id: 'Fungsi, Domain, dan Range' },
      summary: {
        en: 'Evaluate a function, find where it is defined, and read both off a graph.',
        id: 'Menghitung nilai fungsi, menentukan di mana ia terdefinisi, dan membaca keduanya dari grafik.',
      },
      lessons: [
        {
          id: 'fun-m1-s1-l1',
          title: { en: 'What a Function Is', id: 'Apa Itu Fungsi' },
          goal: {
            en: 'Say what makes a rule a function, and evaluate one at a number and at an expression.',
            id: 'Menyebut apa yang membuat suatu aturan disebut fungsi, dan menghitung nilainya pada bilangan maupun pada bentuk aljabar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One input, one output', id: 'Satu masukan, satu keluaran' },
              body: {
                en: 'A **function** from a set $D$ to a set $Y$ is a rule that assigns to **each** element of $D$ **exactly one** element of $Y$. The set $D$ is the **domain**; the set of values the rule actually produces is the **range**.\n\nThe word doing the work is "exactly one". A rule that gives two answers for the same input is not a function — and neither is one that gives no answer at all for something in its domain.\n\nWe write $y = f(x)$, read "$y$ equals $f$ of $x$". Here $x$ is the **independent variable** (what you choose) and $y$ the **dependent variable** (what the rule then forces). The letter $f$ is the name of the rule, not a number, and $f(x)$ does not mean $f$ times $x$.',
                id: 'Sebuah **fungsi** dari himpunan $D$ ke himpunan $Y$ adalah aturan yang memasangkan **setiap** anggota $D$ dengan **tepat satu** anggota $Y$. Himpunan $D$ disebut **domain**; himpunan nilai yang benar-benar dihasilkan aturan itu disebut **range** (daerah hasil).\n\nKata yang bekerja di situ adalah "tepat satu". Aturan yang memberi dua jawaban untuk masukan yang sama bukanlah fungsi — begitu pula aturan yang tak memberi jawaban apa pun untuk sesuatu yang ada di domainnya.\n\nKita tulis $y = f(x)$, dibaca "$y$ sama dengan $f$ dari $x$". Di sini $x$ adalah **variabel bebas** (yang kamu pilih) dan $y$ **variabel terikat** (yang kemudian dipaksa oleh aturannya). Huruf $f$ adalah nama aturannya, bukan bilangan, dan $f(x)$ tidak berarti $f$ dikali $x$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Evaluating', id: 'Menghitung nilainya' },
              body: {
                en: 'To evaluate, put the input everywhere the variable appears. With $f(x) = x^2 - 3x$:\n$$f(4) = 4^2 - 3(4) = 16 - 12 = 4$$\nThe input need not be a number. Whatever you write in the brackets goes in every slot, brackets and all:\n$$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$$\n$$f(a + 1) = (a+1)^2 - 3(a+1)$$\nThose brackets around $-2$ are not decoration. Without them $-2^2$ is $-4$, and the sign of the whole answer changes.',
                id: 'Untuk menghitung nilainya, masukkan bilangannya ke setiap tempat variabelnya muncul. Dengan $f(x) = x^2 - 3x$:\n$$f(4) = 4^2 - 3(4) = 16 - 12 = 4$$\nMasukannya tidak harus bilangan. Apa pun yang kamu tulis di dalam kurung masuk ke setiap slot, lengkap dengan kurungnya:\n$$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$$\n$$f(a + 1) = (a+1)^2 - 3(a+1)$$\nKurung di sekeliling $-2$ itu bukan hiasan. Tanpanya $-2^2$ bernilai $-4$, dan tanda seluruh jawabannya berubah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which rule is **not** a function of $x$?',
                id: 'Aturan manakah yang **bukan** fungsi dari $x$?',
              },
              options: [
                { en: '$y = x^2$', id: '$y = x^2$' },
                { en: '$y^2 = x$', id: '$y^2 = x$' },
                { en: '$y = |x|$', id: '$y = |x|$' },
                { en: '$y = 5$ for every $x$', id: '$y = 5$ untuk setiap $x$' },
              ],
              answer: 1,
              explain: {
                en: '$y^2 = x$ gives two values of $y$ for every positive $x$ — at $x = 4$ both $y = 2$ and $y = -2$ satisfy it. The constant rule is a perfectly good function: every input gets exactly one output, and it happens to be the same one.',
                id: '$y^2 = x$ memberi dua nilai $y$ untuk setiap $x$ positif — pada $x = 4$ baik $y = 2$ maupun $y = -2$ memenuhinya. Aturan konstan justru fungsi yang sah: setiap masukan mendapat tepat satu keluaran, kebetulan keluaran yang sama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the evaluation of $f(x) = x^2 - 3x$ at $x = 2$.',
                id: 'Lengkapi penghitungan $f(x) = x^2 - 3x$ pada $x = 2$.',
              },
              template: 'f(2) = 2^2 - 3(2) = 4 - 6 = ___',
              blanks: ['-2'],
              explain: {
                en: '$4 - 6 = -2$. A function may perfectly well return a negative value at a positive input.',
                id: '$4 - 6 = -2$. Fungsi boleh saja menghasilkan nilai negatif pada masukan yang positif.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = 2x^2 - 5x + 1$. Evaluate it at each of these.',
                id: 'Misalkan $f(x) = 2x^2 - 5x + 1$. Hitung nilainya pada tiap masukan berikut.',
              },
              blanks: [
                { label: 'f(3) =', answer: 4 },
                { label: 'f(-1) =', answer: 8 },
                { label: 'f(0) =', answer: 1 },
              ],
              hints: [
                { en: 'Square first, then multiply, then add — the usual order.', id: 'Kuadratkan dulu, lalu kalikan, lalu jumlahkan — urutan operasi biasa.' },
                { en: 'For $f(-1)$: $2(-1)^2 = 2$ and $-5(-1) = +5$.', id: 'Untuk $f(-1)$: $2(-1)^2 = 2$ dan $-5(-1) = +5$.' },
              ],
              solution: [
                'f(3) = 2(9) - 15 + 1 = 18 - 15 + 1 = 4',
                'f(-1) = 2(1) + 5 + 1 = 8',
                'f(0) = 0 - 0 + 1 = 1',
              ],
              explain: {
                en: 'Note $f(0) = 1$: the constant term is always the value at zero, which is also where the graph crosses the vertical axis.',
                id: 'Perhatikan $f(0) = 1$: suku konstannya selalu merupakan nilai pada nol, dan di situ pula grafiknya memotong sumbu tegak.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s1-l2',
          title: { en: 'Natural Domain', id: 'Domain Alami' },
          goal: {
            en: 'Find every input a formula forbids, and state the domain that is left.',
            id: 'Menemukan setiap masukan yang dilarang oleh rumusnya, dan menyatakan domain yang tersisa.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two things arithmetic refuses', id: 'Dua hal yang ditolak aritmetika' },
              body: {
                en: 'When a function is given by a formula and nothing else is said, its domain is the **natural domain**: every real number the formula can actually be evaluated at. Only two things rule an input out, and you look for both every time.\n\n**A zero denominator.** $\\dfrac{1}{x-3}$ is undefined at $x = 3$. Set the denominator to zero, solve, and throw those values out.\n\n**An even root of a negative.** $\\sqrt{x-4}$ is undefined for $x < 4$. Set what is under the root $\\geq 0$ and solve. An **odd** root has no such trouble: $\\sqrt[3]{-8} = -2$.\n\nLater you will meet a third — the logarithm, which refuses zero and everything below it.',
                id: 'Ketika sebuah fungsi diberikan lewat rumus dan tak ada keterangan lain, domainnya adalah **domain alami**: semua bilangan real yang benar-benar bisa dimasukkan ke rumus itu. Hanya dua hal yang menggugurkan sebuah masukan, dan keduanya diperiksa setiap kali.\n\n**Penyebut nol.** $\\dfrac{1}{x-3}$ tak terdefinisi di $x = 3$. Nolkan penyebutnya, selesaikan, lalu buang nilai-nilai itu.\n\n**Akar genap dari bilangan negatif.** $\\sqrt{x-4}$ tak terdefinisi untuk $x < 4$. Buat yang di bawah akarnya $\\geq 0$ lalu selesaikan. Akar **ganjil** tidak bermasalah: $\\sqrt[3]{-8} = -2$.\n\nNanti kamu akan bertemu yang ketiga — logaritma, yang menolak nol dan semua yang di bawahnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 8],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/(x-3)', color: 'a', label: '1/(x−3)' },
                  { t: 'vline', x: 3, color: 'a' },
                  { t: 'curve', f: 'sqrt(x-4)', from: 4, color: 'b', label: '√(x−4)' },
                  { t: 'dot', x: 4, y: 0, color: 'b' },
                ],
                caption: {
                  en: 'Two forbidden inputs, and what they look like. The first curve has nothing at all at $x = 3$ — it runs off in both directions instead. The second simply does not start until $x = 4$.',
                  id: 'Dua masukan terlarang, dan seperti apa bentuknya. Kurva pertama sama sekali tak punya nilai di $x = 3$ — ia justru lari ke dua arah. Kurva kedua sekadar belum mulai sebelum $x = 4$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Writing a domain down', id: 'Menuliskan domain' },
              body: {
                en: 'Interval notation is the usual shorthand. A square bracket includes the endpoint, a round one excludes it, and infinity always gets a round one because it is not a number you can reach.\n$$[4, \\infty) \\text{ berarti } x \\geq 4$$\n$$(-\\infty, 3) \\cup (3, \\infty) \\text{ berarti setiap } x \\text{ kecuali } 3$$\nWhen a formula has both kinds of trouble, both conditions must hold at once. For $\\dfrac{\\sqrt{x-1}}{x-5}$ you need $x \\geq 1$ **and** $x \\neq 5$, so the domain is $[1, 5) \\cup (5, \\infty)$.',
                id: 'Notasi selang adalah cara ringkas yang lazim. Kurung siku memuat titik ujungnya, kurung biasa tidak, dan tak hingga selalu memakai kurung biasa karena ia bukan bilangan yang bisa dicapai.\n$$[4, \\infty) \\text{ berarti } x \\geq 4$$\n$$(-\\infty, 3) \\cup (3, \\infty) \\text{ berarti setiap } x \\text{ kecuali } 3$$\nBila sebuah rumus mengandung kedua jenis masalah, kedua syaratnya harus berlaku bersamaan. Untuk $\\dfrac{\\sqrt{x-1}}{x-5}$ diperlukan $x \\geq 1$ **dan** $x \\neq 5$, sehingga domainnya $[1, 5) \\cup (5, \\infty)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the natural domain of $g(x) = \\sqrt{9 - x^2}$?',
                id: 'Apa domain alami dari $g(x) = \\sqrt{9 - x^2}$?',
              },
              options: [
                { en: '$x \\geq 3$', id: '$x \\geq 3$' },
                { en: '$-3 \\leq x \\leq 3$', id: '$-3 \\leq x \\leq 3$' },
                { en: 'Every real number', id: 'Semua bilangan real' },
                { en: '$x \\leq -3$ or $x \\geq 3$', id: '$x \\leq -3$ atau $x \\geq 3$' },
              ],
              answer: 1,
              explain: {
                en: 'You need $9 - x^2 \\geq 0$, that is $x^2 \\leq 9$, which is $-3 \\leq x \\leq 3$. Squaring makes both ends matter: $x = -4$ fails just as $x = 4$ does.',
                id: 'Diperlukan $9 - x^2 \\geq 0$, yaitu $x^2 \\leq 9$, yang berarti $-3 \\leq x \\leq 3$. Pengkuadratan membuat kedua ujungnya berpengaruh: $x = -4$ gagal sama seperti $x = 4$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the number each formula forbids or begins at.',
                id: 'Tentukan bilangan yang dilarang atau yang menjadi awal bagi tiap rumus.',
              },
              blanks: [
                { label: '\\tfrac{5}{2x - 7}: \\text{ x yang dilarang} =', answer: 3.5 },
                { label: '\\sqrt{3x - 12}: \\text{ x terkecil} =', answer: 4 },
              ],
              hints: [
                { en: 'Set the denominator to zero for the first; set the inside of the root to zero for the second.', id: 'Nolkan penyebutnya untuk yang pertama; nolkan isi akarnya untuk yang kedua.' },
              ],
              solution: [
                '2x - 7 = 0 \\Rightarrow x = \\tfrac{7}{2} = 3{,}5',
                '3x - 12 \\geq 0 \\Rightarrow x \\geq 4',
              ],
              explain: {
                en: 'The first has domain $(-\\infty, 3{,}5) \\cup (3{,}5, \\infty)$; the second $[4, \\infty)$. One value is removed from the middle, the other is where everything starts.',
                id: 'Yang pertama berdomain $(-\\infty; 3{,}5) \\cup (3{,}5; \\infty)$; yang kedua $[4, \\infty)$. Yang satu membuang satu nilai di tengah, yang lain menjadi tempat semuanya bermula.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s1-l3',
          title: { en: 'Graphs and the Vertical Line Test', id: 'Grafik dan Uji Garis Tegak' },
          goal: {
            en: 'Read domain, range and intercepts off a picture, and test whether a curve is a function at all.',
            id: 'Membaca domain, range, dan titik potong dari gambar, serta menguji apakah suatu kurva memang fungsi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The graph is the set of pairs', id: 'Grafik adalah himpunan pasangannya' },
              body: {
                en: 'The **graph** of $f$ is the set of points $(x, f(x))$ for every $x$ in the domain. So a graph is not a decoration attached to the formula — it *is* the function, drawn.\n\nThat gives the **vertical line test**: a curve in the plane is the graph of a function of $x$ exactly when no vertical line meets it more than once. A second meeting would be a second value of $y$ for one $x$, which the definition forbids.\n\nFrom the picture you can read: the **domain** as the shadow of the curve on the horizontal axis, the **range** as its shadow on the vertical axis, the **$y$-intercept** as $f(0)$, and the **$x$-intercepts** as the solutions of $f(x) = 0$.',
                id: '**Grafik** dari $f$ adalah himpunan titik $(x, f(x))$ untuk setiap $x$ di domainnya. Jadi grafik bukan hiasan yang ditempelkan pada rumus — ia *adalah* fungsinya, digambar.\n\nDari situ lahir **uji garis tegak**: sebuah kurva di bidang merupakan grafik fungsi dari $x$ tepat ketika tak ada garis tegak yang memotongnya lebih dari sekali. Perpotongan kedua berarti ada nilai $y$ kedua untuk satu $x$, dan itu dilarang oleh definisinya.\n\nDari gambarnya kamu bisa membaca: **domain** sebagai bayangan kurva pada sumbu mendatar, **range** sebagai bayangannya pada sumbu tegak, **titik potong sumbu $y$** sebagai $f(0)$, dan **titik potong sumbu $x$** sebagai penyelesaian $f(x) = 0$.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(9-x^2)', from: -3, to: 3, color: 'a', label: 'setengah atas' },
                  { t: 'curve', f: '-sqrt(9-x^2)', from: -3, to: 3, color: 'muted', dashed: true, label: 'setengah bawah' },
                  { t: 'vline', x: 1.5, color: 'b' },
                ],
                caption: {
                  en: 'The whole circle fails the test — the vertical line meets it twice. The solid upper half passes, and it is the graph of $y = \\sqrt{9 - x^2}$: domain $[-3, 3]$, range $[0, 3]$.',
                  id: 'Lingkaran utuh tidak lolos uji — garis tegaknya memotong dua kali. Setengah bagian atas yang digambar penuh lolos, dan itulah grafik $y = \\sqrt{9 - x^2}$: domain $[-3, 3]$, range $[0, 3]$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A graph runs from $x = -2$ to $x = 5$, dipping to a lowest point of $-3$ and rising to a highest point of $4$. What is its range?',
                id: 'Sebuah grafik terbentang dari $x = -2$ sampai $x = 5$, turun sampai titik terendah $-3$ dan naik sampai titik tertinggi $4$. Apa range-nya?',
              },
              options: [
                { en: '$[-2, 5]$', id: '$[-2, 5]$' },
                { en: '$[-3, 4]$', id: '$[-3, 4]$' },
                { en: '$[-3, 5]$', id: '$[-3, 5]$' },
                { en: 'It cannot be told from that description.', id: 'Tak bisa ditentukan dari keterangan itu.' },
              ],
              answer: 1,
              explain: {
                en: 'The range is read off the **vertical** axis: lowest output to highest output, $[-3, 4]$. The $x$ values $[-2, 5]$ are the domain — swapping the two is the most common slip here.',
                id: 'Range dibaca dari sumbu **tegak**: dari keluaran terendah sampai tertinggi, $[-3, 4]$. Nilai $x$ yaitu $[-2, 5]$ adalah domainnya — menukar keduanya adalah kekeliruan yang paling sering terjadi di sini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working that finds the intercepts of $y = x^2 - 4x + 3$.',
                id: 'Susun langkah untuk menentukan titik-titik potong $y = x^2 - 4x + 3$.',
              },
              lines: [
                'x = 0: \\quad y = 0 - 0 + 3 = 3',
                '\\text{potong sumbu } y: (0, 3)',
                'y = 0: \\quad x^2 - 4x + 3 = (x-1)(x-3) = 0',
                '\\text{potong sumbu } x: (1, 0) \\text{ dan } (3, 0)',
              ],
              explain: {
                en: 'Set $x = 0$ for the vertical intercept and $y = 0$ for the horizontal ones. There is at most one of the first — a function has only one value at zero — but there may be several of the second.',
                id: 'Nolkan $x$ untuk titik potong sumbu tegak dan nolkan $y$ untuk yang mendatar. Yang pertama paling banyak satu — fungsi hanya punya satu nilai di nol — sedangkan yang kedua bisa beberapa.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $y = x^2 - 4x + 3$, find the intercepts and the lowest point.',
                id: 'Untuk $y = x^2 - 4x + 3$, tentukan titik-titik potongnya dan titik terendahnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-2, 6],
                ticks: true,
                items: [{ t: 'curve', f: 'x^2-4*x+3', color: 'a' }],
                caption: {
                  en: 'Read your answers against the curve when you are done.',
                  id: 'Cocokkan jawabanmu dengan kurvanya setelah selesai.',
                },
              },
              blanks: [
                { label: '\\text{potong sumbu } y: \\ y =', answer: 3 },
                { label: '\\text{potong sumbu } x: \\ x =', answer: 1 },
                { label: '\\text{dan } x =', answer: 3 },
                { label: '\\text{titik terendah: } y =', answer: -1 },
              ],
              hints: [
                { en: 'The lowest point of $ax^2 + bx + c$ sits at $x = -b/(2a)$.', id: 'Titik terendah $ax^2 + bx + c$ berada di $x = -b/(2a)$.' },
                { en: 'Here $x = 4/2 = 2$; now put 2 back into the formula.', id: 'Di sini $x = 4/2 = 2$; sekarang masukkan 2 kembali ke rumusnya.' },
              ],
              solution: [
                'y\\text{-int}: f(0) = 3',
                'x\\text{-int}: (x-1)(x-3) = 0 \\Rightarrow x = 1, \\ x = 3',
                'x_{\\text{puncak}} = \\tfrac{4}{2} = 2, \\quad f(2) = 4 - 8 + 3 = -1',
              ],
              explain: {
                en: 'The turning point sits halfway between the two roots, at $x = 2$, and its value $-1$ is the smallest the function takes. So the range is $[-1, \\infty)$.',
                id: 'Titik baliknya berada tepat di tengah kedua akarnya, di $x = 2$, dan nilainya $-1$ adalah yang terkecil yang dicapai fungsi itu. Jadi range-nya $[-1, \\infty)$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m1-s1-p',
        runtime: 'math',
        title: { en: 'Domain, Range, Value', id: 'Domain, Range, Nilai' },
        brief: {
          en: 'Three problems: evaluate, find what a formula forbids, and read a parabola.',
          id: 'Tiga soal: menghitung nilai, menemukan yang dilarang sebuah rumus, dan membaca parabola.',
        },
        requirements: [
          { en: 'Check every formula for a zero denominator and for an even root of a negative.', id: 'Periksa setiap rumus terhadap penyebut nol dan akar genap dari bilangan negatif.' },
          { en: 'Fractions are read as they are: `7/2` needs no decimal.', id: 'Pecahan dibaca apa adanya: `7/2` tak perlu diubah ke desimal.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $f(x) = \\dfrac{x + 1}{x - 2}$, evaluate $f(5)$ and $f(0)$.',
              id: 'Untuk $f(x) = \\dfrac{x + 1}{x - 2}$, hitung $f(5)$ dan $f(0)$.',
            },
            blanks: [
              { label: 'f(5) =', answer: 2 },
              { label: 'f(0) =', answer: -0.5 },
            ],
            solution: ['f(5) = \\tfrac{6}{3} = 2', 'f(0) = \\tfrac{1}{-2} = -\\tfrac{1}{2}'],
          },
          {
            prompt: {
              en: 'The domain of $g(x) = \\dfrac{\\sqrt{x - 1}}{x - 5}$ starts at one number and is missing another. Find both.',
              id: 'Domain dari $g(x) = \\dfrac{\\sqrt{x - 1}}{x - 5}$ dimulai pada satu bilangan dan kehilangan satu bilangan lain. Tentukan keduanya.',
            },
            blanks: [
              { label: '\\text{dimulai di } x =', answer: 1 },
              { label: '\\text{dilarang: } x =', answer: 5 },
            ],
            solution: [
              'x - 1 \\geq 0 \\Rightarrow x \\geq 1',
              'x - 5 \\neq 0 \\Rightarrow x \\neq 5',
              'D = [1, 5) \\cup (5, \\infty)',
            ],
          },
          {
            prompt: {
              en: 'For $y = -x^2 + 6x - 5$, find the two $x$-intercepts and the highest value the function reaches.',
              id: 'Untuk $y = -x^2 + 6x - 5$, tentukan kedua titik potong sumbu $x$ dan nilai tertinggi yang dicapai fungsi itu.',
            },
            blanks: [
              { label: 'x =', answer: 1 },
              { label: '\\text{dan } x =', answer: 5 },
              { label: 'y_{\\text{maks}} =', answer: 4 },
            ],
            solution: [
              '-x^2 + 6x - 5 = -(x-1)(x-5) = 0 \\Rightarrow x = 1, \\ x = 5',
              'x_{\\text{puncak}} = \\tfrac{-6}{2(-1)} = 3',
              'y = -9 + 18 - 5 = 4',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 3 the leading coefficient is negative, so the parabola opens downwards and the turning point is a maximum, not a minimum.',
            id: 'Pada butir 3 koefisien utamanya negatif, jadi parabolanya terbuka ke bawah dan titik baliknya maksimum, bukan minimum.',
          },
          {
            en: 'The turning point always sits halfway between the two roots — here halfway between 1 and 5.',
            id: 'Titik baliknya selalu berada tepat di tengah kedua akarnya — di sini di tengah 1 dan 5.',
          },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------- 1.2 reading off a graph */
    {
      id: 'fun-m1-s2',
      title: { en: 'Reading a Graph', id: 'Membaca Grafik' },
      summary: {
        en: 'Piecewise rules, symmetry, where a function rises and falls, and the families it may belong to.',
        id: 'Aturan sepotong-sepotong, kesimetrian, di mana fungsi naik dan turun, serta keluarga tempat ia bernaung.',
      },
      lessons: [
        {
          id: 'fun-m1-s2-l1',
          title: { en: 'Piecewise Functions and Absolute Value', id: 'Fungsi Sepotong-sepotong dan Nilai Mutlak' },
          goal: {
            en: 'Evaluate a function given by different rules on different intervals, and see $|x|$ as one of them.',
            id: 'Menghitung nilai fungsi yang aturannya berbeda pada selang berbeda, dan melihat $|x|$ sebagai salah satunya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A different rule on each stretch', id: 'Aturan berbeda di tiap bagian' },
              body: {
                en: 'Nothing says one function must be one formula. A **piecewise** function gives a rule for each part of its domain:\n$$f(x) = \\begin{cases} -x, & x < 1 \\\\ x^2, & x \\geq 1 \\end{cases}$$\nTo evaluate, first decide which line the input falls under, then use only that line. $f(-3)$ uses the top ($-3 < 1$) and equals 3; $f(4)$ uses the bottom and equals 16.\n\nThe boundary belongs to exactly one line — here $x = 1$ goes with the bottom, because of the $\\geq$. On the graph that is drawn with a **filled dot** where the value is taken and a **hollow dot** where it is not.',
                id: 'Tak ada yang mengharuskan satu fungsi berupa satu rumus. Fungsi **sepotong-sepotong** memberi satu aturan untuk tiap bagian domainnya:\n$$f(x) = \\begin{cases} -x, & x < 1 \\\\ x^2, & x \\geq 1 \\end{cases}$$\nUntuk menghitung nilainya, tentukan dulu masukannya jatuh pada baris yang mana, lalu pakai baris itu saja. $f(-3)$ memakai baris atas ($-3 < 1$) dan bernilai 3; $f(4)$ memakai baris bawah dan bernilai 16.\n\nBatasnya menjadi milik tepat satu baris — di sini $x = 1$ ikut baris bawah, karena tanda $\\geq$-nya. Pada grafik hal itu digambar dengan **titik penuh** di tempat nilainya diambil dan **titik kosong** di tempat nilainya tidak diambil.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-3, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: '-x', from: -4, to: 1, color: 'a' },
                  { t: 'curve', f: 'x^2', from: 1, to: 2.2, color: 'b' },
                  { t: 'dot', x: 1, y: -1, open: true, color: 'a' },
                  { t: 'dot', x: 1, y: 1, color: 'b' },
                ],
                caption: {
                  en: 'At $x = 1$ the top rule would have given $-1$, but it is not allowed to — hence the hollow dot. The value there is $1$, from the bottom rule.',
                  id: 'Di $x = 1$ aturan atas akan memberi $-1$, tetapi ia tidak diizinkan — karena itulah titiknya kosong. Nilainya di situ adalah $1$, dari aturan bawah.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Absolute value is piecewise', id: 'Nilai mutlak itu sepotong-sepotong' },
              body: {
                en: '$|x|$ means the distance from $x$ to zero, which is exactly\n$$|x| = \\begin{cases} x, & x \\geq 0 \\\\ -x, & x < 0 \\end{cases}$$\nSo $|-7| = -(-7) = 7$. The minus sign in the second line does not make the answer negative; it makes it positive, because $x$ was already negative.\n\nIts graph is a V with the corner at the origin. Every absolute-value graph in this course is that V, moved and stretched.',
                id: '$|x|$ berarti jarak dari $x$ ke nol, yang persis sama dengan\n$$|x| = \\begin{cases} x, & x \\geq 0 \\\\ -x, & x < 0 \\end{cases}$$\nJadi $|-7| = -(-7) = 7$. Tanda minus pada baris kedua tidak membuat jawabannya negatif; justru membuatnya positif, karena $x$-nya memang sudah negatif.\n\nGrafiknya berupa huruf V dengan sudut di titik asal. Setiap grafik nilai mutlak dalam kursus ini adalah V itu, yang digeser dan diregangkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With $f$ as in the figure above, what is $f(1)$?',
                id: 'Dengan $f$ seperti pada gambar di atas, berapakah $f(1)$?',
              },
              options: [
                { en: '$-1$', id: '$-1$' },
                { en: '$1$', id: '$1$' },
                { en: 'Both — it is defined twice.', id: 'Keduanya — ia terdefinisi dua kali.' },
                { en: 'Undefined.', id: 'Tak terdefinisi.' },
              ],
              answer: 1,
              explain: {
                en: 'The second line carries $x \\geq 1$, so $x = 1$ belongs to it and $f(1) = 1^2 = 1$. If both lines had claimed $x = 1$ with different values, the rule would not be a function at all.',
                id: 'Baris kedua membawa syarat $x \\geq 1$, jadi $x = 1$ menjadi miliknya dan $f(1) = 1^2 = 1$. Kalau kedua baris sama-sama mengklaim $x = 1$ dengan nilai berbeda, aturannya justru bukan fungsi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $f(x) = -x$ for $x < 1$ and $f(x) = x^2$ for $x \\geq 1$, evaluate each.',
                id: 'Dengan $f(x) = -x$ untuk $x < 1$ dan $f(x) = x^2$ untuk $x \\geq 1$, hitung tiap nilainya.',
              },
              blanks: [
                { label: 'f(-3) =', answer: 3 },
                { label: 'f(0) =', answer: 0 },
                { label: 'f(1) =', answer: 1 },
                { label: 'f(3) =', answer: 9 },
              ],
              hints: [
                { en: 'Decide which line the input falls under before you calculate anything.', id: 'Tentukan masukannya jatuh pada baris yang mana sebelum menghitung apa pun.' },
                { en: '$-3$ and $0$ are both below 1; $1$ and $3$ are not.', id: '$-3$ dan $0$ sama-sama di bawah 1; $1$ dan $3$ tidak.' },
              ],
              explain: {
                en: 'Three of these use the first rule or the second cleanly. The interesting one is $f(1) = 1$, which is where the two rules meet — and here they happen to disagree, which is why the graph jumps.',
                id: 'Tiga di antaranya memakai aturan pertama atau kedua dengan jelas. Yang menarik adalah $f(1) = 1$, tempat kedua aturan bertemu — dan di sini keduanya kebetulan tidak sepakat, itulah sebabnya grafiknya melompat.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s2-l2',
          title: { en: 'Even, Odd, and Symmetry', id: 'Genap, Ganjil, dan Simetri' },
          goal: {
            en: 'Test a formula for symmetry, and know what each kind looks like.',
            id: 'Menguji kesimetrian sebuah rumus, dan mengetahui rupa masing-masing jenisnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two symmetries, one test', id: 'Dua kesimetrian, satu uji' },
              body: {
                en: 'A function is **even** if $f(-x) = f(x)$ for every $x$ in its domain, and **odd** if $f(-x) = -f(x)$.\n\nThe test is always the same: replace $x$ by $-x$, simplify, and compare the result with the original.\n\n**Even** means the graph is symmetric about the $y$-axis — fold the page along it and the halves match. $x^2$, $x^4$ and $|x|$ are even, and the even powers are where the name comes from.\n\n**Odd** means symmetric about the origin — turn the page a half-turn and the graph lands on itself. $x$, $x^3$ and $1/x$ are odd.\n\nMost functions are neither. $x^2 + x$ is neither, and there is nothing wrong with it.',
                id: 'Sebuah fungsi disebut **genap** bila $f(-x) = f(x)$ untuk setiap $x$ di domainnya, dan **ganjil** bila $f(-x) = -f(x)$.\n\nUjinya selalu sama: ganti $x$ dengan $-x$, sederhanakan, lalu bandingkan hasilnya dengan yang semula.\n\n**Genap** berarti grafiknya simetris terhadap sumbu $y$ — lipat kertasnya pada sumbu itu dan kedua belahannya berimpit. $x^2$, $x^4$, dan $|x|$ genap, dan dari pangkat genap itulah namanya berasal.\n\n**Ganjil** berarti simetris terhadap titik asal — putar kertasnya setengah putaran dan grafiknya kembali menempati dirinya. $x$, $x^3$, dan $1/x$ ganjil.\n\nKebanyakan fungsi bukan keduanya. $x^2 + x$ bukan genap maupun ganjil, dan itu sama sekali tidak keliru.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'a', label: 'x² genap' },
                  { t: 'curve', f: 'x^3', color: 'b', label: 'x³ ganjil' },
                ],
                caption: {
                  en: 'Fold along the vertical axis and the parabola matches itself. Turn the page half a turn and the cubic matches itself.',
                  id: 'Lipat pada sumbu tegak dan parabolanya berimpit dengan dirinya. Putar kertasnya setengah putaran dan kurva pangkat tiganya berimpit dengan dirinya.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Substitute $-x$ into $f(x) = x^4 - 3x^2$ and finish the comparison.',
                id: 'Substitusikan $-x$ ke $f(x) = x^4 - 3x^2$ lalu selesaikan perbandingannya.',
              },
              template: 'f(-x) = (-x)^4 - 3(-x)^2 = x^4 - ___ x^2',
              blanks: ['3'],
              explain: {
                en: 'Both powers are even, so both minus signs vanish and $f(-x) = f(x)$: the function is even.',
                id: 'Kedua pangkatnya genap, jadi kedua tanda minusnya lenyap dan $f(-x) = f(x)$: fungsinya genap.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Is $h(x) = x^3 + 2x$ even, odd, or neither?',
                id: 'Apakah $h(x) = x^3 + 2x$ genap, ganjil, atau bukan keduanya?',
              },
              options: [
                { en: 'Even', id: 'Genap' },
                { en: 'Odd', id: 'Ganjil' },
                { en: 'Neither', id: 'Bukan keduanya' },
                { en: 'Both', id: 'Keduanya' },
              ],
              answer: 1,
              explain: {
                en: '$h(-x) = -x^3 - 2x = -(x^3 + 2x) = -h(x)$. Every power is odd, so every term changes sign together — which is exactly what being odd means.',
                id: '$h(-x) = -x^3 - 2x = -(x^3 + 2x) = -h(x)$. Setiap pangkatnya ganjil, jadi semua sukunya berganti tanda bersama-sama — dan itu persis makna ganjil.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $h(x) = x^3 + 2x$, compute both values and see the symmetry in the numbers.',
                id: 'Untuk $h(x) = x^3 + 2x$, hitung kedua nilainya dan lihat kesimetriannya pada bilangan-bilangannya.',
              },
              blanks: [
                { label: 'h(2) =', answer: 12 },
                { label: 'h(-2) =', answer: -12 },
              ],
              hints: [{ en: '$(-2)^3 = -8$, not $8$.', id: '$(-2)^3 = -8$, bukan $8$.' }],
              solution: ['h(2) = 8 + 4 = 12', 'h(-2) = -8 - 4 = -12 = -h(2)'],
              explain: {
                en: 'The two values are negatives of each other, as they must be for an odd function. An even function would have given the same number twice.',
                id: 'Kedua nilainya saling berlawanan tanda, sebagaimana seharusnya untuk fungsi ganjil. Fungsi genap akan memberi bilangan yang sama dua kali.',
              },
            },
          ],
        },
        {
          id: 'fun-m1-s2-l3',
          title: { en: 'Rising, Falling, and the Standard Families', id: 'Naik, Turun, dan Keluarga Fungsi Baku' },
          goal: {
            en: 'Say where a function increases or decreases, and name the family a formula belongs to.',
            id: 'Menyebut di mana fungsi naik atau turun, dan menamai keluarga tempat sebuah rumus bernaung.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Increasing and decreasing', id: 'Naik dan turun' },
              body: {
                en: 'On an interval $I$, a function is **increasing** if $f(x_1) < f(x_2)$ whenever $x_1 < x_2$ in $I$, and **decreasing** if $f(x_1) > f(x_2)$ instead.\n\nTwo things are worth saying plainly. First, these are properties **of an interval**, never of a single point: $x^2$ is decreasing on $(-\\infty, 0]$ and increasing on $[0, \\infty)$, and it is neither "at" $x = 0$. Second, reading a graph left to right, increasing means going uphill.\n\nWhere a function stops rising and starts falling is where its largest value sits — which is the question all of optimisation turns out to be.',
                id: 'Pada suatu selang $I$, fungsi disebut **naik** bila $f(x_1) < f(x_2)$ setiap kali $x_1 < x_2$ di $I$, dan **turun** bila justru $f(x_1) > f(x_2)$.\n\nDua hal layak dinyatakan terang-terangan. Pertama, sifat ini melekat **pada selang**, tak pernah pada satu titik: $x^2$ turun pada $(-\\infty, 0]$ dan naik pada $[0, \\infty)$, dan ia bukan keduanya "di" $x = 0$. Kedua, membaca grafik dari kiri ke kanan, naik berarti menanjak.\n\nTempat sebuah fungsi berhenti naik lalu mulai turun adalah tempat nilai terbesarnya berada — dan ternyata itulah pertanyaan yang ditanyakan seluruh persoalan optimasi.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-4, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^3-3*x', color: 'a', label: 'x³ − 3x' },
                  { t: 'dot', x: -1, y: 2, label: 'puncak' },
                  { t: 'dot', x: 1, y: -2, label: 'lembah' },
                ],
                caption: {
                  en: 'Uphill until $x = -1$, downhill from there to $x = 1$, uphill again after. The two marked points are where it turns.',
                  id: 'Menanjak sampai $x = -1$, menurun dari situ sampai $x = 1$, lalu menanjak lagi. Dua titik yang ditandai adalah tempat ia berbalik.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The families you will keep meeting', id: 'Keluarga yang akan terus kamu temui' },
              body: {
                en: '**Linear**: $f(x) = mx + b$. A straight line, slope $m$.\n**Power**: $f(x) = x^a$. Whole $a$ gives parabolas and cubics; $a = -1$ gives $1/x$; $a = \\tfrac{1}{2}$ gives $\\sqrt{x}$.\n**Polynomial**: a sum of whole-number powers, $a_nx^n + \\ldots + a_0$. Defined for every real number, always.\n**Rational**: one polynomial over another, $p(x)/q(x)$. Defined wherever $q(x) \\neq 0$ — which is where domain trouble starts.\n**Algebraic**: anything built from polynomials with $+ - \\times \\div$ and roots.\n\nEverything past that point is called **transcendental**, and this course meets three of them: trigonometric, exponential, and logarithmic. They take up the next four modules.',
                id: '**Linear**: $f(x) = mx + b$. Berupa garis lurus, dengan kemiringan $m$.\n**Pangkat**: $f(x) = x^a$. $a$ bilangan bulat memberi parabola dan kurva pangkat tiga; $a = -1$ memberi $1/x$; $a = \\tfrac{1}{2}$ memberi $\\sqrt{x}$.\n**Polinom**: jumlahan pangkat bilangan bulat, $a_nx^n + \\ldots + a_0$. Selalu terdefinisi untuk setiap bilangan real.\n**Rasional**: satu polinom dibagi polinom lain, $p(x)/q(x)$. Terdefinisi di mana pun $q(x) \\neq 0$ — dan di situlah masalah domain bermula.\n**Aljabar**: apa pun yang dibangun dari polinom dengan $+ - \\times \\div$ dan akar.\n\nSemua yang di luar itu disebut **transenden**, dan kursus ini menemui tiga di antaranya: trigonometri, eksponen, dan logaritma. Ketiganya mengisi empat modul berikutnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'On which interval is $f(x) = (x - 4)^2$ decreasing?',
                id: 'Pada selang mana $f(x) = (x - 4)^2$ turun?',
              },
              options: [
                { en: '$(-\\infty, 4]$', id: '$(-\\infty, 4]$' },
                { en: '$[4, \\infty)$', id: '$[4, \\infty)$' },
                { en: '$(-\\infty, 0]$', id: '$(-\\infty, 0]$' },
                { en: 'Nowhere — a square is never decreasing.', id: 'Tidak di mana pun — kuadrat tak pernah turun.' },
              ],
              answer: 0,
              explain: {
                en: 'It is the parabola $x^2$ moved four to the right, so its turning point is at $x = 4$: downhill before it, uphill after. That "moved four to the right" is the whole of Module 2.',
                id: 'Ia adalah parabola $x^2$ yang digeser empat satuan ke kanan, jadi titik baliknya di $x = 4$: menurun sebelum itu, menanjak sesudahnya. "Digeser empat ke kanan" itulah seluruh isi Modul 2.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = x^2 - 6x + 5$, find where it turns and the value it takes there.',
                id: 'Untuk $f(x) = x^2 - 6x + 5$, tentukan di mana ia berbalik dan nilai yang dicapainya di situ.',
              },
              blanks: [
                { label: 'x =', answer: 3 },
                { label: 'f(x) =', answer: -4 },
              ],
              hints: [
                { en: 'The turning point of $ax^2 + bx + c$ is at $x = -b/(2a)$.', id: 'Titik balik $ax^2 + bx + c$ berada di $x = -b/(2a)$.' },
                { en: '$x = 6/2 = 3$. Now substitute.', id: '$x = 6/2 = 3$. Sekarang substitusikan.' },
              ],
              solution: ['x = \\tfrac{6}{2} = 3', 'f(3) = 9 - 18 + 5 = -4'],
              explain: {
                en: 'So $f$ decreases on $(-\\infty, 3]$ and increases on $[3, \\infty)$, and its range is $[-4, \\infty)$ — three answers from one calculation.',
                id: 'Jadi $f$ turun pada $(-\\infty, 3]$ dan naik pada $[3, \\infty)$, dan range-nya $[-4, \\infty)$ — tiga jawaban dari satu perhitungan.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m1-s2-p',
        runtime: 'math',
        title: { en: 'Reading a Graph', id: 'Membaca Grafik' },
        brief: {
          en: 'A piecewise rule, a symmetry test done with numbers, and a turning point.',
          id: 'Satu aturan sepotong-sepotong, satu uji kesimetrian lewat bilangan, dan satu titik balik.',
        },
        requirements: [
          { en: 'For the piecewise part, choose the line before you calculate.', id: 'Untuk butir sepotong-sepotong, pilih barisnya sebelum menghitung.' },
          { en: 'Give the turning point as a coordinate, one box each.', id: 'Nyatakan titik baliknya sebagai koordinat, satu kotak masing-masing.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Let $g(x) = 2x + 1$ for $x \\leq 0$ and $g(x) = |x - 3|$ for $x > 0$. Evaluate $g(-2)$, $g(1)$ and $g(5)$.',
              id: 'Misalkan $g(x) = 2x + 1$ untuk $x \\leq 0$ dan $g(x) = |x - 3|$ untuk $x > 0$. Hitung $g(-2)$, $g(1)$, dan $g(5)$.',
            },
            inline: true,
            blanks: [{ answer: -3 }, { answer: 2 }, { answer: 2 }],
            solution: [
              'g(-2) = 2(-2) + 1 = -3',
              'g(1) = |1 - 3| = 2',
              'g(5) = |5 - 3| = 2',
            ],
          },
          {
            prompt: {
              en: 'For $p(x) = x^4 + x^2$, compute $p(3)$ and $p(-3)$. Equal values would say it is even.',
              id: 'Untuk $p(x) = x^4 + x^2$, hitung $p(3)$ dan $p(-3)$. Nilai yang sama menandakan ia genap.',
            },
            blanks: [
              { label: 'p(3) =', answer: 90 },
              { label: 'p(-3) =', answer: 90 },
            ],
            solution: ['p(3) = 81 + 9 = 90', 'p(-3) = 81 + 9 = 90 = p(3) \\quad \\checkmark'],
          },
          {
            prompt: {
              en: 'Find the turning point of $f(x) = 2x^2 + 8x + 3$.',
              id: 'Tentukan titik balik dari $f(x) = 2x^2 + 8x + 3$.',
            },
            inline: true,
            blanks: [{ answer: -2 }, { answer: -5 }],
            solution: ['x = \\tfrac{-8}{2(2)} = -2', 'f(-2) = 8 - 16 + 3 = -5'],
          },
        ],
        hints: [
          {
            en: 'Two equal values do not *prove* a function is even — but they are what you would check first, and $x^4 + x^2$ has only even powers.',
            id: 'Dua nilai yang sama belum *membuktikan* sebuah fungsi genap — tetapi itulah yang pertama kali kamu periksa, dan $x^4 + x^2$ hanya berpangkat genap.',
          },
          {
            en: 'In part 3 the leading coefficient is 2, so remember the $2a$ in $-b/(2a)$.',
            id: 'Pada butir 3 koefisien utamanya 2, jadi jangan lupa $2a$ pada $-b/(2a)$.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
