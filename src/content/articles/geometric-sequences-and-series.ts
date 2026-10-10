import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './geometric-sequences-and-series.meta'

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
    T`**A geometric sequence is a list of numbers in which each term is the previous one multiplied by the same fixed number $r$, the common ratio: $3,6,12,24,\ldots$ has $r=2$.** Its $n$-th term is $a_n=a_1r^{n-1}$, and the sum of the first $n$ terms is $S_n=\dfrac{a_1(1-r^n)}{1-r}$ for $r\neq1$. An infinite geometric series has a sum, $\dfrac{a_1}{1-r}$, only when $|r|<1$; otherwise it diverges.`,
    T`**Barisan geometri adalah daftar bilangan yang setiap sukunya sama dengan suku sebelumnya dikali bilangan tetap $r$, yaitu rasio: $3,6,12,24,\ldots$ memiliki $r=2$.** Suku ke-$n$-nya adalah $a_n=a_1r^{n-1}$, dan jumlah $n$ suku pertama adalah $S_n=\dfrac{a_1(1-r^n)}{1-r}$ untuk $r\neq1$. Deret geometri tak hingga punya jumlah, $\dfrac{a_1}{1-r}$, hanya bila $|r|<1$; jika tidak, ia divergen.`,
  ),

  keyPoints: [
    L(
      T`In a geometric sequence the ratio of neighbours is constant: $\dfrac{a_{n+1}}{a_n}=r$, so each step multiplies by $r$ where an arithmetic sequence adds.`,
      T`Pada barisan geometri rasio antartetangga konstan: $\dfrac{a_{n+1}}{a_n}=r$, sehingga tiap langkah mengalikan dengan $r$ sedangkan barisan aritmetika menambah.`,
    ),
    L(
      T`The $n$-th term is $a_n=a_1r^{n-1}$, an exponential function of $n$: $|r|>1$ grows, $0<|r|<1$ decays, and a negative $r$ alternates in sign.`,
      T`Suku ke-$n$ adalah $a_n=a_1r^{n-1}$, fungsi eksponensial dari $n$: $|r|>1$ tumbuh, $0<|r|<1$ meluruh, dan $r$ negatif membuat tanda bergantian.`,
    ),
    L(
      T`Two terms give the ratio: $r^{q-p}=\dfrac{a_q}{a_p}$; $k$ geometric means between $a$ and $b$ have $r^{k+1}=\dfrac ba$.`,
      T`Dua suku memberi rasio: $r^{q-p}=\dfrac{a_q}{a_p}$; $k$ rata-rata geometri di antara $a$ dan $b$ memiliki $r^{k+1}=\dfrac ba$.`,
    ),
    L(
      T`The sum of $n$ terms is $S_n=a_1\dfrac{1-r^n}{1-r}$ (and $na_1$ if $r=1$), found by subtracting $rS_n$ from $S_n$.`,
      T`Jumlah $n$ suku adalah $S_n=a_1\dfrac{1-r^n}{1-r}$ (dan $na_1$ bila $r=1$), diperoleh dengan mengurangkan $rS_n$ dari $S_n$.`,
    ),
    L(
      T`If $|r|<1$ the infinite series converges to $S_\infty=\dfrac{a_1}{1-r}$; this turns repeating decimals into fractions, as in $0.\overline{3}=\frac13$.`,
      T`Jika $|r|<1$ deret tak hingga konvergen ke $S_\infty=\dfrac{a_1}{1-r}$; ini mengubah desimal berulang menjadi pecahan, seperti $0{,}\overline{3}=\frac13$.`,
    ),
    L(
      T`Compound interest, depreciation and half-life are all geometric: a rise of $p\%$ has $r=1+\frac p{100}$ and a fall has $r=1-\frac p{100}$.`,
      T`Bunga majemuk, penyusutan, dan waktu paruh semuanya geometri: kenaikan $p\%$ berarti $r=1+\frac p{100}$ dan penurunan berarti $r=1-\frac p{100}$.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-a-geometric-sequence',
      heading: L('What is a geometric sequence?', 'Apa itu barisan geometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A geometric sequence (or geometric progression) is a list of non-zero numbers $a_1,a_2,a_3,\ldots$ in which the ratio of each term to the one before it is always the same number $r$, called the common ratio.** The rule is $a_{n+1}=r\,a_n$: to get the next term, multiply by $r$.

| Sequence | Common ratio | Behaviour |
|---|---|---|
| $3,6,12,24,\ldots$ | $r=2$ | doubling: grows |
| $81,27,9,3,\ldots$ | $r=\frac13$ | shrinks toward 0 |
| $5,-10,20,-40,\ldots$ | $r=-2$ | alternates in sign, grows in size |
| $7,7,7,7,\ldots$ | $r=1$ | constant |
| $1,0.1,0.01,\ldots$ | $r=0.1$ | shrinks toward 0 |
| $2,4,6,8,\ldots$ | ratios $2,\frac32,\frac43$ | **not** geometric: it adds 2 each time |
| $1,4,9,16,\ldots$ | ratios $4,\frac94,\frac{16}9$ | **not** geometric (and not arithmetic) |

**How to tell.** Divide each term by the one before it, later over earlier. If every ratio is the same, the sequence is geometric. No term may be 0, because the ratio of a term to 0 is undefined and a 0 would make every later term 0.

**Compare with arithmetic.** An [arithmetic sequence](article:arithmetic-sequences-and-series#what-is-an-arithmetic-sequence) adds the same amount each step, so its terms lie on a straight line; a geometric sequence multiplies, so its terms lie on an exponential curve and eventually leave any arithmetic sequence far behind.

**The geometric mean.** For three neighbours of the same sign $a_n^2=a_{n-1}a_{n+1}$, so each term is the *geometric mean* $\sqrt{ab}$ of the two beside it, as each term of an arithmetic sequence is their arithmetic mean. That is where the name comes from.

Type a list of numbers below and see whether it is geometric.`,
            T`**Barisan geometri (atau progresi geometri) adalah daftar bilangan bukan nol $a_1,a_2,a_3,\ldots$ yang rasio tiap suku terhadap suku sebelumnya selalu bilangan yang sama $r$, yang disebut rasio.** Aturannya $a_{n+1}=r\,a_n$: untuk mendapat suku berikutnya, kalikan dengan $r$.

| Barisan | Rasio | Perilaku |
|---|---|---|
| $3,6,12,24,\ldots$ | $r=2$ | berlipat dua: tumbuh |
| $81,27,9,3,\ldots$ | $r=\frac13$ | mengecil menuju 0 |
| $5,-10,20,-40,\ldots$ | $r=-2$ | tanda bergantian, ukuran tumbuh |
| $7,7,7,7,\ldots$ | $r=1$ | konstan |
| $1,0{,}1,0{,}01,\ldots$ | $r=0{,}1$ | mengecil menuju 0 |
| $2,4,6,8,\ldots$ | rasio $2,\frac32,\frac43$ | **bukan** geometri: ia menambah 2 setiap kali |
| $1,4,9,16,\ldots$ | rasio $4,\frac94,\frac{16}9$ | **bukan** geometri (dan bukan aritmetika) |

**Cara mengetahuinya.** Bagi tiap suku dengan suku sebelumnya, yang kemudian per yang lebih dulu. Jika setiap rasio sama, barisannya geometri. Tidak boleh ada suku 0, karena rasio suatu suku terhadap 0 tidak terdefinisi dan suku 0 membuat setiap suku berikutnya 0.

**Bandingkan dengan aritmetika.** [Barisan aritmetika](article:arithmetic-sequences-and-series#what-is-an-arithmetic-sequence) menambah jumlah yang sama tiap langkah, sehingga sukunya terletak pada garis lurus; barisan geometri mengalikan, sehingga sukunya terletak pada kurva eksponensial dan akhirnya meninggalkan barisan aritmetika apa pun jauh di belakang.

**Rata-rata geometri.** Untuk tiga tetangga yang bertanda sama $a_n^2=a_{n-1}a_{n+1}$, sehingga tiap suku adalah *rata-rata geometri* $\sqrt{ab}$ dari dua suku di sampingnya, seperti tiap suku barisan aritmetika adalah rata-rata aritmetika keduanya. Dari situlah namanya berasal.

Ketik daftar bilangan di bawah dan lihat apakah ia geometri.`,
          ),
        },
        { kind: 'widget', name: 'geodetect' },
        {
          kind: 'activity',
          title: L('Try it: spot the geometric sequence', 'Coba: kenali barisan geometri'),
          step: {
            kind: 'quiz',
            id: 'a1',
            prompt: L('Which of these is a geometric sequence?', 'Manakah di antara ini yang barisan geometri?'),
            options: [L('$2,4,6,8$', '$2,4,6,8$'), L('$3,9,27,81$', '$3,9,27,81$'), L('$1,4,9,16$', '$1,4,9,16$'), L('$5,10,15,20$', '$5,10,15,20$')],
            answer: 1,
            explain: L(
              '$3,9,27,81$ multiplies by 3 each time. $2,4,6,8$ and $5,10,15,20$ add a fixed amount, so they are arithmetic, and $1,4,9,16$ has ratios $4,\\frac94,\\frac{16}9$.',
              '$3,9,27,81$ dikali 3 setiap kali. $2,4,6,8$ dan $5,10,15,20$ menambah jumlah tetap, sehingga aritmetika, dan $1,4,9,16$ rasionya $4,\\frac94,\\frac{16}9$.',
            ),
            hint: L('Divide each term by the one before it.', 'Bagi tiap suku dengan suku sebelumnya.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------- nth term */
    {
      id: 'nth-term',
      heading: L('How do you find the n-th term?', 'Bagaimana mencari suku ke-n?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The $n$-th term of a geometric sequence is $a_n=a_1r^{n-1}$: start at the first term and multiply by the ratio $n-1$ times.** As in the arithmetic case, going from term 1 to term $n$ takes $n-1$ steps.

For $3,6,12,\ldots$ we have $a_1=3$ and $r=2$, so $a_n=3\cdot2^{n-1}$ and $a_{10}=3\cdot2^9=1536$. For $64,32,16,\ldots$, $r=\frac12$ and $a_7=64\cdot\left(\frac12\right)^6=1$.

**It is an exponential function.** Writing $a_n=\frac{a_1}{r}\,r^n$ shows the variable $n$ in an exponent, so the laws of [exponents](article:exponents-and-radicals#laws-of-exponents) apply, and the points of the sequence lie on a curve rather than a line. The size of $r$ decides the picture:

- $r>1$: exponential growth. The terms get larger faster and faster.
- $0<r<1$: exponential decay. The terms shrink toward 0 but never reach it.
- $r<0$: the signs alternate, and the sizes grow if $|r|>1$ or shrink if $|r|<1$.
- $r=1$: constant. $r=-1$: the sequence alternates between $a_1$ and $-a_1$.

**Why it feels so fast.** A penny, doubled each day for 30 days, is worth $2^{29}$ cents on day 30, which is 5,368,709.12 dollars; adding a fixed 1,000 dollars a day would give only 30,000 dollars. Doubling beats any fixed addition in the end.

**Which term is a given number?** Solve $a_1r^{n-1}=L$. For $3,6,12,\ldots,768$: $\frac{768}{3}=256=2^8$, so $n-1=8$ and $n=9$. When the ratio is not a neat power, the number of terms needs logarithms, which are the inverse of the exponent.

Choose a first term, a ratio and a length below and watch the bars.`,
            T`**Suku ke-$n$ barisan geometri adalah $a_n=a_1r^{n-1}$: mulai dari suku pertama dan kalikan dengan rasio sebanyak $n-1$ kali.** Seperti pada kasus aritmetika, dari suku 1 ke suku $n$ diperlukan $n-1$ langkah.

Untuk $3,6,12,\ldots$ kita punya $a_1=3$ dan $r=2$, sehingga $a_n=3\cdot2^{n-1}$ dan $a_{10}=3\cdot2^9=1536$. Untuk $64,32,16,\ldots$, $r=\frac12$ dan $a_7=64\cdot\left(\frac12\right)^6=1$.

**Ia fungsi eksponensial.** Menulis $a_n=\frac{a_1}{r}\,r^n$ menunjukkan peubah $n$ berada di eksponen, sehingga hukum [eksponen](article:exponents-and-radicals#laws-of-exponents) berlaku, dan titik-titik barisan terletak pada kurva, bukan garis. Besarnya $r$ menentukan gambarnya:

- $r>1$: pertumbuhan eksponensial. Suku-sukunya membesar makin cepat.
- $0<r<1$: peluruhan eksponensial. Suku-sukunya mengecil menuju 0 tetapi tidak pernah mencapainya.
- $r<0$: tandanya bergantian, dan ukurannya tumbuh bila $|r|>1$ atau mengecil bila $|r|<1$.
- $r=1$: konstan. $r=-1$: barisan bergantian antara $a_1$ dan $-a_1$.

**Mengapa terasa begitu cepat.** Uang Rp100 yang dilipatduakan tiap hari selama 30 hari bernilai $100\cdot2^{29}=$ Rp53.687.091.200 pada hari ke-30; menambah Rp1.000.000 tetap tiap hari hanya memberi Rp30.000.000. Penggandaan akhirnya mengalahkan penambahan tetap mana pun.

**Suku keberapa yang sama dengan bilangan tertentu?** Selesaikan $a_1r^{n-1}=L$. Untuk $3,6,12,\ldots,768$: $\frac{768}{3}=256=2^8$, sehingga $n-1=8$ dan $n=9$. Bila rasionya bukan pangkat yang rapi, banyak suku memerlukan logaritma, yaitu kebalikan dari eksponen.

Pilih suku pertama, rasio, dan panjang di bawah dan perhatikan batangnya.`,
          ),
        },
        { kind: 'widget', name: 'geoseq' },
        {
          kind: 'activity',
          title: L('Try it: the 10th term', 'Coba: suku ke-10'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Here $a_1=3$ and $r=2$.', 'Di sini $a_1=3$ dan $r=2$.'),
              L('$a_{10}=3\\cdot2^9$, and $2^9=512$.', '$a_{10}=3\\cdot2^9$, dan $2^9=512$.'),
            ],
            explain: L('$a_{10}=3\\cdot2^{10-1}=3\\cdot512=1536$.', '$a_{10}=3\\cdot2^{10-1}=3\\cdot512=1536$.'),
            prompt: L('Find the 10th term of $3,6,12,\\ldots$', 'Tentukan suku ke-10 dari $3,6,12,\\ldots$'),
            given: String.raw`a_{10}=v`,
            blanks: [{ label: 'v =', answer: 1536 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: a shrinking sequence', 'Coba: barisan yang mengecil'),
          step: {
            kind: 'math',
            id: 'a3',
            hints: [
              L('The ratio is $\\frac{32}{64}=\\frac12$.', 'Rasionya $\\frac{32}{64}=\\frac12$.'),
              L('$a_7=64\\cdot\\left(\\frac12\\right)^6=64\\div64$.', '$a_7=64\\cdot\\left(\\frac12\\right)^6=64\\div64$.'),
            ],
            explain: L('$a_7=64\\cdot\\left(\\frac12\\right)^{6}=\\frac{64}{64}=1$.', '$a_7=64\\cdot\\left(\\frac12\\right)^{6}=\\frac{64}{64}=1$.'),
            prompt: L('Find the 7th term of $64,32,16,\\ldots$', 'Tentukan suku ke-7 dari $64,32,16,\\ldots$'),
            given: String.raw`a_{7}=v`,
            blanks: [{ label: 'v =', answer: 1 }],
          },
        },
      ],
    },

    /* --------------------------------------------------------------- two terms */
    {
      id: 'from-two-terms',
      heading: L('How do you find the ratio from two terms, and what is a geometric mean?', 'Bagaimana mencari rasio dari dua suku, dan apa itu rata-rata geometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two terms and their positions give the ratio: between term $p$ and term $q$ there are $q-p$ multiplications by $r$, so $a_q=a_p\,r^{q-p}$ and $r^{q-p}=\dfrac{a_q}{a_p}$.** Then $a_1=a_p\div r^{p-1}$.

Example: $a_2=6$ and $a_5=48$. Then $r^3=\frac{48}{6}=8$, so $r=2$ and $a_1=\frac62=3$: the sequence is $3,6,12,24,48,\ldots$

**How many answers?** Taking a root can give two. If the number of steps $q-p$ is odd there is one real ratio, with the sign of $\frac{a_q}{a_p}$. If it is even there are two, $+r$ and $-r$, provided $\frac{a_q}{a_p}$ is positive: $a_1=3$ and $a_3=12$ fit both $3,6,12,\ldots$ and $3,-6,12,\ldots$. If it is negative and the number of steps is even, no real ratio exists. And the ratio need not be a fraction: $a_1=1$ and $a_3=2$ give $r=\pm\sqrt2$, which is [irrational](article:irrational-numbers#which-roots-are-irrational).

**Geometric means.** Inserting $k$ numbers between $a$ and $b$ so that the whole list is geometric is the same problem with $k+1$ steps: $r^{k+1}=\frac ba$. Two means between 3 and 81 have $r^3=27$, so $r=3$ and the means are 9 and 27. With a single mean, $r^2=\frac ba$ and the mean is $\sqrt{ab}$: between 2 and 32 it is $\sqrt{64}=8$.

**Why the geometric mean matters.** When a quantity grows by factors, the right average is the geometric one. Prices that rise by 10% and then 20% have grown by the factors 1.1 and 1.2, whose geometric mean is $\sqrt{1.1\cdot1.2}\approx1.149$, an average of about 14.9% a period, not the 15% that averaging the percentages would suggest.

Try two terms of your own below.`,
            T`**Dua suku dan posisinya memberi rasio: di antara suku $p$ dan suku $q$ ada $q-p$ perkalian dengan $r$, sehingga $a_q=a_p\,r^{q-p}$ dan $r^{q-p}=\dfrac{a_q}{a_p}$.** Lalu $a_1=a_p\div r^{p-1}$.

Contoh: $a_2=6$ dan $a_5=48$. Maka $r^3=\frac{48}{6}=8$, sehingga $r=2$ dan $a_1=\frac62=3$: barisannya $3,6,12,24,48,\ldots$

**Berapa banyak jawaban?** Menarik akar dapat memberi dua. Jika banyak langkah $q-p$ ganjil ada satu rasio real, bertanda sama dengan $\frac{a_q}{a_p}$. Jika genap ada dua, $+r$ dan $-r$, asalkan $\frac{a_q}{a_p}$ positif: $a_1=3$ dan $a_3=12$ cocok dengan $3,6,12,\ldots$ maupun $3,-6,12,\ldots$. Jika ia negatif dan banyak langkahnya genap, tidak ada rasio real. Dan rasio tidak harus pecahan: $a_1=1$ dan $a_3=2$ memberi $r=\pm\sqrt2$, yang [irasional](article:irrational-numbers#which-roots-are-irrational).

**Rata-rata geometri.** Menyisipkan $k$ bilangan di antara $a$ dan $b$ sehingga seluruh daftarnya geometri adalah masalah yang sama dengan $k+1$ langkah: $r^{k+1}=\frac ba$. Dua sisipan di antara 3 dan 81 memiliki $r^3=27$, sehingga $r=3$ dan sisipannya 9 dan 27. Dengan satu sisipan, $r^2=\frac ba$ dan sisipannya $\sqrt{ab}$: di antara 2 dan 32 ia $\sqrt{64}=8$.

**Mengapa rata-rata geometri penting.** Bila suatu besaran tumbuh dengan faktor, rata-rata yang tepat adalah yang geometri. Harga yang naik 10% lalu 20% tumbuh dengan faktor 1,1 dan 1,2, yang rata-rata geometrinya $\sqrt{1{,}1\cdot1{,}2}\approx1{,}149$, rata-rata sekitar 14,9% per periode, bukan 15% seperti yang disarankan merata-ratakan persentasenya.

Coba dua sukumu sendiri di bawah.`,
          ),
        },
        { kind: 'widget', name: 'geotwo' },
        {
          kind: 'activity',
          title: L('Try it: from two terms', 'Coba: dari dua suku'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('From $a_2$ to $a_5$ there are 3 steps: $r^3=\\frac{48}{6}$.', 'Dari $a_2$ ke $a_5$ ada 3 langkah: $r^3=\\frac{48}{6}$.'),
              L('$r^3=8$, so $r=2$; then $a_1=a_2\\div r$.', '$r^3=8$, sehingga $r=2$; lalu $a_1=a_2\\div r$.'),
            ],
            explain: L('$r^3=8$ gives $r=2$, and $a_1=\\frac62=3$.', '$r^3=8$ memberi $r=2$, dan $a_1=\\frac62=3$.'),
            prompt: L('A geometric sequence has $a_2=6$ and $a_5=48$ and a positive ratio. Find $r$ and $a_1$.', 'Barisan geometri memiliki $a_2=6$ dan $a_5=48$ dengan rasio positif. Tentukan $r$ dan $a_1$.'),
            given: String.raw`a_2=6,\ a_5=48`,
            blanks: [
              { label: 'r =', answer: 2 },
              { label: 'a₁ =', answer: 3 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: geometric means', 'Coba: rata-rata geometri'),
          step: {
            kind: 'math',
            id: 'a5',
            hints: [
              L('Two means mean 3 steps: $r^3=\\frac{81}{3}=27$.', 'Dua sisipan berarti 3 langkah: $r^3=\\frac{81}{3}=27$.'),
              L('$r=3$: $3\\cdot3=9$ and $9\\cdot3=27$.', '$r=3$: $3\\cdot3=9$ dan $9\\cdot3=27$.'),
            ],
            explain: L('$r^3=27$, so $r=3$ and the sequence is $3,9,27,81$.', '$r^3=27$, sehingga $r=3$ dan barisannya $3,9,27,81$.'),
            prompt: L('Two numbers $m_1$ and $m_2$ are inserted between 3 and 81 to make a geometric sequence. Find them.', 'Dua bilangan $m_1$ dan $m_2$ disisipkan di antara 3 dan 81 agar menjadi barisan geometri. Tentukan keduanya.'),
            given: String.raw`3,\ m_1,\ m_2,\ 81`,
            blanks: [
              { label: 'm₁ =', answer: 9 },
              { label: 'm₂ =', answer: 27 },
            ],
          },
        },
      ],
    },

    /* ------------------------------------------------------------- finite sum */
    {
      id: 'sum-of-a-geometric-series',
      heading: L('How do you find the sum of a geometric series?', 'Bagaimana mencari jumlah deret geometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The sum of the first $n$ terms of a geometric sequence with $r\neq1$ is $S_n=\dfrac{a_1(1-r^n)}{1-r}$, which is the same as $\dfrac{a_1(r^n-1)}{r-1}$; if $r=1$ every term is $a_1$ and $S_n=na_1$.** A sum of terms like this is a geometric series.

**Where the formula comes from.** Multiply the sum by $r$ and subtract; nearly everything cancels:

$S_n=a_1+a_1r+a_1r^2+\cdots+a_1r^{n-1}$

$rS_n=\ \ \ \ \ \ \ \,a_1r+a_1r^2+\cdots+a_1r^{n-1}+a_1r^{n}$

$S_n-rS_n=a_1-a_1r^n\quad\Rightarrow\quad S_n(1-r)=a_1(1-r^n)$

Dividing by $1-r$ is allowed only when $r\neq1$, which is why that case is separate.

**Examples.**

- $3+6+12+\cdots$ with 10 terms: $S_{10}=\frac{3(2^{10}-1)}{2-1}=3069$.
- $1+\frac12+\frac14+\cdots+\frac1{512}$ with 10 terms: $S_{10}=\frac{1-(1/2)^{10}}{1-1/2}=2-\frac1{512}=\frac{1023}{512}$.
- The Rhind Papyrus problem of seven houses with seven cats, seven mice, seven ears of wheat and seven measures of grain adds $7+49+343+2401+16807=19607$, which is $\frac{7(7^5-1)}{6}$.
- **The chessboard.** One grain on the first square, two on the second, doubling on each of the 64 squares, gives $2^{64}-1=18{,}446{,}744{,}073{,}709{,}551{,}615$ grains, far more than the world has grown.

**A link with binary.** With $a_1=1$ and $r=2$ the sum is $1+2+4+\cdots+2^{n-1}=2^n-1$, which is the number written as $n$ ones in binary: $11111111_2=255=2^8-1$, as in the article on [binary numbers](article:binary-numbers#bits-and-bytes).

Watch the subtraction and the sum below, together with the partial sums.`,
            T`**Jumlah $n$ suku pertama barisan geometri dengan $r\neq1$ adalah $S_n=\dfrac{a_1(1-r^n)}{1-r}$, yang sama dengan $\dfrac{a_1(r^n-1)}{r-1}$; jika $r=1$ setiap suku adalah $a_1$ dan $S_n=na_1$.** Jumlah suku-suku seperti ini adalah deret geometri.

**Dari mana rumusnya.** Kalikan jumlah dengan $r$ lalu kurangkan; hampir semuanya saling meniadakan:

$S_n=a_1+a_1r+a_1r^2+\cdots+a_1r^{n-1}$

$rS_n=\ \ \ \ \ \ \ \,a_1r+a_1r^2+\cdots+a_1r^{n-1}+a_1r^{n}$

$S_n-rS_n=a_1-a_1r^n\quad\Rightarrow\quad S_n(1-r)=a_1(1-r^n)$

Membagi dengan $1-r$ hanya boleh bila $r\neq1$, itulah sebabnya kasus itu terpisah.

**Contoh.**

- $3+6+12+\cdots$ dengan 10 suku: $S_{10}=\frac{3(2^{10}-1)}{2-1}=3069$.
- $1+\frac12+\frac14+\cdots+\frac1{512}$ dengan 10 suku: $S_{10}=\frac{1-(1/2)^{10}}{1-1/2}=2-\frac1{512}=\frac{1023}{512}$.
- Soal Papirus Rhind tentang tujuh rumah dengan tujuh kucing, tujuh tikus, tujuh bulir gandum, dan tujuh takaran biji menjumlahkan $7+49+343+2401+16807=19607$, yaitu $\frac{7(7^5-1)}{6}$.
- **Papan catur.** Satu butir beras pada petak pertama, dua pada petak kedua, berlipat dua pada tiap dari 64 petak, menghasilkan $2^{64}-1=18.446.744.073.709.551.615$ butir, jauh lebih banyak daripada yang pernah ditanam dunia.

**Kaitan dengan biner.** Dengan $a_1=1$ dan $r=2$ jumlahnya $1+2+4+\cdots+2^{n-1}=2^n-1$, yaitu bilangan yang ditulis sebagai $n$ angka satu dalam biner: $11111111_2=255=2^8-1$, seperti pada artikel [bilangan biner](article:binary-numbers#bits-and-bytes).

Perhatikan pengurangan dan jumlahnya di bawah, beserta jumlah parsialnya.`,
          ),
        },
        { kind: 'widget', name: 'geosum' },
        {
          kind: 'activity',
          title: L('Try it: the sum of 10 terms', 'Coba: jumlah 10 suku'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('Use $S_n=\\frac{a_1(r^n-1)}{r-1}$ with $a_1=3$, $r=2$, $n=10$.', 'Pakai $S_n=\\frac{a_1(r^n-1)}{r-1}$ dengan $a_1=3$, $r=2$, $n=10$.'),
              L('$2^{10}=1024$.', '$2^{10}=1024$.'),
            ],
            explain: L('$S_{10}=\\frac{3(1024-1)}{2-1}=3\\cdot1023=3069$.', '$S_{10}=\\frac{3(1024-1)}{2-1}=3\\cdot1023=3069$.'),
            prompt: L('Find $3+6+12+\\cdots$ to 10 terms.', 'Tentukan $3+6+12+\\cdots$ sampai 10 suku.'),
            given: String.raw`S_{10}=v`,
            blanks: [{ label: 'v =', answer: 3069 }],
          },
        },
      ],
    },

    /* -------------------------------------------------------- infinite series */
    {
      id: 'infinite-geometric-series',
      heading: L('When does an infinite geometric series have a sum?', 'Kapan deret geometri tak hingga punya jumlah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An infinite geometric series has a sum exactly when $|r|<1$, and then $S_\infty=\dfrac{a_1}{1-r}$; for $|r|\ge1$ it diverges (unless every term is 0).** The reason is in the finite formula: $S_n=\dfrac{a_1(1-r^n)}{1-r}$, and when $|r|<1$ the power $r^n$ shrinks to 0, so $S_n$ approaches $\dfrac{a_1}{1-r}$. The gap after $n$ terms is exactly $\dfrac{a_1r^n}{1-r}$, which can be made as small as you like.

- $\frac12+\frac14+\frac18+\cdots=\dfrac{1/2}{1-1/2}=1$: halving what is left of a unit square, over and over, fills the square.
- $6+4+\frac83+\cdots$ has $r=\frac23$, so $S_\infty=\frac{6}{1/3}=18$.
- $1-\frac12+\frac14-\cdots$ has $r=-\frac12$, so $S_\infty=\frac{1}{3/2}=\frac23$.
- $1+\frac14+\frac1{16}+\cdots=\frac43$, the series Archimedes used for the area of a parabolic segment.

For $|r|\ge1$ the partial sums do not settle: $r=1$ gives $na_1$, which grows; $r=-1$ gives $a_1,0,a_1,0,\ldots$; and $|r|>1$ grows without bound, as $1+2+4+8+\cdots$ does. The formula $\frac{a_1}{1-r}$ would give $-1$ for that last series, which is meaningless, so check $|r|<1$ before using it. An arithmetic series never converges, as the [infinite arithmetic series](article:arithmetic-sequences-and-series#infinite-arithmetic-series) section shows.

**Repeating decimals are geometric series.** $0.\overline{3}=\frac3{10}+\frac3{100}+\cdots$ has $a_1=\frac3{10}$ and $r=\frac1{10}$, so it is $\frac{3/10}{9/10}=\frac13$. In the same way $0.\overline{9}=\frac{9/10}{9/10}=1$ exactly, and $0.\overline{27}=\frac{27/100}{99/100}=\frac{3}{11}$. A repeating block of $m$ digits has $r=10^{-m}$. This is the method behind the conversion of repeating decimals to fractions in the article on [real numbers](article:real-numbers#rational-numbers), and it is why [every repeating decimal is rational](article:rational-numbers#decimals-percent).

**Zeno's paradox.** Achilles runs after a tortoise that has a head start. Each time he reaches where the tortoise was, it has moved a little further, so there are infinitely many steps. But the times of the steps form a geometric series with a finite sum, so Achilles does pass the tortoise, at a definite moment.

**A bouncing ball.** Dropped from 10 m and bouncing back to $\frac35$ of its previous height each time, a ball travels $10+2\left(6+3.6+2.16+\cdots\right)=10+2\cdot\dfrac{6}{1-3/5}=40$ m in all.`,
            T`**Deret geometri tak hingga punya jumlah tepat bila $|r|<1$, dan kemudian $S_\infty=\dfrac{a_1}{1-r}$; untuk $|r|\ge1$ ia divergen (kecuali setiap sukunya 0).** Alasannya ada dalam rumus berhingga: $S_n=\dfrac{a_1(1-r^n)}{1-r}$, dan bila $|r|<1$ pangkat $r^n$ mengecil menuju 0, sehingga $S_n$ mendekati $\dfrac{a_1}{1-r}$. Selisih setelah $n$ suku tepat $\dfrac{a_1r^n}{1-r}$, yang dapat dibuat sekecil yang kamu mau.

- $\frac12+\frac14+\frac18+\cdots=\dfrac{1/2}{1-1/2}=1$: membagi dua apa yang tersisa dari persegi satuan, berulang-ulang, memenuhi persegi itu.
- $6+4+\frac83+\cdots$ punya $r=\frac23$, sehingga $S_\infty=\frac{6}{1/3}=18$.
- $1-\frac12+\frac14-\cdots$ punya $r=-\frac12$, sehingga $S_\infty=\frac{1}{3/2}=\frac23$.
- $1+\frac14+\frac1{16}+\cdots=\frac43$, deret yang dipakai Archimedes untuk luas segmen parabola.

Untuk $|r|\ge1$ jumlah parsial tidak menetap: $r=1$ memberi $na_1$, yang membesar; $r=-1$ memberi $a_1,0,a_1,0,\ldots$; dan $|r|>1$ membesar tanpa batas, seperti $1+2+4+8+\cdots$. Rumus $\frac{a_1}{1-r}$ akan memberi $-1$ untuk deret terakhir itu, yang tidak bermakna, jadi periksa $|r|<1$ sebelum memakainya. Deret aritmetika tidak pernah konvergen, seperti ditunjukkan bagian [deret aritmetika tak hingga](article:arithmetic-sequences-and-series#infinite-arithmetic-series).

**Desimal berulang adalah deret geometri.** $0{,}\overline{3}=\frac3{10}+\frac3{100}+\cdots$ punya $a_1=\frac3{10}$ dan $r=\frac1{10}$, sehingga ia $\frac{3/10}{9/10}=\frac13$. Dengan cara yang sama $0{,}\overline{9}=\frac{9/10}{9/10}=1$ tepat, dan $0{,}\overline{27}=\frac{27/100}{99/100}=\frac{3}{11}$. Blok berulang berisi $m$ angka punya $r=10^{-m}$. Inilah metode di balik pengubahan desimal berulang menjadi pecahan pada artikel [bilangan real](article:real-numbers#rational-numbers), dan itulah sebabnya [setiap desimal berulang rasional](article:rational-numbers#decimals-percent).

**Paradoks Zeno.** Achilles mengejar kura-kura yang mendapat start lebih dulu. Setiap kali ia sampai di tempat kura-kura tadi, kura-kura sudah bergerak sedikit lebih jauh, sehingga ada tak berhingga banyak langkah. Tetapi waktu tiap langkah membentuk deret geometri dengan jumlah berhingga, sehingga Achilles memang menyalip kura-kura, pada saat yang pasti.

**Bola memantul.** Dijatuhkan dari 10 m dan memantul kembali setinggi $\frac35$ dari tinggi sebelumnya setiap kali, sebuah bola menempuh $10+2\left(6+3{,}6+2{,}16+\cdots\right)=10+2\cdot\dfrac{6}{1-3/5}=40$ m seluruhnya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: an infinite sum', 'Coba: jumlah tak hingga'),
          step: {
            kind: 'math',
            id: 'a7',
            hints: [
              L('The ratio is $\\frac46=\\frac23$, and $|r|<1$.', 'Rasionya $\\frac46=\\frac23$, dan $|r|<1$.'),
              L('$S_\\infty=\\frac{6}{1-2/3}$.', '$S_\\infty=\\frac{6}{1-2/3}$.'),
            ],
            explain: L('$S_\\infty=\\frac{6}{1-\\frac23}=\\frac{6}{1/3}=18$.', '$S_\\infty=\\frac{6}{1-\\frac23}=\\frac{6}{1/3}=18$.'),
            prompt: L('Find the sum of the infinite series.', 'Tentukan jumlah deret tak hingga ini.'),
            given: String.raw`6+4+\frac83+\cdots=v`,
            blanks: [{ label: 'v =', answer: 18 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: a repeating decimal', 'Coba: desimal berulang'),
          step: {
            kind: 'math',
            id: 'a8',
            hints: [
              L('$0.\\overline{27}=\\frac{27}{100}+\\frac{27}{10000}+\\cdots$, so $a_1=\\frac{27}{100}$ and $r=\\frac1{100}$.', '$0{,}\\overline{27}=\\frac{27}{100}+\\frac{27}{10000}+\\cdots$, sehingga $a_1=\\frac{27}{100}$ dan $r=\\frac1{100}$.'),
              L('$\\frac{27/100}{99/100}=\\frac{27}{99}$; cancel the common factor 9.', '$\\frac{27/100}{99/100}=\\frac{27}{99}$; coret faktor sekutu 9.'),
            ],
            explain: L('$S_\\infty=\\frac{27/100}{1-1/100}=\\frac{27}{99}=\\frac{3}{11}$.', '$S_\\infty=\\frac{27/100}{1-1/100}=\\frac{27}{99}=\\frac{3}{11}$.'),
            prompt: L('Write the repeating decimal as a fraction in lowest terms.', 'Tulis desimal berulang ini sebagai pecahan paling sederhana.'),
            given: { en: String.raw`0.\overline{27}=\frac{a}{b}`, id: String.raw`0{,}\overline{27}=\frac{a}{b}` },
            blanks: [
              { label: 'a =', answer: 3 },
              { label: 'b =', answer: 11 },
            ],
          },
        },
      ],
    },

    /* ------------------------------------------------------------ applications */
    {
      id: 'growth-and-decay',
      heading: L('Where do geometric sequences appear: interest, decay and growth?', 'Di mana barisan geometri muncul: bunga, peluruhan, dan pertumbuhan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Anything that changes by a fixed percentage each period is a geometric sequence: a rise of $p\%$ multiplies by $r=1+\frac p{100}$ and a fall of $p\%$ multiplies by $r=1-\frac p{100}$.** Note that a 5% increase has ratio 1.05, not 0.05, and a 20% decrease has ratio 0.8, not 0.2.

| Situation | Setup | Result |
|---|---|---|
| Savings of 1,000 dollars earn 5% a year, compounded | $r=1.05$ | after 10 years $1000\cdot1.05^{10}\approx1628.89$ dollars |
| A car worth 20,000 dollars loses 20% of its value each year | $r=0.8$ | after 3 years $20000\cdot0.8^3=10240$ dollars |
| 200 mg of caffeine with a half-life of 5 hours | $r=\frac12$ per 5 hours | after 15 hours $200\cdot\frac18=25$ mg |
| A sheet of paper 0.1 mm thick, folded in half 10 times | $r=2$ | $0.1\cdot2^{10}=102.4$ mm |
| A savings plan of 100 dollars at the end of each month at 1% a month | a geometric sum | after 12 months $100\cdot\frac{1.01^{12}-1}{0.01}\approx1268.25$ dollars |

**Compound interest** gives the balance $P\,(1+i)^n$ after $n$ periods at rate $i$ per period. Interest that is added only to the original deposit instead gives an [arithmetic sequence](article:arithmetic-sequences-and-series#word-problems). Compounding more often helps only a little: the factor $\left(1+\frac1n\right)^n$ approaches the irrational number $e\approx2.71828$, which Jacob Bernoulli met in 1683 while studying exactly this, as the article on [π, e and transcendental numbers](article:irrational-numbers#pi-e-transcendental) recounts.

**Decay never reaches zero.** A half-life, a depreciating value or a cooling difference in temperature keeps getting multiplied by a ratio below 1, so it shrinks toward 0 without ever being 0.

**Annuities** are sums of geometric series. Each deposit grows by $r=1+i$ for a different number of periods, so the total is $P\,\bigl(1+(1+i)+\cdots+(1+i)^{n-1}\bigr)=P\,\dfrac{(1+i)^n-1}{i}$, the sum formula with ratio $1+i$.

**Folding paper** shows how fast doubling is. A sheet 0.1 mm thick folded 42 times, which cannot actually be done, would be $0.1\cdot2^{42}$ mm, about 440,000 km, more than the distance to the Moon.`,
            T`**Apa pun yang berubah dengan persentase tetap tiap periode adalah barisan geometri: kenaikan $p\%$ mengalikan dengan $r=1+\frac p{100}$ dan penurunan $p\%$ mengalikan dengan $r=1-\frac p{100}$.** Perhatikan bahwa kenaikan 5% berasio 1,05, bukan 0,05, dan penurunan 20% berasio 0,8, bukan 0,2.

| Situasi | Pemodelan | Hasil |
|---|---|---|
| Tabungan Rp1.000.000 berbunga 5% per tahun, majemuk | $r=1{,}05$ | setelah 10 tahun $1000000\cdot1{,}05^{10}\approx1628895$, yaitu Rp1.628.895 |
| Mobil senilai Rp200.000.000 kehilangan 20% nilainya tiap tahun | $r=0{,}8$ | setelah 3 tahun $200000000\cdot0{,}8^3=102400000$, yaitu Rp102.400.000 |
| 200 mg kafein dengan waktu paruh 5 jam | $r=\frac12$ per 5 jam | setelah 15 jam $200\cdot\frac18=25$ mg |
| Selembar kertas setebal 0,1 mm dilipat dua 10 kali | $r=2$ | $0{,}1\cdot2^{10}=102{,}4$ mm |
| Rencana menabung Rp1.000.000 di akhir tiap bulan dengan bunga 1% per bulan | jumlah geometri | setelah 12 bulan $1000000\cdot\frac{1{,}01^{12}-1}{0{,}01}\approx12682503$, yaitu Rp12.682.503 |

**Bunga majemuk** memberi saldo $P\,(1+i)^n$ setelah $n$ periode dengan bunga $i$ per periode. Bunga yang ditambahkan hanya pada simpanan awal memberi [barisan aritmetika](article:arithmetic-sequences-and-series#word-problems). Memajemukkan lebih sering hanya membantu sedikit: faktor $\left(1+\frac1n\right)^n$ mendekati bilangan irasional $e\approx2{,}71828$, yang dijumpai Jacob Bernoulli pada 1683 saat mempelajari hal ini, seperti dikisahkan artikel [π, e, dan bilangan transenden](article:irrational-numbers#pi-e-transcendental).

**Peluruhan tidak pernah mencapai nol.** Waktu paruh, nilai yang menyusut, atau selisih suhu yang mendingin terus dikalikan rasio di bawah 1, sehingga mengecil menuju 0 tanpa pernah menjadi 0.

**Anuitas** adalah jumlah deret geometri. Tiap setoran tumbuh dengan $r=1+i$ selama banyak periode yang berbeda, sehingga totalnya $P\,\bigl(1+(1+i)+\cdots+(1+i)^{n-1}\bigr)=P\,\dfrac{(1+i)^n-1}{i}$, rumus jumlah dengan rasio $1+i$.

**Melipat kertas** menunjukkan betapa cepatnya penggandaan. Selembar kertas setebal 0,1 mm yang dilipat 42 kali, yang sebenarnya tidak dapat dilakukan, akan setebal $0{,}1\cdot2^{42}$ mm, sekitar 440.000 km, lebih dari jarak ke Bulan.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: compound interest', 'Coba: bunga majemuk'),
          step: {
            kind: 'quiz',
            id: 'a9',
            prompt: L('1,000 dollars earn 5% a year, compounded. About how much is there after 10 years?', 'Rp1.000.000 berbunga 5% per tahun, majemuk. Kira-kira berapa setelah 10 tahun?'),
            options: [L('1,500 dollars', 'Rp1.500.000'), L('1,629 dollars', 'Rp1.629.000'), L('1,050 dollars', 'Rp1.050.000'), L('2,000 dollars', 'Rp2.000.000')],
            answer: 1,
            explain: L(
              'Each year multiplies by $1.05$, so after 10 years the amount is $1000\\cdot1.05^{10}\\approx1628.89$. Simple interest would give only $1000+10\\cdot50=1500$.',
              'Tiap tahun dikalikan $1{,}05$, sehingga setelah 10 tahun jumlahnya $1000000\\cdot1{,}05^{10}\\approx1628895$. Bunga tunggal hanya memberi $1000000+10\\cdot50000=1500000$.',
            ),
            hint: L('The ratio is 1.05, and the exponent is the number of years.', 'Rasionya 1,05, dan eksponennya adalah banyak tahun.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'sequences-in-code',
      heading: L('How do you work with geometric sequences in Python and JavaScript?', 'Bagaimana mengolah barisan geometri di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Build the terms with the power operator, ´a1 * r ** i´ in both languages, and use ´fractions.Fraction´ in Python when the sum must be exact.** Powers grow or shrink so fast that floats overflow to infinity or underflow to 0 long before the maths becomes interesting.`,
            T`**Bangun suku-sukunya dengan operator pangkat, ´a1 * r ** i´ di kedua bahasa, dan pakai ´fractions.Fraction´ di Python bila jumlahnya harus eksak.** Pangkat tumbuh atau mengecil begitu cepat sehingga float meluap menjadi tak hingga atau menjadi 0 jauh sebelum matematikanya menarik.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> a1, r, n = 3, 2, 10
>>> [a1 * r ** i for i in range(5)]           # a_1 r^(i), i from 0
[3, 6, 12, 24, 48]
>>> a1 * r ** (n - 1)                         # the n-th term
1536
>>> a1 * (r ** n - 1) // (r - 1)              # the sum of n terms (exact for integers)
3069
>>> from fractions import Fraction
>>> sum(Fraction(1, 2) ** i for i in range(10))   # exact, no rounding
Fraction(1023, 512)
>>> 2 ** 64 - 1                               # the chessboard
18446744073709551615
>>> 1000 * 1.05 ** 10                         # compound interest, as a float
1628.894626777442
>>> 2.0 ** 1024                               # beyond the largest float: raises OverflowError`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `const terms = (a1, r, n) => Array.from({ length: n }, (_, i) => a1 * r ** i)
terms(3, 2, 5)                              // [3, 6, 12, 24, 48]
terms(3, 2, 10).reduce((s, x) => s + x, 0)  // 3069
2 ** 1024                                   // Infinity: beyond the largest float
0.5 ** 1075                                 // 0: smaller than the smallest float
2n ** 64n - 1n                              // 18446744073709551615n (BigInt is exact)`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´a1 * r ** n´ for the n-th term | gives the term after it | use ´r ** (n - 1)´, or index from 0 |
| The sum formula with ´r == 1´ | ZeroDivisionError in Python, ´NaN´ or ´Infinity´ in JavaScript | handle ´r == 1´ separately: the sum is ´n * a1´ |
| ´^´ for a power | it is XOR, not a power | use ´**´, as in the article on [binary numbers](article:binary-numbers#bitwise-operators) |
| Large powers as floats | ´2.0 ** 1024´ raises OverflowError in Python and is ´Infinity´ in JavaScript | use integers, ´BigInt´ or ´Fraction´ |
| Tiny powers as floats | ´0.5 ** 1075´ is 0 | use ´Fraction´ or ´Decimal´ |
| ´/´ in the sum formula | gives a float: ´3069.0´ | use ´//´ when everything is an integer |
| Summing an infinite series | a loop never ends | use ´a1 / (1 - r)´ when ´abs(r) < 1´ |

Exact fractions avoid the rounding of floats, as in the article on [rational numbers](article:rational-numbers#fractions-in-code). Check a closed form against a short loop before relying on it.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´a1 * r ** n´ untuk suku ke-n | memberi suku sesudahnya | pakai ´r ** (n - 1)´, atau beri indeks dari 0 |
| Rumus jumlah dengan ´r == 1´ | ZeroDivisionError di Python, ´NaN´ atau ´Infinity´ di JavaScript | tangani ´r == 1´ secara terpisah: jumlahnya ´n * a1´ |
| ´^´ untuk pangkat | itu XOR, bukan pangkat | pakai ´**´, seperti pada artikel [bilangan biner](article:binary-numbers#bitwise-operators) |
| Pangkat besar sebagai float | ´2.0 ** 1024´ menimbulkan OverflowError di Python dan ´Infinity´ di JavaScript | pakai bilangan bulat, ´BigInt´, atau ´Fraction´ |
| Pangkat kecil sebagai float | ´0.5 ** 1075´ adalah 0 | pakai ´Fraction´ atau ´Decimal´ |
| ´/´ dalam rumus jumlah | memberi float: ´3069.0´ | pakai ´//´ bila semuanya bilangan bulat |
| Menjumlah deret tak hingga | perulangan tidak pernah berakhir | pakai ´a1 / (1 - r)´ bila ´abs(r) < 1´ |

Pecahan eksak menghindari pembulatan float, seperti pada artikel [bilangan rasional](article:rational-numbers#fractions-in-code). Periksa bentuk tertutup dengan perulangan pendek sebelum mengandalkannya.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do geometric series come from?', 'Dari mana asal deret geometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Geometric progressions appear in the oldest mathematics, and the idea that infinitely many terms can add to a finite number took the Greeks centuries to accept.**

- **c. 1550 BCE.** Problem 79 of the Rhind Papyrus lists seven houses, each with seven cats, each killing seven mice, and so on: the powers of 7 and their sum, 19607.
- **5th century BCE.** Zeno's paradoxes of motion, such as Achilles and the tortoise, puzzled the Greeks because they seemed to add infinitely many steps.
- **c. 300 BCE.** Euclid's *Elements*, Book IX, proposition 35, gives the sum of terms in geometric progression in the language of proportions, the first proof of the finite sum formula.
- **c. 250 BCE.** Archimedes, in the *Quadrature of the Parabola*, summed $1+\frac14+\frac1{16}+\cdots=\frac43$ to find the area of a parabolic segment, an early use of an infinite series with the sum found by a careful argument.
- **1683.** Jacob Bernoulli found the number $e$ as the limit of compound interest $\left(1+\frac1n\right)^n$.

A well-known legend tells of the inventor of chess who asked a king for one grain of rice on the first square, two on the second and so on, and asked for more than the kingdom could ever supply. The tale is old, with versions told in Arabic sources by the 13th century, and it remains the most memorable way to feel how fast $2^{n}$ grows.`,
            T`**Barisan geometri muncul dalam matematika tertua, dan gagasan bahwa tak berhingga banyak suku dapat berjumlah bilangan berhingga membutuhkan berabad-abad bagi bangsa Yunani untuk menerimanya.**

- **Sekitar 1550 SM.** Soal 79 Papirus Rhind mendaftar tujuh rumah, masing-masing dengan tujuh kucing, masing-masing membunuh tujuh tikus, dan seterusnya: pangkat 7 dan jumlahnya, 19607.
- **Abad ke-5 SM.** Paradoks gerak Zeno, seperti Achilles dan kura-kura, membingungkan bangsa Yunani karena tampak menjumlahkan tak berhingga banyak langkah.
- **Sekitar 300 SM.** *Elements* Euclid, Buku IX, proposisi 35, memberi jumlah suku-suku dalam progresi geometri dalam bahasa perbandingan, bukti pertama rumus jumlah berhingga.
- **Sekitar 250 SM.** Archimedes, dalam *Quadrature of the Parabola*, menjumlahkan $1+\frac14+\frac1{16}+\cdots=\frac43$ untuk mencari luas segmen parabola, penggunaan awal deret tak hingga dengan jumlah yang ditemukan lewat argumen yang cermat.
- **1683.** Jacob Bernoulli menemukan bilangan $e$ sebagai limit bunga majemuk $\left(1+\frac1n\right)^n$.

Legenda terkenal bercerita tentang penemu catur yang meminta kepada raja satu butir beras pada petak pertama, dua pada petak kedua, dan seterusnya, dan meminta lebih daripada yang dapat disediakan kerajaan. Kisah ini tua, dengan versi yang diceritakan dalam sumber Arab pada abad ke-13, dan tetap menjadi cara paling berkesan untuk merasakan betapa cepat $2^{n}$ tumbuh.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with geometric sequences?', 'Apa kesalahan umum pada barisan geometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with geometric sequences are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| $a_n=a_1r^n$ | $a_n=a_1r^{n-1}$: for $n=1$ the term is $a_1$, not $a_1r$. |
| $3,6,9,12$ is geometric | It adds 3, so it is arithmetic; a geometric sequence multiplies. |
| $r=\frac{a_n}{a_{n+1}}$ | Later over earlier: $r=\frac{a_{n+1}}{a_n}$; for $64,32,16$ it is $\frac12$, not 2. |
| A 5% rise has $r=0.05$ | It has $r=1.05$; a 20% fall has $r=0.8$. |
| Doubling for 10 years gives 20 times | It gives $2^{10}=1024$ times. |
| $S_n=a_1\frac{r^n-1}{r}$ | Divide by $r-1$: $S_n=a_1\frac{r^n-1}{r-1}$. |
| The formula works for $r=1$ | It divides by 0; for $r=1$ the sum is $na_1$. |
| $1+2+4+8+\cdots=\frac{1}{1-2}=-1$ | $|r|\ge1$: the series diverges and has no sum. |
| The geometric mean of 2 and 8 is 5 | That is the arithmetic mean; the geometric mean is $\sqrt{16}=4$. |`,
            T`**Kesalahan paling umum pada barisan geometri adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| $a_n=a_1r^n$ | $a_n=a_1r^{n-1}$: untuk $n=1$ sukunya $a_1$, bukan $a_1r$. |
| $3,6,9,12$ geometri | Ia menambah 3, sehingga aritmetika; barisan geometri mengalikan. |
| $r=\frac{a_n}{a_{n+1}}$ | Yang kemudian per yang lebih dulu: $r=\frac{a_{n+1}}{a_n}$; untuk $64,32,16$ ia $\frac12$, bukan 2. |
| Kenaikan 5% berarti $r=0{,}05$ | Ia berarti $r=1{,}05$; penurunan 20% berarti $r=0{,}8$. |
| Berlipat dua selama 10 tahun menjadi 20 kali | Ia menjadi $2^{10}=1024$ kali. |
| $S_n=a_1\frac{r^n-1}{r}$ | Bagi dengan $r-1$: $S_n=a_1\frac{r^n-1}{r-1}$. |
| Rumusnya berlaku untuk $r=1$ | Ia membagi dengan 0; untuk $r=1$ jumlahnya $na_1$. |
| $1+2+4+8+\cdots=\frac{1}{1-2}=-1$ | $|r|\ge1$: deretnya divergen dan tidak punya jumlah. |
| Rata-rata geometri 2 dan 8 adalah 5 | Itu rata-rata aritmetika; rata-rata geometrinya $\sqrt{16}=4$. |`,
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
              L('$3,9,27,81$ is a geometric sequence.', '$3,9,27,81$ adalah barisan geometri.'),
              L('The series $1+2+4+8+\\cdots$ has a finite sum.', 'Deret $1+2+4+8+\\cdots$ punya jumlah berhingga.'),
              L('If $|r|<1$ the infinite geometric series has sum $\\frac{a_1}{1-r}$.', 'Jika $|r|<1$ deret geometri tak hingga punya jumlah $\\frac{a_1}{1-r}$.'),
              L('$-2,4,-8,16$ is a geometric sequence.', '$-2,4,-8,16$ adalah barisan geometri.'),
              L('A growth of 5% a year means $r=0.05$.', 'Pertumbuhan 5% per tahun berarti $r=0{,}05$.'),
            ],
            answer: [true, false, true, true, false],
            explain: L(
              '$3,9,27,81$ has $r=3$ and $-2,4,-8,16$ has $r=-2$. The series $1+2+4+\\cdots$ has $|r|=2\\ge1$, so it diverges. The sum formula holds for $|r|<1$. A 5% rise has $r=1.05$.',
              '$3,9,27,81$ memiliki $r=3$ dan $-2,4,-8,16$ memiliki $r=-2$. Deret $1+2+4+\\cdots$ memiliki $|r|=2\\ge1$, sehingga divergen. Rumus jumlah berlaku untuk $|r|<1$. Kenaikan 5% berarti $r=1{,}05$.',
            ),
            hint: L('Find each ratio, and check whether $|r|$ is below 1.', 'Cari tiap rasio, dan periksa apakah $|r|$ di bawah 1.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the geometric sequences.', 'Pilih **semua** barisan geometri.'),
            options: [L('$5,10,20,40$', '$5,10,20,40$'), L('$1,-1,1,-1$', '$1,-1,1,-1$'), L('$2,4,6,8$', '$2,4,6,8$'), L('$100,10,1,0.1$', '$100,10,1,0{,}1$'), L('$1,3,6,10$', '$1,3,6,10$')],
            answer: [0, 1, 3],
            explain: L(
              '$5,10,20,40$ has $r=2$, $1,-1,1,-1$ has $r=-1$ and $100,10,1,0.1$ has $r=\\frac1{10}$. $2,4,6,8$ adds 2, and $1,3,6,10$ has ratios $3,2,\\frac53$.',
              '$5,10,20,40$ memiliki $r=2$, $1,-1,1,-1$ memiliki $r=-1$, dan $100,10,1,0{,}1$ memiliki $r=\\frac1{10}$. $2,4,6,8$ menambah 2, dan $1,3,6,10$ rasionya $3,2,\\frac53$.',
            ),
            hint: L('Divide each term by the one before it.', 'Bagi tiap suku dengan suku sebelumnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('A later term', 'Suku yang lebih jauh'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('$a_6=a_1r^5$.', '$a_6=a_1r^5$.'),
              L('$5\\cdot3^5=5\\cdot243$.', '$5\\cdot3^5=5\\cdot243$.'),
            ],
            explain: L('$a_6=5\\cdot3^{5}=5\\cdot243=1215$.', '$a_6=5\\cdot3^{5}=5\\cdot243=1215$.'),
            prompt: L('The first term is 5 and $r=3$. Find $a_6$.', 'Suku pertamanya 5 dan $r=3$. Tentukan $a_6$.'),
            given: String.raw`a_1=5,\ r=3:\quad a_6=v`,
            blanks: [{ label: 'v =', answer: 1215 }],
          },
        },
        {
          kind: 'activity',
          title: L('An infinite sum as a fraction', 'Jumlah tak hingga sebagai pecahan'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('$a_1=1$ and $r=\\frac13$.', '$a_1=1$ dan $r=\\frac13$.'),
              L('$S_\\infty=\\frac{1}{1-1/3}=\\frac{1}{2/3}$.', '$S_\\infty=\\frac{1}{1-1/3}=\\frac{1}{2/3}$.'),
            ],
            explain: L('$S_\\infty=\\frac{1}{1-\\frac13}=\\frac{1}{2/3}=\\frac32$.', '$S_\\infty=\\frac{1}{1-\\frac13}=\\frac{1}{2/3}=\\frac32$.'),
            prompt: L('Write the sum as a fraction.', 'Tulis jumlahnya sebagai pecahan.'),
            given: String.raw`1+\frac13+\frac19+\cdots=\frac{a}{b}`,
            blanks: [
              { label: 'a =', answer: 3 },
              { label: 'b =', answer: 2 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('A finite sum', 'Jumlah berhingga'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What is $2+6+18+54+162$?', 'Berapakah $2+6+18+54+162$?'),
            options: [L('$242$', '$242$'), L('$240$', '$240$'), L('$244$', '$244$'), L('$486$', '$486$')],
            answer: 0,
            explain: L(
              '$a_1=2$, $r=3$, $n=5$: $S_5=\\frac{2(3^5-1)}{3-1}=\\frac{2\\cdot242}{2}=242$. Adding directly gives the same.',
              '$a_1=2$, $r=3$, $n=5$: $S_5=\\frac{2(3^5-1)}{3-1}=\\frac{2\\cdot242}{2}=242$. Menjumlahkan langsung memberi hasil yang sama.',
            ),
            hint: L('Use $S_n=\\frac{a_1(r^n-1)}{r-1}$ with $n=5$, or just add.', 'Pakai $S_n=\\frac{a_1(r^n-1)}{r-1}$ dengan $n=5$, atau langsung jumlahkan.'),
          },
        },
        {
          kind: 'activity',
          title: L('A bouncing ball', 'Bola memantul'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('A ball is dropped from 10 m and each bounce reaches $\\frac35$ of the height before it. How far does it travel in all?', 'Sebuah bola dijatuhkan dari 10 m dan tiap pantulan mencapai $\\frac35$ dari tinggi sebelumnya. Berapa jarak total yang ditempuhnya?'),
            options: [L('$25$ m', '$25$ m'), L('$30$ m', '$30$ m'), L('$40$ m', '$40$ m'), L('$50$ m', '$50$ m')],
            answer: 2,
            explain: L(
              'After the first drop it goes up and down by $6,3.6,2.16,\\ldots$: $2\\cdot\\frac{6}{1-3/5}=30$, plus the first drop of 10, so 40 m.',
              'Setelah jatuhan pertama ia naik dan turun sejauh $6,3{,}6,2{,}16,\\ldots$: $2\\cdot\\frac{6}{1-3/5}=30$, ditambah jatuhan pertama 10, sehingga 40 m.',
            ),
            hint: L('Each bounce is travelled twice, up and down, except the first drop.', 'Tiap pantulan ditempuh dua kali, naik dan turun, kecuali jatuhan pertama.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: geometric sequences and series at a glance', 'Ringkasan: barisan dan deret geometri sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** $\frac{a_{n+1}}{a_n}=r$ is constant and no term is 0; each term is the geometric mean of its neighbours.
- **n-th term:** $a_n=a_1r^{n-1}$, exponential in $n$; $|r|>1$ grows, $|r|<1$ decays, $r<0$ alternates.
- **From two terms:** $r^{q-p}=\frac{a_q}{a_p}$ (one or two real ratios); $k$ means between $a$ and $b$: $r^{k+1}=\frac ba$.
- **Sum of n terms:** $S_n=\dfrac{a_1(1-r^n)}{1-r}$ for $r\neq1$, and $na_1$ for $r=1$.
- **Infinite series:** $S_\infty=\dfrac{a_1}{1-r}$ only for $|r|<1$; repeating decimals are such series.
- **Percent change:** a rise of $p\%$ has $r=1+\frac p{100}$, a fall has $r=1-\frac p{100}$; compound interest is $P(1+i)^n$.
- **Code:** ´a1 * r ** (n - 1)´; use integers, ´BigInt´ or ´Fraction´ to avoid float overflow and rounding.`,
            T`- **Definisi:** $\frac{a_{n+1}}{a_n}=r$ konstan dan tidak ada suku 0; tiap suku adalah rata-rata geometri tetangganya.
- **Suku ke-n:** $a_n=a_1r^{n-1}$, eksponensial dalam $n$; $|r|>1$ tumbuh, $|r|<1$ meluruh, $r<0$ bergantian.
- **Dari dua suku:** $r^{q-p}=\frac{a_q}{a_p}$ (satu atau dua rasio real); $k$ sisipan di antara $a$ dan $b$: $r^{k+1}=\frac ba$.
- **Jumlah n suku:** $S_n=\dfrac{a_1(1-r^n)}{1-r}$ untuk $r\neq1$, dan $na_1$ untuk $r=1$.
- **Deret tak hingga:** $S_\infty=\dfrac{a_1}{1-r}$ hanya untuk $|r|<1$; desimal berulang adalah deret seperti itu.
- **Perubahan persen:** kenaikan $p\%$ berarti $r=1+\frac p{100}$, penurunan berarti $r=1-\frac p{100}$; bunga majemuk adalah $P(1+i)^n$.
- **Kode:** ´a1 * r ** (n - 1)´; pakai bilangan bulat, ´BigInt´, atau ´Fraction´ untuk menghindari luapan dan pembulatan float.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Geometric sequence', 'Barisan geometri'), definition: L('A sequence of non-zero numbers in which each term is the previous one times the same fixed number, such as 3, 6, 12, 24.', 'Barisan bilangan bukan nol yang setiap sukunya adalah suku sebelumnya dikali bilangan tetap yang sama, seperti 3, 6, 12, 24.') },
    { term: L('Common ratio', 'Rasio'), definition: L('The constant multiplier r between neighbouring terms of a geometric sequence, found by dividing a term by the one before it.', 'Pengali tetap r antara suku-suku bertetangga pada barisan geometri, diperoleh dengan membagi sebuah suku dengan suku sebelumnya.') },
    { term: L('Geometric series', 'Deret geometri'), definition: L('The sum of the terms of a geometric sequence, finite or infinite.', 'Jumlah suku-suku barisan geometri, berhingga atau tak hingga.') },
    { term: L('Exponential growth', 'Pertumbuhan eksponensial'), definition: L('Growth in which a quantity is multiplied by the same factor greater than 1 in each period, as in a geometric sequence with ratio above 1.', 'Pertumbuhan yang besarannya dikali faktor yang sama lebih dari 1 tiap periode, seperti pada barisan geometri dengan rasio di atas 1.') },
    { term: L('Exponential decay', 'Peluruhan eksponensial'), definition: L('Decrease in which a quantity is multiplied by the same factor between 0 and 1 in each period, so it shrinks toward 0 but never reaches it.', 'Penurunan yang besarannya dikali faktor yang sama antara 0 dan 1 tiap periode, sehingga mengecil menuju 0 tetapi tidak pernah mencapainya.') },
    { term: L('Geometric mean', 'Rata-rata geometri'), definition: L('For two positive numbers a and b, the number equal to the square root of a times b; each term of a geometric sequence is the geometric mean of its neighbours.', 'Untuk dua bilangan positif a dan b, bilangan yang sama dengan akar dari a kali b; tiap suku barisan geometri adalah rata-rata geometri tetangganya.') },
    { term: L('Partial sum', 'Jumlah parsial'), definition: L('The sum S sub n of the first n terms of a series.', 'Jumlah S indeks n dari n suku pertama sebuah deret.') },
    { term: L('Convergent series', 'Deret konvergen'), definition: L('A series whose partial sums approach a fixed finite number, called its sum; an infinite geometric series converges exactly when the ratio is smaller than 1 in size.', 'Deret yang jumlah parsialnya mendekati bilangan berhingga tetap, yang disebut jumlahnya; deret geometri tak hingga konvergen tepat bila rasionya berukuran kurang dari 1.') },
    { term: L('Divergent series', 'Deret divergen'), definition: L('A series whose partial sums do not approach a finite number, such as 1 plus 2 plus 4 plus 8 and so on.', 'Deret yang jumlah parsialnya tidak mendekati bilangan berhingga, seperti 1 ditambah 2 ditambah 4 ditambah 8 dan seterusnya.') },
    { term: L('Sum to infinity', 'Jumlah tak hingga'), definition: L('The value a convergent infinite series approaches, equal to the first term over 1 minus the ratio for a geometric series.', 'Nilai yang didekati deret tak hingga yang konvergen, sama dengan suku pertama per 1 dikurangi rasio untuk deret geometri.') },
    { term: L('Compound interest', 'Bunga majemuk'), definition: L('Interest that is added to the balance so that it earns interest itself, which makes the balance a geometric sequence with ratio 1 plus the rate.', 'Bunga yang ditambahkan ke saldo sehingga ia sendiri berbunga, yang membuat saldo menjadi barisan geometri dengan rasio 1 ditambah suku bunga.') },
    { term: L('Half-life', 'Waktu paruh'), definition: L('The time in which a decaying quantity falls to half its value, so that it is multiplied by one half each half-life.', 'Waktu yang diperlukan suatu besaran yang meluruh untuk turun menjadi setengah nilainya, sehingga dikali setengah tiap waktu paruh.') },
    { term: L('Annuity', 'Anuitas'), definition: L('A series of equal payments at regular intervals, whose total value is a geometric sum.', 'Serangkaian pembayaran sama besar pada selang teratur, yang nilai totalnya adalah jumlah geometri.') },
    { term: L('Arithmetic sequence', 'Barisan aritmetika'), definition: L('A sequence in which each term is the previous one plus the same fixed number, as opposed to multiplied by it.', 'Barisan yang setiap sukunya adalah suku sebelumnya ditambah bilangan tetap yang sama, bukan dikali.') },
  ],

  howTo: [
    {
      name: L('How to find the ratio and the first term from two terms', 'Cara mencari rasio dan suku pertama dari dua suku'),
      description: L('Divide the two terms, take the root for the number of steps between them, then step back to the first term.', 'Bagi kedua suku, tarik akar sebanyak langkah di antaranya, lalu mundur ke suku pertama.'),
      steps: [
        { name: L('Divide the terms', 'Bagi suku-sukunya'), text: L('Divide the later term by the earlier one: for a2 equal to 6 and a5 equal to 48, 48 over 6 is 8.', 'Bagi suku yang kemudian dengan yang lebih dulu: untuk a2 sama dengan 6 dan a5 sama dengan 48, 48 per 6 adalah 8.') },
        { name: L('Count the steps', 'Hitung langkahnya'), text: L('Count the steps between the positions: 5 minus 2 is 3.', 'Hitung langkah di antara posisinya: 5 dikurangi 2 adalah 3.') },
        { name: L('Take the root', 'Tarik akarnya'), text: L('Take that root of the quotient to get the ratio: the cube root of 8 is 2. For an even number of steps both the positive and the negative root fit.', 'Tarik akar sebanyak itu dari hasil bagi untuk mendapat rasio: akar pangkat tiga 8 adalah 2. Untuk banyak langkah genap, akar positif dan negatif sama-sama cocok.') },
        { name: L('Step back to a1', 'Mundur ke a1'), text: L('Divide the known term by the ratio p minus 1 times: a1 is 6 divided by 2, which is 3.', 'Bagi suku yang diketahui dengan rasio sebanyak p dikurangi 1 kali: a1 adalah 6 dibagi 2, yaitu 3.') },
      ],
    },
    {
      name: L('How to find the sum of a finite geometric series', 'Cara mencari jumlah deret geometri berhingga'),
      description: L('Use the first term, the ratio and the number of terms in the sum formula.', 'Pakai suku pertama, rasio, dan banyak suku dalam rumus jumlah.'),
      steps: [
        { name: L('Read off a1, r and n', 'Baca a1, r, dan n'), text: L('Find the first term, the ratio and the number of terms, for example 3, 2 and 10.', 'Tentukan suku pertama, rasio, dan banyak suku, misalnya 3, 2, dan 10.') },
        { name: L('Check the ratio', 'Periksa rasionya'), text: L('If the ratio is 1 the sum is n times a1; otherwise continue with the formula.', 'Jika rasionya 1 jumlahnya n kali a1; jika tidak lanjutkan dengan rumus.') },
        { name: L('Use the formula', 'Pakai rumusnya'), text: L('Compute a1 times r to the n minus 1, all over r minus 1: 3 times 1023 over 1.', 'Hitung a1 kali r pangkat n dikurangi 1, seluruhnya dibagi r dikurangi 1: 3 kali 1023 per 1.') },
        { name: L('State the sum', 'Nyatakan jumlahnya'), text: L('The sum is 3069; check it against the first few terms added by hand.', 'Jumlahnya 3069; periksa terhadap beberapa suku pertama yang dijumlahkan dengan tangan.') },
      ],
    },
    {
      name: L('How to write a repeating decimal as a fraction', 'Cara menulis desimal berulang sebagai pecahan'),
      description: L('Treat the repeating digits as an infinite geometric series with ratio one over a power of ten.', 'Perlakukan angka yang berulang sebagai deret geometri tak hingga dengan rasio satu per pangkat sepuluh.'),
      steps: [
        { name: L('Write the first block', 'Tulis blok pertama'), text: L('Write the first repeating block as a fraction over a power of ten: for 0.272727 the first block is 27 over 100.', 'Tulis blok berulang pertama sebagai pecahan di atas pangkat sepuluh: untuk 0,272727 blok pertamanya 27 per 100.') },
        { name: L('Find the ratio', 'Cari rasionya'), text: L('The ratio is one over ten to the number of digits in the block, so here 1 over 100.', 'Rasionya satu per sepuluh pangkat banyak angka dalam blok, jadi di sini 1 per 100.') },
        { name: L('Apply the infinite sum', 'Terapkan jumlah tak hingga'), text: L('Divide the first block by 1 minus the ratio: 27 over 100 divided by 99 over 100 is 27 over 99.', 'Bagi blok pertama dengan 1 dikurangi rasio: 27 per 100 dibagi 99 per 100 adalah 27 per 99.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('Cancel the common factor 9 to get 3 over 11.', 'Coret faktor sekutu 9 untuk mendapat 3 per 11.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a geometric sequence?', 'Apa itu barisan geometri?'),
      a: L(
        'A geometric sequence is a list of non-zero numbers in which each term is the previous term multiplied by the same fixed number, called the common ratio. For example 3, 6, 12, 24 doubles each time, so the ratio is 2. The ratio can be a fraction or negative.',
        'Barisan geometri adalah daftar bilangan bukan nol yang setiap sukunya sama dengan suku sebelumnya dikali bilangan tetap yang sama, yang disebut rasio. Misalnya 3, 6, 12, 24 berlipat dua setiap kali, sehingga rasionya 2. Rasionya dapat berupa pecahan atau negatif.',
      ),
    },
    {
      q: L('What is the formula for the n-th term of a geometric sequence?', 'Apa rumus suku ke-n barisan geometri?'),
      a: L(
        'The n-th term is the first term times the ratio raised to the power n minus 1, written a sub n equals a sub 1 times r to the n minus 1. For 3, 6, 12 the tenth term is 3 times 2 to the 9, which is 1536.',
        'Suku ke-n adalah suku pertama dikali rasio pangkat n dikurangi 1, ditulis a indeks n sama dengan a indeks 1 kali r pangkat n dikurangi 1. Untuk 3, 6, 12 suku kesepuluh adalah 3 kali 2 pangkat 9, yaitu 1536.',
      ),
    },
    {
      q: L('What is the formula for the sum of a geometric series?', 'Apa rumus jumlah deret geometri?'),
      a: L(
        'For a ratio r not equal to 1, the sum of the first n terms is the first term times 1 minus r to the n, all over 1 minus r. If r equals 1 every term is the same and the sum is n times the first term. For 3, 6, 12 with 10 terms it is 3069.',
        'Untuk rasio r yang tidak sama dengan 1, jumlah n suku pertama adalah suku pertama kali 1 dikurangi r pangkat n, seluruhnya dibagi 1 dikurangi r. Jika r sama dengan 1 setiap suku sama dan jumlahnya n kali suku pertama. Untuk 3, 6, 12 dengan 10 suku jumlahnya 3069.',
      ),
    },
    {
      q: L('How do you tell whether a sequence is geometric?', 'Bagaimana mengetahui apakah suatu barisan geometri?'),
      a: L(
        'Divide each term by the one before it, always later over earlier. If all the ratios are equal and no term is zero, the sequence is geometric and that value is the common ratio. If the differences are equal instead, it is arithmetic.',
        'Bagi tiap suku dengan suku sebelumnya, selalu yang kemudian per yang lebih dulu. Jika semua rasio sama dan tidak ada suku nol, barisannya geometri dan nilai itu adalah rasionya. Jika selisihnya yang sama, barisannya aritmetika.',
      ),
    },
    {
      q: L('What is the difference between arithmetic and geometric sequences?', 'Apa beda barisan aritmetika dan geometri?'),
      a: L(
        'An arithmetic sequence adds the same number each time, such as 2, 5, 8, 11, and grows along a straight line. A geometric sequence multiplies by the same number each time, such as 2, 4, 8, 16, and grows or decays exponentially, so it soon leaves any arithmetic sequence behind.',
        'Barisan aritmetika menambah bilangan yang sama setiap kali, seperti 2, 5, 8, 11, dan tumbuh sepanjang garis lurus. Barisan geometri mengalikan dengan bilangan yang sama setiap kali, seperti 2, 4, 8, 16, dan tumbuh atau meluruh secara eksponensial, sehingga segera meninggalkan barisan aritmetika mana pun.',
      ),
    },
    {
      q: L('When does an infinite geometric series have a sum?', 'Kapan deret geometri tak hingga punya jumlah?'),
      a: L(
        'Exactly when the common ratio is smaller than 1 in size, between minus 1 and 1. Then the sum is the first term divided by 1 minus the ratio. For a ratio of 1 or more in size the partial sums do not settle and the series diverges.',
        'Tepat bila rasionya berukuran kurang dari 1, antara minus 1 dan 1. Maka jumlahnya adalah suku pertama dibagi 1 dikurangi rasio. Untuk rasio berukuran 1 atau lebih jumlah parsialnya tidak menetap dan deretnya divergen.',
      ),
    },
    {
      q: L('How do you find the sum to infinity?', 'Bagaimana mencari jumlah tak hingga?'),
      a: L(
        'First check that the ratio is between minus 1 and 1. Then divide the first term by 1 minus the ratio. For 6, 4, 8 over 3 and so on the ratio is 2 over 3, so the sum is 6 divided by one third, which is 18.',
        'Pertama periksa bahwa rasionya antara minus 1 dan 1. Lalu bagi suku pertama dengan 1 dikurangi rasio. Untuk 6, 4, 8 per 3 dan seterusnya rasionya 2 per 3, sehingga jumlahnya 6 dibagi sepertiga, yaitu 18.',
      ),
    },
    {
      q: L('How do you write a repeating decimal as a fraction?', 'Bagaimana menulis desimal berulang sebagai pecahan?'),
      a: L(
        'Treat it as a geometric series. The first repeating block over a power of ten is the first term, and one over ten to the block length is the ratio. For 0.272727 that is 27 over 100 divided by 99 over 100, which is 3 over 11.',
        'Perlakukan sebagai deret geometri. Blok berulang pertama di atas pangkat sepuluh adalah suku pertama, dan satu per sepuluh pangkat panjang blok adalah rasio. Untuk 0,272727 itu 27 per 100 dibagi 99 per 100, yaitu 3 per 11.',
      ),
    },
    {
      q: L('Why does 0.999 repeating equal 1?', 'Mengapa 0,999 berulang sama dengan 1?'),
      a: L(
        'It is a geometric series with first term 9 over 10 and ratio 1 over 10. The sum is 9 over 10 divided by 9 over 10, which is exactly 1. The decimal is another name for 1, not a number that is slightly smaller.',
        'Itu deret geometri dengan suku pertama 9 per 10 dan rasio 1 per 10. Jumlahnya 9 per 10 dibagi 9 per 10, yaitu tepat 1. Desimal itu hanyalah nama lain untuk 1, bukan bilangan yang sedikit lebih kecil.',
      ),
    },
    {
      q: L('How do you find the ratio from two terms?', 'Bagaimana mencari rasio dari dua suku?'),
      a: L(
        'Divide the later term by the earlier one, then take the root whose index is the number of steps between them. With the second term 6 and the fifth term 48, the quotient is 8 and its cube root is 2. An even number of steps allows a positive and a negative ratio.',
        'Bagi suku yang kemudian dengan yang lebih dulu, lalu tarik akar yang indeksnya banyak langkah di antara keduanya. Dengan suku kedua 6 dan suku kelima 48, hasil baginya 8 dan akar pangkat tiganya 2. Banyak langkah yang genap memungkinkan rasio positif dan negatif.',
      ),
    },
    {
      q: L('What is a geometric mean?', 'Apa itu rata-rata geometri?'),
      a: L(
        'The geometric mean of two positive numbers is the square root of their product, so for 2 and 8 it is 4, not the arithmetic mean 5. It is the middle term of a geometric sequence, and the right average for growth factors.',
        'Rata-rata geometri dua bilangan positif adalah akar dari hasil kalinya, sehingga untuk 2 dan 8 ia 4, bukan rata-rata aritmetika 5. Ia suku tengah barisan geometri, dan rata-rata yang tepat untuk faktor pertumbuhan.',
      ),
    },
    {
      q: L('How does compound interest relate to geometric sequences?', 'Apa kaitan bunga majemuk dengan barisan geometri?'),
      a: L(
        'With compound interest the balance is multiplied by 1 plus the interest rate each period, so the balances form a geometric sequence. After n periods a deposit P is worth P times 1.05 to the n at 5 percent. Simple interest, by contrast, is arithmetic.',
        'Dengan bunga majemuk saldo dikali 1 ditambah suku bunga tiap periode, sehingga saldo membentuk barisan geometri. Setelah n periode setoran P bernilai P kali 1,05 pangkat n pada bunga 5 persen. Bunga tunggal, sebaliknya, aritmetika.',
      ),
    },
    {
      q: L('What common ratio does a 20 percent decrease have?', 'Berapa rasio untuk penurunan 20 persen?'),
      a: L(
        'The ratio is 0.8, because a value that falls by 20 percent keeps 80 percent of itself. A rise of 20 percent has ratio 1.2. A common mistake is to use 0.2, which would be a fall of 80 percent each period.',
        'Rasionya 0,8, karena nilai yang turun 20 persen mempertahankan 80 persen dirinya. Kenaikan 20 persen berasio 1,2. Kesalahan umum adalah memakai 0,2, yang berarti penurunan 80 persen tiap periode.',
      ),
    },
    {
      q: L('How do you build a geometric sequence in Python?', 'Bagaimana membuat barisan geometri di Python?'),
      a: L(
        'Use a list comprehension with the power operator, a1 times r to the i for i in range n. Use the Fraction class for exact sums, because floats overflow or underflow quickly. Remember that the caret is XOR in Python, so write powers with a double asterisk.',
        'Pakai list comprehension dengan operator pangkat, a1 kali r pangkat i untuk i dalam range n. Pakai kelas Fraction untuk jumlah eksak, karena float cepat meluap atau menjadi nol. Ingat bahwa tanda sisipan adalah XOR di Python, jadi tulis pangkat dengan dua tanda bintang.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.), chapter 12 (sequences and series)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Elements, Book IX, proposition 35 (the sum of numbers in geometric progression)', author: 'Euclid', source: 'c. 300 BCE' },
    { title: 'Quadrature of the Parabola', author: 'Archimedes', source: 'c. 250 BCE' },
    { title: 'The Rhind Mathematical Papyrus', author: 'Arnold Buffum Chace', year: 1927, source: 'Mathematical Association of America' },
    { title: 'Quaestiones nonnullae de usuris, cum solutione problematis de sorte alearum', author: 'Jacob Bernoulli', year: 1690, source: 'Acta Eruditorum' },
    { title: 'Principles of Mathematical Analysis (3rd ed.), chapter 3 (series)', author: 'Walter Rudin', year: 1976, source: 'McGraw-Hill' },
    { title: 'Concrete Mathematics: A Foundation for Computer Science (2nd ed.), chapter 2 (sums)', author: 'Ronald Graham, Donald Knuth and Oren Patashnik', year: 1994, source: 'Addison-Wesley' },
    { title: 'The Python Standard Library: fractions, rational numbers', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/fractions.html' },
  ],

  related: ['arithmetic-sequences-and-series', 'exponents-and-radicals', 'rational-numbers', 'irrational-numbers'],
}
