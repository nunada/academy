import type { Module } from '../types'

/** Module 3 — two tools that work on any series, not just positive ones: the
 *  ratio and root tests for absolute convergence, and a dedicated test for
 *  the one shape that comparison and the integral test cannot touch —
 *  a series that alternates sign. */
export const module3: Module = {
  id: 'der-m3',
  title: { en: 'Absolute Convergence and Alternating Series', id: 'Konvergensi Mutlak dan Deret Berselang' },
  summary: {
    en: 'Tests that work on any series regardless of sign — the ratio and root tests — and a dedicated test, plus an error bound, for series that alternate sign.',
    id: 'Uji yang berlaku untuk deret apa pun tak peduli tandanya — uji rasio dan uji akar — dan sebuah uji khusus, plus batas galat, untuk deret yang berselang tanda.',
  },
  submodules: [
    /* ---------------------------------------- 9.5 absolute convergence; ratio and root */
    {
      id: 'der-m3-s1',
      title: { en: 'Absolute Convergence; the Ratio and Root Tests', id: 'Konvergensi Mutlak; Uji Rasio dan Uji Akar' },
      summary: {
        en: 'Two tests built to work on any series, positive or not, by examining how fast consecutive terms shrink.',
        id: 'Dua uji yang dibangun untuk berlaku pada deret apa pun, positif atau tidak, dengan memeriksa seberapa cepat suku berurutan menyusut.',
      },
      lessons: [
        {
          id: 'der-m3-s1-l1',
          title: { en: 'Absolute Convergence', id: 'Konvergensi Mutlak' },
          goal: {
            en: 'Determine that a series converges by showing the series of its absolute values converges.',
            id: 'Menentukan sebuah deret konvergen dengan menunjukkan deret nilai mutlaknya konvergen.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A stronger, easier-to-check kind of convergence', id: 'Jenis konvergensi yang lebih kuat, lebih mudah diperiksa' },
              body: {
                en: 'Every comparison and integral test from the last module needed positive terms. $\\sum a_n$ is **absolutely convergent** if $\\sum |a_n|$ converges — and this is a genuinely stronger fact, since\n$$\\mathbf{\\text{absolute convergence}} \\ \\Rightarrow \\ \\mathbf{\\text{convergence}}$$\nThe proof rests on $0\\leq a_n+|a_n|\\leq 2|a_n|$: if $\\sum|a_n|$ converges, direct comparison gives $\\sum(a_n+|a_n|)$ convergent too, and subtracting the (convergent) series $\\sum|a_n|$ leaves $\\sum a_n$ convergent. The value of this: **the tools built for positive series now apply to any series at all**, by first taking absolute values.',
                id: 'Setiap uji perbandingan dan integral dari modul terakhir memerlukan suku positif. $\\sum a_n$ **konvergen mutlak** jika $\\sum |a_n|$ konvergen — dan ini fakta yang sungguh lebih kuat, sebab\n$$\\mathbf{\\text{konvergen mutlak}} \\ \\Rightarrow \\ \\mathbf{\\text{konvergen}}$$\nBuktinya bersandar pada $0\\leq a_n+|a_n|\\leq 2|a_n|$: jika $\\sum|a_n|$ konvergen, perbandingan langsung memberi $\\sum(a_n+|a_n|)$ konvergen juga, dan mengurangkan deret (konvergen) $\\sum|a_n|$ menyisakan $\\sum a_n$ konvergen. Nilai dari ini: **alat yang dibangun untuk deret positif kini berlaku untuk deret apa pun**, dengan lebih dahulu mengambil nilai mutlak.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 8],
                ySpan: [-1.2, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x^2', from: 0.5, to: 8, color: 'muted', dashed: true, label: '|aₙ|' },
                  { t: 'curve', f: '-1/x^2', from: 0.5, to: 8, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: -1, color: 'a' },
                  { t: 'dot', x: 2, y: 0.25, color: 'a' },
                  { t: 'dot', x: 3, y: -0.111, color: 'a' },
                  { t: 'dot', x: 4, y: 0.0625, color: 'a' },
                ],
                caption: {
                  en: '$a_n=\\frac{(-1)^n}{n^2}$ alternates sign, trapped between $\\pm 1/n^2$ — since $\\sum 1/n^2$ (a convergent p-series, $p=2$) already converges, $\\sum a_n$ is absolutely convergent.',
                  id: '$a_n=\\frac{(-1)^n}{n^2}$ berganti tanda, terjepit di antara $\\pm 1/n^2$ — karena $\\sum 1/n^2$ (deret-p konvergen, $p=2$) sudah konvergen, $\\sum a_n$ konvergen mutlak.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two names for what a series can be', id: 'Dua nama untuk apa yang bisa dimiliki sebuah deret' },
              body: {
                en: 'Convergent series without absolute convergence get their own name: $\\sum a_n$ is **conditionally convergent** if $\\sum a_n$ converges but $\\sum|a_n|$ diverges. So every series falls into exactly one of three categories: absolutely convergent, conditionally convergent, or divergent — the middle category is genuinely delicate (rearranging a conditionally convergent series can even change its sum, a fact left for a more advanced course), and telling it apart from the first is exactly what the rest of this module builds toward, once the ratio and root tests are in hand.',
                id: 'Deret konvergen tanpa konvergensi mutlak mendapat namanya sendiri: $\\sum a_n$ **konvergen bersyarat** jika $\\sum a_n$ konvergen tetapi $\\sum|a_n|$ divergen. Jadi setiap deret jatuh ke persis satu dari tiga kategori: konvergen mutlak, konvergen bersyarat, atau divergen — kategori tengahnya sungguh rapuh (menyusun ulang deret konvergen bersyarat bahkan bisa mengubah jumlahnya, fakta yang disisakan untuk kursus yang lebih lanjut), dan membedakannya dari yang pertama persis yang dibangun sisa modul ini menuju, begitu uji rasio dan uji akar sudah di tangan.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 8],
                ySpan: [-1.2, 1.2],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.5, to: 8, color: 'muted', dashed: true, label: '|aₙ|' },
                  { t: 'curve', f: '-1/x', from: 0.5, to: 8, color: 'muted', dashed: true },
                  { t: 'dot', x: 1, y: 1, color: 'b' },
                  { t: 'dot', x: 2, y: -0.5, color: 'b' },
                  { t: 'dot', x: 3, y: 0.333, color: 'b' },
                  { t: 'dot', x: 4, y: -0.25, color: 'b' },
                ],
                caption: {
                  en: '$a_n=\\frac{(-1)^{n+1}}{n}$: the next module proves $\\sum a_n$ itself converges, yet $\\sum|a_n|=\\sum 1/n$ is the harmonic series, which diverges — conditional convergence, not absolute.',
                  id: '$a_n=\\frac{(-1)^{n+1}}{n}$: modul berikutnya membuktikan $\\sum a_n$ sendiri konvergen, tetapi $\\sum|a_n|=\\sum 1/n$ adalah deret harmonik, yang divergen — konvergensi bersyarat, bukan mutlak.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $\\sum |a_n|$ converges, what can be concluded about $\\sum a_n$?',
                id: 'Jika $\\sum |a_n|$ konvergen, apa yang bisa disimpulkan tentang $\\sum a_n$?',
              },
              options: [
                { en: '$\\sum a_n$ must also converge', id: '$\\sum a_n$ juga pasti konvergen' },
                { en: '$\\sum a_n$ must diverge', id: '$\\sum a_n$ pasti divergen' },
                { en: 'Nothing can be concluded', id: 'Tak ada yang bisa disimpulkan' },
                { en: '$\\sum a_n$ must equal $\\sum |a_n|$', id: '$\\sum a_n$ pasti sama dengan $\\sum |a_n|$' },
              ],
              answer: 0,
              explain: {
                en: 'Absolute convergence is strictly stronger than convergence — it always implies it, by the direct-comparison argument in the first concept.',
                id: 'Konvergensi mutlak strict lebih kuat dari konvergensi — ia selalu mengakibatkannya, lewat argumen perbandingan langsung pada konsep pertama.',
              },
              hint: {
                en: 'Re-read the boxed implication in the first concept — which direction does the arrow point?',
                id: 'Baca ulang implikasi berkotak pada konsep pertama — ke arah mana panahnya menunjuk?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the classification: $\\sum a_n$ converges but $\\sum |a_n|$ diverges means the series is ___ convergent.',
                id: 'Lengkapi klasifikasinya: $\\sum a_n$ konvergen tetapi $\\sum |a_n|$ divergen berarti deretnya konvergen ___.',
              },
              template: '\\text{convergent but not absolutely} \\Rightarrow ___ \\text{ convergent}',
              blanks: ['conditionally'],
              explain: {
                en: 'A series that converges without converging absolutely is, by definition, conditionally convergent.',
                id: 'Deret yang konvergen tanpa konvergen mutlak adalah, menurut definisi, konvergen bersyarat.',
              },
              hint: {
                en: 'This is exactly the name given in the second concept to the "delicate middle category".',
                id: 'Ini persis nama yang diberikan pada konsep kedua untuk "kategori tengah yang rapuh".',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Is $\\sum_{n=1}^{\\infty}\\dfrac{(-1)^n}{n^3}$ absolutely convergent? Type $1$ for yes, $0$ for no.',
                id: 'Apakah $\\sum_{n=1}^{\\infty}\\dfrac{(-1)^n}{n^3}$ konvergen mutlak? Ketik $1$ untuk ya, $0$ untuk tidak.',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Take the absolute value of each term and check it as a p-series.', id: 'Ambil nilai mutlak tiap suku dan periksa sebagai deret-p.' },
              ],
              explain: {
                en: '$\\sum|a_n| = \\sum 1/n^3$ is a p-series with $p=3>1$, which converges — so the original series is absolutely convergent.',
                id: '$\\sum|a_n| = \\sum 1/n^3$ adalah deret-p dengan $p=3>1$, yang konvergen — sehingga deret aslinya konvergen mutlak.',
              },
            },
          ],
        },
        {
          id: 'der-m3-s1-l2',
          title: { en: 'The Ratio Test and the Root Test', id: 'Uji Rasio dan Uji Akar' },
          goal: {
            en: 'Apply the Ratio Test and the Root Test to determine absolute convergence.',
            id: 'Menerapkan Uji Rasio dan Uji Akar untuk menentukan konvergensi mutlak.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Comparing a series to itself, one step later', id: 'Membandingkan deret dengan dirinya sendiri, satu langkah kemudian' },
              body: {
                en: 'The **Ratio Test** looks at how much each term shrinks compared to the one before it:\n$$L = \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|$$\nIf $L<1$, $\\sum a_n$ **converges absolutely** (eventually the terms shrink geometrically, like $r^n$ with $r<1$); if $L>1$ (or $L=\\infty$), it **diverges** (terms eventually grow); if $L=1$, the test is **inconclusive** — try something else. For $\\sum \\dfrac{n}{2^n}$:\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{(n+1)/2^{n+1}}{n/2^n} = \\frac{n+1}{2n} \\to \\frac12$$\n$L=\\tfrac12<1$: converges absolutely.',
                id: '**Uji Rasio** melihat seberapa banyak tiap suku menyusut dibandingkan yang sebelumnya:\n$$L = \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|$$\nJika $L<1$, $\\sum a_n$ **konvergen mutlak** (akhirnya suku-sukunya menyusut secara geometri, seperti $r^n$ dengan $r<1$); jika $L>1$ (atau $L=\\infty$), ia **divergen** (suku-sukunya akhirnya membesar); jika $L=1$, ujinya **tak tuntas** — coba yang lain. Untuk $\\sum \\dfrac{n}{2^n}$:\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{(n+1)/2^{n+1}}{n/2^n} = \\frac{n+1}{2n} \\to \\frac12$$\n$L=\\tfrac12<1$: konvergen mutlak.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 10],
                ySpan: [-0.1, 0.6],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x/2^x', from: 0, to: 10, color: 'a' },
                ],
                caption: {
                  en: '$a_n=\\frac{n}{2^n}$ rises briefly then falls off geometrically — the Ratio Test\'s $L=\\frac12$ is exactly the eventual shrink factor between one term and the next.',
                  id: '$a_n=\\frac{n}{2^n}$ naik sebentar lalu turun secara geometri — $L=\\frac12$ dari Uji Rasio persis faktor penyusutan yang terjadi antara satu suku dan berikutnya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The Root Test, for a term that is itself a power', id: 'Uji Akar, untuk suku yang sendiri adalah pangkat' },
              body: {
                en: 'When $a_n$ is already raised to the $n$th power, the **Root Test** is the more natural tool:\n$$L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}$$\nwith the same verdict as the Ratio Test: $L<1$ converges absolutely, $L>1$ diverges, $L=1$ inconclusive. For $\\sum \\left(\\dfrac{n}{n+1}\\right)^{n^2}$:\n$$\\sqrt[n]{|a_n|} = \\left(\\frac{n}{n+1}\\right)^{n} = \\left(1-\\frac{1}{n+1}\\right)^n \\to e^{-1} \\approx 0.368$$\nusing the compound-interest limit from the Functions course, run backward. $L=1/e<1$: converges absolutely — a series the Ratio Test could reach too, but far more awkwardly, since $\\left(\\dfrac{n+1}{n+2}\\right)^{(n+1)^2}\\Big/\\left(\\dfrac{n}{n+1}\\right)^{n^2}$ is nowhere near as clean.',
                id: 'Ketika $a_n$ sudah dipangkatkan ke pangkat ke-$n$, **Uji Akar** adalah alat yang lebih alami:\n$$L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}$$\ndengan putusan yang sama seperti Uji Rasio: $L<1$ konvergen mutlak, $L>1$ divergen, $L=1$ tak tuntas. Untuk $\\sum \\left(\\dfrac{n}{n+1}\\right)^{n^2}$:\n$$\\sqrt[n]{|a_n|} = \\left(\\frac{n}{n+1}\\right)^{n} = \\left(1-\\frac{1}{n+1}\\right)^n \\to e^{-1} \\approx 0.368$$\nmemakai limit bunga majemuk dari kursus Fungsi, dijalankan terbalik. $L=1/e<1$: konvergen mutlak — deret yang Uji Rasio pun bisa mencapainya, tetapi jauh lebih merepotkan, sebab $\\left(\\dfrac{n+1}{n+2}\\right)^{(n+1)^2}\\Big/\\left(\\dfrac{n}{n+1}\\right)^{n^2}$ sama sekali tak sebersih ini.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 30],
                ySpan: [-0.1, 1.1],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x/(x+1))^x', from: 1, to: 30, color: 'a' },
                  { t: 'hline', y: 0.368, color: 'result', dashed: true, label: '1/e' },
                ],
                caption: {
                  en: '$\\sqrt[n]{|a_n|}=\\left(\\frac{n}{n+1}\\right)^n$ settles toward $1/e\\approx 0.368$ — below $1$, so the Root Test declares absolute convergence.',
                  id: '$\\sqrt[n]{|a_n|}=\\left(\\frac{n}{n+1}\\right)^n$ menuju $1/e\\approx 0{,}368$ — di bawah $1$, sehingga Uji Akar menyatakan konvergen mutlak.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does the Ratio Test conclude when $L = 1$?',
                id: 'Apa yang disimpulkan Uji Rasio ketika $L = 1$?',
              },
              options: [
                { en: 'Nothing — the test is inconclusive and a different test is needed', id: 'Tak ada — ujinya tak tuntas dan uji lain diperlukan' },
                { en: 'The series always converges', id: 'Deretnya selalu konvergen' },
                { en: 'The series always diverges', id: 'Deretnya selalu divergen' },
                { en: 'The series converges conditionally', id: 'Deretnya konvergen bersyarat' },
              ],
              answer: 0,
              explain: {
                en: '$L=1$ is the boundary case where the Ratio Test gives no information at all — both convergent series (like $\\sum 1/n^2$) and divergent ones (like $\\sum 1/n$) can produce $L=1$.',
                id: '$L=1$ adalah kasus batas tempat Uji Rasio sama sekali tak memberi informasi — baik deret konvergen (seperti $\\sum 1/n^2$) maupun divergen (seperti $\\sum 1/n$) bisa menghasilkan $L=1$.',
              },
              hint: {
                en: 'Re-read the three-way verdict stated right after the Ratio Test formula — what is said specifically about the case $L=1$?',
                id: 'Baca ulang putusan tiga arah yang dinyatakan tepat setelah rumus Uji Rasio — apa yang dikatakan khusus tentang kasus $L=1$?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps of the Ratio Test applied to $\\sum \\dfrac{3^n}{n!}$.',
                id: 'Susun langkah Uji Rasio yang diterapkan pada $\\sum \\dfrac{3^n}{n!}$.',
              },
              lines: [
                '\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{3^{n+1}/(n+1)!}{3^n/n!} = \\dfrac{3}{n+1}',
                '\\lim_{n\\to\\infty}\\dfrac{3}{n+1} = 0',
                'L=0<1 \\Rightarrow \\text{converges absolutely}',
              ],
              explain: {
                en: 'First simplify the ratio of consecutive terms algebraically, then take its limit, then read the verdict off the resulting L.',
                id: 'Pertama sederhanakan rasio suku berurutan secara aljabar, lalu ambil limitnya, lalu baca putusannya dari L yang dihasilkan.',
              },
              hint: {
                en: 'The verdict at the end depends on the numeric value of L, which does not exist until the limit in the middle step has actually been taken.',
                id: 'Putusan di akhir bergantung pada nilai numerik L, yang belum ada sampai limit pada langkah tengah benar-benar diambil.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $\\sum \\dfrac{n}{3^n}$, find $L = \\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$.',
                id: 'Untuk $\\sum \\dfrac{n}{3^n}$, cari $L = \\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$.',
              },
              blanks: [{ answer: 1 / 3 }],
              hints: [
                { en: '$\\dfrac{a_{n+1}}{a_n} = \\dfrac{(n+1)/3^{n+1}}{n/3^n} = \\dfrac{n+1}{3n}$.', id: '$\\dfrac{a_{n+1}}{a_n} = \\dfrac{(n+1)/3^{n+1}}{n/3^n} = \\dfrac{n+1}{3n}$.' },
              ],
              explain: {
                en: '$\\dfrac{n+1}{3n}\\to\\dfrac13$ as $n\\to\\infty$ — since $L=\\frac13<1$, the series converges absolutely.',
                id: '$\\dfrac{n+1}{3n}\\to\\dfrac13$ ketika $n\\to\\infty$ — karena $L=\\frac13<1$, deretnya konvergen mutlak.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m3-s1-p',
        runtime: 'math',
        title: { en: 'Ratio and Root Tests', id: 'Uji Rasio dan Uji Akar' },
        brief: {
          en: 'Three series, each settled by whichever of the two tests fits its shape best.',
          id: 'Tiga deret, masing-masing dituntaskan oleh uji mana pun dari keduanya yang paling cocok dengan bentuknya.',
        },
        requirements: [
          { en: 'The Ratio Test compares consecutive terms; the Root Test is more natural when the whole term is raised to the nth power.', id: 'Uji Rasio membandingkan suku berurutan; Uji Akar lebih alami ketika seluruh suku dipangkatkan ke-n.' },
          { en: '$L<1$ converges absolutely, $L>1$ diverges, $L=1$ is inconclusive — for either test.', id: '$L<1$ konvergen mutlak, $L>1$ divergen, $L=1$ tak tuntas — untuk uji mana pun.' },
        ],
        tasks: [
          {
            prompt: { en: 'For $\\sum \\dfrac{2^n}{n!}$, find $L = \\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$.', id: 'Untuk $\\sum \\dfrac{2^n}{n!}$, cari $L = \\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$.' },
            blanks: [{ answer: 0 }],
            solution: ['\\dfrac{a_{n+1}}{a_n} = \\dfrac{2}{n+1} \\to 0 \\Rightarrow \\text{konvergen mutlak}'],
          },
          {
            prompt: { en: 'For $\\sum \\left(\\dfrac{2n+1}{3n}\\right)^n$, find $L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}$.', id: 'Untuk $\\sum \\left(\\dfrac{2n+1}{3n}\\right)^n$, cari $L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}$.' },
            blanks: [{ answer: 2 / 3, tol: 0.01 }],
            solution: ['\\sqrt[n]{|a_n|} = \\dfrac{2n+1}{3n} \\to \\dfrac23 \\approx 0{,}67'],
          },
          {
            prompt: { en: 'For $\\sum \\dfrac{n!}{n^n}$, find $L = \\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$. (Round to four decimal places.)', id: 'Untuk $\\sum \\dfrac{n!}{n^n}$, cari $L = \\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$. (Bulatkan ke empat desimal.)' },
            blanks: [{ answer: 1 / Math.E, tol: 0.001 }],
            solution: ["\\dfrac{a_{n+1}}{a_n} = \\dfrac{n^n}{(n+1)^n} = \\left(\\dfrac{n}{n+1}\\right)^n \\to \\dfrac1e \\approx 0{,}3679"],
          },
        ],
        hints: [
          { en: 'A factorial in $a_n$ almost always calls for the Ratio Test — $(n+1)!/n!$ collapses to just $n+1$.', id: 'Faktorial dalam $a_n$ hampir selalu memanggil Uji Rasio — $(n+1)!/n!$ runtuh menjadi sekadar $n+1$.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------- 9.6 alternating series and conditional convergence */
    {
      id: 'der-m3-s2',
      title: { en: 'Alternating Series and Conditional Convergence', id: 'Deret Berselang dan Konvergensi Bersyarat' },
      summary: {
        en: 'A dedicated test for series that alternate sign, plus an error bound that comes for free — and the standing example of conditional convergence.',
        id: 'Uji khusus untuk deret yang berselang tanda, plus batas galat yang datang secara cuma-cuma — dan contoh baku konvergensi bersyarat.',
      },
      lessons: [
        {
          id: 'der-m3-s2-l1',
          title: { en: 'The Alternating Series Test', id: 'Uji Deret Berselang' },
          goal: {
            en: 'Apply the Alternating Series Test, and identify the alternating harmonic series as conditionally convergent.',
            id: 'Menerapkan Uji Deret Berselang, dan mengenali deret harmonik berselang sebagai konvergen bersyarat.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Overshooting less and less, on alternating sides', id: 'Melampaui makin sedikit, di sisi yang berselang-seling' },
              body: {
                en: 'An **alternating series** has the form $\\sum (-1)^{n+1} b_n$ with every $b_n>0$. The **Alternating Series Test** (Leibniz\'s Test): if $b_n$ is eventually decreasing and $b_n\\to 0$, the series **converges**. The idea: each partial sum overshoots the limit on the opposite side of the last one, by a strictly smaller amount every time — the partial sums zigzag inward, trapped tighter and tighter.\n\nFor $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n}$ — the **alternating harmonic series** — $b_n=1/n$ is decreasing and $b_n\\to 0$: it **converges**, unlike its all-positive relative from the last module.',
                id: 'Sebuah **deret berselang** berbentuk $\\sum (-1)^{n+1} b_n$ dengan tiap $b_n>0$. **Uji Deret Berselang** (Uji Leibniz): jika $b_n$ akhirnya menurun dan $b_n\\to 0$, deretnya **konvergen**. Gagasannya: tiap jumlah parsial melampaui limitnya di sisi yang berlawanan dari yang terakhir, dengan jumlah yang strict lebih kecil tiap kali — jumlah parsialnya berzigzag ke dalam, terjepit makin ketat.\n\nUntuk $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n}$ — **deret harmonik berselang** — $b_n=1/n$ menurun dan $b_n\\to 0$: ia **konvergen**, tak seperti kerabat semua-positifnya dari modul terakhir.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 9],
                ySpan: [0.4, 1.1],
                ticks: true,
                items: [
                  { t: 'dot', x: 1, y: 1, color: 'a' },
                  { t: 'dot', x: 2, y: 0.5, color: 'a' },
                  { t: 'dot', x: 3, y: 0.833, color: 'a' },
                  { t: 'dot', x: 4, y: 0.583, color: 'a' },
                  { t: 'dot', x: 5, y: 0.783, color: 'a' },
                  { t: 'dot', x: 6, y: 0.617, color: 'a' },
                  { t: 'dot', x: 7, y: 0.76, color: 'a' },
                  { t: 'dot', x: 8, y: 0.635, color: 'a' },
                  { t: 'hline', y: 0.693, color: 'result', dashed: true, label: 'ln 2' },
                ],
                caption: {
                  en: 'Partial sums of the alternating harmonic series zigzag above and below $\\ln 2\\approx 0.693$, overshooting by less each time — squeezed inward toward the limit exactly as the test\'s argument describes.',
                  id: 'Jumlah parsial deret harmonik berselang berzigzag di atas dan bawah $\\ln 2\\approx 0{,}693$, melampaui makin sedikit tiap kali — terjepit ke dalam menuju limitnya persis seperti dideskripsikan argumen ujinya.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Conditional, not absolute', id: 'Bersyarat, bukan mutlak' },
              body: {
                en: 'Taking absolute values of $\\sum \\dfrac{(-1)^{n+1}}{n}$ gives exactly the harmonic series $\\sum \\dfrac{1}{n}$, proved divergent by the Integral Test. So the alternating harmonic series **converges**, but not **absolutely** — the textbook example of **conditional convergence** promised in the previous lesson. This is also why the Alternating Series Test had to exist as its own separate tool: neither the Integral Test, nor either comparison test, nor the Ratio Test (which gives $L=1$ here — inconclusive) can settle this series on its own; each needs the terms to behave in ways the sign-flipping defeats.',
                id: 'Mengambil nilai mutlak dari $\\sum \\dfrac{(-1)^{n+1}}{n}$ memberi persis deret harmonik $\\sum \\dfrac{1}{n}$, terbukti divergen menurut Uji Integral. Jadi deret harmonik berselang **konvergen**, tetapi tidak **mutlak** — contoh baku **konvergensi bersyarat** yang dijanjikan pelajaran sebelumnya. Inilah juga sebabnya Uji Deret Berselang harus ada sebagai alat terpisahnya sendiri: baik Uji Integral, kedua uji perbandingan, maupun Uji Rasio (yang memberi $L=1$ di sini — tak tuntas) tak satu pun bisa menuntaskan deret ini sendirian; masing-masing memerlukan suku yang berperilaku dengan cara yang dikalahkan pergantian tandanya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 8],
                ySpan: [-0.1, 1.1],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 0.5, to: 8, color: 'muted', dashed: true, label: '|aₙ|=1/n' },
                ],
                caption: {
                  en: 'Stripped of its alternating sign, $|a_n|=1/n$ is exactly the harmonic series — divergent, which is precisely why the original series is conditionally, not absolutely, convergent.',
                  id: 'Dilucuti tanda berselangnya, $|a_n|=1/n$ persis deret harmonik — divergen, yang persis sebabnya deret aslinya konvergen bersyarat, bukan mutlak.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What two conditions does the Alternating Series Test require of $b_n$?',
                id: 'Dua syarat apa yang dituntut Uji Deret Berselang dari $b_n$?',
              },
              options: [
                { en: 'Eventually decreasing, and $b_n \\to 0$', id: 'Akhirnya menurun, dan $b_n \\to 0$' },
                { en: 'Increasing without bound', id: 'Bertumbuh tanpa batas' },
                { en: '$b_n$ must be constant', id: '$b_n$ harus konstan' },
                { en: 'No conditions at all', id: 'Tak ada syarat sama sekali' },
              ],
              answer: 0,
              explain: {
                en: 'Both are required: decreasing keeps each new overshoot smaller than the last, and $b_n\\to 0$ shrinks the overshoot to nothing in the limit.',
                id: 'Keduanya dituntut: menurun membuat setiap lampauan baru lebih kecil dari yang terakhir, dan $b_n\\to 0$ menyusutkan lampauannya menjadi tak ada dalam limit.',
              },
              hint: {
                en: 'Re-read the test\'s statement in the first concept — it names exactly two properties $b_n$ must have.',
                id: 'Baca ulang pernyataan ujinya pada konsep pertama — ia menamai persis dua sifat yang harus dimiliki $b_n$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the classification of the alternating harmonic series.',
                id: 'Lengkapi klasifikasi deret harmonik berselang.',
              },
              template: '\\sum \\dfrac{(-1)^{n+1}}{n} \\text{ converges, but } \\sum \\dfrac{1}{n} \\text{ diverges} \\Rightarrow ___ \\text{ convergence}',
              blanks: ['conditional'],
              explain: {
                en: 'A series that converges while its absolute-value series diverges is, by definition, conditionally convergent.',
                id: 'Deret yang konvergen sementara deret nilai mutlaknya divergen adalah, menurut definisi, konvergen bersyarat.',
              },
              hint: {
                en: 'This is the exact phrase used earlier for a series in exactly this situation — converging, but not absolutely.',
                id: 'Ini persis istilah yang dipakai sebelumnya untuk deret dalam situasi persis ini — konvergen, tetapi tak mutlak.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Is $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{\\sqrt{n}}$ convergent by the Alternating Series Test? Type $1$ for yes, $0$ for no.',
                id: 'Apakah $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{\\sqrt{n}}$ konvergen menurut Uji Deret Berselang? Ketik $1$ untuk ya, $0$ untuk tidak.',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Check: is $b_n=1/\\sqrt{n}$ decreasing? Does it go to $0$?', id: 'Periksa: apakah $b_n=1/\\sqrt{n}$ menurun? Apakah menuju $0$?' },
              ],
              explain: {
                en: '$b_n=1/\\sqrt{n}$ is decreasing and $\\to 0$, so the Alternating Series Test applies — the series converges (conditionally, since $\\sum 1/\\sqrt{n}$ is a divergent p-series with $p=1/2$).',
                id: '$b_n=1/\\sqrt{n}$ menurun dan $\\to 0$, sehingga Uji Deret Berselang berlaku — deretnya konvergen (bersyarat, sebab $\\sum 1/\\sqrt{n}$ deret-p divergen dengan $p=1/2$).',
              },
            },
          ],
        },
        {
          id: 'der-m3-s2-l2',
          title: { en: 'The Alternating Series Estimation Theorem', id: 'Teorema Taksiran Deret Berselang' },
          goal: {
            en: 'Bound the error in a partial-sum approximation of an alternating series, and use it to find how many terms are needed for a target accuracy.',
            id: 'Membatasi galat pada hampiran jumlah parsial sebuah deret berselang, dan memakainya untuk mencari berapa suku diperlukan untuk akurasi target.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The error is smaller than the first term left out', id: 'Galatnya lebih kecil dari suku pertama yang ditinggalkan' },
              body: {
                en: 'The zigzag picture from the last lesson gives an error bound for free: since each partial sum overshoots the true sum $S$ by less than the next term, stopping after $n$ terms leaves an error no bigger than the very next one:\n$$|S - S_n| \\leq b_{n+1}$$\nFor the alternating harmonic series, approximating $S=\\ln 2\\approx 0.6931$ by $S_4 = 1-\\tfrac12+\\tfrac13-\\tfrac14 = 0.5833$: the bound says $|S-S_4|\\leq b_5=\\tfrac15=0.2$, and the true error is $|0.6931-0.5833|=0.1098$ — safely under the guaranteed bound, as it must be.',
                id: 'Gambaran zigzag dari pelajaran terakhir memberi batas galat secara cuma-cuma: karena tiap jumlah parsial melampaui jumlah sebenarnya $S$ dengan kurang dari suku berikutnya, berhenti setelah $n$ suku menyisakan galat tak lebih besar dari suku berikutnya persis:\n$$|S - S_n| \\leq b_{n+1}$$\nUntuk deret harmonik berselang, menghampiri $S=\\ln 2\\approx 0.6931$ dengan $S_4 = 1-\\tfrac12+\\tfrac13-\\tfrac14 = 0.5833$: batasnya mengatakan $|S-S_4|\\leq b_5=\\tfrac15=0.2$, dan galat sebenarnya adalah $|0.6931-0.5833|=0.1098$ — aman di bawah batas yang dijamin, seperti yang seharusnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 7],
                ySpan: [0.4, 1.1],
                ticks: true,
                items: [
                  { t: 'dot', x: 4, y: 0.583, color: 'a', label: 'S₄' },
                  { t: 'hline', y: 0.693, color: 'result', dashed: true, label: 'S=ln 2' },
                  { t: 'seg', from: [4, 0.583], to: [4, 0.693], color: 'b' },
                ],
                caption: {
                  en: 'The gap between $S_4$ and the true sum $S$ (the vertical segment) is guaranteed no larger than $b_5=1/5=0.2$ — the size of the very next term, never seen in the sum itself.',
                  id: 'Celah antara $S_4$ dan jumlah sebenarnya $S$ (segmen tegak) dijamin tak lebih besar dari $b_5=1/5=0.2$ — ukuran suku berikutnya, yang tak pernah terlihat dalam jumlahnya sendiri.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Working backward: how many terms for a target accuracy', id: 'Bekerja mundur: berapa suku untuk akurasi target' },
              body: {
                en: 'The bound runs equally well in reverse: to guarantee $|S-S_n|<0.001$ for the alternating harmonic series, it suffices that $b_{n+1}=\\dfrac{1}{n+1}<0.001$, i.e. $n+1>1000$, so $n\\geq 1000$ terms are enough. Compare this to numerical integration from the Techniques of Integration course: there too, a target accuracy was turned into a required number of subdivisions by solving an inequality — the exact same move, on a different kind of approximation.',
                id: 'Batasnya berjalan sama baiknya secara terbalik: untuk menjamin $|S-S_n|<0.001$ untuk deret harmonik berselang, cukup $b_{n+1}=\\dfrac{1}{n+1}<0.001$, yaitu $n+1>1000$, sehingga $n\\geq 1000$ suku sudah cukup. Bandingkan ini dengan integral numerik dari kursus Teknik Pengintegralan: di sana pun, akurasi target diubah menjadi jumlah subdivisi yang diperlukan dengan menyelesaikan sebuah pertidaksamaan — gerakan yang persis sama, pada jenis hampiran yang berbeda.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 12],
                ySpan: [-0.05, 0.5],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/x', from: 1, to: 12, color: 'a' },
                  { t: 'hline', y: 0.1, color: 'muted', dashed: true, label: 'target' },
                ],
                caption: {
                  en: 'The required term count is read off by finding where $b_n=1/n$ first drops below the target error — the same "solve for n" move that fixed a number of rectangles in the Integrals course.',
                  id: 'Jumlah suku yang diperlukan dibaca dengan mencari tempat $b_n=1/n$ pertama kali jatuh di bawah galat target — gerakan "selesaikan untuk n" yang sama yang menetapkan banyak persegi panjang pada kursus Integral.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What does the Alternating Series Estimation Theorem bound the error by?',
                id: 'Uji Taksiran Deret Berselang membatasi galat dengan apa?',
              },
              options: [
                { en: 'The absolute value of the first omitted term, $b_{n+1}$', id: 'Nilai mutlak suku pertama yang dihilangkan, $b_{n+1}$' },
                { en: 'The sum of all omitted terms added together first', id: 'Jumlah semua suku yang dihilangkan, dijumlahkan lebih dahulu' },
                { en: 'Exactly zero, always', id: 'Tepat nol, selalu' },
                { en: 'The value of the first term, $b_1$', id: 'Nilai suku pertama, $b_1$' },
              ],
              answer: 0,
              explain: {
                en: 'The bound is $|S-S_n|\\leq b_{n+1}$ — the size of the very next term the partial sum stopped short of, not the whole infinite tail summed up.',
                id: 'Batasnya adalah $|S-S_n|\\leq b_{n+1}$ — ukuran suku berikutnya persis yang belum dicapai jumlah parsial, bukan seluruh ekor tak hingganya dijumlahkan.',
              },
              hint: {
                en: 'Re-read the boxed inequality in the first concept — which single term does it name, $b_n$ or $b_{n+1}$?',
                id: 'Baca ulang pertidaksamaan berkotak pada konsep pertama — suku tunggal mana yang dinamainya, $b_n$ atau $b_{n+1}$?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that find how many terms of $\\sum \\dfrac{(-1)^{n+1}}{n^2}$ guarantee an error under $0.01$.',
                id: 'Susun langkah yang mencari berapa suku dari $\\sum \\dfrac{(-1)^{n+1}}{n^2}$ menjamin galat di bawah $0.01$.',
              },
              lines: [
                '\\text{Need } b_{n+1} = \\dfrac{1}{(n+1)^2} < 0.01',
                '(n+1)^2 > 100 \\Rightarrow n+1 > 10',
                'n \\geq 10 \\text{ terms suffice}',
              ],
              explain: {
                en: 'Set up the inequality from the error bound first, then solve it algebraically, then state the final answer as a whole number of terms.',
                id: 'Susun pertidaksamaan dari batas galat lebih dahulu, lalu selesaikan secara aljabar, lalu nyatakan jawaban akhir sebagai bilangan bulat suku.',
              },
              hint: {
                en: 'The inequality must be written down before it can be solved, and it must be solved before a specific number of terms can be stated.',
                id: 'Pertidaksamaannya harus dituliskan sebelum bisa diselesaikan, dan harus diselesaikan sebelum jumlah suku tertentu bisa dinyatakan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Approximate $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n}$ by $S_3$, and give the guaranteed error bound $b_4$.',
                id: 'Hampiri $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n}$ dengan $S_3$, dan berikan batas galat yang dijamin $b_4$.',
              },
              blanks: [
                { label: 'S_3 =', answer: 1 - 0.5 + 1 / 3, tol: 0.001 },
                { label: 'b_4 =', answer: 0.25 },
              ],
              hints: [
                { en: '$S_3 = 1 - \\tfrac12 + \\tfrac13$, and $b_4 = 1/4$.', id: '$S_3 = 1 - \\tfrac12 + \\tfrac13$, dan $b_4 = 1/4$.' },
              ],
              explain: {
                en: '$S_3 = 1-0.5+0.3333=0.8333$, and the guaranteed error is at most $b_4=0.25$.',
                id: '$S_3 = 1-0.5+0.3333=0.8333$, dan galat yang dijamin paling banyak $b_4=0.25$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'der-m3-s2-p',
        runtime: 'math',
        title: { en: 'Alternating Series', id: 'Deret Berselang' },
        brief: {
          en: 'Classifying a series, computing an error bound, and solving for a required term count.',
          id: 'Mengklasifikasikan sebuah deret, menghitung batas galat, dan menyelesaikan jumlah suku yang diperlukan.',
        },
        requirements: [
          { en: 'The Alternating Series Test needs $b_n$ eventually decreasing and $b_n\\to 0$.', id: 'Uji Deret Berselang memerlukan $b_n$ akhirnya menurun dan $b_n\\to 0$.' },
          { en: 'The error after n terms is bounded by $b_{n+1}$, the size of the first omitted term.', id: 'Galat setelah n suku dibatasi oleh $b_{n+1}$, ukuran suku pertama yang dihilangkan.' },
        ],
        tasks: [
          {
            prompt: { en: 'Is $\\sum_{n=1}^{\\infty}\\dfrac{(-1)^{n+1}}{n}$ absolutely convergent, conditionally convergent, or divergent? Type $2$ for absolute, $1$ for conditional, $0$ for divergent.', id: 'Apakah $\\sum_{n=1}^{\\infty}\\dfrac{(-1)^{n+1}}{n}$ konvergen mutlak, konvergen bersyarat, atau divergen? Ketik $2$ untuk mutlak, $1$ untuk bersyarat, $0$ untuk divergen.' },
            blanks: [{ answer: 1 }],
            solution: ['\\sum a_n \\text{ konvergen (Uji Deret Berselang)}, \\ \\sum|a_n|=\\sum\\tfrac1n \\text{ divergen} \\Rightarrow \\text{bersyarat}'],
          },
          {
            prompt: { en: 'For $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n^2}$, find the error bound guaranteed after 5 terms, $b_6$.', id: 'Untuk $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n^2}$, cari batas galat yang dijamin setelah 5 suku, $b_6$.' },
            blanks: [{ answer: 1 / 36, tol: 0.001 }],
            solution: ['b_6 = \\dfrac{1}{6^2} = \\dfrac{1}{36} \\approx 0{,}0278'],
          },
          {
            prompt: { en: 'How many terms n of $\\sum \\dfrac{(-1)^{n+1}}{n^3}$ guarantee an error under $0.001$? (Smallest such n.)', id: 'Berapa suku n dari $\\sum \\dfrac{(-1)^{n+1}}{n^3}$ yang menjamin galat di bawah $0.001$? (n terkecil demikian.)' },
            blanks: [{ answer: 10 }],
            solution: ['b_{n+1}=\\dfrac{1}{(n+1)^3}<0.001 \\Rightarrow (n+1)^3>1000 \\Rightarrow n+1>10 \\Rightarrow n\\geq 10'],
          },
        ],
        hints: [
          { en: 'The error bound is always the size of the very next term — one step past where the sum was cut off.', id: 'Batas galat selalu ukuran suku berikutnya persis — satu langkah melewati tempat jumlahnya dipotong.' },
        ],
        xp: 50,
      },
    },
  ],
}
