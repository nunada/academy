import type { Module } from '../types'

/** Module 2 — two ways to settle a series without ever finding a closed form
 *  for its partial sums: comparing it to an integral (Techniques of
 *  Integration's own improper integrals, reused directly), or comparing it to
 *  another series already known to converge or diverge. */
export const module2: Module = {
  id: 'der-m2',
  title: { en: 'The Integral Test and Comparison Tests', id: 'Uji Integral dan Uji Perbandingan' },
  summary: {
    en: 'Settling convergence without a closed form for the partial sums — by comparing a series to an improper integral, or to another series already known.',
    id: 'Menuntaskan konvergensi tanpa bentuk tertutup untuk jumlah parsialnya — dengan membandingkan sebuah deret terhadap integral tak wajar, atau terhadap deret lain yang sudah diketahui.',
  },
  submodules: [
    /* ------------------------------------------------------------ 9.3 the integral test */
    {
      id: 'der-m2-s1',
      title: { en: 'The Integral Test', id: 'Uji Integral' },
      summary: {
        en: 'A series of positive, decreasing terms converges exactly when the matching improper integral does — settling the p-series and the harmonic series at once.',
        id: 'Deret dengan suku positif dan menurun konvergen persis ketika integral tak wajar yang sepadan konvergen — menuntaskan deret-p dan deret harmonik sekaligus.',
      },
      lessons: [
        {
          id: 'der-m2-s1-l1',
          title: { en: 'Comparing a Sum to an Area', id: 'Membandingkan Jumlah dengan Luas' },
          goal: {
            en: 'State the Integral Test and see why it links a series to the same improper integral already studied.',
            id: 'Menyatakan Uji Integral dan melihat mengapa ia mengaitkan deret dengan integral tak wajar yang sudah dipelajari.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Rectangles under a curve, again', id: 'Persegi panjang di bawah kurva, lagi' },
              body: {
                en: 'Let $f$ be positive, continuous, and decreasing on $[1,\\infty)$, with $a_n=f(n)$. Stacking a rectangle of width $1$ and height $a_n$ over each interval $[n,n+1]$, the picture is identical to the left- and right-endpoint sums from the Integrals course — except the curve never ends. Since $f$ is decreasing, the rectangle heights $a_1,a_2,\\ldots$ sit **above** the curve on $[1,\\infty)$, so\n$$\\int_1^\\infty f(x)\\,dx \\ \\leq \\ \\sum_{n=1}^\\infty a_n$$\nand shifting the rectangles one step gives the reverse bound with $a_1$ set aside. Squeezed between an area and a sum built the same way, the two share the same fate:\n$$\\mathbf{\\text{the Integral Test: }} \\sum_{n=1}^\\infty a_n \\text{ converges} \\iff \\int_1^\\infty f(x)\\,dx \\text{ converges}$$',
                id: 'Misalkan $f$ positif, sinambung, dan menurun pada $[1,\\infty)$, dengan $a_n=f(n)$. Menumpuk persegi panjang berlebar $1$ dan tinggi $a_n$ di atas tiap interval $[n,n+1]$, gambarannya identik dengan jumlah ujung-kiri dan ujung-kanan dari kursus Integral — kecuali kurvanya tak pernah berakhir. Karena $f$ menurun, tinggi persegi panjang $a_1,a_2,\\ldots$ duduk **di atas** kurva pada $[1,\\infty)$, sehingga\n$$\\int_1^\\infty f(x)\\,dx \\ \\leq \\ \\sum_{n=1}^\\infty a_n$$\ndan menggeser persegi panjangnya satu langkah memberi batas sebaliknya dengan $a_1$ disisihkan. Terjepit di antara sebuah luas dan sebuah jumlah yang dibangun dengan cara yang sama, keduanya berbagi nasib yang sama:\n$$\\mathbf{\\text{Uji Integral: }} \\sum_{n=1}^\\infty a_n \\text{ konvergen} \\iff \\int_1^\\infty f(x)\\,dx \\text{ konvergen}$$',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 8],
                ySpan: [-0.2, 1.3],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.4, to: 8, color: 'a' },
                  { t: 'poly', pts: [[1, 0], [2, 0], [2, 1], [1, 1]], color: 'result' },
                  { t: 'poly', pts: [[2, 0], [3, 0], [3, 0.5], [2, 0.5]], color: 'result' },
                  { t: 'poly', pts: [[3, 0], [4, 0], [4, 0.333], [3, 0.333]], color: 'result' },
                  { t: 'poly', pts: [[4, 0], [5, 0], [5, 0.25], [4, 0.25]], color: 'result' },
                ],
                caption: {
                  en: 'Rectangles of height $a_n=1/n$, one per unit interval, sit entirely above the decreasing curve $y=1/x$ — the same "left sum overestimates a decreasing function" fact from the Integrals course, run out to infinity.',
                  id: 'Persegi panjang bertinggi $a_n=1/n$, satu per interval satuan, seluruhnya duduk di atas kurva menurun $y=1/x$ — fakta "jumlah kiri melebih-taksir fungsi menurun" yang sama dari kursus Integral, dijalankan sampai tak hingga.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The p-series, settled in one line', id: 'Deret-p, dituntaskan dalam satu baris' },
              body: {
                en: 'A **p-series** $\\sum_{n=1}^{\\infty}\\dfrac{1}{n^p}$ matches $f(x)=x^{-p}$, positive and decreasing for $p>0$. The Improper Integrals lesson from the Techniques of Integration course already found\n$$\\int_1^\\infty \\frac{1}{x^p}\\,dx \\text{ converges} \\iff p>1$$\nso by the Integral Test, the p-series does too: **$\\sum \\dfrac{1}{n^p}$ converges exactly when $p>1$.** Nothing new needed to prove it — the improper integral work is simply reused wholesale.',
                id: 'Sebuah **deret-p** $\\sum_{n=1}^{\\infty}\\dfrac{1}{n^p}$ sepadan dengan $f(x)=x^{-p}$, positif dan menurun untuk $p>0$. Pelajaran Integral Tak Wajar dari kursus Teknik Pengintegralan sudah menemukan\n$$\\int_1^\\infty \\frac{1}{x^p}\\,dx \\text{ konvergen} \\iff p>1$$\nsehingga menurut Uji Integral, deret-p pun begitu: **$\\sum \\dfrac{1}{n^p}$ konvergen persis ketika $p>1$.** Tak ada yang baru diperlukan untuk membuktikannya — pekerjaan integral tak wajarnya sekadar dipakai ulang seluruhnya.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 6],
                ySpan: [-0.3, 2],
                ticks: true,
                params: [{ name: 'p', min: 0.2, max: 3, step: 0.1, value: 1.5, label: 'p' }],
                items: [
                  { t: 'curve', f: '1/x', color: 'muted', dashed: true, label: 'p = 1' },
                  { t: 'curve', f: 'x^(-p)', color: 'a', label: 'y = x⁻ᵖ' },
                  { t: 'vline', x: 1, color: 'muted', dashed: true },
                ],
                caption: {
                  en: 'The curve $y=x^{-p}$ for $x\\ge 1$ is the area the improper integral measures. Drag $p$ across $1$: below the dashed $y=1/x$ (for $p>1$) the area out to infinity is finite and the series converges; above it (for $p<1$) the area is infinite and it diverges — exactly the boundary the Techniques of Integration course already drew.',
                  id: 'Kurva $y=x^{-p}$ untuk $x\\ge 1$ adalah luas yang diukur integral tak wajar. Geser $p$ melewati $1$: di bawah garis putus-putus $y=1/x$ (untuk $p>1$) luas hingga tak terhingga itu terhingga dan deretnya konvergen; di atasnya (untuk $p<1$) luasnya tak hingga dan deretnya divergen — persis batas yang sudah digambar kursus Teknik Pengintegralan.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which condition must $f$ satisfy for the Integral Test to apply to $\\sum f(n)$?',
                id: 'Syarat apa yang harus dipenuhi $f$ agar Uji Integral berlaku untuk $\\sum f(n)$?',
              },
              options: [
                { en: 'Positive, continuous, and decreasing on $[1,\\infty)$', id: 'Positif, sinambung, dan menurun pada $[1,\\infty)$' },
                { en: 'Only that $f$ is continuous', id: 'Hanya bahwa $f$ sinambung' },
                { en: '$f$ must be a polynomial', id: '$f$ harus polinom' },
                { en: 'Nothing — it applies to every series', id: 'Tak ada — ia berlaku untuk setiap deret' },
              ],
              answer: 0,
              explain: {
                en: 'Decreasing is what forces the rectangles to sit consistently above (or below) the curve — without it, the sandwich between the integral and the sum breaks down.',
                id: 'Menurun adalah yang memaksa persegi panjangnya duduk konsisten di atas (atau di bawah) kurva — tanpanya, jepitan antara integral dan jumlahnya runtuh.',
              },
              hint: {
                en: 'Re-read the rectangle argument — which property of $f$ was the one that guaranteed the rectangles stayed on the same side of the curve every time?',
                id: 'Baca ulang argumen persegi panjangnya — sifat $f$ mana yang menjamin persegi panjangnya tetap di sisi kurva yang sama setiap kali?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the convergence condition for the p-series.',
                id: 'Lengkapi syarat konvergensi deret-p.',
              },
              template: '\\sum \\dfrac{1}{n^p} \\text{ converges} \\iff p ___ 1',
              blanks: ['>'],
              explain: {
                en: 'The p-series converges exactly when $p>1$ — the same strict inequality already found for the matching improper integral.',
                id: 'Deret-p konvergen persis ketika $p>1$ — pertidaksamaan ketat yang sama yang sudah ditemukan untuk integral tak wajar yang sepadan.',
              },
              hint: {
                en: 'The boundary case $p=1$ is the harmonic series, examined in the next lesson — does it converge or diverge?',
                id: 'Kasus batas $p=1$ adalah deret harmonik, diperiksa pada pelajaran berikutnya — apakah ia konvergen atau divergen?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For which of these is the exponent $p$ in $\\sum \\frac{1}{n^p}$: for the series $\\sum \\frac{1}{n^{1.5}}$? (Just report $p$.)',
                id: 'Berapa eksponen $p$ pada $\\sum \\frac{1}{n^p}$: untuk deret $\\sum \\frac{1}{n^{1.5}}$? (Cukup laporkan $p$.)',
              },
              blanks: [{ answer: 1.5 }],
              hints: [
                { en: 'Read the exponent directly off the denominator.', id: 'Baca eksponennya langsung dari penyebutnya.' },
              ],
              explain: {
                en: '$p=1.5>1$, so this p-series converges by the Integral Test.',
                id: '$p=1.5>1$, sehingga deret-p ini konvergen menurut Uji Integral.',
              },
            },
          ],
        },
        {
          id: 'der-m2-s1-l2',
          title: { en: 'The Harmonic Series Diverges', id: 'Deret Harmonik Divergen' },
          goal: {
            en: 'Prove the harmonic series diverges using the Integral Test, despite its terms going to zero.',
            id: 'Membuktikan deret harmonik divergen memakai Uji Integral, meski suku-sukunya menuju nol.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The counterexample the nth-Term Test warned about', id: 'Kontoh penyangkal yang diperingatkan Uji Suku ke-n' },
              body: {
                en: 'The **harmonic series** $\\sum_{n=1}^{\\infty}\\dfrac{1}{n}$ has terms $a_n=\\frac1n\\to 0$ — the nth-Term Test stays silent. It is the $p=1$ boundary case of the p-series, matching $f(x)=1/x$. The Logarithm module already proved\n$$\\int_1^\\infty \\frac{1}{x}\\,dx = \\lim_{t\\to\\infty}\\big[\\ln x\\big]_1^t = \\lim_{t\\to\\infty}\\ln t = \\infty$$\nThe integral diverges, so by the Integral Test, **the harmonic series diverges too** — despite every single term shrinking toward zero. It is the standing proof that $a_n\\to 0$ is never enough on its own.',
                id: '**Deret harmonik** $\\sum_{n=1}^{\\infty}\\dfrac{1}{n}$ punya suku $a_n=\\frac1n\\to 0$ — Uji Suku ke-n diam. Ia adalah kasus batas $p=1$ dari deret-p, sepadan dengan $f(x)=1/x$. Modul Logaritma sudah membuktikan\n$$\\int_1^\\infty \\frac{1}{x}\\,dx = \\lim_{t\\to\\infty}\\big[\\ln x\\big]_1^t = \\lim_{t\\to\\infty}\\ln t = \\infty$$\nIntegralnya divergen, sehingga menurut Uji Integral, **deret harmoniknya pun divergen** — meski tiap suku tunggalnya menyusut menuju nol. Inilah bukti baku bahwa $a_n\\to 0$ tak pernah cukup dengan sendirinya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 20],
                ySpan: [-0.5, 4],
                ticks: true,
                items: [
                  { t: 'curve', f: 'ln(x)', from: 0.3, to: 20, color: 'muted', dashed: true, label: 'ln x' },
                  { t: 'dot', x: 1, y: 1, color: 'a' },
                  { t: 'dot', x: 4, y: 2.083, color: 'a' },
                  { t: 'dot', x: 8, y: 2.718, color: 'a' },
                  { t: 'dot', x: 15, y: 3.318, color: 'a' },
                ],
                caption: {
                  en: 'Harmonic partial sums $S_n=1+\\frac12+\\cdots+\\frac1n$ (dots) climb alongside $\\ln x$ (dashed) — slower and slower, but never stopping, since $\\ln x\\to\\infty$.',
                  id: 'Jumlah parsial harmonik $S_n=1+\\frac12+\\cdots+\\frac1n$ (titik) naik berdampingan dengan $\\ln x$ (putus-putus) — makin lambat, tetapi tak pernah berhenti, sebab $\\ln x\\to\\infty$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Grouping terms into halves that each exceed one half', id: 'Mengelompokkan suku menjadi kelompok yang masing-masing melebihi setengah' },
              body: {
                en: 'A second, purely algebraic proof (no integral needed) groups the terms in powers of two:\n$$1+\\frac12+\\Big(\\frac13+\\frac14\\Big)+\\Big(\\frac15+\\frac16+\\frac17+\\frac18\\Big)+\\cdots$$\nEach bracketed group replaces every term inside it with the smallest one present, and the group still sums to more than $\\tfrac12$. Since infinitely many such groups exist, the partial sums pass every whole number eventually — diverging exactly as the Integral Test already concluded, this time by nothing more than grouping and comparison.',
                id: 'Bukti kedua, murni aljabar (tak perlu integral), mengelompokkan suku dalam pangkat dua:\n$$1+\\frac12+\\Big(\\frac13+\\frac14\\Big)+\\Big(\\frac15+\\frac16+\\frac17+\\frac18\\Big)+\\cdots$$\nTiap kelompok berkurung mengganti setiap suku di dalamnya dengan yang terkecil yang ada, dan kelompoknya tetap berjumlah lebih dari $\\tfrac12$. Karena ada tak hingga banyak kelompok seperti itu, jumlah parsialnya akhirnya melewati setiap bilangan bulat — divergen persis seperti yang sudah disimpulkan Uji Integral, kali ini tak lebih dari pengelompokan dan perbandingan.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 9],
                ySpan: [-0.3, 3.5],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [1, 0], [1, 1], [0, 1]], color: 'a', label: '1' },
                  { t: 'poly', pts: [[1, 0], [2, 0], [2, 0.5], [1, 0.5]], color: 'a', label: '1/2' },
                  { t: 'poly', pts: [[2, 0], [4, 0], [4, 0.5], [2, 0.5]], color: 'b', label: '>1/2' },
                  { t: 'poly', pts: [[4, 0], [8, 0], [8, 0.5], [4, 0.5]], color: 'result', label: '>1/2' },
                ],
                caption: {
                  en: 'Grouped in powers of two, each highlighted block is built from terms all at least as big as its smallest member — and there are always enough of them to push the block past $\\frac12$.',
                  id: 'Dikelompokkan dalam pangkat dua, tiap blok yang disorot dibangun dari suku yang semuanya setidaknya sebesar anggota terkecilnya — dan selalu ada cukup banyak untuk mendorong bloknya melewati $\\frac12$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What makes the harmonic series a genuinely surprising example?',
                id: 'Apa yang membuat deret harmonik menjadi contoh yang sungguh mengejutkan?',
              },
              options: [
                { en: 'Its terms shrink to zero, yet the series still diverges', id: 'Suku-sukunya menyusut ke nol, tetapi deretnya tetap divergen' },
                { en: 'Its terms grow without bound', id: 'Suku-sukunya bertumbuh tanpa batas' },
                { en: 'It is actually a geometric series in disguise', id: 'Ia sebenarnya deret geometri yang menyamar' },
                { en: 'It has only finitely many terms', id: 'Ia hanya punya suku yang berhingga' },
              ],
              answer: 0,
              explain: {
                en: 'It is the standing demonstration that $a_n\\to 0$ is necessary but never sufficient for convergence — the exact gap the nth-Term Test leaves open.',
                id: 'Ia adalah demonstrasi baku bahwa $a_n\\to 0$ perlu tetapi tak pernah cukup untuk konvergensi — celah persis yang dibiarkan terbuka Uji Suku ke-n.',
              },
              hint: {
                en: 'Compare this series against what the nth-Term Test lesson said $a_n\\to 0$ could and could not guarantee.',
                id: 'Bandingkan deret ini dengan apa yang dikatakan pelajaran Uji Suku ke-n tentang apa yang bisa dan tak bisa dijamin $a_n\\to 0$.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps of the Integral Test proof that the harmonic series diverges.',
                id: 'Susun langkah bukti Uji Integral bahwa deret harmonik divergen.',
              },
              lines: [
                'f(x) = \\dfrac{1}{x} \\text{ is positive, continuous, and decreasing on } [1,\\infty)',
                '\\int_1^\\infty \\frac{1}{x}\\,dx = \\lim_{t\\to\\infty}\\ln t = \\infty',
                '\\text{By the Integral Test, } \\sum_{n=1}^\\infty \\frac1n \\text{ diverges}',
              ],
              explain: {
                en: 'Check the hypothesis of the Integral Test first, then evaluate the matching improper integral, then invoke the theorem to conclude about the series.',
                id: 'Periksa hipotesis Uji Integral lebih dahulu, lalu evaluasi integral tak wajar yang sepadan, lalu panggil teoremanya untuk menyimpulkan tentang deretnya.',
              },
              hint: {
                en: 'The Integral Test can only be invoked once its hypothesis is checked, and its conclusion can only be drawn once the integral has actually been evaluated.',
                id: 'Uji Integral hanya bisa dipanggil setelah hipotesisnya diperiksa, dan kesimpulannya hanya bisa ditarik setelah integralnya benar-benar dievaluasi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Does $\\sum_{n=1}^{\\infty} \\dfrac{1}{n^{0.8}}$ converge or diverge? Type $1$ for converges, $0$ for diverges.',
                id: 'Apakah $\\sum_{n=1}^{\\infty} \\dfrac{1}{n^{0.8}}$ konvergen atau divergen? Ketik $1$ untuk konvergen, $0$ untuk divergen.',
              },
              blanks: [{ answer: 0 }],
              hints: [
                { en: 'This is a p-series with $p=0.8$ — compare that to $1$.', id: 'Ini deret-p dengan $p=0.8$ — bandingkan itu dengan $1$.' },
              ],
              explain: {
                en: '$p=0.8<1$, so this p-series diverges — even slower than the harmonic series, but still without bound.',
                id: '$p=0.8<1$, sehingga deret-p ini divergen — bahkan lebih lambat dari deret harmonik, tetapi tetap tanpa batas.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m2-s1-p',
        runtime: 'math',
        title: { en: 'Applying the Integral Test', id: 'Menerapkan Uji Integral' },
        brief: {
          en: 'Classifying three p-series, and one that needs the full Integral Test rather than the shortcut.',
          id: 'Mengklasifikasikan tiga deret-p, dan satu yang memerlukan Uji Integral penuh, bukan jalan pintasnya.',
        },
        requirements: [
          { en: 'A p-series $\\sum 1/n^p$ converges exactly when $p>1$.', id: 'Deret-p $\\sum 1/n^p$ konvergen persis ketika $p>1$.' },
          { en: 'The Integral Test needs $f$ positive, continuous, and decreasing before it can be applied at all.', id: 'Uji Integral memerlukan $f$ positif, sinambung, dan menurun sebelum bisa diterapkan sama sekali.' },
        ],
        tasks: [
          {
            prompt: { en: 'Does $\\sum_{n=1}^{\\infty} \\dfrac{1}{n^3}$ converge or diverge? Type $1$ for converges, $0$ for diverges.', id: 'Apakah $\\sum_{n=1}^{\\infty} \\dfrac{1}{n^3}$ konvergen atau divergen? Ketik $1$ untuk konvergen, $0$ untuk divergen.' },
            blanks: [{ answer: 1 }],
            solution: ['p=3>1 \\Rightarrow \\text{konvergen}'],
          },
          {
            prompt: { en: 'Does $\\sum_{n=1}^{\\infty} \\dfrac{1}{\\sqrt{n}}$ converge or diverge? Type $1$ for converges, $0$ for diverges.', id: 'Apakah $\\sum_{n=1}^{\\infty} \\dfrac{1}{\\sqrt{n}}$ konvergen atau divergen? Ketik $1$ untuk konvergen, $0$ untuk divergen.' },
            blanks: [{ answer: 0 }],
            solution: ['p=\\tfrac12<1 \\Rightarrow \\text{divergen}'],
          },
          {
            prompt: { en: 'Using $\\int_1^\\infty \\dfrac{1}{x^2+1}\\,dx = \\dfrac{\\pi}{2} - \\arctan 1$, evaluate this integral. (Round to two decimal places.)', id: 'Memakai $\\int_1^\\infty \\dfrac{1}{x^2+1}\\,dx = \\dfrac{\\pi}{2} - \\arctan 1$, hitung integral ini. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: Math.PI / 2 - Math.atan(1), tol: 0.01 }],
            solution: ['\\dfrac{\\pi}{2}-\\dfrac{\\pi}{4} = \\dfrac{\\pi}{4} \\approx 0{,}79 \\Rightarrow \\text{integral hingga} \\Rightarrow \\sum\\dfrac{1}{n^2+1} \\text{ konvergen (Uji Integral)}'],
          },
        ],
        hints: [
          { en: 'The third task is not a p-series — it needs the full Integral Test, not the shortcut rule.', id: 'Butir ketiga bukan deret-p — ia memerlukan Uji Integral penuh, bukan aturan jalan pintasnya.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------------------- 9.4 comparison tests */
    {
      id: 'der-m2-s2',
      title: { en: 'Comparison Tests', id: 'Uji Perbandingan' },
      summary: {
        en: 'Settling a series by comparing it, term by term or in the limit, to another series already known to converge or diverge.',
        id: 'Menuntaskan sebuah deret dengan membandingkannya, suku demi suku atau dalam limit, terhadap deret lain yang sudah diketahui konvergen atau divergen.',
      },
      lessons: [
        {
          id: 'der-m2-s2-l1',
          title: { en: 'The Direct Comparison Test', id: 'Uji Perbandingan Langsung' },
          goal: {
            en: 'Determine convergence by comparing a series term by term against a p-series or geometric series.',
            id: 'Menentukan konvergensi dengan membandingkan sebuah deret suku demi suku terhadap deret-p atau deret geometri.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Sandwiched by a series instead of a function', id: 'Terjepit oleh deret, bukan fungsi' },
              body: {
                en: 'If $0\\leq a_n\\leq b_n$ for every $n$ past some point:\n\n- If $\\sum b_n$ **converges**, then $\\sum a_n$ **converges** — a sum bounded above by something finite cannot itself run away.\n- If $\\sum a_n$ **diverges**, then $\\sum b_n$ **diverges** — the contrapositive of the same fact.\n\nThe direction matters: a smaller series inheriting convergence from a larger one makes sense; nothing is concluded about $\\sum a_n$ from $\\sum b_n$ diverging, or about $\\sum b_n$ from $\\sum a_n$ converging — a big series can converge even while sitting above a small one that also converges.',
                id: 'Jika $0\\leq a_n\\leq b_n$ untuk setiap $n$ melewati suatu titik:\n\n- Jika $\\sum b_n$ **konvergen**, maka $\\sum a_n$ **konvergen** — jumlah yang dibatasi di atas oleh sesuatu yang hingga tak bisa lari sendiri.\n- Jika $\\sum a_n$ **divergen**, maka $\\sum b_n$ **divergen** — kontraposisi dari fakta yang sama.\n\nArahnya penting: deret yang lebih kecil mewarisi konvergensi dari yang lebih besar masuk akal; tak ada yang disimpulkan tentang $\\sum a_n$ dari $\\sum b_n$ divergen, atau tentang $\\sum b_n$ dari $\\sum a_n$ konvergen — deret besar bisa saja konvergen meski duduk di atas deret kecil yang juga konvergen.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 8],
                ySpan: [-0.1, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x^2', from: 0.5, to: 8, color: 'result', label: '1/n²' },
                  { t: 'dot', x: 1, y: 0.5, color: 'a', label: '1/(n²+1)' },
                  { t: 'dot', x: 2, y: 0.2, color: 'a' },
                  { t: 'dot', x: 3, y: 0.1, color: 'a' },
                  { t: 'dot', x: 4, y: 0.059, color: 'a' },
                ],
                caption: {
                  en: '$a_n=\\frac{1}{n^2+1}$ (dots) sits below $b_n=\\frac{1}{n^2}$ (curve) at every $n$ — since $\\sum 1/n^2$ converges (p-series, $p=2$), the smaller series inherits convergence too.',
                  id: '$a_n=\\frac{1}{n^2+1}$ (titik) duduk di bawah $b_n=\\frac{1}{n^2}$ (kurva) di setiap $n$ — karena $\\sum 1/n^2$ konvergen (deret-p, $p=2$), deret yang lebih kecil pun mewarisi konvergensi.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Choosing the comparison series by the dominant term', id: 'Memilih deret pembanding lewat suku yang mendominasi' },
              body: {
                en: 'For $\\sum \\dfrac{1}{2^n+1}$: since $2^n+1>2^n$, dividing flips the inequality: $\\dfrac{1}{2^n+1}<\\dfrac{1}{2^n}$. The comparison series $\\sum \\left(\\dfrac12\\right)^n$ is geometric with $r=\\tfrac12$, convergent — so by direct comparison, $\\sum \\dfrac{1}{2^n+1}$ converges too. The pattern for picking a comparison series is always the same: keep the dominant term (from the Relative Rates of Growth module) and drop everything that only matters for small $n$.',
                id: 'Untuk $\\sum \\dfrac{1}{2^n+1}$: karena $2^n+1>2^n$, membagi membalik pertidaksamaannya: $\\dfrac{1}{2^n+1}<\\dfrac{1}{2^n}$. Deret pembanding $\\sum \\left(\\dfrac12\\right)^n$ geometri dengan $r=\\tfrac12$, konvergen — sehingga menurut perbandingan langsung, $\\sum \\dfrac{1}{2^n+1}$ pun konvergen. Pola memilih deret pembanding selalu sama: pertahankan suku yang mendominasi (dari modul Laju Pertumbuhan Relatif) dan buang segala yang hanya berarti untuk $n$ kecil.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 6],
                ySpan: [-0.1, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: '(1/2)^x', from: 0, to: 6, color: 'result', label: '(1/2)ⁿ' },
                  { t: 'dot', x: 1, y: 0.333, color: 'a' },
                  { t: 'dot', x: 2, y: 0.2, color: 'a' },
                  { t: 'dot', x: 3, y: 0.111, color: 'a' },
                  { t: 'dot', x: 4, y: 0.0588, color: 'a' },
                ],
                caption: {
                  en: '$a_n=\\frac{1}{2^n+1}$ (dots) stays below the convergent geometric series $(1/2)^n$ (curve) at every $n$ — comparison settles convergence without ever finding a closed form for the sum itself.',
                  id: '$a_n=\\frac{1}{2^n+1}$ (titik) tetap di bawah deret geometri konvergen $(1/2)^n$ (kurva) di setiap $n$ — perbandingan menuntaskan konvergensi tanpa pernah mencari bentuk tertutup untuk jumlahnya sendiri.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $0 \\leq a_n \\leq b_n$ and $\\sum a_n$ diverges, what follows about $\\sum b_n$?',
                id: 'Jika $0 \\leq a_n \\leq b_n$ dan $\\sum a_n$ divergen, apa yang mengikuti tentang $\\sum b_n$?',
              },
              options: [
                { en: '$\\sum b_n$ must also diverge', id: '$\\sum b_n$ juga pasti divergen' },
                { en: '$\\sum b_n$ must converge', id: '$\\sum b_n$ pasti konvergen' },
                { en: 'Nothing can be concluded about $\\sum b_n$', id: 'Tak ada yang bisa disimpulkan tentang $\\sum b_n$' },
                { en: '$\\sum b_n$ must equal $\\sum a_n$', id: '$\\sum b_n$ pasti sama dengan $\\sum a_n$' },
              ],
              answer: 0,
              explain: {
                en: 'If the smaller series already runs away to infinity, the larger series — sitting above it term by term — has no choice but to do the same.',
                id: 'Jika deret yang lebih kecil sudah lari ke tak hingga, deret yang lebih besar — duduk di atasnya suku demi suku — tak punya pilihan selain melakukan hal yang sama.',
              },
              hint: {
                en: 'Re-read the two bullet points in the first concept — one of them starts with exactly this hypothesis, "$\\sum a_n$ diverges".',
                id: 'Baca ulang dua butir pada konsep pertama — salah satunya dimulai persis dengan hipotesis ini, "$\\sum a_n$ divergen".',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the inequality used to compare $\\sum \\dfrac{1}{n^2+3}$ against a p-series.',
                id: 'Lengkapi pertidaksamaan yang dipakai untuk membandingkan $\\sum \\dfrac{1}{n^2+3}$ terhadap deret-p.',
              },
              template: '\\dfrac{1}{n^2+3} \\ ___ \\ \\dfrac{1}{n^2}',
              blanks: ['<'],
              explain: {
                en: 'Since $n^2+3>n^2$, dividing $1$ by the larger denominator gives the smaller fraction — so $\\dfrac{1}{n^2+3}<\\dfrac{1}{n^2}$, and the convergent p-series $\\sum 1/n^2$ ($p=2$) bounds it from above.',
                id: 'Karena $n^2+3>n^2$, membagi $1$ dengan penyebut yang lebih besar memberi pecahan yang lebih kecil — sehingga $\\dfrac{1}{n^2+3}<\\dfrac{1}{n^2}$, dan deret-p konvergen $\\sum 1/n^2$ ($p=2$) membatasinya dari atas.',
              },
              hint: {
                en: 'A bigger denominator with the same numerator always makes the fraction smaller, not bigger.',
                id: 'Penyebut yang lebih besar dengan pembilang yang sama selalu membuat pecahannya lebih kecil, bukan lebih besar.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using the p-series $\\sum 1/n^2$ as the comparison series, what value of p does it use? (Just report p, to confirm the comparison converges.)',
                id: 'Memakai deret-p $\\sum 1/n^2$ sebagai deret pembanding, berapa nilai p yang dipakainya? (Cukup laporkan p, untuk mengonfirmasi perbandingannya konvergen.)',
              },
              blanks: [{ answer: 2 }],
              hints: [
                { en: 'Read the exponent directly off $1/n^2$.', id: 'Baca eksponennya langsung dari $1/n^2$.' },
              ],
              explain: {
                en: '$p=2>1$, so $\\sum 1/n^2$ converges, and it is the right comparison series for any $a_n$ that behaves like $1/n^2$ for large $n$.',
                id: '$p=2>1$, sehingga $\\sum 1/n^2$ konvergen, dan ialah deret pembanding yang tepat untuk $a_n$ mana pun yang berperilaku seperti $1/n^2$ untuk $n$ besar.',
              },
            },
          ],
        },
        {
          id: 'der-m2-s2-l2',
          title: { en: 'The Limit Comparison Test', id: 'Uji Perbandingan Limit' },
          goal: {
            en: 'Compare two series by the limit of their ratio, when a direct term-by-term inequality is awkward to set up.',
            id: 'Membandingkan dua deret lewat limit rasionya, ketika pertidaksamaan suku-demi-suku langsung merepotkan disusun.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'When the inequality is awkward but the ratio is not', id: 'Ketika pertidaksamaannya merepotkan tetapi rasionya tidak' },
              body: {
                en: 'For $\\sum \\dfrac{3n+1}{n^3+2}$, setting up a clean term-by-term inequality against a p-series takes some care. The **Limit Comparison Test** sidesteps it: for $a_n,b_n>0$, if\n$$\\lim_{n\\to\\infty}\\frac{a_n}{b_n}=L, \\qquad 0<L<\\infty$$\nthen $\\sum a_n$ and $\\sum b_n$ **either both converge or both diverge** — exactly the "same rate of growth" idea from the Relative Rates of Growth module, now deciding a series instead of a limit. Pick $b_n$ by keeping only the dominant terms of $a_n$: here, $\\dfrac{3n}{n^3}=\\dfrac{3}{n^2}$, so compare against $\\sum \\dfrac{1}{n^2}$.',
                id: 'Untuk $\\sum \\dfrac{3n+1}{n^3+2}$, menyusun pertidaksamaan suku-demi-suku yang bersih terhadap deret-p memerlukan sedikit kehati-hatian. **Uji Perbandingan Limit** menghindarinya: untuk $a_n,b_n>0$, jika\n$$\\lim_{n\\to\\infty}\\frac{a_n}{b_n}=L, \\qquad 0<L<\\infty$$\nmaka $\\sum a_n$ dan $\\sum b_n$ **keduanya konvergen atau keduanya divergen** — persis gagasan "laju pertumbuhan yang sama" dari modul Laju Pertumbuhan Relatif, kini memutuskan sebuah deret, bukan sebuah limit. Pilih $b_n$ dengan mempertahankan hanya suku yang mendominasi $a_n$: di sini, $\\dfrac{3n}{n^3}=\\dfrac{3}{n^2}$, jadi bandingkan terhadap $\\sum \\dfrac{1}{n^2}$.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 12],
                ySpan: [-0.1, 3.5],
                ticks: true,
                items: [
                  { t: 'curve', f: '((3*x+1)/(x^3+2))/(1/x^2)', from: 1, to: 12, color: 'a' },
                  { t: 'hline', y: 3, color: 'result', dashed: true, label: 'L=3' },
                ],
                caption: {
                  en: 'The ratio $\\dfrac{a_n}{b_n}=\\dfrac{(3n+1)/(n^3+2)}{1/n^2}$ settles toward $L=3$ — finite and positive, so the two series share the same fate.',
                  id: 'Rasio $\\dfrac{a_n}{b_n}=\\dfrac{(3n+1)/(n^3+2)}{1/n^2}$ menuju $L=3$ — hingga dan positif, sehingga kedua deret berbagi nasib yang sama.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Finishing the computation', id: 'Menuntaskan penghitungan' },
              body: {
                en: 'Compute the limit directly, dividing every term by the dominant power $n^3$ (the same technique from the Sequences lesson):\n$$\\lim_{n\\to\\infty}\\frac{(3n+1)/(n^3+2)}{1/n^2} = \\lim_{n\\to\\infty}\\frac{n^2(3n+1)}{n^3+2} = \\lim_{n\\to\\infty}\\frac{3n^3+n^2}{n^3+2} = \\lim_{n\\to\\infty}\\frac{3+1/n}{1+2/n^3} = 3$$\n$L=3$ is finite and positive, and $\\sum \\dfrac{1}{n^2}$ converges ($p=2$), so by the Limit Comparison Test, $\\sum \\dfrac{3n+1}{n^3+2}$ **converges too** — settled without ever writing down a term-by-term inequality.',
                id: 'Hitung limitnya langsung, membagi tiap suku dengan pangkat dominan $n^3$ (teknik yang sama dari pelajaran Barisan):\n$$\\lim_{n\\to\\infty}\\frac{(3n+1)/(n^3+2)}{1/n^2} = \\lim_{n\\to\\infty}\\frac{n^2(3n+1)}{n^3+2} = \\lim_{n\\to\\infty}\\frac{3n^3+n^2}{n^3+2} = \\lim_{n\\to\\infty}\\frac{3+1/n}{1+2/n^3} = 3$$\n$L=3$ hingga dan positif, dan $\\sum \\dfrac{1}{n^2}$ konvergen ($p=2$), sehingga menurut Uji Perbandingan Limit, $\\sum \\dfrac{3n+1}{n^3+2}$ **pun konvergen** — tuntas tanpa pernah menuliskan pertidaksamaan suku-demi-suku.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 8],
                ySpan: [-0.1, 1.5],
                ticks: true,
                items: [
                  { t: 'curve', f: '3/x^2', from: 0.5, to: 8, color: 'result', label: '3/n²' },
                  { t: 'dot', x: 1, y: 1.333, color: 'a' },
                  { t: 'dot', x: 2, y: 0.7, color: 'a' },
                  { t: 'dot', x: 3, y: 0.345, color: 'a' },
                  { t: 'dot', x: 4, y: 0.197, color: 'a' },
                ],
                caption: {
                  en: '$a_n=\\frac{3n+1}{n^3+2}$ (dots) tracks $3/n^2$ (curve) closely for large $n$ — visibly the same shape, exactly what a finite nonzero ratio limit means.',
                  id: '$a_n=\\frac{3n+1}{n^3+2}$ (titik) mengikuti $3/n^2$ (kurva) dengan dekat untuk $n$ besar — tampak berbentuk sama, persis makna limit rasio yang hingga dan tak nol.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For the Limit Comparison Test, what must be true about $L = \\lim a_n/b_n$?',
                id: 'Untuk Uji Perbandingan Limit, apa yang harus benar tentang $L = \\lim a_n/b_n$?',
              },
              options: [
                { en: '$L$ must be finite and strictly positive', id: '$L$ harus hingga dan strict positif' },
                { en: '$L$ must equal exactly $1$', id: '$L$ harus sama dengan tepat $1$' },
                { en: '$L$ must be $0$', id: '$L$ harus $0$' },
                { en: '$L$ can be anything, including infinite', id: '$L$ boleh apa saja, termasuk tak hingga' },
              ],
              answer: 0,
              explain: {
                en: 'A finite, positive $L$ is exactly what guarantees the two series grow at the same rate — if $L=0$ or $L=\\infty$, one series could still converge while the other diverges.',
                id: '$L$ yang hingga dan positif persis yang menjamin kedua deret bertumbuh dengan laju yang sama — jika $L=0$ atau $L=\\infty$, satu deret masih bisa konvergen sementara yang lain divergen.',
              },
              hint: {
                en: 'Re-read the stated condition on $L$ in the first concept of this lesson, right above where the theorem itself is written.',
                id: 'Baca ulang syarat $L$ yang dinyatakan pada konsep pertama pelajaran ini, tepat di atas tempat teoremanya sendiri dituliskan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps of the Limit Comparison Test applied to $\\sum \\dfrac{2n^2+1}{n^4+n}$.',
                id: 'Susun langkah Uji Perbandingan Limit yang diterapkan pada $\\sum \\dfrac{2n^2+1}{n^4+n}$.',
              },
              lines: [
                'b_n = \\dfrac{2n^2}{n^4} = \\dfrac{2}{n^2} \\quad (\\text{dominant terms})',
                '\\lim_{n\\to\\infty}\\dfrac{(2n^2+1)/(n^4+n)}{2/n^2} = \\lim_{n\\to\\infty}\\dfrac{2n^4+n^2}{2n^4+2n} = 1',
                '\\sum \\dfrac{1}{n^2} \\text{ converges} \\ (p=2) \\Rightarrow \\sum \\dfrac{2n^2+1}{n^4+n} \\text{ converges}',
              ],
              explain: {
                en: 'First choose the comparison series from the dominant terms, then compute the limit of the ratio, then invoke the theorem to conclude about the original series.',
                id: 'Pertama pilih deret pembanding dari suku yang mendominasi, lalu hitung limit rasionya, lalu panggil teoremanya untuk menyimpulkan tentang deret aslinya.',
              },
              hint: {
                en: 'The ratio in step two cannot be written down until a comparison series has actually been chosen — and the final conclusion needs that ratio\'s limit already computed.',
                id: 'Rasio pada langkah kedua tak bisa dituliskan sebelum deret pembandingnya benar-benar dipilih — dan kesimpulan akhirnya memerlukan limit rasio itu sudah dihitung.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $\\sum \\dfrac{5n+2}{n^3-1}$ compared against $b_n=\\dfrac{1}{n^2}$, find $L = \\lim_{n\\to\\infty} a_n/b_n$.',
                id: 'Untuk $\\sum \\dfrac{5n+2}{n^3-1}$ dibandingkan terhadap $b_n=\\dfrac{1}{n^2}$, cari $L = \\lim_{n\\to\\infty} a_n/b_n$.',
              },
              blanks: [{ answer: 5 }],
              hints: [
                { en: 'Multiply $a_n$ by $n^2$ and divide every term by the highest power of $n$.', id: 'Kalikan $a_n$ dengan $n^2$ dan bagi tiap suku dengan pangkat $n$ tertinggi.' },
              ],
              explain: {
                en: '$\\dfrac{n^2(5n+2)}{n^3-1} = \\dfrac{5n^3+2n^2}{n^3-1} \\to 5$ — finite and positive, so both series converge, since $\\sum 1/n^2$ does.',
                id: '$\\dfrac{n^2(5n+2)}{n^3-1} = \\dfrac{5n^3+2n^2}{n^3-1} \\to 5$ — hingga dan positif, sehingga kedua deret konvergen, sebab $\\sum 1/n^2$ konvergen.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m2-s2-p',
        runtime: 'math',
        title: { en: 'Comparing Series', id: 'Membandingkan Deret' },
        brief: {
          en: 'A direct comparison, a limit comparison, and picking a matching p-series.',
          id: 'Sebuah perbandingan langsung, sebuah perbandingan limit, dan memilih deret-p yang sepadan.',
        },
        requirements: [
          { en: 'Direct comparison needs an inequality $0\\leq a_n\\leq b_n$ that holds for every relevant n.', id: 'Perbandingan langsung memerlukan pertidaksamaan $0\\leq a_n\\leq b_n$ yang berlaku untuk setiap n yang relevan.' },
          { en: 'A comparison series is chosen by keeping only the dominant terms as $n\\to\\infty$.', id: 'Deret pembanding dipilih dengan mempertahankan hanya suku yang mendominasi ketika $n\\to\\infty$.' },
        ],
        tasks: [
          {
            prompt: { en: 'Does $\\sum \\dfrac{1}{n^2+5n}$ converge or diverge, by direct comparison to $\\sum 1/n^2$? Type $1$ for converges, $0$ for diverges.', id: 'Apakah $\\sum \\dfrac{1}{n^2+5n}$ konvergen atau divergen, lewat perbandingan langsung terhadap $\\sum 1/n^2$? Ketik $1$ untuk konvergen, $0$ untuk divergen.' },
            blanks: [{ answer: 1 }],
            solution: ['\\dfrac{1}{n^2+5n}<\\dfrac{1}{n^2}, \\ \\sum\\dfrac1{n^2} \\text{ konvergen} \\Rightarrow \\text{konvergen}'],
          },
          {
            prompt: { en: 'For $\\sum \\dfrac{4n^2+1}{n^4+3}$ compared against $b_n=1/n^2$, find $L$.', id: 'Untuk $\\sum \\dfrac{4n^2+1}{n^4+3}$ dibandingkan terhadap $b_n=1/n^2$, cari $L$.' },
            blanks: [{ answer: 4 }],
            solution: ['\\dfrac{n^2(4n^2+1)}{n^4+3} = \\dfrac{4n^4+n^2}{n^4+3} \\to 4'],
          },
          {
            prompt: { en: 'Does $\\sum \\dfrac{n}{n^2+1}$ converge or diverge, by limit comparison to the harmonic series $\\sum 1/n$? Type $1$ for converges, $0$ for diverges.', id: 'Apakah $\\sum \\dfrac{n}{n^2+1}$ konvergen atau divergen, lewat perbandingan limit terhadap deret harmonik $\\sum 1/n$? Ketik $1$ untuk konvergen, $0$ untuk divergen.' },
            blanks: [{ answer: 0 }],
            solution: ['\\lim \\dfrac{n/(n^2+1)}{1/n} = \\lim\\dfrac{n^2}{n^2+1}=1, \\ \\sum\\tfrac1n \\text{ divergen} \\Rightarrow \\text{divergen}'],
          },
        ],
        hints: [
          { en: 'The dominant-term shortcut for choosing a comparison series is the same move as the Relative Rates of Growth module — keep the highest power, drop the rest.', id: 'Jalan pintas suku-dominan untuk memilih deret pembanding adalah gerakan yang sama seperti modul Laju Pertumbuhan Relatif — pertahankan pangkat tertinggi, buang sisanya.' },
        ],
        xp: 50,
      },
    },
  ],
}
