import type { Module } from '../types'

/** Module 3 — the two integration techniques that carry most of the weight in
 *  practice, and neither is new machinery: one reverses the chain rule, the
 *  other reverses the product rule. Every hard integral in this module is a
 *  disguised derivative rule from the last course, worked backwards. */
export const module3: Module = {
  id: 'int-m3',
  title: { en: 'Substitution and Integration by Parts', id: 'Substitusi dan Integral Parsial' },
  summary: {
    en: 'Reversing the chain rule to integrate a composition, and reversing the product rule to integrate a product.',
    id: 'Membalik aturan rantai untuk mengintegralkan komposisi, dan membalik aturan hasil kali untuk mengintegralkan hasil kali.',
  },
  submodules: [
    /* --------------------------------------------------------- 3.1 u-substitution */
    {
      id: 'int-m3-s1',
      title: { en: 'u-Substitution', id: 'Substitusi u' },
      summary: {
        en: 'Spotting a disguised chain rule inside an integral, and adjusting the bounds when the integral is definite.',
        id: 'Mengenali aturan rantai yang tersamar di dalam sebuah integral, dan menyesuaikan batasnya ketika integralnya tentu.',
      },
      lessons: [
        {
          id: 'int-m3-s1-l1',
          title: { en: 'Reversing the Chain Rule', id: 'Membalik Aturan Rantai' },
          goal: {
            en: 'Recognise an integral as a disguised chain rule, and substitute u for the inner function to integrate it.',
            id: 'Mengenali sebuah integral sebagai aturan rantai yang tersamar, dan mensubstitusikan u untuk fungsi dalamnya agar bisa diintegralkan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An integral with a derivative hiding inside it', id: 'Integral dengan turunan yang bersembunyi di dalamnya' },
              body: {
                en: 'The chain rule says $\\frac{d}{dx}\\big[F(g(x))\\big] = F\'(g(x))\\cdot g\'(x)$. Read backwards, any integral shaped like "a function of $g(x)$, times $g\'(x)$" antidifferentiates by naming the inner function:\n$$\\int (x^2+1)^5 \\cdot 2x\\,dx$$\nLet $u = x^2+1$. Then $\\frac{du}{dx} = 2x$, so $du = 2x\\,dx$ — the exact factor sitting in the integral. Substituting turns it into something the power rule already knows:\n$$\\int u^5\\,du = \\frac{u^6}{6} + C = \\frac{(x^2+1)^6}{6} + C$$\nCheck by differentiating the answer with the chain rule: $\\frac{d}{dx}\\left[\\frac{(x^2+1)^6}{6}\\right] = \\frac{6(x^2+1)^5}{6}\\cdot 2x = (x^2+1)^5\\cdot 2x$ — exactly the original integrand.',
                id: 'Aturan rantai menyatakan $\\frac{d}{dx}\\big[F(g(x))\\big] = F\'(g(x))\\cdot g\'(x)$. Dibaca terbalik, integral mana pun berbentuk "fungsi dari $g(x)$, dikali $g\'(x)$" diantiturunkan dengan menamai fungsi dalamnya:\n$$\\int (x^2+1)^5 \\cdot 2x\\,dx$$\nMisalkan $u = x^2+1$. Maka $\\frac{du}{dx} = 2x$, sehingga $du = 2x\\,dx$ — persis faktor yang duduk di dalam integralnya. Mensubstitusikannya mengubahnya menjadi sesuatu yang sudah dikenal aturan pangkat:\n$$\\int u^5\\,du = \\frac{u^6}{6} + C = \\frac{(x^2+1)^6}{6} + C$$\nPeriksa dengan menurunkan jawabannya memakai aturan rantai: $\\frac{d}{dx}\\left[\\frac{(x^2+1)^6}{6}\\right] = \\frac{6(x^2+1)^5}{6}\\cdot 2x = (x^2+1)^5\\cdot 2x$ — persis integrand aslinya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'When a constant needs adjusting first', id: 'Ketika sebuah konstanta perlu disesuaikan lebih dahulu' },
              body: {
                en: 'The integrand rarely hands over $du$ exactly — usually it is off by a constant, which can be patched by scaling. For $\\int x\\cos(x^2)\\,dx$: let $u = x^2$, so $du = 2x\\,dx$, meaning $x\\,dx = \\frac{1}{2}du$. Substitute:\n$$\\int \\cos(x^2)\\cdot x\\,dx = \\int \\cos u \\cdot \\frac{1}{2}\\,du = \\frac{1}{2}\\int \\cos u\\,du = \\frac{1}{2}\\sin u + C = \\frac{1}{2}\\sin(x^2) + C$$\nThe constant $\\frac{1}{2}$ can always be pulled outside the integral; what can *never* be patched this way is a missing variable factor — $\\int \\cos(x^2)\\,dx$ alone, with no $x$ to absorb into $du$, is not solvable by this substitution at all.',
                id: 'Integrannya jarang menyerahkan $du$ persis — biasanya berbeda oleh sebuah konstanta, yang bisa ditambal dengan penskalaan. Untuk $\\int x\\cos(x^2)\\,dx$: misalkan $u = x^2$, sehingga $du = 2x\\,dx$, berarti $x\\,dx = \\frac{1}{2}du$. Substitusikan:\n$$\\int \\cos(x^2)\\cdot x\\,dx = \\int \\cos u \\cdot \\frac{1}{2}\\,du = \\frac{1}{2}\\int \\cos u\\,du = \\frac{1}{2}\\sin u + C = \\frac{1}{2}\\sin(x^2) + C$$\nKonstanta $\\frac{1}{2}$ selalu bisa ditarik keluar integral; yang *tak pernah* bisa ditambal dengan cara ini adalah faktor peubah yang hilang — $\\int \\cos(x^2)\\,dx$ sendirian, tanpa $x$ untuk diserap ke $du$, sama sekali tak bisa diselesaikan dengan substitusi ini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What makes an integral a good candidate for u-substitution?',
                id: 'Apa yang membuat sebuah integral kandidat yang baik untuk substitusi u?',
              },
              options: [
                { en: 'It contains a function of an inner expression, multiplied by that inner expression\'s own derivative', id: 'Ia memuat fungsi dari sebuah ekspresi dalam, dikalikan dengan turunan ekspresi dalam itu sendiri' },
                { en: 'It contains any product of two functions whatsoever', id: 'Ia memuat hasil kali dua fungsi apa pun' },
                { en: 'It is always a rational function', id: 'Ia selalu berupa fungsi rasional' },
                { en: 'It has no relation to the chain rule at all', id: 'Sama sekali tak berkaitan dengan aturan rantai' },
              ],
              answer: 0,
              explain: {
                en: 'That exact shape — outer function of $g(x)$, times $g\'(x)$ — is what the chain rule produces going forward, so it is what u-substitution can undo going backward.',
                id: 'Bentuk persis itu — fungsi luar dari $g(x)$, dikali $g\'(x)$ — adalah yang dihasilkan aturan rantai maju, sehingga itulah yang bisa dibalikkan substitusi u.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'For $\\int x\\cos(x^2)\\,dx$, what should $u$ be?',
                id: 'Untuk $\\int x\\cos(x^2)\\,dx$, apa yang seharusnya menjadi $u$?',
              },
              options: [
                { en: '$x^2$', id: '$x^2$' },
                { en: '$\\cos(x)$', id: '$\\cos(x)$' },
                { en: '$x$', id: '$x$' },
                { en: '$\\cos(x^2)$', id: '$\\cos(x^2)$' },
              ],
              answer: 0,
              explain: {
                en: '$x^2$ is the inner function, and its derivative $2x$ is (up to the constant $2$) exactly the leftover factor $x$ — the signature shape of a chain-rule integral.',
                id: '$x^2$ adalah fungsi dalamnya, dan turunannya $2x$ adalah (hingga konstanta $2$) persis faktor sisa $x$ — bentuk khas integral aturan rantai.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the substitution for $\\int 3x^2(x^3+4)^4\\,dx$.',
                id: 'Lengkapi substitusi untuk $\\int 3x^2(x^3+4)^4\\,dx$.',
              },
              template: 'u = x^3+4, \\quad du = ___\\,dx, \\quad \\int u^4\\,du = \\dfrac{u^___}{5} + C',
              blanks: ['3x^2', '5'],
              explain: {
                en: '$du = 3x^2\\,dx$ matches the leftover factor exactly, so no scaling is needed; the power rule then raises the exponent to $5$.',
                id: '$du = 3x^2\\,dx$ cocok persis dengan faktor sisanya, sehingga tak perlu penskalaan; aturan pangkat lalu menaikkan pangkatnya menjadi $5$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Find the antiderivative of $f(x) = x(x^2+1)^3$ with $C = 0$, then evaluate it at $x = 1$.',
                id: 'Cari antiturunan dari $f(x) = x(x^2+1)^3$ dengan $C = 0$, lalu hitung nilainya di $x = 1$.',
              },
              blanks: [{ answer: 2 }],
              hints: [
                { en: '$u = x^2+1$, $du = 2x\\,dx$, so $x\\,dx = du/2$.', id: '$u = x^2+1$, $du = 2x\\,dx$, sehingga $x\\,dx = du/2$.' },
                { en: '$F(x) = (x^2+1)^4/8$.', id: '$F(x) = (x^2+1)^4/8$.' },
              ],
              explain: {
                en: '$F(x) = (x^2+1)^4/8$. $F(1) = 2^4/8 = 16/8 = 2$.',
                id: '$F(x) = (x^2+1)^4/8$. $F(1) = 2^4/8 = 16/8 = 2$.',
              },
            },
          ],
        },
        {
          id: 'int-m3-s1-l2',
          title: { en: 'u-Substitution in Definite Integrals', id: 'Substitusi u pada Integral Tentu' },
          goal: {
            en: 'Change the bounds of integration to match u when substituting inside a definite integral.',
            id: 'Mengubah batas integrasi agar sesuai dengan u ketika mensubstitusi di dalam integral tentu.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The bounds were written for x, not for u', id: 'Batasnya ditulis untuk x, bukan untuk u' },
              body: {
                en: 'A definite integral\'s bounds are $x$-values. Once $u$ replaces $x$ throughout the integrand, those bounds must be translated too — otherwise the final subtraction plugs $u$-values into a formula that was substituted expecting them, but was never told the switch happened.\n\nFor $\\int_0^1 2x(x^2+1)^3\\,dx$: let $u = x^2+1$, $du = 2x\\,dx$. Convert the bounds: at $x=0$, $u = 0^2+1 = 1$; at $x=1$, $u = 1^2+1 = 2$. The integral becomes entirely a $u$-integral, bounds included:\n$$\\int_1^2 u^3\\,du = \\left[\\frac{u^4}{4}\\right]_1^2 = \\frac{16}{4} - \\frac{1}{4} = \\frac{15}{4}$$\nNo need to ever switch back to $x$ — the bounds already did that translation.',
                id: 'Batas integral tentu adalah nilai-nilai $x$. Begitu $u$ menggantikan $x$ di seluruh integrand, batas itu pun harus diterjemahkan — jika tidak, pengurangan terakhirnya memasukkan nilai $u$ ke rumus yang disubstitusi dengan mengharapkan nilai itu, tetapi tak pernah diberi tahu pergantiannya terjadi.\n\nUntuk $\\int_0^1 2x(x^2+1)^3\\,dx$: misalkan $u = x^2+1$, $du = 2x\\,dx$. Ubah batasnya: di $x=0$, $u = 0^2+1 = 1$; di $x=1$, $u = 1^2+1 = 2$. Integralnya menjadi seluruhnya integral $u$, batasnya termasuk:\n$$\\int_1^2 u^3\\,du = \\left[\\frac{u^4}{4}\\right]_1^2 = \\frac{16}{4} - \\frac{1}{4} = \\frac{15}{4}$$\nTak perlu pernah beralih kembali ke $x$ — batasnya sudah melakukan terjemahan itu.',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 1.5],
                ySpan: [-0.5, 9],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0, 2], [0.25, 2.30], [0.5, 3.13], [0.75, 4.66], [1, 8], [1, 0]], color: 'result' },
                  { t: 'curve', f: '2*x*(x^2+1)^3', from: 0, to: 1, color: 'a' },
                ],
                caption: {
                  en: 'The shaded area under $y = 2x(x^2+1)^3$ from $x = 0$ to $x = 1$ — computed above as $15/4$ by switching entirely to $u$.',
                  id: 'Daerah bayangan di bawah $y = 2x(x^2+1)^3$ dari $x = 0$ sampai $x = 1$ — dihitung di atas sebagai $15/4$ dengan beralih sepenuhnya ke $u$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The alternative: substitute back before evaluating', id: 'Alternatifnya: substitusikan kembali sebelum mengevaluasi' },
              body: {
                en: 'The bounds may instead be left in terms of $x$, provided the antiderivative is converted back to $x$ before substituting: $\\int u^3\\,du = \\frac{u^4}{4} = \\frac{(x^2+1)^4}{4}$, then $\\left[\\frac{(x^2+1)^4}{4}\\right]_0^1 = \\frac{16}{4} - \\frac{1}{4} = \\frac{15}{4}$ — the same answer, reached by undoing the substitution instead of translating the bounds. Either approach works; changing the bounds is usually less bookkeeping, since it avoids ever writing $x$ again.',
                id: 'Batasnya bisa juga dibiarkan dalam bentuk $x$, asalkan antiturunannya dikonversi kembali ke $x$ sebelum disubstitusikan: $\\int u^3\\,du = \\frac{u^4}{4} = \\frac{(x^2+1)^4}{4}$, lalu $\\left[\\frac{(x^2+1)^4}{4}\\right]_0^1 = \\frac{16}{4} - \\frac{1}{4} = \\frac{15}{4}$ — jawaban yang sama, dicapai dengan membalik substitusinya alih-alih menerjemahkan batasnya. Kedua pendekatan berlaku; mengubah batasnya biasanya lebih sedikit pembukuan, sebab menghindari harus menulis $x$ lagi.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'When substituting u for x in a definite integral, what must happen to the bounds of integration?',
                id: 'Ketika mensubstitusi u untuk x pada integral tentu, apa yang harus terjadi pada batas integrasinya?',
              },
              options: [
                { en: 'They must be converted to the corresponding u-values, or the antiderivative must be converted back to x before substituting', id: 'Harus dikonversi ke nilai u yang bersesuaian, atau antiturunannya harus dikonversi kembali ke x sebelum disubstitusikan' },
                { en: 'They stay exactly the same numbers regardless', id: 'Tetap sama persis angkanya, apa pun yang terjadi' },
                { en: 'They must be swapped with each other', id: 'Harus ditukar satu sama lain' },
                { en: 'Definite integrals cannot use u-substitution at all', id: 'Integral tentu sama sekali tak bisa memakai substitusi u' },
              ],
              answer: 0,
              explain: {
                en: 'The bounds are $x$-values; once the integral is entirely rewritten in $u$, they must become the matching $u$-values (or the answer must be translated back to $x$ before the bounds are used).',
                id: 'Batasnya adalah nilai-nilai $x$; begitu integralnya seluruhnya ditulis ulang dalam $u$, batasnya harus menjadi nilai $u$ yang bersesuaian (atau jawabannya harus diterjemahkan kembali ke $x$ sebelum batasnya dipakai).',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the figure above, the shaded area from $x = 0$ to $x = 1$ was computed as $15/4$ by switching entirely to which variable?',
                id: 'Dengan membaca gambar di atas, daerah bayangan dari $x = 0$ sampai $x = 1$ dihitung sebagai $15/4$ dengan beralih sepenuhnya ke peubah apa?',
              },
              figure: {
                dim: 2,
                xSpan: [-0.3, 1.5],
                ySpan: [-0.5, 9],
                ticks: true,
                items: [
                  { t: 'poly', pts: [[0, 0], [0, 2], [0.25, 2.30], [0.5, 3.13], [0.75, 4.66], [1, 8], [1, 0]], color: 'result' },
                  { t: 'curve', f: '2*x*(x^2+1)^3', from: 0, to: 1, color: 'a' },
                ],
              },
              options: [
                { en: '$u$, with translated bounds $1$ to $2$', id: '$u$, dengan batas yang diterjemahkan $1$ sampai $2$' },
                { en: '$x$, using the original bounds throughout', id: '$x$, memakai batas aslinya sepanjang perhitungan' },
                { en: '$t$, an entirely new third variable', id: '$t$, peubah ketiga yang sama sekali baru' },
                { en: 'No variable — it was computed by rectangles alone', id: 'Tak ada peubah — dihitung hanya dengan persegi panjang' },
              ],
              answer: 0,
              explain: {
                en: 'The worked example switched to $u = x^2+1$ and translated the bounds to $u = 1$ and $u = 2$, never returning to $x$ at all.',
                id: 'Contoh yang dikerjakan beralih ke $u = x^2+1$ dan menerjemahkan batasnya menjadi $u = 1$ dan $u = 2$, tak pernah kembali ke $x$ sama sekali.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_0^{\\pi/2} \\sin(x)\\cos(x)\\,dx$ using $u = \\sin(x)$.',
                id: 'Hitung $\\int_0^{\\pi/2} \\sin(x)\\cos(x)\\,dx$ memakai $u = \\sin(x)$.',
              },
              blanks: [{ answer: 0.5 }],
              hints: [
                { en: '$du = \\cos(x)\\,dx$. At $x=0$, $u=0$; at $x=\\pi/2$, $u=1$.', id: '$du = \\cos(x)\\,dx$. Di $x=0$, $u=0$; di $x=\\pi/2$, $u=1$.' },
              ],
              explain: {
                en: 'The integral becomes $\\int_0^1 u\\,du = \\left[\\tfrac{u^2}{2}\\right]_0^1 = 0.5$.',
                id: 'Integralnya menjadi $\\int_0^1 u\\,du = \\left[\\tfrac{u^2}{2}\\right]_0^1 = 0,5$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m3-s1-p',
        runtime: 'math',
        title: { en: 'Substituting Through', id: 'Mensubstitusi Tuntas' },
        brief: {
          en: 'An indefinite substitution, and two definite integrals with translated bounds.',
          id: 'Satu substitusi tak tentu, dan dua integral tentu dengan batas yang diterjemahkan.',
        },
        requirements: [
          { en: 'Choose $u$ as the inner function whose derivative sits, up to a constant, elsewhere in the integrand.', id: 'Pilih $u$ sebagai fungsi dalam yang turunannya duduk, hingga sebuah konstanta, di tempat lain pada integrand.' },
          { en: 'Translate the bounds to $u$ before evaluating, or convert the antiderivative back to $x$ first.', id: 'Terjemahkan batasnya ke $u$ sebelum mengevaluasi, atau konversikan antiturunannya kembali ke $x$ lebih dahulu.' },
        ],
        tasks: [
          {
            prompt: { en: 'Find the antiderivative of $f(x) = 4x^3(x^4+2)^2$ with $C = 0$, then evaluate it at $x = 1$.', id: 'Cari antiturunan dari $f(x) = 4x^3(x^4+2)^2$ dengan $C = 0$, lalu hitung nilainya di $x = 1$.' },
            blanks: [{ answer: 9 }],
            solution: ['u=x^4+2, \\ du=4x^3\\,dx, \\quad F(x) = \\dfrac{(x^4+2)^3}{3}, \\quad F(1) = \\dfrac{27}{3} = 9'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^2 x\\cdot e^{x^2}\\,dx$. (Round to two decimal places.)', id: 'Hitung $\\int_0^2 x\\cdot e^{x^2}\\,dx$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 26.8 }],
            solution: ['u=x^2, \\ du=2x\\,dx, \\quad \\int_0^4 \\tfrac12 e^u\\,du = \\tfrac12(e^4-1) \\approx 26{,}80'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^1 \\dfrac{3x^2}{x^3+1}\\,dx$. (Round to two decimal places.)', id: 'Hitung $\\int_0^1 \\dfrac{3x^2}{x^3+1}\\,dx$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 0.69 }],
            solution: ['u=x^3+1, \\ du=3x^2\\,dx, \\quad \\int_1^2 \\tfrac{1}{u}\\,du = \\ln 2 \\approx 0{,}69'],
          },
        ],
        hints: [
          { en: 'Part 3 needs the $\\ln|u|$ antiderivative from Module 1 — the power rule cannot reach $1/u$.', id: 'Butir 3 memerlukan antiturunan $\\ln|u|$ dari Modul 1 — aturan pangkat tak bisa menjangkau $1/u$.' },
        ],
        xp: 50,
      },
    },

    /* -------------------------------------------------- 3.2 integration by parts */
    {
      id: 'int-m3-s2',
      title: { en: 'Integration by Parts', id: 'Integral Parsial' },
      summary: {
        en: 'Reversing the product rule to integrate a product of two unrelated functions, with repeated and circular examples.',
        id: 'Membalik aturan hasil kali untuk mengintegralkan hasil kali dua fungsi yang tak berkaitan, dengan contoh berulang dan melingkar.',
      },
      lessons: [
        {
          id: 'int-m3-s2-l1',
          title: { en: 'Reversing the Product Rule', id: 'Membalik Aturan Hasil Kali' },
          goal: {
            en: 'Derive the integration by parts formula from the product rule, and choose u and dv to simplify rather than complicate.',
            id: 'Menurunkan rumus integral parsial dari aturan hasil kali, dan memilih u serta dv untuk menyederhanakan, bukan mempersulit.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Integrating both sides of the product rule', id: 'Mengintegralkan kedua ruas aturan hasil kali' },
              body: {
                en: 'The product rule states $\\frac{d}{dx}[uv] = u\'v + uv\'$. Integrate both sides with respect to $x$:\n$$uv = \\int u\'v\\,dx + \\int uv\'\\,dx \\ \\Rightarrow \\ \\int uv\'\\,dx = uv - \\int u\'v\\,dx$$\nWritten with $dv = v\'\\,dx$ and $du = u\'\\,dx$, this is **integration by parts**:\n$$\\int u\\,dv = uv - \\int v\\,du$$\nu-substitution could not touch $\\int x\\cos x\\,dx$ — $x$ and $\\cos x$ are unrelated, with no inner-function relationship. But letting $u = x$ (differentiate it) and $dv = \\cos x\\,dx$ (integrate it), so $du = dx$ and $v = \\sin x$:\n$$\\int x\\cos x\\,dx = x\\sin x - \\int \\sin x\\,dx = x\\sin x + \\cos x + C$$',
                id: 'Aturan hasil kali menyatakan $\\frac{d}{dx}[uv] = u\'v + uv\'$. Integralkan kedua ruas terhadap $x$:\n$$uv = \\int u\'v\\,dx + \\int uv\'\\,dx \\ \\Rightarrow \\ \\int uv\'\\,dx = uv - \\int u\'v\\,dx$$\nDitulis dengan $dv = v\'\\,dx$ dan $du = u\'\\,dx$, ini adalah **integral parsial**:\n$$\\int u\\,dv = uv - \\int v\\,du$$\nSubstitusi u tak bisa menyentuh $\\int x\\cos x\\,dx$ — $x$ dan $\\cos x$ tak berkaitan, tanpa hubungan fungsi-dalam apa pun. Tetapi misalkan $u = x$ (turunkan) dan $dv = \\cos x\\,dx$ (integralkan), sehingga $du = dx$ dan $v = \\sin x$:\n$$\\int x\\cos x\\,dx = x\\sin x - \\int \\sin x\\,dx = x\\sin x + \\cos x + C$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Choosing u to shrink, not grow', id: 'Memilih u agar menyusut, bukan membesar' },
              body: {
                en: 'The formula trades $\\int u\\,dv$ for $\\int v\\,du$ — a good trade needs $du$ simpler than $u$, and $v$ no worse than $dv$ was. A rough priority for choosing $u$, sometimes remembered as **LIATE** (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential), picks whichever *simplifies* fastest under differentiation.\n\nFor $\\int x e^x\\,dx$: $x$ is algebraic, $e^x$ is exponential — LIATE says let $u = x$ (differentiates to the constant $1$) and $dv = e^x\\,dx$ (integrates to itself, $v = e^x$):\n$$\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C$$\nChoosing it backwards — $u = e^x$, $dv = x\\,dx$ — would trade one product integral for an even messier one, since $e^x$ never simplifies under differentiation.',
                id: 'Rumusnya menukar $\\int u\\,dv$ dengan $\\int v\\,du$ — pertukaran yang baik memerlukan $du$ lebih sederhana dari $u$, dan $v$ tak lebih buruk dari $dv$ semula. Prioritas kasar untuk memilih $u$, kadang diingat sebagai **LIATE** (Logaritma, Invers trigonometri, Aljabar, Trigonometri, Eksponen), memilih mana pun yang paling cepat *menyederhana* di bawah penurunan.\n\nUntuk $\\int x e^x\\,dx$: $x$ bersifat aljabar, $e^x$ bersifat eksponen — LIATE menyatakan misalkan $u = x$ (menurun menjadi konstanta $1$) dan $dv = e^x\\,dx$ (mengintegral menjadi dirinya sendiri, $v = e^x$):\n$$\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C$$\nMemilihnya terbalik — $u = e^x$, $dv = x\\,dx$ — akan menukar satu integral hasil kali dengan yang bahkan lebih rumit, sebab $e^x$ tak pernah menyederhana di bawah penurunan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Integration by parts is the reverse of which differentiation rule?',
                id: 'Integral parsial adalah kebalikan dari aturan penurunan yang mana?',
              },
              options: [
                { en: 'The product rule', id: 'Aturan hasil kali' },
                { en: 'The chain rule', id: 'Aturan rantai' },
                { en: 'The quotient rule', id: 'Aturan hasil bagi' },
                { en: 'The power rule', id: 'Aturan pangkat' },
              ],
              answer: 0,
              explain: {
                en: 'Integrating both sides of the product rule $\\frac{d}{dx}[uv] = u\'v + uv\'$ and rearranging produces exactly the integration by parts formula.',
                id: 'Mengintegralkan kedua ruas aturan hasil kali $\\frac{d}{dx}[uv] = u\'v + uv\'$ dan menata ulangnya menghasilkan persis rumus integral parsial.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'For $\\int x\\ln(x)\\,dx$, which choice of $u$ simplifies best under differentiation?',
                id: 'Untuk $\\int x\\ln(x)\\,dx$, pilihan $u$ mana yang paling menyederhana di bawah penurunan?',
              },
              options: [
                { en: '$u = \\ln(x)$, since its derivative $1/x$ is simpler than $\\ln(x)$ itself', id: '$u = \\ln(x)$, sebab turunannya $1/x$ lebih sederhana dari $\\ln(x)$ sendiri' },
                { en: '$u = x$, since it is already the simplest-looking piece', id: '$u = x$, sebab sudah terlihat paling sederhana' },
                { en: 'Either choice works equally well', id: 'Kedua pilihan bekerja sama baiknya' },
                { en: 'Neither piece can ever be integrated', id: 'Tak satu pun bagian yang bisa diintegralkan' },
              ],
              answer: 0,
              explain: {
                en: '$\\ln(x)$ has no elementary antiderivative found by inspection but differentiates to the simple $1/x$ — exactly the shrink integration by parts needs. $x$, meanwhile, integrates easily to $x^2/2$.',
                id: '$\\ln(x)$ tak punya antiturunan elementer yang mudah ditemukan tetapi menurun menjadi $1/x$ yang sederhana — persis penyusutan yang diperlukan integral parsial. $x$, sementara itu, mudah diintegralkan menjadi $x^2/2$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the integration by parts setup and result for $\\int x\\sin(x)\\,dx$.',
                id: 'Lengkapi penyusunan integral parsial dan hasilnya untuk $\\int x\\sin(x)\\,dx$.',
              },
              template: 'u = x, \\ dv = \\sin x\\,dx \\ \\Rightarrow \\ du = dx, \\ v = ___\\cos x \\quad \\Rightarrow \\quad \\int x\\sin x\\,dx = -x\\cos x + \\sin x + ___',
              blanks: ['-', 'C'],
              explain: {
                en: '$v = -\\cos x$, since that is the antiderivative of $\\sin x$. The final answer always keeps the $+C$ — an indefinite integral is a whole family.',
                id: '$v = -\\cos x$, sebab itulah antiturunan dari $\\sin x$. Jawaban akhirnya selalu menyimpan $+C$ — integral tak tentu adalah seluruh keluarga.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_0^1 x\\cdot e^x\\,dx$. (Round to two decimal places.)',
                id: 'Hitung $\\int_0^1 x\\cdot e^x\\,dx$. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: '$F(x) = xe^x - e^x$.', id: '$F(x) = xe^x - e^x$.' },
              ],
              explain: {
                en: '$F(1) - F(0) = (e - e) - (0 - 1) = 0 - (-1) = 1$.',
                id: '$F(1) - F(0) = (e - e) - (0 - 1) = 0 - (-1) = 1$.',
              },
            },
          ],
        },
        {
          id: 'int-m3-s2-l2',
          title: { en: 'Repeated and Circular Integration by Parts', id: 'Integral Parsial Berulang dan Melingkar' },
          goal: {
            en: 'Apply integration by parts more than once when a power remains, and solve for the integral algebraically when it reappears.',
            id: 'Menerapkan integral parsial lebih dari sekali ketika sebuah pangkat masih tersisa, dan menyelesaikan integralnya secara aljabar ketika ia muncul kembali.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'When one pass is not enough', id: 'Ketika satu putaran belum cukup' },
              body: {
                en: 'For $\\int x^2 e^x\\,dx$, one pass with $u=x^2$, $dv=e^x\\,dx$ gives $x^2e^x - \\int 2xe^x\\,dx$ — the leftover integral $\\int xe^x\\,dx$ is exactly the kind solved last lesson, but it still needs solving. Apply the formula again, to that piece alone: $\\int xe^x\\,dx = xe^x - e^x + C$. Substituting back:\n$$\\int x^2e^x\\,dx = x^2e^x - 2(xe^x - e^x) + C = x^2e^x - 2xe^x + 2e^x + C$$\nEach pass differentiates the power down by one, so a degree-$n$ polynomial factor needs $n$ passes before it disappears completely.',
                id: 'Untuk $\\int x^2 e^x\\,dx$, satu putaran dengan $u=x^2$, $dv=e^x\\,dx$ memberi $x^2e^x - \\int 2xe^x\\,dx$ — integral sisanya $\\int xe^x\\,dx$ persis jenis yang diselesaikan pelajaran sebelumnya, tetapi masih perlu diselesaikan. Terapkan rumusnya lagi, hanya pada bagian itu: $\\int xe^x\\,dx = xe^x - e^x + C$. Substitusikan kembali:\n$$\\int x^2e^x\\,dx = x^2e^x - 2(xe^x - e^x) + C = x^2e^x - 2xe^x + 2e^x + C$$\nTiap putaran menurunkan pangkatnya satu, sehingga faktor polinom berderajat $n$ memerlukan $n$ putaran sebelum lenyap sepenuhnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'When the original integral reappears', id: 'Ketika integral aslinya muncul kembali' },
              body: {
                en: 'For $\\int e^x\\sin x\\,dx$, let $u = \\sin x$, $dv = e^x\\,dx$: $\\int e^x\\sin x\\,dx = e^x\\sin x - \\int e^x\\cos x\\,dx$. Apply parts once more to the new integral, $u=\\cos x$, $dv=e^x dx$: $\\int e^x\\cos x\\,dx = e^x\\cos x + \\int e^x\\sin x\\,dx$. Substituting back:\n$$\\int e^x\\sin x\\,dx = e^x\\sin x - e^x\\cos x - \\int e^x\\sin x\\,dx$$\nThe *original* integral reappeared on the right, not a simpler one — but that is solvable algebra, not a dead end. Let $I = \\int e^x\\sin x\\,dx$: $I = e^x\\sin x - e^x\\cos x - I \\Rightarrow 2I = e^x(\\sin x - \\cos x) \\Rightarrow I = \\frac{e^x(\\sin x - \\cos x)}{2} + C$.',
                id: 'Untuk $\\int e^x\\sin x\\,dx$, misalkan $u = \\sin x$, $dv = e^x\\,dx$: $\\int e^x\\sin x\\,dx = e^x\\sin x - \\int e^x\\cos x\\,dx$. Terapkan parsial sekali lagi pada integral barunya, $u=\\cos x$, $dv=e^x dx$: $\\int e^x\\cos x\\,dx = e^x\\cos x + \\int e^x\\sin x\\,dx$. Substitusikan kembali:\n$$\\int e^x\\sin x\\,dx = e^x\\sin x - e^x\\cos x - \\int e^x\\sin x\\,dx$$\nIntegral *aslinya* muncul kembali di ruas kanan, bukan yang lebih sederhana — tetapi itu aljabar yang bisa diselesaikan, bukan jalan buntu. Misalkan $I = \\int e^x\\sin x\\,dx$: $I = e^x\\sin x - e^x\\cos x - I \\Rightarrow 2I = e^x(\\sin x - \\cos x) \\Rightarrow I = \\frac{e^x(\\sin x - \\cos x)}{2} + C$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does $\\int e^x\\sin(x)\\,dx$ need a different trick than $\\int x^2 e^x\\,dx$?',
                id: 'Mengapa $\\int e^x\\sin(x)\\,dx$ memerlukan trik berbeda dari $\\int x^2 e^x\\,dx$?',
              },
              options: [
                { en: 'It never simplifies with repeated passes — the original integral reappears instead, so it must be solved for algebraically', id: 'Tak pernah menyederhana dengan putaran berulang — integral aslinya justru muncul kembali, sehingga harus diselesaikan secara aljabar' },
                { en: 'It cannot be integrated by parts at all', id: 'Sama sekali tak bisa diintegralkan secara parsial' },
                { en: '$e^x\\sin(x)$ has no derivative', id: '$e^x\\sin(x)$ tak punya turunan' },
                { en: 'There is no real difference between the two cases', id: 'Tak ada perbedaan sungguhan antara kedua kasus' },
              ],
              answer: 0,
              explain: {
                en: '$x^2 e^x$ shrinks with each pass because differentiating the polynomial factor lowers its degree. $e^x\\sin(x)$ cycles between sine and cosine under differentiation and integration, so two passes bring back the starting integral rather than something new.',
                id: '$x^2 e^x$ menyusut dengan tiap putaran sebab menurunkan faktor polinomnya menurunkan derajatnya. $e^x\\sin(x)$ berputar antara sinus dan cosinus di bawah penurunan dan pengintegralan, sehingga dua putaran mengembalikan integral awalnya alih-alih sesuatu yang baru.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that solve the circular case for $\\int e^x\\cos(x)\\,dx$.',
                id: 'Susun langkah yang menyelesaikan kasus melingkar untuk $\\int e^x\\cos(x)\\,dx$.',
              },
              lines: [
                'I = e^x\\cos x + e^x\\sin x - I',
                '2I = e^x(\\cos x + \\sin x)',
                'I = \\dfrac{e^x(\\cos x + \\sin x)}{2} + C',
              ],
              explain: {
                en: 'Two passes of integration by parts bring the original integral $I$ back on the right; move it to the left, halve, and the answer falls out.',
                id: 'Dua putaran integral parsial mengembalikan integral asli $I$ di ruas kanan; pindahkan ke kiri, bagi dua, dan jawabannya keluar.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\int_0^1 x^2 e^x\\,dx$. (Round to two decimal places.)',
                id: 'Hitung $\\int_0^1 x^2 e^x\\,dx$. (Bulatkan ke dua desimal.)',
              },
              blanks: [{ answer: 0.72 }],
              hints: [
                { en: '$F(x) = x^2 e^x - 2xe^x + 2e^x$.', id: '$F(x) = x^2 e^x - 2xe^x + 2e^x$.' },
              ],
              explain: {
                en: '$F(1) - F(0) = (e - 2e + 2e) - (0 - 0 + 2) = e - 2 \\approx 0.72$.',
                id: '$F(1) - F(0) = (e - 2e + 2e) - (0 - 0 + 2) = e - 2 \\approx 0,72$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'int-m3-s2-p',
        runtime: 'math',
        title: { en: 'Parts, Repeated and Circular', id: 'Parsial, Berulang dan Melingkar' },
        brief: {
          en: 'One single-pass integral, one repeated case, and one circular case.',
          id: 'Satu integral sekali putaran, satu kasus berulang, dan satu kasus melingkar.',
        },
        requirements: [
          { en: 'Choose $u$ as the factor that simplifies fastest under differentiation.', id: 'Pilih $u$ sebagai faktor yang paling cepat menyederhana di bawah penurunan.' },
          { en: 'A circular case is solved by treating the reappeared integral as an unknown to solve for.', id: 'Kasus melingkar diselesaikan dengan memperlakukan integral yang muncul kembali sebagai sesuatu yang tak diketahui untuk diselesaikan.' },
        ],
        tasks: [
          {
            prompt: { en: 'Evaluate $\\int_1^e \\ln(x)\\,dx$. (Round to two decimal places.)', id: 'Hitung $\\int_1^e \\ln(x)\\,dx$. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 1 }],
            solution: ['u=\\ln x, \\ dv=dx \\Rightarrow F(x)=x\\ln x - x, \\quad F(e)-F(1) = (e-e)-(0-1) = 1'],
          },
          {
            prompt: { en: 'Evaluate $\\int_0^1 x^2\\cdot\\sin(x)\\,dx$ using two passes. (Round to two decimal places.)', id: 'Hitung $\\int_0^1 x^2\\cdot\\sin(x)\\,dx$ memakai dua putaran. (Bulatkan ke dua desimal.)' },
            blanks: [{ answer: 0.22 }],
            solution: ['F(x) = -x^2\\cos x + 2x\\sin x + 2\\cos x', 'F(1)-F(0) = (\\cos 1+2\\sin 1) - 2 \\approx 2{,}22 - 2 = 0{,}22'],
          },
          {
            prompt: { en: 'Find the antiderivative of $e^x\\cos(x)$ with $C = 0$ (the circular case), then evaluate it at $x = 0$.', id: 'Cari antiturunan dari $e^x\\cos(x)$ dengan $C = 0$ (kasus melingkar), lalu hitung nilainya di $x = 0$.' },
            blanks: [{ answer: 0.5 }],
            solution: ['F(x) = \\dfrac{e^x(\\cos x+\\sin x)}{2}, \\quad F(0) = \\dfrac{1(1+0)}{2} = 0{,}5'],
          },
        ],
        hints: [
          { en: 'Part 2: double-check the sign on each term before subtracting $F(0)$ from $F(1)$.', id: 'Butir 2: periksa kembali tanda tiap sukunya sebelum mengurangkan $F(0)$ dari $F(1)$.' },
        ],
        xp: 50,
      },
    },
  ],
}
