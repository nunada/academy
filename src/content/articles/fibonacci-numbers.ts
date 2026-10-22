import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './fibonacci-numbers.meta'

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
    T`**The Fibonacci numbers are $0,1,1,2,3,5,8,13,21,\ldots$, each the sum of the two before it: $F_0=0$, $F_1=1$ and $F_n=F_{n-1}+F_{n-2}$.** They have the closed form $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$ with $\varphi=\frac{1+\sqrt5}{2}\approx1.618$ and $\psi=\frac{1-\sqrt5}{2}$, the ratio $\frac{F_{n+1}}{F_n}$ tends to $\varphi$, and $F_n$ can be computed with about $\log_2n$ big multiplications instead of $n$ additions. For example $F_{10}=55$, $F_{20}=6765$ and $F_{100}=354\,224\,848\,179\,261\,915\,075$.`,
    T`**Bilangan Fibonacci adalah $0,1,1,2,3,5,8,13,21,\ldots$, masing-masing jumlah dua bilangan sebelumnya: $F_0=0$, $F_1=1$, dan $F_n=F_{n-1}+F_{n-2}$.** Mereka memiliki bentuk tertutup $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$ dengan $\varphi=\frac{1+\sqrt5}{2}\approx1{,}618$ dan $\psi=\frac{1-\sqrt5}{2}$, perbandingan $\frac{F_{n+1}}{F_n}$ menuju $\varphi$, dan $F_n$ dapat dihitung dengan sekitar $\log_2n$ perkalian bilangan besar, bukan $n$ penjumlahan. Misalnya $F_{10}=55$, $F_{20}=6765$, dan $F_{100}=354\,224\,848\,179\,261\,915\,075$.`,
  ),

  keyPoints: [
    L(
      T`$F_0=0$, $F_1=1$, $F_n=F_{n-1}+F_{n-2}$ gives $0,1,1,2,3,5,8,13,21,34,55,89,144$. The same numbers count the ways to climb $n$ stairs with steps of $1$ or $2$ (that is $F_{n+1}$), the binary strings of length $n$ with no two $1$s in a row ($F_{n+2}$) and Fibonacci's rabbits.`,
      T`$F_0=0$, $F_1=1$, $F_n=F_{n-1}+F_{n-2}$ menghasilkan $0,1,1,2,3,5,8,13,21,34,55,89,144$. Bilangan yang sama menghitung cara menaiki $n$ anak tangga dengan langkah $1$ atau $2$ (yaitu $F_{n+1}$), untai biner panjang $n$ tanpa dua $1$ berurutan ($F_{n+2}$), dan kelinci Fibonacci.`,
    ),
    L(
      T`Binet's formula $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$ works because $\varphi$ and $\psi$ solve $x^2=x+1$. Since $|\psi^n/\sqrt5|<\frac12$, $F_n$ is the integer nearest to $\varphi^n/\sqrt5$, but in floating point this fails already at $n=71$. The ratio $\frac{F_{n+1}}{F_n}$ differs from $\varphi$ by $\frac{\psi^n}{F_n}\approx\frac{\pm1}{\sqrt5F_n^2}$.`,
      T`Rumus Binet $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$ berlaku karena $\varphi$ dan $\psi$ menyelesaikan $x^2=x+1$. Karena $|\psi^n/\sqrt5|<\frac12$, $F_n$ adalah bilangan bulat terdekat dengan $\varphi^n/\sqrt5$, tetapi dalam titik mengambang ini sudah gagal pada $n=71$. Perbandingan $\frac{F_{n+1}}{F_n}$ berbeda dari $\varphi$ sebesar $\frac{\psi^n}{F_n}\approx\frac{\pm1}{\sqrt5F_n^2}$.`,
    ),
    L(
      T`Identities with short proofs: $F_1+\cdots+F_n=F_{n+2}-1$, $F_1^2+\cdots+F_n^2=F_nF_{n+1}$, Cassini's $F_{n-1}F_{n+1}-F_n^2=(-1)^n$, the doubling formulas $F_{2n}=F_n(2F_{n+1}-F_n)$ and $F_{2n+1}=F_n^2+F_{n+1}^2$, and $\gcd(F_m,F_n)=F_{\gcd(m,n)}$.`,
      T`Identitas dengan bukti singkat: $F_1+\cdots+F_n=F_{n+2}-1$, $F_1^2+\cdots+F_n^2=F_nF_{n+1}$, identitas Cassini $F_{n-1}F_{n+1}-F_n^2=(-1)^n$, rumus penggandaan $F_{2n}=F_n(2F_{n+1}-F_n)$ dan $F_{2n+1}=F_n^2+F_{n+1}^2$, serta $\gcd(F_m,F_n)=F_{\gcd(m,n)}$.`,
    ),
    L(
      T`The plain recursion makes $2F_{n+1}-1\approx\varphi^n$ calls (about $4\times10^{10}$ for $n=50$); a memo or a loop needs about $n$ steps; fast doubling needs $3\lceil\log_2n\rceil$ big multiplications. $F_n$ has about $0.209\,n$ digits, so $F_{1000}$ has $209$ and $F_{10^6}$ has $208\,988$.`,
      T`Rekursi biasa membuat $2F_{n+1}-1\approx\varphi^n$ panggilan (sekitar $4\times10^{10}$ untuk $n=50$); memo atau perulangan memerlukan sekitar $n$ langkah; penggandaan cepat memerlukan $3\lceil\log_2n\rceil$ perkalian bilangan besar. $F_n$ memiliki sekitar $0{,}209\,n$ angka, sehingga $F_{1000}$ memiliki $209$ dan $F_{10^6}$ memiliki $208\,988$.`,
    ),
    L(
      T`Zeckendorf's theorem: every positive integer is, in exactly one way, a sum of Fibonacci numbers $1,2,3,5,8,\ldots$ no two of which are neighbors; the greedy method finds it. Modulo $m$ the sequence repeats with the Pisano period $\pi(m)$: $\pi(10)=60$, so the last digit of $F_n$ repeats every $60$ numbers.`,
      T`Teorema Zeckendorf: setiap bilangan bulat positif tepat dengan satu cara adalah jumlah bilangan Fibonacci $1,2,3,5,8,\ldots$ yang tidak ada dua yang bertetangga; metode rakus menemukannya. Modulo $m$ barisan itu berulang dengan periode Pisano $\pi(m)$: $\pi(10)=60$, sehingga angka terakhir $F_n$ berulang setiap $60$ bilangan.`,
    ),
    L(
      T`The golden ratio explains the spirals of seeds in many sunflowers and cones (the golden angle $360^\circ/\varphi^2\approx137.5^\circ$) and the worst case of Euclid's algorithm, which is consecutive Fibonacci numbers. Many other claims, about pyramids, the Parthenon or paintings, are myths.`,
      T`Rasio emas menjelaskan spiral biji pada banyak bunga matahari dan kerucut (sudut emas $360^\circ/\varphi^2\approx137{,}5^\circ$) dan kasus terburuk algoritma Euclid, yaitu bilangan Fibonacci berurutan. Banyak klaim lain, tentang piramida, Parthenon, atau lukisan, adalah mitos.`,
    ),
  ],

  sections: [
    /* --------------------------------------------------------------------------------------- what */
    {
      id: 'what-is-fibonacci',
      heading: L('What are the Fibonacci numbers?', 'Apa itu bilangan Fibonacci?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Fibonacci numbers are the sequence in which every number from the third on is the sum of the two before it, starting from $0$ and $1$.** In symbols
$$F_0=0,\qquad F_1=1,\qquad F_n=F_{n-1}+F_{n-2}\quad(n\ge2).$$
The first terms are

| $n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $F_n$ | 0 | 1 | 1 | 2 | 3 | 5 | 8 |

| $n$ | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|
| $F_n$ | 13 | 21 | 34 | 55 | 89 | 144 | 233 |

and $F_{20}=6765$, $F_{30}=832\,040$, $F_{50}=12\,586\,269\,025$. Some books start at $F_1=F_2=1$ and skip $F_0$; the numbers are the same, so check which convention a source uses.

A rule that defines each term from earlier ones is a *recurrence*, and this one is *linear* (the terms are only added, never multiplied together) and of *order two* (it looks back two places), which is why two starting values are needed. Running it backward gives $F_{-1}=1$, $F_{-2}=-1$, $F_{-3}=2$, and so on, with signs that alternate.

**Where the name comes from.** Leonardo of Pisa, called Fibonacci, put the sequence in his book *Liber Abaci* (1202) in a problem about rabbits: a pair has a new pair every month, and a new pair starts to have babies in its second month. Starting with one pair, how many pairs are there after a year? After $1,2,3,5,8,\ldots$ the answer is $377$ pairs, which is $F_{14}$. In general there are $F_{n+2}$ pairs after $n$ months. The sequence is far older, though: Indian scholars studying the rhythms of poetry described it centuries earlier (see the history below).

Move the slider below to read the exact value of $F_n$ for $n$ up to $120$, together with the ratio of neighbors and a first test of a famous formula.`,
            T`**Bilangan Fibonacci adalah barisan yang setiap bilangan dari yang ketiga adalah jumlah dua bilangan sebelumnya, dimulai dari $0$ dan $1$.** Dalam lambang
$$F_0=0,\qquad F_1=1,\qquad F_n=F_{n-1}+F_{n-2}\quad(n\ge2).$$
Suku-suku pertamanya

| $n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $F_n$ | 0 | 1 | 1 | 2 | 3 | 5 | 8 |

| $n$ | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|
| $F_n$ | 13 | 21 | 34 | 55 | 89 | 144 | 233 |

dan $F_{20}=6765$, $F_{30}=832\,040$, $F_{50}=12\,586\,269\,025$. Sebagian buku mulai dari $F_1=F_2=1$ dan melewatkan $F_0$; bilangannya sama, jadi periksa konvensi yang dipakai sebuah sumber.

Aturan yang mendefinisikan tiap suku dari suku sebelumnya adalah *rekurensi*, dan yang ini *linear* (suku-sukunya hanya dijumlahkan, tidak pernah dikalikan satu sama lain) dan *berorde dua* (melihat dua tempat ke belakang), itulah sebabnya diperlukan dua nilai awal. Menjalankannya mundur memberi $F_{-1}=1$, $F_{-2}=-1$, $F_{-3}=2$, dan seterusnya, dengan tanda yang bergantian.

**Dari mana namanya.** Leonardo dari Pisa, yang disebut Fibonacci, memasukkan barisan ini dalam bukunya *Liber Abaci* (1202) dalam soal tentang kelinci: sepasang kelinci memiliki sepasang anak setiap bulan, dan sepasang anak mulai beranak pada bulan keduanya. Dimulai dari sepasang, berapa pasang yang ada setelah setahun? Setelah $1,2,3,5,8,\ldots$ jawabannya $377$ pasang, yaitu $F_{14}$. Secara umum ada $F_{n+2}$ pasang setelah $n$ bulan. Barisan ini jauh lebih tua, namun: para sarjana India yang mempelajari irama puisi menguraikannya berabad-abad sebelumnya (lihat sejarah di bawah).

Geser penggeser di bawah untuk membaca nilai eksak $F_n$ sampai $n=120$, bersama perbandingan tetangga dan uji pertama sebuah rumus terkenal.`,
          ),
        },
        { kind: 'widget', name: 'fibexplore' },
      ],
    },

    /* ------------------------------------------------------------------------------------ counting */
    {
      id: 'counting',
      heading: L('What do the Fibonacci numbers count?', 'Apa yang dihitung oleh bilangan Fibonacci?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Whenever a counting problem can be split by "what is the last piece?" into two smaller copies of itself, the answer is a Fibonacci number.** Take the stairs. Let $s_n$ be the number of ways to climb $n$ stairs taking one or two at a time. The last step was either a $1$ (leaving $n-1$ stairs to climb before it, $s_{n-1}$ ways) or a $2$ (leaving $n-2$, $s_{n-2}$ ways), so $s_n=s_{n-1}+s_{n-2}$ with $s_1=1$ and $s_2=2$. That is the Fibonacci recurrence shifted by one place:
$$s_n=F_{n+1},\qquad s_{10}=F_{11}=89.$$

The same argument counts many things:
- **Tilings.** The number of ways to cover a strip of length $n$ with squares of length $1$ and dominoes of length $2$ is $F_{n+1}$. Pingala's counts of rhythms made of short and long syllables are the same problem.
- **Strings.** The binary strings of length $n$ with no two $1$s in a row number $F_{n+2}$: for $n=3$ they are $000,001,010,100,101$, five of them, $F_5$. The same number counts the subsets of $\{1,\dots,n\}$ with no two consecutive numbers.
- **Rabbits.** $F_{n+2}$ pairs after $n$ months, as above.
- **Pascal's triangle.** The sums along the shallow diagonals are Fibonacci numbers: $C(5,0)+C(4,1)+C(3,2)=1+4+3=8=F_6$, where $C(n,k)$ are the binomial coefficients, and in general $F_{n+1}=\sum_kC(n-k,k)$.

**Compositions.** Writing $n$ as an ordered sum of $1$s and $2$s is the stairs problem again: $4=1+1+1+1$, $4=1+1+2$, $4=1+2+1$, $4=2+1+1$ and $4=2+2$: five ways, $F_5$. This is why the Fibonacci numbers appear in so many counting exercises, and why the dynamic programming example "climbing stairs" is a Fibonacci computation in disguise (see the section on computing below).`,
            T`**Setiap kali soal menghitung dapat dibagi dengan "apa bagian terakhirnya?" menjadi dua salinan yang lebih kecil, jawabannya adalah bilangan Fibonacci.** Ambil tangga. Misalkan $s_n$ adalah banyaknya cara menaiki $n$ anak tangga dengan satu atau dua sekali langkah. Langkah terakhir adalah $1$ (menyisakan $n-1$ anak tangga yang didaki sebelumnya, $s_{n-1}$ cara) atau $2$ (menyisakan $n-2$, $s_{n-2}$ cara), sehingga $s_n=s_{n-1}+s_{n-2}$ dengan $s_1=1$ dan $s_2=2$. Itu rekurensi Fibonacci yang bergeser satu tempat:
$$s_n=F_{n+1},\qquad s_{10}=F_{11}=89.$$

Argumen yang sama menghitung banyak hal:
- **Pengubinan.** Banyaknya cara menutup pita sepanjang $n$ dengan persegi panjang $1$ dan domino panjang $2$ adalah $F_{n+1}$. Hitungan Pingala tentang irama dari suku kata pendek dan panjang adalah soal yang sama.
- **Untai.** Untai biner panjang $n$ tanpa dua $1$ berurutan berjumlah $F_{n+2}$: untuk $n=3$ mereka $000,001,010,100,101$, lima, $F_5$. Bilangan yang sama menghitung himpunan bagian $\{1,\dots,n\}$ tanpa dua bilangan berurutan.
- **Kelinci.** $F_{n+2}$ pasang setelah $n$ bulan, seperti di atas.
- **Segitiga Pascal.** Jumlah sepanjang diagonal landai adalah bilangan Fibonacci: $C(5,0)+C(4,1)+C(3,2)=1+4+3=8=F_6$, dengan $C(n,k)$ koefisien binomial, dan secara umum $F_{n+1}=\sum_kC(n-k,k)$.

**Komposisi.** Menuliskan $n$ sebagai jumlah terurut dari $1$ dan $2$ adalah soal tangga lagi: $4=1+1+1+1$, $4=1+1+2$, $4=1+2+1$, $4=2+1+1$, dan $4=2+2$: lima cara, $F_5$. Itulah sebabnya bilangan Fibonacci muncul dalam begitu banyak latihan menghitung, dan sebabnya contoh pemrograman dinamis "menaiki tangga" adalah perhitungan Fibonacci yang menyamar (lihat bagian tentang menghitung di bawah).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- closed form */
    {
      id: 'closed-form',
      heading: L('Is there a formula for the nth Fibonacci number?', 'Adakah rumus untuk bilangan Fibonacci ke-n?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Yes: Binet's formula $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$, where $\varphi=\frac{1+\sqrt5}{2}$ and $\psi=\frac{1-\sqrt5}{2}$ are the two roots of $x^2=x+1$.** Here is why. Look for solutions of the recurrence of the form $F_n=r^n$. Then $r^n=r^{n-1}+r^{n-2}$, and dividing by $r^{n-2}$ gives
$$r^2=r+1,\qquad r=\frac{1\pm\sqrt5}{2}.$$
So $\varphi^n$ and $\psi^n$ both satisfy the recurrence, and so does every combination $A\varphi^n+B\psi^n$ (the recurrence is linear). Choose $A$ and $B$ to match the starting values: $F_0=0$ gives $A+B=0$, and $F_1=1$ gives $A\varphi+B\psi=1$. Since $\varphi-\psi=\sqrt5$, the solution is $A=\frac{1}{\sqrt5}=-B$, which is Binet's formula (known earlier to Euler and de Moivre; Jacques Binet published it in 1843).

**What the two numbers are.** $\varphi=1.6180339887\ldots$ is the golden ratio, and $\psi=1-\varphi=-\frac1\varphi=-0.6180339887\ldots$ has absolute value below $1$, so $\psi^n$ shrinks quickly and alternates in sign. For $n\ge0$ we have $\left|\frac{\psi^n}{\sqrt5}\right|\le\frac1{\sqrt5}<\frac12$, so **$F_n$ is the integer nearest to $\frac{\varphi^n}{\sqrt5}$**: for $n=10$, $\frac{\varphi^{10}}{\sqrt5}=55.0036\ldots$, which rounds to $F_{10}=55$.

**The ratio of neighbors.** From the formula, $F_{n+1}-\varphi F_n=\psi^n$ exactly, so
$$\frac{F_{n+1}}{F_n}-\varphi=\frac{\psi^n}{F_n}\approx\frac{(-1)^n}{\sqrt5\,F_n^2}.$$
The ratio therefore alternates around $\varphi$ ($1,2,1.5,1.667,1.6,1.625,1.615,\ldots$) and gets there quickly: it gains about $2\log_{10}\varphi\approx0.42$ decimal places per step, so $\frac{F_{31}}{F_{30}}$ already agrees with $\varphi$ to ten decimals. Compare [the irrational numbers that are hardest to approximate by fractions](article:irrational-numbers#rational-approximations): the fractions $\frac{F_{n+1}}{F_n}$ are exactly the best ones for $\varphi$, and they are the slowest-converging continued fraction there is.

**A warning for programmers.** Computing ´round(phi ** n / sqrt(5))´ with ordinary floating-point numbers is correct for $n\le70$ and wrong from $n=71$ ($308\,061\,521\,170\,130$ instead of $308\,061\,521\,170\,129$): a double has only about $16$ digits (see [the spacing of floats](article:floating-point-numbers#spacing)), and $\varphi^{71}$ must be known to better than one part in $10^{15}$. For exact values use integers.`,
            T`**Ya: rumus Binet $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$, dengan $\varphi=\frac{1+\sqrt5}{2}$ dan $\psi=\frac{1-\sqrt5}{2}$ kedua akar $x^2=x+1$.** Inilah alasannya. Cari penyelesaian rekurensi berbentuk $F_n=r^n$. Maka $r^n=r^{n-1}+r^{n-2}$, dan membagi dengan $r^{n-2}$ memberi
$$r^2=r+1,\qquad r=\frac{1\pm\sqrt5}{2}.$$
Jadi $\varphi^n$ dan $\psi^n$ keduanya memenuhi rekurensi, demikian pula setiap kombinasi $A\varphi^n+B\psi^n$ (rekurensinya linear). Pilih $A$ dan $B$ agar cocok dengan nilai awal: $F_0=0$ memberi $A+B=0$, dan $F_1=1$ memberi $A\varphi+B\psi=1$. Karena $\varphi-\psi=\sqrt5$, solusinya $A=\frac{1}{\sqrt5}=-B$, yaitu rumus Binet (sudah dikenal Euler dan de Moivre; Jacques Binet menerbitkannya pada 1843).

**Siapa kedua bilangan itu.** $\varphi=1{,}6180339887\ldots$ adalah rasio emas, dan $\psi=1-\varphi=-\frac1\varphi=-0{,}6180339887\ldots$ memiliki nilai mutlak di bawah $1$, sehingga $\psi^n$ menyusut cepat dan tandanya bergantian. Untuk $n\ge0$ berlaku $\left|\frac{\psi^n}{\sqrt5}\right|\le\frac1{\sqrt5}<\frac12$, sehingga **$F_n$ adalah bilangan bulat terdekat dengan $\frac{\varphi^n}{\sqrt5}$**: untuk $n=10$, $\frac{\varphi^{10}}{\sqrt5}=55{,}0036\ldots$, yang dibulatkan menjadi $F_{10}=55$.

**Perbandingan tetangga.** Dari rumus itu, $F_{n+1}-\varphi F_n=\psi^n$ secara eksak, sehingga
$$\frac{F_{n+1}}{F_n}-\varphi=\frac{\psi^n}{F_n}\approx\frac{(-1)^n}{\sqrt5\,F_n^2}.$$
Perbandingan itu karenanya bergantian di sekitar $\varphi$ ($1,2,1{,}5,1{,}667,1{,}6,1{,}625,1{,}615,\ldots$) dan sampai ke sana dengan cepat: ia memperoleh sekitar $2\log_{10}\varphi\approx0{,}42$ tempat desimal per langkah, sehingga $\frac{F_{31}}{F_{30}}$ sudah sesuai dengan $\varphi$ sampai sepuluh desimal. Bandingkan dengan [bilangan irasional yang paling sulit dihampiri pecahan](article:irrational-numbers#rational-approximations): pecahan $\frac{F_{n+1}}{F_n}$ persis yang terbaik untuk $\varphi$, dan merupakan pecahan berantai yang paling lambat konvergen.

**Peringatan bagi pemrogram.** Menghitung ´round(phi ** n / sqrt(5))´ dengan bilangan titik mengambang biasa benar untuk $n\le70$ dan salah mulai $n=71$ ($308\,061\,521\,170\,130$ bukan $308\,061\,521\,170\,129$): sebuah double hanya memiliki sekitar $16$ angka (lihat [jarak antarbilangan titik mengambang](article:floating-point-numbers#spacing)), dan $\varphi^{71}$ harus diketahui lebih baik daripada satu bagian dalam $10^{15}$. Untuk nilai eksak pakai bilangan bulat.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- identities */
    {
      id: 'identities',
      heading: L('Which identities do the Fibonacci numbers satisfy?', 'Identitas apa yang dipenuhi bilangan Fibonacci?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Fibonacci numbers satisfy dozens of identities, and a few short proofs explain most of them.**

**Sums.** Since $F_k=F_{k+2}-F_{k+1}$, adding for $k=1$ to $n$ telescopes:
$$F_1+F_2+\cdots+F_n=F_{n+2}-F_2=F_{n+2}-1.$$
For $n=10$ the ten terms $1,1,2,3,5,8,13,21,34,55$ add up to $143$, and $F_{12}-1=143$ too. In the same way $F_1+F_3+\cdots+F_{2n-1}=F_{2n}$ and $F_2+F_4+\cdots+F_{2n}=F_{2n+1}-1$. For squares, a picture of rectangles of sides $F_k\times F_k$ stacked into a $F_n\times F_{n+1}$ rectangle proves
$$F_1^2+F_2^2+\cdots+F_n^2=F_nF_{n+1},\qquad1+1+4+9+25=40=5\cdot8.$$

**The matrix proof.** Put $Q=\begin{pmatrix}1&1\\1&0\end{pmatrix}$. Then $Q\begin{pmatrix}F_{n}\\F_{n-1}\end{pmatrix}=\begin{pmatrix}F_{n+1}\\F_{n}\end{pmatrix}$, so by induction
$$Q^n=\begin{pmatrix}F_{n+1}&F_n\\F_n&F_{n-1}\end{pmatrix}.$$
Two facts follow at once. Taking determinants, $\det Q=-1$ gives **Cassini's identity**
$$F_{n-1}F_{n+1}-F_n^2=(-1)^n.$$
And $Q^{2n}=(Q^n)^2$ compares entries to give the **doubling formulas**
$$F_{2n}=F_n\,(2F_{n+1}-F_n),\qquad F_{2n+1}=F_n^2+F_{n+1}^2.$$
For example $F_{20}=F_{10}(2F_{11}-F_{10})=55\cdot123=6765$.

**The missing square.** Cassini with $n=6$ says $F_5F_7-F_6^2=5\cdot13-8^2=1$. That is the old puzzle of cutting an $8\times8$ square (area $64$) into four pieces and rearranging them into a $5\times13$ rectangle (area $65$): the pieces cannot fill the rectangle exactly, and along the long diagonal there is a thin sliver gap of area $1$ that the eye does not see, because consecutive Fibonacci numbers have a ratio so close to $\varphi$.

**Divisibility.** Consecutive Fibonacci numbers are coprime: a common divisor of $F_{n+1}$ and $F_n$ divides $F_{n+1}F_{n-1}-F_n^2=\pm1$. More generally
$$\gcd(F_m,F_n)=F_{\gcd(m,n)}.$$
So $F_m$ divides $F_n$ whenever $m$ divides $n$ (for example $F_6=8$ divides $F_{12}=144$), every third Fibonacci number is even, every fourth is a multiple of $3$ and every fifth a multiple of $5$. The proof uses $F_{m+n}=F_{m+1}F_n+F_mF_{n-1}$, which turns $\gcd(F_m,F_n)$ into $\gcd(F_{m-n},F_n)$: the Euclidean algorithm runs on the subscripts.

Pick $n$ below. Each identity has its left side built the long way and its right side from the short formula, with exact numbers, and the last line checks the gcd rule.`,
            T`**Bilangan Fibonacci memenuhi lusinan identitas, dan beberapa bukti singkat menjelaskan sebagian besarnya.**

**Jumlah.** Karena $F_k=F_{k+2}-F_{k+1}$, menjumlahkan untuk $k=1$ sampai $n$ meniadakan suku-suku:
$$F_1+F_2+\cdots+F_n=F_{n+2}-F_2=F_{n+2}-1.$$
Untuk $n=10$ kesepuluh suku $1,1,2,3,5,8,13,21,34,55$ berjumlah $143$, dan $F_{12}-1=143$ juga. Dengan cara yang sama $F_1+F_3+\cdots+F_{2n-1}=F_{2n}$ dan $F_2+F_4+\cdots+F_{2n}=F_{2n+1}-1$. Untuk kuadrat, gambar persegi bersisi $F_k\times F_k$ yang ditumpuk menjadi persegi panjang $F_n\times F_{n+1}$ membuktikan
$$F_1^2+F_2^2+\cdots+F_n^2=F_nF_{n+1},\qquad1+1+4+9+25=40=5\cdot8.$$

**Bukti matriks.** Misalkan $Q=\begin{pmatrix}1&1\\1&0\end{pmatrix}$. Maka $Q\begin{pmatrix}F_{n}\\F_{n-1}\end{pmatrix}=\begin{pmatrix}F_{n+1}\\F_{n}\end{pmatrix}$, sehingga dengan induksi
$$Q^n=\begin{pmatrix}F_{n+1}&F_n\\F_n&F_{n-1}\end{pmatrix}.$$
Dua fakta langsung mengikuti. Dengan determinan, $\det Q=-1$ memberi **identitas Cassini**
$$F_{n-1}F_{n+1}-F_n^2=(-1)^n.$$
Dan $Q^{2n}=(Q^n)^2$ membandingkan entri-entrinya untuk memberi **rumus penggandaan**
$$F_{2n}=F_n\,(2F_{n+1}-F_n),\qquad F_{2n+1}=F_n^2+F_{n+1}^2.$$
Misalnya $F_{20}=F_{10}(2F_{11}-F_{10})=55\cdot123=6765$.

**Persegi yang hilang.** Cassini dengan $n=6$ berkata $F_5F_7-F_6^2=5\cdot13-8^2=1$. Itulah teka-teki lama tentang memotong persegi $8\times8$ (luas $64$) menjadi empat bagian dan menyusunnya menjadi persegi panjang $5\times13$ (luas $65$): bagian-bagian itu tidak dapat mengisi persegi panjang secara tepat, dan di sepanjang diagonal panjang ada celah tipis seluas $1$ yang tidak terlihat mata, karena bilangan Fibonacci berurutan memiliki perbandingan yang begitu dekat dengan $\varphi$.

**Keterbagian.** Bilangan Fibonacci berurutan saling prima: pembagi persekutuan $F_{n+1}$ dan $F_n$ membagi $F_{n+1}F_{n-1}-F_n^2=\pm1$. Lebih umum
$$\gcd(F_m,F_n)=F_{\gcd(m,n)}.$$
Jadi $F_m$ membagi $F_n$ bila $m$ membagi $n$ (misalnya $F_6=8$ membagi $F_{12}=144$), setiap bilangan Fibonacci ketiga genap, setiap yang keempat kelipatan $3$, dan setiap yang kelima kelipatan $5$. Buktinya memakai $F_{m+n}=F_{m+1}F_n+F_mF_{n-1}$, yang mengubah $\gcd(F_m,F_n)$ menjadi $\gcd(F_{m-n},F_n)$: algoritma Euclid berjalan pada subskripnya.

Pilih $n$ di bawah. Setiap identitas memiliki ruas kiri yang disusun dengan cara panjang dan ruas kanan dari rumus ringkas, dengan bilangan eksak, dan baris terakhir memeriksa aturan gcd.`,
          ),
        },
        { kind: 'widget', name: 'fibidentity' },
      ],
    },

    /* ------------------------------------------------------------------------------------ computing */
    {
      id: 'computing',
      heading: L('How do you compute Fibonacci numbers fast?', 'Bagaimana menghitung bilangan Fibonacci dengan cepat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The recurrence invites a recursive function, and that is the slowest way to compute a Fibonacci number; a loop is fast enough for most purposes, and fast doubling is the way to reach very large $n$.**

**Plain recursion.** ´fib(n) = fib(n-1) + fib(n-2)´ recomputes the same values over and over. The number of calls $C_n$ satisfies $C_n=C_{n-1}+C_{n-2}+1$ with $C_0=C_1=1$, which solves to
$$C_n=2F_{n+1}-1\approx\frac{2\varphi^{n+1}}{\sqrt5}.$$
That is $21\,891$ calls for $n=20$, $331\,160\,281$ for $n=40$, $40\,730\,022\,147$ for $n=50$ (about $41$ seconds at a billion calls a second) and about $1.1\times10^{21}$ for $n=100$ (some $36\,000$ years). The cost grows like $\varphi^n$, an exponential, which is the example used in [the section on recurrences in the Big-O article](article:big-o-notation#recurrences).

**Memoization and the loop.** Remember each value once computed and the calls drop to $2n-1$. Better, keep only the last two values in a loop: $n-1$ additions and no recursion (Python's default limit of $1000$ nested calls stops a recursive version near $n=1000$).

**Fast doubling.** The identities $F_{2k}=F_k(2F_{k+1}-F_k)$ and $F_{2k+1}=F_k^2+F_{k+1}^2$ get $(F_{2k},F_{2k+1})$ from $(F_k,F_{k+1})$, so reading the bits of $n$ from the top, one doubling step per bit gives $(F_n,F_{n+1})$ with $3\lceil\log_2n\rceil$ multiplications. This is exponentiation by squaring applied to the matrix $Q$ of the last section, with the redundant entries dropped. To get $F_{10^6}$ it takes $20$ steps instead of a million additions.

**The numbers get long.** $F_n$ has $\lfloor n\log_{10}\varphi-\log_{10}\sqrt5\rfloor+1$ digits, about $0.209\,n$: $F_{100}$ has $21$, $F_{1000}$ has $209$, $F_{10^5}$ has $20\,899$ and $F_{10^6}$ has $208\,988$. So an addition is not one step but about $0.2\,n$ digit operations, and the loop really costs about $n^2$ digit operations. Fast doubling also wins here, since it multiplies a few very long numbers. Note also that fixed-size integers overflow early: a 32-bit signed integer stops at $F_{46}=1\,836\,311\,903$ and a double stops being exact at $F_{78}$ (see [binary numbers](article:binary-numbers#binary-arithmetic)).

Slide $n$ below to compare the four methods and read the first and last digits of the exact answer.`,
            T`**Rekurensi mengundang fungsi rekursif, dan itulah cara paling lambat menghitung bilangan Fibonacci; perulangan cukup cepat untuk kebanyakan keperluan, dan penggandaan cepat adalah cara mencapai $n$ yang sangat besar.**

**Rekursi biasa.** ´fib(n) = fib(n-1) + fib(n-2)´ menghitung ulang nilai yang sama berulang-ulang. Banyaknya panggilan $C_n$ memenuhi $C_n=C_{n-1}+C_{n-2}+1$ dengan $C_0=C_1=1$, yang diselesaikan menjadi
$$C_n=2F_{n+1}-1\approx\frac{2\varphi^{n+1}}{\sqrt5}.$$
Itu $21\,891$ panggilan untuk $n=20$, $331\,160\,281$ untuk $n=40$, $40\,730\,022\,147$ untuk $n=50$ (sekitar $41$ detik pada satu miliar panggilan per detik) dan sekitar $1{,}1\times10^{21}$ untuk $n=100$ (sekitar $36\,000$ tahun). Biayanya tumbuh seperti $\varphi^n$, eksponensial, yaitu contoh yang dipakai dalam [bagian tentang rekurensi pada artikel Big-O](article:big-o-notation#recurrences).

**Memoisasi dan perulangan.** Ingat setiap nilai yang sudah dihitung dan panggilan turun menjadi $2n-1$. Lebih baik lagi, simpan hanya dua nilai terakhir dalam perulangan: $n-1$ penjumlahan tanpa rekursi (batas bawaan Python sebesar $1000$ panggilan bersarang menghentikan versi rekursif di sekitar $n=1000$).

**Penggandaan cepat.** Identitas $F_{2k}=F_k(2F_{k+1}-F_k)$ dan $F_{2k+1}=F_k^2+F_{k+1}^2$ mendapatkan $(F_{2k},F_{2k+1})$ dari $(F_k,F_{k+1})$, sehingga dengan membaca bit $n$ dari atas, satu langkah penggandaan per bit memberi $(F_n,F_{n+1})$ dengan $3\lceil\log_2n\rceil$ perkalian. Ini adalah perpangkatan dengan pengkuadratan yang diterapkan pada matriks $Q$ di bagian sebelumnya, dengan entri yang berlebih dibuang. Untuk mendapatkan $F_{10^6}$ diperlukan $20$ langkah, bukan sejuta penjumlahan.

**Bilangannya menjadi panjang.** $F_n$ memiliki $\lfloor n\log_{10}\varphi-\log_{10}\sqrt5\rfloor+1$ angka, sekitar $0{,}209\,n$: $F_{100}$ memiliki $21$, $F_{1000}$ memiliki $209$, $F_{10^5}$ memiliki $20\,899$ dan $F_{10^6}$ memiliki $208\,988$. Jadi satu penjumlahan bukan satu langkah melainkan sekitar $0{,}2\,n$ operasi angka, dan perulangan sebenarnya berbiaya sekitar $n^2$ operasi angka. Penggandaan cepat juga menang di sini, karena ia mengalikan beberapa bilangan yang sangat panjang. Perhatikan pula bahwa bilangan bulat berukuran tetap meluap lebih awal: bilangan bulat bertanda 32-bit berhenti di $F_{46}=1\,836\,311\,903$ dan sebuah double berhenti eksak di $F_{78}$ (lihat [bilangan biner](article:binary-numbers#binary-arithmetic)).

Geser $n$ di bawah untuk membandingkan keempat cara dan membaca angka pertama dan terakhir dari jawaban eksak.`,
          ),
        },
        { kind: 'widget', name: 'fibcompute' },
      ],
    },

    /* ---------------------------------------------------------------------------------- zeckendorf */
    {
      id: 'zeckendorf',
      heading: L('How do you write a number as a sum of Fibonacci numbers?', 'Bagaimana menuliskan bilangan sebagai jumlah bilangan Fibonacci?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Zeckendorf's theorem says that every positive integer is a sum of Fibonacci numbers from $1,2,3,5,8,13,\ldots$ in exactly one way if no two of them may be neighbors in that list.** For example
$$100=89+8+3=F_{11}+F_6+F_4,\qquad 12=8+3+1,\qquad 4=3+1.$$
(The list starts at $F_2=1$, because $F_1$ is the same number.) Dropping the rule of no neighbors, the same number usually has several sums: $100$ can be written in $9$ ways with different Fibonacci numbers, such as $89+8+3$ and $55+34+8+3$, and only one of them has no neighbors.

**The greedy method finds it.** Take the largest Fibonacci number not above $N$, subtract it, and repeat on the rest. The rest is smaller than the previous Fibonacci number (otherwise a larger one would have fitted), so the next term is never the neighbor of the one just taken.

**Why it is unique.** The telescoping sums of the identities section show that the largest sum of non-neighboring Fibonacci numbers below $F_k$ is $F_{k-1}+F_{k-3}+F_{k-5}+\cdots=F_k-1$ (for $k=7$: $8+3+1=12=13-1$). So a no-neighbors sum for $N$ cannot leave out the largest Fibonacci number $F_k\le N$: without it the sum would be at most $F_k-1<N$. The largest term is forced, and the argument repeats on the rest.

**Fibonacci digits.** Write a $1$ for each Fibonacci number used and a $0$ for each skipped, from the largest down to $F_2$: $100$ becomes $1000010100$ (positions $F_{11}$ to $F_2$), and no two $1$s are ever next to each other. It is a number system with Fibonacci numbers as place values, just as binary has powers of two. Because $11$ never occurs inside a code word, writing an extra $1$ after the last digit marks the end of the word: the **Fibonacci code** that can store a sequence of numbers without separators, a code that survives a damaged bit better than many others. Ordinary binary uses about $\log_2N$ digits and the Fibonacci system about $\log_\varphi N$, about forty-four percent more.

Type a number below to see its Zeckendorf sum, the string of Fibonacci digits next to the binary form and the count of other sums; the table under it lists $1$ to $20$.`,
            T`**Teorema Zeckendorf berkata bahwa setiap bilangan bulat positif adalah jumlah bilangan Fibonacci dari $1,2,3,5,8,13,\ldots$ dengan tepat satu cara bila tidak ada dua di antaranya yang boleh bertetangga dalam daftar itu.** Misalnya
$$100=89+8+3=F_{11}+F_6+F_4,\qquad 12=8+3+1,\qquad 4=3+1.$$
(Daftar dimulai dari $F_2=1$, karena $F_1$ adalah bilangan yang sama.) Bila aturan tanpa tetangga dibuang, bilangan yang sama biasanya memiliki beberapa jumlah: $100$ dapat ditulis dalam $9$ cara dengan bilangan Fibonacci berbeda, seperti $89+8+3$ dan $55+34+8+3$, dan hanya satu yang tanpa tetangga.

**Metode rakus menemukannya.** Ambil bilangan Fibonacci terbesar yang tidak melebihi $N$, kurangkan, dan ulangi pada sisanya. Sisanya lebih kecil daripada bilangan Fibonacci sebelumnya (jika tidak, yang lebih besar akan muat), sehingga suku berikutnya tidak pernah bertetangga dengan yang baru diambil.

**Mengapa tunggal.** Jumlah teleskopik pada bagian identitas menunjukkan bahwa jumlah terbesar bilangan Fibonacci tak bertetangga di bawah $F_k$ adalah $F_{k-1}+F_{k-3}+F_{k-5}+\cdots=F_k-1$ (untuk $k=7$: $8+3+1=12=13-1$). Jadi jumlah tanpa tetangga untuk $N$ tidak dapat melewatkan bilangan Fibonacci terbesar $F_k\le N$: tanpanya jumlahnya paling banyak $F_k-1<N$. Suku terbesarnya dipaksa, dan argumennya berulang pada sisanya.

**Angka Fibonacci.** Tulis $1$ untuk setiap bilangan Fibonacci yang dipakai dan $0$ untuk yang dilewati, dari yang terbesar turun ke $F_2$: $100$ menjadi $1000010100$ (posisi $F_{11}$ sampai $F_2$), dan tidak pernah ada dua $1$ yang bersebelahan. Ia adalah sistem bilangan dengan bilangan Fibonacci sebagai nilai tempat, seperti biner memakai pangkat dua. Karena $11$ tidak pernah muncul di dalam sebuah kata sandi, menuliskan satu $1$ tambahan setelah angka terakhir menandai akhir kata: **kode Fibonacci** yang dapat menyimpan barisan bilangan tanpa pemisah, kode yang bertahan terhadap bit yang rusak lebih baik daripada banyak kode lain. Biner biasa memakai sekitar $\log_2N$ angka dan sistem Fibonacci sekitar $\log_\varphi N$, sekitar empat puluh empat persen lebih banyak.

Ketik sebuah bilangan di bawah untuk melihat jumlah Zeckendorf-nya, untaian angka Fibonacci di samping bentuk binernya dan banyaknya jumlah lain; tabel di bawahnya mendaftar $1$ sampai $20$.`,
          ),
        },
        { kind: 'widget', name: 'fibzeck' },
      ],
    },

    /* ----------------------------------------------------------------------------------- modular */
    {
      id: 'modular',
      heading: L('What is the Pisano period?', 'Apa itu periode Pisano?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The remainders of the Fibonacci numbers modulo $m$ repeat with a period called the Pisano period $\pi(m)$, which lets you find $F_n\bmod m$ for an enormous $n$ by reducing $n$ first.** Modulo $10$ the sequence is
$$0,1,1,2,3,5,8,3,1,4,5,9,4,3,7,0,7,7,4,1,5,6,1,7,8,5,3,8,1,9,0,9,9,8,7,5,2,7,9,6,5,1,6,7,3,0,3,3,6,9,5,4,9,3,2,5,7,2,9,1,\;0,1,1,\ldots$$
and it starts again after $60$ numbers: $\pi(10)=60$. So the last digit of $F_n$ is the last digit of $F_{n\bmod60}$.

**Why the sequence repeats.** Look at the *pairs* $(F_n\bmod m,\;F_{n+1}\bmod m)$. There are only $m^2$ possible pairs, so a pair must come back, and from then on everything repeats, since a pair determines the next. The step $(a,b)\to(b,a+b)$ can also be undone, $(b,c)\to(c-b,b)$, so the first pair to come back is the very first one, $(0,1)$: the sequence is *purely* periodic, with no lead-in. In fact $\pi(m)\le6m$.

Some values: $\pi(2)=3$, $\pi(3)=8$, $\pi(4)=6$, $\pi(5)=20$, $\pi(6)=24$, $\pi(7)=16$, $\pi(10)=60$, $\pi(100)=300$, $\pi(1000)=1500$, and $\pi(10^k)=15\cdot10^{k-1}$ for $k\ge3$. So the last two digits repeat every $300$ numbers and the last three every $1500$.

**A worked example.** What is the last digit of $F_{10^{18}}$? Since $10^{18}\bmod60=40$ and $F_{40}=102\,334\,155$, it is $5$. And with fast doubling and a remainder taken at each step, $F_{10^{18}}\bmod(10^9+7)=209\,783\,453$ comes out in about sixty steps; no sequence of a quintillion terms is ever written down. This is the standard contest and cryptography use of Fibonacci numbers: "give the answer modulo $10^9+7$".

Choose a modulus below, see the remainders and the period, and then find $F_n\bmod m$ for an $n$ of up to thirty digits.`,
            T`**Sisa bilangan Fibonacci modulo $m$ berulang dengan periode yang disebut periode Pisano $\pi(m)$, yang memungkinkan kamu mencari $F_n\bmod m$ untuk $n$ yang sangat besar dengan mereduksi $n$ lebih dulu.** Modulo $10$ barisannya
$$0,1,1,2,3,5,8,3,1,4,5,9,4,3,7,0,7,7,4,1,5,6,1,7,8,5,3,8,1,9,0,9,9,8,7,5,2,7,9,6,5,1,6,7,3,0,3,3,6,9,5,4,9,3,2,5,7,2,9,1,\;0,1,1,\ldots$$
dan ia dimulai lagi setelah $60$ bilangan: $\pi(10)=60$. Jadi angka terakhir $F_n$ adalah angka terakhir $F_{n\bmod60}$.

**Mengapa barisannya berulang.** Lihat *pasangan* $(F_n\bmod m,\;F_{n+1}\bmod m)$. Hanya ada $m^2$ pasangan yang mungkin, jadi sebuah pasangan harus kembali, dan sejak itu semuanya berulang, karena sebuah pasangan menentukan yang berikutnya. Langkah $(a,b)\to(b,a+b)$ juga dapat dibatalkan, $(b,c)\to(c-b,b)$, sehingga pasangan pertama yang kembali adalah yang paling pertama, $(0,1)$: barisannya *murni* periodik, tanpa bagian pendahulu. Bahkan $\pi(m)\le6m$.

Beberapa nilai: $\pi(2)=3$, $\pi(3)=8$, $\pi(4)=6$, $\pi(5)=20$, $\pi(6)=24$, $\pi(7)=16$, $\pi(10)=60$, $\pi(100)=300$, $\pi(1000)=1500$, dan $\pi(10^k)=15\cdot10^{k-1}$ untuk $k\ge3$. Jadi dua angka terakhir berulang setiap $300$ bilangan dan tiga angka terakhir setiap $1500$.

**Contoh lengkap.** Berapa angka terakhir $F_{10^{18}}$? Karena $10^{18}\bmod60=40$ dan $F_{40}=102\,334\,155$, jawabannya $5$. Dan dengan penggandaan cepat dan sisa yang diambil pada setiap langkah, $F_{10^{18}}\bmod(10^9+7)=209\,783\,453$ keluar dalam sekitar enam puluh langkah; tidak ada barisan sekuintiliun suku yang pernah ditulis. Ini adalah pemakaian standar bilangan Fibonacci dalam kontes dan kriptografi: "beri jawabannya modulo $10^9+7$".

Pilih modulus di bawah, lihat sisa dan periodenya, lalu cari $F_n\bmod m$ untuk $n$ sampai tiga puluh angka.`,
          ),
        },
        { kind: 'widget', name: 'fibpisano' },
      ],
    },

    /* ------------------------------------------------------------------------------ golden, nature */
    {
      id: 'golden-nature',
      heading: L('Where do Fibonacci numbers really appear in nature and in algorithms?', 'Di mana bilangan Fibonacci benar-benar muncul di alam dan dalam algoritma?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The golden ratio $\varphi$ and the Fibonacci numbers show up in a few places that can be explained, and in many places that are myths.**

**The golden rectangle.** A rectangle with sides in the ratio $\varphi:1$ has a special property: cut off a square and what remains is a smaller rectangle with the same ratio, since $\varphi^2=\varphi+1$ makes $\frac{1}{\varphi-1}=\varphi$. Squares with sides $1,1,2,3,5,8,\ldots$ fit together into the spiral on this article's cover, and quarter circles drawn inside them approximate the golden spiral. It is an approximation: a true golden spiral grows by $\varphi$ every quarter turn, while Fibonacci's squares grow by a ratio only close to it.

**Seeds, cones and pineapples.** In a sunflower head, a pine cone or a pineapple, the seeds or scales sit on two families of spirals, one turning each way, and the two counts are very often *neighbors in the Fibonacci sequence*: $34$ and $55$ (or $55$ and $89$) in sunflower heads, $8$ and $13$ in many pine cones. There is a reason. A plant that adds each new seed at a fixed turn from the previous one wastes space unless the turn is a fraction of the circle that cannot be well approximated by simple fractions, and $\frac{1}{\varphi^2}$ is the hardest such number (see [rational approximations of irrationals](article:irrational-numbers#rational-approximations)). The turn is the golden angle $\frac{360^\circ}{\varphi^2}\approx137.5^\circ$, and it produces spirals counted by neighboring Fibonacci numbers. This is a model by Helmut Vogel (1979); real plants follow it often, not always.

**What is a myth.** Claims that the Great Pyramid, the Parthenon, the Mona Lisa or the proportions of the human body were designed with the golden ratio rest on selective measuring or on no evidence, and the shell of a nautilus is a logarithmic spiral that is not golden. A number on a petal count is a Fibonacci number partly because small numbers are everywhere. Treat such statements with suspicion, and ask which measurement was taken and where.

**In algorithms.** Fibonacci numbers do real work in computing. **Euclid's algorithm** for the gcd is slowest on consecutive Fibonacci numbers: $\gcd(F_{n+1},F_n)$ takes exactly $n-1$ division steps, and Gabriel Lamé proved in 1844 that the number of steps never exceeds five times the number of digits of the smaller number (often called the first analysis of the running time of an algorithm). **Fibonacci search** and the **golden-section search** (see [the optimization article](article:applied-optimization#optimize-in-code)) shrink a bracket by the golden ratio. **Fibonacci heaps** get their name from the Fibonacci numbers that bound the size of their trees.`,
            T`**Rasio emas $\varphi$ dan bilangan Fibonacci muncul di beberapa tempat yang dapat dijelaskan, dan di banyak tempat yang merupakan mitos.**

**Persegi panjang emas.** Persegi panjang dengan sisi berperbandingan $\varphi:1$ memiliki sifat khusus: potong sebuah persegi dan yang tersisa adalah persegi panjang yang lebih kecil dengan perbandingan yang sama, karena $\varphi^2=\varphi+1$ membuat $\frac{1}{\varphi-1}=\varphi$. Persegi bersisi $1,1,2,3,5,8,\ldots$ saling bertaut menjadi spiral pada sampul artikel ini, dan seperempat lingkaran yang digambar di dalamnya menghampiri spiral emas. Itu hampiran: spiral emas sejati tumbuh dengan faktor $\varphi$ setiap seperempat putaran, sedangkan persegi Fibonacci tumbuh dengan perbandingan yang hanya dekat dengannya.

**Biji, kerucut, dan nanas.** Pada kepala bunga matahari, kerucut pinus, atau nanas, biji atau sisiknya berada pada dua keluarga spiral, masing-masing berputar ke satu arah, dan kedua hitungannya sangat sering *bertetangga dalam barisan Fibonacci*: $34$ dan $55$ (atau $55$ dan $89$) pada kepala bunga matahari, $8$ dan $13$ pada banyak kerucut pinus. Ada alasannya. Tumbuhan yang menambahkan setiap biji baru pada putaran tetap dari yang sebelumnya menyia-nyiakan ruang kecuali putarannya adalah pecahan lingkaran yang tidak dapat dihampiri dengan baik oleh pecahan sederhana, dan $\frac{1}{\varphi^2}$ adalah bilangan paling sulit seperti itu (lihat [hampiran rasional bilangan irasional](article:irrational-numbers#rational-approximations)). Putarannya adalah sudut emas $\frac{360^\circ}{\varphi^2}\approx137{,}5^\circ$, dan ia menghasilkan spiral yang dihitung dengan bilangan Fibonacci bertetangga. Ini model Helmut Vogel (1979); tumbuhan sungguhan sering mengikutinya, tidak selalu.

**Apa yang mitos.** Klaim bahwa Piramida Besar, Parthenon, Mona Lisa, atau proporsi tubuh manusia dirancang dengan rasio emas bersandar pada pengukuran selektif atau tanpa bukti, dan cangkang nautilus adalah spiral logaritmik yang bukan emas. Banyaknya kelopak sebuah bunga adalah bilangan Fibonacci sebagian karena bilangan kecil ada di mana-mana. Perlakukan pernyataan seperti itu dengan curiga, dan tanyakan pengukuran apa yang diambil dan di mana.

**Dalam algoritma.** Bilangan Fibonacci melakukan kerja nyata dalam komputasi. **Algoritma Euclid** untuk gcd paling lambat pada bilangan Fibonacci berurutan: $\gcd(F_{n+1},F_n)$ memerlukan tepat $n-1$ langkah pembagian, dan Gabriel Lamé membuktikan pada 1844 bahwa banyaknya langkah tidak pernah melebihi lima kali banyaknya angka bilangan yang lebih kecil (sering disebut analisis pertama waktu jalan sebuah algoritma). **Pencarian Fibonacci** dan **pencarian golden-section** (lihat [artikel optimisasi](article:applied-optimization#optimize-in-code)) memperkecil kurungan dengan rasio emas. **Heap Fibonacci** mendapat namanya dari bilangan Fibonacci yang membatasi ukuran pohonnya.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- in code */
    {
      id: 'fibonacci-in-code',
      heading: L('How do you compute Fibonacci numbers in Python, JavaScript and C++?', 'Bagaimana menghitung bilangan Fibonacci di Python, JavaScript, dan C++?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use arbitrary-precision integers (Python's ´int´, JavaScript's ´BigInt´), a loop for ordinary $n$ and fast doubling for huge $n$, and take remainders at every step when only $F_n\bmod m$ is needed.** The first Python program counts the calls of the plain recursion, then computes the same number with a memo, a loop and fast doubling, and checks Binet's formula. A warning: since Python 3.11 an integer of more than $4300$ digits cannot be turned into text unless you raise the limit with ´sys.set_int_max_str_digits´, which is why the program prints the number of bits of $F_{10^6}$ and not its digits.`,
            T`**Pakai bilangan bulat berpresisi sembarang (´int´ Python, ´BigInt´ JavaScript), perulangan untuk $n$ biasa dan penggandaan cepat untuk $n$ yang sangat besar, dan ambil sisa pada setiap langkah bila hanya $F_n\bmod m$ yang diperlukan.** Program Python pertama menghitung panggilan rekursi biasa, lalu menghitung bilangan yang sama dengan memo, perulangan, dan penggandaan cepat, dan memeriksa rumus Binet. Peringatan: sejak Python ´3.11´ bilangan bulat lebih dari $4300$ angka tidak dapat diubah menjadi teks kecuali kamu menaikkan batasnya dengan ´sys.set_int_max_str_digits´, itulah sebabnya program mencetak banyaknya bit $F_{10^6}$, bukan angkanya.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: four ways to compute F(n)', 'Python: empat cara menghitung F(n)'),
          code: `from functools import lru_cache
from math import sqrt


def fib_naive(n):
    """Returns (F(n), number of calls) for the plain recursion."""
    if n < 2:
        return n, 1
    a, ca = fib_naive(n - 1)
    b, cb = fib_naive(n - 2)
    return a + b, ca + cb + 1


@lru_cache(maxsize=None)
def fib_memo(n):
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)


def fib_loop(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def fib_doubling(n):
    """Returns (F(n), F(n + 1)) with F(2k) = F(k)(2F(k+1) - F(k)) and F(2k+1) = F(k)^2 + F(k+1)^2."""
    if n == 0:
        return 0, 1
    a, b = fib_doubling(n // 2)
    c = a * (2 * b - a)
    d = a * a + b * b
    return (d, c + d) if n % 2 else (c, d)


print(fib_naive(20), fib_memo(20), fib_loop(20), fib_doubling(20)[0])
print(fib_naive(25)[1], 2 * fib_loop(26) - 1)               # the calls: 2F(n+1) - 1
print(fib_loop(100), len(str(fib_doubling(1000)[0])), len(str(fib_doubling(20000)[0])))
print(fib_doubling(10 ** 6)[0].bit_length())                 # a number of 208 988 digits, in a blink

phi = (1 + sqrt(5)) / 2
for n in (10, 70, 71, 72):
    print(n, round(phi ** n / sqrt(5)), fib_loop(n))         # Binet in doubles goes wrong at 71
# (6765, 21891) 6765 6765 6765
# 242785 242785
# 354224848179261915075 209 4180
# 694241
# 10 55 55
# 70 190392490709135 190392490709135
# 71 308061521170130 308061521170129
# 72 498454011879265 498454011879264`,
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: Zeckendorf sums and Fibonacci numbers modulo m', 'Python: jumlah Zeckendorf dan bilangan Fibonacci modulo m'),
          code: `def zeckendorf(n):
    """Greedy: the largest Fibonacci number that fits, again and again."""
    fibs = [1, 2]
    while fibs[-1] <= n:
        fibs.append(fibs[-1] + fibs[-2])
    out = []
    for f in reversed(fibs):
        if f <= n:
            out.append(f)
            n -= f
    return out


def pisano(m):
    """The period of F(n) mod m: walk the pairs of remainders until (0, 1) returns."""
    a, b, p = 0, 1 % m, 0
    while True:
        a, b = b, (a + b) % m
        p += 1
        if (a, b) == (0, 1 % m):
            return p


def fib_mod(n, m):
    """F(n) mod m for a huge n, by fast doubling with the remainder taken at each step."""
    def go(k):
        if k == 0:
            return 0, 1 % m
        a, b = go(k // 2)
        c = a * (2 * b - a) % m
        d = (a * a + b * b) % m
        return (d, (c + d) % m) if k % 2 else (c, d)
    return go(n)[0]


print(zeckendorf(100), zeckendorf(2026))
print([pisano(m) for m in (2, 3, 5, 10, 100, 1000)])
print(fib_mod(10 ** 18, 10), fib_mod(10 ** 18, 10 ** 9 + 7), fib_mod(10 ** 18, 1000))
print(fib_mod(10 ** 18 % 60, 10), fib_mod(10, 10 ** 9 + 7))  # reduce n by the period first
# [89, 8, 3] [1597, 377, 34, 13, 5]
# [3, 8, 20, 60, 300, 1500]
# 5 209783453 875
# 5 55`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: BigInt, fast doubling and where numbers stop being exact', 'JavaScript: BigInt, penggandaan cepat, dan di mana bilangan berhenti eksak'),
          code: `const fib = (n) => { let a = 0n, b = 1n; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a }
fib(100)                                      // 354224848179261915075n

// fast doubling: F(2k) = F(k)(2F(k+1) - F(k)), F(2k+1) = F(k)^2 + F(k+1)^2
const pair = (n) => {
  if (n === 0n) return [0n, 1n]
  const [a, b] = pair(n >> 1n)
  const c = a * (2n * b - a), d = a * a + b * b
  return n & 1n ? [d, c + d] : [c, d]
}
pair(1000000n)[0].toString().length           // 208988

// plain numbers stop being exact: the first b that is not a safe integer is wrong in its last digit
let a = 0, b = 1, n = 0
while (Number.isSafeInteger(b)) { [a, b] = [b, a + b]; n++ }
;[n, a, b]                                    // [78, 8944394323791464, 14472334024676220]; the true F(79) ends in ...221

// Binet in doubles
const phi = (1 + Math.sqrt(5)) / 2
let k = 0
while (BigInt(Math.round(phi ** k / Math.sqrt(5))) === fib(k)) k++
k                                             // 71

// F(n) mod m for a huge n
const fibMod = (n, m) => {
  const go = (j) => {
    if (j === 0n) return [0n, 1n % m]
    const [x, y] = go(j >> 1n)
    const c = (x * ((2n * y - x) % m + m)) % m, d = (x * x + y * y) % m
    return j & 1n ? [d, (c + d) % m] : [c, d]
  }
  return go(n)[0]
}
;[fibMod(10n ** 18n, 10n), fibMod(10n ** 18n, 1000000007n)]   // [5n, 209783453n]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: F(40) in an int, Pisano periods and Euclid on Fibonacci numbers', 'C++: F(40) dalam int, periode Pisano, dan Euclid pada bilangan Fibonacci'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

int main() {
  int a = 0, b = 1;
  for (int i = 0; i < 40; i++) {
    int t = a + b;
    a = b;
    b = t;
  }
  printf("%d\\n", a);                                   // F(40); F(47) no longer fits in an int

  int ms[4] = {2, 5, 10, 100};
  for (int k = 0; k < 4; k++) {
    int m = ms[k], x = 0, y = 1 % m, p = 0;
    do {
      int t = (x + y) % m;
      x = y;
      y = t;
      p++;
    } while (!(x == 0 && y == 1));
    printf("%d %d\\n", m, p);                           // the Pisano period
  }

  int u = 233, v = 144, steps = 0;                     // Euclid's algorithm on F(13) and F(12)
  while (v != 0) {
    int t = u % v;
    u = v;
    v = t;
    steps++;
  }
  printf("%d %d\\n", u, steps);                         // gcd 1 after n - 1 = 11 divisions
  return 0;
}

/* output:
102334155
2 3
5 20
10 60
100 300
1 11
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the Fibonacci numbers come from?', 'Dari mana bilangan Fibonacci berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Fibonacci numbers were found in India as a count of poetic rhythms, centuries before Fibonacci's rabbits.**

- **About 200 BC.** The Indian scholar Pingala, in his work on Sanskrit metre, counted the patterns of short and long syllables, which leads to the numbers $1,2,3,5,8,\ldots$.
- **About 700 and 1150.** Virahanka stated the rule that each count is the sum of the two before it, and Hemachandra gave it again; Gopala had done so around 1135.
- **1202.** Leonardo of Pisa, known as Fibonacci, published *Liber Abaci* with the rabbit problem and the first terms up to $377$. The book mainly taught Europeans the Hindu-Arabic numerals.
- **1730–1843.** Abraham de Moivre and Leonhard Euler knew the closed formula; Jacques Binet published it in 1843.
- **1844.** Gabriel Lamé used the Fibonacci numbers to bound the steps of Euclid's algorithm.
- **1870s.** Édouard Lucas studied the sequence in depth, introduced the companion Lucas numbers $2,1,3,4,7,11,\ldots$, used them to test whether large numbers are prime, and gave the sequence the name Fibonacci.
- **1939–1972.** Edouard Zeckendorf proved the theorem on sums of Fibonacci numbers (published in 1972, after Gerrit Lekkerkerker's 1952 paper).
- **1963.** The Fibonacci Association and its journal, the *Fibonacci Quarterly*, were founded.
- **1970.** Yuri Matiyasevich used the exponential growth of Fibonacci numbers to complete the proof that Hilbert's tenth problem, a general method for solving equations in integers, has no solution.`,
            T`**Bilangan Fibonacci ditemukan di India sebagai hitungan irama puisi, berabad-abad sebelum kelinci Fibonacci.**

- **Sekitar 200 SM.** Sarjana India Pingala, dalam karyanya tentang matra Sanskerta, menghitung pola suku kata pendek dan panjang, yang mengarah ke bilangan $1,2,3,5,8,\ldots$.
- **Sekitar 700 dan 1150.** Virahanka menyatakan aturan bahwa setiap hitungan adalah jumlah dua hitungan sebelumnya, dan Hemachandra memberikannya lagi; Gopala telah melakukannya sekitar 1135.
- **1202.** Leonardo dari Pisa, yang dikenal sebagai Fibonacci, menerbitkan *Liber Abaci* dengan soal kelinci dan suku-suku pertama sampai $377$. Buku itu terutama mengajarkan angka Hindu-Arab kepada orang Eropa.
- **1730–1843.** Abraham de Moivre dan Leonhard Euler mengetahui rumus tertutupnya; Jacques Binet menerbitkannya pada 1843.
- **1844.** Gabriel Lamé memakai bilangan Fibonacci untuk membatasi langkah algoritma Euclid.
- **1870-an.** Édouard Lucas mempelajari barisan itu secara mendalam, memperkenalkan bilangan Lucas pendampingnya $2,1,3,4,7,11,\ldots$, memakainya untuk menguji apakah bilangan besar prima, dan menamai barisan itu Fibonacci.
- **1939–1972.** Edouard Zeckendorf membuktikan teorema tentang jumlah bilangan Fibonacci (diterbitkan pada 1972, setelah makalah Gerrit Lekkerkerker tahun 1952).
- **1963.** Fibonacci Association dan jurnalnya, *Fibonacci Quarterly*, didirikan.
- **1970.** Yuri Matiyasevich memakai pertumbuhan eksponensial bilangan Fibonacci untuk melengkapi bukti bahwa masalah kesepuluh Hilbert, metode umum untuk menyelesaikan persamaan dalam bilangan bulat, tidak memiliki penyelesaian.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with Fibonacci numbers?', 'Kesalahan apa yang sering terjadi pada bilangan Fibonacci?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with Fibonacci numbers are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ The sequence starts $1,2,3,5,\ldots$ | It starts $0,1,1,2,3,5$; some books start at $F_1=F_2=1$, so state the convention before using an index. |
| ❌ $\varphi^n/\sqrt5$ equals $F_n$ | It is within $\frac12$ of $F_n$: round it, and in floating point even that fails from $n=71$. |
| ❌ The recursion is fine up to $n=50$ | It makes $2F_{51}-1\approx4\times10^{10}$ calls; use a loop, a memo, or fast doubling. |
| ❌ A memoized recursion handles any $n$ | Python's default limit of $1000$ nested calls stops it near $n=1000$; use a loop. |
| ❌ $F_n$ fits in a normal integer | A 32-bit signed integer stops at $F_{46}$, a 64-bit one at $F_{92}$ and a double is exact only to $F_{78}$. |
| ❌ $\frac{F_{n+1}}{F_n}$ is always below $\varphi$ | It alternates: below for even $n$ and above for odd $n$, and gets closer each time. |
| ❌ Fibonacci numbers are in the pyramids, the Parthenon and the Mona Lisa | Those claims are not supported by measurements; the real appearances are phyllotaxis, Euclid's algorithm and counting problems. |
| ❌ A Zeckendorf sum may use two neighboring Fibonacci numbers | No two are neighbors: greedy takes the largest that fits, so $100=89+8+3$ and not $55+34+8+3$, where $55$ and $34$ are neighbors. |
| ❌ The last digits of Fibonacci numbers look random | They repeat: the last digit every $60$ numbers, the last two every $300$ (Pisano periods). |`,
            T`**Kesalahan paling umum pada bilangan Fibonacci adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Barisannya dimulai $1,2,3,5,\ldots$ | Ia dimulai $0,1,1,2,3,5$; sebagian buku mulai dari $F_1=F_2=1$, jadi nyatakan konvensinya sebelum memakai indeks. |
| ❌ $\varphi^n/\sqrt5$ sama dengan $F_n$ | Ia berjarak kurang dari $\frac12$ dari $F_n$: bulatkan, dan dalam titik mengambang itu pun gagal mulai $n=71$. |
| ❌ Rekursi baik-baik saja sampai $n=50$ | Ia membuat $2F_{51}-1\approx4\times10^{10}$ panggilan; pakai perulangan, memo, atau penggandaan cepat. |
| ❌ Rekursi bermemo menangani $n$ mana pun | Batas bawaan Python sebesar $1000$ panggilan bersarang menghentikannya di sekitar $n=1000$; pakai perulangan. |
| ❌ $F_n$ muat dalam bilangan bulat biasa | Bilangan bulat bertanda 32-bit berhenti di $F_{46}$, yang 64-bit di $F_{92}$, dan double hanya eksak sampai $F_{78}$. |
| ❌ $\frac{F_{n+1}}{F_n}$ selalu di bawah $\varphi$ | Ia bergantian: di bawah untuk $n$ genap dan di atas untuk $n$ ganjil, dan makin dekat setiap kali. |
| ❌ Bilangan Fibonacci ada di piramida, Parthenon, dan Mona Lisa | Klaim itu tidak didukung pengukuran; kemunculan yang nyata adalah filotaksis, algoritma Euclid, dan soal menghitung. |
| ❌ Jumlah Zeckendorf boleh memakai dua bilangan Fibonacci bertetangga | Tidak ada dua yang bertetangga: rakus mengambil yang terbesar yang muat, sehingga $100=89+8+3$ dan bukan $55+34+8+3$, yang $55$ dan $34$-nya bertetangga. |
| ❌ Angka terakhir bilangan Fibonacci tampak acak | Mereka berulang: angka terakhir setiap $60$ bilangan, dua angka terakhir setiap $300$ (periode Pisano). |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- practice */
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
              L(T`Every third Fibonacci number is even.`, T`Setiap bilangan Fibonacci ketiga genap.`),
              L(T`$F_6=8$ divides $F_{12}=144$.`, T`$F_6=8$ membagi $F_{12}=144$.`),
              L(T`The plain recursion computes $F_n$ in about $n$ steps.`, T`Rekursi biasa menghitung $F_n$ dalam sekitar $n$ langkah.`),
              L(T`$F_n$ is the integer nearest to $\varphi^n/\sqrt5$, in exact arithmetic.`, T`$F_n$ adalah bilangan bulat terdekat dengan $\varphi^n/\sqrt5$, dalam aritmetika eksak.`),
              L(T`Two consecutive Fibonacci numbers always have gcd $1$.`, T`Dua bilangan Fibonacci berurutan selalu memiliki gcd $1$.`),
              L(T`$\frac{F_{n+1}}{F_n}$ is always smaller than $\varphi$.`, T`$\frac{F_{n+1}}{F_n}$ selalu lebih kecil daripada $\varphi$.`),
            ],
            answer: [true, true, false, true, true, false],
            explain: L(
              T`The even ones are $F_0,F_3,F_6,\ldots$. The plain recursion makes $2F_{n+1}-1$ calls, which grows like $\varphi^n$. Consecutive terms are coprime because a common divisor would divide $F_{n+1}F_{n-1}-F_n^2=\pm1$. The ratio alternates around $\varphi$.`,
              T`Yang genap adalah $F_0,F_3,F_6,\ldots$. Rekursi biasa membuat $2F_{n+1}-1$ panggilan, yang tumbuh seperti $\varphi^n$. Suku berurutan saling prima karena pembagi persekutuan akan membagi $F_{n+1}F_{n-1}-F_n^2=\pm1$. Perbandingannya bergantian di sekitar $\varphi$.`,
            ),
            hint: L(T`Check small cases: $F_1,\ldots,F_8=1,1,2,3,5,8,13,21$ and the ratios $2,1.5,1.667,\ldots$`, T`Periksa kasus kecil: $F_1,\ldots,F_8=1,1,2,3,5,8,13,21$ dan perbandingan $2;1{,}5;1{,}667;\ldots$`),
          },
        },
        {
          kind: 'activity',
          title: L('Which identities hold?', 'Identitas mana yang berlaku?'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these are true for all $n$? Choose **all** that apply.`, T`Mana yang benar untuk semua $n$? Pilih **semua** yang benar.`),
            options: [
              L(T`$F_1+F_2+\cdots+F_n=F_{n+2}-1$`, T`$F_1+F_2+\cdots+F_n=F_{n+2}-1$`),
              L(T`$F_{n-1}F_{n+1}-F_n^2=(-1)^n$`, T`$F_{n-1}F_{n+1}-F_n^2=(-1)^n$`),
              L(T`$F_{2n}=2F_n$`, T`$F_{2n}=2F_n$`),
              L(T`$\gcd(F_m,F_n)=F_{\gcd(m,n)}$`, T`$\gcd(F_m,F_n)=F_{\gcd(m,n)}$`),
              L(T`$F_{m+n}=F_mF_n$`, T`$F_{m+n}=F_mF_n$`),
            ],
            answer: [0, 1, 3],
            explain: L(T`The first is the telescoping sum, the second is Cassini's identity and the fourth is the gcd rule. $F_{2n}=F_n(2F_{n+1}-F_n)$, not $2F_n$ ($F_6=8\ne2F_3=4$), and $F_{m+n}=F_{m+1}F_n+F_mF_{n-1}$ is not a product ($F_5=5\ne F_2F_3=2$).`, T`Yang pertama adalah jumlah teleskopik, yang kedua identitas Cassini, dan yang keempat aturan gcd. $F_{2n}=F_n(2F_{n+1}-F_n)$, bukan $2F_n$ ($F_6=8\ne2F_3=4$), dan $F_{m+n}=F_{m+1}F_n+F_mF_{n-1}$ bukan hasil kali ($F_5=5\ne F_2F_3=2$).`),
            hint: L(T`Test each with $n=3$ or $m=2,n=3$.`, T`Uji masing-masing dengan $n=3$ atau $m=2,n=3$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A Fibonacci number', 'Sebuah bilangan Fibonacci'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`Continue $0,1,1,2,3,5,8,13,21,34,55,89,144,\ldots$`, T`Lanjutkan $0,1,1,2,3,5,8,13,21,34,55,89,144,\ldots$`), L(T`$F_{13}=F_{12}+F_{11}=144+89$.`, T`$F_{13}=F_{12}+F_{11}=144+89$.`)],
            explain: L(T`$F_{13}=144+89=233$.`, T`$F_{13}=144+89=233$.`),
            prompt: L(T`What is $F_{13}$?`, T`Berapa $F_{13}$?`),
            given: String.raw`F_{13}=v`,
            blanks: [{ label: 'F₁₃ =', answer: 233 }],
          },
        },
        {
          kind: 'activity',
          title: L('A telescoping sum', 'Jumlah teleskopik'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`Use $F_1+\cdots+F_n=F_{n+2}-1$ with $n=10$.`, T`Pakai $F_1+\cdots+F_n=F_{n+2}-1$ dengan $n=10$.`), L(T`$F_{12}=144$.`, T`$F_{12}=144$.`)],
            explain: L(T`$F_1+\cdots+F_{10}=F_{12}-1=144-1=143$.`, T`$F_1+\cdots+F_{10}=F_{12}-1=144-1=143$.`),
            prompt: L(T`What is $F_1+F_2+\cdots+F_{10}$?`, T`Berapa $F_1+F_2+\cdots+F_{10}$?`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 143 }],
          },
        },
        {
          kind: 'activity',
          title: L('Climbing stairs', 'Menaiki tangga'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`The number of ways for $n$ stairs is $F_{n+1}$.`, T`Banyaknya cara untuk $n$ anak tangga adalah $F_{n+1}$.`), L(T`$F_{11}=F_{10}+F_9=55+34$.`, T`$F_{11}=F_{10}+F_9=55+34$.`)],
            explain: L(T`The last step is $1$ or $2$, so $s_{10}=s_9+s_8$, and $s_n=F_{n+1}$ gives $s_{10}=F_{11}=89$.`, T`Langkah terakhir adalah $1$ atau $2$, sehingga $s_{10}=s_9+s_8$, dan $s_n=F_{n+1}$ memberi $s_{10}=F_{11}=89$.`),
            prompt: L(T`In how many ways can you climb $10$ stairs taking $1$ or $2$ stairs at a time?`, T`Dengan berapa cara kamu dapat menaiki $10$ anak tangga dengan $1$ atau $2$ anak tangga sekali langkah?`),
            given: String.raw`s=v`,
            blanks: [{ label: 's =', answer: 89 }],
          },
        },
        {
          kind: 'activity',
          title: L('Cassini', 'Cassini'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$F_9=34$, $F_{10}=55$, $F_{11}=89$.`, T`$F_9=34$, $F_{10}=55$, $F_{11}=89$.`), L(T`$34\cdot89=3026$ and $55^2=3025$.`, T`$34\cdot89=3026$ dan $55^2=3025$.`)],
            explain: L(T`$F_9F_{11}-F_{10}^2=3026-3025=1=(-1)^{10}$.`, T`$F_9F_{11}-F_{10}^2=3026-3025=1=(-1)^{10}$.`),
            prompt: L(T`What is $F_9F_{11}-F_{10}^2$?`, T`Berapa $F_9F_{11}-F_{10}^2$?`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('Calls of the recursion', 'Panggilan rekursi'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`The number of calls is $2F_{n+1}-1$.`, T`Banyaknya panggilan adalah $2F_{n+1}-1$.`), L(T`$F_{11}=89$.`, T`$F_{11}=89$.`)],
            explain: L(T`$2F_{11}-1=2\cdot89-1=177$ calls for $n=10$.`, T`$2F_{11}-1=2\cdot89-1=177$ panggilan untuk $n=10$.`),
            prompt: L(T`How many calls does the plain recursion ´fib(n) = fib(n-1) + fib(n-2)´ (with ´fib(0) = 0´ and ´fib(1) = 1´ as the base cases) make to compute $F_{10}$?`, T`Berapa panggilan yang dibuat rekursi biasa ´fib(n) = fib(n-1) + fib(n-2)´ (dengan ´fib(0) = 0´ dan ´fib(1) = 1´ sebagai kasus dasar) untuk menghitung $F_{10}$?`),
            given: String.raw`C=v`,
            blanks: [{ label: 'C =', answer: 177 }],
          },
        },
        {
          kind: 'activity',
          title: L('Zeckendorf', 'Zeckendorf'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`The largest Fibonacci number not above $50$ is $34$. What is left?`, T`Bilangan Fibonacci terbesar yang tidak melebihi $50$ adalah $34$. Apa yang tersisa?`), L(T`$50-34=16$, then $13$, then $3$.`, T`$50-34=16$, lalu $13$, lalu $3$.`)],
            explain: L(T`$50=34+13+3$: three terms, and no two are neighbors in $1,2,3,5,8,13,21,34$.`, T`$50=34+13+3$: tiga suku, dan tidak ada dua yang bertetangga dalam $1,2,3,5,8,13,21,34$.`),
            prompt: L(T`How many Fibonacci numbers are in the Zeckendorf sum of $50$?`, T`Berapa bilangan Fibonacci dalam jumlah Zeckendorf dari $50$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('A last digit', 'Sebuah angka terakhir'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`The last digit repeats every $60$ numbers, so $F_{120}$ ends like $F_{120\bmod60}$.`, T`Angka terakhir berulang setiap $60$ bilangan, sehingga $F_{120}$ berakhir seperti $F_{120\bmod60}$.`), L(T`$120\bmod60=0$ and $F_0=0$.`, T`$120\bmod60=0$ dan $F_0=0$.`)],
            explain: L(T`$\pi(10)=60$ and $120\bmod60=0$, so the last digit of $F_{120}$ is that of $F_0=0$.`, T`$\pi(10)=60$ dan $120\bmod60=0$, sehingga angka terakhir $F_{120}$ adalah angka terakhir $F_0=0$.`),
            prompt: L(T`What is the last digit of $F_{120}$?`, T`Berapa angka terakhir $F_{120}$?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 0 }],
          },
        },
        {
          kind: 'activity',
          title: L('How long is it?', 'Berapa panjangnya?'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`Digits $=\lfloor n\log_{10}\varphi-\log_{10}\sqrt5\rfloor+1$ with $\log_{10}\varphi\approx0.20899$.`, T`Angka $=\lfloor n\log_{10}\varphi-\log_{10}\sqrt5\rfloor+1$ dengan $\log_{10}\varphi\approx0{,}20899$.`), L(T`$1000\cdot0.20899-0.34949=208.64$.`, T`$1000\cdot0{,}20899-0{,}34949=208{,}64$.`)],
            explain: L(T`$\lfloor208.64\rfloor+1=209$ digits.`, T`$\lfloor208{,}64\rfloor+1=209$ angka.`),
            prompt: L(T`How many digits does $F_{1000}$ have?`, T`Berapa banyak angka $F_{1000}$?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 209 }],
          },
        },
        {
          kind: 'activity',
          title: L('The gcd rule', 'Aturan gcd'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`$\gcd(F_{24},F_{36})=F_{\gcd(24,36)}$.`, T`$\gcd(F_{24},F_{36})=F_{\gcd(24,36)}$.`), L(T`$\gcd(24,36)=12$ and $F_{12}=144$.`, T`$\gcd(24,36)=12$ dan $F_{12}=144$.`)],
            explain: L(T`$\gcd(24,36)=12$, so the gcd is $F_{12}=144$ (indeed $F_{24}=46\,368=144\cdot322$ and $F_{36}=14\,930\,352=144\cdot103\,683$).`, T`$\gcd(24,36)=12$, sehingga gcd-nya $F_{12}=144$ (memang $F_{24}=46\,368=144\cdot322$ dan $F_{36}=14\,930\,352=144\cdot103\,683$).`),
            prompt: L(T`What is $\gcd(F_{24},F_{36})$?`, T`Berapa $\gcd(F_{24},F_{36})$?`),
            given: String.raw`g=v`,
            blanks: [{ label: 'g =', answer: 144 }],
          },
        },
        {
          kind: 'activity',
          title: L('A huge index', 'Indeks yang sangat besar'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`You need $F_n\bmod(10^9+7)$ for $n=10^{18}$. Which method works?`, T`Kamu memerlukan $F_n\bmod(10^9+7)$ untuk $n=10^{18}$. Cara mana yang berhasil?`),
            options: [
              L(T`fast doubling with the remainder taken at every step ($\approx60$ steps)`, T`penggandaan cepat dengan sisa diambil pada setiap langkah ($\approx60$ langkah)`),
              L(T`the loop, $10^{18}$ additions`, T`perulangan, $10^{18}$ penjumlahan`),
              L(T`Binet's formula in doubles`, T`rumus Binet dalam double`),
              L(T`the plain recursion`, T`rekursi biasa`),
            ],
            answer: 0,
            explain: L(T`Fast doubling needs one step per bit of $n$, about $60$, and reducing modulo $m$ keeps every number small. The loop would take longer than the age of the universe, doubles keep $16$ digits, and the recursion is exponential.`, T`Penggandaan cepat memerlukan satu langkah per bit $n$, sekitar $60$, dan mereduksi modulo $m$ menjaga setiap bilangan tetap kecil. Perulangan akan memakan waktu lebih lama daripada usia alam semesta, double hanya menyimpan $16$ angka, dan rekursinya eksponensial.`),
            hint: L(T`How many bits does $10^{18}$ have?`, T`Berapa banyak bit $10^{18}$?`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: Fibonacci numbers at a glance', 'Ringkasan: bilangan Fibonacci sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** $F_0=0$, $F_1=1$, $F_n=F_{n-1}+F_{n-2}$; $F_{n+1}$ counts the ways to climb $n$ stairs with steps of $1$ or $2$.
- **Binet:** $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$, the integer nearest to $\frac{\varphi^n}{\sqrt5}$; the ratio $\frac{F_{n+1}}{F_n}$ is $\varphi+\frac{\psi^n}{F_n}$; in doubles it fails at $n=71$.
- **Identities:** $\sum F_k=F_{n+2}-1$, $\sum F_k^2=F_nF_{n+1}$, Cassini $(-1)^n$, doubling, $\gcd(F_m,F_n)=F_{\gcd(m,n)}$; all follow from $Q=\begin{pmatrix}1&1\\1&0\end{pmatrix}$.
- **Computing:** recursion $2F_{n+1}-1$ calls, memo $2n-1$, loop $n-1$ additions, fast doubling $3\lceil\log_2n\rceil$ multiplications; $F_n$ has $0.209\,n$ digits.
- **Zeckendorf:** every positive integer is a unique sum of non-neighboring Fibonacci numbers, found greedily; the Fibonacci code is built on it.
- **Pisano:** $F_n\bmod m$ repeats with period $\pi(m)\le6m$; $\pi(10)=60$, so reduce $n$ first.
- **Nature and algorithms:** golden angle $137.5^\circ$ in seed spirals, Euclid's worst case; the pyramid and painting claims are myths.
- **Code:** big integers, a loop, fast doubling, remainders at every step.`,
            T`- **Definisi:** $F_0=0$, $F_1=1$, $F_n=F_{n-1}+F_{n-2}$; $F_{n+1}$ menghitung cara menaiki $n$ anak tangga dengan langkah $1$ atau $2$.
- **Binet:** $F_n=\frac{\varphi^n-\psi^n}{\sqrt5}$, bilangan bulat terdekat dengan $\frac{\varphi^n}{\sqrt5}$; perbandingan $\frac{F_{n+1}}{F_n}$ adalah $\varphi+\frac{\psi^n}{F_n}$; dalam double ia gagal pada $n=71$.
- **Identitas:** $\sum F_k=F_{n+2}-1$, $\sum F_k^2=F_nF_{n+1}$, Cassini $(-1)^n$, penggandaan, $\gcd(F_m,F_n)=F_{\gcd(m,n)}$; semuanya mengikuti dari $Q=\begin{pmatrix}1&1\\1&0\end{pmatrix}$.
- **Menghitung:** rekursi $2F_{n+1}-1$ panggilan, memo $2n-1$, perulangan $n-1$ penjumlahan, penggandaan cepat $3\lceil\log_2n\rceil$ perkalian; $F_n$ memiliki $0{,}209\,n$ angka.
- **Zeckendorf:** setiap bilangan bulat positif adalah jumlah tunggal bilangan Fibonacci tak bertetangga, ditemukan secara rakus; kode Fibonacci dibangun di atasnya.
- **Pisano:** $F_n\bmod m$ berulang dengan periode $\pi(m)\le6m$; $\pi(10)=60$, jadi reduksi $n$ lebih dulu.
- **Alam dan algoritma:** sudut emas $137{,}5^\circ$ pada spiral biji, kasus terburuk Euclid; klaim piramida dan lukisan adalah mitos.
- **Kode:** bilangan bulat besar, perulangan, penggandaan cepat, sisa pada setiap langkah.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Fibonacci number', 'Bilangan Fibonacci'), definition: L('A term of the sequence 0, 1, 1, 2, 3, 5, 8, 13, … in which each term is the sum of the two before it.', 'Suku barisan 0, 1, 1, 2, 3, 5, 8, 13, … yang setiap sukunya adalah jumlah dua suku sebelumnya.') },
    { term: L('Golden ratio', 'Rasio emas'), definition: L('The number 1 plus the square root of 5, over 2, about 1.618, the limit of the ratio of consecutive Fibonacci numbers.', 'Bilangan 1 ditambah akar 5, dibagi 2, sekitar 1,618, limit perbandingan bilangan Fibonacci berurutan.') },
    { term: L('Binet\'s formula', 'Rumus Binet'), definition: L('The closed form for the nth Fibonacci number as the difference of the nth powers of the two roots of x squared equals x plus 1, divided by the square root of 5.', 'Bentuk tertutup bilangan Fibonacci ke-n sebagai selisih pangkat ke-n dari kedua akar x kuadrat sama dengan x tambah 1, dibagi akar 5.') },
    { term: L('Cassini\'s identity', 'Identitas Cassini'), definition: L('The identity that F(n−1) times F(n+1) minus F(n) squared equals minus 1 to the power n.', 'Identitas bahwa F(n−1) kali F(n+1) dikurangi F(n) kuadrat sama dengan minus 1 pangkat n.') },
    { term: L('Fast doubling', 'Penggandaan cepat'), definition: L('A method that finds F(n) with about log n big multiplications by getting F(2k) and F(2k+1) from F(k) and F(k+1).', 'Cara yang mendapatkan F(n) dengan sekitar log n perkalian bilangan besar dengan memperoleh F(2k) dan F(2k+1) dari F(k) dan F(k+1).') },
    { term: L('Zeckendorf representation', 'Representasi Zeckendorf'), definition: L('The unique way to write a positive integer as a sum of Fibonacci numbers, no two of which are neighbors in the sequence.', 'Cara tunggal menuliskan bilangan bulat positif sebagai jumlah bilangan Fibonacci yang tidak ada dua yang bertetangga dalam barisan.') },
    { term: L('Pisano period', 'Periode Pisano'), definition: L('The length of the cycle of the Fibonacci numbers modulo m, written pi of m; for m equal to 10 it is 60.', 'Panjang siklus bilangan Fibonacci modulo m, ditulis pi dari m; untuk m sama dengan 10 nilainya 60.') },
    { term: L('Phyllotaxis', 'Filotaksis'), definition: L('The arrangement of leaves, seeds or scales on a plant, often in spirals whose counts are neighboring Fibonacci numbers.', 'Susunan daun, biji, atau sisik pada tumbuhan, sering dalam spiral yang hitungannya adalah bilangan Fibonacci bertetangga.') },
    { term: L('Lucas numbers', 'Bilangan Lucas'), definition: L('The companion sequence 2, 1, 3, 4, 7, 11, … with the same recurrence as the Fibonacci numbers but different starting values.', 'Barisan pendamping 2, 1, 3, 4, 7, 11, … dengan rekurensi yang sama seperti bilangan Fibonacci tetapi nilai awal berbeda.') },
  ],

  howTo: [
    {
      name: L('How to compute the nth Fibonacci number', 'Cara menghitung bilangan Fibonacci ke-n'),
      description: L('Choose the method by the size of n: a loop for ordinary n, fast doubling for huge n, and remainders at every step if only the remainder is needed.', 'Pilih cara menurut ukuran n: perulangan untuk n biasa, penggandaan cepat untuk n yang sangat besar, dan sisa pada setiap langkah bila hanya sisanya yang diperlukan.'),
      steps: [
        { name: L('Avoid the plain recursion', 'Hindari rekursi biasa'), text: L('Do not compute F of n by calling itself twice: the number of calls grows like the golden ratio to the power n.', 'Jangan hitung F dari n dengan memanggil dirinya dua kali: banyaknya panggilan tumbuh seperti rasio emas pangkat n.') },
        { name: L('Use a loop for ordinary n', 'Pakai perulangan untuk n biasa'), text: L('Keep the last two values and add them n minus 1 times, using integers that do not overflow.', 'Simpan dua nilai terakhir dan jumlahkan sebanyak n dikurangi 1 kali, dengan bilangan bulat yang tidak meluap.') },
        { name: L('Use fast doubling for huge n', 'Pakai penggandaan cepat untuk n yang sangat besar'), text: L('Read the bits of n from the top and apply the doubling formulas once per bit.', 'Baca bit n dari atas dan terapkan rumus penggandaan sekali per bit.') },
        { name: L('Take remainders when asked for a modulus', 'Ambil sisa bila diminta modulus'), text: L('If the answer is wanted modulo m, reduce every product modulo m, or reduce n by the Pisano period first.', 'Jika jawaban diminta modulo m, reduksi setiap hasil kali modulo m, atau reduksi n dengan periode Pisano lebih dulu.') },
      ],
    },
    {
      name: L('How to write a number as a sum of Fibonacci numbers', 'Cara menuliskan bilangan sebagai jumlah bilangan Fibonacci'),
      description: L('Use the greedy method: repeatedly take the largest Fibonacci number that fits, which gives the unique sum with no two neighbors.', 'Pakai metode rakus: berulang kali ambil bilangan Fibonacci terbesar yang muat, yang memberi jumlah tunggal tanpa dua tetangga.'),
      steps: [
        { name: L('List the Fibonacci numbers', 'Daftarkan bilangan Fibonacci'), text: L('Write 1, 2, 3, 5, 8, 13, and so on up to the first number larger than the target.', 'Tulis 1, 2, 3, 5, 8, 13, dan seterusnya sampai bilangan pertama yang lebih besar daripada target.') },
        { name: L('Take the largest that fits', 'Ambil yang terbesar yang muat'), text: L('Pick the largest listed number that is not above the target and write it down.', 'Pilih bilangan terdaftar terbesar yang tidak melebihi target dan tuliskan.') },
        { name: L('Subtract and repeat', 'Kurangkan dan ulangi'), text: L('Subtract it from the target and repeat on the remainder until nothing is left.', 'Kurangkan dari target dan ulangi pada sisanya sampai tidak ada yang tersisa.') },
        { name: L('Check the neighbors', 'Periksa tetangganya'), text: L('The terms you wrote are never neighbors in the list; this is Zeckendorf\'s unique representation.', 'Suku yang kamu tulis tidak pernah bertetangga dalam daftar; inilah representasi tunggal Zeckendorf.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the Fibonacci sequence?', 'Apa itu barisan Fibonacci?'),
      a: L(
        'It is the sequence 0, 1, 1, 2, 3, 5, 8, 13, 21 and so on, where each number is the sum of the two before it. It starts from 0 and 1 and grows by a factor of about 1.618 at each step.',
        'Itu adalah barisan 0, 1, 1, 2, 3, 5, 8, 13, 21 dan seterusnya, yang setiap bilangannya adalah jumlah dua bilangan sebelumnya. Ia dimulai dari 0 dan 1 dan tumbuh dengan faktor sekitar 1,618 pada setiap langkah.',
      ),
    },
    {
      q: L('What is the formula for the nth Fibonacci number?', 'Apa rumus untuk bilangan Fibonacci ke-n?'),
      a: L(
        'Binet\'s formula says it is phi to the n minus psi to the n, all divided by the square root of 5, where phi is about 1.618 and psi about minus 0.618. Rounding phi to the n over root 5 gives the exact number.',
        'Rumus Binet berkata ia adalah phi pangkat n dikurangi psi pangkat n, semuanya dibagi akar 5, dengan phi sekitar 1,618 dan psi sekitar minus 0,618. Membulatkan phi pangkat n per akar 5 memberi bilangan yang eksak.',
      ),
    },
    {
      q: L('How do you calculate Fibonacci numbers quickly?', 'Bagaimana menghitung bilangan Fibonacci dengan cepat?'),
      a: L(
        'Use a loop that keeps the last two values for ordinary sizes, or fast doubling for huge ones, which needs only about log n big multiplications. The plain recursion takes exponential time because it repeats the same calls.',
        'Pakai perulangan yang menyimpan dua nilai terakhir untuk ukuran biasa, atau penggandaan cepat untuk yang sangat besar, yang hanya memerlukan sekitar log n perkalian bilangan besar. Rekursi biasa memerlukan waktu eksponensial karena mengulang panggilan yang sama.',
      ),
    },
    {
      q: L('Why does the ratio of Fibonacci numbers approach the golden ratio?', 'Mengapa perbandingan bilangan Fibonacci mendekati rasio emas?'),
      a: L(
        'Because F(n+1) minus phi times F(n) equals psi to the n exactly, and psi has absolute value below 1. Dividing by F(n) leaves a difference that shrinks fast and alternates in sign around phi.',
        'Karena F(n+1) dikurangi phi kali F(n) tepat sama dengan psi pangkat n, dan psi bernilai mutlak di bawah 1. Membaginya dengan F(n) menyisakan selisih yang menyusut cepat dan bergantian tanda di sekitar phi.',
      ),
    },
    {
      q: L('What is Zeckendorf\'s theorem?', 'Apa isi teorema Zeckendorf?'),
      a: L(
        'It says every positive integer can be written in exactly one way as a sum of Fibonacci numbers, no two of which are consecutive in the sequence. For example 100 is 89 plus 8 plus 3, found by repeatedly taking the largest that fits.',
        'Teorema ini berkata setiap bilangan bulat positif dapat ditulis tepat dengan satu cara sebagai jumlah bilangan Fibonacci yang tidak ada dua yang berurutan dalam barisan. Misalnya 100 adalah 89 ditambah 8 ditambah 3, ditemukan dengan berulang kali mengambil yang terbesar yang muat.',
      ),
    },
    {
      q: L('What is the Pisano period?', 'Apa itu periode Pisano?'),
      a: L(
        'It is the length of the cycle of the Fibonacci numbers modulo m. For m equal to 10 it is 60, so the last digit of every Fibonacci number repeats every 60 steps, which lets you find remainders for gigantic indices.',
        'Itu adalah panjang siklus bilangan Fibonacci modulo m. Untuk m sama dengan 10 nilainya 60, sehingga angka terakhir setiap bilangan Fibonacci berulang setiap 60 langkah, yang memungkinkan mencari sisa untuk indeks yang sangat besar.',
      ),
    },
    {
      q: L('Are Fibonacci numbers really found in nature?', 'Apakah bilangan Fibonacci benar-benar ada di alam?'),
      a: L(
        'Sometimes. The seed spirals of many sunflowers, pine cones and pineapples are counted by neighboring Fibonacci numbers, because of the golden angle of about 137.5 degrees. Claims about pyramids, paintings and the human body are mostly myths.',
        'Kadang-kadang. Spiral biji pada banyak bunga matahari, kerucut pinus, dan nanas dihitung dengan bilangan Fibonacci bertetangga, karena sudut emas sekitar 137,5 derajat. Klaim tentang piramida, lukisan, dan tubuh manusia kebanyakan mitos.',
      ),
    },
    {
      q: L('How many ways can you climb n stairs taking one or two steps?', 'Ada berapa cara menaiki n anak tangga dengan satu atau dua langkah?'),
      a: L(
        'There are F(n+1) ways: the last step is either one stair or two, leaving n minus 1 or n minus 2 stairs before it, so the counts follow the Fibonacci rule. Ten stairs give 89 ways.',
        'Ada F(n+1) cara: langkah terakhir adalah satu atau dua anak tangga, menyisakan n dikurangi 1 atau n dikurangi 2 anak tangga sebelumnya, sehingga hitungannya mengikuti aturan Fibonacci. Sepuluh anak tangga memberi 89 cara.',
      ),
    },
  ],

  references: [
    { title: 'Concrete Mathematics (2nd ed.), section 6.6: Fibonacci Numbers', author: 'Ronald L. Graham, Donald E. Knuth, Oren Patashnik', year: 1994, source: 'Addison-Wesley' },
    { title: 'The Art of Computer Programming, Volume 1 (3rd ed.), section 1.2.8: Fibonacci Numbers', author: 'Donald E. Knuth', year: 1997, source: 'Addison-Wesley' },
    { title: 'Fibonacci and Lucas Numbers with Applications', author: 'Thomas Koshy', year: 2001, source: 'Wiley' },
    { title: 'Fibonacci\'s Liber Abaci: A Translation into Modern English of Leonardo Pisano\'s Book of Calculation', author: 'Laurence Sigler', year: 2002, source: 'Springer' },
    { title: 'The so-called Fibonacci numbers in ancient and medieval India', author: 'Parmanand Singh', year: 1985, source: 'Historia Mathematica 12' },
    { title: 'Misconceptions about the golden ratio', author: 'George Markowsky', year: 1992, source: 'The College Mathematics Journal 23(1)' },
    { title: 'Note sur la limite du nombre des divisions dans la recherche du plus grand commun diviseur entre deux nombres entiers', author: 'Gabriel Lamé', year: 1844, source: 'Comptes Rendus de l\'Académie des Sciences 19' },
  ],

  related: ['geometric-sequences-and-series', 'big-o-notation', 'irrational-numbers', 'arithmetic-sequences-and-series'],
}
