import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './exponents-and-radicals.meta'

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
    T`**An exponent says how many times to multiply a number by itself: in $2^5$ the base 2 is used as a factor five times, so $2^5=32$. A radical undoes it: the $n$-th root of a number is the value that gives that number when raised to the power $n$, so $\sqrt[3]{27}=3$ because $3^3=27$.** The two are one idea, since $a^{1/n}=\sqrt[n]{a}$, and the same five laws handle both.`,
    T`**Eksponen menyatakan berapa kali sebuah bilangan dikalikan dengan dirinya sendiri: pada $2^5$ basis 2 dipakai sebagai faktor sebanyak lima kali, sehingga $2^5=32$. Akar membalikkannya: akar pangkat $n$ dari sebuah bilangan adalah nilai yang menghasilkan bilangan itu bila dipangkatkan $n$, sehingga $\sqrt[3]{27}=3$ karena $3^3=27$.** Keduanya satu gagasan, sebab $a^{1/n}=\sqrt[n]{a}$, dan lima hukum yang sama berlaku untuk keduanya.`,
  ),

  keyPoints: [
    L(
      T`$a^n$ means $n$ copies of $a$ multiplied together; $a$ is the base and $n$ the exponent.`,
      T`$a^n$ berarti $n$ salinan $a$ yang dikalikan; $a$ adalah basis dan $n$ adalah eksponen.`,
    ),
    L(
      T`Five laws cover everything: add exponents to multiply powers of one base, subtract to divide, multiply for a power of a power, and a power spreads over a product or a quotient.`,
      T`Lima hukum mencakup semuanya: jumlahkan eksponen untuk mengalikan pangkat dengan basis sama, kurangkan untuk membagi, kalikan untuk pangkat dari pangkat, dan pangkat menyebar ke perkalian atau pembagian.`,
    ),
    L(
      T`$a^0=1$, $a^{-n}=\dfrac{1}{a^n}$ and $a^{1/n}=\sqrt[n]{a}$ are not extra rules to memorize: they are the only values that keep the laws true.`,
      T`$a^0=1$, $a^{-n}=\dfrac{1}{a^n}$, dan $a^{1/n}=\sqrt[n]{a}$ bukan aturan tambahan yang harus dihafal: itulah satu-satunya nilai yang menjaga hukum-hukumnya tetap benar.`,
    ),
    L(
      T`$\sqrt{a}$ is the non-negative root, so $\sqrt{9}=3$ and not ±3, and $\sqrt{x^2}=|x|$.`,
      T`$\sqrt{a}$ adalah akar yang tidak negatif, sehingga $\sqrt{9}=3$ dan bukan ±3, serta $\sqrt{x^2}=|x|$.`,
    ),
    L(
      T`Simplify a radical by taking perfect powers out of it ($\sqrt{72}=6\sqrt{2}$), and rationalize a denominator by multiplying by the root or by the conjugate.`,
      T`Sederhanakan bentuk akar dengan mengeluarkan pangkat sempurna darinya ($\sqrt{72}=6\sqrt{2}$), dan rasionalkan penyebut dengan mengalikan dengan akarnya atau dengan bentuk sekawannya.`,
    ),
    L(
      T`Scientific notation $a\times10^k$ is the exponent laws at work, and in code the power operator is ´**´, not ´^´.`,
      T`Notasi ilmiah $a\times10^k$ adalah hukum eksponen yang bekerja, dan dalam kode operator pangkat adalah ´**´, bukan ´^´.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-an-exponent',
      heading: L('What is an exponent?', 'Apa itu eksponen?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An exponent (or power) is a small raised number that says how many times the base is multiplied by itself: $a^n=a\cdot a\cdots a$, with $n$ factors of $a$.** In $2^5$ the base is 2 and the exponent is 5.

| Expression | Read as | Expanded | Value |
|---|---|---|---|
| $5^2$ | five squared | $5\cdot5$ | 25 |
| $10^3$ | ten cubed | $10\cdot10\cdot10$ | 1,000 |
| $3^4$ | three to the power four | $3\cdot3\cdot3\cdot3$ | 81 |
| $2^5$ | two to the power five | $2\cdot2\cdot2\cdot2\cdot2$ | 32 |
| $(-2)^3$ | minus two cubed | $(-2)(-2)(-2)$ | −8 |

An exponent of 1 changes nothing ($a^1=a$). The words "squared" and "cubed" come from geometry: $5^2$ is the area of a [square](article:quadrilaterals#perimeter-and-area) with side 5, and $10^3$ is the volume of a cube with side 10.

Powers grow fast. Each time the exponent goes up by 1, the value is multiplied by the base again: $2^{10}=1{,}024$, $2^{20}=1{,}048{,}576$ and $2^{30}$ is already over a billion. That is why exponents are the language of growth, of computer memory and of very large and very small quantities, and why the successive powers of a number form a [geometric sequence](article:geometric-sequences-and-series#nth-term).`,
            T`**Eksponen (atau pangkat) adalah bilangan kecil yang ditulis di atas dan menyatakan berapa kali basis dikalikan dengan dirinya sendiri: $a^n=a\cdot a\cdots a$, dengan $n$ faktor $a$.** Pada $2^5$ basisnya 2 dan eksponennya 5.

| Ekspresi | Dibaca | Dijabarkan | Nilai |
|---|---|---|---|
| $5^2$ | lima kuadrat | $5\cdot5$ | 25 |
| $10^3$ | sepuluh pangkat tiga | $10\cdot10\cdot10$ | 1.000 |
| $3^4$ | tiga pangkat empat | $3\cdot3\cdot3\cdot3$ | 81 |
| $2^5$ | dua pangkat lima | $2\cdot2\cdot2\cdot2\cdot2$ | 32 |
| $(-2)^3$ | minus dua pangkat tiga | $(-2)(-2)(-2)$ | −8 |

Eksponen 1 tidak mengubah apa pun ($a^1=a$). Istilah "kuadrat" dan "kubik" berasal dari geometri: $5^2$ adalah luas [persegi](article:quadrilaterals#perimeter-and-area) dengan sisi 5, dan $10^3$ adalah volume kubus dengan rusuk 10.

Pangkat tumbuh dengan cepat. Setiap kali eksponen naik 1, nilainya dikalikan basis sekali lagi: $2^{10}=1.024$, $2^{20}=1.048.576$, dan $2^{30}$ sudah lebih dari satu miliar. Itulah sebabnya eksponen menjadi bahasa pertumbuhan, memori komputer, serta besaran yang sangat besar dan sangat kecil, dan mengapa pangkat berurutan dari suatu bilangan membentuk [barisan geometri](article:geometric-sequences-and-series#nth-term).`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: evaluate a power', 'Coba: hitung sebuah pangkat'),
          step: {
            kind: 'quiz',
            id: 'a1',
            prompt: L('What is $5^3$?', 'Berapakah $5^3$?'),
            options: [L('125', '125'), L('15', '15'), L('53', '53'), L('243', '243')],
            answer: 0,
            explain: L(
              '$5^3=5\\cdot5\\cdot5=125$. The exponent counts the factors; it does not multiply the base ($5\\cdot3=15$).',
              '$5^3=5\\cdot5\\cdot5=125$. Eksponen menghitung faktor; ia tidak mengalikan basis ($5\\cdot3=15$).',
            ),
            hint: L('Write 5 as a factor three times and multiply.', 'Tulis 5 sebagai faktor tiga kali lalu kalikan.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- laws */
    {
      id: 'laws-of-exponents',
      heading: L('What are the laws of exponents?', 'Apa saja hukum eksponen?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**There are five laws of exponents: to multiply powers with the same base add the exponents, to divide subtract them, to raise a power to a power multiply them, and a power of a product or of a quotient is the product or quotient of the powers.**

| Law | Rule | Example |
|---|---|---|
| Product | $a^m\cdot a^n=a^{m+n}$ | $2^3\cdot2^4=2^7=128$ |
| Quotient | $\dfrac{a^m}{a^n}=a^{m-n}$ for $a\neq0$ | $\dfrac{5^6}{5^2}=5^4=625$ |
| Power of a power | $(a^m)^n=a^{mn}$ | $(3^2)^3=3^6=729$ |
| Power of a product | $(ab)^n=a^nb^n$ | $(2\cdot5)^3=2^3\cdot5^3=1{,}000$ |
| Power of a quotient | $\left(\dfrac{a}{b}\right)^n=\dfrac{a^n}{b^n}$ for $b\neq0$ | $\left(\dfrac{2}{3}\right)^2=\dfrac{4}{9}$ |

**Why the product law works.** Count the factors: $2^3\cdot2^4=(2\cdot2\cdot2)(2\cdot2\cdot2\cdot2)$ has $3+4=7$ factors of 2, so it is $2^7$. The other laws come from counting in the same way.

**The laws need one thing in common.** The product and quotient laws combine powers of the *same base*: $2^3\cdot2^4=2^7$, but $2^3\cdot3^4$ cannot be combined into one power. Try the laws on numbers of your own below, and see both sides calculated exactly.`,
            T`**Ada lima hukum eksponen: untuk mengalikan pangkat dengan basis sama, jumlahkan eksponennya; untuk membagi, kurangkan; untuk memangkatkan pangkat, kalikan eksponennya; dan pangkat dari perkalian atau pembagian adalah perkalian atau pembagian dari pangkat-pangkatnya.**

| Hukum | Aturan | Contoh |
|---|---|---|
| Perkalian | $a^m\cdot a^n=a^{m+n}$ | $2^3\cdot2^4=2^7=128$ |
| Pembagian | $\dfrac{a^m}{a^n}=a^{m-n}$ untuk $a\neq0$ | $\dfrac{5^6}{5^2}=5^4=625$ |
| Pangkat dari pangkat | $(a^m)^n=a^{mn}$ | $(3^2)^3=3^6=729$ |
| Pangkat dari perkalian | $(ab)^n=a^nb^n$ | $(2\cdot5)^3=2^3\cdot5^3=1.000$ |
| Pangkat dari pembagian | $\left(\dfrac{a}{b}\right)^n=\dfrac{a^n}{b^n}$ untuk $b\neq0$ | $\left(\dfrac{2}{3}\right)^2=\dfrac{4}{9}$ |

**Mengapa hukum perkalian berlaku.** Hitung faktornya: $2^3\cdot2^4=(2\cdot2\cdot2)(2\cdot2\cdot2\cdot2)$ memiliki $3+4=7$ faktor 2, sehingga hasilnya $2^7$. Hukum lainnya berasal dari cara menghitung yang sama.

**Hukum-hukum itu membutuhkan satu syarat.** Hukum perkalian dan pembagian menggabungkan pangkat dengan *basis yang sama*: $2^3\cdot2^4=2^7$, tetapi $2^3\cdot3^4$ tidak dapat digabung menjadi satu pangkat. Coba hukum-hukum ini dengan bilanganmu sendiri di bawah, dan lihat kedua ruasnya dihitung secara eksak.`,
          ),
        },
        { kind: 'widget', name: 'explaws' },
        {
          kind: 'activity',
          title: L('Try it: use the product law', 'Coba: pakai hukum perkalian'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Same base, so add the exponents.', 'Basisnya sama, jadi jumlahkan eksponennya.'),
              L('5 + 3 = 8.', '5 + 3 = 8.'),
            ],
            explain: L('$x^5\\cdot x^3=x^{5+3}=x^8$, so $n=8$.', '$x^5\\cdot x^3=x^{5+3}=x^8$, sehingga $n=8$.'),
            prompt: L('Find $n$.', 'Tentukan $n$.'),
            given: String.raw`x^5\cdot x^3=x^{n}`,
            blanks: [{ label: 'n =', answer: 8 }],
          },
        },
      ],
    },

    /* ------------------------------------------- zero, negative, fractional */
    {
      id: 'zero-negative-fractional',
      heading: L('What do zero, negative and fractional exponents mean?', 'Apa arti eksponen nol, negatif, dan pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**$a^0=1$ for any $a\neq0$, $a^{-n}=\dfrac{1}{a^n}$, and $a^{1/n}=\sqrt[n]{a}$: these are not extra rules to memorize but the only values that keep the laws of exponents true.** Counting factors cannot explain an exponent of 0 or of −3, so mathematicians ask what value the laws force.

- **Zero.** The product law says $a^m\cdot a^0=a^{m+0}=a^m$. Multiplying $a^m$ by $a^0$ changes nothing, so $a^0$ must be 1.
- **Negative.** $a^n\cdot a^{-n}=a^{0}=1$. Something that multiplies $a^n$ to give 1 is its reciprocal, so $a^{-n}=\dfrac{1}{a^n}$. A negative exponent does not make the number negative: $2^{-3}=\dfrac18$, not $-8$.
- **Fractional.** $\left(a^{1/n}\right)^n=a^{\frac1n\cdot n}=a^1=a$. A number whose $n$-th power is $a$ is an $n$-th root, so $a^{1/n}=\sqrt[n]{a}$. More generally $a^{m/n}=\left(a^{1/n}\right)^m=\sqrt[n]{a^m}$, so any [rational number](article:rational-numbers) can be an exponent.

The pattern is easiest to see by walking down the powers of 2. Each step down divides by 2:

$2^4=16$, $2^3=8$, $2^2=4$, $2^1=2$, $2^0=1$, $2^{-1}=\frac12$, $2^{-2}=\frac14$, $2^{-3}=\frac18$.

Use the widget to try another base.`,
            T`**$a^0=1$ untuk setiap $a\neq0$, $a^{-n}=\dfrac{1}{a^n}$, dan $a^{1/n}=\sqrt[n]{a}$: ini bukan aturan tambahan yang harus dihafal, melainkan satu-satunya nilai yang menjaga hukum eksponen tetap benar.** Menghitung faktor tidak dapat menjelaskan eksponen 0 atau −3, sehingga para matematikawan bertanya nilai apa yang dipaksakan oleh hukum-hukumnya.

- **Nol.** Hukum perkalian berkata $a^m\cdot a^0=a^{m+0}=a^m$. Mengalikan $a^m$ dengan $a^0$ tidak mengubah apa pun, sehingga $a^0$ harus 1.
- **Negatif.** $a^n\cdot a^{-n}=a^{0}=1$. Sesuatu yang mengalikan $a^n$ menjadi 1 adalah kebalikannya, sehingga $a^{-n}=\dfrac{1}{a^n}$. Eksponen negatif tidak membuat bilangannya negatif: $2^{-3}=\dfrac18$, bukan $-8$.
- **Pecahan.** $\left(a^{1/n}\right)^n=a^{\frac1n\cdot n}=a^1=a$. Bilangan yang pangkat $n$-nya adalah $a$ adalah akar pangkat $n$, sehingga $a^{1/n}=\sqrt[n]{a}$. Lebih umum, $a^{m/n}=\left(a^{1/n}\right)^m=\sqrt[n]{a^m}$, sehingga setiap [bilangan rasional](article:rational-numbers) dapat menjadi eksponen.

Polanya paling mudah terlihat dengan menuruni pangkat dari 2. Setiap langkah ke bawah membagi dengan 2:

$2^4=16$, $2^3=8$, $2^2=4$, $2^1=2$, $2^0=1$, $2^{-1}=\frac12$, $2^{-2}=\frac14$, $2^{-3}=\frac18$.

Pakai widget untuk mencoba basis lain.`,
          ),
        },
        { kind: 'widget', name: 'exppattern' },
        {
          kind: 'callout',
          tone: 'note',
          title: L('What about 0⁰?', 'Bagaimana dengan 0⁰?'),
          text: L(
            T`In algebra $0^0$ is left undefined, because two rules disagree: "anything to the power 0 is 1" says 1, and "0 to any positive power is 0" says 0. In programming and in combinatorics it is defined as 1 by convention, so ´0 ** 0´ is 1 in both Python and JavaScript.`,
            T`Dalam aljabar $0^0$ dibiarkan tidak terdefinisi, karena dua aturan berselisih: "apa pun pangkat 0 adalah 1" mengatakan 1, dan "0 pangkat bilangan positif apa pun adalah 0" mengatakan 0. Dalam pemrograman dan kombinatorika ia didefinisikan sebagai 1 menurut kesepakatan, sehingga ´0 ** 0´ bernilai 1 di Python maupun JavaScript.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: L('Negative bases and fractional exponents', 'Basis negatif dan eksponen pecahan'),
          text: L(
            T`Be careful with a negative base. $(-8)^{1/3}=-2$ is fine, since a cube root of a negative number is real. But $(-4)^{1/2}$ is not a real number, because no real number squared is negative. Reduce $\frac{m}{n}$ to lowest terms before you evaluate, as $(-8)^{2/6}$ and $(-8)^{1/3}$ must mean the same thing.`,
            T`Hati-hati dengan basis negatif. $(-8)^{1/3}=-2$ tidak masalah, karena akar pangkat tiga dari bilangan negatif itu real. Tetapi $(-4)^{1/2}$ bukan bilangan real, karena tidak ada bilangan real yang kuadratnya negatif. Sederhanakan $\frac{m}{n}$ ke bentuk paling sederhana sebelum menghitung, sebab $(-8)^{2/6}$ dan $(-8)^{1/3}$ harus berarti sama.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: a negative exponent', 'Coba: eksponen negatif'),
          step: {
            kind: 'quiz',
            id: 'a3',
            prompt: L('What is $2^{-3}$?', 'Berapakah $2^{-3}$?'),
            options: [L('$\\frac{1}{8}$', '$\\frac{1}{8}$'), L('$-8$', '$-8$'), L('$-6$', '$-6$'), L('$\\frac{1}{6}$', '$\\frac{1}{6}$')],
            answer: 0,
            explain: L(
              '$2^{-3}=\\dfrac{1}{2^3}=\\dfrac18$. A negative exponent means the reciprocal; it does not make the value negative.',
              '$2^{-3}=\\dfrac{1}{2^3}=\\dfrac18$. Eksponen negatif berarti kebalikan; ia tidak membuat nilainya negatif.',
            ),
            hint: L('Write $2^3$ first, then take the reciprocal.', 'Tulis $2^3$ dulu, lalu ambil kebalikannya.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------- radicals */
    {
      id: 'what-is-a-radical',
      heading: L('What is a radical (root)?', 'Apa itu akar (radikal)?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The $n$-th root of $a$, written $\sqrt[n]{a}$, is the number that gives $a$ when it is raised to the power $n$; $\sqrt{a}$ (index 2) is the square root and $\sqrt[3]{a}$ is the cube root.** In $\sqrt[n]{a}$ the symbol $\sqrt{\ }$ is the radical sign, $a$ is the radicand and $n$ is the index.

- **Square root:** $\sqrt{49}=7$ because $7^2=49$.
- **Cube root:** $\sqrt[3]{125}=5$ because $5^3=125$, and $\sqrt[3]{-8}=-2$ because $(-2)^3=-8$.
- **Principal root:** $\sqrt{9}=3$, not $\pm3$. The radical sign always means the non-negative root. The *equation* $x^2=9$ has two solutions, $x=3$ and $x=-3$, which is why a solution step writes $x=\pm\sqrt{9}$.
- **Even and odd roots:** an even root of a negative number is not real ($\sqrt{-4}$), but an odd root of a negative number is ($\sqrt[3]{-27}=-3$).
- **A root of a square:** $\sqrt{x^2}=|x|$, not $x$, because the result may not be negative: $\sqrt{(-5)^2}=\sqrt{25}=5$.

| $n$ | $n^2$ | $n$ | $n^3$ |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 2 | 4 | 2 | 8 |
| 3 | 9 | 3 | 27 |
| 4 | 16 | 4 | 64 |
| 5 | 25 | 5 | 125 |
| 6 | 36 | 6 | 216 |
| 7 | 49 | 7 | 343 |
| 8 | 64 | 8 | 512 |
| 9 | 81 | 9 | 729 |
| 10 | 100 | 10 | 1,000 |
| 11 to 15 | 121, 144, 169, 196, 225 | | |

A root of a whole number is either a whole number (when the number is a perfect power, as in the table) or an irrational number: for a positive integer $a$, $\sqrt{a}$ is irrational exactly when $a$ is not a perfect square. That is why the decimal expansions of $\sqrt{2}$, $\sqrt{3}$ and $\sqrt{72}$ are infinite and never periodic; the article on [irrational numbers](article:irrational-numbers#which-roots-are-irrational) shows how to test any root.`,
            T`**Akar pangkat $n$ dari $a$, ditulis $\sqrt[n]{a}$, adalah bilangan yang menghasilkan $a$ bila dipangkatkan $n$; $\sqrt{a}$ (indeks 2) adalah akar kuadrat dan $\sqrt[3]{a}$ adalah akar pangkat tiga.** Pada $\sqrt[n]{a}$ lambang $\sqrt{\ }$ adalah tanda akar, $a$ adalah radikan (bilangan di bawah tanda akar), dan $n$ adalah indeks.

- **Akar kuadrat:** $\sqrt{49}=7$ karena $7^2=49$.
- **Akar pangkat tiga:** $\sqrt[3]{125}=5$ karena $5^3=125$, dan $\sqrt[3]{-8}=-2$ karena $(-2)^3=-8$.
- **Akar utama:** $\sqrt{9}=3$, bukan $\pm3$. Tanda akar selalu berarti akar yang tidak negatif. *Persamaan* $x^2=9$ memiliki dua penyelesaian, $x=3$ dan $x=-3$, itulah sebabnya langkah penyelesaian menulis $x=\pm\sqrt{9}$.
- **Akar genap dan ganjil:** akar genap dari bilangan negatif bukan bilangan real ($\sqrt{-4}$), tetapi akar ganjil dari bilangan negatif adalah real ($\sqrt[3]{-27}=-3$).
- **Akar dari kuadrat:** $\sqrt{x^2}=|x|$, bukan $x$, karena hasilnya tidak boleh negatif: $\sqrt{(-5)^2}=\sqrt{25}=5$.

| $n$ | $n^2$ | $n$ | $n^3$ |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 2 | 4 | 2 | 8 |
| 3 | 9 | 3 | 27 |
| 4 | 16 | 4 | 64 |
| 5 | 25 | 5 | 125 |
| 6 | 36 | 6 | 216 |
| 7 | 49 | 7 | 343 |
| 8 | 64 | 8 | 512 |
| 9 | 81 | 9 | 729 |
| 10 | 100 | 10 | 1.000 |
| 11 sampai 15 | 121, 144, 169, 196, 225 | | |

Akar dari bilangan bulat adalah bilangan bulat (bila bilangan itu pangkat sempurna, seperti pada tabel) atau bilangan irasional: untuk bilangan bulat positif $a$, $\sqrt{a}$ irasional tepat ketika $a$ bukan kuadrat sempurna. Itulah sebabnya ekspansi desimal $\sqrt{2}$, $\sqrt{3}$, dan $\sqrt{72}$ tak berhingga dan tidak pernah periodik; artikel [bilangan irasional](article:irrational-numbers#which-roots-are-irrational) menunjukkan cara menguji akar apa pun.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'note',
          title: L('Where the notation comes from', 'Asal usul notasinya'),
          text: L(
            T`The radical sign $\sqrt{\ }$ first appeared in print in Christoff Rudolff's *Die Coss* (1525). The raised exponent, as in $a^2$ and $a^3$, was popularised by René Descartes in *La Géométrie* (1637). Giving meaning to negative and fractional exponents is usually credited to John Wallis (1656) and Isaac Newton (1676), who began writing roots as powers.`,
            T`Tanda akar $\sqrt{\ }$ pertama kali muncul dalam cetakan di *Die Coss* karya Christoff Rudolff (1525). Eksponen yang ditulis di atas, seperti pada $a^2$ dan $a^3$, dipopulerkan oleh René Descartes dalam *La Géométrie* (1637). Pemberian makna pada eksponen negatif dan pecahan biasanya dikaitkan dengan John Wallis (1656) dan Isaac Newton (1676), yang mulai menulis akar sebagai pangkat.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- simplify */
    {
      id: 'simplify-radicals',
      heading: L('How do you simplify a radical?', 'Bagaimana menyederhanakan bentuk akar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To simplify a radical, factor the number under the root, take every group of $n$ equal factors out of an $n$-th root, and multiply what comes out: $\sqrt{72}=\sqrt{2^3\cdot3^2}=3\cdot2\sqrt{2}=6\sqrt{2}$.** Follow these steps, shown for $\sqrt{72}$:

1. Factor the radicand into [primes](article:integers#primes): $72=2\cdot2\cdot2\cdot3\cdot3$.
2. Group equal primes in sets as large as the index (pairs for a square root): $(2\cdot2)\cdot2\cdot(3\cdot3)$.
3. Take one prime out for each group; what has no partner stays inside: the pair of 2s gives 2, the pair of 3s gives 3, and one 2 stays under the root.
4. Multiply what came out: $2\cdot3=6$, so $\sqrt{72}=6\sqrt{2}$.

The rules behind it, for $a,b\ge0$: $\sqrt{ab}=\sqrt{a}\cdot\sqrt{b}$ and $\sqrt{\dfrac{a}{b}}=\dfrac{\sqrt{a}}{\sqrt{b}}$ for $b>0$. For a cube root take groups of three: $\sqrt[3]{54}=\sqrt[3]{2\cdot3^3}=3\sqrt[3]{2}$.

**Adding radicals.** Only *like* radicals, those with the same index and radicand, combine: $3\sqrt{2}+5\sqrt{2}=8\sqrt{2}$. Two different-looking roots may turn out alike once simplified: $\sqrt{50}+\sqrt{8}=5\sqrt{2}+2\sqrt{2}=7\sqrt{2}$. But $\sqrt{a+b}$ is not $\sqrt{a}+\sqrt{b}$: $\sqrt{9+16}=5$, not $3+4$.

Try any number below. Switch the index to see cube roots and higher roots.`,
            T`**Untuk menyederhanakan bentuk akar, faktorkan bilangan di bawah akar, keluarkan setiap kelompok berisi $n$ faktor yang sama dari akar pangkat $n$, lalu kalikan yang keluar: $\sqrt{72}=\sqrt{2^3\cdot3^2}=3\cdot2\sqrt{2}=6\sqrt{2}$.** Ikuti langkah berikut, ditunjukkan untuk $\sqrt{72}$:

1. Faktorkan radikan menjadi [bilangan prima](article:integers#primes): $72=2\cdot2\cdot2\cdot3\cdot3$.
2. Kelompokkan bilangan prima yang sama dalam himpunan sebesar indeksnya (berpasangan untuk akar kuadrat): $(2\cdot2)\cdot2\cdot(3\cdot3)$.
3. Keluarkan satu bilangan prima untuk setiap kelompok; yang tidak berpasangan tetap di dalam: pasangan 2 menghasilkan 2, pasangan 3 menghasilkan 3, dan satu 2 tetap di bawah akar.
4. Kalikan yang keluar: $2\cdot3=6$, sehingga $\sqrt{72}=6\sqrt{2}$.

Aturan di baliknya, untuk $a,b\ge0$: $\sqrt{ab}=\sqrt{a}\cdot\sqrt{b}$ dan $\sqrt{\dfrac{a}{b}}=\dfrac{\sqrt{a}}{\sqrt{b}}$ untuk $b>0$. Untuk akar pangkat tiga ambil kelompok tiga: $\sqrt[3]{54}=\sqrt[3]{2\cdot3^3}=3\sqrt[3]{2}$.

**Menjumlahkan bentuk akar.** Hanya akar yang *senama*, yaitu yang indeks dan radikannya sama, yang dapat digabung: $3\sqrt{2}+5\sqrt{2}=8\sqrt{2}$. Dua akar yang tampak berbeda bisa ternyata senama setelah disederhanakan: $\sqrt{50}+\sqrt{8}=5\sqrt{2}+2\sqrt{2}=7\sqrt{2}$. Tetapi $\sqrt{a+b}$ bukan $\sqrt{a}+\sqrt{b}$: $\sqrt{9+16}=5$, bukan $3+4$.

Coba bilangan apa pun di bawah. Ganti indeksnya untuk melihat akar pangkat tiga dan akar yang lebih tinggi.`,
          ),
        },
        { kind: 'widget', name: 'simplifyroot' },
        {
          kind: 'activity',
          title: L('Try it: simplest form', 'Coba: bentuk paling sederhana'),
          step: {
            kind: 'quiz',
            id: 'a4',
            prompt: L('Which one is $\\sqrt{72}$ in simplest form?', 'Mana yang merupakan $\\sqrt{72}$ dalam bentuk paling sederhana?'),
            options: [L('$6\\sqrt{2}$', '$6\\sqrt{2}$'), L('$2\\sqrt{18}$', '$2\\sqrt{18}$'), L('$3\\sqrt{8}$', '$3\\sqrt{8}$'), L('$36\\sqrt{2}$', '$36\\sqrt{2}$')],
            answer: 0,
            explain: L(
              '$6\\sqrt{2}$ has nothing left to take out of the root. $2\\sqrt{18}$ and $3\\sqrt{8}$ are equal to it, but 18 and 8 still contain the square factors 9 and 4. $36\\sqrt{2}$ is a different number.',
              '$6\\sqrt{2}$ tidak punya lagi yang dapat dikeluarkan dari akar. $2\\sqrt{18}$ dan $3\\sqrt{8}$ nilainya sama, tetapi 18 dan 8 masih memuat faktor kuadrat 9 dan 4. $36\\sqrt{2}$ adalah bilangan yang berbeda.',
            ),
            hint: L('Simplest means no square factor is left under the root.', 'Paling sederhana berarti tidak ada faktor kuadrat yang tersisa di bawah akar.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------- rationalize */
    {
      id: 'rationalise',
      heading: L('How do you rationalize a denominator?', 'Bagaimana merasionalkan penyebut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To rationalize a denominator, multiply the top and bottom of the fraction by a number that removes the root from the bottom: by the root itself for $\dfrac{a}{\sqrt{b}}$, and by the conjugate for $\dfrac{a}{p+\sqrt{q}}$.** Multiplying top and bottom by the same non-zero number does not change the value of a fraction.

- **A single root.** $\dfrac{6}{\sqrt{3}}=\dfrac{6\cdot\sqrt{3}}{\sqrt{3}\cdot\sqrt{3}}=\dfrac{6\sqrt{3}}{3}=2\sqrt{3}$, because $\sqrt{3}\cdot\sqrt{3}=3$.
- **A sum or difference.** The *conjugate* of $p+\sqrt{q}$ is $p-\sqrt{q}$ (flip the sign). Their product is a difference of squares, which has no root left: $(p+\sqrt{q})(p-\sqrt{q})=p^2-q$.

For example $\dfrac{1}{1+\sqrt{2}}=\dfrac{1\cdot(1-\sqrt{2})}{(1+\sqrt{2})(1-\sqrt{2})}=\dfrac{1-\sqrt{2}}{1-2}=\dfrac{1-\sqrt{2}}{-1}=\sqrt{2}-1$.

**How to rationalize a denominator**, in short: (1) choose the root, or the conjugate when the bottom is a sum or a difference; (2) multiply the top and the bottom by it; (3) simplify, and cancel any common factor.

Rationalizing is a convention, not a correction: $\dfrac{1}{\sqrt{2}}$ and $\dfrac{\sqrt{2}}{2}$ are the same number. The second is the expected form, and it is easier to estimate by hand, since $\sqrt{2}\approx1.414$ gives about $0.707$.`,
            T`**Untuk merasionalkan penyebut, kalikan pembilang dan penyebut pecahan dengan bilangan yang menghilangkan akar dari penyebut: dengan akarnya sendiri untuk $\dfrac{a}{\sqrt{b}}$, dan dengan bentuk sekawan untuk $\dfrac{a}{p+\sqrt{q}}$.** Mengalikan pembilang dan penyebut dengan bilangan tak nol yang sama tidak mengubah nilai pecahan.

- **Satu akar.** $\dfrac{6}{\sqrt{3}}=\dfrac{6\cdot\sqrt{3}}{\sqrt{3}\cdot\sqrt{3}}=\dfrac{6\sqrt{3}}{3}=2\sqrt{3}$, karena $\sqrt{3}\cdot\sqrt{3}=3$.
- **Jumlah atau selisih.** *Bentuk sekawan* dari $p+\sqrt{q}$ adalah $p-\sqrt{q}$ (balik tandanya). Hasil kali keduanya adalah selisih kuadrat, yang tidak lagi memuat akar: $(p+\sqrt{q})(p-\sqrt{q})=p^2-q$.

Misalnya $\dfrac{1}{1+\sqrt{2}}=\dfrac{1\cdot(1-\sqrt{2})}{(1+\sqrt{2})(1-\sqrt{2})}=\dfrac{1-\sqrt{2}}{1-2}=\dfrac{1-\sqrt{2}}{-1}=\sqrt{2}-1$.

**Cara merasionalkan penyebut**, singkatnya: (1) pilih akarnya, atau bentuk sekawan bila penyebut berupa jumlah atau selisih; (2) kalikan pembilang dan penyebut dengannya; (3) sederhanakan, dan coret faktor persekutuan.

Merasionalkan adalah kesepakatan, bukan koreksi: $\dfrac{1}{\sqrt{2}}$ dan $\dfrac{\sqrt{2}}{2}$ adalah bilangan yang sama. Bentuk kedua adalah bentuk yang diharapkan, dan lebih mudah ditaksir dengan tangan, sebab $\sqrt{2}\approx1{,}414$ memberi sekitar $0{,}707$.`,
          ),
        },
        { kind: 'widget', name: 'rationalise' },
        {
          kind: 'activity',
          title: L('Try it: rationalize', 'Coba: rasionalkan'),
          step: {
            kind: 'math',
            id: 'a5',
            hints: [
              L('Multiply the top and the bottom by $\\sqrt{3}$.', 'Kalikan pembilang dan penyebut dengan $\\sqrt{3}$.'),
              L('You get $\\dfrac{6\\sqrt{3}}{3}$. Cancel the 3.', 'Kamu mendapat $\\dfrac{6\\sqrt{3}}{3}$. Coret 3-nya.'),
            ],
            explain: L('$\\dfrac{6}{\\sqrt{3}}=\\dfrac{6\\sqrt{3}}{3}=2\\sqrt{3}$, so $a=2$.', '$\\dfrac{6}{\\sqrt{3}}=\\dfrac{6\\sqrt{3}}{3}=2\\sqrt{3}$, sehingga $a=2$.'),
            prompt: L('Rationalize the denominator and find $a$.', 'Rasionalkan penyebutnya dan tentukan $a$.'),
            given: String.raw`\frac{6}{\sqrt{3}}=a\sqrt{3}`,
            blanks: [{ label: 'a =', answer: 2 }],
          },
        },
      ],
    },

    /* ----------------------------------------------- radicals and exponents */
    {
      id: 'radicals-and-exponents',
      heading: L('How are radicals and fractional exponents connected?', 'Bagaimana akar dan eksponen pecahan berhubungan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A radical is a fractional exponent: $\sqrt[n]{a}=a^{1/n}$ and $\sqrt[n]{a^m}=\left(\sqrt[n]{a}\right)^m=a^{m/n}$, so every law of exponents also works for roots.**

| Radical form | Exponent form | Value |
|---|---|---|
| $\sqrt{9}$ | $9^{1/2}$ | 3 |
| $\sqrt[3]{27}$ | $27^{1/3}$ | 3 |
| $\sqrt[3]{8^2}$ | $8^{2/3}$ | 4 |
| $\dfrac{1}{\sqrt{16}}$ | $16^{-1/2}$ | $\dfrac14$ |
| $\sqrt[4]{16^3}$ | $16^{3/4}$ | 8 |

**How to evaluate $a^{m/n}$:**

1. Take the $n$-th root of the base (the denominator of the exponent): $8^{2/3}$ starts with $\sqrt[3]{8}=2$.
2. Raise the result to the power $m$ (the numerator): $2^2=4$.
3. If the exponent is negative, take the reciprocal: $8^{-2/3}=\dfrac{1}{8^{2/3}}=\dfrac14$.

Taking the root first keeps the numbers small, which is why this order is best by hand.

The exponent form is also the only way to combine roots with different indexes. Since $\sqrt{2}=2^{1/2}$ and $\sqrt[3]{2}=2^{1/3}$, the product law gives $\sqrt{2}\cdot\sqrt[3]{2}=2^{1/2+1/3}=2^{5/6}=\sqrt[6]{32}$. Try your own below.`,
            T`**Akar adalah eksponen pecahan: $\sqrt[n]{a}=a^{1/n}$ dan $\sqrt[n]{a^m}=\left(\sqrt[n]{a}\right)^m=a^{m/n}$, sehingga setiap hukum eksponen juga berlaku untuk akar.**

| Bentuk akar | Bentuk eksponen | Nilai |
|---|---|---|
| $\sqrt{9}$ | $9^{1/2}$ | 3 |
| $\sqrt[3]{27}$ | $27^{1/3}$ | 3 |
| $\sqrt[3]{8^2}$ | $8^{2/3}$ | 4 |
| $\dfrac{1}{\sqrt{16}}$ | $16^{-1/2}$ | $\dfrac14$ |
| $\sqrt[4]{16^3}$ | $16^{3/4}$ | 8 |

**Cara menghitung $a^{m/n}$:**

1. Ambil akar pangkat $n$ dari basis (penyebut eksponen): $8^{2/3}$ dimulai dengan $\sqrt[3]{8}=2$.
2. Pangkatkan hasilnya dengan $m$ (pembilang): $2^2=4$.
3. Bila eksponennya negatif, ambil kebalikannya: $8^{-2/3}=\dfrac{1}{8^{2/3}}=\dfrac14$.

Mengambil akar lebih dulu menjaga bilangan tetap kecil, itulah sebabnya urutan ini terbaik bila dihitung dengan tangan.

Bentuk eksponen juga satu-satunya cara menggabungkan akar dengan indeks berbeda. Karena $\sqrt{2}=2^{1/2}$ dan $\sqrt[3]{2}=2^{1/3}$, hukum perkalian memberi $\sqrt{2}\cdot\sqrt[3]{2}=2^{1/2+1/3}=2^{5/6}=\sqrt[6]{32}$. Coba milikmu sendiri di bawah.`,
          ),
        },
        { kind: 'widget', name: 'rootexp' },
        {
          kind: 'activity',
          title: L('Try it: a fractional exponent', 'Coba: eksponen pecahan'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('Take the cube root of 8 first.', 'Ambil akar pangkat tiga dari 8 lebih dulu.'),
              L('The cube root of 8 is 2. Now square it.', 'Akar pangkat tiga dari 8 adalah 2. Sekarang kuadratkan.'),
            ],
            explain: L('$8^{2/3}=\\left(\\sqrt[3]{8}\\right)^2=2^2=4$.', '$8^{2/3}=\\left(\\sqrt[3]{8}\\right)^2=2^2=4$.'),
            prompt: L('Evaluate $8^{2/3}$.', 'Hitung $8^{2/3}$.'),
            given: String.raw`8^{2/3}`,
            blanks: [{ label: '8^{2/3} =', answer: 4 }],
          },
        },
      ],
    },

    /* ------------------------------------------------------------ equations */
    {
      id: 'equations',
      heading: L('How do you solve equations with exponents and roots?', 'Bagaimana menyelesaikan persamaan dengan eksponen dan akar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve an exponent equation write both sides with the same base and equate the exponents; to solve a radical equation isolate the root, raise both sides to the index, solve, and check every answer, because raising to a power can create false solutions.**

**Exponent equations (same base).**

- $2^x=32\;\Rightarrow\;2^x=2^5\;\Rightarrow\;x=5$.
- $9^x=27$, so $(3^2)^x=3^3$, so $3^{2x}=3^3$, so $2x=3$, so $x=\dfrac32$.
- A power on the unknown: $x^3=27\;\Rightarrow\;x=3$ (an odd power has one real root), but $x^2=9\;\Rightarrow\;x=\pm3$ (an even power has two).

**Radical equations.** $\sqrt{x+1}=3\;\Rightarrow\;x+1=9\;\Rightarrow\;x=8$, and the check $\sqrt{8+1}=3$ holds.

**Always check.** Squaring both sides can add answers that do not fit the original equation, called *extraneous* solutions. Take $\sqrt{x+2}=x$:

1. Square both sides: $x+2=x^2$.
2. Rearrange: $x^2-x-2=0$, which factorises as $(x-2)(x+1)=0$, so $x=2$ or $x=-1$.
3. Check $x=2$: $\sqrt{4}=2$ ✓. Check $x=-1$: $\sqrt{1}=1$, which is not $-1$ ✗.

Only $x=2$ is a solution. The root sign is never negative, so the right side cannot be negative either.`,
            T`**Untuk menyelesaikan persamaan eksponen, tulis kedua ruas dengan basis yang sama lalu samakan eksponennya; untuk menyelesaikan persamaan akar, pisahkan akarnya, pangkatkan kedua ruas dengan indeksnya, selesaikan, dan periksa setiap jawaban, karena memangkatkan dapat menimbulkan penyelesaian palsu.**

**Persamaan eksponen (basis sama).**

- $2^x=32\;\Rightarrow\;2^x=2^5\;\Rightarrow\;x=5$.
- $9^x=27$, jadi $(3^2)^x=3^3$, jadi $3^{2x}=3^3$, jadi $2x=3$, jadi $x=\dfrac32$.
- Pangkat pada bilangan yang dicari: $x^3=27\;\Rightarrow\;x=3$ (pangkat ganjil punya satu akar real), tetapi $x^2=9\;\Rightarrow\;x=\pm3$ (pangkat genap punya dua).

**Persamaan akar.** $\sqrt{x+1}=3\;\Rightarrow\;x+1=9\;\Rightarrow\;x=8$, dan pemeriksaan $\sqrt{8+1}=3$ berlaku.

**Selalu periksa.** Mengkuadratkan kedua ruas dapat menambah jawaban yang tidak cocok dengan persamaan semula, disebut penyelesaian *asing*. Ambil $\sqrt{x+2}=x$:

1. Kuadratkan kedua ruas: $x+2=x^2$.
2. Susun ulang: $x^2-x-2=0$, yang difaktorkan menjadi $(x-2)(x+1)=0$, sehingga $x=2$ atau $x=-1$.
3. Periksa $x=2$: $\sqrt{4}=2$ ✓. Periksa $x=-1$: $\sqrt{1}=1$, yang bukan $-1$ ✗.

Hanya $x=2$ yang merupakan penyelesaian. Tanda akar tidak pernah negatif, sehingga ruas kanan pun tidak boleh negatif.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: an exponent equation', 'Coba: persamaan eksponen'),
          step: {
            kind: 'quiz',
            id: 'a7',
            prompt: L('Solve $9^x=27$.', 'Selesaikan $9^x=27$.'),
            options: [L('$x=\\frac{3}{2}$', '$x=\\frac{3}{2}$'), L('$x=3$', '$x=3$'), L('$x=2$', '$x=2$'), L('$x=\\frac{1}{2}$', '$x=\\frac{1}{2}$')],
            answer: 0,
            explain: L(
              'Write both sides with base 3: $9^x=(3^2)^x=3^{2x}$ and $27=3^3$. Then $2x=3$, so $x=\\frac32$.',
              'Tulis kedua ruas dengan basis 3: $9^x=(3^2)^x=3^{2x}$ dan $27=3^3$. Maka $2x=3$, sehingga $x=\\frac32$.',
            ),
            hint: L('Both 9 and 27 are powers of 3.', 'Baik 9 maupun 27 adalah pangkat dari 3.'),
          },
        },
        {
          kind: 'activity',
          title: L('Try it: an extraneous solution', 'Coba: penyelesaian asing'),
          step: {
            kind: 'quiz',
            id: 'a8',
            prompt: L('Which values solve $\\sqrt{x+2}=x$?', 'Nilai mana yang menyelesaikan $\\sqrt{x+2}=x$?'),
            options: [L('$x=2$ only', 'hanya $x=2$'), L('$x=-1$ only', 'hanya $x=-1$'), L('both $x=2$ and $x=-1$', '$x=2$ dan $x=-1$ keduanya'), L('no solution', 'tidak ada penyelesaian')],
            answer: 0,
            explain: L(
              'Squaring gives $x^2-x-2=0$, so $x=2$ or $x=-1$. But $\\sqrt{-1+2}=1$ is not $-1$, so $x=-1$ is extraneous.',
              'Mengkuadratkan memberi $x^2-x-2=0$, sehingga $x=2$ atau $x=-1$. Tetapi $\\sqrt{-1+2}=1$ bukan $-1$, jadi $x=-1$ adalah penyelesaian asing.',
            ),
            hint: L('Substitute each candidate back into the original equation.', 'Substitusikan tiap kandidat kembali ke persamaan semula.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------ scientific notation */
    {
      id: 'scientific-notation',
      heading: L('How do you write numbers in scientific notation?', 'Bagaimana menulis bilangan dalam notasi ilmiah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Scientific notation writes a number as $a\times10^k$ with $1\le a<10$ and $k$ an integer: move the decimal point until one non-zero digit is left of it, and let $k$ count the places moved.** Moving left makes $k$ positive and moving right makes it negative.

| Quantity | Ordinary number | Scientific notation |
|---|---|---|
| Speed of light in a vacuum | 299,792,458 m/s | $2.99792458\times10^{8}$ m/s |
| Avogadro constant | 602,214,076,000,000,000,000,000 per mole | $6.02214076\times10^{23}$ per mole |
| One astronomical unit | 149,597,870,700 m | $1.495978707\times10^{11}$ m |
| A small length | 0.00045 m | $4.5\times10^{-4}$ m |

The first three values are exact by definition in the International System of Units. Scientific notation is the laws of exponents at work. To multiply, multiply the numbers and add the exponents: $(3\times10^{5})(2\times10^{4})=6\times10^{9}$. To divide, divide the numbers and subtract the exponents. To add, first give both numbers the same power of 10.`,
            T`**Notasi ilmiah menulis bilangan sebagai $a\times10^k$ dengan $1\le a<10$ dan $k$ bilangan bulat: geser koma desimal sampai tersisa satu angka bukan nol di kirinya, dan biarkan $k$ menghitung tempat yang digeser.** Menggeser ke kiri membuat $k$ positif dan menggeser ke kanan membuatnya negatif.

| Besaran | Bilangan biasa | Notasi ilmiah |
|---|---|---|
| Kecepatan cahaya dalam vakum | 299.792.458 m/s | $2{,}99792458\times10^{8}$ m/s |
| Tetapan Avogadro | 602.214.076.000.000.000.000.000 per mol | $6{,}02214076\times10^{23}$ per mol |
| Satu satuan astronomi | 149.597.870.700 m | $1{,}495978707\times10^{11}$ m |
| Panjang yang kecil | 0,00045 m | $4{,}5\times10^{-4}$ m |

Tiga nilai pertama persis menurut definisi dalam Sistem Satuan Internasional. Notasi ilmiah adalah hukum eksponen yang bekerja. Untuk mengalikan, kalikan bilangannya dan jumlahkan eksponennya: $(3\times10^{5})(2\times10^{4})=6\times10^{9}$. Untuk membagi, bagi bilangannya dan kurangkan eksponennya. Untuk menjumlahkan, lebih dulu samakan pangkat 10 kedua bilangan.`,
          ),
        },
        { kind: 'widget', name: 'scinot' },
      ],
    },

    /* ----------------------------------------------------------------- code */
    {
      id: 'exponents-in-code',
      heading: L('How do you calculate exponents and roots in Python and JavaScript?', 'Bagaimana menghitung eksponen dan akar di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In Python and JavaScript the power operator is a double asterisk, not the caret (which is bitwise XOR), and a root is a power of ´1/n´ or a function such as ´math.sqrt´ and ´Math.cbrt´.**`,
            T`**Di Python dan JavaScript operator pangkat adalah tanda bintang ganda, bukan tanda sisipan (yang merupakan XOR bitwise), dan akar adalah pangkat ´1/n´ atau sebuah fungsi seperti ´math.sqrt´ dan ´Math.cbrt´.**`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> 2 ** 10
1024
>>> 2 ** -3
0.125
>>> 16 ** 0.5
4.0
>>> 27 ** (1/3)
3.0
>>> import math
>>> math.sqrt(72)
8.48528137423857
>>> math.isqrt(72)      # whole-number square root, rounded down
8
>>> (-8) ** (1/3)       # a negative base with a fractional exponent
(1.0000000000000002+1.7320508075688772j)
>>> 2 ^ 3               # XOR, not a power
1`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `2 ** 10               // 1024
2 ** -3               // 0.125
Math.sqrt(72)         // 8.48528137423857
Math.cbrt(-8)         // -2
(-8) ** (1 / 3)       // NaN
(-2) ** 2             // 4   (-2 ** 2 is a SyntaxError)
Math.sqrt(2) ** 2     // 2.0000000000000004
2n ** 100n            // 1267650600228229401496703205376n (BigInt stays exact)`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´^´ for a power | it is XOR: ´2 ^ 3´ is 1 | use ´**´, or ´pow(2, 3)´ in Python and ´Math.pow(2, 3)´ in JavaScript |
| ´-2 ** 2´ | Python gives −4; JavaScript refuses it as a SyntaxError | write ´(-2) ** 2´ or ´-(2 ** 2)´ so the meaning is clear |
| Negative base, fractional exponent | Python returns a complex number; JavaScript returns NaN | use ´Math.cbrt´ for cube roots; check the sign first |
| Roots and rounding | ´Math.sqrt(2) ** 2´ is ´2.0000000000000004´ | compare with a tolerance, as in the [article on real numbers](article:real-numbers#real-numbers-in-code) |
| Very large powers | JavaScript numbers lose exactness beyond 2⁵³; Python integers do not | use ´BigInt´ in JavaScript, or Python's ´int´ |
| ´0 ** 0´ | it is 1 in both languages | remember it is a convention, not a theorem |

Use ´math.isqrt´ in Python when you need the whole-number part of a square root: it is exact for any size of integer, while ´math.sqrt´ works with floating-point numbers (floats).`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´^´ untuk pangkat | itu XOR: ´2 ^ 3´ bernilai 1 | pakai ´**´, atau ´pow(2, 3)´ di Python dan ´Math.pow(2, 3)´ di JavaScript |
| ´-2 ** 2´ | Python memberi −4; JavaScript menolaknya sebagai SyntaxError | tulis ´(-2) ** 2´ atau ´-(2 ** 2)´ agar maknanya jelas |
| Basis negatif, eksponen pecahan | Python mengembalikan bilangan kompleks; JavaScript mengembalikan NaN | pakai ´Math.cbrt´ untuk akar pangkat tiga; periksa tandanya lebih dulu |
| Akar dan pembulatan | ´Math.sqrt(2) ** 2´ bernilai ´2.0000000000000004´ | bandingkan dengan toleransi, seperti pada [artikel bilangan real](article:real-numbers#real-numbers-in-code) |
| Pangkat yang sangat besar | bilangan JavaScript kehilangan ketepatan di atas 2⁵³; bilangan bulat Python tidak | pakai ´BigInt´ di JavaScript, atau ´int´ Python |
| ´0 ** 0´ | bernilai 1 di kedua bahasa | ingat bahwa itu kesepakatan, bukan teorema |

Pakai ´math.isqrt´ di Python bila kamu membutuhkan bagian bulat dari akar kuadrat: ia eksak untuk bilangan bulat sebesar apa pun, sedangkan ´math.sqrt´ bekerja dengan bilangan floating point (float).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with exponents and radicals?', 'Apa kesalahan umum pada eksponen dan akar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with exponents and radicals are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| $(a+b)^2=a^2+b^2$ | $(a+b)^2=a^2+2ab+b^2$. Check: $(1+2)^2=9$, not $1+4=5$. See [expanding brackets](article:algebraic-expressions#expand). |
| $\sqrt{a+b}=\sqrt{a}+\sqrt{b}$ | False in general: $\sqrt{9+16}=5$, not $3+4=7$. |
| $-3^2=9$ | $-3^2=-(3\cdot3)=-9$. Only $(-3)^2=9$. |
| $2^{-3}=-8$ | $2^{-3}=\dfrac18$. A negative exponent is a reciprocal. |
| $a^m\cdot a^n=a^{mn}$ | Exponents add: $a^{m+n}$. It is $(a^m)^n$ that multiplies them. |
| $2^3\cdot3^3=6^6$ | $2^3\cdot3^3=6^3$. Bases multiply only when the exponents are equal. |
| $\sqrt{x^2}=x$ | $\sqrt{x^2}=|x|$. Check: $\sqrt{(-5)^2}=5$, not $-5$. |
| $a^0=0$ | $a^0=1$ for $a\neq0$. |
| $\dfrac{1}{\sqrt{2}}$ is already simplest | The value is right, but the expected form has no root below: $\dfrac{\sqrt{2}}{2}$. |`,
            T`**Kesalahan paling umum pada eksponen dan akar adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| $(a+b)^2=a^2+b^2$ | $(a+b)^2=a^2+2ab+b^2$. Periksa: $(1+2)^2=9$, bukan $1+4=5$. Lihat [menjabarkan kurung](article:algebraic-expressions#expand). |
| $\sqrt{a+b}=\sqrt{a}+\sqrt{b}$ | Salah pada umumnya: $\sqrt{9+16}=5$, bukan $3+4=7$. |
| $-3^2=9$ | $-3^2=-(3\cdot3)=-9$. Hanya $(-3)^2=9$. |
| $2^{-3}=-8$ | $2^{-3}=\dfrac18$. Eksponen negatif adalah kebalikan. |
| $a^m\cdot a^n=a^{mn}$ | Eksponen dijumlahkan: $a^{m+n}$. Yang mengalikan eksponen adalah $(a^m)^n$. |
| $2^3\cdot3^3=6^6$ | $2^3\cdot3^3=6^3$. Basis dikalikan hanya bila eksponennya sama. |
| $\sqrt{x^2}=x$ | $\sqrt{x^2}=|x|$. Periksa: $\sqrt{(-5)^2}=5$, bukan $-5$. |
| $a^0=0$ | $a^0=1$ untuk $a\neq0$. |
| $\dfrac{1}{\sqrt{2}}$ sudah paling sederhana | Nilainya benar, tetapi bentuk yang diharapkan tidak punya akar di bawah: $\dfrac{\sqrt{2}}{2}$. |`,
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
              L('$a^0=1$ for every real number $a$.', '$a^0=1$ untuk setiap bilangan real $a$.'),
              L('$\\sqrt{x^2}=x$ for every real number $x$.', '$\\sqrt{x^2}=x$ untuk setiap bilangan real $x$.'),
              L('$(a+b)^2=a^2+b^2$.', '$(a+b)^2=a^2+b^2$.'),
              L('$2^{-3}=\\frac{1}{8}$.', '$2^{-3}=\\frac{1}{8}$.'),
              L('$\\sqrt{18}=3\\sqrt{2}$.', '$\\sqrt{18}=3\\sqrt{2}$.'),
            ],
            answer: [false, false, false, true, true],
            explain: L(
              '$a^0=1$ only for $a\\neq0$. $\\sqrt{x^2}=|x|$, which is $-x$ when $x<0$. $(a+b)^2=a^2+2ab+b^2$. $2^{-3}=\\frac18$. $\\sqrt{18}=\\sqrt{9\\cdot2}=3\\sqrt{2}$.',
              '$a^0=1$ hanya untuk $a\\neq0$. $\\sqrt{x^2}=|x|$, yaitu $-x$ bila $x<0$. $(a+b)^2=a^2+2ab+b^2$. $2^{-3}=\\frac18$. $\\sqrt{18}=\\sqrt{9\\cdot2}=3\\sqrt{2}$.',
            ),
            hint: L('Try a counterexample: a negative $x$, or $a=0$, or $a=b=1$.', 'Coba contoh penyangkal: $x$ negatif, atau $a=0$, atau $a=b=1$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the expressions equal to $\\frac{1}{16}$.', 'Pilih **semua** ekspresi yang sama dengan $\\frac{1}{16}$.'),
            options: [L('$2^{-4}$', '$2^{-4}$'), L('$4^{-2}$', '$4^{-2}$'), L('$\\left(\\frac{1}{2}\\right)^4$', '$\\left(\\frac{1}{2}\\right)^4$'), L('$-2^4$', '$-2^4$'), L('$2^{-3}$', '$2^{-3}$')],
            answer: [0, 1, 2],
            explain: L(
              '$2^{-4}=\\frac1{16}$, $4^{-2}=\\frac1{4^2}=\\frac1{16}$ and $\\left(\\frac12\\right)^4=\\frac1{16}$. But $-2^4=-16$ and $2^{-3}=\\frac18$.',
              '$2^{-4}=\\frac1{16}$, $4^{-2}=\\frac1{4^2}=\\frac1{16}$, dan $\\left(\\frac12\\right)^4=\\frac1{16}$. Tetapi $-2^4=-16$ dan $2^{-3}=\\frac18$.',
            ),
            hint: L('Turn each into a fraction and compare.', 'Ubah masing-masing menjadi pecahan lalu bandingkan.'),
          },
        },
        {
          kind: 'activity',
          title: L('Scientific notation', 'Notasi ilmiah'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('Move the decimal point until one non-zero digit is left of it.', 'Geser koma desimal sampai tersisa satu angka bukan nol di kirinya.'),
              L('The point moves 4 places to the right, so the exponent is negative.', 'Koma bergeser 4 tempat ke kanan, jadi eksponennya negatif.'),
            ],
            explain: L('$0.00045=4.5\\times10^{-4}$: four places to the right.', '$0{,}00045=4{,}5\\times10^{-4}$: empat tempat ke kanan.'),
            prompt: L('Find $k$.', 'Tentukan $k$.'),
            given: { en: String.raw`0.00045=4.5\times10^{k}`, id: String.raw`0{,}00045=4{,}5\times10^{k}` },
            blanks: [{ label: 'k =', answer: -4 }],
          },
        },
        {
          kind: 'activity',
          title: L('Add radicals', 'Jumlahkan bentuk akar'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('Simplify each root first: $\\sqrt{50}=5\\sqrt{2}$.', 'Sederhanakan tiap akar dulu: $\\sqrt{50}=5\\sqrt{2}$.'),
              L('$\\sqrt{8}=2\\sqrt{2}$. Now add $5\\sqrt{2}+2\\sqrt{2}$.', '$\\sqrt{8}=2\\sqrt{2}$. Sekarang jumlahkan $5\\sqrt{2}+2\\sqrt{2}$.'),
            ],
            explain: L('$\\sqrt{50}+\\sqrt{8}=5\\sqrt{2}+2\\sqrt{2}=7\\sqrt{2}$.', '$\\sqrt{50}+\\sqrt{8}=5\\sqrt{2}+2\\sqrt{2}=7\\sqrt{2}$.'),
            prompt: L('Find $a$.', 'Tentukan $a$.'),
            given: String.raw`\sqrt{50}+\sqrt{8}=a\sqrt{2}`,
            blanks: [{ label: 'a =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which one is different?', 'Mana yang berbeda?'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('Which of these is **not** equal to 8?', 'Mana dari ini yang **tidak** sama dengan 8?'),
            options: [L('$2^3$', '$2^3$'), L('$\\sqrt{64}$', '$\\sqrt{64}$'), L('$4^{3/2}$', '$4^{3/2}$'), L('$8^{2/3}$', '$8^{2/3}$')],
            answer: 3,
            explain: L(
              '$2^3=8$, $\\sqrt{64}=8$ and $4^{3/2}=\\left(\\sqrt4\\right)^3=2^3=8$. But $8^{2/3}=\\left(\\sqrt[3]{8}\\right)^2=2^2=4$.',
              '$2^3=8$, $\\sqrt{64}=8$, dan $4^{3/2}=\\left(\\sqrt4\\right)^3=2^3=8$. Tetapi $8^{2/3}=\\left(\\sqrt[3]{8}\\right)^2=2^2=4$.',
            ),
            hint: L('For $a^{m/n}$ take the $n$-th root first, then the power $m$.', 'Untuk $a^{m/n}$ ambil akar pangkat $n$ dulu, lalu pangkat $m$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Combine the laws', 'Gabungkan hukum-hukumnya'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [
              L('Inside the bracket the product law gives one power of 2.', 'Di dalam kurung, hukum perkalian memberi satu pangkat dari 2.'),
              L('$2^3\\cdot2^{-1}=2^2$. Then square it.', '$2^3\\cdot2^{-1}=2^2$. Lalu kuadratkan.'),
            ],
            explain: L('$2^3\\cdot2^{-1}=2^{2}$, and $\\left(2^2\\right)^2=2^{4}$, so $k=4$.', '$2^3\\cdot2^{-1}=2^{2}$, dan $\\left(2^2\\right)^2=2^{4}$, sehingga $k=4$.'),
            prompt: L('Find $k$.', 'Tentukan $k$.'),
            given: String.raw`\left(2^{3}\cdot2^{-1}\right)^{2}=2^{k}`,
            blanks: [{ label: 'k =', answer: 4 }],
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: exponents and radicals at a glance', 'Ringkasan: eksponen dan akar sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Exponent:** $a^n$ is $n$ factors of $a$; the base is $a$ and the exponent is $n$.
- **Five laws:** $a^ma^n=a^{m+n}$, $\dfrac{a^m}{a^n}=a^{m-n}$, $(a^m)^n=a^{mn}$, $(ab)^n=a^nb^n$, $\left(\dfrac ab\right)^n=\dfrac{a^n}{b^n}$.
- **Forced values:** $a^0=1$ ($a\neq0$), $a^{-n}=\dfrac1{a^n}$, $a^{1/n}=\sqrt[n]{a}$, $a^{m/n}=\left(\sqrt[n]{a}\right)^m$.
- **Roots:** $\sqrt{x^2}=|x|$; an even root of a negative number is not real; $\sqrt{a+b}\neq\sqrt{a}+\sqrt{b}$.
- **Simplify** by taking groups of $n$ equal prime factors out of an $n$-th root; **rationalize** with the root or the conjugate.
- **Equations:** equal bases give equal exponents; check every radical solution.
- **Scientific notation:** $a\times10^k$ with $1\le a<10$; in code use ´**´, not ´^´.`,
            T`- **Eksponen:** $a^n$ adalah $n$ faktor $a$; basisnya $a$ dan eksponennya $n$.
- **Lima hukum:** $a^ma^n=a^{m+n}$, $\dfrac{a^m}{a^n}=a^{m-n}$, $(a^m)^n=a^{mn}$, $(ab)^n=a^nb^n$, $\left(\dfrac ab\right)^n=\dfrac{a^n}{b^n}$.
- **Nilai yang dipaksakan:** $a^0=1$ ($a\neq0$), $a^{-n}=\dfrac1{a^n}$, $a^{1/n}=\sqrt[n]{a}$, $a^{m/n}=\left(\sqrt[n]{a}\right)^m$.
- **Akar:** $\sqrt{x^2}=|x|$; akar genap dari bilangan negatif bukan bilangan real; $\sqrt{a+b}\neq\sqrt{a}+\sqrt{b}$.
- **Sederhanakan** dengan mengeluarkan kelompok berisi $n$ faktor prima yang sama dari akar pangkat $n$; **rasionalkan** dengan akarnya atau bentuk sekawannya.
- **Persamaan:** basis sama berarti eksponen sama; periksa setiap penyelesaian akar.
- **Notasi ilmiah:** $a\times10^k$ dengan $1\le a<10$; dalam kode pakai ´**´, bukan ´^´.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Exponent (power)', 'Eksponen (pangkat)'), definition: L('The small raised number that says how many times the base is multiplied by itself, as the 5 in 2 to the power 5.', 'Bilangan kecil di atas yang menyatakan berapa kali basis dikalikan dengan dirinya sendiri, seperti 5 pada 2 pangkat 5.') },
    { term: L('Base', 'Basis (bilangan pokok)'), definition: L('The number that is multiplied by itself in a power, as the 2 in 2 to the power 5.', 'Bilangan yang dikalikan dengan dirinya sendiri dalam sebuah pangkat, seperti 2 pada 2 pangkat 5.') },
    { term: L('Radical (root)', 'Akar (radikal)'), definition: L('The n-th root of a number is the value that gives that number when raised to the power n, written with the radical sign.', 'Akar pangkat n dari sebuah bilangan adalah nilai yang menghasilkan bilangan itu bila dipangkatkan n, ditulis dengan tanda akar.') },
    { term: L('Radicand', 'Radikan'), definition: L('The number written under the radical sign, such as 72 in the square root of 72.', 'Bilangan yang ditulis di bawah tanda akar, seperti 72 pada akar kuadrat 72.') },
    { term: L('Index', 'Indeks akar'), definition: L('The small number on the radical sign that says which root is taken; 2 is a square root and 3 is a cube root.', 'Bilangan kecil pada tanda akar yang menyatakan akar mana yang diambil; 2 adalah akar kuadrat dan 3 adalah akar pangkat tiga.') },
    { term: L('Principal square root', 'Akar kuadrat utama'), definition: L('The non-negative square root, which is what the radical sign means: the square root of 9 is 3, not plus or minus 3.', 'Akar kuadrat yang tidak negatif, yaitu arti tanda akar: akar kuadrat dari 9 adalah 3, bukan plus atau minus 3.') },
    { term: L('Perfect square', 'Kuadrat sempurna'), definition: L('A whole number that is the square of a whole number, such as 1, 4, 9, 16 and 25.', 'Bilangan bulat yang merupakan kuadrat dari bilangan bulat, seperti 1, 4, 9, 16, dan 25.') },
    { term: L('Rational exponent', 'Eksponen rasional (pangkat pecahan)'), definition: L('A fractional exponent m over n, meaning the n-th root of the base raised to the power m.', 'Eksponen pecahan m per n, yang berarti akar pangkat n dari basis dipangkatkan m.') },
    { term: L('Conjugate', 'Bentuk sekawan'), definition: L('For p plus the square root of q, the expression p minus the square root of q; their product has no root.', 'Untuk p ditambah akar q, ekspresi p dikurangi akar q; hasil kali keduanya tidak memuat akar.') },
    { term: L('Rationalizing the denominator', 'Merasionalkan penyebut'), definition: L('Multiplying the top and bottom of a fraction by a number that removes the root from the denominator.', 'Mengalikan pembilang dan penyebut sebuah pecahan dengan bilangan yang menghilangkan akar dari penyebut.') },
    { term: L('Scientific notation', 'Notasi ilmiah (bentuk baku)'), definition: L('A way of writing a number as a times 10 to the power k, with a at least 1 and less than 10.', 'Cara menulis bilangan sebagai a kali 10 pangkat k, dengan a sekurang-kurangnya 1 dan kurang dari 10.') },
    { term: L('Extraneous solution', 'Penyelesaian asing'), definition: L('A value that solves the equation after squaring both sides but fails in the original equation.', 'Nilai yang menyelesaikan persamaan setelah kedua ruas dikuadratkan tetapi gagal pada persamaan semula.') },
  ],

  howTo: [
    {
      name: L('How to simplify a radical', 'Cara menyederhanakan bentuk akar'),
      description: L('Take every group of n equal prime factors out of an n-th root.', 'Keluarkan setiap kelompok berisi n faktor prima yang sama dari akar pangkat n.'),
      steps: [
        { name: L('Factor into primes', 'Faktorkan menjadi bilangan prima'), text: L('Write the radicand as a product of primes, for example 72 = 2 × 2 × 2 × 3 × 3.', 'Tulis radikan sebagai hasil kali bilangan prima, misalnya 72 = 2 × 2 × 2 × 3 × 3.') },
        { name: L('Group equal primes', 'Kelompokkan bilangan prima yang sama'), text: L('Group equal primes in sets as large as the index, pairs for a square root.', 'Kelompokkan bilangan prima yang sama dalam himpunan sebesar indeks, berpasangan untuk akar kuadrat.') },
        { name: L('Take one out for each group', 'Keluarkan satu untuk setiap kelompok'), text: L('Take one prime out of the root for each group; primes without a partner stay inside.', 'Keluarkan satu bilangan prima dari akar untuk setiap kelompok; yang tanpa pasangan tetap di dalam.') },
        { name: L('Multiply what came out', 'Kalikan yang keluar'), text: L('Multiply the numbers that came out: the square root of 72 is 2 × 3 times the square root of 2, which is 6 times the square root of 2.', 'Kalikan bilangan yang keluar: akar kuadrat 72 adalah 2 × 3 kali akar kuadrat 2, yaitu 6 kali akar kuadrat 2.') },
      ],
    },
    {
      name: L('How to rationalize a denominator', 'Cara merasionalkan penyebut'),
      description: L('Remove the root from the bottom of a fraction without changing its value.', 'Hilangkan akar dari penyebut sebuah pecahan tanpa mengubah nilainya.'),
      steps: [
        { name: L('Choose the multiplier', 'Pilih pengalinya'), text: L('Use the root itself when the bottom is a single root, and the conjugate when the bottom is a sum or a difference.', 'Pakai akarnya sendiri bila penyebut berupa satu akar, dan bentuk sekawan bila penyebut berupa jumlah atau selisih.') },
        { name: L('Multiply top and bottom', 'Kalikan pembilang dan penyebut'), text: L('Multiply the top and the bottom by it; the value of the fraction does not change.', 'Kalikan pembilang dan penyebut dengannya; nilai pecahan tidak berubah.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('Simplify the result and cancel any common factor, for example 6 over the square root of 3 becomes 2 times the square root of 3.', 'Sederhanakan hasilnya dan coret faktor persekutuan, misalnya 6 per akar 3 menjadi 2 kali akar 3.') },
      ],
    },
    {
      name: L('How to evaluate a fractional exponent', 'Cara menghitung eksponen pecahan'),
      description: L('Evaluate a to the power m over n by taking a root and then a power.', 'Hitung a pangkat m per n dengan mengambil akar lalu memangkatkan.'),
      steps: [
        { name: L('Take the root', 'Ambil akarnya'), text: L('Take the n-th root of the base, where n is the denominator of the exponent.', 'Ambil akar pangkat n dari basis, dengan n penyebut eksponen.') },
        { name: L('Raise to the power', 'Pangkatkan'), text: L('Raise the result to the power m, the numerator of the exponent.', 'Pangkatkan hasilnya dengan m, pembilang eksponen.') },
        { name: L('Reciprocal if negative', 'Kebalikan bila negatif'), text: L('If the exponent is negative, take the reciprocal of the result.', 'Bila eksponennya negatif, ambil kebalikan dari hasilnya.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an exponent?', 'Apa itu eksponen?'),
      a: L(
        'An exponent is the small raised number in a power such as 2 to the power 5. It tells you how many times the base is used as a factor, so 2 to the power 5 is 2 times 2 times 2 times 2 times 2, which is 32.',
        'Eksponen adalah bilangan kecil di atas dalam sebuah pangkat seperti 2 pangkat 5. Ia menyatakan berapa kali basis dipakai sebagai faktor, sehingga 2 pangkat 5 adalah 2 kali 2 kali 2 kali 2 kali 2, yaitu 32.',
      ),
    },
    {
      q: L('What does a negative exponent mean?', 'Apa arti eksponen negatif?'),
      a: L(
        'A negative exponent means the reciprocal of the power with the positive exponent: 2 to the power minus 3 is 1 over 2 cubed, which is 1/8. It does not make the number negative. The rule keeps the laws of exponents working.',
        'Eksponen negatif berarti kebalikan dari pangkat dengan eksponen positif: 2 pangkat minus 3 adalah 1 per 2 pangkat tiga, yaitu 1/8. Ia tidak membuat bilangannya negatif. Aturan ini menjaga hukum eksponen tetap berlaku.',
      ),
    },
    {
      q: L('Why is any number to the power 0 equal to 1?', 'Mengapa bilangan apa pun pangkat 0 sama dengan 1?'),
      a: L(
        'Because the product law must keep working. Multiplying a to the power m by a to the power 0 gives a to the power m plus 0, which is a to the power m again, so a to the power 0 has to be 1. This holds for every a except 0.',
        'Karena hukum perkalian harus tetap berlaku. Mengalikan a pangkat m dengan a pangkat 0 memberi a pangkat m ditambah 0, yaitu a pangkat m lagi, sehingga a pangkat 0 harus 1. Ini berlaku untuk setiap a kecuali 0.',
      ),
    },
    {
      q: L('What is 0 to the power 0?', 'Berapakah 0 pangkat 0?'),
      a: L(
        'In algebra it is undefined, because the rule that anything to the power 0 is 1 and the rule that 0 to a positive power is 0 disagree. In programming and combinatorics it is defined as 1 by convention, and Python and JavaScript both return 1.',
        'Dalam aljabar ia tidak terdefinisi, karena aturan bahwa apa pun pangkat 0 adalah 1 dan aturan bahwa 0 pangkat bilangan positif adalah 0 saling bertentangan. Dalam pemrograman dan kombinatorika ia didefinisikan sebagai 1 menurut kesepakatan, dan Python serta JavaScript sama-sama mengembalikan 1.',
      ),
    },
    {
      q: L('What is the square root of a negative number?', 'Berapakah akar kuadrat dari bilangan negatif?'),
      a: L(
        'It is not a real number, because no real number squared is negative. Mathematicians define the imaginary unit i with i squared equal to minus 1, so the square root of minus 4 is 2i. These belong to the complex numbers.',
        'Itu bukan bilangan real, karena tidak ada bilangan real yang kuadratnya negatif. Para matematikawan mendefinisikan satuan imajiner i dengan i kuadrat sama dengan minus 1, sehingga akar kuadrat dari minus 4 adalah 2i. Bilangan ini termasuk bilangan kompleks.',
      ),
    },
    {
      q: L('Why is the square root of x squared the absolute value of x?', 'Mengapa akar kuadrat dari x kuadrat adalah nilai mutlak x?'),
      a: L(
        'The square root sign always gives the non-negative root. If x is negative, such as minus 5, then x squared is 25 and its square root is 5, which is minus x. So the answer is x when x is at least 0 and minus x otherwise: the absolute value of x.',
        'Tanda akar kuadrat selalu memberi akar yang tidak negatif. Jika x negatif, misalnya minus 5, maka x kuadrat adalah 25 dan akar kuadratnya 5, yaitu minus x. Jadi jawabannya x bila x sekurang-kurangnya 0 dan minus x bila tidak: nilai mutlak x.',
      ),
    },
    {
      q: L('How do you simplify a square root?', 'Bagaimana menyederhanakan akar kuadrat?'),
      a: L(
        'Factor the number under the root into primes, pair up equal primes, take one of each pair out of the root, and multiply what came out. For 72 that is 2 times 2 times 2 times 3 times 3, so the square root of 72 is 2 times 3 times the square root of 2, or 6 root 2.',
        'Faktorkan bilangan di bawah akar menjadi bilangan prima, pasangkan bilangan prima yang sama, keluarkan satu dari tiap pasangan dari akar, lalu kalikan yang keluar. Untuk 72 itu 2 kali 2 kali 2 kali 3 kali 3, sehingga akar kuadrat 72 adalah 2 kali 3 kali akar 2, atau 6 akar 2.',
      ),
    },
    {
      q: L('How do you rationalize a denominator?', 'Bagaimana merasionalkan penyebut?'),
      a: L(
        'Multiply the top and bottom of the fraction by a number that removes the root from the bottom. For a single root such as 6 over root 3 multiply by root 3 to get 2 root 3. For a sum such as 1 over 1 plus root 2, multiply by the conjugate, 1 minus root 2.',
        'Kalikan pembilang dan penyebut pecahan dengan bilangan yang menghilangkan akar dari penyebut. Untuk satu akar seperti 6 per akar 3, kalikan dengan akar 3 untuk mendapat 2 akar 3. Untuk jumlah seperti 1 per 1 ditambah akar 2, kalikan dengan bentuk sekawannya, 1 dikurangi akar 2.',
      ),
    },
    {
      q: L('What does a fractional exponent mean?', 'Apa arti eksponen pecahan?'),
      a: L(
        'A fractional exponent is a root combined with a power. The exponent 1 over n means the n-th root, and m over n means take the n-th root and then raise it to the power m. So 8 to the power 2 over 3 is the cube root of 8, which is 2, squared, which is 4.',
        'Eksponen pecahan adalah akar yang digabung dengan pangkat. Eksponen 1 per n berarti akar pangkat n, dan m per n berarti ambil akar pangkat n lalu pangkatkan dengan m. Jadi 8 pangkat 2 per 3 adalah akar pangkat tiga dari 8, yaitu 2, dikuadratkan, yaitu 4.',
      ),
    },
    {
      q: L('Is the square root of 2 plus the square root of 3 equal to the square root of 5?', 'Apakah akar 2 ditambah akar 3 sama dengan akar 5?'),
      a: L(
        'No. The square root of a sum is not the sum of the square roots. The left side is about 1.414 plus 1.732, which is 3.146, while the square root of 5 is about 2.236. Roots can be added only when they are like radicals.',
        'Tidak. Akar dari sebuah jumlah bukan jumlah dari akar-akarnya. Ruas kiri sekitar 1,414 ditambah 1,732, yaitu 3,146, sedangkan akar 5 sekitar 2,236. Akar hanya dapat dijumlahkan bila senama.',
      ),
    },
    {
      q: L('What is the difference between (−2)² and −2²?', 'Apa beda (−2)² dan −2²?'),
      a: L(
        'Minus 2 in brackets, squared, is minus 2 times minus 2, which is 4. Without brackets the exponent applies only to the 2, so minus 2 squared is minus (2 times 2), which is minus 4. The brackets decide what is being squared.',
        'Minus 2 dalam kurung, dikuadratkan, adalah minus 2 kali minus 2, yaitu 4. Tanpa kurung, eksponen hanya berlaku untuk 2, sehingga minus 2 kuadrat adalah minus (2 kali 2), yaitu minus 4. Kurunglah yang menentukan apa yang dikuadratkan.',
      ),
    },
    {
      q: L('How do you write a number in scientific notation?', 'Bagaimana menulis bilangan dalam notasi ilmiah?'),
      a: L(
        'Move the decimal point until exactly one non-zero digit is to its left, then multiply by 10 raised to the number of places you moved. Moving left gives a positive exponent and moving right a negative one, so 45,000 is 4.5 times 10 to the 4 and 0.00045 is 4.5 times 10 to the minus 4.',
        'Geser koma desimal sampai tepat satu angka bukan nol berada di kirinya, lalu kalikan dengan 10 pangkat banyaknya tempat yang digeser. Menggeser ke kiri memberi eksponen positif dan ke kanan memberi eksponen negatif, sehingga 45.000 adalah 4,5 kali 10 pangkat 4 dan 0,00045 adalah 4,5 kali 10 pangkat minus 4.',
      ),
    },
    {
      q: L('How do you calculate a power in Python?', 'Bagaimana menghitung pangkat di Python?'),
      a: L(
        'Use the double asterisk operator, which gives 1024 for two to the power ten, or the pow function. The caret is not a power in Python: it is bitwise XOR. For square roots use math.sqrt, and for the whole-number part of a square root use math.isqrt.',
        'Pakai operator dua tanda bintang, yang memberi 1024 untuk dua pangkat sepuluh, atau fungsi pow. Tanda sisipan bukan pangkat di Python: itu XOR bitwise. Untuk akar kuadrat pakai math.sqrt, dan untuk bagian bulat dari akar kuadrat pakai math.isqrt.',
      ),
    },
    {
      q: L('Are all radicals irrational numbers?', 'Apakah semua bentuk akar adalah bilangan irasional?'),
      a: L(
        'No. A root of a whole number is irrational only when the number is not a perfect power of that index. The square root of 16 is 4 and the cube root of 27 is 3, both rational, while the square root of 2 and the cube root of 5 are irrational.',
        'Tidak. Akar dari bilangan bulat irasional hanya bila bilangan itu bukan pangkat sempurna dari indeksnya. Akar kuadrat 16 adalah 4 dan akar pangkat tiga 27 adalah 3, keduanya rasional, sedangkan akar kuadrat 2 dan akar pangkat tiga 5 irasional.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Principles of Mathematical Analysis (3rd ed.), chapter 1 (the existence of n-th roots of positive reals)', author: 'Walter Rudin', year: 1976, source: 'McGraw-Hill' },
    { title: 'A History of Mathematical Notations', author: 'Florian Cajori', year: 1928, source: 'Open Court Publishing Company' },
    { title: 'La Géométrie', author: 'René Descartes', year: 1637 },
    { title: 'Behend und hübsch Rechnung durch die kunstreichen regeln Algebre, so gemeincklich die Coss genennt werden', author: 'Christoff Rudolff', year: 1525 },
    { title: 'The International System of Units (SI), 9th edition', author: 'Bureau International des Poids et Mesures', year: 2019, source: 'BIPM', url: 'https://www.bipm.org/en/publications/si-brochure' },
    { title: 'The Python Language Reference: the power operator', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/reference/expressions.html#the-power-operator' },
    { title: 'ECMAScript Language Specification: the exponentiation operator', author: 'Ecma International', source: 'tc39.es', url: 'https://tc39.es/ecma262/#sec-exp-operator' },
  ],

  related: ['real-numbers', 'algebraic-expressions', 'quadrilaterals'],
}
