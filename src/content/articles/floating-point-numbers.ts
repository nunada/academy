import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './floating-point-numbers.meta'

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
    T`**A floating-point number is a binary number in scientific notation, stored as a sign, an exponent and a fixed number of fraction bits, which is why it has a huge range but only about 16 decimal digits (for 64 bits).** Numbers are not evenly spaced: the gap doubles at every power of two, every operation rounds to the nearest value that fits, and the small errors can pile up, cancel digits or be absorbed.`,
    T`**Bilangan floating-point adalah bilangan biner dalam notasi ilmiah, disimpan sebagai tanda, eksponen, dan sejumlah tetap bit pecahan, sehingga rentangnya sangat besar tetapi hanya sekitar 16 angka desimal (untuk 64 bit).** Bilangan tidak berjarak sama: jaraknya berlipat dua di setiap pangkat dua, setiap operasi membulatkan ke nilai terdekat yang muat, dan galat kecilnya dapat menumpuk, menghapus angka, atau terserap.`,
  ),

  keyPoints: [
    L(
      T`A 64-bit double is $(-1)^s\times(1.f)_2\times2^{e}$: 1 sign bit, 11 exponent bits and 52 fraction bits. The leading 1 is not stored, so the precision is 53 bits, about 15.95 decimal digits.`,
      T`Sebuah double 64 bit adalah $(-1)^s\times(1.f)_2\times2^{e}$: 1 bit tanda, 11 bit eksponen, dan 52 bit pecahan. Angka 1 di depan tidak disimpan, sehingga ketelitiannya 53 bit, sekitar 15,95 angka desimal.`,
    ),
    L(
      T`The numbers are not evenly spaced. Between $2^k$ and $2^{k+1}$ there are always the same number of them, so the gap doubles at every power of two; from $2^{53}$ the gap in a double is $2$, and odd integers no longer exist.`,
      T`Bilangannya tidak berjarak sama. Di antara $2^k$ dan $2^{k+1}$ selalu ada jumlah yang sama, sehingga jaraknya berlipat dua di setiap pangkat dua; mulai $2^{53}$ jarak pada double adalah $2$, dan bilangan bulat ganjil tidak ada lagi.`,
    ),
    L(
      T`Every basic operation is rounded to the nearest representable number, ties to even, so $\mathrm{fl}(a\circ b)=(a\circ b)(1+\delta)$ with $|\delta|\le u=2^{-53}\approx1.1\times10^{-16}$. The gap above $1$ is the machine epsilon $2^{-52}$.`,
      T`Setiap operasi dasar dibulatkan ke bilangan terdekat yang dapat disajikan, seri ke genap, sehingga $\mathrm{fl}(a\circ b)=(a\circ b)(1+\delta)$ dengan $|\delta|\le u=2^{-53}\approx1{,}1\times10^{-16}$. Jarak di atas $1$ adalah epsilon mesin $2^{-52}$.`,
    ),
    L(
      T`Special patterns: $\pm0$, $\pm\infty$ and NaN, which is not equal even to itself; subnormal numbers fill the gap between $0$ and the smallest normal number, so that underflow is gradual.`,
      T`Pola khusus: $\pm0$, $\pm\infty$, dan NaN, yang tidak sama bahkan dengan dirinya sendiri; bilangan subnormal mengisi celah antara $0$ dan bilangan normal terkecil, sehingga underflow berlangsung bertahap.`,
    ),
    L(
      T`Rounding errors accumulate when you add many numbers, vanish into a big number (absorption), and make subtracting two nearly equal numbers lose digits (cancellation). Compensated sums, algebraic rewriting and library functions such as ´expm1´ limit the damage.`,
      T`Galat pembulatan menumpuk ketika kamu menjumlahkan banyak bilangan, hilang ke dalam bilangan besar (penyerapan), dan membuat pengurangan dua bilangan yang hampir sama kehilangan angka (pembatalan). Jumlah berkompensasi, penulisan ulang aljabar, dan fungsi pustaka seperti ´expm1´ membatasi kerusakannya.`,
    ),
    L(
      T`Compare floats with a relative and an absolute tolerance, never with ´==´ after a calculation; use integers or decimal types for money; and choose float16, bfloat16, float32 or float64 by the range and the digits the problem needs.`,
      T`Bandingkan float dengan toleransi relatif dan mutlak, jangan dengan ´==´ setelah perhitungan; pakai bilangan bulat atau tipe desimal untuk uang; dan pilih float16, bfloat16, float32, atau float64 menurut rentang dan angka yang diperlukan soal.`,
    ),
  ],

  sections: [
    /* ----------------------------------------------------------------------------------- what */
    {
      id: 'what-is',
      heading: L('What is a floating-point number?', 'Apa itu bilangan floating-point?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A floating-point number is a number written in binary scientific notation with a fixed number of digits: a sign, a significand (the digits) and an exponent that says where the point goes.** In decimal, scientific notation writes $-6.02\times10^{23}$ or $1.6\times10^{-19}$: a few significant digits and a power of ten. A computer does the same in base $2$:
$$x=(-1)^s\times(1.f_1f_2f_3\ldots f_m)_2\times2^{e}.$$
The point "floats" because the exponent $e$ moves it, so the same format holds the size of the universe and the size of an atom. The price is that the number of digits $m+1$ is fixed, so every number has only a limited number of significant digits, however large or small it is.

**Why not fixed point?** A fixed-point format keeps the point in one place, for example always $16$ binary digits after it. Then it cannot hold both $10^{30}$ and $10^{-30}$; floating point gives up some precision to cover that whole range.

**The standard.** Almost all hardware follows IEEE 754. It defines a few binary formats, which differ in how many bits go to the exponent and to the fraction:

| Format | Bits | Sign + exponent + fraction | Significant bits | Decimal digits | Largest value |
|---|---|---|---|---|---|
| half, float16 | 16 | 1 + 5 + 10 | 11 | about 3.3 | 65504 |
| bfloat16 | 16 | 1 + 8 + 7 | 8 | about 2.4 | about $3.4\times10^{38}$ |
| single, float32 | 32 | 1 + 8 + 23 | 24 | about 7.2 | about $3.4\times10^{38}$ |
| double, float64 | 64 | 1 + 11 + 52 | 53 | about 15.95 | about $1.8\times10^{308}$ |

The number of decimal digits is the number of significant bits times $\log_{10}2\approx0.301$. In Python a ´float´ is a double, in JavaScript every ´Number´ is a double, and in C and C++ ´double´ is a double and ´float´ is a single. This article is about what these formats do, in the way that matters when you write code; [real numbers](article:real-numbers#real-numbers-in-code) explains the short version, and [binary numbers](article:binary-numbers#binary-fractions) explains why $0.1$ has no finite binary expansion.`,
            T`**Bilangan floating-point adalah bilangan yang ditulis dalam notasi ilmiah biner dengan jumlah angka tetap: tanda, signifikan (angkanya), dan eksponen yang menyatakan letak titiknya.** Dalam desimal, notasi ilmiah menulis $-6{,}02\times10^{23}$ atau $1{,}6\times10^{-19}$: beberapa angka signifikan dan pangkat sepuluh. Komputer melakukan hal yang sama dalam basis $2$:
$$x=(-1)^s\times(1.f_1f_2f_3\ldots f_m)_2\times2^{e}.$$
Titiknya "mengambang" karena eksponen $e$ menggesernya, sehingga format yang sama memuat ukuran alam semesta dan ukuran atom. Harganya adalah jumlah angka $m+1$ tetap, sehingga setiap bilangan hanya memiliki angka signifikan yang terbatas, sebesar atau sekecil apa pun ia.

**Mengapa bukan titik tetap?** Format titik tetap menjaga titik di satu tempat, misalnya selalu $16$ angka biner setelahnya. Maka ia tidak dapat memuat $10^{30}$ dan $10^{-30}$ sekaligus; floating-point mengorbankan sebagian ketelitian untuk menjangkau seluruh rentang itu.

**Standarnya.** Hampir semua perangkat keras mengikuti IEEE 754. Ia mendefinisikan beberapa format biner, yang berbeda dalam banyaknya bit untuk eksponen dan untuk pecahan:

| Format | Bit | Tanda + eksponen + pecahan | Bit signifikan | Angka desimal | Nilai terbesar |
|---|---|---|---|---|---|
| half, float16 | 16 | 1 + 5 + 10 | 11 | sekitar 3,3 | 65504 |
| bfloat16 | 16 | 1 + 8 + 7 | 8 | sekitar 2,4 | sekitar $3{,}4\times10^{38}$ |
| single, float32 | 32 | 1 + 8 + 23 | 24 | sekitar 7,2 | sekitar $3{,}4\times10^{38}$ |
| double, float64 | 64 | 1 + 11 + 52 | 53 | sekitar 15,95 | sekitar $1{,}8\times10^{308}$ |

Banyaknya angka desimal adalah banyaknya bit signifikan dikali $\log_{10}2\approx0{,}301$. Di Python ´float´ adalah double, di JavaScript setiap ´Number´ adalah double, dan di C dan C++ ´double´ adalah double dan ´float´ adalah single. Artikel ini membahas apa yang dilakukan format-format ini, dengan cara yang penting ketika kamu menulis kode; [bilangan real](article:real-numbers#real-numbers-in-code) menjelaskan versi singkatnya, dan [bilangan biner](article:binary-numbers#binary-fractions) menjelaskan mengapa $0{,}1$ tidak punya ekspansi biner berhingga.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- layout */
    {
      id: 'layout',
      heading: L('How are the bits of a double laid out?', 'Bagaimana bit sebuah double disusun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A double has three fields: 1 sign bit, 11 exponent bits and 52 fraction bits, and the value follows from the field of the exponent.**

- **Normal numbers** (exponent field $1$ to $2046$): the value is $(-1)^s\times\left(1+\frac{F}{2^{52}}\right)\times2^{E-1023}$, where $E$ is the exponent field read as an integer, $F$ is the fraction field, and $1023$ is the *bias*. The leading $1$ is implied, which is why $52$ stored bits give $53$ bits of precision. The bias lets the exponent be stored without its own sign.
- **Exponent field $0$:** the value $\pm0$ if the fraction is $0$, and otherwise a *subnormal* number $(-1)^s\times\frac{F}{2^{52}}\times2^{-1022}$ with no implied $1$.
- **Exponent field $2047$** (all ones): $\pm\infty$ if the fraction is $0$, and otherwise NaN.

**Two examples.** The number $-2.5=-1.25\times2^1$ has sign $1$, exponent field $1+1023=1024=10000000000_2$ and fraction $0100\ldots0$ (the $.25$ of $1.25$), so its pattern in hexadecimal is ´C004000000000000´. The number $0.1$ is $1.6000000000000000888\ldots\times2^{-4}$: sign $0$, exponent field $1019$, and a fraction that repeats $1001\,1001\ldots$ and is rounded up at the end, giving ´3FB999999999999A´. That last ´A´ is the rounding, and it is why the stored value is
$$0.1000000000000000055511151231257827021181583404541015625,$$
slightly more than $0.1$. For a single, the numbers are the same except that the bias is $127$ and there are $8$ and $23$ bits.

Type a number below and choose a format. The widget shows the three fields, the formula they stand for, the exact value that is stored, the error of the rounding and the neighbors above and below.`,
            T`**Sebuah double memiliki tiga bidang: 1 bit tanda, 11 bit eksponen, dan 52 bit pecahan, dan nilainya mengikuti bidang eksponen.**

- **Bilangan normal** (bidang eksponen $1$ sampai $2046$): nilainya $(-1)^s\times\left(1+\frac{F}{2^{52}}\right)\times2^{E-1023}$, dengan $E$ bidang eksponen yang dibaca sebagai bilangan bulat, $F$ bidang pecahan, dan $1023$ adalah *bias*. Angka $1$ di depan tersirat, itulah sebabnya $52$ bit tersimpan memberi ketelitian $53$ bit. Bias memungkinkan eksponen disimpan tanpa tandanya sendiri.
- **Bidang eksponen $0$:** nilai $\pm0$ jika pecahannya $0$, dan selain itu bilangan *subnormal* $(-1)^s\times\frac{F}{2^{52}}\times2^{-1022}$ tanpa angka $1$ tersirat.
- **Bidang eksponen $2047$** (berisi satu semua): $\pm\infty$ jika pecahannya $0$, dan selain itu NaN.

**Dua contoh.** Bilangan $-2{,}5=-1{,}25\times2^1$ bertanda $1$, bidang eksponen $1+1023=1024=10000000000_2$ dan pecahan $0100\ldots0$ (bagian $0{,}25$ dari $1{,}25$), sehingga polanya dalam heksadesimal adalah ´C004000000000000´. Bilangan $0{,}1$ adalah $1{,}6000000000000000888\ldots\times2^{-4}$: tanda $0$, bidang eksponen $1019$, dan pecahan yang berulang $1001\,1001\ldots$ dan dibulatkan ke atas di ujungnya, menghasilkan ´3FB999999999999A´. ´A´ terakhir itu adalah pembulatannya, dan itulah sebabnya nilai yang tersimpan adalah
$$0{,}1000000000000000055511151231257827021181583404541015625,$$
sedikit lebih dari $0{,}1$. Untuk single, bilangannya sama kecuali bias $127$ dan ada $8$ dan $23$ bit.

Ketik sebuah bilangan di bawah dan pilih format. Widget menunjukkan tiga bidang, rumus yang diwakilinya, nilai tepat yang tersimpan, galat pembulatannya, dan tetangga di atas dan di bawah.`,
          ),
        },
        { kind: 'widget', name: 'fpbits' },
      ],
    },

    /* ----------------------------------------------------------------------------------- spacing */
    {
      id: 'spacing',
      heading: L('Why are floating-point numbers not evenly spaced?', 'Mengapa bilangan floating-point tidak berjarak sama?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Between two consecutive powers of two, $2^k$ and $2^{k+1}$, a format always has the same number of values ($2^{52}$ for a double), so the gap between neighbors is $2^{k-52}$ and doubles at each power of two.** Near $1$ the gap is $2^{-52}\approx2.2\times10^{-16}$; near $1000$ it is $1.1\times10^{-13}$; near $10^{16}$ it is $2$. The *relative* spacing, the gap divided by the number, stays between $2^{-53}$ and $2^{-52}$ everywhere, and that is what "about 16 digits" means. The gap between a number and the next one is called an *ulp*, the unit in the last place.

A format with very few bits shows it plainly. Take $1$ sign bit, $3$ exponent bits (bias $3$) and $2$ fraction bits. Its non-negative numbers are
$$0,\ \tfrac1{16},\ \tfrac1{8},\ \tfrac3{16},\ \tfrac14,\ \tfrac5{16},\ \tfrac38,\ \tfrac7{16},\ \tfrac12,\ \tfrac58,\ \tfrac34,\ \tfrac78,\ 1,\ \tfrac54,\ \tfrac32,\ \tfrac74,\ 2,\ \ldots,\ 14.$$
Between $\frac14$ and $\frac12$ there are four numbers, a quarter of the gap apart, as there are between $1$ and $2$, but there the gap is four times larger. The numbers below $\frac14$, the *subnormal* numbers, share one gap, $\frac1{16}$, which is the gap of the first binade: that is what lets the format reach $0$ gradually instead of jumping from $\frac14$ to $0$.

Two consequences matter in code. First, **integers are exact only up to $2^{53}$** in a double ($9\,007\,199\,254\,740\,992$) and up to $2^{24}=16\,777\,216$ in a single: above that the gap is $2$, so $2^{53}+1$ rounds back to $2^{53}$. Second, a large number *absorbs* a small one: ´1e16 + 1 == 1e16´ is true.

Choose the number of bits below and slide through the numbers. The table gives the gap of each power of two.`,
            T`**Di antara dua pangkat dua berurutan, $2^k$ dan $2^{k+1}$, suatu format selalu memiliki jumlah nilai yang sama ($2^{52}$ untuk double), sehingga jarak antartetangga adalah $2^{k-52}$ dan berlipat dua di setiap pangkat dua.** Di dekat $1$ jaraknya $2^{-52}\approx2{,}2\times10^{-16}$; di dekat $1000$ jaraknya $1{,}1\times10^{-13}$; di dekat $10^{16}$ jaraknya $2$. Jarak *relatif*, jarak dibagi bilangannya, tetap di antara $2^{-53}$ dan $2^{-52}$ di mana-mana, dan itulah arti "sekitar 16 angka". Jarak antara sebuah bilangan dan bilangan berikutnya disebut *ulp*, unit pada tempat terakhir.

Format dengan sangat sedikit bit memperlihatkannya dengan jelas. Ambil $1$ bit tanda, $3$ bit eksponen (bias $3$), dan $2$ bit pecahan. Bilangan tak negatifnya adalah
$$0,\ \tfrac1{16},\ \tfrac1{8},\ \tfrac3{16},\ \tfrac14,\ \tfrac5{16},\ \tfrac38,\ \tfrac7{16},\ \tfrac12,\ \tfrac58,\ \tfrac34,\ \tfrac78,\ 1,\ \tfrac54,\ \tfrac32,\ \tfrac74,\ 2,\ \ldots,\ 14.$$
Di antara $\frac14$ dan $\frac12$ ada empat bilangan, berjarak seperempat celah, seperti di antara $1$ dan $2$, tetapi di sana jaraknya empat kali lebih besar. Bilangan di bawah $\frac14$, bilangan *subnormal*, berbagi satu jarak, $\frac1{16}$, yaitu jarak binade pertama: itulah yang membuat format mencapai $0$ secara bertahap, bukan melompat dari $\frac14$ ke $0$.

Dua akibat penting dalam kode. Pertama, **bilangan bulat tepat hanya sampai $2^{53}$** pada double ($9\,007\,199\,254\,740\,992$) dan sampai $2^{24}=16\,777\,216$ pada single: di atasnya jaraknya $2$, sehingga $2^{53}+1$ dibulatkan kembali ke $2^{53}$. Kedua, bilangan besar *menyerap* bilangan kecil: ´1e16 + 1 == 1e16´ bernilai benar.

Pilih banyaknya bit di bawah dan geser melewati bilangannya. Tabel memberi jarak tiap pangkat dua.`,
          ),
        },
        { kind: 'widget', name: 'fptoy' },
      ],
    },

    /* ---------------------------------------------------------------------------------- rounding */
    {
      id: 'rounding',
      heading: L('How does a computer round, and what is machine epsilon?', 'Bagaimana komputer membulatkan, dan apa itu epsilon mesin?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**IEEE 754 requires that + − × ÷ and the square root give the correctly rounded result: the exact answer rounded to the nearest number of the format, and in a tie to the one whose last fraction bit is even.** Rounding to the nearest even avoids a bias: with ties always rounded up, long calculations would drift upward. The other modes (toward $0$, toward $+\infty$, toward $-\infty$) exist for interval arithmetic and special cases.

**The standard model.** Provided nothing overflows or underflows,
$$\mathrm{fl}(a\circ b)=(a\circ b)(1+\delta),\qquad|\delta|\le u,$$
where $\circ$ is any of the operations and $u=2^{-53}\approx1.11\times10^{-16}$ for a double is the *unit roundoff*. Each operation is as accurate as the format allows, and the whole story of numerical error is how these small relative errors combine.

**Machine epsilon.** The gap between $1$ and the next double is $2^{-52}\approx2.22\times10^{-16}$, called the machine epsilon (in Python ´sys.float_info.epsilon´, in JavaScript ´Number.EPSILON´); it is twice the unit roundoff. In a single it is $2^{-23}\approx1.19\times10^{-7}$ and in a half $2^{-10}\approx9.8\times10^{-4}$.

**What is exact.** The result of an operation is exact when it fits: integers up to $2^{53}$, fractions with a power of two in the denominator such as $0.5$ and $0.375$, and anything times a power of two (unless it overflows or underflows). That is why $0.5+0.25=0.75$ is true in floating point while $0.1+0.2=0.3$ is not: the sum $0.1+0.2$ is $0.30000000000000004$, one ulp above the double that is nearest to $0.3$.`,
            T`**IEEE 754 mewajibkan + − × ÷ dan akar kuadrat menghasilkan hasil yang dibulatkan dengan tepat: jawaban eksak yang dibulatkan ke bilangan format terdekat, dan pada seri ke yang bit pecahan terakhirnya genap.** Pembulatan ke genap terdekat menghindari bias: dengan seri selalu dibulatkan ke atas, perhitungan panjang akan bergeser ke atas. Mode lain (ke arah $0$, ke arah $+\infty$, ke arah $-\infty$) ada untuk aritmetika selang dan kasus khusus.

**Model standar.** Asalkan tidak ada overflow atau underflow,
$$\mathrm{fl}(a\circ b)=(a\circ b)(1+\delta),\qquad|\delta|\le u,$$
dengan $\circ$ operasi apa pun dan $u=2^{-53}\approx1{,}11\times10^{-16}$ untuk double adalah *pembulatan satuan*. Setiap operasi seteliti yang diizinkan format, dan seluruh cerita galat numerik adalah bagaimana galat relatif kecil ini bergabung.

**Epsilon mesin.** Jarak antara $1$ dan double berikutnya adalah $2^{-52}\approx2{,}22\times10^{-16}$, disebut epsilon mesin (di Python ´sys.float_info.epsilon´, di JavaScript ´Number.EPSILON´); ia dua kali pembulatan satuan. Pada single nilainya $2^{-23}\approx1{,}19\times10^{-7}$ dan pada half $2^{-10}\approx9{,}8\times10^{-4}$.

**Apa yang tepat.** Hasil sebuah operasi tepat bila muat: bilangan bulat sampai $2^{53}$, pecahan dengan pangkat dua di penyebut seperti $0{,}5$ dan $0{,}375$, dan apa pun dikali pangkat dua (kecuali overflow atau underflow). Itulah sebabnya $0{,}5+0{,}25=0{,}75$ benar dalam floating point sedangkan $0{,}1+0{,}2=0{,}3$ tidak: jumlah $0{,}1+0{,}2$ adalah $0{,}30000000000000004$, satu ulp di atas double yang terdekat dengan $0{,}3$.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- special */
    {
      id: 'special-values',
      heading: L('What are infinity, NaN, negative zero and subnormal numbers?', 'Apa itu tak hingga, NaN, nol negatif, dan bilangan subnormal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**IEEE 754 reserves some patterns for values that are not ordinary numbers, so that every operation has an answer and a long calculation does not stop at the first problem.**

- **Infinity.** An exponent field of all ones with fraction $0$ is $\pm\infty$. It is the result of an overflow, such as ´Number.MAX_VALUE * 10´, and of dividing a non-zero number by zero in JavaScript or C. Python raises ´ZeroDivisionError´ for ´1 / 0.0´, but ´float('inf')´ exists, and NumPy returns ´inf´ with a warning.
- **NaN**, "not a number". An exponent field of all ones with a non-zero fraction. It is the result of $0/0$, $\infty-\infty$ and $\sqrt{-1}$ (where these do not raise errors). NaN is *unordered*: it is not equal to anything, **not even itself**, so ´x != x´ is the test for NaN (or ´isnan´, ´Number.isNaN´, ´Object.is´), and every comparison with NaN is false. It spreads: any operation with a NaN gives NaN.
- **Negative zero.** Sign $1$ with everything else $0$. It is equal to $0$ in comparisons, but $\frac1{+0}=+\infty$ and $\frac1{-0}=-\infty$, which keeps the sign of a limit that approaches $0$ from below.
- **Subnormal numbers.** Without them the smallest positive double would be the smallest normal number $2^{-1022}\approx2.2\times10^{-308}$, with a gap to $0$ much larger than the gaps near it. The subnormal numbers (exponent field $0$) fill that gap evenly down to $2^{-1074}\approx4.9\times10^{-324}$, so underflow is *gradual*: $x-y=0$ happens only when $x=y$.

**Overflow and underflow.** A result above the largest double, $1.7976931348623157\times10^{308}$, rounds to $\infty$; a result below half of $2^{-1074}$ rounds to $0$. In practice these appear in products and in exponentials, and the cure is to work with logarithms, or to scale: the length of a vector $\sqrt{x^2+y^2}$ overflows for $x=10^{200}$ although the answer does not, and ´hypot(x, y)´ avoids it.`,
            T`**IEEE 754 mencadangkan beberapa pola untuk nilai yang bukan bilangan biasa, sehingga setiap operasi punya jawaban dan perhitungan panjang tidak berhenti pada masalah pertama.**

- **Tak hingga.** Bidang eksponen berisi satu semua dengan pecahan $0$ adalah $\pm\infty$. Ia hasil overflow, seperti ´Number.MAX_VALUE * 10´, dan dari membagi bilangan tak nol dengan nol di JavaScript atau C. Python memunculkan ´ZeroDivisionError´ untuk ´1 / 0.0´, tetapi ´float('inf')´ ada, dan NumPy mengembalikan ´inf´ dengan peringatan.
- **NaN**, "bukan bilangan". Bidang eksponen berisi satu semua dengan pecahan tak nol. Ia hasil $0/0$, $\infty-\infty$, dan $\sqrt{-1}$ (bila ini tidak memunculkan galat). NaN *tak terurut*: ia tidak sama dengan apa pun, **bahkan tidak dengan dirinya sendiri**, sehingga ´x != x´ adalah uji untuk NaN (atau ´isnan´, ´Number.isNaN´, ´Object.is´), dan setiap perbandingan dengan NaN salah. Ia menular: operasi apa pun dengan NaN menghasilkan NaN.
- **Nol negatif.** Tanda $1$ dengan sisanya $0$. Ia sama dengan $0$ dalam perbandingan, tetapi $\frac1{+0}=+\infty$ dan $\frac1{-0}=-\infty$, yang menjaga tanda limit yang mendekati $0$ dari bawah.
- **Bilangan subnormal.** Tanpa mereka, double positif terkecil adalah bilangan normal terkecil $2^{-1022}\approx2{,}2\times10^{-308}$, dengan celah ke $0$ jauh lebih besar daripada celah di dekatnya. Bilangan subnormal (bidang eksponen $0$) mengisi celah itu secara merata sampai $2^{-1074}\approx4{,}9\times10^{-324}$, sehingga underflow berlangsung *bertahap*: $x-y=0$ hanya terjadi ketika $x=y$.

**Overflow dan underflow.** Hasil di atas double terbesar, $1{,}7976931348623157\times10^{308}$, dibulatkan ke $\infty$; hasil di bawah setengah $2^{-1074}$ dibulatkan ke $0$. Dalam praktik ini muncul pada hasil kali dan eksponensial, dan obatnya adalah bekerja dengan logaritma, atau menskalakan: panjang vektor $\sqrt{x^2+y^2}$ overflow untuk $x=10^{200}$ padahal jawabannya tidak, dan ´hypot(x, y)´ menghindarinya.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------------- accumulation */
    {
      id: 'accumulation',
      heading: L('Why do rounding errors add up, and how do you limit them?', 'Mengapa galat pembulatan menumpuk, dan bagaimana membatasinya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Each addition rounds, and the rounding errors of a long sum do not cancel: they add up, and the error of a naive sum grows roughly in proportion to the number of terms.** Add $0.1$ ten times in a double, one at a time, and the result is $0.9999999999999999$; in a single it is $1.0000001192092896$. Add it a million times and a double gives $100000.00000133288$, off by $1.3\times10^{-6}$, about $90\,000$ ulps. The bound for $n$ terms is about $n\cdot u$ times the sum of the absolute values.

A large partial sum also **absorbs** small terms: once the total is $2^{53}$ the gap is $2$, so adding $1$ changes nothing, however many times you do it.

**Three remedies.**
1. **Kahan summation** keeps a second number $c$ that holds the part that was rounded away in the last addition, and puts it back in the next one:
   $y=x_i-c$, $t=s+y$, $c=(t-s)-y$, $s=t$. The error then no longer grows with $n$: it stays within an ulp or two. A compiler that rearranges floating-point arithmetic freely can remove the compensation, so the option for strict arithmetic matters.
2. **Pairwise summation** adds in a tree, so that the terms have a similar size and the error grows like $\log n$ instead of $n$. NumPy does this.
3. **Exact summation.** Python's ´math.fsum´ returns the correctly rounded sum of the exact values by keeping partial sums that do not lose anything. It is the reference to use in tests.

Since Python 3.12 the built-in ´sum´ of floats also uses a compensated algorithm, so ´sum([0.1] * 10)´ gives ´1.0´ there, whereas a plain loop still gives ´0.9999999999999999´.

Try it below: pick a value, a count and a precision.`,
            T`**Setiap penjumlahan membulatkan, dan galat pembulatan pada jumlah yang panjang tidak saling menghapus: ia menumpuk, dan galat jumlah naif tumbuh kira-kira sebanding dengan banyaknya suku.** Jumlahkan $0{,}1$ sepuluh kali pada double, satu per satu, dan hasilnya $0{,}9999999999999999$; pada single hasilnya $1{,}0000001192092896$. Jumlahkan sejuta kali dan double memberi $100000{,}00000133288$, meleset $1{,}3\times10^{-6}$, sekitar $90\,000$ ulp. Batas untuk $n$ suku sekitar $n\cdot u$ kali jumlah nilai mutlaknya.

Jumlah parsial yang besar juga **menyerap** suku kecil: begitu totalnya $2^{53}$ jaraknya $2$, sehingga menambah $1$ tidak mengubah apa pun, berapa kali pun kamu melakukannya.

**Tiga obat.**
1. **Penjumlahan Kahan** menyimpan bilangan kedua $c$ yang memuat bagian yang dibulatkan pada penjumlahan terakhir, dan memasukkannya kembali pada penjumlahan berikutnya:
   $y=x_i-c$, $t=s+y$, $c=(t-s)-y$, $s=t$. Galatnya lalu tidak lagi tumbuh bersama $n$: ia tetap dalam satu atau dua ulp. Kompilator yang menyusun ulang aritmetika floating-point dengan bebas dapat menghilangkan kompensasinya, sehingga opsi untuk aritmetika ketat penting.
2. **Penjumlahan berpasangan** menjumlahkan dalam pohon, sehingga suku-sukunya berukuran mirip dan galat tumbuh seperti $\log n$, bukan $n$. NumPy melakukannya.
3. **Penjumlahan tepat.** ´math.fsum´ di Python mengembalikan jumlah nilai eksak yang dibulatkan dengan tepat dengan menyimpan jumlah parsial yang tidak kehilangan apa pun. Ia acuan yang dipakai dalam uji.

Sejak Python versi ´3.12´ ´sum´ bawaan untuk float juga memakai algoritma berkompensasi, sehingga ´sum([0.1] * 10)´ memberi ´1.0´ di sana, sedangkan perulangan biasa tetap memberi ´0.9999999999999999´.

Cobalah di bawah: pilih nilai, jumlah, dan ketelitian.`,
          ),
        },
        { kind: 'widget', name: 'fpsum' },
      ],
    },

    /* ------------------------------------------------------------------------------ cancellation */
    {
      id: 'cancellation',
      heading: L('What is catastrophic cancellation?', 'Apa itu pembatalan katastrofik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When two nearly equal numbers are subtracted, the leading digits cancel and what is left is mostly the old rounding errors: the result is exact, but the information in it is gone.** Take two computed numbers $a\approx1.0000000000000002$ and $b\approx1$. Each carries a relative error of up to $10^{-16}$, and their difference $2.2\times10^{-16}$ is computed without any new error, but it is of the same size as the errors that $a$ and $b$ already had, so the difference may have no correct digit. The relative error of a subtraction is magnified by about $\frac{|a|+|b|}{|a-b|}$.

**Examples.**
- $\dfrac{1-\cos x}{x^2}$ for $x=10^{-8}$: $\cos x=1-5\times10^{-17}$ rounds to $1$, so the naive formula gives $0$, and the true value is $\frac12$. Using $1-\cos x=2\sin^2\frac x2$ gives $0.5$.
- $\dfrac{e^x-1}{x}$ for $x=10^{-15}$: $e^x$ rounds to $1.000000000000001$, and the naive formula gives $1.1102230246251565$ instead of $1$. The library function ´expm1(x)´ computes $e^x-1$ directly, and gives $1.0000000000000004$ (the last digit is rounding).
- $\sqrt{x^2+1}-x$ for large $x$: for $x=10^8$ the naive formula gives $0$; the stable form $\dfrac1{\sqrt{x^2+1}+x}$ gives $5\times10^{-9}$.
- The small root of $x^2-bx+1=0$ for $b=10^8$: $\frac{b-\sqrt{b^2-4}}{2}$ gives $7.45\times10^{-9}$, while the stable form $\frac{2}{b+\sqrt{b^2-4}}$ gives the correct $10^{-8}$.

**The cure** is almost never more precision: it is to avoid the subtraction by algebra (a conjugate, an identity), by a series for small $x$, or by a library function made for it (´expm1´, ´log1p´, ´hypot´). Cancellation also explains why the difference quotient with a tiny $h$ in numerical differentiation gets worse, not better, below $h\approx10^{-8}$.

Move $x$ in each of the four cases below and read the number of correct digits.`,
            T`**Ketika dua bilangan yang hampir sama dikurangkan, angka terdepan saling menghapus dan yang tersisa kebanyakan galat pembulatan lama: hasilnya eksak, tetapi informasi di dalamnya hilang.** Ambil dua bilangan hasil hitung $a\approx1{,}0000000000000002$ dan $b\approx1$. Masing-masing membawa galat relatif sampai $10^{-16}$, dan selisihnya $2{,}2\times10^{-16}$ dihitung tanpa galat baru, tetapi ia sebesar galat yang sudah dimiliki $a$ dan $b$, sehingga selisihnya mungkin tidak memiliki satu pun angka benar. Galat relatif pengurangan diperbesar sekitar $\frac{|a|+|b|}{|a-b|}$.

**Contoh.**
- $\dfrac{1-\cos x}{x^2}$ untuk $x=10^{-8}$: $\cos x=1-5\times10^{-17}$ dibulatkan ke $1$, sehingga rumus naif memberi $0$, padahal nilai sebenarnya $\frac12$. Memakai $1-\cos x=2\sin^2\frac x2$ memberi $0{,}5$.
- $\dfrac{e^x-1}{x}$ untuk $x=10^{-15}$: $e^x$ dibulatkan ke $1{,}000000000000001$, dan rumus naif memberi $1{,}1102230246251565$, bukan $1$. Fungsi pustaka ´expm1(x)´ menghitung $e^x-1$ langsung, dan memberi $1{,}0000000000000004$ (angka terakhir adalah pembulatan).
- $\sqrt{x^2+1}-x$ untuk $x$ besar: untuk $x=10^8$ rumus naif memberi $0$; bentuk stabil $\dfrac1{\sqrt{x^2+1}+x}$ memberi $5\times10^{-9}$.
- Akar kecil $x^2-bx+1=0$ untuk $b=10^8$: $\frac{b-\sqrt{b^2-4}}{2}$ memberi $7{,}45\times10^{-9}$, sedangkan bentuk stabil $\frac{2}{b+\sqrt{b^2-4}}$ memberi $10^{-8}$ yang benar.

**Obatnya** hampir tidak pernah ketelitian lebih besar: ia menghindari pengurangan dengan aljabar (sekawan, identitas), dengan deret untuk $x$ kecil, atau dengan fungsi pustaka yang dibuat untuknya (´expm1´, ´log1p´, ´hypot´). Pembatalan juga menjelaskan mengapa hasil bagi selisih dengan $h$ sangat kecil pada diferensiasi numerik justru memburuk, bukan membaik, di bawah $h\approx10^{-8}$.

Geser $x$ pada tiap empat kasus di bawah dan baca banyaknya angka benar.`,
          ),
        },
        { kind: 'widget', name: 'fpcancel' },
      ],
    },

    /* ---------------------------------------------------------------------------------- comparing */
    {
      id: 'comparing',
      heading: L('How should you compare two floating-point numbers?', 'Bagaimana membandingkan dua bilangan floating-point?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Compare computed floats with a tolerance that has a relative part and an absolute part: $|a-b|\le\max\left(\text{rel}\cdot\max(|a|,|b|),\ \text{abs}\right)$.** This is what Python's ´math.isclose(a, b, rel_tol=1e-09, abs_tol=0.0)´ does, and what you write by hand in JavaScript and C++.

- A purely **absolute** tolerance such as $10^{-9}$ is wrong for large numbers: near $10^{16}$ two neighbors are $2$ apart, so no two different numbers are within $10^{-9}$, and near $10^{-12}$ everything is "equal".
- A purely **relative** tolerance is wrong near zero: $10^{-300}$ and $0$ are not close in relative terms, although both are "zero" for the problem. So give an absolute part, as small as the scale of the data justifies, when the true value can be zero.
- The relative part should be a few times the unit roundoff times the number of operations: $10^{-9}$ is a common choice for doubles, and about $10^{-5}$ for singles.
- **ulps.** In tests of numerical code the distance in ulps, the number of floats between the two numbers, is a measure that scales with the size: ´0.1 + 0.2´ and ´0.3´ are $1$ ulp apart.
- **Never loop on equality.** ´while x != 1.0: x += 0.1´ never ends, because $x$ steps over $1.0$ and goes on forever. Count with an integer, or loop while ´x < 1.0 - 1e-9´.
- **NaN** is never close to anything, itself included; test for it separately.

**Money.** Prices are not real numbers: they are integers of the smallest unit. Store cents, or use a decimal type (Python ´decimal.Decimal´, Java ´BigDecimal´, C# ´decimal´), where $0.1+0.2=0.3$ holds exactly because the base is $10$.`,
            T`**Bandingkan float hasil hitung dengan toleransi yang memiliki bagian relatif dan bagian mutlak: $|a-b|\le\max\left(\text{rel}\cdot\max(|a|,|b|),\ \text{abs}\right)$.** Inilah yang dilakukan ´math.isclose(a, b, rel_tol=1e-09, abs_tol=0.0)´ di Python, dan yang kamu tulis sendiri di JavaScript dan C++.

- Toleransi **mutlak** murni seperti $10^{-9}$ salah untuk bilangan besar: di dekat $10^{16}$ dua tetangga berjarak $2$, sehingga tidak ada dua bilangan berbeda yang berjarak kurang dari $10^{-9}$, dan di dekat $10^{-12}$ semuanya "sama".
- Toleransi **relatif** murni salah di dekat nol: $10^{-300}$ dan $0$ tidak dekat secara relatif, padahal keduanya "nol" bagi soalnya. Jadi beri bagian mutlak, sekecil yang dibenarkan skala datanya, bila nilai sebenarnya dapat nol.
- Bagian relatif sebaiknya beberapa kali pembulatan satuan dikali banyaknya operasi: $10^{-9}$ pilihan umum untuk double, dan sekitar $10^{-5}$ untuk single.
- **ulp.** Dalam uji kode numerik jarak dalam ulp, banyaknya float di antara kedua bilangan, adalah ukuran yang menyesuaikan dengan besarnya: ´0.1 + 0.2´ dan ´0.3´ berjarak $1$ ulp.
- **Jangan pernah mengulang berdasarkan kesamaan.** ´while x != 1.0: x += 0.1´ tidak pernah berhenti, karena $x$ melangkahi $1{,}0$ dan terus berjalan. Hitung dengan bilangan bulat, atau ulangi selama ´x < 1.0 - 1e-9´.
- **NaN** tidak pernah dekat dengan apa pun, termasuk dirinya; ujilah secara terpisah.

**Uang.** Harga bukan bilangan real: ia bilangan bulat dari satuan terkecil. Simpan sen, atau pakai tipe desimal (´decimal.Decimal´ di Python, ´BigDecimal´ di Java, ´decimal´ di C#), tempat $0{,}1+0{,}2=0{,}3$ berlaku tepat karena basisnya $10$.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- choosing */
    {
      id: 'choosing',
      heading: L('Which type should you use: float16, float32, float64 or a decimal?', 'Tipe apa yang dipakai: float16, float32, float64, atau desimal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use a double unless you have a reason not to; use less precision when memory and speed matter more than digits, and an exact type when the answer must be exact.**

- **float64 (double):** the default for science and engineering and for most programs. About 16 digits and a range up to $10^{308}$.
- **float32 (single):** graphics, games and GPUs, where $7$ digits are enough and halving the memory doubles the throughput. Be careful with sums of many terms and with integers above $2^{24}$ (it counts from $16\,777\,216$ upward in steps of $2$).
- **float16 and bfloat16:** machine learning. Half precision has $11$ bits of precision and a maximum of $65504$; bfloat16 keeps the range of a single (8 exponent bits) with only $8$ bits of precision, which suits the large dynamic range of neural-network training. Both are used with care, often accumulating in float32.
- **Decimal, integers, fractions:** money, counts and exact ratios. Python's ´fractions.Fraction´ and ´decimal.Decimal´ are exact for the numbers they can hold but slower.
- **Arbitrary precision** (´mpmath´, ´BigDecimal´, GMP): when a calculation needs more digits than a double has, at a cost in speed.

**Two famous failures.** In February 1991 a Patriot missile battery at Dhahran failed to intercept a Scud. Its clock counted tenths of a second in a $24$-bit register, and $0.1$ is not exact in binary: the error was about $0.000000095$ s per tick, which after about $100$ hours of operation was about $0.34$ s, enough for a Scud, which travels more than $1.6$ km each second, to be half a kilometer away from where the system looked for it. In June 1996 the first Ariane 5 rocket was lost about $37$ seconds after launch when a $64$-bit floating-point value was converted to a $16$-bit signed integer that was too small for it: an overflow, not a rounding error, but in the same family, a conversion that was never checked.`,
            T`**Pakai double kecuali ada alasan untuk tidak; pakai ketelitian lebih rendah bila memori dan kecepatan lebih penting daripada angka, dan tipe eksak bila jawabannya harus eksak.**

- **float64 (double):** bawaan untuk sains dan rekayasa dan untuk kebanyakan program. Sekitar 16 angka dan rentang sampai $10^{308}$.
- **float32 (single):** grafika, permainan, dan GPU, tempat $7$ angka cukup dan separuh memori melipatduakan lajunya. Hati-hati dengan jumlah banyak suku dan dengan bilangan bulat di atas $2^{24}$ (ia mencacah dari $16\,777\,216$ ke atas dengan langkah $2$).
- **float16 dan bfloat16:** pembelajaran mesin. Half punya ketelitian $11$ bit dan maksimum $65504$; bfloat16 mempertahankan rentang single (8 bit eksponen) dengan ketelitian hanya $8$ bit, yang cocok untuk rentang dinamis besar pelatihan jaringan saraf. Keduanya dipakai dengan hati-hati, sering dengan akumulasi dalam float32.
- **Desimal, bilangan bulat, pecahan:** uang, hitungan, dan rasio eksak. ´fractions.Fraction´ dan ´decimal.Decimal´ di Python eksak untuk bilangan yang dapat mereka muat tetapi lebih lambat.
- **Ketelitian sembarang** (´mpmath´, ´BigDecimal´, GMP): ketika perhitungan memerlukan lebih banyak angka daripada yang dimiliki double, dengan biaya kecepatan.

**Dua kegagalan terkenal.** Pada Februari 1991 baterai rudal Patriot di Dhahran gagal mencegat sebuah Scud. Jamnya menghitung persepuluh detik dalam register $24$ bit, dan $0{,}1$ tidak eksak dalam biner: galatnya sekitar $0{,}000000095$ detik per detakan, yang setelah sekitar $100$ jam operasi menjadi sekitar $0{,}34$ detik, cukup agar Scud, yang menempuh lebih dari $1{,}6$ km setiap detik, berada setengah kilometer dari tempat sistem mencarinya. Pada Juni 1996 roket Ariane 5 pertama hilang sekitar $37$ detik setelah peluncuran ketika sebuah nilai floating-point $64$ bit diubah menjadi bilangan bulat bertanda $16$ bit yang terlalu kecil untuknya: overflow, bukan galat pembulatan, tetapi dalam keluarga yang sama, konversi yang tidak pernah diperiksa.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- in code */
    {
      id: 'float-in-code',
      heading: L('How do you inspect floating-point numbers in code?', 'Bagaimana memeriksa bilangan floating-point dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Every language lets you look at the bits and the spacing: Python with ´struct´, ´math.ulp´ and ´decimal.Decimal´, JavaScript with a ´DataView´, and C++ with a loop that finds the machine epsilon.** The programs below show the bit patterns of $0.1$ and $-2.5$, the exact value of $0.1$, the epsilon and the ulp, the neighbor of ´0.1 + 0.2´, the three kinds of sum, absorption, tolerance comparison, cancellation and NaN.`,
            T`**Setiap bahasa memungkinkanmu melihat bit dan jaraknya: Python dengan ´struct´, ´math.ulp´, dan ´decimal.Decimal´, JavaScript dengan ´DataView´, dan C++ dengan perulangan yang mencari epsilon mesin.** Program di bawah menunjukkan pola bit $0{,}1$ dan $-2{,}5$, nilai tepat $0{,}1$, epsilon dan ulp, tetangga ´0.1 + 0.2´, tiga jenis jumlah, penyerapan, perbandingan dengan toleransi, pembatalan, dan NaN.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: bits, spacing, sums, tolerance and cancellation', 'Python: bit, jarak, jumlah, toleransi, dan pembatalan'),
          code: `import math
import struct
import sys
from decimal import Decimal


def bits(x):
    """The 64 bits of a double as sign, exponent and fraction."""
    b = format(struct.unpack('>Q', struct.pack('>d', x))[0], '064b')
    return b[0], b[1:12], b[12:]


def naive(xs):
    total = 0.0
    for x in xs:
        total += x
    return total


def kahan(xs):
    total = comp = 0.0
    for x in xs:
        y = x - comp
        t = total + y
        comp = (t - total) - y
        total = t
    return total


print(bits(0.1))
print(bits(-2.5))
print(Decimal(0.1))
print(sys.float_info.epsilon, math.ulp(1.0), math.ulp(2.0 ** 53))
print(math.nextafter(0.1 + 0.2, 0.0) == 0.3)
print(naive([0.1] * 10), kahan([0.1] * 10), math.fsum([0.1] * 10))
print(naive([0.1] * 1000000), kahan([0.1] * 1000000), math.fsum([0.1] * 1000000))
print(1e16 + 1 == 1e16, 2.0 ** 53 + 1 == 2.0 ** 53)
print(math.isclose(0.1 + 0.2, 0.3), 0.1 + 0.2 == 0.3)
x = 1e-8
print((1 - math.cos(x)) / x ** 2, 2 * math.sin(x / 2) ** 2 / x ** 2)
print((math.exp(1e-15) - 1) / 1e-15, math.expm1(1e-15) / 1e-15)
print(float('nan') == float('nan'), math.isnan(float('nan')), float('inf') - float('inf'))
print(Decimal('0.1') + Decimal('0.2') == Decimal('0.3'))
# ('0', '01111111011', '1001100110011001100110011001100110011001100110011010')
# ('1', '10000000000', '0100000000000000000000000000000000000000000000000000')
# 0.1000000000000000055511151231257827021181583404541015625
# 2.220446049250313e-16 2.220446049250313e-16 2.0
# True
# 0.9999999999999999 1.0 1.0
# 100000.00000133288 100000.0 100000.0
# True True
# True False
# 0.0 0.5
# 1.1102230246251565 1.0000000000000004
# False True nan
# True`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: a DataView, EPSILON, and the special values', 'JavaScript: DataView, EPSILON, dan nilai khusus'),
          code: `const bits = (x) => {
  const v = new DataView(new ArrayBuffer(8))
  v.setFloat64(0, x)
  return v.getBigUint64(0).toString(2).padStart(64, '0')
}
bits(1)                                  // '0011111111110000000000000000000000000000000000000000000000000000'
bits(0.1)                                // '0011111110111001100110011001100110011001100110011001100110011010'
Number.EPSILON                           // 2.220446049250313e-16
;[Math.fround(0.1), 0.1]                 // [0.10000000149011612, 0.1]: the nearest single to 0.1
;[2 ** 53 + 1 === 2 ** 53, 2 ** 53 + 2]  // [true, 9007199254740994]
;[0 / 0, 1 / 0, 1 / -0]                  // [NaN, Infinity, -Infinity]
;[NaN === NaN, Object.is(NaN, NaN)]      // [false, true]
;[Object.is(0, -0), 0 === -0]            // [false, true]
;[Number.MAX_VALUE * 10, 5e-324 / 2]     // [Infinity, 0]: overflow, and underflow past the smallest subnormal
;[0.1 + 0.2, 0.1 + 0.2 === 0.3]          // [0.30000000000000004, false]
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true: a tolerance of one machine epsilon is fine near 1
;[Math.fround(16777217), 16777217]       // [16777216, 16777217]: a single cannot hold 2^24 + 1
let s32 = 0
for (let i = 0; i < 10; i++) s32 = Math.fround(s32 + Math.fround(0.1))
s32                                      // 1.0000001192092896: ten tenths in single precision`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the machine epsilon, a sum and absorption', 'C++: epsilon mesin, sebuah jumlah, dan penyerapan'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

int main() {
  double eps = 1;
  int count = 0;
  while (1 + eps / 2 > 1) {                              // halve until 1 + eps/2 is rounded back to 1
    eps = eps / 2;
    count = count + 1;
  }
  printf("%d %.17f\\n", count, eps);                      // 52 halvings: eps = 2^-52
  double s = 0;
  for (int i = 0; i < 10; i++) s = s + 0.1;
  printf("%.17f %d\\n", s, s == 1.0);                     // ten times 0.1 is not 1
  double big = 9007199254740992.0;                      // 2^53
  printf("%d %d\\n", big + 1 == big, big + 2 == big);     // 1 0: the 1 is absorbed, the 2 is a whole gap
  return 0;
}

/* output:
52 0.00000000000000022
0.99999999999999989 0
1 0
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does floating point come from?', 'Dari mana floating-point berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Floating point is older than the electronic computer, and for decades each machine had its own format until a standard made programs portable.**

- **1914.** Leonardo Torres Quevedo proposed floating-point arithmetic for a mechanical calculator in his *Essays on Automatics*.
- **1930s–1941.** Konrad Zuse's machines, the Z1 and the Z3, used binary floating point, with a sign, an exponent and a fraction.
- **1954.** The IBM 704 had floating-point arithmetic in hardware, and through the 1960s and 1970s every maker chose its own base, size and rounding, so that the same program gave different answers on different computers.
- **1980s.** William Kahan, who had worked on Intel's 8087 coprocessor, led the committee that wrote **IEEE 754**, published in 1985: formats, correct rounding, infinities, NaN and gradual underflow. Kahan received the Turing Award in 1989.
- **1994.** The Pentium FDIV bug, a few wrong entries in a table used by the divider, gave results that were wrong in the fourth or fifth significant digit or beyond, and showed that floating-point hardware had to be tested as carefully as software; Intel recalled the chips.
- **2008 and 2019.** The standard was revised: fused multiply-add (computing $a\times b+c$ with one rounding), decimal formats, half precision as an exchange format, and clearer rules for NaN and for operations such as the minimum and the maximum.
- **2010s.** bfloat16, with the exponent range of a single and only $8$ bits of precision, was designed for machine-learning hardware, and half precision became common on GPUs.`,
            T`**Floating-point lebih tua daripada komputer elektronik, dan selama puluhan tahun setiap mesin memiliki formatnya sendiri sampai sebuah standar membuat program dapat dipindahkan.**

- **1914.** Leonardo Torres Quevedo mengusulkan aritmetika floating-point untuk kalkulator mekanis dalam *Essays on Automatics*.
- **1930-an–1941.** Mesin Konrad Zuse, Z1 dan Z3, memakai floating-point biner, dengan tanda, eksponen, dan pecahan.
- **1954.** IBM 704 memiliki aritmetika floating-point di perangkat keras, dan sepanjang 1960-an dan 1970-an setiap pembuat memilih basis, ukuran, dan pembulatannya sendiri, sehingga program yang sama memberi jawaban berbeda di komputer berbeda.
- **1980-an.** William Kahan, yang pernah mengerjakan koprosesor 8087 Intel, memimpin panitia yang menulis **IEEE 754**, terbit pada 1985: format, pembulatan tepat, tak hingga, NaN, dan underflow bertahap. Kahan menerima Penghargaan Turing pada 1989.
- **1994.** Galat FDIV Pentium, beberapa entri yang salah pada tabel yang dipakai pembagi, memberi hasil yang salah pada angka signifikan keempat atau kelima atau lebih jauh, dan menunjukkan bahwa perangkat keras floating-point harus diuji secermat perangkat lunak; Intel menarik kembali cip itu.
- **2008 dan 2019.** Standar direvisi: fused multiply-add (menghitung $a\times b+c$ dengan satu pembulatan), format desimal, half precision sebagai format pertukaran, dan aturan yang lebih jelas untuk NaN dan untuk operasi seperti minimum dan maksimum.
- **2010-an.** bfloat16, dengan rentang eksponen single dan ketelitian hanya $8$ bit, dirancang untuk perangkat keras pembelajaran mesin, dan half precision menjadi umum pada GPU.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with floating-point numbers?', 'Kesalahan apa yang sering terjadi pada bilangan floating-point?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with floating-point numbers are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Test a computed float with ´==´ | Compare with a relative and an absolute tolerance, or by the distance in ulps. |
| ❌ Floats are evenly spaced | The gap doubles at every power of two: $2^{-52}$ near $1$, $2$ near $2^{53}$. |
| ❌ Floats hold all integers | Doubles are exact only up to $2^{53}$ and singles up to $2^{24}$. |
| ❌ A float has 16 digits after the point | It has about 16 significant digits, wherever the point is. |
| ❌ Add a small number to a big one and trust it | It may be absorbed: ´1e16 + 1 == 1e16´. |
| ❌ Use more precision to fix subtraction | Rewrite the formula so that nearly equal numbers are not subtracted. |
| ❌ Loop with ´while x != 1.0´ | The float steps over the value: count with an integer. |
| ❌ NaN equals NaN | NaN is not equal to anything, itself included; use ´isnan´. |
| ❌ Use floats for money | Store integer cents or use a decimal type. |`,
            T`**Kesalahan paling umum pada bilangan floating-point adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Menguji float hasil hitung dengan ´==´ | Bandingkan dengan toleransi relatif dan mutlak, atau dengan jarak dalam ulp. |
| ❌ Float berjarak sama | Jaraknya berlipat dua di setiap pangkat dua: $2^{-52}$ di dekat $1$, $2$ di dekat $2^{53}$. |
| ❌ Float memuat semua bilangan bulat | Double tepat hanya sampai $2^{53}$ dan single sampai $2^{24}$. |
| ❌ Float punya 16 angka setelah titik | Ia punya sekitar 16 angka signifikan, di mana pun titiknya. |
| ❌ Menambah bilangan kecil ke yang besar dan memercayainya | Ia dapat terserap: ´1e16 + 1 == 1e16´. |
| ❌ Memakai ketelitian lebih besar untuk memperbaiki pengurangan | Tulis ulang rumusnya agar bilangan yang hampir sama tidak dikurangkan. |
| ❌ Mengulang dengan ´while x != 1.0´ | Float melangkahi nilainya: hitung dengan bilangan bulat. |
| ❌ NaN sama dengan NaN | NaN tidak sama dengan apa pun, termasuk dirinya; pakai ´isnan´. |
| ❌ Memakai float untuk uang | Simpan sen sebagai bilangan bulat atau pakai tipe desimal. |`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- practice */
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
              L(T`A double stores 52 fraction bits but has 53 bits of precision.`, T`Double menyimpan 52 bit pecahan tetapi memiliki ketelitian 53 bit.`),
              L(T`The gap between neighboring doubles is the same everywhere.`, T`Jarak antara double bertetangga sama di mana-mana.`),
              L(T`NaN is equal to itself.`, T`NaN sama dengan dirinya sendiri.`),
              L(T`$-0$ and $+0$ compare as equal, but $\frac1{-0}=-\infty$.`, T`$-0$ dan $+0$ sama dalam perbandingan, tetapi $\frac1{-0}=-\infty$.`),
              L(T`Subtracting two nearly equal numbers can lose almost all the correct digits.`, T`Mengurangkan dua bilangan yang hampir sama dapat kehilangan hampir semua angka benar.`),
              L(T`A float is a good type for an amount of money.`, T`Float adalah tipe yang baik untuk sejumlah uang.`),
            ],
            answer: [true, false, false, true, true, false],
            explain: L(
              T`The leading 1 is implied, so 52 stored bits give 53 bits. The gap doubles at every power of two. NaN is not equal to anything. Cancellation exposes old rounding errors. Money should be integers or decimals.`,
              T`Angka 1 di depan tersirat, sehingga 52 bit tersimpan memberi 53 bit. Jaraknya berlipat dua di setiap pangkat dua. NaN tidak sama dengan apa pun. Pembatalan memperlihatkan galat pembulatan lama. Uang sebaiknya bilangan bulat atau desimal.`,
            ),
            hint: L(T`Recall the layout of a double and the section on cancellation.`, T`Ingat susunan sebuah double dan bagian tentang pembatalan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these expressions are true for doubles? Choose **all** that apply.`, T`Mana dari ungkapan berikut yang benar untuk double? Pilih **semua** yang benar.`),
            options: [
              L(T`´2.0 ** 53 + 1 == 2.0 ** 53´`, T`´2.0 ** 53 + 1 == 2.0 ** 53´`),
              L(T`´0.5 + 0.25 == 0.75´`, T`´0.5 + 0.25 == 0.75´`),
              L(T`´0.1 + 0.2 == 0.3´`, T`´0.1 + 0.2 == 0.3´`),
              L(T`´1e16 + 1 == 1e16´`, T`´1e16 + 1 == 1e16´`),
              L(T`´float('nan') == float('nan')´`, T`´float('nan') == float('nan')´`),
            ],
            answer: [0, 1, 3],
            explain: L(T`From $2^{53}$ the gap is $2$, so adding $1$ is absorbed, and at $10^{16}$ the gap is $2$ as well. $0.5$, $0.25$ and $0.75$ are exact in binary. $0.1+0.2$ is one ulp above the double nearest $0.3$. NaN is not equal to itself.`, T`Mulai $2^{53}$ jaraknya $2$, sehingga menambah $1$ terserap, dan di $10^{16}$ jaraknya juga $2$. $0{,}5$, $0{,}25$, dan $0{,}75$ tepat dalam biner. $0{,}1+0{,}2$ satu ulp di atas double terdekat $0{,}3$. NaN tidak sama dengan dirinya.`),
            hint: L(T`Which numbers are sums of powers of two, and where does the gap reach 2?`, T`Bilangan mana yang berupa jumlah pangkat dua, dan di mana jaraknya mencapai 2?`),
          },
        },
        {
          kind: 'activity',
          title: L('The bias', 'Bias'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`A normal double is $(-1)^s\times1.f\times2^{E-1023}$.`, T`Double normal adalah $(-1)^s\times1.f\times2^{E-1023}$.`), L(T`$1=1.0\times2^0$, so $E-1023=0$.`, T`$1=1{,}0\times2^0$, sehingga $E-1023=0$.`)],
            explain: L(T`$E=1023=01111111111_2$, so $1$ is ´3FF0000000000000´.`, T`$E=1023=01111111111_2$, sehingga $1$ adalah ´3FF0000000000000´.`),
            prompt: L(T`What is the exponent field $E$ of the double $1.0$, as a decimal number?`, T`Berapa bidang eksponen $E$ dari double $1{,}0$, sebagai bilangan desimal?`),
            given: String.raw`E=v`,
            blanks: [{ label: 'E =', answer: 1023 }],
          },
        },
        {
          kind: 'activity',
          title: L('The exponent of 8', 'Eksponen dari 8'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`$8=1.0\times2^3$.`, T`$8=1{,}0\times2^3$.`), L(T`$E=3+1023$.`, T`$E=3+1023$.`)],
            explain: L(T`$E=3+1023=1026$, with fraction $0$.`, T`$E=3+1023=1026$, dengan pecahan $0$.`),
            prompt: L(T`What is the exponent field $E$ of the double $8.0$?`, T`Berapa bidang eksponen $E$ dari double $8{,}0$?`),
            given: String.raw`E=v`,
            blanks: [{ label: 'E =', answer: 1026 }],
          },
        },
        {
          kind: 'activity',
          title: L('How many digits?', 'Berapa angka?'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L(T`About how many significant decimal digits does a single (24 bits of precision) hold?`, T`Kira-kira berapa angka desimal signifikan yang dimuat sebuah single (ketelitian 24 bit)?`),
            options: [
              L(T`about 7, since $24\log_{10}2\approx7.2$`, T`sekitar 7, karena $24\log_{10}2\approx7{,}2$`),
              L(T`about 16`, T`sekitar 16`),
              L(T`about 3`, T`sekitar 3`),
              L(T`exactly 24`, T`tepat 24`),
            ],
            answer: 0,
            explain: L(T`Each bit is $\log_{10}2\approx0.301$ decimal digits: $24\times0.301\approx7.2$. A double has $53$ bits, about $16$ digits.`, T`Setiap bit adalah $\log_{10}2\approx0{,}301$ angka desimal: $24\times0{,}301\approx7{,}2$. Double memiliki $53$ bit, sekitar $16$ angka.`),
            hint: L(T`Multiply the number of bits by $\log_{10}2$.`, T`Kalikan banyaknya bit dengan $\log_{10}2$.`),
          },
        },
        {
          kind: 'activity',
          title: L('The first missing integer', 'Bilangan bulat pertama yang hilang'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`With 24 bits of precision the gap becomes $2$ at $2^{24}$.`, T`Dengan ketelitian 24 bit jarak menjadi $2$ di $2^{24}$.`), L(T`$2^{24}+1$ is the first integer that cannot be stored.`, T`$2^{24}+1$ adalah bilangan bulat pertama yang tidak dapat disimpan.`)],
            explain: L(T`$2^{24}=16777216$, so $16777217$ is the smallest positive integer a single cannot hold.`, T`$2^{24}=16777216$, sehingga $16777217$ adalah bilangan bulat positif terkecil yang tidak dapat dimuat sebuah single.`),
            prompt: L(T`What is the smallest positive integer that a single-precision float cannot store exactly?`, T`Berapa bilangan bulat positif terkecil yang tidak dapat disimpan tepat oleh float presisi tunggal?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 16777217 }],
          },
        },
        {
          kind: 'activity',
          title: L('Absorption', 'Penyerapan'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`In a double, what is ´(2.0 ** 53 + 1) + 1´?`, T`Pada double, berapa ´(2.0 ** 53 + 1) + 1´?`),
            options: [
              L(T`$2^{53}$: each $+1$ is absorbed, since the gap is $2$`, T`$2^{53}$: setiap $+1$ terserap, karena jaraknya $2$`),
              L(T`$2^{53}+2$`, T`$2^{53}+2$`),
              L(T`$2^{53}+1$`, T`$2^{53}+1$`),
              L(T`NaN`, T`NaN`),
            ],
            answer: 0,
            explain: L(T`$2^{53}+1$ is halfway between $2^{53}$ and $2^{53}+2$ and rounds to the even one, $2^{53}$; adding $1$ again repeats it. Written as $2^{53}+(1+1)$ it would be $2^{53}+2$.`, T`$2^{53}+1$ ada di tengah antara $2^{53}$ dan $2^{53}+2$ dan dibulatkan ke yang genap, $2^{53}$; menambah $1$ lagi mengulanginya. Ditulis $2^{53}+(1+1)$ hasilnya $2^{53}+2$.`),
            hint: L(T`The next double after $2^{53}$ is $2^{53}+2$.`, T`Double berikutnya setelah $2^{53}$ adalah $2^{53}+2$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Subnormal numbers', 'Bilangan subnormal'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`What do subnormal numbers do?`, T`Apa yang dilakukan bilangan subnormal?`),
            options: [
              L(T`they fill the gap between $0$ and the smallest normal number, so underflow is gradual`, T`mereka mengisi celah antara $0$ dan bilangan normal terkecil, sehingga underflow bertahap`),
              L(T`they store numbers larger than the maximum`, T`mereka menyimpan bilangan yang lebih besar daripada maksimum`),
              L(T`they represent infinity`, T`mereka menyatakan tak hingga`),
              L(T`they are the negative numbers`, T`mereka adalah bilangan negatif`),
            ],
            answer: 0,
            explain: L(T`With exponent field $0$ there is no implied leading $1$, so the numbers continue evenly down to $2^{-1074}$ instead of jumping from $2^{-1022}$ to $0$.`, T`Dengan bidang eksponen $0$ tidak ada angka $1$ di depan yang tersirat, sehingga bilangannya berlanjut merata sampai $2^{-1074}$, bukan melompat dari $2^{-1022}$ ke $0$.`),
            hint: L(T`Think about what happens just above $0$ without them.`, T`Pikirkan apa yang terjadi tepat di atas $0$ tanpa mereka.`),
          },
        },
        {
          kind: 'activity',
          title: L('A tolerance', 'Sebuah toleransi'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`The tolerance is $\max(\text{rel}\cdot\max(|a|,|b|),\ \text{abs})$.`, T`Toleransinya $\max(\text{rel}\cdot\max(|a|,|b|),\ \text{abs})$.`), L(T`$10^{-9}\times10^6=10^{-3}$.`, T`$10^{-9}\times10^6=10^{-3}$.`)],
            explain: L(T`$\max\left(10^{-9}\cdot10^6,\ 0\right)=10^{-3}=0.001$: two numbers near a million are close if they differ by at most $0.001$.`, T`$\max\left(10^{-9}\cdot10^6,\ 0\right)=10^{-3}=0{,}001$: dua bilangan di dekat satu juta dekat jika berbeda paling banyak $0{,}001$.`),
            prompt: L(T`With ´math.isclose´ and ´rel_tol=1e-9´, ´abs_tol=0´, two numbers of size $10^6$ are close if they differ by at most how much?`, T`Dengan ´math.isclose´ dan ´rel_tol=1e-9´, ´abs_tol=0´, dua bilangan berukuran $10^6$ dekat jika berbeda paling banyak berapa?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 0.001 }],
          },
        },
        {
          kind: 'activity',
          title: L('Fixing a subtraction', 'Memperbaiki pengurangan'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`For large $x$, ´sqrt(x*x + 1) - x´ loses all its digits. Which form is accurate?`, T`Untuk $x$ besar, ´sqrt(x*x + 1) - x´ kehilangan semua angkanya. Bentuk mana yang teliti?`),
            options: [
              L(T`$\dfrac{1}{\sqrt{x^2+1}+x}$, the same value without the subtraction`, T`$\dfrac{1}{\sqrt{x^2+1}+x}$, nilai yang sama tanpa pengurangan`),
              L(T`use float32 instead of float64`, T`pakai float32 bukan float64`),
              L(T`$\sqrt{x^2+1}-x+0$`, T`$\sqrt{x^2+1}-x+0$`),
              L(T`round $x$ to an integer`, T`bulatkan $x$ menjadi bilangan bulat`),
            ],
            answer: 0,
            explain: L(T`Multiplying by the conjugate gives $\frac{(x^2+1)-x^2}{\sqrt{x^2+1}+x}=\frac1{\sqrt{x^2+1}+x}$, which adds two positive numbers. Less precision makes it worse.`, T`Mengalikan dengan sekawannya memberi $\frac{(x^2+1)-x^2}{\sqrt{x^2+1}+x}=\frac1{\sqrt{x^2+1}+x}$, yang menjumlahkan dua bilangan positif. Ketelitian lebih rendah memperburuknya.`),
            hint: L(T`Multiply and divide by the conjugate.`, T`Kalikan dan bagi dengan sekawannya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which type?', 'Tipe apa?'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(T`Which is the best way to store a price such as 19.99 in a shop program?`, T`Mana cara terbaik menyimpan harga seperti 19,99 pada program toko?`),
            options: [
              L(T`as the integer 1999 (cents), or with a decimal type`, T`sebagai bilangan bulat 1999 (sen), atau dengan tipe desimal`),
              L(T`as a float64, since it has 16 digits`, T`sebagai float64, karena ia memiliki 16 angka`),
              L(T`as a float32 to save memory`, T`sebagai float32 untuk menghemat memori`),
              L(T`as a string, always`, T`sebagai string, selalu`),
            ],
            answer: 0,
            explain: L(T`$19.99$ has no finite binary expansion, and sums of prices would drift. Integers of the smallest unit, or a decimal type, are exact.`, T`$19{,}99$ tidak punya ekspansi biner berhingga, dan jumlah harga akan bergeser. Bilangan bulat dari satuan terkecil, atau tipe desimal, adalah eksak.`),
            hint: L(T`Which choices can hold $0.01$ exactly?`, T`Pilihan mana yang dapat memuat $0{,}01$ dengan tepat?`),
          },
        },
        {
          kind: 'activity',
          title: L('Machine epsilon', 'Epsilon mesin'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L(T`The gap above $1$ in a double is $2^{-m}$ with $m$ fraction bits.`, T`Jarak di atas $1$ pada double adalah $2^{-m}$ dengan $m$ bit pecahan.`), L(T`A double has $52$ fraction bits.`, T`Double memiliki $52$ bit pecahan.`)],
            explain: L(T`The machine epsilon of a double is $2^{-52}\approx2.2\times10^{-16}$, so the exponent is $-52$.`, T`Epsilon mesin sebuah double adalah $2^{-52}\approx2{,}2\times10^{-16}$, sehingga eksponennya $-52$.`),
            prompt: L(T`The machine epsilon of a double is $2^{k}$. What is $k$?`, T`Epsilon mesin sebuah double adalah $2^{k}$. Berapa $k$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: -52 }],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: floating-point numbers at a glance', 'Ringkasan: bilangan floating-point sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Format:** $(-1)^s\times(1.f)_2\times2^e$; a double is $1+11+52$ bits, bias $1023$, $53$ bits of precision, about $16$ digits.
- **Spacing:** the gap doubles at every power of two; integers are exact up to $2^{53}$ (a single: $2^{24}$).
- **Rounding:** correctly rounded, ties to even, relative error at most $u=2^{-53}$; machine epsilon $2^{-52}$.
- **Special values:** $\pm0$, $\pm\infty$, NaN (not equal to itself), subnormal numbers for gradual underflow.
- **Errors:** they accumulate in sums, are absorbed by large numbers, and cancellation destroys digits in subtractions of nearly equal numbers.
- **Remedies:** Kahan or pairwise or exact sums, algebraic rewriting, ´expm1´, ´log1p´, ´hypot´.
- **Compare:** with a relative and an absolute tolerance, or in ulps; never loop on ´==´.
- **Choose:** float64 by default, float32 or lower for memory and speed, integers or decimals for money.
- **Code:** ´struct´, ´math.ulp´, ´math.fsum´, ´math.isclose´, ´decimal´ in Python; ´DataView´ and ´Number.EPSILON´ in JavaScript.`,
            T`- **Format:** $(-1)^s\times(1.f)_2\times2^e$; double adalah $1+11+52$ bit, bias $1023$, ketelitian $53$ bit, sekitar $16$ angka.
- **Jarak:** jaraknya berlipat dua di setiap pangkat dua; bilangan bulat tepat sampai $2^{53}$ (single: $2^{24}$).
- **Pembulatan:** dibulatkan tepat, seri ke genap, galat relatif paling banyak $u=2^{-53}$; epsilon mesin $2^{-52}$.
- **Nilai khusus:** $\pm0$, $\pm\infty$, NaN (tidak sama dengan dirinya), bilangan subnormal untuk underflow bertahap.
- **Galat:** menumpuk pada jumlah, terserap oleh bilangan besar, dan pembatalan menghancurkan angka pada pengurangan bilangan yang hampir sama.
- **Obat:** jumlah Kahan atau berpasangan atau tepat, penulisan ulang aljabar, ´expm1´, ´log1p´, ´hypot´.
- **Bandingkan:** dengan toleransi relatif dan mutlak, atau dalam ulp; jangan pernah mengulang dengan ´==´.
- **Pilih:** float64 sebagai bawaan, float32 atau lebih rendah untuk memori dan kecepatan, bilangan bulat atau desimal untuk uang.
- **Kode:** ´struct´, ´math.ulp´, ´math.fsum´, ´math.isclose´, ´decimal´ di Python; ´DataView´ dan ´Number.EPSILON´ di JavaScript.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Floating-point number', 'Bilangan floating-point'), definition: L('A number stored as a sign, an exponent and a fixed number of significant bits, so that the point floats with the exponent.', 'Bilangan yang disimpan sebagai tanda, eksponen, dan sejumlah tetap bit signifikan, sehingga titiknya mengambang menurut eksponen.') },
    { term: L('IEEE 754', 'IEEE 754'), definition: L('The standard that defines the binary floating-point formats, correct rounding, infinities, NaN and gradual underflow used by almost all hardware.', 'Standar yang mendefinisikan format floating-point biner, pembulatan tepat, tak hingga, NaN, dan underflow bertahap yang dipakai hampir semua perangkat keras.') },
    { term: L('Machine epsilon', 'Epsilon mesin'), definition: L('The gap between 1 and the next number of a format: 2 to the power minus 52 for a double.', 'Jarak antara 1 dan bilangan berikutnya dari sebuah format: 2 pangkat minus 52 untuk double.') },
    { term: L('Ulp', 'Ulp'), definition: L('The unit in the last place: the gap between a floating-point number and the next one.', 'Unit pada tempat terakhir: jarak antara sebuah bilangan floating-point dan bilangan berikutnya.') },
    { term: L('Subnormal number', 'Bilangan subnormal'), definition: L('A number below the smallest normal one, stored with exponent field zero and no implied leading 1, which makes underflow gradual.', 'Bilangan di bawah yang normal terkecil, disimpan dengan bidang eksponen nol dan tanpa angka 1 di depan yang tersirat, yang membuat underflow bertahap.') },
    { term: L('NaN', 'NaN'), definition: L('Not a number: the result of operations such as zero over zero, not equal even to itself.', 'Bukan bilangan: hasil operasi seperti nol per nol, tidak sama bahkan dengan dirinya sendiri.') },
    { term: L('Absorption', 'Penyerapan'), definition: L('The loss of a small number when it is added to a much larger one, because the sum rounds back to the larger number.', 'Hilangnya bilangan kecil ketika ditambahkan ke bilangan yang jauh lebih besar, karena jumlahnya dibulatkan kembali ke bilangan yang lebih besar.') },
    { term: L('Catastrophic cancellation', 'Pembatalan katastrofik'), definition: L('The loss of most correct digits when two nearly equal numbers are subtracted, exposing the rounding errors they already had.', 'Hilangnya sebagian besar angka benar ketika dua bilangan yang hampir sama dikurangkan, memperlihatkan galat pembulatan yang sudah mereka miliki.') },
  ],

  howTo: [
    {
      name: L('How to read the bits of a double', 'Cara membaca bit sebuah double'),
      description: L('Split the 64 bits into sign, exponent and fraction and apply the formula for a normal number.', 'Bagi 64 bit menjadi tanda, eksponen, dan pecahan dan terapkan rumus untuk bilangan normal.'),
      steps: [
        { name: L('Split the bits', 'Bagi bitnya'), text: L('Take the first bit as the sign, the next eleven as the exponent field and the last fifty-two as the fraction.', 'Ambil bit pertama sebagai tanda, sebelas berikutnya sebagai bidang eksponen, dan lima puluh dua terakhir sebagai pecahan.') },
        { name: L('Check for special values', 'Periksa nilai khusus'), text: L('An exponent field of all zeros means zero or a subnormal number; all ones means infinity or NaN.', 'Bidang eksponen berisi nol semua berarti nol atau bilangan subnormal; berisi satu semua berarti tak hingga atau NaN.') },
        { name: L('Remove the bias', 'Hapus bias'), text: L('Otherwise read the exponent field as an integer and subtract 1023 to get the power of two.', 'Selain itu baca bidang eksponen sebagai bilangan bulat dan kurangi 1023 untuk mendapat pangkat dua.') },
        { name: L('Rebuild the number', 'Bangun kembali bilangannya'), text: L('Put a 1 and a point before the fraction, multiply by two to that power, and apply the sign.', 'Taruh 1 dan titik sebelum pecahan, kalikan dengan dua pangkat itu, dan terapkan tandanya.') },
      ],
    },
    {
      name: L('How to compare floating-point numbers safely', 'Cara membandingkan bilangan floating-point dengan aman'),
      description: L('Use a tolerance with a relative and an absolute part, and handle NaN separately.', 'Pakai toleransi dengan bagian relatif dan mutlak, dan tangani NaN secara terpisah.'),
      steps: [
        { name: L('Rule out NaN', 'Singkirkan NaN'), text: L('Test for NaN first, since it is not close to anything, itself included.', 'Uji NaN lebih dahulu, karena ia tidak dekat dengan apa pun, termasuk dirinya.') },
        { name: L('Choose a relative tolerance', 'Pilih toleransi relatif'), text: L('Pick a few times the unit roundoff times the number of operations, such as one billionth for doubles.', 'Pilih beberapa kali pembulatan satuan dikali banyaknya operasi, seperti sepersemiliar untuk double.') },
        { name: L('Add an absolute tolerance if needed', 'Tambahkan toleransi mutlak bila perlu'), text: L('If the true value can be zero, add an absolute tolerance on the scale of the data.', 'Jika nilai sebenarnya dapat nol, tambahkan toleransi mutlak pada skala data.') },
        { name: L('Compare', 'Bandingkan'), text: L('Report equal when the absolute difference is at most the larger of the two tolerances.', 'Laporkan sama ketika selisih mutlak paling banyak yang lebih besar dari kedua toleransi.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a floating-point number?', 'Apa itu bilangan floating-point?'),
      a: L(
        'It is a number stored in binary scientific notation: a sign, an exponent and a fixed number of fraction bits. The exponent moves the binary point, which gives a huge range, while the fixed number of bits limits the precision.',
        'Itu adalah bilangan yang disimpan dalam notasi ilmiah biner: tanda, eksponen, dan sejumlah tetap bit pecahan. Eksponen menggeser titik biner, yang memberi rentang sangat besar, sedangkan jumlah bit tetap membatasi ketelitian.',
      ),
    },
    {
      q: L('What is the difference between float and double?', 'Apa beda float dan double?'),
      a: L(
        'A float usually means a 32-bit single with 24 bits of precision, about 7 decimal digits, and a double is a 64-bit number with 53 bits of precision, about 16 digits. Python and JavaScript numbers are doubles.',
        'Float biasanya berarti single 32 bit dengan ketelitian 24 bit, sekitar 7 angka desimal, dan double adalah bilangan 64 bit dengan ketelitian 53 bit, sekitar 16 angka. Bilangan Python dan JavaScript adalah double.',
      ),
    },
    {
      q: L('How are the bits of a double organized?', 'Bagaimana bit sebuah double disusun?'),
      a: L(
        'One sign bit, eleven exponent bits with a bias of 1023, and fifty-two fraction bits with an implied leading 1. Exponent fields of all zeros and all ones are reserved for zero, subnormal numbers, infinity and NaN.',
        'Satu bit tanda, sebelas bit eksponen dengan bias 1023, dan lima puluh dua bit pecahan dengan angka 1 di depan yang tersirat. Bidang eksponen berisi nol semua dan satu semua dicadangkan untuk nol, bilangan subnormal, tak hingga, dan NaN.',
      ),
    },
    {
      q: L('What is machine epsilon?', 'Apa itu epsilon mesin?'),
      a: L(
        'It is the gap between 1 and the next number a format can store: 2 to the power minus 52, about 2.2 times ten to the minus 16, for a double. It measures the relative precision of the format.',
        'Itu adalah jarak antara 1 dan bilangan berikutnya yang dapat disimpan sebuah format: 2 pangkat minus 52, sekitar 2,2 kali sepuluh pangkat minus 16, untuk double. Ia mengukur ketelitian relatif format itu.',
      ),
    },
    {
      q: L('Why is NaN not equal to itself?', 'Mengapa NaN tidak sama dengan dirinya sendiri?'),
      a: L(
        'IEEE 754 defines every comparison with NaN as false, because NaN stands for the lack of a value, and two missing values need not be the same. So testing x not equal to x is a way to detect NaN, as is a function like isnan.',
        'IEEE 754 mendefinisikan setiap perbandingan dengan NaN sebagai salah, karena NaN menyatakan tiadanya nilai, dan dua nilai yang hilang tidak harus sama. Jadi menguji x tidak sama dengan x adalah cara mendeteksi NaN, seperti juga fungsi isnan.',
      ),
    },
    {
      q: L('What are subnormal numbers?', 'Apa itu bilangan subnormal?'),
      a: L(
        'They are numbers smaller than the smallest normal number, stored with an exponent field of zero and no implied leading 1. They fill the gap next to zero evenly, so that underflow is gradual and subtracting two different numbers never gives zero.',
        'Itu adalah bilangan yang lebih kecil daripada bilangan normal terkecil, disimpan dengan bidang eksponen nol dan tanpa angka 1 di depan yang tersirat. Mereka mengisi celah di sebelah nol secara merata, sehingga underflow bertahap dan mengurangkan dua bilangan berbeda tidak pernah memberi nol.',
      ),
    },
    {
      q: L('What is catastrophic cancellation?', 'Apa itu pembatalan katastrofik?'),
      a: L(
        'It is the loss of most correct digits when two nearly equal numbers are subtracted. The leading digits cancel and the result is dominated by the rounding errors the numbers already had, so the formula has to be rewritten to avoid the subtraction.',
        'Itu adalah hilangnya sebagian besar angka benar ketika dua bilangan yang hampir sama dikurangkan. Angka terdepan saling menghapus dan hasilnya didominasi galat pembulatan yang sudah dimiliki bilangan itu, sehingga rumusnya harus ditulis ulang untuk menghindari pengurangan.',
      ),
    },
    {
      q: L('Which floating-point type should I use?', 'Tipe floating-point mana yang harus saya pakai?'),
      a: L(
        'Use a 64-bit double by default. Use a 32-bit float for graphics and when memory matters, and 16-bit formats for machine learning. For money use integers or a decimal type, since binary floats cannot hold amounts such as 0.10 exactly.',
        'Pakai double 64 bit sebagai bawaan. Pakai float 32 bit untuk grafika dan ketika memori penting, dan format 16 bit untuk pembelajaran mesin. Untuk uang pakai bilangan bulat atau tipe desimal, karena float biner tidak dapat memuat jumlah seperti 0,10 dengan tepat.',
      ),
    },
  ],

  references: [
    { title: 'IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)', author: 'IEEE', year: 2019, source: 'Institute of Electrical and Electronics Engineers' },
    { title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic', author: 'David Goldberg', year: 1991, source: 'ACM Computing Surveys 23(1)' },
    { title: 'Accuracy and Stability of Numerical Algorithms (2nd ed.)', author: 'Nicholas J. Higham', year: 2002, source: 'SIAM' },
    { title: 'Further remarks on reducing truncation errors', author: 'William Kahan', year: 1965, source: 'Communications of the ACM 8(1)' },
  ],

  related: ['binary-numbers', 'real-numbers', 'newtons-method', 'linearization-and-differentials'],
}
