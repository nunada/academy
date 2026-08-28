import type { Module } from '../types'

/** Module 5 — undoing a function, and the one inverse that gets its own name.
 *
 *  Logarithms are taught here as what they are — the inverse of an exponential
 *  — rather than as a list of rules to memorise. Every log law in this module
 *  is an exponent law read backwards, and the lesson says so each time. */
export const module5: Module = {
  id: 'fun-m5',
  title: { en: 'Inverse Functions and Logarithms', id: 'Fungsi Invers dan Logaritma' },
  summary: {
    en: 'When a function can be undone, how to undo it, and the inverse of the exponential that turns multiplication into addition.',
    id: 'Kapan sebuah fungsi bisa dibalik, bagaimana membaliknya, dan invers fungsi eksponen yang mengubah perkalian menjadi penjumlahan.',
  },
  submodules: [
    /* ------------------------------------------------- 5.1 inverse functions */
    {
      id: 'fun-m5-s1',
      title: { en: 'Inverse Functions', id: 'Fungsi Invers' },
      summary: {
        en: 'Which functions can be undone, how to find the rule that undoes them, and the inverse trigonometric functions.',
        id: 'Fungsi mana yang bisa dibalik, bagaimana menemukan aturan yang membaliknya, dan fungsi invers trigonometri.',
      },
      lessons: [
        {
          id: 'fun-m5-s1-l1',
          title: { en: 'One-to-One', id: 'Satu-satu' },
          goal: {
            en: 'Test whether a function has an inverse at all, and restrict a domain when it does not.',
            id: 'Menguji apakah sebuah fungsi punya invers sama sekali, dan membatasi domainnya bila tidak.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Never the same output twice', id: 'Tak pernah keluaran yang sama dua kali' },
              body: {
                en: 'A function is **one-to-one** if different inputs always give different outputs: $f(x_1) \\neq f(x_2)$ whenever $x_1 \\neq x_2$.\n\nThat is exactly the condition for an inverse to exist. If $f$ sent both $2$ and $-2$ to $4$, then a rule undoing $f$ would have to send $4$ to both — and that is not a function.\n\nThe test is the mirror image of the vertical line test: a function is one-to-one exactly when **no horizontal line** meets its graph more than once.\n\n$f(x) = x^2$ fails on $R$. But restrict it to $[0, \\infty)$ and it passes, and its inverse is $\\sqrt{x}$. That is where the convention that $\\sqrt{4}$ means $2$ and not $-2$ comes from: somebody had to choose a half, and the positive one was chosen.',
                id: 'Sebuah fungsi disebut **satu-satu** bila masukan yang berbeda selalu memberi keluaran yang berbeda: $f(x_1) \\neq f(x_2)$ setiap kali $x_1 \\neq x_2$.\n\nItulah persis syarat agar inversnya ada. Kalau $f$ mengirim $2$ maupun $-2$ ke $4$, maka aturan yang membalik $f$ harus mengirim $4$ ke keduanya — dan itu bukan fungsi.\n\nUjinya adalah bayangan cermin dari uji garis tegak: sebuah fungsi satu-satu tepat ketika **tak ada garis mendatar** yang memotong grafiknya lebih dari sekali.\n\n$f(x) = x^2$ gagal pada $R$. Tetapi batasi ke $[0, \\infty)$ dan ia lolos, dan inversnya adalah $\\sqrt{x}$. Dari situlah asal kesepakatan bahwa $\\sqrt{4}$ berarti $2$ dan bukan $-2$: seseorang harus memilih salah satu belahan, dan yang positif yang dipilih.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-2, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2', color: 'muted', dashed: true, label: 'x² pada R' },
                  { t: 'curve', f: 'x^2', from: 0, color: 'a', label: 'x² pada [0, ∞)' },
                  { t: 'hline', y: 4, color: 'b' },
                  { t: 'dot', x: -2, y: 4, open: true, color: 'b' },
                  { t: 'dot', x: 2, y: 4, color: 'b' },
                ],
                caption: {
                  en: 'The horizontal line at $y = 4$ meets the full parabola twice, so it fails. Keep only the solid right half and the same line meets it once — and now there is an inverse.',
                  id: 'Garis mendatar $y = 4$ memotong parabola utuhnya dua kali, jadi ia gagal. Sisakan hanya belahan kanan yang digambar penuh dan garis yang sama memotongnya sekali — dan kini inversnya ada.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is one-to-one on all of $R$?',
                id: 'Manakah yang satu-satu pada seluruh $R$?',
              },
              options: [
                { en: '$f(x) = x^4$', id: '$f(x) = x^4$' },
                { en: '$f(x) = x^3$', id: '$f(x) = x^3$' },
                { en: '$f(x) = |x|$', id: '$f(x) = |x|$' },
                { en: '$f(x) = \\cos x$', id: '$f(x) = \\cos x$' },
              ],
              answer: 1,
              explain: {
                en: '$x^3$ is increasing everywhere, so it never repeats a value. The other three all take the same value at two different inputs — cosine does it infinitely often, being periodic.',
                id: '$x^3$ naik di mana-mana, jadi ia tak pernah mengulang satu nilai pun. Tiga lainnya sama-sama mencapai nilai yang sama pada dua masukan berbeda — cosinus bahkan melakukannya tak berhingga kali, karena periodik.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = x^2$, find the two inputs that share the output 25, then the one that survives on $[0, \\infty)$.',
                id: 'Untuk $f(x) = x^2$, tentukan dua masukan yang berbagi keluaran 25, lalu satu yang bertahan pada $[0, \\infty)$.',
              },
              blanks: [
                { label: 'x =', answer: -5 },
                { label: '\\text{dan } x =', answer: 5 },
                { label: '\\text{pada } [0, \\infty): x =', answer: 5 },
              ],
              hints: [
                { en: 'Both a number and its negative square to the same thing.', id: 'Sebuah bilangan dan negatifnya menghasilkan kuadrat yang sama.' },
              ],
              explain: {
                en: 'Two inputs, one output — which is precisely why $x^2$ has no inverse until you throw one of them away.',
                id: 'Dua masukan, satu keluaran — dan justru itulah sebabnya $x^2$ tak punya invers sebelum salah satunya dibuang.',
              },
            },
          ],
        },
        {
          id: 'fun-m5-s1-l2',
          title: { en: 'Finding and Drawing an Inverse', id: 'Menemukan dan Menggambar Invers' },
          goal: {
            en: 'Produce the formula for $f^{-1}$, and know where its graph is without plotting it.',
            id: 'Menghasilkan rumus $f^{-1}$, dan mengetahui letak grafiknya tanpa menggambarnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Swap, then solve', id: 'Tukar, lalu selesaikan' },
              body: {
                en: 'The inverse $f^{-1}$ undoes $f$:\n$$f^{-1}(f(x)) = x \\qquad \\text{dan} \\qquad f(f^{-1}(y)) = y$$\nThe recipe has three steps. Write $y = f(x)$; **swap** $x$ and $y$; solve for $y$. For $f(x) = 2x + 3$:\n$$y = 2x + 3 \\ \\to \\ x = 2y + 3 \\ \\to \\ y = \\frac{x - 3}{2}$$\nso $f^{-1}(x) = \\dfrac{x-3}{2}$ — undo the doubling and undo the adding, in the opposite order to the way they were done.\n\nOne piece of notation to be careful with: $f^{-1}$ means the inverse function, **not** $1/f$. The $-1$ is not an exponent here, however much it looks like one.',
                id: 'Invers $f^{-1}$ membalik $f$:\n$$f^{-1}(f(x)) = x \\qquad \\text{dan} \\qquad f(f^{-1}(y)) = y$$\nCaranya tiga langkah. Tulis $y = f(x)$; **tukar** $x$ dan $y$; selesaikan untuk $y$. Untuk $f(x) = 2x + 3$:\n$$y = 2x + 3 \\ \\to \\ x = 2y + 3 \\ \\to \\ y = \\frac{x - 3}{2}$$\nsehingga $f^{-1}(x) = \\dfrac{x-3}{2}$ — batalkan penggandaannya dan batalkan penambahannya, dengan urutan terbalik dari cara keduanya dikerjakan.\n\nSatu notasi yang perlu diwaspadai: $f^{-1}$ berarti fungsi inversnya, **bukan** $1/f$. Angka $-1$ di situ bukan pangkat, sekalipun sangat mirip pangkat.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The graph is the mirror image', id: 'Grafiknya adalah bayangan cerminnya' },
              body: {
                en: 'Swapping $x$ and $y$ in the algebra is reflecting in the line $y = x$ in the picture. So the graph of $f^{-1}$ is the graph of $f$ flipped across that diagonal — no plotting needed.\n\nThree consequences follow immediately:\nthe **domain of $f^{-1}$ is the range of $f$**, and its range is $f$\'s domain;\nif $(a, b)$ is on $f$, then $(b, a)$ is on $f^{-1}$;\nany point where the graph meets $y = x$ is fixed by both.\n\nA quick check on your algebra: substitute. If $f^{-1}(f(2))$ does not come back to 2, the formula is wrong.',
                id: 'Menukar $x$ dan $y$ dalam aljabarnya sama dengan mencerminkan terhadap garis $y = x$ dalam gambarnya. Jadi grafik $f^{-1}$ adalah grafik $f$ yang dibalik terhadap diagonal itu — tak perlu menggambar titik demi titik.\n\nTiga akibat langsung menyusul:\n**domain $f^{-1}$ adalah range $f$**, dan range-nya adalah domain $f$;\nbila $(a, b)$ terletak pada $f$, maka $(b, a)$ terletak pada $f^{-1}$;\nsetiap titik tempat grafiknya menyentuh $y = x$ tetap di tempatnya bagi keduanya.\n\nPemeriksaan cepat untuk aljabarmu: substitusikan. Bila $f^{-1}(f(2))$ tidak kembali menjadi 2, rumusnya keliru.',
              },
              figure: {
                dim: 2,
                xSpan: [-5, 5],
                ySpan: [-5, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: '2*x+3', color: 'a', label: '2x + 3' },
                  { t: 'curve', f: '(x-3)/2', color: 'b', label: '(x−3)/2' },
                  { t: 'curve', f: 'x', color: 'muted', dashed: true, label: 'y = x' },
                  { t: 'dot', x: 0, y: 3, color: 'a' },
                  { t: 'dot', x: 3, y: 0, color: 'b' },
                ],
                caption: {
                  en: 'Fold the page along the dashed diagonal and the two lines swap places. The marked points $(0, 3)$ and $(3, 0)$ are the same point, seen from each side.',
                  id: 'Lipat kertasnya sepanjang diagonal putus-putus dan kedua garisnya bertukar tempat. Titik yang ditandai $(0, 3)$ dan $(3, 0)$ adalah titik yang sama, dilihat dari masing-masing sisi.',
                },
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working that inverts $f(x) = x^3 + 1$.',
                id: 'Susun langkah yang membalik $f(x) = x^3 + 1$.',
              },
              lines: [
                'y = x^3 + 1',
                'x = y^3 + 1',
                'y^3 = x - 1',
                'f^{-1}(x) = \\sqrt[3]{x - 1}',
              ],
              explain: {
                en: 'Swap first, then solve. Solving before swapping gives you $f$ again, rearranged — a step that feels like progress and is not.',
                id: 'Tukar dulu, baru selesaikan. Menyelesaikan sebelum menukar hanya memberimu $f$ lagi dalam susunan berbeda — langkah yang terasa seperti kemajuan padahal bukan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'With $f(x) = 2x + 3$ and $g(x) = x^3 + 1$, evaluate each inverse.',
                id: 'Dengan $f(x) = 2x + 3$ dan $g(x) = x^3 + 1$, hitung tiap inversnya.',
              },
              blanks: [
                { label: 'f^{-1}(x) =', formula: '(x-3)/2' },
                { label: 'f^{-1}(7) =', answer: 2 },
                { label: 'f^{-1}(0) =', answer: -1.5 },
                { label: 'g^{-1}(9) =', answer: 2 },
              ],
              hints: [
                {
                  en: 'The first box wants the rule itself. Swap and solve: $x = 2y + 3$.',
                  id: 'Kotak pertama meminta aturannya sendiri. Tukar lalu selesaikan: $x = 2y + 3$.',
                },
                { en: 'For the others, ask "what input would $f$ have needed to give this?"', id: 'Untuk sisanya, tanyakan "masukan apa yang dibutuhkan $f$ untuk menghasilkan ini?"' },
              ],
              solution: [
                'f^{-1}(x) = \\tfrac{x-3}{2}',
                'f^{-1}(7) = \\tfrac{7-3}{2} = 2',
                'f^{-1}(0) = \\tfrac{-3}{2} = -1{,}5',
                'g^{-1}(9) = \\sqrt[3]{8} = 2',
              ],
              explain: {
                en: 'Check the first: $f(2) = 7$. That round trip is the definition, and it costs one line to run.',
                id: 'Periksa yang pertama: $f(2) = 7$. Perjalanan bolak-balik itulah definisinya, dan hanya butuh satu baris untuk menjalankannya.',
              },
            },
          ],
        },
        {
          id: 'fun-m5-s1-l3',
          title: { en: 'Inverse Trigonometric Functions', id: 'Fungsi Invers Trigonometri' },
          goal: {
            en: 'Use arcsin, arccos and arctan, and respect the ranges they were given.',
            id: 'Memakai arcsin, arccos, dan arctan, serta menghormati range yang diberikan kepadanya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Periodic functions need a chosen slice', id: 'Fungsi periodik memerlukan satu potongan pilihan' },
              body: {
                en: 'No periodic function is one-to-one — it repeats every value forever. So each trigonometric function is cut down to a stretch on which it is, and the inverse is defined only there.\n\n$$\\arcsin: [-1, 1] \\to \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$$\n$$\\arccos: [-1, 1] \\to [0, \\pi]$$\n$$\\arctan: R \\to \\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)$$\nThe ranges are the whole content of the definition. $\\sin x = \\tfrac{1}{2}$ has infinitely many solutions; $\\arcsin\\tfrac{1}{2}$ has exactly one, $\\tfrac{\\pi}{6}$, because the range was chosen to make it so.\n\nSo $\\arcsin(\\sin x)$ is **not** always $x$. At $x = \\pi$ it gives 0, since $\\sin\\pi = 0$ and $\\arcsin 0 = 0$ — the round trip only closes for $x$ already inside the chosen stretch.',
                id: 'Tak ada fungsi periodik yang satu-satu — ia mengulang setiap nilainya selamanya. Maka tiap fungsi trigonometri dipotong menjadi satu bentangan tempat ia satu-satu, dan inversnya hanya didefinisikan di situ.\n\n$$\\arcsin: [-1, 1] \\to \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$$\n$$\\arccos: [-1, 1] \\to [0, \\pi]$$\n$$\\arctan: R \\to \\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)$$\nRange-nya adalah seluruh isi definisinya. $\\sin x = \\tfrac{1}{2}$ punya tak berhingga penyelesaian; $\\arcsin\\tfrac{1}{2}$ punya tepat satu, yaitu $\\tfrac{\\pi}{6}$, karena range-nya memang dipilih agar begitu.\n\nJadi $\\arcsin(\\sin x)$ **tidak** selalu sama dengan $x$. Pada $x = \\pi$ hasilnya 0, sebab $\\sin\\pi = 0$ dan $\\arcsin 0 = 0$ — perjalanan bolak-baliknya hanya menutup untuk $x$ yang memang sudah berada di dalam bentangan pilihan itu.',
              },
              figure: {
                dim: 2,
                xSpan: [-4, 4],
                ySpan: [-2, 3.4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'asin(x)', from: -1, to: 1, color: 'a', label: 'arcsin x' },
                  { t: 'curve', f: 'acos(x)', from: -1, to: 1, color: 'b', label: 'arccos x' },
                  { t: 'curve', f: 'atan(x)', color: 'c', label: 'arctan x' },
                  { t: 'hline', y: Math.PI / 2 },
                  { t: 'hline', y: -Math.PI / 2 },
                ],
                caption: {
                  en: 'The first two stop dead at $x = \\pm 1$ — outside that there is no angle to return. Arctangent accepts everything but flattens towards $\\pm\\tfrac{\\pi}{2}$ and never arrives.',
                  id: 'Dua yang pertama berhenti tepat di $x = \\pm 1$ — di luar itu tak ada sudut yang bisa dikembalikan. Arctangen menerima apa saja tetapi memipih menuju $\\pm\\tfrac{\\pi}{2}$ dan tak pernah sampai.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\arcsin(2)$?',
                id: 'Berapakah $\\arcsin(2)$?',
              },
              options: [
                { en: '$\\tfrac{\\pi}{3}$', id: '$\\tfrac{\\pi}{3}$' },
                { en: '$2\\pi$', id: '$2\\pi$' },
                { en: 'Undefined — 2 is outside the domain.', id: 'Tak terdefinisi — 2 berada di luar domainnya.' },
                { en: '$\\tfrac{\\pi}{2}$', id: '$\\tfrac{\\pi}{2}$' },
              ],
              answer: 2,
              explain: {
                en: 'Sine never exceeds 1, so no angle has a sine of 2 and there is nothing for arcsine to return. Its domain is exactly the range of sine, $[-1, 1]$ — the general rule about inverses, in a particular case.',
                id: 'Sinus tak pernah melebihi 1, jadi tak ada sudut yang sinusnya 2 dan tak ada yang bisa dikembalikan arcsinus. Domainnya persis range sinus, $[-1, 1]$ — aturan umum tentang invers, dalam satu kasus tertentu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Give each in radians.',
                id: 'Sebutkan masing-masing dalam radian.',
              },
              blanks: [
                { label: '\\arcsin\\tfrac{1}{2} =', answer: Math.PI / 6 },
                { label: '\\arccos(-\\tfrac{1}{2}) =', answer: (2 * Math.PI) / 3 },
                { label: '\\arctan 1 =', answer: Math.PI / 4 },
                { label: '\\arcsin(\\sin\\pi) =', answer: 0 },
              ],
              hints: [
                { en: 'Ask which angle **in the allowed range** has that value.', id: 'Tanyakan sudut mana **dalam range yang diizinkan** yang punya nilai itu.' },
                { en: 'Arccosine must land in $[0, \\pi]$, so a negative input gives an obtuse angle.', id: 'Arccosinus harus mendarat di $[0, \\pi]$, jadi masukan negatif memberi sudut tumpul.' },
              ],
              solution: [
                '\\arcsin\\tfrac{1}{2} = \\tfrac{\\pi}{6}, \\qquad \\arccos\\left(-\\tfrac{1}{2}\\right) = \\tfrac{2\\pi}{3}',
                '\\arctan 1 = \\tfrac{\\pi}{4}',
                '\\sin\\pi = 0 \\Rightarrow \\arcsin(\\sin\\pi) = \\arcsin 0 = 0',
              ],
              explain: {
                en: 'The last one is the trap: $\\pi$ is not in $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$, so the round trip does not return it. It returns the angle in the allowed range with the same sine — which is 0.',
                id: 'Yang terakhir adalah jebakannya: $\\pi$ tidak berada di $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$, jadi perjalanan bolak-baliknya tak mengembalikannya. Yang dikembalikan adalah sudut di dalam range yang diizinkan dengan sinus yang sama — yaitu 0.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m5-s1-p',
        runtime: 'math',
        title: { en: 'Undoing a Function', id: 'Membalik Sebuah Fungsi' },
        brief: {
          en: 'Two inverses to build and evaluate, and one inverse trigonometric value that has to respect its range.',
          id: 'Dua invers untuk disusun dan dihitung, serta satu nilai invers trigonometri yang harus menghormati range-nya.',
        },
        requirements: [
          { en: 'Swap before you solve.', id: 'Tukar dulu sebelum menyelesaikan.' },
          { en: 'Give inverse trigonometric answers in radians.', id: 'Nyatakan jawaban invers trigonometri dalam radian.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $f(x) = 5x - 2$, evaluate $f^{-1}(13)$ and $f^{-1}(-2)$.',
              id: 'Untuk $f(x) = 5x - 2$, hitung $f^{-1}(13)$ dan $f^{-1}(-2)$.',
            },
            blanks: [
              { label: 'f^{-1}(13) =', answer: 3 },
              { label: 'f^{-1}(-2) =', answer: 0 },
            ],
            solution: ['f^{-1}(x) = \\tfrac{x+2}{5}', 'f^{-1}(13) = 3, \\qquad f^{-1}(-2) = 0'],
          },
          {
            prompt: {
              en: 'For $g(x) = \\sqrt{x - 4}$, evaluate $g^{-1}(3)$, and give the smallest value $g^{-1}$ accepts.',
              id: 'Untuk $g(x) = \\sqrt{x - 4}$, hitung $g^{-1}(3)$, dan sebutkan nilai terkecil yang diterima $g^{-1}$.',
            },
            blanks: [
              { label: 'g^{-1}(x) =', formula: 'x^2+4', domain: [0, 6] },
              { label: 'g^{-1}(3) =', answer: 13 },
              { label: 'x_{\\min} =', answer: 0 },
            ],
            solution: [
              'y = \\sqrt{x-4} \\Rightarrow x = \\sqrt{y-4} \\Rightarrow g^{-1}(x) = x^2 + 4',
              'g^{-1}(3) = 9 + 4 = 13',
              '\\text{range } g = [0,\\infty) \\Rightarrow \\text{domain } g^{-1} = [0,\\infty)',
            ],
          },
          {
            prompt: {
              en: 'Give $\\arccos(0)$ and $\\arctan(-1)$ in radians.',
              id: 'Sebutkan $\\arccos(0)$ dan $\\arctan(-1)$ dalam radian.',
            },
            blanks: [
              { label: '\\arccos 0 =', answer: Math.PI / 2 },
              { label: '\\arctan(-1) =', answer: -Math.PI / 4 },
            ],
            solution: [
              '\\cos\\tfrac{\\pi}{2} = 0 \\text{ dan } \\tfrac{\\pi}{2} \\in [0, \\pi]',
              '\\tan\\left(-\\tfrac{\\pi}{4}\\right) = -1 \\text{ dan } -\\tfrac{\\pi}{4} \\in \\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 2 the domain of the inverse is the range of the original — and a square root is never negative.',
            id: 'Pada butir 2, domain inversnya adalah range fungsi aslinya — dan akar kuadrat tak pernah negatif.',
          },
          {
            en: 'Arctangent may return a negative angle; arccosine never does.',
            id: 'Arctangen boleh mengembalikan sudut negatif; arccosinus tak pernah.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------- 5.2 logarithms */
    {
      id: 'fun-m5-s2',
      title: { en: 'Logarithms', id: 'Logaritma' },
      summary: {
        en: 'The inverse of an exponential, the laws that follow from it, and solving equations with the variable in the exponent.',
        id: 'Invers dari fungsi eksponen, hukum-hukum yang mengikutinya, dan menyelesaikan persamaan yang variabelnya ada di pangkat.',
      },
      lessons: [
        {
          id: 'fun-m5-s2-l1',
          title: { en: 'A Logarithm Is an Exponent', id: 'Logaritma Adalah Sebuah Pangkat' },
          goal: {
            en: 'Move between exponential and logarithmic form, and read the graph.',
            id: 'Berpindah antara bentuk eksponen dan bentuk logaritma, serta membaca grafiknya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The question it answers', id: 'Pertanyaan yang dijawabnya' },
              body: {
                en: '$\\log_a x$ is the answer to one question: **what power of $a$ gives $x$?**\n$$\\log_a x = y \\iff a^y = x$$\nThat equivalence is the definition, and reading it in both directions is most of the skill. $\\log_2 8 = 3$ because $2^3 = 8$. $\\log_{10} 100 = 2$ because $10^2 = 100$.\n\nTwo bases get shorthand: $\\ln x$ means $\\log_e x$, the **natural logarithm**, and a bare $\\log x$ usually means base 10.\n\nSince it is the inverse of $a^x$, its graph is that graph reflected in $y = x$. Everything swaps: **domain $(0, \\infty)$** — you cannot take the log of zero or of a negative, because no power of a positive base ever gets there — **range all of $R$**, and the **$y$-axis as a vertical asymptote**. It passes through $(1, 0)$, because $a^0 = 1$ for every base.',
                id: '$\\log_a x$ adalah jawaban atas satu pertanyaan: **pangkat berapa dari $a$ yang menghasilkan $x$?**\n$$\\log_a x = y \\iff a^y = x$$\nKesetaraan itulah definisinya, dan membacanya ke dua arah sudah sebagian besar keterampilannya. $\\log_2 8 = 3$ karena $2^3 = 8$. $\\log_{10} 100 = 2$ karena $10^2 = 100$.\n\nDua basis punya singkatan: $\\ln x$ berarti $\\log_e x$, **logaritma natural**, dan $\\log x$ tanpa keterangan biasanya berarti basis 10.\n\nKarena ia invers dari $a^x$, grafiknya adalah grafik itu yang dicerminkan terhadap $y = x$. Semuanya bertukar: **domain $(0, \\infty)$** — kamu tak bisa mengambil logaritma dari nol atau dari bilangan negatif, sebab tak ada pangkat dari basis positif yang pernah sampai ke sana — **range seluruh $R$**, dan **sumbu $y$ sebagai asimtot tegak**. Ia melalui $(1, 0)$, sebab $a^0 = 1$ untuk setiap basis.',
              },
              figure: {
                dim: 2,
                xSpan: [-5, 5],
                ySpan: [-5, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'e^x', color: 'a', label: 'eˣ' },
                  { t: 'curve', f: 'ln(x)', from: 0.002, color: 'b', label: 'ln x' },
                  { t: 'curve', f: 'x', color: 'muted', dashed: true, label: 'y = x' },
                  { t: 'dot', x: 0, y: 1, color: 'a', label: '(0, 1)' },
                  { t: 'dot', x: 1, y: 0, color: 'b', label: '(1, 0)' },
                ],
                caption: {
                  en: 'The same curve twice, folded across the diagonal. The horizontal asymptote of one is the vertical asymptote of the other, and the two marked points are each other reversed.',
                  id: 'Kurva yang sama, dua kali, dilipat pada diagonalnya. Asimtot mendatar yang satu menjadi asimtot tegak yang lain, dan kedua titik yang ditandai adalah kebalikan satu sama lain.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Rewrite $\\log_3 81 = 4$ in exponential form.',
                id: 'Tulis ulang $\\log_3 81 = 4$ dalam bentuk eksponen.',
              },
              template: '___^{4} = 81',
              blanks: ['3'],
              explain: {
                en: 'The base of the logarithm is the base of the power. The value of the logarithm is the exponent — that is the whole of the definition, read across.',
                id: 'Basis logaritmanya adalah basis pangkatnya. Nilai logaritmanya adalah pangkatnya — dan itulah seluruh definisinya, dibaca menyeberang.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the domain of $y = \\ln(x - 2)$?',
                id: 'Apa domain dari $y = \\ln(x - 2)$?',
              },
              options: [
                { en: '$x > 0$', id: '$x > 0$' },
                { en: '$x > 2$', id: '$x > 2$' },
                { en: '$x \\geq 2$', id: '$x \\geq 2$' },
                { en: 'Every real number', id: 'Semua bilangan real' },
              ],
              answer: 1,
              explain: {
                en: 'The inside must be strictly positive: $x - 2 > 0$. Not $\\geq$ — $\\ln 0$ is undefined, which is the vertical asymptote showing up as a domain restriction.',
                id: 'Bagian dalamnya harus positif tegas: $x - 2 > 0$. Bukan $\\geq$ — $\\ln 0$ tak terdefinisi, dan itulah asimtot tegaknya yang menampakkan diri sebagai pembatasan domain.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate each without a calculator.',
                id: 'Hitung masing-masing tanpa kalkulator.',
              },
              blanks: [
                { label: '\\log_2 32 =', answer: 5 },
                { label: '\\log_{10} 1000 =', answer: 3 },
                { label: '\\ln e^3 =', answer: 3 },
                { label: '\\log_3 \\tfrac{1}{9} =', answer: -2 },
              ],
              hints: [
                { en: 'Ask each time: what power of the base gives that number?', id: 'Tanyakan tiap kali: pangkat berapa dari basisnya yang menghasilkan bilangan itu?' },
                { en: 'A number below 1 needs a negative exponent.', id: 'Bilangan di bawah 1 memerlukan pangkat negatif.' },
              ],
              solution: [
                '2^5 = 32, \\qquad 10^3 = 1000',
                '\\ln e^3 = 3 \\text{ karena } \\ln \\text{ membalik } e^x',
                '3^{-2} = \\tfrac{1}{9} \\Rightarrow \\log_3\\tfrac{1}{9} = -2',
              ],
              explain: {
                en: 'The last one is negative because $\\tfrac{1}{9}$ is below 1, and every logarithm is negative there. It is never undefined for small positive numbers — only for zero and below.',
                id: 'Yang terakhir negatif karena $\\tfrac{1}{9}$ berada di bawah 1, dan setiap logaritma bernilai negatif di sana. Ia tak pernah tak terdefinisi untuk bilangan positif yang kecil — hanya untuk nol dan yang di bawahnya.',
              },
            },
          ],
        },
        {
          id: 'fun-m5-s2-l2',
          title: { en: 'The Laws of Logarithms', id: 'Hukum Logaritma' },
          goal: {
            en: 'Split, combine and move a logarithm, and know which moves are not allowed.',
            id: 'Memecah, menggabungkan, dan memindahkan logaritma, serta mengetahui langkah mana yang tidak diperbolehkan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Every exponent law, backwards', id: 'Setiap hukum eksponen, dibalik' },
              body: {
                en: 'Because a logarithm **is** an exponent, each exponent law becomes a logarithm law:\n$$\\log_a(xy) = \\log_a x + \\log_a y$$\n$$\\log_a\\!\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y$$\n$$\\log_a(x^r) = r\\log_a x$$\nThe first comes straight from $a^m a^n = a^{m+n}$: multiplying the numbers adds their exponents. That is the property logarithms were invented for — before calculators, they turned an afternoon of multiplication into an afternoon of addition.\n\nAnd the two that are always true: $\\log_a 1 = 0$ and $\\log_a a = 1$.\n\nWhat is **not** a law is worth as much space:\n$$\\log(x + y) \\neq \\log x + \\log y, \\qquad \\frac{\\log x}{\\log y} \\neq \\log\\frac{x}{y}, \\qquad (\\log x)^2 \\neq 2\\log x$$\nThe laws convert multiplication into addition. They say nothing at all about a sum inside.',
                id: 'Karena logaritma **adalah** sebuah pangkat, tiap hukum eksponen menjadi hukum logaritma:\n$$\\log_a(xy) = \\log_a x + \\log_a y$$\n$$\\log_a\\!\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y$$\n$$\\log_a(x^r) = r\\log_a x$$\nYang pertama datang langsung dari $a^m a^n = a^{m+n}$: mengalikan bilangannya berarti menjumlahkan pangkatnya. Sifat itulah yang membuat logaritma diciptakan — sebelum ada kalkulator, ia mengubah satu sore penuh perkalian menjadi satu sore penuh penjumlahan.\n\nDan dua yang selalu benar: $\\log_a 1 = 0$ dan $\\log_a a = 1$.\n\nYang **bukan** hukum layak mendapat ruang yang sama:\n$$\\log(x + y) \\neq \\log x + \\log y, \\qquad \\frac{\\log x}{\\log y} \\neq \\log\\frac{x}{y}, \\qquad (\\log x)^2 \\neq 2\\log x$$\nHukum-hukumnya mengubah perkalian menjadi penjumlahan. Ia sama sekali tak berbicara tentang penjumlahan di dalamnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which step is **wrong**?',
                id: 'Langkah manakah yang **salah**?',
              },
              options: [
                { en: '$\\log(6x) = \\log 6 + \\log x$', id: '$\\log(6x) = \\log 6 + \\log x$' },
                { en: '$\\log(x^3) = 3\\log x$', id: '$\\log(x^3) = 3\\log x$' },
                { en: '$\\log(x + 3) = \\log x + \\log 3$', id: '$\\log(x + 3) = \\log x + \\log 3$' },
                { en: '$\\log\\tfrac{x}{4} = \\log x - \\log 4$', id: '$\\log\\tfrac{x}{4} = \\log x - \\log 4$' },
              ],
              answer: 2,
              explain: {
                en: 'A sum inside a logarithm cannot be split at all. Test it: $\\log(1 + 9) = \\log 10 = 1$, but $\\log 1 + \\log 9 \\approx 0{,}95$. One counterexample settles it.',
                id: 'Penjumlahan di dalam logaritma sama sekali tak bisa dipecah. Ujilah: $\\log(1 + 9) = \\log 10 = 1$, sedangkan $\\log 1 + \\log 9 \\approx 0{,}95$. Satu contoh penyangkal sudah cukup.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Combine into one logarithm.',
                id: 'Gabungkan menjadi satu logaritma.',
              },
              template: '2\\log x + \\log y = \\log\\left(x^{___} y\\right)',
              blanks: ['2'],
              explain: {
                en: 'The coefficient goes up as a power, then the sum becomes a product. Both laws, used in the direction that packs things together.',
                id: 'Koefisiennya naik menjadi pangkat, lalu penjumlahannya menjadi perkalian. Kedua hukumnya, dipakai ke arah yang memadatkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Use the laws to evaluate each.',
                id: 'Pakai hukumnya untuk menghitung masing-masing.',
              },
              blanks: [
                { label: '\\log_2 8 + \\log_2 4 =', answer: 5 },
                { label: '\\log_2 \\tfrac{32}{4} =', answer: 3 },
                { label: '\\log_5 25^3 =', answer: 6 },
                { label: '\\ln 1 =', answer: 0 },
              ],
              hints: [
                { en: 'The first is $\\log_2(8 \\cdot 4) = \\log_2 32$.', id: 'Yang pertama adalah $\\log_2(8 \\cdot 4) = \\log_2 32$.' },
                { en: '$\\log_5 25^3 = 3\\log_5 25 = 3 \\cdot 2$.', id: '$\\log_5 25^3 = 3\\log_5 25 = 3 \\cdot 2$.' },
              ],
              solution: [
                '\\log_2 8 + \\log_2 4 = \\log_2 32 = 5',
                '\\log_2\\tfrac{32}{4} = \\log_2 8 = 3',
                '\\log_5 25^3 = 3\\log_5 25 = 6',
                '\\ln 1 = 0',
              ],
              explain: {
                en: 'Each one could have been done the long way, but each law turned it into something you already knew. That is what the laws are for.',
                id: 'Masing-masing bisa saja dikerjakan dengan jalan panjang, tetapi tiap hukumnya mengubahnya menjadi sesuatu yang sudah kamu ketahui. Untuk itulah hukum-hukum itu ada.',
              },
            },
          ],
        },
        {
          id: 'fun-m5-s2-l3',
          title: { en: 'Solving Equations', id: 'Menyelesaikan Persamaan' },
          goal: {
            en: 'Solve for a variable in an exponent, and change the base of a logarithm.',
            id: 'Menyelesaikan variabel yang berada di pangkat, dan mengubah basis logaritma.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Take the log of both sides', id: 'Ambil logaritma kedua ruas' },
              body: {
                en: 'When the unknown is in the exponent, a logarithm brings it down — that is the whole method.\n$$3^x = 20 \\ \\to \\ \\ln 3^x = \\ln 20 \\ \\to \\ x\\ln 3 = \\ln 20 \\ \\to \\ x = \\frac{\\ln 20}{\\ln 3} \\approx 2{,}73$$\nThe third law is what does the work: $\\ln 3^x = x\\ln 3$ turns an exponent into a coefficient, and a coefficient can be divided away.\n\nThat last line is also the **change of base** formula:\n$$\\log_a x = \\frac{\\ln x}{\\ln a}$$\nwhich is how a calculator with only $\\ln$ and $\\log$ on it computes a logarithm to any base at all.\n\nThe other direction — the unknown inside a logarithm — is undone by exponentiating:\n$$\\log_2(x - 1) = 3 \\ \\to \\ x - 1 = 2^3 \\ \\to \\ x = 9$$\nCheck it in the original. A solution that makes any logarithm take a non-positive argument has to be thrown out, and that check is not optional.',
                id: 'Ketika yang dicari berada di pangkat, logaritma menurunkannya — dan itulah seluruh metodenya.\n$$3^x = 20 \\ \\to \\ \\ln 3^x = \\ln 20 \\ \\to \\ x\\ln 3 = \\ln 20 \\ \\to \\ x = \\frac{\\ln 20}{\\ln 3} \\approx 2{,}73$$\nHukum ketiga yang mengerjakannya: $\\ln 3^x = x\\ln 3$ mengubah pangkat menjadi koefisien, dan koefisien bisa dibagi habis.\n\nBaris terakhir itu sekaligus rumus **perubahan basis**:\n$$\\log_a x = \\frac{\\ln x}{\\ln a}$$\ndan dengan itulah kalkulator yang hanya punya $\\ln$ dan $\\log$ menghitung logaritma dengan basis apa pun.\n\nArah sebaliknya — yang dicari berada di dalam logaritma — dibatalkan dengan memangkatkan:\n$$\\log_2(x - 1) = 3 \\ \\to \\ x - 1 = 2^3 \\ \\to \\ x = 9$$\nPeriksa kembali pada persamaan asalnya. Penyelesaian yang membuat suatu logaritma menerima argumen tak positif harus dibuang, dan pemeriksaan itu bukan pilihan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working that solves $5 \\cdot 2^x = 160$.',
                id: 'Susun langkah yang menyelesaikan $5 \\cdot 2^x = 160$.',
              },
              lines: [
                '2^x = 32',
                '\\ln 2^x = \\ln 32',
                'x\\ln 2 = \\ln 32',
                'x = \\tfrac{\\ln 32}{\\ln 2} = 5',
              ],
              explain: {
                en: 'Isolate the power before you take any logarithm. Taking $\\ln$ of $5 \\cdot 2^x$ first is legal but gives you an extra term to carry for no reason.',
                id: 'Pisahkan bentuk pangkatnya sebelum mengambil logaritma apa pun. Mengambil $\\ln$ dari $5 \\cdot 2^x$ lebih dulu memang sah tetapi memberi satu suku tambahan yang harus dibawa tanpa alasan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Solving $\\log_2 x + \\log_2 (x - 2) = 3$ gives $x = 4$ and $x = -2$. Which are solutions?',
                id: 'Menyelesaikan $\\log_2 x + \\log_2 (x - 2) = 3$ memberi $x = 4$ dan $x = -2$. Manakah yang merupakan penyelesaian?',
              },
              options: [
                { en: 'Both', id: 'Keduanya' },
                { en: 'Only $x = 4$', id: 'Hanya $x = 4$' },
                { en: 'Only $x = -2$', id: 'Hanya $x = -2$' },
                { en: 'Neither', id: 'Tidak keduanya' },
              ],
              answer: 1,
              explain: {
                en: '$x = -2$ would need $\\log_2(-2)$, which does not exist. Combining the logarithms into one hid the domain condition, and it has to be put back by checking. Such an answer is called extraneous.',
                id: '$x = -2$ akan memerlukan $\\log_2(-2)$, yang tak ada. Menggabungkan kedua logaritmanya menjadi satu menyembunyikan syarat domainnya, dan syarat itu harus dikembalikan lewat pemeriksaan. Jawaban semacam itu disebut penyelesaian palsu.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Solve each. Two decimal places where it is not exact.',
                id: 'Selesaikan masing-masing. Dua desimal bila tidak eksak.',
              },
              blanks: [
                { label: '3^x = 20 \\Rightarrow x =', answer: Math.log(20) / Math.log(3) },
                { label: '\\log_2(x - 1) = 3 \\Rightarrow x =', answer: 9 },
                { label: '\\log_5 40 =', answer: Math.log(40) / Math.log(5) },
              ],
              hints: [
                { en: 'You may type `ln(20)/ln(3)` straight into the box.', id: 'Kamu boleh mengetik `ln(20)/ln(3)` langsung ke kotaknya.' },
                { en: 'For the second, exponentiate both sides with base 2.', id: 'Untuk yang kedua, pangkatkan kedua ruas dengan basis 2.' },
              ],
              solution: [
                'x = \\tfrac{\\ln 20}{\\ln 3} \\approx 2{,}73',
                'x - 1 = 2^3 = 8 \\Rightarrow x = 9',
                '\\log_5 40 = \\tfrac{\\ln 40}{\\ln 5} \\approx 2{,}29',
              ],
              explain: {
                en: 'A quick sanity check on the last: $5^2 = 25$ and $5^3 = 125$, so $\\log_5 40$ has to sit between 2 and 3 — and nearer 2, because 40 is much nearer 25.',
                id: 'Pemeriksaan cepat untuk yang terakhir: $5^2 = 25$ dan $5^3 = 125$, jadi $\\log_5 40$ pasti berada antara 2 dan 3 — dan lebih dekat ke 2, sebab 40 jauh lebih dekat ke 25.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m5-s2-p',
        runtime: 'math',
        title: { en: 'Bringing the Exponent Down', id: 'Menurunkan Pangkatnya' },
        brief: {
          en: 'Three equations: one exponential, one logarithmic, and one from the growth model of Module 4.',
          id: 'Tiga persamaan: satu eksponen, satu logaritma, dan satu dari model pertumbuhan Modul 4.',
        },
        requirements: [
          { en: 'Isolate the power before taking a logarithm.', id: 'Pisahkan bentuk pangkatnya sebelum mengambil logaritma.' },
          { en: 'Check a logarithmic solution against the original equation.', id: 'Periksa penyelesaian logaritma terhadap persamaan aslinya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Solve $4 \\cdot 3^x = 108$.',
              id: 'Selesaikan $4 \\cdot 3^x = 108$.',
            },
            blanks: [{ label: 'x =', answer: 3 }],
            solution: ['3^x = 27 \\Rightarrow x = 3'],
          },
          {
            prompt: {
              en: 'Solve $\\ln(2x + 1) = 2$.',
              id: 'Selesaikan $\\ln(2x + 1) = 2$.',
            },
            blanks: [{ label: 'x =', answer: (Math.exp(2) - 1) / 2 }],
            solution: [
              '2x + 1 = e^2 \\Rightarrow x = \\tfrac{e^2 - 1}{2} \\approx 3{,}19',
            ],
          },
          {
            prompt: {
              en: 'A population $P = 5000(1{,}04)^t$ reaches 10000 in how many years?',
              id: 'Populasi $P = 5000(1{,}04)^t$ mencapai 10000 dalam berapa tahun?',
            },
            blanks: [{ label: 't =', answer: Math.log(2) / Math.log(1.04) }],
            solution: [
              '(1{,}04)^t = 2',
              't = \\tfrac{\\ln 2}{\\ln 1{,}04} \\approx 17{,}67 \\text{ tahun}',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 3 the starting size cancels: doubling is $1{,}04^t = 2$ whatever the population began at.',
            id: 'Pada butir 3 jumlah awalnya saling menghapus: penggandaan berarti $1{,}04^t = 2$ berapa pun populasi awalnya.',
          },
          {
            en: 'You may type `ln(2)/ln(1.04)` — the box works it out.',
            id: 'Kamu boleh mengetik `ln(2)/ln(1.04)` — kotaknya yang menghitung.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
