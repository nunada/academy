import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './arithmetic-sequences-and-series.meta'

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
    T`**An arithmetic sequence is a list of numbers in which each term is the previous one plus the same fixed amount $d$, the common difference: $3,7,11,15,\ldots$ has $d=4$.** Its $n$-th term is $a_n=a_1+(n-1)d$, and the sum of the first $n$ terms, an arithmetic series, is $S_n=\frac n2(a_1+a_n)$. The sum formula comes from Gauss's trick of pairing the first and last terms, which all add to the same number.`,
    T`**Barisan aritmetika adalah daftar bilangan yang setiap sukunya sama dengan suku sebelumnya ditambah jumlah tetap $d$, yaitu beda: $3,7,11,15,\ldots$ memiliki $d=4$.** Suku ke-$n$-nya adalah $a_n=a_1+(n-1)d$, dan jumlah $n$ suku pertama, yaitu deret aritmetika, adalah $S_n=\frac n2(a_1+a_n)$. Rumus jumlah itu berasal dari trik Gauss memasangkan suku pertama dan terakhir, yang semuanya berjumlah sama.`,
  ),

  keyPoints: [
    L(
      T`In an arithmetic sequence the difference between neighbors is constant: $a_{n+1}-a_n=d$ for every $n$, and each term is the average of the two beside it.`,
      T`Pada barisan aritmetika selisih antartetangga konstan: $a_{n+1}-a_n=d$ untuk setiap $n$, dan setiap suku adalah rata-rata dari dua suku di sampingnya.`,
    ),
    L(
      T`The $n$-th term is $a_n=a_1+(n-1)d$, a linear function of $n$ with slope $d$, so its points lie on a straight line.`,
      T`Suku ke-$n$ adalah $a_n=a_1+(n-1)d$, fungsi linear dari $n$ dengan kemiringan $d$, sehingga titik-titiknya terletak pada garis lurus.`,
    ),
    L(
      T`Two terms are enough to find the whole sequence: $d=\dfrac{a_q-a_p}{q-p}$, then $a_1=a_p-(p-1)d$.`,
      T`Dua suku cukup untuk menemukan seluruh barisan: $d=\dfrac{a_q-a_p}{q-p}$, lalu $a_1=a_p-(p-1)d$.`,
    ),
    L(
      T`The sum of the first $n$ terms is $S_n=\frac n2(a_1+a_n)=\frac n2\bigl(2a_1+(n-1)d\bigr)$; for example $1+2+\cdots+100=5050$.`,
      T`Jumlah $n$ suku pertama adalah $S_n=\frac n2(a_1+a_n)=\frac n2\bigl(2a_1+(n-1)d\bigr)$; misalnya $1+2+\cdots+100=5050$.`,
    ),
    L(
      T`To count terms from $a_1$ to a last term $\ell$, use $n=\dfrac{\ell-a_1}{d}+1$ and check that $n$ is a whole number.`,
      T`Untuk menghitung banyak suku dari $a_1$ sampai suku terakhir $\ell$, pakai $n=\dfrac{\ell-a_1}{d}+1$ dan periksa bahwa $n$ bilangan bulat.`,
    ),
    L(
      T`An infinite arithmetic series with $d\neq0$ (or $a_1\neq0$) never settles on a total: its partial sums grow without bound.`,
      T`Deret aritmetika tak hingga dengan $d\neq0$ (atau $a_1\neq0$) tidak pernah menetap pada suatu jumlah: jumlah parsialnya membesar tanpa batas.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-an-arithmetic-sequence',
      heading: L('What is an arithmetic sequence?', 'Apa itu barisan aritmetika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An arithmetic sequence (or arithmetic progression) is a list of numbers $a_1,a_2,a_3,\ldots$ in which the difference between each term and the one before it is always the same number $d$, called the common difference.** The notation is $a_n$ for the term in position $n$, and in many school books $U_n$.

That gives the rule $a_{n+1}=a_n+d$: to get the next term, add $d$. A **sequence** is the list itself; a **series** is what you get by adding its terms, which the sum section below takes up.

| Sequence | Common difference | Kind |
|---|---|---|
| $2,5,8,11,\ldots$ | $d=3$ | increasing |
| $20,15,10,5,\ldots$ | $d=-5$ | decreasing |
| $\frac12,1,\frac32,2,\ldots$ | $d=\frac12$ | increasing, with fractions |
| $7,7,7,7,\ldots$ | $d=0$ | constant |
| $2,4,8,16,\ldots$ | differences $2,4,8$ | **not** arithmetic: each term is doubled |
| $1,4,9,16,\ldots$ | differences $3,5,7$ | **not** arithmetic: the differences grow |

**How to tell.** Subtract each term from the next, always later minus earlier. If every difference is the same, the sequence is arithmetic. One difference that breaks the pattern is enough to rule it out. A sequence whose terms are multiplied by the same number each time is a [geometric sequence](article:geometric-sequences-and-series#what-is-a-geometric-sequence), built from the powers in the article on [exponents](article:exponents-and-radicals#what-is-an-exponent).

Two useful facts follow at once. Each term is the average of its two neighbors, $a_n=\frac{a_{n-1}+a_{n+1}}{2}$, which is why the word *arithmetic* is used: the arithmetic mean sits in the middle. And differences may be negative or fractions, so the [integers](article:integers#add-subtract) rules for negative numbers and the [rational numbers](article:rational-numbers#add-subtract-fractions) rules for fractions apply.

**Where they appear.** Equal steps are everywhere: the heights of the steps in a staircase, seats in rows that each have 3 more than the one in front, a monthly saving that rises by a fixed amount, a taxi fare that adds a fixed charge per kilometer, a simple (not compound) interest balance. Type a list of numbers below and see whether it is arithmetic.`,
            T`**Barisan aritmetika (atau progresi aritmetika) adalah daftar bilangan $a_1,a_2,a_3,\ldots$ yang selisih antara tiap suku dan suku sebelumnya selalu bilangan yang sama $d$, yang disebut beda.** Notasinya $a_n$ untuk suku pada posisi $n$, dan di banyak buku sekolah $U_n$.

Itu memberi aturan $a_{n+1}=a_n+d$: untuk mendapat suku berikutnya, tambahkan $d$. **Barisan** adalah daftar itu sendiri; **deret** adalah hasil menjumlahkan suku-sukunya, yang dibahas pada bagian jumlah di bawah.

| Barisan | Beda | Jenis |
|---|---|---|
| $2,5,8,11,\ldots$ | $d=3$ | naik |
| $20,15,10,5,\ldots$ | $d=-5$ | turun |
| $\frac12,1,\frac32,2,\ldots$ | $d=\frac12$ | naik, dengan pecahan |
| $7,7,7,7,\ldots$ | $d=0$ | konstan |
| $2,4,8,16,\ldots$ | selisih $2,4,8$ | **bukan** aritmetika: tiap suku dilipatduakan |
| $1,4,9,16,\ldots$ | selisih $3,5,7$ | **bukan** aritmetika: selisihnya membesar |

**Cara mengetahuinya.** Kurangkan tiap suku dari suku berikutnya, selalu yang kemudian dikurangi yang lebih dulu. Jika setiap selisih sama, barisannya aritmetika. Satu selisih yang menyimpang saja cukup untuk menyingkirkannya. Barisan yang sukunya dikalikan bilangan yang sama setiap kali adalah [barisan geometri](article:geometric-sequences-and-series#what-is-a-geometric-sequence), yang dibangun dari pangkat pada artikel [eksponen](article:exponents-and-radicals#what-is-an-exponent).

Dua fakta berguna langsung mengikutinya. Setiap suku adalah rata-rata dari dua tetangganya, $a_n=\frac{a_{n-1}+a_{n+1}}{2}$, itulah sebabnya kata *aritmetika* dipakai: rata-rata aritmetika berada di tengah. Dan beda boleh negatif atau pecahan, sehingga aturan [bilangan bulat](article:integers#add-subtract) untuk bilangan negatif dan aturan [bilangan rasional](article:rational-numbers#add-subtract-fractions) untuk pecahan berlaku.

**Di mana ia muncul.** Langkah yang sama ada di mana-mana: tinggi anak tangga, kursi pada baris yang masing-masing 3 lebih banyak daripada baris di depannya, tabungan bulanan yang naik dengan jumlah tetap, ongkos taksi yang menambah biaya tetap per kilometer, saldo dengan bunga tunggal (bukan majemuk). Ketik daftar bilangan di bawah dan lihat apakah ia aritmetika.`,
          ),
        },
        { kind: 'widget', name: 'arithdetect' },
        {
          kind: 'activity',
          title: L('Try it: spot the arithmetic sequence', 'Coba: kenali barisan aritmetika'),
          step: {
            kind: 'quiz',
            id: 'a1',
            prompt: L('Which of these is an arithmetic sequence?', 'Manakah di antara ini yang barisan aritmetika?'),
            options: [L('$2,4,8,16$', '$2,4,8,16$'), L('$3,7,11,15$', '$3,7,11,15$'), L('$1,4,9,16$', '$1,4,9,16$'), L('$1,1,2,3$', '$1,1,2,3$')],
            answer: 1,
            explain: L(
              '$3,7,11,15$ goes up by 4 each time. $2,4,8,16$ doubles, $1,4,9,16$ has differences $3,5,7$, and $1,1,2,3$ has differences $0,1,1$.',
              '$3,7,11,15$ naik 4 setiap kali. $2,4,8,16$ dilipatduakan, $1,4,9,16$ selisihnya $3,5,7$, dan $1,1,2,3$ selisihnya $0,1,1$.',
            ),
            hint: L('Subtract neighbors and compare the differences.', 'Kurangkan tetangga dan bandingkan selisihnya.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------- nth term */
    {
      id: 'nth-term',
      heading: L('How do you find the n-th term of an arithmetic sequence?', 'Bagaimana mencari suku ke-n barisan aritmetika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The $n$-th term of an arithmetic sequence is $a_n=a_1+(n-1)d$: start at the first term and add the difference $n-1$ times.** The reason for $n-1$ is that going from term 1 to term $n$ takes $n-1$ steps, not $n$.

For $5,9,13,\ldots$ the first term is 5 and $d=4$, so $a_n=5+(n-1)\cdot4=4n+1$ and $a_{20}=5+19\cdot4=81$.

**It is a linear function.** Expanding gives $a_n=dn+(a_1-d)$, which is a straight line in $n$ with slope $d$ and, for $n=0$, the intercept $a_1-d$. That is why the points of an arithmetic sequence lie on a line, and why the section on [algebraic expressions](article:algebraic-expressions#what-is-an-algebraic-expression) calls it linear: it has degree 1. A positive $d$ tilts the line up, a negative $d$ tilts it down, and $d=0$ makes it flat.

**How many terms?** Solve $a_n=\ell$ for $n$: $n=\dfrac{\ell-a_1}{d}+1$. For $7,12,17,\ldots,102$ this is $\frac{102-7}{5}+1=20$. The answer must be a positive whole number, which also tells you whether a number belongs to the sequence: for 100 it is $\frac{100-7}{5}+1=19.6$, so 100 is not a term. The same count gives the number of multiples of 7 from 100 to 500: the first is $105=7\cdot15$ and the last $497=7\cdot71$, so $n=71-15+1=57$.

Choose a first term, a difference and a length below, and watch the terms, the formula and the straight line.`,
            T`**Suku ke-$n$ barisan aritmetika adalah $a_n=a_1+(n-1)d$: mulai dari suku pertama dan tambahkan beda sebanyak $n-1$ kali.** Alasan $n-1$ adalah bahwa dari suku 1 ke suku $n$ diperlukan $n-1$ langkah, bukan $n$.

Untuk $5,9,13,\ldots$ suku pertamanya 5 dan $d=4$, sehingga $a_n=5+(n-1)\cdot4=4n+1$ dan $a_{20}=5+19\cdot4=81$.

**Ia fungsi linear.** Menjabarkan memberi $a_n=dn+(a_1-d)$, yaitu garis lurus dalam $n$ dengan kemiringan $d$ dan, untuk $n=0$, perpotongan $a_1-d$. Itulah sebabnya titik-titik barisan aritmetika terletak pada garis, dan mengapa bagian [bentuk aljabar](article:algebraic-expressions#what-is-an-algebraic-expression) menyebutnya linear: ia berderajat 1. $d$ positif memiringkan garis ke atas, $d$ negatif memiringkannya ke bawah, dan $d=0$ membuatnya datar.

**Berapa banyak suku?** Selesaikan $a_n=\ell$ untuk $n$: $n=\dfrac{\ell-a_1}{d}+1$. Untuk $7,12,17,\ldots,102$ ini $\frac{102-7}{5}+1=20$. Jawabannya harus bilangan bulat positif, yang juga memberi tahu apakah suatu bilangan termasuk dalam barisan: untuk 100 hasilnya $\frac{100-7}{5}+1=19{,}6$, sehingga 100 bukan suku. Hitungan yang sama memberi banyak kelipatan 7 dari 100 sampai 500: yang pertama $105=7\cdot15$ dan yang terakhir $497=7\cdot71$, sehingga $n=71-15+1=57$.

Pilih suku pertama, beda, dan panjang di bawah, dan perhatikan suku-sukunya, rumusnya, dan garis lurusnya.`,
          ),
        },
        { kind: 'widget', name: 'arithseq' },
        {
          kind: 'activity',
          title: L('Try it: the 20th term', 'Coba: suku ke-20'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Here $a_1=5$ and $d=4$.', 'Di sini $a_1=5$ dan $d=4$.'),
              L('$a_{20}=5+19\\cdot4$.', '$a_{20}=5+19\\cdot4$.'),
            ],
            explain: L('$a_{20}=5+(20-1)\\cdot4=5+76=81$.', '$a_{20}=5+(20-1)\\cdot4=5+76=81$.'),
            prompt: L('Find the 20th term of $5,9,13,\\ldots$', 'Tentukan suku ke-20 dari $5,9,13,\\ldots$'),
            given: String.raw`a_{20}=v`,
            blanks: [{ label: 'v =', answer: 81 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: how many terms?', 'Coba: berapa banyak suku?'),
          step: {
            kind: 'math',
            id: 'a3',
            hints: [
              L('Use $n=\\frac{\\ell-a_1}{d}+1$ with $a_1=7$, $d=5$, $\\ell=102$.', 'Pakai $n=\\frac{\\ell-a_1}{d}+1$ dengan $a_1=7$, $d=5$, $\\ell=102$.'),
              L('$\\frac{95}{5}+1$.', '$\\frac{95}{5}+1$.'),
            ],
            explain: L('$n=\\frac{102-7}{5}+1=19+1=20$.', '$n=\\frac{102-7}{5}+1=19+1=20$.'),
            prompt: L('How many terms are in $7,12,17,\\ldots,102$?', 'Berapa banyak suku dalam $7,12,17,\\ldots,102$?'),
            given: String.raw`7,12,17,\ldots,102:\quad n=v`,
            blanks: [{ label: 'v =', answer: 20 }],
          },
        },
      ],
    },

    /* --------------------------------------------------------------- two terms */
    {
      id: 'from-two-terms',
      heading: L('How do you find a sequence from two of its terms?', 'Bagaimana menemukan barisan dari dua sukunya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two terms and their positions fix an arithmetic sequence completely: subtract them to find $d$, then step back to $a_1$.** Between term $p$ and term $q$ there are $q-p$ steps of size $d$, so $a_q-a_p=(q-p)d$ and

$d=\dfrac{a_q-a_p}{q-p},\qquad a_1=a_p-(p-1)d.$

Example: $a_3=11$ and $a_7=23$. Then $d=\frac{23-11}{7-3}=\frac{12}{4}=3$ and $a_1=11-2\cdot3=5$, so the sequence is $5,8,11,14,\ldots$ with $a_n=3n+2$. Check: $a_3=11$, $a_7=23$.

The usual slip is to divide by the wrong number: divide by the number of *steps* $q-p$ (here 4), not by $p$, $q$ or $q+p$. The two positions can be given in either order, because swapping them changes both the top and the bottom signs.

**Arithmetic means.** Inserting $k$ numbers between $a$ and $b$ so that the whole list is arithmetic is the same problem with $q-p=k+1$ steps: $d=\frac{b-a}{k+1}$. Three means between 4 and 24 have $d=\frac{20}{4}=5$ and are 9, 14, 19. With one mean the answer is the plain average $\frac{a+b}{2}$.

Give any two terms below and see the whole working.`,
            T`**Dua suku beserta posisinya menentukan barisan aritmetika sepenuhnya: kurangkan keduanya untuk mendapat $d$, lalu mundur ke $a_1$.** Di antara suku $p$ dan suku $q$ ada $q-p$ langkah sebesar $d$, sehingga $a_q-a_p=(q-p)d$ dan

$d=\dfrac{a_q-a_p}{q-p},\qquad a_1=a_p-(p-1)d.$

Contoh: $a_3=11$ dan $a_7=23$. Maka $d=\frac{23-11}{7-3}=\frac{12}{4}=3$ dan $a_1=11-2\cdot3=5$, sehingga barisannya $5,8,11,14,\ldots$ dengan $a_n=3n+2$. Periksa: $a_3=11$, $a_7=23$.

Kekeliruan yang biasa adalah membagi dengan bilangan yang salah: bagi dengan banyaknya *langkah* $q-p$ (di sini 4), bukan dengan $p$, $q$, atau $q+p$. Kedua posisi boleh diberikan dalam urutan apa pun, karena menukarnya mengubah tanda atas dan bawah sekaligus.

**Rata-rata aritmetika (sisipan).** Menyisipkan $k$ bilangan di antara $a$ dan $b$ sehingga seluruh daftarnya aritmetika adalah masalah yang sama dengan $q-p=k+1$ langkah: $d=\frac{b-a}{k+1}$. Tiga sisipan di antara 4 dan 24 punya $d=\frac{20}{4}=5$ dan berupa 9, 14, 19. Dengan satu sisipan jawabannya rata-rata biasa $\frac{a+b}{2}$.

Beri dua suku apa pun di bawah dan lihat seluruh langkahnya.`,
          ),
        },
        { kind: 'widget', name: 'twoterms' },
        {
          kind: 'activity',
          title: L('Try it: from two terms', 'Coba: dari dua suku'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('From $a_3$ to $a_7$ there are $7-3=4$ steps, and the terms grow by $23-11=12$.', 'Dari $a_3$ ke $a_7$ ada $7-3=4$ langkah, dan suku-sukunya bertambah $23-11=12$.'),
              L('$d=12\\div4=3$; then $a_1=a_3-2d$.', '$d=12\\div4=3$; lalu $a_1=a_3-2d$.'),
            ],
            explain: L('$d=\\frac{23-11}{4}=3$ and $a_1=11-2\\cdot3=5$.', '$d=\\frac{23-11}{4}=3$ dan $a_1=11-2\\cdot3=5$.'),
            prompt: L('An arithmetic sequence has $a_3=11$ and $a_7=23$. Find $d$ and $a_1$.', 'Barisan aritmetika memiliki $a_3=11$ dan $a_7=23$. Tentukan $d$ dan $a_1$.'),
            given: String.raw`a_3=11,\ a_7=23`,
            blanks: [
              { label: 'd =', answer: 3 },
              { label: 'a₁ =', answer: 5 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: arithmetic means', 'Coba: rata-rata aritmetika'),
          step: {
            kind: 'math',
            id: 'a5',
            hints: [
              L('Between 4 and 24 there are 4 steps: $d=\\frac{24-4}{4}$.', 'Di antara 4 dan 24 ada 4 langkah: $d=\\frac{24-4}{4}$.'),
              L('The terms are $4,9,14,19,24$; the middle one is $4+2d$.', 'Suku-sukunya $4,9,14,19,24$; yang di tengah adalah $4+2d$.'),
            ],
            explain: L('$d=5$, so the sequence is $4,9,14,19,24$ and the middle term is 14, the average of 4 and 24.', '$d=5$, sehingga barisannya $4,9,14,19,24$ dan suku tengahnya 14, rata-rata dari 4 dan 24.'),
            prompt: L('Three numbers are inserted between 4 and 24 to make an arithmetic sequence. Find the middle one.', 'Tiga bilangan disisipkan di antara 4 dan 24 agar menjadi barisan aritmetika. Tentukan yang di tengah.'),
            given: String.raw`4,\ ?,\ v,\ ?,\ 24`,
            blanks: [{ label: 'v =', answer: 14 }],
          },
        },
      ],
    },

    /* -------------------------------------------------------------------- sum */
    {
      id: 'sum-of-an-arithmetic-series',
      heading: L('How do you find the sum of an arithmetic series?', 'Bagaimana mencari jumlah deret aritmetika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The sum of the first $n$ terms of an arithmetic sequence is $S_n=\dfrac n2(a_1+a_n)=\dfrac n2\bigl(2a_1+(n-1)d\bigr)$: the number of terms times the average of the first and the last.** A sum of terms like this is called an *arithmetic series*, and $S_n$ is its $n$-th partial sum.

**Gauss's trick.** Write the sum twice, once forward and once backward, and add the columns:

$S_n=a_1+a_2+\cdots+a_n$

$S_n=a_n+a_{n-1}+\cdots+a_1$

In every column the sum is the same, $a_1+a_n$, because moving one place along adds $d$ to one term and takes it from the other. There are $n$ columns, so $2S_n=n(a_1+a_n)$. The story goes that Gauss, as a schoolboy, found $1+2+\cdots+100$ this way: 50 pairs of 101, which is 5050.

**Examples.**

- $5+9+13+\cdots$ with 20 terms: $a_{20}=81$, so $S_{20}=\frac{20}{2}(5+81)=860$.
- $3+8+13+\cdots+98$: it has $\frac{98-3}{5}+1=20$ terms, so the sum is $\frac{20}{2}(3+98)=1010$.
- The multiples of 7 from 105 to 497, 57 of them: $\frac{57}{2}(105+497)=17{,}157$.

**Three sums worth knowing.** $1+2+\cdots+n=\frac{n(n+1)}{2}$ (the triangular numbers 1, 3, 6, 10, 15); the first $n$ odd numbers add to $n^2$, since $1+3+5+\cdots+(2n-1)=\frac n2\cdot2n$; and the first $n$ even numbers add to $n(n+1)$.

**Sigma notation** writes a series compactly: $\sum_{k=1}^{n}(a_1+(k-1)d)$ means "add the terms for $k=1$ up to $k=n$". For example $\sum_{k=1}^{10}(3k+2)=5+8+\cdots+32=\frac{10}{2}(5+32)=185$.

**$S_n$ is quadratic in $n$.** Expanding gives $S_n=\frac d2n^2+\bigl(a_1-\frac d2\bigr)n$, a quadratic with no constant term, which is how to recognize one. And you can run it backward: $a_n=S_n-S_{n-1}$ for $n\ge2$ (and $a_1=S_1$). If $S_n=2n^2+3n$ then $a_1=5$ and $a_n=\bigl(2n^2+3n\bigr)-\bigl(2(n-1)^2+3(n-1)\bigr)=4n+1$, which is the sequence $5,9,13,\ldots$ again.

Try the pairing for your own sequence below.`,
            T`**Jumlah $n$ suku pertama barisan aritmetika adalah $S_n=\dfrac n2(a_1+a_n)=\dfrac n2\bigl(2a_1+(n-1)d\bigr)$: banyak suku dikali rata-rata suku pertama dan suku terakhir.** Jumlah suku-suku seperti ini disebut *deret aritmetika*, dan $S_n$ adalah jumlah parsial ke-$n$-nya.

**Trik Gauss.** Tulis jumlahnya dua kali, sekali maju dan sekali mundur, lalu jumlahkan kolomnya:

$S_n=a_1+a_2+\cdots+a_n$

$S_n=a_n+a_{n-1}+\cdots+a_1$

Pada setiap kolom jumlahnya sama, $a_1+a_n$, karena bergeser satu tempat menambah $d$ pada satu suku dan mengambilnya dari yang lain. Ada $n$ kolom, sehingga $2S_n=n(a_1+a_n)$. Konon Gauss, sebagai anak sekolah, menemukan $1+2+\cdots+100$ dengan cara ini: 50 pasang 101, yaitu 5050.

**Contoh.**

- $5+9+13+\cdots$ dengan 20 suku: $a_{20}=81$, sehingga $S_{20}=\frac{20}{2}(5+81)=860$.
- $3+8+13+\cdots+98$: banyak sukunya $\frac{98-3}{5}+1=20$, sehingga jumlahnya $\frac{20}{2}(3+98)=1010$.
- Kelipatan 7 dari 105 sampai 497, sebanyak 57: $\frac{57}{2}(105+497)=17.157$.

**Tiga jumlah yang layak diketahui.** $1+2+\cdots+n=\frac{n(n+1)}{2}$ (bilangan segitiga 1, 3, 6, 10, 15); $n$ bilangan ganjil pertama berjumlah $n^2$, sebab $1+3+5+\cdots+(2n-1)=\frac n2\cdot2n$; dan $n$ bilangan genap pertama berjumlah $n(n+1)$.

**Notasi sigma** menulis deret secara ringkas: $\sum_{k=1}^{n}(a_1+(k-1)d)$ berarti "jumlahkan suku-suku untuk $k=1$ sampai $k=n$". Misalnya $\sum_{k=1}^{10}(3k+2)=5+8+\cdots+32=\frac{10}{2}(5+32)=185$.

**$S_n$ kuadrat dalam $n$.** Menjabarkan memberi $S_n=\frac d2n^2+\bigl(a_1-\frac d2\bigr)n$, sebuah kuadrat tanpa suku konstanta, yang menjadi cara mengenalinya. Dan kamu dapat menjalankannya mundur: $a_n=S_n-S_{n-1}$ untuk $n\ge2$ (dan $a_1=S_1$). Jika $S_n=2n^2+3n$ maka $a_1=5$ dan $a_n=\bigl(2n^2+3n\bigr)-\bigl(2(n-1)^2+3(n-1)\bigr)=4n+1$, yaitu barisan $5,9,13,\ldots$ lagi.

Coba pemasangan itu untuk barisanmu sendiri di bawah.`,
          ),
        },
        { kind: 'widget', name: 'gauss' },
        {
          kind: 'activity',
          title: L('Try it: the sum of 20 terms', 'Coba: jumlah 20 suku'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('The last term is $a_{20}=81$, found earlier.', 'Suku terakhirnya $a_{20}=81$, yang tadi sudah ditemukan.'),
              L('$S_{20}=\\frac{20}{2}(5+81)$.', '$S_{20}=\\frac{20}{2}(5+81)$.'),
            ],
            explain: L('$S_{20}=10\\cdot(5+81)=10\\cdot86=860$.', '$S_{20}=10\\cdot(5+81)=10\\cdot86=860$.'),
            prompt: L('Find the sum of the first 20 terms of $5,9,13,\\ldots$', 'Tentukan jumlah 20 suku pertama dari $5,9,13,\\ldots$'),
            given: String.raw`S_{20}=v`,
            blanks: [{ label: 'v =', answer: 860 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: odd numbers', 'Coba: bilangan ganjil'),
          step: {
            kind: 'math',
            id: 'a7',
            hints: [
              L('$1,3,5,\\ldots,99$ has $\\frac{99-1}{2}+1=50$ terms.', '$1,3,5,\\ldots,99$ memiliki $\\frac{99-1}{2}+1=50$ suku.'),
              L('$S=\\frac{50}{2}(1+99)$.', '$S=\\frac{50}{2}(1+99)$.'),
            ],
            explain: L('There are 50 terms, so $S=25\\cdot100=2500=50^2$.', 'Ada 50 suku, sehingga $S=25\\cdot100=2500=50^2$.'),
            prompt: L('Find $1+3+5+\\cdots+99$.', 'Tentukan $1+3+5+\\cdots+99$.'),
            given: String.raw`1+3+5+\cdots+99=v`,
            blanks: [{ label: 'v =', answer: 2500 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: sigma notation', 'Coba: notasi sigma'),
          step: {
            kind: 'math',
            id: 'a8',
            hints: [
              L('The first term is $3\\cdot1+2=5$ and the last is $3\\cdot10+2=32$.', 'Suku pertama $3\\cdot1+2=5$ dan yang terakhir $3\\cdot10+2=32$.'),
              L('$S=\\frac{10}{2}(5+32)$.', '$S=\\frac{10}{2}(5+32)$.'),
            ],
            explain: L('$\\sum_{k=1}^{10}(3k+2)=\\frac{10}{2}(5+32)=5\\cdot37=185$.', '$\\sum_{k=1}^{10}(3k+2)=\\frac{10}{2}(5+32)=5\\cdot37=185$.'),
            prompt: L('Evaluate the sum.', 'Hitung jumlahnya.'),
            given: String.raw`\sum_{k=1}^{10}(3k+2)=v`,
            blanks: [{ label: 'v =', answer: 185 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- infinite */
    {
      id: 'infinite-arithmetic-series',
      heading: L('What happens to an infinite arithmetic series?', 'Apa yang terjadi pada deret aritmetika tak hingga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An infinite arithmetic series has no finite sum unless every term is 0: its partial sums grow without bound.** Adding more terms keeps changing the total by a non-zero amount, and with $d\neq0$ the terms themselves get larger in size, so the sum cannot settle.

- If $d>0$ the partial sums $S_n=\frac d2n^2+\bigl(a_1-\frac d2\bigr)n$ eventually grow to $+\infty$.
- If $d<0$ they eventually fall to $-\infty$.
- If $d=0$ and $a_1\neq0$ then $S_n=na_1$ also grows without bound.

Such a series is said to **diverge**. This is a sharp contrast with a [geometric series](article:geometric-sequences-and-series#infinite-geometric-series) with a common ratio of size less than 1, such as $\frac12+\frac14+\frac18+\cdots$, whose terms shrink fast enough for the sum to settle at 1. In practice that means every question about an arithmetic series asks for a finite number of terms. If a problem seems to ask for the sum of an infinite arithmetic series, it is a geometric series in disguise or the answer is "it diverges".`,
            T`**Deret aritmetika tak hingga tidak punya jumlah berhingga kecuali setiap sukunya 0: jumlah parsialnya membesar tanpa batas.** Menambah lebih banyak suku terus mengubah jumlah dengan nilai bukan nol, dan dengan $d\neq0$ sukunya sendiri makin besar ukurannya, sehingga jumlahnya tidak dapat menetap.

- Jika $d>0$ jumlah parsial $S_n=\frac d2n^2+\bigl(a_1-\frac d2\bigr)n$ akhirnya membesar menuju $+\infty$.
- Jika $d<0$ jumlah itu akhirnya turun menuju $-\infty$.
- Jika $d=0$ dan $a_1\neq0$ maka $S_n=na_1$ juga membesar tanpa batas.

Deret seperti itu dikatakan **divergen**. Ini kontras tajam dengan [deret geometri](article:geometric-sequences-and-series#infinite-geometric-series) yang rasionya berukuran kurang dari 1, seperti $\frac12+\frac14+\frac18+\cdots$, yang sukunya mengecil cukup cepat sehingga jumlahnya menetap di 1. Dalam praktik itu berarti setiap pertanyaan tentang deret aritmetika meminta banyak suku yang berhingga. Jika suatu soal tampak meminta jumlah deret aritmetika tak hingga, itu deret geometri yang menyamar atau jawabannya "divergen".`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------ word problems */
    {
      id: 'word-problems',
      heading: L('How do you solve word problems with arithmetic sequences?', 'Bagaimana menyelesaikan soal cerita barisan aritmetika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Read the problem for three things, the first term $a_1$, the common difference $d$ and what is asked (a term, a count, or a sum), then use the matching formula.** Check at the end that the answer is sensible and a whole number where it counts objects.

| Problem | $a_1$, $d$ | Answer |
|---|---|---|
| A theater has 20 seats in row 1 and each row has 3 more. How many in row 15? | $20$, $3$ | $20+14\cdot3=62$ seats |
| How many seats in all 15 rows? | same | $\frac{15}{2}(20+62)=615$ seats |
| You save 100 dollars in month 1 and 50 more each month than the month before. How much in month 12, and in total? | $100$, $50$ | $100+11\cdot50=650$ dollars; $\frac{12}{2}(100+650)=4500$ dollars |
| A salary of 40,000 dollars rises by 2,500 each year. What is it in year 8, and what is the 8-year total? | $40000$, $2500$ | $40000+7\cdot2500=57500$; $\frac82(40000+57500)=390000$ dollars |
| Logs are stacked 10 in the bottom row, one fewer in each row up to 1. How many logs? | $10$, $-1$ | $10+9+\cdots+1=\frac{10}{2}(10+1)=55$ |

Notice that "each row has 3 more" and "50 more each month" give $d$ directly, and that a drop gives a negative $d$. Notice too that the term in position 15 is only 14 steps from the first, the same $n-1$ as in the formula.

**Simple interest** is an arithmetic sequence: a deposit of $P$ earning a fixed amount $I$ a year is worth $P,\ P+I,\ P+2I,\ldots$, so after $n$ years it is $P+nI$. Compound interest multiplies by a fixed ratio instead and gives a geometric sequence.`,
            T`**Bacalah soal untuk tiga hal, suku pertama $a_1$, beda $d$, dan yang ditanyakan (sebuah suku, banyaknya, atau jumlah), lalu pakai rumus yang sesuai.** Periksa di akhir bahwa jawabannya masuk akal dan bilangan bulat bila menghitung benda.

| Soal | $a_1$, $d$ | Jawaban |
|---|---|---|
| Gedung pertunjukan punya 20 kursi di baris 1 dan tiap baris berikutnya 3 kursi lebih banyak. Berapa kursi di baris 15? | $20$, $3$ | $20+14\cdot3=62$ kursi |
| Berapa kursi di seluruh 15 baris? | sama | $\frac{15}{2}(20+62)=615$ kursi |
| Kamu menabung Rp100.000 pada bulan 1 dan Rp50.000 lebih banyak tiap bulan daripada bulan sebelumnya. Berapa pada bulan 12, dan totalnya? | $100000$, $50000$ | $100000+11\cdot50000=650000$, yaitu Rp650.000; $\frac{12}{2}(100000+650000)=4500000$, yaitu Rp4.500.000 |
| Gaji Rp4.000.000 naik Rp250.000 tiap tahun. Berapa pada tahun ke-8, dan total 8 tahun? | $4000000$, $250000$ | $4000000+7\cdot250000=5750000$; $\frac82(4000000+5750000)=39000000$, yaitu Rp39.000.000 |
| Kayu ditumpuk 10 pada baris bawah, satu lebih sedikit tiap baris sampai 1. Berapa batang kayu? | $10$, $-1$ | $10+9+\cdots+1=\frac{10}{2}(10+1)=55$ |

Perhatikan bahwa "tiap baris 3 lebih banyak" dan "Rp50.000 lebih banyak tiap bulan" memberi $d$ langsung, dan penurunan memberi $d$ negatif. Perhatikan juga bahwa suku pada posisi 15 hanya 14 langkah dari yang pertama, $n-1$ yang sama seperti pada rumus.

**Bunga tunggal** adalah barisan aritmetika: simpanan $P$ yang menghasilkan jumlah tetap $I$ per tahun bernilai $P,\ P+I,\ P+2I,\ldots$, sehingga setelah $n$ tahun menjadi $P+nI$. Bunga majemuk mengalikan dengan rasio tetap dan menghasilkan barisan geometri.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: seats in a theater', 'Coba: kursi di gedung pertunjukan'),
          step: {
            kind: 'quiz',
            id: 'a9',
            prompt: L('A theater has 20 seats in the first row and each row has 3 seats more than the row before. How many seats are in row 15?', 'Gedung pertunjukan punya 20 kursi pada baris pertama dan tiap baris punya 3 kursi lebih banyak daripada baris sebelumnya. Berapa kursi pada baris ke-15?'),
            options: [L('$59$', '$59$'), L('$62$', '$62$'), L('$65$', '$65$'), L('$60$', '$60$')],
            answer: 1,
            explain: L(
              'Row 15 is 14 steps from row 1: $a_{15}=20+14\\cdot3=62$. Using 15 steps by mistake would give 65.',
              'Baris 15 berjarak 14 langkah dari baris 1: $a_{15}=20+14\\cdot3=62$. Memakai 15 langkah karena keliru akan memberi 65.',
            ),
            hint: L('How many steps are there from row 1 to row 15?', 'Berapa banyak langkah dari baris 1 ke baris 15?'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'sequences-in-code',
      heading: L('How do you work with arithmetic sequences in Python and JavaScript?', 'Bagaimana mengolah barisan aritmetika di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In Python ´range(first, stop, step)´ is an arithmetic sequence of integers, and ´sum´ of it is an arithmetic series; in JavaScript you build the terms with ´Array.from´.** The stop value of ´range´ is excluded, which is the usual source of off-by-one mistakes.`,
            T`**Di Python ´range(awal, berhenti, langkah)´ adalah barisan aritmetika bilangan bulat, dan ´sum´ darinya adalah deret aritmetika; di JavaScript kamu membangun suku-sukunya dengan ´Array.from´.** Nilai berhenti pada ´range´ tidak termasuk, yang menjadi sumber umum kekeliruan selisih satu.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> list(range(3, 40, 4))                 # first, stop (excluded), step
[3, 7, 11, 15, 19, 23, 27, 31, 35, 39]
>>> a1, d, n = 3, 4, 10
>>> a1 + (n - 1) * d                         # the n-th term
39
>>> n * (2 * a1 + (n - 1) * d) // 2          # the sum of the first n terms (exact)
210
>>> sum(range(1, 101))                       # Gauss's sum
5050
>>> from itertools import accumulate
>>> list(accumulate(range(1, 6)))            # partial sums: 1, 3, 6, 10, 15
[1, 3, 6, 10, 15]
>>> len(range(105, 498, 7))                  # multiples of 7 from 105 to 497
57
>>> sum(range(105, 498, 7))
17157
>>> [i * 0.1 for i in range(4)]              # a float step drifts
[0.0, 0.1, 0.2, 0.30000000000000004]`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `const terms = (a1, d, n) => Array.from({ length: n }, (_, i) => a1 + i * d)
terms(3, 4, 5)                               // [3, 7, 11, 15, 19]
terms(3, 4, 5).reduce((s, x) => s + x, 0)    // 55
(5 * (2 * 3 + 4 * 4)) / 2                    // 55, from S = n(2a + (n-1)d)/2
Array.from({ length: 4 }, (_, i) => i * 0.1) // [0, 0.1, 0.2, 0.30000000000000004]`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´range(1, 100)´ for 1 to 100 | stops at 99 | the stop is excluded: ´range(1, 101)´ |
| ´a1 + n * d´ for the n-th term | gives the term after it | use ´a1 + (n - 1) * d´, or index from 0 |
| A float step such as 0.1 | the terms drift: ´0.30000000000000004´ | multiply integers or use ´Fraction´; do not add 0.1 repeatedly |
| ´range(0, 1, 0.1)´ | TypeError in Python: range wants integers | scale to integers, or use ´numpy.arange´ with care |
| ´n * (a1 + an) / 2´ in Python | gives a float | use ´//´ when everything is an integer: the product is always even |
| Summing a long sequence in a loop | slow for huge n | use the formula, which is a constant number of operations |

For exact fractional steps use ´fractions.Fraction´, as in the article on [rational numbers](article:rational-numbers#fractions-in-code). Check a formula by comparing it with ´sum(range(...))´ on small cases before trusting it on large ones.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´range(1, 100)´ untuk 1 sampai 100 | berhenti di 99 | nilai berhenti tidak termasuk: ´range(1, 101)´ |
| ´a1 + n * d´ untuk suku ke-n | memberi suku sesudahnya | pakai ´a1 + (n - 1) * d´, atau beri indeks dari 0 |
| Langkah float seperti 0,1 | suku-sukunya bergeser: ´0.30000000000000004´ | kalikan bilangan bulat atau pakai ´Fraction´; jangan menambah 0,1 berulang kali |
| ´range(0, 1, 0.1)´ | TypeError di Python: range meminta bilangan bulat | skalakan ke bilangan bulat, atau pakai ´numpy.arange´ dengan hati-hati |
| ´n * (a1 + an) / 2´ di Python | memberi float | pakai ´//´ bila semuanya bilangan bulat: hasil kalinya selalu genap |
| Menjumlah barisan panjang dalam perulangan | lambat untuk n besar | pakai rumus, yang jumlah operasinya tetap |

Untuk langkah pecahan yang eksak pakai ´fractions.Fraction´, seperti pada artikel [bilangan rasional](article:rational-numbers#fractions-in-code). Periksa sebuah rumus dengan membandingkannya dengan ´sum(range(...))´ pada kasus kecil sebelum memercayainya untuk yang besar.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do arithmetic sequences come from?', 'Dari mana asal barisan aritmetika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Arithmetic progressions are among the oldest patterns in mathematics, long before there was a notation for them.**

- **c. 1550 BCE.** The Rhind Papyrus has a problem that shares 10 measures of barley among 10 men so that each gets the same amount more than the one before: an arithmetic progression with difference $\frac18$.
- **5th century CE.** The Chinese *Zhang Qiujian suanjing* has a woman weaving cloth who weaves a fixed extra amount each day; the calculation was done on [counting rods](article:chinese-numbers#counting-rods).
- **499 CE.** Aryabhata gave rules in his *Aryabhatiya* for the sum of an arithmetic progression and for the number of its terms.
- **About 1787.** The classroom story about Gauss, aged nine or ten, is that his teacher set $1+2+\cdots+100$ to keep the class busy and Gauss answered 5050 at once, by pairing 1 with 100, 2 with 99 and so on. The story was written down long afterward and the details vary, but the idea of pairing is certainly his kind of insight, and it is the proof still given today.

The word *arithmetic* goes back to the Greek *arithmos*, number.`,
            T`**Progresi aritmetika termasuk pola tertua dalam matematika, jauh sebelum ada notasi untuknya.**

- **Sekitar 1550 SM.** Papirus Rhind memuat soal yang membagi 10 takaran jelai kepada 10 orang sehingga masing-masing mendapat jumlah yang sama lebih banyak daripada sebelumnya: progresi aritmetika dengan beda $\frac18$.
- **Abad ke-5 M.** *Zhang Qiujian suanjing* dari China memuat soal seorang perempuan menenun kain yang menenun tambahan tetap setiap hari; hitungannya dilakukan dengan [batang hitung](article:chinese-numbers#counting-rods).
- **499 M.** Aryabhata memberi aturan dalam *Aryabhatiya*-nya untuk jumlah progresi aritmetika dan untuk banyak sukunya.
- **Sekitar 1787.** Kisah di ruang kelas tentang Gauss, berusia sembilan atau sepuluh tahun, adalah bahwa gurunya memberi $1+2+\cdots+100$ agar kelas sibuk dan Gauss langsung menjawab 5050, dengan memasangkan 1 dengan 100, 2 dengan 99, dan seterusnya. Kisah ini ditulis lama sesudahnya dan rinciannya beragam, tetapi gagasan memasangkan itu jelas wawasan khas dirinya, dan itulah bukti yang masih diberikan sekarang.

Kata *aritmetika* berasal dari bahasa Yunani *arithmos*, bilangan.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with arithmetic sequences?', 'Apa kesalahan umum pada barisan aritmetika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with arithmetic sequences are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| ❌ $a_n=a_1+nd$ | $a_n=a_1+(n-1)d$: for $n=1$ the term is $a_1$, not $a_1+d$. |
| ❌ $2,4,8,16$ is arithmetic | The differences are $2,4,8$; it is geometric. |
| ❌ The number of terms is $\frac{\ell-a_1}{d}$ | Add 1: $\frac{102-7}{5}+1=20$, not 19. |
| ❌ $S_n=n(a_1+a_n)$ | Halve it: $S_n=\frac n2(a_1+a_n)$; $1+2+3$ is $\frac32\cdot4=6$, not 12. |
| ❌ $d=a_n-a_{n+1}$ | Later minus earlier: $d=a_{n+1}-a_n$; for $20,15,10$ it is $-5$. |
| ❌ Dividing by $q$ or $p$ to find $d$ | Divide by the steps: $d=\frac{a_q-a_p}{q-p}$. |
| ❌ A decreasing sequence has no sum | $20+15+10+5=50$; a negative $d$ is fine. |
| ❌ An infinite arithmetic series has a total | It diverges unless every term is 0. |
| ❌ "The sum of the sequence" | A sequence is the list; the sum of its terms is a series. |`,
            T`**Kesalahan paling umum pada barisan aritmetika adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $a_n=a_1+nd$ | $a_n=a_1+(n-1)d$: untuk $n=1$ sukunya $a_1$, bukan $a_1+d$. |
| ❌ $2,4,8,16$ aritmetika | Selisihnya $2,4,8$; ia geometri. |
| ❌ Banyak suku adalah $\frac{\ell-a_1}{d}$ | Tambah 1: $\frac{102-7}{5}+1=20$, bukan 19. |
| ❌ $S_n=n(a_1+a_n)$ | Bagi dua: $S_n=\frac n2(a_1+a_n)$; $1+2+3$ adalah $\frac32\cdot4=6$, bukan 12. |
| ❌ $d=a_n-a_{n+1}$ | Yang kemudian dikurangi yang lebih dulu: $d=a_{n+1}-a_n$; untuk $20,15,10$ ia $-5$. |
| ❌ Membagi dengan $q$ atau $p$ untuk mencari $d$ | Bagi dengan banyak langkah: $d=\frac{a_q-a_p}{q-p}$. |
| ❌ Barisan menurun tidak punya jumlah | $20+15+10+5=50$; $d$ negatif tidak masalah. |
| ❌ Deret aritmetika tak hingga punya jumlah | Ia divergen kecuali setiap sukunya 0. |
| ❌ "Jumlah barisan" | Barisan adalah daftarnya; jumlah sukunya adalah deret. |`,
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
              L('The sequence $6,6,6,6$ is arithmetic.', 'Barisan $6,6,6,6$ aritmetika.'),
              L('$2,4,8,16$ is arithmetic.', '$2,4,8,16$ aritmetika.'),
              L('An infinite arithmetic series with $d\\neq0$ has a finite sum.', 'Deret aritmetika tak hingga dengan $d\\neq0$ punya jumlah berhingga.'),
              L('Each term of an arithmetic sequence is the average of its two neighbors.', 'Setiap suku barisan aritmetika adalah rata-rata kedua tetangganya.'),
              L('$S_n=\\frac n2(a_1+a_n)$.', '$S_n=\\frac n2(a_1+a_n)$.'),
            ],
            answer: [true, false, false, true, true],
            explain: L(
              '$6,6,6,6$ has $d=0$. $2,4,8,16$ doubles. The partial sums of an infinite arithmetic series grow without bound. The average of $a_{n-1}$ and $a_{n+1}$ is $a_n$. And $S_n=\\frac n2(a_1+a_n)$ is the sum formula.',
              '$6,6,6,6$ memiliki $d=0$. $2,4,8,16$ dilipatduakan. Jumlah parsial deret aritmetika tak hingga membesar tanpa batas. Rata-rata $a_{n-1}$ dan $a_{n+1}$ adalah $a_n$. Dan $S_n=\\frac n2(a_1+a_n)$ adalah rumus jumlah.',
            ),
            hint: L('Check the differences, and think about what the partial sums do as $n$ grows.', 'Periksa selisihnya, dan pikirkan apa yang dilakukan jumlah parsial saat $n$ membesar.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the arithmetic sequences.', 'Pilih **semua** barisan aritmetika.'),
            options: [L('$10,7,4,1$', '$10,7,4,1$'), L('$\\frac12,1,\\frac32,2$', '$\\frac12,1,\\frac32,2$'), L('$1,2,4,7$', '$1,2,4,7$'), L('$5,5,5,5$', '$5,5,5,5$'), L('$1,3,9,27$', '$1,3,9,27$')],
            answer: [0, 1, 3],
            explain: L(
              '$10,7,4,1$ has $d=-3$, $\\frac12,1,\\frac32,2$ has $d=\\frac12$ and $5,5,5,5$ has $d=0$. $1,2,4,7$ has differences $1,2,3$, and $1,3,9,27$ is geometric.',
              '$10,7,4,1$ memiliki $d=-3$, $\\frac12,1,\\frac32,2$ memiliki $d=\\frac12$, dan $5,5,5,5$ memiliki $d=0$. $1,2,4,7$ selisihnya $1,2,3$, dan $1,3,9,27$ geometri.',
            ),
            hint: L('Subtract each term from the next and see whether the differences agree.', 'Kurangkan tiap suku dari suku berikutnya dan lihat apakah selisihnya sama.'),
          },
        },
        {
          kind: 'activity',
          title: L('A term with negative numbers', 'Suku dengan bilangan negatif'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('$a_{12}=a_1+11d$.', '$a_{12}=a_1+11d$.'),
              L('$-4+11\\cdot7$.', '$-4+11\\cdot7$.'),
            ],
            explain: L('$a_{12}=-4+11\\cdot7=-4+77=73$.', '$a_{12}=-4+11\\cdot7=-4+77=73$.'),
            prompt: L('The first term is $-4$ and $d=7$. Find $a_{12}$.', 'Suku pertamanya $-4$ dan $d=7$. Tentukan $a_{12}$.'),
            given: String.raw`a_1=-4,\ d=7:\quad a_{12}=v`,
            blanks: [{ label: 'v =', answer: 73 }],
          },
        },
        {
          kind: 'activity',
          title: L('A sum with a hidden count', 'Jumlah dengan banyak suku tersembunyi'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('First count the terms: $\\frac{98-3}{5}+1$.', 'Hitung dulu banyak sukunya: $\\frac{98-3}{5}+1$.'),
              L('There are 20 terms, so $S=\\frac{20}{2}(3+98)$.', 'Ada 20 suku, sehingga $S=\\frac{20}{2}(3+98)$.'),
            ],
            explain: L('$n=\\frac{98-3}{5}+1=20$ and $S=10\\cdot101=1010$.', '$n=\\frac{98-3}{5}+1=20$ dan $S=10\\cdot101=1010$.'),
            prompt: L('Find $3+8+13+\\cdots+98$.', 'Tentukan $3+8+13+\\cdots+98$.'),
            given: String.raw`3+8+13+\cdots+98=v`,
            blanks: [{ label: 'v =', answer: 1010 }],
          },
        },
        {
          kind: 'activity',
          title: L('The first term', 'Suku pertama'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('An arithmetic sequence has $a_4=17$ and $a_9=42$. What is $a_1$?', 'Barisan aritmetika memiliki $a_4=17$ dan $a_9=42$. Berapakah $a_1$?'),
            options: [L('$7$', '$7$'), L('$2$', '$2$'), L('$12$', '$12$'), L('$-3$', '$-3$')],
            answer: 1,
            explain: L(
              '$d=\\frac{42-17}{9-4}=5$, and $a_1=17-3\\cdot5=2$. Check: $a_4=2+15=17$ and $a_9=2+40=42$.',
              '$d=\\frac{42-17}{9-4}=5$, dan $a_1=17-3\\cdot5=2$. Periksa: $a_4=2+15=17$ dan $a_9=2+40=42$.',
            ),
            hint: L('Divide the change in the terms by the number of steps between them.', 'Bagi perubahan suku dengan banyak langkah di antaranya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Multiples of 7', 'Kelipatan 7'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('How many multiples of 7 are there from 100 to 500?', 'Berapa banyak kelipatan 7 dari 100 sampai 500?'),
            options: [L('$56$', '$56$'), L('$57$', '$57$'), L('$58$', '$58$'), L('$59$', '$59$')],
            answer: 1,
            explain: L(
              'The first is $105=7\\cdot15$ and the last is $497=7\\cdot71$, so $n=\\frac{497-105}{7}+1=57$.',
              'Yang pertama $105=7\\cdot15$ dan yang terakhir $497=7\\cdot71$, sehingga $n=\\frac{497-105}{7}+1=57$.',
            ),
            hint: L('Find the first and the last multiple inside the range, then count with $n=\\frac{\\ell-a_1}{d}+1$.', 'Cari kelipatan pertama dan terakhir dalam rentang itu, lalu hitung dengan $n=\\frac{\\ell-a_1}{d}+1$.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: arithmetic sequences and series at a glance', 'Ringkasan: barisan dan deret aritmetika sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** $a_{n+1}-a_n=d$ is constant; each term is the average of its neighbors.
- **n-th term:** $a_n=a_1+(n-1)d=dn+(a_1-d)$, a straight line in $n$.
- **Number of terms:** $n=\dfrac{\ell-a_1}{d}+1$, which must be a positive whole number.
- **From two terms:** $d=\dfrac{a_q-a_p}{q-p}$, $a_1=a_p-(p-1)d$; $k$ means between $a$ and $b$ have $d=\frac{b-a}{k+1}$.
- **Sum:** $S_n=\frac n2(a_1+a_n)=\frac n2\bigl(2a_1+(n-1)d\bigr)$, quadratic in $n$; $a_n=S_n-S_{n-1}$.
- **Special sums:** $1+\cdots+n=\frac{n(n+1)}2$; the first $n$ odd numbers give $n^2$.
- **Infinite series:** an arithmetic series diverges.
- **Code:** ´range(first, stop, step)´ with the stop excluded; use integers or ´Fraction´, not repeated float steps.`,
            T`- **Definisi:** $a_{n+1}-a_n=d$ konstan; setiap suku adalah rata-rata tetangganya.
- **Suku ke-n:** $a_n=a_1+(n-1)d=dn+(a_1-d)$, garis lurus dalam $n$.
- **Banyak suku:** $n=\dfrac{\ell-a_1}{d}+1$, yang harus bilangan bulat positif.
- **Dari dua suku:** $d=\dfrac{a_q-a_p}{q-p}$, $a_1=a_p-(p-1)d$; $k$ sisipan di antara $a$ dan $b$ punya $d=\frac{b-a}{k+1}$.
- **Jumlah:** $S_n=\frac n2(a_1+a_n)=\frac n2\bigl(2a_1+(n-1)d\bigr)$, kuadrat dalam $n$; $a_n=S_n-S_{n-1}$.
- **Jumlah khusus:** $1+\cdots+n=\frac{n(n+1)}2$; $n$ bilangan ganjil pertama memberi $n^2$.
- **Deret tak hingga:** deret aritmetika divergen.
- **Kode:** ´range(awal, berhenti, langkah)´ dengan nilai berhenti tidak termasuk; pakai bilangan bulat atau ´Fraction´, bukan langkah float berulang.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Sequence', 'Barisan'), definition: L('An ordered list of numbers, called terms, written a1, a2, a3 and so on.', 'Daftar bilangan berurutan, yang disebut suku, ditulis a1, a2, a3 dan seterusnya.') },
    { term: L('Term', 'Suku'), definition: L('One number in a sequence; the n-th term is written a sub n.', 'Satu bilangan dalam barisan; suku ke-n ditulis a indeks n.') },
    { term: L('Arithmetic sequence', 'Barisan aritmetika'), definition: L('A sequence in which the difference between each term and the one before it is always the same, such as 3, 7, 11, 15.', 'Barisan yang selisih antara tiap suku dan suku sebelumnya selalu sama, seperti 3, 7, 11, 15.') },
    { term: L('Common difference', 'Beda'), definition: L('The constant amount d added to each term of an arithmetic sequence to get the next; it can be positive, negative, zero or a fraction.', 'Jumlah tetap d yang ditambahkan pada tiap suku barisan aritmetika untuk mendapat suku berikutnya; ia dapat positif, negatif, nol, atau pecahan.') },
    { term: L('Recursive formula', 'Rumus rekursif'), definition: L('A rule that gives each term from the one before it, such as a sub n plus 1 equals a sub n plus d.', 'Aturan yang memberi tiap suku dari suku sebelumnya, seperti a indeks n tambah 1 sama dengan a indeks n ditambah d.') },
    { term: L('Explicit formula', 'Rumus eksplisit'), definition: L('A rule that gives the n-th term directly from n, such as a sub n equals a sub 1 plus n minus 1 times d.', 'Aturan yang memberi suku ke-n langsung dari n, seperti a indeks n sama dengan a indeks 1 ditambah n dikurangi 1 kali d.') },
    { term: L('Series', 'Deret'), definition: L('The sum of the terms of a sequence, such as 3 plus 7 plus 11 plus 15.', 'Jumlah suku-suku sebuah barisan, seperti 3 ditambah 7 ditambah 11 ditambah 15.') },
    { term: L('Partial sum', 'Jumlah parsial'), definition: L('The sum S sub n of the first n terms of a sequence.', 'Jumlah S indeks n dari n suku pertama sebuah barisan.') },
    { term: L('Sigma notation', 'Notasi sigma'), definition: L('A compact way to write a sum using the Greek letter sigma, with the first and last values of the index written below and above it.', 'Cara ringkas menulis jumlah memakai huruf Yunani sigma, dengan nilai pertama dan terakhir indeks ditulis di bawah dan di atasnya.') },
    { term: L('Arithmetic mean', 'Rata-rata aritmetika'), definition: L('The average of two numbers, half their sum; each term of an arithmetic sequence is the arithmetic mean of its neighbors.', 'Rata-rata dua bilangan, setengah jumlahnya; setiap suku barisan aritmetika adalah rata-rata aritmetika dari tetangganya.') },
    { term: L('Triangular number', 'Bilangan segitiga'), definition: L('A sum 1 plus 2 plus up to n, equal to n times n plus 1 over 2, such as 1, 3, 6, 10 and 15.', 'Jumlah 1 ditambah 2 sampai n, sama dengan n kali n tambah 1 per 2, seperti 1, 3, 6, 10, dan 15.') },
    { term: L('Divergent series', 'Deret divergen'), definition: L('A series whose partial sums do not settle on a finite total; every infinite arithmetic series with a non-zero term is divergent.', 'Deret yang jumlah parsialnya tidak menetap pada jumlah berhingga; setiap deret aritmetika tak hingga dengan suku bukan nol divergen.') },
    { term: L('Geometric sequence', 'Barisan geometri'), definition: L('A sequence in which each term is the previous one times the same fixed number, such as 2, 4, 8, 16.', 'Barisan yang setiap sukunya adalah suku sebelumnya dikali bilangan tetap yang sama, seperti 2, 4, 8, 16.') },
  ],

  howTo: [
    {
      name: L('How to find the n-th term of an arithmetic sequence', 'Cara mencari suku ke-n barisan aritmetika'),
      description: L('Find the first term and the common difference, then use a sub n equals a sub 1 plus n minus 1 times d.', 'Tentukan suku pertama dan beda, lalu pakai a indeks n sama dengan a indeks 1 ditambah n dikurangi 1 kali d.'),
      steps: [
        { name: L('Find the first term', 'Tentukan suku pertama'), text: L('Read off the first term a1, for example 5 in 5, 9, 13.', 'Baca suku pertama a1, misalnya 5 pada 5, 9, 13.') },
        { name: L('Find the common difference', 'Tentukan beda'), text: L('Subtract a term from the next one: 9 minus 5 is 4, and check that the other differences agree.', 'Kurangkan sebuah suku dari suku berikutnya: 9 dikurangi 5 adalah 4, dan periksa bahwa selisih lainnya sama.') },
        { name: L('Use the formula', 'Pakai rumusnya'), text: L('Put them in a sub n equals a1 plus n minus 1 times d, which gives 5 plus n minus 1 times 4.', 'Masukkan ke a indeks n sama dengan a1 ditambah n dikurangi 1 kali d, yang memberi 5 ditambah n dikurangi 1 kali 4.') },
        { name: L('Substitute n', 'Substitusikan n'), text: L('Replace n by the position you want: for the 20th term, 5 plus 19 times 4 is 81.', 'Ganti n dengan posisi yang diinginkan: untuk suku ke-20, 5 ditambah 19 kali 4 adalah 81.') },
      ],
    },
    {
      name: L('How to find the sum of an arithmetic series', 'Cara mencari jumlah deret aritmetika'),
      description: L('Count the terms, then multiply by the average of the first and the last.', 'Hitung banyak suku, lalu kalikan dengan rata-rata suku pertama dan terakhir.'),
      steps: [
        { name: L('Count the terms', 'Hitung banyak suku'), text: L('Use n equals the last term minus the first, divided by d, plus 1; for 3 to 98 in steps of 5 that is 20.', 'Pakai n sama dengan suku terakhir dikurangi suku pertama, dibagi d, ditambah 1; untuk 3 sampai 98 dengan langkah 5 itu 20.') },
        { name: L('Add the first and the last', 'Jumlahkan yang pertama dan terakhir'), text: L('Add the first and the last term: 3 plus 98 is 101.', 'Jumlahkan suku pertama dan terakhir: 3 ditambah 98 adalah 101.') },
        { name: L('Multiply by half the count', 'Kalikan dengan setengah banyaknya'), text: L('Multiply by n over 2: 20 over 2 is 10, and 10 times 101 is 1010.', 'Kalikan dengan n per 2: 20 per 2 adalah 10, dan 10 kali 101 adalah 1010.') },
        { name: L('Check with a small case', 'Periksa dengan kasus kecil'), text: L('Test the formula on the first few terms by adding them: 3 plus 8 plus 13 is 24, and 3 over 2 times 3 plus 13 is also 24.', 'Uji rumus pada beberapa suku pertama dengan menjumlahkannya: 3 ditambah 8 ditambah 13 adalah 24, dan 3 per 2 kali 3 ditambah 13 juga 24.') },
      ],
    },
    {
      name: L('How to find an arithmetic sequence from two terms', 'Cara menemukan barisan aritmetika dari dua suku'),
      description: L('Divide the change in the terms by the number of steps, then step back to the first term.', 'Bagi perubahan suku dengan banyak langkah, lalu mundur ke suku pertama.'),
      steps: [
        { name: L('Subtract the terms', 'Kurangkan suku-sukunya'), text: L('Find how much the terms change: from a3 equals 11 to a7 equals 23 is 12.', 'Cari berapa suku-suku berubah: dari a3 sama dengan 11 ke a7 sama dengan 23 adalah 12.') },
        { name: L('Count the steps', 'Hitung langkahnya'), text: L('Count the steps between the positions: 7 minus 3 is 4.', 'Hitung langkah di antara posisinya: 7 dikurangi 3 adalah 4.') },
        { name: L('Divide to get d', 'Bagi untuk mendapat d'), text: L('Divide the change by the steps: 12 over 4 gives d equal to 3.', 'Bagi perubahan dengan langkahnya: 12 per 4 memberi d sama dengan 3.') },
        { name: L('Step back to the first term', 'Mundur ke suku pertama'), text: L('Subtract p minus 1 steps from the known term: a1 is 11 minus 2 times 3, which is 5.', 'Kurangkan p dikurangi 1 langkah dari suku yang diketahui: a1 adalah 11 dikurangi 2 kali 3, yaitu 5.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an arithmetic sequence?', 'Apa itu barisan aritmetika?'),
      a: L(
        'An arithmetic sequence is a list of numbers in which each term is the previous term plus the same fixed number, called the common difference. For example 3, 7, 11, 15 goes up by 4 each time. The difference can be negative, a fraction or zero.',
        'Barisan aritmetika adalah daftar bilangan yang setiap sukunya sama dengan suku sebelumnya ditambah bilangan tetap yang sama, yang disebut beda. Misalnya 3, 7, 11, 15 naik 4 setiap kali. Bedanya dapat negatif, pecahan, atau nol.',
      ),
    },
    {
      q: L('What is the formula for the n-th term of an arithmetic sequence?', 'Apa rumus suku ke-n barisan aritmetika?'),
      a: L(
        'The n-th term is the first term plus n minus 1 times the common difference, written a sub n equals a sub 1 plus n minus 1 times d. For 5, 9, 13 the 20th term is 5 plus 19 times 4, which is 81.',
        'Suku ke-n adalah suku pertama ditambah n dikurangi 1 kali beda, ditulis a indeks n sama dengan a indeks 1 ditambah n dikurangi 1 kali d. Untuk 5, 9, 13 suku ke-20 adalah 5 ditambah 19 kali 4, yaitu 81.',
      ),
    },
    {
      q: L('What is the formula for the sum of an arithmetic series?', 'Apa rumus jumlah deret aritmetika?'),
      a: L(
        'The sum of the first n terms is n over 2 times the first term plus the last term, or n over 2 times 2 times the first term plus n minus 1 times d. For 3 plus 8 up to 98, which has 20 terms, the sum is 10 times 101, which is 1010.',
        'Jumlah n suku pertama adalah n per 2 kali suku pertama ditambah suku terakhir, atau n per 2 kali 2 kali suku pertama ditambah n dikurangi 1 kali d. Untuk 3 ditambah 8 sampai 98, yang punya 20 suku, jumlahnya 10 kali 101, yaitu 1010.',
      ),
    },
    {
      q: L('What is the difference between a sequence and a series?', 'Apa beda barisan dan deret?'),
      a: L(
        'A sequence is a list of numbers in order, such as 2, 5, 8, 11. A series is the sum of the terms of a sequence, such as 2 plus 5 plus 8 plus 11, which is 26. So a sequence has terms and a series has a total.',
        'Barisan adalah daftar bilangan berurutan, seperti 2, 5, 8, 11. Deret adalah jumlah suku-suku sebuah barisan, seperti 2 ditambah 5 ditambah 8 ditambah 11, yaitu 26. Jadi barisan punya suku dan deret punya jumlah.',
      ),
    },
    {
      q: L('How do you tell whether a sequence is arithmetic?', 'Bagaimana mengetahui apakah suatu barisan aritmetika?'),
      a: L(
        'Subtract each term from the next one, always later minus earlier. If all the differences are equal, the sequence is arithmetic and that value is the common difference. If even one difference is different, it is not, as in 1, 4, 9, 16 with differences 3, 5, 7.',
        'Kurangkan tiap suku dari suku berikutnya, selalu yang kemudian dikurangi yang lebih dulu. Jika semua selisih sama, barisannya aritmetika dan nilai itu adalah bedanya. Jika satu selisih saja berbeda, ia bukan, seperti pada 1, 4, 9, 16 dengan selisih 3, 5, 7.',
      ),
    },
    {
      q: L('How do you find the number of terms?', 'Bagaimana mencari banyak suku?'),
      a: L(
        'Use the last term minus the first term, divided by the common difference, plus 1. For 7, 12, 17 up to 102 that is 95 over 5 plus 1, which is 20. If the result is not a positive whole number, the last number is not a term.',
        'Pakai suku terakhir dikurangi suku pertama, dibagi beda, ditambah 1. Untuk 7, 12, 17 sampai 102 itu 95 per 5 ditambah 1, yaitu 20. Jika hasilnya bukan bilangan bulat positif, bilangan terakhir itu bukan suku.',
      ),
    },
    {
      q: L('How do you find an arithmetic sequence from two terms?', 'Bagaimana menemukan barisan aritmetika dari dua suku?'),
      a: L(
        'Divide the difference of the two terms by the difference of their positions to get d, then subtract p minus 1 steps from the earlier term to get the first term. With the third term 11 and the seventh term 23, d is 12 over 4, which is 3, and the first term is 5.',
        'Bagi selisih kedua suku dengan selisih posisinya untuk mendapat d, lalu kurangkan p dikurangi 1 langkah dari suku yang lebih awal untuk mendapat suku pertama. Dengan suku ketiga 11 dan suku ketujuh 23, d adalah 12 per 4, yaitu 3, dan suku pertamanya 5.',
      ),
    },
    {
      q: L('How did Gauss add the numbers from 1 to 100?', 'Bagaimana Gauss menjumlahkan bilangan 1 sampai 100?'),
      a: L(
        'By pairing the first and the last numbers. 1 plus 100, 2 plus 99 and so on each make 101, and there are 50 such pairs, so the total is 50 times 101, which is 5050. The same pairing proves the general sum formula for any arithmetic series.',
        'Dengan memasangkan bilangan pertama dan terakhir. 1 ditambah 100, 2 ditambah 99 dan seterusnya masing-masing 101, dan ada 50 pasangan seperti itu, sehingga jumlahnya 50 kali 101, yaitu 5050. Pemasangan yang sama membuktikan rumus jumlah umum untuk deret aritmetika mana pun.',
      ),
    },
    {
      q: L('What is the sum of the first n odd numbers?', 'Berapa jumlah n bilangan ganjil pertama?'),
      a: L(
        'It is n squared. The odd numbers 1, 3, 5 up to 2n minus 1 form an arithmetic sequence with n terms, so the sum is n over 2 times 1 plus 2n minus 1, which is n squared. For example the first 50 odd numbers add to 2500.',
        'Jumlahnya n kuadrat. Bilangan ganjil 1, 3, 5 sampai 2n dikurangi 1 membentuk barisan aritmetika dengan n suku, sehingga jumlahnya n per 2 kali 1 ditambah 2n dikurangi 1, yaitu n kuadrat. Misalnya 50 bilangan ganjil pertama berjumlah 2500.',
      ),
    },
    {
      q: L('What are arithmetic means?', 'Apa itu rata-rata aritmetika dalam barisan?'),
      a: L(
        'They are the numbers inserted between two given numbers so that the whole list is arithmetic. For k means the common difference is the gap divided by k plus 1. Three means between 4 and 24 are 9, 14 and 19, and a single mean is just the average.',
        'Itu bilangan-bilangan yang disisipkan di antara dua bilangan yang diberikan sehingga seluruh daftarnya aritmetika. Untuk k sisipan beda adalah selisih dibagi k ditambah 1. Tiga sisipan di antara 4 dan 24 adalah 9, 14, dan 19, dan satu sisipan hanyalah rata-ratanya.',
      ),
    },
    {
      q: L('Does an infinite arithmetic series have a sum?', 'Apakah deret aritmetika tak hingga punya jumlah?'),
      a: L(
        'No, except in the trivial case where every term is zero. The partial sums grow without bound, upward if the difference is positive and downward if it is negative, so the series diverges. A geometric series with ratio smaller than 1 in size can have a sum.',
        'Tidak, kecuali pada kasus sepele ketika setiap sukunya nol. Jumlah parsialnya membesar tanpa batas, ke atas bila beda positif dan ke bawah bila negatif, sehingga deretnya divergen. Deret geometri dengan rasio berukuran kurang dari 1 dapat punya jumlah.',
      ),
    },
    {
      q: L('Is a list of square numbers an arithmetic sequence?', 'Apakah daftar bilangan kuadrat merupakan barisan aritmetika?'),
      a: L(
        'No. The squares 1, 4, 9, 16 differ by 3, 5, 7, which are not equal, so the list is not arithmetic. The differences themselves form an arithmetic sequence with difference 2, which makes the squares a quadratic sequence, one level above arithmetic.',
        'Bukan. Bilangan kuadrat 1, 4, 9, 16 berselisih 3, 5, 7 yang tidak sama, sehingga daftarnya bukan aritmetika. Selisihnya sendiri membentuk barisan aritmetika dengan beda 2, yang menjadikan bilangan kuadrat barisan kuadratik, satu tingkat di atas aritmetika.',
      ),
    },
    {
      q: L('How do you write a sum in sigma notation?', 'Bagaimana menulis jumlah dengan notasi sigma?'),
      a: L(
        'Put the sigma sign, write the first and the last value of the index below and above it, and the formula for the term beside it. The sum of 3k plus 2 for k from 1 to 10 means 5 plus 8 and so on up to 32, which is 185.',
        'Taruh tanda sigma, tulis nilai pertama dan terakhir indeks di bawah dan di atasnya, dan rumus suku di sampingnya. Jumlah 3k ditambah 2 untuk k dari 1 sampai 10 berarti 5 ditambah 8 dan seterusnya sampai 32, yaitu 185.',
      ),
    },
    {
      q: L('How do you make an arithmetic sequence in Python?', 'Bagaimana membuat barisan aritmetika di Python?'),
      a: L(
        'Use range with a start, a stop and a step, such as range 3, 40, 4, and remember that the stop value is excluded. Sum of a range adds the terms. Avoid float steps such as 0.1, which drift, and use integers or the Fraction class instead.',
        'Pakai range dengan awal, batas berhenti, dan langkah, seperti range 3, 40, 4, dan ingat bahwa nilai berhenti tidak termasuk. Sum dari sebuah range menjumlahkan suku-sukunya. Hindari langkah float seperti 0,1, yang bergeser, dan pakai bilangan bulat atau kelas Fraction.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.), chapter 12 (sequences and series)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'The Rhind Mathematical Papyrus', author: 'Arnold Buffum Chace', year: 1927, source: 'Mathematical Association of America' },
    { title: 'The Nine Chapters on the Mathematical Art: Companion and Commentary', author: 'Shen Kangshen, John Crossley and Anthony Lun', year: 1999, source: 'Oxford University Press' },
    { title: 'The Aryabhatiya of Aryabhata: An Ancient Indian Work on Mathematics and Astronomy (Ganita section)', author: 'Walter Eugene Clark', year: 1930, source: 'University of Chicago Press' },
    { title: 'Gauss zum Gedächtniss', author: 'Wolfgang Sartorius von Waltershausen', year: 1856, source: 'S. Hirzel' },
    { title: 'Concrete Mathematics: A Foundation for Computer Science (2nd ed.), chapter 2 (sums)', author: 'Ronald Graham, Donald Knuth and Oren Patashnik', year: 1994, source: 'Addison-Wesley' },
    { title: 'The Python Standard Library: range, sum and itertools.accumulate', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/stdtypes.html#range' },
  ],

  related: ['algebraic-expressions', 'geometric-sequences-and-series', 'rational-numbers', 'exponents-and-radicals'],
}
