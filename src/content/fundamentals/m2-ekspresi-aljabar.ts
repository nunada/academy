import type { Module } from '../types'

/** Module 2 — polynomials as objects to expand and factor, then rational
 *  expressions as the fractions built from them. Factoring earns its keep
 *  immediately: it is also how a rational expression gets simplified. */
export const module2: Module = {
  id: 'dsr-m2',
  title: { en: 'Algebraic and Rational Expressions', id: 'Bentuk Aljabar dan Pecahan Aljabar' },
  summary: {
    en: 'Expanding and factoring polynomials, and the rational expressions built by dividing one polynomial by another.',
    id: 'Menjabarkan dan memfaktorkan polinomial, dan pecahan aljabar yang dibangun dengan membagi satu polinomial dengan yang lain.',
  },
  submodules: [
    /* ------------------------------------------ 1.3 algebraic expressions */
    {
      id: 'dsr-m2-s1',
      title: { en: 'Polynomials — Operations and Factoring', id: 'Polinomial — Operasi dan Pemfaktoran' },
      summary: {
        en: 'Adding, multiplying, and factoring polynomials, including the special product and factoring formulas worth memorizing.',
        id: 'Menjumlahkan, mengalikan, dan memfaktorkan polinomial, termasuk rumus hasil kali dan faktorisasi khusus yang layak dihafal.',
      },
      lessons: [
        {
          id: 'dsr-m2-s1-l1',
          title: { en: 'Adding, Subtracting, and Multiplying Polynomials', id: 'Menjumlahkan, Mengurangkan, dan Mengalikan Polinomial' },
          goal: {
            en: 'Combine like terms to add polynomials, and use FOIL and the special product formulas to multiply them.',
            id: 'Menggabungkan suku sejenis untuk menjumlahkan polinomial, dan memakai FOIL serta rumus hasil kali khusus untuk mengalikannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Polynomials, and combining like terms', id: 'Polinomial, dan menggabungkan suku sejenis' },
              body: {
                en: 'A **polynomial** in $x$ is a sum of terms $a_kx^k$; its **degree** is the highest power appearing. To add or subtract, combine **like terms** — terms with the same variable raised to the same power — using the Distributive Property:\n$$(x^3+4x^2-3x+2)+(2x^3-x^2+5x-7) = 3x^3+3x^2+2x-5$$\nA minus sign in front of parentheses flips every sign inside, exactly as in the last module: $-(x^3-x^2+5x-7) = -x^3+x^2-5x+7$.',
                id: '**Polinomial** dalam $x$ adalah jumlah suku $a_kx^k$; **derajat**-nya adalah pangkat tertinggi yang muncul. Untuk menjumlahkan atau mengurangkan, gabungkan **suku sejenis** — suku dengan variabel yang sama dipangkatkan sama — memakai Sifat Distributif:\n$$(x^3+4x^2-3x+2)+(2x^3-x^2+5x-7) = 3x^3+3x^2+2x-5$$\nTanda minus di depan tanda kurung membalik setiap tanda di dalamnya, persis seperti pada modul sebelumnya: $-(x^3-x^2+5x-7) = -x^3+x^2-5x+7$.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'FOIL, and the special product formulas', id: 'FOIL, dan rumus hasil kali khusus' },
              body: {
                en: 'Multiplying two binomials distributes each term of one over the other — **F**irst, **O**uter, **I**nner, **L**ast:\n$$(a+b)(c+d) = ac+ad+bc+bd$$\nCertain products recur often enough to memorize, for any expressions $A, B$:\n$$(A+B)(A-B)=A^2-B^2, \\qquad (A+B)^2=A^2+2AB+B^2, \\qquad (A-B)^2=A^2-2AB+B^2$$\nFor example, $(3x-5)^2 = (3x)^2-2(3x)(5)+5^2 = 9x^2-30x+25$ — substituting $A=3x, B=5$ into the square-of-a-difference formula.',
                id: 'Mengalikan dua binomial menyebarkan tiap suku dari satu atas yang lain — **F**irst (pertama), **O**uter (luar), **I**nner (dalam), **L**ast (terakhir):\n$$(a+b)(c+d) = ac+ad+bc+bd$$\nHasil kali tertentu cukup sering muncul untuk dihafal, untuk sebarang bentuk $A, B$:\n$$(A+B)(A-B)=A^2-B^2, \\qquad (A+B)^2=A^2+2AB+B^2, \\qquad (A-B)^2=A^2-2AB+B^2$$\nMisalnya, $(3x-5)^2 = (3x)^2-2(3x)(5)+5^2 = 9x^2-30x+25$ — mensubstitusikan $A=3x, B=5$ ke rumus kuadrat selisih.',
              },
              figure: {
                dim: 2,
                range: 3,
                items: [
                  { t: 'poly', pts: [[-2.5, -2.5], [0.5, -2.5], [0.5, 1.5], [-2.5, 1.5]], color: 'a', label: '3·4=12' },
                  { t: 'poly', pts: [[0.5, -2.5], [2.5, -2.5], [2.5, 1.5], [0.5, 1.5]], color: 'b', label: '2·4=8' },
                  { t: 'poly', pts: [[-2.5, 1.5], [0.5, 1.5], [0.5, 2.5], [-2.5, 2.5]], color: 'b', label: '3·1=3' },
                  { t: 'poly', pts: [[0.5, 1.5], [2.5, 1.5], [2.5, 2.5], [0.5, 2.5]], color: 'c', label: '2·1=2' },
                ],
                caption: {
                  en: 'FOIL is just the area of a $(3+2)$-by-$(4+1)$ rectangle, split into its four pieces: $(3+2)(4+1) = 12+8+3+2 = 25 = 5\\times5$.',
                  id: 'FOIL hanyalah luas persegi panjang $(3+2)$ kali $(4+1)$, dibagi menjadi empat bagiannya: $(3+2)(4+1) = 12+8+3+2 = 25 = 5\\times5$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Expand $(2x - 3)(x + 4)$.',
                id: 'Jabarkan $(2x - 3)(x + 4)$.',
              },
              options: [
                { en: '$2x^2 + 5x - 12$', id: '$2x^2 + 5x - 12$' },
                { en: '$2x^2 - 5x - 12$', id: '$2x^2 - 5x - 12$' },
                { en: '$2x^2 + x - 12$', id: '$2x^2 + x - 12$' },
                { en: '$2x^2 + 5x + 12$', id: '$2x^2 + 5x + 12$' },
              ],
              answer: 0,
              explain: {
                en: 'FOIL: $2x \\cdot x = 2x^2$, $2x \\cdot 4 = 8x$, $-3 \\cdot x = -3x$, $-3 \\cdot 4 = -12$. Combining the middle terms, $8x-3x=5x$, gives $2x^2+5x-12$.',
                id: 'FOIL: $2x \\cdot x = 2x^2$, $2x \\cdot 4 = 8x$, $-3 \\cdot x = -3x$, $-3 \\cdot 4 = -12$. Menggabungkan suku tengah, $8x-3x=5x$, memberi $2x^2+5x-12$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Expand $(4x - 1)^2$ using a special product formula.',
                id: 'Jabarkan $(4x - 1)^2$ memakai rumus hasil kali khusus.',
              },
              options: [
                { en: '$16x^2 - 8x + 1$', id: '$16x^2 - 8x + 1$' },
                { en: '$16x^2 - 1$', id: '$16x^2 - 1$' },
                { en: '$16x^2 + 1$', id: '$16x^2 + 1$' },
                { en: '$4x^2 - 8x + 1$', id: '$4x^2 - 8x + 1$' },
              ],
              answer: 0,
              explain: {
                en: 'With $A=4x$, $B=1$: $(A-B)^2 = A^2-2AB+B^2 = 16x^2 - 8x + 1$.',
                id: 'Dengan $A=4x$, $B=1$: $(A-B)^2 = A^2-2AB+B^2 = 16x^2 - 8x + 1$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Factor out the common factor of $3x^2 + 6x$.',
                id: 'Keluarkan faktor sekutu dari $3x^2 + 6x$.',
              },
              template: '3x^2 + 6x = ___(x + 2)',
              blanks: ['3x'],
              explain: {
                en: 'The greatest common factor of $3x^2$ and $6x$ is $3x$: $3x^2+6x = 3x(x+2)$.',
                id: 'Faktor persekutuan terbesar dari $3x^2$ dan $6x$ adalah $3x$: $3x^2+6x = 3x(x+2)$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = (x-2)(x+5)$, evaluate $f(3)$.',
                id: 'Untuk $f(x) = (x-2)(x+5)$, hitung $f(3)$.',
              },
              blanks: [{ answer: 8 }],
              hints: [
                { en: 'You don\'t need to expand first — substitute directly into the factored form.', id: 'Kamu tak perlu menjabarkan dulu — substitusikan langsung ke bentuk terfaktornya.' },
              ],
              explain: {
                en: '$f(3) = (3-2)(3+5) = (1)(8) = 8$.',
                id: '$f(3) = (3-2)(3+5) = (1)(8) = 8$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m2-s1-l2',
          title: { en: 'Factoring Trinomials and Special Forms', id: 'Memfaktorkan Trinomial dan Bentuk Khusus' },
          goal: {
            en: 'Factor a trinomial by finding the right pair of numbers, and recognize the special factoring formulas.',
            id: 'Memfaktorkan trinomial dengan mencari pasangan bilangan yang tepat, dan mengenali rumus faktorisasi khusus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Factoring x² + bx + c', id: 'Memfaktorkan x² + bx + c' },
              body: {
                en: 'Since $(x+r)(x+s) = x^2+(r+s)x+rs$, factoring $x^2+bx+c$ means finding $r, s$ with $r+s=b$ **and** $rs=c$. For $x^2+7x+12$: we need two numbers that multiply to $12$ and add to $7$ — that\'s $3$ and $4$, so\n$$x^2+7x+12 = (x+3)(x+4)$$\nWhen the leading coefficient isn\'t $1$, as in $6x^2+7x-5$, look for $(px+r)(qx+s)$ with $pq=6$, $rs=-5$, $ps+qr=7$ — trial and error with the factor pairs of $6$ and $-5$ gives\n$$6x^2+7x-5 = (3x+5)(2x-1)$$',
                id: 'Karena $(x+r)(x+s) = x^2+(r+s)x+rs$, memfaktorkan $x^2+bx+c$ berarti mencari $r, s$ dengan $r+s=b$ **dan** $rs=c$. Untuk $x^2+7x+12$: kita perlu dua bilangan yang dikalikan menjadi $12$ dan dijumlahkan menjadi $7$ — itu $3$ dan $4$, sehingga\n$$x^2+7x+12 = (x+3)(x+4)$$\nKetika koefisien utamanya bukan $1$, seperti pada $6x^2+7x-5$, cari $(px+r)(qx+s)$ dengan $pq=6$, $rs=-5$, $ps+qr=7$ — coba-coba dengan pasangan faktor dari $6$ dan $-5$ memberi\n$$6x^2+7x-5 = (3x+5)(2x-1)$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The special factoring formulas', id: 'Rumus faktorisasi khusus' },
              body: {
                en: 'These are the special product formulas read backward:\n$$A^2-B^2=(A+B)(A-B) \\quad \\text{(difference of squares)}$$\n$$A^2\\pm2AB+B^2=(A\\pm B)^2 \\quad \\text{(perfect square)}$$\n$$A^3-B^3=(A-B)(A^2+AB+B^2), \\qquad A^3+B^3=(A+B)(A^2-AB+B^2)$$\nA trinomial is a perfect square exactly when its middle term is $\\pm 2$ times the product of the square roots of the outer terms: $x^2+6x+9=(x+3)^2$ since $2 \\cdot x \\cdot 3 = 6x$ matches. And $27x^3-1 = (3x)^3-1^3 = (3x-1)(9x^2+3x+1)$.',
                id: 'Ini adalah rumus hasil kali khusus yang dibaca terbalik:\n$$A^2-B^2=(A+B)(A-B) \\quad \\text{(selisih kuadrat)}$$\n$$A^2\\pm2AB+B^2=(A\\pm B)^2 \\quad \\text{(kuadrat sempurna)}$$\n$$A^3-B^3=(A-B)(A^2+AB+B^2), \\qquad A^3+B^3=(A+B)(A^2-AB+B^2)$$\nSebuah trinomial adalah kuadrat sempurna persis ketika suku tengahnya $\\pm 2$ kali hasil kali akar kuadrat suku-suku luarnya: $x^2+6x+9=(x+3)^2$ sebab $2 \\cdot x \\cdot 3 = 6x$ cocok. Dan $27x^3-1 = (3x)^3-1^3 = (3x-1)(9x^2+3x+1)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Factor $x^2 - 9$.',
                id: 'Faktorkan $x^2 - 9$.',
              },
              options: [
                { en: '$(x-3)(x+3)$', id: '$(x-3)(x+3)$' },
                { en: '$(x-3)^2$', id: '$(x-3)^2$' },
                { en: '$(x-9)(x+1)$', id: '$(x-9)(x+1)$' },
                { en: 'It cannot be factored', id: 'Tak bisa difaktorkan' },
              ],
              answer: 0,
              explain: {
                en: '$x^2-9 = x^2-3^2$ is a difference of squares: $(x-3)(x+3)$.',
                id: '$x^2-9 = x^2-3^2$ adalah selisih kuadrat: $(x-3)(x+3)$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which of these trinomials is a perfect square?',
                id: 'Trinomial manakah di antara ini yang kuadrat sempurna?',
              },
              options: [
                { en: '$x^2 + 8x + 16$', id: '$x^2 + 8x + 16$' },
                { en: '$x^2 + 8x + 12$', id: '$x^2 + 8x + 12$' },
                { en: '$x^2 + 6x + 16$', id: '$x^2 + 6x + 16$' },
                { en: '$x^2 + 10x + 16$', id: '$x^2 + 10x + 16$' },
              ],
              answer: 0,
              explain: {
                en: 'For $x^2+8x+16$: the outer terms are $x^2$ and $16$, with square roots $x$ and $4$, and $2 \\cdot x \\cdot 4 = 8x$ matches the middle term exactly. So $x^2+8x+16=(x+4)^2$. None of the others satisfy this test.',
                id: 'Untuk $x^2+8x+16$: suku luarnya $x^2$ dan $16$, dengan akar kuadrat $x$ dan $4$, dan $2 \\cdot x \\cdot 4 = 8x$ cocok persis dengan suku tengahnya. Jadi $x^2+8x+16=(x+4)^2$. Tak satu pun yang lain memenuhi uji ini.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Factor $6x^2 + 7x - 5$ completely.',
                id: 'Faktorkan $6x^2 + 7x - 5$ selengkapnya.',
              },
              template: '6x^2 + 7x - 5 = (___)(___)',
              blanks: ['3x+5', '2x-1'],
              explain: {
                en: 'Trying factor pairs of $6$ and $-5$ that give a middle term of $7x$ leads to $(3x+5)(2x-1)$ — check: $6x^2-3x+10x-5=6x^2+7x-5$.',
                id: 'Mencoba pasangan faktor dari $6$ dan $-5$ yang memberi suku tengah $7x$ menghasilkan $(3x+5)(2x-1)$ — periksa: $6x^2-3x+10x-5=6x^2+7x-5$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Given $x^2 - 5x + 6 = (x-2)(x-3)$, evaluate the expression at $x=5$.',
                id: 'Diberikan $x^2 - 5x + 6 = (x-2)(x-3)$, hitung bentuknya di $x=5$.',
              },
              blanks: [{ answer: 6 }],
              hints: [
                { en: 'Substituting into the factored form is usually faster than the expanded one.', id: 'Mensubstitusi ke bentuk terfaktor biasanya lebih cepat daripada bentuk terjabar.' },
              ],
              explain: {
                en: '$(5-2)(5-3) = 3 \\cdot 2 = 6$.',
                id: '$(5-2)(5-3) = 3 \\cdot 2 = 6$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m2-s1-p',
        runtime: 'math',
        title: { en: 'Expanding and Factoring', id: 'Menjabarkan dan Memfaktorkan' },
        brief: {
          en: 'Two expansions using the special product formulas, and a numeric evaluation of a factored expression.',
          id: 'Dua penjabaran memakai rumus hasil kali khusus, dan satu evaluasi numerik bentuk terfaktor.',
        },
        requirements: [
          { en: 'FOIL and the special product formulas give the same answer; either method works.', id: 'FOIL dan rumus hasil kali khusus memberi jawaban yang sama; kedua cara berhasil.' },
        ],
        tasks: [
          {
            prompt: { en: 'Expand $(2x - 3)(x + 5)$.', id: 'Jabarkan $(2x - 3)(x + 5)$.' },
            blanks: [{ formula: '2*x^2+7*x-15' }],
            solution: ['(2x-3)(x+5) = 2x^2+10x-3x-15 = 2x^2+7x-15'],
          },
          {
            prompt: { en: 'Expand $(4x - 1)^2$.', id: 'Jabarkan $(4x - 1)^2$.' },
            blanks: [{ formula: '16*x^2-8*x+1' }],
            solution: ['(4x-1)^2 = (4x)^2-2(4x)(1)+1^2 = 16x^2-8x+1'],
          },
          {
            prompt: { en: 'Evaluate $(x-2)(x+5)$ at $x = 3$.', id: 'Hitung $(x-2)(x+5)$ di $x = 3$.' },
            blanks: [{ answer: 8 }],
            solution: ['(3-2)(3+5) = (1)(8) = 8'],
          },
        ],
        hints: [
          { en: 'For the expansions, any algebraically equivalent form of the answer is accepted.', id: 'Untuk penjabarannya, bentuk jawaban apa pun yang setara secara aljabar diterima.' },
        ],
        xp: 50,
      },
    },

    /* --------------------------------------------- 1.4 rational expressions */
    {
      id: 'dsr-m2-s2',
      title: { en: 'Rational Expressions', id: 'Pecahan Aljabar' },
      summary: {
        en: 'The domain of a rational expression, simplifying by cancellation, and combining fractions with the LCD.',
        id: 'Domain pecahan aljabar, menyederhanakan dengan pencoretan, dan menggabungkan pecahan memakai KPK.',
      },
      lessons: [
        {
          id: 'dsr-m2-s2-l1',
          title: { en: 'Domain, Simplifying, Multiplying, and Dividing', id: 'Domain, Menyederhanakan, Mengalikan, dan Membagi' },
          goal: {
            en: 'Find the domain of a rational expression, simplify it by cancellation, and multiply or divide two of them.',
            id: 'Mencari domain pecahan aljabar, menyederhanakannya dengan pencoretan, dan mengalikan atau membagi dua di antaranya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The domain excludes what makes the denominator zero', id: 'Domain mengecualikan yang membuat penyebutnya nol' },
              body: {
                en: 'A **rational expression** is a quotient of two polynomials. Its domain is every real number **except** those that make the denominator $0$. For $\\dfrac{x}{x^2-5x+6}$, factor the denominator first: $x^2-5x+6=(x-2)(x-3)$, so the domain excludes $x=2$ and $x=3$.\n\nAn expression with a root has an extra restriction: $\\sqrt{x}$ needs $x \\geq 0$ on top of any denominator condition.',
                id: '**Pecahan aljabar** adalah hasil bagi dua polinomial. Domainnya adalah setiap bilangan real **kecuali** yang membuat penyebutnya $0$. Untuk $\\dfrac{x}{x^2-5x+6}$, faktorkan dulu penyebutnya: $x^2-5x+6=(x-2)(x-3)$, sehingga domainnya mengecualikan $x=2$ dan $x=3$.\n\nBentuk dengan akar punya syarat tambahan: $\\sqrt{x}$ perlu $x \\geq 0$ selain syarat penyebut mana pun.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 1],
                items: [
                  { t: 'seg', from: [-1, 0], to: [1.85, 0], color: 'result' },
                  { t: 'seg', from: [2.15, 0], to: [2.85, 0], color: 'result' },
                  { t: 'seg', from: [3.15, 0], to: [6, 0], color: 'result' },
                  { t: 'dot', x: 2, y: 0, color: 'muted', open: true, label: '2' },
                  { t: 'dot', x: 3, y: 0, color: 'muted', open: true, label: '3' },
                ],
                caption: {
                  en: 'The domain of $\\dfrac{x}{x^2-5x+6}$ — every real number except the two open gaps at $x=2$ and $x=3$.',
                  id: 'Domain dari $\\dfrac{x}{x^2-5x+6}$ — setiap bilangan real kecuali dua celah terbuka di $x=2$ dan $x=3$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Simplifying by factoring and cancelling', id: 'Menyederhanakan dengan memfaktorkan dan mencoret' },
              body: {
                en: 'To simplify, factor both numerator and denominator, then cancel factors common to both:\n$$\\frac{x^2-1}{x^2+x-2} = \\frac{(x-1)(x+1)}{(x-1)(x+2)} = \\frac{x+1}{x+2}$$\nOnly common **factors** cancel — never individual terms. There is no $x^2$ to cancel in $\\dfrac{x^2-1}{x^2+x-2}$ because $x^2$ is not a factor of either polynomial as a whole.',
                id: 'Untuk menyederhanakan, faktorkan pembilang dan penyebutnya, lalu coret faktor yang sama pada keduanya:\n$$\\frac{x^2-1}{x^2+x-2} = \\frac{(x-1)(x+1)}{(x-1)(x+2)} = \\frac{x+1}{x+2}$$\nHanya **faktor** yang sama yang dicoret — tak pernah suku secara individual. Tak ada $x^2$ untuk dicoret pada $\\dfrac{x^2-1}{x^2+x-2}$ sebab $x^2$ bukan faktor dari salah satu polinomial secara keseluruhan.',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Multiplying and dividing', id: 'Mengalikan dan membagi' },
              body: {
                en: 'Multiply rational expressions the way you multiply fractions — numerator times numerator, denominator times denominator, then cancel:\n$$\\frac{A}{B} \\cdot \\frac{C}{D} = \\frac{AC}{BD}$$\nDivision inverts the second fraction and multiplies:\n$$\\frac{A}{B} \\div \\frac{C}{D} = \\frac{A}{B} \\cdot \\frac{D}{C}$$\nAs always, factor everything first — cancellation only becomes visible after factoring.',
                id: 'Kalikan pecahan aljabar seperti mengalikan pecahan biasa — pembilang kali pembilang, penyebut kali penyebut, lalu coret:\n$$\\frac{A}{B} \\cdot \\frac{C}{D} = \\frac{AC}{BD}$$\nPembagian membalik pecahan kedua lalu mengalikan:\n$$\\frac{A}{B} \\div \\frac{C}{D} = \\frac{A}{B} \\cdot \\frac{D}{C}$$\nSeperti biasa, faktorkan semuanya dulu — pencoretan baru terlihat setelah pemfaktoran.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the domain of $\\dfrac{x}{x^2 - 5x + 6}$?',
                id: 'Apa domain dari $\\dfrac{x}{x^2 - 5x + 6}$?',
              },
              options: [
                { en: '$\\{x \\vert x \\neq 2 \\text{ and } x \\neq 3\\}$', id: '$\\{x \\vert x \\neq 2 \\text{ dan } x \\neq 3\\}$' },
                { en: 'All real numbers', id: 'Semua bilangan real' },
                { en: '$\\{x \\vert x \\neq -2 \\text{ and } x \\neq -3\\}$', id: '$\\{x \\vert x \\neq -2 \\text{ dan } x \\neq -3\\}$' },
                { en: '$\\{x \\vert x \\neq 0\\}$', id: '$\\{x \\vert x \\neq 0\\}$' },
              ],
              answer: 0,
              explain: {
                en: 'Factoring $x^2-5x+6=(x-2)(x-3)$ shows the denominator is zero exactly at $x=2$ and $x=3$, so those are excluded.',
                id: 'Memfaktorkan $x^2-5x+6=(x-2)(x-3)$ menunjukkan penyebutnya nol persis di $x=2$ dan $x=3$, sehingga keduanya dikecualikan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Simplify $\\dfrac{x^2 - 1}{x^2 + x - 2}$.',
                id: 'Sederhanakan $\\dfrac{x^2 - 1}{x^2 + x - 2}$.',
              },
              options: [
                { en: '$\\dfrac{x+1}{x+2}$', id: '$\\dfrac{x+1}{x+2}$' },
                { en: '$\\dfrac{x-1}{x+2}$', id: '$\\dfrac{x-1}{x+2}$' },
                { en: '$-\\dfrac{1}{2}$', id: '$-\\dfrac{1}{2}$' },
                { en: 'It is already fully simplified', id: 'Sudah sepenuhnya sederhana' },
              ],
              answer: 0,
              explain: {
                en: 'Factoring gives $\\dfrac{(x-1)(x+1)}{(x-1)(x+2)}$; the common factor $(x-1)$ cancels, leaving $\\dfrac{x+1}{x+2}$.',
                id: 'Memfaktorkan memberi $\\dfrac{(x-1)(x+1)}{(x-1)(x+2)}$; faktor persekutuan $(x-1)$ dicoret, menyisakan $\\dfrac{x+1}{x+2}$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Simplify $\\dfrac{x^2 - 1}{x^2 + x - 2}$.',
                id: 'Sederhanakan $\\dfrac{x^2 - 1}{x^2 + x - 2}$.',
              },
              template: '\\dfrac{x^2-1}{x^2+x-2} = ___',
              blanks: ['(x+1)/(x+2)'],
              explain: {
                en: 'As worked out above, this simplifies to $\\dfrac{x+1}{x+2}$.',
                id: 'Seperti dikerjakan di atas, ini menyederhana menjadi $\\dfrac{x+1}{x+2}$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = \\dfrac{x^2-1}{x^2+x-2}$, evaluate $f(3)$.',
                id: 'Untuk $f(x) = \\dfrac{x^2-1}{x^2+x-2}$, hitung $f(3)$.',
              },
              blanks: [{ answer: 0.8 }],
              hints: [
                { en: 'Use the simplified form $\\frac{x+1}{x+2}$ — it agrees with the original everywhere the original is defined.', id: 'Pakai bentuk sederhananya $\\frac{x+1}{x+2}$ — ia cocok dengan bentuk asli di mana pun bentuk aslinya terdefinisi.' },
              ],
              explain: {
                en: '$f(3) = \\dfrac{3+1}{3+2} = \\dfrac{4}{5} = 0.8$.',
                id: '$f(3) = \\dfrac{3+1}{3+2} = \\dfrac{4}{5} = 0.8$.',
              },
            },
          ],
        },
        {
          id: 'dsr-m2-s2-l2',
          title: { en: 'Adding, Subtracting, and Compound Fractions', id: 'Menjumlahkan, Mengurangkan, dan Pecahan Bertingkat' },
          goal: {
            en: 'Add rational expressions using the LCD, and simplify a compound fraction.',
            id: 'Menjumlahkan pecahan aljabar memakai KPK, dan menyederhanakan pecahan bertingkat.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Adding with the LCD', id: 'Menjumlahkan memakai KPK' },
              body: {
                en: 'Exactly as with numeric fractions, find the LCD by factoring every denominator and taking the highest power of each factor. For $\\dfrac{1}{x^2-1}+\\dfrac{2}{(x+1)^2}$: since $x^2-1=(x-1)(x+1)$, the LCD is $(x-1)(x+1)^2$.\n$$\\frac{1}{x^2-1}+\\frac{2}{(x+1)^2} = \\frac{x+1}{(x-1)(x+1)^2}+\\frac{2(x-1)}{(x-1)(x+1)^2} = \\frac{(x+1)+2(x-1)}{(x-1)(x+1)^2} = \\frac{3x-1}{(x-1)(x+1)^2}$$',
                id: 'Persis seperti pecahan numerik, cari KPK dengan memfaktorkan tiap penyebut dan mengambil pangkat tertinggi tiap faktor. Untuk $\\dfrac{1}{x^2-1}+\\dfrac{2}{(x+1)^2}$: karena $x^2-1=(x-1)(x+1)$, KPK-nya adalah $(x-1)(x+1)^2$.\n$$\\frac{1}{x^2-1}+\\frac{2}{(x+1)^2} = \\frac{x+1}{(x-1)(x+1)^2}+\\frac{2(x-1)}{(x-1)(x+1)^2} = \\frac{(x+1)+2(x-1)}{(x-1)(x+1)^2} = \\frac{3x-1}{(x-1)(x+1)^2}$$',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Compound fractions', id: 'Pecahan bertingkat' },
              body: {
                en: 'A **compound fraction** has a fraction in its numerator, denominator, or both. The cleanest method: multiply the top and bottom of the **whole** expression by the LCD of every small fraction inside, clearing all of them at once.\n\nFor $\\dfrac{\\frac{1}{a}-\\frac{1}{b}}{\\frac{1}{a}+\\frac{1}{b}}$, the LCD of the inner fractions is $ab$; multiplying top and bottom by $ab$:\n$$\\frac{\\frac{1}{a}-\\frac{1}{b}}{\\frac{1}{a}+\\frac{1}{b}} \\cdot \\frac{ab}{ab} = \\frac{b-a}{b+a}$$',
                id: '**Pecahan bertingkat** punya pecahan di pembilang, penyebut, atau keduanya. Cara paling bersih: kalikan atas dan bawah dari **seluruh** bentuknya dengan KPK dari setiap pecahan kecil di dalamnya, menghilangkan semuanya sekaligus.\n\nUntuk $\\dfrac{\\frac{1}{a}-\\frac{1}{b}}{\\frac{1}{a}+\\frac{1}{b}}$, KPK dari pecahan-pecahan di dalamnya adalah $ab$; mengalikan atas dan bawah dengan $ab$:\n$$\\frac{\\frac{1}{a}-\\frac{1}{b}}{\\frac{1}{a}+\\frac{1}{b}} \\cdot \\frac{ab}{ab} = \\frac{b-a}{b+a}$$',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ combined over a single denominator?',
                id: 'Berapakah $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ digabung atas satu penyebut?',
              },
              options: [
                { en: '$\\dfrac{2x}{x^2-1}$', id: '$\\dfrac{2x}{x^2-1}$' },
                { en: '$\\dfrac{2}{x^2-1}$', id: '$\\dfrac{2}{x^2-1}$' },
                { en: '$\\dfrac{2x}{2x}$', id: '$\\dfrac{2x}{2x}$' },
                { en: '$\\dfrac{x}{x^2-1}$', id: '$\\dfrac{x}{x^2-1}$' },
              ],
              answer: 0,
              explain: {
                en: 'The LCD is $(x-1)(x+1)=x^2-1$: $\\dfrac{x+1}{x^2-1}+\\dfrac{x-1}{x^2-1} = \\dfrac{(x+1)+(x-1)}{x^2-1} = \\dfrac{2x}{x^2-1}$.',
                id: 'KPK-nya $(x-1)(x+1)=x^2-1$: $\\dfrac{x+1}{x^2-1}+\\dfrac{x-1}{x^2-1} = \\dfrac{(x+1)+(x-1)}{x^2-1} = \\dfrac{2x}{x^2-1}$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Combine $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ over a single denominator.',
                id: 'Gabungkan $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ atas satu penyebut.',
              },
              template: '\\dfrac{1}{x-1} + \\dfrac{1}{x+1} = ___',
              blanks: ['2x/(x^2-1)'],
              explain: {
                en: 'As shown above, the combined fraction is $\\dfrac{2x}{x^2-1}$.',
                id: 'Seperti ditunjukkan di atas, pecahan gabungannya adalah $\\dfrac{2x}{x^2-1}$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ at $x = 3$.',
                id: 'Hitung $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ di $x = 3$.',
              },
              blanks: [{ answer: 0.75 }],
              hints: [
                { en: 'Use the combined form $\\frac{2x}{x^2-1}$.', id: 'Pakai bentuk gabungannya $\\frac{2x}{x^2-1}$.' },
              ],
              explain: {
                en: '$\\dfrac{2(3)}{3^2-1} = \\dfrac{6}{8} = 0.75$ — matching $\\frac{1}{2}+\\frac{1}{4}=0.75$ directly from the original expression.',
                id: '$\\dfrac{2(3)}{3^2-1} = \\dfrac{6}{8} = 0.75$ — cocok dengan $\\frac{1}{2}+\\frac{1}{4}=0.75$ langsung dari bentuk aslinya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'dsr-m2-s2-p',
        runtime: 'math',
        title: { en: 'Simplifying Rational Expressions', id: 'Menyederhanakan Pecahan Aljabar' },
        brief: {
          en: 'Simplify a rational expression, then evaluate two rational expressions at given points.',
          id: 'Sederhanakan sebuah pecahan aljabar, lalu hitung dua pecahan aljabar di titik tertentu.',
        },
        requirements: [
          { en: 'Factor before cancelling — only whole factors common to numerator and denominator may cancel.', id: 'Faktorkan sebelum mencoret — hanya faktor utuh yang sama pada pembilang dan penyebut yang boleh dicoret.' },
        ],
        tasks: [
          {
            prompt: { en: 'Simplify $\\dfrac{x^2 - 4}{x^2 - x - 2}$.', id: 'Sederhanakan $\\dfrac{x^2 - 4}{x^2 - x - 2}$.' },
            blanks: [{ formula: '(x+2)/(x+1)' }],
            solution: ['\\dfrac{(x-2)(x+2)}{(x-2)(x+1)} = \\dfrac{x+2}{x+1}'],
          },
          {
            prompt: { en: 'Evaluate $\\dfrac{x^2 - 4}{x^2 - x - 2}$ at $x = 6$.', id: 'Hitung $\\dfrac{x^2 - 4}{x^2 - x - 2}$ di $x = 6$.' },
            blanks: [{ answer: 8 / 7, tol: 0.01 }],
            solution: ['\\dfrac{6+2}{6+1} = \\dfrac{8}{7} \\approx 1{,}14'],
          },
          {
            prompt: { en: 'Evaluate $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ at $x = 4$.', id: 'Hitung $\\dfrac{1}{x-1} + \\dfrac{1}{x+1}$ di $x = 4$.' },
            blanks: [{ answer: 8 / 15, tol: 0.01 }],
            solution: ['\\dfrac{2(4)}{4^2-1} = \\dfrac{8}{15} \\approx 0{,}53'],
          },
        ],
        hints: [
          { en: 'For the simplification task, any algebraically equivalent form is accepted.', id: 'Untuk butir penyederhanaan, bentuk mana pun yang setara secara aljabar diterima.' },
        ],
        xp: 50,
      },
    },
  ],
}
