import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './irrational-numbers.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped.
 *  `[words](article:id#section)` is a link to another article. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

export const body: ArticleBody = {
  answer: L(
    T`**An irrational number is a real number that cannot be written as a fraction of two integers; its decimal expansion is infinite and never periodic.** The best-known examples are $\sqrt2=1.41421\ldots$, $\pi=3.14159\ldots$ and $e=2.71828\ldots$. A square root of a whole number is irrational unless the number is a perfect square, so $\sqrt{16}=4$ is rational and $\sqrt{15}$ is not.`,
    T`**Bilangan irasional adalah bilangan real yang tidak dapat ditulis sebagai pecahan dua bilangan bulat; ekspansi desimalnya tak berhingga dan tidak pernah periodik.** Contoh yang paling dikenal adalah $\sqrt2=1{,}41421\ldots$, $\pi=3{,}14159\ldots$, dan $e=2{,}71828\ldots$. Akar kuadrat bilangan bulat bersifat irasional kecuali bilangan itu kuadrat sempurna, sehingga $\sqrt{16}=4$ rasional dan $\sqrt{15}$ tidak.`,
  ),

  keyPoints: [
    L(
      T`A real number is either rational or irrational, never both; irrational means no integers $p,q$ with $q\neq0$ give $\frac pq$.`,
      T`Bilangan real rasional atau irasional, tidak pernah keduanya; irasional berarti tidak ada bilangan bulat $p,q$ dengan $q\neq0$ yang membuat $\frac pq$ sama dengannya.`,
    ),
    L(
      T`The $k$-th root of a positive integer is either an integer or irrational: it is an integer exactly when every exponent in the prime factorization is a multiple of $k$.`,
      T`Akar pangkat $k$ dari bilangan bulat positif adalah bilangan bulat atau irasional: ia bilangan bulat tepat bila setiap eksponen dalam faktorisasi primanya kelipatan $k$.`,
    ),
    L(
      T`Rational plus irrational is irrational, and so is a non-zero rational times an irrational; the sum or product of two irrationals can be rational, as in $\sqrt2\cdot\sqrt2=2$.`,
      T`Rasional ditambah irasional adalah irasional, begitu pula rasional bukan nol dikali irasional; jumlah atau hasil kali dua bilangan irasional dapat rasional, seperti $\sqrt2\cdot\sqrt2=2$.`,
    ),
    L(
      T`$\pi$ and $e$ are not only irrational but transcendental: they are not roots of any non-zero polynomial with integer coefficients, which is why a circle cannot be squared.`,
      T`$\pi$ dan $e$ tidak hanya irasional tetapi transenden: keduanya bukan akar polinomial tak nol mana pun dengan koefisien bulat, itulah sebabnya lingkaran tidak dapat dikuadratkan.`,
    ),
    L(
      T`A number is irrational exactly when its continued fraction never stops; its convergents, such as $\frac{22}{7}$ and $\frac{355}{113}$ for $\pi$, approximate it ever better but never equal it.`,
      T`Sebuah bilangan irasional tepat bila pecahan berantainya tidak pernah berhenti; konvergennya, seperti $\frac{22}{7}$ dan $\frac{355}{113}$ untuk $\pi$, menghampirinya makin baik tetapi tidak pernah sama dengannya.`,
    ),
    L(
      T`Almost every real number is irrational, yet between any two rational numbers there is an irrational one, and between any two irrational numbers there is a rational one.`,
      T`Hampir setiap bilangan real irasional, namun di antara dua bilangan rasional mana pun ada bilangan irasional, dan di antara dua bilangan irasional mana pun ada bilangan rasional.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-an-irrational-number',
      heading: L('What is an irrational number?', 'Apa itu bilangan irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An irrational number is a real number that is not rational: no two integers $p$ and $q\neq0$ make $\frac pq$ equal to it.** The real numbers split cleanly into the two families, as the article on [real numbers](article:real-numbers#irrational-numbers) explains, so a number is rational or irrational and never both.

Because every [rational number](article:rational-numbers#decimals-percent) has a decimal expansion that terminates or eventually repeats periodically, the same fact can be turned round: **a real number is irrational exactly when its decimal expansion is infinite and never periodic.** The digits go on for ever and no block of them ever repeats from some point on.

| Number | Value | Why irrational |
|---|---|---|
| $\sqrt2$ | $1.41421356\ldots$ | 2 is not a perfect square |
| $\sqrt3$, $\sqrt5$, $\sqrt6$, $\sqrt7$ | $1.7320\ldots$, $2.2360\ldots$, … | not perfect squares |
| $\sqrt[3]{2}$ | $1.25992\ldots$ | 2 is not a perfect cube |
| $\pi$ | $3.14159265\ldots$ | Lambert, 1761 |
| $e$ | $2.71828182\ldots$ | Euler, 1737 |
| $\varphi=\frac{1+\sqrt5}{2}$ | $1.61803398\ldots$ | $\sqrt5$ is irrational |
| $\log_{10}2$ | $0.30102999\ldots$ | no power of 2 is a power of 10 |

Three things are *not* irrational, although they are often mistaken for it. A root sign does not decide it: $\sqrt{16}=4$ and $\sqrt[3]{27}=3$ are whole numbers. A long decimal does not decide it: $\frac1{97}$ has a block of 96 repeating digits. And a decimal that goes on for ever is not enough: $0.333\ldots=\frac13$.

The word "irrational" comes from *ratio*, the same root as in rational numbers: an irrational number is one that is *not a ratio* of integers. It does not mean "unreasonable". Irrational numbers are exact, well-behaved numbers; it is only their decimal expansions that cannot be written down in full.`,
            T`**Bilangan irasional adalah bilangan real yang tidak rasional: tidak ada dua bilangan bulat $p$ dan $q\neq0$ yang membuat $\frac pq$ sama dengannya.** Bilangan real terbagi bersih menjadi dua keluarga itu, seperti dijelaskan artikel [bilangan real](article:real-numbers#irrational-numbers), sehingga sebuah bilangan rasional atau irasional dan tidak pernah keduanya.

Karena setiap [bilangan rasional](article:rational-numbers#decimals-percent) punya ekspansi desimal yang berakhir atau akhirnya berulang secara periodik, fakta yang sama dapat dibalik: **bilangan real irasional tepat bila ekspansi desimalnya tak berhingga dan tidak pernah periodik.** Angkanya berlanjut tanpa akhir dan tidak ada blok angka yang berulang mulai dari suatu titik.

| Bilangan | Nilai | Mengapa irasional |
|---|---|---|
| $\sqrt2$ | $1{,}41421356\ldots$ | 2 bukan kuadrat sempurna |
| $\sqrt3$, $\sqrt5$, $\sqrt6$, $\sqrt7$ | $1{,}7320\ldots$, $2{,}2360\ldots$, … | bukan kuadrat sempurna |
| $\sqrt[3]{2}$ | $1{,}25992\ldots$ | 2 bukan kubik sempurna |
| $\pi$ | $3{,}14159265\ldots$ | Lambert, 1761 |
| $e$ | $2{,}71828182\ldots$ | Euler, 1737 |
| $\varphi=\frac{1+\sqrt5}{2}$ | $1{,}61803398\ldots$ | $\sqrt5$ irasional |
| $\log_{10}2$ | $0{,}30102999\ldots$ | tidak ada pangkat 2 yang sama dengan pangkat 10 |

Tiga hal *bukan* irasional, walaupun sering disangka demikian. Tanda akar tidak menentukannya: $\sqrt{16}=4$ dan $\sqrt[3]{27}=3$ adalah bilangan bulat. Desimal yang panjang tidak menentukannya: $\frac1{97}$ punya blok 96 angka yang berulang. Dan desimal yang berlanjut tanpa akhir saja belum cukup: $0{,}333\ldots=\frac13$.

Kata "irasional" berasal dari *rasio*, akar kata yang sama dengan bilangan rasional: bilangan irasional adalah bilangan yang *bukan perbandingan* bilangan bulat. Ia tidak berarti "tidak masuk akal". Bilangan irasional adalah bilangan yang eksak dan berperilaku baik; hanya ekspansi desimalnya yang tidak dapat ditulis seluruhnya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: the decimal test', 'Coba: uji desimal'),
          step: {
            kind: 'quiz',
            id: 'a1',
            prompt: L('Which statement describes an irrational number?', 'Pernyataan mana yang menggambarkan bilangan irasional?'),
            options: [
              L('Its decimal expansion terminates.', 'Ekspansi desimalnya berakhir.'),
              L('Its decimal expansion eventually repeats periodically.', 'Ekspansi desimalnya akhirnya berulang secara periodik.'),
              L('Its decimal expansion is infinite and never periodic.', 'Ekspansi desimalnya tak berhingga dan tidak pernah periodik.'),
              L('It is not a real number.', 'Ia bukan bilangan real.'),
            ],
            answer: 2,
            explain: L(
              'The first two describe the rational numbers, for example $\\frac18=0.125$ and $\\frac13=0.\\overline{3}$. An irrational number is real, with an expansion that is infinite and never periodic.',
              'Dua pernyataan pertama menggambarkan bilangan rasional, misalnya $\\frac18=0{,}125$ dan $\\frac13=0{,}\\overline{3}$. Bilangan irasional adalah bilangan real dengan ekspansi yang tak berhingga dan tidak pernah periodik.',
            ),
            hint: L('Which kinds of decimal belong to fractions?', 'Jenis desimal mana yang milik pecahan?'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- sqrt 2 */
    {
      id: 'why-sqrt2-is-irrational',
      heading: L('Why is √2 irrational?', 'Mengapa √2 irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**$\sqrt2$ is irrational because assuming $\sqrt2=\frac ab$ forces a number to have both an even and an odd count of factors of 2, which is impossible.** It is the oldest proof by contradiction, and the version below uses the unique [prime factorization](article:integers#primes) of every integer.

Suppose $\sqrt2=\frac ab$ with $a$ and $b$ positive integers. Squaring gives $a^2=2b^2$. Now count how many times the prime 2 divides each side. If 2 divides $a$ exactly $m$ times, then it divides $a^2$ exactly $2m$ times, an **even** number. If it divides $b$ exactly $n$ times, then it divides $2b^2$ exactly $2n+1$ times, an **odd** number. The two sides are the same integer, so they have the same factorization, and no number of factors of 2 is both even and odd. The assumption was false: no such $a$ and $b$ exist.

The more familiar version of the same proof, which cancels common factors until $a$ and $b$ are coprime and finds both even, is written out with an exercise in the [real numbers article](article:real-numbers#irrational-numbers). The count of 2s is shorter, and it proves more:

- Replace 2 by any integer $n$ and the same argument works whenever some prime divides $n$ an **odd** number of times. So $\sqrt3$, $\sqrt5$, $\sqrt6$, $\sqrt{12}$ are all irrational.
- Replace the square root by a $k$-th root and "even" by "a multiple of $k$": $\sqrt[3]{2}$ is irrational because 3 does not divide 1.

**Geometry says the same thing.** The diagonal of a unit square (see the [diagonals of a square](article:quadrilaterals#properties)) has length $\sqrt2$, and the square's side and diagonal are *incommensurable*: no unit of length, however small, fits a whole number of times into both. The Pythagoreans, who held that everything is a ratio of whole numbers, met this fact in the fifth century BCE, and Plato's *Theaetetus* says Theodorus of Cyrene showed the irrationality of the roots of 3, 5 and so on up to 17. Tradition names Hippasus as the Pythagorean who revealed it, although the stories are late and not reliable. Euclid's *Elements*, Book X, classifies the irrational lengths that compass and straightedge can make.`,
            T`**$\sqrt2$ irasional karena mengandaikan $\sqrt2=\frac ab$ memaksa sebuah bilangan punya banyak faktor 2 yang genap sekaligus ganjil, dan itu mustahil.** Ini bukti dengan kontradiksi yang tertua, dan versi di bawah memakai [faktorisasi prima](article:integers#primes) yang tunggal dari setiap bilangan bulat.

Misalkan $\sqrt2=\frac ab$ dengan $a$ dan $b$ bilangan bulat positif. Mengkuadratkan memberi $a^2=2b^2$. Sekarang hitung berapa kali bilangan prima 2 membagi tiap ruas. Jika 2 membagi $a$ tepat $m$ kali, maka ia membagi $a^2$ tepat $2m$ kali, bilangan **genap**. Jika ia membagi $b$ tepat $n$ kali, maka ia membagi $2b^2$ tepat $2n+1$ kali, bilangan **ganjil**. Kedua ruas adalah bilangan bulat yang sama, sehingga faktorisasinya sama, dan tidak ada banyak faktor 2 yang genap sekaligus ganjil. Pengandaiannya salah: tidak ada $a$ dan $b$ seperti itu.

Versi yang lebih akrab dari bukti yang sama, yang mencoret faktor sama sampai $a$ dan $b$ saling prima lalu mendapati keduanya genap, dituliskan lengkap beserta latihannya di [artikel bilangan real](article:real-numbers#irrational-numbers). Menghitung faktor 2 lebih singkat, dan membuktikan lebih banyak:

- Ganti 2 dengan bilangan bulat $n$ mana pun dan argumen yang sama berlaku bila ada bilangan prima yang membagi $n$ sebanyak **ganjil** kali. Jadi $\sqrt3$, $\sqrt5$, $\sqrt6$, $\sqrt{12}$ semuanya irasional.
- Ganti akar kuadrat dengan akar pangkat $k$ dan "genap" dengan "kelipatan $k$": $\sqrt[3]{2}$ irasional karena 3 tidak membagi 1.

**Geometri mengatakan hal yang sama.** Diagonal persegi satuan (lihat [diagonal persegi](article:quadrilaterals#properties)) panjangnya $\sqrt2$, dan sisi serta diagonal persegi itu *tak sepadan*: tidak ada satuan panjang, sekecil apa pun, yang muat bilangan bulat kali pada keduanya. Kaum Pythagoras, yang berpendapat bahwa segala sesuatu adalah perbandingan bilangan bulat, menjumpai fakta ini pada abad ke-5 SM, dan *Theaetetus* karya Plato menyebut bahwa Theodorus dari Kirene menunjukkan keirasionalan akar 3, 5, dan seterusnya sampai 17. Tradisi menyebut Hippasus sebagai orang Pythagoras yang membocorkannya, walaupun kisahnya muncul belakangan dan tidak dapat diandalkan. *Elements* karya Euclid, Buku X, menggolongkan panjang-panjang irasional yang dapat dibuat dengan jangka dan penggaris.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: count the factors of 2', 'Coba: hitung faktor 2'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Squaring doubles every exponent: $(2^3)^2=2^6$.', 'Mengkuadratkan menggandakan setiap eksponen: $(2^3)^2=2^6$.'),
              L('$2b^2=2\\cdot(2^4)^2\\cdot9=2^{1+8}\\cdot9$.', '$2b^2=2\\cdot(2^4)^2\\cdot9=2^{1+8}\\cdot9$.'),
            ],
            explain: L('$a^2=2^{6}\\cdot25$ has an even exponent of 2, while $2b^2=2^{9}\\cdot9$ has an odd one. That mismatch is always there, so $a^2=2b^2$ never holds.', '$a^2=2^{6}\\cdot25$ punya eksponen 2 yang genap, sedangkan $2b^2=2^{9}\\cdot9$ punya yang ganjil. Ketidakcocokan itu selalu ada, sehingga $a^2=2b^2$ tidak pernah berlaku.'),
            prompt: L('Find the exponents $e$ and $f$ of 2.', 'Tentukan eksponen $e$ dan $f$ dari 2.'),
            given: String.raw`a=2^{3}\cdot5\Rightarrow a^{2}=2^{e}\cdot25,\qquad b=2^{4}\cdot3\Rightarrow 2b^{2}=2^{f}\cdot9`,
            blanks: [
              { label: 'e =', answer: 6 },
              { label: 'f =', answer: 9 },
            ],
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ roots */
    {
      id: 'which-roots-are-irrational',
      heading: L('How can you tell whether a root is irrational?', 'Bagaimana mengetahui apakah suatu akar irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The $k$-th root of a positive integer is either a whole number or irrational, and it is a whole number exactly when every exponent in the prime factorization of the integer is a multiple of $k$.** There is no third case: a root of an integer is never a fraction that is not a whole number.

To decide, factorize and look at the exponents:

| Root | Factorization | Exponents divisible by $k$? | Verdict |
|---|---|---|---|
| $\sqrt{49}$ | $7^2$ | yes | $7$, rational |
| $\sqrt{72}$ | $2^3\cdot3^2$ | no: 3 | $6\sqrt2$, irrational |
| $\sqrt[3]{54}$ | $2\cdot3^3$ | no: 1 | $3\sqrt[3]{2}$, irrational |
| $\sqrt[4]{81}$ | $3^4$ | yes | $3$, rational |
| $\sqrt{1\,000\,000}$ | $2^6\cdot5^6$ | yes | $1000$, rational |

Taking out every complete group of $k$ equal primes also **simplifies the radical**: $\sqrt{72}=\sqrt{2^2\cdot2\cdot3^2}=2\cdot3\cdot\sqrt2=6\sqrt2$. The way this is done step by step is in the section on [simplifying radicals](article:exponents-and-radicals#simplify-radicals), and the number left under the root is what stays irrational.

Two facts help. A fraction of integers works the same way, since $\sqrt{\frac pq}=\frac{\sqrt p}{\sqrt q}$, so $\sqrt{\frac49}=\frac23$ is rational but $\sqrt{\frac12}=\frac{\sqrt2}{2}$ is not. And a root of a number that is not an integer can still be rational (for example $\sqrt{\frac94}=\frac32$), so the rule above is about integers.

Try your own numbers, including large ones. The tool factorizes up to a trillion and prints 30 decimals.`,
            T`**Akar pangkat $k$ dari bilangan bulat positif adalah bilangan bulat atau irasional, dan ia bilangan bulat tepat bila setiap eksponen dalam faktorisasi prima bilangan itu kelipatan $k$.** Tidak ada kemungkinan ketiga: akar dari bilangan bulat tidak pernah pecahan yang bukan bilangan bulat.

Untuk memutuskan, faktorkan dan lihat eksponennya:

| Akar | Faktorisasi | Eksponen habis dibagi $k$? | Kesimpulan |
|---|---|---|---|
| $\sqrt{49}$ | $7^2$ | ya | $7$, rasional |
| $\sqrt{72}$ | $2^3\cdot3^2$ | tidak: 3 | $6\sqrt2$, irasional |
| $\sqrt[3]{54}$ | $2\cdot3^3$ | tidak: 1 | $3\sqrt[3]{2}$, irasional |
| $\sqrt[4]{81}$ | $3^4$ | ya | $3$, rasional |
| $\sqrt{1000000}$ | $2^6\cdot5^6$ | ya | $1000$, rasional |

Mengeluarkan setiap kelompok lengkap berisi $k$ bilangan prima yang sama juga **menyederhanakan bentuk akar**: $\sqrt{72}=\sqrt{2^2\cdot2\cdot3^2}=2\cdot3\cdot\sqrt2=6\sqrt2$. Cara melakukannya langkah demi langkah ada pada bagian [menyederhanakan bentuk akar](article:exponents-and-radicals#simplify-radicals), dan bilangan yang tersisa di bawah akar itulah yang tetap irasional.

Dua fakta membantu. Pecahan bilangan bulat bekerja sama, sebab $\sqrt{\frac pq}=\frac{\sqrt p}{\sqrt q}$, sehingga $\sqrt{\frac49}=\frac23$ rasional tetapi $\sqrt{\frac12}=\frac{\sqrt2}{2}$ tidak. Dan akar dari bilangan yang bukan bilangan bulat masih dapat rasional (misalnya $\sqrt{\frac94}=\frac32$), jadi aturan di atas berlaku untuk bilangan bulat.

Coba bilanganmu sendiri, termasuk yang besar. Alat ini memfaktorkan sampai satu triliun dan menampilkan 30 desimal.`,
          ),
        },
        { kind: 'widget', name: 'rootcheck' },
        {
          kind: 'activity',
          title: L('Try it: which root is rational?', 'Coba: akar mana yang rasional?'),
          step: {
            kind: 'quiz',
            id: 'a3',
            prompt: L('Which of these roots is rational?', 'Akar mana di antara ini yang rasional?'),
            options: [L('$\\sqrt{12}$', '$\\sqrt{12}$'), L('$\\sqrt[3]{16}$', '$\\sqrt[3]{16}$'), L('$\\sqrt[4]{81}$', '$\\sqrt[4]{81}$'), L('$\\sqrt{50}$', '$\\sqrt{50}$')],
            answer: 2,
            explain: L(
              '$81=3^4$ and the exponent 4 is a multiple of the index 4, so $\\sqrt[4]{81}=3$. But $12=2^2\\cdot3$ and $50=2\\cdot5^2$ leave a prime to the power 1, and $16=2^4$ has exponent 4, which is not a multiple of 3.',
              '$81=3^4$ dan eksponen 4 adalah kelipatan indeks 4, sehingga $\\sqrt[4]{81}=3$. Tetapi $12=2^2\\cdot3$ dan $50=2\\cdot5^2$ menyisakan bilangan prima berpangkat 1, dan $16=2^4$ berekponen 4, yang bukan kelipatan 3.',
            ),
            hint: L('Factorize each number and check the exponents against the root index.', 'Faktorkan tiap bilangan dan periksa eksponennya terhadap indeks akar.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------- arithmetic */
    {
      id: 'sums-and-products',
      heading: L('What happens when you add or multiply irrational numbers?', 'Apa yang terjadi bila bilangan irasional dijumlahkan atau dikalikan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A rational number plus an irrational number is irrational, and so is a non-zero rational times an irrational; but the sum, difference, product or quotient of two irrational numbers can be rational or irrational.** The irrational numbers are therefore not closed under any of the four operations.

| Operation | Result | Example |
|---|---|---|
| rational + irrational | always irrational | $1+\sqrt2$ |
| non-zero rational × irrational | always irrational | $\frac12\sqrt3$ |
| irrational + irrational | either | $\sqrt2+\sqrt3$ is irrational; $\sqrt2+(-\sqrt2)=0$ |
| irrational × irrational | either | $\sqrt2\cdot\sqrt3=\sqrt6$ is irrational; $\sqrt2\cdot\sqrt2=2$ |
| irrational ÷ irrational | either | $\frac{\sqrt6}{\sqrt2}=\sqrt3$ is irrational; $\frac{\sqrt8}{\sqrt2}=2$ |

**Why rational plus irrational is irrational.** Suppose $r+x=s$ with $r$ and $s$ rational and $x$ irrational. Then $x=s-r$ is a difference of rational numbers, which is rational: a contradiction. The same argument with division proves the product rule, since $x=\frac sr$ would be rational.

**Two irrational numbers can combine into a rational one.** The pair $1+\sqrt2$ and $1-\sqrt2$ are *conjugates*, and their product is rational because the roots cancel, as in the [difference of squares](article:algebraic-expressions#expand): $(1+\sqrt2)(1-\sqrt2)=1-2=-1$. This is the idea behind [rationalizing a denominator](article:exponents-and-radicals#rationalise).

**Exact arithmetic with $a+b\sqrt m$.** Numbers of the form $a+b\sqrt m$, with $a$ and $b$ rational and $\sqrt m$ irrational, can be added, subtracted, multiplied and divided exactly and the answer is again of that form. The number is rational exactly when $b=0$. The tool below does this arithmetic with exact fractions; try the examples, then your own.

A simple example of a power of irrationals being rational is $\left(\sqrt2^{\sqrt2}\right)^{\sqrt2}$. If $\sqrt2^{\sqrt2}$ is rational we have an irrational power of an irrational that is rational; if it is irrational, raising it to $\sqrt2$ gives $\sqrt2^{2}=2$. Either way such a pair exists, although this argument does not say which case holds. In fact $\sqrt2^{\sqrt2}$ is irrational and even transcendental.`,
            T`**Bilangan rasional ditambah bilangan irasional adalah irasional, begitu pula rasional bukan nol dikali irasional; tetapi jumlah, selisih, hasil kali, atau hasil bagi dua bilangan irasional dapat rasional atau irasional.** Jadi bilangan irasional tidak tertutup terhadap satu pun dari keempat operasi.

| Operasi | Hasil | Contoh |
|---|---|---|
| rasional + irasional | selalu irasional | $1+\sqrt2$ |
| rasional bukan nol × irasional | selalu irasional | $\frac12\sqrt3$ |
| irasional + irasional | salah satunya | $\sqrt2+\sqrt3$ irasional; $\sqrt2+(-\sqrt2)=0$ |
| irasional × irasional | salah satunya | $\sqrt2\cdot\sqrt3=\sqrt6$ irasional; $\sqrt2\cdot\sqrt2=2$ |
| irasional ÷ irasional | salah satunya | $\frac{\sqrt6}{\sqrt2}=\sqrt3$ irasional; $\frac{\sqrt8}{\sqrt2}=2$ |

**Mengapa rasional ditambah irasional adalah irasional.** Misalkan $r+x=s$ dengan $r$ dan $s$ rasional dan $x$ irasional. Maka $x=s-r$ adalah selisih bilangan rasional, yang rasional: sebuah kontradiksi. Argumen yang sama dengan pembagian membuktikan aturan hasil kali, sebab $x=\frac sr$ akan rasional.

**Dua bilangan irasional dapat bergabung menjadi bilangan rasional.** Pasangan $1+\sqrt2$ dan $1-\sqrt2$ adalah *sekawan*, dan hasil kalinya rasional karena akarnya saling meniadakan, seperti pada [selisih dua kuadrat](article:algebraic-expressions#expand): $(1+\sqrt2)(1-\sqrt2)=1-2=-1$. Inilah gagasan di balik [merasionalkan penyebut](article:exponents-and-radicals#rationalise).

**Aritmetika eksak dengan $a+b\sqrt m$.** Bilangan berbentuk $a+b\sqrt m$, dengan $a$ dan $b$ rasional dan $\sqrt m$ irasional, dapat dijumlahkan, dikurangkan, dikalikan, dan dibagi secara eksak dan jawabannya berbentuk yang sama. Bilangan itu rasional tepat bila $b=0$. Alat di bawah melakukan aritmetika ini dengan pecahan eksak; coba contohnya, lalu bilanganmu sendiri.

Contoh sederhana pangkat bilangan irasional yang rasional adalah $\left(\sqrt2^{\sqrt2}\right)^{\sqrt2}$. Jika $\sqrt2^{\sqrt2}$ rasional, kita punya irasional pangkat irasional yang rasional; jika ia irasional, memangkatkannya dengan $\sqrt2$ memberi $\sqrt2^{2}=2$. Bagaimanapun pasangan seperti itu ada, walaupun argumen ini tidak menyebut kasus mana yang berlaku. Sebenarnya $\sqrt2^{\sqrt2}$ irasional dan bahkan transenden.`,
          ),
        },
        { kind: 'widget', name: 'surdcalc' },
        {
          kind: 'activity',
          title: L('Try it: multiply conjugates', 'Coba: mengalikan bentuk sekawan'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('Use $(a+b)(a-b)=a^2-b^2$ with $a=2$ and $b=\\sqrt3$.', 'Pakai $(a+b)(a-b)=a^2-b^2$ dengan $a=2$ dan $b=\\sqrt3$.'),
              L('$2^2-(\\sqrt3)^2=4-3$.', '$2^2-(\\sqrt3)^2=4-3$.'),
            ],
            explain: L('$(2+\\sqrt3)(2-\\sqrt3)=4-3=1$: two irrational numbers whose product is rational.', '$(2+\\sqrt3)(2-\\sqrt3)=4-3=1$: dua bilangan irasional yang hasil kalinya rasional.'),
            prompt: L('Evaluate the product.', 'Hitung hasil kalinya.'),
            given: String.raw`(2+\sqrt{3})(2-\sqrt{3})=v`,
            blanks: [{ label: 'v =', answer: 1 }],
          },
        },
      ],
    },

    /* ------------------------------------------------------- pi, e, transcendental */
    {
      id: 'pi-e-transcendental',
      heading: L('What are π and e, and what does transcendental mean?', 'Apa itu π dan e, dan apa arti transenden?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**$\pi$ and $e$ are irrational and also transcendental, which means that neither is a root of any non-zero polynomial with integer coefficients.** A number that is such a root is called **algebraic**.

| Kind | Meaning | Examples |
|---|---|---|
| Rational | $\frac pq$ with integers; the root of $qx-p=0$ | $\frac34$, $-7$ |
| Algebraic irrational | root of an integer polynomial, but not rational | $\sqrt2$ (of $x^2-2$), $\varphi$ (of $x^2-x-1$), $1+\sqrt2$ (of $x^2-2x-1$) |
| Transcendental | root of no non-zero integer polynomial | $\pi$, $e$, Liouville's constant |

Every rational number is algebraic, so the algebraic numbers contain the rationals and some irrationals; the transcendental numbers are all irrational. Sums, products and roots of algebraic numbers are algebraic again, which is why $\sqrt2+\sqrt3$ and $\sqrt{1+\sqrt2}$ are algebraic.

**The history, in order.**

- 1737: Euler proved that $e$ is irrational (published 1744).
- 1761: Lambert showed that $\pi$ is irrational (published 1768).
- 1844: Liouville gave the first numbers proved to be transcendental, such as $0.110001000000000000000001\ldots$, with a 1 in every place whose position is a factorial ($1!,2!,3!,4!,\ldots$).
- 1873: Hermite proved that $e$ is transcendental.
- 1874: Cantor showed that the algebraic numbers can be listed one after another, so *almost every* real number is transcendental.
- 1882: Lindemann proved that $\pi$ is transcendental.

**Squaring the circle.** The old problem asks for a square equal in area to a given circle using only compass and straightedge. Lengths that can be constructed are always algebraic. Lindemann's theorem makes $\pi$, and so $\sqrt\pi$, transcendental, and so the construction is impossible. The phrase "to square the circle" has meant "to attempt the impossible" ever since.

**What is still not known.** It is easy to prove that at least one of $\pi+e$ and $\pi e$ is irrational, but nobody knows which, or whether both are. Whether $\pi+e$ is irrational at all is still an open question.`,
            T`**$\pi$ dan $e$ irasional dan juga transenden, yang berarti keduanya bukan akar polinomial tak nol mana pun dengan koefisien bulat.** Bilangan yang merupakan akar seperti itu disebut **aljabar**.

| Jenis | Arti | Contoh |
|---|---|---|
| Rasional | $\frac pq$ dengan bilangan bulat; akar dari $qx-p=0$ | $\frac34$, $-7$ |
| Irasional aljabar | akar polinomial bulat, tetapi tidak rasional | $\sqrt2$ (dari $x^2-2$), $\varphi$ (dari $x^2-x-1$), $1+\sqrt2$ (dari $x^2-2x-1$) |
| Transenden | akar dari tidak ada polinomial bulat tak nol | $\pi$, $e$, konstanta Liouville |

Setiap bilangan rasional bersifat aljabar, sehingga bilangan aljabar memuat bilangan rasional dan sebagian bilangan irasional; bilangan transenden semuanya irasional. Jumlah, hasil kali, dan akar bilangan aljabar bersifat aljabar lagi, itulah sebabnya $\sqrt2+\sqrt3$ dan $\sqrt{1+\sqrt2}$ aljabar.

**Sejarahnya, berurutan.**

- 1737: Euler membuktikan bahwa $e$ irasional (terbit 1744).
- 1761: Lambert menunjukkan bahwa $\pi$ irasional (terbit 1768).
- 1844: Liouville memberi bilangan pertama yang terbukti transenden, seperti $0{,}110001000000000000000001\ldots$, dengan angka 1 di setiap tempat yang posisinya faktorial ($1!,2!,3!,4!,\ldots$).
- 1873: Hermite membuktikan bahwa $e$ transenden.
- 1874: Cantor menunjukkan bahwa bilangan aljabar dapat didaftar satu per satu, sehingga *hampir setiap* bilangan real transenden.
- 1882: Lindemann membuktikan bahwa $\pi$ transenden.

**Mengkuadratkan lingkaran.** Masalah lama ini meminta persegi yang luasnya sama dengan sebuah lingkaran memakai hanya jangka dan penggaris. Panjang yang dapat dikonstruksi selalu aljabar. Teorema Lindemann membuat $\pi$, dan juga $\sqrt\pi$, transenden, sehingga konstruksi itu mustahil. Ungkapan "mengkuadratkan lingkaran" sejak itu berarti "mencoba yang mustahil".

**Yang masih belum diketahui.** Mudah dibuktikan bahwa sekurang-kurangnya satu dari $\pi+e$ dan $\pi e$ irasional, tetapi tidak ada yang tahu yang mana, atau apakah keduanya. Apakah $\pi+e$ irasional sama sekali masih merupakan pertanyaan terbuka.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: algebraic or transcendental?', 'Coba: aljabar atau transenden?'),
          step: {
            kind: 'quiz',
            id: 'a5',
            prompt: L('Which of these numbers is algebraic?', 'Bilangan mana di antara ini yang aljabar?'),
            options: [L('$\\pi$', '$\\pi$'), L('$e$', '$e$'), L('$1+\\sqrt2$', '$1+\\sqrt2$'), L('$\\pi^2$', '$\\pi^2$')],
            answer: 2,
            explain: L(
              '$x=1+\\sqrt2$ gives $x-1=\\sqrt2$, so $x^2-2x+1=2$ and $x^2-2x-1=0$: it is a root of an integer polynomial. $\\pi$ and $e$ are transcendental, and so is $\\pi^2$, because a polynomial equation for $\\pi^2$ would give one for $\\pi$.',
              '$x=1+\\sqrt2$ memberi $x-1=\\sqrt2$, sehingga $x^2-2x+1=2$ dan $x^2-2x-1=0$: ia akar polinomial bulat. $\\pi$ dan $e$ transenden, begitu pula $\\pi^2$, sebab persamaan polinomial untuk $\\pi^2$ akan memberi persamaan untuk $\\pi$.',
            ),
            hint: L('Can you find an integer polynomial that the number satisfies?', 'Dapatkah kamu menemukan polinomial bulat yang dipenuhi bilangan itu?'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------ approximation */
    {
      id: 'rational-approximations',
      heading: L('How well can fractions approximate an irrational number?', 'Seberapa baik pecahan dapat menghampiri bilangan irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Every irrational number can be approximated as closely as you like by fractions, and the best ones come from its continued fraction: $x=a_0+\dfrac{1}{a_1+\dfrac{1}{a_2+\cdots}}$.** To build it, take the integer part $a_0$, invert what is left over, and repeat. A rational number gives a continued fraction that stops; an irrational number gives one that goes on for ever, which is another way to say that it is irrational.

The fractions you get by stopping early are the **convergents** $\frac{p_k}{q_k}$, found by $p_k=a_kp_{k-1}+p_{k-2}$ and the same rule for $q_k$. For $\pi=[3;7,15,1,292,\ldots]$:

| $k$ | Convergent | Decimal | Error |
|---|---|---|---|
| 0 | $\frac31$ | $3$ | $1.4\times10^{-1}$ |
| 1 | $\frac{22}{7}$ | $3.142857$ | $1.3\times10^{-3}$ |
| 2 | $\frac{333}{106}$ | $3.141509$ | $8.3\times10^{-5}$ |
| 3 | $\frac{355}{113}$ | $3.14159292$ | $2.7\times10^{-7}$ |
| 4 | $\frac{103993}{33102}$ | $3.14159265301$ | $5.8\times10^{-10}$ |

$\frac{22}{7}$ is the classroom approximation. $\frac{355}{113}$ was found by Zu Chongzhi in the fifth century and is accurate to six decimals with a denominator of only three digits: the big partial quotient 292 that follows is why it is so good. For $\sqrt2=[1;2,2,2,\ldots]$ the convergents $\frac32,\frac75,\frac{17}{12},\frac{41}{29}$ satisfy $p^2-2q^2=\pm1$. For $e=[2;1,2,1,1,4,1,1,6,\ldots]$ there is a pattern, and for $\pi$ there is none that anyone knows.

**The golden ratio is the hardest to approximate.** $\varphi=[1;1,1,1,\ldots]$, and its convergents $\frac11,\frac21,\frac32,\frac53,\frac85,\frac{13}{8},\ldots$ are ratios of consecutive Fibonacci numbers. Every partial quotient is the smallest possible, so the fractions approach it more slowly than they approach any other number. It is the root of $x^2-x-1=0$, which the section on [factoring](article:algebraic-expressions#factor) shows has no whole-number factors.

**Rational numbers cannot be reached.** Dirichlet proved that for every irrational $x$ there are infinitely many fractions with $\left|x-\frac pq\right|<\frac1{q^2}$. For a rational $x$ there are only finitely many, so the error of a convergent is not just small: it is never zero. Choose a constant and the number of terms below.`,
            T`**Setiap bilangan irasional dapat dihampiri sedekat yang kamu mau oleh pecahan, dan hampiran terbaiknya berasal dari pecahan berantainya: $x=a_0+\dfrac{1}{a_1+\dfrac{1}{a_2+\cdots}}$.** Untuk membangunnya, ambil bagian bulat $a_0$, balik sisanya, dan ulangi. Bilangan rasional menghasilkan pecahan berantai yang berhenti; bilangan irasional menghasilkan yang berlanjut tanpa akhir, yang merupakan cara lain mengatakan bahwa ia irasional.

Pecahan yang kamu dapat dengan berhenti lebih awal adalah **konvergen** $\frac{p_k}{q_k}$, diperoleh dengan $p_k=a_kp_{k-1}+p_{k-2}$ dan aturan yang sama untuk $q_k$. Untuk $\pi=[3;7,15,1,292,\ldots]$:

| $k$ | Konvergen | Desimal | Galat |
|---|---|---|---|
| 0 | $\frac31$ | $3$ | $1{,}4\times10^{-1}$ |
| 1 | $\frac{22}{7}$ | $3{,}142857$ | $1{,}3\times10^{-3}$ |
| 2 | $\frac{333}{106}$ | $3{,}141509$ | $8{,}3\times10^{-5}$ |
| 3 | $\frac{355}{113}$ | $3{,}14159292$ | $2{,}7\times10^{-7}$ |
| 4 | $\frac{103993}{33102}$ | $3{,}14159265301$ | $5{,}8\times10^{-10}$ |

$\frac{22}{7}$ adalah hampiran yang diajarkan di kelas. $\frac{355}{113}$ ditemukan oleh Zu Chongzhi pada abad ke-5 dan akurat sampai enam desimal dengan penyebut yang hanya tiga angka: hasil bagi parsial 292 yang menyusul itulah yang membuatnya begitu baik. Untuk $\sqrt2=[1;2,2,2,\ldots]$ konvergen $\frac32,\frac75,\frac{17}{12},\frac{41}{29}$ memenuhi $p^2-2q^2=\pm1$. Untuk $e=[2;1,2,1,1,4,1,1,6,\ldots]$ ada pola, dan untuk $\pi$ tidak ada pola yang diketahui siapa pun.

**Rasio emas adalah yang paling sulit dihampiri.** $\varphi=[1;1,1,1,\ldots]$, dan konvergennya $\frac11,\frac21,\frac32,\frac53,\frac85,\frac{13}{8},\ldots$ adalah perbandingan bilangan Fibonacci berurutan. Setiap hasil bagi parsial yang paling kecil mungkin, sehingga pecahannya mendekatinya lebih lambat daripada mendekati bilangan lain mana pun. Ia akar dari $x^2-x-1=0$, yang menurut bagian [pemfaktoran](article:algebraic-expressions#factor) tidak punya faktor bilangan bulat.

**Bilangan rasional tidak dapat dicapai.** Dirichlet membuktikan bahwa untuk setiap $x$ irasional ada tak berhingga banyak pecahan dengan $\left|x-\frac pq\right|<\frac1{q^2}$. Untuk $x$ rasional hanya ada berhingga banyak, sehingga galat sebuah konvergen bukan hanya kecil: ia tidak pernah nol. Pilih sebuah konstanta dan banyak suku di bawah.`,
          ),
        },
        { kind: 'widget', name: 'convergents' },
        {
          kind: 'activity',
          title: L('Try it: the golden ratio', 'Coba: rasio emas'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('The numerators 1, 2, 3, 5, 8, 13 each add the two before.', 'Pembilang 1, 2, 3, 5, 8, 13 masing-masing menjumlahkan dua sebelumnya.'),
              L('$8+13$.', '$8+13$.'),
            ],
            explain: L('The numerators are Fibonacci numbers: $8+13=21$, so the next convergent of $\\varphi$ is $\\frac{21}{13}\\approx1.6154$.', 'Pembilangnya adalah bilangan Fibonacci: $8+13=21$, sehingga konvergen berikutnya dari $\\varphi$ adalah $\\frac{21}{13}\\approx1{,}6154$.'),
            prompt: L('The convergents of $\\varphi$ run $\\frac11,\\frac21,\\frac32,\\frac53,\\frac85,\\frac{13}{8}$. Find the next numerator.', 'Konvergen $\\varphi$ berjalan $\\frac11,\\frac21,\\frac32,\\frac53,\\frac85,\\frac{13}{8}$. Tentukan pembilang berikutnya.'),
            given: String.raw`\frac{13}{8}\to\frac{a}{13}`,
            blanks: [{ label: 'a =', answer: 21 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- digits */
    {
      id: 'patterns-in-digits',
      heading: L('Can the digits of an irrational number follow a pattern?', 'Dapatkah angka bilangan irasional mengikuti suatu pola?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Yes: the digits of an irrational number can follow a pattern, as long as the pattern never becomes periodic.** What matters is not whether you can *see* a pattern but whether a block of digits repeats from some point on.

- $0.101001000100001\ldots$, with one more 0 each time, has an obvious pattern and is irrational: no block can repeat, because the runs of zeros keep getting longer.
- Champernowne's number $0.123456789101112131415\ldots$, which writes the integers one after another, is irrational, and in 1933 Champernowne proved that every finite string of digits appears in it equally often.
- Liouville's constant, with 1s at the factorial places, is irrational for the same reason as the first example.

The opposite also holds. A decimal with no *visible* pattern can be rational: $\frac1{97}=0.\overline{010309278350515463917525773195876288659793814432989690721649484536082474226804123711340206185567}$ repeats only after 96 digits. Looking at a few hundred digits proves nothing in either direction. Irrationality is established by a proof about the number, never by its digits, which are only ever finitely many.

**Normal numbers.** A real number is *normal* in base 10 if every string of $k$ digits appears with frequency $10^{-k}$. Almost every real number is normal, but for the famous constants nobody has proved it: $\pi$, $e$ and $\sqrt2$ look normal in the billions of digits computed, and that is all anyone can say. The digits can be produced on demand (the [digits of pi](article:real-numbers#irrational-numbers) have been computed to trillions of places), but there is no rule that predicts the millionth digit without computing the digits before it, at least none that is known.

For the repeating side of the story, see how [fractions turn into decimals](article:rational-numbers#decimals-percent), and why $\frac1{97}$ must repeat within 96 steps.`,
            T`**Ya: angka bilangan irasional dapat mengikuti suatu pola, asalkan pola itu tidak pernah menjadi periodik.** Yang penting bukan apakah kamu dapat *melihat* pola, melainkan apakah suatu blok angka berulang mulai dari suatu titik.

- $0{,}101001000100001\ldots$, dengan satu angka 0 lebih banyak setiap kali, punya pola yang jelas dan irasional: tidak ada blok yang dapat berulang, karena deretan nol terus memanjang.
- Bilangan Champernowne $0{,}123456789101112131415\ldots$, yang menuliskan bilangan bulat satu demi satu, irasional, dan pada 1933 Champernowne membuktikan bahwa setiap untai angka berhingga muncul di dalamnya sama seringnya.
- Konstanta Liouville, dengan angka 1 di tempat-tempat faktorial, irasional karena alasan yang sama dengan contoh pertama.

Kebalikannya juga berlaku. Desimal tanpa pola yang *terlihat* dapat rasional: $\frac1{97}=0{,}\overline{010309278350515463917525773195876288659793814432989690721649484536082474226804123711340206185567}$ baru berulang setelah 96 angka. Melihat beberapa ratus angka tidak membuktikan apa pun ke kedua arah. Keirasionalan dibuktikan dengan bukti tentang bilangannya, tidak pernah dengan angkanya, yang selalu hanya berhingga banyaknya.

**Bilangan normal.** Bilangan real *normal* di basis 10 bila setiap untai $k$ angka muncul dengan frekuensi $10^{-k}$. Hampir setiap bilangan real normal, tetapi untuk konstanta terkenal belum ada yang membuktikannya: $\pi$, $e$, dan $\sqrt2$ tampak normal pada miliaran angka yang sudah dihitung, dan hanya itu yang dapat dikatakan. Angkanya dapat dihasilkan sesuai permintaan ([angka-angka pi](article:real-numbers#irrational-numbers) sudah dihitung sampai triliunan tempat), tetapi tidak ada aturan yang meramalkan angka ke-sejuta tanpa menghitung angka sebelumnya, setidaknya tidak ada yang diketahui.

Untuk sisi yang berulang dari cerita ini, lihat bagaimana [pecahan menjadi desimal](article:rational-numbers#decimals-percent), dan mengapa $\frac1{97}$ harus berulang dalam 96 langkah.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: which are irrational?', 'Coba: mana yang irasional?'),
          step: {
            kind: 'multi',
            id: 'a7',
            prompt: L('Choose **all** the irrational numbers.', 'Pilih **semua** bilangan irasional.'),
            options: [
              L('$0.2020020002\\ldots$ (one more 0 each time)', '$0{,}2020020002\\ldots$ (satu angka 0 lebih banyak setiap kali)'),
              L('$0.\\overline{203}$', '$0{,}\\overline{203}$'),
              L('$0.5$', '$0{,}5$'),
              L('$0.123456789101112\\ldots$ (the integers in order)', '$0{,}123456789101112\\ldots$ (bilangan bulat berurutan)'),
            ],
            answer: [0, 3],
            explain: L(
              'In the first and the last the digits go on with a rule but never become periodic, so both are irrational. $0.\\overline{203}$ repeats a block, and $0.5=\\frac12$ terminates.',
              'Pada yang pertama dan terakhir angkanya berlanjut menurut aturan tetapi tidak pernah periodik, sehingga keduanya irasional. $0{,}\\overline{203}$ mengulang sebuah blok, dan $0{,}5=\\frac12$ berakhir.',
            ),
            hint: L('A decimal is rational if it terminates or a block repeats from some point on.', 'Desimal rasional bila berakhir atau sebuah blok berulang mulai dari suatu titik.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- density */
    {
      id: 'how-many-irrationals',
      heading: L('How many irrational numbers are there?', 'Berapa banyak bilangan irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**There are far more irrational numbers than rational ones: the rationals can be listed one after another, the irrationals cannot, so almost every real number is irrational.** Cantor proved in 1874 that the real numbers are uncountable, and since the rationals are countable, the rest, the irrationals, must be uncountable. If you could pick a real number at random, the probability that it is rational would be 0.

Yet the two kinds are tightly mixed. Between any two different real numbers there is both a rational and an irrational number, which is the *density* described in the article on [the number line](article:real-numbers#number-line-density).

- **An irrational between two rationals $a<b$:** the number $a+\dfrac{b-a}{\sqrt2}$ lies between them, because $\frac1{\sqrt2}\approx0.707$ is between 0 and 1, and it is irrational because it is a rational plus a non-zero rational times an irrational.
- **A rational between two irrationals $x<y$:** choose $n$ with $10^{-n}<y-x$ and cut $y$ off after $n$ decimals. The result is a terminating decimal, so it is rational, it is less than $y$ by less than $10^{-n}$, so it is greater than $x$, and it is not equal to $y$ because $y$ is irrational.

So there is no "next" irrational number after $\sqrt2$, and no "next" rational one either, even though the irrationals are by far the larger set. Pictures of the number line cannot show this: any dot you draw stands for a rational with a short decimal, and the irrational points are in between.`,
            T`**Bilangan irasional jauh lebih banyak daripada bilangan rasional: bilangan rasional dapat didaftar satu per satu, yang irasional tidak, sehingga hampir setiap bilangan real irasional.** Cantor membuktikan pada 1874 bahwa bilangan real tak terhitung, dan karena bilangan rasional terhitung, sisanya, bilangan irasional, pasti tak terhitung. Jika kamu dapat memilih bilangan real secara acak, peluang bahwa ia rasional adalah 0.

Namun kedua jenis itu bercampur rapat. Di antara dua bilangan real berbeda mana pun ada bilangan rasional sekaligus irasional, yaitu *kerapatan* yang dijelaskan pada artikel tentang [garis bilangan](article:real-numbers#number-line-density).

- **Bilangan irasional di antara dua bilangan rasional $a<b$:** bilangan $a+\dfrac{b-a}{\sqrt2}$ terletak di antara keduanya, karena $\frac1{\sqrt2}\approx0{,}707$ berada antara 0 dan 1, dan ia irasional karena ia rasional ditambah rasional bukan nol dikali irasional.
- **Bilangan rasional di antara dua bilangan irasional $x<y$:** pilih $n$ dengan $10^{-n}<y-x$ dan potong $y$ setelah $n$ desimal. Hasilnya desimal berakhir, sehingga rasional, kurang dari $y$ kurang dari $10^{-n}$ sehingga lebih besar dari $x$, dan tidak sama dengan $y$ karena $y$ irasional.

Jadi tidak ada bilangan irasional "berikutnya" setelah $\sqrt2$, dan tidak ada bilangan rasional "berikutnya" pula, walaupun bilangan irasional jauh lebih besar himpunannya. Gambar garis bilangan tidak dapat menunjukkan hal ini: setiap titik yang kamu gambar mewakili bilangan rasional dengan desimal pendek, dan titik-titik irasional berada di antaranya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: an irrational in between', 'Coba: irasional di antara'),
          step: {
            kind: 'quiz',
            id: 'a8',
            prompt: L('Which of these lies between 1 and 2 and is irrational?', 'Manakah di antara ini yang terletak antara 1 dan 2 dan irasional?'),
            options: [L('$\\frac32$', '$\\frac32$'), L('$\\sqrt2$', '$\\sqrt2$'), L('$1.41421356$', '$1{,}41421356$'), L('$\\sqrt4$', '$\\sqrt4$')],
            answer: 1,
            explain: L(
              '$\\sqrt2\\approx1.414$ is between 1 and 2 and irrational. $\\frac32$ is a fraction, $1.41421356$ terminates so it is rational, and $\\sqrt4=2$ is not between 1 and 2.',
              '$\\sqrt2\\approx1{,}414$ berada antara 1 dan 2 dan irasional. $\\frac32$ adalah pecahan, $1{,}41421356$ berakhir sehingga rasional, dan $\\sqrt4=2$ tidak berada antara 1 dan 2.',
            ),
            hint: L('A decimal that terminates is a fraction.', 'Desimal yang berakhir adalah pecahan.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'irrational-numbers-in-code',
      heading: L('How do you work with irrational numbers in Python and JavaScript?', 'Bagaimana mengolah bilangan irasional di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A computer cannot store an irrational number: a floating-point number (a *float*) is always a fraction whose denominator is a power of 2, so ´math.pi´ is only a rational approximation of $\pi$.** What you can do is keep the number exact as a formula, compute as many digits as you need, or find a good fraction. The [real numbers article](article:real-numbers#real-numbers-in-code) explains the rounding behind this.`,
            T`**Komputer tidak dapat menyimpan bilangan irasional: bilangan floating point (sebuah *float*) selalu berupa pecahan dengan penyebut pangkat 2, sehingga ´math.pi´ hanyalah hampiran rasional dari $\pi$.** Yang dapat kamu lakukan adalah menyimpan bilangan itu secara eksak sebagai rumus, menghitung angka sebanyak yang diperlukan, atau mencari pecahan yang baik. [Artikel bilangan real](article:real-numbers#real-numbers-in-code) menjelaskan pembulatan di baliknya.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> import math
>>> math.pi
3.141592653589793
>>> math.sqrt(2) ** 2                       # rounding, not a bug
2.0000000000000004
>>> math.pi.as_integer_ratio()              # a float is always a fraction
(884279719003555, 281474976710656)
>>> from fractions import Fraction
>>> Fraction(math.pi).limit_denominator(1000)   # a good fraction: 355/113
Fraction(355, 113)
>>> from decimal import Decimal, getcontext
>>> getcontext().prec = 50                  # 50 significant digits
>>> Decimal(2).sqrt()
Decimal('1.4142135623730950488016887242096980785696718753769')
>>> math.isqrt(2 * 10**40)                  # exact digits of the square root of 2
141421356237309504880
>>> import sympy                            # keep it exact as a formula
>>> sympy.sqrt(8)
2*sqrt(2)
>>> sympy.sqrt(2) ** 2
2`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `Math.PI                       // 3.141592653589793
Math.SQRT2                    // 1.4142135623730951
Math.sqrt(2) ** 2             // 2.0000000000000004
Math.sqrt(2) * Math.sqrt(8)   // 4.000000000000001, although the exact value is 4
Math.abs(Math.sqrt(2) ** 2 - 2) < 1e-12   // true: compare with a tolerance`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´==´ on results of roots | ´Math.sqrt(2) ** 2 == 2´ is false | compare with a tolerance, ´math.isclose´ in Python |
| Believing the digits shown | ´math.pi´ stops after about 16 digits | use ´decimal´ or a library for more |
| Testing irrationality numerically | every float is rational, so a program can only guess | prove it, or factor the integer under the root |
| ´22 / 7´ as ´π´ | 3.142857… differs from π in the third decimal | use ´math.pi´, or 355/113 if you need a fraction |
| ´sqrt´ of a perfect square | ´math.sqrt(16)´ gives ´4.0´, a float | use ´math.isqrt´ when you want a whole number |
| Mixing exact and float values | ´sympy.sqrt(2) * 1.0´ turns exact into approximate | keep symbols exact until the end |

Use ´Decimal´ or ´sympy´ for exactness, floats for speed, and never use a float to *decide* whether a number is irrational.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´==´ pada hasil akar | ´Math.sqrt(2) ** 2 == 2´ salah | bandingkan dengan toleransi, ´math.isclose´ di Python |
| Memercayai angka yang ditampilkan | ´math.pi´ berhenti setelah sekitar 16 angka | pakai ´decimal´ atau pustaka untuk lebih banyak |
| Menguji keirasionalan secara numerik | setiap float rasional, jadi program hanya dapat menebak | buktikan, atau faktorkan bilangan bulat di bawah akar |
| ´22 / 7´ sebagai ´π´ | 3,142857… berbeda dari π pada desimal ketiga | pakai ´math.pi´, atau 355/113 bila perlu pecahan |
| ´sqrt´ dari kuadrat sempurna | ´math.sqrt(16)´ memberi ´4.0´, sebuah float | pakai ´math.isqrt´ bila ingin bilangan bulat |
| Mencampur nilai eksak dan float | ´sympy.sqrt(2) * 1.0´ mengubah eksak menjadi hampiran | jaga simbol tetap eksak sampai akhir |

Pakai ´Decimal´ atau ´sympy´ untuk ketepatan, float untuk kecepatan, dan jangan pernah memakai float untuk *memutuskan* apakah suatu bilangan irasional.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes about irrational numbers?', 'Apa kesalahan umum tentang bilangan irasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes about irrational numbers are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| $\pi=\frac{22}{7}$ | $\frac{22}{7}=3.142857\ldots$ is an approximation; $\pi=3.14159\ldots$ is not a fraction at all. |
| $\pi=3.14$ | $3.14$ is $\pi$ rounded to two decimals, a rational number. |
| Every square root is irrational | $\sqrt{16}=4$ and $\sqrt{\frac14}=\frac12$ are rational. |
| The sum of two irrationals is irrational | $\sqrt2+(-\sqrt2)=0$. |
| The product of two irrationals is irrational | $\sqrt2\cdot\sqrt2=2$. |
| A decimal with no visible pattern is irrational | $\frac1{97}$ repeats only after 96 digits. |
| A decimal with a visible pattern is rational | $0.101001000\ldots$ has a pattern and is irrational. |
| $0.\overline{9}$ is irrational because it never ends | $0.\overline{9}=1$ exactly. |
| The calculator shows $\pi$, so $\pi$ terminates | A calculator shows the first 10 to 16 digits of a number whose digits never end. |`,
            T`**Kesalahan paling umum tentang bilangan irasional adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| $\pi=\frac{22}{7}$ | $\frac{22}{7}=3{,}142857\ldots$ adalah hampiran; $\pi=3{,}14159\ldots$ sama sekali bukan pecahan. |
| $\pi=3{,}14$ | $3{,}14$ adalah $\pi$ yang dibulatkan ke dua desimal, sebuah bilangan rasional. |
| Setiap akar kuadrat irasional | $\sqrt{16}=4$ dan $\sqrt{\frac14}=\frac12$ rasional. |
| Jumlah dua bilangan irasional irasional | $\sqrt2+(-\sqrt2)=0$. |
| Hasil kali dua bilangan irasional irasional | $\sqrt2\cdot\sqrt2=2$. |
| Desimal tanpa pola yang terlihat irasional | $\frac1{97}$ baru berulang setelah 96 angka. |
| Desimal dengan pola yang terlihat rasional | $0{,}101001000\ldots$ punya pola dan irasional. |
| $0{,}\overline{9}$ irasional karena tidak pernah berakhir | $0{,}\overline{9}=1$ tepat. |
| Kalkulator menampilkan $\pi$, jadi $\pi$ berakhir | Kalkulator menampilkan 10 sampai 16 angka pertama dari bilangan yang angkanya tidak pernah berakhir. |`,
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
              L('$\\sqrt{16}$ is irrational.', '$\\sqrt{16}$ irasional.'),
              L('$\\sqrt2+1$ is irrational.', '$\\sqrt2+1$ irasional.'),
              L('The product of two irrational numbers is always irrational.', 'Hasil kali dua bilangan irasional selalu irasional.'),
              L('$0.1010010001\\ldots$ (one more 0 each time) is irrational.', '$0{,}1010010001\\ldots$ (satu angka 0 lebih banyak setiap kali) irasional.'),
              L('$\\frac{22}{7}$ is exactly equal to $\\pi$.', '$\\frac{22}{7}$ tepat sama dengan $\\pi$.'),
            ],
            answer: [false, true, false, true, false],
            explain: L(
              '$\\sqrt{16}=4$. A rational plus an irrational is irrational. $\\sqrt2\\cdot\\sqrt2=2$. The runs of zeros keep growing, so no block repeats. $\\frac{22}{7}=3.142857\\ldots$ differs from $\\pi=3.141592\\ldots$.',
              '$\\sqrt{16}=4$. Rasional ditambah irasional adalah irasional. $\\sqrt2\\cdot\\sqrt2=2$. Deretan nol terus memanjang, sehingga tidak ada blok yang berulang. $\\frac{22}{7}=3{,}142857\\ldots$ berbeda dari $\\pi=3{,}141592\\ldots$.',
            ),
            hint: L('Look for a counterexample, and check whether a decimal can repeat.', 'Cari contoh penyangkal, dan periksa apakah desimalnya dapat berulang.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the irrational numbers.', 'Pilih **semua** bilangan irasional.'),
            options: [L('$\\sqrt7$', '$\\sqrt7$'), L('$\\sqrt{49}$', '$\\sqrt{49}$'), L('$\\sqrt[3]{9}$', '$\\sqrt[3]{9}$'), L('$0.\\overline{12}$', '$0{,}\\overline{12}$'), L('$\\sqrt2\\cdot\\sqrt8$', '$\\sqrt2\\cdot\\sqrt8$')],
            answer: [0, 2],
            explain: L(
              '$7$ is not a perfect square and $9=3^2$ is not a perfect cube, so $\\sqrt7$ and $\\sqrt[3]{9}$ are irrational. $\\sqrt{49}=7$, $0.\\overline{12}=\\frac{4}{33}$ and $\\sqrt2\\cdot\\sqrt8=\\sqrt{16}=4$ are rational.',
              '$7$ bukan kuadrat sempurna dan $9=3^2$ bukan kubik sempurna, sehingga $\\sqrt7$ dan $\\sqrt[3]{9}$ irasional. $\\sqrt{49}=7$, $0{,}\\overline{12}=\\frac{4}{33}$, dan $\\sqrt2\\cdot\\sqrt8=\\sqrt{16}=4$ rasional.',
            ),
            hint: L('Factorize the numbers under the roots and simplify the product.', 'Faktorkan bilangan di bawah akar dan sederhanakan hasil kalinya.'),
          },
        },
        {
          kind: 'activity',
          title: L('A conjugate product', 'Hasil kali sekawan'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('Use $(a+b)(a-b)=a^2-b^2$ with $a=3$ and $b=\\sqrt5$.', 'Pakai $(a+b)(a-b)=a^2-b^2$ dengan $a=3$ dan $b=\\sqrt5$.'),
              L('$9-5$.', '$9-5$.'),
            ],
            explain: L('$(3+\\sqrt5)(3-\\sqrt5)=9-5=4$.', '$(3+\\sqrt5)(3-\\sqrt5)=9-5=4$.'),
            prompt: L('Evaluate the product.', 'Hitung hasil kalinya.'),
            given: String.raw`(3+\sqrt{5})(3-\sqrt{5})=v`,
            blanks: [{ label: 'v =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('Simplify a cube root', 'Sederhanakan akar pangkat tiga'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('$54=2\\cdot27=2\\cdot3^3$.', '$54=2\\cdot27=2\\cdot3^3$.'),
              L('Take the complete group $3^3$ out of the cube root.', 'Keluarkan kelompok lengkap $3^3$ dari akar pangkat tiga.'),
            ],
            explain: L('$\\sqrt[3]{54}=\\sqrt[3]{27\\cdot2}=3\\sqrt[3]{2}$, so $a=3$.', '$\\sqrt[3]{54}=\\sqrt[3]{27\\cdot2}=3\\sqrt[3]{2}$, sehingga $a=3$.'),
            prompt: L('Find $a$.', 'Tentukan $a$.'),
            given: String.raw`\sqrt[3]{54}=a\sqrt[3]{2}`,
            blanks: [{ label: 'a =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('The best fraction', 'Pecahan terbaik'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('Which fraction is closest to $\\pi$?', 'Pecahan mana yang paling dekat dengan $\\pi$?'),
            options: [L('$\\frac{22}{7}$', '$\\frac{22}{7}$'), L('$\\frac{333}{106}$', '$\\frac{333}{106}$'), L('$\\frac{355}{113}$', '$\\frac{355}{113}$'), L('$\\frac31$', '$\\frac31$')],
            answer: 2,
            explain: L(
              'The errors are about $1.3\\times10^{-3}$, $8.3\\times10^{-5}$, $2.7\\times10^{-7}$ and $1.4\\times10^{-1}$, so $\\frac{355}{113}$ is closest, even though its denominator is only slightly bigger.',
              'Galatnya sekitar $1{,}3\\times10^{-3}$, $8{,}3\\times10^{-5}$, $2{,}7\\times10^{-7}$, dan $1{,}4\\times10^{-1}$, sehingga $\\frac{355}{113}$ paling dekat, padahal penyebutnya hanya sedikit lebih besar.',
            ),
            hint: L('Divide each fraction and compare with $3.14159265$.', 'Bagi tiap pecahan dan bandingkan dengan $3{,}14159265$.'),
          },
        },
        {
          kind: 'activity',
          title: L('About π', 'Tentang π'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('Which statement about $\\pi$ is true?', 'Pernyataan mana tentang $\\pi$ yang benar?'),
            options: [
              L('$\\pi=\\frac{22}{7}$.', '$\\pi=\\frac{22}{7}$.'),
              L('The digits of $\\pi$ eventually repeat periodically.', 'Angka-angka $\\pi$ akhirnya berulang secara periodik.'),
              L('$\\pi$ is transcendental.', '$\\pi$ transenden.'),
              L('$\\pi$ is a root of $x^2-10=0$.', '$\\pi$ adalah akar dari $x^2-10=0$.'),
            ],
            answer: 2,
            explain: L(
              'Lindemann proved in 1882 that $\\pi$ is transcendental, so it is a root of no non-zero integer polynomial. $\\frac{22}{7}$ is only an approximation, the digits never become periodic, and $x^2-10=0$ gives $\\sqrt{10}\\approx3.162$.',
              'Lindemann membuktikan pada 1882 bahwa $\\pi$ transenden, sehingga ia bukan akar polinomial bulat tak nol mana pun. $\\frac{22}{7}$ hanya hampiran, angkanya tidak pernah menjadi periodik, dan $x^2-10=0$ memberi $\\sqrt{10}\\approx3{,}162$.',
            ),
            hint: L('Recall the 1882 theorem that settled squaring the circle.', 'Ingat teorema 1882 yang menyelesaikan masalah kuadratur lingkaran.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: irrational numbers at a glance', 'Ringkasan: bilangan irasional sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** a real number that is not a fraction of integers; its decimal expansion is infinite and never periodic. Rational and irrational never overlap.
- **Roots:** the $k$-th root of an integer is an integer or irrational; it is an integer exactly when every prime exponent is a multiple of $k$.
- **$\sqrt2$:** $a^2=2b^2$ gives an even and an odd count of factors of 2.
- **Arithmetic:** rational plus irrational is irrational; non-zero rational times irrational is irrational; two irrationals can give a rational, as in $(1+\sqrt2)(1-\sqrt2)=-1$.
- **$\pi$ and $e$:** irrational (Lambert, Euler) and transcendental (Lindemann, Hermite), so the circle cannot be squared.
- **Approximation:** a continued fraction that never stops; $\frac{22}{7}$ and $\frac{355}{113}$ are convergents of $\pi$; $\varphi$ is the hardest to approximate.
- **Digits:** a pattern is fine if it never becomes periodic; a digit table can never prove irrationality.
- **Size:** almost every real number is irrational, yet each interval contains both kinds.
- **Code:** a float is always a fraction; keep roots exact with ´sympy´ or compute digits with ´Decimal´.`,
            T`- **Definisi:** bilangan real yang bukan pecahan bilangan bulat; ekspansi desimalnya tak berhingga dan tidak pernah periodik. Rasional dan irasional tidak pernah tumpang tindih.
- **Akar:** akar pangkat $k$ dari bilangan bulat adalah bilangan bulat atau irasional; ia bilangan bulat tepat bila setiap eksponen prima kelipatan $k$.
- **$\sqrt2$:** $a^2=2b^2$ memberi banyak faktor 2 yang genap dan ganjil sekaligus.
- **Aritmetika:** rasional ditambah irasional adalah irasional; rasional bukan nol dikali irasional adalah irasional; dua bilangan irasional dapat menghasilkan rasional, seperti $(1+\sqrt2)(1-\sqrt2)=-1$.
- **$\pi$ dan $e$:** irasional (Lambert, Euler) dan transenden (Lindemann, Hermite), sehingga lingkaran tidak dapat dikuadratkan.
- **Hampiran:** pecahan berantai yang tidak pernah berhenti; $\frac{22}{7}$ dan $\frac{355}{113}$ adalah konvergen $\pi$; $\varphi$ paling sulit dihampiri.
- **Angka:** pola tidak masalah asal tidak pernah periodik; tabel angka tidak pernah dapat membuktikan keirasionalan.
- **Ukuran:** hampir setiap bilangan real irasional, namun setiap selang memuat kedua jenis.
- **Kode:** float selalu berupa pecahan; jaga akar tetap eksak dengan ´sympy´ atau hitung angkanya dengan ´Decimal´.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Irrational number', 'Bilangan irasional'), definition: L('A real number that cannot be written as a fraction of two integers; its decimal expansion is infinite and never periodic.', 'Bilangan real yang tidak dapat ditulis sebagai pecahan dua bilangan bulat; ekspansi desimalnya tak berhingga dan tidak pernah periodik.') },
    { term: L('Rational number', 'Bilangan rasional'), definition: L('A number that can be written as a fraction of two integers with a non-zero denominator; its decimal expansion terminates or eventually repeats periodically.', 'Bilangan yang dapat ditulis sebagai pecahan dua bilangan bulat dengan penyebut bukan nol; ekspansi desimalnya berakhir atau akhirnya berulang secara periodik.') },
    { term: L('Decimal expansion', 'Ekspansi desimal'), definition: L('The full list of digits of a number after the decimal point, however long.', 'Daftar lengkap angka sebuah bilangan di belakang koma desimal, sepanjang apa pun.') },
    { term: L('Perfect square', 'Kuadrat sempurna'), definition: L('A whole number that is the square of a whole number, such as 16 or 49; the square root of any other positive integer is irrational.', 'Bilangan bulat yang merupakan kuadrat dari bilangan bulat, seperti 16 atau 49; akar kuadrat bilangan bulat positif lain irasional.') },
    { term: L('Proof by contradiction', 'Bukti dengan kontradiksi'), definition: L('A proof that assumes the opposite of the claim and derives something impossible, as in the proof that the square root of 2 is irrational.', 'Bukti yang mengandaikan kebalikan dari klaim lalu menurunkan sesuatu yang mustahil, seperti pada bukti bahwa akar kuadrat 2 irasional.') },
    { term: L('Incommensurable', 'Tak sepadan'), definition: L('Two lengths with no common unit that fits a whole number of times into both, such as the side and the diagonal of a square.', 'Dua panjang tanpa satuan bersama yang muat bilangan bulat kali pada keduanya, seperti sisi dan diagonal sebuah persegi.') },
    { term: L('Conjugate', 'Bentuk sekawan'), definition: L('For a plus b times the square root of m, the number a minus b times the square root of m; their product is rational.', 'Untuk a ditambah b kali akar m, bilangan a dikurangi b kali akar m; hasil kali keduanya rasional.') },
    { term: L('Algebraic number', 'Bilangan aljabar'), definition: L('A number that is a root of a non-zero polynomial with integer coefficients, such as the square root of 2, which is a root of x squared minus 2.', 'Bilangan yang merupakan akar polinomial tak nol dengan koefisien bulat, seperti akar 2, yang merupakan akar dari x kuadrat dikurangi 2.') },
    { term: L('Transcendental number', 'Bilangan transenden'), definition: L('A real number that is not algebraic, such as pi and e; every transcendental number is irrational.', 'Bilangan real yang bukan aljabar, seperti pi dan e; setiap bilangan transenden irasional.') },
    { term: L('Continued fraction', 'Pecahan berantai'), definition: L('An expression of a number as an integer plus one over an integer plus one over another integer, and so on; it stops exactly when the number is rational.', 'Pernyataan sebuah bilangan sebagai bilangan bulat ditambah satu per bilangan bulat ditambah satu per bilangan bulat lain, dan seterusnya; ia berhenti tepat bila bilangannya rasional.') },
    { term: L('Convergent', 'Konvergen'), definition: L('A fraction obtained by stopping a continued fraction early, such as 22 over 7 and 355 over 113 for pi; it is the best approximation for its denominator size.', 'Pecahan yang diperoleh dengan menghentikan pecahan berantai lebih awal, seperti 22 per 7 dan 355 per 113 untuk pi; ia hampiran terbaik untuk ukuran penyebutnya.') },
    { term: L('Golden ratio', 'Rasio emas'), definition: L('The number 1 plus the square root of 5, all over 2, about 1.618, which is a root of x squared minus x minus 1 and the hardest number to approximate by fractions.', 'Bilangan 1 ditambah akar 5, seluruhnya dibagi 2, sekitar 1,618, yang merupakan akar dari x kuadrat dikurangi x dikurangi 1 dan bilangan yang paling sulit dihampiri pecahan.') },
    { term: L('Normal number', 'Bilangan normal'), definition: L('A number in whose decimal expansion every string of k digits appears with frequency one in 10 to the power k.', 'Bilangan yang dalam ekspansi desimalnya setiap untai k angka muncul dengan frekuensi satu per 10 pangkat k.') },
    { term: L('Uncountable set', 'Himpunan tak terhitung'), definition: L('An infinite set whose members cannot be listed one after another, such as the real numbers and the irrational numbers.', 'Himpunan tak berhingga yang anggotanya tidak dapat didaftar satu per satu, seperti bilangan real dan bilangan irasional.') },
  ],

  howTo: [
    {
      name: L('How to decide whether a square root is irrational', 'Cara menentukan apakah suatu akar kuadrat irasional'),
      description: L('Factorize the number under the root and look at the exponents.', 'Faktorkan bilangan di bawah akar dan lihat eksponennya.'),
      steps: [
        { name: L('Factorize', 'Faktorkan'), text: L('Write the whole number under the root as a product of primes, for example 72 is 2 cubed times 3 squared.', 'Tulis bilangan bulat di bawah akar sebagai hasil kali bilangan prima, misalnya 72 adalah 2 pangkat tiga kali 3 kuadrat.') },
        { name: L('Check the exponents', 'Periksa eksponennya'), text: L('For a square root, look at whether every exponent is even; for a k-th root, whether every exponent is a multiple of k.', 'Untuk akar kuadrat, lihat apakah setiap eksponen genap; untuk akar pangkat k, apakah setiap eksponen kelipatan k.') },
        { name: L('Decide', 'Putuskan'), text: L('If all of them are, the root is a whole number and so rational; if any is not, the root is irrational.', 'Jika semuanya demikian, akarnya bilangan bulat dan rasional; jika ada yang tidak, akarnya irasional.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('Take every complete group out of the root: the square root of 72 is 6 times the square root of 2.', 'Keluarkan setiap kelompok lengkap dari akar: akar kuadrat 72 adalah 6 kali akar 2.') },
      ],
    },
    {
      name: L('How to prove that the square root of 2 is irrational', 'Cara membuktikan bahwa akar 2 irasional'),
      description: L('Assume it is a fraction and count the factors of 2.', 'Andaikan ia pecahan lalu hitung faktor 2.'),
      steps: [
        { name: L('Assume the opposite', 'Andaikan kebalikannya'), text: L('Suppose the square root of 2 equals a over b with a and b positive integers.', 'Andaikan akar 2 sama dengan a per b dengan a dan b bilangan bulat positif.') },
        { name: L('Square both sides', 'Kuadratkan kedua ruas'), text: L('Squaring gives a squared equals 2 times b squared.', 'Mengkuadratkan memberi a kuadrat sama dengan 2 kali b kuadrat.') },
        { name: L('Count the factors of 2', 'Hitung faktor 2'), text: L('On the left the prime 2 appears an even number of times, and on the right an odd number of times.', 'Di kiri bilangan prima 2 muncul genap kali, dan di kanan ganjil kali.') },
        { name: L('State the contradiction', 'Nyatakan kontradiksinya'), text: L('The two sides are the same integer, so they cannot have both counts: the assumption is false and the square root of 2 is irrational.', 'Kedua ruas adalah bilangan bulat yang sama, sehingga tidak mungkin punya kedua banyak itu: pengandaiannya salah dan akar 2 irasional.') },
      ],
    },
    {
      name: L('How to approximate a number by fractions with a continued fraction', 'Cara menghampiri bilangan dengan pecahan memakai pecahan berantai'),
      description: L('Repeat taking the integer part and inverting the remainder, then build the convergents.', 'Ulangi mengambil bagian bulat dan membalik sisanya, lalu bangun konvergennya.'),
      steps: [
        { name: L('Take the integer part', 'Ambil bagian bulat'), text: L('Write the number as its integer part a0 plus a remainder between 0 and 1, for example 3.14159 is 3 plus 0.14159.', 'Tulis bilangan sebagai bagian bulat a0 ditambah sisa antara 0 dan 1, misalnya 3,14159 adalah 3 ditambah 0,14159.') },
        { name: L('Invert the remainder', 'Balik sisanya'), text: L('Replace the remainder by one over itself, which is greater than 1, and take its integer part a1: 1 over 0.14159 is about 7.06, so a1 is 7.', 'Ganti sisa dengan satu per dirinya, yang lebih besar dari 1, dan ambil bagian bulatnya a1: 1 per 0,14159 sekitar 7,06, sehingga a1 adalah 7.') },
        { name: L('Repeat', 'Ulangi'), text: L('Keep inverting the remainder and taking integer parts to get a2, a3 and so on.', 'Teruslah membalik sisa dan mengambil bagian bulat untuk mendapat a2, a3, dan seterusnya.') },
        { name: L('Build the convergents', 'Bangun konvergennya'), text: L('Each convergent is p over q with p equal to ak times the previous p plus the one before, and the same rule for q: 3 over 1, then 22 over 7, then 333 over 106.', 'Setiap konvergen adalah p per q dengan p sama dengan ak kali p sebelumnya ditambah yang sebelum itu, dan aturan yang sama untuk q: 3 per 1, lalu 22 per 7, lalu 333 per 106.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an irrational number?', 'Apa itu bilangan irasional?'),
      a: L(
        'An irrational number is a real number that cannot be written as a fraction of two integers. Its decimal expansion is infinite and never periodic, as in the square root of 2, pi and e. Every real number is either rational or irrational.',
        'Bilangan irasional adalah bilangan real yang tidak dapat ditulis sebagai pecahan dua bilangan bulat. Ekspansi desimalnya tak berhingga dan tidak pernah periodik, seperti pada akar 2, pi, dan e. Setiap bilangan real rasional atau irasional.',
      ),
    },
    {
      q: L('What are some examples of irrational numbers?', 'Apa saja contoh bilangan irasional?'),
      a: L(
        'The square root of 2, the square root of 3, the cube root of 2, pi, e and the golden ratio are irrational. Square roots of whole numbers that are not perfect squares are always irrational, while the square root of 16 is 4, which is rational.',
        'Akar 2, akar 3, akar pangkat tiga 2, pi, e, dan rasio emas adalah irasional. Akar kuadrat bilangan bulat yang bukan kuadrat sempurna selalu irasional, sedangkan akar kuadrat 16 adalah 4, yang rasional.',
      ),
    },
    {
      q: L('Why is the square root of 2 irrational?', 'Mengapa akar 2 irasional?'),
      a: L(
        'If the square root of 2 equaled a over b, then a squared would equal 2 times b squared. The prime 2 would then divide the left side an even number of times and the right side an odd number of times, which is impossible for the same integer.',
        'Jika akar 2 sama dengan a per b, maka a kuadrat sama dengan 2 kali b kuadrat. Bilangan prima 2 kemudian membagi ruas kiri genap kali dan ruas kanan ganjil kali, yang mustahil untuk bilangan bulat yang sama.',
      ),
    },
    {
      q: L('Is pi irrational?', 'Apakah pi irasional?'),
      a: L(
        'Yes. Lambert proved in 1761 that pi is irrational, and Lindemann proved in 1882 that it is even transcendental. So pi is not equal to 22 over 7 or to 3.14, which are only approximations, and its digits never become periodic.',
        'Ya. Lambert membuktikan pada 1761 bahwa pi irasional, dan Lindemann membuktikan pada 1882 bahwa ia bahkan transenden. Jadi pi tidak sama dengan 22 per 7 atau 3,14, yang hanyalah hampiran, dan angkanya tidak pernah menjadi periodik.',
      ),
    },
    {
      q: L('Is the square root of 16 irrational?', 'Apakah akar 16 irasional?'),
      a: L(
        'No. The square root of 16 is exactly 4, a whole number, so it is rational. A square root of a whole number is irrational only when the number is not a perfect square. Perfect squares such as 1, 4, 9, 16 and 25 have whole number roots.',
        'Bukan. Akar 16 tepat 4, sebuah bilangan bulat, sehingga rasional. Akar kuadrat bilangan bulat irasional hanya bila bilangan itu bukan kuadrat sempurna. Kuadrat sempurna seperti 1, 4, 9, 16, dan 25 punya akar bilangan bulat.',
      ),
    },
    {
      q: L('Can the sum of two irrational numbers be rational?', 'Dapatkah jumlah dua bilangan irasional menjadi rasional?'),
      a: L(
        'Yes. The square root of 2 plus minus the square root of 2 is 0, and 1 plus the square root of 2 added to 1 minus the square root of 2 is 2. Both sums are rational. The product of two irrational numbers can be rational too.',
        'Ya. Akar 2 ditambah minus akar 2 adalah 0, dan 1 ditambah akar 2 dijumlahkan dengan 1 dikurangi akar 2 adalah 2. Kedua jumlah itu rasional. Hasil kali dua bilangan irasional juga dapat rasional.',
      ),
    },
    {
      q: L('Is a rational number plus an irrational number always irrational?', 'Apakah rasional ditambah irasional selalu irasional?'),
      a: L(
        'Yes. If a rational number r plus an irrational number x gave a rational number s, then x would equal s minus r, a difference of rationals, which is rational. That contradicts x being irrational, so the sum must be irrational.',
        'Ya. Jika bilangan rasional r ditambah bilangan irasional x menghasilkan bilangan rasional s, maka x sama dengan s dikurangi r, selisih bilangan rasional, yang rasional. Itu bertentangan dengan x irasional, jadi jumlahnya pasti irasional.',
      ),
    },
    {
      q: L('How do you tell whether a root is irrational?', 'Bagaimana mengetahui apakah suatu akar irasional?'),
      a: L(
        'Factorize the whole number under the root into primes. The k-th root is a whole number exactly when every exponent is a multiple of k, and otherwise it is irrational. For 72, which is 2 cubed times 3 squared, the exponent 3 is odd, so the square root is irrational.',
        'Faktorkan bilangan bulat di bawah akar menjadi bilangan prima. Akar pangkat k adalah bilangan bulat tepat bila setiap eksponen kelipatan k, dan jika tidak ia irasional. Untuk 72, yaitu 2 pangkat tiga kali 3 kuadrat, eksponen 3 ganjil, sehingga akar kuadratnya irasional.',
      ),
    },
    {
      q: L('What is the difference between algebraic and transcendental numbers?', 'Apa beda bilangan aljabar dan transenden?'),
      a: L(
        'An algebraic number is a root of a non-zero polynomial with integer coefficients, such as the square root of 2, a root of x squared minus 2. A transcendental number is not a root of any such polynomial. Pi and e are transcendental, and so are almost all real numbers.',
        'Bilangan aljabar adalah akar polinomial tak nol dengan koefisien bulat, seperti akar 2, akar dari x kuadrat dikurangi 2. Bilangan transenden bukan akar polinomial seperti itu. Pi dan e transenden, begitu pula hampir semua bilangan real.',
      ),
    },
    {
      q: L('Why can the circle not be squared?', 'Mengapa lingkaran tidak dapat dikuadratkan?'),
      a: L(
        'Squaring the circle needs a length of square root of pi using only compass and straightedge. Constructible lengths are always algebraic, but Lindemann proved in 1882 that pi is transcendental. So the construction is impossible, however cleverly you try.',
        'Mengkuadratkan lingkaran memerlukan panjang akar pi dengan hanya jangka dan penggaris. Panjang yang dapat dikonstruksi selalu aljabar, tetapi Lindemann membuktikan pada 1882 bahwa pi transenden. Jadi konstruksi itu mustahil, secerdik apa pun mencobanya.',
      ),
    },
    {
      q: L('Are all non-terminating decimals irrational?', 'Apakah semua desimal tak berakhir irasional?'),
      a: L(
        'No. A decimal that never terminates but eventually repeats periodically is rational, such as 0.333 and so on, which is one third. Only a decimal expansion that is infinite and never periodic is irrational. Even 0.999 and so on repeating is exactly 1.',
        'Tidak. Desimal yang tidak pernah berakhir tetapi akhirnya berulang secara periodik rasional, seperti 0,333 dan seterusnya, yaitu sepertiga. Hanya ekspansi desimal yang tak berhingga dan tidak pernah periodik yang irasional. Bahkan 0,999 dan seterusnya berulang tepat 1.',
      ),
    },
    {
      q: L('How many irrational numbers are there?', 'Berapa banyak bilangan irasional?'),
      a: L(
        'Infinitely many, and far more than rational numbers. The rational numbers can be listed one after another, but Cantor proved in 1874 that the real numbers cannot, so the irrational numbers are uncountable and almost every real number is irrational.',
        'Tak berhingga banyaknya, dan jauh lebih banyak daripada bilangan rasional. Bilangan rasional dapat didaftar satu per satu, tetapi Cantor membuktikan pada 1874 bahwa bilangan real tidak dapat, sehingga bilangan irasional tak terhitung dan hampir setiap bilangan real irasional.',
      ),
    },
    {
      q: L('How are irrational numbers stored in a computer?', 'Bagaimana bilangan irasional disimpan di komputer?'),
      a: L(
        'They are not stored exactly. A floating-point number is always a fraction with a power of 2 as denominator, so a float such as math.pi is only a nearby rational number. For exact work use a symbolic library such as sympy, or compute as many digits as needed with decimal.',
        'Bilangan irasional tidak disimpan secara eksak. Bilangan floating point selalu berupa pecahan berpenyebut pangkat 2, sehingga float seperti math.pi hanyalah bilangan rasional di dekatnya. Untuk kerja eksak pakai pustaka simbolik seperti sympy, atau hitung angka sebanyak perlu dengan decimal.',
      ),
    },
    {
      q: L('What is the golden ratio?', 'Apa itu rasio emas?'),
      a: L(
        'The golden ratio is 1 plus the square root of 5, all over 2, about 1.618. It is irrational, it solves x squared minus x minus 1 equals 0, and the ratios of consecutive Fibonacci numbers approach it, more slowly than they approach any other number.',
        'Rasio emas adalah 1 ditambah akar 5, seluruhnya dibagi 2, sekitar 1,618. Ia irasional, ia menyelesaikan x kuadrat dikurangi x dikurangi 1 sama dengan 0, dan perbandingan bilangan Fibonacci berurutan mendekatinya, lebih lambat daripada mendekati bilangan lain mana pun.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Elements, Book X (incommensurable magnitudes)', author: 'Euclid', source: 'c. 300 BCE' },
    { title: 'Irrational Numbers (Carus Mathematical Monographs 11)', author: 'Ivan Niven', year: 1956, source: 'Mathematical Association of America' },
    { title: 'An Introduction to the Theory of Numbers, chapter 4 (irrational numbers)', author: 'G. H. Hardy and E. M. Wright', year: 1938, source: 'Oxford University Press' },
    { title: 'Mémoire sur quelques propriétés remarquables des quantités transcendantes circulaires et logarithmiques', author: 'Johann Heinrich Lambert', year: 1768, source: 'Mémoires de l’Académie royale des sciences de Berlin' },
    { title: 'Über die Zahl π', author: 'Ferdinand Lindemann', year: 1882, source: 'Mathematische Annalen 20, 213–225' },
    { title: 'Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen', author: 'Georg Cantor', year: 1874, source: 'Journal für die reine und angewandte Mathematik 77, 258–262' },
    { title: 'The Python Standard Library: math, mathematical functions', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/math.html' },
  ],

  related: ['real-numbers', 'rational-numbers', 'exponents-and-radicals', 'integers'],
}
