import type { Module } from '../types'

/** Module 2 — computing limits without a table. The limit laws turn a limit
 *  of a combination into a combination of limits, and two algebraic moves —
 *  factoring and rationalising — rescue the $\frac{0}{0}$ cases where direct
 *  substitution refuses to answer. */
export const module2: Module = {
  id: 'lim-m2',
  title: { en: 'Limit Laws and Algebraic Technique', id: 'Hukum Limit dan Teknik Aljabar' },
  summary: {
    en: 'Direct substitution and the limit laws, then factoring and rationalising for the cases substitution refuses.',
    id: 'Substitusi langsung dan hukum limit, lalu pemfaktoran dan perasionalan untuk kasus yang ditolak substitusi.',
  },
  submodules: [
    /* -------------------------------------------------- 2.1 the limit laws */
    {
      id: 'lim-m2-s1',
      title: { en: 'The Limit Laws', id: 'Hukum Limit' },
      summary: {
        en: 'Evaluate a limit by direct substitution, and combine limits with the sum, product and quotient laws.',
        id: 'Menghitung limit dengan substitusi langsung, dan menggabungkan limit dengan hukum jumlah, hasil kali, dan hasil bagi.',
      },
      lessons: [
        {
          id: 'lim-m2-s1-l1',
          title: { en: 'Direct Substitution', id: 'Substitusi Langsung' },
          goal: {
            en: 'Evaluate a limit of a polynomial or a well-behaved rational function by plugging in.',
            id: 'Menghitung limit fungsi polinom atau fungsi rasional yang baik dengan langsung memasukkan nilainya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'When the function already agrees with its limit', id: 'Ketika fungsi sudah sepakat dengan limitnya' },
              body: {
                en: 'For a polynomial $p(x)$, the graph has no holes, no jumps, and no gaps anywhere — it is drawn in one unbroken stroke. So the value the curve is heading toward at $x = a$ is simply the value it has there:\n$$\\lim_{x \\to a} p(x) = p(a)$$\nThis is **direct substitution**: plug $a$ straight in. It works for every polynomial, and for a rational function $\\dfrac{p(x)}{q(x)}$ at any $a$ with $q(a) \\neq 0$ — the same unbroken-curve reasoning applies away from the denominator\'s zeros.\n\nThis is most limits, most of the time. The interesting work of this module begins exactly where it stops working: at a zero of the denominator.',
                id: 'Untuk polinom $p(x)$, grafiknya tak berlubang, tak melompat, dan tak bercelah di mana pun — ia digambar dalam satu goresan tanpa putus. Jadi nilai yang dituju kurvanya di $x = a$ sekadar nilai yang dimilikinya di situ:\n$$\\lim_{x \\to a} p(x) = p(a)$$\nInilah **substitusi langsung**: masukkan $a$ begitu saja. Ini berlaku untuk setiap polinom, dan untuk fungsi rasional $\\dfrac{p(x)}{q(x)}$ pada $a$ mana pun dengan $q(a) \\neq 0$ — alasan kurva-tanpa-putus yang sama berlaku jauh dari akar-akar penyebutnya.\n\nInilah sebagian besar limit, sebagian besar waktu. Pekerjaan menarik modul ini justru dimulai tepat di tempat ini berhenti bekerja: di akar penyebutnya.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 4],
                ySpan: [-2, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-x-1', color: 'a' },
                  { t: 'dot', x: 2, y: 1, color: 'result' },
                ],
                caption: {
                  en: 'A polynomial, unbroken everywhere. Whatever the curve is doing right at $x = 2$ is exactly what it is heading toward — $\\lim_{x \\to 2}(x^2-x-1) = p(2) = 1$, no extra work required.',
                  id: 'Sebuah polinom, tak putus di mana pun. Apa pun yang dilakukan kurvanya tepat di $x = 2$ persis sama dengan yang dituju — $\\lim_{x \\to 2}(x^2-x-1) = p(2) = 1$, tanpa perlu kerja tambahan.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For which of these can $\\lim_{x \\to 2} f(x)$ be found by direct substitution?',
                id: 'Untuk manakah $\\lim_{x \\to 2} f(x)$ dapat dicari lewat substitusi langsung?',
              },
              options: [
                { en: '$f(x) = \\dfrac{x+1}{x-5}$', id: '$f(x) = \\dfrac{x+1}{x-5}$' },
                { en: '$f(x) = \\dfrac{x+1}{x-2}$', id: '$f(x) = \\dfrac{x+1}{x-2}$' },
                { en: '$f(x) = \\dfrac{x-2}{x^2-4}$', id: '$f(x) = \\dfrac{x-2}{x^2-4}$' },
                { en: '$f(x) = \\dfrac{x-2}{x-2}$', id: '$f(x) = \\dfrac{x-2}{x-2}$' },
              ],
              answer: 0,
              explain: {
                en: 'Direct substitution needs the denominator to be non-zero at $x=2$. Only $x - 5$ survives that check at $x = 2$ — the other three all vanish at $x = 2$, which is exactly the $\\frac{0}{0}$ situation this module is about to fix.',
                id: 'Substitusi langsung memerlukan penyebutnya tak nol di $x=2$. Hanya $x - 5$ yang lolos pemeriksaan itu di $x = 2$ — tiga lainnya semuanya nol di $x = 2$, dan itulah persis situasi $\\frac{0}{0}$ yang akan segera diperbaiki modul ini.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the direct substitution for $\\lim_{x \\to 3}(2x^2 - 5x + 1)$.',
                id: 'Lengkapi substitusi langsung untuk $\\lim_{x \\to 3}(2x^2 - 5x + 1)$.',
              },
              template: '\\lim_{x \\to 3}(2x^2 - 5x + 1) = 2(3)^2 - 5(3) + 1 = 18 - 15 + 1 = ___',
              blanks: ['4'],
              explain: {
                en: '$18 - 15 + 1 = 4$. A polynomial never needs anything more than this.',
                id: '$18 - 15 + 1 = 4$. Polinom tak pernah butuh apa pun lebih dari ini.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate each by direct substitution.',
                id: 'Hitung masing-masing dengan substitusi langsung.',
              },
              blanks: [
                { label: '\\lim_{x \\to -1}(x^3 + 2x) =', answer: -3 },
                { label: '\\lim_{x \\to 2} \\dfrac{x+3}{x-5} =', answer: -5 / 3 },
              ],
              hints: [
                { en: 'The second denominator is $2 - 5 = -3 \\neq 0$, so substitution is allowed.', id: 'Penyebut kedua adalah $2 - 5 = -3 \\neq 0$, jadi substitusi diperbolehkan.' },
              ],
              explain: {
                en: '$(-1)^3 + 2(-1) = -1 - 2 = -3$. And $\\dfrac{2+3}{2-5} = \\dfrac{5}{-3} = -\\tfrac{5}{3}$ — the denominator survived the check, so plugging straight in was legal.',
                id: '$(-1)^3 + 2(-1) = -1 - 2 = -3$. Dan $\\dfrac{2+3}{2-5} = \\dfrac{5}{-3} = -\\tfrac{5}{3}$ — penyebutnya lolos pemeriksaan, jadi memasukkan langsung sah dilakukan.',
              },
            },
          ],
        },
        {
          id: 'lim-m2-s1-l2',
          title: { en: 'The Sum, Product and Quotient Laws', id: 'Hukum Jumlah, Hasil Kali, dan Hasil Bagi' },
          goal: {
            en: 'Break a limit of a combination into limits of its pieces, and know the one condition the quotient law needs.',
            id: 'Memecah limit dari sebuah gabungan menjadi limit bagian-bagiannya, dan mengetahui satu syarat yang diperlukan hukum hasil bagi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A limit distributes over arithmetic', id: 'Limit terdistribusi pada operasi hitung' },
              body: {
                en: 'If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$, both existing, then\n$$\\lim_{x \\to a}\\big(f(x) + g(x)\\big) = L + M, \\qquad \\lim_{x \\to a}\\big(f(x)g(x)\\big) = LM$$\n$$\\lim_{x \\to a}\\big(k f(x)\\big) = kL \\text{ for a constant } k, \\qquad \\lim_{x \\to a}\\sqrt[n]{f(x)} = \\sqrt[n]{L}$$\nEach of these says the same thing: to find the limit of a combination, find the limit of each piece separately, then combine the numbers. This is exactly why direct substitution works on a whole polynomial at once — every $+$, every power, every constant multiple inside it obeys one of these laws.',
                id: 'Jika $\\lim_{x \\to a} f(x) = L$ dan $\\lim_{x \\to a} g(x) = M$, keduanya ada, maka\n$$\\lim_{x \\to a}\\big(f(x) + g(x)\\big) = L + M, \\qquad \\lim_{x \\to a}\\big(f(x)g(x)\\big) = LM$$\n$$\\lim_{x \\to a}\\big(k f(x)\\big) = kL \\text{ untuk konstanta } k, \\qquad \\lim_{x \\to a}\\sqrt[n]{f(x)} = \\sqrt[n]{L}$$\nMasing-masing mengatakan hal yang sama: untuk mencari limit sebuah gabungan, cari limit tiap bagiannya sendiri-sendiri, lalu gabungkan bilangannya. Inilah persis sebabnya substitusi langsung berhasil pada seluruh polinom sekaligus — setiap $+$, setiap pangkat, setiap kelipatan konstanta di dalamnya mematuhi salah satu hukum ini.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The quotient law needs one extra promise', id: 'Hukum hasil bagi memerlukan satu janji tambahan' },
              body: {
                en: 'Division gets its own law, with a condition attached:\n$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{L}{M} \\qquad \\text{provided } M \\neq 0$$\nThat proviso is the whole reason this module exists. When $M = 0$, the quotient law simply refuses to speak — it is not that the limit is automatically infinite or automatically undefined, only that this particular law has nothing to say, and a different technique is needed to find out what actually happens. That is exactly the $\\frac{0}{0}$ situation from the last lesson, and it gets its own techniques starting next lesson.',
                id: 'Pembagian punya hukumnya sendiri, dengan satu syarat yang menyertainya:\n$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{L}{M} \\qquad \\text{asalkan } M \\neq 0$$\nSyarat itulah seluruh alasan modul ini ada. Ketika $M = 0$, hukum hasil bagi sekadar menolak berbicara — bukan berarti limitnya otomatis tak hingga atau otomatis tak terdefinisi, hanya saja hukum ini tak punya apa pun untuk dikatakan, dan teknik yang berbeda diperlukan untuk mengetahui apa yang sebenarnya terjadi. Itulah persis situasi $\\frac{0}{0}$ dari pelajaran sebelumnya, dan ia mendapat tekniknya sendiri mulai pelajaran berikutnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'If $\\lim_{x \\to a} f(x) = 4$ and $\\lim_{x \\to a} g(x) = 0$, what does the quotient law say about $\\lim_{x \\to a} \\dfrac{f(x)}{g(x)}$?',
                id: 'Jika $\\lim_{x \\to a} f(x) = 4$ dan $\\lim_{x \\to a} g(x) = 0$, apa yang dikatakan hukum hasil bagi tentang $\\lim_{x \\to a} \\dfrac{f(x)}{g(x)}$?',
              },
              options: [
                { en: 'Nothing — the law does not apply when the denominator\'s limit is $0$', id: 'Tak ada — hukum ini tak berlaku bila limit penyebutnya $0$' },
                { en: 'It equals $4$', id: 'Sama dengan $4$' },
                { en: 'It equals $0$', id: 'Sama dengan $0$' },
                { en: 'It does not exist, guaranteed', id: 'Dijamin tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'The quotient law explicitly requires $M \\neq 0$. With $M = 0$ it simply does not apply — the true answer could be a finite number, an infinite limit, or no limit at all, and finding out takes a different technique, not this law.',
                id: 'Hukum hasil bagi secara tegas memerlukan $M \\neq 0$. Dengan $M = 0$ ia sekadar tak berlaku — jawaban sebenarnya bisa berupa bilangan berhingga, limit tak hingga, atau tak ada limit sama sekali, dan mengetahuinya memerlukan teknik yang berbeda, bukan hukum ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $\\lim_{x \\to 2}\\big(3x^2 + \\sqrt{x+2}\\big)$ using the limit laws.',
                id: 'Susun langkah untuk $\\lim_{x \\to 2}\\big(3x^2 + \\sqrt{x+2}\\big)$ dengan memakai hukum limit.',
              },
              lines: [
                '\\lim_{x \\to 2} 3x^2 = 3(2)^2 = 12',
                '\\lim_{x \\to 2} \\sqrt{x+2} = \\sqrt{2+2} = 2',
                '\\lim_{x \\to 2}\\big(3x^2 + \\sqrt{x+2}\\big) = 12 + 2',
                '\\lim_{x \\to 2}\\big(3x^2 + \\sqrt{x+2}\\big) = 14',
              ],
              explain: {
                en: 'Split by the sum law, evaluate each piece by direct substitution, then add the two numbers back together. Splitting is only the first step — the pieces still have to be finished and recombined.',
                id: 'Pecah dengan hukum jumlah, hitung tiap bagiannya dengan substitusi langsung, lalu jumlahkan kembali kedua bilangannya. Pemecahan hanyalah langkah pertama — bagian-bagiannya masih harus diselesaikan dan digabung kembali.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Given $\\lim_{x \\to 1} f(x) = 6$ and $\\lim_{x \\to 1} g(x) = 3$, use the limit laws to find each.',
                id: 'Diberikan $\\lim_{x \\to 1} f(x) = 6$ dan $\\lim_{x \\to 1} g(x) = 3$, pakai hukum limit untuk mencari masing-masing.',
              },
              blanks: [
                { label: '\\lim_{x \\to 1}\\big(f(x) - g(x)\\big) =', answer: 3 },
                { label: '\\lim_{x \\to 1}\\big(f(x)\\,g(x)\\big) =', answer: 18 },
                { label: '\\lim_{x \\to 1} \\dfrac{f(x)}{g(x)} =', answer: 2 },
              ],
              hints: [
                { en: 'The quotient law applies here since $g$\'s limit, $3$, is not $0$.', id: 'Hukum hasil bagi berlaku di sini sebab limit $g$, yaitu $3$, tak sama dengan $0$.' },
              ],
              explain: {
                en: '$6 - 3 = 3$, $6 \\times 3 = 18$, and $6 / 3 = 2$ — each law used exactly once, and the quotient law was allowed because $M = 3 \\neq 0$.',
                id: '$6 - 3 = 3$, $6 \\times 3 = 18$, dan $6 / 3 = 2$ — tiap hukum dipakai tepat sekali, dan hukum hasil bagi diperbolehkan karena $M = 3 \\neq 0$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m2-s1-p',
        runtime: 'math',
        title: { en: 'Substitution and the Laws', id: 'Substitusi dan Hukum-hukumnya' },
        brief: {
          en: 'Two limits by direct substitution, and one combination built from two given limits.',
          id: 'Dua limit lewat substitusi langsung, dan satu gabungan yang disusun dari dua limit yang diberikan.',
        },
        requirements: [
          { en: 'Check the denominator is non-zero before substituting into a quotient.', id: 'Periksa penyebutnya tak nol sebelum mensubstitusi ke dalam hasil bagi.' },
          { en: 'Fractions are read as they are: `-5/3` needs no decimal.', id: 'Pecahan dibaca apa adanya: `-5/3` tak perlu diubah ke desimal.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\lim_{x \\to -2}(x^2 - 3x + 1)$.', id: 'Hitung $\\lim_{x \\to -2}(x^2 - 3x + 1)$.' },
            blanks: [{ answer: 11 }],
            solution: ['(-2)^2 - 3(-2) + 1 = 4 + 6 + 1 = 11'],
          },
          {
            prompt: { en: 'Evaluate $\\lim_{x \\to 4} \\dfrac{x+1}{x-10}$.', id: 'Hitung $\\lim_{x \\to 4} \\dfrac{x+1}{x-10}$.' },
            blanks: [{ answer: -5 / 6 }],
            solution: ['\\dfrac{4+1}{4-10} = \\dfrac{5}{-6} = -\\tfrac{5}{6}'],
          },
          {
            prompt: {
              en: 'Given $\\lim_{x \\to 5} f(x) = -2$ and $\\lim_{x \\to 5} g(x) = 4$, find $\\lim_{x \\to 5}\\big(3f(x) + g(x)\\big)$.',
              id: 'Diberikan $\\lim_{x \\to 5} f(x) = -2$ dan $\\lim_{x \\to 5} g(x) = 4$, tentukan $\\lim_{x \\to 5}\\big(3f(x) + g(x)\\big)$.',
            },
            blanks: [{ answer: -2 }],
            solution: ['3(-2) + 4 = -6 + 4 = -2'],
          },
        ],
        hints: [
          { en: 'Part 3 needs the constant-multiple law before the sum law.', id: 'Butir 3 memerlukan hukum kelipatan konstanta sebelum hukum jumlah.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------- 2.2 techniques for 0/0 */
    {
      id: 'lim-m2-s2',
      title: { en: 'Technique for the $\\frac{0}{0}$ Form', id: 'Teknik untuk Bentuk $\\frac{0}{0}$' },
      summary: {
        en: 'Factor and cancel, or multiply by a conjugate, to get past a zero denominator that direct substitution cannot.',
        id: 'Faktorkan dan coret, atau kalikan dengan sekawan, untuk melewati penyebut nol yang tak bisa dilewati substitusi langsung.',
      },
      lessons: [
        {
          id: 'lim-m2-s2-l1',
          title: { en: 'Factoring and Cancelling', id: 'Memfaktorkan dan Mencoret' },
          goal: {
            en: 'Recognise the $\\frac{0}{0}$ form and clear it by factoring the numerator and denominator.',
            id: 'Mengenali bentuk $\\frac{0}{0}$ dan menyelesaikannya dengan memfaktorkan pembilang dan penyebut.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The warning sign, and the fix', id: 'Tanda peringatan, dan cara memperbaikinya' },
              body: {
                en: 'Substitute $x = a$ into $\\dfrac{p(x)}{q(x)}$ and get $\\dfrac{0}{0}$: that is not an answer, it is a **sign that $(x-a)$ divides both** the numerator and the denominator. Factor each, cancel the shared $(x-a)$, and substitute again into what is left — which, unlike the original, is no longer $\\frac{0}{0}$ at $a$.\n$$\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3}(x+3) = 6$$\nThe cancelling step is legal precisely because a limit never looks at $x = a$ itself — for every $x$ actually being considered, $x \\neq 3$, so $\\dfrac{x-3}{x-3} = 1$ honestly, with nothing hidden.',
                id: 'Substitusikan $x = a$ ke $\\dfrac{p(x)}{q(x)}$ dan diperoleh $\\dfrac{0}{0}$: itu bukan jawaban, melainkan **tanda bahwa $(x-a)$ membagi habis** baik pembilang maupun penyebut. Faktorkan masing-masing, coret $(x-a)$ yang sama, lalu substitusikan lagi ke sisanya — yang, tak seperti semula, sudah bukan $\\frac{0}{0}$ lagi di $a$.\n$$\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3}(x+3) = 6$$\nLangkah mencoret ini sah persis karena limit tak pernah memandang $x = a$ itu sendiri — untuk setiap $x$ yang sungguh-sungguh sedang dipertimbangkan, $x \\neq 3$, sehingga $\\dfrac{x-3}{x-3} = 1$ secara jujur, tanpa ada yang disembunyikan.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x^2-9)/(x-3)', color: 'a' },
                  { t: 'dot', x: 3, y: 6, open: true, color: 'a' },
                ],
                caption: {
                  en: 'After cancelling, the curve is just the line $y = x+3$ — with a hole exactly at the $x$ that made the original denominator zero. The limit is the height of that hole.',
                  id: 'Setelah mencoret, kurvanya sekadar garis $y = x+3$ — dengan lubang tepat di $x$ yang membuat penyebut aslinya nol. Limitnya adalah tinggi lubang itu.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Substituting $x = 4$ into $\\dfrac{x^2 - 16}{x - 4}$ gives $\\dfrac{0}{0}$. What does that tell you?',
                id: 'Mensubstitusi $x = 4$ ke $\\dfrac{x^2 - 16}{x - 4}$ memberi $\\dfrac{0}{0}$. Apa artinya?',
              },
              options: [
                { en: '$(x - 4)$ divides both the top and the bottom — factor and cancel', id: '$(x - 4)$ membagi habis pembilang dan penyebut — faktorkan dan coret' },
                { en: 'The limit does not exist', id: 'Limitnya tak ada' },
                { en: 'The limit is $0$', id: 'Limitnya $0$' },
                { en: 'The function is undefined everywhere', id: 'Fungsinya tak terdefinisi di mana pun' },
              ],
              answer: 0,
              explain: {
                en: '$\\frac{0}{0}$ is a signal to factor, not a final answer. $x^2 - 16 = (x-4)(x+4)$, and the shared $(x-4)$ cancels, revealing $x + 4 \\to 8$.',
                id: '$\\frac{0}{0}$ adalah sinyal untuk memfaktorkan, bukan jawaban akhir. $x^2 - 16 = (x-4)(x+4)$, dan $(x-4)$ yang sama tercoret, menampakkan $x + 4 \\to 8$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph of $y = \\dfrac{x^2-9}{x-3}$ below, what does it suggest for $\\lim_{x \\to 3} \\dfrac{x^2-9}{x-3}$?',
                id: 'Dengan membaca grafik $y = \\dfrac{x^2-9}{x-3}$ di bawah, apa yang disarankannya untuk $\\lim_{x \\to 3} \\dfrac{x^2-9}{x-3}$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x^2-9)/(x-3)', color: 'a' },
                  { t: 'dot', x: 3, y: 6, open: true, color: 'a' },
                ],
              },
              options: [
                { en: '6', id: '6' },
                { en: '3', id: '3' },
                { en: '0', id: '0' },
                { en: 'It does not exist', id: 'Tak ada' },
              ],
              answer: 0,
              explain: {
                en: 'The line the curve traces heads straight for the hollow point at height $6$ as $x \\to 3$ from either side.',
                id: 'Garis yang ditelusuri kurvanya menuju tepat ke titik kosong pada tinggi $6$ saat $x \\to 3$ dari sisi mana pun.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\displaystyle\\lim_{x \\to -1} \\frac{x^2 + 4x + 3}{x + 1}$ by factoring.',
                id: 'Hitung $\\displaystyle\\lim_{x \\to -1} \\frac{x^2 + 4x + 3}{x + 1}$ dengan memfaktorkan.',
              },
              blanks: [{ label: '\\lim_{x \\to -1} \\tfrac{x^2+4x+3}{x+1} =', answer: 2 }],
              hints: [
                { en: '$x^2 + 4x + 3 = (x+1)(x+3)$.', id: '$x^2 + 4x + 3 = (x+1)(x+3)$.' },
              ],
              explain: {
                en: '$\\dfrac{(x+1)(x+3)}{x+1} = x+3 \\to 2$ as $x \\to -1$.',
                id: '$\\dfrac{(x+1)(x+3)}{x+1} = x+3 \\to 2$ saat $x \\to -1$.',
              },
            },
          ],
        },
        {
          id: 'lim-m2-s2-l2',
          title: { en: 'Rationalising', id: 'Merasionalkan' },
          goal: {
            en: 'Clear a $\\frac{0}{0}$ that has a square root in it by multiplying through by a conjugate.',
            id: 'Menyelesaikan $\\frac{0}{0}$ yang mengandung akar kuadrat dengan mengalikan dengan sekawan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Nothing to factor — so multiply instead', id: 'Tak ada yang bisa difaktorkan — jadi kalikan saja' },
              body: {
                en: 'Try $\\lim_{x \\to 0} \\dfrac{\\sqrt{x+4}-2}{x}$: substitution gives $\\dfrac{0}{0}$, but there is no common factor sitting in plain sight — a square root is in the way. Multiply top and bottom by the **conjugate** of the root, $\\sqrt{x+4}+2$, which is $1$ in disguise and changes nothing:\n$$\\frac{\\sqrt{x+4}-2}{x} \\cdot \\frac{\\sqrt{x+4}+2}{\\sqrt{x+4}+2} = \\frac{(x+4) - 4}{x\\left(\\sqrt{x+4}+2\\right)} = \\frac{x}{x\\left(\\sqrt{x+4}+2\\right)}$$\nThe difference of squares in the numerator kills the root, leaving an $x$ that now cancels with the $x$ downstairs:\n$$= \\frac{1}{\\sqrt{x+4}+2} \\ \\to \\ \\frac{1}{4} \\text{ as } x \\to 0$$\nSame idea as factoring — clear a hidden common factor — carried out with a different tool because a root does not factor the ordinary way.',
                id: 'Coba $\\lim_{x \\to 0} \\dfrac{\\sqrt{x+4}-2}{x}$: substitusi memberi $\\dfrac{0}{0}$, tetapi tak ada faktor sekutu yang tampak jelas — sebuah akar menghalangi. Kalikan pembilang dan penyebut dengan **sekawan** akarnya, $\\sqrt{x+4}+2$, yang tak lain adalah $1$ yang menyamar dan tak mengubah apa pun:\n$$\\frac{\\sqrt{x+4}-2}{x} \\cdot \\frac{\\sqrt{x+4}+2}{\\sqrt{x+4}+2} = \\frac{(x+4) - 4}{x\\left(\\sqrt{x+4}+2\\right)} = \\frac{x}{x\\left(\\sqrt{x+4}+2\\right)}$$\nSelisih kuadrat pada pembilang membunuh akarnya, menyisakan $x$ yang kini tercoret dengan $x$ di bawahnya:\n$$= \\frac{1}{\\sqrt{x+4}+2} \\ \\to \\ \\frac{1}{4} \\text{ saat } x \\to 0$$\nGagasan yang sama seperti pemfaktoran — menyingkirkan faktor sekutu tersembunyi — dijalankan dengan alat berbeda karena akar tak difaktorkan dengan cara biasa.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which is the conjugate of $\\sqrt{x+9} - 3$?',
                id: 'Manakah sekawan dari $\\sqrt{x+9} - 3$?',
              },
              options: [
                { en: '$\\sqrt{x+9} + 3$', id: '$\\sqrt{x+9} + 3$' },
                { en: '$\\sqrt{x+9} - 3$', id: '$\\sqrt{x+9} - 3$' },
                { en: '$\\sqrt{x-9} + 3$', id: '$\\sqrt{x-9} + 3$' },
                { en: '$-\\sqrt{x+9} - 3$', id: '$-\\sqrt{x+9} - 3$' },
              ],
              answer: 0,
              explain: {
                en: 'The conjugate flips the sign between the two terms, leaving the root itself alone: $\\sqrt{x+9}+3$. Multiplying $(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)$ gives $(x+9) - 9 = x$, a difference of squares with the root gone.',
                id: 'Sekawan membalik tanda di antara kedua sukunya, membiarkan akarnya sendiri tetap: $\\sqrt{x+9}+3$. Mengalikan $(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)$ memberi $(x+9) - 9 = x$, selisih kuadrat dengan akarnya lenyap.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the working for $\\lim_{x \\to 0} \\dfrac{\\sqrt{x+9}-3}{x}$.',
                id: 'Susun langkah untuk $\\lim_{x \\to 0} \\dfrac{\\sqrt{x+9}-3}{x}$.',
              },
              lines: [
                '\\frac{\\sqrt{x+9}-3}{x} \\cdot \\frac{\\sqrt{x+9}+3}{\\sqrt{x+9}+3} = \\frac{(x+9)-9}{x(\\sqrt{x+9}+3)}',
                '= \\frac{x}{x(\\sqrt{x+9}+3)}',
                '= \\frac{1}{\\sqrt{x+9}+3}',
                '\\to \\frac{1}{\\sqrt{9}+3} = \\frac{1}{6} \\text{ as } x \\to 0',
              ],
              explain: {
                en: 'Multiply by the conjugate, simplify the numerator to a plain $x$, cancel it against the $x$ already downstairs, then substitute into what remains — the root has done its damage and gone.',
                id: 'Kalikan dengan sekawan, sederhanakan pembilangnya menjadi $x$ biasa, coret dengan $x$ yang sudah ada di bawah, lalu substitusikan ke sisanya — akarnya sudah selesai bekerja dan lenyap.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\displaystyle\\lim_{x \\to 0} \\frac{\\sqrt{x+9}-3}{x}$.',
                id: 'Hitung $\\displaystyle\\lim_{x \\to 0} \\frac{\\sqrt{x+9}-3}{x}$.',
              },
              blanks: [{ answer: 1 / 6 }],
              hints: [
                { en: 'Multiply by the conjugate $\\sqrt{x+9}+3$ over itself, as in the order-the-steps exercise above.', id: 'Kalikan dengan sekawan $\\sqrt{x+9}+3$ atas dirinya sendiri, seperti pada latihan menyusun langkah di atas.' },
              ],
              explain: {
                en: 'The working above gives $\\frac{1}{\\sqrt{x+9}+3} \\to \\frac{1}{6}$ as $x \\to 0$.',
                id: 'Penyelesaian di atas memberi $\\frac{1}{\\sqrt{x+9}+3} \\to \\frac{1}{6}$ saat $x \\to 0$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m2-s2-p',
        runtime: 'math',
        title: { en: 'Clearing the $\\frac{0}{0}$ Form', id: 'Menyelesaikan Bentuk $\\frac{0}{0}$' },
        brief: {
          en: 'A factoring limit, a rationalising limit, and one where you decide which tool to use.',
          id: 'Satu limit pemfaktoran, satu limit perasionalan, dan satu yang alatnya kamu tentukan sendiri.',
        },
        requirements: [
          { en: 'A $\\frac{0}{0}$ result is a sign to factor or rationalise, never a final answer.', id: 'Hasil $\\frac{0}{0}$ adalah tanda untuk memfaktorkan atau merasionalkan, tak pernah jawaban akhir.' },
          { en: 'Always cancel before substituting the second time.', id: 'Selalu coret dahulu sebelum mensubstitusi untuk kedua kalinya.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Evaluate $\\displaystyle\\lim_{x \\to 2} \\frac{x^2 - x - 2}{x - 2}$.',
              id: 'Hitung $\\displaystyle\\lim_{x \\to 2} \\frac{x^2 - x - 2}{x - 2}$.',
            },
            blanks: [{ answer: 3 }],
            solution: ['x^2-x-2 = (x-2)(x+1) \\Rightarrow \\lim_{x \\to 2}(x+1) = 3'],
          },
          {
            prompt: {
              en: 'Evaluate $\\displaystyle\\lim_{x \\to 0} \\frac{\\sqrt{x+1}-1}{x}$.',
              id: 'Hitung $\\displaystyle\\lim_{x \\to 0} \\frac{\\sqrt{x+1}-1}{x}$.',
            },
            blanks: [{ answer: 0.5 }],
            solution: [
              '\\frac{\\sqrt{x+1}-1}{x}\\cdot\\frac{\\sqrt{x+1}+1}{\\sqrt{x+1}+1} = \\frac{x}{x(\\sqrt{x+1}+1)} = \\frac{1}{\\sqrt{x+1}+1} \\to \\frac{1}{2}',
            ],
          },
          {
            prompt: {
              en: 'Evaluate $\\displaystyle\\lim_{x \\to 3} \\frac{x^2 - 9}{x^2 - x - 6}$.',
              id: 'Hitung $\\displaystyle\\lim_{x \\to 3} \\frac{x^2 - 9}{x^2 - x - 6}$.',
            },
            blanks: [{ answer: 1.2 }],
            solution: [
              '\\frac{(x-3)(x+3)}{(x-3)(x+2)} = \\frac{x+3}{x+2} \\to \\frac{6}{5} = 1{,}2 \\text{ as } x \\to 3',
            ],
          },
        ],
        hints: [
          { en: 'Part 3 has a $\\frac{0}{0}$ hiding on both top and bottom — factor both fully before cancelling anything.', id: 'Butir 3 menyembunyikan $\\frac{0}{0}$ di pembilang maupun penyebut — faktorkan keduanya sepenuhnya sebelum mencoret apa pun.' },
        ],
        xp: 50,
      },
    },
  ],
}
