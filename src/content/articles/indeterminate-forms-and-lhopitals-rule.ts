import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './indeterminate-forms-and-lhopitals-rule.meta'

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
    T`**L'Hôpital's Rule says that if $\frac{f(x)}{g(x)}$ has the indeterminate form $\frac00$ or $\frac\infty\infty$ at $a$, then $\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}$, provided the second limit exists or is infinite.** Differentiate the numerator and the denominator separately, not the quotient, and repeat while the form stays indeterminate. Products, differences and powers are first rewritten as quotients, the powers through a logarithm.`,
    T`**Aturan L'Hôpital menyatakan bahwa jika $\frac{f(x)}{g(x)}$ berbentuk tak tentu $\frac00$ atau $\frac\infty\infty$ di $a$, maka $\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}$, asalkan limit kedua ada atau tak hingga.** Turunkan pembilang dan penyebut secara terpisah, bukan hasil baginya, dan ulangi selama bentuknya tetap tak tentu. Hasil kali, selisih, dan pangkat lebih dahulu ditulis ulang sebagai hasil bagi, pangkat lewat logaritma.`,
  ),

  keyPoints: [
    L(
      T`An indeterminate form such as $\frac00$ describes a limit of a quotient whose numerator and denominator both go to $0$; it is not a number, and the limit can be anything: $\frac{x^3}x\to0$, $\frac x{x^3}\to\infty$, $\frac xx\to1$, $\frac{2x}x\to2$.`,
      T`Bentuk tak tentu seperti $\frac00$ menggambarkan limit hasil bagi yang pembilang dan penyebutnya sama-sama menuju $0$; ia bukan bilangan, dan limitnya bisa apa saja: $\frac{x^3}x\to0$, $\frac x{x^3}\to\infty$, $\frac xx\to1$, $\frac{2x}x\to2$.`,
    ),
    L(
      T`L'Hôpital's Rule: if $f$ and $g$ are differentiable near $a$, $g'\ne0$ there, and $\frac{f}{g}$ is $\frac00$ (or $\frac\infty\infty$) at $a$, then $\lim\frac fg=\lim\frac{f'}{g'}$ when the right side exists; it holds for one-sided limits and for $a=\pm\infty$.`,
      T`Aturan L'Hôpital: jika $f$ dan $g$ terdiferensialkan di dekat $a$, $g'\ne0$ di sana, dan $\frac{f}{g}$ berbentuk $\frac00$ (atau $\frac\infty\infty$) di $a$, maka $\lim\frac fg=\lim\frac{f'}{g'}$ bila ruas kanan ada; berlaku untuk limit satu sisi dan untuk $a=\pm\infty$.`,
    ),
    L(
      T`Take $\frac{f'}{g'}$, not the derivative of $\frac fg$, and stop as soon as the quotient is no longer indeterminate: in $\lim_{x\to0}\frac{1-\cos x}{x+x^2}$ one round gives $\frac{\sin x}{1+2x}\to0$, and a second round would wrongly give $\frac12$.`,
      T`Pakai $\frac{f'}{g'}$, bukan turunan $\frac fg$, dan berhenti begitu hasil bagi tidak lagi tak tentu: pada $\lim_{x\to0}\frac{1-\cos x}{x+x^2}$ satu putaran memberi $\frac{\sin x}{1+2x}\to0$, dan putaran kedua akan keliru memberi $\frac12$.`,
    ),
    L(
      T`The forms $0\cdot\infty$ and $\infty-\infty$ are turned into a quotient by algebra, and the powers $1^\infty$, $0^0$, $\infty^0$ by taking $\ln$: if $\ln y\to L$ then $y\to e^L$.`,
      T`Bentuk $0\cdot\infty$ dan $\infty-\infty$ diubah menjadi hasil bagi dengan aljabar, dan pangkat $1^\infty$, $0^0$, $\infty^0$ dengan mengambil $\ln$: jika $\ln y\to L$ maka $y\to e^L$.`,
    ),
    L(
      T`The rule can fail: the quotient may be determinate (no rule needed), it can cycle ($\frac{\sqrt{9x+1}}{\sqrt x+1}$), or $\frac{f'}{g'}$ may have no limit although $\frac fg$ does ($\frac{x+\sin x}x$).`,
      T`Aturan ini bisa gagal: hasil bagi bisa sudah tentu (tidak perlu aturan), bisa berputar ($\frac{\sqrt{9x+1}}{\sqrt x+1}$), atau $\frac{f'}{g'}$ bisa tidak punya limit padahal $\frac fg$ punya ($\frac{x+\sin x}x$).`,
    ),
    L(
      T`The proof rests on Cauchy's Mean Value Theorem, $\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)}$ for some $c$ in $(a,b)$, which is the Mean Value Theorem for two functions.`,
      T`Buktinya bertumpu pada Teorema Nilai Rata-rata Cauchy, $\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)}$ untuk suatu $c$ di $(a,b)$, yaitu Teorema Nilai Rata-rata untuk dua fungsi.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------ indeterminate forms */
    {
      id: 'indeterminate-forms',
      heading: L('What is an indeterminate form?', 'Apa itu bentuk tak tentu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An indeterminate form is a way of summarizing the behavior of a limit when the behavior of the parts does not decide it.** Take the four limits
$$\lim_{x\to0}\frac{x^3}{x}=0\qquad\lim_{x\to0}\frac{x}{x^3}=\infty\qquad\lim_{x\to0}\frac{x}{x}=1\qquad\lim_{x\to0}\frac{2x}{x}=2.$$
In each, the numerator and the denominator both approach $0$, yet the results are $0$, $\infty$, $1$ and $2$. We say a limit
$$\lim_{x\to a}\frac{f(x)}{g(x)}\quad\text{with}\quad\lim_{x\to a}f(x)=0\ \text{and}\ \lim_{x\to a}g(x)=0$$
has the *indeterminate form* $\frac00$. The symbol "$\frac00$" looks like a number but is not one: it is not an instruction to divide $0$ by $0$, only a label for the limit of a ratio of two functions that each go to zero. Knowing that both go to zero is not enough to find the limit of the ratio; one has to look more closely, by algebra or by the rule of this article.

If both the numerator and the denominator go to $+\infty$ or $-\infty$, the form is $\frac\infty\infty$. The other forms are $\infty\cdot0$, $\infty-\infty$, $1^\infty$, $0^0$ and $\infty^0$. Each is a label for a kind of limit whose value can come out in several ways: $x\ln x$ and $x\cdot\frac1{x}$ are both of the form $0\cdot\infty$ at $0^+$ and $\infty\cdot0$ at $\infty$, and they give $0$ and $1$.

Some forms are *not* indeterminate. A numerator that goes to $1$ over a denominator that goes to $0$ is $\frac10$, which is infinite (or does not exist if the sign differs on the two sides); $\frac0\infty$ is $0$; $\infty+\infty$ is $\infty$; $0^\infty$ is $0$. Only the forms above leave the limit open.

John (Johann) Bernoulli discovered a rule for using derivatives to calculate limits of fractions whose numerators and denominators both approach zero or $\pm\infty$. It is known as l'Hôpital's Rule after Guillaume de l'Hôpital, who wrote the first introductory differential calculus text, where the rule first appeared in print.`,
            T`**Bentuk tak tentu adalah cara meringkas perilaku suatu limit ketika perilaku bagian-bagiannya tidak menentukannya.** Ambil empat limit
$$\lim_{x\to0}\frac{x^3}{x}=0\qquad\lim_{x\to0}\frac{x}{x^3}=\infty\qquad\lim_{x\to0}\frac{x}{x}=1\qquad\lim_{x\to0}\frac{2x}{x}=2.$$
Pada masing-masing, pembilang dan penyebut sama-sama mendekati $0$, namun hasilnya $0$, $\infty$, $1$, dan $2$. Kita katakan limit
$$\lim_{x\to a}\frac{f(x)}{g(x)}\quad\text{dengan}\quad\lim_{x\to a}f(x)=0\ \text{dan}\ \lim_{x\to a}g(x)=0$$
berbentuk *tak tentu* $\frac00$. Lambang "$\frac00$" tampak seperti bilangan tetapi bukan: ia bukan perintah membagi $0$ dengan $0$, hanya label untuk limit hasil bagi dua fungsi yang masing-masing menuju nol. Mengetahui bahwa keduanya menuju nol belum cukup untuk mencari limit hasil baginya; kita harus melihat lebih dekat, dengan aljabar atau dengan aturan di artikel ini.

Jika pembilang dan penyebut sama-sama menuju $+\infty$ atau $-\infty$, bentuknya $\frac\infty\infty$. Bentuk lainnya $\infty\cdot0$, $\infty-\infty$, $1^\infty$, $0^0$, dan $\infty^0$. Masing-masing adalah label untuk jenis limit yang nilainya dapat muncul dengan beberapa cara: $x\ln x$ dan $x\cdot\frac1{x}$ keduanya berbentuk $0\cdot\infty$ di $0^+$ dan $\infty\cdot0$ di $\infty$, dan memberi $0$ dan $1$.

Beberapa bentuk *bukan* tak tentu. Pembilang yang menuju $1$ di atas penyebut yang menuju $0$ adalah $\frac10$, yang tak hingga (atau tidak ada jika tandanya berbeda di kedua sisi); $\frac0\infty$ adalah $0$; $\infty+\infty$ adalah $\infty$; $0^\infty$ adalah $0$. Hanya bentuk di atas yang membiarkan limitnya terbuka.

John (Johann) Bernoulli menemukan aturan memakai turunan untuk menghitung limit pecahan yang pembilang dan penyebutnya sama-sama mendekati nol atau $\pm\infty$. Aturan itu dikenal sebagai Aturan l'Hôpital menurut Guillaume de l'Hôpital, yang menulis buku teks kalkulus diferensial pengantar pertama, tempat aturan itu pertama kali dicetak.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------ the rule */
    {
      id: 'lhopitals-rule',
      heading: L('What does L’Hôpital’s Rule say?', 'Apa isi Aturan L’Hôpital?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**L'Hôpital's Rule: suppose $\lim_{x\to a}f(x)=\lim_{x\to a}g(x)=0$, that $f$ and $g$ are differentiable on an open interval $I$ containing $a$, and that $g'(x)\ne0$ on $I$ if $x\ne a$. Then**
$$\lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)},$$
**assuming that the limit on the right side exists.** The theorem also applies if $x\to\pm\infty$ or when $f(x)$ and $g(x)$ go to $\pm\infty$ (the form $\frac\infty\infty$), and to one-sided limits; the number $a$ may be finite or infinite. The reason is that near $a$ a function is close to its tangent line, so the ratio of two functions that vanish at $a$ is the ratio of their slopes. Section 5 proves it.

**Caution.** To apply the rule to $\frac fg$, divide the derivative of $f$ by the derivative of $g$. Do not take the derivative of the quotient: the quotient to use is $\frac{f'}{g'}$ and not $\left(\frac fg\right)'$. For $\frac{x^2-1}{x-1}$ at $1$ the right number is $\frac{2x}1\to2$, while the derivative of the quotient $x+1$ is $1$.

**Using the rule.** To find $\lim\frac{f(x)}{g(x)}$, differentiate $f$ and $g$, and keep differentiating as long as the quotient still has the form $\frac00$ (or $\frac\infty\infty$). As soon as one of the two derivatives no longer goes to zero, stop. The rule does not apply when the numerator or the denominator has a finite limit that is not zero (or, in the first round, when the form is not indeterminate at all).

**Example 1.** All of these are of the form $\frac00$, and some need the rule more than once.
(a) $\lim_{x\to0}\frac{3x-\sin x}{x}=\lim_{x\to0}(3-\cos x)=2$.
(b) $\lim_{x\to0}\frac{\sqrt{1+x}-1}{x}=\lim_{x\to0}\frac{\frac1{2\sqrt{1+x}}}{1}=\frac12$.
(c) $\lim_{x\to0}\frac{\sqrt{1+x}-1-\frac x2}{x^2}=\lim_{x\to0}\frac{\frac1{2\sqrt{1+x}}-\frac12}{2x}$, which is $\frac00$ again, so $=\lim_{x\to0}\frac{-\frac14(1+x)^{-3/2}}{2}=-\frac18$.
(d) $\lim_{x\to0}\frac{x-\sin x}{x^3}=\lim_{x\to0}\frac{1-\cos x}{3x^2}$
$=\lim_{x\to0}\frac{\sin x}{6x}=\lim_{x\to0}\frac{\cos x}{6}=\frac16$.

**Example 2: a careful use.** $\lim_{x\to0}\frac{1-\cos x}{x+x^2}=\lim_{x\to0}\frac{\sin x}{1+2x}=\frac01=0$. It is tempting to apply the rule again to get $\lim\frac{\cos x}{2}=\frac12$, but that is wrong: $\frac{\sin x}{1+2x}$ is $\frac01$, not indeterminate, and its value is $0$.

**Example 3: one-sided limits.** (a) $\lim_{x\to0^+}\frac{\sin x}{x^2}=\lim_{x\to0^+}\frac{\cos x}{2x}=+\infty$, since $\cos x\to1$ and $2x\to0^+$. (b) $\lim_{x\to0^-}\frac{\sin x}{x^2}=\lim_{x\to0^-}\frac{\cos x}{2x}=-\infty$, since $2x<0$. The one-sided limits differ, so the two-sided limit does not exist.

Type a numerator, a denominator and a point below, or choose an example. The stepper applies the rule one round at a time, names the form at each step and stops when the quotient is no longer indeterminate.`,
            T`**Aturan L'Hôpital: misalkan $\lim_{x\to a}f(x)=\lim_{x\to a}g(x)=0$, $f$ dan $g$ terdiferensialkan pada selang terbuka $I$ yang memuat $a$, dan $g'(x)\ne0$ pada $I$ jika $x\ne a$. Maka**
$$\lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)},$$
**dengan anggapan limit di ruas kanan ada.** Teorema ini juga berlaku jika $x\to\pm\infty$ atau ketika $f(x)$ dan $g(x)$ menuju $\pm\infty$ (bentuk $\frac\infty\infty$), dan untuk limit satu sisi; bilangan $a$ boleh terhingga atau tak hingga. Alasannya, di dekat $a$ fungsi mendekati garis singgungnya, sehingga hasil bagi dua fungsi yang lenyap di $a$ adalah hasil bagi gradiennya. Bagian 5 membuktikannya.

**Peringatan.** Untuk menerapkan aturan pada $\frac fg$, bagi turunan $f$ dengan turunan $g$. Jangan menurunkan hasil baginya: hasil bagi yang dipakai adalah $\frac{f'}{g'}$ dan bukan $\left(\frac fg\right)'$. Untuk $\frac{x^2-1}{x-1}$ di $1$ bilangan yang benar adalah $\frac{2x}1\to2$, sedangkan turunan hasil bagi $x+1$ adalah $1$.

**Memakai aturan.** Untuk mencari $\lim\frac{f(x)}{g(x)}$, turunkan $f$ dan $g$, dan teruslah menurunkan selama hasil bagi masih berbentuk $\frac00$ (atau $\frac\infty\infty$). Begitu salah satu dari kedua turunan tidak lagi menuju nol, berhenti. Aturan tidak berlaku ketika pembilang atau penyebut memiliki limit terhingga yang bukan nol (atau, pada putaran pertama, ketika bentuknya sama sekali bukan tak tentu).

**Contoh 1.** Semuanya berbentuk $\frac00$, dan beberapa memerlukan aturan lebih dari sekali.
(a) $\lim_{x\to0}\frac{3x-\sin x}{x}=\lim_{x\to0}(3-\cos x)=2$.
(b) $\lim_{x\to0}\frac{\sqrt{1+x}-1}{x}=\lim_{x\to0}\frac{\frac1{2\sqrt{1+x}}}{1}=\frac12$.
(c) $\lim_{x\to0}\frac{\sqrt{1+x}-1-\frac x2}{x^2}=\lim_{x\to0}\frac{\frac1{2\sqrt{1+x}}-\frac12}{2x}$, yang berbentuk $\frac00$ lagi, sehingga $=\lim_{x\to0}\frac{-\frac14(1+x)^{-3/2}}{2}=-\frac18$.
(d) $\lim_{x\to0}\frac{x-\sin x}{x^3}=\lim_{x\to0}\frac{1-\cos x}{3x^2}$
$=\lim_{x\to0}\frac{\sin x}{6x}=\lim_{x\to0}\frac{\cos x}{6}=\frac16$.

**Contoh 2: pemakaian yang cermat.** $\lim_{x\to0}\frac{1-\cos x}{x+x^2}=\lim_{x\to0}\frac{\sin x}{1+2x}=\frac01=0$. Menggoda untuk menerapkan aturan lagi dan mendapat $\lim\frac{\cos x}{2}=\frac12$, tetapi itu salah: $\frac{\sin x}{1+2x}$ berbentuk $\frac01$, bukan tak tentu, dan nilainya $0$.

**Contoh 3: limit satu sisi.** (a) $\lim_{x\to0^+}\frac{\sin x}{x^2}=\lim_{x\to0^+}\frac{\cos x}{2x}=+\infty$, karena $\cos x\to1$ dan $2x\to0^+$. (b) $\lim_{x\to0^-}\frac{\sin x}{x^2}=\lim_{x\to0^-}\frac{\cos x}{2x}=-\infty$, karena $2x<0$. Limit satu sisinya berbeda, sehingga limit dua sisinya tidak ada.

Ketik pembilang, penyebut, dan titik di bawah, atau pilih contoh. Alat ini menerapkan aturan satu putaran demi satu putaran, menyebut bentuk di tiap langkah, dan berhenti ketika hasil bagi tidak lagi tak tentu.`,
          ),
        },
        { kind: 'widget', name: 'lhopitaltool' },
      ],
    },

    /* ---------------------------------------------------------------------- infinity forms */
    {
      id: 'infinity-forms',
      heading: L('How does the rule handle ∞/∞, and which grows faster?', 'Bagaimana aturan menangani ∞/∞, dan mana yang tumbuh lebih cepat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**L'Hôpital's Rule applies to $\frac\infty\infty$ exactly as to $\frac00$: if $f(x)\to\pm\infty$ and $g(x)\to\pm\infty$ as $x\to a$, then $\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}$, provided the limit on the right exists or is $\pm\infty$.** Here $a$ may be finite or infinite, and $x\to a$ may be replaced by $x\to a^+$ or $x\to a^-$. The proof of this case is harder and is not given here; it is a 19th-century result.

**Example 4.** Find the limits of these $\frac\infty\infty$ forms.
(a) $\lim_{x\to\pi/2^-}\frac{\sec x}{1+\tan x}$. Both parts go to $+\infty$ from the left, so $=\lim\frac{\sec x\tan x}{\sec^2x}=\lim\sin x=1$ (a simplification, $\frac{\tan x}{\sec x}=\sin x$, is easier here than a second round).
(b) $\lim_{x\to\infty}\frac{\ln x}{2\sqrt x}=\lim_{x\to\infty}\frac{1/x}{1/\sqrt x}$
$=\lim_{x\to\infty}\frac1{\sqrt x}=0$.
(c) $\lim_{x\to\infty}\frac{e^x}{x^2}=\lim\frac{e^x}{2x}=\lim\frac{e^x}{2}=\infty$.

The last two are the comparison of growth rates: a logarithm grows more slowly than any positive power of $x$, and an exponential grows faster than any power, so $\frac{\ln x}{x^p}\to0$ and $\frac{e^x}{x^p}\to\infty$ for every $p>0$. Many limits in later chapters are settled by this ordering: $\ln x\ll x^p\ll e^x$ as $x\to\infty$.

**Leading terms.** For a ratio of polynomials the rule gives the familiar answer: $\lim_{x\to\infty}\frac{5x^2-3x}{7x^2+1}=\lim\frac{10x-3}{14x}=\lim\frac{10}{14}=\frac57$, the ratio of the leading coefficients.`,
            T`**Aturan L'Hôpital berlaku untuk $\frac\infty\infty$ persis seperti untuk $\frac00$: jika $f(x)\to\pm\infty$ dan $g(x)\to\pm\infty$ ketika $x\to a$, maka $\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}$, asalkan limit di ruas kanan ada atau $\pm\infty$.** Di sini $a$ boleh terhingga atau tak hingga, dan $x\to a$ boleh diganti $x\to a^+$ atau $x\to a^-$. Bukti kasus ini lebih sulit dan tidak diberikan di sini; ia hasil abad ke-19.

**Contoh 4.** Tentukan limit bentuk $\frac\infty\infty$ berikut.
(a) $\lim_{x\to\pi/2^-}\frac{\sec x}{1+\tan x}$. Kedua bagian menuju $+\infty$ dari kiri, sehingga $=\lim\frac{\sec x\tan x}{\sec^2x}=\lim\sin x=1$ (penyederhanaan, $\frac{\tan x}{\sec x}=\sin x$, lebih mudah di sini daripada putaran kedua).
(b) $\lim_{x\to\infty}\frac{\ln x}{2\sqrt x}=\lim_{x\to\infty}\frac{1/x}{1/\sqrt x}$
$=\lim_{x\to\infty}\frac1{\sqrt x}=0$.
(c) $\lim_{x\to\infty}\frac{e^x}{x^2}=\lim\frac{e^x}{2x}=\lim\frac{e^x}{2}=\infty$.

Dua yang terakhir adalah perbandingan laju tumbuh: logaritma tumbuh lebih lambat daripada pangkat positif $x$ mana pun, dan eksponensial tumbuh lebih cepat daripada pangkat mana pun, sehingga $\frac{\ln x}{x^p}\to0$ dan $\frac{e^x}{x^p}\to\infty$ untuk setiap $p>0$. Banyak limit di bab berikutnya diselesaikan dengan urutan ini: $\ln x\ll x^p\ll e^x$ ketika $x\to\infty$.

**Suku utama.** Untuk hasil bagi polinom aturan ini memberi jawaban yang kita kenal: $\lim_{x\to\infty}\frac{5x^2-3x}{7x^2+1}=\lim\frac{10x-3}{14x}=\lim\frac{10}{14}=\frac57$, perbandingan koefisien utama.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- products and differences */
    {
      id: 'products-and-differences',
      heading: L('How do you handle 0·∞ and ∞−∞?', 'Bagaimana menangani 0·∞ dan ∞−∞?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The forms $\infty\cdot0$ and $\infty-\infty$ are not quotients, so first algebra turns them into $\frac00$ or $\frac\infty\infty$, and then the rule applies.** Neither $\infty\cdot0$ nor $\infty-\infty$ is a number; they only describe what the parts do.

**Example 5: a product.** (a) $\lim_{x\to\infty}x\sin\frac1x$ is of the form $\infty\cdot0$. Write it as $\lim_{x\to\infty}\frac{\sin(1/x)}{1/x}$, a $\frac00$ form, and apply the rule: $=\lim_{x\to\infty}\frac{\cos(1/x)\cdot(-1/x^2)}{-1/x^2}$ $=\lim_{x\to\infty}\cos\frac1x=1$.
(b) $\lim_{x\to0^+}x\ln x$ is of the form $0\cdot\infty$. Write it as $\lim_{x\to0^+}\frac{\ln x}{1/x}$, an $\frac\infty\infty$ form, and apply the rule: $=\lim_{x\to0^+}\frac{1/x}{-1/x^2}=\lim_{x\to0^+}(-x)=0$.

The choice of which factor goes in the denominator matters: $x\ln x=\frac{x}{1/\ln x}$ would lead to a worse quotient. Put in the denominator the factor whose reciprocal is simpler to differentiate.

**Example 6: a difference.** Find $\lim_{x\to0}\left(\frac1x-\frac1{\sin x}\right)$. As $x\to0^+$, $\frac1x\to\infty$ and $\frac1{\sin x}\to\infty$, so the form is $\infty-\infty$; as $x\to0^-$ it is $-\infty-(-\infty)$. Neither shows the limit. Combine the fractions over a common denominator,
$$\frac1x-\frac1{\sin x}=\frac{\sin x-x}{x\sin x},$$
which is of the form $\frac00$, and apply the rule twice:
$$\lim_{x\to0}\frac{\sin x-x}{x\sin x}=\lim_{x\to0}\frac{\cos x-1}{\sin x+x\cos x}=\lim_{x\to0}\frac{-\sin x}{2\cos x-x\sin x}=\frac02=0.$$

Another difference: $\lim_{x\to1^+}\left(\frac1{\ln x}-\frac1{x-1}\right)=\lim\frac{x-1-\ln x}{(x-1)\ln x}=\frac12$, again a combined fraction of the form $\frac00$ and two rounds.`,
            T`**Bentuk $\infty\cdot0$ dan $\infty-\infty$ bukan hasil bagi, sehingga aljabar lebih dahulu mengubahnya menjadi $\frac00$ atau $\frac\infty\infty$, lalu aturan berlaku.** Baik $\infty\cdot0$ maupun $\infty-\infty$ bukan bilangan; keduanya hanya menggambarkan apa yang dilakukan bagiannya.

**Contoh 5: hasil kali.** (a) $\lim_{x\to\infty}x\sin\frac1x$ berbentuk $\infty\cdot0$. Tulis sebagai $\lim_{x\to\infty}\frac{\sin(1/x)}{1/x}$, bentuk $\frac00$, dan terapkan aturan: $=\lim_{x\to\infty}\frac{\cos(1/x)\cdot(-1/x^2)}{-1/x^2}$ $=\lim_{x\to\infty}\cos\frac1x=1$.
(b) $\lim_{x\to0^+}x\ln x$ berbentuk $0\cdot\infty$. Tulis sebagai $\lim_{x\to0^+}\frac{\ln x}{1/x}$, bentuk $\frac\infty\infty$, dan terapkan aturan: $=\lim_{x\to0^+}\frac{1/x}{-1/x^2}=\lim_{x\to0^+}(-x)=0$.

Pilihan faktor mana yang masuk penyebut penting: $x\ln x=\frac{x}{1/\ln x}$ akan menuju hasil bagi yang lebih buruk. Taruh di penyebut faktor yang kebalikannya lebih mudah diturunkan.

**Contoh 6: selisih.** Tentukan $\lim_{x\to0}\left(\frac1x-\frac1{\sin x}\right)$. Ketika $x\to0^+$, $\frac1x\to\infty$ dan $\frac1{\sin x}\to\infty$, sehingga bentuknya $\infty-\infty$; ketika $x\to0^-$ bentuknya $-\infty-(-\infty)$. Keduanya tidak menunjukkan limitnya. Gabungkan pecahan dengan penyebut sekutu,
$$\frac1x-\frac1{\sin x}=\frac{\sin x-x}{x\sin x},$$
yang berbentuk $\frac00$, dan terapkan aturan dua kali:
$$\lim_{x\to0}\frac{\sin x-x}{x\sin x}=\lim_{x\to0}\frac{\cos x-1}{\sin x+x\cos x}=\lim_{x\to0}\frac{-\sin x}{2\cos x-x\sin x}=\frac02=0.$$

Selisih lain: $\lim_{x\to1^+}\left(\frac1{\ln x}-\frac1{x-1}\right)=\lim\frac{x-1-\ln x}{(x-1)\ln x}=\frac12$, lagi-lagi pecahan gabungan berbentuk $\frac00$ dan dua putaran.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- powers */
    {
      id: 'indeterminate-powers',
      heading: L('How do you handle 1^∞, 0^0 and ∞^0?', 'Bagaimana menangani 1^∞, 0^0, dan ∞^0?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Limits that lead to $1^\infty$, $0^0$ and $\infty^0$ are handled by first taking the logarithm of the function, the idea of [logarithmic differentiation](article:derivatives-of-inverse-functions-and-logarithms#logarithmic-differentiation): find the limit $L$ of $\ln f(x)$ with the rule, then exponentiate.** If $\lim_{x\to a}\ln f(x)=L$, then
$$\lim_{x\to a}f(x)=\lim_{x\to a}e^{\ln f(x)}=e^L,$$
by the continuity of the exponential function. The formula is valid for one-sided limits and for $a=\pm\infty$. If $f(x)=u(x)^{v(x)}$ then $\ln f=v\ln u$, a product, which the previous section turns into the quotient $\frac{\ln u}{1/v}$.

**Example 7.** Show that $\lim_{x\to0^+}(1+x)^{1/x}=e$. The limit has the form $1^\infty$. Let $f(x)=(1+x)^{1/x}$, so $\ln f(x)=\frac{\ln(1+x)}{x}$, a $\frac00$ form. By the rule
$$\lim_{x\to0^+}\ln f(x)=\lim_{x\to0^+}\frac{\ln(1+x)}{x}=\lim_{x\to0^+}\frac{1/(1+x)}{1}=1.$$
Therefore $\lim_{x\to0^+}(1+x)^{1/x}=e^1=e$. This is the number $e$ from the definition of the exponential, and it is the same as $\lim_{x\to\infty}\left(1+\frac1x\right)^x=e$.

**Example 8.** Find $\lim_{x\to\infty}x^{1/x}$. The form is $\infty^0$. With $f(x)=x^{1/x}$, $\ln f(x)=\frac{\ln x}{x}$, an $\frac\infty\infty$ form, and $\lim_{x\to\infty}\frac{\ln x}{x}=\lim\frac{1/x}{1}=0$. So $\lim_{x\to\infty}x^{1/x}=e^0=1$.

**Other examples.** $\lim_{x\to0^+}x^x$ has the form $0^0$: $\ln x^x=x\ln x\to0$ by Example 5(b), so $x^x\to e^0=1$. And $\lim_{x\to1^+}x^{1/(x-1)}$ is $1^\infty$: $\frac{\ln x}{x-1}\to1$, so the limit is $e$. In general $\lim_{x\to\infty}\left(1+\frac px\right)^x=e^p$.

The stepper below takes the form, shows the rewriting and runs the rule for every kind of indeterminate form: $0\cdot\infty$, $\infty-\infty$ and the powers.`,
            T`**Limit yang menuju $1^\infty$, $0^0$, dan $\infty^0$ ditangani dengan mengambil logaritma fungsi lebih dahulu, gagasan [diferensiasi logaritmik](article:derivatives-of-inverse-functions-and-logarithms#logarithmic-differentiation): cari limit $L$ dari $\ln f(x)$ dengan aturan, lalu eksponensialkan.** Jika $\lim_{x\to a}\ln f(x)=L$, maka
$$\lim_{x\to a}f(x)=\lim_{x\to a}e^{\ln f(x)}=e^L,$$
karena kekontinuan fungsi eksponensial. Rumus ini berlaku untuk limit satu sisi dan untuk $a=\pm\infty$. Jika $f(x)=u(x)^{v(x)}$ maka $\ln f=v\ln u$, suatu hasil kali, yang oleh bagian sebelumnya diubah menjadi hasil bagi $\frac{\ln u}{1/v}$.

**Contoh 7.** Tunjukkan bahwa $\lim_{x\to0^+}(1+x)^{1/x}=e$. Limit ini berbentuk $1^\infty$. Misalkan $f(x)=(1+x)^{1/x}$, sehingga $\ln f(x)=\frac{\ln(1+x)}{x}$, bentuk $\frac00$. Menurut aturan
$$\lim_{x\to0^+}\ln f(x)=\lim_{x\to0^+}\frac{\ln(1+x)}{x}=\lim_{x\to0^+}\frac{1/(1+x)}{1}=1.$$
Jadi $\lim_{x\to0^+}(1+x)^{1/x}=e^1=e$. Ini adalah bilangan $e$ dari definisi eksponensial, dan sama dengan $\lim_{x\to\infty}\left(1+\frac1x\right)^x=e$.

**Contoh 8.** Tentukan $\lim_{x\to\infty}x^{1/x}$. Bentuknya $\infty^0$. Dengan $f(x)=x^{1/x}$, $\ln f(x)=\frac{\ln x}{x}$, bentuk $\frac\infty\infty$, dan $\lim_{x\to\infty}\frac{\ln x}{x}=\lim\frac{1/x}{1}=0$. Jadi $\lim_{x\to\infty}x^{1/x}=e^0=1$.

**Contoh lain.** $\lim_{x\to0^+}x^x$ berbentuk $0^0$: $\ln x^x=x\ln x\to0$ menurut Contoh 5(b), sehingga $x^x\to e^0=1$. Dan $\lim_{x\to1^+}x^{1/(x-1)}$ adalah $1^\infty$: $\frac{\ln x}{x-1}\to1$, sehingga limitnya $e$. Secara umum $\lim_{x\to\infty}\left(1+\frac px\right)^x=e^p$.

Alat di bawah mengambil bentuknya, menunjukkan penulisan ulang, dan menjalankan aturan untuk setiap jenis bentuk tak tentu: $0\cdot\infty$, $\infty-\infty$, dan pangkat.`,
          ),
        },
        { kind: 'widget', name: 'formstool' },
      ],
    },

    /* ----------------------------------------------------------------------- when it fails */
    {
      id: 'when-it-fails',
      heading: L('When does L’Hôpital’s Rule not help?', 'Kapan Aturan L’Hôpital tidak membantu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The rule is a tool with conditions, and three things can go wrong: the quotient is not indeterminate, the rule cycles, or the quotient of derivatives has no limit.**

**1. Not an indeterminate form.** If the numerator has a finite limit that is not zero, or the quotient is already determinate, the rule must not be used. $\lim_{x\to2}\frac{x^2+1}{x+1}=\frac53$ by substitution; differentiating would give $\frac{2x}1\to4$, which is wrong. The same happens in the middle of a calculation, as in Example 2, once the quotient has stopped being $\frac00$.

**2. The rule cycles.** For $\lim_{x\to\infty}\frac{\sqrt{9x+1}}{\sqrt x+1}$ the quotient of derivatives is $\frac{9\sqrt x}{\sqrt{9x+1}}$, again of the form $\frac\infty\infty$, and the next round brings back a quotient of the same kind: you just keep cycling. Algebra settles it: divide numerator and denominator by $\sqrt x$ to get $\frac{\sqrt{9+1/x}}{1+1/\sqrt x}\to3$. Similarly $\frac{\sqrt{x^2+1}}{x}$ cycles between a quotient and its reciprocal, and the answer is $1$.

**3. The derivatives have no limit.** The theorem says the limit of $\frac fg$ equals the limit of $\frac{f'}{g'}$ *if the latter exists*. For $\lim_{x\to\infty}\frac{x+\sin x}{x}$ the quotient of derivatives is $1+\cos x$, which has no limit, so the rule says nothing, and yet the original limit exists: $\frac{x+\sin x}{x}=1+\frac{\sin x}{x}\to1$. In the same way $\lim_{x\to0^+}\frac{x^2\sin(1/x)}{\sin x}$ has derivatives with $\cos(1/x)$, which oscillates, while $x\sin\frac1x\cdot\frac{x}{\sin x}\to0$.

**One-sided limits that differ.** Example 3: $\frac{\sin x}{x^2}$ goes to $+\infty$ from the right and $-\infty$ from the left; the two-sided limit does not exist, and the rule gives the one-sided values correctly.

In all these cases a limit read directly, or a little algebra such as dividing by the dominant term, does what the rule cannot. Try them below: the stepper reports the status, and for a cycle or a missing limit it also reads the original quotient directly.`,
            T`**Aturan ini adalah alat dengan syarat, dan tiga hal bisa salah: hasil bagi bukan bentuk tak tentu, aturan berputar, atau hasil bagi turunan tidak punya limit.**

**1. Bukan bentuk tak tentu.** Jika pembilang memiliki limit terhingga yang bukan nol, atau hasil bagi sudah tentu, aturan tidak boleh dipakai. $\lim_{x\to2}\frac{x^2+1}{x+1}=\frac53$ dengan substitusi; menurunkan akan memberi $\frac{2x}1\to4$, yang salah. Hal yang sama terjadi di tengah perhitungan, seperti pada Contoh 2, begitu hasil bagi tidak lagi $\frac00$.

**2. Aturan berputar.** Untuk $\lim_{x\to\infty}\frac{\sqrt{9x+1}}{\sqrt x+1}$ hasil bagi turunannya $\frac{9\sqrt x}{\sqrt{9x+1}}$, lagi-lagi berbentuk $\frac\infty\infty$, dan putaran berikutnya membawa kembali hasil bagi sejenis: kamu hanya berputar-putar. Aljabar menyelesaikannya: bagi pembilang dan penyebut dengan $\sqrt x$ untuk mendapat $\frac{\sqrt{9+1/x}}{1+1/\sqrt x}\to3$. Demikian pula $\frac{\sqrt{x^2+1}}{x}$ berputar antara hasil bagi dan kebalikannya, dan jawabannya $1$.

**3. Turunannya tidak punya limit.** Teorema menyatakan limit $\frac fg$ sama dengan limit $\frac{f'}{g'}$ *jika yang terakhir ada*. Untuk $\lim_{x\to\infty}\frac{x+\sin x}{x}$ hasil bagi turunannya $1+\cos x$, yang tidak punya limit, sehingga aturan tidak menyatakan apa pun, namun limit semula ada: $\frac{x+\sin x}{x}=1+\frac{\sin x}{x}\to1$. Dengan cara yang sama $\lim_{x\to0^+}\frac{x^2\sin(1/x)}{\sin x}$ turunannya memuat $\cos(1/x)$, yang berosilasi, sedangkan $x\sin\frac1x\cdot\frac{x}{\sin x}\to0$.

**Limit satu sisi yang berbeda.** Contoh 3: $\frac{\sin x}{x^2}$ menuju $+\infty$ dari kanan dan $-\infty$ dari kiri; limit dua sisinya tidak ada, dan aturan memberi nilai satu sisi dengan benar.

Pada semua kasus ini limit yang dibaca langsung, atau sedikit aljabar seperti membagi dengan suku dominan, melakukan apa yang tidak dapat dilakukan aturan. Cobalah di bawah: alat melaporkan statusnya, dan untuk putaran atau limit yang tidak ada ia juga membaca hasil bagi semula secara langsung.`,
          ),
        },
        { kind: 'widget', name: 'lhopitalfail' },
      ],
    },

    /* --------------------------------------------------------------------- Cauchy and proof */
    {
      id: 'cauchy-proof',
      heading: L('Why is L’Hôpital’s Rule true?', 'Mengapa Aturan L’Hôpital benar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The rule comes from Cauchy's Mean Value Theorem, an extension of the [Mean Value Theorem](article:the-mean-value-theorem#mean-value-theorem) to two functions.**

*A picture first.* Take $f$ and $g$ with continuous derivatives, $f(a)=g(a)=0$ and $g'(a)\ne0$. Near $a$ they are close to their [linearizations](article:linearization-and-differentials#linearization), $f(x)=f'(a)(x-a)+\varepsilon_1(x-a)$ and $g(x)=g'(a)(x-a)+\varepsilon_2(x-a)$, with $\varepsilon_1,\varepsilon_2\to0$ as $x\to a$. Then
$$\frac{f(x)}{g(x)}=\frac{f'(a)+\varepsilon_1}{g'(a)+\varepsilon_2}\to\frac{f'(a)}{g'(a)}=\lim_{x\to a}\frac{f'(x)}{g'(x)}.$$
The ratio of two functions that vanish at $a$ is the ratio of their slopes there. The proof below needs neither $g'(a)\ne0$ nor continuous derivatives.

**Cauchy's Mean Value Theorem.** Suppose $f$ and $g$ are continuous on $[a,b]$ and differentiable on $(a,b)$, and $g'(x)\ne0$ throughout $(a,b)$. Then there is a number $c$ in $(a,b)$ with
$$\frac{f'(c)}{g'(c)}=\frac{f(b)-f(a)}{g(b)-g(a)}.$$
When $g(x)=x$ this is the Mean Value Theorem.

*Proof.* First, $g(a)\ne g(b)$: otherwise the Mean Value Theorem would give $g'(c)=\frac{g(b)-g(a)}{b-a}=0$ for some $c$, which is excluded. Then apply the Mean Value Theorem to
$$F(x)=f(x)-f(a)-\frac{f(b)-f(a)}{g(b)-g(a)}\,\big(g(x)-g(a)\big).$$
$F$ is continuous on $[a,b]$ and differentiable on $(a,b)$, and $F(a)=F(b)=0$. By [Rolle's Theorem](article:the-mean-value-theorem#rolle) there is $c$ with $F'(c)=0$, that is
$$f'(c)-\frac{f(b)-f(a)}{g(b)-g(a)}\,g'(c)=0,$$
which rearranges to the claim. ∎ Geometrically, the curve $(g(t),f(t))$ has a tangent parallel to the secant through its ends, and the slope of that tangent is $\frac{f'}{g'}$. Draw a curve below and see the tangents.

*Proof of l'Hôpital's Rule* (the case $x\to a^+$, form $\frac00$). Since $f(x)\to0$ and $g(x)\to0$ and both are differentiable at $a$, they are continuous there and $f(a)=g(a)=0$. For $x$ to the right of $a$ apply Cauchy's theorem on $[a,x]$: there is $c$ between $a$ and $x$ with
$$\frac{f'(c)}{g'(c)}=\frac{f(x)-f(a)}{g(x)-g(a)}=\frac{f(x)}{g(x)}.$$
As $x\to a^+$, $c$ is squeezed between $a$ and $x$, so $c\to a^+$, and therefore
$$\lim_{x\to a^+}\frac{f(x)}{g(x)}=\lim_{c\to a^+}\frac{f'(c)}{g'(c)}=\lim_{x\to a^+}\frac{f'(x)}{g'(x)}.$$
The case $x\to a^-$ is the same on $[x,a]$, and the two together give the two-sided rule. ∎`,
            T`**Aturan ini berasal dari Teorema Nilai Rata-rata Cauchy, perluasan [Teorema Nilai Rata-rata](article:the-mean-value-theorem#mean-value-theorem) untuk dua fungsi.**

*Gambaran dulu.* Ambil $f$ dan $g$ dengan turunan kontinu, $f(a)=g(a)=0$, dan $g'(a)\ne0$. Di dekat $a$ keduanya dekat dengan [linearisasinya](article:linearization-and-differentials#linearization), $f(x)=f'(a)(x-a)+\varepsilon_1(x-a)$ dan $g(x)=g'(a)(x-a)+\varepsilon_2(x-a)$, dengan $\varepsilon_1,\varepsilon_2\to0$ ketika $x\to a$. Maka
$$\frac{f(x)}{g(x)}=\frac{f'(a)+\varepsilon_1}{g'(a)+\varepsilon_2}\to\frac{f'(a)}{g'(a)}=\lim_{x\to a}\frac{f'(x)}{g'(x)}.$$
Hasil bagi dua fungsi yang lenyap di $a$ adalah hasil bagi gradiennya di sana. Bukti di bawah tidak memerlukan $g'(a)\ne0$ maupun turunan kontinu.

**Teorema Nilai Rata-rata Cauchy.** Misalkan $f$ dan $g$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$, dan $g'(x)\ne0$ di seluruh $(a,b)$. Maka ada bilangan $c$ di $(a,b)$ dengan
$$\frac{f'(c)}{g'(c)}=\frac{f(b)-f(a)}{g(b)-g(a)}.$$
Ketika $g(x)=x$ ini adalah Teorema Nilai Rata-rata.

*Bukti.* Pertama, $g(a)\ne g(b)$: jika tidak, Teorema Nilai Rata-rata akan memberi $g'(c)=\frac{g(b)-g(a)}{b-a}=0$ untuk suatu $c$, yang dikecualikan. Lalu terapkan Teorema Nilai Rata-rata pada
$$F(x)=f(x)-f(a)-\frac{f(b)-f(a)}{g(b)-g(a)}\,\big(g(x)-g(a)\big).$$
$F$ kontinu pada $[a,b]$ dan terdiferensialkan pada $(a,b)$, dan $F(a)=F(b)=0$. Menurut [Teorema Rolle](article:the-mean-value-theorem#rolle) ada $c$ dengan $F'(c)=0$, yaitu
$$f'(c)-\frac{f(b)-f(a)}{g(b)-g(a)}\,g'(c)=0,$$
yang disusun ulang menjadi pernyataan itu. ∎ Secara geometri, kurva $(g(t),f(t))$ memiliki garis singgung yang sejajar dengan tali busur melalui ujungnya, dan gradien garis singgung itu adalah $\frac{f'}{g'}$. Gambarlah kurva di bawah dan lihat garis singgungnya.

*Bukti Aturan l'Hôpital* (kasus $x\to a^+$, bentuk $\frac00$). Karena $f(x)\to0$ dan $g(x)\to0$ dan keduanya terdiferensialkan di $a$, keduanya kontinu di sana dan $f(a)=g(a)=0$. Untuk $x$ di kanan $a$ terapkan teorema Cauchy pada $[a,x]$: ada $c$ di antara $a$ dan $x$ dengan
$$\frac{f'(c)}{g'(c)}=\frac{f(x)-f(a)}{g(x)-g(a)}=\frac{f(x)}{g(x)}.$$
Ketika $x\to a^+$, $c$ terjepit di antara $a$ dan $x$, sehingga $c\to a^+$, dan karena itu
$$\lim_{x\to a^+}\frac{f(x)}{g(x)}=\lim_{c\to a^+}\frac{f'(c)}{g'(c)}=\lim_{x\to a^+}\frac{f'(x)}{g'(x)}.$$
Kasus $x\to a^-$ sama pada $[x,a]$, dan keduanya bersama memberi aturan dua sisi. ∎`,
          ),
        },
        { kind: 'widget', name: 'cauchytool' },
      ],
    },

    /* ---------------------------------------------------------------------------- in code */
    {
      id: 'lhopital-in-code',
      heading: L('How do you compute these limits in code?', 'Bagaimana menghitung limit ini dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In code, SymPy's ´sp.limit(expr, x, a, '+')´ finds limits exactly, and a few lines of ´sp.diff´ reproduce the rule round by round.** Without a CAS, a table of the quotient at shrinking distances shows the limit, and the table of $\frac{f'}{g'}$ next to it converges to the same number, which is the content of the rule. Numerical evaluation near a point has a trap that the rule does not: for $(1+h)^{1/h}$ the computer rounds $1+h$ to $1$ once $h$ is below about $10^{-16}$ and returns $1$ instead of $e$, so a table must stop at moderate $h$.`,
            T`**Dalam kode, ´sp.limit(expr, x, a, '+')´ dari SymPy mencari limit secara eksak, dan beberapa baris ´sp.diff´ mereproduksi aturan putaran demi putaran.** Tanpa CAS, tabel hasil bagi pada jarak yang mengecil menunjukkan limitnya, dan tabel $\frac{f'}{g'}$ di sebelahnya menuju bilangan yang sama, yang merupakan isi aturan. Evaluasi numerik di dekat suatu titik punya jebakan yang tidak dimiliki aturan: untuk $(1+h)^{1/h}$ komputer membulatkan $1+h$ menjadi $1$ begitu $h$ di bawah sekitar $10^{-16}$ dan mengembalikan $1$, bukan $e$, sehingga tabel harus berhenti pada $h$ sedang.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python and SymPy: the rule round by round', 'Python dan SymPy: aturan putaran demi putaran'),
          code: `import sympy as sp

x = sp.symbols('x')


def lhopital(f, g, a, direction='+-', rounds=6):
    """Apply l'Hopital's Rule while the quotient is 0/0 or oo/oo; return the quotient at each round and the limit."""
    steps = []
    for _ in range(rounds):
        lf, lg = sp.limit(f, x, a, direction), sp.limit(g, x, a, direction)
        indeterminate = (lf == 0 and lg == 0) or (lf in (sp.oo, -sp.oo) and lg in (sp.oo, -sp.oo))
        steps.append((sp.simplify(f / g), 'rule' if indeterminate else 'stop'))
        if not indeterminate:
            break
        f, g = sp.diff(f, x), sp.diff(g, x)
    return steps, sp.limit(f / g, x, a, direction)


examples = (
    (3 * x - sp.sin(x), x, 0),                                        # Example 1a
    (x - sp.sin(x), x**3, 0),                                         # Example 1d: three rounds
    (1 - sp.cos(x), x + x**2, 0),                                     # Example 2: one round, then stop
    (sp.exp(x), x**2, sp.oo),                                         # Example 4c
    (sp.sin(x) - x, x * sp.sin(x), 0),                                # Example 6: 1/x - 1/sin x as one fraction
)
for f, g, a in examples:
    print(f, '/', g, 'at', a, '->', lhopital(f, g, a))
print(sp.limit((1 + x) ** (1 / x), x, 0, '+'), sp.limit(x ** (1 / x), x, sp.oo), sp.limit(x ** x, x, 0, '+'))
# 3*x - sin(x) / x at 0 -> ([(3 - sin(x)/x, 'rule'), (3 - cos(x), 'stop')], 2)
# x - sin(x) / x**3 at 0 -> ([((x - sin(x))/x**3, 'rule'), ((1 - cos(x))/(3*x**2), 'rule'), (sin(x)/(6*x), 'rule'), (cos(x)/6, 'stop')], 1/6)
# 1 - cos(x) / x**2 + x at 0 -> ([((1 - cos(x))/(x*(x + 1)), 'rule'), (sin(x)/(2*x + 1), 'stop')], 0)
# exp(x) / x**2 at oo -> ([(exp(x)/x**2, 'rule'), (exp(x)/(2*x), 'rule'), (exp(x)/2, 'stop')], oo)
# -x + sin(x) / x*sin(x) at 0 -> ([((-x/sin(x) + 1)/x, 'rule'), ((cos(x) - 1)/(x*cos(x) + sin(x)), 'rule'), (sin(x)/(x*sin(x) - 2*cos(x)), 'stop')], 0)
# E 1 1`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the quotient and the quotient of derivatives', 'JavaScript: hasil bagi dan hasil bagi turunan'),
          code: `// the quotient f/g at shrinking distances from a: f/g and f'/g' (and the rounds after it) tend to the same number
const near = (f, g, a, hs = [0.1, 0.01, 0.001]) => hs.map((h) => +(f(a + h) / g(a + h)).toFixed(5))
const f = (x) => x - Math.sin(x)
const g = (x) => x ** 3                                              // Example 1d, whose limit is 1/6
near(f, g, 0)                                                        // [0.16658, 0.16667, 0.16667]   f/g
near((x) => 1 - Math.cos(x), (x) => 3 * x * x, 0)                    // [0.16653, 0.16667, 0.16667]   f'/g'
near((x) => Math.sin(x), (x) => 6 * x, 0)                            // [0.16639, 0.16666, 0.16667]   f''/g''
near((x) => Math.cos(x), () => 6, 0)                                 // [0.16583, 0.16666, 0.16667]   f'''/g''': no longer 0/0
// a power limit, and the trap of rounding: (1 + h)^(1/h) tends to e, until 1 + h is rounded to 1
;[1e-2, 1e-4, 1e-6].map((h) => (1 + h) ** (1 / h))                    // [2.7048138294215285, 2.7181459268249255, 2.7182804690957534]
;(1 + 1e-17) ** (1 / 1e-17)                                           // 1: 1 + 1e-17 is 1 in floating point
;[1e-2, 1e-4, 1e-8].map((h) => h * Math.log(h))                       // [-0.046, -0.00092, -1.84e-7]: x ln x -> 0`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++', 'C++'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

int main() {
  double hs[3];
  hs[0] = 0.1; hs[1] = 0.01; hs[2] = 0.001;
  for (int i = 0; i < 3; i++) {                          // Example 1d: (x - sin x) / x^3, limit 1/6
    double h = hs[i];
    double q0 = (h - sin(h)) / (h * h * h);              // f / g
    double q1 = (1 - cos(h)) / (3 * h * h);              // f' / g'
    double q2 = sin(h) / (6 * h);                        // f'' / g''
    double q3 = cos(h) / 6;                              // f''' / g''', no longer 0/0
    printf("h=%.3f %.5f %.5f %.5f %.5f\\n", h, q0, q1, q2, q3);
  }
  printf("%.5f\\n", 1.0 / 6);
  printf("%.5f %.5f\\n", pow(1.01, 100.0), pow(1.0001, 10000.0));    // (1 + h)^(1/h) tends to e = 2.71828
  return 0;
}

/* output:
h=0.100 0.16658 0.16653 0.16639 0.16583
h=0.010 0.16667 0.16667 0.16666 0.16666
h=0.001 0.16667 0.16667 0.16667 0.16667
0.16667
2.70481 2.71815
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who discovered L’Hôpital’s Rule?', 'Siapa yang menemukan Aturan L’Hôpital?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The rule carries the name of the man who published it, not of the man who found it.**

- **Johann Bernoulli, 1691–92.** The Swiss mathematician Johann Bernoulli, a young pupil of the new calculus of Leibniz, taught it in Paris to the French nobleman Guillaume de l'Hôpital, and in the lessons he gave the way of finding the value of a fraction whose numerator and denominator both vanish.
- **l'Hôpital, 1696.** In his *Analyse des infiniment petits pour l'intelligence des lignes courbes*, the first textbook of the differential calculus, l'Hôpital printed the rule, saying that he owed much to Bernoulli and Leibniz. Under an agreement l'Hôpital paid Bernoulli for his discoveries and was free to use them.
- **A manuscript, 1921.** Bernoulli's own lecture notes on the differential calculus were found in the 1920s, and they show that the rule, and much else in the textbook, is Bernoulli's. The name stayed.
- **Cauchy, 1823.** Augustin-Louis Cauchy gave the general statement and the proof through the mean value theorem for two functions, which carries his name. The original rule dealt with the quotient of two expressions that vanish at a point; repeated use, one-sided limits and the form $\frac\infty\infty$ were settled in the 19th century.
- **Today.** The rule is the first tool for indeterminate limits and the way that limits such as $\frac{\sin x}x$ and $\frac{\ln x}{x}$ are taught; computer algebra systems compute them with series, which is faster.`,
            T`**Aturan ini memakai nama orang yang menerbitkannya, bukan orang yang menemukannya.**

- **Johann Bernoulli, 1691–92.** Matematikawan Swiss Johann Bernoulli, murid muda kalkulus baru Leibniz, mengajarkannya di Paris kepada bangsawan Prancis Guillaume de l'Hôpital, dan dalam pelajarannya ia memberi cara mencari nilai pecahan yang pembilang dan penyebutnya sama-sama lenyap.
- **l'Hôpital, 1696.** Dalam *Analyse des infiniment petits pour l'intelligence des lignes courbes*, buku teks pertama kalkulus diferensial, l'Hôpital mencetak aturan itu, dengan menyatakan bahwa ia berutang banyak kepada Bernoulli dan Leibniz. Berdasarkan perjanjian l'Hôpital membayar Bernoulli untuk penemuannya dan bebas memakainya.
- **Sebuah naskah, 1921.** Catatan kuliah Bernoulli sendiri tentang kalkulus diferensial ditemukan pada tahun 1920-an, dan menunjukkan bahwa aturan itu, dan banyak hal lain dalam buku teks tersebut, milik Bernoulli. Namanya tetap.
- **Cauchy, 1823.** Augustin-Louis Cauchy memberi pernyataan umum dan bukti lewat teorema nilai rata-rata untuk dua fungsi, yang memakai namanya. Aturan asli menangani hasil bagi dua ungkapan yang lenyap di suatu titik; pemakaian berulang, limit satu sisi, dan bentuk $\frac\infty\infty$ diselesaikan pada abad ke-19.
- **Sekarang.** Aturan ini adalah alat pertama untuk limit tak tentu dan cara limit seperti $\frac{\sin x}x$ dan $\frac{\ln x}{x}$ diajarkan; sistem aljabar komputer menghitungnya dengan deret, yang lebih cepat.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with L’Hôpital’s Rule?', 'Kesalahan apa yang sering terjadi pada Aturan L’Hôpital?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with indeterminate forms and l'Hôpital's Rule are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Take the derivative of the quotient $\left(\frac fg\right)'$ | Divide the derivatives: $\frac{f'}{g'}$. For $\frac{x^2-1}{x-1}$ at $1$ the limit is $\frac{2x}{1}\to2$, while $\left(x+1\right)'=1$. |
| ❌ Use the rule on any limit | Only on $\frac00$ and $\frac\infty\infty$: $\lim_{x\to2}\frac{x^2+1}{x+1}=\frac53$, and $\frac{2x}1\to4$ is wrong. |
| ❌ Keep differentiating after the form is gone | $\frac{1-\cos x}{x+x^2}\to\frac{\sin x}{1+2x}\to0$; one more round gives the wrong $\frac12$. |
| ❌ $\frac00$ is $1$, or $0$ | $\frac xx\to1$, $\frac{x^3}{x}\to0$, $\frac{x}{x^3}\to\infty$, $\frac{2x}{x}\to2$: the label decides nothing. |
| ❌ If $\frac{f'}{g'}$ has no limit, neither has $\frac fg$ | $\frac{x+\sin x}x\to1$ although $1+\cos x$ has no limit. |
| ❌ $0\cdot\infty=0$ | $x\ln x\to0$, but $x\cdot\frac1x=1$ and $x\cdot\frac1{x^2}\to\infty$: rewrite as a quotient. |
| ❌ $1^\infty=1$ | $(1+x)^{1/x}\to e$: take the logarithm and use $e^L$. |
| ❌ $\infty-\infty=0$ | $x^2-x\to\infty$ and $x-x=0$: combine into one fraction first. |
| ❌ The one-sided result is the two-sided one | $\frac{\sin x}{x^2}\to+\infty$ from the right and $-\infty$ from the left: no two-sided limit. |`,
            T`**Kesalahan paling umum pada bentuk tak tentu dan Aturan L'Hôpital adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Menurunkan hasil bagi $\left(\frac fg\right)'$ | Bagi turunannya: $\frac{f'}{g'}$. Untuk $\frac{x^2-1}{x-1}$ di $1$ limitnya $\frac{2x}{1}\to2$, sedangkan $\left(x+1\right)'=1$. |
| ❌ Memakai aturan pada sembarang limit | Hanya pada $\frac00$ dan $\frac\infty\infty$: $\lim_{x\to2}\frac{x^2+1}{x+1}=\frac53$, dan $\frac{2x}1\to4$ salah. |
| ❌ Terus menurunkan setelah bentuknya hilang | $\frac{1-\cos x}{x+x^2}\to\frac{\sin x}{1+2x}\to0$; satu putaran lagi memberi $\frac12$ yang salah. |
| ❌ $\frac00$ adalah $1$, atau $0$ | $\frac xx\to1$, $\frac{x^3}{x}\to0$, $\frac{x}{x^3}\to\infty$, $\frac{2x}{x}\to2$: label itu tidak menentukan apa pun. |
| ❌ Jika $\frac{f'}{g'}$ tidak punya limit, $\frac fg$ juga tidak | $\frac{x+\sin x}x\to1$ walaupun $1+\cos x$ tidak punya limit. |
| ❌ $0\cdot\infty=0$ | $x\ln x\to0$, tetapi $x\cdot\frac1x=1$ dan $x\cdot\frac1{x^2}\to\infty$: tulis ulang sebagai hasil bagi. |
| ❌ $1^\infty=1$ | $(1+x)^{1/x}\to e$: ambil logaritma dan pakai $e^L$. |
| ❌ $\infty-\infty=0$ | $x^2-x\to\infty$ dan $x-x=0$: gabungkan menjadi satu pecahan lebih dahulu. |
| ❌ Hasil satu sisi adalah hasil dua sisi | $\frac{\sin x}{x^2}\to+\infty$ dari kanan dan $-\infty$ dari kiri: tidak ada limit dua sisi. |`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- practice */
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
              L(T`L'Hôpital's Rule applies to the forms $\frac00$ and $\frac\infty\infty$.`, T`Aturan L'Hôpital berlaku untuk bentuk $\frac00$ dan $\frac\infty\infty$.`),
              L(T`To use it, differentiate the quotient with the quotient rule.`, T`Untuk memakainya, turunkan hasil bagi dengan aturan hasil bagi.`),
              L(T`The rule may be applied again if the new quotient is still $\frac00$.`, T`Aturan boleh diterapkan lagi jika hasil bagi barunya masih $\frac00$.`),
              L(T`In $\lim_{x\to0}\frac{1-\cos x}{x+x^2}$ the rule should be applied a second time.`, T`Pada $\lim_{x\to0}\frac{1-\cos x}{x+x^2}$ aturan harus diterapkan kali kedua.`),
              L(T`If $\frac{f'}{g'}$ has no limit, then $\frac fg$ has no limit.`, T`Jika $\frac{f'}{g'}$ tidak punya limit, maka $\frac fg$ tidak punya limit.`),
              L(T`A product of the form $0\cdot\infty$ can be rewritten as a quotient.`, T`Hasil kali berbentuk $0\cdot\infty$ dapat ditulis ulang sebagai hasil bagi.`),
            ],
            answer: [true, false, true, false, false, true],
            explain: L(
              T`The rule uses $\frac{f'}{g'}$, not the quotient rule. After one round $\frac{\sin x}{1+2x}$ is $\frac01$, so stop. $\frac{x+\sin x}x\to1$ although $1+\cos x$ has no limit. A product $f\cdot g$ is $\frac{f}{1/g}$.`,
              T`Aturan memakai $\frac{f'}{g'}$, bukan aturan hasil bagi. Setelah satu putaran $\frac{\sin x}{1+2x}$ adalah $\frac01$, jadi berhenti. $\frac{x+\sin x}x\to1$ walaupun $1+\cos x$ tidak punya limit. Hasil kali $f\cdot g$ adalah $\frac{f}{1/g}$.`,
            ),
            hint: L(T`Recall the caution, Example 2 and the third kind of failure.`, T`Ingat peringatan, Contoh 2, dan kegagalan jenis ketiga.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Choose **all** the indeterminate forms.`, T`Pilih **semua** bentuk tak tentu.`),
            options: [L(T`$\frac00$`, T`$\frac00$`), L(T`$\frac\infty\infty$`, T`$\frac\infty\infty$`), L(T`$\frac10$`, T`$\frac10$`), L(T`$\infty-\infty$`, T`$\infty-\infty$`), L(T`$0\cdot\infty$`, T`$0\cdot\infty$`), L(T`$0^\infty$`, T`$0^\infty$`)],
            answer: [0, 1, 3, 4],
            explain: L(T`$\frac10$ is infinite (or does not exist), and $0^\infty=0$: those are determinate. The other four leave the limit open.`, T`$\frac10$ tak hingga (atau tidak ada), dan $0^\infty=0$: keduanya sudah tentu. Empat lainnya membiarkan limitnya terbuka.`),
            hint: L(T`Which ones can come out as different numbers in different limits?`, T`Mana yang dapat memberi bilangan berbeda pada limit yang berbeda?`),
          },
        },
        {
          kind: 'activity',
          title: L('Two rounds', 'Dua putaran'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$\frac{e^x-1-x}{x^2}\to\frac{e^x-1}{2x}$, still $\frac00$.`, T`$\frac{e^x-1-x}{x^2}\to\frac{e^x-1}{2x}$, masih $\frac00$.`), L(T`Then $\frac{e^x}{2}\to\frac12$.`, T`Lalu $\frac{e^x}{2}\to\frac12$.`)],
            explain: L(T`$\frac{e^x-1-x}{x^2}\to\frac{e^x-1}{2x}\to\frac{e^x}{2}\to\frac12$.`, T`$\frac{e^x-1-x}{x^2}\to\frac{e^x-1}{2x}\to\frac{e^x}{2}\to\frac12$.`),
            prompt: L(T`Find $\lim_{x\to0}\frac{e^x-1-x}{x^2}$.`, T`Tentukan $\lim_{x\to0}\frac{e^x-1-x}{x^2}$.`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 0.5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A sine over a line', 'Sinus per garis'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`Both $\sin5x$ and $x$ go to $0$: the form is $\frac00$.`, T`$\sin5x$ dan $x$ keduanya menuju $0$: bentuknya $\frac00$.`), L(T`$\frac{5\cos5x}{1}\to5$.`, T`$\frac{5\cos5x}{1}\to5$.`)],
            explain: L(T`$\lim\frac{\sin5x}{x}=\lim\frac{5\cos5x}1=5$.`, T`$\lim\frac{\sin5x}{x}=\lim\frac{5\cos5x}1=5$.`),
            prompt: L(T`Find $\lim_{x\to0}\frac{\sin5x}{x}$.`, T`Tentukan $\lim_{x\to0}\frac{\sin5x}{x}$.`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 5 }],
          },
        },
        {
          kind: 'activity',
          title: L('Leading coefficients', 'Koefisien utama'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`The form is $\frac\infty\infty$: differentiate twice.`, T`Bentuknya $\frac\infty\infty$: turunkan dua kali.`), L(T`$\frac{6x}{10x-1}\to\frac{6}{10}$.`, T`$\frac{6x}{10x-1}\to\frac{6}{10}$.`)],
            explain: L(T`$\frac{3x^2+1}{5x^2-x}\to\frac{6x}{10x-1}\to\frac6{10}=0.6$.`, T`$\frac{3x^2+1}{5x^2-x}\to\frac{6x}{10x-1}\to\frac6{10}=0{,}6$.`),
            prompt: L(T`Find $\lim_{x\to\infty}\frac{3x^2+1}{5x^2-x}$.`, T`Tentukan $\lim_{x\to\infty}\frac{3x^2+1}{5x^2-x}$.`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 0.6 }],
          },
        },
        {
          kind: 'activity',
          title: L('A product', 'Sebuah hasil kali'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L(T`What is $\lim_{x\to0^+}x\ln x$, and how is it found?`, T`Berapa $\lim_{x\to0^+}x\ln x$, dan bagaimana mencarinya?`),
            options: [
              L(T`$0$: write it as $\frac{\ln x}{1/x}$, an $\frac\infty\infty$ form, and apply the rule`, T`$0$: tulis sebagai $\frac{\ln x}{1/x}$, bentuk $\frac\infty\infty$, dan terapkan aturan`),
              L(T`$-\infty$, because $\ln x\to-\infty$`, T`$-\infty$, karena $\ln x\to-\infty$`),
              L(T`$1$, because $x\cdot\ln x$ is a product of ones`, T`$1$, karena $x\cdot\ln x$ hasil kali satu`),
              L(T`it does not exist`, T`tidak ada`),
            ],
            answer: 0,
            explain: L(T`$\frac{1/x}{-1/x^2}=-x\to0$. The factor $x\to0$ beats $\ln x\to-\infty$.`, T`$\frac{1/x}{-1/x^2}=-x\to0$. Faktor $x\to0$ mengalahkan $\ln x\to-\infty$.`),
            hint: L(T`Put one factor in the denominator as its reciprocal.`, T`Taruh satu faktor di penyebut sebagai kebalikannya.`),
          },
        },
        {
          kind: 'activity',
          title: L('A power of e', 'Pangkat dari e'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`The form is $1^\infty$; take $\ln$: $x\ln\left(1+\frac3x\right)=\frac{\ln(1+3/x)}{1/x}$.`, T`Bentuknya $1^\infty$; ambil $\ln$: $x\ln\left(1+\frac3x\right)=\frac{\ln(1+3/x)}{1/x}$.`), L(T`The rule gives $\frac{3}{1+3/x}\to3$.`, T`Aturan memberi $\frac{3}{1+3/x}\to3$.`)],
            explain: L(T`$\ln y\to3$, so $\lim\left(1+\frac3x\right)^x=e^3$.`, T`$\ln y\to3$, sehingga $\lim\left(1+\frac3x\right)^x=e^3$.`),
            prompt: L(T`$\lim_{x\to\infty}\left(1+\frac3x\right)^x=e^k$. Find $k$.`, T`$\lim_{x\to\infty}\left(1+\frac3x\right)^x=e^k$. Tentukan $k$.`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('Should the rule be used?', 'Haruskah aturan dipakai?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`Why must the rule not be used for $\lim_{x\to2}\frac{x^2+1}{x+1}$?`, T`Mengapa aturan tidak boleh dipakai untuk $\lim_{x\to2}\frac{x^2+1}{x+1}$?`),
            options: [
              L(T`the quotient is $\frac53$ at $2$: it is not $\frac00$ or $\frac\infty\infty$`, T`hasil baginya $\frac53$ di $2$: bukan $\frac00$ atau $\frac\infty\infty$`),
              L(T`the limit does not exist`, T`limitnya tidak ada`),
              L(T`$x^2+1$ is not differentiable`, T`$x^2+1$ tidak terdiferensialkan`),
              L(T`the rule never works for polynomials`, T`aturan tidak pernah berlaku untuk polinom`),
            ],
            answer: 0,
            explain: L(T`Substitution gives $\frac{5}{3}$. The rule would give $\frac{2x}{1}\to4$, which is wrong because the form is not indeterminate.`, T`Substitusi memberi $\frac{5}{3}$. Aturan akan memberi $\frac{2x}{1}\to4$, yang salah karena bentuknya bukan tak tentu.`),
            hint: L(T`What are the numerator and the denominator at $x=2$?`, T`Berapa pembilang dan penyebut di $x=2$?`),
          },
        },
        {
          kind: 'activity',
          title: L('A logarithm over a line', 'Logaritma per garis'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`$\ln1=0$ and $1-1=0$.`, T`$\ln1=0$ dan $1-1=0$.`), L(T`$\frac{1/x}{1}\to1$.`, T`$\frac{1/x}{1}\to1$.`)],
            explain: L(T`$\lim_{x\to1}\frac{\ln x}{x-1}=\lim\frac{1/x}{1}=1$: the derivative of $\ln$ at $1$.`, T`$\lim_{x\to1}\frac{\ln x}{x-1}=\lim\frac{1/x}{1}=1$: turunan $\ln$ di $1$.`),
            prompt: L(T`Find $\lim_{x\to1}\frac{\ln x}{x-1}$.`, T`Tentukan $\lim_{x\to1}\frac{\ln x}{x-1}$.`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('A rule that cycles', 'Aturan yang berputar'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`What happens with $\lim_{x\to\infty}\frac{\sqrt{9x+1}}{\sqrt x+1}$, and what is the limit?`, T`Apa yang terjadi pada $\lim_{x\to\infty}\frac{\sqrt{9x+1}}{\sqrt x+1}$, dan berapa limitnya?`),
            options: [
              L(T`the rule cycles; dividing by $\sqrt x$ shows the limit is $3$`, T`aturan berputar; membagi dengan $\sqrt x$ menunjukkan limitnya $3$`),
              L(T`the rule gives $9$`, T`aturan memberi $9$`),
              L(T`the limit is $\infty$`, T`limitnya $\infty$`),
              L(T`the limit does not exist`, T`limitnya tidak ada`),
            ],
            answer: 0,
            explain: L(T`The quotient of derivatives is again $\frac\infty\infty$ and the rounds repeat. $\frac{\sqrt{9+1/x}}{1+1/\sqrt x}\to\frac31=3$.`, T`Hasil bagi turunan lagi berbentuk $\frac\infty\infty$ dan putarannya berulang. $\frac{\sqrt{9+1/x}}{1+1/\sqrt x}\to\frac31=3$.`),
            hint: L(T`Try dividing numerator and denominator by the dominant term.`, T`Coba bagi pembilang dan penyebut dengan suku dominan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Exponentials around zero', 'Eksponensial di sekitar nol'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`The form is $\frac00$: differentiate the numerator and the denominator.`, T`Bentuknya $\frac00$: turunkan pembilang dan penyebut.`), L(T`$\frac{e^x+e^{-x}}{\cos x}\to\frac{1+1}{1}$.`, T`$\frac{e^x+e^{-x}}{\cos x}\to\frac{1+1}{1}$.`)],
            explain: L(T`$\frac{e^x-e^{-x}}{\sin x}\to\frac{e^x+e^{-x}}{\cos x}\to2$.`, T`$\frac{e^x-e^{-x}}{\sin x}\to\frac{e^x+e^{-x}}{\cos x}\to2$.`),
            prompt: L(T`Find $\lim_{x\to0}\frac{e^x-e^{-x}}{\sin x}$.`, T`Tentukan $\lim_{x\to0}\frac{e^x-e^{-x}}{\sin x}$.`),
            given: String.raw`L=v`,
            blanks: [{ label: 'L =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('One side or two', 'Satu sisi atau dua'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`What is $\lim_{x\to0}\frac{\sin x}{x^2}$?`, T`Berapa $\lim_{x\to0}\frac{\sin x}{x^2}$?`),
            options: [
              L(T`it does not exist: $+\infty$ from the right and $-\infty$ from the left`, T`tidak ada: $+\infty$ dari kanan dan $-\infty$ dari kiri`),
              L(T`$0$`, T`$0$`),
              L(T`$1$`, T`$1$`),
              L(T`$+\infty$`, T`$+\infty$`),
            ],
            answer: 0,
            explain: L(T`The rule gives $\frac{\cos x}{2x}$, which is $+\infty$ for $x\to0^+$ and $-\infty$ for $x\to0^-$. The one-sided limits differ.`, T`Aturan memberi $\frac{\cos x}{2x}$, yang $+\infty$ untuk $x\to0^+$ dan $-\infty$ untuk $x\to0^-$. Limit satu sisinya berbeda.`),
            hint: L(T`Look at the sign of $2x$ on each side.`, T`Lihat tanda $2x$ di setiap sisi.`),
          },
        },
      ],
    },

    /* ---------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: L’Hôpital’s Rule at a glance', 'Ringkasan: Aturan L’Hôpital sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Indeterminate forms:** $\frac00$, $\frac\infty\infty$, $0\cdot\infty$, $\infty-\infty$, $1^\infty$, $0^0$, $\infty^0$ describe limits that the parts do not decide.
- **The rule:** $\frac00$ or $\frac\infty\infty$ at $a$ gives $\lim\frac fg=\lim\frac{f'}{g'}$ if the right side exists or is $\pm\infty$; also for one-sided limits and $a=\pm\infty$.
- **How:** differentiate $f$ and $g$ separately, repeat while the form stays indeterminate, stop at the first quotient that is not.
- **Other forms:** products and differences become a quotient by algebra; powers by $\ln$, then $e^L$.
- **Growth:** $\ln x\ll x^p\ll e^x$ as $x\to\infty$.
- **When it fails:** a determinate quotient, a cycle ($\sqrt{9x+1}/(\sqrt x+1)$), or $\frac{f'}{g'}$ without a limit ($(x+\sin x)/x$).
- **Proof:** Cauchy's Mean Value Theorem, $\frac{f'(c)}{g'(c)}=\frac{f(b)-f(a)}{g(b)-g(a)}$, then squeeze $c$ between $a$ and $x$.
- **Next:** applied optimization, the closed interval method put to work on real problems.
- **Code:** ´sp.limit(expr, x, a, '+')´, ´sp.diff´ for the rounds, and tables at moderate distances.`,
            T`- **Bentuk tak tentu:** $\frac00$, $\frac\infty\infty$, $0\cdot\infty$, $\infty-\infty$, $1^\infty$, $0^0$, $\infty^0$ menggambarkan limit yang tidak ditentukan oleh bagian-bagiannya.
- **Aturan:** $\frac00$ atau $\frac\infty\infty$ di $a$ memberi $\lim\frac fg=\lim\frac{f'}{g'}$ jika ruas kanan ada atau $\pm\infty$; juga untuk limit satu sisi dan $a=\pm\infty$.
- **Cara:** turunkan $f$ dan $g$ secara terpisah, ulangi selama bentuknya tetap tak tentu, berhenti pada hasil bagi pertama yang bukan.
- **Bentuk lain:** hasil kali dan selisih menjadi hasil bagi dengan aljabar; pangkat dengan $\ln$, lalu $e^L$.
- **Pertumbuhan:** $\ln x\ll x^p\ll e^x$ ketika $x\to\infty$.
- **Ketika gagal:** hasil bagi yang sudah tentu, putaran ($\sqrt{9x+1}/(\sqrt x+1)$), atau $\frac{f'}{g'}$ tanpa limit ($(x+\sin x)/x$).
- **Bukti:** Teorema Nilai Rata-rata Cauchy, $\frac{f'(c)}{g'(c)}=\frac{f(b)-f(a)}{g(b)-g(a)}$, lalu jepit $c$ di antara $a$ dan $x$.
- **Berikutnya:** optimisasi terapan, metode selang tertutup yang dipakai pada masalah nyata.
- **Kode:** ´sp.limit(expr, x, a, '+')´, ´sp.diff´ untuk putarannya, dan tabel pada jarak sedang.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Indeterminate form', 'Bentuk tak tentu'), definition: L('A label for a limit, such as zero over zero, whose value is not decided by the limits of its parts and can come out as any number or infinity.', 'Label untuk limit, seperti nol per nol, yang nilainya tidak ditentukan oleh limit bagian-bagiannya dan dapat bernilai bilangan apa pun atau tak hingga.') },
    { term: L('L’Hôpital’s Rule', 'Aturan L’Hôpital'), definition: L('The rule that the limit of a quotient of the form zero over zero or infinity over infinity equals the limit of the quotient of the derivatives, if that limit exists.', 'Aturan bahwa limit hasil bagi berbentuk nol per nol atau tak hingga per tak hingga sama dengan limit hasil bagi turunannya, jika limit itu ada.') },
    { term: L('Cauchy’s Mean Value Theorem', 'Teorema Nilai Rata-rata Cauchy'), definition: L('The Mean Value Theorem for two functions: for some point c, the ratio of the derivatives equals the ratio of the changes of the functions over the interval.', 'Teorema Nilai Rata-rata untuk dua fungsi: untuk suatu titik c, hasil bagi turunan sama dengan hasil bagi perubahan fungsi pada selang.') },
    { term: L('Indeterminate power', 'Pangkat tak tentu'), definition: L('A limit of the form one to the infinity, zero to the zero or infinity to the zero, found by taking the logarithm of the function and exponentiating the limit.', 'Limit berbentuk satu pangkat tak hingga, nol pangkat nol, atau tak hingga pangkat nol, yang dicari dengan mengambil logaritma fungsi dan mengeksponensialkan limitnya.') },
    { term: L('One-sided limit', 'Limit satu sisi'), definition: L('The limit as x approaches a from only the right or only the left; the two-sided limit exists only if both are equal.', 'Limit ketika x mendekati a hanya dari kanan atau hanya dari kiri; limit dua sisi ada hanya jika keduanya sama.') },
    { term: L('Growth rate', 'Laju tumbuh'), definition: L('How fast a function grows as x goes to infinity; a logarithm grows slower than any power, and an exponential faster than any power.', 'Seberapa cepat fungsi tumbuh ketika x menuju tak hingga; logaritma tumbuh lebih lambat daripada pangkat mana pun, dan eksponensial lebih cepat daripada pangkat mana pun.') },
  ],

  howTo: [
    {
      name: L('How to evaluate a limit with L’Hôpital’s Rule', 'Cara menghitung limit dengan Aturan L’Hôpital'),
      description: L('Check the form, differentiate the numerator and the denominator separately, and repeat while the quotient is still indeterminate.', 'Periksa bentuknya, turunkan pembilang dan penyebut secara terpisah, dan ulangi selama hasil bagi masih tak tentu.'),
      steps: [
        { name: L('Find the form', 'Cari bentuknya'), text: L('Find the limit of the numerator and of the denominator; the rule is for zero over zero and infinity over infinity only.', 'Cari limit pembilang dan penyebut; aturan hanya untuk nol per nol dan tak hingga per tak hingga.') },
        { name: L('Differentiate each part', 'Turunkan tiap bagian'), text: L('Replace f over g by f prime over g prime, the derivatives taken separately and not by the quotient rule.', 'Ganti f per g dengan f aksen per g aksen, turunan diambil terpisah dan bukan dengan aturan hasil bagi.') },
        { name: L('Check the new form', 'Periksa bentuk baru'), text: L('If the new quotient is still indeterminate, repeat; if it is not, stop at once and read its limit.', 'Jika hasil bagi baru masih tak tentu, ulangi; jika tidak, berhenti seketika dan baca limitnya.') },
        { name: L('Read the limit', 'Baca limitnya'), text: L('If the limit of the new quotient exists or is infinite, it is the limit of the original; if it does not exist, the rule says nothing.', 'Jika limit hasil bagi baru ada atau tak hingga, itulah limit semula; jika tidak ada, aturan tidak menyatakan apa pun.') },
      ],
    },
    {
      name: L('How to find a limit of the form 1 to the infinity, 0 to the 0 or infinity to the 0', 'Cara mencari limit berbentuk 1 pangkat tak hingga, 0 pangkat 0, atau tak hingga pangkat 0'),
      description: L('Take the logarithm of the function, turn the product into a quotient, apply the rule, and exponentiate.', 'Ambil logaritma fungsi, ubah hasil kali menjadi hasil bagi, terapkan aturan, dan eksponensialkan.'),
      steps: [
        { name: L('Take the logarithm', 'Ambil logaritma'), text: L('For f equal to u to the v, write the logarithm of f as v times the logarithm of u.', 'Untuk f sama dengan u pangkat v, tulis logaritma f sebagai v dikali logaritma u.') },
        { name: L('Make a quotient', 'Buat hasil bagi'), text: L('Write v times the logarithm of u as the logarithm of u divided by one over v.', 'Tulis v dikali logaritma u sebagai logaritma u dibagi satu per v.') },
        { name: L('Apply the rule', 'Terapkan aturan'), text: L('Find the limit L of the logarithm of f with the rule.', 'Cari limit L dari logaritma f dengan aturan.') },
        { name: L('Exponentiate', 'Eksponensialkan'), text: L('The limit of f is e to the L; if L is plus infinity the limit is infinity, and if L is minus infinity it is zero.', 'Limit f adalah e pangkat L; jika L plus tak hingga limitnya tak hingga, dan jika L minus tak hingga limitnya nol.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is L’Hôpital’s Rule?', 'Apa itu Aturan L’Hôpital?'),
      a: L(
        'It is a rule for limits of quotients. If the numerator and the denominator both go to zero, or both go to infinity, the limit of the quotient equals the limit of the quotient of their derivatives, provided that second limit exists or is infinite.',
        'Itu adalah aturan untuk limit hasil bagi. Jika pembilang dan penyebut sama-sama menuju nol, atau sama-sama menuju tak hingga, limit hasil baginya sama dengan limit hasil bagi turunannya, asalkan limit kedua itu ada atau tak hingga.',
      ),
    },
    {
      q: L('What is an indeterminate form?', 'Apa itu bentuk tak tentu?'),
      a: L(
        'It is a label such as zero over zero or infinity over infinity for a limit whose value the limits of the parts do not decide. Different limits with the same label give different results, so the label itself is not a number.',
        'Itu adalah label seperti nol per nol atau tak hingga per tak hingga untuk limit yang nilainya tidak ditentukan oleh limit bagian-bagiannya. Limit berbeda dengan label yang sama memberi hasil berbeda, sehingga labelnya sendiri bukan bilangan.',
      ),
    },
    {
      q: L('Do you use the quotient rule in L’Hôpital’s Rule?', 'Apakah memakai aturan hasil bagi pada Aturan L’Hôpital?'),
      a: L(
        'No. You differentiate the numerator and the denominator separately and then divide, which gives f prime over g prime. Taking the derivative of the whole quotient is a common mistake and gives a different, wrong number.',
        'Tidak. Kamu menurunkan pembilang dan penyebut secara terpisah lalu membaginya, yang memberi f aksen per g aksen. Menurunkan seluruh hasil bagi adalah kesalahan umum dan memberi bilangan lain yang salah.',
      ),
    },
    {
      q: L('When should you stop applying L’Hôpital’s Rule?', 'Kapan berhenti menerapkan Aturan L’Hôpital?'),
      a: L(
        'Stop as soon as the quotient is no longer of the form zero over zero or infinity over infinity. Then the limit can be read directly. Applying the rule once more to a quotient that is not indeterminate gives a wrong answer.',
        'Berhentilah begitu hasil bagi tidak lagi berbentuk nol per nol atau tak hingga per tak hingga. Maka limit dapat dibaca langsung. Menerapkan aturan sekali lagi pada hasil bagi yang bukan tak tentu memberi jawaban yang salah.',
      ),
    },
    {
      q: L('How do you handle the form zero times infinity?', 'Bagaimana menangani bentuk nol kali tak hingga?'),
      a: L(
        'Rewrite the product as a quotient by moving one factor to the denominator as its reciprocal, for example x times the logarithm of x as the logarithm of x over one over x. That is infinity over infinity, and the rule applies.',
        'Tulis ulang hasil kali sebagai hasil bagi dengan memindahkan satu faktor ke penyebut sebagai kebalikannya, misalnya x kali logaritma x sebagai logaritma x per satu per x. Itu tak hingga per tak hingga, dan aturan berlaku.',
      ),
    },
    {
      q: L('How do you find a limit of the form one to the infinity?', 'Bagaimana mencari limit berbentuk satu pangkat tak hingga?'),
      a: L(
        'Take the natural logarithm of the function, which turns the power into a product and then into a quotient. Find the limit L with the rule, and the original limit is e to the power L. For example, one plus x to the 1 over x tends to e.',
        'Ambil logaritma natural fungsi, yang mengubah pangkat menjadi hasil kali lalu hasil bagi. Cari limit L dengan aturan, dan limit semula adalah e pangkat L. Misalnya, satu tambah x pangkat 1 per x menuju e.',
      ),
    },
    {
      q: L('When does L’Hôpital’s Rule fail?', 'Kapan Aturan L’Hôpital gagal?'),
      a: L(
        'When the quotient is not indeterminate, when repeated use cycles through the same kind of quotient, or when the quotient of derivatives has no limit although the original does, as for x plus sine x over x at infinity.',
        'Ketika hasil bagi bukan tak tentu, ketika pemakaian berulang berputar melalui hasil bagi sejenis, atau ketika hasil bagi turunan tidak punya limit padahal yang semula punya, seperti x tambah sinus x per x di tak hingga.',
      ),
    },
    {
      q: L('How is L’Hôpital’s Rule proved?', 'Bagaimana Aturan L’Hôpital dibuktikan?'),
      a: L(
        'With Cauchy’s Mean Value Theorem, which says that for two functions there is a point where the ratio of the derivatives equals the ratio of the changes. Applied between a and x, that point is squeezed toward a as x approaches a.',
        'Dengan Teorema Nilai Rata-rata Cauchy, yang menyatakan bahwa untuk dua fungsi ada titik tempat hasil bagi turunan sama dengan hasil bagi perubahan. Diterapkan antara a dan x, titik itu terjepit menuju a ketika x mendekati a.',
      ),
    },
    {
      q: L('Who discovered L’Hôpital’s Rule?', 'Siapa yang menemukan Aturan L’Hôpital?'),
      a: L(
        'Johann Bernoulli found it and taught it to Guillaume de l’Hôpital, who printed it in 1696 in the first textbook of the differential calculus. It is named after the author of the book, and Bernoulli’s own notes confirm it was his.',
        'Johann Bernoulli menemukannya dan mengajarkannya kepada Guillaume de l’Hôpital, yang mencetaknya pada 1696 dalam buku teks pertama kalkulus diferensial. Aturan ini dinamai menurut penulis buku itu, dan catatan Bernoulli sendiri menegaskan bahwa itu miliknya.',
      ),
    },
  ],

  references: [
    { title: "Thomas' Calculus: Early Transcendentals in SI Units (15th ed.), Section 4.5: Indeterminate Forms and L'Hôpital's Rule", author: 'Joel Hass, Christopher Heil, Maurice D. Weir et al.', year: 2023, source: 'Pearson' },
    { title: "Calculus (8th ed.), section 4.4: Indeterminate Forms and l'Hospital's Rule", author: 'James Stewart', year: 2015, source: 'Cengage Learning' },
    { title: "Analyse des infiniment petits pour l'intelligence des lignes courbes", author: "Guillaume de l'Hôpital", year: 1696, source: 'Paris' },
    { title: "Résumé des leçons données à l'École royale polytechnique sur le calcul infinitésimal", author: 'Augustin-Louis Cauchy', year: 1823, source: 'Paris' },
  ],

  related: ['the-mean-value-theorem', 'monotonic-functions-and-the-first-derivative-test', 'concavity-and-curve-sketching', 'derivatives-of-inverse-functions-and-logarithms'],
}
