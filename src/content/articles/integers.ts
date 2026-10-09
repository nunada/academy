import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './integers.meta'

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
    T`**The integers are the whole numbers and their negatives: $\ldots,-3,-2,-1,0,1,2,3,\ldots$, written $\mathbb{Z}$.** You can add, subtract and multiply any two of them and always get another integer, while division may leave a remainder: $17=5\cdot3+2$. Integers sit on a number line, split into primes and composites, and share factors measured by the GCD and the LCM.`,
    T`**Bilangan bulat adalah bilangan cacah beserta negatifnya: $\ldots,-3,-2,-1,0,1,2,3,\ldots$, ditulis $\mathbb{Z}$.** Kamu dapat menjumlahkan, mengurangkan, dan mengalikan dua bilangan bulat mana pun dan selalu mendapat bilangan bulat lagi, sedangkan pembagian dapat menyisakan sisa: $17=5\cdot3+2$. Bilangan bulat terletak pada garis bilangan, terbagi menjadi bilangan prima dan komposit, dan berbagi faktor yang diukur dengan FPB dan KPK.`,
  ),

  keyPoints: [
    L(
      T`An integer is a whole number, positive, negative or zero; zero is neither positive nor negative, and every integer $a$ has an opposite $-a$ with $a+(-a)=0$.`,
      T`Bilangan bulat adalah bilangan utuh, positif, negatif, atau nol; nol bukan positif dan bukan negatif, dan setiap bilangan bulat $a$ punya lawan $-a$ dengan $a+(-a)=0$.`,
    ),
    L(
      T`On the number line the number further right is greater, so $-7<-3$; the absolute value $|a|$ is the distance from 0.`,
      T`Pada garis bilangan, bilangan yang lebih kanan lebih besar, sehingga $-7<-3$; nilai mutlak $|a|$ adalah jarak dari 0.`,
    ),
    L(
      T`Subtracting is adding the opposite ($5-(-3)=8$), and a product or quotient is negative exactly when the signs differ.`,
      T`Mengurangi sama dengan menambah lawannya ($5-(-3)=8$), dan hasil kali atau hasil bagi negatif tepat bila tanda keduanya berbeda.`,
    ),
    L(
      T`Divisibility rules test 2, 3, 4, 5, 9, 10 and 11 from the digits alone; every integer above 1 is a product of primes in exactly one way.`,
      T`Aturan habis dibagi menguji 2, 3, 4, 5, 9, 10, dan 11 hanya dari angka-angkanya; setiap bilangan bulat di atas 1 adalah hasil kali bilangan prima dengan tepat satu cara.`,
    ),
    L(
      T`Euclid's algorithm finds the GCD by repeated division with remainder, and $\gcd(a,b)\cdot\operatorname{lcm}(a,b)=a\cdot b$.`,
      T`Algoritma Euclid mencari FPB dengan pembagian bersisa berulang, dan $\gcd(a,b)\cdot\operatorname{lcm}(a,b)=a\cdot b$.`,
    ),
    L(
      T`With negative numbers, languages disagree about remainders: $-7\bmod3$ is 2 in Python and $-1$ in JavaScript.`,
      T`Pada bilangan negatif, bahasa pemrograman berbeda soal sisa pembagian: $-7\bmod3$ adalah 2 di Python dan $-1$ di JavaScript.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what are they */
    {
      id: 'what-are-integers',
      heading: L('What are integers?', 'Apa itu bilangan bulat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Integers are the numbers with no fractional part: the counting numbers $1,2,3,\ldots$, their negatives $-1,-2,-3,\ldots$ and zero.** The set is written $\mathbb{Z}$, from the German *Zahlen* ("numbers").

Negative numbers exist because people need to describe things that go below a starting point, and the integers are what you get when a quantity can go either way:

| Situation | Positive | Zero | Negative |
|---|---|---|---|
| Temperature (°C) | 25 above freezing | freezing point | −5 below freezing |
| Height | 8 m above sea level | sea level | −12 m, a diver |
| Lift buttons | floor 3 | ground floor | −1, a basement |
| Money | 50 dollars in the account | nothing | −30, an overdraft |
| Goal difference | 2 goals ahead | level | −3, behind |

Three kinds of number are often confused. The **natural numbers** are $1,2,3,\ldots$ (here they start at 1; some books start at 0). The **whole numbers** are $0,1,2,3,\ldots$. The **integers** add the negatives. Every natural number is a whole number and every whole number is an integer, but not the other way round; the article on [real numbers](article:real-numbers#number-sets) shows how all these sets nest.

Two facts about zero and signs are worth fixing now. **Zero is neither positive nor negative.** And every integer $a$ has an **opposite**, $-a$, on the other side of 0 at the same distance, so that $a+(-a)=0$. The opposite of 7 is $-7$, the opposite of $-7$ is 7, and the opposite of 0 is 0, which is why $-(-a)=a$.

The integers are a *closed* family under three operations: add, subtract or multiply two integers and the result is always an integer. They are not closed under division, since $7\div2$ is not an integer. That one gap is what the later sections on remainders are about, and what the article on [rational numbers](article:rational-numbers) closes with fractions.`,
            T`**Bilangan bulat adalah bilangan tanpa bagian pecahan: bilangan asli $1,2,3,\ldots$, negatifnya $-1,-2,-3,\ldots$, dan nol.** Himpunannya ditulis $\mathbb{Z}$, dari kata Jerman *Zahlen* ("bilangan").

Bilangan negatif ada karena orang perlu menyatakan hal yang turun di bawah titik awal, dan bilangan bulat adalah yang kamu dapat ketika suatu besaran dapat bergerak ke dua arah:

| Situasi | Positif | Nol | Negatif |
|---|---|---|---|
| Suhu (°C) | 25 di atas titik beku | titik beku | −5 di bawah titik beku |
| Ketinggian | 8 m di atas permukaan laut | permukaan laut | −12 m, seorang penyelam |
| Tombol lift | lantai 3 | lantai dasar | −1, ruang bawah tanah |
| Uang | saldo Rp50.000 | tidak ada | −Rp30.000, utang |
| Selisih gol | unggul 2 gol | imbang | −3, tertinggal |

Tiga jenis bilangan sering tertukar. **Bilangan asli** adalah $1,2,3,\ldots$ (di sini mulai dari 1; sebagian buku mulai dari 0). **Bilangan cacah** adalah $0,1,2,3,\ldots$. **Bilangan bulat** menambahkan negatifnya. Setiap bilangan asli adalah bilangan cacah dan setiap bilangan cacah adalah bilangan bulat, tetapi tidak sebaliknya; artikel [bilangan real](article:real-numbers#number-sets) menunjukkan bagaimana semua himpunan ini bersarang.

Dua hal tentang nol dan tanda perlu dipegang sekarang. **Nol bukan positif dan bukan negatif.** Dan setiap bilangan bulat $a$ punya **lawan**, $-a$, di seberang 0 pada jarak yang sama, sehingga $a+(-a)=0$. Lawan 7 adalah $-7$, lawan $-7$ adalah 7, dan lawan 0 adalah 0, itulah sebabnya $-(-a)=a$.

Bilangan bulat adalah keluarga yang *tertutup* terhadap tiga operasi: jumlahkan, kurangkan, atau kalikan dua bilangan bulat dan hasilnya selalu bilangan bulat. Mereka tidak tertutup terhadap pembagian, sebab $7\div2$ bukan bilangan bulat. Celah itulah yang dibahas pada bagian sisa pembagian nanti, dan yang ditutup oleh artikel [bilangan rasional](article:rational-numbers) dengan pecahan.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'note',
          title: L('Negative numbers took a long time to be accepted', 'Bilangan negatif lama baru diterima'),
          text: L(
            T`The *Nine Chapters on the Mathematical Art*, compiled by about the first century CE, already calculated with red counting rods for positive numbers and black rods for negative ones: see the [counting rods](article:chinese-numbers#counting-rods) in the article on Chinese numbers. In India, Brahmagupta (628) gave rules for fortunes and debts, including that a debt subtracted from zero is a fortune. European mathematicians were slower: Stifel still called negative numbers "absurd numbers" in 1544, and they were fully accepted only in the 1600s.`,
            T`*Nine Chapters on the Mathematical Art*, yang disusun sekitar abad pertama M, sudah menghitung dengan batang hitung merah untuk bilangan positif dan batang hitam untuk bilangan negatif: lihat [batang hitung](article:chinese-numbers#counting-rods) pada artikel tentang bilangan dalam bahasa China. Di India, Brahmagupta (628) memberi aturan untuk harta dan utang, termasuk bahwa utang yang dikurangkan dari nol adalah harta. Matematikawan Eropa lebih lambat: Stifel pada 1544 masih menyebut bilangan negatif "bilangan yang absurd", dan baru diterima sepenuhnya pada abad ke-17.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: which are integers?', 'Coba: mana yang bilangan bulat?'),
          step: {
            kind: 'multi',
            id: 'a1',
            prompt: L('Choose **all** the integers.', 'Pilih **semua** bilangan bulat.'),
            options: [L('$5$', '$5$'), L('$-3$', '$-3$'), L('$0$', '$0$'), L('$2.5$', '$2{,}5$'), L('$\\frac12$', '$\\frac12$'), L('$\\frac{10}{5}$', '$\\frac{10}{5}$')],
            answer: [0, 1, 2, 5],
            explain: L(
              '$5$, $-3$ and $0$ are integers, and $\\frac{10}{5}=2$ is too, because a fraction can still be a whole number. $2.5$ and $\\frac12$ have a fractional part.',
              '$5$, $-3$, dan $0$ adalah bilangan bulat, begitu pula $\\frac{10}{5}=2$, sebab pecahan masih bisa berupa bilangan utuh. $2{,}5$ dan $\\frac12$ punya bagian pecahan.',
            ),
            hint: L('A number is an integer if it equals a whole number, however it is written.', 'Sebuah bilangan adalah bilangan bulat bila nilainya sama dengan bilangan utuh, bagaimanapun penulisannya.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- comparing */
    {
      id: 'compare-integers',
      heading: L('How do you compare integers and what is absolute value?', 'Bagaimana membandingkan bilangan bulat dan apa itu nilai mutlak?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**On the number line the integer further to the right is the greater one, so $-3>-7$ even though 7 is bigger than 3.** Every positive integer is greater than 0 and every negative one is less than 0, which makes every positive integer greater than every negative one.

To compare two negative numbers, compare their sizes and reverse the answer: $7>3$, so $-7<-3$. A debt of 7 is worse than a debt of 3.

The **absolute value** $|a|$ is the distance from $a$ to 0, so it is never negative: $|7|=7$, $|-7|=7$ and $|0|=0$. In symbols, $|a|=a$ when $a\ge0$ and $|a|=-a$ when $a<0$. Opposites have the same absolute value, and the distance between two integers is the absolute value of their difference: $|{-4}-3|=7$.

| Statement | True? | Why |
|---|---|---|
| $-3>-7$ | yes | $-3$ is to the right of $-7$ |
| $-1<0$ | yes | every negative is less than 0 |
| $|-5|=|5|$ | yes | both are 5 away from 0 |
| $-9<-10$ | no | $-9$ is to the right of $-10$ |

Ordering a list is a matter of reading it left to right on the line: negatives first, with the largest size furthest left, then 0, then the positives.`,
            T`**Pada garis bilangan, bilangan bulat yang lebih ke kanan adalah yang lebih besar, sehingga $-3>-7$ walaupun 7 lebih besar daripada 3.** Setiap bilangan bulat positif lebih besar daripada 0 dan setiap yang negatif lebih kecil daripada 0, sehingga setiap bilangan bulat positif lebih besar daripada setiap yang negatif.

Untuk membandingkan dua bilangan negatif, bandingkan ukurannya lalu balik jawabannya: $7>3$, sehingga $-7<-3$. Utang 7 lebih buruk daripada utang 3.

**Nilai mutlak** $|a|$ adalah jarak dari $a$ ke 0, sehingga tidak pernah negatif: $|7|=7$, $|-7|=7$, dan $|0|=0$. Dalam lambang, $|a|=a$ bila $a\ge0$ dan $|a|=-a$ bila $a<0$. Bilangan yang saling berlawanan punya nilai mutlak sama, dan jarak antara dua bilangan bulat adalah nilai mutlak selisihnya: $|{-4}-3|=7$.

| Pernyataan | Benar? | Alasan |
|---|---|---|
| $-3>-7$ | ya | $-3$ berada di kanan $-7$ |
| $-1<0$ | ya | setiap bilangan negatif kurang dari 0 |
| $|-5|=|5|$ | ya | keduanya berjarak 5 dari 0 |
| $-9<-10$ | tidak | $-9$ berada di kanan $-10$ |

Mengurutkan daftar berarti membacanya dari kiri ke kanan pada garis: yang negatif dahulu, dengan ukuran terbesar paling kiri, lalu 0, lalu yang positif.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: order from least to greatest', 'Coba: urutkan dari yang terkecil'),
          step: {
            kind: 'order',
            id: 'a2',
            math: true,
            prompt: L('Put these integers in order from least to greatest.', 'Urutkan bilangan bulat ini dari yang terkecil ke terbesar.'),
            lines: {
              en: ['-8', '-5', '-1', '0', '4'],
              id: ['-8', '-5', '-1', '0', '4'],
            },
            explain: L('Negatives come first, and among them the larger size is further left: $-8<-5<-1<0<4$.', 'Yang negatif lebih dulu, dan di antaranya ukuran yang lebih besar berada lebih kiri: $-8<-5<-1<0<4$.'),
            hint: L('Think of the number line: the further left, the smaller.', 'Bayangkan garis bilangan: makin ke kiri, makin kecil.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------- add and subtract */
    {
      id: 'add-subtract',
      heading: L('How do you add and subtract integers?', 'Bagaimana menjumlahkan dan mengurangkan bilangan bulat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To add integers, move along the number line: adding a positive moves right and adding a negative moves left; to subtract, add the opposite, so $a-b=a+(-b)$.** That one rule covers every case.

Two rules for adding, by the signs:

- **Same signs:** add the sizes and keep the sign. $5+3=8$ and $(-5)+(-3)=-8$.
- **Different signs:** subtract the smaller size from the larger, and keep the sign of the larger. $5+(-8)=-3$, because 8 is the larger size and it is negative. $(-5)+8=3$.

Two numbers that are opposites cancel: $6+(-6)=0$.

**Subtracting is adding the opposite.** Taking away a positive moves left: $2-5=2+(-5)=-3$. Taking away a negative moves right, because removing a debt makes you richer: $5-(-3)=5+3=8$ and $(-5)-(-3)=-5+3=-2$.

| Expression | Rewritten | Result |
|---|---|---|
| $5-(-3)$ | $5+3$ | 8 |
| $-5-3$ | $-5+(-3)$ | −8 |
| $-5-(-3)$ | $-5+3$ | −2 |
| $-5+8$ | different signs, 8 is larger | 3 |

The order does not matter for adding, $a+b=b+a$, but it does for subtracting: $5-3=2$ while $3-5=-2$. Try your own numbers below; the first jump (above the line) goes from 0 to $a$ and the second (below) is the change.`,
            T`**Untuk menjumlahkan bilangan bulat, bergeraklah di garis bilangan: menambah bilangan positif bergeser ke kanan dan menambah bilangan negatif bergeser ke kiri; untuk mengurangkan, tambahkan lawannya, sehingga $a-b=a+(-b)$.** Satu aturan itu mencakup semua kasus.

Dua aturan penjumlahan menurut tandanya:

- **Tanda sama:** jumlahkan ukurannya dan pertahankan tandanya. $5+3=8$ dan $(-5)+(-3)=-8$.
- **Tanda berbeda:** kurangkan ukuran yang kecil dari yang besar, dan pertahankan tanda yang besar. $5+(-8)=-3$, karena 8 adalah ukuran yang lebih besar dan ia negatif. $(-5)+8=3$.

Dua bilangan yang saling berlawanan saling meniadakan: $6+(-6)=0$.

**Mengurangkan sama dengan menambah lawannya.** Mengambil bilangan positif bergeser ke kiri: $2-5=2+(-5)=-3$. Mengambil bilangan negatif bergeser ke kanan, karena menghapus utang membuatmu lebih kaya: $5-(-3)=5+3=8$ dan $(-5)-(-3)=-5+3=-2$.

| Ekspresi | Ditulis ulang | Hasil |
|---|---|---|
| $5-(-3)$ | $5+3$ | 8 |
| $-5-3$ | $-5+(-3)$ | −8 |
| $-5-(-3)$ | $-5+3$ | −2 |
| $-5+8$ | tanda berbeda, 8 lebih besar | 3 |

Urutan tidak berpengaruh pada penjumlahan, $a+b=b+a$, tetapi berpengaruh pada pengurangan: $5-3=2$ sedangkan $3-5=-2$. Coba bilanganmu sendiri di bawah; lompatan pertama (di atas garis) dari 0 ke $a$ dan lompatan kedua (di bawah) adalah perubahannya.`,
          ),
        },
        { kind: 'widget', name: 'intline' },
        {
          kind: 'activity',
          title: L('Try it: add and subtract', 'Coba: menjumlah dan mengurang'),
          step: {
            kind: 'math',
            id: 'a3',
            hints: [
              L('Subtracting $-3$ is adding $3$: $-5+3+4$.', 'Mengurangi $-3$ sama dengan menambah $3$: $-5+3+4$.'),
              L('$-5+3=-2$, then $-2+4$.', '$-5+3=-2$, lalu $-2+4$.'),
            ],
            explain: L('$-5-(-3)+4=-5+3+4=2$.', '$-5-(-3)+4=-5+3+4=2$.'),
            prompt: L('Evaluate.', 'Hitunglah.'),
            given: String.raw`-5-(-3)+4=v`,
            blanks: [{ label: 'v =', answer: 2 }],
          },
        },
      ],
    },

    /* ---------------------------------------------------- multiply and divide */
    {
      id: 'multiply-divide',
      heading: L('How do you multiply and divide integers?', 'Bagaimana mengalikan dan membagi bilangan bulat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Multiply or divide the sizes, then make the answer positive if the signs are the same and negative if they differ.** A product with a factor of 0 is 0.

| First | Second | Product or quotient | Example |
|---|---|---|---|
| positive | positive | positive | $4\cdot3=12$ |
| negative | negative | positive | $(-4)(-3)=12$ |
| positive | negative | negative | $4\cdot(-3)=-12$ |
| negative | positive | negative | $(-4)\cdot3=-12$ |

Division follows the same signs, because $a\div b=c$ means $a=b\cdot c$: $(-12)\div4=-3$ since $4\cdot(-3)=-12$, and $(-12)\div(-3)=4$ since $(-3)\cdot4=-12$.

**Why is a negative times a negative positive?** Two arguments show it is not a convention but forced.

*A pattern.* Count down the first factor and watch the products: $3\cdot(-2)=-6$, $2\cdot(-2)=-4$, $1\cdot(-2)=-2$, $0\cdot(-2)=0$. Each step down adds 2. The next step must add 2 again: $(-1)\cdot(-2)=2$.

*The distributive law.* Start from $0=(-1)\cdot0=(-1)\bigl(1+(-1)\bigr)=(-1)\cdot1+(-1)(-1)=-1+(-1)(-1)$. For the right side to equal 0, $(-1)(-1)$ has to be 1. Any other value would break the [distributive law](article:algebraic-expressions#expand), $a(b+c)=ab+ac$, that the whole of arithmetic depends on.

**Division by zero is undefined.** $a\div0=c$ would mean $a=0\cdot c=0$, which is impossible for $a\neq0$; and $0\div0$ could be any number, so it has no single value. Meanwhile $0\div a=0$ for $a\neq0$.

Integers are not closed under division: $7\div2$ is the fraction $\frac72$, which is why division with remainder is its own topic below.`,
            T`**Kalikan atau bagi ukurannya, lalu buat jawabannya positif bila tanda keduanya sama dan negatif bila berbeda.** Hasil kali dengan faktor 0 adalah 0.

| Pertama | Kedua | Hasil kali atau hasil bagi | Contoh |
|---|---|---|---|
| positif | positif | positif | $4\cdot3=12$ |
| negatif | negatif | positif | $(-4)(-3)=12$ |
| positif | negatif | negatif | $4\cdot(-3)=-12$ |
| negatif | positif | negatif | $(-4)\cdot3=-12$ |

Pembagian mengikuti tanda yang sama, karena $a\div b=c$ berarti $a=b\cdot c$: $(-12)\div4=-3$ sebab $4\cdot(-3)=-12$, dan $(-12)\div(-3)=4$ sebab $(-3)\cdot4=-12$.

**Mengapa negatif kali negatif menjadi positif?** Dua argumen menunjukkan bahwa ini bukan kesepakatan, melainkan keharusan.

*Pola.* Turunkan faktor pertama dan perhatikan hasil kalinya: $3\cdot(-2)=-6$, $2\cdot(-2)=-4$, $1\cdot(-2)=-2$, $0\cdot(-2)=0$. Tiap langkah turun menambah 2. Langkah berikutnya harus menambah 2 lagi: $(-1)\cdot(-2)=2$.

*Sifat distributif.* Mulai dari $0=(-1)\cdot0=(-1)\bigl(1+(-1)\bigr)=(-1)\cdot1+(-1)(-1)=-1+(-1)(-1)$. Agar ruas kanan sama dengan 0, $(-1)(-1)$ harus 1. Nilai lain akan merusak [sifat distributif](article:algebraic-expressions#expand), $a(b+c)=ab+ac$, yang menjadi sandaran seluruh aritmetika.

**Pembagian dengan nol tidak terdefinisi.** $a\div0=c$ akan berarti $a=0\cdot c=0$, yang mustahil untuk $a\neq0$; dan $0\div0$ dapat berupa bilangan apa pun, sehingga tidak punya satu nilai. Sementara itu $0\div a=0$ untuk $a\neq0$.

Bilangan bulat tidak tertutup terhadap pembagian: $7\div2$ adalah pecahan $\frac72$, itulah sebabnya pembagian bersisa menjadi topik tersendiri di bawah.`,
          ),
        },
        { kind: 'widget', name: 'intops' },
        {
          kind: 'activity',
          title: L('Try it: multiply and divide', 'Coba: mengalikan dan membagi'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('Work left to right: $(-6)\\times(-7)$ first.', 'Kerjakan dari kiri ke kanan: $(-6)\\times(-7)$ dulu.'),
              L('That is $42$. Then $42\\div(-2)$: the signs differ.', 'Itu $42$. Lalu $42\\div(-2)$: tandanya berbeda.'),
            ],
            explain: L('$(-6)\\times(-7)=42$, and $42\\div(-2)=-21$ because the signs differ.', '$(-6)\\times(-7)=42$, dan $42\\div(-2)=-21$ karena tandanya berbeda.'),
            prompt: L('Evaluate.', 'Hitunglah.'),
            given: String.raw`(-6)\times(-7)\div(-2)=v`,
            blanks: [{ label: 'v =', answer: -21 }],
          },
        },
      ],
    },

    /* ---------------------------------------------------------- order of ops */
    {
      id: 'order-of-operations',
      heading: L('What is the order of operations with negative numbers?', 'Apa urutan operasi hitung pada bilangan negatif?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Work in this order: brackets, then powers, then multiplication and division from left to right, then addition and subtraction from left to right.** Negative numbers add two traps to it.

1. **A minus sign is not a bracket.** $-3^2$ means $-(3^2)=-9$, because the power binds tighter than the minus. Only $(-3)^2=9$ squares the $-3$.
2. **Same-level operations go left to right.** $12\div(-3)\times2$ is $-4\times2=-8$, not $12\div(-6)=-2$. And $10-4-3=3$, not $10-(4-3)=9$.
3. **Put brackets round a negative after an operator.** $5\cdot-2$ is written $5\cdot(-2)$, and $8-3\times(-2)=8+6=14$: the multiplication goes before the subtraction.

| Expression | Steps | Result |
|---|---|---|
| $-3^2$ | $-(9)$ | −9 |
| $(-3)^2$ | $9$ | 9 |
| $8-3\times(-2)$ | $8-(-6)=8+6$ | 14 |
| $12\div(-3)\times2$ | $-4\times2$ | −8 |
| $-2\,(3-7)$ | $-2\cdot(-4)$ | 8 |

An even power of a negative number is positive and an odd power is negative: $(-2)^4=16$ and $(-2)^3=-8$, since each pair of minus signs cancels.`,
            T`**Kerjakan dengan urutan ini: kurung, lalu pangkat, lalu perkalian dan pembagian dari kiri ke kanan, lalu penjumlahan dan pengurangan dari kiri ke kanan.** Bilangan negatif menambah dua jebakan.

1. **Tanda minus bukan kurung.** $-3^2$ berarti $-(3^2)=-9$, karena pangkat lebih kuat mengikat daripada minus. Hanya $(-3)^2=9$ yang mengkuadratkan $-3$.
2. **Operasi setingkat dikerjakan dari kiri ke kanan.** $12\div(-3)\times2$ adalah $-4\times2=-8$, bukan $12\div(-6)=-2$. Dan $10-4-3=3$, bukan $10-(4-3)=9$.
3. **Beri kurung pada bilangan negatif setelah operator.** $5\cdot-2$ ditulis $5\cdot(-2)$, dan $8-3\times(-2)=8+6=14$: perkalian dikerjakan sebelum pengurangan.

| Ekspresi | Langkah | Hasil |
|---|---|---|
| $-3^2$ | $-(9)$ | −9 |
| $(-3)^2$ | $9$ | 9 |
| $8-3\times(-2)$ | $8-(-6)=8+6$ | 14 |
| $12\div(-3)\times2$ | $-4\times2$ | −8 |
| $-2\,(3-7)$ | $-2\cdot(-4)$ | 8 |

Pangkat genap dari bilangan negatif positif dan pangkat ganjil negatif: $(-2)^4=16$ dan $(-2)^3=-8$, sebab tiap pasang tanda minus saling meniadakan.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: order of operations', 'Coba: urutan operasi'),
          step: {
            kind: 'math',
            id: 'a5',
            hints: [
              L('Multiply before you subtract: $3\\times(-2)=-6$.', 'Kalikan sebelum mengurangi: $3\\times(-2)=-6$.'),
              L('$8-(-6)=8+6$.', '$8-(-6)=8+6$.'),
            ],
            explain: L('$8-3\\times(-2)=8-(-6)=8+6=14$.', '$8-3\\times(-2)=8-(-6)=8+6=14$.'),
            prompt: L('Evaluate.', 'Hitunglah.'),
            given: String.raw`8-3\times(-2)=v`,
            blanks: [{ label: 'v =', answer: 14 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------- divisibility */
    {
      id: 'divisibility',
      heading: L('What are even and odd numbers and the divisibility rules?', 'Apa itu bilangan genap, ganjil, dan aturan habis dibagi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An integer $a$ is divisible by $b$ when $a=b\cdot k$ for some integer $k$: $b$ is then a divisor (factor) of $a$ and $a$ is a multiple of $b$.** So 12 is divisible by 4 because $12=4\cdot3$, and 0 is divisible by every integer because $0=b\cdot0$.

**Even and odd.** An even integer is divisible by 2, $a=2k$; an odd one is $a=2k+1$. Zero is even, and negative numbers have parity too: $-3$ is odd and $-4$ is even. Parity follows a short table:

| Operation | Result |
|---|---|
| even + even, odd + odd | even |
| even + odd | odd |
| even × anything | even |
| odd × odd | odd |

A proof of one row: $(2a+1)+(2b+1)=2(a+b+1)$, which is even. The same style of proof shows that the square of an odd number is odd, the fact behind the irrationality of $\sqrt2$.

**Divisibility rules** let you test a number from its digits, without dividing:

| By | The number is divisible when | Why it works |
|---|---|---|
| 2 | the last digit is even | 10 is a multiple of 2 |
| 3 | the digit sum is divisible by 3 | 10, 100, ... each leave remainder 1 |
| 4 | the last two digits form a multiple of 4 | 100 is a multiple of 4 |
| 5 | the last digit is 0 or 5 | 10 is a multiple of 5 |
| 6 | it is divisible by both 2 and 3 | 2 and 3 share no factor |
| 8 | the last three digits form a multiple of 8 | 1000 is a multiple of 8 |
| 9 | the digit sum is divisible by 9 | 10, 100, ... each leave remainder 1 |
| 10 | the last digit is 0 | the definition of base ten |
| 11 | the alternating digit sum is divisible by 11 | 10 is one less than a multiple of 11 |

Example: $7200$ has digit sum 9 and ends in 00, so it is divisible by 2, 3, 4, 5, 6, 8, 9 and 10. For 11 take the digits from the right with alternating signs, $0-0+2-7=-5$, which is not a multiple of 11, so 7200 is not. Try any number below, including a very long one.`,
            T`**Bilangan bulat $a$ habis dibagi $b$ bila $a=b\cdot k$ untuk suatu bilangan bulat $k$: $b$ kemudian disebut pembagi (faktor) dari $a$ dan $a$ adalah kelipatan $b$.** Jadi 12 habis dibagi 4 karena $12=4\cdot3$, dan 0 habis dibagi setiap bilangan bulat karena $0=b\cdot0$.

**Genap dan ganjil.** Bilangan bulat genap habis dibagi 2, $a=2k$; yang ganjil berbentuk $a=2k+1$. Nol genap, dan bilangan negatif juga punya paritas: $-3$ ganjil dan $-4$ genap. Paritas mengikuti tabel singkat:

| Operasi | Hasil |
|---|---|
| genap + genap, ganjil + ganjil | genap |
| genap + ganjil | ganjil |
| genap × apa pun | genap |
| ganjil × ganjil | ganjil |

Bukti satu baris: $(2a+1)+(2b+1)=2(a+b+1)$, yang genap. Bukti dengan gaya yang sama menunjukkan bahwa kuadrat bilangan ganjil adalah ganjil, fakta di balik keirasionalan $\sqrt2$.

**Aturan habis dibagi** memungkinkanmu menguji sebuah bilangan dari angka-angkanya, tanpa membagi:

| Oleh | Bilangan habis dibagi bila | Mengapa berlaku |
|---|---|---|
| 2 | angka terakhir genap | 10 kelipatan 2 |
| 3 | jumlah angkanya habis dibagi 3 | 10, 100, ... masing-masing bersisa 1 |
| 4 | dua angka terakhir membentuk kelipatan 4 | 100 kelipatan 4 |
| 5 | angka terakhir 0 atau 5 | 10 kelipatan 5 |
| 6 | habis dibagi 2 dan 3 sekaligus | 2 dan 3 tidak punya faktor sama |
| 8 | tiga angka terakhir membentuk kelipatan 8 | 1000 kelipatan 8 |
| 9 | jumlah angkanya habis dibagi 9 | 10, 100, ... masing-masing bersisa 1 |
| 10 | angka terakhir 0 | definisi basis sepuluh |
| 11 | jumlah angka berselang-seling habis dibagi 11 | 10 kurang satu dari kelipatan 11 |

Contoh: $7200$ berjumlah angka 9 dan berakhir 00, sehingga habis dibagi 2, 3, 4, 5, 6, 8, 9, dan 10. Untuk 11, ambil angka dari kanan dengan tanda berselang-seling, $0-0+2-7=-5$, yang bukan kelipatan 11, sehingga 7200 tidak habis dibagi 11. Coba bilangan apa pun di bawah, termasuk yang sangat panjang.`,
          ),
        },
        { kind: 'widget', name: 'divrules' },
        {
          kind: 'activity',
          title: L('Try it: a missing digit', 'Coba: angka yang hilang'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('The digit sum $5+2+d$ must be a multiple of 9.', 'Jumlah angka $5+2+d$ harus kelipatan 9.'),
              L('$7+d=9$.', '$7+d=9$.'),
            ],
            explain: L('$5+2+d=7+d$ is a multiple of 9 only for $d=2$, giving $522=9\\cdot58$.', '$5+2+d=7+d$ kelipatan 9 hanya untuk $d=2$, menghasilkan $522=9\\cdot58$.'),
            prompt: L('The three-digit number $52d$ is divisible by 9. Find the digit $d$.', 'Bilangan tiga angka $52d$ habis dibagi 9. Tentukan angka $d$.'),
            given: String.raw`52d,\ 9\mid52d`,
            blanks: [{ label: 'd =', answer: 2 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- primes */
    {
      id: 'primes',
      heading: L('What are prime numbers and prime factorisation?', 'Apa itu bilangan prima dan faktorisasi prima?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A prime number is an integer greater than 1 whose only positive divisors are 1 and itself; every integer greater than 1 is either prime or a product of primes, and that product is unique.** The primes begin $2,3,5,7,11,13,17,19,23,29,31,37,41,43,47$, fifteen of them below 50.

- **Composite** numbers have more divisors: $12=3\cdot4$.
- **1 is neither prime nor composite.** It has one divisor, itself. Calling it prime would break uniqueness, since $6=2\cdot3=1\cdot2\cdot3$.
- **2 is the only even prime**, because every other even number is also divisible by 2.

**The fundamental theorem of arithmetic** says every integer greater than 1 can be written as a product of primes in exactly one way, apart from the order. So $360=2\cdot2\cdot2\cdot3\cdot3\cdot5=2^3\cdot3^2\cdot5$, and no other set of primes multiplies to 360.

**To factorise,** divide by the smallest prime that goes in, again and again, until 1 is left: $360\div2=180$, $\div2=90$, $\div2=45$, $\div3=15$, $\div3=5$, $\div5=1$.

**To test whether $n$ is prime,** divide by the primes up to $\sqrt{n}$. If $n$ had a factor larger than $\sqrt{n}$, its partner factor would be smaller than $\sqrt{n}$, so you would have met it already. Take 91: $\sqrt{91}<10$, and $91=7\cdot13$, so it only looks prime. For 97 nothing in 2, 3, 5, 7 divides it, so 97 is prime.

**There are infinitely many primes.** Euclid's argument: suppose a list of primes were complete, multiply them all and add 1. The result leaves remainder 1 on division by every prime on the list, so it either is a new prime or has one, and the list was not complete.

**Divisors from the factorisation.** If $n=p^a q^b\cdots$ it has $(a+1)(b+1)\cdots$ positive divisors, so $360$ has $4\cdot3\cdot2=24$. Use the tool below.`,
            T`**Bilangan prima adalah bilangan bulat lebih dari 1 yang satu-satunya pembagi positifnya adalah 1 dan dirinya sendiri; setiap bilangan bulat lebih dari 1 adalah prima atau hasil kali bilangan prima, dan hasil kali itu tunggal.** Bilangan prima dimulai $2,3,5,7,11,13,17,19,23,29,31,37,41,43,47$, lima belas bilangan di bawah 50.

- Bilangan **komposit** punya lebih banyak pembagi: $12=3\cdot4$.
- **1 bukan prima dan bukan komposit.** Ia hanya punya satu pembagi, yaitu dirinya sendiri. Menyebutnya prima akan merusak ketunggalan, sebab $6=2\cdot3=1\cdot2\cdot3$.
- **2 adalah satu-satunya prima genap**, karena setiap bilangan genap lain juga habis dibagi 2.

**Teorema dasar aritmetika** menyatakan setiap bilangan bulat lebih dari 1 dapat ditulis sebagai hasil kali bilangan prima dengan tepat satu cara, selain urutannya. Jadi $360=2\cdot2\cdot2\cdot3\cdot3\cdot5=2^3\cdot3^2\cdot5$, dan tidak ada himpunan bilangan prima lain yang hasil kalinya 360.

**Untuk memfaktorkan,** bagi dengan bilangan prima terkecil yang membagi, berulang-ulang, sampai tersisa 1: $360\div2=180$, $\div2=90$, $\div2=45$, $\div3=15$, $\div3=5$, $\div5=1$.

**Untuk menguji apakah $n$ prima,** bagi dengan bilangan prima sampai $\sqrt{n}$. Jika $n$ punya faktor yang lebih besar dari $\sqrt{n}$, pasangan faktornya lebih kecil dari $\sqrt{n}$, sehingga sudah kamu temui. Ambil 91: $\sqrt{91}<10$, dan $91=7\cdot13$, sehingga ia hanya tampak prima. Untuk 97 tidak ada di antara 2, 3, 5, 7 yang membaginya, sehingga 97 prima.

**Bilangan prima tak berhingga banyaknya.** Argumen Euclid: misalkan daftar bilangan prima sudah lengkap, kalikan semuanya lalu tambah 1. Hasilnya bersisa 1 bila dibagi bilangan prima mana pun pada daftar, sehingga ia prima baru atau punya pembagi prima baru, dan daftar itu tidak lengkap.

**Pembagi dari faktorisasi.** Jika $n=p^a q^b\cdots$ maka ia punya $(a+1)(b+1)\cdots$ pembagi positif, sehingga $360$ punya $4\cdot3\cdot2=24$. Pakai alat di bawah.`,
          ),
        },
        { kind: 'widget', name: 'primefactor' },
        {
          kind: 'activity',
          title: L('Try it: spot the prime', 'Coba: temukan bilangan prima'),
          step: {
            kind: 'quiz',
            id: 'a7',
            prompt: L('Which of these is prime?', 'Manakah di antara ini yang prima?'),
            options: [L('$51$', '$51$'), L('$57$', '$57$'), L('$91$', '$91$'), L('$97$', '$97$')],
            answer: 3,
            explain: L(
              '$51=3\\cdot17$, $57=3\\cdot19$ and $91=7\\cdot13$. Nothing in $2,3,5,7$ divides $97$, and $11^2=121>97$, so 97 is prime.',
              '$51=3\\cdot17$, $57=3\\cdot19$, dan $91=7\\cdot13$. Tidak ada di antara $2,3,5,7$ yang membagi $97$, dan $11^2=121>97$, sehingga 97 prima.',
            ),
            hint: L('Try dividing by 3 and 7 first; the digit sum helps with 3.', 'Coba bagi dengan 3 dan 7 lebih dulu; jumlah angka membantu untuk 3.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- gcd and lcm */
    {
      id: 'gcd-lcm',
      heading: L('How do you find the GCD and LCM?', 'Bagaimana mencari FPB dan KPK?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The greatest common divisor (GCD, in Indonesian FPB) of two integers is the largest integer that divides both, and the least common multiple (LCM, KPK) is the smallest positive integer that both divide.** For 48 and 180 the GCD is 12 and the LCM is 720.

**By prime factors.** Write each number as primes: $48=2^4\cdot3$ and $180=2^2\cdot3^2\cdot5$. For the GCD take each prime with the *smaller* exponent: $2^2\cdot3=12$. For the LCM take each prime with the *larger* exponent: $2^4\cdot3^2\cdot5=720$.

**By Euclid's algorithm,** which needs no factoring and works for huge numbers. Divide, keep the remainder, and repeat with the divisor and the remainder until the remainder is 0; the last non-zero remainder is the GCD:

$180=3\cdot48+36$, then $48=1\cdot36+12$, then $36=3\cdot12+0$. So $\gcd(48,180)=12$.

It works because any number dividing $a$ and $b$ also divides $a-qb$, and the other way round, so $\gcd(a,b)=\gcd(b,\,a-qb)$ while the numbers shrink to zero. Euclid wrote it down in Book VII of the *Elements*, around 300 BCE, which makes it one of the oldest algorithms still in daily use.

**The two are linked:** $\gcd(a,b)\cdot\operatorname{lcm}(a,b)=a\cdot b$. Check: $12\cdot720=8640=48\cdot180$. So $\operatorname{lcm}(a,b)=\dfrac{a\cdot b}{\gcd(a,b)}$. Two numbers are **coprime** when their GCD is 1, as with 8 and 15.

**What they are for.**

- **Simplifying a fraction:** divide top and bottom by the GCD. $\dfrac{48}{180}=\dfrac{48\div12}{180\div12}=\dfrac{4}{15}$.
- **Cutting into equal pieces:** a floor 48 dm by 180 dm is tiled with the largest square tiles whose side is $\gcd=12$ dm, which takes $4\cdot15=60$ tiles.
- **Repeating events:** buses leave every 12 and every 18 minutes, together at 7:00. They next leave together after $\operatorname{lcm}(12,18)=36$ minutes.
- **Adding fractions:** the least common denominator is the LCM of the denominators.`,
            T`**Faktor persekutuan terbesar (FPB) dua bilangan bulat adalah bilangan bulat terbesar yang membagi keduanya, dan kelipatan persekutuan terkecil (KPK) adalah bilangan bulat positif terkecil yang habis dibagi keduanya.** Untuk 48 dan 180, FPB-nya 12 dan KPK-nya 720.

**Dengan faktor prima.** Tulis tiap bilangan sebagai bilangan prima: $48=2^4\cdot3$ dan $180=2^2\cdot3^2\cdot5$. Untuk FPB ambil tiap bilangan prima dengan eksponen yang *terkecil*: $2^2\cdot3=12$. Untuk KPK ambil tiap bilangan prima dengan eksponen yang *terbesar*: $2^4\cdot3^2\cdot5=720$.

**Dengan algoritma Euclid,** yang tidak memerlukan pemfaktoran dan berlaku untuk bilangan yang sangat besar. Bagi, simpan sisanya, dan ulangi dengan pembagi dan sisa sampai sisanya 0; sisa terakhir yang bukan nol adalah FPB:

$180=3\cdot48+36$, lalu $48=1\cdot36+12$, lalu $36=3\cdot12+0$. Jadi $\gcd(48,180)=12$.

Algoritma ini berhasil karena bilangan mana pun yang membagi $a$ dan $b$ juga membagi $a-qb$, dan sebaliknya, sehingga $\gcd(a,b)=\gcd(b,\,a-qb)$ sementara bilangannya mengecil sampai nol. Euclid menuliskannya dalam Buku VII *Elements*, sekitar 300 SM, sehingga ia salah satu algoritma tertua yang masih dipakai setiap hari.

**Keduanya berkaitan:** $\gcd(a,b)\cdot\operatorname{lcm}(a,b)=a\cdot b$. Periksa: $12\cdot720=8640=48\cdot180$. Jadi $\operatorname{lcm}(a,b)=\dfrac{a\cdot b}{\gcd(a,b)}$. Dua bilangan **saling prima** bila FPB-nya 1, seperti 8 dan 15.

**Kegunaannya.**

- **Menyederhanakan pecahan:** bagi pembilang dan penyebut dengan FPB. $\dfrac{48}{180}=\dfrac{48\div12}{180\div12}=\dfrac{4}{15}$.
- **Memotong menjadi bagian sama besar:** lantai 48 dm kali 180 dm dipasangi ubin persegi terbesar yang sisinya $\gcd=12$ dm, yang membutuhkan $4\cdot15=60$ ubin.
- **Kejadian berulang:** bus berangkat tiap 12 menit dan tiap 18 menit, bersamaan pada pukul 07:00. Keduanya berangkat bersamaan lagi setelah $\operatorname{lcm}(12,18)=36$ menit.
- **Menjumlahkan pecahan:** penyebut sekutu terkecil adalah KPK dari penyebut-penyebutnya.`,
          ),
        },
        { kind: 'widget', name: 'gcdlcm' },
        {
          kind: 'activity',
          title: L('Try it: GCD and LCM', 'Coba: FPB dan KPK'),
          step: {
            kind: 'math',
            id: 'a8',
            hints: [
              L('$36=2^2\\cdot3^2$ and $48=2^4\\cdot3$.', '$36=2^2\\cdot3^2$ dan $48=2^4\\cdot3$.'),
              L('GCD: smaller exponents, $2^2\\cdot3$. LCM: larger exponents, $2^4\\cdot3^2$.', 'FPB: eksponen terkecil, $2^2\\cdot3$. KPK: eksponen terbesar, $2^4\\cdot3^2$.'),
            ],
            explain: L('$\\gcd=2^2\\cdot3=12$ and $\\operatorname{lcm}=2^4\\cdot3^2=144$. Check: $12\\cdot144=1728=36\\cdot48$.', '$\\gcd=2^2\\cdot3=12$ dan $\\operatorname{lcm}=2^4\\cdot3^2=144$. Periksa: $12\\cdot144=1728=36\\cdot48$.'),
            prompt: L('Find the GCD and the LCM of 36 and 48.', 'Tentukan FPB dan KPK dari 36 dan 48.'),
            given: String.raw`\gcd(36,48)=g,\quad \operatorname{lcm}(36,48)=m`,
            blanks: [
              { label: 'g =', answer: 12 },
              { label: 'm =', answer: 144 },
            ],
          },
        },
      ],
    },

    /* -------------------------------------------------------------- remainders */
    {
      id: 'remainders',
      heading: L('What is division with remainder and modular arithmetic?', 'Apa itu pembagian bersisa dan aritmetika modular?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Dividing an integer $a$ by $b\neq0$ gives a unique quotient $q$ and remainder $r$ with $a=b\cdot q+r$ and $0\le r<|b|$; the remainder is written $a\bmod b$.** For example $17=5\cdot3+2$, so $17\bmod5=2$.

With a negative dividend the rule still holds, and the remainder stays between 0 and $|b|-1$: $-7=3\cdot(-3)+2$, so $-7\bmod3=2$, not $-1$. Think of a clock: 7 hours before 12 o'clock is 5 o'clock, and a day of 24 hours repeats after 24, which is the same as counting remainders.

**Modular arithmetic** works with remainders only. Two integers are **congruent modulo $n$**, written $a\equiv c\pmod n$, when $n$ divides $a-c$, that is, when they leave the same remainder: $17\equiv2\pmod5$. Remainders respect addition and multiplication, so you can reduce first and calculate afterwards:

- **Days of the week.** 100 days after a Monday: $100\bmod7=2$, so it is a Wednesday.
- **Last digits.** The last digit of $7^k$ repeats 7, 9, 3, 1. Since $2026\bmod4=2$, the last digit of $7^{2026}$ is the second in the cycle, 9.
- **Parity.** Even and odd are just $a\bmod2$.
- **Check digits and hashing.** Barcodes and card numbers carry a digit computed with $\bmod10$ to catch typing errors, and a hash table picks a slot with $\bmod$ the table size.

The catch is that **programming languages do not all agree on negative operands.** Each satisfies $a=b\cdot q+r$ but chooses $q$ differently: mathematics keeps $r\ge0$; Python rounds $q$ down, so $r$ takes the sign of the divisor; JavaScript, C, C++ and Java truncate $q$ toward zero, so $r$ takes the sign of the dividend. Compare them below.`,
            T`**Membagi bilangan bulat $a$ dengan $b\neq0$ menghasilkan hasil bagi $q$ dan sisa $r$ yang tunggal dengan $a=b\cdot q+r$ dan $0\le r<|b|$; sisanya ditulis $a\bmod b$.** Misalnya $17=5\cdot3+2$, sehingga $17\bmod5=2$.

Dengan bilangan yang dibagi negatif, aturan itu tetap berlaku, dan sisanya tetap antara 0 dan $|b|-1$: $-7=3\cdot(-3)+2$, sehingga $-7\bmod3=2$, bukan $-1$. Bayangkan jam: 7 jam sebelum pukul 12 adalah pukul 5, dan satu hari 24 jam berulang setelah 24, yang sama dengan menghitung sisa.

**Aritmetika modular** bekerja hanya dengan sisa. Dua bilangan bulat **kongruen modulo $n$**, ditulis $a\equiv c\pmod n$, bila $n$ membagi $a-c$, yaitu bila keduanya bersisa sama: $17\equiv2\pmod5$. Sisa mengikuti penjumlahan dan perkalian, sehingga kamu dapat menyederhanakan lebih dulu lalu menghitung:

- **Hari dalam seminggu.** 100 hari setelah hari Senin: $100\bmod7=2$, sehingga harinya Rabu.
- **Angka satuan.** Angka satuan $7^k$ berulang 7, 9, 3, 1. Karena $2026\bmod4=2$, angka satuan $7^{2026}$ adalah yang kedua dalam siklus, yaitu 9.
- **Paritas.** Genap dan ganjil tidak lain adalah $a\bmod2$.
- **Angka pemeriksa dan hashing.** Barcode dan nomor kartu memuat angka yang dihitung dengan $\bmod10$ untuk menangkap kesalahan ketik, dan tabel hash memilih slot dengan $\bmod$ ukuran tabel.

Masalahnya, **bahasa pemrograman tidak semuanya sepakat tentang operan negatif.** Masing-masing memenuhi $a=b\cdot q+r$ tetapi memilih $q$ secara berbeda: matematika menjaga $r\ge0$; Python membulatkan $q$ ke bawah, sehingga $r$ bertanda sama dengan pembagi; JavaScript, C, C++, dan Java memotong $q$ ke arah nol, sehingga $r$ bertanda sama dengan bilangan yang dibagi. Bandingkan di bawah.`,
          ),
        },
        { kind: 'widget', name: 'divmod' },
        {
          kind: 'activity',
          title: L('Try it: quotient and remainder', 'Coba: hasil bagi dan sisa'),
          step: {
            kind: 'math',
            id: 'a9',
            hints: [
              L('The remainder must be between 0 and 4, so $q$ is rounded down: $-17\\div5=-3.4$, so $q=-4$.', 'Sisa harus antara 0 dan 4, jadi $q$ dibulatkan ke bawah: $-17\\div5=-3{,}4$, jadi $q=-4$.'),
              L('$5\\cdot(-4)=-20$, and $-17-(-20)=3$.', '$5\\cdot(-4)=-20$, dan $-17-(-20)=3$.'),
            ],
            explain: L('$-17=5\\cdot(-4)+3$ with $0\\le3<5$, so $q=-4$ and $r=3$.', '$-17=5\\cdot(-4)+3$ dengan $0\\le3<5$, sehingga $q=-4$ dan $r=3$.'),
            prompt: L('Write $-17=5q+r$ with $0\\le r<5$.', 'Tulis $-17=5q+r$ dengan $0\\le r<5$.'),
            given: String.raw`-17=5q+r`,
            blanks: [
              { label: 'q =', answer: -4 },
              { label: 'r =', answer: 3 },
            ],
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'integers-in-code',
      heading: L('How do you work with integers in Python and JavaScript?', 'Bagaimana mengolah bilangan bulat di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Python integers have no size limit and use floor division, while JavaScript numbers are floating-point numbers (floats), exact only up to $2^{53}-1$, with a remainder that follows the dividend; use ´BigInt´ in JavaScript for large exact integers.** The two languages disagree exactly where this article has been pointing.`,
            T`**Bilangan bulat Python tidak punya batas ukuran dan memakai pembagian floor, sedangkan bilangan JavaScript berupa bilangan floating point (float), eksak hanya sampai $2^{53}-1$, dengan sisa yang mengikuti bilangan yang dibagi; pakai ´BigInt´ di JavaScript untuk bilangan bulat besar yang eksak.** Kedua bahasa itu berbeda tepat di tempat yang ditunjuk artikel ini.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> 7 // 2, -7 // 2          # floor division rounds down
(3, -4)
>>> 7 % 3, -7 % 3, 7 % -3        # the remainder takes the sign of the divisor
(1, 2, -2)
>>> divmod(-7, 3)                # quotient and remainder together
(-3, 2)
>>> int(-7 / 2)                  # / gives a float, int() truncates toward zero
-3
>>> import math
>>> math.gcd(48, 180), math.lcm(4, 6)
(12, 12)
>>> 2 ** 100                     # no overflow
1267650600228229401496703205376`,
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Euclid’s algorithm and factorisation in Python', 'Algoritma Euclid dan faktorisasi di Python'),
          code: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return abs(a)

def factorize(n):
    out, p = [], 2
    while p * p <= n:
        while n % p == 0:
            out.append(p)
            n //= p
        p += 1
    if n > 1:
        out.append(n)
    return out

gcd(48, 180)      # 12
factorize(360)    # [2, 2, 2, 3, 3, 5]`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `-7 % 3                          // -1   the remainder takes the sign of the dividend
((-7 % 3) + 3) % 3              // 2    the usual fix for a non-negative remainder
Math.trunc(-7 / 2)              // -3
Math.floor(-7 / 2)              // -4
Number.MAX_SAFE_INTEGER         // 9007199254740991
2 ** 53 + 1 === 2 ** 53         // true: beyond 2^53 integers lose exactness
2n ** 100n                      // 1267650600228229401496703205376n
-7n % 3n                        // -1n  BigInt behaves like Number here
7n / 2n                         // 3n   BigInt division truncates`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´-7 % 3´ in JavaScript | gives −1, not 2 | use ´((n % m) + m) % m´ when you need 0 to m − 1 |
| ´7 / 2´ | 3.5 in both languages; JavaScript has no integer division | use ´//´ in Python, ´Math.trunc´ or ´Math.floor´ in JavaScript |
| Python ´//´ with negatives | rounds down: ´-7 // 2´ is −4, not −3 | use ´int(-7 / 2)´ if you want truncation |
| Integers above 2⁵³ in JavaScript | silently inexact | use ´BigInt´ and the ´n´ suffix; do not mix it with ´Number´ |
| Fixed-size integers in C and Java | 2147483647 + 1 wraps to −2147483648 in Java, and is undefined in C | choose a wider type, or check before adding |
| Bitwise operators in JavaScript | ´1 << 32´ is 1: they work on 32 bits | avoid them for large values |
| ´0 % n´ and ´n % 0´ | 0 is fine; dividing by 0 raises an error in Python and gives ´NaN´ in JavaScript | check the divisor first |

Python's ´math.gcd´ and ´math.lcm´ (from Python 3.9) take any size of integer, so you rarely need your own, but writing Euclid's loop once is the best way to see why it ends.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´-7 % 3´ di JavaScript | hasilnya −1, bukan 2 | pakai ´((n % m) + m) % m´ bila perlu 0 sampai m − 1 |
| ´7 / 2´ | 3,5 di kedua bahasa; JavaScript tidak punya pembagian bulat | pakai ´//´ di Python, ´Math.trunc´ atau ´Math.floor´ di JavaScript |
| Python ´//´ dengan negatif | membulat ke bawah: ´-7 // 2´ adalah −4, bukan −3 | pakai ´int(-7 / 2)´ bila ingin pemotongan |
| Bilangan di atas 2⁵³ di JavaScript | diam-diam tidak eksak | pakai ´BigInt´ dan akhiran ´n´; jangan campur dengan ´Number´ |
| Bilangan berukuran tetap di C dan Java | 2147483647 + 1 berputar menjadi −2147483648 di Java, dan tidak terdefinisi di C | pilih tipe yang lebih lebar, atau periksa sebelum menambah |
| Operator bitwise di JavaScript | ´1 << 32´ bernilai 1: operator itu bekerja pada 32 bit | hindari untuk nilai besar |
| ´0 % n´ dan ´n % 0´ | 0 tidak masalah; membagi dengan 0 menimbulkan galat di Python dan memberi ´NaN´ di JavaScript | periksa pembaginya lebih dulu |

´math.gcd´ dan ´math.lcm´ Python (sejak Python ´3.9´) menerima bilangan bulat sebesar apa pun, sehingga jarang perlu membuat sendiri, tetapi menulis perulangan Euclid sekali adalah cara terbaik melihat mengapa ia berhenti.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with integers?', 'Apa kesalahan umum pada bilangan bulat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with integers are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| $-3^2=9$ | $-3^2=-(3\cdot3)=-9$. Only $(-3)^2=9$. |
| $5-(-3)=2$ | $5-(-3)=5+3=8$. Subtracting a negative adds. |
| $-5-3=-2$ | $-5-3=-5+(-3)=-8$. |
| $(-2)(-3)=-6$ | Same signs give a positive: $6$. |
| $-7>-3$ because $7>3$ | The order reverses for negatives: $-7<-3$. |
| 0 is a positive integer | 0 is neither positive nor negative. |
| 1 is a prime number | 1 has one divisor; the primes start at 2. |
| $5\div0=0$ | Division by zero is undefined. |
| $\operatorname{lcm}$ and $\gcd$ swapped | GCD divides both numbers and is the smaller; the LCM is a multiple of both and is the larger: $\gcd(12,18)=6$, $\operatorname{lcm}=36$. |`,
            T`**Kesalahan paling umum pada bilangan bulat adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| $-3^2=9$ | $-3^2=-(3\cdot3)=-9$. Hanya $(-3)^2=9$. |
| $5-(-3)=2$ | $5-(-3)=5+3=8$. Mengurangi bilangan negatif berarti menambah. |
| $-5-3=-2$ | $-5-3=-5+(-3)=-8$. |
| $(-2)(-3)=-6$ | Tanda sama menghasilkan positif: $6$. |
| $-7>-3$ karena $7>3$ | Urutannya berbalik untuk bilangan negatif: $-7<-3$. |
| 0 adalah bilangan bulat positif | 0 bukan positif dan bukan negatif. |
| 1 adalah bilangan prima | 1 hanya punya satu pembagi; bilangan prima dimulai dari 2. |
| $5\div0=0$ | Pembagian dengan nol tidak terdefinisi. |
| $\operatorname{lcm}$ dan $\gcd$ tertukar | FPB membagi kedua bilangan dan lebih kecil; KPK adalah kelipatan keduanya dan lebih besar: $\gcd(12,18)=6$, $\operatorname{lcm}=36$. |`,
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
              L('The sum of two negative integers is negative.', 'Jumlah dua bilangan bulat negatif adalah negatif.'),
              L('$-7>-3$.', '$-7>-3$.'),
              L('0 is a positive integer.', '0 adalah bilangan bulat positif.'),
              L('$(-4)\\times(-5)=20$.', '$(-4)\\times(-5)=20$.'),
              L('1 is a prime number.', '1 adalah bilangan prima.'),
            ],
            answer: [true, false, false, true, false],
            explain: L(
              'A sum of two negatives has the same sign: negative. $-7<-3$. 0 is neither positive nor negative. Same signs give a positive product. 1 has only one divisor, so it is not prime.',
              'Jumlah dua bilangan negatif bertanda sama: negatif. $-7<-3$. 0 bukan positif dan bukan negatif. Tanda sama menghasilkan hasil kali positif. 1 hanya punya satu pembagi, sehingga bukan prima.',
            ),
            hint: L('Place the numbers on the number line, and recall what the definition of prime needs.', 'Letakkan bilangan-bilangannya pada garis bilangan, dan ingat apa yang disyaratkan definisi prima.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the numbers divisible by both 3 and 4.', 'Pilih **semua** bilangan yang habis dibagi 3 dan 4 sekaligus.'),
            options: [L('$24$', '$24$'), L('$18$', '$18$'), L('$36$', '$36$'), L('$100$', '$100$'), L('$72$', '$72$')],
            answer: [0, 2, 4],
            explain: L(
              '$24$, $36$ and $72$ are multiples of 12, so both 3 and 4 divide them. $18$ is not divisible by 4 and $100$ has digit sum 1, so 3 does not divide it.',
              '$24$, $36$, dan $72$ kelipatan 12, sehingga 3 dan 4 sama-sama membaginya. $18$ tidak habis dibagi 4 dan $100$ berjumlah angka 1, sehingga 3 tidak membaginya.',
            ),
            hint: L('Use the digit sum for 3 and the last two digits for 4.', 'Pakai jumlah angka untuk 3 dan dua angka terakhir untuk 4.'),
          },
        },
        {
          kind: 'activity',
          title: L('Add and subtract', 'Jumlah dan selisih'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('Subtracting $-5$ is adding $5$: $-8+5+2$.', 'Mengurangi $-5$ sama dengan menambah $5$: $-8+5+2$.'),
              L('$-8+5=-3$, then $-3+2$.', '$-8+5=-3$, lalu $-3+2$.'),
            ],
            explain: L('$-8-(-5)+2=-8+5+2=-1$.', '$-8-(-5)+2=-8+5+2=-1$.'),
            prompt: L('Evaluate.', 'Hitunglah.'),
            given: String.raw`-8-(-5)+2=v`,
            blanks: [{ label: 'v =', answer: -1 }],
          },
        },
        {
          kind: 'activity',
          title: L('A greatest common divisor', 'Faktor persekutuan terbesar'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('$84=2^2\\cdot3\\cdot7$ and $126=2\\cdot3^2\\cdot7$.', '$84=2^2\\cdot3\\cdot7$ dan $126=2\\cdot3^2\\cdot7$.'),
              L('Smaller exponents: $2\\cdot3\\cdot7$.', 'Eksponen terkecil: $2\\cdot3\\cdot7$.'),
            ],
            explain: L('$\\gcd=2\\cdot3\\cdot7=42$. By Euclid: $126=1\\cdot84+42$ and $84=2\\cdot42+0$.', '$\\gcd=2\\cdot3\\cdot7=42$. Dengan Euclid: $126=1\\cdot84+42$ dan $84=2\\cdot42+0$.'),
            prompt: L('Find the GCD of 84 and 126.', 'Tentukan FPB dari 84 dan 126.'),
            given: String.raw`\gcd(84,126)=g`,
            blanks: [{ label: 'g =', answer: 42 }],
          },
        },
        {
          kind: 'activity',
          title: L('A remainder in JavaScript', 'Sisa di JavaScript'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('What does the JavaScript expression ´-17 % 5´ give?', 'Apa hasil ekspresi JavaScript ´-17 % 5´?'),
            options: [L('$3$', '$3$'), L('$-2$', '$-2$'), L('$2$', '$2$'), L('$-3$', '$-3$')],
            answer: 1,
            explain: L(
              'JavaScript truncates the quotient toward zero: $-17\\div5\\to-3$, and $-17-5\\cdot(-3)=-2$. The remainder takes the sign of the dividend. Python would give 3.',
              'JavaScript memotong hasil bagi ke arah nol: $-17\\div5\\to-3$, dan $-17-5\\cdot(-3)=-2$. Sisanya bertanda sama dengan bilangan yang dibagi. Python akan memberi 3.',
            ),
            hint: L('Round $-17\\div5=-3.4$ toward zero, then find what is left.', 'Bulatkan $-17\\div5=-3{,}4$ ke arah nol, lalu cari sisanya.'),
          },
        },
        {
          kind: 'activity',
          title: L('A diver', 'Seorang penyelam'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('A diver is at $-12$ m and swims up 5 m. Where is the diver now?', 'Seorang penyelam berada di $-12$ m lalu berenang naik 5 m. Di mana penyelam itu sekarang?'),
            options: [L('$-7$ m', '$-7$ m'), L('$-17$ m', '$-17$ m'), L('$7$ m', '$7$ m'), L('$17$ m', '$17$ m')],
            answer: 0,
            explain: L(
              'Going up is moving right on the line: $-12+5=-7$. The diver is still 7 m below the surface.',
              'Naik berarti bergeser ke kanan pada garis: $-12+5=-7$. Penyelam masih 7 m di bawah permukaan.',
            ),
            hint: L('Up means adding: which direction does that move on the number line?', 'Naik berarti menambah: ke arah mana itu bergerak pada garis bilangan?'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: integers at a glance', 'Ringkasan: bilangan bulat sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Integers:** $\ldots,-2,-1,0,1,2,\ldots$; zero is neither positive nor negative; every $a$ has an opposite $-a$.
- **Order and size:** further right is greater, so $-7<-3$; $|a|$ is the distance from 0.
- **Adding and subtracting:** same signs add and keep the sign; different signs subtract and keep the sign of the larger; $a-b=a+(-b)$.
- **Multiplying and dividing:** same signs give positive, different signs give negative; never divide by 0.
- **Order of operations:** brackets, powers, then ×÷, then +− left to right; $-3^2=-9$ but $(-3)^2=9$.
- **Divisibility:** digit rules for 2, 3, 4, 5, 6, 8, 9, 10, 11; every integer above 1 has one prime factorisation.
- **GCD and LCM:** smaller or larger prime exponents, or Euclid's algorithm; $\gcd\cdot\operatorname{lcm}=a\cdot b$.
- **Remainders:** $a=bq+r$ with $0\le r<|b|$; Python, JavaScript and mathematics differ for negatives.`,
            T`- **Bilangan bulat:** $\ldots,-2,-1,0,1,2,\ldots$; nol bukan positif dan bukan negatif; setiap $a$ punya lawan $-a$.
- **Urutan dan ukuran:** makin ke kanan makin besar, sehingga $-7<-3$; $|a|$ adalah jarak dari 0.
- **Menjumlah dan mengurang:** tanda sama dijumlahkan dan tandanya dipertahankan; tanda berbeda dikurangkan dan mengikuti tanda yang lebih besar; $a-b=a+(-b)$.
- **Mengalikan dan membagi:** tanda sama menghasilkan positif, tanda berbeda menghasilkan negatif; jangan pernah membagi dengan 0.
- **Urutan operasi:** kurung, pangkat, lalu ×÷, lalu +− dari kiri ke kanan; $-3^2=-9$ tetapi $(-3)^2=9$.
- **Habis dibagi:** aturan angka untuk 2, 3, 4, 5, 6, 8, 9, 10, 11; setiap bilangan bulat di atas 1 punya satu faktorisasi prima.
- **FPB dan KPK:** eksponen prima terkecil atau terbesar, atau algoritma Euclid; $\gcd\cdot\operatorname{lcm}=a\cdot b$.
- **Sisa:** $a=bq+r$ dengan $0\le r<|b|$; Python, JavaScript, dan matematika berbeda untuk bilangan negatif.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Integer', 'Bilangan bulat'), definition: L('A number in the set ℤ, with no fractional part: zero, the positive whole numbers and their negatives.', 'Bilangan dalam himpunan ℤ, tanpa bagian pecahan: nol, bilangan bulat positif, dan negatifnya.') },
    { term: L('Opposite', 'Lawan (bilangan berlawanan)'), definition: L('The number on the other side of zero at the same distance, so that a number plus its opposite is zero.', 'Bilangan di seberang nol pada jarak yang sama, sehingga sebuah bilangan ditambah lawannya sama dengan nol.') },
    { term: L('Absolute value', 'Nilai mutlak'), definition: L('The distance of a number from zero, which is never negative, so the absolute value of minus 7 is 7.', 'Jarak sebuah bilangan dari nol yang tidak pernah negatif, sehingga nilai mutlak minus 7 adalah 7.') },
    { term: L('Closed under an operation', 'Tertutup terhadap suatu operasi'), definition: L('A set is closed under an operation when applying it to members of the set always gives a member; the integers are closed under addition, subtraction and multiplication.', 'Sebuah himpunan tertutup terhadap suatu operasi bila menerapkannya pada anggota himpunan selalu memberi anggota; bilangan bulat tertutup terhadap penjumlahan, pengurangan, dan perkalian.') },
    { term: L('Divisor (factor)', 'Pembagi (faktor)'), definition: L('An integer b is a divisor of a when a equals b times some integer, so that division leaves no remainder.', 'Bilangan bulat b adalah pembagi a bila a sama dengan b kali suatu bilangan bulat, sehingga pembagian tidak menyisakan sisa.') },
    { term: L('Multiple', 'Kelipatan'), definition: L('The product of a number and any integer, such as 12, 24 and 36 for the number 12.', 'Hasil kali sebuah bilangan dengan bilangan bulat mana pun, seperti 12, 24, dan 36 untuk bilangan 12.') },
    { term: L('Prime number', 'Bilangan prima'), definition: L('An integer greater than 1 whose only positive divisors are 1 and itself.', 'Bilangan bulat lebih dari 1 yang satu-satunya pembagi positifnya adalah 1 dan dirinya sendiri.') },
    { term: L('Composite number', 'Bilangan komposit'), definition: L('An integer greater than 1 that is not prime, so it has a divisor other than 1 and itself.', 'Bilangan bulat lebih dari 1 yang bukan prima, sehingga punya pembagi selain 1 dan dirinya sendiri.') },
    { term: L('Prime factorisation', 'Faktorisasi prima'), definition: L('The unique way of writing an integer greater than 1 as a product of primes, such as 360 equal to 2 cubed times 3 squared times 5.', 'Cara tunggal menulis bilangan bulat lebih dari 1 sebagai hasil kali bilangan prima, seperti 360 sama dengan 2 pangkat tiga kali 3 kuadrat kali 5.') },
    { term: L('Greatest common divisor (GCD)', 'Faktor persekutuan terbesar (FPB)'), definition: L('The largest integer that divides both of two given integers; for 48 and 180 it is 12.', 'Bilangan bulat terbesar yang membagi dua bilangan bulat yang diberikan; untuk 48 dan 180 nilainya 12.') },
    { term: L('Least common multiple (LCM)', 'Kelipatan persekutuan terkecil (KPK)'), definition: L('The smallest positive integer that is a multiple of both of two given integers; for 12 and 18 it is 36.', 'Bilangan bulat positif terkecil yang merupakan kelipatan dua bilangan bulat yang diberikan; untuk 12 dan 18 nilainya 36.') },
    { term: L('Coprime', 'Saling prima'), definition: L('Two integers whose greatest common divisor is 1, such as 8 and 15.', 'Dua bilangan bulat yang faktor persekutuan terbesarnya 1, seperti 8 dan 15.') },
    { term: L('Remainder', 'Sisa pembagian'), definition: L('What is left after dividing: in a equal to b times q plus r, the number r, which lies from 0 up to the size of b minus 1.', 'Yang tersisa setelah membagi: dalam a sama dengan b kali q ditambah r, bilangan r, yang terletak dari 0 sampai ukuran b dikurangi 1.') },
    { term: L('Modulo', 'Modulo'), definition: L('The operation that gives the remainder of a division, so that 17 modulo 5 is 2.', 'Operasi yang memberi sisa suatu pembagian, sehingga 17 modulo 5 adalah 2.') },
  ],

  howTo: [
    {
      name: L('How to add and subtract integers', 'Cara menjumlahkan dan mengurangkan bilangan bulat'),
      description: L('Turn every subtraction into an addition, then add by the signs.', 'Ubah setiap pengurangan menjadi penjumlahan, lalu jumlahkan menurut tandanya.'),
      steps: [
        { name: L('Rewrite subtraction', 'Tulis ulang pengurangan'), text: L('Replace subtracting b by adding the opposite of b, so 5 minus minus 3 becomes 5 plus 3.', 'Ganti mengurangi b dengan menambah lawan b, sehingga 5 dikurangi minus 3 menjadi 5 ditambah 3.') },
        { name: L('Compare the signs', 'Bandingkan tandanya'), text: L('If the two numbers have the same sign, add their sizes and keep that sign.', 'Jika kedua bilangan bertanda sama, jumlahkan ukurannya dan pertahankan tanda itu.') },
        { name: L('Handle different signs', 'Tangani tanda berbeda'), text: L('If the signs differ, subtract the smaller size from the larger and keep the sign of the larger.', 'Jika tandanya berbeda, kurangkan ukuran yang kecil dari yang besar dan pertahankan tanda yang besar.') },
        { name: L('Check on the number line', 'Periksa di garis bilangan'), text: L('Start at the first number and move right for a positive and left for a negative, and confirm where you land.', 'Mulai dari bilangan pertama dan bergeser ke kanan untuk yang positif dan ke kiri untuk yang negatif, lalu pastikan tempat kamu mendarat.') },
      ],
    },
    {
      name: L('How to find the prime factorisation of a number', 'Cara mencari faktorisasi prima suatu bilangan'),
      description: L('Divide repeatedly by the smallest prime that goes in until nothing is left.', 'Bagi berulang kali dengan bilangan prima terkecil yang membagi sampai tidak ada yang tersisa.'),
      steps: [
        { name: L('Divide by the smallest prime', 'Bagi dengan prima terkecil'), text: L('Divide the number by 2 while it divides evenly, then by 3, then 5, and so on through the primes.', 'Bagi bilangan itu dengan 2 selama habis dibagi, lalu dengan 3, lalu 5, dan seterusnya melalui bilangan prima.') },
        { name: L('Record each prime', 'Catat tiap bilangan prima'), text: L('Write down each prime every time it divides, for example 360 gives 2, 2, 2, 3, 3 and 5.', 'Tulis tiap bilangan prima setiap kali ia membagi, misalnya 360 menghasilkan 2, 2, 2, 3, 3, dan 5.') },
        { name: L('Stop at one', 'Berhenti di satu'), text: L('Stop when the quotient is 1, or when the prime you try is larger than the square root of what is left, in which case what is left is prime.', 'Berhenti saat hasil bagi 1, atau saat bilangan prima yang dicoba lebih besar dari akar kuadrat sisanya, yang berarti sisanya prima.') },
        { name: L('Write with exponents', 'Tulis dengan eksponen'), text: L('Group equal primes with exponents: 360 is 2 cubed times 3 squared times 5.', 'Kelompokkan bilangan prima yang sama dengan eksponen: 360 adalah 2 pangkat tiga kali 3 kuadrat kali 5.') },
      ],
    },
    {
      name: L('How to find the GCD with Euclid’s algorithm', 'Cara mencari FPB dengan algoritma Euclid'),
      description: L('Repeat division with remainder until the remainder is zero.', 'Ulangi pembagian bersisa sampai sisanya nol.'),
      steps: [
        { name: L('Divide the larger by the smaller', 'Bagi yang besar dengan yang kecil'), text: L('Divide the larger number by the smaller and find the remainder, for example 180 divided by 48 leaves 36.', 'Bagi bilangan yang besar dengan yang kecil dan cari sisanya, misalnya 180 dibagi 48 bersisa 36.') },
        { name: L('Shift and repeat', 'Geser dan ulangi'), text: L('Replace the pair by the smaller number and the remainder, and divide again: 48 divided by 36 leaves 12.', 'Ganti pasangan itu dengan bilangan yang kecil dan sisanya, lalu bagi lagi: 48 dibagi 36 bersisa 12.') },
        { name: L('Stop at remainder zero', 'Berhenti saat sisa nol'), text: L('Continue until the remainder is 0: 36 divided by 12 leaves 0.', 'Lanjutkan sampai sisanya 0: 36 dibagi 12 bersisa 0.') },
        { name: L('Read the answer', 'Baca jawabannya'), text: L('The last non-zero remainder is the GCD, here 12.', 'Sisa terakhir yang bukan nol adalah FPB, di sini 12.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an integer?', 'Apa itu bilangan bulat?'),
      a: L(
        'An integer is a number with no fractional part: zero, the positive whole numbers 1, 2, 3 and so on, and their negatives minus 1, minus 2, minus 3 and so on. The set of integers is written with the letter Z.',
        'Bilangan bulat adalah bilangan tanpa bagian pecahan: nol, bilangan utuh positif 1, 2, 3 dan seterusnya, serta negatifnya minus 1, minus 2, minus 3 dan seterusnya. Himpunan bilangan bulat ditulis dengan huruf Z.',
      ),
    },
    {
      q: L('Is zero a positive or a negative integer?', 'Apakah nol bilangan bulat positif atau negatif?'),
      a: L(
        'Zero is neither positive nor negative. It is an integer, it is even, and it is the dividing point on the number line between the negative integers on the left and the positive integers on the right.',
        'Nol bukan positif dan bukan negatif. Ia adalah bilangan bulat, ia genap, dan ia menjadi titik pemisah pada garis bilangan antara bilangan bulat negatif di kiri dan bilangan bulat positif di kanan.',
      ),
    },
    {
      q: L('What is the difference between natural numbers, whole numbers and integers?', 'Apa beda bilangan asli, bilangan cacah, dan bilangan bulat?'),
      a: L(
        'Natural numbers are 1, 2, 3 and so on. Whole numbers add zero. Integers add the negative numbers as well. So every natural number is a whole number, and every whole number is an integer, but not the other way round.',
        'Bilangan asli adalah 1, 2, 3 dan seterusnya. Bilangan cacah menambahkan nol. Bilangan bulat menambahkan pula bilangan negatif. Jadi setiap bilangan asli adalah bilangan cacah, dan setiap bilangan cacah adalah bilangan bulat, tetapi tidak sebaliknya.',
      ),
    },
    {
      q: L('Why is a negative times a negative positive?', 'Mengapa negatif kali negatif hasilnya positif?'),
      a: L(
        'Because the distributive law forces it. Since minus 1 times the sum of 1 and minus 1 is zero, minus 1 plus minus 1 times minus 1 must be zero, so minus 1 times minus 1 has to be 1. Any other value would break ordinary arithmetic.',
        'Karena sifat distributif memaksanya. Karena minus 1 kali jumlah 1 dan minus 1 adalah nol, maka minus 1 ditambah minus 1 kali minus 1 harus nol, sehingga minus 1 kali minus 1 harus 1. Nilai lain akan merusak aritmetika biasa.',
      ),
    },
    {
      q: L('How do you subtract a negative number?', 'Bagaimana mengurangkan bilangan negatif?'),
      a: L(
        'Subtracting a negative number is the same as adding its opposite. So 5 minus minus 3 is 5 plus 3, which is 8. On the number line you move to the right, just as taking away a debt leaves you better off.',
        'Mengurangkan bilangan negatif sama dengan menambahkan lawannya. Jadi 5 dikurangi minus 3 adalah 5 ditambah 3, yaitu 8. Pada garis bilangan kamu bergeser ke kanan, seperti menghapus utang membuatmu lebih baik.',
      ),
    },
    {
      q: L('What is absolute value?', 'Apa itu nilai mutlak?'),
      a: L(
        'The absolute value of a number is its distance from zero on the number line, so it is never negative. The absolute value of 7 and of minus 7 is 7, and the absolute value of zero is zero. It is written with two vertical bars.',
        'Nilai mutlak sebuah bilangan adalah jaraknya dari nol pada garis bilangan, sehingga tidak pernah negatif. Nilai mutlak 7 dan minus 7 adalah 7, dan nilai mutlak nol adalah nol. Ditulis dengan dua garis tegak.',
      ),
    },
    {
      q: L('Why can you not divide by zero?', 'Mengapa tidak boleh membagi dengan nol?'),
      a: L(
        'Dividing a by zero would need a number c with 0 times c equal to a. Zero times anything is zero, so this is impossible when a is not zero, and when a is zero every c would work. Either way there is no single answer.',
        'Membagi a dengan nol memerlukan bilangan c dengan 0 kali c sama dengan a. Nol kali apa pun adalah nol, sehingga ini mustahil bila a bukan nol, dan bila a nol maka setiap c berlaku. Bagaimanapun tidak ada satu jawaban.',
      ),
    },
    {
      q: L('How do you know if a number is divisible by 3 or 9?', 'Bagaimana mengetahui bilangan habis dibagi 3 atau 9?'),
      a: L(
        'Add up its digits. If the digit sum is divisible by 3, so is the number, and if the digit sum is divisible by 9, so is the number. For example 522 has digit sum 9, so it is divisible by both 3 and 9.',
        'Jumlahkan angka-angkanya. Jika jumlah angkanya habis dibagi 3, bilangannya juga, dan jika jumlah angkanya habis dibagi 9, bilangannya juga. Misalnya 522 berjumlah angka 9, sehingga habis dibagi 3 maupun 9.',
      ),
    },
    {
      q: L('Is 1 a prime number?', 'Apakah 1 bilangan prima?'),
      a: L(
        'No. A prime has exactly two positive divisors, 1 and itself, while 1 has only one divisor. Excluding it keeps prime factorisation unique, because otherwise 6 could be written as 2 times 3 and also as 1 times 2 times 3. The first prime is 2.',
        'Bukan. Bilangan prima punya tepat dua pembagi positif, 1 dan dirinya sendiri, sedangkan 1 hanya punya satu pembagi. Mengecualikannya menjaga faktorisasi prima tetap tunggal, sebab jika tidak 6 dapat ditulis 2 kali 3 dan juga 1 kali 2 kali 3. Prima pertama adalah 2.',
      ),
    },
    {
      q: L('How do you check whether a number is prime?', 'Bagaimana memeriksa apakah suatu bilangan prima?'),
      a: L(
        'Try dividing it by the primes up to its square root. If none divides it, it is prime. You can stop at the square root because any larger factor would pair with a smaller one you already tried. So 97 is prime, while 91 equals 7 times 13.',
        'Coba bagi dengan bilangan prima sampai akar kuadratnya. Jika tidak ada yang membaginya, ia prima. Kamu boleh berhenti di akar kuadrat karena faktor yang lebih besar akan berpasangan dengan yang lebih kecil yang sudah dicoba. Jadi 97 prima, sedangkan 91 sama dengan 7 kali 13.',
      ),
    },
    {
      q: L('How do you find the GCD of two numbers?', 'Bagaimana mencari FPB dua bilangan?'),
      a: L(
        'Either take each shared prime factor with its smaller exponent, or use Euclid’s algorithm: divide the larger number by the smaller, replace the pair by the smaller number and the remainder, and repeat. The last non-zero remainder is the GCD.',
        'Ambil tiap faktor prima bersama dengan eksponen yang lebih kecil, atau pakai algoritma Euclid: bagi bilangan yang besar dengan yang kecil, ganti pasangan itu dengan bilangan yang kecil dan sisanya, lalu ulangi. Sisa terakhir yang bukan nol adalah FPB.',
      ),
    },
    {
      q: L('What is the difference between GCD and LCM?', 'Apa beda FPB dan KPK?'),
      a: L(
        'The GCD is the largest number that divides both numbers, so it is never larger than either. The LCM is the smallest number that both divide, so it is never smaller than either. Their product equals the product of the two numbers.',
        'FPB adalah bilangan terbesar yang membagi kedua bilangan, sehingga tidak pernah lebih besar dari keduanya. KPK adalah bilangan terkecil yang habis dibagi keduanya, sehingga tidak pernah lebih kecil dari keduanya. Hasil kali keduanya sama dengan hasil kali kedua bilangan.',
      ),
    },
    {
      q: L('What is the remainder when a negative number is divided?', 'Berapa sisa bila bilangan negatif dibagi?'),
      a: L(
        'In mathematics the remainder is never negative, so minus 7 divided by 3 leaves 2, because minus 7 is 3 times minus 3 plus 2. Python agrees, but JavaScript, C and Java return minus 1, because they cut the quotient toward zero.',
        'Dalam matematika sisa tidak pernah negatif, sehingga minus 7 dibagi 3 bersisa 2, karena minus 7 adalah 3 kali minus 3 ditambah 2. Python sependapat, tetapi JavaScript, C, dan Java mengembalikan minus 1, karena memotong hasil bagi ke arah nol.',
      ),
    },
    {
      q: L('How do you do integer division in Python?', 'Bagaimana melakukan pembagian bulat di Python?'),
      a: L(
        'Use the double slash operator, which rounds down, so 7 // 2 is 3 and minus 7 // 2 is minus 4. A single slash always gives a float. The percent sign gives the remainder, and divmod returns the quotient and the remainder together.',
        'Pakai operator garis miring ganda, yang membulatkan ke bawah, sehingga 7 // 2 adalah 3 dan minus 7 // 2 adalah minus 4. Garis miring tunggal selalu memberi float. Tanda persen memberi sisa, dan divmod mengembalikan hasil bagi dan sisa sekaligus.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Elements, Book VII (the Euclidean algorithm) and Book IX, proposition 20 (there are infinitely many primes)', author: 'Euclid', source: 'c. 300 BCE' },
    { title: 'Brahmasphutasiddhanta (rules for arithmetic with zero, debts and fortunes)', author: 'Brahmagupta', year: 628 },
    { title: 'Disquisitiones Arithmeticae', author: 'Carl Friedrich Gauss', year: 1801 },
    { title: 'Concrete Mathematics: A Foundation for Computer Science (2nd ed.), chapter 3 (floor, ceiling and mod)', author: 'Ronald Graham, Donald Knuth and Oren Patashnik', year: 1994, source: 'Addison-Wesley' },
    { title: 'The Nine Chapters on the Mathematical Art: Companion and Commentary', author: 'Shen Kangshen, John Crossley and Anthony Lun', year: 1999, source: 'Oxford University Press' },
    { title: 'The Python Language Reference: binary arithmetic operations (floor division and modulo)', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations' },
    { title: 'ECMAScript Language Specification: multiplicative operators (the remainder operator)', author: 'Ecma International', source: 'tc39.es', url: 'https://tc39.es/ecma262/#sec-multiplicative-operators' },
  ],

  related: ['real-numbers', 'algebraic-expressions', 'chinese-numbers'],
}
