import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './rational-numbers.meta'

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
    T`**A rational number is any number that can be written as a fraction $\dfrac{p}{q}$ of two integers with $q\neq0$, such as $\dfrac34$, $-\dfrac72$ or $5=\dfrac51$.** Many fractions name the same number ($\frac68=\frac34$), so you compare, add and multiply them after bringing them to a common form. The decimal expansion of a rational number either terminates ($\frac38=0.375$) or eventually repeats periodically ($\frac13=0.\overline{3}$).`,
    T`**Bilangan rasional adalah bilangan yang dapat ditulis sebagai pecahan $\dfrac{p}{q}$ dari dua bilangan bulat dengan $q\neq0$, seperti $\dfrac34$, $-\dfrac72$, atau $5=\dfrac51$.** Banyak pecahan menamai bilangan yang sama ($\frac68=\frac34$), sehingga kamu membandingkan, menjumlahkan, dan mengalikannya setelah membawanya ke bentuk yang sama. Ekspansi desimal bilangan rasional berakhir ($\frac38=0{,}375$) atau akhirnya berulang secara periodik ($\frac13=0{,}\overline{3}$).`,
  ),

  keyPoints: [
    L(
      T`A rational number is a ratio of integers; every integer is rational ($n=\frac n1$), and so is every fraction, terminating decimal and repeating decimal.`,
      T`Bilangan rasional adalah perbandingan bilangan bulat; setiap bilangan bulat adalah rasional ($n=\frac n1$), begitu pula setiap pecahan, desimal berakhir, dan desimal berulang.`,
    ),
    L(
      T`$\frac ab=\frac cd$ exactly when $ad=bc$; dividing the top and the bottom by their GCD gives the unique lowest-terms form.`,
      T`$\frac ab=\frac cd$ tepat bila $ad=bc$; membagi pembilang dan penyebut dengan FPB-nya menghasilkan bentuk paling sederhana yang tunggal.`,
    ),
    L(
      T`To compare positive fractions, cross-multiply: $\frac ab<\frac cd$ exactly when $ad<cb$.`,
      T`Untuk membandingkan pecahan positif, kalikan silang: $\frac ab<\frac cd$ tepat bila $ad<cb$.`,
    ),
    L(
      T`Add and subtract over a common denominator, multiply tops and bottoms, and divide by multiplying by the reciprocal.`,
      T`Jumlahkan dan kurangkan di atas penyebut sama, kalikan pembilang dan penyebut, dan bagi dengan mengalikan kebalikannya.`,
    ),
    L(
      T`A fraction in lowest terms has a terminating decimal exactly when its denominator has no prime factor except 2 and 5; otherwise the decimal eventually repeats periodically.`,
      T`Pecahan paling sederhana punya desimal berakhir tepat bila penyebutnya tidak punya faktor prima selain 2 dan 5; jika tidak, desimalnya akhirnya berulang secara periodik.`,
    ),
    L(
      T`Between any two rational numbers there is another, so there is no next fraction after $\frac12$.`,
      T`Di antara dua bilangan rasional mana pun ada bilangan rasional lain, sehingga tidak ada pecahan berikutnya setelah $\frac12$.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what are they */
    {
      id: 'what-are-rational-numbers',
      heading: L('What is a rational number?', 'Apa itu bilangan rasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A rational number is a number that can be written as $\dfrac{p}{q}$ where $p$ and $q$ are integers and $q\neq0$.** The set of them is written $\mathbb{Q}$, for "quotient", and the word *rational* comes from *ratio*, not from "sensible".

In $\frac34$ the top number $p$ is the **numerator** and the bottom number $q$ is the **denominator**: the denominator says into how many equal parts the whole is cut, and the numerator says how many of them are taken.

Several things follow at once:

- **Every integer is rational.** $5=\frac51$ and $-3=\frac{-3}{1}$. The [integers](article:integers) are the rational numbers whose denominator can be 1.
- **A number has many fractions.** $\frac12$, $\frac24$ and $\frac{50}{100}$ are different ways of writing one number. A *fraction* is a way of writing; a *rational number* is the value it names.
- **The sign belongs to the whole fraction.** $-\frac34=\frac{-3}{4}=\frac{3}{-4}$, and by habit the minus is written in front or on the top.
- **The denominator is never 0.** $\frac50$ does not name a number.
- **Kinds of fraction.** A *proper* fraction is smaller than 1 in size ($\frac34$), an *improper* one is not ($\frac{17}{5}$), and a *mixed number* writes an improper one as a whole part plus a proper part ($3\frac25$).

The rational numbers are closed under all four operations: add, subtract or multiply two of them, or divide by a non-zero one, and the answer is rational again. That is what the integers could not do for division, and it is why fractions were invented. They are not the whole number line, though: $\sqrt2$ and $\pi$ are real numbers that are not rational, which the article on [irrational numbers](article:irrational-numbers) explains, with the [real numbers](article:real-numbers#irrational-numbers) article as the overview.

Languages say fractions in their own order. In English the numerator comes first ("three quarters"), while Chinese reads the denominator first: [三分之一, "of three parts, one"](article:chinese-numbers#fractions-decimals-dates).`,
            T`**Bilangan rasional adalah bilangan yang dapat ditulis sebagai $\dfrac{p}{q}$ dengan $p$ dan $q$ bilangan bulat dan $q\neq0$.** Himpunannya ditulis $\mathbb{Q}$, dari kata "quotient" (hasil bagi), dan kata *rasional* berasal dari *rasio* (perbandingan), bukan dari "masuk akal".

Pada $\frac34$ bilangan atas $p$ adalah **pembilang** dan bilangan bawah $q$ adalah **penyebut**: penyebut menyatakan keseluruhan dipotong menjadi berapa bagian yang sama, dan pembilang menyatakan berapa bagian yang diambil.

Beberapa hal langsung mengikutinya:

- **Setiap bilangan bulat adalah rasional.** $5=\frac51$ dan $-3=\frac{-3}{1}$. [Bilangan bulat](article:integers) adalah bilangan rasional yang penyebutnya dapat 1.
- **Satu bilangan punya banyak pecahan.** $\frac12$, $\frac24$, dan $\frac{50}{100}$ adalah cara berbeda menulis satu bilangan. *Pecahan* adalah cara menulis; *bilangan rasional* adalah nilai yang dinamainya.
- **Tanda milik seluruh pecahan.** $-\frac34=\frac{-3}{4}=\frac{3}{-4}$, dan menurut kebiasaan minus ditulis di depan atau di atas.
- **Penyebut tidak pernah 0.** $\frac50$ tidak menamai bilangan apa pun.
- **Jenis pecahan.** Pecahan *wajar* ukurannya kurang dari 1 ($\frac34$), pecahan *tak wajar* tidak demikian ($\frac{17}{5}$), dan *bilangan campuran* menulis pecahan tak wajar sebagai bagian bulat ditambah pecahan wajar ($3\frac25$).

Bilangan rasional tertutup terhadap keempat operasi: jumlahkan, kurangkan, atau kalikan dua di antaranya, atau bagi dengan yang bukan nol, dan hasilnya rasional lagi. Itulah yang tidak dapat dilakukan bilangan bulat untuk pembagian, dan itulah sebabnya pecahan diciptakan. Namun bilangan rasional bukan seluruh garis bilangan: $\sqrt2$ dan $\pi$ adalah bilangan real yang tidak rasional, seperti dijelaskan artikel [bilangan irasional](article:irrational-numbers), dengan artikel [bilangan real](article:real-numbers#irrational-numbers) sebagai gambaran umum.

Bahasa-bahasa menyebut pecahan dengan urutannya sendiri. Dalam bahasa Inggris pembilang disebut lebih dulu ("three quarters"), sedangkan bahasa Mandarin membaca penyebut lebih dulu: [三分之一, "dari tiga bagian, satu"](article:chinese-numbers#fractions-decimals-dates).`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: which are rational?', 'Coba: mana yang rasional?'),
          step: {
            kind: 'multi',
            id: 'a1',
            prompt: L('Choose **all** the rational numbers.', 'Pilih **semua** bilangan rasional.'),
            options: [L('$3$', '$3$'), L('$-\\frac72$', '$-\\frac72$'), L('$0.75$', '$0{,}75$'), L('$\\frac10$', '$\\frac10$'), L('$\\sqrt2$', '$\\sqrt2$'), L('$0.\\overline{3}$', '$0{,}\\overline{3}$')],
            answer: [0, 1, 2, 5],
            explain: L(
              '$3=\\frac31$, $-\\frac72$ and $0.75=\\frac34$ are ratios of integers, and $0.\\overline{3}=\\frac13$. $\\frac10$ has denominator 0, so it is not a number at all, and $\\sqrt2$ is irrational.',
              '$3=\\frac31$, $-\\frac72$, dan $0{,}75=\\frac34$ adalah perbandingan bilangan bulat, dan $0{,}\\overline{3}=\\frac13$. $\\frac10$ berpenyebut 0, sehingga bukan bilangan sama sekali, dan $\\sqrt2$ irasional.',
            ),
            hint: L('Can you write it as an integer over a non-zero integer?', 'Dapatkah kamu menulisnya sebagai bilangan bulat per bilangan bulat bukan nol?'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- equivalent */
    {
      id: 'equivalent-fractions',
      heading: L('How do you find equivalent fractions and simplify?', 'Bagaimana mencari pecahan senilai dan menyederhanakannya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Multiplying or dividing the numerator and the denominator by the same non-zero number gives an equivalent fraction, and dividing both by their greatest common divisor gives the lowest terms.** Two fractions are equal exactly when $\frac ab=\frac cd\iff ad=bc$: for example $\frac68=\frac34$ because $6\cdot4=24=8\cdot3$.

The picture is a bar cut into parts. Cut each part into $k$ equal pieces and the bar has $k$ times as many parts, with $k$ times as many shaded, yet the same amount is shaded. Move the sliders to see it.

**Simplifying** means finding the equivalent fraction with the smallest numbers, the *lowest terms*, in which the top and the bottom share no factor except 1. Divide both by their [greatest common divisor](article:integers#gcd-lcm):

$\dfrac{84}{126}$: the GCD of 84 and 126 is 42, so $\dfrac{84\div42}{126\div42}=\dfrac23$.

You may also cancel step by step, by any common factor, until nothing is left to cancel. The lowest-terms form is unique, so every route gives the same answer, and for two fractions in lowest terms $\frac ab=\frac cd$ only when $a=c$ and $b=d$.

**Cancel factors, never terms.** In $\frac{6}{8}=\frac{2\cdot3}{2\cdot4}$ the 2 is a factor of both, so it cancels. In $\frac{2+3}{2+4}$ the 2s are terms of a sum and do not cancel: the fraction is $\frac56$, not $\frac34$. The same care is needed with letters, as in the section on [algebraic fractions](article:algebraic-expressions#algebraic-fractions). Beware also of "canceling" digits: $\frac{16}{64}$ happens to equal $\frac14$ when you strike the 6s, and $\frac{19}{95}$, $\frac{26}{65}$ and $\frac{49}{98}$ do the same, but these four are coincidences and the method is wrong, so never rely on it.

Try any fraction below.`,
            T`**Mengalikan atau membagi pembilang dan penyebut dengan bilangan bukan nol yang sama menghasilkan pecahan senilai, dan membagi keduanya dengan faktor persekutuan terbesarnya menghasilkan bentuk paling sederhana.** Dua pecahan sama tepat bila $\frac ab=\frac cd\iff ad=bc$: misalnya $\frac68=\frac34$ karena $6\cdot4=24=8\cdot3$.

Gambarnya adalah batang yang dipotong menjadi bagian-bagian. Potong tiap bagian menjadi $k$ potong yang sama dan batang punya $k$ kali lebih banyak bagian, dengan $k$ kali lebih banyak yang diarsir, namun banyaknya yang diarsir tetap sama. Geser penggeser untuk melihatnya.

**Menyederhanakan** berarti mencari pecahan senilai dengan bilangan terkecil, yaitu *bentuk paling sederhana*, yang pembilang dan penyebutnya tidak punya faktor sama selain 1. Bagi keduanya dengan [faktor persekutuan terbesar](article:integers#gcd-lcm):

$\dfrac{84}{126}$: FPB dari 84 dan 126 adalah 42, sehingga $\dfrac{84\div42}{126\div42}=\dfrac23$.

Kamu juga boleh mencoret selangkah demi selangkah, dengan faktor sama apa pun, sampai tidak ada lagi yang dapat dicoret. Bentuk paling sederhana itu tunggal, sehingga setiap jalan memberi jawaban sama, dan untuk dua pecahan paling sederhana $\frac ab=\frac cd$ hanya bila $a=c$ dan $b=d$.

**Coret faktor, jangan pernah suku.** Pada $\frac{6}{8}=\frac{2\cdot3}{2\cdot4}$ angka 2 adalah faktor keduanya, sehingga dicoret. Pada $\frac{2+3}{2+4}$ angka 2 adalah suku dari sebuah jumlah dan tidak dicoret: pecahannya $\frac56$, bukan $\frac34$. Ketelitian yang sama diperlukan untuk huruf, seperti pada bagian [pecahan aljabar](article:algebraic-expressions#algebraic-fractions). Waspadai juga "mencoret" angka: $\frac{16}{64}$ kebetulan sama dengan $\frac14$ bila kedua angka 6 dicoret, dan $\frac{19}{95}$, $\frac{26}{65}$, serta $\frac{49}{98}$ juga demikian, tetapi keempatnya kebetulan dan caranya salah, jadi jangan pernah mengandalkannya.

Coba pecahan apa pun di bawah.`,
          ),
        },
        { kind: 'widget', name: 'fracbars' },
        { kind: 'widget', name: 'simplify' },
        {
          kind: 'activity',
          title: L('Try it: an equivalent fraction', 'Coba: pecahan senilai'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Divide the top and the bottom by the same number: $24\\div6=4$.', 'Bagi pembilang dan penyebut dengan bilangan yang sama: $24\\div6=4$.'),
              L('So divide $18$ by $6$ as well.', 'Jadi bagi $18$ dengan $6$ juga.'),
            ],
            explain: L('$\\frac{18}{24}=\\frac{18\\div6}{24\\div6}=\\frac34$, so $a=3$.', '$\\frac{18}{24}=\\frac{18\\div6}{24\\div6}=\\frac34$, sehingga $a=3$.'),
            prompt: L('Find $a$.', 'Tentukan $a$.'),
            given: String.raw`\frac{18}{24}=\frac{a}{4}`,
            blanks: [{ label: 'a =', answer: 3 }],
          },
        },
      ],
    },

    /* --------------------------------------------------------------- comparing */
    {
      id: 'compare-fractions',
      heading: L('How do you compare and order fractions?', 'Bagaimana membandingkan dan mengurutkan pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To compare two fractions with positive denominators, cross-multiply: $\frac ab<\frac cd$ exactly when $ad<cb$.** For $\frac35$ and $\frac58$: $3\cdot8=24$ and $5\cdot5=25$, and $24<25$, so $\frac35<\frac58$.

Why it works: rewrite both over the common denominator $bd$, giving $\frac{ad}{bd}$ and $\frac{cb}{bd}$. With equal denominators the larger top is the larger fraction.

Shortcuts, when they apply:

- **Same denominator:** the larger numerator wins, $\frac27<\frac57$.
- **Same numerator:** the larger denominator makes the smaller fraction, since the whole is cut into more pieces: $\frac13>\frac14$.
- **Benchmarks:** compare each with 0, $\frac12$ and 1. $\frac49<\frac12<\frac47$.
- **Negative fractions:** compare the sizes and reverse, as with integers. $\frac12<\frac23$ so $-\frac12>-\frac23$.

To order a list, put them on a number line or give them a common denominator. Between any two different rational numbers lies another: their average $\dfrac{1}{2}\left(\frac ab+\frac cd\right)$. So there is no "next" fraction after $\frac12$, and the rational numbers fill the line without gaps you could ever point to, though $\sqrt2$ shows that the line still holds more: see the [number line and density](article:real-numbers#number-line-density) in the article on real numbers. Compare any two below.`,
            T`**Untuk membandingkan dua pecahan berpenyebut positif, kalikan silang: $\frac ab<\frac cd$ tepat bila $ad<cb$.** Untuk $\frac35$ dan $\frac58$: $3\cdot8=24$ dan $5\cdot5=25$, dan $24<25$, sehingga $\frac35<\frac58$.

Mengapa berhasil: tulis keduanya di atas penyebut sama $bd$, menghasilkan $\frac{ad}{bd}$ dan $\frac{cb}{bd}$. Dengan penyebut sama, pembilang yang lebih besar adalah pecahan yang lebih besar.

Jalan pintas, bila berlaku:

- **Penyebut sama:** pembilang yang lebih besar menang, $\frac27<\frac57$.
- **Pembilang sama:** penyebut yang lebih besar membuat pecahan lebih kecil, karena keseluruhan dipotong menjadi lebih banyak bagian: $\frac13>\frac14$.
- **Patokan:** bandingkan masing-masing dengan 0, $\frac12$, dan 1. $\frac49<\frac12<\frac47$.
- **Pecahan negatif:** bandingkan ukurannya lalu balik, seperti pada bilangan bulat. $\frac12<\frac23$ sehingga $-\frac12>-\frac23$.

Untuk mengurutkan daftar, letakkan pada garis bilangan atau beri penyebut yang sama. Di antara dua bilangan rasional berbeda mana pun terdapat bilangan rasional lain: rata-ratanya $\dfrac{1}{2}\left(\frac ab+\frac cd\right)$. Jadi tidak ada pecahan "berikutnya" setelah $\frac12$, dan bilangan rasional memenuhi garis tanpa celah yang dapat kamu tunjuk, walaupun $\sqrt2$ menunjukkan bahwa garis itu masih memuat lebih banyak: lihat [garis bilangan dan kerapatan](article:real-numbers#number-line-density) pada artikel bilangan real. Bandingkan dua pecahan apa pun di bawah.`,
          ),
        },
        { kind: 'widget', name: 'ratcompare' },
        {
          kind: 'activity',
          title: L('Try it: order from least to greatest', 'Coba: urutkan dari yang terkecil'),
          step: {
            kind: 'order',
            id: 'a3',
            math: true,
            prompt: L('Put these fractions in order from least to greatest.', 'Urutkan pecahan ini dari yang terkecil ke terbesar.'),
            lines: {
              en: ['-\\frac12', '\\frac14', '\\frac13', '\\frac35', '\\frac34'],
              id: ['-\\frac12', '\\frac14', '\\frac13', '\\frac35', '\\frac34'],
            },
            explain: L('$-\\frac12$ is negative. As decimals the rest are $0.25$, $0.\\overline{3}$, $0.6$ and $0.75$.', '$-\\frac12$ negatif. Sebagai desimal, sisanya $0{,}25$, $0{,}\\overline{3}$, $0{,}6$, dan $0{,}75$.'),
            hint: L('Put the negative one first, then compare the rest with $\\frac12$ and with each other.', 'Taruh yang negatif paling awal, lalu bandingkan sisanya dengan $\\frac12$ dan satu sama lain.'),
          },
        },
        {
          kind: 'activity',
          title: L('Try it: a fraction in between', 'Coba: pecahan di antara'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('First $\\frac13+\\frac12$: use the common denominator 6.', 'Pertama $\\frac13+\\frac12$: pakai penyebut sama 6.'),
              L('$\\frac26+\\frac36=\\frac56$, then half of that.', '$\\frac26+\\frac36=\\frac56$, lalu setengahnya.'),
            ],
            explain: L('$\\frac13+\\frac12=\\frac56$, and half of $\\frac56$ is $\\frac{5}{12}$. It lies between $\\frac13=\\frac4{12}$ and $\\frac12=\\frac6{12}$.', '$\\frac13+\\frac12=\\frac56$, dan setengah dari $\\frac56$ adalah $\\frac{5}{12}$. Ia terletak antara $\\frac13=\\frac4{12}$ dan $\\frac12=\\frac6{12}$.'),
            prompt: L('Find the average of $\\frac13$ and $\\frac12$.', 'Tentukan rata-rata dari $\\frac13$ dan $\\frac12$.'),
            given: String.raw`\frac12\left(\frac13+\frac12\right)=\frac{a}{b}`,
            blanks: [
              { label: 'a =', answer: 5 },
              { label: 'b =', answer: 12 },
            ],
          },
        },
      ],
    },

    /* ------------------------------------------------------------ add, subtract */
    {
      id: 'add-subtract-fractions',
      heading: L('How do you add and subtract fractions?', 'Bagaimana menjumlahkan dan mengurangkan pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To add or subtract fractions, rewrite them over a common denominator, then add or subtract the numerators and keep the denominator: $\frac ac+\frac bc=\frac{a+b}{c}$.** You can only add parts that are the same size.

The best common denominator is the [least common multiple](article:integers#gcd-lcm) of the two denominators. For $\frac23+\frac34$ it is 12:

$\dfrac23+\dfrac34=\dfrac{8}{12}+\dfrac{9}{12}=\dfrac{17}{12}=1\dfrac{5}{12}$.

For a subtraction, $\dfrac56-\dfrac14=\dfrac{10}{12}-\dfrac{3}{12}=\dfrac{7}{12}$. If you use $b\cdot d$ instead of the least common multiple the answer is the same, but the numbers are larger and the result needs simplifying afterward.

**Never add the denominators.** $\frac12+\frac13$ is not $\frac25$: the denominators name the size of the pieces, and halves and thirds are different sizes. The right answer is $\frac36+\frac26=\frac56$. A check is that $\frac25=0.4$ is less than $\frac12$, but a sum of two positive numbers is larger than each of them.

**Mixed numbers.** Either add the whole parts and the fraction parts separately, or turn both into improper fractions first. For $2\frac13+1\frac12$: $2+1=3$ and $\frac13+\frac12=\frac56$, so $3\frac56$.

**Negative fractions** follow the sign rules of the integers: $\frac12-\frac34=\frac24-\frac34=-\frac14$.

Try your own pair below; it shows each line of the working.`,
            T`**Untuk menjumlahkan atau mengurangkan pecahan, tulis keduanya di atas penyebut sama, lalu jumlahkan atau kurangkan pembilangnya dan pertahankan penyebutnya: $\frac ac+\frac bc=\frac{a+b}{c}$.** Kamu hanya dapat menjumlahkan bagian yang sama besar.

Penyebut sama yang terbaik adalah [kelipatan persekutuan terkecil](article:integers#gcd-lcm) dari kedua penyebut. Untuk $\frac23+\frac34$ nilainya 12:

$\dfrac23+\dfrac34=\dfrac{8}{12}+\dfrac{9}{12}=\dfrac{17}{12}=1\dfrac{5}{12}$.

Untuk pengurangan, $\dfrac56-\dfrac14=\dfrac{10}{12}-\dfrac{3}{12}=\dfrac{7}{12}$. Jika kamu memakai $b\cdot d$ sebagai ganti kelipatan persekutuan terkecil, jawabannya sama, tetapi bilangannya lebih besar dan hasilnya perlu disederhanakan sesudahnya.

**Jangan pernah menjumlahkan penyebutnya.** $\frac12+\frac13$ bukan $\frac25$: penyebut menamai ukuran potongan, dan setengah serta sepertiga berukuran berbeda. Jawaban yang benar adalah $\frac36+\frac26=\frac56$. Pemeriksaannya, $\frac25=0{,}4$ kurang dari $\frac12$, padahal jumlah dua bilangan positif lebih besar daripada masing-masing.

**Bilangan campuran.** Jumlahkan bagian bulat dan bagian pecahan secara terpisah, atau ubah keduanya menjadi pecahan tak wajar lebih dulu. Untuk $2\frac13+1\frac12$: $2+1=3$ dan $\frac13+\frac12=\frac56$, sehingga $3\frac56$.

**Pecahan negatif** mengikuti aturan tanda bilangan bulat: $\frac12-\frac34=\frac24-\frac34=-\frac14$.

Coba pasangan buatanmu sendiri di bawah; alat itu menampilkan tiap baris langkahnya.`,
          ),
        },
        { kind: 'widget', name: 'ratops' },
        {
          kind: 'activity',
          title: L('Try it: add fractions', 'Coba: menjumlahkan pecahan'),
          step: {
            kind: 'math',
            id: 'a5',
            hints: [
              L('The least common multiple of 6 and 4 is 12.', 'Kelipatan persekutuan terkecil dari 6 dan 4 adalah 12.'),
              L('$\\frac16=\\frac2{12}$ and $\\frac34=\\frac9{12}$.', '$\\frac16=\\frac2{12}$ dan $\\frac34=\\frac9{12}$.'),
            ],
            explain: L('$\\frac16+\\frac34=\\frac{2}{12}+\\frac{9}{12}=\\frac{11}{12}$.', '$\\frac16+\\frac34=\\frac{2}{12}+\\frac{9}{12}=\\frac{11}{12}$.'),
            prompt: L('Find $a$ and $b$.', 'Tentukan $a$ dan $b$.'),
            given: String.raw`\frac16+\frac34=\frac{a}{b}`,
            blanks: [
              { label: 'a =', answer: 11 },
              { label: 'b =', answer: 12 },
            ],
          },
        },
      ],
    },

    /* ----------------------------------------------------------- multiply, divide */
    {
      id: 'multiply-divide-fractions',
      heading: L('How do you multiply and divide fractions?', 'Bagaimana mengalikan dan membagi pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To multiply fractions, multiply the numerators and multiply the denominators: $\frac ab\cdot\frac cd=\frac{ac}{bd}$; to divide, multiply by the reciprocal of the divisor: $\frac ab\div\frac cd=\frac ab\cdot\frac dc$.** No common denominator is needed for either.

Multiplying: $\dfrac34\cdot\dfrac23=\dfrac{6}{12}=\dfrac12$. It is quicker to cancel first, because a factor on the top of one fraction can cancel with a factor on the bottom of the other: the 3 on the top cancels with the 3 on the bottom, and the 2 on the top with half of the 4, so $\frac34\cdot\frac23=\frac{1\cdot1}{2\cdot1}=\frac12$. The word "of" means times: $\frac25$ of 30 is $\frac25\cdot30=12$.

**Why dividing is multiplying by the reciprocal.** Dividing asks how many fit. How many halves fit in 3? $3\div\frac12=6$, which is $3\cdot2$. In general dividing by $\frac cd$ is the same as multiplying by $\frac dc$, because multiplying by a number and then by its reciprocal gets you back where you started. Example:

$\dfrac34\div\dfrac9{10}=\dfrac34\cdot\dfrac{10}{9}=\dfrac{30}{36}=\dfrac56$.

The **reciprocal** of $\frac cd$ is $\frac dc$, and the reciprocal of an integer $n$ is $\frac1n$. Zero has no reciprocal, so you cannot divide by 0, and dividing by the fraction $\frac03$ is just as forbidden.

**Signs** follow the integers: same signs give a positive answer, different signs a negative one, so $\left(-\frac12\right)\cdot\left(-\frac23\right)=\frac13$. Negative exponents are reciprocals as well, since $2^{-3}=\frac18$, as the section on [zero, negative and fractional exponents](article:exponents-and-radicals#zero-negative-fractional) shows.

Try the calculator above with the other two operations.`,
            T`**Untuk mengalikan pecahan, kalikan pembilangnya dan kalikan penyebutnya: $\frac ab\cdot\frac cd=\frac{ac}{bd}$; untuk membagi, kalikan dengan kebalikan pembagi: $\frac ab\div\frac cd=\frac ab\cdot\frac dc$.** Tidak perlu penyebut sama untuk keduanya.

Perkalian: $\dfrac34\cdot\dfrac23=\dfrac{6}{12}=\dfrac12$. Lebih cepat bila mencoret lebih dulu, karena faktor di pembilang satu pecahan dapat dicoret dengan faktor di penyebut pecahan lain: angka 3 di atas dicoret dengan angka 3 di bawah, dan angka 2 di atas dengan setengah dari 4, sehingga $\frac34\cdot\frac23=\frac{1\cdot1}{2\cdot1}=\frac12$. Kata "dari" berarti kali: $\frac25$ dari 30 adalah $\frac25\cdot30=12$.

**Mengapa membagi sama dengan mengalikan kebalikan.** Pembagian menanyakan berapa yang muat. Berapa setengah yang muat dalam 3? $3\div\frac12=6$, yaitu $3\cdot2$. Umumnya membagi dengan $\frac cd$ sama dengan mengalikan dengan $\frac dc$, karena mengalikan dengan sebuah bilangan lalu dengan kebalikannya mengembalikanmu ke awal. Contoh:

$\dfrac34\div\dfrac9{10}=\dfrac34\cdot\dfrac{10}{9}=\dfrac{30}{36}=\dfrac56$.

**Kebalikan** dari $\frac cd$ adalah $\frac dc$, dan kebalikan bilangan bulat $n$ adalah $\frac1n$. Nol tidak punya kebalikan, sehingga kamu tidak dapat membagi dengan 0, dan membagi dengan pecahan $\frac03$ sama terlarangnya.

**Tanda** mengikuti bilangan bulat: tanda sama memberi jawaban positif, tanda berbeda negatif, sehingga $\left(-\frac12\right)\cdot\left(-\frac23\right)=\frac13$. Eksponen negatif juga kebalikan, sebab $2^{-3}=\frac18$, seperti ditunjukkan bagian tentang [eksponen nol, negatif, dan pecahan](article:exponents-and-radicals#zero-negative-fractional).

Coba kalkulator di atas dengan dua operasi lainnya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: divide fractions', 'Coba: membagi pecahan'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('Flip the second fraction and multiply: $\\frac34\\cdot\\frac{10}{9}$.', 'Balik pecahan kedua dan kalikan: $\\frac34\\cdot\\frac{10}{9}$.'),
              L('$\\frac{30}{36}$: divide the top and the bottom by 6.', '$\\frac{30}{36}$: bagi pembilang dan penyebut dengan 6.'),
            ],
            explain: L('$\\frac34\\div\\frac9{10}=\\frac34\\cdot\\frac{10}{9}=\\frac{30}{36}=\\frac56$.', '$\\frac34\\div\\frac9{10}=\\frac34\\cdot\\frac{10}{9}=\\frac{30}{36}=\\frac56$.'),
            prompt: L('Find $a$ and $b$ in lowest terms.', 'Tentukan $a$ dan $b$ dalam bentuk paling sederhana.'),
            given: String.raw`\frac34\div\frac{9}{10}=\frac{a}{b}`,
            blanks: [
              { label: 'a =', answer: 5 },
              { label: 'b =', answer: 6 },
            ],
          },
        },
      ],
    },

    /* -------------------------------------------------------------- mixed numbers */
    {
      id: 'mixed-numbers',
      heading: L('How do you convert between mixed numbers and improper fractions?', 'Bagaimana mengubah bilangan campuran dan pecahan tak wajar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To turn an improper fraction into a mixed number, divide the top by the bottom: the quotient is the whole part and the remainder is the new numerator over the same denominator; to go back, multiply the whole part by the denominator and add the numerator.** The only tool is division with remainder, the same one used in the [integers article](article:integers#remainders).

| Direction | Steps | Example |
|---|---|---|
| improper → mixed | $17\div5=3$ remainder $2$ | $\frac{17}{5}=3\frac25$ |
| mixed → improper | $3\cdot5+2=17$, keep the denominator | $3\frac25=\frac{17}{5}$ |
| negative improper → mixed | convert the size, then put the sign in front | $-\frac72=-3\frac12$ |

In $-3\frac12$ the minus applies to the whole number: it means $-\left(3+\frac12\right)=-3.5$, not $-3+\frac12$. Mixed numbers are fine for reading a quantity, such as $2\frac12$ cups, but improper fractions are easier to calculate with, so convert before you multiply or divide.`,
            T`**Untuk mengubah pecahan tak wajar menjadi bilangan campuran, bagi pembilang dengan penyebut: hasil bagi adalah bagian bulat dan sisanya adalah pembilang baru di atas penyebut yang sama; untuk kembali, kalikan bagian bulat dengan penyebut lalu tambahkan pembilang.** Satu-satunya alat adalah pembagian bersisa, yang sama dengan yang dipakai pada [artikel bilangan bulat](article:integers#remainders).

| Arah | Langkah | Contoh |
|---|---|---|
| tak wajar → campuran | $17\div5=3$ sisa $2$ | $\frac{17}{5}=3\frac25$ |
| campuran → tak wajar | $3\cdot5+2=17$, pertahankan penyebut | $3\frac25=\frac{17}{5}$ |
| tak wajar negatif → campuran | ubah ukurannya, lalu taruh tanda di depan | $-\frac72=-3\frac12$ |

Pada $-3\frac12$ tanda minus berlaku untuk seluruh bilangan: artinya $-\left(3+\frac12\right)=-3{,}5$, bukan $-3+\frac12$. Bilangan campuran baik untuk membaca suatu besaran, seperti $2\frac12$ cangkir, tetapi pecahan tak wajar lebih mudah dihitung, sehingga ubah dulu sebelum mengalikan atau membagi.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: a mixed number', 'Coba: bilangan campuran'),
          step: {
            kind: 'math',
            id: 'a7',
            hints: [
              L('$17\\div5$ goes 3 times: $3\\cdot5=15$.', '$17\\div5$ muat 3 kali: $3\\cdot5=15$.'),
              L('The remainder is $17-15$.', 'Sisanya $17-15$.'),
            ],
            explain: L('$17=3\\cdot5+2$, so $\\frac{17}{5}=3\\frac25$.', '$17=3\\cdot5+2$, sehingga $\\frac{17}{5}=3\\frac25$.'),
            prompt: L('Find $w$ and $r$.', 'Tentukan $w$ dan $r$.'),
            given: String.raw`\frac{17}{5}=w\frac{r}{5}`,
            blanks: [
              { label: 'w =', answer: 3 },
              { label: 'r =', answer: 2 },
            ],
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ decimals */
    {
      id: 'decimals-percent',
      heading: L('How do fractions become decimals and percentages?', 'Bagaimana pecahan menjadi desimal dan persen?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To turn a fraction into a decimal, divide the top by the bottom; the decimal terminates exactly when the denominator, in lowest terms, has no prime factor other than 2 and 5, and otherwise it eventually repeats periodically.** Ten is $2\cdot5$, so only denominators built from 2s and 5s fit into a power of ten.

| Fraction | Decimal | Why |
|---|---|---|
| $\frac38$ | $0.375$ | $8=2^3$, terminates after 3 digits |
| $\frac{7}{20}$ | $0.35$ | $20=2^2\cdot5$, terminates after 2 digits |
| $\frac13$ | $0.\overline{3}$ | 3 is neither 2 nor 5 |
| $\frac{5}{12}$ | $0.41\overline{6}$ | $12=2^2\cdot3$: 2 digits, then 6 repeats |
| $\frac17$ | $0.\overline{142857}$ | a block of 6 digits repeats |

Two numbers describe the repeat. The digits before it number $\max(x,y)$ when the denominator is $2^x\cdot5^y\cdot q$ with $q$ coprime to 10 (that is why $\frac5{12}$ has 2). The block is as long as the number of 10s you need to multiply to get a remainder of 1 modulo $q$: 1 for $\frac13$, 6 for $\frac17$ and for $\frac1{13}$, 16 for $\frac1{17}$, 96 for $\frac1{97}$. It always eventually repeats because long division has fewer than $q$ possible remainders, so one must come back. The proof, and how to turn a repeating decimal back into a fraction, are in the [rational numbers section of the real numbers article](article:real-numbers#rational-numbers); the same conversion is a sum of a [geometric series](article:geometric-sequences-and-series#infinite-geometric-series).

**Percent** means "per hundred": $p\%=\frac{p}{100}$. To convert a fraction, divide to get the decimal and shift the point two places: $\frac38=0.375=37.5\%$. To convert back, $25\%=\frac{25}{100}=\frac14$.

Percentages apply to a base. A 200 dollar jacket with 15% off costs 85% of 200, which is $0.85\cdot200=170$ dollars. A rise of 20% followed by a fall of 20% does not return to the start, because the second percentage is of a larger number: $100\to120\to96$.

Type any fraction below to see its decimal and why it looks that way. The same rule holds in other bases: in base 2 only denominators that are powers of 2 terminate, as the article on [binary numbers](article:binary-numbers#binary-fractions) shows.`,
            T`**Untuk mengubah pecahan menjadi desimal, bagi pembilang dengan penyebut; desimalnya berakhir tepat bila penyebut, dalam bentuk paling sederhana, tidak punya faktor prima selain 2 dan 5, dan jika tidak ia akhirnya berulang secara periodik.** Sepuluh adalah $2\cdot5$, sehingga hanya penyebut yang tersusun dari 2 dan 5 yang muat dalam pangkat sepuluh.

| Pecahan | Desimal | Alasan |
|---|---|---|
| $\frac38$ | $0{,}375$ | $8=2^3$, berakhir setelah 3 angka |
| $\frac{7}{20}$ | $0{,}35$ | $20=2^2\cdot5$, berakhir setelah 2 angka |
| $\frac13$ | $0{,}\overline{3}$ | 3 bukan 2 dan bukan 5 |
| $\frac{5}{12}$ | $0{,}41\overline{6}$ | $12=2^2\cdot3$: 2 angka, lalu 6 berulang |
| $\frac17$ | $0{,}\overline{142857}$ | blok 6 angka berulang |

Dua bilangan menggambarkan pengulangan itu. Banyak angka sebelum pengulangan adalah $\max(x,y)$ bila penyebutnya $2^x\cdot5^y\cdot q$ dengan $q$ saling prima dengan 10 (itulah sebabnya $\frac5{12}$ punya 2). Panjang blok sama dengan banyaknya faktor 10 yang diperlukan agar sisa menjadi 1 modulo $q$: 1 untuk $\frac13$, 6 untuk $\frac17$ dan $\frac1{13}$, 16 untuk $\frac1{17}$, 96 untuk $\frac1{97}$. Pengulangan selalu terjadi karena pembagian bersusun punya kurang dari $q$ kemungkinan sisa, sehingga ada yang harus kembali. Buktinya, dan cara mengubah desimal berulang kembali menjadi pecahan, ada pada [bagian bilangan rasional di artikel bilangan real](article:real-numbers#rational-numbers); pengubahan yang sama adalah jumlah [deret geometri](article:geometric-sequences-and-series#infinite-geometric-series).

**Persen** berarti "per seratus": $p\%=\frac{p}{100}$. Untuk mengubah pecahan, bagi untuk mendapat desimal lalu geser koma dua tempat: $\frac38=0{,}375=37{,}5\%$. Untuk kembali, $25\%=\frac{25}{100}=\frac14$.

Persentase berlaku pada suatu dasar. Jaket Rp200.000 yang didiskon 15% berharga 85% dari 200.000, yaitu $0{,}85\cdot200000=170000$ rupiah, atau Rp170.000. Kenaikan 20% yang diikuti penurunan 20% tidak kembali ke awal, karena persentase kedua dihitung dari bilangan yang lebih besar: $100\to120\to96$.

Ketik pecahan apa pun di bawah untuk melihat desimalnya dan mengapa tampak demikian. Aturan yang sama berlaku pada basis lain: dalam basis 2 hanya penyebut berupa pangkat 2 yang berakhir, seperti ditunjukkan artikel [bilangan biner](article:binary-numbers#binary-fractions).`,
          ),
        },
        { kind: 'widget', name: 'ratdecimal' },
        {
          kind: 'activity',
          title: L('Try it: terminates or repeats?', 'Coba: berakhir atau berulang?'),
          step: {
            kind: 'quiz',
            id: 'a8',
            prompt: L('Which of these fractions has a terminating decimal?', 'Manakah di antara pecahan ini yang desimalnya berakhir?'),
            options: [L('$\\frac16$', '$\\frac16$'), L('$\\frac27$', '$\\frac27$'), L('$\\frac38$', '$\\frac38$'), L('$\\frac5{12}$', '$\\frac5{12}$')],
            answer: 2,
            explain: L(
              '$8=2^3$ has no prime factor but 2, so $\\frac38=0.375$. The denominators 6, 7 and 12 contain 3 or 7, so those decimals repeat.',
              '$8=2^3$ tidak punya faktor prima selain 2, sehingga $\\frac38=0{,}375$. Penyebut 6, 7, dan 12 memuat 3 atau 7, sehingga desimalnya berulang.',
            ),
            hint: L('Factor each denominator into primes: are there only 2s and 5s?', 'Faktorkan tiap penyebut menjadi bilangan prima: apakah hanya ada 2 dan 5?'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- ratios */
    {
      id: 'ratios-proportion',
      heading: L('How do ratios and proportions use rational numbers?', 'Bagaimana perbandingan dan proporsi memakai bilangan rasional?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A ratio $a:b$ compares two quantities and is the fraction $\frac ab$; a proportion says two ratios are equal, $\frac ab=\frac cd$, and is solved by cross-multiplying: $ad=bc$.** Problems that scale a recipe, convert a map distance or price a quantity are all proportions.

| Situation | Setup | Answer |
|---|---|---|
| A recipe uses 3 cups of flour for 12 cookies. How much for 20 cookies? | $\frac{3}{12}=\frac{x}{20}$, so $12x=60$ | $x=5$ cups |
| 5 kg of rice cost 20 dollars. How much do 3 kg cost? | $\frac{20}{5}=\frac{y}{3}$, so $5y=60$ | $y=12$ dollars |
| A class has 30 students and $\frac25$ of them walk to school. How many walk? | $\frac25\cdot30$ | 12 students |
| A map scale is 1:50000. A road is 4 cm on the map. | $4\cdot50000=200000$ cm | 2 km |

Two habits prevent most mistakes. Keep the same quantity on the same level of every fraction, flour over cookies on both sides. And check that the answer is sensible: 20 cookies need more flour than 12, so 5 cups is plausible but 2 cups is not. A *unit rate* is the ratio per one: 20 dollars for 5 kg is 4 dollars per kilogram, and then any quantity is the unit rate times the amount.`,
            T`**Rasio $a:b$ membandingkan dua besaran dan merupakan pecahan $\frac ab$; proporsi menyatakan dua rasio sama, $\frac ab=\frac cd$, dan diselesaikan dengan perkalian silang: $ad=bc$.** Soal yang menskalakan resep, mengubah jarak peta, atau menghargai suatu jumlah semuanya adalah proporsi.

| Situasi | Pemodelan | Jawaban |
|---|---|---|
| Sebuah resep memakai 3 cangkir tepung untuk 12 kue. Berapa untuk 20 kue? | $\frac{3}{12}=\frac{x}{20}$, sehingga $12x=60$ | $x=5$ cangkir |
| 5 kg beras berharga Rp70.000. Berapa harga 3 kg? | $\frac{70000}{5}=\frac{y}{3}$, sehingga $5y=210000$ | $y=42000$ rupiah, atau Rp42.000 |
| Satu kelas berisi 30 siswa dan $\frac25$ di antaranya berjalan kaki ke sekolah. Berapa yang berjalan kaki? | $\frac25\cdot30$ | 12 siswa |
| Skala peta 1:50000. Sebuah jalan sepanjang 4 cm di peta. | $4\cdot50000=200000$ cm | 2 km |

Dua kebiasaan mencegah sebagian besar kesalahan. Jaga besaran yang sama pada tingkat yang sama di setiap pecahan, tepung di atas kue di kedua ruas. Dan periksa apakah jawabannya masuk akal: 20 kue memerlukan lebih banyak tepung daripada 12 kue, sehingga 5 cangkir masuk akal tetapi 2 cangkir tidak. *Laju satuan* adalah rasio per satu: Rp70.000 untuk 5 kg adalah Rp14.000 per kilogram, dan setiap jumlah adalah laju satuan dikali banyaknya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: a proportion', 'Coba: sebuah proporsi'),
          step: {
            kind: 'math',
            id: 'a9',
            hints: [
              L('Cross-multiply: $12x=3\\cdot20$.', 'Kalikan silang: $12x=3\\cdot20$.'),
              L('$12x=60$.', '$12x=60$.'),
            ],
            explain: L('$\\frac{3}{12}=\\frac{x}{20}$ gives $12x=60$, so $x=5$.', '$\\frac{3}{12}=\\frac{x}{20}$ memberi $12x=60$, sehingga $x=5$.'),
            prompt: L('3 cups of flour make 12 cookies. How many cups make 20?', '3 cangkir tepung menghasilkan 12 kue. Berapa cangkir untuk 20 kue?'),
            given: String.raw`\frac{3}{12}=\frac{x}{20}`,
            blanks: [{ label: 'x =', answer: 5 }],
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'fractions-in-code',
      heading: L('How do you work with fractions in Python and JavaScript?', 'Bagaimana mengolah pecahan di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Python has an exact fraction type, ´fractions.Fraction´, that keeps numerator and denominator as integers; JavaScript has none, and its ´/´ always produces a binary floating-point number.** Floats store only the nearest binary value, so $\frac13$ and even $\frac1{10}$ cannot be held exactly: see the [floating-point section of the real numbers article](article:real-numbers#real-numbers-in-code).`,
            T`**Python punya tipe pecahan eksak, ´fractions.Fraction´, yang menyimpan pembilang dan penyebut sebagai bilangan bulat; JavaScript tidak punya, dan ´/´-nya selalu menghasilkan bilangan floating point biner.** Float hanya menyimpan nilai biner terdekat, sehingga $\frac13$ dan bahkan $\frac1{10}$ tidak dapat disimpan dengan tepat: lihat [bagian floating point pada artikel bilangan real](article:real-numbers#real-numbers-in-code).`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> from fractions import Fraction
>>> Fraction(6, 8)                    # reduced automatically
Fraction(3, 4)
>>> Fraction(1, 3) + Fraction(1, 6)
Fraction(1, 2)
>>> Fraction(3, 4) / Fraction(9, 10)
Fraction(5, 6)
>>> Fraction(-7, 2).numerator, Fraction(-7, 2).denominator
(-7, 2)
>>> float(Fraction(1, 3))
0.3333333333333333
>>> 0.1 + 0.2 == 0.3
False
>>> Fraction(1, 10) + Fraction(2, 10) == Fraction(3, 10)
True
>>> Fraction(0.1)                     # the float 0.1 is not one tenth
Fraction(3602879701896397, 36028797018963968)
>>> Fraction('0.1')                   # the text 0.1 is
Fraction(1, 10)
>>> Fraction(1, 0)
ZeroDivisionError: Fraction(1, 0)`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: a small exact fraction with BigInt', 'JavaScript: pecahan eksak sederhana dengan BigInt'),
          code: `0.1 + 0.2                  // 0.30000000000000004
3 / 4                      // 0.75: JavaScript has no integer division

const gcd = (a, b) => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b))
const frac = (n, d) => {
  const g = gcd(n, d)
  return d < 0n ? [-n / g, -d / g] : [n / g, d / g]
}
const add = ([a, b], [c, d]) => frac(a * d + c * b, b * d)

add(frac(1n, 3n), frac(1n, 6n))   // [1n, 2n]`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´3 / 4´ in Python 3 | 0.75, a float; ´3 // 4´ is 0 | use ´Fraction(3, 4)´ for an exact value |
| ´Fraction(0.1)´ | the exact value of the float, not 1/10 | pass a string, ´Fraction('0.1')´, or two integers |
| Money in floats | ´0.1 + 0.2´ is not ´0.3´ | store whole cents as integers, or use ´decimal.Decimal´ |
| Comparing floats | ´==´ fails by a hair | compare with a tolerance, or compare Fractions |
| ´Fraction(1, 0)´ | ZeroDivisionError | check the denominator first |
| Fractions in JavaScript | no built-in type | keep two ´BigInt´s and reduce with the GCD, as above |
| Huge denominators | repeated addition can make numbers grow | reduce after every step; Fraction does it for you |

Use ´Fraction´ when you need an exact answer from exact input, and floats when speed matters and a tiny rounding error is harmless.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´3 / 4´ di Python 3 | 0,75, sebuah float; ´3 // 4´ adalah 0 | pakai ´Fraction(3, 4)´ untuk nilai eksak |
| ´Fraction(0.1)´ | nilai eksak dari float, bukan 1/10 | berikan string, ´Fraction('0.1')´, atau dua bilangan bulat |
| Uang dalam float | ´0.1 + 0.2´ bukan ´0.3´ | simpan sen utuh sebagai bilangan bulat, atau pakai ´decimal.Decimal´ |
| Membandingkan float | ´==´ gagal setipis rambut | bandingkan dengan toleransi, atau bandingkan Fraction |
| ´Fraction(1, 0)´ | ZeroDivisionError | periksa penyebut lebih dulu |
| Pecahan di JavaScript | tidak ada tipe bawaan | simpan dua ´BigInt´ dan sederhanakan dengan FPB, seperti di atas |
| Penyebut sangat besar | penjumlahan berulang dapat membuat bilangan membesar | sederhanakan setiap langkah; Fraction melakukannya untukmu |

Pakai ´Fraction´ bila kamu memerlukan jawaban eksak dari masukan eksak, dan float bila kecepatan penting dan galat pembulatan kecil tidak berbahaya.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do fractions come from?', 'Dari mana asal pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Fractions are among the oldest mathematics: the Egyptians used them around 1550 BCE, and our way of writing them was assembled over about three thousand years.**

- **Egypt.** The Rhind Papyrus writes almost every fraction as a sum of different *unit fractions* (numerator 1): $\frac25=\frac13+\frac1{15}$. Only a few, such as $\frac23$, had a symbol of their own.
- **India and the Arab world.** Fractions were written with one number above the other. Arab mathematicians added the dividing bar.
- **Europe.** Fibonacci's *Liber Abaci* (1202) used the fraction bar and helped spread the Hindu-Arabic numerals in Europe.
- **Decimals.** Simon Stevin's *De Thiende* (1585) argued for writing fractions in tenths, hundredths and thousandths, which is the decimal notation we use.

Today the same numbers show up as fractions in a recipe, as decimals on a calculator, as percentages in a shop and as ratios on a map: one idea with four faces.`,
            T`**Pecahan termasuk matematika tertua: orang Mesir memakainya sekitar 1550 SM, dan cara kita menuliskannya terbentuk selama sekitar tiga ribu tahun.**

- **Mesir.** Papirus Rhind menulis hampir setiap pecahan sebagai jumlah *pecahan satuan* yang berbeda (pembilang 1): $\frac25=\frac13+\frac1{15}$. Hanya beberapa, seperti $\frac23$, yang punya lambang sendiri.
- **India dan dunia Arab.** Pecahan ditulis dengan satu bilangan di atas yang lain. Matematikawan Arab menambahkan garis pembagi.
- **Eropa.** *Liber Abaci* karya Fibonacci (1202) memakai garis pecahan dan ikut menyebarkan angka Hindu-Arab di Eropa.
- **Desimal.** *De Thiende* karya Simon Stevin (1585) menganjurkan menulis pecahan dalam persepuluhan, perseratusan, dan perseribuan, yaitu notasi desimal yang kita pakai.

Kini bilangan yang sama tampil sebagai pecahan dalam resep, sebagai desimal pada kalkulator, sebagai persen di toko, dan sebagai rasio pada peta: satu gagasan dengan empat wajah.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with fractions?', 'Apa kesalahan umum pada pecahan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with fractions are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| $\frac12+\frac13=\frac25$ | $\frac12+\frac13=\frac56$. Never add the denominators. |
| $\frac{2+3}{2+4}=\frac34$ | Terms do not cancel: $\frac{5}{6}$ is already simplest. |
| $\frac13<\frac14$ because $3<4$ | A larger denominator means smaller parts: $\frac13>\frac14$. |
| $\frac34\div\frac9{10}=\frac{3\cdot9}{4\cdot10}$ | Flip the divisor: $\frac34\cdot\frac{10}{9}=\frac56$. |
| $\frac{a}{b}\cdot\frac{c}{d}=\frac{ac}{b+d}$ | Multiply the bottoms too: $\frac{ac}{bd}$. |
| $-\frac{3}{4}=\frac{-3}{-4}$ | $\frac{-3}{-4}=+\frac34$. Move one minus sign only. |
| $\frac50=0$ | A denominator of 0 is not allowed: $\frac50$ is not a number. |
| $3\frac12=3\cdot\frac12$ | $3\frac12=3+\frac12=\frac72$. |
| $0.\overline{3}\neq\frac13$ because its expansion is infinite | $0.\overline{3}=\frac13$ exactly: a repeating decimal is a fraction. |`,
            T`**Kesalahan paling umum pada pecahan adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| $\frac12+\frac13=\frac25$ | $\frac12+\frac13=\frac56$. Jangan pernah menjumlahkan penyebut. |
| $\frac{2+3}{2+4}=\frac34$ | Suku tidak dicoret: $\frac{5}{6}$ sudah paling sederhana. |
| $\frac13<\frac14$ karena $3<4$ | Penyebut lebih besar berarti potongan lebih kecil: $\frac13>\frac14$. |
| $\frac34\div\frac9{10}=\frac{3\cdot9}{4\cdot10}$ | Balik pembagi: $\frac34\cdot\frac{10}{9}=\frac56$. |
| $\frac{a}{b}\cdot\frac{c}{d}=\frac{ac}{b+d}$ | Kalikan juga penyebutnya: $\frac{ac}{bd}$. |
| $-\frac{3}{4}=\frac{-3}{-4}$ | $\frac{-3}{-4}=+\frac34$. Pindahkan satu tanda minus saja. |
| $\frac50=0$ | Penyebut 0 tidak diperbolehkan: $\frac50$ bukan bilangan. |
| $3\frac12=3\cdot\frac12$ | $3\frac12=3+\frac12=\frac72$. |
| $0{,}\overline{3}\neq\frac13$ karena ekspansinya tak berhingga | $0{,}\overline{3}=\frac13$ tepat: desimal berulang adalah pecahan. |`,
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
              L('Every integer is a rational number.', 'Setiap bilangan bulat adalah bilangan rasional.'),
              L('$\\frac34+\\frac14=\\frac48$.', '$\\frac34+\\frac14=\\frac48$.'),
              L('$0.\\overline{3}$ is a rational number.', '$0{,}\\overline{3}$ adalah bilangan rasional.'),
              L('$\\frac13>\\frac12$.', '$\\frac13>\\frac12$.'),
              L('$\\left(-\\frac12\\right)\\cdot\\left(-\\frac12\\right)=-\\frac14$.', '$\\left(-\\frac12\\right)\\cdot\\left(-\\frac12\\right)=-\\frac14$.'),
            ],
            answer: [true, false, true, false, false],
            explain: L(
              'Integers are fractions over 1. $\\frac34+\\frac14=\\frac44=1$. $0.\\overline{3}=\\frac13$. $\\frac13<\\frac12$. A negative times a negative is positive: $\\frac14$.',
              'Bilangan bulat adalah pecahan di atas 1. $\\frac34+\\frac14=\\frac44=1$. $0{,}\\overline{3}=\\frac13$. $\\frac13<\\frac12$. Negatif kali negatif positif: $\\frac14$.',
            ),
            hint: L('Common denominators help, and so do decimals such as $0.5$ and $0.25$.', 'Penyebut sama membantu, begitu pula desimal seperti $0{,}5$ dan $0{,}25$.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the fractions equal to $\\frac34$.', 'Pilih **semua** pecahan yang sama dengan $\\frac34$.'),
            options: [L('$\\frac68$', '$\\frac68$'), L('$\\frac9{12}$', '$\\frac9{12}$'), L('$\\frac{12}{16}$', '$\\frac{12}{16}$'), L('$\\frac45$', '$\\frac45$'), L('$\\frac38$', '$\\frac38$')],
            answer: [0, 1, 2],
            explain: L(
              '$\\frac68$, $\\frac9{12}$ and $\\frac{12}{16}$ all equal $\\frac34$ after dividing by their GCD (2, 3, 4). $\\frac45=0.8$ and $\\frac38=0.375$.',
              '$\\frac68$, $\\frac9{12}$, dan $\\frac{12}{16}$ semuanya sama dengan $\\frac34$ setelah dibagi FPB-nya (2, 3, 4). $\\frac45=0{,}8$ dan $\\frac38=0{,}375$.',
            ),
            hint: L('Cross-multiply each with $\\frac34$, or divide the top and the bottom by their GCD.', 'Kalikan silang masing-masing dengan $\\frac34$, atau bagi pembilang dan penyebut dengan FPB-nya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Subtract fractions', 'Kurangkan pecahan'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('The common denominator of 6 and 4 is 12.', 'Penyebut sama dari 6 dan 4 adalah 12.'),
              L('$\\frac{10}{12}-\\frac{3}{12}$.', '$\\frac{10}{12}-\\frac{3}{12}$.'),
            ],
            explain: L('$\\frac56-\\frac14=\\frac{10}{12}-\\frac{3}{12}=\\frac7{12}$.', '$\\frac56-\\frac14=\\frac{10}{12}-\\frac{3}{12}=\\frac7{12}$.'),
            prompt: L('Find $a$ and $b$.', 'Tentukan $a$ dan $b$.'),
            given: String.raw`\frac56-\frac14=\frac{a}{b}`,
            blanks: [
              { label: 'a =', answer: 7 },
              { label: 'b =', answer: 12 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('A fraction of a number', 'Pecahan dari suatu bilangan'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('"Of" means times: $\\frac25\\cdot45$.', '"Dari" berarti kali: $\\frac25\\cdot45$.'),
              L('Divide 45 by 5, then multiply by 2.', 'Bagi 45 dengan 5, lalu kalikan dengan 2.'),
            ],
            explain: L('$45\\div5=9$ and $9\\cdot2=18$.', '$45\\div5=9$ dan $9\\cdot2=18$.'),
            prompt: L('What is $\\frac25$ of 45?', 'Berapakah $\\frac25$ dari 45?'),
            given: String.raw`\frac25\cdot45=v`,
            blanks: [{ label: 'v =', answer: 18 }],
          },
        },
        {
          kind: 'activity',
          title: L('A percentage', 'Sebuah persentase'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What is $\\frac{3}{20}$ as a percentage?', 'Berapa persen $\\frac{3}{20}$?'),
            options: [L('$30\\%$', '$30\\%$'), L('$15\\%$', '$15\\%$'), L('$20\\%$', '$20\\%$'), L('$6.67\\%$', '$6{,}67\\%$')],
            answer: 1,
            explain: L(
              '$\\frac{3}{20}=\\frac{15}{100}=15\\%$: multiply the top and the bottom by 5 to get a denominator of 100.',
              '$\\frac{3}{20}=\\frac{15}{100}=15\\%$: kalikan pembilang dan penyebut dengan 5 agar penyebutnya 100.',
            ),
            hint: L('Make the denominator 100: what do you multiply 20 by?', 'Buat penyebutnya 100: 20 dikalikan berapa?'),
          },
        },
        {
          kind: 'activity',
          title: L('Sharing equally', 'Berbagi sama rata'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('$\\frac34$ of a liter of juice is shared equally among 3 glasses. How much is in each?', '$\\frac34$ liter jus dibagi sama rata ke 3 gelas. Berapa isi tiap gelas?'),
            options: [L('$\\frac94$ L', '$\\frac94$ L'), L('$\\frac14$ L', '$\\frac14$ L'), L('$\\frac1{12}$ L', '$\\frac1{12}$ L'), L('$\\frac37$ L', '$\\frac37$ L')],
            answer: 1,
            explain: L(
              '$\\frac34\\div3=\\frac34\\cdot\\frac13=\\frac{3}{12}=\\frac14$ liter.',
              '$\\frac34\\div3=\\frac34\\cdot\\frac13=\\frac{3}{12}=\\frac14$ liter.',
            ),
            hint: L('Dividing by 3 is multiplying by the reciprocal, $\\frac13$.', 'Membagi dengan 3 sama dengan mengalikan dengan kebalikannya, $\\frac13$.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: rational numbers at a glance', 'Ringkasan: bilangan rasional sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Rational:** $\frac pq$ with integers $p,q$ and $q\neq0$; every integer is rational; a number has many fractions, one in lowest terms.
- **Equal fractions:** $\frac ab=\frac cd\iff ad=bc$; divide top and bottom by the GCD to simplify; cancel factors, never terms.
- **Compare:** cross-multiply; the larger denominator makes the smaller piece; between two rationals lies their average.
- **Add and subtract:** common denominator (the LCM), then combine the tops; never add the denominators.
- **Multiply and divide:** tops times tops, bottoms times bottoms; divide by flipping the second fraction; zero has no reciprocal.
- **Mixed numbers:** divide with remainder to convert; $-3\frac12=-\left(3+\frac12\right)$.
- **Decimals:** a lowest-terms fraction terminates exactly when the denominator has only 2s and 5s; otherwise it eventually repeats periodically; $p\%=\frac p{100}$.
- **Code:** use ´Fraction´ for exactness in Python; floats cannot hold $\frac1{10}$.`,
            T`- **Rasional:** $\frac pq$ dengan bilangan bulat $p,q$ dan $q\neq0$; setiap bilangan bulat rasional; satu bilangan punya banyak pecahan, satu di antaranya paling sederhana.
- **Pecahan sama:** $\frac ab=\frac cd\iff ad=bc$; bagi pembilang dan penyebut dengan FPB untuk menyederhanakan; coret faktor, jangan suku.
- **Membandingkan:** kalikan silang; penyebut lebih besar membuat potongan lebih kecil; di antara dua bilangan rasional terdapat rata-ratanya.
- **Menjumlah dan mengurang:** penyebut sama (KPK), lalu gabungkan pembilang; jangan menjumlahkan penyebut.
- **Mengalikan dan membagi:** pembilang kali pembilang, penyebut kali penyebut; bagi dengan membalik pecahan kedua; nol tidak punya kebalikan.
- **Bilangan campuran:** bagi dengan sisa untuk mengubah; $-3\frac12=-\left(3+\frac12\right)$.
- **Desimal:** pecahan paling sederhana berakhir tepat bila penyebut hanya berisi 2 dan 5; jika tidak ia akhirnya berulang secara periodik; $p\%=\frac p{100}$.
- **Kode:** pakai ´Fraction´ untuk ketepatan di Python; float tidak dapat menyimpan $\frac1{10}$.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Rational number', 'Bilangan rasional'), definition: L('A number that can be written as a fraction of two integers with a non-zero denominator, such as 3 over 4 or minus 7 over 2.', 'Bilangan yang dapat ditulis sebagai pecahan dari dua bilangan bulat dengan penyebut bukan nol, seperti 3 per 4 atau minus 7 per 2.') },
    { term: L('Fraction', 'Pecahan'), definition: L('A way of writing a number as a numerator over a denominator, which names how many equal parts are taken out of how many.', 'Cara menulis bilangan sebagai pembilang di atas penyebut, yang menyatakan berapa bagian yang sama diambil dari berapa bagian.') },
    { term: L('Numerator', 'Pembilang'), definition: L('The top number of a fraction, which says how many parts are taken.', 'Bilangan atas sebuah pecahan, yang menyatakan berapa bagian yang diambil.') },
    { term: L('Denominator', 'Penyebut'), definition: L('The bottom number of a fraction, which says how many equal parts the whole is cut into and can never be zero.', 'Bilangan bawah sebuah pecahan, yang menyatakan keseluruhan dipotong menjadi berapa bagian sama dan tidak boleh nol.') },
    { term: L('Equivalent fractions', 'Pecahan senilai'), definition: L('Different fractions that name the same number, such as 1 over 2 and 2 over 4, found by multiplying or dividing the top and bottom by the same number.', 'Pecahan berbeda yang menamai bilangan sama, seperti 1 per 2 dan 2 per 4, diperoleh dengan mengalikan atau membagi pembilang dan penyebut dengan bilangan yang sama.') },
    { term: L('Lowest terms', 'Bentuk paling sederhana'), definition: L('A fraction whose numerator and denominator share no factor except 1, found by dividing both by their greatest common divisor.', 'Pecahan yang pembilang dan penyebutnya tidak punya faktor sama selain 1, diperoleh dengan membagi keduanya dengan faktor persekutuan terbesarnya.') },
    { term: L('Proper and improper fraction', 'Pecahan wajar dan tak wajar'), definition: L('A proper fraction is smaller than 1 in size, like 3 over 4; an improper fraction is 1 or more in size, like 17 over 5.', 'Pecahan wajar ukurannya kurang dari 1, seperti 3 per 4; pecahan tak wajar ukurannya 1 atau lebih, seperti 17 per 5.') },
    { term: L('Mixed number', 'Bilangan campuran'), definition: L('A whole number together with a proper fraction, such as 3 and 2 over 5, which means 3 plus 2 over 5.', 'Bilangan bulat bersama pecahan wajar, seperti 3 dan 2 per 5, yang berarti 3 ditambah 2 per 5.') },
    { term: L('Reciprocal', 'Kebalikan'), definition: L('The fraction turned upside down; a number times its reciprocal is 1, and zero has no reciprocal.', 'Pecahan yang dibalik; bilangan dikali kebalikannya sama dengan 1, dan nol tidak punya kebalikan.') },
    { term: L('Common denominator', 'Penyebut sama'), definition: L('A denominator that two fractions are both rewritten over so that they can be added or compared; the least common multiple of the denominators is the smallest choice.', 'Penyebut yang menjadi dasar penulisan ulang dua pecahan agar dapat dijumlahkan atau dibandingkan; kelipatan persekutuan terkecil dari penyebutnya adalah pilihan terkecil.') },
    { term: L('Terminating decimal', 'Desimal berakhir'), definition: L('A decimal expansion with finitely many digits, such as 0.375; a fraction in lowest terms has one exactly when its denominator has only the prime factors 2 and 5.', 'Ekspansi desimal dengan angka yang berhingga banyaknya, seperti 0,375; pecahan paling sederhana memilikinya tepat bila penyebutnya hanya berfaktor prima 2 dan 5.') },
    { term: L('Repeating decimal', 'Desimal berulang'), definition: L('A decimal expansion that eventually repeats periodically: from some digit onward a block of digits repeats without end, such as 0.333 and so on for 1 over 3.', 'Ekspansi desimal yang akhirnya berulang secara periodik: mulai dari suatu angka, sebuah blok angka berulang tanpa akhir, seperti 0,333 dan seterusnya untuk 1 per 3.') },
    { term: L('Percent', 'Persen'), definition: L('A fraction with denominator 100, so that 25 percent means 25 over 100, which is 1 over 4.', 'Pecahan berpenyebut 100, sehingga 25 persen berarti 25 per 100, yaitu 1 per 4.') },
    { term: L('Ratio', 'Rasio (perbandingan)'), definition: L('A comparison of two quantities written a to b or as the fraction a over b.', 'Perbandingan dua besaran yang ditulis a banding b atau sebagai pecahan a per b.') },
  ],

  howTo: [
    {
      name: L('How to add fractions with different denominators', 'Cara menjumlahkan pecahan berpenyebut berbeda'),
      description: L('Rewrite both fractions over their least common multiple, add the tops and simplify.', 'Tulis kedua pecahan di atas kelipatan persekutuan terkecilnya, jumlahkan pembilangnya, dan sederhanakan.'),
      steps: [
        { name: L('Find the common denominator', 'Cari penyebut sama'), text: L('Find the least common multiple of the two denominators, for example 12 for 3 and 4.', 'Cari kelipatan persekutuan terkecil dari kedua penyebut, misalnya 12 untuk 3 dan 4.') },
        { name: L('Rewrite both fractions', 'Tulis ulang kedua pecahan'), text: L('Multiply the top and bottom of each fraction by what turns its denominator into 12, so 2 over 3 becomes 8 over 12 and 3 over 4 becomes 9 over 12.', 'Kalikan pembilang dan penyebut tiap pecahan dengan bilangan yang mengubah penyebutnya menjadi 12, sehingga 2 per 3 menjadi 8 per 12 dan 3 per 4 menjadi 9 per 12.') },
        { name: L('Add the numerators', 'Jumlahkan pembilangnya'), text: L('Add the tops and keep the denominator: 8 plus 9 is 17, giving 17 over 12.', 'Jumlahkan pembilang dan pertahankan penyebut: 8 ditambah 9 adalah 17, menghasilkan 17 per 12.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('Cancel any common factor and, if you wish, write the result as a mixed number: 17 over 12 is 1 and 5 over 12.', 'Coret faktor sama dan, bila mau, tulis hasilnya sebagai bilangan campuran: 17 per 12 adalah 1 dan 5 per 12.') },
      ],
    },
    {
      name: L('How to divide by a fraction', 'Cara membagi dengan pecahan'),
      description: L('Multiply by the reciprocal of the divisor and simplify.', 'Kalikan dengan kebalikan pembagi dan sederhanakan.'),
      steps: [
        { name: L('Flip the divisor', 'Balik pembagi'), text: L('Write the reciprocal of the second fraction: 9 over 10 becomes 10 over 9.', 'Tulis kebalikan pecahan kedua: 9 per 10 menjadi 10 per 9.') },
        { name: L('Change division to multiplication', 'Ubah pembagian menjadi perkalian'), text: L('Multiply the first fraction by that reciprocal: 3 over 4 times 10 over 9.', 'Kalikan pecahan pertama dengan kebalikan itu: 3 per 4 kali 10 per 9.') },
        { name: L('Multiply across', 'Kalikan melintang'), text: L('Multiply the tops and multiply the bottoms, which gives 30 over 36.', 'Kalikan pembilangnya dan kalikan penyebutnya, yang menghasilkan 30 per 36.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('Divide the top and bottom by their greatest common divisor, 6, to get 5 over 6.', 'Bagi pembilang dan penyebut dengan faktor persekutuan terbesarnya, 6, untuk mendapat 5 per 6.') },
      ],
    },
    {
      name: L('How to tell whether a fraction terminates or repeats as a decimal', 'Cara mengetahui desimal pecahan berakhir atau berulang'),
      description: L('Simplify the fraction, then look at the prime factors of its denominator.', 'Sederhanakan pecahan, lalu lihat faktor prima penyebutnya.'),
      steps: [
        { name: L('Reduce the fraction', 'Sederhanakan pecahan'), text: L('Divide the top and bottom by their greatest common divisor so the fraction is in lowest terms.', 'Bagi pembilang dan penyebut dengan faktor persekutuan terbesarnya sehingga pecahan paling sederhana.') },
        { name: L('Factor the denominator', 'Faktorkan penyebut'), text: L('Write the denominator as a product of primes, for example 12 is 2 times 2 times 3.', 'Tulis penyebut sebagai hasil kali bilangan prima, misalnya 12 adalah 2 kali 2 kali 3.') },
        { name: L('Look for other primes', 'Cari bilangan prima lain'), text: L('If the only primes are 2 and 5, the decimal terminates; if any other prime appears, it eventually repeats periodically.', 'Jika satu-satunya bilangan prima adalah 2 dan 5, desimalnya berakhir; jika ada bilangan prima lain, ia akhirnya berulang secara periodik.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a rational number?', 'Apa itu bilangan rasional?'),
      a: L(
        'A rational number is any number that can be written as a fraction p over q, where p and q are integers and q is not zero. Examples are 3 over 4, minus 7 over 2, and every integer, since 5 equals 5 over 1.',
        'Bilangan rasional adalah bilangan apa pun yang dapat ditulis sebagai pecahan p per q, dengan p dan q bilangan bulat dan q bukan nol. Contohnya 3 per 4, minus 7 per 2, dan setiap bilangan bulat, sebab 5 sama dengan 5 per 1.',
      ),
    },
    {
      q: L('Is every integer a rational number?', 'Apakah setiap bilangan bulat adalah bilangan rasional?'),
      a: L(
        'Yes. Any integer n can be written as n over 1, which is a fraction of two integers with a non-zero denominator. So the integers are a part of the rational numbers, and the rational numbers add the fractions between them.',
        'Ya. Bilangan bulat n mana pun dapat ditulis sebagai n per 1, yaitu pecahan dari dua bilangan bulat dengan penyebut bukan nol. Jadi bilangan bulat adalah bagian dari bilangan rasional, dan bilangan rasional menambahkan pecahan di antaranya.',
      ),
    },
    {
      q: L('What is the difference between a fraction and a rational number?', 'Apa beda pecahan dan bilangan rasional?'),
      a: L(
        'A fraction is a way of writing, a numerator over a denominator, while a rational number is the value that writing names. Many fractions, such as 1 over 2, 2 over 4 and 50 over 100, name the same rational number.',
        'Pecahan adalah cara menulis, pembilang di atas penyebut, sedangkan bilangan rasional adalah nilai yang dinamai tulisan itu. Banyak pecahan, seperti 1 per 2, 2 per 4, dan 50 per 100, menamai bilangan rasional yang sama.',
      ),
    },
    {
      q: L('How do you simplify a fraction?', 'Bagaimana menyederhanakan pecahan?'),
      a: L(
        'Divide the numerator and the denominator by their greatest common divisor. For 84 over 126 the greatest common divisor is 42, so the fraction simplifies to 2 over 3. You may also cancel common factors step by step, but never common terms.',
        'Bagi pembilang dan penyebut dengan faktor persekutuan terbesarnya. Untuk 84 per 126 faktor persekutuan terbesarnya 42, sehingga pecahan itu menjadi 2 per 3. Kamu juga boleh mencoret faktor sama selangkah demi selangkah, tetapi jangan pernah suku yang sama.',
      ),
    },
    {
      q: L('How do you compare two fractions?', 'Bagaimana membandingkan dua pecahan?'),
      a: L(
        'Cross-multiply. To compare a over b with c over d, when b and d are positive, compare a times d with c times b. For 3 over 5 and 5 over 8 that is 24 against 25, so 3 over 5 is smaller. You can also use a common denominator.',
        'Kalikan silang. Untuk membandingkan a per b dengan c per d, bila b dan d positif, bandingkan a kali d dengan c kali b. Untuk 3 per 5 dan 5 per 8 itu 24 lawan 25, sehingga 3 per 5 lebih kecil. Kamu juga dapat memakai penyebut sama.',
      ),
    },
    {
      q: L('How do you add fractions with different denominators?', 'Bagaimana menjumlahkan pecahan berpenyebut berbeda?'),
      a: L(
        'Rewrite both over a common denominator, preferably the least common multiple, then add the numerators and keep the denominator. For 2 over 3 plus 3 over 4 use 12: 8 over 12 plus 9 over 12 is 17 over 12. Never add the denominators.',
        'Tulis keduanya di atas penyebut sama, sebaiknya kelipatan persekutuan terkecil, lalu jumlahkan pembilang dan pertahankan penyebut. Untuk 2 per 3 ditambah 3 per 4 pakai 12: 8 per 12 ditambah 9 per 12 adalah 17 per 12. Jangan pernah menjumlahkan penyebut.',
      ),
    },
    {
      q: L('Why do you flip the second fraction when you divide?', 'Mengapa pecahan kedua dibalik saat membagi?'),
      a: L(
        'Because dividing by a number is the same as multiplying by its reciprocal. Dividing asks how many fit: three divided by one half is 6, which is 3 times 2. In general a over b divided by c over d equals a over b times d over c.',
        'Karena membagi dengan suatu bilangan sama dengan mengalikan dengan kebalikannya. Pembagian menanyakan berapa yang muat: tiga dibagi setengah adalah 6, yaitu 3 kali 2. Umumnya a per b dibagi c per d sama dengan a per b kali d per c.',
      ),
    },
    {
      q: L('How do you convert an improper fraction to a mixed number?', 'Bagaimana mengubah pecahan tak wajar menjadi bilangan campuran?'),
      a: L(
        'Divide the numerator by the denominator. The quotient is the whole part and the remainder becomes the new numerator over the same denominator. For 17 over 5, 17 divided by 5 is 3 remainder 2, so it is 3 and 2 over 5.',
        'Bagi pembilang dengan penyebut. Hasil bagi adalah bagian bulat dan sisanya menjadi pembilang baru di atas penyebut yang sama. Untuk 17 per 5, 17 dibagi 5 adalah 3 sisa 2, sehingga menjadi 3 dan 2 per 5.',
      ),
    },
    {
      q: L('How do you turn a fraction into a decimal?', 'Bagaimana mengubah pecahan menjadi desimal?'),
      a: L(
        'Divide the numerator by the denominator, by long division or a calculator. For 3 over 8 that gives 0.375. If the division never terminates, the digits eventually repeat periodically, as 1 over 3 gives 0.333 and so on, written with a bar over the repeating digit.',
        'Bagi pembilang dengan penyebut, dengan pembagian bersusun atau kalkulator. Untuk 3 per 8 hasilnya 0,375. Jika pembagian tidak pernah berakhir, angkanya akhirnya berulang secara periodik, seperti 1 per 3 menghasilkan 0,333 dan seterusnya, ditulis dengan garis di atas angka yang berulang.',
      ),
    },
    {
      q: L('When does a fraction give a terminating decimal?', 'Kapan pecahan menghasilkan desimal berakhir?'),
      a: L(
        'When, in lowest terms, its denominator has no prime factor other than 2 and 5, because ten is 2 times 5. So 3 over 8 and 7 over 20 terminate, while 1 over 3, 1 over 6 and 5 over 12 repeat, since their denominators contain 3.',
        'Bila, dalam bentuk paling sederhana, penyebutnya tidak punya faktor prima selain 2 dan 5, karena sepuluh adalah 2 kali 5. Jadi 3 per 8 dan 7 per 20 berakhir, sedangkan 1 per 3, 1 per 6, dan 5 per 12 berulang, sebab penyebutnya memuat 3.',
      ),
    },
    {
      q: L('Is 0.333 repeating the same as one third?', 'Apakah 0,333 berulang sama dengan sepertiga?'),
      a: L(
        'Yes, exactly. A repeating decimal is a different way of writing a fraction. If x is 0.333 and so on, then 10x minus x is 3, so 9x is 3 and x is one third. Three decimal places only approximate it; the infinite repeat equals it.',
        'Ya, tepat. Desimal berulang adalah cara lain menulis pecahan. Jika x adalah 0,333 dan seterusnya, maka 10x dikurangi x adalah 3, sehingga 9x adalah 3 dan x adalah sepertiga. Tiga tempat desimal hanya mendekatinya; pengulangan tak hingga sama dengannya.',
      ),
    },
    {
      q: L('How do you convert a fraction to a percentage?', 'Bagaimana mengubah pecahan menjadi persen?'),
      a: L(
        'Convert it to a decimal and multiply by 100, or rewrite it with denominator 100. For 3 over 8 the decimal is 0.375, so it is 37.5 percent. For 3 over 20, multiplying top and bottom by 5 gives 15 over 100, which is 15 percent.',
        'Ubah menjadi desimal lalu kalikan 100, atau tulis ulang dengan penyebut 100. Untuk 3 per 8 desimalnya 0,375, sehingga 37,5 persen. Untuk 3 per 20, mengalikan pembilang dan penyebut dengan 5 menghasilkan 15 per 100, yaitu 15 persen.',
      ),
    },
    {
      q: L('Why can a denominator not be zero?', 'Mengapa penyebut tidak boleh nol?'),
      a: L(
        'A fraction a over b means the number that gives a when multiplied by b. With b equal to 0, nothing times 0 gives a when a is not 0, and when a is also 0 every number would work. So division by zero has no single answer and is undefined.',
        'Pecahan a per b berarti bilangan yang menghasilkan a bila dikalikan b. Dengan b sama dengan 0, tidak ada bilangan kali 0 yang menghasilkan a bila a bukan 0, dan bila a juga 0 setiap bilangan berlaku. Jadi pembagian dengan nol tidak punya satu jawaban dan tidak terdefinisi.',
      ),
    },
    {
      q: L('How do you use fractions exactly in Python?', 'Bagaimana memakai pecahan secara eksak di Python?'),
      a: L(
        'Use the Fraction class from the fractions module. It keeps integers for the top and bottom, reduces automatically, and adds, subtracts, multiplies and divides exactly. Pass a string such as 0.1, because Fraction of the float 0.1 holds the float’s binary error.',
        'Pakai kelas Fraction dari modul fractions. Kelas itu menyimpan bilangan bulat untuk pembilang dan penyebut, menyederhanakan otomatis, dan menjumlah, mengurang, mengali, serta membagi secara eksak. Berikan string desimal, bukan float, sebab Fraction dari float sepersepuluh menyimpan galat biner float itu.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'The Rhind Mathematical Papyrus', author: 'Arnold Buffum Chace', year: 1927, source: 'Mathematical Association of America' },
    { title: 'Fibonacci’s Liber Abaci: A Translation into Modern English of Leonardo Pisano’s Book of Calculation', author: 'Laurence Sigler', year: 2002, source: 'Springer' },
    { title: 'De Thiende (The Art of Tenths)', author: 'Simon Stevin', year: 1585 },
    { title: 'A History of Mathematical Notations', author: 'Florian Cajori', year: 1928, source: 'Open Court Publishing Company' },
    { title: 'The Python Standard Library: fractions, rational numbers', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/fractions.html' },
  ],

  related: ['real-numbers', 'irrational-numbers', 'integers', 'exponents-and-radicals'],
}
