import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './algebraic-expressions.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

export const body: ArticleBody = {
  answer: L(
    T`**An algebraic expression is a combination of numbers, letters (variables) and operations, such as $3x^2-5x+7$; it has no equals sign, so it is simplified or evaluated rather than solved.** You simplify it by combining like terms, remove brackets with the distributive law ($a(b+c)=ab+ac$), and reverse that step by factoring ($x^2-9=(x-3)(x+3)$). Every step can be checked by substituting a number for the letter.`,
    T`**Bentuk aljabar adalah gabungan bilangan, huruf (variabel), dan operasi, seperti $3x^2-5x+7$; ia tidak memuat tanda sama dengan, sehingga ia disederhanakan atau dihitung nilainya, bukan diselesaikan.** Kamu menyederhanakannya dengan menggabungkan suku sejenis, menghilangkan kurung dengan sifat distributif ($a(b+c)=ab+ac$), dan membalik langkah itu dengan memfaktorkan ($x^2-9=(x-3)(x+3)$). Setiap langkah dapat diperiksa dengan mengganti huruf dengan sebuah bilangan.`,
  ),

  keyPoints: [
    L(
      T`An expression is built from terms joined by + and −; each term has a coefficient and a variable part, and a term with no letter is a constant.`,
      T`Sebuah ekspresi tersusun dari suku-suku yang dihubungkan oleh + dan −; tiap suku punya koefisien dan bagian variabel, dan suku tanpa huruf disebut konstanta.`,
    ),
    L(
      T`Only like terms, those with exactly the same letters and exponents, can be combined: $3x+5x=8x$, but $3x+5x^2$ stays as it is.`,
      T`Hanya suku sejenis, yaitu suku dengan huruf dan eksponen yang persis sama, yang dapat digabung: $3x+5x=8x$, tetapi $3x+5x^2$ dibiarkan.`,
    ),
    L(
      T`To evaluate, put each value in brackets in place of its letter and then follow the order of operations.`,
      T`Untuk menghitung nilai, ganti tiap huruf dengan nilainya di dalam kurung lalu ikuti urutan operasi.`,
    ),
    L(
      T`To expand, multiply every term of one bracket by every term of the other: $(a+b)(c+d)=ac+ad+bc+bd$, and $(a+b)^2=a^2+2ab+b^2$, not $a^2+b^2$.`,
      T`Untuk menjabarkan, kalikan setiap suku dari satu kurung dengan setiap suku dari kurung lainnya: $(a+b)(c+d)=ac+ad+bc+bd$, dan $(a+b)^2=a^2+2ab+b^2$, bukan $a^2+b^2$.`,
    ),
    L(
      T`Factoring undoes expanding: take out a common factor first, then look for a difference of squares, a perfect square, or two numbers with the right product and sum.`,
      T`Memfaktorkan membalik penjabaran: keluarkan faktor persekutuan lebih dulu, lalu cari selisih dua kuadrat, kuadrat sempurna, atau dua bilangan dengan hasil kali dan jumlah yang tepat.`,
    ),
    L(
      T`In a fraction you can cancel factors but never terms, and the cancelled factor must not be zero: $\dfrac{x^2-9}{x+3}=x-3$ only for $x\neq-3$.`,
      T`Pada pecahan kamu boleh mencoret faktor tetapi tidak pernah suku, dan faktor yang dicoret tidak boleh nol: $\dfrac{x^2-9}{x+3}=x-3$ hanya untuk $x\neq-3$.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-an-algebraic-expression',
      heading: L('What is an algebraic expression?', 'Apa itu bentuk aljabar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An algebraic expression is a mathematical phrase made of numbers, variables (letters standing for numbers) and operations such as +, −, ×, ÷ and powers.** Examples are $2x+3$, $a^2-2ab+b^2$ and $\dfrac{x+1}{x}$. An expression is a phrase, not a sentence: it has no equals sign and nothing to solve, but it has a value once the letters are given values.

Expressions are built from **terms**, the parts joined by + or −. Each term has a **coefficient** (the number multiplying the letters) and a **variable part** (the letters with their exponents). A term with no letter is a **constant**.

| Term | Coefficient | Variable part | Degree |
|---|---|---|---|
| $3x^2$ | 3 | $x^2$ | 2 |
| $-5x$ | −5 | $x$ | 1 |
| $7$ | 7 (a constant) | none | 0 |
| $-y$ | −1 | $y$ | 1 |
| $4xy$ | 4 | $xy$ | 2 |

Three habits make this easier. The sign in front of a term belongs to the term, so $3x^2-5x+7$ has the terms $3x^2$, $-5x$ and $7$. A letter on its own has coefficient 1, so $x=1x$. And the **degree** of a term is the sum of the exponents of its letters, so $4xy$ has degree 2; the degree of an expression is the largest degree among its terms.

The usual names are by number of terms: a **monomial** has one term, a **binomial** two and a **trinomial** three. A sum of terms whose letters have whole-number exponents is a **polynomial**; its degree gives it a name, linear (1), quadratic (2) or cubic (3). Not every expression is a polynomial: $\dfrac1x$ and $\sqrt{x}$ are algebraic expressions but not polynomials.

**Expression or equation?** An equation has an equals sign and says two expressions are equal, as in $2x+3=11$; you solve it. An expression such as $2x+3$ you simplify, evaluate or factor. Type any expression below to see it taken apart.`,
            T`**Bentuk aljabar adalah frasa matematika yang tersusun dari bilangan, variabel (huruf yang mewakili bilangan), dan operasi seperti +, −, ×, ÷, serta pangkat.** Contohnya $2x+3$, $a^2-2ab+b^2$, dan $\dfrac{x+1}{x}$. Bentuk aljabar adalah frasa, bukan kalimat: ia tidak punya tanda sama dengan dan tidak ada yang diselesaikan, tetapi ia punya nilai begitu huruf-hurufnya diberi nilai.

Bentuk aljabar tersusun dari **suku**, yaitu bagian-bagian yang dihubungkan oleh + atau −. Setiap suku punya **koefisien** (bilangan yang mengalikan huruf) dan **bagian variabel** (huruf beserta eksponennya). Suku tanpa huruf disebut **konstanta**.

| Suku | Koefisien | Bagian variabel | Derajat |
|---|---|---|---|
| $3x^2$ | 3 | $x^2$ | 2 |
| $-5x$ | −5 | $x$ | 1 |
| $7$ | 7 (sebuah konstanta) | tidak ada | 0 |
| $-y$ | −1 | $y$ | 1 |
| $4xy$ | 4 | $xy$ | 2 |

Tiga kebiasaan membuatnya lebih mudah. Tanda di depan sebuah suku adalah milik suku itu, sehingga $3x^2-5x+7$ memiliki suku $3x^2$, $-5x$, dan $7$. Huruf yang berdiri sendiri berkoefisien 1, sehingga $x=1x$. Dan **derajat** sebuah suku adalah jumlah eksponen hurufnya, sehingga $4xy$ berderajat 2; derajat bentuk aljabar adalah derajat terbesar di antara sukunya.

Namanya biasanya menurut banyak suku: **monomial** memiliki satu suku, **binomial** dua, dan **trinomial** tiga. Jumlah suku yang hurufnya berpangkat bilangan bulat disebut **polinomial** (suku banyak); derajatnya memberi nama: linear (1), kuadrat (2), atau kubik (3). Tidak semua bentuk aljabar adalah polinomial: $\dfrac1x$ dan $\sqrt{x}$ adalah bentuk aljabar tetapi bukan polinomial.

**Bentuk aljabar atau persamaan?** Persamaan memiliki tanda sama dengan dan menyatakan dua bentuk aljabar sama, seperti $2x+3=11$; persamaan diselesaikan. Bentuk aljabar seperti $2x+3$ disederhanakan, dihitung nilainya, atau difaktorkan. Ketik bentuk aljabar apa pun di bawah untuk melihatnya diuraikan.`,
          ),
        },
        { kind: 'widget', name: 'terms' },
        {
          kind: 'activity',
          title: L('Try it: read a coefficient', 'Coba: membaca koefisien'),
          step: {
            kind: 'math',
            id: 'a1',
            hints: [
              L('The sign belongs to the term: look at the term with $x$ to the power 1.', 'Tanda adalah milik suku: lihat suku dengan $x$ berpangkat 1.'),
              L('The term is $-7x$.', 'Sukunya adalah $-7x$.'),
            ],
            explain: L('In $4x^2-7x+2$ the term with $x$ is $-7x$, so its coefficient is $-7$, sign included.', 'Pada $4x^2-7x+2$ suku yang memuat $x$ adalah $-7x$, sehingga koefisiennya $-7$, beserta tandanya.'),
            prompt: L('What is the coefficient of $x$ in $4x^2-7x+2$?', 'Berapakah koefisien $x$ pada $4x^2-7x+2$?'),
            given: String.raw`4x^2-7x+2`,
            blanks: [{ label: 'c =', answer: -7 }],
          },
        },
      ],
    },

    /* ------------------------------------------------------------ like terms */
    {
      id: 'like-terms',
      heading: L('How do you combine like terms?', 'Bagaimana menggabungkan suku sejenis?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Like terms have exactly the same variable part, the same letters with the same exponents, and you combine them by adding their coefficients and keeping the variable part: $3x+5x=8x$.** Only the coefficients may differ.

| Pair | Like terms? | Why |
|---|---|---|
| $3x$ and $-7x$ | yes | same letter, same exponent |
| $4xy$ and $-xy$ | yes | same variable part $xy$ |
| $5$ and $-2$ | yes | both constants |
| $3x^2$ and $5x$ | no | exponents differ |
| $2xy$ and $2x$ | no | letters differ |

**Why it works.** It is the distributive law read backwards: $3x+5x=(3+5)x=8x$, as three of something plus five of the same thing is eight of it. That is also why unlike terms cannot be merged: $3x+5x^2$ is three of one thing and five of another, and there is no common thing to count.

Worked example: simplify $5x^2+3x-2x^2+7x-4$.

1. Group the like terms: $(5x^2-2x^2)+(3x+7x)-4$.
2. Combine each group: $3x^2+10x-4$.

Nothing else can be combined, so $3x^2+10x-4$ is the simplified form. It is conventional to write the terms from the highest degree down. Use the tool below to check any expression you simplify by hand.`,
            T`**Suku sejenis memiliki bagian variabel yang persis sama, yaitu huruf yang sama dengan eksponen yang sama, dan kamu menggabungkannya dengan menjumlahkan koefisiennya dan mempertahankan bagian variabel: $3x+5x=8x$.** Hanya koefisiennya yang boleh berbeda.

| Pasangan | Sejenis? | Alasan |
|---|---|---|
| $3x$ dan $-7x$ | ya | huruf sama, eksponen sama |
| $4xy$ dan $-xy$ | ya | bagian variabel sama, yaitu $xy$ |
| $5$ dan $-2$ | ya | keduanya konstanta |
| $3x^2$ dan $5x$ | bukan | eksponennya berbeda |
| $2xy$ dan $2x$ | bukan | hurufnya berbeda |

**Mengapa berlaku.** Ini adalah sifat distributif yang dibaca terbalik: $3x+5x=(3+5)x=8x$, sebab tiga buah sesuatu ditambah lima buah sesuatu yang sama adalah delapan buah. Itu pula sebabnya suku tak sejenis tidak dapat digabung: $3x+5x^2$ adalah tiga buah satu benda dan lima buah benda lain, dan tidak ada benda bersama yang dapat dihitung.

Contoh: sederhanakan $5x^2+3x-2x^2+7x-4$.

1. Kelompokkan suku sejenis: $(5x^2-2x^2)+(3x+7x)-4$.
2. Gabungkan tiap kelompok: $3x^2+10x-4$.

Tidak ada lagi yang dapat digabung, sehingga $3x^2+10x-4$ adalah bentuk paling sederhananya. Lazimnya suku ditulis dari derajat tertinggi ke terendah. Pakai alat di bawah untuk memeriksa bentuk aljabar apa pun yang kamu sederhanakan sendiri.`,
          ),
        },
        { kind: 'widget', name: 'expand' },
        {
          kind: 'activity',
          title: L('Try it: combine like terms', 'Coba: menggabungkan suku sejenis'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Combine the $x$ terms: $5x-2x$.', 'Gabungkan suku $x$: $5x-2x$.'),
              L('Combine the constants: $3+7$.', 'Gabungkan konstanta: $3+7$.'),
            ],
            explain: L('$5x-2x=3x$ and $3+7=10$, so the result is $3x+10$.', '$5x-2x=3x$ dan $3+7=10$, sehingga hasilnya $3x+10$.'),
            prompt: L('Simplify, then find $a$ and $b$.', 'Sederhanakan, lalu tentukan $a$ dan $b$.'),
            given: String.raw`5x+3-2x+7=ax+b`,
            blanks: [
              { label: 'a =', answer: 3 },
              { label: 'b =', answer: 10 },
            ],
          },
        },
      ],
    },

    /* -------------------------------------------------------------- evaluate */
    {
      id: 'evaluate',
      heading: L('How do you evaluate an algebraic expression?', 'Bagaimana menghitung nilai bentuk aljabar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To evaluate an expression, replace every letter with its value, writing each value in brackets, and then calculate with the usual order of operations: brackets, then powers, then × and ÷, then + and −.** The brackets are what keep negative values safe.

Evaluate $2x^2-3x$ at $x=-3$:

1. Substitute in brackets: $2(-3)^2-3(-3)$.
2. Power first: $2\cdot9-3(-3)$.
3. Multiply: $18+9$.
4. Add: $27$.

The classic slip is skipping the brackets: $2\cdot-3^2$ would give $-18$, because the power would apply to the 3 alone. A second slip is squaring the coefficient too: in $2x^2$ only $x$ is squared, so at $x=-3$ it is $2\cdot9=18$, not $(2\cdot(-3))^2=36$.

A table of values evaluates one expression at many inputs. For $2x^2-3x$:

| $x$ | −2 | −1 | 0 | 1 | 2 |
|---|---|---|---|---|---|
| $2x^2-3x$ | 14 | 5 | 0 | −1 | 2 |

**Substitution is also how you test.** Two expressions are *equivalent* when they have the same value for every input. One input where they differ proves they are not equivalent: $(x+3)^2$ and $x^2+9$ both give 9 at $x=0$, but at $x=1$ they give 16 and 10. The reverse does not hold. Agreeing at a few inputs proves nothing, since $x^2$ and $2x$ agree at both $x=0$ and $x=2$ yet are different expressions.`,
            T`**Untuk menghitung nilai bentuk aljabar, ganti setiap huruf dengan nilainya, tulis tiap nilai di dalam kurung, lalu hitung dengan urutan operasi biasa: kurung, lalu pangkat, lalu × dan ÷, lalu + dan −.** Kurunglah yang menjaga nilai negatif tetap aman.

Hitung $2x^2-3x$ pada $x=-3$:

1. Substitusikan di dalam kurung: $2(-3)^2-3(-3)$.
2. Pangkat lebih dulu: $2\cdot9-3(-3)$.
3. Kalikan: $18+9$.
4. Jumlahkan: $27$.

Kekeliruan klasik adalah melewatkan kurung: $2\cdot-3^2$ akan memberi $-18$, sebab pangkat hanya berlaku untuk angka 3. Kekeliruan kedua adalah ikut mengkuadratkan koefisien: pada $2x^2$ hanya $x$ yang dikuadratkan, sehingga pada $x=-3$ nilainya $2\cdot9=18$, bukan $(2\cdot(-3))^2=36$.

Tabel nilai menghitung satu bentuk aljabar pada banyak masukan. Untuk $2x^2-3x$:

| $x$ | −2 | −1 | 0 | 1 | 2 |
|---|---|---|---|---|---|
| $2x^2-3x$ | 14 | 5 | 0 | −1 | 2 |

**Substitusi juga cara menguji.** Dua bentuk aljabar *ekuivalen* bila nilainya sama untuk setiap masukan. Satu masukan yang memberi nilai berbeda membuktikan keduanya tidak ekuivalen: $(x+3)^2$ dan $x^2+9$ sama-sama bernilai 9 pada $x=0$, tetapi pada $x=1$ nilainya 16 dan 10. Kebalikannya tidak berlaku. Sama pada beberapa masukan tidak membuktikan apa-apa, sebab $x^2$ dan $2x$ sama pada $x=0$ maupun $x=2$ namun merupakan bentuk yang berbeda.`,
          ),
        },
        { kind: 'widget', name: 'evalexpr' },
        {
          kind: 'activity',
          title: L('Try it: substitute a negative number', 'Coba: mensubstitusi bilangan negatif'),
          step: {
            kind: 'math',
            id: 'a3',
            hints: [
              L('Write $2(-3)^2-3(-3)$.', 'Tulis $2(-3)^2-3(-3)$.'),
              L('$(-3)^2=9$, so the first term is 18; the second is $+9$.', '$(-3)^2=9$, jadi suku pertama 18; suku kedua $+9$.'),
            ],
            explain: L('$2(-3)^2-3(-3)=18+9=27$.', '$2(-3)^2-3(-3)=18+9=27$.'),
            prompt: L('Evaluate $2x^2-3x$ at $x=-3$.', 'Hitung $2x^2-3x$ pada $x=-3$.'),
            given: String.raw`2(-3)^2-3(-3)=v`,
            blanks: [{ label: 'v =', answer: 27 }],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- expand */
    {
      id: 'expand',
      heading: L('How do you expand brackets?', 'Bagaimana menjabarkan tanda kurung?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To expand brackets, multiply every term inside by whatever is outside, using the distributive law $a(b+c)=ab+ac$; for two brackets, multiply every term of the first by every term of the second.**

For a number outside: $3(x+2)=3x+6$. A minus sign in front of a bracket multiplies by −1 and flips every sign inside: $-(x-4)=-x+4$.

For two binomials the rule is $(a+b)(c+d)=ac+ad+bc+bd$, four products. Many classes call this FOIL (first, outer, inner, last), which is the same four products in a fixed order. Example:

$(x+2)(x-3)=x\cdot x+x\cdot(-3)+2\cdot x+2\cdot(-3)=x^2-3x+2x-6=x^2-x-6$.

**The area model shows why.** A rectangle of width $a+b$ and height $c+d$ has area $(a+b)(c+d)$. Cut it into four pieces and the areas are $ac$, $bc$, $ad$ and $bd$; the pieces make up the whole, so the four products add up to the product of the sums. Move the sliders to see it with numbers.

Three products come up so often that they are worth recognising:

| Name | Pattern | Example |
|---|---|---|
| Square of a sum | $(a+b)^2=a^2+2ab+b^2$ | $(2x+3)^2=4x^2+12x+9$ |
| Square of a difference | $(a-b)^2=a^2-2ab+b^2$ | $(x-5)^2=x^2-10x+25$ |
| Difference of squares | $(a+b)(a-b)=a^2-b^2$ | $(x+5)(x-5)=x^2-25$ |

In the difference of squares the two middle terms $-ab$ and $+ab$ cancel, which is why no $x$ term is left. A square is never just the squares of the parts: $(a+b)^2$ is a product of two brackets, $(a+b)(a+b)$, and the cross terms $ab$ appear twice.`,
            T`**Untuk menjabarkan kurung, kalikan setiap suku di dalam dengan apa yang ada di luar, memakai sifat distributif $a(b+c)=ab+ac$; untuk dua kurung, kalikan setiap suku dari kurung pertama dengan setiap suku dari kurung kedua.**

Untuk bilangan di luar: $3(x+2)=3x+6$. Tanda minus di depan kurung mengalikan dengan −1 dan membalik setiap tanda di dalamnya: $-(x-4)=-x+4$.

Untuk dua binomial aturannya $(a+b)(c+d)=ac+ad+bc+bd$, empat hasil kali. Banyak kelas menyebutnya FOIL (first, outer, inner, last), yaitu empat hasil kali yang sama dalam urutan tertentu. Contoh:

$(x+2)(x-3)=x\cdot x+x\cdot(-3)+2\cdot x+2\cdot(-3)=x^2-3x+2x-6=x^2-x-6$.

**Model luas menunjukkan alasannya.** Persegi panjang dengan lebar $a+b$ dan tinggi $c+d$ berluas $(a+b)(c+d)$. Potong menjadi empat bagian dan luasnya $ac$, $bc$, $ad$, dan $bd$; keempat bagian itu menyusun keseluruhannya, sehingga empat hasil kali itu berjumlah sama dengan hasil kali kedua jumlah. Geser penggesernya untuk melihatnya dengan bilangan.

Tiga hasil kali begitu sering muncul sehingga layak dikenali:

| Nama | Pola | Contoh |
|---|---|---|
| Kuadrat jumlah | $(a+b)^2=a^2+2ab+b^2$ | $(2x+3)^2=4x^2+12x+9$ |
| Kuadrat selisih | $(a-b)^2=a^2-2ab+b^2$ | $(x-5)^2=x^2-10x+25$ |
| Selisih dua kuadrat | $(a+b)(a-b)=a^2-b^2$ | $(x+5)(x-5)=x^2-25$ |

Pada selisih dua kuadrat, dua suku tengah $-ab$ dan $+ab$ saling meniadakan, itulah sebabnya tidak ada suku $x$ yang tersisa. Kuadrat tidak pernah sekadar kuadrat dari bagian-bagiannya: $(a+b)^2$ adalah hasil kali dua kurung, $(a+b)(a+b)$, dan suku silang $ab$ muncul dua kali.`,
          ),
        },
        { kind: 'widget', name: 'areamodel' },
        {
          kind: 'activity',
          title: L('Try it: expand two brackets', 'Coba: menjabarkan dua kurung'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('Four products: $x\\cdot x$, $x\\cdot(-2)$, $4\\cdot x$, $4\\cdot(-2)$.', 'Empat hasil kali: $x\\cdot x$, $x\\cdot(-2)$, $4\\cdot x$, $4\\cdot(-2)$.'),
              L('$x^2-2x+4x-8$. Combine the middle terms.', '$x^2-2x+4x-8$. Gabungkan dua suku tengah.'),
            ],
            explain: L('$(x+4)(x-2)=x^2-2x+4x-8=x^2+2x-8$.', '$(x+4)(x-2)=x^2-2x+4x-8=x^2+2x-8$.'),
            prompt: L('Find $a$ and $b$.', 'Tentukan $a$ dan $b$.'),
            given: String.raw`(x+4)(x-2)=x^2+ax+b`,
            blanks: [
              { label: 'a =', answer: 2 },
              { label: 'b =', answer: -8 },
            ],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- factor */
    {
      id: 'factor',
      heading: L('How do you factor an algebraic expression?', 'Bagaimana memfaktorkan bentuk aljabar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To factor an expression is to write it as a product, the reverse of expanding: $x^2-x-6$ becomes $(x+2)(x-3)$.** Work through the same checklist every time, in this order, and check the answer by expanding it again.

1. **Take out the common factor.** $6x^2+9x=3x(2x+3)$, since 3 and $x$ divide both terms. Do this first, because it makes everything after it smaller.
2. **Two terms: a difference of squares?** $a^2-b^2=(a-b)(a+b)$, so $x^2-25=(x-5)(x+5)$ and $4x^2-9=(2x-3)(2x+3)$. A *sum* of squares such as $x^2+9$ does not factor over the real numbers.
3. **Three terms: a perfect square?** $a^2\pm2ab+b^2=(a\pm b)^2$, so $x^2+6x+9=(x+3)^2$. The test is that the middle term is twice the product of the square roots of the outer terms.
4. **Three terms, leading coefficient 1.** For $x^2+bx+c$ find two numbers whose product is $c$ and whose sum is $b$: they are the numbers in $(x+p)(x+q)$. For $x^2-5x+6$ the numbers are $-2$ and $-3$ (product 6, sum −5), so it is $(x-2)(x-3)$.
5. **Three terms, leading coefficient not 1.** For $ax^2+bx+c$ find two numbers whose product is $ac$ and whose sum is $b$, split the middle term with them, and group. For $2x^2+7x+3$ the product is 6 and the sum 7, so the numbers are 1 and 6:

$2x^2+x+6x+3=x(2x+1)+3(2x+1)=(2x+1)(x+3)$.

**Reading the signs for $x^2+bx+c$.** If $c$ is positive the two numbers have the same sign, the sign of $b$: $x^2+7x+12=(x+3)(x+4)$ and $x^2-7x+12=(x-3)(x-4)$. If $c$ is negative they have opposite signs, and the larger one takes the sign of $b$: $x^2+2x-15=(x+5)(x-3)$.

**Not everything factors.** An expression is *fully factored* when no factor can be broken further. The trinomial $x^2+x+1$ has no whole-number factors at all, and $x^2-2$ has none with whole numbers, although with radicals it is $(x-\sqrt2)(x+\sqrt2)$. The tool below follows the checklist and says which step it used.`,
            T`**Memfaktorkan bentuk aljabar berarti menuliskannya sebagai hasil kali, kebalikan dari menjabarkan: $x^2-x-6$ menjadi $(x+2)(x-3)$.** Kerjakan daftar periksa yang sama setiap kali, dengan urutan ini, dan periksa jawabannya dengan menjabarkannya kembali.

1. **Keluarkan faktor persekutuan.** $6x^2+9x=3x(2x+3)$, sebab 3 dan $x$ membagi kedua suku. Lakukan ini lebih dulu, karena langkah-langkah sesudahnya jadi lebih kecil.
2. **Dua suku: selisih dua kuadrat?** $a^2-b^2=(a-b)(a+b)$, sehingga $x^2-25=(x-5)(x+5)$ dan $4x^2-9=(2x-3)(2x+3)$. *Jumlah* dua kuadrat seperti $x^2+9$ tidak dapat difaktorkan di bilangan real.
3. **Tiga suku: kuadrat sempurna?** $a^2\pm2ab+b^2=(a\pm b)^2$, sehingga $x^2+6x+9=(x+3)^2$. Ujinya, suku tengah sama dengan dua kali hasil kali akar kuadrat dari suku-suku di tepinya.
4. **Tiga suku, koefisien depan 1.** Untuk $x^2+bx+c$ cari dua bilangan yang hasil kalinya $c$ dan jumlahnya $b$: itulah bilangan dalam $(x+p)(x+q)$. Untuk $x^2-5x+6$ bilangannya $-2$ dan $-3$ (hasil kali 6, jumlah −5), sehingga bentuknya $(x-2)(x-3)$.
5. **Tiga suku, koefisien depan bukan 1.** Untuk $ax^2+bx+c$ cari dua bilangan yang hasil kalinya $ac$ dan jumlahnya $b$, pecah suku tengah dengan keduanya, lalu kelompokkan. Untuk $2x^2+7x+3$ hasil kalinya 6 dan jumlahnya 7, sehingga bilangannya 1 dan 6:

$2x^2+x+6x+3=x(2x+1)+3(2x+1)=(2x+1)(x+3)$.

**Membaca tanda pada $x^2+bx+c$.** Bila $c$ positif, kedua bilangan bertanda sama, yaitu tanda $b$: $x^2+7x+12=(x+3)(x+4)$ dan $x^2-7x+12=(x-3)(x-4)$. Bila $c$ negatif, tandanya berlawanan, dan yang lebih besar mengikuti tanda $b$: $x^2+2x-15=(x+5)(x-3)$.

**Tidak semuanya dapat difaktorkan.** Sebuah bentuk *terfaktor sepenuhnya* bila tidak ada faktor yang dapat dipecah lagi. Trinomial $x^2+x+1$ sama sekali tidak punya faktor bilangan bulat, dan $x^2-2$ tidak punya faktor bilangan bulat, meskipun dengan akar ia menjadi $(x-\sqrt2)(x+\sqrt2)$. Alat di bawah mengikuti daftar periksa itu dan menyebutkan langkah yang dipakainya.`,
          ),
        },
        { kind: 'widget', name: 'factor' },
        {
          kind: 'callout',
          tone: 'tip',
          title: L('Always check by expanding', 'Selalu periksa dengan menjabarkan'),
          text: L(
            T`Factoring is easy to verify: multiply your factors back out and compare with the start. If $(x-2)(x-3)$ expands to $x^2-5x+6$, you are done. If the middle term is wrong, the two numbers have the right product but the wrong sum, or the wrong signs.`,
            T`Pemfaktoran mudah diverifikasi: kalikan kembali faktor-faktormu dan bandingkan dengan bentuk awal. Jika $(x-2)(x-3)$ dijabarkan menjadi $x^2-5x+6$, selesai. Jika suku tengahnya salah, kedua bilangan punya hasil kali yang benar tetapi jumlah atau tanda yang salah.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: a difference of squares', 'Coba: selisih dua kuadrat'),
          step: {
            kind: 'math',
            id: 'a5',
            hints: [
              L('$49=7^2$, so this is $x^2-7^2$.', '$49=7^2$, jadi ini $x^2-7^2$.'),
              L('$a^2-b^2=(a-b)(a+b)$.', '$a^2-b^2=(a-b)(a+b)$.'),
            ],
            explain: L('$x^2-49=x^2-7^2=(x-7)(x+7)$, so $p=7$.', '$x^2-49=x^2-7^2=(x-7)(x+7)$, sehingga $p=7$.'),
            prompt: L('Find $p$.', 'Tentukan $p$.'),
            given: String.raw`x^2-49=(x-7)(x+p)`,
            blanks: [{ label: 'p =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: a trinomial', 'Coba: sebuah trinomial'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('Find two numbers with product 12 and sum 7.', 'Cari dua bilangan dengan hasil kali 12 dan jumlah 7.'),
              L('3 and 4: $3\\cdot4=12$ and $3+4=7$.', '3 dan 4: $3\\cdot4=12$ dan $3+4=7$.'),
            ],
            explain: L('The numbers are 3 and 4, so $x^2+7x+12=(x+3)(x+4)$ and $q=4$.', 'Bilangannya 3 dan 4, sehingga $x^2+7x+12=(x+3)(x+4)$ dan $q=4$.'),
            prompt: L('Find $q$.', 'Tentukan $q$.'),
            given: String.raw`x^2+7x+12=(x+3)(x+q)`,
            blanks: [{ label: 'q =', answer: 4 }],
          },
        },
      ],
    },

    /* -------------------------------------------------------------- fractions */
    {
      id: 'algebraic-fractions',
      heading: L('How do you simplify algebraic fractions?', 'Bagaimana menyederhanakan pecahan aljabar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To simplify an algebraic fraction, factor the top and the bottom, then cancel the factors they share; you may cancel factors, never terms.** This is where factoring pays off.

$\dfrac{x^2-9}{x+3}=\dfrac{(x-3)(x+3)}{x+3}=x-3$.

$\dfrac{x^2-1}{x^2-x}=\dfrac{(x-1)(x+1)}{x(x-1)}=\dfrac{x+1}{x}$.

**Restrictions.** A fraction is undefined where its bottom is zero, and cancelling does not remove that. The first fraction above is not defined at $x=-3$, although $x-3$ is. So the honest statement is $\dfrac{x^2-9}{x+3}=x-3$ *for $x\neq-3$*. Try $x=-3$ in code below: the original gives an error or NaN.

**Terms cannot be cancelled.** In $\dfrac{x+3}{3}$ the 3 on top is part of a sum, not a factor, so it does not cancel. Test with $x=3$: the fraction is $\dfrac63=2$, while $x+1=4$. What is true is $\dfrac{x+3}{3}=\dfrac x3+1$.

**Multiplying and dividing** work as with numbers: multiply tops and bottoms, $\dfrac ab\cdot\dfrac cd=\dfrac{ac}{bd}$, and to divide, multiply by the reciprocal, $\dfrac ab\div\dfrac cd=\dfrac ab\cdot\dfrac dc$. Factor first and cancel before multiplying out.

**Adding and subtracting** need a common denominator, just as $\frac12+\frac13$ does:

$\dfrac1x+\dfrac1{x+1}=\dfrac{x+1}{x(x+1)}+\dfrac{x}{x(x+1)}=\dfrac{2x+1}{x(x+1)}$.

The common denominator is the product of the different factors, here $x(x+1)$, with each fraction rewritten over it.`,
            T`**Untuk menyederhanakan pecahan aljabar, faktorkan pembilang dan penyebut, lalu coret faktor yang sama; kamu boleh mencoret faktor, tidak pernah suku.** Di sinilah pemfaktoran berguna.

$\dfrac{x^2-9}{x+3}=\dfrac{(x-3)(x+3)}{x+3}=x-3$.

$\dfrac{x^2-1}{x^2-x}=\dfrac{(x-1)(x+1)}{x(x-1)}=\dfrac{x+1}{x}$.

**Pembatas.** Pecahan tidak terdefinisi di tempat penyebutnya nol, dan mencoret tidak menghapus hal itu. Pecahan pertama di atas tidak terdefinisi pada $x=-3$, padahal $x-3$ terdefinisi. Jadi pernyataan yang jujur adalah $\dfrac{x^2-9}{x+3}=x-3$ *untuk $x\neq-3$*. Coba $x=-3$ pada kode di bawah: bentuk aslinya memberi galat atau NaN.

**Suku tidak boleh dicoret.** Pada $\dfrac{x+3}{3}$ angka 3 di atas adalah bagian dari sebuah jumlah, bukan faktor, sehingga tidak dicoret. Ujilah dengan $x=3$: pecahannya $\dfrac63=2$, sedangkan $x+1=4$. Yang benar adalah $\dfrac{x+3}{3}=\dfrac x3+1$.

**Perkalian dan pembagian** bekerja seperti pada bilangan: kalikan pembilang dan penyebut, $\dfrac ab\cdot\dfrac cd=\dfrac{ac}{bd}$, dan untuk membagi, kalikan dengan kebalikannya, $\dfrac ab\div\dfrac cd=\dfrac ab\cdot\dfrac dc$. Faktorkan dulu dan coret sebelum mengalikan.

**Penjumlahan dan pengurangan** memerlukan penyebut yang sama, seperti $\frac12+\frac13$:

$\dfrac1x+\dfrac1{x+1}=\dfrac{x+1}{x(x+1)}+\dfrac{x}{x(x+1)}=\dfrac{2x+1}{x(x+1)}$.

Penyebut bersamanya adalah hasil kali faktor-faktor yang berbeda, di sini $x(x+1)$, dengan tiap pecahan ditulis ulang di atasnya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: simplify a fraction', 'Coba: menyederhanakan pecahan'),
          step: {
            kind: 'quiz',
            id: 'a7',
            prompt: L('Simplify $\\dfrac{x^2-9}{x+3}$ (for $x\\neq-3$).', 'Sederhanakan $\\dfrac{x^2-9}{x+3}$ (untuk $x\\neq-3$).'),
            options: [L('$x-3$', '$x-3$'), L('$x-9$', '$x-9$'), L('$x^2-3$', '$x^2-3$'), L('It cannot be simplified', 'Tidak dapat disederhanakan')],
            answer: 0,
            explain: L(
              '$x^2-9=(x-3)(x+3)$, and the factor $x+3$ cancels, leaving $x-3$. Cancelling the 3 and the $x$ from the terms would be wrong.',
              '$x^2-9=(x-3)(x+3)$, dan faktor $x+3$ dicoret, menyisakan $x-3$. Mencoret 3 dan $x$ dari suku-sukunya akan salah.',
            ),
            hint: L('Factor the top first.', 'Faktorkan pembilangnya dulu.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------ word to algebra */
    {
      id: 'words-to-algebra',
      heading: L('How do you turn words into algebra?', 'Bagaimana mengubah kalimat menjadi aljabar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To turn words into algebra, name the unknown quantity with a letter and translate each phrase into an operation, taking care over the order of "less than" and "from".** Algebra is a short way of writing a sentence.

| In words | In algebra |
|---|---|
| a number plus 5, or 5 more than $n$ | $n+5$ |
| 7 less than twice $n$ | $2n-7$ |
| 7 less than $n$ | $n-7$ |
| $n$ subtracted from 7 | $7-n$ |
| the sum of $n$ and 3, doubled | $2(n+3)$ |
| a third of $n$ | $\dfrac n3$ |
| the square of the sum of $a$ and $b$ | $(a+b)^2$ |
| the sum of the squares of $a$ and $b$ | $a^2+b^2$ |

"Less than" and "from" reverse the order: "7 less than $n$" starts from $n$, so it is $n-7$, not $7-n$.

**A worked example.** A notebook costs 5 dollars and a pen costs 3 dollars. For $x$ notebooks and $y$ pens the total is $5x+3y$ dollars. With 3 notebooks and 2 pens, substitute: $5\cdot3+3\cdot2=21$ dollars. The expression is a recipe that works for any quantities, and that is the point of using letters.`,
            T`**Untuk mengubah kalimat menjadi aljabar, namai besaran yang tidak diketahui dengan sebuah huruf dan terjemahkan tiap frasa menjadi operasi, dengan teliti pada urutan "kurangnya dari" dan "dikurangi dari".** Aljabar adalah cara singkat menulis sebuah kalimat.

| Dalam kata | Dalam aljabar |
|---|---|
| suatu bilangan ditambah 5, atau 5 lebihnya dari $n$ | $n+5$ |
| 7 kurangnya dari dua kali $n$ | $2n-7$ |
| 7 kurangnya dari $n$ | $n-7$ |
| $n$ dikurangkan dari 7 | $7-n$ |
| jumlah $n$ dan 3, dilipatduakan | $2(n+3)$ |
| sepertiga dari $n$ | $\dfrac n3$ |
| kuadrat dari jumlah $a$ dan $b$ | $(a+b)^2$ |
| jumlah kuadrat $a$ dan $b$ | $a^2+b^2$ |

"Kurangnya dari" dan "dikurangkan dari" membalik urutan: "7 kurangnya dari $n$" bermula dari $n$, sehingga $n-7$, bukan $7-n$.

**Contoh.** Sebuah buku tulis berharga Rp5.000 dan sebuah pena Rp3.000. Untuk $x$ buku tulis dan $y$ pena, totalnya $5000x+3000y$ rupiah. Dengan 3 buku tulis dan 2 pena, substitusikan: $5000\cdot3+3000\cdot2=21000$ rupiah, yaitu Rp21.000. Bentuk aljabar itu adalah resep yang berlaku untuk jumlah berapa pun, dan itulah gunanya memakai huruf.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: from words to an expression', 'Coba: dari kalimat ke bentuk aljabar'),
          step: {
            kind: 'quiz',
            id: 'a8',
            prompt: L('Which expression means "7 less than twice $n$"?', 'Bentuk aljabar mana yang berarti "7 kurangnya dari dua kali $n$"?'),
            options: [L('$2n-7$', '$2n-7$'), L('$7-2n$', '$7-2n$'), L('$2(n-7)$', '$2(n-7)$'), L('$n^2-7$', '$n^2-7$')],
            answer: 0,
            explain: L(
              'Twice $n$ is $2n$, and "7 less than" that is $2n-7$. $7-2n$ has the order reversed, and $2(n-7)$ doubles after subtracting.',
              'Dua kali $n$ adalah $2n$, dan "7 kurangnya dari" itu adalah $2n-7$. $7-2n$ membalik urutan, dan $2(n-7)$ melipatduakan setelah mengurangi.',
            ),
            hint: L('Build "twice $n$" first, then take 7 away from it.', 'Susun "dua kali $n$" dulu, lalu kurangi 7 darinya.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'algebra-in-code',
      heading: L('How do you work with algebraic expressions in Python and JavaScript?', 'Bagaimana mengolah bentuk aljabar di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code an expression you want to evaluate becomes a function, and an expression you want to manipulate symbolically needs a library such as SymPy in Python.** Plain Python and JavaScript only calculate with numbers; they do not know that $x^2-9=(x-3)(x+3)$.`,
            T`**Dalam kode, bentuk aljabar yang ingin dihitung nilainya menjadi sebuah fungsi, dan bentuk yang ingin dimanipulasi secara simbolik memerlukan pustaka seperti SymPy di Python.** Python dan JavaScript biasa hanya menghitung dengan bilangan; keduanya tidak tahu bahwa $x^2-9=(x-3)(x+3)$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python with SymPy (a symbolic algebra library)', 'Python dengan SymPy (pustaka aljabar simbolik)'),
          code: `>>> from sympy import symbols, expand, factor, simplify
>>> x = symbols('x')
>>> expand((x + 2) * (x - 3))
x**2 - x - 6
>>> factor(x**2 - 5*x + 6)
(x - 3)*(x - 2)
>>> factor(x**2 + 1)          # no real factors, so it is returned unchanged
x**2 + 1
>>> simplify((x**2 - 9) / (x + 3))
x - 3
>>> (3*x**2 - 5*x + 1).subs(x, 2)
3`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: an expression as a function', 'JavaScript: bentuk aljabar sebagai fungsi'),
          code: `const f = (x) => 3 * x ** 2 - 5 * x + 1
f(2)     // 3
f(-2)    // 23

const g = (x) => (x ** 2 - 9) / (x + 3)
g(2)     // -1
g(3)     // 0, the same as 3 - 3
g(-3)    // NaN, because the original is 0 / 0 there`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´3x´ for 3 times x | SyntaxError in both languages | write ´3 * x´; code has no implied multiplication |
| ´2(x + 1)´ | TypeError: the 2 is treated as a function | write ´2 * (x + 1)´ |
| ´^´ for a power | it is XOR, not a power | use ´**´ |
| ´x ** 2´ in plain Python | NameError until x has a value | give x a number, or use SymPy for a symbol |
| Symbolic vs numeric | ´x**2 - 9´ never becomes ´(x - 3)*(x + 3)´ by itself | use ´factor´ in SymPy |
| Comparing results | ´0.1 * 3´ is not exactly ´0.3´ | compare with a tolerance, as in the article on real numbers |

A numeric test such as ´f(2)´ can catch a wrong simplification but cannot prove a right one: it checks one input, exactly the limit described in the section on evaluating.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´3x´ untuk 3 kali x | SyntaxError di kedua bahasa | tulis ´3 * x´; kode tidak mengenal perkalian tersirat |
| ´2(x + 1)´ | TypeError: angka 2 dianggap fungsi | tulis ´2 * (x + 1)´ |
| ´^´ untuk pangkat | itu XOR, bukan pangkat | pakai ´**´ |
| ´x ** 2´ di Python biasa | NameError sampai x diberi nilai | beri x sebuah bilangan, atau pakai SymPy untuk simbol |
| Simbolik lawan numerik | ´x**2 - 9´ tidak pernah menjadi ´(x - 3)*(x + 3)´ dengan sendirinya | pakai ´factor´ di SymPy |
| Membandingkan hasil | ´0.1 * 3´ tidak persis ´0.3´ | bandingkan dengan toleransi, seperti pada artikel bilangan real |

Uji numerik seperti ´f(2)´ dapat menangkap penyederhanaan yang salah tetapi tidak dapat membuktikan yang benar: ia memeriksa satu masukan, tepat seperti batas yang dijelaskan pada bagian menghitung nilai.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes in algebraic expressions?', 'Apa kesalahan umum pada bentuk aljabar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with algebraic expressions are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| $2x+3x=5x^2$ | $2x+3x=5x$. Adding like terms changes the coefficient, not the exponent. |
| $(x+3)^2=x^2+9$ | $(x+3)^2=x^2+6x+9$. Check at $x=1$: 16, not 10. |
| $3(x+2)=3x+2$ | $3(x+2)=3x+6$. The 3 multiplies every term. |
| $-(x-4)=-x-4$ | $-(x-4)=-x+4$. The minus flips every sign inside. |
| $3x+5x^2=8x^3$ | Unlike terms stay apart: $3x+5x^2$ is already simplest. |
| $\dfrac{x+3}{3}=x+1$ | Terms do not cancel: $\dfrac{x+3}{3}=\dfrac x3+1$. |
| $\dfrac{x^2-9}{x+3}=x-9$ | Factor first: it is $x-3$ (for $x\neq-3$). |
| $x^2-16=(x-4)^2$ | $x^2-16=(x-4)(x+4)$. A difference of squares has two different signs. |
| $-x^2=9$ at $x=-3$ | $-x^2=-(-3)^2=-9$. Only $(-x)^2$ is positive. |`,
            T`**Kesalahan paling umum pada bentuk aljabar adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| $2x+3x=5x^2$ | $2x+3x=5x$. Menjumlahkan suku sejenis mengubah koefisien, bukan eksponen. |
| $(x+3)^2=x^2+9$ | $(x+3)^2=x^2+6x+9$. Periksa pada $x=1$: 16, bukan 10. |
| $3(x+2)=3x+2$ | $3(x+2)=3x+6$. Angka 3 mengalikan setiap suku. |
| $-(x-4)=-x-4$ | $-(x-4)=-x+4$. Tanda minus membalik setiap tanda di dalam. |
| $3x+5x^2=8x^3$ | Suku tak sejenis tetap terpisah: $3x+5x^2$ sudah paling sederhana. |
| $\dfrac{x+3}{3}=x+1$ | Suku tidak dicoret: $\dfrac{x+3}{3}=\dfrac x3+1$. |
| $\dfrac{x^2-9}{x+3}=x-9$ | Faktorkan dulu: hasilnya $x-3$ (untuk $x\neq-3$). |
| $x^2-16=(x-4)^2$ | $x^2-16=(x-4)(x+4)$. Selisih dua kuadrat bertanda berbeda di kedua faktor. |
| $-x^2=9$ pada $x=-3$ | $-x^2=-(-3)^2=-9$. Hanya $(-x)^2$ yang positif. |`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- practice */
    {
      id: 'practice',
      heading: L('Practice: test your understanding', 'Latihan: uji pemahamanmu'),
      blocks: [
        {
          kind: 'text',
          text: L(
            'These questions mix everything above. A wrong answer costs nothing here: read the hint and try again.',
            'Soal-soal ini mencampur semua yang dibahas di atas. Jika jawabanmu belum tepat, perhatikan petunjuk yang tersedia, lalu coba kembali.',
          ),
        },
        {
          kind: 'activity',
          title: L('True or false?', 'Benar atau salah?'),
          step: {
            kind: 'judge',
            id: 'p1',
            prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
            statements: [
              L('$2x+3x=5x^2$.', '$2x+3x=5x^2$.'),
              L('$3(x+2)=3x+6$.', '$3(x+2)=3x+6$.'),
              L('$(x+3)^2=x^2+9$.', '$(x+3)^2=x^2+9$.'),
              L('$x^2-16=(x-4)(x+4)$.', '$x^2-16=(x-4)(x+4)$.'),
              L('$\\dfrac{x+3}{3}=x+1$.', '$\\dfrac{x+3}{3}=x+1$.'),
            ],
            answer: [false, true, false, true, false],
            explain: L(
              '$2x+3x=5x$. $3(x+2)=3x+6$ by the distributive law. $(x+3)^2=x^2+6x+9$. $x^2-16$ is a difference of squares. In $\\frac{x+3}{3}$ the 3 on top is a term, so it cannot cancel.',
              '$2x+3x=5x$. $3(x+2)=3x+6$ menurut sifat distributif. $(x+3)^2=x^2+6x+9$. $x^2-16$ adalah selisih dua kuadrat. Pada $\\frac{x+3}{3}$ angka 3 di atas adalah suku, sehingga tidak dapat dicoret.',
            ),
            hint: L('Substitute a number such as $x=1$ or $x=3$ into both sides.', 'Substitusikan bilangan seperti $x=1$ atau $x=3$ ke kedua ruas.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the terms that are like terms of $3x^2y$.', 'Pilih **semua** suku yang sejenis dengan $3x^2y$.'),
            options: [L('$-5x^2y$', '$-5x^2y$'), L('$x^2y$', '$x^2y$'), L('$3xy^2$', '$3xy^2$'), L('$3x^2$', '$3x^2$'), L('$\\frac12x^2y$', '$\\frac12x^2y$')],
            answer: [0, 1, 4],
            explain: L(
              'Like terms have the same letters with the same exponents: $x^2y$. That is $-5x^2y$, $x^2y$ and $\\frac12x^2y$. In $3xy^2$ the exponents are swapped, and $3x^2$ has no $y$.',
              'Suku sejenis memiliki huruf yang sama dengan eksponen yang sama: $x^2y$. Itu adalah $-5x^2y$, $x^2y$, dan $\\frac12x^2y$. Pada $3xy^2$ eksponennya tertukar, dan $3x^2$ tidak memuat $y$.',
            ),
            hint: L('Ignore the coefficients and compare only the letters and exponents.', 'Abaikan koefisiennya dan bandingkan hanya huruf dan eksponennya.'),
          },
        },
        {
          kind: 'activity',
          title: L('A special product', 'Hasil kali istimewa'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('This is $(a+b)(a-b)$ with $a=x$ and $b=5$.', 'Ini $(a+b)(a-b)$ dengan $a=x$ dan $b=5$.'),
              L('The result is $a^2-b^2$.', 'Hasilnya $a^2-b^2$.'),
            ],
            explain: L('$(x+5)(x-5)=x^2-25$, so $k=25$.', '$(x+5)(x-5)=x^2-25$, sehingga $k=25$.'),
            prompt: L('Find $k$.', 'Tentukan $k$.'),
            given: String.raw`(x+5)(x-5)=x^2-k`,
            blanks: [{ label: 'k =', answer: 25 }],
          },
        },
        {
          kind: 'activity',
          title: L('Evaluate', 'Hitung nilai'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('Substitute in brackets: $2(3)^2-3(3)+1$.', 'Substitusikan dalam kurung: $2(3)^2-3(3)+1$.'),
              L('$2\\cdot9-9+1$.', '$2\\cdot9-9+1$.'),
            ],
            explain: L('$2\\cdot9-3\\cdot3+1=18-9+1=10$.', '$2\\cdot9-3\\cdot3+1=18-9+1=10$.'),
            prompt: L('Evaluate $2x^2-3x+1$ at $x=3$.', 'Hitung $2x^2-3x+1$ pada $x=3$.'),
            given: String.raw`2(3)^2-3(3)+1=v`,
            blanks: [{ label: 'v =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('Factor a trinomial', 'Faktorkan sebuah trinomial'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('Which is the factored form of $2x^2+7x+3$?', 'Manakah bentuk faktor dari $2x^2+7x+3$?'),
            options: [L('$(2x+1)(x+3)$', '$(2x+1)(x+3)$'), L('$(2x+3)(x+1)$', '$(2x+3)(x+1)$'), L('$(2x-1)(x-3)$', '$(2x-1)(x-3)$'), L('$2(x+1)(x+3)$', '$2(x+1)(x+3)$')],
            answer: 0,
            explain: L(
              '$(2x+1)(x+3)=2x^2+6x+x+3=2x^2+7x+3$. The others give a middle term of $5x$, $-7x$ and $8x$.',
              '$(2x+1)(x+3)=2x^2+6x+x+3=2x^2+7x+3$. Pilihan lain memberi suku tengah $5x$, $-7x$, dan $8x$.',
            ),
            hint: L('Expand each option and compare the middle term.', 'Jabarkan tiap pilihan dan bandingkan suku tengahnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Words to algebra', 'Dari kalimat ke aljabar'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('A phone plan costs 20 a month plus 3 for every extra gigabyte $g$. Which expression gives the monthly cost?', 'Paket telepon berbiaya 20 per bulan ditambah 3 untuk setiap gigabita tambahan $g$. Bentuk aljabar mana yang memberi biaya bulanan?'),
            options: [L('$20+3g$', '$20+3g$'), L('$20g+3$', '$20g+3$'), L('$23g$', '$23g$'), L('$60g$', '$60g$')],
            answer: 0,
            explain: L(
              'The 20 is paid once, so it is a constant; the 3 is paid per gigabyte, so it multiplies $g$. The cost is $20+3g$.',
              '20 dibayar sekali, jadi ia konstanta; 3 dibayar per gigabita, jadi ia mengalikan $g$. Biayanya $20+3g$.',
            ),
            hint: L('Which amount depends on $g$, and which does not?', 'Jumlah mana yang bergantung pada $g$, dan mana yang tidak?'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: algebraic expressions at a glance', 'Ringkasan: bentuk aljabar sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Parts:** an expression is terms joined by + and −; a term has a coefficient and a variable part, and a term with no letter is a constant.
- **Like terms:** same letters, same exponents; add coefficients, keep the variable part.
- **Evaluate:** put each value in brackets, then follow the order of operations. A few matching inputs never prove two expressions equal.
- **Expand:** $a(b+c)=ab+ac$ and $(a+b)(c+d)=ac+ad+bc+bd$; $(a\pm b)^2=a^2\pm2ab+b^2$; $(a+b)(a-b)=a^2-b^2$.
- **Factor:** common factor first, then a difference of squares, a perfect square, or two numbers with product $c$ and sum $b$; check by expanding.
- **Fractions:** factor, then cancel factors, never terms; note where the bottom is zero.
- **Words:** name the unknown, and watch the order in "less than".
- **Code:** write ´3 * x´, not ´3x´; use ´**´ for powers; use SymPy for symbolic work.`,
            T`- **Bagian:** bentuk aljabar adalah suku-suku yang dihubungkan oleh + dan −; suku memiliki koefisien dan bagian variabel, dan suku tanpa huruf adalah konstanta.
- **Suku sejenis:** huruf sama, eksponen sama; jumlahkan koefisien, pertahankan bagian variabel.
- **Hitung nilai:** taruh tiap nilai dalam kurung, lalu ikuti urutan operasi. Beberapa masukan yang cocok tidak pernah membuktikan dua bentuk sama.
- **Jabarkan:** $a(b+c)=ab+ac$ dan $(a+b)(c+d)=ac+ad+bc+bd$; $(a\pm b)^2=a^2\pm2ab+b^2$; $(a+b)(a-b)=a^2-b^2$.
- **Faktorkan:** faktor persekutuan lebih dulu, lalu selisih dua kuadrat, kuadrat sempurna, atau dua bilangan dengan hasil kali $c$ dan jumlah $b$; periksa dengan menjabarkan.
- **Pecahan:** faktorkan, lalu coret faktor, bukan suku; perhatikan di mana penyebutnya nol.
- **Kalimat:** namai yang tidak diketahui, dan perhatikan urutan pada "kurangnya dari".
- **Kode:** tulis ´3 * x´, bukan ´3x´; pakai ´**´ untuk pangkat; pakai SymPy untuk kerja simbolik.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Algebraic expression', 'Bentuk aljabar'), definition: L('A combination of numbers, variables and operations with no equals sign, such as 3x squared minus 5x plus 7.', 'Gabungan bilangan, variabel, dan operasi tanpa tanda sama dengan, seperti 3x kuadrat dikurangi 5x ditambah 7.') },
    { term: L('Variable', 'Variabel'), definition: L('A letter that stands for a number that can change or is not yet known.', 'Huruf yang mewakili bilangan yang dapat berubah atau belum diketahui.') },
    { term: L('Constant', 'Konstanta'), definition: L('A term with no variable, whose value never changes, such as the 7 in 3x plus 7.', 'Suku tanpa variabel yang nilainya tidak pernah berubah, seperti 7 pada 3x ditambah 7.') },
    { term: L('Term', 'Suku'), definition: L('One part of an expression, separated from the others by a plus or minus sign, which carries its own sign.', 'Satu bagian dari bentuk aljabar yang dipisahkan dari bagian lain oleh tanda plus atau minus, dan membawa tandanya sendiri.') },
    { term: L('Coefficient', 'Koefisien'), definition: L('The number that multiplies the variables in a term, as the minus 5 in minus 5x.', 'Bilangan yang mengalikan variabel dalam sebuah suku, seperti minus 5 pada minus 5x.') },
    { term: L('Like terms', 'Suku sejenis'), definition: L('Terms with exactly the same variables raised to the same exponents, which differ at most in their coefficients.', 'Suku-suku dengan variabel yang persis sama dan eksponen yang sama, yang paling banyak berbeda pada koefisiennya.') },
    { term: L('Polynomial', 'Polinomial (suku banyak)'), definition: L('A sum of terms in which each variable has a whole-number exponent, such as x squared minus x minus 6.', 'Jumlah suku-suku yang tiap variabelnya berpangkat bilangan bulat, seperti x kuadrat dikurangi x dikurangi 6.') },
    { term: L('Degree', 'Derajat'), definition: L('The largest sum of exponents of the variables in any single term of a polynomial.', 'Jumlah eksponen variabel terbesar pada satu suku mana pun dari sebuah polinomial.') },
    { term: L('Binomial', 'Binomial'), definition: L('A polynomial with exactly two terms, such as x plus 3.', 'Polinomial dengan tepat dua suku, seperti x ditambah 3.') },
    { term: L('Distributive law', 'Sifat distributif'), definition: L('The rule that a times the sum of b and c equals a times b plus a times c.', 'Aturan bahwa a kali jumlah b dan c sama dengan a kali b ditambah a kali c.') },
    { term: L('Expanding', 'Menjabarkan'), definition: L('Removing brackets by multiplying out a product, so that (x plus 2)(x minus 3) becomes x squared minus x minus 6.', 'Menghilangkan kurung dengan mengalikan sebuah hasil kali, sehingga (x ditambah 2)(x dikurangi 3) menjadi x kuadrat dikurangi x dikurangi 6.') },
    { term: L('Factoring', 'Memfaktorkan'), definition: L('Writing an expression as a product of simpler expressions, the reverse of expanding.', 'Menuliskan bentuk aljabar sebagai hasil kali bentuk-bentuk yang lebih sederhana, kebalikan dari menjabarkan.') },
    { term: L('Difference of squares', 'Selisih dua kuadrat'), definition: L('An expression of the form a squared minus b squared, which factors as a minus b times a plus b.', 'Bentuk a kuadrat dikurangi b kuadrat, yang difaktorkan menjadi a dikurangi b kali a ditambah b.') },
    { term: L('Algebraic fraction', 'Pecahan aljabar'), definition: L('A fraction whose top and bottom are algebraic expressions, defined only where the bottom is not zero.', 'Pecahan yang pembilang dan penyebutnya bentuk aljabar, terdefinisi hanya bila penyebutnya bukan nol.') },
  ],

  howTo: [
    {
      name: L('How to combine like terms', 'Cara menggabungkan suku sejenis'),
      description: L('Simplify a sum by adding the coefficients of terms that have the same variable part.', 'Sederhanakan sebuah jumlah dengan menjumlahkan koefisien suku yang bagian variabelnya sama.'),
      steps: [
        { name: L('Find the like terms', 'Temukan suku sejenis'), text: L('Mark the terms with the same letters and exponents, keeping the sign in front of each, for example 5x squared and minus 2x squared.', 'Tandai suku dengan huruf dan eksponen yang sama, sambil mempertahankan tanda di depan masing-masing, misalnya 5x kuadrat dan minus 2x kuadrat.') },
        { name: L('Group them', 'Kelompokkan'), text: L('Bring the like terms next to each other, moving each one together with its sign.', 'Letakkan suku sejenis berdampingan, memindahkan masing-masing bersama tandanya.') },
        { name: L('Add the coefficients', 'Jumlahkan koefisien'), text: L('Add the coefficients in each group and keep the variable part, so 5x squared minus 2x squared is 3x squared.', 'Jumlahkan koefisien di tiap kelompok dan pertahankan bagian variabel, sehingga 5x kuadrat dikurangi 2x kuadrat adalah 3x kuadrat.') },
        { name: L('Write it in order', 'Tulis berurutan'), text: L('Write the result from the highest degree down to the constant.', 'Tulis hasilnya dari derajat tertinggi hingga konstanta.') },
      ],
    },
    {
      name: L('How to expand two brackets', 'Cara menjabarkan dua kurung'),
      description: L('Multiply two binomials with the distributive law and combine the middle terms.', 'Kalikan dua binomial dengan sifat distributif lalu gabungkan suku tengahnya.'),
      steps: [
        { name: L('Multiply every pair', 'Kalikan setiap pasangan'), text: L('Multiply each term of the first bracket by each term of the second, giving four products, for example x times x, x times minus 3, 2 times x and 2 times minus 3.', 'Kalikan tiap suku kurung pertama dengan tiap suku kurung kedua, menghasilkan empat hasil kali, misalnya x kali x, x kali minus 3, 2 kali x, dan 2 kali minus 3.') },
        { name: L('Write the four products', 'Tulis keempat hasil kali'), text: L('Add them with their signs: x squared minus 3x plus 2x minus 6.', 'Jumlahkan dengan tandanya: x kuadrat dikurangi 3x ditambah 2x dikurangi 6.') },
        { name: L('Combine like terms', 'Gabungkan suku sejenis'), text: L('Combine the two middle terms: minus 3x plus 2x is minus x, so the result is x squared minus x minus 6.', 'Gabungkan dua suku tengah: minus 3x ditambah 2x adalah minus x, sehingga hasilnya x kuadrat dikurangi x dikurangi 6.') },
      ],
    },
    {
      name: L('How to factor a quadratic trinomial', 'Cara memfaktorkan trinomial kuadrat'),
      description: L('Factor x squared plus bx plus c by finding two numbers with the right product and sum.', 'Faktorkan x kuadrat ditambah bx ditambah c dengan mencari dua bilangan yang hasil kali dan jumlahnya tepat.'),
      steps: [
        { name: L('Take out a common factor', 'Keluarkan faktor persekutuan'), text: L('Check whether all three terms share a factor, and take it out first.', 'Periksa apakah ketiga suku memiliki faktor yang sama, dan keluarkan lebih dulu.') },
        { name: L('Find the two numbers', 'Cari dua bilangan'), text: L('Find two numbers whose product is c and whose sum is b; for x squared minus 5x plus 6 they are minus 2 and minus 3.', 'Cari dua bilangan yang hasil kalinya c dan jumlahnya b; untuk x kuadrat dikurangi 5x ditambah 6 bilangannya minus 2 dan minus 3.') },
        { name: L('Write the brackets', 'Tulis kurungnya'), text: L('Write x plus each number in its own bracket: x minus 2 times x minus 3.', 'Tulis x ditambah tiap bilangan dalam kurungnya sendiri: x dikurangi 2 kali x dikurangi 3.') },
        { name: L('Check by expanding', 'Periksa dengan menjabarkan'), text: L('Multiply the brackets out again and confirm that you get the original expression.', 'Kalikan kembali kurungnya dan pastikan hasilnya bentuk semula.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an algebraic expression?', 'Apa itu bentuk aljabar?'),
      a: L(
        'An algebraic expression is a combination of numbers, variables and operations without an equals sign, such as 3x plus 5 or a squared minus b squared. It has a value once the variables are given values, and it can be simplified, expanded or factored, but not solved.',
        'Bentuk aljabar adalah gabungan bilangan, variabel, dan operasi tanpa tanda sama dengan, seperti 3x ditambah 5 atau a kuadrat dikurangi b kuadrat. Ia punya nilai begitu variabelnya diberi nilai, dan dapat disederhanakan, dijabarkan, atau difaktorkan, tetapi tidak diselesaikan.',
      ),
    },
    {
      q: L('What is the difference between an expression and an equation?', 'Apa beda bentuk aljabar dan persamaan?'),
      a: L(
        'An equation has an equals sign and states that two expressions are equal, for example 2x plus 3 equals 11, and you solve it for the unknown. An expression has no equals sign, like 2x plus 3, and you simplify it, evaluate it or factor it.',
        'Persamaan memiliki tanda sama dengan dan menyatakan dua bentuk aljabar sama, misalnya 2x ditambah 3 sama dengan 11, dan kamu menyelesaikannya untuk mencari yang tidak diketahui. Bentuk aljabar tidak memiliki tanda sama dengan, seperti 2x ditambah 3, dan kamu menyederhanakan, menghitung nilai, atau memfaktorkannya.',
      ),
    },
    {
      q: L('What are like terms?', 'Apa itu suku sejenis?'),
      a: L(
        'Like terms have exactly the same variables with the same exponents; only their coefficients may differ. So 3x and minus 7x are like terms, as are 4xy and minus xy, but 3x squared and 5x are not, because the exponents differ. Only like terms can be combined.',
        'Suku sejenis memiliki variabel yang persis sama dengan eksponen yang sama; hanya koefisiennya yang boleh berbeda. Jadi 3x dan minus 7x sejenis, begitu pula 4xy dan minus xy, tetapi 3x kuadrat dan 5x tidak, karena eksponennya berbeda. Hanya suku sejenis yang dapat digabung.',
      ),
    },
    {
      q: L('What is a coefficient?', 'Apa itu koefisien?'),
      a: L(
        'The coefficient is the number that multiplies the variables in a term, including its sign. In 4x squared minus 7x plus 2, the coefficients are 4 and minus 7. A variable on its own, such as x, has coefficient 1, and the constant 2 is its own coefficient.',
        'Koefisien adalah bilangan yang mengalikan variabel dalam sebuah suku, termasuk tandanya. Pada 4x kuadrat dikurangi 7x ditambah 2, koefisiennya adalah 4 dan minus 7. Variabel yang berdiri sendiri, seperti x, berkoefisien 1, dan konstanta 2 adalah koefisiennya sendiri.',
      ),
    },
    {
      q: L('How do you simplify an algebraic expression?', 'Bagaimana menyederhanakan bentuk aljabar?'),
      a: L(
        'Remove brackets with the distributive law, then group the like terms and add their coefficients, and write the result from the highest degree down. For example 3 times x plus 2, minus 2 times x minus 1, becomes 3x plus 6 minus 2x plus 2, which is x plus 8.',
        'Hilangkan kurung dengan sifat distributif, lalu kelompokkan suku sejenis dan jumlahkan koefisiennya, dan tulis hasilnya dari derajat tertinggi ke bawah. Misalnya 3 kali x ditambah 2, dikurangi 2 kali x dikurangi 1, menjadi 3x ditambah 6 dikurangi 2x ditambah 2, yaitu x ditambah 8.',
      ),
    },
    {
      q: L('How do you expand two brackets?', 'Bagaimana menjabarkan dua kurung?'),
      a: L(
        'Multiply every term in the first bracket by every term in the second, then combine like terms. For x plus 2 times x minus 3 the four products are x squared, minus 3x, 2x and minus 6, which add up to x squared minus x minus 6.',
        'Kalikan setiap suku di kurung pertama dengan setiap suku di kurung kedua, lalu gabungkan suku sejenis. Untuk x ditambah 2 kali x dikurangi 3, empat hasil kalinya adalah x kuadrat, minus 3x, 2x, dan minus 6, yang berjumlah x kuadrat dikurangi x dikurangi 6.',
      ),
    },
    {
      q: L('Why is x plus 3, squared, not x squared plus 9?', 'Mengapa x ditambah 3, dikuadratkan, bukan x kuadrat ditambah 9?'),
      a: L(
        'Because squaring means multiplying the bracket by itself, x plus 3 times x plus 3, and that produces two middle terms: 3x and 3x. The correct result is x squared plus 6x plus 9. A quick check at x equals 1 gives 16 on the left and only 10 for x squared plus 9.',
        'Karena mengkuadratkan berarti mengalikan kurung dengan dirinya sendiri, x ditambah 3 kali x ditambah 3, dan itu menghasilkan dua suku tengah: 3x dan 3x. Hasil yang benar adalah x kuadrat ditambah 6x ditambah 9. Pemeriksaan cepat pada x sama dengan 1 memberi 16 di kiri dan hanya 10 untuk x kuadrat ditambah 9.',
      ),
    },
    {
      q: L('How do you factor a quadratic expression?', 'Bagaimana memfaktorkan bentuk kuadrat?'),
      a: L(
        'First take out any common factor. Then, for x squared plus bx plus c, find two numbers whose product is c and whose sum is b, and write them in two brackets. For x squared minus 5x plus 6 the numbers are minus 2 and minus 3, so it factors as x minus 2 times x minus 3.',
        'Pertama keluarkan faktor persekutuan bila ada. Lalu, untuk x kuadrat ditambah bx ditambah c, cari dua bilangan yang hasil kalinya c dan jumlahnya b, dan tulis dalam dua kurung. Untuk x kuadrat dikurangi 5x ditambah 6 bilangannya minus 2 dan minus 3, sehingga difaktorkan menjadi x dikurangi 2 kali x dikurangi 3.',
      ),
    },
    {
      q: L('What is a difference of squares?', 'Apa itu selisih dua kuadrat?'),
      a: L(
        'It is an expression of the form a squared minus b squared, which always factors as a minus b times a plus b. For example x squared minus 25 is x minus 5 times x plus 5. A sum of squares such as x squared plus 25 does not factor over the real numbers.',
        'Itu adalah bentuk a kuadrat dikurangi b kuadrat, yang selalu difaktorkan menjadi a dikurangi b kali a ditambah b. Misalnya x kuadrat dikurangi 25 adalah x dikurangi 5 kali x ditambah 5. Jumlah dua kuadrat seperti x kuadrat ditambah 25 tidak dapat difaktorkan di bilangan real.',
      ),
    },
    {
      q: L('Can you cancel terms in a fraction?', 'Bolehkah mencoret suku pada pecahan?'),
      a: L(
        'No, only factors can be cancelled. In x plus 3 over 3 the 3 on top is part of a sum, so it stays: the result is x over 3 plus 1. To cancel, factor first, as in x squared minus 9 over x plus 3, which becomes x minus 3.',
        'Tidak, hanya faktor yang boleh dicoret. Pada x ditambah 3 per 3, angka 3 di atas adalah bagian dari sebuah jumlah, sehingga tetap: hasilnya x per 3 ditambah 1. Untuk mencoret, faktorkan dulu, seperti pada x kuadrat dikurangi 9 per x ditambah 3, yang menjadi x dikurangi 3.',
      ),
    },
    {
      q: L('How do you evaluate an expression with a negative number?', 'Bagaimana menghitung bentuk aljabar dengan bilangan negatif?'),
      a: L(
        'Put the negative value in brackets in place of the letter, then follow the order of operations. For 2x squared at x equal to minus 3, write 2 times minus 3, squared, which is 2 times 9, or 18. Without the brackets you would wrongly get minus 18.',
        'Taruh nilai negatif dalam kurung menggantikan huruf, lalu ikuti urutan operasi. Untuk 2x kuadrat pada x sama dengan minus 3, tulis 2 kali minus 3, dikuadratkan, yaitu 2 kali 9, atau 18. Tanpa kurung kamu akan keliru mendapat minus 18.',
      ),
    },
    {
      q: L('What is the degree of a polynomial?', 'Berapakah derajat suatu polinomial?'),
      a: L(
        'The degree is the highest total of exponents in any single term. In 3x squared minus 5x plus 7 it is 2, so the polynomial is quadratic. The term 4xy has degree 2, because the exponents 1 and 1 add up, and a nonzero constant has degree 0.',
        'Derajat adalah jumlah eksponen tertinggi pada satu suku mana pun. Pada 3x kuadrat dikurangi 5x ditambah 7 derajatnya 2, sehingga polinomial itu kuadrat. Suku 4xy berderajat 2, karena eksponen 1 dan 1 dijumlahkan, dan konstanta bukan nol berderajat 0.',
      ),
    },
    {
      q: L('How do you check a factorisation?', 'Bagaimana memeriksa hasil pemfaktoran?'),
      a: L(
        'Multiply the factors back out and compare the result with the original expression. If x minus 2 times x minus 3 expands to x squared minus 5x plus 6, the factoring is correct. You can also substitute one number, such as x equals 1, into both forms.',
        'Kalikan kembali faktor-faktornya dan bandingkan hasilnya dengan bentuk semula. Jika x dikurangi 2 kali x dikurangi 3 dijabarkan menjadi x kuadrat dikurangi 5x ditambah 6, pemfaktorannya benar. Kamu juga dapat mensubstitusikan satu bilangan, misalnya x sama dengan 1, ke kedua bentuk.',
      ),
    },
    {
      q: L('How do you expand and factor with Python?', 'Bagaimana menjabarkan dan memfaktorkan dengan Python?'),
      a: L(
        'Use the SymPy library. Create a symbol with symbols, then call expand to remove brackets, factor to write a product, and simplify to reduce a fraction. Plain Python cannot do this because it only calculates with numbers, and the caret is XOR, so write powers with a double asterisk.',
        'Pakai pustaka SymPy. Buat simbol dengan symbols, lalu panggil expand untuk menghilangkan kurung, factor untuk menulis hasil kali, dan simplify untuk menyederhanakan pecahan. Python biasa tidak dapat melakukannya karena hanya menghitung dengan bilangan, dan tanda sisipan adalah XOR, jadi tulis pangkat dengan dua tanda bintang.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'The Compendious Book on Calculation by Completion and Balancing (Al-kitab al-mukhtasar fi hisab al-jabr wa-l-muqabala)', author: 'Muhammad ibn Musa al-Khwarizmi', year: 820 },
    { title: 'In artem analyticem isagoge', author: 'François Viète', year: 1591 },
    { title: 'La Géométrie', author: 'René Descartes', year: 1637 },
    { title: 'A History of Mathematical Notations', author: 'Florian Cajori', year: 1928, source: 'Open Court Publishing Company' },
    { title: 'SymPy tutorial: simplification', author: 'SymPy Development Team', source: 'docs.sympy.org', url: 'https://docs.sympy.org/latest/tutorials/intro-tutorial/simplification.html' },
  ],

  related: ['real-numbers', 'exponents-and-radicals'],
}
