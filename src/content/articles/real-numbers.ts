import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './real-numbers.meta'
import { numberLine, shape } from '../tka-sd-matematika/figs'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped (so `\frac` stays
 *  `\frac`), which is why the code marker inside it is ´ rather than a backtick:
 *  `´0.1 + 0.2´` becomes inline code. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    // The lesson formatter has no italics; `*word*` becomes plain `word`.
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

export const body: ArticleBody = {
  answer: L(
    T`**Real numbers** are all the numbers that sit on the number line. They are the numbers we use every day — integers, fractions, and decimals that terminate or eventually repeat periodically, all called *rational* numbers — together with numbers such as $\sqrt{2}$ and $\pi$ that no fraction can equal, called *irrational* numbers. The set of real numbers is written $\mathbb{R}$. A real number is rational when its decimal expansion terminates or eventually repeats periodically, and irrational when its decimal expansion is infinite and never periodic.`,
    T`**Bilangan real** adalah semua bilangan yang terletak pada garis bilangan. Bilangan real mencakup bilangan yang digunakan sehari-hari, seperti bilangan bulat, pecahan, dan desimal yang berakhir atau akhirnya berulang secara periodik, yang semuanya disebut bilangan *rasional* — serta bilangan seperti $\sqrt{2}$ dan $\pi$ yang tidak dapat dinyatakan sebagai pecahan dua bilangan bulat, yang disebut bilangan *irasional*. Himpunan bilangan real ditulis $\mathbb{R}$. Sebuah bilangan real itu rasional jika ekspansi desimalnya berakhir atau akhirnya berulang secara periodik, dan irasional jika ekspansi desimalnya tak berhingga dan tidak pernah periodik.`,
  ),

  keyPoints: [
    L(
      T`Every point on the number line is a real number, and every real number is a point: $\mathbb{R}$ is the number line.`,
      T`Setiap titik pada garis bilangan adalah bilangan real, dan setiap bilangan real adalah sebuah titik: $\mathbb{R}$ adalah garis bilangan itu sendiri.`,
    ),
    L(
      T`The number sets nest: $\mathbb{N}\subset W\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}$, and the irrational numbers are the real numbers outside $\mathbb{Q}$.`,
      T`Himpunan bilangan bersarang: $\mathbb{N}\subset W\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}$, dan bilangan irasional adalah bilangan real di luar $\mathbb{Q}$.`,
    ),
    L(
      T`A fraction in lowest terms has a terminating decimal expansion exactly when its denominator has no prime factor other than 2 and 5. Otherwise the expansion eventually repeats periodically.`,
      T`Pecahan paling sederhana punya ekspansi desimal yang berakhir tepat ketika penyebutnya tidak punya faktor prima selain 2 dan 5. Jika tidak, ekspansinya akhirnya berulang secara periodik.`,
    ),
    L(
      T`$\sqrt{2}$ is irrational, and the proof is short. So are $\pi$ and $e$, and for a positive integer $n$, $\sqrt{n}$ is irrational exactly when $n$ is not a perfect square.`,
      T`$\sqrt{2}$ itu irasional, dan buktinya singkat. Begitu juga $\pi$ dan $e$, dan untuk bilangan bulat positif $n$, $\sqrt{n}$ irasional tepat ketika $n$ bukan kuadrat sempurna.`,
    ),
    L(
      T`Between any two real numbers there are infinitely many rational and infinitely many irrational numbers, yet the rationals alone leave gaps that the real numbers fill.`,
      T`Di antara dua bilangan real mana pun ada tak berhingga banyak bilangan rasional dan tak berhingga banyak bilangan irasional, tetapi bilangan rasional saja meninggalkan celah yang diisi oleh bilangan real.`,
    ),
    L(
      T`A computer keeps only a finite binary approximation of a real number, which is why ´0.1 + 0.2 == 0.3´ is False in Python and JavaScript. Compare with a tolerance.`,
      T`Komputer hanya menyimpan hampiran biner yang berhingga dari sebuah bilangan real, itulah sebabnya ´0.1 + 0.2 == 0.3´ bernilai False di Python dan JavaScript. Bandingkan dengan toleransi.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what are they */
    {
      id: 'what-are-real-numbers',
      heading: L('What is a real number?', 'Apa itu bilangan real?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`A **real number** is any number that can be placed on the number line. Equivalently, it is any number that has a decimal expansion: one that terminates, one that eventually repeats periodically, or one that is infinite and never periodic: $3$, $-0.5$, $\frac{1}{3}=0.333\ldots$ and $\sqrt{2}=1.41421\ldots$ are all real numbers. The set of all real numbers is written $\mathbb{R}$.

Every time you measure something — the length of a table, the temperature at noon, the time a race took — the answer is a real number.

Another way to say the same thing is geometric. Draw a straight line, mark a point for 0 and another for 1, and every point on the line stands for exactly one real number. The line is the **number line**. Intuitively it has no gaps; that property is called **completeness**, and the section on the number line below says exactly what it means.

Real numbers are the numbers used in measurement, in calculus, in physics, and in almost every program that does arithmetic. Knowing how they are organised — which are fractions, which are not, and how a computer stores them — prevents a long list of mistakes, from a wrong exam answer to a wrong bank balance.

**A note on notation.** In this article the natural numbers $\mathbb{N}$ are $1,2,3,\ldots$ and the whole numbers $W$ are $0,1,2,3,\ldots$. Some books count 0 as a natural number, so check the convention when you read elsewhere. The word *integer* always means a number in $\mathbb{Z}$, and *decimal expansion* means the full list of digits of a number, however long.

**Real numbers at a glance**

| Fact | Detail |
|---|---|
| Symbol | $\mathbb{R}$ |
| What it contains | all rational and all irrational numbers |
| Decimal expansion | terminates, eventually repeats periodically, or is infinite and never periodic |
| Operations | closed under addition, subtraction, multiplication and division (never by 0) |
| Size | uncountably infinite (Cantor, 1874) |
| Built rigorously by | Dedekind and Cantor, both in 1872 |
| Not real numbers | $\infty$, and $\sqrt{-1}$ (a complex number) |`,
            T`**Bilangan real** adalah bilangan apa pun yang dapat diletakkan pada garis bilangan. Dengan kata lain, setiap bilangan real punya ekspansi desimal: yang berakhir, yang akhirnya berulang secara periodik, atau yang tak berhingga dan tidak pernah periodik: $3$, $-0{,}5$, $\frac{1}{3}=0{,}333\ldots$ dan $\sqrt{2}=1{,}41421\ldots$ semuanya bilangan real. Himpunan semua bilangan real ditulis $\mathbb{R}$.

Setiap kali kamu mengukur sesuatu — panjang meja, suhu siang hari, waktu yang dipakai dalam lomba lari — hasil pengukuran tersebut dapat dinyatakan dengan bilangan real.

Cara lain mengatakannya bersifat geometris. Gambarlah garis lurus, tandai satu titik untuk 0 dan satu titik lain untuk 1, maka setiap titik pada garis itu mewakili tepat satu bilangan real. Garis tersebut disebut **garis bilangan**. Secara intuitif garis ini tidak memiliki celah; sifat ini disebut **kelengkapan (completeness)**, dan bagian tentang garis bilangan di bawah menjelaskan artinya secara tepat.

Bilangan real digunakan dalam pengukuran, kalkulus, fisika, dan berbagai komputasi numerik. Mengetahui bagaimana bilangan real tersusun — mana yang pecahan, mana yang bukan, dan bagaimana komputer menyimpannya — membantu memahami berbagai persoalan perhitungan, termasuk kesalahan pembulatan dalam komputasi.

**Catatan notasi.** Di artikel ini bilangan asli $\mathbb{N}$ adalah $1,2,3,\ldots$ dan bilangan cacah $W$ adalah $0,1,2,3,\ldots$. Sebagian buku menganggap 0 sebagai bilangan asli, jadi periksa konvensinya bila membaca di tempat lain. Kata *bilangan bulat* selalu berarti bilangan dalam $\mathbb{Z}$, dan *ekspansi desimal* berarti seluruh deretan angka sebuah bilangan, sepanjang apa pun.

**Bilangan real sekilas**

| Fakta | Keterangan |
|---|---|
| Simbol | $\mathbb{R}$ |
| Isinya | semua bilangan rasional dan semua bilangan irasional |
| Ekspansi desimal | berakhir, akhirnya berulang secara periodik, atau tak berhingga dan tidak pernah periodik |
| Operasi | tertutup terhadap penjumlahan, pengurangan, perkalian, dan pembagian (tidak pernah dengan 0) |
| Ukuran | tak terhitung banyaknya (Cantor, 1874) |
| Dibangun secara ketat oleh | Dedekind dan Cantor, keduanya pada 1872 |
| Bukan bilangan real | $\infty$, dan $\sqrt{-1}$ (bilangan kompleks) |`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            ...numberLine({
              from: -3,
              to: 4,
              step: 1,
              marks: [
                { at: -1.5, label: '−3/2', color: 'a' },
                { at: Math.SQRT2, label: '√2', color: 'b' },
                { at: Math.PI, label: 'π', color: 'result' },
              ],
            }),
            caption: L(
              'Rational and irrational numbers share one number line: −3/2 is a fraction, √2 and π are not.',
              'Bilangan rasional dan irasional berbagi satu garis bilangan: −3/2 adalah pecahan, sedangkan √2 dan π bukan.',
            ),
          },
        },
        {
          kind: 'callout',
          tone: 'definition',
          title: L('Definition for the curious', 'Definisi bagi yang penasaran'),
          text: L(
            T`In university mathematics, $\mathbb{R}$ is the **complete ordered field**. *Field* means you can add, subtract, multiply and divide (except by 0) with the usual rules. *Ordered* means any two numbers can be compared. *Complete* means the line has no gaps: every non-empty set that is bounded above has a least upper bound. Dedekind (1872) and Cantor (1872) each showed how to build such a number system from the rational numbers, and Rudin (1976, chapter 1) gives the standard modern treatment.`,
            T`Dalam matematika perguruan tinggi, $\mathbb{R}$ adalah **medan terurut lengkap**. *Medan* berarti kamu dapat menjumlah, mengurang, mengalikan, dan membagi (kecuali dengan 0) dengan aturan biasa. *Terurut* berarti dua bilangan mana pun dapat dibandingkan. *Lengkap* berarti garisnya tidak punya celah: setiap himpunan tak kosong yang terbatas ke atas memiliki batas atas terkecil. Dedekind (1872) dan Cantor (1872) masing-masing menunjukkan cara membangun sistem bilangan seperti itu dari bilangan rasional, dan Rudin (1976, bab 1) memberikan pembahasan modern yang baku.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------ sets */
    {
      id: 'number-sets',
      heading: L('What are the types of real numbers?', 'Apa saja jenis bilangan real?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The types of real numbers are the natural, whole, integer, rational and irrational numbers.** They are built up in layers: each layer contains the one before it and adds numbers the earlier layers could not express.

| Set | Symbol | What it contains | Examples |
|---|---|---|---|
| Natural numbers | ℕ | the counting numbers $1, 2, 3, \ldots$ | 1, 7, 250 |
| Whole numbers | W | the natural numbers together with 0: $0, 1, 2, 3, \ldots$ | 0, 3, 12 |
| Integers | ℤ | whole numbers and their negatives | −5, 0, 8 |
| Rational numbers | ℚ | every number $\frac{p}{q}$ with integers $p$ and $q\neq 0$ | $\frac{2}{3}$, −0.75, 4 |
| Irrational numbers | ℝ∖ℚ | real numbers that are not rational | $\sqrt{2}$, $\pi$, $e$ |
| Real numbers | ℝ | all of the above together | everything on the number line |

Every [integer](article:integers) is rational, because $5=\frac{5}{1}$, and the [article on rational numbers](article:rational-numbers) shows how fractions are compared, added and simplified. Every rational number is real. And the two big families, rational and irrational, do not overlap: a real number is exactly one of them.`,
            T`**Jenis-jenis bilangan real adalah bilangan asli, cacah, bulat, rasional, dan irasional.** Himpunan-himpunan tersebut tersusun secara bertingkat: setiap himpunan memuat himpunan sebelumnya dan menambahkan bilangan yang tidak dapat dinyatakan oleh himpunan sebelumnya.

| Himpunan | Simbol | Isinya | Contoh |
|---|---|---|---|
| Bilangan asli | ℕ | bilangan yang digunakan untuk menghitung: $1, 2, 3$, dan seterusnya | 1, 7, 250 |
| Bilangan cacah | W | bilangan asli beserta 0: $0, 1, 2, 3, \ldots$ | 0, 3, 12 |
| Bilangan bulat | ℤ | bilangan cacah beserta negatifnya | −5, 0, 8 |
| Bilangan rasional | ℚ | setiap bilangan $\frac{p}{q}$ dengan $p$ dan $q\neq 0$ bilangan bulat | $\frac{2}{3}$, −0,75, 4 |
| Bilangan irasional | ℝ∖ℚ | bilangan real yang bukan rasional | $\sqrt{2}$, $\pi$, $e$ |
| Bilangan real | ℝ | gabungan semuanya | semua titik pada garis bilangan |

Setiap [bilangan bulat](article:integers) itu rasional, karena $5=\frac{5}{1}$, dan [artikel bilangan rasional](article:rational-numbers) menunjukkan cara membandingkan, menjumlahkan, dan menyederhanakan pecahan. Setiap bilangan rasional itu real. Dan dua kelompok utama, rasional dan irasional, tidak beririsan: sebuah bilangan real tepat salah satunya.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'note',
          title: L('Does ℕ include 0?', 'Apakah ℕ memuat 0?'),
          text: L(
            T`It depends on the book. Indonesian school mathematics uses *bilangan asli* for $1, 2, 3, \ldots$ and *bilangan cacah* for $0, 1, 2, \ldots$, which is how this article uses ℕ and W. Many international textbooks write ℕ for the set that starts at 0. Always check which convention a source uses.`,
            T`Tergantung bukunya. Matematika sekolah di Indonesia memakai *bilangan asli* untuk $1, 2, 3, \ldots$ dan *bilangan cacah* untuk $0, 1, 2, \ldots$, sesuai cara artikel ini memakai ℕ dan W. Banyak buku internasional menulis ℕ untuk himpunan yang dimulai dari 0. Selalu periksa konvensi mana yang dipakai sebuah sumber.`,
          ),
        },
        { kind: 'widget', name: 'sets' },
        {
          kind: 'text',
          text: L(
            T`Not every number is real. The equation $x^2=-1$ has no real solution, because a real number squared is never negative. Mathematicians add a new number $i$ with $i^2=-1$ and get the **complex numbers** $\mathbb{C}$, which contain $\mathbb{R}$ — but that is another article.

One trap before you try the next activity. A root sign does not make a number irrational: $\sqrt{16}=4$ is a natural number. And a decimal does not make a number irrational either: $1.4142$ terminates, so it is the fraction $\frac{14142}{10000}$.`,
            T`Tidak semua bilangan itu real. Persamaan $x^2=-1$ tidak punya solusi real, karena bilangan real yang dikuadratkan tidak pernah negatif. Para matematikawan menambahkan bilangan baru $i$ dengan $i^2=-1$ dan memperoleh **bilangan kompleks** $\mathbb{C}$, yang memuat $\mathbb{R}$ — tetapi itu artikel lain.

Satu jebakan sebelum mencoba aktivitas berikut. Tanda akar tidak otomatis membuat bilangan irasional: $\sqrt{16}=4$ adalah bilangan asli. Dan bentuk desimal juga tidak otomatis membuatnya irasional: $1{,}4142$ berakhir, jadi ia adalah pecahan $\frac{14142}{10000}$.`,
          ),
        },
        { kind: 'widget', name: 'classify' },
      ],
    },

    /* -------------------------------------------------------------- rational */
    {
      id: 'rational-numbers',
      heading: L('What is a rational number? Fractions and decimals', 'Apa itu bilangan rasional? Pecahan dan desimal'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`A **rational number** is a number that can be written as a fraction $\frac{p}{q}$ of two integers, with $q\neq 0$. The word comes from *ratio*. Every rational number can also be written as a decimal, and its decimal expansion always behaves in one of two ways:

- It **terminates**: $\frac{1}{8}=0.125$ and $\frac{3}{40}=0.075$.
- It **eventually repeats periodically**, with one block of digits repeating without end: $\frac{1}{3}=0.333\ldots=0.\overline{3}$ and $\frac{3}{11}=0.272727\ldots=0.\overline{27}$.

The bar over the digits marks the repeating block. Which of the two happens is decided by the denominator, once the fraction is in lowest terms.`,
            T`**Bilangan rasional** adalah bilangan yang dapat ditulis sebagai pecahan $\frac{p}{q}$ dari dua bilangan bulat, dengan $q\neq 0$. Kata ini berasal dari *rasio*. Setiap bilangan rasional juga dapat ditulis sebagai desimal, dan ekspansi desimalnya memiliki salah satu dari dua sifat berikut:

- Ekspansinya **berakhir**: $\frac{1}{8}=0{,}125$ dan $\frac{3}{40}=0{,}075$.
- Ekspansinya **akhirnya berulang secara periodik**, dengan satu kelompok angka berulang tanpa akhir: $\frac{1}{3}=0{,}333\ldots=0{,}\overline{3}$ dan $\frac{3}{11}=0{,}272727\ldots=0{,}\overline{27}$.

Garis di atas angka menandai kelompok angka yang berulang. Mana dari keduanya yang terjadi ditentukan oleh penyebutnya, setelah pecahannya disederhanakan.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: L('The prime-factor rule', 'Aturan faktor prima'),
          text: L(
            T`Write the fraction in lowest terms and factorise its denominator into primes. If the **only** primes are 2 and 5, the decimal expansion terminates. If any other prime appears, it eventually repeats periodically.

For example $\frac{7}{20}$: $20=2^2\times 5$, so it terminates ($0.35$). For $\frac{5}{12}$: $12=2^2\times 3$, and the 3 forces a repeat ($0.41\overline{6}$). The reason: dividing by $2^a5^b$ is the same as multiplying to reach a power of 10, and powers of 10 contain only 2s and 5s.`,
            T`Tulis pecahan dalam bentuk paling sederhana lalu faktorkan penyebutnya menjadi bilangan prima. Jika **satu-satunya** prima adalah 2 dan 5, ekspansi desimalnya berakhir. Jika ada prima lain, ekspansinya akhirnya berulang secara periodik.

Contohnya $\frac{7}{20}$: $20=2^2\times 5$, jadi berakhir ($0{,}35$). Untuk $\frac{5}{12}$: $12=2^2\times 3$, dan faktor 3 memaksa desimalnya berulang ($0{,}41\overline{6}$). Alasannya: membagi dengan $2^a5^b$ sama dengan mengalikan hingga mencapai pangkat 10, dan pangkat 10 hanya mengandung faktor 2 dan 5.`,
          ),
        },
        { kind: 'widget', name: 'decimal' },
        {
          kind: 'text',
          text: L(
            T`**Why must a decimal repeat?** Do the long division of $\frac{p}{q}$. After each digit a remainder is left, and it is always one of $0, 1, \ldots, q-1$. If the remainder is ever 0, the decimal terminates. If not, there are only $q-1$ possible non-zero remainders, so within $q$ steps one of them must come back — and from that moment the digits repeat, because the same remainder leads to the same next digit. This is why the block of $\frac{1}{7}=0.\overline{142857}$ is exactly 6 digits long, one less than 7.

**How to turn a repeating decimal into a fraction.** Follow these steps, shown for $x=0.\overline{27}$:

1. Name the number: let $x=0.\overline{27}$.
2. Multiply by $10^n$, where $n$ is the length of the repeating block (here 2, so multiply by 100): $100x=27.\overline{27}$.
3. Subtract the original number, so the endless tails cancel: $100x-x=27$, which is $99x=27$.
4. Solve and simplify: $x=\frac{27}{99}=\frac{3}{11}$.

When some digits do not repeat, as in $0.41\overline{6}$, use two shifts: $100x=41.\overline{6}$ and $1000x=416.\overline{6}$. Subtracting gives $900x=375$, so $x=\frac{375}{900}=\frac{5}{12}$.`,
            T`**Mengapa desimal harus berulang?** Lakukan pembagian bersusun $\frac{p}{q}$. Setelah tiap angka tersisa sebuah sisa, dan sisa itu selalu salah satu dari $0, 1, \ldots, q-1$. Jika suatu saat sisanya 0, desimalnya berakhir. Jika tidak, hanya ada $q-1$ kemungkinan sisa tak nol, sehingga dalam $q$ langkah salah satunya pasti muncul lagi — dan sejak saat itu angkanya berulang, karena sisa yang sama menghasilkan angka berikutnya yang sama. Itulah sebabnya kelompok angka pada $\frac{1}{7}=0{,}\overline{142857}$ panjangnya tepat 6 angka, satu kurang dari 7.

**Cara mengubah desimal berulang menjadi pecahan.** Ikuti langkah berikut, ditunjukkan untuk $x=0{,}\overline{27}$:

1. Beri nama bilangannya: misalkan $x=0{,}\overline{27}$.
2. Kalikan dengan $10^n$, dengan $n$ panjang kelompok angka yang berulang (di sini 2, jadi kalikan 100): $100x=27{,}\overline{27}$.
3. Kurangkan bilangan semula agar ekor tak berhingga saling meniadakan: $100x-x=27$, yaitu $99x=27$.
4. Selesaikan dan sederhanakan: $x=\frac{27}{99}=\frac{3}{11}$.

Jika ada angka yang tidak berulang, seperti pada $0{,}41\overline{6}$, gunakan dua kali pergeseran: $100x=41{,}\overline{6}$ dan $1000x=416{,}\overline{6}$. Pengurangan memberi $900x=375$, sehingga $x=\frac{375}{900}=\frac{5}{12}$.`,
          ),
        },
        { kind: 'widget', name: 'repeat' },
        {
          kind: 'callout',
          tone: 'warning',
          title: L('0.999… equals 1', '0,999… sama dengan 1'),
          text: L(
            T`Let $x=0.\overline{9}$. Then $10x=9.\overline{9}$, and $10x-x=9$ gives $9x=9$, so $x=1$. The two decimals $0.999\ldots$ and $1$ are two names for the same number. Any terminating decimal has such a twin: $0.5=0.4999\ldots$.`,
            T`Misalkan $x=0{,}\overline{9}$. Maka $10x=9{,}\overline{9}$, dan $10x-x=9$ memberi $9x=9$, sehingga $x=1$. Dua desimal $0{,}999\ldots$ dan $1$ adalah dua nama untuk bilangan yang sama. Setiap desimal yang berakhir punya kembaran seperti itu: $0{,}5=0{,}4999\ldots$.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: which decimal terminates?', 'Coba: desimal mana yang berakhir?'),
          step: {
            kind: 'quiz',
            id: 'a1',
            prompt: L('Which of these fractions has a terminating decimal?', 'Pecahan mana yang desimalnya berakhir?'),
            options: [
              L('$\\frac{7}{20}$', '$\\frac{7}{20}$'),
              L('$\\frac{1}{6}$', '$\\frac{1}{6}$'),
              L('$\\frac{2}{9}$', '$\\frac{2}{9}$'),
              L('$\\frac{5}{14}$', '$\\frac{5}{14}$'),
            ],
            answer: 0,
            explain: L(
              '$20=2^2\\times5$ has only the primes 2 and 5, so $\\frac{7}{20}=0.35$ terminates. $6=2\\times3$, $9=3^2$ and $14=2\\times7$ each contain a prime other than 2 and 5, so those decimals repeat.',
              '$20=2^2\\times5$ hanya punya prima 2 dan 5, jadi $\\frac{7}{20}=0{,}35$ berakhir. $6=2\\times3$, $9=3^2$ dan $14=2\\times7$ masing-masing memuat prima selain 2 dan 5, jadi desimalnya berulang.',
            ),
            hint: L('Factorise each denominator into primes. Look for anything besides 2 and 5.', 'Faktorkan tiap penyebut menjadi prima. Cari yang selain 2 dan 5.'),
          },
        },
        {
          kind: 'activity',
          title: L('Try it: repeating decimal to fraction', 'Coba: desimal berulang menjadi pecahan'),
          step: {
            kind: 'fill',
            id: 'a2',
            math: true,
            prompt: L(
              'Write $0.\\overline{36}$ as a fraction: multiply by 100, subtract, and simplify. Complete the denominator of the simplest form.',
              'Tulis $0{,}\\overline{36}$ sebagai pecahan: kalikan 100, kurangkan, lalu sederhanakan. Lengkapi penyebut bentuk paling sederhana.',
            ),
            template: '0.\\overline{36}=\\frac{36}{99}=\\frac{4}{___}',
            blanks: ['11'],
            explain: L(
              '$99x=36$, so $x=\\frac{36}{99}$. Dividing top and bottom by 9 gives $\\frac{4}{11}$.',
              '$99x=36$, jadi $x=\\frac{36}{99}$. Membagi pembilang dan penyebut dengan 9 memberi $\\frac{4}{11}$.',
            ),
            hint: L('Find the biggest number that divides both 36 and 99.', 'Cari bilangan terbesar yang membagi 36 dan 99.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------- irrational */
    {
      id: 'irrational-numbers',
      heading: L('What is an irrational number? (with a proof for √2)', 'Apa itu bilangan irasional? (dengan bukti untuk √2)'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`An **irrational number** is a real number that is **not** rational: no fraction of two integers equals it. Its decimal expansion is infinite and never periodic. Famous examples:

- $\sqrt{2}=1.41421356\ldots$, the diagonal of a square with side 1.
- $\pi=3.14159265\ldots$, the ratio of a circle's circumference to its diameter.
- $e=2.71828182\ldots$, the base of natural logarithms, which appears in growth and decay.
- $\varphi=\dfrac{1+\sqrt{5}}{2}=1.61803398\ldots$, the golden ratio.

There is a simple test for square roots: for a positive integer $n$, $\sqrt{n}$ is irrational exactly when $n$ is not a perfect square (and when it is, $\sqrt{n}$ is a whole number). Factorise $n$ into [primes](article:integers#primes); if every prime appears an even number of times, $n$ is a perfect square and the root is a whole number. So $\sqrt{50}=5\sqrt{2}$ is irrational, while $\sqrt{49}=7$ is not; [simplifying radicals](article:exponents-and-radicals#simplify-radicals) shows how $\sqrt{50}$ becomes $5\sqrt2$.`,
            T`**Bilangan irasional** adalah bilangan real yang **bukan** rasional: tidak ada pecahan dua bilangan bulat yang sama dengannya. Ekspansi desimalnya tak berhingga dan tidak pernah periodik. Contoh bilangan irasional yang terkenal antara lain:

- $\sqrt{2}=1{,}41421356\ldots$, diagonal persegi dengan sisi 1.
- $\pi=3{,}14159265\ldots$, perbandingan keliling lingkaran terhadap diameternya.
- $e=2{,}71828182\ldots$, bilangan dasar logaritma natural, yang muncul pada pertumbuhan dan peluruhan.
- $\varphi=\dfrac{1+\sqrt{5}}{2}=1{,}61803398\ldots$, rasio emas.

Ada uji sederhana untuk akar kuadrat: untuk bilangan bulat positif $n$, $\sqrt{n}$ irasional tepat ketika $n$ bukan kuadrat sempurna (dan jika $n$ kuadrat sempurna, $\sqrt{n}$ adalah bilangan bulat). Faktorkan $n$ menjadi [bilangan prima](article:integers#primes); jika setiap prima muncul sebanyak bilangan genap, $n$ adalah kuadrat sempurna dan akarnya bilangan bulat. Jadi $\sqrt{50}=5\sqrt{2}$ irasional, sedangkan $\sqrt{49}=7$ tidak; [menyederhanakan bentuk akar](article:exponents-and-radicals#simplify-radicals) menunjukkan bagaimana $\sqrt{50}$ menjadi $5\sqrt2$.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            ...shape({ pts: [[0, 0], [4, 0], [4, 4]], sides: ['1', '1', '√2'], rights: [1] }),
            caption: L(
              'The diagonal of a unit square is √2, by the Pythagorean theorem: 1² + 1² = 2.',
              'Diagonal persegi satuan adalah √2, menurut teorema Pythagoras: 1² + 1² = 2.',
            ),
          },
        },
        {
          kind: 'text',
          text: L(
            T`**Proof that √2 is irrational**

The ancient Greeks already knew this, and the argument is still the best first example of a proof by contradiction. Suppose $\sqrt{2}=\frac{a}{b}$ where $a$ and $b$ are positive integers that are **coprime**, meaning they have no common factor greater than 1 (a fraction in lowest terms). We will show that this is impossible.

1. Square both sides: $2=\frac{a^2}{b^2}$, so $a^2=2b^2$.
2. So $a^2$ is even. An odd number squared is odd, so $a$ itself must be even: $a=2k$ for some integer $k$.
3. Substitute: $(2k)^2=2b^2$, so $4k^2=2b^2$ and $b^2=2k^2$.
4. So $b^2$ is even, and by the same reasoning $b$ is even.
5. Now $a$ and $b$ are both even, so they share the factor 2. That contradicts the assumption that they are coprime.

The assumption led to a contradiction, so no such fraction exists: $\sqrt{2}$ is irrational. ∎`,
            T`**Bukti bahwa √2 irasional**

Orang Yunani kuno sudah mengetahui hal ini, dan argumennya masih menjadi contoh klasik pembuktian dengan kontradiksi. Misalkan $\sqrt{2}=\frac{a}{b}$ dengan $a$ dan $b$ bilangan bulat positif yang **saling prima**, yaitu tidak punya faktor persekutuan lebih dari 1 (pecahan paling sederhana). Kita akan menunjukkan bahwa hal itu mustahil.

1. Kuadratkan kedua ruas: $2=\frac{a^2}{b^2}$, sehingga $a^2=2b^2$.
2. Jadi $a^2$ genap. Bilangan ganjil yang dikuadratkan tetap ganjil, sehingga $a$ sendiri harus genap: $a=2k$ untuk suatu bilangan bulat $k$.
3. Substitusikan: $(2k)^2=2b^2$, sehingga $4k^2=2b^2$ dan $b^2=2k^2$.
4. Jadi $b^2$ genap, dan dengan alasan yang sama $b$ genap.
5. Sekarang $a$ dan $b$ keduanya genap, sehingga keduanya punya faktor 2. Itu bertentangan dengan pengandaian bahwa keduanya saling prima.

Pengandaian tadi menimbulkan kontradiksi, jadi pecahan seperti itu tidak ada: $\sqrt{2}$ irasional. ∎`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: put the proof in order', 'Coba: urutkan buktinya'),
          step: {
            kind: 'order',
            id: 'a3',
            math: true,
            prompt: L(
              'Put the steps of the proof that $\\sqrt{2}$ is irrational in the right order.',
              'Urutkan langkah-langkah bukti bahwa $\\sqrt{2}$ irasional.',
            ),
            lines: {
              en: [
                '\\text{Assume }\\sqrt{2}=\\frac{a}{b}\\text{ with }a,b\\text{ coprime}',
                'a^2=2b^2\\text{, so }a^2\\text{ is even}',
                '\\text{Then }a\\text{ is even: }a=2k',
                '4k^2=2b^2\\text{, so }b^2=2k^2\\text{ and }b\\text{ is even}',
                '\\text{Both even: contradiction}',
              ],
              id: [
                '\\text{Misalkan }\\sqrt{2}=\\frac{a}{b}\\text{ dengan }a,b\\text{ saling prima}',
                'a^2=2b^2\\text{, jadi }a^2\\text{ genap}',
                '\\text{Maka }a\\text{ genap: }a=2k',
                '4k^2=2b^2\\text{, jadi }b^2=2k^2\\text{ dan }b\\text{ genap}',
                '\\text{Keduanya genap: kontradiksi}',
              ],
            },
            explain: L(
              'The proof assumes the opposite, squares it, shows $a$ then $b$ is even, and ends in a contradiction.',
              'Bukti ini mengandaikan kebalikannya, mengkuadratkannya, menunjukkan bahwa $a$ lalu $b$ genap, dan berakhir pada kontradiksi.',
            ),
            hint: L('Start with the assumption. The contradiction comes last.', 'Mulailah dari pengandaian. Kontradiksinya muncul paling akhir.'),
          },
        },
        {
          kind: 'text',
          text: L(
            T`The same idea of proof does not work for $\pi$ and $e$, which are much harder. Euler showed in 1737 that $e$ is irrational, and Lambert showed in 1761 that $\pi$ is (his paper appeared in 1768). Later Hermite (1873) and Lindemann (1882) proved something stronger: $e$ and $\pi$ are not even roots of any polynomial with integer coefficients, which is called being **transcendental**. This is what finally ended the ancient problem of squaring the circle.

Now try the decimal digits yourself. The widget below finds $\sqrt{2}$ one digit at a time: at each step, choose the largest digit whose square stays at or below 2. You can do this for ever, and the digits never settle into a pattern.`,
            T`Gagasan bukti yang sama tidak berlaku untuk $\pi$ dan $e$, yang jauh lebih sulit. Euler menunjukkan pada 1737 bahwa $e$ irasional, dan Lambert menunjukkan pada 1761 bahwa $\pi$ irasional (makalahnya terbit pada 1768). Kemudian Hermite (1873) dan Lindemann (1882) membuktikan sesuatu yang lebih kuat: $e$ dan $\pi$ bahkan bukan akar polinomial mana pun dengan koefisien bulat, yang disebut **transendental**. Inilah yang akhirnya mengakhiri masalah kuno menguadratkan lingkaran.

Sekarang coba sendiri angka-angka desimalnya. Widget di bawah ini menemukan $\sqrt{2}$ satu angka demi satu angka: pada tiap langkah, pilih angka terbesar yang kuadratnya masih tidak lebih dari 2. Kamu bisa melakukannya tanpa akhir, dan angka-angkanya tidak pernah jatuh ke sebuah pola.`,
          ),
        },
        { kind: 'widget', name: 'sqrt2' },
        {
          kind: 'callout',
          tone: 'warning',
          title: L('π is not 3.14 and not 22/7', 'π bukan 3,14 dan bukan 22/7'),
          text: L(
            T`Both are rational *approximations*. $3.14=\frac{314}{100}$ and $\frac{22}{7}=3.\overline{142857}$ are fractions, and $\pi$ is not. They are close — $\frac{22}{7}$ is off by about $0.0013$ — but never equal. Use the $\pi$ key on a calculator, or the exact symbol $\pi$, when the answer needs to be exact.`,
            T`Keduanya adalah *hampiran* rasional. $3{,}14=\frac{314}{100}$ dan $\frac{22}{7}=3{,}\overline{142857}$ adalah pecahan, sedangkan $\pi$ bukan. Keduanya dekat — $\frac{22}{7}$ meleset sekitar $0{,}0013$ — tetapi tidak pernah sama. Pakai tombol $\pi$ di kalkulator, atau lambang eksak $\pi$, ketika jawabannya harus eksak.`,
          ),
        },
        {
          kind: 'text',
          text: L(
            T`**Almost every real number is irrational.** The rational numbers can be listed one after another in a sequence (they are *countable*), but Cantor proved in 1874 that the real numbers cannot (they are *uncountable*). If you picked a real number between 0 and 1 completely at random, the probability that it is rational would be 0. The irrational numbers are not the exotic ones; the rationals are the thin thread we happen to write down most often.`,
            T`**Hampir setiap bilangan real itu irasional.** Bilangan rasional dapat didaftar satu per satu dalam sebuah barisan (ia *terhitung*), tetapi Cantor membuktikan pada 1874 bahwa bilangan real tidak dapat (ia *tak terhitung*). Jika kamu memilih bilangan real antara 0 dan 1 sepenuhnya secara acak, peluang bahwa ia rasional adalah 0. Bilangan irasional bukanlah yang eksotis; bilangan rasionallah benang tipis yang kebetulan paling sering kita tuliskan.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------- number line, density */
    {
      id: 'number-line-density',
      heading: L('How are real numbers arranged on the number line?', 'Bagaimana bilangan real tersusun pada garis bilangan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**On the number line, the rational numbers are dense but not complete, while the real numbers are both dense and complete.** Two properties of the real numbers sound alike and are not.

**Density.** A set is dense in the real numbers when every stretch of the line, however short, contains at least one of its members. The rational numbers are dense, and so are the irrational numbers: between any two different real numbers there is another one — in fact infinitely many rational numbers and infinitely many irrational numbers. If $a<b$ are rational, the midpoint $\frac{a+b}{2}$ is rational and lies between them; and $a+\frac{b-a}{\sqrt{2}}$ is irrational and also lies between them. There is no "next" real number after 0, however much you zoom in.

**Completeness.** The rational numbers are dense and still have gaps: the number $\sqrt{2}$ is missing from $\mathbb{Q}$. The rationals $1,\ 1.4,\ 1.41,\ 1.414,\ \ldots$ get closer and closer to a point on the line, but no rational number is that point.

"A line with no holes" is the picture; the precise statement is the **least upper bound property**: every non-empty set of real numbers that has an upper bound has a *least* upper bound. It fails in $\mathbb{Q}$ — the set of rational numbers whose square is less than 2 is bounded above, yet has no least upper bound among the rationals — and it holds in $\mathbb{R}$, where that least upper bound is $\sqrt{2}$. This is what makes the real number line continuous, and what calculus relies on.`,
            T`**Pada garis bilangan, bilangan rasional itu rapat (dense) tetapi tidak lengkap (complete), sedangkan bilangan real rapat sekaligus lengkap.** Dua sifat bilangan real terdengar mirip tetapi berbeda.

**Kerapatan (dense).** Sebuah himpunan disebut rapat dalam bilangan real jika setiap bagian garis, sependek apa pun, memuat sedikitnya satu anggotanya. Bilangan rasional rapat, begitu juga bilangan irasional: di antara dua bilangan real yang berbeda selalu ada bilangan lain — bahkan tak berhingga banyak bilangan rasional dan tak berhingga banyak bilangan irasional. Jika $a<b$ rasional, titik tengah $\frac{a+b}{2}$ rasional dan terletak di antara keduanya; dan $a+\frac{b-a}{\sqrt{2}}$ irasional dan juga terletak di antara keduanya. Tidak ada bilangan real "berikutnya" setelah 0, sebesar apa pun kamu memperbesar tampilannya.

**Kelengkapan (complete).** Bilangan rasional rapat tetapi tetap memiliki celah: bilangan $\sqrt{2}$ tidak ada di $\mathbb{Q}$. Bilangan rasional $1,\ 1{,}4,\ 1{,}41,\ 1{,}414,\ \ldots$ makin dekat ke sebuah titik pada garis, tetapi tidak ada bilangan rasional yang menjadi titik itu.

"Garis tanpa lubang" hanyalah gambarannya; pernyataan yang tepat adalah **sifat batas atas terkecil**: setiap himpunan bilangan real yang tak kosong dan terbatas ke atas memiliki batas atas *terkecil*. Sifat ini tidak berlaku di $\mathbb{Q}$ — himpunan bilangan rasional yang kuadratnya kurang dari 2 terbatas ke atas, tetapi tidak punya batas atas terkecil di antara bilangan rasional — dan berlaku di $\mathbb{R}$, tempat batas atas terkecil itu adalah $\sqrt{2}$. Inilah yang membuat garis bilangan real kontinu, dan yang diandalkan kalkulus.`,
          ),
        },
        {
          kind: 'figure',
          figure: {
            ...numberLine({
              from: 1,
              to: 2,
              step: 0.5,
              fmt: (v) => (v === 1.5 ? '3/2' : String(v)),
              marks: [{ at: Math.SQRT2, label: '√2', color: 'b' }],
            }),
            caption: L(
              '√2 sits between 1 and 3/2, but not at any fraction you can write down.',
              '√2 terletak di antara 1 dan 3/2, tetapi bukan pada pecahan mana pun yang bisa kamu tuliskan.',
            ),
          },
        },
        { kind: 'widget', name: 'density' },
      ],
    },

    /* --------------------------------------------------------- properties */
    {
      id: 'properties-operations',
      heading: L('What are the properties of real numbers?', 'Apa saja sifat-sifat bilangan real?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Real numbers obey six field properties: closure, commutativity, associativity, distributivity, identity elements and inverses.** For all real numbers $a$, $b$ and $c$, they follow these rules, and every algebra manipulation you do rests on them:

| Property | Statement |
|---|---|
| Closure | $a+b$, $a-b$ and $a\times b$ are real; so is $a\div b$ when $b\neq 0$ |
| Commutative | $a+b=b+a$ and $ab=ba$ |
| Associative | $(a+b)+c=a+(b+c)$ and $(ab)c=a(bc)$ |
| Distributive | $a(b+c)=ab+ac$ |
| Identity | $a+0=a$ and $a\times1=a$ |
| Inverse | $a+(-a)=0$, and $a\times\frac{1}{a}=1$ when $a\neq0$ |

What happens when rational and irrational numbers are mixed? Let $q$ be a non-zero rational number and $i$ an irrational one.

| Operation | Result | Example |
|---|---|---|
| rational + rational | always rational | $\frac{1}{2}+\frac{1}{3}=\frac{5}{6}$ |
| rational + irrational | always irrational | $1+\sqrt{2}$ |
| non-zero rational × irrational | always irrational | $3\sqrt{2}$ |
| irrational + irrational | either | $\sqrt{2}+(-\sqrt{2})=0$ but $\sqrt{2}+\sqrt{3}$ is irrational |
| irrational × irrational | either | $\sqrt{2}\times\sqrt{2}=2$ but $\sqrt{2}\times\sqrt{3}=\sqrt{6}$ is irrational |

Why is $q+i$ always irrational? Suppose it were a rational number $r$. Then $i=r-q$ would be a difference of two rationals, which is rational — contradicting that $i$ is irrational.`,
            T`**Bilangan real memenuhi enam sifat dasar operasi aljabar: ketertutupan, komutatif, asosiatif, distributif, unsur identitas, dan invers.** Untuk semua bilangan real $a$, $b$, dan $c$, berlaku aturan-aturan berikut, dan sifat-sifat tersebut menjadi dasar berbagai manipulasi aljabar:

| Sifat | Pernyataan |
|---|---|
| Tertutup | $a+b$, $a-b$, dan $a\times b$ real; begitu juga $a\div b$ bila $b\neq 0$ |
| Komutatif | $a+b=b+a$ dan $ab=ba$ |
| Asosiatif | $(a+b)+c=a+(b+c)$ dan $(ab)c=a(bc)$ |
| Distributif | $a(b+c)=ab+ac$ |
| Identitas | $a+0=a$ dan $a\times1=a$ |
| Invers | $a+(-a)=0$, dan $a\times\frac{1}{a}=1$ bila $a\neq0$ |

Bagaimana hasil operasi antara bilangan rasional dan irasional? Misalkan $q$ bilangan rasional tak nol dan $i$ bilangan irasional.

| Operasi | Hasil | Contoh |
|---|---|---|
| rasional + rasional | selalu rasional | $\frac{1}{2}+\frac{1}{3}=\frac{5}{6}$ |
| rasional + irasional | selalu irasional | $1+\sqrt{2}$ |
| rasional tak nol × irasional | selalu irasional | $3\sqrt{2}$ |
| irasional + irasional | bisa keduanya | $\sqrt{2}+(-\sqrt{2})=0$ tetapi $\sqrt{2}+\sqrt{3}$ irasional |
| irasional × irasional | bisa keduanya | $\sqrt{2}\times\sqrt{2}=2$ tetapi $\sqrt{2}\times\sqrt{3}=\sqrt{6}$ irasional |

Mengapa $q+i$ selalu irasional? Andaikan $q+i=r$, dengan $r$ rasional. Maka $i=r-q$ juga rasional karena merupakan selisih dua bilangan rasional. Hal ini bertentangan dengan asumsi bahwa $i$ irasional.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: true or false?', 'Coba: benar atau salah?'),
          step: {
            kind: 'judge',
            id: 'a4',
            prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
            statements: [
              L('The sum of two irrational numbers is always irrational.', 'Jumlah dua bilangan irasional selalu irasional.'),
              L('$\\sqrt{2}\\times\\sqrt{8}$ is a rational number.', '$\\sqrt{2}\\times\\sqrt{8}$ adalah bilangan rasional.'),
              L('$0.\\overline{9}$ is slightly less than 1.', '$0{,}\\overline{9}$ sedikit kurang dari 1.'),
              L('$\\frac{\\pi}{2}$ is an irrational number.', '$\\frac{\\pi}{2}$ adalah bilangan irasional.'),
              L('Every integer is a rational number.', 'Setiap bilangan bulat adalah bilangan rasional.'),
            ],
            answer: [false, true, false, true, true],
            explain: L(
              '$\\sqrt{2}+(-\\sqrt{2})=0$ is a sum of irrationals that is rational. $\\sqrt{2}\\times\\sqrt{8}=\\sqrt{16}=4$. $0.\\overline{9}=1$ exactly. $\\frac{\\pi}{2}$ is a non-zero rational times an irrational. Integers are fractions over 1.',
              '$\\sqrt{2}+(-\\sqrt{2})=0$ adalah jumlah dua irasional yang rasional. $\\sqrt{2}\\times\\sqrt{8}=\\sqrt{16}=4$. $0{,}\\overline{9}=1$ tepat. $\\frac{\\pi}{2}$ adalah rasional tak nol kali irasional. Bilangan bulat adalah pecahan dengan penyebut 1.',
            ),
            hint: L('Try to find a counterexample, or use the table above.', 'Coba cari contoh penyangkal, atau gunakan tabel di atas.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------- order, intervals */
    {
      id: 'order-intervals',
      heading: L('How do you compare real numbers and write intervals?', 'Bagaimana membandingkan bilangan real dan menulis interval?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To compare real numbers use order, to describe a stretch of the number line use an interval, and to measure distance from zero use absolute value.**

**Order.** Any two real numbers can be compared: exactly one of $a<b$, $a=b$, $a>b$ is true. Order is transitive ($a<b$ and $b<c$ give $a<c$). Adding the same number to both sides of an inequality keeps it; multiplying both sides by a **negative** number reverses it, so $-2x<6$ gives $x>-3$.

**Intervals.** A stretch of the number line is written as an interval. A square bracket means the end is included, a round bracket means it is not, and $\infty$ always gets a round bracket because it is not a real number.

| Interval | Meaning | Inequality |
|---|---|---|
| $(a,b)$ | open: both ends left out | $a<x<b$ |
| $[a,b]$ | closed: both ends in | $a\le x\le b$ |
| $[a,b)$ | left end in, right end out | $a\le x<b$ |
| $(a,\infty)$ | everything above $a$ | $x>a$ |
| $(-\infty,b]$ | everything up to and including $b$ | $x\le b$ |
| $(-\infty,\infty)$ | the whole line, $\mathbb{R}$ | any $x$ |

**Absolute value.** $|x|$ is the distance from $x$ to 0, so it is never negative: $|x|=x$ if $x\ge0$ and $|x|=-x$ if $x<0$. More generally $|a-b|$ is the distance between $a$ and $b$. The inequality $|x|<3$ means "within 3 of zero", which is the interval $(-3,3)$.`,
            T`**Urutan digunakan untuk membandingkan bilangan real, interval untuk menyatakan bagian dari garis bilangan, dan nilai mutlak untuk menyatakan jarak suatu bilangan dari nol.**

**Urutan.** Dua bilangan real mana pun dapat dibandingkan: tepat satu dari $a<b$, $a=b$, $a>b$ yang benar. Urutan bersifat transitif ($a<b$ dan $b<c$ memberi $a<c$). Menambah kedua ruas pertidaksamaan dengan bilangan yang sama mempertahankannya; mengalikan kedua ruas dengan bilangan **negatif** membalikkannya, sehingga $-2x<6$ memberi $x>-3$.

**Interval.** Suatu bagian dari garis bilangan dapat dinyatakan dalam bentuk interval. Kurung siku berarti ujungnya termasuk, kurung biasa berarti tidak termasuk, dan $\infty$ selalu memakai kurung biasa karena ia bukan bilangan real.

| Interval | Arti | Pertidaksamaan |
|---|---|---|
| $(a,b)$ | terbuka: kedua ujung tidak termasuk | $a<x<b$ |
| $[a,b]$ | tertutup: kedua ujung termasuk | $a\le x\le b$ |
| $[a,b)$ | ujung kiri termasuk, ujung kanan tidak | $a\le x<b$ |
| $(a,\infty)$ | semua di atas $a$ | $x>a$ |
| $(-\infty,b]$ | semua sampai dan termasuk $b$ | $x\le b$ |
| $(-\infty,\infty)$ | seluruh garis, $\mathbb{R}$ | sembarang $x$ |

**Nilai mutlak.** $|x|$ adalah jarak $x$ ke 0, sehingga tidak pernah negatif: $|x|=x$ jika $x\ge0$ dan $|x|=-x$ jika $x<0$. Lebih umum, $|a-b|$ adalah jarak antara $a$ dan $b$. Pertidaksamaan $|x|<3$ berarti jarak $x$ dari nol kurang dari 3, yaitu interval $(-3,3)$.`,
          ),
        },
        { kind: 'widget', name: 'interval' },
        {
          kind: 'activity',
          title: L('Try it: an absolute-value inequality', 'Coba: pertidaksamaan nilai mutlak'),
          step: {
            kind: 'quiz',
            id: 'a5',
            prompt: L('Which interval is the solution of $|x|\\le 2$?', 'Interval mana yang menjadi penyelesaian $|x|\\le 2$?'),
            options: [
              L('$[-2,\\,2]$', '$[-2,\\,2]$'),
              L('$(-2,\\,2)$', '$(-2,\\,2)$'),
              L('$(-\\infty,\\,2]$', '$(-\\infty,\\,2]$'),
              L('$[-2,\\,\\infty)$', '$[-2,\\,\\infty)$'),
            ],
            answer: 0,
            explain: L(
              '$|x|\\le2$ means the distance from 0 is at most 2, so $-2\\le x\\le2$. The "equal to" part puts both ends in, so the brackets are square.',
              '$|x|\\le2$ berarti jarak dari 0 paling banyak 2, sehingga $-2\\le x\\le2$. Bagian "sama dengan" memasukkan kedua ujung, jadi kurungnya siku.',
            ),
            hint: L('Is a number like 2 itself allowed? Is -5 within 2 of zero?', 'Apakah bilangan seperti 2 sendiri diperbolehkan? Apakah -5 berjarak paling banyak 2 dari nol?'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'real-numbers-in-code',
      heading: L('Why does 0.1 + 0.2 not equal 0.3 in code?', 'Mengapa 0,1 + 0,2 tidak selalu sama dengan 0,3 dalam komputer?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, 0.1 + 0.2 does not equal 0.3 because computers store real numbers as 64-bit binary floating-point numbers (*floats* for short), and 0.1 cannot be stored exactly.** A computer has finite memory, and a real number can need infinitely many digits. So programs store an **approximation**. Almost all languages use the IEEE 754 *binary64* format (IEEE 754-2019; see Goldberg, 1991), called a ´double´ or a Python ´float´: 1 sign bit, 11 exponent bits and 52 fraction bits, which gives 53 bits of precision — about 15 to 17 significant decimal digits.

The catch is that the format is *binary*. The decimal $0.1$ is $\frac{1}{10}$, and $10$ has the prime factor 5, so in base 2 the expansion of $0.1$ is periodic without end, just as the expansion of $\frac{1}{3}$ is in base 10. The computer cannot keep an infinite expansion, so it stores the nearest value the format can represent, and the value actually stored is

$$0.1000000000000000055511151231257827\ldots$$

Add two such rounded values and the tiny errors show up:`,
            T`**Dalam kode, 0,1 + 0,2 tidak sama dengan 0,3 karena komputer merepresentasikan bilangan menggunakan format bilangan titik-mengambang (floating-point number, disingkat float) biner 64-bit, dan 0,1 tidak dapat disimpan secara eksak.** Komputer memiliki kapasitas penyimpanan terbatas, sedangkan sebuah bilangan real bisa membutuhkan tak berhingga banyak angka. Maka program menyimpan **hampiran**. Hampir semua bahasa memakai format IEEE 754 *binary64* (IEEE 754-2019; lihat Goldberg, 1991), yang disebut ´double´ atau ´float´ di Python: 1 bit tanda, 11 bit eksponen, dan 52 bit bagian pecahan (fraction), sehingga memberi presisi 53 bit — sekitar 15 sampai 17 angka signifikan desimal.

Masalahnya, formatnya *biner*. Desimal $0{,}1$ adalah $\frac{1}{10}$, dan $10$ punya faktor prima 5, sehingga dalam basis 2 ekspansi $0{,}1$ periodik tanpa akhir, sama seperti ekspansi $\frac{1}{3}$ dalam basis 10. Komputer tidak dapat menyimpan ekspansi yang tak berhingga itu, sehingga ia menyimpan nilai terdekat yang dapat diwakili oleh format tersebut, dan nilai yang benar-benar tersimpan adalah

$$0{,}1000000000000000055511151231257827\ldots$$

Ketika kedua nilai hampiran tersebut dijumlahkan, galat pembulatan dapat terlihat pada hasilnya:`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
>>> import math
>>> math.sqrt(2) ** 2
2.0000000000000004
>>> math.isclose(0.1 + 0.2, 0.3)
True`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `0.1 + 0.2                                  // 0.30000000000000004
0.1 + 0.2 === 0.3                          // false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true
2 ** 53 + 1 === 2 ** 53                    // true: integers lose exactness beyond 2^53`,
        },
        {
          kind: 'text',
          text: L(
            T`This is not a bug in Python or JavaScript, and it is not rare. It is the behaviour of binary floating point everywhere, in every language that uses it. A useful fact follows from it: every number a computer can store as a float is a **rational** number (a fraction whose denominator is a power of 2). A computer never holds $\sqrt{2}$ or $\pi$ — only a nearby rational number.

What to do about it:

| Situation | Better approach |
|---|---|
| Are two results equal? | compare with a tolerance: ´math.isclose(a, b)´ in Python, or ´abs(a - b) < eps´ |
| Money | store whole cents as integers, or use ´decimal.Decimal´ |
| Exact fractions | ´fractions.Fraction´ in Python keeps ´1/10 + 2/10´ exactly ´3/10´ |
| Very large integers | Python ´int´ is exact at any size; use ´BigInt´ in JavaScript |
| Summing many numbers | ´math.fsum´ reduces accumulated rounding error |

Try it below. The widget calculates both expressions with 64-bit floating point, shows the exact value stored, and checks them the three ways a program might.`,
            T`Perilaku ini bukan kesalahan khusus Python atau JavaScript, melainkan konsekuensi representasi bilangan titik-mengambang. Perilaku ini terjadi di mana pun, pada setiap bahasa yang memakainya. Hal penting yang perlu dipahami adalah bahwa setiap bilangan yang dapat disimpan komputer sebagai float adalah bilangan **rasional** (pecahan dengan penyebut pangkat 2). Komputer tidak pernah menyimpan $\sqrt{2}$ atau $\pi$ — hanya bilangan rasional di dekatnya.

Cara menangani perhitungan numerik:

| Situasi | Pendekatan yang lebih baik |
|---|---|
| Apakah dua hasil sama? | bandingkan dengan toleransi: ´math.isclose(a, b)´ di Python, atau ´abs(a - b) < eps´ |
| Uang | simpan sen utuh sebagai bilangan bulat, atau pakai ´decimal.Decimal´ |
| Pecahan eksak | ´fractions.Fraction´ di Python menjaga ´1/10 + 2/10´ tepat ´3/10´ |
| Bilangan bulat sangat besar | ´int´ Python eksak pada ukuran berapa pun; pakai ´BigInt´ di JavaScript |
| Menjumlahkan banyak bilangan | ´math.fsum´ mengurangi akumulasi galat pembulatan |

Coba gunakan aktivitas berikut. Widget ini menghitung kedua ekspresi dengan floating point 64-bit, menampilkan nilai persis yang tersimpan, dan memeriksanya dengan tiga cara yang mungkin dipakai program.`,
          ),
        },
        { kind: 'widget', name: 'floats' },
        {
          kind: 'activity',
          title: L('Try it: what does Python print?', 'Coba: apa yang dicetak Python?'),
          step: {
            kind: 'quiz',
            id: 'a6',
            prompt: L('In Python, what does `0.1 + 0.2 == 0.3` evaluate to?', 'Di Python, apa hasil dari `0.1 + 0.2 == 0.3`?'),
            options: [
              L('`False`', '`False`'),
              L('`True`', '`True`'),
              L('`0.3`', '`0.3`'),
              L('an error', 'sebuah error'),
            ],
            answer: 0,
            explain: L(
              '`0.1 + 0.2` is stored as 0.30000000000000004, which is not the same double as `0.3`, so `==` gives `False`. Use `math.isclose` to compare.',
              '`0.1 + 0.2` tersimpan sebagai 0,30000000000000004, yang bukan double yang sama dengan `0.3`, sehingga `==` menghasilkan `False`. Gunakan `math.isclose` untuk membandingkan.',
            ),
            hint: L('Think about whether the stored value of `0.1 + 0.2` is exactly the stored value of `0.3`.', 'Pikirkan apakah nilai tersimpan `0.1 + 0.2` persis sama dengan nilai tersimpan `0.3`.'),
          },
        },
      ],
    },

    /* -------------------------------------------------------- misconceptions */
    {
      id: 'misconceptions',
      heading: L('What are the common mistakes about real numbers?', 'Apa kesalahan umum tentang bilangan real?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes about real numbers are the eight below, each with the correct fact.**

| Myth | Reality |
|---|---|
| "π equals 3.14 or 22/7." | Both are rational approximations. π is irrational. |
| "A number with a root sign is irrational." | $\sqrt{16}=4$ is rational. For a positive integer $n$, $\sqrt{n}$ is irrational exactly when $n$ is not a perfect square. |
| "0.999… is just below 1." | It equals 1 exactly. |
| "Irrational numbers are rare." | Almost every real number is irrational. |
| "A long, messy decimal must be irrational." | $\frac{1}{97}$ repeats only after 96 digits and is rational. What matters is whether it ever repeats. |
| "0.1 + 0.2 ≠ 0.3 means the computer is broken." | It is how binary floating point works. Compare with a tolerance. |
| "∞ is a real number." | It is not. It is a symbol for "without bound". |
| "Every number is real." | $\sqrt{-1}$ is not. It is a complex number. |`,
            T`**Kesalahan paling umum tentang bilangan real adalah delapan hal berikut, masing-masing dengan faktanya.**

| Mitos | Kenyataan |
|---|---|
| "π sama dengan 3,14 atau 22/7." | Keduanya hampiran rasional. π irasional. |
| "Bilangan dengan tanda akar itu irasional." | $\sqrt{16}=4$ rasional. Untuk bilangan bulat positif $n$, $\sqrt{n}$ irasional tepat ketika $n$ bukan kuadrat sempurna. |
| "0,999… sedikit di bawah 1." | Ia sama dengan 1 tepat. |
| "Bilangan irasional itu langka." | Hampir setiap bilangan real adalah irasional. |
| "Desimal yang panjang dan acak pasti irasional." | $\frac{1}{97}$ baru berulang setelah 96 angka dan ia rasional. Yang menentukan adalah apakah ia pernah berulang. |
| "0,1 + 0,2 ≠ 0,3 berarti komputernya rusak." | Begitulah cara kerja floating point biner. Bandingkan dengan toleransi. |
| "∞ adalah bilangan real." | Bukan. Ia adalah lambang untuk "tanpa batas". |
| "Setiap bilangan itu real." | $\sqrt{-1}$ bukan. Ia bilangan kompleks. |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- practice */
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
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p1',
            prompt: L('Choose **all** the irrational numbers.', 'Pilih **semua** bilangan irasional.'),
            options: [
              L('$\\sqrt{49}$', '$\\sqrt{49}$'),
              L('$\\sqrt{50}$', '$\\sqrt{50}$'),
              L('$\\pi-3$', '$\\pi-3$'),
              L('$0.\\overline{45}$', '$0{,}\\overline{45}$'),
              L('$\\dfrac{\\sqrt{2}}{\\sqrt{8}}$', '$\\dfrac{\\sqrt{2}}{\\sqrt{8}}$'),
            ],
            answer: [1, 2],
            explain: L(
              '$\\sqrt{49}=7$ and $\\frac{\\sqrt{2}}{\\sqrt{8}}=\\sqrt{\\frac{1}{4}}=\\frac{1}{2}$ are rational; $0.\\overline{45}=\\frac{5}{11}$ is rational. $\\sqrt{50}=5\\sqrt{2}$ is irrational, and $\\pi-3$ is rational plus irrational, which is irrational.',
              '$\\sqrt{49}=7$ dan $\\frac{\\sqrt{2}}{\\sqrt{8}}=\\sqrt{\\frac{1}{4}}=\\frac{1}{2}$ rasional; $0{,}\\overline{45}=\\frac{5}{11}$ rasional. $\\sqrt{50}=5\\sqrt{2}$ irasional, dan $\\pi-3$ adalah rasional ditambah irasional, yang irasional.',
            ),
            hint: L('Simplify each root first. Remember rational + irrational is irrational.', 'Sederhanakan tiap akar dulu. Ingat rasional + irasional adalah irasional.'),
          },
        },
        {
          kind: 'activity',
          title: L('Type the answer', 'Ketik jawabannya'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [
              L('Do the long division of 1 by 7 and watch the remainders.', 'Lakukan pembagian bersusun 1 dibagi 7 dan perhatikan sisanya.'),
              L('Write the digits until the remainder 1 comes back.', 'Tulis angkanya sampai sisa 1 muncul lagi.'),
            ],
            explain: L(
              '$\\frac{1}{7}=0.\\overline{142857}$, so the repeating block has 6 digits.',
              '$\\frac{1}{7}=0{,}\\overline{142857}$, jadi kelompok angka yang berulang punya 6 angka.',
            ),
            prompt: L('How many digits are in the repeating block of the decimal for $\\frac{1}{7}$?', 'Berapa banyak angka dalam kelompok angka yang berulang pada desimal $\\frac{1}{7}$?'),
            blanks: [{ answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('Type the fraction', 'Ketik pecahannya'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('Let x = 0.777… and subtract x from 10x.', 'Misalkan x = 0,777… lalu kurangkan x dari 10x.'),
              L('You get 9x = 7.', 'Kamu mendapat 9x = 7.'),
            ],
            explain: L('$10x-x=7$, so $9x=7$ and $x=\\frac{7}{9}$.', '$10x-x=7$, jadi $9x=7$ dan $x=\\frac{7}{9}$.'),
            prompt: L('Write $0.\\overline{7}$ as a fraction in lowest terms.', 'Tulis $0{,}\\overline{7}$ sebagai pecahan paling sederhana.'),
            given: '0.\\overline{7}=\\frac{a}{b}',
            blanks: [
              { label: 'a =', answer: 7 },
              { label: 'b =', answer: 9 },
            ],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: real numbers at a glance', 'Ringkasan: bilangan real sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Real numbers** $\mathbb{R}$ are all the points on the number line: rational plus irrational.
- **Rational** means a fraction of integers; its decimal expansion terminates or eventually repeats periodically. **Irrational** means it is not: $\sqrt{2}$, $\pi$, $e$.
- The chain of sets is $\mathbb{N}\subset W\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}$.
- A reduced fraction terminates exactly when the denominator has only the primes 2 and 5.
- For a positive integer $n$, $\sqrt{n}$ is irrational exactly when $n$ is not a perfect square; $\sqrt{2}$ is irrational by contradiction.
- Rational + irrational is irrational; irrational + irrational can be either.
- The rationals are dense but have gaps; the reals are dense and complete.
- Computers store finite binary approximations, so compare floats with a tolerance and use integers, ´Fraction´ or ´Decimal´ for exact work.`,
            T`- **Bilangan real** $\mathbb{R}$ adalah semua titik pada garis bilangan: rasional ditambah irasional.
- **Rasional** berarti pecahan bilangan bulat; ekspansi desimalnya berakhir atau akhirnya berulang secara periodik. **Irasional** berarti bukan: $\sqrt{2}$, $\pi$, $e$.
- Rantai himpunannya adalah $\mathbb{N}\subset W\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}$.
- Pecahan sederhana berakhir tepat ketika penyebutnya hanya punya prima 2 dan 5.
- Untuk bilangan bulat positif $n$, $\sqrt{n}$ irasional tepat ketika $n$ bukan kuadrat sempurna; $\sqrt{2}$ irasional lewat kontradiksi.
- Rasional + irasional adalah irasional; irasional + irasional bisa keduanya.
- Bilangan rasional rapat tetapi berlubang; bilangan real rapat dan lengkap.
- Komputer menyimpan hampiran biner yang berhingga, jadi bandingkan float dengan toleransi dan pakai bilangan bulat, ´Fraction´, atau ´Decimal´ untuk hitungan eksak.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Real number', 'Bilangan real'), definition: L('A number that corresponds to a point on the number line; every real number is either rational or irrational.', 'Bilangan yang sesuai dengan sebuah titik pada garis bilangan; setiap bilangan real adalah rasional atau irasional.') },
    { term: L('Rational number', 'Bilangan rasional'), definition: L('A number that can be written as a fraction of two integers with a non-zero denominator; its decimal expansion terminates or eventually repeats periodically.', 'Bilangan yang dapat ditulis sebagai pecahan dua bilangan bulat dengan penyebut tak nol; ekspansi desimalnya berakhir atau akhirnya berulang secara periodik.') },
    { term: L('Irrational number', 'Bilangan irasional'), definition: L('A real number that cannot be written as a fraction of two integers; its decimal expansion is infinite and never periodic.', 'Bilangan real yang tidak dapat ditulis sebagai pecahan dua bilangan bulat; ekspansi desimalnya tak berhingga dan tidak pernah periodik.') },
    { term: L('Integer', 'Bilangan bulat'), definition: L('A number in the set ℤ: a whole number or its negative, …, −2, −1, 0, 1, 2, ….', 'Bilangan dalam himpunan ℤ, yaitu bilangan cacah atau negatifnya: …, −2, −1, 0, 1, 2, ….') },
    { term: L('Natural number', 'Bilangan asli'), definition: L('A counting number 1, 2, 3, …; some books also include 0.', 'Bilangan hitung 1, 2, 3, …; sebagian buku juga memasukkan 0.') },
    { term: L('Whole number', 'Bilangan cacah'), definition: L('A natural number or zero: 0, 1, 2, 3, ….', 'Bilangan asli atau nol: 0, 1, 2, 3, ….') },
    { term: L('Terminating decimal', 'Desimal berakhir'), definition: L('A decimal with finitely many digits after the point, such as 0.125.', 'Desimal dengan angka di belakang koma yang berhingga banyaknya, seperti 0,125.') },
    { term: L('Repeating decimal', 'Desimal berulang'), definition: L('A decimal expansion that eventually repeats periodically: from some digit onward a block of digits repeats without end, such as 0.272727….', 'Ekspansi desimal yang akhirnya berulang secara periodik: mulai dari suatu angka, sekelompok angka berulang tanpa akhir, seperti 0,272727….') },
    { term: L('Transcendental number', 'Bilangan transendental'), definition: L('A real number that is not a root of any non-zero polynomial with integer coefficients, such as π and e.', 'Bilangan real yang bukan akar polinomial tak nol mana pun dengan koefisien bulat, seperti π dan e.') },
    { term: L('Floating-point number', 'Bilangan floating point'), definition: L('The approximation of a real number that a computer stores, usually a 64-bit binary value with about 15 to 17 significant decimal digits.', 'Hampiran bilangan real yang disimpan komputer, biasanya nilai biner 64-bit dengan sekitar 15 sampai 17 angka signifikan desimal.') },
    { term: L('Interval', 'Interval'), definition: L('An unbroken stretch of the real number line, written with brackets, such as [a, b).', 'Bagian garis bilangan real yang tak terputus, ditulis dengan tanda kurung, seperti [a, b).') },
    { term: L('Dense set', 'Himpunan rapat (dense)'), definition: L('A set is dense in the real numbers when every stretch of the number line, however short, contains at least one of its members; the rational and the irrational numbers are both dense.', 'Himpunan disebut rapat dalam bilangan real jika setiap bagian garis bilangan, sependek apa pun, memuat sedikitnya satu anggotanya; bilangan rasional dan bilangan irasional sama-sama rapat.') },
    { term: L('Completeness', 'Kelengkapan (completeness)'), definition: L('The property that every non-empty set of real numbers with an upper bound has a least upper bound, which means the real number line has no gaps.', 'Sifat bahwa setiap himpunan bilangan real yang tak kosong dan terbatas ke atas memiliki batas atas terkecil, yang berarti garis bilangan real tidak memiliki celah.') },
    { term: L('Absolute value', 'Nilai mutlak'), definition: L('The distance from a number to 0 on the number line, written |x|.', 'Jarak sebuah bilangan ke 0 pada garis bilangan, ditulis |x|.') },
  ],

  howTo: [
    {
      name: L('How to convert a repeating decimal to a fraction', 'Cara mengubah desimal berulang menjadi pecahan'),
      description: L('Turn a decimal such as 0.272727… into an exact fraction by subtracting a shifted copy of itself.', 'Ubah desimal seperti 0,272727… menjadi pecahan eksak dengan mengurangkan salinannya yang digeser.'),
      steps: [
        { name: L('Name the number', 'Beri nama bilangannya'), text: L('Let x equal the repeating decimal, for example x = 0.272727….', 'Misalkan x sama dengan desimal berulang itu, misalnya x = 0,272727….') },
        { name: L('Shift the decimal point', 'Geser komanya'), text: L('Multiply by 10 to the power n, where n is the length of the repeating block. For a block of 2 digits multiply by 100, so 100x = 27.2727….', 'Kalikan dengan 10 pangkat n, dengan n panjang kelompok angka yang berulang. Untuk kelompok 2 angka kalikan 100, sehingga 100x = 27,2727….') },
        { name: L('Subtract the original', 'Kurangkan bilangan semula'), text: L('Subtract x from 100x so the endless tails cancel: 99x = 27.', 'Kurangkan x dari 100x agar ekor tak berhingga saling meniadakan: 99x = 27.') },
        { name: L('Solve and simplify', 'Selesaikan dan sederhanakan'), text: L('Divide to get x = 27/99, then simplify to 3/11.', 'Bagi untuk mendapat x = 27/99, lalu sederhanakan menjadi 3/11.') },
      ],
    },
    {
      name: L('How to tell whether a fraction’s decimal terminates or repeats', 'Cara mengetahui apakah desimal sebuah pecahan berakhir atau berulang'),
      description: L('Decide from the denominator alone, without doing the division.', 'Tentukan dari penyebutnya saja, tanpa melakukan pembagian.'),
      steps: [
        { name: L('Reduce the fraction', 'Sederhanakan pecahannya'), text: L('Write the fraction in lowest terms.', 'Tulis pecahan dalam bentuk paling sederhana.') },
        { name: L('Factorise the denominator', 'Faktorkan penyebutnya'), text: L('Break the denominator into prime factors, for example 12 = 2 × 2 × 3.', 'Uraikan penyebut menjadi faktor prima, misalnya 12 = 2 × 2 × 3.') },
        { name: L('Look for primes other than 2 and 5', 'Cari prima selain 2 dan 5'), text: L('If the only primes are 2 and 5 the decimal terminates; if any other prime appears it eventually repeats periodically.', 'Jika satu-satunya prima adalah 2 dan 5 desimalnya berakhir; jika ada prima lain desimalnya akhirnya berulang secara periodik.') },
      ],
    },
    {
      name: L('How to prove that √2 is irrational', 'Cara membuktikan bahwa √2 irasional'),
      description: L('A proof by contradiction that no fraction of integers equals the square root of 2.', 'Bukti dengan kontradiksi bahwa tidak ada pecahan bilangan bulat yang sama dengan akar kuadrat 2.'),
      steps: [
        { name: L('Assume the opposite', 'Andaikan kebalikannya'), text: L('Suppose √2 = a/b with a and b integers that are coprime (no common factor greater than 1).', 'Andaikan √2 = a/b dengan a dan b bilangan bulat yang saling prima (tidak punya faktor persekutuan lebih dari 1).') },
        { name: L('Square both sides', 'Kuadratkan kedua ruas'), text: L('This gives a² = 2b², so a² is even and therefore a is even.', 'Ini memberi a² = 2b², sehingga a² genap dan karena itu a genap.') },
        { name: L('Write a as 2k', 'Tulis a sebagai 2k'), text: L('Substitute a = 2k to get 4k² = 2b², so b² = 2k².', 'Substitusikan a = 2k untuk mendapat 4k² = 2b², sehingga b² = 2k².') },
        { name: L('Conclude that b is even', 'Simpulkan bahwa b genap'), text: L('Then b² is even, so b is even.', 'Maka b² genap, sehingga b genap.') },
        { name: L('Reach the contradiction', 'Capai kontradiksinya'), text: L('Both a and b are even, which contradicts a and b being coprime, so √2 is irrational.', 'Baik a maupun b genap, yang bertentangan dengan a dan b saling prima, sehingga √2 irasional.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a real number?', 'Apa itu bilangan real?'),
      a: L(
        'A real number is any number that corresponds to a point on the number line. It can be written as a decimal, finite or infinite. Real numbers include integers, fractions, terminating and repeating decimals, and irrational numbers such as √2 and π.',
        'Bilangan real adalah bilangan apa pun yang sesuai dengan sebuah titik pada garis bilangan. Ia punya ekspansi desimal, berhingga maupun tak berhingga. Bilangan real mencakup bilangan bulat, pecahan, desimal berakhir dan berulang, serta bilangan irasional seperti √2 dan π.',
      ),
    },
    {
      q: L('What is the difference between rational and irrational numbers?', 'Apa beda bilangan rasional dan irasional?'),
      a: L(
        'A rational number can be written as a fraction of two integers, and its decimal expansion terminates or eventually repeats periodically. An irrational number cannot be written that way, and its decimal expansion is infinite and never periodic. Every real number is exactly one of the two.',
        'Bilangan rasional dapat ditulis sebagai pecahan dua bilangan bulat, dan ekspansi desimalnya berakhir atau akhirnya berulang secara periodik. Bilangan irasional tidak dapat ditulis seperti itu, dan ekspansi desimalnya tak berhingga dan tidak pernah periodik. Setiap bilangan real tepat salah satu dari keduanya.',
      ),
    },
    {
      q: L('Is zero a real number? Is it rational?', 'Apakah nol bilangan real? Apakah ia rasional?'),
      a: L(
        'Yes to both. Zero is a real number, an integer and a whole number, and it is rational because 0 = 0/1. Whether zero counts as a natural number depends on the convention: Indonesian school books say no, many international books say yes.',
        'Ya untuk keduanya. Nol adalah bilangan real, bilangan bulat, dan bilangan cacah, dan ia rasional karena 0 = 0/1. Apakah nol termasuk bilangan asli bergantung pada konvensi: buku sekolah Indonesia mengatakan tidak, banyak buku internasional mengatakan ya.',
      ),
    },
    {
      q: L('Is √2 a rational number?', 'Apakah √2 bilangan rasional?'),
      a: L(
        'No. √2 is irrational. If it were a fraction a/b in lowest terms, squaring would give a² = 2b², which forces both a and b to be even, contradicting lowest terms. The ancient Greeks knew this proof.',
        'Bukan. √2 irasional. Jika ia pecahan a/b yang paling sederhana, mengkuadratkannya memberi a² = 2b², yang memaksa a dan b keduanya genap, bertentangan dengan bentuk paling sederhana. Orang Yunani kuno mengetahui bukti ini.',
      ),
    },
    {
      q: L('Is π rational?', 'Apakah π bilangan rasional?'),
      a: L(
        'No. π is irrational, which Johann Lambert proved in 1761, and it is even transcendental, which Ferdinand von Lindemann proved in 1882. The values 3.14 and 22/7 are only rational approximations of π.',
        'Bukan. π irasional, yang dibuktikan Johann Lambert pada 1761, dan ia bahkan transendental, yang dibuktikan Ferdinand von Lindemann pada 1882. Nilai 3,14 dan 22/7 hanyalah hampiran rasional dari π.',
      ),
    },
    {
      q: L('Is 0.999… equal to 1?', 'Apakah 0,999… sama dengan 1?'),
      a: L(
        'Yes, exactly. If x = 0.999…, then 10x = 9.999…, and subtracting gives 9x = 9, so x = 1. The two decimals are different spellings of the same real number.',
        'Ya, tepat sama. Jika x = 0,999…, maka 10x = 9,999…, dan pengurangan memberi 9x = 9, sehingga x = 1. Kedua desimal itu hanyalah dua cara menulis bilangan real yang sama.',
      ),
    },
    {
      q: L('Is infinity a real number?', 'Apakah tak hingga bilangan real?'),
      a: L(
        'No. Infinity is not a real number; it is a symbol meaning "without bound". That is why interval notation always puts a round bracket next to ∞ and −∞.',
        'Bukan. Tak hingga bukan bilangan real; ia adalah lambang yang berarti "tanpa batas". Itulah sebabnya notasi interval selalu memakai kurung biasa di samping ∞ dan −∞.',
      ),
    },
    {
      q: L('How many real numbers are there?', 'Ada berapa banyak bilangan real?'),
      a: L(
        'Infinitely many, and in a stronger sense than the integers. The integers and the rational numbers can be listed in a sequence, but Georg Cantor proved in 1874 that the real numbers cannot. There are uncountably many of them, and almost all of them are irrational.',
        'Tak berhingga banyak, dalam arti yang lebih kuat daripada bilangan bulat. Bilangan bulat dan bilangan rasional dapat didaftar dalam sebuah barisan, tetapi Georg Cantor membuktikan pada 1874 bahwa bilangan real tidak dapat. Bilangan real tak terhitung banyaknya, dan hampir semuanya irasional.',
      ),
    },
    {
      q: L('Why does 0.1 + 0.2 not equal 0.3 on a computer?', 'Mengapa 0,1 + 0,2 tidak sama dengan 0,3 di komputer?'),
      a: L(
        'Computers store numbers in binary floating point, and 0.1 has an infinite periodic expansion in binary, so it is stored as the nearest representable value. The stored 0.1 plus the stored 0.2 comes out as 0.30000000000000004, which differs from the stored 0.3. Compare floats with a tolerance instead of using equality.',
        'Komputer menyimpan bilangan dalam floating point biner, dan 0,1 punya ekspansi biner yang periodik tanpa akhir, sehingga ia disimpan sebagai nilai terdekat yang dapat diwakili. Nilai 0,1 yang tersimpan ditambah nilai 0,2 yang tersimpan menghasilkan 0,30000000000000004, yang berbeda dari 0,3 yang tersimpan. Untuk membandingkan hasil bilangan titik-mengambang, gunakan toleransi galat, bukan hanya operator kesamaan.',
      ),
    },
    {
      q: L('What are examples of real numbers?', 'Apa saja contoh bilangan real?'),
      a: L(
        'Examples of real numbers include the integer −3, the fraction 2/3, the terminating decimal 0.75, the repeating decimal 0.333…, and the irrational numbers √2, π and e. Every point on the number line is a real number.',
        'Contoh bilangan real antara lain bilangan bulat −3, pecahan 2/3, desimal berakhir 0,75, desimal berulang 0,333…, dan bilangan irasional √2, π, dan e. Setiap titik pada garis bilangan adalah bilangan real.',
      ),
    },
    {
      q: L('What are the properties of real numbers?', 'Apa saja sifat-sifat bilangan real?'),
      a: L(
        'Real numbers are closed under addition, subtraction, multiplication and division by a non-zero number, and they are commutative, associative and distributive. They have the identities 0 and 1, additive and multiplicative inverses, and an order in which any two numbers can be compared.',
        'Bilangan real tertutup terhadap penjumlahan, pengurangan, perkalian, dan pembagian dengan bilangan tak nol, serta bersifat komutatif, asosiatif, dan distributif. Bilangan real punya identitas 0 dan 1, invers penjumlahan dan perkalian, serta urutan sehingga dua bilangan mana pun dapat dibandingkan.',
      ),
    },
    {
      q: L('Are all integers real numbers?', 'Apakah semua bilangan bulat adalah bilangan real?'),
      a: L(
        'Yes. Every integer n is a rational number because n = n/1, and every rational number is a real number. The sets nest: natural numbers, whole numbers, integers, rational numbers and real numbers, each contained in the next.',
        'Ya. Setiap bilangan bulat n adalah bilangan rasional karena n = n/1, dan setiap bilangan rasional adalah bilangan real. Himpunannya bersarang: bilangan asli, cacah, bulat, rasional, dan real, masing-masing termuat dalam himpunan berikutnya.',
      ),
    },
    {
      q: L('What is not a real number?', 'Apa yang bukan bilangan real?'),
      a: L(
        'Infinity is not a real number, and neither is the square root of −1, which is an imaginary number belonging to the complex numbers. Division by zero is undefined, so 1/0 is not a real number either.',
        'Tak hingga bukan bilangan real, begitu juga akar kuadrat dari −1, yang merupakan bilangan imajiner milik bilangan kompleks. Pembagian dengan nol tidak terdefinisi, sehingga 1/0 juga bukan bilangan real.',
      ),
    },
    {
      q: L('What is the symbol for real numbers?', 'Apa simbol untuk bilangan real?'),
      a: L(
        'The set of real numbers is written ℝ, a blackboard-bold capital R, or \\mathbb{R} in LaTeX. Related symbols are ℚ for rational numbers, ℤ for integers and ℕ for natural numbers.',
        'Himpunan bilangan real ditulis ℝ, huruf R kapital tebal ganda, atau \\mathbb{R} dalam LaTeX. Simbol terkait adalah ℚ untuk bilangan rasional, ℤ untuk bilangan bulat, dan ℕ untuk bilangan asli.',
      ),
    },
  ],

  references: [
    { title: 'Principles of Mathematical Analysis', author: 'Walter Rudin', year: 1976, source: 'McGraw-Hill (3rd ed.)' },
    { title: 'The Real Numbers: An Introduction to Set Theory and Analysis', author: 'John Stillwell', year: 2013, source: 'Springer' },
    { title: 'Irrational Numbers', author: 'Ivan Niven', year: 1956, source: 'Mathematical Association of America (Carus Mathematical Monographs)' },
    { title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic', author: 'David Goldberg', year: 1991, source: 'ACM Computing Surveys 23(1), 5–48' },
    { title: 'IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)', author: 'IEEE', year: 2019, source: 'Institute of Electrical and Electronics Engineers' },
    { title: 'Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen', author: 'Georg Cantor', year: 1874, source: 'Journal für die reine und angewandte Mathematik 77, 258–262' },
  ],

  related: ['integers', 'exponents-and-radicals', 'algebraic-expressions', 'chinese-numbers'],
}
