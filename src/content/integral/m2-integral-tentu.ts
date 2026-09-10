import type { Module } from '../types'

/** Module 2 — a completely different question (how much area sits under a
 *  curve) turns out, by the Fundamental Theorem, to have the same answer as
 *  Module 1's question (what antidifferentiates this). Two ideas that look
 *  unrelated on first sight collapse into one calculation. */
export const module2: Module = {
  id: 'int-m2',
  title: { en: 'The Definite Integral and the Fundamental Theorem', id: 'Integral Tentu dan Teorema Dasar Kalkulus' },
  summary: {
    en: 'Area approximated by rectangles, defined exactly as a limit of sums, and computed in practice through the theorem that connects it to antiderivatives.',
    id: 'Luas dihampiri dengan persegi panjang, didefinisikan secara eksak sebagai limit jumlah, dan dihitung dalam praktik lewat teorema yang menghubungkannya dengan antiturunan.',
  },
  submodules: [
    /* --------------------------------------------- 2.1 riemann sums and the definition */
    {
      id: 'int-m2-s1',
      title: { en: 'Riemann Sums and the Definite Integral', id: 'Jumlah Riemann dan Integral Tentu' },
      summary: {
        en: 'Approximating area under a curve with rectangles, and defining the exact area as the limit those approximations approach.',
        id: 'Menghampiri luas di bawah kurva dengan persegi panjang, dan mendefinisikan luas eksak sebagai limit yang didekati hampiran itu.',
      },
      lessons: [
        {
          id: 'int-m2-s1-l1',
          title: { en: 'Approximating Area with Rectangles', id: 'Menghampiri Luas dengan Persegi Panjang' },
          goal: {
            en: 'Approximate the area under a curve using left, right, and midpoint rectangles, and see why they disagree.',
            id: 'Menghampiri luas di bawah kurva memakai persegi panjang kiri, kanan, dan tengah, serta melihat mengapa ketiganya berbeda.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Cover the region with rectangles you can measure', id: 'Menutupi daerahnya dengan persegi panjang yang bisa diukur' },
              body: {
                en: 'The area under a curved boundary has no ready formula — only the area under a *straight* boundary does. The fix is to approximate: slice $[0, 2]$ into $n = 4$ strips of equal width $\\Delta x = 0.5$, and on each strip stand a rectangle whose height is $f$ at the strip\'s **left** endpoint.\n\nFor $f(x) = x^2 + 1$, the left endpoints are $x = 0, 0.5, 1, 1.5$, giving heights $1, 1.25, 2, 3.25$. Each rectangle has a computable area (width times height), and adding the four:\n$$L_4 = 0.5(1 + 1.25 + 2 + 3.25) = 0.5(7.5) = 3.75$$\nThis is the **left Riemann sum** — an approximation, since the rectangles either undershoot or overshoot the true curved region on each strip.',
                id: 'Luas di bawah batas yang melengkung tak punya rumus siap pakai — hanya luas di bawah batas *lurus* yang punya. Perbaikannya adalah menghampiri: iris $[0, 2]$ menjadi $n = 4$ jalur berlebar sama $\\Delta x = 0.5$, dan pada tiap jalur dirikan persegi panjang yang tingginya adalah $f$ pada ujung **kiri** jalur itu.\n\nUntuk $f(x) = x^2 + 1$, ujung-ujung kirinya adalah $x = 0, 0.5, 1, 1.5$, memberi tinggi $1, 1.25, 2, 3.25$. Tiap persegi panjang punya luas yang bisa dihitung (lebar kali tinggi), dan menjumlahkan keempatnya:\n$$L_4 = 0.5(1 + 1.25 + 2 + 3.25) = 0.5(7.5) = 3.75$$\nIni adalah **jumlah Riemann kiri** — sebuah hampiran, sebab persegi panjangnya bisa kurang atau lebih dari daerah melengkung yang sebenarnya pada tiap jalur.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.5, 0], [0.5, 1], [0, 1]], color: 'muted' },
                  { t: 'poly', pts: [[0.5, 0], [1, 0], [1, 1.25], [0.5, 1.25]], color: 'muted' },
                  { t: 'poly', pts: [[1, 0], [1.5, 0], [1.5, 2], [1, 2]], color: 'muted' },
                  { t: 'poly', pts: [[1.5, 0], [2, 0], [2, 3.25], [1.5, 3.25]], color: 'muted' },
                  { t: 'curve', f: 'x^2+1', from: 0, to: 2, color: 'a' },
                ],
                caption: {
                  en: 'Four left-endpoint rectangles under $f(x) = x^2 + 1$ on $[0, 2]$ — each rectangle sits below the curve across its strip, since $f$ is increasing.',
                  id: 'Empat persegi panjang ujung-kiri di bawah $f(x) = x^2 + 1$ pada $[0, 2]$ — tiap persegi panjang berada di bawah kurva sepanjang jalurnya, sebab $f$ sedang naik.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Right endpoints, and a better compromise', id: 'Ujung kanan, dan kompromi yang lebih baik' },
              body: {
                en: 'Using the **right** endpoint of each strip instead — $x = 0.5, 1, 1.5, 2$, heights $1.25, 2, 3.25, 5$ — gives the **right Riemann sum**:\n$$R_4 = 0.5(1.25 + 2 + 3.25 + 5) = 0.5(11.5) = 5.75$$\nSince $f$ is increasing, left rectangles sit entirely under the curve (an underestimate) and right rectangles entirely over it (an overestimate) — the true area is trapped between $3.75$ and $5.75$.\n\nThe **midpoint sum** uses the middle of each strip — $x = 0.25, 0.75, 1.25, 1.75$, heights $1.0625, 1.5625, 2.5625, 4.0625$:\n$$M_4 = 0.5(1.0625 + 1.5625 + 2.5625 + 4.0625) = 0.5(9.25) = 4.625$$\nletting each rectangle overshoot on one side and undershoot on the other, which is why the midpoint sum usually lands closer to the true value than either one-sided sum.',
                id: 'Memakai ujung **kanan** tiap jalur sebagai gantinya — $x = 0.5, 1, 1.5, 2$, tinggi $1.25, 2, 3.25, 5$ — memberi **jumlah Riemann kanan**:\n$$R_4 = 0.5(1.25 + 2 + 3.25 + 5) = 0.5(11.5) = 5.75$$\nKarena $f$ sedang naik, persegi panjang kiri seluruhnya berada di bawah kurva (sebuah taksiran kurang) dan persegi panjang kanan seluruhnya di atasnya (sebuah taksiran lebih) — luas sebenarnya terjebak di antara $3.75$ dan $5.75$.\n\n**Jumlah titik tengah** memakai tengah tiap jalur — $x = 0.25, 0.75, 1.25, 1.75$, tinggi $1.0625, 1.5625, 2.5625, 4.0625$:\n$$M_4 = 0.5(1.0625 + 1.5625 + 2.5625 + 4.0625) = 0.5(9.25) = 4.625$$\nmembiarkan tiap persegi panjang lebih di satu sisi dan kurang di sisi lain, itulah sebabnya jumlah titik tengah biasanya mendarat lebih dekat ke nilai sebenarnya dibanding jumlah satu sisi mana pun.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For an increasing function, why does the left Riemann sum always underestimate the true area?',
                id: 'Untuk fungsi yang sedang naik, mengapa jumlah Riemann kiri selalu meremehkan luas sebenarnya?',
              },
              options: [
                { en: 'Each rectangle uses the smallest height on its strip, since the function is lowest at the left end', id: 'Tiap persegi panjang memakai tinggi terkecil pada jalurnya, sebab fungsinya paling rendah di ujung kiri' },
                { en: 'Rectangles always overestimate area regardless of the function', id: 'Persegi panjang selalu meremehkan lebih luas terlepas dari fungsinya' },
                { en: 'The left sum uses fewer strips than the right sum', id: 'Jumlah kiri memakai jalur lebih sedikit dibanding jumlah kanan' },
                { en: 'It does not — left and right sums always agree exactly', id: 'Tidak — jumlah kiri dan kanan selalu sama persis' },
              ],
              answer: 0,
              explain: {
                en: 'On an increasing function, the left endpoint of every strip gives the smallest value the function takes there, so every rectangle sits entirely under the curve — the sum can only fall short.',
                id: 'Pada fungsi yang sedang naik, ujung kiri tiap jalur memberi nilai terkecil yang diambil fungsi di situ, sehingga tiap persegi panjang seluruhnya berada di bawah kurva — jumlahnya hanya bisa kurang.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, on the strip from $x = 1$ to $x = 1.5$, what height does the left-endpoint rectangle use?',
                id: 'Dengan membaca gambar di atas, pada jalur dari $x = 1$ sampai $x = 1.5$, tinggi berapa yang dipakai persegi panjang ujung-kiri?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0.5, 0], [0.5, 1], [0, 1]], color: 'muted' },
                  { t: 'poly', pts: [[0.5, 0], [1, 0], [1, 1.25], [0.5, 1.25]], color: 'muted' },
                  { t: 'poly', pts: [[1, 0], [1.5, 0], [1.5, 2], [1, 2]], color: 'muted' },
                  { t: 'poly', pts: [[1.5, 0], [2, 0], [2, 3.25], [1.5, 3.25]], color: 'muted' },
                  { t: 'curve', f: 'x^2+1', from: 0, to: 2, color: 'a' },
                ],
              },
              options: [
                { en: '$2$', id: '$2$' },
                { en: '$3.25$', id: '$3.25$' },
                { en: '$1.25$', id: '$1.25$' },
                { en: '$1$', id: '$1$' },
              ],
              answer: 0,
              explain: {
                en: 'The left endpoint of that strip is $x = 1$, and $f(1) = 1^2 + 1 = 2$ — matching the third rectangle\'s visible height.',
                id: 'Ujung kiri jalur itu adalah $x = 1$, dan $f(1) = 1^2 + 1 = 2$ — cocok dengan tinggi persegi panjang ketiga yang tampak.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $g(x) = x^2$ on $[0, 2]$ split into $n = 4$ strips, compute the left sum $L_4$ and the right sum $R_4$.',
                id: 'Untuk $g(x) = x^2$ pada $[0, 2]$ dibagi menjadi $n = 4$ jalur, hitung jumlah kiri $L_4$ dan jumlah kanan $R_4$.',
              },
              blanks: [
                { label: 'L_4 =', answer: 1.75 },
                { label: 'R_4 =', answer: 3.75 },
              ],
              hints: [
                { en: 'Width $= 0.5$. Left heights at $x = 0, 0.5, 1, 1.5$; right heights at $x = 0.5, 1, 1.5, 2$.', id: 'Lebar $= 0.5$. Tinggi kiri di $x = 0, 0.5, 1, 1.5$; tinggi kanan di $x = 0.5, 1, 1.5, 2$.' },
              ],
              explain: {
                en: '$L_4 = 0.5(0 + 0.25 + 1 + 2.25) = 1.75$. $R_4 = 0.5(0.25 + 1 + 2.25 + 4) = 3.75$.',
                id: '$L_4 = 0,5(0 + 0,25 + 1 + 2,25) = 1,75$. $R_4 = 0,5(0,25 + 1 + 2,25 + 4) = 3,75$.',
              },
            },
          ],
        },
        {
          id: 'int-m2-s1-l2',
          title: { en: 'The Definite Integral as a Limit of Sums', id: 'Integral Tentu sebagai Limit Jumlah' },
          goal: {
            en: 'Define the definite integral as the limit of Riemann sums as the number of strips grows without bound, and use its basic properties.',
            id: 'Mendefinisikan integral tentu sebagai limit jumlah Riemann ketika banyak jalurnya bertambah tanpa batas, dan memakai sifat-sifat dasarnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'More strips, less error, and a limit that settles it', id: 'Lebih banyak jalur, lebih sedikit galat, dan limit yang menuntaskannya' },
              body: {
                en: 'As $n \\to \\infty$, every strip narrows, and the gap between over- and under-estimate shrinks to nothing — left, right, and midpoint sums all converge to the same number. That common limit is the **definite integral**:\n$$\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i)\\,\\Delta x$$\nread "the integral from $a$ to $b$ of $f$" — a single real number, the exact area (when $f \\geq 0$), not an approximation. This is the same $\\int \\cdots dx$ symbol Module 1 used loosely; now it has bounds attached and a precise meaning: $a$ and $b$ are the **limits of integration**, and $\\Delta x = \\frac{b-a}{n}$.',
                id: 'Ketika $n \\to \\infty$, tiap jalur menyempit, dan celah antara taksiran lebih dan kurang menyusut menjadi nol — jumlah kiri, kanan, dan titik tengah semuanya konvergen ke bilangan yang sama. Limit bersama itu adalah **integral tentu**:\n$$\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i)\\,\\Delta x$$\ndibaca "integral dari $a$ sampai $b$ dari $f$" — satu bilangan real, luas eksak (ketika $f \\geq 0$), bukan hampiran. Ini simbol $\\int \\cdots dx$ yang sama yang dipakai Modul 1 secara longgar; kini ia punya batas yang terpasang dan makna yang persis: $a$ dan $b$ adalah **batas integrasi**, dan $\\Delta x = \\frac{b-a}{n}$.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                params: [{ name: 'n', min: 2, max: 40, step: 1, value: 4, label: 'n' }],
                items: [
                  { t: 'curve', f: '(floor(x*n/2)*(2/n))^2+1', from: 0, to: 1.999, color: 'result', label: 'staircase' },
                  { t: 'curve', f: 'x^2+1', from: 0, to: 2, color: 'a' },
                ],
                caption: {
                  en: 'Drag $n$ up: the left-endpoint staircase hugs the smooth curve tighter with every extra strip, converging to the exact area — the value of the definite integral.',
                  id: 'Geser $n$ ke atas: tangga ujung-kiri merapat semakin ketat ke kurva yang mulus di setiap jalur tambahan, konvergen ke luas eksak — nilai integral tentunya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Properties that follow directly from the definition', id: 'Sifat yang langsung mengikuti definisinya' },
              body: {
                en: 'A handful of facts fall straight out of summing rectangles:\n$$\\int_a^b \\big(f(x) \\pm g(x)\\big)\\,dx = \\int_a^b f(x)\\,dx \\pm \\int_a^b g(x)\\,dx, \\qquad \\int_a^b k\\,f(x)\\,dx = k\\int_a^b f(x)\\,dx$$\n$$\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx \\quad (a < c < b), \\qquad \\int_a^a f(x)\\,dx = 0$$\nAnd when $f$ dips below the axis, the rectangles there have negative height, so that stretch subtracts from the total rather than adding to it — a definite integral measures **signed** area, not raw area. Reversing the bounds flips the sign: $\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx$.',
                id: 'Segenggam fakta langsung keluar dari menjumlahkan persegi panjang:\n$$\\int_a^b \\big(f(x) \\pm g(x)\\big)\\,dx = \\int_a^b f(x)\\,dx \\pm \\int_a^b g(x)\\,dx, \\qquad \\int_a^b k\\,f(x)\\,dx = k\\int_a^b f(x)\\,dx$$\n$$\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx \\quad (a < c < b), \\qquad \\int_a^a f(x)\\,dx = 0$$\nDan ketika $f$ turun di bawah sumbu, persegi panjang di situ bertinggi negatif, sehingga bagian itu mengurangi totalnya alih-alih menambahkannya — integral tentu mengukur luas **bertanda**, bukan luas mentah. Membalik batasnya membalik tandanya: $\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $f(x) < 0$ on all of $[a, b]$, what does the definite integral of $f$ from $a$ to $b$ represent?',
                id: 'Jika $f(x) < 0$ di seluruh $[a, b]$, apa yang direpresentasikan integral tentu $f$ dari $a$ sampai $b$?',
              },
              options: [
                { en: 'The negative of the area between the curve and the x-axis', id: 'Negatif dari luas antara kurva dan sumbu-x' },
                { en: 'Exactly the same as if $f$ were positive there', id: 'Persis sama seperti bila $f$ positif di situ' },
                { en: 'Zero, since a negative function has no area', id: 'Nol, sebab fungsi negatif tak punya luas' },
                { en: 'It is undefined whenever $f$ dips below the axis', id: 'Tak terdefinisi setiap kali $f$ turun di bawah sumbu' },
              ],
              answer: 0,
              explain: {
                en: 'Every rectangle has negative height there, so the Riemann sum comes out negative — the magnitude is the raw area, but the sign is negative because the region sits below the axis.',
                id: 'Tiap persegi panjang bertinggi negatif di situ, sehingga jumlah Riemannya keluar negatif — besarnya adalah luas mentahnya, tetapi tandanya negatif sebab daerahnya berada di bawah sumbu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the property used to split an integral at an interior point.',
                id: 'Lengkapi sifat yang dipakai untuk memecah integral pada titik di dalamnya.',
              },
              template: '\\int_1^5 f(x)\\,dx = \\int_1^c f(x)\\,dx + \\int_c^5 f(x)\\,dx, \\quad c = ___',
              blanks: ['3'],
              explain: {
                en: 'Any interior point works for the split — $3$ is one choice, and the same $c$ has to appear as the upper bound of the first piece and the lower bound of the second for them to reassemble correctly.',
                id: 'Titik di dalamnya mana pun berlaku untuk pemecahannya — $3$ adalah salah satu pilihan, dan $c$ yang sama harus muncul sebagai batas atas bagian pertama dan batas bawah bagian kedua agar keduanya tersusun kembali dengan benar.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Given that $\\int_0^5 f(x)\\,dx = 12$ and $\\int_3^5 f(x)\\,dx = 4$, find $\\int_0^3 f(x)\\,dx$.',
                id: 'Diberikan $\\int_0^5 f(x)\\,dx = 12$ dan $\\int_3^5 f(x)\\,dx = 4$, cari $\\int_0^3 f(x)\\,dx$.',
              },
              blanks: [{ answer: 8 }],
              hints: [
                { en: 'Use the splitting property: $\\int_0^5 = \\int_0^3 + \\int_3^5$.', id: 'Pakai sifat pemecahan: $\\int_0^5 = \\int_0^3 + \\int_3^5$.' },
              ],
              explain: {
                en: '$12 = \\int_0^3 f(x)\\,dx + 4$, so $\\int_0^3 f(x)\\,dx = 8$.',
                id: '$12 = \\int_0^3 f(x)\\,dx + 4$, sehingga $\\int_0^3 f(x)\\,dx = 8$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m2-s1-p',
        runtime: 'math',
        title: { en: 'Sums, Limits, and Signed Area', id: 'Jumlah, Limit, dan Luas Bertanda' },
        brief: {
          en: 'A Riemann sum, a splitting property, and a signed-area integral.',
          id: 'Satu jumlah Riemann, satu sifat pemecahan, dan satu integral luas bertanda.',
        },
        requirements: [
          { en: 'A left sum uses left endpoints for height; a right sum uses right endpoints.', id: 'Jumlah kiri memakai ujung kiri untuk tinggi; jumlah kanan memakai ujung kanan.' },
          { en: 'A region below the x-axis contributes negatively to a definite integral.', id: 'Daerah di bawah sumbu-x menyumbang negatif pada integral tentu.' },
        ],
        tasks: [
          {
            prompt: { en: 'For $h(x) = 2x$ on $[0, 4]$ with $n = 4$ strips, compute the right sum $R_4$.', id: 'Untuk $h(x) = 2x$ pada $[0, 4]$ dengan $n = 4$ jalur, hitung jumlah kanan $R_4$.' },
            blanks: [{ answer: 20 }],
            solution: ['\\Delta x = 1, \\text{ right heights at } x=1,2,3,4: 2,4,6,8', 'R_4 = 1(2+4+6+8) = 20'],
          },
          {
            prompt: { en: 'Given $\\int_2^8 f(x)\\,dx = 30$ and $\\int_2^5 f(x)\\,dx = 11$, find $\\int_5^8 f(x)\\,dx$.', id: 'Diberikan $\\int_2^8 f(x)\\,dx = 30$ dan $\\int_2^5 f(x)\\,dx = 11$, cari $\\int_5^8 f(x)\\,dx$.' },
            blanks: [{ answer: 19 }],
            solution: ['30 = 11 + \\int_5^8 f(x)\\,dx \\Rightarrow \\int_5^8 f(x)\\,dx = 19'],
          },
          {
            prompt: { en: 'A region below the x-axis has raw area $7$. What is the value of the definite integral over that region?', id: 'Sebuah daerah di bawah sumbu-x punya luas mentah $7$. Berapa nilai integral tentu pada daerah itu?' },
            blanks: [{ answer: -7 }],
            solution: ['\\text{signed area} = -(\\text{raw area}) = -7'],
          },
        ],
        hints: [
          { en: 'Part 3 is asking for the signed value, not the raw area itself.', id: 'Butir 3 menanyakan nilai bertandanya, bukan luas mentahnya sendiri.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------- 2.2 the fundamental theorem */
    {
      id: 'int-m2-s2',
      title: { en: 'The Fundamental Theorem of Calculus', id: 'Teorema Dasar Kalkulus' },
      summary: {
        en: 'The theorem that ties the definite integral back to antidifferentiation, in both of its two parts.',
        id: 'Teorema yang mengaitkan kembali integral tentu ke antiturunan, dalam kedua bagiannya.',
      },
      lessons: [
        {
          id: 'int-m2-s2-l1',
          title: { en: 'FTC Part 1: Differentiating an Accumulation', id: 'TDK Bagian 1: Menurunkan Akumulasi' },
          goal: {
            en: 'Differentiate a function defined by an integral with a variable upper bound, and extend it with the chain rule.',
            id: 'Menurunkan fungsi yang didefinisikan oleh integral dengan batas atas peubah, dan memperluasnya dengan aturan rantai.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A running total, differentiated', id: 'Total yang berjalan, diturunkan' },
              body: {
                en: 'Let $x$ be the *upper* limit of integration itself, giving an **accumulation function**:\n$$A(x) = \\int_a^x f(t)\\,dt$$\n$A(x)$ is the running total of signed area swept out from $a$ up to $x$ — a genuine function of $x$, since changing $x$ changes how much has accumulated. The **Fundamental Theorem of Calculus, Part 1** says its derivative is remarkably simple:\n$$\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$$\nDifferentiating an accumulation just gives back the rate that was being accumulated — the same relationship as position and velocity, generalised to any $f$ at all. For $A(x) = \\int_0^x t^2\\,dt$: $A\'(x) = x^2$, with no need to ever compute the integral itself.',
                id: 'Misalkan $x$ sendiri adalah batas integrasi *atas*, memberi **fungsi akumulasi**:\n$$A(x) = \\int_a^x f(t)\\,dt$$\n$A(x)$ adalah total berjalan dari luas bertanda yang disapu dari $a$ sampai $x$ — fungsi $x$ yang sungguhan, sebab mengubah $x$ mengubah berapa banyak yang sudah terakumulasi. **Teorema Dasar Kalkulus, Bagian 1** menyatakan turunannya sangat sederhana:\n$$\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$$\nMenurunkan sebuah akumulasi hanya mengembalikan laju yang sedang diakumulasi — hubungan yang sama seperti posisi dan kecepatan, digeneralisasi ke $f$ apa pun. Untuk $A(x) = \\int_0^x t^2\\,dt$: $A\'(x) = x^2$, tanpa perlu pernah menghitung integralnya sendiri.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.5, 4],
                ySpan: [-0.5, 4.5],
                ticks: true,
                params: [{ name: 'x0', min: 0.2, max: 3.5, step: 0.1, value: 2, label: 'x' }],
                items: [
                  { t: 'curve', f: 'x', from: 0, to: 4, color: 'a', label: 'f(t) = t' },
                  { t: 'vline', x: 'x0', color: 'b', dashed: true },
                  { t: 'dot', x: 'x0', y: 'x0', color: 'result', label: 'A(x)' },
                ],
                caption: {
                  en: 'Drag $x$ right: the triangular area swept out from $0$ to $x$ under $f(t)=t$ keeps growing — that growing area *is* $A(x) = \\int_0^x t\\,dt = x^2/2$, plotted at nothing but the dashed line itself.',
                  id: 'Geser $x$ ke kanan: luas segitiga yang disapu dari $0$ sampai $x$ di bawah $f(t)=t$ terus bertambah — luas yang bertambah itulah $A(x) = \\int_0^x t\\,dt = x^2/2$, terbaca tepat di garis putus-putusnya sendiri.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A variable bound that is itself a function', id: 'Batas peubah yang sendiri adalah sebuah fungsi' },
              body: {
                en: 'When the upper bound is a function of $x$ rather than $x$ itself, the chain rule attaches exactly as it did throughout the Derivatives course:\n$$\\frac{d}{dx}\\int_a^{g(x)} f(t)\\,dt = f\\big(g(x)\\big)\\cdot g\'(x)$$\nFor $A(x) = \\int_0^{x^2} \\sin t\\,dt$: the outer function is "integrate up to here", the inner is $g(x) = x^2$. So $A\'(x) = \\sin(x^2)\\cdot 2x$ — evaluate the integrand at the bound, then multiply by the bound\'s own derivative.',
                id: 'Ketika batas atasnya adalah fungsi dari $x$, bukan $x$ itu sendiri, aturan rantai terpasang persis seperti sepanjang kursus Turunan:\n$$\\frac{d}{dx}\\int_a^{g(x)} f(t)\\,dt = f\\big(g(x)\\big)\\cdot g\'(x)$$\nUntuk $A(x) = \\int_0^{x^2} \\sin t\\,dt$: fungsi luarnya adalah "integralkan sampai di sini", fungsi dalamnya $g(x) = x^2$. Jadi $A\'(x) = \\sin(x^2)\\cdot 2x$ — evaluasi integrandnya pada batasnya, lalu kalikan dengan turunan batas itu sendiri.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\frac{d}{dx}$ of $\\int_2^x (t^3 + 1)\\,dt$?',
                id: 'Berapakah $\\frac{d}{dx}$ dari $\\int_2^x (t^3 + 1)\\,dt$?',
              },
              options: [
                { en: '$x^3 + 1$', id: '$x^3 + 1$' },
                { en: '$x^4/4 + x$', id: '$x^4/4 + x$' },
                { en: '$3x^2$', id: '$3x^2$' },
                { en: '$0$, since the bounds are fixed', id: '$0$, sebab batasnya tetap' },
              ],
              answer: 0,
              explain: {
                en: 'FTC Part 1 says the derivative of an accumulation is just the integrand evaluated at $x$ — no need to antidifferentiate first.',
                id: 'TDK Bagian 1 menyatakan turunan sebuah akumulasi hanyalah integrandnya yang dievaluasi di $x$ — tak perlu mengantiturunkan lebih dahulu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What extra factor appears when differentiating $\\int_0^{x^3} \\cos(t)\\,dt$?',
                id: 'Faktor tambahan apa yang muncul saat menurunkan $\\int_0^{x^3} \\cos(t)\\,dt$?',
              },
              options: [
                { en: '$3x^2$, the derivative of the upper bound', id: '$3x^2$, turunan dari batas atasnya' },
                { en: 'No extra factor — it is just $\\cos(x^3)$', id: 'Tak ada faktor tambahan — hanya $\\cos(x^3)$' },
                { en: '$\\sin(x^3)$, from differentiating cosine', id: '$\\sin(x^3)$, dari menurunkan cosinus' },
                { en: '$1/(3x^2)$, from a supposed quotient rule', id: '$1/(3x^2)$, dari aturan hasil bagi yang keliru' },
              ],
              answer: 0,
              explain: {
                en: 'The upper bound $x^3$ is a function of $x$, so the chain rule attaches its own derivative, $3x^2$, as a multiplying factor: $\\frac{d}{dx} = \\cos(x^3) \\cdot 3x^2$.',
                id: 'Batas atasnya $x^3$ adalah fungsi dari $x$, sehingga aturan rantai memasang turunannya sendiri, $3x^2$, sebagai faktor pengali: $\\frac{d}{dx} = \\cos(x^3) \\cdot 3x^2$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $A(x) = \\int_1^{x^2} 2t\\,dt$. Find $A\'(x)$ and evaluate it at $x = 2$.',
                id: 'Misalkan $A(x) = \\int_1^{x^2} 2t\\,dt$. Cari $A\'(x)$ dan hitung nilainya di $x = 2$.',
              },
              blanks: [{ label: "A'(2) =", answer: 32 }],
              hints: [
                { en: "$A'(x) = 2(x^2) \\cdot 2x = 4x^3$.", id: "$A'(x) = 2(x^2) \\cdot 2x = 4x^3$." },
              ],
              explain: {
                en: "$A'(x) = f(g(x)) \\cdot g'(x) = 2(x^2) \\cdot 2x = 4x^3$. $A'(2) = 4(8) = 32$.",
                id: "$A'(x) = f(g(x)) \\cdot g'(x) = 2(x^2) \\cdot 2x = 4x^3$. $A'(2) = 4(8) = 32$.",
              },
            },
          ],
        },
        {
          id: 'int-m2-s2-l2',
          title: { en: 'FTC Part 2: Evaluating a Definite Integral', id: 'TDK Bagian 2: Menghitung Integral Tentu' },
          goal: {
            en: 'Evaluate a definite integral exactly using any antiderivative of the integrand, without ever taking a limit of sums.',
            id: 'Menghitung integral tentu secara eksak memakai antiturunan mana pun dari integrandnya, tanpa pernah mengambil limit jumlah.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The theorem that makes Module 1 worth having built', id: 'Teorema yang membuat Modul 1 berharga untuk dibangun' },
              body: {
                en: 'The **Fundamental Theorem of Calculus, Part 2** (the **Evaluation Theorem**) says: if $F$ is *any* antiderivative of $f$,\n$$\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[F(x)\\Big]_a^b$$\nThe $+C$ from Module 1 is irrelevant here — it cancels: $\\big(F(b)+C\\big) - \\big(F(a)+C\\big) = F(b) - F(a)$, so the simplest antiderivative (with $C=0$) always suffices. This is the bridge between an infinite limit of rectangles and a two-value subtraction: for $\\int_0^2 (x^2+1)\\,dx$, take $F(x) = \\frac{x^3}{3} + x$:\n$$\\left[\\frac{x^3}{3}+x\\right]_0^2 = \\left(\\frac{8}{3}+2\\right) - (0+0) = \\frac{14}{3} \\approx 4.667$$\nexactly the number the left, right, and midpoint sums from the previous lesson were all closing in on.',
                id: '**Teorema Dasar Kalkulus, Bagian 2** (**Teorema Evaluasi**) menyatakan: jika $F$ adalah antiturunan *mana pun* dari $f$,\n$$\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[F(x)\\Big]_a^b$$\n$+C$ dari Modul 1 tak relevan di sini — ia saling meniadakan: $\\big(F(b)+C\\big) - \\big(F(a)+C\\big) = F(b) - F(a)$, sehingga antiturunan paling sederhana (dengan $C=0$) selalu cukup. Inilah jembatan antara limit jumlah persegi panjang yang tak terhingga dan pengurangan dua nilai: untuk $\\int_0^2 (x^2+1)\\,dx$, ambil $F(x) = \\frac{x^3}{3} + x$:\n$$\\left[\\frac{x^3}{3}+x\\right]_0^2 = \\left(\\frac{8}{3}+2\\right) - (0+0) = \\frac{14}{3} \\approx 4.667$$\npersis bilangan yang didekati jumlah kiri, kanan, dan titik tengah pada pelajaran sebelumnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 2.5],
                ySpan: [-0.5, 5.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0, 1], [0.25, 1.0625], [0.5, 1.25], [0.75, 1.5625], [1, 2], [1.25, 2.5625], [1.5, 3.25], [1.75, 4.0625], [2, 5], [2, 0]], color: 'result' },
                  { t: 'curve', f: 'x^2+1', from: 0, to: 2, color: 'a' },
                ],
                caption: {
                  en: 'The exact area of this shaded region — approximated by rectangles last lesson — is exactly $14/3$, computed here in one subtraction.',
                  id: 'Luas eksak daerah bayangan ini — dihampiri persegi panjang pada pelajaran sebelumnya — persis $14/3$, dihitung di sini dalam satu pengurangan.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Worked in full: a trigonometric example', id: 'Dikerjakan tuntas: contoh trigonometri' },
              body: {
                en: 'Evaluate $\\int_0^{\\pi/2} \\cos x\\,dx$. An antiderivative is $F(x) = \\sin x$:\n$$\\Big[\\sin x\\Big]_0^{\\pi/2} = \\sin\\frac{\\pi}{2} - \\sin 0 = 1 - 0 = 1$$\nThe whole process is two steps: antidifferentiate (Module 1\'s skill), then subtract (arithmetic) — the definite integral of a familiar function is now a mechanical calculation, never a limit taken by hand again.',
                id: 'Hitung $\\int_0^{\\pi/2} \\cos x\\,dx$. Sebuah antiturunannya adalah $F(x) = \\sin x$:\n$$\\Big[\\sin x\\Big]_0^{\\pi/2} = \\sin\\frac{\\pi}{2} - \\sin 0 = 1 - 0 = 1$$\nSeluruh prosesnya dua langkah: antiturunkan (keterampilan Modul 1), lalu kurangkan (aritmetika) — integral tentu dari fungsi yang dikenal kini adalah penghitungan mekanis, tak pernah lagi limit yang diambil dengan tangan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does the arbitrary constant $C$ never matter when evaluating a definite integral?',
                id: 'Mengapa konstanta sebarang $C$ tak pernah berpengaruh saat menghitung integral tentu?',
              },
              options: [
                { en: 'It appears in both $F(b)$ and $F(a)$ and cancels in the subtraction', id: 'Ia muncul di $F(b)$ maupun $F(a)$ dan saling meniadakan pada pengurangannya' },
                { en: '$C$ is always exactly zero for a definite integral', id: '$C$ selalu tepat nol untuk integral tentu' },
                { en: 'Definite integrals do not require an antiderivative at all', id: 'Integral tentu sama sekali tak memerlukan antiturunan' },
                { en: 'It matters, and must be found using an initial condition first', id: 'Ia berpengaruh, dan harus dicari memakai syarat awal lebih dahulu' },
              ],
              answer: 0,
              explain: {
                en: '$(F(b) + C) - (F(a) + C) = F(b) - F(a)$: the two $C$ terms are identical and subtract away, so any antiderivative — including the simplest one with $C = 0$ — gives the same final number.',
                id: '$(F(b) + C) - (F(a) + C) = F(b) - F(a)$: kedua suku $C$-nya identik dan saling menghilang lewat pengurangan, sehingga antiturunan mana pun — termasuk yang paling sederhana dengan $C = 0$ — memberi bilangan akhir yang sama.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that evaluate $\\int_1^3 2x\\,dx$.',
                id: 'Susun langkah yang menghitung $\\int_1^3 2x\\,dx$.',
              },
              lines: [
                '\\int_1^3 2x\\,dx',
                '= \\Big[x^2\\Big]_1^3',
                '= 3^2 - 1^2',
                '= 8',
              ],
              explain: {
                en: 'Antidifferentiate first (an antiderivative of $2x$ is $x^2$), write the evaluation bracket, substitute both bounds, then subtract.',
                id: 'Antiturunkan lebih dahulu (antiturunan dari $2x$ adalah $x^2$), tulis kurung evaluasinya, substitusikan kedua batasnya, lalu kurangkan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_0^2 (3x^2 - 2x)\\,dx$.',
                id: 'Hitung $\\int_0^2 (3x^2 - 2x)\\,dx$.',
              },
              blanks: [{ answer: 4 }],
              hints: [
                { en: 'An antiderivative is $F(x) = x^3 - x^2$.', id: 'Sebuah antiturunannya adalah $F(x) = x^3 - x^2$.' },
              ],
              explain: {
                en: '$F(2) - F(0) = (8 - 4) - (0 - 0) = 4$.',
                id: '$F(2) - F(0) = (8 - 4) - (0 - 0) = 4$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m2-s2-p',
        runtime: 'math',
        title: { en: 'Applying the Fundamental Theorem', id: 'Menerapkan Teorema Dasar' },
        brief: {
          en: 'One accumulation-function derivative, and two definite integrals evaluated by antidifferentiation.',
          id: 'Satu turunan fungsi akumulasi, dan dua integral tentu dihitung lewat antiturunan.',
        },
        requirements: [
          { en: 'FTC Part 1 differentiates an accumulation back to the integrand — no antiderivative needed.', id: 'TDK Bagian 1 menurunkan sebuah akumulasi kembali ke integrandnya — tak perlu antiturunan.' },
          { en: 'FTC Part 2 evaluates a definite integral as $F(b)$ minus $F(a)$, for any antiderivative $F$.', id: 'TDK Bagian 2 menghitung integral tentu sebagai $F(b)$ dikurangi $F(a)$, untuk antiturunan $F$ mana pun.' },
        ],
        tasks: [
          {
            prompt: { en: 'Let $A(x) = \\int_0^{x^2} 3t^2\\,dt$. Find $A\'(x)$ and evaluate it at $x = 1$.', id: 'Misalkan $A(x) = \\int_0^{x^2} 3t^2\\,dt$. Cari $A\'(x)$ dan hitung nilainya di $x = 1$.' },
            blanks: [{ answer: 6 }],
            solution: ["A'(x) = 3(x^2)^2 \\cdot 2x = 6x^5, \\quad A'(1) = 6"],
          },
          {
            prompt: { en: 'Evaluate $\\int_1^4 \\sqrt{x}\\,dx$. (Round to two decimal places.)', id: 'Hitung $\\int_1^4 \\sqrt{x}\\,dx$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 4.67 }],
            solution: ['F(x) = \\tfrac23 x^{3/2}, \\quad F(4)-F(1) = \\tfrac23(8) - \\tfrac23(1) = \\tfrac{14}{3} \\approx 4{,}67'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^\\pi \\sin(x)\\,dx$.', id: 'Hitung $\\int_0^\\pi \\sin(x)\\,dx$.' },
            blanks: [{ answer: 2 }],
            solution: ['F(x) = -\\cos x, \\quad F(\\pi)-F(0) = -(-1) - (-1) = 2'],
          },
        ],
        hints: [
          { en: 'Part 3: $\\cos(\\pi) = -1$ and $\\cos(0) = 1$ — watch the double negative.', id: 'Butir 3: $\\cos(\\pi) = -1$ dan $\\cos(0) = 1$ — perhatikan negatif gandanya.' },
        ],
        xp: 50,
      },
    },
  ],
}
