import type { Module } from '../types'

/** Module 2 — building new functions out of old ones, algebraically and
 *  geometrically. The two halves are the same idea twice: what happens to the
 *  formula, and what that does to the picture. The sliders are the point of
 *  the second half — a shift is something you have to watch happen. */
export const module2: Module = {
  id: 'fun-m2',
  title: { en: 'Combining Functions; Shifting and Scaling Graphs', id: 'Menggabungkan Fungsi; Menggeser dan Menskala Grafik' },
  summary: {
    en: 'Add, multiply and compose functions, then move, stretch and flip their graphs on purpose.',
    id: 'Menjumlah, mengalikan, dan mengomposisikan fungsi, lalu menggeser, meregangkan, dan membalik grafiknya dengan sengaja.',
  },
  submodules: [
    /* ------------------------------------------ 2.1 algebra and composition */
    {
      id: 'fun-m2-s1',
      title: { en: 'Algebra and Composition', id: 'Aljabar dan Komposisi' },
      summary: {
        en: 'Combine two functions with arithmetic, then feed one into the other.',
        id: 'Menggabungkan dua fungsi dengan operasi hitung, lalu memasukkan yang satu ke dalam yang lain.',
      },
      lessons: [
        {
          id: 'fun-m2-s1-l1',
          title: { en: 'Sums, Products and Quotients', id: 'Jumlah, Hasil Kali, dan Hasil Bagi' },
          goal: {
            en: 'Combine two functions with $+ - \\times \\div$ and say where the result is defined.',
            id: 'Menggabungkan dua fungsi dengan $+ - \\times \\div$ dan menyebut di mana hasilnya terdefinisi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Combine the outputs, not the rules', id: 'Gabungkan keluarannya, bukan aturannya' },
              body: {
                en: 'Given two functions $f$ and $g$, four new ones come for free:\n$$(f + g)(x) = f(x) + g(x), \\qquad (f - g)(x) = f(x) - g(x)$$\n$$(fg)(x) = f(x)\\,g(x), \\qquad \\left(\\frac{f}{g}\\right)(x) = \\frac{f(x)}{g(x)}$$\nEach is defined by evaluating both functions at the same $x$ and then combining the two **numbers**. Nothing clever happens to the formulas.\n\nThe domain is where both were already defined — the intersection of the two domains. The quotient loses one more thing: every $x$ with $g(x) = 0$, because you still may not divide by zero.',
                id: 'Diberikan dua fungsi $f$ dan $g$, empat fungsi baru muncul dengan sendirinya:\n$$(f + g)(x) = f(x) + g(x), \\qquad (f - g)(x) = f(x) - g(x)$$\n$$(fg)(x) = f(x)\\,g(x), \\qquad \\left(\\frac{f}{g}\\right)(x) = \\frac{f(x)}{g(x)}$$\nMasing-masing didefinisikan dengan menghitung kedua fungsi pada $x$ yang sama lalu menggabungkan kedua **bilangannya**. Tak ada yang istimewa terjadi pada rumusnya.\n\nDomainnya adalah tempat keduanya sudah terdefinisi — irisan kedua domain. Hasil baginya kehilangan satu hal lagi: setiap $x$ dengan $g(x) = 0$, sebab membagi dengan nol tetap tidak boleh.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Where the sum lives', id: 'Di mana jumlahnya hidup' },
              body: {
                en: 'Take $f(x) = \\sqrt{x}$ with domain $[0, \\infty)$ and $g(x) = \\sqrt{1 - x}$ with domain $(-\\infty, 1]$. Then\n$$(f + g)(x) = \\sqrt{x} + \\sqrt{1-x}$$\nis defined only where **both** are, which is $[0, 1]$ — an interval much smaller than either. Adding two functions can shrink the domain dramatically, and the formula does not warn you: $\\sqrt{x} + \\sqrt{1-x}$ looks perfectly happy at $x = 5$ until you try it.',
                id: 'Ambil $f(x) = \\sqrt{x}$ dengan domain $[0, \\infty)$ dan $g(x) = \\sqrt{1 - x}$ dengan domain $(-\\infty, 1]$. Maka\n$$(f + g)(x) = \\sqrt{x} + \\sqrt{1-x}$$\nhanya terdefinisi di tempat **keduanya** terdefinisi, yaitu $[0, 1]$ — selang yang jauh lebih kecil daripada masing-masingnya. Menjumlahkan dua fungsi bisa mengecilkan domain secara drastis, dan rumusnya tidak memperingatkanmu: $\\sqrt{x} + \\sqrt{1-x}$ tampak baik-baik saja di $x = 5$ sampai kamu benar-benar mencobanya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 2],
                ySpan: [-0.5, 2],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x)', from: 0, color: 'a', label: '√x' },
                  { t: 'curve', f: 'sqrt(1-x)', to: 1, color: 'b', label: '√(1−x)' },
                  { t: 'curve', f: 'sqrt(x)+sqrt(1-x)', from: 0, to: 1, color: 'result', label: 'jumlahnya' },
                ],
                caption: {
                  en: 'Each root runs off in its own direction; their sum exists only on the stretch where both are drawn, from 0 to 1.',
                  id: 'Masing-masing akar berlari ke arahnya sendiri; jumlahnya hanya ada pada bentangan tempat keduanya tergambar, dari 0 sampai 1.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With $f(x) = x^2 - 1$ and $g(x) = x + 2$, what must be removed from the domain of $f/g$?',
                id: 'Dengan $f(x) = x^2 - 1$ dan $g(x) = x + 2$, apa yang harus dibuang dari domain $f/g$?',
              },
              options: [
                { en: 'Nothing — both are polynomials.', id: 'Tidak ada — keduanya polinom.' },
                { en: '$x = -2$', id: '$x = -2$' },
                { en: '$x = 1$ and $x = -1$', id: '$x = 1$ dan $x = -1$' },
                { en: '$x = 2$', id: '$x = 2$' },
              ],
              answer: 1,
              explain: {
                en: 'The denominator $g$ is zero at $x = -2$. The zeros of $f$ at $\\pm 1$ are harmless — a quotient is allowed to be zero, just not undefined.',
                id: 'Penyebutnya $g$ bernilai nol di $x = -2$. Akar-akar $f$ di $\\pm 1$ tidak berbahaya — hasil bagi boleh bernilai nol, yang tidak boleh adalah tak terdefinisi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $f(x) = x^2 - 1$ and $g(x) = x + 2$, evaluate each combination.',
                id: 'Dengan $f(x) = x^2 - 1$ dan $g(x) = x + 2$, hitung tiap gabungannya.',
              },
              blanks: [
                { label: '(f + g)(3) =', answer: 13 },
                { label: '(fg)(2) =', answer: 12 },
                { label: '(f/g)(1) =', answer: 0 },
              ],
              hints: [
                { en: 'Evaluate each function separately first, then combine the two numbers.', id: 'Hitung tiap fungsinya sendiri-sendiri dulu, baru gabungkan kedua bilangannya.' },
                { en: '$f(3) = 8$ and $g(3) = 5$.', id: '$f(3) = 8$ dan $g(3) = 5$.' },
              ],
              solution: [
                '(f+g)(3) = 8 + 5 = 13',
                '(fg)(2) = 3 \\cdot 4 = 12',
                '(f/g)(1) = \\tfrac{0}{3} = 0',
              ],
              explain: {
                en: 'The last one is zero because the numerator is, and that is a perfectly ordinary value. Only a zero **denominator** is trouble.',
                id: 'Yang terakhir bernilai nol karena pembilangnya nol, dan itu nilai yang biasa saja. Yang bermasalah hanyalah **penyebut** yang nol.',
              },
            },
          ],
        },
        {
          id: 'fun-m2-s1-l2',
          title: { en: 'Composition', id: 'Komposisi' },
          goal: {
            en: 'Feed one function into another, and see why the order changes the answer.',
            id: 'Memasukkan satu fungsi ke dalam fungsi lain, dan melihat mengapa urutannya mengubah jawaban.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Output into input', id: 'Keluaran menjadi masukan' },
              body: {
                en: 'The **composite** of $f$ with $g$ is\n$$(f \\circ g)(x) = f(g(x))$$\nread "$f$ after $g$" — because $g$ acts first. Apply $g$ to $x$, then hand the answer to $f$.\n\nWith $f(x) = \\sqrt{x}$ and $g(x) = x + 1$:\n$$(f \\circ g)(3) = f(g(3)) = f(4) = 2$$\nWork from the inside out, exactly as the brackets tell you to. The commonest mistake is doing $f$ first because it is written first.',
                id: '**Komposisi** $f$ dengan $g$ adalah\n$$(f \\circ g)(x) = f(g(x))$$\ndibaca "$f$ setelah $g$" — karena $g$ yang bekerja lebih dulu. Kenakan $g$ pada $x$, lalu serahkan hasilnya kepada $f$.\n\nDengan $f(x) = \\sqrt{x}$ dan $g(x) = x + 1$:\n$$(f \\circ g)(3) = f(g(3)) = f(4) = 2$$\nKerjakan dari dalam ke luar, persis seperti yang diperintahkan kurungnya. Kesalahan yang paling lazim adalah mengerjakan $f$ lebih dulu karena ia ditulis lebih dulu.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Order matters, almost always', id: 'Urutan berpengaruh, hampir selalu' },
              body: {
                en: 'Composition is **not** commutative. With the same two functions,\n$$(f \\circ g)(x) = \\sqrt{x + 1} \\qquad \\text{tetapi} \\qquad (g \\circ f)(x) = \\sqrt{x} + 1$$\nOne adds inside the root, the other outside, and they are different functions with different domains — the first is defined from $-1$ up, the second only from $0$.\n\nSo $f \\circ g$ and $g \\circ f$ are two different questions, and which one you were asked matters.',
                id: 'Komposisi **tidak** bersifat komutatif. Dengan dua fungsi yang sama,\n$$(f \\circ g)(x) = \\sqrt{x + 1} \\qquad \\text{tetapi} \\qquad (g \\circ f)(x) = \\sqrt{x} + 1$$\nYang satu menambah di dalam akar, yang lain di luarnya, dan keduanya fungsi berbeda dengan domain berbeda — yang pertama terdefinisi mulai dari $-1$, yang kedua baru dari $0$.\n\nJadi $f \\circ g$ dan $g \\circ f$ adalah dua pertanyaan yang berbeda, dan yang mana yang ditanyakan itu penting.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 6],
                ySpan: [-1, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x+1)', from: -1, color: 'a', label: '√(x+1)' },
                  { t: 'curve', f: 'sqrt(x)+1', from: 0, color: 'b', label: '√x + 1' },
                ],
                caption: {
                  en: 'Same two functions, opposite order. One starts at $x = -1$ on the axis; the other starts at $x = 0$, one unit up.',
                  id: 'Dua fungsi yang sama, urutan terbalik. Yang satu mulai di $x = -1$ pada sumbu; yang lain mulai di $x = 0$, satu satuan di atasnya.',
                },
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $(g \\circ f)(9)$ with $f(x) = \\sqrt{x}$ and $g(x) = x + 1$.',
                id: 'Susun langkah untuk $(g \\circ f)(9)$ dengan $f(x) = \\sqrt{x}$ dan $g(x) = x + 1$.',
              },
              lines: [
                '(g \\circ f)(9) = g(f(9))',
                'f(9) = \\sqrt{9} = 3',
                '= g(3)',
                '= 3 + 1 = 4',
              ],
              explain: {
                en: 'Inside first: $f$ turns 9 into 3, and only then does $g$ add one. Adding first would have given $g(9) = 10$ and then $\\sqrt{10}$ — a different question entirely.',
                id: 'Yang di dalam dulu: $f$ mengubah 9 menjadi 3, dan barulah $g$ menambah satu. Menambah lebih dulu akan memberi $g(9) = 10$ lalu $\\sqrt{10}$ — pertanyaan yang sama sekali berbeda.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $f(x) = \\sqrt{x}$ and $g(x) = x + 1$, evaluate each composite.',
                id: 'Dengan $f(x) = \\sqrt{x}$ dan $g(x) = x + 1$, hitung tiap komposisinya.',
              },
              blanks: [
                { label: '(f \\circ g)(3) =', answer: 2 },
                { label: '(g \\circ f)(9) =', answer: 4 },
                { label: '(f \\circ f)(16) =', answer: 2 },
                { label: '(f \\circ g)(x) =', formula: 'sqrt(x+1)', domain: [0, 6] },
              ],
              hints: [
                { en: 'Always the inner one first.', id: 'Selalu yang di dalam dulu.' },
                { en: 'The third composes $f$ with itself: $\\sqrt{\\sqrt{16}}$.', id: 'Yang ketiga mengomposisikan $f$ dengan dirinya sendiri: $\\sqrt{\\sqrt{16}}$.' },
                {
                  en: 'The last box wants a formula, not a number: put $g(x)$ inside $f$ and leave the $x$ where it is.',
                  id: 'Kotak terakhir meminta rumus, bukan bilangan: masukkan $g(x)$ ke dalam $f$ dan biarkan $x$-nya tetap di tempatnya.',
                },
              ],
              solution: [
                '(f \\circ g)(3) = f(4) = 2',
                '(g \\circ f)(9) = g(3) = 4',
                '(f \\circ f)(16) = f(4) = 2',
                '(f \\circ g)(x) = f(x+1) = \\sqrt{x+1}',
              ],
              explain: {
                en: 'A function may be composed with itself, and $\\sqrt{\\sqrt{16}} = \\sqrt{4} = 2$. Nothing in the definition says the two functions have to be different.',
                id: 'Sebuah fungsi boleh dikomposisikan dengan dirinya sendiri, dan $\\sqrt{\\sqrt{16}} = \\sqrt{4} = 2$. Tak ada dalam definisinya yang mengharuskan kedua fungsinya berbeda.',
              },
            },
          ],
        },
        {
          id: 'fun-m2-s1-l3',
          title: { en: 'The Domain of a Composite, and Taking One Apart', id: 'Domain Komposisi, dan Menguraikannya' },
          goal: {
            en: 'Find where a composite is defined, and split a complicated formula into an inner and an outer function.',
            id: 'Menentukan di mana komposisi terdefinisi, dan memecah rumus rumit menjadi fungsi dalam dan fungsi luar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two conditions, not one', id: 'Dua syarat, bukan satu' },
              body: {
                en: 'For $f(g(x))$ to make sense, two things must hold: $x$ has to be in the domain of $g$, **and** $g(x)$ has to be in the domain of $f$.\n\nWith $f(x) = \\sqrt{x}$ and $g(x) = x - 3$: $g$ accepts everything, but $f$ needs a non-negative input, so we need $x - 3 \\geq 0$, that is $x \\geq 3$.\n\nSimplifying first is what goes wrong here. $(\\sqrt{x})^2$ tidies to $x$, which looks defined everywhere — but the composite still needs $x \\geq 0$, because the inner square root had to happen. Find the domain before you simplify, never after.',
                id: 'Agar $f(g(x))$ bermakna, dua hal harus berlaku: $x$ harus berada di domain $g$, **dan** $g(x)$ harus berada di domain $f$.\n\nDengan $f(x) = \\sqrt{x}$ dan $g(x) = x - 3$: $g$ menerima apa saja, tetapi $f$ memerlukan masukan tak negatif, jadi diperlukan $x - 3 \\geq 0$, yaitu $x \\geq 3$.\n\nMenyederhanakan lebih dulu adalah tempat kekeliruan terjadi. $(\\sqrt{x})^2$ menjadi rapi sebagai $x$, yang tampak terdefinisi di mana-mana — tetapi komposisinya tetap memerlukan $x \\geq 0$, sebab akar di dalamnya tetap harus terjadi. Tentukan domainnya sebelum menyederhanakan, jangan sesudahnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Taking a formula apart', id: 'Menguraikan sebuah rumus' },
              body: {
                en: 'Calculus asks the reverse question constantly: given $h$, find $f$ and $g$ with $h = f \\circ g$. The recipe is to ask **what would you compute first with a calculator**. That is $g$; everything done to the result is $f$.\n\nFor $h(x) = (2x + 1)^5$ you would work out $2x + 1$ first, so\n$$g(x) = 2x + 1, \\qquad f(u) = u^5$$\nFor $h(x) = \\sqrt{x^2 + 9}$, the inner is $x^2 + 9$ and the outer is the square root.\n\nThe split is not unique — you could always take $g(x) = x$ — but the useful one is the one that makes both halves simple.',
                id: 'Kalkulus terus-menerus menanyakan hal sebaliknya: diberikan $h$, carilah $f$ dan $g$ dengan $h = f \\circ g$. Caranya adalah bertanya **apa yang akan kamu hitung lebih dulu dengan kalkulator**. Itulah $g$; segala yang dikenakan pada hasilnya adalah $f$.\n\nUntuk $h(x) = (2x + 1)^5$ kamu akan menghitung $2x + 1$ lebih dulu, jadi\n$$g(x) = 2x + 1, \\qquad f(u) = u^5$$\nUntuk $h(x) = \\sqrt{x^2 + 9}$, yang di dalam adalah $x^2 + 9$ dan yang di luar adalah akar kuadratnya.\n\nPemecahannya tidak tunggal — kamu selalu bisa mengambil $g(x) = x$ — tetapi yang berguna adalah yang membuat kedua bagiannya sederhana.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For $h(x) = \\dfrac{1}{x^2 + 4}$, which split into $f \\circ g$ is the useful one?',
                id: 'Untuk $h(x) = \\dfrac{1}{x^2 + 4}$, pemecahan $f \\circ g$ manakah yang berguna?',
              },
              options: [
                { en: '$g(x) = x^2 + 4$, $f(u) = 1/u$', id: '$g(x) = x^2 + 4$, $f(u) = 1/u$' },
                { en: '$g(x) = 1/x$, $f(u) = u^2 + 4$', id: '$g(x) = 1/x$, $f(u) = u^2 + 4$' },
                { en: '$g(x) = x^2$, $f(u) = u + 4$', id: '$g(x) = x^2$, $f(u) = u + 4$' },
                { en: '$g(x) = x$, $f(u) = h(u)$', id: '$g(x) = x$, $f(u) = h(u)$' },
              ],
              answer: 0,
              explain: {
                en: 'On a calculator you would key in $x^2 + 4$ and then press the reciprocal. The last option is technically correct and completely useless — it has not taken anything apart.',
                id: 'Di kalkulator kamu akan mengetik $x^2 + 4$ lalu menekan tombol kebalikan. Pilihan terakhir secara teknis benar dan sama sekali tak berguna — ia belum menguraikan apa pun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = \\sqrt{x}$ and $g(x) = x - 3$. Answer both.',
                id: 'Misalkan $f(x) = \\sqrt{x}$ dan $g(x) = x - 3$. Jawab keduanya.',
              },
              blanks: [
                { label: '(f \\circ g)(x) =', formula: 'sqrt(x-3)', domain: [3.5, 9] },
                { label: '\\text{domain } f \\circ g \\text{ mulai di } x =', answer: 3 },
                { label: '(f \\circ g)(12) =', answer: 3 },
              ],
              hints: [
                { en: 'The inner value must be at least zero: $x - 3 \\geq 0$.', id: 'Nilai di dalamnya harus paling sedikit nol: $x - 3 \\geq 0$.' },
                {
                  en: 'Write the composite first and the other two read off it.',
                  id: 'Tulis komposisinya dulu, lalu dua sisanya bisa dibaca darinya.',
                },
              ],
              solution: [
                '(f \\circ g)(x) = f(x-3) = \\sqrt{x-3}',
                'x - 3 \\geq 0 \\Rightarrow x \\geq 3',
                '(f \\circ g)(12) = f(9) = 3',
              ],
              explain: {
                en: 'The composite is $\\sqrt{x-3}$ — the familiar square root graph, moved three to the right, which is exactly what the next submodule is about.',
                id: 'Komposisinya adalah $\\sqrt{x-3}$ — grafik akar yang sudah dikenal, digeser tiga satuan ke kanan, dan itulah persis isi submateri berikutnya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m2-s1-p',
        runtime: 'math',
        title: { en: 'Combining Two Functions', id: 'Menggabungkan Dua Fungsi' },
        brief: {
          en: 'Arithmetic on functions, both composites, and the domain the composition leaves behind.',
          id: 'Operasi hitung pada fungsi, kedua komposisinya, dan domain yang tersisa dari komposisi itu.',
        },
        requirements: [
          { en: 'Evaluate the inner function before the outer one, every time.', id: 'Hitung fungsi dalam sebelum fungsi luar, setiap kali.' },
          { en: 'Do not simplify before you have found the domain.', id: 'Jangan menyederhanakan sebelum domainnya ditemukan.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'With $f(x) = 3x - 4$ and $g(x) = x^2$, evaluate $(f + g)(2)$ and $(fg)(-1)$.',
              id: 'Dengan $f(x) = 3x - 4$ dan $g(x) = x^2$, hitung $(f + g)(2)$ dan $(fg)(-1)$.',
            },
            blanks: [
              { label: '(f+g)(2) =', answer: 6 },
              { label: '(fg)(-1) =', answer: -7 },
            ],
            solution: ['(f+g)(2) = 2 + 4 = 6', '(fg)(-1) = (-7)(1) = -7'],
          },
          {
            prompt: {
              en: 'Same two functions. Evaluate both composites at $x = 2$ and see that they differ.',
              id: 'Dua fungsi yang sama. Hitung kedua komposisinya pada $x = 2$ dan lihat keduanya berbeda.',
            },
            blanks: [
              { label: '(f \\circ g)(2) =', answer: 8 },
              { label: '(g \\circ f)(2) =', answer: 4 },
            ],
            solution: [
              '(f \\circ g)(2) = f(4) = 12 - 4 = 8',
              '(g \\circ f)(2) = g(2) = 2^2 = 4',
            ],
          },
          {
            prompt: {
              en: 'With $f(x) = \\sqrt{x}$ and $g(x) = 5 - x$, the domain of $f \\circ g$ ends at one number. Find it, and evaluate the composite at $x = 1$.',
              id: 'Dengan $f(x) = \\sqrt{x}$ dan $g(x) = 5 - x$, domain $f \\circ g$ berakhir di suatu bilangan. Tentukan bilangan itu, lalu hitung komposisinya pada $x = 1$.',
            },
            blanks: [
              { label: 'x \\leq', answer: 5 },
              { label: '(f \\circ g)(1) =', answer: 2 },
            ],
            solution: [
              '5 - x \\geq 0 \\Rightarrow x \\leq 5',
              '(f \\circ g)(1) = f(4) = 2',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 2, $f(2) = 2$ — which makes $(g \\circ f)(2) = g(2)$, a coincidence worth noticing but not relying on.',
            id: 'Pada butir 2, $f(2) = 2$ — sehingga $(g \\circ f)(2) = g(2)$, kebetulan yang layak diperhatikan tetapi jangan diandalkan.',
          },
          {
            en: 'In part 3 the inequality flips when you move $x$ across: $5 - x \\geq 0$ means $x \\leq 5$, not $x \\geq 5$.',
            id: 'Pada butir 3 tanda ketaksamaannya berbalik saat $x$ dipindahkan: $5 - x \\geq 0$ berarti $x \\leq 5$, bukan $x \\geq 5$.',
          },
        ],
        xp: 50,
      },
    },

    /* ----------------------------------------------- 2.2 transforming graphs */
    {
      id: 'fun-m2-s2',
      title: { en: 'Shifting and Scaling Graphs', id: 'Menggeser dan Menskala Grafik' },
      summary: {
        en: 'Move, stretch and flip a graph by changing its formula, and know which change does what.',
        id: 'Menggeser, meregangkan, dan membalik grafik dengan mengubah rumusnya, serta tahu perubahan mana melakukan apa.',
      },
      lessons: [
        {
          id: 'fun-m2-s2-l1',
          title: { en: 'Shifting', id: 'Menggeser' },
          goal: {
            en: 'Move a graph up, down, left or right, and predict which way from the formula.',
            id: 'Menggeser grafik ke atas, bawah, kiri, atau kanan, dan menebak arahnya dari rumusnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Outside moves it up, inside moves it sideways', id: 'Di luar menggeser tegak, di dalam menggeser mendatar' },
              body: {
                en: 'Two rules, and only two:\n$$y = f(x) + k \\quad \\text{menggeser tegak sejauh } k$$\n$$y = f(x - h) \\quad \\text{menggeser mendatar sejauh } h$$\nA change **outside** the function moves the graph vertically, by exactly what you added. A change **inside** moves it horizontally — and the direction is the one you do not expect.\n\n$f(x - 3)$ moves the graph **three to the right**, even though the formula says minus. The reason is worth holding on to: the new graph does at $x = 3$ whatever the old one did at $x = 0$, so every feature has moved to a larger $x$.',
                id: 'Dua aturan, dan hanya dua:\n$$y = f(x) + k \\quad \\text{menggeser tegak sejauh } k$$\n$$y = f(x - h) \\quad \\text{menggeser mendatar sejauh } h$$\nPerubahan **di luar** fungsi menggeser grafik secara tegak, sejauh persis yang kamu tambahkan. Perubahan **di dalam** menggesernya secara mendatar — dan arahnya justru bukan yang kamu duga.\n\n$f(x - 3)$ menggeser grafik **tiga satuan ke kanan**, meskipun rumusnya bertanda minus. Alasannya layak dipegang: grafik baru melakukan di $x = 3$ apa pun yang dilakukan grafik lama di $x = 0$, jadi setiap cirinya berpindah ke $x$ yang lebih besar.',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-4, 8],
                ticks: true,
                params: [
                  { name: 'h', min: -4, max: 4, step: 0.5, value: 0 },
                  { name: 'k', min: -3, max: 5, step: 0.5, value: 0 },
                ],
                items: [
                  { t: 'curve', f: 'x^2', color: 'muted', dashed: true, label: 'x²' },
                  { t: 'curve', f: '(x-h)^2+k', color: 'a', label: '(x−h)² + k' },
                  { t: 'dot', x: 'h', y: 'k', label: 'puncak' },
                ],
                caption: {
                  en: 'Move $h$ and watch the vertex travel the **same** way as the number, even though the formula subtracts it. Move $k$ and the whole curve rises by exactly $k$.',
                  id: 'Geser $h$ dan perhatikan puncaknya berjalan ke arah yang **sama** dengan bilangannya, meski rumusnya mengurangkan. Geser $k$ dan seluruh kurvanya naik tepat sejauh $k$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where is the vertex of $y = (x + 2)^2 - 5$?',
                id: 'Di mana puncak dari $y = (x + 2)^2 - 5$?',
              },
              options: [
                { en: '$(2, -5)$', id: '$(2, -5)$' },
                { en: '$(-2, -5)$', id: '$(-2, -5)$' },
                { en: '$(-2, 5)$', id: '$(-2, 5)$' },
                { en: '$(2, 5)$', id: '$(2, 5)$' },
              ],
              answer: 1,
              explain: {
                en: 'Write it as $(x - (-2))^2 + (-5)$: the inside says $h = -2$, so two to the **left**, and the outside says down five. The vertical number keeps its sign; the horizontal one flips.',
                id: 'Tulis sebagai $(x - (-2))^2 + (-5)$: bagian dalam memberi $h = -2$, jadi dua satuan ke **kiri**, dan bagian luar memberi turun lima. Bilangan tegaknya mempertahankan tanda; bilangan mendatarnya berbalik.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'The graph of $y = \\sqrt{x}$ is moved 4 right and 1 down. Complete the new formula.',
                id: 'Grafik $y = \\sqrt{x}$ digeser 4 satuan ke kanan dan 1 satuan ke bawah. Lengkapi rumus barunya.',
              },
              template: 'y = \\sqrt{x - ___} - ___',
              blanks: ['4', '1'],
              explain: {
                en: 'Right by 4 puts $-4$ inside; down by 1 puts $-1$ outside. The new graph starts at the point $(4, -1)$.',
                id: 'Ke kanan 4 menaruh $-4$ di dalam; ke bawah 1 menaruh $-1$ di luar. Grafik barunya bermula di titik $(4, -1)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The graph of $y = |x|$ is moved so its corner sits at $(3, -2)$. Give the numbers in $y = |x - h| + k$, then the value at $x = 7$.',
                id: 'Grafik $y = |x|$ digeser sehingga sudutnya berada di $(3, -2)$. Sebutkan bilangan pada $y = |x - h| + k$, lalu nilainya pada $x = 7$.',
              },
              blanks: [
                { label: 'h =', answer: 3 },
                { label: 'k =', answer: -2 },
                { label: 'y(7) =', answer: 2 },
              ],
              hints: [
                { en: 'The corner of $|x|$ starts at the origin, so $h$ and $k$ are just the coordinates it moved to.', id: 'Sudut $|x|$ semula di titik asal, jadi $h$ dan $k$ tak lain koordinat tempat ia berpindah.' },
                { en: '$|7 - 3| - 2 = 4 - 2$.', id: '$|7 - 3| - 2 = 4 - 2$.' },
              ],
              solution: ['y = |x - 3| - 2', 'y(7) = |4| - 2 = 2'],
              explain: {
                en: 'For any function whose graph has one obvious feature — a vertex, a corner, a starting point — the shift is read straight off where that feature ended up.',
                id: 'Untuk fungsi mana pun yang grafiknya punya satu ciri mencolok — puncak, sudut, titik awal — pergeserannya dibaca langsung dari tempat ciri itu berakhir.',
              },
            },
          ],
        },
        {
          id: 'fun-m2-s2-l2',
          title: { en: 'Scaling and Reflecting', id: 'Menskala dan Mencerminkan' },
          goal: {
            en: 'Stretch, squash and flip a graph, and tell a vertical change from a horizontal one.',
            id: 'Meregangkan, memampatkan, dan membalik grafik, serta membedakan perubahan tegak dari mendatar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Multiply outside, multiply inside', id: 'Kalikan di luar, kalikan di dalam' },
              body: {
                en: 'Where adding shifted, multiplying scales:\n$$y = a\\,f(x) \\quad \\text{meregang tegak dengan faktor } a$$\n$$y = f(bx) \\quad \\text{memampat mendatar dengan faktor } b$$\nThe vertical one behaves: $a = 3$ makes everything three times as tall. The horizontal one is again upside down — $b = 3$ makes the graph three times **narrower**, not wider, because $x$ only has to travel a third as far to make the inside reach the same value.\n\nA negative sign is a reflection. $y = -f(x)$ flips the graph across the $x$-axis (up becomes down); $y = f(-x)$ flips it across the $y$-axis (left becomes right).',
                id: 'Bila penambahan menggeser, perkalian menskala:\n$$y = a\\,f(x) \\quad \\text{meregang tegak dengan faktor } a$$\n$$y = f(bx) \\quad \\text{memampat mendatar dengan faktor } b$$\nYang tegak berperilaku wajar: $a = 3$ membuat semuanya tiga kali lebih tinggi. Yang mendatar sekali lagi terbalik — $b = 3$ membuat grafiknya tiga kali lebih **sempit**, bukan lebih lebar, sebab $x$ hanya perlu menempuh sepertiga jarak agar bagian dalamnya mencapai nilai yang sama.\n\nTanda negatif berarti pencerminan. $y = -f(x)$ membalik grafik terhadap sumbu $x$ (atas menjadi bawah); $y = f(-x)$ membalikkannya terhadap sumbu $y$ (kiri menjadi kanan).',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-6, 6],
                ticks: true,
                params: [{ name: 'a', min: -3, max: 3, step: 0.25, value: 1 }],
                items: [
                  { t: 'curve', f: 'x^2', color: 'muted', dashed: true, label: 'x²' },
                  { t: 'curve', f: 'a*x^2', color: 'a', label: 'a·x²' },
                ],
                caption: {
                  en: 'Push $a$ above 1 and the parabola narrows; between 0 and 1 it flattens; below zero it turns over. At $a = 0$ it collapses onto the axis, which is what multiplying everything by nothing does.',
                  id: 'Dorong $a$ di atas 1 dan parabolanya menyempit; antara 0 dan 1 ia memipih; di bawah nol ia terbalik. Pada $a = 0$ ia runtuh ke sumbunya, sebagaimana mestinya bila segalanya dikalikan nol.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The graph of $y = f(x)$ is reflected across the $y$-axis. What is the new formula?',
                id: 'Grafik $y = f(x)$ dicerminkan terhadap sumbu $y$. Apa rumus barunya?',
              },
              options: [
                { en: '$y = -f(x)$', id: '$y = -f(x)$' },
                { en: '$y = f(-x)$', id: '$y = f(-x)$' },
                { en: '$y = -f(-x)$', id: '$y = -f(-x)$' },
                { en: '$y = 1/f(x)$', id: '$y = 1/f(x)$' },
              ],
              answer: 1,
              explain: {
                en: 'Reflecting left-to-right is a horizontal change, so it happens **inside**. The minus outside would flip it top-to-bottom instead. Note that an even function is unchanged by $f(-x)$ — that is precisely what even means.',
                id: 'Mencerminkan kiri-kanan adalah perubahan mendatar, jadi ia terjadi **di dalam**. Minus di luar justru membaliknya atas-bawah. Perhatikan bahwa fungsi genap tidak berubah oleh $f(-x)$ — dan itu persis makna genap.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = x^2 - 4$. Evaluate the two reflections at $x = 3$.',
                id: 'Misalkan $f(x) = x^2 - 4$. Hitung kedua pencerminannya pada $x = 3$.',
              },
              blanks: [
                { label: '-f(3) =', answer: -5 },
                { label: 'f(-3) =', answer: 5 },
                { label: '2f(3) =', answer: 10 },
              ],
              hints: [
                { en: '$f(3) = 5$. Now apply each change to that.', id: '$f(3) = 5$. Sekarang kenakan tiap perubahan padanya.' },
                { en: '$f(-3)$ means substituting $-3$, not negating the answer.', id: '$f(-3)$ berarti menyubstitusikan $-3$, bukan menegatifkan jawabannya.' },
              ],
              solution: ['f(3) = 9 - 4 = 5', '-f(3) = -5', 'f(-3) = 9 - 4 = 5', '2f(3) = 10'],
              explain: {
                en: '$f(-3) = f(3)$ here because $x^2 - 4$ is even — the $y$-axis reflection leaves it alone. The $x$-axis reflection does not.',
                id: '$f(-3) = f(3)$ di sini karena $x^2 - 4$ genap — pencerminan terhadap sumbu $y$ membiarkannya utuh. Pencerminan terhadap sumbu $x$ tidak.',
              },
            },
          ],
        },
        {
          id: 'fun-m2-s2-l3',
          title: { en: 'Putting Transformations Together', id: 'Menggabungkan Transformasi' },
          goal: {
            en: 'Read a formula with several changes at once, and apply them in the right order.',
            id: 'Membaca rumus dengan beberapa perubahan sekaligus, dan menerapkannya dalam urutan yang benar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Inside first, outside after', id: 'Yang di dalam dulu, yang di luar kemudian' },
              body: {
                en: 'The general shape is\n$$y = a\\,f\\big(b(x - h)\\big) + k$$\nand the order that works is the order the arithmetic happens in. Reading a value: you shift $x$ by $h$, scale by $b$, apply $f$, scale by $a$, shift by $k$. Drawing the graph: do the **inside** changes first (horizontal), then the **outside** ones (vertical).\n\nOrder matters when both a scaling and a shift act on the same side. $2f(x) + 3$ stretches then lifts; $2(f(x) + 3)$ lifts then stretches, and the lift gets doubled too. The brackets are the whole difference.\n\nThe safe habit is to factor the inside so it reads $b(x - h)$: $f(2x - 6)$ is not "left 6", it is $f(2(x-3))$ — squash by 2, then right by 3.',
                id: 'Bentuk umumnya adalah\n$$y = a\\,f\\big(b(x - h)\\big) + k$$\ndan urutan yang berlaku adalah urutan terjadinya operasi hitungnya. Saat menghitung nilai: geser $x$ sejauh $h$, skalakan dengan $b$, kenakan $f$, skalakan dengan $a$, geser sejauh $k$. Saat menggambar grafik: kerjakan perubahan **di dalam** dulu (mendatar), baru yang **di luar** (tegak).\n\nUrutan berpengaruh ketika penskalaan dan pergeseran bekerja di sisi yang sama. $2f(x) + 3$ meregang lalu mengangkat; $2(f(x) + 3)$ mengangkat lalu meregang, dan angkatannya ikut digandakan. Kurungnya adalah seluruh perbedaannya.\n\nKebiasaan yang aman adalah memfaktorkan bagian dalamnya sampai terbaca $b(x - h)$: $f(2x - 6)$ bukan "kiri 6", melainkan $f(2(x-3))$ — mampatkan 2 kali, lalu geser 3 ke kanan.',
              },
              figure: {
                dim: 2,
                xSpan: [-6, 6],
                ySpan: [-6, 6],
                ticks: true,
                params: [
                  { name: 'a', min: -2, max: 2, step: 0.25, value: 1 },
                  { name: 'h', min: -3, max: 3, step: 0.5, value: 0 },
                  { name: 'k', min: -3, max: 3, step: 0.5, value: 0 },
                ],
                items: [
                  { t: 'curve', f: 'abs(x)', color: 'muted', dashed: true, label: '|x|' },
                  { t: 'curve', f: 'a*abs(x-h)+k', color: 'a', label: 'a|x−h| + k' },
                  { t: 'dot', x: 'h', y: 'k', label: 'sudut' },
                ],
                caption: {
                  en: 'The corner always lands at $(h, k)$, whatever $a$ does — because $a$ multiplies a value that is zero there. Set $a$ negative and the V opens downwards.',
                  id: 'Sudutnya selalu mendarat di $(h, k)$, apa pun yang dilakukan $a$ — sebab $a$ mengalikan nilai yang di situ bernilai nol. Buat $a$ negatif dan huruf V-nya terbuka ke bawah.',
                },
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the transformations that turn $y = \\sqrt{x}$ into $y = -2\\sqrt{x + 1} + 3$.',
                id: 'Susun transformasi yang mengubah $y = \\sqrt{x}$ menjadi $y = -2\\sqrt{x + 1} + 3$.',
              },
              lines: [
                '\\text{geser 1 ke kiri}: \\ \\sqrt{x+1}',
                '\\text{regangkan tegak 2 kali}: \\ 2\\sqrt{x+1}',
                '\\text{cerminkan terhadap sumbu } x: \\ -2\\sqrt{x+1}',
                '\\text{geser 3 ke atas}: \\ -2\\sqrt{x+1} + 3',
              ],
              explain: {
                en: 'Inside before outside, and among the outside changes, multiplication before addition — the same precedence arithmetic always had. The starting point $(0,0)$ ends at $(-1, 3)$.',
                id: 'Yang di dalam sebelum yang di luar, dan di antara perubahan luar, perkalian sebelum penjumlahan — urutan yang memang selalu berlaku dalam aritmetika. Titik awalnya $(0,0)$ berakhir di $(-1, 3)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $y = 2(x + 1)^2 - 3$, find the vertex and the value at $x = 1$.',
                id: 'Untuk $y = 2(x + 1)^2 - 3$, tentukan puncaknya dan nilainya pada $x = 1$.',
              },
              blanks: [
                { label: '\\text{puncak: } x =', answer: -1 },
                { label: 'y =', answer: -3 },
                { label: 'y(1) =', answer: 5 },
              ],
              hints: [
                { en: '$(x+1)$ is $(x - (-1))$, so the shift is to the left.', id: '$(x+1)$ adalah $(x - (-1))$, jadi pergeserannya ke kiri.' },
                { en: 'At $x = 1$: $2(2)^2 - 3$.', id: 'Pada $x = 1$: $2(2)^2 - 3$.' },
              ],
              solution: ['\\text{puncak } (-1, -3)', 'y(1) = 2(4) - 3 = 5'],
              explain: {
                en: 'The stretch by 2 does not move the vertex — it is where the squared term is zero, and twice zero is still zero. It only makes everything either side of it climb twice as fast.',
                id: 'Peregangan 2 kali tidak memindahkan puncaknya — di situlah suku kuadratnya nol, dan dua kali nol tetap nol. Ia hanya membuat segala sesuatu di kedua sisinya menanjak dua kali lebih cepat.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m2-s2-p',
        runtime: 'math',
        title: { en: 'Moving a Graph on Purpose', id: 'Menggeser Grafik dengan Sengaja' },
        brief: {
          en: 'Read three transformed formulas: where the key point went, and what the function does there.',
          id: 'Membaca tiga rumus yang sudah ditransformasi: ke mana titik kuncinya berpindah, dan apa nilai fungsinya di situ.',
        },
        requirements: [
          { en: 'A change inside the function is horizontal and runs the opposite way to its sign.', id: 'Perubahan di dalam fungsi bersifat mendatar dan berlawanan arah dengan tandanya.' },
          { en: 'Factor the inside before reading a horizontal shift off it.', id: 'Faktorkan bagian dalamnya sebelum membaca pergeseran mendatarnya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $y = (x - 4)^2 + 1$, give the vertex.',
              id: 'Untuk $y = (x - 4)^2 + 1$, sebutkan puncaknya.',
            },
            inline: true,
            blanks: [{ answer: 4 }, { answer: 1 }],
            solution: ['h = 4, \\ k = 1 \\Rightarrow \\text{puncak } (4, 1)'],
          },
          {
            prompt: {
              en: 'For $y = -3|x + 2| + 6$, give the corner and the value at $x = 0$.',
              id: 'Untuk $y = -3|x + 2| + 6$, sebutkan sudutnya dan nilainya pada $x = 0$.',
            },
            blanks: [
              { label: '\\text{sudut: } x =', answer: -2 },
              { label: 'y =', answer: 6 },
              { label: 'y(0) =', answer: 0 },
            ],
            solution: [
              '\\text{sudut } (-2, 6)',
              'y(0) = -3|2| + 6 = -6 + 6 = 0',
            ],
          },
          {
            prompt: {
              en: 'The graph of $y = \\sqrt{x}$ becomes $y = \\sqrt{2x - 6}$. Factor the inside and give the horizontal shift, then the smallest $x$ in the domain.',
              id: 'Grafik $y = \\sqrt{x}$ menjadi $y = \\sqrt{2x - 6}$. Faktorkan bagian dalamnya lalu sebutkan pergeseran mendatarnya, dan $x$ terkecil di domainnya.',
            },
            blanks: [
              { label: '\\text{geser ke kanan sejauh}', answer: 3 },
              { label: 'x_{\\min} =', answer: 3 },
            ],
            solution: [
              '\\sqrt{2x - 6} = \\sqrt{2(x - 3)}',
              'h = 3 \\Rightarrow \\text{geser 3 ke kanan}',
              '2x - 6 \\geq 0 \\Rightarrow x \\geq 3',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 2 the $-3$ flips the V downwards and makes it three times steeper, but the corner is still read from $h$ and $k$ alone.',
            id: 'Pada butir 2, $-3$ membalik huruf V ke bawah dan membuatnya tiga kali lebih curam, tetapi sudutnya tetap dibaca dari $h$ dan $k$ saja.',
          },
          {
            en: 'In part 3 the shift is 3, not 6 — the factor of 2 has to come out of the bracket first.',
            id: 'Pada butir 3 pergeserannya 3, bukan 6 — faktor 2 harus dikeluarkan dari kurung lebih dulu.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
